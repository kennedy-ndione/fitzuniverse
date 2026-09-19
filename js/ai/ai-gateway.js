/**
* ============================================================
* FitzUniverse — adaptateur « passerelle » (vrai fournisseur)
* ============================================================
*
* Implémentation de l'appel réel, active dès que MODE vaut
* "passerelle" dans js/ai/ai-config.js.
*
* CE QUI A CHANGÉ LE 2026-09-04, ET POURQUOI
* -------------------------------------------
* Ce fichier appelait auparavant un endpoint HTTP en flux SSE, avec un
* en-tête Authorization posé à la main et des statuts HTTP à traduire.
* Cet endpoint n'a jamais existé : la fonction serveur écrite en face
* (functions/fitz.js) est un CALLABLE Firebase, pas un endpoint HTTP.
* Les deux contrats étaient incompatibles, et passer MODE à
* "passerelle" n'aurait rien donné d'autre qu'une erreur réseau.
*
* Le callable a été conservé, et c'est ce fichier qui a été réécrit.
* Trois raisons :
*
*   1. Le SDK attache lui-même le jeton d'identité Firebase. Aucun
*      en-tête à poser, aucun jeton à rafraîchir, aucun moyen de se
*      tromper.
*   2. Pas de CORS : l'appel n'est pas une requête HTTP ordinaire.
*   3. Le flux est géré par le SDK (`.stream()`), en face de
*      `response.sendChunk()` côté serveur.
*
* CE QUI N'A PAS CHANGÉ : le contrat rendu à js/ai/ai-client.js.
* Mêmes retours ({text} ou {data}, plus `usage`), mêmes onze erreurs
* typées, même signal d'arrêt, même onToken. Les six pages appelantes
* n'ont pas bougé d'une ligne.
*
* LA RÉGION EST DÉLIBÉRÉE
* -----------------------
* fitzGenerate vit en europe-west1, pas dans la région par défaut.
* Cibler la mauvaise région donne un "not-found" qui ressemble à s'y
* méprendre à un bug de code — et fait perdre une heure.
* ============================================================
*/

import { buildPrompt } from "./prompts.js";
import { TACHES_STRUCTUREES } from "./ai-config.js";
import { FitzError, CODES } from "./ai-errors.js";

const REGION = "europe-west1";
const NOM_FONCTION = "fitzGenerate";

/**
* Le callable, construit une seule fois.
*
* Import dynamique du SDK et de firebase-config : ce module doit rester
* chargeable dans un test Node sans Firebase — c'est ce qui permet à
* test/ai-client.test.mjs de vérifier la forme du contrat sans réseau.
* Toute panne d'initialisation devient un échec AUTH explicite plutôt
* qu'une exception brute au milieu d'une génération.
*/
let callablePromise = null;

function obtenirCallable() {

if (callablePromise) return callablePromise;

callablePromise = (async () => {

try {

const { app } = await import("../../firebase-config.js");

const { getFunctions, httpsCallable } = await import(
"https://www.gstatic.com/firebasejs/11.10.0/firebase-functions.js"
);

return httpsCallable(getFunctions(app, REGION), NOM_FONCTION);

} catch (cause) {

// Ne pas mémoriser un échec : une coupure réseau au premier appel
// ne doit pas condamner la session entière.
callablePromise = null;

throw new FitzError(CODES.AUTH, {
cause,
detail: "initialisation de la passerelle impossible"
});

}

})();

return callablePromise;

}

/**
* Les captures d'écran que l'étudiant joint à sa question.
*
* Elles ne passent PAS par buildPrompt : les prompts construisent du
* texte, les images sont un canal séparé jusqu'au modèle. Le serveur
* les valide à nouveau (type, taille, nombre) — ce filtrage-ci évite
* seulement un aller-retour perdu.
*/
/**
 * Les PDF, sur leur propre canal. Même normalisation que les images,
 * nom distinct : pour l'API un PDF est un bloc `document`, et le serveur
 * leur applique des limites à eux (2 par message, 3 Mo, 5 points).
 */
function normaliserDocuments(documents) {

if (!Array.isArray(documents)) return [];

return documents
.filter((doc) => doc && typeof doc.data === "string" && doc.data.length)
.map((doc) => ({
mediaType: doc.mediaType || doc.type || "application/pdf",
data: doc.data
}));

}

function normaliserImages(images) {

if (!Array.isArray(images)) return [];

return images
.filter((image) => image && typeof image.data === "string" && image.data.length)
.map((image) => ({
mediaType: image.mediaType || image.type || "image/jpeg",
data: image.data
}));

}

