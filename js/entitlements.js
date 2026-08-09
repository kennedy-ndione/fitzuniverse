/**
* ============================================================
* ScholarBridge — source unique de vérité des droits d'un compte
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

import { PLAN_LABELS, fetchFeatureFlags, isFeatureLocked } from "./access-guard.js";

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

// Formules "human" (pricing-plans.js) donnant accès à un conseiller —
// dupliqué ici plutôt qu'importé depuis plan-features.js car ce n'est pas
// un featureFlag à proprement parler dans toutes les surfaces (voir
// DEFAULT_FEATURE_CONFIG.advisor, qui reste la source de vérité réelle ;
// cette liste ne sert qu'à documenter l'intention pour qui lit ce fichier).
const ADVISOR_PLANS = ["signature-focus", "signature"];

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

return {
plan: session.planId,
planLabel: PLAN_LABELS[session.planId],
isFitzExpressActive: !!session.hasFitzExpress,
fitzExpressExpiresAt: (session.userData && session.userData.fitzExpressExpiresAt) || null,
maxApplications: planData ? planData.maxAccompaniedApplications : 0,
hasAdvisor: ADVISOR_PLANS.includes(session.planId),
featureFlags,
isFeatureLocked: (featureKey) => isFeatureLocked(
session.planId,
featureFlags,
featureKey,
session.testerAccess,
session.hasFitzExpress
)
};

}
