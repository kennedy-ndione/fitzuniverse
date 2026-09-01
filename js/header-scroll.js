/**
* ==========================================================
* Fitz — comportement du header public au défilement
*
* Deux effets indépendants, tous deux pilotés par un seul écouteur de
* scroll (throttlé via requestAnimationFrame pour rester fluide à
* 60 fps) :
*
*  1. ".is-scrolled" (déjà existant) : le header passe de transparent
*     (posé sur la photo du héros) à un fond opaque flouté dès qu'on
*     quitte le tout début de la page.
*
*  2. ".is-hidden" (nouveau) : dès que l'utilisateur commence à
*     descendre, le header s'efface complètement (translation + fondu)
*     pour laisser toute la place au catalogue — immersion totale. Il
*     ne réapparaît que lorsque l'utilisateur revient tout en haut de
*     la page, pas au premier pixel remonté : c'est un choix
*     volontaire (pas la home d'un site classique, mais l'exploration
*     d'un catalogue) plutôt que le pattern "réapparaît dès qu'on
*     remonte un peu", qui aurait fait clignoter le header à chaque
*     petite hésitation de scroll.
*
* position:fixed est conservé (pas sticky) : sticky ne permet pas d'
* effet de disparition/réapparition indépendant du flux du document,
* et le header doit rester superposable à la photo du héros en haut
* de page — sticky forcerait un espace réservé dans le flux, ce que
* fixed évite déjà (voir le padding-top des sections héros).
*
* Partagé par index.html, universities.html, scholarship-details.html
* et scholarships.html — les pages qui chargent css/header.css. Remplace le
* bloc "HEADER TRANSPARENT SUR LA PHOTO" qui vivait auparavant en
* double dans js/main.js (index.html uniquement) : centralisé ici pour
* que les 2 autres pages en bénéficient enfin, au lieu de rester figées.
* ==========================================================
*/

(() => {

const header = document.querySelector(".header");

if (!header) return;

const SCROLLED_THRESHOLD = 40;
const TOP_THRESHOLD = 8;

let lastScrollY = window.scrollY;
let ticking = false;

function applyHeaderState() {

const y = window.scrollY;

header.classList.toggle("is-scrolled", y > SCROLLED_THRESHOLD);

if (y <= TOP_THRESHOLD) {

header.classList.remove("is-hidden");

} else if (y > lastScrollY) {

header.classList.add("is-hidden");

}
// Remonte sans atteindre le tout début de la page : le header reste
// masqué (voir commentaire ci-dessus) — seul le retour complet en
// haut le fait réapparaître.

lastScrollY = y;
ticking = false;

}

function onScroll() {

if (ticking) return;

ticking = true;
requestAnimationFrame(applyHeaderState);

}

applyHeaderState();

window.addEventListener("scroll", onScroll, { passive: true });

})();
