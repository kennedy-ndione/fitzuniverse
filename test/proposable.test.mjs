/**
 * ============================================================
 * test/proposable.test.mjs — on ne propose que ce qu'on peut faire
 * ============================================================
 *
 * LOT P1 (2026-09-19). Deux choses, mesurées sur le catalogue réel
 * avant d'écrire une ligne.
 *
 * 1. LE FILTRE DE LANGUE ÉCARTAIT 481 PROGRAMMES SUR 507.
 *    `String({code:"fr"})` vaut "[object Object]" : le test
 *    d'appartenance était faux pour tout programme déclarant une
 *    langue, et pour tout étudiant. Un Sénégalais français C1 +
 *    anglais B2 recevait 2 opportunités là où le catalogue en porte
 *    10 — alors qu'un Forfait Conseiller a SIX places à remplir.
 *
 * 2. UNE BOURSE FERMÉE FERMAIT SES PROGRAMMES — ET PERSONNE NE LE
 *    VÉRIFIAIT. Décision de Charles :
 *    « je ne veux pas que tu proposes à un étudiant une bourse ou une
 *    université qui est fermée, ou dont la date d'échéance est à moins
 *    de deux semaines… il faut donner du temps à l'étudiant, peut-être
 *    qu'il n'a pas encore les documents nécessaires. »
 *    Le plancher a été porté à TRENTE jours après mesure : le passage
 *    de 14 à 30 ne coûte que 9 programmes sur 87, et deux semaines ne
 *    couvrent pas le délai d'un traducteur assermenté.
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
  proposable,
  statutDitFerme,
  langueCompatible,
  retenirOpportunites,
  JOURS_MINIMUM_POUR_DEPOSER
} from "../js/recommend-programs.js";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(path.join(RACINE, f), "utf8").replace(/\r\n/g, "\n");

// Le catalogue RÉEL du site, pas un jeu d'essai : les défauts corrigés
// ici ne se voyaient que sur lui.
const CATALOGUE = JSON.parse(lire("assets/data/catalogue.json"));
const UNIVERSITES = new Map(CATALOGUE.universities.map((u) => [u.id, u]));
const BOURSES = new Map(CATALOGUE.scholarships.map((s) => [s.id, s]));

/** Un profil africain type, dans la forme que profile.js écrit vraiment. */
const SENEGALAIS = {
  nationality: "Sénégal",
  country: "Sénégal",
  desiredField: "Informatique",
  desiredDegree: "Master",
  languages: [{ code: "fr", level: "C1" }, { code: "en", level: "B2" }]
};

/* ---------------------------------------------------------------
   1. La langue — le bug à 481 programmes
   --------------------------------------------------------------- */

test("langue 1 — un profil moderne ({code, level}) reconnaît sa langue", () => {

  // LE CAS EXACT DU BUG : l'objet, pas la chaîne.
  assert.equal(langueCompatible({ language: "Anglais" }, SENEGALAIS), true);
  assert.equal(langueCompatible({ language: "Français" }, SENEGALAIS), true);
  assert.equal(langueCompatible({ language: "Français / Anglais selon la formation" }, SENEGALAIS), true);

  assert.equal(langueCompatible({ language: "Japonais (JLPT N2 exigé)" }, SENEGALAIS), false,
    "un programme en japonais ne doit pas s'ouvrir pour autant");

});

test("langue 2 — les anciens profils, qui stockaient des chaînes, marchent encore", () => {

  const ancien = { languages: ["Français", "Anglais"] };
  assert.equal(langueCompatible({ language: "Anglais" }, ancien), true,
    "règle d'or du dépôt : un client existant ne perd rien");

});

test("langue 3 — « je ne parle pas cette langue » n'ouvre aucun programme", () => {

  // Lot R16 : une langue peut être enregistrée au niveau « aucun ».
  const refus = { languages: [{ code: "en", level: "aucun" }] };
  assert.equal(langueCompatible({ language: "Anglais" }, refus), null,
    "aucune langue pratiquée : on ne sait pas, et null n'exclut jamais — mais surtout on n'ouvre pas l'anglais");

  const melange = { languages: [{ code: "en", level: "aucun" }, { code: "fr", level: "C1" }] };
  assert.equal(langueCompatible({ language: "Anglais" }, melange), false,
    "il parle français, pas anglais : ce programme n'est pas pour lui");

});

