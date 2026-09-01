/**
* ============================================================
* FitzUniverse — adaptateur « passerelle » (vrai fournisseur)
* ============================================================
*
* Implémentation de l'appel réel, écrite d'avance et INACTIVE tant que
* MODE vaut "simule" dans js/ai/ai-config.js.
*
* Elle est écrite maintenant, alors qu'aucun fournisseur n'est encore
* choisi, pour une raison précise : c'est en l'écrivant que l'on
* découvre ce que le contrat de generate() doit prévoir. Les erreurs
* typées, le délai par tâche, la validation des réponses structurées et
* le découpage en deltas ne sont pas des suppositions — ce sont les
* besoins réels d'un appel HTTP en flux, constatés ici.
*
* CE QUE LA PASSERELLE DOIT RENVOYER
* ----------------------------------
* Une réponse en flux (Server-Sent Events), une ligne par événement :
*
*     data: {"delta":"Bonjour"}
*     data: {"delta":" Aminata"}
*     data: {"usage":{"entree":812,"sortie":465}}
*     data: [DONE]
*
* Et pour une tâche structurée (« check », « readiness »), un seul
* événement portant l'objet complet :
*
*     data: {"data":{"overallScore":78,...}}
*     data: [DONE]
*
* En cas d'échec, un statut HTTP parlant (voir codeDepuisStatutHttp
* dans js/ai/ai-errors.js) plutôt qu'un 200 contenant un message
* d'erreur : le navigateur doit pouvoir distinguer « quota épuisé » de
* « panne » sans lire le corps de la réponse.
*
* AUTHENTIFICATION
* ----------------
* Le jeton Firebase de l'étudiant est envoyé en en-tête `Authorization`.
* La passerelle le vérifie, en déduit l'identité — et ne fait JAMAIS
* confiance à un identifiant qui viendrait du corps de la requête, que
* n'importe qui peut réécrire depuis la console du navigateur.
* ============================================================
*/

import { buildPrompt } from "./prompts.js";
import { ENDPOINT, MODELE, TACHES_STRUCTUREES } from "./ai-config.js";
import { FitzError, CODES, codeDepuisStatutHttp } from "./ai-errors.js";

/**
* Jeton d'identité de l'étudiant connecté.
*
* Import dynamique : ce module doit rester chargeable dans un test
* Node sans Firebase. Toute panne d'authentification devient un échec
* AUTH explicite plutôt qu'une exception brute au milieu d'un fetch.
*/
async function jetonIdentite() {

try {

const { auth } = await import("../../firebase-config.js");
const utilisateur = auth.currentUser;

if (!utilisateur) {
throw new FitzError(CODES.AUTH, { detail: "aucun utilisateur connecté" });
}

return await utilisateur.getIdToken();

} catch (erreur) {

if (erreur instanceof FitzError) throw erreur;

throw new FitzError(CODES.AUTH, {
cause: erreur,
detail: "jeton d'identité indisponible"
});

}

}

/**
* Lit un flux SSE et appelle `surEvenement` pour chaque objet reçu.
*
* Le découpage se fait sur les lignes, pas sur les blocs reçus : un
* chunk réseau coupe volontiers un événement en deux, et concaténer
* naïvement produirait du JSON tronqué. Le reliquat est donc conservé
* d'un tour à l'autre.
*/
async function lireFluxSSE(reponse, surEvenement, signal) {

const lecteur = reponse.body.getReader();
const decodeur = new TextDecoder();

let reliquat = "";

try {

while (true) {

if (signal?.aborted) {
throw new FitzError(CODES.ARRET_DEMANDE);
}

const { done, value } = await lecteur.read();

if (done) break;

reliquat += decodeur.decode(value, { stream: true });

const lignes = reliquat.split("\n");
reliquat = lignes.pop() || "";

for (const ligne of lignes) {

const contenu = ligne.trim();

if (!contenu || !contenu.startsWith("data:")) continue;

const charge = contenu.slice(5).trim();

if (charge === "[DONE]") return;

try {
surEvenement(JSON.parse(charge));
} catch (erreur) {
throw new FitzError(CODES.REPONSE_INVALIDE, {
cause: erreur,
detail: `événement illisible : ${charge.slice(0, 120)}`
});
}

}

}

} finally {

// Libère la connexion même sur arrêt ou erreur : sans cela, un
// étudiant qui arrête trois générations de suite laisse trois
// connexions ouvertes jusqu'au rechargement de la page.
try { await lecteur.cancel(); } catch { /* déjà close */ }

}

}

/**
* Appelle la passerelle et renvoie le même contrat que l'adaptateur
* simulé : { text, usage } ou { data, usage }.
*
* @param {Object} params
* @param {string} params.task
* @param {Object} params.input
* @param {(texteComplet: string, delta: string) => void} [params.onToken]
* @param {AbortSignal} [params.signal]
*/
export async function genererViaPasserelle({ task, input, onToken, signal }) {

if (!ENDPOINT) {
throw new FitzError(CODES.AUTH, {
detail: "ENDPOINT vide dans js/ai/ai-config.js — passerelle non déployée"
});
}

const prompt = buildPrompt(task, input);
const jeton = await jetonIdentite();

let reponse;

try {

reponse = await fetch(ENDPOINT, {
method: "POST",
signal,
headers: {
"Content-Type": "application/json",
"Authorization": `Bearer ${jeton}`
},
body: JSON.stringify({
tache: task,
prompt,
modele: MODELE.nom,
temperature: MODELE.temperature,
maxTokensSortie: MODELE.maxTokensSortie,
flux: !TACHES_STRUCTUREES.includes(task)
})
});

} catch (erreur) {

// fetch() ne rejette que sur un échec réseau ou un arrêt — jamais
// sur un statut HTTP d'erreur, qui arrive en réponse normale.
if (erreur?.name === "AbortError") {
throw new FitzError(CODES.ARRET_DEMANDE, { cause: erreur });
}

throw new FitzError(CODES.RESEAU, { cause: erreur });

}

if (!reponse.ok) {

throw new FitzError(codeDepuisStatutHttp(reponse.status), {
detail: `passerelle HTTP ${reponse.status}`
});

}

if (!reponse.body) {
throw new FitzError(CODES.REPONSE_INVALIDE, { detail: "réponse sans corps" });
}

let texte = "";
let donnees = null;
let usage = null;

await lireFluxSSE(reponse, (evenement) => {

if (typeof evenement.delta === "string") {
texte += evenement.delta;
if (onToken) onToken(texte, evenement.delta);
return;
}

if (evenement.data !== undefined) {
donnees = evenement.data;
return;
}

if (evenement.usage) {
usage = evenement.usage;
return;
}

// Une passerelle peut aussi signaler un échec en cours de flux,
// après avoir déjà renvoyé un 200 : un filtre de contenu qui se
// déclenche au milieu d'une génération, par exemple.
if (evenement.erreur) {
throw new FitzError(evenement.erreur.code || CODES.INCONNU, {
detail: evenement.erreur.detail || ""
});
}

}, signal);

if (TACHES_STRUCTUREES.includes(task)) {

if (!donnees || typeof donnees !== "object") {
throw new FitzError(CODES.REPONSE_INVALIDE, {
detail: `tâche "${task}" : aucune structure reçue`
});
}

return { data: donnees, usage };

}

if (!texte) {
throw new FitzError(CODES.REPONSE_INVALIDE, {
detail: `tâche "${task}" : réponse vide`
});
}

return { text: texte, usage };

}
