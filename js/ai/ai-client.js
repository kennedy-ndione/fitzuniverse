/**
* ============================================================
* ScholarBridge — client IA (point de branchement futur)
* ============================================================
*
* SEUL fichier que l'intégration d'un vrai fournisseur (OpenAI,
* Anthropic, Gemini...) devra modifier. Toutes les pages ("ai-chat.js",
* "ai-letter.js"...) appellent uniquement generate({task, input,
* onToken, signal}) et ne savent rien de ce qui se passe derrière.
*
* Aujourd'hui (IS_SIMULATED = true) : le texte complet est produit
* localement par js/ai/simulated-responses.js à partir du prompt
* construit par js/ai/prompts.js, puis "diffusé" par petits blocs avec
* un délai, pour donner la même sensation de génération progressive
* qu'un vrai modèle de langage (et pouvoir tester le bouton "Arrêter").
*
* Demain, pour brancher une vraie API : remplacer le corps de
* runSimulated() par un fetch() vers le fournisseur choisi, idéalement
* en conservant le support de `signal` (AbortController) pour ne rien
* perdre côté UI. buildPrompt() a déjà la forme {system, user} attendue
* par la plupart des API de chat.
* ============================================================
*/

import { buildPrompt } from "./prompts.js";

import {
generateMotivationLetter,
generateEmail,
translateText,
computeApplicationReport,
generateChatReply
} from "./simulated-responses.js";

export const IS_SIMULATED = true;

function wait(ms, signal) {

return new Promise((resolve, reject) => {

const timer = setTimeout(resolve, ms);

if (signal) {
signal.addEventListener("abort", () => {
clearTimeout(timer);
reject(new DOMException("Génération arrêtée", "AbortError"));
}, { once: true });
}

});

}

function runSimulatedTask(task, input) {

// buildPrompt() est appelé pour que la structure {system, user} existe
// et soit prête à être envoyée à une vraie API plus tard — le
// simulateur lui-même n'en a pas besoin, il travaille directement sur
// "input".
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

case "chat":
return generateChatReply(input);

default:
throw new Error(`Tâche IA inconnue : "${task}"`);

}

}

// Découpe un texte en unités "streamables" (mots), en conservant les
// sauts de ligne comme unités à part entière pour que la mise en forme
// n'apparaisse pas plus tard que le texte lui-même.
function toChunks(text) {

return text
.split(/(\n+)/)
.filter(Boolean)
.flatMap((part) => (part.trim() === "" ? [part] : part.split(/(?<=\s)/)));

}

/**
* @param {Object} params
* @param {"letter"|"email"|"translate"|"check"|"chat"} params.task
* @param {Object} params.input - voir js/ai/prompts.js pour la forme attendue par tâche
* @param {(partialText: string) => void} [params.onToken] - appelé à chaque bloc de texte reçu (tâches texte uniquement)
* @param {AbortSignal} [params.signal] - permet d'arrêter la génération en cours
* @returns {Promise<{text: string} | {data: Object}>}
*/
export async function generate({ task, input, onToken, signal }) {

// Latence simulée avant le premier token, comme un vrai appel réseau.
await wait(280 + Math.random() * 320, signal);

const result = runSimulatedTask(task, input);

// La vérification de dossier renvoie une structure (score, catégories...)
// et n'a pas de sens à "streamer" mot par mot.
if (task === "check") {
return { data: result };
}

if (!onToken) {
return { text: result };
}

let streamed = "";
const chunks = toChunks(result);

for (const chunk of chunks) {

if (signal?.aborted) {
throw new DOMException("Génération arrêtée", "AbortError");
}

streamed += chunk;
onToken(streamed, chunk);

await wait(14 + Math.random() * 26, signal);

}

return { text: streamed };

}
