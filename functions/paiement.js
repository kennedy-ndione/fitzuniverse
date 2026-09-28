/**
 * ============================================================
 * FitzUniverse — paiements PayDunya (Cloud Functions)
 * ============================================================
 *
 * Deux fonctions, et une seule idée derrière les deux : le navigateur
 * ne décide de RIEN. Il demande « je veux acheter Ambition » ; c'est le
 * serveur qui décide combien ça coûte, et c'est PayDunya — pas le
 * navigateur — qui dit si c'est payé.
 *
 *   creerPaiement     (onCall)    le navigateur demande une facture
 *   paydunyaWebhook   (onRequest) PayDunya confirme le paiement
 *
 * POURQUOI DEUX FONCTIONS ET PAS UNE
 * ----------------------------------
 * Parce que l'étudiant peut disparaître entre les deux. Il paie sur
 * Wave, son forfait data expire, il ferme l'onglet, son téléphone
 * s'éteint. S'il fallait qu'il revienne sur le site pour que sa formule
 * s'active, on aurait des étudiants débités et sans accès — la pire
 * chose qui puisse arriver à ce produit.
 *
 * Le webhook, lui, arrive toujours : c'est PayDunya qui appelle notre
 * serveur, directement, sans passer par le navigateur de personne.
 * C'est LUI qui active la formule. Le retour au site n'est qu'un
 * confort d'affichage.
 *
 * ⚠️ CE FICHIER EST LA SEULE SOURCE DE VÉRITÉ DES PRIX CÔTÉ SERVEUR.
 * Il duplique pricing-plans.js, et cette duplication est assumée :
 * pricing-plans.js est un script navigateur, ce fichier tourne en
 * CommonJS côté serveur. Toute modification de la grille doit être
 * répercutée ICI AUSSI — comme elle doit déjà l'être dans
 * firestore.rules (slotPattern). Trois endroits, c'est le prix à payer
 * pour que le navigateur ne puisse jamais dicter un montant.
 * ============================================================
 */

