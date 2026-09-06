/**
 * ============================================================
 * test/catalogue-vue.test.mjs — le catalogue a-t-il une fin ?
 * ============================================================
 *
 * Le défaut mesuré le 2026-09-06 : scholarships.html faisait 103 077 px
 * (≈ 113 écrans) pour 156 cartes. Ces tests verrouillent la règle qui
 * lui donne une fin — et surtout ses deux garde-fous : on ne coupe
 * jamais un pays en deux pour tomber juste, et une vue partielle DIT
 * qu'elle est partielle.
 * ============================================================
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  decouperVue,
  ligneEtendue,
  libelleVoirTout,
  CARTES_VISEES,
  MAX_PAR_PAYS
} from "../js/catalogue-vue.js";

const BOURSES = { un: "bourse", plusieurs: "bourses", accord: "e" };
const UNIS = { un: "établissement", plusieurs: "établissements", accord: "" };

/** Groupes factices : `pays(["Italie", 29], ["France", 4])`. */
function pays(...paires) {
  return paires.map(([country, n]) => ({
    country,
    items: Array.from({ length: n }, (_, i) => ({ id: `${country}-${i}` }))
  }));
}

// ---- La vue d'aperçu

test("l'aperçu remplit jusqu'au plafond puis s'arrête net, sans couper un pays", () => {

  // Réglage explicite : ce test décrit la RÈGLE, pas l'accordage mesuré
  // (CARTES_VISEES/MAX_PAR_PAYS, vérifiés séparément plus bas).
  const vue = decouperVue(pays(["Italie", 8], ["France", 6], ["Japon", 7], ["Maroc", 5]), { cible: 18, maxParPays: 12 });

  assert.equal(vue.mode, "apercu");
  assert.deepEqual(vue.groupes.map((g) => g.country), ["Italie", "France", "Japon"]);
  assert.equal(vue.affichees, 21, "8 + 6 = 14 < 18, donc le Japon entre ENTIER — on ne le coupe pas à 4");
  assert.equal(vue.groupes[2].items.length, 7, "le pays qui fait franchir le plafond entre entier ou pas du tout");
  assert.ok(vue.groupes.every((g) => !g.ecourte), "aucun de ces pays n'atteint le plafond par pays");
  assert.equal(vue.partielle, true, "le Maroc reste dehors");
  assert.equal(vue.total, 26);

});

test("un pays plus gros que le plafond par pays est écourté, et le dit", () => {

  const vue = decouperVue(pays(["Italie", 29], ["France", 4]), { cible: 18, maxParPays: 12 });

  assert.equal(vue.groupes[0].items.length, 12);
  assert.equal(vue.groupes[0].total, 29, "le total réel reste porté par le groupe");
  assert.equal(vue.groupes[0].ecourte, true);
  assert.equal(vue.groupes[1].country, "France", "12 + 4 tiennent encore sous 18");
  assert.equal(vue.affichees, 16);

});

test("un pays unique, plus gros que le plafond, s'écourte sans vider la page", () => {

  const vue = decouperVue(pays(["Italie", 40]));

  assert.equal(vue.groupes.length, 1);
  assert.equal(vue.affichees, MAX_PAR_PAYS);
  assert.equal(vue.partielle, true);

});

test("le dépassement du plafond est borné par le plafond PAR PAYS", () => {

  // Le pire cas : on est à 17 cartes (sous le plafond, donc on continue)
  // et le pays suivant en apporte 12. 29 est le maximum atteignable —
  // jamais un « et si le pays suivant en avait 60 ».
  const vue = decouperVue(pays(["A", 9], ["B", 8], ["C", 60], ["D", 5]), { cible: 18, maxParPays: 12 });

  assert.equal(vue.affichees, 29);
  assert.ok(vue.affichees <= 18 + 12, "borne haute garantie");
  assert.equal(vue.groupes[2].ecourte, true);
  assert.deepEqual(vue.groupes.map((g) => g.country), ["A", "B", "C"]);

});

test("un catalogue plus petit que le plafond s'affiche en entier, sans mention « sur »", () => {

  const vue = decouperVue(pays(["Italie", 5], ["France", 4]));

  assert.equal(vue.affichees, 9);
  assert.equal(vue.partielle, false);
  assert.equal(ligneEtendue(vue, BOURSES, { pays: 2 }), "9 bourses · 2 pays");

});

test("l'ordre reçu est conservé — ce module ne trie jamais", () => {

  const vue = decouperVue(pays(["Zambie", 3], ["Albanie", 3], ["France", 3]));

  assert.deepEqual(vue.groupes.map((g) => g.country), ["Zambie", "Albanie", "France"]);

});

// ---- Un pays choisi

