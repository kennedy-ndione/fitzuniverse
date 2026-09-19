/**
 * ============================================================
 * test/carte-propose.test.mjs — la carte dit où, quand et pourquoi
 * ============================================================
 *
 * LOT P2 (2026-09-19). Demande de Charles : « proposer de bons choix
 * aux étudiants tout en leur précisant le pays et quelques petites
 * informations de ces bourses ou universités… pour laisser le choix à
 * l'étudiant avant de retenir les 4 ou 6 universités. »
 *
 * CE QUI SE PASSAIT. retenirOpportunites() rend pour CHAQUE retenue son
 * `country`, son `deadline`, ses `jours`, son `echeanceOuverte` et un
 * TABLEAU de raisons. La carte du hub n'affichait que `reasons[0]`. Et
 * la carte qui porte « J'accepte cette université » — un geste
 * DÉFINITIF, deux refus par place au maximum — ne montrait ni le pays
 * ni une seule raison. Pire : carteFitz(), la fonction qui écrit la
 * carte dans la base, n'enregistrait même pas le pays. Il était
 * calculé, puis jeté à l'écriture.
 *
 * Fins de ligne : tout fichier lu ici passe par .replace(/\r\n/g,"\n").
 * ============================================================
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { libelleFenetre } from "../js/recommend-programs.js";
import { carteFitz } from "../js/fitz-choisit.js";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(path.join(RACINE, f), "utf8").replace(/\r\n/g, "\n");
const codeSeul = (f) => lire(f).replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/[^\n]*$/gm, "");

/* ---------------------------------------------------------------
   1. La fenêtre de dépôt — une phrase, un seul endroit
   --------------------------------------------------------------- */

test("fenêtre 1 — trois états, et le troisième est le plus important", () => {

  assert.equal(libelleFenetre({ dateConfirmee: true, jours: 120 }).etat, "ouverte");
  assert.equal(libelleFenetre({ dateConfirmee: true, jours: 33 }).etat, "serre");

  // 259 programmes sur 507 portent un paragraphe au lieu d'une date.
  // Les présenter comme les autres serait reprendre le défaut que
  // Charles a demandé de corriger ; les taire aussi.
  const flou = libelleFenetre({ dateConfirmee: false, jours: null });
  assert.equal(flou.etat, "a_verifier");
  assert.match(flou.texte, /non confirmée/);
  assert.match(flou.texte, /site officiel/,
    "l'étudiant doit savoir OÙ vérifier, sinon la mention n'est qu'un doute");

});

test("fenêtre 2 — un délai court le dit, et ne se déguise pas en confort", () => {

  const serre = libelleFenetre({ dateConfirmee: true, jours: 31 });
  assert.match(serre.texte, /31 jours/);
  assert.equal(serre.etat, "serre");

  // La bascule est à 45 jours : au-delà, réunir un dossier complet
  // (légalisations, traductions assermentées) redevient faisable.
  assert.equal(libelleFenetre({ dateConfirmee: true, jours: 45 }).etat, "serre");
  assert.equal(libelleFenetre({ dateConfirmee: true, jours: 46 }).etat, "ouverte");

});

test("fenêtre 3 — une entrée incomplète ne produit jamais une fausse certitude", () => {

  for (const cas of [null, undefined, {}, { dateConfirmee: true }, { jours: 60 }]) {
    assert.equal(libelleFenetre(cas).etat, "a_verifier",
      "sans les deux champs, on ne peut PAS affirmer que la candidature est ouverte");
  }

});

/* ---------------------------------------------------------------
   2. Ce que Fitz écrit dans la base
   --------------------------------------------------------------- */

test("carte 1 — le pays et la raison survivent enfin à l'écriture", () => {

  const carte = carteFitz({
    universityName: "Université Mohammed VI",
    scholarshipTitle: "Bourse d'excellence",
    universityId: "um6p",
    programId: "p1",
    scholarshipId: "b1",
    country: "Maroc",
    jours: 80,
    dateConfirmee: true,
    reasons: ["Situé au Maroc, votre destination souhaitée", "Enseignement en français"]
  });

  assert.equal(carte.country, "Maroc",
    "LE DÉFAUT D'ORIGINE : le pays était calculé puis jeté par carteFitz()");
  assert.equal(carte.raisonFitz, "Situé au Maroc, votre destination souhaitée");
  assert.equal(carte.dateConfirmee, true);
  assert.equal(carte.jours, 80);

  // Non-régression : une carte neuve reste neuve.
  assert.equal(carte.status, "a_preparer");
  assert.equal(carte.refus, 0);
  assert.equal(carte.isRecommendation, true);
  assert.deepEqual(carte.checklist, []);

});

