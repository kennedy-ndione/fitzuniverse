/**
* LOT 122 (2026-09-26) — LE CONTROL CENTER « NUIT »
*
* Demande de Charles : un espace admin sombre, haut de gamme, dynamique,
* animé. Sombre CHAUD, jamais bleu (refus du navy le 2026-09-02).
*
* Lot 124 : Charles garde le fond sombre mais veut « quelque chose de
* simple » — nuit.js (compteurs, apparitions, ondes) et la lueur des
* courbes sont retirés ; ce qui reste de ce lot est vérifié ici.
*/
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(join(racine, f), "utf8").replace(/\r\n/g, "\n");

test("122 — toutes les pages du Control Center chargent la nuit, après control-center.css", () => {
// Les anciennes pages d'outillage (migrations, imports, lots d'extension,
// diagnostics) ne sont PAS publiées (firebase.json, hosting.ignore) : elles
// gardent leur habillage d'origine. Vu chez Charles le 26/09 — elles
// n'existent pas dans le miroir de travail.
const NON_PUBLIEES = /^(expand-catalog|import-|migrate|backfill|diag-)/;
const pages = readdirSync(join(racine, "admin")).filter((f) => f.endsWith(".html") && !NON_PUBLIEES.test(f)).map((f) => `admin/${f}`).filter((p) => lire(p).includes("control-center.css"));
assert.ok(pages.length >= 16, `${pages.length} pages`);
for (const p of pages) {
const html = lire(p);
const i = html.indexOf("control-center.css");
const j = html.indexOf('href="nuit.css"');
assert.ok(j > i, `${p} : nuit.css absent ou chargé avant control-center.css`);
assert.ok(!html.includes("nuit.js"), `${p} : nuit.js est retiré (lot 124)`);
assert.match(html, /<meta name="theme-color" content="#0F0E0C">/, `${p} : couleur de thème`);
}
assert.ok(lire("admin/login.html").includes('href="nuit.css"'), "la porte d'entrée aussi");
});

test("122 — un sombre chaud : aucun bleu dans la feuille de nuit", () => {
const css = lire("admin/nuit.css").replace(/\/\*[\s\S]*?\*\//g, "");
// Aucune teinte où le bleu domine nettement (navy, slate, indigo).
for (const m of css.matchAll(/#([0-9a-f]{6})\b/gi)) {
const [r, g, b] = [0, 2, 4].map((k) => parseInt(m[1].slice(k, k + 2), 16));
assert.ok(!(b > r + 24 && b > g + 24 && r < 140), `#${m[1]} est un bleu`);
}
assert.match(css, /color-scheme:dark;/);
assert.match(css, /--background-soft:var\(--nuit-0\);/);
});

test("122 — le mouvement s'éteint quand le système le demande", () => {
const css = lire("admin/nuit.css");
const i = css.indexOf("@media (prefers-reduced-motion: reduce)");
assert.ok(i > 0);
assert.match(css.slice(i, i + 700), /animation:none !important;/);
// Lot 124 : plus de script d'animation — aucune page ne charge nuit.js
// (vérifié dans le premier test et dans test/lot124.test.mjs).
});

test("122 — la pulsation garde l'ordre de palette validé sur la nuit", () => {
const js = lire("admin/dashboard.js");
const couleurs = [...js.slice(js.indexOf("const PULSE_SERIES = ["), js.indexOf("const pulseState")).matchAll(/color: "(#[0-9A-F]{6})"/g)].map((m) => m[1]);
assert.deepEqual(couleurs, ["#199E70", "#C98500", "#D55181", "#008300", "#9085E9", "#E66767"]);
assert.match(js, /plugins: \[pluginVisee\]/);
assert.match(js, /function renderPulseResume\(days\)/);
assert.match(lire("admin/dashboard.html"), /id="pulseTotal"/);
});

test("122 — le poste de pilotage se lit dans l'ordre : chiffres, courbe, journée", () => {
const html = lire("admin/dashboard.html");
const a = html.indexOf('id="statsGrid"');
const b = html.indexOf('id="pulseChart"');
const c = html.indexOf('id="journeeGrid"');
assert.ok(a > 0 && a < b && b < c);
});
