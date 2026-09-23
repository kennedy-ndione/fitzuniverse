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
// L'ALERTE « NOUVEAU MESSAGE » (2026-09-23, demande de Charles)
// ==========================================================
//
// Constaté en vrai : une étudiante a reçu un message de l'équipe et ne
// savait pas où le trouver. Le seul signal était un point rouge de 8 px
// sur la cloche. Désormais, trois signaux, sur TOUTES les pages de
// l'espace (initMessagesPanel tourne partout) :
//
//  1. une carte « Nouveau message de l'équipe FitzUniverse » avec
//     l'extrait du message et un bouton « Lire le message » — à
//     l'ouverture de la page s'il y a du non-lu, et en direct quand un
//     message arrive ;
//  2. la cloche porte le NOMBRE de messages non lus (plus un simple
//     point) et s'agite à l'arrivée d'un message ;
//  3. l'onglet du navigateur affiche « (1) » devant le titre.
//
// « Plus tard » range la carte pour ce message-là seulement (mémoire de
// l'onglet) : un message plus récent la fait revenir, et la cloche garde
// son compteur tant que rien n'est lu. Sur messages.html, la carte ne
// s'affiche jamais : la page ouverte EST la conversation.

const CLE_ALERTE_RANGEE = "fitzAlerteMessageRangee";
const TITRE_ORIGINAL = typeof document !== "undefined" ? document.title : "";

const ICONE_CLOCHE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/></svg>`;

const ICONE_FERMER = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;

function surLaPageMessages() {
return /\/messages\.html$/.test(window.location.pathname);
}

function lireRangee() {
try { return sessionStorage.getItem(CLE_ALERTE_RANGEE) || ""; } catch { return ""; }
}

function ranger(id) {
try { sessionStorage.setItem(CLE_ALERTE_RANGEE, id); } catch { /* onglet privé : la carte reviendra, rien de grave */ }
}

function extrait(texte, max = 110) {
const t = String(texte || "").replace(/\s+/g, " ").trim();
return t.length > max ? `${t.slice(0, max - 1).trimEnd()}…` : t;
}

function retirerAlerte() {
document.querySelector(".messages-alerte")?.remove();
}

function montrerAlerte(nonLus) {

const dernier = nonLus[nonLus.length - 1];

let carte = document.querySelector(".messages-alerte");

if (!carte) {
carte = document.createElement("div");
carte.className = "messages-alerte";
carte.setAttribute("role", "status");
carte.setAttribute("aria-live", "polite");
carte.innerHTML = `
<span class="messages-alerte-icone">${ICONE_CLOCHE}</span>
<div class="messages-alerte-texte">
<strong></strong>
<span class="messages-alerte-extrait"></span>
</div>
<div class="messages-alerte-actions">
<a href="messages.html" class="messages-alerte-lire">Lire le message</a>
<button type="button" class="messages-alerte-plus-tard">Plus tard</button>
</div>
<button type="button" class="messages-alerte-fermer" aria-label="Fermer l'alerte">${ICONE_FERMER}</button>
`;
const rangerLaCarte = () => {
ranger(carte.dataset.messageId || "");
retirerAlerte();
};
carte.querySelector(".messages-alerte-plus-tard").addEventListener("click", rangerLaCarte);
carte.querySelector(".messages-alerte-fermer").addEventListener("click", rangerLaCarte);
document.body.appendChild(carte);
}

carte.dataset.messageId = dernier.id;
carte.querySelector("strong").textContent = nonLus.length > 1
? `${nonLus.length} nouveaux messages de l'équipe FitzUniverse`
: "Nouveau message de l'équipe FitzUniverse";
carte.querySelector(".messages-alerte-extrait").textContent = `« ${extrait(dernier.text)} »`;
carte.querySelector(".messages-alerte-lire").textContent = nonLus.length > 1 ? "Lire les messages" : "Lire le message";

}

/**
* Les trois signaux, recalculés à chaque changement du fil.
* @param {Array} messages      le fil complet
* @param {Object} ui           { bellBtn, bellDot, panelOuvert:boolean }
* @param {string|null} idPrecedent  le dernier non-lu connu avant ce changement
* @returns {string|null}       le dernier non-lu connu après
*/
function signalerNonLus(messages, { bellBtn, bellDot, panelOuvert }, idPrecedent) {

const nonLus = messages.filter((m) => !m.read && m.fromStudent !== true);
const n = nonLus.length;

// 2. La cloche : un compteur, lisible, plutôt qu'un point.
bellDot.hidden = n === 0;
bellDot.textContent = n > 9 ? "9+" : String(n);
bellDot.classList.toggle("is-compteur", n > 0);
bellBtn.setAttribute("aria-label", n ? `Messages — ${n} non lu${n > 1 ? "s" : ""}` : "Messages");

// 3. L'onglet du navigateur.
document.title = n ? `(${n}) ${TITRE_ORIGINAL}` : TITRE_ORIGINAL;

if (!n) {
retirerAlerte();
return null;
}

const dernier = nonLus[n - 1];

// Un message VRAIMENT nouveau depuis l'ouverture de la page : la
// cloche s'agite (une fois, et jamais pour qui a demandé moins de
// mouvement — voir css/journey-shell.css).
if (idPrecedent !== null && dernier.id !== idPrecedent) {
bellBtn.classList.remove("is-sonne");
void bellBtn.offsetWidth;
bellBtn.classList.add("is-sonne");
}

// 1. La carte — sauf sur la page Messages, panneau ouvert, ou carte
// rangée pour ce message précis.
if (!surLaPageMessages() && !panelOuvert && lireRangee() !== dernier.id) {
montrerAlerte(nonLus);
} else if (panelOuvert) {
retirerAlerte();
}

return dernier.id;

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

// null = premier passage (pas d'agitation de la cloche à l'ouverture de
// la page : la carte suffit), puis l'id du dernier non-lu connu.
let dernierNonLu = null;
let premierPassage = true;

subscribeThread(uid, (nextMessages) => {

messages = nextMessages;

renderThread(list, messages, { canReply });

const suivant = signalerNonLus(messages, { bellBtn, bellDot, panelOuvert: !panel.hidden }, premierPassage ? null : (dernierNonLu || ""));
dernierNonLu = suivant;
premierPassage = false;

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
retirerAlerte();
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
