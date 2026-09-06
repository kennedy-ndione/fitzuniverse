/* ==========================================================
FITZUNIVERSE — MENU « PAYS » / « NIVEAU » / « TYPE » PERSONNALISÉ
(2026-08-29) — scholarships.html + universities.html.

Pourquoi ce fichier : un <select> HTML ouvre une liste dessinée par
l'OS (fond blanc, surlignage bleu sur Windows/Chrome) — aucune règle
CSS ne peut l'habiller. Ce script construit, à côté de chaque
<select> listé dans SELECT_IDS, un petit menu (bouton + liste <ul>)
qui porte les couleurs et la police du site (voir
css/catalog-redesign.css, section « MENU PAYS / NIVEAU / TYPE »).

#funderFilter (« Tous les types », bourses uniquement) ajouté le
2026-09-01 : créé le 2026-08-30, un jour APRÈS ce script, il était
resté un <select> natif — le seul de la barre à ouvrir la liste
blanche/bleue de l'OS que ce fichier existe précisément pour
remplacer (repéré par l'utilisateur sur capture, comme l'original).

Ce script NE TOUCHE PAS à scholarships.js / universities-page.js : le
<select> d'origine reste dans le DOM (juste masqué), garde sa valeur
à jour, et reçoit un évènement `change` natif à chaque sélection —
c'est cet évènement que ces deux fichiers écoutent déjà pour filtrer
et renaviguer. Le menu personnalisé n'est qu'un habillage par-dessus
un <select> qui continue de fonctionner exactement comme avant.

Deux subtilités de synchronisation, sans rien modifier ailleurs :
  - les options de #countryFilter arrivent après un fetch asynchrone
    (scholarships.js/universities-page.js) → un MutationObserver
    reconstruit le menu dès qu'elles apparaissent ;
  - la valeur initiale (lue dans l'URL) est posée par
    `countryFilter.value = ...` / `levelFilter.value = ...`, une
    simple affectation JS qui ne déclenche ni mutation ni évènement
    observable → un court sondage (quelques secondes après le
    chargement) rattrape ce cas, pour les deux menus.
========================================================== */

