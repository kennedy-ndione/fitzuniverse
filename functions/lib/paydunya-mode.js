/**
 * ============================================================
 * functions/lib/paydunya-mode.js — test ou production, décidé par la clé
 * ============================================================
 *
 * PURE : aucun appel réseau, aucun secret lu ici. Testée par
 * test/paydunya-mode.test.mjs (lot BASCULE-AUTO, 2026-09-17).
 *
 * LE PROBLÈME QU'ELLE SUPPRIME
 * ----------------------------
 * Jusqu'ici, passer en paiement réel demandait DEUX gestes qui devaient
 * aller ensemble : remplacer les trois secrets par les clés `live_`, ET
 * changer à la main l'adresse de l'API dans functions/paiement.js
 * (`/sandbox-api/v1` → `/api/v1`). Un seul des deux, et PayDunya répond
 * « clé invalide » à chaque facture : plus aucun étudiant ne peut payer.
 *
 * Désormais l'adresse se DÉDUIT de la clé privée : PayDunya préfixe ses
 * clés privées `test_private_` (mode test) ou `live_private_`
 * (production). Changer les secrets suffit ; le code ne bouge plus.
 *
 * Une clé sans l'un de ces deux préfixes (valeur factice, collage
 * raté, clé publique mise à la place de la privée) n'est JAMAIS
 * devinée : `modePaydunya` renvoie null et creerPaiement refuse la
 * facture avec un message clair, au lieu d'envoyer l'étudiant vers une
 * erreur PayDunya incompréhensible.
 *
 * ET LE WEBHOOK
 * -------------
 * Chaque facture enregistre le mode dans lequel elle a été créée
 * (payments/{token}.mode). Au passage en production, des factures de
 * TEST peuvent encore être en attente — le sandbox notifie avec une
 * dizaine de minutes de retard, et on y paie avec de l'argent fictif.
 * `modeAcceptable` interdit qu'une facture de test active une formule
 * une fois le site en production (et l'inverse).
 * ============================================================
 */

const PREFIXES = {
  test: "test_private_",
  live: "live_private_",
};

const BASES = {
  test: "https://app.paydunya.com/sandbox-api/v1",
  live: "https://app.paydunya.com/api/v1",
};

/**
 * @param {string} clePrivee - la valeur du secret PAYDUNYA_PRIVATE_KEY
 * @returns {"test"|"live"|null} null si la clé n'a aucun préfixe connu
 */
function modePaydunya(clePrivee) {
  const cle = String(clePrivee || "").trim();
  if (cle.startsWith(PREFIXES.live)) return "live";
  if (cle.startsWith(PREFIXES.test)) return "test";
  return null;
}

/** L'adresse de l'API pour un mode, ou null pour un mode inconnu. */
function baseApi(mode) {
  return BASES[mode] || null;
}

/**
 * Une facture peut-elle activer une formule dans le mode actuel ?
 *
 * Les factures créées avant ce lot n'ont pas toujours été marquées
 * autrement que par « test » : un mode ABSENT est traité comme « test »,
 * par prudence — jamais comme « live ».
 */
function modeAcceptable(modeFacture, modeActuel) {
  if (!modeActuel) return false;
  const facture = modeFacture === "live" ? "live" : "test";
  return facture === modeActuel;
}

module.exports = { PREFIXES, BASES, modePaydunya, baseApi, modeAcceptable };
