/**
 * ============================================================
 * Fitz — relais IA de Fitz (Cloud Function)
 * ============================================================
 *
 * POURQUOI CETTE FONCTION EXISTE
 *
 * Fitz est une application 100 % navigateur (hébergement
 * statique Firebase + Firestore). Une clé d'API de fournisseur IA ne
 * peut donc PAS vivre côté client : tout ce que le navigateur télécharge
 * est lisible par n'importe quel visiteur, et une clé exposée est une
 * clé volée dans l'heure — facturée sur le compte de Fitz.
 *
 * C'est le seul et unique verrou qui empêchait de brancher une vraie IA.
 * Cette fonction le lève : le navigateur envoie {task, system, user} et
 * ne voit jamais la clé, qui reste dans Secret Manager côté serveur.
 *
 * ÉTAT : écrite, non déployée. Pour l'activer :
 *   1. cd functions && npm install
 *   2. firebase functions:secrets:set ANTHROPIC_API_KEY
 *   3. firebase deploy --only functions:fitzGenerate
 *   4. passer IS_SIMULATED à false dans js/ai/ai-client.js
 *
 * Tant que l'étape 4 n'est pas faite, l'application continue de tourner
 * sur le simulateur : déployer cette fonction ne change rien tout seul.
 * ============================================================
 */

const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const Anthropic = require("@anthropic-ai/sdk");

if (!admin.apps.length) admin.initializeApp();

const anthropicApiKey = defineSecret("ANTHROPIC_API_KEY");

// Tâches autorisées — la liste doit rester alignée sur BUILDERS dans
// js/ai/prompts.js. On refuse tout le reste plutôt que de relayer
// n'importe quel prompt : cette fonction est facturée à l'usage, elle ne
// doit pas devenir un accès générique à un modèle de langage.
const TACHES = {
  chat: { maxTokens: 2048, effort: "low" },
  letter: { maxTokens: 4096, effort: "medium" },
  email: { maxTokens: 2048, effort: "low" },
  translate: { maxTokens: 8192, effort: "low" },
  check: { maxTokens: 4096, effort: "medium" },
  readiness: { maxTokens: 2048, effort: "low" },
};

// Garde-fou de taille : un prompt anormalement long est soit un bug,
// soit un abus. 60 000 caractères laissent largement la place à un
// dossier complet tout en plafonnant le coût d'un appel isolé.
const MAX_PROMPT_CHARS = 60000;

// Formules donnant accès à Fitz : toutes SAUF "gratuit". Liste recopiée
// de PLAN_ORDER (js/plan-features.js) — la tenir à jour à chaque ajout
// d'offre, sinon un nouveau palier payant se verrait refuser Fitz.
//
// Portée volontairement limitée : ce contrôle répond à "ce compte a-t-il
// droit à Fitz, oui ou non", pas à "a-t-il droit à CET outil précis".
// Le détail par outil vient des indicateurs de config/planFeatures, que
// l'administrateur peut changer à chaud — le répliquer ici le ferait
// dériver silencieusement. Le verrouillage fin reste donc côté client ;
// ce qui est protégé ici, c'est la facture.
const FORMULES_AVEC_FITZ = [
  "premier-dossier",
  "essentiel",
  "accompagnement",
  "premium",
  "signature-focus",
  "signature",
];

/**
* Reproduit resolvePlan() + hasFitzExpressAccess() de js/access-guard.js.
* Volontairement dupliqué plutôt qu'importé : ce fichier tourne en
* CommonJS côté serveur, access-guard.js est un module ES qui importe le
* SDK Firebase navigateur. Toute évolution des règles de formule doit
* être répercutée ICI AUSSI.
*/
function estAutorise(userData) {
  if (!userData) return false;

  const expire = (valeur) => {
    if (!valeur) return true;
    const date = new Date(valeur);
    return isNaN(date) || date.getTime() < Date.now();
  };

  // Le pass Fitz Express donne accès au chat sans formule payante.
  if (userData.fitzExpressExpiresAt && !expire(userData.fitzExpressExpiresAt)) {
    return true;
  }

  const plan = String(userData.plan || "").toLowerCase();
  if (!FORMULES_AVEC_FITZ.includes(plan)) return false;

  return !userData.planExpiresAt || !expire(userData.planExpiresAt);
}

