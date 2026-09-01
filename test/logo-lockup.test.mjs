/**
 * ============================================================
 * Tests — lockup FitzUniverse (2026-08-31)
 *
 * Le logo avait TROIS balisages (public .logo-text avec styles inline,
 * .journey-brand-text de l'espace étudiant, .sidebar-brand-text de
 * l'admin), TROIS typographies et TROIS couleurs de descripteur. Ces
 * gardes existent pour qu'il n'y en ait plus jamais qu'un.
 *
 * Les copies de travail (.claude/worktrees) sont exclues : ce sont des
 * checkouts parallèles, pas le dépôt.
 *
 * Lancer : npm test
 * ============================================================
 */

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");

function fichiers(extension, dir = racine, acc = []) {
for (const e of readdirSync(dir)) {
if (e === "node_modules" || e === ".git" || e === ".claude") continue;
const p = join(dir, e);
if (statSync(p).isDirectory()) fichiers(extension, p, acc);
else if (e.endsWith(extension)) acc.push(p);
}
return acc;
}

const PAGES = fichiers(".html");
const lire = (p) => readFileSync(p, "utf8");
const nom = (p) => relative(racine, p).replace(/\\/g, "/");

// ============================================================
// 1. Balisage canonique, à l'identique partout
// ============================================================

// Le SEUL attribut style= toléré porte la taille, et rien d'autre :
// c'est une donnée de mise en page propre à l'emplacement, pas un
// habillage de la marque.
const STYLE_AUTORISE = /^--lockup-size:\d+px$/;

test("tout lockup porte le balisage canonique — mêmes classes, mêmes attributs SVG", () => {
let vus = 0;
for (const p of PAGES) {
const html = lire(p);
if (!html.includes("fitz-lockup")) continue;

for (const bloc of html.match(/<a[^>]*class="fitz-lockup"[\s\S]*?<\/a>/g) || []) {
vus++;
const ou = nom(p);

assert.match(bloc, /aria-label="FitzUniverse — [^"]+"/, `${ou} : aria-label manquant ou hors format`);
assert.match(bloc, /<svg class="fitz-mark" viewBox="0 0 100 100" fill="none" aria-hidden="true" focusable="false"/, `${ou} : svg non canonique`);
assert.ok(!/<svg[^>]*\sstroke=/.test(bloc), `${ou} : le svg ne doit porter aucun attribut stroke=`);
assert.match(bloc, /<circle class="mark-structure" cx="50" cy="50" r="34" stroke-width="11" stroke-linecap="round" stroke-dasharray="130 83\.6" transform="rotate\(-90 50 50\)"\/>/, `${ou} : arc structure non canonique`);
assert.match(bloc, /<circle class="mark-accent" cx="50" cy="50" r="34" stroke-width="11" stroke-linecap="round" stroke-dasharray="42 171\.6" stroke-dashoffset="-150" transform="rotate\(-90 50 50\)"\/>/, `${ou} : arc accent non canonique`);
assert.match(bloc, /<span class="fitz-lockup-text">\s*<span class="fitz-lockup-name">Fitz<\/span>\s*<span class="fitz-lockup-sub">Universe<\/span>\s*<\/span>/, `${ou} : bloc texte non canonique`);

// « Universe » en minuscules dans le HTML : les capitales viennent
// du CSS, pour que les lecteurs d'écran ne l'épellent pas.
assert.ok(!bloc.includes(">UNIVERSE<"), `${ou} : « Universe » doit être en minuscules dans le HTML`);

for (const s of bloc.match(/style="([^"]*)"/g) || []) {
const valeur = s.slice(7, -1);
assert.match(valeur, STYLE_AUTORISE, `${ou} : style= interdit (« ${valeur} ») — seule la taille est tolérée`);
}
}
}
assert.ok(vus >= 30, `seulement ${vus} lockups trouvés — le balayage ne couvre plus le dépôt`);
});

// ============================================================
// 2. Les anciens balisages ont disparu
// ============================================================

test("aucune page ne porte plus les anciennes classes de lockup", () => {
const interdites = ['class="scholar"', 'class="bridge"', "journey-brand-name", "journey-brand-sub", "sidebar-brand-text", 'class="logo-text"'];
for (const p of PAGES) {
const html = lire(p);
for (const c of interdites) {
assert.ok(!html.includes(c), `${nom(p)} contient encore « ${c} »`);
}
}
});

// ============================================================
// 3. --logo-descriptor n'est déclaré QUE dans css/base.css
// ============================================================

