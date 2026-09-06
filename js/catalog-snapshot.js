/**
 * ============================================================
 * Fitz — l'instantané statique du catalogue (logique pure)
 * ============================================================
 *
 * Module PUR : aucune dépendance Firebase, aucun DOM, aucun fetch.
 * Il ne sait pas TÉLÉCHARGER, il sait seulement dire si un JSON reçu
 * est un instantané exploitable et servir ses collections. C'est
 * js/catalog-data.js qui le branche sur le réseau et sur Firestore.
 * Vérifiable sans réseau : test/catalog-snapshot.test.mjs.
 *
 * POURQUOI IL EXISTE (2026-09-03)
 * Le quota de lectures Firestore du plan gratuit (50 000 par jour)
 * a été épuisé cinq fois en une semaine, à ZÉRO visiteur — par les
 * commandes d'administration et les rechargements de développement.
 * Chaque visite publique lisait le catalogue entier (~600 documents,
 * ~1 200 sur l'accueil avant le dédoublonnage). Quand le quota tombe,
 * le SITE tombe : catalogue vide pour tout le monde jusqu'au lendemain
 * 07h00. Et le catalogue grossit à chaque lot (591 documents le
 * 31 août, 812 le 3 septembre) : le mur se rapproche tout seul.
 *
 * LE PRINCIPE
 * `scripts/lot.mjs export` — déjà la dernière étape de chaque lot —
 * écrit désormais AUSSI `assets/data/catalogue.json` : les trois
 * collections telles quelles, document par document. Ce fichier est
 * déployé avec le site comme une image ou une feuille de style, et
 * servi par Firebase Hosting SANS toucher Firestore. Une visite passe
 * de ~600 lectures à ZÉRO. Firestore reste la source de vérité et
 * l'outil d'administration ; le fichier n'est que sa copie publiée.
 *
 * CE QUE ÇA CHANGE POUR LA PUBLICATION
 * Le catalogue public montre l'état du dernier `export` déployé. Un
 * lot n'est donc visible des visiteurs qu'après `lot.mjs export` PUIS
 * `firebase deploy`. En développement (Live Server), le fichier local
 * est servi tel quel : après un `export`, un rechargement suffit.
 *
 * REPLI
 * Si le fichier manque, ne se charge pas, ou n'a pas la forme attendue,
 * js/catalog-data.js relit Firestore exactement comme avant. Le site ne
 * peut donc pas être PLUS fragile qu'hier : au pire il coûte pareil.
 * Un instantané invalide n'est jamais servi partiellement — c'est tout
 * ou rien, pour ne jamais mélanger deux états du catalogue dans une
 * même page.
 * ============================================================
 */

export const COLLECTIONS = ["programs", "universities", "scholarships"];

/**
 * Valide un JSON reçu et le renvoie sous forme normalisée, ou null.
 * Forme attendue : { genereLe, programs: [{id,…}], universities: [{id,…}],
 * scholarships: [{id,…}] } — les trois tableaux sont OBLIGATOIRES et
 * chaque document doit porter un id (chaîne non vide).
 *
 * @param {unknown} json
 * @returns {{ genereLe: string, programs: Array, universities: Array, scholarships: Array } | null}
 */
export function validerInstantane(json) {
  if (!json || typeof json !== "object" || Array.isArray(json)) return null;

  for (const nom of COLLECTIONS) {
    const liste = json[nom];
    if (!Array.isArray(liste)) return null;
    for (const docu of liste) {
      if (!docu || typeof docu !== "object" || typeof docu.id !== "string" || !docu.id) return null;
    }
  }

  return {
    genereLe: typeof json.genereLe === "string" ? json.genereLe : "",
    programs: json.programs,
    universities: json.universities,
    scholarships: json.scholarships
  };
}

/**
 * Fabrique le lecteur de collection branché sur l'instantané, avec
 * repli sur la lecture réelle.
 *
 * @param {object} deps
 * @param {() => Promise<unknown>} deps.chargerInstantane - récupère le JSON (peut rejeter ou renvoyer null)
 * @param {(nom: string) => Promise<Array>} deps.lireFirestore - lecture réelle d'une collection
 * @returns {{ lireCollection: (nom: string) => Promise<Array>, source: () => ("instantane"|"firestore"|null), genereLe: () => string }}
 */
export function creerLecteurAvecInstantane({ chargerInstantane, lireFirestore }) {

  // Une seule tentative de téléchargement par page, partagée par les
  // trois collections : le fichier est demandé une fois, pas trois.
  let promesseInstantane = null;
  let source = null;
  let genereLe = "";

  function instantane() {
    if (!promesseInstantane) {
      promesseInstantane = Promise.resolve()
        .then(() => chargerInstantane())
        .then((json) => validerInstantane(json))
        .catch(() => null);
    }
    return promesseInstantane;
  }

  return {

    async lireCollection(nom) {
      const snap = await instantane();
      if (snap) {
        source = "instantane";
        genereLe = snap.genereLe;
        return snap[nom];
      }
      // Repli : la lecture réelle, comme avant le 2026-09-03. La
      // source reste « firestore » même si une collection ultérieure
      // venait de l'instantané — ça ne peut pas arriver (tout ou rien),
      // mais l'invariant est écrit.
      source = "firestore";
      return lireFirestore(nom);
    },

    /** D'où viennent les données servies dans cette page — null tant que rien n'a été lu. */
    source() {
      return source;
    },

    /** Date de génération de l'instantané servi, "" si Firestore. */
    genereLe() {
      return genereLe;
    }

  };
}

/**
 * Cherche un document par id dans une collection de l'instantané.
 * Utilisé par la fiche (details.js) pour éviter trois getDoc ciblés.
 * @returns {object|null} le document ({id,…}) ou null s'il est absent
 */
export function documentDeLInstantane(snap, nom, id) {
  if (!snap || !Array.isArray(snap[nom]) || !id) return null;
  return snap[nom].find((d) => d.id === id) || null;
}
