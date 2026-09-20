/**
* ==========================================================
* FitzUniverse — navigation mobile (2026-09-03)
* ==========================================================
*
* Un seul script, chargé tel quel (pas un module) par toutes les pages
* du site, qui INJECTE le chrome de navigation mobile — aucun balisage
* à recopier page par page, donc aucune page qui « oublie » son menu :
*
*  1. SITE PUBLIC (.header ou .page-brandbar présent) : bouton menu
*     animé (hamburger → croix) + feuille plein écran avec les grandes
*     destinations, la section « Votre espace » et le CTA principal.
*
*  2. ESPACE ÉTUDIANT (.journey-topbar visible) : barre d'onglets basse
*     Parcours · Candidatures · Documents · Fitz · Menu, et feuille
*     basse « Menu » (profil, paramètres, messages, tests, entretien,
*     catalogue, déconnexion). Sur les pages catalogue à double
*     présentation (js/dual-shell.js), la barre haute n'existe qu'une
*     fois la session trouvée : js/app-shell.js appelle alors
*     window.FitzMobileNav.initShell() depuis initShellChrome().
*
*  3. Les pages « tunnel » (questionnaire, paiement, connexion,
*     suspendu) ne chargent pas ce script : leur lien de retour seul est
*     un choix, pas un oubli — voir css/mobile-nav.css.
*
* Styles : css/mobile-nav.css. Verrous de formule : l'onglet Fitz porte
* data-feature="ai_chat" + a[data-real-href], exactement le contrat de
* applyFeatureLocks() (js/app-shell.js) — sur une formule sans chat, il
* se cadenasse et mène aux formules, sans une ligne de code ici.
* ==========================================================
*/

