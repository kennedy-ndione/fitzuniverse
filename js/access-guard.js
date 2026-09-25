/**
* ============================================================
* FitzUniverse — garde d'accès (auth + formule), sans dépendance au shell
* ============================================================
*
* Couche la plus basse de la vérification d'accès : session Firebase,
* auto-guérison du profil Firestore manquant, détection de compte
* suspendu, résolution de la formule active + des fonctionnalités
* activées (js/plan-features.js). Ne suppose AUCUN balisage particulier
* (pas de sidebar/topbar/#pageLoader) — utilisable sur n'importe quelle
* page, y compris celles qui n'ont pas encore le shell "app" (favoris,
* documents, universités, paiement).
*
* js/app-shell.js (sidebar/topbar) s'appuie sur ce module plutôt que de
* dupliquer cette logique — voir bootstrapShell().
*
* Utilisation minimale, sur une page sans shell :
*
*   import { requireFeature } from "./js/access-guard.js";
*   const session = await requireFeature("documents");
*   // Le code ci-dessus ne s'exécute jamais si l'accès est refusé :
*   // requireFeature() redirige et ne résout jamais sa promesse dans
*   // ce cas (la page suivante prend le relais).
*   initPage(session);
* ============================================================
*/

import { auth, db } from "../firebase-config.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
doc,
getDoc,
setDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import {
PLAN_ORDER, PLAN_LABELS, PLAN_PREINSCRIPTION_ORDER, PLAN_PREINSCRIPTION_LABELS,
resolveFeatureFlags, decideVerrou,
resolvePlan, resolvePlanPreinscription, hasFitzExpressAccess,
nextPlanId, unlockingPlans,
ESPACES, HUB_ESPACE, resoudreEspace, espaceAutorise,
libellePreinscriptionDuCompte
} from "./plan-features.js";

export {
PLAN_ORDER, PLAN_LABELS, PLAN_PREINSCRIPTION_ORDER, PLAN_PREINSCRIPTION_LABELS,
resolvePlan, resolvePlanPreinscription, hasFitzExpressAccess,
nextPlanId, unlockingPlans,
ESPACES, HUB_ESPACE, resoudreEspace, espaceAutorise
};

// Formule résolue pour le compte propriétaire (voir la note dans
// resolveSession() ci-dessous) — la plus complète de PLAN_ORDER,
// jamais stockée dans Firestore.
const OWNER_FREE_PLAN = PLAN_ORDER[PLAN_ORDER.length - 1];

export function createDefaultProfile(user) {
return {
name: (user && user.name) || "",
email: (user && user.email) || "",
originCountry: "",
age: "",
currentDegree: "",
academicAverage: "",
englishLevel: "",
desiredField: "",
desiredCountry: ""
};
}

// LOT S4 — TOUTE LA LOGIQUE PURE DE FORMULE A DÉMÉNAGÉ dans
// js/plan-features.js : resolvePlan, resolvePlanPreinscription,
// hasFitzExpressAccess, nextPlanId, unlockingPlans, et la décision
// d'ESPACE (resoudreEspace). Elle n'avait rien à faire dans un module
// qui importe le SDK Firebase depuis un CDN — un test Node ne peut pas
// charger ce fichier, et c'est exactement ce qui a empêché, jusqu'ici,
// d'écrire un test sur la résolution des formules.
//
// Elles restent RÉ-EXPORTÉES ici : une trentaine de fichiers les
// importent depuis access-guard, et ce lot n'est pas un lot de
// renommage.

// testerAccess (users/{uid}.testerAccess, réservé à l'admin — voir
// firestore.rules) court-circuite le verrouillage par formule pour un
// compte précis, sans jamais changer ce que voient les autres
// utilisateurs : ce n'est PAS une formule, juste un contournement de
// test posé/retiré depuis admin/student-detail.js.
//
// hasFitzExpress : un Pass Fitz Express actif débloque uniquement
// "ai_chat" (questions ponctuelles), jamais les autres outils — il ne
// remplace pas un abonnement, voir pricing-plans.js.
// `planPreinscriptionId` (grille B) : les droits sont l'UNION des deux
// forfaits — la décision vit dans decideVerrou (js/plan-features.js).
export function isFeatureLocked(planId, featureFlags, featureKey, testerAccess, hasFitzExpress, planPreinscriptionId = "") {
return decideVerrou({ planId, planPreinscriptionId, featureFlags, featureKey, testerAccess, hasFitzExpress });
}

// ==========================================================
// Overlay de chargement minimal — évite tout flash de contenu protégé
// pendant la vérification, sans dépendre du CSS de la page (inline,
// autonome). N'impose aucune autre modification visuelle à la page.
// ==========================================================

