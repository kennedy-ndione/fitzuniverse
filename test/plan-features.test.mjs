/**
 * ============================================================
 * Tests unitaires — modèle d'accès et quotas ScholarBridge
 * ============================================================
 *
 * Lancer : npm test   (ou : node --test test/)
 *
 * Ces tests n'ouvrent aucun navigateur, ne chargent pas Firebase et
 * n'écrivent JAMAIS dans Firestore. Ils vérifient deux choses :
 *
 *  1. La décision de quota (js/plan-features.js), fonction pure.
 *  2. La cohérence entre la grille tarifaire (pricing-plans.js) et le
 *     modèle d'accès (PLAN_ORDER / PLAN_LABELS / DEFAULT_FEATURE_CONFIG).
 *
 * pricing-plans.js est un script classique, pas un module : il est
 * chargé ici dans un contexte `vm` avec un `window` factice. Ce détour
 * a un intérêt en soi — il vérifie au passage que le fichier expose
 * bien SCHOLARBRIDGE_PLANS sur `window`, ce dont dépendent
 * applications.js et admin/student-detail.js.
 * ============================================================
 */

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import vm from "node:vm";

import {
PLAN_ORDER,
PLAN_LABELS,
DEFAULT_FEATURE_CONFIG,
FEATURE_CATALOG,
resolveFeatureFlags,
isQuotaReached,
isUnlimitedQuota
} from "../js/plan-features.js";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");

// Charge pricing-plans.js comme le ferait un navigateur.
function chargerGrille() {
const source = readFileSync(join(racine, "pricing-plans.js"), "utf8");
const bacASable = { window: {} };
vm.createContext(bacASable);
vm.runInContext(source, bacASable);
return bacASable.window;
}

const fenetre = chargerGrille();
const OFFRES = fenetre.SCHOLARBRIDGE_PLANS;

const OFFRES_PAYANTES = PLAN_ORDER.filter((id) => id !== "gratuit");

// ============================================================
// 1. Décision de quota
// ============================================================

test("Standard (essentiel) : les 5 premières candidatures passent, la 6e est bloquée", () => {

const quota = OFFRES.essentiel.maxAccompaniedApplications;

assert.equal(quota, 5, "la grille 2026-08-15 doit accorder 5 candidatures à Standard");

// `currentCount` = nombre de candidatures DÉJÀ enregistrées.
assert.equal(isQuotaReached(quota, 0), false, "1re candidature");
assert.equal(isQuotaReached(quota, 4), false, "5e candidature");
assert.equal(isQuotaReached(quota, 5), true, "6e candidature : doit être bloquée");
assert.equal(isQuotaReached(quota, 6), true, "au-delà : reste bloquée");

});

test("Premier Dossier : une seule candidature, la 2e est bloquée", () => {

const quota = OFFRES["premier-dossier"].maxAccompaniedApplications;

assert.equal(quota, 1);
assert.equal(isQuotaReached(quota, 0), false);
assert.equal(isQuotaReached(quota, 1), true);

});

test("chaque offre bloque exactement à son quota annoncé", () => {

for (const id of OFFRES_PAYANTES) {

const quota = OFFRES[id].maxAccompaniedApplications;

if (isUnlimitedQuota(quota)) continue;

assert.equal(isQuotaReached(quota, quota - 1), false, `${id} : la dernière candidature incluse doit passer`);
assert.equal(isQuotaReached(quota, quota), true, `${id} : la suivante doit être bloquée`);

}

});

test("Signature : illimité, ne bloque jamais", () => {

const quota = OFFRES.signature.maxAccompaniedApplications;

assert.equal(quota, Infinity, "la convention illimitée est Infinity, pas null ni undefined");
assert.equal(isUnlimitedQuota(quota), true);

for (const nb of [0, 1, 12, 5000]) {
assert.equal(isQuotaReached(quota, nb), false, `${nb} candidatures ne doivent pas bloquer`);
}

});

