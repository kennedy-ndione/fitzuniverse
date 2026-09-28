/*
 * ============================================================
 * Audit 2026-10 — « Revérifier auprès de PayDunya » (admin/paiements).
 *
 * reverifierPaiement, réservé aux administrateurs actifs, relance la MÊME
 * confirmation que le webhook — la fonction confirmerEtAppliquer, pas une
 * copie — et crédite si elle réussit, sans jamais créditer deux fois.
 *
 * Ce fichier vérifie aussi la forme exacte de la confirmation : `status`
 * lu AU PREMIER NIVEAU de la réponse, le montant dans
 * `invoice.total_amount`, et l'adresse sandbox-api en mode test, api en
 * production.
 *
 * Le VRAI code de functions/paiement.js, hors ligne
 * (test/_doublures-functions.cjs).
 * ============================================================
 */

import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import crypto from "node:crypto";

const require = createRequire(import.meta.url);
const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(join(racine, f), "utf8").replace(/\r\n/g, "\n");

const H = require("./_doublures-functions.cjs");
const { creerPaiement, paydunyaWebhook, reverifierPaiement } = H.charger("paiement.js");
const CLE_TEST = H.secrets.PAYDUNYA_PRIVATE_KEY;

const auth = (uid) => ({ uid, token: { firebase: { sign_in_provider: "password" }, email: `${uid}@exemple.test` } });
const paiement = (t) => H.store.get(`payments/${t}`);
const compte = (uid) => H.store.get(`users/${uid}`) || {};
const hash = crypto.createHash("sha512").update(H.secrets.PAYDUNYA_MASTER_KEY).digest("hex");

let confirmation = null;
let creations = 0;

beforeEach(() => {
H.remettreAZero();
H.secrets.PAYDUNYA_PRIVATE_KEY = CLE_TEST;
confirmation = null;
H.store.set("admins/adm", { isActive: true, role: "admin" });
H.repondre(async (url) => {
if (url.includes("/checkout-invoice/create")) {
creations++;
return H.json({ response_code: "00", token: `tok_${creations}`, response_text: "https://paydunya.test/x" });
}
if (url.includes("/checkout-invoice/confirm/")) {
if (confirmation instanceof Error) throw confirmation;
return H.json(typeof confirmation === "function" ? confirmation(url) : confirmation);
}
return H.json({});
});
});

async function facture(uid, planId = "essentiel-4") {
H.store.set(`users/${uid}`, { email: `${uid}@exemple.test` });
const { token } = await creerPaiement({ auth: auth(uid), data: { planId } });
return { token, prix: paiement(token).montantAttendu };
}

const reverifier = (uid, token) => reverifierPaiement({ auth: auth(uid), data: { token } });
async function refus(promesse) { try { await promesse; } catch (e) { return e; } return null; }
// La réponse de confirmation telle que PayDunya la documente : `status`
// au premier niveau, le montant dans `invoice.total_amount`.
const reponse = (token, total_amount, status = "completed") => ({ response_code: "00", response_text: "Transaction Found", status, mode: "test", invoice: { token, total_amount, description: "x" } });

// ------------------------------------------------------------------
// Le bouton : réservé, crédite, jamais deux fois
// ------------------------------------------------------------------
test("réservé aux administrateurs actifs : étudiant, admin désactivé, sans session → refusés", async () => {
const { token, prix } = await facture("awa");
confirmation = reponse(token, prix);
assert.equal((await refus(reverifier("awa", token))).code, "permission-denied", "l'étudiant lui-même");
H.store.set("admins/ancien", { isActive: false, role: "admin" });
assert.equal((await refus(reverifier("ancien", token))).code, "permission-denied", "admin désactivé");
assert.equal((await refus(reverifierPaiement({ data: { token } }))).code, "unauthenticated");
assert.equal(compte("awa").plan, undefined, "rien n'est crédité");
assert.ok(!H.appelsFetch.some((a) => a.url.includes("/confirm/")), "PayDunya n'est même pas appelé");
});

