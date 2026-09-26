/**
 * ============================================================
 * FitzUniverse — e-mails transactionnels (Brevo)
 * ============================================================
 *
 * LOT E-MAILS (2026-09-20). Trois fonctions, une seule idée : le site
 * écrit aux étudiants DEPUIS le domaine fitzuniverse.com (authentifié
 * chez Brevo le 2026-09-20 : brevo-code, DKIM brevo1/brevo2, DMARC
 * posés dans la zone OVH), et jamais plus d'e-mails qu'ils n'en ont
 * demandé.
 *
 *   emailBienvenue        (Firestore) un compte se crée → un mot de
 *                         bienvenue, une seule fois
 *   envoyerAlerteBourse   (onCall)    GESTE ADMIN : une bourse ouvre →
 *                         prévenir ceux qui l'ont demandé
 *   desabonnementAlertes  (onRequest) le lien « ne plus m'écrire »,
 *                         obligatoire au bas de chaque alerte
 *
 * DOCTRINE
 * --------
 * - L'alerte ne part JAMAIS toute seule : c'est l'administrateur qui
 *   l'envoie, comme c'est lui qui écrit un statut (admin/radar.js).
 *   Aucun robot ne décide qu'une bourse « a ouvert ».
 * - On n'écrit qu'à ceux dont users/{uid}.alerteBourses === true — la
 *   case cochée à l'inscription (inscription.js), décochable par le
 *   lien de désinscription.
 * - Le plan gratuit Brevo plafonne à 300 e-mails/jour : chaque appel
 *   envoie au plus LOT_MAX destinataires et rapporte ce qui reste ;
 *   l'administrateur relance le lendemain. Le registre
 *   alertesBourses/{cle} garantit qu'un même compte ne reçoit jamais
 *   deux fois la même alerte, même en relançant.
 * - Un échec d'e-mail n'est jamais un échec de compte : la bienvenue
 *   qui ne part pas se contente d'une ligne de journal.
 * ============================================================
 */

const { onCall, onRequest, HttpsError } = require("firebase-functions/v2/https");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const rappels = require("./lib/rappels");
const { defineSecret } = require("firebase-functions/params");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const crypto = require("crypto");

if (!admin.apps.length) admin.initializeApp();

const cleBrevo = defineSecret("BREVO_API_KEY");

const SITE = "https://fitzuniverse.com";

/* L'expéditeur. Le domaine est authentifié : Brevo signe DKIM pour
   n'importe quelle adresse @fitzuniverse.com. Les RÉPONSES, elles,
   arrivent dans la boîte Zoho du domaine (les MX n'ont pas bougé) —
   cette adresse doit donc EXISTER côté Zoho, sinon les réponses
   rebondissent. */
const EXPEDITEUR = { name: "FitzUniverse", email: "contact@fitzuniverse.com" };

/* Plafond par appel, sous les 300/jour du plan gratuit Brevo — la
   marge (50) absorbe les bienvenues du même jour. */
const LOT_MAX = 250;

const API_BREVO = "https://api.brevo.com/v3/smtp/email";

// ------------------------------------------------------------
// Le socle : envoyer UN e-mail transactionnel via Brevo.
// ------------------------------------------------------------

async function envoyerEmail({ aEmail, aNom, sujet, html }) {

  const reponse = await fetch(API_BREVO, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
      "api-key": cleBrevo.value(),
    },
    body: JSON.stringify({
      sender: EXPEDITEUR,
      to: [{ email: aEmail, name: aNom || undefined }],
      subject: sujet,
      htmlContent: html,
    }),
  });

  if (!reponse.ok) {
    const texte = await reponse.text().catch(() => "");
    throw new Error(`Brevo ${reponse.status} : ${texte.slice(0, 200)}`);
  }

}

/* Le gabarit commun : sobre, texte d'abord, aucun visuel chargé.
   Volontairement proche d'un e-mail écrit à la main — c'est le ton du
   site (« une équipe humaine, pas Fitz »). */
function gabarit(corpsHtml, piedHtml) {
  return `<!DOCTYPE html><html lang="fr"><body style="margin:0;padding:0;background:#f6f2ea;">
<div style="max-width:560px;margin:0 auto;padding:32px 20px;font-family:Georgia,'Times New Roman',serif;color:#211D18;font-size:16px;line-height:1.6;">
<p style="margin:0 0 24px;font-family:Arial,Helvetica,sans-serif;font-weight:bold;letter-spacing:.02em;">FitzUniverse</p>
${corpsHtml}
<hr style="border:none;border-top:1px solid #d9d2c4;margin:32px 0 16px;">
<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#6b6459;">${piedHtml}</p>
</div></body></html>`;
}

