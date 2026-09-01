/**
* ============================================================
* FitzUniverse — erreurs de Fitz
* ============================================================
*
* Aujourd'hui, Fitz ne peut échouer que d'une seule façon : le
* simulateur lève une erreur, et chaque page affiche le même message,
* « la génération n'a pas abouti cette fois — réessayez ».
*
* Le jour où un vrai fournisseur répond à la place du simulateur, ce
* message unique devient FAUX dans la majorité des cas. Un étudiant à
* qui l'on dit « réessayez » alors que son quota mensuel est épuisé
* réessaiera — dix fois — puis conclura que le site est cassé. Celui
* dont la connexion a lâché, lui, doit réessayer. Celui dont le texte
* dépasse la limite du modèle doit le raccourcir, pas réessayer.
*
* Ce fichier fige donc la LISTE DES FAÇONS DONT FITZ PEUT ÉCHOUER,
* avant même d'avoir un fournisseur. Chaque code porte trois choses :
*
*   - un message en français, écrit pour l'étudiant, qui dit ce qui
*     s'est passé ET quoi faire ensuite ;
*   - `reessayable` : le client peut-il relancer tout seul ?
*   - `signalable` : faut-il en informer l'équipe (console/analytics) ?
*     Un quota atteint est un fonctionnement normal, pas un incident.
*
* Les pages n'ont plus qu'à faire :
*
*     catch (error) {
*       if (estArret(error)) return;
*       showToast(messageErreurFitz(error), { type: "error" });
*     }
*
* RÈGLE : ne jamais afficher `error.message` brut à l'étudiant. Le
* message d'un fournisseur est en anglais, technique, et peut contenir
* des identifiants de requête. Toujours passer par messageErreurFitz().
* ============================================================
*/

/**
* Codes d'échec. Ce sont eux le contrat : ils ne changent pas quand le
* fournisseur change, et une page peut s'y fier pour adapter son
* comportement (proposer une offre sur QUOTA_PLAN, par exemple).
*/
export const CODES = {

/** L'étudiant a appuyé sur « Arrêter ». Ce n'est pas une erreur. */
ARRET_DEMANDE: "ARRET_DEMANDE",

/** Le réseau n'a pas répondu : coupure, portail Wi-Fi, DNS. */
RESEAU: "RESEAU",

/** La réponse a dépassé le délai maximum accordé. */
DELAI: "DELAI",

/** L'offre de l'étudiant ne donne pas droit à cet outil, ou son
* quota du mois est épuisé. Fonctionnement normal, pas un incident. */
QUOTA_PLAN: "QUOTA_PLAN",

/** FitzUniverse a dépassé SON quota chez le fournisseur. L'étudiant
* n'y est pour rien et ne peut rien y faire — mais nous, si. */
QUOTA_FOURNISSEUR: "QUOTA_FOURNISSEUR",

/** La clé de la passerelle est absente, expirée ou refusée. Panne de
* configuration de notre côté. */
AUTH: "AUTH",

/** Le fournisseur a refusé de répondre au contenu envoyé. */
CONTENU_REFUSE: "CONTENU_REFUSE",

/** Le texte envoyé dépasse ce que le modèle peut lire. */
ENTREE_TROP_LONGUE: "ENTREE_TROP_LONGUE",

/** Le fournisseur est en panne ou en surcharge (5xx). */
FOURNISSEUR_INDISPONIBLE: "FOURNISSEUR_INDISPONIBLE",

/** La réponse est arrivée mais n'a pas la forme attendue. Concerne
* surtout les tâches structurées (« check », « readiness ») : un
* modèle peut renvoyer du JSON incomplet ou entouré de prose. */
REPONSE_INVALIDE: "REPONSE_INVALIDE",

/** Tout le reste. */
INCONNU: "INCONNU"

};

