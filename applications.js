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

// ==========================================================
// DOSSIER DE CANDIDATURE — checklist par candidature (lettres de
// recommandation, test de langue, preuve financière). Une seule
// structure générique (champ `checklist`, array sur le document
// application) réutilisée pour les 3 types plutôt qu'un champ dédié
// par fonctionnalité : le score de complétude et les repères de
// calibration se calculent directement dessus, sans structure
// supplémentaire. Statut à 3 valeurs partagé par tous les types
// (manquant/en_cours/complete) — seul le libellé affiché change selon
// le type (CHECKLIST_TYPE_META.statusLabels), pour rester lisible
// ("Non demandée" a plus de sens que "Manquant" pour une lettre) sans
// dupliquer la logique d'état.
const CHECKLIST_STATUS_ORDER = ["manquant", "en_cours", "complete"];

const CHECKLIST_TYPE_META = {
recommendation: {
title: "Lettres de recommandation",
icon: "mail-check",
addLabel: "Demander une lettre",
statusLabels: { manquant: "Non demandée", en_cours: "Demandée", complete: "Reçue" }
},
language_test: {
title: "Test de langue",
icon: "languages",
addLabel: "Ajouter un test de langue",
statusLabels: { manquant: "Non planifié", en_cours: "Planifié", complete: "Passé" }
},
financial_proof: {
title: "Preuve financière",
icon: "banknote",
addLabel: "Ajouter une preuve financière",
statusLabels: { manquant: "Manquant", en_cours: "En préparation", complete: "Prêt" }
}
};

