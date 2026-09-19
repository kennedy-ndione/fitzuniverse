/**
 * ============================================================
 * test/formule-fitz.test.mjs — Fitz connaît la formule, et s'y tient
 * ============================================================
 *
 * LOT FORMULE-FITZ (2026-09-19), demandé par Charles : « Fitz doit
 * comprendre aussi les formules de chaque étudiant et avoir des
 * limites avec eux. »
 *
 * VÉRIFIÉ AVANT D'ÉCRIRE UNE LIGNE : baseSystem() recevait le profil,
 * la nationalité, le pays de résidence, le parcours, les candidatures
 * — et PAS UN MOT sur la formule. Le mot « formule » n'apparaissait
 * nulle part dans js/ai/prompts.js, sinon dans « formule de politesse ».
 *
 * Deux fuites, toutes deux payantes :
 *   - Fitz pouvait promettre à un compte Essentiel qu'« un conseiller
 *     revoit ça avec vous » : ce compte n'a pas de conseiller.
 *   - Un compte dont la lettre de motivation est verrouillée n'avait
 *     qu'à demander sa lettre dans la conversation. L'outil est vendu ;
 *     le chat le donnait.
 *
 * Fins de ligne : tout fichier lu ici passe par .replace(/\r\n/g,"\n").
 * ============================================================
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { lireFormule, cadreFormule } from "../js/ai/formule-fitz.js";
import { resolveFeatureFlags } from "../js/plan-features.js";
import { buildPrompt } from "../js/ai/prompts.js";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(path.join(RACINE, f), "utf8").replace(/\r\n/g, "\n");
const codeSeul = (f) => lire(f).replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/[^\n]*$/gm, "");

// Les drapeaux réels du site, pas une invention de test.
const FLAGS = resolveFeatureFlags(null);

/* ---------------------------------------------------------------
   1. Lire la formule — decideVerrou reste la seule autorité
   --------------------------------------------------------------- */

test("formule 1 — un Essentiel a ses outils, pas de conseiller ni de WhatsApp", () => {

  const f = lireFormule({ planId: "essentiel-4", featureFlags: FLAGS });

  assert.equal(f.libelle, "Essentiel");

  assert.ok(f.ouvertes.includes("Lettre de motivation"), "il a payé la lettre : elle doit être ouverte");
  assert.ok(f.ouvertes.includes("Questions à Fitz"));

  assert.ok(f.fermees.includes("Mon conseiller"),
    "LA FUITE D'ORIGINE : rien n'empêchait Fitz de promettre un rappel de conseiller à ce compte.");
  assert.ok(f.fermees.includes("WhatsApp direct"));

});

test("formule 2 — le Gratuit n'a rien, et le cadre le dit sans détour", () => {

  const f = lireFormule({ planId: "gratuit", featureFlags: FLAGS });

  assert.equal(f.ouvertes.length, 0, "aucun outil n'est ouvert au plan Gratuit");
  assert.ok(f.fermees.includes("Questions à Fitz"));

});

test("formule 3 — deux offres, deux noms : l'union, jamais la moitié", () => {

  // Un compte porte au plus une formule bourse ET au plus une offre
  // préinscription ; ses droits sont l'UNION des deux. Nommer une
  // seule des deux ferait dire à Fitz une formule fausse.
  const f = lireFormule({
    planId: "gratuit",
    planPreinscriptionId: "dossier-france-conseiller",
    featureFlags: FLAGS
  });

  assert.match(f.libelle, /Gratuit/);
  assert.match(f.libelle, /Dossier France \+ Conseiller/);

  assert.ok(f.ouvertes.includes("Diagnostic France"),
    "l'offre préinscription ouvre le diagnostic, même avec une formule bourse à Gratuit");

});

test("formule 4 — un compte testeur voit tout, comme partout ailleurs sur le site", () => {

  const f = lireFormule({ planId: "gratuit", featureFlags: FLAGS, testerAccess: true });

  assert.equal(f.fermees.length, 0,
    "decideVerrou() ouvre tout à un testeur : ce module ne réécrit AUCUNE règle de droit.");

});

