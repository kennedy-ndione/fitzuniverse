/**
* LOT 116 (2026-09-26) — LES PORTAILS RÉSERVÉS AUX ABONNÉS, CACHÉS POUR DE BON
*
* Constat du 26/09 : une lecture REST de Firestore, sans compte ni jeton,
* rendait `applicationPortalUrl` de la bourse suisse et des universités.
* Le lot S3 avait retiré les portails de l'instantané public et les
* servait par une Cloud Function après vérification de l'abonnement,
* mais les trois collections du catalogue restaient en
* `allow read: if true`. Demande de Charles : « tu peux cacher aussi ».
*
* Les visiteurs lisent le catalogue dans l'instantané publié ; Firestore
* devient lisible par l'administration seule.
*/
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative, sep } from "node:path";
import { fuitesDePortail } from "../scripts/instantane-portails.mjs";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(join(racine, f), "utf8").replace(/\r\n/g, "\n");
const sansCommentaires = (t) => t.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

test("116 — les trois collections du catalogue ne se lisent plus que par l'administration", () => {
const regles = sansCommentaires(lire("firestore.rules"));
for (const m of ["match /scholarships/{scholarshipId}", "match /universities/{universityId}", "match /programs/{programId}"]) {
const i = regles.indexOf(m);
assert.ok(i > 0, m);
assert.match(regles.slice(i, i + 160), /allow read: if isAdmin\(\);/, m);
}
assert.ok(!/allow read: if true;/.test(regles), "plus aucune collection en lecture publique");
});

test("116 — aucune page publique ne lit le catalogue dans Firestore, hors les deux replis connus", () => {
const EXCLUS = new Set(["node_modules", "functions", "scripts", "test", "admin", "sauvegardes", ".git", ".sim", ".claude", ".firebase"]);
const fichiers = [];
const parcourir = (d) => {
for (const e of readdirSync(d, { withFileTypes: true })) {
if (e.isDirectory()) { if (!EXCLUS.has(e.name)) parcourir(join(d, e.name)); }
else if (e.name.endsWith(".js")) fichiers.push(join(d, e.name));
}
};
parcourir(racine);
const lecteurs = fichiers
.filter((f) => /(?:getDoc|getDocs|onSnapshot)\([^)]*(?:doc|collection)\(db, *(?:"(?:programs|universities|scholarships)"|nom)/.test(sansCommentaires(readFileSync(f, "utf8"))))
// Chemins écrits avec « / » sur toutes les machines : sous Windows,
// relative() rend « js\\catalog-data.js » (vu chez Charles le 26/09).
.map((f) => relative(racine, f).split(sep).join("/"))
.sort();
// Le repli de l'instantané (administrateurs seulement désormais) et celui
// de la fiche, qui mène à « Chargement interrompu » pour les autres.
assert.deepEqual(lecteurs, ["details.js", "js/catalog-data.js"]);
assert.match(lire("offers-context.js"), /import \{ documentDuCatalogue \} from "\.\/js\/catalog-data\.js";/);
assert.ok(!/firebase-firestore/.test(lire("offers-context.js")), "le bandeau des offres lit l'instantané");
});

test("116 — l'instantané public ne porte toujours aucun portail", () => {
const catalogue = JSON.parse(lire("assets/data/catalogue.json"));
assert.deepEqual(fuitesDePortail(catalogue), []);
});