test("langue 4 — la preuve par le catalogue : 481 programmes ne sont plus écartés", () => {

  let compatibles = 0;
  let incompatibles = 0;

  for (const programme of CATALOGUE.programs) {
    const verdict = langueCompatible(programme, SENEGALAIS);
    if (verdict === true) compatibles++;
    else if (verdict === false) incompatibles++;
  }

  // Avant le correctif : 26 compatibles, 481 incompatibles.
  assert.ok(compatibles > 400,
    `un francophone anglophone doit pouvoir accéder à l'essentiel du catalogue — ${compatibles} seulement`);
  assert.ok(incompatibles < 50,
    `${incompatibles} programmes écartés sur la langue : le bug « [object Object] » est revenu`);

});

/* ---------------------------------------------------------------
   2. Ce qu'on ne propose pas
   --------------------------------------------------------------- */

test("proposable 1 — le plancher est à trente jours, pas à deux semaines", () => {

  assert.equal(JOURS_MINIMUM_POUR_DEPOSER, 30,
    "décision de Charles après mesure : deux semaines ne couvrent pas le délai d'un traducteur assermenté");

});

test("proposable 2 — une échéance passée, un statut fermé, et le temps trop court", () => {

  const ouvert = { ouverte: true, jours: 90 };

  assert.equal(proposable({}, null, { ouverte: false, jours: null }).ok, false);
  assert.equal(proposable({}, null, { ouverte: false, jours: null }).raison, "echeance_passee");

  // CORRECTION DU RÉCIT (même jour). La première version de ce
  // commentaire annonçait « 61 programmes proposés malgré un statut
  // Fermée ». C'était faux : etatEcheance() teste déjà le statut du
  // PROGRAMME depuis bien avant ce lot, et ces 61 étaient déjà écartés.
  // La mesure fautive venait d'un script jetable qui avait réécrit
  // etatEcheance() sans cette ligne.
  // Ce contrôle-ci reste, comme FILET : statutDitFerme() teste /ferm/i,
  // plus large que le includes("fermé") historique. Zéro cas dans le
  // catalogue d'aujourd'hui.
  assert.equal(proposable({ status: "Fermée — campagne 2026-2027 achevée" }, null, ouvert).ok, false);
  assert.equal(proposable({ status: "Fermee sans accent" }, null, ouvert).ok, false,
    "c'est POUR ce cas-là que le filet existe : includes(\"fermé\") le laisserait passer");
  assert.equal(proposable({ status: "Fermée — campagne 2026-2027 achevée" }, null, ouvert).raison, "statut_ferme");

  // LE VRAI APPORT DE CE CONTRÔLE : une BOURSE fermée ferme tous ses
  // programmes. etatEcheance() ne connaît que le statut du PROGRAMME ;
  // celui de la bourse n'était lu nulle part. 13 programmes sur 507 le
  // sont, remesurés avec les modules du site.
  assert.equal(proposable({}, { status: "Fermée" }, ouvert).ok, false);
  assert.equal(proposable({}, { status: "Fermée" }, ouvert).raison, "bourse_fermee");

  // Le temps de réunir son dossier.
  assert.equal(proposable({}, null, { ouverte: true, jours: 29 }).ok, false);
  assert.equal(proposable({}, null, { ouverte: true, jours: 29 }).raison, "trop_tard");
  assert.equal(proposable({}, null, { ouverte: true, jours: 30 }).ok, true,
    "trente jours pile passent : le plancher est un minimum, pas une marge");

});

test("proposable 3 — une date illisible n'est jamais traitée comme trop tardive", () => {

  // 259 programmes ont une échéance écrite en prose. Leur refuser le
  // plancher reviendrait à inventer une échéance qu'on n'a pas lue.
  const verdict = proposable({ status: "Ouverte" }, null, { ouverte: null, jours: null });

  assert.equal(verdict.ok, true);
  assert.equal(verdict.dateConfirmee, false,
    "et la carte doit pouvoir le DIRE : « date non confirmée »");

});