exports.fitzGenerate = onCall(
  {
    secrets: [anthropicApiKey],
    // Le relais est facturé à l'appel : on plafonne la concurrence pour
    // qu'un pic de trafic ne se transforme pas en facture surprise.
    maxInstances: 10,
    timeoutSeconds: 300,
    region: "europe-west1",
  },
  async (request, response) => {
    // 1. Authentification — jamais d'appel anonyme.
    if (!request.auth) {
      throw new HttpsError(
        "unauthenticated",
        "Connectez-vous pour utiliser Fitz."
      );
    }

    // 2. Formule — le verrouillage par formule n'existait que côté
    //    client (js/app-shell.js pose .is-locked et change les liens).
    //    C'est suffisant pour l'ergonomie, pas pour la facturation :
    //    rien n'empêche d'appeler cette fonction directement depuis la
    //    console du navigateur. Comme chaque appel coûte de l'argent
    //    réel, la formule est revérifiée ici, côté serveur.
    const snap = await admin
      .firestore()
      .doc(`users/${request.auth.uid}`)
      .get();

    if (!estAutorise(snap.data())) {
      throw new HttpsError(
        "permission-denied",
        "Fitz est inclus à partir de la formule Essentiel."
      );
    }

    const { task, system, user } = request.data || {};

    const config = TACHES[task];
    if (!config) {
      throw new HttpsError("invalid-argument", `Tâche inconnue : "${task}".`);
    }

    if (typeof system !== "string" || typeof user !== "string" || !user.trim()) {
      throw new HttpsError(
        "invalid-argument",
        "Le prompt doit contenir un texte système et un texte utilisateur."
      );
    }

    if (system.length + user.length > MAX_PROMPT_CHARS) {
      throw new HttpsError(
        "invalid-argument",
        "La demande est trop longue pour être traitée en une fois."
      );
    }

    const client = new Anthropic({ apiKey: anthropicApiKey.value() });

    try {
      const stream = client.messages.stream({
        model: "claude-opus-5",
        max_tokens: config.maxTokens,
        system,
        messages: [{ role: "user", content: user }],
        thinking: { type: "adaptive" },
        output_config: { effort: config.effort },
      });

      // Diffusion progressive quand le client la demande : c'est ce qui
      // donne l'effet "Fitz écrit sous vos yeux" que l'interface simule
      // déjà (voir toChunks dans js/ai/ai-client.js). Un client qui ne
      // sait pas lire un flux reçoit simplement la réponse complète.
      if (request.acceptsStreaming) {
        stream.on("text", (fragment) => {
          response.sendChunk({ delta: fragment });
        });
      }

      const message = await stream.finalMessage();

      // Un refus de sécurité arrive en HTTP 200 : sans ce test, on
      // renverrait une réponse vide sans savoir pourquoi.
      if (message.stop_reason === "refusal") {
        logger.warn("Refus du modèle", {
          task,
          category: message.stop_details?.category,
        });
        throw new HttpsError(
          "failed-precondition",
          "Fitz ne peut pas traiter cette demande."
        );
      }

      const text = message.content
        .filter((block) => block.type === "text")
        .map((block) => block.text)
        .join("");

      logger.info("Génération Fitz", {
        task,
        uid: request.auth.uid,
        inputTokens: message.usage.input_tokens,
        outputTokens: message.usage.output_tokens,
      });

      return { text, usage: message.usage };
    } catch (error) {
      if (error instanceof HttpsError) throw error;

      // On distingue ce qui vaut la peine d'être réessayé de ce qui ne
      // le vaut pas : l'interface affiche déjà un bouton "Réessayer"
      // (voir .ai-msg-retry, ai-chat.js), autant qu'il soit honnête.
      if (error instanceof Anthropic.RateLimitError) {
        throw new HttpsError(
          "resource-exhausted",
          "Fitz reçoit trop de demandes en ce moment — réessayez dans un instant."
        );
      }

      if (error instanceof Anthropic.AuthenticationError) {
        logger.error("Clé ANTHROPIC_API_KEY invalide ou absente");
        throw new HttpsError("internal", "Fitz est momentanément indisponible.");
      }

      logger.error("Échec de génération", { task, message: error.message });
      throw new HttpsError("internal", "Fitz n'a pas pu terminer sa réponse.");
    }
  }
);
