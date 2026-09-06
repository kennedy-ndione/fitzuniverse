/**
* ============================================================
* FitzUniverse — construction des prompts Fitz
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
import { chatLanguageName, DEFAULT_CHAT_LANGUAGE } from "./chat-language.js";

function languageLabel(code) {
return LANGUAGES.find((l) => l.code === code)?.label || code;
}

/**
* Instruction système de base.
*
* CORRIGÉ LE 2026-08-21 — la version précédente disait mot pour mot
* "Tu aides des étudiants AFRICAINS" et "Tu écris en FRANÇAIS". Deux
* biais écrits en dur dans le seul fichier que verra le fournisseur IA :
* un étudiant brésilien, indien ou philippin aurait reçu des réponses
* calibrées pour un contexte qui n'est pas le sien, dans une langue
* qu'il ne parle pas forcément. FitzUniverse accompagne des étudiants
* de n'importe quel pays vers n'importe quelle destination — le
* contexte d'origine doit donc venir du profil, pas d'une constante, et
* la langue du choix explicite de l'étudiant (js/ai/chat-language.js).
*
* @param {Object} [options]
* @param {Object} [options.profile] - profil de l'étudiant
* @param {string} [options.language] - code de langue demandé pour la réponse
*/
function baseSystem({ profile = {}, language } = {}) {

const origine = profile.nationality || profile.country;

const parts = [
"Tu es Fitz, l'assistant de candidature de FitzUniverse.",
"Tu aides des étudiants du monde entier à préparer une candidature universitaire internationale : ton professionnel, chaleureux, précis, jamais condescendant.",
"N'émets aucune supposition sur le pays d'origine, la religion, la situation financière ou le système scolaire de l'étudiant : appuie-toi uniquement sur le profil fourni, et demande une précision si une information te manque."
];

if (origine) {
parts.push("Cet étudiant vient de : " + origine + ". Tiens compte des réalités administratives de ce pays (visa, légalisation des diplômes, équivalences, moyens de paiement) quand elles sont pertinentes, sans jamais les inventer.");
}

parts.push("Rédige ta réponse en " + chatLanguageName(language || DEFAULT_CHAT_LANGUAGE) + ".");

return parts.join(" ");

}

function describeProfile(profile = {}) {

const parts = [];

const name = [profile.firstName, profile.lastName].filter(Boolean).join(" ") || profile.name;
if (name) parts.push(`Nom : ${name}`);

// Nationalité et pays de résidence sont DEUX champs distincts du
// profil (profile.js:defaultProfile) et ne se confondent pas : un
// Sénégalais installé au Maroc reste éligible aux bourses réservées
// aux ressortissants sénégalais, et soumis aux règles de visa de sa
// nationalité. Jusqu'au 2026-08-21, cette ligne annonçait
// `profile.country` (la RÉSIDENCE) sous l'étiquette "Nationalité" —
// Fitz recevait donc une nationalité fausse dès que les deux
// différaient, ce qui est le cas de toute la diaspora.
if (profile.nationality) parts.push(`Nationalité : ${profile.nationality}`);
if (profile.country) parts.push(`Pays de résidence : ${profile.country}`);
if (!profile.nationality && !profile.country && profile.originCountry) parts.push(`Pays d'origine : ${profile.originCountry}`);
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

if (profile.city) parts.push(`Ville de résidence : ${profile.city}`);
if (profile.academicAverage) parts.push(`Moyenne : ${profile.academicAverage} (échelle ${profile.academicAverageScale || "non précisée"})`);
if (profile.careerGoals) parts.push(`Objectifs de carrière : ${profile.careerGoals}`);
if (profile.whyLeave) parts.push(`Motivation à étudier à l'étranger : ${profile.whyLeave}`);

return parts.length ? parts.join("\n") : "Aucune information de profil disponible.";

}

