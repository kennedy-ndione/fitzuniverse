import { auth, db } from "../firebase-config.js";

import {
onAuthStateChanged,
signOut
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
doc,
getDoc,
deleteField
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
import { GROUPES } from "../js/eligibility-countries.js";

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

const funderInput = document.getElementById("funder");
const funderNameInput = document.getElementById("funderName");
const entryPointInput = document.getElementById("entryPoint");
// Lot S3 : les DEUX liens de la bourse. `officialWebsite` (la page du
// bailleur, publique) n'était jusqu'ici modifiable nulle part dans
// l'admin, alors qu'il est affiché sur chaque fiche ;
// `applicationPortalUrl` est le champ neuf (le lieu de dépôt, privé).
const officialWebsiteInput = document.getElementById("officialWebsite");
const applicationPortalUrlInput = document.getElementById("applicationPortalUrl");

const ageMaxTousInput = document.getElementById("ageMaxTous");
const ageMaxLicenceInput = document.getElementById("ageMaxLicence");
const ageMaxMasterInput = document.getElementById("ageMaxMaster");
const ageMaxDoctoratInput = document.getElementById("ageMaxDoctorat");
const ageMaxNoteInput = document.getElementById("ageMaxNote");

const universitiesPickerGroup = document.getElementById("universitiesPickerGroup");
const universitiesPickerHint = document.getElementById("universitiesPickerHint");
const universitiesPickerList = document.getElementById("universitiesPickerList");

// ===============================
// Éligibilité par nationalité (2026-08-30) — saisie du champ
// `eligibility` des bourses. Les groupes viennent de GROUPES
// (js/eligibility-countries.js), la même table que le filtre public et
// le moteur de recommandation : cocher un groupe ici, c'est exactement
// ce que ces consommateurs liront.
// ===============================

const eligibilityScopeInput = document.getElementById("eligibilityScope");
const eligibilityGroupsField = document.getElementById("eligibilityGroupsField");
const eligibilityGroupsList = document.getElementById("eligibilityGroupsList");
const eligibilityIncludeField = document.getElementById("eligibilityIncludeField");
const eligibilityIncludeInput = document.getElementById("eligibilityInclude");
const eligibilityExcludeField = document.getElementById("eligibilityExcludeField");
const eligibilityExcludeInput = document.getElementById("eligibilityExclude");
const eligibilityNoteField = document.getElementById("eligibilityNoteField");
const eligibilityNoteInput = document.getElementById("eligibilityNote");

if (eligibilityGroupsList) {
eligibilityGroupsList.innerHTML = Object.entries(GROUPES).map(([id, g]) =>
`<label class="checkbox-pill"><input type="checkbox" name="eligibilityGroup" value="${id}"><span>${g.label} (${g.codes.length})</span></label>`
).join("");
}

const eligibilityGroupCheckboxes = Array.from(document.querySelectorAll('input[name="eligibilityGroup"]'));

function syncEligibilityFields() {
const scope = eligibilityScopeInput ? eligibilityScopeInput.value : "";
if (eligibilityGroupsField) eligibilityGroupsField.hidden = scope !== "groupes";
if (eligibilityIncludeField) eligibilityIncludeField.hidden = !(scope === "groupes" || scope === "liste");
if (eligibilityExcludeField) eligibilityExcludeField.hidden = !(scope === "groupes" || scope === "liste");
// TOUJOURS visible, même sans scope : 9 bourses du lot 20 (Chevening,
// MEXT, Global Korea, Türkiye Bursları…) sont enregistrées en « note
// seule » — le masquer les rendait inéditables et faisait croire à un
// champ vide.
if (eligibilityNoteField) eligibilityNoteField.hidden = false;
}

if (eligibilityScopeInput) {
eligibilityScopeInput.addEventListener("change", syncEligibilityFields);
}

// "SN, ml ; ci" -> ["SN","ML","CI"] — ne garde que des codes alpha-2.
function parseIsoCodes(value) {
return String(value || "")
.split(/[\s,;]+/)
.map((c) => c.trim().toUpperCase())
.filter((c) => /^[A-Z]{2}$/.test(c));
}

// Reconstruit l'objet `eligibility` depuis le formulaire — null quand
// le scope est « Non renseignée » : estEligible(null) répond "inconnu",
// la bourse n'est jamais filtrée (même effet que le champ absent).
function buildEligibilityFromForm() {
const scope = eligibilityScopeInput ? eligibilityScopeInput.value : "";
const note = eligibilityNoteInput ? eligibilityNoteInput.value.trim() : "";

// « Note seule » : pas de scope mais une note. Cas légitime et utilisé par
// 9 bourses en base (Chevening, MEXT, Global Korea, Türkiye Bursları…) —
// la note s'affiche à l'étudiant sans jamais l'exclure. Sans ce cas,
// le simple fait d'ouvrir puis d'enregistrer une de ces fiches effaçait
// sa note en silence.
if (!scope) return note ? { note } : null;

const eligibility = { scope };
if (scope === "groupes") {
const groups = eligibilityGroupCheckboxes.filter((c) => c.checked).map((c) => c.value);
if (groups.length) eligibility.groups = groups;
}
if (scope === "groupes" || scope === "liste") {
const include = parseIsoCodes(eligibilityIncludeInput && eligibilityIncludeInput.value);
const exclude = parseIsoCodes(eligibilityExcludeInput && eligibilityExcludeInput.value);
if (include.length) eligibility.include = include;
if (exclude.length) eligibility.exclude = exclude;
}
if (note) eligibility.note = note;
return eligibility;
}

function fillEligibilityForm(eligibility) {
const e = eligibility && typeof eligibility === "object" ? eligibility : null;
if (eligibilityScopeInput) eligibilityScopeInput.value = e ? (e.scope || "") : "";
const groups = (e && e.groups) || [];
eligibilityGroupCheckboxes.forEach((c) => { c.checked = groups.includes(c.value); });
if (eligibilityIncludeInput) eligibilityIncludeInput.value = ((e && e.include) || []).join(", ");
if (eligibilityExcludeInput) eligibilityExcludeInput.value = ((e && e.exclude) || []).join(", ");
if (eligibilityNoteInput) eligibilityNoteInput.value = (e && e.note) || "";
syncEligibilityFields();
}

// ===============================
// Bailleur de la bourse (2026-08-30) — funder / funderName / entryPoint.
// Même règle des trois valeurs que `eligibility` (js/eligibility-
// countries.js) : un champ ABSENT est un INCONNU, jamais une valeur par
// défaut. On ne déduit rien du titre, du pays ni de la description, et
// un select laissé sur « Non renseigné » produit l'ABSENCE du champ en
// base — jamais "".
//
// Sémantique de entryPoint (la porte qui vient EN PREMIER dans le
// parcours réel du candidat) :
//   "bourse"     -> le dossier se dépose chez le BAILLEUR (portail
//                   d'État, ambassade, site de la fondation).
//                   L'université vient après, ou se déclare en vœux.
//                   Typique de funder=gouvernement et
//                   funder=organisation.
//   "universite" -> le dossier se dépose auprès de l'ÉTABLISSEMENT ; la
//                   bourse est souvent une case du dossier d'admission,
//                   ou s'attribue après admission. Typique de
//                   funder=universite et funder=region (bourses
//                   italiennes de droit à l'étude : admission d'abord,
//                   bourse sur revenus ISEE ensuite).
// ===============================

// Ne renvoie QUE les champs non vides — jamais funder:"", jamais de
// valeur devinée. Le sort des champs vides (simple absence à la
// création, deleteField à l'édition) se décide au submit.
function buildFunderFieldsFromForm() {
const fields = {};
const funder = funderInput ? funderInput.value : "";
const funderName = funderNameInput ? funderNameInput.value.trim() : "";
const entryPoint = entryPointInput ? entryPointInput.value : "";
// Lot S3 : les deux liens suivent exactement la même règle que les
// trois champs ci-dessus — vide = absent en base, jamais "".
const officialWebsite = officialWebsiteInput ? officialWebsiteInput.value.trim() : "";
const applicationPortalUrl = applicationPortalUrlInput ? applicationPortalUrlInput.value.trim() : "";
if (funder) fields.funder = funder;
if (funderName) fields.funderName = funderName;
if (entryPoint) fields.entryPoint = entryPoint;
if (officialWebsite) fields.officialWebsite = officialWebsite;
if (applicationPortalUrl) fields.applicationPortalUrl = applicationPortalUrl;
return fields;
}

// Pré-remplit les 3 champs à l'édition. Sans ce pré-remplissage, ouvrir
// puis ré-enregistrer une fiche effacerait ses champs bailleur en
// silence — exactement le piège « note seule » déjà rencontré sur
// l'éligibilité (voir buildEligibilityFromForm ci-dessus).
function fillFunderForm(scholarship) {
const s = scholarship || {};
if (funderInput) funderInput.value = s.funder || "";
if (funderNameInput) funderNameInput.value = s.funderName || "";
if (entryPointInput) entryPointInput.value = s.entryPoint || "";
if (officialWebsiteInput) officialWebsiteInput.value = s.officialWebsite || "";
if (applicationPortalUrlInput) applicationPortalUrlInput.value = s.applicationPortalUrl || "";
}

// ===============================
// Limite d'âge (2026-08-30) — champs ageMax / ageMaxNote. Même règle
// des trois valeurs : un champ vide produit l'ABSENCE en base (jamais
// {} ni 0), et `ageMax` absent est un INCONNU, jamais « pas de
// limite ». Quand la limite officielle varie selon le candidat, on
// saisit LA PLUS FAVORABLE (la plus haute) et la note explique la
// variation — un filtre qui se trompe doit se tromper en MONTRANT une
// bourse de trop, jamais en cachant une bourse à quelqu'un qui y avait
// droit (voir js/age-limits.js).
// ===============================

// "24" -> 24 ; "" -> null ; tout le reste (non entier, < 1, > 99) ->
// NaN, refusé par la validation.
function lireLimiteAge(input) {
const brut = input ? String(input.value).trim() : "";
if (!brut) return null;
const valeur = Number(brut);
if (!Number.isInteger(valeur) || valeur < 1 || valeur > 99) return NaN;
return valeur;
}

// Renvoie { erreur } quand la saisie est invalide, sinon { fields } ne
// contenant QUE les champs à écrire (ageMax et/ou ageMaxNote, absents
// si vides). `tous` et les clés de cycle sont EXCLUSIFS : une limite
// « tous cycles » doublée d'une limite de cycle est une contradiction
// qu'on refuse plutôt que d'arbitrer en silence.
function buildAgeMaxFieldsFromForm() {

const tous = lireLimiteAge(ageMaxTousInput);
const licence = lireLimiteAge(ageMaxLicenceInput);
const master = lireLimiteAge(ageMaxMasterInput);
const doctorat = lireLimiteAge(ageMaxDoctoratInput);

if ([tous, licence, master, doctorat].some((v) => Number.isNaN(v))) {
return { erreur: "Limite d'âge invalide : chaque champ doit être un nombre entier entre 1 et 99, ou rester vide." };
}

if (tous !== null && (licence !== null || master !== null || doctorat !== null)) {
return { erreur: "Limite d'âge : « Tous cycles » et les limites par cycle sont exclusifs. Videz l'un ou les autres." };
}

const ageMax = {};
if (tous !== null) ageMax.tous = tous;
if (licence !== null) ageMax.licence = licence;
if (master !== null) ageMax.master = master;
if (doctorat !== null) ageMax.doctorat = doctorat;

const note = ageMaxNoteInput ? ageMaxNoteInput.value.trim() : "";

const fields = {};
if (Object.keys(ageMax).length) fields.ageMax = ageMax;
if (note) fields.ageMaxNote = note;

return { fields };

}

// Pré-remplissage à l'édition — même raison que fillFunderForm : sans
// lui, ré-enregistrer une fiche effacerait ses limites en silence.
function fillAgeMaxForm(scholarship) {
const s = scholarship || {};
const ageMax = s.ageMax && typeof s.ageMax === "object" ? s.ageMax : {};
if (ageMaxTousInput) ageMaxTousInput.value = ageMax.tous ?? "";
if (ageMaxLicenceInput) ageMaxLicenceInput.value = ageMax.licence ?? "";
if (ageMaxMasterInput) ageMaxMasterInput.value = ageMax.master ?? "";
if (ageMaxDoctoratInput) ageMaxDoctoratInput.value = ageMax.doctorat ?? "";
if (ageMaxNoteInput) ageMaxNoteInput.value = s.ageMaxNote || "";
}

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
// form.reset() a vidé les champs — resynchronise la visibilité du
// bloc éligibilité (tout masqué, scope « Non renseignée »).
syncEligibilityFields();
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
fillEligibilityForm(scholarship.eligibility);
fillFunderForm(scholarship);
fillAgeMaxForm(scholarship);

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

// Validation de la limite d'âge AVANT toute écriture : un refus doit
// laisser la modale ouverte, le bouton actif et la saisie intacte.
const ageResult = buildAgeMaxFieldsFromForm();
if (ageResult.erreur) {
alert(ageResult.erreur);
return;
}

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
levels,
// null quand « Non renseignée » : même effet que le champ absent
// (estEligible répond "inconnu", jamais "non") — et l'écrire
// explicitement permet de RETIRER une restriction posée par erreur.
eligibility: buildEligibilityFromForm()
};

