// ============================================
// ScholarBridge Admin — Fiche université (Control Center)
// Architecture relationnelle (2026-07-30) : cette page affiche le
// PROFIL d'une université (collection "universities") et gère ses
// PROGRAMMES (collection "programs" — la relation avec "scholarships").
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
getUniversityProfile,
updateUniversityProfile,
getProgramsByUniversity,
addProgramEntry,
updateProgramEntry,
deleteProgramEntry,
getScholarships
} from "./firebase-admin.js";

import { initSidebarToggle } from "./sidebar-toggle.js";
import { hidePageLoader } from "../js/app-shell.js";

initSidebarToggle();

/* ==========================================
PARAMÈTRES URL
========================================== */

const params = new URLSearchParams(window.location.search);
const universityId = params.get("id");

/* ==========================================
ÉLÉMENTS HTML
========================================== */

const universityName = document.getElementById("universityName");
const universityLocation = document.getElementById("universityLocation");

const programCount = document.getElementById("programCount");
const scholarshipCount = document.getElementById("scholarshipCount");
const countryName = document.getElementById("countryName");
const rankingValue = document.getElementById("rankingValue");

const infoUniversity = document.getElementById("infoUniversity");
const infoCountry = document.getElementById("infoCountry");
const infoCity = document.getElementById("infoCity");
const infoRanking = document.getElementById("infoRanking");
const infoWebsite = document.getElementById("infoWebsite");
const infoFields = document.getElementById("infoFields");

const programsTable = document.getElementById("programsTable");

const statsPrograms = document.getElementById("statsPrograms");
const statsActivePrograms = document.getElementById("statsActivePrograms");
const statsUpdated = document.getElementById("statsUpdated");

/* ==========================================
VARIABLES
========================================== */

let university = null;
let universityPrograms = [];
let allScholarships = [];

function scholarshipTitle(scholarshipId) {
if (!scholarshipId) return `<span class="scholarship-title-missing"><i data-lucide="triangle-alert"></i>Bourse à associer</span>`;
const scholarship = allScholarships.find((s) => s.firestoreId === scholarshipId);
return scholarship ? scholarship.title : "Bourse introuvable";
}

/* ==========================================
CHARGER L'UNIVERSITÉ
========================================== */

async function loadUniversity() {

try {

const [profile, programs, scholarships] = await Promise.all([
getUniversityProfile(universityId),
getProgramsByUniversity(universityId),
getScholarships()
]);

allScholarships = scholarships;

if (!profile) {

universityName.textContent = "Université introuvable";
universityLocation.textContent = "Cette université n'existe pas ou a été supprimée.";

return;

}

university = profile;
universityPrograms = programs;

renderUniversity();
renderPrograms();

if (window.lucide) lucide.createIcons();

}

catch (error) {

console.error(error);

universityName.textContent = "Erreur";
universityLocation.textContent = "Impossible de charger les données.";

}

}

/* ==========================================
AFFICHER LES INFORMATIONS
========================================== */

function renderUniversity() {

universityName.textContent = university.name || "--";
universityLocation.textContent = `${university.city || "--"} • ${university.country || "--"}`;

programCount.textContent = universityPrograms.length;
scholarshipCount.textContent = new Set(universityPrograms.map((p) => p.scholarshipId)).size;
countryName.textContent = university.country || "--";
rankingValue.textContent = university.ranking || "--";

infoUniversity.textContent = university.name || "--";
infoCountry.textContent = university.country || "--";
infoCity.textContent = university.city || "--";
infoRanking.textContent = university.ranking || "--";
infoWebsite.textContent = university.officialWebsite || "--";
infoFields.textContent = (university.fields && university.fields.length) ? university.fields.join(", ") : "--";

statsPrograms.textContent = universityPrograms.length;
statsActivePrograms.textContent = universityPrograms.filter((p) => p.isActive).length;
statsUpdated.textContent = new Date().toLocaleDateString("fr-FR");

}

/* ==========================================
AFFICHER LES PROGRAMMES
========================================== */

function renderPrograms() {

if (!universityPrograms.length) {

programsTable.innerHTML = `
<tr>
<td colspan="6"><div class="admin-table-empty">Aucun programme trouvé. Ajoutez-en un, ou associez cette université depuis la fiche d'une bourse.</div></td>
</tr>
`;

return;

}

programsTable.innerHTML = universityPrograms.map((program) => `
<tr>

<td>${scholarshipTitle(program.scholarshipId)}</td>

<td>${program.level || "--"}</td>

<td>${program.deadline || "--"}</td>

<td>${program.language || "--"}</td>

<td>
<span class="status-pill ${program.isActive ? "is-active" : "is-disabled"}">
${program.isActive ? "Active" : "Inactive"}
</span>
</td>

<td class="actions-cell">
<button type="button" class="table-icon-btn edit-program" data-id="${program.firestoreId}" aria-label="Modifier"><i data-lucide="pencil"></i></button>
<button type="button" class="table-icon-btn is-danger delete-program" data-id="${program.firestoreId}" aria-label="Supprimer"><i data-lucide="trash-2"></i></button>
</td>

</tr>
`).join("");

if (window.lucide) lucide.createIcons();

}

