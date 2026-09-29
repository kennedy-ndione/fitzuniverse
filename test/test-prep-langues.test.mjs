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
* avalée par le try/catch de la page, qui journalisait « Catalogue
* injoignable » à CHAQUE chargement : aucune suggestion par langue ne
* s'est affichée depuis l'entrée du fichier au dépôt (2026-09-01).
*
* LA JOINTURE. Une fois l'exception levée, la jointure par NOM
* d'université (premier programme gagnant) donnait à 441 programmes sur
* 828 la langue d'un AUTRE programme de la même université — et à 334,
* d'autres tests que les leurs. Chaque candidature prend désormais la
* langue de SON programme (programId), et le nom d'université ne sert
* plus qu'en repli.
*
* test-prep.js ne se charge pas sous Node (Firebase, DOM) : tout le calcul
* vit dans js/test-prep-data.js, et la page ne fait plus que lui passer le
* catalogue reçu. D'où :
*
*  1. la jointure par nom, sur des objets { id, universityId, language } ;
*  2. le vrai instantané, servi par le chargeur que la page importe
*     vraiment : des objets simples, des langues, des suggestions ;
*  3. le branchement dans test-prep.js : le catalogue passe tel quel,
*     sans .data(), et chaque candidature prend SA langue ;
*  4. la langue d'une candidature : son programme d'abord, sur des
*     exemples puis sur TOUS les programmes du vrai catalogue ;
*  5. la langue écrite dans une phrase, sigles gardés ;
*  6. une chaîne bilingue : la première langue citée décide, et la
*     règle d'honnêteté du turc (aucun test à suggérer) tient ; avec
*     « selon » (« Français / Anglais selon la formation », masters
*     Eiffel), chaque langue citée apporte son test (2026-09-29).
*
* Preuves par mutation (2026-09-29) : la règle « selon » retirée de
* testsPourLangue() → 6c rouge ; la carte revenue à « {université}
* enseigne en {langue} » → 3 rouge.
*
* Preuves par mutation (2026-09-28) : `const p = d.data();` remis dans
* languesParNomUniversite() → tests 1a, 1b et 2 rouges (« d.data is not
* a function ») ; test-prep.js rendu à son état d'avant → test 3 rouge ;
* import gardé mais une boucle en d.data() remise dans la page → test 3
* rouge aussi ; programId ignoré par langueDeLaCandidature() → 4a et 4b
* rouges ; la page revenue à la recherche par nom → 3 rouge ;
* toLowerCase() complet dans langueDansUnePhrase() → 5 rouge ; ancienne
* règle de testsPourLangue() (première clé du tableau) → 6a et 6b rouges.
* ============================================================
*/

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
languesParNomUniversite, languesDuCatalogue, langueDeLaCandidature, langueDansUnePhrase, testsPourLangue
} from "../js/test-prep-data.js";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// Normalisé à la lecture : avec core.autocrlf=true, les fichiers sont en
// CRLF sur le disque, et un \n de regex ne matche pas un \r\n.
const lire = (f) => fs.readFileSync(path.join(RACINE, f), "utf8").replace(/\r\n/g, "\n");

// ------------------------------------------------------------
// 1. La jointure par nom d'université
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

const langues = languesDuCatalogue(programmes, universites);
assert.ok(langues.parProgramme.size > 0 && langues.parNom.size > 0, "aucune langue d'enseignement tirée du catalogue : la page ne suggérerait rien");

const suggerees = [...langues.parProgramme.values()].filter((l) => testsPourLangue(l).length > 0);
assert.ok(suggerees.length > 0, "aucune langue du catalogue ne correspond à une fiche de test");
});

// ------------------------------------------------------------
// 3. Le branchement dans test-prep.js
// ------------------------------------------------------------