// Champs bailleur : présents seulement s'ils portent une valeur.
// updateScholarship fait un updateDoc (merge PARTIEL, vérifié dans
// admin/firebase-admin.js) : omettre un champ le laisse intact en
// base — ré-enregistrer une fiche sans toucher au bloc bailleur ne
// peut donc rien effacer (les champs sont pré-remplis à l'édition).
// À l'édition, un champ explicitement remis sur « Non renseigné »
// est réellement SUPPRIMÉ (deleteField) : écrire "" créerait une
// fausse valeur, et ne rien écrire rendrait l'erreur incorrigible.
const funderFields = buildFunderFieldsFromForm();
if (editingId) {
for (const champ of ["funder", "funderName", "entryPoint", "officialWebsite", "applicationPortalUrl"]) {
if (!(champ in funderFields)) funderFields[champ] = deleteField();
}
}
Object.assign(scholarshipData, funderFields);

// Limite d'âge : même mécanique exactement (validée plus haut, avant
// toute écriture). À l'édition, `ageMax` vidé de ses 4 clés — ou la
// note effacée — est réellement SUPPRIMÉ du document.
const ageFields = ageResult.fields;
if (editingId) {
for (const champ of ["ageMax", "ageMaxNote"]) {
if (!(champ in ageFields)) ageFields[champ] = deleteField();
}
}
Object.assign(scholarshipData, ageFields);

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
