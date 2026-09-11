/**
* Lot CONTRÔLES-UNIFIÉS (2026-09-11) — plus aucun contrôle système sur le site.
*
* Charles refuse les contrôles dessinés par le système d'exploitation
* (panneau noir d'un <datalist>, curseur d'un <input type="number">,
* liste blanche d'un <select>). Le modèle est le rendu de fitz-select.
*
* Ce test balaie TOUS les .html du dépôt (racine + admin) et échoue si :
*  1. un <datalist> existe ;
*  2. un <input type="number"> n'a pas la classe .fitz-num (curseur masqué) ;
*  3. un <input type="date"> n'a pas la classe .fitz-date (champ habillé,
*     sélecteur natif GARDÉ — décision écrite dans css/base.css) ;
*  4. un <select> est sur une page qui ne charge pas le composant : la page
*     (ou un module qu'elle importe, récursivement) doit atteindre
*     js/fitz-select.js ou js/catalog-select.js ;
*  5. les listes COUVERTES / EXEMPTÉES sont explicites : une page qui a
*     un select doit être dans l'une des deux — une exception se décide.
*  6. un seul système : plus de appearance:base-select dans css/.
*
* Preuve par mutation (2026-09-11) : un <datalist> remis → test 1 rouge.
*/
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(path.join(RACINE, f), "utf8").replace(/\r\n/g, "\n");
const sansCommentaires = (s) => s.replace(/<!--[\s\S]*?-->/g, "");

const PAGES = [
...readdirSync(RACINE).filter((f) => f.endsWith(".html") && !/^import-/.test(f)),
...readdirSync(path.join(RACINE, "admin")).filter((f) => f.endsWith(".html")).map((f) => `admin/${f}`)
];

// Les pages qui portent un <select> et DOIVENT être habillées.
export const SELECT_COUVERTS = [
"advisor.html", "ai-check.html", "ai-email.html", "ai-letter.html", "ai-translate.html",
"applications.html", "compress.html", "diagnostic-france.html", "messages.html", "profile.html",
"scholarships.html", "universities.html",
"admin/scholarships.html", "admin/student-detail.html", "admin/students.html", "admin/universities.html", "admin/university.html"
];
// Aucune exemption aujourd'hui : une page qui en aurait besoin se déclare ici, avec sa raison.
export const SELECT_EXEMPTES = [];

// Les modules (scripts src, modules inline) qu'une page atteint, récursivement.
function modulesAtteints(page) {
const html = sansCommentaires(lire(page));
const base = path.dirname(page);
const vus = new Set();
const file = [];
for (const m of html.matchAll(/<script[^>]*src="([^"]+)"/g)) if (!/^https?:/.test(m[1])) file.push(path.normalize(path.join(base, m[1])));
for (const m of html.matchAll(/<script type="module">([\s\S]*?)<\/script>/g)) for (const i of m[1].matchAll(/from\s*["']([^"']+)["']/g)) if (!/^https?:/.test(i[1])) file.push(path.normalize(path.join(base, i[1])));
while (file.length) {
const f = file.pop();
if (vus.has(f) || !existsSync(path.join(RACINE, f))) continue;
vus.add(f);
const src = lire(f);
for (const m of src.matchAll(/(?:^|\n)\s*(?:import|export)\s[^;]*?from\s*["']([^"']+)["']/g)) if (!/^https?:/.test(m[1])) file.push(path.normalize(path.join(path.dirname(f), m[1])));
for (const m of src.matchAll(/(?:^|\n)\s*import\s*["']([^"']+)["']/g)) if (!/^https?:/.test(m[1])) file.push(path.normalize(path.join(path.dirname(f), m[1])));
for (const m of src.matchAll(/import\(\s*["']([^"']+)["']\s*\)/g)) if (!/^https?:/.test(m[1])) file.push(path.normalize(path.join(path.dirname(f), m[1])));
}
return [...vus].map((f) => f.replace(/\\/g, "/"));
}

