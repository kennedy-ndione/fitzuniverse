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
PLAN_PREINSCRIPTION_ORDER,
PLAN_PREINSCRIPTION_LABELS,
resolveFeatureFlags,
DROITS_PASS
} from "../js/plan-features.js";

import { initSidebarToggle } from "./sidebar-toggle.js";
import { hidePageLoader } from "../js/app-shell.js";
// Lot FINITIONS-VISUELLES (2026-09-11) : un seul nommage pour l'admin.
import { formulesAdmin, etiquetteAdmin, TITRE_EN_VENTE, TITRE_RETIREES, PASS_ID } from "../js/formules-admin.js";

initSidebarToggle();

// Les colonnes, dans l'ordre de l'admin : Gratuit, puis les offres en
// vente (le Pass Découverte, les bourses, puis la France), puis les
// formules retirées sous leur titre.
//
// LE PASS DÉCOUVERTE A SA COLONNE depuis le 2026-09-23 (demande de
// Charles : « je ne vois pas la formule Découverte »). Elle est EN
// LECTURE SEULE : ses droits ne viennent pas de config/planFeatures mais
// de DROITS_PASS (js/plan-features.js), que decideVerrou() applique. Une
// case modifiable ici n'aurait rien changé pour l'étudiant — l'admin
// aurait cru ouvrir un outil qui restait fermé. La colonne montre donc
// la vérité du code, grisée, et n'écrit jamais rien.
const GROUPES = (() => {
const { enVente, retirees } = formulesAdmin({ pass: true, avecGratuit: false });
return [
{ titre: "", ids: ["gratuit"] },
{ titre: TITRE_EN_VENTE, ids: enVente },
{ titre: TITRE_RETIREES, ids: retirees }
];
})();
const COLONNES = GROUPES.flatMap((g) => g.ids);

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

// Lot FINITIONS-VISUELLES : une rangée de TITRES DE GROUPE au-dessus des
// colonnes — « En vente », puis « Retirées de la vente — anciens
// comptes » — et chaque colonne porte l'étiquette de l'admin.
const thead = head.parentElement;
thead.querySelectorAll(".plans-group-row").forEach((tr) => tr.remove());
const groupes = document.createElement("tr");
groupes.className = "plans-group-row";
groupes.innerHTML = `<td></td>` + GROUPES.map((g) => `<th scope="colgroup" colspan="${g.ids.length}" class="plans-group-title${g.titre ? "" : " is-empty"}">${g.titre}</th>`).join("");
thead.insertBefore(groupes, head);

COLONNES.forEach((planId) => {

const th = document.createElement("th");
th.setAttribute("scope", "col");
th.textContent = etiquetteAdmin(planId);
head.appendChild(th);

});

// La légende reprend les mêmes étiquettes (plus de pastilles écrites en
// dur dans plans.html — « Avancé » y a survécu un mois).
const legende = document.querySelector(".plans-legend");
if (legende) {
legende.innerHTML = GROUPES.filter((g) => g.ids.length && g.titre).map((g) => `<div class="plans-legend-group"><span class="plans-legend-title">${g.titre}</span>${g.ids.map((id) => `<span class="plans-legend-item"><span class="status-pill plan-${id}">${etiquetteAdmin(id)}</span></span>`).join("")}</div>`).join("");
}

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
${COLONNES.map((planId) => planId === PASS_ID ? `
<td>
<label class="plan-toggle is-fige" title="Fixé par le code : le Pass Découverte ouvre uniquement « Discuter avec Fitz » et « Signaler un problème ».">
<input type="checkbox" disabled aria-label="${label} — Pass Découverte (fixé, non modifiable)" ${DROITS_PASS.includes(key) ? "checked" : ""}>
<span class="plan-toggle-track"><span class="plan-toggle-thumb"></span></span>
</label>
</td>
` : `
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

// Seules les cases modifiables (data-plan) écrivent : la colonne du Pass
// est désactivée et ne porte ni data-key ni data-plan.
tbody.querySelectorAll('input[type="checkbox"][data-plan]').forEach((input) => {

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
