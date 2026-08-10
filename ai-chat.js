/**
* ============================================================
* ScholarBridge — AI Chat (ai-chat.js)
* ============================================================
* Assistant conversationnel Fitz : historique multi-conversations
* persistant (js/ai/chat-store.js), pièces jointes en aperçu local
* (js/ai/attachments.js), génération simulée mais "streamée" et
* abortable (js/ai/ai-client.js), rendu Markdown léger et sûr
* (js/ai/format.js). Aucune logique de génération ici — cette page ne
* fait qu'orchestrer l'UI.
* ============================================================
*/

import { initShellChrome, bootstrapShell, unlockingPlans, PLAN_LABELS } from "./js/app-shell.js";
import { generate } from "./js/ai/ai-client.js";
import { getSuggestedQuestions } from "./js/ai/simulated-responses.js";
import { renderMarkdownLite, escapeHtml } from "./js/ai/format.js";
import {
listConversations,
createConversation,
saveConversation,
renameConversation,
deleteConversation
} from "./js/ai/chat-store.js";
import { readAttachment, validateFiles } from "./js/ai/attachments.js";
import { showToast, copyToClipboard } from "./js/ai/toast.js";
import { trackEvent } from "./js/analytics.js";

initShellChrome();

function renderLockedState(container, ctx) {

const flags = ctx.featureFlags.ai_chat;
const target = unlockingPlans(ctx.planId, flags)[0];

container.innerHTML = `
<div class="ai-locked-hero">
<div class="ai-locked-icon"><i data-lucide="lock"></i></div>
<h2>Discuter avec Fitz</h2>
<p>Cette fonctionnalité est disponible avec ${target ? `la formule <strong>${PLAN_LABELS[target]}</strong>` : "une formule supérieure"}. Passez à une formule supérieure pour poser toutes vos questions à Fitz.</p>
<a href="${target ? `offers.html#${target}` : "offers.html"}" class="btn btn-primary">
<i data-lucide="sparkles"></i>
<span>Découvrir nos formules</span>
</a>
</div>
`;

container.hidden = false;

if (window.lucide) lucide.createIcons();

}

function uid() {
return `m_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function initChat(ctx) {

const { user, profile } = ctx;

const scrollEl = document.getElementById("chatScroll");
const emptyState = document.getElementById("chatEmptyState");
const suggestionsEl = document.getElementById("chatSuggestions");
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

filtered.forEach((conversation) => {

const item = document.createElement("div");
item.className = `ai-chat-history-item${conversation.id === active.id ? " is-active" : ""}`;
item.dataset.id = conversation.id;

item.innerHTML = `
<button type="button" class="ai-chat-history-item-select">
<i data-lucide="message-square"></i>
<span>${escapeHtml(conversation.title)}</span>
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

async function handleFiles(fileList) {

const { accepted, rejected } = validateFiles(fileList, pendingAttachments.length);

rejected.forEach((r) => showToast(r.reason));

for (const file of accepted) {

try {
const attachment = await readAttachment(file);
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

function renderSuggestions() {

const questions = getSuggestedQuestions(profile);

suggestionsEl.innerHTML = "";

questions.forEach((question) => {

const chip = document.createElement("button");
chip.type = "button";
chip.className = "ai-suggestion-chip";
chip.textContent = question;
chip.addEventListener("click", () => {
input.value = question;
form.requestSubmit();
});

suggestionsEl.appendChild(chip);

});

}

function messageAvatar(role) {

if (role === "user") {
const initial = (profile.firstName || user.displayName || "V").trim().charAt(0).toUpperCase();
return `<div class="ai-msg-avatar">${initial || "V"}</div>`;
}

return `<div class="ai-msg-avatar"><i data-lucide="sparkles"></i></div>`;

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

scrollToBottom(false);

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

const { text } = await generate({
task: "chat",
input: {
message: userMessage.content,
profile,
history: active.messages.filter((m) => m.id !== assistantMessage.id).slice(-8),
// Point d'extension : les pièces jointes sont déjà transmises à
// generate() (js/ai/ai-client.js) — aucune analyse réelle n'a
// lieu aujourd'hui (voir js/ai/attachments.js), mais un futur
// fournisseur IA les recevra sans qu'il faille retoucher l'UI.
attachments: userMessage.attachments || []
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

if (error?.name === "AbortError") {
assistantMessage.pending = false;
assistantMessage.stopped = true;
if (!assistantMessage.content) assistantMessage.content = "_Réponse interrompue._";
} else {
console.error("Fitz a rencontré une erreur :", error);
assistantMessage.pending = false;
assistantMessage.content = "Fitz n'a pas pu terminer sa réponse cette fois — réessayez dans un instant.";
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

renderSuggestions();
renderAll();
renderHistoryList();

}

bootstrapShell({ feature: "ai_chat" }).then((ctx) => {

if (ctx.locked) {

document.getElementById("chatApp").remove();
renderLockedState(document.getElementById("lockedState"), ctx);
return;

}

initChat(ctx);

});
