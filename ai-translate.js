/**
* ============================================================
* FitzUniverse — AI Translate (ai-translate.js)
* ============================================================
* Traduction texte/fichier entre 6 langues (js/ai/simulated-responses.js
* fournit le lexique et l'heuristique de détection), inversion des
* langues, historique local des dernières traductions
* (js/ai/chat-store.js).
* ============================================================
*/

import { initShellChrome, bootstrapShell, unlockingPlans, PLAN_LABELS, ESPACE_OUTILS } from "./js/app-shell.js";
import { FITZ_UNLOCK_CTA, unlockPlanPhrase } from "./js/fitz-voice.js";
import { generate, messageErreurFitz, estArret } from "./js/ai/ai-client.js";
import { LANGUAGES, detectLanguage, estRTL } from "./js/ai/simulated-responses.js";
import { parcoursDOutil } from "./js/parcours.js";

let parcoursTraduction = "bourse";
import { getTranslationHistory, addTranslationHistory, saveGeneratedDocument } from "./js/ai/chat-store.js";
import { showToast, copyToClipboard, downloadTextFile } from "./js/ai/toast.js";
import { trackEvent } from "./js/analytics.js";
import { extractTextFromFile } from "./js/ai/extract-text.js";

initShellChrome();

if (window["pdfjsLib"]) {
window["pdfjsLib"].GlobalWorkerOptions.workerSrc =
"https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
}

