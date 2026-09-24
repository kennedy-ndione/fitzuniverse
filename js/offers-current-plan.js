/* ==========================================================
FITZUNIVERSE — offers.html connaît la formule de l'étudiant
(2026-09-02, système de changement d'abonnement)

Un étudiant connecté qui vient comparer les formules doit voir
IMMÉDIATEMENT où il en est : sa formule actuelle est marquée (badge +
bouton neutralisé — on ne peut pas « choisir » ce qu'on a déjà), et
une demande de changement en cours (pendingPlan, écrite par
payment.js, affichée/annulable dans account.html) est signalée sur la
carte visée. Les autres cartes restent des chemins d'achat normaux.

Visiteur non connecté : ce module ne fait RIEN — la page se comporte
exactement comme avant. Échec de lecture : silencieux, jamais
d'erreur visible sur une page de vente.

Module séparé d'offers.js (script classique) pour la même raison
qu'offers-context.js : ne pas convertir toute la page en module.
========================================================== */

// Chemin relatif à CE fichier (js/) — firebase-config.js vit à la racine.
import { db, auth } from "../firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { PLAN_ORDER, resolvePlan, hasFitzExpressAccess, resolvePlanPreinscription, fetchFeatureFlags, isFeatureLocked } from "./access-guard.js";

function marquerCarte(planId, mode) {

const cta = document.querySelector(`.plan-cta[data-plan="${planId}"]`);
if (!cta) return;

const card = cta.closest(".plan-card, .express-card, article, div");

const libelles = {
current: { badge: "Votre formule actuelle", cta: "Votre formule actuelle" },
pending: { badge: "Demande en cours d'activation", cta: "Demande envoyée" },
express: { badge: "Pass actif", cta: "Pass Découverte actif" },
// Lot ACCEPTATION, partie 3 : le Pass n'est pas vendu à qui a déjà le
// chat (creerPaiement le refuse) — la carte le dit avant le clic.
inclus: { badge: "Inclus dans votre formule", cta: "Inclus dans votre formule" }
};

const l = libelles[mode];

if (card && !card.querySelector(".plan-current-badge")) {
const badge = document.createElement("span");
badge.className = `plan-current-badge${mode === "pending" ? " is-pending" : ""}`;
badge.textContent = l.badge;
card.prepend(badge);
card.classList.add(mode === "pending" ? "plan-card--pending" : "plan-card--current");
}

// Le CTA devient un état, plus une action — <button> comme <a>.
const label = cta.querySelector("span");
if (label) label.textContent = l.cta;
cta.querySelector("i, svg")?.remove();

if (cta.tagName === "BUTTON") {
cta.disabled = true;
} else {
cta.removeAttribute("href");
cta.setAttribute("aria-disabled", "true");
}

cta.classList.add("plan-cta--inactive");

}

onAuthStateChanged(auth, async (user) => {

if (!user) return;

try {

const snap = await getDoc(doc(db, "users", user.uid));
if (!snap.exists()) return;

const userData = snap.data();
let planId = resolvePlan(userData);

// Même résolution que bootstrapShell (js/access-guard.js) : un compte
// administrateur actif a la formule la plus haute de PLAN_ORDER sans
// champ `plan` — sa carte doit être marquée comme partout ailleurs dans
// l'espace. Échec de lecture = pas admin, comportement normal.
try {
const adminSnap = await getDoc(doc(db, "admins", user.uid));
if (adminSnap.exists() && adminSnap.data().isActive === true) planId = PLAN_ORDER[PLAN_ORDER.length - 1];
} catch { /* pas admin */ }

if (planId !== "gratuit") marquerCarte(planId, "current");

// Le Pass : « actif » s'il l'a ; sinon « inclus dans votre formule » dès
// qu'une formule active ouvre le chat (même décision que le serveur :
// decideVerrou sur ai_chat, avec les bascules de config/planFeatures).
if (hasFitzExpressAccess(userData)) {
marquerCarte("fitzExpress", "express");
} else {
const flags = await fetchFeatureFlags();
const chatDejaOuvert = !isFeatureLocked(planId, flags, "ai_chat", userData.testerAccess === true, false, resolvePlanPreinscription(userData));
if (chatDejaOuvert) marquerCarte("fitzExpress", "inclus");
}

const pending = userData.pendingPlan;
if (pending && pending !== planId) marquerCarte(pending, "pending");

} catch (error) {

console.error("Marquage de la formule actuelle impossible :", error);

}

});
