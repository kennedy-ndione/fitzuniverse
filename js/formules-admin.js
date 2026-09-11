/**
* ============================================================
* FitzUniverse — les formules, sous leur vrai nom, pour l'ADMIN
* (lot FINITIONS-VISUELLES, 2026-09-11)
* ============================================================
*
* Module PUR (aucun DOM, aucun Firebase) : la seule source des
* étiquettes que le Control Center affiche pour une formule.
*
* POURQUOI : PLAN_LABELS (js/plan-features.js) donne aux étudiants le
* nom commercial — et ce nom est le MÊME pour l'ancienne et la nouvelle
* formule (`essentiel` et `essentiel-4` = « Essentiel », `signature-focus`
* et `conseiller-6` = « Conseiller »). Dans la fiche étudiant, Charles
* voyait deux « Conseiller » et deux « Essentiel » sans pouvoir dire
* laquelle est en vente ; le filtre de la liste, écrit en dur, proposait
* encore « Avancé » (disparu en août) et ignorait Premier Dossier,
* Conseiller, le Pass Découverte et les trois offres France.
*
* RÈGLES :
*  - chaque identifiant reçoit le nom du site PLUS ce qui le distingue
*    (« Essentiel · 4 candidatures ») ; une formule retirée le dit
*    (« Essentiel (ancienne) · 5 candidatures ») ;
*  - aucune étiquette n'est identique à une autre (test) ;
*  - l'ordre : les offres EN VENTE d'abord, puis les RETIRÉES sous un
*    titre de groupe visible (TITRE_RETIREES) ;
*  - les IDENTIFIANTS ne changent pas, ni les noms montrés aux étudiants.
*
* Les distinctifs (quotas, durées) sont recopiés depuis pricing-plans.js
* (maxAccompaniedApplications, duration, maxPreinscriptions) — un script
* classique qu'un module ne peut pas importer. test/formules-admin.test.mjs
* charge pricing-plans.js dans une machine virtuelle et vérifie que les
* deux ne divergent pas (quotas ET liste des dépréciées).
* ============================================================
*/

import { PLAN_ORDER, PLAN_LABELS, PLAN_PREINSCRIPTION_ORDER, PLAN_PREINSCRIPTION_LABELS, PASS_LABEL } from "./plan-features.js";

/** L'identifiant du Pass Découverte (champ fitzExpressExpiresAt, compteur analytics `fitzExpress`). */
export const PASS_ID = "fitzExpress";

/** Le titre de groupe que l'admin voit au-dessus des formules retirées. */
export const TITRE_EN_VENTE = "En vente";
export const TITRE_RETIREES = "Retirées de la vente — anciens comptes";

// Les formules bourse retirées de la vente (deprecated:true dans
// pricing-plans.js — vérifié par le test).
export const RETIREES = ["essentiel", "accompagnement", "premium", "signature-focus", "signature"];

// Ce qui distingue chaque formule, dans l'ordre de PLAN_ORDER /
// PLAN_PREINSCRIPTION_ORDER, plus le Pass.
const DISTINCTIF = {
[PASS_ID]: "14 jours",
"premier-dossier": "1 candidature",
"essentiel-4": "4 candidatures",
"conseiller-6": "6 candidatures",
"diagnostic-france": "14 jours",
"dossier-france": "7 vœux",
"dossier-france-conseiller": "7 vœux",
// Retirées : le nom garde son « (ancienne) », le distinctif reste court.
essentiel: "5 candidatures",
accompagnement: "9",
premium: "12",
"signature-focus": "12",
signature: "illimitée"
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
if (preinscription) enVente.push(...PLAN_PREINSCRIPTION_ORDER);
const retirees = bourse ? PLAN_ORDER.filter((id) => id !== "gratuit" && estRetiree(id)) : [];
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

/**
* Ce qu'un COMPTE porte, en étiquettes : la formule bourse ET l'offre
* France quand il a les deux, le Pass seul quand il n'a que lui.
* `resolu` = { planId, planPreinscriptionId, passSeul } (voir
* js/plan-features.js : resolvePlan, resolvePlanPreinscription, passSeul).
*/
export function etiquettesDuCompte({ planId = "gratuit", planPreinscriptionId = "", passSeul = false } = {}) {
if (passSeul) return [{ id: PASS_ID, etiquette: etiquetteAdmin(PASS_ID) }];
const out = [];
if (planId && planId !== "gratuit") out.push({ id: planId, etiquette: etiquetteAdmin(planId) });
if (planPreinscriptionId) out.push({ id: planPreinscriptionId, etiquette: etiquetteAdmin(planPreinscriptionId) });
if (!out.length) out.push({ id: "gratuit", etiquette: etiquetteAdmin("gratuit") });
return out;
}
