/**
* ============================================================
* ScholarBridge — Mon conseiller (advisor.js)
* ============================================================
* Page d'accompagnement humain (Signature Focus / Signature). Ne
* réinvente aucun système de messagerie : le fil de messages
* admin → étudiant existe déjà (js/student-messages.js, cloche du
* topbar, déjà initialisé par bootstrapShell()) — cette page se
* contente d'expliquer le service et de donner un contact WhatsApp
* réel (même numéro que la reassurance de offers.html).
*
* Aucun système de rendez-vous/visioconférence n'existe dans le
* projet à ce jour : on ne simule pas une fonctionnalité qui n'existe
* pas (voir DESIGN_SYSTEM.md / mémoire projet). Cette page sera
* étendue le jour où un vrai système de prise de rendez-vous existera.
* ============================================================
*/

import { initShellChrome, bootstrapShell, isFeatureLocked, PLAN_LABELS } from "./js/app-shell.js";

initShellChrome();

const ADVISOR_INTRO = {
"signature-focus": "Un conseiller humain suit vos candidatures aux côtés de Fitz. Les messages qu'il vous envoie apparaissent dans la cloche de notifications en haut de cette page.",
signature: "Votre conseiller dédié suit l'ensemble de vos candidatures aux côtés de Fitz, avec des points d'étape réguliers. Les messages qu'il vous envoie apparaissent dans la cloche de notifications en haut de cette page."
};

function renderLockedState(container, ctx) {

container.innerHTML = `
<div class="ai-locked-hero">
<div class="ai-locked-icon"><i data-lucide="lock"></i></div>
<h2>Mon conseiller</h2>
<p>L'accompagnement par un conseiller humain est disponible avec les formules <strong>${PLAN_LABELS["signature-focus"]}</strong> et <strong>${PLAN_LABELS.signature}</strong>. Fitz reste disponible pour vous accompagner dans votre formule actuelle.</p>
<a href="offers.html#signature-focus" class="btn btn-primary">
<i data-lucide="sparkles"></i>
<span>Découvrir l'accompagnement humain</span>
</a>
</div>
`;

container.hidden = false;

if (window.lucide) lucide.createIcons();

}

function initAdvisorPage(ctx) {

const introEl = document.getElementById("advisorIntroText");

if (introEl) introEl.textContent = ADVISOR_INTRO[ctx.planId] || ADVISOR_INTRO["signature-focus"];

const sectionLabel = document.getElementById("advisorSectionLabel");
const sectionNav = document.getElementById("advisorSectionNav");

if (sectionLabel) sectionLabel.hidden = false;
if (sectionNav) sectionNav.hidden = false;

}

bootstrapShell({ feature: "advisor" }).then((ctx) => {

if (ctx.locked) {

document.getElementById("advisorApp").remove();
renderLockedState(document.getElementById("lockedState"), ctx);
return;

}

initAdvisorPage(ctx);

});
