/**
* ============================================================
* Fitz — relier une candidature de l'étudiant à sa fiche du catalogue
* ============================================================
*
* LE PROBLÈME QUE CE FICHIER RÉSOUT (passe espace étudiant 1/3, 2026-09-06)
* -------------------------------------------------------------------------
* Une candidature (users/{uid}/applications/{slot}) stocke la bourse en
* TEXTE (`scholarship`) et l'échéance en ISO gelé (`deadline`), copiés
* au moment du choix. Aucune correction du catalogue ne peut ensuite
* l'atteindre : le lot 38 a démontré des cycles clos que l'espace
* étudiant continuait d'annoncer « Échéance dans N j ».
*
* Ce module fait deux choses, et rien d'autre :
*
*   1. LIER — retrouver la bourse (et si possible LE programme) d'une
*      candidature. Par la clé quand elle existe (`scholarshipId`,
*      `programId`), sinon par rapprochement EXACT des titres
*      normalisés. Jamais d'approximation : un rapprochement flou qui
*      se trompe de bourse afficherait la date d'une autre.
*
*   2. RENDRE L'ÉTAT que la fiche publie — par etatCandidature()
*      (js/echeance.js), la seule autorité. On ne relit pas une date
*      ici, on assemble l'entrée qu'elle attend.
*
* CE QUE CE FICHIER NE FAIT JAMAIS
* --------------------------------
* Écrire. La `deadline` saisie appartient à l'étudiant. Quand le
* catalogue dit autre chose, on calcule une DIVERGENCE et on la rend ;
* l'interface la montre et propose un bouton que l'étudiant clique
* lui-même. Même doctrine que le moteur de fraîcheur : constat, jamais
* écriture.
*
* POURQUOI `programId` COMPTE
* ---------------------------
* etatCandidature() ne rend une date ferme sur une bourse à
* `echeanceVariable` (DAAD : une date par pays ; Eiffel : une par
* établissement) que si UNE seule échéance lui est passée. Plusieurs =
* vue d'ensemble, donc « Selon votre pays ». Connaître le programme,
* c'est rendre à l'étudiant SA date au lieu d'une mention.
*
* Aucun DOM, aucun Firestore : testable sous Node.
* ============================================================
*/

import { etatCandidature, analyserEcheance, joursAvant, formaterDate } from "./echeance.js";

/* ------------------------------------------------------------------
* 1. Normalisation des titres
* ------------------------------------------------------------------ */

/** Minuscules, accents retirés, espaces compactés. Vide reste vide. */
export function normaliserTitre(texte) {
return String(texte || "")
.normalize("NFD")
.replace(/[\u0300-\u036f]/g, "")
.toLowerCase()
.replace(/\s+/g, " ")
.trim();
}

/* ------------------------------------------------------------------
* 2. L'index
* ------------------------------------------------------------------ */

/**
* @param {{programmes:Array, universites:Array, bourses:Array}} catalogue
*        — sortie de chargerCatalogue() (js/catalog-data.js)
* @returns {{
*   bourseParId: Map, programmesParBourse: Map<string, Array>,
*   uniParId: Map, bourseParTitreNorm: Map, uniParNomNorm: Map,
*   titresAmbigus: Set, nomsAmbigus: Set
* }}
*/
export function indexerCatalogue(catalogue) {

const c = catalogue || {};
const programmes = Array.isArray(c.programmes) ? c.programmes : [];
const universites = Array.isArray(c.universites) ? c.universites : [];
const bourses = Array.isArray(c.bourses) ? c.bourses : [];

const bourseParId = new Map();
const bourseParTitreNorm = new Map();
const titresAmbigus = new Set();

for (const b of bourses) {
if (!b || !b.id) continue;
bourseParId.set(b.id, b);
const titre = normaliserTitre(b.title);
if (!titre) continue;
// Deux bourses au même titre normalisé : aucune des deux ne peut
// être désignée par son seul titre. On le retient plutôt que de
// laisser la dernière écrasée gagner.
if (bourseParTitreNorm.has(titre) && bourseParTitreNorm.get(titre).id !== b.id) {
titresAmbigus.add(titre);
} else {
bourseParTitreNorm.set(titre, b);
}
}

const uniParId = new Map();
const uniParNomNorm = new Map();
const nomsAmbigus = new Set();

for (const u of universites) {
if (!u || !u.id) continue;
uniParId.set(u.id, u);
const nom = normaliserTitre(u.name);
if (!nom) continue;
if (uniParNomNorm.has(nom) && uniParNomNorm.get(nom).id !== u.id) {
nomsAmbigus.add(nom);
} else {
uniParNomNorm.set(nom, u);
}
}

const programmesParBourse = new Map();

for (const p of programmes) {
if (!p || !p.scholarshipId) continue;
if (!programmesParBourse.has(p.scholarshipId)) programmesParBourse.set(p.scholarshipId, []);
programmesParBourse.get(p.scholarshipId).push(p);
}

return { bourseParId, programmesParBourse, uniParId, bourseParTitreNorm, uniParNomNorm, titresAmbigus, nomsAmbigus };

}