test("proposable 4 — les quatorze orthographes de « Fermée » sont couvertes", () => {

  // Le champ status est écrit à la main : « Fermée », « Fermée — bando
  // 2026-2027 achevé », « Fermée — cycle 42 (2026-2027) achevé »…
  for (const valeur of [
    "Fermée",
    "Fermée — campagne 2026-2027 achevée",
    "Fermée — bando 2026-2027 achevé",
    "fermee",
    "FERMÉE"
  ]) {
    assert.equal(statutDitFerme(valeur), true, `« ${valeur} » doit fermer`);
  }

  // Un statut absent ne ferme rien : 81 programmes n'en portent aucun,
  // les écarter viderait le catalogue.
  assert.equal(statutDitFerme(""), false);
  assert.equal(statutDitFerme(null), false);
  assert.equal(statutDitFerme("Ouverte"), false);
  assert.equal(statutDitFerme("Ouverte — appel licence en cours"), false);

});

/* ---------------------------------------------------------------
   3. Le bout de la chaîne — ce que l'étudiant reçoit vraiment
   --------------------------------------------------------------- */

test("retenues 1 — aucune bourse fermée ne sort du moteur, sur le vrai catalogue", () => {

  const { retenues } = retenirOpportunites({
    profile: SENEGALAIS,
    programs: CATALOGUE.programs,
    universitiesById: UNIVERSITES,
    scholarshipsById: BOURSES
  });

  assert.ok(retenues.length > 0, "le moteur doit retenir quelque chose pour ce profil");

  for (const r of retenues) {
    const bourse = r.scholarshipId ? BOURSES.get(r.scholarshipId) : null;
    assert.ok(!statutDitFerme(bourse && bourse.status),
      `« ${r.scholarshipTitle} » est proposée alors que son statut dit fermée`);
    if (r.dateConfirmee) {
      assert.ok(r.jours >= JOURS_MINIMUM_POUR_DEPOSER,
        `« ${r.scholarshipTitle} » laisse ${r.jours} jours : moins que le plancher`);
    }
  }

});

test("retenues 2 — les dates confirmées passent AVANT celles qu'on n'a pas su lire", () => {

  const { retenues } = retenirOpportunites({
    profile: SENEGALAIS,
    programs: CATALOGUE.programs,
    universitiesById: UNIVERSITES,
    scholarshipsById: BOURSES
  });

  // Décision de Charles : « les proposer en dernier, date non
  // confirmée ». Aucune non confirmée ne doit précéder une confirmée.
  let vuNonConfirmee = false;
  for (const r of retenues) {
    if (!r.dateConfirmee) vuNonConfirmee = true;
    else assert.ok(!vuNonConfirmee,
      `« ${r.universityName} » a une date confirmée et passe après une date inconnue`);
  }

});

test("retenues 3 — le pays et la date confirmée voyagent avec la retenue", () => {

  const { retenues } = retenirOpportunites({
    profile: SENEGALAIS,
    programs: CATALOGUE.programs,
    universitiesById: UNIVERSITES,
    scholarshipsById: BOURSES
  });

  for (const r of retenues) {
    assert.equal(typeof r.dateConfirmee, "boolean",
      "la carte doit pouvoir dire « date non confirmée » sans redeviner la règle");
    assert.ok(typeof r.country === "string");
  }

  assert.ok(retenues.some((r) => r.country),
    "le pays est calculé depuis toujours — c'est l'affichage qui le jetait");

});

test("retenues 4 — la mesure qui a déclenché ce lot : de 2 à dix", () => {

  const { nombre } = retenirOpportunites({
    profile: SENEGALAIS,
    programs: CATALOGUE.programs,
    universitiesById: UNIVERSITES,
    scholarshipsById: BOURSES
  });

  // Avant : 2, pour une formule qui en accompagne jusqu'à 6. Ce
  // chiffre-là, lui, a été remesuré et tient : il vient du filtre de
  // langue, pas des filtres de fermeture.
  assert.ok(nombre >= 6,
    `un Forfait Conseiller a six places : le moteur n'en propose que ${nombre}`);

});
