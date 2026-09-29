/**
* test/retour-contraste.test.mjs — « Retour à l'accueil » lisible sur la
* page sombre d'eligibility-test.html (2026-09-29).
*
* LE DÉFAUT. Le lien est posé sur --gradient-deep (graphite presque
* noir), hors de la carte. Il gardait la couleur de base de .back-link
* (--text-light, css/base.css), pensée pour un fond papier : mesuré à
* l'écran, 1,5:1 sur téléphone et 1,9:1 sur ordinateur, sous Chromium
* et WebKit. Le minimum WCAG pour un texte de cette taille est 4,5:1.
*
* LA RÈGLE. La couleur que la cascade des feuilles de la page donne à
* `.back-link` (et à `.back-link:hover`), variables résolues, atteint
* 4,5:1 sur CHAQUE arrêt du dégradé --gradient-deep.
*
* Preuve par mutation (2026-09-29) : la règle `.back-link` retirée de
* css/eligibility-test-redesign.css → test 1 rouge (1,95:1 sur l'arrêt le
* plus clair).
*/
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(path.join(RACINE, f), "utf8").replace(/\r\n/g, "\n");

// Les règles d'une feuille, dans l'ordre : sélecteurs et déclarations.
// Les at-règles sont mises à plat, sauf celles qui ne valent qu'au-delà
// d'une largeur (min-width) — le lien doit se lire partout.
function regles(css) {
const s = css.replace(/\/\*[\s\S]*?\*\//g, "");
const sortie = [];
const pile = [];
let tampon = "";
for (const c of s) {
if (c === "{") { pile.push(tampon.trim()); tampon = ""; }
else if (c === "}") {
const tete = pile.pop();
if (tete !== undefined && !tete.startsWith("@") && !pile.some((p) => /min-width/.test(p))) {
const decl = tampon.split(";").map((d) => { const i = d.indexOf(":"); return i < 0 ? null : [d.slice(0, i).trim().toLowerCase(), d.slice(i + 1).replace(/!important/i, "").trim()]; }).filter(Boolean);
sortie.push({ selecteurs: tete.split(",").map((x) => x.trim().replace(/\s+/g, " ")), decl });
}
tampon = "";
} else if (c === ";" && !pile.length) tampon = "";
else tampon += c;
}
return sortie;
}

// La dernière valeur d'une propriété pour un sélecteur exact.
const derniere = (toutes, sel, prop) => toutes.filter((r) => r.selecteurs.includes(sel)).flatMap((r) => r.decl).filter(([p]) => p === prop).map(([, v]) => v).pop();

function resoudre(valeur, toutes) {
let v = valeur;
for (let i = 0; i < 10 && /var\(/.test(v); i += 1) {
v = v.replace(/var\((--[\w-]+)(?:,\s*([^)]+))?\)/g, (_, nom, repli) => derniere(toutes, ":root", nom) ?? repli ?? "?");
}
return v;
}

export function rgba(v) {
const t = v.trim().toLowerCase();
let m = t.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/);
if (m) { const h = m[1].length === 3 ? [...m[1]].map((c) => c + c).join("") : m[1]; return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)).concat(1); }
m = t.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+%?))?\s*\)$/);
if (m) return [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : m[4].endsWith("%") ? parseFloat(m[4]) / 100 : +m[4]];
return null;
}

export function contraste(texte, fond) {
const lum = ([r, g, b]) => { const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const a = texte[3];
const vu = [0, 1, 2].map((k) => texte[k] * a + fond[k] * (1 - a));
const [l1, l2] = [lum(vu), lum(fond)];
return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

test("1. eligibility-test.html : « Retour à l'accueil » atteint 4,5:1 sur tout le fond sombre", () => {
const html = lire("eligibility-test.html");
const feuilles = [...html.replace(/<!--[\s\S]*?-->/g, "").matchAll(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"?#]+)/g)].map((m) => m[1]).filter((f) => !/^https?:/.test(f));
const toutes = feuilles.flatMap((f) => regles(lire(f)));

// Le fond : chaque arrêt de --gradient-deep, tel que la page le résout.
const degrade = resoudre("var(--gradient-deep)", toutes);
const arrets = (degrade.match(/#[0-9a-f]{6}\b|rgba?\([^)]*\)/gi) || []).map(rgba);
assert.ok(arrets.length >= 2, `--gradient-deep illisible : « ${degrade} »`);
// Témoin : le corps de la page est bien sur ce dégradé.
assert.equal(derniere(toutes, "body", "background"), "var(--gradient-deep)", "le fond d'eligibility-test.html n'est plus --gradient-deep : ce test doit être relu");

for (const sel of [".back-link", ".back-link:hover"]) {
const brute = derniere(toutes, sel, "color");
assert.ok(brute, `aucune couleur pour ${sel}`);
const couleur = rgba(resoudre(brute, toutes));
assert.ok(couleur, `${sel} : couleur non lisible (« ${brute} » → « ${resoudre(brute, toutes)} »)`);
const pire = Math.min(...arrets.map((f) => contraste(couleur, f)));
assert.ok(pire >= 4.5, `${sel} : ${brute} ne lit qu'à ${pire.toFixed(2)}:1 sur --gradient-deep (minimum 4,5:1)`);
}
});

test("2. le calcul de contraste est juste", () => {
assert.equal(contraste([0, 0, 0, 1], [255, 255, 255]).toFixed(2), "21.00");
assert.equal(contraste([255, 255, 255, 1], [255, 255, 255]).toFixed(2), "1.00");
assert.deepEqual(rgba("rgba(255, 255, 255, .94)"), [255, 255, 255, 0.94]);
assert.deepEqual(rgba("#2C2419"), [44, 36, 25, 1]);
});
