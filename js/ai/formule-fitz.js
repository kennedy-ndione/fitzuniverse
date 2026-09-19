/**
 * ============================================================
 * FitzUniverse — Fitz connaît la formule de l'étudiant
 * ============================================================
 *
 * LOT FORMULE-FITZ (2026-09-19). Jusqu'à ce lot, Fitz ne savait
 * RIEN de la formule de l'étudiant à qui il parlait. baseSystem()
 * recevait le profil, la nationalité, le pays, le parcours, les
 * candidatures — et pas un mot sur le plan.
 *
 * Deux conséquences, toutes deux coûteuses :
 *
 *  1. IL PROMETTAIT CE QUI N'EXISTE PAS. Rien ne l'empêchait de dire
 *     à un compte Essentiel « votre conseiller pourra revoir ça avec
 *     vous » ou « écrivez-nous sur WhatsApp » — deux services que ce
 *     compte n'a pas. Un étudiant qui attend un rappel qui ne viendra
 *     jamais, c'est pire que l'absence de service : c'est une parole
 *     non tenue par FitzUniverse.
 *
 *  2. IL FAISAIT GRATUITEMENT LE TRAVAIL DES OUTILS FERMÉS. Un compte
 *     dont la « Lettre de motivation » est verrouillée n'avait qu'à
 *     demander sa lettre dans la conversation. L'outil était vendu ;
 *     le chat le donnait.
 *
 * Ce module est PUR (aucun DOM, aucun Firestore) : il se teste en
 * Node. Il fait deux choses et rien d'autre —
 *   lireFormule(ctx)      lit les droits déjà résolus par la coquille
 *   cadreFormule(formule) en fait le paragraphe lu par le modèle
 * ============================================================
 */

import {
  FEATURE_CATALOG,
  PLAN_LABELS,
  PLAN_PREINSCRIPTION_LABELS,
  decideVerrou
} from "../plan-features.js";

/* Les fonctionnalités dont Fitz doit se taire s'il ne les a pas —
   c'est-à-dire celles qu'un étudiant peut lui DEMANDER en conversation.
   `applications`, `documents` ou `compress` n'y sont pas : personne ne
   demande à Fitz de compresser un PDF dans le fil, et les citer
   allongerait le prompt sans rien changer à ce qu'il répond. */
const LISIBLES = new Set([
  "ai_chat",
  "ai_letter",
  "ai_check",
  "ai_email",
  "ai_translate",
  "interview_prep",
  "advisor",
  "student_messaging",
  "whatsapp_direct",
  "diagnostic_france"
]);

/**
 * Lit la formule d'un étudiant à partir du contexte déjà résolu par
 * bootstrapShell(). Aucune règle de droit n'est réécrite ici :
 * decideVerrou() reste la seule autorité, comme partout ailleurs.
 *
 * @param {Object} ctx - le contexte de la coquille (planId,
 *   planPreinscriptionId, featureFlags, testerAccess, hasFitzExpress)
 * @returns {{libelle:string, ouvertes:string[], fermees:string[]}}
 */
export function lireFormule(ctx = {}) {

  const {
    planId = "",
    planPreinscriptionId = "",
    featureFlags,
    testerAccess = false,
    hasFitzExpress = false
  } = ctx;

  // Un compte porte au plus une formule bourse ET au plus une offre
  // préinscription ; ses droits sont l'union des deux. Le libellé doit
  // donc pouvoir en nommer deux — sinon un « Dossier France +
  // Conseiller » s'entendrait dire qu'il est au plan Gratuit.
  const noms = [];
  if (planId && PLAN_LABELS[planId]) noms.push(PLAN_LABELS[planId]);
  if (planPreinscriptionId && PLAN_PREINSCRIPTION_LABELS[planPreinscriptionId]) {
    noms.push(PLAN_PREINSCRIPTION_LABELS[planPreinscriptionId]);
  }

  const ouvertes = [];
  const fermees = [];

  FEATURE_CATALOG.forEach(({ key, label }) => {

    if (!LISIBLES.has(key)) return;

    const verrouille = decideVerrou({
      planId,
      planPreinscriptionId,
      featureFlags,
      featureKey: key,
      testerAccess,
      hasFitzExpress
    });

    (verrouille ? fermees : ouvertes).push(label);

  });

  return {
    libelle: noms.length ? noms.join(" + ") : "",
    ouvertes,
    fermees
  };

}

