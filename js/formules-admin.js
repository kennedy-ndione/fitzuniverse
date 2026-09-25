/**
* ============================================================
* FitzUniverse — les formules, sous leur vrai nom, pour l'ADMIN
* (lot FINITIONS-VISUELLES, 2026-09-11)
* ============================================================
*
* Module PUR (aucun DOM, aucun Firebase) : la seule source des
* étiquettes que le Control Center affiche pour une formule.
*
* POURQUOI : le filtre de la liste, écrit en dur, proposait encore des
* formules disparues et ignorait le Pass Découverte et les offres
* préinscription. Tout part désormais d'ici.
*
* RÈGLES :
*  - chaque identifiant reçoit le nom du site PLUS ce qui le distingue
*    (« Essentiel · 4 candidatures ») ;
*  - aucune étiquette n'est identique à une autre (test) ;
*  - l'ordre : Pass, bourses, préinscription ;
*  - les IDENTIFIANTS ne changent pas, ni les noms montrés aux étudiants.
*
* LES ANCIENNES FORMULES ONT ÉTÉ SUPPRIMÉES LE 2026-09-24 (essentiel,
* accompagnement, premium, signature-focus, signature) : aucun compte ne
* les portait. RETIREES reste, VIDE, pour le jour où une formule sortira
* de la vente en laissant des clients derrière elle : elle y sera listée
* avec son « (ancienne) », sous TITRE_RETIREES.
*
* Les distinctifs (quotas, durées) sont recopiés depuis pricing-plans.js
* (maxAccompaniedApplications, duration, maxPreinscriptions) — un script
* classique qu'un module ne peut pas importer. test/formules-admin.test.mjs
* charge pricing-plans.js dans une machine virtuelle et vérifie que les
* deux ne divergent pas (quotas ET liste des dépréciées).
* ============================================================
*/

import { PLAN_ORDER, PLAN_LABELS, PLAN_PREINSCRIPTION_ORDER, PLAN_PREINSCRIPTION_LABELS, PASS_LABEL, NOMS_DESTINATIONS_PREINSCRIPTION, libelleOffrePreinscription } from "./plan-features.js";
import { destination } from "./destinations-preinscription.js";

/** L'identifiant du Pass Découverte (champ fitzExpressExpiresAt, compteur analytics `fitzExpress`). */
export const PASS_ID = "fitzExpress";

/** Le titre de groupe que l'admin voit au-dessus des formules retirées. */
export const TITRE_EN_VENTE = "En vente";
export const TITRE_RETIREES = "Retirées de la vente — anciens comptes";

// Les formules retirées de la vente (deprecated:true dans
// pricing-plans.js — vérifié par le test). Depuis le 2026-09-25 (lot 97) :
// le Diagnostic, devenu gratuit — les comptes qui l'ont acheté le gardent.
export const RETIREES = ["diagnostic-france"];

// Ce qui distingue chaque formule, dans l'ordre de PLAN_ORDER /
// PLAN_PREINSCRIPTION_ORDER, plus le Pass.
const DISTINCTIF = {
[PASS_ID]: "14 jours",
"premier-dossier": "1 candidature",
"essentiel-4": "4 candidatures",
"conseiller-6": "6 candidatures",
"diagnostic-france": "14 jours",
"dossier-france": "7 vœux",
"dossier-france-conseiller": "7 vœux"
};

/** Le nom du site pour un identifiant (formule bourse, offre France ou Pass). */
export function nomDuSite(id) {
if (id === PASS_ID) return PASS_LABEL;
return PLAN_LABELS[id] || PLAN_PREINSCRIPTION_LABELS[id] || id;
}

/** La famille d'un identifiant : "pass", "bourse" ou "preinscription". */
export function familleDe(id) {
if (id === PASS_ID) return "pass";
if (PLAN_PREINSCRIPTION_ORDER.includes(id)) return "preinscription";
return "bourse";
}