/**
* Traduit une erreur du callable en code Fitz.
*
* L'ORDRE COMPTE. On lit d'abord `details.fitzCode`, que le serveur
* pose lui-même (voir refus() dans functions/fitz.js) : c'est la seule
* source qui sache si un "permission-denied" veut dire « formule
* insuffisante » ou « compte suspendu ». Les codes callable ne servent
* que de repli, pour une erreur venue du SDK ou du réseau et non de
* notre code.
*/
function codeFitz(erreur) {

const annonce = erreur?.details?.fitzCode;

if (typeof annonce === "string" && CODES[annonce]) return CODES[annonce];

const code = String(erreur?.code || "").replace(/^functions\//, "");

if (code === "unauthenticated") return CODES.AUTH;
if (code === "permission-denied") return CODES.QUOTA_PLAN;
if (code === "resource-exhausted") return CODES.QUOTA_FOURNISSEUR;
if (code === "invalid-argument") return CODES.ENTREE_TROP_LONGUE;
if (code === "failed-precondition") return CODES.CONTENU_REFUSE;
if (code === "deadline-exceeded") return CODES.DELAI;
if (code === "unavailable") return CODES.FOURNISSEUR_INDISPONIBLE;
if (code === "cancelled") return CODES.ARRET_DEMANDE;

// Le SDK rend "internal" aussi bien pour une panne serveur que pour
// une requête qui n'est jamais partie. On ne peut pas les distinguer
// ici — INCONNU est réessayable, ce qui est le bon choix par défaut.
return CODES.INCONNU;

}

function enFitzError(erreur) {

if (erreur instanceof FitzError) return erreur;

// Un abandon traverse le SDK sans passer par nous.
if (erreur?.name === "AbortError") {
return new FitzError(CODES.ARRET_DEMANDE, { cause: erreur });
}

// Le message du serveur n'est repris QUE s'il a nommé le code
// lui-même (details.fitzCode) : c'est la marque d'une phrase choisie
// pour ce cas précis. Une erreur seulement traduite d'un code HTTP
// garde le texte générique du client, qui est meilleur.
const nomme = Boolean(erreur?.details?.fitzCode);

return new FitzError(codeFitz(erreur), {
cause: erreur,
message: nomme ? String(erreur?.message || "") : "",
detail: String(erreur?.message || "")
});

}

/**
* Appelle Fitz.
*
* @param {Object} params
* @param {string} params.task
* @param {Object} params.input - voir js/ai/prompts.js ; `input.images`
*        est extrait à part et transmis au modèle comme pièces jointes
* @param {AbortSignal} [params.signal]
* @param {(texteComplet: string, delta: string) => void} [params.onToken]
* @returns {Promise<{text: string, usage?: Object} | {data: Object, usage?: Object}>}
*/
export async function genererViaPasserelle({ task, input, signal, onToken }) {

if (signal?.aborted) {
throw new FitzError(CODES.ARRET_DEMANDE);
}

let system;
let user;

try {

({ system, user } = buildPrompt(task, input));

} catch (cause) {

// Une tâche sans prompt est un défaut de programmation, pas une
// panne : le dire clairement plutôt que de l'envoyer au serveur.
throw new FitzError(CODES.INCONNU, { cause, detail: `prompt absent pour "${task}"` });

}

const charge = { task, system, user };
const images = normaliserImages(input?.images);
const documents = normaliserDocuments(input?.documents);

if (images.length) charge.images = images;
if (documents.length) charge.documents = documents;

const callable = await obtenirCallable();
const structuree = TACHES_STRUCTUREES.includes(task);

try {

// Une tâche structurée n'est jamais diffusée : un JSON à moitié
// écrit n'est pas du JSON, et le serveur ne l'envoie pas en flux.
// On évite donc l'aller-retour d'un flux qui resterait vide.
if (structuree || typeof callable.stream !== "function") {

const reponse = await callable(charge);
return lireResultat(task, reponse?.data, "", structuree);

}

const { stream, data } = await callable.stream(charge, { signal });

let texte = "";

for await (const fragment of stream) {

const delta = fragment?.delta;

if (typeof delta !== "string" || !delta) continue;

texte += delta;

if (onToken) onToken(texte, delta);

}

// La valeur de retour de la fonction fait foi : le flux sert à
// l'affichage progressif, pas à reconstituer la réponse. Un
// fragment perdu en route ne doit pas amputer le résultat.
const resultat = await data;

return lireResultat(task, resultat, texte, structuree);

} catch (erreur) {

throw enFitzError(erreur);

}

}

/**
* Vérifie que la réponse a la forme promise aux pages appelantes.
*
* js/ai/ai-client.js revalidera le CONTENU des tâches structurées
* (CHAMPS_REQUIS). Ici on ne contrôle que la forme : { text } d'un
* côté, { data } de l'autre, jamais l'une pour l'autre.
*/
function lireResultat(task, resultat, texteDuFlux, structuree) {

if (structuree) {

if (!resultat || typeof resultat.data !== "object" || resultat.data === null) {
throw new FitzError(CODES.REPONSE_INVALIDE, {
detail: `tâche "${task}" : aucune structure reçue`
});
}

return { data: resultat.data, usage: resultat.usage };

}

const texte = typeof resultat?.text === "string" && resultat.text ? resultat.text : texteDuFlux;

if (!texte.trim()) {
throw new FitzError(CODES.REPONSE_INVALIDE, {
detail: `tâche "${task}" : réponse vide`
});
}

return { text: texte, usage: resultat?.usage };

}
