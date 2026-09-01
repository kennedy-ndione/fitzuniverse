/**
* ============================================================
* Fitz — recommandation d'universités pour les créneaux de
* candidature (applications.js) et le diagnostic gratuit (results.js)
* ============================================================
*
* N'existait nulle part avant : la seule évaluation de compatibilité
* réelle du projet (details.js:computeCompatibility) note UNE université
* à la fois, à partir des réponses du diagnostic gratuit en
* sessionStorage — jamais du profil Firestore persistant, et jamais en
* lot sur tout le catalogue. Ce fichier comble ce manque avec la même
* logique de jointure "programs" que scholarships.js/
* universities-page.js/details.js (jamais une deuxième façon de
* résoudre bourse↔université).
*
* Fonction pure : ne fait aucun appel Firebase, ne connaît aucune
* formule/quota — les appelants lui fournissent les données déjà
* chargées (profile, programs, universities, scholarships) et appliquent
* eux-mêmes le quota de la formule active.
*
* Refonte 2026-08-29 (avec la refonte du questionnaire) :
* 1. CYCLE VISÉ plutôt que dernier diplôme. Le bonus de niveau
*    comparait program.level au niveau ACTUEL de l'étudiant — un
*    titulaire de licence recevait donc le bonus sur les programmes de
*    licence, exactement le cycle qu'il vient de terminer, jamais sur
*    les masters qu'il vise réellement. profile.targetLevel (résolu par
*    resolveTargetLevel(), eligibility-ai.js) prime désormais ;
*    lastDegree/currentDegree restent le repli pour les appelants de
*    l'espace connecté (applications.js, dashboard.js) dont le profil
*    Firestore n'a pas encore ce champ.
* 2. explainMatch() : chaque recommandation sait désormais expliquer
*    POURQUOI ce programme précis correspond à ce profil précis, à
*    partir des vraies données du catalogue (niveau, langue
*    d'enseignement, statut, pays, financement) — avant, results.js
*    affichait les mêmes raisons génériques sous les 6 cartes.
*    recommendPrograms() attache ces raisons à chaque pick (clé
*    "reasons", ignorée sans risque par les appelants existants).
* ============================================================
*/

// Le chemin d'import est relatif à CE fichier (js/) — eligibility-
// countries.js vit dans le même dossier.
import { estEligible } from "./eligibility-countries.js";
import { computeAge, respecteLimiteAge, respecteLimiteAgeTranche } from "./age-limits.js";

// "bachelier" ajouté (audit 2026-08-22) : un lycéen qui vient d'obtenir
// son bac vise un programme de 1er cycle, le même "Licence" que
// program.level dans le catalogue. "bachelor" couvre aussi le libellé
// "Licence (Bachelor)" de la nouvelle question targetLevel
// (questions.js, refonte 2026-08-29).
const LEVEL_ALIASES = {
"licence": "Licence", "bachelor": "Licence", "bachelier": "Licence",
"master": "Master",
"doctorat": "Doctorat", "phd": "Doctorat", "doctorate": "Doctorat"
};

function normalizeLevel(value) {
const text = String(value || "").toLowerCase();
for (const key in LEVEL_ALIASES) {
if (text.includes(key)) return LEVEL_ALIASES[key];
}
return "";
}

// Niveau que l'étudiant VISE — champ targetLevel d'abord (diagnostic
// gratuit refondu, via resolveTargetLevel() dans eligibility-ai.js),
// sinon l'ancien comportement (dernier diplôme) pour l'espace connecté.
// Une seule définition, partagée par scoreProgram() et explainMatch(),
// pour que le score et son explication ne puissent jamais diverger.
function studentTargetLevel(profile) {
return normalizeLevel(profile.targetLevel || profile.lastDegree || profile.currentDegree);
}

