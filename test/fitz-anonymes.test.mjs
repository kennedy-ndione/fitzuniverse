/*
 * ============================================================
 * Audit 2026-10 — Fitz : un plafond séparé pour les sessions anonymes,
 * qui ne peut jamais entamer le budget des comptes (clients payants).
 *
 * Avant : 50 sessions anonymes (4 points chacune) épuisaient les 200
 * points du jour, et Fitz refusait tous les clients payants jusqu'à
 * minuit. Désormais les anonymes ont leur compteur (pointsJourAnonymes)
 * et leur plafond (plafondJourAnonymes, PLAFOND_ANONYMES_JOUR sinon).
 *
 * Le verdict pur (functions/lib/fitz-acces.js), puis le VRAI fitzGenerate
 * exécuté hors ligne (test/_doublures-functions.cjs).
 * ============================================================
 */

import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { verdictSysteme, PLAFOND_GLOBAL_JOUR, PLAFOND_ANONYMES_JOUR } = require("../functions/lib/fitz-acces.js");

const JOUR = "2026-10-01";

// ------------------------------------------------------------------
// 1. Le verdict, pur
// ------------------------------------------------------------------
test("anonymes : leur plafond est à part, et leurs points ne touchent jamais le compteur des comptes", () => {
assert.ok(PLAFOND_ANONYMES_JOUR > 0 && PLAFOND_ANONYMES_JOUR < PLAFOND_GLOBAL_JOUR);
const v = verdictSysteme({ systeme: { jour: JOUR, pointsJour: 17, pointsJourAnonymes: 3 }, jourCourant: JOUR, points: 1, anonyme: true });
assert.deepEqual(v, { ok: true, plafond: PLAFOND_ANONYMES_JOUR, pointsJour: 17, pointsJourAnonymes: 4 });
const c = verdictSysteme({ systeme: { jour: JOUR, pointsJour: 17, pointsJourAnonymes: 3 }, jourCourant: JOUR, points: 4 });
assert.deepEqual(c, { ok: true, plafond: PLAFOND_GLOBAL_JOUR, pointsJour: 21, pointsJourAnonymes: 3 });
});

test("anonymes : plafond atteint → refus « anonymes », jamais « global »", () => {
const plein = { jour: JOUR, pointsJour: 0, pointsJourAnonymes: PLAFOND_ANONYMES_JOUR };
const v = verdictSysteme({ systeme: plein, jourCourant: JOUR, points: 1, anonyme: true });
assert.equal(v.ok, false);
assert.equal(v.portee, "anonymes");
// Le compte, lui, passe.
assert.equal(verdictSysteme({ systeme: plein, jourCourant: JOUR, points: 7 }).ok, true);
});

test("anonymes : même le budget des comptes épuisé n'ouvre ni ne ferme le leur (deux compteurs indépendants)", () => {
const comptesPleins = { jour: JOUR, pointsJour: PLAFOND_GLOBAL_JOUR, pointsJourAnonymes: 0 };
assert.equal(verdictSysteme({ systeme: comptesPleins, jourCourant: JOUR, points: 1 }).ok, false);
assert.equal(verdictSysteme({ systeme: comptesPleins, jourCourant: JOUR, points: 1, anonyme: true }).ok, true);
});

test("anonymes : plafond réglable dans systeme/fitz, robinet commun, et le jour tourne pour les deux compteurs", () => {
assert.equal(verdictSysteme({ systeme: { jour: JOUR, pointsJourAnonymes: 9, plafondJourAnonymes: 10 }, jourCourant: JOUR, points: 2, anonyme: true }).ok, false);
assert.equal(verdictSysteme({ systeme: { jour: JOUR, pointsJourAnonymes: 9, plafondJourAnonymes: 10 }, jourCourant: JOUR, points: 1, anonyme: true }).ok, true);
assert.equal(verdictSysteme({ systeme: { actif: false }, jourCourant: JOUR, points: 1, anonyme: true }).portee, "robinet");
// Hier plein des deux côtés : aujourd'hui, tout repart de zéro — et le
// premier appel du jour rend les DEUX compteurs remis à zéro.
const hier = { jour: "2026-09-30", pointsJour: 9999, pointsJourAnonymes: 9999 };
assert.deepEqual(verdictSysteme({ systeme: hier, jourCourant: JOUR, points: 1, anonyme: true }), { ok: true, plafond: PLAFOND_ANONYMES_JOUR, pointsJour: 0, pointsJourAnonymes: 1 });
assert.deepEqual(verdictSysteme({ systeme: hier, jourCourant: JOUR, points: 1 }), { ok: true, plafond: PLAFOND_GLOBAL_JOUR, pointsJour: 1, pointsJourAnonymes: 0 });
// Des points illisibles ne passent jamais, anonymes compris.
assert.equal(verdictSysteme({ systeme: {}, jourCourant: JOUR, points: NaN, anonyme: true }).ok, false);
});

// ------------------------------------------------------------------
// 2. Le vrai fitzGenerate, hors ligne
// ------------------------------------------------------------------
const H = require("./_doublures-functions.cjs");
const { fitzGenerate } = H.charger("fitz.js");

const session = (uid, fournisseur) => ({ uid, token: { firebase: { sign_in_provider: fournisseur } } });
const appeler = (auth, data) => fitzGenerate({ auth, data, acceptsStreaming: false }, { sendChunk() {} });
const diagnostic = { task: "diagnostic", system: "Consigne", user: "Profil de l'étudiant" };

beforeEach(() => H.remettreAZero());

test("fitzGenerate : des centaines de sessions anonymes n'empêchent jamais un client payant d'être servi", async () => {
let servis = 0;
let refus = null;
for (let i = 0; i < 200 && !refus; i++) {
for (let k = 0; k < 4 && !refus; k++) {
try { await appeler(session(`anon-${i}`, "anonymous"), diagnostic); servis++; } catch (e) { refus = e; }
}
}
assert.ok(refus, "le plafond des anonymes doit finir par tenir");
assert.equal(refus.code, "resource-exhausted");
assert.equal(refus.details.fitzCode, "QUOTA_FOURNISSEUR");
assert.equal(servis, PLAFOND_ANONYMES_JOUR, "exactement le plafond des anonymes, pas plus");

const systeme = H.store.get("systeme/fitz");
assert.equal(systeme.pointsJourAnonymes, PLAFOND_ANONYMES_JOUR);
assert.equal(systeme.pointsJour, 0, "le budget des comptes est intact");

// Le client Conseiller est servi, et SES points vont dans le budget des comptes.
H.store.set("users/payant", { plan: "conseiller-6", email: "p@exemple.test" });
const r = await appeler(session("payant", "password"), { task: "letter", system: "Consigne", user: "Ma lettre" });
assert.ok(r.text);
assert.ok(H.store.get("systeme/fitz").pointsJour > 0);
assert.equal(H.store.get("systeme/fitz").pointsJourAnonymes, PLAFOND_ANONYMES_JOUR);
});

test("fitzGenerate : un compte connecté sans formule reste sur le budget des comptes (le plafond anonyme ne vise que les sessions anonymes)", async () => {
await appeler(session("inscrit", "password"), diagnostic);
const systeme = H.store.get("systeme/fitz");
assert.equal(systeme.pointsJour, 1);
assert.equal(systeme.pointsJourAnonymes, 0);
});
