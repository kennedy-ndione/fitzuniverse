/**
* ============================================================
* FitzUniverse — Mon conseiller (advisor.js)
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

import { db } from "./firebase-config.js";
import { collection, addDoc, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { initShellChrome, bootstrapShell, PLAN_LABELS, isFeatureLocked } from "./js/app-shell.js";
import { showToast } from "./js/ai/toast.js";
import { trackEvent } from "./js/analytics.js";

initShellChrome();

const ADVISOR_INTRO = {
"signature-focus": "Un conseiller humain suit vos candidatures aux côtés de Fitz. Les messages qu'il vous envoie apparaissent dans la cloche de notifications en haut de cette page.",
signature: "Votre conseiller dédié suit l'ensemble de vos candidatures aux côtés de Fitz, avec des points d'étape réguliers. Les messages qu'il vous envoie apparaissent dans la cloche de notifications en haut de cette page."
};

// Ce que le conseiller humain apporte RÉELLEMENT, tel que le code le
// permet aujourd'hui — pas une promesse commerciale. Chaque ligne
// correspond à quelque chose qui existe : la demande de revue
// (users/{uid}/advisorRequests), les messages qui arrivent dans la
// cloche de notifications, le suivi dans la durée d'une candidature.
const CE_QUE_FAIT_LE_CONSEILLER = [
"Il relit votre dossier complet et vous dit ce qui, dans votre candidature précise, fera la différence — un jugement qu'aucune analyse automatique ne rend à votre place.",
"Il vous répond directement : ses messages arrivent dans la cloche de notifications, en haut de cette page.",
"Il suit vos candidatures dans la durée, d'une échéance à la suivante."
];

function renderLockedState(container, ctx) {

// Une page verrouillée qui ne dit que « pas disponible » est un
// cul-de-sac : l'étudiant y arrive avec une question, et repart avec
// un bouton d'achat pour seule réponse. Elle dit maintenant trois
// choses — ce que le conseiller apporte, ce que Fitz fait DÈS
// MAINTENANT à sa place, et comment y accéder. L'action gratuite est
// mise à hauteur de l'action payante, volontairement : proposer une
// vérification par Fitz à quelqu'un qui ne peut pas payer vaut mieux
// que de le laisser sur un mur.
container.innerHTML = `
<div class="ai-locked-hero">
<div class="ai-locked-icon"><i data-lucide="lock"></i></div>
<h2>Un conseiller humain à vos côtés</h2>
<p>L'accompagnement par un conseiller est disponible avec les formules <strong>${PLAN_LABELS["signature-focus"]}</strong> et <strong>${PLAN_LABELS.signature}</strong>.</p>

<ul class="advisor-value">
${CE_QUE_FAIT_LE_CONSEILLER.map((ligne) => `<li>${ligne}</li>`).join("")}
</ul>

<div class="advisor-locked-actions">
<a href="offers.html#signature-focus" class="btn btn-primary">
<span>Découvrir l'accompagnement humain</span>
</a>
<a href="ai-check.html" class="btn btn-secondary">
<span>Faire vérifier mon dossier par Fitz</span>
</a>
</div>

<p class="advisor-locked-note">En attendant, Fitz fait déjà beaucoup : il rédige votre lettre de motivation, vérifie votre dossier avant l'envoi et prépare vos réponses d'entretien. Votre formule actuelle y donne accès.</p>
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

initAdvisorRequestForm(ctx.user.uid);

}

// ==========================================================
// Demande de revue conseiller (users/{uid}/advisorRequests) — canal
// tracé étudiant -> conseiller, à côté du contact WhatsApp existant
// (celui-ci reste pour l'urgence, ce formulaire pour une demande
// qu'on veut retrouver côté admin/student-detail.js). Pré-remplissage
// depuis applications.js (?applicationId=&university=), posé sur le
// résultat de la vérification finale avant dépôt.
async function initAdvisorRequestForm(uid) {

const form = document.getElementById("advisorRequestForm");
if (!form) return;

const select = document.getElementById("advisorRequestApplication");
const textarea = document.getElementById("advisorRequestText");

const params = new URLSearchParams(window.location.search);
const prefillApplicationId = params.get("applicationId") || "";

try {

const snapshot = await getDocs(collection(db, "users", uid, "applications"));

snapshot.docs.forEach((docSnap) => {

const app = docSnap.data();
const option = new Option(
`${app.university}${app.scholarship ? ` — ${app.scholarship}` : ""}`,
docSnap.id
);

select.add(option);

});

if (prefillApplicationId) select.value = prefillApplicationId;

} catch (error) {

console.error("Impossible de charger les candidatures pour le formulaire de revue :", error);

}

form.addEventListener("submit", async (event) => {

event.preventDefault();

const text = textarea.value.trim();
if (!text) return;

const applicationId = select.value || null;
const university = applicationId ? select.options[select.selectedIndex].text : null;

const submitBtn = document.getElementById("advisorRequestSubmit");
submitBtn.disabled = true;

try {

await addDoc(collection(db, "users", uid, "advisorRequests"), {
text,
applicationId,
university,
status: "nouveau",
createdAt: serverTimestamp()
});

form.reset();
trackEvent("advisor_request_sent", {});
showToast("Votre demande a été transmise à votre conseiller.");

} catch (error) {

console.error("Impossible d'envoyer la demande de revue conseiller :", error);
showToast("L'envoi n'a pas abouti cette fois — réessayez dans un instant.", { type: "error" });

} finally {

submitBtn.disabled = false;

}

});

}

bootstrapShell({ feature: "advisor" }).then((ctx) => {

if (ctx.locked) {

document.getElementById("advisorApp").remove();
renderLockedState(document.getElementById("lockedState"), ctx);
return;

}

// WhatsApp direct : réservé à Signature ("whatsapp_direct",
// js/plan-features.js). Les autres formules avec conseiller voient
// l'alternative messagerie FitzUniverse à la place.
const whatsappLocked = isFeatureLocked(ctx.planId, ctx.featureFlags, "whatsapp_direct", ctx.testerAccess, ctx.hasFitzExpress, ctx.planPreinscriptionId);

const whatsappBtn = document.getElementById("advisorWhatsappBtn");
const whatsappAlt = document.getElementById("advisorWhatsappAlt");

if (whatsappBtn) whatsappBtn.hidden = whatsappLocked;
if (whatsappAlt) whatsappAlt.hidden = !whatsappLocked;

initAdvisorPage(ctx);

});
