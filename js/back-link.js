/**
* ==========================================================
* Fitz — navigation "retour" fidèle au scroll (2026-08-28)
* ==========================================================
*
* Jusqu'ici, chaque ".back-link" du site (offers.html, payment.html)
* était un simple <a href="..."> statique : cliquer dessus rechargeait
* toujours la page cible depuis le haut, même si l'étudiant avait fait
* défiler cette page-là avant de la quitter. Résultat : revenir en
* arrière faisait perdre sa place dans une longue liste (bourses,
* universités) ou dans un formulaire déjà rempli plus bas.
*
* Ce script rend ce même lien "intelligent" sans changer son markup ni
* son comportement de secours : au clic, s'il est raisonnablement sûr
* qu'il existe une page précédente DANS CE SITE dans l'historique de
* l'onglet, on utilise history.back() à la place de l'URL statique —
* le navigateur restaure alors la page précédente exactement à la
* position de défilement où l'étudiant l'avait laissée (comportement
* natif de l'historique, aucun code à écrire pour ça). Si ce n'est pas
* le cas (arrivée directe sur la page, lien partagé, nouvel onglet,
* provenance extérieure au site), le lien suit simplement son href
* normal — jamais de navigation cassée.
*
* Volontairement indépendant de tout module existant (access-guard.js,
* app-shell.js...) : ce comportement doit s'appliquer à l'identique sur
* une page publique (scholarship-details.html) comme sur une page de
* l'espace étudiant connecté (dashboard, outils Fitz), sans dépendre de
* l'état de session ni du chrome (header public vs sidebar) qui
* l'entoure. Un script plat, sans import, chargé tel quel par chaque
* page qui utilise ".back-link".
* ==========================================================
*/

(() => {

function isSameOriginReferrer() {

if (!document.referrer) return false;

try {
return new URL(document.referrer).origin === window.location.origin;
} catch (error) {
return false;
}

}

function initBackLinks() {

document.querySelectorAll("a.back-link[href]").forEach((link) => {

link.addEventListener("click", (event) => {

// Laisse intact tout comportement voulu par l'utilisateur ou déjà
// géré ailleurs : clic autre que le bouton principal, Ctrl/Cmd/
// Maj/Alt (ouverture en nouvel onglet/fenêtre), ou clic déjà annulé
// par un autre écouteur.
if (event.defaultPrevented) return;
if (event.button !== 0) return;
if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

// history.length > 1 : il existe au moins une entrée précédente
// dans CET onglet (pas seulement "le site a un historique" — un
// onglet fraîchement ouvert sur un lien partagé a history.length
// === 1 même si le site est connu du navigateur). Combiné à un
// referrer du même site, c'est le signal le plus fiable qu'on
// peut obtenir en JS pur qu'un history.back() ramènera bien
// l'étudiant sur une page Fitz qu'il vient de quitter,
// plutôt que hors du site ou sur about:blank.
if (window.history.length > 1 && isSameOriginReferrer()) {
event.preventDefault();
window.history.back();
}

// Sinon : on laisse le lien suivre son href normal, déjà présent
// dans le markup — c'est le repli, pas un cas d'erreur.

});

});

}

if (document.readyState === "loading") {
document.addEventListener("DOMContentLoaded", initBackLinks);
} else {
initBackLinks();
}

})();
