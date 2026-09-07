/**
* ============================================================
* test/pays-preinscription.test.mjs — les sept pays, et leurs sources
* ============================================================
*
* LE test qui compte : chaque fait de chaque pays porte une URL ET une
* date. Un seul manquant = rouge. Et aucune carte ne peut dire « pas à
* pas » tant que sa procédure n'est pas « documentee ».
* ============================================================
*/

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { PROCEDURE, LIBELLES_PROCEDURE, PAYS, lirePays, etatDunPays, libelleProcedure } from "../js/pays-preinscription.js";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalogue = JSON.parse(fs.readFileSync(path.join(RACINE, "assets/data/catalogue.json"), "utf8"));

test("PROCEDURE est fermé et chaque code a un libellé non vide", () => {
assert.deepEqual(PROCEDURE, ["documentee", "en_cours", "a_venir"]);
for (const p of PROCEDURE) assert.ok(typeof LIBELLES_PROCEDURE[p] === "string" && LIBELLES_PROCEDURE[p].trim(), `libellé vide pour ${p}`);
assert.deepEqual(Object.keys(LIBELLES_PROCEDURE).sort(), [...PROCEDURE].sort());
});

test("exactement 7 pays, dans l'ordre validé ; ni États-Unis ni USA", () => {
const noms = lirePays().map((p) => p.nom);
assert.deepEqual(noms, ["France", "Roumanie", "Turquie", "Maroc", "Italie", "Allemagne", "Canada"]);
assert.equal(PAYS.length, 7);
for (const p of PAYS) {
assert.ok(!/etats-unis|usa|united-states/i.test(p.id), `id interdit : ${p.id}`);
assert.ok(!/États-Unis|Etats-Unis|USA/.test(p.nom), `nom interdit : ${p.nom}`);
}
assert.deepEqual([...new Set(PAYS.map((p) => p.ordre))].length, 7, "ordres uniques");
assert.deepEqual([...new Set(PAYS.map((p) => p.id))].length, 7, "ids uniques");
});

test("chaque pays a un nom présent dans le catalogue et un code de drapeau existant", () => {
const pays = new Set(catalogue.universities.map((u) => u.country));
for (const p of PAYS) {
assert.ok(pays.has(p.nom), `${p.nom} absent du catalogue`);
assert.ok(fs.existsSync(path.join(RACINE, "assets/flags", `${p.code}.svg`)), `drapeau ${p.code}.svg absent`);
assert.ok(PROCEDURE.includes(p.procedure), `${p.nom} : procédure hors vocabulaire`);
assert.ok(Array.isArray(p.langue) && p.langue.length, `${p.nom} : langues vides`);
assert.ok(typeof p.positionnement === "string" && p.positionnement.trim(), `${p.nom} : positionnement vide`);
if (p.portail !== null) assert.match(p.portail.url, /^https?:\/\//, `${p.nom} : portail sans URL`);
}
});

test("CHAQUE fait de CHAQUE pays porte une source http(s) ET une date valide", () => {
let total = 0;
for (const p of PAYS) {
assert.ok(Array.isArray(p.faits), `${p.nom} : faits n'est pas une liste`);
for (const f of p.faits) {
total++;
assert.ok(typeof f.texte === "string" && f.texte.trim(), `${p.nom} : fait sans texte`);
assert.match(String(f.source || ""), /^https?:\/\/\S+$/, `${p.nom} : fait sans source — « ${String(f.texte).slice(0, 50)} »`);
assert.match(String(f.verifieLe || ""), /^\d{4}-\d{2}-\d{2}$/, `${p.nom} : fait sans verifieLe — « ${String(f.texte).slice(0, 50)} »`);
assert.ok(!Number.isNaN(new Date(`${f.verifieLe}T00:00:00Z`).getTime()), `${p.nom} : date illisible ${f.verifieLe}`);
if ("montant" in f) {
assert.ok(typeof f.montant === "number" && f.montant >= 0, `${p.nom} : montant invalide`);
assert.ok(typeof f.devise === "string" && f.devise, `${p.nom} : montant sans devise`);
}
}
}
assert.ok(total >= 7, `au moins un fait par pays sourcé attendu au total, trouvé ${total}`);
});

test("aucun pays n'est « documentee » aujourd'hui — changer ce test en conscience, pas par accident", () => {
assert.deepEqual(PAYS.filter((p) => p.procedure === "documentee").map((p) => p.nom), []);
assert.equal(PAYS.find((p) => p.nom === "France").procedure, "en_cours");
});

test("etatDunPays(France, catalogue.json) rejoue le lot D2 : 26 établissements, 15 coûts vérifiés", () => {
const france = PAYS.find((p) => p.nom === "France");
const etat = etatDunPays(france, catalogue);
assert.equal(etat.etablissements, 26);
assert.equal(etat.coutsVerifies, 15);
assert.equal(etat.procedure, "en_cours");
// La forme du chargeur du site (universites) donne le même compte.
assert.deepEqual(etatDunPays(france, { universites: catalogue.universities }), etat);
// Aucun autre pays n'a de coût vérifié : le lot D2 n'a touché que la France.
for (const p of PAYS.filter((x) => x.nom !== "France")) {
const e = etatDunPays(p, catalogue);
assert.ok(e.etablissements > 0, `${p.nom} : aucun établissement au catalogue`);
assert.equal(e.coutsVerifies, 0, `${p.nom} : coût vérifié inattendu`);
}
assert.deepEqual(etatDunPays(france, null), { etablissements: 0, coutsVerifies: 0, procedure: "en_cours" });
});

test("« pas à pas » n'apparaît sur aucun texte rendu d'un pays non documenté", () => {
for (const p of PAYS) {
const textes = [libelleProcedure(p), p.positionnement, p.avertissement || "", ...p.faits.map((f) => f.texte)];
if (p.procedure !== "documentee") {
for (const t of textes) assert.ok(!/pas à pas/i.test(t), `${p.nom} : « ${t.slice(0, 60)} »`);
}
}
assert.match(LIBELLES_PROCEDURE.documentee, /pas à pas/);
});

test("lirePays ne mute pas PAYS", () => {
const avant = JSON.stringify(PAYS);
lirePays();
assert.equal(JSON.stringify(PAYS), avant);
});

test("preinscriptions.html charge mobile-nav.css et mobile-nav.js, sans noindex, et figure au sitemap", () => {
const html = fs.readFileSync(path.join(RACINE, "preinscriptions.html"), "utf8");
assert.match(html, /css\/mobile-nav\.css/);
assert.match(html, /js\/mobile-nav\.js/);
assert.ok(!/noindex/i.test(html), "la page doit être indexable");
assert.ok(!/Space Grotesk|Space\+Grotesk/.test(html), "aucune police nouvelle");
assert.ok(!/sparkle|data-lucide="star"|data-lucide="wand/i.test(html), "aucune étincelle");
const sitemap = fs.readFileSync(path.join(RACINE, "sitemap.xml"), "utf8");
assert.match(sitemap, /preinscriptions\.html/);
});
