import { auth, db } from "./firebase-config.js";

import {
onAuthStateChanged,
signOut
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
doc,
getDoc,
setDoc,
updateDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import { setButtonLoading } from "./auth-ui.js";
import { hidePageLoader } from "./js/app-shell.js";
import { resolvePlan, PLAN_LABELS } from "./js/access-guard.js";

// ==========================================================
// Listes fixes pour les chips / sélecteurs
// ==========================================================

const FIXED_LANGUAGES = [
{ code: "fr", label: "Français" },
{ code: "en", label: "Anglais" },
{ code: "es", label: "Espagnol" },
{ code: "de", label: "Allemand" },
{ code: "ar", label: "Arabe" }
];

const CECRL_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

const COUNTRY_OPTIONS = [
"Canada", "France", "Belgique", "Suisse", "Allemagne", "Italie",
"Espagne", "Portugal", "Royaume-Uni", "Irlande", "Pays-Bas", "Suède",
"Norvège", "États-Unis", "Chine", "Hongrie", "Turquie", "Maroc",
"Tunisie", "Sénégal", "Afrique du Sud", "Australie", "Japon", "Corée du Sud"
];

const CONTINENT_OPTIONS = [
"Afrique", "Europe", "Amérique du Nord", "Amérique du Sud", "Asie", "Océanie"
];

// ==========================================================
// Profil par défaut — schéma plat unifié (voir plan Phase 0)
// ==========================================================

function defaultProfile(user) {
return {

name: user.name || "",
email: user.email || "",

// 1. Informations personnelles
firstName: "", lastName: "", gender: "", birthDate: "",
country: "", city: "", nationality: "", phone: "", whatsapp: "",

// 2. Parcours scolaire
lastDegree: "", currentInstitution: "", graduationYear: "", academicAverage: "",
studentStatus: "", bacSeries: "", bacMention: "", bacAverage: "", currentLevel: "",

// 3. Niveau académique
ranking: "", strongSubjects: "", weakSubjects: "", projects: "",
thesis: "", publications: "", researchExperience: "",

// 4. Langues
languages: [],

// 5. Projet d'études
desiredField: "", specialization: "", desiredDegree: "",

// 6. Préférences de destination
preferredCountries: [], excludedCountries: [], preferredContinents: [], universityType: "",

// 7. Préférences financières
budget: "", hasSponsor: "", fundingWanted: [],

// 8. Documents disponibles
documentsAvailable: [],

// 9. Expériences
internships: "", workExperience: "", associations: "", volunteering: "",
entrepreneurship: "", technicalSkills: "", computerSkills: "",

// 10. Objectifs
whyLeave: "", careerGoals: "", dreams: "",

// Alias hérités — lus par dashboard.js et par les anciens outils IA
// jusqu'à leur migration. Recalculés à chaque sauvegarde (voir save()).
originCountry: "", currentDegree: "", englishLevel: "", desiredCountry: ""

};
}

// ==========================================================
// État en mémoire des champs multi-valeurs (pas de champs cachés
// DOM, pour éviter tout risque avec le textContent de setButtonLoading)
// ==========================================================

const state = {
languages: [],           // [{code, level, name?}]
preferredCountries: new Set(),
excludedCountries: new Set(),
preferredContinents: new Set()
};

// ==========================================================
// Chips génériques
// ==========================================================

function renderChipGroup(container, options, store) {

container.innerHTML = "";

options.forEach((option) => {

const chip = document.createElement("button");
chip.type = "button";
chip.className = "chip";
chip.textContent = option;
chip.setAttribute("aria-pressed", String(store.has(option)));

chip.addEventListener("click", () => {

if (store.has(option)) {
store.delete(option);
chip.setAttribute("aria-pressed", "false");
} else {
store.add(option);
chip.setAttribute("aria-pressed", "true");
}

updateCompletion();

});

container.appendChild(chip);

});

}

// ==========================================================
// Langues — 5 lignes fixes + langues "autres" ajoutées dynamiquement
// ==========================================================

function findLanguage(code, name) {
return state.languages.find((entry) =>
code === "autre" ? entry.code === "autre" && entry.name === name : entry.code === code
);
}

function setLanguageLevel(code, level, name) {

const existing = findLanguage(code, name);

if (existing) {
existing.level = level;
} else {
state.languages.push(code === "autre" ? { code, name, level } : { code, level });
}

}

function renderFixedLanguages() {

const list = document.getElementById("languagesList");
list.innerHTML = "";

FIXED_LANGUAGES.forEach(({ code, label }) => {

const row = document.createElement("div");
row.className = "language-row";

const current = findLanguage(code);

row.innerHTML = `
<span class="language-row-label"></span>
<div class="cecrl-picker" data-code="${code}">
${CECRL_LEVELS.map((lvl) => `<button type="button" data-level="${lvl}">${lvl}</button>`).join("")}
</div>
`;

row.querySelector(".language-row-label").textContent = label;

const picker = row.querySelector(".cecrl-picker");

picker.querySelectorAll("button").forEach((btn) => {

if (current && current.level === btn.dataset.level) {
btn.setAttribute("aria-pressed", "true");
}

btn.addEventListener("click", () => {

picker.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", "false"));
btn.setAttribute("aria-pressed", "true");

setLanguageLevel(code, btn.dataset.level);
updateCompletion();

});

});

list.appendChild(row);

});

}

function renderOtherLanguageChips() {

const container = document.getElementById("otherLanguagesChips");
container.innerHTML = "";

state.languages
.filter((entry) => entry.code === "autre")
.forEach((entry) => {

const chip = document.createElement("span");
chip.className = "chip";
chip.setAttribute("aria-pressed", "true");
chip.textContent = `${entry.name} — ${entry.level}`;

const remove = document.createElement("button");
remove.type = "button";
remove.setAttribute("aria-label", `Retirer ${entry.name}`);
remove.style.marginLeft = "6px";
remove.style.background = "none";
remove.style.border = "none";
remove.style.color = "inherit";
remove.style.cursor = "pointer";
remove.textContent = "×";

remove.addEventListener("click", () => {
state.languages = state.languages.filter((item) => item !== entry);
renderOtherLanguageChips();
updateCompletion();
});

chip.appendChild(remove);
container.appendChild(chip);

});

}

function initOtherLanguageAdder() {

const nameInput = document.getElementById("otherLanguageName");
const picker = document.getElementById("otherLanguagePicker");
const addBtn = document.getElementById("addOtherLanguage");

let selectedLevel = "";

picker.querySelectorAll("button").forEach((btn) => {

btn.addEventListener("click", () => {
picker.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", "false"));
btn.setAttribute("aria-pressed", "true");
selectedLevel = btn.dataset.level;
});

});

addBtn.addEventListener("click", () => {

const name = nameInput.value.trim();

if (!name || !selectedLevel) {
alert("Merci d'indiquer un nom de langue et de sélectionner un niveau avant d'ajouter.");
return;
}

state.languages.push({ code: "autre", name, level: selectedLevel });

nameInput.value = "";
picker.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", "false"));
selectedLevel = "";

renderOtherLanguageChips();
updateCompletion();

});

}

// ==========================================================
// Cases à cocher stylées en carte (documents disponibles)
// ==========================================================

function initCheckCards(containerId, cardSelector) {

const container = document.getElementById(containerId);
if (!container) return;

container.querySelectorAll(cardSelector).forEach((card) => {

const input = card.querySelector("input");

const sync = () => card.classList.toggle("is-checked", input.checked);

input.addEventListener("change", () => {
sync();
updateCompletion();
});

sync();

});

}

// ==========================================================
// Toggle nouveau bachelier / étudiant en cours
// ==========================================================

function initStatusToggle() {

const toggle = document.getElementById("statusToggle");
const bacBlock = document.getElementById("bacFieldsBlock");
const levelBlock = document.getElementById("currentLevelBlock");

function applyStatus(value) {

toggle.querySelectorAll(".status-toggle-option").forEach((opt) => {
opt.classList.toggle("is-selected", opt.dataset.value === value);
});

if (value === "nouveau_bachelier") {

bacBlock.hidden = false;
levelBlock.hidden = true;
document.getElementById("currentLevel").value = "";

} else if (value === "en_cours") {

bacBlock.hidden = true;
levelBlock.hidden = false;
document.getElementById("bacSeries").value = "";
document.getElementById("bacMention").value = "";
document.getElementById("bacAverage").value = "";

} else {

bacBlock.hidden = true;
levelBlock.hidden = true;

}

}

toggle.querySelectorAll('input[name="studentStatus"]').forEach((input) => {
input.addEventListener("change", () => {
applyStatus(input.value);
updateCompletion();
});
});

applyStatus("");

return applyStatus;

}

// ==========================================================
// Âge dérivé de la date de naissance
// ==========================================================

function computeAge(birthDateStr) {

if (!birthDateStr) return "";

const birth = new Date(birthDateStr);
if (Number.isNaN(birth.getTime())) return "";

const today = new Date();
let age = today.getFullYear() - birth.getFullYear();
const monthDiff = today.getMonth() - birth.getMonth();

if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
age--;
}

return age >= 0 ? String(age) : "";

}

