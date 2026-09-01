/**
* ============================================================
* FitzUniverse — AI Letter (ai-letter.js)
* ============================================================
* Générateur de lettre de motivation : 5 styles
* (js/ai/simulated-responses.js), pré-remplissage depuis le profil
* Firestore, génération "streamée" (js/ai/ai-client.js), aperçu
* copiable/modifiable, export .txt et PDF réel (jsPDF, même pattern
* que documents.js).
* ============================================================
*/

import { db } from "./firebase-config.js";
import { doc, getDoc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { initShellChrome, bootstrapShell, unlockingPlans, PLAN_LABELS } from "./js/app-shell.js";
import { FITZ_UNLOCK_CTA, unlockPlanPhrase } from "./js/fitz-voice.js";
import { generate, messageErreurFitz, estArret } from "./js/ai/ai-client.js";
import { LETTER_STYLES } from "./js/ai/simulated-responses.js";
import { renderMarkdownLite, wordCount } from "./js/ai/format.js";
import { saveGeneratedDocument } from "./js/ai/chat-store.js";
import { showToast, copyToClipboard, downloadTextFile } from "./js/ai/toast.js";
import { trackEvent } from "./js/analytics.js";
import { calculateAiScore, PROFILE_READY_THRESHOLD } from "./js/profile-score.js";

// Contexte candidature (Phase 3, 2026-07-30) : si la page est ouverte
// depuis applications.html (?applicationId=...), la lettre générée est
// automatiquement rattachée à CETTE candidature — université pré-remplie,
// résultat enregistré sur le document de la candidature en plus du
// stockage local existant (documents.html continue de fonctionner sans
// changement). Reste le patron de référence : le même principe s'applique
// à ai-email.js/ai-check.js/ai-translate.js, pas encore répliqué dessus.
const applicationId = new URLSearchParams(window.location.search).get("applicationId");

initShellChrome();

const STYLE_ICONS = {
academique: "landmark",
professionnel: "briefcase",
recherche: "flask-conical",
excellence: "trophy",
personnalise: "heart"
};

function renderLockedState(container, ctx) {

const flags = ctx.featureFlags.ai_letter;
const target = unlockingPlans(ctx.planId, flags)[0];

container.innerHTML = `
<div class="ai-locked-hero">
<div class="ai-locked-icon"><i data-lucide="lock"></i></div>
<h2>Lettre de motivation</h2>
<p>Cette fonctionnalité est disponible avec ${unlockPlanPhrase(target ? PLAN_LABELS[target] : null)}. Passez à une formule supérieure pour générer votre lettre avec Fitz.</p>
<a href="${target ? `offers.html#${target}` : "offers.html"}" class="btn btn-primary">
<span>${FITZ_UNLOCK_CTA}</span>
</a>
</div>
`;

container.hidden = false;

if (window.lucide) lucide.createIcons();

}

function describedExperiences(profile) {

return [profile.projects, profile.researchExperience, profile.internships, profile.workExperience, profile.associations, profile.volunteering, profile.entrepreneurship]
.filter(Boolean)
.slice(0, 3)
.join(". ");

}

// Le même avertissement que le parcours, posé là où il compte : au
// moment où l'étudiant s'apprête à générer. Il n'empêche rien — le
// formulaire reste utilisable, le bouton reste actif. Il dit ce que
// l'étudiant obtiendrait, et laisse la décision là où elle doit être.
function renderPrerequisNotice(profile) {

const bloc = document.getElementById("prerequisNotice");

if (!bloc) return;

const score = calculateAiScore(profile);

if (score >= PROFILE_READY_THRESHOLD) {
bloc.hidden = true;
return;
}

bloc.querySelector("span").textContent =
`Votre profil est à ${score}/10. Fitz y puise la matière de votre lettre : avec un profil incomplet, elle restera générique — et une lettre générique est ce qui écarte une candidature. Vous pouvez continuer, mais la compléter d'abord change tout.`;

bloc.hidden = false;

}

async function initLetterTool(ctx) {

const { profile } = ctx;

renderPrerequisNotice(profile);

let application = null;

if (applicationId) {

try {

const snap = await getDoc(doc(db, "users", ctx.user.uid, "applications", applicationId));
if (snap.exists()) application = { id: snap.id, ...snap.data() };

} catch (error) {

console.error("Impossible de charger la candidature liée :", error);

}

}

const contextBanner = document.getElementById("applicationContext");
const contextBackLink = document.getElementById("applicationContextBackLink");

if (application && contextBanner) {

contextBanner.hidden = false;
contextBanner.querySelector("span").textContent =
`Cette lettre sera enregistrée dans le suivi de "${application.university}".`;

if (contextBackLink) {
contextBackLink.href = `applications.html#${application.id}`;
contextBackLink.hidden = false;
}

}

const styleGrid = document.getElementById("styleGrid");
const form = document.getElementById("letterForm");
const generateBtn = document.getElementById("generateLetterBtn");

const fieldCountry = document.getElementById("fieldCountry");
const fieldUniversity = document.getElementById("fieldUniversity");
const fieldProgram = document.getElementById("fieldProgram");
const fieldLevel = document.getElementById("fieldLevel");
const fieldExperiences = document.getElementById("fieldExperiences");
const fieldSkills = document.getElementById("fieldSkills");
const fieldMotivations = document.getElementById("fieldMotivations");
const fieldGoals = document.getElementById("fieldGoals");

const previewContent = document.getElementById("previewContent");
const previewEdit = document.getElementById("previewEdit");
const previewMeta = document.getElementById("previewMeta");
const wordCountEl = document.getElementById("wordCount");

const copyBtn = document.getElementById("copyBtn");
const editBtn = document.getElementById("editBtn");
const regenerateBtn = document.getElementById("regenerateBtn");
const downloadTxtBtn = document.getElementById("downloadTxtBtn");
const downloadPdfBtn = document.getElementById("downloadPdfBtn");

fieldCountry.value = (Array.isArray(profile.preferredCountries) && profile.preferredCountries[0]) || "";
fieldProgram.value = profile.desiredField || "";
if (profile.desiredDegree) fieldLevel.value = profile.desiredDegree;
fieldExperiences.value = describedExperiences(profile);
fieldMotivations.value = profile.whyLeave || "";
fieldGoals.value = profile.careerGoals || profile.dreams || "";

if (application) {
fieldUniversity.value = application.university || "";
if (application.scholarship) fieldMotivations.value = fieldMotivations.value || `Candidature à la bourse ${application.scholarship}.`;
}

let selectedStyle = "personnalise";
let currentText = "";
let isEditing = false;
let activeController = null;

Object.entries(LETTER_STYLES).forEach(([key, meta]) => {

const card = document.createElement("button");
card.type = "button";
card.className = `ai-style-card${key === selectedStyle ? " is-selected" : ""}`;
card.dataset.style = key;

card.innerHTML = `
<span class="ai-style-card-icon"><i data-lucide="${STYLE_ICONS[key] || "pen-line"}"></i></span>
<strong>${meta.label}</strong>
<span>${meta.description}</span>
`;

card.addEventListener("click", () => {
selectedStyle = key;
styleGrid.querySelectorAll(".ai-style-card").forEach((c) => c.classList.toggle("is-selected", c.dataset.style === key));
});

styleGrid.appendChild(card);

});

if (window.lucide) lucide.createIcons();

function setPreviewText(text) {

currentText = text;

if (isEditing) {
previewEdit.value = text;
} else {
previewContent.innerHTML = text
? renderMarkdownLite(text)
: `<div class="ai-preview-empty"><i data-lucide="pen-line"></i><span>Votre lettre de motivation apparaîtra ici.</span></div>`;
if (window.lucide) lucide.createIcons();
}

previewMeta.hidden = !text;
wordCountEl.textContent = `${wordCount(text)} mots`;

}

function setToolbarEnabled(enabled) {
copyBtn.disabled = !enabled;
editBtn.disabled = !enabled;
regenerateBtn.disabled = !enabled;
downloadTxtBtn.disabled = !enabled;
downloadPdfBtn.disabled = !enabled;
}

function collectData() {

return {
style: selectedStyle,
country: fieldCountry.value.trim(),
university: fieldUniversity.value.trim(),
program: fieldProgram.value.trim(),
level: fieldLevel.value,
experiences: fieldExperiences.value.trim(),
skills: fieldSkills.value.trim(),
motivations: fieldMotivations.value.trim(),
goals: fieldGoals.value.trim(),
profile
};

}

async function generateLetter() {

const data = collectData();

generateBtn.disabled = true;
generateBtn.querySelector("span").textContent = "Génération en cours…";
setToolbarEnabled(false);
setPreviewText("");

activeController = new AbortController();

try {

const { text } = await generate({
task: "letter",
input: data,
signal: activeController.signal,
onToken: (partial) => setPreviewText(partial)
});

setPreviewText(text);
setToolbarEnabled(true);

saveGeneratedDocument({
icon: "pen-line",
title: `Lettre de motivation (${LETTER_STYLES[selectedStyle]?.label || selectedStyle})`,
type: "IA",
date: new Date().toLocaleDateString("fr-FR"),
content: text,
meta: { tool: "ai-letter", style: selectedStyle }
});

if (application) {

try {

await updateDoc(doc(db, "users", ctx.user.uid, "applications", application.id), {
generatedLetter: {
content: text,
style: selectedStyle,
generatedAt: serverTimestamp()
}
});

} catch (error) {

console.error("Impossible d'enregistrer la lettre sur la candidature :", error);

}

}

trackEvent("letter_generated", { country: data.country });

showToast(application ? `Lettre générée et enregistrée dans "${application.university}".` : "Lettre générée avec succès.");

} catch (error) {

// estArret() d'abord : l'étudiant qui a appuyé sur « Arrêter »
// n'a rien raté, lui afficher une erreur serait un contresens.
if (!estArret(error)) {
console.error(error);
showToast(messageErreurFitz(error), { type: "error" });
}

} finally {

generateBtn.disabled = false;
generateBtn.querySelector("span").textContent = "Régénérer ma lettre";
activeController = null;

}

}

form.addEventListener("submit", (event) => {
event.preventDefault();
generateLetter();
});

copyBtn.addEventListener("click", () => copyToClipboard(isEditing ? previewEdit.value : currentText));

downloadTxtBtn.addEventListener("click", () => downloadTextFile(`lettre-motivation-${Date.now()}.txt`, isEditing ? previewEdit.value : currentText));

downloadPdfBtn.addEventListener("click", () => {

const text = isEditing ? previewEdit.value : currentText;
if (!text || !window.jspdf) return;

const { jsPDF } = window.jspdf;
const pdf = new jsPDF();

pdf.setFont("helvetica", "bold");
pdf.setFontSize(16);
pdf.text("Lettre de motivation", 20, 20);

pdf.setFont("helvetica", "normal");
pdf.setFontSize(12);

const lines = pdf.splitTextToSize(text, 170);
pdf.text(lines, 20, 35);

pdf.save(`lettre-motivation-${Date.now()}.pdf`);

showToast("Lettre téléchargée en PDF.");

});

regenerateBtn.addEventListener("click", () => generateLetter());

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

bootstrapShell({ feature: "ai_letter" }).then(async (ctx) => {

if (ctx.locked) {

document.getElementById("letterApp").remove();
renderLockedState(document.getElementById("lockedState"), ctx);
return;

}

await initLetterTool(ctx);

});
