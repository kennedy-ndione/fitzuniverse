/**
* ============================================================
* FitzUniverse — shell applicatif partagé (sidebar + auth + formule)
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

// Menus déroulants habillés (bouton + liste aux couleurs du site, le
// select natif reste fonctionnel) — voir l'en-tête de fitz-select.js.
import { initFitzSelects } from "./fitz-select.js";

// Entrées/sorties du site pour le Control Center (2026-09-02) :
// une visite par session de navigateur + l'événement de déconnexion.
// trackEvent/trackVisitOnce avalent leurs erreurs, jamais d'await ici.
import { trackEvent, trackVisitOnce } from "./analytics.js";

import {
PLAN_ORDER,
PLAN_LABELS,
PLAN_PREINSCRIPTION_LABELS,
nextPlanId,
unlockingPlans,
isFeatureLocked,
resolveSession,
fetchFeatureFlags
} from "./access-guard.js";
// Le droit « Mon conseiller » se décide dans plan-features.js, en un
// seul endroit — voir advisorOuvert() et la note qui l'accompagne.
import { advisorOuvert } from "./plan-features.js";

// applyFeatureLocks est exporté depuis le 2026-08-30 : les rendus
// DYNAMIQUES (cartes de réponse du hub) insèrent des [data-feature]
// après le bootstrap et doivent pouvoir re-appliquer les verrous.
export { PLAN_ORDER, PLAN_LABELS, nextPlanId, unlockingPlans, isFeatureLocked, applyFeatureLocks };

// "Mon conseiller" (Signature Focus / Signature) est masqué entièrement
// plutôt que grisé-avec-CTA comme les autres [data-feature] — voir la
// même logique/le même raisonnement dans dashboard.js
// (applyAdvisorVisibility). Les deux copies existent parce que
// dashboard.js n'utilise délibérément pas ce module (voir la note en
// tête de fichier) ; à garder synchronisées si la règle change.
function applyAdvisorVisibility(planId, featureFlags, testerAccess, planPreinscriptionId = "") {

const label = document.getElementById("advisorSectionLabel");
const nav = document.getElementById("advisorSectionNav");

if (!label || !nav) return;

// planPreinscriptionId ajouté le 2026-09-08. Cette fonction ne
// regardait que la formule BOURSE : un client « Dossier France +
// Conseiller » avait payé un conseiller, firestore.rules l'autorisait
// à lui écrire, et la section restait masquée dans son espace. Le
// droit se lit sur l'UNION des deux forfaits partout ailleurs
// (decideVerrou) ; il n'y avait aucune raison que la visibilité de la
// section soit le seul endroit à n'en lire qu'un.
const hasAdvisor = advisorOuvert({ planId, planPreinscriptionId, featureFlags, testerAccess });

label.hidden = !hasAdvisor;
nav.hidden = !hasAdvisor;

}

// Identique à dashboard.js : verrouille/déverrouille chaque [data-feature]
// (essentiellement les liens de la sidebar ici) selon la formule active.
function applyFeatureLocks(planId, featureFlags, testerAccess, hasFitzExpress, planPreinscriptionId = "") {

document.querySelectorAll("[data-feature]").forEach((el) => {

const key = el.dataset.feature;
const flags = featureFlags[key];

if (!flags) return;

const locked = isFeatureLocked(planId, featureFlags, key, testerAccess, hasFitzExpress, planPreinscriptionId);
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

// Repliée par défaut (2026-08-27) : dix-sept liens en toutes lettres à
// l'ouverture donnaient à l'espace étudiant un air de back-office plutôt
// que d'application. La forme repliée (icônes seules, 80px) reste
// entièrement navigable — chaque lien garde son intitulé en infobulle
// native (attribut title du markup) — et un clic sur le bouton la
// déplie à tout moment.
//
// Seule l'ABSENCE de préférence enregistrée déclenche ce nouveau
// défaut : un étudiant qui a déjà déplié la sidebar avant ce
// changement a stocké "false" dans ce créneau, et ce choix explicite
// continue de primer. Ce n'est qu'à la toute première visite —
// aucune clé en localStorage — que le repli s'applique.
const storedPreference = localStorage.getItem(SIDEBAR_COLLAPSE_KEY);
const collapsedByDefault = storedPreference === null ? true : storedPreference === "true";

if (collapsedByDefault) {
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

// Sortie volontaire — signalée AVANT signOut (après, l'écriture du
// journal partirait sans uid). Pas d'await : jamais bloquant.
trackEvent("logout", {});

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

// ==========================================================
// « DISCUTER AVEC FITZ » — bouton flottant sur tout l'espace
// ==========================================================
// Demande utilisateur (2026-08-30) : mettre le chat en avant partout,
// pour qu'un étudiant puisse poser une question d'où qu'il soit.
// Injecté ici (et non dans chaque HTML) : toute page qui appelle
// initShellChrome() l'a d'office, y compris les futures. Le wrapper
// porte data-feature="ai_chat" AVANT applyFeatureLocks (appelé par
// bootstrapShell) : sur une formule sans chat, le bouton se verrouille
// tout seul et mène aux forfaits — même règle que partout.
function initFitzFab() {

// Jamais sur la page de chat elle-même, jamais deux fois.
if (document.getElementById("chatApp") || document.getElementById("fitzFabWrap")) return;

const wrap = document.createElement("span");
wrap.id = "fitzFabWrap";
wrap.className = "fitz-fab-wrap";
wrap.dataset.feature = "ai_chat";

wrap.innerHTML = `
<a href="ai-chat.html" data-real-href="ai-chat.html" class="fitz-fab" aria-label="Discuter avec Fitz — poser une question">
<svg class="fitz-mark" viewBox="0 0 100 100" fill="none" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><circle class="mark-structure" cx="50" cy="50" r="34" stroke-width="11" stroke-linecap="round" stroke-dasharray="130 83.6" transform="rotate(-90 50 50)"/><circle class="mark-accent" cx="50" cy="50" r="34" stroke-width="11" stroke-linecap="round" stroke-dasharray="42 171.6" stroke-dashoffset="-150" transform="rotate(-90 50 50)"/></svg>
<span class="fitz-fab-label">Discuter avec Fitz</span>
<span class="fitz-fab-lock"><i data-lucide="lock"></i></span>
</a>
`;

document.body.appendChild(wrap);

}

// Partie de l'initialisation qui ne dépend d'aucune donnée réseau :
// peut s'exécuter immédiatement, avant même de savoir si l'utilisateur
// est connecté.
export function initShellChrome() {

initSidebar();
initReveal();
initLogout();
initFitzFab();

// Navigation mobile de l'espace (2026-09-03) — barre d'onglets basse
// + feuille « Menu », injectées par js/mobile-nav.js (script plat,
// chargé par chaque page). Appelé ici pour que les pages à double
// présentation (dual-shell) l'obtiennent au moment où la barre haute
// sort de son conteneur [hidden] — idempotent, voir initShell().
if (window.FitzMobileNav) window.FitzMobileNav.initShell();

// Menus déroulants aux couleurs du site (2026-09-02) — le <select>
// natif ouvrait la liste blanche/surlignage bleu de l'OS, signalée
// par l'utilisateur sur ai-email et ai-translate. Tous les selects
// des pages connectées sont habillés ici, une fois pour toutes —
// même patron que js/catalog-select.js côté catalogue public.
initFitzSelects();

// Entrée du site : une seule fois par session de navigateur (garde
// sessionStorage dans analytics.js). Posé ici et non au niveau du
// module : l'admin importe hidePageLoader() de ce fichier et ne doit
// pas compter ses propres passages comme des entrées étudiantes.
trackVisitOnce();

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
// Grille B : un compte peut porter deux forfaits ; l'étiquette les dit
// tous les deux (« Gratuit · Diagnostic France »), le second n'étant
// jamais tu derrière le premier.
if (topbarPlanLabel) topbarPlanLabel.textContent = PLAN_LABELS[session.planId] + (PLAN_PREINSCRIPTION_LABELS[session.planPreinscriptionId] ? " · " + PLAN_PREINSCRIPTION_LABELS[session.planPreinscriptionId] : "");

applyFeatureLocks(session.planId, featureFlags, session.testerAccess, session.hasFitzExpress, session.planPreinscriptionId);
applyAdvisorVisibility(session.planId, featureFlags, session.testerAccess, session.planPreinscriptionId);

// Nom affiché dans la feuille « Menu » mobile (js/mobile-nav.js).
if (window.FitzMobileNav) {
window.FitzMobileNav.setUser((session.profile && session.profile.name) || session.userData.name || session.user.displayName || session.user.email);
// Diagnostic France : l'entrée n'entre dans le menu QUE si le droit
// est ouvert — c'est ici, une fois la session résolue, qu'on le sait.
// Voir MENU_FEATURE_ITEMS dans js/mobile-nav.js.
if (!isFeatureLocked(session.planId, featureFlags, "diagnostic_france", session.testerAccess, session.hasFitzExpress, session.planPreinscriptionId)) {
window.FitzMobileNav.ouvrirEntree("diagnostic_france");
}
}

if (window.lucide) lucide.createIcons();

// Droit de réponse de la messagerie FitzUniverse : fonctionnalité
// "student_messaging" (fermée au plan Gratuit — js/plan-features.js).
initMessagesPanel(session.user.uid, {
canReply: !isFeatureLocked(session.planId, featureFlags, "student_messaging", session.testerAccess, session.hasFitzExpress, session.planPreinscriptionId)
});

hideLoader();

return {
user: session.user,
userData: session.userData,
profile: session.profile,
planId: session.planId,
featureFlags,
testerAccess: session.testerAccess,
hasFitzExpress: session.hasFitzExpress,
planPreinscriptionId: session.planPreinscriptionId || "",
locked: feature ? isFeatureLocked(session.planId, featureFlags, feature, session.testerAccess, session.hasFitzExpress, session.planPreinscriptionId) : false
};

}).catch((error) => {

console.error("Erreur de chargement de la page :", error);
showLoadError();

return new Promise(() => {});

});

}
