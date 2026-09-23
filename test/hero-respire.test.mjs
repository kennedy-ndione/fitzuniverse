/**
* LA LIGNE DU DIAGNOSTIC RESPIRE (2026-09-23, demande de Charles).
* Vivante, mais toujours une LIGNE (doctrine PORTES-COULEUR) : pas de
* fond ambre plein, et aucun mouvement pour qui a demandé moins
* d'animations.
*/

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(join(racine, f), "utf8");
const sansCommentaires = (s) => s.replace(/\/\*[\s\S]*?\*\//g, "");

test("respire 1 — un point qui respire, décoratif, dans la ligne du diagnostic", () => {
const html = lire("index.html");
assert.match(html, /data-chemin="porte_diagnostic">\s*<span class="hero-diag-pouls" aria-hidden="true"><\/span>/);
});

test("respire 2 — le mouvement ne vit que sous prefers-reduced-motion: no-preference, et s'arrête au survol", () => {
const css = sansCommentaires(lire("css/hero.css"));
const bloc = css.slice(css.indexOf("@media (prefers-reduced-motion: no-preference){"));
assert.match(bloc, /\.hero-diag-pouls::after\{\s*animation:hero-diag-respire/);
assert.match(bloc, /\.hero-diag svg\{\s*animation:hero-diag-pousse/);
assert.match(bloc, /\.hero-diag:hover svg,[\s\S]*?animation:none;/);
// En dehors de ce bloc, aucune animation n'est posée sur la ligne.
const avant = css.slice(0, css.indexOf("@media (prefers-reduced-motion: no-preference){"));
assert.ok(!/\.hero-diag[^{]*\{[^}]*animation\s*:/.test(avant), "animation hors du bloc no-preference");
});

test("respire 3 — toujours une ligne : pas de fond ambre plein, le liseré seulement", () => {
const css = sansCommentaires(lire("css/hero.css"));
for (const m of css.matchAll(/\.hero-diag\{([^}]*)\}/g)) {
assert.ok(!/background:\s*#(E9A319|F2B640)/i.test(m[1]), "fond ambre plein : la ligne deviendrait une troisième porte");
}
});