(() => {

"use strict";

const PAGE = (location.pathname.split("/").pop() || "index.html").toLowerCase();

const MARK_SVG = `<svg class="fitz-mark" viewBox="0 0 100 100" fill="none" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><circle class="mark-structure" cx="50" cy="50" r="34" stroke-width="11" stroke-linecap="round" stroke-dasharray="130 83.6" transform="rotate(-90 50 50)"/><circle class="mark-accent" cx="50" cy="50" r="34" stroke-width="11" stroke-linecap="round" stroke-dasharray="42 171.6" stroke-dashoffset="-150" transform="rotate(-90 50 50)"/></svg>`;

function icon(name) {
return `<i data-lucide="${name}" aria-hidden="true"></i>`;
}

function isCurrent(href) {
return href.split("#")[0].toLowerCase() === PAGE;
}

function refreshIcons(root) {
if (window.lucide && typeof lucide.createIcons === "function") {
try { lucide.createIcons(root ? { root } : undefined); } catch (e) { lucide.createIcons(); }
}
}

// Les icônes Lucide sont créées par le script différé de chaque page ;
// si ce script arrive APRÈS nous, on repasse une fois qu'il est là.
function whenLucideReady(cb) {
if (window.lucide) { cb(); return; }
let tries = 0;
const t = setInterval(() => {
tries += 1;
if (window.lucide) { clearInterval(t); cb(); }
else if (tries > 40) clearInterval(t);
}, 100);
}

// ==========================================================
// 1. SITE PUBLIC — feuille plein écran
// ==========================================================

const PUBLIC_PRIMARY = [
{ href: "index.html", title: "Accueil", sub: "Bourse ou préinscription, accompagné jusqu'au dépôt", icon: "house" },
{ href: "scholarships.html", title: "Bourses", sub: "Catalogue vérifié, bourse par bourse", icon: "award" },
// Lot Préinscriptions (2026-09-07) : la même entrée que le menu public.
{ href: "preinscriptions.html", title: "Préinscriptions", sub: "Partir en finançant vos études", icon: "file-check" },
{ href: "universities.html", title: "Universités", sub: "Établissements, coûts vérifiés et portails officiels", icon: "landmark" },
{ href: "eligibility-test.html", title: "Mon diagnostic Fitz", sub: "5 minutes, confidentiel, sans engagement", icon: "compass" },
{ href: "offers.html", title: "Formules", sub: "Accompagnement jusqu'au dépôt", icon: "layers" }
];

function buildPublicSheet() {

// Les deux pages catalogue n'ont pas « Connexion » (décision du
// 2026-09-01, rétablie par la grille A) — ni dans l'en-tête, ni ici.
const sansConnexion = isCurrent("scholarships.html") || isCurrent("universities.html");

const sheet = document.createElement("div");
sheet.className = "mnav-sheet";
sheet.id = "mnavSheet";
sheet.setAttribute("role", "dialog");
sheet.setAttribute("aria-modal", "true");
sheet.setAttribute("aria-label", "Menu");

const items = PUBLIC_PRIMARY.map((l) => `
<li>
<a href="${l.href}" class="mnav-link"${isCurrent(l.href) ? ' aria-current="page"' : ""}>
<span class="mnav-link-icon">${icon(l.icon)}</span>
<span class="mnav-link-text">
<span class="mnav-link-title">${l.title}</span>
<span class="mnav-link-sub">${l.sub}</span>
</span>
<span class="mnav-link-arrow">${icon("chevron-right")}</span>
</a>
</li>`).join("");

sheet.innerHTML = `
<div class="mnav-sheet-top on-dark">
<a href="index.html" class="fitz-lockup" aria-label="FitzUniverse — accueil">${MARK_SVG}<span class="fitz-lockup-text"><span class="fitz-lockup-name">Fitz</span><span class="fitz-lockup-sub">Universe</span></span></a>
<button type="button" class="mnav-close" id="mnavClose" aria-label="Fermer le menu">${icon("x")}</button>
</div>
<nav class="mnav-sheet-inner" aria-label="Navigation principale">
<p class="mnav-eyebrow">Explorer</p>
<ul class="mnav-list">${items}</ul>

${sansConnexion ? "" : `<div class="mnav-section">
<p class="mnav-eyebrow">Votre espace</p>
<ul class="mnav-list">
<li>
<a href="inscription.html" class="mnav-link">
<span class="mnav-link-icon">${icon("user-plus")}</span>
<span class="mnav-link-text">
<span class="mnav-link-title">Créer un compte</span>
<span class="mnav-link-sub">Gratuit — être alerté quand une bourse ouvre</span>
</span>
<span class="mnav-link-arrow">${icon("chevron-right")}</span>
</a>
</li>
<li>
<a href="login.html" class="mnav-link">
<span class="mnav-link-icon">${icon("log-in")}</span>
<span class="mnav-link-text">
<span class="mnav-link-title">Se connecter</span>
<span class="mnav-link-sub">Retrouver mon parcours et mes candidatures</span>
</span>
<span class="mnav-link-arrow">${icon("chevron-right")}</span>
</a>
</li>
</ul>
</div>`}

<div class="mnav-footer">
<a href="eligibility-test.html" class="mnav-cta">Découvrir mes opportunités ${icon("arrow-right")}</a>
<p class="mnav-fineprint">Gratuit · 5 minutes · Conçu d'abord pour les étudiants africains</p>
</div>
</nav>`;

return sheet;

}

function initPublic() {

if (document.getElementById("mnavToggle")) return;

// Point d'ancrage du bouton : à droite de l'en-tête public, ou dans la
// barre de marque des pages sans en-tête (offers, results, diagnostic).
const header = document.querySelector(".header:not([hidden])");
const brandbar = document.querySelector(".page-brandbar");

let mount = null;

if (header) {
mount = header.querySelector(".header-cta-group") || header.querySelector(".header-actions") || header.querySelector(".header-container");
} else if (brandbar) {
mount = brandbar;
}

if (!mount) return;

const toggle = document.createElement("button");
toggle.type = "button";
toggle.id = "mnavToggle";
toggle.className = "mnav-toggle";
toggle.setAttribute("aria-label", "Ouvrir le menu");
toggle.setAttribute("aria-expanded", "false");
toggle.setAttribute("aria-controls", "mnavSheet");
toggle.innerHTML = `<span class="mnav-toggle-bars" aria-hidden="true"><span></span><span></span><span></span></span>`;

mount.appendChild(toggle);

// Ancien menu de l'accueil (bouton rond + petit panneau) : retiré du
// DOM pour qu'aucun doublon ne subsiste, même si le balisage traîne.
document.querySelectorAll("#headerMenuBtn, #headerMenuPanel").forEach((el) => el.remove());

const sheet = buildPublicSheet();
document.body.appendChild(sheet);

let lastFocus = null;

function open() {
lastFocus = document.activeElement;
sheet.classList.add("is-open");
document.body.classList.add("mnav-open");
toggle.setAttribute("aria-expanded", "true");
toggle.setAttribute("aria-label", "Fermer le menu");
refreshIcons(sheet);
// Le focus passe dans la feuille pour les lecteurs d'écran / clavier.
const closeBtn = sheet.querySelector("#mnavClose");
if (closeBtn) setTimeout(() => closeBtn.focus({ preventScroll: true }), 60);
}

function close(returnFocus) {
if (!sheet.classList.contains("is-open")) return;
sheet.classList.remove("is-open");
document.body.classList.remove("mnav-open");
toggle.setAttribute("aria-expanded", "false");
toggle.setAttribute("aria-label", "Ouvrir le menu");
if (returnFocus !== false && lastFocus && typeof lastFocus.focus === "function") {
lastFocus.focus({ preventScroll: true });
}
}

toggle.addEventListener("click", () => {
if (sheet.classList.contains("is-open")) close(); else open();
});

sheet.querySelector("#mnavClose").addEventListener("click", () => close());

// Un lien cliqué ferme la feuille (la navigation suit).
sheet.addEventListener("click", (e) => {
if (e.target.closest("a")) close(false);
});

document.addEventListener("keydown", (e) => {
if (e.key === "Escape") close();
// Le focus reste dans la feuille tant qu'elle est ouverte.
if (e.key === "Tab" && sheet.classList.contains("is-open")) {
const f = [...sheet.querySelectorAll("a, button")].filter((el) => el.offsetParent !== null);
if (!f.length) return;
const first = f[0], last = f[f.length - 1];
if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}
});

// Retour au format bureau (rotation d'une tablette) : la feuille
// n'existe plus, le corps doit redevenir défilable.
const mq = window.matchMedia("(min-width: 641px)");
const onChange = () => { if (mq.matches) close(false); };
if (mq.addEventListener) mq.addEventListener("change", onChange); else mq.addListener(onChange);

window.addEventListener("pageshow", (e) => { if (e.persisted) close(false); });

whenLucideReady(() => refreshIcons(sheet));

}

// ==========================================================
// 2. ESPACE ÉTUDIANT — barre d'onglets + feuille « Menu »
// ==========================================================

// LOT S4 : le champ « espace » dit à quel accompagnement une destination
// appartient ; absent, elle appartient aux deux. Le premier onglet mène
// au HUB, dont l'adresse dépend de l'espace — dashboard.html n'est plus
// qu'un aiguillage.
const TABS = [
{ href: "dashboard.html", label: "Parcours", icon: "route", hub: true },
{ href: "applications.html", label: "Candidatures", icon: "folder-open" },
{ href: "documents.html", label: "Documents", icon: "file-text" }
];

const HUB_PAR_ESPACE = { bourse: "espace-bourse.html", preinscription: "espace-preinscription.html" };

// Le champ « espace » restreint une entrée à un accompagnement. Les sept
// liens n'en portaient aucun : la feuille proposait « Préparation aux
// tests » et « Entretien » à un client préinscription, qui arrivait sur
// une page verrouillée. Le profil, le compte, les messages et le
// catalogue des universités restent communs — ils n'appartiennent à
// aucun parcours.
const MENU_ITEMS = [
{ href: "profile.html", label: "Mon profil", icon: "user-round" },
{ href: "account.html", label: "Paramètres", icon: "settings" },
{ href: "messages.html", label: "Messages de l'équipe", icon: "bell", id: "mnavMenuMessages" },
{ href: "test-prep.html", label: "Préparation aux tests", icon: "book-open", espace: "bourse" },
{ href: "interview-prep.html", label: "Entretien", icon: "mic", espace: "bourse" }
// LOT P4 (2026-09-19) : « Catalogue des bourses » et « Universités »
// retirés du menu de l'ESPACE. Le catalogue reste la vitrine publique
// (voir PUBLIC_PRIMARY, plus haut, qui n'est pas touché) ; il n'est
// plus une sortie de l'espace accompagné, où c'est Fitz qui choisit.
];

// ENTRÉES SOUMISES À UN DROIT (2026-09-08). Elles ne sont PAS rendues au
// montage : la feuille « Menu » se construit au DOMContentLoaded, bien
// avant que la session soit résolue, et une entrée posée puis retirée
// clignoterait — ou pire, resterait si la résolution échouait. Elles
// n'entrent dans le DOM que sur appel explicite du shell, une fois le
// droit connu : FitzMobileNav.ouvrirEntree("diagnostic_france").
//
// diagnostic-france.html n'avait, avant ce jour, aucune entrée de menu
// nulle part — le seul lien du site vivait dans payment.js, après le
// paiement. Un produit acheté doit se retrouver depuis son espace.
const MENU_FEATURE_ITEMS = [
{ href: "diagnostic-france.html", label: "Diagnostic France", icon: "calculator", id: "mnavMenuDiagnosticFrance", feature: "diagnostic_france" }
];

function renderMenuItem(m) {
return `
<a href="${m.href}" class="mnav-menu-item"${m.id ? ` id="${m.id}"` : ""}${isCurrent(m.href) ? ' aria-current="page"' : ""}>
${icon(m.icon)}<span>${m.label}</span>
</a>`;
}

/**
* Applique l'espace courant à la navigation (lot S4), une fois la
* session résolue : le hub prend son adresse, et tout ce qui appartient
* à l'AUTRE accompagnement est RETIRÉ du DOM.
*
* Retiré, pas masqué : un lien caché reste dans la tabulation, dans un
* Ctrl+F et dans la lecture d'un lecteur d'écran. Proposer « Fitz » à
* un client préinscription, c'était l'envoyer sur une page verrouillée
* et lui vendre ce qu'il n'a pas acheté, au milieu de ce qu'il a payé.
*/
function appliquerEspace(espace) {

if (!espace) return;

const hub = HUB_PAR_ESPACE[espace];
const barre = document.getElementById("mnavTabbar");

if (barre && hub) {
const onglet = barre.querySelector('.mnav-tab[href="dashboard.html"]');
if (onglet) {
onglet.setAttribute("href", hub);
if (isCurrent(hub)) onglet.setAttribute("aria-current", "page");
}
// L'onglet Fitz est servi aux DEUX espaces depuis le lot PRÉ-FITZ
// (2026-09-10) : le Dossier France a le chat. Il portait
// data-feature="ai_chat" avant ce lot déjà — c'est le verrou de
// formule qui le retire à qui n'a pas le chat, pas l'espace.
}

const grille = document.getElementById("mnavMenuGrid");
if (!grille) return;

for (const item of MENU_ITEMS) {
if (!item.espace || item.espace === espace) continue;
const lien = grille.querySelector(`a[href="${item.href}"]`);
if (lien) lien.remove();
}

}

/**
* Lot ACCEPTATION, partie 4 (2026-09-11) : un compte qui n'a QUE le Pass
* Découverte ne voit que Fitz et Menu dans la barre d'onglets, et
* Paramètres, Messages de l'équipe, Se déconnecter dans la feuille.
* Parcours, Candidatures, Documents, Mon profil, tests, entretien,
* catalogues, « Accueil du site » et « Formules » sont RETIRÉS du DOM —
* comme appliquerEspace le fait pour l'autre accompagnement.
*/
const PAGES_DU_PASS = ["ai-chat.html", "messages.html", "account.html"];

function appliquerPassSeul() {

const barre = document.getElementById("mnavTabbar");
if (barre) {
barre.querySelectorAll(".mnav-tab").forEach((tab) => {
if (tab.classList.contains("mnav-tab--fitz") || tab.id === "mnavMenuBtn") return;
tab.remove();
});
}

const grille = document.getElementById("mnavMenuGrid");
if (grille) {
grille.querySelectorAll("a").forEach((a) => {
const href = (a.getAttribute("href") || "").split("?")[0].toLowerCase();
if (!PAGES_DU_PASS.includes(href) || href === "ai-chat.html") a.remove();
});
}

document.querySelectorAll(".mnav-menu-site").forEach((el) => el.remove());

}

/** Insère une entrée de menu soumise à un droit, une fois ce droit connu. */
function ouvrirEntree(feature) {
const item = MENU_FEATURE_ITEMS.find((m) => m.feature === feature);
const grille = document.getElementById("mnavMenuGrid");
if (!item || !grille || document.getElementById(item.id)) return;
grille.insertAdjacentHTML("beforeend", renderMenuItem(item));
refreshIcons(grille);
}

function initialsFrom(name) {
const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
if (!parts.length) return "";
return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

function initShell() {

if (document.getElementById("mnavTabbar")) return;

const topbar = document.querySelector(".journey-topbar");
if (!topbar) return;

// Sur les pages à double présentation, la barre haute vit dans un
// conteneur [hidden] tant que la session n'est pas résolue : on
// n'installe rien pour un visiteur anonyme.
if (topbar.closest("[hidden]")) return;

document.body.classList.add("mnav-has-tabbar");

// --- Barre d'onglets -------------------------------------------------
const bar = document.createElement("nav");
bar.id = "mnavTabbar";
bar.className = "mnav-tabbar";
bar.setAttribute("aria-label", "Navigation de l'espace");

const tabs = TABS.map((t) => `
<a href="${t.href}" class="mnav-tab"${isCurrent(t.href) ? ' aria-current="page"' : ""}>
${icon(t.icon)}<span>${t.label}</span>
</a>`).join("");

bar.innerHTML = `${tabs}
<a href="ai-chat.html" data-real-href="ai-chat.html" data-feature="ai_chat" class="mnav-tab mnav-tab--fitz"${isCurrent("ai-chat.html") ? ' aria-current="page"' : ""} aria-label="Discuter avec Fitz">
${MARK_SVG}<span>Fitz</span><span class="mnav-tab-lock">${icon("lock")}</span>
</a>
<button type="button" class="mnav-tab" id="mnavMenuBtn" aria-expanded="false" aria-controls="mnavMenuSheet" aria-haspopup="dialog">
${icon("menu")}<span>Menu</span><span class="mnav-tab-dot" id="mnavTabDot" hidden></span>
</button>`;

document.body.appendChild(bar);

// --- Feuille « Menu » ---------------------------------------------
const backdrop = document.createElement("div");
backdrop.className = "mnav-menu-backdrop";
backdrop.id = "mnavMenuBackdrop";

const sheet = document.createElement("div");
sheet.className = "mnav-menu-sheet";
sheet.id = "mnavMenuSheet";
sheet.setAttribute("role", "dialog");
sheet.setAttribute("aria-modal", "true");
sheet.setAttribute("aria-label", "Menu de mon espace");

const planLabel = (document.getElementById("topbarPlanLabel") || {}).textContent || "";

const items = MENU_ITEMS.map(renderMenuItem).join("");

sheet.innerHTML = `
<span class="mnav-menu-grip" aria-hidden="true"></span>
<div class="mnav-menu-head">
<span class="mnav-menu-avatar" id="mnavMenuAvatar" aria-hidden="true">${icon("user-round")}</span>
<div class="mnav-menu-who">
<div class="mnav-menu-name" id="mnavMenuName">Mon espace</div>
<a href="offers.html" class="mnav-menu-plan">${icon("badge-check")}<span>Formule <span id="mnavMenuPlan">${planLabel.trim() || "…"}</span></span></a>
</div>
<button type="button" class="mnav-menu-close" id="mnavMenuClose" aria-label="Fermer le menu">${icon("x")}</button>
</div>
<div class="mnav-menu-grid" id="mnavMenuGrid">${items}</div>
<button type="button" class="mnav-menu-logout" id="mnavMenuLogout">${icon("log-out")}<span>Se déconnecter</span></button>
<div class="mnav-menu-site">
<a href="index.html">Accueil du site</a>
<a href="offers.html">Formules</a>
</div>`;

document.body.appendChild(backdrop);
document.body.appendChild(sheet);

const menuBtn = bar.querySelector("#mnavMenuBtn");

function openMenu() {
sheet.classList.add("is-open");
backdrop.classList.add("is-open");
document.body.classList.add("mnav-menu-open");
menuBtn.setAttribute("aria-expanded", "true");
menuBtn.classList.add("is-active");
refreshIcons(sheet);
const close = sheet.querySelector("#mnavMenuClose");
if (close) setTimeout(() => close.focus({ preventScroll: true }), 60);
}

function closeMenu(returnFocus) {
if (!sheet.classList.contains("is-open")) return;
sheet.classList.remove("is-open");
backdrop.classList.remove("is-open");
document.body.classList.remove("mnav-menu-open");
menuBtn.setAttribute("aria-expanded", "false");
menuBtn.classList.remove("is-active");
if (returnFocus !== false) menuBtn.focus({ preventScroll: true });
}

menuBtn.addEventListener("click", () => {
if (sheet.classList.contains("is-open")) closeMenu(); else openMenu();
});

backdrop.addEventListener("click", () => closeMenu());
sheet.querySelector("#mnavMenuClose").addEventListener("click", () => closeMenu());
sheet.addEventListener("click", (e) => { if (e.target.closest("a")) closeMenu(false); });

document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });

// Glisser vers le bas sur la poignée / l'en-tête ferme la feuille.
let touchY = null;
sheet.addEventListener("touchstart", (e) => { if (sheet.scrollTop <= 0) touchY = e.touches[0].clientY; }, { passive: true });
sheet.addEventListener("touchmove", (e) => {
if (touchY === null) return;
if (e.touches[0].clientY - touchY > 70) { touchY = null; closeMenu(false); }
}, { passive: true });
sheet.addEventListener("touchend", () => { touchY = null; }, { passive: true });

// Déconnexion : le vrai bouton (#logoutBtn, câblé par js/app-shell.js)
// reste dans la barre haute, masqué ≤720px — on lui délègue le clic.
sheet.querySelector("#mnavMenuLogout").addEventListener("click", () => {
const real = document.getElementById("logoutBtn");
if (real) real.click();
});

// Formule : suit la pastille de la barre haute, mise à jour par
// bootstrapShell()/dual-shell après la session.
const planSrc = document.getElementById("topbarPlanLabel");
const planDst = sheet.querySelector("#mnavMenuPlan");
if (planSrc && planDst) {
const sync = () => { const t = planSrc.textContent.trim(); if (t) planDst.textContent = t; };
sync();
new MutationObserver(sync).observe(planSrc, { childList: true, characterData: true, subtree: true });
}

// Point « non lu » : miroir de celui de la cloche (#messagesBellDot).
const dotSrc = document.getElementById("messagesBellDot");
const dotDst = bar.querySelector("#mnavTabDot");
if (dotSrc && dotDst) {
const sync = () => { dotDst.hidden = dotSrc.hidden; };
sync();
new MutationObserver(sync).observe(dotSrc, { attributes: true, attributeFilter: ["hidden"] });
}

const mq = window.matchMedia("(min-width: 721px)");
const onChange = () => { if (mq.matches) closeMenu(false); };
if (mq.addEventListener) mq.addEventListener("change", onChange); else mq.addListener(onChange);

whenLucideReady(() => { refreshIcons(bar); refreshIcons(sheet); });

}

/** Nom affiché dans la feuille « Menu » — appelé par js/app-shell.js
* une fois la session résolue (prénom + nom du profil). */
function setUser(name) {
const n = document.getElementById("mnavMenuName");
const a = document.getElementById("mnavMenuAvatar");
const clean = String(name || "").trim();
if (!clean) return;
if (n) n.textContent = clean;
if (a) { const ini = initialsFrom(clean); if (ini) a.textContent = ini; }
}

// ==========================================================
// CLAVIER DU TÉLÉPHONE — hauteur réellement visible (2026-09-03)
// visualViewport.height suit l'ouverture du clavier (100dvh non, sur
// iOS) : on l'expose en --vvh pour les pages plein cadre (chat Fitz,
// messagerie), et on remet la page en haut quand le clavier s'ouvre
// — Safari fait défiler le document pour montrer le champ, ce qui
// décalait tout le cadre et laissait un vide en dessous.
// ==========================================================

function initViewportHeight() {

const vv = window.visualViewport;
if (!vv) return;

const root = document.documentElement;
const MOBILE = () => window.matchMedia("(max-width: 720px)").matches;

// Les deux pages de conversation : chat Fitz et messagerie. Elles
// seules sont des cadres figés dont la géométrie dépend du clavier.
function conversationScroller() {
if (!document.getElementById("chatApp") && !document.querySelector(".messages-page-card")) return null;
return document.getElementById("chatScroll") || document.getElementById("messagesPageThread");
}

function stickToBottom() {
const scroller = conversationScroller();
if (scroller) scroller.scrollTop = scroller.scrollHeight;
}

// ----------------------------------------------------------
// POURQUOI DEUX PASSES (2026-09-03, retour utilisateur : « la barre
// de saisie tremble quelques secondes puis redevient normale »)
//
// L'ouverture du clavier iOS dure ~300 ms, et pendant toute
// l'animation Safari émet des DIZAINES d'événements visualViewport :
// la hauteur descend par paliers, et le décalage (offsetTop) DÉPASSE
// puis revient. Appliquer chacune de ces valeurs telle quelle, c'est
// demander au cadre de suivre une valeur qui oscille — d'où le
// tremblement, qui s'arrête pile quand l'animation se termine.
//
// D'où la séparation :
//   • EN DIRECT, uniquement la HAUTEUR, et seulement si elle a
//     vraiment changé d'un pixel entier. Le composer monte avec le
//     clavier : c'est le mouvement attendu, il doit être fluide.
//   • APRÈS STABILISATION (200 ms sans nouvel événement), tout ce qui
//     ferait sauter la mise en page : le décalage du viewport, la
//     classe kb-open (qui masque l'avis / la barre d'historique), le
//     recollage du fil en bas. Une seule fois, à la bonne valeur.
//
// Les micro-oscillations restantes du décalage sont absorbées par une
// transition de 120 ms sur le cadre (§7 de css/mobile-nav.css).
// ----------------------------------------------------------

let raf = 0;
let settleTimer = 0;
let lastHeight = -1;
let lastOffset = -1;
let keyboardWasOpen = false;

// tolerance : en direct on ignore les variations d'un ou deux pixels
// (iOS renvoie 480, 476, 474, 475, 476… en fin d'animation — suivre
// ces allers-retours, c'est faire vibrer le composer d'un cheveu).
// La passe de stabilisation, elle, pose la valeur exacte.
function setHeight(tolerance) {
const height = Math.round(vv.height);
if (Math.abs(height - lastHeight) <= (tolerance || 0)) return;
lastHeight = height;
root.style.setProperty("--vvh", height + "px");
}

function applyLive() {
raf = 0;
setHeight(2);
}

function applySettled() {

settleTimer = 0;
setHeight(0);

const offset = Math.round(vv.offsetTop);
if (offset !== lastOffset) {
lastOffset = offset;
root.style.setProperty("--vvtop", offset + "px");
}

// window.innerHeight NE bouge PAS quand le clavier s'ouvre sur iOS
// (c'est le viewport de mise en page) : la différence des deux EST
// la hauteur du clavier. Seuil à 120px pour ne pas confondre avec la
// barre d'URL de Safari, qui se rétracte de ~60px au défilement.
const keyboardOpen = MOBILE() && (window.innerHeight - lastHeight) > 120;

if (keyboardOpen !== keyboardWasOpen) {
keyboardWasOpen = keyboardOpen;
root.classList.toggle("kb-open", keyboardOpen);
// Le dernier message doit rester visible : sans ça, le composer
// recouvre la fin du fil.
stickToBottom();
}

// Document verrouillé côté CSS (§7 de css/mobile-nav.css) : s'il
// reste un défilement résiduel, on le ramène à zéro — ici seulement,
// jamais dans la boucle d'animation (un scrollTo y déclenche un
// nouvel événement, donc une boucle, donc le tremblement).
if (conversationScroller() && MOBILE() && window.scrollY !== 0) {
window.scrollTo(0, 0);
}

}

function schedule() {
if (!raf) raf = requestAnimationFrame(applyLive);
if (settleTimer) clearTimeout(settleTimer);
settleTimer = setTimeout(applySettled, 200);
}

vv.addEventListener("resize", schedule);
vv.addEventListener("scroll", schedule);
window.addEventListener("orientationchange", () => setTimeout(applySettled, 300));

// Toucher le champ de saisie : on colle le fil au bas AVANT que le
// clavier ne monte, pour que la remontée parte déjà du bon endroit.
// Une seule fois — la passe de stabilisation fait le reste.
document.addEventListener("focusin", (event) => {
if (!MOBILE()) return;
if (!event.target.closest("textarea, input[type='text'], input:not([type])")) return;
if (!conversationScroller()) return;
stickToBottom();
});

applySettled();

}

// ==========================================================
// Amorçage
// ==========================================================

function init() {
initPublic();
initShell();
initViewportHeight();
}

if (document.readyState === "loading") {
document.addEventListener("DOMContentLoaded", init);
} else {
init();
}

window.FitzMobileNav = { initShell, initPublic, setUser, ouvrirEntree, appliquerEspace, appliquerPassSeul };

})();