/* ---------------------------------------------------------------
   2. Le paragraphe lu par le modèle
   --------------------------------------------------------------- */

test("formule 5 — sans formule lisible, Fitz se tait plutôt que d'inventer", () => {

  assert.equal(cadreFormule(null), "");
  assert.equal(cadreFormule({ libelle: "", ouvertes: [], fermees: [] }), "",
    "Mieux vaut un Fitz muet sur la formule qu'un Fitz qui annonce la mauvaise.");

});

test("formule 6 — les deux règles qui coûtent de l'argent sont écrites", () => {

  const cadre = cadreFormule(lireFormule({ planId: "essentiel-4", featureFlags: FLAGS }));

  // (1) la parole non tenue
  assert.match(cadre, /NE PROMETS JAMAIS UN SERVICE FERMÉ/);
  assert.match(cadre, /conseiller le rappellera/);

  // (2) le travail donné gratuitement
  assert.match(cadre, /NE FAIS PAS À LA MAIN CE QU'UN OUTIL FERMÉ FAIT/,
    "sans cette règle, il suffit de demander sa lettre dans le fil pour ne jamais payer l'outil");
  assert.match(cadre, /ni la lettre entière/);

  // MAIS il continue d'aider : c'est le LIVRABLE qui est retenu, pas
  // l'aide. Un Fitz qui répond « non » et s'arrête serait pire que la
  // fuite qu'on corrige.
  assert.match(cadre, /Tu RÉPONDS quand même/);
  assert.match(cadre, /C'est le livrable fini que tu ne remets pas, pas ton aide/);

});

test("formule 6 bis — la liste ouverte est pour Fitz, pas pour l'étudiant", () => {

  // MESURÉ EN PRODUCTION le 2026-09-19, sur le compte de Brigitte
  // (Essentiel). Fitz a refusé le conseiller exactement comme prévu —
  // puis a enchaîné sur SES SIX OUTILS, énumérés : « questions sur vos
  // candidatures, vérification de dossier, aide sur votre lettre de
  // motivation, traduction de documents, e-mails, préparation aux
  // entretiens ». C'est juste, et c'est une brochure au milieu d'une
  // conversation. Réglage demandé par Charles le jour même.
  const cadre = cadreFormule(lireFormule({ planId: "essentiel-4", featureFlags: FLAGS }));

  assert.match(cadre, /NE RÉCITE JAMAIS LA LISTE DE CE QUI LUI EST OUVERT/);
  assert.match(cadre, /Cette liste est là pour TOI/,
    "la liste sert à savoir ce qu'il a le droit de promettre, pas à être lue");
  assert.match(cadre, /ce qui répond à la question posée/);
  assert.match(cadre, /pas que tu proposes six outils/,
    "l'exemple concret vaut mieux que la consigne abstraite : c'est le cas réel de Brigitte");

  // Et la règle reste dans le décompte annoncé au modèle — une liste
  // qui dit « cinq » et en contient six, c'est la première chose qu'un
  // modèle remarque, et il se met à douter du reste.
  assert.match(cadre, /Six règles, dans cet ordre\./);
  assert.match(cadre, /\(6\) N'INVENTE NI PRIX/);

});

test("formule 7 — ce qui est ouvert est servi entièrement, et rien n'est inventé", () => {

  const cadre = cadreFormule(lireFormule({ planId: "conseiller-6", featureFlags: FLAGS }));

  assert.match(cadre, /CE QUI LUI EST OUVERT, TU LE SERS ENTIÈREMENT/,
    "un étudiant qui a payé ne doit pas se heurter à une limite que Fitz s'invente");
  assert.match(cadre, /n'invente aucun quota/);

  assert.match(cadre, /N'INVENTE NI PRIX, NI DÉLAI, NI CONTENU DE FORMULE/,
    "Fitz ne connaît pas la grille tarifaire : il ne doit jamais citer un chiffre de tête");

  // Une seule fois par conversation : Fitz n'est pas un vendeur.
  assert.match(cadre, /Une seule fois par conversation/);

});

test("formule 8 — le cadre nomme la formule et ses deux listes", () => {

  const cadre = cadreFormule(lireFormule({ planId: "essentiel-4", featureFlags: FLAGS }));

  assert.match(cadre, /Sa formule est : Essentiel\./);
  assert.match(cadre, /Ce qui lui est OUVERT :/);
  assert.match(cadre, /Ce qui lui est FERMÉ :/);
  assert.match(cadre, /Mon conseiller/);

});

/* ---------------------------------------------------------------
   3. Le branchement — la famille de défauts de la semaine
   --------------------------------------------------------------- */

test("formule 9 — le chat porte vraiment le cadre, dans les DEUX parcours", () => {

  const formule = lireFormule({ planId: "essentiel-4", featureFlags: FLAGS });

  for (const parcours of ["bourse", "preinscription"]) {

    const { system } = buildPrompt("chat", {
      message: "un conseiller peut-il relire mon dossier ?",
      profile: { parcours },
      parcours,
      history: [],
      formule
    });

    assert.match(system, /LA FORMULE DE CET ÉTUDIANT, ET TES LIMITES AVEC LUI/,
      `${parcours} : le cadre de formule n'atteint pas le modèle`);
    assert.match(system, /Sa formule est : Essentiel\./, `${parcours}`);

  }

});

test("formule 10 — sans formule, le prompt reste exactement celui d'avant", () => {

  const { system } = buildPrompt("chat", {
    message: "bonjour",
    profile: {},
    parcours: "bourse",
    history: []
  });

  assert.ok(!/LA FORMULE DE CET ÉTUDIANT/.test(system),
    "aucune phrase de formule ne doit apparaître quand la formule n'a pas pu être lue");

  // Non-régression : le reste du cadre du chat est intact.
  assert.match(system, /Tu es Fitz, l'assistant de candidature de FitzUniverse/);
  assert.match(system, /L'ÉTUDIANT PEUT TE JOINDRE DES IMAGES/);

});

test("formule 11 — le cadre n'est ajouté QUE dans la conversation", () => {

  const formule = lireFormule({ planId: "essentiel-4", featureFlags: FLAGS });

  // Dans un OUTIL, la question du droit est déjà tranchée : l'étudiant
  // n'y serait pas entré sans le droit. Y répéter les limites allonge
  // le prompt (donc le coût) sans changer une seule réponse.
  for (const tache of ["letter", "email"]) {

    const { system } = buildPrompt(tache, {
      message: "x",
      profile: {},
      parcours: "bourse",
      history: [],
      formule
    });

    assert.ok(!/LA FORMULE DE CET ÉTUDIANT/.test(system),
      `${tache} : le cadre de formule n'a rien à faire dans un outil déjà déverrouillé`);

  }

});

test("formule 12 — ai-chat.js LIT la formule et l'ENVOIE", () => {

  // LA FAMILLE DE DÉFAUTS DE LA SEMAINE : une capacité écrite, jamais
  // reliée. Les images étaient normalisées mais jamais jointes ; les
  // cartes étaient personnalisées mais mortes au clic. Ce test tient
  // les deux bouts du fil.
  const js = codeSeul("ai-chat.js");

  assert.match(js, /import \{ lireFormule \} from "\.\/js\/ai\/formule-fitz\.js"/,
    "le module doit être importé par la page du chat");
  assert.match(js, /lireFormule\(ctx\)/,
    "la formule se lit sur le contexte de la coquille, qui a déjà résolu les droits");
  assert.match(js, /formule: formuleDeLEtudiant,/,
    "LE BOUT QUI MANQUE TOUJOURS : la valeur lue doit entrer dans la charge envoyée au modèle");

});

test("formule 13 — aucune règle de droit n'est réécrite dans le module", () => {

  const js = codeSeul("js/ai/formule-fitz.js");

  assert.match(js, /decideVerrou\(/,
    "la seule autorité du site sur les droits reste decideVerrou()");

  // Trois copies de la règle « Mon conseiller » ont déjà divergé sur ce
  // site (js/app-shell.js, js/dual-shell.js, dashboard.js). On ne
  // recommence pas : pas de liste de formules en dur ici.
  assert.ok(!/"essentiel-4"|"conseiller-6"|"signature"/.test(js),
    "aucun identifiant de formule ne doit être écrit en dur dans ce module");

});
