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
import { demarrerPresence } from "./presence.js";

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
// passSeul / PASS_LABEL (lot ACCEPTATION, partie 4) : le Pass Découverte
// seul ne mène qu'au chat — une seule définition, pure.
import { advisorOuvert, ESPACE_OUTILS, passSeul, PASS_LABEL, resolvePlanPreinscriptionFrance } from "./plan-features.js";
// Lot FITZ-RECOURS : à la place d'un outil verrouillé, « Bloqué ?
// Demandez à Fitz » — le diagnostic (quelle formule l'ouvre) est
// calculé, donc gratuit ; la conversation, elle, reste réservée.
import { boutonRecours } from "./fitz-recours.js";
// Les portails sont une donnée PAYANTE gardée en mémoire le temps de la
// session. js/portails.js annonce depuis le lot S3 qu'elle est retirée à
// la déconnexion — mais `oublierPortails()` n'était appelée NULLE PART.
// Sans conséquence tant que la déconnexion navigue (l'état du module
// meurt avec la page), et c'est pourtant exactement le scénario que le
// commentaire invoque — cybercafé, salle informatique — qui mérite de ne
// pas dépendre d'un effet de bord. On l'appelle.
import { oublierPortails } from "./portails.js";

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

// La carte des portails ne survit pas à la session : un poste partagé
// ne doit pas garder les portails de l'étudiant précédent.
oublierPortails();

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

// LE GLOSSAIRE TOURNE AUSSI ICI (lot R21, 2026-09-18).
//
// Il ne tournait que sur les pages PUBLIQUES : js/pied-de-page.js le
// lance après avoir posé le pied de page, et js/glossaire-seul.js le
// lance sur les pages publiques qui n'en ont pas. Aucune page de
// l'espace étudiant ne chargeait l'un ou l'autre.
//
// MESURÉ SUR LE SITE DÉPLOYÉ le 2026-09-18, sur le texte réellement
// rendu : « portail », « Études en France », « préinscription » et
// « vœux » apparaissaient SANS explication sur la route comme sur
// « Mes candidatures » — c'est-à-dire précisément là où ces mots
// décident de quelque chose, et juste après que l'étudiant a payé. Le
// glossaire éclairait la vitrine et laissait l'atelier dans le noir.
//
// `surveillerTermes` explique maintenant, puis à chaque rendu : la
// route repeint ses étapes, les cartes se redessinent, et le registre
// des termes déjà vus vit sur le document — un mot n'est donc expliqué
// qu'une fois par page, même après vingt repeints. On vise <main> et
// non <body>, comme le pied de page : la barre latérale et la barre
// d'onglets ne sont pas des phrases.
//
// Module chargé à part, comme sur les pages publiques : un échec
// (réseau filtrant) laisse l'espace intact, sans explications — jamais
// sans contenu.
import("./glossaire.js")
.then((g) => g.surveillerTermes(document.querySelector("main") || document.body))
.catch((e) => console.warn("Glossaire indisponible :", e));

// Entrée du site : une seule fois par session de navigateur (garde
// sessionStorage dans analytics.js). Posé ici et non au niveau du
// module : l'admin importe hidePageLoader() de ce fichier et ne doit
// pas compter ses propres passages comme des entrées étudiantes.
trackVisitOnce();

// LE SKIP D'UNE TRANSITION N'EST PAS UNE ERREUR (lot R4, 2026-09-17).
// MESURÉ, et rien de plus : pendant la recette de la route, la console
// de l'espace étudiant portait un « Uncaught (in promise) AbortError:
// Transition was skipped » — le SEUL message de toute la traversée des
// quinze étapes. Aucune feuille de l'espace ne déclare
// `@view-transition` (vérifié à l'exécution sur document.styleSheets) :
// la transition est donc ouverte par la page d'AVANT, sur la foi du
// `@view-transition { navigation: auto }` de css/vivant.css, que les
// six pages vitrine chargent. Les promesses qu'elle tend ne sont
// reprises que par js/vivant.js — absent des pages connectées.
//
// On tient donc ici les mêmes promesses que js/vivant.js tient là-bas
// (il documente la règle en long : « UN SKIP N'EST PAS UNE ERREUR »).
// Ni `unhandledrejection` global, ni try/catch attrape-tout : seules
// les promesses DE CETTE transition sont marquées traitées, une vraie
// erreur continue de remonter. Une console propre est la condition
// pour voir la prochaine erreur, celle qui comptera.
tenirLaTransition();

