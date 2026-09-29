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
 *      fichier manque ou n'est pas exploitable. DEPUIS LE 2026-09-26, CE
 *      REPLI NE SERT PLUS QU'AUX ADMINISTRATEURS : les trois collections
 *      ne sont lisibles que par eux (firestore.rules), pour que les
 *      portails réservés aux abonnés ne se lisent plus en interrogeant
 *      Firestore directement. Pour un visiteur, un instantané absent
 *      donne l'état d'erreur de chaque page, comme une coupure réseau.
 *
 * LE CATALOGUE DES LISTES ET LES FICHES (lot PERF 3G, 2026-09-28)
 *
 *   assets/data/catalogue.json pèse 2,2 Mo (262 Ko compressés) ; plus de
 *   la moitié ne sert qu'aux fiches. `lot.mjs export` écrit aussi, sur les
 *   mêmes documents (scripts/catalogue-liste.mjs) :
 *   - assets/data/catalogue-liste.json, le même instantané sans les champs
 *     que seules les fiches lisent — chargerCatalogueListe() et ses deux
 *     sœurs, pour les listes, le moteur de recommandation et les
 *     diagnostics (126 Ko compressés) ;
 *   - assets/data/fiches/<collection>/<id>.json, UN document complet —
 *     documentDuCatalogue(), pour les fiches (2 Ko chacun).
 *   Sans ces fichiers (export plus ancien), tout retombe sur catalogue.json.
 *   Les fonctions sans « Liste » rendent toujours le catalogue COMPLET :
 *   l'administration et les pages qui lisent un champ de fiche s'en servent.
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

// Firebase n'est PLUS importé ici au chargement (lot A « vitesse sur
// téléphone », 2026-09-24). L'instantané statique sert le catalogue dans
// le cas normal : Firestore n'est que le repli. L'importer d'office
// faisait télécharger les quatre SDK Firebase (environ 200 Kio) à toute
// page qui montre le catalogue, accueil compris, avant même d'en avoir
// besoin. Ils ne sont désormais chargés que si le repli sert vraiment
// (voir lireFirestore ci-dessous).
import { creerCacheCatalogue } from "./catalog-cache.js";
import { creerLecteurAvecInstantane, documentDeLInstantane, validerInstantane } from "./catalog-snapshot.js";

// Résolu par rapport à CE fichier (js/), donc valable depuis n'importe
// quelle page du site, à la racine comme dans un sous-dossier.
const URL_INSTANTANE = new URL("../assets/data/catalogue.json", import.meta.url);
const URL_LISTE = new URL("../assets/data/catalogue-liste.json", import.meta.url);
const COLLECTIONS_FICHES = ["programs", "universities", "scholarships"];
// Mêmes identifiants que ceux qui ont une fiche (scripts/catalogue-liste.mjs).
const ID_DE_FICHE = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;

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

/**
* Lance le téléchargement de l'instantané SANS l'attendre (lot NAVIGATION
* RAPIDE, 2026-09-21). Mesuré en production : le catalogue ne partait
* qu'après la connexion et toutes les lectures du compte — le dernier
* maillon d'une longue file. Les hubs l'appellent dès leur chargement,
* en parallèle de la connexion : quand ils en ont besoin, il est là.
* Même promesse que telechargerInstantane() — jamais deux téléchargements.
*/
export function prechargerCatalogue() {
  telechargerInstantane();
}

// Le fichier des listes (lot PERF 3G). Absent ou illisible — un export
// antérieur à ce lot, un réseau qui coupe : c'est le catalogue complet qui
// répond, avec les mêmes documents, seulement plus lourd.
let promesseListe = null;
function telechargerListe() {
  if (!promesseListe) {
    promesseListe = fetch(URL_LISTE, { cache: "no-cache" })
      .then((rep) => (rep.ok ? rep.json() : null))
      .catch(() => null)
      .then((json) => (validerInstantane(json) ? json : telechargerInstantane()));
  }
  return promesseListe;
}

/** Comme prechargerCatalogue(), pour un hub qui lit le catalogue des listes. */
export function prechargerCatalogueListe() {
  telechargerListe();
}