test("un pays filtré est seul et ENTIER, plafond par pays compris", () => {

  const vue = decouperVue(pays(["Italie", 29], ["France", 4]), { paysFiltre: "Italie" });

  assert.equal(vue.mode, "pays");
  assert.equal(vue.groupes.length, 1);
  assert.equal(vue.groupes[0].items.length, 29, "on a demandé l'Italie : on veut les 29");
  assert.equal(vue.groupes[0].ecourte, false);
  assert.equal(vue.affichees, 29);
  assert.equal(vue.total, 33);

});

test("un pays filtré inconnu ne rend aucun groupe, sans erreur", () => {

  const vue = decouperVue(pays(["Italie", 3]), { paysFiltre: "Atlantide" });

  assert.deepEqual(vue.groupes, []);
  assert.equal(vue.affichees, 0);

});

// ---- Tout afficher

test("« Tout afficher » restaure exactement le rendu d'avant", () => {

  const vue = decouperVue(pays(["Italie", 29], ["France", 26], ["Japon", 7]), { tout: true });

  assert.equal(vue.mode, "tout");
  assert.equal(vue.groupes.length, 3);
  assert.equal(vue.affichees, 62);
  assert.equal(vue.partielle, false, "rien ne manque : la ligne d'étendue ne doit pas dire « sur »");
  assert.ok(vue.groupes.every((g) => !g.ecourte));

});

// ---- La ligne d'étendue

test("une vue partielle DIT qu'elle est partielle", () => {

  const vue = decouperVue(pays(["Italie", 29], ["France", 26], ["Japon", 7]), { cible: 18, maxParPays: 12 });

  assert.equal(ligneEtendue(vue, BOURSES, { pays: 30 }), "24 bourses affichées sur 62 · 30 pays");

});

test("l'accord suit le mot : « affichées » pour des bourses, « affichés » pour des établissements", () => {

  const vue = decouperVue(pays(["Italie", 29], ["France", 26]), { cible: 18, maxParPays: 12 });

  assert.match(ligneEtendue(vue, BOURSES, { pays: 30 }), /bourses affichées sur/);
  assert.match(ligneEtendue(vue, UNIS, { pays: 30 }), /établissements affichés sur/);

});

test("un pays choisi annonce son compte, et ses ouvertes quand la page en a", () => {

  const vue = decouperVue(pays(["Italie", 29]), { paysFiltre: "Italie" });

  assert.equal(ligneEtendue(vue, BOURSES, { paysFiltre: "Italie", ouvertes: 6 }), "Italie — 29 bourses, dont 6 aux candidatures ouvertes");

  // Sans état de candidature (universities.html), on n'invente pas un
  // « dont 0 ouvertes » qui se lirait comme une fermeture.
  assert.equal(ligneEtendue(vue, UNIS, { paysFiltre: "Italie" }), "Italie — 29 établissements");

});

test("zéro ouverte se dit, et ne se confond pas avec « pas d'information »", () => {

  const vue = decouperVue(pays(["Italie", 29]), { paysFiltre: "Italie" });

  assert.match(ligneEtendue(vue, BOURSES, { paysFiltre: "Italie", ouvertes: 0 }), /dont 0 aux candidatures ouvertes/);

});

// ---- Le lien d'un groupe écourté

test("le lien d'un groupe écourté porte le nombre réel et le bon article", () => {

  const vue = decouperVue(pays(["Italie", 29], ["Japon", 20], ["France", 26]), { cible: 100, maxParPays: 12 });

  assert.equal(libelleVoirTout(vue.groupes[0], BOURSES), "Voir les 29 bourses de l'Italie");
  assert.equal(libelleVoirTout(vue.groupes[1], BOURSES), "Voir les 20 bourses du Japon");
  assert.equal(libelleVoirTout(vue.groupes[2], UNIS), "Voir les 26 établissements de la France");

});

test("un pays inconnu du référentiel garde une phrase lisible", () => {

  const vue = decouperVue(pays(["Autre", 30]), { cible: 100 });

  assert.match(libelleVoirTout(vue.groupes[0], BOURSES), /^Voir les 30 bourses /);

});

// ---- Robustesse

test("une liste vide ne casse rien", () => {

  const vue = decouperVue([]);

  assert.deepEqual(vue.groupes, []);
  assert.equal(vue.total, 0);
  assert.equal(vue.partielle, false);
  // « 0 bourse » au singulier : c'est la règle française après zéro, et
  // c'est ce que rend `mot()`. Le pluriel serait la faute.
  assert.equal(ligneEtendue(vue, BOURSES, { pays: 0 }), "0 bourse");

});

test("les constantes restent celles qu'on a mesurées", () => {
  // Accordés le 2026-09-06 CONTRE UNE MESURE, pas au jugé : 18/12
  // laissait scholarships.html à 15 672 px, au-dessus des 12 000 px
  // visés ; 12/8 la ramène à 12 164 px. Voir js/catalogue-vue.js.
  assert.equal(CARTES_VISEES, 12);
  assert.equal(MAX_PAR_PAYS, 8);
});