const { onCall, onRequest, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const crypto = require("crypto");

if (!admin.apps.length) admin.initializeApp();

const paydunyaMasterKey = defineSecret("PAYDUNYA_MASTER_KEY");
const paydunyaPrivateKey = defineSecret("PAYDUNYA_PRIVATE_KEY");
const paydunyaToken = defineSecret("PAYDUNYA_TOKEN");

// La clé PUBLIQUE n'est volontairement PAS déclarée ici : elle ne sert
// pas à l'API de facturation (seules MASTER, PRIVATE et TOKEN partent
// en en-tête). Elle reste dans Secret Manager pour le jour où une
// intégration côté navigateur en aurait besoin.

// Domaine de production depuis le 2026-09-17 (fitzuniverse.com, branché sur
// Firebase Hosting). PayDunya l'affiche comme site de la boutique et y
// renvoie l'étudiant après paiement : il doit être le MÊME nom que le
// RCCM et le dossier KYC. test/domaine.test.mjs y veille.
const SITE = "https://fitzuniverse.com";

// TEST OU PRODUCTION : décidé par la clé privée, plus par une constante
// (lot BASCULE-AUTO, 2026-09-17). Une clé `test_private_…` envoie vers
// le sandbox, une clé `live_private_…` vers la production — une clé de
// test sur l'URL de production répond « clé invalide », et l'inverse
// aussi : les deux ne peuvent plus diverger. Passer en paiement réel =
// remplacer les trois secrets, puis redéployer creerPaiement ET
// paydunyaWebhook. Aucune ligne de code à changer.
// Voir functions/lib/paydunya-mode.js.
const { modePaydunya, baseApi, modeAcceptable } = require("./lib/paydunya-mode");

// Grille tarifaire et décision d'achat : functions/lib/achat.js (pur,
// testé par test/functions-achat.test.mjs). Grille B (2026-09-07) : les
// offres préinscription y écrivent `planPreinscription`, jamais `plan`.
// AUDIT 2026-10 : la confirmation de PayDunya, seule source de vérité
// avant de créditer (functions/lib/confirmation-paydunya.js).
const { jetonValide, cheminConfirmation, verdictConfirmation } = require("./lib/confirmation-paydunya");
// La suspension, lue hors du profil (audit 2026-10).
const { estSuspendu } = require("./lib/suspension");
const { GRILLE, offreDe, calculerMiseAJour, estEnVente, prixAvecDeduction, refusAchat, destinationNormalisee, destinationVendue, libelleOffre, clientPayDunya } = require("./lib/achat");

// ============================================================
// 1. creerPaiement — le navigateur demande une facture
// ============================================================

exports.creerPaiement = onCall(
  {
    secrets: [paydunyaMasterKey, paydunyaPrivateKey, paydunyaToken],
    region: "europe-west1",
    maxInstances: 10,
    timeoutSeconds: 60,
  },
  async (request) => {
    // 1. Identité. Un paiement anonyme n'aurait aucun compte à activer.
    if (!request.auth) {
      throw new HttpsError(
        "unauthenticated",
        "Connectez-vous pour régler votre accompagnement."
      );
    }

    // Une session ANONYME (la lecture de Fitz sur la page de résultats)
    // n'est pas un compte : l'accompagnement payé serait perdu avec elle.
    // Constaté le 2026-09-25 : deux factures ouvertes par des sessions
    // anonymes (Essentiel, Dossier France), jamais payées.
    const fournisseur = request.auth.token && request.auth.token.firebase
      ? request.auth.token.firebase.sign_in_provider
      : "";
    if (fournisseur === "anonymous") {
      throw new HttpsError(
        "unauthenticated",
        "Créez votre compte (ou connectez-vous) pour régler votre accompagnement."
      );
    }

    const uid = request.auth.uid;
    const { planId, method, destination: destinationDemandee } = request.data || {};

    // 2. Le prix. Le navigateur envoie un IDENTIFIANT, jamais un
    //    montant. Sans cette ligne, une console de développeur suffit
    //    à acheter Signature à 100 F.
    const offre = offreDe(planId);

    if (!offre) {
      throw new HttpsError("invalid-argument", "Cette formule n'est pas disponible.");
    }

    // 2 bis. Grille A (2026-09-07) : une offre retirée de la vente ne
    //    se paie pas, même en forgeant la requête. Le webhook, lui,
    //    continue d'honorer un paiement créé avant le retrait.
    if (!estEnVente(planId)) {
      throw new HttpsError(
        "failed-precondition",
        "Cette formule n'est plus en vente. Les formules actuelles sont sur la page des offres."
      );
    }

    // 2 ter. LA DESTINATION (2026-09-23). Une offre préinscription se
    //    vend pour un pays : la France par défaut, ou l'une des six
    //    destinations ouvertes le 23 septembre. Une destination inconnue
    //    est refusée ici, avant la facture ; une offre bourse l'ignore.
    if (offre.parcours === "preinscription" && !destinationVendue(destinationDemandee)) {
      throw new HttpsError("invalid-argument", "Cette destination n'est pas encore accompagnée.");
    }
    const destination = offre.parcours === "preinscription" ? destinationNormalisee(destinationDemandee) : "france";
    const libelle = libelleOffre(planId, destination) || offre.label;

    // 3. Le compte. On lit le nom et l'e-mail depuis Firestore plutôt
    //    que depuis la requête : la facture PayDunya doit porter
    //    l'identité du compte, pas celle que le navigateur prétend.
    const snap = await admin.firestore().doc(`users/${uid}`).get();
    const profil = snap.data() || {};

    // Audit 2026-10 : suspensions/{uid} fait foi ; `disabled` reste lu.
    if (await estSuspendu(admin.firestore(), uid, profil)) {
      throw new HttpsError("permission-denied", "Ce compte est suspendu.");
    }

    // 3 bis. NE JAMAIS VENDRE CE QUI N'AJOUTE RIEN (lot ACCEPTATION).
    //
    // Trois refus, réunis dans UNE fonction pure (functions/lib/achat.js,
    // refusAchat) : la même formule (active, ou terminée par l'admin) ;
    // une formule bourses qui n'ouvrirait aucune nouvelle place ; le
    // Pass Découverte à un compte qui a déjà le chat. Il n'y a jamais de
    // remboursement : le refus arrive ICI, avant que le moindre franc ne
    // bouge, et non dans le webhook.
    //
    // Le nombre de cartes bourses déjà présentes se lit sur
    // users/{uid}/applications, hors track "preinscription" (règle des
    // trois valeurs : un champ absent vaut « bourse »).
    let nombreCartesBourse = 0;
    if (offre.parcours === "bourse" && !offre.pass) {
      const cartes = await admin.firestore().collection(`users/${uid}/applications`).get();
      nombreCartesBourse = cartes.docs.filter((d) => (d.data() || {}).track !== "preinscription").length;
    }

    const refus = refusAchat({ planId, user: profil, nombreCartesBourse, destination });
    if (refus) {
      logger.info("Achat refusé avant facturation", { uid, planId, code: refus.code });
      throw new HttpsError("failed-precondition", refus.message);
    }

    // 3 ter. NE JAMAIS ENCAISSER CE QUI NE SERA PAS APPLIQUÉ (grille A).
    //    Le webhook refuse de rétrograder un client (statut
    //    "rang-inferieur") — jusqu'ici il le découvrait APRÈS le
    //    paiement, sans remboursement possible. La même décision est
    //    rejouée ici, à blanc, avant que le moindre franc ne bouge.
    const aBlanc = calculerMiseAJour({ planId, user: profil, supprimer: null, destination });
    if (aBlanc.statut === "rang-inferieur") {
      throw new HttpsError(
        "failed-precondition",
        "Votre formule actuelle est plus complète que celle-ci, et elle est encore active : " +
          "cet achat ne changerait rien à votre compte."
      );
    }

    // 3 quater. LES 10 000 F DU DIAGNOSTIC SE DÉDUISENT (lot
    //    DIAGNOSTIC-2, 2026-09-09). Calculé ICI, à partir du document
    //    users/{uid} lu au serveur : le navigateur n envoie qu un
    //    identifiant de formule, et un prix affiché faux resterait une
    //    erreur d affichage, jamais une remise obtenue.
    const tarif = prixAvecDeduction(planId, profil, new Date(), destination);
    const montant = tarif.prix;

    const facture = {
      invoice: {
        items: {
          item_0: {
            name: tarif.deduction ? libelle + " (" + tarif.mention + ")" : libelle,
            quantity: 1,
            unit_price: String(montant),
            total_price: String(montant),
            description: "Accompagnement aux candidatures universitaires internationales",
          },
        },
        total_amount: montant,
        description: `FitzUniverse — ${libelle}`,
      },
      store: {
        name: "FitzUniverse",
        tagline: "Accompagnement aux candidatures universitaires internationales",
        website_url: SITE,
      },
      // custom_data revient TEL QUEL dans le webhook. C'est le seul
      // fil qui relie une facture PayDunya à un compte Fitz — sans
      // lui, on saurait qu'un paiement a eu lieu sans savoir pour qui.
      custom_data: {
        uid,
        planId,
        destination,
        method: method || "non-precise",
      },
      actions: {
        return_url: `${SITE}/payment.html?paiement=ok&plan=${encodeURIComponent(planId)}${destination !== "france" ? `&destination=${encodeURIComponent(destination)}` : ""}`,
        cancel_url: `${SITE}/payment.html?paiement=annule&plan=${encodeURIComponent(planId)}${destination !== "france" ? `&destination=${encodeURIComponent(destination)}` : ""}`,
        callback_url:
          "https://europe-west1-scholarbridge-e0d84.cloudfunctions.net/paydunyaWebhook",
      },
    };

    // LOT 121 (2026-09-26) : nom, e-mail et téléphone sénégalais du
    // compte, pour que l'étudiant n'ait pas à les retaper chez PayDunya.
    const client = clientPayDunya(profil, request.auth.token && request.auth.token.email);
    if (client) facture.invoice.customer = client;

    // Les moyens de paiement ne sont volontairement PAS restreints
    // (`channels` absent) : la page PayDunya affiche alors tout ce qui
    // est activé sur l'application (carte, Wave, Orange Money, Free
    // Money, Expresso). Restreindre supposerait de deviner leurs
    // identifiants exacts, et priverait l'étudiant d'un repli si son
    // moyen habituel échoue. Le choix fait sur notre page est conservé
    // dans custom_data.method, pour la mesure.

    // Le mode vient de la clé. Une clé sans préfixe connu (valeur
    // factice, collage raté) n'est jamais devinée : on refuse la
    // facture ici plutôt que d'envoyer l'étudiant vers une erreur
    // PayDunya.
    const mode = modePaydunya(paydunyaPrivateKey.value());
    if (!mode) {
      logger.error("Clé privée PayDunya sans préfixe test_private_ ni live_private_ — facture refusée", { uid, planId });
      throw new HttpsError(
        "internal",
        "Le paiement n'a pas pu être lancé. Réessayez, ou écrivez-nous si cela persiste."
      );
    }

    let reponse;

    try {
      const appel = await fetch(`${baseApi(mode)}/checkout-invoice/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "PAYDUNYA-MASTER-KEY": paydunyaMasterKey.value(),
          "PAYDUNYA-PRIVATE-KEY": paydunyaPrivateKey.value(),
          "PAYDUNYA-TOKEN": paydunyaToken.value(),
        },
        body: JSON.stringify(facture),
      });

      reponse = await appel.json();
    } catch (erreur) {
      logger.error("PayDunya injoignable", { planId, uid, message: erreur.message });
      throw new HttpsError(
        "unavailable",
        "Le service de paiement ne répond pas. Réessayez dans un instant."
      );
    }

    // PayDunya répond en HTTP 200 même sur un refus : le verdict est
    // dans response_code, pas dans le statut HTTP. Ne jamais se fier
    // au seul `appel.ok`.
    if (reponse.response_code !== "00" || !reponse.token) {
      logger.error("PayDunya a refusé la facture", {
        planId,
        uid,
        code: reponse.response_code,
        texte: reponse.response_text,
      });
      throw new HttpsError(
        "internal",
        "La facture n'a pas pu être créée. Réessayez, ou contactez-nous si cela persiste."
      );
    }

    // On enregistre l'intention AVANT de renvoyer l'URL. Si le webhook
    // arrive pendant que l'étudiant paie — c'est fréquent, PayDunya est
    // rapide — il trouvera déjà le document et saura quoi en faire.
    await admin.firestore().doc(`payments/${reponse.token}`).set({
      uid,
      planId,
      // La destination du forfait préinscription ("france" par défaut) :
      // c'est elle que le webhook relit pour savoir quel dossier ouvrir.
      destination,
      label: libelle,
      montantAttendu: montant,
      montantCatalogue: tarif.base,
      deduction: tarif.deduction,
      devise: "XOF",
      methodeChoisie: method || null,
      statut: "en-attente",
      mode,
      creeLe: admin.firestore.FieldValue.serverTimestamp(),
    });

    logger.info("Facture créée", { uid, planId, token: reponse.token, mode });

    return { url: reponse.response_text, token: reponse.token };
  }
);

// ============================================================
// 2. paydunyaWebhook — PayDunya confirme le paiement
// ============================================================

/**
 * Applique un achat au compte, dans une transaction.
 *
 * Trois garanties :
 *
 * 1. IDEMPOTENCE — PayDunya rejoue ses notifications quand il n'obtient
 *    pas de réponse assez vite. Un abonnement de 9 mois ne doit jamais
 *    devenir 18 mois parce que le réseau a hoqueté. Le document
 *    payments/{token} sert de verrou : une fois marqué « paye », un
 *    second appel ne fait rien.
 *
 * 2. PAS DE RÉTROGRADATION — un client Signature qui achète un Premier
 *    Dossier ne doit pas se retrouver limité à une candidature. On
 *    compare les rangs et on garde le meilleur, en signalant le cas
 *    pour qu'un humain regarde.
 *
 * 3. PROLONGATION — racheter la même formule avant son échéance ajoute
 *    la durée à ce qui reste, plutôt que de repartir de zéro. Un
 *    étudiant prévoyant ne doit pas être puni de l'être.
 *
 * 4. MÊME MODE (lot BASCULE-AUTO) — une facture de test, payée avec de
 *    l'argent fictif, n'active jamais rien une fois le site en
 *    production, et l'inverse. Le document est marqué, le compte n'est
 *    pas touché.
 */
async function appliquerAchat(token, confirmation, modeActuel) {
  const fs = admin.firestore();
  const refPaiement = fs.doc(`payments/${token}`);

  return fs.runTransaction(async (tx) => {
    const paiement = await tx.get(refPaiement);

    if (!paiement.exists) {
      // Une facture qu'on n'a pas créée. Jamais normal : soit un rejeu
      // très tardif après nettoyage, soit quelqu'un qui frappe à la
      // porte. On trace et on ne touche à aucun compte.
      logger.warn("Webhook pour une facture inconnue", { token });
      return "inconnue";
    }

    const p = paiement.data();

    if (p.statut === "paye") {
      logger.info("Webhook rejoué, ignoré", { token });
      return "deja-traite";
    }

    if (!modeAcceptable(p.mode, modeActuel)) {
      logger.error("Facture d'un autre mode que le site — aucune activation", {
        token,
        modeFacture: p.mode || "absent",
        modeActuel: modeActuel || "clé invalide",
      });
      tx.update(refPaiement, {
        statut: "mode-incoherent",
        modeAuTraitement: modeActuel || null,
        traiteLe: admin.firestore.FieldValue.serverTimestamp(),
      });
      return "mode-incoherent";
    }

    // AUDIT 2026-10 : la CONFIRMATION de PayDunya (et non le corps de
    // l'IPN) décide. Statut "completed", et montant encaissé présent et
    // ÉGAL au prix que ce serveur a calculé à la création de la facture.
    // Absent, illisible, inférieur ou supérieur : rien n'est crédité. Le
    // document reste hors de « paye » : une confirmation ultérieure
    // correcte (nouvelle IPN) pourra encore l'appliquer.
    const verdict = verdictConfirmation(confirmation, { token, montantAttendu: p.montantAttendu });

    if (!verdict.ok) {
      const montantEnCause = verdict.motif === "montant-absent" || verdict.motif === "montant-different";
      logger.error("Confirmation PayDunya refusée — aucune activation", {
        token,
        motif: verdict.motif,
        statutPaydunya: verdict.statutPaydunya || null,
        attendu: p.montantAttendu,
        encaisse: verdict.montant ?? null,
      });
      tx.update(refPaiement, {
        statut: montantEnCause ? "montant-incoherent" : "confirmation-refusee",
        motifRefus: verdict.motif,
        statutPaydunya: verdict.statutPaydunya || null,
        montantEncaisse: verdict.montant ?? null,
        traiteLe: admin.firestore.FieldValue.serverTimestamp(),
      });
      return verdict.motif;
    }

    const encaisse = verdict.montant;

    const offre = offreDe(p.planId);

    if (!offre) {
      logger.error("Formule inconnue dans un paiement", { token, planId: p.planId });
      tx.update(refPaiement, { statut: "formule-inconnue" });
      return "formule-inconnue";
    }

    const refUser = fs.doc(`users/${p.uid}`);
    const userSnap = await tx.get(refUser);
    const user = userSnap.data() || {};

    const decision = calculerMiseAJour({
      planId: p.planId,
      user,
      maintenant: new Date(),
      supprimer: admin.firestore.FieldValue.delete(),
      // Absente sur les factures d'avant le 2026-09-23 : "france".
      destination: p.destination || "france",
    });

    if (decision.statut === "rang-inferieur") {
      // Rétrogradation : on encaisse (le paiement a eu lieu) mais on
      // ne dégrade pas le compte. Un humain tranchera — remboursement
      // exclu par la politique commerciale.
      logger.warn("Achat de rang inférieur, compte inchangé", {
        uid: p.uid,
        planActuel: decision.planActuel,
        planAchete: p.planId,
      });

      tx.update(refPaiement, {
        statut: "paye",
        applique: false,
        motif: "rang-inferieur-au-plan-actuel",
        traiteLe: admin.firestore.FieldValue.serverTimestamp(),
      });

      tx.set(refUser, decision.misAJour, { merge: true });
      return "rang-inferieur";
    }

    tx.set(refUser, decision.misAJour, { merge: true });

    tx.update(refPaiement, {
      statut: "paye",
      applique: true,
      montantEncaisse: encaisse,
      traiteLe: admin.firestore.FieldValue.serverTimestamp(),
    });

    logger.info("Formule activée", { uid: p.uid, planId: p.planId, token });

    return "applique";
  });
}

// Les dates (chaînes ISO, jamais des Timestamp) et l'arithmétique des
// échéances vivent dans functions/lib/achat.js.

// ============================================================
// LA CONFIRMATION PAYDUNYA — UN SEUL CODE (audit 2026-10)
// ============================================================
//
// Utilisée par le webhook ET par le bouton « Revérifier auprès de
// PayDunya » de l'administration (reverifierPaiement) : jamais deux
// copies. Demande à PayDunya l'état de la facture (GET
// /checkout-invoice/confirm/{token}, bac à sable en mode test, API réelle
// en production — functions/lib/paydunya-mode.js), puis l'applique dans
// la transaction idempotente d'appliquerAchat : un paiement déjà « paye »
// n'est jamais crédité deux fois, d'où qu'arrive la demande.
//
// Lève une erreur si la clé privée est illisible ou si PayDunya ne répond
// pas : rien n'est crédité, l'appelant décide (500 pour le webhook,
// « unavailable » pour l'administration).
function urlConfirmation(token) {
  const mode = modePaydunya(paydunyaPrivateKey.value());
  const base = baseApi(mode);
  if (!base) throw new Error("Clé privée PayDunya illisible — confirmation impossible");
  return { mode, url: `${base}${cheminConfirmation(token)}` };
}

async function confirmerEtAppliquer(token) {
  const { mode, url } = urlConfirmation(token);
  const appel = await fetch(url, {
    method: "GET",
    headers: {
      "PAYDUNYA-MASTER-KEY": paydunyaMasterKey.value(),
      "PAYDUNYA-PRIVATE-KEY": paydunyaPrivateKey.value(),
      "PAYDUNYA-TOKEN": paydunyaToken.value(),
    },
  });
  const confirmation = await appel.json();
  return appliquerAchat(token, confirmation, mode);
}

exports.paydunyaWebhook = onRequest(
  {
    // Les trois clés : le webhook redemande l'état de la facture à
    // PayDunya avant de créditer (audit 2026-10). La clé privée dit aussi
    // dans quel mode le site tourne (modeAcceptable).
    secrets: [paydunyaMasterKey, paydunyaPrivateKey, paydunyaToken],
    region: "europe-west1",
    maxInstances: 10,
    timeoutSeconds: 60,
    cors: false,
  },
  async (req, res) => {
    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }

    const data = req.body?.data;

    if (!data) {
      logger.warn("Webhook sans données");
      res.status(400).send("Bad Request");
      return;
    }

    // AUTHENTIFICATION. Cette URL est publique : n'importe qui peut la
    // trouver et la POSTer. Le seul élément qui prouve que l'appel
    // vient bien de PayDunya est ce condensat — le SHA-512 de notre
    // clé principale, que nous sommes seuls à connaître.
    //
    // Sans cette vérification, activer une formule Signature à 250 000 F
    // demanderait une requête fabriquée à la main. Avec elle, il faut
    // d'abord voler la clé.
    const attendu = crypto
      .createHash("sha512")
      .update(paydunyaMasterKey.value())
      .digest("hex");

    if (!egalConstant(String(data.hash || ""), attendu)) {
      logger.error("Webhook au condensat invalide — appel rejeté");
      res.status(401).send("Unauthorized");
      return;
    }

    const token = data?.invoice?.token;

    // Le jeton entre dans une URL (confirmation) et dans un chemin
    // Firestore : sa forme est vérifiée avant tout usage.
    if (!jetonValide(token)) {
      logger.warn("Webhook sans jeton de facture valide");
      res.status(400).send("Bad Request");
      return;
    }

    // Seul « completed » active quoi que ce soit. Les autres statuts
    // (pending, cancelled, failed) sont enregistrés pour le suivi mais
    // ne touchent jamais au compte.
    //
    // AUDIT 2026-10 : jamais par-dessus un paiement déjà appliqué, jamais
    // pour une facture qu'on n'a pas créée. Un `set(merge)` aveugle
    // remplaçait `statut: "paye"` — le verrou d'idempotence de
    // appliquerAchat — par « pending » : le rejeu suivant de l'IPN
    // « completed » créditait une seconde fois la durée (Pass Découverte,
    // dossier pays). Il créait aussi payments/<jeton inventé>.
    if (data.status !== "completed") {
      const statutIpn = String(data.status || "inconnu").slice(0, 40);
      const refPaiement = admin.firestore().doc(`payments/${token}`);
      await admin
        .firestore()
        .runTransaction(async (tx) => {
          const snap = await tx.get(refPaiement);
          if (!snap.exists) return;
          tx.update(refPaiement, {
            dernierStatutIpn: statutIpn,
            majLe: admin.firestore.FieldValue.serverTimestamp(),
            ...(snap.data().statut === "paye" ? {} : { statut: statutIpn }),
          });
        })
        .catch(() => {});

      res.status(200).send("OK");
      return;
    }

    // AUDIT 2026-10 : « completed » dans l'IPN ne suffit pas. On
    // redemande à PayDunya l'état de CETTE facture, et c'est sa réponse
    // — statut et montant — qui décide (confirmerEtAppliquer, le même
    // code que le bouton « Revérifier » de l'administration). Si PayDunya
    // ne répond pas, 500 : il réessaiera, et rien n'est crédité d'ici là.
    try {
      const issue = await confirmerEtAppliquer(token);
      logger.info("Webhook traité", { token, issue });
    } catch (erreur) {
      logger.error("Échec du traitement du webhook", { token, message: erreur.message });
      // On répond 500 volontairement : PayDunya réessaiera, et
      // l'idempotence garantit qu'un rejeu ne fera pas de dégât. Mieux
      // vaut un rejeu qu'un étudiant débité sans accès.
      res.status(500).send("Erreur interne");
      return;
    }

    // PayDunya attend un 200. Tout autre code le fera réessayer.
    res.status(200).send("OK");
  }
);

// Comparaison à temps constant : sur une chaîne secrète, un `===`
// classique s'arrête au premier caractère différent, ce qui laisse
// mesurer combien de caractères étaient bons. C'est une précaution
// bon marché, autant la prendre.
function egalConstant(a, b) {
  const A = Buffer.from(a);
  const B = Buffer.from(b);
  if (A.length !== B.length) return false;
  return crypto.timingSafeEqual(A, B);
}

// ============================================================
// 3. reverifierPaiement — le bouton « Revérifier auprès de PayDunya »
// ============================================================
//
// AUDIT 2026-10. Une IPN perdue (PayDunya en panne, webhook refusé
// pendant un déploiement) laisse une facture « en-attente » alors que
// l'étudiant a payé. L'administrateur relance la MÊME confirmation que le
// webhook (confirmerEtAppliquer) : même appel à PayDunya, mêmes refus
// (statut, jeton, montant), même transaction — jamais de double crédit.
// Réservé aux administrateurs actifs (admins/{uid}.isActive, comme
// verifierBourse et envoyerAlerteBourse).
exports.reverifierPaiement = onCall(
  {
    secrets: [paydunyaMasterKey, paydunyaPrivateKey, paydunyaToken],
    region: "europe-west1",
    maxInstances: 5,
    timeoutSeconds: 60,
  },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Connectez-vous.");
    }

    const adminSnap = await admin.firestore().doc(`admins/${request.auth.uid}`).get();

    if (!adminSnap.exists || adminSnap.data().isActive !== true) {
      throw new HttpsError("permission-denied", "Réservé à l'administration.");
    }

    const token = request.data && request.data.token;

    if (!jetonValide(token)) {
      throw new HttpsError("invalid-argument", "Jeton de facture invalide.");
    }

    const snap = await admin.firestore().doc(`payments/${token}`).get();

    if (!snap.exists) {
      throw new HttpsError("not-found", "Facture inconnue.");
    }

    let issue;

    try {
      issue = await confirmerEtAppliquer(token);
    } catch (erreur) {
      logger.error("Revérification PayDunya impossible", { token, par: request.auth.uid, message: erreur.message });
      throw new HttpsError("unavailable", "PayDunya ne répond pas. Réessayez dans un instant.");
    }

    // La trace : qui a relancé, quand, avec quelle issue.
    await admin.firestore().doc(`payments/${token}`).update({
      derniereReverification: {
        par: request.auth.uid,
        issue: String(issue),
        le: admin.firestore.FieldValue.serverTimestamp(),
      },
    });

    logger.info("Revérification PayDunya", { token, par: request.auth.uid, issue });

    return { issue };
  }
);
