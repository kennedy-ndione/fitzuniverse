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
/* CINQ LANGUES, ET CE N'EST PAS DU LUXE.

   TROUVÉ LE 2026-09-19, quelques minutes après la mise en ligne du
   diagnostic. DSU Toscana : Fitz a suivi le lien « Borsa di studio »,
   lu la bonne page, et rapporté la phrase exacte —

     « …fino alle ore 13.00 del 7 settembre 2026… »

   — puis proposé la date 2026-09-07. MA GARDE L'A REJETÉE :
   « elle n'apparaît pas dans la phrase citée ». Elle y était. Le mois
   s'écrivait « settembre », et ce tableau ne connaissait que le
   français et l'anglais.

   La garde marchait trop bien : elle écartait du VRAI. Et comme une
   large part de ce catalogue est faite d'agences régionales
   italiennes, elle l'écartait souvent.

   Le tableau du lien avait le même défaut, corrigé une heure plus
   tôt ; celui-ci était passé inaperçu parce qu'il est plus loin dans
   la chaîne — on ne l'atteint que si un lien a d'abord été suivi. */
const MOIS = [
  ["janvier", "january", "jan", "gennaio", "enero", "januar", "janeiro"],
  ["février", "fevrier", "february", "feb", "febbraio", "febrero", "februar", "fevereiro"],
  ["mars", "march", "mar", "marzo", "märz", "marz", "março", "marco"],
  ["avril", "april", "apr", "aprile", "abril"],
  ["mai", "may", "maggio", "mayo", "maio"],
  ["juin", "june", "jun", "giugno", "junio", "juni", "junho"],
  ["juillet", "july", "jul", "luglio", "julio", "juli", "julho"],
  ["août", "aout", "august", "aug", "agosto"],
  ["septembre", "september", "sep", "settembre", "septiembre", "setembro"],
  ["octobre", "october", "oct", "ottobre", "octubre", "oktober", "outubro"],
  ["novembre", "november", "nov", "noviembre", "novembro"],
  ["décembre", "decembre", "december", "dec", "dicembre", "diciembre", "dezember", "dezembro"]
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

/* ==========================================================
   LOT P5c (2026-09-19) — ALLER CHERCHER LA PAGE QUI PORTE LA DATE
   ==========================================================
   MESURÉ sur les dix premières bourses vérifiées : quatre n'ont rendu
   AUCUNE date. Trois d'entre elles pointaient pourtant vers une page
   profonde du site officiel (JASSO à quatre niveaux, Global Korea à
   trois, POSTECH à deux) — ce n'étaient pas des pages d'accueil mal
   renseignées, c'étaient des pages de PRÉSENTATION du programme.
   Elles décrivent la bourse, ses montants, ses conditions, et ne
   donnent jamais l'échéance : celle-ci vit une page plus loin, sous
   « How to apply », « Application », « Candidater ».

   Sur les 156 bourses du catalogue, 21 seulement (13 %) pointent vers
   une racine de site : corriger ces 21 liens ne réglerait donc presque
   rien. La profondeur du lien ne prédit pas la présence d'une date.

   Ce que fait cette fonction : elle choisit UN lien, sur la même page,
   qui mène vraisemblablement à l'endroit où l'échéance est écrite. La
   Cloud Function le suit UNE FOIS, relit, et dit à l'administrateur
   QUELLE page a finalement fourni la date.

   CE N'EST PAS LE ROBOT QUE admin/radar.js INTERDIT. Naviguer d'un
   lien n'est pas inventer : la garde « la date doit être citée » reste
   entière, la page réellement lue est rapportée, et rien n'est écrit
   sans un clic. C'est exactement ce que fait un humain qui cherche
   une date : il clique sur « Apply ».
   ========================================================== */

/** Les mots qui, dans un lien, annoncent la page de candidature. Deux
 *  langues, et les formes courtes : les sites officiels sont en
 *  anglais bien plus souvent qu'en français. */
const MOTS_CANDIDATURE = [
  // Anglais — la langue de la plupart des pages officielles.
  "how to apply", "how-to-apply", "application", "apply", "applications",
  "deadline", "deadlines", "dates", "calendar", "timeline", "eligibility",
  "admission", "admissions", "notice", "announcement", "call for",
  // Français.
  "candidature", "candidater", "postuler", "inscription", "calendrier",
  "appel a", "appel à", "bourse", "bourses",
  // Italien — une large part de ce catalogue est faite d'agences
  // régionales italiennes (LazioDisco, EDiSU, DSU Toscana, ER-GO,
  // ARDiS, ADiSU Campania…). L'omission de « borsa » a coûté à elle
  // seule la moitié des échecs mesurés le 2026-09-19.
  "bando", "bandi", "scadenz", "borsa", "borse", "studio", "iscrizion",
  // Espagnol, portugais, allemand.
  "convocatoria", "beca", "becas", "plazo",
  "bolsa", "bolsas", "candidatura", "prazo",
  "bewerbung", "bewerben", "frist", "stipendium", "ausschreibung"
];

/** Ce qui ne mène JAMAIS à une échéance, et qu'un score naïf
 *  choisirait pourtant : la page de connexion du portail, le
 *  formulaire de contact, les mentions légales. */
const MOTS_A_FUIR = ["login", "signin", "sign-in", "connexion", "privacy", "cookie", "contact", "faq", "login.aspx"];

/**
 * Le lien le plus prometteur de cette page vers l'échéance — ET DE QUOI
 * COMPRENDRE SON SILENCE.
 *
 * POURQUOI IL REND UN DIAGNOSTIC ET PLUS UNE SIMPLE CHAÎNE. Le
 * 2026-09-19, quatre bourses n'ont rendu aucune date et aucune n'a
 * suivi de lien. Pour savoir pourquoi, il a fallu ouvrir chaque page
 * à la main dans un navigateur — une demi-heure pour trois causes
 * différentes (un domaine voisin, un vocabulaire italien manquant, et
 * une troisième toujours inexpliquée). Un outil qui ne sait pas dire
 * ce qu'il a vu fait payer chaque échec en enquête manuelle.
 *
 * @param {string} html
 * @param {string} urlBase - la page lue, pour résoudre les liens
 *   relatifs et reconnaître le domaine officiel
 * @returns {{url:string, score:number, examines:number, retenus:number,
 *            meilleurs:Array<{url:string,libelle:string,score:number}>,
 *            horsDomaine:Array<{url:string,libelle:string,score:number}>}}
 *   `url` est vide quand rien ne se détache. `horsDomaine` porte les
 *   pistes d'un AUTRE site officiel : elles ne sont jamais suivies —
 *   voir la Cloud Function — mais elles sont montrées.
 */
function choisirLien(html, urlBase) {

  const vide = { url: "", score: 0, examines: 0, retenus: 0, meilleurs: [], horsDomaine: [] };

  let base;
  try { base = new URL(urlBase); } catch { return vide; }

  const ici = `${base.origin}${base.pathname.replace(/\/+$/, "")}`;
  const memeSite = new Map();
  const ailleurs = new Map();
  let examines = 0;

  for (const lien of String(html || "").matchAll(/<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {

    examines += 1;

    let url;
    try { url = new URL(lien[1], base); } catch { continue; }

    if (!/^https?:$/.test(url.protocol)) continue;

    // Le fragment est RETIRÉ, pas rejeté : « /apply#dates » est une
    // bonne piste. C'est seulement l'ancre vers la page courante qui
    // ne mène nulle part.
    url.hash = "";

    const cible = `${url.origin}${url.pathname.replace(/\/+$/, "")}`;
    if (cible === ici) continue;

    const libelle = sansAccents(lien[2].replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
    const chemin = sansAccents(url.pathname);
    const texte = `${libelle} ${chemin}`;

    if (MOTS_A_FUIR.some((m) => texte.includes(m))) continue;

    let score = 0;
    for (const mot of MOTS_CANDIDATURE) {
      const m = sansAccents(mot);
      // Le LIBELLÉ compte double : « How to apply » écrit dans le lien
      // est un signal bien plus fort que le mot « apply » perdu dans
      // une adresse — beaucoup de sites préfixent tout leur espace
      // candidat par /apply/.
      if (libelle.includes(m)) score += 2;
      if (chemin.includes(m)) score += 1;
    }

    if (!score) continue;

    const ou = url.host === base.host ? memeSite : ailleurs;
    const cle = url.toString();
    const vu = ou.get(cle);
    if (!vu || vu.score < score) ou.set(cle, { url: cle, libelle: libelle.slice(0, 80), score });

  }

  // Le meilleur score ; à égalité, l'adresse la plus courte — la page
  // « /apply » bat « /apply/step-3/faq ».
  const classer = (m) => [...m.values()].sort((a, b) => (b.score - a.score) || (a.url.length - b.url.length));

  const retenus = classer(memeSite);
  const externes = classer(ailleurs);

  return {
    url: retenus.length ? retenus[0].url : "",
    score: retenus.length ? retenus[0].score : 0,
    examines,
    retenus: retenus.length,
    meilleurs: retenus.slice(0, 3),
    horsDomaine: externes.slice(0, 3)
  };

}

/** L'ancienne signature, conservée : elle ne rend que l'adresse. */
function lienVersLEcheance(html, urlBase) {
  return choisirLien(html, urlBase).url;
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
  MOTS_CANDIDATURE,
  MOTS_A_FUIR,
  choisirLien,
  lienVersLEcheance,
  MAX_CARACTERES_TEXTE,
  STATUTS,
  CONSIGNE_VERIFICATION,
  texteDePage,
  dateCitee,
  lireProposition
};
