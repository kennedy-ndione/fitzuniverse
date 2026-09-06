/**
 * ============================================================
 * test/candidature-catalogue.test.mjs — la candidature dit-elle ce que
 * dit le catalogue ?
 * ============================================================
 *
 * Le défaut d'origine (passe espace étudiant 1/3, 2026-09-06) : une
 * candidature porte sa bourse en texte et sa date en ISO gelé. Le
 * lot 38 a fermé des cycles que l'espace continuait d'annoncer
 * « Échéance dans N j ». Ces tests verrouillent la liaison (jamais
 * approximative) et l'état rendu (jamais recalculé à la main).
 * ============================================================
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  indexerCatalogue,
  lierCandidature,
  etatDeLaCandidature,
  normaliserTitre
} from "../js/candidature-catalogue.js";

const LE_JOUR = new Date("2026-09-06T12:00:00Z");

function catalogue() {
  return {
    universites: [
      { id: "u-berlin", name: "Université Humboldt de Berlin" },
      { id: "u-munich", name: "Université de Munich" },
      { id: "u-paris", name: "Sorbonne Université" }
    ],
    bourses: [
      { id: "daad", title: "DAAD Study Scholarships", status: "Ouverte", isActive: true, echeanceVariable: "pays", verifieLe: "2026-09-05" },
      { id: "eiffel", title: "Eiffel Excellence Scholarship", status: "Fermée", isActive: true, periodeOuverture: "octobre" },
      { id: "retiree", title: "Bourse retirée", status: "Ouverte", isActive: false },
      { id: "simple", title: "Bourse Simple", status: "Ouverte", isActive: true, verifieLe: "2026-09-01" },
      { id: "sans-verif", title: "Bourse sans vérification", status: "Ouverte", isActive: true }
    ],
    programmes: [
      { id: "p-daad-berlin", universityId: "u-berlin", scholarshipId: "daad", status: "Ouverte", deadline: "15 octobre 2026" },
      { id: "p-daad-munich", universityId: "u-munich", scholarshipId: "daad", status: "Ouverte", deadline: "30 novembre 2026" },
      { id: "p-eiffel-a", universityId: "u-paris", scholarshipId: "eiffel", status: "Fermée", deadline: "Cycle 2026 clos le 8 janvier 2026" },
      { id: "p-retiree", universityId: "u-paris", scholarshipId: "retiree", status: "Ouverte", deadline: "1er décembre 2026" },
      { id: "p-simple-l", universityId: "u-paris", scholarshipId: "simple", status: "Ouverte", deadline: "20 octobre 2026" },
      { id: "p-simple-m", universityId: "u-paris", scholarshipId: "simple", status: "Ouverte", deadline: "20 octobre 2026" },
      { id: "p-sans-verif", universityId: "u-berlin", scholarshipId: "sans-verif", status: "Ouverte", deadline: "1er novembre 2026" }
    ]
  };
}

const index = indexerCatalogue(catalogue());

test("normaliserTitre : minuscules, sans accents, espaces compactés", () => {
  assert.equal(normaliserTitre("  Bourse  Émile-Boutmy "), "bourse emile-boutmy");
  assert.equal(normaliserTitre(""), "");
  assert.equal(normaliserTitre(null), "");
});

// ---- 1. Liaison par la clé déjà écrite
test("1. scholarshipId présent → source « champ », programId repris tel quel", () => {
  const lien = lierCandidature({ scholarshipId: "daad", programId: "p-daad-berlin", scholarship: "n'importe quoi" }, index);
  assert.deepEqual(lien, { scholarshipId: "daad", programId: "p-daad-berlin", source: "champ", ambigu: false });
});

// ---- 2. Déduction université + titre
test("2. université + titre exacts → LE programme est résolu (« deduit »)", () => {
  const lien = lierCandidature({ university: "université humboldt de BERLIN", scholarship: "DAAD Study Scholarships" }, index);
  assert.equal(lien.source, "deduit");
  assert.equal(lien.scholarshipId, "daad");
  assert.equal(lien.programId, "p-daad-berlin");
  assert.equal(lien.ambigu, false);
});

test("2 bis. bourse reconnue mais université inconnue → la bourse seule", () => {
  const lien = lierCandidature({ university: "Université inconnue", scholarship: "DAAD Study Scholarships" }, index);
  assert.equal(lien.source, "deduit");
  assert.equal(lien.scholarshipId, "daad");
  assert.equal(lien.programId, null);
});

test("un titre approchant ne rapproche rien — jamais d'approximation", () => {
  const lien = lierCandidature({ university: "Université de Munich", scholarship: "DAAD Study Scholarship" }, index);
  assert.equal(lien.source, "aucun");
  assert.equal(lien.scholarshipId, null);
});

test("un titre vide ne rapproche rien", () => {
  assert.equal(lierCandidature({ university: "Sorbonne Université", scholarship: "" }, index).source, "aucun");
});

// ---- 3. Ambiguïté
test("3. deux programmes possibles → ambigu, aucun lien", () => {
  const lien = lierCandidature({ university: "Sorbonne Université", scholarship: "Bourse Simple" }, index);
  assert.equal(lien.source, "aucun");
  assert.equal(lien.ambigu, true);
  assert.equal(lien.scholarshipId, null);
  assert.equal(lien.programId, null);

  const r = etatDeLaCandidature({ university: "Sorbonne Université", scholarship: "Bourse Simple", deadline: "2026-10-20" }, index, LE_JOUR);
  assert.equal(r.lie, false, "une liaison ambiguë n'affiche pas l'état d'une bourse au hasard");
});

// ---- 4. Retrait volontaire
test("4. isActive:false → ton « close », jours null, jamais « dans N j »", () => {
  const r = etatDeLaCandidature({ scholarshipId: "retiree", programId: "p-retiree", deadline: "2026-12-01" }, index, LE_JOUR);
  assert.equal(r.lie, true);
  assert.equal(r.etat.ton, "close");
  assert.equal(r.etat.jours, null);
  assert.doesNotMatch(r.etat.detail, /reste \d+ jour/);
});

// ---- 5 & 6. echeanceVariable
test("5. echeanceVariable « pays » AVEC programId → la date ferme du programme", () => {
  const r = etatDeLaCandidature({ scholarshipId: "daad", programId: "p-daad-berlin" }, index, LE_JOUR);
  assert.equal(r.etat.ouvert, true);
  assert.equal(r.etat.valeur, "15 octobre 2026");
  assert.equal(r.etat.jours, 39);
  assert.equal(r.dateCatalogue, "2026-10-15");
  assert.equal(r.divergence, null);
});

test("6. echeanceVariable « pays » SANS programId (plusieurs échéances) → « Selon votre pays », jours null", () => {
  const r = etatDeLaCandidature({ scholarshipId: "daad" }, index, LE_JOUR);
  assert.equal(r.etat.ouvert, true);
  assert.equal(r.etat.valeur, "Selon votre pays");
  assert.equal(r.etat.jours, null);
  assert.equal(r.dateCatalogue, null);
});

test("6 bis. date ferme saisie sur une bourse variable sans programme → divergence « date_variable »", () => {
  const r = etatDeLaCandidature({ scholarshipId: "daad", deadline: "2026-10-15" }, index, LE_JOUR);
  assert.equal(r.divergence.type, "date_variable");
  assert.equal(r.divergence.dateCatalogue, null);
  assert.match(r.divergence.message, /votre pays/);
});

// ---- 7. Divergence de date
test("7. la date de l'étudiant diffère de la date ferme du catalogue → « date_differente » avec l'ISO", () => {
  const r = etatDeLaCandidature({ scholarshipId: "daad", programId: "p-daad-berlin", deadline: "2026-10-10" }, index, LE_JOUR);
  assert.equal(r.divergence.type, "date_differente");
  assert.equal(r.divergence.dateCatalogue, "2026-10-15");
  assert.match(r.divergence.message, /15 octobre 2026/);
  assert.match(r.divergence.message, /10 octobre 2026/);
});

test("7 bis. même date → aucune divergence", () => {
  const r = etatDeLaCandidature({ scholarshipId: "daad", programId: "p-daad-berlin", deadline: "2026-10-15" }, index, LE_JOUR);
  assert.equal(r.divergence, null);
});

// ---- 8. Cycle clos
test("8. cycle clos alors que l'étudiant porte une date future → « cycle_clos », aucune date à reprendre", () => {
  const r = etatDeLaCandidature({ scholarshipId: "eiffel", programId: "p-eiffel-a", deadline: "2027-01-08" }, index, LE_JOUR);
  assert.equal(r.etat.ouvert, false);
  assert.equal(r.etat.ton, "close");
  assert.equal(r.divergence.type, "cycle_clos");
  assert.equal(r.divergence.dateCatalogue, null);
  assert.match(r.divergence.message, /clos/);
});

test("8 bis. cycle clos et date étudiante déjà passée → rien à signaler", () => {
  const r = etatDeLaCandidature({ scholarshipId: "eiffel", programId: "p-eiffel-a", deadline: "2026-01-08" }, index, LE_JOUR);
  assert.equal(r.etat.ton, "close");
  assert.equal(r.divergence, null);
});

// ---- 9. Hors catalogue
test("9. candidature hors catalogue → lie:false, etat:null, divergence:null", () => {
  const r = etatDeLaCandidature({ university: "MIT", scholarship: "Bourse maison", deadline: "2026-12-31" }, index, LE_JOUR);
  assert.deepEqual({ lie: r.lie, etat: r.etat, divergence: r.divergence }, { lie: false, etat: null, divergence: null });
  assert.equal(r.lien.source, "aucun");
});

test("9 bis. scholarshipId écrit mais absent du catalogue → non liée, sans erreur", () => {
  const r = etatDeLaCandidature({ scholarshipId: "disparue" }, index, LE_JOUR);
  assert.equal(r.lie, false);
  assert.equal(r.lien.source, "champ");
});

// ---- 10. Vérifié le
test("10. bourse sans verifieLe → aucune mention « Vérifié le » ; avec → la mention", () => {
  const sans = etatDeLaCandidature({ scholarshipId: "sans-verif", programId: "p-sans-verif" }, index, LE_JOUR);
  assert.equal(sans.etat.verifie, "");

  const avec = etatDeLaCandidature({ scholarshipId: "daad", programId: "p-daad-berlin" }, index, LE_JOUR);
  assert.equal(avec.etat.verifie, "Vérifié le 5 septembre 2026");
});

test("indexerCatalogue : deux bourses au même titre ne sont plus désignables par ce titre", () => {
  const c = catalogue();
  c.bourses.push({ id: "daad-bis", title: "daad study scholarships", status: "Ouverte", isActive: true });
  const idx = indexerCatalogue(c);
  const lien = lierCandidature({ university: "Université de Munich", scholarship: "DAAD Study Scholarships" }, idx);
  assert.equal(lien.source, "aucun");
  assert.equal(lien.ambigu, true);
});

test("un programId qui ne correspond plus à rien retombe sur la vue d'ensemble", () => {
  const r = etatDeLaCandidature({ scholarshipId: "daad", programId: "p-disparu" }, index, LE_JOUR);
  assert.equal(r.lie, true);
  assert.equal(r.programme, null);
  assert.equal(r.etat.valeur, "Selon votre pays");
});

/* ------------------------------------------------------------------
 * Les consommateurs de `app.echeance` : la prochaine action et le radar
 * ------------------------------------------------------------------ */

