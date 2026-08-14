// ============================================================
// eligibility-questions.js
// Moteur du questionnaire d'éligibilité. Les questions viennent de
// questions.js (QUESTIONS) et la progression est gérée par
// eligibility.engine.js (EligibilityEngine). Les réponses sont
// enregistrées dans sessionStorage puis lues par results.js, qui
// les fait analyser par EligibilityAI (eligibility-ai.js).
//
// Module (audit du 2026-08-14, avant : script classique) : la question
// "destinationCountry" a besoin d'une lecture Firestore avant son
// premier rendu pour proposer les pays réellement présents dans le
// catalogue (voir loadDestinationCountries ci-dessous) — impossible en
// script classique sans un import() dynamique plus verbeux. QUESTIONS
// (questions.js) et EligibilityEngine (eligibility.engine.js) restent
// des scripts classiques chargés avant celui-ci : leurs déclarations
// top-level restent visibles ici, un module lit normalement les
// bindings globaux posés par les scripts qui le précèdent.
// ============================================================

import { db } from "./firebase-config.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const engine = new EligibilityEngine(QUESTIONS);

const questionIcon = document.getElementById("questionIcon");
const questionEl = document.getElementById("question");
const assistantMessage = document.getElementById("assistantMessage");
const fitzHint = document.getElementById("fitzHint");
const questionNumber = document.getElementById("questionNumber");
const progressPercent = document.getElementById("progressPercent");
const progressBar = document.getElementById("progressBar");

const textContainer = document.getElementById("textContainer");
const answerInput = document.getElementById("answer");
const suggestionsBox = document.getElementById("suggestions");

const cardsContainer = document.getElementById("cardsContainer");

const sliderContainer = document.getElementById("sliderContainer");
const sliderInput = document.getElementById("sliderInput");
const sliderValue = document.getElementById("sliderValue");

const scaleSelector = document.getElementById("scaleSelector");
const lettersContainer = document.getElementById("lettersContainer");

const nextButton = document.getElementById("nextButton");
const backButton = document.getElementById("backButton");

// Messages discrets qui rappellent, tout au long du parcours, que
// Fitz est en train d'apprendre à connaître l'étudiant plutôt que
// de simplement collecter des données.
const FITZ_HINTS = [
"Fitz apprend à connaître votre profil…",
"Analyse de votre parcours en cours…",
"Identification de vos objectifs…",
"Recherche des opportunités les plus pertinentes…"
];

// ==========================================================
// PAYS DE DESTINATION — synchronisés avec le vrai catalogue (audit du
// 2026-08-14). Remplace la liste codée en dur de questions.js par les
// pays réellement présents dans "universities" dès que Firestore
// répond ; en cas d'échec (hors ligne...), le filet de secours défini
// dans questions.js reste en place plutôt que de bloquer le test.
// ==========================================================
async function loadDestinationCountries() {

const destinationQuestion = QUESTIONS.find((q) => q.id === "destinationCountry");

if (!destinationQuestion) return;

try {

const snap = await getDocs(collection(db, "universities"));

const countries = [...new Set(
snap.docs.map((d) => d.data().country).filter(Boolean)
)].sort((a, b) => a.localeCompare(b, "fr"));

if (countries.length) {
destinationQuestion.suggestions = [...countries, "Je ne sais pas encore"];
}

} catch (error) {

console.warn("Impossible de charger les pays du catalogue, utilisation du filet de secours :", error);

}

}

function renderIcon(container, iconName) {

if (!container) return;

// On recrée l'élément <i data-lucide> à chaque rendu : une fois
// transformé en <svg> par Lucide, il ne peut pas être réutilisé
// pour afficher une icône différente.
container.innerHTML = `<i data-lucide="${iconName}"></i>`;

}

function refreshIcons() {

if (window.lucide) lucide.createIcons();

}

function updateFitzHint() {

if (!fitzHint) return;

const total = engine.questions.length;
const step = Math.min(
FITZ_HINTS.length - 1,
Math.floor((engine.current / total) * FITZ_HINTS.length)
);

fitzHint.textContent = FITZ_HINTS[step];

}

