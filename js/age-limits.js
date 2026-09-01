/**
* ============================================================
* Fitz — limites d'âge des bourses (champ `ageMax` des documents
* "scholarships", saisi dans admin/scholarships.html)
* ============================================================
*
* Fonctions PURES, sans DOM ni Firestore — même forme que
* js/eligibility-countries.js, et testables directement
* (test/age-limits.test.mjs).
*
* Forme du champ :
*   ageMax: { tous?: number, licence?: number, master?: number,
*             doctorat?: number }
*   ageMaxNote?: string   // ce qu'un nombre ne dit pas
* `tous` et les clés par cycle sont EXCLUSIFS (garde au submit admin).
*
* RÈGLE ABSOLUE, identique à estEligible et à funder : un champ
* `ageMax` ABSENT est un INCONNU, jamais « aucune limite d'âge ».
* On n'affiche jamais « pas de limite », et on ne déduit jamais une
* limite d'un texte de description.
*
* RÈGLE DE PRUDENCE — quand la limite officielle varie selon le
* candidat (25 ans pour les hommes / 28 pour les femmes à la Pan
* African University ; 29 ans à USIU-Africa, 32 pour les réfugiés,
* déplacés et personnes en situation de handicap), `ageMax` retient
* LA PLUS FAVORABLE (la plus haute) et `ageMaxNote` décrit la
* variation. Motif : un filtre qui se trompe doit se tromper en
* MONTRANT une bourse de trop, jamais en cachant une bourse à
* quelqu'un qui y avait droit.
* ============================================================
*/

// Vocabulaire du champ `levels` des bourses -> clé de `ageMax`.
const CLE_PAR_NIVEAU = {
Licence: "licence",
Master: "master",
Doctorat: "doctorat"
};

// Les 5 tranches EXACTES de la question ageBracket (questions.js) —
// séparateur tiret demi-cadratin entouré d'espaces, recopié depuis le
// fichier source, jamais retapé. min/max sont les bornes INCLUSES de
// l'intervalle ; null = pas de borne de ce côté.
const TRANCHES_AGE = {
"Moins de 18 ans": { min: null, max: 17 },
"18 – 24 ans": { min: 18, max: 24 },
"25 – 29 ans": { min: 25, max: 29 },
"30 – 34 ans": { min: 30, max: 34 },
"35 ans et plus": { min: 35, max: null }
};

// Une limite n'est exploitable que si c'est un vrai nombre positif —
// tout le reste (absent, "", NaN, 0, négatif) est traité comme absent.
function limiteValide(valeur) {
return Number.isFinite(valeur) && valeur > 0 ? valeur : null;
}

/**
* Limite qui s'applique à CE niveau ("Licence" | "Master" | "Doctorat",
* vocabulaire du champ `levels`) : `tous` s'il existe, sinon la clé du
* niveau, sinon null. Niveau inconnu ou absent -> null — jamais la plus
* basse des limites : on ne devine pas.
*/
export function limiteApplicable(ageMax, niveau) {

if (!ageMax || typeof ageMax !== "object") return null;

const cle = CLE_PAR_NIVEAU[niveau];
if (!cle) return null;

const tous = limiteValide(ageMax.tous);
if (tous !== null) return tous;

return limiteValide(ageMax[cle]);

}

/**
* L'âge exact respecte-t-il la limite du niveau ?
*   - pas de limite applicable -> null (inconnu, jamais « oui »)
*   - âge non renseigné, non numérique ou <= 0 -> null
*   - age <= limite -> true ; age > limite -> false
* null ne doit JAMAIS être traité comme false par un appelant — même
* règle des trois valeurs que estEligible, verrouillée par test.
*/
export function respecteLimiteAge(ageMax, age, niveau) {

const limite = limiteApplicable(ageMax, niveau);
if (limite === null) return null;

const valeur = Number(age);
if (!Number.isFinite(valeur) || valeur <= 0) return null;

return valeur <= limite;

}

/**
* Même verdict pour le diagnostic gratuit, qui ne connaît qu'une
* TRANCHE (question ageBracket). Une tranche est un intervalle : on ne
* tranche que lorsque l'intervalle ENTIER tombe d'un côté de la limite.
*   - borne haute de la tranche <= limite -> true
*   - borne basse de la tranche > limite  -> false
*   - sinon (la tranche chevauche la limite) -> null
* Exemple : limite 26 ans, tranche "25 – 29 ans" -> null, on ne sait
* pas ; "30 – 34 ans" -> false ; "18 – 24 ans" -> true.
* "35 ans et plus" n'a pas de borne haute : true impossible.
* "Moins de 18 ans" n'a pas de borne basse : false impossible.
*/
export function respecteLimiteAgeTranche(ageMax, tranche, niveau) {

const limite = limiteApplicable(ageMax, niveau);
if (limite === null) return null;

const bornes = TRANCHES_AGE[tranche];
if (!bornes) return null;

if (bornes.max !== null && bornes.max <= limite) return true;
if (bornes.min !== null && bornes.min > limite) return false;

return null;

}

/**
* Libellé d'affichage : "" quand rien n'est renseigné (l'appelant
* n'affiche alors RIEN — jamais « pas de limite »). "26 ans" pour
* `tous` ; "25 ans (licence) · 30 ans (master)" pour des clés de
* cycle, dans l'ordre licence -> master -> doctorat.
*/
export function libelleLimiteAge(ageMax) {

if (!ageMax || typeof ageMax !== "object") return "";

const tous = limiteValide(ageMax.tous);
if (tous !== null) return `${tous} ans`;

const parties = [];
for (const [niveau, cle] of [["licence", "licence"], ["master", "master"], ["doctorat", "doctorat"]]) {
const limite = limiteValide(ageMax[cle]);
if (limite !== null) parties.push(`${limite} ans (${niveau})`);
}

return parties.join(" · ");

}

/**
* Prédicat du filtre catalogue « Compatibles avec mon âge »
* (scholarships.js). Ne retire une bourse que si respecteLimiteAge()
* renvoie false pour le niveau filtré — ou, sans filtre de niveau,
* false pour TOUS les niveaux de la bourse : si elle reste possible
* sur un seul cycle, elle reste affichée. Les bourses sans limite
* connue (null) restent toujours affichées.
*/
export function bourseCompatibleAge(scholarship, age, niveauFiltre) {

if (!scholarship) return true;

if (niveauFiltre) {
return respecteLimiteAge(scholarship.ageMax, age, niveauFiltre) !== false;
}

const niveaux = Array.isArray(scholarship.levels) ? scholarship.levels : [];
if (!niveaux.length) return true;

return !niveaux.every((niveau) => respecteLimiteAge(scholarship.ageMax, age, niveau) === false);

}

/**
* Âge exact dérivé d'une date de naissance (champ `birthDate` du profil
* connecté) -> number | null. Extraite de profile.js (computeAge, qui
* renvoyait une chaîne pour #ageDisplay) pour être PARTAGÉE avec le
* moteur de recommandation plutôt que dupliquée — profile.js la
* réimporte d'ici et refait la mise en chaîne côté affichage.
*/
export function computeAge(birthDateStr) {

if (!birthDateStr) return null;

const birth = new Date(birthDateStr);
if (Number.isNaN(birth.getTime())) return null;

const today = new Date();
let age = today.getFullYear() - birth.getFullYear();
const monthDiff = today.getMonth() - birth.getMonth();

if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
age--;
}

return age >= 0 ? age : null;

}
