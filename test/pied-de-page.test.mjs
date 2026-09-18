/**
* Lot PIED-DE-PAGE (2026-09-10) — corriger ce que le lot LANGAGE a introduit.
*
* Règle : une page qui a UNE SEULE tâche n'offre pas six façons de partir.
* Deux listes explicites, AVEC et SANS pied de page ; une page qui change
* de camp sans qu'on le décide fait échouer le test.
*
*  1. les quatre pages nettoyées ne chargent ni pied-de-page.css ni
*     pied-de-page.js (preuve par mutation le 2026-09-10 : pied-de-page.js
*     remis sur results.html → rouge) ;
*  2. les pages de la liste « avec » le chargent toutes ;
*  3. le bandeau #entree du questionnaire est toujours là — on n'a pas
*     défait le reste du lot LANGAGE en retirant le pied de page ;
*  4. la classe « en rangée » posée sur <body> par le lot LANGAGE (pour
*     les pages tunnel) n'apparaît plus nulle part — plus d'utilisateur ;
*  5. un seul rendu : plus aucune règle .footer hors css/pied-de-page.css,
*     photo à hauteur fixe, fond opaque, pas de photo sous 640px.
*/
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(path.join(RACINE, f), "utf8").replace(/\r\n/g, "\n");
const visible = (html) => html.replace(/<!--[\s\S]*?-->/g, "");

// Lot FINITIONS-VISUELLES (2026-09-11), décision de Charles : le pied de
// page ne reste que sur l'accueil. Toutes les autres pages publiques le
// perdent et gardent le glossaire (js/glossaire-seul.js).
export const PAGES_AVEC_PIED = ["index.html"];
export const PAGES_SANS_PIED = [
"scholarships.html", "universities.html", "scholarship-details.html",
"preinscriptions.html", "preinscription-france.html", "offers.html", "bientot.html",
"eligibility-questions.html", "eligibility-test.html", "results.html", "login.html"
];

const codeSeul = (f) => lire(f)
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/^\s*\/\/.*$/gm, "")
  .replace(/<!--[\s\S]*?-->/g, "");

const chargePied = (html) => /pied-de-page\.(js|css)/.test(visible(html));

test("pied-de-page 1 — toute page publique hors accueil : ni le script ni la feuille, mais le glossaire", () => {
for (const page of PAGES_SANS_PIED) {
assert.ok(!chargePied(lire(page)), `${page} : charge le pied de page`);
// Le glossaire y reste, sans le pied de page.
assert.ok(/js\/glossaire-seul\.js/.test(lire(page)), `${page} : sans glossaire`);
}
});

test("pied-de-page 2 — index.html seule le charge, et aucune autre page publique", () => {
for (const page of PAGES_AVEC_PIED) {
assert.ok(/<script src="js\/pied-de-page\.js" defer><\/script>/.test(lire(page)), `${page} : sans js/pied-de-page.js`);
}
// Aucune page hors des deux listes ne le charge — une page qui change
// de camp doit être décidée ici, pas glissée.
const toutes = readdirSync(RACINE).filter((f) => f.endsWith(".html"));
for (const page of toutes) {
if (PAGES_AVEC_PIED.includes(page)) continue;
assert.ok(!chargePied(lire(page)), `${page} : charge le pied de page sans être dans la liste « avec »`);
}
// L'espace étudiant ne l'IMPORTE pas.
//
// Lu SANS LES COMMENTAIRES depuis le lot R21 (2026-09-18) : le shell de
// l'espace lance désormais le glossaire et explique, en commentaire,
// qu'il ne le tient PAS de js/pied-de-page.js. La règle porte sur le
// code — un import, un chemin de script — pas sur la prose qui
// l'entoure. Chercher la chaîne dans le fichier entier rendait le test
// rouge pour un commentaire juste.
for (const module of ["js/app-shell.js", "js/dual-shell.js"]) {
assert.ok(!/pied-de-page/.test(codeSeul(module)), `${module} importe le pied de page`);
}
});

test("pied-de-page 3 — le bandeau d'entrée du questionnaire est toujours là", () => {
const html = visible(lire("eligibility-questions.html"));
assert.ok(/<section class="entree" id="entree"/.test(html));
assert.equal((html.match(/<h1\b/g) || []).length, 1);
});

