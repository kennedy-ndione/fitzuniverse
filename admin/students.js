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
import { PLAN_LABELS, passSeul, PASS_LABEL } from "../js/plan-features.js";
import { resolvePlan } from "../js/access-guard.js";
import { hidePageLoader } from "../js/app-shell.js";

initSidebarToggle();

let allUsers = [];

function formatDate(timestamp) {

if (!timestamp || typeof timestamp.toDate !== "function") return "-";

return timestamp.toDate().toLocaleDateString("fr-FR");

}

function planPill(user) {

const key = resolvePlan(user);

// Lot ACCEPTATION, partie 4 : un compte qui n'a QUE le Pass Découverte
// affiche « Pass Découverte », jamais « Gratuit ».
if (passSeul(user)) return `<span class="status-pill plan-fitzExpress">${PASS_LABEL}</span>`;

const label = PLAN_LABELS[key];

return `<span class="status-pill plan-${key}">${label}</span>`;

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

return resolvePlan(user) === planFilter;

}

function matchesStatus(user, statusFilter) {

if (!statusFilter) return true;

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
);

const tbody = document.getElementById("studentsTableBody");

if (!filtered.length) {
tbody.innerHTML = `<tr><td colspan="6"><div class="admin-table-empty">Aucun étudiant ne correspond à ces critères.</div></td></tr>`;
return;
}

tbody.innerHTML = filtered.map((user) => `
<tr>
<td class="is-name">${user.name || "Sans nom"}</td>
<td>${user.email || "-"}</td>
<td>${planPill(user)}</td>
<td>${statusPill(user.disabled === true)}</td>
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
