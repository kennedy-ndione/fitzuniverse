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

demasquerLesPhases();

if (window.lucide) lucide.createIcons();

}).catch((erreur) => {

// L'ACCUEIL NE RESTE JAMAIS REPLIÉ SUR UNE ERREUR — même raison que
// le .catch de dashboard.js : un rendu à moitié fait doit au moins
// être lisible. Sans cela, une session qui échoue à se résoudre
// laisse une page qui ne porte qu'un « Bonjour ».
console.error("L'aiguillage n'a pas abouti :", erreur);
const accueil = document.getElementById("accueilMinimal");
if (accueil) accueil.hidden = false;
demasquerLesPhases();

});

/**
* LE DÉFAUT DU 2026-09-20, CONSTATÉ SUR UN COMPTE GRATUIT RÉEL.
*
* css/journey.css replie tout le contenu des phases tant que le <body>
* ne porte pas `data-parcours-pret` :
*
*   body:not([data-parcours-pret]) .jy-phase > *:not(.jy-phase-head)
*   { display: none }
*
* C'est un garde-fou légitime : il évite que les six phases s'affichent
* dépliées, puis s'effondrent sous les yeux de l'étudiant pendant les
* deux allers-retours réseau du hub. Mais l'attribut n'était levé qu'aux
* deux points de sortie de dashboard.js — c'est-à-dire dans la chaîne du
* hub ACCOMPAGNÉ. L'accueil minimal, que ce fichier démasque justement
* pour les comptes SANS accompagnement, ne passait jamais par là.
*
* Résultat à l'écran : « Bonjour », puis « 01 Votre compte est prêt » et
* « 02 Deux accompagnements, deux parcours », deux titres nus. Pas une
* phrase, pas un bouton, pas une porte — alors que la page promet, juste
* au-dessus, que « votre prochaine action est juste en dessous ».
*
* Le repli est un état TRANSITOIRE : toute branche qui finit de peindre
* doit le lever, celle-ci comprise.
*/
function demasquerLesPhases() {
document.body.dataset.parcoursPret = "1";
}
