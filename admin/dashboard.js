import { auth, db } from "../firebase-config.js";

import {
onAuthStateChanged,
signOut
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
doc,
getDoc,
getDocs,
collection,
query,
orderBy,
limit
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import {
getUserStats,
getUniversitiesCount,
getScholarshipsCount,
getAnalyticsTotals,
getTodayCounters,
getDailyCounterHistory,
getRecentEvents,
getPlanBreakdown,
getTopCountries,
getTopUniversities,
getBlocagesFrequents
} from "./firebase-admin.js";

import { initSidebarToggle } from "./sidebar-toggle.js";
// Lot ADMIN-JOURNÉE (2026-09-20) : les piles de travail du jour, rendues
// APRÈS le premier affichage (voir l'appel plus bas) — le tableau de
// bord ne doit pas attendre leurs agrégations pour se montrer.
import { initJournee } from "./journee.js";
// Lot FINITIONS-VISUELLES (2026-09-11) : le graphique par formule nomme
// chaque identifiant avec l'étiquette de l'admin et couvre AUSSI le Pass
// et les offres France (les compteurs analyticsPlanCounters/{planId} sont
// écrits pour tout `plan` d'un payment_attempted, France comprise).
import { tousLesIdentifiants, etiquetteAdmin } from "../js/formules-admin.js";
import { PLAN_LABELS } from "../js/plan-features.js";
import { hidePageLoader } from "../js/app-shell.js";
// Lot ADMIN-SAIT-TOUT (2026-09-23) : l'état de Fitz se lit dans la
// constante que le site lui-même utilise, jamais dans une étiquette
// écrite à la main qui vieillit sans que personne ne le voie.
import { MODE as MODE_FITZ } from "../js/ai/ai-config.js";

initSidebarToggle();

// ==========================================================
// CE QUE L'ADMIN DOIT SAVOIR DU PAIEMENT (lot ADMIN-SAIT-TOUT,
// 2026-09-23). Les moyens RÉELLEMENT proposés à l'étudiant, tels que
// payment.html les affiche. Quand PayDunya ouvrira Wave et la carte
// (voir le commentaire « MOYENS DE PAIEMENT BIENTÔT » de payment.html),
// mettre cette ligne à jour EN MÊME TEMPS que la page de paiement.
// ==========================================================
const MOYENS_DE_PAIEMENT_OUVERTS = "Orange Money (Wave et carte : à la validation du compte PayDunya)";

// ==========================================================
// Palette des graphiques — REFONTE CLAIRE 2026-09-02 : plus aucun
// bleu/slate. Encre chaude pour les axes, ambre pour la série
// principale, violet réservé aux séries où Fitz/l'étudiant est
// l'acteur (même doctrine que DESIGN_SYSTEM.md, section Icônes).
// ==========================================================

const CHART_TEXT = "#6E6760";
const CHART_GRID = "rgba(26,23,20,.07)";

// Les cinq séries de la pulsation. `fields` liste les compteurs
// quotidiens (analyticsDailyCounters) additionnés pour chaque jour.
const PULSE_SERIES = [
// Lot ADMIN-SAIT-TOUT (2026-09-23) : des PERSONNES, une fois par jour
// et par navigateur (js/analytics.js, compterVisiteurDuJour). C'est la
// série principale ; « Entrées » compte les sessions (une personne
// peut en faire plusieurs dans la journée).
{
key: "visiteurs",
label: "Visiteurs",
color: "#E9A319",
fields: ["visiteurs"],
fill: true
},
{
key: "entrees",
label: "Entrées (sessions)",
color: "#C9860B",
fields: ["visit", "signup", "login"]
},
{
key: "sorties",
label: "Sorties",
color: "#8A837A",
fields: ["logout"]
},
{
key: "interactions",
label: "Interactions étudiantes",
color: "#7E71D8",
fields: [
"ai_chat_message_sent", "advisor_request_sent", "admin_message_sent",
"letter_generated", "email_generated", "verification_run", "translation_run"
]
},
{
key: "admissions",
label: "Admissions",
color: "#16A34A",
fields: ["application_admitted"]
},
{
key: "refus",
label: "Refus",
color: "#DC2626",
fields: ["application_rejected"]
}
];

// État du panneau « pulsation » : période affichée, séries visibles,
// mode aperçu démo (données simulées, clairement étiquetées).
const pulseState = {
days: 30,
demo: false,
hidden: new Set(),
history: {}
};

let pulseChart = null;
let planChart = null;

// ==========================================================
// Formatage
// ==========================================================

function formatNumber(value) {
return new Intl.NumberFormat("fr-FR").format(value || 0);
}

// ==========================================================
// Identité de l'administrateur — dérivée du document admins/{uid}
// déjà lu par la vérification d'accès (aucune requête Firebase
// supplémentaire).
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
document.getElementById("execRole").textContent = `${role} • Fitz`;

const alertNote = userStats.newToday > 0
? `${userStats.newToday} nouvel${userStats.newToday > 1 ? "les" : ""} étudiant${userStats.newToday > 1 ? "s" : ""} aujourd'hui`
: "aucune nouvelle alerte aujourd'hui";

document.getElementById("execBriefing").textContent =
`Voici l'état actuel de Fitz : ${formatNumber(userStats.total)} étudiant${userStats.total > 1 ? "s" : ""} inscrit${userStats.total > 1 ? "s" : ""}, ${formatNumber(universitiesCount)} universités disponibles, ${formatNumber(scholarshipsCount)} bourses publiées, ${alertNote}.`;

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
{ icon: "bot", text: "Fitz", dot: MODE_FITZ === "passerelle" ? "is-online" : "is-pending" },
{ icon: "wallet", text: "PayDunya", dot: "is-online" }
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
// PULSATION DU SITE — la grande courbe évolutive multi-séries
// ==========================================================

function buildLastDays(n) {

const days = [];

for (let i = n - 1; i >= 0; i--) {

const d = new Date();
d.setDate(d.getDate() - i);
days.push(d.toISOString().slice(0, 10));

}

return days;

}

// Générateur démo DÉTERMINISTE (même graine → même courbe, pour que
// l'aperçu ne « saute » pas à chaque re-rendu). Jamais mélangé aux
// données réelles : soit tout réel, soit tout simulé + bandeau.
function demoValue(serieKey, dayIndex, totalDays) {

let seed = 0;
for (const c of serieKey) seed += c.charCodeAt(0);

const wave = Math.sin((dayIndex + seed) / 3.1) + Math.sin((dayIndex + seed * 2) / 7.3);
const trend = dayIndex / totalDays;

const base = {
visiteurs: 18 + trend * 22,
entrees: 26 + trend * 30,
sorties: 9 + trend * 9,
interactions: 15 + trend * 22,
admissions: 2 + trend * 5,
refus: 1 + trend * 3
}[serieKey] || 5;

return Math.max(0, Math.round(base + wave * base * 0.32));

}

function realValue(serie, dayKey) {

const counters = pulseState.history[dayKey];

if (!counters) return 0;

return serie.fields.reduce((sum, field) => sum + (counters[field] || 0), 0);

}

function pulseDatasets(days) {

return PULSE_SERIES
.filter((serie) => !pulseState.hidden.has(serie.key))
.map((serie) => ({
label: serie.label,
data: days.map((dayKey, i) => pulseState.demo
? demoValue(serie.key, i, days.length)
: realValue(serie, dayKey)),
borderColor: serie.color,
backgroundColor: serie.fill ? `${serie.color}26` : "transparent",
fill: !!serie.fill,
tension: .38,
borderWidth: 2.5,
pointRadius: 0,
pointHoverRadius: 4,
pointHoverBackgroundColor: serie.color
}));

}

function renderPulseChart() {

const days = buildLastDays(pulseState.days);
const datasets = pulseDatasets(days);

const emptyState = document.getElementById("pulseChartEmpty");
const hasData = pulseState.demo || datasets.some((ds) => ds.data.some((v) => v > 0));

if (emptyState) emptyState.hidden = hasData;

const canvas = document.getElementById("pulseChart");

if (!canvas || !window.Chart) return;

const labels = days.map((d) => {
const [, m, j] = d.split("-");
return `${j}/${m}`;
});

if (pulseChart) {

pulseChart.data.labels = labels;
pulseChart.data.datasets = datasets;
pulseChart.update();

} else {

pulseChart = new Chart(canvas, {
type: "line",
data: { labels, datasets },
options: {
responsive: true,
maintainAspectRatio: false,
interaction: { mode: "index", intersect: false },
plugins: {
legend: { display: false },
tooltip: {
backgroundColor: "#211D18",
titleColor: "#F5F0E7",
bodyColor: "#F5F0E7",
borderColor: "rgba(233,163,25,.4)",
borderWidth: 1,
padding: 12,
cornerRadius: 10
}
},
scales: {
x: { ticks: { color: CHART_TEXT, maxTicksLimit: 10 }, grid: { display: false } },
y: { beginAtZero: true, ticks: { color: CHART_TEXT, precision: 0 }, grid: { color: CHART_GRID } }
}
}
});

}

}

function renderSerieChips() {

const container = document.getElementById("serieChips");
container.innerHTML = "";

PULSE_SERIES.forEach((serie) => {

const off = pulseState.hidden.has(serie.key);

const chip = document.createElement("button");
chip.type = "button";
chip.className = `serie-chip ${off ? "is-off" : "is-active"}`;
chip.style.setProperty("--serie-color", serie.color);
chip.setAttribute("aria-pressed", String(!off));

chip.innerHTML = `<span class="serie-dot"></span><span></span>`;
chip.querySelector("span:last-child").textContent = serie.label;

chip.addEventListener("click", () => {

if (pulseState.hidden.has(serie.key)) {
pulseState.hidden.delete(serie.key);
} else {
pulseState.hidden.add(serie.key);
}

renderSerieChips();
renderPulseChart();

});

container.appendChild(chip);

});

}

function initPulseControls() {

// Période 7 / 30 / 90 jours.
document.querySelectorAll("#pulseRange .seg-btn").forEach((btn) => {

btn.addEventListener("click", () => {

document.querySelectorAll("#pulseRange .seg-btn").forEach((b) => b.classList.remove("is-active"));
btn.classList.add("is-active");

pulseState.days = parseInt(btn.dataset.days, 10);
renderPulseChart();
renderChemins(pulseState.totals);
renderVisiteurs();

});

});

// Bascule « Aperçu démo » — le bandeau reste visible tant que le
// mode est actif : impossible de confondre simulé et réel.
const toggle = document.getElementById("demoToggle");
const banner = document.getElementById("demoBanner");

toggle.addEventListener("click", () => {

pulseState.demo = !pulseState.demo;

toggle.classList.toggle("is-on", pulseState.demo);
toggle.setAttribute("aria-pressed", String(pulseState.demo));
banner.hidden = !pulseState.demo;

renderPulseChart();

});

}

function renderPulseFootnote() {

const el = document.getElementById("pulseFootnote");
const trackedDays = Object.keys(pulseState.history).length;

el.textContent = trackedDays > 0
? `Compteurs quotidiens écrits en continu par le site (js/analytics.js) — ${trackedDays} jour${trackedDays > 1 ? "s" : ""} d'historique déjà accumulé${trackedDays > 1 ? "s" : ""}.`
: "Compteurs quotidiens écrits en continu par le site (js/analytics.js) — l'historique commence à s'accumuler dès aujourd'hui.";

}

// ==========================================================
// Issues de candidatures
// ==========================================================

function renderOutcomeStrip(totals) {

document.getElementById("outcomeAdmitted").textContent = formatNumber(totals.application_admitted);
document.getElementById("outcomeRejected").textContent = formatNumber(totals.application_rejected);
document.getElementById("outcomeWaitlisted").textContent = formatNumber(totals.application_waitlisted);

}

// ==========================================================
// Cartes de statistiques
// ==========================================================

// Somme d'un champ de compteur sur les N derniers jours de
// l'historique déjà chargé (0 lecture supplémentaire).
function sumLastDays(fields, nDays) {

const days = buildLastDays(nDays);

return days.reduce((total, dayKey) => {

const counters = pulseState.history[dayKey];
if (!counters) return total;

return total + fields.reduce((s, f) => s + (counters[f] || 0), 0);

}, 0);

}

function renderStatCard({ icon, label, value, pending, pendingNote, size, delta }) {

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
${delta ? `<div class="stat-card-delta ${delta.dir === "up" ? "is-up" : ""}"><i data-lucide="${delta.dir === "up" ? "trending-up" : "minus"}"></i><span></span></div>` : ""}
${pending ? `<div class="stat-card-pending-note"></div>` : ""}
</div>
`;

card.querySelector(".stat-card-value").textContent = pending ? "—" : formatNumber(value);
card.querySelector(".stat-card-label").textContent = label;

if (delta) {
card.querySelector(".stat-card-delta span").textContent = delta.text;
}

if (pending) {
card.querySelector(".stat-card-pending-note").textContent = pendingNote;
}

return card;

}

function weekDelta(fields) {

const week = sumLastDays(fields, 7);

return week > 0
? { dir: "up", text: `+${formatNumber(week)} sur 7 jours` }
: { dir: "flat", text: "stable sur 7 jours" };

}

// Lot PORTES-COULEUR (2026-09-11) : les trois chemins de l'accueil —
// total depuis le lancement, et somme sur la période de la pulsation
// (pulseState.days), lue dans l'historique quotidien déjà chargé.
const CHEMINS_ACCUEIL = [
{ type: "porte_bourse", label: "Trouver une bourse" },
{ type: "porte_preinscription", label: "Partir en me finançant" },
{ type: "porte_diagnostic", label: "Le diagnostic gratuit" }
];

function renderChemins(totals) {
const container = document.getElementById("cheminsList");
if (!container) return;
pulseState.totals = totals || pulseState.totals || {};
const jours = buildLastDays(pulseState.days);
const lignes = CHEMINS_ACCUEIL.map((c) => ({
...c,
total: Number(pulseState.totals[c.type] || 0),
periode: jours.reduce((somme, j) => somme + Number((pulseState.history || {})[j]?.[c.type] || 0), 0)
}));
container.innerHTML = "";
if (!lignes.some((l) => l.total)) {
container.innerHTML = `<p class="top-list-empty">Aucun clic enregistré pour l'instant.</p>`;
return;
}
lignes.forEach((l) => {
const row = document.createElement("div");
row.className = "top-list-row";
row.innerHTML = `<span class="top-list-rank"></span><span class="top-list-label"></span><span class="top-list-count"></span>`;
row.querySelector(".top-list-rank").textContent = "·";
row.querySelector(".top-list-label").textContent = l.label;
row.querySelector(".top-list-count").textContent = `${formatNumber(l.total)} (${formatNumber(l.periode)} sur ${pulseState.days} j)`;
container.appendChild(row);
});
}