/* ------------------------------------------------------------------
* 3. La liaison
* ------------------------------------------------------------------ */

const AUCUN = Object.freeze({ scholarshipId: null, programId: null, source: "aucun", ambigu: false });

/**
* Retrouve la bourse et, si possible, LE programme d'une candidature.
*
* Ordre des règles — jamais de rapprochement approximatif :
*  1. `app.scholarshipId` présent → source "champ" (+ `app.programId`).
*  2. Sinon : université par `universityId`, sinon par nom normalisé
*     EXACT ; bourse par `scholarship` normalisé EXACT contre `title`.
*     - université + bourse connues → LE programme qui porte les deux.
*       Un seul → scholarshipId + programId ("deduit").
*       Plusieurs → "aucun", ambigu.
*       Aucun → la bourse seule ("deduit", programId null).
*     - bourse seule reconnue → scholarshipId seul.
*     - titre ambigu ou inconnu → "aucun".
*  3. Un titre vide ne rapproche rien.
*
* @returns {{scholarshipId:string|null, programId:string|null,
*            source:"champ"|"deduit"|"aucun", ambigu:boolean}}
*/
export function lierCandidature(app, index) {

const a = app || {};

if (!index) return { ...AUCUN };

// --- 1. La clé écrite ---
if (typeof a.scholarshipId === "string" && a.scholarshipId.trim()) {
return {
scholarshipId: a.scholarshipId.trim(),
programId: (typeof a.programId === "string" && a.programId.trim()) ? a.programId.trim() : null,
source: "champ",
ambigu: false
};
}

// --- 2. Le rapprochement exact ---
const titre = normaliserTitre(a.scholarship);

if (!titre) return { ...AUCUN };

if (index.titresAmbigus && index.titresAmbigus.has(titre)) {
return { ...AUCUN, ambigu: true };
}

const bourse = index.bourseParTitreNorm.get(titre);

if (!bourse) return { ...AUCUN };

// L'université : par identifiant, sinon par nom exact. Un nom
// ambigu vaut « inconnue » — on retombe alors sur la bourse seule.
let uni = null;

if (typeof a.universityId === "string" && a.universityId.trim()) {
uni = index.uniParId.get(a.universityId.trim()) || null;
}

if (!uni) {
const nom = normaliserTitre(a.university);
if (nom && !(index.nomsAmbigus && index.nomsAmbigus.has(nom))) {
uni = index.uniParNomNorm.get(nom) || null;
}
}

if (!uni) {
return { scholarshipId: bourse.id, programId: null, source: "deduit", ambigu: false };
}

const candidats = (index.programmesParBourse.get(bourse.id) || [])
.filter((p) => p.universityId === uni.id);

if (candidats.length === 1) {
return { scholarshipId: bourse.id, programId: candidats[0].id, source: "deduit", ambigu: false };
}

if (candidats.length > 1) {
return { ...AUCUN, ambigu: true };
}

return { scholarshipId: bourse.id, programId: null, source: "deduit", ambigu: false };

}

/* ------------------------------------------------------------------
* 4. L'état publié par la fiche, et la divergence avec la saisie
* ------------------------------------------------------------------ */

const RE_ISO = /^\d{4}-\d{2}-\d{2}$/;

