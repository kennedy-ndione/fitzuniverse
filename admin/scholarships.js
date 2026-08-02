import { auth, db } from "../firebase-config.js";

import {
onAuthStateChanged,
signOut
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
doc,
getDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import {
getScholarships,
getScholarship,
addScholarship,
updateScholarship,
deleteScholarship,
getUniversityProfiles,
getPrograms,
getProgramsByScholarship,
ensureProgramForPair,
deleteProgramsForPair
} from "./firebase-admin.js";

import { initSidebarToggle } from "./sidebar-toggle.js";
import { hidePageLoader } from "../js/app-shell.js";

initSidebarToggle();

// ===============================
// Éléments HTML
// ===============================

const scholarshipsTable = document.getElementById("scholarshipsTable");
const addScholarshipBtn = document.getElementById("addScholarshipBtn");
const refreshBtn = document.getElementById("refreshScholarships");
const searchInput = document.getElementById("searchScholarship");
const countryFilter = document.getElementById("countryFilter");
const levelFilter = document.getElementById("levelFilter");

const modal = document.getElementById("scholarshipModal");
const modalTitle = document.getElementById("modalTitle");
const closeModalBtn = document.getElementById("closeModal");
const form = document.getElementById("scholarshipForm");

const titleInput = document.getElementById("title");
const countryInput = document.getElementById("country");
const fundingInput = document.getElementById("funding");
const statusInput = document.getElementById("status");
const descriptionInput = document.getElementById("description");
const levelCheckboxes = Array.from(document.querySelectorAll('input[name="scholarshipLevel"]'));

const universitiesPickerGroup = document.getElementById("universitiesPickerGroup");
const universitiesPickerHint = document.getElementById("universitiesPickerHint");
const universitiesPickerList = document.getElementById("universitiesPickerList");

let allScholarships = [];
let allPrograms = [];
let allUniversityProfiles = [];
let editingId = null;

// ===============================
// Chargement de la liste
// ===============================

async function loadScholarships() {

scholarshipsTable.innerHTML = `
<tr><td colspan="6"><div class="admin-table-empty">Chargement des bourses...</div></td></tr>
`;

try {

const [scholarships, programs] = await Promise.all([
getScholarships(),
getPrograms()
]);

allScholarships = scholarships;
allPrograms = programs;

populateCountryFilter();
renderTable();

}

catch (error) {

console.error(error);

scholarshipsTable.innerHTML = `
<tr><td colspan="6"><div class="admin-table-empty">Impossible de charger les bourses.</div></td></tr>
`;

}

}

function populateCountryFilter() {

if (!countryFilter) return;

const currentValue = countryFilter.value;

const countries = Array.from(
new Set(allScholarships.map((s) => s.country).filter(Boolean))
).sort((a, b) => a.localeCompare(b));

countryFilter.innerHTML = `<option value="">Tous les pays</option>` +
countries.map((c) => `<option value="${c}">${c}</option>`).join("");

if (countries.includes(currentValue)) {
countryFilter.value = currentValue;
}

}

function statusPill(scholarship) {

if (scholarship.isActive === false) {
return `<span class="status-pill is-disabled">Inactive</span>`;
}

return `<span class="status-pill is-active">Active</span>`;

}

function programCountFor(scholarshipId) {
return allPrograms.filter((p) => p.scholarshipId === scholarshipId).length;
}

function renderTable() {

const search = (searchInput?.value || "").toLowerCase().trim();
const country = countryFilter?.value || "";
const level = levelFilter?.value || "";

const filtered = allScholarships.filter((scholarship) => {

const matchesSearch =
!search ||
(scholarship.title || "").toLowerCase().includes(search) ||
(scholarship.country || "").toLowerCase().includes(search);

const matchesCountry = !country || scholarship.country === country;

const matchesLevel = !level || (scholarship.levels || []).includes(level);

return matchesSearch && matchesCountry && matchesLevel;

});

if (!filtered.length) {

scholarshipsTable.innerHTML = `
<tr><td colspan="6"><div class="admin-table-empty">Aucune bourse ne correspond à ces critères — essayez d'élargir votre recherche.</div></td></tr>
`;

return;

}

scholarshipsTable.innerHTML = filtered.map((scholarship) => `
<tr>
<td class="is-name">${scholarship.title ?? "-"}</td>
<td>${scholarship.country ?? "-"}</td>
<td>${(scholarship.levels || []).join(", ") || "-"}</td>
<td>${programCountFor(scholarship.firestoreId)}</td>
<td>${statusPill(scholarship)}</td>
<td class="actions-cell">
<button type="button" class="table-icon-btn edit-btn" data-id="${scholarship.firestoreId}" aria-label="Modifier"><i data-lucide="pencil"></i></button>
<button type="button" class="table-icon-btn is-danger delete-btn" data-id="${scholarship.firestoreId}" aria-label="Supprimer"><i data-lucide="trash-2"></i></button>
</td>
</tr>
`).join("");

if (window.lucide) lucide.createIcons();

}

// ===============================
// Universités partenaires (case à cocher)
// ===============================

async function renderUniversitiesPicker(scholarshipId, declaredLevels) {

if (!allUniversityProfiles.length) {
allUniversityProfiles = await getUniversityProfiles();
}

const linkedPrograms = await getProgramsByScholarship(scholarshipId);
const linkedUniversityIds = new Set(linkedPrograms.map((p) => p.universityId));

if (!allUniversityProfiles.length) {

universitiesPickerList.innerHTML = `<div class="checkbox-list-empty">Aucune université enregistrée pour le moment — ajoutez-en une depuis la page Universités.</div>`;
universitiesPickerList.hidden = false;
universitiesPickerHint.hidden = true;

return;

}

universitiesPickerList.innerHTML = allUniversityProfiles
.sort((a, b) => (a.name || "").localeCompare(b.name || ""))
.map((u) => `
<label class="checkbox-list-item">
<input type="checkbox" data-university-id="${u.firestoreId}" ${linkedUniversityIds.has(u.firestoreId) ? "checked" : ""}>
<span>${u.name || "Université sans nom"}</span>
<small>${[u.city, u.country].filter(Boolean).join(", ")}</small>
</label>
`).join("");

universitiesPickerList.hidden = false;
universitiesPickerHint.hidden = true;

universitiesPickerList.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {

checkbox.addEventListener("change", async () => {

const universityId = checkbox.dataset.universityId;

checkbox.disabled = true;

try {

if (checkbox.checked) {

await ensureProgramForPair(universityId, scholarshipId, {
level: declaredLevels[0] || "Licence",
deadline: "",
applicationUrl: "",
language: "",
duration: "",
coverage: "",
description: "",
status: statusInput.value || "Ouverte",
isActive: true
});

} else {

const confirmed = confirm("Retirer cette université de la bourse ? Le programme associé sera supprimé.");

if (!confirmed) {
checkbox.checked = true;
checkbox.disabled = false;
return;
}

await deleteProgramsForPair(universityId, scholarshipId);

}

allPrograms = await getPrograms();
renderTable();

} catch (error) {

console.error(error);
alert("Impossible de mettre à jour cette association. Veuillez réessayer.");
checkbox.checked = !checkbox.checked;

} finally {

checkbox.disabled = false;

}

});

});

}

