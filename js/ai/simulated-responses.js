/**
* ============================================================
* ScholarBridge — gabarits "IA" simulés
* ============================================================
*
* Tout le contenu généré aujourd'hui par Fitz, sans dépendance
* réseau ni clé API — remplace l'ancien js/ai-service.js avec un
* contenu plus riche (5 styles de lettre, 10 types d'e-mail, un
* lexique de traduction, une analyse de dossier par catégories, des
* réponses de chat par intention).
*
* Ce fichier est délibérément le SEUL endroit qui "invente" du texte.
* js/ai/ai-client.js s'en sert comme source pendant la simulation ;
* le jour où un vrai modèle sera branché, ai-client.js appellera une
* API à la place et ce fichier pourra rester comme filet de secours
* hors-ligne.
* ============================================================
*/

// ==========================================================
// Outils internes
// ==========================================================

// Hash déterministe (djb2) — sert à dériver des scores "aléatoires"
// mais stables d'un nom de fichier, pour que ré-analyser le même
// document donne toujours le même résultat.
function hashString(value) {

let hash = 5381;

for (let i = 0; i < value.length; i++) {
hash = ((hash << 5) + hash) + value.charCodeAt(i);
hash |= 0;
}

return Math.abs(hash);

}

function scoreFromHash(seed, min = 55, max = 96) {
return min + (hashString(seed) % (max - min + 1));
}

function fullName(profile = {}) {
return [profile.firstName, profile.lastName].filter(Boolean).join(" ") || profile.name || profile.fullName || "";
}

// ==========================================================
// LETTRE DE MOTIVATION — 5 styles
// ==========================================================

export const LETTER_STYLES = {

academique: {
label: "Académique",
description: "Ton formel, centré sur le parcours universitaire et la rigueur intellectuelle."
},

professionnel: {
label: "Professionnel",
description: "Direct et structuré, met en avant les résultats concrets et l'employabilité future."
},

recherche: {
label: "Recherche",
description: "Orienté projet de recherche, publications, laboratoires et encadrants."
},

excellence: {
label: "Excellence",
description: "Ton ambitieux, insiste sur les distinctions, classements et objectifs élevés."
},

personnalise: {
label: "Personnalisé",
description: "Ton chaleureux et narratif, construit autour du parcours personnel de l'étudiant."
}

};

function letterIntro(style, input) {

const name = fullName(input.profile);
const university = input.university || "votre établissement";

switch (style) {

case "academique":
return `Madame, Monsieur,\n\nPar la présente, je me permets de solliciter mon admission au programme ${input.program || "que vous proposez"} au sein de ${university}.`;

case "professionnel":
return `Madame, Monsieur,\n\nJe vous adresse ma candidature pour le programme ${input.program || "concerné"} de ${university}, convaincu(e) que mon parcours et mes objectifs professionnels correspondent pleinement aux exigences de votre formation.`;

case "recherche":
return `Madame, Monsieur,\n\nC'est avec un vif intérêt pour les travaux menés au sein de ${university} que je vous soumets ma candidature au programme ${input.program || "de recherche"}.`;

case "excellence":
return `Madame, Monsieur,\n\nAnimé(e) par l'exigence académique et l'ambition qui caractérisent ${university}, je souhaite aujourd'hui rejoindre votre programme ${input.program || ""} pour y poursuivre un parcours d'excellence.`;

case "personnalise":
default:
return `Madame, Monsieur,\n\nJe m'appelle ${name || "un(e) étudiant(e) motivé(e)"} et c'est avec beaucoup d'enthousiasme que je vous présente ma candidature au programme ${input.program || ""} de ${university}.`;

}

}

