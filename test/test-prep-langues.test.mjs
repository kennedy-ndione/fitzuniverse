/**
* ============================================================
* test/test-prep-langues.test.mjs — les suggestions par langue
* d'enseignement de test-prep.html (2026-09-28)
* ============================================================
*
* LE DÉFAUT. test-prep.js lisait chaque programme du catalogue avec
* d.data(), comme un instantané Firestore. Or js/catalog-data.js rend
* des objets simples { id, …champs } — depuis l'instantané comme depuis
* Firestore (lireFirestore fait déjà le .data()). L'exception était
* avalée par le try/catch de languesParUniversite(), qui journalisait
* « Catalogue injoignable » à CHAQUE chargement de la page : aucune
* suggestion par langue ne s'est affichée depuis l'entrée du fichier au
* dépôt (2026-09-01).
*
* test-prep.js ne se charge pas sous Node (Firebase, DOM) : la jointure
* vit désormais dans js/test-prep-data.js, languesParNomUniversite(), et
* la page ne fait plus que lui passer le catalogue reçu. D'où :
*
*  1. la jointure, sur des objets { id, universityId, language } ;
*  2. le vrai instantané, servi par le chargeur que la page importe
*     vraiment : des objets simples, des langues, des suggestions ;
*  3. le branchement dans test-prep.js : le catalogue passe tel quel,
*     sans .data().
*
* Preuves par mutation (2026-09-28) : `const p = d.data();` remis dans
* languesParNomUniversite() → tests 1a, 1b et 2 rouges (« d.data is not
* a function ») ; test-prep.js rendu à son état d'avant → test 3 rouge ;
* import gardé mais une boucle en d.data() remise dans
* languesParUniversite() → test 3 rouge aussi.
* ============================================================
*/

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { languesParNomUniversite, testsPourLangue } from "../js/test-prep-data.js";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// Normalisé à la lecture : avec core.autocrlf=true, les fichiers sont en
// CRLF sur le disque, et un \n de regex ne matche pas un \r\n.
const lire = (f) => fs.readFileSync(path.join(RACINE, f), "utf8").replace(/\r\n/g, "\n");

// ------------------------------------------------------------
// 1. La jointure
// ------------------------------------------------------------

test("1a. une langue par université, depuis des objets simples { id, universityId, language }", () => {
const universites = [
{ id: "u-lyon", name: "Université Jean Moulin Lyon 3 " },
{ id: "u-berlin", name: "Freie Universität Berlin" }
];
const programmes = [
{ id: "p1", universityId: "u-lyon", language: "Français" },
{ id: "p2", universityId: "u-berlin", language: "Allemand" },
// Le premier programme décide pour son université.
{ id: "p3", universityId: "u-lyon", language: "Anglais" }
];

const langues = languesParNomUniversite(programmes, universites);

// Clé : le nom sans espaces de bord — celui que portent les candidatures.
assert.deepEqual([...langues], [
["Université Jean Moulin Lyon 3", "Français"],
["Freie Universität Berlin", "Allemand"]
]);
});

test("1b. un programme sans langue, sans université connue ou d'une université sans nom ne compte pas", () => {
const universites = [
{ id: "u-berlin", name: "Freie Universität Berlin" },
{ id: "u-sans-nom" }
];
const programmes = [
{ id: "p1", universityId: "u-berlin" },
{ id: "p2", universityId: "u-inconnue", language: "Anglais" },
{ id: "p3", universityId: "u-sans-nom", language: "Anglais" },
{ id: "p4", universityId: "u-berlin", language: "Allemand" }
];

assert.deepEqual([...languesParNomUniversite(programmes, universites)], [["Freie Universität Berlin", "Allemand"]]);
assert.equal(languesParNomUniversite([], []).size, 0);
});

// ------------------------------------------------------------
// 2. Le vrai instantané, par le chargeur de la page
// ------------------------------------------------------------

// Le chargeur que test-prep.js importe VRAIMENT, lu dans sa source : si
// un lot le change (PERF 3G le passe à sa version « Liste »), ce test
// suit sans qu'on le touche.
function chargeurDeLaPage() {
const m = lire("test-prep.js").match(/import\s*\{([^}]*)\}\s*from\s*"\.\/js\/catalog-data\.js"/);
assert.ok(m, "test-prep.js n'importe plus son chargeur depuis js/catalog-data.js");
const noms = m[1].split(",").map((s) => s.trim().split(/\s+as\s+/)[0]).filter(Boolean);
assert.equal(noms.length, 1, `test-prep.js importe ${noms.length} fonctions de js/catalog-data.js : ${noms.join(", ")}`);
return noms[0];
}

test("2. sur le vrai instantané, par le chargeur de la page : des objets simples, des langues et des suggestions", async (t) => {
const nom = chargeurDeLaPage();
const catalogue = await import("../js/catalog-data.js");
assert.equal(typeof catalogue[nom], "function", `js/catalog-data.js n'exporte pas ${nom}`);

// Le chargeur télécharge l'instantané avec fetch() ; sous Node, on le
// sert depuis le disque : le fichier même que Hosting publie.
const fetchAvant = globalThis.fetch;
t.after(() => { globalThis.fetch = fetchAvant; });
globalThis.fetch = async (url) => {
const fichier = fileURLToPath(url);
if (!fs.existsSync(fichier)) return { ok: false, json: async () => null };
return { ok: true, json: async () => JSON.parse(fs.readFileSync(fichier, "utf8")) };
};

const { programmes, universites } = await catalogue[nom]();

assert.ok(programmes.length > 0 && universites.length > 0, "le chargeur a rendu un catalogue vide");
// Le contrat que l'ancien code ignorait.
assert.ok(programmes.every((p) => typeof p.data !== "function"), "le chargeur rend des instantanés Firestore, pas des objets simples");

const langues = languesParNomUniversite(programmes, universites);
assert.ok(langues.size > 0, "aucune langue d'enseignement tirée du catalogue : la page ne suggérerait rien");

const suggerees = [...langues.values()].filter((l) => testsPourLangue(l).length > 0);
assert.ok(suggerees.length > 0, "aucune langue du catalogue ne correspond à une fiche de test");
});

// ------------------------------------------------------------
// 3. Le branchement dans test-prep.js
// ------------------------------------------------------------

test("3. test-prep.js passe le catalogue tel quel à languesParNomUniversite, sans .data()", () => {
const src = lire("test-prep.js");
assert.match(src, /import\s*\{[^}]*\blanguesParNomUniversite\b[^}]*\}\s*from\s*"\.\/js\/test-prep-data\.js"/,
"test-prep.js n'importe pas languesParNomUniversite depuis js/test-prep-data.js");

const debut = src.indexOf("async function languesParUniversite()");
assert.ok(debut >= 0, "test-prep.js : languesParUniversite() introuvable");
const fin = src.indexOf("\nfunction ", debut);
const corps = src.slice(debut, fin < 0 ? undefined : fin);

assert.match(corps, /languesParNomUniversite\(\s*programmes\s*,\s*universites\s*\)/,
"languesParUniversite() doit passer { programmes, universites } du chargeur à languesParNomUniversite()");
assert.doesNotMatch(corps, /\.data\(\)/,
"languesParUniversite() lit le catalogue comme un instantané Firestore (.data()) : js/catalog-data.js rend des objets simples");
});
