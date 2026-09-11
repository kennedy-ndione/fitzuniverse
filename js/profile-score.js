/**
* ============================================================
* FitzUniverse — score de complétion du profil
* ============================================================
*
* Logique partagée entre le tableau de bord étudiant (dashboard.js),
* les outils Fitz (ai-letter.js, ai-email.js, applications.js,
* js/application-journey.js, js/ai/simulated-responses.js) et la fiche
* étudiant du Control Center (admin/student-detail.js), pour que tous
* affichent exactement le même score « profil complété X/10 » sans
* dupliquer la règle.
*
* Score par section (aligné sur les 10 sections de profile.html) plutôt
* qu'un comptage plat de champs : un profil peut avoir des dizaines de
* champs, mais reste noté sur /10. Les champs enrichis ne sont écrits
* qu'après le premier passage sur profile.js — pour un compte qui ne
* l'a pas encore visité, ils sont simplement absents et comptent comme
* non renseignés, sans jamais faire planter le calcul.
*
* LOT PROFIL-PAR-NIVEAU (2026-09-11) — LE SCORE SE CALCULE SUR LES
* SECTIONS APPLICABLES AU PALIER
* ---------------------------------------------------------------
* calculateAiScore() GARDE sa signature et son échelle sur 10, mais
* vaut désormais : sections applicables remplies / sections applicables
* × 10. Un bachelier qui a tout rempli est à 10/10 (avant : plafonné à
* 8/10, faute de mémoire et de stages) ; les consommateurs qui comparent
* au seuil 7 continuent de fonctionner sans changement (7/10 = 70 %).
* Un profil SANS palier se lit comme avant : dix sections, toutes
* requises — js/profil-par-niveau.js décide, à la lecture, jamais en
* base. bilanProfil() donne le dénominateur RÉEL à qui l'affiche
* (fiche admin : « 8 sections sur 8 applicables », jamais « 8/10 »).
* ============================================================
*/

import { SECTIONS, sectionsPour, lirePalier, estSecondaire, libellePalier } from "./profil-par-niveau.js";

function isFilled(value) {
return String(value || "").trim() !== "";
}

/**
* Parcours scolaire — la seule règle qui dépend du palier : un lycéen ou
* un bachelier renseigne son diplôme de fin d'études secondaires (série
* ou mention, et sa moyenne) ; les autres, leur dernier diplôme, leur
* établissement et leur moyenne. Sans palier : la règle d'avant ce lot,
* qui exigeait aussi le bouton radio `studentStatus`.
*/
function parcoursRempli(p) {
const palier = lirePalier(p);
if (!palier) {
return isFilled(p.lastDegree || p.currentDegree) && isFilled(p.currentInstitution) && isFilled(p.academicAverage) && isFilled(p.studentStatus);
}
if (estSecondaire(palier)) {
return isFilled(p.currentInstitution) && isFilled(p.bacAverage) && (isFilled(p.bacSeries) || isFilled(p.bacMention));
}
return isFilled(p.lastDegree || p.currentDegree) && isFilled(p.currentInstitution) && isFilled(p.academicAverage);
}

// Même ordre que SECTIONS (js/profil-par-niveau.js) et que SECTION_LABELS
// de la fiche admin.
export const PROFILE_SECTION_RULES = [
(p) => isFilled(p.firstName) && isFilled(p.lastName) && isFilled(p.birthDate) && isFilled(p.country || p.originCountry),
parcoursRempli,
(p) => isFilled(p.projects) || isFilled(p.thesis) || isFilled(p.publications) || isFilled(p.researchExperience) || isFilled(p.ranking),
(p) => Array.isArray(p.languages) && p.languages.length > 0,
(p) => isFilled(p.desiredField) && isFilled(p.desiredDegree),
(p) => Array.isArray(p.preferredCountries) && p.preferredCountries.length > 0 && isFilled(p.universityType),
(p) => isFilled(p.budget) && isFilled(p.hasSponsor) && Array.isArray(p.fundingWanted) && p.fundingWanted.length > 0,
(p) => Array.isArray(p.documentsAvailable) && p.documentsAvailable.length > 0,
(p) => isFilled(p.internships) || isFilled(p.workExperience) || isFilled(p.associations) || isFilled(p.volunteering) || isFilled(p.entrepreneurship),
(p) => isFilled(p.whyLeave) && isFilled(p.careerGoals) && isFilled(p.dreams)
];

// Seuil au-delà duquel un profil est considéré "assez complet" pour que
// Fitz s'appuie dessus (lettre, vérification avant dépôt...) — utilisé à
// la fois par js/ai/simulated-responses.js (computeApplicationReadiness)
// et js/application-journey.js, pour ne jamais afficher deux verdicts
// contradictoires sur le même profil.
export const PROFILE_READY_THRESHOLD = 7;

function sectionRemplie(index, profile) {
try {
return !!PROFILE_SECTION_RULES[index](profile || {});
} catch {
return false;
}
}

/**
* Le bilan complet : chaque section avec son applicabilité et son état,
* le nombre de sections applicables (le dénominateur RÉEL), le nombre
* remplies parmi elles, et le score sur 10.
*
* @returns {{ palier: string, libellePalier: string, sections: Array<{id, libelle, index, applicabilite, remplie}>, applicables: number, remplies: number, score: number }}
*/
export function bilanProfil(profile) {
const p = profile && typeof profile === "object" ? profile : {};
const palier = lirePalier(p);
const sections = sectionsPour(palier).map((s) => ({ ...s, remplie: sectionRemplie(s.index, p) }));
const requises = sections.filter((s) => s.applicabilite === "requise");
const remplies = requises.filter((s) => s.remplie).length;
const applicables = requises.length;
const score = applicables ? Math.round((remplies / applicables) * 10 * 10) / 10 : 0;
return { palier, libellePalier: libellePalier(palier), sections, applicables, remplies, score };
}

export function calculateAiScore(profile) {
return bilanProfil(profile).score;
}

// Garde-fou : les deux listes s'indexent l'une sur l'autre.
if (PROFILE_SECTION_RULES.length !== SECTIONS.length) {
throw new Error("profile-score.js : PROFILE_SECTION_RULES et SECTIONS (profil-par-niveau.js) n'ont pas la même longueur.");
}
