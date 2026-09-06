/**
* ==========================================================
* Fitz - Homepage init
* Révélation au scroll, icônes Lucide.
* ==========================================================
*/

// Activé au plus tôt (avant DOMContentLoaded) afin que la classe
// "js-ready" soit posée avant le premier paint : voir animations.css,
// qui garde tout le contenu visible tant que cette classe est absente.
document.documentElement.classList.add("js-ready");

document.addEventListener("DOMContentLoaded", () => {

if (window.lucide) lucide.createIcons();

// MENU MOBILE : le bouton rond + petit panneau du 2026-09-01 ont été
// remplacés le 2026-09-03 par la navigation mobile commune à tout le
// site (js/mobile-nav.js + css/mobile-nav.css) — feuille plein écran
// injectée, plus aucun balisage ni code ici.

// Le comportement du header (fond au scroll + disparition/réapparition
// immersive) vit désormais dans js/header-scroll.js, partagé par
// index.html/universities.html/scholarship-details.html — voir ce
// fichier pour le détail. Chargé comme script séparé dans le <head>/
// avant </body> de chaque page, pas ici, pour que les 2 autres pages
// (qui ne chargent pas main.js) en bénéficient aussi.

// ==========================================================
// PARALLAXE DU PIED DE PAGE (2026-09-03)
// La <picture> du footer (surdimensionnée de 14 % en CSS) glisse d'une
// fraction du défilement pendant que le footer traverse l'écran — la
// photo semble avoir de la profondeur derrière les colonnes. Un seul
// écouteur passif + requestAnimationFrame, transform seul. Coupé par
// prefers-reduced-motion (le CSS force alors transform:none).
// ==========================================================

(function initFooterParallax() {

const photo = document.querySelector(".footer-photo-feature .footer-photo picture");
const footer = document.querySelector(".footer-photo-feature");
if (!photo || !footer) return;
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

const RATIO = 0.12;
let ticking = false;

function update() {
ticking = false;
const rect = footer.getBoundingClientRect();
const vh = window.innerHeight || 1;
if (rect.bottom < 0 || rect.top > vh) return;
// -1 quand le footer entre par le bas, 0 quand il est calé en bas.
const progress = Math.max(-1, Math.min(1, (rect.top + rect.height - vh) / vh));
photo.style.transform = `translate3d(0, ${(-progress * RATIO * rect.height).toFixed(1)}px, 0)`;
}

function onScroll() {
if (ticking) return;
ticking = true;
requestAnimationFrame(update);
}

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll, { passive: true });
update();

})();

// ==========================================================
// RÉVÉLATION AU SCROLL
// ==========================================================

const revealItems = document.querySelectorAll(".reveal");

if (revealItems.length && "IntersectionObserver" in window) {

const observer = new IntersectionObserver((entries) => {

entries.forEach((entry) => {
if (entry.isIntersecting) {
entry.target.classList.add("is-visible");
observer.unobserve(entry.target);
}
});

}, { threshold: 0.15 });

revealItems.forEach((item) => observer.observe(item));

} else {

revealItems.forEach((item) => item.classList.add("is-visible"));

}

// COMPTEURS ANIMÉS : partis d'ici le 2026-09-01. L'ancien système
// [data-count-to] animait des valeurs écrites en dur dans le HTML et
// n'avait plus aucun élément à servir depuis que les statistiques
// viennent de Firestore. Le compteur au scroll vit désormais dans
// js/homepage-teaser.js (setCount/animateCountTo), au seul endroit qui
// connaît les vraies valeurs — voir son commentaire pour la course
// fetch/viewport que l'ancien emplacement rendait inévitable.

});
