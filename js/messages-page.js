/**
* ============================================================
* FitzUniverse — page « Mes messages » (messages.html)
* ============================================================
* La conversation plein écran avec l'équipe FitzUniverse, en temps
* réel. Toute la logique de fil vit dans js/student-messages.js
* (moteur partagé avec la cloche) ; ce fichier ne fait que monter la
* coquille de l'espace et brancher la surface « page ».
*
* Accessible à TOUS les comptes, gratuits compris ; le droit d'ÉCRIRE
* suit la fonctionnalité "student_messaging", universelle depuis le
* 2026-09-23 (DROITS_UNIVERSELS, js/plan-features.js). Toute formule payante a en plus « Signaler un
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

// Lot CHAT-VIVANT (2026-09-19) : le repli/dépli du bandeau
// « .messages-page-notice » a été retiré ici en même temps que le
// bandeau lui-même (messages.html). Il existait parce qu'une phrase de
// trois lignes ne tenait pas sur un cadre plein écran qui ne défile
// pas : elle écrasait la conversation. Trois faits courts
// (.messages-faits) tiennent à toutes les largeurs — le correctif
// disparaît avec le défaut qu'il corrigeait.

bootstrapShell({}).then((ctx) => {

// MESSAGERIE POUR TOUS (2026-09-23) : un compte gratuit n'est plus
// reconduit à son espace — il lit ses messages ET écrit à l'équipe.
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
