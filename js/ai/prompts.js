/**
* ============================================================
* ScholarBridge — construction des prompts Fitz
* ============================================================
*
* Traduit les données saisies par l'étudiant (formulaire de lettre,
* d'e-mail, message de chat...) en un prompt structuré {system, user}
* par tâche. Aujourd'hui, js/ai/ai-client.js n'envoie ce prompt à
* personne : il sert de base à js/ai/simulated-responses.js (qui lit
* les mêmes champs "input" pour ses gabarits) et sera la seule chose
* qu'un vrai appel API consommera demain, sans toucher aux pages.
*
* RÈGLE : une page ("ai-letter.js", "ai-email.js"...) ne doit jamais
* construire de texte de prompt elle-même — toujours passer par
* buildPrompt() ici, pour garder un seul endroit qui sait "parler" à
* un modèle de langage.
* ============================================================
*/

import { LANGUAGES } from "./simulated-responses.js";

function languageLabel(code) {
return LANGUAGES.find((l) => l.code === code)?.label || code;
}

const BASE_SYSTEM = "Tu es Fitz, l'assistant de candidature de ScholarBridge. Tu aides des étudiants africains à préparer une candidature universitaire internationale : ton professionnel, chaleureux, précis, jamais condescendant. Tu écris en français sauf si on te demande explicitement une autre langue.";

function describeProfile(profile = {}) {

const parts = [];

const name = [profile.firstName, profile.lastName].filter(Boolean).join(" ") || profile.name;
if (name) parts.push(`Nom : ${name}`);

if (profile.country || profile.originCountry) parts.push(`Nationalité/pays d'origine : ${profile.country || profile.originCountry}`);
if (profile.lastDegree || profile.currentDegree) parts.push(`Dernier diplôme : ${profile.lastDegree || profile.currentDegree}`);
if (profile.currentInstitution) parts.push(`Établissement actuel : ${profile.currentInstitution}`);
if (profile.desiredField) parts.push(`Domaine visé : ${profile.desiredField}`);
if (profile.desiredDegree) parts.push(`Niveau visé : ${profile.desiredDegree}`);

if (Array.isArray(profile.preferredCountries) && profile.preferredCountries.length) {
parts.push(`Pays visés : ${profile.preferredCountries.join(", ")}`);
}

if (Array.isArray(profile.languages) && profile.languages.length) {
parts.push(`Langues : ${profile.languages.join(", ")}`);
}

if (profile.careerGoals) parts.push(`Objectifs de carrière : ${profile.careerGoals}`);
if (profile.whyLeave) parts.push(`Motivation à étudier à l'étranger : ${profile.whyLeave}`);

return parts.length ? parts.join("\n") : "Aucune information de profil disponible.";

}

const BUILDERS = {

letter(input) {

return {
system: `${BASE_SYSTEM} Tu rédiges des lettres de motivation universitaires convaincantes, structurées en 4 à 6 paragraphes, sans clichés, ancrées dans le parcours réel de l'étudiant.`,
user: [
`Rédige une lettre de motivation de style "${input.style}" pour :`,
`Université : ${input.university || "non précisée"}`,
`Programme : ${input.program || "non précisé"}`,
`Niveau : ${input.level || "non précisé"}`,
`Pays : ${input.country || "non précisé"}`,
"",
"Profil de l'étudiant :",
describeProfile(input.profile),
"",
"Éléments complémentaires fournis par l'étudiant :",
`Expériences : ${input.experiences || "—"}`,
`Compétences : ${input.skills || "—"}`,
`Motivations : ${input.motivations || "—"}`,
`Objectifs : ${input.goals || "—"}`
].join("\n")
};

},

email(input) {

return {
system: `${BASE_SYSTEM} Tu rédiges des e-mails universitaires professionnels, concis (150 à 250 mots), avec un objet clair et une formule de politesse adaptée.`,
user: [
`Type d'e-mail : ${input.emailType}`,
`Destinataire : ${input.recipient || "service des admissions"}`,
`Université : ${input.university || "non précisée"}`,
`Programme : ${input.program || "non précisé"}`,
`Pays : ${input.country || "non précisé"}`,
"",
"Profil de l'étudiant :",
describeProfile(input.profile),
"",
`Contexte additionnel : ${input.context || "—"}`
].join("\n")
};

},

translate(input) {

const sourceLabel = languageLabel(input.sourceLanguage);
const targetLabel = languageLabel(input.targetLanguage);

return {
system: `${BASE_SYSTEM} Tu traduis fidèlement des documents académiques du ${sourceLabel} vers le ${targetLabel}, en conservant le registre formel et la terminologie universitaire.`,
user: `Traduis le texte suivant du ${sourceLabel} vers le ${targetLabel} :\n\n${input.text}`
};

},

check(input) {

return {
system: `${BASE_SYSTEM} Tu évalues un dossier de candidature universitaire et donnes un retour honnête, structuré par catégories (clarté, grammaire, professionnalisme, cohérence, complétude), avec des points forts, des points faibles et des suggestions concrètes.`,
user: [
`Documents fournis : ${(input.files || []).map((f) => `${f.name} (${f.type || "type non précisé"})`).join(", ") || "aucun"}`,
"",
"Profil de l'étudiant :",
describeProfile(input.profile)
].join("\n")
};

},

chat(input) {

return {
system: `${BASE_SYSTEM} Tu réponds aux questions d'un étudiant sur sa candidature (bourses, universités, documents, entretiens, délais). Réponses claires, si besoin structurées en listes ou courtes sections, jamais plus de 200 mots sauf si la question l'exige vraiment.`,
user: [
"Profil de l'étudiant :",
describeProfile(input.profile),
"",
"Historique récent de la conversation :",
(input.history || []).map((m) => `${m.role === "user" ? "Étudiant" : "Fitz"} : ${m.content}`).join("\n") || "(nouvelle conversation)",
"",
`Message de l'étudiant : ${input.message}`
].join("\n")
};

}

};

export function buildPrompt(task, input = {}) {

const builder = BUILDERS[task];

if (!builder) {
throw new Error(`Aucun prompt défini pour la tâche "${task}"`);
}

return builder(input);

}