const BUILDERS = {

letter(input) {

return {
system: `${baseSystem(input)} Tu rédiges des lettres de motivation universitaires convaincantes, structurées en 4 à 6 paragraphes, sans clichés, ancrées dans le parcours réel de l'étudiant.`,
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
...(() => {
const p = input.parcours || {};
const lignes = Object.entries({
"Niveau actuel": p.niveauActuel,
"Filière du secondaire": p.filiereSecondaire,
"Diplôme obtenu": p.diplomeObtenuQuand,
"Diplôme attendu": p.diplomeAttenduQuand,
"Année en cours": p.anneeEnCours,
"Thèse soutenue": p.theseSoutenue,
"Expérience professionnelle": p.experienceProfessionnelle,
"Candidatures universitaires": p.candidaturesUniversitaires,
"Projet de recherche": p.projetDeRecherche,
"Directeur de thèse / laboratoire": p.directeurOuLaboratoire,
"Publications": p.publications,
"Certification de langue": p.certificationLangue,
"Calendrier de départ": p.calendrier,
"Passeport": p.passeport
}).filter(([, v]) => v).map(([k, v]) => `- ${k} : ${v}`);
return lignes.length ? ["Parcours déclaré :", ...lignes, ""] : [];
})(),
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
system: `${baseSystem(input)} Tu rédiges des e-mails universitaires professionnels, concis (150 à 250 mots), avec un objet clair et une formule de politesse adaptée.`,
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
system: `${baseSystem(input)} Tu traduis fidèlement des documents académiques du ${sourceLabel} vers le ${targetLabel}, en conservant le registre formel et la terminologie universitaire.`,
user: `Traduis le texte suivant du ${sourceLabel} vers le ${targetLabel} :\n\n${input.text}`
};

},

check(input) {

return {
system: `${baseSystem(input)} Tu évalues un dossier de candidature universitaire et donnes un retour honnête, structuré par catégories (clarté, grammaire, professionnalisme, cohérence, complétude), avec des points forts, des points faibles et des suggestions concrètes.`,
user: [
`Documents fournis : ${(input.files || []).map((f) => `${f.name} (${f.type || "type non précisé"})`).join(", ") || "aucun"}`,
"",
"Profil de l'étudiant :",
describeProfile(input.profile)
].join("\n")
};

},

readiness(input) {

const checklistLines = (input.checklist || []).length
? input.checklist.map((item) => `- ${item.label} (${item.type}) : ${item.status}`).join("\n")
: "Aucun élément de dossier ajouté pour l'instant.";

return {
system: `${baseSystem(input)} Tu évalues si UNE candidature précise est prête à être déposée, à partir de son état réel (dossier de candidature, lettre de motivation, délai, profil) — pas une analyse de documents importés comme pour la tâche "check". Réponse structurée : un verdict clair (prêt / presque prêt) et la liste concrète de ce qu'il reste à faire.`,
user: [
`Université : ${input.university || "non précisée"}`,
`Bourse : ${input.scholarship || "non précisée"}`,
`Date limite : ${input.deadline || "non précisée"}`,
`Lettre de motivation générée pour cette candidature : ${input.hasGeneratedLetter ? "oui" : "non"}`,
"",
"Dossier de candidature (checklist) :",
checklistLines,
"",
"Profil de l'étudiant :",
describeProfile(input.profile)
].join("\n")
};

},

chat(input) {

return {
system: `${baseSystem(input)} Tu réponds aux questions d'un étudiant sur sa candidature (bourses, universités, documents, entretiens, délais). Réponses claires, si besoin structurées en listes ou courtes sections, jamais plus de 200 mots sauf si la question l'exige vraiment.`,
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

},

diagnostic(input) {

const liste = (titre, lignes) => {
const propres = (lignes || []).filter(Boolean);
return propres.length ? [titre, ...propres.map((l) => `- ${l}`), ""] : [];
};

const sousScores = (input.sousScores || [])
.map((s) => `- ${s.libelle} : ${s.valeur} %`);

// TOUTES les raisons de chaque opportunité, pas seulement la première,
// et l'échéance réelle. C'est ce qui permet une phrase du type « celle
// de Budapest ferme le 15 janvier, c'est celle qui vous laisse le plus
// de temps » — le genre de remarque qu'un étudiant ne peut pas faire
// seul et qui prouve qu'on a lu son dossier.
const opportunites = (input.opportunites || []).slice(0, 3).map((o, i) => {
const entete = [o.nom, [o.universite, o.pays].filter(Boolean).join(" — ")]
.filter(Boolean).join(" | ");
const lignes = [`${i + 1}. ${entete}`];
if (o.candidaturesOuvertes && typeof o.joursRestants === "number") {
lignes.push(`   Candidatures OUVERTES — ${o.joursRestants} jours restants (échéance ${o.echeance})`);
} else if (o.echeance) {
lignes.push(`   Échéance annoncée : ${o.echeance} — À CONFIRMER sur le portail`);
} else {
lignes.push("   Aucune date au catalogue — dites qu'elle est à chercher sur le portail");
}
(o.raisons || []).forEach((r) => lignes.push(`   • ${r}`));
return lignes.join("\n");
});

return {
system: [
baseSystem(input),
"Tu es le conseiller de FitzUniverse. Tu connais la façon dont les",
"comités de sélection des bourses internationales lisent un dossier :",
"la cohérence du parcours avant la performance brute, le calendrier",
"qui commande tout, le fait qu'une certification de langue met des",
"semaines à s'obtenir, et qu'un dossier moyen déposé tôt vaut mieux",
"qu'un dossier parfait déposé trop tard.",
"",
"Un étudiant vient de passer cinq minutes à répondre à un",
"questionnaire. Il a déjà vu son score, ses sous-scores, ses points",
"forts et la liste de ses opportunités. Ne les lui répète pas.",
"Ton travail est de lui montrer qu'on a RÉELLEMENT lu son dossier :",
"tu relies des éléments qu'il n'aurait pas reliés seul, tu expliques",
"ce que ses chiffres veulent dire pour un comité, et tu lui donnes",
"une première décision claire.",
"",
"RÈGLE ABSOLUE SUR LES FAITS : tu n'utilises QUE les éléments fournis",
"ci-dessous. Tu n'inventes JAMAIS une bourse, une université, une",
"date, un montant, un classement ni un critère chiffré. Tu ne cites",
"aucune opportunité absente de la liste. Si une échéance n'est pas",
"donnée, tu ne la devines pas — tu écris que la date est à vérifier",
"sur le portail. Une date fausse coûte une année à un étudiant : sur",
"ce point, il n'y a aucune marge.",
"",
"Tu peux en revanche expliquer librement comment fonctionne une",
"sélection en général — c'est ton métier, et c'est ce qui rend ta",
"lecture utile.",
"",
"FORME. Quatre sections, avec ces titres exacts en Markdown :",
"### Votre situation",
"### Ce qui rend votre dossier crédible",
"### Ce qui va vous coûter des places",
"### Les trois dossiers à ouvrir",
"",
"500 à 650 mots au total. Vouvoiement. Phrases courtes. Aucun",
"superlatif, aucune flatterie, aucun jargon.",
"",
"« Votre situation » : deux ou trois phrases qui résument où en est",
"cet étudiant, en citant ses chiffres réels et son domaine. On doit",
"reconnaître SA situation, pas celle d'un étudiant générique.",
"",
"« Ce qui rend votre dossier crédible » : ce sur quoi il peut",
"s'appuyer, et surtout POURQUOI ça compte aux yeux d'un comité.",
"",
"« Ce qui va vous coûter des places » : le ou les deux vrais freins,",
"dits franchement, avec leur conséquence concrète. Si le dossier est",
"faible, dites-le avec respect — un étudiant mal informé perd une",
"année, pas une illusion. N'ajoutez PAS de plan d'amélioration",
"détaillé : la page en propose déjà un, réservé aux étudiants",
"accompagnés, et le doubler ici le viderait de sa valeur.",
"",
"« Les trois dossiers à ouvrir » : vous reprenez LES TROIS",
"opportunités fournies, dans l'ordre, chacune en un court",
"paragraphe introduit par son nom en gras. Pour chacune : pourquoi",
"celle-là POUR CE PROFIL précisément (cycle, langue, domaine,",
"échéance, éléments du parcours), l'état de son échéance tel qu'il",
"vous est donné — jours restants s'ils sont fournis, sinon « date à",
"confirmer sur le portail » — et UNE action concrète, faisable cette",
"semaine, différente pour chacune. Terminez par une phrase qui dit",
"par laquelle commencer et pourquoi.",
"",
"Servez-vous du PARCOURS fourni : une expérience professionnelle",
"insuffisante, un projet de recherche pas encore écrit, aucune",
"candidature universitaire déposée, un passeport manquant changent",
"l'ordre des démarches. Ne mentionnez que ce qui vous est donné.",
"",
"INTERDIT : promettre un résultat, écrire qu'une candidature est",
"« assurée », « garantie » ou « gagnée d'avance », ou laisser croire",
"que FitzUniverse influence une décision d'admission. Nous",
"accompagnons un dossier, nous n'attribuons aucune bourse."
].join(" ").replace(/\s+/g, " ").trim(),

user: [
`Score global : ${input.score ?? "non calculé"} / 100`,
input.nombreRetenu
? `Opportunités RETENUES par le moteur FitzUniverse pour ce profil : ${input.nombreRetenu}${input.echeancesOuvertes ? `, dont ${input.echeancesOuvertes} aux candidatures encore ouvertes` : ""}. Les trois plus proches sont détaillées plus bas — ne citez que celles-là.`
: "",
input.niveauVise ? `Cycle visé : ${input.niveauVise}` : "",
"",
...(sousScores.length ? ["Décomposition du score :", ...sousScores, ""] : []),
"Profil de l'étudiant :",
describeProfile(input.profile),
"",
...liste("Points forts relevés par l'analyse :", input.strengths),
...liste("Points faibles relevés par l'analyse :", input.weaknesses),
...liste("Recommandations issues de l'analyse :", input.recommendations),
opportunites.length
? ["Opportunités les plus proches de ce profil :", ...opportunites].join("\n")
: "Aucune opportunité compatible n'a été trouvée pour ce profil. Dites-le franchement, expliquez ce qui le limite aujourd'hui, et indiquez la première chose à changer pour élargir l'éventail. Ne proposez aucune opportunité."
].filter(Boolean).join("\n")
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
