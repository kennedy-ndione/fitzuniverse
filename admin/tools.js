// ============================================
// Fitz Control Center — page Outils techniques (2026-09-02)
// Page statique : elle liste l'outillage vivant sans rien lire de
// plus dans Firestore (admin-auth.js fait la seule lecture, celle du
// document admins/{uid}).
//
// Lot ADMIN-MÉNAGE (2026-09-20) : la liste des ~28 pages
// « expand-catalog-batch » a disparu avec les pages elles-mêmes, qui ne
// sont plus déployées (firebase.json, hosting.ignore). Ce fichier ne
// fait plus que retirer le loader et brancher la déconnexion.
// ============================================

import { auth } from "../firebase-config.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import { initSidebarToggle } from "./sidebar-toggle.js";
import { hidePageLoader } from "../js/app-shell.js";
import { initLogout } from "./deconnexion.js";

initSidebarToggle();
initLogout();

// La page ne montre son contenu qu'une fois la session admin
// confirmée (admin-auth.js redirige les non-admins ; ici on attend
// simplement un utilisateur pour retirer le loader).
onAuthStateChanged(auth, (user) => {

if (!user) return;

if (window.lucide) lucide.createIcons();

hidePageLoader();

});
