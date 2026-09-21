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
import { doc, getDoc, updateDoc, serverTimestamp, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { initShellChrome, bootstrapShell, unlockingPlans, PLAN_LABELS, ESPACE_OUTILS } from "./js/app-shell.js";
import { FITZ_UNLOCK_CTA, unlockPlanPhrase } from "./js/fitz-voice.js";
import { generate, messageErreurFitz, estArret } from "./js/ai/ai-client.js";
import { LETTER_STYLES } from "./js/ai/simulated-responses.js";
import { renderMarkdownLite, wordCount } from "./js/ai/format.js";
import { saveGeneratedDocument } from "./js/ai/chat-store.js";
import { showToast, copyToClipboard, downloadTextFile } from "./js/ai/toast.js";
import { trackEvent } from "./js/analytics.js";
import { calculateAiScore, PROFILE_READY_THRESHOLD, libellePourcentProfil } from "./js/profile-score.js";
// Lot PRÉ-FITZ : le parcours décide de la FORME de la lettre — une lettre
// de motivation d'une page pour une bourse, une lettre de vœu de quatre
// à cinq lignes, une par formation, pour une préinscription.
import { parcoursDOutil, titreDuVoeu, paysDuVoeu, degreDuVoeu, PAYS_PREINSCRIPTION } from "./js/parcours.js";
// Lot ACCEPTATION (2026-09-11) : la lettre exige, en bourses, une
// candidature ACCEPTÉE — plus de mode libre pour une bourse.
import { candidaturesPourOutils } from "./js/fitz-choisit.js";
import { blocageOutil, afficherBlocage } from "./js/outil-acceptation.js";

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
`Votre profil est complet à ${libellePourcentProfil(score)}. Fitz y puise la matière de votre lettre : avec un profil incomplet, elle restera générique — et une lettre générique est ce qui écarte une candidature. Vous pouvez continuer, mais la compléter d'abord change tout.`;

bloc.hidden = false;

}

