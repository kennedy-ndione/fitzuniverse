/**
 * ============================================================
 * test/controle-depot.test.mjs — LE CONTRÔLE AVANT DÉPÔT NE NOTE
 * PLUS CE QU'IL N'A PAS LU
 * ============================================================
 *
 * CE QUI S'EST PASSÉ (trouvé le 2026-09-17, mandat « renforcer la
 * préinscription ») : `analyzeDocument()` dans
 * js/ai/simulated-responses.js calculait le score d'un document à
 * partir du HASH DE SON NOM DE FICHIER, puis écrivait au-dessus de 80
 * « Document bien structuré et conforme aux attentes. » Trois des cinq
 * catégories du rapport — grammaire, professionnalisme, cohérence —
 * sortaient du même hash, alors que personne ne lit le contenu des
 * documents en mode simulé.
 *
 * Conséquence, sur le parcours où le dépôt coûte 85 000 F non
 * remboursables : un relevé de 3 Mo, six fois au-dessus du plafond du
 * portail, était déclaré conforme parce que le hash de « releve.pdf »
 * tombait bien. Le navigateur connaissait le poids exact depuis le
 * début.
 *
 * CE FICHIER GARDE LES SIX RÈGLES qui rendent le contrôle honnête :
 *   1. on ne lit QUE `octets` — le champ `size` historique est une
 *      chaîne en mégaoctets, et le lire comme des octets ferait passer
 *      tous les fichiers ;
 *   2. un poids non mesuré n'est jamais un « ça passe » ;
 *   3. le poids est BINAIRE : un fichier de trop fait refuser le dépôt ;
 *   4. le score est le MINIMUM, pas la moyenne — un dossier est refusé
 *      par son point faible ;
 *   5. une catégorie qu'on ne peut pas juger est ABSENTE, pas à zéro ;
 *   6. le rapport DIT ce qu'il n'a pas regardé.
 *
 * Fins de ligne : tout fichier lu ici passe par .replace(/\r\n/g,"\n").
 * ============================================================
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { controleDepot, plafondKo, tailleLisible, plafondGeneralKo, plafondsStricts, LIBELLES_CONTROLE } from "../js/ai/controle-depot.js";
import { computeApplicationReport } from "../js/ai/simulated-responses.js";
import { piecesDuDossier, etatTraduction } from "../js/route-preinscription.js";
import { composerProcedure, coucheDeResidence } from "../js/procedures/index.js";
import { PROCEDURE_FRANCE } from "../js/procedures/france.js";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(join(racine, f), "utf8").replace(/\r\n/g, "\n");

/**
 * Le CODE d'un fichier, sans ses commentaires. Indispensable ici : les
 * modules de ce lot CITENT la phrase fautive et le nom de la fonction
 * fautive pour raconter le défaut corrigé, et ce récit doit rester.
 * Chercher « scoreFromHash » dans le texte brut ferait rougir un test
 * à cause de son propre en-tête.
 */
const codeSeul = (f) => lire(f).replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

const SENEGAL = composerProcedure(PROCEDURE_FRANCE, coucheDeResidence("France", "Sénégal"));
const TOUTES = piecesDuDossier(SENEGAL).map((p) => ({ ...p, obtenue: true, ecartee: false }));
const LANGUE_OK = etatTraduction(TOUTES, { traductions: "francais" });
const Ko = 1024;
const Mo = 1024 * 1024;

test("contrôle 1 — les plafonds se lisent tels que la procédure les écrit, et rien d'autre", () => {
  assert.equal(plafondKo("500 Ko"), 500);
  assert.equal(plafondKo("50 Ko"), 50);
  assert.equal(plafondKo("1 Mo"), 1024);
  assert.equal(plafondKo("1,5 Mo"), 1536);
  // Un plafond illisible ne devient pas un plafond inventé.
  for (const mauvais of ["", null, undefined, "beaucoup", "500", "500 octets", "0 Ko", "-2 Ko"]) {
    assert.equal(plafondKo(mauvais), null, `« ${mauvais} » ne doit pas produire de plafond`);
  }
  // Le plafond GÉNÉRAL est le plus large de la procédure : on ne devine
  // pas quel fichier est quelle pièce, donc on n'applique à un fichier
  // quelconque que la limite dont on est certain.
  assert.equal(plafondGeneralKo(TOUTES), 500);
  assert.equal(plafondGeneralKo([]), null);
  assert.equal(plafondGeneralKo([{ tailleMax: "" }]), null);
  // Les plafonds plus stricts sont rappelés comme des règles nommées.
  const stricts = plafondsStricts(TOUTES, 500);
  assert.ok(stricts.some((p) => p.ko === 50 && /photo/i.test(p.nom)), "la photo à 50 Ko doit être rappelée");
  // Une pièce écartée ne porte plus sa règle.
  assert.deepEqual(plafondsStricts(TOUTES.map((p) => ({ ...p, ecartee: true })), 500), []);
  assert.equal(tailleLisible(180 * Ko), "180 Ko");
  assert.equal(tailleLisible(3.2 * Mo), "3,2 Mo");
  assert.equal(tailleLisible(500), "500 o");
  assert.equal(tailleLisible("x"), "");
});

