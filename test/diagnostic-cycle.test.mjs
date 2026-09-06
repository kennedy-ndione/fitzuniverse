/**
 * ============================================================
 * Tests — ce que Fitz RETIENT, et le barème par cycle
 * ============================================================
 *
 * Lancer : npm test
 *
 * Deux régressions à empêcher, par ordre de gravité :
 *
 *  1. LE CHIFFRE QUI NE VEUT RIEN DIRE. La page annonçait « votre
 *     profil correspond à 154 opportunités » parce que le moteur
 *     gardait tout score >= 0 et que le score par défaut est 0. Trois
 *     profils donnaient trois fois le même nombre. Si « correspondre »
 *     redevient « ne pas être exclu », ces tests doivent échouer.
 *  2. UNE ÉCHÉANCE PASSÉE PRÉSENTÉE COMME OUVERTE. Mesuré le
 *     2026-09-05 : 167 programmes portent status:"Ouverte" pour 39
 *     dates encore futures. Proposer un train déjà parti détruit la
 *     crédibilité du diagnostic en une ligne.
 * ============================================================
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
retenirOpportunites,
etatEcheance,
domaineCorrespond,
langueCompatible
} from "../js/recommend-programs.js";

import { EligibilityAI, resolveTargetLevel } from "../eligibility-ai.js";

const AUJ = new Date("2026-09-05T12:00:00Z");

// ⚠️ Les échéances du catalogue sont des textes FRANÇAIS
// (« 15 janvier 2027 »), pas des dates ISO : un test qui écrirait
// « 2027-01-15 » ne vérifierait rien du vrai chemin de lecture.
const MOIS = ["janvier", "février", "mars", "avril", "mai", "juin",
"juillet", "août", "septembre", "octobre", "novembre", "décembre"];

const dans = (jours) => {
const d = new Date(AUJ);
d.setUTCDate(d.getUTCDate() + jours);
const jour = d.getUTCDate();
return `${jour === 1 ? "1er" : jour} ${MOIS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
};

// Un mini-catalogue lisible : chaque pièce y est là pour un test précis.
function catalogue() {

const universities = [
{ id: "u1", name: "Université A", country: "Hongrie", fields: ["Informatique"] },
{ id: "u2", name: "Université B", country: "Hongrie", fields: ["Informatique"] },
{ id: "u3", name: "Université C", country: "Hongrie", fields: [] },
{ id: "u4", name: "Université D", country: "Hongrie", fields: [] },
{ id: "u5", name: "Université E", country: "Canada", fields: ["Commerce"] },
{ id: "u6", name: "Université F", country: "Japon", fields: [] },
{ id: "u7", name: "Université G", country: "Brésil", fields: [] }
];

const scholarships = [
{ id: "b-hongrie", title: "Bourse hongroise", eligibility: { scope: "monde" } },
{ id: "b-canada", title: "Bourse canadienne", eligibility: { scope: "monde" } },
{ id: "b-japon", title: "Bourse japonaise", eligibility: { scope: "monde" } },
{ id: "b-fermee", title: "Bourse close", eligibility: { scope: "monde" } }
];

const programs = [
// Quatre universités pour LA MÊME bourse : une seule doit sortir.
{ id: "p1", universityId: "u1", scholarshipId: "b-hongrie", level: "Master", language: "Anglais", deadline: dans(40), status: "Ouverte" },
{ id: "p2", universityId: "u2", scholarshipId: "b-hongrie", level: "Master", language: "Anglais", deadline: dans(40), status: "Ouverte" },
{ id: "p3", universityId: "u3", scholarshipId: "b-hongrie", level: "Master", language: "Anglais", deadline: dans(40), status: "Ouverte" },
{ id: "p4", universityId: "u4", scholarshipId: "b-hongrie", level: "Master", language: "Anglais", deadline: dans(40), status: "Ouverte" },
// Bon cycle, échéance ouverte, autre pays.
{ id: "p5", universityId: "u5", scholarshipId: "b-canada", level: "Master", language: "Anglais", deadline: dans(120), status: "Ouverte" },
// Bon cycle, aucune date : recevable, mais après celles qui sont ouvertes.
{ id: "p6", universityId: "u6", scholarshipId: "b-japon", level: "Master", language: "Anglais" },
// ÉCHÉANCE PASSÉE alors que le statut dit « Ouverte » : le piège.
{ id: "p7", universityId: "u7", scholarshipId: "b-fermee", level: "Master", language: "Anglais", deadline: dans(-10), status: "Ouverte" }
];

return {
programs,
universitiesById: new Map(universities.map((u) => [u.id, u])),
scholarshipsById: new Map(scholarships.map((s) => [s.id, s]))
};

}

const profilMaster = {
targetLevel: "Master",
nationality: "Sénégal",
languages: ["Anglais", "Français"],
desiredField: "Intelligence artificielle",
preferredCountries: []
};

// ------------------------------------------------------------
// 1. L'échéance, à trois valeurs
// ------------------------------------------------------------

test("une échéance passée ferme la porte, même si le statut dit « Ouverte »", () => {

assert.equal(etatEcheance({ deadline: dans(-1), status: "Ouverte" }, AUJ).ouverte, false);
assert.equal(etatEcheance({ deadline: dans(30), status: "Ouverte" }, AUJ).ouverte, true);

});

test("une échéance absente ou illisible vaut INCONNUE, jamais fermée", () => {

assert.equal(etatEcheance({ status: "Ouverte" }, AUJ).ouverte, null);
assert.equal(etatEcheance({ deadline: "Dates non publiées — évaluation sur dossier" }, AUJ).ouverte, null);

});

test("un statut « Fermée » ferme, quelle que soit la date", () => {

assert.equal(etatEcheance({ deadline: dans(200), status: "Fermée" }, AUJ).ouverte, false);

});

// ------------------------------------------------------------
// 2. Domaine et langue : trois valeurs, elles aussi
// ------------------------------------------------------------

test("le domaine est traduit avant d'être comparé", () => {

const uni = { fields: ["Informatique"] };

// « Intelligence artificielle » ne CONTIENT pas « Informatique » :
// c'est tout le sujet du correctif du 2026-09-05.
assert.equal(domaineCorrespond(uni, { desiredField: "Intelligence artificielle" }), true);
assert.equal(domaineCorrespond(uni, { desiredField: "Médecine" }), false);

// Université sans domaine déclaré, ou domaine intraduisible : inconnu.
assert.equal(domaineCorrespond({ fields: [] }, { desiredField: "Informatique" }), null);
assert.equal(domaineCorrespond(uni, { desiredField: "Autre" }), null);

});

test("un étudiant débutant dans les deux langues n'est pas exclu du monde entier", () => {

// Plusieurs grands programmes incluent une année de langue : lui
// rendre une page vide serait faux autant qu'inutile.
assert.equal(langueCompatible({ language: "Anglais" }, { languages: [] }), null);
assert.equal(langueCompatible({ language: "Anglais" }, { languages: ["Anglais"] }), true);
assert.equal(langueCompatible({ language: "Anglais" }, { languages: ["Français"] }), false);
assert.equal(langueCompatible({}, { languages: ["Anglais"] }), null);

});

// ------------------------------------------------------------
// 3. La sélection
// ------------------------------------------------------------

test("une bourse n'apparaît qu'UNE fois, même présente dans quatre universités", () => {

const { programs, universitiesById, scholarshipsById } = catalogue();

const { retenues } = retenirOpportunites({
profile: profilMaster, programs, universitiesById, scholarshipsById, aujourdhui: AUJ
});

const parBourse = retenues.filter((r) => r.scholarshipId === "b-hongrie");

assert.equal(parBourse.length, 1, "la bourse hongroise sort quatre fois");

});

test("une opportunité dont l'échéance est passée n'est jamais retenue", () => {

const { programs, universitiesById, scholarshipsById } = catalogue();

const { retenues } = retenirOpportunites({
profile: profilMaster, programs, universitiesById, scholarshipsById, aujourdhui: AUJ
});

assert.ok(!retenues.some((r) => r.scholarshipId === "b-fermee"));

});

test("le cycle visé est un filtre, pas un bonus", () => {

const { programs, universitiesById, scholarshipsById } = catalogue();

const { retenues } = retenirOpportunites({
profile: { ...profilMaster, targetLevel: "Doctorat (PhD)" },
programs, universitiesById, scholarshipsById, aujourdhui: AUJ
});

assert.equal(retenues.length, 0, "des programmes de master remontent pour un doctorat");

});

test("les échéances ouvertes passent devant celles qu'on ne connaît pas", () => {

const { programs, universitiesById, scholarshipsById } = catalogue();

const { retenues, ouvertes } = retenirOpportunites({
profile: profilMaster, programs, universitiesById, scholarshipsById, aujourdhui: AUJ
});

assert.equal(ouvertes, 2);
assert.equal(retenues[0].echeanceOuverte, true);
assert.equal(retenues[retenues.length - 1].echeanceOuverte, null);

// Et la plus proche en premier parmi les ouvertes.
const jours = retenues.filter((r) => r.echeanceOuverte === true).map((r) => r.jours);
assert.deepEqual(jours, [...jours].sort((a, b) => a - b));

});

test("un même pays ne monopolise pas la liste", () => {

const { programs, universitiesById, scholarshipsById } = catalogue();

// Quatre universités hongroises, mais sur des bourses distinctes.
const scholarshipsById2 = new Map(scholarshipsById);
["b2", "b3", "b4"].forEach((id) => scholarshipsById2.set(id, { id, title: id, eligibility: { scope: "monde" } }));

const programs2 = programs.map((p, i) =>
["p2", "p3", "p4"].includes(p.id) ? { ...p, scholarshipId: ["b2", "b3", "b4"][["p2", "p3", "p4"].indexOf(p.id)] } : p
);

const { retenues } = retenirOpportunites({
profile: profilMaster, programs: programs2, universitiesById, scholarshipsById: scholarshipsById2,
aujourdhui: AUJ, maxParPays: 2
});

const hongrie = retenues.filter((r) => r.country === "Hongrie").length;

assert.ok(hongrie <= 2, `${hongrie} opportunités hongroises alors que le plafond est 2`);

});

test("le nombre retenu est borné et jamais négatif", () => {

const { programs, universitiesById, scholarshipsById } = catalogue();

const { retenues, nombre } = retenirOpportunites({
profile: profilMaster, programs, universitiesById, scholarshipsById, aujourdhui: AUJ, max: 2
});

assert.equal(retenues.length, 2);
assert.equal(nombre, 2);

});

// ------------------------------------------------------------
// 4. Le barème par cycle
// ------------------------------------------------------------

const base = {
average: "14", averageScale: "20",
english: "Bon niveau", french: "Courant / Langue maternelle",
langCert: "Pas encore", timeline: "D'ici 1 an", passport: "Passeport valide",
studyCategory: "Commerce", ageBracket: "25 – 29 ans"
};

const axes = (reponses) => new EligibilityAI(reponses).analyze().breakdown.map((b) => b.label);

test("chaque cycle est noté sur les axes qui le concernent, et sur eux seuls", () => {

const licence = axes({ ...base, currentLevel: "Bac obtenu", targetLevel: "Licence (Bachelor)", ageBracket: "18 – 24 ans" });
const master = axes({ ...base, currentLevel: "Licence obtenue", targetLevel: "Master" });
const doctorat = axes({ ...base, currentLevel: "Master obtenu", targetLevel: "Doctorat (PhD)" });

assert.ok(licence.includes("Filière et domaine visé"));
assert.ok(!licence.includes("Expérience professionnelle"), "on ne reproche pas à un lycéen de ne pas être cadre");
assert.ok(!licence.includes("Projet de recherche"));

assert.ok(master.includes("Expérience professionnelle"));
assert.ok(master.includes("Candidatures universitaires"));
assert.ok(!master.includes("Projet de recherche"));

assert.ok(doctorat.includes("Projet de recherche"));
assert.ok(doctorat.includes("Encadrement de thèse"));
assert.ok(!doctorat.includes("Expérience professionnelle"));

});

test("chaque barème totalise exactement 100", () => {

for (const cible of ["Licence (Bachelor)", "Master", "Doctorat (PhD)"]) {

const r = { ...base, currentLevel: "Licence obtenue", targetLevel: cible };
const total = new EligibilityAI(r).analyze().breakdown.reduce((s, b) => s + b.poids, 0);

assert.equal(total, 100, `barème « ${cible} »`);

}

});

test("le score EST la somme pondérée de sa décomposition", () => {

const r = { ...base, currentLevel: "Licence obtenue", targetLevel: "Master", workExperience: "1 à 2 ans" };
const res = new EligibilityAI(r).analyze();

const somme = res.breakdown.reduce((s, b) => s + (b.value / 100) * b.poids, 0);

assert.ok(Math.abs(res.score - somme) <= 1, `score ${res.score} contre décomposition ${somme.toFixed(1)}`);

});

test("l'expérience professionnelle change réellement le score d'un candidat au master", () => {

const sans = new EligibilityAI({ ...base, currentLevel: "Licence obtenue", targetLevel: "Master", workExperience: "Aucune pour l'instant", admissionStatus: "Aucune démarche pour l'instant" }).analyze();
const avec = new EligibilityAI({ ...base, currentLevel: "Licence obtenue", targetLevel: "Master", workExperience: "2 à 5 ans", admissionStatus: "J'ai déjà une admission" }).analyze();

assert.ok(avec.score - sans.score >= 15, `écart de seulement ${avec.score - sans.score} points`);

});

test("le projet de recherche et l'encadrement pèsent sur un dossier de doctorat", () => {

const rien = new EligibilityAI({ ...base, currentLevel: "Master obtenu", targetLevel: "Doctorat (PhD)", researchProject: "Pas encore commencé", supervisorContact: "Non, pas encore" }).analyze();
const pret = new EligibilityAI({ ...base, currentLevel: "Master obtenu", targetLevel: "Doctorat (PhD)", researchProject: "Rédigé et abouti", supervisorContact: "Oui, avec un accord écrit" }).analyze();

assert.ok(pret.score - rien.score >= 20, `écart de seulement ${pret.score - rien.score} points`);

});

test("chaque axe affiché porte son propre conseil", () => {

const res = new EligibilityAI({ ...base, currentLevel: "Master obtenu", targetLevel: "Doctorat (PhD)" }).analyze();

for (const ligne of res.breakdown) {
assert.ok(ligne.conseil && ligne.conseil.length > 20, `conseil manquant : ${ligne.label}`);
}

});

test("l'absence de publication n'est jamais présentée comme un frein", () => {

const res = new EligibilityAI({ ...base, currentLevel: "Master obtenu", targetLevel: "Doctorat (PhD)", publications: "Pas encore" }).analyze();

assert.ok(!res.weaknesses.some((w) => w.toLowerCase().includes("publication")));

});

test("le cycle visé reste résolu même quand la question a été sautée", () => {

assert.equal(resolveTargetLevel({ currentLevel: "Bac obtenu" }), "Licence (Bachelor)");
assert.equal(resolveTargetLevel({ currentLevel: "Doctorat en cours" }), "Doctorat (PhD)");

});

// ------------------------------------------------------------
// 5. La garde qui manquait — l'ordre d'évaluation du module
//
// Bug attrapé EN PRODUCTION le 2026-09-05, pas par les tests :
// « Cannot access 'PALIER_MS' before initialization ». main() était
// appelé en haut de results.js, donc avant que le module ait fini de
// s'évaluer ; il s'exécute pourtant de façon synchrone jusqu'à son
// premier await et lit au passage des `const` déclarées plus bas.
// Résultat visible : « aucune opportunité » et une réflexion figée à
// la première étape.
//
// Aucun test unitaire ne peut attraper ça — ils n'évaluent pas la
// page. Cette garde-ci est donc textuelle, et assumée comme telle :
// elle vérifie seulement que le démarrage reste le dernier geste du
// fichier.
// ------------------------------------------------------------

test("results.js démarre en fin de module, jamais avant ses constantes", async () => {

const { readFileSync } = await import("node:fs");
const { fileURLToPath } = await import("node:url");
const { dirname, join } = await import("node:path");

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = readFileSync(join(racine, "results.js"), "utf8");

// Les commentaires parlent abondamment de main() — ils sont retirés
// avant la recherche, sans quoi la garde compterait des phrases.
const code = source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|\s)\/\/.*$/gm, "$1");

const mentions = [...code.matchAll(/(?<![\w.])main\(/g)].map((m) => m.index);
const declaration = code.indexOf("async function main(");

assert.ok(declaration > 0, "async function main( introuvable dans results.js");

const appels = mentions.filter((i) => i !== declaration + "async function ".length);

assert.equal(appels.length, 1, "main() doit être appelé une seule fois, au niveau du module");

const apresLAppel = code.slice(appels[0]).trim();

assert.ok(
apresLAppel.length < 200,
`main() est appelé ${apresLAppel.length} caractères avant la fin de results.js : tout ce qui est déclaré après sera dans sa zone morte temporelle`
);

});

test("loadRealOpportunities renvoie tout ce que main() lui demande", async () => {

const { readFileSync } = await import("node:fs");
const { fileURLToPath } = await import("node:url");
const { dirname, join } = await import("node:path");

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = readFileSync(join(racine, "results.js"), "utf8");
const code = source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|\s)\/\/.*$/gm, "$1");

// Deuxième bug attrapé en production le 2026-09-05 :
// `eligibleCountries` était CALCULÉ dans loadRealOpportunities puis
// oublié dans l'objet retourné. buildNarrative() lit `.length` dessus
// sans garde — la page restait bloquée sur l'écran de réflexion, sans
// rien dire à l'utilisateur.
//
// ⚠️ Une première version de ce test comparait les clés LUES sur
// `result` à celles qui lui sont AFFECTÉES : elle ne voyait rien,
// puisque `result.eligibleCountries = catalogue.eligibleCountries`
// est bien une affectation — d'une valeur `undefined`. Une garde qui
// ne garde pas est pire que pas de garde : celle-ci compare le VRAI
// contrat, entre ce que main() lit sur l'objet rendu et ce que
// loadRealOpportunities y met.

const debut = code.indexOf("async function loadRealOpportunities");
assert.ok(debut > 0, "loadRealOpportunities introuvable");

// Le DERNIER `return {` de la fonction est son objet de sortie — le
// premier appartient à la fonction interne `enrichir`, piège dans
// lequel une première version de cette garde est tombée.
const finFonction = code.indexOf("function creerJournalReflexion", debut);
assert.ok(finFonction > debut, "borne de fin de loadRealOpportunities introuvable");

const depart = code.lastIndexOf("return {", finFonction);
const objet = code.slice(depart, finFonction);

const fournies = new Set([...objet.matchAll(/^([a-zA-Z]+)\s*[,:]/gm)].map((m) => m[1]));

// Les trois clés du catalogue BRUT (celui que rend chargerCatalogue)
// ne transitent pas par l'objet de sortie : elles sont lues à
// l'intérieur même de la fonction.
const CATALOGUE_BRUT = new Set(["bourses", "programmes", "universites"]);

const lues = new Set(
[...code.matchAll(/\bcatalogue\.([a-zA-Z]+)/g)]
.map((m) => m[1])
.filter((k) => !CATALOGUE_BRUT.has(k))
);

const manquantes = [...lues].filter((k) => !fournies.has(k));

assert.deepEqual(manquantes, [], `clés lues sur le résultat mais jamais renvoyées : ${manquantes.join(", ")}`);

});

/* ------------------------------------------------------------------
 * Le domaine doit peser assez pour changer la liste (2026-09-05)
 * ------------------------------------------------------------------
 * Mesure qui a motivé le passage de 1 à 3 points : avec 1 point, un
 * futur médecin et un futur juriste recevaient neuf recommandations
 * identiques sur douze. Le test ne vérifie pas le chiffre 3 lui-même —
 * il vérifie l'EFFET : à conditions égales par ailleurs, la discipline
 * de l'étudiant doit changer ce qu'on lui propose en premier.
 */

