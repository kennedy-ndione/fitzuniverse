/**
* ============================================================
* FitzUniverse — page « Mes messages » (messages.html)
* ============================================================
* La conversation plein écran avec l'équipe FitzUniverse, en temps
* réel. Toute la logique de fil vit dans js/student-messages.js
* (moteur partagé avec la cloche) ; ce fichier ne fait que monter la
* coquille de l'espace et brancher la surface « page ».
*
* Accessible à TOUTES les formules (chacun lit ses messages) ; le
* droit de RÉPONDRE suit la fonctionnalité "student_messaging"
* (grille A : côté bourses, le Forfait Conseiller et les détenteurs des
* anciennes formules ; côté préinscription, les trois offres — voir
* js/plan-features.js). Toute formule payante a en plus « Signaler un
* problème » (support_ticket, js/support-ticket.js).
* ============================================================
*/

import { initShellChrome, bootstrapShell, isFeatureLocked } from "./app-shell.js";
import { initMessagesPage } from "./student-messages.js";
import { DELAI_REPONSE } from "./delai-reponse.js";
import { initSupportForm } from "./support-ticket.js";

initShellChrome();

// Le délai annoncé, à un seul endroit (grille A).
document.querySelectorAll("[data-delai-reponse]").forEach((el) => { el.textContent = DELAI_REPONSE; });

// Lot FINITIONS-VISUELLES (2026-09-11) : sur téléphone, le bandeau « Vos
// messages arrivent directement… » se replie en une ligne (dashboard.css)
// et se déplie en le touchant. Sur ordinateur il reste entier.
const notice = document.querySelector(".messages-page-notice");
if (notice) {
const replie = window.matchMedia("(max-width:720px)");
const armer = () => {
if (replie.matches) {
notice.setAttribute("role", "button");
notice.setAttribute("tabindex", "0");
notice.setAttribute("aria-expanded", notice.classList.contains("is-open") ? "true" : "false");
} else {
notice.removeAttribute("role");
notice.removeAttribute("tabindex");
notice.removeAttribute("aria-expanded");
}
};
const basculer = () => {
if (!replie.matches) return;
const ouvert = notice.classList.toggle("is-open");
notice.setAttribute("aria-expanded", ouvert ? "true" : "false");
};
notice.addEventListener("click", basculer);
notice.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); basculer(); } });
if (typeof replie.addEventListener === "function") replie.addEventListener("change", armer);
armer();
}

bootstrapShell({}).then((ctx) => {

initMessagesPage(ctx.user.uid, {
canReply: !isFeatureLocked(ctx.planId, ctx.featureFlags, "student_messaging", ctx.testerAccess, ctx.hasFitzExpress, ctx.planPreinscriptionId)
});

// « Signaler un problème » : toute formule payante, jamais le gratuit
// (grille A, fonctionnalité "support_ticket").
if (!isFeatureLocked(ctx.planId, ctx.featureFlags, "support_ticket", ctx.testerAccess, ctx.hasFitzExpress, ctx.planPreinscriptionId)) {
initSupportForm(ctx);
}

if (window.lucide) lucide.createIcons();

});
