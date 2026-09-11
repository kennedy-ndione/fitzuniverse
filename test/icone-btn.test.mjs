/**
* Lot ICONE-BTN (2026-09-11) — les boutons sans style de bureau.
*
* Sur ai-chat.html, « Renommer » et « Supprimer » (liste des
* conversations) étaient vides sur ordinateur, corrects sur téléphone.
* Vu dans l'inspecteur : le <svg> existait, à 0×0 — la boîte de 26px de
* `.ai-chat-history-item-actions .ai-icon-btn` gardait le rembourrage
* 8px 12px de `.ai-icon-btn` ; le renfort tactile (min 40×40, ≤720px)
* rendait la place sur téléphone. Le brief supposait « aucune règle de
* base » : elle existait (css/ai-suite.css), c'est l'héritage qui tuait.
*
*  1. `.ai-icon-btn` et `.ai-mode-tab` ont une règle HORS @media ;
*  2. l'exception de l'historique n'a plus de rembourrage ;
*  3. la liste des classes qui n'existent QUE dans un @media est FIGÉE :
*     une nouvelle entrée doit être décidée ici, pas glissée (chacune des
*     31 actuelles est un état ou un chrome propre au téléphone — voir
*     le rapport du lot).
*/
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(path.join(RACINE, f), "utf8").replace(/\r\n/g, "\n");

const FEUILLES = [
...readdirSync(path.join(RACINE, "css")).filter((f) => f.endsWith(".css")).map((f) => `css/${f}`),
...readdirSync(RACINE).filter((f) => f.endsWith(".css"))
];

// Classes vues dans une règle de base (hors @media) et dans un @media,
// toutes feuilles confondues.
export function classesParContexte(feuilles = FEUILLES) {
const base = new Map(), media = new Map();
for (const f of feuilles) {
const s = lire(f).replace(/\/\*[\s\S]*?\*\//g, "");
const pile = [];
let sel = "";
for (const c of s) {
if (c === "{") {
const texte = sel.trim();
const estMedia = /^@(media|supports|container)/.test(texte);
pile.push(estMedia);
if (!estMedia && !/^@/.test(texte)) {
const cible = pile.some(Boolean) ? media : base;
for (const m of texte.matchAll(/\.([a-zA-Z_][\w-]*)/g)) cible.set(m[1], (cible.get(m[1]) || new Set()).add(f));
}
sel = "";
} else if (c === "}") { pile.pop(); sel = ""; }
else if (c === ";" && !sel.includes("{")) sel = "";
else sel += c;
}
}
return { base, media };
}

test("icone-btn 1 — .ai-icon-btn et .ai-mode-tab ont une règle de base, hors @media", () => {
const { base } = classesParContexte();
for (const classe of ["ai-icon-btn", "ai-mode-tab", "ai-chat-send-btn"]) {
assert.ok(base.has(classe), `.${classe} n'existe que dans un @media`);
}
});

test("icone-btn 2 — le bouton d'action de l'historique laisse la place à son icône", () => {
const css = lire("css/ai-suite.css").replace(/\/\*[\s\S]*?\*\//g, "");
const bloc = css.match(/\.ai-chat-history-item-actions \.ai-icon-btn\{([^}]*)\}/);
assert.ok(bloc, "règle de l'historique absente");
assert.match(bloc[1], /padding:\s*0\b/, "le rembourrage hérité mange l'icône dans 26px");
assert.match(bloc[1], /justify-content:\s*center/);
});

// Les classes présentes UNIQUEMENT dans un @media, relevées le 2026-09-11.
// Toutes sont des états ou des pièces du chrome téléphone (menu mobile,
// barre d'onglets, volet d'historique ouvert, carrousels de vivant.css) :
// aucune n'a de sens hors de sa requête. Une nouvelle venue doit être
// ajoutée ici EN LE DÉCIDANT — c'est ce qui aurait attrapé un bouton
// stylé seulement sur téléphone.
export const SEULEMENT_MEDIA = [
"ai-chat-history-open", "ai-context-list", "btn-text-full", "catalog-carousel", "fitz-badge-role",
"header-menu-btn", "header-menu-panel", "journey-top-icon--secondary", "kb-open", "mnav-has-tabbar",
"mnav-item-lock", "mnav-menu-avatar", "mnav-menu-backdrop", "mnav-menu-close", "mnav-menu-grid",
"mnav-menu-grip", "mnav-menu-head", "mnav-menu-item", "mnav-menu-item--wide", "mnav-menu-logout",
"mnav-menu-name", "mnav-menu-open", "mnav-menu-plan", "mnav-menu-site", "mnav-menu-who", "mnav-tab",
"mnav-tab-dot", "mnav-tab-lock", "opportunites-piste", "sidebar-open", "voir-plus"
];

test("icone-btn 3 — aucune classe nouvelle n'existe uniquement dans un @media", () => {
const { base, media } = classesParContexte();
const seules = [...media.keys()].filter((k) => !base.has(k)).sort();
assert.deepEqual(seules, [...SEULEMENT_MEDIA].sort());
});
