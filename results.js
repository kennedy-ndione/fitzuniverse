// -------- results.js --------
// Calcule et affiche un résultat réel à partir des réponses laissées
// par l'utilisateur sur eligibility-questions.html (sessionStorage).
// Le score global (académique, langue, documents...) vient de
// EligibilityAI (eligibility-ai.js) — inchangé, synchrone, aucune
// donnée externe. Les opportunités concrètes (nom d'université, bourse,
// deadline) viennent en revanche du vrai catalogue Firestore, via
// recommendPrograms() (js/recommend-programs.js) — la même jointure
// programs/universities/scholarships déjà utilisée par applications.js,
// jamais une 2e façon de résoudre bourse↔université (audit du
// 2026-08-14, remplace l'ancien calculateDestination() qui ne
// reconnaissait que 4 pays codés en dur).
//
// Devient nécessairement asynchrone (comme chargerUniversite() dans
// details.js) : impossible d'afficher les vraies opportunités avant
// d'avoir attendu la lecture Firestore. Un état de chargement dédié
// (#resultsLoading) reste visible jusque-là.
//
// Audit du 2026-08-22 ("nos questions orientent-elles vraiment tout
// étudiant, de tout pays et de tout cycle ?") : buildProfileFromResponses()
// transmet désormais desiredField/fundingGoal/nationality en plus du
// niveau d'études et de la destination — trois réponses collectées par
// le test mais jusqu'ici jamais lues par recommendPrograms(). Le
// français rejoint l'anglais dans "languages" et dans la ligne "Langue"
// de buildScoreBreakdown() (levelFromLanguages, meilleur des deux). La
// réponse "motivation" personnalise désormais buildNarrative().
//
// Refonte de la présentation (2026-08-22, retour utilisateur) : le
// score et chaque ligne de sa décomposition sont désormais colorés
// vert / ambre / rouge selon leur valeur, au lieu du bleu de marque
// uniforme qui rendait un 31/100 visuellement identique à un 92/100.
// Ce fichier ne décide RIEN de cette couleur : il pose une classe de
// ton d'après scoreTier()/toneForValue() (js/fitz-voice.js), et
// results.css la traduit en couleurs. Toutes les phrases de Fitz sont
// sorties d'ici vers ce même fichier de voix — ce module affiche, il
// ne rédige plus.
//
// Refonte du questionnaire (2026-08-29) : les réponses portent désormais
// currentLevel (5 paliers) et targetLevel (cycle VISÉ) au lieu de
// l'ancien studyLevel unique. buildProfileFromResponses() transmet
// targetLevel (résolu par resolveTargetLevel(), eligibility-ai.js) à
// recommendPrograms() — le bonus de niveau va enfin au cycle que
// l'étudiant veut intégrer, plus jamais à celui qu'il vient de terminer.
// Chaque carte d'opportunité affiche désormais SES raisons propres
// (pick.reasons, js/recommend-programs.js:explainMatch) au lieu des
// mêmes raisons génériques dupliquées sous les 6 cartes ; matchReasons()
// reste le repli quand un programme n'a aucune raison spécifique.

import { EligibilityAI, normalizeAverageToPercent, resolveTargetLevel } from "./eligibility-ai.js";
import { retenirOpportunites } from "./js/recommend-programs.js";

// Reconnaissance du niveau d'études par mots-clés — voir l'en-tête de
// js/eligibility-pistes.js. Sert ici à l'échelle de « potentiel » et,
// à terme, au barème par cycle.
import { pisteDepuisNiveau, PISTES, genreDepuisReponse } from "./js/eligibility-pistes.js";
import { resolveCityImage } from "./js/scholarship-image.js";

// Champ lexical de Fitz (js/fitz-voice.js) : ce fichier ne rédige plus
// aucune phrase de Fitz lui-même — il ne fait que les afficher. Voir la
// section CHAMP LEXICAL de fitz-voice.js pour la raison (deux registres
// coexistaient pour un même personnage, et rien n'était transmissible
// au futur moteur d'IA).
import {
scoreTier,
toneForValue,
IMPROVEMENT_TIPS,
ETATS_VIDES
} from "./js/fitz-voice.js";

// Chargeur de catalogue partagé et mémoïsé — voir js/catalog-data.js.
import { chargerCatalogue } from "./js/catalog-data.js";
import { formaterDate } from "./js/echeance.js";

// Lecture personnalisée du diagnostic par Fitz. Appelée APRÈS le rendu,
// jamais avant : la page doit être lisible tout de suite, l'analyse
// arrive quelques secondes plus tard dans son propre bloc.
import { afficherAnalyseFitz } from "./js/ai/diagnostic-fitz.js";

// Classe CSS correspondant à un ton (js/fitz-voice.js) — voir la
// section "TONS D'ÉTAT" de results.css. Passer par cette fonction
// plutôt que par une concaténation `is-${tone}` garde la liste des
// classes réellement existantes visible en un seul endroit.
const TONE_CLASS = {
positive: "is-positive",
moyen: "is-moyen",
faible: "is-faible"
};

function applyTone(element, tone) {

if (!element) return;

element.classList.remove("is-positive", "is-moyen", "is-faible");

if (TONE_CLASS[tone]) element.classList.add(TONE_CLASS[tone]);

}

const rawResponses = sessionStorage.getItem("eligibilityResponses");

if (!rawResponses) window.location.replace("eligibility-test.html");

// ⚠️ LE DÉMARRAGE EST EN BAS DE CE FICHIER, PAS ICI — et ce n'est pas
// un détail de style.
//
// Bug attrapé en production le 2026-09-05 :
// « Cannot access 'PALIER_MS' before initialization ». main() était
// appelé à cet endroit, c'est-à-dire AVANT que le module ait fini de
// s'évaluer. Or main() s'exécute de façon synchrone jusqu'à son
// premier await, et il touche au passage des `const` déclarées plus
// bas — qui sont alors dans leur zone morte temporelle. Le catalogue
// paraissait vide, la page annonçait « aucune opportunité » et la
// réflexion s'arrêtait à la première étape : trois symptômes pour une
// seule cause, invisible aux tests unitaires (ils n'évaluent pas la
// page).
//
// Démarrer en fin de module garantit que tout ce que main() peut
// lire existe déjà. Ne pas ramener cet appel ici.

