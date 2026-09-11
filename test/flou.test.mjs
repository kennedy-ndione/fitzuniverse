/**
* Lot DEUX-MOTEURS (2026-09-11) — le gardien des halos sans flou.
*
* Sur l'iPhone de Charles (Safari 18.7), deux défauts de COMPOSITION :
* un carré noir de ~180 px collé au coin haut-gauche d'offers.html, et
* deux messages dessinés l'un sur l'autre dans la carte « Analyse en
* direct » de l'accueil. Cause commune probable : un pseudo-élément
* décoratif en `z-index:-1` portant `filter: blur(70px)` (ou 32, 50…),
* qui force WebKit à séparer le fond d'un conteneur de son premier plan,
* dans un calque composé qu'il n'a pas toujours peint ni empilé
* correctement. Un dégradé radial qui va jusqu'à `transparent` est déjà
* doux : le flou n'adoucissait que le dernier bord, au prix d'un calque.
*
*  1. aucune feuille SERVIE (même périmètre que l'hébergement, via
*     scripts/hosting-publie.mjs) ne porte `filter: … blur(N px)` avec
*     N > 8 — sauf exception JUSTIFIÉE dans LISTE_BLANCHE (vide) ;
*     `backdrop-filter` n'est pas concerné (autre mécanisme, autre lot) ;
*  2. le détecteur est prouvé par mutation : `filter:blur(70px)` dans une
*     feuille doit être vu, un commentaire qui le cite non ;
*  3. (Partie 5 du même lot — vieux Safari, plancher iOS 15.4) aucun
*     lookbehind `(?<=` / `(?<!` dans le JS servi : SyntaxError avant
*     iOS 16.4, qui fait tomber le module ENTIER et tous ceux qui
*     l'importent (MDN : lookbehind, Safari 16.4) ;
*  4. aucun `requestIdleCallback` sans garde : désactivé par défaut dans
*     TOUS les Safari (caniuse, relevé du 2026-09-11), donc aussi sur
*     l'iPhone de Charles.
*/
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { listerPublies } from "../scripts/hosting-publie.mjs";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(path.join(RACINE, f), "utf8").replace(/\r\n/g, "\n");

export const FLOU_MAX_PX = 8;

// Exceptions : { fichier, selecteur, raison }. Vide par défaut — toute
// entrée doit dire POURQUOI ce flou-là ne peut pas être remplacé par un
// arrêt intermédiaire de dégradé.
export const LISTE_BLANCHE = [];

const vider = (m) => m.replace(/[^\n]/g, "");

