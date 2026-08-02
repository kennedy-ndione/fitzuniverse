/**
* ============================================================
* ScholarBridge — AI Email (ai-email.js)
* ============================================================
* Générateur d'e-mails : 10 types (js/ai/simulated-responses.js),
* champs dynamiques selon le type choisi, pré-remplissage depuis le
* profil Firestore, génération "streamée" (js/ai/ai-client.js),
* aperçu copiable/modifiable/téléchargeable.
* ============================================================
*/

import { initShellChrome, bootstrapShell, unlockingPlans, PLAN_LABELS } from "./js/app-shell.js";
import { generate } from "./js/ai/ai-client.js";
import { EMAIL_TYPES } from "./js/ai/simulated-responses.js";
import { renderMarkdownLite } from "./js/ai/format.js";
import { saveGeneratedDocument } from "./js/ai/chat-store.js";
import { showToast, copyToClipboard, downloadTextFile } from "./js/ai/toast.js";
import { trackEvent } from "./js/analytics.js";

initShellChrome();

const EXTRA_FIELDS = {
contact_university: [],
reply_university: [{ key: "context", label: "Résumé du message reçu de l'université" }],
request_info: [],
request_deferral: [{ key: "context", label: "Motif du report souhaité" }],
thank_you: [{ key: "context", label: "Ce pour quoi vous remerciez (optionnel)" }],
send_documents: [{ key: "documentsList" }],
follow_up: [],
request_scholarship: [],
contact_professor: [{ key: "contactName" }, { key: "researchTopic" }],
contact_lab: [{ key: "contactName" }, { key: "researchTopic" }]
};

