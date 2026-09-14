import { db } from "./firebase-config.js";

import {
doc,
updateDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import { setButtonLoading } from "./auth-ui.js";
import { initShellChrome, bootstrapShell } from "./js/app-shell.js";
import { monterChampTelephone, synchroniserPays, champTelephone } from "./js/phone-field.js";
import { isoDepuisNom } from "./js/phone-international.js";
import { computeAge } from "./js/age-limits.js";
// Lot ACCEPTATION, partie 3 : « Fitz a besoin de ces informations pour
// choisir votre université » — la même règle que le remplissage
// (profilPretPourFitz), jamais une deuxième.
import { profilPretPourFitz } from "./js/fitz-choisit.js";
import { escapeHtml } from "./js/ai/format.js";
// Lot PROFIL-PAR-NIVEAU (2026-09-11) : le palier commande ce qui
// s'affiche et ce qui compte ; le score vient de la MÊME fonction que le
// tableau de bord, les outils Fitz et la fiche admin (bilanProfil) — plus
// de règles de complétion recopiées sur le DOM.
import { PALIERS, lirePalier, champsAcademiques, estSecondaire, studentStatusDuPalier, TESTS_DE_LANGUE, lireTestLangue, sectionsPour, domDeSection } from "./js/profil-par-niveau.js";
import { bilanProfil } from "./js/profile-score.js";
// Partie 4 : ne pas refaire répondre à ce que l'étudiant a déjà dit au
// diagnostic gratuit — pré-remplir les champs vides, jamais écraser.
import { appliquerDiagnostic, lireReponsesDiagnostic } from "./js/diagnostic-vers-profil.js";

// ?pour=fitz : arrivée depuis le paiement d'une formule bourses, profil
// pas encore prêt pour Fitz (lot ACCEPTATION). Conservé tel quel.
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
// js/eligibility-pistes.js (diagnostic gratuit) et que
// normalizeAverageToPercent() dans eligibility-ai.js, qui bascule
// dessus par identifiant ("20"/"100"/"gpa4"/"letters"/"other"). C'est
// aussi ce qui permet à js/diagnostic-vers-profil.js de reprendre la
// moyenne AVEC son échelle sans conversion — garder ces listes
// synchronisées si un système de notation est ajouté ou modifié.
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

// 0. Le palier (lot PROFIL-PAR-NIVEAU) — un des 8 identifiants de
// PALIERS ; "" pour un profil d'avant, lu comme 10 sections.
palier: "",

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
// Le test de langue (partie 3) — un état à quatre champs.
testLangue: { nature: "", score: "", date: "", prevuLe: "" },

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

// Les clés reprises du diagnostic, pas encore vérifiées par l'étudiant
// (mention « Repris de votre diagnostic — vérifiez »). Vidée à
// l'enregistrement.
reprisDuDiagnostic: [],

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
preferredContinents: new Set(),
// Le palier choisi (identifiant PALIERS) et, pour un profil d'avant ce
// lot, le studentStatus hérité qu'on ne perd pas tant qu'aucun palier
// n'est choisi.
palier: "",
studentStatusHerite: ""
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

// Une langue reprise du diagnostic SANS niveau (js/diagnostic-vers-
// profil.js ne devine pas le CECRL) : la ligne le dit, le niveau reste
// à choisir.
if (current && !current.level) row.classList.add("language-row--sans-niveau");

const picker = row.querySelector(".cecrl-picker");

picker.querySelectorAll("button").forEach((btn) => {

if (current && current.level === btn.dataset.level) {
btn.setAttribute("aria-pressed", "true");
}

btn.addEventListener("click", () => {

picker.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", "false"));
btn.setAttribute("aria-pressed", "true");
row.classList.remove("language-row--sans-niveau");

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
// LE PALIER — le premier écran (lot PROFIL-PAR-NIVEAU)
// ==========================================================
//
// Les 8 paliers du questionnaire public (PALIERS, js/profil-par-niveau.js)
// rendus en cartes radio. Le choix commande :
//   - le bloc « Bac » ou le bloc « niveau actuel » de la section 2 ;
//   - la section 3 (masquée au secondaire) et ses champs ;
//   - la section 9 (facultative ou non, stages/travail au secondaire) ;
//   - les sections comptées dans le score (bilanProfil).
// Aucune valeur n'est effacée quand le palier change : un champ masqué
// garde ce qu'il contient, l'étudiant peut revenir.

function renderPalierGrid() {

const grid = document.getElementById("palierGrid");
if (!grid) return;

grid.innerHTML = "";

PALIERS.forEach((p) => {

const option = document.createElement("label");
option.className = "palier-option";
option.dataset.value = p.id;
// Lot FINITIONS-VISUELLES : le rond du système ne se voit plus — l'input
// reste pour le clavier et le lecteur d'écran (profile.css le masque
// visuellement). Une seule icône AVANT le texte, une coche à droite
// quand la carte est choisie.
option.innerHTML = `<input type="radio" name="palier" value="${escapeHtml(p.id)}"><i data-lucide="${escapeHtml(p.icon)}"></i><span class="palier-option-text"></span><span class="palier-option-check" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" focusable="false"><path d="M20 6 9 17l-5-5"/></svg></span>`;
option.querySelector("input").addEventListener("focus", () => option.classList.add("has-focus"));
option.querySelector("input").addEventListener("blur", () => option.classList.remove("has-focus"));
option.querySelector("span").textContent = p.label;

option.querySelector("input").addEventListener("change", () => {
applyPalier(p.id);
updateCompletion();
});

grid.appendChild(option);

});

}

function applyPalier(palier) {

state.palier = palier;

document.querySelectorAll(".palier-option").forEach((opt) => {
opt.classList.toggle("is-selected", opt.dataset.value === palier);
});

const secondaire = estSecondaire(palier);
const sansPalier = !palier;

// Section 2 : Bac ou niveau actuel.
document.getElementById("bacFieldsBlock").hidden = !secondaire && !(sansPalier && state.studentStatusHerite === "nouveau_bachelier");
document.getElementById("currentLevelBlock").hidden = secondaire || (sansPalier && state.studentStatusHerite !== "en_cours");
// « Dernier diplôme obtenu » et « Moyenne générale » ne se demandent
// pas à un lycéen ni à un bachelier : le bloc Bac porte leur moyenne.
document.querySelectorAll('#sec-parcours [data-palier-champ]').forEach((el) => { el.hidden = secondaire; });

// Section 3 : masquée au secondaire, champs par palier.
const academiques = new Set(champsAcademiques(palier));
const sections = new Map(sectionsPour(palier).map((s) => [s.id, s.applicabilite]));
const secAcademique = document.getElementById("sec-academique");
secAcademique.hidden = sections.get("sec-academique") === "masquee";
secAcademique.querySelectorAll("[data-palier-champ]").forEach((el) => {
el.hidden = !academiques.has(el.dataset.palierChamp);
});

// Section 9 : stages et travail ne se demandent pas au secondaire.
document.querySelectorAll('#sec-experiences [data-palier-champ]').forEach((el) => { el.hidden = secondaire; });

// CHAQUE SECTION FACULTATIVE LE DIT ELLE-MÊME (2026-09-14).
//
// Seule « Expériences » portait sa pastille et sa phrase, écrites en
// dur ici. Depuis que QUATRE sections sont facultatives — celles dont
// aucun champ ne décide des opportunités proposées (voir la note du
// noyau dans js/profil-par-niveau.js) — les trois autres seraient
// restées muettes : l'étudiant aurait continué à les croire
// obligatoires, et c'est précisément ce qu'on répare.
//
// La pastille est injectée à côté du titre, la phrase complète le
// libellé d'aide existant. Aucun texte n'est perdu : on AJOUTE une
// phrase, on ne remplace pas celle qui explique à quoi la section sert.
const PROMESSE_FACULTATIVE = "Cette section n'entre pas dans votre score — remplissez-la quand vous voudrez : elle sert à Fitz pour vos lettres et la vérification de vos dossiers.";

// L'APPLICABILITÉ PAR ÉLÉMENT DE PAGE, ET NON PAR RÈGLE DE SCORE.
//
// `sections` est indexée sur les dix règles de profile-score.js.
// profile.html n'a que neuf `<section>` : « Langues » et « Projet
// d'études » vivent toutes deux dans « Pour commencer »
// (#sec-depart), et `document.getElementById("sec-langues")` rendait
// donc `null` — la boucle passait son chemin sans que rien ne le
// signale, et #sec-depart n'était atteint par aucune règle.
//
// Quand deux règles partagent une section, la plus exigeante gagne :
// une section qui porte un champ requis est requise. C'est le seul
// sens sûr — l'inverse masquerait une section à cause d'une règle
// qui ne la concerne qu'en partie.
const EXIGENCE = { masquee: 0, facultative: 1, requise: 2 };
const parElement = new Map();

for (const [id, applicable] of sections) {
const cible = domDeSection(id);
const deja = parElement.get(cible);
if (deja === undefined || EXIGENCE[applicable] > EXIGENCE[deja]) parElement.set(cible, applicable);
}

for (const [id, applicable] of parElement) {

const section = document.getElementById(id);
if (!section) continue;

const facultative = applicable === "facultative";
const titre = section.querySelector(".profile-section-heading h2");
const aide = section.querySelector(".profile-section-heading .field-hint");

// LA PASTILLE DIT « FACULTATIF », ET RIEN D'AUTRE.
//
// Elle disait « si vous en avez » : écrit pour « Expériences », où
// c'est juste. Sur les trois autres, ça ne veut rien dire —
// « Niveau académique si vous en avez », « Objectifs si vous en
// avez ». Un seul mot tient pour les quatre, et c'est celui que
// l'étudiant cherche.
//
// Le HTML n'en porte plus aucune : elles sont toutes créées ici, une
// fois, au même endroit que la phrase qui les explique.
if (titre) {
let pastille = titre.querySelector(".section-facultative");
if (!pastille && facultative) {
pastille = document.createElement("span");
pastille.className = "section-facultative";
pastille.textContent = "facultatif";
titre.appendChild(document.createTextNode(" "));
titre.appendChild(pastille);
}
if (pastille) pastille.hidden = !facultative;
}

if (aide) {
// Le libellé d'origine est mémorisé au premier passage : sans ça, un
// second appel (changement de palier) concaténerait deux fois.
if (aide.dataset.aideOrigine === undefined) aide.dataset.aideOrigine = aide.textContent.trim();
const origine = aide.dataset.aideOrigine;
aide.textContent = facultative ? `${origine} ${PROMESSE_FACULTATIVE}` : origine;
}

}

// La navigation reflète ce qui est masqué — sur la même table que
// les sections elles-mêmes, sinon l'entrée « Pour commencer »
// n'était décidée par rien du tout (`sections.get` rendait
// `undefined` pour elle, et c'est seulement par chance que cela
// revenait à « visible et non facultative »).
document.querySelectorAll(".section-nav-item").forEach((item) => {
const applicable = parElement.get(item.dataset.section);
item.hidden = applicable === "masquee";
item.classList.toggle("is-facultative", applicable === "facultative");
});

}

// ==========================================================
// LE TEST DE LANGUE (partie 3)
// ==========================================================

function renderTestLangueOptions() {

const select = document.getElementById("testLangueNature");
if (!select) return;

TESTS_DE_LANGUE.forEach((t) => {
const option = document.createElement("option");
option.value = t.id;
option.textContent = t.label;
select.appendChild(option);
});

}

function applyTestLangueEtat() {

const nature = val("testLangueNature");
const etat = radioValue("testLangueEtat");
const details = document.getElementById("testLangueDetails");

details.hidden = !nature || nature === "aucun";
document.getElementById("testLanguePasse").hidden = details.hidden || etat !== "passe";
document.getElementById("testLanguePrevu").hidden = details.hidden || etat !== "prevu";

}

function initTestLangue(profile) {

renderTestLangueOptions();

const t = lireTestLangue(profile);

document.getElementById("testLangueNature").value = t.nature;
document.getElementById("testLangueScore").value = t.score;
document.getElementById("testLangueDate").value = t.date;
document.getElementById("testLanguePrevuLe").value = t.prevuLe;

// L'état se déduit de ce qui est enregistré : une date de passage ou un
// score ⇒ « déjà passé » ; une date prévue ⇒ « pas encore passé ».
const etat = (t.score || t.date) ? "passe" : (t.prevuLe ? "prevu" : "");
if (etat) {
const radio = document.querySelector(`input[name="testLangueEtat"][value="${etat}"]`);
if (radio) radio.checked = true;
}

document.getElementById("testLangueNature").addEventListener("change", applyTestLangueEtat);
document.querySelectorAll('input[name="testLangueEtat"]').forEach((r) => r.addEventListener("change", applyTestLangueEtat));

applyTestLangueEtat();

}

function lireTestLangueDuFormulaire() {

const nature = val("testLangueNature");
if (!nature) return { nature: "", score: "", date: "", prevuLe: "" };
if (nature === "aucun") return { nature, score: "", date: "", prevuLe: "" };

const etat = radioValue("testLangueEtat");
if (etat === "passe") return { nature, score: val("testLangueScore"), date: val("testLangueDate"), prevuLe: "" };
if (etat === "prevu") return { nature, score: "", date: "", prevuLe: val("testLanguePrevuLe") };
return { nature, score: "", date: "", prevuLe: "" };

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

// Le nom du compte, pour buildUpdatedProfile — posé par bootstrapShell.
let NOM_DU_COMPTE = "";

// Le libellé de l'objet que Fitz choisit (« vos 4 universités »), selon
// la formule — posé par bootstrapShell ; « vos universités » sinon.
let OBJET_FITZ = "vos universités";

/**
* Les coches de la nav, le compteur et la ligne d'état — TOUS calculés
* sur l'objet qui serait enregistré, par la même fonction que le tableau
* de bord et la fiche admin (bilanProfil). La section « Pour commencer »
* est cochée quand Fitz a ce qu'il lui faut (profilPretPourFitz).
*/
function updateCompletion() {

const profil = buildUpdatedProfile(NOM_DU_COMPTE);
const bilan = bilanProfil(profil);
const fitz = profilPretPourFitz(profil);

const etatParSection = new Map(bilan.sections.map((s) => [s.id, s]));

document.querySelectorAll(".section-nav-item").forEach((item) => {
const id = item.dataset.section;
const complete = id === "sec-depart"
? fitz.pret && !!profil.palier
: !!(etatParSection.get(id) && etatParSection.get(id).remplie);
item.classList.toggle("is-complete", complete);
});

const scoreValue = document.getElementById("navScoreValue");
if (scoreValue) scoreValue.textContent = `${bilan.remplies}/${bilan.applicables}`;

const etat = document.getElementById("profileEtat");
if (etat) {
const manquants = fitz.manquants.length + (profil.palier ? 0 : 1);
if (manquants > 0) {
etat.textContent = manquants === 1
? `Plus qu'une information pour que Fitz choisisse ${OBJET_FITZ}.`
: `Plus que ${manquants} informations pour que Fitz choisisse ${OBJET_FITZ}.`;
etat.dataset.etat = "fitz";
} else if (bilan.remplies < bilan.applicables) {
const reste = bilan.applicables - bilan.remplies;
etat.textContent = `Fitz peut choisir. Encore ${reste === 1 ? "une section" : `${reste} sections`} pour un profil complet.`;
etat.dataset.etat = "sections";
} else {
etat.textContent = "Profil complet.";
etat.dataset.etat = "complet";
}
}

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
// « Repris de votre diagnostic — vérifiez » (partie 4)
// ==========================================================
//
// Les clés reprises (profile.reprisDuDiagnostic, écrit à la création du
// compte ou calculé à l'ouverture) allument la mention sous le champ.
// Les clés techniques (échelle de moyenne) suivent leur champ. La
// liste est vidée à l'enregistrement : l'étudiant a vérifié.

function afficherMentionsReprises(cles) {

const set = new Set((cles || []).map((c) => (c.endsWith("Scale") ? c.slice(0, -"Scale".length) : c)));

document.querySelectorAll("[data-repris]").forEach((el) => {
el.hidden = !set.has(el.dataset.repris);
});

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
// LE COMMENTAIRE DISAIT VRAI, LE CODE NON (corrigé le 2026-09-14).
// `isoSuggere` valait `null` : le pays de résidence n'était pas passé
// du tout, et un numéro enregistré sans indicatif retombait donc sur
// le pays par défaut du sélecteur — le Sénégal. Un étudiant en France
// dont le profil portait « 0612345678 » se voyait attribuer +221 ; le
// numéro faisait neuf chiffres, le Sénégal en attend neuf, la
// validation le laissait passer, et Fitz enregistrait
// « +221612345678 » : un numéro parfaitement valide qui n'est pas le
// sien, et qu'aucun message n'aurait signalé.
//
// `synchroniserPays` ne pouvait pas réparer ça : elle refuse — à
// juste titre — de déplacer le pays d'un champ déjà rempli (un
// Sénégalais installé au Canada a un numéro canadien). Elle ne sert
// donc qu'aux champs restés vides, et la suggestion doit arriver AVEC
// la valeur, pas après.
const isoSuggere = isoDepuisNom(profile.country || profile.originCountry || "");
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

// Le palier (lot PROFIL-PAR-NIVEAU). Un profil d'avant n'en a pas : ses
// blocs Bac / niveau actuel suivent alors l'ancien studentStatus, qu'on
// conserve tel quel jusqu'à ce qu'un palier soit choisi.
state.studentStatusHerite = profile.studentStatus || "";
renderPalierGrid();
const palier = lirePalier(profile);
if (palier) {
const radio = document.querySelector(`input[name="palier"][value="${palier}"]`);
if (radio) radio.checked = true;
}
applyPalier(palier);

document.getElementById("ranking").value = profile.ranking || "";
document.getElementById("strongSubjects").value = profile.strongSubjects || "";
document.getElementById("weakSubjects").value = profile.weakSubjects || "";
document.getElementById("projects").value = profile.projects || "";
document.getElementById("thesis").value = profile.thesis || "";
document.getElementById("publications").value = profile.publications || "";
document.getElementById("researchExperience").value = profile.researchExperience || "";

// Les langues : des objets {code, level} (profile.js) ; une chaîne
// (« français », anciens profils) est reconnue par son nom.
state.languages = (Array.isArray(profile.languages) ? profile.languages : []).map((l) => {
if (l && typeof l === "object") return { ...l };
const nom = String(l || "").trim();
const fixe = FIXED_LANGUAGES.find((f) => f.label.toLowerCase() === nom.toLowerCase());
return fixe ? { code: fixe.code, level: "" } : { code: "autre", name: nom, level: "" };
}).filter((l) => l.code && (l.code !== "autre" || l.name));
renderFixedLanguages();
renderOtherLanguageChips();
initOtherLanguageAdder();

initTestLangue(profile);

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

afficherMentionsReprises(profile.reprisDuDiagnostic);

initAgeCalculation();
initSectionNavScrollSpy();
updateCompletion();

}

// ==========================================================
// Construction de l'objet à sauvegarder
// ==========================================================

function buildUpdatedProfile(existingName) {

const palier = state.palier;

// Le studentStatus hérité (deux valeurs) se déduit du palier ; sans
// palier, on garde ce que le profil portait.
const studentStatus = studentStatusDuPalier(palier) || state.studentStatusHerite;

const updated = {

palier,

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
testLangue: lireTestLangueDuFormulaire(),

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

whyLeave: val("whyLeave"), careerGoals: val("careerGoals"), dreams: val("dreams"),

// L'étudiant enregistre : ce qu'il a repris du diagnostic est vérifié.
reprisDuDiagnostic: []

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

NOM_DU_COMPTE = userData.name || "";

const formule = window.SCHOLARBRIDGE_PLANS && window.SCHOLARBRIDGE_PLANS[session.planId];
const n = formule && Number.isFinite(formule.maxAccompaniedApplications) ? formule.maxAccompaniedApplications : 0;
OBJET_FITZ = n > 1 ? `vos ${n} universités` : (n === 1 ? "votre université" : "vos universités");

// Lot ACCEPTATION, partie 3 : le bandeau « Fitz a besoin de ces
// informations pour choisir votre université / vos N universités :
// [liste des manquants] ». N = le quota de la formule bourses.
const bandeauFitz = document.getElementById("fitzProfilBandeau");
if (bandeauFitz && POUR_FITZ) {
const { pret, manquants } = profilPretPourFitz(session.profile);
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

let profile = Object.assign(
defaultProfile(userData),
userData.profile || {}
);

// Partie 4 : les réponses du diagnostic de cette session pré-remplissent
// les champs VIDES — en mémoire seulement, rien n'est écrit tant que
// l'étudiant n'enregistre pas. Ce qui était déjà repris à la création du
// compte (reprisDuDiagnostic en base) garde sa mention.
const reponses = lireReponsesDiagnostic();
if (reponses) {
const dejaRepris = Array.isArray(profile.reprisDuDiagnostic) ? profile.reprisDuDiagnostic : [];
const { profil, repris } = appliquerDiagnostic(profile, reponses);
profile = profil;
profile.reprisDuDiagnostic = [...new Set([...dejaRepris, ...repris])];
}

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

// Le bouton qui a déclenché l'envoi (barre finale ou bouton de section)
// reçoit l'état de chargement ; les autres restent en place.
let boutonActif = saveButton;
profileForm.querySelectorAll('button[type="submit"]').forEach((b) => {
b.addEventListener("click", () => { boutonActif = b; });
});

profileForm.addEventListener("submit", async (event) => {

event.preventDefault();

// Le palier est la seule information sans laquelle le formulaire ne
// sait pas quoi montrer : c'est le premier clic, on le demande. Rien
// d'autre n'est obligatoire — la ligne d'état dit ce qui manque à
// Fitz, sans bloquer un enregistrement partiel.
if (!state.palier) {
alert("Indiquez d'abord où vous en êtes dans vos études : c'est ce qui adapte le reste du profil.");
document.getElementById("sec-depart").scrollIntoView({ behavior: "smooth", block: "start" });
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

const bouton = boutonActif || saveButton;
setButtonLoading(bouton, true, "Enregistrement...");

try {

const updatedProfile = buildUpdatedProfile(userData.name || "");

await updateDoc(userRef, {
name: updatedProfile.name,
profile: updatedProfile
});

// Enregistré : les mentions « repris du diagnostic » s'éteignent.
afficherMentionsReprises([]);

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

setButtonLoading(bouton, false);

}

});

if (window.lucide) lucide.createIcons();

});
