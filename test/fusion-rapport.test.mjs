/**
* ============================================================
* Tests — la mesure et le jugement dans un seul rapport
* ============================================================
*
* Lancer : npm test
*
* Le lot MESURE-ET-JUGEMENT (2026-09-18) répare une perte qui n'avait
* été décidée par personne : en branchant un vrai modèle, la
* vérification de dossier a gagné la LECTURE du contenu et perdu les
* seuls FAITS de son rapport — poids de chaque fichier contre le
* plafond publié par le portail, pièces officielles, traductions —
* parce que js/ai/controle-depot.js et controle-bourse.js ne tournaient
* plus que dans le simulateur.
*
* Ces tests pinnent la RÈGLE du partage, pas une capture d'écran :
*
*   l'anneau et la liste de pièces viennent de la MESURE ;
*   les catégories viennent du JUGEMENT du contenu lu ;
*   les points faibles disent la mesure d'abord, le style ensuite ;
*   une mesure n'est jamais présentée comme un point fort (lot B1) ;
*   la phrase « le contenu n'est pas jugé ici » disparaît dès qu'il
*   l'est — et reste quand il ne l'est pas.
* ============================================================
*/

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { fusionnerRapport } from "../js/ai/fusion-rapport.js";
import { controleDepot, NON_JUGE_DEPOT } from "../js/ai/controle-depot.js";
import { NON_JUGE_BOURSE } from "../js/ai/controle-bourse.js";

// Un contrôle pur, tel que controleDepot le rend : deux pièces, un
// fichier au-dessus du plafond.
const PIECES = [
{ slug: "releve", nom: "Relevés de notes", tailleMax: "500 Ko", obtenue: true },
{ slug: "photo", nom: "Photo d'identité", tailleMax: "50 Ko", obtenue: false }
];

function mesureReelle() {
return controleDepot({
fichiers: [
{ name: "releve.pdf", octets: 300 * 1024 },
{ name: "photo.jpg", octets: 900 * 1024 }
],
pieces: PIECES,
traduction: null
});
}

const JUGEMENT = {
overallScore: 71,
categories: { clarte: 70, grammaire: 55 },
categoryLabels: { clarte: "Clarté", grammaire: "Grammaire et orthographe" },
strengths: ["Le projet professionnel est nommé précisément."],
weaknesses: ["Deux fautes d'accord dans la lettre de motivation."],
suggestions: ["Faites relire la lettre à voix haute avant de la déposer."],
checklist: [{ label: "Pièce inventée par le modèle", present: true }]
};

test("fusion 1 — l'anneau porte la MESURE, jamais la note du modèle", () => {

const mesure = mesureReelle();
const r = fusionnerRapport({ controle: mesure, ia: JUGEMENT });

assert.equal(r.overallScore, mesure.overallScore, "l'anneau doit afficher le score mesuré");
assert.notEqual(r.overallScore, JUGEMENT.overallScore, "la note du modèle ne doit pas atteindre l'anneau");

// Et un dossier sans rien de mesurable garde « — » : `null` ne
// devient jamais 0, règle du lot R11 reprise par le lot B1.
const sansNote = fusionnerRapport({ controle: { overallScore: null, categories: {}, checklist: [] }, ia: JUGEMENT });
assert.equal(sansNote.overallScore, null);

});

test("fusion 2 — la liste des pièces vient de la procédure, pas du modèle", () => {

const r = fusionnerRapport({ controle: mesureReelle(), ia: JUGEMENT });

assert.deepEqual(r.checklist.map((c) => c.label), ["Relevés de notes", "Photo d'identité"]);
assert.ok(
!r.checklist.some((c) => c.label === "Pièce inventée par le modèle"),
"un modèle n'a pas à inventer les pièces qu'un portail demande"
);

});

test("fusion 3 — les catégories viennent du contenu lu, avec la mesure en repli", () => {

const r = fusionnerRapport({ controle: mesureReelle(), ia: JUGEMENT });
assert.deepEqual(r.categories, JUGEMENT.categories);
assert.deepEqual(r.categoryLabels, JUGEMENT.categoryLabels);

// Aucun contenu lisible : la section afficherait un vide muet. On
// retombe sur les catégories mesurées, qui sont des faits.
const mesure = mesureReelle();
const sansJugement = fusionnerRapport({ controle: mesure, ia: { categories: {}, strengths: [], weaknesses: [], suggestions: [] } });
assert.deepEqual(sansJugement.categories, mesure.categories);
assert.ok(Object.keys(sansJugement.categories).length > 0, "le contrôle mesure au moins le poids");

});

