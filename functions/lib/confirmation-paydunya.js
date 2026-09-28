/**
 * functions/lib/confirmation-paydunya.js — le verdict de PayDunya lui-même
 *
 * AUDIT 2026-10. Le condensat d'une IPN prouve qu'elle a été signée avec
 * notre clé principale, pas que la facture a été payée : ce condensat est
 * le MÊME dans toutes les IPN, et qui en voit une seule peut en fabriquer
 * d'autres. Avant de créditer quoi que ce soit, le webhook redemande donc
 * l'état de la facture à PayDunya, par son jeton
 * (GET /checkout-invoice/confirm/{token}), et ne croit que cette réponse.
 *
 * On crédite SEULEMENT si :
 *   - PayDunya répond response_code "00" ;
 *   - le statut est "completed" ;
 *   - la facture confirmée est bien celle du jeton ;
 *   - le montant encaissé est présent et ÉGAL au prix que le serveur a
 *     calculé à la création de la facture (payments/{token}.montantAttendu).
 *     Ni inférieur (paiement partiel), ni supérieur (facture d'une autre
 *     offre), ni absent : un montant qu'on ne lit pas n'est pas un montant.
 *
 * PUR : aucun réseau ici. functions/paiement.js fait l'appel et passe la
 * réponse ; ce module rend un verdict, testé sous Node
 * (test/paydunya-confirmation.test.mjs).
 */

// Un jeton de facture PayDunya : lettres, chiffres, tiret, soulignement.
// Il sert à la fois dans une URL et dans un chemin Firestore : rien
// d'autre n'y entre (ni « / », ni « .. »).
const FORME_JETON = /^[A-Za-z0-9_-]{1,64}$/;

function jetonValide(token) {
  return typeof token === "string" && FORME_JETON.test(token);
}

function cheminConfirmation(token) {
  return `/checkout-invoice/confirm/${encodeURIComponent(token)}`;
}

// Un montant lu : nombre fini, ou chaîne de chiffres (PayDunya rend
// parfois "90000"). Tout le reste vaut « absent ».
function montantLu(valeur) {
  if (typeof valeur === "number") return Number.isFinite(valeur) ? valeur : null;
  if (typeof valeur === "string" && /^\s*\d+(\.\d+)?\s*$/.test(valeur)) return Number(valeur);
  return null;
}

/**
 * @param {Object} reponse         le JSON de /checkout-invoice/confirm/{token}
 * @param {Object} attendu
 * @param {string} attendu.token          le jeton de la facture
 * @param {number} attendu.montantAttendu le prix calculé par le serveur
 * @returns {{ ok: true, montant: number }
 *         | { ok: false, motif: string, statutPaydunya?: string, montant?: number|null }}
 */
function verdictConfirmation(reponse, { token, montantAttendu } = {}) {
  const r = reponse && typeof reponse === "object" ? reponse : {};
  const statutPaydunya = String(r.status || "").slice(0, 40);

  if (r.response_code !== "00") {
    return { ok: false, motif: "confirmation-refusee", statutPaydunya };
  }

  if (statutPaydunya !== "completed") {
    return { ok: false, motif: "non-complete", statutPaydunya };
  }

  const facture = r.invoice && typeof r.invoice === "object" ? r.invoice : {};

  if (facture.token !== undefined && facture.token !== token) {
    return { ok: false, motif: "jeton-different", statutPaydunya };
  }

  const prevu = Number(montantAttendu);

  if (!Number.isFinite(prevu) || prevu <= 0) {
    return { ok: false, motif: "montant-attendu-illisible", statutPaydunya };
  }

  const montant = montantLu(facture.total_amount);

  if (montant === null) {
    return { ok: false, motif: "montant-absent", statutPaydunya, montant: null };
  }

  if (montant !== prevu) {
    return { ok: false, motif: "montant-different", statutPaydunya, montant };
  }

  return { ok: true, montant };
}

module.exports = { FORME_JETON, jetonValide, cheminConfirmation, montantLu, verdictConfirmation };
