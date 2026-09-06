// ============================================================
// EligibilityAI — calcule le score de diagnostic (points forts/
// faibles/recommandations) à partir des réponses de
// eligibility-questions.html.
//
// REFONTE DU 2026-08-29 — le barème suit désormais, poste par poste,
// les critères RÉELLEMENT utilisés par les grands programmes de
// bourses (Chevening, DAAD, Eiffel, MEXT, CSC, Türkiye Bursları,
// Stipendium Hungaricum, Mastercard Foundation…) :
//
//   Moyenne académique ............ 28 pts
//   Cohérence du projet ........... 12 pts  (parcours actuel → diplôme visé)
//   Langue (meilleure des deux) ... 20 pts
//   Certification de langue ........ 8 pts  (IELTS/TOEFL, DELF/TCF)
//   Âge vs cycle visé .............. 8 pts  (limites d'âge réelles par cycle)
//   Calendrier ..................... 8 pts  (les bourses ouvrent 1 fois/an)
//   Passeport ...................... 8 pts
//   Destination .................... 8 pts  (déclarée OU flexible : équivalent)
//   ------------------------------------
//   Total ........................ 100 pts
//
// Deux principes conservés des audits précédents :
//   - aucun point n'est inventé : chaque sous-score se justifie par un
//     critère observable des programmes réels, et chaque retrait de
//     points s'accompagne d'un message honnête qui l'explique ;
//   - cette classe ne choisit PAS les bourses : results.js appelle
//     recommendPrograms() (js/recommend-programs.js) sur le catalogue
//     Firestore réel. Ici : le score et sa lecture pédagogique.
//
// La sélection du diplôme VISÉ (targetLevel) remplace l'ancien usage
// du niveau ACTUEL comme critère de correspondance : un titulaire de
// licence vise un master, pas une seconde licence — l'ancien moteur
// le renvoyait pourtant vers les programmes de licence.
// ============================================================

// Seul import du fichier — module pur lui aussi, aucun réseau :
// sert à noteNationality() pour compter les bourses explicitement
// ouvertes à la nationalité quand l'appelant fournit le catalogue.
import { estEligible, isoDeNationalite } from "./js/eligibility-countries.js";

// Refonte du 2026-09-05 : le niveau d'études n'est plus une chaîne
// figée parmi cinq, c'est une PISTE. Reconnaître le niveau par
// mots-clés (pisteDepuisNiveau) plutôt que par égalité stricte permet
// aux anciennes réponses — celles encore en sessionStorage, et celles
// des profils déjà enregistrés — de continuer à être comprises.
import { pisteDepuisNiveau, cycleViseEffectif, PISTES } from "./js/eligibility-pistes.js";

// Table de conversion vers un pourcentage 0-100 commun, pour comparer
// équitablement des moyennes saisies dans des systèmes différents avant
// d'appliquer les mêmes seuils de score. Approximations documentées,
// pas des équivalences officielles (aucune table universelle n'existe) :
// - "20" (système francophone, /20) : pourcentage = (valeur/20)*100
// - "100" (/100) ou "other" (autre système, déjà exprimé en %) : valeur
//   inchangée
// - "gpa4" (GPA nord-américain /4) : conversion linéaire — la
//   correspondance réelle GPA↔% varie selon les établissements
// - "letters" (lettres A-F) : valeur médiane indicative par lettre
// Par défaut (scale absent ou inconnu) : traité comme /20, pour rester
// compatible avec les réponses enregistrées avant le sélecteur d'échelle.
const LETTER_GRADE_PERCENT = { A: 95, B: 85, C: 75, D: 65, F: 40 };

export function normalizeAverageToPercent(rawValue, scale) {

if (scale === "letters") {
const letter = String(rawValue || "").trim().toUpperCase();
return Object.prototype.hasOwnProperty.call(LETTER_GRADE_PERCENT, letter) ? LETTER_GRADE_PERCENT[letter] : null;
}

const value = parseFloat(String(rawValue || "").replace(",", "."));

if (isNaN(value)) return null;

switch (scale) {

case "100":
case "other":
return Math.max(0, Math.min(100, value));

case "gpa4":
return Math.max(0, Math.min(100, (value / 4) * 100));

case "20":
default:
return Math.max(0, Math.min(100, (value / 20) * 100));

}

}