function updateProgress() {

const total = engine.questions.length;

questionNumber.textContent = `Question ${engine.current + 1} / ${total}`;

const percent = engine.getProgress();

progressPercent.textContent = `${percent}%`;
progressBar.style.width = `${percent}%`;

}

function renderCards(options, existingAnswer) {

cardsContainer.innerHTML = "";

options.forEach((option) => {

const card = document.createElement("div");
card.className = "option-card";
card.setAttribute("role", "button");
card.tabIndex = 0;

card.innerHTML = `
<i data-lucide="${option.icon}"></i>
<span>${option.label}</span>
`;

if (option.label === existingAnswer) {
card.classList.add("selected");
}

function select() {

cardsContainer.querySelectorAll(".option-card").forEach((c) => {
c.classList.remove("selected");
});

card.classList.add("selected");

engine.saveAnswer(engine.getCurrentQuestion().id, option.label);

setTimeout(goNext, 250);

}

card.addEventListener("click", select);

card.addEventListener("keydown", (event) => {
if (event.key === "Enter" || event.key === " ") {
event.preventDefault();
select();
}
});

cardsContainer.appendChild(card);

});

refreshIcons();

}

// ==========================================================
// MOYENNE À ÉCHELLE VARIABLE (question "average") — sélecteur de
// système de notation (puces) + curseur ou boutons de lettres selon le
// système choisi. Voir le commentaire sur "scales" dans questions.js
// et normalizeAverageToPercent() dans eligibility-ai.js pour la
// conversion vers un pourcentage commun.
// ==========================================================

function currentScaleFor(question) {

const scaleId = engine.answers[`${question.id}Scale`] || question.defaultScale;

return question.scales.find((s) => s.id === scaleId) || question.scales[0];

}

function renderScaleSelector(question) {

scaleSelector.style.display = "flex";
scaleSelector.innerHTML = "";

if (!engine.answers[`${question.id}Scale`]) {
engine.saveAnswer(`${question.id}Scale`, question.defaultScale);
}

const current = currentScaleFor(question);

question.scales.forEach((scale) => {

const chip = document.createElement("button");
chip.type = "button";
chip.className = "scale-chip";
chip.textContent = scale.label;

if (scale.id === current.id) {
chip.classList.add("selected");
}

chip.addEventListener("click", () => {

if (scale.id === current.id) return;

// Une valeur saisie dans un système ne veut rien dire dans un autre
// (ex. "18" en /20 devient un GPA impossible si on bascule vers
// GPA/4 sans réinitialiser) — on efface la réponse brute, pas
// l'échelle choisie, pour repartir sur une valeur cohérente.
delete engine.answers[question.id];
engine.saveAnswer(`${question.id}Scale`, scale.id);

renderScaleSelector(question);
renderAverageInput(question);

});

scaleSelector.appendChild(chip);

});

}

function renderAverageInput(question) {

const scale = currentScaleFor(question);
const existingAnswer = engine.answers[question.id];

if (scale.kind === "letters") {

sliderContainer.style.display = "none";
lettersContainer.style.display = "flex";
lettersContainer.innerHTML = "";

scale.options.forEach((letter) => {

const btn = document.createElement("button");
btn.type = "button";
btn.className = "letter-chip";
btn.textContent = letter;

if (letter === existingAnswer) {
btn.classList.add("selected");
}

btn.addEventListener("click", () => {

lettersContainer.querySelectorAll(".letter-chip").forEach((b) => b.classList.remove("selected"));
btn.classList.add("selected");

engine.saveAnswer(question.id, letter);

});

lettersContainer.appendChild(btn);

});

} else {

lettersContainer.style.display = "none";
sliderContainer.style.display = "block";

sliderInput.min = scale.min;
sliderInput.max = scale.max;
sliderInput.step = scale.step;

const numericExisting = parseFloat(existingAnswer);
const value = !isNaN(numericExisting) ? numericExisting : (scale.min + scale.max) / 2;

sliderInput.value = value;
sliderValue.textContent = value;

sliderInput.setAttribute("aria-label", `Votre moyenne générale ${scale.label}`);

}

}