test("--logo-descriptor est déclaré deux fois, et seulement dans css/base.css", () => {
for (const p of fichiers(".css")) {
const declarations = (lire(p).match(/--logo-descriptor\s*:/g) || []).length;
if (nom(p) === "css/base.css") {
assert.equal(declarations, 2, "css/base.css doit déclarer --logo-descriptor exactement deux fois (:root et .on-dark)");
} else {
assert.equal(declarations, 0, `${nom(p)} redéclare --logo-descriptor — la source doit rester unique`);
}
}
});

// ============================================================
// 4. Les polices du lockup sont EN LITTÉRAL
//
// 17 feuilles du dépôt redéfinissent --font-display en trois systèmes
// typographiques : un token ici ferait changer le nom de la marque
// selon la page — la cause d'origine du « pas le même rendu partout ».
// ============================================================

test("les règles du lockup n'utilisent aucun token de police ni d'ambre", () => {
const css = lire(join(racine, "css", "base.css"));
for (const selecteur of [".fitz-lockup-name", ".fitz-lockup-sub"]) {
const i = css.indexOf(selecteur + "{");
assert.notEqual(i, -1, `${selecteur} introuvable dans css/base.css`);
const regle = css.slice(i, css.indexOf("}", i));
for (const interdit of ["var(--font-display)", "var(--font-body)", "var(--font-affirmation)", "var(--amber-"]) {
assert.ok(!regle.includes(interdit), `${selecteur} utilise ${interdit} — les polices et l'ambre doivent être en littéral`);
}
}
assert.ok(css.includes('font-family:"Newsreader",Georgia,serif;'), "le nom doit être en Newsreader littéral");
assert.ok(css.includes('font-family:"Public Sans",system-ui,sans-serif;'), "le descripteur doit être en Public Sans littéral");
});

// ============================================================
// 5. Chaque page attendue porte le bon nombre de lockups
// ============================================================

// Deux pour les pages qui ont un en-tête public ET une barre connectée,
// deux pour index.html (en-tête + pied de page), un partout ailleurs.
const ATTENDU = {
"index.html": 2,
"scholarships.html": 2,
"universities.html": 2,
"scholarship-details.html": 2,
"account.html": 1, "advisor.html": 1, "ai-chat.html": 1, "ai-check.html": 1,
"ai-email.html": 1, "ai-letter.html": 1, "ai-translate.html": 1, "applications.html": 1,
"compress.html": 1, "dashboard.html": 1, "documents.html": 1, "interview-prep.html": 1,
"profile.html": 1, "test-prep.html": 1,
"admin/dashboard.html": 1, "admin/plans.html": 1, "admin/scholarships.html": 1,
"admin/student-detail.html": 1, "admin/students.html": 1, "admin/universities.html": 1,
"admin/university.html": 1,
"offers.html": 1, "payment.html": 1, "results.html": 1,
"eligibility-questions.html": 1, "eligibility-test.html": 1
};

test("chaque page listée porte exactement le nombre de lockups attendu", () => {
for (const [page, attendu] of Object.entries(ATTENDU)) {
const html = lire(join(racine, page));
const compte = (html.match(/class="fitz-lockup"/g) || []).length;
assert.equal(compte, attendu, `${page} : ${compte} lockup(s), ${attendu} attendu(s)`);
}
});

test("les cinq pages qui n'avaient aucun logo en ont un désormais", () => {
for (const page of ["offers.html", "payment.html", "results.html", "eligibility-questions.html", "eligibility-test.html"]) {
assert.ok(lire(join(racine, page)).includes("page-brandbar"), `${page} : barre de marque absente`);
}
});

// ============================================================
// 6. Le crochet .on-dark de la sidebar admin
//
// Le lockup admin doit rester DANS un conteneur .sidebar-brand : c'est
// lui qui bascule --logo-structure et --logo-descriptor sur fond
// sombre. Sans ce crochet, la marque devient encre sur encre.
// ============================================================

test("le lockup admin reste enveloppé dans .sidebar-brand", () => {
for (const page of ["admin/dashboard.html", "admin/plans.html", "admin/scholarships.html", "admin/student-detail.html", "admin/students.html", "admin/universities.html", "admin/university.html"]) {
const html = lire(join(racine, page));
assert.match(html, /<div class="sidebar-brand">[\s\S]*?class="fitz-lockup"/, `${page} : le lockup doit rester dans .sidebar-brand (crochet .on-dark)`);
}
});