// Tier de points pour un niveau de langue déclaré — mêmes libellés pour
// "english" et "french" (questions.js). Export conservé tel quel :
// details.js:computeCompatibility() s'en sert aussi.
export function languageLevelScore(level) {

const value = (level || "").toLowerCase();

if (value.includes("courant") || value.includes("bilingue") || value.includes("maternelle")) return 20;
if (value.includes("bon")) return 16;
if (value.includes("intermédiaire")) return 10;
if (value.includes("débutant")) return 4;

return 0;
}

// ==========================================================
// ÉCHELLE DES CYCLES — sert à la cohérence parcours → objectif.
// currentLevel (questions.js) → rang du PROCHAIN cycle naturel.
// ==========================================================
const CYCLE_NATUREL_PAR_PISTE = {
[PISTES.LYCEE]: "Licence (Bachelor)",
[PISTES.BAC_OBTENU]: "Licence (Bachelor)",
[PISTES.LICENCE_EN_COURS]: "Licence (Bachelor)",
[PISTES.LICENCE_OBTENUE]: "Master",
[PISTES.MASTER_EN_COURS]: "Master",
[PISTES.MASTER_OBTENU]: "Doctorat (PhD)",
[PISTES.DOCTORAT_EN_COURS]: "Doctorat (PhD)",
[PISTES.DOCTORAT_OBTENU]: "Doctorat (PhD)"
};

const LEVEL_RANK = {
"Licence (Bachelor)": 1,
"Master": 2,
"Doctorat (PhD)": 3
};

// Rang du cycle le plus AVANCÉ qu'un parcours actuel permet de viser
// directement (un bachelier ne peut pas candidater à un doctorat).
const RANG_MAX_PAR_PISTE = {
[PISTES.LYCEE]: 1,
[PISTES.BAC_OBTENU]: 1,
[PISTES.LICENCE_EN_COURS]: 2,
[PISTES.LICENCE_OBTENUE]: 2,
[PISTES.MASTER_EN_COURS]: 3,
[PISTES.MASTER_OBTENU]: 3,
[PISTES.DOCTORAT_EN_COURS]: 3,
[PISTES.DOCTORAT_OBTENU]: 3
};

// Le niveau actuel dit en trois mots, pour les phrases du diagnostic :
// « au lycée ou tout juste bachelier → licence (bachelor) » se lisait
// mal, « le lycée → une licence » se lit.
const LIBELLE_COURT_PISTE = {
[PISTES.LYCEE]: "le lycée",
[PISTES.BAC_OBTENU]: "un baccalauréat obtenu",
[PISTES.LICENCE_EN_COURS]: "une licence en cours",
[PISTES.LICENCE_OBTENUE]: "une licence obtenue",
[PISTES.MASTER_EN_COURS]: "un master en cours",
[PISTES.MASTER_OBTENU]: "un master obtenu",
[PISTES.DOCTORAT_EN_COURS]: "un doctorat en cours",
[PISTES.DOCTORAT_OBTENU]: "un doctorat soutenu"
};

function cycleNaturel(niveauActuel) {
return CYCLE_NATUREL_PAR_PISTE[pisteDepuisNiveau(niveauActuel)] || "";
}

function rangMaximal(niveauActuel) {
return RANG_MAX_PAR_PISTE[pisteDepuisNiveau(niveauActuel)] || 0;
}

function libelleCourt(niveauActuel) {
return LIBELLE_COURT_PISTE[pisteDepuisNiveau(niveauActuel)] || String(niveauActuel || "").toLowerCase();
}

// Cycle visé effectif : la réponse explicite, ou — si l'étudiant a
// répondu « Je ne sais pas encore » — le prochain cycle naturel déduit
// de son parcours. Exportée : results.js s'en sert pour construire le
// profil transmis au moteur de recommandation.
export function resolveTargetLevel(responses) {

// cycleViseEffectif couvre le cas où la question a été SAUTÉE parce
// qu'un seul cycle était possible (un bachelier ne peut viser qu'une
// licence) — depuis la refonte du 2026-09-05, elle n'est plus posée
// dans ce cas.
const effectif = cycleViseEffectif(responses);

if (effectif && effectif !== "Je ne sais pas encore") return effectif;

return cycleNaturel(responses.currentLevel);

}

