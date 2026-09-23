import { auth, db } from "../firebase-config.js";

import {
onAuthStateChanged,
signOut
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
doc,
getDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import { getAllUsers } from "./firebase-admin.js";
import { initSidebarToggle } from "./sidebar-toggle.js";
import { ecouterPresence, pastillePresence } from "./presence-admin.js";
import { passSeul, resolvePlanPreinscription, PLAN_PREINSCRIPTION_ORDER } from "../js/plan-features.js";
import { resolvePlan } from "../js/access-guard.js";
import { hidePageLoader } from "../js/app-shell.js";
// Lot FINITIONS-VISUELLES (2026-09-11) : un seul nommage pour l'admin.
import { PASS_ID, etiquetteAdmin, etiquettesDuCompte, optionsFormules } from "../js/formules-admin.js";

initSidebarToggle();

let allUsers = [];

// « En ligne » (2026-09-23) : l'état de présence de chaque étudiant,
// rafraîchi en temps réel par admin/presence-admin.js. Tant que la
// première lecture n'est pas arrivée, personne n'est « en ligne ».
let etatDe = () => ({ enLigne: false, libelle: "…", vuLe: 0 });

// Le filtre « Toutes les formules » : les 7 offres en vente d'abord (Pass
// Découverte, bourses, France), puis les retirées sous leur titre de
// groupe — construit depuis PLAN_ORDER / PLAN_PREINSCRIPTION_ORDER et le
// Pass, jamais écrit en dur.
function construireFiltre() {
const sel = document.getElementById("planFilter");
if (!sel || sel.options.length) return;
sel.innerHTML = optionsFormules({ vide: "Toutes les formules", avecGratuit: true });
}

construireFiltre();

// Ce qu'un compte porte : formule bourse, offre France, ou Pass seul.
function resoudre(user) {
return {
planId: resolvePlan(user),
planPreinscriptionId: resolvePlanPreinscription(user),
passSeul: passSeul(user)
};
}

function formatDate(timestamp) {

if (!timestamp || typeof timestamp.toDate !== "function") return "-";

return timestamp.toDate().toLocaleDateString("fr-FR");

}

// La colonne « Formule » : la formule bourse ET l'offre France quand le
// compte a les deux ; « Pass Découverte » quand il n'a que lui (lot
// ACCEPTATION, partie 4), jamais « Gratuit » dans ce cas.
function planPill(user) {

return etiquettesDuCompte(resoudre(user))
.map(({ id, etiquette }) => `<span class="status-pill plan-${id}">${etiquette}</span>`)
.join(" ");

}

function statusPill(disabled) {

return disabled
? `<span class="status-pill is-disabled">Suspendu</span>`
: `<span class="status-pill is-active">Actif</span>`;

}

function matchesSearch(user, term) {

if (!term) return true;

const haystack = `${user.name || ""} ${user.email || ""}`.toLowerCase();

return haystack.includes(term);

}

function matchesPlan(user, planFilter) {

if (!planFilter) return true;

const r = resoudre(user);

// « Pass Découverte seul » : le Pass actif et rien d'autre.
if (planFilter === PASS_ID) return r.passSeul;

// Une offre France se lit sur planPreinscription, jamais sur plan.
if (PLAN_PREINSCRIPTION_ORDER.includes(planFilter)) return r.planPreinscriptionId === planFilter;

// « Gratuit » = aucune formule bourse, aucune offre France, pas le Pass.
if (planFilter === "gratuit") return r.planId === "gratuit" && !r.planPreinscriptionId && !r.passSeul;

return r.planId === planFilter;

}

function matchesStatus(user, statusFilter) {

if (!statusFilter) return true;

if (statusFilter === "online") return etatDe(user.uid).enLigne;

const isDisabled = user.disabled === true;

return statusFilter === "disabled" ? isDisabled : !isDisabled;

}

function renderTable() {

const term = document.getElementById("searchInput").value.trim().toLowerCase();
const planFilter = document.getElementById("planFilter").value;
const statusFilter = document.getElementById("statusFilter").value;

const filtered = allUsers.filter((user) =>
matchesSearch(user, term) &&
matchesPlan(user, planFilter) &&
matchesStatus(user, statusFilter)
)
// Les étudiants en ligne d'abord, puis du plus récemment vu au plus
// ancien ; ceux qu'on n'a jamais vus gardent l'ordre d'inscription.
.map((user, i) => ({ user, i, etat: etatDe(user.uid) }))
.sort((a, b) => (b.etat.enLigne - a.etat.enLigne) || (b.etat.vuLe - a.etat.vuLe) || (a.i - b.i))
.map(({ user }) => user);

const tbody = document.getElementById("studentsTableBody");

if (!filtered.length) {
tbody.innerHTML = `<tr><td colspan="7"><div class="admin-table-empty">Aucun étudiant ne correspond à ces critères.</div></td></tr>`;
return;
}

tbody.innerHTML = filtered.map((user) => `
<tr>
<td class="is-name">${user.name || "Sans nom"}</td>
<td>${user.email || "-"}</td>
<td>${planPill(user)}</td>
<td>${statusPill(user.disabled === true)}</td>
<td>${pastillePresence(etatDe(user.uid))}</td>
<td>${formatDate(user.createdAt)}</td>
<td><a class="table-link-btn" href="student-detail.html?uid=${user.uid}">Voir la fiche</a></td>
</tr>
`).join("");

}

document.getElementById("searchInput").addEventListener("input", renderTable);
document.getElementById("planFilter").addEventListener("change", renderTable);
document.getElementById("statusFilter").addEventListener("change", renderTable);

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

allUsers = await getAllUsers();

renderTable();

// Temps réel : chaque battement d'étudiant (et un réveil toutes les
// 30 s) redessine le tableau et le compteur « N en ligne ».
ecouterPresence((etat, enLigne) => {
etatDe = etat;
const compteur = document.getElementById("presenceCount");
if (compteur) {
compteur.hidden = false;
compteur.classList.toggle("is-vide", enLigne === 0);
compteur.querySelector("strong").textContent = String(enLigne);
}
renderTable();
});

if (window.lucide) lucide.createIcons();

hidePageLoader();

} catch (error) {

console.error("Erreur de chargement des étudiants :", error);

if (content) {
content.style.display = "";
content.innerHTML = `
<div style="padding:40px;text-align:center;">
<h2>Impossible de charger la liste des étudiants</h2>
<p>Vérifiez votre connexion Internet, puis réessayez.</p>
<button onclick="window.location.reload()">Réessayer</button>
</div>
`;
}

if (pageLoader) pageLoader.style.display = "none";

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
