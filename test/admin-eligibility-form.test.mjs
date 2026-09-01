/**
 * ============================================================
 * Tests unitaires — formulaire d'éligibilité de l'admin
 * (admin/scholarships.js : ouvrir une bourse puis l'enregistrer
 * sans rien toucher ne doit JAMAIS modifier son champ eligibility)
 * ============================================================
 *
 * Lancer : npm test   (ou : node --test test/)
 *
 * Le bug qui a imposé ce test : buildEligibilityFromForm() court-
 * circuitait sur `if (!scope) return null;` — or 9 bourses du lot 20
 * (Chevening, MEXT, Global Korea, Türkiye Bursları…) sont enregistrées
 * en « note seule » (note présente, scope absent). Ouvrir puis
 * enregistrer une de ces fiches effaçait sa note en silence.
 *
 * admin/scholarships.js est un module navigateur (imports CDN Firebase,
 * DOM) : impossible à importer sous Node. Les quatre fonctions du bloc
 * éligibilité sont donc EXTRAITES DU FICHIER RÉEL et évaluées dans un
 * contexte vm avec des éléments factices — même approche que le
 * chargement de pricing-plans.js dans plan-features.test.mjs : c'est le
 * texte réellement déployé qui est testé, pas une copie.
 * ============================================================
 */

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import vm from "node:vm";

import { GROUPES } from "../js/eligibility-countries.js";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = readFileSync(join(racine, "admin", "scholarships.js"), "utf8");

// Extrait une déclaration `function nom(...) {...}` complète du fichier,
// par équilibrage d'accolades (les fonctions visées sont au niveau module).
function extraireFonction(nom) {
const debut = source.indexOf(`function ${nom}(`);
assert.notEqual(debut, -1, `function ${nom} introuvable dans admin/scholarships.js`);
let i = source.indexOf("{", debut);
let profondeur = 0;
do {
if (source[i] === "{") profondeur++;
if (source[i] === "}") profondeur--;
i++;
} while (profondeur > 0 && i < source.length);
return source.slice(debut, i);
}

// Recrée le bloc éligibilité du formulaire avec des éléments factices,
// puis évalue les fonctions réelles dans ce contexte.
function monterFormulaire() {

const contexte = {
eligibilityScopeInput: { value: "" },
eligibilityGroupsField: { hidden: true },
eligibilityIncludeField: { hidden: true },
eligibilityIncludeInput: { value: "" },
eligibilityExcludeField: { hidden: true },
eligibilityExcludeInput: { value: "" },
eligibilityNoteField: { hidden: true },
eligibilityNoteInput: { value: "" },
eligibilityGroupCheckboxes: Object.keys(GROUPES).map((id) => ({ value: id, checked: false }))
};

vm.createContext(contexte);

for (const nom of ["parseIsoCodes", "syncEligibilityFields", "buildEligibilityFromForm", "fillEligibilityForm"]) {
vm.runInContext(`${extraireFonction(nom)}\nthis.${nom} = ${nom};`, contexte);
}

return contexte;

}

// Les objets construits DANS le contexte vm portent l'Object.prototype
// de ce contexte, pas celui du test : deepStrictEqual les refuse alors
// qu'ils sont identiques. Normalisation par JSON avant comparaison.
function valeur(objet) {
return objet === null ? null : JSON.parse(JSON.stringify(objet));
}

// Valeurs RÉELLES du champ eligibility en base (Firestore, relevées le
// 2026-08-30 via l'API REST) — pas des formes inventées.
const CHEVENING = {
note: "Environ 160 pays éligibles, dont le Sénégal et la plupart des pays d'Afrique. La liste complète est publiée sur chevening.org."
};

const COMMONWEALTH_MASTERS = {
scope: "groupes",
groups: ["commonwealth"],
note: "Réservée aux pays du Commonwealth à revenu faible ou intermédiaire. Le Sénégal n'est PAS membre du Commonwealth. En Afrique de l'Ouest, seuls la Gambie, le Ghana, le Nigeria, la Sierra Leone et le Togo sont éligibles."
};

test("note seule (Chevening) : ouvrir puis enregistrer sans toucher conserve la note", () => {
const f = monterFormulaire();
f.fillEligibilityForm(CHEVENING);
assert.deepEqual(valeur(f.buildEligibilityFromForm()), { note: CHEVENING.note });
});

test("scope groupes (Commonwealth Master's) : aller-retour sans modification, aucune régression", () => {
const f = monterFormulaire();
f.fillEligibilityForm(COMMONWEALTH_MASTERS);
assert.deepEqual(valeur(f.buildEligibilityFromForm()), {
scope: "groupes",
groups: ["commonwealth"],
note: COMMONWEALTH_MASTERS.note
});
});

test("formulaire vierge : toujours null (même effet que le champ absent)", () => {
const f = monterFormulaire();
f.fillEligibilityForm(null);
assert.equal(f.buildEligibilityFromForm(), null);
});

test("le champ note reste visible même sans scope — sinon les 9 bourses « note seule » sont inéditables", () => {
const f = monterFormulaire();
f.fillEligibilityForm(CHEVENING);
assert.equal(f.eligibilityNoteField.hidden, false);
f.fillEligibilityForm(null);
assert.equal(f.eligibilityNoteField.hidden, false);
});

test("scope monde + note (Türkiye Araştırma) : les deux survivent à l'aller-retour", () => {
const f = monterFormulaire();
const doc = { scope: "monde", note: "Ouverte à toutes les nationalités ; moins de 50 ans." };
f.fillEligibilityForm(doc);
assert.deepEqual(valeur(f.buildEligibilityFromForm()), doc);
});
