/**
* ============================================================
* FitzUniverse — panneau de messages étudiant (Module 3)
* ============================================================
*
* Contrepartie côté étudiant de admin/student-detail.js : lit les
* messages qu'un administrateur a envoyés à l'utilisateur connecté
* (users/{uid}/messages) et permet de les marquer comme lus. Appelée
* depuis dashboard.js une fois l'utilisateur authentifié.
* ============================================================
*/

import { db } from "../firebase-config.js";

import {
collection,
query,
orderBy,
getDocs,
doc,
updateDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

function formatDate(timestamp) {

if (!timestamp || typeof timestamp.toDate !== "function") return "";

return timestamp.toDate().toLocaleDateString("fr-FR");

}

export async function initMessagesPanel(uid) {

const bellBtn = document.getElementById("messagesBellBtn");
const bellDot = document.getElementById("messagesBellDot");
const panel = document.getElementById("messagesPanel");
const list = document.getElementById("messagesPanelList");

if (!bellBtn || !panel || !list) return;

async function loadMessages() {

const messagesQuery = query(
collection(db, "users", uid, "messages"),
orderBy("createdAt", "desc")
);

const snapshot = await getDocs(messagesQuery);

return snapshot.docs.map((docSnap) => ({
id: docSnap.id,
...docSnap.data()
}));

}

function renderList(messages) {

list.innerHTML = "";

if (!messages.length) {
list.innerHTML = `<p class="messages-panel-empty">Vous êtes à jour : aucun message pour le moment.</p>`;
return;
}

messages.forEach((message) => {

const item = document.createElement("div");
item.className = message.read ? "messages-panel-item" : "messages-panel-item is-unread";

item.innerHTML = `<p></p><span></span>`;
item.querySelector("p").textContent = message.text;
item.querySelector("span").textContent = formatDate(message.createdAt);

if (!message.read) {

item.addEventListener("click", async () => {

try {

await updateDoc(doc(db, "users", uid, "messages", message.id), { read: true });
item.classList.remove("is-unread");
updateDot(messages);

} catch (error) {

console.error("Impossible de marquer le message comme lu :", error);

}

});

}

list.appendChild(item);

});

}

function updateDot(messages) {
const unreadCount = messages.filter((m) => !m.read).length;
bellDot.hidden = unreadCount === 0;
}

let messages = [];

try {
messages = await loadMessages();
} catch (error) {
console.error("Impossible de charger les messages :", error);
return;
}

renderList(messages);
updateDot(messages);

bellBtn.addEventListener("click", () => {

const isOpen = !panel.hidden;

panel.hidden = isOpen;
bellBtn.setAttribute("aria-expanded", String(!isOpen));

});

document.addEventListener("click", (event) => {

if (!panel.hidden && !event.target.closest(".messages-bell-wrap")) {
panel.hidden = true;
bellBtn.setAttribute("aria-expanded", "false");
}

});

}