test("deux étudiants de disciplines différentes ne reçoivent pas la même première piste", () => {

  const universities = [
    { id: "u-med", name: "Université de médecine", country: "Hongrie", flag: "hu.svg", fields: ["Médecine", "Sciences"] },
    { id: "u-droit", name: "Université de droit", country: "Hongrie", flag: "hu.svg", fields: ["Droit", "Sciences sociales"] }
  ];

  const scholarships = [
    { id: "b-med", title: "Bourse de l'université de médecine", country: "Hongrie", status: "Ouverte", isActive: true, levels: ["Master"] },
    { id: "b-droit", title: "Bourse de l'université de droit", country: "Hongrie", status: "Ouverte", isActive: true, levels: ["Master"] }
  ];

  const programs = [
    { id: "p-med", universityId: "u-med", scholarshipId: "b-med", level: "Master", deadline: "15 janvier 2027", status: "Ouverte" },
    { id: "p-droit", universityId: "u-droit", scholarshipId: "b-droit", level: "Master", deadline: "15 janvier 2027", status: "Ouverte" }
  ];

  const universitiesById = new Map(universities.map((u) => [u.id, u]));
  const scholarshipsById = new Map(scholarships.map((s) => [s.id, s]));

  const premierePiste = (desiredField) => retenirOpportunites({
    profile: { targetLevel: "Master", nationality: "Sénégal", desiredField, preferredCountries: [], languages: ["Anglais", "Français"] },
    programs, universitiesById, scholarshipsById, aujourdhui: AUJ
  }).retenues[0];

  assert.equal(premierePiste("Médecine").universityId, "u-med");
  assert.equal(premierePiste("Droit").universityId, "u-droit");

  // Et la spécialité fine doit passer par familleDeDomaine() : la
  // pharmacie relève de la médecine, le droit international du droit.
  assert.equal(premierePiste("Pharmacie").universityId, "u-med");
  assert.equal(premierePiste("Relations internationales").universityId, "u-droit");

});

