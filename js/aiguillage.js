/**
* ============================================================
* Fitz — l'aiguillage de dashboard.html (lot S4)
* ============================================================
*
* dashboard.html N'EST PLUS UN HUB : c'est l'adresse historique de
* l'espace étudiant, et elle le reste. Trop de choses y pointent — liens
* internes, redirections après paiement, marque-pages, habitudes,
* js/admin-access.js — pour qu'on la supprime. Elle aiguille :
*
*   bourse          → espace-bourse.html
*   preinscription  → espace-preinscription.html
*   les-deux        → le dernier espace ouvert, à défaut les bourses
*   aucun           → ELLE RESTE, et rend un accueil minimal
*   Pass Découverte seul → ai-chat.html (lot ACCEPTATION, partie 4) —
*                     décidé AVANT tout rendu par bootstrapShell (passSeul,
*                     js/plan-features.js), ce fichier ne le voit jamais.
*
* LE DERNIER CAS EST CELUI QUI COMPTE. Un compte gratuit connecté n'a
* pas d'accompagnement, mais il a un profil, un compte, des messages, et
* le droit d'y accéder. L'expédier sur la page d'offres serait le punir
* d'exister — et l'enfermer dans une boucle le jour où il voudrait
* seulement changer son mot de passe.
*
* On ne redirige qu'APRÈS avoir résolu la session : pas de renvoi à
* l'aveugle, et un échec de résolution laisse l'accueil minimal plutôt
* qu'une page blanche.
* ============================================================
*/

import { initShellChrome, bootstrapShell, lireEspaceChoisi } from "./app-shell.js";
import { resoudreEspace, HUB_ESPACE } from "./access-guard.js";

initShellChrome();

bootstrapShell().then((session) => {

if (!session) return;

const espace = resoudreEspace(session);

if (espace === "les-deux") {
window.location.replace(HUB_ESPACE[lireEspaceChoisi() || "bourse"]);
return;
}

if (espace === "bourse" || espace === "preinscription") {
window.location.replace(HUB_ESPACE[espace]);
return;
}

// « aucun » : on reste, et on accueille.
const nom = (session.profile && session.profile.name) || session.userData.name || session.user.displayName || "";
const salutation = document.getElementById("welcomeMessage");
if (salutation) salutation.textContent = nom ? `Bonjour ${String(nom).split(" ")[0]}` : "Bonjour";

const accueil = document.getElementById("accueilMinimal");
if (accueil) accueil.hidden = false;

if (window.lucide) lucide.createIcons();

});
