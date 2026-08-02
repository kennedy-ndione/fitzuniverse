// -------- payment.js --------
// Récapitulatif et activation de l'accompagnement choisi. Le palier est
// toujours relu depuis pricing-plans.js à partir de son identifiant —
// jamais depuis un prix stocké côté client — pour qu'un navigateur ne
// puisse jamais faire afficher un montant différent de celui défini
// dans SCHOLARBRIDGE_PLANS. Aucune clé secrète ni appel PayDunya ici :
// voir requestActivation() plus bas pour l'architecture prévue.
//
// Cette page n'avait jusqu'ici aucune vérification de connexion — un
// visiteur non identifié pouvait l'atteindre directement. Un paiement
// devant toujours être rattaché à un compte, elle exige désormais une
// session valide (js/access-guard.js), sans condition de formule
// puisque c'est justement la page qui sert à en changer.

import { requireAuth } from "./js/access-guard.js";

const FITZ_MESSAGES = [
"Fitz vous accompagnera dès la validation de votre paiement.",
"Fitz commencera immédiatement l'analyse de votre dossier.",
"Fitz préparera votre stratégie de candidature.",
"Fitz reste disponible à chaque étape de votre accompagnement."
];

function getRequestedPlanId() {

const fromUrl = new URLSearchParams(window.location.search).get("plan");

if (fromUrl && SCHOLARBRIDGE_PLANS[fromUrl]) return fromUrl;

try {

const stored = JSON.parse(sessionStorage.getItem("scholarbridgeCheckout") || "null");

if (stored && SCHOLARBRIDGE_PLANS[stored.plan]) return stored.plan;

} catch (e) {}

return null;

}

function formatFCFA(amount) {

return amount.toLocaleString("fr-FR");

}

function renderPlan(plan) {

document.getElementById("planSummaryIcon").setAttribute("data-lucide", plan.icon);
document.getElementById("planSummaryBadge").textContent = plan.badge;
document.getElementById("planSummaryLabel").textContent = plan.label;
document.getElementById("planSummaryAmount").textContent = formatFCFA(plan.priceFCFA);

document.getElementById("summaryOffer").textContent = plan.label;
document.getElementById("summaryPrice").textContent = `${formatFCFA(plan.priceFCFA)} FCFA`;
// Toutes les offres n'ont pas de durée : Premier Dossier, Signature
// Focus et Signature achètent un nombre de candidatures, pas une
// période. La ligne entière est masquée dans ce cas — la page
// affichait "undefined" pour Signature, qui n'a jamais eu ce champ.
// display:none plutôt que l'attribut [hidden] : une règle [hidden]
// d'une feuille externe s'est déjà révélée ignorée sur ce projet.
const durationEl = document.getElementById("summaryDuration");
const durationRow = durationEl.closest(".summary-row");

durationEl.textContent = plan.duration || "";

if (durationRow) durationRow.style.display = plan.duration ? "" : "none";
document.getElementById("summaryIncluded").textContent = plan.tagline;
document.getElementById("summaryFitzAccess").textContent = plan.fitzAccess;

}

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

function initPaymentMethods(plan) {

const radios = document.querySelectorAll('input[name="paymentMethod"]');
const button = document.getElementById("activateButton");
const label = document.getElementById("activateButtonLabel");

radios.forEach((radio) => {

radio.addEventListener("change", () => {

button.disabled = false;
label.textContent = `Activer mon accompagnement — ${formatFCFA(plan.priceFCFA)} FCFA`;

});

});

}

// ==========================================================
// ACTIVATION — point d'entrée du futur backend (non codé ici)
// ==========================================================
//
// Flux prévu, à implémenter côté serveur (Cloud Functions Firebase ou
// équivalent) :
//
// 1. Le backend reçoit { plan, paymentMethod } et relit LUI-MÊME le
//    prix depuis sa propre source de vérité (jamais depuis le client).
// 2. Le backend crée la transaction PayDunya avec ce montant vérifié.
// 3. PayDunya gère le paiement (Wave, Orange Money, carte bancaire).
// 4. PayDunya notifie le backend par webhook signé.
// 5. Le backend vérifie la signature, le montant, le plan et le statut.
// 6. Seulement alors, le backend met à jour Firestore (offre, date,
//    statut, historique) et active le niveau d'accompagnement.
// 7. L'utilisateur est redirigé vers le tableau de bord ScholarBridge.
//    À cette étape, poser sessionStorage.setItem("just_upgraded", plan.label)
//    avant la redirection : dashboard.js l'utilise déjà pour afficher le
//    message d'accueil "votre accompagnement est activé" (voir
//    accompagnementAlert dans dashboard.html/dashboard.js).
//
// Tant que ce backend n'existe pas, cette fonction ne contacte aucun
// serveur et ne déclenche aucun paiement : elle confirme uniquement le
// choix de l'utilisateur, sans jamais activer de compte Premium.
function requestActivation(plan, method) {

return new Promise((resolve) => {

setTimeout(() => resolve({ plan: plan.id, method }), 900);

});

}

function initActivation(plan) {

const button = document.getElementById("activateButton");
const label = document.getElementById("activateButtonLabel");
const result = document.getElementById("activationResult");
const resultText = document.getElementById("activationResultText");

const methodLabels = {
wave: "Wave",
"orange-money": "Orange Money",
card: "carte bancaire"
};

button.addEventListener("click", () => {

const method = document.querySelector('input[name="paymentMethod"]:checked');

if (!method) return;

button.disabled = true;
button.classList.add("is-loading");
label.textContent = "Activation en cours...";

requestActivation(plan, method.value).then(() => {

import("./js/analytics.js").then((m) => m.trackEvent("payment_attempted", { plan: plan.id, method: method.value }));

button.classList.remove("is-loading");
button.disabled = false;
label.textContent = `Activer mon accompagnement — ${formatFCFA(plan.priceFCFA)} FCFA`;

resultText.textContent = `${plan.label} via ${methodLabels[method.value]} — le paiement sécurisé PayDunya sera activé très prochainement. Nous vous recontacterons dès l'ouverture des paiements.`;
result.hidden = false;
result.scrollIntoView({ behavior: "smooth", block: "nearest" });

});

});

}

requireAuth().then(() => {

const planId = getRequestedPlanId();

if (!planId) {

window.location.replace("offers.html");
return;

}

const plan = SCHOLARBRIDGE_PLANS[planId];

renderPlan(plan);
initFitzRotator();
initPaymentMethods(plan);
initActivation(plan);
initReveal();

if (window.lucide) lucide.createIcons();

});
