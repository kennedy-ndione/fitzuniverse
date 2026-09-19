/**
 * ============================================================
 * test/verification-bourse.test.mjs — proposer, jamais affirmer
 * ============================================================
 *
 * LOT P5b (2026-09-19). L'outil qui va lire les pages officielles.
 *
 * LA DOCTRINE QU'IL DOIT RESPECTER EXISTAIT AVANT LUI. admin/radar.js
 * porte, depuis sa création, l'avertissement qui explique pourquoi ce
 * projet avait refusé un tel outil :
 *
 *   « Un robot qui visiterait les 156 sites officiels pour réécrire
 *     les dates ferait exactement ce que ce projet s'interdit depuis
 *     le début : transformer "on ne sait pas" en une date affirmée.
 *     […] Aucune extraction automatique ne rend cette phrase ; elle
 *     en tirerait "janvier 2027" et l'afficherait comme certaine. »
 *
 * Ces tests tiennent les trois garde-fous qui font que cet outil n'est
 * PAS ce robot : il n'écrit rien, il refuse toute date que la phrase
 * citée ne porte pas, et « je ne sais pas » est sa réponse par défaut.
 *
 * Fins de ligne : tout fichier lu ici passe par .replace(/\r\n/g,"\n").
 * ============================================================
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(path.join(RACINE, f), "utf8").replace(/\r\n/g, "\n");
const codeSeul = (f) => lire(f).replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/[^\n]*$/gm, "");

const requis = createRequire(import.meta.url);
const { texteDePage, dateCitee, lireProposition, CONSIGNE_VERIFICATION, MAX_CARACTERES_TEXTE } =
  requis(path.join(RACINE, "functions/lib/verification-bourse.js"));

/* ---------------------------------------------------------------
   1. Lire une page — sans dépendance, et sans se laisser piéger
   --------------------------------------------------------------- */

test("page 1 — le texte lisible, sans script ni style ni balise", () => {

  const html = `<html><head><style>b{color:red}</style></head>
    <body><h1>Bourse X</h1><script>var a=1;</script>
    <p>Date limite&nbsp;: <b>15&nbsp;mars&nbsp;2027</b></p>
    <!-- commentaire --></body></html>`;

  const texte = texteDePage(html);

  assert.match(texte, /Bourse X/);
  assert.match(texte, /Date limite : 15 mars 2027/);
  assert.ok(!/var a=1/.test(texte), "le JavaScript de la page n'est pas du texte");
  assert.ok(!/color:red/.test(texte), "les styles non plus");
  assert.ok(!/commentaire/.test(texte));
  assert.ok(!/<[a-z]/i.test(texte), "aucune balise ne doit survivre");

});

test("page 2 — les blocs deviennent des lignes, pas une bouillie", () => {

  const texte = texteDePage("<li>15 mars 2027</li><li>30 juin 2027</li>");

  assert.ok(texte.includes("\n"), "deux dates collées se lisent comme une seule");
  assert.match(texte, /15 mars 2027/);
  assert.match(texte, /30 juin 2027/);

});

test("page 3 — une page énorme est coupée, et le dit", () => {

  const texte = texteDePage(`<p>${"a".repeat(MAX_CARACTERES_TEXTE * 2)}</p>`);

  assert.ok(texte.length < MAX_CARACTERES_TEXTE + 100,
    "chaque millier de caractères envoyé au modèle se paie");
  assert.match(texte, /page tronquée/, "le modèle doit savoir qu'il ne voit pas tout");

});

/* ---------------------------------------------------------------
   2. LA GARDE — une date non citée n'existe pas
   --------------------------------------------------------------- */

test("citée 1 — la date doit être dans la phrase, en toutes lettres ou en chiffres", () => {

  assert.equal(dateCitee("2027-03-15", "Date limite : 15 mars 2027"), true);
  assert.equal(dateCitee("2027-03-15", "Deadline: 15 March 2027"), true, "les pages officielles sont souvent en anglais");
  assert.equal(dateCitee("2027-03-15", "Clôture le 15/03/2027"), true);
  assert.equal(dateCitee("2027-03-15", "Applications close on 2027-03-15"), true);

});

