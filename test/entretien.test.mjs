/**
 * ============================================================
 * test/entretien.test.mjs — DEUX ENTRETIENS, DEUX PRÉPARATIONS
 * ============================================================
 *
 * CE QUI S'EST PASSÉ (2026-09-18, mandat « renforcer la
 * préinscription ») : interview-prep.html était écrite d'un bout à
 * l'autre pour un entretien de BOURSE — « Qu'est-ce qui vous a motivé à
 * candidater à cette bourse en particulier ? », « question très
 * fréquente pour les bourses gouvernementales », « Que ferez-vous si
 * vous n'obtenez pas cette bourse ? ». Or l'étape 11 de la route y
 * envoie l'étudiant : un candidat Dossier France s'y préparait à un
 * jury qu'il ne rencontrera jamais.
 *
 * Et il manquait le fait le plus important de cette étape, absent de
 * toute la page : le compte-rendu de l'entretien pédagogique est lu par
 * les établissements demandés ET par le consulat, et il constitue un
 * élément OBLIGATOIRE du dossier de demande de visa.
 *
 * LES RÈGLES GARDÉES ICI :
 *   1. le jeu de la préinscription ne parle jamais de bourse, de jury,
 *      ni de visioconférence (l'entretien se passe à l'antenne) ;
 *   2. les axes sont SOURCÉS et DATÉS, les questions sont annoncées
 *      comme du matériel d'entraînement — aucune source officielle ne
 *      publie la liste des questions posées ;
 *   3. le cadre dit qui lira le compte-rendu ;
 *   4. la page rend les deux jeux depuis le module, sans copie locale ;
 *   5. le jeu BOURSE est intact — ce lot ne touche pas à cet espace.
 *
 * Fins de ligne : tout fichier lu ici passe par .replace(/\r\n/g,"\n").
 * ============================================================
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import {
  THEMES_BOURSE, THEMES_PREINSCRIPTION, CHECKLIST_BOURSE, CHECKLIST_PREINSCRIPTION,
  CADRE_PREINSCRIPTION, SOURCES_ENTRETIEN, themesPour, checklistPour, defautsDesThemes
} from "../js/entretien-questions.js";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(join(racine, f), "utf8").replace(/\r\n/g, "\n");
const sansCommentairesHtml = (s) => s.replace(/<!--[\s\S]*?-->/g, "");

/**
 * Le CODE d'un fichier, sans ses commentaires. Indispensable dès qu'un
 * test interdit un MOT : les modules de ce lot racontent le défaut
 * corrigé, et citent donc les formulations fautives (« entretien de
 * bourse », « la liste des questions posées »). Chercher ces mots dans
 * le texte brut fait rougir un test à cause de son propre récit — la
 * leçon a déjà été payée deux fois le 2026-09-17 et le 2026-09-18.
 */
const codeSeul = (f) => lire(f).replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

test("entretien 1 — le jeu de la préinscription ne parle JAMAIS de bourse, de jury ni de visioconférence", () => {
  // Preuve par mutation (2026-09-18) : une question de THEMES_BOURSE
  // recopiée dans THEMES_PREINSCRIPTION → ce test rouge.
  assert.deepEqual(defautsDesThemes(), []);

  const tout = [
    ...THEMES_PREINSCRIPTION.map((t) => t.titre),
    ...THEMES_PREINSCRIPTION.flatMap((t) => t.questions),
    ...CHECKLIST_PREINSCRIPTION.map((c) => c.label),
    CADRE_PREINSCRIPTION.titre,
    CADRE_PREINSCRIPTION.texte
  ].join(" ");

  for (const interdit of ["bourse", "boursier", "jury", "bailleur", "visioconférence", "micro", "caméra"]) {
    assert.ok(!new RegExp(interdit, "i").test(tout), `« ${interdit} » apparaît dans la préparation de l'entretien pédagogique`);
  }

  // Et ce qu'il DOIT contenir : le parcours, le projet, la cohérence des
  // vœux, le financement, l'après — les axes que les pages officielles
  // nomment, plus ce que le consulat lira.
  for (const attendu of ["parcours", "projet d'études", "vœux", "finance", "français"]) {
    assert.ok(new RegExp(attendu, "i").test(tout), `« ${attendu} » manque à la préparation`);
  }
  assert.equal(THEMES_PREINSCRIPTION.length, 5);
  assert.ok(THEMES_PREINSCRIPTION.every((t) => t.questions.length >= 3), "un thème avec moins de trois questions n'est pas un entraînement");
});