function letterBody(style, input) {

const experiences = input.experiences || "un parcours académique solide et diversifié";
const skills = input.skills || "rigueur, autonomie et esprit d'analyse";
const motivations = input.motivations || "le désir de progresser dans un environnement académique exigeant et international";
const goals = input.goals || "construire une carrière à fort impact dans mon domaine";
const country = input.country || "votre pays";

const paragraphs = [];

paragraphs.push(
style === "recherche"
? `Mon parcours m'a permis de développer ${experiences}, et de me confronter à des problématiques qui nourrissent aujourd'hui mon projet de recherche. Je maîtrise notamment ${skills}, des compétences essentielles pour contribuer activement aux travaux de votre équipe.`
: `Mon parcours m'a permis de développer ${experiences}. J'ai également acquis des compétences que je considère essentielles pour réussir dans votre programme : ${skills}.`
);

paragraphs.push(
`Ce qui motive aujourd'hui ma candidature est ${motivations}. Étudier en ${country}, au sein de ${input.university || "votre université"}, représente pour moi une étape déterminante vers ${goals}.`
);

if (style === "excellence") {
paragraphs.push(`Je suis pleinement conscient(e) du niveau d'exigence de votre établissement, et c'est précisément cette exigence qui m'attire : je souhaite évoluer aux côtés d'étudiants et d'enseignants qui me pousseront à donner le meilleur de moi-même.`);
}

if (style === "recherche") {
paragraphs.push(`Je serais honoré(e) de pouvoir échanger avec les équipes encadrantes afin d'affiner un projet de recherche en cohérence avec les axes actuellement développés au sein de votre laboratoire.`);
}

if (style === "personnalise") {
paragraphs.push(`Au-delà des résultats académiques, je crois profondément que la curiosité et la persévérance sont les meilleurs moteurs de réussite — deux qualités que j'ai eu l'occasion de mettre à l'épreuve tout au long de mon parcours, et que je compte mettre au service de votre communauté étudiante.`);
}

return paragraphs.join("\n\n");

}

function letterClosing(input) {

const name = fullName(input.profile) || "";

return `Je reste à votre entière disposition pour toute information complémentaire ou pour un éventuel entretien. Dans l'attente d'une réponse favorable de votre part, je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.\n\n${name}`;

}

export function generateMotivationLetter(input) {

const style = LETTER_STYLES[input.style] ? input.style : "personnalise";

return [
letterIntro(style, input),
letterBody(style, input),
letterClosing(input)
].join("\n\n");

}

// ==========================================================
// E-MAILS — 10 types
// ==========================================================

export const EMAIL_TYPES = [
{ key: "contact_university", label: "Contacter une université", icon: "landmark" },
{ key: "reply_university", label: "Répondre à une université", icon: "reply" },
{ key: "request_info", label: "Demander des informations", icon: "help-circle" },
{ key: "request_deferral", label: "Demander un report", icon: "calendar-clock" },
{ key: "thank_you", label: "Remercier", icon: "heart-handshake" },
{ key: "send_documents", label: "Envoyer des documents", icon: "paperclip" },
{ key: "follow_up", label: "Relancer une candidature", icon: "send" },
{ key: "request_scholarship", label: "Demander une bourse", icon: "graduation-cap" },
{ key: "contact_professor", label: "Contacter un professeur", icon: "user-round" },
{ key: "contact_lab", label: "Contacter un laboratoire", icon: "flask-conical" }
];

function emailGreeting(data) {

if (data.emailType === "contact_professor" && data.contactName) {
return `Cher Professeur ${data.contactName},`;
}

if (data.emailType === "contact_lab" && data.contactName) {
return `Madame, Monsieur, à l'attention de ${data.contactName},`;
}

return "Madame, Monsieur,";

}

function emailSignature(data) {
return `Cordialement,\n\n${fullName(data.profile) || data.fullName || ""}`;
}

