/**
* ============================================================
* FitzUniverse — AI Chat (ai-chat.js)
* ============================================================
* Assistant conversationnel Fitz : historique multi-conversations
* persistant (js/ai/chat-store.js), pièces jointes en aperçu local
* (js/ai/attachments.js), génération simulée mais "streamée" et
* abortable (js/ai/ai-client.js), rendu Markdown léger et sûr
* (js/ai/format.js). Aucune logique de génération ici — cette page ne
* fait qu'orchestrer l'UI.
* ============================================================
*/

import { initShellChrome, bootstrapShell, unlockingPlans, PLAN_LABELS, ESPACE_OUTILS } from "./js/app-shell.js";
// Lot ACCEPTATION, partie 4 : le Pass Découverte seul, et sa fin.
import { passSeul, passTermine, joursRestantsPass, PASS_LABEL } from "./js/plan-features.js";
import { FITZ_UNLOCK_CTA, unlockPlanPhrase } from "./js/fitz-voice.js";
import { generate, messageErreurFitz, estArret } from "./js/ai/ai-client.js";
import { getSuggestedQuestions } from "./js/ai/simulated-responses.js";
import { parcoursDOutil } from "./js/parcours.js";
// Lot FITZ-RECOURS : ?bloc=<code> — Fitz ouvre lui-même la conversation
// avec le diagnostic déjà fait. Même motif que ?prep=, étendu.
import { lireBlocage, diagnostiquer, echelleDeRecours, messageDeFitz } from "./js/fitz-recours.js";
import { contexteDeBlocage } from "./js/fitz-recours-contexte.js";
import { enregistrerBlocage } from "./js/fitz-recours-journal.js";

const blocageDemande = lireBlocage(window.location.search);

// Le parcours du chat est celui de l'ESPACE où l'étudiant se trouve
// (posé par bootstrapShell) : le chat n'est lié à aucune candidature.
let parcoursChat = "bourse";
import { renderMarkdownLite, escapeHtml } from "./js/ai/format.js";
import {
listConversations,
createConversation,
saveConversation,
renameConversation,
deleteConversation
} from "./js/ai/chat-store.js";
import { readAttachment, validateFiles, imagesPourLeModele } from "./js/ai/attachments.js";
import { compressImageToTarget } from "./js/compression-image.js";
import { showToast, copyToClipboard } from "./js/ai/toast.js";
import { trackEvent } from "./js/analytics.js";

// Contexte réel (2026-09-02) : Fitz reçoit les candidatures de
// l'étudiant (échéances, statuts) pour répondre avec SES données —
// et la page Préparation aux tests peut l'ouvrir en mode entraînement
// (?prep=<id de test>), auquel cas Fitz sait déjà pourquoi l'étudiant
// est là et ouvre directement la stratégie.
import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { TESTS } from "./js/test-prep-data.js";

initShellChrome();

// LE DIAGNOSTIC EST CALCULÉ, DONC GRATUIT (lot FITZ-RECOURS, règle
// d'honnêteté b). Un compte sans accès au chat — gratuit, Diagnostic
// France — arrive ici avec ?bloc= : il DOIT voir ce qui le bloque. C'est
// la conversation qui est réservée. Et c'est le meilleur moment de vente
// qui existe : le problème, puis la formule — jamais un cadenas muet.
async function renderDiagnosticVerrouille(container, ctx) {

if (!blocageDemande) return;

let applications = [];
try {
const snapshot = await getDocs(collection(db, "users", ctx.user.uid, "applications"));
applications = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
} catch (error) {
console.warn("Diagnostic sans candidatures :", error);
}

const contexte = await contexteDeBlocage(ctx, blocageDemande, applications);
const diag = diagnostiquer(blocageDemande, contexte);
const echelle = echelleDeRecours(ctx);

const bloc = document.createElement("div");
bloc.className = "fitz-recours-diagnostic";
bloc.innerHTML = `<h3>${escapeHtml(diag.titre || "Ce qui vous bloque")}</h3>${renderMarkdownLite(messageDeFitz(diag, echelle))}`;
container.insertAdjacentElement("afterbegin", bloc);

enregistrerBlocage(ctx.user.uid, { code: diag.code, applicationId: blocageDemande.app, etapeId: blocageDemande.etape, parcours: contexte.parcours, plan: ctx.planPreinscriptionId && contexte.parcours === "preinscription" ? ctx.planPreinscriptionId : ctx.planId, resolu: diag.resolu === true });

}

