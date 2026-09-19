/**
 * ============================================================
 * test/fraicheur.test.mjs — une date vérifiée n'est pas une date lue
 * ============================================================
 *
 * LOT P5a (2026-09-19). La fondation du chantier « fraîcheur du
 * catalogue », décidé avec Charles : Fitz ne cherche pas sur le web
 * pour proposer une place — une bourse trouvée en ligne n'a ni
 * programId, ni portail vérifié, ni étapes, et firestore.rules la
 * refuse. C'est le CATALOGUE qu'on vérifie, chez Charles, et les
 * données validées descendent ensuite vers l'étudiant.
 *
 * LE PROBLÈME, MESURÉ. Le champ `deadline` n'est pas une date : 470
 * des 507 valeurs du catalogue sont des phrases entières (« La page
 * officielle affiche encore la date du 15 mars 2026… »).
 * analyserEcheance() en tire 92 dates — c'est de la LECTURE, pas une
 * vérification. Le site n'avait pourtant que deux niveaux : date
 * confirmée, ou pas. Impossible d'y loger un contrôle humain.
 *
 * CE LOT NE CHANGE RIEN À L'ÉCRAN AUJOURD'HUI, et c'est voulu : aucun
 * programme ne porte encore `deadlineISO`. On pose la fondation avant
 * les données, jamais l'inverse. Un test le prouve.
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
  etatEcheance,
  libelleFenetre,
  retenirOpportunites,
  JOURS_VALIDITE_VERIFICATION
} from "../js/recommend-programs.js";
import { carteFitz } from "../js/fitz-choisit.js";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(path.join(RACINE, f), "utf8").replace(/\r\n/g, "\n");

const CATALOGUE = JSON.parse(lire("assets/data/catalogue.json"));
const LE_JOUR = new Date("2026-09-19T12:00:00Z");

/* ---------------------------------------------------------------
   1. Trois niveaux, et un seul se prouve
   --------------------------------------------------------------- */

test("certitude 1 — une date ISO fraîchement vérifiée vaut « vérifiée »", () => {

  const etat = etatEcheance({ deadlineISO: "2027-03-15", ouverteVerifieeLe: "2026-09-10" }, LE_JOUR);

  assert.equal(etat.certitude, "verifiee");
  assert.equal(etat.ouverte, true);
  assert.equal(etat.jours, 177);
  assert.equal(etat.verifieLe, "2026-09-10");

});

test("certitude 2 — une vérification vieillit, et redevient une lecture", () => {

  // Sans ce garde-fou, le catalogue se déclarerait vérifié POUR
  // TOUJOURS sur un seul passage — exactement ce qui l'a rendu périmé.
  const perimee = etatEcheance({ deadlineISO: "2027-03-15", ouverteVerifieeLe: "2025-01-10" }, LE_JOUR);

  assert.equal(perimee.certitude, "lue", "un contrôle d'il y a un an n'est plus un contrôle");
  assert.equal(perimee.jours, 177, "la date, elle, reste bonne : c'est la CERTITUDE qui baisse");
  assert.equal(perimee.verifieLe, "");

  assert.equal(JOURS_VALIDITE_VERIFICATION, 90, "trois mois");

  // La frontière, des deux côtés.
  const jour = 86400000;
  const pile = new Date(LE_JOUR.getTime() - 90 * jour).toISOString().slice(0, 10);
  const veille = new Date(LE_JOUR.getTime() - 91 * jour).toISOString().slice(0, 10);
  assert.equal(etatEcheance({ deadlineISO: "2027-03-15", ouverteVerifieeLe: pile }, LE_JOUR).certitude, "verifiee");
  assert.equal(etatEcheance({ deadlineISO: "2027-03-15", ouverteVerifieeLe: veille }, LE_JOUR).certitude, "lue");

});

test("certitude 3 — la prose du catalogue reste une LECTURE, jamais une preuve", () => {

  const lue = etatEcheance({ deadline: "15 mars 2027" }, LE_JOUR);
  assert.equal(lue.certitude, "lue");
  assert.equal(lue.ouverte, true);

  const rien = etatEcheance({}, LE_JOUR);
  assert.equal(rien.certitude, "inconnue");

  // Un statut fermé ferme, quelle que soit la date ISO : une date
  // vérifiée ne rouvre pas une bourse que l'organisme a close.
  const fermee = etatEcheance({ status: "Fermée", deadlineISO: "2027-03-15" }, LE_JOUR);
  assert.equal(fermee.ouverte, false);

});

test("certitude 4 — une date ISO malformée n'est jamais devinée", () => {

  // Ce champ est écrit par un outil d'admin. S'il contient autre chose
  // qu'une date, on retombe sur la prose plutôt que d'inventer.
  for (const valeur of ["bientôt", "15/03/2027", "2027", "", null, "2027-13-45"]) {

    const etat = etatEcheance({ deadlineISO: valeur, deadline: "15 mars 2027" }, LE_JOUR);

    assert.equal(etat.certitude, "lue", `« ${valeur} » ne doit pas passer pour une date vérifiée`);

    // ET ON RETOMBE SUR LA PROSE, avec ses vrais jours. Sans ce
    // contrôle, une date ISO illisible produisait un NaN silencieux :
    // `NaN >= 0` vaut false, donc le programme était traité comme
    // FERMÉ et disparaissait des propositions. Trouvé par mutation —
    // le test d'origine ne regardait que la certitude, et passait.
    assert.equal(etat.jours, 177, `« ${valeur} » a écrasé la date lisible du catalogue`);
    assert.equal(etat.ouverte, true, `« ${valeur} » a fait passer un programme ouvert pour fermé`);

  }

});