const EMAIL_BODIES = {

contact_university(data) {
return `Je me permets de vous adresser ce message afin de présenter ma candidature au programme ${data.program || "proposé par votre université"}.\n\nJe m'appelle ${fullName(data.profile) || data.fullName || ""}, ${data.nationality ? `de nationalité ${data.nationality}, ` : ""}titulaire d'un diplôme de ${data.degree || "niveau approprié"}. Je souhaite poursuivre mes études dans votre établissement afin de développer mes compétences académiques et professionnelles.\n\nJe reste à votre disposition pour tout complément d'information.`;
},

reply_university(data) {
return `Je vous remercie pour votre message concernant ${data.context || "ma candidature"}.\n\n${data.context ? `En réponse à votre demande : ${data.context}.` : "Je souhaite vous apporter les précisions suivantes concernant mon dossier."}\n\nN'hésitez pas à revenir vers moi si vous avez besoin d'informations complémentaires.`;
},

request_info(data) {
return `Je souhaiterais obtenir davantage d'informations concernant le programme ${data.program || "que vous proposez"}.\n\nAvant de déposer ma candidature, je souhaiterais notamment connaître les conditions d'admission, les frais de scolarité, les éventuelles bourses disponibles ainsi que la liste des documents requis.\n\nJe vous remercie par avance pour votre réponse.`;
},

request_deferral(data) {
return `Je me permets de vous contacter au sujet de mon admission au programme ${data.program || "concerné"}, pour laquelle j'ai eu l'honneur d'être accepté(e).\n\n${data.context || "En raison de circonstances imprévues, je souhaiterais solliciter un report de mon entrée dans le programme à la prochaine session disponible."}\n\nJe reste pleinement engagé(e) dans ce projet et vous remercie de la compréhension que vous voudrez bien m'accorder.`;
},

thank_you(data) {
return `Je tiens à vous remercier sincèrement pour ${data.context || "le temps consacré à l'étude de ma candidature ainsi que pour votre disponibilité"}.\n\nJe suis très reconnaissant(e) de l'attention portée à mon dossier${data.program ? ` pour le programme ${data.program}` : ""}.`;
},

send_documents(data) {
return `Comme convenu, veuillez trouver ci-joint les documents suivants concernant ma candidature${data.program ? ` au programme ${data.program}` : ""} :\n\n${(data.documentsList || "CV, lettre de motivation, relevé de notes")
.split(",")
.map((d) => `- ${d.trim()}`)
.join("\n")}\n\nJe reste à votre disposition si des documents supplémentaires étaient nécessaires.`;
},

follow_up(data) {
return `Je me permets de revenir vers vous concernant la candidature que j'ai soumise pour le programme ${data.program || "concerné"}.\n\nJe comprends que le traitement des dossiers demande du temps, mais je souhaiterais savoir si une décision a déjà été prise ou si des documents complémentaires sont nécessaires de ma part.`;
},

request_scholarship(data) {
return `Je souhaite vous adresser ma candidature pour une bourse d'études destinée au programme ${data.program || "que vous proposez"}.\n\nJe m'appelle ${fullName(data.profile) || data.fullName || ""}${data.nationality ? `, de nationalité ${data.nationality}` : ""}, titulaire d'un diplôme de ${data.degree || "niveau approprié"}. L'obtention de cette bourse me permettrait de réaliser mon projet académique dans les meilleures conditions.\n\nJe reste à votre entière disposition pour tout renseignement complémentaire.`;
},

contact_professor(data) {
return `Je vous contacte car je m'intéresse vivement à vos travaux${data.researchTopic ? ` sur ${data.researchTopic}` : ""}, dans le cadre de ma candidature au programme ${data.program || "de votre université"}.\n\n${data.context || "Je serais très honoré(e) de pouvoir échanger avec vous au sujet d'une éventuelle collaboration ou d'un encadrement."}`;
},

contact_lab(data) {
return `Je me permets de vous contacter au sujet des activités de votre laboratoire${data.researchTopic ? `, en particulier autour de ${data.researchTopic}` : ""}.\n\nDans le cadre de ma candidature au programme ${data.program || "concerné"}, je souhaiterais savoir s'il existe des opportunités de collaboration, de stage de recherche ou d'accueil au sein de votre équipe.`;
}

};

export function generateEmail(data) {

const bodyFn = EMAIL_BODIES[data.emailType];

if (!bodyFn) return "";

const subjectLine = EMAIL_TYPES.find((t) => t.key === data.emailType)?.label || "Candidature";

return `Objet : ${subjectLine}${data.university ? ` — ${data.university}` : ""}\n\n${emailGreeting(data)}\n\n${bodyFn(data)}\n\n${emailSignature(data)}`;

}

