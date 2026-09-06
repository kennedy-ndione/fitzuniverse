/**
 * ============================================================
 * FitzUniverse — relais IA de Fitz (Cloud Function)
 * ============================================================
 *
 * POURQUOI CETTE FONCTION EXISTE
 *
 * Fitz est une application 100 % navigateur. Tout ce que le navigateur
 * télécharge est lisible par n'importe quel visiteur : un accès direct
 * à un modèle de langage depuis le client serait facturé à FitzUniverse
 * par le premier venu. Cette fonction est le seul endroit d'où un
 * modèle peut être appelé.
 *
 * VERTEX AI PLUTÔT QUE L'API ANTHROPIC DIRECTE (décision du 2026-09-04)
 * ---------------------------------------------------------------------
 * Claude est revendu par Google dans Vertex AI. Trois conséquences :
 *
 *  1. **Aucune clé d'API.** La fonction s'authentifie avec sa propre
 *     identité de service Google (ADC). Il n'y a rien à stocker, rien à
 *     faire fuiter, rien à faire tourner. C'est le mode le plus sûr —
 *     une clé qui n'existe pas ne peut pas être volée.
 *  2. **Facturé sur le compte Google Cloud**, donc potentiellement sur
 *     le crédit d'essai de 300 $. Vertex coûte ~50 % de plus au jeton
 *     que l'API directe (3 $/15 $ contre 2 $/10 $ pour Sonnet 5 depuis
 *     la fin de la promotion le 31/08/2026), mais 50 % de plus sur un
 *     crédit déjà payé reste gratuit.
 *  3. **Régions** : `global` est le point d'entrée le moins cher. Le
 *     régional coûte 10 % de plus pour un gain de latence négligeable
 *     depuis Dakar.
 *
 * Pour revenir à l'API Anthropic directe un jour, il suffit de changer
 * `construireClient()` et de rétablir un secret ANTHROPIC_API_KEY :
 * tout le reste de ce fichier est identique dans les deux voies.
 *
 * ⚠️ LE SDK EST CHARGÉ À L'INTÉRIEUR DU GESTIONNAIRE, PAS EN TÊTE DE
 * FICHIER. Ce n'est pas un oubli. La CLI Firebase démarre ce code en
 * local pour lire la liste des fonctions exportées et ne lui laisse que
 * 10 secondes ; charger le SDK au niveau du module faisait échouer tous
 * les déploiements sous Windows (« Cannot determine backend
 * specification »). Bénéfice second : des démarrages à froid plus
 * rapides en production.
 * ============================================================
 */

const { onCall, HttpsError } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");

if (!admin.apps.length) admin.initializeApp();

const PROJET = "scholarbridge-e0d84";

// Point d'entrée du modèle. "global" est le moins cher (3 $/15 $ le
// million de jetons pour Sonnet 5, contre 3,30 $/16,50 $ en régional).
const REGION_MODELE = "global";

// ============================================================
// LES TÂCHES — modèle, plafond de sortie, poids
// ============================================================
/**
 * La liste doit rester alignée sur BUILDERS dans js/ai/prompts.js et
 * sur TACHES dans js/ai/ai-config.js. On refuse tout le reste plutôt
 * que de relayer n'importe quel prompt : cette fonction est facturée à
 * l'usage, elle ne doit pas devenir un accès générique à un modèle.
 *
 * LE MODÈLE EST CHOISI PAR TÂCHE (décision de Charles, 2026-09-04).
 * Sonnet 5 partout, SAUF la lettre de motivation et l'analyse de
 * dossier : ce sont les deux seules tâches où la sortie EST le produit
 * que l'étudiant a payé. Une lettre médiocre coûte une admission, pas
 * quelques francs d'écart de modèle.
 *
 * LE POIDS sert au plafond d'usage (voir plafondsDe). Un point vaut
 * approximativement 10 F CFA de coût attendu. Sans pondération, un
 * plafond « 40 appels par jour » ne protégerait rien : 40 analyses de
 * dossier coûtent douze fois plus que 40 messages de chat.
 *
 * `structuree` : la réponse doit être du JSON, pas de la prose. Voir
 * CHAMPS_REQUIS dans js/ai/ai-client.js.
 */
