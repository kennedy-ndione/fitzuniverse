/**
* ============================================================
* test/lot-depart.test.mjs — le parcours bourse tient jusqu'au départ
* ============================================================
*
* Six défauts trouvés le 2026-09-21 en refaisant, en production, le
* parcours complet d'un compte Essentiel (voir le compte rendu
* claude/parcours-bourse-complet-2026-09-21.md du projet) :
*
*  1. La phase « Visa & départ » se disait faite, « Bon voyage ! »,
*     sans aucune admission.
*  2. Un client payant qui refait son diagnostic était renvoyé vers les
*     formules, sans chemin vers son espace.
*  3. La vérification de Fitz affichait des liens inventés (404).
*  4. Pearson proposée à une bachelière de 2022, et « Vérifié le
*     undefined undefined NaN » sur sa carte.
*  5. La lettre : moyenne du bac fausse, niveau d'anglais enjolivé,
*     « Pays visé : Chine » pour une candidature au Rwanda.
*  6. Le diagnostic refait et l'espace divergeaient en silence.
* ============================================================
*/

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { etatDesPhases, VISA_ETAPES } from "../js/journey-map.js";
import { ecartsDiagnosticProfil } from "../js/diagnostic-vers-profil.js";
import { lienFitzSur, PAGES_FITZ } from "../js/liens-fitz.js";
import { formaterDate } from "../js/echeance.js";
import { fenetreBacMatch, recommendPrograms } from "../js/recommend-programs.js";
import { buildPrompt } from "../js/ai/prompts.js";
import { PATCHES as LOT65 } from "../scripts/data/lot65-pearson-fenetre.mjs";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(path.join(RACINE, f), "utf8").replace(/\r\n/g, "\n");
const sansCommentaires = (js) => js.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
const toutCoche = Object.fromEntries(VISA_ETAPES.map((id) => [id, true]));

// ------------------------------------------------------------------
// 1. Pas de départ sans admission
// ------------------------------------------------------------------

test("1 — six cases cochées sans admission ne font pas une phase « Visa & départ » faite", () => {
  const sans = etatDesPhases({ profileScore: 10, applications: [{ status: "a_preparer" }], visaChecklist: toutCoche });
  assert.equal(sans.phases.find((p) => p.id === "depart").faite, false);
  const refus = etatDesPhases({ profileScore: 10, applications: [{ status: "refusee" }], visaChecklist: toutCoche });
  assert.equal(refus.phases.find((p) => p.id === "depart").faite, false, "un refus n'ouvre pas le départ");
  const admise = etatDesPhases({ profileScore: 10, applications: [{ status: "admise" }], visaChecklist: toutCoche });
  assert.equal(admise.phases.find((p) => p.id === "depart").faite, true);
  const admiseSansVisa = etatDesPhases({ profileScore: 10, applications: [{ status: "admise" }], visaChecklist: {} });
  assert.equal(admiseSansVisa.phases.find((p) => p.id === "depart").faite, false);
});

test("1 — le guide visa ne souhaite pas « Bon voyage » à qui n'est admis nulle part", () => {
  const js = sansCommentaires(lire("dashboard.js"));
  assert.match(js, /function initVisaChecklist\(uid, initial, rafraichirCarte, guide, admis = true\)/);
  assert.match(js, /\? \(admis\s*\? "Les six démarches sont accomplies — vous êtes prêt\(e\) au départ\. Bon voyage !"\s*: "Les six démarches sont cochées\. Elles compteront pour votre départ dès qu'une admission sera enregistrée dans vos dossiers\."\)/);
  assert.match(js, /\}\), applications\.some\(\(app\) => app\.status === "admise"\)\);/);
});

// ------------------------------------------------------------------
// 2. Un client payant retrouve son espace depuis ses résultats
// ------------------------------------------------------------------

