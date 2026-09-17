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
* DEUXIÈME RÔLE, AJOUTÉ AU LOT R2 (2026-09-17) : LE LIEN DIT OÙ IL VA.
*
* Les douze pages de l'espace étudiant portent un ".back-link" écrit en
* dur sur dashboard.html. Or dashboard.html n'est plus un tableau de
* bord depuis le lot S4 : c'est un AIGUILLAGE, qui résout la session
* puis redirige vers le hub de l'espace. Revenir d'un outil coûtait
* donc deux chargements complets de la coquille Firebase — et
* atterrissait en haut du hub, pas à l'endroit d'où l'on venait.
*
* Deux notes déposées dans sessionStorage (l'onglet, et lui seul)
* corrigent ça sans toucher au markup des douze pages :
*
*   fitz_retour  {href, court, libelle, espace} — écrit par le moteur de
*                la route (espace-preinscription.js) à chaque peinture :
*                l'ÉTAPE où l'étudiant se trouve. Le lien y revient
*                directement, et son libellé le dit ("Retour à l'étape
*                9"). Le hub bourse (dashboard.js) l'efface en entrant :
*                un client des deux espaces ne doit pas être renvoyé
*                dans l'autre.
*
*   fitz_hub     le hub de l'espace courant — écrit par bootstrapShell
*                (js/app-shell.js) à chaque session résolue. Repli quand
*                il n'y a pas d'étape mémorisée : on va droit au hub,
*                sans passer par l'aiguillage.
*
* Rien de tout cela n'est nécessaire au fonctionnement : sans note,
* sans sessionStorage (navigation privée), ou si la note est illisible,
* le lien garde son href du markup. C'est un raccourci, jamais une
* dépendance.
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

/** Une note de sessionStorage, ou null — jamais une exception. */
function note(cle) {
try {
const brut = sessionStorage.getItem(cle);
if (!brut) return null;
const v = JSON.parse(brut);
return v && typeof v === "object" ? v : null;
} catch (error) {
return null;
}
}

function texteSimple(cle) {
try {
return sessionStorage.getItem(cle) || "";
} catch (error) {
return "";
}
}

/**
* Récrit les liens de retour qui pointent encore sur l'aiguillage.
* Rend true pour un lien mené vers une ÉTAPE : celui-là ne doit pas
* passer par history.back(), qui ramènerait sur la page de la route
* sans savoir quelle étape regarder.
*/
function recrire(link) {

// On ne récrit QUE le lien de l'aiguillage : un retour déjà précis
// (« Retour à ma candidature », la photo de héros d'une fiche) est
// intentionnel, et nous n'avons rien à y ajouter.
const href = link.getAttribute("href");
if (href !== "dashboard.html") return false;

// La page de la route et le hub bourse n'ont pas de lien de retour :
// aucun risque de se renvoyer sur soi-même ici.
const retour = note("fitz_retour");
if (retour && typeof retour.href === "string" && retour.href) {
link.setAttribute("href", retour.href);
link.dataset.retour = "etape";
const texte = link.querySelector("span");
if (texte && typeof retour.court === "string" && retour.court) {
texte.textContent = `Retour à l'${retour.court.toLowerCase()}`;
if (typeof retour.libelle === "string" && retour.libelle) link.setAttribute("title", retour.libelle);
}
return true;
}

const hub = texteSimple("fitz_hub");
if (hub && /^[a-z0-9-]+\.html$/.test(hub) && hub !== "dashboard.html") {
link.setAttribute("href", hub);
link.dataset.retour = "hub";
}

return false;

}

function initBackLinks() {

document.querySelectorAll("a.back-link[href]").forEach((link) => {

const versEtape = recrire(link);

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
// Un retour vers une ÉTAPE précise se suit tel quel : history.back()
// rendrait la page de la route sans son paramètre d'étape (le moteur
// nettoie l'URL après lecture), donc l'étape COURANTE au lieu de
// celle que l'étudiant regardait.
if (versEtape) return;

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
