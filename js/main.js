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
// (Le parallaxe du pied de page, 2026-09-03, a été supprimé le
// 2026-09-10 — lot PEIGNE-FIN : le pied de page est un composant injecté
// après ce script, la fonction ne trouvait plus jamais sa photo.)
// ==========================================================

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
