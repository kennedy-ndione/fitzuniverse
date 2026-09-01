// ============================================
// Fitz Admin - Universités (Control Center)
// Architecture relationnelle (2026-07-30) : cette page gère
// exclusivement le PROFIL d'une université (collection "universities",
// une fiche par établissement réel). Les programmes (quelle bourse,
// quel niveau, quelle deadline) se gèrent depuis university.html (une
// université) ou scholarships.html (cases à cocher, une bourse).
// ============================================

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
getUniversityProfiles,
addUniversityProfile,
updateUniversityProfile,
deleteUniversityProfile,
getPrograms,
deleteProgramEntry
} from "./firebase-admin.js";

import { initSidebarToggle } from "./sidebar-toggle.js";
import { hidePageLoader } from "../js/app-shell.js";

initSidebarToggle();

// ===============================
// Éléments HTML
// ===============================

const tableBody = document.getElementById("universitiesTable");
const searchInput = document.getElementById("searchUniversity");
const countryFilter = document.getElementById("countryFilter");
const levelFilter = document.getElementById("levelFilter");
const refreshBtn = document.getElementById("refreshUniversitiesBtn");
const addUniversityBtn = document.getElementById("addUniversityBtn");

const modal = document.getElementById("universityModal");
const modalTitle = document.getElementById("universityModalTitle");
const closeModalBtn = document.getElementById("closeUniversityModal");
const form = document.getElementById("universityForm");

const nameInput = document.getElementById("name");
const countryInput = document.getElementById("country");
const cityInput = document.getElementById("city");
const rankingInput = document.getElementById("ranking");
const imageInput = document.getElementById("image");
const officialWebsiteInput = document.getElementById("officialWebsite");
const fieldsInput = document.getElementById("fields");
const descriptionInput = document.getElementById("description");

let allUniversities = [];
let allPrograms = [];
let editingId = null;

function slugify(value) {

const DIACRITICS_RANGE_START = String.fromCharCode(0x0300);
const DIACRITICS_RANGE_END = String.fromCharCode(0x036f);
const DIACRITICS_PATTERN = new RegExp(`[${DIACRITICS_RANGE_START}-${DIACRITICS_RANGE_END}]`, "g");

return String(value || "")
.toLowerCase()
.normalize("NFD")
.replace(DIACRITICS_PATTERN, "")
.replace(/[^a-z0-9]+/g, "-")
.replace(/^-+|-+$/g, "") || "universite";

}

// ===============================
// Chargement
// ===============================

async function loadUniversities() {

tableBody.innerHTML = `
<tr><td colspan="6"><div class="admin-table-empty">Chargement des universités...</div></td></tr>
`;

try {

const [universities, programs] = await Promise.all([
getUniversityProfiles(),
getPrograms()
]);

allUniversities = universities;
allPrograms = programs;

populateCountryFilter();
renderTable();

} catch (error) {

console.error(error);

tableBody.innerHTML = `
<tr><td colspan="6"><div class="admin-table-empty">Impossible de charger les universités.</div></td></tr>
`;

}

}

function populateCountryFilter() {

if (!countryFilter) return;

const currentValue = countryFilter.value;

const countries = Array.from(
new Set(allUniversities.map((u) => u.country).filter(Boolean))
).sort((a, b) => a.localeCompare(b));

countryFilter.innerHTML = `<option value="">Tous les pays</option>` +
countries.map((c) => `<option value="${c}">${c}</option>`).join("");

if (countries.includes(currentValue)) {
countryFilter.value = currentValue;
}

}

function programsFor(universityId) {
return allPrograms.filter((p) => p.universityId === universityId);
}

function renderTable() {

const search = (searchInput?.value || "").toLowerCase().trim();
const country = countryFilter?.value || "";
const level = levelFilter?.value || "";

const filtered = allUniversities.filter((university) => {

const matchesSearch =
!search ||
(university.name || "").toLowerCase().includes(search) ||
(university.country || "").toLowerCase().includes(search);

const matchesCountry = !country || university.country === country;

const matchesLevel = !level || programsFor(university.firestoreId).some((p) => p.level === level);

return matchesSearch && matchesCountry && matchesLevel;

});

if (!filtered.length) {

tableBody.innerHTML = `
<tr><td colspan="6"><div class="admin-table-empty">Aucune université ne correspond à ces critères — essayez d'élargir votre recherche.</div></td></tr>
`;

return;

}

tableBody.innerHTML = filtered.map((university) => `
<tr>
<td class="is-name">${university.name || "Sans nom"}</td>
<td>${university.country ?? "-"}</td>
<td>${university.city ?? "-"}</td>
<td>${programsFor(university.firestoreId).length} programme(s)</td>
<td>${university.ranking ?? "-"}</td>
<td class="actions-cell">
<button type="button" class="table-icon-btn view-btn" data-id="${university.firestoreId}" aria-label="Voir la fiche"><i data-lucide="eye"></i></button>
<button type="button" class="table-icon-btn edit-btn" data-id="${university.firestoreId}" aria-label="Modifier"><i data-lucide="pencil"></i></button>
<button type="button" class="table-icon-btn is-danger delete-btn" data-id="${university.firestoreId}" aria-label="Supprimer"><i data-lucide="trash-2"></i></button>
</td>
</tr>
`).join("");

if (window.lucide) lucide.createIcons();

}