// Dérive un signal financement simple à partir des deux formes de profil
// possibles : "fundingGoal" (chaîne libre issue de la question "goal" du
// diagnostic gratuit) ou "fundingWanted" (tableau de codes issu du
// profil connecté, profile.js/profile.html). scoreProgram() est partagée
// entre les deux contextes, donc les deux formes doivent être comprises
// sans erreur (audit 2026-08-22).
function fundingSignal(profile) {

const goal = String(profile.fundingGoal || "").toLowerCase();
const wanted = Array.isArray(profile.fundingWanted) ? profile.fundingWanted : [];

return {
wantsFull: goal.includes("complète") || wanted.includes("full_scholarship"),
wantsPartial: goal.includes("partielle") || wanted.includes("partial_scholarship")
};

}

// Correspondance financement bourse↔souhait — extraite de scoreProgram()
// pour être partagée avec explainMatch() (même règle, jamais deux
// implémentations). scholarship.funding est un texte libre saisi par un
// administrateur (admin/scholarships.js) — correspondance volontairement
// prudente par mots-clés plutôt qu'un pourcentage inventé.
function fundingMatches(scholarship, profile) {

if (!scholarship || !scholarship.funding) return { full: false, partial: false };

const { wantsFull, wantsPartial } = fundingSignal(profile);
const funding = String(scholarship.funding).toLowerCase();

return {
full: wantsFull && (funding.includes("100") || funding.includes("intégral") || funding.includes("complèt")),
partial: wantsPartial && (funding.includes("partiel") || funding.includes("variable"))
};

}

// Langues que le profil maîtrise suffisamment (results.js n'y met que
// les niveaux au-dessus de "Débutant") face à la langue d'enseignement
// du programme — extraite pour la même raison que fundingMatches().
function languageMatch(program, profile) {

const languages = Array.isArray(profile.languages) ? profile.languages : [];

if (!program.language || !languages.length) return "";

const match = languages.find((lang) => String(program.language).toLowerCase().includes(String(lang).toLowerCase()));

return match || "";

}

// Limite d'âge de la bourse face à l'âge de l'étudiant — deux sources
// selon le contexte, comme fundingSignal() gère déjà deux formes de
// profil : `birthDate` (profil connecté, profile.js) donne un âge
// exact ; `ageBracket` (diagnostic gratuit, questions.js) ne donne
// qu'une tranche, tranchée seulement quand l'intervalle entier tombe
// d'un côté de la limite. Le niveau comparé est le niveau VISÉ
// (studentTargetLevel), pas celui du programme. Renvoie true | false |
// null — null (limite inconnue, âge inconnu, tranche à cheval) ne doit
// JAMAIS être traité comme false : même règle des trois valeurs que
// estEligible, verrouillée par test (test/age-limits.test.mjs).
function ageMatch(scholarship, profile) {

if (!scholarship || !scholarship.ageMax) return null;

const niveau = studentTargetLevel(profile);

const age = computeAge(profile.birthDate);
if (age !== null) return respecteLimiteAge(scholarship.ageMax, age, niveau);

if (profile.ageBracket) return respecteLimiteAgeTranche(scholarship.ageMax, profile.ageBracket, niveau);

return null;

}