if (window.lucide) lucide.createIcons();

}

function tenirLaTransition() {
if (window.__fitzTransitionTenue) return;
window.__fitzTransitionTenue = true;
const prendre = (evenement) => {
const t = evenement && evenement.viewTransition;
if (!t) return;
const rien = () => {};
if (t.finished && t.finished.catch) t.finished.catch(rien);
if (t.ready && t.ready.catch) t.ready.catch(rien);
if (t.updateCallbackDone && t.updateCallbackDone.catch) t.updateCallbackDone.catch(rien);
};
window.addEventListener("pageswap", prendre);
window.addEventListener("pagereveal", prendre);
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
// Lot FITZ-CHOISIT, partie 0 (2026-09-11) : sous 400 px, la barre haute
// débordait (bascule 183 px + cloche + pastille de formule). La pastille
// garde son libellé (décision du 2026-09-02) ; c'est la bascule qui se
// compacte : icône seule sous 400 px (css/journey-shell.css), les mêmes
// icônes que le choix de parcours d'offers.html — `award` pour Bourses,
// `landmark` pour Préinscription. Le libellé reste dans aria-label et
// title ; l'état actif reste visible (fond plein).
const entree = (href, cle, icone, libelle) => `
<a href="${href}" class="espace-bascule-btn${courant === cle ? " is-active" : ""}"${courant === cle ? ' aria-current="page"' : ""} data-espace="${cle}" aria-label="${libelle}" title="${libelle}"><i data-lucide="${icone}" aria-hidden="true"></i><span class="espace-bascule-libelle">${libelle}</span></a>`;
nav.innerHTML = entree("espace-bourse.html", "bourse", "award", "Bourses") + entree("espace-preinscription.html", "preinscription", "landmark", "Préinscription");

nav.addEventListener("click", (e) => {
const lien = e.target.closest("[data-espace]");
if (lien) ecrireEspaceChoisi(lien.dataset.espace);
});

const ancre = topbar.querySelector(".journey-topbar-actions") || topbar;
ancre.insertBefore(nav, ancre.firstChild);

}

// ==========================================================
// LE PASS DÉCOUVERTE SEUL (lot ACCEPTATION, partie 4)
// ==========================================================
// Les trois pages qu'un Pass seul peut ouvrir. Tout le reste de l'espace
// le renvoie vers le chat (bootstrapShell, ci-dessous).
export const PAGES_DU_PASS = ["ai-chat.html", "messages.html", "account.html"];

function pageCourante() {
return (window.location.pathname.split("/").pop() || "").toLowerCase();
}