/* ==========================================
GESTION DES ONGLETS
========================================== */

const tabButtons = document.querySelectorAll(".tab-btn");
const tabPanels = document.querySelectorAll(".tab-panel");

tabButtons.forEach((button) => {

button.addEventListener("click", () => {

const tab = button.dataset.tab;

tabButtons.forEach((btn) => btn.classList.remove("is-active"));
tabPanels.forEach((panel) => panel.classList.remove("is-active"));

button.classList.add("is-active");

const targetPanel = document.getElementById(`${tab}Tab`);
if (targetPanel) targetPanel.classList.add("is-active");

});

});

/* ==========================================
INITIALISATION
========================================== */

if (!universityId) {
universityName.textContent = "Université introuvable";
universityLocation.textContent = "Aucun identifiant n'a été fourni.";
}

/* ==========================================
ACTIONS SUR LES PROGRAMMES
========================================== */

programsTable.addEventListener("click", (event) => {

const editButton = event.target.closest(".edit-program");

if (editButton) {
openEditProgram(editButton.dataset.id);
return;
}

const deleteButton = event.target.closest(".delete-program");

if (deleteButton) {
deleteProgramHandler(deleteButton.dataset.id);
}

});

/* ==========================================
CRÉATION / ÉDITION D'UN PROGRAMME
========================================== */

const programModal = document.getElementById("programModal");
const closeProgramModal = document.getElementById("closeProgramModal");
const cancelProgramEdit = document.getElementById("cancelProgramEdit");
const saveProgramEdit = document.getElementById("saveProgramEdit");

const editScholarship = document.getElementById("editScholarship");
const editLevel = document.getElementById("editLevel");
const editDeadline = document.getElementById("editDeadline");
const editLanguage = document.getElementById("editLanguage");
const editDuration = document.getElementById("editDuration");
const editApplicationUrl = document.getElementById("editApplicationUrl");
const editStatus = document.getElementById("editStatus");
const programModalTitle = document.getElementById("programModalTitle");

let currentProgramId = null;
let isCreatingProgram = false;

function populateScholarshipSelect(selectedId) {

editScholarship.innerHTML = allScholarships
.slice()
.sort((a, b) => (a.title || "").localeCompare(b.title || ""))
.map((s) => `<option value="${s.firestoreId}" ${s.firestoreId === selectedId ? "selected" : ""}>${s.title}</option>`)
.join("");

}

function closeProgramModalHandler() {
programModal.hidden = true;
currentProgramId = null;
isCreatingProgram = false;
}

function openCreateProgram() {

if (!university) {
alert("Chargez d'abord l'université avant d'ajouter un programme.");
return;
}

if (!allScholarships.length) {
alert("Aucune bourse n'existe encore — créez-en une depuis la page Bourses avant d'ajouter un programme.");
return;
}

isCreatingProgram = true;
currentProgramId = null;

programModalTitle.textContent = "Ajouter un programme";

populateScholarshipSelect(null);
editLevel.value = "Licence";
editDeadline.value = "";
editLanguage.value = "";
editDuration.value = "";
editApplicationUrl.value = "";
editStatus.value = "Ouverte";

programModal.hidden = false;

}

function openEditProgram(programId) {

const program = universityPrograms.find((p) => p.firestoreId === programId);

if (!program) {
alert("Programme introuvable.");
return;
}

isCreatingProgram = false;
currentProgramId = programId;

programModalTitle.textContent = "Modifier le programme";

populateScholarshipSelect(program.scholarshipId);
editLevel.value = program.level || "Licence";
editDeadline.value = program.deadline || "";
editLanguage.value = program.language || "";
editDuration.value = program.duration || "";
editApplicationUrl.value = program.applicationUrl || "";
editStatus.value = program.status || "Ouverte";

programModal.hidden = false;

}

