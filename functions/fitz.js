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
 * L'API ANTHROPIC DIRECTE (décision du 2026-09-18, elle renverse celle
 * du 2026-09-04)
 * ---------------------------------------------------------------------
 * Le 2026-09-04, cette fonction avait été écrite pour Vertex AI, où
 * Google revend Claude. L'argument décisif était le deuxième des trois
 * ci-dessous, et c'est lui qui s'est révélé faux.
 *
 *  1. **Aucune clé d'API.** Vertex authentifie la fonction par son
 *     identité de service (ADC). C'était le vrai avantage : une clé qui
 *     n'existe pas ne peut pas être volée. On le perd, et on le paie en
 *     rangeant la clé dans Secret Manager — exactement là où vivent
 *     déjà les trois clés PayDunya. Le risque est connu et outillé.
 *  2. **« Facturé sur le crédit d'essai de 300 $, donc 50 % de plus sur
 *     un crédit déjà payé reste gratuit. »** FAUX : les modèles
 *     PARTENAIRES de Vertex (Anthropic, Mistral, Llama) sont facturés à
 *     part et le crédit d'essai Google ne les couvre pas. Le surcoût
 *     Vertex était donc payé plein tarif depuis le début. Vérifié le
 *     2026-09-18 ; source tierce, pas la doc Google elle-même, mais
 *     Charles paie désormais par carte, ce qui rend le point sans objet.
 *  3. **Régions** : sans objet en direct.
 *
 * CE QUE ÇA COÛTE, AUX PRIX DU 2026-09-18 (platform.claude.com) :
 *
 *   Sonnet 5   2 $ / 10 $  le million de jetons (Vertex : ~3 $ / 15 $)
 *   Opus 5     5 $ / 25 $
 *
 * Le barème de POIDS ci-dessous (« un point ≈ 10 F CFA ») a été
 * recalculé sur ces prix et reste juste : une analyse de dossier pèse
 * douze points et coûte de l'ordre de 110 F CFA.
 *
 * PAS DE CACHE DE PROMPT DANS CE LOT, ET C'EST VOULU. La lecture de
 * cache à 0,1× le prix d'entrée est le vrai levier pour ces six tâches,
 * qui renvoient toutes le même contexte long. Mais changer de
 * fournisseur ET la façon de construire les messages dans le même lot,
 * c'est ne plus savoir lequel des deux a cassé quoi. Lot suivant.
 *
 * Pour revenir à Vertex, il suffit de rétablir `construireClient()` et
 * de retirer le secret : tout le reste de ce fichier est identique dans
 * les deux voies.
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
const { defineSecret } = require("firebase-functions/params");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");

if (!admin.apps.length) admin.initializeApp();

