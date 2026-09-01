// ============================================================
// FitzUniverse — validation HORS LIGNE d'un lot de catalogue
// (scripts/data/lotN.mjs). Module PUR : aucun réseau, aucun DOM —
// partagé entre le runner (scripts/lot.mjs, étape `analyser`) et la
// suite de tests (test/lot31-data.test.mjs), pour que ce que le test
// vérifie soit exactement ce que le runner refuse.
//
// Ce qui se vérifie ICI (sans la base) :
//   - unicité des identifiants (universités, bourses, programmes) ;
//   - énumérés `funder` (5 valeurs) et `entryPoint` (2 valeurs) ;
//   - `ageMax` : jamais `tous` + clé de cycle, entiers 1..99, jamais {} ;
//   - garde de cohérence PAYS, comparaison STRICTE accents compris —
//     ne PAS la normaliser : c'est sa rigidité qui a attrapé une faute
//     d'accent au lot 29 ;
//   - niveaux lus sur le champ `levels` de la BOURSE (jamais dans les
//     liens) : une bourse LIÉE sans niveau bloque le lot ;
//   - bourses orphelines (sans lien) NOMMÉES en clair — un choix
//     assumé (al-azhar au lot 31, vanier au lot 29), pas une erreur ;
//   - forme PATCHES (2026-08-31) : mises à jour PARTIELLES de documents
//     EXISTANTS, voir validerPatches() plus bas.
//
// Le croisement avec la base (documents déjà existants, couples déjà
// liés, valeurs actuelles d'un patch) est l'affaire de `analyser` dans
// scripts/lot.mjs : il exige le réseau et n'a pas sa place ici.
// ============================================================

export const FUNDERS = ["gouvernement", "universite", "region", "organisation", "entreprise"];
export const ENTRY_POINTS = ["bourse", "universite"];

// Les seules collections qu'un patch peut viser. Tout autre nom est
// refusé : un patch est une écriture ciblée sur un document existant,
// pas un moyen détourné d'écrire n'importe où.
export const COLLECTIONS_PATCHABLES = ["scholarships", "universities", "programs"];

/**
* GARDE DU PORTAIL DE CANDIDATURE (2026-08-31)
* ---------------------------------------------
* Le portail d'ADMISSION vit sur l'UNIVERSITÉ, dans
* `universities.applicationPortalUrl`. Un document `programs` ne porte
* `applicationUrl` que pour une EXCEPTION RÉELLE : un portail
* véritablement distinct de celui de l'établissement — le cas fondateur
* est le portail DOCTORAL du Politecnico di Milano, séparé de son
* portail licence/master.
*
* POURQUOI CETTE GARDE EXISTE. La migration du 2026-08-10
* (admin/migrate-portal.js) avait déplacé le portail vers l'université
* sur 36 établissements, avec cette unique exception. Les lots 19 à 31
* ont réintroduit le champ au niveau programme sans que rien ne
* l'empêche : au 2026-08-31, 107 des 335 programmes portaient leur
* propre `applicationUrl`. Comme details.js résout
* `program.applicationUrl || university.applicationPortalUrl`, LE
* PROGRAMME PRIME — et le lot 33, qui avait corrigé 24 universités,
* n'a rien changé à l'écran pour les 52 programmes concernés (les trois
* fiches Chevening renvoyaient toujours l'abonné vers chevening.org).
*
* Sans garde, le prochain lot déferait le nettoyage à venir, exactement
* comme les lots 19-31 ont défait celui du 10 août. Le motif explicite
* rend la dérogation VISIBLE en relecture, au lieu d'être un champ de
* plus qui passe inaperçu.
*
* VIDER RESTE TOUJOURS AUTORISÉ ("" ou null) : c'est le remède, jamais
* la maladie — une valeur vide ne peut pas réintroduire un portail.
* Le nettoyage à venir n'a donc PAS besoin de porter le motif sur ses
* ~100 entrées, ce qui aurait vidé le flag de son sens.
*
* @param {string} ou - libellé du document, pour le message
* @param {Object} champs - champs que le lot veut écrire
* @param {string} [override] - `overrideApplicationUrl` de l'entrée
* @returns {?string} message d'erreur, ou null si l'écriture est permise
*/
export function refusPortailProgramme(ou, champs, override) {

if (!champs || !Object.prototype.hasOwnProperty.call(champs, "applicationUrl")) return null;

const valeur = champs.applicationUrl;

// Vider ou supprimer : toujours permis, c'est le retour à la règle.
if (valeur === "" || valeur === null || valeur === undefined) return null;

if (typeof override === "string" && override.trim()) return null;

return `${ou} : écrire "applicationUrl" sur un document \`programs\` est refusé. `
+ `Le portail de candidature vit sur l'UNIVERSITÉ (universities.applicationPortalUrl) ; `
+ `un programme ne le porte que pour une exception réelle — un portail véritablement distinct `
+ `de celui de l'établissement, comme le portail doctoral du Politecnico di Milano. `
+ `details.js résout \`program.applicationUrl || university.applicationPortalUrl\` : `
+ `une URL posée ici PRIME et rend le champ de l'université inopérant. `
+ `Si c'est bien une exception, ajoutez à l'entrée : overrideApplicationUrl: "<motif>". `
+ `Vider le champ ("" ou null) reste toujours permis, sans motif.`;

}

