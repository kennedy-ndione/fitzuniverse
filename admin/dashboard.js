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
getUserStats,
getUniversitiesCount,
getScholarshipsCount,
getAnalyticsTotals,
getTodayCounters,
getPlanBreakdown,
getTopCountries,
getTopUniversities
} from "./firebase-admin.js";

import { initSidebarToggle } from "./sidebar-toggle.js";
import { PLAN_LABELS } from "../js/plan-features.js";
import { hidePageLoader } from "../js/app-shell.js";

initSidebarToggle();

// ==========================================================
// Formatage
// ==========================================================

function formatNumber(value) {
return new Intl.NumberFormat("fr-FR").format(value || 0);
}

// ==========================================================
// Identité de l'administrateur — dérivée du document admins/{uid}
// déjà lu par la vérification d'accès (aucune requête Firebase
// supplémentaire). Une simple chaîne de repli si aucun champ nom
// n'a été renseigné dans la console Firebase.
// ==========================================================

function resolveAdminName(adminData, firebaseUser) {

if (adminData.name) return adminData.name;
if (adminData.fullName) return adminData.fullName;
if (adminData.displayName) return adminData.displayName;
if (firebaseUser.displayName) return firebaseUser.displayName;

const email = adminData.email || firebaseUser.email || "";
const localPart = email.split("@")[0].replace(/[0-9._-]+/g, " ").trim();

if (localPart) {
return localPart.replace(/\b\w/g, (c) => c.toUpperCase());
}

return "Administrateur";

}

function resolveFirstName(fullName) {
return String(fullName).trim().split(/\s+/)[0];
}

function getInitials(fullName) {

const parts = String(fullName).trim().split(/\s+/).filter(Boolean);

if (!parts.length) return "?";

return (parts[0][0] + (parts[1] ? parts[1][0] : "")).toUpperCase();

}

function humanizeRole(role) {

if (!role) return "Administrateur";

return String(role)
.replace(/[-_]+/g, " ")
.replace(/\b\w/g, (c) => c.toUpperCase());

}

function timeOfDayGreeting() {

const hour = new Date().getHours();

if (hour < 12) return "Bonjour";
if (hour < 18) return "Bon après-midi";

return "Bonsoir";

}

// ==========================================================
// Hero exécutif — identité, salutation, briefing, badges d'état
// ==========================================================

function renderExecHero({ adminData, firebaseUser, universitiesCount, scholarshipsCount, userStats }) {

const fullName = resolveAdminName(adminData, firebaseUser);
const firstName = resolveFirstName(fullName);
const role = humanizeRole(adminData.role);

const avatar = document.getElementById("execAvatar");

if (adminData.photoURL || firebaseUser.photoURL) {
avatar.innerHTML = `<img src="${adminData.photoURL || firebaseUser.photoURL}" alt="${fullName}">`;
} else {
avatar.textContent = getInitials(fullName);
}

document.getElementById("execGreeting").textContent = `${timeOfDayGreeting()} ${firstName}`;
document.getElementById("execRole").textContent = `${role} • ScholarBridge`;

const alertNote = userStats.newToday > 0
? `${userStats.newToday} nouvel${userStats.newToday > 1 ? "les" : ""} étudiant${userStats.newToday > 1 ? "s" : ""} aujourd'hui`
: "aucune nouvelle alerte aujourd'hui";

document.getElementById("execBriefing").textContent =
`Voici l'état actuel de ScholarBridge : ${formatNumber(userStats.total)} étudiant${userStats.total > 1 ? "s" : ""} inscrit${userStats.total > 1 ? "s" : ""}, ${formatNumber(universitiesCount)} universités disponibles, ${formatNumber(scholarshipsCount)} bourses publiées, ${alertNote}.`;

}

function renderStatusBadges() {

const now = new Date();

const dateLabel = now.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });

const badges = [
{ icon: "calendar", text: dateLabel },
{ icon: "clock", text: now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }), id: "execClockBadge" },
{ icon: "refresh-cw", text: "Synchronisé à l'instant" },
{ icon: "database", text: "Firestore", dot: "is-online" },
{ icon: "bar-chart-3", text: "Analytics", dot: "is-online" },
{ icon: "bot", text: "Fitz", dot: "is-pending" },
{ icon: "wallet", text: "PayDunya", dot: "is-pending" }
];