import { prochaineAction } from "../js/next-action.js";
import { radarEcheances } from "../js/journey-map.js";

function etapes(faites = []) {
  return [
    { id: "profile", label: "Profil complété", href: "profile.html" },
    { id: "checklist", label: "Dossier de candidature", action: "focus-checklist" },
    { id: "letter", label: "Lettre de motivation", href: "ai-letter.html" },
    { id: "readiness", label: "Vérifiée par Fitz", action: "run-readiness" }
  ].map((e) => ({ ...e, done: faites.includes(e.id) }));
}

test("prochaineAction : un cycle clos n'est jamais « pressé », même avec une date étudiante à 2 jours", () => {

  const app = {
    id: "slot-1", university: "Sorbonne Université", scholarship: "Eiffel Excellence Scholarship",
    deadline: "2026-09-08", status: "a_preparer", etapes: etapes(["profile"])
  };
  app.echeance = etatDeLaCandidature({ ...app, scholarshipId: "eiffel", programId: "p-eiffel-a" }, index, LE_JOUR);

  const action = prochaineAction({ profileScore: 9, applications: [app], aujourdhui: LE_JOUR });

  assert.equal(action.cle, "cycle-clos:slot-1");
  assert.equal(action.urgence, "haute");
  assert.match(action.texte, /Le cycle de Eiffel Excellence Scholarship est clos/);
  assert.doesNotMatch(action.texte, /Il reste/);

});

