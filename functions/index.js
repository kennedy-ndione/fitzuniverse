/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { setGlobalOptions } = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
setGlobalOptions({ maxInstances: 10 });

// Clés PayDunya (mode Test pour l'instant, mode Live plus tard — voir
// paydunya.com > Mon compte > API/Intégration). Valeurs à définir avec
// `firebase functions:secrets:set NOM_DU_SECRET` une fois le compte
// PayDunya créé — jamais codées en dur ici, jamais commitées.
const paydunyaMasterKey = defineSecret("PAYDUNYA_MASTER_KEY");
const paydunyaPrivateKey = defineSecret("PAYDUNYA_PRIVATE_KEY");
const paydunyaPublicKey = defineSecret("PAYDUNYA_PUBLIC_KEY");
const paydunyaToken = defineSecret("PAYDUNYA_TOKEN");

// Fonction de vérification uniquement — confirme que Cloud Functions est
// bien opérationnel (Blaze actif, déploiement OK) avant qu'on y ajoute la
// vraie logique PayDunya (créer transaction + webhook). À supprimer une
// fois ces 2 fonctions en place.
exports.ping = onRequest((req, res) => {
  res.json({ ok: true, message: "Cloud Functions opérationnel" });
});

// Relais IA de Fitz — voir functions/fitz.js pour la marche à suivre
// (npm install, secret, deploy) avant de basculer IS_SIMULATED côté client.
exports.fitzGenerate = require("./fitz").fitzGenerate;
