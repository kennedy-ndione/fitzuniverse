/**
 * ============================================================
 * FitzUniverse — vérifier une bourse à sa source (Cloud Function)
 * ============================================================
 *
 * LOT P5b (2026-09-19). L'outil qui rafraîchit le catalogue.
 *
 * CE QU'IL NE FAIT PAS, ET C'EST LE PLUS IMPORTANT
 * ------------------------------------------------
 * admin/radar.js porte depuis sa création l'avertissement qui rend cet
 * outil dangereux : « un robot qui visiterait les 156 sites officiels
 * pour réécrire les dates […] transformerait "on ne sait pas" en une
 * date affirmée ». Cette fonction n'est pas ce robot :
 *
 *  - elle N'ÉCRIT RIEN. Elle lit une page et rend une PROPOSITION ;
 *    c'est l'administrateur qui écrit, depuis admin/verification.html ;
 *  - elle refuse toute date que la phrase citée ne porte pas
 *    littéralement (functions/lib/verification-bourse.js) ;
 *  - « je ne sais pas » est sa réponse par défaut.
 *
 * ELLE EST RÉSERVÉE AUX ADMINISTRATEURS, et pour deux raisons : elle
 * sort vers le web ouvert, et chaque appel coûte un appel de modèle.
 * Le contrôle est fait ICI, côté serveur — un verrou de page ne
 * protège pas une fonction appelable depuis une console.
 * ============================================================
 */

const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");

const {
  MAX_OCTETS_PAGE,
  CONSIGNE_VERIFICATION,
  texteDePage,
  lireProposition
} = require("./lib/verification-bourse");

if (!admin.apps.length) admin.initializeApp();

const cleAnthropic = defineSecret("ANTHROPIC_API_KEY");

/** Sonnet suffit largement : lire une page et en extraire une date est
 *  une tâche d'extraction, pas de jugement. Opus coûterait 2,5× plus
 *  cher pour le même résultat. */
const MODELE = "claude-sonnet-5";

/** Une page officielle met rarement plus de 20 secondes. Au-delà, le
 *  site est en panne — et l'administrateur doit le savoir tout de
 *  suite plutôt que d'attendre. */
const DELAI_RESEAU_MS = 20000;

function refus(codeCallable, message) {
  return new HttpsError(codeCallable, message);
}

/** Le site officiel de la bourse, tel que le catalogue le porte. */
async function lireBourse(scholarshipId) {

  const snap = await admin.firestore().doc(`scholarships/${scholarshipId}`).get();

  if (!snap.exists) throw refus("not-found", "Cette bourse n'existe pas dans le catalogue.");

  const bourse = snap.data() || {};
  const url = String(bourse.officialWebsite || "").trim();

  if (!/^https?:\/\/\S+$/i.test(url)) {
    throw refus("failed-precondition", "Cette bourse n'a pas de site officiel enregistré : renseignez-le d'abord.");
  }

  return { titre: String(bourse.title || scholarshipId), url };

}

/** Télécharge la page, en texte. Aucune exécution, aucun suivi de
 *  formulaire : on lit ce que le serveur renvoie, et rien de plus. */
async function telecharger(url) {

  const stop = AbortSignal.timeout(DELAI_RESEAU_MS);

  let reponse;
  try {
    reponse = await fetch(url, {
      signal: stop,
      redirect: "follow",
      headers: {
        // Se présenter honnêtement : un site officiel a le droit de
        // savoir qui le lit, et de nous bloquer s'il le souhaite.
        "User-Agent": "FitzUniverse/1.0 (verification de bourse; contact@fitzuniverse.com)",
        "Accept": "text/html,application/xhtml+xml"
      }
    });
  } catch (erreur) {
    throw refus("unavailable", `La page officielle n'a pas répondu (${erreur.name === "TimeoutError" ? "délai dépassé" : "réseau"}).`);
  }

  if (!reponse.ok) {
    throw refus("unavailable", `La page officielle a répondu ${reponse.status}. Le lien du catalogue est peut-être mort.`);
  }

  const brut = await reponse.arrayBuffer();

  if (brut.byteLength > MAX_OCTETS_PAGE) {
    throw refus("failed-precondition", "La page officielle est trop lourde pour être lue automatiquement.");
  }

  return new TextDecoder("utf-8", { fatal: false }).decode(brut);

}