test("3. test-prep.js passe le catalogue tel quel, sans .data(), et chaque candidature prend SA langue", () => {
const src = lire("test-prep.js");
for (const fn of ["languesDuCatalogue", "langueDeLaCandidature", "langueDansUnePhrase"]) {
assert.match(src, new RegExp(`import\\s*\\{[^}]*\\b${fn}\\b[^}]*\\}\\s*from\\s*"\\./js/test-prep-data\\.js"`),
`test-prep.js n'importe pas ${fn} depuis js/test-prep-data.js`);
}

const debut = src.indexOf("async function chargerLangues()");
assert.ok(debut >= 0, "test-prep.js : chargerLangues() introuvable");
const fin = src.indexOf("\nfunction ", debut);
const corps = src.slice(debut, fin < 0 ? undefined : fin);

assert.match(corps, /languesDuCatalogue\(\s*programmes\s*,\s*universites\s*\)/,
"chargerLangues() doit passer { programmes, universites } du chargeur à languesDuCatalogue()");
assert.doesNotMatch(corps, /\.data\(\)/,
"chargerLangues() lit le catalogue comme un instantané Firestore (.data()) : js/catalog-data.js rend des objets simples");

// La langue d'une candidature vient de langueDeLaCandidature(), plus
// d'une recherche par nom écrite dans la page.
assert.match(src, /const langue = langueDeLaCandidature\(app, langues\);/,
"collecterSuggestions() doit prendre la langue de la candidature par langueDeLaCandidature()");
assert.match(src, /Langue d'enseignement : \$\{langueDansUnePhrase\(langue\)\}/,
"la carte doit écrire « Langue d'enseignement : {langue} », par langueDansUnePhrase(), qui garde les sigles");
// « Aix-Marseille Université enseigne en français / anglais selon la
// formation » : lourd, et faux pour une université qui enseigne dans
// plusieurs langues (demande de Charles, 2026-09-29).
assert.doesNotMatch(src, /enseigne en \$\{/, "la carte ne dit plus « {université} enseigne en {langue} »");
assert.doesNotMatch(src, /langue\.toLowerCase\(\)/,
"langue.toLowerCase() écrirait « niveau b2 » et « jlpt n2 »");
});

// ------------------------------------------------------------
// 4. La langue d'une candidature : son programme d'abord
// ------------------------------------------------------------

test("4a. une candidature prend la langue de SON programme ; le nom d'université n'est qu'un repli", () => {
const universites = [{ id: "u-berlin", name: "Freie Universität Berlin" }];
const programmes = [
{ id: "berlin-daad", universityId: "u-berlin", language: "Anglais / Allemand" },
{ id: "berlin-kas", universityId: "u-berlin", language: "Allemand, niveau B2 exigé quelle que soit la langue du cursus" },
{ id: "berlin-sans-langue", universityId: "u-berlin" }
];
const langues = languesDuCatalogue(programmes, universites);
const nom = "Freie Universität Berlin";

assert.equal(langueDeLaCandidature({ programId: "berlin-kas", university: nom }, langues),
"Allemand, niveau B2 exigé quelle que soit la langue du cursus", "liée : la langue de son programme, pas celle du premier");
assert.equal(langueDeLaCandidature({ university: nom }, langues), "Anglais / Allemand", "sans clé : repli par le nom");
assert.equal(langueDeLaCandidature({ programId: "retire-du-catalogue", university: nom }, langues), "Anglais / Allemand", "clé inconnue : repli par le nom");
assert.equal(langueDeLaCandidature({ programId: "berlin-sans-langue", university: ` ${nom} ` }, langues), "Anglais / Allemand", "programme sans langue : repli par le nom");
assert.equal(langueDeLaCandidature({ university: "Université de Nulle Part" }, langues), null, "hors catalogue : rien");
assert.equal(langueDeLaCandidature({}, languesDuCatalogue([], [])), null);
});

test("4b. sur le vrai catalogue, chaque programme donne à sa candidature SA propre langue", () => {
const brut = JSON.parse(lire("assets/data/catalogue.json"));
const langues = languesDuCatalogue(brut.programs, brut.universities);
const nomParId = new Map(brut.universities.map((u) => [u.id, u.name]));

const avecLangue = brut.programs.filter((p) => p.language && nomParId.has(p.universityId));
assert.ok(avecLangue.length > 0, "aucun programme avec une langue dans l'instantané");

// Par le nom seul, 441 des 828 programmes recevaient le 2026-09-28 la
// langue d'un autre programme de la même université (preuve par
// mutation : programId ignoré → ce test rouge, « 441 programme(s) »).
const ecarts = avecLangue.filter((p) => langueDeLaCandidature({ programId: p.id, university: nomParId.get(p.universityId) }, langues) !== p.language);
assert.deepEqual(ecarts.map((p) => p.id), [], `${ecarts.length} programme(s) sur ${avecLangue.length} reçoivent une autre langue que la leur`);
});

// ------------------------------------------------------------
// 5. La langue dans une phrase
// ------------------------------------------------------------

test("5. une langue s'écrit en minuscules dans la phrase, sigles gardés", () => {
assert.equal(langueDansUnePhrase("Anglais"), "anglais");
assert.equal(langueDansUnePhrase("Français / Anglais selon la formation"), "français / anglais selon la formation");
assert.equal(langueDansUnePhrase("Allemand, niveau B2 exigé quelle que soit la langue du cursus"),
"allemand, niveau B2 exigé quelle que soit la langue du cursus");
assert.equal(langueDansUnePhrase("Japonais (JLPT N2) / Anglais (B2) selon le cursus"),
"japonais (JLPT N2) / anglais (B2) selon le cursus");
assert.equal(langueDansUnePhrase(""), "");
assert.equal(langueDansUnePhrase(undefined), "");
});

// ------------------------------------------------------------
// 6. Une chaîne bilingue : la première langue citée décide
// ------------------------------------------------------------

const idsPour = (langue) => testsPourLangue(langue).map((t) => t.id);

test("6a. dans une chaîne bilingue, la première langue citée décide", () => {
assert.deepEqual(idsPour("Français / Anglais"), ["delf-dalf", "tcf"]);
assert.deepEqual(idsPour("Allemand / Anglais selon le cursus"), ["testdaf", "ielts"]);
assert.deepEqual(idsPour("Japonais (JLPT N2) / Anglais (B2) selon le cursus"), ["jlpt", "toefl"]);
assert.deepEqual(idsPour("Coréen / Anglais selon le département"), ["topik", "toefl"]);
assert.deepEqual(idsPour("Anglais / Allemand"), ["ielts", "toefl", "duolingo"]);
assert.deepEqual(idsPour("Anglais (cours d'allemand de 4 mois inclus)"), ["ielts", "toefl", "duolingo"]);
// Une langue sans fiche citée d'abord : la suivante connue décide.
assert.deepEqual(idsPour("Italien / Anglais"), ["ielts", "toefl", "duolingo"]);
assert.deepEqual(idsPour("Roumain uniquement, après une année préparatoire de roumain si vous ne le parlez pas"), []);
assert.deepEqual(idsPour(""), []);
});

test("6b. règle d'honnêteté : aucune langue du catalogue qui commence par le turc ne suggère de test", () => {
// TESTS_PAR_LANGUE.turc est vide exprès : les bourses turques incluent
// une année de langue. Relevé le 2026-09-28 : les 65 programmes de la
// famille Türkiye Bursları recevaient IELTS, TOEFL et Duolingo.
const brut = JSON.parse(lire("assets/data/catalogue.json"));
const turques = [...new Set(brut.programs.map((p) => p.language).filter((l) => /^turc\b/i.test(l || "")))];
assert.ok(turques.length > 0, "aucune langue du catalogue ne commence par « Turc » : cette garde doit être relue");
for (const l of turques) assert.deepEqual(idsPour(l), [], `« ${l} » suggère ${idsPour(l).join(", ")}`);
});

test("6c. « selon » : la langue dépend de la formation, chaque langue citée apporte son test", () => {
// Masters Eiffel (2026-09-29) : « Français / Anglais selon la
// formation ». La première langue seule donnait DELF/TCF, et un master
// enseigné en anglais restait sans IELTS.
assert.deepEqual(idsPour("Français / Anglais selon la formation"), ["delf-dalf", "tcf", "ielts"]);
assert.deepEqual(idsPour("Français / Anglais selon le programme"), ["delf-dalf", "tcf", "ielts"]);
assert.deepEqual(idsPour("Anglais / Français selon le programme"), ["ielts", "toefl", "duolingo", "delf-dalf"]);
assert.deepEqual(idsPour("Anglais / Allemand selon le cursus"), ["ielts", "toefl", "duolingo", "testdaf"]);
// Une langue déjà couverte par un test de la liste n'en ajoute pas un
// second : l'anglais a déjà IELTS ou TOEFL derrière l'allemand, le
// japonais et le coréen.
assert.deepEqual(idsPour("Allemand / Anglais selon le cursus"), ["testdaf", "ielts"]);
assert.deepEqual(idsPour("Japonais (JLPT N2) / Anglais (B2) selon le cursus"), ["jlpt", "toefl"]);
assert.deepEqual(idsPour("Coréen / Anglais selon le département"), ["topik", "toefl"]);
// Une langue sans fiche n'ajoute rien.
assert.deepEqual(idsPour("Français / Arabe selon la filière"), ["delf-dalf", "tcf"]);
// Règle d'honnêteté : une chaîne qui commence par le turc ne suggère
// toujours rien, « selon » ou pas (année de langue incluse).
assert.deepEqual(idsPour("Turc ou anglais selon le programme, après une année préparatoire de turc"), []);
assert.deepEqual(idsPour("Turc / Anglais selon le programme (cours de turc inclus)"), []);

// Sur le vrai catalogue : chaque master Eiffel « selon la formation »
// propose DELF/TCF ET IELTS.
const brut = JSON.parse(lire("assets/data/catalogue.json"));
const eiffel = brut.programs.filter((p) => /eiffel/.test(p.scholarshipId || "") && /^Français \/ Anglais selon\b/.test(p.language || ""));
assert.ok(eiffel.length >= 40, `${eiffel.length} programmes Eiffel « Français / Anglais selon… » : le catalogue a changé, cette garde doit être relue`);
for (const p of eiffel) assert.deepEqual(idsPour(p.language), ["delf-dalf", "tcf", "ielts"], `${p.id} : ${idsPour(p.language).join(", ")}`);
});
