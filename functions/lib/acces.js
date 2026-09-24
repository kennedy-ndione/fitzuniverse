/**
 * ============================================================
 * FitzUniverse — qui a droit à la donnée payante (lot S3)
 * ============================================================
 *
 * Module PUR (aucun Firebase, aucun réseau) : il reçoit un document
 * users/{uid} et répond « abonnement actif, oui ou non ». C'est la
 * décision que la fonction `portails` applique avant de rendre quoi
 * que ce soit — et, pour la première fois sur ce produit, une décision
 * de DROIT prise par le serveur et non par un `hidden` dans le
 * navigateur.
 *
 * MIROIR ASSUMÉ de js/access-guard.js (resolvePlan,
 * resolvePlanPreinscription, hasFitzExpressAccess). Le client garde sa
 * copie parce qu'il doit décider quoi PEINDRE sans attendre le
 * serveur ; le serveur garde la sienne parce qu'il est le seul à
 * décider quoi ENVOYER. Les deux se contredisent le jour où l'une
 * change sans l'autre : test/portails.test.mjs compare les deux listes
 * de formules, exactement comme test/functions-achat.test.mjs compare
 * déjà les deux clôtures de campagne.
 *
 * LA RÈGLE, EN UNE PHRASE : un abonnement compte s'il existe, s'il est
 * dans le vocabulaire, et s'il n'est PAS EXPIRÉ. L'expiration est le
 * point qui a déjà été oublié une fois côté client (voir la note de
 * resolvePlan) : un forfait terminé doit se comporter exactement comme
 * un compte gratuit, jamais comme un compte payant.
 * ============================================================
 */

// MIROIR de PLAN_ORDER (js/plan-features.js), moins "gratuit" : les
// formules qui DONNENT droit. Les anciennes formules (essentiel,
// accompagnement, premium, signature-focus, signature) ont été
// SUPPRIMÉES le 2026-09-24 (décision de Charles) : aucun compte ne les
// portait, aucun paiement ne les nommait.
const PLANS_PAYANTS = [
  "premier-dossier",
  "essentiel-4",
  "conseiller-6",
];

// MIROIR de PLAN_PREINSCRIPTION_ORDER (js/plan-features.js).
const PLANS_PREINSCRIPTION = [
  "diagnostic-france",
  "dossier-france",
  "dossier-france-conseiller",
];

/**
 * Vrai si `valeur` est une date lisible ET encore à venir.
 * Une date absente vaut « pas d'échéance » ailleurs ; ici la fonction
 * ne répond QUE sur la date, l'appelant décide de ce qu'une absence
 * signifie pour lui.
 */
function encoreValide(valeur, maintenant) {
  if (!valeur) return false;
  const date = valeur && typeof valeur.toDate === "function" ? valeur.toDate() : new Date(valeur);
  return !isNaN(date) && date.getTime() >= maintenant.getTime();
}

/** Un forfait expiré se comporte comme aucun forfait. */
function expire(valeur, maintenant) {
  if (!valeur) return false;
  const date = valeur && typeof valeur.toDate === "function" ? valeur.toDate() : new Date(valeur);
  return !isNaN(date) && date.getTime() < maintenant.getTime();
}

/**
 * La formule bourse effective d'un compte : "" si absente, hors
 * vocabulaire, ou expirée.
 */
function planBourse(user, maintenant) {
  const brut = String((user && user.plan) || "").toLowerCase();
  if (!PLANS_PAYANTS.includes(brut)) return "";
  return expire(user.planExpiresAt, maintenant) ? "" : brut;
}

/** La formule préinscription effective d'un compte : "" si absente ou expirée. */
function planPreinscription(user, maintenant) {
  const brut = String((user && user.planPreinscription) || "").toLowerCase();
  if (!PLANS_PREINSCRIPTION.includes(brut)) return "";
  return expire(user.planPreinscriptionExpiresAt, maintenant) ? "" : brut;
}

/**
 * LES HUIT AUTRES PAYS (2026-09-23, relus le 2026-09-24) : un dossier
 * hors France vit dans users/{uid}.preinscriptionsPays.<pays> =
 * { plan, expiresAt }. Jusqu'ici ce module ne lisait que la France : un
 * étudiant qui avait payé un Dossier Chine se voyait refuser les
 * portails. MIROIR de droitsPreinscription (js/plan-features.js) : une
 * entrée hors France SANS échéance n'ouvre rien.
 * Rend { pays, plan } de la plus haute offre active, ou null.
 */
function offrePays(user, maintenant) {
  const carte = user && user.preinscriptionsPays && typeof user.preinscriptionsPays === "object" ? user.preinscriptionsPays : {};
  let meilleure = null;
  for (const [pays, entree] of Object.entries(carte)) {
    const plan = String((entree && entree.plan) || "").toLowerCase();
    if (!PLANS_PREINSCRIPTION.includes(plan)) continue;
    if (!encoreValide(entree.expiresAt, maintenant)) continue;
    if (!meilleure || PLANS_PREINSCRIPTION.indexOf(plan) > PLANS_PREINSCRIPTION.indexOf(meilleure.plan)) meilleure = { pays, plan };
  }
  return meilleure;
}

/**
 * Le droit d'accès à la donnée payante, et POURQUOI — la raison sert
 * aux journaux et au message rendu au client, jamais à décider deux
 * fois.
 *
 * @param {Object|null} user document users/{uid}
 * @param {Date} [maintenant]
 * @returns {{ autorise: boolean, motif: string, plan: string, planPreinscription: string }}
 */
function droitAuxPortails(user, maintenant = new Date()) {
  const u = user && typeof user === "object" ? user : {};

  // testerAccess (réservé à l'admin, voir firestore.rules) court-circuite
  // le verrouillage par formule pour un compte précis — même règle que
  // côté client, où il est le premier test de decideVerrou().
  if (u.testerAccess === true) {
    return { autorise: true, motif: "testerAccess", plan: "", planPreinscription: "" };
  }

  const bourse = planBourse(u, maintenant);
  const preinscription = planPreinscription(u, maintenant);

  if (bourse) return { autorise: true, motif: "plan", plan: bourse, planPreinscription: preinscription };
  if (preinscription) return { autorise: true, motif: "planPreinscription", plan: "", planPreinscription: preinscription };
  const pays = offrePays(u, maintenant);
  if (pays) return { autorise: true, motif: "preinscriptionPays", plan: "", planPreinscription: pays.plan, pays: pays.pays };

  // Le Pass Fitz Express n'est pas une formule et ne débloque, dans
  // l'espace étudiant, que le chat. Il donne quand même les portails :
  // c'est déjà la règle affichée par details.js depuis le 2026-08-31
  // (« un abonné voit toujours les liens, y compris Pass Express et
  // Premier Dossier »), et la changer ici retirerait en silence
  // quelque chose que des gens ont payé.
  if (encoreValide(u.fitzExpressExpiresAt, maintenant)) {
    return { autorise: true, motif: "fitzExpress", plan: "", planPreinscription: "" };
  }

  return { autorise: false, motif: "aucun_abonnement_actif", plan: "", planPreinscription: "" };
}

module.exports = { PLANS_PAYANTS, PLANS_PREINSCRIPTION, droitAuxPortails };