// ==========================================================
// PROFIL — traduit les réponses du diagnostic gratuit dans le même
// format que profile.js (profil Firestore persistant), pour que
// recommendPrograms()/scoreProgram() n'aient besoin d'aucune variante :
// même fonction, deux sources de profil différentes selon le contexte
// (session anonyme ici, profil connecté dans applications.js).
// ==========================================================
function buildProfileFromResponses(responses) {

return {
// Cycle VISÉ (refonte 2026-08-29) : resolveTargetLevel() renvoie le
// choix explicite de l'étudiant (question targetLevel) ou, s'il a
// répondu "Je ne sais pas encore", le prochain cycle naturel dérivé de
// son niveau actuel. C'est CE niveau que scoreProgram() compare à
// program.level — voir js/recommend-programs.js.
targetLevel: resolveTargetLevel(responses),
// lastDegree conservé en repli (ancien contrat de scoreProgram) —
// responses.studyLevel n'existe plus que pour d'anciennes sessions
// dont le sessionStorage date d'avant la refonte.
lastDegree: responses.currentLevel || responses.studyLevel || "",
preferredCountries: responses.destinationCountry && responses.destinationCountry !== "Je ne sais pas encore"
? [responses.destinationCountry]
: [],
// scoreProgram() ne vérifie que la présence d'une langue dans
// program.language — un niveau "Débutant" ne mérite pas le bonus de
// compatibilité linguistique. "Français" ajoutée (audit 2026-08-22,
// voir la question "french" dans questions.js) : jusqu'ici un
// programme enseigné en français ne pouvait jamais recevoir ce bonus,
// même pour un étudiant francophone confirmé.
languages: [
...(responses.english && responses.english !== "Débutant" ? ["Anglais"] : []),
...(responses.french && responses.french !== "Débutant" ? ["Français"] : [])
],
// Finitions (2026-09-21) : le niveau déclaré, pour que les raisons ne
// disent « une langue que vous maîtrisez » qu'à partir de « Bon niveau »
// (js/recommend-programs.js, niveauDEtudes).
niveauxDeLangue: {
anglais: responses.english || "",
français: responses.french || ""
},
// desiredField/fundingGoal (audit 2026-08-22) : scoreProgram() ne
// lisait jusqu'ici ni le domaine d'études ni la préférence de
// financement — deux réponses collectées par le test mais silencieuses
// sur les résultats réels. Voir js/recommend-programs.js.
desiredField: responses.studyCategory || "",
fundingGoal: responses.goal || "",
// nationality : consommée depuis le 2026-08-30 par scoreProgram()
// (js/recommend-programs.js), qui écarte toute bourse dont la
// restriction officielle exclut cette nationalité (champ eligibility
// des bourses, posé par admin/expand-catalog-batch20).
nationality: responses.nationality || "",
// Lot 108 (2026-09-26) : le pays de RÉSIDENCE, pour écarter les bourses
// qu'on ne demande qu'une fois sur place (accesDepuisLeProfil).
country: responses.country || "",
// ageBracket : la tranche d'âge du diagnostic (questions.js) servait
// déjà au score (calculateAge, eligibility-ai.js) mais n'atteignait
// pas le moteur — depuis le branchement des limites d'âge
// (2026-08-30), ageMatch() (js/recommend-programs.js) écarte toute
// bourse dont le plafond `ageMax` est dépassé par la tranche ENTIÈRE
// (une tranche à cheval sur la limite ne tranche pas : règle des
// trois valeurs, js/age-limits.js).
ageBracket: responses.ageBracket || "",
// Lot DÉPART (2026-09-21) : le palier et l'ancienneté du diplôme, pour
// les bourses réservées aux bacheliers de l'année (anneeBacMin,
// js/recommend-programs.js:fenetreBacMatch).
palier: responses.piste || "",
diplomaWhen: responses.diplomaWhen || "",
// Lot 112 (2026-09-26) : le genre (bourses réservées aux femmes, limites
// d'âge qui en dépendent) et la tranche d'expérience professionnelle
// (DAAD-EPOS, Chevening, Banque mondiale…), lus par accesDepuisLeProfil
// et ageMatch (js/recommend-programs.js). « Je préfère ne pas répondre »
// donne "" : un inconnu, qui n'écarte rien.
gender: genreDepuisReponse(responses.gender),
experienceProTranche: responses.workExperience || ""
};

}

// ==========================================================
// CHARGEMENT DU CATALOGUE + RECOMMANDATIONS RÉELLES
// ==========================================================
// ==========================================================
// CE QUE FITZ RETIENT
// ==========================================================
//
// TROIS cartes détaillées, pas six. Décision de Charles le
// 2026-09-05 : le chiffre annoncé dit l'ampleur du travail, les trois
// dossiers analysés en profondeur en donnent la preuve. Douze cartes
// génériques prouvent moins que trois lectures argumentées.
const OPPORTUNITES_DETAILLEES = 3;

// Le catalogue entier est parcouru — c'est retenirOpportunites()
// (js/recommend-programs.js) qui décide de ce qui CORRESPOND, sur des
// critères que les organismes appliquent vraiment : cycle visé,
// langue praticable, échéance non passée, nationalité, âge. Voir son
// en-tête pour le détail et pour l'histoire du « 154 opportunités ».
async function loadRealOpportunities(responses, journal) {

const catalogue = await chargerCatalogue();

if (journal) journal.catalogueCharge(catalogue);

const universitiesById = new Map(catalogue.universites.map((u) => [u.id, u]));
const scholarshipsById = new Map(catalogue.bourses.map((s) => [s.id, s]));

const profile = buildProfileFromResponses(responses);

const selection = retenirOpportunites({
profile,
programs: catalogue.programmes,
universitiesById,
scholarshipsById
});

// Repli seulement : chaque opportunité porte SES raisons propres
// (explainMatch). Les raisons génériques du profil ne servent que si
// une opportunité retenue n'a aucune correspondance nommable.
const fallbackReasons = new EligibilityAI(responses).matchReasons();

const enrichir = (pick) => {

const university = universitiesById.get(pick.universityId) || {};

return {
name: pick.scholarshipTitle || `Programme à ${pick.universityName}`,
// Refonte 2026-09-23 : la carte mène à la fiche (scholarship-details
// prend l'identifiant du PROGRAMME), et le verdict compte à part les
// opportunités qui portent une vraie bourse.
programId: pick.programId || "",
boursee: !!pick.scholarshipTitle,
university: pick.universityName,
country: pick.country || "",
deadline: pick.deadline,
jours: pick.jours,
echeanceOuverte: pick.echeanceOuverte,
porte: pick.porte || null,
// resolveCityImage() plutôt que le fichier d'origine : la vignette
// de 44 px chargeait sinon l'image pleine taille (jusqu'à 2,6 Mo).
photo: resolveCityImage(university.image),
flag: university.flag || "default.svg",
reasons: (Array.isArray(pick.reasons) && pick.reasons.length) ? pick.reasons : fallbackReasons
};

};

const toutes = selection.retenues.map(enrichir);

// Les destinations viennent de TOUTES les retenues, pas des trois
// affichées : un étudiant compatible avec neuf pays n'a aucune raison
// de n'en voir que trois.
const eligibleCountries = [...new Set(toutes.map((o) => o.country).filter(Boolean))];

if (!eligibleCountries.length && responses.destinationCountry && responses.destinationCountry !== "Je ne sais pas encore") {
eligibleCountries.push(responses.destinationCountry);
}

return {
scholarshipDetails: toutes.slice(0, OPPORTUNITES_DETAILLEES),
toutesRetenues: toutes,
// ⚠️ Ne PAS retirer de cette liste sans vérifier qui la lit :
// buildNarrative() lit `eligibleCountries.length` sans garde, et son
// oubli ici a laissé la page bloquée sur l'écran de réflexion en
// production le 2026-09-05. Un test le vérifie désormais.
eligibleCountries,
nombreRetenu: selection.nombre,
echeancesOuvertes: selection.ouvertes,
paysCouverts: selection.pays,
scholarships: [...scholarshipsById.values()],
tailleCatalogue: {
bourses: catalogue.bourses.length,
programmes: catalogue.programmes.length,
universites: catalogue.universites.length
}
};

}

// ==========================================================
// LA RÉFLEXION DE FITZ
// ==========================================================
//
// Cinq étapes, affichées à mesure qu'elles se terminent VRAIMENT, avec
// les vrais nombres du calcul. Sept secondes environ au total.
//
// Pourquoi un plancher de temps, alors que le calcul est quasi
// instantané ? Parce qu'un diagnostic qui apparaît en 300 ms après
// cinq minutes de questions donne l'impression que rien n'a été
// regardé. Mais un simple sablier de quinze secondes serait du décor,
// et le décor se paie tôt ou tard : ici chaque palier affiche une
// grandeur RÉELLE — le nombre de bourses parcourues, le nombre
// d'opportunités retenues, le nombre d'échéances encore ouvertes. Si
// le calcul prend plus longtemps que le palier, c'est le calcul qui
// commande ; jamais l'inverse.
//
// Choix de Charles le 2026-09-05 : 12–18 s plutôt que les 20–30 s
// envisagées d'abord — au-delà de vingt secondes, on perd des gens sur
// un téléphone et une connexion lente.
//
// RÉDUIT À 6–8 s le 2026-09-23, à la demande de Charles, avec la page
// de résultats en pyramide inversée : l'étudiant vient chercher SA
// liste, et quinze secondes d'attente, c'est le moment où un lecteur
// pressé ferme l'onglet. On garde la preuve (chaque étape affiche un
// vrai nombre) mais on la montre vite : cinq étapes au lieu de six
// (nationalité, âge et cycle en une seule), 1,1 à 1,7 s chacune — le
// temps de lire une ligne. Le chiffre qui compte, « N opportunités
// retenues », reste le plus longtemps à l'écran.
// Total des paliers : 1100 + 1400 + 1300 + 1700 + 1300 = 6,8 s.
// test/resultats-lecture.test.mjs le vérifie (entre 6 et 8 s).

