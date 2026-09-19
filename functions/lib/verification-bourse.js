/**
 * ============================================================
 * functions/lib/verification-bourse.js — proposer, jamais affirmer
 * ============================================================
 *
 * LOT P5b (2026-09-19). Le module PUR de l'outil de vérification :
 * aucun réseau, aucun Firestore, aucun DOM. Il se teste en Node.
 *
 * LA DOCTRINE QU'IL DOIT RESPECTER, ÉCRITE AVANT LUI
 * --------------------------------------------------
 * admin/radar.js porte, depuis sa création, l'avertissement qui rend
 * cet outil dangereux :
 *
 *   « Un robot qui visiterait les 156 sites officiels pour réécrire
 *     les dates ferait exactement ce que ce projet s'interdit depuis
 *     le début : transformer "on ne sait pas" en une date affirmée.
 *     […] Aucune extraction automatique ne rend cette phrase ; elle
 *     en tirerait "janvier 2027" et l'afficherait comme certaine. »
 *
 * Cet outil n'est donc PAS ce robot. Trois garde-fous, dans l'ordre :
 *
 *  1. IL N'ÉCRIT RIEN. La Cloud Function rend une PROPOSITION ;
 *     l'écriture dans le catalogue est un geste d'administrateur.
 *  2. UNE DATE N'EST PROPOSÉE QUE SI ELLE EST CITÉE. `lireProposition`
 *     rejette toute date dont le jour, le mois ou l'année n'apparaît
 *     pas LITTÉRALEMENT dans la phrase source rapportée. Un modèle qui
 *     déduit « probablement mars 2027 » d'un paragraphe voit sa date
 *     tomber, et l'administrateur voit « aucune date citée ».
 *  3. « JE NE SAIS PAS » EST UNE RÉPONSE VALIDE, et c'est la réponse
 *     par défaut. Une page qui n'affiche pas de date doit produire une
 *     proposition vide, pas une estimation.
 * ============================================================
 */

/** Une page officielle au-delà de ça n'est pas une page de bourse. */
const MAX_OCTETS_PAGE = 3 * 1024 * 1024;

/** Ce qu'on envoie au modèle. Au-delà, on coupe : la date limite d'une
 *  bourse est toujours dans le premier tiers utile de la page, et
 *  chaque millier de caractères se paie. */
const MAX_CARACTERES_TEXTE = 24000;

/** Les statuts que l'outil a le droit de proposer. Rien d'autre :
 *  le champ `status` du catalogue porte déjà quatorze orthographes
 *  écrites à la main, on n'en ajoute pas une quinzième. */
const STATUTS = ["ouverte", "fermee", "inconnu"];

/**
 * Le texte lisible d'une page HTML. Pas un analyseur : on retire ce
 * qui ne se lit jamais (script, style, balises), on décode les quelques
 * entités courantes, et on écrase les blancs.
 *
 * Volontairement simple. Un vrai analyseur DOM dans une Cloud Function
 * coûterait une dépendance de plus pour un gain nul : le modèle lit
 * très bien un texte imparfait, et c'est LUI qui juge.
 */
function texteDePage(html) {

  const brut = String(html || "");

  const sansScripts = brut
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ");

  // Les sauts de ligne des blocs sont conservés : ils séparent les
  // phrases, et une date collée à son libellé se lit mieux.
  const avecSauts = sansScripts
    .replace(/<\/(p|div|li|tr|h[1-6]|section|article|br)\s*>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n");

  const texte = avecSauts
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/[ \t ]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^[ \t]+|[ \t]+$/gm, "")
    .trim();

  return texte.length > MAX_CARACTERES_TEXTE
    ? `${texte.slice(0, MAX_CARACTERES_TEXTE)}\n\n[…page tronquée…]`
    : texte;

}

/** Les mois, en toutes lettres, français et anglais — pour vérifier
 *  qu'une date proposée est bien CITÉE dans la phrase source. */
const MOIS = [
  ["janvier", "january", "jan"],
  ["février", "fevrier", "february", "feb"],
  ["mars", "march", "mar"],
  ["avril", "april", "apr"],
  ["mai", "may"],
  ["juin", "june", "jun"],
  ["juillet", "july", "jul"],
  ["août", "aout", "august", "aug"],
  ["septembre", "september", "sep"],
  ["octobre", "october", "oct"],
  ["novembre", "november", "nov"],
  ["décembre", "decembre", "december", "dec"]
];

