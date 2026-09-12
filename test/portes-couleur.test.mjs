/**
* Lot PORTES-COULEUR (2026-09-11) — des boutons qui appellent le clic, et
* une sortie pour l'indécis.
*
*  1. les deux portes portent la MÊME couleur de fond (une seule règle
*     .hero-door, aucune variante) ;
*  2. ce fond n'est plus le crème d'avant (#F5F1E8) — mutation prouvée :
*     crème remis → rouge ;
*  3. l'ambre est le littéral #E9A319, jamais var(--amber-500) ;
*  4. la ligne du diagnostic existe, pointe vers le questionnaire, et ne
*     porte pas la classe des portes ; la réserve « Aucune promesse
*     d'admission » reste ;
*  5. les trois chemins sont comptés : trois types déclarés dans
*     js/analytics.js, trois data-chemin dans le hero, l'écoute au clic,
*     et le Control Center les affiche.
*/
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(path.join(RACINE, f), "utf8").replace(/\r\n/g, "\n");
const sansCommentaires = (s) => s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/<!--[\s\S]*?-->/g, "");

const CREME_AVANT = "#F5F1E8";

function reglesPorte() {
const css = sansCommentaires(lire("css/hero.css"));
return [...css.matchAll(/(^|\n)\.hero-door\{([^}]*)\}/g)].map((m) => m[2]);
}

test("portes-couleur 1 — les deux portes ont la même couleur : une seule règle de fond, aucune variante", () => {
const css = sansCommentaires(lire("css/hero.css"));
assert.ok(!/\.hero-door(--[\w-]+|\.[\w-]+|:nth-child|:first-child|:last-child|\[href)/.test(css), "une variante distingue une porte de l'autre");
const fonds = reglesPorte().map((r) => (r.match(/background:\s*([^;]+)/) || [])[1]).filter(Boolean);
assert.equal(fonds.length, 1, `le fond des portes est écrit ${fonds.length} fois — une seule règle, la même pour les deux`);
const html = sansCommentaires(lire("index.html"));
assert.equal((html.match(/class="hero-door"/g) || []).length, 2);
});

test("portes-couleur 2 — le fond n'est plus le crème d'avant, et l'ambre est le littéral #E9A319", () => {
const base = reglesPorte()[0];
const fond = (base.match(/background:\s*([^;]+)/) || [])[1].trim();
assert.notEqual(fond.toUpperCase(), CREME_AVANT, "le crème pâle est revenu : un bouton fantôme sur photo sombre");
assert.equal(fond.toUpperCase(), "#E9A319", "la couleur retenue est l'ambre de la marque, en littéral");
const css = sansCommentaires(lire("css/hero.css"));
const bloc = css.slice(css.indexOf(".hero-doors{"), css.indexOf(".hero-diag{"));
assert.ok(!/var\(--amber/.test(bloc), "var(--amber-*) sur une porte : onze feuilles redéfinissent l'ambre en terracotta");
});

test("portes-couleur 3 — la ligne du diagnostic : une ligne, pas une troisième porte ; la réserve reste", () => {
const html = sansCommentaires(lire("index.html"));
const ligne = html.match(/<a href="eligibility-questions\.html" class="([^"]*)"[^>]*data-chemin="porte_diagnostic"[^>]*>([\s\S]*?)<\/a>/);
assert.ok(ligne, "la ligne du diagnostic manque");
assert.ok(ligne[1].includes("hero-diag") && !ligne[1].includes("hero-door"), "la ligne ne doit pas porter la classe des portes");
const texte = ligne[2].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
assert.match(texte, /Vous ne savez pas laquelle/, "la question du visiteur");
assert.match(texte, /gratuit/, "la gratuité");
assert.match(texte, /minutes/, "la durée");
// La durée est celle que le questionnaire annonce lui-même.
assert.match(texte, /cinq minutes/);
assert.match(lire("eligibility-questions.html"), /cinq minutes/);
// La ligne de preuve dit ce que le site FAIT (lot VITRINE-COMMERCIALE,
// 2026-09-11) : « Aucune promesse d'admission » a quitté l'accueil.
assert.ok(html.includes("Gratuit, sans compte, en cinq minutes."));
assert.ok(!html.includes("Aucune promesse d'admission"));
assert.ok(!/hero-proof[\s\S]*?<a href="eligibility-test\.html">Diagnostic gratuit/.test(html), "le diagnostic n'est plus collé à la réserve");
// Une zone de clic confortable sur téléphone.
const css = sansCommentaires(lire("css/hero.css"));
assert.match(css, /\.hero-diag\{[^}]*min-height:\s*4[48]px/);
});

test("portes-couleur 4 — les trois chemins sont comptés au clic et lus dans le Control Center", () => {
const analytics = lire("js/analytics.js");
for (const type of ["porte_bourse", "porte_preinscription", "porte_diagnostic"]) {
assert.match(analytics, new RegExp(`${type}: \\{ counters: \\["totals", "byDay"\\] \\}`), `${type} absent d'EVENT_CONFIG`);
}
const html = sansCommentaires(lire("index.html"));
assert.equal((html.match(/data-chemin="porte_bourse"/g) || []).length, 1);
assert.equal((html.match(/data-chemin="porte_preinscription"/g) || []).length, 1);
assert.equal((html.match(/data-chemin="porte_diagnostic"/g) || []).length, 1);
const teaser = lire("js/homepage-teaser.js");
assert.match(teaser, /import \{ trackVisitOnce, trackEvent \} from "\.\/analytics\.js"/);
assert.match(teaser, /querySelectorAll\("\[data-chemin\]"\)/);
assert.match(teaser, /trackEvent\(lien\.dataset\.chemin\)/);
// Aucune donnée personnelle : l'événement ne porte que son type.
assert.ok(!/trackEvent\(lien\.dataset\.chemin, \{/.test(teaser));
assert.match(lire("admin/dashboard.js"), /function renderChemins\(totals\)/);
assert.match(lire("admin/dashboard.html"), /id="cheminsList"/);
});
