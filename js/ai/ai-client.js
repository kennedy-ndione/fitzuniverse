/**
* ============================================================
* FitzUniverse — client IA (le contrat)
* ============================================================
*
* Toutes les pages de Fitz — ai-chat.js, ai-letter.js, ai-email.js,
* ai-translate.js, ai-check.js, applications.js — passent par la
* SEULE fonction generate() de ce fichier, et ne savent rien de ce qui
* se trouve derrière.
*
* Derrière, deux adaptateurs interchangeables :
*
*   "simule"     → js/ai/simulated-responses.js (aujourd'hui)
*   "passerelle" → js/ai/ai-gateway.js, vers un vrai fournisseur
*
* Le choix se fait par MODE dans js/ai/ai-config.js. Brancher une
* vraie IA doit être ce changement-là, et rien d'autre.
*
* CE QUE CE FICHIER GARANTIT AUX PAGES, QUEL QUE SOIT L'ADAPTATEUR
* ----------------------------------------------------------------
*  1. La forme de la réponse : { text } pour les tâches de rédaction,
*     { data } pour les tâches structurées. Jamais l'une pour l'autre.
*  2. Les erreurs : toujours une FitzError avec un code stable, jamais
*     un message technique en anglais. Voir js/ai/ai-errors.js.
*  3. L'arrêt : `signal` interrompt la génération, et l'erreur levée
*     est reconnaissable par estArret().
*  4. Le délai : aucune génération ne laisse l'étudiant attendre
*     indéfiniment, même si le fournisseur ne répond plus jamais.
*  5. Le réessai : les échecs passagers (réseau, surcharge) sont
*     retentés automatiquement, les autres non.
*  6. La progression : onToken() reçoit (texteComplet, delta) — le
*     texte entier pour l'affichage, le delta pour qui préfère
*     ajouter plutôt que remplacer.
*
* CE QUI N'EST PAS ENCORE FAIT, ET POURQUOI
* -----------------------------------------
* Le quota par offre est vérifié ici en amont (verifierAcces), mais ce
* contrôle est un CONFORT D'AFFICHAGE : il évite une requête inutile et
* affiche le bon message. Il ne protège rien — la console du navigateur
* le contourne en une ligne. Le contrôle qui fait foi est celui de la
* passerelle, côté serveur, sur le jeton Firebase vérifié.
* ============================================================
*/

import {
MODE,
IS_SIMULATED,
DELAIS_MS,
DELAI_PAR_DEFAUT_MS,
REESSAIS_MAX,
ATTENTE_REESSAI_MS,
TAILLE_ENTREE_MAX,
TACHES,
TACHES_STRUCTUREES,
FONCTIONNALITE_PAR_TACHE
} from "./ai-config.js";

import { FitzError, CODES, estReessayable, estArret } from "./ai-errors.js";
import { genererViaPasserelle } from "./ai-gateway.js";
import { genererViaSimulateur } from "./ai-simulateur.js";

export { IS_SIMULATED };
export { CODES, FitzError, messageErreurFitz, estArret } from "./ai-errors.js";

// ==========================================================
// CONTRÔLE D'OFFRE — point de branchement
// ==========================================================
// Reste volontairement vide : les pages vérifient déjà l'accès à leur
// outil au chargement (requireFeature, js/access-guard.js), et un
// second contrôle ici, avec une source de vérité différente, se
// désynchroniserait du premier.
//
// Ce crochet existe pour le jour où un quota au NOMBRE D'APPELS
// s'ajoutera au contrôle d'accès binaire d'aujourd'hui — « dix lettres
// par mois » plutôt que « lettres : oui/non ». Il suffira alors de le
// remplir, sans toucher aux six pages appelantes.
//
// @param {string} task
// @returns {Promise<void>} lève une FitzError(QUOTA_PLAN) si refusé
async function verifierAcces(task) {

if (!FONCTIONNALITE_PAR_TACHE[task]) {
throw new FitzError(CODES.INCONNU, { detail: `tâche inconnue : "${task}"` });
}

}

// ==========================================================
// GARDE-FOUS D'ENTRÉE
// ==========================================================

