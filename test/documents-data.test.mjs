/**
* ============================================================
* test/documents-data.test.mjs — la bibliothèque et ses slugs (lot B)
* ============================================================
*
* Le slug est la clé Firestore de users/{uid}.documentsObtained : le
* corps de slugDocument() ne doit pas bouger, et chaque SLUGS.* doit
* correspondre à un document réellement présent — c'est ce test qui
* protège du renommage d'un titre.
* ============================================================
*/

import { test } from "node:test";
import assert from "node:assert/strict";

import { DOCUMENTS, DOCUMENT_CATEGORIES, PRIORITY_LEVELS, SLUGS, slugDocument } from "../js/documents-data.js";

const CHAMPS_TEXTE = ["title", "description", "importance", "context", "requestedBy", "level", "issuedBy", "howToObtain", "averageTime", "validity", "scholarBridgeTip", "icon", "category", "priority"];
const CHAMPS_LISTE = ["scan", "tips", "mistakes"];

test("slugDocument : comportement historique inchangé", () => {
assert.equal(slugDocument("Traductions certifiées"), "traductions-certifiees");
assert.equal(slugDocument("Légalisation / apostille"), "legalisation-apostille");
assert.equal(slugDocument("Curriculum Vitae (CV)"), "curriculum-vitae-cv");
assert.equal(slugDocument("  Été  "), "ete");
});

test("46 documents, titres uniques", () => {
assert.equal(DOCUMENTS.length, 46);
assert.equal(new Set(DOCUMENTS.map((d) => d.title)).size, 46);
});

test("chaque SLUGS.* correspond à un document réellement présent", () => {
const presents = new Set(DOCUMENTS.map((d) => slugDocument(d.title)));
for (const [cle, slug] of Object.entries(SLUGS)) {
assert.ok(presents.has(slug), `SLUGS.${cle} = « ${slug} » ne correspond à aucun titre de DOCUMENTS`);
}
assert.deepEqual(Object.keys(SLUGS).sort(), ["bancaire", "copies", "legalisation", "ressources", "traductions"]);
});

test("« Légalisation / apostille » : administratif, fréquent, fiche complète", () => {
const d = DOCUMENTS.find((x) => x.title === "Légalisation / apostille");
assert.ok(d);
assert.equal(d.category, "administratif");
assert.equal(d.priority, "frequent");
for (const c of CHAMPS_TEXTE) assert.ok(typeof d[c] === "string" && d[c].trim(), `${c} vide`);
for (const c of CHAMPS_LISTE) assert.ok(Array.isArray(d[c]) && d[c].length >= 3, `${c} : au moins 3 entrées`);
assert.match(d.requestedBy, /La Haye/);
assert.match(d.requestedBy, /consulaire/);
});

test("chaque document a le même schéma, une catégorie et une priorité connues", () => {
const categories = new Set(DOCUMENT_CATEGORIES.map((c) => c.key));
const priorites = new Set(PRIORITY_LEVELS.map((p) => p.key));
for (const d of DOCUMENTS) {
for (const c of CHAMPS_TEXTE) assert.ok(typeof d[c] === "string" && d[c].trim(), `${d.title} : ${c} vide`);
for (const c of CHAMPS_LISTE) assert.ok(Array.isArray(d[c]) && d[c].length, `${d.title} : ${c} vide`);
assert.ok(categories.has(d.category), `${d.title} : catégorie inconnue ${d.category}`);
assert.ok(priorites.has(d.priority), `${d.title} : priorité inconnue ${d.priority}`);
}
});