function renderStatsGrid({ userStats, universitiesCount, scholarshipsCount, totals, paiementsResume }) {

const grid = document.getElementById("statsGrid");
grid.innerHTML = "";

const fitzActions = (totals.letter_generated || 0) + (totals.email_generated || 0) +
(totals.verification_run || 0) + (totals.translation_run || 0);

const cards = [

// « signup » n'est plus émis depuis la page d'inscription gratuite
// (2026-09-20) : les comptes neufs arrivent en compte_gratuit_cree.
{ icon: "users", label: "Étudiants inscrits", value: userStats.total, size: "featured", delta: weekDelta(["signup", "compte_gratuit_cree"]) },
{ icon: "user-plus", label: "Nouveaux aujourd'hui", value: userStats.newToday, size: "accent" },
{ icon: "landmark", label: "Universités au catalogue", value: universitiesCount },
{ icon: "graduation-cap", label: "Bourses au catalogue", value: scholarshipsCount },

{ icon: "eye", label: "Bourses consultées", value: totals.scholarship_viewed, size: "tall", delta: weekDelta(["scholarship_viewed"]) },
{ icon: "building-2", label: "Universités consultées", value: totals.university_viewed },
{ icon: "external-link", label: "Portails de candidature ouverts", value: totals.application_portal_opened },
{ icon: "bot", label: "Actions Fitz (lettres, e-mails, contrôles…)", value: fitzActions },
{ icon: "message-circle", label: "Messages au chat Fitz", value: totals.ai_chat_message_sent },
{ icon: "user-check", label: "Demandes de conseiller", value: totals.advisor_request_sent },
{ icon: "send", label: "Messages admin → étudiants", value: totals.admin_message_sent },
{ icon: "credit-card", label: "Tentatives de paiement", value: totals.payment_attempted, size: "wide" },

// Lot ADMIN-SAIT-TOUT (2026-09-23) : le paiement réel est branché
// depuis le 21/09. La carte lit `payments` (écrite par le serveur) et
// ne compte que la PRODUCTION : les factures de test ne sont pas de
// l'argent. Même règle « payé ET appliqué » que admin/paiements.js.
paiementsResume
? { icon: "wallet", label: `Revenus encaissés (${formatNumber(paiementsResume.nbPayes)} paiement${paiementsResume.nbPayes > 1 ? "s" : ""})`, value: paiementsResume.encaisse, size: "wide", delta: paiementsResume.semaine > 0 ? { dir: "up", text: `+${formatNumber(paiementsResume.semaine)} F sur 7 jours` } : { dir: "flat", text: "aucun encaissement sur 7 jours" } }
: { icon: "wallet", label: "Revenus encaissés", pending: true, pendingNote: "Les paiements n'ont pas pu être lus — voir la page Paiements." }

];

cards.forEach((card) => grid.appendChild(renderStatCard(card)));

if (window.lucide) lucide.createIcons();

}

