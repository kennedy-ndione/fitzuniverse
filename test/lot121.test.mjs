/**
* LOT 121 (2026-09-26) — la page PayDunya arrive pré-remplie (nom, e-mail,
* téléphone sénégalais), au lieu de trois champs vides.
*/
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const { clientPayDunya } = require(join(racine, "functions/lib/achat.js"));

test("121 — ce que le compte connaît, et seulement cela", () => {
assert.deepEqual(clientPayDunya({ profile: { firstName: "Awa", lastName: "Diallo", phone: "+221 77 123 45 67" } }, "awa@exemple.sn"), { name: "Awa Diallo", email: "awa@exemple.sn", phone: "771234567" });
// Le nom du compte à défaut du profil ; l'e-mail du document à défaut du jeton.
assert.deepEqual(clientPayDunya({ name: "Moussa Ba", email: "m@b.sn" }, ""), { name: "Moussa Ba", email: "m@b.sn" });
// Un numéro hors Sénégal n'est pas posé dans un champ qui affiche +221.
assert.deepEqual(clientPayDunya({ name: "Koffi", profile: { phone: "+2250712345678" } }, ""), { name: "Koffi" });
assert.deepEqual(clientPayDunya({ name: "Awa", profile: { phone: "+22177123456" } }, ""), { name: "Awa" }, "8 chiffres : incomplet");
// Rien de fiable : pas d'objet du tout.
assert.equal(clientPayDunya({}, "pas-un-email"), null);
assert.equal(clientPayDunya(null, undefined), null);
});

test("121 — la facture porte le client, sous invoice.customer", () => {
const js = readFileSync(join(racine, "functions/paiement.js"), "utf8").replace(/\r\n/g, "\n");
assert.match(js, /const client = clientPayDunya\(profil, request\.auth\.token && request\.auth\.token\.email\);\n    if \(client\) facture\.invoice\.customer = client;/);
assert.ok(js.indexOf("const facture = {") < js.indexOf("facture.invoice.customer = client"));
});