const PALIER_MS = {
lecture: 1100,
parcours: 1400,
verification: 1300,
retenues: 1700,
analyse: 1300
};

function attendre(ms) {
return new Promise((resolve) => setTimeout(resolve, ms));
}

function creerJournalReflexion(responses) {

const liste = document.getElementById("reflexionSteps");

let mesures = {};

// Une fois Lucide passé, le <i data-lucide> est devenu un <svg> : on
// ne peut plus changer l'icône en modifiant l'attribut. On remplace
// donc l'élément entier, puis on redemande le rendu — même piège que
// renderIcon() dans eligibility-questions.js.
function cocher(li) {

if (!li || li.classList.contains("is-done")) return;

li.classList.remove("is-current");
li.classList.add("is-done");

const icone = li.querySelector("i, svg");

if (icone) {
const remplacante = document.createElement("i");
remplacante.setAttribute("data-lucide", "check");
icone.replaceWith(remplacante);
}

if (window.lucide) window.lucide.createIcons();

}

function poser(texte) {

if (!liste) return;

// L'étape précédente passe en « faite » : la coche n'apparaît que
// lorsque le travail est réellement derrière nous.
cocher(liste.lastElementChild);

const li = document.createElement("li");
li.className = "reflexion-step is-current";
li.innerHTML = `<i data-lucide="loader"></i><span></span>`;
li.querySelector("span").textContent = texte;

liste.appendChild(li);

if (window.lucide) window.lucide.createIcons();

}

function terminer() {
if (!liste) return;
cocher(liste.lastElementChild);
}

return {
mesures,
catalogueCharge(catalogue) {
mesures.bourses = catalogue.bourses.length;
mesures.programmes = catalogue.programmes.length;
},
poser,
terminer
};

}

async function jouerReflexion(journal, responses, travail) {

const nbReponses = Object.keys(responses).filter((k) => !k.endsWith("Scale") && k !== "piste").length;

journal.poser(`Lecture de vos ${nbReponses} réponses`);

// Le catalogue est chargé PENDANT ce premier palier : le temps
// d'attente sert à quelque chose au lieu d'être ajouté au reste.
const [catalogue] = await Promise.all([travail, attendre(PALIER_MS.lecture)]);

const m = journal.mesures;

journal.poser(`Parcours de ${m.bourses || catalogue.tailleCatalogue.bourses} bourses et ${m.programmes || catalogue.tailleCatalogue.programmes} programmes`);
await attendre(PALIER_MS.parcours);

journal.poser("Vérification de votre nationalité, de votre âge et du cycle visé");
await attendre(PALIER_MS.verification);

const ouvertes = catalogue.echeancesOuvertes;

journal.poser(
ouvertes > 0
? `${catalogue.nombreRetenu} opportunités retenues, dont ${ouvertes} aux candidatures encore ouvertes`
: `${catalogue.nombreRetenu} opportunités retenues dans ${catalogue.paysCouverts} pays`
);
await attendre(PALIER_MS.retenues);

journal.poser(`Analyse approfondie des ${Math.min(OPPORTUNITES_DETAILLEES, catalogue.nombreRetenu)} dossiers les plus proches`);
await attendre(PALIER_MS.analyse);

journal.terminer();

return catalogue;

}

// ==========================================================
// ÉTAT DE CHARGEMENT
// ==========================================================
function setLoading(isLoading) {

const loading = document.getElementById("resultsLoading");
const content = document.getElementById("resultsContent");

if (loading) loading.hidden = !isLoading;
if (content) content.hidden = isLoading;

}

async function main(responses) {

setLoading(true);

const journal = creerJournalReflexion(responses);

let catalogue = null;

try {

// Le travail réel démarre TOUT DE SUITE ; la chorégraphie ne fait
// que l'accompagner. Si le réseau traîne, c'est lui qui donne le
// tempo — les paliers ne raccourcissent jamais le calcul.
catalogue = await jouerReflexion(journal, responses, loadRealOpportunities(responses, journal));

} catch (error) {

console.error("Erreur Firestore (catalogue) :", error);

}

// Le catalogue est chargé AVANT analyze() : noteNationality() s'en
// sert pour une phrase calculée sur les vraies restrictions. En cas
// d'échec réseau, analyze() tourne sans catalogue — le score n'en
// dépend pas.
const result = new EligibilityAI(responses).analyze(catalogue ? catalogue.scholarships : null);

const score = Math.max(0, Math.min(100, Math.round(result.score)));

if (catalogue) {

result.scholarshipDetails = catalogue.scholarshipDetails;
result.toutesRetenues = catalogue.toutesRetenues;
result.eligibleScholarships = catalogue.scholarshipDetails.map((s) => s.name);
result.eligibleCountries = catalogue.eligibleCountries;
result.nombreRetenu = catalogue.nombreRetenu;
result.echeancesOuvertes = catalogue.echeancesOuvertes;
result.paysCouverts = catalogue.paysCouverts;
result.tailleCatalogue = catalogue.tailleCatalogue;

} else {

result.scholarshipDetails = [];
result.toutesRetenues = [];
result.eligibleScholarships = [];
result.eligibleCountries = [];
result.nombreRetenu = 0;
result.echeancesOuvertes = 0;
result.paysCouverts = 0;

}

// Conservé : plusieurs endroits de la page lisent encore ce nom.
result.totalCompatible = result.nombreRetenu;

render(responses, result, score);

setLoading(false);

}