/* ---------------------------------------------------------------
   2. Ce que l'étudiant lit
   --------------------------------------------------------------- */

test("phrase 1 — « vérifiée » se dit, et se distingue de « ouvertes »", () => {

  const loin = libelleFenetre({ certitude: "verifiee", jours: 180, dateConfirmee: true });
  assert.equal(loin.etat, "verifiee");
  assert.match(loin.texte, /Date limite vérifiée/);
  assert.match(loin.texte, /180 jours/);

  const proche = libelleFenetre({ certitude: "verifiee", jours: 33, dateConfirmee: true });
  assert.match(proche.texte, /il reste 33 jours/, "un délai court le dit, même vérifié");

  // Une date seulement LUE ne doit jamais emprunter ce mot.
  const lue = libelleFenetre({ certitude: "lue", jours: 180, dateConfirmee: true });
  assert.equal(lue.etat, "ouverte");
  assert.ok(!/vérifiée/.test(lue.texte),
    "dire « vérifiée » d'une date extraite d'un paragraphe serait exactement le mensonge qu'on corrige");

});

test("phrase 2 — la carte d'acceptation garde la certitude", () => {

  const carte = carteFitz({ universityName: "X", country: "Maroc", certitude: "verifiee", jours: 100, dateConfirmee: true });
  assert.equal(carte.certitude, "verifiee");

  const sans = carteFitz({ universityName: "X" });
  assert.equal(sans.certitude, "inconnue", "faute de preuve, jamais l'inverse");

});

test("feuille 1 — « vérifiée » se lit en vert, avec le token du projet", () => {

  for (const f of ["css/journey.css", "applications.css"]) {
    const css = lire(f);
    const bloc = css.slice(css.indexOf(".is-verifiee i,"));
    assert.match(bloc.slice(0, 200), /color:var\(--success-700\)/,
      `${f} : --success-700 est la SEULE valeur admise pour une icône porteuse de sens (css/base.css)`);
  }

});

/* ---------------------------------------------------------------
   3. La fondation ne change rien — aujourd'hui
   --------------------------------------------------------------- */

test("fondation 1 — sans données, le catalogue se comporte exactement comme hier", () => {

  // Aucun programme ne porte encore deadlineISO : l'outil d'admin (P5b)
  // n'existe pas. Si ce test rougit, c'est que le lot a changé ce
  // qu'il promettait de ne pas changer.
  const avecISO = CATALOGUE.programs.filter((p) => p.deadlineISO);
  assert.equal(avecISO.length, 0, "le catalogue n'a pas encore été vérifié : c'est P5b et P5c");

  let verifiees = 0;
  for (const p of CATALOGUE.programs) {
    if (etatEcheance(p, LE_JOUR).certitude === "verifiee") verifiees++;
  }
  assert.equal(verifiees, 0, "aucune date ne peut se dire vérifiée tant que personne n'a vérifié");

});

test("fondation 2 — mais le tri sait déjà quoi faire d'une date vérifiée", () => {

  // On sème une vérification sur un programme du catalogue et on
  // vérifie qu'il remonte. C'est ce que P5b produira, en vrai.
  const uni = new Map(CATALOGUE.universities.map((u) => [u.id, u]));
  const bo = new Map(CATALOGUE.scholarships.map((s) => [s.id, s]));

  const profile = {
    nationality: "Sénégal",
    desiredField: "Informatique",
    desiredDegree: "Master",
    languages: [{ code: "fr", level: "C1" }, { code: "en", level: "B2" }]
  };

  const avant = retenirOpportunites({ profile, programs: CATALOGUE.programs, universitiesById: uni, scholarshipsById: bo });
  assert.ok(avant.nombre > 1, "il faut plusieurs retenues pour que le tri veuille dire quelque chose");

  // La DERNIÈRE retenue — la moins bien placée — reçoit une date vérifiée.
  const derniere = avant.retenues[avant.retenues.length - 1];
  const semes = CATALOGUE.programs.map((p) => (
    p.universityId === derniere.universityId
      ? { ...p, deadlineISO: "2027-06-30", ouverteVerifieeLe: "2026-09-15" }
      : p
  ));

  const apres = retenirOpportunites({ profile, programs: semes, universitiesById: uni, scholarshipsById: bo });

  assert.equal(apres.retenues[0].universityId, derniere.universityId,
    "une date vérifiée doit remonter en tête : c'est la seule sur laquelle l'étudiant peut décider sans risque");
  assert.equal(apres.retenues[0].certitude, "verifiee");
  assert.equal(apres.retenues[0].verifieLe, "2026-09-15");

});