function echapper(s) {
  return String(s || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// ------------------------------------------------------------
// Le lien de désinscription : uid + jeton HMAC, vérifiable sans
// stocker quoi que ce soit. La clé du HMAC est la clé Brevo — si elle
// tourne un jour, les anciens liens meurent avec elle, et c'est un
// comportement acceptable (le lien du prochain e-mail marchera).
// ------------------------------------------------------------

function jetonDesabonnement(uid) {
  return crypto.createHmac("sha256", cleBrevo.value()).update(`desabo:${uid}`).digest("hex").slice(0, 32);
}

function lienDesabonnement(uid) {
  return `https://europe-west1-scholarbridge-e0d84.cloudfunctions.net/desabonnementAlertes?u=${encodeURIComponent(uid)}&j=${jetonDesabonnement(uid)}`;
}

// ============================================================
// 1. emailBienvenue — un compte se crée, on dit bonjour. Une fois.
// ============================================================

exports.emailBienvenue = onDocumentCreated(
  {
    document: "users/{uid}",
    region: "europe-west1",
    secrets: [cleBrevo],
    maxInstances: 5,
  },
  async (event) => {

    const uid = event.params.uid;
    const u = event.data ? event.data.data() : null;

    if (!u || !u.email) {
      logger.info("Bienvenue sautée : document sans e-mail", { uid });
      return;
    }

    // IDEMPOTENCE. Firestore garantit « au moins une fois », pas
    // « exactement une fois » : le registre emailsEnvoyes fait foi.
    // create() échoue si le document existe — c'est le verrou.
    try {
      await admin.firestore().doc(`emailsEnvoyes/bienvenue-${uid}`).create({
        uid,
        envoyeLe: admin.firestore.FieldValue.serverTimestamp(),
      });
    } catch (e) {
      logger.info("Bienvenue déjà envoyée, rejeu ignoré", { uid });
      return;
    }

    const prenom = String(u.name || "").trim().split(/\s+/)[0] || "";

    const corps = `
<p style="margin:0 0 16px;">Bonjour${prenom ? " " + echapper(prenom) : ""},</p>
<p style="margin:0 0 16px;">Votre compte FitzUniverse est créé. Il vous attend ici :</p>
<p style="margin:0 0 16px;"><a href="${SITE}/dashboard.html" style="color:#8a5a00;">${SITE.replace("https://", "")}</a></p>
<p style="margin:0 0 16px;">Ce que vous pouvez faire dès maintenant : compléter votre profil,
et laisser Fitz vous dire où vos chances sont réelles — bourses ou préinscriptions.
Quand une bourse qui vous concerne ouvre ses candidatures, nous vous écrivons.</p>
<p style="margin:0;">L'équipe FitzUniverse</p>`;

    /* Le lien de désinscription est TOUJOURS là. On ne peut pas se fier
       à u.alerteBourses au moment du déclencheur : inscription.js
       l'écrit par updateDoc juste APRÈS la création, et ce déclencheur
       lit la photo d'avant (constaté au premier test réel, 2026-09-20 :
       case cochée, pied sans lien). Un lien offert à quelqu'un qui n'a
       rien coché est sans effet ; un abonné sans lien est un manquement. */
    const pied = `Vous recevez cet e-mail parce qu'un compte a été créé avec cette adresse sur fitzuniverse.com. <a href="${lienDesabonnement(uid)}" style="color:#6b6459;">Ne plus recevoir les alertes de bourses</a>.`;

    try {
      await envoyerEmail({
        aEmail: u.email,
        aNom: u.name || "",
        sujet: "Votre compte FitzUniverse est prêt",
        html: gabarit(corps, pied),
      });
      logger.info("Bienvenue envoyée", { uid });
    } catch (erreur) {
      // On ne relance PAS (pas de throw) : un compte sans e-mail de
      // bienvenue est un compte qui marche. Le registre garde la trace.
      logger.error("Bienvenue non envoyée", { uid, message: erreur.message });
      await admin.firestore().doc(`emailsEnvoyes/bienvenue-${uid}`).set(
        { echec: erreur.message.slice(0, 300) }, { merge: true }
      ).catch(() => {});
    }

  }
);

// ============================================================
// 2. envoyerAlerteBourse — GESTE ADMIN. Une bourse ouvre, on prévient
//    ceux qui l'ont demandé. Par lots, sans jamais écrire deux fois.
// ============================================================

exports.envoyerAlerteBourse = onCall(
  {
    secrets: [cleBrevo],
    region: "europe-west1",
    maxInstances: 1, // un seul envoi à la fois : le registre reste lisible
    timeoutSeconds: 300,
  },
  async (request) => {

    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Connectez-vous.");
    }

    // LE VERROU EST ICI, comme dans verifierBourse : un verrou de page
    // ne protège pas une fonction appelable depuis une console.
    const adminSnap = await admin.firestore().doc(`admins/${request.auth.uid}`).get();
    if (!adminSnap.exists || adminSnap.data().isActive !== true) {
      throw new HttpsError("permission-denied", "Réservé aux administrateurs.");
    }

    const scholarshipId = String((request.data || {}).scholarshipId || "").trim();
    if (!scholarshipId) {
      throw new HttpsError("invalid-argument", "Indiquez la bourse (scholarshipId).");
    }

    const snap = await admin.firestore().doc(`scholarships/${scholarshipId}`).get();
    if (!snap.exists) {
      throw new HttpsError("not-found", "Cette bourse n'existe pas dans le catalogue.");
    }

    const bourse = snap.data() || {};
    const titre = String(bourse.title || scholarshipId);

    // L'ÉCHÉANCE VIT SUR LES PROGRAMMES, pas sur la bourse (architecture
    // relationnelle du 2026-07-30 : une bourse × N universités = N
    // deadlines). Corrigé le 2026-09-20, le soir même : la première
    // version lisait bourse.deadlineISO, un champ qui n'existe pas —
    // la fonction aurait refusé TOUTES les bourses. On prend la plus
    // PROCHE des échéances futures citées de ses programmes.
    const progs = await admin.firestore().collection("programs")
      .where("scholarshipId", "==", scholarshipId).get();

    const aujourdhui = new Date().toISOString().slice(0, 10);
    const futures = progs.docs
      .map((d) => String((d.data() || {}).deadlineISO || "").trim())
      .filter((iso) => /^\d{4}-\d{2}-\d{2}$/.test(iso) && iso > aujourdhui)
      .sort();

    // On n'alerte que sur une échéance FUTURE et CITÉE — la même règle
    // que partout : la machine n'affirme jamais une date qu'elle n'a
    // pas. Pas de date, pas d'alerte.
    if (!futures.length) {
      throw new HttpsError(
        "failed-precondition",
        "Aucun programme de cette bourse ne porte d'échéance future citée : vérifiez-la d'abord (admin/verification.html)."
      );
    }

    const deadlineISO = futures[0];

    // LE REGISTRE. Une alerte = une bourse + une échéance. Le document
    // porte la liste des uid déjà servis : relancer demain reprend où
    // on s'est arrêté, sans doublon.
    const cle = `${scholarshipId}_${deadlineISO}`.replace(/[^\w.-]/g, "-");
    const refRegistre = admin.firestore().doc(`alertesBourses/${cle}`);
    const registre = (await refRegistre.get()).data() || {};
    const dejaServis = new Set(Array.isArray(registre.uids) ? registre.uids : []);

    // Les abonnés : la case cochée à l'inscription, rien d'autre.
    const abonnes = await admin.firestore().collection("users")
      .where("alerteBourses", "==", true).get();

    const aServir = abonnes.docs
      .map((d) => ({ uid: d.id, ...(d.data() || {}) }))
      .filter((u) => u.email && !dejaServis.has(u.uid) && u.disabled !== true);

    const lot = aServir.slice(0, LOT_MAX);

    const dateLisible = new Date(deadlineISO + "T12:00:00Z").toLocaleDateString("fr-FR", {
      day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
    });

    let envoyes = 0;
    const servisCeTour = [];

    for (const u of lot) {
      const prenom = String(u.name || "").trim().split(/\s+/)[0] || "";
      const corps = `
<p style="margin:0 0 16px;">Bonjour${prenom ? " " + echapper(prenom) : ""},</p>
<p style="margin:0 0 16px;">Une bourse suivie par FitzUniverse a ouvert ses candidatures :</p>
<p style="margin:0 0 16px;font-size:18px;"><strong>${echapper(titre)}</strong></p>
<p style="margin:0 0 16px;">La page officielle cite le <strong>${echapper(dateLisible)}</strong> comme date limite.
Vérifiez toujours cette date sur la page officielle avant de vous organiser — c'est elle qui fait foi.</p>
<p style="margin:0 0 16px;"><a href="${SITE}/scholarships.html" style="color:#8a5a00;">Voir la bourse dans le catalogue</a></p>
<p style="margin:0;">L'équipe FitzUniverse</p>`;
      const pied = `Vous recevez cette alerte parce que vous l'avez demandée à la création de votre compte fitzuniverse.com. <a href="${lienDesabonnement(u.uid)}" style="color:#6b6459;">Ne plus recevoir ces alertes</a>.`;

      try {
        await envoyerEmail({
          aEmail: u.email,
          aNom: u.name || "",
          sujet: `Bourse ouverte : ${titre}`,
          html: gabarit(corps, pied),
        });
        envoyes += 1;
        servisCeTour.push(u.uid);
      } catch (erreur) {
        // Un destinataire qui échoue n'arrête pas les autres, et n'est
        // PAS marqué servi : il sera retenté à la prochaine relance.
        logger.error("Alerte non envoyée à un destinataire", { uid: u.uid, message: erreur.message });
      }
    }

    await refRegistre.set({
      scholarshipId,
      deadlineISO,
      titre,
      uids: admin.firestore.FieldValue.arrayUnion(...(servisCeTour.length ? servisCeTour : ["_aucun_"])),
      dernierEnvoiLe: admin.firestore.FieldValue.serverTimestamp(),
      dernierEnvoiPar: request.auth.uid,
    }, { merge: true });

    const restants = aServir.length - lot.length + (lot.length - envoyes);

    logger.info("Alerte bourse envoyée", { scholarshipId, deadlineISO, envoyes, restants });

    return {
      envoyes,
      restants,
      message: restants > 0
        ? `${envoyes} e-mail(s) envoyé(s). ${restants} abonné(s) restant(s) — relancez demain (plafond quotidien Brevo).`
        : `${envoyes} e-mail(s) envoyé(s). Tous les abonnés sont servis.`,
    };

  }
);

// ============================================================
// 3. desabonnementAlertes — le lien du bas d'e-mail. Un clic suffit,
//    aucune connexion demandée : exiger un mot de passe pour se
//    désabonner est le meilleur moyen que personne ne le fasse.
// ============================================================

exports.desabonnementAlertes = onRequest(
  {
    secrets: [cleBrevo],
    region: "europe-west1",
    maxInstances: 5,
    cors: false,
  },
  async (req, res) => {

    const uid = String(req.query.u || "");
    const jeton = String(req.query.j || "");

    const page = (titre, phrase) => `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>${titre} | FitzUniverse</title></head>
<body style="margin:0;background:#f6f2ea;font-family:Georgia,serif;color:#211D18;">
<div style="max-width:520px;margin:80px auto;padding:0 20px;text-align:center;">
<p style="font-family:Arial,sans-serif;font-weight:bold;">FitzUniverse</p>
<h1 style="font-size:24px;">${titre}</h1><p style="line-height:1.6;">${phrase}</p>
<p><a href="${SITE}" style="color:#8a5a00;">Retourner sur fitzuniverse.com</a></p>
</div></body></html>`;

    // Jeton d'abord : sans lui, cette URL publique permettrait de
    // désabonner n'importe qui en devinant des uid.
    const attendu = jetonDesabonnement(uid);
    const A = Buffer.from(jeton);
    const B = Buffer.from(attendu);
    const valide = uid && A.length === B.length && crypto.timingSafeEqual(A, B);

    if (!valide) {
      res.status(400).send(page("Lien invalide", "Ce lien de désinscription est incomplet ou périmé. Utilisez le lien du dernier e-mail reçu."));
      return;
    }

    // Lot 111 : le même lien sert aux rappels d'échéance (t=rappels).
    const pourRappels = String(req.query.t || "") === "rappels";

    try {
      await admin.firestore().doc(`users/${uid}`).set(pourRappels ? {
        rappelsEcheances: false,
        rappelsEcheancesMajLe: admin.firestore.FieldValue.serverTimestamp(),
      } : {
        alerteBourses: false,
        alerteBoursesMajLe: admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });
    } catch (erreur) {
      logger.error("Désabonnement en échec", { uid, message: erreur.message });
      res.status(500).send(page("Une erreur est survenue", "Le désabonnement n'a pas pu être enregistré. Réessayez dans un instant."));
      return;
    }

    logger.info(pourRappels ? "Désabonnement des rappels d'échéance" : "Désabonnement des alertes", { uid });
    res.status(200).send(pourRappels
      ? page("C'est fait", "Vous ne recevrez plus de rappels de dates limites par e-mail. Vos échéances restent affichées dans votre espace, et vous pourrez réactiver les rappels depuis « Mes paramètres », rubrique Notifications e-mail.")
      : page("C'est fait", "Vous ne recevrez plus d'alertes de bourses. Vous pourrez les réactiver depuis votre espace, si vous changez d'avis."));

  }
);


// ============================================================
// 4. rappelsEcheances — LOT 111 (2026-09-26). Chaque matin, 8 h à
//    Dakar : un e-mail à l'étudiant dont une candidature qu'il suit
//    arrive à J-30, J-14, J-7, J-3, J-1 ou au jour J. Logique pure :
//    functions/lib/rappels.js.
//
//    Ce n'est pas une alerte de bourse (celles-là restent un geste
//    admin) : c'est la date que l'étudiant a lui-même acceptée, ou
//    que le catalogue a vérifiée pour lui, et qu'il ne doit pas rater.
//    Registre rappelsEcheances/{cle} : jamais deux fois le même palier.
//    Désinscription : users/{uid}.rappelsEcheances = false (lien au pied).
// ============================================================

/* Sous les 300 e-mails par jour du plan gratuit Brevo, en laissant la
   place aux bienvenues du jour. */
const RAPPELS_MAX_PAR_JOUR = 200;

async function executerRappels(aujourdhuiISO) {

  const db = admin.firestore();
  const users = await db.collection("users").get();
  let envoyes = 0;
  let sautes = 0;

  for (const docUser of users.docs) {

    if (envoyes >= RAPPELS_MAX_PAR_JOUR) {
      logger.warn("Plafond quotidien des rappels atteint", { envoyes });
      break;
    }

    const u = docUser.data() || {};
    if (!u.email || u.rappelsEcheances === false) continue;

    const apps = await db.collection(`users/${docUser.id}/applications`).get();
    const candidats = rappels.rappelsDuJour(apps.docs.map((d) => ({ id: d.id, ...d.data() })), aujourdhuiISO);
    if (!candidats.length) continue;

    // Le registre d'abord : un palier déjà envoyé ne repart pas.
    const aEnvoyer = [];
    for (const r of candidats) {
      const deja = await db.doc(`rappelsEcheances/${rappels.cleRappel(docUser.id, r)}`).get();
      if (!deja.exists) aEnvoyer.push(r);
    }
    if (!aEnvoyer.length) { sautes++; continue; }

    const prenom = String(u.name || "").trim().split(/\s+/)[0] || "";
    const pied = `Vous recevez ce rappel parce que vous suivez ces candidatures sur fitzuniverse.com. <a href="${lienDesabonnement(docUser.id)}&t=rappels" style="color:#6b6459;">Ne plus recevoir les rappels de dates limites</a>.`;

    try {
      await envoyerEmail({
        aEmail: u.email,
        aNom: u.name || "",
        sujet: rappels.sujetRappel(aEnvoyer),
        html: gabarit(rappels.corpsRappel(aEnvoyer, { prenom, site: SITE }), pied),
      });
      envoyes++;
      const lot = db.batch();
      for (const r of aEnvoyer) {
        lot.set(db.doc(`rappelsEcheances/${rappels.cleRappel(docUser.id, r)}`), {
          uid: docUser.id, applicationId: r.id, deadline: r.deadline, jours: r.jours,
          envoyeLe: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
      await lot.commit();
    } catch (erreur) {
      // Pas de registre : le rappel sera retenté demain seulement s'il
      // tombe encore sur un palier ; l'échec reste au journal.
      logger.error("Rappel non envoyé", { uid: docUser.id, message: erreur.message });
    }

  }

  logger.info("Rappels d'échéance", { jour: aujourdhuiISO, envoyes, sautes });
  return { envoyes, sautes };

}

exports.rappelsEcheances = onSchedule(
  {
    schedule: "0 8 * * *",
    timeZone: "Africa/Dakar",
    region: "europe-west1",
    secrets: [cleBrevo],
    maxInstances: 1,
    timeoutSeconds: 300,
  },
  async () => {
    await executerRappels(new Date().toISOString().slice(0, 10));
  }
);
