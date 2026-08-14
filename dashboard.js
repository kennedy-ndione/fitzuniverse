import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { calculateAiScore } from "./js/profile-score.js";
import { initShellChrome, bootstrapShell, PLAN_LABELS, nextPlanId, unlockingPlans } from "./js/app-shell.js";
import { recommendPrograms } from "./js/recommend-programs.js";
import { randomFitzTip } from "./js/fitz-voice.js";
import { computeJourneySteps, isJourneyComplete } from "./js/application-journey.js";

// Les données utilisateur (profil, score) vivent désormais dans Firestore
// (collection "users", comme sur profile.js) et non plus dans localStorage.
// Cette clé locale est conservée uniquement pour nettoyer l'ancien cache
// des navigateurs qui l'auraient encore, afin d'éviter des données obsolètes
// (déjà nettoyée à ce stade par resolveSession(), voir js/access-guard.js —
// gardée ici en filet pour la migration ai-letter.js ci-dessous, qui elle
// n'a pas d'équivalent générique).
function readStorage(key, fallback) {
try {
const value = JSON.parse(localStorage.getItem(key));
return value || fallback;
} catch {
return fallback;
}
}

// Nombre réel d'opportunités compatibles avec le profil de l'étudiant
// — même jointure programs/universities/scholarships et même moteur
// de score que seedRecommendedSlots()/replaceRecommendation() dans
// applications.js (js/recommend-programs.js), jamais une deuxième
// façon de compter. On ne garde que les entrées dont le score est
// strictement positif (au moins un critère de profil réellement
// atteint — niveau, pays, langue, ou statut ouvert) : sans ce filtre,
// recommendPrograms() renverrait une entrée par université du
// catalogue entier, compatible ou non.
async function countCompatibleOpportunities(profile) {

try {

const [programsSnap, universitiesSnap, scholarshipsSnap] = await Promise.all([
getDocs(collection(db, "programs")),
getDocs(collection(db, "universities")),
getDocs(collection(db, "scholarships"))
]);

const programs = programsSnap.docs.map((d) => ({ firestoreId: d.id, ...d.data() }));
const universitiesById = new Map(universitiesSnap.docs.map((d) => [d.id, { firestoreId: d.id, ...d.data() }]));
const scholarshipsById = new Map(scholarshipsSnap.docs.map((d) => [d.id, { firestoreId: d.id, ...d.data() }]));

const matches = recommendPrograms({
profile: profile || {},
programs,
universitiesById,
scholarshipsById,
count: programs.length
});

return matches.filter((m) => m.score > 0).length;

} catch (error) {

console.warn("Impossible de calculer les opportunités compatibles :", error);
return 0;

}

}

// ==========================================================
// EXPÉRIENCE SELON LA FORMULE (Essentiel / Avancé / Premium)
// ==========================================================
// planId/featureFlags/testerAccess/hasFitzExpress viennent désormais de
// bootstrapShell() (js/app-shell.js), qui applique déjà lui-même le
// verrouillage générique des [data-feature] (is-locked + href) et la
// visibilité de "Mon conseiller" — dashboard.js n'a plus qu'à compléter
// le texte des tuiles Fitz (voir renderToolCardLockOverlays ci-dessous),
// spécifique à ce balisage "tool-card" que les autres pages n'ont pas.

// Complète, pour les tuiles "tool-card" du tableau de bord uniquement, le
// texte de l'overlay de verrouillage (label + CTA) — le verrouillage
// lui-même (classe is-locked, href) est déjà posé par bootstrapShell()
// avant que cette fonction ne s'exécute.
function renderToolCardLockOverlays(planId, featureFlags) {

document.querySelectorAll("[data-feature].is-locked").forEach((el) => {

const lockOverlay = el.querySelector(".tool-card-lock");
if (!lockOverlay) return;

const flags = featureFlags[el.dataset.feature];
if (!flags) return;

const plans = unlockingPlans(planId, flags);

const label = lockOverlay.querySelector("span:not(.tool-card-lock-cta)");
const cta = lockOverlay.querySelector(".tool-card-lock-cta");

if (label) {
label.textContent = plans.length
? `Disponible avec ${plans.map((p) => PLAN_LABELS[p]).join(" / ")}`
: "Non incluse pour le moment";
}

if (cta) {
cta.textContent = "Choisir ma formule";
}

});

}