// Convention d'identifiant de programme du lot 29 :
// {universityId}__{scholarshipId}__{licence|master|doctorat}
export const SLUG_NIVEAU = { Licence: "licence", Master: "master", Doctorat: "doctorat" };

function limiteInvalide(valeur) {
return !Number.isInteger(valeur) || valeur < 1 || valeur > 99;
}

/**
* PATCHES — mises à jour PARTIELLES de documents EXISTANTS (2026-08-31).
* Les trois autres formes du runner ne savent que CRÉER ; un patch
* corrige un champ précis d'un document déjà en base, sans jamais
* réécrire le reste.
*
*   { collection, id, attendu?, champs, motif }
*
*   collection : "scholarships" | "universities" | "programs"
*   id         : identifiant du document EXISTANT
*   champs     : les SEULS champs à écrire
*   attendu    : facultatif — valeurs supposées actuellement en base,
*                garde contre un document modifié entre-temps
*   motif      : obligatoire — un patch sans justification n'est pas
*                relisible six mois plus tard
*
* UNE CHAÎNE VIDE EST UNE VALEUR LÉGITIME, pas une absence : elle veut
* dire « vider ce champ ». Les trois universités marocaines publiques du
* lot 33 n'ont aucun portail d'admission ouvert aux étrangers, et
* details.js masque proprement le bouton sur "" — mieux vaut rien
* qu'une URL qui n'est pas un portail. Ne jamais « corriger » un "" en
* le traitant comme un champ omis.
*
* Convention prévue mais NON UTILISÉE à ce jour : une valeur `null`
* dans `champs` signifierait SUPPRIMER le champ (deleteField()). Aucun
* lot n'en a besoin ; le jour où l'un en aura besoin, c'est ici et dans
* l'étape `ecrire` de scripts/lot.mjs qu'il faut l'implémenter.
*/
export function validerPatches(PATCHES = []) {

const erreurs = [];
const vus = new Set();

for (const patch of PATCHES) {

const p = patch || {};
const ou = `${p.collection || "?"}/${p.id || "?"}`;

if (!p.id) {
erreurs.push("Patch sans identifiant de document.");
continue;
}

if (!COLLECTIONS_PATCHABLES.includes(p.collection)) {
erreurs.push(`Patch ${ou} : collection "${p.collection}" hors énuméré (${COLLECTIONS_PATCHABLES.join(", ")}).`);
}

// Unicité par (collection, id) : deux patches sur le même document
// dans un même lot, c'est un conflit d'intention — le second
// écraserait le premier sans que la relecture le voie.
const cle = `${p.collection}||${p.id}`;
if (vus.has(cle)) erreurs.push(`Patch en double sur ${ou} — un seul patch par document et par lot.`);
vus.add(cle);

if (!p.motif || !String(p.motif).trim()) {
erreurs.push(`Patch ${ou} sans motif — obligatoire, un patch sans justification n'est pas relisible.`);
}

const champs = p.champs && typeof p.champs === "object" && !Array.isArray(p.champs) ? p.champs : null;
if (!champs || !Object.keys(champs).length) {
erreurs.push(`Patch ${ou} : "champs" absent ou vide — un patch qui n'écrit rien n'a pas lieu d'être.`);
continue;
}

// Garde du portail : un patch est le vecteur le plus direct pour
// reposer une URL au niveau programme.
if (p.collection === "programs") {
const refus = refusPortailProgramme(`Patch ${ou}`, champs, p.overrideApplicationUrl);
if (refus) erreurs.push(refus);
}

// `attendu` ne garde que des champs réellement patchés : garder une
// valeur attendue sur un champ qu'on ne touche pas donnerait une
// fausse impression de vérification.
if ("attendu" in p && p.attendu !== undefined && p.attendu !== null) {
const attendu = p.attendu;
if (typeof attendu !== "object" || Array.isArray(attendu)) {
erreurs.push(`Patch ${ou} : "attendu" doit être un objet.`);
} else {
const intruses = Object.keys(attendu).filter((c) => !(c in champs));
if (intruses.length) {
erreurs.push(`Patch ${ou} : "attendu" porte des clés absentes de "champs" (${intruses.join(", ")}) — il doit en être un sous-ensemble.`);
}
}
}

}

return erreurs;

}