const TACHES = {
  chat: { modele: "claude-sonnet-5", maxTokens: 2048, poids: 1, structuree: false },
  email: { modele: "claude-sonnet-5", maxTokens: 2048, poids: 1, structuree: false },
  readiness: { modele: "claude-sonnet-5", maxTokens: 2048, poids: 1, structuree: true },
  translate: { modele: "claude-sonnet-5", maxTokens: 8192, poids: 7, structuree: false },
  letter: { modele: "claude-opus-5", maxTokens: 4096, poids: 4, structuree: false },
  check: { modele: "claude-opus-5", maxTokens: 4096, poids: 12, structuree: true },

  // LA SEULE TÂCHE OUVERTE AUX COMPTES GRATUITS.
  //
  // C'est la lecture personnalisée du test d'éligibilité. Le score, les
  // sous-scores et les opportunités compatibles sont calculés AILLEURS,
  // sans IA (eligibility-ai.js + recommend-programs.js sur le catalogue
  // réel) : Fitz ne calcule rien ici et n'invente rien, il LIT un
  // résultat déjà établi et le raconte à l'étudiant.
  //
  // Pourquoi elle est ouverte au gratuit : un étudiant qui donne cinq
  // minutes de son temps et reçoit un chiffre nu repart. Cette analyse
  // est le moment où il décide de faire confiance à FitzUniverse — donc
  // le moment où il crée un compte. La payer quelques francs à cet
  // instant précis, c'est de la prospection, pas une dépense.
  //
  // Son coût est borné de trois façons : entrée courte (le résultat
  // calculé, pas le dossier), sortie courte, et un plafond gratuit très
  // serré (voir PLAFONDS.gratuit). Le client l'enregistre ensuite sur
  // le diagnostic de l'étudiant : revenir sur sa page de résultats ne
  // doit JAMAIS relancer une génération.
  diagnostic: {
    modele: "claude-sonnet-5",
    maxTokens: 1024,
    poids: 1,
    structuree: false,
    ouvertAuGratuit: true,
  },
};

// Une image coûte de l'ordre de 1 000 à 1 600 jetons d'entrée. Elle
// pèse donc réellement, et le plafond doit le voir.
const POIDS_PAR_IMAGE = 1;

// Garde-fou de taille du texte. 60 000 caractères laissent la place à
// un dossier complet tout en plafonnant le coût d'un appel isolé.
const MAX_PROMPT_CHARS = 60000;

// Les captures d'écran sont le cœur de l'accompagnement (l'étudiant
// photographie le portail de son université, Fitz lui montre où
// cliquer). Mais chaque image coûte, et une pile de captures dans un
// seul appel est soit une erreur, soit un abus.
const MAX_IMAGES = 4;
const MAX_OCTETS_IMAGE = 4 * 1024 * 1024;
const TYPES_IMAGE = ["image/jpeg", "image/png", "image/webp", "image/gif"];

// ============================================================
// FORMULES ET PLAFONDS
// ============================================================
/**
 * Formules donnant accès à Fitz : toutes SAUF "gratuit". Recopié de
 * PLAN_ORDER (js/plan-features.js) — à tenir à jour à chaque ajout
 * d'offre, sinon un nouveau palier payant se verrait refuser Fitz.
 *
 * Portée volontairement limitée : ce contrôle répond à « ce compte
 * a-t-il droit à Fitz », pas à « a-t-il droit à CET outil ». Le détail
 * par outil vient des indicateurs de config/planFeatures, modifiables à
 * chaud par l'administrateur ; le répliquer ici le ferait dériver.
 * Ce qui est protégé ici, c'est la facture.
 */
const FORMULES_AVEC_FITZ = [
  "premier-dossier",
  "essentiel",
  "accompagnement",
  "premium",
  "signature-focus",
  "signature",
];

