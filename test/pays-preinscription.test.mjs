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

/**
* PLANCHERS, PAS PHOTOGRAPHIE (corrigé le 2026-09-13).
*
* Ce test affirmait : « aucun autre pays que la France n'a de coût
* vérifié — le lot D2 n'a touché que la France ». C'était vrai le jour
* du lot D2. Ça a cessé de l'être au lot 48, quand le chantier des frais
* réels a commencé à remplir toutes les nationalités : la Turquie a
* aujourd'hui 3 coûts vérifiés, l'Italie 11, le Canada 3.
*
* Le test avait donc raison de tomber — il disait le contraire de ce que
* le catalogue contient. Mais l'égalité stricte était le mauvais outil :
* elle retombera en rouge à CHAQUE lot de frais, et un test qu'on
* rafistole à chaque fois finit par être modifié sans y penser, ce qui
* est exactement ce qu'il devait empêcher.
*
* Ce qui est gardé ici est ce qui doit vraiment tenir :
*   - un PLANCHER par pays, jamais une égalité — un lot peut ajouter des
*     coûts, jamais en effacer. Une régression (champ écrasé, export
*     parti d'une sauvegarde ancienne) fait tomber le test ; un lot qui
*     enrichit ne le fait pas ;
*   - la COHÉRENCE : on ne peut pas avoir plus de coûts vérifiés que
*     d'établissements ;
*   - l'accord entre les deux formes de catalogue (universities /
*     universites), qui est un vrai contrat de code.
*
* Relever un plancher est légitime et attendu. Le BAISSER veut dire
* qu'on a perdu des données : chercher pourquoi avant de toucher au
* chiffre.
*/
test("etatDunPays : planchers par pays, cohérence, et accord des deux formes de catalogue", () => {
// Relevé du 2026-09-13, après le lot 54. Ce sont des minimums.
const PLANCHERS = {
France: { etablissements: 26, coutsVerifies: 15 },
Roumanie: { etablissements: 2, coutsVerifies: 0 },
Turquie: { etablissements: 6, coutsVerifies: 3 },
Maroc: { etablissements: 5, coutsVerifies: 1 },
Italie: { etablissements: 16, coutsVerifies: 9 },
Allemagne: { etablissements: 3, coutsVerifies: 2 },
Canada: { etablissements: 3, coutsVerifies: 3 }
};
assert.deepEqual(Object.keys(PLANCHERS).sort(), PAYS.map((p) => p.nom).sort(), "un plancher par pays, ni plus ni moins");

for (const p of PAYS) {
const e = etatDunPays(p, catalogue);
const min = PLANCHERS[p.nom];
assert.ok(e.etablissements >= min.etablissements, `${p.nom} : ${e.etablissements} établissements, plancher ${min.etablissements} — des données ont été perdues`);
assert.ok(e.coutsVerifies >= min.coutsVerifies, `${p.nom} : ${e.coutsVerifies} coûts vérifiés, plancher ${min.coutsVerifies} — des frais ont été effacés`);
assert.ok(e.coutsVerifies <= e.etablissements, `${p.nom} : ${e.coutsVerifies} coûts pour ${e.etablissements} établissements`);
assert.equal(e.procedure, p.procedure);
// La forme du chargeur du site (universites) donne le même compte.
assert.deepEqual(etatDunPays(p, { universites: catalogue.universities }), e, `${p.nom} : les deux formes de catalogue divergent`);
}

// La France reste le seul pays « en_cours », et son compte est celui
// que la page annonce.
const france = PAYS.find((p) => p.nom === "France");
assert.equal(etatDunPays(france, catalogue).procedure, "en_cours");
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