const container = document.getElementById("execStatusBadges");
container.innerHTML = "";

badges.forEach((badge) => {

const el = document.createElement("span");
el.className = "exec-badge";
if (badge.id) el.id = badge.id;

el.innerHTML = badge.dot
? `<span class="status-dot ${badge.dot}"></span><span></span>`
: `<i data-lucide="${badge.icon}"></i><span></span>`;

el.querySelector("span:last-child").textContent = badge.text;

container.appendChild(el);

});

// Horloge vivante, purement décorative (aucune donnée Firebase).
setInterval(() => {

const clockBadge = document.getElementById("execClockBadge");

if (clockBadge) {
clockBadge.querySelector("span:last-child").textContent =
new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

}, 30000);

}

// ==========================================================
// Vue d'ensemble du jour
// ==========================================================

function renderOverviewChecklist({ userStats, universitiesCount, scholarshipsCount, totals }) {

const items = [

{
done: userStats.newToday > 0,
title: "Nouvel étudiant",
text: userStats.newToday > 0
? `${userStats.newToday} inscription${userStats.newToday > 1 ? "s" : ""} aujourd'hui`
: "Aucune inscription aujourd'hui pour le moment"
},
{
done: universitiesCount > 0,
title: "Universités actives",
text: `${formatNumber(universitiesCount)} au catalogue`
},
{
done: scholarshipsCount > 0,
title: "Bourses disponibles",
text: `${formatNumber(scholarshipsCount)} publiées`
},
{
done: (totals.payment_attempted || 0) > 0,
title: "Paiements",
text: (totals.payment_attempted || 0) > 0
? `${formatNumber(totals.payment_attempted)} tentative(s) enregistrée(s)`
: "En attente du backend PayDunya (Phase 1)"
},
{
done: (totals.letter_generated || 0) + (totals.email_generated || 0) + (totals.verification_run || 0) + (totals.translation_run || 0) > 0,
title: "IA",
text: "Fitz aujourd'hui : lettres, e-mails, vérifications et traductions confondus"
},
{
done: false,
title: "Documents",
text: "S'activera dès la synchronisation des documents générés (hors périmètre actuel)"
}

];

const container = document.getElementById("overviewChecklist");
container.innerHTML = "";

items.forEach((item) => {

const el = document.createElement("div");
el.className = "overview-item";

el.innerHTML = `
<span class="overview-item-mark ${item.done ? "is-done" : "is-idle"}"><i data-lucide="${item.done ? "check" : "minus"}"></i></span>
<div class="overview-item-text"><strong></strong><span></span></div>
`;

el.querySelector("strong").textContent = item.title;
el.querySelector(".overview-item-text span").textContent = item.text;

container.appendChild(el);

});

}

// ==========================================================
// Cartes de statistiques
// ==========================================================

// Une carte "réelle" affiche un chiffre calculé à partir de données
// Firestore existantes. Une carte "en attente" reste honnête tant
// que l'infrastructure nécessaire (paiement réel, Fitz...) n'est
// pas branchée — jamais de chiffre inventé (voir js/analytics.js).
function renderStatCard({ icon, label, value, pending, pendingNote, size }) {

const card = document.createElement("div");

const classes = ["stat-card"];
if (pending) classes.push("is-pending");
if (size) classes.push(`is-${size}`);

card.className = classes.join(" ");

card.innerHTML = `
<div class="stat-card-icon"><i data-lucide="${icon}"></i></div>
<div>
<div class="stat-card-value"></div>
<div class="stat-card-label"></div>
${pending ? `<div class="stat-card-pending-note"></div>` : ""}
</div>
`;

card.querySelector(".stat-card-value").textContent = pending ? "—" : formatNumber(value);
card.querySelector(".stat-card-label").textContent = label;

if (pending) {
card.querySelector(".stat-card-pending-note").textContent = pendingNote;
}

return card;

}

