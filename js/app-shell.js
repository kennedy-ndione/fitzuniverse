/**
* ============================================================
* ScholarBridge — shell applicatif partagé (sidebar + auth + formule)
* ============================================================
*
* Habillage sidebar/topbar (repli desktop, tiroir mobile, cloche de
* messages, déconnexion, animation "reveal") posé sur la couche de
* vérification d'accès générique de js/access-guard.js (session
* Firebase, auto-guérison du profil, formule + fonctionnalités
* activées) — ce module ne fait plus sa propre résolution Firebase, il
* délègue entièrement à access-guard.js pour ne pas dupliquer cette
* logique avec les pages sans shell (documents.js, payment.js).
*
* Utilisé par toutes les pages "Fitz" (ai-chat.html, ai-letter.html,
* ai-email.html, ai-translate.html, ai-check.html), qui partagent le
* même balisage de sidebar/topbar que dashboard.html/profile.html.
*
* dashboard.js et profile.js ne sont PAS migrés vers ce module (hors
* périmètre : ils fonctionnent déjà, aucune raison de prendre un risque
* de régression dessus). Toute nouvelle page utilisant le shell sidebar
* devrait cependant passer par ici plutôt que de recopier cette logique.
* ============================================================
*/

import { auth } from "../firebase-config.js";

