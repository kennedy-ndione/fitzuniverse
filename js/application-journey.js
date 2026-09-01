/**
* ============================================================
* FitzUniverse — parcours guidé par candidature (5 étapes)
* ============================================================
*
* Calcule l'état RÉEL des 5 étapes de dépôt d'une candidature, à
* partir des mêmes données Firestore que le reste du site (checklist,
* lettre générée, vérification Fitz, revue conseiller) — aucune étape
* ne peut s'afficher "faite" sans l'être. Partagé entre applications.js
* (stepper .application-journey affiché sur chaque carte) et
* dashboard.js (carte coach "candidature à finaliser"), pour ne
* jamais dupliquer cette définition.
* ============================================================
*/

import { PROFILE_READY_THRESHOLD } from "./profile-score.js";

/**
* @param {Object} app - document users/{uid}/applications/{id}
* @param {Object} options
* @param {number} options.profileScore - calculateAiScore(profile)
* @param {boolean} [options.advisorUnlocked=false] - accès à "advisor" pour ce compte
* @param {Array} [options.advisorRequests=[]] - users/{uid}/advisorRequests déjà chargées
* @returns {Array<{id:string,label:string,icon:string,done:boolean,href?:string,action?:string,isFitz?:boolean}>}
*/
export function computeJourneySteps(app, { profileScore = 0, advisorUnlocked = false, advisorRequests = [] } = {}) {

const checklist = Array.isArray(app.checklist) ? app.checklist : [];
const checklistTotal = checklist.length;
const checklistDone = checklist.filter((item) => item.status === "complete").length;

const hasProcessedAdvisorRequest = advisorRequests.some(
(request) => request.applicationId === app.id && request.status === "traite"
);

const steps = [
{
id: "profile",
label: "Profil complété",
icon: "user-round",
done: profileScore >= PROFILE_READY_THRESHOLD,
href: "profile.html"
},
{
id: "checklist",
label: "Dossier de candidature",
icon: "clipboard-list",
done: checklistTotal > 0 && checklistDone === checklistTotal,
action: "focus-checklist"
},
{
id: "letter",
label: "Lettre de motivation",
icon: "pen-line",
done: !!app.generatedLetter,
href: `ai-letter.html?applicationId=${app.id}`,
isFitz: true
},
{
id: "readiness",
label: "Vérifiée par Fitz",
icon: "shield-check",
done: !!(app.fitzReadiness && app.fitzReadiness.ready),
action: "run-readiness",
isFitz: true
}
];

if (advisorUnlocked) {
steps.push({
id: "advisor",
label: "Revue conseiller",
icon: "user-check",
done: hasProcessedAdvisorRequest,
href: `advisor.html?applicationId=${app.id}&university=${encodeURIComponent(app.university || "")}`
});
}

return steps;

}

export function isJourneyComplete(steps) {
return steps.every((step) => step.done);
}
