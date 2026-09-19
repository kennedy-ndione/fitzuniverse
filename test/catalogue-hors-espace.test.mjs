/**
 * ============================================================
 * test/catalogue-hors-espace.test.mjs — le catalogue quitte l'espace
 * ============================================================
 *
 * LOT P4 (2026-09-19). Décision de Charles : « j'aimerai que tu
 * supprimes de l'espace étudiant le catalogue des bourses et
 * universités ».
 *
 * Elle referme un écart ouvert depuis le lot FITZ-CHOISIT du
 * 2026-09-11, dont la première règle dit : « l'étudiant ne choisit pas
 * ses universités : FitzUniverse propose celles où il a le plus de
 * chances ». L'espace gardait pourtant QUATRE portes vers le choix
 * libre :
 *
 *   espace-bourse.html   « Explorer les universités » / « Explorer les bourses »
 *   js/next-action.js    le geste « rien à finaliser » menait au catalogue
 *   js/ai/format.js      Fitz transformait « universités » et « bourses »,
 *                        deux mots très courants, en liens vers le
 *                        catalogue, dans CHAQUE réponse
 *   js/mobile-nav.js     deux entrées du menu de l'espace
 *
 * CE QUI NE CHANGE PAS : les deux pages existent toujours et restent la
 * VITRINE PUBLIQUE, pour un visiteur sans compte. Un test le tient.
 *
 * Fins de ligne : tout fichier lu ici passe par .replace(/\r\n/g,"\n").
 * ============================================================
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { prochaineAction } from "../js/next-action.js";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(path.join(RACINE, f), "utf8").replace(/\r\n/g, "\n");
const codeSeul = (f) => lire(f).replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/[^\n]*$/gm, "");
const htmlSeul = (f) => lire(f).replace(/<!--[\s\S]*?-->/g, "");

const CATALOGUE = /universities\.html|scholarships\.html/;

test("espace 1 — le hub des bourses n'a plus de porte vers le catalogue", () => {

  const html = htmlSeul("espace-bourse.html");

  assert.ok(!CATALOGUE.test(html),
    "« Explorer les universités » et « Explorer les bourses » ouvraient le choix libre au milieu d'un espace où c'est Fitz qui choisit");

  // Ce qui DOIT rester : la porte vers les propositions.
  assert.match(html, /href="applications\.html"/);

});

test("espace 2 — le menu mobile de l'espace non plus", () => {

  const js = codeSeul("js/mobile-nav.js");

  const debut = js.indexOf("const MENU_ITEMS");
  const menu = js.slice(debut, js.indexOf("]", debut));

  assert.ok(!CATALOGUE.test(menu),
    "le menu de l'espace ne doit plus proposer le catalogue");

  // Non-régression : le profil et les messages restent.
  assert.match(menu, /profile\.html/);
  assert.match(menu, /messages\.html/);

});

test("espace 3 — Fitz ne renvoie plus « universités » et « bourses » au catalogue", () => {

  const js = codeSeul("js/ai/format.js");

  const debut = js.indexOf("const OUTILS_FITZ");
  const outils = js.slice(debut, js.indexOf("];", debut));

  assert.ok(!CATALOGUE.test(outils),
    "deux mots très courants devenaient des liens de sortie dans CHAQUE réponse de Fitz");

  // Les vrais outils restent liés : c'est l'utilité de la fonction.
  assert.match(outils, /ai-letter\.html/);
  assert.match(outils, /applications\.html/);

});

test("espace 4 — « rien à finaliser » mène aux propositions, pas au catalogue", () => {

  const sansRien = prochaineAction({ profileScore: 9, applications: [], opportunitesCount: 0 });
  const avecDes = prochaineAction({ profileScore: 9, applications: [], opportunitesCount: 7 });

  for (const action of [sansRien, avecDes]) {
    assert.equal(action.cle, "explorer");
    assert.equal(action.href, "applications.html",
      "le catalogue a quitté l'espace : ce geste ne peut plus y mener");
    assert.ok(!/Explorer les universités/.test(action.cta));
  }

  // Le texte ne promet plus à l'étudiant de choisir lui-même.
  assert.match(avecDes.texte, /7 opportunités/);
  assert.match(avecDes.texte, /ce que Fitz a retenu/);
  assert.match(avecDes.cta, /propositions de Fitz/);

  // Et sans rien à proposer, on ne l'envoie pas explorer dans le vide.
  assert.ok(!/Explorez le catalogue/.test(sansRien.texte));
  assert.match(sansRien.cta, /Ouvrir mes candidatures/);

});

test("espace 5 — LA VITRINE PUBLIQUE, elle, garde son catalogue", () => {

  const js = codeSeul("js/mobile-nav.js");

  const debut = js.indexOf("const PUBLIC_PRIMARY");
  const publique = js.slice(debut, js.indexOf("]", debut));

  assert.match(publique, /scholarships\.html/,
    "un visiteur sans compte doit pouvoir voir le catalogue : c'est la vitrine");
  assert.match(publique, /universities\.html/);

});
