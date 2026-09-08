/**
 * ============================================================
 * Garde — le mot « partenaire » est banni de la copie du site
 * (2026-08-31, REDACTION.md §1 et §8)
 *
 * Aucune université du catalogue n'a de relation avec FitzUniverse :
 * « universités partenaires » promettait une caution institutionnelle
 * qui n'existe pas. La passe du 2026-08-31 l'a retiré de tout le texte
 * visible (<title>, <meta>, og:/twitter:, H1, pastilles, libellés de
 * statistiques, chaînes JS de repli) — cette garde échoue si le mot
 * revient.
 *
 * Périmètre : tous les .html et .js du dépôt, HORS admin/ (outillage
 * interne, jamais vu par un étudiant). Les commentaires HTML et JS
 * sont retirés avant la recherche : y raconter l'histoire du mot reste
 * permis, c'est la copie visible qui est bannie. Les .mjs (scripts,
 * tests) ne sont pas balayés : descriptions de bourses où « pays
 * partenaires » désigne les partenaires du bailleur, pas les nôtres.
 *
 * Dans l'esprit de test/logo-lockup.test.mjs. Lancer : npm test
 * ============================================================
 */

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");

// « Claude outputs » ajouté le 2026-09-08 : ce répertoire porte des
// notes de travail et des BROUILLONS de fichiers de données (les couches
// de pays en préparation), pas du code servi. Il n'est d'ailleurs plus
// déployé du tout depuis le lot S3 (firebase.json, hosting.ignore). Le
// balayer revenait à faire échouer la copie du site sur un brouillon que
// personne ne lit — et le test « le balayage couvre bien les pages du
// site », plus bas, garde le filet contre une exclusion trop large.
const EXCLUS = new Set(["node_modules", ".git", ".claude", "admin", "Claude outputs", "sauvegardes"]);

// Les couches de résidence (js/procedures/residences/) CITENT des
// sources officielles mot pour mot — c'est la règle du dossier : chaque
// fragment porte sa source et sa date, et on ne réécrit pas ce qu'un
// organisme publie. Campus France Guinée avertit lui-même qu'il « ne
// travaille avec aucun partenaire extérieur » : la phrase vise des
// rabatteurs qui encaissent 1 500 000 GNF en son nom. La retoucher pour
// satisfaire une règle de copie falsifierait un avertissement de
// sécurité.
//
// C'est exactement la carve-out déjà écrite en tête de ce fichier pour
// les .mjs (« pays partenaires » d'un bailleur n'est pas notre
// promesse) : le mot dans la bouche d'un tiers n'est pas notre claim.
// Ce qui reste banni, et qui est tout l'objet de cette garde, c'est
// « universités partenaires » dans NOTRE copie.
const DOSSIERS_CITANT_DES_SOURCES = join(racine, "js", "procedures", "residences");

function fichiers(extension, dir = racine, acc = []) {
if (dir === DOSSIERS_CITANT_DES_SOURCES) return acc;
for (const e of readdirSync(dir)) {
if (EXCLUS.has(e)) continue;
const p = join(dir, e);
if (statSync(p).isDirectory()) fichiers(extension, p, acc);
else if (e.endsWith(extension)) acc.push(p);
}
return acc;
}

const nom = (p) => relative(racine, p).replace(/\\/g, "/");

// Retire les commentaires HTML. Les blocs <script> inline restent :
// leur contenu est du code, traité comme le JS ci-dessous.
function sansCommentairesHtml(source) {
return source.replace(/<!--[\s\S]*?-->/g, "");
}

// Retire les commentaires JS : blocs /* … */ puis lignes //.
// Le « // » d'une URL (https://…) est protégé : on n'ampute une ligne
// qu'à partir d'un « // » précédé de rien ou d'un blanc — un protocole
// est toujours collé à son « : ». Approximation assumée : un « // »
// au milieu d'une chaîne précédé d'un espace serait retiré à tort,
// ce qui ne peut que MASQUER du texte, jamais inventer un faux échec.
function sansCommentairesJs(source) {
return source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|\s)\/\/.*$/gm, "$1");
}

test("aucun .html du site (hors admin/) ne contient « partenaire » hors commentaire", () => {
for (const p of fichiers(".html")) {
const visible = sansCommentairesJs(sansCommentairesHtml(readFileSync(p, "utf8")));
const i = visible.toLowerCase().indexOf("partenaire");
assert.equal(i, -1, `${nom(p)} contient encore « partenaire » dans du texte visible : « …${visible.slice(Math.max(0, i - 60), i + 30).trim()}… »`);
}
});

test("aucun .js du site (hors admin/) ne contient « partenaire » hors commentaire", () => {
for (const p of fichiers(".js")) {
const visible = sansCommentairesJs(readFileSync(p, "utf8"));
const i = visible.toLowerCase().indexOf("partenaire");
assert.equal(i, -1, `${nom(p)} contient encore « partenaire » (chaîne ou identifiant) : « …${visible.slice(Math.max(0, i - 60), i + 30).trim()}… »`);
}
});

// Le balayage doit rester branché sur le vrai dépôt : s'il ne voyait
// plus les pages du site, les deux tests passeraient à vide.
test("le balayage couvre bien les pages du site", () => {
const pages = fichiers(".html").map(nom);
for (const attendu of ["index.html", "scholarships.html", "universities.html"]) {
assert.ok(pages.includes(attendu), `${attendu} absent du balayage`);
}
assert.ok(!pages.some((p) => p.startsWith("admin/")), "admin/ doit rester hors périmètre");
});
