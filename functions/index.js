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
// ÉCRIT MAIS NON BRANCHÉ : le client (js/ai/ai-gateway.js) attend un
// endpoint HTTP en flux SSE, alors que fitz.js est un onCall. Les deux
// contrats sont incompatibles — il faudra trancher avant d'activer
// MODE="passerelle" dans js/ai/ai-config.js.
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
