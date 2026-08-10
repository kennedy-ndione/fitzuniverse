import { db } from "./firebase-config.js";

import {
doc,
getDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import { trackEvent } from "./js/analytics.js";
import { resolveSession } from "./js/access-guard.js";

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

// Transmet le programme (et le score de compatibilité, une fois connu)
// aux 3 CTA de cette page qui mènent à offers.html — sans ça, cliquer
// "Découvrir l'accompagnement" perdait le contexte ("cette université
// précise", "ce diagnostic") au moment où il aurait le plus servi
// l'argument (audit du 2026-08-10).
function buildOffersUrl(programId, score) {

const searchParams = new URLSearchParams({ program: programId });

if (typeof score === "number") searchParams.set("score", score);

return `offers.html?${searchParams.toString()}`;

}

// Met à jour les 2 CTA statiques de la page (sidebar + nudge de retour
// portail) avec le programme courant, et le score dès qu'un diagnostic
// a été calculé cette session. Le 3e CTA (résultat du diagnostic,
// construit dynamiquement) porte déjà son propre lien avec le score —
// voir renderDiagnostic.
function updateFitzCtas(programId, score) {

const primary = document.getElementById("fitzCtaPrimary");
const nudge = document.getElementById("fitzCtaNudge");

const url = buildOffersUrl(programId, score);

if (primary) primary.href = url;
if (nudge) nudge.href = url;

}

// URL de retour transmise à eligibility-test.html : cette page +
// fromTest=1, pour que chargerUniversite() sache relancer le
// diagnostic automatiquement une fois le test terminé (voir plus bas).
function buildReturnUrl() {

const url = new URL(window.location.href);
url.searchParams.set("fromTest", "1");

return `${url.pathname}${url.search}`;

}

// Remplace l'ancien redirect silencieux (window.location.href direct) :
// explique pourquoi un test est nécessaire et laisse l'étudiant décider
// de continuer, plutôt que de le faire disparaître de la page sans
// préavis.
function renderDiagnosticPrompt(container) {

container.innerHTML = `
<p class="diagnostic-intro">Pour analyser votre compatibilité avec cette université, Fitz a besoin de connaître votre profil — un test rapide (2 minutes), à faire une seule fois. Vous reviendrez directement ici ensuite.</p>
<a href="eligibility-test.html?returnTo=${encodeURIComponent(buildReturnUrl())}" class="btn btn-secondary btn-sm">
<span>Faire le test (2 min)</span>
<i data-lucide="arrow-right"></i>
</a>
`;

container.hidden = false;

if (window.lucide) lucide.createIcons();

}

function renderDiagnostic(container, university) {

const rawResponses = sessionStorage.getItem("eligibilityResponses");

if (!rawResponses) {
renderDiagnosticPrompt(container);
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
<a href="${buildOffersUrl(university.id, percent)}" class="btn btn-secondary btn-sm">
<span>Renforcer mon dossier avec Fitz</span>
<i data-lucide="arrow-right"></i>
</a>
`;

container.hidden = false;

// Le score vient d'être calculé pour ce programme : les 2 autres CTA
// (sidebar, nudge de retour portail) en profitent aussi, plutôt que de
// rester sur un lien "programme seul" pendant que celui-ci ci-dessus
// porte déjà le score.
updateFitzCtas(university.id, percent);

if (window.lucide) lucide.createIcons();

}

// ===============================
// Nudge au retour du portail — n'apparaît que si l'étudiant a
// effectivement cliqué sur le lien du portail avant de revenir sur
// l'onglet, pas à chaque changement d'onglet anodin.
// ===============================
// Fenêtre de validité du nudge : au-delà, un retour sur l'onglet n'a
// plus grand-chose à voir avec ce clic précis (l'étudiant est probablement
// revenu pour une tout autre raison) — évite un nudge hors contexte
// après une longue absence.
const PORTAL_NUDGE_MAX_AGE_MS = 30 * 60 * 1000;

function initPortalNudge() {

const nudge = document.getElementById("portalNudge");
const closeBtn = document.getElementById("portalNudgeClose");
const applyBtn = document.getElementById("applyBtn");

let portalOpenedAt = null;

applyBtn.addEventListener("click", () => {

// Ne pose le marqueur que si un vrai portail est sur le point de
// s'ouvrir (href réel) — pas sur le cas où applicationUrl est encore
// absent, où ce même clic ne fait qu'afficher une alerte "lien à
// venir" (voir plus bas) sans jamais quitter l'onglet : sans cette
// condition, n'importe quel changement d'onglet ultérieur déclenchait
// à tort "De retour du portail ?" alors qu'aucun portail n'a été
// ouvert.
const href = applyBtn.getAttribute("href");

if (href && href !== "#") {
portalOpenedAt = Date.now();
}

});

document.addEventListener("visibilitychange", () => {

if (document.visibilityState !== "visible" || !portalOpenedAt) return;

const withinWindow = Date.now() - portalOpenedAt < PORTAL_NUDGE_MAX_AGE_MS;

portalOpenedAt = null;

if (!withinWindow) return;

nudge.hidden = false;

if (window.lucide) lucide.createIcons();

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
officialWebsite: universityProfile.officialWebsite || "",
description: program.description || scholarshipData.description || universityProfile.description || ""
};

// Portail de candidature réservé aux abonnés (peu importe la formule —
// Pass Express et Premier Dossier inclus), portail université toujours
// public : règle indépendante des restrictions de fonctionnalités par
// formule (chat seul pour Pass Express, 1 candidature pour Premier
// Dossier — voir js/access-guard.js/js/plan-features.js), donc pas
// question de réutiliser isFeatureLocked() ici. resolveSession() ne
// redirige jamais (contrairement à requireAuth/requireFeature) : cette
// page reste 100% publique même pour vérifier ce simple statut.
const session = await resolveSession().catch(() => null);
const isPaidUser = !!session && (session.testerAccess || session.planId !== "gratuit" || session.hasFitzExpress);

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
const universityPortalBtn = document.getElementById("universityPortalBtn");
const applicationPortalLocked = document.getElementById("applicationPortalLocked");

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

// Sans score pour l'instant (le diagnostic n'a pas encore tourné) —
// renderDiagnostic() les remettra à jour avec le score dès qu'il sera
// disponible.
updateFitzCtas(university.id);

trackEvent("scholarship_viewed", {
country: university.country,
university: university.university,
field: university.level
});

document.getElementById("detailsMain").hidden = false;

if (window.lucide) lucide.createIcons();

// ===============================
// Portail université — toujours public, jamais de friction. Le lien
// officiel s'ouvre immédiatement, comme n'importe quel lien externe.
// ===============================
if (universityPortalBtn) {

if (university.officialWebsite) {
universityPortalBtn.href = university.officialWebsite;
} else {
universityPortalBtn.addEventListener("click", (event) => {
event.preventDefault();
alert("Le site de l'université sera ajouté prochainement.");
});
}

universityPortalBtn.addEventListener("click", () => {
trackEvent("university_portal_opened", {
country: university.country,
university: university.university
});
});

}

// ===============================
// Portail de candidature — réservé aux abonnés (voir isPaidUser
// ci-dessus), jamais visible d'un visiteur public quelle que soit la
// page. Un abonné voit toujours les 2 liens, y compris Pass Express et
// Premier Dossier : cette règle est indépendante de ce que leur formule
// débloque par ailleurs dans l'espace étudiant.
// ===============================
if (applyBtn) {

applyBtn.hidden = !isPaidUser;
if (applicationPortalLocked) applicationPortalLocked.hidden = isPaidUser;

if (isPaidUser) {

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

// Retour automatique depuis eligibility-test.html (voir buildReturnUrl/
// renderDiagnosticPrompt) : le test vient d'être complété pour CE
// programme précis, pas la peine de faire recliquer "Analyser mon
// profil" — le diagnostic se relance de lui-même et défile jusqu'à lui.
if (params.get("fromTest") === "1" && sessionStorage.getItem("eligibilityResponses") && diagnosticResult) {
renderDiagnostic(diagnosticResult, university);
diagnosticResult.scrollIntoView({ behavior: "smooth", block: "center" });
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
