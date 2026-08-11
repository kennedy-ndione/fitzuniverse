/**
* ============================================================
* ScholarBridge — AI Check (ai-check.js)
* ============================================================
* Vérification de dossier : dépôt de documents avec typage manuel,
* analyse simulée par catégories (js/ai/simulated-responses.js via
* js/ai/ai-client.js), résultat affiché directement sur la page
* (anneau de score, barres par catégorie, points forts/faibles,
* suggestions, checklist croisée avec le profil).
* ============================================================
*/

import { initShellChrome, bootstrapShell, unlockingPlans, PLAN_LABELS } from "./js/app-shell.js";
import { generate } from "./js/ai/ai-client.js";
import { DOCUMENT_TYPES } from "./js/ai/simulated-responses.js";
import { showToast } from "./js/ai/toast.js";
import { trackEvent } from "./js/analytics.js";
import { extractTextFromFile } from "./js/ai/extract-text.js";

initShellChrome();

if (window["pdfjsLib"]) {
window["pdfjsLib"].GlobalWorkerOptions.workerSrc =
"https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
}

function renderLockedState(container, ctx) {

const flags = ctx.featureFlags.ai_check;
const target = unlockingPlans(ctx.planId, flags)[0];

container.innerHTML = `
<div class="ai-locked-hero">
<div class="ai-locked-icon"><i data-lucide="lock"></i></div>
<h2>Vérification du dossier</h2>
<p>Cette fonctionnalité est disponible avec ${target ? `la formule <strong>${PLAN_LABELS[target]}</strong>` : "une formule supérieure"}. Passez à une formule supérieure pour faire vérifier votre dossier par Fitz.</p>
<a href="${target ? `offers.html#${target}` : "offers.html"}" class="btn btn-primary">
<i data-lucide="sparkles"></i>
<span>Choisir ma formule</span>
</a>
</div>
`;

container.hidden = false;

if (window.lucide) lucide.createIcons();

}

function fileIcon(type) {

const icons = {
cv: "file-user",
lettre: "pen-line",
passeport: "book-user",
releve: "graduation-cap",
diplome: "award",
recommandation: "users",
langue: "languages",
financement: "wallet",
autre: "file"
};

return icons[type] || "file";

}

function initCheckTool(ctx) {

const { profile } = ctx;

const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("fileInput");
const fileList = document.getElementById("fileList");
const analyzeBtn = document.getElementById("analyzeBtn");

const resultsPanel = document.getElementById("resultsPanel");
const scoreRing = document.getElementById("scoreRing");
const scoreValue = document.getElementById("scoreValue");
const categoryList = document.getElementById("categoryList");
const strengthsList = document.getElementById("strengthsList");
const weaknessesList = document.getElementById("weaknessesList");
const suggestionsList = document.getElementById("suggestionsList");
const checklist = document.getElementById("checklist");

let entries = [];
let entryCounter = 0;

function addFiles(fileArray) {

fileArray.forEach((file) => {

entries.push({
id: `f${entryCounter++}`,
file,
name: file.name,
size: file.size,
type: ""
});

});

renderFileList();

}

function removeEntry(id) {
entries = entries.filter((e) => e.id !== id);
renderFileList();
}

function renderFileList() {

fileList.innerHTML = "";

entries.forEach((entry) => {

const row = document.createElement("div");
row.className = "ai-file-row";

row.innerHTML = `
<div class="ai-file-row-icon"><i data-lucide="${fileIcon(entry.type)}"></i></div>
<div class="ai-file-row-info">
<strong></strong>
<span></span>
</div>
<select aria-label="Type de document"></select>
<button type="button" class="ai-file-row-remove" aria-label="Retirer"><i data-lucide="x"></i></button>
`;

row.querySelector("strong").textContent = entry.name;
row.querySelector("span").textContent = `${(entry.size / 1024 / 1024).toFixed(2)} Mo`;

const select = row.querySelector("select");
select.add(new Option("Détection automatique", ""));
DOCUMENT_TYPES.forEach((t) => select.add(new Option(t.label, t.key)));
select.value = entry.type;

select.addEventListener("change", () => {
entry.type = select.value;
row.querySelector(".ai-file-row-icon i").setAttribute("data-lucide", fileIcon(entry.type));
if (window.lucide) lucide.createIcons();
});

row.querySelector(".ai-file-row-remove").addEventListener("click", () => removeEntry(entry.id));

fileList.appendChild(row);

});

analyzeBtn.disabled = entries.length === 0;

if (window.lucide) lucide.createIcons();

}

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
if (e.dataTransfer.files.length) addFiles(Array.from(e.dataTransfer.files));
});

fileInput.addEventListener("change", () => {
if (fileInput.files.length) addFiles(Array.from(fileInput.files));
fileInput.value = "";
});

function renderCategories(categories, labels) {

categoryList.innerHTML = "";

Object.entries(categories).forEach(([key, value]) => {

const row = document.createElement("div");
row.className = "ai-category-row";

row.innerHTML = `
<div class="ai-category-row-top"><span>${labels[key]}</span><strong>${value}/100</strong></div>
<div class="ai-category-bar-track"><div class="ai-category-bar-fill" style="width:0%"></div></div>
`;

categoryList.appendChild(row);

requestAnimationFrame(() => {
row.querySelector(".ai-category-bar-fill").style.width = `${value}%`;
});

});

}

function renderList(el, items, emptyText) {

el.innerHTML = "";

if (!items.length) {
el.innerHTML = `<li>${emptyText}</li>`;
return;
}

items.forEach((text) => {
const li = document.createElement("li");
li.textContent = text;
el.appendChild(li);
});

}

function renderChecklist(items) {

checklist.innerHTML = "";

items.forEach((item) => {

const row = document.createElement("div");
row.className = `ai-checklist-item${item.present ? " is-done" : ""}`;
row.innerHTML = `<i data-lucide="${item.present ? "check-circle-2" : "circle"}"></i><span>${item.label}</span>`;

checklist.appendChild(row);

});

if (window.lucide) lucide.createIcons();

}

async function runAnalysis() {

analyzeBtn.disabled = true;
analyzeBtn.querySelector("span").textContent = "Analyse en cours…";

// Extraction de contenu best-effort (PDF uniquement pour l'instant,
// voir js/ai/extract-text.js) — le résultat simulé actuel
// (js/ai/simulated-responses.js) ignore `content`, mais le jour où une
// vraie analyse de contenu sera branchée, elle recevra déjà le texte
// des PDF sans qu'il faille toucher à cette boucle. Une extraction qui
// échoue (Word, image, PDF scanné sans texte) laisse `content`
// undefined plutôt que de bloquer l'analyse — le nom/type déclaré
// reste la donnée minimale garantie.
const files = await Promise.all(entries.map(async (entry) => {

let content;

try {
content = await extractTextFromFile(entry.file);
} catch {
content = undefined;
}

return {
name: entry.name,
size: (entry.size / 1024 / 1024).toFixed(2),
type: entry.type || undefined,
content
};

}));

try {

const { data } = await generate({ task: "check", input: { files, profile } });

scoreRing.style.setProperty("--ai-score", data.overallScore);
scoreValue.textContent = data.overallScore;

renderCategories(data.categories, data.categoryLabels);
renderList(strengthsList, data.strengths, "Vos points forts apparaîtront ici dès qu'un document sera analysé.");
renderList(weaknessesList, data.weaknesses, "Aucun point faible majeur détecté — votre dossier est sur la bonne voie.");
renderList(suggestionsList, data.suggestions, "Pas de suggestion supplémentaire — votre dossier est déjà bien préparé.");
renderChecklist(data.checklist);

resultsPanel.hidden = false;
resultsPanel.scrollIntoView({ behavior: "smooth", block: "start" });

trackEvent("verification_run", { fileCount: files.length });

showToast("Analyse terminée.");

} catch (error) {

console.error(error);
showToast("L'analyse de votre dossier n'a pas abouti cette fois — réessayez, Fitz reste à votre disposition.", { type: "error" });

} finally {

analyzeBtn.disabled = entries.length === 0;
analyzeBtn.querySelector("span").textContent = "Analyser mon dossier";

}

}

analyzeBtn.addEventListener("click", runAnalysis);

}

bootstrapShell({ feature: "ai_check" }).then((ctx) => {

if (ctx.locked) {

document.getElementById("checkApp").remove();
renderLockedState(document.getElementById("lockedState"), ctx);
return;

}

initCheckTool(ctx);

});
