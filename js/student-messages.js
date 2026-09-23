/**
* ============================================================
* FitzUniverse — messagerie étudiante (cloche + page Messages)
* ============================================================
*
* REFONTE 2026-09-02 (2ᵉ passe) : la messagerie passe en TEMPS RÉEL.
* Le fil users/{uid}/messages est écouté via onSnapshot : un message
* envoyé par l'équipe depuis le Control Center apparaît instantanément
* chez l'étudiant (cloche ET page Messages), sans recharger — et
* inversement côté admin. Coût : l'attache initiale lit le fil une
* fois, ensuite seuls les documents NOUVEAUX/modifiés sont facturés.
*
* Deux surfaces, un seul moteur :
*  - initMessagesPanel(uid, {canReply}) — la cloche du topbar :
*    aperçu compact + composer, avec lien vers la page complète ;
*  - initMessagesPage(uid, {canReply}) — la page messages.html :
*    conversation plein écran (ids messagesPageThread /
*    messagesPageComposerHost).
*
* Signature : les messages de l'équipe sont toujours affichés
* « FitzUniverse ». Droit de réponse : fonctionnalité
* "student_messaging" (js/plan-features.js) — OUVERTE À TOUS LES COMPTES,
* gratuits compris, depuis le 2026-09-23 (DROITS_UNIVERSELS).
* Forme des réponses imposée par firestore.rules
* ({ text, fromStudent:true, createdAt, read:false }).
* ============================================================
*/

import { db } from "../firebase-config.js";