/**
 * Plafonds d'usage, en POINTS (voir `poids` ci-dessus).
 *
 * CALIBRAGE (2026-09-04) : environ 25 % du revenu mensuel de chaque
 * formule, à raison d'un point ≈ 10 F CFA de coût attendu. Exemple pour
 * Essentiel : 45 000 F sur 6 mois = 7 500 F/mois de recette, dont ~25 %
 * d'IA = ~1 875 F, soit ~190 points.
 *
 * ⚠️ CE SONT DES ESTIMATIONS, PAS DES MESURES. Les relever dès qu'on
 * aura la consommation réelle de vrais étudiants — c'est un chiffre à
 * corriger, pas une doctrine. Un plafond trop bas atteint par un
 * étudiant sérieux est un incident commercial : il doit être relevé,
 * pas défendu.
 *
 * Le plafond QUOTIDIEN n'existe pas pour économiser : il existe pour
 * qu'une boucle automatisée ou un compte partagé se heurte à un mur en
 * quelques heures, et pas en fin de mois.
 */
const PLAFONDS = {
  // Compte gratuit : la tâche `diagnostic` UNIQUEMENT, et à dose
  // homéopathique. Trois analyses par mois suffisent largement à
  // quelqu'un qui découvre la plateforme ; au-delà, ce n'est plus de
  // la découverte. Deux par jour ferment la porte au rechargement en
  // boucle avant qu'il ne coûte quoi que ce soit.
  gratuit: { jour: 2, mois: 3 },

  fitzExpress: { jour: 40, mois: 250 },
  "premier-dossier": { jour: 50, mois: 300 },
  essentiel: { jour: 40, mois: 190 },
  accompagnement: { jour: 45, mois: 210 },
  premium: { jour: 45, mois: 210 },
  "signature-focus": { jour: 70, mois: 400 },
  signature: { jour: 90, mois: 500 },
};

const PLAFOND_PAR_DEFAUT = { jour: 40, mois: 190 };

// ============================================================
// AUTORISATION
// ============================================================

function expire(valeur) {
  if (!valeur) return true;
  const date = new Date(valeur);
  return isNaN(date.getTime()) || date.getTime() < Date.now();
}

/**
 * Reproduit resolvePlan() + hasFitzExpressAccess() de js/access-guard.js.
 * Volontairement dupliqué plutôt qu'importé : ce fichier tourne en
 * CommonJS côté serveur, access-guard.js est un module ES qui importe
 * le SDK Firebase navigateur. Toute évolution des règles de formule
 * doit être répercutée ICI AUSSI.
 *
 * Renvoie la clé de formule à utiliser pour le plafond, ou null si
 * l'accès est refusé.
 */
function formuleActive(userData) {
  if (!userData) return null;

  const plan = String(userData.plan || "").toLowerCase();
  const planValide =
    FORMULES_AVEC_FITZ.includes(plan) &&
    (!userData.planExpiresAt || !expire(userData.planExpiresAt));

  if (planValide) return plan;

  // Le pass Fitz Express donne accès sans formule payante. Testé APRÈS
  // la formule : quelqu'un qui a les deux doit avoir le plafond de sa
  // formule, qui est le plus généreux.
  if (userData.fitzExpressExpiresAt && !expire(userData.fitzExpressExpiresAt)) {
    return "fitzExpress";
  }

  return null;
}

function plafondsDe(formule) {
  return PLAFONDS[formule] || PLAFOND_PAR_DEFAUT;
}

// ============================================================
// COMPTEUR D'USAGE
// ============================================================

function clesPeriode(maintenant) {
  const iso = maintenant.toISOString();
  return { jour: iso.slice(0, 10), mois: iso.slice(0, 7) };
}

/**
 * Réserve `points` sur les compteurs de l'étudiant, dans une
 * transaction. Lève si le plafond est atteint.
 *
 * La réservation a lieu AVANT l'appel au modèle. C'est délibéré : si
 * l'appel échoue ensuite, l'étudiant aura consommé quelques points pour
 * rien — c'est le prix d'un compteur qui ne peut pas être contourné par
 * une requête qui n'attend pas la réponse. L'inverse (compter après)
 * laisserait un client fermer la connexion à chaque appel pour ne
 * jamais être décompté.
 *
 * Les compteurs vivent dans un sous-document et non dans users/{uid} :
 * l'étudiant peut lire son propre document utilisateur, et il n'a pas à
 * découvrir la grille de plafonds ni à voir son solde changer sous ses
 * yeux à chaque message.
 */