function render() {

const question = engine.getCurrentQuestion();

renderIcon(questionIcon, question.icon);

questionEl.textContent = question.question;
assistantMessage.textContent = question.assistant;

updateProgress();
updateFitzHint();

textContainer.style.display = "none";
cardsContainer.style.display = "none";
sliderContainer.style.display = "none";
scaleSelector.style.display = "none";
lettersContainer.style.display = "none";
suggestionsBox.style.display = "none";
suggestionsBox.innerHTML = "";

const existingAnswer = engine.answers[question.id];

if (question.type === "search") {

textContainer.style.display = "block";
answerInput.value = existingAnswer || "";
answerInput.focus();

} else if (question.type === "cards") {

cardsContainer.style.display = "grid";
renderCards(question.options, existingAnswer);

} else if (question.type === "slider") {

if (question.scales) {

renderScaleSelector(question);
renderAverageInput(question);

} else {

sliderContainer.style.display = "block";
sliderInput.min = question.min;
sliderInput.max = question.max;
sliderInput.step = question.step;
sliderInput.value = existingAnswer || (question.min + question.max) / 2;
sliderValue.textContent = sliderInput.value;

}

}

backButton.disabled = engine.current === 0;

refreshIcons();

}

function goNext() {

const question = engine.getCurrentQuestion();

if (question.type === "search") {

const value = answerInput.value.trim();

if (!value) {
answerInput.focus();
return;
}

engine.saveAnswer(question.id, value);

} else if (question.type === "slider") {

if (question.scales) {

const scale = currentScaleFor(question);

if (scale.kind === "letters") {

if (!engine.answers[question.id]) return;

} else {

engine.saveAnswer(question.id, sliderInput.value);

}

} else {

engine.saveAnswer(question.id, sliderInput.value);

}

} else if (question.type === "cards") {

if (!engine.answers[question.id]) {
return;
}

}

const hasNext = engine.next();

if (hasNext) {
render();
} else {
finish();
}

}

function goBack() {

engine.previous();
render();

}

// N'accepte qu'un chemin relatif interne ("/scholarship-details.html?...")
// — jamais une URL absolue ("https://…") ni protocol-relative ("//…") :
// returnTo vient de l'URL (potentiellement modifiable à la main), ce
// garde-fou évite qu'un lien forgé ne fasse atterrir l'étudiant sur un
// site externe une fois le test terminé.
function isSafeReturnTo(value) {

return typeof value === "string" && value.startsWith("/") && !value.startsWith("//");

}

function finish() {

sessionStorage.setItem(
"eligibilityResponses",
JSON.stringify(engine.answers)
);

// returnTo (voir eligibility-test.js) : ramène directement à la fiche
// qui a envoyé l'étudiant faire le test, plutôt que vers le résultat
// générique — c'est cette fiche précise qui l'intéressait.
const returnTo = new URLSearchParams(window.location.search).get("returnTo");

window.location.href = returnTo && isSafeReturnTo(returnTo) ? returnTo : "results.html";

}

nextButton.addEventListener("click", goNext);
backButton.addEventListener("click", goBack);

sliderInput.addEventListener("input", () => {
sliderValue.textContent = sliderInput.value;
});

answerInput.addEventListener("keydown", (event) => {
if (event.key === "Enter") {
event.preventDefault();
goNext();
}
});

answerInput.addEventListener("input", () => {

const question = engine.getCurrentQuestion();

if (question.type !== "search" || !question.suggestions) {
return;
}

const value = answerInput.value.toLowerCase();

suggestionsBox.innerHTML = "";

if (!value) {
suggestionsBox.style.display = "none";
return;
}

const matches = question.suggestions
.filter((suggestion) => suggestion.toLowerCase().includes(value))
.slice(0, 6);

if (!matches.length) {
suggestionsBox.style.display = "none";
return;
}

suggestionsBox.style.display = "block";

matches.forEach((match) => {

const item = document.createElement("div");
item.className = "suggestion";
item.textContent = match;

item.addEventListener("click", () => {
answerInput.value = match;
suggestionsBox.style.display = "none";
suggestionsBox.innerHTML = "";
});

suggestionsBox.appendChild(item);

});

});

document.addEventListener("click", (event) => {
if (!textContainer.contains(event.target)) {
suggestionsBox.style.display = "none";
}
});

await loadDestinationCountries();

render();