test("une université sans domaine déclaré n'est jamais pénalisée pour ce trou de données", () => {

  const universities = [
    { id: "u-connue", name: "Université renseignée", country: "Hongrie", flag: "hu.svg", fields: ["Droit"] },
    { id: "u-inconnue", name: "Université non renseignée", country: "Hongrie", flag: "hu.svg", fields: [] }
  ];

  const scholarships = [
    { id: "b-connue", title: "Bourse A", country: "Hongrie", status: "Ouverte", isActive: true, levels: ["Master"] },
    { id: "b-inconnue", title: "Bourse B", country: "Hongrie", status: "Ouverte", isActive: true, levels: ["Master"] }
  ];

  const programs = [
    { id: "p-connue", universityId: "u-connue", scholarshipId: "b-connue", level: "Master", deadline: "15 janvier 2027", status: "Ouverte" },
    { id: "p-inconnue", universityId: "u-inconnue", scholarshipId: "b-inconnue", level: "Master", deadline: "15 janvier 2027", status: "Ouverte" }
  ];

  const { retenues } = retenirOpportunites({
    profile: { targetLevel: "Master", nationality: "Sénégal", desiredField: "Médecine", preferredCountries: [], languages: ["Anglais", "Français"] },
    programs,
    universitiesById: new Map(universities.map((u) => [u.id, u])),
    scholarshipsById: new Map(scholarships.map((s) => [s.id, s])),
    aujourdhui: AUJ
  });

  // Ni l'une ni l'autre ne correspond à « Médecine » : l'université sans
  // domaine ne doit pas pour autant disparaître de la liste.
  assert.equal(retenues.length, 2, "un champ vide est un inconnu, jamais une non-correspondance");

});
