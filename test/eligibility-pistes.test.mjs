/**
 * ============================================================
 * Tests unitaires — le questionnaire par niveau d'études
 * ============================================================
 *
 * Lancer : npm test
 *
 * Ce que ces tests protègent, par ordre de gravité :
 *
 *  1. LES ANCIENS LIBELLÉS. Cinq libellés de niveau vivent encore dans
 *     le sessionStorage des visites en cours (« Bac en cours ou
 *     obtenu »…). S'ils cessaient d'être reconnus, l'étudiant à
 *     mi-parcours verrait son diagnostic se vider sans rien
 *     comprendre. C'est le seul bug vraiment grave que cette refonte
 *     pouvait introduire.
 *  2. LES QUESTIONS HORS PISTE. Demander sa filière de baccalauréat à
 *     un doctorant, ou son projet de recherche à un lycéen, détruit la
 *     crédibilité de tout le diagnostic.
 *  3. LES RÉPONSES ORPHELINES. Après un retour en arrière, une réponse
 *     à une question disparue ne doit pas rester dans le dossier
 *     transmis à Fitz — il la commenterait.
 * ============================================================
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
PISTES,
NIVEAUX_ACTUELS,
pisteDepuisNiveau,
cyclesVisesPour,
cycleViseEffectif,
questionsPour,
purgerHorsPiste,
resoudre,
familleDeDomaine,
definirSuggestionsDestination
} from "../js/eligibility-pistes.js";

import { ParcoursEligibilite } from "../js/eligibility-parcours.js";

const ids = (reponses) => questionsPour(reponses).map((q) => q.id);

// ------------------------------------------------------------
// 1. Reconnaissance du niveau — nouveaux ET anciens libellés
// ------------------------------------------------------------

test("les huit libellés du questionnaire donnent huit pistes distinctes", () => {

const pistes = NIVEAUX_ACTUELS.map((n) => pisteDepuisNiveau(n.label));

assert.deepEqual(pistes, [
PISTES.LYCEE,
PISTES.BAC_OBTENU,
PISTES.LICENCE_EN_COURS,
PISTES.LICENCE_OBTENUE,
PISTES.MASTER_EN_COURS,
PISTES.MASTER_OBTENU,
PISTES.DOCTORAT_EN_COURS,
PISTES.DOCTORAT_OBTENU
]);

// Huit libellés, huit pistes : aucune n'en absorbe une autre.
assert.equal(new Set(pistes).size, 8);

});

test("« en cours » et « obtenu » ne sont jamais confondus", () => {

const paires = [
["Au lycée", "Bac obtenu"],
["Licence en cours", "Licence obtenue"],
["Master en cours", "Master obtenu"],
["Doctorat en cours", "Doctorat obtenu"]
];

for (const [enCours, obtenu] of paires) {
assert.notEqual(
pisteDepuisNiveau(enCours),
pisteDepuisNiveau(obtenu),
`« ${enCours} » et « ${obtenu} » tombent sur la même piste`
);
}

});

test("les anciens libellés restent reconnus (sessions en cours)", () => {

// Les libellés AMBIGUS (« en cours ou obtenu ») tombent du côté
// prudent : celui qui pose encore les questions de fin de cursus.
assert.equal(pisteDepuisNiveau("Bac en cours ou obtenu"), PISTES.LYCEE);
assert.equal(pisteDepuisNiveau("Licence en cours"), PISTES.LICENCE_EN_COURS);
assert.equal(pisteDepuisNiveau("Licence obtenue"), PISTES.LICENCE_OBTENUE);
assert.equal(pisteDepuisNiveau("Master en cours ou obtenu"), PISTES.MASTER_EN_COURS);
assert.equal(pisteDepuisNiveau("Doctorat en cours ou obtenu"), PISTES.DOCTORAT_EN_COURS);

// Libellés de la première version du 2026-09-05, déployés le matin.
assert.equal(pisteDepuisNiveau("Au lycée ou tout juste bachelier"), PISTES.LYCEE);
assert.equal(pisteDepuisNiveau("Étudiant en licence"), PISTES.LICENCE_EN_COURS);
assert.equal(pisteDepuisNiveau("Étudiant en master"), PISTES.MASTER_EN_COURS);

});

test("un niveau vide ou inconnu ne renvoie aucune piste", () => {

assert.equal(pisteDepuisNiveau(""), "");
assert.equal(pisteDepuisNiveau(undefined), "");
assert.equal(pisteDepuisNiveau("Formation continue"), "");

});

// ------------------------------------------------------------
// 2. Cycles visés — l'interface rend l'erreur impossible
// ------------------------------------------------------------

test("un bachelier ne peut pas viser un doctorat", () => {

const cycles = cyclesVisesPour(PISTES.LYCEE);

assert.deepEqual(cycles, ["Licence (Bachelor)"]);
assert.ok(!cycles.includes("Doctorat (PhD)"));

});

test("un cycle unique est déduit sans poser la question", () => {

assert.equal(cycleViseEffectif({ currentLevel: "Au lycée" }), "Licence (Bachelor)");
assert.equal(cycleViseEffectif({ currentLevel: "Bac obtenu" }), "Licence (Bachelor)");
assert.equal(cycleViseEffectif({ currentLevel: "Doctorat en cours" }), "Doctorat (PhD)");

// Plusieurs cycles possibles et aucune réponse : rien n'est inventé.
assert.equal(cycleViseEffectif({ currentLevel: "Licence obtenue" }), "");

});

test("la question du cycle visé n'est posée que s'il y a un choix", () => {

assert.ok(!ids({ currentLevel: "Au lycée" }).includes("targetLevel"));
assert.ok(!ids({ currentLevel: "Bac obtenu" }).includes("targetLevel"));
assert.ok(!ids({ currentLevel: "Doctorat en cours" }).includes("targetLevel"));
assert.ok(ids({ currentLevel: "Licence obtenue" }).includes("targetLevel"));

});

// ------------------------------------------------------------
// 3. Chaque piste pose SES questions, et seulement les siennes
// ------------------------------------------------------------

test("le lycéen est interrogé sur sa filière et sa DATE D'EXAMEN, jamais sur une date d'obtention", () => {

const q = ids({ currentLevel: "Au lycée" });

assert.ok(q.includes("secondaryTrack"));
assert.ok(q.includes("secondaryExpected"));
assert.ok(!q.includes("diplomaWhen"), "on ne demande pas quand il a obtenu un diplôme qu'il n'a pas");
assert.ok(!q.includes("workExperience"));
assert.ok(!q.includes("researchProject"));

});

test("le bachelier est interrogé sur la DATE D'OBTENTION, jamais sur une date d'examen", () => {

const q = ids({ currentLevel: "Bac obtenu" });

assert.ok(q.includes("secondaryTrack"));
assert.ok(q.includes("diplomaWhen"));
assert.ok(!q.includes("secondaryExpected"), "son diplôme est obtenu : la date d'examen n'a plus de sens");
assert.ok(!q.includes("workExperience"));

});

test("un doctorant en cours n'est pas interrogé sur un projet de recherche qu'il a déjà", () => {

const enCours = ids({ currentLevel: "Doctorat en cours" });
const avantThese = ids({ currentLevel: "Master obtenu", targetLevel: "Doctorat (PhD)" });

assert.ok(enCours.includes("phdYear"));
assert.ok(!enCours.includes("researchProject"), "le sujet existe déjà");
assert.ok(enCours.includes("supervisorContact"), "il lui faut un laboratoire d'ACCUEIL");
assert.ok(avantThese.includes("researchProject"), "lui, ne l'a pas encore");

});

test("le titulaire d'un doctorat est interrogé sur sa soutenance et son expérience", () => {

const q = ids({ currentLevel: "Doctorat obtenu", targetLevel: "Doctorat (PhD)" });

assert.ok(q.includes("thesisWhen"));
assert.ok(q.includes("workExperience"));
assert.ok(!q.includes("phdYear"));
assert.ok(!q.includes("researchProject"));

});

test("le titulaire de licence qui vise un master est interrogé sur son expérience et ses candidatures", () => {

const q = ids({ currentLevel: "Licence obtenue", targetLevel: "Master" });

assert.ok(q.includes("diplomaWhen"));
assert.ok(q.includes("workExperience"));
assert.ok(q.includes("admissionStatus"));
assert.ok(!q.includes("secondaryTrack"));
assert.ok(!q.includes("researchProject"));

});

test("viser un doctorat ouvre le bloc recherche, quel que soit le niveau actuel", () => {

const depuisMaster = ids({ currentLevel: "Master obtenu", targetLevel: "Doctorat (PhD)" });
const depuisDoctorat = ids({ currentLevel: "Doctorat en cours" });

for (const q of [depuisMaster, depuisDoctorat]) {
assert.ok(q.includes("supervisorContact"));
assert.ok(q.includes("publications"));
}

assert.ok(depuisMaster.includes("researchProject"));

// Et jamais pour qui vise un master.
assert.ok(!ids({ currentLevel: "Master obtenu", targetLevel: "Master" }).includes("researchProject"));

});

test("la précision de filière n'apparaît que sur « Autre filière »", () => {

const base = { currentLevel: "Au lycée" };

assert.ok(!ids({ ...base, secondaryTrack: "Scientifique" }).includes("secondaryTrackOther"));
assert.ok(ids({ ...base, secondaryTrack: "Autre filière" }).includes("secondaryTrackOther"));

});

// ------------------------------------------------------------
// 4. Invariants de structure du parcours
// ------------------------------------------------------------

test("tout parcours commence par l'aiguillage et contient le tronc commun", () => {

const TRONC = ["country", "nationality", "studyCategory", "average", "ageBracket",
"english", "french", "langCert", "timeline", "destinationCountry", "goal", "passport"];

for (const niveau of NIVEAUX_ACTUELS.map((n) => n.label)) {

const q = ids({ currentLevel: niveau });

assert.equal(q[0], "currentLevel", `aiguillage en tête pour « ${niveau} »`);

for (const attendu of TRONC) {
assert.ok(q.includes(attendu), `« ${attendu} » manquant pour « ${niveau} »`);
}

}

});

test("aucune question n'est posée deux fois dans un même parcours", () => {

for (const niveau of NIVEAUX_ACTUELS.map((n) => n.label)) {

for (const cible of ["", "Master", "Doctorat (PhD)", "Licence (Bachelor)"]) {

const q = ids(cible ? { currentLevel: niveau, targetLevel: cible } : { currentLevel: niveau });

assert.equal(new Set(q).size, q.length, `doublon pour « ${niveau} » / « ${cible} »`);

}

}

});

test("toute question a un type valide, et toute question à cartes a des options", () => {

for (const niveau of NIVEAUX_ACTUELS.map((n) => n.label)) {

const reponses = { currentLevel: niveau, targetLevel: cyclesVisesPour(pisteDepuisNiveau(niveau))[0] };

for (const question of questionsPour(reponses)) {

assert.ok(["cards", "search", "slider"].includes(question.type), `type inconnu : ${question.id}`);

if (question.type === "cards") {

const options = resoudre(question.options, reponses);

assert.ok(Array.isArray(options) && options.length, `options vides : ${question.id}`);
assert.ok(options.every((o) => typeof o.label === "string" && o.label), `libellé vide : ${question.id}`);

}

assert.ok(resoudre(question.question, reponses), `intitulé vide : ${question.id}`);
assert.ok(resoudre(question.assistant, reponses), `message d'accompagnement vide : ${question.id}`);

}

}

});

test("la moyenne est formulée selon le cycle de l'étudiant", () => {

const lycee = questionsPour({ currentLevel: "Au lycée" }).find((q) => q.id === "average");
const doctorat = questionsPour({ currentLevel: "Doctorat en cours" }).find((q) => q.id === "average");

const auLycee = resoudre(lycee.question, { currentLevel: "Au lycée" });
const auDoctorat = resoudre(doctorat.question, { currentLevel: "Doctorat en cours" });

assert.match(auLycee, /lycée/i);
assert.match(auDoctorat, /master/i);
assert.notEqual(auLycee, auDoctorat);

});

// ------------------------------------------------------------
// 5. Purge des réponses devenues hors piste
// ------------------------------------------------------------

test("changer de niveau efface les réponses qui n'ont plus de question", () => {

const reponses = {
currentLevel: "Doctorat en cours",
secondaryTrack: "Scientifique",
workExperience: "2 à 5 ans",
average: "15",
averageScale: "20"
};

purgerHorsPiste(reponses);

assert.equal(reponses.secondaryTrack, undefined);
assert.equal(reponses.workExperience, undefined);

// Le tronc commun, lui, survit — y compris sa clé technique d'échelle.
assert.equal(reponses.average, "15");
assert.equal(reponses.averageScale, "20");
assert.equal(reponses.currentLevel, "Doctorat en cours");

});

test("un cycle visé devenu impossible est effacé", () => {

const reponses = { currentLevel: "Au lycée", targetLevel: "Doctorat (PhD)" };

purgerHorsPiste(reponses);

assert.equal(reponses.targetLevel, undefined);

});

test("un cycle visé toujours valide est conservé", () => {

const reponses = { currentLevel: "Licence obtenue", targetLevel: "Master" };

purgerHorsPiste(reponses);

assert.equal(reponses.targetLevel, "Master");

});

// ------------------------------------------------------------
// 6. Le moteur de progression
// ------------------------------------------------------------

test("aucun total n'est affiché tant que le niveau est inconnu", () => {

const parcours = new ParcoursEligibilite();

assert.equal(parcours.total(), null);
assert.equal(parcours.courante().id, "currentLevel");

parcours.enregistrer("currentLevel", "Licence obtenue");

assert.ok(parcours.total() > 10);

});

test("changer de niveau en cours de route ne perd pas l'étudiant", () => {

const parcours = new ParcoursEligibilite();

parcours.enregistrer("currentLevel", "Licence obtenue");
parcours.suivante();
parcours.enregistrer("targetLevel", "Master");
parcours.suivante();

assert.equal(parcours.courante().id, "diplomaWhen");

// Retour tout au début et changement de niveau : la question courante
// reste celle qu'on regardait, et rien ne pointe dans le vide.
parcours.precedente();
parcours.precedente();
assert.equal(parcours.courante().id, "currentLevel");

parcours.enregistrer("currentLevel", "Au lycée");

assert.equal(parcours.courante().id, "currentLevel");
assert.equal(parcours.reponses.targetLevel, undefined);

parcours.suivante();
assert.equal(parcours.courante().id, "secondaryTrack");

});

test("la progression reste bornée entre 4 et 100", () => {

const parcours = new ParcoursEligibilite();

assert.equal(parcours.progression(), 4);

parcours.enregistrer("currentLevel", "Master obtenu");
parcours.enregistrer("targetLevel", "Doctorat (PhD)");

while (parcours.suivante()) {
const p = parcours.progression();
assert.ok(p > 0 && p <= 100, `progression hors bornes : ${p}`);
}

assert.equal(parcours.progression(), 100);

});

// ------------------------------------------------------------
// 7. Pays de destination
// ------------------------------------------------------------

test("les pays du catalogue remplacent le filet de secours", () => {

const reponses = { currentLevel: "Licence obtenue", targetLevel: "Master" };

definirSuggestionsDestination(["France", "Hongrie", "Je ne sais pas encore"]);

const question = questionsPour(reponses).find((q) => q.id === "destinationCountry");

assert.deepEqual(resoudre(question.suggestions, reponses), ["France", "Hongrie", "Je ne sais pas encore"]);

// Une liste vide ne doit jamais écraser ce qui marche.
definirSuggestionsDestination([]);

assert.equal(resoudre(question.suggestions, reponses).length, 3);

});

// ------------------------------------------------------------
// 8. Traduction du domaine d'études vers le vocabulaire du catalogue
//
// Sans elle, la question « Que souhaitez-vous étudier ? » ne changeait
// RIEN aux bourses proposées : le catalogue ne connaît que dix
// familles, et « Intelligence artificielle » n'en contient aucune.
// ------------------------------------------------------------

test("les spécialités fines retombent sur les familles du catalogue", () => {

const attendu = {
"Intelligence artificielle": "Informatique",
"Cybersécurité": "Informatique",
"Data Science": "Informatique",
"Génie logiciel": "Informatique",
"Génie mécanique": "Ingénierie",
"Génie civil": "Ingénierie",
"Travaux publics": "Ingénierie",
"Urbanisme": "Architecture",
"Pharmacie": "Médecine",
"Soins infirmiers": "Médecine",
"Marketing": "Commerce",
"Relations internationales": "Droit",
"Agronomie": "Agriculture",
"Psychologie": "Sciences sociales",
"Arts & Communication": "Lettres",
"Mathématiques": "Sciences"
};

for (const [saisie, famille] of Object.entries(attendu)) {
assert.equal(familleDeDomaine(saisie), famille, `« ${saisie} »`);
}

});

test("« sciences sociales » et « sciences humaines » ne sont pas absorbées par « Sciences »", () => {

assert.equal(familleDeDomaine("Sciences sociales"), "Sciences sociales");
assert.equal(familleDeDomaine("Lettres & Sciences humaines"), "Lettres");

});

test("un domaine inconnu ne vaut jamais « ne correspond pas »", () => {

// Règle des trois valeurs, comme pour l'éligibilité et l'âge : "" est
// une absence d'information, jamais une exclusion.
assert.equal(familleDeDomaine("Autre"), "");
assert.equal(familleDeDomaine(""), "");
assert.equal(familleDeDomaine(undefined), "");

});

test("les dix familles du catalogue sont toutes atteignables", () => {

// Mesuré sur assets/data/catalogue.json le 2026-09-05 : ce sont les
// seules valeurs présentes dans universities.fields.
const FAMILLES = ["Commerce", "Sciences sociales", "Ingénierie", "Informatique",
"Architecture", "Sciences", "Lettres", "Droit", "Médecine", "Agriculture"];

const atteintes = new Set(FAMILLES.map((f) => familleDeDomaine(f)));

for (const famille of FAMILLES) {
assert.ok(atteintes.has(famille), `famille jamais atteinte : ${famille}`);
}

});