/** Minuit UTC — pour compter des jours, pas des heures. */
function minuit(d) {
return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

/** Jours entre aujourd'hui et une date ISO de l'étudiant ; null si illisible. */
function joursEtudiant(iso, aujourdhui) {
if (typeof iso !== "string" || !RE_ISO.test(iso)) return null;
const cible = new Date(`${iso}T00:00:00Z`);
if (Number.isNaN(cible.getTime())) return null;
return Math.round((minuit(cible) - minuit(aujourdhui)) / 86400000);
}

/**
* L'ISO de la date ferme que etatCandidature() a retenue — la plus
* proche des échéances datées encore ouvertes. On ne la recalcule que
* lorsque l'état porte un décompte (`jours !== null`) : c'est la seule
* situation où une date unique a été affichée.
*/
function dateFermeDuCatalogue(echeances, etat, aujourdhui) {

if (!etat || etat.jours === null || etat.jours === undefined) return null;

const datees = (echeances || [])
.filter((t) => typeof t === "string" && t.trim())
.map((t) => analyserEcheance(t))
.filter((e) => e.etat === "datee" && e.date)
.map((e) => ({ iso: e.date, jours: joursAvant(e, aujourdhui) }))
.filter((e) => e.jours !== null && e.jours >= 0)
.sort((x, y) => x.jours - y.jours);

return datees.length ? datees[0].iso : null;

}

/**
* @param {Object} app - la candidature (document Firestore)
* @param {Object} index - sortie d'indexerCatalogue()
* @param {Date} [aujourdhui]
* @returns {{
*   lie: boolean,
*   lien: {scholarshipId, programId, source, ambigu},
*   etat: Object|null,          // sortie de etatCandidature()
*   divergence: null | {type:"date_differente"|"cycle_clos"|"date_variable", message:string, dateCatalogue:string|null},
*   dateCatalogue: string|null, // ISO de la date ferme affichée, s'il y en a une
*   bourse: Object|null, programme: Object|null
* }}
*/
export function etatDeLaCandidature(app, index, aujourdhui = new Date()) {

const a = app || {};
const lien = lierCandidature(a, index);

const nonLie = { lie: false, lien, etat: null, divergence: null, dateCatalogue: null, bourse: null, programme: null };

if (!lien.scholarshipId || !index) return nonLie;

const bourse = index.bourseParId.get(lien.scholarshipId);

if (!bourse) return nonLie;

const programmes = index.programmesParBourse.get(bourse.id) || [];

// Un programId qui ne correspond plus à rien (fiche retirée) vaut
// « pas de programme » : on retombe sur la vue d'ensemble.
const programme = lien.programId
? (programmes.find((p) => p.id === lien.programId) || null)
: null;

const echeances = programme ? [programme.deadline] : programmes.map((p) => p.deadline);

// L'entrée de etatCandidature() — la seule autorité, rien n'est
// recalculé à la main ici.
const etat = etatCandidature({
statut: programme ? [bourse.status, programme.status] : [bourse.status, ...programmes.map((p) => p.status)],
actif: bourse.isActive,
echeances,
periodeOuverture: (programme && programme.periodeOuverture) || bourse.periodeOuverture,
verifieLe: (programme && programme.verifieLe) || bourse.verifieLe,
echeanceVariable: (programme && programme.echeanceVariable) || bourse.echeanceVariable
}, aujourdhui);

const dateCatalogue = dateFermeDuCatalogue(echeances, etat, aujourdhui);

// --- La divergence : calculée, jamais appliquée ---
let divergence = null;

const jEtudiant = joursEtudiant(a.deadline, aujourdhui);
const dateEtudiante = jEtudiant !== null;

if (etat.ouvert === false && dateEtudiante && jEtudiant >= 0) {

divergence = {
type: "cycle_clos",
message: `Le cycle annoncé par l'organisme est clos.${etat.detail ? ` ${etat.detail}` : ""}`,
dateCatalogue: null
};

} else if (bourse.echeanceVariable && dateEtudiante && !programme) {

const quoi = bourse.echeanceVariable === "pays" ? "votre pays" : "l'établissement";

divergence = {
type: "date_variable",
message: `Cette bourse n'a pas de date unique : elle dépend de ${quoi}. Vérifiez la vôtre sur le portail officiel.`,
dateCatalogue: null
};

} else if (dateEtudiante && dateCatalogue && dateCatalogue !== a.deadline) {

divergence = {
type: "date_differente",
message: `Le catalogue annonce le ${formaterDate(dateCatalogue)}, votre fiche porte le ${formaterDate(a.deadline)}.`,
dateCatalogue
};

}

return { lie: true, lien, etat, divergence, dateCatalogue, bourse, programme };

}
