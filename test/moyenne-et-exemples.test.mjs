/**
 * ============================================================
 * Lot R18 (2026-09-18) — UN CONTRÔLE QUI DIT CE QU'IL EST
 * ============================================================
 *
 * Charles, le 2026-09-18, devant « Mon profil » : « pour la partie
 * série et tout, revérifie le système pour que l'utilisateur n'ait pas
 * de problème ».
 *
 * Vérification faite sur SON profil déployé, valeur par valeur : rien
 * n'était corrompu en base. `bacSeries: "serie littéraire"`,
 * `bacAverage: "12,20"`, `bacAverageScale: "20"` — exactement ce qu'il
 * avait saisi. Le défaut était entièrement À L'ÉCRAN, et il était le
 * même à deux endroits : UN CONTRÔLE QUI NE DIT PAS CE QU'IL EST.
 *
 *  1. LES PASTILLES D'EXEMPLES ne se présentaient pas comme des
 *     exemples. Sous « Série / filière », où il avait écrit « serie
 *     littéraire », il lisait « S1 S2 S3 L1 L2 » : deux façons de
 *     répondre à une seule question. Sous « Votre établissement », où
 *     il avait écrit le nom de son lycée, la rangée proposait « Lycée
 *     public · Lycée privé ».
 *
 *  2. LE SYSTÈME DE NOTATION était cinq pastilles SANS LIBELLÉ, posées
 *     au-dessus du champ. Dans une colonne de grille elles tombaient
 *     sur trois rangées, et la valeur atterrissait sous la dernière :
 *     Charles a lu sa moyenne « 12,20 » comme une note « Autre système
 *     (%) », alors qu'elle était bien sur 20.
 *
 * CE QUE CE FICHIER GARDE :
 *
 *  1. toute rangée d'exemples s'ouvre par le mot « Exemples », et ce
 *     mot n'est pas un bouton ;
 *  2. le système de notation est un SÉLECTEUR DANS la rangée de la
 *     valeur, avec son propre nom accessible — plus aucune pastille ;
 *  3. les cinq systèmes gardent leurs identifiants : la base ne change
 *     pas, et js/diagnostic-vers-profil.js reprend la moyenne du
 *     diagnostic AVEC son système, sans conversion ;
 *  4. la largeur est donnée au .fitz-select, jamais au <select> —
 *     leçon du lot B5 : le composant masque le select natif
 *     (`display:none !important`), et une règle qui le vise ne
 *     s'applique à rien sans jamais protester ;
 *  5. le libellé de la série ne porte plus sa condition : elle est
 *     descendue dans la ligne d'aide.
 *
 * Preuves par mutation faites le 2026-09-18 :
 *   le mot retiré de htmlChips → test 1 rouge ;
 *   le mot transformé en <button class="fitz-chip"> → test 1 rouge ;
 *   les pastilles d'échelle remises dans profile.html → test 2 rouge ;
 *   un identifiant de système renommé → test 3 rouge ;
 *   la largeur posée sur `.moyenne-rangee > select` → test 4 rouge.
 *
 * Fins de ligne : tout fichier lu ici passe par .replace(/\r\n/g,"\n").
 * ============================================================
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { EXEMPLES, MOT_EXEMPLES, htmlChips } from "../js/champs-guides.js";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(path.join(RACINE, f), "utf8").replace(/\r\n/g, "\n");
const codeSeul = (f) => lire(f)
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/^\s*\/\/.*$/gm, "")
  .replace(/<!--[\s\S]*?-->/g, "");

const CHAMPS_MOYENNE = ["academicAverage", "bacAverage"];

// ------------------------------------------------------------------

test("exemples 1 — toute rangée d'exemples s'ouvre par le mot « Exemples », qui n'est pas un bouton", () => {

  // La règle vaut pour les HUIT tables, pas seulement celle qu'on a
  // regardée : une table ajoutée demain la reçoit sans y penser.
  for (const cle of Object.keys(EXEMPLES)) {

    const html = htmlChips(cle, EXEMPLES[cle]);
    assert.ok(html.includes(MOT_EXEMPLES), `la rangée « ${cle} » ne dit pas que ce sont des exemples`);

    // Le mot vient AVANT la première pastille, sinon il n'ouvre rien.
    assert.ok(html.indexOf(MOT_EXEMPLES) < html.indexOf("fitz-chip\">"),
      `le mot « ${MOT_EXEMPLES} » ne précède pas les pastilles de « ${cle} »`);

    // Et il n'est PAS cliquable : le gestionnaire ne réagit qu'à
    // `.fitz-chip`, et cliquer le mot ne doit rien remplir.
    assert.match(html, /<span class="fitz-chips-lead"[^>]*>/, `le mot de « ${cle} » n'est pas un simple libellé`);
    assert.ok(!/<button[^>]*fitz-chips-lead/.test(html), "le mot d'ouverture est devenu un bouton");

    // AUTANT DE BOUTONS QUE D'EXEMPLES, ni plus ni moins. C'est cette
    // ligne-là qui attrape un mot d'ouverture transformé en pastille :
    // compter les `class="fitz-chip"` ne suffit pas, une classe
    // composée (« fitz-chip fitz-chips-lead ») y échappe.
    assert.equal((html.match(/<button/g) || []).length, EXEMPLES[cle].length,
      `la rangée « ${cle} » n'a pas exactement une pastille par exemple`);

  }

  // Le gestionnaire n'écoute toujours que les pastilles.
  assert.ok(/ev\.target\.closest\("\.fitz-chip"\)/.test(codeSeul("js/champs-guides.js")));

  // Le mot a son habillage, et hors de tout @media (règle icone-btn 3).
  // La feuille est lue SANS ses commentaires : celui d'en-tête cite le
  // mot « @media », et découper dessus coupait au mauvais endroit.
  const guide = codeSeul("css/guide.css");
  const avantMedia = guide.split("@media")[0];
  assert.ok(/\.fitz-chips-lead\{/.test(avantMedia), "le mot d'ouverture n'a pas de style hors @media");

  assert.equal(htmlChips("x", null), "", "aucune rangée sans exemples : pas de mot orphelin");

});

test("exemples 2 — le système de notation est un sélecteur dans la rangée, plus une grappe de pastilles", () => {

  const html = codeSeul("profile.html");

  for (const champ of CHAMPS_MOYENNE) {

    assert.ok(html.includes(`id="${champ}Scale"`), `${champ} n'a pas de sélecteur de système`);

    // Le sélecteur et la valeur sont DANS la même rangée, et le
    // sélecteur vient en premier.
    const rangee = html.slice(html.indexOf('<div class="moyenne-rangee">', html.indexOf(`id="${champ}Scale"`) - 400));
    const fin = rangee.indexOf("</div>");
    const dedans = rangee.slice(0, fin + 6);
    assert.ok(dedans.includes(`id="${champ}Scale"`) && dedans.includes(`id="${champ}"`),
      `${champ} : le système et la valeur ne sont pas dans la même rangée`);
    assert.ok(dedans.indexOf(`id="${champ}Scale"`) < dedans.indexOf(`id="${champ}"`),
      `${champ} : le système doit précéder la valeur`);

    // Le <label for> désigne la VALEUR : le sélecteur porte donc son
    // propre nom accessible, sinon il n'en a aucun.
    const balise = html.slice(html.indexOf(`<select id="${champ}Scale"`));
    assert.match(balise.slice(0, balise.indexOf(">") + 1), /aria-label="[^"]{10,}"/,
      `${champ}Scale n'a pas de nom accessible`);

    // Et l'aide qui suit le système choisi a son emplacement.
    assert.ok(html.includes(`id="${champ}Aide"`), `${champ} n'a pas de ligne d'aide`);

  }

  // L'ancienne grappe a disparu de PARTOUT : la page, le script, la feuille.
  for (const fichier of ["profile.html", "profile.js", "profile.css"]) {
    const texte = codeSeul(fichier);
    assert.ok(!/ScaleChips/.test(texte), `${fichier} garde les pastilles de système`);
    assert.ok(!/AverageLetters/.test(texte), `${fichier} garde la seconde grappe des lettres`);
  }

});

test("exemples 3 — les cinq systèmes gardent leurs identifiants : la base ne change pas", () => {

  const page = codeSeul("profile.js");
  const bloc = page.slice(page.indexOf("const AVERAGE_SCALES = ["), page.indexOf("];", page.indexOf("const AVERAGE_SCALES = [")));

  for (const id of ["20", "100", "gpa4", "letters", "other"]) {
    assert.ok(bloc.includes(`id: "${id}"`), `le système « ${id} » a changé d'identifiant : les profils enregistrés ne se relisent plus`);
  }

  assert.ok(/const AVERAGE_DEFAULT_SCALE = "20";/.test(page), "le système par défaut n'est plus /20");

  // Changer de système EFFACE la valeur : une note n'a aucun sens
  // transposée telle quelle d'une échelle à une autre.
  assert.ok(/document\.getElementById\(fieldId\)\.value = "";/.test(page),
    "changer de système garde la valeur de l'ancien");

  // Et les deux champs passent par la MÊME fonction : deux recettes
  // divergeraient au premier changement.
  assert.equal((page.match(/initAverageScaleField\(/g) || []).length, CHAMPS_MOYENNE.length + 1,
    "les deux moyennes ne partagent plus la même initialisation");

});

test("exemples 4 — la largeur est donnée au .fitz-select, jamais au <select>", () => {

  const css = lire("profile.css");

  // LEÇON DU LOT B5 : js/fitz-select.js masque le select natif
  // (`display:none !important`, css/fitz-select.css) et pose son bouton
  // en frère. Une règle de largeur visant le <select> ne s'applique à
  // rien — et ne proteste jamais.
  assert.match(css, /\.moyenne-rangee > \.fitz-select\{[^}]*flex:0 0 \d+px/,
    "le sélecteur de système n'a pas de largeur fixe sur le composant");
  assert.ok(!/\.moyenne-rangee > select\{/.test(css),
    "une règle vise le <select> natif, que le composant masque : elle ne s'applique à rien");

  // Le focus est porté par l'enveloppe, comme pour le téléphone.
  assert.match(css, /\.moyenne-rangee:focus-within\{/,
    "le focus n'est pas porté par la rangée : le liseré désignerait un seul des deux champs");

  // La rangée ne peut pas retourner à la ligne — c'est tout le défaut.
  const bloc = css.slice(css.indexOf(".moyenne-rangee{"), css.indexOf("}", css.indexOf(".moyenne-rangee{")));
  assert.ok(/display:flex/.test(bloc) && !/flex-wrap:wrap/.test(bloc),
    "la rangée peut retourner à la ligne : la valeur se recollerait sous le système");

});

test("exemples 5 — le libellé de la série ne porte plus sa condition", () => {

  const html = lire("profile.html");

  const libelle = html.slice(html.indexOf('<label for="bacSeries">'), html.indexOf("</label>", html.indexOf('<label for="bacSeries">')));
  assert.ok(!/si applicable/i.test(libelle),
    "la condition est revenue dans le libellé : un titre de champ n'est pas l'endroit où l'on doute");
  assert.ok(libelle.length < 60, "le libellé de la série s'est rallongé");

  // Mais elle est DITE, dans la ligne d'aide — on ne la supprime pas,
  // on la met là où elle se lit.
  const groupe = html.slice(html.indexOf('<label for="bacSeries">'), html.indexOf("</div>", html.indexOf('id="bacSeries"')) + 400);
  assert.match(groupe, /class="field-aide"[^>]*>[^<]*laissez vide/i,
    "la condition « si votre système n'en a pas » n'est dite nulle part");

});
