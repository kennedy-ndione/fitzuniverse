import { db } from "./firebase-config.js";

import {
doc,
getDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import { trackEvent } from "./js/analytics.js";

// ===============================
// Paramètres URL
// ===============================
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

// ===============================
// Diagnostic Fitz — compatibilité réelle avec CETTE université,
// calculée à partir des réponses déjà données par l'étudiant sur
// eligibility-questions.html (sessionStorage). Ne réutilise pas le
// score global de results.html : ce sont des critères propres à cette
// université précise (son niveau, sa langue), comparés au profil.
// ===============================
function computeCompatibility(university, responses) {

const checks = [];

checks.push({
label: "Niveau académique",
ok: !university.level || responses.studyLevel === university.level,
detail: university.level
? `Cette opportunité recherche un profil "${university.level}".`
: "Niveau non précisé pour cette opportunité."
});

const englishScale = { "Débutant": 0, "Intermédiaire": 1, "Bon niveau": 2, "Courant / Bilingue": 3 };
const englishOk = (englishScale[responses.english] ?? 0) >= 1;

checks.push({
label: "Langue",
ok: englishOk,
detail: university.language
? `Programme enseigné en ${university.language}.`
: "Langue non précisée pour cette opportunité."
});

checks.push({
label: "Documents",
ok: responses.passport === "Passeport valide",
detail: "Un passeport valide (ou en cours de renouvellement) est généralement le premier document demandé."
});

checks.push({
label: "Chances de compléter votre dossier",
ok: responses.timeline === "Dans les 6 prochains mois" || responses.timeline === "D'ici 1 an",
detail: "Un dossier préparé suffisamment à l'avance a plus de chances d'aboutir avant l'échéance."
});

const okCount = checks.filter((c) => c.ok).length;
const percent = Math.round((okCount / checks.length) * 100);

return { checks, percent };

}

function renderDiagnostic(container, university) {

const rawResponses = sessionStorage.getItem("eligibilityResponses");

if (!rawResponses) {
window.location.href = "eligibility-test.html";
return;
}

const responses = JSON.parse(rawResponses);
const { checks, percent } = computeCompatibility(university, responses);

container.innerHTML = `
<div class="diagnostic-score">
<strong>${percent}%</strong>
<span>compatibilité avec votre profil</span>
</div>
<ul class="diagnostic-result-list">
${checks.map((c) => `
<li class="${c.ok ? "is-ok" : "is-gap"}">
<i data-lucide="${c.ok ? "check-circle" : "alert-circle"}"></i>
<div><strong>${c.label}</strong><p>${c.detail}</p></div>
</li>
`).join("")}
</ul>
<a href="offers.html" class="btn btn-secondary btn-sm">
<span>Renforcer mon dossier avec Fitz</span>
<i data-lucide="arrow-right"></i>
</a>
`;

container.hidden = false;

if (window.lucide) lucide.createIcons();

}

// ===============================
// Nudge au retour du portail — n'apparaît que si l'étudiant a
// effectivement cliqué sur le lien du portail avant de revenir sur
// l'onglet, pas à chaque changement d'onglet anodin.
// ===============================
function initPortalNudge() {

const nudge = document.getElementById("portalNudge");
const closeBtn = document.getElementById("portalNudgeClose");

let portalWasOpened = false;

document.getElementById("applyBtn").addEventListener("click", () => {
portalWasOpened = true;
});

document.addEventListener("visibilitychange", () => {

if (document.visibilityState === "visible" && portalWasOpened) {

nudge.hidden = false;
portalWasOpened = false;

if (window.lucide) lucide.createIcons();

}

});

closeBtn.addEventListener("click", () => {
nudge.hidden = true;
});

}

// ===============================
// Chargement de l'université
// ===============================
async function chargerUniversite() {

try {

if (!id) {
throw new Error("ID du programme manquant.");
}

// Architecture relationnelle (2026-07-30) : cette page affiche un
// PROGRAMME précis (université × bourse × niveau), pas un profil
// d'université brut — "programs" porte les données propres à cette
// offre (deadline, portail, langue...), jointes ici à son université
// et à sa bourse pour l'affichage.
const programSnap = await getDoc(doc(db, "programs", id));

if (!programSnap.exists()) {
document.body.innerHTML = `
<div style="padding:80px 24px;text-align:center;">
<h2>Cette opportunité n'est plus disponible</h2>
<p>Ce programme a peut-être été retiré ou mis à jour récemment.</p>
</div>
`;
return;
}

const program = { id: programSnap.id, ...programSnap.data() };

const [universitySnap, scholarshipSnap] = await Promise.all([
program.universityId ? getDoc(doc(db, "universities", program.universityId)) : null,
program.scholarshipId ? getDoc(doc(db, "scholarships", program.scholarshipId)) : null
]);

const universityProfile = universitySnap && universitySnap.exists() ? universitySnap.data() : {};
const scholarshipData = scholarshipSnap && scholarshipSnap.exists() ? scholarshipSnap.data() : {};

const university = {
id: program.id,
university: universityProfile.name || "",
country: universityProfile.country || "",
city: universityProfile.city || "",
ranking: universityProfile.ranking || "",
image: universityProfile.image || "",
flag: universityProfile.flag || "",
level: program.level || "",
scholarship: scholarshipData.title || "",
deadline: program.deadline || "",
coverage: program.coverage || "",
language: program.language || "",
duration: program.duration || "",
status: program.status || "",
applicationUrl: program.applicationUrl || "",
description: program.description || scholarshipData.description || universityProfile.description || ""
};

// ===============================
// Éléments HTML
// ===============================
const title = document.getElementById("title");
const country = document.getElementById("country");
const city = document.getElementById("city");
const level = document.getElementById("level");
const scholarship = document.getElementById("scholarship");
const description = document.getElementById("description");
const flag = document.getElementById("flag");
const cityImage = document.getElementById("cityImage");
const deadline = document.getElementById("deadline");
const coverage = document.getElementById("coverage");
const language = document.getElementById("language");
const duration = document.getElementById("duration");
const ranking = document.getElementById("ranking");
const status = document.getElementById("status");
const applyBtn = document.getElementById("applyBtn");

// ===============================
// Remplissage des informations
// ===============================
const pageTitle = university.university
? `${university.university} - ${university.scholarship || "Bourse"} | ScholarBridge`
: "Détails de la bourse | ScholarBridge";

document.title = pageTitle;

const metaDescription = document.querySelector('meta[name="description"]');

if (metaDescription && university.description) {
metaDescription.setAttribute("content", university.description.slice(0, 160));
}

if (title) title.textContent = university.university || "Université";
if (country) country.textContent = university.country || "Non renseigné";
if (city) city.textContent = university.city || "Ville non renseignée";
if (level) level.textContent = university.level || "Niveau non renseigné";
if (scholarship) scholarship.textContent = university.scholarship || "";

if (description) description.textContent = university.description || "Aucune description disponible.";

if (flag) {
flag.src = `assets/flags/${university.flag || "default.svg"}`;
flag.alt = university.country || "Drapeau";
}

if (cityImage) {
cityImage.src = `assets/images/cities/${university.image || "default.jpg"}`;
cityImage.alt = university.city || "Ville";
}

if (deadline) deadline.textContent = university.deadline || "—";
if (coverage) coverage.textContent = university.coverage || "—";
if (language) language.textContent = university.language || "—";
if (duration) duration.textContent = university.duration || "—";
if (ranking) ranking.textContent = university.ranking || "—";
if (status) status.textContent = university.status || "—";

trackEvent("scholarship_viewed", {
country: university.country,
university: university.university,
field: university.level
});

document.getElementById("detailsMain").hidden = false;

if (window.lucide) lucide.createIcons();

// ===============================
// Bouton candidature — toujours libre, jamais de friction. Le lien
// officiel s'ouvre immédiatement, comme n'importe quel lien externe.
// ===============================
if (applyBtn) {

if (university.applicationUrl) {
applyBtn.href = university.applicationUrl;
} else {
applyBtn.addEventListener("click", (event) => {
event.preventDefault();
alert("Le lien officiel de candidature sera ajouté prochainement.");
});
}

applyBtn.addEventListener("click", () => {
trackEvent("application_portal_opened", {
country: university.country,
university: university.university
});
});

}

initPortalNudge();

// ===============================
// Diagnostic Fitz
// ===============================
const analyzeBtn = document.getElementById("analyzeBtn");
const diagnosticResult = document.getElementById("diagnosticResult");

if (analyzeBtn) {
analyzeBtn.addEventListener("click", () => renderDiagnostic(diagnosticResult, university));
}

} catch (error) {

console.error("Erreur :", error);

document.body.innerHTML = `
<div style="padding:80px 24px;text-align:center;">
<h2>Chargement interrompu</h2>
<p>Réessayez dans quelques instants.</p>
</div>
`;

}

}

// ===============================
// Initialisation
// ===============================
chargerUniversite();