test("pied-de-page 4 — la classe « en rangée » du body n'existe plus nulle part", () => {
// Le nom est assemblé pour que ce fichier ne se dénonce pas lui-même.
const classeMorte = ["pied-de-page", "en", "rangee"].join("-");
const fichiers = [];
const parcourir = (d) => {
for (const e of readdirSync(path.join(RACINE, d), { withFileTypes: true })) {
if (e.isDirectory()) { if (!/^(node_modules|\.git|sauvegardes|Claude outputs|\.claude)$/.test(e.name)) parcourir(path.join(d, e.name)); }
else if (/\.(html|css|js|mjs)$/.test(e.name)) fichiers.push(path.join(d, e.name));
}
};
parcourir(".");
for (const f of fichiers) assert.ok(!lire(f).includes(classeMorte), `${f} : classe morte`);
});

test("pied-de-page 5 — un seul rendu : celui de l'accueil, dans une seule feuille", () => {
const css = lire("css/pied-de-page.css");
// Fond opaque propre, photo en couche absolue à hauteur fixe.
assert.ok(/^\.footer\{[^}]*--pied-photo:\s*\d+px/m.test(css), "hauteur de photo fixe");
assert.ok(/^\.footer-photo\{[^}]*position:absolute[^}]*height:var\(--pied-photo\)/m.test(css), "photo = couche absolue à hauteur fixe");
assert.ok(/^\.footer\{[^}]*linear-gradient\(160deg, #2A211A/m.test(css), "fond encre chaude opaque");
assert.ok(/^\.footer\{[^}]*overflow:hidden/m.test(css), "rien ne traverse");
// Sous 640px : pas de photo, deux colonnes, espacements courts.
const mobile = css.slice(css.indexOf("@media(max-width:640px)"));
assert.ok(/\.footer-photo\{ display:none; \}/.test(mobile), "photo retirée sur téléphone");
assert.ok(/grid-template-columns:repeat\(2, minmax\(0, 1fr\)\)/.test(mobile), "deux colonnes");
assert.ok(!/gap:\s*(2[1-9]|[3-9]\d)px/.test(mobile.match(/\.footer-top\{[^}]*\}/)[0]), "gap ≤ 20px");
assert.ok(/\.footer-brand p\{ display:none; \}/.test(mobile), "phrase de marque masquée");
// Plus aucune règle de MISE EN PAGE du pied de page ailleurs que dans
// cette feuille (css/base.css garde ses deux tokens de logo pour
// `.footer`, qui ne dessinent rien).
for (const f of readdirSync(path.join(RACINE, "css")).filter((x) => x.endsWith(".css") && x !== "pied-de-page.css")) {
const autre = lire(`css/${f}`).replace(/\/\*[\s\S]*?\*\//g, "");
assert.ok(!/^\.footer\{/m.test(autre) && !/^\.footer(-photo|-top|-brand|-links|-bottom)\b[^{]*\{/m.test(autre) && !/\.footer-photo-feature/.test(autre), `css/${f} : règle .footer hors composant`);
}
// La colonne Légal est entière : quatre liens, jamais repliés.
//
// L'ASSERTION PORTE SUR LA RÈGLE, PLUS SUR LE PROVISOIRE (2026-09-18).
// Elle exigeait quatre « bientot.html?page= » : l'adresse d'attente du
// temps où ces quatre pages n'existaient pas. Elles existent depuis —
// mentions-legales.html, cgv.html, confidentialite.html, contact.html —
// et l'assertion obligeait donc à REVENIR au provisoire pour rester
// verte. Un test doit pinner la règle, jamais l'échafaudage.
const composant = lire("js/pied-de-page.js");
const apresLegal = composant.slice(composant.indexOf('titre: "Légal"'));
assert.ok(apresLegal, "la colonne Légal a disparu du pied de page");
const colonneLegal = apresLegal.slice(0, apresLegal.indexOf("] }"));
const liens = colonneLegal.match(/\["[^"]+",\s*"[^"]+"\]/g) || [];
assert.equal(liens.length, 4, `la colonne Légal a ${liens.length} liens au lieu de quatre`);
assert.ok(!/bientot\.html/.test(colonneLegal),
"la colonne Légal est revenue à l'adresse d'attente, alors que ses quatre pages existent");
});
