/*
 * ============================================================
 * Audit 2026-10 — PayDunya : avant de créditer, le webhook redemande
 * l'état de la facture à PayDunya (confirmation par le jeton), et ne
 * crédite que si le statut est "completed" et que le montant encaissé
 * est présent et ÉGAL au prix calculé par le serveur.
 *
 * Deux niveaux : le verdict pur (functions/lib/confirmation-paydunya.js)
 * et le VRAI webhook (functions/paiement.js) exécuté hors ligne avec les
 * doublures de test/_doublures-functions.cjs — sans réseau.
 * ============================================================
 */

import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import crypto from "node:crypto";

const require = createRequire(import.meta.url);
const { verdictConfirmation, jetonValide, montantLu } = require("../functions/lib/confirmation-paydunya.js");

// ------------------------------------------------------------------
// 1. Le verdict, pur
// ------------------------------------------------------------------
const confirme = (champs = {}, facture = {}) => ({ response_code: "00", status: "completed", invoice: { token: "tok_1", total_amount: 45000, ...facture }, ...champs });

test("confirmation : completed et montant égal au prix du serveur → crédit", () => {
assert.deepEqual(verdictConfirmation(confirme(), { token: "tok_1", montantAttendu: 45000 }), { ok: true, montant: 45000 });
assert.deepEqual(verdictConfirmation(confirme({}, { total_amount: "45000" }), { token: "tok_1", montantAttendu: 45000 }), { ok: true, montant: 45000 }, "PayDunya rend parfois une chaîne");
});

test("confirmation : tout statut autre que completed est refusé", () => {
for (const status of ["pending", "cancelled", "failed", "", undefined, "COMPLETED"]) {
const v = verdictConfirmation(confirme({ status }), { token: "tok_1", montantAttendu: 45000 });
assert.equal(v.ok, false, String(status));
assert.equal(v.motif, "non-complete", String(status));
}
});

test("confirmation : une réponse d'erreur de PayDunya est refusée", () => {
for (const r of [{ response_code: "1001", status: "completed" }, {}, null, "texte", confirme({ response_code: 0 })]) {
assert.equal(verdictConfirmation(r, { token: "tok_1", montantAttendu: 45000 }).ok, false);
}
});

test("confirmation : montant absent ou illisible → refusé", () => {
for (const total_amount of [undefined, null, "", "abc", NaN, Infinity, {}, [45000], "45 000 F"]) {
const v = verdictConfirmation(confirme({}, { total_amount }), { token: "tok_1", montantAttendu: 45000 });
assert.equal(v.ok, false, String(total_amount));
assert.equal(v.motif, "montant-absent", String(total_amount));
}
const sansFacture = verdictConfirmation({ response_code: "00", status: "completed" }, { token: "tok_1", montantAttendu: 45000 });
assert.equal(sansFacture.motif, "montant-absent");
});

test("confirmation : montant différent du prix du serveur, inférieur OU supérieur → refusé", () => {
for (const total_amount of [44999, 100, 0, 45001, 90000, -45000]) {
const v = verdictConfirmation(confirme({}, { total_amount }), { token: "tok_1", montantAttendu: 45000 });
assert.equal(v.ok, false, String(total_amount));
assert.equal(v.motif, "montant-different", String(total_amount));
}
});

test("confirmation : la facture confirmée doit être celle du jeton, et le prix attendu lisible", () => {
assert.equal(verdictConfirmation(confirme({}, { token: "tok_AUTRE" }), { token: "tok_1", montantAttendu: 45000 }).motif, "jeton-different");
for (const montantAttendu of [undefined, null, 0, -1, "abc"]) {
assert.equal(verdictConfirmation(confirme(), { token: "tok_1", montantAttendu }).motif, "montant-attendu-illisible", String(montantAttendu));
}
});