async function lireFirestore(nom) {
  const [{ db }, { collection, getDocs }] = await Promise.all([
    import("../firebase-config.js"),
    import("https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js")
  ]);
  const snap = await getDocs(collection(db, nom));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

const lecteur = creerLecteurAvecInstantane({ chargerInstantane: telechargerInstantane, lireFirestore });

const cache = creerCacheCatalogue(lecteur.lireCollection);

// Le catalogue des listes a son propre lecteur et sa propre mémoïsation :
// une page qui lit les deux (rare) ne mélange jamais un document allégé
// et un document complet sous la même clé.
const lecteurListe = creerLecteurAvecInstantane({ chargerInstantane: telechargerListe, lireFirestore });

const cacheListe = creerCacheCatalogue(lecteurListe.lireCollection);

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
const dernierTotalAnnonce = new Map();

function annoncerCout(c = cache, l = lecteur, fichier = "catalogue.json") {
  if (!estDeveloppement()) return;
  const total = c.lectures();
  const avant = dernierTotalAnnonce.get(c) || 0;
  if (total === avant) return;
  const delta = total - avant;
  dernierTotalAnnonce.set(c, total);
  if (l.source() === "instantane") {
    console.info(`[Fitz] catalogue servi par l'instantané statique ${fichier} (généré le ${l.genereLe() || "?"}) — ${delta} documents, 0 lecture Firestore`);
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

// ---- Le catalogue des LISTES (lot PERF 3G, 2026-09-28) ----
// Mêmes documents, sans les champs que seules les fiches lisent (liste
// dans scripts/catalogue-liste.mjs, DETAIL). Pour les listes, le moteur de
// recommandation et les diagnostics : test/catalogue-liste.test.mjs
// vérifie qu'ils donnent exactement les mêmes résultats qu'avec le complet.

/** Comme chargerCatalogue(), sur le catalogue des listes. */
export async function chargerCatalogueListe() {
  const r = await cacheListe.charger(["programs", "universities", "scholarships"]);
  annoncerCout(cacheListe, lecteurListe, "catalogue-liste.json");
  return {
    programmes: r.programs,
    universites: r.universities,
    bourses: r.scholarships
  };
}

/** Comme chargerUniversites(), sur le catalogue des listes. */
export async function chargerUniversitesListe() {
  const r = await cacheListe.charger(["universities"]);
  annoncerCout(cacheListe, lecteurListe, "catalogue-liste.json");
  return r.universities;
}

/** Comme chargerProgrammesEtUniversites(), sur le catalogue des listes. */
export async function chargerProgrammesEtUniversitesListe() {
  const r = await cacheListe.charger(["programs", "universities"]);
  annoncerCout(cacheListe, lecteurListe, "catalogue-liste.json");
  return { programmes: r.programs, universites: r.universities };
}

/**
 * Un document ciblé — pour la fiche (details.js), qui a besoin d'UN
 * programme, de SON université et de SA bourse. Servi par l'instantané
 * quand il est là (0 lecture) ; sinon l'appelant retombe sur getDoc
 * comme avant : cette fonction renvoie alors `undefined`, jamais null,
 * pour distinguer « pas d'instantané » de « document absent ».
 *
 * Lot PERF 3G (2026-09-28) : la FICHE du document d'abord
 * (assets/data/fiches/<collection>/<id>.json, le document complet, 2 Ko)
 * plutôt que tout le catalogue (262 Ko compressés) pour trois documents.
 * Fiche absente ou illisible (document retiré, export antérieur à ce
 * lot) : l'instantané complet, exactement comme avant.
 *
 * @returns {Promise<object|null|undefined>} {id,…} ; null = absent de
 * l'instantané ; undefined = pas d'instantané, lire Firestore.
 */
export async function documentDuCatalogue(nom, id) {
  if (COLLECTIONS_FICHES.includes(nom) && typeof id === "string" && ID_DE_FICHE.test(id)) {
    try {
      const rep = await fetch(new URL(`../assets/data/fiches/${nom}/${id}.json`, import.meta.url), { cache: "no-cache" });
      const docu = rep.ok ? await rep.json() : null;
      if (docu && typeof docu === "object" && docu.id === id) return docu;
    } catch {
      // Réseau, JSON illisible : l'instantané complet prend le relais.
    }
  }
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
