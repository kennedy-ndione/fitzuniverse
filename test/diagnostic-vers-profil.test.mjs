/**
* Lot PROFIL-PAR-NIVEAU, partie 4 (2026-09-11) — ne pas refaire répondre
* à ce que l'étudiant a déjà dit au diagnostic gratuit.
*
*  1. la correspondance, champ par champ, depuis les VRAIES définitions
*     (identifiants et libellés de js/eligibility-pistes.js) ;
*  2. une valeur inconnue → vide (jamais deviner) ;
*  3. jamais écraser une valeur déjà saisie ;
*  4. le document de compte par défaut : le même pour payment.js et
*     js/creer-compte.js, pré-rempli quand le diagnostic est là, vide
*     sinon, et sans aucun champ réservé à l'administrateur ;
*  5. test de forme : les deux chemins de création importent le module
*     partagé (la dette « deux copies » est soldée, et ne revient pas).
*/
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { questionsPour, NIVEAUX_ACTUELS } from "../js/eligibility-pistes.js";
import { profilDepuisDiagnostic, fusionnerSansEcraser, appliquerDiagnostic, lireReponsesDiagnostic } from "../js/diagnostic-vers-profil.js";
import { documentUtilisateurParDefaut, profilVide } from "../js/compte-par-defaut.js";
import { profilPretPourFitz } from "../js/fitz-choisit.js";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const LE_JOUR = new Date("2026-09-11T12:00:00Z");

// Les réponses d'un bachelier, telles que finish() les écrit (eligibility-questions.js).
const BACHELIER = {
currentLevel: "Bac obtenu",
targetLevel: "Licence (Bachelor)",
piste: "bac_obtenu",
secondaryTrack: "Scientifique",
diplomaWhen: "Cette année",
country: "Sénégal",
nationality: "Sénégalaise",
studyCategory: "Informatique",
average: 15,
averageScale: "20",
ageBracket: "18 – 24 ans",
english: "Bon niveau",
french: "Courant / Langue maternelle",
langCert: "Pas encore",
timeline: "D'ici 1 an",
destinationCountry: "France",
goal: "Une bourse complète",
passport: "Passeport valide"
};

test("diagnostic-vers-profil 1 — la correspondance, champ par champ, pour un bachelier", () => {
const p = profilDepuisDiagnostic(BACHELIER, { aujourdhui: LE_JOUR });
assert.equal(p.palier, "bac_obtenu");
assert.equal(p.lastDegree, "Baccalauréat");
assert.equal(p.desiredDegree, "Licence");
assert.equal(p.nationality, "Sénégalaise");
assert.equal(p.country, "Sénégal");
assert.equal(p.desiredField, "Informatique");
// La moyenne d'un bachelier est celle du bac, avec son échelle.
assert.equal(p.bacAverage, "15");
assert.equal(p.bacAverageScale, "20");
assert.equal(p.academicAverage, undefined);
assert.equal(p.bacSeries, "Scientifique");
assert.equal(p.graduationYear, "2026");
// Les langues pratiquées, SANS niveau CECRL (on ne devine pas).
assert.deepEqual(p.languages, [{ code: "fr", level: "" }, { code: "en", level: "" }]);
// Lot R17 : l'état a son propre champ. « Aucun test » était jusqu'ici
// rangé dans `nature`, c'est-à-dire un état déguisé en test.
assert.deepEqual(p.testLangue, { etat: "aucun", nature: "", score: "", date: "", prevuLe: "" });
assert.deepEqual(p.preferredCountries, ["France"]);
assert.deepEqual(p.fundingWanted, ["full_scholarship"]);
assert.deepEqual(p.documentsAvailable, ["passport"]);
// Ce qui n'a pas de champ au profil n'y est pas.
assert.equal("ageBracket" in p, false);
assert.equal("timeline" in p, false);
// Le résultat rend Fitz prêt : nationalité, niveau, domaine, une langue.
assert.equal(profilPretPourFitz(p).pret, true);
});

