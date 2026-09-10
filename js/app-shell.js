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
fetchFeatureFlags,
resoudreEspace,
espaceAutorise,
HUB_ESPACE
} from "./access-guard.js";
// Le droit « Mon conseiller » se décide dans plan-features.js, en un
// seul endroit — voir advisorOuvert() et la note qui l'accompagne.
import { advisorOuvert, ESPACE_OUTILS } from "./plan-features.js";
// Lot FITZ-RECOURS : à la place d'un outil verrouillé, « Bloqué ?
// Demandez à Fitz » — le diagnostic (quelle formule l'ouvre) est
// calculé, donc gratuit ; la conversation, elle, reste réservée.
import { boutonRecours } from "./fitz-recours.js";

// applyFeatureLocks est exporté depuis le 2026-08-30 : les rendus
// DYNAMIQUES (cartes de réponse du hub) insèrent des [data-feature]
// après le bootstrap et doivent pouvoir re-appliquer les verrous.
export { PLAN_ORDER, PLAN_LABELS, nextPlanId, unlockingPlans, isFeatureLocked, applyFeatureLocks, ESPACE_OUTILS };

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

// CE QUI N'EST PAS DANS L'ACCOMPAGNEMENT EST ABSENT DU DOM (lot S4).
//
// Jusqu'ici, un outil non inclus restait là : opacité 55 % (css/journey.css),
// cadenas, et un lien toujours cliquable qui menait aux offres. C'était
// un panneau, pas une porte — et un panneau qu'un lecteur d'écran lit,
// qu'un Ctrl+F trouve, et sur lequel la tabulation s'arrête. On RETIRE
// l'élément, comme le lot S0 l'avait fait pour la carte Diagnostic.
//
// La vente ne disparaît pas pour autant : elle se fait par les cartes
// « Choisir ma formule » des hubs, jamais par un manque affiché. C'est
// la doctrine déjà écrite pour le portail de candidature le 2026-08-31 —
// on ne montre pas une porte fermée, on fait qu'il n'y ait pas de porte.
function applyFeatureLocks(planId, featureFlags, testerAccess, hasFitzExpress, planPreinscriptionId = "") {

document.querySelectorAll("[data-feature]").forEach((el) => {

const key = el.dataset.feature;
const flags = featureFlags[key];

if (!flags) return;

const locked = isFeatureLocked(planId, featureFlags, key, testerAccess, hasFitzExpress, planPreinscriptionId);
const link = el.matches("a") ? el : el.querySelector("a[data-real-href]");

if (!link) return;

if (locked) {
// Un OUTIL verrouillé (tuile jy-tool ou bouton d'action) ne laisse
// pas un trou : il laisse le recours, qui nomme la formule qui
// l'ouvre. Rien d'autre n'est remplacé — un lien de menu, une
// section réservée, disparaissent comme avant (lot S4).
if (link.classList.contains("jy-tool") || link.classList.contains("jy-btn")) {
el.insertAdjacentHTML("beforebegin", boutonRecours({ code: "verrou", feature: key }, { classe: "fitz-recours--outil", libelle: `${(link.textContent || "").trim().replace(/\s+/g, " ")} — bloqué ? Demandez à Fitz` }));
}
el.remove();
return;
}

el.classList.remove("is-locked");

if (link.dataset.realHref) {

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
// initFitzFab() N'EST PLUS APPELÉ ICI (lot S4). Cette fonction tourne
// avant que la session soit résolue ; le bouton est injecté par
// bootstrapShell(), une fois la session connue — absent du DOM plutôt
// qu'injecté puis retiré, ce qui aurait laissé un clignotement et, en
// cas d'échec de résolution, un bouton mort. (Depuis le lot PRÉ-FITZ,
// il est injecté dans tous les espaces ; c'est le verrou de formule qui
// le retire à qui n'a pas le chat.)

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

// ==========================================================
// L'ESPACE COURANT — mémoire de session, pour « les-deux »
// ==========================================================
// Un client qui a les deux accompagnements bascule de l'un à l'autre
// (voir le sélecteur de barre haute). Son choix vit en sessionStorage :
// il survit à la navigation, pas à la fermeture de l'onglet. Pas de
// localStorage — le prochain étudiant sur le même poste partagé ne doit
// pas hériter de l'espace du précédent.
const CLE_ESPACE = "fitz.espace";

export function lireEspaceChoisi() {
try {
const v = sessionStorage.getItem(CLE_ESPACE);
return v === "bourse" || v === "preinscription" ? v : "";
} catch { return ""; }
}

export function ecrireEspaceChoisi(espace) {
try { sessionStorage.setItem(CLE_ESPACE, espace); } catch { /* mode privé : le choix vaut pour la page */ }
}

/**
* L'espace dans lequel on SE TROUVE — à distinguer de celui auquel on a
* DROIT (resoudreEspace). Une page marquée impose le sien ; sinon c'est
* le droit, et pour « les-deux » le dernier choix, à défaut les bourses.
*/
export function espaceCourant(espaceUtilisateur, espacePage = "") {
// Une page d'outil (lot PRÉ-FITZ) n'impose pas d'espace : on s'y trouve
// dans l'espace du compte — ou, pour un client des deux, dans celui
// qu'il a choisi.
if (espacePage && espacePage !== ESPACE_OUTILS) return espacePage;
if (espaceUtilisateur === "les-deux") return lireEspaceChoisi() || "bourse";
if (espaceUtilisateur === "aucun") return "";
return espaceUtilisateur;
}

// Le sélecteur de bascule. Il n'entre dans le DOM QUE pour « les-deux » :
// un client qui n'a acheté qu'un accompagnement ne doit pas apprendre
// l'existence de l'autre par un bouton grisé dans sa barre haute.
function initBasculeEspace(espaceUtilisateur, courant) {

if (espaceUtilisateur !== "les-deux") return;
if (document.getElementById("espaceBascule")) return;

const topbar = document.querySelector(".journey-topbar");
if (!topbar) return;

const nav = document.createElement("div");
nav.id = "espaceBascule";
nav.className = "espace-bascule";
nav.setAttribute("role", "group");
nav.setAttribute("aria-label", "Changer d'accompagnement");
nav.innerHTML = `
<a href="espace-bourse.html" class="espace-bascule-btn${courant === "bourse" ? " is-active" : ""}"${courant === "bourse" ? ' aria-current="page"' : ""} data-espace="bourse">Bourses</a>
<a href="espace-preinscription.html" class="espace-bascule-btn${courant === "preinscription" ? " is-active" : ""}"${courant === "preinscription" ? ' aria-current="page"' : ""} data-espace="preinscription">Préinscription</a>
`;

nav.addEventListener("click", (e) => {
const lien = e.target.closest("[data-espace]");
if (lien) ecrireEspaceChoisi(lien.dataset.espace);
});

const ancre = topbar.querySelector(".journey-topbar-actions") || topbar;
ancre.insertBefore(nav, ancre.firstChild);

}

export function bootstrapShell({ feature, espace = "", pageLoaderId = "pageLoader", contentSelector = ".content" } = {}) {

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

// LOT S4 — L'ESPACE, AVANT TOUT LE RESTE.
// Une page marquée qu'un client n'a pas le droit d'ouvrir ne le renvoie
// pas aux offres : elle le ramène CHEZ LUI. On ne vend pas à quelqu'un
// qui a déjà payé — il s'est trompé de porte, on lui montre la sienne.
const espaceUtilisateur = resoudreEspace(session);

if (espace && !espaceAutorise(espaceUtilisateur, espace) && espaceUtilisateur !== "aucun") {
window.location.replace(HUB_ESPACE[espaceUtilisateur]);
return new Promise(() => {});
}

const courant = espaceCourant(espaceUtilisateur, espace);

const featureFlags = await fetchFeatureFlags();

document.body.dataset.plan = session.planId;
document.body.dataset.espace = courant || "aucun";

const planBadge = document.getElementById("planBadge");
if (planBadge) planBadge.textContent = PLAN_LABELS[session.planId];

// LA PASTILLE NE DIT QUE L'ESPACE OÙ L'ON SE TROUVE (lot S4).
// Elle concaténait les deux forfaits (« Gratuit · Diagnostic France »),
// ce qui affichait « Gratuit » à un client qui avait payé un dossier
// France, et rappelait les bourses à quelqu'un venu préparer une
// préinscription. Dans un espace, on porte le forfait de cet espace.
const topbarPlanLabel = document.getElementById("topbarPlanLabel");
if (topbarPlanLabel) {
topbarPlanLabel.textContent = courant === "preinscription"
? (PLAN_PREINSCRIPTION_LABELS[session.planPreinscriptionId] || PLAN_LABELS[session.planId])
: PLAN_LABELS[session.planId];
}

// Le bouton flottant Fitz, dans TOUS les espaces depuis le lot PRÉ-FITZ
// (2026-09-10) : le Dossier France a le chat. Sur un forfait qui ne l'a
// pas (Diagnostic France, gratuit), le wrapper data-feature="ai_chat"
// est retiré par applyFeatureLocks — absent, pas grisé, comme avant.
initFitzFab();

initBasculeEspace(espaceUtilisateur, courant);

applyFeatureLocks(session.planId, featureFlags, session.testerAccess, session.hasFitzExpress, session.planPreinscriptionId);
applyAdvisorVisibility(session.planId, featureFlags, session.testerAccess, session.planPreinscriptionId);

// Nom affiché dans la feuille « Menu » mobile (js/mobile-nav.js).
if (window.FitzMobileNav) {
window.FitzMobileNav.setUser((session.profile && session.profile.name) || session.userData.name || session.user.displayName || session.user.email);
// Lot S4 : la barre d'onglets et la feuille « Menu » se filtrent par
// espace (« Préparation aux tests » reste un outil bourse). L'onglet
// Fitz, lui, est servi aux deux espaces depuis le lot PRÉ-FITZ.
if (window.FitzMobileNav.appliquerEspace) window.FitzMobileNav.appliquerEspace(courant);
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
// L'espace auquel le compte a DROIT, et celui où il SE TROUVE : les
// deux diffèrent pour un client « les-deux », et les pages en ont
// besoin (portée des candidatures, vocabulaire, quotas).
espaceUtilisateur,
espace: courant,
locked: feature ? isFeatureLocked(session.planId, featureFlags, feature, session.testerAccess, session.hasFitzExpress, session.planPreinscriptionId) : false
};

}).catch((error) => {

console.error("Erreur de chargement de la page :", error);
showLoadError();

return new Promise(() => {});

});

}