test("jeton : seule la forme d'un jeton PayDunya entre dans une URL ou un chemin", () => {
for (const t of ["tok_1", "abcDEF123", "a-b_c"]) assert.equal(jetonValide(t), true, t);
for (const t of ["", "../users/x", "a/b", "a b", "x".repeat(65), undefined, 12, { t: 1 }]) assert.equal(jetonValide(t), false, String(t));
assert.equal(montantLu(" 45000 "), 45000);
});

// ------------------------------------------------------------------
// 2. Le vrai webhook, hors ligne
// ------------------------------------------------------------------
const H = require("./_doublures-functions.cjs");
const { creerPaiement, paydunyaWebhook } = H.charger("paiement.js");
const { offreDe } = H.charger("lib/achat.js");

const hash = crypto.createHash("sha512").update(H.secrets.PAYDUNYA_MASTER_KEY).digest("hex");
const auth = (uid) => ({ uid, token: { firebase: { sign_in_provider: "password" }, email: `${uid}@exemple.test` } });
const paiement = (t) => H.store.get(`payments/${t}`);
const compte = (uid) => H.store.get(`users/${uid}`) || {};

async function ipn(data) {
const res = H.fauxRes();
await paydunyaWebhook({ method: "POST", body: { data } }, res);
return res.code;
}

// PayDunya simulé : la création rend un jeton, la confirmation rend
// ce que le test a décidé.
let confirmation = null;
let creations = 0;
function payDunya() {
H.repondre(async (url) => {
if (url.includes("/checkout-invoice/create")) {
creations++;
return H.json({ response_code: "00", token: `tok_${creations}`, response_text: "https://paydunya.test/checkout/x" });
}
if (url.includes("/checkout-invoice/confirm/")) {
if (confirmation instanceof Error) throw confirmation;
return H.json(confirmation);
}
return H.json({});
});
}

// Une facture réelle, créée par creerPaiement : montantAttendu est le prix
// calculé par le serveur.
async function facture(uid, planId) {
H.store.set(`users/${uid}`, { email: `${uid}@exemple.test` });
const { token } = await creerPaiement({ auth: auth(uid), data: { planId } });
return token;
}

beforeEach(() => {
H.remettreAZero();
confirmation = null;
payDunya();
});

test("webhook : IPN completed et confirmation conforme → la formule est créditée, montant encaissé enregistré", async () => {
const token = await facture("alice", "essentiel-4");
const prix = paiement(token).montantAttendu;
assert.equal(prix, offreDe("essentiel-4").prix, "le prix vient du serveur");
confirmation = { response_code: "00", status: "completed", invoice: { token, total_amount: prix } };
assert.equal(await ipn({ hash, status: "completed", invoice: { token, total_amount: prix } }), 200);
assert.equal(compte("alice").plan, "essentiel-4");
assert.equal(paiement(token).statut, "paye");
assert.equal(paiement(token).montantEncaisse, prix);
// L'appel de confirmation vise CETTE facture, avec les trois clés.
const appel = H.appelsFetch.find((a) => a.url.includes("/checkout-invoice/confirm/"));
assert.ok(appel.url.endsWith(`/checkout-invoice/confirm/${token}`));
assert.ok(appel.url.startsWith("https://app.paydunya.com/sandbox-api/v1"), "mode test → bac à sable");
assert.equal(appel.init.headers["PAYDUNYA-TOKEN"], H.secrets.PAYDUNYA_TOKEN);
assert.equal(appel.init.headers["PAYDUNYA-MASTER-KEY"], H.secrets.PAYDUNYA_MASTER_KEY);
});

test("webhook : IPN signée « completed » mais facture NON payée chez PayDunya → rien n'est crédité", async () => {
const token = await facture("bob", "conseiller-6");
const prix = paiement(token).montantAttendu;
confirmation = { response_code: "00", status: "pending", invoice: { token, total_amount: prix } };
assert.equal(await ipn({ hash, status: "completed", invoice: { token, total_amount: prix } }), 200);
assert.equal(compte("bob").plan, undefined);
assert.equal(paiement(token).statut, "confirmation-refusee");
assert.equal(paiement(token).motifRefus, "non-complete");
assert.equal(paiement(token).statutPaydunya, "pending");
});

