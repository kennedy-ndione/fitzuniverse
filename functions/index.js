/**
 * ============================================================
 * FitzUniverse — point d'entrée des Cloud Functions
 * ============================================================
 *
 * Ce fichier ne contient AUCUNE logique : il déclare seulement les
 * réglages communs et expose les fonctions écrites ailleurs. Chaque
 * module déclare lui-même les secrets dont il a besoin, au plus près
 * de l'endroit où ils sont lus — c'est ce qui permet de savoir, en
 * ouvrant un fichier, à quoi il a accès.
 */

const { setGlobalOptions } = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");

// Plafond de concurrence, par fonction. Un pic de trafic dégrade la
// vitesse au lieu de faire exploser la facture — arbitrage assumé.
setGlobalOptions({ maxInstances: 10 });

// ------------------------------------------------------------
// Vérification d'infrastructure. Déployée le 2026-09-04 pour prouver
// que la chaîne Blaze → Cloud Build → Cloud Run fonctionnait.
// À SUPPRIMER une fois le premier paiement de test passé de bout en
// bout : une URL publique qui ne sert plus à rien n'a pas à rester.
// ------------------------------------------------------------
exports.ping = onRequest((req, res) => {
  res.json({ ok: true, message: "Cloud Functions opérationnel" });
});

// ------------------------------------------------------------
// Paiements PayDunya — voir functions/paiement.js.
// creerPaiement   : le navigateur demande une facture (onCall)
// paydunyaWebhook : PayDunya confirme le paiement (onRequest)
// Les deux vivent en europe-west1, bien plus proche de Dakar que la
// région par défaut.
// ------------------------------------------------------------
exports.creerPaiement = require("./paiement").creerPaiement;
exports.paydunyaWebhook = require("./paiement").paydunyaWebhook;

// ------------------------------------------------------------
// Relais IA de Fitz — voir functions/fitz.js.
// BRANCHÉ depuis le lot FITZ-RÉEL (2026-09-18) : js/ai/ai-gateway.js a
// été réécrit le 2026-09-04 pour appeler ce callable Firebase avec le
// SDK (httpsCallable + .stream()), et non plus un endpoint HTTP en flux
// SSE qui n'a jamais existé. MODE="passerelle" est actif dans
// js/ai/ai-config.js.
// ------------------------------------------------------------
exports.fitzGenerate = require("./fitz").fitzGenerate;

// ------------------------------------------------------------
// Portails de candidature — voir functions/portails.js.
// portails : rend la carte des portails à un client abonné (onCall).
// C'est le SEUL endroit d'où cette donnée sort désormais : elle a été
// retirée de l'instantané public assets/data/catalogue.json (lot S3),
// où n'importe qui la lisait sans compte et sans payer.
// ------------------------------------------------------------
exports.portails = require("./portails").portails;

// ------------------------------------------------------------
// Vérification d'une bourse à sa source — voir functions/verification.js.
// verifierBourse : lit la page officielle d'une bourse et RAPPORTE ce
// qu'elle y a lu (onCall, administrateurs seulement). Elle n'écrit
// rien : c'est admin/verification.html qui écrit, sur décision humaine.
// La règle est celle posée dans admin/radar.js — aucun robot ne
// transforme « on ne sait pas » en une date affirmée.
// ------------------------------------------------------------
exports.verifierBourse = require("./verification").verifierBourse;

// ------------------------------------------------------------
// E-mails transactionnels (Brevo) — voir functions/emails.js.
// LOT E-MAILS (2026-09-20), domaine authentifié chez Brevo le même jour.
// emailBienvenue       : un compte se crée → un mot de bienvenue (Firestore)
// envoyerAlerteBourse  : geste ADMIN — une bourse ouvre, on prévient
//                        ceux qui ont coché la case (onCall)
// desabonnementAlertes : le lien « ne plus m'écrire » des e-mails (onRequest)
// ------------------------------------------------------------
exports.emailBienvenue = require("./emails").emailBienvenue;
exports.envoyerAlerteBourse = require("./emails").envoyerAlerteBourse;
exports.desabonnementAlertes = require("./emails").desabonnementAlertes;