// ============================================================
// LES BARÈMES, UN PAR CYCLE — refonte du 2026-09-05
//
// Un barème unique traitait un bachelier et un docteur avec la même
// grille. Or les comités ne pèsent pas les mêmes choses :
//
//  - EN LICENCE, l'âge est le critère le plus discriminant du
//    catalogue (Türkiye Bursları < 21 ans, MEXT ≤ 24, CSC < 25) et la
//    filière du secondaire est le premier point de cohérence regardé.
//    Ni expérience professionnelle ni projet de recherche : les
//    demander reviendrait à reprocher à un lycéen de ne pas être un
//    cadre.
//  - EN MASTER, l'expérience professionnelle devient éliminatoire
//    pour une partie des programmes (Chevening : 2 800 heures,
//    vérifié le 2026-09-05) et l'ordre admission → bourse commande le
//    calendrier.
//  - EN DOCTORAT, tout se joue sur le projet de recherche et sur
//    l'existence d'un laboratoire d'accueil ; la moyenne compte
//    beaucoup moins.
//
// Chaque colonne totalise 100. Un critère absent d'un cycle n'est ni
// compté ni affiché — c'est ce qui rend la décomposition lisible :
// l'étudiant ne voit à l'écran que des axes qui le concernent.
// ============================================================

const POIDS = {

"Licence (Bachelor)": {
moyenne: 30, filiere: 10, age: 12, langue: 20,
certification: 8, calendrier: 8, passeport: 6, destination: 6
},

Master: {
moyenne: 24, experience: 16, admission: 10, progression: 8,
langue: 18, certification: 8, calendrier: 8, passeport: 4, destination: 4
},

"Doctorat (PhD)": {
recherche: 22, encadrement: 16, moyenne: 16, publications: 8,
langue: 16, certification: 6, calendrier: 8, passeport: 4, destination: 4
}

};

// Barème de repli, utilisé tant que le cycle visé n'est pas connu :
// l'ancien barème du 2026-08-29, inchangé.
const POIDS_PAR_DEFAUT = {
moyenne: 28, progression: 12, langue: 20, certification: 8,
age: 8, calendrier: 8, passeport: 8, destination: 8
};

function poidsDuCycle(cycle) {
return POIDS[cycle] || POIDS_PAR_DEFAUT;
}

