/**
* ============================================================
* FitzUniverse — langue de réponse de Fitz
* ============================================================
*
* FitzUniverse accompagne des étudiants qui candidatent partout dans
* le monde, mais toute l'IA était écrite pour répondre en français à
* des étudiants francophones (voir BASE_SYSTEM, js/ai/prompts.js,
* corrigé le 2026-08-21 en même temps que ce fichier). Un étudiant
* nigérian, brésilien ou marocain arabophone n'avait aucun moyen de
* demander à Fitz de lui répondre dans sa langue.
*
* Ce module ne traduit rien lui-même : il ne fait que retenir le choix
* de l'étudiant et le mettre à disposition du constructeur de prompts,
* qui l'inscrit dans l'instruction système. C'est donc le fournisseur
* IA branché derrière js/ai/ai-client.js qui répondra dans la langue
* demandée — sans qu'aucune page ait à changer.
*
* Stocké en local (localStorage) et non dans Firestore : c'est une
* préférence d'affichage immédiate, qu'on veut lire de façon synchrone
* au premier rendu de la page, sans attendre une requête réseau.
* ============================================================
*/

const CLE = "fitz_chat_language";

export const CHAT_LANGUAGES = [
{ code: "fr", label: "Français", nom: "français" },
{ code: "en", label: "English", nom: "anglais" },
{ code: "es", label: "Español", nom: "espagnol" },
{ code: "pt", label: "Português", nom: "portugais" },
{ code: "ar", label: "العربية", nom: "arabe" }
];

export const DEFAULT_CHAT_LANGUAGE = "fr";

export function getChatLanguage() {

try {
const stored = localStorage.getItem(CLE);
if (stored && CHAT_LANGUAGES.some((l) => l.code === stored)) return stored;
} catch (error) {
// Navigation privée ou stockage refusé : on retombe sur la valeur
// par défaut plutôt que de casser l'ouverture du chat.
console.warn("Préférence de langue illisible :", error);
}

return DEFAULT_CHAT_LANGUAGE;

}

export function setChatLanguage(code) {

if (!CHAT_LANGUAGES.some((l) => l.code === code)) return getChatLanguage();

try {
localStorage.setItem(CLE, code);
} catch (error) {
console.warn("Préférence de langue non enregistrée :", error);
}

return code;

}

export function chatLanguageLabel(code) {
return CHAT_LANGUAGES.find((l) => l.code === code)?.label || code;
}

export function chatLanguageName(code) {
return CHAT_LANGUAGES.find((l) => l.code === code)?.nom || code;
}
