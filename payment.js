// -------- payment.js --------
// Récapitulatif et activation de l'accompagnement choisi. Le palier est
// toujours relu depuis pricing-plans.js à partir de son identifiant —
// jamais depuis un prix stocké côté client — pour qu'un navigateur ne
// puisse jamais faire afficher un montant différent de celui défini
// dans SCHOLARBRIDGE_PLANS. Aucune clé secrète ni appel PayDunya ici :
// voir requestActivation() plus bas pour l'architecture prévue.
//
// Compte : cette page est désormais le SEUL endroit du site où un
// compte peut être créé (signup.html a été retiré — voir le commit
// dédié). Un visiteur anonyme voit donc un formulaire de compte en
// plus du récapitulatif ; un visiteur déjà connecté (qui change de
// formule) ne le voit pas. resolveSession() ne redirige jamais ici,
// contrairement à requireAuth() utilisé ailleurs sur le site :
// l'absence de session est un état normal sur cette page (visiteur
// pas encore client), pas une erreur d'accès.
//
// Le compte est créé (Auth + Firestore) au moment où l'activation est
// confirmée, PAS avant — voir ensureAccount()/initActivation() plus
// bas : tant que le vrai backend de paiement n'existe pas, aucun
// champ `plan` n'est écrit à la création (seulement `pendingPlan`, à
// titre informatif pour le suivi admin) pour ne jamais donner d'accès
// payant réel sans paiement réellement vérifié.

import { auth, db } from "./firebase-config.js";
import { resolveSession } from "./js/access-guard.js";
import {
createUserWithEmailAndPassword,
updateProfile
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import {
doc,
setDoc,
updateDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import {
showFormError,
clearFormError,
getAuthErrorMessage
} from "./auth-ui.js";
import { trackEvent } from "./js/analytics.js";

const FITZ_MESSAGES = [
"Fitz vous accompagnera dès la validation de votre paiement.",
"Fitz commencera immédiatement l'analyse de votre dossier.",
"Fitz préparera votre stratégie de candidature.",
"Fitz reste disponible à chaque étape de votre accompagnement."
];

// Une offre `deprecated: true` (pricing-plans.js) n'est plus vendue —
// jamais publiquement (retirée de offers.html), jamais via une URL
// devinée ou un lien ancien encore partagé (?plan=premium). Un compte
// qui la détient déjà n'initie pas de nouvel achat via cette page : sa
// formule est déjà active, résolue ailleurs par identifiant
// (dashboard.js, admin/student-detail.js), jamais ici.
function isSellablePlan(planId) {
const plan = SCHOLARBRIDGE_PLANS[planId];
return !!plan && plan.deprecated !== true;
}

function getRequestedPlanId() {

const fromUrl = new URLSearchParams(window.location.search).get("plan");

if (fromUrl && isSellablePlan(fromUrl)) return fromUrl;

try {

const stored = JSON.parse(sessionStorage.getItem("scholarbridgeCheckout") || "null");

if (stored && isSellablePlan(stored.plan)) return stored.plan;

} catch (e) {}

return null;

}

function formatFCFA(amount) {

return amount.toLocaleString("fr-FR");

}

// Parité FIXE entre l'euro et le franc CFA (XOF), garantie par accord
// monétaire : 1 € = 655,957 FCFA. Ce n'est pas un taux de marché, il n'y
// a donc rien à rafraîchir ni aucun appel réseau à faire — la constante
// est exacte tant que la parité tient.
const EUR_PER_XOF = 655.957;

// L'euro est arrondi à l'unité : personne ne règle 44,21 €, et une
// décimale donnerait une fausse impression de précision sur un montant
// qui n'est de toute façon qu'une conversion. Le montant ENGAGEANT
// reste le FCFA (voir formatPriceHTML).
function formatEUR(amountFCFA) {

return Math.round(amountFCFA / EUR_PER_XOF).toLocaleString("fr-FR");

}

// Affichage du prix : l'euro porte le montant, le FCFA le surmonte en
// petit (demande du 2026-08-22, cohérent avec offers.html).
//
// Le FCFA n'est jamais masqué, et c'est délibéré : Wave, Orange Money et
// MTN MoMo sont des rails en francs CFA, c'est donc ce montant-là qui
// sera réellement débité. Afficher uniquement l'euro sur une page de
// paiement laisserait croire à un prélèvement en euros — sur l'écran
// précis où l'utilisateur s'engage, l'ambiguïté ne serait pas
// acceptable.
//
// MTN MoMo est cité ci-dessus comme EXEMPLE de rail en FCFA, pas comme
// moyen de paiement du produit : il n'est proposé nulle part. Les seuls
// moyens offerts sont les trois clés du sélecteur ci-dessous
// (initActivation) — wave, orange-money, card. offers.html doit citer
// cette liste-là et rien d'autre ; test/offers-plans.test.mjs le vérifie.
function formatPriceHTML(amountFCFA) {

return `<span class="price-local">${formatFCFA(amountFCFA)} FCFA</span>`
+ `<span class="price-main">${formatEUR(amountFCFA)}<span class="price-currency">€</span></span>`;

}

// Libellé du bouton d'activation. L'euro annonce, le FCFA précise ce qui
// part du compte — les deux sur la même ligne, jamais l'un sans l'autre.
function activationLabel(plan) {

return `Activer mon accompagnement — ${formatEUR(plan.priceFCFA)} € (${formatFCFA(plan.priceFCFA)} FCFA)`;

}

function renderPlan(plan) {

document.getElementById("planSummaryIcon").setAttribute("data-lucide", plan.icon);
document.getElementById("planSummaryBadge").textContent = plan.badge;
document.getElementById("planSummaryLabel").textContent = plan.label;
document.getElementById("planSummaryAmount").innerHTML = formatPriceHTML(plan.priceFCFA);

document.getElementById("summaryOffer").textContent = plan.label;
document.getElementById("summaryPrice").textContent = `${formatEUR(plan.priceFCFA)} € — ${formatFCFA(plan.priceFCFA)} FCFA débités`;
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

// Mêmes deux causes que sur offers.js (voir le commentaire détaillé
// là-bas, 2026-08-15/2026-08-29) : un seuil proportionnel devient
// inatteignable sur les blocs très hauts, et un élément déjà dépassé
// au moment où l'observer démarre (restauration de la position de
// défilement, arrivée par ancre) ne serait jamais révélé.
}, { threshold: 0, rootMargin: "0px 0px -60px 0px" });

items.forEach((item) => {

if (item.getBoundingClientRect().bottom < 0) {
item.classList.add("is-visible");
return;
}

observer.observe(item);

});

}

