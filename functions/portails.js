/**
 * ============================================================
 * FitzUniverse — la carte des portails, réservée aux clients (S3)
 * ============================================================
 *
 * UNE fonction, `portails` (onCall, europe-west1), et une seule idée :
 * le portail de candidature est une donnée PAYANTE, donc le navigateur
 * ne doit jamais l'avoir sans qu'un serveur ait vérifié qui il est.
 *
 * AVANT CE LOT, le verrou n'existait pas. Le catalogue public
 * (assets/data/catalogue.json, servi en fichier statique par Hosting)
 * portait `applicationPortalUrl` en clair pour 147 universités sur 155 :
 * ouvrir l'URL du JSON suffisait. Le `hidden` posé sur le bouton par
 * details.js masquait un bouton, pas une donnée.
 *
 * CE QUE LA FONCTION LIT, ET CE QU'ELLE NE LIT PAS
 * -----------------------------------------------
 * La carte des portails vient d'un fichier EMBARQUÉ avec la fonction
 * (functions/data/catalogue-portails.json, écrit par
 * `scripts/lot.mjs export`), pas de Firestore : servir 147 URL ne doit
 * pas coûter 147 lectures, et surtout pas les coûter à chaque fiche
 * ouverte. Le fichier est chargé UNE fois par instance et gardé en
 * mémoire — une instance froide le lit, les suivantes non.
 *
 * Firestore n'est lu que pour UNE chose : users/{uid}, pour savoir si
 * le compte a un abonnement actif. Une lecture par session côté client
 * (js/portails.js garde la réponse en mémoire), zéro pour un anonyme,
 * qui est refusé avant toute lecture.
 *
 * CE QU'ELLE REND
 * ---------------
 *   { universites: {id: url}, programmes: {id: url}, bourses: {id: url} }
 * La carte ENTIÈRE, en une réponse. Rendre les portails un par un
 * aurait paru plus prudent et aurait coûté une lecture users/{uid} par
 * fiche consultée — pour la même donnée, au même client, qui y a droit.
 *
 * CE QU'ELLE NE FAIT PAS : aucune écriture, aucun effet de bord, aucun
 * journal nominatif. Le refus ne dit pas non plus QUELLE formule il
 * faudrait — l'interface, elle, ne montre rien du tout (règle du
 * 2026-08-31 : on ne montre pas une porte fermée).
 * ============================================================
 */

const { onCall, HttpsError } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
// La suspension, lue hors du profil (audit 2026-10).
const { estSuspendu } = require("./lib/suspension");

const { droitAuxPortails } = require("./lib/acces");

if (!admin.apps.length) admin.initializeApp();

// Chargé à la première demande, gardé pour la vie de l'instance. Un
// `require` d'un JSON serait équivalent ici, mais le lire explicitement
// permet de dire dans les journaux combien d'entrées ont été chargées —
// c'est-à-dire de voir tout de suite si le fichier a été déployé vide.
let carte = null;

function chargerCarte() {
  if (carte) return carte;
  // eslint-disable-next-line global-require
  const brut = require("./data/catalogue-portails.json");
  carte = {
    universites: (brut && brut.universites) || {},
    programmes: (brut && brut.programmes) || {},
    bourses: (brut && brut.bourses) || {},
    genereLe: (brut && brut.genereLe) || "",
  };
  logger.info("portails : carte chargée", {
    universites: Object.keys(carte.universites).length,
    programmes: Object.keys(carte.programmes).length,
    bourses: Object.keys(carte.bourses).length,
  });
  return carte;
}

exports.portails = onCall(
  {
    region: "europe-west1",
    maxInstances: 10,
    timeoutSeconds: 30,
  },
  async (request) => {
    // 1. Identité. Un anonyme est refusé AVANT toute lecture Firestore :
    //    un visiteur qui martèle la fonction ne doit rien coûter.
    if (!request.auth) {
      throw new HttpsError(
        "unauthenticated",
        "Connectez-vous pour accéder aux portails de candidature."
      );
    }

    const uid = request.auth.uid;

    // 2. Le droit. Une seule lecture, users/{uid}.
    let user = null;
    try {
      const snap = await admin.firestore().collection("users").doc(uid).get();
      user = snap.exists ? snap.data() : null;
    } catch (cause) {
      logger.error("portails : lecture users échouée", { uid, message: cause.message });
      throw new HttpsError("internal", "Impossible de vérifier votre accès pour le moment.");
    }

    // Audit 2026-10 : un compte suspendu n'obtient pas les portails, même
    // avec une formule en cours (suspensions/{uid}, ou `disabled`).
    let suspendu;
    try {
      suspendu = await estSuspendu(admin.firestore(), uid, user);
    } catch (cause) {
      logger.error("portails : lecture de la suspension échouée", { uid, message: cause.message });
      throw new HttpsError("internal", "Impossible de vérifier votre accès pour le moment.");
    }

    if (suspendu) {
      throw new HttpsError("permission-denied", "Ce compte est suspendu.");
    }

    const droit = droitAuxPortails(user, new Date());

    if (!droit.autorise) {
      // "permission-denied", et pas un objet vide : le client doit
      // pouvoir distinguer « pas le droit » de « pas de portail connu
      // pour cette université », qui n'appellent pas le même affichage.
      throw new HttpsError(
        "permission-denied",
        "Les portails de candidature sont réservés aux étudiants accompagnés."
      );
    }

    const c = chargerCarte();

    return {
      genereLe: c.genereLe,
      universites: c.universites,
      programmes: c.programmes,
      bourses: c.bourses,
    };
  }
);