// ==========================================================
// Observations — synthèse en langage naturel des chiffres déjà
// calculés (aucune nouvelle source de données).
// ==========================================================

function renderAiObservations({ userStats, totals }) {

const el = document.getElementById("aiObservationText");

const weekIn = sumLastDays(["visit", "signup", "login"], 7);
const visiteursJour = sumLastDays(["visiteurs"], 1);
const top = actionsLesPlusFrequentes(7)[0];
const weekAdmitted = sumLastDays(["application_admitted"], 7);
const weekRejected = sumLastDays(["application_rejected"], 7);

const fragments = [];

if (userStats.total === 0) {
el.textContent = "Fitz n'a pas encore d'étudiant inscrit. Les statistiques commenceront à évoluer dès l'arrivée des premiers comptes.";
return;
}

if (visiteursJour > 0) {
fragments.push(`${formatNumber(visiteursJour)} visiteur${visiteursJour > 1 ? "s" : ""} aujourd'hui`);
}

if (userStats.newToday > 0) {
fragments.push(`${userStats.newToday} nouvel${userStats.newToday > 1 ? "les" : ""} inscription${userStats.newToday > 1 ? "s" : ""} aujourd'hui`);
}

if (top) {
fragments.push(`action la plus fréquente sur 7 jours : ${top.libelle.toLowerCase()} (${formatNumber(top.total)})`);
}

if (weekIn > 0) {
fragments.push(`${formatNumber(weekIn)} entrée${weekIn > 1 ? "s" : ""} sur les 7 derniers jours`);
}

if (weekAdmitted > 0) {
fragments.push(`${weekAdmitted} admission${weekAdmitted > 1 ? "s" : ""} signalée${weekAdmitted > 1 ? "s" : ""} cette semaine`);
}

if (weekRejected > 0) {
fragments.push(`${weekRejected} refus cette semaine`);
}

if (!fragments.length) {

const totalActivity = (totals.letter_generated || 0) + (totals.email_generated || 0) +
(totals.verification_run || 0) + (totals.translation_run || 0);

el.textContent = totalActivity > 0
? `Semaine calme : aucune entrée ni issue de candidature enregistrée sur 7 jours, mais ${formatNumber(totalActivity)} action${totalActivity > 1 ? "s" : ""} Fitz au total depuis le lancement. Aucune anomalie détectée.`
: "Aucune anomalie détectée. L'activité est stable — les courbes ci-dessus se rempliront au fil des visites et des candidatures.";

return;

}

el.textContent = `${fragments.join(", ")}. Aucune anomalie détectée.`;

}

