// -------- offers.js --------
// Page de choix du niveau d'accompagnement Fitz. Aucun paiement
// n'est traité ici : le palier choisi est transmis à payment.html
// via l'URL et sessionStorage, prêt pour
// l'intégration future de PayDunya (Wave, Orange Money, carte).
// Dépend de pricing-plans.js (SCHOLARBRIDGE_PLANS, buildCheckoutPayload).

const FITZ_MESSAGES = [
"Fitz analyse votre profil.",
"Fitz construit votre stratégie.",
"Fitz améliore votre CV.",
"Fitz optimise vos documents.",
"Fitz prépare votre dossier.",
"Fitz vous accompagne jusqu'au dépôt."
];

function initFitzRotator() {

const el = document.getElementById("fitzRotatorMessage");

if (!el) return;

let index = 0;

setInterval(() => {

index = (index + 1) % FITZ_MESSAGES.length;

el.classList.add("is-swapping");

setTimeout(() => {

el.textContent = FITZ_MESSAGES[index];
el.classList.remove("is-swapping");

}, 280);

}, 2800);

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

// CAUSE B — seuil indépendant de la hauteur.
// L'ancien `threshold: 0.12` exigeait que 12% de l'élément soit
// visible : au-delà d'une hauteur de viewport/0.12, la condition
// devient mathématiquement impossible et l'élément reste invisible
// pour toujours. La section du tableau comparatif atteint 5072px en
// mode empilé, soit 609px requis — inatteignable sur un téléphone en
// paysage. Le rootMargin négatif conserve l'effet recherché (révéler
// un peu après l'entrée à l'écran) sans dépendre de la hauteur.
}, { threshold: 0, rootMargin: "0px 0px -60px 0px" });

items.forEach((item) => {

// CAUSE A — ne jamais laisser un élément invisible faute d'avoir été vu.
// Poser `js-ready` bascule tous les .reveal à opacity:0 : la
// visibilité ne revient que par l'observer. Or au rechargement,
// Chrome restaure la position de défilement, et l'observer démarre
// donc avec une partie de la page DÉJÀ dépassée. Ces éléments-là
// n'entreront plus jamais dans le viewport si l'utilisateur ne
// remonte pas — le haut de la page restait blanc. On les révèle
// immédiatement plutôt que de les laisser masqués.
if (item.getBoundingClientRect().bottom < 0) {
item.classList.add("is-visible");
return;
}

observer.observe(item);

});

}

function initPlanSelection() {

document.querySelectorAll(".plan-cta").forEach((button) => {

button.addEventListener("click", () => {

const planId = button.dataset.plan;
const payload = buildCheckoutPayload(planId);

if (!payload) return;

sessionStorage.setItem("scholarbridgeCheckout", JSON.stringify(payload));

window.location.href = `payment.html?plan=${encodeURIComponent(planId)}`;

});

});

}

initFitzRotator();
initReveal();
initPlanSelection();

// lucide est chargé avec `defer` (2026-08-29) : ce script classique
// s'exécute AVANT lui, un appel direct ne rendrait aucune icône (et ne
// lèverait aucune erreur — le garde-fou window.lucide le rend
// silencieux). DOMContentLoaded se déclenche après les scripts différés.
document.addEventListener("DOMContentLoaded", () => {
if (window.lucide) lucide.createIcons();
});