// Score de compatibilité programme↔profil — mêmes critères que
// details.js:computeCompatibility (niveau, langue, pays), adaptés pour
// lire indifféremment le profil Firestore persistant (profile.js) ou le
// profil dérivé du diagnostic gratuit (results.js:
// buildProfileFromResponses).
function scoreProgram(program, university, scholarship, profile) {

// Une bourse fermée à la nationalité de l'étudiant ne peut pas être
// recommandée, quel que soit son score sur les autres critères.
// estEligible renvoie null quand on ne sait pas — on ne pénalise alors pas.
// Score sentinelle négatif, écarté par recommendPrograms() AVANT le tri :
// retirer des points ne suffirait pas, une bourse fermée ne doit jamais
// remonter, même faute de mieux. Rien dans explainMatch() : c'est un
// FILTRE, pas un bonus (voir l'en-tête du fichier).
if (scholarship && estEligible(scholarship.eligibility, profile.nationality) === false) {
return -1;
}

// Même mécanique pour la limite d'âge (champ ageMax, 2026-08-30) :
// filtre DUR, score sentinelle écarté avant le tri — un plafond d'âge
// dépassé est aussi disqualifiant qu'une exclusion de nationalité, la
// bourse ne doit pas remonter même faute de mieux. Rien dans
// explainMatch() : c'est un FILTRE, pas un bonus. Uniquement sur
// false — jamais sur null (limite ou âge inconnus, tranche à cheval).
if (ageMatch(scholarship, profile) === false) {
return -1;
}

let score = 0;

// Niveau VISÉ (refonte 2026-08-29, voir l'en-tête) : le bonus le plus
// élevé des critères va au programme du cycle que l'étudiant veut
// intégrer, plus jamais à celui qu'il vient de terminer.
const targetLevel = studentTargetLevel(profile);
if (targetLevel && program.level && targetLevel === program.level) score += 3;

const preferredCountries = Array.isArray(profile.preferredCountries) ? profile.preferredCountries : [];
if (university.country && preferredCountries.includes(university.country)) score += 2;

if (languageMatch(program, profile)) score += 1;

if (String(program.status || "").toLowerCase().includes("ouvert")) score += 1;

// university.fields existe côté formulaire admin (admin/university.js)
// mais reste vide (fields:[]) sur tout le catalogue actuellement seedé
// (migrate.js, expand-catalog-batch*.js) : ce bonus ne s'applique donc à
// aucune université réelle aujourd'hui. Câblé quand même dès maintenant —
// s'active automatiquement le jour où ce champ sera renseigné, sans
// qu'il faille retoucher ce pont. Correspondance texte dans les deux
// sens (le libellé suggéré au diagnostic et la saisie libre admin ne
// partagent pas forcément la même formulation exacte).
if (profile.desiredField && Array.isArray(university.fields) && university.fields.length) {
const desired = String(profile.desiredField).toLowerCase();
if (university.fields.some((f) => {
const field = String(f).toLowerCase();
return field.includes(desired) || desired.includes(field);
})) score += 1;
}

const funding = fundingMatches(scholarship, profile);
if (funding.full) score += 1;
if (funding.partial) score += 1;

return score;

}

/**
* Raisons de compatibilité propres à UN programme — le miroir exact des
* bonus de scoreProgram(), formulé en phrases : chaque raison affichée
* correspond à un point réellement compté, jamais l'inverse. results.js
* les affiche sous chaque carte d'opportunité (avant : les mêmes raisons
* génériques du profil, dupliquées sous les 6 cartes — refonte
* 2026-08-29).
*
* Exportée aussi pour details.js/applications.js si besoin — même
* signature que scoreProgram().
*
* @returns {Array<string>} raisons, de la plus forte à la plus faible ;
* peut être vide si rien ne correspond (l'appelant garde son repli).
*/
export function explainMatch(program, university, scholarship, profile) {

const reasons = [];

const targetLevel = studentTargetLevel(profile);
if (targetLevel && program.level && targetLevel === program.level) {
reasons.push(`Programme de niveau ${program.level} — le cycle que vous visez`);
}

const preferredCountries = Array.isArray(profile.preferredCountries) ? profile.preferredCountries : [];
if (university.country && preferredCountries.includes(university.country)) {
reasons.push(`Situé en ${university.country}, votre destination souhaitée`);
}

const lang = languageMatch(program, profile);
if (lang) {
reasons.push(`Enseigné en ${String(program.language).toLowerCase().includes("angl") ? "anglais" : String(program.language).toLowerCase().includes("fran") ? "français" : program.language} — une langue que vous maîtrisez`);
}

if (String(program.status || "").toLowerCase().includes("ouvert")) {
reasons.push(program.deadline
? `Candidatures actuellement ouvertes (échéance : ${program.deadline})`
: "Candidatures actuellement ouvertes");
}

const funding = fundingMatches(scholarship, profile);
if (funding.full) reasons.push("Financement complet — ce que vous recherchez");
if (funding.partial) reasons.push("Financement partiel disponible, en phase avec votre objectif");

return reasons;

}