// Sa navigation ne montre que ça : barre d'onglets Fitz et Menu ; feuille
// « Menu » Paramètres, Messages de l'équipe, Se déconnecter ; barre haute
// sans « Mon parcours » ni icône du profil, le logo menant au chat.
// Retiré du DOM, comme appliquerEspace le fait déjà (lot S4).
function appliquerPassSeul() {

document.body.dataset.passSeul = "true";

document.querySelectorAll(".journey-topbar .back-link").forEach((el) => el.remove());
document.querySelectorAll('.journey-topbar a[href="profile.html"]').forEach((el) => el.remove());
document.querySelectorAll(".journey-topbar .fitz-lockup").forEach((a) => {
a.setAttribute("href", "ai-chat.html");
a.setAttribute("aria-label", "FitzUniverse — discuter avec Fitz");
});

// La sidebar historique (pages à shell latéral) : mêmes trois portes.
document.querySelectorAll(".sidebar .nav-link").forEach((a) => {
const href = (a.getAttribute("href") || "").split("?")[0].toLowerCase();
if (!PAGES_DU_PASS.includes(href)) a.remove();
});

if (window.FitzMobileNav && window.FitzMobileNav.appliquerPassSeul) window.FitzMobileNav.appliquerPassSeul();

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

// LOT ACCEPTATION, PARTIE 4 — LE PASS DÉCOUVERTE NE MÈNE QU'AU CHAT.
// Un compte qui n'a QUE le Pass (passSeul, js/plan-features.js) est
// renvoyé vers ai-chat.html dès qu'il ouvre une page de l'espace :
// dashboard.html, les deux hubs, les candidatures, les documents, le
// profil, les outils. Trois pages restent ouvertes : le chat, les
// messages de l'équipe (et « Signaler un problème »), les paramètres.
// Les pages publiques (offres, paiement, catalogue) ne passent pas par
// ici : il peut toujours acheter une formule complète.
const seulementLePass = passSeul(session);

if (seulementLePass && !PAGES_DU_PASS.includes(pageCourante())) {
window.location.replace("ai-chat.html");
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

// LE HUB DE CET ESPACE, POUR LES LIENS DE RETOUR (lot R2, 2026-09-17).
// Les douze pages d'outils portent un « ← Mon parcours » écrit en dur
// sur dashboard.html, qui n'est qu'un aiguillage : y revenir coûtait
// deux chargements de coquille. js/back-link.js lit cette note et
// récrit le lien. Écrite ici parce que c'est le seul endroit qui
// connaisse à la fois l'espace du compte et celui où l'on se trouve.
try {
const hub = HUB_ESPACE[courant] || HUB_ESPACE[espaceUtilisateur] || "";
if (hub) sessionStorage.setItem("fitz_hub", hub);
} catch (error) { /* navigation privée : le markup garde son href */ }

const featureFlags = await fetchFeatureFlags();

document.body.dataset.plan = session.planId;
document.body.dataset.espace = courant || "aucun";

// La pastille d'un Pass seul dit « Pass Découverte », jamais « Gratuit »
// (lot ACCEPTATION, partie 4). Elle mène aux offres, comme toute formule.
const libelleFormule = seulementLePass ? PASS_LABEL : PLAN_LABELS[session.planId];

const planBadge = document.getElementById("planBadge");
if (planBadge) planBadge.textContent = libelleFormule;

// LA PASTILLE NE DIT QUE L'ESPACE OÙ L'ON SE TROUVE (lot S4).
// Elle concaténait les deux forfaits (« Gratuit · Diagnostic France »),
// ce qui affichait « Gratuit » à un client qui avait payé un dossier
// France, et rappelait les bourses à quelqu'un venu préparer une
// préinscription. Dans un espace, on porte le forfait de cet espace.
const topbarPlanLabel = document.getElementById("topbarPlanLabel");
if (topbarPlanLabel) {
topbarPlanLabel.textContent = courant === "preinscription"
? (session.planPreinscriptionLabel || PLAN_PREINSCRIPTION_LABELS[session.planPreinscriptionId] || libelleFormule)
: libelleFormule;
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
// Depuis le 2026-09-23 : et seulement avec une offre FRANCE — une offre
// d'un autre pays ouvre le verrou, pas la page (js/diagnostic-france-page.js).
if (!isFeatureLocked(session.planId, featureFlags, "diagnostic_france", session.testerAccess, session.hasFitzExpress, session.planPreinscriptionId) &&
(session.testerAccess || resolvePlanPreinscriptionFrance(session.userData || {}))) {
window.FitzMobileNav.ouvrirEntree("diagnostic_france");
}
}

// Lot ACCEPTATION, partie 4 : la navigation d'un Pass seul ne montre
// que Fitz, les messages de l'équipe, les paramètres et la déconnexion.
if (seulementLePass) appliquerPassSeul();

if (window.lucide) lucide.createIcons();

// MESSAGERIE POUR TOUS (décision de Charles, 2026-09-23) : la cloche et
// le fil avec l'équipe sont montrés à TOUT compte, gratuit compris.
// Jusqu'ici un compte qui n'avait rien payé n'avait ni cloche ni
// messagerie (règle du 2026-09-20) — l'équipe ne pouvait donc lui dire
// ni de compléter son profil ni par où commencer, sauf par e-mail. Le
// droit de répondre est désormais universel (DROITS_UNIVERSELS,
// js/plan-features.js) ; on passe tout de même par isFeatureLocked pour
// qu'il n'existe qu'UNE règle.
initMessagesPanel(session.user.uid, {
canReply: !isFeatureLocked(session.planId, featureFlags, "student_messaging", session.testerAccess, session.hasFitzExpress, session.planPreinscriptionId)
});

// « En ligne » (2026-09-23) : la pastille verte de la barre haute et le
// battement que le Control Center écoute (js/presence.js).
demarrerPresence(session.user.uid);

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
planPreinscriptionLabel: session.planPreinscriptionLabel || "",
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
