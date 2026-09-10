/**
* ============================================================
* eligibility-questions.js — la page du questionnaire
* ============================================================
*
* Le parcours et son contenu vivent désormais dans deux modules purs :
* js/eligibility-pistes.js (les questions, par niveau d'études) et
* js/eligibility-parcours.js (la progression). Ce fichier-ci ne fait
* plus que du DOM — c'est ce qui rend le questionnaire testable par
* `npm test`, ce qu'il n'a jamais été.
*
* Refonte du 2026-09-05 : le questionnaire n'est plus le même pour
* tout le monde. La première question fixe le niveau d'études, et tout
* le reste en découle — un bachelier ne répond plus aux questions d'un
* doctorant. Voir l'en-tête de js/eligibility-pistes.js pour le
* pourquoi (les exigences réelles des organismes, cycle par cycle).
*
* Deux détails que le DOM doit gérer et qui n'existaient pas avant :
*
*  - LE TOTAL BOUGE. La longueur du parcours dépend des réponses, et
*    n'est pas connue tant que le niveau ne l'est pas. Tant qu'il est
*    inconnu, on affiche « Question 1 » sans total plutôt qu'un chiffre
*    inventé.
*  - LES LIBELLÉS SONT CALCULÉS. `question`, `assistant`, `options` et
*    `suggestions` peuvent être des fonctions des réponses déjà
*    données (la moyenne d'un bachelier n'est pas celle d'un
*    doctorant) : tout passe par resoudre().
* ============================================================
*/

import { chargerUniversites } from "./js/catalog-data.js";

import {
questionsPour,
resoudre,
cycleViseEffectif,
pisteDepuisNiveau,
definirSuggestionsDestination
} from "./js/eligibility-pistes.js";

import { ParcoursEligibilite } from "./js/eligibility-parcours.js";

const parcours = new ParcoursEligibilite();

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

// Messages discrets qui rappellent, tout au long du parcours, que Fitz
// apprend à connaître l'étudiant plutôt qu'il ne collecte des cases.
const FITZ_HINTS = [
"Fitz apprend à connaître votre profil…",
"Analyse de votre parcours en cours…",
"Identification de vos objectifs…",
"Recherche des opportunités les plus pertinentes…"
];

// ==========================================================
// PAYS DE DESTINATION — synchronisés avec le vrai catalogue. En cas
// d'échec réseau, le filet de secours du module reste en place plutôt
// que de bloquer le test.
// ==========================================================
async function chargerPaysDeDestination() {

try {

// Universités SEULES : router cette page vers le catalogue complet
// la ferait passer d'environ 111 à 591 lectures pour rien.
const universites = await chargerUniversites();

const pays = [...new Set(universites.map((u) => u.country).filter(Boolean))]
.sort((a, b) => a.localeCompare(b, "fr"));

if (pays.length) definirSuggestionsDestination([...pays, "Je ne sais pas encore"]);

} catch (error) {

console.warn("Pays du catalogue indisponibles, filet de secours conservé :", error);

}

}

function renderIcon(container, iconName) {

if (!container) return;

// On recrée l'élément <i data-lucide> à chaque rendu : une fois
// transformé en <svg> par Lucide, il ne peut plus changer d'icône.
container.innerHTML = iconName ? `<i data-lucide="${iconName}"></i>` : "";

}

function refreshIcons() {
if (window.lucide) lucide.createIcons();
}

function updateFitzHint() {

if (!fitzHint) return;

const total = parcours.total() || FITZ_HINTS.length;

const step = Math.min(
FITZ_HINTS.length - 1,
Math.floor((parcours.index / total) * FITZ_HINTS.length)
);

fitzHint.textContent = FITZ_HINTS[step];

}

function updateProgress() {

const total = parcours.total();

// Le bandeau d'entrée (durée, gratuité, sans compte, résultat) ne sert
// qu'avant la première réponse.
const entree = document.getElementById("entree");
if (entree) entree.hidden = parcours.index > 0;

// Tant que le niveau d'études n'est pas connu, la longueur du
// parcours ne l'est pas non plus : on n'affiche pas de total plutôt
// que d'en inventer un.
questionNumber.textContent = total
? `Question ${parcours.index + 1} / ${total}`
: `Question ${parcours.index + 1}`;

const percent = parcours.progression();

progressPercent.textContent = `${percent}%`;
progressBar.style.width = `${percent}%`;

}

