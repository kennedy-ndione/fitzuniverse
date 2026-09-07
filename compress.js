import { initShellChrome, bootstrapShell, unlockingPlans, PLAN_LABELS } from "./js/app-shell.js";
import { FITZ_UNLOCK_CTA, unlockPlanPhrase } from "./js/fitz-voice.js";
import { trackEvent } from "./js/analytics.js";
import { compressImageToTarget } from "./js/compression-image.js";

initShellChrome();

if (window["pdfjsLib"]) {
window["pdfjsLib"].GlobalWorkerOptions.workerSrc =
"https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
}

function renderLockedState(container, ctx) {

const flags = ctx.featureFlags.compress;
const target = unlockingPlans(ctx.planId, flags)[0];

container.innerHTML = `
<div class="ai-locked-hero">
<div class="ai-locked-icon"><i data-lucide="lock"></i></div>
<h2>Compression de fichiers</h2>
<p>Cette fonctionnalité est disponible avec ${unlockPlanPhrase(target ? PLAN_LABELS[target] : null)}. Passez à une formule supérieure pour compresser vos documents avant de candidater.</p>
<a href="${target ? `offers.html#${target}` : "offers.html"}" class="btn btn-primary">
<span>${FITZ_UNLOCK_CTA}</span>
</a>
</div>
`;

container.hidden = false;

if (window.lucide) lucide.createIcons();

}

function formatBytes(bytes) {

if (bytes < 1024) return `${bytes} o`;
if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
return `${(bytes / (1024 * 1024)).toFixed(2)} Mo`;

}

function targetBytesFromInputs(value, unit) {

const n = parseFloat(value) || 0;
return unit === "MB" ? n * 1024 * 1024 : n * 1024;

}

// ==========================================================
// Compression d'image — réduction itérative de la qualité JPEG,
// puis des dimensions si la qualité seule ne suffit pas.
// ==========================================================

// Compression d'image : extraite dans js/compression-image.js (lot E1,
// 2026-09-07) — la capture d'une preuve de dépôt (applications.js)
// passe par la même implémentation. Rien ne change ici.

// ==========================================================
// Compression de PDF — chaque page est rendue en image (pdf.js) puis
// réassemblée dans un nouveau PDF (jsPDF) à une qualité JPEG réduite
// de façon itérative jusqu'à la taille visée.
// ==========================================================

async function renderPdfAtQuality(pdf, scale, quality, onProgress) {

const { jsPDF } = window.jspdf;
let doc = null;

for (let i = 1; i <= pdf.numPages; i++) {

onProgress(`Traitement de la page ${i}/${pdf.numPages}...`);

const page = await pdf.getPage(i);
const viewport = page.getViewport({ scale });

const canvas = document.createElement("canvas");
canvas.width = viewport.width;
canvas.height = viewport.height;

const ctx = canvas.getContext("2d");
await page.render({ canvasContext: ctx, viewport }).promise;

const imgData = canvas.toDataURL("image/jpeg", quality);
const orientation = viewport.width > viewport.height ? "l" : "p";

if (!doc) {
doc = new jsPDF({ orientation, unit: "px", format: [viewport.width, viewport.height] });
} else {
doc.addPage([viewport.width, viewport.height], orientation);
}

doc.addImage(imgData, "JPEG", 0, 0, viewport.width, viewport.height);

}

return doc.output("blob");

}

async function compressPdfToTarget(file, targetBytes, onProgress) {

const arrayBuffer = await file.arrayBuffer();
const pdf = await window["pdfjsLib"].getDocument({ data: arrayBuffer }).promise;

let quality = 0.7;
let scale = 1.4;
let blob = null;

const maxAttempts = 5;

for (let attempt = 0; attempt <= maxAttempts; attempt++) {

blob = await renderPdfAtQuality(pdf, scale, quality, onProgress);

if (blob.size <= targetBytes || attempt === maxAttempts) break;

if (quality > 0.3) {
quality -= 0.15;
} else {
scale *= 0.8;
}

onProgress(`Fitz optimise encore un peu plus (tentative ${attempt + 1}/${maxAttempts})...`);

}

return blob;

}

// ==========================================================
// Page
// ==========================================================

function initCompressPage() {

const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("fileInput");
const fileInfo = document.getElementById("fileInfo");
const fileNameEl = document.getElementById("fileName");
const fileSizeEl = document.getElementById("fileSize");
const fileRemove = document.getElementById("fileRemove");
const targetSize = document.getElementById("targetSize");
const targetUnit = document.getElementById("targetUnit");
const runBtn = document.getElementById("runBtn");
const pdfNote = document.getElementById("pdfNote");
const progressPanel = document.getElementById("progressPanel");
const progressText = document.getElementById("progressText");
const resultPanel = document.getElementById("resultPanel");
const statOriginal = document.getElementById("statOriginal");
const statFinal = document.getElementById("statFinal");
const resultMessage = document.getElementById("resultMessage");
const downloadBtn = document.getElementById("downloadBtn");

let currentFile = null;

function selectFile(file) {

if (!file) return;

const isPdf = file.type === "application/pdf";
const isImage = file.type === "image/jpeg" || file.type === "image/png";

if (!isPdf && !isImage) {
alert("Fitz peut compresser vos fichiers PDF, JPG et PNG — choisissez l'un de ces formats pour continuer.");
return;
}

currentFile = file;

fileNameEl.textContent = file.name;
fileSizeEl.textContent = formatBytes(file.size);
fileInfo.hidden = false;
dropzone.hidden = true;
pdfNote.hidden = !isPdf;
runBtn.disabled = false;

resultPanel.hidden = true;

}

function resetFile() {

currentFile = null;
fileInput.value = "";
fileInfo.hidden = true;
dropzone.hidden = false;
pdfNote.hidden = true;
runBtn.disabled = true;
resultPanel.hidden = true;

}

dropzone.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", () => selectFile(fileInput.files[0]));

fileRemove.addEventListener("click", resetFile);

["dragover", "dragenter"].forEach((evt) => {
dropzone.addEventListener(evt, (event) => {
event.preventDefault();
dropzone.classList.add("is-dragover");
});
});

["dragleave", "drop"].forEach((evt) => {
dropzone.addEventListener(evt, (event) => {
event.preventDefault();
dropzone.classList.remove("is-dragover");
});
});

dropzone.addEventListener("drop", (event) => {
const file = event.dataTransfer.files[0];
selectFile(file);
});

runBtn.addEventListener("click", async () => {

if (!currentFile) return;

const targetBytes = targetBytesFromInputs(targetSize.value, targetUnit.value);

if (!targetBytes || targetBytes < 5 * 1024) {
alert("Choisissez une taille cible d'au moins quelques dizaines de Ko pour un résultat optimal.");
return;
}

runBtn.disabled = true;
progressPanel.hidden = false;
resultPanel.hidden = true;
progressText.textContent = "Préparation...";

const onProgress = (text) => { progressText.textContent = text; };

try {

const isPdf = currentFile.type === "application/pdf";

const blob = isPdf
? await compressPdfToTarget(currentFile, targetBytes, onProgress)
: await compressImageToTarget(currentFile, targetBytes, onProgress);

const url = URL.createObjectURL(blob);
const extension = isPdf ? ".pdf" : ".jpg";
const baseName = currentFile.name.replace(/\.[^.]+$/, "");

downloadBtn.href = url;
downloadBtn.download = `${baseName}-compresse${extension}`;

statOriginal.textContent = formatBytes(currentFile.size);
statFinal.textContent = formatBytes(blob.size);

resultMessage.textContent = blob.size <= targetBytes
? "Votre fichier respecte parfaitement la taille demandée."
: "Fitz a réduit ce fichier au maximum tout en conservant un rendu net et lisible — c'est la meilleure taille possible pour ce document sans compromettre sa qualité.";

trackEvent("file_compressed", {
type: isPdf ? "pdf" : "image",
originalSize: currentFile.size,
finalSize: blob.size
});

progressPanel.hidden = true;
resultPanel.hidden = false;

} catch (error) {

console.error("Erreur de compression :", error);
progressPanel.hidden = true;
alert("La compression n'a pas pu aboutir pour ce fichier. Vérifiez qu'il s'ouvre correctement, puis réessayez — Fitz reste à votre disposition.");

} finally {

runBtn.disabled = false;

}

});

}

bootstrapShell({ feature: "compress" }).then((ctx) => {

if (ctx.locked) {

document.getElementById("compressApp").remove();
renderLockedState(document.getElementById("lockedState"), ctx);
return;

}

initCompressPage();

});
