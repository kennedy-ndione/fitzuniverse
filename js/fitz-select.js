/* ==========================================================
FITZUNIVERSE — MENUS DÉROULANTS DE L'ESPACE CONNECTÉ (2026-09-02)

Pourquoi ce fichier : un <select> HTML ouvre une liste dessinée par
l'OS — fond blanc, surlignage BLEU sur Windows/Chrome — qu'aucune
règle CSS ne peut habiller. Le catalogue public a déjà réglé ce
problème avec js/catalog-select.js (bouton + liste <ul> aux couleurs
du site, select natif conservé et fonctionnel). Ce fichier GÉNÉRALISE
ce patron à l'espace étudiant : signalé par l'utilisateur sur
ai-email (« Candidature concernée ») et ai-translate (langues), mais
appliqué à TOUS les <select> des pages connectées — applications
(statut, relance, dossier), profile, compress, ai-letter…

Différences assumées avec catalog-select.js :
- GÉNÉRIQUE : habille tous les <select> du document (opt-out par
  attribut data-no-fitz-select), pas une liste d'ids en dur.
- Pas de sondage à 200 ms pour rattraper les affectations
  `select.value = …` : la propriété `value` de CHAQUE instance est
  interceptée (defineProperty délégant au prototype), donc le libellé
  du bouton suit toute affectation programmatique — openModal()
  d'applications.js, la présélection d'ai-email.js, le chargement du
  profil… — sans minuterie.
- Le caret est un SVG en dur (métrique Lucide) : ce module peut
  s'exécuter avant que lucide (defer) soit prêt, un data-lucide
  resterait vide.

Le select d'origine reste dans le DOM, garde sa valeur et émet un
`change` natif à chaque sélection : les scripts de page qui l'écoutent
ne changent pas d'une ligne.

Styles : css/fitz-select.css — feuille PROPRIÉTAIRE, chargée ICI (lot
CONTRÔLES-UNIFIÉS, 2026-09-11) : toute page qui habille un select l'a,
Control Center compris, sans rien recopier.
========================================================== */

const CSS_HREF = new URL("../css/fitz-select.css", import.meta.url).href;

function chargerStyle() {
if (document.querySelector(`link[href="${CSS_HREF}"], link[href$="css/fitz-select.css"]`)) return;
const link = document.createElement("link");
link.rel = "stylesheet";
link.href = CSS_HREF;
document.head.appendChild(link);
}

const CARET_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m6 9 6 6 6-6"/></svg>`;

const CHECK_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M20 6 9 17l-5-5"/></svg>`;

const nativeValue = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value");
const nativeSelectedIndex = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "selectedIndex");