test("contrôles 1 — plus aucun <datalist> dans le dépôt", () => {
for (const page of PAGES) assert.ok(!/<datalist\b/i.test(sansCommentaires(lire(page))), `${page} : un <datalist> (panneau système)`);
for (const page of PAGES) assert.ok(!/<input[^>]*\slist="/i.test(sansCommentaires(lire(page))), `${page} : un champ pointe encore un datalist`);
});

test("contrôles 2 — chaque <input type=\"number\"> masque son curseur (.fitz-num) et garde son type", () => {
for (const page of PAGES) {
for (const m of sansCommentaires(lire(page)).matchAll(/<input\b[^>]*type="number"[^>]*>/g)) {
assert.match(m[0], /class="[^"]*\bfitz-num\b/, `${page} : ${m[0].slice(0, 80)}`);
}
}
const css = lire("css/base.css");
assert.match(css, /input\.fitz-num::-webkit-inner-spin-button\{[^}]*appearance:none/);
});

test("contrôles 3 — chaque <input type=\"date\"> est habillé (.fitz-date), sélecteur natif gardé et décision écrite", () => {
for (const page of PAGES) {
for (const m of sansCommentaires(lire(page)).matchAll(/<input\b[^>]*type="date"[^>]*>/g)) {
assert.match(m[0], /class="[^"]*\bfitz-date\b/, `${page} : ${m[0].slice(0, 80)}`);
}
}
const css = lire("css/base.css");
assert.match(css, /DATE — DÉCISION[\s\S]*le sélecteur natif est\s*GARDÉ/);
assert.match(css, /input\.fitz-date\{/);
});

test("contrôles 4 — chaque page qui porte un <select> atteint fitz-select ou catalog-select", () => {
const avecSelect = PAGES.filter((p) => /<select\b/i.test(sansCommentaires(lire(p))));
for (const page of avecSelect) {
assert.ok(SELECT_COUVERTS.includes(page) || SELECT_EXEMPTES.includes(page), `${page} porte un <select> et n'est dans aucune liste — décider : couverte ou exemptée (avec sa raison)`);
}
for (const page of SELECT_COUVERTS) {
assert.ok(avecSelect.includes(page), `${page} est listée « couverte » mais n'a plus de <select>`);
const modules = modulesAtteints(page);
assert.ok(modules.some((m) => /js\/(fitz-select|catalog-select)\.js$/.test(m)), `${page} : aucun module atteint n'habille les <select> (atteints : ${modules.filter((m) => /select/.test(m)).join(", ") || "aucun"})`);
}
});

test("contrôles 5 — un seul système : plus de appearance:base-select, et fitz-select charge sa feuille", () => {
const feuilles = [
...readdirSync(path.join(RACINE, "css")).filter((f) => f.endsWith(".css")).map((f) => `css/${f}`),
...readdirSync(path.join(RACINE, "admin")).filter((f) => f.endsWith(".css")).map((f) => `admin/${f}`),
...readdirSync(RACINE).filter((f) => f.endsWith(".css"))
];
for (const f of feuilles) assert.ok(!/appearance\s*:\s*base-select|::picker\(/.test(lire(f).replace(/\/\*[\s\S]*?\*\//g, "")), `${f} : le second système (base-select) est encore là`);
assert.ok(existsSync(path.join(RACINE, "css/fitz-select.css")));
assert.match(lire("js/fitz-select.js"), /css\/fitz-select\.css/);
assert.match(lire("js/fitz-combobox.js"), /css\/fitz-select\.css/);
assert.ok(!/^\.fitz-select\{/m.test(lire("css/app-shell.css").replace(/\/\*[\s\S]*?\*\//g, "")), "app-shell.css garde une copie des règles");
// L'admin est branché par son seul module commun.
assert.match(lire("admin/admin-auth.js"), /import \{ initFitzSelects \} from "\.\.\/js\/fitz-select\.js";\s*initFitzSelects\(\);/);
});