const sansAccents = (t) => String(t || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/**
 * LA GARDE QUI TIENT TOUT LE RESTE.
 *
 * Une date n'est acceptée que si l'ANNÉE et le MOIS apparaissent dans
 * la phrase source — le mois en chiffres ou en toutes lettres, dans
 * l'une des deux langues. Le jour est exigé lui aussi, sauf quand la
 * citation ne porte qu'un mois (« candidatures closes fin mars 2027 »),
 * auquel cas la date est refusée : un jour inventé est une date
 * inventée.
 *
 * C'est ce qui sépare cet outil du robot que admin/radar.js interdit.
 */
function dateCitee(iso, citation) {

  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(iso || ""))) return false;

  const texte = sansAccents(citation);
  if (!texte) return false;

  const [annee, mois, jour] = String(iso).split("-");

  if (!texte.includes(annee)) return false;

  const numMois = Number(mois);
  const numJour = Number(jour);

  // MOT ENTIER, et pas une inclusion : « maintenant » contient « mai »,
  // « mardi » contient « mar ». Une comparaison naïve validait donc une
  // date de mai sur la phrase « réponse attendue maintenant ». Trouvé
  // par le test, pas en relisant le code.
  const moisEnLettres = (MOIS[numMois - 1] || []).some((nom) => {
    const mot = sansAccents(nom).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`(^|[^a-z])${mot}([^a-z]|$)`).test(texte);
  });
  // « 15/03/2027 », « 2027-03-15 », « 15.3.2027 » — le mois en chiffres,
  // avec ou sans zéro initial.
  const moisEnChiffres = new RegExp(`(^|[^0-9])0?${numMois}([^0-9]|$)`).test(texte);

  if (!moisEnLettres && !moisEnChiffres) return false;

  return new RegExp(`(^|[^0-9])0?${numJour}([^0-9]|$)`).test(texte);

}

/**
 * Valide et normalise ce que le modèle a répondu.
 *
 * @param {Object} brut - l'objet JSON rendu par le modèle
 * @returns {{statut:string, deadlineISO:string, portail:string,
 *            citation:string, refus:string[]}}
 *          `refus` dit ce qui a été ÉCARTÉ et pourquoi : l'outil doit
 *          pouvoir expliquer son silence à l'administrateur, sinon
 *          celui-ci croira que la page ne disait rien.
 */
function lireProposition(brut) {

  const source = brut && typeof brut === "object" ? brut : {};
  const refus = [];

  const citation = typeof source.citation === "string" ? source.citation.trim().slice(0, 600) : "";

  let statut = String(source.statut || "").trim().toLowerCase();
  if (!STATUTS.includes(statut)) {
    if (statut) refus.push(`statut « ${statut} » inconnu — ignoré`);
    statut = "inconnu";
  }

  let deadlineISO = typeof source.deadlineISO === "string" ? source.deadlineISO.trim() : "";

  if (deadlineISO) {
    if (!citation) {
      refus.push("date écartée : aucune phrase source rapportée");
      deadlineISO = "";
    } else if (!dateCitee(deadlineISO, citation)) {
      refus.push(`date « ${deadlineISO} » écartée : elle n'apparaît pas dans la phrase citée`);
      deadlineISO = "";
    }
  }

  // Le portail : une URL, et rien d'autre. Un modèle qui répond
  // « voir le site » ne doit pas écrire « voir le site » dans un champ
  // que la carte de l'étudiant transformera en lien.
  let portail = typeof source.portail === "string" ? source.portail.trim() : "";
  if (portail && !/^https?:\/\/\S+$/i.test(portail)) {
    refus.push(`portail « ${portail} » écarté : ce n'est pas une adresse`);
    portail = "";
  }

  return { statut, deadlineISO, portail, citation, refus };

}

/**
 * Les consignes données au modèle. Écrites ici, à côté de la garde qui
 * les vérifie : si l'une change, l'autre se relit.
 */
const CONSIGNE_VERIFICATION = [
  "Tu lis la page officielle d'une bourse d'études et tu en extraits UNIQUEMENT ce qui y est écrit.",
  "Réponds par un objet JSON et rien d'autre, avec exactement ces clés :",
  '  "statut"      : "ouverte" si la page dit que les candidatures sont ouvertes, "fermee" si elle dit qu\'elles sont closes ou que la campagne est terminée, "inconnu" si la page ne le dit pas.',
  '  "deadlineISO" : la date limite de candidature au format AAAA-MM-JJ, UNIQUEMENT si la page l\'affiche avec son jour, son mois et son année. Chaîne vide dans tous les autres cas.',
  '  "portail"     : l\'adresse complète de la page où l\'on dépose sa candidature, si la page la donne. Chaîne vide sinon.',
  '  "citation"    : la phrase de la page, RECOPIÉE MOT POUR MOT, qui porte la date ou le statut. Chaîne vide si tu n\'en trouves aucune.',
  "",
  "TROIS RÈGLES, ET ELLES COMPTENT PLUS QUE LA COMPLÉTUDE DE TA RÉPONSE.",
  "(1) N'ESTIME JAMAIS. Si la page dit « les candidatures ouvrent généralement à l'automne », le statut est inconnu et la date est vide. Une date déduite coûterait une année à un étudiant.",
  "(2) LA CITATION DOIT CONTENIR LA DATE que tu proposes. Une date que ta citation ne porte pas sera écartée automatiquement : tu auras travaillé pour rien.",
  "(3) « JE NE SAIS PAS » EST UNE BONNE RÉPONSE. Un objet aux champs vides est utile ; une invention ne l'est pas."
].join("\n");

module.exports = {
  MAX_OCTETS_PAGE,
  MAX_CARACTERES_TEXTE,
  STATUTS,
  CONSIGNE_VERIFICATION,
  texteDePage,
  dateCitee,
  lireProposition
};
