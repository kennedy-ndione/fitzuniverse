/**
* ============================================================
* js/fitz-recours-lien.js — l'affordance « Bloqué ? Demandez à Fitz »
* ============================================================
*
* LOT PERF 3G (2026-09-28). Ces quelques fonctions vivaient dans
* js/fitz-recours.js, qui les RÉ-EXPORTE toujours (aucun importeur n'a
* eu à changer de nom). Elles en sont sorties, à l'identique, parce que
* la coquille de l'espace (js/app-shell.js), le tableau de bord, les
* candidatures et l'espace préinscription n'avaient besoin QUE du bouton
* — et l'importer depuis js/fitz-recours.js leur faisait télécharger tout
* le diagnostic de Fitz : les procédures des neuf pays, le diagnostic
* France, les préinscriptions. Mesuré : la coquille chargée sur les
* pages publiques pour un étudiant connecté passait de 49 modules
* (257 Ko compressés) à 12 (51 Ko).
*
* Module PUR : aucun import, aucun DOM, aucun Firestore.
* ============================================================
*/

// ==========================================================
// LE CATALOGUE DES BLOCAGES CONNUS — fermé, et chaque code a sa donnée
// ==========================================================

export const CODES_BLOCAGE = [
"verrou",       // « cet outil est fermé »           → decideVerrou + la grille
"prerequis",    // « je ne peux pas générer ma lettre » → qualifierEtapes / LIBELLE_PREREQUIS
"quoi_faire",   // « je ne sais pas quoi faire »      → prochaineAction
"documents",    // « quels documents ? »              → lireExigences + documents-data
"etape",        // « je ne comprends pas cette étape » → texteConsigne + source + verifieLe
"paiement",     // « où et quand payer ? »            → la couche de résidence
"echeance",     // « c'est quand la date limite ? »   → analyserEcheance / jalons
"depot_tiers",  // « je ne dépose pas moi-même ? »    → deposeParUnTiers
"preuve",       // « comment prouver mon dépôt ? »    → preuve-depot
"sans_reponse"  // « je n'ai pas de nouvelles »       → DELAI_REPONSE + l'état réel
];

/** Le libellé de l'affordance, le même partout. */
export const LIBELLE_RECOURS = "Bloqué ? Demandez à Fitz";

// ==========================================================
// LE LIEN — un seul composant, six contextes
// ==========================================================

/**
* L'URL vers Fitz, avec le contexte du blocage. Le motif existe déjà :
* ai-chat.html lit `?prep=<test>` ; on l'étend avec `?bloc=<code>` et,
* selon le cas, `app`, `etape`, `feature`.
*/
export function lienRecours({ code, app = "", etape = "", feature = "" } = {}) {
const params = new URLSearchParams();
params.set("bloc", CODES_BLOCAGE.includes(code) ? code : "quoi_faire");
if (app) params.set("app", String(app));
if (etape) params.set("etape", String(etape));
if (feature) params.set("feature", String(feature));
return `ai-chat.html?${params.toString()}`;
}

/**
* Lit un blocage dans une chaîne de recherche. Un code inconnu ou
* fabriqué dans la barre d'adresse rend `null` : le chat s'ouvre
* normalement, sans erreur.
*/
export function lireBlocage(search) {
const params = new URLSearchParams(String(search || ""));
const code = params.get("bloc");
if (!code || !CODES_BLOCAGE.includes(code)) return null;
return {
code,
app: params.get("app") || "",
etape: params.get("etape") || "",
feature: params.get("feature") || ""
};
}

function echapper(texte) {
return String(texte == null ? "" : texte).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

/**
* L'affordance « Bloqué ? Demandez à Fitz », en HTML — un lien, une
* classe, une icône. Elle se pose à l'endroit du blocage ; le bouton
* flottant et l'onglet mobile restent l'entrée générale.
*/
export function boutonRecours(blocage, { classe = "", libelle = LIBELLE_RECOURS } = {}) {
return `<a href="${echapper(lienRecours(blocage))}" class="fitz-recours${classe ? ` ${classe}` : ""}" data-recours="${echapper(blocage.code)}"><i data-lucide="life-buoy" aria-hidden="true"></i><span>${echapper(libelle)}</span></a>`;
}
