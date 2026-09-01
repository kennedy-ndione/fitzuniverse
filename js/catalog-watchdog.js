// -------- js/catalog-watchdog.js --------
// Filet de sécurité pour les pages de catalogue alimentées par
// Firestore (scholarships.html, et toute page qui voudra s'en servir).
//
// LE PROBLÈME QU'IL RÉSOUT (constaté le 2026-08-22)
// ------------------------------------------------
// scholarships.js est un module ES qui importe firebase-config.js,
// lequel importe à son tour quatre fichiers du SDK Firebase depuis
// https://www.gstatic.com. Si UN SEUL de ces téléchargements échoue —
// connexion coupée, réseau lent qui expire, gstatic.com bloqué par un
// pare-feu ou un opérateur — le navigateur n'exécute pas le module DU
// TOUT.
//
// Conséquence : ni le squelette de chargement, ni le bloc "Chargement
// interrompu" prévu dans le try/catch de chargerBourses() n'apparaît.
// Ces deux sécurités vivent À L'INTÉRIEUR du module qui n'a jamais
// démarré. L'étudiant voit une page qui s'affiche normalement, avec
// son en-tête, son titre et ses filtres, et une grille de bourses
// vide. Rien ne lui dit que quelque chose a échoué, ni qu'il peut
// simplement réessayer. Sur les connexions africaines visées par
// Fitz, ce cas n'a rien d'exceptionnel.
//
// POURQUOI CE FICHIER N'EST PAS UN MODULE
// ---------------------------------------
// C'est tout l'intérêt : un `<script>` classique s'exécute même quand
// les modules de la page échouent. Un module de secours aurait échoué
// exactement de la même façon que celui qu'il surveille. Il ne doit
// donc JAMAIS gagner d'`import` ni d'attribut `type="module"`.
//
// COMMENT IL DÉCIDE
// -----------------
// Le module de catalogue pose `window.__catalogueDemarre = true` dès
// sa première ligne exécutée. Après le délai de grâce :
//   - drapeau présent  -> le module tourne, il gère ses propres
//                         erreurs (y compris une grille vide légitime
//                         quand un filtre ne renvoie rien). On sort.
//   - grille remplie   -> quelque chose s'affiche déjà. On sort.
//   - ni l'un ni l'autre -> le module n'a jamais démarré. C'est le
//                         seul cas où l'on parle.
// Ce filet ne peut donc pas produire de faux message sur une page
// simplement lente : la lenteur du module n'empêche pas son drapeau.
//
// USAGE
//   <script src="js/catalog-watchdog.js"
//           data-cible="scholarship-list"
//           data-libelle="bourses"></script>

(function () {

// Large volontairement : mieux vaut un étudiant qui patiente deux
// secondes de trop qu'un message d'erreur affiché à quelqu'un dont
// le catalogue était en train d'arriver.
var DELAI_DE_GRACE = 9000;

var script = document.currentScript;
if (!script) return;

var idCible = script.getAttribute("data-cible");
var libelle = script.getAttribute("data-libelle") || "contenu";

if (!idCible) return;

setTimeout(function () {

// Le module a démarré : il est responsable de ce qui s'affiche.
if (window.__catalogueDemarre) return;

var conteneur = document.getElementById(idCible);

// Conteneur absent (page modifiée) ou déjà rempli : rien à dire.
if (!conteneur || conteneur.children.length > 0) return;

conteneur.innerHTML =
'<div class="bourses-empty-state">' +
'<div class="bourses-empty-state-icon"><i data-lucide="wifi-off"></i></div>' +
'<h3>Le catalogue n\'a pas pu se charger</h3>' +
'<p>Votre connexion semble avoir été interrompue pendant le chargement des ' + libelle + '. ' +
'Vérifiez votre connexion Internet, puis réessayez.</p>' +
'<button type="button" class="btn btn-primary" id="catalogRetryBtn">Réessayer</button>' +
'</div>';

var bouton = document.getElementById("catalogRetryBtn");
if (bouton) {
bouton.addEventListener("click", function () {
// reload() sans argument : on veut que le navigateur puisse
// resservir ce qu'il a en cache si le réseau est encore
// capricieux — un rechargement forcé échouerait à nouveau.
window.location.reload();
});
}

// Lucide vient lui aussi d'un CDN : s'il a échoué avec le reste,
// l'icône reste absente et le message se lit quand même. C'est la
// raison pour laquelle le titre et le texte se suffisent à
// eux-mêmes, sans dépendre du pictogramme.
if (window.lucide) window.lucide.createIcons();

console.warn(
"[Fitz] Le module de catalogue n'a jamais démarré (" + idCible + "). " +
"Cause la plus probable : un import distant a échoué — SDK Firebase depuis " +
"www.gstatic.com, ou firebase-config.js. Ouvrez l'onglet Réseau pour voir lequel."
);

}, DELAI_DE_GRACE);

})();
