/**
* ============================================================
* FitzUniverse — source unique de vérité des droits d'un compte
* ============================================================
*
* Ne fait AUCUN appel Firebase et ne redéfinit AUCUNE règle : compose
* uniquement ce qui existe déjà (js/access-guard.js pour la session et
* les feature flags, pricing-plans.js pour les quotas). L'objectif est
* qu'une page qui a besoin de savoir "à quoi ce compte a-t-il droit ?"
* n'ait qu'un seul endroit à appeler, plutôt que de recombiner
* planId/featureFlags/testerAccess/hasFitzExpress à chaque fois.
*
* Utilisation typique, après bootstrapShell() ou resolveSession() :
*
*   import { getUserEntitlements } from "./js/entitlements.js";
*   const entitlements = await getUserEntitlements(session);
*   if (entitlements.hasAdvisor) { ... }
* ============================================================
*/

import { PLAN_LABELS, PLAN_PREINSCRIPTION_LABELS, fetchFeatureFlags, isFeatureLocked } from "./access-guard.js";
import { DEFAULT_FEATURE_CONFIG, PREINSCRIPTION_FEATURE_CONFIG, advisorOuvert } from "./plan-features.js";

// pricing-plans.js est chargé comme script classique (pas un module) sur
// toute page qui en a besoin — voir applications.js/dashboard.js pour le
// même schéma. window.SCHOLARBRIDGE_PLANS n'existe donc qu'après ce
// <script src="pricing-plans.js"> ; toute page qui importe ce module doit
// aussi charger pricing-plans.js avant.
function readPlanData(planId) {
return (typeof window !== "undefined" && window.SCHOLARBRIDGE_PLANS)
? window.SCHOLARBRIDGE_PLANS[planId]
: undefined;
}

// DÉRIVÉE, PLUS RECOPIÉE (2026-09-08). Cette liste était écrite en dur —
// ["signature-focus", "signature"] — avec un commentaire reconnaissant
// que DEFAULT_FEATURE_CONFIG.advisor était « la source de vérité réelle »
// et que la copie ne servait qu'à documenter l'intention. La grille A a
// ajouté « conseiller-6 » à la vraie config sans que la copie suive :
// pendant ce temps, un client à 150 000 F voyait hasAdvisor=false et la
// section « Mon conseiller » masquée. Une duplication qui se sait
// duplication n'est pas une duplication acceptable, c'est une dette qui
// attend son incident. On la calcule maintenant.
export const ADVISOR_PLANS = Object.keys(DEFAULT_FEATURE_CONFIG.advisor).filter((planId) => DEFAULT_FEATURE_CONFIG.advisor[planId] === true);
// Grille B (2026-09-07) : la revue conseiller est aussi ouverte par
// Dossier France + Conseiller — l'union des deux forfaits. Dérivée elle
// aussi, pour la même raison que ci-dessus.
export const ADVISOR_PREINSCRIPTION = Object.keys(PREINSCRIPTION_FEATURE_CONFIG.advisor).filter((planId) => PREINSCRIPTION_FEATURE_CONFIG.advisor[planId] === true);

/**
* @param {Object} session - résultat de resolveSession()/bootstrapShell()
*   ({ user, userData, planId, testerAccess, hasFitzExpress, ... })
* @returns {Promise<{
*   plan: string,
*   planLabel: string,
*   isFitzExpressActive: boolean,
*   fitzExpressExpiresAt: string|null,
*   maxApplications: number,
*   hasAdvisor: boolean,
*   featureFlags: Object,
*   isFeatureLocked: (featureKey: string) => boolean
* }>}
*/
export async function getUserEntitlements(session) {

const featureFlags = await fetchFeatureFlags();
const planData = readPlanData(session.planId);
const planPreData = readPlanData(session.planPreinscriptionId || "");

return {
plan: session.planId,
planLabel: PLAN_LABELS[session.planId],
// Grille B : le second forfait et son quota — les droits sont l'UNION.
planPreinscription: session.planPreinscriptionId || "",
planPreinscriptionLabel: PLAN_PREINSCRIPTION_LABELS[session.planPreinscriptionId] || "",
planPreinscriptionExpiresAt: (session.userData && session.userData.planPreinscriptionExpiresAt) || null,
maxPreinscriptions: planPreData ? planPreData.maxPreinscriptions : 0,
isFitzExpressActive: !!session.hasFitzExpress,
fitzExpressExpiresAt: (session.userData && session.userData.fitzExpressExpiresAt) || null,
maxApplications: planData ? planData.maxAccompaniedApplications : 0,
// Même décision que les shells depuis le 2026-09-08 — advisorOuvert()
// lit les drapeaux RÉSOLUS (défauts + surcharges Firestore), là où les
// deux listes ci-dessus ignorent une surcharge admin. Elles restent
// exportées pour qui veut la liste des formules concernées.
hasAdvisor: advisorOuvert({
planId: session.planId,
planPreinscriptionId: session.planPreinscriptionId,
featureFlags,
testerAccess: session.testerAccess
}),
featureFlags,
isFeatureLocked: (featureKey) => isFeatureLocked(
session.planId,
featureFlags,
featureKey,
session.testerAccess,
session.hasFitzExpress,
session.planPreinscriptionId
)
};

}