test("webhook : montant ABSENT de la confirmation → rien n'est crédité (l'IPN ne compte pas)", async () => {
const token = await facture("carla", "essentiel-4");
const prix = paiement(token).montantAttendu;
confirmation = { response_code: "00", status: "completed", invoice: { token } };
// L'IPN, elle, porte le bon montant : elle n'est pas crue.
assert.equal(await ipn({ hash, status: "completed", invoice: { token, total_amount: prix } }), 200);
assert.equal(compte("carla").plan, undefined);
assert.equal(paiement(token).statut, "montant-incoherent");
assert.equal(paiement(token).motifRefus, "montant-absent");
});

test("webhook : montant DIFFÉRENT du prix du serveur (inférieur ou supérieur) → rien n'est crédité", async () => {
for (const [uid, ecart] of [["dani", -1], ["eva", +5000]]) {
const token = await facture(uid, "conseiller-6");
const prix = paiement(token).montantAttendu;
confirmation = { response_code: "00", status: "completed", invoice: { token, total_amount: prix + ecart } };
assert.equal(await ipn({ hash, status: "completed", invoice: { token, total_amount: prix } }), 200);
assert.equal(compte(uid).plan, undefined, uid);
assert.equal(paiement(token).statut, "montant-incoherent", uid);
assert.equal(paiement(token).motifRefus, "montant-different", uid);
assert.equal(paiement(token).montantEncaisse, prix + ecart, uid);
}
});

test("webhook : un refus n'est pas définitif — une confirmation correcte ultérieure crédite", async () => {
const token = await facture("fanta", "essentiel-4");
const prix = paiement(token).montantAttendu;
confirmation = { response_code: "00", status: "pending", invoice: { token, total_amount: prix } };
await ipn({ hash, status: "completed", invoice: { token } });
assert.equal(compte("fanta").plan, undefined);
confirmation = { response_code: "00", status: "completed", invoice: { token, total_amount: prix } };
assert.equal(await ipn({ hash, status: "completed", invoice: { token } }), 200);
assert.equal(compte("fanta").plan, "essentiel-4");
});

test("webhook : PayDunya injoignable → 500 (PayDunya réessaiera) et rien n'est crédité", async () => {
const token = await facture("gora", "essentiel-4");
confirmation = new Error("ECONNRESET");
assert.equal(await ipn({ hash, status: "completed", invoice: { token } }), 500);
assert.equal(compte("gora").plan, undefined);
assert.equal(paiement(token).statut, "en-attente");
});

test("webhook : condensat faux ou jeton piégé → refusé AVANT toute confirmation", async () => {
const token = await facture("hawa", "essentiel-4");
H.appelsFetch.length = 0;
assert.equal(await ipn({ hash: "00", status: "completed", invoice: { token } }), 401);
assert.equal(await ipn({ hash, status: "completed", invoice: { token: "../users/hawa" } }), 400);
assert.equal(await ipn({ hash, status: "completed", invoice: {} }), 400);
assert.equal(H.appelsFetch.length, 0, "aucun appel à PayDunya");
assert.equal(compte("hawa").plan, undefined);
});

test("webhook : rejeu d'une IPN déjà appliquée → idempotent, un seul crédit", async () => {
const token = await facture("ines", "fitzExpress");
const prix = paiement(token).montantAttendu;
confirmation = { response_code: "00", status: "completed", invoice: { token, total_amount: prix } };
const d = { hash, status: "completed", invoice: { token } };
await Promise.all([ipn(d), ipn(d), ipn(d)]);
const fin = compte("ines").fitzExpressExpiresAt;
await ipn(d);
assert.equal(compte("ines").fitzExpressExpiresAt, fin);
assert.equal(paiement(token).statut, "paye");
});
