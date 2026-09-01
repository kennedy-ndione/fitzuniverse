/**
* ============================================================
* FitzUniverse — persistance locale des artefacts Fitz
* ============================================================
*
* Stockage localStorage (par utilisateur pour le chat) en attendant une
* vraie persistance serveur. Isolé ici pour qu'un futur passage à
* Firestore (ex. users/{uid}/conversations) ne touche qu'un seul
* fichier : les pages appelantes ("ai-chat.js"...) ne connaissent que
* les fonctions exportées ci-dessous.
*
* Refonte 2026-08 : un seul fil de conversation par utilisateur
* (CHAT_PREFIX, désormais obsolète) devient une LISTE de conversations
* ({id, title, messages[], createdAt, updatedAt}), façon ChatGPT/Claude
* — historique, "nouvelle conversation", renommer/supprimer. L'ancien
* fil unique, s'il existe, est migré automatiquement (une seule fois,
* sans perte) au premier appel de listConversations().
*
* saveGeneratedDocument()/getGeneratedDocuments() réutilisent
* volontairement la clé "generatedDocuments" déjà utilisée par
* documents.html et le compteur du tableau de bord (dashboard.js) —
* même forme {icon, title, type, date, content}, avec un champ "meta"
* optionnel en plus, ignoré par l'existant.
* ============================================================
*/

const CHAT_PREFIX = "sb_ai_chat_"; // legacy, fil unique — lu une seule fois pour migration
const CONVERSATIONS_PREFIX = "sb_ai_conversations_";
const TRANSLATE_HISTORY_KEY = "sb_ai_translate_history";
const GENERATED_DOCUMENTS_KEY = "generatedDocuments";
const MAX_TRANSLATE_HISTORY = 5;

function readJSON(key, fallback) {
try {
const value = JSON.parse(localStorage.getItem(key));
return value ?? fallback;
} catch {
return fallback;
}
}

function writeJSON(key, value) {
try {
localStorage.setItem(key, JSON.stringify(value));
} catch (error) {
console.warn(`[chat-store] écriture impossible pour "${key}" :`, error);
}
}

function makeId() {
if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
return `conv_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

// ==========================================================
// Historique de conversations (AI Chat) — multi-fils
// ==========================================================

// Migration unique de l'ancien fil { uid: [...messages] } vers la
// nouvelle liste [{id, title, messages, createdAt, updatedAt}] — ne
// s'exécute que si la nouvelle clé n'existe pas encore ET que
// l'ancienne contient des messages, pour ne jamais écraser une liste
// déjà migrée ni fabriquer une conversation vide à partir de rien.
function migrateLegacyThread(uid) {

const legacyKey = `${CHAT_PREFIX}${uid}`;
const newKey = `${CONVERSATIONS_PREFIX}${uid}`;

if (localStorage.getItem(newKey) !== null) return null;

const legacyMessages = readJSON(legacyKey, []);
if (!Array.isArray(legacyMessages) || !legacyMessages.length) return null;

const now = Date.now();

const migrated = [{
id: makeId(),
title: deriveConversationTitle(legacyMessages) || "Conversation",
messages: legacyMessages,
createdAt: now,
updatedAt: now
}];

writeJSON(newKey, migrated);
localStorage.removeItem(legacyKey);

return migrated;

}

function deriveConversationTitle(messages) {

const firstUserMessage = messages.find((m) => m.role === "user" && m.content && m.content.trim());
if (!firstUserMessage) return "";

const text = firstUserMessage.content.trim().replace(/\s+/g, " ");
return text.length > 48 ? `${text.slice(0, 48)}…` : text;

}

/**
* @returns {Array<{id,title,messages,createdAt,updatedAt}>} triée de la
* plus récemment modifiée à la plus ancienne.
*/
export function listConversations(uid) {

const migrated = migrateLegacyThread(uid);
const conversations = migrated || readJSON(`${CONVERSATIONS_PREFIX}${uid}`, []);

return [...conversations].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

}

export function getConversationById(uid, id) {
return listConversations(uid).find((c) => c.id === id) || null;
}

export function createConversation(uid) {

const now = Date.now();

const conversation = {
id: makeId(),
title: "Nouvelle conversation",
messages: [],
createdAt: now,
updatedAt: now
};

const conversations = listConversations(uid);
conversations.unshift(conversation);
writeJSON(`${CONVERSATIONS_PREFIX}${uid}`, conversations);

return conversation;

}

/**
* Met à jour une conversation existante (messages/titre), ou l'ajoute
* si elle n'existe pas encore. Retitre automatiquement une conversation
* encore "Nouvelle conversation" dès qu'un premier message utilisateur
* est disponible (comportement ChatGPT/Claude).
*/
export function saveConversation(uid, conversation) {

const conversations = listConversations(uid);
const index = conversations.findIndex((c) => c.id === conversation.id);

const next = {
...conversation,
title: conversation.title === "Nouvelle conversation"
? (deriveConversationTitle(conversation.messages) || conversation.title)
: conversation.title,
updatedAt: Date.now()
};

if (index === -1) {
conversations.unshift(next);
} else {
conversations[index] = next;
}

writeJSON(`${CONVERSATIONS_PREFIX}${uid}`, conversations);

return next;

}

export function renameConversation(uid, id, title) {

const conversations = listConversations(uid);
const conversation = conversations.find((c) => c.id === id);
if (!conversation) return null;

conversation.title = title.trim() || conversation.title;
conversation.updatedAt = Date.now();

writeJSON(`${CONVERSATIONS_PREFIX}${uid}`, conversations);

return conversation;

}

export function deleteConversation(uid, id) {

const conversations = listConversations(uid).filter((c) => c.id !== id);
writeJSON(`${CONVERSATIONS_PREFIX}${uid}`, conversations);

return conversations;

}

// ==========================================================
// Historique de traduction (AI Translate)
// ==========================================================

export function getTranslationHistory() {
return readJSON(TRANSLATE_HISTORY_KEY, []);
}

export function addTranslationHistory(entry) {

const history = [entry, ...getTranslationHistory()].slice(0, MAX_TRANSLATE_HISTORY);

writeJSON(TRANSLATE_HISTORY_KEY, history);

return history;

}

// ==========================================================
// Documents générés (partagé avec documents.html / dashboard.js)
// ==========================================================

export function getGeneratedDocuments() {
return readJSON(GENERATED_DOCUMENTS_KEY, []);
}

export function saveGeneratedDocument(document) {

const documents = getGeneratedDocuments();

documents.unshift(document);

writeJSON(GENERATED_DOCUMENTS_KEY, documents);

return documents;

}
