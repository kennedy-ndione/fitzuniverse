/**
* Zone tactile (2026-09-28) — la marge négative ne compense que ce
* qu'elle ajoute.
*
* Sur téléphone, css/mobile-nav.css (section 5, audit du 2026-09-03)
* agrandit la zone de toucher des liens texte par un idiome :
* `padding-block:P; margin-block:-P`. Sa promesse, écrite au-dessus de
* la règle : « le rendu ne bouge pas d'un pixel, seul le doigt y
* gagne ». Elle tient sur un lien nu. Elle cassait sur deux éléments qui
* avaient déjà une boîte verticale (mesuré le 2026-09-28, Chromium et
* WebKit, 320, 375 et 414 px) :
*
*   - `.jy-tool` (css/journey.css : padding:8px 13px, bordure, fond) :
*     l'idiome REMPLAÇAIT son rembourrage au lieu de l'agrandir, et la
*     marge de -8 px retirait 16 px à sa place dans la rangée. Deux
*     lignes d'outils qui passent à la ligne se chevauchaient de 8 px
*     (test-prep.html, espace-bourse.html) depuis le 2026-09-06 ;
*   - `.welcome-alert-cta` (dashboard.css : margin-top:10px) : l'idiome
*     ÉCRASAIT sa marge, et le lien remontait de 7 px contre son
*     paragraphe.
*
*  1. pour chaque règle d'idiome et chaque côté (haut, bas) :
*     rembourrage + marge de la règle = rembourrage + marge de la base,
*     sinon le rendu bouge (`margin-block:2px -8px` sur un élément à
*     margin-top:10px est une compensation exacte : acceptée). Et une
*     boîte PEINTE (fond, bordure, ombre) ne voit pas son rembourrage
*     changer : il se verrait, la pastille grandirait. Une pastille gagne
*     sa hauteur tactile par min-height, visiblement ;
*  2. les outils du parcours gardent 44 px de haut sur téléphone ;
*  3. le détecteur est prouvé sur des feuilles écrites pour lui.
*
* Limite : la base se lit par sélecteur EXACT (`.jy-tool` ↔ `.jy-tool`).
* Une règle de base écrite autrement (`.jy-tools > a`, `.back-link` pour
* `a.back-link`) n'est pas vue. Le rendu, lui, est mesuré par le peigne
* du harnais (scripts/verifier/peigne.mjs : deux contrôles dessinés qui
* se chevauchent).
*/
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { listerPublies } from "../scripts/hosting-publie.mjs";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(path.join(RACINE, f), "utf8").replace(/\r\n/g, "\n");

// Les déclarations d'un bloc, DANS L'ORDRE (la dernière l'emporte).
export function declarationsDe(bloc) {
const decl = [];
for (const morceau of bloc.split(";")) {
const i = morceau.indexOf(":");
if (i < 0) continue;
const prop = morceau.slice(0, i).trim().toLowerCase();
if (prop) decl.push([prop, morceau.slice(i + 1).replace(/!important/i, "").trim()]);
}
return decl;
}