// ==========================================================
// Graphique de répartition par formule
// ==========================================================

// Les blocages, triés — le libellé humain de chaque code vient du
// catalogue de js/fitz-recours.js (import différé pour ne pas charger
// un module de plus quand la liste est vide).
const LIBELLES_BLOCAGE = {
verrou: "Outil verrouillé", prerequis: "Prérequis manquant", quoi_faire: "Ne sait pas quoi faire", documents: "Quels documents ?",
etape: "Étape de procédure", paiement: "Où et quand payer ?", echeance: "Date limite", depot_tiers: "Dépôt par un tiers",
preuve: "Preuve de dépôt", sans_reponse: "Sans nouvelles"
};

function renderBlocages(items) {
const liste = document.getElementById("blocagesList");
if (!liste) return;
if (!items.length) return;
// Même forme que renderTopList : rang, libellé, compte.
liste.innerHTML = items.map((b, i) => `<div class="top-list-row"><span class="top-list-rank">${i + 1}</span><span class="top-list-label">${LIBELLES_BLOCAGE[b.code] || b.code} · ${b.total ? Math.round((b.resolus / b.total) * 100) : 0} % avec réponse</span><span class="top-list-count">${b.total}</span></div>`).join("");
}

async function renderPlanChart() {

const breakdown = await getPlanBreakdown();
// Gratuit, puis les 7 offres en vente, puis les formules retirées — le
// même ordre et les mêmes étiquettes que partout dans l'admin.
const planIds = tousLesIdentifiants();

const ctx = document.getElementById("planChart");
const emptyState = document.getElementById("planChartEmpty");

const total = planIds.reduce((sum, id) => sum + (breakdown[id] || 0), 0);

if (emptyState) emptyState.hidden = total > 0;

if (!ctx || !window.Chart) return;

planChart = new Chart(ctx, {
type: "doughnut",
data: {
labels: planIds.map((id) => etiquetteAdmin(id)),
datasets: [{
data: planIds.map((id) => breakdown[id] || 0),
// Refonte claire 2026-09-02 : la palette bleu/violet de l'admin
// sombre est remplacée par la progression chaude du site —
// gris chaud (gratuit) → gamme ambre (offres en vente : Pass, 3
// bourses, 3 France) → gris et encre (formules retirées).
backgroundColor: ["#B7AFA3", "#F2B640", "#E9A319", "#C9860B", "#8A5D00", "#D9B26A", "#B08A3E", "#7A5F25", "#8A837A", "#6E6860", "#524D46", "#3A3630", "#211D18"],
borderColor: "#FFFFFF",
borderWidth: 2
}]
},
options: {
responsive: true,
maintainAspectRatio: false,
plugins: {
legend: { position: "bottom", labels: { color: "#57514A", boxWidth: 12 } }
}
}
});

}