test("un quota absent, nul ou à zéro ne bloque pas ici", () => {

// L'accès à la page est gardé en amont par requireFeature() : ce
// n'est pas au plafond de refuser une offre inexistante.
for (const quota of [null, undefined, 0]) {
assert.equal(isQuotaReached(quota, 99), false, `quota=${quota}`);
}

});

// ============================================================
// 2. Étanchéité du tiers gratuit
// ============================================================

test("le tiers gratuit ne débloque aucune fonctionnalité payante", () => {

const flags = resolveFeatureFlags(null);

for (const { key } of FEATURE_CATALOG) {
assert.equal(flags[key].gratuit, false, `"${key}" ne doit pas être inclus dans le gratuit`);
}

});

test("le gratuit n'a ni entrée tarifaire ni quota", () => {

assert.equal(OFFRES.gratuit, undefined, "gratuit ne doit pas être une offre achetable");

});

test("toute offre payante donne 100% des outils Fitz", () => {

// "advisor" (ajouté 2026-08-07) est dans FEATURE_CATALOG pour réutiliser
// le même mécanisme de verrouillage, mais ce n'est PAS un outil Fitz —
// voir la note dans js/plan-features.js. Il a sa propre assertion
// ci-dessous et ne doit pas casser celle-ci.
const OUTILS_FITZ = FEATURE_CATALOG.filter(({ key }) => key !== "advisor");

const flags = resolveFeatureFlags(null);

for (const id of OFFRES_PAYANTES) {
for (const { key } of OUTILS_FITZ) {
assert.equal(flags[key][id], true, `"${key}" doit être inclus dans ${id}`);
}
}

});

test("\"advisor\" (conseiller humain) n'est vrai que pour les offres d'accompagnement humain", () => {

const flags = resolveFeatureFlags(null);
const OFFRES_AVEC_CONSEILLER = ["signature-focus", "signature"];

for (const id of OFFRES_PAYANTES) {
assert.equal(
flags.advisor[id],
OFFRES_AVEC_CONSEILLER.includes(id),
`"advisor" pour ${id} devrait être ${OFFRES_AVEC_CONSEILLER.includes(id)}`
);
}

});

// ============================================================
// 3. Cohérence grille ↔ modèle d'accès
// ============================================================

test("chaque formule de PLAN_ORDER existe dans la grille tarifaire", () => {

for (const id of OFFRES_PAYANTES) {
assert.ok(OFFRES[id], `${id} est dans PLAN_ORDER mais absent de pricing-plans.js`);
}

});

test("PLAN_ORDER suit le prix croissant", () => {

const prix = OFFRES_PAYANTES.map((id) => OFFRES[id].priceFCFA);
const trie = [...prix].sort((a, b) => a - b);

assert.deepEqual(prix, trie, `l'ordre conditionne l'upsell : ${prix.join(" → ")}`);

});

// Reproduit nextPlanId() (js/access-guard.js) : l'entrée suivante dans
// l'échelle, en sautant les offres `deprecated` — non importable
// directement ici, ce module dépend de firebase-config.js (voir l'en-tête
// de ce fichier sur pricing-plans.js chargé en `vm`, même raisonnement).
function nextPlanIdReproduit(planId) {
const index = PLAN_ORDER.indexOf(planId);
if (index === -1) return null;
for (let i = index + 1; i < PLAN_ORDER.length; i++) {
const offre = OFFRES[PLAN_ORDER[i]];
if (!offre || offre.deprecated !== true) return PLAN_ORDER[i];
}
return null;
}

// Remis en vente le 2026-09-01 (décision utilisateur) : il manquait
// une marche entre le Pass Découverte et Standard. L'assertion inverse
// vivait ici depuis la dépréciation du 2026-08-15 — elle prévoyait
// elle-même sa mise à jour, c'est fait.
test("premier-dossier est vendable : c'est la première offre proposée à un compte gratuit", () => {

assert.notEqual(OFFRES["premier-dossier"].deprecated, true, "cette assertion doit être mise à jour si premier-dossier repart de la vente — et son bouton doit quitter offers.html en même temps (test/offers-plans.test.mjs)");
assert.equal(nextPlanIdReproduit("gratuit"), "premier-dossier", "l'upsell d'un compte gratuit doit mener à la marche la moins chère, pas la sauter");

});

