/**
* test/hidden-respecte.test.mjs — un élément que la page masque par
* `el.hidden = true` disparaît vraiment (2026-09-29).
*
* LE DÉFAUT. results.js masque « Aucun engagement à cette étape. »
* (#closingNote) pour un client qui a déjà une formule : sous « Continuer
* dans mon espace », la phrase n'a plus de sens. Mais results.css donne
* `.closing-note{ display:flex }`, et une règle d'auteur l'emporte sur la
* feuille du navigateur (`[hidden]{ display:none }`) : l'attribut était
* posé, la note restait à l'écran.
*
* LA RÈGLE. Pour chaque élément que results.js masque par `.hidden`, si
* une feuille de results.html lui donne un `display` autre que `none`,
* une règle `.classe[hidden]` (ou `#id[hidden]`) doit le remettre à
* `display:none`. C'est l'idiome du site (css/journey.css, css/ai-suite.css,
* css/offers-redesign.css…).
*
* Preuve par mutation (2026-09-29) : `.closing-note[hidden]` retiré de
* results.css → test 1 rouge.
*/
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(path.join(RACINE, f), "utf8").replace(/\r\n/g, "\n");

// Les règles d'une feuille : sélecteurs et déclarations (at-règles à plat).
function regles(css) {
const s = css.replace(/\/\*[\s\S]*?\*\//g, "");
const sortie = [];
for (const m of s.matchAll(/([^{}@;]+)\{([^{}]*)\}/g)) {
const decl = m[2].split(";").map((d) => d.split(":")).filter((d) => d.length > 1).map(([p, ...v]) => [p.trim().toLowerCase(), v.join(":").trim()]);
sortie.push({ selecteurs: m[1].split(",").map((x) => x.trim().replace(/\s+/g, " ")), decl });
}
return sortie;
}

// Les identifiants que le script masque par `const x = document.getElementById("id"); … x.hidden = …`.
export function idsMasques(js) {
const ids = new Set();
for (const m of js.matchAll(/const (\w+) = document\.getElementById\("([\w-]+)"\);[\s\S]{0,120}?\b\1\.hidden\s*=/g)) ids.add(m[2]);
return [...ids];
}

// Ce qui, dans les feuilles, affiche l'élément malgré `hidden`.
export function affichesMalgreHidden(html, feuilles, ids) {
const toutes = feuilles.flatMap((f) => regles(f));
const fautes = [];
for (const id of ids) {
const balise = html.match(new RegExp(`<[a-z][^>]*\\bid="${id}"[^>]*>`, "i"));
if (!balise) continue;
const classes = ((balise[0].match(/\bclass="([^"]*)"/) || [])[1] || "").split(/\s+/).filter(Boolean);
const cles = [`#${id}`, ...classes.map((c) => `.${c}`)];
const visePar = (sel) => cles.some((k) => sel === k || sel.endsWith(` ${k}`) || sel.endsWith(`>${k}`));
const affiche = toutes.filter((r) => r.selecteurs.some(visePar) && r.decl.some(([p, v]) => p === "display" && !/^none\b/.test(v)));
if (!affiche.length) continue;
const masque = toutes.some((r) => r.selecteurs.some((sel) => sel === "[hidden]" || cles.some((k) => sel === `${k}[hidden]` || sel.endsWith(` ${k}[hidden]`)))
&& r.decl.some(([p, v]) => p === "display" && /^none\b/.test(v)));
if (!masque) fautes.push(`#${id} : ${affiche.map((r) => r.selecteurs.join(", ")).join(" ; ")} l'affiche, aucune règle ${cles.map((k) => `${k}[hidden]`).join(" / ")} ne le masque`);
}
return fautes;
}

test("1. results.html : ce que results.js masque par .hidden disparaît vraiment", () => {
const html = lire("results.html");
const ids = idsMasques(lire("results.js"));
// Témoin : la note de clôture est bien dans le périmètre.
assert.ok(ids.includes("closingNote"), `results.js ne masque plus #closingNote par .hidden (vus : ${ids.join(", ")}) : ce test doit être relu`);
const feuilles = [...html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"?#]+)/g)].map((m) => m[1]).filter((f) => !/^https?:/.test(f)).map(lire);
assert.deepEqual(affichesMalgreHidden(html, feuilles, ids), []);
});

test("2. le détecteur voit la panne et accepte le correctif", () => {
const html = `<p class="note" id="n">x</p>`;
assert.equal(affichesMalgreHidden(html, [".note{ display:flex; }"], ["n"]).length, 1);
assert.deepEqual(affichesMalgreHidden(html, [".note{ display:flex; } .note[hidden]{ display:none; }"], ["n"]), []);
assert.deepEqual(affichesMalgreHidden(html, [".note{ color:red; }"], ["n"]), []);
assert.deepEqual(idsMasques(`const note = document.getElementById("n");\nif (note) note.hidden = true;`), ["n"]);
});