(function () {
"use strict";

const SELECT_IDS = ["countryFilter", "levelFilter", "funderFilter"];

function buildCustomSelect(select) {

if (!select || select.dataset.customSelectReady) return null;
select.dataset.customSelectReady = "1";

const wrap = document.createElement("div");
wrap.className = "catalog-custom-select";

const trigger = document.createElement("button");
trigger.type = "button";
trigger.className = "catalog-custom-select-trigger";
trigger.setAttribute("aria-haspopup", "listbox");
trigger.setAttribute("aria-expanded", "false");
const label = select.getAttribute("aria-label");
if (label) trigger.setAttribute("aria-label", label);

const valueSpan = document.createElement("span");
valueSpan.className = "catalog-custom-select-value";
trigger.appendChild(valueSpan);

const caret = document.createElement("i");
caret.setAttribute("data-lucide", "chevron-down");
caret.setAttribute("aria-hidden", "true");
caret.className = "catalog-custom-select-caret";
trigger.appendChild(caret);

const list = document.createElement("ul");
list.className = "catalog-custom-select-list";
list.setAttribute("role", "listbox");
list.hidden = true;

wrap.appendChild(trigger);

select.insertAdjacentElement("afterend", wrap);
select.classList.add("catalog-select-native-hidden");
select.setAttribute("tabindex", "-1");
select.setAttribute("aria-hidden", "true");

// La liste est déplacée directement sous <body> plutôt que gardée dans
// `wrap` (2026-08-29). Constaté sur bourses/universités en largeur
// mobile : .catalog-search-bar porte un `transform` (animation
// .reveal.is-visible) qui crée son propre contexte d'empilement — la
// liste, piégée dedans malgré son z-index, se faisait recouvrir par
// .catalog-country-pills (rendu plus tard dans le DOM, hors de ce
// contexte). Sortir la liste de la hiérarchie visuelle de la barre et
// la positionner en `fixed` (voir positionList) l'affranchit de tout
// contexte d'empilement parasite, quel qu'il soit.
document.body.appendChild(list);

function positionList() {

const rect = trigger.getBoundingClientRect();

list.style.position = "fixed";
list.style.top = (rect.bottom + 6) + "px";
list.style.left = rect.left + "px";
list.style.minWidth = rect.width + "px";
list.style.zIndex = "9999";

}

function renderOptions() {

list.innerHTML = "";

Array.from(select.options).forEach((opt, idx) => {

const li = document.createElement("li");
li.setAttribute("role", "option");
li.className = "catalog-custom-select-option";
li.dataset.value = opt.value;
li.textContent = opt.text;

if (idx === select.selectedIndex) {
li.classList.add("is-selected");
li.setAttribute("aria-selected", "true");
}

li.addEventListener("click", () => {
selectValue(opt.value);
close();
trigger.focus();
});

list.appendChild(li);

});

}

function syncTrigger() {
const opt = select.options[select.selectedIndex];
valueSpan.textContent = opt ? opt.text : "";
}

function selectValue(value) {

if (select.value === value) return;

select.value = value;
syncTrigger();
renderOptions();

select.dispatchEvent(new Event("change", { bubbles: true }));

}

function open() {

if (!list.children.length) renderOptions();

positionList();
list.hidden = false;
wrap.classList.add("is-open");
trigger.setAttribute("aria-expanded", "true");

list.querySelectorAll(".is-focused").forEach((el) => el.classList.remove("is-focused"));
const current = list.querySelector(".is-selected") || list.firstElementChild;
if (current) current.classList.add("is-focused");

document.addEventListener("click", onDocClick, true);
document.addEventListener("keydown", onKeyDown, true);
// La liste est en `position:fixed`, calée sur le bouton au moment de
// l'ouverture : un défilement de la PAGE ou un redimensionnement la
// laisserait décalée — elle se referme alors, comme la plupart des
// menus déroulants. Le défilement INTERNE de la liste, lui, ne doit
// jamais la fermer : voir onScroll.
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

// Ne referme le menu que si le défilement vient d'AILLEURS que la
// liste : le listener est en phase de capture (nécessaire pour voir
// les défilements de conteneurs intermédiaires), il intercepte donc
// aussi le défilement interne de la liste — qui, lui, est justement
// l'usage normal du menu (bug corrigé le 2026-08-30 : impossible de
// faire défiler la liste des pays, elle se refermait au premier cran).
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

const options = Array.from(list.children);
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
if (focused) {
selectValue(focused.dataset.value);
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

renderOptions();
syncTrigger();

if (window.lucide && typeof window.lucide.createIcons === "function") {
window.lucide.createIcons({ nameAttr: "data-lucide", root: wrap });
}

return { renderOptions, syncTrigger };

}

function init() {

const widgets = {};

SELECT_IDS.forEach((id) => {
const select = document.getElementById(id);
if (select) widgets[id] = buildCustomSelect(select);
});

SELECT_IDS.forEach((id) => {

const select = document.getElementById(id);
const widget = widgets[id];
if (!select || !widget) return;

// Options ajoutées après coup (countryFilter, peuplé depuis un fetch).
const observer = new MutationObserver(() => {
widget.renderOptions();
widget.syncTrigger();
});
observer.observe(select, { childList: true });

// Valeur initiale posée par une simple affectation `select.value = …`
// (countryFilter/levelFilter), invisible pour un MutationObserver.
let lastValue = select.value;
let ticks = 0;
const poll = setInterval(() => {

ticks += 1;

if (select.value !== lastValue) {
lastValue = select.value;
widget.renderOptions();
widget.syncTrigger();
}

if (ticks > 25) clearInterval(poll); // ~5 s à 200 ms, largement assez pour un fetch de catalogue

}, 200);

});

}

if (document.readyState === "loading") {
document.addEventListener("DOMContentLoaded", init);
} else {
init();
}

})();