function renderStatsGrid({ userStats, universitiesCount, scholarshipsCount, totals }) {

const grid = document.getElementById("statsGrid");
grid.innerHTML = "";

const cards = [

{ icon: "users", label: "Étudiants inscrits", value: userStats.total, size: "featured" },
{ icon: "user-plus", label: "Nouveaux aujourd'hui", value: userStats.newToday, size: "accent" },
{ icon: "landmark", label: "Universités au catalogue", value: universitiesCount },
{ icon: "graduation-cap", label: "Bourses au catalogue", value: scholarshipsCount },

{ icon: "eye", label: "Bourses consultées", value: totals.scholarship_viewed, size: "tall" },
{ icon: "building-2", label: "Universités consultées", value: totals.university_viewed },
{ icon: "pen-line", label: "Lettres générées", value: totals.letter_generated },
{ icon: "mail", label: "E-mails générés", value: totals.email_generated },
{ icon: "shield-check", label: "Vérifications de dossier", value: totals.verification_run },
{ icon: "languages", label: "Traductions effectuées", value: totals.translation_run },
{ icon: "credit-card", label: "Tentatives de paiement", value: totals.payment_attempted, size: "wide" },

{
icon: "wallet", label: "Revenus réels", pending: true,
pendingNote: "S'activera automatiquement dès que le paiement PayDunya réel sera branché (voir feuille de route Phase 1)."
},
{
icon: "bot", label: "Conversations Fitz", pending: true,
pendingNote: "S'activera automatiquement dès que le vrai backend Fitz (Phase 1) sera branché."
}

];

cards.forEach((card) => grid.appendChild(renderStatCard(card)));

if (window.lucide) lucide.createIcons();

}

// ==========================================================
// Observations IA — synthèse en langage naturel des chiffres déjà
// calculés (aucune nouvelle source de données).
// ==========================================================

function renderAiObservations({ userStats, totals }) {

const el = document.getElementById("aiObservationText");

const activitySum = (totals.letter_generated || 0) + (totals.email_generated || 0) +
(totals.verification_run || 0) + (totals.translation_run || 0);

let text;

if (userStats.total === 0) {
text = "ScholarBridge n'a pas encore d'étudiant inscrit. Les statistiques commenceront à évoluer dès l'arrivée des premiers comptes.";
} else if (userStats.newToday === 0 && activitySum === 0) {
text = "Aucune anomalie détectée aujourd'hui. Le nombre d'inscriptions est stable — aucune activité inhabituelle à signaler.";
} else if (userStats.newToday > 0) {
text = `Activité positive aujourd'hui : ${userStats.newToday} nouvel${userStats.newToday > 1 ? "les" : ""} inscription${userStats.newToday > 1 ? "s" : ""} et ${activitySum} action${activitySum > 1 ? "s" : ""} Fitz enregistrée${activitySum > 1 ? "s" : ""}. Rien d'anormal à signaler.`;
} else {
text = `Aucune nouvelle inscription aujourd'hui, mais ${activitySum} action${activitySum > 1 ? "s" : ""} Fitz enregistrée${activitySum > 1 ? "s" : ""} au total. Aucune anomalie détectée.`;
}

el.textContent = text;

}

// ==========================================================
// Graphique des inscriptions (30 derniers jours)
// ==========================================================

function buildLast30Days() {

const days = [];

for (let i = 29; i >= 0; i--) {

const d = new Date();
d.setDate(d.getDate() - i);
days.push(d.toISOString().slice(0, 10));

}

return days;

}