function resetUniversitiesPicker() {
universitiesPickerList.hidden = true;
universitiesPickerList.innerHTML = "";
universitiesPickerHint.hidden = false;
universitiesPickerHint.textContent = "Enregistrez d'abord la bourse pour pouvoir lui associer des universités.";
}

// ===============================
// Modale
// ===============================

function openModal() {
modal.hidden = false;
}

function closeModal() {
modal.hidden = true;
form.reset();
editingId = null;
resetUniversitiesPicker();
}

function openCreateModal() {

editingId = null;
modalTitle.textContent = "Ajouter une bourse";
form.reset();
statusInput.value = "Ouverte";
resetUniversitiesPicker();

openModal();

}

function openEditModal(scholarship) {

editingId = scholarship.firestoreId;
modalTitle.textContent = "Modifier la bourse";

titleInput.value = scholarship.title || "";
countryInput.value = scholarship.country || "";
fundingInput.value = scholarship.funding || "";
statusInput.value = scholarship.status || (scholarship.isActive === false ? "Fermée" : "Ouverte");
descriptionInput.value = scholarship.description || "";

const levels = scholarship.levels || [];
levelCheckboxes.forEach((checkbox) => { checkbox.checked = levels.includes(checkbox.value); });

openModal();

renderUniversitiesPicker(scholarship.firestoreId, levels);

}