test("fusion 4 — la mesure parle avant le style, et n'est jamais un compliment", () => {

const mesure = mesureReelle();
const r = fusionnerRapport({ controle: mesure, ia: JUGEMENT });

// Un fichier au-dessus du plafond est refusé mécaniquement au
// guichet : il passe avant une faute d'accord.
assert.deepEqual(r.weaknesses, [...mesure.weaknesses, ...JUGEMENT.weaknesses]);
assert.ok(mesure.weaknesses.length > 0, "le fichier de 900 Ko doit être signalé par la mesure");
assert.equal(r.weaknesses[0], mesure.weaknesses[0]);

// « lettre.pdf — 39 Ko, lue » sous le titre « Points forts » est
// l'un des défauts que le lot B1 a nommés : une mesure n'est pas un
// compliment.
assert.deepEqual(r.strengths, JUGEMENT.strengths);
for (const mesuree of mesure.strengths) {
assert.ok(!r.strengths.includes(mesuree), "une mesure ne doit pas remonter en point fort");
}

});

test("fusion 5 — « le contenu n'est pas jugé ici » disparaît quand il l'est, et reste sinon", () => {

const mesure = mesureReelle();

assert.ok(mesure.suggestions.includes(NON_JUGE_DEPOT), "le contrôle pur doit dire ce qu'il ne regarde pas");

const avecJugement = fusionnerRapport({ controle: mesure, ia: JUGEMENT });
assert.ok(
!avecJugement.suggestions.includes(NON_JUGE_DEPOT),
"la phrase ment dans l'autre sens dès que Fitz a lu les documents"
);
assert.ok(avecJugement.suggestions.includes(JUGEMENT.suggestions[0]));

const sansJugement = fusionnerRapport({ controle: mesure, ia: { categories: {}, strengths: [], weaknesses: [], suggestions: [] } });
assert.ok(
sansJugement.suggestions.includes(NON_JUGE_DEPOT),
"aucun contenu jugé : l'avertissement reste vrai, il doit rester affiché"
);

// La phrase jumelle du parcours bourses suit la même règle.
const bourse = {
overallScore: null,
categories: {},
categoryLabels: {},
checklist: [],
strengths: ["lettre.pdf — 39 Ko, lue"],
weaknesses: [],
suggestions: ["Comparez ces poids au plafond de votre bailleur.", NON_JUGE_BOURSE],
listLabels: { strengths: "Ce que Fitz a mesuré" },
controle: { nonJuge: NON_JUGE_BOURSE }
};
assert.ok(!fusionnerRapport({ controle: bourse, ia: JUGEMENT }).suggestions.includes(NON_JUGE_BOURSE));

});

test("fusion 6 — les titres du contrôle ne coiffent que ses propres items", () => {

// « Ce que Fitz a mesuré » au-dessus d'une liste devenue mixte
// serait une quatrième façon de mentir (lot B1). Dès que le jugement
// s'y mêle, la page reprend ses titres d'origine.
const bourse = {
overallScore: null, categories: {}, categoryLabels: {}, checklist: [],
strengths: ["cv.pdf — 12 Ko, lu"], weaknesses: [], suggestions: [],
listLabels: { strengths: "Ce que Fitz a mesuré", weaknesses: "Ce qui mérite un coup d'œil" },
controle: { nonJuge: NON_JUGE_BOURSE }
};

assert.equal(fusionnerRapport({ controle: bourse, ia: JUGEMENT }).listLabels, undefined);
assert.deepEqual(
fusionnerRapport({ controle: bourse, ia: { categories: {}, strengths: [], weaknesses: [], suggestions: [] } }).listLabels,
bourse.listLabels
);

});

test("fusion 7 — sans jugement du tout, le rapport mesuré passe tel quel", () => {

// Fitz en panne, quota atteint, réseau coupé : l'étudiant doit
// quand même obtenir les faits. C'est le comportement d'avant la
// bascule, et il reste juste.
const mesure = mesureReelle();
assert.deepEqual(fusionnerRapport({ controle: mesure, ia: null }), mesure);

// Et sans mesure, on n'en fabrique pas une.
assert.deepEqual(fusionnerRapport({ controle: null, ia: JUGEMENT }), JUGEMENT);
assert.equal(fusionnerRapport({}), null);

});