function render(responses, result, score) {

// ==========================================================
// LA RÉPONSE — ce que l'étudiant est venu chercher (2026-09-23)
// ==========================================================
//
// Remplace le récit d'ouverture (quatre phrases génériques : « Votre
// parcours présente déjà plusieurs éléments favorables »…). Charles :
// l'étudiant « veut juste savoir les bourses, universités et pays qui
// lui sont compatibles ». Il le lit donc en premier, en chiffres, et
// en un seul écran.
function renderVerdict() {

const toutes = result.toutesRetenues || [];
const n = toutes.length;
const bourses = toutes.filter((o) => o.boursee).length;
const universites = new Set(toutes.map((o) => o.university).filter(Boolean)).size;
const pays = (result.eligibleCountries || []).length;
const ouvertes = result.echeancesOuvertes || 0;
const pluriel = (k, mot, mots) => `${k} ${k > 1 ? mots : mot}`;

const titre = document.getElementById("verdictTitre");
const sous = document.getElementById("verdictSous");
const chiffres = document.getElementById("verdictChiffres");
const voir = document.getElementById("verdictVoir");

if (!n) {
titre.textContent = "Aucune opportunité ne correspond encore à votre profil";
sous.textContent = "Ce n'est pas une impasse : Fitz vous dit plus bas ce qui élargirait l'éventail.";
chiffres.hidden = true;
if (voir) {
voir.setAttribute("href", "#avisFitz");
voir.querySelector("span").textContent = "Voir ce qui bloque";
}
return;
}

titre.textContent = `${pluriel(n, "opportunité correspond", "opportunités correspondent")} à votre profil`;

const domaine = valeurAffichable(responses.studyCategory);
const cycle = valeurAffichable(resolveTargetLevel(responses));
const contexte = [domaine, cycle ? `niveau ${cycle}` : ""].filter(Boolean).join(", ");
sous.textContent = [
contexte ? `${contexte.charAt(0).toUpperCase()}${contexte.slice(1)}.` : "",
ouvertes ? `${pluriel(ouvertes, "a ses candidatures ouvertes", "ont leurs candidatures ouvertes")} aujourd'hui.` : "Candidatures à surveiller : les dates sont sur chaque fiche."
].filter(Boolean).join(" ");

const tuiles = [
{ nombre: bourses, libelle: bourses > 1 ? "bourses" : "bourse", icone: "award" },
{ nombre: universites, libelle: universites > 1 ? "universités" : "université", icone: "landmark" },
{ nombre: pays, libelle: "pays", icone: "globe-2" }
];

chiffres.replaceChildren(...tuiles.map((t) => {
const li = document.createElement("li");
li.className = "verdict-chiffre";
li.innerHTML = `<i data-lucide="${t.icone}" aria-hidden="true"></i><strong></strong><span></span>`;
li.querySelector("strong").textContent = String(t.nombre);
li.querySelector("span").textContent = t.libelle;
return li;
}));

}

/** « Je ne sais pas encore » n'est pas une valeur à afficher. */
function valeurAffichable(v) {
const t = String(v || "").trim();
return !t || t.toLowerCase().startsWith("je ne sais pas") ? "" : t;
}

// ==========================================================
// SCORE — présenté comme un indicateur, pas un verdict
// ==========================================================

// Libellé, message ET ton viennent du même palier (scoreTier,
// js/fitz-voice.js) : avant, les seuils étaient réécrits ici en deux
// cascades de if parallèles — un seuil modifié dans l'une et pas dans
// l'autre suffisait à afficher "Profil solide" avec le message d'un
// profil à préparer.
function renderScore() {

const tier = scoreTier(score);

document.getElementById("score").textContent = score;
document.getElementById("profileMessage").textContent = tier.message;
document.getElementById("scoreTier").textContent = tier.label;

// La pastille du verdict et le titre du bloc replié disent le score en
// une ligne : le détail n'est ouvert que par qui le demande.
const indice = document.getElementById("scoreDetailIndice");
if (indice) indice.textContent = `${score}/100 · ${tier.label}`;
const pastille = document.getElementById("verdictScore");
if (pastille) {
pastille.innerHTML = `<strong></strong><span></span><i data-lucide="chevron-down" aria-hidden="true"></i>`;
pastille.querySelector("strong").textContent = `${score}/100`;
pastille.querySelector("span").textContent = tier.label;
applyTone(pastille, tier.tone);
}

// Le ton est posé sur la SECTION, pas sur l'anneau : la pastille du
// palier et le chiffre, qui vivent dans la colonne de droite, lisent
// les mêmes variables --tone-* (voir results.css).
applyTone(document.getElementById("scoreSection"), tier.tone);

const ring = document.getElementById("scoreRing");

// Deux temps volontaires : la valeur est posée sur un frame séparé
// pour que la transition CSS de stroke-dashoffset ait un état de
// départ (0) à animer. Sans ce décalage, l'anneau apparaîtrait déjà
// rempli — la valeur initiale et la valeur finale seraient appliquées
// dans le même frame.
ring.style.setProperty("--score-percent", 0);

requestAnimationFrame(() => {
requestAnimationFrame(() => {
ring.style.setProperty("--score-percent", score);
});
});

}

// ==========================================================
// DÉCOMPOSITION DU SCORE — lecture pédagogique, pas un second
// calcul : chaque catégorie est dérivée directement des réponses
// déjà fournies par l'utilisateur (aucune donnée inventée), pour
// expliquer visuellement ce qui compose le score produit par
// EligibilityAI. Le score global affiché plus haut reste celui de
// EligibilityAI ; ce détail ne le recalcule jamais.
// ==========================================================

// Refonte du 2026-09-05 : indexée sur la PISTE et non sur le libellé
// exact. Les libellés du questionnaire ont changé (six paliers au lieu
// de cinq) et d'anciennes sessions portent encore les précédents —
// pisteDepuisNiveau() reconnaît les deux générations par mots-clés.
// Une table d'égalité stricte aurait silencieusement renvoyé tout le
// monde sur la valeur par défaut (55), c'est-à-dire le même
// « potentiel » pour un lycéen et un doctorant.
function levelFromCurrentLevel(responses) {

const echelle = {
[PISTES.LYCEE]: 55,
[PISTES.BAC_OBTENU]: 62,
[PISTES.LICENCE_EN_COURS]: 70,
[PISTES.LICENCE_OBTENUE]: 80,
[PISTES.MASTER_EN_COURS]: 86,
[PISTES.MASTER_OBTENU]: 92,
[PISTES.DOCTORAT_EN_COURS]: 94,
[PISTES.DOCTORAT_OBTENU]: 96
};

const piste = pisteDepuisNiveau(responses.currentLevel || responses.studyLevel);

return echelle[piste] || 55;

}

// Remplace l'ancien levelFromEnglish (audit 2026-08-22, ajout de la
// question "french") : prend le meilleur des deux tiers plutôt que de
// ne lire que l'anglais, même principe que calculateLanguage() dans
// eligibility-ai.js. Les libellés "Courant / Bilingue" (english) et
// "Courant / Langue maternelle" (french) partagent le même palier 100 —
// ce sont les deux formulations d'un niveau natif/bilingue pour chaque
// langue, voir questions.js.
function languageTierScore(level) {

const scale = {
"Débutant": 25,
"Intermédiaire": 55,
"Bon niveau": 80,
"Courant / Bilingue": 100,
"Courant / Langue maternelle": 100
};

return scale[level] || 0;

}

function levelFromLanguages(responses) {

const best = Math.max(languageTierScore(responses.english), languageTierScore(responses.french));

const base = best || 40;

// Certification officielle (question "langCert", refonte 2026-08-29) :
// un test reconnu (IELTS, TOEFL, DELF, TCF…) est une exigence
// documentaire de la plupart des bourses — il rehausse la ligne Langue
// sans jamais dépasser 100. Même esprit que calculateCertification()
// dans eligibility-ai.js, sans recalculer le score global.
const hasCert = responses.langCert && responses.langCert !== "Pas encore";

return hasCert ? Math.min(100, base + 10) : base;

}

function levelFromPassport(passport) {

const scale = {
"Passeport valide": 100,
"Passeport en cours de demande": 60,
"Passeport expiré": 40,
"Je n'ai pas encore de passeport": 20
};

return scale[passport] || 30;

}

function levelFromTimeline(timeline) {

const scale = {
"Dans les 6 prochains mois": 90,
"D'ici 1 an": 70,
"Dans plus d'un an": 50,
"Je ne sais pas encore": 30
};

return scale[timeline] || 40;

}

/**
* La décomposition AFFICHÉE.
*
* Depuis le 2026-09-05 elle vient du barème lui-même
* (EligibilityAI.analyze → result.breakdown) : les axes dépendent du
* cycle visé, leurs poids aussi, et le score global EST leur somme
* pondérée. Auparavant, cette page recalculait cinq axes de son côté —
* deux calculs indépendants qui pouvaient diverger sans que rien ne le
* signale, et cinq axes identiques pour un bachelier et un doctorant.
*
* buildScoreBreakdownLegacy() reste le filet : il sert si le moteur
* n'a rien produit (session dont le sessionStorage date d'avant).
*/
function decomposition() {

return (result && Array.isArray(result.breakdown) && result.breakdown.length)
? result.breakdown
: buildScoreBreakdownLegacy();

}

function buildScoreBreakdownLegacy() {

const percent = normalizeAverageToPercent(responses.average, responses.averageScale);
const academicFromGrades = percent === null ? null : Math.round(percent);

return [
{
label: "Niveau académique",
icon: "graduation-cap",
value: academicFromGrades !== null
? Math.round((academicFromGrades + levelFromCurrentLevel(responses)) / 2)
: levelFromCurrentLevel(responses)
},
{ label: "Langue", icon: "languages", value: levelFromLanguages(responses) },
{ label: "Formation", icon: "book-open", value: levelFromCurrentLevel(responses) },
{ label: "Documents", icon: "file-text", value: levelFromPassport(responses.passport) },
{ label: "Préparation", icon: "hourglass", value: levelFromTimeline(responses.timeline) }
];

}

function renderScoreBreakdown() {

const container = document.getElementById("scoreBreakdown");

if (!container) return;

const breakdown = decomposition();

container.innerHTML = "";

breakdown.forEach((row) => {

const item = document.createElement("div");
item.className = "score-breakdown-row";

// Chaque ligne est colorée d'après SA propre valeur, pas d'après le
// score global : sur un même diagnostic, "Langue 100%" s'affiche en
// vert pendant que "Formation 60%" s'affiche en ambre. C'est ce qui
// rend la décomposition lisible d'un coup d'œil (retour utilisateur
// du 2026-08-22 sur "le trait progressif").
applyTone(item, toneForValue(row.value));

item.innerHTML = `
<span class="score-breakdown-label"><span class="score-breakdown-icon"><i data-lucide="${row.icon}"></i></span>${row.label}</span>
<span class="score-breakdown-bar"><span></span></span>
<span class="score-breakdown-pct">${row.value}%</span>
`;

container.appendChild(item);

// Largeur posée après insertion, pour la même raison que
// --score-percent dans renderScore() : appliquée dans l'attribut
// style du gabarit, la barre naîtrait déjà pleine et la transition
// CSS n'aurait rien à animer.
const fill = item.querySelector(".score-breakdown-bar span");

requestAnimationFrame(() => {
requestAnimationFrame(() => {
fill.style.width = `${row.value}%`;
});
});

});

renderImprovementReveal(breakdown);

}

// ==========================================================
// AMÉLIORATION — l'axe le plus faible est offert, les suivants
// sont un aperçu de ce que l'accompagnement débloque. Dérivé
// entièrement de la décomposition ci-dessus, aucun appel au
// moteur EligibilityAI.
// ==========================================================

function renderImprovementReveal(breakdown) {

const freeContainer = document.getElementById("improvementFree");
const locked = document.getElementById("recoLocked");
const lockedCount = document.getElementById("recoLockedCount");

if (!freeContainer || !locked) return;

const sorted = [...breakdown].sort((a, b) => a.value - b.value);
const [weakest, ...rest] = sorted;

// Le panneau prend le ton de l'axe qu'il désigne : un point faible à
// 60% se présente en ambre, à 25% en rouge. Il porte donc la même
// couleur que sa ligne dans la décomposition juste au-dessus, ce qui
// fait le lien entre les deux sans avoir à l'expliquer.
applyTone(freeContainer, toneForValue(weakest.value));
// Lu par le rendu de l'avis de Fitz : si Fitz parle déjà de cet axe
// dans « Votre frein », cette carte ferait doublon (vu en production le
// 2026-09-23 : « Votre frein : aucune certification de langue » suivi
// de « Votre priorité : Certification de langue »).
freeContainer.dataset.axe = weakest.label;

freeContainer.innerHTML = `
<i class="improvement-free-icon" data-lucide="${weakest.icon}"></i>
<div class="improvement-free-copy">
<strong>Votre priorité : ${weakest.label} (${weakest.value} %)</strong>
<p>${weakest.conseil || IMPROVEMENT_TIPS[weakest.label] || ""}</p>
</div>
`;

if (rest.length) {

// Lot S3 : « verrouillée » retiré — cette page est publique, et on
// n'annonce pas à un visiteur ce qu'on lui refuse (voir le commentaire
// de #recoLocked dans results.html). La phrase dit maintenant ce que
// l'accompagnement COUVRE, pas ce qu'il retient. Le chiffre, lui, est
// le même : les axes du score autres que le point faible déjà donné.
lockedCount.textContent = `Les ${rest.length} autre${rest.length > 1 ? "s" : ""} catégorie${rest.length > 1 ? "s" : ""} de votre score, une par une`;
locked.hidden = false;

} else {

locked.hidden = true;

}

}

// ==========================================================
// LISTES — points forts, axes de progression, recommandations
// ==========================================================

function fillList(id, items, emptyText, icon) {

const list = document.getElementById(id);

list.innerHTML = "";

if (!items.length) {

const li = document.createElement("li");
li.textContent = emptyText;
li.classList.add("empty");
list.appendChild(li);

return;

}

items.forEach((item) => {

const li = document.createElement("li");

li.innerHTML = `<i data-lucide="${icon}"></i><span></span>`;
li.querySelector("span").textContent = item;

list.appendChild(li);

});

}

function renderCountries() {

const list = document.getElementById("countries");
list.innerHTML = "";

if (!result.eligibleCountries.length) {

const li = document.createElement("li");
li.className = "empty";
li.textContent = ETATS_VIDES.countries;
list.appendChild(li);

return;

}

// Refonte 2026-09-23 : chaque pays dit COMBIEN d'opportunités il
// porte — « Canada 2 » oriente d'un coup d'œil, une liste de noms non.
const parPays = new Map();
(result.toutesRetenues || []).forEach((o) => {
if (o.country) parPays.set(o.country, (parPays.get(o.country) || 0) + 1);
});

result.eligibleCountries.forEach((country) => {

const li = document.createElement("li");
li.className = "country-pill";
li.innerHTML = `<i data-lucide="map-pin"></i><span></span>`;
li.querySelector("span").textContent = country;

const nombre = parPays.get(country);
if (nombre) {
const compte = document.createElement("span");
compte.className = "country-pill-compte";
compte.textContent = String(nombre);
compte.setAttribute("aria-label", `${nombre} opportunité${nombre > 1 ? "s" : ""}`);
li.appendChild(compte);
}

list.appendChild(li);

});

}

// ==========================================================
// OPPORTUNITÉS — avec leur justification
// ==========================================================

function renderOpportunitiesSubtext() {

const legende = document.getElementById("opportunitiesSubtext");

if (!legende) return;

const retenu = result.nombreRetenu || 0;
const ouvertes = result.echeancesOuvertes || 0;
const affichees = (result.scholarshipDetails || []).length;

// ⚠️ CE QUE CETTE PHRASE NE DOIT PLUS DIRE (correctif du 2026-09-05)
//
// Elle annonçait « votre profil correspond à 154 opportunités ». 154
// parce que le moteur gardait tout ce qui n'était pas explicitement
// exclu — sur 155 universités, le chiffre était mécanique et trois
// profils différents donnaient trois fois le même. Un chiffre qui ne
// bouge jamais prouve à l'étudiant que rien n'a été calculé pour lui.
//
// Elle dit maintenant ce que Fitz a RETENU : le résultat d'un filtre
// (cycle visé, langue praticable, échéance non passée, nationalité,
// âge), plafonné à douze. Le nombre varie réellement d'un profil à
// l'autre — mesuré entre 4 et 12 sur le catalogue du 2026-09-05.
//
// « Retenu » n'est pas « il n'existe que » : la formulation reste
// vraie quel que soit le nombre de correspondances du catalogue.
if (!retenu) {
legende.textContent = "Aucune opportunité du catalogue ne correspond encore à ce profil : soit le cycle visé n'y est pas encore couvert, soit les candidatures de cette année sont closes. Les points ci-dessous indiquent ce qui élargirait l'éventail.";
return;
}

// Refonte 2026-09-23 : une ligne. Les chiffres sont déjà dans le
// verdict, en haut de page ; ici, on dit seulement comment lire.
const titre = document.getElementById("opportunitesTitre");
if (titre) titre.textContent = affichees > 1 ? `Vos ${affichees} meilleures opportunités` : "Votre meilleure opportunité";

legende.textContent = affichees > 1
? "De la plus pertinente à la moins pertinente. Touchez une carte pour ouvrir la fiche complète."
: "Touchez la carte pour ouvrir la fiche complète.";

// LES AUTRES RETENUES, NOMMÉES (décision de Charles, 2026-09-23).
// Avant : « + 9 autres opportunités… » sans un seul nom — une promesse,
// pas une réponse. Maintenant : leur NOM, leur université, leur pays et
// leur échéance, chacune menant à sa fiche. Rien de plus : ni « Pourquoi
// vous », ni analyse, ni stratégie — c'est le travail de
// l'accompagnement. Ces noms sont publics dans le catalogue : les taire
// ne protégeait rien, les montrer prouve que la liste existe. Aucun
// cadenas, aucun flou (doctrine du 2026-08-31).
const suite = document.getElementById("opportunitesSuite");
if (suite) {
const autres = (result.toutesRetenues || []).slice(affichees);
if (autres.length) {
const n = autres.length;
suite.innerHTML = `
<p class="opportunites-suite-titre"><strong></strong> <span></span></p>
<ul class="autres-opportunites"></ul>
<div class="opportunites-suite-pied">
<p class="opportunites-suite-note" id="opportunitesSuiteNote"></p>
<a href="offers.html?parcours=bourse" class="btn btn-secondary" id="opportunitesSuiteLien"><span>Préparer mes dossiers avec Fitz</span><i data-lucide="arrow-right"></i></a>
</div>`;
suite.querySelector(".opportunites-suite-titre strong").textContent = `Et ${n} autre${n > 1 ? "s" : ""} opportunité${n > 1 ? "s" : ""}`;
suite.querySelector(".opportunites-suite-titre span").textContent = `retenue${n > 1 ? "s" : ""} pour vous`;
suite.querySelector(".autres-opportunites").replaceChildren(...autres.map(ligneAutreOpportunite));
suite.querySelector(".opportunites-suite-note").textContent = NOTE_SUITE.gratuit;
// Un compte accompagné les a déjà dans son espace. adapterAuCompte()
// peut passer avant OU après ce rendu : il pose data-hub-espace, lu ici,
// et corrige aussi le lien s'il arrive après.
const hub = document.body.dataset.hubEspace;
if (hub) {
const lienSuite = suite.querySelector("#opportunitesSuiteLien");
lienSuite.setAttribute("href", hub);
lienSuite.querySelector("span").textContent = "Les voir dans mon espace";
suite.querySelector(".opportunites-suite-note").textContent = NOTE_SUITE.accompagne;
}
suite.hidden = false;
} else {
suite.hidden = true;
}
}

}

const NOTE_SUITE = {
gratuit: "Pourquoi chacune vous correspond, et comment monter chaque dossier : Fitz vous le détaille dans votre plan d'accompagnement.",
accompagne: "Fitz les suit déjà dans votre espace, avec vos démarches pour chacune."
};

/**
* Une ligne de la liste des autres opportunités : le nom, l'université
* et le pays, l'échéance en jours. Pas de raison, pas d'analyse.
*/
function ligneAutreOpportunite(o) {

const li = document.createElement("li");
li.className = "autre-opportunite";

const conteneur = document.createElement(o.programId ? "a" : "div");
conteneur.className = "autre-opportunite-lien";
if (o.programId) conteneur.href = `scholarship-details.html?id=${encodeURIComponent(o.programId)}`;

const drapeau = document.createElement("img");
drapeau.className = "autre-opportunite-drapeau";
drapeau.src = `assets/flags/${o.flag || "default.svg"}`;
drapeau.alt = "";
drapeau.width = 22;
drapeau.height = 16;
drapeau.loading = "lazy";
drapeau.onerror = () => { drapeau.onerror = null; drapeau.src = "assets/flags/default.svg"; };

const texte = document.createElement("span");
texte.className = "autre-opportunite-texte";
const nom = document.createElement("strong");
nom.textContent = o.name;
const lieu = document.createElement("span");
// Le PAYS d'abord : c'est la question que l'étudiant se pose, et sur
// un téléphone la fin de la ligne est coupée.
lieu.textContent = [o.country, o.university].filter(Boolean).join(" · ");
texte.append(nom, lieu);

const e = echeanceCourte(o);
const echeance = document.createElement("span");
echeance.className = `autre-opportunite-echeance${e.urgente ? " is-urgente" : ""}`;
echeance.textContent = e.texte;
echeance.setAttribute("aria-label", e.lu);
echeance.title = e.lu;

conteneur.append(drapeau, texte, echeance);
li.appendChild(conteneur);
return li;

}

/**
* L'échéance en un mot, pour une ligne de liste : « 16 jours », en rouge
* sous 30 jours. Même règle que les cartes : quand une étape obligatoire
* tombe avant la date limite (la nomination Pearson), c'est elle qui
* compte. Sans date exploitable, on dit POURQUOI plutôt qu'un « à
* confirmer » partout : mesuré le 2026-09-23, 7 lignes sur 9 n'avaient
* pas de date, et la plupart n'en ont PAS par nature (candidature au fil
* de l'eau, bourse attribuée avec l'admission, date propre à chaque
* université). La fiche l'explique en entier.
*/
const SANS_DATE_FIXE = /aucune date|pas de date|ne donne aucune date|n'est publi[ée]e|pas de candidature s[ée]par[ée]e|d[ée]pend de l'universit[ée]|fil de l'eau/i;

function echeanceCourte(o) {
if (o.echeanceOuverte === true) {
const etape = o.porte && typeof o.porte.jours === "number";
const n = etape ? o.porte.jours : o.jours;
if (typeof n === "number") {
if (n === 0) return { texte: "Aujourd'hui", urgente: true, lu: etape ? "Première étape : c'est aujourd'hui" : "Dernier jour pour candidater" };
const jours = `${n} jour${n > 1 ? "s" : ""}`;
return { texte: jours, urgente: n <= 30, lu: etape ? `Première étape dans ${jours}` : `Il vous reste ${jours} pour candidater` };
}
return { texte: "Ouverte", urgente: false, lu: "Candidatures ouvertes, sans date limite fixe" };
}
if (SANS_DATE_FIXE.test(o.deadline || "")) {
return { texte: "Sans date fixe", urgente: false, lu: "Pas de date limite unique : la fiche explique quand candidater" };
}
return { texte: "À confirmer", urgente: false, lu: "Échéance à confirmer sur le portail officiel" };
}

function renderOpportunities() {

const wrapper = document.getElementById("scholarships");
wrapper.innerHTML = "";

if (!result.scholarshipDetails.length) {

const empty = document.createElement("p");
empty.className = "empty";
empty.textContent = ETATS_VIDES.opportunities;
wrapper.appendChild(empty);

return;

}

result.scholarshipDetails.forEach((scholarship) => {

const card = document.createElement("article");
card.className = "opportunity-card";

// Refonte 2026-09-23 : UNE raison visible, les autres repliées. Une
// carte se lit en trois secondes : quoi, jusqu'à quand, pourquoi vous.
// La raison MONTRÉE est la plus parlante, pas la première venue : le
// domaine et le financement disent « c'est pour vous » ; le cycle est
// attendu, et « candidatures ouvertes » répète la ligne d'échéance.
const [premiereRaison, ...autresRaisons] = trierRaisons(scholarship.reasons || []);

// university/deadline : n'existaient pas tant que les opportunités
// venaient des 4 pays codés en dur — le catalogue réel (via
// recommendPrograms) fournit désormais une université et une deadline
// précises, affichées ici sans changer la structure de la carte.
const subtitleParts = [scholarship.university, scholarship.country].filter(Boolean);

// Vignette de ville + drapeau : mêmes images déjà vérifiées et
// utilisées pour cette université sur universities.html/
// scholarship-details.html, rendent ici visible la reconnexion au vrai
// catalogue plutôt qu'une icône générique.
card.innerHTML = `
<div class="opportunity-head">
<img class="opportunity-thumb" src="${scholarship.photo.src}" srcset="${scholarship.photo.srcset}" sizes="44px" width="800" height="533" alt="" loading="lazy" decoding="async" onerror="this.onerror=null;this.removeAttribute('srcset');this.src='${scholarship.photo.fallbackOriginal}'">
<div>
<h3></h3>
<span class="opportunity-country"><img class="opportunity-flag" src="assets/flags/${scholarship.flag}" alt="" onerror="this.onerror=null;this.src='assets/flags/default.svg'"><span></span></span>
</div>
</div>
${scholarship.deadline || typeof scholarship.jours === "number" ? `<p class="opportunity-deadline"><i data-lucide="calendar-clock"></i><span></span></p>` : ""}
${premiereRaison ? `<p class="opportunity-pourquoi"><i data-lucide="check"></i><span><strong>Pourquoi vous :</strong> <span class="opportunity-pourquoi-texte"></span></span></p>` : ""}
${autresRaisons.length ? `<details class="opportunity-plus"><summary>${autresRaisons.length} autre${autresRaisons.length > 1 ? "s" : ""} raison${autresRaisons.length > 1 ? "s" : ""}</summary><ul class="opportunity-reasons"></ul></details>` : ""}
${scholarship.programId ? `<a class="opportunity-lien" href="scholarship-details.html?id=${encodeURIComponent(scholarship.programId)}"><span>Voir la fiche</span><i data-lucide="arrow-right"></i></a>` : ""}
`;

const texteRaison = card.querySelector(".opportunity-pourquoi-texte");
if (texteRaison) texteRaison.textContent = premiereRaison;
const listeRaisons = card.querySelector(".opportunity-plus ul");
if (listeRaisons) {
autresRaisons.forEach((raison) => {
const li = document.createElement("li");
li.innerHTML = `<i data-lucide="check"></i><span></span>`;
li.querySelector("span").textContent = raison;
listeRaisons.appendChild(li);
});
}


card.querySelector("h3").textContent = scholarship.name;
card.querySelector(".opportunity-country span").textContent = subtitleParts.join(" — ");

// L'échéance est dite en JOURS quand elle est encore ouverte : « il
// vous reste 31 jours » se comprend d'un coup d'œil là où une date
// brute demande un calcul mental. Quand la date n'est pas
// exploitable, on le dit — on ne la présente jamais comme certaine.
const deadlineEl = card.querySelector(".opportunity-deadline span");

if (deadlineEl) {

if (scholarship.echeanceOuverte === true && scholarship.porte && typeof scholarship.porte.jours === "number") {
// Finitions (2026-09-21) : une étape obligatoire tombe AVANT la date
// limite (Pearson : la nomination par le lycée). C'est elle qu'on
// annonce — « 46 jours » était vrai pour le dépôt, faux pour le geste
// qui décide de tout.
const n = scholarship.porte.jours;
deadlineEl.textContent = `Première étape : ${scholarship.porte.quoi}, au plus tard le ${dateDansNJours(n)} — ${n === 0 ? "c'est aujourd'hui" : `il vous reste ${n} jour${n > 1 ? "s" : ""}`}`;
} else if (scholarship.echeanceOuverte === true && typeof scholarship.jours === "number") {
// LA DATE, PAS LA PROSE (corrigé le 2026-09-21, vu en production).
// `deadline` n'est pas une date : c'est la phrase du catalogue. La
// coller derrière « échéance le » donnait, sur la première carte que
// lit l'étudiant après son diagnostic :
//   « Il vous reste 42 jours — échéance le Clôture le 1er novembre
//     2026 à 23h59 (heure suisse), puis le 1er mai 2027… »
//   « Il vous reste 71 jours — échéance le Deux comités pour le
//     master : premier dépôt le 19 octobre 2026… »
// Deux cartes sur trois. La date est reconstituée depuis `jours`, qui
// est lui-même un décompte en JOURS DE CALENDRIER, de minuit à minuit
// UTC (js/echeance.js joursAvant, js/recommend-programs.js
// joursDeCalendrier) : l'aller-retour est exact par construction, et
// la carte dit la même date que la fiche. La prose, avec ses comités
// et ses heures, reste sur la fiche — là où l'on a la place de la lire.
deadlineEl.textContent = scholarship.jours === 0
? "Dernier jour pour candidater"
: `Il vous reste ${scholarship.jours} jour${scholarship.jours > 1 ? "s" : ""} — échéance le ${dateDansNJours(scholarship.jours)}`;
} else {
// Finitions (2026-09-21) : la carte UNIL n'avait AUCUNE ligne — sa
// fiche porte une date ISO mais pas de phrase `deadline`, et la ligne
// n'était écrite que depuis la phrase.
deadlineEl.textContent = scholarship.deadline
? `Échéance annoncée : ${scholarship.deadline} — à confirmer sur le portail`
: "Échéance à confirmer sur le portail officiel";
}

}

// Moins d'un mois : la ligne d'échéance passe en alerte.
const joursRestants = scholarship.echeanceOuverte === true
? (scholarship.porte && typeof scholarship.porte.jours === "number" ? scholarship.porte.jours : scholarship.jours)
: null;
if (typeof joursRestants === "number" && joursRestants <= 30) {
card.querySelector(".opportunity-deadline")?.classList.add("is-urgente");
}

// La carte entière mène à la fiche (le lien « Voir la fiche » reste le
// vrai lien, pour le clavier et les lecteurs d'écran).
const lien = card.querySelector(".opportunity-lien");
if (lien) {
card.classList.add("is-cliquable");
card.addEventListener("click", (evenement) => {
if (evenement.target.closest("a, summary, details")) return;
window.location.href = lien.href;
});
}

wrapper.appendChild(card);

});

}

/** Les raisons d'une carte, de la plus parlante à la plus attendue. */
function trierRaisons(raisons) {
const poids = (r) => {
const t = String(r).toLowerCase();
if (/domaine/.test(t)) return 5;
if (/financement|recherchez/.test(t)) return 4;
if (/nationalit/.test(t)) return 3;
if (/enseign|langue/.test(t)) return 2;
if (/cycle/.test(t)) return 1;
if (/candidatures ouvertes/.test(t)) return 0;
return 2;
};
return raisons.map((r, i) => ({ r, i, p: poids(r) }))
.sort((a, b) => (b.p - a.p) || (a.i - b.i))
.map(({ r }) => r);
}

/** La date du jour UTC + n jours, en toutes lettres (« 30 novembre
 *  2026 »). Même origine que le décompte : minuit UTC. */
function dateDansNJours(n, aujourdhui = new Date()) {
const minuit = Date.UTC(aujourdhui.getUTCFullYear(), aujourdhui.getUTCMonth(), aujourdhui.getUTCDate());
return formaterDate(new Date(minuit + n * 86400000).toISOString().slice(0, 10));
}

// ==========================================================
// PAS DE DOUBLON ENTRE FITZ ET LA PRIORITÉ (2026-09-23)
// ==========================================================
// Quand l'avis de Fitz est affiché et que sa carte « Votre frein » nomme
// déjà l'axe le plus faible, la carte « Votre priorité » se retire :
// l'étudiant ne lit pas deux fois la même chose. Si Fitz a échoué, ou
// parle d'autre chose, la priorité reste — elle ne dépend de personne.
function eviterLeDoublon() {

const avis = document.getElementById("fitzAnalysis");
const priorite = document.getElementById("improvementFree");
if (!avis || !priorite || avis.hidden || !avis.classList.contains("is-ready")) return;

const axe = (priorite.dataset.axe || "").toLowerCase();
const frein = avis.querySelector(".fitz-point--votre-frein");
const texte = (frein ? frein.textContent : avis.textContent).toLowerCase();

// « Certification de langue » est reconnu dans « aucune certification
// de langue » : on cherche les mots de l'axe, dans l'ordre.
const mots = axe.split(/\s+/).filter((m) => m.length > 2);
if (mots.length && mots.every((m) => texte.includes(m))) priorite.hidden = true;

}

// ==========================================================
// LE DÉTAIL REPLIÉ (2026-09-23)
// ==========================================================
// Le score et sa décomposition vivent dans un <details> fermé : leurs
// animations de remplissage auraient lieu à l'abri des regards. On
// les rejoue donc à l'ouverture. La pastille du verdict ouvre le bloc
// avant d'y descendre.
function brancherDetailDuScore() {

const detail = document.getElementById("scoreDetail");
if (!detail) return;

const rejouer = () => {
const ring = document.getElementById("scoreRing");
const barres = [...detail.querySelectorAll(".score-breakdown-bar span")];
const largeurs = barres.map((b) => b.style.width);
if (ring) ring.style.setProperty("--score-percent", 0);
barres.forEach((b) => { b.style.width = "0"; });
requestAnimationFrame(() => {
requestAnimationFrame(() => {
if (ring) ring.style.setProperty("--score-percent", score);
barres.forEach((b, i) => { b.style.width = largeurs[i]; });
});
});
};

detail.addEventListener("toggle", () => { if (detail.open) rejouer(); });

const pastille = document.getElementById("verdictScore");
if (pastille) {
pastille.addEventListener("click", () => { detail.open = true; });
}

}

// ==========================================================
// RÉVÉLATION AU DÉFILEMENT
// ==========================================================

function initReveal() {

document.documentElement.classList.add("js-ready");

const items = document.querySelectorAll(".reveal");

if (!items.length) return;

if (!("IntersectionObserver" in window)) {
items.forEach((item) => item.classList.add("is-visible"));
return;
}

const observer = new IntersectionObserver((entries) => {

entries.forEach((entry) => {
if (entry.isIntersecting) {
entry.target.classList.add("is-visible");
observer.unobserve(entry.target);
}
});

}, { threshold: 0.12 });

items.forEach((item) => observer.observe(item));

}

// ==========================================================
// RENDU
// ==========================================================

renderVerdict();
renderScore();
renderScoreBreakdown();
brancherDetailDuScore();

fillList("strengths", result.strengths, ETATS_VIDES.strengths, "check-circle");
fillList("weaknesses", result.weaknesses, ETATS_VIDES.weaknesses, "arrow-up-circle");
fillList("recommendations", result.recommendations, ETATS_VIDES.recommendations, "lightbulb");

renderCountries();
renderOpportunitiesSubtext();
renderOpportunities();

// L'analyse de Fitz est volontairement lancée EN DERNIER et sans
// `await` : elle coûte quelques secondes et un appel facturé, la page
// n'a aucune raison de l'attendre. Si elle échoue, le diagnostic reste
// entier — c'est un supplément, jamais une dépendance.
afficherAnalyseFitz({
conteneur: document.getElementById("fitzAnalysis"),
responses,
result,
score,
// Les mêmes sous-scores que ceux affichés à l'écran : Fitz doit
// pouvoir dire « votre 66 % en niveau académique » et non « votre
// moyenne », sinon l'étudiant ne reconnaît pas sa propre page.
breakdown: decomposition()
}).then(eviterLeDoublon).catch(() => {});

initReveal();

if (window.lucide) lucide.createIcons();

}

