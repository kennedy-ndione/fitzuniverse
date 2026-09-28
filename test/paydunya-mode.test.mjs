/**
* Lot BASCULE-AUTO (2026-09-17) — le mode PayDunya se déduit de la clé.
*
* Passer en paiement réel ne doit plus demander QUE de remplacer les
* secrets. Ce test garde les trois choses qui rendent ça vrai :
*
*  1. la décision pure (functions/lib/paydunya-mode.js) : préfixe de la
*     clé privée → mode → adresse de l'API ; une clé inconnue n'est
*     jamais devinée ;
*  2. functions/paiement.js n'a plus AUCUNE adresse PayDunya écrite en
*     dur, lit le mode depuis la clé AVANT la facture, et l'enregistre
*     sur le paiement ;
*  3. le webhook refuse d'activer une facture d'un autre mode que le
*     site (une facture de test payée en argent fictif, notifiée après
*     la bascule).
*/
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";

const require = createRequire(import.meta.url);
const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(path.join(RACINE, f), "utf8").replace(/\r\n/g, "\n");
const { modePaydunya, baseApi, modeAcceptable, BASES } = require(path.join(RACINE, "functions/lib/paydunya-mode.js"));

test("bascule 1 — la clé privée décide du mode, et du seul mode", () => {
assert.equal(modePaydunya("test_private_AbC123"), "test");
assert.equal(modePaydunya("live_private_AbC123"), "live");
assert.equal(modePaydunya("  live_private_AbC123\n"), "live", "un blanc de collage ne change rien");
// Jamais deviné.
for (const douteux of ["", null, undefined, "a-definir", "test_public_AbC", "live_public_AbC", "LIVE_PRIVATE_abc", "xlive_private_abc", "private_abc"]) {
assert.equal(modePaydunya(douteux), null, `« ${douteux} » ne doit pas avoir de mode`);
}
});

test("bascule 2 — chaque mode a son adresse, et seulement celle-là", () => {
assert.equal(baseApi("test"), "https://app.paydunya.com/sandbox-api/v1");
assert.equal(baseApi("live"), "https://app.paydunya.com/api/v1");
assert.equal(baseApi(null), null);
assert.equal(baseApi("autre"), null);
assert.ok(!BASES.live.includes("sandbox"));
assert.ok(BASES.test.includes("sandbox"));
});

test("bascule 3 — une facture n'active rien hors de son mode", () => {
assert.equal(modeAcceptable("test", "test"), true);
assert.equal(modeAcceptable("live", "live"), true);
assert.equal(modeAcceptable("test", "live"), false, "facture de test notifiée après la bascule");
assert.equal(modeAcceptable("live", "test"), false);
assert.equal(modeAcceptable(undefined, "live"), false, "un mode absent vaut test, jamais live");
assert.equal(modeAcceptable(undefined, "test"), true);
assert.equal(modeAcceptable("live", null), false, "clé invalide côté webhook : rien ne s'active");
});

test("bascule 4 — functions/paiement.js : aucune adresse en dur, le mode lu avant la facture et enregistré", () => {
const src = lire("functions/paiement.js");
const code = src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
assert.ok(!/app\.paydunya\.com/.test(code), "une adresse PayDunya est écrite en dur dans paiement.js");
assert.ok(!/API_BASE/.test(code), "l'ancienne constante est revenue");
assert.match(code, /require\("\.\/lib\/paydunya-mode"\)/);

const lecture = code.indexOf("const mode = modePaydunya(paydunyaPrivateKey.value());");
const refus = code.indexOf("if (!mode) {");
const facture = code.indexOf("${baseApi(mode)}/checkout-invoice/create");
assert.ok(lecture > 0 && refus > lecture && facture > refus, "le mode est lu et vérifié avant la facture");
assert.match(code, /statut: "en-attente",\n\s*mode,/, "le mode est enregistré sur le paiement");

// Le webhook connaît le mode du site et le compare avant toute activation.
// Audit 2026-10 : il redemande aussi l'état de la facture à PayDunya (la
// troisième clé), et passe la CONFIRMATION — pas le corps de l'IPN — avec
// le mode du site.
const webhook = code.slice(code.indexOf("exports.paydunyaWebhook"));
assert.match(webhook, /secrets: \[paydunyaMasterKey, paydunyaPrivateKey, paydunyaToken\]/);
const modeWebhook = webhook.indexOf("const mode = modePaydunya(paydunyaPrivateKey.value());");
const appel = webhook.indexOf("appliquerAchat(token, confirmation, mode)");
assert.ok(modeWebhook > 0 && appel > modeWebhook, "le webhook lit le mode du site et le passe à appliquerAchat");
assert.ok(!/appliquerAchat\(token, data\b/.test(code), "le corps de l'IPN n'est plus passé à appliquerAchat");
const garde = code.indexOf("if (!modeAcceptable(p.mode, modeActuel))");
const activation = code.indexOf("const decision = calculerMiseAJour(");
assert.ok(garde > 0 && garde < activation, "le mode est vérifié avant toute mise à jour du compte");
});
