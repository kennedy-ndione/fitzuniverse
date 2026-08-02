// -------- offers.js --------
// Page de choix du niveau d'accompagnement Fitz. Aucun paiement
// n'est traité ici : le palier choisi est transmis à payment.html
// (pas encore créée) via l'URL et sessionStorage, prêt pour
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

}, { threshold: 0.12 });

items.forEach((item) => observer.observe(item));

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

if (window.lucide) lucide.createIcons();