let loaderEl = null;

function showGuardLoader() {

if (loaderEl) return loaderEl;

loaderEl = document.createElement("div");

loaderEl.setAttribute("id", "accessGuardLoader");

loaderEl.style.cssText = [
"position:fixed", "inset:0", "z-index:99999",
"display:flex", "align-items:center", "justify-content:center",
"background:#211D18", "color:#F5F1E8",
"font-family:Inter,Arial,sans-serif", "font-size:15px"
].join(";");

loaderEl.textContent = "Vérification de votre accès…";

document.body.appendChild(loaderEl);

return loaderEl;

}

function hideGuardLoader() {
if (loaderEl && loaderEl.parentNode) loaderEl.remove();
loaderEl = null;
}

// ==========================================================
// Résolution de session — un seul point de vérité, réutilisé par
// requireAuth()/requireFeature() ci-dessous ET par bootstrapShell()
// dans js/app-shell.js.
// ==========================================================

const LEGACY_USERS_KEY = "users";

/**
* @returns {Promise<null|{user, userData, profile, planId, disabled}>}
* `null` signifie "aucun utilisateur connecté" (pas une erreur).
*/
export function resolveSession() {

return new Promise((resolve, reject) => {

onAuthStateChanged(auth, async (firebaseUser) => {

// UNE SESSION ANONYME N'EST PAS UN COMPTE (2026-09-25). La page de
// résultats ouvre une session anonyme Firebase pour la lecture de Fitz
// (js/ai/diagnostic-fitz.js). Le visiteur qui cliquait ensuite vers
// l'espace ou le paiement était pris pour un étudiant connecté :
// l'auto-guérison plus bas lui créait un document users SANS nom ni
// e-mail — les « Sans nom » de l'admin, comptés comme inscrits — et
// payment.js pouvait même lui ouvrir une facture. Pour tout l'espace,
// une session anonyme vaut « personne » : il se connecte ou crée son
// compte, comme n'importe quel visiteur.
if (!firebaseUser || firebaseUser.isAnonymous) {
resolve(null);
return;
}

try {

if (localStorage.getItem(LEGACY_USERS_KEY)) {
localStorage.removeItem(LEGACY_USERS_KEY);
}

// LES TROIS LECTURES DE DÉPART PARTENT ENSEMBLE (lot NAVIGATION
// RAPIDE, 2026-09-21). Elles se suivaient : le compte, PUIS la fiche
// administrateur, PUIS (dans bootstrapShell) la configuration des
// formules — trois allers-retours à la file vers Firestore à chaque
// page de l'espace, mesurés en production. Aucune ne dépend des
// autres : elles partent maintenant au même instant, et chacune garde
// sa propre gestion d'échec (la fiche admin refusée reste un cas
// normal, la configuration absente retombe sur les valeurs par défaut).
lancerLesDrapeaux();
const adminEnVol = getDoc(doc(db, "admins", firebaseUser.uid)).catch(() => null);

const userRef = doc(db, "users", firebaseUser.uid);
let userSnap = await getDoc(userRef);

// Auto-guérison : recrée le document Firestore s'il n'existe pas
// (ex. écriture échouée pendant l'inscription, ou compte Auth créé
// sans profil associé).
if (!userSnap.exists()) {

const defaultData = {
uid: firebaseUser.uid,
name: firebaseUser.displayName || "",
email: firebaseUser.email || "",
createdAt: serverTimestamp(),
profile: createDefaultProfile({
name: firebaseUser.displayName || "",
email: firebaseUser.email || ""
})
};

await setDoc(userRef, defaultData);
userSnap = await getDoc(userRef);

}

const userData = userSnap.data();

const profile = Object.assign(
createDefaultProfile(userData),
userData.profile || {}
);

// Exception propriétaire (2026-08-07, retrait de l'inscription
// gratuite) : le compte admin de FitzUniverse résout toujours sur la
// formule complète, sans jamais écrire `plan` sur son propre document
// users/{uid} — voir firestore.rules /admins/{uid} : lecture possible
// UNIQUEMENT pour soi-même (isOwner(uid)), écriture toujours refusée
// côté client (allow write: if false, console/Admin SDK uniquement).
// Personne ne peut donc s'ajouter à cette collection ni se
// l'attribuer par ce chemin — la formule gratuite pour ce compte
// précis ne rouvre pas la brèche que ce commit referme pour tous les
// autres.
let planId = resolvePlan(userData);

// Lancée plus haut, en même temps que le compte. Pas admin, ou lecture
// refusée : `null`, comportement normal — la formule reste celle
// résolue depuis users/{uid} ci-dessus.
const ownerSnap = await adminEnVol;

if (ownerSnap && ownerSnap.exists() && ownerSnap.data().isActive === true) {
planId = OWNER_FREE_PLAN;
}

resolve({
user: firebaseUser,
userData,
profile,
planId,
disabled: userData.disabled === true,
testerAccess: userData.testerAccess === true,
hasFitzExpress: hasFitzExpressAccess(userData),
planPreinscriptionId: resolvePlanPreinscription(userData),
// « Dossier Italie », et non « Dossier France », pour un dossier italien
// (2026-09-23) : le libellé porte le pays de l'offre.
planPreinscriptionLabel: libellePreinscriptionDuCompte(userData)
});

} catch (error) {

reject(error);

}

});

});

}

