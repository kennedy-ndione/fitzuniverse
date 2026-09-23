/**
* ============================================================
* FitzUniverse — double présentation (public / shell authentifié)
* ============================================================
*
* Pour les pages qui doivent rester 100% publiques pour un visiteur
* non connecté (SEO, découverte, conversion — ex. universities.html,
* scholarships.html) tout en offrant, à un utilisateur déjà connecté,
* la même expérience immersive (sidebar/topbar) que le reste de
* l'Espace Étudiant plutôt qu'un retour au site marketing.
*
* Contrairement à bootstrapShell() (js/app-shell.js), cette fonction
* NE REDIRIGE JAMAIS : l'absence de session est un état normal ici
* (visiteur anonyme), pas une erreur d'accès. dashboard.css n'est
* chargé dynamiquement QUE si une session est trouvée, pour ne jamais
* affecter les tokens de couleur (:root) vus par un visiteur anonyme.
*
* N'importe rien de la logique métier de la page (catalogue, filtres,
* rendu des cartes) — reste géré par le script existant de la page
* (ex. universities-page.js), qui continue de fonctionner à
* l'identique quel que soit le chrome autour de lui.
*/

import { resolveSession, fetchFeatureFlags, isFeatureLocked, PLAN_LABELS, PLAN_PREINSCRIPTION_LABELS, resoudreEspace } from "./access-guard.js";
import { advisorOuvert } from "./plan-features.js";
import { initShellChrome, unlockingPlans, espaceCourant } from "./app-shell.js";
import { initMessagesPanel } from "./student-messages.js";

function loadStylesheet(href) {
return new Promise((resolve, reject) => {
const existing = document.querySelector(`link[href="${href}"]`);
if (existing) {
resolve();
return;
}
const link = document.createElement("link");
link.rel = "stylesheet";
link.href = href;
link.onload = () => resolve();
link.onerror = () => reject(new Error(`Impossible de charger ${href}`));
document.head.appendChild(link);
});
}

