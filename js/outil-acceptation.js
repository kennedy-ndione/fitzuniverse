/**
* ==========================================================
* js/outil-acceptation.js — les outils de Fitz suivent l'acceptation
* (lot ACCEPTATION, 2026-09-11)
* ==========================================================
* Décision 3 de Charles : la lettre, l'e-mail et la vérification ne
* s'ouvrent qu'APRÈS l'acceptation. Les trois outils (ai-letter.js,
* ai-email.js, ai-check.js) partagent donc UNE décision :
*
*   - une candidature liée (?applicationId=, ou choisie dans « Candidature
*     concernée ») qui n'est pas ouverte aux outils → « Acceptez d'abord
*     cette université dans Mes candidatures » ;
*   - aucune candidature, dans le parcours BOURSES → plus de mode libre :
*     « Choisissez d'abord une université acceptée dans Mes candidatures ».
*     Le mode libre ne reste qu'en préinscription (vœux saisis à la main).
*
* `blocageOutil` est PURE (testable) ; `afficherBlocage` touche le DOM.
* ==========================================================
*/

import { outilsOuverts, modeLibreAutorise } from "./fitz-choisit.js";
import { parcoursDOutil } from "./parcours.js";

export const TEXTES_BLOCAGE = {
"non-acceptee": "Acceptez d'abord cette université dans Mes candidatures.",
aucune: "Choisissez d'abord une université acceptée dans Mes candidatures."
};

/**
* Ce qui bloque l'outil, ou null.
* @param {{ espace?: string, application?: Object|null }} contexte
* @returns {{ code: "non-acceptee"|"aucune", texte: string, href: string }|null}
*/
export function blocageOutil({ espace = "", application = null } = {}) {
if (application && !outilsOuverts(application)) {
return { code: "non-acceptee", texte: TEXTES_BLOCAGE["non-acceptee"], href: `applications.html#${application.id}` };
}
if (!application && !modeLibreAutorise(parcoursDOutil({ espace }))) {
return { code: "aucune", texte: TEXTES_BLOCAGE.aucune, href: "applications.html" };
}
return null;
}

/**
* Pose (ou retire) la ligne de blocage juste avant `ancre` (le formulaire
* de l'outil). Un seul élément (#outilBlocage), mis à jour en place.
*/
export function afficherBlocage(ancre, blocage) {
if (!ancre || !ancre.parentNode) return;
let el = document.getElementById("outilBlocage");
if (!blocage) { if (el) el.remove(); return; }
if (!el) {
el = document.createElement("div");
el.id = "outilBlocage";
el.className = "ai-outil-blocage";
el.setAttribute("role", "status");
ancre.parentNode.insertBefore(el, ancre);
}
el.dataset.code = blocage.code;
el.innerHTML = `<i data-lucide="lock"></i><span></span><a class="btn btn-secondary btn-sm">Mes candidatures</a>`;
el.querySelector("span").textContent = blocage.texte;
el.querySelector("a").setAttribute("href", blocage.href);
if (window.lucide) lucide.createIcons();
}