test("fusion 8 — le prompt reçoit les faits mesurés et l'ordre de ne pas les refaire", async () => {

const { buildPrompt } = await import("../js/ai/prompts.js");

const mesure = mesureReelle();
const p = buildPrompt("check", {
parcours: "preinscription",
files: [{ name: "photo.jpg", type: "image/jpeg", extraction: "format" }],
controle: mesure.controle,
profile: {}
});

assert.match(p.user, /Plafond de poids publié par le portail : 500 Ko/, "le plafond du portail doit être dit au modèle");
assert.match(p.user, /photo\.jpg : .*AU-DESSUS DU PLAFOND/, "le fichier trop lourd doit être signalé comme un fait");
assert.match(p.user, /Pièces de la procédure réglées : 1 sur 2/, "l'état des pièces doit être dit");
assert.match(p.system, /sont des FAITS déjà calculés/, "le modèle doit savoir que ce sont des faits");
assert.match(p.system, /Ne les recalcule pas/, "le modèle ne doit pas refaire l'arithmétique");

// Sans mesure, pas de section inventée : le prompt reste celui d'avant.
const sans = buildPrompt("check", { files: [], profile: {} });
assert.ok(!/FAITS déjà calculés/.test(sans.system));
assert.ok(!/Plafond de poids publié/.test(sans.user));

});

test("fusion 9 — les pays du diagnostic ne partent pas dans un prompt de préinscription", async () => {

// MESURÉ EN LIGNE LE 2026-09-18 : sur un vœu déposé à l'Université de
// Lille, Fitz écrivait « vos pays visés sont la Chine, la Malaisie et
// la Roumanie : la commission y verra une lettre type ». Deux
// suggestions sur huit portaient sur ces trois pays. Le modèle
// n'inventait rien — `preferredCountries`, une préférence du parcours
// bourses, partait dans TOUS les prompts.
const { buildPrompt } = await import("../js/ai/prompts.js");

const profil = { firstName: "Brigitte", country: "Sénégal", preferredCountries: ["Chine", "Malaisie", "Roumanie"] };
const base = { university: "Université de Lille", program: "Licence Psychologie", files: [], checklist: [], text: "x", sourceLanguage: "fr", targetLanguage: "en", style: "academique", emailType: "contact_university", context: "", message: "bonjour", history: [], profile: profil };

for (const tache of ["check", "readiness", "letter", "email", "chat", "translate"]) {
const pre = buildPrompt(tache, { ...base, parcours: "preinscription" });
assert.ok(!/Chine|Malaisie|Roumanie/.test(pre.user + pre.system), `${tache} : les pays du diagnostic partent encore en préinscription`);
assert.ok(!/Pays visés/.test(pre.user), `${tache} : la ligne « Pays visés » n'a rien à faire ici`);
}

// NON-RÉGRESSION : le parcours bourses les garde, c'est là qu'ils ont
// été saisis et qu'ils veulent dire quelque chose.
const bourse = buildPrompt("letter", { ...base, style: "academique" });
assert.match(bourse.user, /Pays visés : Chine, Malaisie, Roumanie/);

});

test("fusion 10 — la vérification de dossier dit POUR QUOI le dossier est préparé", async () => {

// C'était la seule tâche sans cible nommée : le modèle cherchait la
// destination ailleurs. La page envoie `application` depuis le
// 2026-09-02 — le prompt s'en sert enfin.
const { buildPrompt } = await import("../js/ai/prompts.js");

const p = buildPrompt("check", {
parcours: "preinscription",
application: { university: "Université de Lille", program: "Licence Psychologie" },
files: [],
profile: {}
});
assert.match(p.user, /Dossier préparé pour : Université de Lille — Licence Psychologie/);

// Sans candidature liée, aucune ligne fabriquée.
assert.ok(!/Dossier préparé pour/.test(buildPrompt("check", { files: [], profile: {} }).user));

});

test("fusion 11 — la page dit ce que l'anneau mesure, et n'annote pas les noms de fichiers", () => {

// Deux défauts vus à l'écran le 2026-09-18, sur le même rapport :
// un « 0 » nu au-dessus de catégories à 42 et 30 (il disait « un
// fichier est trop lourd », il se lisait « votre dossier ne vaut
// rien »), et « lettre-de-voeu (une formation que vous demandez).pdf »
// dans la liste des pièces — le glossaire annotant le nom d'un
// fichier que l'étudiant a lui-même nommé sur son disque.
const html = readFileSync(new URL("../ai-check.html", import.meta.url), "utf8");
const js = readFileSync(new URL("../ai-check.js", import.meta.url), "utf8");
const css = readFileSync(new URL("../css/ai-suite.css", import.meta.url), "utf8");

assert.match(html, /id="scoreLegende"/, "l'anneau doit porter une légende");
assert.match(html, /class="ai-score-bloc"/, "la légende doit vivre sous l'anneau, pas à côté des catégories");
assert.match(css, /\.ai-score-bloc\{/, "le bloc anneau + légende a besoin de sa colonne");
assert.match(js, /Conformité au dépôt/, "la légende doit nommer ce qui est mesuré");
assert.match(js, /scoreLegende\.hidden = !noteChiffree/, "sans chiffre, pas de légende à expliquer");

assert.match(html, /id="fileList" data-sans-glossaire/, "le glossaire ne doit pas annoter les noms de fichiers");

});
