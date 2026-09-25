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
DROITS_UNIVERSELS,
isQuotaReached,
isUnlimitedQuota,
nextPlanId,
unlockingPlans
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

// Jusqu'au 2026-09-24 : « Standard (essentiel) », 5 candidatures —
// formule supprimée. Son successeur en vente est essentiel-4.
test("Essentiel : les 4 premières candidatures passent, la 5e est bloquée", () => {

const quota = OFFRES["essentiel-4"].maxAccompaniedApplications;

assert.equal(quota, 4, "la grille A doit accorder 4 candidatures à Essentiel");

// `currentCount` = nombre de candidatures DÉJÀ enregistrées.
assert.equal(isQuotaReached(quota, 0), false, "1re candidature");
assert.equal(isQuotaReached(quota, 3), false, "4e candidature");
assert.equal(isQuotaReached(quota, 4), true, "5e candidature : doit être bloquée");
assert.equal(isQuotaReached(quota, 5), true, "au-delà : reste bloquée");

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

// Jusqu'au 2026-09-24 : « Signature : illimité ». Signature est
// supprimée et AUCUNE formule en vente n'est illimitée ; la convention
// reste (Infinity, jamais null ni undefined) et reste testée.
test("un quota illimité (Infinity) ne bloque jamais — aucune formule en vente ne l'est", () => {

for (const [id, offre] of Object.entries(OFFRES)) assert.notEqual(offre.maxAccompaniedApplications, Infinity, `${id} : illimité`);

const quota = Infinity;

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

// Seule exception : les DROITS_UNIVERSELS (la messagerie avec l'équipe,
// ouverte à tous les comptes le 2026-09-23) — un droit de compte, pas
// une fonctionnalité payante.
assert.deepEqual(DROITS_UNIVERSELS, ["student_messaging"], "un nouveau droit universel se décide, il ne s'ajoute pas en passant");

for (const { key } of FEATURE_CATALOG) {
assert.equal(flags[key].gratuit, DROITS_UNIVERSELS.includes(key), `"${key}" : gratuit`);
}

});

test("le gratuit n'a ni entrée tarifaire ni quota", () => {

assert.equal(OFFRES.gratuit, undefined, "gratuit ne doit pas être une offre achetable");

});

test("toute offre payante donne 100% des outils Fitz", () => {

// DEUX entrées de FEATURE_CATALOG réutilisent le mécanisme de
// verrouillage sans être des outils Fitz — voir les notes dans
// js/plan-features.js. Chacune a sa propre assertion ci-dessous et ne
// doit pas casser celle-ci :
//   - "advisor" (2026-08-07) : accès à un conseiller humain.
//   - "whatsapp_direct" (2026-09-02) : décision utilisateur, WhatsApp
//     est STRICTEMENT réservé à Signature. Ce test l'exigeait encore
//     dans toutes les offres payantes et échouait depuis lors.
//   - "student_messaging" et "support_ticket" (grille A, 2026-09-07) :
//     la messagerie est réservée au Conseiller côté bourses (les
//     anciennes formules la gardent) ; le service après-vente est
//     ouvert à toute formule payante. Voir test/grille-a.test.mjs.
const HORS_OUTILS = ["advisor", "whatsapp_direct", "diagnostic_france", "student_messaging", "support_ticket"];
const OUTILS_FITZ = FEATURE_CATALOG.filter(({ key }) => !HORS_OUTILS.includes(key));

const flags = resolveFeatureFlags(null);

for (const id of OFFRES_PAYANTES) {
for (const { key } of OUTILS_FITZ) {
assert.equal(flags[key][id], true, `"${key}" doit être inclus dans ${id}`);
}
}

});

test("\"whatsapp_direct\" n'est vrai pour AUCUNE formule", () => {

// Décision de Charles du 2026-09-20, qui remplace celle du
// 2026-09-02 : plus AUCUN lien WhatsApp sur le site, payant comme
// gratuit — la messagerie FitzUniverse (student_messaging) est le
// seul canal d'échange avec l'équipe. La clé whatsapp_direct reste
// pour la compatibilité des grilles, mais ce test garantit qu'elle
// ne rouvrira jamais silencieusement.
const flags = resolveFeatureFlags(null);

for (const id of OFFRES_PAYANTES) {
assert.equal(
flags.whatsapp_direct[id],
false,
`"whatsapp_direct" pour ${id} devrait être false — WhatsApp est retiré du site depuis le 2026-09-20`
);
}

});

test("\"advisor\" (conseiller humain) n'est vrai que pour les offres d'accompagnement humain", () => {

const flags = resolveFeatureFlags(null);
const OFFRES_AVEC_CONSEILLER = ["signature-focus", "conseiller-6", "signature"];

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

// Jusqu'au 2026-09-24 : « premium est déprécié… ». Les anciennes
// formules sont supprimées : l'échelle de l'upsell est celle des trois
// formules en vente, et un ancien identifiant n'y mène plus nulle part.
test("l'échelle de l'upsell : Premier Dossier → Essentiel → Conseiller, puis rien", () => {

assert.equal(nextPlanIdReproduit("premier-dossier"), "essentiel-4");
assert.equal(nextPlanIdReproduit("essentiel-4"), "conseiller-6");
assert.equal(nextPlanIdReproduit("conseiller-6"), null, "le Conseiller est la dernière marche");
for (const ancien of ["essentiel", "accompagnement", "premium", "signature-focus", "signature"]) {
assert.equal(nextPlanIdReproduit(ancien), null, `${ancien} : supprimé, hors de l'échelle`);
}

});

test("les anciennes formules sont SUPPRIMÉES (2026-09-24) ; une future offre dépréciée resterait résolvable", () => {

// La convention `deprecated` demeure : une formule qui sortira un jour
// de la vente EN LAISSANT DES CLIENTS garde son entrée, exclue des
// surfaces de vente. Les anciennes formules, elles, n'avaient plus aucun
// client (base relue le 2026-09-24) : Charles a décidé de les supprimer.
for (const ancien of ["essentiel", "accompagnement", "premium", "signature-focus", "signature"]) {
assert.equal(OFFRES[ancien], undefined, `${ancien} : encore dans SCHOLARBRIDGE_PLANS`);
}

const depreciees = Object.keys(OFFRES).filter((id) => OFFRES[id].deprecated === true);

// Le Diagnostic, devenu gratuit le 2026-09-25 (lot 97), est la seule
// offre dépréciée : ses acheteurs gardent leur identifiant.
assert.deepEqual(depreciees, ["diagnostic-france"], "seul le Diagnostic est déprécié");

for (const id of depreciees) {
assert.ok(OFFRES[id], `${id} doit rester dans SCHOLARBRIDGE_PLANS malgré deprecated:true`);
const quota = OFFRES[id].parcours === "preinscription" ? OFFRES[id].maxPreinscriptions : OFFRES[id].maxAccompaniedApplications;
assert.equal(typeof quota, "number", `${id} doit garder un quota résolvable`);
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

// Jusqu'au 2026-09-24 : « Signature : le même libellé ». Signature est
// supprimée ; la règle vaut pour chaque formule en vente : le libellé
// court de l'interface est le nom de la grille, sans « Forfait ».
test("chaque formule en vente : le libellé court de l'interface est celui de la grille, sans « Forfait »", () => {

for (const id of OFFRES_PAYANTES) {
assert.equal(OFFRES[id].label, `Forfait ${PLAN_LABELS[id]}`, id);
}

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

// Relecture du 2026-09-24 : plus aucune offre n'est dépréciée, donc plus
// rien n'exerçait le filtre `deprecated` de nextPlanId/unlockingPlans.
// La convention reste la voie d'une future sortie de vente AVEC clients :
// elle est prouvée ici sur une grille fictive, sans toucher la vraie.
test("la convention `deprecated` reste vivante : une offre fictive retirée est sautée par l'upsell et le déverrouillage", () => {

const avant = globalThis.SCHOLARBRIDGE_PLANS;
try {
globalThis.SCHOLARBRIDGE_PLANS = { ...OFFRES, "essentiel-4": { ...OFFRES["essentiel-4"], deprecated: true } };
assert.equal(nextPlanId("premier-dossier"), "conseiller-6", "une offre dépréciée n'est jamais la marche suivante");
const flags = { gratuit: false, "premier-dossier": true, "essentiel-4": true, "conseiller-6": true };
assert.deepEqual(unlockingPlans("gratuit", flags), ["premier-dossier", "conseiller-6"], "ni une cible de déverrouillage");
globalThis.SCHOLARBRIDGE_PLANS = OFFRES;
assert.equal(nextPlanId("premier-dossier"), "essentiel-4", "la vraie grille, elle, n'en déprécie aucune");
} finally {
if (avant === undefined) delete globalThis.SCHOLARBRIDGE_PLANS; else globalThis.SCHOLARBRIDGE_PLANS = avant;
}

});