// ==========================================================
// TRADUCTION — lexique académique multilingue
// ==========================================================

export const LANGUAGES = [
{ code: "fr", label: "Français" },
{ code: "en", label: "Anglais" },
{ code: "es", label: "Espagnol" },
{ code: "de", label: "Allemand" },
{ code: "it", label: "Italien" },
{ code: "pt", label: "Portugais" }
];

// Lexique restreint (phrases académiques les plus fréquentes dans un
// dossier de candidature). Traduction "assistée" par substitution :
// honnête sur ses limites, mais réellement utile sur le vocabulaire
// qui compte le plus dans ce contexte précis.
const PHRASE_BANK = [
{ fr: "Madame, Monsieur", en: "Dear Sir or Madam", es: "Estimados señores", de: "Sehr geehrte Damen und Herren", it: "Gentile Signora, egregio Signore", pt: "Prezados Senhores" },
{ fr: "lettre de motivation", en: "motivation letter", es: "carta de motivación", de: "Motivationsschreiben", it: "lettera di motivazione", pt: "carta de motivação" },
{ fr: "curriculum vitae", en: "curriculum vitae", es: "currículum vitae", de: "Lebenslauf", it: "curriculum vitae", pt: "currículo" },
{ fr: "relevé de notes", en: "academic transcript", es: "expediente académico", de: "Notenübersicht", it: "certificato dei voti", pt: "histórico escolar" },
{ fr: "bourse d'études", en: "scholarship", es: "beca de estudios", de: "Stipendium", it: "borsa di studio", pt: "bolsa de estudos" },
{ fr: "candidature", en: "application", es: "candidatura", de: "Bewerbung", it: "candidatura", pt: "candidatura" },
{ fr: "université", en: "university", es: "universidad", de: "Universität", it: "università", pt: "universidade" },
{ fr: "programme", en: "program", es: "programa", de: "Programm", it: "programma", pt: "programa" },
{ fr: "diplôme", en: "degree", es: "título", de: "Abschluss", it: "diploma", pt: "diploma" },
{ fr: "documents requis", en: "required documents", es: "documentos requeridos", de: "erforderliche Unterlagen", it: "documenti richiesti", pt: "documentos exigidos" },
{ fr: "date limite", en: "deadline", es: "fecha límite", de: "Frist", it: "scadenza", pt: "prazo final" },
{ fr: "entretien", en: "interview", es: "entrevista", de: "Vorstellungsgespräch", it: "colloquio", pt: "entrevista" },
{ fr: "je vous remercie", en: "thank you", es: "les agradezco", de: "ich danke Ihnen", it: "vi ringrazio", pt: "agradeço" },
{ fr: "cordialement", en: "kind regards", es: "atentamente", de: "mit freundlichen Grüßen", it: "cordiali saluti", pt: "atenciosamente" },
{ fr: "je reste à votre disposition", en: "I remain at your disposal", es: "quedo a su disposición", de: "ich stehe Ihnen gerne zur Verfügung", it: "resto a vostra disposizione", pt: "permaneço à disposição" },
{ fr: "passeport", en: "passport", es: "pasaporte", de: "Reisepass", it: "passaporto", pt: "passaporte" },
{ fr: "lettre de recommandation", en: "recommendation letter", es: "carta de recomendación", de: "Empfehlungsschreiben", it: "lettera di raccomandazione", pt: "carta de recomendação" },
{ fr: "test de langue", en: "language test", es: "examen de idioma", de: "Sprachtest", it: "test di lingua", pt: "teste de idioma" },
{ fr: "frais de scolarité", en: "tuition fees", es: "matrícula", de: "Studiengebühren", it: "tasse universitarie", pt: "propinas" },
{ fr: "admission", en: "admission", es: "admisión", de: "Zulassung", it: "ammissione", pt: "admissão" }
];

