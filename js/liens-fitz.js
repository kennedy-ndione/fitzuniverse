/**
* ============================================================
* js/liens-fitz.js — les seules pages vers lesquelles Fitz peut renvoyer
* ============================================================
*
* LOT DÉPART (2026-09-21). La vérification « Prêt à déposer ? » demandait
* au modèle un « lien interne relatif si pertinent ». Il en a inventé :
* /profil, /lettre-motivation, /candidature/dossier,
* /candidature/parametres — quatre liens sur cinq, quatre pages 404,
* affichés sur une carte de candidature réelle. Le filtre d'affichage
* acceptait tout ce qui « avait l'air » d'un chemin.
*
* Désormais : une liste FERMÉE, donnée au modèle dans le prompt et
* appliquée à l'affichage. Un lien hors liste redevient un bouton sans
* destination, exactement comme un lien absent. Pas de lien externe non
* plus : une adresse inventée vers un site tiers est pire qu'une 404.
* ============================================================
*/

export const PAGES_FITZ = [
"profile.html",
"documents.html",
"applications.html",
"ai-letter.html",
"ai-email.html",
"ai-check.html",
"ai-translate.html",
"compress.html",
"test-prep.html",
"interview-prep.html",
"ai-chat.html"
];

/**
* Le lien, s'il mène à une page de la liste (paramètres et ancre
* permis), sinon null. Un paramètre ne peut pas porter de code : les
* caractères admis sont ceux d'un identifiant.
*/
export function lienFitzSur(href) {
if (typeof href !== "string") return null;
const lien = href.trim().replace(/^\.?\//, "");
const m = /^([a-z-]+\.html)([?#][\w=&#.%-]*)?$/i.exec(lien);
if (!m) return null;
return PAGES_FITZ.includes(m[1].toLowerCase()) ? lien : null;
}