test("prochaineAction : une vraie urgence sur un dossier ouvert passe avant le cycle clos", () => {

  const close = {
    id: "slot-1", university: "Sorbonne Université", scholarship: "Eiffel Excellence Scholarship",
    deadline: "2026-09-08", status: "a_preparer", etapes: etapes(["profile"])
  };
  close.echeance = etatDeLaCandidature({ ...close, scholarshipId: "eiffel", programId: "p-eiffel-a" }, index, LE_JOUR);

  const pressee = {
    id: "slot-2", university: "MIT", scholarship: "Bourse maison",
    deadline: "2026-09-08", status: "a_preparer", etapes: etapes(["profile"]), echeance: null
  };

  const action = prochaineAction({ profileScore: 9, applications: [close, pressee], aujourdhui: LE_JOUR });

  assert.equal(action.applicationId, "slot-2");
  assert.equal(action.urgence, "critique");

});

test("prochaineAction : la date ferme du catalogue l'emporte sur la date gelée de l'étudiant", () => {

  const app = {
    id: "slot-1", university: "Université Humboldt de Berlin", scholarship: "DAAD Study Scholarships",
    deadline: "2026-12-31", status: "a_preparer", etapes: etapes(["profile"])
  };
  app.echeance = etatDeLaCandidature({ ...app, scholarshipId: "daad", programId: "p-daad-berlin" }, index, LE_JOUR);

  const action = prochaineAction({ profileScore: 9, applications: [app], aujourdhui: LE_JOUR });

  assert.match(action.texte, /Il reste 39 jours/);

});

test("radarEcheances : le cycle clos sort du radar, la date du catalogue prime, le hors catalogue reste", () => {

  const close = { id: "a", university: "Sorbonne", status: "a_preparer", deadline: "2026-09-08" };
  close.echeance = etatDeLaCandidature({ scholarshipId: "eiffel", programId: "p-eiffel-a", deadline: "2026-09-08" }, index, LE_JOUR);

  const daad = { id: "b", university: "Berlin", status: "a_preparer", deadline: "2026-12-31" };
  daad.echeance = etatDeLaCandidature({ scholarshipId: "daad", programId: "p-daad-berlin", deadline: "2026-12-31" }, index, LE_JOUR);

  const horsCatalogue = { id: "c", university: "MIT", status: "a_preparer", deadline: "2026-09-16", echeance: null };

  const radar = radarEcheances([close, daad, horsCatalogue], 3, LE_JOUR);

  assert.deepEqual(radar.map((r) => r.app.id), ["c", "b"]);
  assert.equal(radar[0].jours, 10);
  assert.equal(radar[1].jours, 39);

});