test("premium est déprécié : la formule suivante après Avancé est désormais Renforcé", () => {

assert.equal(OFFRES.premium.deprecated, true, "cette assertion doit être mise à jour si premium redevient vendable");
assert.equal(nextPlanIdReproduit("accompagnement"), "signature-focus", "premium (déprécié) doit être sauté par l'upsell");

});

test("une offre dépréciée reste résolvable par identifiant (compte existant)", () => {

// C'est tout le sens de la convention `deprecated` : ne jamais
// supprimer l'entrée, seulement l'exclure des surfaces de vente.
// Liste dérivée de la grille, plus codée en dur : le 2026-09-01,
// premier-dossier a quitté les dépréciées et cette boucle aurait
// continué de le tester sous un nom devenu faux.
const depreciees = Object.keys(OFFRES).filter((id) => OFFRES[id].deprecated === true);

assert.ok(depreciees.length > 0, "au moins une offre dépréciée doit exister pour que cette garde ait un sens");

for (const id of depreciees) {
assert.ok(OFFRES[id], `${id} doit rester dans SCHOLARBRIDGE_PLANS malgré deprecated:true`);
assert.equal(typeof OFFRES[id].maxAccompaniedApplications, "number", `${id} doit garder un quota résolvable`);
}

});

test("Fitz Express n'est pas une formule", () => {

assert.ok(OFFRES.fitzExpress, "le pass doit exister dans la grille");
assert.equal(PLAN_ORDER.includes("fitzExpress"), false, "mais jamais dans l'échelle des formules");
assert.equal(OFFRES.fitzExpress.type, "pass");

});

test("PLAN_LABELS et DEFAULT_FEATURE_CONFIG couvrent exactement PLAN_ORDER", () => {

assert.deepEqual(Object.keys(PLAN_LABELS).sort(), [...PLAN_ORDER].sort());

for (const { key } of FEATURE_CATALOG) {
assert.deepEqual(
Object.keys(DEFAULT_FEATURE_CONFIG[key]).sort(),
[...PLAN_ORDER].sort(),
`"${key}" ne couvre pas toutes les formules`
);
}

});

// ============================================================
// 4. Règles de libellé et de devise
// ============================================================

// « Signature » partout depuis le 2026-08-30 (distinction FitzUniverse/
// Fitz, DESIGN_SYSTEM.md) : seul forfait avec conseiller humain, il ne
// porte le nom ni de l'assistant ni de l'ancienne marque.
test("Signature : le même libellé court en interface et dans la grille", () => {

assert.equal(PLAN_LABELS.signature, "Signature");
assert.equal(OFFRES.signature.label, "Signature");

});

test("aucun prix en euros ne subsiste dans la grille", () => {

for (const [id, offre] of Object.entries(OFFRES)) {
assert.equal("priceEUR" in offre, false, `${id} porte encore un priceEUR`);
assert.equal(typeof offre.priceFCFA, "number", `${id} doit avoir un prix en FCFA`);
}

});

test("chaque offre porte les champs affichés par la page de paiement", () => {

for (const [id, offre] of Object.entries(OFFRES)) {
for (const champ of ["id", "label", "icon", "badge", "tagline", "fitzAccess"]) {
assert.ok(offre[champ], `${id} : champ "${champ}" manquant → "undefined" à l'écran`);
}
}

});

test("pricing-plans.js expose bien la grille sur window", () => {

// C'est ce dont dépendent applications.js et admin/student-detail.js.
assert.equal(typeof fenetre.SCHOLARBRIDGE_PLANS, "object");

});
