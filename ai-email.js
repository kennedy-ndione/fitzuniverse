/**
* ============================================================
* FitzUniverse — AI Email (ai-email.js)
* ============================================================
* Générateur d'e-mails : 10 types (js/ai/simulated-responses.js),
* champs dynamiques selon le type choisi, pré-remplissage depuis le
* profil Firestore, génération "streamée" (js/ai/ai-client.js),
* aperçu copiable/modifiable/téléchargeable.
* ============================================================
*/

import { db } from "./firebase-config.js";
import { doc, getDoc, updateDoc, serverTimestamp, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { initShellChrome, bootstrapShell, unlockingPlans, PLAN_LABELS, ESPACE_OUTILS } from "./js/app-shell.js";
import { FITZ_UNLOCK_CTA, unlockPlanPhrase } from "./js/fitz-voice.js";
import { generate, messageErreurFitz, estArret } from "./js/ai/ai-client.js";
import { EMAIL_TYPES, typesEmailPour } from "./js/ai/simulated-responses.js";
// Lot PRÉ-FITZ : le parcours filtre les types (« Demander une bourse »
// n'a pas de sens en préinscription) et voyage avec la demande.
import { parcoursDOutil, titreDuVoeu, paysDuVoeu, PAYS_PREINSCRIPTION } from "./js/parcours.js";
// Lot ACCEPTATION (2026-09-11) : l'e-mail exige, en bourses, une
// candidature ACCEPTÉE — plus de mode libre pour une bourse.
import { candidaturesPourOutils } from "./js/fitz-choisit.js";
import { blocageOutil, afficherBlocage } from "./js/outil-acceptation.js";
import { renderMarkdownLite } from "./js/ai/format.js";
import { saveGeneratedDocument } from "./js/ai/chat-store.js";
import { showToast, copyToClipboard, downloadTextFile } from "./js/ai/toast.js";
import { trackEvent } from "./js/analytics.js";
import { calculateAiScore, PROFILE_READY_THRESHOLD } from "./js/profile-score.js";

// Contexte candidature — même patron que ai-letter.js (voir la note
// dans ce fichier) : première réplication du lien vers une candidature
// précise en dehors de la lettre de motivation. ai-check.js reste à
// faire.
const applicationId = new URLSearchParams(window.location.search).get("applicationId");

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
<p>Cette fonctionnalité est disponible avec ${unlockPlanPhrase(target ? PLAN_LABELS[target] : null)}. Passez à une formule supérieure pour générer vos e-mails avec Fitz.</p>
<a href="${target ? `offers.html#${target}` : "offers.html"}" class="btn btn-primary">
<span>${FITZ_UNLOCK_CTA}</span>
</a>
</div>
`;

container.hidden = false;

if (window.lucide) lucide.createIcons();

}

// Voir ai-letter.js : même avertissement, même principe — on informe,
// on n'empêche pas. Un e-mail écrit depuis un profil vide est poli et
// creux, et c'est le genre de message qui reste sans réponse.
function renderPrerequisNotice(profile) {

const bloc = document.getElementById("prerequisNotice");

if (!bloc) return;

const score = calculateAiScore(profile);

if (score >= PROFILE_READY_THRESHOLD) {
bloc.hidden = true;
return;
}

bloc.querySelector("span").textContent =
`Votre profil est à ${score}/10. Fitz s'appuie dessus pour donner à votre e-mail de quoi vous distinguer : avec un profil incomplet, il restera poli mais interchangeable. Vous pouvez continuer, mais le compléter d'abord change tout.`;

bloc.hidden = false;

}

async function initEmailTool(ctx) {

const { profile } = ctx;

renderPrerequisNotice(profile);

// ==========================================================
// REFONTE 2026-09-02 — le contexte appartient à Fitz. L'étudiant ne
// re-saisit plus son identité ni sa cible : le profil remplit qui il
// est, ses candidatures SUIVIES remplissent à qui il écrit (sélecteur
// « Candidature concernée »). Les anciens champs restent dans le
// formulaire, repliés sous « Ajuster » — même contrat de génération
// (collectData), l'étudiant garde toujours le dernier mot.
// ==========================================================

// Toutes les candidatures suivies — une seule lecture, la collection
// est petite (bornée par le quota de la formule).
let trackedApplications = [];

try {

const appsSnap = await getDocs(collection(db, "users", ctx.user.uid, "applications"));
trackedApplications = appsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

} catch (error) {

console.error("Impossible de charger les candidatures suivies :", error);

}

let application = applicationId
? trackedApplications.find((a) => a.id === applicationId) || null
: null;

// Repli : l'applicationId de l'URL n'était pas dans la liste (lien
// ancien, document supprimé entre-temps) — on tente la lecture directe
// comme avant la refonte, sans bloquer l'outil si elle échoue.
if (applicationId && !application) {

try {

const snap = await getDoc(doc(db, "users", ctx.user.uid, "applications", applicationId));
if (snap.exists()) {
application = { id: snap.id, ...snap.data() };
trackedApplications.push(application);
}

} catch (error) {

console.error("Impossible de charger la candidature liée :", error);

}

}

const contextBanner = document.getElementById("applicationContext");

function syncContextBanner() {

if (!contextBanner) return;

if (application) {
contextBanner.hidden = false;
contextBanner.querySelector("span").textContent =
`Cet e-mail sera enregistré dans le suivi de "${application.university}".`;
} else {
contextBanner.hidden = true;
}

}

syncContextBanner();

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

const fieldApplication = document.getElementById("fieldApplication");
const contextChips = document.getElementById("contextChips");
const contextDetails = document.getElementById("contextDetails");
const contextAdjustBtn = document.getElementById("contextAdjustBtn");

fieldFullName.value = [profile.firstName, profile.lastName].filter(Boolean).join(" ") || profile.name || "";
fieldNationality.value = profile.nationality || profile.country || profile.originCountry || "";
fieldDegree.value = profile.lastDegree || profile.currentDegree || "";
fieldCountry.value = (Array.isArray(profile.preferredCountries) && profile.preferredCountries[0]) || "";
// SANS CANDIDATURE, C'EST L'ESPACE QUI DIT LA DESTINATION (2026-09-17).
// `preferredCountries` est une préférence de parcours BOURSES : elle n'a
// rien à dire sur une préinscription, où la destination est celle de la
// route. Vu en ligne à l'étape 13, dont le lien vers cet outil ne porte
// aucun vœu : la page s'ouvrait sur « Pays visé : Chine ».
// L'ordre compte — le vœu, quand il y en a un, repasse après et gagne
// (`applyApplicationContext` → `paysDuVoeu`).
if (parcoursDOutil({ espace: ctx.espace }) === "preinscription") fieldCountry.value = PAYS_PREINSCRIPTION;

// La cible (université, programme/bourse, pays) vient de la
// candidature sélectionnée — c'est elle qui sait à qui l'on écrit.
// Lot ACCEPTATION : la ligne de blocage, avant le formulaire.
function syncBlocage() {
afficherBlocage(form, blocageOutil({ espace: ctx.espace, application }));
}

function applyApplicationContext(app) {

application = app || null;

if (app) {
fieldUniversity.value = app.university || "";
fieldProgram.value = titreDuVoeu(app) || fieldProgram.value || "";
// LA CANDIDATURE GAGNE CONTRE LE PROFIL (lot R4, 2026-09-17) — même
// défaut que dans ai-letter.js : « Pays visé » gardait le premier pays
// souhaité du profil alors que le vœu sélectionné visait la France.
const pays = paysDuVoeu(app);
if (pays) fieldCountry.value = pays;
}

verrouillerUniversite(app);

syncContextBanner();
renderContextChips();
syncBlocage();

}

// Lot ACCEPTATION : pour une candidature bourse, l'université
// destinataire est VERROUILLÉE sur celle de la candidature — au
// chargement (?applicationId=) comme au changement de sélecteur.
function verrouillerUniversite(app) {
const verrou = !!app && parcoursDOutil({ application: app }) === "bourse";
fieldUniversity.readOnly = verrou;
fieldUniversity.setAttribute("aria-readonly", verrou ? "true" : "false");
}

// Sélecteur des candidatures suivies. Tri : les dossiers encore en
// jeu d'abord (ordre de STATUS pertinent inutile ici — alphabétique
// suffit et reste stable).
// Lot ACCEPTATION : le sélecteur ne propose que les candidatures
// bourses ACCEPTÉES, plus les préinscriptions et les cartes sans
// programId (js/fitz-choisit.js : candidaturesPourOutils).
// ET SEULEMENT CELLES DU PARCOURS OÙ L'ON EST (2026-09-17) : vu en
// ligne, un outil ouvert depuis la route proposait deux bourses.
// js/fitz-choisit.js documente la règle ; l'identifiant de l'URL est
// gardé quoi qu'il arrive, un lien ancien reste sélectionnable.
candidaturesPourOutils(trackedApplications, parcoursDOutil({ espace: ctx.espace }), applicationId || "")
.slice()
.sort((a, b) => String(a.university || "").localeCompare(String(b.university || ""), "fr"))
.forEach((app) => {

const option = document.createElement("option");
option.value = app.id;
const titre = titreDuVoeu(app);
option.textContent = titre ? `${app.university} — ${titre}` : (app.university || "Candidature sans nom");
fieldApplication.appendChild(option);

});

if (application) fieldApplication.value = application.id;

fieldApplication.addEventListener("change", () => {
const app = trackedApplications.find((a) => a.id === fieldApplication.value) || null;
applyApplicationContext(app);
});

syncBlocage();

// Pastilles « Ce que Fitz sait déjà » — le miroir exact de ce que
// collectData() enverra. Une valeur manquante s'affiche « À
// compléter » et ouvre les champs d'ajustement au clic.
const CHIP_DEFS = [
{ label: "Nom complet", input: fieldFullName },
{ label: "Nationalité", input: fieldNationality },
{ label: "Diplôme actuel", input: fieldDegree },
{ label: "Université destinataire", input: fieldUniversity },
{ label: "Programme / bourse", input: fieldProgram },
{ label: "Pays", input: fieldCountry }
];

function renderContextChips() {

contextChips.innerHTML = "";

CHIP_DEFS.forEach(({ label, input }) => {

const value = input.value.trim();

const chip = document.createElement("div");
chip.className = "ai-context-chip" + (value ? "" : " is-missing");

const dt = document.createElement("dt");
dt.textContent = label;

const dd = document.createElement("dd");
dd.textContent = value || "À compléter";

chip.appendChild(dt);
chip.appendChild(dd);

if (!value) {
chip.setAttribute("role", "button");
chip.tabIndex = 0;
chip.title = "Ouvrir les champs pour compléter";
chip.addEventListener("click", () => openContextDetails(input));
chip.addEventListener("keydown", (e) => {
if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openContextDetails(input); }
});
}

contextChips.appendChild(chip);

});

}

function openContextDetails(focusInput) {

contextDetails.hidden = false;
contextAdjustBtn.setAttribute("aria-expanded", "true");
contextAdjustBtn.textContent = "Réduire";

if (focusInput) focusInput.focus();

}

contextAdjustBtn.addEventListener("click", () => {

const willOpen = contextDetails.hidden;

if (willOpen) {
openContextDetails(null);
} else {
contextDetails.hidden = true;
contextAdjustBtn.setAttribute("aria-expanded", "false");
contextAdjustBtn.textContent = "Ajuster";
}

});

// Toute retouche manuelle se reflète immédiatement dans les pastilles.
CHIP_DEFS.forEach(({ input }) => input.addEventListener("input", renderContextChips));

// UN SEUL ENDROIT APPLIQUE LE CONTEXTE (lot R5, 2026-09-17) — même
// défaut que dans ai-letter.js, qui le documente en long : un bloc écrit
// à la main ici, incomplet, sur le chemin même que la route emprunte
// (`?applicationId=`). Il posait l'université et laissait « Pays visé »
// au premier pays souhaité du profil. Rien à corriger : il n'y a plus
// qu'une fonction, et elle sert les deux chemins.
if (application) applyApplicationContext(application);

renderContextChips();

let selectedType = null;
let currentText = "";
let isEditing = false;
let activeController = null;

function parcoursCourant() {
return parcoursDOutil({ espace: ctx.espace, application });
}

// Les types d'e-mail sont ceux du PARCOURS : la grille se (re)construit
// quand la candidature liée change de parcours.
function renderTypeGrid() {

typeGrid.innerHTML = "";
const types = typesEmailPour(parcoursCourant());
if (selectedType && !types.some((t) => t.key === selectedType)) selectedType = types[0] ? types[0].key : "";

types.forEach((type) => {

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

}

renderTypeGrid();

fieldApplication.addEventListener("change", renderTypeGrid);

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
parcours: parcoursCourant(),
track: application ? application.track : undefined,
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

// Lot ACCEPTATION : en bourses, pas d'e-mail sans candidature acceptée.
const blocage = blocageOutil({ espace: ctx.espace, application });
if (blocage) {
syncBlocage();
showToast(blocage.texte, { type: "warning" });
return;
}

const data = collectData();

// Les deux seules informations réellement indispensables — l'HTML ne
// porte plus de `required` (les champs sont repliés par défaut, un
// required invisible bloquerait la soumission sans rien montrer) :
// la garde vit ici, et OUVRE les champs au lieu d'échouer en silence.
if (!data.fullName || !data.university) {
openContextDetails(!data.fullName ? fieldFullName : fieldUniversity);
showToast(!data.fullName
? "Indiquez votre nom complet — Fitz signe l'e-mail avec."
: "Indiquez l'université destinataire, ou choisissez une candidature concernée ci-dessus.", { type: "error" });
return;
}

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

if (application) {

try {

await updateDoc(doc(db, "users", ctx.user.uid, "applications", application.id), {
generatedEmail: {
content: text,
emailType: selectedType,
generatedAt: serverTimestamp()
}
});

} catch (error) {

console.error("Impossible d'enregistrer l'e-mail sur la candidature :", error);

}

}

trackEvent("email_generated", { country: data.country, emailType: selectedType });

showToast(application ? `E-mail généré et enregistré dans "${application.university}".` : "E-mail généré avec succès.");

} catch (error) {

// estArret() d'abord : l'étudiant qui a appuyé sur « Arrêter »
// n'a rien raté, lui afficher une erreur serait un contresens.
if (!estArret(error)) {
console.error(error);
showToast(messageErreurFitz(error), { type: "error" });
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

downloadBtn.addEventListener("click", () => downloadTextFile(`email-fitz-${Date.now()}.txt`, isEditing ? previewEdit.value : currentText));

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

bootstrapShell({ feature: "ai_email", espace: ESPACE_OUTILS }).then(async (ctx) => {

if (ctx.locked) {

document.getElementById("emailApp").remove();
renderLockedState(document.getElementById("lockedState"), ctx);
return;

}

await initEmailTool(ctx);

});