// ===============================
// Modale — profil d'université
// ===============================

function openModal() {
modal.hidden = false;
}

function closeModal() {
modal.hidden = true;
form.reset();
editingId = null;
}

function openCreateModal() {
editingId = null;
modalTitle.textContent = "Ajouter une université";
form.reset();
openModal();
}

function openEditModal(university) {

editingId = university.firestoreId;
modalTitle.textContent = "Modifier l'université";

nameInput.value = university.name || "";
countryInput.value = university.country || "";
cityInput.value = university.city || "";
rankingInput.value = university.ranking || "";
imageInput.value = university.image || "";
officialWebsiteInput.value = university.officialWebsite || "";
fieldsInput.value = (university.fields || []).join(", ");
descriptionInput.value = university.description || "";

openModal();

}

if (addUniversityBtn) {
addUniversityBtn.addEventListener("click", openCreateModal);
}

if (closeModalBtn) {
closeModalBtn.addEventListener("click", closeModal);
}

modal.addEventListener("click", (event) => {
if (event.target === modal) closeModal();
});

document.addEventListener("keydown", (event) => {
if (event.key === "Escape" && !modal.hidden) closeModal();
});

form.addEventListener("submit", async (event) => {

event.preventDefault();

const submitBtn = form.querySelector("button[type='submit']");
const originalLabel = submitBtn.innerHTML;

const universityData = {
name: nameInput.value.trim(),
country: countryInput.value.trim(),
city: cityInput.value.trim(),
ranking: rankingInput.value.trim(),
image: imageInput.value.trim(),
officialWebsite: officialWebsiteInput.value.trim(),
fields: fieldsInput.value.split(",").map((f) => f.trim()).filter(Boolean),
description: descriptionInput.value.trim()
};

submitBtn.disabled = true;
submitBtn.innerHTML = `<span>Enregistrement...</span>`;

try {

if (editingId) {

await updateUniversityProfile(editingId, universityData);

} else {

const newId = slugify(`${universityData.name}-${universityData.city}`);
await addUniversityProfile(newId, universityData);

}

closeModal();
await loadUniversities();

} catch (error) {

console.error(error);
alert("Impossible d'enregistrer cette université. Veuillez réessayer.");

} finally {

submitBtn.disabled = false;
submitBtn.innerHTML = originalLabel;
if (window.lucide) lucide.createIcons();

}

});

// ===============================
// Actions du tableau : voir / modifier / supprimer
// ===============================

tableBody.addEventListener("click", async (event) => {

const viewBtn = event.target.closest(".view-btn");
const editBtn = event.target.closest(".edit-btn");
const deleteBtn = event.target.closest(".delete-btn");

if (viewBtn) {
window.location.href = `university.html?id=${viewBtn.dataset.id}`;
return;
}

if (editBtn) {

const university = allUniversities.find((u) => u.firestoreId === editBtn.dataset.id);

if (!university) {
alert("Cette université est introuvable (elle a peut-être déjà été supprimée).");
await loadUniversities();
return;
}

openEditModal(university);

return;

}

if (deleteBtn) {

const id = deleteBtn.dataset.id;
const linkedPrograms = programsFor(id);

const confirmed = confirm(
linkedPrograms.length
? `Cette université est liée à ${linkedPrograms.length} programme(s). Les supprimer aussi et retirer définitivement cette université ?`
: "Voulez-vous vraiment supprimer cette université ?"
);

if (!confirmed) return;

try {

await Promise.all(linkedPrograms.map((p) => deleteProgramEntry(p.firestoreId)));
await deleteUniversityProfile(id);
await loadUniversities();

} catch (error) {

console.error(error);
alert("Impossible de supprimer cette université.");

}

}

});

// ===============================
// Filtres + rafraîchissement
// ===============================

if (searchInput) searchInput.addEventListener("input", renderTable);
if (countryFilter) countryFilter.addEventListener("change", renderTable);
if (levelFilter) levelFilter.addEventListener("change", renderTable);
if (refreshBtn) refreshBtn.addEventListener("click", loadUniversities);

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

await loadUniversities();

if (window.lucide) lucide.createIcons();

hidePageLoader();

} catch (error) {

console.error("Erreur de chargement des universités :", error);

if (content) {
content.style.display = "";
content.innerHTML = `
<div style="padding:40px;text-align:center;">
<h2>Impossible de charger les universités</h2>
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