function initAgeCalculation() {

const birthDateInput = document.getElementById("birthDate");
const ageDisplay = document.getElementById("ageDisplay");

birthDateInput.addEventListener("change", () => {
ageDisplay.value = computeAge(birthDateInput.value);
});

}

// ==========================================================
// Nav des sections — surlignage au scroll + coches de complétion
// ==========================================================

const SECTION_COMPLETION_RULES = {
"sec-personal": () => !!(val("firstName") && val("lastName") && val("birthDate") && val("country")),
"sec-parcours": () => !!(val("lastDegree") && val("currentInstitution") && val("academicAverage") && radioValue("studentStatus")),
"sec-academique": () => !!(val("projects") || val("thesis") || val("publications") || val("researchExperience") || val("ranking")),
"sec-langues": () => state.languages.length > 0,
"sec-projet": () => !!(val("desiredField") && val("desiredDegree")),
"sec-destination": () => state.preferredCountries.size > 0 && !!radioValue("universityType"),
"sec-financier": () => !!(val("budget") && radioValue("hasSponsor")) && checkedValues("fundingWantedGroup").length > 0,
"sec-documents": () => checkedValues("documentsGroup").length > 0,
"sec-experiences": () => !!(val("internships") || val("workExperience") || val("associations") || val("volunteering") || val("entrepreneurship")),
"sec-objectifs": () => !!(val("whyLeave") && val("careerGoals") && val("dreams"))
};

