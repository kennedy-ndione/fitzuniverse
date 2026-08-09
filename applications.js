// -------- applications.js --------
// Suivi de candidatures : entièrement réel (Firestore, pas de
// simulation) pour la partie in-app — statuts, dates, export .ics de
// rappel téléchargeable côté client. La seule pièce non construite ici
// est l'ENVOI D'E-MAIL de rappel, qui nécessite un backend qui n'existe
// pas encore sur ce projet (Firebase doit passer en formule Blaze, et
// un service d'envoi d'e-mails doit être configuré — même blocage que
// le reste du backend, voir payment.js).
//
// Architecture prévue pour cette pièce manquante, à implémenter plus
// tard sans changer ce fichier : une Cloud Function planifiée
// (ex. tous les jours à 8h) qui interroge, pour chaque utilisateur, les
// documents users/{uid}/applications où nextCheckDate <= aujourd'hui,
// et envoie un e-mail récapitulatif via le service configuré. Aucun
// champ supplémentaire n'est nécessaire côté client : nextCheckDate
// (déjà écrit ici à chaque ajout et à chaque "J'ai vérifié") est tout
// ce dont cette fonction aurait besoin.

import { db } from "./firebase-config.js";

import {
collection,
addDoc,
updateDoc,
deleteDoc,
doc,
getDocs,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import { trackEvent } from "./js/analytics.js";
import { initShellChrome, bootstrapShell, unlockingPlans, PLAN_LABELS } from "./js/app-shell.js";
import { isQuotaReached } from "./js/plan-features.js";
import { recommendPrograms } from "./js/recommend-programs.js";

initShellChrome();

const STATUS_LABELS = {
a_preparer: "À préparer",
en_cours: "En préparation",
deposee: "Déposée",
en_attente: "En attente de réponse",
reponse_recue: "Réponse reçue"
};

const STATUS_ORDER = ["a_preparer", "en_cours", "deposee", "en_attente", "reponse_recue"];

async function fetchApplications(uid) {
const snapshot = await getDocs(collection(db, "users", uid, "applications"));
return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

function renderProtectedReadOnlyState(container, protectedApps) {

container.innerHTML = `
<div class="alert alert-warning">
<i data-lucide="shield-check"></i>
<div>
<strong>Votre abonnement a expiré, mais Fitz continue de suivre votre candidature en attente jusqu'à sa résolution.</strong>
<p>Fitz garde vos candidatures en attente sous surveillance jusqu'à leur réponse. Renouvelez votre formule dès que vous le souhaitez pour retrouver la possibilité d'ajouter ou de modifier vos candidatures.</p>
</div>
</div>

<div class="apps-list">
${protectedApps.map((app) => {

const urgency = urgencyLabel(app);

return `
<article class="card app-card">
<div class="app-card-top">
<div>
<h3>${app.university}</h3>
${app.scholarship ? `<p class="app-card-scholarship">${app.scholarship}</p>` : ""}
</div>
<span class="app-status-pill app-status-${app.status}">${STATUS_LABELS[app.status] || app.status}</span>
</div>

<div class="app-card-meta">
${app.deadline ? `<span><i data-lucide="calendar"></i>Date limite : ${formatDateFR(app.deadline)}</span>` : ""}
<span class="${urgency.urgent ? "is-urgent" : ""}"><i data-lucide="bell"></i>${urgency.text}</span>
<span class="is-protected"><i data-lucide="shield-check"></i>Suivi maintenu même après votre abonnement</span>
</div>

${app.notes ? `<p class="app-card-notes">${app.notes}</p>` : ""}

${app.portalUrl ? `<div class="app-card-actions"><a href="${app.portalUrl}" target="_blank" rel="noopener" class="btn btn-ghost btn-sm"><i data-lucide="external-link"></i><span>Portail</span></a></div>` : ""}
</article>
`;

}).join("")}
</div>

<div class="apps-toolbar">
<a href="offers.html" class="btn btn-primary">
<i data-lucide="sparkles"></i>
<span>Renouveler mon abonnement</span>
</a>
</div>
`;

container.hidden = false;

if (window.lucide) lucide.createIcons();

}

function renderLockedState(container, ctx) {

const flags = ctx.featureFlags.applications;
const target = unlockingPlans(ctx.planId, flags)[0];

container.innerHTML = `
<div class="ai-locked-hero">
<div class="ai-locked-icon"><i data-lucide="lock"></i></div>
<h2>Suivi des candidatures</h2>
<p>Débloquez le suivi de vos candidatures avec ${target ? `la formule <strong>${PLAN_LABELS[target]}</strong>` : "une formule supérieure"} : gardez chaque étape sous contrôle, avec les rappels de Fitz pour ne rien manquer.</p>
<a href="${target ? `offers.html#${target}` : "offers.html"}" class="btn btn-primary">
<i data-lucide="sparkles"></i>
<span>Découvrir nos formules</span>
</a>
</div>
`;

container.hidden = false;

if (window.lucide) lucide.createIcons();

}

function daysBetween(dateA, dateB) {
const MS_PER_DAY = 86400000;
return Math.round((dateA.setHours(0,0,0,0) - dateB.setHours(0,0,0,0)) / MS_PER_DAY);
}

function formatDateFR(isoDate) {
if (!isoDate) return null;
const d = new Date(isoDate + "T00:00:00");
return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function urgencyLabel(app) {

if (!app.nextCheckDate) return { text: "Pas de rappel programmé", urgent: false };

const days = daysBetween(new Date(app.nextCheckDate + "T00:00:00"), new Date());

if (days < 0) return { text: `À vérifier — en retard de ${Math.abs(days)} j`, urgent: true };
if (days === 0) return { text: "À vérifier aujourd'hui", urgent: true };
if (days <= 2) return { text: `À vérifier dans ${days} j`, urgent: true };

return { text: `Prochaine vérification dans ${days} j`, urgent: false };

}

function buildICS(app) {

const target = app.nextCheckDate || app.deadline;
if (!target) return null;

const dt = target.replace(/-/g, "");
const title = `Vérifier ma candidature — ${app.university}`;
const desc = app.scholarship ? `Bourse : ${app.scholarship}` : "Rappel ScholarBridge";

const ics = [
"BEGIN:VCALENDAR",
"VERSION:2.0",
"PRODID:-//ScholarBridge//Suivi candidatures//FR",
"BEGIN:VEVENT",
`UID:${app.id}@scholarbridge`,
`DTSTAMP:${dt}T090000Z`,
`DTSTART;VALUE=DATE:${dt}`,
`SUMMARY:${title}`,
`DESCRIPTION:${desc}`,
"END:VEVENT",
"END:VCALENDAR"
].join("\r\n");

return ics;

}

function downloadICS(app) {

const ics = buildICS(app);
if (!ics) return;

const blob = new Blob([ics], { type: "text/calendar" });
const url = URL.createObjectURL(blob);
const a = document.createElement("a");
a.href = url;
a.download = `rappel-${(app.university || "candidature").toLowerCase().replace(/[^a-z0-9]+/g, "-")}.ics`;
document.body.appendChild(a);
a.click();
a.remove();
URL.revokeObjectURL(url);

}

function nextCheckFromToday(frequencyDays) {
const d = new Date();
d.setDate(d.getDate() + parseInt(frequencyDays, 10));
return d.toISOString().slice(0, 10);
}

// ==========================================================
// CRÉNEAUX RECOMMANDÉS — réutilise le quota déjà existant
// (SCHOLARBRIDGE_PLANS[planId].maxAccompaniedApplications), pas un
// second système de comptage. Un compte dont le quota est fini
// (Premier Dossier, Essentiel, Avancé, Premium, Signature Focus) et qui
// a moins de candidatures que ce quota se voit pré-remplir les
// créneaux manquants avec des suggestions réelles (jointure
// programs → universities/scholarships, même pattern que
// scholarships.js/universities-page.js/details.js — jamais une
// deuxième façon de résoudre bourse↔université).
//
// Signature (quota Infinity) n'est délibérément jamais pré-rempli :
// "3 créneaux" n'a de sens que pour un quota fini. isQuotaReached()
// (js/plan-features.js) traite déjà Infinity comme "jamais atteint" —
// même esprit ici : pas de créneaux à combler quand il n'y a pas de
// plafond.
//
// isRecommendation:true marque un créneau que Fitz a rempli lui-même
// (badge "Suggéré par Fitz" + bouton "Suggérer une autre université"
// dans renderCard) — purement informatif, ne change RIEN au quota : le
// document compte comme n'importe quelle candidature dès sa création,
// conformément à l'option retenue (pas d'état "recommandation non
// confirmée" distinct, pour ne pas dupliquer isQuotaReached()).
async function seedRecommendedSlots(uid, planId, existingApplications, profile) {

const plan = window.SCHOLARBRIDGE_PLANS && window.SCHOLARBRIDGE_PLANS[planId];
const quota = plan ? plan.maxAccompaniedApplications : null;

if (!Number.isFinite(quota) || quota <= 0) return false;

const missing = quota - existingApplications.length;

if (missing <= 0) return false;

let programsSnap, universitiesSnap, scholarshipsSnap;

try {

[programsSnap, universitiesSnap, scholarshipsSnap] = await Promise.all([
getDocs(collection(db, "programs")),
getDocs(collection(db, "universities")),
getDocs(collection(db, "scholarships"))
]);

} catch (error) {

console.warn("Impossible de charger le catalogue pour les recommandations Fitz :", error);
return false;

}

const programs = programsSnap.docs.map((d) => ({ firestoreId: d.id, ...d.data() }));
const universitiesById = new Map(universitiesSnap.docs.map((d) => [d.id, { firestoreId: d.id, ...d.data() }]));
const scholarshipsById = new Map(scholarshipsSnap.docs.map((d) => [d.id, { firestoreId: d.id, ...d.data() }]));

// Les candidatures existantes n'ont qu'un nom d'université en texte
// libre (pas d'identifiant Firestore — voir la note du schéma en tête
// de fichier) : seul un rapprochement par nom permet d'éviter de
// suggérer une université déjà occupée par un autre créneau.
const excludeNames = new Set(
existingApplications.map((a) => (a.university || "").trim().toLowerCase()).filter(Boolean)
);

const eligiblePrograms = programs.filter((p) => {
const uni = universitiesById.get(p.universityId);
return uni && !excludeNames.has((uni.university || "").trim().toLowerCase());
});

const recommendations = recommendPrograms({
profile: profile || {},
programs: eligiblePrograms,
universitiesById,
scholarshipsById,
count: missing
});

if (!recommendations.length) return false;

const appsCol = collection(db, "users", uid, "applications");

for (const rec of recommendations) {

await addDoc(appsCol, {
university: rec.universityName,
scholarship: rec.scholarshipTitle,
portalUrl: "",
status: "a_preparer",
deadline: null,
reminderFrequency: 14,
notes: "",
premiumProtected: false,
isRecommendation: true,
nextCheckDate: nextCheckFromToday(14),
createdAt: serverTimestamp()
});

}

return true;

}

function initApplicationsPage(uid, planId, profile) {

const listEl = document.getElementById("applicationsList");
const emptyEl = document.getElementById("applicationsEmpty");
const statTracked = document.getElementById("statTracked");
const statDue = document.getElementById("statDue");
const statPending = document.getElementById("statPending");

const modal = document.getElementById("applicationModal");
const modalTitle = document.getElementById("applicationModalTitle");
const form = document.getElementById("applicationForm");

const fields = {
university: document.getElementById("fieldUniversity"),
scholarship: document.getElementById("fieldScholarship"),
portalUrl: document.getElementById("fieldPortalUrl"),
status: document.getElementById("fieldStatus"),
deadline: document.getElementById("fieldDeadline"),
frequency: document.getElementById("fieldFrequency"),
notes: document.getElementById("fieldNotes")
};

const appsCol = collection(db, "users", uid, "applications");

let applications = [];
let editingId = null;

function openModal(app) {

editingId = app ? app.id : null;
modalTitle.textContent = app ? "Modifier la candidature" : "Nouvelle candidature";

fields.university.value = app?.university || "";
fields.scholarship.value = app?.scholarship || "";
fields.portalUrl.value = app?.portalUrl || "";
fields.status.value = app?.status || "a_preparer";
fields.deadline.value = app?.deadline || "";
fields.frequency.value = app?.reminderFrequency || "14";
fields.notes.value = app?.notes || "";

modal.hidden = false;

}

function closeModal() {
modal.hidden = true;
editingId = null;
form.reset();
}

function renderStats() {

statTracked.textContent = applications.length;
statDue.textContent = applications.filter((a) => urgencyLabel(a).urgent).length;
statPending.textContent = applications.filter((a) => a.status === "en_attente").length;

}

function renderCard(app) {

const urgency = urgencyLabel(app);

const card = document.createElement("article");
card.className = "card app-card" + (urgency.urgent ? " app-card-urgent" : "");
card.dataset.appId = app.id;

card.innerHTML = `
<div class="app-card-top">
<div>
${app.isRecommendation ? `<span class="app-recommendation-badge"><i data-lucide="sparkles"></i>Suggéré par Fitz</span>` : ""}
<h3>${app.university}</h3>
${app.scholarship ? `<p class="app-card-scholarship">${app.scholarship}</p>` : ""}
</div>
<span class="app-status-pill app-status-${app.status}">${STATUS_LABELS[app.status] || app.status}</span>
</div>

<div class="app-card-meta">
${app.deadline ? `<span><i data-lucide="calendar"></i>Date limite : ${formatDateFR(app.deadline)}</span>` : ""}
<span class="${urgency.urgent ? "is-urgent" : ""}"><i data-lucide="bell"></i>${urgency.text}</span>
${app.premiumProtected ? `<span class="is-protected"><i data-lucide="shield-check"></i>Suivi maintenu même après votre abonnement</span>` : ""}
</div>

${app.notes ? `<p class="app-card-notes">${app.notes}</p>` : ""}

<div class="app-card-documents">
<i data-lucide="pen-line"></i>
${app.generatedLetter
? `<span>Lettre de motivation générée pour cette candidature.</span><a href="ai-letter.html?applicationId=${app.id}" class="app-doc-link">Revoir / régénérer</a>`
: `<span>Fitz peut générer une lettre de motivation pour cette candidature.</span><a href="ai-letter.html?applicationId=${app.id}" class="app-doc-link">Générer avec Fitz</a>`}
</div>

<div class="app-card-actions">
${app.isRecommendation ? `<button type="button" class="btn btn-secondary btn-sm app-replace-btn"><i data-lucide="refresh-cw"></i><span>Suggérer une autre université</span></button>` : ""}
<button type="button" class="btn btn-secondary btn-sm app-checkin-btn"><i data-lucide="check"></i><span>J'ai vérifié</span></button>
${app.portalUrl ? `<a href="${app.portalUrl}" target="_blank" rel="noopener" class="btn btn-ghost btn-sm"><i data-lucide="external-link"></i><span>Portail</span></a>` : ""}
<button type="button" class="btn btn-ghost btn-sm app-ics-btn"><i data-lucide="calendar-plus"></i><span>Rappel .ics</span></button>
<button type="button" class="btn btn-ghost btn-sm app-edit-btn"><i data-lucide="pen-line"></i></button>
<button type="button" class="btn btn-ghost btn-sm app-delete-btn"><i data-lucide="trash-2"></i></button>
</div>
`;

card.querySelector(".app-checkin-btn").addEventListener("click", () => checkIn(app));
card.querySelector(".app-ics-btn").addEventListener("click", () => downloadICS(app));
card.querySelector(".app-edit-btn").addEventListener("click", () => openModal(app));
card.querySelector(".app-delete-btn").addEventListener("click", () => removeApplication(app));
card.querySelector(".app-replace-btn")?.addEventListener("click", () => replaceRecommendation(app));

return card;

}

function render() {

applications.sort((a, b) => {
const da = a.nextCheckDate ? new Date(a.nextCheckDate) : new Date("2999-01-01");
const db_ = b.nextCheckDate ? new Date(b.nextCheckDate) : new Date("2999-01-01");
return da - db_;
});

listEl.innerHTML = "";

emptyEl.hidden = applications.length > 0;

applications.forEach((app) => listEl.appendChild(renderCard(app)));

renderStats();

if (window.lucide) lucide.createIcons();

}

async function loadApplications() {

applications = await fetchApplications(uid);

const seeded = await seedRecommendedSlots(uid, planId, applications, profile);
if (seeded) applications = await fetchApplications(uid);

render();

}

// Remplace le créneau `app` par une autre suggestion réelle (même
// jointure programs que seedRecommendedSlots), en excluant les
// universités déjà occupées par les autres créneaux — jamais de
// créneau supplémentaire créé, jamais le quota dépassé : c'est une
// mise à jour du document existant (même id), pas une création.
async function replaceRecommendation(app) {

const button = document.querySelector(`[data-app-id="${app.id}"] .app-replace-btn`);
if (button) { button.disabled = true; button.querySelector("span").textContent = "Recherche..."; }

try {

let programsSnap, universitiesSnap, scholarshipsSnap;

[programsSnap, universitiesSnap, scholarshipsSnap] = await Promise.all([
getDocs(collection(db, "programs")),
getDocs(collection(db, "universities")),
getDocs(collection(db, "scholarships"))
]);

const programs = programsSnap.docs.map((d) => ({ firestoreId: d.id, ...d.data() }));
const universitiesById = new Map(universitiesSnap.docs.map((d) => [d.id, { firestoreId: d.id, ...d.data() }]));
const scholarshipsById = new Map(scholarshipsSnap.docs.map((d) => [d.id, { firestoreId: d.id, ...d.data() }]));

const excludeNames = new Set(
applications.map((a) => (a.university || "").trim().toLowerCase()).filter(Boolean)
);

const eligiblePrograms = programs.filter((p) => {
const uni = universitiesById.get(p.universityId);
return uni && !excludeNames.has((uni.university || "").trim().toLowerCase());
});

const [alternative] = recommendPrograms({
profile: profile || {},
programs: eligiblePrograms,
universitiesById,
scholarshipsById,
count: 1
});

if (!alternative) {
alert("Aucune autre université compatible avec votre profil n'est disponible pour le moment.");
return;
}

await updateDoc(doc(db, "users", uid, "applications", app.id), {
university: alternative.universityName,
scholarship: alternative.scholarshipTitle,
isRecommendation: true,
updatedAt: serverTimestamp()
});

trackEvent("application_recommendation_replaced", {});

await loadApplications();

} catch (error) {

console.error("Impossible de proposer une autre université :", error);
alert("Un souci est survenu — réessayez dans un instant.");

} finally {

if (button) { button.disabled = false; button.querySelector("span").textContent = "Suggérer une autre université"; }

}

}

async function checkIn(app) {

const nextCheckDate = nextCheckFromToday(app.reminderFrequency || 14);

await updateDoc(doc(db, "users", uid, "applications", app.id), { nextCheckDate });

trackEvent("application_checked_in", { status: app.status });

await loadApplications();

}

async function removeApplication(app) {

if (!confirm(`Supprimer le suivi de "${app.university}" ?`)) return;

await deleteDoc(doc(db, "users", uid, "applications", app.id));

await loadApplications();

}

form.addEventListener("submit", async (event) => {

event.preventDefault();

// Règle (pricing-plans.js: extendsPendingApplications) : une candidature
// en attente de réponse, marquée "premiumProtected" pendant qu'un
// abonnement essentiel/accompagnement/premium est actif, doit rester
// suivie même après la fin des 6 mois — l'étudiant ne doit jamais se
// sentir abandonné au moment le plus important. Positionnement clarifié
// 2026-07-31 : ce n'était à l'origine qu'un avantage Premium, étendu
// depuis aux 3 paliers (seule leur limite de candidatures diffère,
// jamais la qualité de l'accompagnement) — condition lue depuis le flag
// de pricing-plans.js plutôt qu'un id de palier en dur, pour rester
// synchronisée avec les données. Nom de champ Firestore ("premiumProtected")
// gardé tel quel pour ne pas casser les documents déjà écrits. Le
// déverrouillage partiel de la PAGE au-delà de l'abonnement expiré est
// géré plus bas : quand bootstrapShell() verrouille applications.html
// dans son ensemble, on vérifie d'abord si une candidature
// premiumProtected existe pour cet utilisateur — si oui,
// renderProtectedReadOnlyState() l'affiche en lecture seule au lieu de
// l'écran de verrouillage générique.
const payload = {
university: fields.university.value.trim(),
scholarship: fields.scholarship.value.trim(),
portalUrl: fields.portalUrl.value.trim(),
status: fields.status.value,
deadline: fields.deadline.value || null,
reminderFrequency: parseInt(fields.frequency.value, 10),
notes: fields.notes.value.trim(),
premiumProtected: SCHOLARBRIDGE_PLANS[planId]?.extendsPendingApplications === true && fields.status.value === "en_attente",
// Un enregistrement manuel (création ou modification via ce formulaire)
// est un choix délibéré de l'étudiant — même si ce créneau avait été
// pré-rempli par Fitz (isRecommendation), il perd ce statut dès qu'il
// est touché ici. Seul replaceRecommendation() (bouton "Suggérer une
// autre université") repose le flag.
isRecommendation: false,
updatedAt: serverTimestamp()
};

if (!payload.university) return;

if (editingId) {

await updateDoc(doc(db, "users", uid, "applications", editingId), payload);

} else {

// Quota de candidatures accompagnées (pricing-plans.js —
// maxAccompaniedApplications, la seule vraie différence entre les
// formules depuis le pivot tarifaire du 2026-07-30).
const plan = window.SCHOLARBRIDGE_PLANS && window.SCHOLARBRIDGE_PLANS[planId];
const quota = plan ? plan.maxAccompaniedApplications : null;

// La décision vit dans js/plan-features.js (fonction pure, couverte
// par test/plan-features.test.mjs) plutôt qu'en ligne ici : elle est
// ainsi vérifiable sans navigateur et sans écrire dans Firestore.
if (isQuotaReached(quota, applications.length)) {

// Libellé d'interface, pas le nom de marque long — voir la règle
// dans js/plan-features.js.
alert(`Votre formule ${PLAN_LABELS[planId]} permet d'accompagner ${quota} candidature${quota > 1 ? "s" : ""} à la fois. Terminez-en une, ou passez à une formule supérieure pour en suivre davantage.`);
return;

}

payload.nextCheckDate = nextCheckFromToday(payload.reminderFrequency);
payload.createdAt = serverTimestamp();

await addDoc(appsCol, payload);

trackEvent("application_added", { status: payload.status });

}

closeModal();
await loadApplications();

});

document.getElementById("addApplicationBtn").addEventListener("click", () => openModal(null));
document.getElementById("applicationModalClose").addEventListener("click", closeModal);
document.getElementById("applicationCancelBtn").addEventListener("click", closeModal);

modal.addEventListener("click", (event) => {
if (event.target === modal) closeModal();
});

loadApplications();

}

bootstrapShell({ feature: "applications" }).then(async (ctx) => {

if (ctx.locked) {

document.getElementById("applicationsApp").remove();

const existingApplications = await fetchApplications(ctx.user.uid);
const protectedApplications = existingApplications.filter((app) => app.premiumProtected === true);

if (protectedApplications.length > 0) {
renderProtectedReadOnlyState(document.getElementById("lockedState"), protectedApplications);
} else {
renderLockedState(document.getElementById("lockedState"), ctx);
}

return;

}

initApplicationsPage(ctx.user.uid, ctx.planId, ctx.profile);

});
