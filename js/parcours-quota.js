/**
* ============================================================
* FitzUniverse — LE NOMBRE DE CANDIDATURES EST CELUI DE LA FORMULE
* ============================================================
*
* CE QUE CE FICHIER RÉPARE (lot ESPACE-ÉTUDIANT, 2026-09-13)
* ----------------------------------------------------------
* Le hub proposait TROIS opportunités. Toujours trois. `opps.top =
* selection.retenues.slice(0, 3)`, écrit en dur dans dashboard.js, quelle
* que soit la formule achetée.
*
* Un client Premier Dossier (UNE candidature) en voyait trois : deux de
* trop, et l'invitation à en suivre une quatrième. Un client Conseiller
* (SIX candidatures) en voyait trois : il avait payé 150 000 F pour six
* places et son espace ne lui en montrait que la moitié. Dans les deux
* cas, le chiffre affiché contredisait le chiffre vendu — et c'est le
* chiffre vendu qui a raison.
*
* Depuis ce lot, un seul endroit répond à « combien ? » :
*
*   quotaDeLaFormule({espace, planId, planPreinscriptionId, plans})
*
* et tout le reste en découle — les propositions du hub, la phrase qui
* les annonce, le plafond de applications.js, le décompte des places
* restantes.
*
* POURQUOI `plans` EST UN ARGUMENT, ET NON UN IMPORT
* ---------------------------------------------------
* pricing-plans.js est un script CLASSIQUE (il pose
* `window.SCHOLARBRIDGE_PLANS`), pas un module. L'importer ici
* enfermerait cette décision dans un navigateur. On la reçoit, et ce
* fichier reste vérifiable sous Node, sans DOM et sans Firebase — comme
* js/journey-map.js et js/visa-depart.js.
*
* LES DEUX CHAMPS NE SONT PAS INTERCHANGEABLES
* ---------------------------------------------
* `maxAccompaniedApplications` compte des candidatures à une BOURSE.
* `maxPreinscriptions` compte des VŒUX d'une campagne de préinscription
* (7 pour Dossier France : c'est le plafond d'Études en France, pas une
* décision commerciale). Lire l'un pour l'autre donne un chiffre qui a
* l'air juste et qui ne l'est pas — c'est exactement l'erreur que ce
* module rend impossible.
*
* Aucun DOM, aucun Firestore.
* ============================================================
*/

/** Le plafond au-delà duquel « illimité » redevient un nombre affichable. */
export const PLACES_SANS_PLAFOND = 12;

/**
* Le quota de la formule, dans l'espace où l'étudiant se trouve.
*
* @param {Object} ctx
* @param {string} ctx.espace                 "bourse" | "preinscription"
* @param {string} ctx.planId                 formule bourse (resolvePlan)
* @param {string} ctx.planPreinscriptionId   formule préinscription
* @param {Object} ctx.plans                  SCHOLARBRIDGE_PLANS
* @returns {number|null} un entier, Infinity, ou null quand aucune
*          formule de CET espace n'est active (le droit d'ouvrir la page
*          se décide ailleurs, par isFeatureLocked — jamais ici).
*/
export function quotaDeLaFormule({ espace = "bourse", planId = "", planPreinscriptionId = "", plans = null } = {}) {

if (!plans || typeof plans !== "object") return null;

const preinscription = espace === "preinscription";
const formule = plans[preinscription ? planPreinscriptionId : planId];

if (!formule) return null;

const brut = preinscription ? formule.maxPreinscriptions : formule.maxAccompaniedApplications;

if (brut === Infinity) return Infinity;

// UNE FORMULE QUI EXISTE ET N'OUVRE AUCUNE PLACE REND 0, PAS null.
// Diagnostic France déclare `maxPreinscriptions: 0` — c'est un fait,
// pas une absence. Et la différence compte en aval : `slotIdLibre`
// (js/application-actions.js) borne à **999** tout quota non fini. Rendre
// null pour « zéro place » y ouvrirait 999 créneaux. Seule l'absence de
// formule rend null, et `phraseDuQuota` s'appuie sur cette distinction.
if (brut === 0) return 0;
if (!Number.isFinite(brut) || brut < 0) return null;

return brut;

}

