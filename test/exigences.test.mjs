/**
 * ============================================================
 * test/exigences.test.mjs — 99 bourses avaient quelque chose à dire
 * ============================================================
 *
 * `exigences` était renseigné sur 99 bourses sur 156 et lu par personne.
 * Ces tests verrouillent le vocabulaire, la règle des trois valeurs, et
 * surtout la distinction qui empêche la faute la plus tentante : sur
 * onze codes, DEUX seulement sont des pièces à cocher.
 *
 * LE REJEU SUR LE CATALOGUE RÉEL (dernière section) est la leçon de la
 * passe 2 : un contrôle qui lit le code ne prouve rien — `scholarshipId`
 * existait et valait `null`. On passe donc le module sur les 156 bourses
 * de l'export et on compare aux effectifs MESURÉS.
 * ============================================================
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  EXIGENCES,
  ORDRE_FORMES,
  lireExigences,
  groupees,
  elementsDeDossier,
  elementsAAjouter,
  deposeParUnTiers,
  voiesHorsPortail,
  bilanExigences,
  VOIES_PAR_UN_TIERS,
  VOIES_PAR_SOI_MEME
} from "../js/exigences.js";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// ------------------------------------------------------------------
// La règle des trois valeurs
// ------------------------------------------------------------------

test("champ absent = INCONNU : rien à afficher, jamais « aucune exigence »", () => {

  assert.deepEqual(lireExigences({}), []);
  assert.deepEqual(lireExigences({ exigences: null }), []);
  assert.deepEqual(lireExigences(null), []);
  assert.deepEqual(lireExigences({ exigences: [] }), []);

  // Et surtout : rien à grouper, donc aucun bloc rendu par l'appelant.
  const g = groupees(lireExigences({}));
  assert.equal(ORDRE_FORMES.every((f) => g[f].length === 0), true);

});

test("un code inconnu est IGNORÉ, jamais rendu tel quel", () => {

  const codes = lireExigences({ exigences: ["admission_prealable", "nomination_par_ecole_bis", "inventé"] });

  assert.deepEqual(codes, ["admission_prealable"], "seul le code du vocabulaire survit");

});

test("une bourse dont TOUS les codes sont inconnus n'affiche rien", () => {

  assert.deepEqual(lireExigences({ exigences: ["zzz", "yyy"] }), []);

});

test("un code répété n'est compté qu'une fois", () => {

  assert.deepEqual(
    lireExigences({ exigences: ["projet_recherche", "projet_recherche"] }),
    ["projet_recherche"]
  );

});

// ------------------------------------------------------------------
// Les cinq formes
// ------------------------------------------------------------------

test("chaque code du vocabulaire a une forme connue, un libellé et une explication", () => {

  for (const [code, meta] of Object.entries(EXIGENCES)) {
    assert.ok(ORDRE_FORMES.includes(meta.forme), `${code} : forme « ${meta.forme} » hors vocabulaire`);
    assert.ok(meta.libelle && meta.libelle.length > 3, `${code} : libellé manquant`);
    assert.ok(meta.explication && meta.explication.length > 30, `${code} : explication trop courte pour servir`);
    if (meta.forme === "dossier") {
      assert.ok(meta.typeChecklist, `${code} : une exigence « dossier » doit porter son type de checklist`);
    } else {
      assert.equal(meta.typeChecklist, undefined, `${code} : seule une exigence « dossier » a un type de checklist`);
    }
  }

});

test("DEUX codes seulement deviennent des éléments de dossier", () => {

  const dossier = Object.entries(EXIGENCES).filter(([, m]) => m.forme === "dossier").map(([c]) => c);

  assert.deepEqual(dossier.sort(), ["certification_langue_requise", "lettres_recommandation"]);

});

test("les quatre voies de dépôt par un tiers sont reconnues comme telles", () => {

  const voies = ["candidature_via_etablissement", "candidature_via_ambassade", "nomination_autorite_nationale", "nomination_par_ecole"];

  for (const code of voies) {
    assert.equal(EXIGENCES[code].forme, "voie", code);
    assert.equal(deposeParUnTiers([code]), true, code);
  }

  assert.equal(deposeParUnTiers(["admission_prealable", "projet_recherche"]), false);
  assert.equal(deposeParUnTiers([]), false);
  assert.equal(deposeParUnTiers(null), false, "un appel sans tableau ne doit pas jeter");

});

// ------------------------------------------------------------------
// LOT DES PORTAILS DE BOURSE (2026-09-14) — « voie » ne veut plus dire
// « quelqu'un d'autre dépose »
// ------------------------------------------------------------------

test("dépôt par courriel ou par la poste : l'étudiant dépose BIEN lui-même", () => {

  // LE PIÈGE. `deposeParUnTiers` rendait « un code de forme voie
  // existe ». C'était juste tant que les cinq codes de cette forme
  // décrivaient tous une nomination par un tiers. Avec les deux codes
  // neufs, le candidat de la bourse FAO-Hongrie aurait lu « Vous ne
  // déposez pas vous-même » sur une bourse qu'il dépose lui-même par
  // courriel — et applications.js lui aurait demandé l'accusé de
  // réception de quelqu'un d'autre au lieu de sa preuve d'envoi.
  for (const code of ["depot_par_courriel", "depot_par_courrier"]) {
    assert.equal(EXIGENCES[code].forme, "voie", code);
    assert.equal(deposeParUnTiers([code]), false, `${code} : l'étudiant dépose lui-même`);
    assert.equal(voiesHorsPortail([code]).length, 1, code);
  }

  // Et l'inverse : une nomination par un tiers n'est pas un dépôt hors
  // portail, c'est un dépôt par quelqu'un d'autre.
  assert.equal(voiesHorsPortail(["candidature_via_ambassade"]).length, 0);
  assert.equal(voiesHorsPortail([]).length, 0);

  // Une bourse peut porter les deux : elle est alors déposée par un
  // tiers, ET on sait par quel canal.
  assert.equal(deposeParUnTiers(["nomination_par_ecole", "depot_par_courrier"]), true);

});

test("LA GARDE QUI COMPTE : tout code de forme « voie » est rangé d'un côté ou de l'autre", () => {

  // Sans elle, un code ajouté demain tomberait par défaut du mauvais
  // côté — et c'est exactement la faute que les deux codes du
  // 2026-09-14 ont failli introduire, en silence.
  const voie = Object.entries(EXIGENCES).filter(([, m]) => m.forme === "voie").map(([c]) => c).sort();
  const couverts = [...VOIES_PAR_UN_TIERS, ...VOIES_PAR_SOI_MEME].sort();

  assert.deepEqual(couverts, voie,
    "un code de forme « voie » n'est ni dans VOIES_PAR_UN_TIERS ni dans VOIES_PAR_SOI_MEME");

  // Aucun chevauchement : une voie est l'un OU l'autre.
  for (const code of VOIES_PAR_SOI_MEME) {
    assert.ok(!VOIES_PAR_UN_TIERS.includes(code), `${code} est dans les deux listes`);
  }

  // Et les deux listes ne contiennent que des codes qui existent.
  for (const code of couverts) {
    assert.ok(EXIGENCES[code], `${code} est listé mais n'existe pas dans le vocabulaire`);
  }

});

test("le bilan remplace les comptes écrits en dur, et compte des BOURSES", () => {

  // L'en-tête du module portait « 27 bourses », « 56 bourses »… Justes
  // le jour de leur écriture, un peu plus faux à chaque lot. Ce bilan
  // se recalcule ; le test vérifie qu'il compte ce qu'il dit.
  const b = bilanExigences([
    { exigences: ["candidature_via_ambassade", "nomination_par_ecole"] },  // DEUX codes de forme voie
    { exigences: ["admission_prealable"] },
    { exigences: [] },
    { exigences: ["code_inconnu"] },
    {}
  ]);

  assert.equal(b.total, 5);
  assert.equal(b.avecChamp, 2, "une bourse sans code exploitable n'est pas « sans exigences », elle est inconnue");
  assert.equal(b.parForme.voie, 1, "deux codes de la même forme sur UNE bourse comptent pour une bourse");
  assert.equal(b.parForme.ordre, 1);
  assert.equal(b.parCode.candidature_via_ambassade, 1);
  assert.equal(b.parCode.nomination_par_ecole, 1);
  assert.equal(b.parCode.code_inconnu, undefined, "un code inconnu n'entre pas dans le bilan");

  assert.deepEqual(bilanExigences([]).parForme, { voie: 0, ordre: 0, condition: 0, piece: 0, dossier: 0 });
  assert.equal(bilanExigences(null).total, 0);

});

test("groupees range chaque code sous sa forme, sans en perdre", () => {

  const codes = ["admission_prealable", "candidature_via_ambassade", "projet_recherche", "lettres_recommandation", "diplome_recent"];
  const g = groupees(codes);

  assert.deepEqual(g.ordre.map((x) => x.code), ["admission_prealable"]);
  assert.deepEqual(g.voie.map((x) => x.code), ["candidature_via_ambassade"]);
  assert.deepEqual(g.piece.map((x) => x.code), ["projet_recherche"]);
  assert.deepEqual(g.dossier.map((x) => x.code), ["lettres_recommandation"]);
  assert.deepEqual(g.condition.map((x) => x.code), ["diplome_recent"]);

  assert.equal(ORDRE_FORMES.reduce((n, f) => n + g[f].length, 0), codes.length);

});

// ------------------------------------------------------------------
// La suggestion de dossier — suggérer, jamais écrire
// ------------------------------------------------------------------

test("elementsDeDossier ne rend que les deux codes cochables, avec leur type", () => {

  const codes = ["admission_prealable", "lettres_recommandation", "certification_langue_requise", "projet_recherche"];

  assert.deepEqual(elementsDeDossier(codes), [
    { label: "Lettres de recommandation", type: "recommendation", code: "lettres_recommandation" },
    { label: "Certification de langue", type: "language_test", code: "certification_langue_requise" }
  ]);

});

test("un type déjà présent au dossier n'est jamais proposé deux fois", () => {

  const codes = ["lettres_recommandation", "certification_langue_requise"];

  const checklist = [{ id: "x", type: "recommendation", label: "Pr. Diop", status: "en_cours" }];

  assert.deepEqual(elementsAAjouter(codes, checklist).map((e) => e.type), ["language_test"]);

});

test("quand tout est déjà là, il n'y a plus rien à proposer — le bouton disparaît", () => {

  const codes = ["lettres_recommandation", "certification_langue_requise"];

  const checklist = [
    { id: "a", type: "recommendation" },
    { id: "b", type: "language_test" }
  ];

  assert.deepEqual(elementsAAjouter(codes, checklist), []);

});

test("une checklist absente ou malformée ne fait pas disparaître les suggestions", () => {

  const codes = ["lettres_recommandation"];

  assert.equal(elementsAAjouter(codes, undefined).length, 1);
  assert.equal(elementsAAjouter(codes, null).length, 1);
  assert.equal(elementsAAjouter(codes, [null, {}]).length, 1);

});

test("une bourse sans exigences ne propose rien à ajouter", () => {

  assert.deepEqual(elementsAAjouter(lireExigences({}), []), []);

});

// ------------------------------------------------------------------
// LE REJEU SUR LE CATALOGUE RÉEL — par les valeurs, pas par les symboles
// ------------------------------------------------------------------

const catalogue = JSON.parse(fs.readFileSync(path.join(RACINE, "assets/data/catalogue.json"), "utf8"));

test("REJEU — les effectifs du catalogue réel sont exactement ceux mesurés", () => {

  const bourses = catalogue.scholarships;

  assert.equal(bourses.length, 156, "le catalogue a changé de taille — remesurer avant de toucher aux attendus");

  const avec = bourses.filter((b) => lireExigences(b).length > 0);
  const sans = bourses.filter((b) => lireExigences(b).length === 0);

  assert.equal(avec.length, 99, "99 bourses portent au moins une exigence exploitable");
  assert.equal(sans.length, 57, "57 bourses n'affichent RIEN — ni bloc vide, ni « aucune exigence »");

  const parCode = {};
  for (const b of bourses) for (const code of lireExigences(b)) parCode[code] = (parCode[code] || 0) + 1;

  assert.equal(parCode.admission_prealable, 56);
  assert.equal(parCode.projet_recherche, 11);
  assert.equal(parCode.certification_langue_requise, 10);
  assert.equal(parCode.candidature_via_etablissement, 10);
  assert.equal(parCode.nomination_autorite_nationale, 8);
  assert.equal(parCode.lettres_recommandation, 8);
  assert.equal(parCode.diplome_recent, 6);
  assert.equal(parCode.candidature_via_ambassade, 6);
  assert.equal(parCode.experience_pro_2ans, 5);
  assert.equal(parCode.directeur_these, 4);
  assert.equal(parCode.nomination_par_ecole, 3);

});

test("REJEU — 27 bourses ne se déposent PAS par l'étudiant lui-même", () => {

  const tiers = catalogue.scholarships.filter((b) => deposeParUnTiers(lireExigences(b)));

  assert.equal(tiers.length, 27, "c'est le chiffre qui justifie toute cette passe");

  // L'effectif d'abord : une assertion « aucun X » sur un ensemble vide
  // ne prouve rien (leçon de la passe 2).
  assert.ok(tiers.length > 0);
  for (const b of tiers) {
    assert.equal(groupees(lireExigences(b)).voie.length >= 1, true, b.title);
  }

});

test("REJEU — aucun code inconnu n'existe dans le catalogue, et aucun ne serait affiché", () => {

  const bruts = new Set();
  for (const b of catalogue.scholarships) for (const code of (b.exigences || [])) bruts.add(code);

  assert.ok(bruts.size > 0, "il y avait bien des codes à examiner");
  assert.equal(bruts.size, 11, "onze codes distincts dans les données");

  const inconnus = [...bruts].filter((code) => !EXIGENCES[code]);

  assert.deepEqual(inconnus, [], `codes hors vocabulaire : ${inconnus.join(", ")}`);

});

test("REJEU — 16 bourses proposent un élément de dossier, et jamais plus de deux", () => {

  const avecDossier = catalogue.scholarships.filter((b) => elementsDeDossier(lireExigences(b)).length > 0);

  assert.equal(avecDossier.length, 16);

  for (const b of avecDossier) {
    const e = elementsDeDossier(lireExigences(b));
    assert.ok(e.length <= 2, b.title);
    assert.ok(e.every((x) => x.type === "recommendation" || x.type === "language_test"), b.title);
  }

});

test("REJEU — les 57 bourses sans exigence ne produisent aucun bloc", () => {

  const sans = catalogue.scholarships.filter((b) => lireExigences(b).length === 0);

  assert.equal(sans.length, 57);

  for (const b of sans) {
    const g = groupees(lireExigences(b));
    assert.equal(ORDRE_FORMES.reduce((n, f) => n + g[f].length, 0), 0, b.title);
    assert.equal(deposeParUnTiers(lireExigences(b)), false, b.title);
    assert.deepEqual(elementsAAjouter(lireExigences(b), []), [], b.title);
  }

});
