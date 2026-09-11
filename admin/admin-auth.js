/**
* ============================================================
* Control Center — la porte d'entrée (garde d'accès)
* ============================================================
*
* Chargée par CHAQUE page de admin/. Deux responsabilités, et deux
* seulement :
*
*   1. renvoyer à la connexion qui n'est pas un administrateur actif ;
*   2. RETIRER du DOM ce qui est réservé au propriétaire, sur toutes les
*      pages à la fois (lot ADMIN, 2026-09-09).
*
* Le point 2 vit ici et pas dans chaque page : le lien « Administrateurs »
* de la barre latérale est répété dans une vingtaine de fichiers, et une
* garde qu'il faut penser à recopier est une garde qu'on oubliera. Le
* rôle lui-même est lu par admin/admin-role.js, qui mémorise sa promesse
* — trois modules qui l'importent ne font qu'UNE lecture Firestore.
* ============================================================
*/

import { auth } from "../firebase-config.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import { chargerAdmin, appliquerRole } from "./admin-role.js";
// Lot CONTRÔLES-UNIFIÉS (2026-09-11) : les <select> du Control Center
// étaient natifs (un habillage appearance:base-select ne valait que sur
// Chrome 135+). Même composant que le site, chargé par le seul module
// commun à toutes les pages admin ; les selects créés plus tard sont
// rattrapés par son observateur.
import { initFitzSelects } from "../js/fitz-select.js";
initFitzSelects();

onAuthStateChanged(auth, async (user) => {

if (!user) {
window.location.href = "login.html";
return;
}

try {

const administrateur = await chargerAdmin();

// Pas de document `admins`, ou document désactivé : la porte est
// fermée, et on déconnecte pour ne pas laisser une session à moitié
// ouverte sur une page d'administration.
if (!administrateur) {
await auth.signOut();
window.location.href = "login.html";
return;
}

// Retiré, jamais masqué : un lien caché reste dans la tabulation et
// dans un Ctrl+F, et il annoncerait à un collègue une capacité qu'il
// n'a pas.
appliquerRole(administrateur.superAdmin);

} catch (error) {

// ON NE DÉCONNECTE PAS SUR UNE ERREUR DE LECTURE (correctif du
// 2026-09-09). Renvoyer à login.html affirme « vous n'êtes pas
// administrateur », alors que la vérité est « on n'a pas pu le
// savoir ». Le propriétaire s'est déjà vu éjecter ainsi, sans un mot,
// et a cherché la panne du côté de son compte.
console.error("[FitzUniverse] Vos droits d'administration n'ont pas pu être lus :", error);

const loader = document.getElementById("pageLoader");
if (loader) loader.style.display = "none";

const alerte = document.createElement("div");
alerte.setAttribute("role", "alert");
alerte.style.cssText = "padding:40px;text-align:center;font:600 15px/1.5 system-ui,sans-serif;";
// textContent : un message d'erreur peut contenir n'importe quoi.
alerte.textContent = `Vos droits d'administration n'ont pas pu être vérifiés (${(error && (error.code || error.message)) || "erreur inconnue"}). Vous êtes toujours connecté — rechargez la page. Si le message revient, signalez ce code : ce n'est pas votre compte qui est en cause.`;
document.body.prepend(alerte);

}

});
