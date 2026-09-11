import { auth, db } from "../firebase-config.js";

import {
onAuthStateChanged,
signOut
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
doc,
getDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import {
getUser,
updateUserPlan,
updateUserTesterAccess,
setUserDisabled,
getUserEvents,
getAdminNotes,
addAdminNote,
getSentMessages,
sendMessageToUser,
updateUserPlanExpiry,
updateUserFitzExpressExpiry,
getUserApplications,
updateApplicationChecklistItem,
getAdvisorRequests,
markAdvisorRequestProcessed,
// Lot ADMIN : l attribution manuelle (une seule écriture, tracée) et la
// promotion d un compte existant.
attribuerFormuleManuellement,
promouvoirAdmin
} from "./firebase-admin.js";

import { calculateAiScore, bilanProfil } from "../js/profile-score.js";
import { phraseTestLangue, libellePalier, lirePalier, languesLisibles } from "../js/profil-par-niveau.js";
import { initSidebarToggle } from "./sidebar-toggle.js";
import { PLAN_LABELS, PLAN_PREINSCRIPTION_LABELS, PLAN_ORDER, PLAN_PREINSCRIPTION_ORDER } from "../js/plan-features.js";
// Lot FINITIONS-VISUELLES (2026-09-11) : les étiquettes de l'admin, un
// seul nommage (« Essentiel · 4 candidatures » ≠ « Essentiel (ancienne)
// · 5 candidatures »), et les groupes « En vente » / « Retirées ».
import { optionsFormules } from "../js/formules-admin.js";
// Lot ADMIN : le rôle décide de ce qui est RENDU, le bandeau dit ce qui
// s est passé, et firebase-admin porte les écritures tracées.
import { chargerAdmin, appliquerRole } from "./admin-role.js";
import { succes, echec, notifier } from "./notifier.js";
// Lot E1 : la preuve de dépôt, en lecture seule (jamais la capture
// elle-même — storage.rules la réserve au propriétaire).
import { lirePreuve, resumePreuve, LIBELLES_MODES } from "../js/preuve-depot.js";
import { lireParcours, LIBELLES as LIBELLES_PARCOURS } from "../js/parcours.js";
// Lot ACCEPTATION, partie 6 : le décompte par statut des cartes bourses
// et « toutes répondues » (STATUTS_REPONSE, jamais une liste recopiée)
// viennent du module pur js/fitz-choisit.js — testés sous Node.
import { decompteBourses } from "../js/fitz-choisit.js";
// resolvePlanPreinscription manquait à cet import (corrigé 2026-09-08).
// Elle est appelée dans renderHeader() : la fiche étudiant levait une
// ReferenceError avant d'avoir rien affiché, donc l'admin ne pouvait
// ouvrir AUCUNE fiche. Une page entière hors service pour un nom absent
// d'une liste d'import — c'est ce que le test de forme ajouté dans
// test/admin-imports.test.mjs cherche désormais sur tout admin/*.js.
import { resolvePlan, resolvePlanPreinscription } from "../js/access-guard.js";
import { hidePageLoader } from "../js/app-shell.js";

// Interaction directe admin → étudiant, comptée pour les courbes du
// Control Center (2026-09-02). trackEvent avale ses erreurs.
import { trackEvent } from "../js/analytics.js";

initSidebarToggle();

const SECTION_LABELS = [
"Informations personnelles",
"Parcours scolaire",
"Niveau académique",
"Langues",
"Projet d'études",
"Préférences de destination",
"Préférences financières",
"Documents disponibles",
"Expériences",
"Objectifs"
];

// Groupes de champs affichés en lecture seule dans l'onglet "Profil",
// mêmes sections que profile.html — libellé humain + clé du champ.
const PROFILE_DISPLAY_GROUPS = [
{
title: "Informations personnelles",
fields: [
["Prénom", "firstName"], ["Nom", "lastName"], ["Sexe", "gender"],
["Date de naissance", "birthDate"], ["Nationalité", "nationality"],
["Pays", "country"], ["Ville", "city"], ["Téléphone", "phone"], ["WhatsApp", "whatsapp"]
]
},
{
title: "Parcours scolaire",
fields: [
// Lot PROFIL-PAR-NIVEAU : le palier (8 valeurs du questionnaire public).
["Palier", (p) => libellePalier(lirePalier(p))],
["Dernier diplôme", "lastDegree"], ["Établissement actuel", "currentInstitution"],
["Année d'obtention", "graduationYear"], ["Moyenne générale", "academicAverage"],
["Statut", "studentStatus"], ["Série du Bac", "bacSeries"], ["Mention", "bacMention"],
["Moyenne du Bac", "bacAverage"], ["Niveau actuel", "currentLevel"]
]
},
{
title: "Niveau académique",
fields: [
["Classement", "ranking"], ["Matières fortes", "strongSubjects"], ["Matières faibles", "weakSubjects"],
["Projets", "projects"], ["Mémoire", "thesis"], ["Publications", "publications"], ["Recherche", "researchExperience"]
]
},
{
title: "Langues",
fields: [
["Langues", (p) => languesLisibles(p.languages).join(", ")],
// Partie 3 du lot : le test de langue, tel qu'enregistré (jamais jugé).
["Test de langue", (p) => phraseTestLangue(p)]
]
},
{
title: "Projet d'études",
fields: [
["Domaine souhaité", "desiredField"], ["Spécialisation", "specialization"], ["Diplôme recherché", "desiredDegree"]
]
},
{
title: "Préférences financières",
fields: [
["Budget", "budget"], ["Sponsor", "hasSponsor"]
]
},
{
title: "Objectifs",
fields: [
["Pourquoi partir", "whyLeave"], ["Objectifs professionnels", "careerGoals"], ["Rêves", "dreams"]
]
}
];

function val(value) {
if (Array.isArray(value)) return value.length ? value.join(", ") : "—";
return value ? String(value) : "—";
}

function formatDateTime(timestamp) {

if (!timestamp || typeof timestamp.toDate !== "function") return "-";

return timestamp.toDate().toLocaleString("fr-FR");

}

const EVENT_LABELS = {
signup: "Inscription",
login: "Connexion",
scholarship_viewed: "Consultation d'une bourse",
university_viewed: "Consultation d'une université",
letter_generated: "Lettre de motivation générée",
email_generated: "E-mail généré",
verification_run: "Vérification de dossier",
translation_run: "Traduction effectuée",
payment_attempted: "Tentative de paiement"
};

// TROIS FAMILLES D'ERREUR, et confondre deux d'entre elles envoie
// chercher la panne du mauvais côté — c'est ce qui a coûté deux
// diagnostics :
//
//   "reseau"   la requête n'est jamais arrivée, ou est revenue vide.
//              Réessayer a un sens, et c'est la seule famille où on le
//              propose.
//   "serveur"  elle est arrivée, et le serveur a REFUSÉ. Un droit
//              manquant, un document absent : réessayer ne changera
//              rien, et parler de connexion Internet serait un mensonge.
//   "code"     aucune requête en cause. TypeError, ReferenceError, une
//              propriété lue sur null — un bug, qu'il faut nommer.
const CODES_RESEAU = /^(unavailable|deadline-exceeded|aborted|resource-exhausted|cancelled|network-request-failed)$/;

function categoriserErreur(error) {
const code = error && typeof error.code === "string" ? error.code.replace(/^[a-z]+\//, "") : "";
if (!code) return "code";
if (CODES_RESEAU.test(code)) return "reseau";
return "serveur";
}

function echapperTexte(texte) {
return String(texte == null ? "" : texte).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

const params = new URLSearchParams(window.location.search);
const uid = params.get("uid");

let currentUserData = null;
let currentAdmin = null;

// ==========================================================
// Onglets
// ==========================================================

function initTabs() {

document.querySelectorAll(".tab-btn").forEach((btn) => {

btn.addEventListener("click", () => {

document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("is-active"));
document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("is-active"));

btn.classList.add("is-active");
document.getElementById(`tab-${btn.dataset.tab}`).classList.add("is-active");

});

});

}

// ==========================================================
// En-tête + profil + progression + abonnement
// ==========================================================

function renderHeader(userData) {

document.getElementById("detailName").textContent = userData.name || "Étudiant sans nom";
document.getElementById("detailEmail").textContent = userData.email || "-";

const initials = (userData.name || "?").trim().slice(0, 2).toUpperCase();
document.getElementById("detailAvatar").textContent = initials;

// resolvePlan() (js/access-guard.js) est la même fonction que celle
// utilisée côté étudiant : la formule affichée ici est donc toujours
// celle réellement active, expiration et défaut "gratuit" inclus —
// jamais un calcul divergent recalculé localement.
const planKey = resolvePlan(userData);
const planLabel = PLAN_LABELS[planKey];
const disabled = userData.disabled === true;
// Grille B : le second forfait (préinscription), en lecture seule ici —
// aucune écriture admin sur ces champs, le webhook seul les pose.
const planPreKey = resolvePlanPreinscription(userData);

document.getElementById("detailPills").innerHTML = `
<span class="status-pill plan-${planKey}">${planLabel}</span>
${planPreKey ? `<span class="status-pill plan-signature-focus">${PLAN_PREINSCRIPTION_LABELS[planPreKey]}</span>` : ""}
<span class="status-pill ${disabled ? "is-disabled" : "is-active"}">${disabled ? "Suspendu" : "Actif"}</span>
${userData.testerAccess === true ? `<span class="status-pill plan-premium">Accès test complet</span>` : ""}
`;

}

function renderProfile(profile) {

const container = document.getElementById("profileSections");
container.innerHTML = "";

PROFILE_DISPLAY_GROUPS.forEach((group) => {

const section = document.createElement("div");
section.className = "detail-section";

section.innerHTML = `<h3></h3><div class="detail-field-grid"></div>`;
section.querySelector("h3").textContent = group.title;

const grid = section.querySelector(".detail-field-grid");

group.fields.forEach(([label, key]) => {

const field = document.createElement("div");
field.className = "detail-field";
field.innerHTML = `<span class="detail-field-label"></span><span class="detail-field-value"></span>`;
field.querySelector(".detail-field-label").textContent = label;
// Une clé peut être une FONCTION du profil (palier, test de langue,
// langues) : la valeur brute en base n'est pas lisible telle quelle.
field.querySelector(".detail-field-value").textContent = typeof key === "function" ? (key(profile) || "—") : val(profile[key]);

grid.appendChild(field);

});

container.appendChild(section);

});

}

// Lot PROFIL-PAR-NIVEAU (2026-09-11) : le score se calcule sur les
// sections APPLICABLES au palier de l'étudiant (js/profil-par-niveau.js).
// La fiche affiche donc le dénominateur RÉEL — « 8 sections sur 8
// applicables », jamais « 8/10 » — sinon l'admin croirait le dossier
// incomplet. Une section masquée ou facultative pour ce palier est dite
// telle quelle dans la liste. Un profil sans palier se lit comme avant :
// dix sections.
function renderProgression(profile) {

const bilan = bilanProfil(profile);
const score = calculateAiScore(profile);
document.getElementById("progressionScore").textContent =
`${bilan.remplies} section${bilan.remplies > 1 ? "s" : ""} sur ${bilan.applicables} applicable${bilan.applicables > 1 ? "s" : ""} (${score}/10)`;

const palierEl = document.getElementById("progressionPalier");
if (palierEl) {
palierEl.textContent = bilan.palier
? `Palier : ${bilan.libellePalier}.`
: "Palier non renseigné (profil d'avant le lot PROFIL-PAR-NIVEAU) : les dix sections comptent.";
}

const list = document.getElementById("progressionList");
list.innerHTML = "";

bilan.sections.forEach((section) => {

const complete = section.remplie;
const applicable = section.applicabilite === "requise";

const row = document.createElement("div");
row.className = "timeline-item";
row.innerHTML = `
<span class="timeline-dot" style="background:${!applicable ? "transparent" : complete ? "var(--success)" : "var(--border-color)"};${!applicable ? "border:1.5px dashed var(--border-color);" : ""}"></span>
<div class="timeline-body">
<div class="timeline-label"></div>
</div>
`;

let etat;
if (section.applicabilite === "masquee") etat = "ne s'applique pas à ce palier";
else if (section.applicabilite === "facultative") etat = complete ? "renseignée (facultative, non comptée)" : "facultative, non comptée";
else etat = complete ? "complète" : "à compléter";

row.querySelector(".timeline-label").textContent = `${SECTION_LABELS[section.index]} — ${etat}`;

list.appendChild(row);

});

}

// ==========================================================
// LES DEUX SÉLECTEURS, CONSTRUITS DEPUIS LES CONSTANTES (lot ADMIN)
// ==========================================================
// Les options étaient écrites à la main dans le HTML. La liste s'était
// déjà désynchronisée deux fois de la grille réelle — un identifiant de
// formule recopié dans du balisage est un identifiant que personne ne
// met à jour. Elles viennent maintenant de PLAN_ORDER et de
// PLAN_PREINSCRIPTION_ORDER, avec leurs libellés d'interface.
//
// Les dépréciées restent proposées, dans leur propre groupe : des
// comptes bien réels les portent, et il faut pouvoir les leur rendre.
function construireSelecteurs() {

const selPlan = document.getElementById("planSelect");

// Lot FINITIONS-VISUELLES (2026-09-11) : les options et leurs groupes
// viennent de js/formules-admin.js — la liste habillée (js/fitz-select.js)
// affiche désormais les titres de groupe, et chaque étiquette dit ce qui
// distingue la formule : plus deux « Conseiller » indiscernables.
if (selPlan && !selPlan.options.length) {
selPlan.innerHTML = optionsFormules({ vide: "Sans formule", pass: false, preinscription: false });
}

const selPre = document.getElementById("planPreinscriptionSelect");

if (selPre && !selPre.options.length) {
selPre.innerHTML = optionsFormules({ vide: "Sans offre", pass: false, bourse: false });
}

}

function renderAttributionManuelle(userData) {

const el = document.getElementById("attributionManuelle");
if (!el) return;

const trace = userData.attributionManuelle;

if (!trace || typeof trace !== "object") {
el.hidden = true;
el.textContent = "";
return;
}

const quoi = [
trace.plan ? (PLAN_LABELS[trace.plan] || trace.plan) : null,
trace.planPreinscription ? (PLAN_PREINSCRIPTION_LABELS[trace.planPreinscription] || trace.planPreinscription) : null
].filter(Boolean).join(" et ") || "aucune formule";

el.innerHTML = `<i data-lucide="hand-coins" aria-hidden="true"></i><span><strong>Formule posée à la main le ${formatISODate(trace.le)} — aucun paiement associé.</strong> ${quoi}. Un vrai achat effacera cette mention.</span>`;
el.hidden = false;

if (window.lucide) lucide.createIcons();

}

function renderSubscriptionTab(userData) {

construireSelecteurs();

// ⚠️ GARDE OBLIGATOIRE (correctif du 2026-09-09). Cette ligne était
// écrite sans elle, et elle a tué la fiche ENTIÈRE pour tout
// administrateur ordinaire : appliquerRole() retire du DOM les éléments
// [data-super-admin], dont ce sélecteur. Un « .value » sur null, et la
// page affichait « Impossible de charger cette fiche » — sur tous les
// comptes. TOUT élément réservé se lit avec une garde, sans exception.
const planSelect = document.getElementById("planSelect");
if (planSelect) planSelect.value = userData.plan || "";

// Demande de changement déposée par l'étudiant (2026-09-02) : le
// point d'entrée du système « changer de formule » de l'espace
// étudiant. pendingPlan est une INTENTION (jamais un accès) — c'est
// ici que l'équipe la voit, vérifie le paiement, puis active la
// formule via le sélecteur ci-dessous.
const pendingStatus = document.getElementById("pendingPlanStatus");

if (pendingStatus) {

const pending = userData.pendingPlan;

if (pending && pending !== userData.plan) {

const requestedAt = userData.pendingPlanRequestedAt && typeof userData.pendingPlanRequestedAt.toDate === "function"
? ` — demandée le ${userData.pendingPlanRequestedAt.toDate().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}`
: "";

const pendingName = PLAN_LABELS[pending] || (window.SCHOLARBRIDGE_PLANS && window.SCHOLARBRIDGE_PLANS[pending] && window.SCHOLARBRIDGE_PLANS[pending].label) || pending;
pendingStatus.innerHTML = `⏳ <strong>Demande de l'étudiant : ${pendingName}</strong>${requestedAt}. Vérifiez le paiement puis enregistrez cette formule ci-dessous pour l'activer.`;

} else {
pendingStatus.textContent = "Aucune demande de changement en attente.";
}

}

const disabled = userData.disabled === true;

const statusLabel = document.getElementById("statusLabel");
if (statusLabel) statusLabel.textContent = disabled
? "Ce compte est actuellement suspendu."
: "Ce compte est actif.";

const toggleBtn = document.getElementById("toggleDisabledBtn");
if (toggleBtn) {
toggleBtn.textContent = disabled ? "Réactiver le compte" : "Suspendre le compte";
toggleBtn.classList.toggle("is-danger", !disabled);
}

const testerToggle = document.getElementById("testerAccessToggle");
if (testerToggle) testerToggle.checked = userData.testerAccess === true;

// Expiration de formule / Pass Fitz Express (pricing pivot 2026-07-30)
// — planExpiresAt/fitzExpressExpiresAt sont des chaînes ISO simples
// (voir js/access-guard.js), pas des Timestamp Firestore.
const planExpiryInput = document.getElementById("planExpiryInput");
const planExpiryStatus = document.getElementById("planExpiryStatus");

// Le champ est réservé au propriétaire ; le STATUT, lui, reste lu par
// tout le monde — un administrateur ordinaire doit voir où en est la
// formule, il ne doit simplement pas pouvoir la changer.
if (planExpiryInput) planExpiryInput.value = userData.planExpiresAt || "";

if (!planExpiryStatus) { /* rien à écrire */ } else if (!userData.plan) {
planExpiryStatus.textContent = "Aucune formule active — l'expiration ne s'applique pas.";
} else if (!userData.planExpiresAt) {
// Lot ACCEPTATION, partie 6 : une formule bourses SANS échéance (les
// trois en vente n'ont plus de durée) reste active jusqu'à la décision
// de Charles — c'est ici qu'il y met fin.
const formule = window.SCHOLARBRIDGE_PLANS && window.SCHOLARBRIDGE_PLANS[userData.plan];
planExpiryStatus.textContent = formule && formule.parcours === "bourse" && !formule.duration
? "Sans échéance : la formule reste active jusqu'à votre décision. Pour y mettre fin, fixez une date ci-dessous."
: "Aucune date d'expiration enregistrée.";
} else {
const expired = new Date(userData.planExpiresAt).getTime() < Date.now();
planExpiryStatus.textContent = expired
? `Formule expirée le ${formatISODate(userData.planExpiresAt)} — l'étudiant retombe sur l'accès par défaut.`
: `Formule active jusqu'au ${formatISODate(userData.planExpiresAt)}.`;
}

const fitzExpressInput = document.getElementById("fitzExpressInput");
const fitzExpressStatus = document.getElementById("fitzExpressStatus");

if (fitzExpressInput) fitzExpressInput.value = userData.fitzExpressExpiresAt || "";

// Grille B : le forfait préinscription et son échéance. MODIFIABLE
// depuis le lot ADMIN (2026-09-09) — la mention « écrit par le
// paiement, non modifiable ici » qui terminait cette phrase n'est plus
// vraie, et la laisser aurait été pire qu'un champ manquant.
const planPreSelect = document.getElementById("planPreinscriptionSelect");
if (planPreSelect) planPreSelect.value = userData.planPreinscription || "";

const planPreExpiryInput = document.getElementById("planPreinscriptionExpiryInput");
if (planPreExpiryInput) planPreExpiryInput.value = userData.planPreinscriptionExpiresAt || "";

const planPreExpiryStatus = document.getElementById("planPreinscriptionExpiryStatus");
if (planPreExpiryStatus) {
if (!userData.planPreinscription) {
planPreExpiryStatus.textContent = "Aucune offre préinscription — l'expiration ne s'applique pas.";
} else if (!userData.planPreinscriptionExpiresAt) {
planPreExpiryStatus.textContent = "Aucune date d'expiration enregistrée.";
} else {
const finie = new Date(userData.planPreinscriptionExpiresAt).getTime() < Date.now();
planPreExpiryStatus.textContent = finie
? `Offre expirée le ${formatISODate(userData.planPreinscriptionExpiresAt)} — l'étudiant perd l'espace préinscription.`
: `Offre active jusqu'au ${formatISODate(userData.planPreinscriptionExpiresAt)}.`;
}
}

const planPreStatus = document.getElementById("planPreinscriptionStatus");
if (planPreStatus) {
if (!userData.planPreinscription) {
planPreStatus.textContent = "Aucune offre préinscription.";
} else {
const expPre = userData.planPreinscriptionExpiresAt ? new Date(userData.planPreinscriptionExpiresAt).getTime() : NaN;
const nomPre = PLAN_PREINSCRIPTION_LABELS[userData.planPreinscription] || userData.planPreinscription;
planPreStatus.textContent = !userData.planPreinscriptionExpiresAt
? `${nomPre} — aucune échéance enregistrée.`
: (expPre < Date.now()
? `${nomPre} — expirée le ${formatISODate(userData.planPreinscriptionExpiresAt)}.`
: `${nomPre} — active jusqu'au ${formatISODate(userData.planPreinscriptionExpiresAt)}.`);
}
}

// La trace d'une attribution posée à la main. Elle se lit EN TÊTE de
// fiche, avant tout le reste, parce qu'elle change la lecture de tout
// le reste : ce compte n'a pas payé.
renderAttributionManuelle(userData);

if (!fitzExpressStatus) { /* rien à écrire */ } else if (!userData.fitzExpressExpiresAt) {
fitzExpressStatus.textContent = "Aucun Pass Découverte actif.";
} else {
const expired = new Date(userData.fitzExpressExpiresAt).getTime() < Date.now();
fitzExpressStatus.textContent = expired
? `Pass expiré le ${formatISODate(userData.fitzExpressExpiresAt)}.`
: `Pass actif jusqu'au ${formatISODate(userData.fitzExpressExpiresAt)} (questions à Fitz uniquement).`;
}

}

function formatISODate(iso) {

const date = new Date(iso);

return isNaN(date) ? iso : date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

}

// ==========================================================
// Activité
// ==========================================================

async function renderActivity() {

const events = await getUserEvents(uid, 50);
const container = document.getElementById("activityTimeline");

if (!events.length) {
container.innerHTML = `<p class="detail-field-value" style="font-weight:400;color:var(--text-muted);">Aucune activité enregistrée pour le moment.</p>`;
return;
}

container.innerHTML = events.map((event) => `
<div class="timeline-item">
<span class="timeline-dot"></span>
<div class="timeline-body">
<div class="timeline-label">${EVENT_LABELS[event.type] || event.type}</div>
<div class="timeline-meta">${formatDateTime(event.createdAt)}</div>
</div>
</div>
`).join("");

}

// ==========================================================
// Notes internes
// ==========================================================

async function renderNotes() {

const notes = await getAdminNotes(uid);
const container = document.getElementById("notesList");

if (!notes.length) {
container.innerHTML = `<p class="detail-field-value" style="font-weight:400;color:var(--text-muted);">Aucune note pour le moment.</p>`;
return;
}

container.innerHTML = notes.map((note) => `
<div class="note-item">
<p></p>
<div class="note-item-meta"><span></span></div>
</div>
`).join("");

const items = container.querySelectorAll(".note-item");

notes.forEach((note, index) => {
items[index].querySelector("p").textContent = note.text;
items[index].querySelector(".note-item-meta span").textContent =
`${note.authorEmail || "Admin"} — ${formatDateTime(note.createdAt)}`;
});

}

// ==========================================================
// Messages
// ==========================================================

async function renderMessages() {

const messages = await getSentMessages(uid);
const container = document.getElementById("messagesList");

// Depuis la messagerie bidirectionnelle (2026-09-02), le fil contient
// aussi les RÉPONSES de l'étudiant (fromStudent:true). Le centre de
// messages (admin/messages.html) est l'endroit principal pour
// converser ; cet onglet reste un aperçu fidèle du même fil.
const centerLink = `<p class="detail-field-value" style="font-weight:400;color:var(--text-muted);margin-bottom:12px;">Fil complet et réponse rapide dans le <a href="messages.html?uid=${uid}" style="color:var(--amber-700);font-weight:700;">centre de messages</a>. Chaque envoi est signé FitzUniverse.</p>`;

if (!messages.length) {
container.innerHTML = `${centerLink}<p class="detail-field-value" style="font-weight:400;color:var(--text-muted);">Aucun message échangé pour le moment.</p>`;
return;
}

container.innerHTML = centerLink + messages.map((message) => `
<div class="message-item ${message.read ? "" : "is-unread"}">
<p></p>
<div class="message-item-meta"><span></span></div>
</div>
`).join("");

const items = container.querySelectorAll(".message-item");

messages.forEach((message, index) => {

const fromStudent = message.fromStudent === true;

items[index].querySelector("p").textContent = message.text;
items[index].querySelector(".message-item-meta span").textContent =
`${fromStudent ? "Réponse de l'étudiant" : "FitzUniverse"} — ${formatDateTime(message.createdAt)} — ${message.read ? "lu" : "non lu"}`;

});

}

// ==========================================================
// Demandes de revue conseiller — contrepartie de renderMessages()
// ci-dessus (même pattern visuel), avec une action de traitement.
// ==========================================================

async function handleMarkAdvisorRequestProcessed(requestId, button) {

button.disabled = true;

try {

await markAdvisorRequestProcessed(uid, requestId);
await renderAdvisorRequests();

} catch (error) {

console.error("Impossible de marquer la demande comme traitée :", error);
echec("L action n a pas abouti", error);
button.disabled = false;

}

}

async function renderAdvisorRequests() {

const requests = await getAdvisorRequests(uid);
const container = document.getElementById("advisorRequestsList");

if (!requests.length) {
container.innerHTML = `<p class="detail-field-value" style="font-weight:400;color:var(--text-muted);">Aucune demande de revue conseiller pour le moment.</p>`;
return;
}

container.innerHTML = requests.map((request) => `
<div class="message-item ${request.status === "nouveau" ? "is-unread" : ""}">
<p></p>
<div class="message-item-meta"><span></span>${request.status === "nouveau" ? `<button type="button" class="btn-detail-action" data-action="mark-processed" data-request-id="${request.id}" style="padding:4px 10px;font-size:var(--fs-caption,.8rem);margin-left:8px;">Marquer traité</button>` : ""}</div>
</div>
`).join("");

const items = container.querySelectorAll(".message-item");

requests.forEach((request, index) => {
items[index].querySelector("p").textContent =
`${request.university ? `[${request.university}] ` : ""}${request.text}`;
items[index].querySelector(".message-item-meta span").textContent =
`${formatDateTime(request.createdAt)} — ${request.status === "nouveau" ? "nouveau" : "traité"}`;
});

container.querySelectorAll('[data-action="mark-processed"]').forEach((btn) => {
btn.addEventListener("click", () => handleMarkAdvisorRequestProcessed(btn.dataset.requestId, btn));
});

}

// ==========================================================
// Candidatures suivies (Phase 5 — visibilité admin, 2026-07-30)
// ==========================================================

const APP_STATUS_LABELS = {
a_preparer: "À préparer",
en_cours: "En préparation",
deposee: "Déposée",
en_attente: "En attente de réponse",
reponse_recue: "Réponse reçue",
admise: "Admise",
refusee: "Refusée",
liste_attente: "Liste d'attente"
};

// Lot E1 : ce que l'étudiant a DÉCLARÉ (mode, numéro, date) — pas la
// capture. Une candidature déposée sans preuve est dite telle quelle.
function renderPreuveReadOnly(app) {
const preuve = lirePreuve(app);
if (!preuve) return ["deposee", "en_attente", "reponse_recue", "admise", "refusee", "liste_attente"].includes(app.status)
? `<div class="timeline-meta" style="color:var(--text-muted);">Déposée sans déclaration de dépôt (antérieure au lot E1).</div>`
: "";
const resume = resumePreuve(preuve) || `Déclaration incomplète (${LIBELLES_MODES[preuve.mode] || preuve.mode || "mode inconnu"})`;
return `<div class="timeline-meta" style="color:var(--success);">Preuve de dépôt : ${resume}${preuve.fichier ? " (capture réservée à l'étudiant)" : ""}</div>`;
}

// Même structure que le "checklist" par candidature côté étudiant
// (voir applications.js) — libellés dupliqués ici volontairement
// plutôt qu'importés : applications.js est un script de page sans
// exports, pas un module partageable.
const CHECKLIST_TYPE_LABELS = {
recommendation: "Lettre de recommandation",
language_test: "Test de langue",
financial_proof: "Preuve financière"
};

const CHECKLIST_STATUS_LABELS = {
recommendation: { manquant: "Non demandée", en_cours: "Demandée", complete: "Reçue" },
language_test: { manquant: "Non planifié", en_cours: "Planifié", complete: "Passé" },
financial_proof: { manquant: "Manquant", en_cours: "En préparation", complete: "Prêt" }
};

function renderChecklistItemsReadOnly(app) {

const checklist = Array.isArray(app.checklist) ? app.checklist : [];
if (!checklist.length) return "";

return `
<ul class="detail-checklist" style="list-style:none;margin-top:8px;padding-left:0;display:flex;flex-direction:column;gap:6px;">
${checklist.map((item) => {

const statusLabel = (CHECKLIST_STATUS_LABELS[item.type] || {})[item.status] || item.status;
const typeLabel = CHECKLIST_TYPE_LABELS[item.type] || item.type;
const canMarkReceived = item.type === "recommendation" && item.status !== "complete";

return `
<li style="display:flex;align-items:center;justify-content:space-between;gap:10px;font-size:var(--fs-caption,.8rem);color:var(--text-muted);">
<span>${typeLabel} — ${item.label} <strong style="color:var(--text-color);">${statusLabel}</strong></span>
${canMarkReceived ? `<button type="button" class="btn-detail-action" data-action="mark-received" data-app-id="${app.id}" data-item-id="${item.id}" style="padding:4px 10px;font-size:var(--fs-caption,.8rem);">Marquer reçue</button>` : ""}
</li>
`;

}).join("")}
</ul>
`;

}

function renderInterviewPrepStatus(userData) {

const el = document.getElementById("interviewPrepStatus");
if (!el) return;

const checklist = userData.interviewPrepChecklist || {};
const total = 7; // CHECKLIST_ITEMS.length dans interview-prep.js — pas de source partagée, script de page sans exports.
const done = Object.values(checklist).filter(Boolean).length;

el.textContent = done > 0
? `${done}/${total} points de préparation cochés par l'étudiant.`
: "Aucun point de préparation coché pour le moment.";

}

async function handleMarkReceived(app, itemId) {

const checklist = Array.isArray(app.checklist) ? app.checklist : [];
const newChecklist = checklist.map((item) => (item.id === itemId ? { ...item, status: "complete" } : item));

try {
await updateApplicationChecklistItem(uid, app.id, newChecklist);
await renderCandidatures(currentUserData);
} catch (error) {
console.error("Impossible de marquer la lettre comme reçue :", error);
echec("L action n a pas abouti", error);
}

}

async function renderCandidatures(userData) {

const list = document.getElementById("candidaturesList");
const quotaStatus = document.getElementById("quotaStatus");

let applications = [];

try {
applications = await getUserApplications(uid);
} catch (error) {
console.error("Impossible de charger les candidatures :", error);
list.innerHTML = `<p class="detail-field-value" style="font-weight:400;color:var(--text-muted);">Impossible de charger les candidatures.</p>`;
return;
}

// SCHOLARBRIDGE_PLANS (pricing-plans.js) ne décrit que les formules
// achetables — "gratuit" n'y figure pas puisqu'elle n'a ni prix ni
// quota positif. resolvePlan() reste la source de vérité pour savoir
// quelle formule est réellement active (gère aussi l'expiration).
const activePlanKey = resolvePlan(userData);
const plan = window.SCHOLARBRIDGE_PLANS && window.SCHOLARBRIDGE_PLANS[activePlanKey];
const quota = plan ? plan.maxAccompaniedApplications : 0;

const suivies = `${applications.length} candidature${applications.length > 1 ? "s" : ""} suivie${applications.length > 1 ? "s" : ""}`;

// Libellé d'interface (PLAN_LABELS), pas le nom de marque long de
// pricing-plans.js : on est dans le panneau d'administration.
const nomFormule = PLAN_LABELS[activePlanKey];

if (quota === Infinity) {

// Convention "illimité" (pricing-plans.js) : afficher le mot, jamais
// la valeur brute — `${Infinity}` rendrait littéralement "Infinity".
quotaStatus.textContent = `${suivies} — candidatures illimitées (formule ${nomFormule}).`;

} else if (quota) {

quotaStatus.textContent = `${applications.length} / ${quota} candidature${quota > 1 ? "s" : ""} suivie${applications.length > 1 ? "s" : ""} (quota de la formule ${nomFormule}).`;

} else {

quotaStatus.textContent = `${suivies} — formule Gratuit, aucune candidature accompagnée incluse.`;

}

renderInterviewPrepStatus(userData);

if (!applications.length) {
list.innerHTML = `<p class="detail-field-value" style="font-weight:400;color:var(--text-muted);">Aucune candidature suivie pour le moment.</p>`;
return;
}

// Lot ACCEPTATION, partie 6 : c'est Charles qui décide la suite. Un
// décompte par statut des cartes BOURSES, et — quand les N cartes de la
// formule ont toutes reçu une réponse — un bandeau qui le lui dit.
const decompte = decompteBourses(applications, quota);

list.innerHTML = (decompte.ligne ? `<p class="detail-field-value" id="candidaturesDecompte" style="font-weight:600;margin-bottom:10px;">${decompte.ligne}</p>` : "")
+ (decompte.toutesRepondues ? `<div class="detail-alert" id="candidaturesSuiteBandeau" role="status" style="margin-bottom:14px;padding:12px 14px;border:1px solid var(--border-color);border-radius:8px;background:var(--background-alt);font-weight:600;">Les ${quota} candidatures ont reçu une réponse : à vous de décider la suite (formule, date de fin, message).</div>` : "")
+ applications.map((app) => `
<div class="timeline-item">
<span class="timeline-dot" style="background:${app.status === "reponse_recue" ? "var(--success)" : "var(--border-color)"}"></span>
<div class="timeline-body">
<div class="timeline-label">${app.university}${app.scholarship ? ` — ${app.scholarship}` : ""}</div>
<!-- Parcours affiché depuis le 2026-09-08 : bourse et préinscription
n'ont ni les mêmes étapes, ni les mêmes documents, ni le même
interlocuteur. Sans cette mention, l'admin lisait deux candidatures
identiques là où l'étudiant en vit deux différentes. lireParcours()
plutôt que app.track brut — c'est elle qui décide qu'un champ absent
vaut « bourse », et deux lectures divergentes du même champ
finiraient par se contredire. -->
<div class="timeline-meta">${LIBELLES_PARCOURS[lireParcours(app)].court} · ${APP_STATUS_LABELS[app.status] || app.status}${app.premiumProtected ? " · suivi protégé au-delà de l'abonnement" : ""}</div>
${renderPreuveReadOnly(app)}
${renderChecklistItemsReadOnly(app)}
</div>
</div>
`).join("");

list.querySelectorAll('[data-action="mark-received"]').forEach((btn) => {

btn.addEventListener("click", () => {

const app = applications.find((a) => a.id === btn.dataset.appId);
if (!app) return;

btn.disabled = true;
handleMarkReceived(app, btn.dataset.itemId);

});

});

}

// ==========================================================
// Chargement principal
// ==========================================================

const pageLoader = document.getElementById("pageLoader");
const content = document.querySelector(".content");

async function loadStudent() {

currentUserData = await getUser(uid);

if (!currentUserData) {
content.innerHTML = `<div style="padding:40px;text-align:center;"><h2>Étudiant introuvable</h2></div>`;
return;
}

const profile = currentUserData.profile || {};

renderHeader(currentUserData);
renderProfile(profile);
renderProgression(profile);
renderSubscriptionTab(currentUserData);

await Promise.all([
renderActivity(),
renderNotes(),
renderMessages(),
renderAdvisorRequests(),
renderCandidatures(currentUserData)
]);

if (window.lucide) lucide.createIcons();

}

onAuthStateChanged(auth, async (user) => {

if (!user) {
window.location.href = "login.html";
return;
}

try {

// UNE SEULE LECTURE, UN SEUL VERDICT (correctif du 2026-09-09).
// Cette page lisait admins/{uid} pour son compte, PUIS appelait
// chargerAdmin() : deux allers-retours, et surtout deux endroits qui
// décidaient « est-ce un administrateur ». Deux décisions égales
// écrites à deux endroits finissent par différer — c'est déjà arrivé
// ici, sur l'orthographe d'un rôle.
//
// LOT ADMIN : le NIVEAU, pas seulement l'identité. Un administrateur
// ordinaire garde la fiche entière — profil, notes, messages,
// candidatures — mais les sélecteurs de formule et le bouton de
// promotion sont RETIRÉS du DOM avant le premier rendu.
//
// Une lecture qui ÉCHOUE part dans le catch, où elle est nommée : elle
// ne se confond plus avec « ce compte n'est pas administrateur ».
const adminConnecte = await chargerAdmin();

if (!adminConnecte) {
await signOut(auth);
window.location.href = "login.html";
return;
}

currentAdmin = {
uid: adminConnecte.uid,
email: adminConnecte.email,
superAdmin: adminConnecte.superAdmin
};

appliquerRole(currentAdmin.superAdmin);

if (!uid) {
content.style.display = "";
content.innerHTML = `<div style="padding:40px;text-align:center;"><h2>Aucun étudiant sélectionné</h2><a href="students.html">Retour à la liste</a></div>`;
hidePageLoader();
return;
}

initTabs();
await loadStudent();
if (currentAdmin.superAdmin) await rafraichirEtatPromotion();

hidePageLoader();

} catch (error) {

// ⚠️ UN FILET QUI MENT COÛTE PLUS CHER QUE PAS DE FILET.
//
// Ce bloc transformait N'IMPORTE QUELLE erreur en « Vérifiez votre
// connexion Internet ». Deux fois, la fiche est morte d'une erreur de
// PROGRAMMATION — un import manquant au lot S0, puis un `.value` sur un
// élément retiré du DOM — et deux fois l'écran a envoyé chercher la
// panne du côté du réseau. Chaque diagnostic a commencé par une fausse
// piste que l'écran lui-même avait indiquée.
//
// Désormais : on distingue, on NOMME l'erreur à l'écran, et on la laisse
// entière dans la console. Une erreur de code n'est pas une panne
// passagère : proposer « Réessayer » serait promettre que le hasard
// pourrait la réparer.
console.error("Erreur de chargement de la fiche étudiant :", error);

const famille = categoriserErreur(error);
const codeLisible = echapperTexte((error && error.code) || "");
const detail = echapperTexte((error && (error.stack || error.message)) || String(error));
const retour = `<p style="margin-top:14px;"><a href="students.html">Retour à la liste des étudiants</a></p>`;
const pileVisible = `<p style="font-family:monospace;font-size:13px;margin-top:14px;padding:12px;border-radius:8px;background:rgba(0,0,0,.06);text-align:left;white-space:pre-wrap;">${detail}</p>`;

const ecrans = {

reseau: `
<div style="padding:40px;text-align:center;">
<h2>Cette fiche n'a pas pu être chargée</h2>
<p>La connexion au serveur a échoué (${codeLisible || "réseau"}). Vérifiez votre connexion Internet, puis réessayez.</p>
<button onclick="window.location.reload()">Réessayer</button>
</div>`,

serveur: `
<div style="padding:40px;text-align:center;">
<h2>Le serveur a refusé cette lecture</h2>
<p>Ce n'est pas un problème de connexion : la requête est bien arrivée, et elle a été refusée (${codeLisible}). Réessayer ne changera rien — c'est un droit ou un document qui manque.</p>
${pileVisible}
${retour}
</div>`,

code: `
<div style="padding:40px;text-align:center;">
<h2>Cette fiche a rencontré une erreur interne</h2>
<p>Ce n'est pas un problème de connexion : réessayer ne changera rien. Signalez ce message tel quel.</p>
${pileVisible}
${retour}
</div>`

};

if (content) {
content.style.display = "";
content.innerHTML = ecrans[famille];
}

if (pageLoader) pageLoader.style.display = "none";

}

});

// ==========================================================
// Actions : formule, suspension, notes, messages
// ==========================================================

// ==========================================================
// TOUTE ATTRIBUTION MANUELLE PASSE PAR ICI (lot ADMIN, 2026-09-09)
// ==========================================================
//
// Une seule fonction pour les quatre boutons de formule, et trois
// exigences qu'elle tient ensemble :
//
//   1. UNE SEULE ÉCRITURE — la formule ET sa trace partent dans la même
//      requête. Si les règles refusent, RIEN n'est posé : jamais une
//      formule sans sa trace, ni l'inverse.
//   2. UN RETOUR VISIBLE, dans les deux issues. Un refus du serveur
//      n'est pas une panne : c'est une information, et elle est dite
//      (« vous n'avez pas ce droit »).
//   3. ON RELIT DEPUIS LA BASE. L'ancien code mettait à jour l'objet en
//      mémoire et réaffichait : on voyait donc ce qu'on avait DEMANDÉ,
//      pas ce qui avait été ENREGISTRÉ. Les deux diffèrent le jour où
//      une règle refuse un champ au milieu d'un lot.
async function enregistrerFormule(champs, libelle) {

if (!currentAdmin || !currentAdmin.superAdmin) {
echec("Attribution refusée : seul le propriétaire peut poser une formule à la main.");
return;
}

notifier(`Enregistrement de ${libelle}…`);

try {

await attribuerFormuleManuellement(uid, champs, currentAdmin.uid);

// On RELIT : c'est l'état réel qu'on affiche, jamais l'état espéré.
const relu = await getUser(uid);
if (relu) {
currentUserData = relu;
renderHeader(currentUserData);
renderSubscriptionTab(currentUserData);
}

succes(`${libelle} enregistré. La mention d'attribution manuelle est posée sur ce compte.`);

} catch (error) {

console.error(error);
echec(`${libelle} n'a pas été enregistré`, error);

}

}

// Les quatre champs de formule vivent dans des blocs [data-super-admin],
// que appliquerRole() RETIRE du DOM pour un administrateur ordinaire.
// Leur bouton est retiré avec eux, donc ces gestionnaires ne partent
// jamais chez lui — mais un bouton et son champ peuvent être séparés un
// jour, et le prix de l'oubli est la fiche entière (2026-09-09). On lit
// donc TOUJOURS à travers cette fonction : élément absent = champ vide.
function valeurDe(id) {
const el = document.getElementById(id);
return el ? el.value : "";
}

document.getElementById("savePlanBtn")?.addEventListener("click", () => {
const value = valeurDe("planSelect");
const libelle = value ? (PLAN_LABELS[value] || value) : "Sans formule";
enregistrerFormule({ plan: value || null }, libelle);
});

document.getElementById("savePlanExpiryBtn")?.addEventListener("click", () => {
const value = valeurDe("planExpiryInput") || null;
enregistrerFormule({ planExpiresAt: value }, value ? `l'expiration au ${formatISODate(value)}` : "l'expiration effacée");
});

document.getElementById("savePlanPreinscriptionBtn")?.addEventListener("click", () => {
const value = valeurDe("planPreinscriptionSelect");
const libelle = value ? (PLAN_PREINSCRIPTION_LABELS[value] || value) : "Sans offre préinscription";
enregistrerFormule({ planPreinscription: value || null }, libelle);
});

document.getElementById("savePlanPreinscriptionExpiryBtn")?.addEventListener("click", () => {
const value = valeurDe("planPreinscriptionExpiryInput") || null;
enregistrerFormule({ planPreinscriptionExpiresAt: value }, value ? `l'expiration préinscription au ${formatISODate(value)}` : "l'expiration préinscription effacée");
});

// ==========================================================
// PROMOUVOIR — on ne crée jamais de compte, on en promeut un
// ==========================================================
document.getElementById("promoteAdminBtn")?.addEventListener("click", async () => {

if (!currentAdmin || !currentAdmin.superAdmin) {
echec("Promotion refusée : seul le propriétaire peut nommer un administrateur.");
return;
}

const nom = (currentUserData && currentUserData.name) || (currentUserData && currentUserData.email) || uid;

if (!window.confirm(`Promouvoir ${nom} en administrateur ?\n\nCette personne aura accès au Control Center : étudiants, messages, catalogue. Elle ne pourra ni nommer, ni révoquer, ni attribuer une formule.`)) return;

notifier("Promotion en cours…");

try {

await promouvoirAdmin(uid, { email: (currentUserData && currentUserData.email) || "", nom: (currentUserData && currentUserData.name) || "" }, currentAdmin.uid);
await rafraichirEtatPromotion();
succes(`${nom} est désormais administrateur. Vous pouvez le révoquer depuis la page Administrateurs.`);

} catch (error) {

console.error(error);
echec("La promotion a échoué", error);

}

});

/** Lit `admins/{uid}` de l'étudiant affiché et dit où il en est. */
async function rafraichirEtatPromotion() {

const el = document.getElementById("promotionStatus");
const bouton = document.getElementById("promoteAdminBtn");
if (!el) return;

try {

const snap = await getDoc(doc(db, "admins", uid));

if (!snap.exists()) {
el.textContent = "Ce compte n'est pas administrateur.";
if (bouton) bouton.disabled = false;
return;
}

const data = snap.data();
const actif = data.isActive === true;

el.textContent = actif
? `Administrateur depuis le ${data.nommeLe ? formatISODate(data.nommeLe) : "—"}. La révocation se fait depuis la page Administrateurs.`
: "Administrateur révoqué. La réactivation se fait depuis la page Administrateurs.";

if (bouton) bouton.disabled = actif;

} catch (error) {

// La lecture d'un document `admins` qui n'est pas le sien est
// réservée au superAdmin : un refus ici n'est pas une panne.
el.textContent = "État administrateur non lisible avec ce compte.";

}

}

// Le Pass Découverte est un droit PAYANT : il passe par le même chemin
// tracé que les deux grilles (lot ADMIN). Il était écrit sans trace, et
// un compte à qui on offrait un pass était indiscernable d un compte qui
// l avait acheté.
document.getElementById("saveFitzExpressBtn")?.addEventListener("click", () => {
const value = valeurDe("fitzExpressInput") || null;
enregistrerFormule({ fitzExpressExpiresAt: value }, value ? `le Pass Découverte jusqu au ${formatISODate(value)}` : "le Pass Découverte retiré");
});

document.getElementById("testerAccessToggle")?.addEventListener("change", async (event) => {

const enabled = event.target.checked;

try {

await updateUserTesterAccess(uid, enabled);
currentUserData.testerAccess = enabled;
renderHeader(currentUserData);

} catch (error) {

console.error(error);
echec("L accès test complet n a pas été enregistré", error);
event.target.checked = !enabled;

}

});

document.getElementById("toggleDisabledBtn").addEventListener("click", async () => {

const nextDisabled = !(currentUserData.disabled === true);

const confirmMessage = nextDisabled
? "Suspendre ce compte ? L'étudiant sera redirigé vers une page \"Compte suspendu\" à sa prochaine connexion."
: "Réactiver ce compte ?";

if (!confirm(confirmMessage)) return;

try {

await setUserDisabled(uid, nextDisabled);
currentUserData.disabled = nextDisabled;

renderHeader(currentUserData);
renderSubscriptionTab(currentUserData);

} catch (error) {

console.error(error);
echec("Le statut du compte n a pas été enregistré", error);

}

});

document.getElementById("addNoteBtn").addEventListener("click", async () => {

const textarea = document.getElementById("noteText");
const text = textarea.value.trim();

if (!text) return;

try {

await addAdminNote(uid, currentAdmin.uid, currentAdmin.email, text);
textarea.value = "";

await renderNotes();

} catch (error) {

console.error(error);
echec("La note n a pas été ajoutée", error);

}

});

document.getElementById("sendMessageBtn").addEventListener("click", async () => {

const textarea = document.getElementById("messageText");
const text = textarea.value.trim();

if (!text) return;

try {

await sendMessageToUser(uid, currentAdmin.uid, currentAdmin.email, text);
textarea.value = "";

trackEvent("admin_message_sent", {});

await renderMessages();

} catch (error) {

console.error(error);
echec("Le message n a pas été envoyé", error);

}

});

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

logoutBtn.addEventListener("click", async () => {

if (logoutBtn.dataset.busy === "true") return;
logoutBtn.dataset.busy = "true";

try {

await signOut(auth);
window.location.href = "login.html";

} catch (error) {

console.error(error);
echec("La déconnexion a échoué", error);
logoutBtn.dataset.busy = "false";

}

});

}