async function saveProgramHandler() {

const programData = {
scholarshipId: editScholarship.value,
level: editLevel.value,
deadline: editDeadline.value,
language: editLanguage.value.trim(),
duration: editDuration.value.trim(),
applicationUrl: editApplicationUrl.value.trim(),
status: editStatus.value,
isActive: editStatus.value !== "Fermée"
};

saveProgramEdit.disabled = true;

try {

if (isCreatingProgram) {

await addProgramEntry(`${universityId}__${programData.scholarshipId}__${Date.now().toString(36)}`, {
universityId,
...programData
});

} else {

await updateProgramEntry(currentProgramId, programData);

}

closeProgramModalHandler();

await loadUniversity();

}

catch (error) {

console.error(error);
alert("Impossible d'enregistrer ce programme. Veuillez réessayer.");

}

finally {

saveProgramEdit.disabled = false;

}

}

const addProgramBtn = document.getElementById("addProgramBtn");
if (addProgramBtn) addProgramBtn.addEventListener("click", openCreateProgram);

if (closeProgramModal) closeProgramModal.addEventListener("click", closeProgramModalHandler);
if (cancelProgramEdit) cancelProgramEdit.addEventListener("click", closeProgramModalHandler);
if (saveProgramEdit) saveProgramEdit.addEventListener("click", saveProgramHandler);

programModal.addEventListener("click", (event) => {
if (event.target === programModal) closeProgramModalHandler();
});

async function deleteProgramHandler(programId) {

const confirmed = confirm("Voulez-vous vraiment supprimer ce programme ?");
if (!confirmed) return;

try {

await deleteProgramEntry(programId);
await loadUniversity();

} catch (error) {

console.error(error);
alert("Erreur lors de la suppression.");

}

}

/* ==========================================
MODIFIER LE PROFIL DE L'UNIVERSITÉ
========================================== */

const profileModal = document.getElementById("profileModal");
const closeProfileModal = document.getElementById("closeProfileModal");
const cancelProfileEdit = document.getElementById("cancelProfileEdit");
const saveProfileEdit = document.getElementById("saveProfileEdit");

const editName = document.getElementById("editName");
const editCountry = document.getElementById("editCountry");
const editCity = document.getElementById("editCity");
const editUniRanking = document.getElementById("editUniRanking");
const editImage = document.getElementById("editImage");
const editWebsite = document.getElementById("editWebsite");
const editFields = document.getElementById("editFields");
const editUniDescription = document.getElementById("editUniDescription");

function closeProfileModalHandler() {
profileModal.hidden = true;
}

const editUniversityBtn = document.getElementById("editUniversityBtn");

editUniversityBtn?.addEventListener("click", () => {

if (!university) return;

editName.value = university.name || "";
editCountry.value = university.country || "";
editCity.value = university.city || "";
editUniRanking.value = university.ranking || "";
editImage.value = university.image || "";
editWebsite.value = university.officialWebsite || "";
editFields.value = (university.fields || []).join(", ");
editUniDescription.value = university.description || "";

profileModal.hidden = false;

});

if (closeProfileModal) closeProfileModal.addEventListener("click", closeProfileModalHandler);
if (cancelProfileEdit) cancelProfileEdit.addEventListener("click", closeProfileModalHandler);

profileModal.addEventListener("click", (event) => {
if (event.target === profileModal) closeProfileModalHandler();
});

if (saveProfileEdit) {

saveProfileEdit.addEventListener("click", async () => {

saveProfileEdit.disabled = true;

try {

await updateUniversityProfile(universityId, {
name: editName.value.trim(),
country: editCountry.value.trim(),
city: editCity.value.trim(),
ranking: editUniRanking.value.trim(),
image: editImage.value.trim(),
officialWebsite: editWebsite.value.trim(),
fields: editFields.value.split(",").map((f) => f.trim()).filter(Boolean),
description: editUniDescription.value.trim()
});

closeProfileModalHandler();
await loadUniversity();

} catch (error) {

console.error(error);
alert("Impossible d'enregistrer ces modifications. Veuillez réessayer.");

} finally {

saveProfileEdit.disabled = false;

}

});

}

document.addEventListener("keydown", (event) => {
if (event.key === "Escape") {
if (!programModal.hidden) closeProgramModalHandler();
if (!profileModal.hidden) closeProfileModalHandler();
}
});

/* ==========================================
AUTHENTIFICATION + CHARGEMENT INITIAL
========================================== */

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

if (!universityId) {
if (window.lucide) lucide.createIcons();
hidePageLoader();
return;
}

await loadUniversity();

if (window.lucide) lucide.createIcons();

hidePageLoader();

} catch (error) {

console.error("Erreur de chargement de l'université :", error);

if (content) {
content.style.display = "";
content.innerHTML = `
<div style="padding:40px;text-align:center;">
<h2>Impossible de charger cette université</h2>
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
