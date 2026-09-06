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
* (fermée au plan Gratuit — js/plan-features.js).
* ============================================================
*/

import { initShellChrome, bootstrapShell, isFeatureLocked } from "./app-shell.js";
import { initMessagesPage } from "./student-messages.js";

initShellChrome();

bootstrapShell({}).then((ctx) => {

initMessagesPage(ctx.user.uid, {
canReply: !isFeatureLocked(ctx.planId, ctx.featureFlags, "student_messaging", ctx.testerAccess, ctx.hasFitzExpress)
});

if (window.lucide) lucide.createIcons();

});
