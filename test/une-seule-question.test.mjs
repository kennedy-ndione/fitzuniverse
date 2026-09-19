/**
 * ============================================================
 * test/une-seule-question.test.mjs — deux portes, une seule question
 * ============================================================
 *
 * LOT P3 (2026-09-19). Charles : « est-ce que, avant que l'étudiant
 * voie même la proposition de bourses et d'universités, Fitz lui
 * demande impérativement de remplir son profil d'abord ? »
 *
 * LA RÉPONSE ÉTAIT : oui pour le remplissage, non pour l'affichage.
 *
 *   applications.js:894   if (!profilPretPourFitz(profile).pret) return false;
 *   dashboard.js:507      if (profileScore < SEUIL && !opps.top.length)
 *
 * Le second est un ET. Le message « complétez d'abord votre profil »
 * n'apparaissait que si le score était bas ET que le catalogue n'avait
 * rien trouvé. Dès qu'une correspondance remontait — ce qui arrive
 * avec un profil très maigre — l'étudiant voyait des propositions et
 * un bouton « Voir cette proposition », profil incomplet. Le hub
 * montrait ce que Fitz refusait de retenir.
 *
 * Et les deux écrans disent maintenant CE QUI MANQUE : « complétez
 * votre profil » envoie l'étudiant chercher lui-même quel champ est
 * vide sur une page qui en compte plusieurs dizaines.
 *
 * Fins de ligne : tout fichier lu ici passe par .replace(/\r\n/g,"\n").
 * ============================================================
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { profilPretPourFitz, etatChoixFitz, CHAMPS_PROFIL_REQUIS } from "../js/fitz-choisit.js";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(path.join(RACINE, f), "utf8").replace(/\r\n/g, "\n");
const codeSeul = (f) => lire(f).replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/[^\n]*$/gm, "");

/** Le profil minimal que Fitz exige pour choisir. */
const COMPLET = {
  nationality: "Sénégal",
  desiredDegree: "Master",
  desiredField: "Informatique",
  languages: [{ code: "fr", level: "C1" }]
};

test("porte 1 — le hub interroge le MÊME garde que le remplissage", () => {

  const js = codeSeul("dashboard.js");

  assert.match(js, /import \{ profilPretPourFitz \} from "\.\/js\/fitz-choisit\.js"/);
  assert.match(js, /renderOpportunites\(opps, profilPretPourFitz\(profile\), \{/,
    "le hub doit recevoir le verdict du garde, pas un score de profil");

  // LE ET QUI OUVRAIT LA PORTE.
  assert.ok(!/profileScore < PROFILE_READY_THRESHOLD && !opps\.top\.length/.test(js),
    "l'ancien ET laissait passer les propositions dès que le catalogue trouvait quelque chose");

});

test("porte 2 — un profil incomplet ne voit AUCUNE proposition", () => {

  const js = codeSeul("dashboard.js");
  const debut = js.indexOf("function renderOpportunites");
  const bloc = js.slice(debut, debut + 1800);

  assert.match(bloc, /if \(!profil\.pret\) \{/);
  assert.match(bloc, /grid\.innerHTML = `<div class="jy-card jy-empty">/,
    "la grille doit porter une invitation à compléter, pas rester vide et muette");
  assert.match(bloc, /href="profile\.html"/,
    "et mener au profil : une consigne sans porte est une impasse");

  // Le `return` est ce qui empêche les cartes de se rendre en dessous.
  assert.match(bloc, /return;\n\n\}/,
    "sans ce retour, les propositions s'afficheraient quand même sous le message");

});

test("garde 1 — les quatre champs que Fitz exige, et leurs libellés", () => {

  assert.equal(profilPretPourFitz(COMPLET).pret, true);

  const cles = CHAMPS_PROFIL_REQUIS.map((c) => c.cle).sort();
  assert.deepEqual(cles, ["desiredDegree", "desiredField", "languages", "nationality"]);

  // Les libellés sont montrés À L'ÉTUDIANT : ils doivent être lisibles,
  // pas des noms de champs.
  for (const champ of CHAMPS_PROFIL_REQUIS) {
    assert.ok(!/[A-Z]/.test(champ.libelle.slice(1)) || champ.libelle.includes(" "),
      `« ${champ.libelle} » ressemble à un nom de champ, pas à du français`);
  }

});

test("garde 2 — une langue déclarée « je ne la parle pas » ne compte pas", () => {

  // Lot R16 : le tableau est plein, et pourtant aucune langue n'est
  // parlée. Un tableau non vide ne suffit donc plus.
  const muet = { ...COMPLET, languages: [{ code: "en", level: "aucun" }] };
  const verdict = profilPretPourFitz(muet);

  assert.equal(verdict.pret, false);
  assert.deepEqual(verdict.manquants, ["au moins une langue"]);

});

test("phrase 1 — les deux écrans NOMMENT ce qui manque", () => {

  const verdict = profilPretPourFitz({ desiredField: "Informatique", languages: [{ code: "fr", level: "C1" }] });

  assert.deepEqual(verdict.manquants, ["votre nationalité", "le niveau visé"]);

  const ligne = etatChoixFitz({ quota: 6, nombre: 0, profilPret: false, manquants: verdict.manquants });

  assert.match(ligne.texte, /Il manque votre nationalité et le niveau visé/,
    "« et » avant le dernier élément : une phrase, pas une liste de formulaire");
  assert.match(ligne.texte, /Fitz choisira vos 6 universités/);
  assert.equal(ligne.lienProfil, true);

});

test("phrase 2 — sans liste de manquants, l'ancienne phrase tient encore", () => {

  // Non-régression : un appelant qui ne passe pas `manquants` ne doit
  // pas produire « Il manque  : … ».
  const ligne = etatChoixFitz({ quota: 1, nombre: 0, profilPret: false });

  assert.match(ligne.texte, /^Complétez votre profil : Fitz choisira votre université/);
  assert.ok(!/Il manque/.test(ligne.texte));

});

test("phrase 3 — applications.js passe le verdict entier, pas juste le oui/non", () => {

  const js = codeSeul("applications.js");

  assert.match(js, /const verdictProfil = profilPretPourFitz\(profile\);/);
  assert.match(js, /manquants: verdictProfil\.manquants/,
    "sans cette clé, la carte redit « complétez votre profil » pendant que le hub nomme les champs");

});

test("phrase 4 — les autres états de la ligne de choix sont intacts", () => {

  assert.equal(etatChoixFitz({ quota: 6, nombre: 6, profilPret: true }).code, "complet");
  assert.equal(etatChoixFitz({ quota: 6, nombre: 6, profilPret: true, reponses: 6 }).code, "reponses");
  assert.equal(etatChoixFitz({ quota: 6, nombre: 2, profilPret: true }).code, "aucune");
  assert.equal(etatChoixFitz({ quota: 0, nombre: 0, profilPret: true }), null);

});
