// ============================================
// Fitz Control Center — centre de messages (2026-09-02)
// ============================================
// La messagerie FitzUniverse bidirectionnelle : l'administrateur voit
// toutes les conversations (une par étudiant), répond depuis ici, et
// chaque message part signé « FitzUniverse » côté étudiant — jamais
// l'adresse personnelle de l'admin (voir sendMessageToUser).
// Contreparties : js/student-messages.js (cloche étudiante) et
// firestore.rules (users/{uid}/messages).
//
// TEMPS RÉEL (2ᵉ passe 2026-09-02) : le fil OUVERT est écouté via
// onSnapshot — les réponses étudiantes apparaissent instantanément,
// sans recharger, et sont marquées lues à l'arrivée tant que le fil
// est affiché. La liste de conversations, elle, se met à jour à
// l'ouverture de la page et au fil des événements du fil actif.
//
// COÛT : getAllUsers (N lectures) + 2 requêtes légères par étudiant
// (dernier message + compteur d'agrégation des non-lus) au chargement,
// puis l'écoute du fil ouvert (lecture initiale + documents nouveaux
// uniquement). Raisonnable à l'échelle actuelle ; à revoir (requête
// collectionGroup + index) au-delà de quelques centaines d'étudiants.
// ============================================

import { auth, db } from "../firebase-config.js";

import {
onAuthStateChanged,
signOut
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
doc,
getDoc,
collection,
query,
orderBy,
onSnapshot,
limit,
updateDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import {
getAllUsers,
getLatestMessage,
getUnreadStudentMessagesCount,
markUserMessageRead,
sendMessageToUser
} from "./firebase-admin.js";

import { initSidebarToggle } from "./sidebar-toggle.js";
import { PLAN_LABELS } from "../js/plan-features.js";
import { resolvePlan } from "../js/access-guard.js";
import { hidePageLoader } from "../js/app-shell.js";
import { trackEvent } from "../js/analytics.js";

initSidebarToggle();

let currentAdmin = null;
let conversations = [];
let activeUid = null;

// Désabonnement de l'écoute du fil actif (une seule écoute à la fois).
let threadUnsubscribe = null;

// ==========================================================
// Aides
// ==========================================================

function studentName(user) {

// Même champ que admin/students.js (colonne « Étudiant ») : les
// documents users portent "name".
return user.name || (user.email ? user.email.split("@")[0] : "Étudiant");

}

function initials(name) {

const parts = String(name).trim().split(/\s+/).filter(Boolean);
if (!parts.length) return "?";
return (parts[0][0] + (parts[1] ? parts[1][0] : "")).toUpperCase();

}

function formatWhen(timestamp) {

if (!timestamp || typeof timestamp.toDate !== "function") return "";

const date = timestamp.toDate();
const diffMin = Math.round((Date.now() - date.getTime()) / 60000);

if (diffMin < 1) return "à l'instant";
if (diffMin < 60) return `il y a ${diffMin} min`;
if (diffMin < 1440) return `il y a ${Math.round(diffMin / 60)} h`;

return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });

}

// ==========================================================
// Liste des conversations
// ==========================================================

async function loadConversations() {

const users = await getAllUsers();

conversations = await Promise.all(users.map(async (user) => {

const [latest, unread] = await Promise.all([
getLatestMessage(user.uid),
getUnreadStudentMessagesCount(user.uid)
]);

return { user, latest, unread };

}));

// Fils actifs d'abord (dernier message le plus récent), puis les
// étudiants encore jamais contactés, par ordre alphabétique.
conversations.sort((a, b) => {

const ta = a.latest && a.latest.createdAt ? a.latest.createdAt.toMillis() : 0;
const tb = b.latest && b.latest.createdAt ? b.latest.createdAt.toMillis() : 0;

if (ta !== tb) return tb - ta;

return studentName(a.user).localeCompare(studentName(b.user), "fr");

});

}

function renderConversationList(filterText = "") {

const container = document.getElementById("convList");
container.innerHTML = "";

const needle = filterText.trim().toLowerCase();

const visible = conversations.filter(({ user }) => {
if (!needle) return true;
return studentName(user).toLowerCase().includes(needle) ||
(user.email || "").toLowerCase().includes(needle);
});

if (!visible.length) {
container.innerHTML = `<p class="msg-conv-empty">Aucun étudiant ne correspond à cette recherche.</p>`;
return;
}

visible.forEach((conv) => {

const { user, latest, unread } = conv;
const name = studentName(user);

const item = document.createElement("button");
item.type = "button";
item.className = `msg-conv-item${user.uid === activeUid ? " is-active" : ""}${unread > 0 ? " has-unread" : ""}`;

item.innerHTML = `
<span class="msg-conv-avatar"></span>
<span class="msg-conv-body">
<span class="msg-conv-toprow"><strong></strong><time></time></span>
<span class="msg-conv-preview"></span>
</span>
<span class="msg-conv-unread" hidden></span>
`;

item.querySelector(".msg-conv-avatar").textContent = initials(name);
item.querySelector("strong").textContent = name;
item.querySelector("time").textContent = latest ? formatWhen(latest.createdAt) : "";

const preview = item.querySelector(".msg-conv-preview");

if (latest) {
preview.textContent = `${latest.fromStudent === true ? name.split(" ")[0] : "FitzUniverse"} : ${latest.text}`;
} else {
preview.textContent = "Aucun message — écrivez le premier.";
}

const unreadBadge = item.querySelector(".msg-conv-unread");

if (unread > 0) {
unreadBadge.hidden = false;
unreadBadge.textContent = unread > 9 ? "9+" : String(unread);
}

item.addEventListener("click", () => openThread(user.uid));

container.appendChild(item);

});

}

