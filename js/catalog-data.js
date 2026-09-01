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
* CE QUE ÇA A CORRIGÉ (2026-08-31)
* index.html chargeait deux modules qui lisaient chacun les trois
* collections entières : ~1 182 lectures par affichage de l'accueil au
* lieu de ~591. applications.js faisait la même chose deux fois dans sa
* propre page. Sur le plan gratuit (50 000 lectures/jour), l'accueil
* tenait ~42 chargements. Le quota a été épuisé plusieurs jours de
* suite sans qu'aucune commande ne soit en cause.
*
* AMPLIFICATEUR À CONNAÎTRE : en développement, Live Server recharge
* TOUS les onglets ouverts à chaque fichier enregistré. Un lot de 132
* photos, avec un onglet d'accueil ouvert, suffit à épuiser la journée.
* Fermer les onglets du site avant d'écrire des fichiers.
*
* CE MODULE NE FAIT QUE LIRE ET MÉMOÏSER. Il ne trie pas, ne filtre
* pas, ne met pas en forme : chaque page continue de faire ce qu'elle
* faisait, sur les données reçues. Aucun affichage n'a changé.
*
* Portée du cache : le chargement de page (voir js/catalog-cache.js).
* La mise en cache entre navigations — l'instantané statique — est un
* chantier distinct, qui suppose une décision sur le forfait Firebase.
* ============================================================
*/

import { db } from "../firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import { creerCacheCatalogue } from "./catalog-cache.js";

const cache = creerCacheCatalogue(async (nom) => {
const snap = await getDocs(collection(db, nom));
return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
});

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
console.info(`[Fitz] catalogue chargé — ${total - dernierTotalAnnonce} lectures Firestore (total page : ${total})`);
dernierTotalAnnonce = total;
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
* collections : ces pages resteraient sinon à ~591 lectures au lieu de
* ~111. Si le catalogue complet a déjà été demandé dans la même page,
* aucune requête supplémentaire n'est émise.
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

/** Nombre de documents réellement lus depuis le chargement de la page. */
export function lecturesFirestore() {
return cache.lectures();
}
