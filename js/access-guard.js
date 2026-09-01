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

import { PLAN_ORDER, PLAN_LABELS, resolveFeatureFlags } from "./plan-features.js";

export { PLAN_ORDER, PLAN_LABELS };

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

// Un abonnement expiré doit se comporter exactement comme l'absence
// d'abonnement — les deux cas retombent aujourd'hui sur "essentiel"
// (voir la note historique ci-dessous). Ce n'est PAS un nouveau choix :
// c'est le même comportement déjà en place, appliqué en plus au cas de
// l'expiration pour rester cohérent. planExpiresAt est une chaîne ISO
// (ex. "2026-09-15"), écrite par le futur backend de paiement — aucun
// compte n'en a aujourd'hui, ce contrôle est donc actuellement inerte.
function isPlanExpired(userData) {

if (!userData || !userData.planExpiresAt) return false;

const expiry = new Date(userData.planExpiresAt);

return !isNaN(expiry) && expiry.getTime() < Date.now();

}

// RÉSOLU (2026-07-30, audit d'harmonisation) : tout compte sans formule
// payante valide — y compris un compte dont la formule a expiré —
// retombe désormais sur "gratuit" (voir js/plan-features.js), qui ne
// débloque aucun outil Fitz ni candidature accompagnée. C'était
// auparavant "essentiel" par défaut, ce qui donnait 100% des outils
// payants à tout le monde tant qu'aucun vrai paiement n'existait.
export function resolvePlan(userData) {
const raw = String((userData && userData.plan) || "").toLowerCase();
if (!PLAN_ORDER.includes(raw)) return "gratuit";
return isPlanExpired(userData) ? "gratuit" : raw;
}

// Fitz Express (pricing-plans.js) n'est PAS une formule : c'est un pass
// indépendant qui ne touche jamais `plan`. Un compte peut l'avoir actif
// quelle que soit sa formule (y compris aucune). fitzExpressExpiresAt
// suit la même convention que planExpiresAt (chaîne ISO).
export function hasFitzExpressAccess(userData) {

if (!userData || !userData.fitzExpressExpiresAt) return false;

const expiry = new Date(userData.fitzExpressExpiresAt);

return !isNaN(expiry) && expiry.getTime() >= Date.now();

}

// Une offre `deprecated: true` (pricing-plans.js) reste dans PLAN_ORDER
// pour que les comptes qui la détiennent déjà continuent de fonctionner,
// mais ne doit plus jamais être SUGGÉRÉE à l'achat — ni comme prochain
// palier (nextPlanId, panneau coach du tableau de bord), ni comme cible
// de déverrouillage d'une fonctionnalité (unlockingPlans, CTA "Choisir
// ma formule" un peu partout). `window.SCHOLARBRIDGE_PLANS` peut être
// absent sur une page qui ne charge pas pricing-plans.js (ex. panneau
// admin) : dans ce cas rien n'est filtré, comportement inchangé.
function isSellablePlan(planId) {
const plan = typeof SCHOLARBRIDGE_PLANS !== "undefined" && SCHOLARBRIDGE_PLANS[planId];
return !plan || plan.deprecated !== true;
}

export function nextPlanId(planId) {
const index = PLAN_ORDER.indexOf(planId);
if (index === -1) return null;
for (let i = index + 1; i < PLAN_ORDER.length; i++) {
if (isSellablePlan(PLAN_ORDER[i])) return PLAN_ORDER[i];
}
return null;
}

export function unlockingPlans(planId, flags) {
return PLAN_ORDER.filter((p) => p !== planId && flags[p] && isSellablePlan(p));
}

// testerAccess (users/{uid}.testerAccess, réservé à l'admin — voir
// firestore.rules) court-circuite le verrouillage par formule pour un
// compte précis, sans jamais changer ce que voient les autres
// utilisateurs : ce n'est PAS une formule, juste un contournement de
// test posé/retiré depuis admin/student-detail.js.
//
// hasFitzExpress : un Pass Fitz Express actif débloque uniquement
// "ai_chat" (questions ponctuelles), jamais les autres outils — il ne
// remplace pas un abonnement, voir pricing-plans.js.
export function isFeatureLocked(planId, featureFlags, featureKey, testerAccess, hasFitzExpress) {
if (testerAccess) return false;
if (hasFitzExpress && featureKey === "ai_chat") return false;
const flags = featureFlags[featureKey];
if (!flags) return false;
return flags[planId] === false;
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
"background:#0F172A", "color:#F1F5F9",
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

if (!firebaseUser) {
resolve(null);
return;
}

try {

if (localStorage.getItem(LEGACY_USERS_KEY)) {
localStorage.removeItem(LEGACY_USERS_KEY);
}

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

try {

const ownerSnap = await getDoc(doc(db, "admins", firebaseUser.uid));

if (ownerSnap.exists() && ownerSnap.data().isActive === true) {
planId = OWNER_FREE_PLAN;
}

} catch (ownerCheckError) {
// Pas admin, ou lecture refusée : comportement normal, la formule
// reste celle résolue depuis users/{uid} ci-dessus.
}

resolve({
user: firebaseUser,
userData,
profile,
planId,
disabled: userData.disabled === true,
testerAccess: userData.testerAccess === true,
hasFitzExpress: hasFitzExpressAccess(userData)
});

} catch (error) {

reject(error);

}

});

});

}

export async function fetchFeatureFlags() {

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
export function requireFeature(featureKey) {

return requireAuth().then(async (session) => {

showGuardLoader();

const featureFlags = await fetchFeatureFlags();

if (isFeatureLocked(session.planId, featureFlags, featureKey, session.testerAccess, session.hasFitzExpress)) {

const target = unlockingPlans(session.planId, featureFlags[featureKey])[0];

window.location.replace(target ? `offers.html#${target}` : "offers.html");

return new Promise(() => {});

}

hideGuardLoader();

return { ...session, featureFlags };

});

}