/**
* Longueur totale du texte envoyé, pièces jointes comprises.
*
* Parcourt l'objet plutôt qu'un champ précis : chaque tâche a ses
* propres champs (`text` pour la traduction, `message` + `history`
* pour le chat, `experiences`/`motivations` pour la lettre), et une
* liste explicite se serait périmée à la première tâche ajoutée.
*/
function tailleEntree(valeur, profondeur = 0) {

if (profondeur > 6 || valeur == null) return 0;

if (typeof valeur === "string") return valeur.length;

if (Array.isArray(valeur)) {
return valeur.reduce((total, element) => total + tailleEntree(element, profondeur + 1), 0);
}

if (typeof valeur === "object") {
return Object.values(valeur).reduce((total, element) => total + tailleEntree(element, profondeur + 1), 0);
}

return 0;

}

function verifierEntree(task, input) {

if (!TACHES.includes(task)) {
throw new FitzError(CODES.INCONNU, { detail: `tâche inconnue : "${task}"` });
}

const taille = tailleEntree(input);

if (taille > TAILLE_ENTREE_MAX) {
throw new FitzError(CODES.ENTREE_TROP_LONGUE, {
detail: `${taille} caractères envoyés, maximum ${TAILLE_ENTREE_MAX}`
});
}

}

// ==========================================================
// VALIDATION DES RÉPONSES STRUCTURÉES
// ==========================================================
// Le simulateur renvoie toujours la bonne forme — il la fabrique. Un
// vrai modèle, lui, peut renvoyer un score en texte, une liste absente
// ou du JSON entouré de prose. Sans cette vérification, la page
// afficherait « undefined » dans l'anneau de score sans que personne
// ne sache d'où ça vient.
//
// La validation est volontairement MINIMALE : seuls les champs dont
// l'absence casse l'affichage. Un champ facultatif manquant n'est pas
// une raison de refuser toute la réponse à l'étudiant.

// Vérifié contre ce que renvoie réellement js/ai/simulated-responses.js
// (computeApplicationReport / computeApplicationReadiness) et contre ce
// que lisent réellement ai-check.js et applications.js.
//
// "overallScore" est volontairement ABSENT de la liste "check" (lot
// AI-STRUCTURE, 2026-09-18) : js/ai/controle-bourse.js renvoie
// délibérément `overallScore: null` pour un dossier de bourse (aucun
// plafond publié à comparer — règle du lot R11, "ce qu'on ne peut pas
// juger est ABSENT, pas nul"), et ai-check.js sait déjà afficher « — »
// dans ce cas (voir `noteChiffree`). L'exiger ici aurait rejeté cette
// réponse, pourtant honnête, avec REPONSE_INVALIDE.
const CHAMPS_REQUIS = {
check: ["categories"],
readiness: ["ready", "missingItems"]
};

function verifierStructure(task, donnees) {

if (!donnees || typeof donnees !== "object") {
throw new FitzError(CODES.REPONSE_INVALIDE, {
detail: `tâche "${task}" : réponse non structurée`
});
}

const manquants = (CHAMPS_REQUIS[task] || []).filter(
(champ) => donnees[champ] === undefined || donnees[champ] === null
);

if (manquants.length) {
throw new FitzError(CODES.REPONSE_INVALIDE, {
detail: `tâche "${task}" : champs manquants — ${manquants.join(", ")}`
});
}

}

// ==========================================================
// DÉLAI ET RÉESSAI
// ==========================================================

function attendre(ms) {
return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
* Combine le signal d'arrêt de l'étudiant et le délai maximum de la
* tâche en un seul signal.
*
* Les deux doivent pouvoir interrompre la génération, mais ils ne
* veulent pas dire la même chose : l'un est un choix (ne rien
* afficher), l'autre une panne (l'expliquer). Le drapeau `expire`
* permet de les distinguer après coup, l'AbortSignal ne portant pas
* de motif.
*/
function signalAvecDelai(signalUtilisateur, delaiMs) {

const controleur = new AbortController();
const etat = { expire: false };

const minuteur = setTimeout(() => {
etat.expire = true;
controleur.abort();
}, delaiMs);

if (signalUtilisateur) {

if (signalUtilisateur.aborted) {
controleur.abort();
} else {
signalUtilisateur.addEventListener("abort", () => controleur.abort(), { once: true });
}

}

return {
signal: controleur.signal,
etat,
liberer: () => clearTimeout(minuteur)
};

}

