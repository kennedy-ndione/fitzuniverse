/**
* ============================================================
* ScholarBridge — voix de Fitz (textes partagés)
* ============================================================
*
* Centralise les formulations qu'on veut garder identiques partout où
* Fitz s'exprime, plutôt que codées en dur dans chaque page qui les
* utilise. Démarre avec la vérification finale avant dépôt
* (applications.js) — à enrichir au fil des prochains lots plutôt que
* de repartir sur du texte en dur ailleurs.
* ============================================================
*/

export const FITZ_READINESS_PHRASES = {

readyTitle: "Cette candidature est prête à être déposée.",
readyBody: "Fitz n'a rien détecté de bloquant : dossier complet, lettre générée, profil assez renseigné.",

notReadyTitle(count) {
return `Encore ${count} point${count > 1 ? "s" : ""} à régler avant de déposer.`;
},

notReadyBody: "Voici ce qu'il reste à faire :",

deadlineToday: "La date limite est aujourd'hui.",

deadlineSoon(days) {
return `Il reste ${days} jour${days > 1 ? "s" : ""} avant la date limite.`;
},

deadlinePassed(days) {
const abs = Math.abs(days);
return `La date limite est dépassée depuis ${abs} jour${abs > 1 ? "s" : ""}.`;
},

checkedAtLabel: "Dernière vérification Fitz",

advisorCta: "Demander une revue à mon conseiller avant de déposer"

};