function renderSignupsChart(todayCounters) {

const days = buildLast30Days();

// Le futur module "Statistiques IA avancées" lira l'historique complet
// des compteurs quotidiens ; pour ce premier tableau de bord, on ne
// lit que le jour courant (déjà disponible) et on affiche les jours
// précédents à 0 tant qu'aucun historique n'a été accumulé — honnête
// plutôt que d'inventer une courbe.
const todayKey = new Date().toISOString().slice(0, 10);

const values = days.map((day) => (day === todayKey ? (todayCounters.signup || 0) : 0));

const ctx = document.getElementById("signupsChart");
const emptyState = document.getElementById("signupsChartEmpty");

const hasData = values.some((v) => v > 0);

if (emptyState) emptyState.hidden = hasData;

if (!ctx || !window.Chart) return;

new Chart(ctx, {
type: "line",
data: {
labels: days.map((d) => d.slice(5)),
datasets: [{
label: "Inscriptions",
data: values,
borderColor: "#D4A24C",
backgroundColor: "rgba(212,162,76,.15)",
tension: .35,
fill: true,
pointRadius: 0
}]
},
options: {
responsive: true,
plugins: { legend: { display: false } },
scales: {
x: { ticks: { color: "#8792A8", maxTicksLimit: 8 }, grid: { display: false } },
y: { ticks: { color: "#8792A8", precision: 0 }, grid: { color: "rgba(255,255,255,.06)" } }
}
}
});

}

// ==========================================================
// Graphique de répartition par formule
// ==========================================================

async function renderPlanChart() {

const breakdown = await getPlanBreakdown();
const planIds = Object.keys(PLAN_LABELS);

const ctx = document.getElementById("planChart");
const emptyState = document.getElementById("planChartEmpty");

const total = planIds.reduce((sum, id) => sum + (breakdown[id] || 0), 0);

if (emptyState) emptyState.hidden = total > 0;

if (!ctx || !window.Chart) return;

new Chart(ctx, {
type: "doughnut",
data: {
labels: planIds.map((id) => PLAN_LABELS[id]),
datasets: [{
data: planIds.map((id) => breakdown[id] || 0),
backgroundColor: ["#94A3B8", "#8B1E3F", "#B23358", "#D4A24C"],
borderColor: "#1E293B",
borderWidth: 2
}]
},
options: {
responsive: true,
plugins: {
legend: { position: "bottom", labels: { color: "#C2CBDE", boxWidth: 12 } }
}
}
});

}

// ==========================================================
// Tops (pays / universités)
// ==========================================================

function renderTopList(containerId, items) {

const container = document.getElementById(containerId);
container.innerHTML = "";

if (!items.length) {
container.innerHTML = `<p class="top-list-empty">Aucune donnée pour le moment — s'alimentera automatiquement au fil des consultations.</p>`;
return;
}

items.forEach((item, index) => {

const row = document.createElement("div");
row.className = "top-list-row";

row.innerHTML = `
<span class="top-list-rank"></span>
<span class="top-list-label"></span>
<span class="top-list-count"></span>
`;

row.querySelector(".top-list-rank").textContent = index + 1;
row.querySelector(".top-list-label").textContent = item.label;
row.querySelector(".top-list-count").textContent = formatNumber(item.count);

container.appendChild(row);

});

}

// ==========================================================
// Chronologie d'activité — construite uniquement à partir de
// données déjà récupérées ailleurs sur cette page (aucune requête
// Firebase supplémentaire) : honnête plutôt qu'inventée.
// ==========================================================

function renderActivityTimeline({ userStats, todayCounters }) {

const container = document.getElementById("activityTimeline");
container.innerHTML = "";

const entries = [];

entries.push({
label: "Connexion administrateur",
meta: "Aujourd'hui — à l'instant"
});

if (userStats.newToday > 0) {
entries.push({
label: `${userStats.newToday} nouvel${userStats.newToday > 1 ? "les" : ""} étudiant${userStats.newToday > 1 ? "s" : ""} inscrit${userStats.newToday > 1 ? "s" : ""}`,
meta: "Aujourd'hui"
});
}

const activitySum = (todayCounters.letter_generated || 0) + (todayCounters.email_generated || 0) +
(todayCounters.verification_run || 0) + (todayCounters.translation_run || 0);

if (activitySum > 0) {
entries.push({
label: `${activitySum} action${activitySum > 1 ? "s" : ""} Fitz enregistrée${activitySum > 1 ? "s" : ""}`,
meta: "Aujourd'hui"
});
}

if (entries.length === 1) {
entries.push({
label: "En attente des premières activités étudiantes",
meta: "Cette chronologie se remplira automatiquement"
});
}

entries.forEach((entry) => {

const row = document.createElement("div");
row.className = "timeline-item";

row.innerHTML = `
<span class="timeline-dot"></span>
<div class="timeline-body">
<div class="timeline-label"></div>
<div class="timeline-meta"></div>
</div>
`;

row.querySelector(".timeline-label").textContent = entry.label;
row.querySelector(".timeline-meta").textContent = entry.meta;

container.appendChild(row);

});

}

