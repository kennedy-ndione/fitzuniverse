// ============================================
// Fitz Control Center — page Outils techniques (2026-09-02)
// Page statique : elle liste l'outillage existant sans rien lire de
// plus dans Firestore (admin-auth.js fait la seule lecture, celle du
// document admins/{uid}). Les pages de lots historiques ne sont pas
// supprimées : elles restent accessibles ici, hors de la navigation
// principale.
// ============================================

import { auth } from "../firebase-config.js";

import {
onAuthStateChanged,
signOut
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import { initSidebarToggle } from "./sidebar-toggle.js";
import { hidePageLoader } from "../js/app-shell.js";

initSidebarToggle();

// Lots réellement présents dans admin/ (les numéros 24 et 27 n'ont
// jamais existé en page HTML — exécutés autrement).
const BATCH_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 25, 26, 28, 29, 30];

function renderBatchList() {

const container = document.getElementById("batchList");
container.innerHTML = "";

BATCH_NUMBERS.forEach((n) => {

const link = document.createElement("a");
link.className = "tool-link";
link.href = `expand-catalog-batch${n}.html`;
link.textContent = `Lot ${n}`;

container.appendChild(link);

});

}

// La page ne montre son contenu qu'une fois la session admin
// confirmée (admin-auth.js redirige les non-admins ; ici on attend
// simplement un utilisateur pour retirer le loader).
onAuthStateChanged(auth, (user) => {

if (!user) return;

renderBatchList();

if (window.lucide) lucide.createIcons();

hidePageLoader();

});

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
