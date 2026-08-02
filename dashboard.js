import { auth, db } from "./firebase-config.js";
import {
onAuthStateChanged,
signOut
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import {
doc,
getDoc,
setDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import { calculateAiScore } from "./js/profile-score.js";
import { initMessagesPanel } from "./js/student-messages.js";
import { PLAN_ORDER, PLAN_LABELS, resolveFeatureFlags } from "./js/plan-features.js";
import { resolvePlan, hasFitzExpressAccess } from "./js/access-guard.js";
import { hidePageLoader } from "./js/app-shell.js";

// Les données utilisateur (profil, score) vivent désormais dans Firestore
// (collection "users", comme sur profile.js) et non plus dans localStorage.
// Cette clé locale est conservée uniquement pour nettoyer l'ancien cache
// des navigateurs qui l'auraient encore, afin d'éviter des données obsolètes.
const LEGACY_USERS_KEY = "users";

function readStorage(key, fallback) {
try {
const value = JSON.parse(localStorage.getItem(key));
return value || fallback;
} catch {
return fallback;
}
}

function createDefaultProfile(user) {
return {
name: user.name || "",
email: user.email || "",
originCountry: "",
age: "",
currentDegree: "",
academicAverage: "",
englishLevel: "",
desiredField: "",
desiredCountry: ""
};
}

const scholarshipLevels = [
"Licence","Master","Doctorat",
"Licence","Master","Doctorat",
"Licence","Master","Doctorat",
"Licence","Master","Doctorat",
"Licence","Master","Doctorat",
"Licence","Master","Doctorat",
"Licence","Master","Doctorat",
"Licence","Master","Doctorat",
"Licence","Master","Doctorat",
"Licence","Master","Doctorat"
];

function normalizeLevel(level) {

const text = String(level || "").toLowerCase();

if (text.includes("doctor") || text.includes("phd"))
return "Doctorat";

if (text.includes("master"))
return "Master";

if (text.includes("licence") || text.includes("bachelor"))
return "Licence";

return "";
}

function countRecommendations(profile) {

const selectedLevel = normalizeLevel(profile.currentDegree);

if (!selectedLevel) {
return scholarshipLevels.length;
}

return scholarshipLevels.filter(level =>
level === selectedLevel
).length;
}

// ==========================================================
// EXPÉRIENCE SELON LA FORMULE (Essentiel / Avancé / Premium)
// ==========================================================
// resolvePlan()/hasFitzExpressAccess() viennent désormais de
// js/access-guard.js (source unique — cette page définissait auparavant
// sa propre copie de resolvePlan(), qui a bien failli diverger de
// l'originale lors de l'ajout de la vérification d'expiration). Ce
// fichier ne fait toujours aucune écriture Firestore ici.

const FITZ_TIPS = [
"Une lettre de motivation efficace commence toujours par une accroche personnelle, unique à votre parcours.",
"Vérifiez régulièrement les dates limites de vos candidatures suivies pour garder une longueur d'avance sur vos échéances.",
"Un dossier avec des documents traduits et certifiés a plus de chances d'être traité rapidement.",
"Préparez vos réponses aux questions d'entretien classiques avant même de recevoir une invitation."
];

function nextPlanId(planId) {
const index = PLAN_ORDER.indexOf(planId);
if (index === -1 || index === PLAN_ORDER.length - 1) return null;
return PLAN_ORDER[index + 1];
}

// Verrouillage piloté par le Module 4 du Control Center (Gestion des
// formules, admin/plans.js) plutôt que par un seuil de palier codé en
// dur : chaque [data-feature] est verrouillé ou non selon
// featureFlags[clé][planId], calculé par resolveFeatureFlags()
// (js/plan-features.js) à partir de config/planFeatures + des valeurs
// par défaut. Pour un lien/carte verrouillé, on redirige vers
// offers.html plutôt que vers l'outil réel : rien n'est jamais
// techniquement bloqué côté serveur, seulement mis en avant côté UI.
function applyFeatureLocks(planId, featureFlags, testerAccess, hasFitzExpress) {

document.querySelectorAll("[data-feature]").forEach((el) => {

const key = el.dataset.feature;
const flags = featureFlags[key];

// Clé inconnue de js/plan-features.js : ne jamais verrouiller par
// erreur un outil non répertorié.
if (!flags) return;

// testerAccess (users/{uid}.testerAccess, réservé à l'admin — voir
// js/access-guard.js) débloque tout pour CE compte précis, sans
// jamais changer ce que voient les autres utilisateurs. Un Pass Fitz
// Express actif débloque uniquement "ai_chat" (voir pricing-plans.js
// — ce n'est pas une formule, il ne touche à rien d'autre).
const isLocked = !testerAccess && !(hasFitzExpress && key === "ai_chat") && flags[planId] === false;

const link = el.matches("a") ? el : el.querySelector("a[data-real-href]");

if (!link) return;

el.classList.toggle("is-locked", isLocked);

if (isLocked) {

const unlockingPlans = PLAN_ORDER.filter((p) => p !== planId && flags[p]);
const targetPlan = unlockingPlans[0] || null;

link.setAttribute("href", targetPlan ? `offers.html#${targetPlan}` : "offers.html");

const lockOverlay = el.querySelector(".tool-card-lock");

if (lockOverlay) {

const label = lockOverlay.querySelector("span:not(.tool-card-lock-cta)");
const cta = lockOverlay.querySelector(".tool-card-lock-cta");

if (label) {
label.textContent = unlockingPlans.length
? `Disponible avec ${unlockingPlans.map((p) => PLAN_LABELS[p]).join(" / ")}`
: "Non incluse pour le moment";
}

if (cta) {
cta.textContent = targetPlan ? `Découvrir ${PLAN_LABELS[targetPlan]}` : "Découvrir nos formules";
}

}

} else if (link.dataset.realHref) {

link.setAttribute("href", link.dataset.realHref);

}

});

}

function renderUpgradeNudge(planId, testerAccess) {

const section = document.getElementById("upgradeNudge");

if (!section) return;

// Proposer une "mise à niveau" à un compte qui a déjà un accès complet
// de test n'aurait aucun sens et contredirait le reste de la page.
if (testerAccess) {
section.hidden = true;
return;
}

const next = nextPlanId(planId);
const hasPlanData = typeof SCHOLARBRIDGE_PLANS !== "undefined" && SCHOLARBRIDGE_PLANS[next];

if (!next || !hasPlanData) {
section.hidden = true;
return;
}

const nextPlan = SCHOLARBRIDGE_PLANS[next];

section.hidden = false;

document.getElementById("upgradeCurrentPlan").textContent = PLAN_LABELS[planId];
// Libellé d'interface (PLAN_LABELS), pas le nom de marque long porté
// par SCHOLARBRIDGE_PLANS — voir la règle dans js/plan-features.js.
document.getElementById("upgradeNextPlan").textContent = PLAN_LABELS[next];

const list = document.getElementById("upgradeHighlights");
list.innerHTML = "";

(nextPlan.highlights || []).forEach((item) => {

const li = document.createElement("li");
li.innerHTML = `<i data-lucide="check"></i><span></span>`;
li.querySelector("span").textContent = item;
list.appendChild(li);

});

document.getElementById("upgradeCta").setAttribute("href", `offers.html#${next}`);

}

function renderCoachPanel({ profileScore, documentsCount, scholarshipsCount }) {

const container = document.getElementById("coachList");

if (!container) return;

const items = [];

if (profileScore < 7) {
items.push({
icon: "user-round",
title: "Complétez votre profil",
text: "Un profil complet permet à Fitz d'affiner ses recommandations.",
href: "profile.html",
cta: "Compléter mon profil"
});
}

if (documentsCount === 0) {
items.push({
icon: "file-text",
title: "Préparez vos documents",
text: "Commencez votre lettre de motivation ou votre CV avec Fitz.",
href: "documents.html",
cta: "Voir mes documents"
});
}

items.push({
icon: "compass",
title: "Découvrez vos opportunités",
text: scholarshipsCount > 0
? `${scholarshipsCount} opportunité${scholarshipsCount > 1 ? "s" : ""} correspondent actuellement à votre profil.`
: "Complétez votre profil pour révéler vos opportunités compatibles.",
href: "results.html",
cta: "Voir mon diagnostic"
});

items.push({
icon: "sparkles",
title: "Conseil Fitz",
text: FITZ_TIPS[Math.floor(Math.random() * FITZ_TIPS.length)],
href: "ai-chat.html",
cta: "Discuter avec Fitz"
});

container.innerHTML = "";

items.slice(0, 4).forEach((item) => {

const card = document.createElement("article");
card.className = "coach-card";

card.innerHTML = `
<div class="coach-card-icon"><i data-lucide="${item.icon}"></i></div>
<div class="coach-card-body">
<h3></h3>
<p></p>
<a class="coach-card-link"><span></span><i data-lucide="arrow-right"></i></a>
</div>
`;

card.querySelector("h3").textContent = item.title;
card.querySelector("p").textContent = item.text;

const link = card.querySelector(".coach-card-link");
link.setAttribute("href", item.href);
link.querySelector("span").textContent = item.cta;

container.appendChild(card);

});

}

function renderPlanExperience(planId, coachData, featureFlags, testerAccess, hasFitzExpress) {

document.body.dataset.plan = planId;

const planBadge = document.getElementById("planBadge");
if (planBadge) planBadge.textContent = testerAccess ? `${PLAN_LABELS[planId]} · Accès test` : PLAN_LABELS[planId];

const topbarPlanLabel = document.getElementById("topbarPlanLabel");
if (topbarPlanLabel) topbarPlanLabel.textContent = PLAN_LABELS[planId];

applyFeatureLocks(planId, featureFlags, testerAccess, hasFitzExpress);
renderUpgradeNudge(planId, testerAccess);
renderCoachPanel(coachData);

if (window.lucide) lucide.createIcons();

}

// ==========================================================
// SIDEBAR — repli desktop, tiroir mobile (interface uniquement,
// aucune dépendance aux données utilisateur)
// ==========================================================

function initSidebar() {

const SIDEBAR_COLLAPSE_KEY = "scholarbridge_sidebar_collapsed";

const collapseBtn = document.getElementById("sidebarCollapseBtn");
const openBtn = document.getElementById("sidebarOpenBtn");
const backdrop = document.getElementById("sidebarBackdrop");

if (localStorage.getItem(SIDEBAR_COLLAPSE_KEY) === "true") {
document.body.classList.add("sidebar-collapsed");
if (collapseBtn) collapseBtn.setAttribute("aria-expanded", "false");
}

if (collapseBtn) {

collapseBtn.addEventListener("click", () => {

const collapsed = document.body.classList.toggle("sidebar-collapsed");

collapseBtn.setAttribute("aria-expanded", String(!collapsed));
localStorage.setItem(SIDEBAR_COLLAPSE_KEY, String(collapsed));

});

}

function closeMobileSidebar() {
document.body.classList.remove("sidebar-open");
}

if (openBtn) {

openBtn.addEventListener("click", () => {
document.body.classList.add("sidebar-open");
});

}

if (backdrop) {
backdrop.addEventListener("click", closeMobileSidebar);
}

document.addEventListener("keydown", (event) => {
if (event.key === "Escape") closeMobileSidebar();
});

document.querySelectorAll(".sidebar .nav-link, .sidebar-logout").forEach((el) => {
el.addEventListener("click", closeMobileSidebar);
});

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

}, { threshold: 0.1 });

items.forEach((item) => observer.observe(item));

}