/**
* Transforme n'importe quelle erreur d'adaptateur en FitzError, en
* tenant compte de la raison réelle de l'interruption.
*/
function normaliserErreur(erreur, etatDelai) {

if (erreur instanceof FitzError) {

// Un arrêt déclenché par NOTRE minuteur n'est pas un arrêt demandé
// par l'étudiant : le lui présenter comme tel lui ferait croire
// qu'il a annulé lui-même.
if (erreur.code === CODES.ARRET_DEMANDE && etatDelai.expire) {
return new FitzError(CODES.DELAI, { cause: erreur });
}

return erreur;

}

if (erreur?.name === "AbortError") {
return new FitzError(etatDelai.expire ? CODES.DELAI : CODES.ARRET_DEMANDE, { cause: erreur });
}

return new FitzError(CODES.INCONNU, { cause: erreur });

}

// ==========================================================
// LE CONTRAT
// ==========================================================

/**
* Demande une génération à Fitz.
*
* @param {Object} params
* @param {"letter"|"email"|"translate"|"check"|"readiness"|"chat"} params.task
* @param {Object} params.input - voir js/ai/prompts.js pour la forme attendue par tâche
* @param {(texteComplet: string, delta: string) => void} [params.onToken]
*        Appelé à chaque fragment reçu, tâches de rédaction uniquement.
* @param {(etat: "envoi"|"reflexion"|"redaction"|"reessai") => void} [params.onEtat]
*        Étape en cours, pour que l'interface dise ce qui se passe
*        plutôt que d'afficher un rond qui tourne. Un réessai silencieux
*        est un mensonge par omission : l'étudiant doit savoir que Fitz
*        s'y reprend à deux fois.
* @param {AbortSignal} [params.signal] - arrête la génération en cours
* @param {Function} [params.adaptateur] - RÉSERVÉ AUX TESTS. Force
*        l'adaptateur plutôt que de le déduire de MODE. Les six pages
*        appelantes ne le passent jamais : en production, MODE seul
*        décide. Sans ce crochet, un test de la mécanique de generate()
*        (arrêt, délai, réessai) exigerait un vrai réseau ou un vrai
*        Firebase dès que MODE vaut "passerelle" — ce que Node ne peut
*        pas faire (le SDK est importé depuis une URL https, que seul
*        un navigateur sait charger).
* @returns {Promise<{text: string, usage?: Object} | {data: Object, usage?: Object}>}
* @throws {FitzError} toujours une FitzError, jamais une erreur brute
*/
export async function generate({ task, input, onToken, onEtat, signal, adaptateur }) {

verifierEntree(task, input);
await verifierAcces(task);

const delaiMs = DELAIS_MS[task] || DELAI_PAR_DEFAUT_MS;
const adaptateurEffectif = adaptateur || (MODE === "passerelle" ? genererViaPasserelle : genererViaSimulateur);

let derniereErreur = null;

for (let tentative = 0; tentative <= REESSAIS_MAX; tentative++) {

if (signal?.aborted) {
throw new FitzError(CODES.ARRET_DEMANDE);
}

if (tentative > 0) {

// L'attente double à chaque tour pour ne pas aggraver une
// surcharge que l'on est en train de subir.
await attendre(ATTENTE_REESSAI_MS * 2 ** (tentative - 1));

if (onEtat) onEtat("reessai");

} else if (onEtat) {

onEtat("envoi");

}

const { signal: signalCombine, etat, liberer } = signalAvecDelai(signal, delaiMs);

try {

let premierFragment = true;

const resultat = await adaptateurEffectif({
task,
input,
signal: signalCombine,
onToken: onToken
? (texteComplet, delta) => {
if (premierFragment) {
premierFragment = false;
if (onEtat) onEtat("redaction");
}
onToken(texteComplet, delta);
}
: undefined
});

if (TACHES_STRUCTUREES.includes(task)) {
verifierStructure(task, resultat.data);
}

return resultat;

} catch (erreur) {

derniereErreur = normaliserErreur(erreur, etat);

// Un arrêt demandé par l'étudiant n'est jamais retenté : il a dit
// non, le relancer serait exactement le contraire de ce qu'il
// demande.
if (estArret(derniereErreur) || !estReessayable(derniereErreur)) {
throw derniereErreur;
}

} finally {

liberer();

}

}

throw derniereErreur || new FitzError(CODES.INCONNU);

}