// Un Pass Fitz Express actif sans formule payante donne uniquement
// accès au chat Fitz (verrouillage générique de bootstrapShell) — mais
// tant qu'il reste grisé-avec-CTA comme les autres outils, la sidebar
// affiche 7 liens verrouillés en plus du chat, ce qui ne correspond pas
// à ce qu'est réellement le Pass Express (une assistance ponctuelle de
// 14 jours, pas un aperçu d'un vrai espace de candidature). On masque
// donc entièrement ces 7 fonctionnalités plutôt que de les griser —
// seul le chat Fitz reste visible, en plus des 3 pages toujours
// ouvertes (tableau de bord, profil, paramètres) et des pages publiques
// (universités, bourses).
const FITZ_EXPRESS_HIDDEN_FEATURES = ["applications", "documents", "ai_letter", "ai_check", "ai_email", "ai_translate", "compress"];

function applyFitzExpressRestriction(planId, hasFitzExpress) {

const isFitzExpressOnly = hasFitzExpress && planId === "gratuit";

FITZ_EXPRESS_HIDDEN_FEATURES.forEach((key) => {

document.querySelectorAll(`[data-feature="${key}"]`).forEach((el) => {
el.hidden = isFitzExpressOnly;
});

});

}

function renderFitzExpressBanner(planId, hasFitzExpress, fitzExpressExpiresAt) {

const banner = document.getElementById("fitzExpressBanner");

if (!banner) return;

if (!hasFitzExpress || planId !== "gratuit" || !fitzExpressExpiresAt) {
banner.hidden = true;
return;
}

const expiry = new Date(fitzExpressExpiresAt);

if (isNaN(expiry)) {
banner.hidden = true;
return;
}

const daysLeft = Math.max(0, Math.ceil((expiry.getTime() - Date.now()) / 86400000));

document.getElementById("fitzExpressDaysLeft").textContent =
daysLeft <= 1 ? "moins d'1 jour" : `${daysLeft} jours`;

banner.hidden = false;

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

function daysUntilDeadline(deadline) {

if (!deadline) return null;

const target = new Date(`${deadline}T00:00:00`);
const today = new Date();

target.setHours(0, 0, 0, 0);
today.setHours(0, 0, 0, 0);

return Math.round((target - today) / 86400000);

}

// Candidature dont l'échéance approche (deadline dans les 14 jours,
// ou déjà dépassée) ET dont le parcours guidé (js/application-journey.js)
// n'est pas encore complet — l'étudiant ne doit pas la découvrir tout
// seul sur applications.html. N'inclut pas l'étape "Revue conseiller"
// (js/application-journey.js) dans ce calcul grossier : elle
// nécessiterait de charger users/{uid}/advisorRequests en plus, pour
// une carte qui ne fait de toute façon que pointer vers
// applications.html (seule cette page affiche le détail des 5 étapes).
function findUrgentIncompleteApplication(applications, profileScore) {

const candidates = applications
.map((app) => {

const daysLeft = daysUntilDeadline(app.deadline);
if (daysLeft === null || daysLeft > 14) return null;

const steps = computeJourneySteps(app, { profileScore });
if (isJourneyComplete(steps)) return null;

return { app, daysLeft };

})
.filter(Boolean)
.sort((a, b) => a.daysLeft - b.daysLeft);

return candidates[0] || null;

}

function renderCoachPanel({ profileScore, documentsCount, scholarshipsCount, urgentApplication }) {

const container = document.getElementById("coachList");

if (!container) return;

const items = [];

if (urgentApplication) {

const { app, daysLeft } = urgentApplication;

items.push({
icon: "alarm-clock",
title: `${app.university} approche de sa date limite`,
text: daysLeft < 0
? `Date limite dépassée de ${Math.abs(daysLeft)} j — le parcours de cette candidature n'est pas encore complet.`
: `Encore ${daysLeft} j avant la date limite, et le parcours de cette candidature n'est pas encore complet.`,
href: "applications.html",
cta: "Voir ma candidature"
});

}

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

// Pointe vers universities.html plutôt que results.html : cette
// dernière dépend du sessionStorage du diagnostic anonyme
// (eligibility-questions.html), pas du profil Firestore persistant —
// un étudiant connecté dont la session a expiré (autre appareil,
// cache vidé) s'y retrouvait renvoyé au questionnaire alors qu'il a
// déjà un profil rempli. universities.html est public et déjà
// pensé pour explorer librement le catalogue (voir memory
// universities_ungated_2026-07-30), sans dépendre d'aucune session.
items.push({
icon: "compass",
title: "Découvrez vos opportunités",
text: scholarshipsCount > 0
? `${scholarshipsCount} opportunité${scholarshipsCount > 1 ? "s" : ""} correspondent actuellement à votre profil.`
: "Complétez votre profil pour révéler vos opportunités compatibles.",
href: "universities.html",
cta: "Explorer les universités"
});

items.push({
icon: "sparkles",
title: "Conseil Fitz",
text: randomFitzTip(),
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

function renderPlanExperience(planId, coachData, featureFlags, testerAccess, hasFitzExpress, fitzExpressExpiresAt) {

renderToolCardLockOverlays(planId, featureFlags);
applyFitzExpressRestriction(planId, hasFitzExpress);
renderFitzExpressBanner(planId, hasFitzExpress, fitzExpressExpiresAt);
renderUpgradeNudge(planId, testerAccess);
renderCoachPanel(coachData);

if (window.lucide) lucide.createIcons();

}

initShellChrome();

bootstrapShell().then(async (session) => {

if (!session) return;

const { user, userData, profile, planId, featureFlags, testerAccess, hasFitzExpress } = session;

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

document.getElementById("welcomeMessage").textContent =
`Bonjour ${user.displayName || userData.name || "Étudiant"}`;

const aiScoreValue = calculateAiScore(profile);
const documentsCountValue = readStorage("generatedDocuments", []).length;

document.getElementById("aiScore").textContent = aiScoreValue;
document.getElementById("documentsCount").textContent = documentsCountValue;

// Calculé après les compteurs synchrones ci-dessus (pas de dépendance
// réseau) pour ne pas retarder leur affichage — le tableau de bord se
// peuple progressivement plutôt que d'attendre Firestore pour tout
// afficher d'un coup.
const scholarshipsCountValue = await countCompatibleOpportunities(profile);

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

// Discret, jamais bloquant : n'affiche rien si le réglage n'existe pas
// encore dans Firestore (comptes créés avant son ajout — voir
// js/account-actions.js) ni si l'étudiant l'a déjà activé.
const emailNudge = document.getElementById("emailNudge");
if (emailNudge) emailNudge.hidden = userData.emailNotifications === true;

let urgentApplication = null;

try {

const applicationsSnap = await getDocs(collection(db, "users", user.uid, "applications"));
const applications = applicationsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

urgentApplication = findUrgentIncompleteApplication(applications, aiScoreValue);

} catch (error) {

console.error("Impossible de charger les candidatures pour le panneau coach :", error);

}

renderPlanExperience(planId, {
profileScore: aiScoreValue,
documentsCount: documentsCountValue,
scholarshipsCount: scholarshipsCountValue,
urgentApplication
}, featureFlags, testerAccess, hasFitzExpress, userData.fitzExpressExpiresAt || null);

});
