/**
* ============================================================
* FitzUniverse — offers.html : une grille à la fois (grille A, 2026-09-07)
* ============================================================
*
* Une seule page, trois entrées :
*   offers.html?parcours=bourse          → la grille bourses
*   offers.html?parcours=preinscription  → la grille préinscriptions
*   offers.html#<idDeFormule>            → la grille du PARCOURS de cette
*                                          formule (champ `parcours` de
*                                          pricing-plans.js), puis
*                                          défilement jusqu'à elle
*   offers.html (rien)                   → le choix : deux boutons de
*                                          poids égal, aucun parcours
*                                          d'office
*
* Les liens existants offers.html#<id> (écrans verrouillés, redirections
* de paiement, CTA d'outils) continuent de fonctionner tels quels.
* Une ancre inconnue retombe sur le choix, sans erreur.
*
* resoudreVueOffres() est PURE (testable sans navigateur) ;
* initOffresParcours() branche le DOM. Aucun appel Firebase.
* ============================================================
*/

export const PARCOURS = ["bourse", "preinscription"];

// Les ancres de la grille B (#bourses / #preinscriptions) restent
// comprises : elles ont pu être partagées.
const ALIAS_ANCRES = { bourses: "bourse", preinscriptions: "preinscription" };

/**
* @param {{search?:string, hash?:string}} url - window.location.search / .hash
* @param {Object} plans - window.SCHOLARBRIDGE_PLANS
* @returns {{parcours: "bourse"|"preinscription"|null, cible: string|null}}
*   parcours null = afficher le choix ; cible = l'id de formule à
*   faire défiler, s'il y en a un.
*/
export function resoudreVueOffres({ search = "", hash = "" } = {}, plans = {}) {

const ancre = decodeURIComponent(String(hash || "").replace(/^#/, "")).trim();

if (ancre) {
const offre = plans[ancre];
if (offre && PARCOURS.includes(offre.parcours)) return { parcours: offre.parcours, cible: ancre };
if (ALIAS_ANCRES[ancre]) return { parcours: ALIAS_ANCRES[ancre], cible: null };
// Ancre inconnue : on regarde quand même ?parcours=, puis le choix.
}

const demande = new URLSearchParams(String(search || "")).get("parcours");
if (demande && PARCOURS.includes(demande)) return { parcours: demande, cible: null };

return { parcours: null, cible: null };

}

/**
* L'URL partageable d'un parcours, sans toucher aux autres paramètres
* (?program=… du bandeau contextuel, par exemple).
*/
export function urlDuParcours(parcours, search = "") {
const params = new URLSearchParams(String(search || ""));
params.set("parcours", parcours);
return `?${params.toString()}`;
}

function afficher(parcours, cible) {

const choix = document.getElementById("parcoursChoix");
const vues = document.querySelectorAll(".pricing-view[data-parcours]");

vues.forEach((vue) => { vue.hidden = vue.dataset.parcours !== parcours; });
if (choix) choix.hidden = parcours !== null;

// Ce qui vient d'apparaître doit être visible sans attendre un
// défilement : l'observer de offers.js ne revoit pas ce qui était
// masqué au chargement.
document.querySelectorAll(".pricing-view:not([hidden]) .reveal, .parcours-choice:not([hidden]).reveal")
.forEach((el) => el.classList.add("is-visible"));

if (window.lucide) lucide.createIcons();

if (cible) {
const cta = document.querySelector(`.plan-cta[data-plan="${cible}"]`);
const carte = cta && cta.closest(".plan-card, .consult-banner");
if (carte) {
carte.classList.add("is-targeted");
requestAnimationFrame(() => carte.scrollIntoView({ block: "center" }));
}
}

}

export function initOffresParcours(plans) {

const rendre = () => {
const { parcours, cible } = resoudreVueOffres(window.location, plans || {});
afficher(parcours, cible);
};

// La bascule (et les deux boutons du choix) : même page, URL mise à
// jour pour que le lien reste partageable.
document.addEventListener("click", (event) => {
const lien = event.target.closest("[data-parcours-switch]");
if (!lien) return;
const parcours = lien.dataset.parcoursSwitch;
if (!PARCOURS.includes(parcours)) return;
event.preventDefault();
history.pushState(null, "", urlDuParcours(parcours, window.location.search));
afficher(parcours, null);
window.scrollTo({ top: document.getElementById(parcours === "bourse" ? "bourses" : "preinscriptions").offsetTop - 24, behavior: "smooth" });
});

window.addEventListener("popstate", rendre);
window.addEventListener("hashchange", rendre);

rendre();

}