function renderLockedState(container, ctx) {

const flags = ctx.featureFlags.ai_translate;
const target = unlockingPlans(ctx.planId, flags)[0];

container.innerHTML = `
<div class="ai-locked-hero">
<div class="ai-locked-icon"><i data-lucide="lock"></i></div>
<h2>Traduction de documents</h2>
<p>Cette fonctionnalité est disponible avec ${unlockPlanPhrase(target ? PLAN_LABELS[target] : null)}. Passez à une formule supérieure pour traduire vos documents avec Fitz.</p>
<a href="${target ? `offers.html#${target}` : "offers.html"}" class="btn btn-primary">
<span>${FITZ_UNLOCK_CTA}</span>
</a>
</div>
`;

container.hidden = false;

if (window.lucide) lucide.createIcons();

}

function initTranslateTool() {

const sourceLanguageSelect = document.getElementById("sourceLanguage");
const targetLanguageSelect = document.getElementById("targetLanguage");
const autoDetect = document.getElementById("autoDetect");
const swapBtn = document.getElementById("swapBtn");

const modeTabs = document.querySelectorAll(".ai-mode-tab");
const textModePanel = document.getElementById("textModePanel");
const fileModePanel = document.getElementById("fileModePanel");

const sourceText = document.getElementById("sourceText");
const targetText = document.getElementById("targetText");

const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("fileInput");
const fileTargetText = document.getElementById("fileTargetText");

const translateBtn = document.getElementById("translateBtn");
const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");

const historyList = document.getElementById("historyList");

let mode = "text";
let selectedFile = null;
let lastResult = "";
let activeController = null;

LANGUAGES.forEach((lang) => {

sourceLanguageSelect.add(new Option(lang.label, lang.code));
targetLanguageSelect.add(new Option(lang.label, lang.code));

});

// SUR LA ROUTE, ON TRADUIT VERS LE FRANÇAIS (2026-09-17).
//
// Mesuré en ligne : l'outil s'ouvrait sur « Traduire vers : Anglais »,
// y compris quand on y arrivait par l'étape 4 ou 7 de la route, dont la
// consigne officielle dit l'inverse — « un document dans une autre
// langue que le français doit être traduit ». Un étudiant ghanéen
// venait faire traduire son relevé pour Études en France et repartait
// avec de l'anglais vers de l'anglais.
//
// La détection automatique s'occupe de la langue SOURCE (case cochée,
// sélecteur désactivé) : il n'y a donc rien à deviner sur les documents
// de l'étudiant, seulement une destination à ne pas se tromper. La
// valeur de repli du sélecteur source ne sert qu'à celui qui décoche la
// détection — elle ne doit jamais égaler la cible, sinon il lit
// « français → français ».
targetLanguageSelect.value = parcoursTraduction === "preinscription" ? "fr" : "en";
sourceLanguageSelect.value = targetLanguageSelect.value === "fr" ? "en" : "fr";
sourceLanguageSelect.disabled = true;

/**
* LE SENS D'ÉCRITURE SUIT LA LANGUE (2026-09-17).
*
* Un relevé de notes arabe collé dans une zone alignée à gauche s'écrit
* à l'envers sous les yeux de l'étudiant : la ponctuation saute à
* l'autre bout de la ligne, les chiffres se mélangent au texte, et il
* croit que l'outil a abîmé son document. `dir` est le seul attribut
* qui règle cela, et il se pose par zone, pas sur la page — les deux
* zones peuvent porter deux langues de sens opposés.
*
* `estRTL` vit dans js/ai/simulated-responses.js avec la liste des
* langues : le jour où le persan ou l'hébreu s'ajoutent, rien à écrire
* ici.
*/
function appliquerSens() {
sourceText.dir = estRTL(sourceLanguageSelect.value) ? "rtl" : "ltr";
targetText.dir = estRTL(targetLanguageSelect.value) ? "rtl" : "ltr";
}

appliquerSens();
sourceLanguageSelect.addEventListener("change", appliquerSens);
targetLanguageSelect.addEventListener("change", appliquerSens);

// L'AVERTISSEMENT DU TRADUCTEUR ASSERMENTÉ, sur le parcours qui en a
// besoin. La consigne officielle des étapes 4 et 7 est formelle : un
// document dans une autre langue que le français doit être traduit par
// un traducteur assermenté, original joint. Sans cette phrase, un
// étudiant repartait avec la sortie de Fitz en croyant tenir une pièce
// déposable — et l'aurait découvert APRÈS les 85 000 F de frais de
// dossier, non remboursables.
const traductionNotice = document.getElementById("traductionNotice");
if (traductionNotice) traductionNotice.hidden = parcoursTraduction !== "preinscription";

autoDetect.addEventListener("change", () => {
sourceLanguageSelect.disabled = autoDetect.checked;
});

swapBtn.addEventListener("click", () => {

const wasAuto = autoDetect.checked;

autoDetect.checked = false;
sourceLanguageSelect.disabled = false;

const sourceValue = sourceLanguageSelect.value;
sourceLanguageSelect.value = targetLanguageSelect.value;
targetLanguageSelect.value = sourceValue;

const sourceValueText = sourceText.value;
sourceText.value = targetText.value;
targetText.value = sourceValueText;

if (wasAuto) autoDetect.checked = false;

appliquerSens();

});

modeTabs.forEach((tab) => {

tab.addEventListener("click", () => {

mode = tab.dataset.mode;

modeTabs.forEach((t) => t.classList.toggle("is-active", t === tab));
textModePanel.hidden = mode !== "text";
fileModePanel.hidden = mode !== "file";

});

});

dropzone.addEventListener("click", () => fileInput.click());

["dragover", "dragenter"].forEach((evt) => {
dropzone.addEventListener(evt, (e) => {
e.preventDefault();
dropzone.classList.add("is-dragover");
});
});

["dragleave", "drop"].forEach((evt) => {
dropzone.addEventListener(evt, () => dropzone.classList.remove("is-dragover"));
});

dropzone.addEventListener("drop", (e) => {
e.preventDefault();
if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
});

fileInput.addEventListener("change", () => {
if (fileInput.files[0]) setFile(fileInput.files[0]);
});

function setFile(file) {

selectedFile = file;

dropzone.querySelector("strong").textContent = file.name;
dropzone.querySelector("span").textContent = `${(file.size / 1024).toFixed(0)} Ko — cliquez pour changer de fichier`;

}

function renderHistory() {

const history = getTranslationHistory();

if (!history.length) {
historyList.innerHTML = `<p class="ai-field-hint">Vos dernières traductions apparaîtront ici.</p>`;
return;
}

historyList.innerHTML = "";

history.forEach((entry) => {

const item = document.createElement("div");
item.className = "ai-history-item";

item.innerHTML = `
<div class="ai-history-item-text">
<strong></strong>
<span></span>
</div>
<i data-lucide="rotate-ccw"></i>
`;

item.querySelector("strong").textContent = entry.excerpt;
item.querySelector("span").textContent = `${entry.sourceLabel} → ${entry.targetLabel} · ${entry.date}`;

item.addEventListener("click", () => {

mode = "text";
modeTabs.forEach((t) => t.classList.toggle("is-active", t.dataset.mode === "text"));
textModePanel.hidden = false;
fileModePanel.hidden = true;

autoDetect.checked = false;
sourceLanguageSelect.disabled = false;
sourceLanguageSelect.value = entry.sourceCode;
targetLanguageSelect.value = entry.targetCode;
sourceText.value = entry.sourceText;
targetText.value = entry.targetText;
appliquerSens();

lastResult = entry.targetText;
copyBtn.disabled = false;
downloadBtn.disabled = false;

});

historyList.appendChild(item);

});

if (window.lucide) lucide.createIcons();

}

async function runTranslation() {

const targetCode = targetLanguageSelect.value;

let rawText;

if (mode === "text") {

rawText = sourceText.value.trim();

if (!rawText) {
showToast("Ajoutez un texte à traduire pour continuer.", { type: "error" });
return;
}

} else {

if (!selectedFile) {
showToast("Choisissez un document à traduire pour continuer.", { type: "error" });
return;
}

translateBtn.disabled = true;
translateBtn.querySelector("span").textContent = "Extraction du texte…";

try {

rawText = await extractTextFromFile(selectedFile);

} catch (error) {

translateBtn.disabled = false;
translateBtn.querySelector("span").textContent = "Traduire";

showToast(
error.message === "UNSUPPORTED_FORMAT"
? "L'extraction de texte n'est pas encore prise en charge pour ce format (Word, image) — collez le texte dans l'onglet « Texte » en attendant."
: "Impossible de lire ce fichier — vérifiez qu'il n'est pas corrompu.",
{ type: "error" }
);

return;

}

if (!rawText) {

translateBtn.disabled = false;
translateBtn.querySelector("span").textContent = "Traduire";
showToast("Aucun texte n'a pu être extrait de ce document — il est peut-être scanné en image sans couche de texte.", { type: "error" });

return;

}

}

const sourceCode = autoDetect.checked ? detectLanguage(rawText) : sourceLanguageSelect.value;

if (autoDetect.checked) sourceLanguageSelect.value = sourceCode;

// La détection vient de changer la langue source sans passer par le
// sélecteur : l'événement « change » n'a pas eu lieu, le sens non plus.
appliquerSens();

translateBtn.disabled = true;
translateBtn.querySelector("span").textContent = "Traduction en cours…";
copyBtn.disabled = true;
downloadBtn.disabled = true;

activeController = new AbortController();

const outputEl = mode === "text" ? targetText : null;

if (outputEl) outputEl.value = "";

try {

const { text } = await generate({
task: "translate",
input: { text: rawText, sourceLanguage: sourceCode, targetLanguage: targetCode, parcours: parcoursTraduction },
signal: activeController.signal,
onToken: (partial) => {
if (outputEl) outputEl.value = partial;
}
});

lastResult = text;

if (mode === "text") {

targetText.value = text;

} else {

fileTargetText.innerHTML = "";
const p = document.createElement("p");
p.textContent = text;
fileTargetText.appendChild(p);

}

copyBtn.disabled = false;
downloadBtn.disabled = false;

const sourceLabel = LANGUAGES.find((l) => l.code === sourceCode)?.label || sourceCode;
const targetLabel = LANGUAGES.find((l) => l.code === targetCode)?.label || targetCode;

addTranslationHistory({
excerpt: rawText.slice(0, 60) + (rawText.length > 60 ? "…" : ""),
sourceCode,
targetCode,
sourceLabel,
targetLabel,
sourceText: rawText,
targetText: text,
date: new Date().toLocaleDateString("fr-FR")
});

renderHistory();

saveGeneratedDocument({
icon: "languages",
title: `Traduction ${sourceLabel} → ${targetLabel}`,
type: "Traduction IA",
date: new Date().toLocaleDateString("fr-FR"),
content: text,
meta: { tool: "ai-translate", sourceCode, targetCode }
});

trackEvent("translation_run", { sourceLanguage: sourceLabel, targetLanguage: targetLabel });

showToast("Traduction terminée.");

} catch (error) {

// estArret() d'abord : l'étudiant qui a appuyé sur « Arrêter »
// n'a rien raté, lui afficher une erreur serait un contresens.
if (!estArret(error)) {
console.error(error);
showToast(messageErreurFitz(error), { type: "error" });
}

} finally {

translateBtn.disabled = false;
translateBtn.querySelector("span").textContent = "Traduire";
activeController = null;

}

}

translateBtn.addEventListener("click", runTranslation);

copyBtn.addEventListener("click", () => copyToClipboard(lastResult));

downloadBtn.addEventListener("click", () => downloadTextFile(`traduction-${Date.now()}.txt`, lastResult));

renderHistory();

}

bootstrapShell({ feature: "ai_translate", espace: ESPACE_OUTILS }).then((ctx) => {

parcoursTraduction = parcoursDOutil({ espace: ctx.espace });

if (ctx.locked) {

document.getElementById("translateApp").remove();
renderLockedState(document.getElementById("lockedState"), ctx);
return;

}

initTranslateTool();

});
