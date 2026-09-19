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
  lireProposition,
  lienVersLEcheance
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

  /* LOT P5c : `pageEcheance` PRIME sur `officialWebsite`.
     Mesuré sur les dix premières vérifications : le site officiel mène
     souvent à une page de PRÉSENTATION du programme, qui ne porte
     aucune date — l'échéance vit une page plus loin. Quand
     l'administrateur a trouvé la bonne page, il l'épingle ici et la
     vérification suivante part directement du bon endroit, sans
     redépenser un aller-retour à la deviner. */
  const epinglee = String(bourse.pageEcheance || "").trim();
  const site = String(bourse.officialWebsite || "").trim();
  const url = /^https?:\/\/\S+$/i.test(epinglee) ? epinglee : site;

  if (!/^https?:\/\/\S+$/i.test(url)) {
    throw refus("failed-precondition", "Cette bourse n'a pas de site officiel enregistré : renseignez-le d'abord.");
  }

  return { titre: String(bourse.title || scholarshipId), url, epinglee: url === epinglee };

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

    /* LE MESSAGE DOIT DIRE LEQUEL DES DEUX, sinon il envoie chercher la
       mauvaise chose. Vu au premier essai réel, le 2026-09-19 : la
       Chinese Government Scholarship — la bourse la plus exposée du
       catalogue, 360 profils sur 360 — a répondu 412. Le message disait
       « le lien du catalogue est peut-être mort ». Il ne l'est pas : le
       site refuse les lecteurs automatiques, et un humain l'ouvre très
       bien dans son navigateur. Envoyer corriger un lien valide, c'est
       pire que ne rien dire.

       403 / 412 / 429 : le site nous voit et nous refuse — à lire à la
       main, le lien est bon.
       404 / 410 : la page n'existe plus — le lien est à corriger.
       Le reste : panne du site, à réessayer plus tard. */
    const code = reponse.status;

    if (code === 403 || code === 412 || code === 429) {
      throw refus("unavailable", `Ce site refuse les lecteurs automatiques (${code}). Le lien est probablement bon : ouvrez-le vous-même et lisez la date à la main.`);
    }

    if (code === 404 || code === 410) {
      throw refus("unavailable", `La page n'existe plus (${code}). C'est le lien du catalogue qu'il faut corriger.`);
    }

    throw refus("unavailable", `Le site officiel a répondu ${code} — il est probablement en panne. À réessayer plus tard.`);

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

    let { brut, usage } = await interroger(texte, contexte);
    let proposition = lireProposition(brut);
    let urlLue = contexte.url;
    let chemin = [];

    /* UN SEUL PAS DE PLUS, ET SEULEMENT S'IL LE FAUT.

       Quatre des dix premières bourses vérifiées n'ont rendu aucune
       date, et trois d'entre elles pointaient vers une page PROFONDE
       du site officiel : des pages de présentation du programme, pas
       la page de candidature. L'échéance vit un clic plus loin.

       On suit donc UN lien — celui qui dit « How to apply », « Dates »,
       « Candidater » — et on relit. Un seul, jamais deux : au-delà on
       ne sait plus quelle page on a lue, et le coût double à chaque
       cran. La page réellement lue est rapportée à l'administrateur.

       Naviguer n'est pas inventer : la garde « la date doit être citée »
       s'applique à la seconde lecture exactement comme à la première. */
    if (!proposition.deadlineISO) {

      const suivant = lienVersLEcheance(html, contexte.url);

      if (suivant) {

        chemin = [contexte.url, suivant];

        try {

          const html2 = await telecharger(suivant);
          const texte2 = texteDePage(html2);

          if (texte2.length >= 200) {
            const seconde = await interroger(texte2, { ...contexte, url: suivant });
            const p2 = lireProposition(seconde.brut);

            // On ne garde la seconde lecture que si elle APPORTE
            // quelque chose : une date, ou une citation là où la
            // première n'en avait aucune. Sinon la première reste —
            // écraser un résultat par un moins bon serait absurde.
            if (p2.deadlineISO || (!proposition.citation && p2.citation)) {
              proposition = p2;
              urlLue = suivant;
              usage = seconde.usage || usage;
            }
          }

        } catch (erreur) {
          // Le second lien ne répond pas : ce n'est pas un échec de la
          // vérification, c'est un lien de moins. On garde la première
          // lecture et on le dit dans le journal.
          logger.info("Second lien injoignable", { suivant, message: erreur.message });
        }

      }

    }

    logger.info("Bourse vérifiée", {
      scholarshipId,
      statut: proposition.statut,
      date: proposition.deadlineISO || "aucune",
      refus: proposition.refus.length,
      viaLien: urlLue !== contexte.url,
      jetons: usage ? usage.input_tokens + usage.output_tokens : null
    });

    // On rend TOUT ce qui permet de juger : la proposition, la phrase
    // source, l'adresse lue, et ce qui a été écarté. L'administrateur
    // ne doit jamais avoir à faire confiance sans pouvoir vérifier.
    return {
      scholarshipId,
      titre: contexte.titre,
      // `url` est la page d'où la réponse vient VRAIMENT — c'est elle
      // qui sera enregistrée comme source, et elle que l'administrateur
      // doit pouvoir ouvrir pour juger.
      url: urlLue,
      urlDepart: contexte.url,
      viaLien: urlLue !== contexte.url,
      chemin,
      epinglee: contexte.epinglee === true,
      ...proposition,
      lueLe: new Date().toISOString().slice(0, 10)
    };

  }
);
