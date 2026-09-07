/**
* ============================================================
* FitzUniverse — parcours guidé par candidature
* ============================================================
*
* Calcule l'état RÉEL des étapes de dépôt d'une candidature, à
* partir des mêmes données Firestore que le reste du site (checklist,
* lettre générée, vérification Fitz, revue conseiller, documents
* obtenus) — aucune étape ne peut s'afficher "faite" sans l'être.
* Partagé entre applications.js (stepper .application-journey affiché
* sur chaque carte) et dashboard.js (carte coach "candidature à
* finaliser"), pour ne jamais dupliquer cette définition.
*
* DEUX PARCOURS, PAS UN (lot B du chantier préinscription, 2026-09-07)
* --------------------------------------------------------------------
* Une candidature à une BOURSE est un concours : on convainc un jury
* (lettre de motivation, vérification Fitz avant dépôt). Une
* PRÉINSCRIPTION — l'admission que l'étudiant finance lui-même — est
* une CONFORMITÉ : on prouve que le dossier est complet, traduit,
* légalisé, et que les ressources existent. Les étapes ne sont donc
* pas les mêmes. Le parcours se lit sur la candidature elle-même
* (js/parcours.js, champ `track`, défaut « bourse » à la lecture).
*
*   bourse          profile / checklist / letter / readiness / advisor*
*   preinscription  profile / checklist / traductions / ressources / advisor*
*                                                    (* si débloqué)
*
* PAS d'étape « Vérifiée par Fitz » en préinscription : Fitz est en
* mode simulé (réparation IA du 2026-09-05). On n'ouvre pas un parcours
* neuf sur une vérification qui n'existe pas encore. C'est une
* décision, pas un oubli.
*
* Les étapes « documents » LISENT users/{uid}.documentsObtained (la map
* { slug: true } écrite par documents.html, et par elle seule) via les
* slugs exportés par js/documents-data.js — jamais un titre recopié.
* ============================================================
*/

import { PROFILE_READY_THRESHOLD } from "./profile-score.js";
import { lireParcours } from "./parcours.js";
import { SLUGS } from "./documents-data.js";

/**
* @param {Object} app - document users/{uid}/applications/{id}
* @param {Object} options
* @param {number} options.profileScore - calculateAiScore(profile)
* @param {boolean} [options.advisorUnlocked=false] - accès à "advisor" pour ce compte
* @param {Array} [options.advisorRequests=[]] - users/{uid}/advisorRequests déjà chargées
* @param {Object} [options.documentsObtained={}] - users/{uid}.documentsObtained, map { slug: true }
* @returns {Array<{id:string,label:string,icon:string,done:boolean,href?:string,action?:string,isFitz?:boolean}>}
*/
export function computeJourneySteps(app, { profileScore = 0, advisorUnlocked = false, advisorRequests = [], documentsObtained = {} } = {}) {

const checklist = Array.isArray(app.checklist) ? app.checklist : [];
const checklistTotal = checklist.length;
const checklistDone = checklist.filter((item) => item.status === "complete").length;

const hasProcessedAdvisorRequest = advisorRequests.some(
(request) => request.applicationId === app.id && request.status === "traite"
);

// Lecture défensive : la map peut être absente, null, ou d'un autre
// type sur un vieux compte. Rien de tout cela ne doit lever.
const obtenus = documentsObtained && typeof documentsObtained === "object" ? documentsObtained : {};
const obtenu = (slug) => obtenus[slug] === true;

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
}
];

if (lireParcours(app) === "preinscription") {

steps.push(
{
id: "traductions",
label: "Traductions et légalisations",
icon: "languages",
done: obtenu(SLUGS.traductions) && (obtenu(SLUGS.legalisation) || obtenu(SLUGS.copies)),
href: "documents.html?categorie=administratif"
},
{
id: "ressources",
label: "Preuve de ressources",
icon: "wallet",
done: obtenu(SLUGS.ressources) || obtenu(SLUGS.bancaire),
href: "documents.html?categorie=financier"
}
);

} else {

steps.push(
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
);

}

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
