/**
* ============================================================
* FitzUniverse — score de complétion du profil
* ============================================================
*
* Logique partagée entre le tableau de bord étudiant (dashboard.js)
* et la fiche étudiant du Control Center admin
* (admin/student-detail.js), pour que les deux affichent exactement
* le même score "profil complété X/10" sans dupliquer la règle.
*
* Score par section (aligné sur les 10 sections de profile.html/
* profile.js) plutôt qu'un comptage plat de champs : un profil peut
* avoir des dizaines de champs, mais reste noté sur /10. Les champs
* enrichis (firstName, languages, preferredCountries...) ne sont
* écrits qu'après le premier passage sur profile.js — pour un compte
* qui ne l'a pas encore visité, ils sont simplement absents et
* comptent comme non renseignés, sans jamais faire planter le calcul.
* ============================================================
*/

function isFilled(value) {
return String(value || "").trim() !== "";
}

export const PROFILE_SECTION_RULES = [
(p) => isFilled(p.firstName) && isFilled(p.lastName) && isFilled(p.birthDate) && isFilled(p.country || p.originCountry),
(p) => isFilled(p.lastDegree || p.currentDegree) && isFilled(p.currentInstitution) && isFilled(p.academicAverage) && isFilled(p.studentStatus),
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

export function calculateAiScore(profile) {

const completed = PROFILE_SECTION_RULES.filter((rule) => {
try {
return !!rule(profile);
} catch {
return false;
}
}).length;

return Math.round((completed / PROFILE_SECTION_RULES.length) * 10 * 10) / 10;

}
