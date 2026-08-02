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

test("Essentiel : les 3 premières candidatures passent, la 4e est bloquée", () => {

const quota = OFFRES.essentiel.maxAccompaniedApplications;

assert.equal(quota, 3, "la grille doit accorder 3 candidatures à Essentiel");

// `currentCount` = nombre de candidatures DÉJÀ enregistrées.
assert.equal(isQuotaReached(quota, 0), false, "1re candidature");
assert.equal(isQuotaReached(quota, 1), false, "2e candidature");
assert.equal(isQuotaReached(quota, 2), false, "3e candidature");
assert.equal(isQuotaReached(quota, 3), true, "4e candidature : doit être bloquée");
assert.equal(isQuotaReached(quota, 4), true, "au-delà : reste bloquée");

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

const flags = resolveFeatureFlags(null);

for (const id of OFFRES_PAYANTES) {
for (const { key } of FEATURE_CATALOG) {
assert.equal(flags[key][id], true, `"${key}" doit être inclus dans ${id}`);
}
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

test("la première offre proposée à un compte gratuit est Premier Dossier", () => {

// Reproduit nextPlanId() : l'entrée suivante dans l'échelle.
assert.equal(PLAN_ORDER[PLAN_ORDER.indexOf("gratuit") + 1], "premier-dossier");

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

test("Signature : libellé court en interface, nom de marque en marketing", () => {

assert.equal(PLAN_LABELS.signature, "Signature");
assert.equal(OFFRES.signature.label, "ScholarBridge Signature");

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