function updateNavBadge() {

const badge = document.getElementById("navUnreadBadge");
if (!badge) return;

const total = conversations.reduce((sum, c) => sum + (c.unread || 0), 0);

badge.hidden = total === 0;
badge.textContent = total > 9 ? "9+" : String(total);

}

// ==========================================================
// Fil de conversation
// ==========================================================

function renderThreadMessages(conv, messages) {

const scroll = document.getElementById("threadScroll");
scroll.innerHTML = "";

if (!messages.length) {

scroll.innerHTML = `<p class="msg-thread-empty">Aucun message avec cet étudiant pour le moment — écrivez le premier, il le recevra dans son espace, signé FitzUniverse.</p>`;

} else {

const firstName = studentName(conv.user).split(" ")[0];

messages.forEach((message) => {

const fromStudent = message.fromStudent === true;

const row = document.createElement("div");
row.className = `msg-bubble-row ${fromStudent ? "is-student" : "is-team"}`;

row.innerHTML = `
<span class="msg-bubble-author"></span>
<div class="msg-bubble"><p></p></div>
<span class="msg-bubble-date"></span>
`;

row.querySelector(".msg-bubble-author").textContent = fromStudent ? firstName : "FitzUniverse";
row.querySelector("p").textContent = message.text;
row.querySelector(".msg-bubble-date").textContent = formatWhen(message.createdAt);

scroll.appendChild(row);

});

}

scroll.scrollTop = scroll.scrollHeight;

}

async function openThread(uid) {

activeUid = uid;

const conv = conversations.find((c) => c.user.uid === uid);
if (!conv) return;

const name = studentName(conv.user);
// resolvePlan gère l'expiration d'abonnement — même résolution que
// partout ailleurs dans l'admin, jamais le champ brut.
const planId = resolvePlan(conv.user);

document.getElementById("threadPlaceholder").hidden = true;
document.getElementById("threadView").hidden = false;

document.getElementById("threadAvatar").textContent = initials(name);
document.getElementById("threadName").textContent = name;
document.getElementById("threadMeta").textContent =
`${conv.user.email || ""} · Formule ${PLAN_LABELS[planId] || planId}`;
document.getElementById("threadProfileLink").href = `student-detail.html?uid=${uid}`;

renderConversationList(document.getElementById("convSearchInput").value);

// TEMPS RÉEL : une seule écoute à la fois — on ferme celle du fil
// précédent avant d'attacher la nouvelle.
if (threadUnsubscribe) {
threadUnsubscribe();
threadUnsubscribe = null;
}

const threadQuery = query(
collection(db, "users", uid, "messages"),
orderBy("createdAt", "asc")
);

threadUnsubscribe = onSnapshot(threadQuery, (snapshot) => {

// L'admin a pu changer de fil entre l'attache et cet événement.
if (activeUid !== uid) return;

const messages = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));

renderThreadMessages(conv, messages);

conv.latest = messages[messages.length - 1] || null;

// Le fil affiché vaut lecture : toute réponse étudiante qui arrive
// est marquée lue immédiatement (le snapshot suivant, déclenché par
// cette écriture, ne trouvera plus rien à marquer).
const unreadStudentMessages = messages.filter((m) => m.fromStudent === true && !m.read);

if (unreadStudentMessages.length) {
Promise.all(unreadStudentMessages.map((m) => markUserMessageRead(uid, m.id)))
.catch((error) => console.error("Impossible de marquer les réponses comme lues :", error));
}

conv.unread = 0;
renderConversationList(document.getElementById("convSearchInput").value);
updateNavBadge();

}, (error) => {
console.error("Écoute du fil impossible :", error);
});

if (window.lucide) lucide.createIcons();

}

// ==========================================================
// Signalements — « Signaler un problème » (grille A, 2026-09-07).
// Service après-vente écrit par l'étudiant dans supportTickets
// (js/support-ticket.js) ; l'admin le lit ici et le marque traité.
// Temps réel, 50 derniers.
// ==========================================================

const SUJETS_SUPPORT = { paiement: "Paiement", technique: "Problème technique", site: "Erreur sur le site" };

