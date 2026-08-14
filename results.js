// -------- results.js --------
// Calcule et affiche un résultat réel à partir des réponses laissées
// par l'utilisateur sur eligibility-questions.html (sessionStorage).
// Le score global (académique, langue, documents...) vient de
// EligibilityAI (eligibility-ai.js) — inchangé, synchrone, aucune
// donnée externe. Les opportunités concrètes (nom d'université, bourse,
// deadline) viennent en revanche du vrai catalogue Firestore, via
// recommendPrograms() (js/recommend-programs.js) — la même jointure
// programs/universities/scholarships déjà utilisée par applications.js,
// jamais une 2e façon de résoudre bourse↔université (audit du
// 2026-08-14, remplace l'ancien calculateDestination() qui ne
// reconnaissait que 4 pays codés en dur).
//
// Devient nécessairement asynchrone (comme chargerUniversite() dans
// details.js) : impossible d'afficher les vraies opportunités avant
// d'avoir attendu la lecture Firestore. Un état de chargement dédié
// (#resultsLoading) reste visible jusque-là.

import { db } from "./firebase-config.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import { EligibilityAI, normalizeAverageToPercent } from "./eligibility-ai.js";
import { recommendPrograms } from "./js/recommend-programs.js";

const rawResponses = sessionStorage.getItem("eligibilityResponses");

if (!rawResponses) {

window.location.replace("eligibility-test.html");

} else {

const responses = JSON.parse(rawResponses);

main(responses);

}

// ==========================================================
// PROFIL — traduit les réponses du diagnostic gratuit dans le même
// format que profile.js (profil Firestore persistant), pour que
// recommendPrograms()/scoreProgram() n'aient besoin d'aucune variante :
// même fonction, deux sources de profil différentes selon le contexte
// (session anonyme ici, profil connecté dans applications.js).
// ==========================================================
function buildProfileFromResponses(responses) {

return {
lastDegree: responses.studyLevel || "",
preferredCountries: responses.destinationCountry && responses.destinationCountry !== "Je ne sais pas encore"
? [responses.destinationCountry]
: [],
// scoreProgram() ne vérifie que la présence d'"Anglais" dans
// program.language — un niveau "Débutant" ne mérite pas le bonus de
// compatibilité linguistique réservé à un enseignement en anglais.
languages: responses.english && responses.english !== "Débutant" ? ["Anglais"] : []
};

}

// ==========================================================
// CHARGEMENT DU CATALOGUE + RECOMMANDATIONS RÉELLES
// ==========================================================
const OPPORTUNITIES_COUNT = 6;

async function loadRealOpportunities(responses) {

const [programsSnap, universitiesSnap, scholarshipsSnap] = await Promise.all([
getDocs(collection(db, "programs")),
getDocs(collection(db, "universities")),
getDocs(collection(db, "scholarships"))
]);

const programs = programsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
const universitiesById = new Map(universitiesSnap.docs.map((d) => [d.id, { id: d.id, ...d.data() }]));
const scholarshipsById = new Map(scholarshipsSnap.docs.map((d) => [d.id, { id: d.id, ...d.data() }]));

const profile = buildProfileFromResponses(responses);

const picks = recommendPrograms({
profile,
programs,
universitiesById,
scholarshipsById,
excludeUniversityIds: new Set(),
count: OPPORTUNITIES_COUNT
});

const reasons = new EligibilityAI(responses).matchReasons();

const scholarshipDetails = picks.map((pick) => ({
name: pick.scholarshipTitle || `Programme à ${pick.universityName}`,
university: pick.universityName,
country: (universitiesById.get(pick.universityId) || {}).country || "",
deadline: pick.deadline,
reasons
}));

const eligibleCountries = [...new Set(scholarshipDetails.map((s) => s.country).filter(Boolean))];

// Filet minimal si le catalogue n'a produit aucune correspondance (ex.
// destination très spécifique sans programme encore en base) : la
// destination déclarée reste affichée, sans jamais inventer d'opportunité.
if (!eligibleCountries.length && responses.destinationCountry && responses.destinationCountry !== "Je ne sais pas encore") {
eligibleCountries.push(responses.destinationCountry);
}

return { scholarshipDetails, eligibleCountries };

}

