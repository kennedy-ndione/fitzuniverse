/**
* ============================================================
* Fitz — la carte du voyage (6 phases, de l'inscription au départ)
* ============================================================
*
* Refonte de l'espace étudiant du 2026-08-30 : l'espace n'est plus un
* tableau de bord à sidebar mais UN PARCOURS — six phases qui couvrent
* le voyage entier, du profil jusqu'au visa. Ce module calcule l'état
* de chaque phase à partir des données RÉELLES (mêmes sources que
* js/application-journey.js et js/next-action.js — jamais une deuxième
* définition d'une étape) : aucune phase ne peut s'afficher « faite »
* sans l'être.
*
* Fonctions pures : aucun DOM, aucun Firestore — testables, et
* réutilisables le jour où une autre surface (admin, e-mails) voudra
* dire où en est un étudiant.
* ============================================================
*/

import { PROFILE_READY_THRESHOLD } from "./profile-score.js";
import { isJourneyComplete } from "./application-journey.js";

/**
* Statuts d'une candidature.
*
* Depuis le 2026-08-30, l'issue d'une réponse est modélisée : `admise`,
* `refusee`, `liste_attente`. `reponse_recue` reste accepté (données
* existantes) et signifie « réponse reçue, issue pas encore précisée » —
* le hub invite alors à préciser. Ces listes sont EXPORTÉES : tout
* filtre par statut dans l'espace étudiant doit venir d'ici, jamais
* d'une liste recopiée à la main.
*/
export const STATUTS_REPONSE = ["reponse_recue", "admise", "refusee", "liste_attente"];
export const STATUTS_DEPOSES = ["deposee", "en_attente", ...STATUTS_REPONSE];

/**
* La checklist visa & départ (phase 06) — les 6 étapes du guide de
* dashboard.html, avec un `id` stable : l'état coché est persisté dans
* le document utilisateur (champ `visaChecklist`, map id → bool).
* Le contenu pédagogique vit dans dashboard.html ; ici, seulement ce
* qu'il faut pour mesurer la phase.
*/
export const VISA_ETAPES = ["pieces", "finances", "rdv_visa", "assurance", "logement", "depart"];

/** Vrai quand les 6 étapes visa sont cochées. */
export function visaComplete(visaChecklist = {}) {
return VISA_ETAPES.every((id) => visaChecklist && visaChecklist[id] === true);
}

/**
* Les 6 phases du voyage. `id` est stable (ancres, classes CSS) ;
* le contenu marketing vit dans dashboard.html, pas ici.
*/
export const PHASES = [
{ id: "profil", label: "Profil", icon: "user-round" },
{ id: "opportunites", label: "Opportunités", icon: "compass" },
{ id: "dossiers", label: "Dossiers", icon: "clipboard-list" },
{ id: "depot", label: "Dépôt", icon: "send" },
{ id: "reponse", label: "Réponse", icon: "award" },
{ id: "depart", label: "Visa & départ", icon: "plane" }
];

/**
* LES MÊMES PHASES, DEUX VOCABULAIRES (lot S4).
*
* Les six phases décrivaient un parcours BOURSE et étaient servies aux
* deux : « Opportunités » et « Réponse » (icône coupe) ne veulent rien
* dire pour quelqu'un qui prépare une préinscription qu'il finance
* lui-même. Il ne cherche pas une opportunité, il choisit un
* établissement ; il n'attend pas un prix, il attend une admission.
*
* LES `id` NE CHANGENT PAS, et c'est le point : ce sont eux que
* etatDesPhases() mesure, que les ancres visent et que le CSS habille.
* On dédouble les LIBELLÉS et l'ordre, jamais le moteur — deux moteurs,
* c'est deux définitions de « dossier prêt » qui divergent au premier
* correctif.
*/
export const PHASES_PAR_ESPACE = {
bourse: PHASES,
preinscription: [
{ id: "profil", label: "Profil", icon: "user-round" },
{ id: "opportunites", label: "Établissements", icon: "landmark" },
{ id: "dossiers", label: "Dossiers", icon: "clipboard-list" },
{ id: "depot", label: "Dépôt", icon: "send" },
{ id: "reponse", label: "Admission", icon: "mail" },
{ id: "depart", label: "Visa & départ", icon: "plane" }
]
};

/** Les phases d'un espace ; celles du parcours bourse par défaut. */
export function phasesDe(espace) {
return PHASES_PAR_ESPACE[espace] || PHASES;
}