function initPaymentMethods(plan) {

const radios = document.querySelectorAll('input[name="paymentMethod"]');
const button = document.getElementById("activateButton");
const label = document.getElementById("activateButtonLabel");

radios.forEach((radio) => {

radio.addEventListener("change", () => {

button.disabled = false;
label.textContent = activationLabel(plan);

});

});

}

// Affiche le formulaire de compte uniquement pour un visiteur anonyme
// — un utilisateur déjà connecté change simplement de formule.
function initAccountSection(session) {

const section = document.getElementById("accountSection");

if (!section) return;

section.hidden = !!session;

}

function buildDefaultUserDoc(uid, name, email, planId) {
return {
uid,
name,
email,
createdAt: serverTimestamp(),
// Intention, pas un accès : voir ensureAccount() ci-dessous.
pendingPlan: planId,
pendingPlanRequestedAt: serverTimestamp(),
profile: {
originCountry: "",
age: "",
currentDegree: "",
academicAverage: "",
englishLevel: "",
desiredField: "",
desiredCountry: ""
}
};
}

// Valide le formulaire de compte (mêmes règles que l'ancien
// signup.js) et affiche l'erreur correspondante dans #accountForm.
// Retourne null si invalide, {name,email,password} sinon.
function readAccountFields() {

const form = document.getElementById("accountForm");
const nameInput = document.getElementById("accountName");
const emailInput = document.getElementById("accountEmail");
const passwordInput = document.getElementById("accountPassword");
const confirmPasswordInput = document.getElementById("accountConfirmPassword");
const termsInput = document.getElementById("accountTerms");

const name = nameInput.value.trim();
const email = emailInput.value.trim().toLowerCase();
const password = passwordInput.value;
const confirmPassword = confirmPasswordInput.value;

if (!name || !email || !password || !confirmPassword) {
showFormError(form, "Merci de remplir tous les champs pour continuer.");
return null;
}

if (name.length < 2) {
showFormError(form, "Merci d'indiquer votre nom complet.");
nameInput.focus();
return null;
}

if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
showFormError(form, "Vérifiez le format de votre adresse e-mail.");
emailInput.focus();
return null;
}

if (password.length < 8) {
showFormError(form, "Votre mot de passe a besoin d'au moins 8 caractères.");
passwordInput.focus();
return null;
}

if (!/[A-Z]/.test(password)) {
showFormError(form, "Votre mot de passe a besoin d'au moins une majuscule.");
passwordInput.focus();
return null;
}

if (!/[0-9]/.test(password)) {
showFormError(form, "Votre mot de passe a besoin d'au moins un chiffre.");
passwordInput.focus();
return null;
}

if (password !== confirmPassword) {
showFormError(form, "Vérifiez que les deux mots de passe soient identiques.");
confirmPasswordInput.focus();
return null;
}