export class EligibilityAI {

constructor(responses) {
this.responses = responses;
}

// `scholarships` (facultatif) : les documents "scholarships" déjà
// chargés par l'appelant (results.js) — permet à noteNationality()
// de calculer sa phrase sur le catalogue réel. Sans lui, analyze()
// reste 100 % synchrone et hors réseau, comme depuis toujours.
analyze(scholarships) {

const result = {
score: 0,
strengths: [],
weaknesses: [],
recommendations: []
};

const poids = poidsDuCycle(resolveTargetLevel(this.responses));

// Chaque critère renvoie ses points sur SON ancien maximum ; on le
// ramène à une proportion, puis on applique le poids du cycle. Un
// même questionnaire, trois barèmes — parce que les comités ne
// regardent pas la même chose selon le diplôme.
const criteres = [
{ cle: "moyenne", label: "Niveau académique", icon: "graduation-cap", ratio: this.calculateAverage(result) / 28, conseil: "Mettez en avant vos meilleurs résultats et complétez votre dossier avec des projets ou certificats qui pèsent autant qu'une moyenne." },
{ cle: "progression", label: "Cohérence du projet", icon: "route", ratio: this.calculateProgression(result) / 12, conseil: "Un projet cohérent se raconte : dites explicitement pourquoi ce cycle, dans ce domaine, maintenant. C'est la première question d'un jury." },
{ cle: "langue", label: "Langue", icon: "languages", ratio: this.calculateLanguage(result) / 20, conseil: "Un test certifié (IELTS, TOEFL, DELF, TCF) fait progresser cette ligne plus vite qu'un niveau auto-déclaré." },
{ cle: "certification", label: "Certification de langue", icon: "file-check", ratio: this.calculateCertification(result) / 8, conseil: "Inscrivez-vous à une session officielle dès maintenant : entre l'inscription, l'examen et le résultat, comptez plusieurs semaines." },
{ cle: "age", label: "Âge et limites d'âge", icon: "calendar", ratio: this.calculateAge(result) / 8, conseil: "Les limites d'âge ne se négocient pas : concentrez-vous sur les programmes qui n'en fixent aucune — chaque fiche du catalogue l'indique." },
{ cle: "calendrier", label: "Calendrier", icon: "hourglass", ratio: this.calculateTimeline(result) / 8, conseil: "Fixer une période de départ, même approximative, permet de viser les bonnes sessions de candidature." },
{ cle: "passeport", label: "Documents", icon: "id-card", ratio: this.calculatePassport(result) / 8, conseil: "Le passeport est le premier document demandé par tous les portails, et le plus long à obtenir. Lancez la démarche avant tout le reste." },
{ cle: "destination", label: "Destination", icon: "globe-2", ratio: this.calculateDestination(result) / 8, conseil: "Ouvrir la destination multiplie les options, la fixer concentre les efforts. Choisissez — et assumez le choix dans votre lettre." },
{ cle: "filiere", label: "Filière et domaine visé", icon: "compass", ratio: this.calculateFiliere(result), conseil: "Reliez explicitement votre filière au domaine visé dans votre lettre de motivation : c'est la première cohérence qu'un comité vérifie." },
{ cle: "experience", label: "Expérience professionnelle", icon: "briefcase", ratio: this.calculateExperience(result), conseil: "Comptez vos heures précisément, stages rémunérés compris. En dessous de deux ans, visez d'abord les bourses qui n'exigent aucune expérience — elles sont nombreuses." },
{ cle: "admission", label: "Candidatures universitaires", icon: "send", ratio: this.calculateAdmission(result), conseil: "Déposez vos candidatures universitaires en premier : plusieurs bourses ne financent qu'un étudiant déjà admis, et l'inverse ne marche pas." },
{ cle: "recherche", label: "Projet de recherche", icon: "file-text", ratio: this.calculateRecherche(result), conseil: "Écrivez votre projet, même en trois pages : sans document, aucun directeur de recherche ne peut vous répondre." },
{ cle: "encadrement", label: "Encadrement de thèse", icon: "users", ratio: this.calculateEncadrement(result), conseil: "Écrivez à trois chercheurs dont vous avez lu les travaux, projet en pièce jointe. Une réponse écrite, même brève, suffit aux dossiers." },
{ cle: "publications", label: "Publications", icon: "book-marked", ratio: this.calculatePublications(result), conseil: "Une communication en séminaire ou un article court ouvrent déjà cette ligne. Ce n'est presque jamais exigé — c'est ce qui départage." }
];

result.breakdown = [];

for (const critere of criteres) {

const p = poids[critere.cle] || 0;

// Un critère sans poids pour ce cycle n'est ni compté ni affiché :
// montrer « Projet de recherche 0 % » à un bachelier serait un
// reproche absurde.
if (!p) continue;

const ratio = Math.max(0, Math.min(1, Number(critere.ratio) || 0));

result.score += ratio * p;

result.breakdown.push({
label: critere.label,
icon: critere.icon,
value: Math.round(ratio * 100),
poids: p,
// Le conseil voyage AVEC sa ligne : results.js n'a plus à
// retrouver un texte par le libellé, et un critère qui n'existe
// que pour un cycle emporte forcément le sien.
conseil: critere.conseil || ""
});

}

result.score = Math.round(result.score);

// La décomposition est classée du plus lourd au plus léger : ce que
// l'étudiant lit en premier est ce qui pèse le plus sur son dossier.
result.breakdown.sort((a, b) => b.poids - a.poids);

this.noteField(result);
this.noteNationality(result, scholarships);

return result;

}

// ==========================================================
// LES CRITÈRES PROPRES AUX CYCLES (refonte du 2026-09-05)
//
// Ils renvoient une PROPORTION (0 à 1), pas des points : c'est le
// poids du cycle qui décide de ce qu'ils valent. Chacun ne s'applique
// qu'aux cycles où l'exigence existe réellement — voir POIDS.
// ==========================================================

// Cohérence entre la filière du secondaire et le domaine visé. Sans
// filière déclarée, on ne juge pas : 0,7 est une valeur neutre, ni
// récompense ni sanction.
calculateFiliere(result) {

const filiere = String(this.responses.secondaryTrackOther || this.responses.secondaryTrack || "");

if (!filiere) return 0.7;

if (filiere.toLowerCase().includes("autre")) return 0.7;

result.strengths.push(`Filière ${filiere.toLowerCase()} au secondaire : un point de repère concret pour les comités, qui vérifient la continuité entre le parcours et le domaine demandé.`);

return 1;

}

// Fait VÉRIFIÉ le 2026-09-05 sur chevening.org : « at least two
// years' work experience, acquired after completing your
// undergraduate degree, equivalent to 2,800 hours ». C'est un seuil
// éliminatoire, pas un bonus — d'où la marche nette à deux ans.
calculateExperience(result) {

const exp = String(this.responses.workExperience || "").toLowerCase();

if (!exp) return 0.6;

if (exp.includes("plus de 5")) {
result.strengths.push("Plus de cinq ans d'expérience professionnelle : vous dépassez le seuil de toutes les bourses qui en exigent une.");
return 1;
}

if (exp.includes("2 à 5")) {
result.strengths.push("Deux à cinq ans d'expérience professionnelle : vous franchissez le seuil des 2 800 heures exigées par Chevening, et celui de la plupart des programmes comparables.");
return 1;
}

if (exp.includes("1 à 2")) {
result.recommendations.push("Entre un et deux ans d'expérience : vous êtes à la limite du seuil de Chevening (2 800 heures, environ deux ans). Comptez précisément vos heures avant de candidater — stages rémunérés inclus.");
return 0.65;
}

if (exp.includes("moins d'un an")) {
result.weaknesses.push("Moins d'un an d'expérience professionnelle : les bourses qui en exigent deux vous sont fermées cette année. Elles ne le seront plus dans un an.");
return 0.35;
}

result.weaknesses.push("Aucune expérience professionnelle déclarée : une partie des bourses de master en font un critère éliminatoire, indépendamment de vos notes.");

return 0.15;

}

// Plusieurs bourses ne financent qu'un étudiant DÉJÀ admis : l'ordre
// des démarches en dépend entièrement.
calculateAdmission(result) {

const adm = String(this.responses.admissionStatus || "").toLowerCase();

if (!adm) return 0.6;

if (adm.includes("déjà une admission")) {
result.strengths.push("Vous avez déjà une admission : vous êtes éligible aux bourses qui exigent une offre avant de financer, ce qui écarte beaucoup de candidats.");
return 1;
}

if (adm.includes("déposée")) {
result.strengths.push("Vos candidatures universitaires sont déposées : vous avez pris l'ordre des démarches dans le bon sens.");
return 0.8;
}

if (adm.includes("prépare")) {
result.recommendations.push("Vos dossiers universitaires sont en préparation : terminez-les d'abord. Plusieurs bourses demandent une admission — sans elle, la candidature à la bourse est irrecevable.");
return 0.5;
}

result.weaknesses.push("Aucune candidature universitaire engagée : commencez par l'admission. La bourse vient après, et certaines l'exigent noir sur blanc.");

return 0.2;

}

// La pièce maîtresse d'un dossier de doctorat.
calculateRecherche(result) {

const projet = String(this.responses.researchProject || "").toLowerCase();

// Pas de question posée (doctorant déjà inscrit) : le sujet existe.
if (!projet) return 0.9;

if (projet.includes("rédigé")) {
result.strengths.push("Projet de recherche rédigé et abouti : c'est la pièce qu'un comité de doctorat lit en premier, et la vôtre est prête.");
return 1;
}

if (projet.includes("idée précise")) {
result.recommendations.push("Votre sujet est clair mais pas encore rédigé : mettez-le par écrit avant tout le reste — c'est ce document qui décide de l'accueil d'un laboratoire.");
return 0.65;
}

if (projet.includes("domaine")) {
result.weaknesses.push("Un domaine sans sujet précis ne suffit pas pour un doctorat : aucun directeur ne s'engage sur une intention.");
return 0.35;
}

result.weaknesses.push("Sans projet de recherche, un dossier de doctorat n'a pas d'objet : c'est par là qu'il faut commencer, avant même de choisir un pays.");

return 0.15;

}

calculateEncadrement(result) {

const dir = String(this.responses.supervisorContact || "").toLowerCase();

if (!dir) return 0.6;

if (dir.includes("accord écrit")) {
result.strengths.push("Un accord écrit d'un directeur ou d'un laboratoire : c'est ce qui transforme un projet en candidature recevable.");
return 1;
}

if (dir.includes("contact en cours")) {
result.recommendations.push("Un contact est engagé avec un encadrant : obtenez une réponse ÉCRITE, même brève. C'est elle que les dossiers demandent, pas la conversation.");
return 0.7;
}

result.weaknesses.push("Sans directeur de thèse ni laboratoire d'accueil, votre dossier n'a pas de destinataire : c'est le premier verrou à lever, avant les échéances.");

return 0.25;

}

calculatePublications(result) {

const pub = String(this.responses.publications || "").toLowerCase();

if (!pub) return 0.5;

if (pub.includes("plusieurs")) {
result.strengths.push("Plusieurs publications ou communications : à dossier égal, c'est ce qui départage.");
return 1;
}

if (pub.includes("une fois")) return 0.7;

// Ne JAMAIS présenter l'absence de publication comme un frein : ce
// n'est presque jamais exigé avant le doctorat, et le dire
// découragerait à tort.
return 0.4;

}

calculateAverage(result) {

const percent = normalizeAverageToPercent(this.responses.average, this.responses.averageScale);

if (percent === null) {
result.weaknesses.push("Votre moyenne n'a pas pu être analysée.");
return 0;
}

// Seuils relatifs identiques aux audits précédents (18/16/14/12/10
// en /20), plafond ramené de 30 à 28 pour faire place aux nouveaux
// critères objectifs (certification, âge, calendrier).
if (percent >= 90) {
result.strengths.push("Excellent dossier académique — le niveau attendu par les bourses d'excellence (Eiffel, Chevening…).");
return 28;
}

if (percent >= 80) {
result.strengths.push("Très bonne moyenne générale, compétitive pour la plupart des programmes financés.");
return 25;
}

if (percent >= 70) {
result.strengths.push("Bon niveau académique.");
return 22;
}

if (percent >= 60) {
result.weaknesses.push("Une meilleure moyenne élargirait l'éventail des bourses accessibles — beaucoup fixent un seuil implicite autour de 14/20.");
return 17;
}

if (percent >= 50) {
result.weaknesses.push("Renforcez vos résultats : la moyenne est le premier filtre de la plupart des comités de sélection.");
return 11;
}

result.weaknesses.push("Votre moyenne est actuellement le principal frein de votre dossier.");
return 5;
}

// ==========================================================
// COHÉRENCE DU PROJET — parcours actuel → diplôme visé (12 pts).
// C'est le critère n°1 de toute bourse : chaque programme finance un
// cycle précis, et exige le diplôme du cycle précédent.
// ==========================================================
calculateProgression(result) {

const current = this.responses.currentLevel;
const target = this.responses.targetLevel;

if (!current) return 6;

// Pas encore de cycle visé : Fitz propose le prochain cycle naturel.
if (!target || target === "Je ne sais pas encore") {

const natural = cycleNaturel(current);

if (natural) {
result.recommendations.push(`D'après votre parcours (${libelleCourt(current)}), le cycle naturel à viser est : ${natural}.`);
}

return 8;

}

const targetRank = LEVEL_RANK[target];
const maxRank = rangMaximal(current);

if (!targetRank || !maxRank) return 6;

// Saut de cycle impossible (ex. bac → doctorat) : dit honnêtement,
// avec l'étape intermédiaire à franchir.
if (targetRank > maxRank) {

const step = targetRank === 3 ? "un master" : "une licence";

result.weaknesses.push(`Un ${target.toLowerCase()} exige d'abord ${step} : les bourses de ce cycle demanderont le diplôme du cycle précédent. Visez d'abord ${step}, Fitz vous y aidera.`);

return 4;

}

// Retour à un cycle déjà validé (ex. master → licence) : légitime
// (réorientation), mais les bourses de 1er cycle pour un second
// diplôme sont rares — signalé, pas sanctionné lourdement.
if (targetRank < maxRank - 0) {

const naturalNext = cycleNaturel(current);

if (naturalNext && LEVEL_RANK[naturalNext] > targetRank) {
result.recommendations.push(`Vous visez ${target.toLowerCase()} alors que votre parcours ouvre déjà ${naturalNext.toLowerCase()} : c'est possible (réorientation), mais les bourses financent rarement un second diplôme du même cycle.`);
return 8;
}

}

result.strengths.push(`Projet cohérent : ${libelleCourt(current)} → ${target.toLowerCase()}, la progression attendue par les comités de sélection.`);

return 12;

}

// 20 pts — meilleure des deux langues, barème historique conservé.
calculateLanguage(result) {

const englishScore = languageLevelScore(this.responses.english);
const frenchScore = languageLevelScore(this.responses.french);
const bestScore = Math.max(englishScore, frenchScore);
const bestIsFrench = frenchScore > englishScore;

if (bestScore >= 20) {
result.strengths.push(bestIsFrench ? "Excellent niveau de français." : "Excellent niveau d'anglais.");
} else if (bestScore >= 16) {
result.strengths.push(bestIsFrench ? "Bon niveau de français." : "Bon niveau d'anglais.");
} else if (bestScore >= 10) {
result.weaknesses.push(bestIsFrench ? "Renforcez votre français pour accéder à plus de bourses." : "Renforcez votre anglais pour accéder à plus de bourses.");
} else if (bestScore >= 4) {
result.weaknesses.push("La langue d'enseignement est votre principal axe d'amélioration.");
}

if (englishScore >= 16 && frenchScore >= 16) {
result.strengths.push("À l'aise en anglais comme en français : un vrai atout pour élargir vos destinations possibles.");
}

return bestScore;
}

// ==========================================================
// CERTIFICATION DE LANGUE (8 pts) — critère d'admissibilité concret :
// la quasi-totalité des bourses financées exige une preuve officielle
// (IELTS/TOEFL, DELF/DALF/TCF), et un niveau auto-déclaré ne la
// remplace jamais dans un dossier.
// ==========================================================
calculateCertification(result) {

const cert = String(this.responses.langCert || "").toLowerCase();

if (!cert) return 4;

if (cert.includes("deux")) {
result.strengths.push("Certifications officielles dans les deux langues : votre niveau est prouvable immédiatement, dans tout dossier.");
return 8;
}

if (cert.includes("anglais") || cert.includes("français")) {
result.strengths.push("Certification de langue officielle déjà en poche — un prérequis réglé que beaucoup de candidats découvrent trop tard.");
return 8;
}

// « Pas encore » : pas bloquant, mais un vrai poste du plan d'action,
// avec des délais concrets (inscription au test, résultats).
result.weaknesses.push("Aucune certification de langue pour l'instant : prévoyez un test officiel (IELTS, TOEFL, DELF ou TCF) — les sessions et les résultats prennent plusieurs semaines.");

return 2;

}

// ==========================================================
// ÂGE vs CYCLE VISÉ (8 pts) — plusieurs bourses officielles fixent des
// limites d'âge par cycle : MEXT licence ≤ 24 ans, Türkiye Bursları
// < 21 en licence / < 30 en master / < 35 en doctorat, CSC < 25 en
// licence / < 35 en master / < 40 en doctorat. On ne code PAS ces
// seuils par bourse (le catalogue n'a pas encore ce champ) : on évalue
// honnêtement la marge de la tranche déclarée pour le cycle visé.
// ==========================================================
calculateAge(result) {

const bracket = this.responses.ageBracket || "";
const target = resolveTargetLevel(this.responses);
const rank = LEVEL_RANK[target] || 0;

if (!bracket) return 5;

const young = bracket.startsWith("Moins") || bracket.startsWith("18");
const late20s = bracket.startsWith("25");
const early30s = bracket.startsWith("30");
const over35 = bracket.startsWith("35");

// Licence : le cycle le plus contraint (Türkiye < 21, MEXT ≤ 24, CSC < 25).
if (rank === 1) {
if (young) return 8;
if (late20s) {
result.recommendations.push("Certaines bourses de licence fixent des limites d'âge basses (Türkiye Bursları < 21 ans, MEXT ≤ 24 ans) : vérifiez ce critère en priorité sur chaque fiche.");
return 6;
}
result.weaknesses.push("Au-delà de 29 ans, plusieurs grandes bourses de licence ferment leurs candidatures — concentrez-vous sur celles sans limite d'âge, Fitz les identifiera.");
return 4;
}

// Master : limites usuelles entre 30 et 35 ans.
if (rank === 2) {
if (young || late20s) return 8;
if (early30s) {
result.recommendations.push("Autour de 30-34 ans, quelques bourses de master appliquent une limite d'âge (Türkiye Bursları < 30, CSC < 35) — d'autres, comme Chevening, n'en ont aucune.");
return 7;
}
result.recommendations.push("À 35 ans et plus, privilégiez les bourses de master sans limite d'âge (Chevening, la plupart des programmes européens).");
return 5;
}

// Doctorat : le cycle le plus ouvert.
if (rank === 3) {
if (over35) {
result.recommendations.push("La plupart des bourses de doctorat restent ouvertes après 35 ans (limite CSC : 40 ans) — l'âge n'est pas un frein majeur à ce cycle.");
return 6;
}
return 8;
}

return 7;

}

// ==========================================================
// CALENDRIER (8 pts) — les grandes bourses nationales ouvrent une fois
// par an, souvent 8 à 12 mois avant la rentrée : la fenêtre de tir
// est un critère objectif, pas une préférence.
// ==========================================================
calculateTimeline(result) {

const timeline = this.responses.timeline || "";

if (timeline.includes("D'ici 1 an")) {
result.strengths.push("Départ visé d'ici un an : la fenêtre idéale, celle où s'ouvrent les candidatures des grandes bourses annuelles.");
return 8;
}

if (timeline.includes("6 prochains")) {
result.recommendations.push("À moins de 6 mois du départ, priorisez les programmes dont les candidatures sont encore ouvertes — le statut est affiché sur chaque fiche du catalogue.");
return 6;
}

if (timeline.includes("plus d'un an")) {
result.strengths.push("Plus d'un an devant vous : le temps de préparer certifications et dossier sans précipitation.");
return 7;
}

result.recommendations.push("Fixer une période de départ, même approximative, permet de cibler les bonnes échéances de candidature.");

return 4;

}

calculatePassport(result) {

const passport = (this.responses.passport || "").toLowerCase();

if (passport.includes("valide")) {
result.strengths.push("Vous possédez déjà un passeport valide.");
return 8;
}

if (passport.includes("cours")) {
result.weaknesses.push("Terminez rapidement votre demande de passeport.");
return 6;
}

if (passport.includes("expir")) {
result.weaknesses.push("Renouvelez votre passeport — vérifiez aussi qu'il restera valide 6 mois après votre arrivée, une exigence fréquente des visas étudiants.");
return 4;
}

if (passport.includes("pas encore") || passport.includes("aucun")) {
result.weaknesses.push("Obtenir un passeport sera une étape indispensable — les délais se comptent souvent en mois, lancez la démarche dès maintenant.");
return 2;
}

return 0;
}

// 8 pts dans les deux cas — une destination déclarée n'est ni mieux ni
// moins bien qu'un profil ouvert : la première concentre les efforts,
// le second multiplie les options. Le score ne doit pas pénaliser un
// choix qui n'a rien d'un critère d'éligibilité.
calculateDestination(result) {

const country = this.responses.destinationCountry;

if (country && country !== "Je ne sais pas encore") {
result.strengths.push(`Destination déjà identifiée : ${country}.`);
return 8;
}

result.recommendations.push("Profil ouvert sur la destination : Fitz vous proposera les pays où votre dossier est le plus compétitif.");

return 8;

}

noteField(result) {

if (this.responses.studyCategory) {
result.strengths.push(`Domaine d'études identifié : ${this.responses.studyCategory}.`);
}

}

// Contexte, pas un score : l'éligibilité par nationalité est un FILTRE
// (js/recommend-programs.js écarte les bourses fermées), jamais des
// points. Depuis le 2026-08-30 le catalogue porte de vraies
// restrictions (champ eligibility, lot admin/expand-catalog-batch20) :
// quand l'appelant fournit les bourses chargées, la phrase est
// CALCULÉE sur le catalogue réel — N ne compte que les bourses
// explicitement ouvertes (estEligible === true), c'est-à-dire, depuis
// le lot 24 : liste/groupe contenant la nationalité, OU scope:"monde"
// (affirmation d'ouverture posée par l'auteur du lot). Seules les
// bourses sans information (champ absent, note seule) restent des
// inconnues (null) et ne comptent ni comme ouvertes ni comme fermées —
// voir la règle des trois valeurs dans js/eligibility-countries.js.
noteNationality(result, scholarships) {

const nationality = this.responses.nationality;
const country = this.responses.country;

if (!nationality) return;

if (Array.isArray(scholarships) && scholarships.length && isoDeNationalite(nationality)) {

const ouvertes = scholarships.filter((s) => estEligible(s.eligibility, nationality) === true).length;

if (ouvertes > 0) {
result.strengths.push(`Votre nationalité vous ouvre explicitement ${ouvertes} des ${scholarships.length} bourses du catalogue.`);
return;
}

}

if (country && nationality !== country) {
result.strengths.push(`Nationalité ${nationality}, distincte de votre pays de résidence (${country}) — Fitz recherche aussi les bourses ouvertes à votre nationalité.`);
}

}

// Raisons GÉNÉRIQUES de correspondance — conservées comme filet quand
// une opportunité n'a pas de raisons propres. Depuis la refonte du
// 2026-08-29, results.js affiche d'abord les raisons PAR PROGRAMME
// calculées par explainMatch() (js/recommend-programs.js) à partir des
// données réelles du catalogue : niveau du programme, langue
// d'enseignement, statut des candidatures, financement.
matchReasons() {

const reasons = [];

const target = resolveTargetLevel(this.responses);

if (target) {
reasons.push(`Cycle visé : ${target}`);
}

const percent = normalizeAverageToPercent(this.responses.average, this.responses.averageScale);

if (percent !== null && percent >= 60) {
reasons.push("Moyenne académique suffisante pour la majorité des programmes");
}

const englishScore = languageLevelScore(this.responses.english);
const frenchScore = languageLevelScore(this.responses.french);

if (englishScore >= 16 || frenchScore >= 16) {
reasons.push(
frenchScore > englishScore
? "Niveau de français compatible avec un enseignement francophone"
: "Niveau d'anglais compatible avec un enseignement en anglais"
);
}

if (!reasons.length) {
reasons.push("Profil compatible avec les critères généraux de ce programme.");
}

return reasons;

}

}
