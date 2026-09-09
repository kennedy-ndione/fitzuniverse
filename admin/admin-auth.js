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

console.error(error);
window.location.href = "login.html";

}

});