function val(id) {
const el = document.getElementById(id);
return el ? String(el.value || "").trim() : "";
}

function radioValue(name) {
const checked = document.querySelector(`input[name="${name}"]:checked`);
return checked ? checked.value : "";
}

function checkedValues(containerId) {
const container = document.getElementById(containerId);
if (!container) return [];
return [...container.querySelectorAll('input[type="checkbox"]:checked')].map((i) => i.value);
}

function updateCompletion() {

let completedCount = 0;

document.querySelectorAll(".section-nav-item").forEach((item) => {

const sectionId = item.dataset.section;
const rule = SECTION_COMPLETION_RULES[sectionId];
const isComplete = rule ? !!rule() : false;

item.classList.toggle("is-complete", isComplete);

if (isComplete) completedCount++;

});

const scoreValue = document.getElementById("navScoreValue");
if (scoreValue) scoreValue.textContent = `${completedCount}/10`;

}

function initSectionNavScrollSpy() {

const navItems = [...document.querySelectorAll(".section-nav-item")];
const sections = navItems
.map((item) => document.getElementById(item.dataset.section))
.filter(Boolean);

if (!("IntersectionObserver" in window) || !sections.length) return;

const observer = new IntersectionObserver((entries) => {

entries.forEach((entry) => {

if (entry.isIntersecting) {

const activeItem = navItems.find((item) => item.dataset.section === entry.target.id);

navItems.forEach((item) => item.classList.remove("is-active"));
if (activeItem) activeItem.classList.add("is-active");

}

});

}, { rootMargin: "-20% 0px -70% 0px" });

sections.forEach((section) => observer.observe(section));

}

