/**
 * ============================================================
 * Fitz — LE point d'entrée unique du catalogue public
 * ============================================================
 *
 * Toute lecture des collections `programs`, `universities` et
 * `scholarships` passe par ici. Aucun autre module du site (hors
 * admin/, qui a ses propres outils ponctuels) ne doit appeler
 * getDocs(collection(db, …)) sur ces trois collections — une garde
 * automatique le vérifie : test/catalog-cache.test.mjs.
 *
 * DEUX ÉTAGES, DEPUIS LE 2026-09-03
 *
 *   1. L'INSTANTANÉ STATIQUE — assets/data/catalogue.json, écrit par
 *      `scripts/lot.mjs export` et déployé avec le site. Servi par
 *      Firebase Hosting comme un fichier : ZÉRO lecture Firestore par
 *      visite. C'est l'étage normal. (Pourquoi : voir l'en-tête de
 *      js/catalog-snapshot.js — le quota épuisé cinq fois en une
 *      semaine, le site éteint pour tous à chaque fois.)
 *
 *   2. FIRESTORE — le repli, exactement le chargement d'avant, si le
 *      fichier manque ou n'est pas exploitable. Le site ne peut donc
 *      pas être plus fragile qu'hier.
 *
 * Dans les deux cas, la mémoïsation PAR COLLECTION de
 * js/catalog-cache.js reste en place : deux modules d'une même page
 * partagent la même promesse, et une page qui ne veut que les
 * universités ne demande qu'elles.
 *
 * CE MODULE NE FAIT QUE LIRE ET MÉMOÏSER. Il ne trie pas, ne filtre
 * pas, ne met pas en forme : chaque page continue de faire ce qu'elle
 * faisait, sur les données reçues. Aucun affichage n'a changé.
 *
 * RÈGLE DE PUBLICATION : le catalogue public affiche l'état du
 * dernier `export` déployé. Un lot = analyser → ecrire → verifier →
 * export → firebase deploy.
 * ============================================================
 */

import { db } from "../firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import { creerCacheCatalogue } from "./catalog-cache.js";
import { creerLecteurAvecInstantane, documentDeLInstantane, validerInstantane } from "./catalog-snapshot.js";

// Résolu par rapport à CE fichier (js/), donc valable depuis n'importe
// quelle page du site, à la racine comme dans un sous-dossier.
const URL_INSTANTANE = new URL("../assets/data/catalogue.json", import.meta.url);

// « no-cache » = le navigateur revalide auprès du serveur (ETag) à
// chaque page : un nouvel export déployé est vu au rechargement
// suivant, sans attendre l'expiration d'un cache. Le fichier pèse
// ~350 Ko brut, ~40 Ko compressé par Hosting — un aller-retour
// conditionnel ne coûte rien quand il n'a pas changé (304).
let promesseJson = null;
function telechargerInstantane() {
  if (!promesseJson) {
    promesseJson = fetch(URL_INSTANTANE, { cache: "no-cache" })
      .then((rep) => (rep.ok ? rep.json() : null))
      .catch(() => null);
  }
  return promesseJson;
}

const lecteur = creerLecteurAvecInstantane({
  chargerInstantane: telechargerInstantane,
  lireFirestore: async (nom) => {
    const snap = await getDocs(collection(db, nom));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
});

const cache = creerCacheCatalogue(lecteur.lireCollection);

// Journal de développement seulement : un coût qu'on ne voit pas est un
// coût que personne ne surveille — c'est ce qui a permis à l'accueil de
// coûter le double pendant des semaines. Muet en production.
function estDeveloppement() {
  try {
    const h = window.location.hostname;
    return h === "localhost" || h === "127.0.0.1" || h === "" || h.endsWith(".local");
  } catch {
    return false;
  }
}

// N'annonce QUE lorsque le compteur a bougé : sans cette garde, chaque
// appelant réaffiche le même total et on ne voit plus ce qui a
// réellement coûté quelque chose.
let dernierTotalAnnonce = 0;

function annoncerCout() {
  if (!estDeveloppement()) return;
  const total = cache.lectures();
  if (total === dernierTotalAnnonce) return;
  const delta = total - dernierTotalAnnonce;
  dernierTotalAnnonce = total;
  if (lecteur.source() === "instantane") {
    console.info(`[Fitz] catalogue servi par l'instantané statique (généré le ${lecteur.genereLe() || "?"}) — ${delta} documents, 0 lecture Firestore`);
  } else {
    console.info(`[Fitz] catalogue chargé depuis FIRESTORE — ${delta} lectures (total page : ${total}). L'instantané assets/data/catalogue.json est absent ou invalide : lancer \`node scripts/lot.mjs export\`.`);
  }
}

/**
 * Les trois collections du catalogue, en une seule fois par page.
 * @returns {Promise<{programmes: Array, universites: Array, bourses: Array}>}
 * Chaque document est normalisé en { id, ...données }.
 */
export async function chargerCatalogue() {

  const r = await cache.charger(["programs", "universities", "scholarships"]);
  annoncerCout();

  return {
    programmes: r.programs,
    universites: r.universities,
    bourses: r.scholarships
  };

}

/**
 * Les universités seules — pour les pages qui n'ont besoin que d'elles
 * (profile.html, eligibility-questions.html). Ne lit PAS les deux autres
 * collections. Si le catalogue complet a déjà été demandé dans la même
 * page, aucune requête supplémentaire n'est émise.
 */
export async function chargerUniversites() {
  const r = await cache.charger(["universities"]);
  annoncerCout();
  return r.universities;
}

/**
 * Programmes + universités, sans les bourses — pour test-prep.js, qui
 * n'a besoin que de la langue d'enseignement par université.
 */
export async function chargerProgrammesEtUniversites() {
  const r = await cache.charger(["programs", "universities"]);
  annoncerCout();
  return { programmes: r.programs, universites: r.universities };
}

/**
 * Un document ciblé — pour la fiche (details.js), qui a besoin d'UN
 * programme, de SON université et de SA bourse. Servi par l'instantané
 * quand il est là (0 lecture) ; sinon l'appelant retombe sur getDoc
 * comme avant : cette fonction renvoie alors `undefined`, jamais null,
 * pour distinguer « pas d'instantané » de « document absent ».
 *
 * @returns {Promise<object|null|undefined>} {id,…} ; null = absent de
 * l'instantané ; undefined = pas d'instantané, lire Firestore.
 */
export async function documentDuCatalogue(nom, id) {
  const snap = validerInstantane(await telechargerInstantane());
  if (!snap) return undefined;
  return documentDeLInstantane(snap, nom, id);
}

/** Nombre de documents servis depuis le chargement de la page (instantané ou Firestore). */
export function lecturesFirestore() {
  return lecteur.source() === "firestore" ? cache.lectures() : 0;
}

/** "instantane" | "firestore" | null — la source des données de cette page. */
export function sourceCatalogue() {
  return lecteur.source();
}

/**
 * La date de génération de l'instantané servi ("2026-09-04T08:00:20.784Z"),
 * ou null quand les données viennent de Firestore. Exposée depuis le
 * 2026-09-05 pour admin/radar.html : un rapport de fraîcheur qui ne dit
 * pas de QUAND datent ses données ne prouve rien.
 */
export function genereLeCatalogue() {
  return lecteur.source() === "instantane" ? (lecteur.genereLe() || null) : null;
}
