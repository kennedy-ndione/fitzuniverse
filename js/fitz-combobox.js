/* ==========================================================
FITZUNIVERSE — CHAMP À SUGGESTIONS (lot CONTRÔLES-UNIFIÉS, 2026-09-11)

Remplace <input list="…"> + <datalist> : le panneau d'un datalist est
dessiné par le système d'exploitation — noir, police système, curseur
minuscule — et aucune règle CSS ne l'atteint (photo de Charles,
diagnostic-france.html et scholarships.html). Ici le panneau est le
même que celui du menu déroulant (css/fitz-select.css, .fitz-select-list).

Ce que <datalist> faisait bien est CONSERVÉ :
 - on tape librement, la valeur reste ce qu'on a tapé ;
 - la liste filtre à la frappe (préfixe d'abord, puis contenu) ;
 - tout se fait au clavier : ↓ ↑ pour parcourir, Entrée pour retenir,
   Échap pour fermer — et à la souris ou au doigt ;
 - l'autocomplétion du navigateur (autocomplete="country-name") n'est
   pas touchée : le champ reste un <input type="text"> ordinaire.

Rôles ARIA : combobox + listbox, aria-activedescendant sur l'option
parcourue. Le champ émet `input` et `change` quand une suggestion est
retenue : les scripts qui l'écoutent ne changent pas.
========================================================== */

const CSS_HREF = new URL("../css/fitz-select.css", import.meta.url).href;

function chargerStyle() {
if (document.querySelector(`link[href="${CSS_HREF}"], link[href$="css/fitz-select.css"]`)) return;
const link = document.createElement("link");
link.rel = "stylesheet";
link.href = CSS_HREF;
document.head.appendChild(link);
}

function normaliser(texte) {
return String(texte || "").toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").trim();
}

let compteur = 0;

/**
* Habille un champ texte d'une liste de suggestions.
* @param {HTMLInputElement} input
* @param {string[]} valeurs — les suggestions (texte tel quel)
* @param {{max?:number}} options
*/
export function initFitzCombobox(input, valeurs, options = {}) {
if (!input || input.dataset.fitzComboboxReady) return null;
input.dataset.fitzComboboxReady = "1";
chargerStyle();

const max = options.max || 12;
const id = `fitzCombobox${++compteur}`;

// L'ancien datalist, s'il traîne encore, ne doit plus doubler le panneau.
if (input.hasAttribute("list")) {
const ancien = document.getElementById(input.getAttribute("list"));
if (ancien && ancien.tagName === "DATALIST") ancien.remove();
input.removeAttribute("list");
}

const wrap = document.createElement("div");
wrap.className = "fitz-combobox";
input.parentNode.insertBefore(wrap, input);
wrap.appendChild(input);

const liste = document.createElement("ul");
liste.className = "fitz-select-list fitz-combobox-list";
liste.id = `${id}-liste`;
liste.setAttribute("role", "listbox");
liste.hidden = true;
wrap.appendChild(liste);

input.setAttribute("role", "combobox");
input.setAttribute("aria-autocomplete", "list");
input.setAttribute("aria-expanded", "false");
input.setAttribute("aria-controls", liste.id);
if (!input.getAttribute("autocomplete")) input.setAttribute("autocomplete", "off");

let visibles = [];
let focus = -1;

function filtrer(saisie) {
const q = normaliser(saisie);
if (!q) return valeurs.slice(0, max);
const prefixe = [], contenu = [];
for (const v of valeurs) {
const n = normaliser(v);
if (n.startsWith(q)) prefixe.push(v);
else if (n.includes(q)) contenu.push(v);
if (prefixe.length >= max) break;
}
return [...prefixe, ...contenu].slice(0, max);
}

function rendre() {
liste.innerHTML = "";
if (!visibles.length) {
const vide = document.createElement("li");
vide.className = "fitz-combobox-vide";
vide.textContent = "Aucune suggestion — votre saisie est gardée telle quelle.";
liste.appendChild(vide);
return;
}
visibles.forEach((v, i) => {
const li = document.createElement("li");
li.className = "fitz-select-option";
li.id = `${id}-option-${i}`;
li.setAttribute("role", "option");
li.setAttribute("aria-selected", i === focus ? "true" : "false");
if (i === focus) li.classList.add("is-focused");
const texte = document.createElement("span");
texte.className = "fitz-select-option-text";
texte.textContent = v;
li.appendChild(texte);
// mousedown, pas click : le blur du champ fermerait la liste avant le clic.
li.addEventListener("mousedown", (e) => { e.preventDefault(); retenir(i); });
liste.appendChild(li);
});
}

function ouvrir() {
visibles = filtrer(input.value);
focus = -1;
rendre();
liste.hidden = false;
input.setAttribute("aria-expanded", "true");
}

function fermer() {
liste.hidden = true;
focus = -1;
input.setAttribute("aria-expanded", "false");
input.removeAttribute("aria-activedescendant");
}

function mettreLeFocus(i) {
if (!visibles.length) return;
focus = (i + visibles.length) % visibles.length;
rendre();
input.setAttribute("aria-activedescendant", `${id}-option-${focus}`);
liste.children[focus]?.scrollIntoView?.({ block: "nearest" });
}

function retenir(i) {
const v = visibles[i];
if (v === undefined) return;
input.value = v;
fermer();
input.dispatchEvent(new Event("input", { bubbles: true }));
input.dispatchEvent(new Event("change", { bubbles: true }));
}

input.addEventListener("input", ouvrir);
input.addEventListener("focus", ouvrir);
input.addEventListener("blur", () => setTimeout(fermer, 120));
input.addEventListener("keydown", (e) => {
if (e.key === "ArrowDown") { e.preventDefault(); if (liste.hidden) ouvrir(); mettreLeFocus(focus + 1); }
else if (e.key === "ArrowUp") { e.preventDefault(); if (liste.hidden) ouvrir(); mettreLeFocus(focus - 1); }
else if (e.key === "Enter") { if (!liste.hidden && focus >= 0) { e.preventDefault(); retenir(focus); } }
else if (e.key === "Escape") { if (!liste.hidden) { e.preventDefault(); fermer(); } }
else if (e.key === "Tab") fermer();
});

return { ouvrir, fermer, element: wrap };
}