// ==========================================================
// Hydratation du formulaire depuis Firestore
// ==========================================================

function hydrateForm(profile, currentUser) {

document.getElementById("firstName").value = profile.firstName || "";
document.getElementById("lastName").value = profile.lastName || "";
document.getElementById("gender").value = profile.gender || "";
document.getElementById("birthDate").value = profile.birthDate || "";
document.getElementById("ageDisplay").value = computeAge(profile.birthDate);
document.getElementById("nationality").value = profile.nationality || "";
document.getElementById("country").value = profile.country || profile.originCountry || "";
document.getElementById("city").value = profile.city || "";
document.getElementById("phone").value = profile.phone || "";
document.getElementById("whatsapp").value = profile.whatsapp || "";
document.getElementById("profileEmail").value = currentUser.email || "";

document.getElementById("lastDegree").value = profile.lastDegree || profile.currentDegree || "";
document.getElementById("currentInstitution").value = profile.currentInstitution || "";
document.getElementById("graduationYear").value = profile.graduationYear || "";
document.getElementById("academicAverage").value = profile.academicAverage || "";
document.getElementById("bacSeries").value = profile.bacSeries || "";
document.getElementById("bacMention").value = profile.bacMention || "";
document.getElementById("bacAverage").value = profile.bacAverage || "";
document.getElementById("currentLevel").value = profile.currentLevel || "";

const applyStatus = initStatusToggle();
const initialStatus = profile.studentStatus || "";
if (initialStatus) {
const radio = document.querySelector(`input[name="studentStatus"][value="${initialStatus}"]`);
if (radio) radio.checked = true;
}
applyStatus(initialStatus);

document.getElementById("ranking").value = profile.ranking || "";
document.getElementById("strongSubjects").value = profile.strongSubjects || "";
document.getElementById("weakSubjects").value = profile.weakSubjects || "";
document.getElementById("projects").value = profile.projects || "";
document.getElementById("thesis").value = profile.thesis || "";
document.getElementById("publications").value = profile.publications || "";
document.getElementById("researchExperience").value = profile.researchExperience || "";

state.languages = Array.isArray(profile.languages) ? [...profile.languages] : [];
renderFixedLanguages();
renderOtherLanguageChips();
initOtherLanguageAdder();

document.getElementById("desiredField").value = profile.desiredField || "";
document.getElementById("specialization").value = profile.specialization || "";
document.getElementById("desiredDegree").value = profile.desiredDegree || "";

state.preferredCountries = new Set(profile.preferredCountries || []);
state.excludedCountries = new Set(profile.excludedCountries || []);
state.preferredContinents = new Set(profile.preferredContinents || []);

renderChipGroup(document.getElementById("preferredCountriesChips"), COUNTRY_OPTIONS, state.preferredCountries);
renderChipGroup(document.getElementById("excludedCountriesChips"), COUNTRY_OPTIONS, state.excludedCountries);
renderChipGroup(document.getElementById("preferredContinentsChips"), CONTINENT_OPTIONS, state.preferredContinents);

if (profile.universityType) {
const radio = document.querySelector(`input[name="universityType"][value="${profile.universityType}"]`);
if (radio) radio.checked = true;
}

document.getElementById("budget").value = profile.budget || "";

if (profile.hasSponsor) {
const radio = document.querySelector(`input[name="hasSponsor"][value="${profile.hasSponsor}"]`);
if (radio) radio.checked = true;
}

(profile.fundingWanted || []).forEach((value) => {
const input = document.querySelector(`#fundingWantedGroup input[value="${value}"]`);
if (input) input.checked = true;
});

(profile.documentsAvailable || []).forEach((value) => {
const input = document.querySelector(`#documentsGroup input[value="${value}"]`);
if (input) input.checked = true;
});

initCheckCards("documentsGroup", ".doc-check-card");

document.getElementById("internships").value = profile.internships || "";
document.getElementById("workExperience").value = profile.workExperience || "";
document.getElementById("associations").value = profile.associations || "";
document.getElementById("volunteering").value = profile.volunteering || "";
document.getElementById("entrepreneurship").value = profile.entrepreneurship || "";
document.getElementById("technicalSkills").value = profile.technicalSkills || "";
document.getElementById("computerSkills").value = profile.computerSkills || "";

document.getElementById("whyLeave").value = profile.whyLeave || "";
document.getElementById("careerGoals").value = profile.careerGoals || "";
document.getElementById("dreams").value = profile.dreams || "";

initAgeCalculation();
initSectionNavScrollSpy();
updateCompletion();

}