async function reserverPoints(uid, formule, points) {
  const ref = admin.firestore().doc(`users/${uid}/interne/usageFitz`);
  const maintenant = new Date();
  const { jour, mois } = clesPeriode(maintenant);
  const plafonds = plafondsDe(formule);

  return admin.firestore().runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const etat = snap.exists ? snap.data() : {};

    const pointsJour = etat.jour === jour ? Number(etat.pointsJour) || 0 : 0;
    const pointsMois = etat.mois === mois ? Number(etat.pointsMois) || 0 : 0;

    if (pointsJour + points > plafonds.jour) {
      return { ok: false, portee: "jour", plafond: plafonds.jour };
    }

    if (pointsMois + points > plafonds.mois) {
      return { ok: false, portee: "mois", plafond: plafonds.mois };
    }

    tx.set(
      ref,
      {
        jour,
        mois,
        pointsJour: pointsJour + points,
        pointsMois: pointsMois + points,
        dernierAppelLe: maintenant.toISOString(),
      },
      { merge: true }
    );

    return { ok: true, restantJour: plafonds.jour - pointsJour - points };
  });
}

// ============================================================
// ERREURS — le serveur nomme lui-même le code Fitz
// ============================================================
/**
 * `details.fitzCode` porte le code de js/ai/ai-errors.js. Sans lui, le
 * client devrait deviner : "permission-denied" veut dire « formule
 * insuffisante » ici et « compte suspendu » ailleurs, et ai-errors.js
 * distingue les deux. Nommer le code à la source supprime la devinette.
 */
function refus(codeCallable, fitzCode, message) {
  return new HttpsError(codeCallable, message, { fitzCode });
}

// ============================================================
// LE CLIENT VERTEX
// ============================================================

function construireClient() {
  // Chargement paresseux : voir l'avertissement en tête de fichier.
  const { AnthropicVertex } = require("@anthropic-ai/vertex-sdk");
  return new AnthropicVertex({ projectId: PROJET, region: REGION_MODELE });
}

/**
 * Construit le contenu du message. Le texte d'abord, les images
 * ensuite — un modèle lit mieux une consigne posée avant les pièces
 * qu'elle commente.
 */
function construireContenu(user, images) {
  const blocs = [{ type: "text", text: user }];

  for (const image of images) {
    blocs.push({
      type: "image",
      source: { type: "base64", media_type: image.mediaType, data: image.data },
    });
  }

  return blocs;
}

function validerImages(images) {
  if (!Array.isArray(images) || images.length === 0) return [];

  if (images.length > MAX_IMAGES) {
    throw refus(
      "invalid-argument",
      "ENTREE_TROP_LONGUE",
      `Envoyez ${MAX_IMAGES} captures au maximum à la fois.`
    );
  }

  return images.map((image) => {
    const mediaType = String(image?.mediaType || "");
    const data = String(image?.data || "");

    if (!TYPES_IMAGE.includes(mediaType)) {
      throw refus(
        "invalid-argument",
        "CONTENU_REFUSE",
        "Ce format d'image n'est pas accepté. Envoyez une capture en JPG ou PNG."
      );
    }

    // La chaîne base64 pèse ~4/3 du fichier d'origine.
    if (data.length * 0.75 > MAX_OCTETS_IMAGE) {
      throw refus(
        "invalid-argument",
        "ENTREE_TROP_LONGUE",
        "Cette capture est trop lourde. Réduisez-la, puis renvoyez-la."
      );
    }

    return { mediaType, data };
  });
}

