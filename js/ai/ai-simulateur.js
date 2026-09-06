/**
* ============================================================
* FitzUniverse — adaptateur « simulé »
* ============================================================
*
* L'implémentation d'aujourd'hui : le texte est produit localement par
* js/ai/simulated-responses.js, à partir des mêmes champs `input` que
* ceux qu'un vrai modèle recevra, puis diffusé mot à mot avec un léger
* délai.
*
* Cette diffusion progressive n'est pas de la décoration. Elle fait
* que l'interface est écrite CONTRE un flux dès aujourd'hui : le
* bouton « Arrêter » fonctionne vraiment, l'aperçu se remplit
* progressivement, la page ne suppose jamais que la réponse arrive
* d'un bloc. Le jour du branchement, l'interface n'a donc rien à
* réapprendre — c'est la moitié du travail de couture, faite d'avance.
*
* buildPrompt() est appelé alors que le simulateur n'en a pas besoin :
* c'est délibéré. Une tâche dont le prompt planterait doit planter ici,
* pendant le développement, et pas le jour de la mise en production
* d'un vrai fournisseur.
* ============================================================
*/

import { buildPrompt } from "./prompts.js";
import { FitzError, CODES } from "./ai-errors.js";
import { TACHES_STRUCTUREES } from "./ai-config.js";

import {
generateMotivationLetter,
generateEmail,
translateText,
computeApplicationReport,
computeApplicationReadiness,
generateChatReply,
generateDiagnosticReading
} from "./simulated-responses.js";

/** Latence avant le premier fragment, comme un vrai appel réseau. */
const LATENCE_MIN_MS = 280;
const LATENCE_VARIABLE_MS = 320;

/** Cadence de diffusion, par fragment. */
const CADENCE_MIN_MS = 14;
const CADENCE_VARIABLE_MS = 26;

function attendre(ms, signal) {

return new Promise((resolve, reject) => {

const minuteur = setTimeout(resolve, ms);

if (signal) {

if (signal.aborted) {
clearTimeout(minuteur);
reject(new FitzError(CODES.ARRET_DEMANDE));
return;
}

signal.addEventListener("abort", () => {
clearTimeout(minuteur);
reject(new FitzError(CODES.ARRET_DEMANDE));
}, { once: true });

}

});

}

function executerTache(task, input) {

// Voir l'en-tête : appelé pour son effet de bord de validation.
buildPrompt(task, input);

switch (task) {

case "letter":
return generateMotivationLetter(input);

case "email":
return generateEmail(input);

case "translate":
return translateText(input).text;

case "check":
return computeApplicationReport(input);

case "readiness":
return computeApplicationReadiness(input);

case "chat":
return generateChatReply(input);

// Ajouté le 2026-09-05 : sans ce cas, le bloc « L'analyse de Fitz »
// de results.html tombait sur « tâche inconnue » et affichait une
// carte d'erreur au visiteur, juste après son test.
case "diagnostic":
return generateDiagnosticReading(input);

default:
throw new FitzError(CODES.INCONNU, { detail: `tâche inconnue : "${task}"` });

}

}

/**
* Découpe un texte en unités diffusables (mots), en gardant les sauts
* de ligne comme unités à part entière : sans cela, la mise en forme
* apparaîtrait après le texte qu'elle structure, et les listes
* sembleraient se réorganiser toutes seules sous les yeux du lecteur.
*/
function decouper(texte) {

return texte
.split(/(\n+)/)
.filter(Boolean)
.flatMap((partie) => (partie.trim() === "" ? [partie] : partie.split(/(?<=\s)/)));

}

/**
* Même signature et même contrat de retour que genererViaPasserelle().
*
* @param {Object} params
* @param {string} params.task
* @param {Object} params.input
* @param {(texteComplet: string, delta: string) => void} [params.onToken]
* @param {AbortSignal} [params.signal]
*/
export async function genererViaSimulateur({ task, input, onToken, signal }) {

await attendre(LATENCE_MIN_MS + Math.random() * LATENCE_VARIABLE_MS, signal);

const resultat = executerTache(task, input);

if (TACHES_STRUCTUREES.includes(task)) {
return { data: resultat, usage: null };
}

if (!onToken) {
return { text: resultat, usage: null };
}

let diffuse = "";

for (const fragment of decouper(resultat)) {

if (signal?.aborted) {
throw new FitzError(CODES.ARRET_DEMANDE);
}

diffuse += fragment;
onToken(diffuse, fragment);

await attendre(CADENCE_MIN_MS + Math.random() * CADENCE_VARIABLE_MS, signal);

}

return { text: diffuse, usage: null };

}
