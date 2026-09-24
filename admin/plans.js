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
DROITS_PASS,
DROITS_UNIVERSELS
} from "../js/plan-features.js";

import { initSidebarToggle } from "./sidebar-toggle.js";
import { hidePageLoader } from "../js/app-shell.js";
// Lot FINITIONS-VISUELLES (2026-09-11) : un seul nommage pour l'admin.
import { formulesAdmin, etiquetteColonne, TITRE_EN_VENTE, TITRE_RETIREES, PASS_ID, PAYS_ADMIN, nomDuPays, voeuxDuPays } from "../js/formules-admin.js";

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
// Un groupe VIDE n'a pas de colonne : sans ce filtre, le titre
// « Retirées de la vente » restait affiché (colspan="0" vaut 1 pour le
// navigateur) alors qu'aucune formule n'est retirée depuis le 2026-09-24.
return [
{ titre: "", ids: ["gratuit"] },
{ titre: TITRE_EN_VENTE, ids: enVente },
{ titre: TITRE_RETIREES, ids: retirees }
].filter((g) => g.ids.length);
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
// Une offre préinscription vaut pour les neuf pays : « Dossier · 9 pays ».
th.textContent = etiquetteColonne(planId);
head.appendChild(th);

});

// La légende reprend les mêmes étiquettes (plus de pastilles écrites en
// dur dans plans.html — « Avancé » y a survécu un mois).
const legende = document.querySelector(".plans-legend");
if (legende) {
legende.innerHTML = GROUPES.filter((g) => g.ids.length && g.titre).map((g) => `<div class="plans-legend-group"><span class="plans-legend-title">${g.titre}</span>${g.ids.map((id) => `<span class="plans-legend-item"><span class="status-pill plan-${id}">${etiquetteColonne(id)}</span></span>`).join("")}</div>`).join("");
}

}

function renderTable() {

renderHead();

const tbody = document.getElementById("plansTableBody");
tbody.innerHTML = "";

FEATURE_CATALOG.forEach(({ key, label, description }) => {

const row = document.createElement("tr");

// MESSAGERIE POUR TOUS (2026-09-23) : une fonctionnalité de
// DROITS_UNIVERSELS est ouverte à tout compte par le code. Sa ligne est
// cochée et grisée dans TOUTES les colonnes : une case modifiable
// laisserait croire qu'on peut couper un étudiant de l'équipe.
if (DROITS_UNIVERSELS.includes(key)) {
row.classList.add("is-universel");
row.innerHTML = `
<td class="is-name">
<div>${label}</div>
<div class="plans-feature-description">${description}</div>
</td>
${COLONNES.map(() => `
<td>
<label class="plan-toggle is-fige" title="Ouvert à tous les comptes, gratuits compris — fixé par le code.">
<input type="checkbox" disabled checked aria-label="${label} — ouvert à tous les comptes (fixé, non modifiable)">
<span class="plan-toggle-track"><span class="plan-toggle-thumb"></span></span>
</label>
</td>
`).join("")}
`;
tbody.appendChild(row);
return;
}

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
// LES NEUF PAYS (2026-09-24) — ce qui se vend, pays par pays
// ==========================================================
function francs(n) {
return Number.isFinite(n) ? `${new Intl.NumberFormat("fr-FR").format(n)} F` : "—";
}

function renderPays() {
const tbody = document.getElementById("plansPaysBody");
if (!tbody) return;
const plans = window.SCHOLARBRIDGE_PLANS || {};
const offre = (planId, pays) => (typeof window.offrePourDestination === "function" ? window.offrePourDestination(planId, pays) : null) || plans[planId] || {};
tbody.innerHTML = PAYS_ADMIN.map((pays) => {
const v = voeuxDuPays(pays);
const dossier = offre("dossier-france", pays);
return `<tr>
<td class="is-name">${nomDuPays(pays)}</td>
<td class="is-nombre">${francs(offre("diagnostic-france", pays).priceFCFA)}</td>
<td class="is-nombre">${francs(dossier.priceFCFA)}</td>
<td class="is-nombre">${francs(offre("dossier-france-conseiller", pays).priceFCFA)}</td>
<td>${v === 1 ? "1 cours" : `${v} vœux`}</td>
<td>${pays === "france" ? "jusqu'au 31 juillet" : (dossier.duration || "12 mois")}</td>
<td><a class="table-link-btn" href="../preinscription-${pays}.html" target="_blank" rel="noopener" aria-label="Voir la page publique ${nomDuPays(pays)}">Voir</a></td>
</tr>`;
}).join("");
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
renderPays();

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

// On n'enregistre QUE les colonnes de la grille (2026-09-24) : les
// cases des anciennes formules, supprimées du site, qui dormaient
// encore dans config/planFeatures, disparaissent au premier
// enregistrement.
const colonnes = new Set(COLONNES.filter((id) => id !== PASS_ID));
const propre = {};
for (const [cle, parFormule] of Object.entries(featureFlags)) {
propre[cle] = Object.fromEntries(Object.entries(parFormule || {}).filter(([id]) => colonnes.has(id)));
}
await savePlanFeatureConfig(propre);

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