test("diagnostic-vers-profil 2 — les autres pistes : dernier diplôme, niveau actuel, moyenne générale, expérience", () => {
const licence = profilDepuisDiagnostic({ currentLevel: "Licence en cours", licenceYear: "2e année", targetLevel: "Master", average: 13.5, averageScale: "20", secondaryTrack: "Scientifique" });
assert.equal(licence.palier, "licence_en_cours");
assert.equal(licence.lastDegree, "Baccalauréat");
assert.equal(licence.currentLevel, "L2");
assert.equal(licence.desiredDegree, "Master");
assert.equal(licence.academicAverage, "13.5");
assert.equal(licence.academicAverageScale, "20");
// La filière du secondaire ne se reporte pas sur un étudiant du supérieur.
assert.equal(licence.bacSeries, undefined);
assert.equal(licence.bacAverage, undefined);

const cesure = profilDepuisDiagnostic({ currentLevel: "Licence en cours", licenceYear: "Année de reprise ou de césure" });
assert.equal(cesure.currentLevel, undefined, "une césure ne dit pas l'année : vide");

const master = profilDepuisDiagnostic({ currentLevel: "Master obtenu", targetLevel: "Doctorat (PhD)", workExperience: "2 à 5 ans", diplomaWhen: "L'an dernier" }, { aujourdhui: LE_JOUR });
assert.equal(master.palier, "master_obtenu");
assert.equal(master.lastDegree, "Master");
assert.equal(master.desiredDegree, "Doctorat");
assert.equal(master.workExperience, "2 à 5 ans");
assert.equal(master.graduationYear, "2025");
assert.equal(master.currentLevel, undefined, "M1/M2 n'est pas demandé : vide");

const doctorant = profilDepuisDiagnostic({ currentLevel: "Doctorat en cours", phdYear: "2e année" });
assert.equal(doctorant.palier, "doctorat_en_cours");
assert.equal(doctorant.currentLevel, "Doctorat");
assert.equal(doctorant.lastDegree, "Master");

const lyceen = profilDepuisDiagnostic({ currentLevel: "Au lycée", secondaryTrack: "Autre filière", secondaryTrackOther: "Série G2", diplomaWhen: "Cette année" }, { aujourdhui: LE_JOUR });
assert.equal(lyceen.palier, "lycee");
assert.equal(lyceen.lastDegree, undefined, "un lycéen n'a pas encore de diplôme");
assert.equal(lyceen.bacSeries, "Série G2", "la saisie libre, comme sur les relevés");
assert.equal(lyceen.graduationYear, undefined, "pas encore obtenu");

// Les anciens libellés du sessionStorage sont reconnus (pisteDepuisNiveau).
assert.equal(profilDepuisDiagnostic({ currentLevel: "Master en cours ou obtenu" }).palier, "master_en_cours");
// `piste` seule (currentLevel absent) suffit.
assert.equal(profilDepuisDiagnostic({ piste: "licence_obtenue" }).palier, "licence_obtenue");
});

test("diagnostic-vers-profil 3 — une valeur qu'on ne sait pas convertir reste vide, jamais devinée", () => {
const p = profilDepuisDiagnostic({
currentLevel: "Bac obtenu",
targetLevel: "Ingénieur",                       // cycle inconnu
average: 15,                                    // sans échelle
english: "Débutant",                            // pas une langue pratiquée
french: "Débutant",
langCert: "Oui, en anglais (IELTS, TOEFL…)",   // lequel ? on ne sait pas
destinationCountry: "Je ne sais pas encore",
goal: "Je n'ai pas de préférence",
passport: "Passeport expiré",
workExperience: "Aucune pour l'instant",
secondaryTrack: "Autre filière",                // sans précision
diplomaWhen: "Il y a 2 ans ou plus",            // pas une année
averageScale: "cambridge"                       // échelle inconnue
});
assert.deepEqual(Object.keys(p).sort(), ["lastDegree", "palier"]);
// Rien du tout : un objet vide, pas une exception.
assert.deepEqual(profilDepuisDiagnostic({}), {});
assert.deepEqual(profilDepuisDiagnostic(null), {});
assert.deepEqual(profilDepuisDiagnostic("n'importe quoi"), {});
// « Débutant » dans une langue seulement : l'autre est reprise.
assert.deepEqual(profilDepuisDiagnostic({ english: "Intermédiaire", french: "Débutant" }).languages, [{ code: "en", level: "" }]);
});

test("diagnostic-vers-profil 4 — jamais écraser une valeur déjà saisie", () => {
const existant = { nationality: "Malienne", desiredField: "", languages: [{ code: "en", level: "B2" }], preferredCountries: [], testLangue: { nature: "IELTS", score: "7", date: "2026-01-10", prevuLe: "" } };
const { profil, repris } = fusionnerSansEcraser(existant, profilDepuisDiagnostic(BACHELIER, { aujourdhui: LE_JOUR }));
assert.equal(profil.nationality, "Malienne", "la nationalité saisie reste");
assert.equal(profil.desiredField, "Informatique", "le domaine vide est repris");
assert.deepEqual(profil.languages, [{ code: "en", level: "B2" }], "la liste de langues saisie reste");
assert.deepEqual(profil.preferredCountries, ["France"], "une liste vide est reprise");
assert.equal(profil.testLangue.nature, "IELTS", "un test enregistré n'est pas remplacé par « aucun »");
// Le profil PAR DÉFAUT de profile.js porte un testLangue aux quatre
// valeurs vides : c'est « rien de saisi », la reprise passe (bug du
// harnais, 2026-09-11 : cet objet bloquait le « Pas encore »).
const defaut = fusionnerSansEcraser({ testLangue: { etat: "", nature: "", score: "", date: "", prevuLe: "" }, languages: [] }, profilDepuisDiagnostic(BACHELIER, { aujourdhui: LE_JOUR }));
assert.equal(defaut.profil.testLangue.etat, "aucun");
assert.ok(defaut.repris.includes("testLangue") && defaut.repris.includes("languages"));
assert.ok(repris.includes("desiredField") && repris.includes("preferredCountries"));
assert.ok(!repris.includes("nationality") && !repris.includes("languages") && !repris.includes("testLangue"));
// L'argument n'est pas modifié ; les tableaux repris sont des copies.
assert.equal(existant.desiredField, "");
const partiel = { preferredCountries: ["France"] };
const r2 = fusionnerSansEcraser({}, partiel);
r2.profil.preferredCountries.push("Canada");
assert.deepEqual(partiel.preferredCountries, ["France"]);
// Sans rien à reprendre : aucune liste posée.
assert.deepEqual(appliquerDiagnostic({ nationality: "X" }, {}).profil, { nationality: "X" });
assert.deepEqual(appliquerDiagnostic({ nationality: "X" }, {}).repris, []);
// Avec : la liste reprisDuDiagnostic pour la mention à l'écran.
const a = appliquerDiagnostic({}, BACHELIER, { aujourdhui: LE_JOUR });
assert.deepEqual(a.profil.reprisDuDiagnostic, a.repris);
assert.ok(a.repris.includes("palier"));
});