test("entretien 2 — le cadre dit QUI LIRA le compte-rendu, avec ses sources et sa date", () => {
  // C'est le fait qui manquait complètement, et le plus lourd de
  // conséquences : l'entretien n'est pas une conversation.
  const c = CADRE_PREINSCRIPTION;
  assert.match(c.texte, /compte-rendu/i);
  assert.match(c.texte, /établissements/i);
  assert.match(c.texte, /consulat/i);
  assert.match(c.texte, /obligatoire/i);
  // Sourcé et daté — la règle de tout le site : une consigne sans sa
  // date est une consigne recopiée quelque part.
  assert.match(c.source, /^https:\/\/www\.[a-z]+\.campusfrance\.org\//);
  assert.match(c.sourceResidence, /^https:\/\/www\.senegal\.campusfrance\.org\//);
  assert.match(c.verifieLe, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(c.verifieLe, SOURCES_ENTRETIEN.verifieLe);
  // Aucune source n'est un agrégateur : le lot R1 a déjà payé ce prix
  // une fois (« 7 vœux par niveau », lu chez un intermédiaire).
  for (const url of [c.source, c.sourceResidence]) {
    assert.ok(/campusfrance\.org/.test(url), `${url} n'est pas une source officielle`);
  }
});

test("entretien 3 — les QUESTIONS sont annoncées comme un entraînement, pas comme la liste de ce qui sera posé", () => {
  // Aucune source officielle ne publie les questions de l'entretien.
  // Les agrégateurs qui prétendent le contraire (« les 20 questions
  // indispensables ») sont exactement ce qu'on refuse de recopier. Le
  // titre de la section doit donc le dire à l'étudiant.
  assert.match(lire("interview-prep.js"), /Ce sur quoi l'entretien porte, et des questions pour vous y entraîner/);
  // Et la page ne PROMET nulle part « les questions posées » : on juge
  // ce qu'elle affiche, pas ce que ses commentaires racontent.
  const affiche = sansCommentairesHtml(lire("interview-prep.html")) + codeSeul("interview-prep.js");
  assert.ok(!/questions posées/i.test(affiche), "la page promet la liste des questions posées");
});

test("entretien 4 — la page rend les deux jeux DEPUIS le module, sans copie locale", () => {
  const html = sansCommentairesHtml(lire("interview-prep.html"));
  const js = lire("interview-prep.js");

  // Plus une seule question écrite dans le HTML : cinq blocs y étaient
  // figés, et c'est ainsi qu'un jeu de bourse s'est retrouvé servi à
  // tout le monde pendant des mois.
  assert.ok(!/ivp-question-list/.test(html), "des questions sont encore écrites dans le HTML");
  assert.ok(!/class="ivp-category"/.test(html), "les blocs de thèmes sont encore figés dans le HTML");
  assert.match(html, /<div id="ivpCategories"><\/div>/);
  assert.match(html, /<p id="ivpCadre" class="journey-warning" hidden><\/p>/);

  // Le rendu vient du module, et le parcours décide.
  assert.match(js, /from "\.\/js\/entretien-questions\.js"/);
  assert.match(js, /const parcours = parcoursDOutil\(\{ espace: ctx\.espace \}\);/);
  assert.match(js, /renderThemes\(parcours\)/);
  assert.match(js, /checklistPour\(parcours\)/);
  // L'ORDRE : rendre avant de brancher, parce que les bascules
  // s'attachent bouton par bouton et non par délégation. Inverser les
  // deux lignes donnerait des thèmes qui ne se replient plus.
  assert.ok(js.indexOf("renderThemes(parcours)") < js.indexOf("initCategoryToggles()"), "les bascules se branchent avant que les thèmes existent");
  // Plus de table figée dans la page.
  assert.ok(!/CHECKLIST_ITEMS/.test(js), "la checklist est encore figée dans la page");
  // Le verrou ne parle plus d'entretien de bourse à qui n'en passe pas
  // — jugé sur le code, l'en-tête citant la formulation corrigée.
  assert.ok(!/entretien de bourse/.test(codeSeul("interview-prep.js")));
});

test("entretien 5 — le jeu BOURSE est intact, et le parcours décide seul", () => {
  // Ce lot ne touche pas à l'espace bourse : ses thèmes doivent être
  // exactement ceux d'avant — TITRES ET ICÔNES COMPRIS.
  //
  // POURQUOI CE TEST EST SI LITTÉRAL : en portant ces thèmes du HTML
  // vers un module de données, j'avais d'abord reconstitué QUATRE des
  // cinq titres de mémoire, et ils étaient faux (« Projet d'études et
  // avenir » au lieu de « Projet académique et professionnel »,
  // « Fin d'entretien » au lieu de « Questions difficiles », deux
  // icônes changées). Un lot qui ne parle pas de l'espace bourse
  // n'avait pas à en reformuler la page. Les valeurs ci-dessous sont
  // celles du fichier d'origine, relues ligne par ligne.
  assert.deepEqual(
    THEMES_BOURSE.map((t) => `${t.icone}/${t.titre}`),
    [
      "user/Motivation et parcours",
      "target/Projet académique et professionnel",
      "landmark/Pourquoi cette université et ce pays",
      "award/Compétences et réalisations",
      "alert-triangle/Questions difficiles"
    ]
  );
  assert.deepEqual(THEMES_BOURSE.map((t) => t.questions.length), [4, 4, 3, 3, 3]);
  const bourse = THEMES_BOURSE.flatMap((t) => t.questions).join(" ");
  assert.match(bourse, /candidater à cette bourse en particulier/);
  assert.match(bourse, /Que ferez-vous si vous n'obtenez pas cette bourse/);
  assert.match(bourse, /bourses gouvernementales/);
  assert.equal(CHECKLIST_BOURSE.length, 7);
  assert.ok(CHECKLIST_BOURSE.some((c) => /micro/.test(c.label)), "la checklist bourse garde son test de visioconférence");

  // Le choix : « preinscription » ou tout le reste. Jamais un troisième
  // comportement, jamais un repli silencieux sur le mauvais jeu.
  assert.equal(themesPour("preinscription"), THEMES_PREINSCRIPTION);
  assert.equal(checklistPour("preinscription"), CHECKLIST_PREINSCRIPTION);
  for (const autre of ["bourse", "", null, undefined, "Preinscription", "preinscriptions"]) {
    assert.equal(themesPour(autre), THEMES_BOURSE, `« ${autre} » doit retomber sur le jeu bourse`);
    assert.equal(checklistPour(autre), CHECKLIST_BOURSE);
  }

  // Les identifiants de checklist ne se chevauchent pas : ils sont des
  // clés Firestore (interviewPrepChecklist.<id>), et un compte des deux
  // espaces garde les deux jeux sans qu'ils se mélangent.
  const ids = new Set(CHECKLIST_BOURSE.map((c) => c.id));
  for (const c of CHECKLIST_PREINSCRIPTION) {
    assert.ok(!ids.has(c.id), `« ${c.id} » est partagé entre les deux checklists`);
    assert.match(c.id, /^[a-z0-9_]+$/, "un identifiant de checklist est une clé Firestore");
  }
});