// ==========================================================
// ÉTAT DE CHARGEMENT
// ==========================================================
function setLoading(isLoading) {

const loading = document.getElementById("resultsLoading");
const content = document.getElementById("resultsContent");

if (loading) loading.hidden = !isLoading;
if (content) content.hidden = isLoading;

}

async function main(responses) {

setLoading(true);

const result = new EligibilityAI(responses).analyze();

const score = Math.max(0, Math.min(100, Math.round(result.score)));

try {

const { scholarshipDetails, eligibleCountries } = await loadRealOpportunities(responses);

result.scholarshipDetails = scholarshipDetails;
result.eligibleScholarships = scholarshipDetails.map((s) => s.name);
result.eligibleCountries = eligibleCountries;

} catch (error) {

console.error("Erreur Firestore (catalogue) :", error);

result.scholarshipDetails = [];
result.eligibleScholarships = [];
result.eligibleCountries = [];

}

render(responses, result, score);

setLoading(false);

}

function render(responses, result, score) {

// ==========================================================
// RÉCIT D'OUVERTURE — Fitz présente son diagnostic
// ==========================================================

function buildNarrative() {

const sentences = [];

const oppCount = result.eligibleScholarships.length;

if (oppCount > 0) {
sentences.push(
`Nous avons identifié ${oppCount > 1 ? oppCount + " opportunités compatibles" : "une opportunité compatible"} avec votre profil${responses.studyCategory ? " en " + responses.studyCategory : ""}.`
);
} else {
sentences.push(
"Votre profil demande une analyse plus approfondie pour identifier les meilleures opportunités."
);
}

if (result.strengths.length) {
sentences.push("Votre parcours présente déjà plusieurs éléments favorables.");
} else {
sentences.push("Votre profil est encore en construction, mais chaque parcours a ses atouts.");
}

if (result.weaknesses.length) {
sentences.push("Certaines améliorations pourraient augmenter significativement vos chances.");
}

if (result.eligibleCountries.length) {
sentences.push(
result.eligibleCountries.length > 1
? "Voici pourquoi certaines destinations semblent particulièrement adaptées."
: "Voici pourquoi cette destination semble particulièrement adaptée."
);
}

return sentences;

}

function renderNarrative() {

const container = document.getElementById("narrativeText");
container.innerHTML = "";

buildNarrative().forEach((sentence) => {

const p = document.createElement("p");
p.textContent = sentence;
container.appendChild(p);

});

}

// ==========================================================
// SCORE — présenté comme un indicateur, pas un verdict
// ==========================================================

function profileMessage(score) {

if (score >= 80) {
return "Votre profil est solide pour viser des bourses internationales compétitives.";
}

if (score >= 60) {
return "Votre profil est déjà bien positionné. Quelques ajustements peuvent encore l'améliorer.";
}

if (score >= 40) {
return "Votre profil a un vrai potentiel, mais certains points méritent d'être renforcés avant de candidater.";
}

return "Votre profil nécessite un travail de préparation avant de candidater : les recommandations ci-dessous vous montrent par où commencer.";

}

function scoreTierLabel(score) {

if (score >= 80) return "Profil compétitif";
if (score >= 60) return "Profil solide";
if (score >= 40) return "Profil prometteur";
return "Profil à préparer";

}

function renderScore() {

document.getElementById("score").textContent = score;
document.getElementById("profileMessage").textContent = profileMessage(score);
document.getElementById("scoreTier").textContent = scoreTierLabel(score);

const ring = document.getElementById("scoreRing");
ring.style.setProperty("--score-percent", score);

}

// ==========================================================
// DÉCOMPOSITION DU SCORE — lecture pédagogique, pas un second
// calcul : chaque catégorie est dérivée directement des réponses
// déjà fournies par l'utilisateur (aucune donnée inventée), pour
// expliquer visuellement ce qui compose le score produit par
// EligibilityAI. Le score global affiché plus haut reste celui de
// EligibilityAI ; ce détail ne le recalcule jamais.
// ==========================================================

function levelFromStudyLevel(studyLevel) {

const scale = {
"Nouveau bachelier": 60,
"Licence": 75,
"Master": 90,
"Doctorat": 95
};

return scale[studyLevel] || 55;

}

function levelFromEnglish(english) {

const scale = {
"Débutant": 25,
"Intermédiaire": 55,
"Bon niveau": 80,
"Courant / Bilingue": 100
};

return scale[english] || 40;

}

function levelFromPassport(passport) {

const scale = {
"Passeport valide": 100,
"Passeport en cours de demande": 60,
"Passeport expiré": 40,
"Je n'ai pas encore de passeport": 20
};

return scale[passport] || 30;

}

function levelFromTimeline(timeline) {

const scale = {
"Dans les 6 prochains mois": 90,
"D'ici 1 an": 70,
"Dans plus d'un an": 50,
"Je ne sais pas encore": 30
};

return scale[timeline] || 40;

}

const IMPROVEMENT_TIPS = {
"Niveau académique": "Mettez en avant vos meilleurs résultats et, si possible, complétez votre dossier avec des certificats ou projets qui renforcent votre moyenne.",
"Langue": "Un test de langue certifié (TOEFL, IELTS, TCF...) peut faire progresser ce score plus vite qu'un niveau auto-déclaré.",
"Formation": "Précisez votre domaine d'études : plus il est défini, plus Fitz peut cibler des programmes réellement compatibles.",
"Documents": "Un passeport valide (ou en cours de renouvellement) est souvent le premier document demandé — anticipez cette étape tôt.",
"Préparation": "Fixer une échéance claire pour candidater aide à structurer le reste de votre préparation."
};

function buildScoreBreakdown() {

const percent = normalizeAverageToPercent(responses.average, responses.averageScale);
const academicFromGrades = percent === null ? null : Math.round(percent);

return [
{
label: "Niveau académique",
icon: "graduation-cap",
value: academicFromGrades !== null
? Math.round((academicFromGrades + levelFromStudyLevel(responses.studyLevel)) / 2)
: levelFromStudyLevel(responses.studyLevel)
},
{ label: "Langue", icon: "languages", value: levelFromEnglish(responses.english) },
{ label: "Formation", icon: "book-open", value: levelFromStudyLevel(responses.studyLevel) },
{ label: "Documents", icon: "file-text", value: levelFromPassport(responses.passport) },
{ label: "Préparation", icon: "hourglass", value: levelFromTimeline(responses.timeline) }
];

}

function renderScoreBreakdown() {

const container = document.getElementById("scoreBreakdown");

if (!container) return;

const breakdown = buildScoreBreakdown();

container.innerHTML = "";

breakdown.forEach((row) => {

const item = document.createElement("div");
item.className = "score-breakdown-row";

item.innerHTML = `
<span class="score-breakdown-label"><span class="score-breakdown-icon"><i data-lucide="${row.icon}"></i></span>${row.label}</span>
<span class="score-breakdown-bar"><span style="width:${row.value}%"></span></span>
<span class="score-breakdown-pct">${row.value}%</span>
`;

container.appendChild(item);

});

renderImprovementReveal(breakdown);

}

// ==========================================================
// AMÉLIORATION — l'axe le plus faible est offert, les suivants
// sont un aperçu de ce que l'accompagnement débloque. Dérivé
// entièrement de la décomposition ci-dessus, aucun appel au
// moteur EligibilityAI.
// ==========================================================

function renderImprovementReveal(breakdown) {

const freeContainer = document.getElementById("improvementFree");
const locked = document.getElementById("recoLocked");
const lockedCount = document.getElementById("recoLockedCount");

if (!freeContainer || !locked) return;

const sorted = [...breakdown].sort((a, b) => a.value - b.value);
const [weakest, ...rest] = sorted;

freeContainer.innerHTML = `
<div class="improvement-free-icon"><i data-lucide="${weakest.icon}"></i></div>
<div class="improvement-free-copy">
<strong>Point à améliorer en priorité : ${weakest.label} (${weakest.value}%)</strong>
<p>${IMPROVEMENT_TIPS[weakest.label] || ""}</p>
</div>
`;

if (rest.length) {

lockedCount.textContent = `+${rest.length} autre${rest.length > 1 ? "s" : ""} piste${rest.length > 1 ? "s" : ""} d'amélioration verrouillée${rest.length > 1 ? "s" : ""}`;
locked.hidden = false;

} else {

locked.hidden = true;

}

}

// ==========================================================
// LISTES — points forts, axes de progression, recommandations
// ==========================================================

function fillList(id, items, emptyText, icon) {

const list = document.getElementById(id);

list.innerHTML = "";

if (!items.length) {

const li = document.createElement("li");
li.textContent = emptyText;
li.classList.add("empty");
list.appendChild(li);

return;

}

items.forEach((item) => {

const li = document.createElement("li");

li.innerHTML = `<i data-lucide="${icon}"></i><span></span>`;
li.querySelector("span").textContent = item;

list.appendChild(li);

});

}

function renderCountries() {

const list = document.getElementById("countries");
list.innerHTML = "";

if (!result.eligibleCountries.length) {

const li = document.createElement("li");
li.className = "empty";
li.textContent = "Aucune destination identifiée pour le moment.";
list.appendChild(li);

return;

}

result.eligibleCountries.forEach((country) => {

const li = document.createElement("li");
li.className = "country-pill";
li.innerHTML = `<i data-lucide="map-pin"></i><span></span>`;
li.querySelector("span").textContent = country;

list.appendChild(li);

});

}

// ==========================================================
// OPPORTUNITÉS — avec leur justification
// ==========================================================

function renderOpportunities() {

const wrapper = document.getElementById("scholarships");
wrapper.innerHTML = "";

if (!result.scholarshipDetails.length) {

const empty = document.createElement("p");
empty.className = "empty";
empty.textContent = "Aucune opportunité précise identifiée pour le moment : élargissez vos critères pour en découvrir davantage.";
wrapper.appendChild(empty);

return;

}

result.scholarshipDetails.forEach((scholarship) => {

const card = document.createElement("article");
card.className = "opportunity-card";

const reasonsHtml = scholarship.reasons
.map((reason) => `<li><i data-lucide="check"></i><span>${reason}</span></li>`)
.join("");

// university/deadline : n'existaient pas tant que les opportunités
// venaient des 4 pays codés en dur — le catalogue réel (via
// recommendPrograms) fournit désormais une université et une deadline
// précises, affichées ici sans changer la structure de la carte.
const subtitleParts = [scholarship.university, scholarship.country].filter(Boolean);

card.innerHTML = `
<div class="opportunity-head">
<div class="opportunity-icon"><i data-lucide="graduation-cap"></i></div>
<div>
<h3></h3>
<span class="opportunity-country"></span>
</div>
</div>
${scholarship.deadline ? `<p class="opportunity-deadline"><i data-lucide="calendar-clock"></i><span></span></p>` : ""}
<p class="opportunity-reasons-label">Pourquoi cette opportunité vous correspond :</p>
<ul class="opportunity-reasons">${reasonsHtml}</ul>
`;

card.querySelector("h3").textContent = scholarship.name;
card.querySelector(".opportunity-country").textContent = subtitleParts.join(" — ");

const deadlineEl = card.querySelector(".opportunity-deadline span");
if (deadlineEl) deadlineEl.textContent = `Échéance : ${scholarship.deadline}`;

wrapper.appendChild(card);

});

}

// ==========================================================
// RÉVÉLATION AU DÉFILEMENT
// ==========================================================

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

// ==========================================================
// RENDU
// ==========================================================

renderNarrative();
renderScore();
renderScoreBreakdown();

fillList("strengths", result.strengths, "Complétez le test pour identifier vos points forts.", "check-circle");
fillList("weaknesses", result.weaknesses, "Aucun axe de progression majeur identifié.", "arrow-up-circle");
fillList("recommendations", result.recommendations, "Aucune recommandation pour le moment.", "lightbulb");

renderCountries();
renderOpportunities();

initReveal();

if (window.lucide) lucide.createIcons();

}
