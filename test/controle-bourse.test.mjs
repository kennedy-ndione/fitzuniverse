/**
 * ============================================================
 * test/controle-bourse.test.mjs — LE CONTRÔLE AVANT DÉPÔT NE NOTE PLUS
 * CE QU'IL N'A PAS LU, SUR AUCUN DES DEUX PARCOURS (lot B1, 2026-09-18)
 * ============================================================
 *
 * LA DETTE DU LOT R11, PAYÉE. Elle était nommée dans le code et exigée
 * par test/controle-depot.test.mjs : « la branche bourses garde ce
 * défaut […] à traiter AU PREMIER LOT de l'espace bourse ». Reproduite
 * sur le site déployé le 2026-09-18, avec le fichier même du lot R11 :
 *
 *   releve.pdf (3,2 Mo) → Clarté 91 · Grammaire 90 · Professionnalisme
 *   86 · « Document bien structuré et conforme aux attentes. » · 67/100
 *
 * Trois notes sorties de `scoreFromHash(nom-du-fichier)`, affichées en
 * « points forts » avec leur chiffre.
 *
 * LES RÈGLES GARDÉES ICI :
 *   1. le dépôt ne contient plus AUCUN score dérivé d'un hachage ;
 *   2. le rapport bourses ne rend AUCUNE note — ni score, ni catégorie —
 *      et la page sait afficher l'absence de note sans écrire « 0 » ;
 *   3. il ne rapporte que des faits : poids mesuré, texte lu ou non,
 *      nombre de mots ;
 *   4. il ne signale que l'indiscutable, jamais un seuil inventé ;
 *   5. il DIT ce qu'il ne juge pas, et oriente vers un relecteur ;
 *   6. la page nomme l'état de lecture au lieu de le laisser deviner ;
 *   7. et les trois listes changent de titre, parce qu'une mesure n'est
 *      pas un compliment.
 *
 * SIX MUTATIONS VÉRIFIÉES (2026-09-18), chacune fait tomber un test :
 *   — un score global revient sur le parcours bourses          → échec
 *   — une catégorie « grammaire » revient                       → échec
 *   — un seuil de mots inventé fait juger une lettre « courte » → échec
 *   — la phrase « le contenu n'est pas jugé » disparaît         → échec
 *   — la page écrit « 0 » au lieu de « — » sans note            → échec
 *   — `extraction` n'est plus transmis par la page              → échec
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
  controleBourse, poidsLisible, compterMots, NON_JUGE_BOURSE, EXTRACTIONS, LIBELLES_EXTRACTION
} from "../js/ai/controle-bourse.js";
import { computeApplicationReport } from "../js/ai/simulated-responses.js";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(join(racine, f), "utf8").replace(/\r\n/g, "\n");
// Le code seul : ces modules racontent le défaut qu'ils corrigent, et
// citent donc les tournures interdites (leçon des lots R11, R12, R13).
const codeSeul = (f) => lire(f)
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/^\s*\/\/.*$/gm, "")
  .replace(/<!--[\s\S]*?-->/g, "");

const Mo = 1024 * 1024;
const RELEVE = { nom: "releve.pdf", octets: 3.2 * Mo, extraction: "lue", texte: "mot ".repeat(400), type: "releve" };

test("bourse 1 — plus aucun score dérivé d'un hachage dans tout le dépôt", () => {
  // La règle vaut pour le FICHIER ENTIER, pas seulement pour la branche
  // corrigée : `scoreFromHash` et `analyzeDocument` ont été supprimés,
  // et avec eux le hachage qui les nourrissait.
  const code = codeSeul("js/ai/simulated-responses.js");
  assert.ok(!/scoreFromHash/.test(code), "scoreFromHash est revenu");
  assert.ok(!/analyzeDocument/.test(code), "analyzeDocument est revenu");
  assert.ok(!/hashString/.test(code), "le hachage qui nourrissait les notes est revenu");
  assert.ok(!/Math\.random/.test(code), "un score tiré au hasard est apparu");

  // Et la phrase fabriquée qui déclarait un document conforme.
  assert.ok(!/Document bien structuré et conforme aux attentes/.test(code),
    "la note fabriquée d'un document est revenue");

  // computeApplicationReport n'est plus qu'un aiguillage : aucune règle
  // ne doit y revivre.
  const i = code.indexOf("export function computeApplicationReport");
  // Jusqu'au `}` de la fonction, en comptant les accolades : s'arrêter
  // au premier « \n} » couperait au bloc `if` et ferait passer ce test
  // sans rien vérifier.
  // Le comptage part de l'accolade du CORPS, pas de celle du paramètre
  // déstructuré `({ files = [], … })` — partir de la première accolade
  // s'arrêtait sur la signature et ne vérifiait rien.
  let profondeur = 0, fin = i;
  for (let k = code.indexOf(") {", i) + 2; k < code.length; k++) {
    if (code[k] === "{") profondeur++;
    else if (code[k] === "}" && --profondeur === 0) { fin = k + 1; break; }
  }
  const fn = code.slice(i, fin);
  assert.match(fn, /controleDepot\(/);
  assert.match(fn, /controleBourse\(/);
  assert.ok(!/categories|overallScore|strengths/.test(fn),
    "une règle de rapport est revenue dans l'aiguillage");
});

test("bourse 2 — le rapport bourses ne rend AUCUNE note", () => {
  const r = computeApplicationReport({
    files: [{ name: "releve.pdf", size: "3.20", octets: 3.2 * Mo, extraction: "lue", content: "mot ".repeat(400) }],
    profile: {}, parcours: "bourse"
  });

  // Pas de score : `null`, et surtout pas 0 — un zéro se lirait « votre
  // dossier est mauvais » alors qu'on ne juge rien. C'est la règle du
  // lot R11 (« une catégorie qu'on ne peut pas juger est absente, pas à
  // zéro »), appliquée cette fois au score global.
  assert.equal(r.overallScore, null);
  assert.notEqual(r.overallScore, 0);
  assert.deepEqual(r.categories, {});
  assert.deepEqual(r.categoryLabels, {});

  // Les catégories fabriquées ont disparu, nommément.
  const clefs = JSON.stringify(r);
  for (const disparue of ["clarity", "grammar", "professionalism", "coherence"]) {
    assert.ok(!clefs.includes(`"${disparue}"`), `la catégorie ${disparue} est revenue`);
  }

  // La forme que la page attend reste intacte.
  assert.ok(Array.isArray(r.strengths) && Array.isArray(r.weaknesses) && Array.isArray(r.suggestions));
  assert.ok(Array.isArray(r.checklist) && r.checklist.every((c) => "label" in c && "present" in c));
});

test("bourse 3 — il ne rapporte que des faits mesurés", () => {
  const r = controleBourse({ fichiers: [RELEVE], typesDeclares: [] });
  const constat = r.strengths.join(" ");

  // Le poids exact, lisible, jamais arrondi vers le bas.
  assert.equal(poidsLisible(3.2 * Mo), "3,20 Mo");
  assert.equal(poidsLisible(512), "512 o");
  assert.equal(poidsLisible(2048), "2 Ko");
  assert.equal(poidsLisible(null), "", "un poids inconnu ne s'invente pas");
  assert.match(constat, /3,20 Mo/);

  // Le texte lu, et son compte de mots.
  assert.equal(compterMots("  deux   mots  "), 2);
  assert.equal(compterMots(""), 0);
  assert.equal(compterMots(null), 0);
  assert.match(constat, /400 mots/);
  assert.match(constat, /texte lu/);

  // Un poids non mesurable ne devient jamais un jugement.
  const sansPoids = controleBourse({ fichiers: [{ ...RELEVE, octets: undefined }] });
  assert.equal(sansPoids.files[0].mesurable, false);
  assert.match(sansPoids.strengths.join(" "), /poids inconnu/);
});

test("bourse 4 — il ne signale que l'indiscutable, jamais un seuil inventé", () => {
  // UNE LETTRE COURTE N'EST PAS UN DÉFAUT : aucun bailleur ne publie de
  // nombre de mots minimum. On donne le compte, on ne le juge pas.
  const courte = controleBourse({ fichiers: [{ nom: "lettre.pdf", octets: 90000, extraction: "lue", texte: "mot ".repeat(60), type: "lettre" }] });
  assert.equal(courte.weaknesses.length, 0, "une lettre de 60 mots n'est pas un défaut prouvé");
  assert.match(courte.strengths.join(" "), /60 mots/);

  // LE SEUL CAS INDISCUTABLE : aucun mot tiré d'un texte pourtant lu.
  const vide = controleBourse({ fichiers: [{ nom: "lettre.pdf", octets: 900, extraction: "lue", texte: "   " }] });
  assert.equal(vide.weaknesses.length, 1);
  assert.match(vide.weaknesses[0], /aucun mot/);

  // Un PDF sans texte est DIT, sans être condamné : c'est une image
  // scannée, souvent acceptée — mais illisible pour un correcteur ou un
  // lecteur d'écran, et ça vaut d'être su avant le dépôt.
  const scan = controleBourse({ fichiers: [{ nom: "diplome.pdf", octets: 800000, extraction: "vide" }] });
  assert.match(scan.weaknesses.join(" "), /image scannée/);
  assert.ok(!/mauvais|invalide|refusé/i.test(scan.weaknesses.join(" ")), "un scan n'est pas déclaré mauvais");

  // AUCUN PLAFOND DE POIDS INVENTÉ : FitzUniverse ne connaît pas celui
  // du bailleur, et le dit au lieu de comparer à un chiffre choisi.
  const gros = controleBourse({ fichiers: [{ nom: "gros.pdf", octets: 40 * Mo, extraction: "lue", texte: "mot" }] });
  assert.equal(gros.weaknesses.length, 0, "un plafond de poids a été inventé pour les bourses");
  assert.match(gros.suggestions.join(" "), /plafond affiché par le portail de votre bailleur/);
});

test("bourse 5 — il dit ce qu'il ne juge pas, et où le faire juger", () => {
  const r = controleBourse({ fichiers: [RELEVE] });
  assert.match(r.suggestions.join(" "), /Le CONTENU de vos documents n'est pas jugé ici/);
  assert.match(NON_JUGE_BOURSE, /relire par votre conseiller, un professeur ou un proche/);
  assert.equal(r.controle.nonJuge, NON_JUGE_BOURSE);

  // L'inventaire des documents courants ne se fait jamais passer pour
  // les exigences de LA bourse — elles vivent sur la carte de la
  // candidature, et un second endroit pour la même règle est la faute
  // que les lots R5, R6, R7 et R13 ont payée.
  const manquants = r.suggestions.find((s) => s.includes("Documents courants"));
  assert.ok(manquants, "l'inventaire a disparu");
  assert.match(manquants, /Cette liste est générale/);
  assert.match(manquants, /carte de votre candidature/);

  // Et aucun pourcentage de complétude : il mesurerait un dossier contre
  // une liste que cette bourse n'a jamais demandée.
  assert.ok(!/complétude|completeness/i.test(JSON.stringify(r)), "un score de complétude est revenu");
});

test("bourse 6 — la page nomme l'état de lecture, et sait afficher l'absence de note", () => {
  const page = codeSeul("ai-check.js");

  // `content: undefined` ne distinguait pas trois situations. La page
  // les nomme maintenant, et le module refuse de deviner.
  assert.match(page, /extraction = String\(content \|\| ""\)\.trim\(\) \? "lue" : "vide"/);
  assert.match(page, /UNSUPPORTED_FORMAT" \? "format" : "erreur"/);
  // ET IL EST VRAIMENT TRANSMIS : le mot « extraction » apparaît aussi
  // dans la déclaration et le try/catch — une assertion sur le mot seul
  // passerait alors même que le champ ne part plus. C'est ce que la
  // mutation a montré : on vise donc la charge utile envoyée.
  assert.match(page, /content,\s*\n\s*extraction/, "le champ `extraction` ne part plus avec les fichiers");
  assert.deepEqual(EXTRACTIONS, ["lue", "vide", "format", "erreur"]);
  for (const cle of EXTRACTIONS) assert.ok(LIBELLES_EXTRACTION[cle], `${cle} n'a pas de libellé`);
  // Un état inconnu ne devient jamais « lue » par défaut.
  assert.equal(controleBourse({ fichiers: [{ nom: "x.pdf", octets: 10, extraction: "n'importe quoi" }] }).files[0].extraction, "erreur");

  // L'anneau : « — » quand il n'y a pas de note, jamais « 0 ».
  assert.match(page, /const noteChiffree = typeof data\.overallScore === "number";/);
  assert.match(page, /scoreValue\.textContent = noteChiffree \? data\.overallScore : "—";/);
  assert.match(page, /scoreUnite\.hidden = !noteChiffree/);
  assert.match(lire("ai-check.html"), /id="scoreUnite"/);

  // Les trois titres : une mesure n'est pas un compliment.
  const r = controleBourse({ fichiers: [RELEVE] });
  assert.equal(r.listLabels.strengths, "Ce que Fitz a mesuré");
  assert.match(page, /poserTitre\(titreForts, data\.listLabels/);
  for (const id of ["titreForts", "titreFaibles", "titreSuggestions"]) {
    assert.match(lire("ai-check.html"), new RegExp(`id="${id}"[^>]*>.*<span>`), `${id} doit porter son libellé dans un <span>`);
  }

  // Et le parcours préinscription garde SES titres : il n'en fournit pas.
  const pre = computeApplicationReport({ files: [], parcours: "preinscription", pieces: [], traduction: null });
  assert.equal(pre.listLabels, undefined, "le rapport préinscription ne doit pas renommer les cartes");
});