test("citée 2 — une date DÉDUITE tombe, et c'est tout l'intérêt de l'outil", () => {

  // Le cas exact décrit par admin/radar.js.
  assert.equal(dateCitee("2027-01-15", "Les candidatures ouvrent généralement à l'automne."), false);
  assert.equal(dateCitee("2027-03-15", "Clôture en mars 2027"), false,
    "un mois sans jour ne fait pas une date : le jour serait inventé");
  assert.equal(dateCitee("2027-03-15", "Date limite : 15 mars 2026"), false, "la mauvaise année");
  assert.equal(dateCitee("2027-03-15", ""), false);
  assert.equal(dateCitee("", "15 mars 2027"), false);
  assert.equal(dateCitee("15 mars 2027", "15 mars 2027"), false, "le format ISO est exigé");

});

test("citée 3 — un mois voisin ne passe pas pour le bon", () => {

  // « mai » est inclus dans « maintenant » ; « mar » dans « mardi ».
  // Si la comparaison était naïve, ces phrases valideraient une date.
  assert.equal(dateCitee("2027-05-15", "Réponse attendue maintenant, avant le 15 de 2027"), false);

});

/* ---------------------------------------------------------------
   3. La proposition — et ce qu'elle refuse, dit à voix haute
   --------------------------------------------------------------- */

test("proposition 1 — une page claire produit une proposition complète", () => {

  const p = lireProposition({
    statut: "ouverte",
    deadlineISO: "2027-03-15",
    portail: "https://exemple.org/apply",
    citation: "Applications close on 15 March 2027."
  });

  assert.deepEqual(p, {
    statut: "ouverte",
    deadlineISO: "2027-03-15",
    portail: "https://exemple.org/apply",
    citation: "Applications close on 15 March 2027.",
    refus: []
  });

});

test("proposition 2 — une date non citée est écartée, ET l'outil dit pourquoi", () => {

  const p = lireProposition({
    statut: "ouverte",
    deadlineISO: "2027-03-15",
    citation: "Les candidatures ouvrent à l'automne."
  });

  assert.equal(p.deadlineISO, "");
  assert.equal(p.refus.length, 1);
  assert.match(p.refus[0], /n'apparaît pas dans la phrase citée/,
    "sans explication, l'administrateur croira que la page ne disait rien");

});

test("proposition 3 — une date sans citation du tout est écartée aussi", () => {

  const p = lireProposition({ statut: "ouverte", deadlineISO: "2027-03-15" });

  assert.equal(p.deadlineISO, "");
  assert.match(p.refus[0], /aucune phrase source/);

});

test("proposition 4 — « je ne sais pas » est la réponse par défaut", () => {

  for (const cas of [null, undefined, {}, "texte", 42]) {
    const p = lireProposition(cas);
    assert.equal(p.statut, "inconnu");
    assert.equal(p.deadlineISO, "");
    assert.equal(p.portail, "");
  }

});

test("proposition 5 — un statut inventé ne devient pas la quinzième orthographe", () => {

  // Le champ `status` du catalogue porte déjà quatorze façons d'écrire
  // « fermée ». L'outil n'en ajoute pas.
  const p = lireProposition({ statut: "probablement ouverte", citation: "x" });

  assert.equal(p.statut, "inconnu");
  assert.match(p.refus[0], /statut .* inconnu/);

});