test("facture « en attente » payée chez PayDunya (IPN perdue) → la revérification crédite", async () => {
const { token, prix } = await facture("binta");
confirmation = reponse(token, prix);
const r = await reverifier("adm", token);
assert.deepEqual(r, { issue: "applique" });
assert.equal(compte("binta").plan, "essentiel-4");
assert.equal(paiement(token).statut, "paye");
assert.equal(paiement(token).derniereReverification.par, "adm");
assert.equal(paiement(token).derniereReverification.issue, "applique");
});

test("jamais deux fois : revérifier deux fois, ou après le webhook, ou en même temps que lui → un seul crédit", async () => {
const { token, prix } = await facture("coumba", "fitzExpress");
confirmation = reponse(token, prix);
await Promise.all([reverifier("adm", token), paydunyaWebhook({ method: "POST", body: { data: { hash, status: "completed", invoice: { token } } } }, H.fauxRes()), reverifier("adm", token)]);
const fin = compte("coumba").fitzExpressExpiresAt;
assert.ok(fin);
assert.deepEqual(await reverifier("adm", token), { issue: "deja-traite" });
assert.equal(compte("coumba").fitzExpressExpiresAt, fin, "la durée n'a été créditée qu'une fois");
});

test("mêmes refus que le webhook : non payée, montant absent ou différent → rien n'est crédité", async () => {
for (const [uid, fabrique, issue] of [
["d1", (t, p) => reponse(t, p, "pending"), "non-complete"],
["d2", (t) => reponse(t, undefined), "montant-absent"],
["d3", (t, p) => reponse(t, p - 1), "montant-different"],
["d4", (t, p) => reponse(t, p + 1), "montant-different"]
]) {
const { token, prix } = await facture(uid);
confirmation = fabrique(token, prix);
assert.deepEqual(await reverifier("adm", token), { issue }, uid);
assert.equal(compte(uid).plan, undefined, uid);
assert.notEqual(paiement(token).statut, "paye", uid);
}
});

test("PayDunya injoignable → « unavailable », rien n'est crédité ; jeton invalide ou inconnu → refusé sans appel", async () => {
const { token } = await facture("fatou");
confirmation = new Error("ETIMEDOUT");
assert.equal((await refus(reverifier("adm", token))).code, "unavailable");
assert.equal(compte("fatou").plan, undefined);
H.appelsFetch.length = 0;
assert.equal((await refus(reverifier("adm", "../users/fatou"))).code, "invalid-argument");
assert.equal((await refus(reverifier("adm", "tok_inconnu"))).code, "not-found");
assert.equal(H.appelsFetch.length, 0);
});

// ------------------------------------------------------------------
// La forme exacte de la confirmation
// ------------------------------------------------------------------
test("confirmation : `status` est lu AU PREMIER NIVEAU (pas dans invoice)", async () => {
const { token, prix } = await facture("g1");
confirmation = { response_code: "00", invoice: { token, total_amount: prix, status: "completed" } };
assert.deepEqual(await reverifier("adm", token), { issue: "non-complete" });
assert.equal(compte("g1").plan, undefined);
confirmation = { ...confirmation, status: "completed" };
assert.deepEqual(await reverifier("adm", token), { issue: "applique" });
});

test("confirmation : le montant est lu dans `invoice.total_amount` (pas au premier niveau)", async () => {
const { token, prix } = await facture("g2");
confirmation = { response_code: "00", status: "completed", total_amount: prix, invoice: { token } };
assert.deepEqual(await reverifier("adm", token), { issue: "montant-absent" });
confirmation = { response_code: "00", status: "completed", invoice: { token, total_amount: String(prix) } };
assert.deepEqual(await reverifier("adm", token), { issue: "applique" }, "PayDunya rend le montant en chaîne : accepté");
});

