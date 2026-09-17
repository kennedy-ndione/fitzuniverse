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
"eligibility-questions.html", "eligibility-test.html", "results.html", "login.html",
// Lot LÉGAL (2026-09-17) : les quatre pages légales suivent la même règle.
"mentions-legales.html", "cgv.html", "confidentialite.html", "contact.html"
];

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
// L'espace étudiant ne l'importe pas.
assert.ok(!/pied-de-page/.test(lire("js/app-shell.js")));
assert.ok(!/pied-de-page/.test(lire("js/dual-shell.js")));
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
const composant = lire("js/pied-de-page.js");
// Lot LÉGAL (2026-09-17) : les quatre liens visent les vraies pages.
const legaux = ["mentions-legales.html", "cgv.html", "confidentialite.html", "contact.html"];
assert.equal(legaux.filter((p) => composant.includes(`["${p}", `)).length, 4);
assert.ok(!/bientot\.html/.test(composant));
});