test("proposition 6 — un portail qui n'est pas une adresse est écarté", () => {

  // Ce champ devient un LIEN sur la carte de l'étudiant.
  const p = lireProposition({ statut: "ouverte", portail: "voir le site officiel", citation: "x" });

  assert.equal(p.portail, "");
  assert.match(p.refus[0], /ce n'est pas une adresse/);

  assert.equal(lireProposition({ portail: "https://ok.org/a", citation: "x" }).portail, "https://ok.org/a");

});

/* ---------------------------------------------------------------
   4. La consigne, et le branchement
   --------------------------------------------------------------- */

test("consigne 1 — le modèle reçoit l'interdiction d'estimer", () => {

  assert.match(CONSIGNE_VERIFICATION, /N'ESTIME JAMAIS/);
  assert.match(CONSIGNE_VERIFICATION, /LA CITATION DOIT CONTENIR LA DATE/);
  assert.match(CONSIGNE_VERIFICATION, /« JE NE SAIS PAS » EST UNE BONNE RÉPONSE/);
  assert.match(CONSIGNE_VERIFICATION, /coûterait une année à un étudiant/);

});

test("fonction 1 — elle est réservée aux administrateurs, et n'écrit RIEN", () => {

  const js = codeSeul("functions/verification.js");

  // Le verrou est côté serveur : une page admin ne protège pas une
  // fonction appelable depuis une console de navigateur.
  assert.match(js, /admins\/\$\{request\.auth\.uid\}/);
  assert.match(js, /isActive !== true/);

  // AUCUNE ÉCRITURE. C'est la promesse de l'outil.
  for (const interdit of ["\\.set\\(", "\\.update\\(", "\\.add\\(", "\\.delete\\("]) {
    assert.ok(!new RegExp(interdit).test(js),
      `functions/verification.js ne doit rien écrire (${interdit})`);
  }

  assert.match(js, /lireProposition/, "la garde du module pur doit être appliquée AVANT de rendre la réponse");

});

test("branchement 1 — la fonction est exportée, et la page existe", () => {

  const index = codeSeul("functions/index.js");
  assert.match(index, /exports\.verifierBourse = require\("\.\/verification"\)\.verifierBourse;/,
    "LE BOUT QUI MANQUE TOUJOURS : une fonction non exportée n'est pas déployée");

  const outils = lire("admin/tools.html");
  assert.match(outils, /href="verification\.html"/,
    "un outil qu'aucun écran n'ouvre est un outil qui n'existe pas");

  const page = lire("admin/verification.html");
  assert.match(page, /src="verification\.js"/);
  assert.match(page, /src="admin-auth\.js"/, "la page doit refuser un visiteur non administrateur");

});

test("écran 0 — le catalogue est TRADUIT avant d'entrer dans le radar", () => {

  // DÉFAUT TROUVÉ EN DIRECT, à l'écran, au premier clic :
  // « catalogue.programs is not iterable ».
  // chargerCatalogue() rend des clés FRANÇAISES (programmes /
  // universites / bourses) ; js/radar.js travaille sur la forme de
  // l'instantané, en anglais. admin/radar.js fait déjà cette
  // traduction, avec un commentaire qui l'explique — je ne l'avais pas
  // lu avant d'écrire la page jumelle.
  const js = codeSeul("admin/verification.js");

  assert.match(js, /programs: brut\.programmes/);
  assert.match(js, /universities: brut\.universites/);
  assert.match(js, /scholarships: brut\.bourses/);

  assert.ok(!/await chargerCatalogue\(\);\s*\n\s*programmesParBourse/.test(js),
    "passer le retour de chargerCatalogue() tel quel au radar rejoue exactement le défaut");

  // Et le même contrat côté voisin, pour que les deux pages ne
  // divergent pas en silence.
  const radar = codeSeul("admin/radar.js");
  assert.match(radar, /programs: c\.programmes/);

});

test("écran 1 — le statut n'est JAMAIS écrit par défaut", () => {

  const js = codeSeul("admin/verification.js");

  // Fermer une bourse la retire des propositions de tous les étudiants
  // concernés : ça ne se fait pas par défaut.
  assert.match(js, /<option value="">Ne pas toucher au statut/);
  assert.match(js, /if \(choixStatut === "Ouverte" \|\| choixStatut === "Fermée"\) champs\.status = choixStatut;/);

  // Et la phrase source est TOUJOURS montrée : c'est ce qui permet de
  // juger sans faire confiance.
  assert.match(js, /verif-citation/);
  assert.match(js, /mot pour mot/);

});