// La configuration des formules, une fois par page (lot NAVIGATION
// RAPIDE). resolveSession la lance dès que l'utilisateur est connu —
// JAMAIS avant : config/{id} n'est lisible que connecté
// (firestore.rules), et une lecture partie trop tôt retomberait sur les
// valeurs par défaut. fetchFeatureFlags() reprend la même promesse au
// lieu de relire.
let drapeauxEnVol = null;

function lancerLesDrapeaux() {
if (!drapeauxEnVol) drapeauxEnVol = lireLesDrapeaux();
return drapeauxEnVol;
}

export function fetchFeatureFlags() {
return drapeauxEnVol || lireLesDrapeaux();
}

async function lireLesDrapeaux() {

let planFeaturesConfig = null;

try {
const snap = await getDoc(doc(db, "config", "planFeatures"));
planFeaturesConfig = snap.exists() ? snap.data() : null;
} catch (error) {
console.warn("Impossible de lire la configuration des formules, utilisation des valeurs par défaut :", error);
}

return resolveFeatureFlags(planFeaturesConfig);

}

/**
* Exige une session valide. Redirige et NE RÉSOUT JAMAIS sa promesse si
* l'accès est refusé (non connecté → login.html, compte suspendu →
* suspended.html) : le script appelant n'a donc rien à vérifier après
* l'await, la suite ne s'exécute que si l'accès est déjà accordé.
*/
export function requireAuth() {

showGuardLoader();

return resolveSession().then((session) => {

if (!session) {
window.location.replace("login.html");
return new Promise(() => {});
}

if (session.disabled) {
window.location.replace("suspended.html");
return new Promise(() => {});
}

hideGuardLoader();

return session;

}).catch((error) => {

console.error("Erreur de vérification d'accès :", error);
hideGuardLoader();
document.body.innerHTML = `
<div style="padding:40px;text-align:center;font-family:Inter,Arial,sans-serif;">
<h2>Nous n'arrivons pas à vérifier votre accès pour le moment</h2>
<p>Vérifiez votre connexion Internet, puis réessayez — votre espace vous attend.</p>
<button onclick="window.location.reload()">Réessayer</button>
</div>
`;

return new Promise(() => {});

});

}

/**
* requireAuth() + verrouillage par formule (js/plan-features.js). Si la
* fonctionnalité n'est pas incluse dans la formule active, redirige
* vers offers.html (sur la formule qui la débloquerait, si connue) et
* ne résout jamais sa promesse — même contrat que requireAuth().
*/
export function requireFeature(featureKey, { espace = "" } = {}) {

return requireAuth().then(async (session) => {

showGuardLoader();

// LOT S4 — ON NE VEND PAS À QUELQU'UN QUI A DÉJÀ PAYÉ.
// Un client préinscription qui force ai-letter.html dans sa barre
// d'adresse n'est pas un prospect : c'est un client, qui s'est trompé
// de porte. On le RAMÈNE CHEZ LUI, pas sur la page d'offres. La page
// d'offres reste la destination de qui n'a rien acheté — pour lui,
// elle répond à la question qu'il se pose.
const espaceUtilisateur = resoudreEspace(session);

if (espace && !espaceAutorise(espaceUtilisateur, espace) && espaceUtilisateur !== "aucun") {
window.location.replace(HUB_ESPACE[espaceUtilisateur]);
return new Promise(() => {});
}

const featureFlags = await fetchFeatureFlags();

if (isFeatureLocked(session.planId, featureFlags, featureKey, session.testerAccess, session.hasFitzExpress, session.planPreinscriptionId)) {

const target = unlockingPlans(session.planId, featureFlags[featureKey], espace)[0];

window.location.replace(target ? `offers.html#${target}` : "offers.html");

return new Promise(() => {});

}

hideGuardLoader();

return { ...session, featureFlags };

});

}