import {
signOut
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import { initMessagesPanel } from "./student-messages.js";

import {
PLAN_ORDER,
PLAN_LABELS,
nextPlanId,
unlockingPlans,
isFeatureLocked,
resolveSession,
fetchFeatureFlags
} from "./access-guard.js";

export { PLAN_ORDER, PLAN_LABELS, nextPlanId, unlockingPlans, isFeatureLocked };

// "Mon conseiller" (Signature Focus / Signature) est masqué entièrement
// plutôt que grisé-avec-CTA comme les autres [data-feature] — voir la
// même logique/le même raisonnement dans dashboard.js
// (applyAdvisorVisibility). Les deux copies existent parce que
// dashboard.js n'utilise délibérément pas ce module (voir la note en
// tête de fichier) ; à garder synchronisées si la règle change.
function applyAdvisorVisibility(planId, featureFlags, testerAccess) {

const label = document.getElementById("advisorSectionLabel");
const nav = document.getElementById("advisorSectionNav");

if (!label || !nav) return;

const flags = featureFlags.advisor;
const hasAdvisor = !!flags && (testerAccess || flags[planId] === true);

label.hidden = !hasAdvisor;
nav.hidden = !hasAdvisor;

}

// Identique à dashboard.js : verrouille/déverrouille chaque [data-feature]
// (essentiellement les liens de la sidebar ici) selon la formule active.
function applyFeatureLocks(planId, featureFlags, testerAccess, hasFitzExpress) {

document.querySelectorAll("[data-feature]").forEach((el) => {

const key = el.dataset.feature;
const flags = featureFlags[key];

if (!flags) return;

const locked = isFeatureLocked(planId, featureFlags, key, testerAccess, hasFitzExpress);
const link = el.matches("a") ? el : el.querySelector("a[data-real-href]");

if (!link) return;

el.classList.toggle("is-locked", locked);

if (locked) {

const targetPlan = unlockingPlans(planId, flags)[0] || null;
link.setAttribute("href", targetPlan ? `offers.html#${targetPlan}` : "offers.html");

} else if (link.dataset.realHref) {

link.setAttribute("href", link.dataset.realHref);

}

});

}

// ==========================================================
// SIDEBAR — repli desktop, tiroir mobile
// ==========================================================

function initSidebar() {

const SIDEBAR_COLLAPSE_KEY = "scholarbridge_sidebar_collapsed";

const collapseBtn = document.getElementById("sidebarCollapseBtn");
const openBtn = document.getElementById("sidebarOpenBtn");
const backdrop = document.getElementById("sidebarBackdrop");

if (localStorage.getItem(SIDEBAR_COLLAPSE_KEY) === "true") {
document.body.classList.add("sidebar-collapsed");
if (collapseBtn) collapseBtn.setAttribute("aria-expanded", "false");
}

if (collapseBtn) {

collapseBtn.addEventListener("click", () => {

const collapsed = document.body.classList.toggle("sidebar-collapsed");

collapseBtn.setAttribute("aria-expanded", String(!collapsed));
localStorage.setItem(SIDEBAR_COLLAPSE_KEY, String(collapsed));

});

}

function closeMobileSidebar() {
document.body.classList.remove("sidebar-open");
}

if (openBtn) {

openBtn.addEventListener("click", () => {
document.body.classList.add("sidebar-open");
});

}

if (backdrop) {
backdrop.addEventListener("click", closeMobileSidebar);
}

document.addEventListener("keydown", (event) => {
if (event.key === "Escape") closeMobileSidebar();
});

document.querySelectorAll(".sidebar .nav-link, .sidebar-logout").forEach((el) => {
el.addEventListener("click", closeMobileSidebar);
});

}

function initReveal() {

document.documentElement.classList.add("js-ready");

const items = document.querySelectorAll(".reveal");

if (!items.length) return;

if (!("IntersectionObserver" in window)) {
items.forEach((item) => item.classList.add("is-visible"));
return;
}

const observer = new IntersectionObserver((entries) => {

entries.forEach((entry) => {
if (entry.isIntersecting) {
entry.target.classList.add("is-visible");
observer.unobserve(entry.target);
}
});

// Seuil indépendant de la hauteur — même valeurs qu'offers.js.
// L'ancien `threshold: 0.1` exigeait que 10% de l'élément soit
// visible : au-delà d'une hauteur de viewport/0.1, la condition
// devient mathématiquement impossible et l'élément reste invisible
// pour toujours. hidePageLoader() (ci-dessous) protège déjà les pages
// qui l'appellent en révélant tout le contenu en bloc dès que le
// loader disparaît, mais cet observer reste la seule protection pour
// tout appel à initShellChrome() qui n'irait pas jusqu'à
// bootstrapShell()/hidePageLoader() — il doit donc être fiable par
// lui-même, pas seulement de secours.
}, { threshold: 0, rootMargin: "0px 0px -60px 0px" });

items.forEach((item) => observer.observe(item));

}

function initLogout() {

const logoutBtn = document.getElementById("logoutBtn");

if (!logoutBtn) return;

logoutBtn.addEventListener("click", async () => {

if (logoutBtn.dataset.busy === "true") return;
logoutBtn.dataset.busy = "true";

try {

await signOut(auth);
window.location.replace("index.html");

} catch (error) {

console.error(error);
alert("Un souci est survenu au moment de la déconnexion. Réessayez dans un instant.");
logoutBtn.dataset.busy = "false";

}

});

}

// Partie de l'initialisation qui ne dépend d'aucune donnée réseau :
// peut s'exécuter immédiatement, avant même de savoir si l'utilisateur
// est connecté.
export function initShellChrome() {

initSidebar();
initReveal();
initLogout();

if (window.lucide) lucide.createIcons();

}

/**
* Attend la session Firebase (via access-guard.js), charge le profil +
* la formule + les fonctionnalités activées, applique le verrouillage
* sur la sidebar, puis résout avec un contexte prêt à l'emploi pour la
* page appelante. Contrairement à requireAuth()/requireFeature() (qui
* redirigent et ne résolvent jamais leur promesse en cas d'accès
* refusé), bootstrapShell() résout TOUJOURS avec locked:true/false —
* c'est à la page appelante d'afficher un état verrouillé plutôt que le
* contenu réel, comme le font déjà les 5 pages Fitz. Cette
* différence est volontaire : ces pages font partie du shell sidebar où
* un lien verrouillé doit rester visible (juste grisé), alors qu'une
* page sans shell (documents.js...) n'a pas cette contrainte et peut se
* permettre une redirection franche.
*
* @param {Object} options
* @param {string} [options.feature] - clé js/plan-features.js à vérifier
*   pour cette page (ex. "ai_letter").
* @param {string} [options.pageLoaderId="pageLoader"]
* @param {string} [options.contentSelector=".content"]
* @returns {Promise<{user, userData, profile, planId, featureFlags, locked}>}
*/
// Partagé par toutes les pages qui affichent un #pageLoader pendant la
// vérification de session (bootstrapShell ci-dessous, mais aussi
// dashboard.js et plusieurs pages admin/*.js qui n'utilisent pas le
// reste de ce module) — évite de retrouver la même paire de lignes
// copiée-collée dans chaque fichier.
export function hidePageLoader(pageLoaderId = "pageLoader", contentSelector = ".content") {
const pageLoader = document.getElementById(pageLoaderId);
const content = document.querySelector(contentSelector);
if (pageLoader) pageLoader.style.display = "none";
if (content) content.style.display = "";

// initReveal() (ci-dessous) observe les éléments .reveal avec un
// IntersectionObserver dès initShellChrome() — donc pendant que ce
// conteneur est encore display:none (cf. #pageLoader ci-dessus). Un
// élément sans boîte de mise en page ne peut pas être détecté comme
// "intersecting", et rien ne garantit que l'observateur se redéclenche
// fiablement une fois ce display:none levé : .reveal restait alors
// bloqué à opacity:0 indéfiniment, contenu invisible bien que présent
// dans le DOM (bug réel constaté sur documents.html). Puisque ce
// contenu est de toute façon masqué par le loader jusqu'ici, il n'y a
// aucune raison de le retarder encore derrière un défilement : on
// l'affiche immédiatement dès que le loader disparaît.
if (content) {
content.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
}
}

export function bootstrapShell({ feature, pageLoaderId = "pageLoader", contentSelector = ".content" } = {}) {

const content = document.querySelector(contentSelector);

function hideLoader() {
hidePageLoader(pageLoaderId, contentSelector);
}

function showLoadError() {
if (content) {
content.style.display = "";
content.innerHTML = `
<div style="padding:40px;text-align:center;">
<h2>Cette page n'a pas pu s'afficher</h2>
<p>Vérifiez votre connexion Internet, puis réessayez.</p>
<button onclick="window.location.reload()">Réessayer</button>
</div>
`;
}
}

return resolveSession().then(async (session) => {

if (!session) {
window.location.replace("login.html");
return new Promise(() => {});
}

if (session.disabled) {
window.location.replace("suspended.html");
return new Promise(() => {});
}

const featureFlags = await fetchFeatureFlags();

document.body.dataset.plan = session.planId;

const planBadge = document.getElementById("planBadge");
if (planBadge) planBadge.textContent = PLAN_LABELS[session.planId];

const topbarPlanLabel = document.getElementById("topbarPlanLabel");
if (topbarPlanLabel) topbarPlanLabel.textContent = PLAN_LABELS[session.planId];

applyFeatureLocks(session.planId, featureFlags, session.testerAccess, session.hasFitzExpress);
applyAdvisorVisibility(session.planId, featureFlags, session.testerAccess);

if (window.lucide) lucide.createIcons();

initMessagesPanel(session.user.uid);

hideLoader();

return {
user: session.user,
userData: session.userData,
profile: session.profile,
planId: session.planId,
featureFlags,
testerAccess: session.testerAccess,
hasFitzExpress: session.hasFitzExpress,
locked: feature ? isFeatureLocked(session.planId, featureFlags, feature, session.testerAccess, session.hasFitzExpress) : false
};

}).catch((error) => {

console.error("Erreur de chargement de la page :", error);
showLoadError();

return new Promise(() => {});

});

}