async function initLetterTool(ctx) {

const { profile } = ctx;

renderPrerequisNotice(profile);

// ==========================================================
// LE CONTEXTE APPARTIENT À FITZ (2026-09-02) — même patron
// qu'ai-email.js : les candidatures suivies remplissent la cible de
// la lettre (sélecteur « Candidature concernée »), le profil remplit
// le reste, les champs restent repliés sous « Ajuster ». La matière
// de la lettre (expériences, motivations…) reste visible : c'est à
// l'étudiant, Fitz ne fait que la pré-remplir depuis le profil.
// ==========================================================

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

// Repli : applicationId hors liste (lien ancien, document supprimé) —
// lecture directe comme avant la refonte, sans bloquer l'outil.
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
const contextBackLink = document.getElementById("applicationContextBackLink");

function syncContextBanner() {

if (!contextBanner) return;

if (application) {

contextBanner.hidden = false;
contextBanner.querySelector("span").textContent =
`Cette lettre sera enregistrée dans le suivi de "${application.university}".`;

if (contextBackLink) {
contextBackLink.href = `applications.html#${application.id}`;
contextBackLink.hidden = false;
}

} else {

contextBanner.hidden = true;
if (contextBackLink) contextBackLink.hidden = true;

}

}

syncContextBanner();

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

const fieldApplication = document.getElementById("fieldApplication");
const contextChips = document.getElementById("contextChips");
const contextDetails = document.getElementById("contextDetails");
const contextAdjustBtn = document.getElementById("contextAdjustBtn");

fieldCountry.value = (Array.isArray(profile.preferredCountries) && profile.preferredCountries[0]) || "";
// SANS CANDIDATURE, C'EST L'ESPACE QUI DIT LA DESTINATION (2026-09-17).
// `preferredCountries` est une préférence de parcours BOURSES : elle n'a
// rien à dire sur une préinscription, où la destination est celle de la
// route. Vu en ligne à l'étape 13, dont le lien vers cet outil ne porte
// aucun vœu : la page s'ouvrait sur « Pays visé : Chine ».
// L'ordre compte — le vœu, quand il y en a un, repasse après et gagne
// (`applyApplicationContext` → `paysDuVoeu`).
if (parcoursDOutil({ espace: ctx.espace }) === "preinscription") fieldCountry.value = PAYS_PREINSCRIPTION;
fieldProgram.value = profile.desiredField || "";
if (profile.desiredDegree) fieldLevel.value = profile.desiredDegree;
fieldExperiences.value = describedExperiences(profile);
fieldMotivations.value = profile.whyLeave || "";
fieldGoals.value = profile.careerGoals || profile.dreams || "";

// La cible vient de la candidature sélectionnée — elle sait à qui la
// lettre s'adresse, et la bourse visée nourrit les motivations.
// Lot ACCEPTATION : la ligne de blocage, avant le formulaire.
function syncBlocage() {
afficherBlocage(form, blocageOutil({ espace: ctx.espace, application }));
}

function applyApplicationContext(app) {

application = app || null;

if (app) {
fieldUniversity.value = app.university || "";
// LA FORMATION D'UN VŒU A SON PROPRE CHAMP (lot R1, 2026-09-17).
// L'ancien formulaire de candidature rangeait la formation dans
// `scholarship` — le champ « Bourse (optionnel) » — faute d'avoir mieux.
// La route écrit maintenant `formation` et `niveau`. On lit le neuf,
// puis l'ancien : les vœux créés avant le lot gardent leur libellé.
const formation = titreDuVoeu(app);
// LA CANDIDATURE GAGNE CONTRE LE PROFIL (lot R4, 2026-09-17) — voir
// `paysDuVoeu` dans js/parcours.js : le préremplissage par le profil
// écrasait la cible réelle, et la lettre d'un vœu à Lille annonçait la
// Chine. Le profil ne parle plus que faute de candidature.
const pays = paysDuVoeu(app);
if (pays) fieldCountry.value = pays;
const degre = degreDuVoeu(app);
if (degre) fieldLevel.value = degre;
if (formation) {
fieldProgram.value = formation;
// « Candidature à la bourse X » n'a de sens que pour une bourse : sur
// une préinscription, c'est la formation, et Fitz ne parle pas de bourse.
if (!fieldMotivations.value && parcoursDOutil({ application: app }) === "bourse" && app.scholarship) fieldMotivations.value = `Candidature à la bourse ${app.scholarship}.`;
}
}

verrouillerUniversite(app);

syncContextBanner();
renderContextChips();
appliquerMode();
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

// ==========================================================
// LE MODE « VŒU » (lot PRÉ-FITZ, 2026-09-10)
// ==========================================================
// Une préinscription ne reçoit pas une lettre de motivation d'une page :
// elle reçoit UNE lettre de vœu par formation, quatre à cinq lignes,
// pour la commission pédagogique de cette formation (Campus France,
// étape des vœux, vérifiée le 2026-09-08). Le nom de la formation et
// celui de l'établissement viennent de la candidature : ils ne
// s'inventent pas. Les cinq styles sont ceux d'une lettre de bourse —
// ils disparaissent : la forme est imposée par le portail.
//
// SUGGÉRER, JAMAIS ÉCRIRE À LA PLACE : le texte est un brouillon que
// l'étudiant retape lui-même dans son compte Études en France.
function parcoursCourant() {
return parcoursDOutil({ espace: ctx.espace, application });
}

function appliquerMode() {

const voeu = parcoursCourant() === "preinscription";

document.body.dataset.modeLettre = voeu ? "voeu" : "motivation";

styleGrid.hidden = voeu;
const titreStyle = styleGrid.closest(".ai-panel-body")?.previousElementSibling;
if (titreStyle) titreStyle.hidden = voeu;

const notice = document.getElementById("voeuNotice");
if (notice) notice.hidden = !voeu;

const badge = document.querySelector(".ai-page-header-badge span:last-child");
if (badge) badge.textContent = voeu ? "Une lettre par vœu · 4 à 5 lignes" : "5 styles disponibles";

const titre = document.querySelector(".ai-page-header-main h1");
if (titre) titre.textContent = voeu ? "Ma lettre pour chaque vœu" : "Votre lettre de motivation";

const sousTitre = document.querySelector(".ai-page-header-main p");
if (sousTitre) sousTitre.textContent = voeu
? "Choisissez la formation concernée : Fitz propose un brouillon court, propre à cette formation dans cet établissement — que vous recopiez vous-même dans votre compte sur le portail."
: "Complétez votre projet d'études : Fitz rédige une lettre adaptée à votre profil, dans le style de votre choix.";

const labelProgram = document.querySelector('label[for="fieldProgram"]');
if (labelProgram) labelProgram.textContent = voeu ? "Formation (une lettre par formation)" : "Programme";

const labelMotivations = document.querySelector('label[for="fieldMotivations"]');
if (labelMotivations) labelMotivations.textContent = voeu ? "Ce qui vous attire dans CETTE formation précisément" : "Motivations";

if (!currentText) generateBtn.querySelector("span").textContent = voeu ? "Rédiger ma lettre de vœu" : "Générer ma lettre";

}

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

// Pastilles — le miroir exact de la cible que collectData() enverra.
const CHIP_DEFS = [
{ label: "Pays visé", input: fieldCountry },
{ label: "Université destinataire", input: fieldUniversity },
{ label: "Programme", input: fieldProgram },
{ label: "Niveau", input: fieldLevel }
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

if (contextDetails.hidden) {
openContextDetails(null);
} else {
contextDetails.hidden = true;
contextAdjustBtn.setAttribute("aria-expanded", "false");
contextAdjustBtn.textContent = "Ajuster";
}

});

CHIP_DEFS.forEach(({ input }) => {
input.addEventListener("input", renderContextChips);
input.addEventListener("change", renderContextChips);
});

renderContextChips();

let selectedStyle = "personnalise";
let currentText = "";
let isEditing = false;
let activeController = null;

// UN SEUL ENDROIT APPLIQUE LE CONTEXTE (lot R5, 2026-09-17).
//
// CE QUI S'EST PASSÉ : il y en avait DEUX. `applyApplicationContext()`
// pour le changement de sélecteur, et un bloc écrit à la main ici pour
// l'arrivée par `?applicationId=` — qui ne posait que l'université. Le
// chemin du chargement est pourtant CELUI QUE LA ROUTE EMPRUNTE : depuis
// l'étape 8, « Écrire avec Fitz » ouvre
// ai-letter.html?applicationId=pre-N. Mesuré en ligne le 2026-09-17,
// après le lot R4 : le correctif « la candidature dicte la cible » était
// déployé et la page affichait toujours « Pays visé : Chine » pour un vœu
// à Lille — parce qu'il vivait dans la fonction que ce chemin n'appelle
// pas. Le même oubli avait produit le défaut du lot R2 (le garde de
// parcours manquant à cet endroit précis) : deux fois le même piège, au
// même endroit. On supprime donc le second chemin au lieu de le corriger
// une troisième fois.
//
// POURQUOI ICI, et pas trente lignes plus haut où vivait le bloc :
// `applyApplicationContext()` termine par `appliquerMode()`, qui lit
// `currentText` — déclaré en `let` juste au-dessus. Appelée avant cette
// déclaration, elle lèverait une ReferenceError de zone morte et la page
// entière ne s'afficherait plus. L'appel prend donc la place de
// `appliquerMode()`, qui n'a jamais été qu'une partie de ce travail.
if (application) applyApplicationContext(application);
else appliquerMode();

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
: `<div class="ai-preview-empty"><i data-lucide="pen-line"></i><span>${parcoursCourant() === "preinscription" ? "Votre lettre de vœu apparaîtra ici — quatre à cinq lignes, pour cette formation." : "Votre lettre de motivation apparaîtra ici."}</span></div>`;
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
// Le parcours voyage avec la demande : c'est lui qui décide, dans
// js/ai/prompts.js et le simulateur, de la forme de la lettre.
parcours: parcoursCourant(),
track: application ? application.track : undefined,
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

// Lot ACCEPTATION : en bourses, pas de lettre sans candidature acceptée.
const blocage = blocageOutil({ espace: ctx.espace, application });
if (blocage) {
syncBlocage();
showToast(blocage.texte, { type: "warning" });
return;
}

const data = collectData();

// Les `required` HTML ont été retirés (champs repliés par défaut —
// un required invisible bloque la soumission sans rien montrer) :
// la garde vit ici, et OUVRE les champs au lieu d'échouer en silence.
if (!data.university || !data.program) {
openContextDetails(!data.university ? fieldUniversity : fieldProgram);
showToast(!data.university
? "Indiquez l'université destinataire, ou choisissez une candidature concernée ci-dessus."
: "Indiquez le programme ou la bourse visé(e).", { type: "error" });
return;
}

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

const voeu = parcoursCourant() === "preinscription";

saveGeneratedDocument({
icon: "pen-line",
title: voeu ? `Lettre de vœu — ${data.university || data.program}` : `Lettre de motivation (${LETTER_STYLES[selectedStyle]?.label || selectedStyle})`,
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

showToast(voeu
? `Brouillon de lettre de vœu prêt${application ? ` pour "${application.university}"` : ""} — recopiez-le dans votre compte sur le portail.`
: (application ? `Lettre générée et enregistrée dans "${application.university}".` : "Lettre générée avec succès."));

} catch (error) {

// estArret() d'abord : l'étudiant qui a appuyé sur « Arrêter »
// n'a rien raté, lui afficher une erreur serait un contresens.
if (!estArret(error)) {
console.error(error);
showToast(messageErreurFitz(error), { type: "error" });
}

} finally {

generateBtn.disabled = false;
generateBtn.querySelector("span").textContent = parcoursCourant() === "preinscription" ? "Régénérer ma lettre de vœu" : "Régénérer ma lettre";
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

bootstrapShell({ feature: "ai_letter", espace: ESPACE_OUTILS }).then(async (ctx) => {

if (ctx.locked) {

document.getElementById("letterApp").remove();
renderLockedState(document.getElementById("lockedState"), ctx);
return;

}

await initLetterTool(ctx);

});