function renderLockedState(container, ctx) {

const flags = ctx.featureFlags.ai_email;
const target = unlockingPlans(ctx.planId, flags)[0];

container.innerHTML = `
<div class="ai-locked-hero">
<div class="ai-locked-icon"><i data-lucide="lock"></i></div>
<h2>E-mails Fitz</h2>
<p>Cette fonctionnalité est disponible avec ${target ? `la formule <strong>${PLAN_LABELS[target]}</strong>` : "une formule supérieure"}. Passez à une formule supérieure pour générer vos e-mails avec Fitz.</p>
<a href="${target ? `offers.html#${target}` : "offers.html"}" class="btn btn-primary">
<i data-lucide="sparkles"></i>
<span>Découvrir nos formules</span>
</a>
</div>
`;

container.hidden = false;

if (window.lucide) lucide.createIcons();

}

function initEmailTool(ctx) {

const { profile } = ctx;

const typeGrid = document.getElementById("emailTypeGrid");
const form = document.getElementById("emailForm");
const generateBtn = document.getElementById("generateEmailBtn");

const fieldFullName = document.getElementById("fieldFullName");
const fieldNationality = document.getElementById("fieldNationality");
const fieldDegree = document.getElementById("fieldDegree");
const fieldUniversity = document.getElementById("fieldUniversity");
const fieldProgram = document.getElementById("fieldProgram");
const fieldCountry = document.getElementById("fieldCountry");

const contactNameWrap = document.getElementById("fieldContactNameWrap");
const researchTopicWrap = document.getElementById("fieldResearchTopicWrap");
const documentsListWrap = document.getElementById("fieldDocumentsListWrap");
const contextWrap = document.getElementById("fieldContextWrap");
const contextLabel = document.getElementById("fieldContextLabel");

const previewContent = document.getElementById("previewContent");
const previewEdit = document.getElementById("previewEdit");
const copyBtn = document.getElementById("copyBtn");
const editBtn = document.getElementById("editBtn");
const regenerateBtn = document.getElementById("regenerateBtn");
const downloadBtn = document.getElementById("downloadBtn");

fieldFullName.value = [profile.firstName, profile.lastName].filter(Boolean).join(" ") || profile.name || "";
fieldNationality.value = profile.country || profile.originCountry || "";
fieldDegree.value = profile.lastDegree || profile.currentDegree || "";
fieldCountry.value = (Array.isArray(profile.preferredCountries) && profile.preferredCountries[0]) || "";

let selectedType = null;
let currentText = "";
let isEditing = false;
let activeController = null;

EMAIL_TYPES.forEach((type) => {

const card = document.createElement("button");
card.type = "button";
card.className = "ai-style-card";
card.dataset.type = type.key;

card.innerHTML = `
<span class="ai-style-card-icon"><i data-lucide="${type.icon}"></i></span>
<strong>${type.label}</strong>
`;

card.addEventListener("click", () => selectType(type.key));

typeGrid.appendChild(card);

});

if (window.lucide) lucide.createIcons();

function selectType(key) {

selectedType = key;

typeGrid.querySelectorAll(".ai-style-card").forEach((card) => {
card.classList.toggle("is-selected", card.dataset.type === key);
});

const extras = EXTRA_FIELDS[key] || [];
const hasContext = extras.some((f) => f.key === "context");

contactNameWrap.hidden = !extras.some((f) => f.key === "contactName");
researchTopicWrap.hidden = !extras.some((f) => f.key === "researchTopic");
documentsListWrap.hidden = !extras.some((f) => f.key === "documentsList");
contextWrap.hidden = !hasContext;

if (hasContext) {
contextLabel.textContent = extras.find((f) => f.key === "context").label;
}

generateBtn.disabled = false;
generateBtn.querySelector("span").textContent = "Générer mon e-mail";

}

function setPreviewText(text) {

currentText = text;

if (isEditing) {
previewEdit.value = text;
} else {
previewContent.innerHTML = text
? renderMarkdownLite(text)
: `<div class="ai-preview-empty"><i data-lucide="mail"></i><span>Votre e-mail apparaîtra ici, prêt à copier ou à modifier.</span></div>`;
if (window.lucide) lucide.createIcons();
}

}

function setToolbarEnabled(enabled) {
copyBtn.disabled = !enabled;
editBtn.disabled = !enabled;
regenerateBtn.disabled = !enabled;
downloadBtn.disabled = !enabled;
}

function collectData() {

return {
emailType: selectedType,
fullName: fieldFullName.value.trim(),
nationality: fieldNationality.value.trim(),
degree: fieldDegree.value.trim(),
university: fieldUniversity.value.trim(),
program: fieldProgram.value.trim(),
country: fieldCountry.value.trim(),
contactName: document.getElementById("fieldContactName").value.trim(),
researchTopic: document.getElementById("fieldResearchTopic").value.trim(),
documentsList: document.getElementById("fieldDocumentsList").value.trim(),
context: document.getElementById("fieldContext").value.trim(),
profile
};

}

async function generateEmail() {

if (!selectedType) return;

const data = collectData();

generateBtn.disabled = true;
generateBtn.querySelector("span").textContent = "Génération en cours…";
setToolbarEnabled(false);
setPreviewText("");

activeController = new AbortController();

try {

const { text } = await generate({
task: "email",
input: data,
signal: activeController.signal,
onToken: (partial) => setPreviewText(partial)
});

setPreviewText(text);
setToolbarEnabled(true);

saveGeneratedDocument({
icon: "mail",
title: `E-mail — ${EMAIL_TYPES.find((t) => t.key === selectedType)?.label || "Candidature"}`,
type: "IA",
date: new Date().toLocaleDateString("fr-FR"),
content: text,
meta: { tool: "ai-email", emailType: selectedType }
});

trackEvent("email_generated", { country: data.country, emailType: selectedType });

showToast("E-mail généré avec succès.");

} catch (error) {

if (error?.name !== "AbortError") {
console.error(error);
showToast("La génération de votre e-mail n'a pas abouti cette fois — réessayez, Fitz reste à votre disposition.", { type: "error" });
}

} finally {

generateBtn.disabled = false;
generateBtn.querySelector("span").textContent = "Régénérer cet e-mail";
activeController = null;

}

}

form.addEventListener("submit", (event) => {
event.preventDefault();
generateEmail();
});

copyBtn.addEventListener("click", () => copyToClipboard(isEditing ? previewEdit.value : currentText));

downloadBtn.addEventListener("click", () => downloadTextFile(`email-scholarbridge-${Date.now()}.txt`, isEditing ? previewEdit.value : currentText));

regenerateBtn.addEventListener("click", () => generateEmail());

editBtn.addEventListener("click", () => {

isEditing = !isEditing;

if (isEditing) {

previewEdit.value = currentText;
previewEdit.hidden = false;
previewContent.hidden = true;
editBtn.innerHTML = `<i data-lucide="check"></i>Terminer`;

} else {

currentText = previewEdit.value;
setPreviewText(currentText);
previewEdit.hidden = true;
previewContent.hidden = false;
editBtn.innerHTML = `<i data-lucide="pencil"></i>Modifier`;

}

if (window.lucide) lucide.createIcons();

});

}

bootstrapShell({ feature: "ai_email" }).then((ctx) => {

if (ctx.locked) {

document.getElementById("emailApp").remove();
renderLockedState(document.getElementById("lockedState"), ctx);
return;

}

initEmailTool(ctx);

});