if (addScholarshipBtn) {
addScholarshipBtn.addEventListener("click", openCreateModal);
}

if (closeModalBtn) {
closeModalBtn.addEventListener("click", closeModal);
}

modal.addEventListener("click", (event) => {
if (event.target === modal) {
closeModal();
}
});

document.addEventListener("keydown", (event) => {
if (event.key === "Escape" && !modal.hidden) {
closeModal();
}
});

// ===============================
// Enregistrement (création / édition)
// ===============================

form.addEventListener("submit", async (event) => {

event.preventDefault();

const submitBtn = form.querySelector("button[type='submit']");
const originalLabel = submitBtn.innerHTML;

const levels = levelCheckboxes.filter((c) => c.checked).map((c) => c.value);

const scholarshipData = {
title: titleInput.value.trim(),
country: countryInput.value.trim(),
funding: fundingInput.value.trim(),
status: statusInput.value,
isActive: statusInput.value !== "Fermée",
description: descriptionInput.value.trim(),
levels
};

submitBtn.disabled = true;
submitBtn.innerHTML = `<span>Enregistrement...</span>`;

try {

if (editingId) {

await updateScholarship(editingId, scholarshipData);
closeModal();

} else {

const newId = await addScholarship(scholarshipData);

// Reste ouvert, bascule en mode édition : l'admin peut associer
// des universités tout de suite, sans rouvrir la modale.
editingId = newId;
modalTitle.textContent = "Modifier la bourse";
renderUniversitiesPicker(newId, levels);

}

await loadScholarships();

}

catch (error) {

console.error(error);
alert("Impossible d'enregistrer cette bourse. Veuillez réessayer.");

}

finally {

submitBtn.disabled = false;
submitBtn.innerHTML = originalLabel;
if (window.lucide) lucide.createIcons();

}

});

// ===============================
// Édition / suppression depuis le tableau
// ===============================

scholarshipsTable.addEventListener("click", async (event) => {

const editBtn = event.target.closest(".edit-btn");
const deleteBtn = event.target.closest(".delete-btn");

if (editBtn) {

const id = editBtn.dataset.id;

try {

const scholarship = await getScholarship(id);

if (!scholarship) {
alert("Cette bourse est introuvable (elle a peut-être déjà été supprimée).");
await loadScholarships();
return;
}

openEditModal(scholarship);

} catch (error) {

console.error(error);
alert("Impossible de charger cette bourse.");

}

return;

}

if (deleteBtn) {

const id = deleteBtn.dataset.id;

const linkedCount = programCountFor(id);

const confirmed = confirm(
linkedCount
? `Cette bourse est associée à ${linkedCount} université${linkedCount > 1 ? "s" : ""}. La supprimer retirera aussi ces associations. Continuer ?`
: "Voulez-vous vraiment supprimer cette bourse ?"
);

if (!confirmed) return;

try {

const linkedPrograms = await getProgramsByScholarship(id);
await Promise.all(linkedPrograms.map((p) => deleteProgramsForPair(p.universityId, id)));

await deleteScholarship(id);
await loadScholarships();

} catch (error) {

console.error(error);
alert("Impossible de supprimer cette bourse.");

}

}

});

// ===============================
// Filtres
// ===============================

if (searchInput) {
searchInput.addEventListener("input", renderTable);
}

if (countryFilter) {
countryFilter.addEventListener("change", renderTable);
}

if (levelFilter) {
levelFilter.addEventListener("change", renderTable);
}

if (refreshBtn) {
refreshBtn.addEventListener("click", loadScholarships);
}

// ===============================
// Authentification + chargement initial
// ===============================

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

await loadScholarships();

if (window.lucide) lucide.createIcons();

hidePageLoader();

} catch (error) {

console.error("Erreur de chargement des bourses :", error);

if (content) {
content.style.display = "";
content.innerHTML = `
<div style="padding:40px;text-align:center;">
<h2>Impossible de charger les bourses</h2>
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