// ==========================================================
// Construction de l'objet à sauvegarder
// ==========================================================

function buildUpdatedProfile(existingName) {

const studentStatus = radioValue("studentStatus");

const updated = {

firstName: val("firstName"), lastName: val("lastName"),
gender: val("gender"), birthDate: val("birthDate"),
country: val("country"), city: val("city"), nationality: val("nationality"),
phone: val("phone"), whatsapp: val("whatsapp"),

lastDegree: val("lastDegree"), currentInstitution: val("currentInstitution"),
graduationYear: val("graduationYear"), academicAverage: val("academicAverage"),
studentStatus,
bacSeries: val("bacSeries"), bacMention: val("bacMention"), bacAverage: val("bacAverage"),
currentLevel: val("currentLevel"),

ranking: val("ranking"), strongSubjects: val("strongSubjects"), weakSubjects: val("weakSubjects"),
projects: val("projects"), thesis: val("thesis"), publications: val("publications"),
researchExperience: val("researchExperience"),

languages: state.languages,

desiredField: val("desiredField"), specialization: val("specialization"), desiredDegree: val("desiredDegree"),

preferredCountries: [...state.preferredCountries],
excludedCountries: [...state.excludedCountries],
preferredContinents: [...state.preferredContinents],
universityType: radioValue("universityType"),

budget: val("budget"), hasSponsor: radioValue("hasSponsor"),
fundingWanted: checkedValues("fundingWantedGroup"),

documentsAvailable: checkedValues("documentsGroup"),

internships: val("internships"), workExperience: val("workExperience"),
associations: val("associations"), volunteering: val("volunteering"),
entrepreneurship: val("entrepreneurship"),
technicalSkills: val("technicalSkills"), computerSkills: val("computerSkills"),

whyLeave: val("whyLeave"), careerGoals: val("careerGoals"), dreams: val("dreams")

};

// Alias hérités — recalculés pour que dashboard.js et les anciens
// outils IA continuent de fonctionner avant leur migration.
updated.originCountry = updated.country;
updated.currentDegree = studentStatus === "en_cours" ? updated.currentLevel : updated.lastDegree;
updated.englishLevel = (updated.languages.find((l) => l.code === "en") || {}).level || "";
updated.desiredCountry = updated.preferredCountries[0] || "";

updated.name = existingName;

return updated;

}

function showToast() {

const toast = document.getElementById("saveToast");
toast.classList.add("is-visible");

setTimeout(() => toast.classList.remove("is-visible"), 2600);

}

// ==========================================================
// Sidebar — repli desktop, tiroir mobile
// ==========================================================

function initSidebar() {

const SIDEBAR_COLLAPSE_KEY = "scholarbridge_sidebar_collapsed";

const collapseBtn = document.getElementById("sidebarCollapseBtn");
const openBtn = document.getElementById("sidebarOpenBtn");
const backdrop = document.getElementById("sidebarBackdrop");

if (localStorage.getItem(SIDEBAR_COLLAPSE_KEY) === "true") {
document.body.classList.add("sidebar-collapsed");
if (collapseBtn) collapseBtn.setAttribute("aria-expanded", "false");
}

if (collapseBtn) {

collapseBtn.addEventListener("click", () => {

const collapsed = document.body.classList.toggle("sidebar-collapsed");

collapseBtn.setAttribute("aria-expanded", String(!collapsed));
localStorage.setItem(SIDEBAR_COLLAPSE_KEY, String(collapsed));

});

}

function closeMobileSidebar() {
document.body.classList.remove("sidebar-open");
}

if (openBtn) {
openBtn.addEventListener("click", () => document.body.classList.add("sidebar-open"));
}

if (backdrop) {
backdrop.addEventListener("click", closeMobileSidebar);
}

document.addEventListener("keydown", (event) => {
if (event.key === "Escape") closeMobileSidebar();
});

document.querySelectorAll(".sidebar .nav-link, .sidebar-logout").forEach((el) => {
el.addEventListener("click", closeMobileSidebar);
});

}