/**
* État des 6 phases.
*
* Définitions — chacune adossée à une donnée réelle :
*  1. profil       : calculateAiScore(profil) ≥ seuil (PROFILE_READY_THRESHOLD)
*  2. opportunites : au moins une candidature suivie (l'étudiant a CHOISI)
*  3. dossiers     : au moins une candidature dont toutes les étapes de
*                    préparation sont faites (computeJourneySteps), ou
*                    déjà déposée — le dossier a atteint l'état « prêt »
*  4. depot        : au moins une candidature au statut déposé ou au-delà
*  5. reponse      : au moins une réponse reçue (issue précisée ou non)
*  6. depart       : une admission enregistrée (statut « admise ») ET
*                    les 6 étapes de la checklist visa cochées
*                    (champ `visaChecklist` du document utilisateur —
*                    depuis le 2026-08-30, la phase est mesurable).
*
* `courante` = la première phase non faite. Les phases après la
* courante ne sont pas verrouillées (l'étudiant reste libre), elles
* sont simplement « à venir ».
*
* @param {Object} ctx
* @param {number} ctx.profileScore
* @param {Array}  ctx.applications - chacune avec `etapes` (computeJourneySteps) déjà calculées
* @returns {{phases: Array, couranteId: string, progressionPct: number}}
*/
export function etatDesPhases({ profileScore = 0, applications = [], visaChecklist = {}, espace = "bourse" } = {}) {

// Les libellés et l ordre changent d un espace à l autre ; la MESURE,
// elle, est la même pour les deux.
const listePhases = phasesDe(espace);

const aUneCandidature = applications.length > 0;

const dossierPret = applications.some((app) =>
STATUTS_DEPOSES.includes(app.status) ||
(Array.isArray(app.etapes) && app.etapes.length > 0 && isJourneyComplete(app.etapes))
);

const aDepose = applications.some((app) => STATUTS_DEPOSES.includes(app.status));
const aReponse = applications.some((app) => STATUTS_REPONSE.includes(app.status));

// LE DÉPART SUPPOSE UNE ADMISSION (lot DÉPART, 2026-09-21). La phase 06
// n'était mesurée que sur les six cases du guide visa : un compte sans
// aucune réponse d'université cochait les six et lisait « vous êtes
// prêt(e). Bon voyage ! », phase « faite », pendant que la phase 05
// restait « à venir ». Les cases restent libres (on peut préparer son
// passeport avant d'être admis) ; c'est leur SENS qui attend une
// admission enregistrée.
const aAdmission = applications.some((app) => app.status === "admise");

const faits = {
profil: profileScore >= PROFILE_READY_THRESHOLD,
opportunites: aUneCandidature,
dossiers: dossierPret,
depot: aDepose,
reponse: aReponse,
depart: aAdmission && visaComplete(visaChecklist)
};

let couranteId = listePhases[listePhases.length - 1].id;

for (const phase of listePhases) {
if (!faits[phase.id]) { couranteId = phase.id; break; }
}

const phases = listePhases.map((phase) => ({
...phase,
faite: faits[phase.id],
courante: phase.id === couranteId
}));

// Depuis que la checklist visa existe (2026-08-30), les 6 phases
// sont mesurables : la progression se calcule sur toutes.
const progressionPct = Math.round(
(phases.filter((p) => p.faite).length / phases.length) * 100
);

return { phases, couranteId, progressionPct };

}

/**
* Radar d'échéances : les candidatures non encore déposées, triées par
* proximité de leur date limite. Les dates viennent du champ `deadline`
* des candidatures (saisi au format date sur applications.html) —
* jamais une date devinée.
*
* @returns {Array<{app, jours:number}>} au plus `max` entrées datées
*/
export function radarEcheances(applications = [], max = 3, aujourdhui = new Date()) {

const jour = new Date(aujourdhui);
jour.setHours(0, 0, 0, 0);

return applications
.filter((app) => !STATUTS_DEPOSES.includes(app.status))
// Depuis la passe espace étudiant 1/3 (2026-09-06) : quand la
// candidature est liée à sa fiche (`app.echeance`, posé par
// dashboard.js), un cycle CLOS sort du radar — un radar qui compte à
// rebours vers une porte fermée est pire que vide.
.filter((app) => !(app.echeance && app.echeance.lie && app.echeance.etat && app.echeance.etat.ouvert === false))
.map((app) => {

// La date ferme du catalogue d'abord ; sinon (hors catalogue, ou
// « Selon votre pays ») la date saisie par l'étudiant — calcul
// d'origine, inchangé.
const etat = app.echeance && app.echeance.lie ? app.echeance.etat : null;
if (etat && etat.jours !== null && etat.jours !== undefined) return { app, jours: etat.jours };

if (!app.deadline) return null;
const cible = new Date(`${app.deadline}T00:00:00`);
if (Number.isNaN(cible.getTime())) return null;
cible.setHours(0, 0, 0, 0);
return { app, jours: Math.round((cible - jour) / 86400000) };
})
.filter(Boolean)
.sort((a, b) => a.jours - b.jours)
.slice(0, max);

}

/**
* Ton d'une échéance — mêmes fenêtres que js/next-action.js (3 / 14), et
* DÉLIBÉRÉMENT différentes de celles de js/echeance.js (14 / 60). Voir
* le commentaire au-dessus de JOURS_CRITIQUE dans js/next-action.js :
* deux publics, deux horizons, le même mot. Ne pas les uniformiser.
*
* Depuis la passe 1 (2026-09-06), une candidature LIÉE au catalogue
* prend son ton de etatCandidature() : cette fonction ne sert plus
* qu'aux candidatures hors catalogue, dont l'étudiant a saisi la date
* lui-même.
*/
export function tonEcheance(jours) {
if (jours < 0 || jours <= 3) return "critique";
if (jours <= 14) return "haute";
return "normale";
}