test("adresse : sandbox-api en mode test, api en production — la même pour le webhook et le bouton", async () => {
const confirmations = () => H.appelsFetch.filter((a) => a.url.includes("/checkout-invoice/confirm/"));

const t = await facture("h1");
confirmation = (url) => reponse(url.split("/").pop(), t.prix);
await reverifier("adm", t.token);
await paydunyaWebhook({ method: "POST", body: { data: { hash, status: "completed", invoice: { token: t.token } } } }, H.fauxRes());
for (const a of confirmations()) assert.equal(a.url, `https://app.paydunya.com/sandbox-api/v1/checkout-invoice/confirm/${t.token}`);
assert.equal(confirmations().length, 2);

H.appelsFetch.length = 0;
H.secrets.PAYDUNYA_PRIVATE_KEY = "live_private_yyyyyyyy";
const l = await facture("h2");
assert.equal(paiement(l.token).mode, "live");
confirmation = (url) => reponse(url.split("/").pop(), l.prix);
await reverifier("adm", l.token);
await paydunyaWebhook({ method: "POST", body: { data: { hash, status: "completed", invoice: { token: l.token } } } }, H.fauxRes());
for (const a of confirmations()) {
assert.equal(a.url, `https://app.paydunya.com/api/v1/checkout-invoice/confirm/${l.token}`);
assert.equal(a.init.method, "GET");
assert.equal(a.init.headers["PAYDUNYA-PRIVATE-KEY"], "live_private_yyyyyyyy");
}
assert.equal(confirmations().length, 2);
assert.equal(compte("h2").plan, "essentiel-4");
});

// ------------------------------------------------------------------
// Un seul code, et le bouton dans l'administration
// ------------------------------------------------------------------
test("un seul code : l'appel de confirmation n'existe qu'une fois, partagé par le webhook et le bouton", () => {
const code = lire("functions/paiement.js").replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
assert.equal((code.match(/cheminConfirmation\(/g) || []).length, 1, "une seule construction de l'adresse de confirmation");
assert.equal((code.match(/appliquerAchat\(token, confirmation, mode\)/g) || []).length, 1, "un seul appel à appliquerAchat");
const webhook = code.slice(code.indexOf("exports.paydunyaWebhook"), code.indexOf("exports.reverifierPaiement"));
const bouton = code.slice(code.indexOf("exports.reverifierPaiement"));
assert.ok(webhook.includes("await confirmerEtAppliquer(token)"));
assert.ok(bouton.includes("await confirmerEtAppliquer(token)"));
assert.ok(bouton.includes("adminSnap.data().isActive !== true"));
assert.match(lire("functions/index.js"), /exports\.reverifierPaiement = require\("\.\/paiement"\)\.reverifierPaiement;/);
});

test("admin/paiements : un bouton « Revérifier auprès de PayDunya » sur toute facture qui n'est pas « paye »", () => {
const page = lire("admin/paiements.js");
assert.ok(page.includes('httpsCallable(getFunctions(app, REGION), "reverifierPaiement")'));
assert.match(page, /peutReverifier\(p\)\s*\?\s*`<button[^`]*data-reverifier="\$\{echapper\(p\.id\)\}"[^`]*>Revérifier auprès de PayDunya<\/button>`/);
assert.ok(page.includes("appeler({ token })"));
// La règle d'affichage, exécutée telle qu'écrite dans la page.
const debut = page.indexOf("function peutReverifier(");
const peutReverifier = new Function(`${page.slice(debut, page.indexOf("\n}\n", debut) + 2)}\nreturn peutReverifier;`)();
for (const statut of ["en-attente", "pending", "confirmation-refusee", "montant-incoherent", "cancelled", "failed", "mode-incoherent", "formule-inconnue", undefined]) {
assert.equal(peutReverifier({ statut }), true, String(statut));
}
assert.equal(peutReverifier({ statut: "paye" }), false, "une facture payée n'a pas de bouton");
assert.equal(peutReverifier({ statut: "paye", applique: false }), false, "payée mais non appliquée (rang inférieur) : pas de bouton non plus");
});