// LA CLÉ DE L'API ANTHROPIC (lot FITZ-RÉEL, 2026-09-18).
//
// Déclarée ici, injectée dans la fonction par `secrets:` plus bas, et
// lue UNIQUEMENT dans construireClient(). Elle n'est jamais journalisée,
// jamais renvoyée au client, jamais écrite dans Firestore.
//
// Posée par : firebase functions:secrets:set ANTHROPIC_API_KEY
// (valeur saisie à l'invite, donc absente de l'historique du shell).
const cleAnthropic = defineSecret("ANTHROPIC_API_KEY");

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
// LE PLAFOND D'UNE TÂCHE STRUCTURÉE SE MESURE, IL NE S'ESTIME PAS
// (lot AI-STRUCTURE 2/2, 2026-09-18). `check` a consommé 2 424 jetons de
// sortie pour UNE lettre de quinze lignes, sur un plafond qui valait
// alors 4 096 : un dossier réel de plusieurs pièces le dépassait donc,
// et un JSON coupé en plein milieu n'est plus du JSON. Mesuré sur le
// compte de test le jour même. Un plafond haut ne coûte rien en soi —
// seuls les jetons réellement écrits sont facturés ; c'est la longueur
// des listes, bornée dans js/ai/prompts.js, qui tient la dépense.
const TACHES = {
  chat: { modele: "claude-sonnet-5", maxTokens: 2048, poids: 1, structuree: false },
  email: { modele: "claude-sonnet-5", maxTokens: 2048, poids: 1, structuree: false },
  readiness: { modele: "claude-sonnet-5", maxTokens: 4096, poids: 1, structuree: true },
  translate: { modele: "claude-sonnet-5", maxTokens: 8192, poids: 7, structuree: false },
  letter: { modele: "claude-opus-5", maxTokens: 4096, poids: 4, structuree: false },
  check: { modele: "claude-opus-5", maxTokens: 8192, poids: 12, structuree: true },

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
// FORMULES ET PLAFONDS — voir functions/lib/fitz-acces.js
// ============================================================
//
// La décision « ce compte a-t-il droit à Fitz, et jusqu'où » vivait ici,
// dans une liste recopiée à la main de js/plan-features.js — et elle
// avait dérivé : cinq offres retirées de la vente, les deux formules
// bourse vendues absentes, et aucune lecture de `planPreinscription`.
// Elle est désormais dans un module PUR, testé sous Node et comparé à la
// grille par test/pre-fitz.test.mjs (lot PRÉ-FITZ, 2026-09-10).
const { formuleActive, formuleDeDerogation, plafondsDe } = require("./lib/fitz-acces");

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
// LE CLIENT ANTHROPIC
// ============================================================

function construireClient() {
  // Chargement paresseux : voir l'avertissement en tête de fichier.
  const Anthropic = require("@anthropic-ai/sdk");
  const cle = cleAnthropic.value();
  // UNE CLÉ ABSENTE EST UN DÉFAUT DE DÉPLOIEMENT, PAS UNE PANNE DU
  // MODÈLE. Sans ce contrôle, le SDK partirait chercher
  // process.env.ANTHROPIC_API_KEY, échouerait plus loin, et le journal
  // dirait « authentification refusée » — ce qui enverrait chercher une
  // clé invalide alors qu'il n'y en a aucune.
  if (!cle) {
    logger.error("ANTHROPIC_API_KEY absente : le secret n'est pas attaché à la fonction");
    throw refus("internal", "AUTH", "Fitz est momentanément indisponible.");
  }
  return new Anthropic({ apiKey: cle });
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
    // La clé de l'API Anthropic, et elle seule (lot FITZ-RÉEL).
    secrets: [cleAnthropic],
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

    // 3 bis. Dérogations sans formule (lot FITZ-ACCÈS, 2026-09-19) — le
    //    miroir serveur de js/access-guard.js : le propriétaire
    //    (admins/{uid} actif) et testerAccess voyaient leurs outils
    //    OUVERTS par le client puis chaque appel refusé QUOTA_PLAN ici,
    //    avec un message de vente adressé... au propriétaire. La lecture
    //    du document admins ne coûte qu'aux comptes SANS formule : pour
    //    tous les étudiants payants, rien ne change.
    if (!formule) {
      let adminActif = false;
      if (profil?.testerAccess !== true) {
        const adminSnap = await admin.firestore().doc(`admins/${uid}`).get();
        adminActif = adminSnap.exists && adminSnap.data().isActive === true;
      }
      formule = formuleDeDerogation({ adminActif, testerAccess: profil?.testerAccess === true });
    }

    if (!formule) {
      // Un compte sans formule payante n'a droit qu'aux tâches
      // explicitement ouvertes au gratuit — aujourd'hui la seule
      // lecture du diagnostic. Il est alors traité sous la formule
      // "gratuit", donc sous son plafond très serré.
      if (!config.ouvertAuGratuit) {
        throw refus(
          "permission-denied",
          "QUOTA_PLAN",
          "Fitz est inclus dans les formules d'accompagnement — bourse ou Dossier France."
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
        // UNE RÉPONSE COUPÉE SE DIT, ELLE NE SE DEVINE PAS
        // (2026-09-18). `stop_reason === "max_tokens"` veut dire que le
        // modèle écrivait encore quand le plafond est tombé. Le test
        // passe AVANT l'analyse du JSON, et pas seulement en cas
        // d'échec d'analyse : un rapport tronqué peut se parser quand
        // la coupure tombe juste après une accolade, et rendre alors un
        // dossier « analysé » à qui il manque la moitié de ses points —
        // pire qu'une erreur franche. Et ce refus n'est PAS réessayable
        // (js/ai/ai-errors.js) : la même demande reproduirait la même
        // longueur, en facturant deux appels de plus.
        if (message.stop_reason === "max_tokens") {
          logger.warn("Réponse structurée tronquée", {
            task,
            uid,
            modele: config.modele,
            maxTokens: config.maxTokens,
            outputTokens: message.usage?.output_tokens,
          });
          throw refus(
            "internal",
            "REPONSE_TRONQUEE",
            "Le rapport de Fitz a été coupé avant la fin."
          );
        }

        const donnees = extraireJSON(texte);

        if (!donnees) {
          // CE QUI A ÉTÉ REÇU, PAS SEULEMENT LE FAIT DE L'ÉCHEC. La
          // version précédente ne journalisait que « illisible » : le
          // 2026-09-18, ce silence a coûté six appels facturés à
          // chercher à l'aveugle une cause que deux lignes de journal
          // auraient nommée. On journalise donc la FORME du texte reçu
          // — de quoi reconnaître prose, clôture Markdown ou coupure —
          // et volontairement pas son contenu : la réponse parle du
          // dossier d'un étudiant, elle n'a rien à faire en clair dans
          // un journal d'exploitation.
          logger.warn("Réponse structurée illisible", {
            task,
            uid,
            stopReason: message.stop_reason,
            longueur: texte.length,
            debut: texte.slice(0, 60),
            aUneAccolade: texte.includes("{"),
            aUneClotureMarkdown: texte.includes("```"),
          });
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
      // doit être honnête. Les noms de classes ci-dessous sont ceux du
      // SDK Anthropic (RateLimitError, AuthenticationError…) ; le SDK
      // Vertex en héritait, donc ce bloc n'a pas changé de forme en
      // changeant de voie.
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
        // TROIS CAUSES, DANS CET ORDRE DE PROBABILITÉ (lot FITZ-RÉEL) :
        // la clé a été révoquée ou remplacée dans la console Anthropic
        // sans que le secret soit remis à jour ; le crédit du compte
        // Anthropic est épuisé ; la limite de dépense mensuelle est
        // atteinte. Aucune n'est un défaut de code, et toutes les trois
        // se voient sur console.anthropic.com. Le message ne cite JAMAIS
        // la clé, même tronquée.
        logger.error("Anthropic refuse l'appel — vérifier, dans cet ordre : clé révoquée, crédit épuisé, limite de dépense atteinte", {
          message: erreur?.message,
          statut: statut,
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