function renderLockedState(container, ctx) {

const flags = ctx.featureFlags.ai_chat;
const target = unlockingPlans(ctx.planId, flags)[0];

// Lot ACCEPTATION, partie 4 : un Pass Découverte TERMINÉ (et plus
// aucune formule qui ouvre le chat) le dit, avec sa date — pas le
// message générique « disponible avec une formule supérieure ».
const finDuPass = passTermine(ctx.userData);

if (finDuPass) {

container.innerHTML = `
<div class="ai-locked-hero" data-pass="termine">
<div class="ai-locked-icon"><i data-lucide="lock"></i></div>
<h2>Discuter avec Fitz</h2>
<p>Votre Pass Découverte s'est terminé le ${escapeHtml(finDuPass.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }))}. Pour continuer avec Fitz, choisissez une formule.</p>
<a href="offers.html" class="btn btn-primary"><span>Voir les formules</span></a>
</div>
`;

container.hidden = false;
if (window.lucide) lucide.createIcons();
return;

}

container.innerHTML = `
<div class="ai-locked-hero">
<div class="ai-locked-icon"><i data-lucide="lock"></i></div>
<h2>Discuter avec Fitz</h2>
<p>Cette fonctionnalité est disponible avec ${unlockPlanPhrase(target ? PLAN_LABELS[target] : null)}. Passez à une formule supérieure pour poser toutes vos questions à Fitz.</p>
<a href="${target ? `offers.html#${target}` : "offers.html"}" class="btn btn-primary">
<span>${FITZ_UNLOCK_CTA}</span>
</a>
</div>
`;

container.hidden = false;

if (window.lucide) lucide.createIcons();

renderDiagnosticVerrouille(container, ctx);

}

function uid() {
return `m_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// Le symbole Fitz (deux arcs), en taille avatar — la même marque que la
// barre du parcours, pour que chaque réponse soit signée visuellement.
const FITZ_MARK_SVG = `<svg class="fitz-mark" viewBox="0 0 100 100" fill="none" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><circle class="mark-structure" cx="50" cy="50" r="34" stroke-width="11" stroke-linecap="round" stroke-dasharray="130 83.6" transform="rotate(-90 50 50)"/><circle class="mark-accent" cx="50" cy="50" r="34" stroke-width="11" stroke-linecap="round" stroke-dasharray="42 171.6" stroke-dashoffset="-150" transform="rotate(-90 50 50)"/></svg>`;

// ==========================================================
// Historique daté — groupes façon ChatGPT/Claude
// ==========================================================
function libelleGroupe(timestamp, maintenant = new Date()) {

const jour = new Date(maintenant);
jour.setHours(0, 0, 0, 0);

const date = new Date(timestamp || 0);
date.setHours(0, 0, 0, 0);

const ecartJours = Math.round((jour - date) / 86400000);

if (ecartJours <= 0) return "Aujourd'hui";
if (ecartJours === 1) return "Hier";
if (ecartJours <= 7) return "7 derniers jours";
if (ecartJours <= 30) return "30 derniers jours";
return "Plus ancien";

}

// Aperçu d'une conversation : le dernier message, débarrassé du
// balisage Markdown léger — jamais interprété (textContent côté rendu).
function apercuConversation(conversation) {

const dernier = [...conversation.messages].reverse().find((m) => m.content && m.content.trim());
if (!dernier) return "Conversation vide";

const texte = dernier.content.replace(/[*_#`>-]/g, "").replace(/\s+/g, " ").trim();
const prefixe = dernier.role === "assistant" ? "Fitz : " : "Vous : ";

return prefixe + (texte.length > 64 ? `${texte.slice(0, 64)}…` : texte);

}

function initChat(ctx) {

const { user, profile } = ctx;

// Candidatures de l'étudiant — chargées une fois, jamais bloquantes :
// le chat démarre sans elles et les réponses les utilisent dès
// qu'elles sont là (1 lecture par candidature, petites collections).
let studentApplications = [];

const applicationsReady = getDocs(collection(db, "users", user.uid, "applications"))
.then((snapshot) => {
studentApplications = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
})
.catch((error) => {
console.warn("Chat sans contexte candidatures :", error);
});

// Mode « M'entraîner avec Fitz » (test-prep.html → ?prep=<id>) —
// consommé une seule fois, sur le premier message.
let pendingTestPrep = new URLSearchParams(window.location.search).get("prep");

const scrollEl = document.getElementById("chatScroll");
const emptyState = document.getElementById("chatEmptyState");
const helpCardsEl = document.getElementById("chatHelpCards");
const form = document.getElementById("chatForm");
const input = document.getElementById("chatInput");
const sendBtn = document.getElementById("chatSendBtn");
const stopBtn = document.getElementById("chatStopBtn");
const scrollToBottomBtn = document.getElementById("scrollToBottomBtn");
const newConversationBtn = document.getElementById("newConversationBtn");
const currentTitleEl = document.getElementById("chatCurrentTitle");

const historyEl = document.getElementById("chatHistory");
const historyListEl = document.getElementById("chatHistoryList");
const historyToggleBtn = document.getElementById("chatHistoryToggleBtn");
const historyCloseBtn = document.getElementById("chatHistoryCloseBtn");
const historyBackdrop = document.getElementById("chatHistoryBackdrop");
const historySearchInput = document.getElementById("chatHistorySearch");

const attachBtn = document.getElementById("attachBtn");
const fileInput = document.getElementById("chatFileInput");
const attachmentsPreviewEl = document.getElementById("chatAttachments");

// ==========================================================
// État — liste des conversations + conversation active
// ==========================================================

let conversations = listConversations(user.uid);
let active = conversations[0] || createConversation(user.uid);
if (!conversations.length) conversations = [active];

let pendingAttachments = [];
let activeController = null;
let isGenerating = false;

function persist() {
active = saveConversation(user.uid, active);
conversations = listConversations(user.uid);
renderHistoryList();
updateCurrentTitle();
}

function isNearBottom() {
return scrollEl.scrollHeight - scrollEl.scrollTop - scrollEl.clientHeight < 120;
}

function scrollToBottom(smooth = true) {
scrollEl.scrollTo({ top: scrollEl.scrollHeight, behavior: smooth ? "smooth" : "auto" });
}

scrollEl.addEventListener("scroll", () => {
scrollToBottomBtn.classList.toggle("is-visible", !isNearBottom());
});

scrollToBottomBtn.addEventListener("click", () => scrollToBottom());

// ==========================================================
// Historique des conversations (sidebar)
// ==========================================================

function openHistory() {
document.body.classList.add("ai-chat-history-open");
}

function closeHistory() {
document.body.classList.remove("ai-chat-history-open");
}

historyToggleBtn.addEventListener("click", () => {
document.body.classList.toggle("ai-chat-history-open");
});

historyCloseBtn.addEventListener("click", closeHistory);
historyBackdrop.addEventListener("click", closeHistory);

historySearchInput.addEventListener("input", renderHistoryList);

// Recherche par titre ET par contenu des messages — un historique de
// plusieurs dizaines de fils redevient vite illisible en défilement
// pur (constat de l'audit Phase 3 : "au-delà de quelques échanges,
// retrouver une ancienne conversation devient pénible").
function matchesHistorySearch(conversation, query) {

if (!query) return true;

const normalizedQuery = query.trim().toLowerCase();
if (!normalizedQuery) return true;

if (conversation.title.toLowerCase().includes(normalizedQuery)) return true;

return conversation.messages.some((message) =>
(message.content || "").toLowerCase().includes(normalizedQuery)
);

}

function renderHistoryList() {

historyListEl.innerHTML = "";

const query = historySearchInput.value;
const filtered = conversations.filter((conversation) => matchesHistorySearch(conversation, query));

if (query.trim() && !filtered.length) {
historyListEl.innerHTML = `<p class="ai-chat-history-empty">Aucune conversation ne correspond à « ${escapeHtml(query.trim())} ».</p>`;
if (window.lucide) lucide.createIcons();
return;
}

// Groupes datés (Aujourd'hui / Hier / …) — la liste est déjà triée de
// la plus récente à la plus ancienne par listConversations().
let groupeCourant = null;

filtered.forEach((conversation) => {

const groupe = libelleGroupe(conversation.updatedAt || conversation.createdAt);
if (groupe !== groupeCourant) {
groupeCourant = groupe;
const label = document.createElement("p");
label.className = "ai-chat-history-group";
label.textContent = groupe;
historyListEl.appendChild(label);
}

const item = document.createElement("div");
item.className = `ai-chat-history-item${conversation.id === active.id ? " is-active" : ""}`;
item.dataset.id = conversation.id;

item.innerHTML = `
<button type="button" class="ai-chat-history-item-select">
<span class="ai-chat-history-item-title">${escapeHtml(conversation.title)}</span>
<span class="ai-chat-history-item-preview">${escapeHtml(apercuConversation(conversation))}</span>
</button>
<div class="ai-chat-history-item-actions">
<button type="button" class="ai-icon-btn" data-action="rename" aria-label="Renommer"><i data-lucide="pen-line"></i></button>
<button type="button" class="ai-icon-btn" data-action="delete" aria-label="Supprimer"><i data-lucide="trash-2"></i></button>
</div>
`;

item.querySelector(".ai-chat-history-item-select").addEventListener("click", () => {
if (conversation.id === active.id) { closeHistory(); return; }
switchConversation(conversation.id);
closeHistory();
});

item.querySelector('[data-action="rename"]').addEventListener("click", (event) => {
event.stopPropagation();
const nextTitle = prompt("Renommer la conversation :", conversation.title);
if (!nextTitle || !nextTitle.trim()) return;
renameConversation(user.uid, conversation.id, nextTitle.trim());
conversations = listConversations(user.uid);
if (conversation.id === active.id) active = conversations.find((c) => c.id === active.id) || active;
renderHistoryList();
updateCurrentTitle();
});

item.querySelector('[data-action="delete"]').addEventListener("click", (event) => {
event.stopPropagation();
if (!confirm(`Supprimer "${conversation.title}" ? Cette action est définitive.`)) return;
const wasActive = conversation.id === active.id;
deleteConversation(user.uid, conversation.id);
conversations = listConversations(user.uid);
if (wasActive) {
active = conversations[0] || createConversation(user.uid);
if (!conversations.length) conversations = [active];
renderAll();
}
renderHistoryList();
});

historyListEl.appendChild(item);

});

if (window.lucide) lucide.createIcons();

}

function updateCurrentTitle() {
currentTitleEl.textContent = active.title;
}

function switchConversation(id) {

if (isGenerating) {
showToast("Attendez la fin de la réponse en cours avant de changer de conversation.");
return;
}

const next = conversations.find((c) => c.id === id);
if (!next) return;

active = next;
clearPendingAttachments();
renderAll();
renderHistoryList();

}

// ==========================================================
// Pièces jointes (aperçu local — voir js/ai/attachments.js)
// ==========================================================

function clearPendingAttachments() {
pendingAttachments = [];
renderPendingAttachments();
}

function renderPendingAttachments() {

if (!pendingAttachments.length) {
attachmentsPreviewEl.hidden = true;
attachmentsPreviewEl.innerHTML = "";
return;
}

attachmentsPreviewEl.hidden = false;

attachmentsPreviewEl.innerHTML = pendingAttachments.map((attachment, index) => `
<div class="ai-attachment-chip" data-index="${index}">
${attachment.previewUrl
? `<img src="${attachment.previewUrl}" alt="">`
: `<div class="ai-attachment-chip-icon"><i data-lucide="${attachment.icon}"></i></div>`}
<span class="ai-attachment-chip-name">${escapeHtml(attachment.name)}</span>
<button type="button" class="ai-attachment-chip-remove" data-remove="${index}" aria-label="Retirer la pièce jointe">
<i data-lucide="x"></i>
</button>
</div>
`).join("");

attachmentsPreviewEl.querySelectorAll("[data-remove]").forEach((btn) => {
btn.addEventListener("click", () => {
pendingAttachments.splice(Number(btn.dataset.remove), 1);
renderPendingAttachments();
});
});

if (window.lucide) lucide.createIcons();

}

/**
 * UNE CAPTURE DE TÉLÉPHONE PÈSE TROP POUR ÊTRE ENVOYÉE TELLE QUELLE.
 *
 * Un écran de portail photographié fait couramment 1 à 3 Mo. Le serveur
 * refuse au-delà de 4 Mo, et surtout : le modèle redimensionne de toute
 * façon l'image de son côté — les octets au-delà ne servent à rien, ils
 * ne font que ralentir l'envoi sur une connexion sénégalaise et gonfler
 * la facture.
 *
 * On passe donc par la compression qui existe déjà dans le dépôt
 * (js/compression-image.js, écrite pour l'outil de compression et la
 * preuve de dépôt) : une seule implémentation, un troisième appelant.
 * Cible 900 Ko — la qualité ne descend que si elle ne suffit pas, donc
 * une capture de portail reste lisible, texte des boutons compris.
 *
 * Si la compression échoue (format exotique, canvas indisponible), on
 * envoie le fichier d'origine : mieux vaut une capture lourde qu'aucune.
 */
async function allegerSiImage(file) {

if (!file.type.startsWith("image/")) return file;
if (file.size <= 900 * 1024) return file;

try {
const blob = await compressImageToTarget(file, 900 * 1024);
return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" });
} catch (erreur) {
return file;
}

}

async function handleFiles(fileList) {

const { accepted, rejected } = validateFiles(fileList, pendingAttachments.length);

rejected.forEach((r) => showToast(r.reason));

for (const file of accepted) {

try {
const attachment = await readAttachment(await allegerSiImage(file));
pendingAttachments.push(attachment);
} catch (error) {
showToast(error.message);
}

}

renderPendingAttachments();

}

attachBtn.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", () => {
if (fileInput.files.length) handleFiles(fileInput.files);
fileInput.value = "";
});

form.addEventListener("dragover", (event) => {
event.preventDefault();
form.classList.add("is-dragover");
});

["dragleave", "drop"].forEach((evt) => {
form.addEventListener(evt, () => form.classList.remove("is-dragover"));
});

form.addEventListener("drop", (event) => {
event.preventDefault();
if (event.dataTransfer.files.length) handleFiles(event.dataTransfer.files);
});

/* Remplit les cartes de l'état vide à partir du profil.
Remplace renderSuggestions(), qui peuplait une rangée de pastilles
posée au-dessus du champ de saisie : les mêmes questions que les
cartes juste au-dessus, et qui restaient affichées pendant toute la
conversation même après vingt messages.

getSuggestedQuestions() était déjà sensible au profil — elle place en
tête une question sur le domaine visé par l'étudiant et ajoute une
question sur son pays de destination. Cette intelligence existait
dans le code mais n'atteignait que les pastilles ; elle alimente
maintenant les cartes, c'est-à-dire l'endroit qu'on regarde. */

const ICONES_SUGGESTION = ["graduation-cap", "file-text", "pen-line", "send", "globe"];

function renderHelpCards() {

if (!helpCardsEl) return;

const questions = getSuggestedQuestions(profile, parcoursChat);
if (!questions.length) return;

helpCardsEl.innerHTML = "";

questions.forEach((question, index) => {

const carte = document.createElement("button");
carte.type = "button";
carte.className = "ai-help-card";
carte.dataset.prompt = question;

// textContent et non innerHTML : la question peut contenir le
// domaine ou le pays saisis par l'étudiant dans son profil, donc
// du texte qu'il contrôle. Il ne doit jamais être interprété.
const glyphe = document.createElement("i");
glyphe.setAttribute("data-lucide", ICONES_SUGGESTION[index % ICONES_SUGGESTION.length]);

const libelle = document.createElement("span");
libelle.textContent = question;

carte.append(glyphe, libelle);
helpCardsEl.appendChild(carte);

});

if (window.lucide) lucide.createIcons();

}

function messageAvatar(role) {

if (role === "user") {
const initial = (profile.firstName || user.displayName || "V").trim().charAt(0).toUpperCase();
return `<div class="ai-msg-avatar">${initial || "V"}</div>`;
}

// Chaque réponse est signée du symbole Fitz — l'étudiant sait
// toujours qui parle, comme sur Claude ou ChatGPT.
return `<div class="ai-msg-avatar ai-msg-avatar--fitz">${FITZ_MARK_SVG}</div>`;

}

function messageActionsHTML(message) {

if (message.role !== "assistant" || message.pending) return "";

return `
<div class="ai-msg-actions">
<button type="button" data-action="copy" data-id="${message.id}"><i data-lucide="copy"></i>Copier</button>
<button type="button" data-action="regenerate" data-id="${message.id}"><i data-lucide="refresh-cw"></i>Régénérer</button>
</div>
`;

}

function messageAttachmentsHTML(message) {

if (!message.attachments || !message.attachments.length) return "";

return `
<div class="ai-msg-attachments">
${message.attachments.map((a) => a.previewUrl
? `<img src="${a.previewUrl}" alt="${escapeHtml(a.name)}" class="ai-msg-attachment-thumb">`
: `<span class="ai-msg-attachment-file"><i data-lucide="${a.icon}"></i>${escapeHtml(a.name)}</span>`
).join("")}
</div>
`;

}

function renderMessageEl(message) {

const wrap = document.createElement("div");
wrap.className = `ai-msg ${message.role === "user" ? "ai-msg-user" : "ai-msg-bot"}`;
wrap.dataset.id = message.id;

wrap.innerHTML = `
${messageAvatar(message.role)}
<div class="ai-msg-col">
${messageAttachmentsHTML(message)}
<div class="ai-msg-bubble">${message.role === "user" ? `<p>${escapeHtml(message.content)}</p>` : (message.pending ? thinkingHTML() : renderMarkdownLite(message.content))}</div>
${messageActionsHTML(message)}
</div>
`;

return wrap;

}

function thinkingHTML() {
return `<span class="ai-thinking">Fitz réfléchit<span class="ai-thinking-dots"><span></span><span></span><span></span></span></span>`;
}

function renderAll() {

scrollEl.querySelectorAll(".ai-msg").forEach((el) => el.remove());

const messages = active.messages;

emptyState.hidden = messages.length > 0;

messages.forEach((message) => {
scrollEl.appendChild(renderMessageEl(message));
});

updateCurrentTitle();

if (window.lucide) lucide.createIcons();

// Un défilement vers le bas n'a de sens que s'il y a des messages à
// faire défiler. Sans cette condition, sur un écran mobile étroit où
// l'état vide (avatar + titre + texte d'intro + cartes) dépasse la
// hauteur visible de #chatScroll, ce scrollToBottom(false) défilait
// quand même jusqu'en bas — masquant l'avatar de Fitz et le titre
// « Comment puis-je vous aider aujourd'hui ? » dès l'arrivée sur la
// page, sans qu'aucun message ne le justifie (bug constaté le 2026-08-27
// lors de la vérification mobile demandée par l'utilisateur).
if (messages.length > 0) scrollToBottom(false);

}

function updateMessageEl(message) {

const el = scrollEl.querySelector(`.ai-msg[data-id="${message.id}"]`);
if (!el) return;

const bubble = el.querySelector(".ai-msg-bubble");
bubble.innerHTML = message.pending ? thinkingHTML() : renderMarkdownLite(message.content);

const colEl = el.querySelector(".ai-msg-col");
const existingActions = colEl.querySelector(".ai-msg-actions");
if (existingActions) existingActions.remove();
colEl.insertAdjacentHTML("beforeend", messageActionsHTML(message));

if (window.lucide) lucide.createIcons();

}

function setGenerating(state) {

isGenerating = state;
sendBtn.hidden = state;
stopBtn.hidden = !state;
input.disabled = state;

}

async function runAssistantReply(userMessage, assistantMessage) {

setGenerating(true);
activeController = new AbortController();

emptyState.hidden = true;

try {

const testPrep = pendingTestPrep;
pendingTestPrep = null;

const { text } = await generate({
task: "chat",
input: {
message: userMessage.content,
profile,
parcours: parcoursChat,
applications: studentApplications,
testPrep,
history: active.messages.filter((m) => m.id !== assistantMessage.id).slice(-8),
// LES PIÈCES JOINTES, ET LA CLÉ QUI COMPTE (lot FITZ-VOIT).
//
// `attachments` sert à l'AFFICHAGE dans la conversation — c'est la
// clé que cette page utilisait seule, et personne en aval ne la lit.
// `images` est le canal réel : js/ai/ai-gateway.js le normalise et
// l'ajoute à la charge envoyée à la fonction, qui le passe au modèle.
// Sans cette deuxième ligne, une capture d'écran s'affichait à
// l'étudiant et n'atteignait jamais Fitz.
attachments: userMessage.attachments || [],
images: imagesPourLeModele(userMessage.attachments || [])
},
signal: activeController.signal,
onToken: (partial) => {

assistantMessage.pending = false;
assistantMessage.content = partial;

updateMessageEl(assistantMessage);

if (isNearBottom()) scrollToBottom(false);

}
});

assistantMessage.pending = false;
assistantMessage.content = text;
assistantMessage.stopped = false;

} catch (error) {

if (estArret(error)) {
assistantMessage.pending = false;
assistantMessage.stopped = true;
if (!assistantMessage.content) assistantMessage.content = "_Réponse interrompue._";
} else {
console.error("Fitz a rencontré une erreur :", error);
assistantMessage.pending = false;
// Le message précis remplace le « réessayez » générique : sur un
// quota atteint ou un texte trop long, réessayer est un mauvais
// conseil, et l'étudiant le suivrait.
assistantMessage.content = messageErreurFitz(error);
}

} finally {

updateMessageEl(assistantMessage);
persist();
setGenerating(false);
activeController = null;

}

}

form.addEventListener("submit", (event) => {

event.preventDefault();

if (isGenerating) return;

const content = input.value.trim();
if (!content && !pendingAttachments.length) return;

const userMessage = {
id: uid(),
role: "user",
content,
attachments: pendingAttachments,
createdAt: Date.now()
};
active.messages.push(userMessage);

emptyState.hidden = true;
scrollEl.appendChild(renderMessageEl(userMessage));
if (window.lucide) lucide.createIcons();
scrollToBottom();

clearPendingAttachments();
persist();

trackEvent("ai_chat_message_sent", {});

input.value = "";
input.style.height = "auto";

const assistantMessage = { id: uid(), role: "assistant", content: "", pending: true, createdAt: Date.now() };
active.messages.push(assistantMessage);
scrollEl.appendChild(renderMessageEl(assistantMessage));
if (window.lucide) lucide.createIcons();
scrollToBottom();

runAssistantReply(userMessage, assistantMessage);

});

stopBtn.addEventListener("click", () => {
if (activeController) activeController.abort();
});

input.addEventListener("keydown", (event) => {

if (event.key === "Enter" && !event.shiftKey) {
event.preventDefault();
form.requestSubmit();
}

});

input.addEventListener("input", () => {
input.style.height = "auto";
input.style.height = `${Math.min(input.scrollHeight, 140)}px`;
});

scrollEl.addEventListener("click", (event) => {

const button = event.target.closest("[data-action]");
if (!button) return;

const message = active.messages.find((m) => m.id === button.dataset.id);
if (!message) return;

if (button.dataset.action === "copy") {
copyToClipboard(message.content);
}

if (button.dataset.action === "regenerate") {

if (isGenerating) return;

const index = active.messages.findIndex((m) => m.id === message.id);
const userMessage = [...active.messages.slice(0, index)].reverse().find((m) => m.role === "user");

if (!userMessage) return;

message.content = "";
message.pending = true;
updateMessageEl(message);

runAssistantReply(userMessage, message);

}

});

document.querySelectorAll(".ai-help-card").forEach((card) => {

card.addEventListener("click", () => {
input.value = card.dataset.prompt;
form.requestSubmit();
});

});

newConversationBtn.addEventListener("click", () => {

if (isGenerating) return;

active = createConversation(user.uid);
conversations = listConversations(user.uid);
clearPendingAttachments();
renderAll();
renderHistoryList();
closeHistory();
showToast("Nouvelle conversation démarrée.");

});

// Salutation personnalisée de l'écran d'accueil — le prénom vient du
// profil (textContent : jamais interprété).
const greetingEl = document.getElementById("chatGreeting");
if (greetingEl) {
const prenom = (profile.firstName || user.displayName || "").trim().split(/\s+/)[0];
greetingEl.textContent = prenom
? `Bonjour ${prenom} — comment puis-je vous aider ?`
: "Comment puis-je vous aider aujourd'hui ?";
}

renderHelpCards();
renderAll();
renderHistoryList();

// Arrivée depuis un blocage (?bloc=) : Fitz ouvre lui-même.
if (blocageDemande) {

applicationsReady.then(async () => {

const contexte = await contexteDeBlocage(ctx, blocageDemande, studentApplications);
const diag = diagnostiquer(blocageDemande, contexte);
const echelle = echelleDeRecours(ctx);

active = createConversation(user.uid);
conversations = listConversations(user.uid);
active.title = diag.titre ? `Bloqué : ${diag.titre}`.slice(0, 60) : "Un blocage";
active.messages.push({ id: uid(), role: "assistant", content: messageDeFitz(diag, echelle), createdAt: Date.now(), recours: diag.code });
persist();
renderAll();
scrollToBottom(false);

enregistrerBlocage(user.uid, { code: diag.code, applicationId: blocageDemande.app, etapeId: blocageDemande.etape, parcours: contexte.parcours, plan: ctx.planPreinscriptionId && contexte.parcours === "preinscription" ? ctx.planPreinscriptionId : ctx.planId, resolu: diag.resolu === true });

});

}

// Arrivée en mode entraînement : on attend le contexte candidatures
// (la stratégie se cale sur les échéances réelles), puis Fitz reçoit
// un message d'ouverture naturel — visible, comme si l'étudiant
// l'avait écrit — et répond par le briefing complet.
if (pendingTestPrep) {

const fiche = TESTS.find((t) => t.id === pendingTestPrep);

if (fiche) {

applicationsReady.then(() => {

if (isGenerating) return;

input.value = `Je viens m'entraîner pour le ${fiche.nom}.`;
form.requestSubmit();

});

} else {

pendingTestPrep = null;

}

}

}

bootstrapShell({ feature: "ai_chat", espace: ESPACE_OUTILS }).then((ctx) => {

if (ctx.locked) {

document.getElementById("chatApp").remove();
renderLockedState(document.getElementById("lockedState"), ctx);
return;

}

parcoursChat = parcoursDOutil({ espace: ctx.espace });

// Lot ACCEPTATION, partie 4 : un Pass seul voit discrètement le temps
// qui reste — « Pass Découverte — 9 jours restants ». Aucun bouton
// d'achat pendant le pass.
if (passSeul(ctx)) {
const restant = joursRestantsPass(ctx.userData && ctx.userData.fitzExpressExpiresAt);
const barre = document.querySelector(".ai-chat-main-topbar");
if (restant && barre) {
const el = document.createElement("span");
el.id = "chatPassRestant";
el.className = "ai-chat-pass-restant";
el.textContent = `${PASS_LABEL} — ${restant}`;
barre.appendChild(el);
}
}

initChat(ctx);

});

// ==========================================================
// ARRIVÉE DEPUIS UN BLOCAGE (lot FITZ-RECOURS) — Fitz parle le premier
// ==========================================================
// Le diagnostic est déjà fait : Fitz ouvre une conversation neuve avec
// la réponse, la source et sa date, et le maillon suivant ouvert au
// compte. Pas de question « que puis-je pour vous ? » — un étudiant
// bloqué qui doit d'abord expliquer a perdu la partie.
//
// Rien de tout ceci n'appelle un modèle : chaque réponse vient d'une
// fonction que la page utilise déjà. Le jour où le modèle arrivera, il
// prendra la main sur les cas où `diag.resolu` est faux — et là
// seulement.