/**
* Le nombre de places qu'il reste à remplir.
* Jamais négatif : un compte historique peut dépasser son quota (une
* formule honorée qui a baissé), et « −2 places » n'aide personne.
*/
export function placesRestantes(quota, dejaSuivies = 0) {
if (quota === Infinity) return Infinity;
if (!Number.isFinite(quota) || quota <= 0) return 0;
return Math.max(0, quota - Math.max(0, dejaSuivies));
}

/**
* Combien de propositions le hub affiche.
*
* Exactement le nombre de places LIBRES — ni plus (proposer une
* quatrième université à qui n'en a que trois, c'est vendre par le
* manque), ni moins (en montrer trois à qui en a payé six, c'est lui
* cacher ce qu'il a acheté).
*
* `disponibles` plafonne : on ne promet pas une place que le catalogue
* ne peut pas remplir. Sans quota connu (compte gratuit, accès test),
* on retombe sur `defaut` — le comportement d'avant ce lot.
*/
export function nombreAProposer({ quota, dejaSuivies = 0, disponibles = 0, defaut = 3 } = {}) {

const restantes = placesRestantes(quota, dejaSuivies);

const voulues = restantes === Infinity
? PLACES_SANS_PLAFOND
: (quota === null || quota === undefined ? defaut : restantes);

return Math.max(0, Math.min(voulues, Math.max(0, disponibles)));

}

/** Le mot juste : une candidature côté bourse, un vœu côté préinscription. */
export function motDeLaPlace(espace, pluriel = false) {
if (espace === "preinscription") return pluriel ? "vœux" : "vœu";
return pluriel ? "candidatures" : "candidature";
}

/**
* LA PHRASE QUI DIT LE COMPTE — celle que l'étudiant lit sous le titre
* de la phase.
*
* Elle dit trois choses et rien d'autre : ce que la formule donne, ce
* qui est déjà pris, ce qui reste. Aucun jugement, aucune vente : quand
* tout est rempli, elle le dit et s'arrête. La montée en gamme a sa
* place, et ce n'est pas ici.
*
* @returns {{texte:string, restantes:number, complet:boolean}|null}
*          null quand aucune formule n'est active : la phase parle alors
*          d'exploration, pas de places.
*/
export function phraseDuQuota({ quota, dejaSuivies = 0, espace = "bourse", nomFormule = "" } = {}) {

// Ni formule (null), ni formule sans place (0) : la phase parle
// d'exploration, pas de places.
if (quota === null || quota === undefined || quota === 0) return null;

const restantes = placesRestantes(quota, dejaSuivies);
const formule = nomFormule ? `Votre formule ${nomFormule}` : "Votre formule";

// LE GENRE SUIT LE MOT, ET LE MOT SUIT LE PARCOURS.
// « candidature » est féminin, « vœu » est masculin. Les accords
// étaient écrits en dur au féminin : tout client Dossier France lisait
// « 7 vœux accompagnées de bout en bout. Elles sont toutes libres. »
// — sur la ligne la plus visible de sa phase 02.
const f = espace !== "preinscription";
const e = f ? "e" : "";
// Une bourse est décernée par une université ; un vœu est examiné par
// un établissement, qui n'en est pas toujours une.
const decideur = f ? "l'université" : "l'établissement";

if (quota === Infinity) {
return {
texte: `${formule} n'a pas de plafond : Fitz vous accompagne sur autant de ${motDeLaPlace(espace, true)} que vous en menez.`,
restantes: Infinity,
complet: false
};
}

const places = `${quota} ${motDeLaPlace(espace, quota > 1)}`;

if (restantes === 0) {
const engagees = quota > 1
? `${f ? "elles sont toutes engagées" : "ils sont tous engagés"}`
: `${f ? "elle est engagée" : "il est engagé"}`;
return {
texte: `${formule} vous donne ${places}, et ${engagees}. Fitz suit ${quota > 1 ? (f ? "chacune" : "chacun") : "votre dossier"} jusqu'à la décision de ${decideur}.`,
restantes: 0,
complet: true
};
}

const libres = restantes === quota
? (quota > 1 ? `${f ? "Elles sont toutes libres" : "Ils sont tous libres"}` : `${f ? "Elle est libre" : "Il est libre"}`)
: `Il vous en reste ${restantes}`;

return {
texte: `${formule} vous donne ${places} accompagné${e}${quota > 1 ? "s" : ""} de bout en bout. ${libres}.`,
restantes,
complet: false
};

}
