/**
* Lot HERO-PIED (2026-09-11) — une photo nette qui montre les visages, deux
* boutons qui appellent le clic.
*
*  1. plus aucune « respiration » : footer-breathe n'existe plus dans css/ ;
*  2. .footer-photo-img ne porte ni animation ni will-change ;
*  3. le cadrage n'est plus à 82 % (sous les visages) ;
*  4. les deux portes du hero restent d'égal poids (une seule règle
*     .hero-door, pas de variante « principale »), 52 px de haut, avec des
*     états hover / active / focus-visible et une flèche qui glisse.
*
* Preuve par mutation (2026-09-11) : l'animation remise → test 1 rouge.
* La hauteur du pied de page (< 406 px à 375) et le contenu vide des
* boutons restent contrôlés par le harnais (pages.mjs, peigne.mjs).
*/
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(path.join(RACINE, f), "utf8").replace(/\r\n/g, "\n");
const sansCommentaires = (css) => css.replace(/\/\*[\s\S]*?\*\//g, "");

test("hero-pied 1 — footer-breathe n'apparaît plus nulle part dans css/", () => {
for (const f of readdirSync(path.join(RACINE, "css")).filter((x) => x.endsWith(".css"))) {
assert.ok(!sansCommentaires(lire(`css/${f}`)).includes("footer-breathe"), `css/${f} : footer-breathe`);
}
});

test("hero-pied 2 — la photo du pied de page ne porte ni animation ni will-change, et son cadrage n'est plus à 82 %", () => {
const css = sansCommentaires(lire("css/pied-de-page.css"));
const blocs = [...css.matchAll(/\.footer-photo-img\{([^}]*)\}/g)].map((m) => m[1]);
assert.ok(blocs.length >= 1, "règle .footer-photo-img absente");
for (const b of blocs) {
assert.ok(!/animation\s*:/.test(b), "animation sur .footer-photo-img");
assert.ok(!/will-change\s*:/.test(b), "will-change sur .footer-photo-img");
assert.ok(!/transform-origin\s*:/.test(b), "transform-origin inutile");
}
const position = blocs.map((b) => b.match(/object-position\s*:\s*([^;]+)/)).find(Boolean);
assert.ok(position, "object-position absent");
assert.ok(!/82%/.test(position[1]), "cadrage encore à 82 % (sous les visages)");
assert.match(position[1], /center 5[4-9]%/, `cadrage ${position[1].trim()} hors de la bande des visages (54–59 %)`);
// Le @keyframes ne sert plus à personne : parti.
assert.ok(!/@keyframes footer-breathe/.test(css));
});

test("hero-pied 3 — les deux portes : égal poids, 52 px, états visibles, flèche qui glisse", () => {
const css = sansCommentaires(lire("css/hero.css"));
assert.ok(!/\.hero-door--(primary|principale|main)/.test(css), "une porte principale est apparue : décision à prendre avec Charles, pas ici");
const base = css.match(/\n\.hero-door\{([^}]*)\}/);
assert.ok(base, "règle .hero-door");
assert.match(base[1], /min-height:\s*52px/);
assert.match(base[1], /box-shadow:/, "le bouton doit se détacher de la photo");
assert.match(css, /\.hero-door:hover\{[^}]*translateY\(-2px\)/);
assert.match(css, /\.hero-door:active\{[^}]*translateY\(1px\)/);
assert.match(css, /\.hero-door:focus-visible\{[^}]*outline:\s*3px solid #E9A319/, "anneau ambre, littéral #E9A319 (jamais var(--amber-500))");
assert.match(css, /\.hero-door:hover svg[^{]*\{[^}]*translateX\(4px\)/, "la flèche glisse au survol");
// Les deux portes existent, avec la même classe et la même flèche SVG en clair.
const html = lire("index.html").replace(/<!--[\s\S]*?-->/g, "");
const portes = [...html.matchAll(/<a href="([^"]+)" class="hero-door">/g)].map((m) => m[1]);
assert.deepEqual(portes, ["scholarships.html", "preinscriptions.html"]);
assert.equal((html.match(/class="hero-door">\s*<span>[^<]+<\/span>\s*<svg /g) || []).length, 2, "flèche SVG en clair sur les deux portes, pas de Lucide");
});