initSidebar();

if (window.lucide) lucide.createIcons();

// ==========================================================
// FIREBASE
// ==========================================================

onAuthStateChanged(auth, async (currentUser) => {

if (!currentUser) {
window.location.href = "login.html";
return;
}

try {

const userRef = doc(db, "users", currentUser.uid);
let userSnap = await getDoc(userRef);

if (!userSnap.exists()) {

await setDoc(userRef, {
uid: currentUser.uid,
name: currentUser.displayName || "",
email: currentUser.email || "",
createdAt: serverTimestamp(),
profile: defaultProfile({ name: currentUser.displayName || "", email: currentUser.email || "" })
});

userSnap = await getDoc(userRef);

}

const userData = userSnap.data();

// Badge de formule dans la sidebar : profile.js ne passe pas par
// bootstrapShell() (voir js/app-shell.js — dashboard.js/profile.js ne
// sont volontairement pas migrés dessus), mais resolvePlan() est une
// fonction pure sans effet de bord : l'utiliser ici pour éviter un
// badge figé sur "Essentiel" quelle que soit la vraie formule.
const planBadge = document.getElementById("planBadge");
if (planBadge) planBadge.textContent = PLAN_LABELS[resolvePlan(userData)];

// Suspension de compte (Module 3 du Control Center admin) : même
// vérification que dashboard.js — voir son commentaire pour le détail
// de la limite actuelle (drapeau Firestore, pas encore une vraie
// désactivation Firebase Auth).
if (userData.disabled === true) {
window.location.replace("suspended.html");
return;
}

const profile = Object.assign(
defaultProfile(userData),
userData.profile || {}
);

hydrateForm(profile, currentUser);

// Recalcule les coches de complétion à chaque saisie.
document.getElementById("profileForm").addEventListener("input", updateCompletion);
document.getElementById("profileForm").addEventListener("change", updateCompletion);

const profileForm = document.getElementById("profileForm");
const saveButton = document.getElementById("saveProfileBtn");

profileForm.addEventListener("submit", async (event) => {

event.preventDefault();

if (!val("firstName") || !val("lastName")) {
alert("Merci de renseigner votre prénom et votre nom avant d'enregistrer.");
document.getElementById("firstName").focus();
return;
}

setButtonLoading(saveButton, true, "Enregistrement...");

try {

const updatedProfile = buildUpdatedProfile(userData.name || "");

await updateDoc(userRef, {
name: updatedProfile.name,
profile: updatedProfile
});

showToast();

} catch (error) {

console.error(error);

if (error.code === "unavailable" || error.code === "failed-precondition") {
alert("Vérifiez votre connexion Internet, puis réessayez d'enregistrer.");
} else {
alert("Une erreur est survenue lors de l'enregistrement de votre profil. Veuillez réessayer.");
}

} finally {

setButtonLoading(saveButton, false);

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
alert("Une erreur est survenue lors de la déconnexion. Veuillez réessayer.");
logoutBtn.dataset.busy = "false";

}

});

}

if (window.lucide) lucide.createIcons();

hidePageLoader();

} catch (error) {

console.error(error);
hidePageLoader();

document.body.innerHTML = `
<div style="padding:40px;text-align:center;">
<h2>Chargement interrompu</h2>
<p>Vérifiez votre connexion Internet, puis réessayez pour retrouver votre profil.</p>
<button onclick="window.location.reload()">Réessayer</button>
</div>
`;

}

});