test("carte 2 — une retenue sans pays ni raison n'invente rien", () => {

  const carte = carteFitz({ universityName: "X", scholarshipTitle: "Y" });

  assert.equal(carte.country, "");
  assert.equal(carte.raisonFitz, "");
  assert.equal(carte.dateConfirmee, false,
    "faute de preuve, la date n'est PAS confirmée — jamais l'inverse");
  assert.equal(carte.jours, null);

});

/* ---------------------------------------------------------------
   3. Les deux écrans les affichent — la famille de défauts du jour
   --------------------------------------------------------------- */

test("hub 1 — la carte du parcours porte le pays, la fenêtre et trois raisons", () => {

  const js = codeSeul("dashboard.js");

  assert.match(js, /libelleFenetre/, "le hub doit dire la fenêtre avec le module partagé");
  assert.match(js, /jy-opp-pays/, "le pays n'apparaissait nulle part");
  assert.match(js, /pick\.reasons \|\| \[\]\)\.slice\(0, 3\)/,
    "une seule raison sur trois calculées, c'était le défaut");

  assert.ok(!/pick\.reasons\[0\]/.test(js),
    "l'ancienne ligne à une seule raison ne doit plus exister");

});

test("hub 2 — et la feuille connaît ces faits", () => {

  const css = lire("css/journey.css");

  assert.match(css, /\.jy-opp-faits\{/);

  // Règle du projet : --amber-700 est la SEULE valeur ambre admise
  // pour du texte ou une icône.
  const glyphe = css.slice(css.indexOf(".jy-opp-fait i,"));
  assert.match(glyphe.slice(0, 220), /color:var\(--amber-700\)/);

});

test("acceptation 1 — on n'accepte plus un nom seul", () => {

  const js = codeSeul("applications.js");

  assert.match(js, /function renderFaitsDuChoix\(app\)/);
  assert.match(js, /\$\{renderFaitsDuChoix\(app\)\}/,
    "LE BOUT QUI MANQUE TOUJOURS : la fonction doit être APPELÉE par la carte");

  // La même phrase que le hub, par le même module : deux phrases
  // différentes pour la même opportunité, et l'étudiant cesse de
  // croire le site.
  assert.match(js, /import \{ retenirOpportunites, libelleFenetre \}/);

  assert.match(js, /app-raison-fitz/, "pourquoi Fitz a choisi celle-là");
  assert.match(js, /app-fait-pays/, "et dans quel pays elle se trouve");

});

test("acceptation 2 — une carte d'avant ce lot n'affiche pas un pays vide", () => {

  const js = codeSeul("applications.js");
  // La fonction entière : on borne sur la suivante plutôt que sur la
  // première accolade fermante, qui tombe au milieu d'un `if`.
  const debut = js.indexOf("function renderFaitsDuChoix");
  const corps = js.slice(debut, js.indexOf("function renderCard", debut));

  assert.match(corps, /if \(!faits\.length && !raison\) return "";/,
    "les cartes écrites avant ce lot n'ont aucun de ces champs : la ligne doit disparaître entièrement");
  assert.match(corps, /if \(!app \|\| !app\.isRecommendation\) return "";/,
    "une candidature saisie à la main n'est pas un choix de Fitz : elle n'a pas de raison à afficher");

});

test("acceptation 3 — et la feuille connaît ces faits", () => {

  const css = lire("applications.css");

  assert.match(css, /\.app-faits\{/);
  assert.match(css, /\.app-raison-fitz\{/);

  const glyphe = css.slice(css.indexOf(".app-fait i,"));
  assert.match(glyphe.slice(0, 200), /color:var\(--amber-700\)/);

});
