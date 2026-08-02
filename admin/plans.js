import { auth, db } from "../firebase-config.js";

import {
onAuthStateChanged,
signOut
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
doc,
getDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import { getPlanFeatureConfig, savePlanFeatureConfig } from "./firebase-admin.js";

import {
FEATURE_CATALOG,
PLAN_ORDER,
PLAN_LABELS,
resolveFeatureFlags
} from "../js/plan-features.js";

import { initSidebarToggle } from "./sidebar-toggle.js";
import { hidePageLoader } from "../js/app-shell.js";

initSidebarToggle();

// État local en mémoire : copie éditable des indicateurs, initialisée
// à partir de resolveFeatureFlags() (valeurs par défaut fusionnées
// avec ce qui existe déjà dans Firestore). Rien n'est écrit tant que
// l'administrateur n'a pas cliqué sur "Enregistrer".
let featureFlags = {};

// L'en-tête suit PLAN_ORDER au lieu d'être figé dans plans.html : le
// nombre de colonnes du corps en dépend déjà, les deux ne peuvent plus
// diverger quand une formule est ajoutée.
function renderHead() {

const head = document.getElementById("plansTableHead");

if (!head) return;

head.querySelectorAll("th:not(:first-child)").forEach((th) => th.remove());

PLAN_ORDER.forEach((planId) => {

const th = document.createElement("th");
th.setAttribute("scope", "col");
th.textContent = PLAN_LABELS[planId];
head.appendChild(th);

});

}

function renderTable() {

renderHead();

const tbody = document.getElementById("plansTableBody");
tbody.innerHTML = "";

FEATURE_CATALOG.forEach(({ key, label, description }) => {

const row = document.createElement("tr");

row.innerHTML = `
<td class="is-name">
<div>${label}</div>
<div class="plans-feature-description">${description}</div>
</td>
${PLAN_ORDER.map((planId) => `
<td>
<label class="plan-toggle">
<input type="checkbox" data-key="${key}" data-plan="${planId}" ${featureFlags[key][planId] ? "checked" : ""}>
<span class="plan-toggle-track"><span class="plan-toggle-thumb"></span></span>
</label>
</td>
`).join("")}
`;

tbody.appendChild(row);

});

tbody.querySelectorAll('input[type="checkbox"]').forEach((input) => {

input.addEventListener("change", () => {

featureFlags[input.dataset.key][input.dataset.plan] = input.checked;

});

});

}

// ==========================================================
// Chargement principal
// ==========================================================

const pageLoader = document.getElementById("pageLoader");
const content = document.querySelector(".content");

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

let rawConfig = null;

try {
rawConfig = await getPlanFeatureConfig();
} catch (error) {
console.warn("Impossible de lire la configuration des formules, utilisation des valeurs par défaut :", error);
}

featureFlags = resolveFeatureFlags(rawConfig);

renderTable();

if (window.lucide) lucide.createIcons();

hidePageLoader();

} catch (error) {

console.error("Erreur de chargement de la gestion des formules :", error);

if (content) {
content.style.display = "";
content.innerHTML = `
<div style="padding:40px;text-align:center;">
<h2>Impossible de charger la gestion des formules</h2>
<p>Vérifiez votre connexion Internet, puis réessayez.</p>
<button onclick="window.location.reload()">Réessayer</button>
</div>
`;
}

if (pageLoader) pageLoader.style.display = "none";

}

});

document.getElementById("savePlansBtn").addEventListener("click", async () => {

const button = document.getElementById("savePlansBtn");
const note = document.getElementById("plansSaveNote");

button.disabled = true;

try {

await savePlanFeatureConfig(featureFlags);

note.textContent = "Enregistré — les étudiants verront ces changements dès leur prochain chargement du tableau de bord.";

} catch (error) {

console.error(error);
note.textContent = "Impossible d'enregistrer les modifications. Vérifiez votre connexion, puis réessayez.";

} finally {

button.disabled = false;

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
alert("Erreur lors de la déconnexion.");
logoutBtn.dataset.busy = "false";

}

});

}