/**
* @param {Object} options
* @param {string} options.publicHeaderId - id du <header> public à masquer.
* @param {string} options.mainId - id du <main> existant à déplacer dans le shell.
* @param {string} [options.shellRootId="authShellRoot"] - conteneur .dashboard-shell, présent dans le HTML, hidden par défaut.
* @param {string} [options.dashboardMainId="dashboardMainContent"] - conteneur .dashboard-main où le <main> existant est déplacé.
* @returns {Promise<null|Object>} la session si le shell a été appliqué, sinon null (visiteur anonyme ou erreur — page publique inchangée).
*/
export function applyAuthenticatedShellIfLoggedIn({
publicHeaderId,
mainId,
shellRootId = "authShellRoot",
dashboardMainId = "dashboardMainContent"
}) {

return resolveSession().then(async (session) => {

if (!session || session.disabled) return null;

const shellRoot = document.getElementById(shellRootId);
const dashboardMain = document.getElementById(dashboardMainId);
const main = document.getElementById(mainId);

if (!shellRoot || !dashboardMain || !main) return null;

await loadStylesheet("dashboard.css");
// Coquille « parcours » (2026-08-30) — même raison et même moment que
// dashboard.css : uniquement pour la session connectée.
await loadStylesheet("css/journey-shell.css");

const publicHeader = document.getElementById(publicHeaderId);
if (publicHeader) publicHeader.hidden = true;

dashboardMain.appendChild(main);
main.classList.add("content");

document.body.classList.add("dashboard-shell-active");
document.body.dataset.plan = session.planId;

shellRoot.hidden = false;

initShellChrome();

const featureFlags = await fetchFeatureFlags().catch(() => null);

const planBadge = document.getElementById("planBadge");
if (planBadge) planBadge.textContent = PLAN_LABELS[session.planId];

// LOT S4 : la pastille dit le forfait de l'ESPACE courant. Elle
// n'affichait que la formule bourse : un client venu d'un dossier
// France y lisait « Gratuit » alors qu'il a payé, sur les pages
// catalogue qu'il consulte justement pour choisir son établissement.
const espaceUtilisateur = resoudreEspace(session);
const espace = espaceCourant(espaceUtilisateur);
const topbarPlanLabel = document.getElementById("topbarPlanLabel");
if (topbarPlanLabel) {
topbarPlanLabel.textContent = espace === "preinscription"
? (PLAN_PREINSCRIPTION_LABELS[session.planPreinscriptionId] || PLAN_LABELS[session.planId])
: PLAN_LABELS[session.planId];
}
document.body.dataset.espace = espace || "aucun";
// La navigation mobile suit le même espace que la barre haute.
if (window.FitzMobileNav && window.FitzMobileNav.appliquerEspace) window.FitzMobileNav.appliquerEspace(espace);

// Nom affiché dans la feuille « Menu » mobile (js/mobile-nav.js).
if (window.FitzMobileNav) {
window.FitzMobileNav.setUser((session.profile && session.profile.name) || session.userData.name || session.user.displayName || session.user.email);
// Même règle que js/app-shell.js : l'entrée Diagnostic France n'entre
// dans le menu que si le droit est ouvert. Les pages à double
// présentation ont le même menu, elles ont donc le même besoin.
if (featureFlags && !isFeatureLocked(session.planId, featureFlags, "diagnostic_france", session.testerAccess, session.hasFitzExpress, session.planPreinscriptionId)) {
window.FitzMobileNav.ouvrirEntree("diagnostic_france");
}
}

if (featureFlags) {
document.querySelectorAll("[data-feature]").forEach((el) => {
const key = el.dataset.feature;
const flags = featureFlags[key];
if (!flags) return;
const locked = isFeatureLocked(session.planId, featureFlags, key, session.testerAccess, session.hasFitzExpress, session.planPreinscriptionId);
// La navigation de l'espace (barre du bas, feuille « Menu ») suit la
// même règle qu'à l'intérieur de l'espace (lot SCHÉMAS, 2026-09-21) :
// Candidatures, Documents, Entretien quittent la barre d'un compte qui
// ne les a pas. L'onglet Fitz garde son cadenas, dessiné pour ça.
if (locked && el.closest("#mnavTabbar, #mnavMenuGrid") && !el.classList.contains("mnav-tab--fitz")) {
el.remove();
return;
}
const link = el.matches("a") ? el : el.querySelector("a[data-real-href]");
el.classList.toggle("is-locked", locked);
if (!link) return;
if (locked) {
const targetPlan = unlockingPlans(session.planId, flags)[0] || null;
link.setAttribute("href", targetPlan ? `offers.html#${targetPlan}` : "offers.html");
} else if (link.dataset.realHref) {
link.setAttribute("href", link.dataset.realHref);
}
});

// "Mon conseiller" masqué entièrement plutôt que grisé — même règle
// que dashboard.js:applyAdvisorVisibility() / app-shell.js.
const advisorLabel = document.getElementById("advisorSectionLabel");
const advisorNav = document.getElementById("advisorSectionNav");
if (advisorLabel && advisorNav) {
// Troisième copie de la même règle, remplacée le 2026-09-08 par
// l'appel unique : elle ignorait planPreinscriptionId, comme les
// deux autres. Voir advisorOuvert() dans js/plan-features.js.
const hasAdvisor = advisorOuvert({
planId: session.planId,
planPreinscriptionId: session.planPreinscriptionId,
featureFlags,
testerAccess: session.testerAccess
});
advisorLabel.hidden = !hasAdvisor;
advisorNav.hidden = !hasAdvisor;
}
}

// Droit de réponse de la messagerie FitzUniverse — même règle que
// js/app-shell.js (fonctionnalité "student_messaging"). Depuis le
// 2026-09-23 ce droit est UNIVERSEL (DROITS_UNIVERSELS) : il ne dépend
// plus de la lecture de config/planFeatures, d'où l'absence du garde
// `!!featureFlags` qui fermait la réponse quand cette lecture échouait.
initMessagesPanel(session.user.uid, {
canReply: !isFeatureLocked(session.planId, featureFlags, "student_messaging", session.testerAccess, session.hasFitzExpress, session.planPreinscriptionId)
});

if (window.lucide) lucide.createIcons();

return session;

}).catch((error) => {

console.warn("Vérification de session ignorée sur une page publique :", error);
return null;

});

}