/**
 * Extrait un objet JSON d'une réponse de modèle.
 *
 * Un modèle à qui l'on demande du JSON en renvoie parfois entouré de
 * prose ou de clôtures Markdown. Plutôt que de rendre à l'étudiant une
 * page affichant « undefined », on récupère ce qui est récupérable, et
 * on échoue proprement sinon — js/ai/ai-client.js valide ensuite la
 * présence des champs dont l'absence casse l'affichage.
 */
function extraireJSON(texte) {
  const nettoye = texte
    .replace(/^\s*```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/, "")
    .trim();

  try {
    return JSON.parse(nettoye);
  } catch (e) {
    const debut = nettoye.indexOf("{");
    const fin = nettoye.lastIndexOf("}");

    if (debut === -1 || fin <= debut) return null;

    try {
      return JSON.parse(nettoye.slice(debut, fin + 1));
    } catch (e2) {
      return null;
    }
  }
}

// ============================================================
// LA FONCTION
// ============================================================

exports.fitzGenerate = onCall(
  {
    // Aucun secret : Vertex authentifie la fonction par son identité de
    // service. C'est tout l'intérêt de cette voie.
    region: "europe-west1",
    maxInstances: 10,
    timeoutSeconds: 300,
    memory: "512MiB",
  },
  async (request, response) => {
    // 1. Identité — jamais d'appel anonyme.
    if (!request.auth) {
      throw refus("unauthenticated", "AUTH", "Connectez-vous pour utiliser Fitz.");
    }

    const uid = request.auth.uid;
    const { task, system, user, images } = request.data || {};

    // 2. Tâche connue.
    const config = TACHES[task];

    if (!config) {
      throw refus("invalid-argument", "INCONNU", "Cette demande n'est pas reconnue.");
    }

    if (typeof system !== "string" || typeof user !== "string" || !user.trim()) {
      throw refus("invalid-argument", "INCONNU", "La demande est incomplète.");
    }

    if (system.length + user.length > MAX_PROMPT_CHARS) {
      throw refus(
        "invalid-argument",
        "ENTREE_TROP_LONGUE",
        "La demande est trop longue pour être traitée en une fois."
      );
    }

    const imagesValides = validerImages(images);

    // 3. Formule — le verrouillage côté client (js/app-shell.js) suffit
    //    pour l'ergonomie, pas pour la facturation : rien n'empêche
    //    d'appeler cette fonction depuis la console du navigateur.
    //    Chaque appel coûte de l'argent réel, la formule est donc
    //    revérifiée ici.
    const snap = await admin.firestore().doc(`users/${uid}`).get();
    const profil = snap.data();

    if (profil?.disabled === true) {
      throw refus("permission-denied", "AUTH", "Ce compte est suspendu.");
    }

    let formule = formuleActive(profil);

    if (!formule) {
      // Un compte sans formule payante n'a droit qu'aux tâches
      // explicitement ouvertes au gratuit — aujourd'hui la seule
      // lecture du diagnostic. Il est alors traité sous la formule
      // "gratuit", donc sous son plafond très serré.
      if (!config.ouvertAuGratuit) {
        throw refus(
          "permission-denied",
          "QUOTA_PLAN",
          "Fitz est inclus à partir de la formule Essentiel."
        );
      }

      formule = "gratuit";
    }

    // 4. Plafond d'usage — le seul endroit où la facture peut être
    //    arrêtée. Réservé AVANT l'appel : voir reserverPoints().
    const points = config.poids + imagesValides.length * POIDS_PAR_IMAGE;
    const reservation = await reserverPoints(uid, formule, points);

    if (!reservation.ok) {
      logger.info("Plafond Fitz atteint", { uid, formule, portee: reservation.portee });

      throw refus(
        "resource-exhausted",
        "QUOTA_PLAN",
        reservation.portee === "jour"
          ? "Vous avez atteint votre volume Fitz du jour. Il se renouvelle demain."
          : "Vous avez atteint votre volume Fitz du mois. Écrivez-nous si vous en avez besoin de plus."
      );
    }

    // 5. L'appel.
    const client = construireClient();

    try {
      const flux = client.messages.stream({
        model: config.modele,
        max_tokens: config.maxTokens,
        system,
        messages: [{ role: "user", content: construireContenu(user, imagesValides) }],
      });

      // Diffusion progressive quand le client la demande : c'est ce qui
      // donne l'effet « Fitz écrit sous vos yeux » que l'interface
      // simule déjà (toChunks dans js/ai/ai-client.js). Une tâche
      // structurée n'est jamais diffusée : un JSON à moitié écrit n'est
      // pas du JSON, l'afficher au fil de l'eau n'aurait aucun sens.
      if (request.acceptsStreaming && !config.structuree) {
        flux.on("text", (fragment) => {
          response.sendChunk({ delta: fragment });
        });
      }

      const message = await flux.finalMessage();

      // Un refus de sécurité arrive en HTTP 200 : sans ce test, on
      // renverrait une réponse vide sans savoir pourquoi.
      if (message.stop_reason === "refusal") {
        logger.warn("Refus du modèle", { task, uid });
        throw refus(
          "failed-precondition",
          "CONTENU_REFUSE",
          "Fitz ne peut pas traiter cette demande."
        );
      }

      const texte = message.content
        .filter((bloc) => bloc.type === "text")
        .map((bloc) => bloc.text)
        .join("");

      logger.info("Génération Fitz", {
        task,
        uid,
        formule,
        modele: config.modele,
        points,
        images: imagesValides.length,
        inputTokens: message.usage?.input_tokens,
        outputTokens: message.usage?.output_tokens,
      });

      const usage = {
        entree: message.usage?.input_tokens,
        sortie: message.usage?.output_tokens,
        points,
      };

      if (config.structuree) {
        const donnees = extraireJSON(texte);

        if (!donnees) {
          logger.warn("Réponse structurée illisible", { task, uid });
          throw refus(
            "internal",
            "REPONSE_INVALIDE",
            "La réponse de Fitz est arrivée incomplète."
          );
        }

        return { data: donnees, usage };
      }

      if (!texte.trim()) {
        throw refus("internal", "REPONSE_INVALIDE", "Fitz n'a rien renvoyé.");
      }

      return { text: texte, usage };
    } catch (erreur) {
      if (erreur instanceof HttpsError) throw erreur;

      // On distingue ce qui vaut la peine d'être réessayé de ce qui ne
      // le vaut pas : l'interface affiche un bouton « Réessayer », et il
      // doit être honnête. Les classes d'erreur du SDK Vertex héritent
      // de celles du SDK de base.
      const nom = erreur?.constructor?.name || "";
      const statut = erreur?.status;

      if (nom === "RateLimitError" || statut === 429) {
        throw refus(
          "resource-exhausted",
          "QUOTA_FOURNISSEUR",
          "Fitz reçoit trop de demandes en ce moment — réessayez dans un instant."
        );
      }

      if (nom === "AuthenticationError" || nom === "PermissionDeniedError" || statut === 401 || statut === 403) {
        // Sur Vertex, ça ne veut PAS dire « clé invalide » : il n'y a
        // pas de clé. Ça veut dire que le compte de service de la
        // fonction n'a pas le rôle Vertex AI User, ou que la facturation
        // du projet est suspendue. Deux causes à vérifier dans cet ordre.
        logger.error("Vertex refuse l'appel — vérifier le rôle aiplatform.user et la facturation", {
          message: erreur?.message,
        });
        throw refus("internal", "AUTH", "Fitz est momentanément indisponible.");
      }

      if (statut === 400 && /too long|max_tokens|context/i.test(String(erreur?.message))) {
        throw refus(
          "invalid-argument",
          "ENTREE_TROP_LONGUE",
          "Le texte envoyé est trop long pour être traité en une fois."
        );
      }

      if (statut >= 500) {
        throw refus(
          "unavailable",
          "FOURNISSEUR_INDISPONIBLE",
          "Fitz ne répond pas pour l'instant."
        );
      }

      logger.error("Échec de génération", { task, uid, message: erreur?.message });
      throw refus("internal", "INCONNU", "Fitz n'a pas pu terminer sa réponse.");
    }
  }
);