/**
* Le message est écrit pour être lu par un étudiant qui vient de perdre
* trois minutes de travail. Il dit ce qui s'est passé sans jargon, puis
* la seule action utile. Aucun ne s'excuse deux fois, aucun n'accuse
* l'étudiant, et aucun ne promet un délai que nous ne tenons pas.
*/
const DESCRIPTIONS = {

[CODES.ARRET_DEMANDE]: {
message: "Génération arrêtée.",
reessayable: true,
signalable: false
},

[CODES.RESEAU]: {
message: "Fitz n'a pas pu être joint — vérifiez votre connexion, puis relancez. Ce que vous avez saisi est conservé.",
reessayable: true,
signalable: false
},

[CODES.DELAI]: {
message: "Fitz a mis trop de temps à répondre. Relancez : c'est presque toujours passager.",
reessayable: true,
signalable: true
},

[CODES.QUOTA_PLAN]: {
message: "Votre formule actuelle ne couvre plus cette demande ce mois-ci. Vos documents déjà générés restent accessibles.",
reessayable: false,
signalable: false
},

[CODES.QUOTA_FOURNISSEUR]: {
message: "Fitz est très sollicité en ce moment. Réessayez dans quelques minutes — le problème est de notre côté, pas du vôtre.",
reessayable: true,
signalable: true
},

[CODES.AUTH]: {
message: "Fitz est momentanément indisponible. Notre équipe est prévenue — réessayez un peu plus tard.",
reessayable: false,
signalable: true
},

[CODES.CONTENU_REFUSE]: {
message: "Fitz n'a pas pu traiter ce contenu. Reformulez votre demande, ou retirez la pièce jointe concernée.",
reessayable: false,
signalable: true
},

[CODES.ENTREE_TROP_LONGUE]: {
message: "Le texte envoyé est trop long pour être traité en une fois. Découpez-le en deux parties, puis relancez.",
reessayable: false,
signalable: false
},

[CODES.FOURNISSEUR_INDISPONIBLE]: {
message: "Fitz ne répond pas pour l'instant. Réessayez dans quelques minutes — vos données sont conservées.",
reessayable: true,
signalable: true
},

[CODES.REPONSE_INVALIDE]: {
message: "La réponse de Fitz est arrivée incomplète. Relancez — cela n'arrive qu'occasionnellement.",
reessayable: true,
signalable: true
},

[CODES.INCONNU]: {
message: "La demande n'a pas abouti cette fois. Relancez — Fitz reste à votre disposition.",
reessayable: true,
signalable: true
}

};

/**
* Erreur de Fitz. Porte un code stable, et garde la cause d'origine
* pour la console sans jamais l'exposer à l'étudiant.
*/
export class FitzError extends Error {

/**
* @param {string} code - une valeur de CODES
* @param {Object} [options]
* @param {unknown} [options.cause] - l'erreur d'origine
* @param {string} [options.detail] - contexte technique, pour la console
*/
constructor(code, options = {}) {

const description = DESCRIPTIONS[code] || DESCRIPTIONS[CODES.INCONNU];

super(description.message);

this.name = "FitzError";
this.code = DESCRIPTIONS[code] ? code : CODES.INCONNU;
this.reessayable = description.reessayable;
this.signalable = description.signalable;
this.detail = options.detail || "";

if (options.cause !== undefined) {
this.cause = options.cause;
}

}

}

/**
* Message à afficher à l'étudiant, quelle que soit l'erreur reçue.
* Accepte aussi bien une FitzError qu'une erreur brute d'un fournisseur
* ou d'une extension de navigateur : le message par défaut reste
* correct, jamais du texte technique en anglais.
*
* @param {unknown} erreur
* @returns {string}
*/
export function messageErreurFitz(erreur) {

if (erreur instanceof FitzError) {
return erreur.message;
}

if (estArret(erreur)) {
return DESCRIPTIONS[CODES.ARRET_DEMANDE].message;
}

return DESCRIPTIONS[CODES.INCONNU].message;

}

/**
* Vrai si l'étudiant a lui-même arrêté la génération. À tester EN
* PREMIER dans un catch : il ne faut alors afficher aucune erreur, il
* n'a rien raté.
*
* Reconnaît la FitzError comme l'AbortError natif, parce que le signal
* d'un AbortController traverse fetch() sans passer par nous.
*
* @param {unknown} erreur
* @returns {boolean}
*/
export function estArret(erreur) {

if (erreur instanceof FitzError) {
return erreur.code === CODES.ARRET_DEMANDE;
}

return !!erreur && erreur.name === "AbortError";

}

/**
* Traduit un statut HTTP de la passerelle en code Fitz. Isolé ici pour
* que la correspondance soit visible et testable sans réseau.
*
* @param {number} statut
* @returns {string} une valeur de CODES
*/
export function codeDepuisStatutHttp(statut) {

if (statut === 401 || statut === 403) return CODES.AUTH;
if (statut === 402) return CODES.QUOTA_PLAN;
if (statut === 413) return CODES.ENTREE_TROP_LONGUE;
if (statut === 422) return CODES.CONTENU_REFUSE;
if (statut === 429) return CODES.QUOTA_FOURNISSEUR;
if (statut === 408 || statut === 504) return CODES.DELAI;
if (statut >= 500) return CODES.FOURNISSEUR_INDISPONIBLE;

return CODES.INCONNU;

}

/**
* Vrai si relancer la même requête a une chance d'aboutir. Sert au
* réessai automatique de js/ai/ai-client.js — qui ne relance donc
* JAMAIS sur un quota atteint, un contenu refusé ou une entrée trop
* longue : ce serait perdre du temps et, sur un vrai fournisseur,
* facturer une requête vouée à échouer.
*
* @param {unknown} erreur
* @returns {boolean}
*/
export function estReessayable(erreur) {

if (estArret(erreur)) return false;

if (erreur instanceof FitzError) {
return erreur.reessayable && erreur.code !== CODES.ARRET_DEMANDE;
}

return false;

}
