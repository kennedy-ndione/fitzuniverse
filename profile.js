import { db } from "./firebase-config.js";

import {
doc,
updateDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import { setButtonLoading } from "./auth-ui.js";
import { initShellChrome, bootstrapShell } from "./js/app-shell.js";
import { monterChampTelephone, synchroniserPays, champTelephone } from "./js/phone-field.js";
import { computeAge } from "./js/age-limits.js";
// Lot ACCEPTATION, partie 3 : « Fitz a besoin de ces informations pour
// choisir votre université » — la même règle que le remplissage
// (profilPretPourFitz), jamais une deuxième.
import { profilPretPourFitz } from "./js/fitz-choisit.js";
import { escapeHtml } from "./js/ai/format.js";

// ?pour=fitz : arrivée depuis le paiement d'une formule bourses, profil
// pas encore prêt pour Fitz. Le lot PROFIL-PAR-NIVEAU gardera ce
// comportement.
const POUR_FITZ = new URLSearchParams(window.location.search).get("pour") === "fitz";

// Chargeur de catalogue partagé et mémoïsé — voir js/catalog-data.js.
import { chargerUniversites } from "./js/catalog-data.js";

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

// Filet de secours si la lecture Firestore ci-dessous échoue (hors ligne...)
// — jamais bloquer la page sur une erreur réseau. Liste codée en dur
// historique, remplacée en pratique par les pays réellement présents
// dans "universities" dès que possible (loadDestinationCountryOptions),
// même principe que loadDestinationCountries() dans
// eligibility-questions.js pour le diagnostic gratuit.
const FALLBACK_COUNTRY_OPTIONS = [
"Canada", "France", "Belgique", "Suisse", "Allemagne", "Italie",
"Espagne", "Portugal", "Royaume-Uni", "Irlande", "Pays-Bas", "Suède",
"Norvège", "États-Unis", "Chine", "Hongrie", "Turquie", "Maroc",
"Tunisie", "Sénégal", "Afrique du Sud", "Australie", "Japon", "Corée du Sud"
];

let DESTINATION_COUNTRIES = FALLBACK_COUNTRY_OPTIONS;

async function loadDestinationCountryOptions() {

try {

// Universités SEULES : router cette page vers le catalogue complet la
// ferait passer d'environ 111 à 591 lectures pour rien.
const universites = await chargerUniversites();

const countries = [...new Set(
universites.map((u) => u.country).filter(Boolean)
)].sort((a, b) => a.localeCompare(b, "fr"));

if (countries.length) DESTINATION_COUNTRIES = countries;

} catch (error) {

console.warn("Impossible de charger les pays du catalogue, utilisation de la liste de secours :", error);

}

}

// Un pays déjà enregistré sur ce profil (préféré ou refusé) reste proposé
// et coché même s'il n'apparaît plus dans DESTINATION_COUNTRIES — jamais
// perdre le choix de l'étudiant si le catalogue a changé depuis.
function renderCountryChipGroups(profile) {

const preferredOptions = [...new Set([...DESTINATION_COUNTRIES, ...(profile.preferredCountries || [])])];
const excludedOptions = [...new Set([...DESTINATION_COUNTRIES, ...(profile.excludedCountries || [])])];

renderChipGroup(document.getElementById("preferredCountriesChips"), preferredOptions, state.preferredCountries);
renderChipGroup(document.getElementById("excludedCountriesChips"), excludedOptions, state.excludedCountries);

}

const CONTINENT_OPTIONS = [
"Afrique", "Europe", "Amérique du Nord", "Amérique du Sud", "Asie", "Océanie"
];

// Mêmes échelles, mêmes identifiants que la question "average" de
// questions.js (utilisée par le diagnostic gratuit, eligibility-questions.js)
// et que normalizeAverageToPercent() dans eligibility-ai.js, qui bascule
// dessus par identifiant ("20"/"100"/"gpa4"/"letters"/"other"). Dupliquée
// ici plutôt qu'importée : questions.js est un script classique pensé pour
// le moteur EligibilityEngine (QUESTIONS global), pas un module réutilisable
// par une page comme profile.js — garder ces deux listes synchronisées si
// un système de notation est ajouté ou modifié.
const AVERAGE_SCALES = [
{ id: "20", label: "/20", kind: "numeric", placeholder: "Ex. 14,5" },
{ id: "100", label: "/100", kind: "numeric", placeholder: "Ex. 78" },
{ id: "gpa4", label: "GPA /4", kind: "numeric", placeholder: "Ex. 3.5" },
{ id: "letters", label: "Lettres (A-F)", kind: "letters", options: ["A", "B", "C", "D", "F"] },
{ id: "other", label: "Autre système (%)", kind: "numeric", placeholder: "Ex. 82" }
];

const AVERAGE_DEFAULT_SCALE = "20";

// État en mémoire des échelles choisies pour academicAverage/bacAverage —
// même raisonnement que `state` ci-dessous pour les champs multi-valeurs.
const averageScaleState = {};

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
academicAverageScale: "", studentStatus: "", bacSeries: "", bacMention: "",
bacAverage: "", bacAverageScale: "", currentLevel: "",

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
// Moyenne à échelle variable (academicAverage / bacAverage) — même
// principe que currentScaleFor()/renderScaleSelector()/renderAverageInput()
// dans eligibility-questions.js, adapté au style de profile.html : chips
// .chip-select existantes pour le choix d'échelle (et pour les lettres),
// simple champ texte pour la valeur plutôt que le curseur du diagnostic
// (hors de propos ici, un formulaire de profil n'est pas un wizard).
// ==========================================================

function currentAverageScale(fieldId) {
const scaleId = averageScaleState[fieldId] || AVERAGE_DEFAULT_SCALE;
return AVERAGE_SCALES.find((s) => s.id === scaleId) || AVERAGE_SCALES[0];
}

function renderAverageScaleChips(fieldId) {

const container = document.getElementById(`${fieldId}ScaleChips`);
if (!container) return;

container.innerHTML = "";

const current = currentAverageScale(fieldId);

AVERAGE_SCALES.forEach((scale) => {

const chip = document.createElement("button");
chip.type = "button";
chip.className = "chip";
chip.textContent = scale.label;
chip.setAttribute("aria-pressed", String(scale.id === current.id));

chip.addEventListener("click", () => {

if (scale.id === current.id) return;

// Une valeur saisie dans un système ne veut rien dire dans un autre
// (même règle que renderScaleSelector() dans eligibility-questions.js) —
// on efface la valeur brute, pas l'échelle affichée après coup.
document.getElementById(fieldId).value = "";

averageScaleState[fieldId] = scale.id;

renderAverageScaleChips(fieldId);
renderAverageValueInput(fieldId);
updateCompletion();

});

container.appendChild(chip);

});

}

function renderAverageValueInput(fieldId) {

const scale = currentAverageScale(fieldId);
const input = document.getElementById(fieldId);
const lettersContainer = document.getElementById(`${fieldId}Letters`);

if (!input || !lettersContainer) return;

if (scale.kind === "letters") {

input.hidden = true;
lettersContainer.hidden = false;
lettersContainer.innerHTML = "";

const existing = input.value;

scale.options.forEach((letter) => {

const btn = document.createElement("button");
btn.type = "button";
btn.className = "chip";
btn.textContent = letter;
btn.setAttribute("aria-pressed", String(letter === existing));

btn.addEventListener("click", () => {

lettersContainer.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", "false"));
btn.setAttribute("aria-pressed", "true");

input.value = letter;
updateCompletion();

});

lettersContainer.appendChild(btn);

});

} else {

input.hidden = false;
lettersContainer.hidden = true;
input.placeholder = scale.placeholder;

}

}

// Un academicAverage/bacAverage déjà rempli sur un profil existant, sans
// echelle associée (comptes créés avant ce lot), est traité comme "/20" —
// comportement inchangé pour ces comptes, aucune donnée perdue.
function initAverageScaleField(fieldId, existingValue, existingScaleId) {

averageScaleState[fieldId] = existingScaleId || AVERAGE_DEFAULT_SCALE;
document.getElementById(fieldId).value = existingValue || "";

renderAverageScaleChips(fieldId);
renderAverageValueInput(fieldId);

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
// Âge dérivé de la date de naissance — computeAge vit désormais dans
// js/age-limits.js (elle renvoie number|null), partagée avec le moteur
// de recommandation qui compare cet âge aux limites `ageMax` des
// bourses. Ici on ne garde que la mise en chaîne pour #ageDisplay.
// ==========================================================

function ageAffichable(birthDateStr) {
const age = computeAge(birthDateStr);
return age === null ? "" : String(age);
}

function initAgeCalculation() {

const birthDateInput = document.getElementById("birthDate");
const ageDisplay = document.getElementById("ageDisplay");

birthDateInput.addEventListener("change", () => {
ageDisplay.value = ageAffichable(birthDateInput.value);
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
document.getElementById("ageDisplay").value = ageAffichable(profile.birthDate);
document.getElementById("nationality").value = profile.nationality || "";
document.getElementById("country").value = profile.country || profile.originCountry || "";
document.getElementById("city").value = profile.city || "";
// Téléphone et WhatsApp passent par le champ international
// (js/phone-field.js) : l'input d'origine reste la source de vérité
// mais porte désormais du E.164, et c'est lui que val("phone") lit
// plus bas — buildUpdatedProfile n'a donc rien eu à changer.
//
// Le pays de résidence est passé en suggestion : un profil déjà
// enregistré contient un numéro écrit sans indicatif, et c'est la
// seule information dont on dispose pour deviner d'où il vient.
const isoSuggere = null;
champTelephone("phone")?.definir(profile.phone || "", isoSuggere);
champTelephone("whatsapp")?.definir(profile.whatsapp || "", isoSuggere);
synchroniserPays(profile.country || profile.originCountry || "");
document.getElementById("profileEmail").value = currentUser.email || "";

document.getElementById("lastDegree").value = profile.lastDegree || profile.currentDegree || "";
document.getElementById("currentInstitution").value = profile.currentInstitution || "";
document.getElementById("graduationYear").value = profile.graduationYear || "";
initAverageScaleField("academicAverage", profile.academicAverage, profile.academicAverageScale);
document.getElementById("bacSeries").value = profile.bacSeries || "";
document.getElementById("bacMention").value = profile.bacMention || "";
initAverageScaleField("bacAverage", profile.bacAverage, profile.bacAverageScale);
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

renderCountryChipGroups(profile);
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
academicAverageScale: averageScaleState.academicAverage || AVERAGE_DEFAULT_SCALE,
studentStatus,
bacSeries: val("bacSeries"), bacMention: val("bacMention"), bacAverage: val("bacAverage"),
bacAverageScale: averageScaleState.bacAverage || AVERAGE_DEFAULT_SCALE,
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

initShellChrome();

// ==========================================================
// FIREBASE
// ==========================================================

bootstrapShell().then((session) => {

if (!session) return;

const { user, userData } = session;

const userRef = doc(db, "users", user.uid);

// Lot ACCEPTATION, partie 3 : le bandeau « Fitz a besoin de ces
// informations pour choisir votre université / vos N universités :
// [liste des manquants] ». N = le quota de la formule bourses.
const bandeauFitz = document.getElementById("fitzProfilBandeau");
if (bandeauFitz && POUR_FITZ) {
const { pret, manquants } = profilPretPourFitz(session.profile);
const formule = window.SCHOLARBRIDGE_PLANS && window.SCHOLARBRIDGE_PLANS[session.planId];
const n = formule && Number.isFinite(formule.maxAccompaniedApplications) ? formule.maxAccompaniedApplications : 0;
const objet = n > 1 ? `vos ${n} universités` : "votre université";
if (!pret) {
bandeauFitz.hidden = false;
bandeauFitz.innerHTML = `<i data-lucide="user-round"></i><span>Fitz a besoin de ces informations pour choisir ${escapeHtml(objet)} : <strong>${escapeHtml(manquants.join(", "))}</strong>.</span>`;
if (window.lucide) lucide.createIcons();
} else {
// Déjà prêt : rien à compléter, les propositions attendent.
window.location.replace("applications.html");
return;
}
}

const profile = Object.assign(
defaultProfile(userData),
userData.profile || {}
);

// Les champs internationaux sont montés AVANT l'hydratation : c'est
// eux qui savent relire un numéro enregistré.
monterChampTelephone("phone");
monterChampTelephone("whatsapp");

// Le pays de résidence n'est pas figé : un étudiant qui le corrige
// après coup doit voir l'indicatif suivre — tant qu'il n'a pas
// lui-même saisi de numéro (voir suggererPays).
document.getElementById("country").addEventListener("input", (event) => {
synchroniserPays(event.target.value);
});

hydrateForm(profile, user);

// Rendu instantané avec la liste de secours (ci-dessus), puis mise à
// jour en place des chips de pays dès que le vrai catalogue est chargé —
// jamais de page bloquée en attendant Firestore, jamais de sélection déjà
// cochée perdue pendant la bascule (renderCountryChipGroups en tient compte).
loadDestinationCountryOptions().then(() => renderCountryChipGroups(profile));

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

// Un numéro faux enregistré en silence est exactement ce que le
// champ international existe pour empêcher : c'est au moment de
// l'enregistrement qu'on s'en aperçoit, ou jamais. Le message posé
// sous le champ dit combien de chiffres sont attendus — la
// validation ne porte que sur la longueur, et accepte plusieurs
// valeurs quand le pays en admet plusieurs.
for (const id of ["phone", "whatsapp"]) {

const champ = champTelephone(id);

if (champ && !champ.valider()) {
champ.elements.national.focus();
champ.elements.national.scrollIntoView({ behavior: "smooth", block: "center" });
return;
}

}

setButtonLoading(saveButton, true, "Enregistrement...");

try {

const updatedProfile = buildUpdatedProfile(userData.name || "");

await updateDoc(userRef, {
name: updatedProfile.name,
profile: updatedProfile
});

// Lot ACCEPTATION, partie 3 : arrivé ici pour Fitz (?pour=fitz), dès
// que l'enregistrement rend le profil prêt, la page renvoie vers « Mes
// candidatures » — les propositions à accepter.
if (POUR_FITZ && profilPretPourFitz(updatedProfile).pret) {
window.location.href = "applications.html";
return;
}

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

if (window.lucide) lucide.createIcons();

});