test("diagnostic-vers-profil 5 — le document de compte par défaut, un seul pour les deux chemins", () => {
const ts = () => "TS";
// Sans diagnostic : le profil vide historique, à l'identique.
const vide = documentUtilisateurParDefaut({ uid: "u1", name: "Awa", email: "awa@x.sn", serverTimestamp: ts });
assert.deepEqual(vide, { uid: "u1", name: "Awa", email: "awa@x.sn", createdAt: "TS", profile: profilVide() });
assert.deepEqual(Object.keys(vide.profile), ["originCountry", "age", "currentDegree", "academicAverage", "englishLevel", "desiredField", "desiredCountry"]);
// Avec une intention de formule (payment.js) : pendingPlan + horodatage.
const paye = documentUtilisateurParDefaut({ uid: "u1", name: "Awa", email: "awa@x.sn", planId: "essentiel-4", serverTimestamp: ts });
assert.equal(paye.pendingPlan, "essentiel-4");
assert.equal(paye.pendingPlanRequestedAt, "TS");
// Avec le diagnostic : le profil est repris, Fitz est prêt, les alias hérités suivent.
const repris = documentUtilisateurParDefaut({ uid: "u1", name: "Awa", email: "awa@x.sn", reponsesDiagnostic: BACHELIER, serverTimestamp: ts });
assert.equal(profilPretPourFitz(repris.profile).pret, true);
assert.equal(repris.profile.originCountry, "Sénégal");
assert.equal(repris.profile.desiredCountry, "France");
assert.equal(repris.profile.currentDegree, "Baccalauréat");
assert.ok(repris.profile.reprisDuDiagnostic.length > 5);
// Jamais un champ réservé à l'administrateur.
for (const d of [vide, paye, repris]) {
for (const cle of ["plan", "planExpiresAt", "disabled", "testerAccess", "planPreinscription"]) {
assert.equal(cle in d, false, cle);
}
}
// Un diagnostic illisible ne casse rien.
assert.deepEqual(documentUtilisateurParDefaut({ uid: "u", name: "n", email: "e", reponsesDiagnostic: "{", serverTimestamp: ts }).profile, profilVide());
// Hors navigateur : null, jamais une exception.
assert.equal(lireReponsesDiagnostic(), null);
});

test("diagnostic-vers-profil 6 — forme : payment.js et js/creer-compte.js passent par le module partagé", () => {
for (const f of ["payment.js", "js/creer-compte.js"]) {
const src = fs.readFileSync(path.join(RACINE, f), "utf8");
assert.match(src, /import \{ documentUtilisateurParDefaut \} from "\.\/(js\/)?compte-par-defaut\.js"/, f);
assert.match(src, /reponsesDiagnostic: lireReponsesDiagnostic\(\)/, f);
// Plus aucune copie locale du profil vide.
assert.doesNotMatch(src, /originCountry: "",\s*\n\s*age: ""/, f);
}
});

test("diagnostic-vers-profil 7 — chaque identifiant lu existe bien dans le questionnaire", () => {
// Les identifiants que la table lit doivent être ceux d'une question
// réelle, pour au moins un parcours — sinon la correspondance est morte.
const ids = new Set();
for (const n of NIVEAUX_ACTUELS) {
for (const cible of ["Licence (Bachelor)", "Master", "Doctorat (PhD)"]) {
for (const q of questionsPour({ currentLevel: n.label, targetLevel: cible, secondaryTrack: "Autre filière" })) ids.add(q.id);
}
}
for (const lu of ["currentLevel", "targetLevel", "licenceYear", "phdYear", "nationality", "country", "studyCategory", "average", "secondaryTrack", "secondaryTrackOther", "english", "french", "langCert", "destinationCountry", "goal", "passport", "workExperience", "diplomaWhen"]) {
assert.ok(ids.has(lu), `identifiant absent du questionnaire : ${lu}`);
}
});