function avancer() {

if (parcours.suivante()) {
render();
} else {
finish();
}

}

function renderCards(options, existingAnswer) {

cardsContainer.innerHTML = "";

options.forEach((option) => {

const card = document.createElement("div");
card.className = "option-card";
card.setAttribute("role", "button");
card.tabIndex = 0;

// Icône FACULTATIVE : les échelles ordonnées (âge, niveaux de
// langue) n'en portent pas — cinq pictogrammes quasi identiques
// n'aident pas à choisir.
card.innerHTML = `
${option.icon ? `<i data-lucide="${option.icon}"></i>` : ""}
<span>${option.label}</span>
`;

if (option.label === existingAnswer) card.classList.add("selected");

function select() {

cardsContainer.querySelectorAll(".option-card").forEach((c) => c.classList.remove("selected"));
card.classList.add("selected");

parcours.enregistrer(parcours.courante().id, option.label);

// Un changement de niveau d'études recompose le parcours : on
// laisse enregistrer() replacer le curseur, puis on avance.
setTimeout(avancer, 250);

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
// MOYENNE À ÉCHELLE VARIABLE — sélecteur de système de notation, puis
// curseur ou boutons de lettres. La conversion vers un pourcentage
// commun se fait dans eligibility-ai.js (normalizeAverageToPercent).
// ==========================================================

function currentScaleFor(question) {

const scaleId = parcours.reponses[`${question.id}Scale`] || question.defaultScale;

return question.scales.find((s) => s.id === scaleId) || question.scales[0];

}

function renderScaleSelector(question) {

scaleSelector.style.display = "flex";
scaleSelector.innerHTML = "";

if (!parcours.reponses[`${question.id}Scale`]) {
parcours.enregistrer(`${question.id}Scale`, question.defaultScale);
}

const current = currentScaleFor(question);

question.scales.forEach((scale) => {

const chip = document.createElement("button");
chip.type = "button";
chip.className = "scale-chip";
chip.textContent = scale.label;

if (scale.id === current.id) chip.classList.add("selected");

chip.addEventListener("click", () => {

if (scale.id === current.id) return;

// Une valeur saisie dans un système ne veut rien dire dans un
// autre : on efface la réponse brute, pas l'échelle choisie.
delete parcours.reponses[question.id];
parcours.enregistrer(`${question.id}Scale`, scale.id);

renderScaleSelector(question);
renderAverageInput(question);

});

scaleSelector.appendChild(chip);

});

}

function renderAverageInput(question) {

const scale = currentScaleFor(question);
const existingAnswer = parcours.reponses[question.id];

if (scale.kind === "letters") {

sliderContainer.style.display = "none";
lettersContainer.style.display = "flex";
lettersContainer.innerHTML = "";

scale.options.forEach((letter) => {

const btn = document.createElement("button");
btn.type = "button";
btn.className = "letter-chip";
btn.textContent = letter;

if (letter === existingAnswer) btn.classList.add("selected");

btn.addEventListener("click", () => {

lettersContainer.querySelectorAll(".letter-chip").forEach((b) => b.classList.remove("selected"));
btn.classList.add("selected");

parcours.enregistrer(question.id, letter);

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

const question = parcours.courante();

if (!question) return;

const reponses = parcours.reponses;

renderIcon(questionIcon, question.icon);

questionEl.textContent = resoudre(question.question, reponses);

// L'IDENTIFIANT de la question, posé dans le DOM. Le libellé affiché
// dépend de la piste et se reformule d'un cycle à l'autre (« votre
// moyenne au lycée » / « votre moyenne de master ») : il ne peut donc
// servir de repère stable ni au harnais de vérification
// (scripts/verifier/) ni à une mesure d'abandon par question. L'id,
// lui, ne bouge pas.
questionEl.dataset.question = question.id;
assistantMessage.textContent = resoudre(question.assistant, reponses);

updateProgress();
updateFitzHint();

textContainer.style.display = "none";
cardsContainer.style.display = "none";
sliderContainer.style.display = "none";
scaleSelector.style.display = "none";
lettersContainer.style.display = "none";
suggestionsBox.style.display = "none";
suggestionsBox.innerHTML = "";

const existingAnswer = reponses[question.id];

if (question.type === "search") {

textContainer.style.display = "block";
answerInput.value = existingAnswer || "";
answerInput.focus();

} else if (question.type === "cards") {

cardsContainer.style.display = "grid";
renderCards(resoudre(question.options, reponses) || [], existingAnswer);

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

backButton.disabled = parcours.index === 0;

refreshIcons();

}

function validerEtAvancer() {

const question = parcours.courante();

if (!question) return;

if (question.type === "search") {

const value = answerInput.value.trim();

if (!value) {
answerInput.focus();
return;
}

parcours.enregistrer(question.id, value);

} else if (question.type === "slider") {

if (question.scales) {

const scale = currentScaleFor(question);

// Pour les lettres, la réponse ne vient que d'un clic : sans clic,
// on ne fabrique pas de valeur par défaut.
if (scale.kind === "letters") {
if (!parcours.reponses[question.id]) return;
} else {
parcours.enregistrer(question.id, sliderInput.value);
}

} else {

parcours.enregistrer(question.id, sliderInput.value);

}

} else if (question.type === "cards") {

if (!parcours.reponses[question.id]) return;

}

avancer();

}

function goBack() {

parcours.precedente();
render();

}

// N'accepte qu'un chemin relatif interne — jamais une URL absolue ni
// protocol-relative : returnTo vient de l'URL, potentiellement
// modifiable à la main.
function isSafeReturnTo(value) {
return typeof value === "string" && value.startsWith("/") && !value.startsWith("//");
}

function finish() {

const reponses = { ...parcours.reponses };

// Le cycle visé est ÉCRIT même quand sa question a été sautée (un
// bachelier ne peut viser qu'une licence : lui poser la question
// aurait été une case à cocher inutile). Sans cette ligne, tous les
// consommateurs en aval — barème, moteur de recommandation, analyse
// de Fitz — recevraient un cycle vide pour ces profils.
const cycle = cycleViseEffectif(reponses);
if (cycle) reponses.targetLevel = cycle;

// La piste, écrite une fois ici plutôt que redéduite partout : c'est
// elle qui dira au diagnostic quel barème appliquer.
reponses.piste = pisteDepuisNiveau(reponses.currentLevel);

sessionStorage.setItem("eligibilityResponses", JSON.stringify(reponses));

const returnTo = new URLSearchParams(window.location.search).get("returnTo");

window.location.href = returnTo && isSafeReturnTo(returnTo) ? returnTo : "results.html";

}

nextButton.addEventListener("click", validerEtAvancer);
backButton.addEventListener("click", goBack);

sliderInput.addEventListener("input", () => {
sliderValue.textContent = sliderInput.value;
});

answerInput.addEventListener("keydown", (event) => {
if (event.key === "Enter") {
event.preventDefault();
validerEtAvancer();
}
});

answerInput.addEventListener("input", () => {

const question = parcours.courante();

if (!question || question.type !== "search") return;

const suggestions = resoudre(question.suggestions, parcours.reponses) || [];

if (!suggestions.length) return;

const value = answerInput.value.toLowerCase();

suggestionsBox.innerHTML = "";

if (!value) {
suggestionsBox.style.display = "none";
return;
}

const matches = suggestions
.filter((suggestion) => suggestion.toLowerCase().includes(value))
.slice(0, 6);

// LA LISTE SE FERME QUAND IL N'Y A PLUS RIEN À SUGGÉRER (2026-09-05).
// Elle est en `position:absolute` juste sous le champ : sur un
// téléphone, elle recouvre exactement le bouton « Continuer »
// (mesuré à 390 px de large par scripts/verifier/). L'étudiant qui
// avait fini de taper « Sénégal » voyait donc sa propre réponse en
// suggestion PAR-DESSUS le bouton, et son pouce retombait sur la
// suggestion au lieu de valider. Quand la saisie est déjà exactement
// une suggestion, il n'y a plus rien à proposer : on referme.
const dejaExact = matches.some((suggestion) => suggestion.toLowerCase() === value);

if (!matches.length || dejaExact) {
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
if (!textContainer.contains(event.target)) suggestionsBox.style.display = "none";
});

await chargerPaysDeDestination();

render();