initSidebar();
initReveal();

if (window.lucide) lucide.createIcons();

// =======================
// FIREBASE
// =======================

const dashboardContent = document.querySelector(".content");

function showLoadError() {
if (dashboardContent) {
dashboardContent.style.display = "";
dashboardContent.innerHTML = `
<div style="padding:40px;text-align:center;">
<h2>Votre tableau de bord n'a pas pu s'afficher</h2>
<p>Vérifiez votre connexion Internet, puis réessayez — nous serons ravis de vous retrouver.</p>
<button onclick="window.location.reload()">Réessayer</button>
</div>
`;
}
}

onAuthStateChanged(auth, async (firebaseUser) => {

if (!firebaseUser) {
window.location.replace("login.html");
return;
}

// Nettoyage ponctuel de l'ancien cache localStorage (données désormais
// stockées dans Firestore, comme sur la page profil).
if (localStorage.getItem(LEGACY_USERS_KEY)) {
localStorage.removeItem(LEGACY_USERS_KEY);
}

// Migration ponctuelle : ai-letter.js utilisait auparavant la clé
// "documents" au lieu de "generatedDocuments" (utilisée par
// ai-email.js/ai-translate.js/documents.html). On rapatrie les documents
// déjà générés par d'anciens utilisateurs pour ne rien perdre.
const legacyDocuments = readStorage("documents", null);
if (legacyDocuments && legacyDocuments.length) {
const merged = [
...legacyDocuments,
...readStorage("generatedDocuments", [])
];
localStorage.setItem("generatedDocuments", JSON.stringify(merged));
localStorage.removeItem("documents");
}

try {

const userRef = doc(db, "users", firebaseUser.uid);
let userSnap = await getDoc(userRef);

// Auto-guérison : si le document Firestore n'existe pas (ex. l'écriture
// avait échoué pendant l'inscription), on le recrée avec des valeurs
// par défaut au lieu de bloquer l'utilisateur.
if (!userSnap.exists()) {

const defaultData = {
uid: firebaseUser.uid,
name: firebaseUser.displayName || "",
email: firebaseUser.email || "",
createdAt: serverTimestamp(),
profile: createDefaultProfile({
name: firebaseUser.displayName || "",
email: firebaseUser.email || ""
})
};

await setDoc(userRef, defaultData);
userSnap = await getDoc(userRef);

}

const userData = userSnap.data();

// Suspension de compte (Module 3 du Control Center admin) : un
// administrateur peut poser userData.disabled=true depuis
// admin/student-detail.js. Tant qu'aucun Cloud Function n'existe,
// ceci ne désactive pas réellement le compte Firebase Auth (voir
// firestore.rules) — seul l'accès applicatif est bloqué ici.
if (userData.disabled === true) {
window.location.replace("suspended.html");
return;
}

const profile = Object.assign(
createDefaultProfile(userData),
userData.profile || {}
);

document.getElementById("welcomeMessage").textContent =
`Bonjour ${firebaseUser.displayName || userData.name || "Étudiant"}`;

const aiScoreValue = calculateAiScore(profile);
const documentsCountValue = readStorage("generatedDocuments", []).length;
const scholarshipsCountValue = countRecommendations(profile);

document.getElementById("aiScore").textContent = aiScoreValue;
document.getElementById("documentsCount").textContent = documentsCountValue;
document.getElementById("totalScholarships").textContent = scholarshipsCountValue;

const welcomeAlert = document.getElementById("welcomeAlert");

if (sessionStorage.getItem("just_created") === "true") {

welcomeAlert.hidden = false;

sessionStorage.removeItem("just_created");

}

// Affiché une seule fois, au premier chargement du tableau de bord
// après une activation d'accompagnement. Le flag `just_upgraded` est
// prévu pour être posé par le futur backend de paiement (voir
// requestActivation() dans payment.js) avant de rediriger l'étudiant
// ici — tant que ce backend n'existe pas, rien ne pose ce flag et ce
// bloc reste silencieux, comme les autres éléments "prêts mais pas
// encore branchés" de ce projet (ScholarBridgeAI.isSimulated, etc.).
const accompagnementAlert = document.getElementById("accompagnementAlert");

if (sessionStorage.getItem("just_upgraded")) {

const upgradedPlanLabel = sessionStorage.getItem("just_upgraded");

document.getElementById("accompagnementAlertTitle").textContent =
`Votre accompagnement ${upgradedPlanLabel} est activé.`;

accompagnementAlert.hidden = false;

sessionStorage.removeItem("just_upgraded");

}

// Configuration des fonctionnalités par formule (Module 4 du Control
// Center). Isolée dans son propre try/catch : un souci réseau ou de
// permissions sur cette seule lecture ne doit jamais empêcher le
// reste du tableau de bord de s'afficher — resolveFeatureFlags(null)
// retombe alors sur le verrouillage par défaut (identique à l'ancien
// comportement codé en dur).
let planFeaturesConfig = null;

try {
const planFeaturesSnap = await getDoc(doc(db, "config", "planFeatures"));
planFeaturesConfig = planFeaturesSnap.exists() ? planFeaturesSnap.data() : null;
} catch (error) {
console.warn("Impossible de lire la configuration des formules, utilisation des valeurs par défaut :", error);
}

renderPlanExperience(resolvePlan(userData), {
profileScore: aiScoreValue,
documentsCount: documentsCountValue,
scholarshipsCount: scholarshipsCountValue
}, resolveFeatureFlags(planFeaturesConfig), userData.testerAccess === true, hasFitzExpressAccess(userData));

initMessagesPanel(firebaseUser.uid);

hidePageLoader();

} catch (error) {

console.error("Erreur de chargement du tableau de bord :", error);
showLoadError();

}

});

// =======================
// Déconnexion
// =======================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

logoutBtn.addEventListener("click", async () => {

if (logoutBtn.dataset.busy === "true") return;
logoutBtn.dataset.busy = "true";

try {

await signOut(auth);

localStorage.removeItem(LEGACY_USERS_KEY);

window.location.replace("index.html");

} catch (error) {

console.error(error);
alert("Un souci est survenu au moment de la déconnexion. Réessayez dans un instant.");
logoutBtn.dataset.busy = "false";

}

});

}
