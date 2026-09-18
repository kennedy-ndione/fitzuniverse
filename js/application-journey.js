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
import { SLUGS } from "./documents-slugs.js";
import { ICONES_TYPE } from "./procedures/vocabulaire.js";
import { jalonDeCampagne } from "./pays-preinscription.js";

/**
* LA PROCÉDURE DE PORTAIL (lot E2, 2026-09-07). Quand la candidature est
* une PRÉINSCRIPTION et que l'appelant a trouvé une procédure connue
* (js/procedures/index.js, trouverProcedure — il connaît le catalogue et
* le profil, pas ce module), chaque étape de la procédure devient une
* étape du parcours, insérée ENTRE « preuve de ressources » et le dépôt
* (donc avant la revue conseiller). Aucun nouveau mécanisme de guidage :
* les prérequis de l'étape nourrissent qualifierEtapes() (js/next-
* action.js), l'échéance vient du calendrier de js/pays-preinscription.js.
*
*   done = l'étudiant l'a cochée ET, si une preuve est attendue, la
*          preuve est présente — champ app.procedure[idEtape] =
*          { faite, preuve, faitLe }.
*
* Parcours BOURSE : aucune injection, quoi que dise l'université.
*/
// Exportée depuis le lot PRÉ-FITZ : la vérification avant dépôt d'une
// préinscription se juge sur CES étapes (applications.js →
// computeApplicationReadiness), pas sur le barème d'une bourse.
export function etapesDeProcedure(app, procedure, aujourdhui) {

if (!procedure || !Array.isArray(procedure.etapes) || lireParcours(app) !== "preinscription") return [];

const etat = app && app.procedure && typeof app.procedure === "object" ? app.procedure : {};
// Lot S1b : les jalons sont ceux de la COUCHE de résidence. Sans couche,
// composerProcedure a déjà retiré les échéances — aucune date d'un autre
// pays ne peut donc arriver jusqu'ici.
const jalons = (procedure.faits && procedure.faits.calendrier && procedure.faits.calendrier.jalons) || undefined;

return procedure.etapes.map((e) => {

const saisie = etat[e.id] && typeof etat[e.id] === "object" ? etat[e.id] : null;
const preuvePresente = e.preuve === "aucune" || !!(saisie && typeof saisie.preuve === "string" && saisie.preuve.trim());
const jalon = e.echeance && e.echeance.depuis === "calendrier" ? jalonDeCampagne(e.echeance.cle, aujourdhui, jalons) : null;

return {
id: e.id,
label: e.titre,
icon: ICONES_TYPE[e.type] || "circle-help",
done: !!(saisie && saisie.faite === true && preuvePresente),
action: "procedure",
prerequis: [...(e.prerequis || [])],
procedure: {
type: e.type,
consigne: e.consigne,
fiabilite: e.fiabilite,
preuve: e.preuve,
pieces: e.pieces || [],
montant: e.montant,
devise: e.devise,
source: e.source,
verifieLe: e.verifieLe,
echeanceISO: jalon ? jalon.iso : null,
echeanceLibelle: jalon ? jalon.libelle : "",
echeanceDebut: jalon ? jalon.debut : false,
saisie
}
};

});

}

/**
* @param {Object} app - document users/{uid}/applications/{id}
* @param {Object} options
* @param {number} options.profileScore - calculateAiScore(profile)
* @param {boolean} [options.advisorUnlocked=false] - accès à "advisor" pour ce compte
* @param {Array} [options.advisorRequests=[]] - users/{uid}/advisorRequests déjà chargées
* @param {Object} [options.documentsObtained={}] - users/{uid}.documentsObtained, map { slug: true }
* @param {Object|null} [options.procedure=null] - la procédure de portail (js/procedures/index.js, trouverProcedure) — préinscription seulement
* @param {Date} [options.aujourdhui] - pour dater les jalons de campagne
* @returns {Array<{id:string,label:string,icon:string,done:boolean,href?:string,action?:string,isFitz?:boolean,prerequis?:string[],procedure?:Object}>}
*/
export function computeJourneySteps(app, { profileScore = 0, advisorUnlocked = false, advisorRequests = [], documentsObtained = {}, procedure = null, aujourdhui = new Date() } = {}) {

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

const voeu = lireParcours(app) === "preinscription";

const steps = [
{
id: "profile",
label: "Profil complété",
icon: "user-round",
done: profileScore >= PROFILE_READY_THRESHOLD,
href: "profile.html"
}
];

// « DOSSIER DE CANDIDATURE » N'EXISTE PAS SUR UN VŒU (lot B2-bis,
// 2026-09-18). Le lot B2 a retiré ce bloc de la carte d'un vœu — les
// pièces d'une préinscription vivent à l'étape 4 de la route, au
// niveau du DOSSIER, pas du vœu. L'étape du parcours qui pointait
// dessus (`action: "focus-checklist"`) visait donc un bloc absent :
// le clic ne faisait plus rien, et son état « fait / pas fait » se
// calculait sur une liste que plus personne ne remplit.
//
// On ne la remplace pas par un `done` deviné : l'état des pièces vit
// dans dossierFrance.pieces, que cette fonction ne reçoit pas, et
// inventer « pas fait » serait un fait faux. L'étape 4 de la route
// porte déjà ce suivi, avec la liste exacte du pays.
if (!voeu) {
steps.push({
id: "checklist",
label: "Dossier de candidature",
icon: "clipboard-list",
done: checklistTotal > 0 && checklistDone === checklistTotal,
action: "focus-checklist"
});
}

if (voeu) {

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
},
// Lot E2 : la procédure de portail, entre la preuve de ressources et
// le dépôt. Vide sans procédure connue.
...etapesDeProcedure(app, procedure, aujourdhui)
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
