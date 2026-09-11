/**
* Lot PEIGNE-FIN (2026-09-10) — aucune icône fantôme.
*
* Chaque nom d'icône employé dans le site (`data-lucide="…"`, `icon: "…"`,
* `icon("…")`, et les branches littérales d'un `data-lucide="${…}"`) est
* validé contre LE PAQUET INSTALLÉ (node_modules/lucide@1.31.0, dans sa
* forme UMD — celle que le site charge depuis unpkg), pas contre une
* liste recopiée. Un nom qui ne correspond à aucune icône rend un <i>
* vide à l'écran, sans erreur : c'est ce test qui l'attrape.
*
* Preuve par mutation (2026-09-10) : `data-lucide="nom-inventé"` posé
* dans index.html → rouge.
*
* Et chaque page qui charge lucide charge js/icones.js juste après :
* c'est lui qui convertit ce qu'un rendu dynamique injecte après coup.
*/
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import vm from "node:vm";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(path.join(RACINE, f), "utf8").replace(/\r\n/g, "\n");

function iconesDuPaquet() {
const src = readFileSync(path.join(RACINE, "node_modules/lucide/dist/umd/lucide.js"), "utf8");
const ctx = { window: {}, self: {} };
ctx.globalThis = ctx;
vm.runInNewContext(src + "\n;this.__lucide = (typeof lucide !== 'undefined' ? lucide : window.lucide);", ctx);
return ctx.__lucide.icons;
}

const pascal = (k) => k.split("-").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join("");

export function fichiersDuSite() {
const out = [];
const parcourir = (d) => {
for (const e of readdirSync(path.join(RACINE, d), { withFileTypes: true })) {
if (e.isDirectory()) { if (!/^(node_modules|\.git|\.claude|sauvegardes|Claude outputs|design-previews|functions|scripts|test)$/.test(e.name)) parcourir(path.join(d, e.name)); }
else if (/\.(html|js)$/.test(e.name)) out.push(path.join(d, e.name));
}
};
parcourir(".");
return out;
}

export function nomsEmployes(fichiers = fichiersDuSite()) {
const noms = new Map();
const noter = (n, f) => noms.set(n, (noms.get(n) || new Set()).add(f));
for (const f of fichiers) {
const s = lire(f);
for (const m of s.matchAll(/data-lucide="([a-z0-9-]+)"/g)) noter(m[1], f);
for (const m of s.matchAll(/\bicon:\s*"([a-z0-9-]+)"/g)) noter(m[1], f);
for (const m of s.matchAll(/\bicon\("([a-z0-9-]+)"\)/g)) noter(m[1], f);
// data-lucide="${cond ? "a" : "b"}" : les branches littérales.
for (const m of s.matchAll(/data-lucide="\$\{([^}]*)\}"/g)) {
for (const n of m[1].matchAll(/\?\s*"([a-z0-9-]+)"|:\s*"([a-z0-9-]+)"|\|\|\s*"([a-z0-9-]+)"/g)) noter(n[1] || n[2] || n[3], f);
}
}
return noms;
}

test("icônes 1 — chaque nom d'icône du site existe dans le paquet lucide installé", () => {
const icones = iconesDuPaquet();
assert.ok(Object.keys(icones).length > 1500, "le paquet lucide n'est pas lu");
const noms = nomsEmployes();
assert.ok(noms.size > 100, `${noms.size} noms relevés seulement`);
const invalides = [...noms].filter(([n]) => !icones[pascal(n)]);
assert.deepEqual(invalides.map(([n, f]) => `${n} (${[...f].slice(0, 3).join(", ")})`), [], "icônes inconnues du paquet");
});

// Lot FINITIONS-VISUELLES (2026-09-11) : les icônes sparkles / sparkle /
// star / wand sont INTERDITES sur tout le site depuis le 2026-09-02
// (décision de Charles). profile.html en portait une (« sparkles » sur
// « Pour commencer »). Les variantes (star-half, wand-2, wand-sparkles…)
// tombent sous le même refus. Preuve par mutation : data-lucide="star"
// remis dans profile.html → rouge.
export const ICONES_INTERDITES = /^(sparkles?|star|stars|wand)(-|$)/;

test("icônes 3 — aucune icône interdite (sparkles, sparkle, star, wand) dans un fichier HTML ou JS servi", () => {
const noms = nomsEmployes();
const interdites = [...noms].filter(([n]) => ICONES_INTERDITES.test(n));
assert.deepEqual(interdites.map(([n, f]) => `${n} (${[...f].slice(0, 3).join(", ")})`), [], "icônes interdites présentes");
// Le détecteur voit bien un nom interdit.
assert.ok(ICONES_INTERDITES.test("sparkles") && ICONES_INTERDITES.test("star") && ICONES_INTERDITES.test("wand-2") && ICONES_INTERDITES.test("star-half"));
assert.ok(!ICONES_INTERDITES.test("flag") && !ICONES_INTERDITES.test("start"));
});

test("icônes 2 — toute page qui charge lucide charge js/icones.js juste après", () => {
const pages = fichiersDuSite().filter((f) => f.endsWith(".html"));
let n = 0;
for (const f of pages) {
const html = lire(f).replace(/<!--[\s\S]*?-->/g, "");
if (!/unpkg\.com\/lucide/.test(html)) continue;
n += 1;
const prefixe = f.startsWith("admin") ? "../js/icones.js" : "js/icones.js";
assert.ok(new RegExp(`unpkg\\.com/lucide[^>]*></script>\\s*<script src="${prefixe.replace(/[./]/g, "\\$&")}" defer></script>`).test(html), `${f} : js/icones.js absent après lucide`);
}
assert.ok(n >= 30, `${n} pages chargent lucide`);
});