import {
collection,
query,
orderBy,
onSnapshot,
addDoc,
doc,
updateDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

function formatDate(timestamp) {

if (!timestamp || typeof timestamp.toDate !== "function") return "";

return timestamp.toDate().toLocaleDateString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

}

// ==========================================================
// Moteur partagé
// ==========================================================

// Écoute le fil en continu ; appelle callback(messages) à l'attache
// puis à CHAQUE changement. Renvoie la fonction de désabonnement.
function subscribeThread(uid, callback) {

const threadQuery = query(
collection(db, "users", uid, "messages"),
orderBy("createdAt", "asc")
);

return onSnapshot(threadQuery, (snapshot) => {

const messages = snapshot.docs.map((docSnap) => ({
id: docSnap.id,
...docSnap.data()
}));

callback(messages);

}, (error) => {
console.error("Écoute des messages impossible :", error);
});

}

function renderThread(listEl, messages, { canReply, emptyHint }) {

listEl.innerHTML = "";

if (!messages.length) {
listEl.innerHTML = `<p class="messages-panel-empty">${emptyHint || `Aucun message pour le moment. L'équipe FitzUniverse vous écrit ici${canReply ? " — et vous pouvez lui répondre" : ""}.`}</p>`;
// Le fil est rendu en temps réel, APRÈS le lucide.createIcons() de la
// page : un glyphe posé ici ne serait jamais dessiné sans ce rappel.
if (window.lucide) lucide.createIcons();
return;
}

messages.forEach((message) => {

const fromStudent = message.fromStudent === true;

const item = document.createElement("div");
item.className = [
"messages-thread-item",
fromStudent ? "is-student" : "is-team",
(!fromStudent && !message.read) ? "is-unread" : ""
].filter(Boolean).join(" ");

item.innerHTML = `
<span class="messages-thread-author"></span>
<div class="messages-thread-bubble"><p></p></div>
<span class="messages-thread-date"></span>
`;

item.querySelector(".messages-thread-author").textContent = fromStudent ? "Vous" : "FitzUniverse";
item.querySelector("p").textContent = message.text;
item.querySelector(".messages-thread-date").textContent = formatDate(message.createdAt);

listEl.appendChild(item);

});

listEl.scrollTop = listEl.scrollHeight;

}

// Marque lues toutes les réponses de l'ÉQUIPE non lues (jamais celles
// de l'étudiant — leur "read" appartient à l'admin). Silencieux.
async function markTeamMessagesRead(uid, messages) {

const unread = messages.filter((m) => !m.read && m.fromStudent !== true);

if (!unread.length) return;

try {
await Promise.all(unread.map((m) =>
updateDoc(doc(db, "users", uid, "messages", m.id), { read: true })
));
} catch (error) {
console.error("Impossible de marquer les messages comme lus :", error);
}

}

function buildComposer(uid, { canReply, compact }) {

if (!canReply) {

const locked = document.createElement("div");
locked.className = "messages-composer-locked";
// Depuis le 2026-09-23, tout compte peut écrire à l'équipe : cette
// branche ne sert plus qu'en repli (droits non résolus). Elle ne vend
// donc plus rien — elle dit quoi faire.
locked.innerHTML = `<span>La réponse n'est pas disponible pour l'instant. Rechargez la page pour écrire à l'équipe.</span>`;
return locked;

}

const composer = document.createElement("form");
composer.className = "messages-composer";
composer.innerHTML = `
<textarea rows="${compact ? 1 : 2}" maxlength="2000" placeholder="Écrire à l'équipe FitzUniverse…" aria-label="Votre message à l'équipe FitzUniverse"></textarea>
<button type="submit" aria-label="Envoyer">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
</button>
`;

const textarea = composer.querySelector("textarea");
const submitBtn = composer.querySelector("button");

composer.addEventListener("submit", async (event) => {

event.preventDefault();

const text = textarea.value.trim();
if (!text || submitBtn.disabled) return;

submitBtn.disabled = true;

try {

// Forme imposée par firestore.rules — ne rien ajouter ici sans
// mettre à jour la règle users/{uid}/messages. Le rendu suit
// automatiquement via onSnapshot : rien à rafraîchir à la main.
await addDoc(collection(db, "users", uid, "messages"), {
text,
fromStudent: true,
createdAt: serverTimestamp(),
read: false
});

textarea.value = "";

} catch (error) {

console.error("Impossible d'envoyer le message :", error);
alert("Votre message n'est pas parti. Vérifiez votre connexion, puis réessayez.");

} finally {

submitBtn.disabled = false;
textarea.focus();

}

});

// Entrée envoie, Maj+Entrée passe à la ligne — convention messagerie.
textarea.addEventListener("keydown", (event) => {
if (event.key === "Enter" && !event.shiftKey) {
event.preventDefault();
composer.requestSubmit();
}
});

return composer;

}

// ==========================================================
// Surface 1 — la cloche du topbar (toutes les pages de l'espace)
// ==========================================================

export async function initMessagesPanel(uid, options = {}) {

const canReply = options.canReply === true;

const bellBtn = document.getElementById("messagesBellBtn");
const bellDot = document.getElementById("messagesBellDot");
const panel = document.getElementById("messagesPanel");
const list = document.getElementById("messagesPanelList");

if (!bellBtn || !panel || !list) return;

// En-tête : signature du canal + lien vers la conversation complète.
const header = panel.querySelector(".messages-panel-header");
if (header) {
header.innerHTML = `<span>Messages · FitzUniverse</span><a href="messages.html" class="messages-panel-openlink">Tout ouvrir</a>`;
}

if (!panel.querySelector(".messages-composer, .messages-composer-locked")) {
panel.appendChild(buildComposer(uid, { canReply, compact: true }));
}

let messages = [];

function updateDot() {
const unreadCount = messages.filter((m) => !m.read && m.fromStudent !== true).length;
bellDot.hidden = unreadCount === 0;
}

subscribeThread(uid, (nextMessages) => {

messages = nextMessages;

renderThread(list, messages, { canReply });
updateDot();

// Panneau déjà ouvert quand un message arrive : lu immédiatement.
if (!panel.hidden) markTeamMessagesRead(uid, messages);

});

bellBtn.addEventListener("click", () => {

const isOpen = !panel.hidden;

panel.hidden = isOpen;
bellBtn.setAttribute("aria-expanded", String(!isOpen));

if (!isOpen) {
list.scrollTop = list.scrollHeight;
markTeamMessagesRead(uid, messages);
}

});

document.addEventListener("click", (event) => {

if (!panel.hidden && !event.target.closest(".messages-bell-wrap")) {
panel.hidden = true;
bellBtn.setAttribute("aria-expanded", "false");
}

});

}

// ==========================================================
// Surface 2 — la page Messages (messages.html)
// ==========================================================

export function initMessagesPage(uid, options = {}) {

const canReply = options.canReply === true;

const thread = document.getElementById("messagesPageThread");
const composerHost = document.getElementById("messagesPageComposerHost");

if (!thread || !composerHost) return;

composerHost.appendChild(buildComposer(uid, { canReply, compact: false }));

subscribeThread(uid, (messages) => {

renderThread(thread, messages, {
canReply,
// Lot CHAT-VIVANT (2026-09-19) : l'état vide était un paragraphe
// gris perdu au milieu du cadre. C'est le premier écran que voit un
// étudiant qui n'a jamais écrit — il doit dire ce qu'on peut
// demander ICI, et pas à Fitz. Chaîne littérale, écrite dans ce
// fichier : aucune donnée d'étudiant n'y entre.
emptyHint: `
<span class="messages-vide">
<i data-lucide="messages-square" aria-hidden="true"></i>
<strong>Votre conversation commence ici</strong>
<span>Une question sur votre paiement, votre formule, une erreur du site, ou quelque chose que Fitz n'a pas pu régler : écrivez-la ci-dessous. Une personne de l'équipe vous répond, et la réponse restera dans ce fil.</span>
</span>
`
});

// La page ouverte EST la conversation : tout ce qui arrive de
// l'équipe est immédiatement considéré comme lu.
markTeamMessagesRead(uid, messages);

});

}