if (termsInput && !termsInput.checked) {
showFormError(form, "Merci d'accepter les conditions d'utilisation pour continuer.");
return null;
}

clearFormError(form);

return { name, email, password };

}

// Crée le compte (visiteur anonyme) ou associe l'intention de formule
// au compte existant (déjà connecté). Ne pose JAMAIS `plan` lui-même,
// à la création comme à la mise à jour : seul un backend de confiance
// ou un administrateur (voir firestore.rules) peut activer une
// formule payante — voir le commentaire ACTIVATION plus bas.
async function ensureAccount(session, plan, fields) {

if (session) {

await updateDoc(doc(db, "users", session.user.uid), {
pendingPlan: plan.id,
pendingPlanRequestedAt: serverTimestamp()
});

return session.user.uid;

}

const credential = await createUserWithEmailAndPassword(auth, fields.email, fields.password);

await updateProfile(credential.user, { displayName: fields.name });

await setDoc(
doc(db, "users", credential.user.uid),
buildDefaultUserDoc(credential.user.uid, fields.name, fields.email, plan.id)
);

return credential.user.uid;

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
// 7. L'utilisateur est redirigé vers le tableau de bord Fitz.
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

// Où atterrit l'étudiant une fois l'activation confirmée. dashboard.html
// reste la cible par défaut (comportement inchangé pour Essentiel/Avancé/
// Premium/Signature Focus/Signature) — Pass Express et Premier Dossier
// ont un premier geste évident et unique, on l'ouvre directement plutôt
// que de faire remonter le pas depuis le tableau de bord (audit du
// 2026-08-10, chantier "accès par formule"). "?action=new" est lu par
// applications.js pour ouvrir directement le formulaire de candidature.
const POST_ACTIVATION_TARGETS = {
fitzExpress: "ai-chat.html",
"premier-dossier": "applications.html?action=new"
};

function resolvePostActivationTarget(planId) {
return POST_ACTIVATION_TARGETS[planId] || "dashboard.html";
}

function initActivation(plan, session) {

const button = document.getElementById("activateButton");
const label = document.getElementById("activateButtonLabel");
const result = document.getElementById("activationResult");
const resultText = document.getElementById("activationResultText");

const methodLabels = {
wave: "Wave",
"orange-money": "Orange Money",
card: "carte bancaire"
};

button.addEventListener("click", async () => {

const method = document.querySelector('input[name="paymentMethod"]:checked');

if (!method) return;

const isNewAccount = !session;
let fields = null;

if (isNewAccount) {

fields = readAccountFields();

if (!fields) return;

}

button.disabled = true;
button.classList.add("is-loading");
label.textContent = "Activation en cours...";

let uid;

try {

uid = await ensureAccount(session, plan, fields);

} catch (error) {

console.error(error);
showFormError(document.getElementById("accountForm"), getAuthErrorMessage(error));
button.classList.remove("is-loading");
button.disabled = false;
label.textContent = activationLabel(plan);
return;

}

await requestActivation(plan, method.value);

trackEvent(isNewAccount ? "signup" : "payment_attempted", { plan: plan.id, method: method.value, uid });

button.classList.remove("is-loading");
button.disabled = false;
label.textContent = activationLabel(plan);

resultText.textContent = `${plan.label} via ${methodLabels[method.value]} — le paiement sécurisé PayDunya sera activé très prochainement. Nous vous recontacterons dès l'ouverture des paiements. Redirection vers votre tableau de bord...`;
result.hidden = false;
result.scrollIntoView({ behavior: "smooth", block: "nearest" });

// Mêmes drapeaux que l'ancien signup.js / que le flux d'upgrade déjà
// prévu dans dashboard.js — voir le commentaire ACTIVATION plus haut.
if (isNewAccount) sessionStorage.setItem("just_created", "true");
sessionStorage.setItem("just_upgraded", plan.label);

setTimeout(() => {
window.location.href = resolvePostActivationTarget(plan.id);
}, 2200);

});

}

function bootstrap(session) {

const planId = getRequestedPlanId();

if (!planId) {

window.location.replace("offers.html");
return;

}

const plan = SCHOLARBRIDGE_PLANS[planId];

initAccountSection(session);
renderPlan(plan);
initFitzRotator();
initPaymentMethods(plan);
initActivation(plan, session);
initReveal();

if (window.lucide) lucide.createIcons();

}

resolveSession().then(bootstrap).catch((error) => {

// Une session qu'on n'arrive pas à vérifier doit se comporter comme
// une absence de session (formulaire de compte affiché) plutôt que
// de bloquer la page : voir la note en tête de fichier sur
// resolveSession() vs requireAuth().
console.error("Vérification de session ignorée sur la page de paiement :", error);
bootstrap(null);

});
