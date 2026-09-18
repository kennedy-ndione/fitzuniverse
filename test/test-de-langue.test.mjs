/**
 * ============================================================
 * Lot R17 (2026-09-18) — LE TEST DE LANGUE, UNE QUESTION POSÉE UNE FOIS
 * ============================================================
 *
 * Charles, le 2026-09-18 : « pour la partie test de langue, il faut
 * revoir ce que l'étudiant doit renseigner de façon simple, parce que
 * même moi je n'ai pas compris ce que tu demandes réellement ».
 *
 * Sous la formulation, deux défauts autrement plus graves :
 *
 *  - DEUX ENDROITS posaient la même question, dans deux vocabulaires
 *    (`situationFrancais` à l'étape 1 de la route, `testLangue` au
 *    profil) sans rien pour les tenir d'accord ;
 *  - et « Mon profil » ÉCRASAIT la réponse de la route : il réécrivait
 *    le bloc `profile` entier à partir d'une liste de clés où
 *    `situationFrancais` ne figurait pas. Reproduit au banc d'essai le
 *    2026-09-18 : « test_prevu » avant, absente après un
 *    enregistrement de « Pour commencer ».
 *
 * CE QUE CE FICHIER GARDE :
 *
 *  1. LA BIJECTION entre les quatre états du profil et les quatre
 *     réponses de l'étape 1 — si l'une des deux listes bouge seule, les
 *     deux pages se remettent à dire des choses différentes ;
 *  2. UN TEST QUI N'ATTESTE PAS LE FRANÇAIS NE DIT RIEN DU FRANÇAIS :
 *     un IELTS déclaré ne doit pas écrire `situationFrancais`, sans
 *     quoi l'étape 1 de la route afficherait une réponse jamais donnée ;
 *  3. LES ANCIENS PROFILS SE LISENT ENCORE — « aucun » rangé dans
 *     `nature`, un score sans état, une date prévue seule ;
 *  4. LA PAGE N'ÉCRASE PLUS CE QU'ELLE NE CONNAÎT PAS : profile.js
 *     enregistre champ par champ, comme la route ;
 *  5. L'ORDRE DES QUESTIONS : l'état AVANT le nom du test — c'est tout
 *     le lot, et une remise en ordre « esthétique » le déferait ;
 *  6. UNE SEULE PORTE vers cette règle : js/profil-par-niveau.js ne
 *     réexporte rien, et les trois lecteurs pointent le nouveau module ;
 *  7. CHAQUE ÉTAT PORTE SON EXEMPLE (règle du lot R3).
 *
 * Preuves par mutation faites le 2026-09-18 :
 *   un cinquième état sans équivalent dans la route → tests 1 et 6 rouges ;
 *   la garde de langue retirée de situationFrancaisDepuisTest → test 2 ;
 *   la migration `nature === "aucun"` retirée de lireTestLangue → test 3 ;
 *   `updateDoc(userRef, { profile: updatedProfile })` remis → test 4 ;
 *   le <select> replacé avant les quatre cartes dans profile.html → test 5.
 *
 * Fins de ligne : tout fichier lu ici passe par .replace(/\r\n/g,"\n").
 * ============================================================
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import {
  ETATS_TEST_LANGUE, ETATS_AVEC_TEST, TESTS_DE_LANGUE, EXEMPLES_SCORE,
  lireTestLangue, testConnu, situationFrancaisDepuisTest, etatDepuisSituationFrancais, phraseTestLangue
} from "../js/test-de-langue.js";

import { QUESTIONS_SITUATION } from "../js/route-preinscription.js";
import * as parNiveau from "../js/profil-par-niveau.js";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(path.join(RACINE, f), "utf8").replace(/\r\n/g, "\n");
const codeSeul = (f) => lire(f)
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/^\s*\/\/.*$/gm, "")
  .replace(/<!--[\s\S]*?-->/g, "");

const questionFrancais = QUESTIONS_SITUATION.find((q) => q.cle === "situationFrancais");

// ------------------------------------------------------------------

test("test-langue 1 — les quatre états du profil et les quatre réponses de la route sont les mêmes", () => {

  assert.ok(questionFrancais, "l'étape 1 de la route ne pose plus la question du français");

  const cotéRoute = [...questionFrancais.options].sort();
  const cotéProfil = ETATS_TEST_LANGUE.map((e) => e.situationFrancais).sort();

  assert.deepEqual(cotéProfil, cotéRoute,
    "un état du profil n'a pas d'équivalent à l'étape 1 (ou l'inverse) : les deux pages se remettraient à dire des choses différentes");

  // Et la traduction va bien dans les deux sens, sans perte.
  for (const etat of ETATS_TEST_LANGUE) {
    assert.equal(etatDepuisSituationFrancais(etat.situationFrancais), etat.cle);
  }
  assert.equal(etatDepuisSituationFrancais(""), "");
  assert.equal(etatDepuisSituationFrancais("langue_maternelle"), "");

  // Les deux seuls états qui demandent QUEL test sont ceux qui en ont un.
  assert.deepEqual([...ETATS_AVEC_TEST].sort(), ["passe", "prevu"]);

});

test("test-langue 2 — un test qui n'atteste pas le français ne dit RIEN du français", () => {

  // LE CAS QUI COMPTE : l'étudiant déclare un IELTS. Son français reste
  // inconnu — écrire « a passé un test » lui mettrait dans la bouche,
  // à l'étape 1 de sa route France, une réponse qu'il n'a pas donnée.
  assert.equal(situationFrancaisDepuisTest({ etat: "passe", nature: "IELTS" }), "");
  assert.equal(situationFrancaisDepuisTest({ etat: "prevu", nature: "TOEFL" }), "");
  assert.equal(situationFrancaisDepuisTest({ etat: "passe", nature: "Duolingo" }), "");

  // Un test de français, lui, parle bien du français.
  assert.equal(situationFrancaisDepuisTest({ etat: "passe", nature: "TCF" }), "test_passe");
  assert.equal(situationFrancaisDepuisTest({ etat: "prevu", nature: "DELF" }), "test_prevu");

  // Les deux états sans test répondent d'eux-mêmes.
  assert.equal(situationFrancaisDepuisTest({ etat: "aucun" }), "aucun");
  assert.equal(situationFrancaisDepuisTest({ etat: "dispense" }), "etudes_en_francais");

  // Un état « passé » sans test choisi ne dit rien non plus.
  assert.equal(situationFrancaisDepuisTest({ etat: "passe", nature: "" }), "");
  assert.equal(situationFrancaisDepuisTest({}), "");
  assert.equal(situationFrancaisDepuisTest(), "");

  // Chaque test déclare la langue qu'il atteste : sans cette colonne, la
  // règle ci-dessus n'a rien pour trancher.
  for (const t of TESTS_DE_LANGUE) {
    assert.ok(["fr", "en"].includes(t.langue), `le test ${t.id} ne dit pas quelle langue il atteste`);
    assert.ok(EXEMPLES_SCORE[t.langue], `aucun exemple de score pour la langue ${t.langue}`);
  }

  // « Aucun test » a QUITTÉ la liste des tests : c'était un état déguisé.
  assert.equal(testConnu("aucun"), null);
  assert.equal(testConnu(""), null);

});

test("test-langue 3 — les profils d'avant ce lot se lisent encore", () => {

  // L'ancien « aucun test », rangé dans le champ du test.
  assert.deepEqual(lireTestLangue({ testLangue: { nature: "aucun" } }),
    { etat: "aucun", nature: "", score: "", date: "", prevuLe: "" });

  // Un test passé, sans état enregistré.
  assert.deepEqual(lireTestLangue({ testLangue: { nature: "IELTS", score: "6.5", date: "2026-05-02" } }),
    { etat: "passe", nature: "IELTS", score: "6.5", date: "2026-05-02", prevuLe: "" });

  // Un test prévu, sans état enregistré.
  assert.deepEqual(lireTestLangue({ testLangue: { nature: "TCF", prevuLe: "2026-11-15" } }),
    { etat: "prevu", nature: "TCF", score: "", date: "", prevuLe: "2026-11-15" });

  // Rien du tout reste rien du tout : aucun état n'est coché par défaut.
  for (const vide of [{}, { testLangue: null }, { testLangue: "IELTS" }]) {
    assert.deepEqual(lireTestLangue(vide), { etat: "", nature: "", score: "", date: "", prevuLe: "" });
  }

  // Un test inconnu du référentiel n'est pas inventé.
  assert.equal(lireTestLangue({ testLangue: { nature: "Cambridge", score: "B2" } }).nature, "");

  // Les phrases de lecture (fiche admin, prompts de Fitz).
  assert.equal(phraseTestLangue({ testLangue: { nature: "TCF", prevuLe: "2026-11-15" } }), "TCF prévu le 2026-11-15");
  assert.equal(phraseTestLangue({ testLangue: { nature: "IELTS", score: "6.5", date: "2026-05-02" } }), "IELTS : 6.5 (passé le 2026-05-02)");
  assert.equal(phraseTestLangue({ testLangue: { nature: "aucun" } }), "Aucun test de langue pour l'instant");
  assert.equal(phraseTestLangue({ testLangue: { etat: "dispense" } }), "Pas de test à passer : études faites en français");
  assert.equal(phraseTestLangue({}), "");

});

test("test-langue 4 — « Mon profil » n'écrase plus les champs qu'il ne connaît pas", () => {

  const page = codeSeul("profile.js");

  // L'écriture de map entière est PARTIE. C'est elle qui effaçait
  // `situationFrancais` à chaque enregistrement.
  assert.ok(!/updateDoc\(userRef,\s*\{\s*\n?\s*name:[^}]*profile:\s*updatedProfile/.test(page),
    "profile.js réécrit encore le bloc `profile` en entier : toute clé écrite ailleurs est effacée");

  // Et l'écriture champ par champ est LÀ, comme dans espace-preinscription.js.
  assert.ok(/for \(const \[cle, valeur\] of Object\.entries\(updatedProfile\)\) aEcrire\[`profile\.\$\{cle\}`\] = valeur;/.test(page),
    "profile.js n'écrit pas champ par champ");
  assert.ok(/updateDoc\(userRef, aEcrire\)/.test(page));

  // La clé partagée n'est posée QUE lorsque la réponse dit quelque chose.
  assert.ok(/if \(situation\) updated\.situationFrancais = situation;/.test(page),
    "profile.js écrit situationFrancais même quand la réponse n'en dit rien");

  // La route, elle, écrivait déjà champ par champ : c'est le modèle.
  assert.ok(/paths\[`profile\.\$\{k\}`\] = v;/.test(codeSeul("espace-preinscription.js")));

});

test("test-langue 5 — l'état est demandé AVANT le nom du test", () => {

  const html = codeSeul("profile.html");

  const etats = html.indexOf('id="testLangueEtatGroup"');
  const nature = html.indexOf('id="testLangueNature"');

  assert.ok(etats > -1 && nature > -1, "le bloc du test de langue a disparu de la page");
  assert.ok(etats < nature,
    "la page redemande « quel test ? » avant « où en êtes-vous ? » — c'est exactement le défaut du lot");

  // Le nom du test vit dans la partie qui ne s'ouvre qu'au besoin.
  const details = html.indexOf('id="testLangueDetails"');
  assert.ok(details > -1 && details < nature, "le nom du test n'est plus dans la partie conditionnelle");

  // Les quatre cartes sont rendues par profile.js depuis le module, pas
  // écrites à la main dans la page : deux listes dériveraient.
  assert.ok(!/name="testLangueEtat"/.test(html), "les états sont réécrits en dur dans profile.html");
  assert.ok(/ETATS_TEST_LANGUE/.test(codeSeul("profile.js")));

});

test("test-langue 6 — une seule porte vers cette règle, et chaque état porte son exemple", () => {

  // Aucune réexportation laissée derrière : une seconde porte vers la
  // même règle est la faute que ce lot paie (lots R5, R6, R7, R13, B2).
  for (const nom of ["TESTS_DE_LANGUE", "lireTestLangue", "phraseTestLangue"]) {
    assert.equal(parNiveau[nom], undefined, `js/profil-par-niveau.js exporte encore ${nom}`);
  }

  for (const fichier of ["profile.js", "js/ai/prompts.js", "admin/student-detail.js"]) {
    assert.ok(/from "[^"]*test-de-langue\.js"/.test(codeSeul(fichier)),
      `${fichier} lit le test de langue sans passer par js/test-de-langue.js`);
  }

  // Le diagnostic écrit la forme du jour, avec son état.
  assert.ok(/pose\("testLangue", \{ etat: "aucun"/.test(codeSeul("js/diagnostic-vers-profil.js")));

  // Chaque état porte une phrase ET son exemple — c'est l'exemple qui
  // rend la phrase compréhensible (règle du lot R3).
  assert.equal(ETATS_TEST_LANGUE.length, 4);
  for (const etat of ETATS_TEST_LANGUE) {
    assert.ok(etat.titre && etat.titre.trim().length > 12, `état « ${etat.cle} » sans phrase lisible`);
    assert.ok(etat.exemple && etat.exemple.trim().length > 20, `état « ${etat.cle} » sans exemple`);
  }

});