/**
* Valide le contenu d'un lot et construit le plan des programmes à
* créer (lot-interne). Renvoie { erreurs, avertissements, orphelines,
* programmes, patches, attendus } — `erreurs` non vide = lot bloqué.
* Un lot peut porter PATCHES seul, ou en plus des trois autres formes.
*/
export function validerLot({ UNIVERSITIES = [], SCHOLARSHIPS = [], LINKS = [], PATCHES = [] }) {

const erreurs = [];
const avertissements = [];

// --- Unicité des identifiants, chaque famille séparément.
const idsU = new Set();
for (const u of UNIVERSITIES) {
if (!u.id) erreurs.push("Université sans identifiant.");
else if (idsU.has(u.id)) erreurs.push(`Identifiant d'université en double : "${u.id}".`);
idsU.add(u.id);
if (!u.data || !u.data.name) erreurs.push(`Université "${u.id}" sans nom.`);
if (!u.data || !u.data.country) erreurs.push(`Université "${u.id}" sans pays.`);
}

const idsB = new Set();
const boursesParId = new Map();
for (const s of SCHOLARSHIPS) {
if (!s.id) { erreurs.push("Bourse sans identifiant."); continue; }
if (idsB.has(s.id)) erreurs.push(`Identifiant de bourse en double : "${s.id}".`);
idsB.add(s.id);
boursesParId.set(s.id, s.data || {});

const d = s.data || {};
if (!d.title) erreurs.push(`Bourse "${s.id}" sans titre.`);
if (!d.country) erreurs.push(`Bourse "${s.id}" sans pays.`);

// Énumérés — un champ ABSENT est un inconnu légitime ; une valeur
// hors énuméré est une faute de saisie, jamais « à peu près bon ».
if ("funder" in d && !FUNDERS.includes(d.funder)) {
erreurs.push(`Bourse "${s.id}" : funder "${d.funder}" hors énuméré (${FUNDERS.join(", ")}).`);
}
if ("entryPoint" in d && !ENTRY_POINTS.includes(d.entryPoint)) {
erreurs.push(`Bourse "${s.id}" : entryPoint "${d.entryPoint}" hors énuméré (${ENTRY_POINTS.join(", ")}).`);
}

// ageMax : mêmes règles que le formulaire admin (js/age-limits.js).
if ("ageMax" in d) {
const a = d.ageMax;
if (!a || typeof a !== "object" || Array.isArray(a)) {
erreurs.push(`Bourse "${s.id}" : ageMax doit être un objet {tous?, licence?, master?, doctorat?}.`);
} else {
const cles = Object.keys(a);
if (!cles.length) erreurs.push(`Bourse "${s.id}" : ageMax vide ({}) — omettre le champ, un champ absent est un inconnu.`);
const inconnues = cles.filter((c) => !["tous", "licence", "master", "doctorat"].includes(c));
if (inconnues.length) erreurs.push(`Bourse "${s.id}" : clé(s) ageMax inconnue(s) : ${inconnues.join(", ")}.`);
if ("tous" in a && cles.some((c) => c !== "tous")) {
erreurs.push(`Bourse "${s.id}" : ageMax.tous est EXCLUSIF des clés de cycle.`);
}
for (const c of cles) {
if (["tous", "licence", "master", "doctorat"].includes(c) && limiteInvalide(a[c])) {
erreurs.push(`Bourse "${s.id}" : ageMax.${c} = ${JSON.stringify(a[c])} — entier entre 1 et 99 attendu.`);
}
}
}
}

// Niveaux : vocabulaire fermé quand ils existent.
const niveaux = Array.isArray(d.levels) ? d.levels : [];
for (const n of niveaux) {
if (!SLUG_NIVEAU[n]) erreurs.push(`Bourse "${s.id}" : niveau inattendu "${n}" (attendu : Licence, Master, Doctorat).`);
}
}

// --- Liens et plan des programmes.
const liees = new Set();
const programmes = [];
const liensExternes = [];
const idsP = new Set();

for (const lien of LINKS) {

if (!lien.scholarshipId) { erreurs.push("Lien sans scholarshipId."); continue; }
liees.add(lien.scholarshipId);

// Une bourse liée peut être DÉJÀ EN BASE plutôt que dans le lot :
// c'est le cas d'un lot qui crée les universités manquantes pour
// rattacher des bourses orphelines existantes (lot 32 — les 12
// orphelines repérées au lot 29). Les NIVEAUX vivant sur la bourse,
// ils sont illisibles hors ligne : on valide ici tout ce qui peut
// l'être (université du lot, garde pays) et on délègue la résolution
// des niveaux à `analyser`, qui lit la base.
const bourse = boursesParId.get(lien.scholarshipId);
const externe = !bourse;

const niveaux = bourse && Array.isArray(bourse.levels) ? bourse.levels : [];
if (bourse && !niveaux.length) {
erreurs.push(`Bourse LIÉE sans niveau : "${lien.scholarshipId}" — les niveaux se lisent sur le champ levels de la bourse, jamais dans les liens.`);
continue;
}

const universityIds = Array.isArray(lien.universityIds) ? lien.universityIds : [];
if (!universityIds.length) {
erreurs.push(`Lien "${lien.scholarshipId}" sans universityIds.`);
continue;
}

// Universités retenues pour un lien externe, après la garde pays.
const universitesValidees = [];

// Second vecteur de la garde du portail : un lien de création qui
// poserait `applicationUrl` sur les programmes qu'il engendre. Le
// champ est aujourd'hui ignoré par la construction ci-dessous, mais
// il vaut mieux REFUSER que d'ignorer en silence — un auteur de lot
// croirait sinon avoir posé une valeur qui n'existe pas.
if ("applicationUrl" in lien) {
const refus = refusPortailProgramme(`Lien "${lien.scholarshipId}"`, { applicationUrl: lien.applicationUrl }, lien.overrideApplicationUrl);
if (refus) erreurs.push(refus);
}

for (const uid of universityIds) {

const uni = UNIVERSITIES.find((u) => u.id === uid);
if (!uni) {
erreurs.push(`Lien "${lien.scholarshipId}" : université hors lot "${uid}".`);
continue;
}

// GARDE PAYS — comparaison STRICTE, accents compris, à dessein.
if ((uni.data.country || "") !== (lien.pays || "")) {
erreurs.push(`Garde pays : "${uid}" est en "${uni.data.country || "?"}" mais le lien "${lien.scholarshipId}" annonce "${lien.pays || "?"}".`);
continue;
}

// Bourse hors lot : les niveaux se lisent en base, `analyser` s'en
// charge. On a déjà garanti ici que l'université existe dans le lot
// et que son pays correspond au lien.
if (externe) {
universitesValidees.push(uid);
continue;
}

for (const niveau of niveaux) {
const id = `${uid}__${lien.scholarshipId}__${SLUG_NIVEAU[niveau]}`;
if (idsP.has(id)) {
erreurs.push(`Collision d'identifiant de programme : "${id}".`);
continue;
}
idsP.add(id);
const programme = { id, universityId: uid, scholarshipId: lien.scholarshipId, level: niveau };
// La langue d'enseignement n'est écrite que lorsqu'elle a été
// VÉRIFIÉE (champ non vide du lien) — vide = inconnue, jamais "".
if (lien.language) programme.language = lien.language;
programmes.push(programme);
}

}

if (externe && universitesValidees.length) {
liensExternes.push({
scholarshipId: lien.scholarshipId,
universityIds: universitesValidees,
language: lien.language || "",
motif: lien.motif || ""
});
}

}

// --- Orphelines : nommées, pas « corrigées ».
const orphelines = SCHOLARSHIPS.filter((s) => !liees.has(s.id)).map((s) => s.id);

erreurs.push(...validerPatches(PATCHES));

return {
erreurs,
avertissements,
orphelines,
programmes,
// Liens vers des bourses DÉJÀ EN BASE : `analyser` y lit les niveaux
// et complète le plan (voir le commentaire dans la boucle LINKS).
liensExternes,
patches: PATCHES,
attendus: {
universites: UNIVERSITIES.length,
bourses: SCHOLARSHIPS.length,
// Le compte annoncé ne peut pas inclure les programmes issus des
// liens externes : ils dépendent des niveaux lus en base.
programmes: programmes.length,
patches: PATCHES.length
}
};

}

/**
* BOURSES SANS PROGRAMME — l'indicateur de santé du moteur payant.
* ----------------------------------------------------------------
* `recommendPrograms()` (js/recommend-programs.js) itère sur la
* collection `programs`, jamais sur `scholarships` : une bourse qu'aucun
* programme ne référence est donc INVISIBLE au moteur de recommandation,
* c'est-à-dire à la fonctionnalité facturée. C'était le défaut le plus
* coûteux du catalogue au lot 29 (35 bourses sur 131), et rien ne le
* mesurait.
*
* Renvoie la LISTE des identifiants, pas seulement leur nombre : un
* compteur seul ne permet pas d'agir.
*
* Fonction pure — testée sur des données factices, sans Firestore
* (test/lot-patches.test.mjs).
*
* @param {Array<{id:string}>} bourses
* @param {Array<{scholarshipId?:string}>} programmes
* @returns {Array<string>} identifiants des bourses orphelines
*/
export function boursesSansProgramme(bourses, programmes) {

const liees = new Set(
(programmes || []).map((p) => p && p.scholarshipId).filter(Boolean)
);

return (bourses || []).filter((b) => b && !liees.has(b.id)).map((b) => b.id);

}