// Les flous > FLOU_MAX_PX d'une feuille (ou d'un style inline), hors
// commentaires et hors `backdrop-filter`.
export function flousDe(source, fichier = "?") {
// Les commentaires sont vidés mais leurs sauts de ligne gardés : les
// numéros de ligne restent ceux du fichier.
const sansCommentaires = source.replace(/\/\*[\s\S]*?\*\//g, vider).replace(/<!--[\s\S]*?-->/g, vider);
const trouves = [];
for (const m of sansCommentaires.matchAll(/(?<![\w-])filter\s*:\s*([^;{}"]*)/g)) {
for (const b of m[1].matchAll(/blur\(\s*([\d.]+)px\s*\)/g)) {
const px = Number(b[1]);
if (px > FLOU_MAX_PX) {
const ligne = sansCommentaires.slice(0, m.index).split("\n").length;
trouves.push({ fichier, ligne, px, declaration: m[0].trim() });
}
}
}
return trouves;
}

const publies = () => listerPublies(RACINE).map((f) => f.replace(/\\/g, "/"));

test("flou 1 — aucune feuille servie ne porte filter: blur() au-delà de 8 px (liste blanche vide)", () => {
const fichiers = publies().filter((f) => /\.(css|html)$/.test(f));
assert.ok(fichiers.length > 40, `${fichiers.length} feuilles/pages servies : le périmètre semble faux`);
const trouves = fichiers.flatMap((f) => flousDe(lire(f), f))
.filter((t) => !LISTE_BLANCHE.some((e) => e.fichier === t.fichier && e.raison && t.declaration.includes(e.selecteur || "")));
assert.deepEqual(trouves, [], `flou décoratif > ${FLOU_MAX_PX} px (calque composé fragile sous WebKit) :\n` + trouves.map((t) => `  ${t.fichier}:${t.ligne} ${t.declaration} (${t.px} px)`).join("\n"));
for (const e of LISTE_BLANCHE) assert.ok(e.fichier && e.raison, "chaque exception de LISTE_BLANCHE porte un fichier et une raison");
});

test("flou 2 — le détecteur voit blur(70px), ignore les commentaires, les petits flous et backdrop-filter", () => {
assert.equal(flousDe(".a::before{ filter:blur(70px); }").length, 1);
assert.equal(flousDe(".a::before{ filter: blur(9px) saturate(1.2); }")[0].px, 9);
assert.equal(flousDe("/* filter:blur(70px) */ .a{ filter:blur(8px); }").length, 0);
assert.equal(flousDe(".a{ backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); }").length, 0);
assert.equal(flousDe(".a{ filter:blur(1.5px); }").length, 0);
assert.equal(flousDe('<div style="filter:blur(24px)">').length, 1);
});

// ---- Partie 5 : vieux Safari ----

const sansCommentairesJs = (s) => s.replace(/\/\*[\s\S]*?\*\//g, vider).replace(/(^|[^:\\])\/\/[^\n]*/g, "$1");

export function lookbehindsDe(source, fichier = "?") {
const s = sansCommentairesJs(source);
return [...s.matchAll(/\(\?<[=!]/g)].map((m) => ({ fichier, ligne: s.slice(0, m.index).split("\n").length }));
}

export function idleSansGardeDe(source, fichier = "?") {
const s = sansCommentairesJs(source);
const lignes = s.split("\n");
const trouves = [];
lignes.forEach((l, i) => {
if (!/requestIdleCallback/.test(l)) return;
if (/typeof\s+(window\.)?requestIdleCallback|["']requestIdleCallback["']\s+in\s+window|requestIdleCallback\s*(\?\?|\|\|)/.test(l)) return;
trouves.push({ fichier, ligne: i + 1, texte: l.trim().slice(0, 100) });
});
return trouves;
}

const jsServis = () => publies().filter((f) => /\.(js|mjs|html)$/.test(f));

test("flou 3 — aucun lookbehind (?<= (?<! dans le JS servi : SyntaxError avant iOS 16.4, le module entier tombe", () => {
const trouves = jsServis().flatMap((f) => lookbehindsDe(lire(f), f));
assert.deepEqual(trouves, [], "lookbehind trouvé :\n" + trouves.map((t) => `  ${t.fichier}:${t.ligne}`).join("\n"));
assert.equal(lookbehindsDe("x.split(/(?<=\\s)/)").length, 1, "le détecteur voit un lookbehind");
assert.equal(lookbehindsDe("// (?<=\\s) en commentaire").length, 0, "et ignore un commentaire");
});

test("flou 4 — aucun requestIdleCallback sans garde (désactivé par défaut dans tous les Safari)", () => {
const trouves = jsServis().flatMap((f) => idleSansGardeDe(lire(f), f));
assert.deepEqual(trouves, [], "requestIdleCallback sans garde :\n" + trouves.map((t) => `  ${t.fichier}:${t.ligne} ${t.texte}`).join("\n"));
assert.equal(idleSansGardeDe("requestIdleCallback(() => {});").length, 1);
assert.equal(idleSansGardeDe("(window.requestIdleCallback || setTimeout)(() => {});").length, 0);
assert.equal(idleSansGardeDe("if (typeof requestIdleCallback === 'function') requestIdleCallback(f);").length, 0);
});