function buildFitzSelect(select) {

if (!select || select.dataset.fitzSelectReady || select.hasAttribute("data-no-fitz-select")) return;
// Déjà habillé par js/catalog-select.js (filtres du catalogue public) :
// pour un visiteur CONNECTÉ, initShellChrome() repasse sur ces mêmes
// selects et posait un SECOND menu par-dessus le premier (constaté le
// 2026-09-03 sur scholarships/universities — deux listes déroulantes
// empilées, dont une nue, visibles sur bureau comme sur téléphone).
if (select.dataset.customSelectReady || select.classList.contains("catalog-select-native-hidden")) return;
select.dataset.fitzSelectReady = "1";

const wrap = document.createElement("div");
wrap.className = "fitz-select";

const trigger = document.createElement("button");
trigger.type = "button";
trigger.className = "fitz-select-trigger";
trigger.setAttribute("aria-haspopup", "listbox");
trigger.setAttribute("aria-expanded", "false");

// Le nom accessible vient du <label> qui gouverne le select (for=id ou
// label englobant) quand il existe, sinon de l'aria-label du select.
const ownLabel = select.getAttribute("aria-label")
|| (select.id && document.querySelector(`label[for="${select.id}"]`)?.textContent.trim())
|| select.closest("label")?.querySelector("span")?.textContent.trim()
|| "";
if (ownLabel) trigger.setAttribute("aria-label", ownLabel);

const valueSpan = document.createElement("span");
valueSpan.className = "fitz-select-value";
trigger.appendChild(valueSpan);

trigger.insertAdjacentHTML("beforeend", `<span class="fitz-select-caret">${CARET_SVG}</span>`);

const list = document.createElement("ul");
list.className = "fitz-select-list";
list.setAttribute("role", "listbox");
if (ownLabel) list.setAttribute("aria-label", ownLabel);
list.hidden = true;

wrap.appendChild(trigger);
select.insertAdjacentElement("afterend", wrap);
select.classList.add("fitz-select-native");
select.setAttribute("tabindex", "-1");
select.setAttribute("aria-hidden", "true");

// Comme catalog-select : la liste vit sous <body> en position:fixed,
// à l'abri de tout contexte d'empilement (transform d'une animation
// .reveal, backdrop-filter d'une modale…) et de tout overflow:auto
// (la carte de la modale candidature défile — une liste absolue y
// serait rognée ou allongerait la zone de défilement).
document.body.appendChild(list);

function positionList() {

const rect = trigger.getBoundingClientRect();
const spaceBelow = window.innerHeight - rect.bottom;

list.style.position = "fixed";
list.style.minWidth = rect.width + "px";
list.style.maxWidth = Math.max(rect.width, 320) + "px";
list.style.left = Math.max(8, Math.min(rect.left, window.innerWidth - rect.width - 8)) + "px";
list.style.zIndex = "9999";

// Ouvre vers le haut quand la place manque dessous (composer en bas
// de page, modale) — le menu reste entièrement visible.
if (spaceBelow < 240 && rect.top > window.innerHeight - rect.bottom) {
list.style.top = "auto";
list.style.bottom = (window.innerHeight - rect.top + 6) + "px";
} else {
list.style.bottom = "auto";
list.style.top = (rect.bottom + 6) + "px";
}

}

function renderOptions() {

list.innerHTML = "";

// Lot FINITIONS-VISUELLES (2026-09-11) : les TITRES DE GROUPE. Un
// <optgroup label="…"> devient une ligne de titre (role="presentation",
// jamais focusable) au-dessus de ses options — l'admin distingue ainsi
// « En vente » de « Retirées de la vente ». Les options gardent leur
// index GLOBAL dans select.options.
Array.from(select.querySelectorAll("optgroup, option")).forEach((el) => {

if (el.tagName === "OPTGROUP") {
if (el.hidden || !el.querySelector("option:not([hidden])")) return;
const titre = document.createElement("li");
titre.setAttribute("role", "presentation");
titre.className = "fitz-select-group";
titre.textContent = el.label || "";
list.appendChild(titre);
return;
}

const opt = el;
const idx = opt.index;

// Lot ACCEPTATION (2026-09-11) : une option masquée (`hidden`) est
// retirée de la liste, comme le ferait le select natif — le formulaire
// de candidature retire ainsi les statuts interdits à une carte.
if (opt.hidden) return;

const li = document.createElement("li");
li.setAttribute("role", "option");
li.className = "fitz-select-option";
li.dataset.index = String(idx);

const text = document.createElement("span");
text.className = "fitz-select-option-text";
text.textContent = opt.text;
li.appendChild(text);

if (idx === select.selectedIndex) {
li.classList.add("is-selected");
li.setAttribute("aria-selected", "true");
li.insertAdjacentHTML("beforeend", `<span class="fitz-select-option-check">${CHECK_SVG}</span>`);
}

if (opt.disabled) li.classList.add("is-disabled");

li.addEventListener("click", () => {
if (opt.disabled) return;
selectIndex(idx);
close();
trigger.focus();
});

list.appendChild(li);

});

}

function syncTrigger() {
const opt = select.options[select.selectedIndex];
valueSpan.textContent = opt ? opt.text : "";
trigger.disabled = select.disabled;
wrap.classList.toggle("is-disabled", select.disabled);
}

function selectIndex(idx) {

if (select.selectedIndex === idx) return;

nativeSelectedIndex.set.call(select, idx);
syncTrigger();

select.dispatchEvent(new Event("change", { bubbles: true }));

}

function open() {

renderOptions();
positionList();
list.hidden = false;
wrap.classList.add("is-open");
trigger.setAttribute("aria-expanded", "true");

list.querySelectorAll(".is-focused").forEach((el) => el.classList.remove("is-focused"));
const current = list.querySelector(".is-selected") || list.querySelector('[role="option"]');
if (current) {
current.classList.add("is-focused");
current.scrollIntoView({ block: "nearest" });
}

document.addEventListener("click", onDocClick, true);
document.addEventListener("keydown", onKeyDown, true);
window.addEventListener("scroll", onScroll, true);
window.addEventListener("resize", close, true);

}

function close() {

list.hidden = true;
wrap.classList.remove("is-open");
trigger.setAttribute("aria-expanded", "false");

document.removeEventListener("click", onDocClick, true);
document.removeEventListener("keydown", onKeyDown, true);
window.removeEventListener("scroll", onScroll, true);
window.removeEventListener("resize", close, true);

}

function onDocClick(event) {
if (!wrap.contains(event.target) && !list.contains(event.target)) close();
}

// Ne referme que si le défilement vient d'AILLEURS que la liste — le
// défilement interne du menu est son usage normal (bug corrigé sur
// catalog-select le 2026-08-30, même garde ici).
function onScroll(event) {
if (event.target === list || (event.target instanceof Node && list.contains(event.target))) return;
close();
}

function setFocused(options, idx) {
options.forEach((el) => el.classList.remove("is-focused"));
const target = options[idx];
if (target) {
target.classList.add("is-focused");
target.scrollIntoView({ block: "nearest" });
}
}

function onKeyDown(event) {

// Les titres de groupe (role="presentation") ne se parcourent pas.
const options = Array.from(list.querySelectorAll('[role="option"]'));
const focused = list.querySelector(".is-focused");
const idx = options.indexOf(focused);

if (event.key === "Escape") {

close();
trigger.focus();

} else if (event.key === "ArrowDown") {

event.preventDefault();
setFocused(options, Math.min(options.length - 1, idx + 1));

} else if (event.key === "ArrowUp") {

event.preventDefault();
setFocused(options, Math.max(0, idx - 1));

} else if (event.key === "Enter" || event.key === " ") {

event.preventDefault();
if (focused && !focused.classList.contains("is-disabled")) {
selectIndex(parseInt(focused.dataset.index, 10));
close();
trigger.focus();
}

} else if (event.key === "Tab") {

close();

}

}

trigger.addEventListener("click", () => {
if (wrap.classList.contains("is-open")) close();
else open();
});

// --- Synchronisation avec le monde extérieur ---

// 1. Affectations programmatiques `select.value = …` (openModal
// d'applications.js, présélection d'ai-email.js, chargement du
// profil…) : la propriété de l'instance délègue au prototype puis
// resynchronise le bouton. Un simple MutationObserver ne voit pas ces
// affectations, et le sondage périodique de catalog-select ne couvre
// que les premières secondes.
Object.defineProperty(select, "value", {
get() { return nativeValue.get.call(select); },
set(v) { nativeValue.set.call(select, v); syncTrigger(); },
configurable: true
});

// 2. Sélection au clavier/écran tactile via le select natif resté
// focusable par script, ou change émis par d'autres composants.
select.addEventListener("change", syncTrigger);

// 3. Options ajoutées ou remplacées après coup (ai-translate peuple
// ses langues, ai-email ses candidatures) + attribut disabled.
const observer = new MutationObserver(() => {
if (!list.hidden) renderOptions();
syncTrigger();
});
observer.observe(select, { childList: true, attributes: true, attributeFilter: ["disabled"] });

// 4. form.reset() repasse tous les selects à leur valeur par défaut
// sans émettre de change : resynchronise après coup.
const form = select.closest("form");
if (form) form.addEventListener("reset", () => setTimeout(syncTrigger, 0));

syncTrigger();

}

/**
* Habille tous les <select> du document (ou du sous-arbre donné).
* Idempotent : un select déjà habillé est ignoré, un select marqué
* data-no-fitz-select est laissé natif.
*
* Les selects CRÉÉS APRÈS COUP sont habillés automatiquement : le
* champ téléphone (js/phone-field.js) fabrique ses sélecteurs de pays
* (#phonePays/#whatsappPays) bien après initShellChrome — sans cette
* veille, ils resteraient les deux seuls menus natifs de l'espace
* (constaté sur profile.html : 6 selects, 4 habillés).
*/
let bodyObserverStarted = false;

export function initFitzSelects(root = document) {

chargerStyle();
root.querySelectorAll("select").forEach(buildFitzSelect);

if (bodyObserverStarted || root !== document) return;
bodyObserverStarted = true;

new MutationObserver((mutations) => {
for (const mutation of mutations) {
for (const node of mutation.addedNodes) {
if (!(node instanceof Element)) continue;
if (node.tagName === "SELECT") buildFitzSelect(node);
else node.querySelectorAll?.("select").forEach(buildFitzSelect);
}
}
}).observe(document.body, { childList: true, subtree: true });

}