// Les règles de style d'une feuille : sélecteurs, déclarations, et les
// at-règles (@media…) qui les enveloppent.
export function reglesDe(source, feuille = "?") {
const s = source.replace(/\r\n/g, "\n").replace(/\/\*[\s\S]*?\*\//g, "");
const regles = [];
const pile = [];
let tampon = "";
for (const c of s) {
if (c === "{") {
const tete = tampon.trim();
pile.push(tete.startsWith("@") ? { at: tete } : { selecteurs: tete.split(",").map((x) => x.trim().replace(/\s+/g, " ")) });
tampon = "";
} else if (c === "}") {
const bloc = pile.pop();
if (bloc && bloc.selecteurs) regles.push({ feuille, at: pile.map((p) => p.at).filter(Boolean), selecteurs: bloc.selecteurs, decl: declarationsDe(tampon) });
tampon = "";
} else if (c === ";" && !(pile.length && pile[pile.length - 1].selecteurs)) {
// @import, @charset, ou une déclaration d'@font-face : rien à garder.
tampon = "";
} else tampon += c;
}
return regles;
}

// Une longueur en px ; 0 sans unité ; NaN pour tout le reste (var(),
// calc(), rem…) — le contrôle le dit au lieu de deviner.
export const px = (v) => {
const t = String(v).trim();
if (/^-?0*\.?0+(px|rem|em|%)?$/.test(t)) return 0;
const m = t.match(/^(-?\d*\.?\d+)px$/);
return m ? Number(m[1]) : NaN;
};

// Les côtés verticaux (haut, bas) qu'une règle déclare pour une famille
// (`padding` ou `margin`) : raccourci, logique (-block) ou physique.
export function vertical(decl, famille) {
const cotes = {};
for (const [prop, valeur] of decl) {
const v = valeur.split(/\s+/);
if (prop === famille) { cotes.haut = v[0]; cotes.bas = v[2] ?? v[0]; }
else if (prop === `${famille}-block`) { cotes.haut = v[0]; cotes.bas = v[1] ?? v[0]; }
else if (prop === `${famille}-top` || prop === `${famille}-block-start`) cotes.haut = valeur;
else if (prop === `${famille}-bottom` || prop === `${famille}-block-end`) cotes.bas = valeur;
}
return cotes;
}

// Ce qui rend une boîte visible au-delà de son texte.
export function peintureDe(decl) {
const raisons = new Set();
for (const [prop, valeur] of decl) {
const v = valeur.toLowerCase();
if (/^background(-color|-image)?$/.test(prop) && !/^(none|transparent|initial|unset|inherit)$/.test(v)) raisons.add("fond");
if (/^border(-top|-bottom|-left|-right|-block|-inline)?(-width|-style)?$/.test(prop) && !/^(0|0px|initial|unset|inherit)$/.test(v) && !/\b(none|hidden|transparent)\b/.test(v)) raisons.add("bordure");
if (prop === "box-shadow" && !/^(none|initial|unset|inherit)$/.test(v)) raisons.add("ombre");
}
return [...raisons];
}

// L'idiome : sur au moins un côté, un rembourrage P > 0 et une marge
// exactement -P, déclarés par la même règle. Un `margin:-1px` de texte
// masqué (.visually-hidden) ou la marge négative d'un héros qui chevauche
// sa photo ne sont pas des zones tactiles : ce sont leurs propres bases.
const estIdiome = (r) => {
const marge = vertical(r.decl, "margin");
const rembourrage = vertical(r.decl, "padding");
return ["haut", "bas"].some((c) => px(rembourrage[c]) > 0 && px(marge[c]) === -px(rembourrage[c]));
};

/**
* Les écarts à la promesse de l'idiome, toutes feuilles confondues.
* La BASE d'un sélecteur : toute règle hors idiome au sélecteur exact,
* hors @media (min-width…) — qui ne s'applique pas sur téléphone.
*/
export function ecartsZoneTactile(regles) {
const idiomes = regles.filter(estIdiome);
const bases = regles.filter((r) => !estIdiome(r) && !r.at.some((a) => /min-width/.test(a)));
const ecarts = [];
for (const r of idiomes) {
for (const sel of r.selecteurs) {
const base = { padding: {}, margin: {}, sources: new Set(), peinture: new Set() };
for (const b of bases.filter((x) => x.selecteurs.includes(sel))) {
for (const famille of ["padding", "margin"]) {
const v = vertical(b.decl, famille);
for (const cote of ["haut", "bas"]) if (v[cote] !== undefined) { base[famille][cote] = v[cote]; base.sources.add(b.feuille); }
}
for (const p of peintureDe(b.decl)) base.peinture.add(`${p} (${b.feuille})`);
}
const idiome = { padding: vertical(r.decl, "padding"), margin: vertical(r.decl, "margin") };
for (const cote of ["haut", "bas"]) {
const bp = base.padding[cote] ?? "0", bm = base.margin[cote] ?? "0";
const ip = idiome.padding[cote] ?? bp, im = idiome.margin[cote] ?? bm;
const avant = px(bp) + px(bm), apres = px(ip) + px(im);
const origine = [...base.sources].join(", ") || "aucune règle de base";
if (Number.isNaN(avant) || Number.isNaN(apres)) ecarts.push(`${r.feuille} « ${sel} » (${cote}) : ${ip} + ${im} contre ${bp} + ${bm} (${origine}) — valeurs non comparables, à vérifier au navigateur`);
else if (Math.abs(apres - avant) > 0.01) ecarts.push(`${r.feuille} « ${sel} » (${cote}) : rembourrage + marge = ${ip} + ${im} au lieu de ${bp} + ${bm} (${origine}) — le rendu bouge de ${apres - avant} px`);
}
const grandit = ["haut", "bas"].some((c) => px(idiome.padding[c] ?? base.padding[c] ?? "0") !== px(base.padding[c] ?? "0"));
if (base.peinture.size && grandit) ecarts.push(`${r.feuille} « ${sel} » : boîte peinte (${[...base.peinture].join(", ")}) — son rembourrage ajouté se voit ; une pastille prend sa hauteur par min-height`);
}
}
return { idiomes, ecarts };
}

const feuillesServies = () => listerPublies(RACINE).map((f) => f.replace(/\\/g, "/")).filter((f) => f.endsWith(".css"));

test("zone tactile 1 — l'idiome padding + marge négative ne déplace rien et ne vise aucune boîte peinte", () => {
const feuilles = feuillesServies();
assert.ok(feuilles.length > 40, `${feuilles.length} feuilles servies : le périmètre semble faux`);
const { idiomes, ecarts } = ecartsZoneTactile(feuilles.flatMap((f) => reglesDe(lire(f), f)));
// Témoin : le contrôle voit bien les règles qu'il garde — sans elles,
// il passerait à vide.
const vus = idiomes.flatMap((r) => r.selecteurs.map((s) => `${r.feuille} ${s}`));
for (const attendu of ["css/mobile-nav.css .free-step-link", "css/mobile-nav.css .welcome-alert-cta", "css/mobile-nav.css .ai-context-adjust", "css/login-redesign.css .forgot-link"]) {
assert.ok(vus.includes(attendu), `idiome attendu non vu : ${attendu} (vus : ${vus.join(" | ")})`);
}
assert.deepEqual(ecarts, [], "zone tactile qui déplace le rendu :\n" + ecarts.map((e) => "  " + e).join("\n"));
});

test("zone tactile 2 — les outils du parcours gardent 44 px de haut sur téléphone, sans marge négative", () => {
const regles = reglesDe(lire("css/mobile-nav.css"), "css/mobile-nav.css");
const telephone = regles.filter((r) => r.selecteurs.includes(".jy-tool") && r.at.some((a) => /max-width:\s*720px/.test(a)));
const hauteur = telephone.flatMap((r) => r.decl).filter(([p]) => p === "min-height").map(([, v]) => px(v));
assert.ok(hauteur.some((h) => h >= 44), `.jy-tool sans min-height ≥ 44px dans @media (max-width:720px) (lu : ${hauteur.join(", ") || "rien"})`);
assert.ok(!telephone.some(estIdiome), ".jy-tool est une pastille peinte : pas de marge négative");
});

test("zone tactile 3 — le détecteur voit les deux pannes et accepte une compensation exacte", () => {
const ecarts = (css) => ecartsZoneTactile(reglesDe(css, "t.css")).ecarts;
const idiome = (sel, valeurs = "padding-block:8px; margin-block:-8px;") => `@media (max-width:720px){ ${sel}{ ${valeurs} } }`;
// La panne de .jy-tool : son rembourrage remplacé, -8 px en haut et en bas.
assert.equal(ecarts(`.a{ padding:8px 13px; border:1px solid #ccc; } ${idiome(".a")}`).length, 2);
// La panne de .welcome-alert-cta : marge écrasée (10 px → -8 + 8).
assert.match(ecarts(`.b{ margin-top:10px; } ${idiome(".b")}`)[0], /bouge de -10 px/);
// Compensée exactement : 2 + 8 = 10 en haut, -8 + 8 = 0 en bas.
assert.deepEqual(ecarts(`.b{ margin-top:10px; } ${idiome(".b", "padding-block:8px; margin-block:2px -8px;")}`), []);
// Un lien nu : la promesse tient.
assert.deepEqual(ecarts(`.c{ color:red; font-weight:700; } ${idiome(".c")}`), []);
// Une boîte peinte : la mise en page tient, mais la pastille grandit à l'œil.
assert.deepEqual(ecarts(`.d{ background:#fff; border-radius:10px; } ${idiome(".d")}`).map((e) => /boîte peinte/.test(e)), [true]);
assert.deepEqual(ecarts(`.d{ border-bottom:1px solid #ccc; } ${idiome(".d")}`).map((e) => /boîte peinte/.test(e)), [true]);
// Une marge négative sans rembourrage égal n'est pas l'idiome (texte
// masqué, héros qui chevauche sa photo) : hors du contrôle.
assert.deepEqual(ecartsZoneTactile(reglesDe(".h{ padding:0; margin:-1px; } .i{ margin-top:-74px; padding-bottom:28px; }")).idiomes, []);
// Fond et bordure neutralisés : ce n'est plus une boîte peinte.
assert.deepEqual(ecarts(`.e{ background:none; border:none; padding:0; } ${idiome(".e")}`), []);
// Une règle de bureau (@media min-width) ne compte pas dans la base.
assert.deepEqual(ecarts(`@media (min-width:900px){ .f{ padding:20px; } } ${idiome(".f")}`), []);
// Une valeur qu'on ne sait pas lire est signalée, pas devinée.
assert.match(ecarts(`.g{ padding:var(--x); } ${idiome(".g")}`)[0], /non comparables/);
});
