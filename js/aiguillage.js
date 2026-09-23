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
import { lireMemoire } from "./diagnostic-garde.js";
import { trackEvent } from "./analytics.js";

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

brancherDiagnostic(session.userData);
rendreOffres(session.userData);

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

// ==========================================================
// L'ESPACE GRATUIT SAIT QUOI FAIRE (2026-09-23)
// ==========================================================

/**
* Les réponses d'un diagnostic déjà fait : d'abord celles que le compte
* garde (`users/{uid}.diagnostic`, écrit par results.js), à défaut la
* mémoire locale de ce navigateur (js/diagnostic-garde.js). null sinon.
*/
function diagnosticDejaFait(userData) {
const duCompte = userData && userData.diagnostic;
if (duCompte && typeof duCompte === "object" && Object.keys(duCompte).length) return duCompte;
return lireMemoire();
}

/**
* Bloc 01. Pas encore fait : UN bouton, droit aux questions — pas de
* page d'introduction à traverser. Déjà fait : « Revoir mes résultats »
* recharge les réponses dans la session de cet onglet (results.html ne
* lit que sessionStorage) avant d'y aller, et « Le refaire » apparaît.
*/
function brancherDiagnostic(userData) {

const bouton = document.getElementById("accueilDiagBtn");
if (!bouton) return;

const reponses = diagnosticDejaFait(userData);

if (reponses) {
const titre = document.getElementById("accueilDiagTitre");
const texte = document.getElementById("accueilDiagTexte");
const refaire = document.getElementById("accueilDiagRefaire");
if (titre) titre.textContent = "Votre diagnostic est fait";
if (texte) texte.textContent = "Revoyez vos résultats : les bourses et les pays à votre portée, et ce qu'il faut faire ensuite.";
bouton.href = "results.html";
bouton.innerHTML = `<i data-lucide="list-checks"></i><span>Revoir mes résultats</span>`;
if (refaire) refaire.hidden = false;
bouton.addEventListener("click", () => {
try { sessionStorage.setItem("eligibilityResponses", JSON.stringify(reponses)); } catch { /* results.html renverra au début du diagnostic */ }
});
}

bouton.addEventListener("click", (evenement) => {
const destination = bouton.href;
evenement.preventDefault();
const partir = () => { window.location.href = destination; };
// Le compteur ne retient jamais la navigation plus d'une seconde.
Promise.race([
Promise.resolve(trackEvent("espace_gratuit_diagnostic", { dejaFait: !!reponses })).catch(() => {}),
new Promise((resoudre) => setTimeout(resoudre, 1000))
]).finally(partir);
});

}

const formaterPrix = (n) => Number(n).toLocaleString("fr-FR").replace(/[\u202f\u00a0]/g, "\u00a0");

/**
* Bloc 02. Les offres EN VENTE (ni `deprecated`, ni hors catalogue),
* lues dans pricing-plans.js — la seule source des prix : aucun montant
* n'est recopié ici. Deux groupes, dans l'ordre du fichier. Un clic mène
* droit à payment.html?plan=…, qui revalide l'offre (isSellablePlan).
*/
function rendreOffres(userData) {

const hote = document.getElementById("accueilOffresListe");
const plans = window.SCHOLARBRIDGE_PLANS;
if (!hote || !plans) return;   // repli : les deux liens « Comparer » restent

const enVente = Object.values(plans).filter((p) => p && p.id && !p.deprecated && typeof p.priceFCFA === "number");

const groupes = [
{ parcours: "bourse", titre: "Candidater à des bourses" },
{ parcours: "preinscription", titre: "Partir en finançant vos études (France)" }
];

const echapper = (t) => String(t || "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[c]));

hote.innerHTML = groupes.map(({ parcours, titre }) => {

const offres = enVente.filter((p) => p.parcours === parcours);
if (!offres.length) return "";

return `
<div class="jy-offres-groupe">
<h3 class="jy-offres-titre">${echapper(titre)}</h3>
<div class="jy-offres">
${offres.map((p) => {
const prix = typeof window.prixAvecDeduction === "function" ? window.prixAvecDeduction(p.id, userData) : null;
const montant = prix ? prix.prix : p.priceFCFA;
const duree = p.duration ? ` · ${echapper(p.duration)}` : "";
return `
<a class="jy-offre${p.niveau === "recommande" ? " is-recommandee" : ""}" href="payment.html?plan=${encodeURIComponent(p.id)}" data-offre="${echapper(p.id)}">
<span class="jy-offre-nom">${echapper(p.label)}</span>
<span class="jy-offre-prix"><strong>${formaterPrix(montant)}</strong> F CFA${duree}</span>
<span class="jy-offre-texte">${echapper(p.tagline)}</span>
<span class="jy-offre-cta">${echapper(p.cta || "Choisir")}<i data-lucide="arrow-right"></i></span>
</a>`;
}).join("")}
</div>
</div>`;

}).join("");

hote.querySelectorAll("[data-offre]").forEach((lien) => {
lien.addEventListener("click", (evenement) => {
evenement.preventDefault();
const partir = () => { window.location.href = lien.href; };
Promise.race([
Promise.resolve(trackEvent("espace_gratuit_offre", { plan: lien.dataset.offre })).catch(() => {}),
new Promise((resoudre) => setTimeout(resoudre, 1000))
]).finally(partir);
});
});

}