/**
* @param {Object} profile - profil Firestore de l'étudiant (profile.js) ou profil dérivé du diagnostic (results.js)
* @param {Array} programs - documents "programs" ({firestoreId, universityId, scholarshipId, level, language, status, ...})
* @param {Map} universitiesById - Map(universityId -> document "universities")
* @param {Map} scholarshipsById - Map(scholarshipId -> document "scholarships")
* @param {Set} excludeUniversityIds - universités déjà occupées par un autre créneau, à ne jamais reproposer
* @param {number} count - nombre de recommandations à renvoyer
* @returns {Array<{universityId, score, universityName, scholarshipTitle, deadline, applicationUrl, universityWebsite, reasons}>}
*/
export function recommendPrograms({ profile, programs, universitiesById, scholarshipsById, excludeUniversityIds, count }) {

const exclude = excludeUniversityIds || new Set();

const scored = programs
.filter((p) => p.universityId && !exclude.has(p.universityId) && universitiesById.has(p.universityId))
.map((p) => {

const scholarship = p.scholarshipId ? scholarshipsById.get(p.scholarshipId) : null;

return {
program: p,
university: universitiesById.get(p.universityId),
score: scoreProgram(p, universitiesById.get(p.universityId), scholarship, profile || {})
};

})
// Écarte les scores sentinelles AVANT le tri : une bourse fermée à la
// nationalité (score -1) ne doit jamais être retenue, même quand il
// n'y a rien de mieux à proposer.
.filter((e) => e.score >= 0)
.sort((a, b) => b.score - a.score);

const picked = [];
const pickedUniversityIds = new Set();

for (const entry of scored) {

if (picked.length >= count) break;
if (pickedUniversityIds.has(entry.program.universityId)) continue;

pickedUniversityIds.add(entry.program.universityId);

const scholarship = entry.program.scholarshipId ? scholarshipsById.get(entry.program.scholarshipId) : null;

picked.push({
universityId: entry.program.universityId,
// Exposé pour countCompatibleOpportunities() (dashboard.js), qui a
// besoin de savoir combien d'entrées correspondent réellement au
// profil (score > 0) plutôt que de compter tout le catalogue — champ
// ignoré sans risque par les appelants existants (applications.js) qui
// ne lisent pas cette clé.
score: entry.score,
// Bug corrigé (audit du 2026-08-14) : lisait entry.university.university,
// qui n'a jamais existé sur le schéma relationnel ("universities" porte
// name, pas university — university était le nom du champ dans l'ancien
// schéma à plat, avant migrate.js). Le fallback masquait silencieusement
// le problème : universityName retombait toujours sur "Université
// partenaire", jamais sur le vrai nom. Même bug corrigé dans
// applications.js (uni.university -> uni.name, 2 occurrences).
universityName: entry.university.name || "Établissement",
scholarshipTitle: scholarship ? scholarship.title : "",
deadline: entry.program.deadline || null,
// Audit du 2026-08-28 : ces deux champs manquaient ici, donc
// applications.js écrivait toujours portalUrl:"" pour un créneau
// suggéré par Fitz, alors même que programs/universities portent
// déjà applicationUrl/officialWebsite — même distinction et même
// ordre de repli que details.js:301-308 (le lien de candidature
// précis du programme prime sur le portail générique de l'université).
applicationUrl: entry.program.applicationUrl || entry.university.applicationPortalUrl || "",
universityWebsite: entry.university.officialWebsite || "",
// Refonte 2026-08-29 : les raisons PROPRES à ce programme, dérivées
// des mêmes règles que le score (voir explainMatch). Clé nouvelle,
// ignorée sans risque par les appelants qui ne la lisent pas.
reasons: explainMatch(entry.program, entry.university, scholarship, profile || {})
});

}

return picked;

}