test("contrôle 2 — LE PIÈGE DU CHAMP `size` : une chaîne en mégaoctets ne fait jamais passer un fichier", () => {
  // ai-check.js envoie DEUX champs : `size` (chaîne, en Mo, deux
  // décimales, pour les phrases) et `octets` (brut, pour le contrôle).
  // Lire `size` comme des octets donnerait 0,003 Ko pour 3,2 Mo : tous
  // les fichiers passeraient. Preuve par mutation : lire `f.size` en
  // repli dans controle-depot.js → ce test rouge.
  const ancien = controleDepot({ fichiers: [{ name: "releve.pdf", size: "3.20" }], pieces: TOUTES, traduction: LANGUE_OK });
  assert.equal(ancien.categories.poids, 0, "un poids non lu ne vaut pas un poids conforme");
  assert.equal(ancien.pretADeposer, false);
  assert.match(ancien.weaknesses.join(" "), /n'a pas pu être mesuré/);

  // Et le champ juste, lui, mesure exactement.
  const juste = controleDepot({ fichiers: [{ name: "releve.pdf", octets: 3.2 * Mo }], pieces: TOUTES, traduction: LANGUE_OK });
  assert.match(juste.weaknesses.join(" "), /releve\.pdf : 3,2 Mo\. Le portail refuse au-delà de 500 Ko/);

  // La page envoie bien les deux, et le contrôle ne lit que le bon.
  assert.match(lire("ai-check.js"), /octets: entry\.size,/, "ai-check n'envoie plus le poids brut");
  const code = codeSeul("js/ai/controle-depot.js");
  assert.ok(!/f\.size/.test(code), "controle-depot lit encore le champ en mégaoctets");
  assert.match(code, /typeof f\.octets === "number"/);
});

test("contrôle 3 — le poids est binaire, le score est le minimum, et « prêt » n'est vrai que si tout l'est", () => {
  const conforme = controleDepot({ fichiers: [{ name: "a.pdf", octets: 420 * Ko }], pieces: TOUTES, traduction: LANGUE_OK });
  assert.equal(conforme.overallScore, 100);
  assert.equal(conforme.pretADeposer, true);

  // UN SEUL fichier de trop : le dépôt est refusé, le score le dit.
  // « Deux fichiers sur trois passent » n'existe pas au guichet.
  const unDeTrop = controleDepot({
    fichiers: [{ name: "a.pdf", octets: 420 * Ko }, { name: "b.pdf", octets: 420 * Ko }, { name: "c.pdf", octets: 3 * Mo }],
    pieces: TOUTES, traduction: LANGUE_OK
  });
  assert.equal(unDeTrop.categories.poids, 0, "le poids n'est pas une proportion");
  assert.equal(unDeTrop.overallScore, 0, "une moyenne aurait affiché 67 sur un dossier condamné");
  assert.equal(unDeTrop.pretADeposer, false);

  // Le minimum, et non la moyenne : deux pièces manquantes sur huit
  // donnent 75, pas 92.
  const incomplet = controleDepot({
    fichiers: [{ name: "a.pdf", octets: 420 * Ko }],
    pieces: TOUTES.map((p, i) => (i < 6 ? p : { ...p, obtenue: false })),
    traduction: LANGUE_OK
  });
  assert.equal(incomplet.categories.pieces, 75);
  assert.equal(incomplet.overallScore, 75);
  assert.equal(incomplet.pretADeposer, false);
  assert.match(incomplet.weaknesses.join(" "), /2 pièces encore à régler/);

  // La langue non déclarée bloque aussi : elle coûte des semaines.
  const langueOuverte = controleDepot({ fichiers: [{ name: "a.pdf", octets: 420 * Ko }], pieces: TOUTES, traduction: etatTraduction(TOUTES, {}) });
  assert.equal(langueOuverte.categories.langue, 0);
  assert.equal(langueOuverte.overallScore, 0);
  assert.match(langueOuverte.weaknesses.join(" "), /traduction assermentée/);
});

test("contrôle 4 — une catégorie qu'on ne peut pas juger est ABSENTE, jamais à zéro", () => {
  // Pays non documenté : aucune pièce, aucun plafond. Un zéro se
  // lirait « votre dossier est mauvais » alors qu'on ne sait rien.
  const sansProcedure = controleDepot({ fichiers: [{ name: "a.pdf", octets: 420 * Ko }], pieces: [], traduction: null });
  assert.deepEqual(Object.keys(sansProcedure.categories), [], "aucune catégorie ne peut être jugée");
  assert.equal(sansProcedure.overallScore, 0);
  assert.equal(sansProcedure.pretADeposer, false, "sans rien de vérifié, on ne déclare pas un dossier prêt");

  // Aucune pièce à traduire (les deux écartées) : la question de la
  // langue ne se pose plus, la catégorie disparaît.
  const sansLangue = TOUTES.map((p) => (p.traduction ? { ...p, ecartee: true, obtenue: false } : p));
  const r = controleDepot({ fichiers: [{ name: "a.pdf", octets: 420 * Ko }], pieces: sansLangue, traduction: etatTraduction(sansLangue, {}) });
  assert.ok(!("langue" in r.categories), "une question sans objet ne se note pas");
  assert.equal(r.overallScore, 100);

  // Chaque catégorie rendue porte son libellé — la page les affiche
  // telles quelles, sans table à elle.
  for (const cle of Object.keys(r.categories)) {
    assert.equal(r.categoryLabels[cle], LIBELLES_CONTROLE[cle], `${cle} sans libellé`);
  }
});

test("contrôle 5 — le rapport DIT ce qu'il n'a pas regardé, et ne note plus la grammaire", () => {
  const r = controleDepot({ fichiers: [{ name: "a.pdf", octets: 420 * Ko }], pieces: TOUTES, traduction: LANGUE_OK });
  // Aucune des trois catégories fabriquées ne subsiste.
  for (const fabriquee of ["grammar", "professionalism", "coherence", "clarity"]) {
    assert.ok(!(fabriquee in r.categories), `« ${fabriquee} » est revenue : elle notait un contenu que personne ne lit`);
  }
  // Et la limite est écrite à l'étudiant, avec la sortie humaine.
  const dit = r.suggestions.join(" ");
  assert.match(dit, /Le CONTENU de vos documents n'est pas jugé ici/);
  assert.match(dit, /relire par votre conseiller/);
  // AUCUN VERDICT DE STRUCTURE NE SORT PLUS DU CONTRÔLE. Le test porte
  // sur ce que le module PRODUIT, pas sur son texte : son en-tête cite
  // la phrase fautive (« Document bien structuré et conforme aux
  // attentes ») pour raconter le défaut, et ce récit doit rester.
  const tout = [...r.strengths, ...r.weaknesses, ...r.suggestions].join(" ");
  for (const verdict of ["bien structuré", "conforme aux attentes", "grammaire", "professionnalisme"]) {
    assert.ok(!tout.toLowerCase().includes(verdict.toLowerCase()), `le rapport juge « ${verdict} » sans l'avoir lu`);
  }
  // Et aucun score du contrôle ne peut venir d'un hash ou d'un tirage.
  const code = codeSeul("js/ai/controle-depot.js");
  assert.ok(!/scoreFromHash/.test(code), "aucun score dérivé d'un hash dans le contrôle");
  assert.ok(!/Math\.random/.test(code), "aucun score tiré au hasard");
});

test("contrôle 6 — la tâche « check » passe par là en préinscription, et la dette bourses est nommée", () => {
  // Le branchement : même entrée que la page envoie.
  const files = [{ name: "releve.pdf", size: "3.20", octets: 3.2 * Mo }];
  const pre = computeApplicationReport({ files, parcours: "preinscription", pieces: TOUTES, traduction: LANGUE_OK });
  assert.equal(pre.overallScore, 0);
  assert.deepEqual(Object.keys(pre.categories).sort(), ["langue", "pieces", "poids"]);
  assert.match(pre.weaknesses.join(" "), /Le portail refuse au-delà de 500 Ko/);
  // La forme que la page attend, intacte.
  assert.equal(typeof pre.categoryLabels, "object");
  assert.ok(Array.isArray(pre.checklist) && pre.checklist.every((c) => "label" in c && "present" in c));
  assert.ok(Array.isArray(pre.strengths) && Array.isArray(pre.weaknesses) && Array.isArray(pre.suggestions));

  // 🟢 RÉÉCRIT EN CONSCIENCE le 2026-09-18 (lot B1) — LA DETTE EST PAYÉE.
  //
  // Ce test exigeait l'inverse : que la branche bourses garde son défaut
  // et que la dette reste ÉCRITE dans le code, parce que la corriger à
  // l'aveugle, sans sa page sous les yeux, casse deux choses au lieu
  // d'en réparer une. Il portait sa propre condition de péremption :
  // « si la branche bourses a changé, ce test doit changer avec elle ».
  // Elle a changé, il change.
  //
  // La règle GARDÉE est maintenant la bonne : cette branche ne note plus
  // rien qu'elle n'ait mesuré. Le détail vit dans
  // test/controle-bourse.test.mjs.
  const bourse = computeApplicationReport({ files, parcours: "bourse", profile: {} });
  assert.ok(!("grammar" in bourse.categories), "une note de grammaire fabriquée est revenue côté bourses");
  assert.equal(bourse.overallScore, null, "le parcours bourses ne rend aucune note");
  const source = lire("js/ai/simulated-responses.js");
  assert.ok(!/DETTE CONNUE, PARCOURS BOURSES/.test(source), "la dette est payée : sa mention n'a plus lieu d'être");
  assert.match(source, /LA DETTE DU LOT R11 EST PAYÉE/);

  // Et la page charge les pièces à la demande, pour ne pas imposer
  // 75 Ko aux comptes du parcours bourses.
  const page = lire("ai-check.js");
  assert.match(page, /if \(parcoursCheck === "preinscription"\) \{/);
  assert.match(page, /await Promise\.all\(\[\n?import\("\.\/js\/route-preinscription\.js"\),/);
  assert.match(page, /pieces: piecesRoute, traduction: traductionRoute/);
});