test("2 — les résultats renvoient un compte accompagné vers son espace, pas vers les formules", () => {
  const html = lire("results.html");
  assert.match(html, /<a href="index\.html" class="back-link" id="resultsBackLink">/);
  assert.match(html, /<a href="offers\.html\?parcours=bourse" class="btn btn-accent btn-lg" id="closingCta">/);
  assert.match(html, /<p class="closing-note" id="closingNote">/);
  const js = sansCommentaires(lire("results.js"));
  const f = js.slice(js.indexOf("async function adapterAuCompte"), js.indexOf("if (rawResponses)"));
  assert.match(f, /const espace = resoudreEspace\(donnees\);/);
  assert.match(f, /if \(espace !== "aucun"\)/);
  assert.match(f, /retour\.setAttribute\("href", hub\)/);
  assert.match(f, /cta\.setAttribute\("href", hub\)/);
  assert.match(f, /"Retour à mon espace"/);
  assert.match(f, /"Continuer dans mon espace"/);
  assert.match(js, /await adapterAuCompte\(instantane\.data\(\), reponses\);/);
  assert.match(lire("results.css"), /body\[data-compte-accompagne\] #recoLocked \{ display: none !important; \}/);
});

// ------------------------------------------------------------------
// 3. Fitz ne renvoie que vers des pages qui existent
// ------------------------------------------------------------------

test("3 — un lien de Fitz hors de la liste fermée n'est jamais une ancre", () => {
  for (const invente of ["/profil", "/lettre-motivation", "/candidature/dossier", "/candidature/parametres", "javascript:alert(1)", "https://exemple.com", "profil.html", "applications.html?x=<b>"]) {
    assert.equal(lienFitzSur(invente), null, invente);
  }
  assert.equal(lienFitzSur("profile.html"), "profile.html");
  assert.equal(lienFitzSur("ai-letter.html?applicationId=slot-1"), "ai-letter.html?applicationId=slot-1");
  assert.equal(lienFitzSur("./documents.html#pieces"), "documents.html#pieces");
});

test("3 — chaque page de la liste existe vraiment, et le prompt la donne à Fitz", () => {
  for (const page of PAGES_FITZ) assert.ok(lire(page).length > 0, `${page} n'existe pas`);
  const { system } = buildPrompt("readiness", { profile: {}, checklist: [], application: { university: "ALU" } });
  for (const page of PAGES_FITZ) assert.ok(system.includes(page), `${page} absente du prompt`);
  assert.match(system, /jamais un chemin inventé/);
  const js = sansCommentaires(lire("applications.js"));
  assert.match(js, /const lien = lienFitzSur\(item\.actionHref\);\s*if \(lien\) \{/);
  assert.ok(!/\[\\w\.\/\?=&#-\]\+/.test(js), "l'ancien filtre « a l'air d'un chemin » est parti");
});

// ------------------------------------------------------------------
// 4. Pearson : la fenêtre du bac, et une date qui se lit
// ------------------------------------------------------------------

test("4 — une date qui n'est pas ISO ne s'affiche pas (plus de « undefined undefined NaN »)", () => {
  assert.equal(formaterDate("6 novembre 2026"), "");
  assert.equal(formaterDate({}), "");
  assert.equal(formaterDate("2026-13-01"), "");
  assert.equal(formaterDate("2026-09-19T15:55:41.416Z"), "19 septembre 2026");
  assert.equal(formaterDate("2026-12-01"), "1er décembre 2026");
});

test("4 — la fenêtre du bac : trois valeurs, et seul false écarte", () => {
  const S = { anneeBacMin: 2026 };
  assert.equal(fenetreBacMatch(S, { palier: "bac_obtenu", graduationYear: "2022" }), false);
  assert.equal(fenetreBacMatch(S, { lastDegree: "Baccalauréat (obtenu)", graduationYear: "2022" }), false, "profil sans palier : le dernier diplôme parle");
  assert.equal(fenetreBacMatch(S, { palier: "bac_obtenu", graduationYear: "2026" }), true);
  assert.equal(fenetreBacMatch(S, { palier: "bac_obtenu", diplomaWhen: "Cette année" }), true, "diagnostic : « Cette année »");
  assert.equal(fenetreBacMatch(S, { palier: "bac_obtenu", diplomaWhen: "Il y a 2 ans ou plus" }), false);
  assert.equal(fenetreBacMatch(S, { palier: "licence_en_cours" }), false, "déjà dans le supérieur");
  assert.equal(fenetreBacMatch(S, { palier: "lycee" }), null, "un lycéen n'est pas exclu");
  assert.equal(fenetreBacMatch(S, { palier: "bac_obtenu" }), null, "année inconnue : on ne tranche pas");
  assert.equal(fenetreBacMatch({}, { palier: "bac_obtenu", graduationYear: "2022" }), null, "bourse sans fenêtre");
});

test("4 — le moteur ne propose plus Pearson à une bachelière de 2022", () => {
  const universitiesById = new Map([["uoft", { id: "uoft", name: "University of Toronto", country: "Canada" }]]);
  const scholarshipsById = new Map([["pearson", { id: "pearson", title: "Pearson", anneeBacMin: 2026, levels: ["Licence"] }]]);
  const programs = [{ id: "uoft__pearson", universityId: "uoft", scholarshipId: "pearson", level: "Licence", status: "Ouverte" }];
  const args = { programs, universitiesById, scholarshipsById, count: 4 };
  assert.equal(recommendPrograms({ ...args, profile: { palier: "bac_obtenu", graduationYear: "2022", desiredDegree: "Licence" } }).length, 0);
  assert.equal(recommendPrograms({ ...args, profile: { palier: "lycee", desiredDegree: "Licence" } }).length, 1);
  assert.match(lire("results.js"), /palier: responses\.piste \|\| "",\ndiplomaWhen: responses\.diplomaWhen \|\| ""/);
});

test("4 — le lot 65 corrige la date de vérification et pose la fenêtre de Pearson", () => {
  assert.equal(LOT65.length, 1);
  const [p] = LOT65;
  assert.equal(p.collection, "scholarships");
  assert.equal(p.id, "lester-b-pearson-international-scholarship");
  assert.deepEqual(p.attendu, { verifieLe: "6 novembre 2026" });
  assert.deepEqual(p.champs, { verifieLe: "2026-09-19", anneeBacMin: 2026 });
  assert.ok(p.motif.length > 100);
});

// ------------------------------------------------------------------
// 5. La lettre dit des faits exacts
// ------------------------------------------------------------------

test("5 — une bachelière : Fitz reçoit sa moyenne DU BAC, nommée, et pas une autre", () => {
  const profil = { lastDegree: "Baccalauréat (obtenu)", bacAverage: "12,20", bacAverageScale: "20", academicAverage: "14", academicAverageScale: "20" };
  const { user } = buildPrompt("letter", { style: "Personnalisé", university: "ALU", profile: profil });
  const moyennes = user.split("\n").filter((l) => /Moyenne/.test(l));
  assert.deepEqual(moyennes, ["Moyenne au baccalauréat : 12,20 (sur 20)"]);
  const licence = buildPrompt("letter", { style: "Académique", profile: { palier: "licence_obtenue", academicAverage: "14", academicAverageScale: "20", bacAverage: "12" } }).user;
  assert.match(licence, /Moyenne générale du cursus supérieur : 14 \(sur 20\)\nMoyenne au baccalauréat : 12/);
});

test("5 — la lettre n'embellit ni un niveau ni un chiffre", () => {
  const { system } = buildPrompt("letter", { style: "Personnalisé", profile: {} });
  assert.match(system, /« intermédiaire » ne devient pas « avancé »/);
  assert.match(system, /Ce qui n'est pas dans les données n'est pas dans la lettre\./);
});

test("5 — une candidature sans pays prend celui de son université, jamais celui du profil", () => {
  for (const f of ["ai-letter.js", "ai-email.js"]) {
    const js = sansCommentaires(lire(f));
    assert.match(js, /if \(pays\) fieldCountry\.value = pays;\nelse if \(app\.universityId\) completerPaysDepuisCatalogue\(app\);/, f);
    const fn = js.slice(js.indexOf("function completerPaysDepuisCatalogue"), js.indexOf("function verrouillerUniversite"));
    assert.match(fn, /fieldCountry\.value = "";/, `${f} : vide plutôt que faux`);
    assert.match(fn, /documentDuCatalogue\("universities", app\.universityId\)/, f);
    assert.match(fn, /application === app/, `${f} : une réponse tardive ne s'applique pas à une autre candidature`);
  }
});

// ------------------------------------------------------------------
// 6. L'écart entre diagnostic et profil se dit
// ------------------------------------------------------------------

test("6 — les trois écarts qui changent les propositions sont nommés", () => {
  const profil = { desiredDegree: "Licence", desiredField: "Psychologie", preferredCountries: ["Chine", "Malaisie", "Roumanie"] };
  const reponses = { currentLevel: "Licence obtenue", targetLevel: "Master", studyCategory: "Économie", destinationCountry: "France" };
  assert.deepEqual(ecartsDiagnosticProfil(profil, reponses).map((e) => e.champ), ["desiredDegree", "desiredField", "preferredCountries"]);
  assert.deepEqual(ecartsDiagnosticProfil({ desiredDegree: "Master", desiredField: "economie", preferredCountries: ["France"] }, reponses), [], "accents et casse ne font pas un écart");
  assert.deepEqual(ecartsDiagnosticProfil({}, reponses), [], "une case vide n'est pas un écart : le diagnostic la remplit");
  assert.deepEqual(ecartsDiagnosticProfil(profil, { ...reponses, destinationCountry: "Je ne sais pas encore" }).map((e) => e.champ), ["desiredDegree", "desiredField"]);
});

test("6 — la page de résultats les montre, sans rien écrire à la place de l'étudiant", () => {
  const html = lire("results.html");
  assert.match(html, /<div class="ecart-profil" id="ecartProfil" role="status" hidden>/);
  assert.match(html, /Votre espace suit votre profil/);
  assert.match(html, /<a href="profile\.html" class="btn btn-secondary btn-sm"><span>Mettre mon profil à jour<\/span>/);
  const js = sansCommentaires(lire("results.js"));
  assert.match(js, /li\.append\(nom, `\$\{e\.diagnostic\} dans ce diagnostic, \$\{e\.profil\} dans votre profil\.`\);/);
  assert.ok(!/innerHTML[^;]*e\.diagnostic/.test(js), "les valeurs saisies ne passent jamais par innerHTML");
});
