/**
 * functions/lib/suspension.js — un compte est-il suspendu ?
 *
 * AUDIT 2026-10. La suspension vit HORS du profil, dans suspensions/{uid},
 * que seul un administrateur écrit (firestore.rules). Le champ `disabled`
 * du profil ne suffisait pas : l'étudiant supprimait son profil puis le
 * recréait sans lui. `disabled` reste lu, pour les suspensions posées
 * avant ce lot.
 *
 * Le module ne connaît Firestore que par l'objet `db` qu'on lui passe
 * (admin.firestore() en production, une doublure en test).
 */

/**
 * @param {Object} db      admin.firestore()
 * @param {string} uid
 * @param {Object} [profil] users/{uid} déjà lu (ou undefined s'il n'existe pas)
 * @returns {Promise<boolean>}
 */
async function estSuspendu(db, uid, profil) {
  if (profil && profil.disabled === true) return true;
  const snap = await db.doc(`suspensions/${uid}`).get();
  return snap.exists && (snap.data() || {}).suspendu === true;
}

/**
 * Les uid suspendus, en UNE requête — pour les envois par lots
 * (alertes), sans une lecture par destinataire.
 * @returns {Promise<Set<string>>}
 */
async function uidsSuspendus(db) {
  const snap = await db.collection("suspensions").where("suspendu", "==", true).get();
  return new Set(snap.docs.map((d) => d.id));
}

module.exports = { estSuspendu, uidsSuspendus };