/** Vrai pour une formule retirée de la vente. */
export function estRetiree(id) {
return RETIREES.includes(id);
}

/**
* L'étiquette de l'admin : « Essentiel · 4 candidatures »,
* « Essentiel (ancienne) · 5 candidatures », « Gratuit ».
*/
export function etiquetteAdmin(id) {
if (!id) return "";
if (id === "gratuit") return "Gratuit";
const nom = nomDuSite(id) + (estRetiree(id) ? " (ancienne)" : "");
const distinctif = DISTINCTIF[id];
return distinctif ? `${nom} · ${distinctif}` : nom;
}

/**
* Les identifiants, dans l'ordre de l'admin : en vente (Pass, bourses,
* France), puis retirées. `gratuit` n'est pas une offre : il n'y figure
* pas, sauf demande explicite (`avecGratuit`).
*/
export function formulesAdmin({ pass = true, bourse = true, preinscription = true, avecGratuit = false } = {}) {
const enVente = [];
if (pass) enVente.push(PASS_ID);
if (bourse) enVente.push(...PLAN_ORDER.filter((id) => id !== "gratuit" && !estRetiree(id)));
if (preinscription) enVente.push(...PLAN_PREINSCRIPTION_ORDER.filter((id) => !estRetiree(id)));
const retirees = [
...(bourse ? PLAN_ORDER.filter((id) => id !== "gratuit" && estRetiree(id)) : []),
...(preinscription ? PLAN_PREINSCRIPTION_ORDER.filter((id) => estRetiree(id)) : [])
];
const gratuit = avecGratuit ? ["gratuit"] : [];
return { gratuit, enVente, retirees };
}

/** Tous les identifiants que l'admin peut nommer, sans doublon. */
export function tousLesIdentifiants() {
const { enVente, retirees } = formulesAdmin();
return ["gratuit", ...enVente, ...retirees];
}

const echapper = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
* Le balisage des options d'un <select> de l'admin : une option vide
* (libellé donné), puis le groupe « En vente », puis le groupe
* « Retirées de la vente — anciens comptes ». js/fitz-select.js sait
* afficher les titres de groupe.
*/
export function optionsFormules({ vide = "", pass = true, bourse = true, preinscription = true, avecGratuit = false } = {}) {
const { gratuit, enVente, retirees } = formulesAdmin({ pass, bourse, preinscription, avecGratuit });
const option = (id) => `<option value="${echapper(id)}">${echapper(etiquetteAdmin(id))}</option>`;
let html = vide !== null ? `<option value="">${echapper(vide)}</option>` : "";
html += gratuit.map(option).join("");
if (enVente.length) html += `<optgroup label="${echapper(TITRE_EN_VENTE)}">${enVente.map(option).join("")}</optgroup>`;
if (retirees.length) html += `<optgroup label="${echapper(TITRE_RETIREES)}">${retirees.map(option).join("")}</optgroup>`;
return html;
}

// ==========================================================
// LES NEUF PAYS DANS L'ADMIN (2026-09-24, décision de Charles : « relier
// tout cela à mon espace admin »)
// ==========================================================
//
// Les trois offres préinscription se vendent dans NEUF pays, sous les
// mêmes identifiants (diagnostic-france, dossier-france,
// dossier-france-conseiller) : c'est le PAYS, porté par l'achat, qui
// dit à quoi l'offre s'applique (users/{uid}.planPreinscription pour la
// France, users/{uid}.preinscriptionsPays.<pays> pour les huit autres).
// L'admin doit donc lire « Dossier Chine », jamais « Dossier France »
// pour un étudiant qui a acheté la Chine.

/** Les pays vendus, France d'abord, dans l'ordre de la carte des préinscriptions. */
export const PAYS_ADMIN = Object.keys(NOMS_DESTINATIONS_PREINSCRIPTION);

