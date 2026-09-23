/**
* LA PAGE DE RÉSULTATS SE LIT EN PYRAMIDE INVERSÉE (2026-09-23).
*
* Charles : « le récit est long alors que l'étudiant veut juste savoir
* les bourses, universités et pays qui lui sont compatibles […] beaucoup
* d'utilisateurs n'aiment pas lire ». Ces tests gardent l'ordre de
* lecture, la brièveté de Fitz et le détail replié.
*/

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(join(racine, f), "utf8");
const sansCommentaires = (s) => s.replace(/<!--[\s\S]*?-->/g, "");

test("lecture 1 — l'ordre : la réponse, les opportunités, les pays, l'avis de Fitz, le détail replié, la suite", () => {
const html = sansCommentaires(lire("results.html"));
const ordre = ['id="verdict"', 'id="opportunites"', 'id="pays"', 'id="avisFitz"', 'id="scoreDetail"', 'id="closingCta"'].map((m) => html.indexOf(m));
ordre.forEach((i, k) => assert.ok(i > 0, `repère ${k} absent`));
assert.deepEqual([...ordre].sort((a, b) => a - b), ordre, "l'ordre de lecture a changé");
// Le récit générique d'ouverture est parti.
assert.ok(!html.includes('id="narrativeText"'), "le récit d'ouverture est revenu");
// Le détail est REPLIÉ par défaut.
assert.match(html, /<details class="score-detail reveal" id="scoreDetail">/);
assert.ok(!/id="scoreDetail"[^>]*\bopen\b/.test(html), "le détail ne doit pas être ouvert par défaut");
// Et il contient bien le score, sa décomposition, forces et freins.
const detail = html.slice(html.indexOf('id="scoreDetail"'), html.indexOf("</details>"));
for (const id of ["scoreRing", "scoreBreakdown", "strengths", "weaknesses", "recommendations"]) assert.ok(detail.includes(`id="${id}"`), id);
});

test("lecture 2 — la réponse en chiffres : bourses, universités, pays", () => {
const js = lire("results.js");
assert.match(js, /function renderVerdict\(\)/);
assert.match(js, /libelle: bourses > 1 \? "bourses" : "bourse"/);
assert.match(js, /libelle: universites > 1 \? "universités" : "université"/);
assert.match(js, /libelle: "pays"/);
assert.match(js, /renderVerdict\(\);\s*renderScore\(\);/);
});

test("lecture 3 — une carte se lit en trois secondes : une raison visible, les autres repliées, un lien vers la fiche", () => {
const js = lire("results.js");
assert.match(js, /const \[premiereRaison, \.\.\.autresRaisons\] = trierRaisons\(/);
assert.match(js, /<details class="opportunity-plus">/);
assert.match(js, /href="scholarship-details\.html\?id=\$\{encodeURIComponent\(scholarship\.programId\)\}"/);
assert.match(js, /programId: pick\.programId \|\| ""/);
// La raison montrée n'est pas la ligne d'échéance répétée.
assert.match(js, /if \(\/candidatures ouvertes\/\.test\(t\)\) return 0;/);
});

test("lecture 4 — Fitz écrit court, simple, en quatre cartes", () => {
const prompts = lire("js/ai/prompts.js");
for (const titre of ["### En bref", "### Votre atout", "### Votre frein", "### Par où commencer"]) assert.ok(prompts.includes(titre), titre);
assert.match(prompts, /120 à 170 mots AU TOTAL/);
assert.match(prompts, /Phrases",\s*"de 20 mots au plus/);
assert.ok(!/500 à 650 mots/.test(prompts), "l'ancienne longueur est revenue");
const fitz = lire("js/ai/diagnostic-fitz.js");
assert.match(fitz, /const VERSION_LECTURE = 4;/, "les longues lectures déjà enregistrées doivent être régénérées");
assert.match(fitz, /function enCartes\(html\)/);
assert.match(lire("results.css"), /\.fitz-points\{/);
});

test("lecture 5 — pas de doublon : la priorité se retire quand Fitz en parle déjà, et hidden masque vraiment", () => {
const js = lire("results.js");
assert.match(js, /freeContainer\.dataset\.axe = weakest\.label;/);
assert.match(js, /\.then\(eviterLeDoublon\)\.catch\(\(\) => \{\}\);/);
assert.match(js, /function eviterLeDoublon\(\)/);
const css = lire("results.css");
for (const c of ["verdict-chiffres", "opportunites-suite", "improvement-free", "reco-locked"]) {
assert.match(css, new RegExp(`\\.${c}\\[hidden\\]`), `${c} : display l'emporterait sur hidden`);
}
});