/** Demande au modèle ce que la page DIT. La garde qui refuse ce qu'il
 *  déduit vit dans le module pur, pas ici. */
async function interroger(texte, contexte) {

  const Anthropic = require("@anthropic-ai/sdk");
  const cle = cleAnthropic.value();

  if (!cle) {
    logger.error("ANTHROPIC_API_KEY absente : le secret n'est pas attaché à verifierBourse");
    throw refus("internal", "L'outil de vérification est momentanément indisponible.");
  }

  const client = new Anthropic({ apiKey: cle });

  const reponse = await client.messages.create({
    model: MODELE,
    max_tokens: 700,
    system: CONSIGNE_VERIFICATION,
    messages: [{
      role: "user",
      content: `Bourse : ${contexte.titre}\nPage : ${contexte.url}\n\n---\n${texte}`
    }]
  });

  const sortie = (reponse.content || [])
    .filter((bloc) => bloc.type === "text")
    .map((bloc) => bloc.text)
    .join("")
    .trim();

  // Le modèle enveloppe parfois son JSON dans un bloc de code : on ne
  // s'en offusque pas, on prend ce qui est entre la première accolade
  // et la dernière.
  const debut = sortie.indexOf("{");
  const fin = sortie.lastIndexOf("}");

  if (debut < 0 || fin <= debut) {
    logger.warn("Réponse de vérification illisible", { url: contexte.url });
    return { brut: null, usage: reponse.usage || null };
  }

  try {
    return { brut: JSON.parse(sortie.slice(debut, fin + 1)), usage: reponse.usage || null };
  } catch (erreur) {
    logger.warn("JSON de vérification invalide", { url: contexte.url, message: erreur.message });
    return { brut: null, usage: reponse.usage || null };
  }

}

exports.verifierBourse = onCall(
  {
    secrets: [cleAnthropic],
    region: "europe-west1",
    maxInstances: 3,
    timeoutSeconds: 120,
    memory: "512MiB"
  },
  async (request) => {

    if (!request.auth) throw refus("unauthenticated", "Connectez-vous.");

    // LE VERROU EST ICI. La page admin en a un aussi, pour
    // l'ergonomie ; il ne protège rien — cette fonction est appelable
    // depuis n'importe quelle console de navigateur.
    const adminSnap = await admin.firestore().doc(`admins/${request.auth.uid}`).get();

    if (!adminSnap.exists || adminSnap.data().isActive !== true) {
      throw refus("permission-denied", "Outil réservé à l'équipe FitzUniverse.");
    }

    const scholarshipId = String(request.data?.scholarshipId || "").trim();

    if (!scholarshipId) throw refus("invalid-argument", "Quelle bourse ?");

    const contexte = await lireBourse(scholarshipId);

    const html = await telecharger(contexte.url);
    const texte = texteDePage(html);

    if (texte.length < 200) {
      throw refus("failed-precondition", "La page officielle ne contient presque aucun texte : elle est probablement construite en JavaScript, et doit être lue à la main.");
    }

    const { brut, usage } = await interroger(texte, contexte);

    const proposition = lireProposition(brut);

    logger.info("Bourse vérifiée", {
      scholarshipId,
      statut: proposition.statut,
      date: proposition.deadlineISO || "aucune",
      refus: proposition.refus.length,
      jetons: usage ? usage.input_tokens + usage.output_tokens : null
    });

    // On rend TOUT ce qui permet de juger : la proposition, la phrase
    // source, l'adresse lue, et ce qui a été écarté. L'administrateur
    // ne doit jamais avoir à faire confiance sans pouvoir vérifier.
    return {
      scholarshipId,
      titre: contexte.titre,
      url: contexte.url,
      ...proposition,
      lueLe: new Date().toISOString().slice(0, 10)
    };

  }
);