function escapeHtml(s) {
return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function initSupportTickets() {

const bloc = document.getElementById("supportList");
const items = document.getElementById("supportItems");
const count = document.getElementById("supportCount");
if (!bloc || !items) return;

const q = query(collection(db, "supportTickets"), orderBy("createdAt", "desc"), limit(50));

onSnapshot(q, (snapshot) => {

const tickets = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
const nouveaux = tickets.filter((t) => t.status === "nouveau");

bloc.hidden = tickets.length === 0;
count.hidden = nouveaux.length === 0;
count.textContent = String(nouveaux.length);

items.innerHTML = tickets.map((t) => `
<article class="msg-support-item${t.status === "nouveau" ? " is-new" : ""}">
<div class="msg-support-meta">
<strong>${escapeHtml(t.name || t.email || t.uid)}</strong>
<span>${escapeHtml(SUJETS_SUPPORT[t.sujet] || t.sujet || "")} · ${t.createdAt ? escapeHtml(formatWhen(t.createdAt)) : "à l'instant"}</span>
</div>
<p>${escapeHtml(t.texte || "")}</p>
<div class="msg-support-actions">
<a href="student-detail.html?uid=${encodeURIComponent(t.uid)}" class="table-link-btn"><i data-lucide="user-round"></i><span>Fiche</span></a>
${t.status === "nouveau"
? `<button type="button" class="table-link-btn" data-support-traite="${t.id}"><i data-lucide="check"></i><span>Marquer traité</span></button>`
: `<span class="msg-support-done">Traité</span>`}
</div>
</article>`).join("");

if (window.lucide) lucide.createIcons();

}, (error) => {
console.error("Écoute des signalements impossible :", error);
});

items.addEventListener("click", async (event) => {
const bouton = event.target.closest("[data-support-traite]");
if (!bouton) return;
bouton.disabled = true;
try {
await updateDoc(doc(db, "supportTickets", bouton.dataset.supportTraite), { status: "traite", traiteLe: serverTimestamp() });
} catch (error) {
console.error("Impossible de marquer le signalement traité :", error);
bouton.disabled = false;
}
});

}

// ==========================================================
// Envoi
// ==========================================================

function initComposer() {

const form = document.getElementById("threadComposer");
const textarea = document.getElementById("threadComposerText");
const sendBtn = document.getElementById("threadComposerSend");

form.addEventListener("submit", async (event) => {

event.preventDefault();

const text = textarea.value.trim();
if (!text || !activeUid || sendBtn.disabled) return;

sendBtn.disabled = true;

try {

await sendMessageToUser(activeUid, currentAdmin.uid, currentAdmin.email, text);

trackEvent("admin_message_sent", {});

textarea.value = "";

// Rien à rafraîchir à la main : l'écoute temps réel du fil actif
// rend le message (et met la liste à jour) dès sa confirmation.

} catch (error) {

console.error("Envoi impossible :", error);
alert("Le message n'est pas parti. Vérifiez votre connexion, puis réessayez.");

} finally {

sendBtn.disabled = false;
textarea.focus();

}

});

textarea.addEventListener("keydown", (event) => {
if (event.key === "Enter" && !event.shiftKey) {
event.preventDefault();
form.requestSubmit();
}
});

}

// ==========================================================
// Chargement principal
// ==========================================================

onAuthStateChanged(auth, async (user) => {

if (!user) {
window.location.href = "login.html";
return;
}

try {

const adminSnap = await getDoc(doc(db, "admins", user.uid));

if (!adminSnap.exists() || adminSnap.data().isActive !== true) {
await signOut(auth);
window.location.href = "login.html";
return;
}

currentAdmin = { uid: user.uid, email: user.email };

await loadConversations();

renderConversationList();
updateNavBadge();
initComposer();
initSupportTickets();

const searchInput = document.getElementById("convSearchInput");
searchInput.addEventListener("input", () => renderConversationList(searchInput.value));

// ?uid=... : arrivée directe depuis une fiche étudiant.
const requestedUid = new URLSearchParams(window.location.search).get("uid");
if (requestedUid && conversations.some((c) => c.user.uid === requestedUid)) {
await openThread(requestedUid);
}

if (window.lucide) lucide.createIcons();

hidePageLoader();

} catch (error) {

console.error("Erreur de chargement du centre de messages :", error);

const content = document.querySelector(".content");

if (content) {
content.style.display = "";
content.innerHTML = `
<div style="padding:40px;text-align:center;">
<h2>Impossible de charger les messages</h2>
<p>Vérifiez votre connexion Internet, puis réessayez.</p>
<button onclick="window.location.reload()">Réessayer</button>
</div>
`;
}

const pageLoader = document.getElementById("pageLoader");
if (pageLoader) pageLoader.style.display = "none";

}

});

// ==========================================================
// Déconnexion
// ==========================================================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

logoutBtn.addEventListener("click", async () => {

if (logoutBtn.dataset.busy === "true") return;
logoutBtn.dataset.busy = "true";

try {

await signOut(auth);
window.location.href = "login.html";

} catch (error) {

console.error(error);
alert("Erreur lors de la déconnexion.");
logoutBtn.dataset.busy = "false";

}

});

}