// ==========================================================
// Infrastructure — état des services. Dérivé de faits déjà connus
// à ce stade du code (si on atteint ce rendu, Firestore/Auth ont
// déjà répondu avec succès) plutôt que de nouveaux appels réseau ;
// Fitz et PayDunya restent honnêtement "en attente" tant que
// leurs backends réels ne sont pas branchés (voir js/ai/ai-client.js
// et payment.js).
// ==========================================================

function renderInfraGrid() {

const services = [
{ icon: "flame", name: "Firebase", status: "is-online", label: "Actif" },
{ icon: "database", name: "Firestore", status: "is-online", label: "Actif" },
{ icon: "hard-drive", name: "Storage", status: "is-pending", label: "Configuré, non utilisé" },
{ icon: "key-round", name: "Authentication", status: "is-online", label: "Actif" },
{ icon: "bar-chart-3", name: "Analytics", status: "is-online", label: "Actif" },
{ icon: "bot", name: "Fitz", status: "is-pending", label: "En attente" },
{ icon: "wallet", name: "PayDunya", status: "is-pending", label: "En attente" }
];

const container = document.getElementById("infraGrid");
container.innerHTML = "";

services.forEach((service) => {

const row = document.createElement("div");
row.className = "infra-item";

row.innerHTML = `
<span class="infra-item-name"><i data-lucide="${service.icon}"></i><span></span></span>
<span class="infra-status ${service.status}"><span class="status-dot"></span><span></span></span>
`;

row.querySelector(".infra-item-name span").textContent = service.name;
row.querySelector(".infra-status span:last-child").textContent = service.label;

container.appendChild(row);

});

}

// ==========================================================
// Chargement principal
// ==========================================================

const pageLoader = document.getElementById("pageLoader");
const dashboardContent = document.querySelector(".content");

onAuthStateChanged(auth, async (user) => {

if (!user) {
window.location.href = "login.html";
return;
}

try {

const adminSnap = await getDoc(doc(db, "admins", user.uid));

if (!adminSnap.exists() || adminSnap.data().isActive !== true) {
await signOut(auth);
window.location.href = "login.html";
return;
}

const adminData = adminSnap.data();

const [userStats, universitiesCount, scholarshipsCount, totals, todayCounters] = await Promise.all([
getUserStats(),
getUniversitiesCount(),
getScholarshipsCount(),
getAnalyticsTotals(),
getTodayCounters()
]);

renderExecHero({ adminData, firebaseUser: user, universitiesCount, scholarshipsCount, userStats });
renderStatusBadges();
renderOverviewChecklist({ userStats, universitiesCount, scholarshipsCount, totals });
renderStatsGrid({ userStats, universitiesCount, scholarshipsCount, totals });
renderAiObservations({ userStats, totals });
renderActivityTimeline({ userStats, todayCounters });
renderInfraGrid();

renderSignupsChart(todayCounters);

await Promise.all([
renderPlanChart(),
getTopCountries(6).then((items) => renderTopList("topCountriesList", items)),
getTopUniversities(6).then((items) => renderTopList("topUniversitiesList", items))
]);

if (window.lucide) lucide.createIcons();

hidePageLoader();

} catch (error) {

console.error("Erreur de chargement du Control Center :", error);

if (dashboardContent) {
dashboardContent.style.display = "";
dashboardContent.innerHTML = `
<div style="padding:40px;text-align:center;">
<h2>Impossible de charger le Control Center</h2>
<p>Vérifiez votre connexion Internet, puis réessayez.</p>
<button onclick="window.location.reload()">Réessayer</button>
</div>
`;
}

if (pageLoader) pageLoader.style.display = "none";

}

});

// ==========================================================
// Déconnexion
// ==========================================================

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
alert("Erreur lors de la déconnexion.");
logoutBtn.dataset.busy = "false";

}

});

}
