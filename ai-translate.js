/**
* ============================================================
* ScholarBridge — AI Translate (ai-translate.js)
* ============================================================
* Traduction texte/fichier entre 6 langues (js/ai/simulated-responses.js
* fournit le lexique et l'heuristique de détection), inversion des
* langues, historique local des dernières traductions
* (js/ai/chat-store.js).
* ============================================================
*/

import { initShellChrome, bootstrapShell, unlockingPlans, PLAN_LABELS } from "./js/app-shell.js";
import { generate } from "./js/ai/ai-client.js";
import { LANGUAGES, detectLanguage } from "./js/ai/simulated-responses.js";
import { getTranslationHistory, addTranslationHistory, saveGeneratedDocument } from "./js/ai/chat-store.js";
import { showToast, copyToClipboard, downloadTextFile } from "./js/ai/toast.js";
import { trackEvent } from "./js/analytics.js";

initShellChrome();

function renderLockedState(container, ctx) {

const flags = ctx.featureFlags.ai_translate;
const target = unlockingPlans(ctx.planId, flags)[0];

container.innerHTML = `
<div class="ai-locked-hero">
<div class="ai-locked-icon"><i data-lucide="lock"></i></div>
<h2>Traduction de documents</h2>
<p>Cette fonctionnalité est disponible avec ${target ? `la formule <strong>${PLAN_LABELS[target]}</strong>` : "une formule supérieure"}. Passez à une formule supérieure pour traduire vos documents avec Fitz.</p>
<a href="${target ? `offers.html#${target}` : "offers.html"}" class="btn btn-primary">
<i data-lucide="sparkles"></i>
<span>Découvrir nos formules</span>
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

sourceLanguageSelect.value = "fr";
targetLanguageSelect.value = "en";
sourceLanguageSelect.disabled = true;

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

const rawText = mode === "text"
? sourceText.value.trim()
: (selectedFile ? `Aperçu de démonstration pour « ${selectedFile.name} » — l'extraction complète du contenu sera disponible dès que l'IA de traduction sera connectée.` : "");

if (!rawText) {
showToast(mode === "text" ? "Ajoutez un texte à traduire pour continuer." : "Choisissez un document à traduire pour continuer.", { type: "error" });
return;
}

const sourceCode = autoDetect.checked ? detectLanguage(rawText) : sourceLanguageSelect.value;

if (autoDetect.checked) sourceLanguageSelect.value = sourceCode;

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
input: { text: rawText, sourceLanguage: sourceCode, targetLanguage: targetCode },
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

if (error?.name !== "AbortError") {
console.error(error);
showToast("La traduction n'a pas abouti cette fois — réessayez, Fitz reste à votre disposition.", { type: "error" });
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

bootstrapShell({ feature: "ai_translate" }).then((ctx) => {

if (ctx.locked) {

document.getElementById("translateApp").remove();
renderLockedState(document.getElementById("lockedState"), ctx);
return;

}

initTranslateTool();

});