function makeChecklistItemId() {
if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
return `cl_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function nextChecklistStatus(status) {
const idx = CHECKLIST_STATUS_ORDER.indexOf(status);
return CHECKLIST_STATUS_ORDER[(idx + 1) % CHECKLIST_STATUS_ORDER.length];
}

function checklistScore(checklist) {
const items = Array.isArray(checklist) ? checklist : [];
return { completed: items.filter((i) => i.status === "complete").length, total: items.length };
}

// Repère de calibration (fonctionnalité 3) : compare deux valeurs
// saisies par l'étudiant lui-même sur CE test de langue (seuil requis
// par la bourse visée, score obtenu) — pas une comparaison contre le
// profil général, qui ne contient qu'un niveau qualitatif
// (débutant/avancé...), non comparable à un score TOEFL/IELTS chiffré.
function calibrationForItem(item) {
if (item.type !== "language_test") return null;
const required = parseFloat(item.meta?.scoreRequired);
const obtained = parseFloat(item.meta?.scoreObtained);
if (!Number.isFinite(required) || !Number.isFinite(obtained)) return null;
return obtained >= required
? { ok: true, text: "Dans la fourchette attendue" }
: { ok: false, text: "En dessous du seuil habituel" };
}

function checklistItemMetaLine(item) {
if (item.type === "language_test") {
const parts = [];
if (item.meta?.testName) parts.push(item.meta.testName);
if (item.meta?.testDate) parts.push(formatDateFR(item.meta.testDate));
if (item.meta?.scoreRequired) parts.push(`Seuil requis : ${item.meta.scoreRequired}`);
if (item.meta?.scoreObtained) parts.push(`Obtenu : ${item.meta.scoreObtained}`);
return parts.join(" · ");
}
if (item.type === "financial_proof") {
return [item.meta?.amountRequired, item.meta?.formatRequired].filter(Boolean).join(" · ");
}
if (item.type === "recommendation" && item.meta?.recommenderContact) {
return item.meta.recommenderContact;
}
return "";
}

function renderChecklistItem(item) {

const typeMeta = CHECKLIST_TYPE_META[item.type];
const statusLabel = typeMeta.statusLabels[item.status] || item.status;
const calibration = calibrationForItem(item);
const metaLine = checklistItemMetaLine(item);

return `
<li class="checklist-item" data-item-id="${item.id}">
<button type="button" class="checklist-status-chip checklist-status-${item.status}" data-action="cycle">${statusLabel}</button>
<div class="checklist-item-body">
<strong>${item.label}</strong>
${metaLine ? `<span class="checklist-item-meta">${metaLine}</span>` : ""}
${calibration ? `<span class="checklist-calibration ${calibration.ok ? "is-ok" : "is-warning"}"><i data-lucide="${calibration.ok ? "check-circle" : "alert-triangle"}"></i>${calibration.text}</span>` : ""}
</div>
<button type="button" class="checklist-item-remove" data-action="remove" aria-label="Supprimer cet élément"><i data-lucide="x"></i></button>
</li>`;

}

function renderChecklistSection(app) {

const checklist = Array.isArray(app.checklist) ? app.checklist : [];
const { completed, total } = checklistScore(checklist);

const groups = Object.keys(CHECKLIST_TYPE_META).map((type) => {

const typeMeta = CHECKLIST_TYPE_META[type];
const items = checklist.filter((i) => i.type === type);

return `
<div class="checklist-group">
<div class="checklist-group-head">
<span><i data-lucide="${typeMeta.icon}"></i>${typeMeta.title}</span>
<button type="button" class="checklist-add-btn" data-action="add" data-type="${type}"><i data-lucide="plus"></i><span>${typeMeta.addLabel}</span></button>
</div>
${items.length ? `<ul class="checklist-items">${items.map(renderChecklistItem).join("")}</ul>` : `<p class="checklist-group-empty">Rien pour l'instant.</p>`}
${type === "recommendation" ? `<button type="button" class="checklist-guide-link" data-action="guide"><i data-lucide="book-open"></i><span>Guide : qui solliciter et comment</span></button>` : ""}
</div>`;

}).join("");

return `
<div class="app-checklist">
<button type="button" class="app-checklist-toggle" data-action="toggle-checklist">
<span><i data-lucide="clipboard-list"></i>Dossier de candidature</span>
${total > 0 ? `<span class="app-checklist-score">${completed}/${total} complété${completed > 1 ? "s" : ""}</span>` : `<span class="app-checklist-score is-empty">Ajouter les exigences de cette bourse</span>`}
<i data-lucide="chevron-down" class="app-checklist-chevron"></i>
</button>
<div class="checklist-groups" hidden>
${groups}
<a href="documents.html" class="checklist-guide-link"><i data-lucide="library"></i><span>Voir la bibliothèque de documents (passeport, diplôme, CV...)</span></a>
</div>
</div>`;

}

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
<span>Choisir ma formule</span>
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

<div class="app-card-documents">
<i data-lucide="mail"></i>
${app.generatedEmail
? `<span>E-mail Fitz généré pour cette candidature.</span><a href="ai-email.html?applicationId=${app.id}" class="app-doc-link">Revoir / régénérer</a>`
: `<span>Fitz peut rédiger un e-mail pour cette candidature.</span><a href="ai-email.html?applicationId=${app.id}" class="app-doc-link">Générer avec Fitz</a>`}
</div>

${renderChecklistSection(app)}

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

const checklistEl = card.querySelector(".app-checklist");
const checklistGroupsEl = checklistEl.querySelector(".checklist-groups");

checklistEl.querySelector('[data-action="toggle-checklist"]').addEventListener("click", () => {
checklistGroupsEl.hidden = !checklistGroupsEl.hidden;
checklistEl.classList.toggle("is-open", !checklistGroupsEl.hidden);
if (window.lucide) lucide.createIcons();
});

checklistEl.querySelectorAll('[data-action="add"]').forEach((btn) => {
btn.addEventListener("click", () => openChecklistModal(app, btn.dataset.type));
});

checklistEl.querySelectorAll('[data-action="cycle"]').forEach((btn) => {
btn.addEventListener("click", () => cycleChecklistStatus(app, btn.closest(".checklist-item").dataset.itemId));
});

checklistEl.querySelectorAll('[data-action="remove"]').forEach((btn) => {
btn.addEventListener("click", () => removeChecklistItem(app, btn.closest(".checklist-item").dataset.itemId));
});

checklistEl.querySelector('[data-action="guide"]')?.addEventListener("click", () => {
document.getElementById("recommendationGuideModal").hidden = false;
});

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

// ---------- Dossier de candidature (checklist) ----------

const checklistFieldsByType = {
recommendation: document.getElementById("clRecommendationFields"),
language_test: document.getElementById("clLanguageFields"),
financial_proof: document.getElementById("clFinancialFields")
};

let checklistContext = { app: null, type: null };

function openChecklistModal(app, type) {

checklistContext = { app, type };

const typeMeta = CHECKLIST_TYPE_META[type];

document.getElementById("checklistModalTitle").textContent = typeMeta.addLabel;
document.getElementById("clType").value = type;
document.getElementById("clItemId").value = "";
document.getElementById("clLabelCaption").textContent = type === "recommendation" ? "Nom du recommandant" : "Intitulé";
document.getElementById("clLabel").value = type === "language_test" ? "Test de langue" : type === "financial_proof" ? "Preuve financière" : "";
document.getElementById("clRecommenderContact").value = "";
document.getElementById("clTestName").value = "TOEFL";
document.getElementById("clTestDate").value = "";
document.getElementById("clScoreRequired").value = "";
document.getElementById("clScoreObtained").value = "";
document.getElementById("clAmountRequired").value = "";
document.getElementById("clFormatRequired").value = "";
document.getElementById("clStatus").value = "manquant";

Object.entries(checklistFieldsByType).forEach(([key, el]) => { el.hidden = key !== type; });

document.getElementById("checklistModal").hidden = false;

}

function closeChecklistModal() {
document.getElementById("checklistModal").hidden = true;
checklistContext = { app: null, type: null };
}

async function saveChecklist(app, newChecklist, eventType) {
await updateDoc(doc(db, "users", uid, "applications", app.id), { checklist: newChecklist, updatedAt: serverTimestamp() });
trackEvent("application_checklist_updated", { type: eventType || "unknown" });
await loadApplications();
}

async function cycleChecklistStatus(app, itemId) {
const checklist = Array.isArray(app.checklist) ? app.checklist : [];
const newChecklist = checklist.map((i) => (i.id === itemId ? { ...i, status: nextChecklistStatus(i.status) } : i));
await saveChecklist(app, newChecklist, "status_cycle");
}

async function removeChecklistItem(app, itemId) {
const checklist = Array.isArray(app.checklist) ? app.checklist : [];
const newChecklist = checklist.filter((i) => i.id !== itemId);
await saveChecklist(app, newChecklist, "remove");
}

document.getElementById("checklistForm").addEventListener("submit", async (event) => {

event.preventDefault();

const { app, type } = checklistContext;
if (!app || !type) return;

const label = document.getElementById("clLabel").value.trim();
if (!label) return;

const item = {
id: makeChecklistItemId(),
type,
label,
status: document.getElementById("clStatus").value,
meta: {}
};

if (type === "recommendation") {
item.meta.recommenderContact = document.getElementById("clRecommenderContact").value.trim();
} else if (type === "language_test") {
item.meta.testName = document.getElementById("clTestName").value;
item.meta.testDate = document.getElementById("clTestDate").value || "";
item.meta.scoreRequired = document.getElementById("clScoreRequired").value.trim();
item.meta.scoreObtained = document.getElementById("clScoreObtained").value.trim();
} else if (type === "financial_proof") {
item.meta.amountRequired = document.getElementById("clAmountRequired").value.trim();
item.meta.formatRequired = document.getElementById("clFormatRequired").value.trim();
}

const newChecklist = [...(Array.isArray(app.checklist) ? app.checklist : []), item];

await saveChecklist(app, newChecklist, type);

closeChecklistModal();

});

document.getElementById("checklistModalClose").addEventListener("click", closeChecklistModal);
document.getElementById("checklistCancelBtn").addEventListener("click", closeChecklistModal);

document.getElementById("checklistModal").addEventListener("click", (event) => {
if (event.target === document.getElementById("checklistModal")) closeChecklistModal();
});

// ---------- Guide lettres de recommandation (contenu statique) ----------

document.getElementById("recommendationGuideClose").addEventListener("click", () => {
document.getElementById("recommendationGuideModal").hidden = true;
});

document.getElementById("recommendationGuideModal").addEventListener("click", (event) => {
if (event.target === document.getElementById("recommendationGuideModal")) document.getElementById("recommendationGuideModal").hidden = true;
});

document.getElementById("copyRecommendationTemplateBtn").addEventListener("click", async () => {

const text = document.getElementById("recommendationTemplateText").value;
const btn = document.getElementById("copyRecommendationTemplateBtn");
const span = btn.querySelector("span");
const original = span.textContent;

try {
await navigator.clipboard.writeText(text);
span.textContent = "Copié !";
} catch (error) {
span.textContent = "Sélectionnez le texte manuellement";
} finally {
setTimeout(() => { span.textContent = original; }, 1800);
}

});

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

// Arrivée depuis payment.js après activation de "Premier Dossier"
// (?action=new, voir POST_ACTIVATION_TARGETS) : ouvre directement le
// formulaire plutôt que de laisser l'étudiant chercher le bouton
// "Ajouter" — mais seulement si le quota le permet encore (même
// vérification qu'à l'enregistrement, isQuotaReached), sinon on laisse
// la page se charger normalement. L'URL est nettoyée pour qu'un
// rechargement ou un lien partagé ne rouvre pas le formulaire à chaque
// fois.
function maybeAutoOpenNewApplication() {

const shouldOpen = new URLSearchParams(window.location.search).get("action") === "new";

if (!shouldOpen) return;

window.history.replaceState({}, "", window.location.pathname);

const plan = window.SCHOLARBRIDGE_PLANS && window.SCHOLARBRIDGE_PLANS[planId];
const quota = plan ? plan.maxAccompaniedApplications : null;

if (isQuotaReached(quota, applications.length)) return;

openModal(null);

}

loadApplications().then(maybeAutoOpenNewApplication);

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
