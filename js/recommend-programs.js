/**
* ============================================================
* ScholarBridge — recommandation d'universités pour les créneaux de
* candidature (applications.js)
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
* formule/quota — applications.js lui fournit les données déjà
* chargées (profile, programs, universities, scholarships) et applique
* lui-même le quota de la formule active.
* ============================================================
*/

const LEVEL_ALIASES = {
"licence": "Licence", "bachelor": "Licence",
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

// Score de compatibilité programme↔profil — mêmes critères que
// details.js:computeCompatibility (niveau, langue, pays), adaptés pour
// lire le profil Firestore persistant (profile.js) au lieu des réponses
// de session du diagnostic gratuit, puisque cette fonction tourne dans
// l'espace étudiant connecté où ce profil est toujours disponible.
function scoreProgram(program, university, profile) {

let score = 0;

const studentLevel = normalizeLevel(profile.lastDegree || profile.currentDegree);
if (studentLevel && program.level && studentLevel === program.level) score += 3;

const preferredCountries = Array.isArray(profile.preferredCountries) ? profile.preferredCountries : [];
if (university.country && preferredCountries.includes(university.country)) score += 2;

const languages = Array.isArray(profile.languages) ? profile.languages : [];
if (program.language && languages.some((lang) => String(program.language).toLowerCase().includes(String(lang).toLowerCase()))) score += 1;

if (String(program.status || "").toLowerCase().includes("ouvert")) score += 1;

return score;

}

/**
* @param {Object} profile - profil Firestore de l'étudiant (profile.js)
* @param {Array} programs - documents "programs" ({firestoreId, universityId, scholarshipId, level, language, status, ...})
* @param {Map} universitiesById - Map(universityId -> document "universities")
* @param {Map} scholarshipsById - Map(scholarshipId -> document "scholarships")
* @param {Set} excludeUniversityIds - universités déjà occupées par un autre créneau, à ne jamais reproposer
* @param {number} count - nombre de recommandations à renvoyer
* @returns {Array<{universityId, universityName, scholarshipTitle, deadline}>}
*/
export function recommendPrograms({ profile, programs, universitiesById, scholarshipsById, excludeUniversityIds, count }) {

const exclude = excludeUniversityIds || new Set();

const scored = programs
.filter((p) => p.universityId && !exclude.has(p.universityId) && universitiesById.has(p.universityId))
.map((p) => ({
program: p,
university: universitiesById.get(p.universityId),
score: scoreProgram(p, universitiesById.get(p.universityId), profile || {})
}))
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
// Bug corrigé (audit du 2026-08-14) : lisait entry.university.university,
// qui n'a jamais existé sur le schéma relationnel ("universities" porte
// name, pas university — university était le nom du champ dans l'ancien
// schéma à plat, avant migrate.js). Le fallback masquait silencieusement
// le problème : universityName retombait toujours sur "Université
// partenaire", jamais sur le vrai nom. Même bug corrigé dans
// applications.js (uni.university -> uni.name, 2 occurrences).
universityName: entry.university.name || "Université partenaire",
scholarshipTitle: scholarship ? scholarship.title : "",
deadline: entry.program.deadline || null
});

}

return picked;

}