// ==========================================================
// CONSERVER LE DIAGNOSTIC (2026-09-20)
// ==========================================================
//
// inscription.html promet en titre : « Conservez votre diagnostic ».
// Jusqu'ici, rien ne le conservait : les réponses vivaient dans le
// sessionStorage de CET onglet, et le report vers le profil n'avait
// lieu qu'à la création du compte. Un étudiant qui créait son compte
// d'abord — l'ordre que l'espace étudiant lui propose lui-même —
// retrouvait un profil à 0/6.
//
// Deux gestes, dans cet ordre, et aucun des deux ne peut faire échouer
// la page : le diagnostic s'affiche même si la mémoire est refusée et
// même si Firestore ne répond pas.
//
//   1. la mémoire locale, tout de suite, pour tout le monde — y compris
//      le visiteur qui n'a pas encore de compte, et qui en créera un
//      demain dans un autre onglet ;
//   2. l'écriture dans `users/{uid}`, seulement si quelqu'un est
//      connecté, et seulement s'il y a quelque chose de neuf à écrire
//      (js/diagnostic-garde.js sait dire non).
//
// L'import du SDK est DYNAMIQUE : la page de résultats est publique, et
// la très grande majorité de ceux qui l'ouvrent ne sont pas connectés.
// Rien ne justifie de leur faire télécharger Firestore.
async function conserverLeDiagnostic(reponses) {

try {

const { memoriser, miseAJourDuCompte } = await import("./js/diagnostic-garde.js");

memoriser(reponses);

const { auth, db } = await import("./firebase-config.js");
const { onAuthStateChanged } = await import("https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js");

const utilisateur = await new Promise((resoudre) => {
const arret = onAuthStateChanged(auth, (u) => { arret(); resoudre(u); });
});

if (!utilisateur) return;

const { doc, getDoc, setDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js");

const reference = doc(db, "users", utilisateur.uid);
const instantane = await getDoc(reference);
if (!instantane.exists()) return;      // compte non initialisé : ce n'est pas à cette page de le créer

// La page parle au compte qui la lit, AVANT toute écriture : même quand
// il n'y a rien de neuf à conserver, un client accompagné doit trouver
// son espace, et un profil qui dit autre chose doit être signalé.
await adapterAuCompte(instantane.data(), reponses);

const maj = miseAJourDuCompte(instantane.data(), reponses, { serverTimestamp });
if (!maj) return;                      // rien de neuf : aucune écriture facturée

// `merge` et non un remplacement : ce document porte la formule, les
// alertes, l'historique de paiement. On n'écrit que les trois clés.
await setDoc(reference, maj, { merge: true });

} catch (erreur) {

// Un diagnostic qui s'affiche vaut mieux qu'un diagnostic qui se
// sauvegarde : cette chaîne n'interrompt jamais la page.
console.warn("Le diagnostic n'a pas pu être conservé :", erreur);

}

}

// ==========================================================
// LA PAGE PARLE AU COMPTE QUI LA LIT (lot DÉPART, 2026-09-21)
// ==========================================================
// Constaté sur un compte Essentiel qui refaisait son diagnostic : la
// page n'offrait que « Retour à l'accueil », « Choisir ma formule » et
// « Construire mon dossier avec Fitz » → offers.html. Aucun chemin vers
// son espace, et on lui revendait ce qu'il avait déjà payé. Et quand son
// profil disait autre chose que ce diagnostic, rien ne le lui disait.
async function adapterAuCompte(donnees, reponses) {

try {

const { resoudreEspace, HUB_ESPACE } = await import("./js/plan-features.js");
const espace = resoudreEspace(donnees);

if (espace !== "aucun") {

const hub = HUB_ESPACE[espace] || "dashboard.html";
document.body.dataset.compteAccompagne = "1";
document.body.dataset.hubEspace = hub;

const retour = document.getElementById("resultsBackLink");
if (retour) {
retour.setAttribute("href", hub);
const libelle = retour.querySelector("span");
if (libelle) libelle.textContent = "Retour à mon espace";
}

const cta = document.getElementById("closingCta");
if (cta) {
cta.setAttribute("href", hub);
const libelle = cta.querySelector("span");
if (libelle) libelle.textContent = "Continuer dans mon espace";
}

const note = document.getElementById("closingNote");
if (note) note.hidden = true;

// Les autres opportunités sont déjà dans son espace.
const suite = document.getElementById("opportunitesSuiteLien");
if (suite) {
suite.setAttribute("href", hub);
const texte = suite.querySelector("span");
if (texte) texte.textContent = "Les voir dans mon espace";
}
const noteSuite = document.getElementById("opportunitesSuiteNote");
if (noteSuite) noteSuite.textContent = NOTE_SUITE.accompagne;

}

const { ecartsDiagnosticProfil } = await import("./js/diagnostic-vers-profil.js");
const ecarts = ecartsDiagnosticProfil(donnees && donnees.profile, reponses);
const bloc = document.getElementById("ecartProfil");
const liste = document.getElementById("ecartProfilListe");

if (bloc && liste && ecarts.length) {
liste.replaceChildren(...ecarts.map((e) => {
const li = document.createElement("li");
const nom = document.createElement("strong");
nom.textContent = `${e.libelle} : `;
li.append(nom, `${e.diagnostic} dans ce diagnostic, ${e.profil} dans votre profil.`);
return li;
}));
bloc.hidden = false;
if (window.lucide) window.lucide.createIcons();
}

} catch (erreur) {

console.warn("La page n'a pas pu s'adapter au compte :", erreur);

}

}

// ==========================================================
// DÉMARRAGE — voir l'avertissement près de la lecture du
// sessionStorage : cet appel doit rester le DERNIER du module.
// ==========================================================
if (rawResponses) {
const reponses = JSON.parse(rawResponses);
main(reponses);
conserverLeDiagnostic(reponses);
}
