/**
* ============================================================
* Fitz — les portails de candidature, côté navigateur (lot S3)
* ============================================================
*
* Le portail de candidature ne vit plus dans le catalogue public : il
* est servi par la Cloud Function `portails` (functions/portails.js),
* qui vérifie l'abonnement avant de rendre quoi que ce soit. Ce module
* est le seul point d'entrée du site vers cette donnée.
*
* UN APPEL PAR SESSION, PAS PAR PAGE. La carte entière tient en 13 Ko ;
* la demander une fois et la garder en mémoire coûte une lecture
* Firestore par session, au lieu d'une par fiche ouverte. Les appels
* concurrents partagent la même promesse : ouvrir trois fiches en trois
* onglets ne fait pas trois appels dans le même onglet.
*
* EN MÉMOIRE, ET NULLE PART AILLEURS. Ni localStorage, ni
* sessionStorage, ni IndexedDB : c'est de la donnée payante. Elle
* disparaît quand l'onglet se ferme, et `oublierPortails()` la retire
* à la déconnexion — un poste partagé (cybercafé, salle informatique,
* et c'est le quotidien d'une bonne partie du public de ce site) ne doit
* pas garder les portails de l'étudiant précédent.
*
* NE JAMAIS ÉCHOUER BRUYAMMENT. Anonyme, hors ligne, formule expirée,
* fonction pas encore déployée : tous ces cas rendent `null`, et
* l'appelant affiche exactement ce qu'il affichait pour un visiteur —
* c'est-à-dire rien, pas un cadenas (règle du 2026-08-31, voir le bloc
* du portail dans scholarship-details.html). Un catalogue doit rester
* lisible hors ligne : le harnais `npm run verifier` tourne sans réseau
* et vérifie précisément cela.
* ============================================================
*/

const REGION = "europe-west1";
const NOM_FONCTION = "portails";

const VIDE = { universites: {}, programmes: {}, bourses: {} };

let carte = null;      // la réponse, une fois obtenue
let enVol = null;      // la promesse en cours, partagée

/**
* Charge la carte des portails, une seule fois par session.
* @returns {Promise<{universites:Object, programmes:Object, bourses:Object}|null>}
*   null = pas d'accès (anonyme, sans abonnement actif), ou indisponible.
*/
export function chargerPortails() {

if (carte) return Promise.resolve(carte);
if (enVol) return enVol;

enVol = (async () => {

try {

const { app } = await import("../firebase-config.js");

const { getFunctions, httpsCallable } = await import(
"https://www.gstatic.com/firebasejs/11.10.0/firebase-functions.js"
);

const appeler = httpsCallable(getFunctions(app, REGION), NOM_FONCTION);
const reponse = await appeler();
const data = (reponse && reponse.data) || null;

if (!data || typeof data !== "object") return null;

carte = {
universites: data.universites || {},
programmes: data.programmes || {},
bourses: data.bourses || {}
};

return carte;

} catch (cause) {

// "unauthenticated" et "permission-denied" ne sont PAS des pannes :
// ce sont les réponses normales pour un visiteur et pour un compte
// sans abonnement actif. On ne les journalise pas — une console
// rouge à chaque fiche ouverte ferait passer un fonctionnement
// correct pour un bug.
const code = (cause && cause.code) || "";
if (!/unauthenticated|permission-denied/.test(code)) {
console.warn("Portails indisponibles :", (cause && cause.message) || cause);
}

return null;

} finally {

// Ne pas mémoriser un échec : une coupure réseau au premier appel
// ne doit pas condamner la session entière.
enVol = null;

}

})();

return enVol;

}

/** La carte déjà chargée, ou une carte vide. Synchrone : ne déclenche aucun appel. */
function lue() {
return carte || VIDE;
}

/**
* Le portail d'ADMISSION pour une candidature : celui du programme s'il
* en a un propre, sinon celui de l'université.
*
* Même résolution que details.js appliquait sur le catalogue
* (`program.applicationUrl || university.applicationPortalUrl`) : le
* programme gagne quand il porte une valeur — vraie exception « Option
* B », un portail réellement distinct de celui de l'établissement.
*
* @returns {string} "" si aucun portail connu, ou si l'accès est fermé.
*/
export function portailUniversite({ universityId = "", programId = "" } = {}) {
const c = lue();
return (programId && c.programmes[programId]) || (universityId && c.universites[universityId]) || "";
}

/**
* Le portail de dépôt d'une BOURSE — celui du bailleur, quand le
* dossier ne se dépose pas auprès de l'université (entryPoint
* "bourse"). Champ neuf du lot S3, encore vide sur les 156 bourses :
* son remplissage est un lot de données.
*/
export function portailBourse(scholarshipId = "") {
return (scholarshipId && lue().bourses[scholarshipId]) || "";
}

/** Vrai si la carte a été obtenue — c'est-à-dire si l'accès est ouvert. */
export function portailsDisponibles() {
return carte !== null;
}

/** À la déconnexion : la donnée payante ne survit pas à la session. */
export function oublierPortails() {
carte = null;
enVol = null;
}