/**
 * Le paragraphe que reçoit le modèle. Rendu VIDE si la formule n'a pas
 * pu être lue : mieux vaut un Fitz qui ne parle pas de formule qu'un
 * Fitz qui annonce la mauvaise.
 *
 * @param {{libelle?:string, ouvertes?:string[], fermees?:string[]}} formule
 * @returns {string}
 */
export function cadreFormule(formule) {

  if (!formule || !formule.libelle) return "";

  const ouvertes = Array.isArray(formule.ouvertes) ? formule.ouvertes : [];
  const fermees = Array.isArray(formule.fermees) ? formule.fermees : [];

  const parts = [
    "LA FORMULE DE CET ÉTUDIANT, ET TES LIMITES AVEC LUI.",
    `Sa formule est : ${formule.libelle}.`
  ];

  if (ouvertes.length) parts.push(`Ce qui lui est OUVERT : ${ouvertes.join(", ")}.`);
  if (fermees.length) parts.push(`Ce qui lui est FERMÉ : ${fermees.join(", ")}.`);

  parts.push(
    "Six règles, dans cet ordre.",

    "(1) NE PROMETS JAMAIS UN SERVICE FERMÉ. Ne dis pas qu'un conseiller le rappellera, qu'il peut écrire sur WhatsApp ou répondre à l'équipe si ces services ne sont pas dans sa liste OUVERT. Un étudiant qui attend un rappel qui ne viendra jamais, c'est une parole non tenue par FitzUniverse.",

    "(2) NE FAIS PAS À LA MAIN CE QU'UN OUTIL FERMÉ FAIT. Si la rédaction de lettre, la vérification de dossier, la traduction ou la génération d'e-mail lui sont fermées, tu ne produis pas ce livrable dans la conversation : ni la lettre entière, ni la traduction complète d'un document, ni l'e-mail prêt à envoyer. Tu RÉPONDS quand même : tu expliques ce qui est attendu, tu donnes la structure, tu dis ce qui manquerait. C'est le livrable fini que tu ne remets pas, pas ton aide.",

    "(3) QUAND IL DEMANDE QUELQUE CHOSE DE FERMÉ, dis-le en une phrase, sans détour et sans t'excuser : ce n'est pas dans sa formule, voici ce que ça lui apporterait, et les formules se voient sur la page « Voir les formules ». Une seule fois par conversation. Tu n'es pas un vendeur : tu le dis, puis tu reviens à ce que tu peux faire pour lui tout de suite.",

    "(4) NE RÉCITE JAMAIS LA LISTE DE CE QUI LUI EST OUVERT. Cette liste est là pour TOI, pour savoir ce que tu as le droit de promettre — pas pour être lue à l'étudiant. Nomme seulement ce qui répond à la question posée, en une ou deux choses, et dans tes mots. On te demande un conseiller humain ? Réponds que tu peux relire son dossier et sa lettre toi-même — pas que tu proposes six outils. Une énumération de services au milieu d'une conversation est une brochure, pas une réponse.",

    "(5) CE QUI LUI EST OUVERT, TU LE SERS ENTIÈREMENT. Ne limite rien de toi-même, ne rationne pas tes réponses, n'invente aucun quota. Un étudiant qui a payé doit sentir qu'il a payé.",

    "(6) N'INVENTE NI PRIX, NI DÉLAI, NI CONTENU DE FORMULE. Tu connais les noms ci-dessus et rien d'autre. Si on te demande combien coûte une formule ou ce qu'elle contient exactement, renvoie à la page des formules plutôt que de citer un chiffre."
  );

  return parts.join(" ");

}
