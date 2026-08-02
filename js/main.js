/**
* ==========================================================
* ScholarBridge - Homepage init
* Révélation au scroll, compteurs animés, icônes Lucide.
* ==========================================================
*/

// Activé au plus tôt (avant DOMContentLoaded) afin que la classe
// "js-ready" soit posée avant le premier paint : voir animations.css,
// qui garde tout le contenu visible tant que cette classe est absente.
document.documentElement.classList.add("js-ready");

document.addEventListener("DOMContentLoaded", () => {

if (window.lucide) lucide.createIcons();

// Le comportement du header (fond au scroll + disparition/réapparition
// immersive) vit désormais dans js/header-scroll.js, partagé par
// index.html/universities.html/scholarship-details.html — voir ce
// fichier pour le détail. Chargé comme script séparé dans le <head>/
// avant </body> de chaque page, pas ici, pour que les 2 autres pages
// (qui ne chargent pas main.js) en bénéficient aussi.

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

// ==========================================================
// COMPTEURS ANIMÉS (statistiques du hero)
// ==========================================================

const countItems = document.querySelectorAll("[data-count-to]");

function animateCount(el) {

const target = parseInt(el.dataset.countTo, 10);
const duration = 1400;
const start = performance.now();

function step(now) {

const progress = Math.min((now - start) / duration, 1);
const eased = 1 - Math.pow(1 - progress, 3);

el.textContent = Math.round(eased * target);

if (progress < 1) {
requestAnimationFrame(step);
}

}

requestAnimationFrame(step);

}

if (countItems.length && "IntersectionObserver" in window) {

const countObserver = new IntersectionObserver((entries) => {

entries.forEach((entry) => {
if (entry.isIntersecting) {
animateCount(entry.target);
countObserver.unobserve(entry.target);
}
});

}, { threshold: 0.4 });

countItems.forEach((item) => countObserver.observe(item));

} else {

countItems.forEach((item) => {
item.textContent = item.dataset.countTo;
});

}

});