/** Le nom d'un pays vendu (« Chine »), ou "". */
export function nomDuPays(pays) {
return Object.prototype.hasOwnProperty.call(NOMS_DESTINATIONS_PREINSCRIPTION, pays) ? NOMS_DESTINATIONS_PREINSCRIPTION[pays] : "";
}

/** Le nombre de vœux suivis par un Dossier du pays : 7, sauf l'Italie (1) et la Turquie (12). */
export function voeuxDuPays(pays) {
if (pays === "france") return 7;
const d = destination(pays);
return d ? d.plafondVoeux : 7;
}

/**
* L'étiquette d'une offre DANS SON PAYS : « Dossier Chine · 7 vœux »,
* « Dossier Italie · 1 cours », « Diagnostic Turquie · 14 jours ».
*/
export function etiquetteOffrePays(plan, pays = "france") {
const nom = libelleOffrePreinscription(plan, pays);
if (!nom) return "";
if (plan === "diagnostic-france") return `${nom} · 14 jours`;
const n = voeuxDuPays(pays);
return `${nom} · ${n === 1 ? "1 cours" : `${n} vœux`}`;
}

/**
* L'étiquette d'une COLONNE de la grille des outils (admin/plans.html) :
* une offre préinscription y vaut pour les neuf pays à la fois —
* « Dossier · 9 pays ». Les autres identifiants gardent leur étiquette.
*/
export function etiquetteColonne(id) {
if (PLAN_PREINSCRIPTION_ORDER.includes(id)) return `${PLAN_PREINSCRIPTION_LABELS[id].replace(" France", "")} · ${PAYS_ADMIN.length} pays`;
return etiquetteAdmin(id);
}

/** Les options d'un <select> de pays : une option vide (libellé donné, ou aucune si `vide` est null), puis les neuf pays. */
export function optionsPays({ vide = "" } = {}) {
const tete = vide !== null ? `<option value="">${echapper(vide)}</option>` : "";
return tete + PAYS_ADMIN.map((p) => `<option value="${echapper(p)}">${echapper(nomDuPays(p))}</option>`).join("");
}

/** Les options des trois offres, au nom du pays choisi (« Dossier Chine · 7 vœux »). */
export function optionsOffresPays(pays = "france", { vide = "Sans offre" } = {}) {
const tete = vide !== null ? `<option value="">${echapper(vide)}</option>` : "";
return tete + PLAN_PREINSCRIPTION_ORDER.map((id) => `<option value="${echapper(id)}">${echapper(etiquetteOffrePays(id, pays))}</option>`).join("");
}

/**
* Ce qu'un COMPTE porte, en étiquettes : la formule bourse ET chaque offre
* préinscription active, au nom de SON pays ; le Pass seul quand il n'a
* que lui.
* `resolu` = { planId, planPreinscriptionId, passSeul, offresPays } (voir
* js/plan-features.js : resolvePlan, resolvePlanPreinscription, passSeul,
* droitsPreinscription). Sans `offresPays`, l'offre préinscription est
* lue comme une offre France (ancien appel).
*/
export function etiquettesDuCompte({ planId = "gratuit", planPreinscriptionId = "", passSeul = false, offresPays = null } = {}) {
if (passSeul) return [{ id: PASS_ID, etiquette: etiquetteAdmin(PASS_ID) }];
const out = [];
if (planId && planId !== "gratuit") out.push({ id: planId, etiquette: etiquetteAdmin(planId) });
if (Array.isArray(offresPays)) {
for (const o of offresPays) out.push({ id: o.plan, pays: o.destination, etiquette: etiquetteOffrePays(o.plan, o.destination) });
} else if (planPreinscriptionId) {
out.push({ id: planPreinscriptionId, pays: "france", etiquette: etiquetteAdmin(planPreinscriptionId) });
}
if (!out.length) out.push({ id: "gratuit", etiquette: etiquetteAdmin("gratuit") });
return out;
}
