/**
* LOT 124 (2026-09-26) — UN CONTROL CENTER SOMBRE, SIMPLE ET RAPIDE
*
* Charles, après les lots 122 et 123 : « je préfère l'enlever et garder
* que le fond sombre », « j'aime pas le doré vif », « je veux juste
* quelque chose de simple mais qui captive, de façon professionnelle ».
* Et : « la navigation dans tout le site est redevenue lente ».
*
* Ce qui est vérifié :
*  1. la feuille admin/nuit.css ne coûte rien à l'affichage — aucune
*     animation, aucun flou, aucun script ;
*  2. aucun or vif ni dans la feuille, ni dans les graphiques du tableau
*     de bord ;
*  3. chaque page publiée du Control Center précharge ses modules (60 à
*     70 fichiers qui partaient à la file, sur 7 à 8 niveaux).
*/
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { pagesAModules, DEBUT, FIN } from "../scripts/precharger.mjs";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(join(racine, f), "utf8").replace(/\r\n/g, "\n");
const sansCommentaires = (t) => t.replace(/\/\*[\s\S]*?\*\//g, "");

// Les ors vifs retirés de l'administration (le site public les garde).
const OR_VIF = /#(F7C860|E9A319|F5C35A|F2B640|FFC94D|F5B83D)\b|rgba\(\s*(233,\s*163,\s*25|245,\s*195,\s*90)\s*,/i;

test("124 — la feuille sombre ne coûte rien : ni animation, ni flou, ni script", () => {
const css = sansCommentaires(lire("admin/nuit.css"));
assert.ok(!/@keyframes/.test(css), "aucune image clé");
assert.ok(!/animation\s*:(?!\s*none)/.test(css), "aucune animation");
assert.ok(!/backdrop-filter/.test(css), "aucun flou d'arrière-plan");
assert.ok(!/@property/.test(css), "aucune propriété animée");
// Aucun script d'animation : aucune page du Control Center ne charge
// nuit.js (le fichier lui-même est retiré par « git rm admin/nuit.js »).
for (const f of readdirSync(join(racine, "admin")).filter((x) => x.endsWith(".html"))) {
assert.ok(!lire(`admin/${f}`).includes("nuit.js"), `admin/${f} charge encore nuit.js`);
}
// Les seules transitions : couleurs, bordures, légère montée au survol.
for (const m of css.matchAll(/transition\s*:([^;]+);/g)) {
assert.ok(/^(\s*(none|(color|background|background-color|border-color|transform|opacity|box-shadow)\s+\.\d+s(\s+ease)?)\s*,?)+$/.test(m[1].replace("!important", "")), `transition trop lourde : ${m[1]}`);
}
});

test("124 — pas d'or vif dans le Control Center", () => {
assert.ok(!OR_VIF.test(sansCommentaires(lire("admin/nuit.css"))), "admin/nuit.css");
const js = lire("admin/dashboard.js");
assert.ok(!OR_VIF.test(js), "admin/dashboard.js (graphiques)");
});

test("124 — le fond est sombre et uni", () => {
const css = sansCommentaires(lire("admin/nuit.css"));
assert.match(css, /--nuit-0:#0F0E0C;/);
assert.ok(!/body::before/.test(css), "plus de calque décoratif derrière la page");
});

test("124 — chaque page publiée du Control Center précharge ses modules", () => {
const pages = pagesAModules().filter((p) => p.startsWith("admin/"));
assert.ok(pages.length >= 16, `${pages.length} pages admin`);
for (const p of pages) {
const html = lire(p);
const i = html.indexOf(DEBUT), j = html.indexOf(FIN), fin = html.indexOf("</head>");
assert.ok(i > -1 && j > i && fin > j, `${p} : bloc de préchargement dans le <head>`);
}
const bloc = lire("admin/dashboard.html");
assert.ok(bloc.includes('<link rel="modulepreload" href="dashboard.js">'));
assert.ok(bloc.includes('<link rel="modulepreload" href="../js/access-guard.js">'));
// Les pages d'outillage non publiées n'entrent pas dans le jeu.
const nonPubliees = readdirSync(join(racine, "admin")).filter((f) => /^(expand-catalog|import-|migrate|backfill|diag-)/.test(f));
for (const f of nonPubliees) assert.ok(!pages.includes(`admin/${f}`));
});