// ==========================================================
// Entonnoir du parcours — totaux depuis le lancement du suivi
// ==========================================================

function renderFunnel({ userStats, totals }) {

const steps = [
// Visiteurs : une personne comptée une fois par jour de visite, depuis
// le lot ADMIN-SAIT-TOUT (2026-09-23) — avant, seules les entrées.
{ label: "Visiteurs (depuis le 23/09, une fois par jour)", value: totals.visiteurs || 0, icon: "footprints" },
{ label: "Entrées enregistrées (sessions, connexions)", value: (totals.visit || 0) + (totals.login || 0) + (totals.signup || 0), icon: "footprints" },
{ label: "Étudiants inscrits", value: userStats.total },
{ label: "Paiements réussis", value: totals.payment_completed || 0 },
{ label: "Candidatures suivies", value: totals.application_added || 0 },
{ label: "Admissions signalées", value: totals.application_admitted || 0 }
];

const max = Math.max(1, ...steps.map((s) => s.value));

const container = document.getElementById("funnelList");
container.innerHTML = "";

steps.forEach((step) => {

const row = document.createElement("div");

row.innerHTML = `
<div class="funnel-row-label"><span></span><span class="funnel-row-value"></span></div>
<div class="funnel-bar"><div class="funnel-bar-fill"></div></div>
`;

row.querySelector(".funnel-row-label span:first-child").textContent = step.label;
row.querySelector(".funnel-row-value").textContent = formatNumber(step.value);

container.appendChild(row);

// Largeur appliquée après insertion pour laisser la transition CSS
// animer la barre au chargement.
requestAnimationFrame(() => {
row.querySelector(".funnel-bar-fill").style.width = `${Math.round((step.value / max) * 100)}%`;
});

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
// Chronologie d'activité — les VRAIS derniers événements du journal
// analyticsEvents (une seule requête, limitée). Les visites sont
// filtrées pour ne pas noyer les événements signifiants.
// ==========================================================

const EVENT_LABELS = {
signup: "Nouvel étudiant inscrit",
login: "Connexion d'un étudiant",
logout: "Déconnexion d'un étudiant",
scholarship_viewed: "Bourse consultée",
university_viewed: "Université consultée",
application_portal_opened: "Portail de candidature ouvert",
university_portal_opened: "Site d'université ouvert",
funder_portal_opened: "Portail du bailleur ouvert",
application_created_from_details: "Candidature créée depuis une fiche",
letter_generated: "Lettre de motivation générée",
email_generated: "E-mail généré",
verification_run: "Vérification de dossier",
translation_run: "Traduction effectuée",
ai_chat_message_sent: "Message envoyé à Fitz",
application_added: "Candidature ajoutée au suivi",
application_checked_in: "Point d'étape sur une candidature",
application_checklist_updated: "Checklist de candidature mise à jour",
application_readiness_checked: "Contrôle de préparation lancé",
application_recommendation_replaced: "Suggestion Fitz remplacée",
application_admitted: "ADMISSION signalée par un étudiant",
application_rejected: "Refus signalé par un étudiant",
application_waitlisted: "Mise en liste d'attente signalée",
advisor_request_sent: "Demande de revue par un conseiller",
admin_message_sent: "Message envoyé à un étudiant",
file_compressed: "Fichier compressé",
payment_attempted: "Tentative de paiement",
// Lot ADMIN-SAIT-TOUT (2026-09-23) : les événements que le site émettait
// sans que l'admin sache les nommer.
payment_completed: "Paiement réussi",
compte_gratuit_cree: "Compte gratuit créé",
procedure_etape: "Étape de procédure cochée",
application_deposee_declaree: "Dépôt de candidature déclaré",
application_acceptee: "Université proposée acceptée",
application_deadline_reprise: "Date limite reprise d'une fiche",
application_hors_fenetre_remplacee: "Université hors délai remplacée",
application_bourse_fermee_remplacee: "Bourse fermée remplacée",
interview_prep_checklist_toggled: "Préparation d'entretien cochée",
porte_bourse: "Accueil : « Trouver une bourse »",
porte_preinscription: "Accueil : « Partir en me finançant »",
porte_diagnostic: "Accueil : diagnostic gratuit",
espace_gratuit_diagnostic: "Espace gratuit : diagnostic",
espace_gratuit_offre: "Espace gratuit : offre ouverte",
admin_message_groupe: "Message groupé envoyé",
visit: "Entrée sur le site"
};

// ==========================================================
// VISITEURS ET ACTIONS (lot ADMIN-SAIT-TOUT, 2026-09-23) — tout est
// lu dans l'historique quotidien déjà chargé : 0 lecture de plus.
// ==========================================================

// Ce qui n'est pas une « action » : le passage lui-même.
const PAS_UNE_ACTION = new Set(["visit", "visiteurs", "visiteurs_nouveaux", "login", "logout", "signup"]);

function actionsLesPlusFrequentes(nDays) {
const sommes = {};
buildLastDays(nDays).forEach((jour) => {
const c = pulseState.history[jour];
if (!c) return;
Object.entries(c).forEach(([type, n]) => {
if (PAS_UNE_ACTION.has(type) || !Number.isFinite(n)) return;
sommes[type] = (sommes[type] || 0) + n;
});
});
return Object.entries(sommes)
.filter(([, n]) => n > 0)
.sort((a, b) => b[1] - a[1])
.map(([type, total]) => ({ type, total, libelle: EVENT_LABELS[type] || type }));
}

function renderVisiteurs() {
const valeur = (champ, jours) => sumLastDays([champ], jours);
const hier = (() => {
const d = new Date(); d.setDate(d.getDate() - 1);
const c = pulseState.history[d.toISOString().slice(0, 10)] || {};
return c.visiteurs || 0;
})();
const chiffres = [
{ id: "visiteursAujourdhui", v: valeur("visiteurs", 1) },
{ id: "visiteursHier", v: hier },
{ id: "visiteurs7", v: valeur("visiteurs", 7) },
{ id: "visiteursNouveaux7", v: valeur("visiteurs_nouveaux", 7) }
];
chiffres.forEach(({ id, v }) => {
const el = document.getElementById(id);
if (el) el.textContent = formatNumber(v);
});

const liste = document.getElementById("actionsFrequentes");
if (!liste) return;
const actions = actionsLesPlusFrequentes(pulseState.days).slice(0, 8);
const titre = document.getElementById("actionsPeriode");
if (titre) titre.textContent = `${pulseState.days} derniers jours`;
if (!actions.length) {
liste.innerHTML = `<p class="top-list-empty">Aucune action enregistrée sur cette période.</p>`;
return;
}
liste.innerHTML = "";
actions.forEach((a, i) => {
const row = document.createElement("div");
row.className = "top-list-row";
row.innerHTML = `<span class="top-list-rank"></span><span class="top-list-label"></span><span class="top-list-count"></span>`;
row.querySelector(".top-list-rank").textContent = i + 1;
row.querySelector(".top-list-label").textContent = a.libelle;
row.querySelector(".top-list-count").textContent = formatNumber(a.total);
liste.appendChild(row);
});
}

// ==========================================================
// PAIEMENTS — résumé pour la carte « Revenus » et l'infrastructure.
// Lecture de `payments` (écrite par le serveur, lisible par l'admin) :
// la collection se compte en dizaines.
// ==========================================================

async function lireResumePaiements() {
const snap = await getDocs(collection(db, "payments"));
const semaine = Date.now() - 7 * 86400000;
const resume = { encaisse: 0, nbPayes: 0, semaine: 0, enAttente: 0, dernierPaye: null, production: 0 };
snap.forEach((d) => {
const p = d.data();
if (p.mode === "live") resume.production += 1;
if (p.mode !== "live") return;
if (p.statut === "en-attente") resume.enAttente += 1;
if (p.statut !== "paye" || p.applique === false) return;
const montant = Number.isFinite(p.montantEncaisse) ? p.montantEncaisse : (p.montantAttendu || 0);
resume.encaisse += montant;
resume.nbPayes += 1;
// traiteLe : posé par le webhook quand il applique le paiement.
const quand = p.traiteLe && typeof p.traiteLe.toDate === "function" ? p.traiteLe.toDate()
: (p.creeLe && typeof p.creeLe.toDate === "function" ? p.creeLe.toDate() : null);
if (quand && quand.getTime() >= semaine) resume.semaine += montant;
if (quand && (!resume.dernierPaye || quand > resume.dernierPaye)) resume.dernierPaye = quand;
});
return resume;
}

// Le dernier e-mail parti (bienvenue ou alerte), pour la ligne Brevo.
async function lireDernierEmail() {
const snap = await getDocs(query(collection(db, "emailsEnvoyes"), orderBy("envoyeLe", "desc"), limit(1)));
if (snap.empty) return null;
const d = snap.docs[0].data();
return d.envoyeLe && typeof d.envoyeLe.toDate === "function" ? { quand: d.envoyeLe.toDate(), echec: !!d.echec } : null;
}

function relativeTime(date) {

if (!date) return "";

const diffMs = Date.now() - date.getTime();
const minutes = Math.round(diffMs / 60000);

if (minutes < 1) return "à l'instant";
if (minutes < 60) return `il y a ${minutes} min`;

const hours = Math.round(minutes / 60);
if (hours < 24) return `il y a ${hours} h`;

return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

}

function eventDetail(event) {

const p = event.payload || {};

if (p.university) return p.university;
if (p.country) return p.country;
if (p.plan) return `Formule : ${PLAN_LABELS[p.plan] || p.plan}`;
if (p.status) return `Statut : ${p.status}`;

return "";

}

function renderActivityTimeline(events) {

const container = document.getElementById("activityTimeline");
container.innerHTML = "";

const meaningful = events.filter((e) => e.type !== "visit").slice(0, 9);

if (!meaningful.length) {

container.innerHTML = `<p class="timeline-empty">En attente des premières activités étudiantes — cette chronologie affiche les événements réels du journal analytics.</p>`;
return;

}

meaningful.forEach((event) => {

const row = document.createElement("div");
row.className = "timeline-item";

const when = event.createdAt && typeof event.createdAt.toDate === "function"
? relativeTime(event.createdAt.toDate())
: "";

const detail = eventDetail(event);

row.innerHTML = `
<span class="timeline-dot"></span>
<div class="timeline-body">
<div class="timeline-label"></div>
<div class="timeline-meta"></div>
</div>
`;

row.querySelector(".timeline-label").textContent = EVENT_LABELS[event.type] || event.type;
row.querySelector(".timeline-meta").textContent = [detail, when].filter(Boolean).join(" — ");

container.appendChild(row);

});

}

// ==========================================================
// Infrastructure — état des services, dérivé de faits déjà connus
// à ce stade du code (si on atteint ce rendu, Firestore/Auth ont
// déjà répondu avec succès).
// ==========================================================

// Lot ADMIN-SAIT-TOUT (2026-09-23) : ces états étaient écrits à la main
// le 2026-09-02 et n'avaient plus bougé — « Fitz : En attente » alors
// que Fitz répond pour de vrai depuis le 18/09, « PayDunya : En
// attente » alors que le paiement est en production depuis le 21/09,
// « Storage : non utilisé » alors qu'il reçoit les preuves de dépôt et
// les captures. Chaque ligne est désormais DÉDUITE d'un fait lu.
function renderInfraGrid({ paiementsResume, dernierEmail } = {}) {

const dateCourte = (d) => d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) + " à " + d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

const paydunya = paiementsResume
? {
status: "is-online",
label: paiementsResume.dernierPaye
? `Production · ${MOYENS_DE_PAIEMENT_OUVERTS} · dernier paiement le ${dateCourte(paiementsResume.dernierPaye)}`
: `Production · ${MOYENS_DE_PAIEMENT_OUVERTS} · aucun paiement réel pour l'instant`
}
: { status: "is-pending", label: "Paiements illisibles — voir la page Paiements" };

const brevo = dernierEmail
? { status: dernierEmail.echec ? "is-pending" : "is-online", label: `${dernierEmail.echec ? "Dernier envoi en échec" : "Actif"} · dernier e-mail le ${dateCourte(dernierEmail.quand)}` }
: { status: "is-online", label: "Actif · aucun e-mail envoyé pour l'instant" };

const services = [
{ icon: "flame", name: "Firebase", status: "is-online", label: "Actif" },
{ icon: "database", name: "Firestore", status: "is-online", label: "Actif" },
{ icon: "hard-drive", name: "Storage", status: "is-online", label: "Actif · preuves de dépôt et captures" },
{ icon: "key-round", name: "Authentication", status: "is-online", label: "Actif" },
{ icon: "bar-chart-3", name: "Analytics", status: "is-online", label: "Actif · visiteurs comptés depuis le 23/09" },
{ icon: "bot", name: "Fitz", ...(MODE_FITZ === "passerelle" ? { status: "is-online", label: "Réel · API Anthropic" } : { status: "is-pending", label: "Mode simulé" }) },
{ icon: "wallet", name: "PayDunya", ...paydunya },
{ icon: "mail", name: "E-mails (Brevo)", ...brevo }
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

const [userStats, universitiesCount, scholarshipsCount, totals, todayCounters, history, recentEvents] = await Promise.all([
getUserStats(),
getUniversitiesCount(),
getScholarshipsCount(),
getAnalyticsTotals(),
getTodayCounters(),
getDailyCounterHistory(90),
getRecentEvents(20)
]);

// L'historique quotidien alimente la pulsation, les deltas des
// cartes ET les observations — chargé UNE fois pour tout le
// tableau de bord (au plus ~90 lectures, souvent bien moins).
pulseState.history = history;

// Le document du jour peut être plus frais que l'historique (les
// deux lectures partent en parallèle) : on garde le plus récent.
const todayKey = new Date().toISOString().slice(0, 10);
pulseState.history[todayKey] = { ...(history[todayKey] || {}), ...todayCounters };

// Paiements et dernier e-mail : lus à part, sans jamais bloquer le
// tableau de bord (null si la lecture échoue).
const [paiementsResume, dernierEmail] = await Promise.all([
lireResumePaiements().catch((e) => { console.warn("Paiements non lus :", e); return null; }),
lireDernierEmail().catch((e) => { console.warn("Dernier e-mail non lu :", e); return null; })
]);

renderExecHero({ adminData, firebaseUser: user, universitiesCount, scholarshipsCount, userStats });
renderStatusBadges();
renderOutcomeStrip(totals);
renderStatsGrid({ userStats, universitiesCount, scholarshipsCount, totals, paiementsResume });
renderVisiteurs();
renderAiObservations({ userStats, totals });
renderFunnel({ userStats, totals });
renderActivityTimeline(recentEvents);
renderChemins(totals);
renderInfraGrid({ paiementsResume, dernierEmail });

renderSerieChips();
initPulseControls();
renderPulseChart();
renderPulseFootnote();

await Promise.all([
renderPlanChart(),
getBlocagesFrequents().then(renderBlocages).catch((error) => { console.warn("Blocages non lus :", error); }),
getTopCountries(6).then((items) => renderTopList("topCountriesList", items)),
getTopUniversities(6).then((items) => renderTopList("topUniversitiesList", items))
]);

if (window.lucide) lucide.createIcons();

hidePageLoader();

// Les graphiques ont été construits pendant que .content était
// masqué (display:none) : leur canvas garde alors un gabarit
// arbitraire qui fait déborder la page. On les recale sur la
// largeur réelle une fois le contenu affiché.
requestAnimationFrame(() => {
if (pulseChart) pulseChart.resize();
if (planChart) planChart.resize();
});

// « Votre journée » se remplit APRÈS le premier affichage : ses
// agrégations (une par étudiant pour les non-lus) ne doivent jamais
// retarder les courbes. Son échec est le sien — jamais celui du
// tableau de bord entier.
initJournee().catch((erreur) => {
console.warn("Journée non rendue :", erreur);
const hote = document.getElementById("journeeGrid");
if (hote) hote.innerHTML = `<p class="journee-chargement">Les piles du jour n'ont pas pu être comptées — rechargez la page.</p>`;
});

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
