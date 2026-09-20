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

test("phrase 1 bis — une date passée se dit au passé, et se compte en français", () => {

  // VU À L'ÉCRAN le 2026-09-19, sur les bourses ARES (fermées la
  // veille) : « Date limite vérifiée — il reste -2 jours pour
  // déposer ». proposable() écarte ces programmes des propositions,
  // donc la phrase n'apparaissait pas sur le hub — mais la carte
  // d'acceptation, elle, affiche une candidature DÉJÀ ACCEPTÉE, qui
  // peut très bien passer sa date pendant que l'étudiant la prépare.
  // C'est là qu'un étudiant l'aurait lue.
  assert.equal(libelleFenetre({ certitude: "verifiee", jours: -2, dateConfirmee: true }).etat, "passee");
  assert.match(libelleFenetre({ certitude: "verifiee", jours: -2, dateConfirmee: true }).texte, /dépassée — c'était il y a 2 jours/);
  assert.match(libelleFenetre({ certitude: "verifiee", jours: -1, dateConfirmee: true }).texte, /c'était hier/);

  assert.ok(!/-\d/.test(libelleFenetre({ certitude: "verifiee", jours: -47, dateConfirmee: true }).texte),
    "aucun nombre négatif ne doit atteindre une phrase écrite pour un étudiant");

  // Le jour même : « il reste 0 jours » est faux, et angoissant pour rien.
  assert.match(libelleFenetre({ certitude: "verifiee", jours: 0, dateConfirmee: true }).texte, /c'est aujourd'hui/);

  // Et l'accord du pluriel, des deux côtés.
  assert.match(libelleFenetre({ certitude: "verifiee", jours: 1, dateConfirmee: true }).texte, /il reste 1 jour pour/);
  assert.match(libelleFenetre({ certitude: "lue", jours: 1, dateConfirmee: true }).texte, /Il reste 1 jour pour/);

});

test("fuite 2 — l'admin ne publie plus son adresse dans le catalogue", () => {

  // MÊME DÉFAUT QUE admin/verification.js, MAIS PLUS ANCIEN : posé le
  // 2026-08-10 pour tracer une modification de portail, il écrivait
  // `auth.currentUser?.email` dans « universities » — collection en
  // LECTURE PUBLIQUE. L'adresse s'est retrouvée en clair dans
  // assets/data/catalogue.json, sur politecnico-di-milano-milan.
  // Trouvé en relisant l'instantané public après la campagne du 19.
  const js = lire("admin/firebase-admin.js").replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/[^\n]*$/gm, "");

  assert.ok(!/updatedBy:.*currentUser\?\.email/.test(js),
    "une adresse e-mail n'a rien à faire dans une collection en lecture publique");
  assert.match(js, /updatedBy: auth\.currentUser\?\.uid \|\| null/);

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

test("fondation 1 — toute date publiée comme vérifiée porte sa preuve", () => {

  // CE TEST A CHANGÉ DE SENS LE 2026-09-19, ET C'EST NORMAL.
  //
  // Écrit à P5a, il affirmait `avecISO.length === 0` : la fondation
  // était posée, aucune donnée ne l'occupait encore. P5b (l'outil
  // d'admin) puis P5c (la campagne) ont rempli le catalogue — donc
  // l'assertion d'origine devait rougir. Elle a rougi. La supprimer
  // aurait laissé un trou : on la remplace par SON INVERSE, qui
  // protège davantage.
  //
  // La règle : le mot « vérifiée » est le plus fort que ce site dise
  // à un étudiant. Aucun programme n'a le droit de le porter sans
  // les trois preuves — la date au format ISO, le jour de la
  // vérification, et la source (une adresse https + la phrase lue).
  // Une ligne écrite à la main dans Firestore, sans passer par
  // l'outil, échouera ici.

  const avecISO = CATALOGUE.programs.filter((p) => p.deadlineISO);
  assert.ok(avecISO.length > 0,
    "le catalogue a été vérifié à partir du 2026-09-19 : s'il n'en reste rien, l'export a perdu les champs");

  for (const p of avecISO) {
    const ou = `${p.scholarshipId} / ${p.universityId}`;

    assert.match(p.deadlineISO, /^\d{4}-\d{2}-\d{2}$/, `${ou} : deadlineISO doit être une date ISO nue`);
    assert.ok(!isNaN(new Date(`${p.deadlineISO}T00:00:00Z`).getTime()), `${ou} : date ISO impossible`);

    assert.match(String(p.ouverteVerifieeLe || ""), /^\d{4}-\d{2}-\d{2}$/,
      `${ou} : une date vérifiée sans JOUR de vérification ne peut pas périmer — elle se dirait vérifiée pour toujours`);

    const src = p.sourceVerification || {};
    assert.match(String(src.url || ""), /^https:\/\//, `${ou} : la source doit être une adresse https`);
    assert.ok(String(src.citation || "").trim().length > 0, `${ou} : sans la phrase lue, rien n'est vérifiable`);
    assert.ok(String(src.parUid || "").length > 0, `${ou} : on doit savoir QUI a validé`);
  }

  // LA FUITE DU 2026-09-19, GARDÉE FERMÉE PAR LA MESURE.
  // `programs` est en lecture publique (firestore.rules : allow read:
  // if true) et descend en clair dans assets/data/catalogue.json.
  // Deux fois en six semaines, une adresse e-mail d'admin s'y est
  // retrouvée. Aucun champ de traçabilité ne doit en contenir.
  for (const p of avecISO) {
    const trace = JSON.stringify(p.sourceVerification || {});
    assert.ok(!/[\w.+-]+@[\w-]+\.[\w.]+/.test(trace),
      `${p.scholarshipId} : une adresse e-mail dans un document en lecture publique`);
  }

  // Et le moteur doit les VOIR : une preuve que l'export n'a pas
  // gardé les champs sans que etatEcheance() les lise.
  // Un COMPTE ne suffirait pas : retirer les trois champs d'un
  // programme ferait baisser les deux côtés ensemble et le test
  // resterait vert. On interroge donc chaque programme par son id.
  for (const p of avecISO) {
    // On lit au JOUR DU TEST (2026-09-19), pas au jour de la
    // vérification : interroger le moteur à la date même de la
    // validation le rendrait forcément frais, et l'assertion ne
    // dirait plus rien. Ainsi, une vérification qui a vieilli
    // au-delà de JOURS_VALIDITE_VERIFICATION fait rougir ce test —
    // c'est le rappel que la campagne est à refaire.
    const lu = etatEcheance(p, LE_JOUR);
    assert.equal(lu.certitude, "verifiee",
      `${p.scholarshipId} / ${p.universityId} : écrit vérifié dans le catalogue, mais le moteur ne le lit pas ainsi (vérification périmée ou champ perdu à l'export)`);
    assert.equal(lu.verifieLe, p.ouverteVerifieeLe);
  }

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

  // ÉCRIT QUAND LE CATALOGUE ÉTAIT VIDE DE VÉRIFICATIONS, RELU LE
  // 2026-09-20 : la campagne P5c a rempli 82 programmes, donc la
  // retenue semée n'est plus la SEULE vérifiée — exiger la première
  // place lui ferait battre EPFL, vérifiée elle aussi et mieux
  // notée, ce que le tri refuse à raison (à certitude égale, le
  // score décide). Ce que le tri promet, et qu'on vérifie : toute
  // date vérifiée passe devant tout ce qui ne l'est pas.
  const rangSeme = apres.retenues.findIndex((r) => r.universityId === derniere.universityId);
  assert.ok(rangSeme >= 0, "la retenue semée doit rester retenue");
  const semee = apres.retenues[rangSeme];
  assert.equal(semee.certitude, "verifiee");
  assert.equal(semee.verifieLe, "2026-09-15");
  assert.ok(rangSeme < apres.retenues.length - 1,
    "une date vérifiée doit remonter : elle était dernière, elle ne peut pas le rester");
  for (const r of apres.retenues.slice(0, rangSeme)) {
    assert.equal(r.certitude, "verifiee",
      "une date vérifiée doit passer devant tout ce qui ne l'est pas : c'est la seule sur laquelle l'étudiant peut décider sans risque");
  }

});
