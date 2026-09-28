/**
* ==========================================================
* js/compteur-anime.js — ce qu'affiche un compteur animé, image par image
* ==========================================================
* Le calcul d'animateCountTo (js/homepage-teaser.js), sorti de la page
* pour être testé sous Node : ni DOM, ni horloge, ni
* requestAnimationFrame. La page garde tout le reste (départ à l'entrée
* dans l'écran, filet setTimeout, prefers-reduced-motion).
*
* LE DÉFAUT CORRIGÉ (2026-09-28)
* L'horodatage que requestAnimationFrame passe à son rappel est celui du
* DÉBUT de l'image : il peut précéder le performance.now() pris juste
* avant la demande. La progression devenait alors négative, l'easing
* aussi, et le compteur des bourses du hero affichait « -6 » ou « -4 »
* pendant une image (lu par le harnais, scripts/verifier/pages.mjs).
* Avec 164 bourses, une image de 60 Hz d'avance (16,7 ms) donnait
* « -6 ». La progression est désormais bornée à [0, 1] : une image en
* avance affiche « 0 », le chiffre d'où part le comptage.
*
* Contrôlé par test/compteur-anime.test.mjs.
* ==========================================================
*/

/**
* L'image de l'instant `maintenant`, pour une animation partie à `debut`.
* Même easing que l'ancien compteur de main.js (easeOutCubic).
*
* @param {number} maintenant  l'horodatage reçu de requestAnimationFrame
* @param {number} debut       performance.now() au lancement
* @param {number} duree       en millisecondes
* @param {number} cible       la vraie valeur, atteinte à la fin
* @returns {{ texte: string, enCours: boolean }} le texte à afficher, et
*   s'il faut demander une image de plus
*/
export function imageDuCompteur(maintenant, debut, duree, cible) {
const progression = Math.min(Math.max((maintenant - debut) / duree, 0), 1);
const adoucie = 1 - Math.pow(1 - progression, 3);
return { texte: `${Math.round(adoucie * cible)}`, enCours: progression < 1 };
}