function escapeRegExp(value) {
return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function matchCase(source, translated) {
if (source[0] === source[0].toUpperCase()) {
return translated.charAt(0).toUpperCase() + translated.slice(1);
}
return translated;
}

export function translateText({ text, sourceLanguage, targetLanguage }) {

if (!text || sourceLanguage === targetLanguage) {
return { text: text || "", matches: 0 };
}

let matches = 0;
let output = text;

const pairs = PHRASE_BANK
.filter((entry) => entry[sourceLanguage] && entry[targetLanguage])
.sort((a, b) => b[sourceLanguage].length - a[sourceLanguage].length);

pairs.forEach((entry) => {

const pattern = new RegExp(escapeRegExp(entry[sourceLanguage]), "gi");

output = output.replace(pattern, (found) => {
matches += 1;
return matchCase(found, entry[targetLanguage]);
});

});

return { text: output, matches };

}

const DETECTION_MARKERS = {
fr: ["le", "la", "les", "et", "je", "vous", "université", "études"],
en: ["the", "and", "you", "university", "application", "studies"],
es: ["el", "la", "los", "y", "usted", "universidad", "estudios"],
de: ["der", "die", "und", "sie", "universität", "studium"],
it: ["il", "la", "e", "lei", "università", "studi"],
pt: ["o", "a", "e", "você", "universidade", "estudos"]
};

export function detectLanguage(text) {

const lower = String(text || "").toLowerCase();

let bestCode = "fr";
let bestScore = -1;

Object.entries(DETECTION_MARKERS).forEach(([code, markers]) => {

const score = markers.reduce((total, marker) => (lower.includes(marker) ? total + 1 : total), 0);

if (score > bestScore) {
bestScore = score;
bestCode = code;
}

});

return bestCode;

}

// ==========================================================
// VÉRIFICATION DE DOSSIER — score par catégories
// ==========================================================

export const DOCUMENT_TYPES = [
{ key: "cv", label: "CV / Curriculum Vitae" },
{ key: "lettre", label: "Lettre de motivation" },
{ key: "passeport", label: "Passeport" },
{ key: "releve", label: "Relevé de notes" },
{ key: "diplome", label: "Diplôme" },
{ key: "recommandation", label: "Lettre de recommandation" },
{ key: "langue", label: "Test de langue" },
{ key: "financement", label: "Justificatif de financement" },
{ key: "autre", label: "Autre document" }
];

const CATEGORY_LABELS = {
clarity: "Clarté",
grammar: "Grammaire",
professionalism: "Professionnalisme",
coherence: "Cohérence",
completeness: "Complétude du dossier"
};

function guessTypeFromName(name) {

const lower = (name || "").toLowerCase();

if (lower.includes("cv") || lower.includes("resume")) return "cv";
if (lower.includes("motivation") || lower.includes("lettre")) return "lettre";
if (lower.includes("passport") || lower.includes("passeport")) return "passeport";
if (lower.includes("releve") || lower.includes("transcript") || lower.includes("bulletin")) return "releve";
if (lower.includes("diplome") || lower.includes("degree") || lower.includes("diploma")) return "diplome";
if (lower.includes("recommand")) return "recommandation";
if (lower.includes("toefl") || lower.includes("ielts") || lower.includes("tcf") || lower.includes("langue")) return "langue";
if (lower.includes("financ") || lower.includes("bourse") || lower.includes("sponsor")) return "financement";

return "autre";

}

export function analyzeDocument(file) {

const type = file.type || guessTypeFromName(file.name);
const base = scoreFromHash(file.name || "document");

return {
name: file.name,
size: file.size,
type,
score: base,
status: base >= 80 ? "success" : base >= 65 ? "warning" : "info",
note: base >= 80
? "Document bien structuré et conforme aux attentes."
: base >= 65
? "Document correct, quelques améliorations possibles."
: "Document prêt pour une analyse complète — pensez à l'étoffer avant l'envoi."
};

}

export function computeApplicationReport({ files = [], profile = {} }) {

const analyzed = files.map(analyzeDocument);

const presentTypes = new Set(analyzed.map((f) => f.type));
const documentsAvailable = Array.isArray(profile.documentsAvailable) ? profile.documentsAvailable : [];

const checklist = DOCUMENT_TYPES.filter((d) => d.key !== "autre").map((doc) => ({
...doc,
present: presentTypes.has(doc.key) || documentsAvailable.includes(doc.key)
}));

const completenessScore = Math.round((checklist.filter((c) => c.present).length / checklist.length) * 100);

const seed = analyzed.map((f) => f.name).join("|") || "dossier-vide";

const categories = {
clarity: analyzed.length ? Math.round(analyzed.reduce((s, f) => s + f.score, 0) / analyzed.length) : scoreFromHash(`${seed}-clarity`, 40, 70),
grammar: scoreFromHash(`${seed}-grammar`, 60, 97),
professionalism: scoreFromHash(`${seed}-pro`, 58, 95),
coherence: scoreFromHash(`${seed}-coherence`, 55, 93),
completeness: analyzed.length ? completenessScore : 0
};

const overallScore = Math.round(
Object.values(categories).reduce((sum, v) => sum + v, 0) / Object.keys(categories).length
);

const strengths = [];
const weaknesses = [];
const suggestions = [];

Object.entries(categories).forEach(([key, value]) => {

const label = CATEGORY_LABELS[key];

if (value >= 80) {
strengths.push(`${label} : très bon niveau (${value}/100).`);
} else if (value < 60) {
weaknesses.push(`${label} : à renforcer (${value}/100).`);
}

});

if (categories.completeness < 100) {
const missing = checklist.filter((c) => !c.present).map((c) => c.label);
suggestions.push(`Pour un dossier complet, pensez à ajouter : ${missing.join(", ")}.`);
}

if (categories.grammar < 75) {
suggestions.push("Faites relire vos documents pour peaufiner la grammaire et l'orthographe.");
}

if (categories.professionalism < 75) {
suggestions.push("Adoptez un ton plus formel dans vos documents (formules de politesse, structure claire).");
}

if (!analyzed.length) {
suggestions.push("Importez au moins un document pour obtenir une analyse détaillée de son contenu.");
}

if (!strengths.length) strengths.push("Votre dossier est en cours de constitution — poursuivez sur cette lancée.");
if (!suggestions.length) suggestions.push("Votre dossier est solide. Vérifiez tout de même les exigences spécifiques de chaque université avant l'envoi.");

return {
overallScore,
categories,
categoryLabels: CATEGORY_LABELS,
files: analyzed,
checklist,
strengths,
weaknesses,
suggestions
};

}

// ==========================================================
// CHAT — réponses par intention
// ==========================================================

const INTENTS = [
{
id: "greeting",
keywords: ["bonjour", "salut", "hello", "coucou"],
reply: (profile) => `Bonjour${profile && fullName(profile) ? ` ${fullName(profile).split(" ")[0]}` : ""}, je suis Fitz, votre assistant de candidature. Je peux vous aider sur vos bourses, vos documents, vos e-mails ou votre lettre de motivation. Que puis-je faire pour vous aujourd'hui ?`
},
{
id: "scholarship",
keywords: ["bourse", "financement", "scholarship", "frais"],
reply: (profile) => {
const field = profile?.desiredField ? ` en ${profile.desiredField}` : "";
const country = Array.isArray(profile?.preferredCountries) && profile.preferredCountries[0] ? ` vers ${profile.preferredCountries[0]}` : "";
return `Voici comment aborder la recherche de bourses${field}${country} :\n\n1. **Bourses d'excellence académique** — basées sur votre dossier scolaire.\n2. **Bourses gouvernementales** — souvent proposées par le pays d'accueil (Erasmus+, Chevening, Eiffel...).\n3. **Bourses spécifiques à l'université** — à vérifier directement sur le site de l'établissement visé.\n\nAstuce : préparez toujours un justificatif de financement de secours, même en visant une bourse — cela rassure les admissions.`;
}
},
{
id: "documents",
keywords: ["document", "dossier", "checklist", "pièce"],
reply: () => `Voici les documents généralement attendus pour une candidature internationale :\n\n| Document | Requis | Format conseillé |\n|---|---|---|\n| CV | Oui | PDF, 1-2 pages |\n| Lettre de motivation | Oui | PDF |\n| Relevé de notes | Oui | PDF traduit/certifié |\n| Test de langue | Selon programme | Score officiel |\n| Lettres de recommandation | Souvent | 1 à 3 lettres |\n\nUtilisez **Vérification du dossier** pour un contrôle détaillé de vos documents.`
},
{
id: "letter",
keywords: ["lettre de motivation", "motivation"],
reply: () => `Une bonne lettre de motivation :\n\n- Commence par une accroche personnelle, plutôt qu'une formule générique.\n- Relie clairement votre parcours au programme visé.\n- Reste concise : 4 à 6 paragraphes suffisent.\n\nVous pouvez en générer une adaptée à votre profil directement depuis **Lettre de motivation**, avec 5 styles au choix.`
},
{
id: "email",
keywords: ["email", "e-mail", "mail", "courriel"],
reply: () => `Pour contacter une université par e-mail, restez concis (150-250 mots), avec un objet clair et une formule de politesse adaptée. L'outil **E-mails Fitz** propose 10 types de messages prêts à personnaliser (demande d'admission, relance, remerciement, contact d'un professeur...).`
},
{
id: "translate",
keywords: ["traduire", "traduction", "translate"],
reply: () => `Je peux vous orienter vers **Traduction de documents** pour traduire vos textes entre français, anglais, espagnol, allemand, italien et portugais. Pour les documents officiels (diplômes, relevés), pensez aussi à vérifier si l'université exige une traduction assermentée.`
},
{
id: "interview",
keywords: ["entretien", "interview"],
reply: () => `Pour préparer un entretien d'admission :\n\n1. Relisez votre lettre de motivation — on vous posera probablement des questions dessus.\n2. Préparez 2-3 exemples concrets illustrant vos compétences.\n3. Anticipez la question "Pourquoi notre université ?" avec une réponse spécifique, pas générique.\n\nSouhaitez-vous que je vous prépare des questions d'entraînement ?`
},
{
id: "deadline",
keywords: ["délai", "date limite", "deadline"],
reply: () => `Les délais varient énormément selon les universités et les pays — certains programmes ferment leurs candidatures 8 à 10 mois avant la rentrée. Je vous conseille de vérifier systématiquement la page "Admissions" officielle de chaque université visée, et de vous y prendre le plus tôt possible.`
},
{
id: "thanks",
keywords: ["merci", "thanks"],
reply: () => `Avec plaisir ! N'hésitez pas si vous avez d'autres questions sur votre candidature.`
}
];

export function getSuggestedQuestions(profile = {}) {

const suggestions = [
"Comment structurer une lettre de motivation efficace ?",
"Quels documents dois-je préparer pour candidater ?",
"Comment relancer une université après ma candidature ?"
];

if (profile.desiredField) {
suggestions.unshift(`Quelles bourses existent pour étudier ${profile.desiredField} à l'étranger ?`);
}

if (Array.isArray(profile.preferredCountries) && profile.preferredCountries[0]) {
suggestions.push(`Que dois-je savoir pour candidater en ${profile.preferredCountries[0]} ?`);
}

return suggestions.slice(0, 4);

}

export function generateChatReply({ message, profile }) {

const lower = String(message || "").toLowerCase();

const intent = INTENTS.find((i) => i.keywords.some((kw) => lower.includes(kw)));

if (intent) return intent.reply(profile);

return `Merci pour votre message ! Voici ce que je peux déjà faire pour vous :\n\n- Répondre à vos questions sur les bourses, documents, entretiens et délais.\n- Vous orienter vers **Lettre de motivation**, **E-mails Fitz**, **Traduction** ou **Vérification du dossier**.\n\nReformulez votre question, ou choisissez une suggestion ci-dessous pour continuer.`;

}
