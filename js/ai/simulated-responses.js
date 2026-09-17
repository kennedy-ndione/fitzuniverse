/**
* ============================================================
* FitzUniverse — gabarits "IA" simulés
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

import { PROFILE_READY_THRESHOLD } from "../profile-score.js";

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

/**
* LA LETTRE DE VŒU (lot PRÉ-FITZ, 2026-09-10) — quatre à cinq lignes, une
* par formation, pour la commission pédagogique de CETTE formation dans
* CET établissement : parcours en bref, intérêt précis, lien avec
* l'objectif professionnel. Source : Campus France Côte d'Ivoire, étape
* des vœux, vérifiée le 2026-09-08 — qui ajoute : « Évitez le déluge de
* louanges sur la France et son enseignement, c'est inutile ». Aucune
* louange ici, donc, et aucun style : la forme est celle du portail.
*
* Six lignes au plus, sans ligne vide : un test compte les lignes.
*/
export function generateLettreDeVoeu(input) {

const profile = input.profile || {};
const name = fullName(profile) || "";
const diplome = profile.lastDegree || profile.currentDegree || "";
const domaine = profile.desiredField || "";
const formation = input.program || "la formation demandée";
const etablissement = input.university || "votre établissement";
const niveau = input.level ? ` (${input.level})` : "";
const interet = input.motivations || `son programme, que j'ai lu dans le détail, et la place qu'y tient ${domaine || "ma discipline"}`;
const objectif = input.goals || `exercer dans ${domaine || "ce domaine"} avec un diplôme reconnu`;
const experiences = input.experiences ? ` Mon parcours — ${input.experiences} — m'y prépare.` : "";

return [
"Madame, Monsieur,",
`${diplome ? `Titulaire de ${diplome}${domaine ? ` en ${domaine}` : ""}, je` : "Je"} souhaite rejoindre la formation ${formation}${niveau} de ${etablissement}.`,
`Ce qui m'y attire précisément : ${interet}.${experiences}`,
`Cette formation s'inscrit dans mon objectif professionnel : ${objectif}.`,
"Je vous remercie de l'attention que vous porterez à ma demande.",
name
].filter((ligne) => ligne !== "").join("\n");

}

export function generateMotivationLetter(input) {

// Une candidature de préinscription ne reçoit JAMAIS une lettre de
// bourse d'une page : elle reçoit sa lettre de vœu.
if (lireParcoursDeSaisie(input) === "preinscription") return generateLettreDeVoeu(input);

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
// `parcours` : les seuls parcours où ce type a un sens. Absent = les deux.
{ key: "request_scholarship", label: "Demander une bourse", icon: "graduation-cap", parcours: ["bourse"] },
{ key: "contact_professor", label: "Contacter un professeur", icon: "user-round" },
{ key: "contact_lab", label: "Contacter un laboratoire", icon: "flask-conical" }
];

/** Les types d'e-mail qui ont un sens dans ce parcours (lot PRÉ-FITZ). */
export function typesEmailPour(parcours) {
return EMAIL_TYPES.filter((t) => !t.parcours || t.parcours.includes(parcours));
}

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
{ code: "pt", label: "Portugais" },
// L'ARABE (2026-09-17, demandé par Charles). L'étape 4 de la route
// liste une pièce « Certification B2 de français (bac Arabe L-AR
// uniquement) » : les étudiants concernés ont leurs relevés et leurs
// diplômes EN ARABE, et l'outil ne connaissait que des langues
// latines. Il les accueillait sans pouvoir les servir.
{ code: "ar", label: "Arabe" }
];

/**
* Les langues qui s'écrivent de droite à gauche. Une seule aujourd'hui,
* mais la liste existe pour que la page n'ait pas à tester `=== "ar"` :
* le persan, l'ourdou et l'hébreu viendraient s'ajouter ici, et le
* rendu suivrait sans une ligne de plus.
*/
export const LANGUES_RTL = ["ar"];

/** Vrai si cette langue s'écrit de droite à gauche. */
export function estRTL(code) {
return LANGUES_RTL.includes(String(code || "").toLowerCase());
}

// Lexique restreint (phrases académiques les plus fréquentes dans un
// dossier de candidature). Traduction "assistée" par substitution :
// honnête sur ses limites, mais réellement utile sur le vocabulaire
// qui compte le plus dans ce contexte précis.
//
// L'ARABE EST ENTRÉ ICI LE 2026-09-17, dans les deux sens : le pivot
// est le français, et `translateText` ne garde que les paires dont les
// DEUX langues sont remplies — l'arabe vers le français marche donc
// avec les mêmes entrées, ce qui est le sens dont un étudiant au bac
// arabe a besoin (lire son propre relevé en français avant de le faire
// traduire pour de bon).
//
// CE QUE CE LEXIQUE N'EST PAS : une traduction assermentée. La
// procédure Études en France exige un traducteur assermenté pour les
// diplômes et les relevés ; ai-translate.html le dit désormais en
// clair sur le parcours préinscription. Vingt expressions substituées
// aident à COMPRENDRE et à PRÉPARER, elles ne produisent aucune pièce
// déposable.
const PHRASE_BANK = [
{ fr: "Madame, Monsieur", en: "Dear Sir or Madam", es: "Estimados señores", de: "Sehr geehrte Damen und Herren", it: "Gentile Signora, egregio Signore", pt: "Prezados Senhores", ar: "سيدي، سيدتي" },
{ fr: "lettre de motivation", en: "motivation letter", es: "carta de motivación", de: "Motivationsschreiben", it: "lettera di motivazione", pt: "carta de motivação", ar: "رسالة الدافع" },
{ fr: "curriculum vitae", en: "curriculum vitae", es: "currículum vitae", de: "Lebenslauf", it: "curriculum vitae", pt: "currículo", ar: "السيرة الذاتية" },
{ fr: "relevé de notes", en: "academic transcript", es: "expediente académico", de: "Notenübersicht", it: "certificato dei voti", pt: "histórico escolar", ar: "كشف الدرجات" },
{ fr: "bourse d'études", en: "scholarship", es: "beca de estudios", de: "Stipendium", it: "borsa di studio", pt: "bolsa de estudos", ar: "منحة دراسية" },
{ fr: "candidature", en: "application", es: "candidatura", de: "Bewerbung", it: "candidatura", pt: "candidatura", ar: "طلب الترشح" },
{ fr: "université", en: "university", es: "universidad", de: "Universität", it: "università", pt: "universidade", ar: "جامعة" },
{ fr: "programme", en: "program", es: "programa", de: "Programm", it: "programma", pt: "programa", ar: "برنامج" },
{ fr: "diplôme", en: "degree", es: "título", de: "Abschluss", it: "diploma", pt: "diploma", ar: "شهادة" },
{ fr: "documents requis", en: "required documents", es: "documentos requeridos", de: "erforderliche Unterlagen", it: "documenti richiesti", pt: "documentos exigidos", ar: "الوثائق المطلوبة" },
{ fr: "date limite", en: "deadline", es: "fecha límite", de: "Frist", it: "scadenza", pt: "prazo final", ar: "الموعد النهائي" },
{ fr: "entretien", en: "interview", es: "entrevista", de: "Vorstellungsgespräch", it: "colloquio", pt: "entrevista", ar: "مقابلة" },
{ fr: "je vous remercie", en: "thank you", es: "les agradezco", de: "ich danke Ihnen", it: "vi ringrazio", pt: "agradeço", ar: "أشكركم" },
{ fr: "cordialement", en: "kind regards", es: "atentamente", de: "mit freundlichen Grüßen", it: "cordiali saluti", pt: "atenciosamente", ar: "مع خالص التقدير" },
{ fr: "je reste à votre disposition", en: "I remain at your disposal", es: "quedo a su disposición", de: "ich stehe Ihnen gerne zur Verfügung", it: "resto a vostra disposizione", pt: "permaneço à disposição", ar: "أبقى رهن إشارتكم" },
{ fr: "passeport", en: "passport", es: "pasaporte", de: "Reisepass", it: "passaporto", pt: "passaporte", ar: "جواز السفر" },
{ fr: "lettre de recommandation", en: "recommendation letter", es: "carta de recomendación", de: "Empfehlungsschreiben", it: "lettera di raccomandazione", pt: "carta de recomendação", ar: "رسالة توصية" },
{ fr: "test de langue", en: "language test", es: "examen de idioma", de: "Sprachtest", it: "test di lingua", pt: "teste de idioma", ar: "اختبار اللغة" },
{ fr: "frais de scolarité", en: "tuition fees", es: "matrícula", de: "Studiengebühren", it: "tasse universitarie", pt: "propinas", ar: "الرسوم الدراسية" },
{ fr: "admission", en: "admission", es: "admisión", de: "Zulassung", it: "ammissione", pt: "admissão", ar: "القبول" }
];

function escapeRegExp(value) {
return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function matchCase(source, translated) {
// LE TEST PORTE SUR LA MINUSCULE, PAS SUR LA MAJUSCULE (2026-09-17).
// `source[0] === source[0].toUpperCase()` est VRAI pour toute écriture
// sans casse : un « ش » est égal à sa propre majuscule, et la règle
// capitalisait donc la traduction française de n'importe quel mot
// arabe, y compris au milieu d'une phrase. Comparer à la minuscule ne
// change rien pour les écritures latines — « M » ≠ « m », « m » = « m »
// — et rend l'arabe à ce qu'il est : une écriture sans casse.
if (source[0] !== source[0].toLowerCase()) {
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
pt: ["o", "a", "e", "você", "universidade", "estudos"],
ar: ["في", "من", "على", "جامعة", "شهادة", "الدراسة"]
};

/**
* L'ÉCRITURE TRANCHE AVANT LES MOTS (2026-09-17).
*
* Les six langues latines se départagent à coups de marqueurs — « le »,
* « the », « der » — parce qu'elles partagent l'alphabet. L'arabe n'a
* pas ce problème : un texte qui contient des lettres arabes EST en
* arabe, et aucun compte de marqueurs ne peut faire mieux que ce fait.
* Ce garde passe donc avant, et il est le seul certain de la fonction.
*
* Plage U+0600–U+06FF (arabe de base) plus U+0750–U+077F (supplément) :
* de quoi couvrir un relevé de notes maghrébin ou moyen-oriental.
*/
const ECRITURE_ARABE = /[\u0600-\u06FF\u0750-\u077F]/;

export function detectLanguage(text) {

const brut = String(text || "");
if (ECRITURE_ARABE.test(brut)) return "ar";

const lower = brut.toLowerCase();

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
// VÉRIFICATION FINALE AVANT DÉPÔT — une candidature précise, pas des
// documents importés (voir computeApplicationReport ci-dessus, pour la
// tâche "check"). Calcul réel sur l'état Firestore de la candidature
// (checklist, lettre générée, délai, score de profil) — même honnêteté
// que le reste de la simulation : aucune analyse de contenu, mais un
// verdict qui reflète exactement ce que l'étudiant a réellement fait.
// ==========================================================

function daysUntil(isoDate) {

if (!isoDate) return null;

const target = new Date(`${isoDate}T00:00:00`);
const today = new Date();

target.setHours(0, 0, 0, 0);
today.setHours(0, 0, 0, 0);

return Math.round((target - today) / 86400000);

}

export function computeApplicationReadiness({
checklist = [],
hasGeneratedLetter = false,
deadline = null,
profileScore = 0,
applicationId = null,
etapesProcedure = [],
...reste
} = {}) {

// PRÉINSCRIPTION (lot PRÉ-FITZ) : « prêt » veut dire que les étapes de
// la procédure de portail sont faites, avec leurs preuves — l'état
// que js/application-journey.js (etapesDeProcedure) calcule déjà.
// Ni lettre d'une page à avoir générée, ni barème de profil : ce
// dossier n'est pas jugé sur l'excellence, il est reçu ou non.
if (lireParcoursDeSaisie(reste) === "preinscription") {
const etapes = Array.isArray(etapesProcedure) ? etapesProcedure : [];
const faites = etapes.filter((e) => e.done === true);
const missingItems = etapes.filter((e) => e.done !== true).map((e) => ({
id: `procedure-${e.id}`,
text: `${e.label}${e.preuve && e.preuve !== "aucune" ? ` — preuve attendue : ${e.preuve}` : ""}${e.echeanceISO ? ` (avant le ${e.echeanceISO})` : ""}.`,
actionLabel: "Ouvrir cette étape",
actionHref: null
}));
if (!etapes.length) {
missingItems.push({
id: "procedure-absente",
text: "Aucune étape de procédure n'est rattachée à ce dossier : liez-le à une destination dont la procédure est documentée, et renseignez votre pays de résidence dans votre profil.",
actionLabel: "Compléter mon profil",
actionHref: "profile.html"
});
}
return {
ready: etapes.length > 0 && missingItems.length === 0,
missingItems,
checklistDone: faites.length,
checklistTotal: etapes.length,
hasGeneratedLetter,
daysLeft: deadline ? daysUntil(deadline) : null
};
}

const items = Array.isArray(checklist) ? checklist : [];
const checklistTotal = items.length;
const checklistDone = items.filter((i) => i.status === "complete").length;
const checklistComplete = checklistTotal > 0 && checklistDone === checklistTotal;

const missingItems = [];

if (!hasGeneratedLetter) {
missingItems.push({
id: "letter",
text: "La lettre de motivation de cette candidature n'a pas encore été générée.",
actionLabel: "Générer avec Fitz",
actionHref: applicationId ? `ai-letter.html?applicationId=${applicationId}` : "ai-letter.html"
});
}

if (checklistTotal === 0) {
missingItems.push({
id: "checklist-empty",
text: "Le dossier de candidature (lettres de recommandation, test de langue, preuve financière) n'a pas encore été renseigné.",
actionLabel: "Ouvrir le dossier de candidature",
actionHref: null
});
} else if (!checklistComplete) {
const remaining = checklistTotal - checklistDone;
missingItems.push({
id: "checklist-incomplete",
text: `${remaining} élément${remaining > 1 ? "s" : ""} du dossier de candidature encore incomplet${remaining > 1 ? "s" : ""}.`,
actionLabel: "Voir le dossier de candidature",
actionHref: null
});
}

if (profileScore < PROFILE_READY_THRESHOLD) {
missingItems.push({
id: "profile",
text: "Votre profil général n'est pas encore assez complet — Fitz s'appuie dessus pour personnaliser vos documents.",
actionLabel: "Compléter mon profil",
actionHref: "profile.html"
});
}

return {
ready: missingItems.length === 0,
missingItems,
checklistDone,
checklistTotal,
hasGeneratedLetter,
daysLeft: deadline ? daysUntil(deadline) : null
};

}

// ==========================================================
// CHAT — réponses par intention
// ==========================================================

// ==========================================================
// CONTEXTE RÉEL DE L'ÉTUDIANT (2026-09-02) — le chat reçoit désormais
// ses candidatures (input.applications) : échéances, statuts,
// universités. Fitz répond avec SES données, plus jamais en généralités
// quand du concret existe.
// ==========================================================

import { TESTS, testDepuisNom } from "../test-prep-data.js";
// Lot PRÉ-FITZ : le simulateur lit le parcours comme les prompts, par la
// même fonction — deux vocabulaires, jamais mélangés dans une sortie.
import { lireParcoursDeSaisie } from "../parcours.js";

function parseDeadline(app) {

if (!app || !app.deadline) return null;

const d = new Date(`${app.deadline}T23:59:59`);

return Number.isNaN(d.getTime()) ? null : d;

}

function joursRestants(date) {
return Math.ceil((date.getTime() - Date.now()) / 86400000);
}

function formatFr(date) {
return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

// Candidatures à échéance FUTURE, triées de la plus proche à la plus
// lointaine.
function upcomingApplications(applications) {

return (Array.isArray(applications) ? applications : [])
.map((app) => ({ app, date: parseDeadline(app) }))
.filter((x) => x.date && joursRestants(x.date) >= 0)
.sort((a, b) => a.date - b.date);

}

function appLabel(app) {

const parts = [app.university, app.scholarship].filter(Boolean);

return parts.length ? parts.join(" — ") : "votre candidature";

}

const STATUS_FR = {
a_preparer: "à préparer",
en_cours: "en cours de préparation",
deposee: "déposée",
en_attente: "en attente de réponse",
reponse_recue: "réponse reçue",
liste_attente: "en liste d'attente",
admise: "admise 🎉",
refusee: "refusée"
};

// ==========================================================
// BRIEFING D'ENTRAÎNEMENT (page Préparation aux tests →
// « M'entraîner avec Fitz ») : stratégie calée sur les VRAIES
// échéances de l'étudiant (bourse/université), pas un plan générique.
// ==========================================================

export function buildTestPrepBriefing({ testId, profile, applications }) {

const fiche = TESTS.find((t) => t.id === testId) || testDepuisNom(testId);

if (!fiche) {
return "Je n'ai pas reconnu ce test. Dites-moi lequel vous préparez (IELTS, TOEFL, TOPIK, JLPT, HSK, DELF, TCF, TestDaF, Duolingo) et je vous monte un plan.";
}

const prenom = profile && profile.firstName ? ` ${String(profile.firstName).trim().split(/\s+/)[0]}` : "";
const lignes = [];

lignes.push(`Très bien${prenom}, on prépare le **${fiche.nom}**. Voici votre stratégie :`);
lignes.push("");

// Préférer une candidature EN RAPPORT avec le test (une échéance
// italienne ne doit pas cadencer une préparation au TOPIK) ; à
// défaut, la plus proche.
const AFFINITES = {
topik: /gks|cor[ée]e|korea|seoul|kaist|yonsei|postech/i,
jlpt: /mext|japon|japan|tokyo|kyoto|osaka/i,
hsk: /csc|chin|beijing|shanghai|nanjing|tsinghua|beihang|zhejiang/i,
testdaf: /daad|allemagne|germany|berlin|m[üu]nchen|heidelberg|aachen/i,
"delf-dalf": /france|eiffel|paris|lyon|belgique|bruxelles|qu[ée]bec/i,
tcf: /france|paris|campus france|qu[ée]bec/i
};

const upcomingAll = upcomingApplications(applications);
const affinite = AFFINITES[fiche.id];
const upcoming = affinite
? (upcomingAll.filter((x) => affinite.test(`${x.app.university || ""} ${x.app.scholarship || ""}`)).length
? upcomingAll.filter((x) => affinite.test(`${x.app.university || ""} ${x.app.scholarship || ""}`))
: upcomingAll)
: upcomingAll;

if (upcoming.length) {

const { app, date } = upcoming[0];
const jours = joursRestants(date);
const semaines = Math.max(0, Math.floor(jours / 7));

lignes.push(`**Votre échéance de référence : ${appLabel(app)}**, dossier attendu le **${formatFr(date)}** — soit **${jours} jour${jours > 1 ? "s" : ""}** (${semaines} semaine${semaines > 1 ? "s" : ""}).`);
lignes.push("");

if (semaines >= 10) {

const coeur = semaines - 3;

lignes.push(`Avec ${semaines} semaines devant vous, on travaille confortablement en trois phases :`);
lignes.push("");
lignes.push(`1. **Semaine 1 — diagnostic.** ${fiche.plan[0]}`);
lignes.push(`2. **Semaines 2 à ${1 + coeur} — le cœur.** ${fiche.plan[1]} ${fiche.plan[2] || ""}`);
lignes.push(`3. **Les 2 dernières semaines — conditions réelles.** ${fiche.plan[fiche.plan.length - 1]}`);

} else if (semaines >= 4) {

lignes.push(`${semaines} semaines, c'est jouable mais serré — plan condensé :`);
lignes.push("");
lignes.push(`1. **Cette semaine — diagnostic express.** ${fiche.plan[0]}`);
lignes.push(`2. **Semaines suivantes.** ${fiche.plan[1]}`);
lignes.push(`3. **Dernière semaine.** ${fiche.plan[fiche.plan.length - 1]}`);

} else {

lignes.push(`⚠️ **${jours} jours, c'est très court.** Deux vérifications AVANT de vous lancer :`);
lignes.push("");
lignes.push(`- **Sessions** : ${fiche.sessions}`);
lignes.push(`- **Résultats** : ${fiche.resultats} — comparez ce délai à votre échéance : si les résultats arrivent après la date limite, contactez l'université pour savoir si un envoi différé du score est accepté (c'est fréquent), et concentrez-vous sur le reste du dossier en parallèle.`);

}

lignes.push("");
lignes.push(`Rappel utile : **${fiche.exigenceHabituelle}**`);

} else {

lignes.push(`Je ne vois pas encore d'échéance dans vos candidatures suivies — ajoutez votre date limite dans **Mes candidatures** et je calerai ce plan dessus au jour près.`);
lignes.push("");
lignes.push(`En attendant, préparation type (${fiche.dureePrepa}) :`);
lignes.push("");
fiche.plan.forEach((etape, i) => lignes.push(`${i + 1}. ${etape}`));

}

lignes.push("");
lignes.push(`**Bon à savoir** : sessions — ${fiche.sessions} Résultats : ${fiche.resultats}`);
lignes.push("");
lignes.push(`On commence maintenant ? ${fiche.fitz}`);

return lignes.join("\n");

}

const INTENTS = [

// PRIORITAIRE — l'étudiant demande où il en est : on répond avec SES
// candidatures réelles (statuts + prochaine échéance), pas une leçon.
{
id: "status",
keywords: ["mes candidatures", "où j'en suis", "ou j'en suis", "mon avancement", "statut de", "point sur mon dossier"],
reply: (profile, ctx) => {

const apps = Array.isArray(ctx?.applications) ? ctx.applications : [];

if (!apps.length) {
return `Vous ne suivez pas encore de candidature dans **Mes candidatures**. C'est la première étape : ajoutez-y les programmes qui vous intéressent (le catalogue peut vous en suggérer), et je pourrai suivre vos échéances avec vous.`;
}

const lignes = [`Voici où vous en êtes, sur ${apps.length} candidature${apps.length > 1 ? "s" : ""} suivie${apps.length > 1 ? "s" : ""} :`, ""];

apps.slice(0, 6).forEach((app) => {
const date = parseDeadline(app);
const echeance = date ? ` — échéance le ${formatFr(date)} (${joursRestants(date) >= 0 ? `J-${joursRestants(date)}` : "dépassée"})` : "";
lignes.push(`- **${appLabel(app)}** : ${STATUS_FR[app.status] || app.status || "statut inconnu"}${echeance}`);
});

const next = upcomingApplications(apps)[0];

if (next) {
lignes.push("", `👉 Priorité : **${appLabel(next.app)}** (J-${joursRestants(next.date)}). Un contrôle avant dépôt ? Passez par **Vérification du dossier**.`);
}

return lignes.join("\n");

}
},

// PRIORITAIRE — préparation d'un test précis : mini-stratégie calée
// sur les échéances réelles (le grand briefing arrive via la page
// Préparation aux tests → « M'entraîner avec Fitz »).
{
id: "test-prep",
keywords: ["topik", "ielts", "toefl", "jlpt", "hsk", "testdaf", "goethe", "delf", "dalf", "tcf", "duolingo", "m'entraîner", "m'entrainer", "test de langue", "préparer un test", "preparer un test"],
reply: (profile, ctx) => {

const fiche = testDepuisNom(ctx?.message || "") || null;

if (fiche) {
return buildTestPrepBriefing({ testId: fiche.id, profile, applications: ctx?.applications });
}

return `Dites-moi quel test vous préparez (IELTS, TOEFL, TOPIK, JLPT, HSK, DELF/DALF, TCF, TestDaF ou Duolingo) et je vous monte un plan calé sur vos échéances. La page **Préparation aux tests** de votre parcours compare aussi les fiches complètes.`;

}
},

{
id: "greeting",
keywords: ["bonjour", "salut", "hello", "coucou"],
reply: (profile, ctx) => ctx?.parcours === "preinscription"
? `Bonjour${profile && fullName(profile) ? ` ${fullName(profile).split(" ")[0]}` : ""}, je suis Fitz. Je peux vous aider sur vos établissements, les pièces de votre dossier, la procédure du portail, vos lettres de vœu ou un courriel à une formation. Que puis-je faire pour vous aujourd'hui ?`
: `Bonjour${profile && fullName(profile) ? ` ${fullName(profile).split(" ")[0]}` : ""}, je suis Fitz, votre assistant de candidature. Je peux vous aider sur vos bourses, vos documents, vos e-mails ou votre lettre de motivation. Que puis-je faire pour vous aujourd'hui ?`
},
{
id: "scholarship",
keywords: ["bourse", "financement", "scholarship", "frais"],
reply: (profile, ctx) => {
// En préinscription, « frais » et « financement » sont une question de
// RESSOURCES À JUSTIFIER, pas de bourse à décrocher : la réponse ne
// mélange pas les deux vocabulaires.
if (ctx?.parcours === "preinscription") {
return `Pour une préinscription, le financement est le vôtre — et le portail vous demandera de le PROUVER, pas de le demander :\n\n1. **Les droits d'inscription** de la formation, à budgéter en totalité : une exonération n'est jamais acquise d'avance.\n2. **La preuve de ressources** exigée pour le visa : attestation bancaire ou garant, au niveau publié par le pays d'accueil.\n3. **Les frais de dossier** de la procédure de votre pays de résidence, non remboursables — ne payez jamais avant la demande de paiement officielle.\n\nLe **Diagnostic France** de votre espace fait ce calcul avec vos chiffres, chaque montant avec sa source.`;
}
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
keywords: ["délai", "date limite", "deadline", "échéance", "echeance"],
reply: (profile, ctx) => {

const upcoming = upcomingApplications(ctx?.applications);

if (upcoming.length) {

const lignes = ["Vos prochaines échéances réelles :", ""];

upcoming.slice(0, 3).forEach(({ app, date }) => {
lignes.push(`- **${appLabel(app)}** — ${formatFr(date)} (**J-${joursRestants(date)}**)`);
});

const first = upcoming[0];
lignes.push("", joursRestants(first.date) <= 21
? `⚠️ La première arrive vite : passez votre dossier ${appLabel(first.app)} par **Vérification du dossier** cette semaine.`
: `Vous avez de la marge — profitez-en pour finaliser lettre de motivation et lettres de recommandation en avance.`);

return lignes.join("\n");

}

return `Les délais varient énormément selon les universités et les pays — certains programmes ferment leurs candidatures 8 à 10 mois avant la rentrée. Ajoutez vos dates limites dans **Mes candidatures** : je pourrai alors vous répondre avec VOS échéances, au jour près.`;

}
},
{
id: "thanks",
keywords: ["merci", "thanks"],
reply: () => `Avec plaisir ! N'hésitez pas si vous avez d'autres questions sur votre candidature.`
}
];

export function getSuggestedQuestions(profile = {}, parcours = "bourse") {

// Préinscription : aucune question de bourse, et une lettre de vœu de
// quatre lignes plutôt qu'une lettre de motivation d'une page.
if (parcours === "preinscription") {
return [
"Qu'est-ce qu'une lettre de vœu, et combien en faut-il ?",
"Quelles pièces la procédure de mon pays exige-t-elle ?",
"Comment prouver mes ressources pour le visa ?",
"Comment se passe l'entretien pédagogique ?"
];
}

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

// Un message est « illisible » quand il ne contient presque aucun mot
// réel — suite de consonnes, martèlement de clavier. On répond alors
// par une clarification courte et polie, jamais par un enthousiasme
// générique (constaté sur capture utilisateur : « JNJHSJHF NKZJKZ »
// recevait un paragraphe promotionnel — non professionnel).
function looksUnreadable(message) {

const cleaned = String(message || "").trim();

if (cleaned.length < 2) return true;

const words = cleaned.split(/\s+/);
const readable = words.filter((w) => /[aeiouyàâäéèêëîïôöùûü]/i.test(w) && w.length >= 2);

return readable.length === 0;

}

export function generateChatReply({ message, profile, applications, testPrep, history, parcours, track }) {

const parcoursLu = lireParcoursDeSaisie({ parcours, track });

// Arrivée depuis « M'entraîner avec Fitz » (Préparation aux tests) :
// Fitz sait POURQUOI l'étudiant est là et ouvre directement la
// stratégie, calée sur ses échéances réelles.
if (testPrep) {
return buildTestPrepBriefing({ testId: testPrep, profile, applications });
}

if (looksUnreadable(message)) {
return `Je n'ai pas réussi à lire votre message — il s'est peut-être envoyé trop vite. Reformulez en une phrase, ou choisissez un point de départ :\n\n- « Où j'en suis dans mes candidatures ? »\n- « Quelles sont mes prochaines échéances ? »\n- « Aide-moi à préparer mon test de langue. »`;
}

const lower = String(message || "").toLowerCase();
const ctx = { applications, message, history, parcours: parcoursLu };

const intent = INTENTS.find((i) => i.keywords.some((kw) => lower.includes(kw)));

if (intent) return intent.reply(profile, ctx);

if (parcoursLu === "preinscription") {
return `Merci pour votre message. Voici ce que je peux déjà faire pour vous :\n\n- Répondre à vos questions sur les établissements, les pièces, la procédure du portail, la preuve de ressources et l'entretien pédagogique — dites « où j'en suis » pour un point sur VOS dossiers.\n- Vous orienter vers **Ma lettre pour chaque vœu**, **Écrire à un établissement**, **Traduire une pièce** ou **Vérifier avant de soumettre**.\n\nReformulez votre question en une phrase, ou dites-moi simplement où vous en êtes dans votre préinscription.`;
}

return `Merci pour votre message ! Voici ce que je peux déjà faire pour vous :\n\n- Répondre à vos questions sur les bourses, documents, entretiens et délais — dites « où j'en suis » pour un point sur VOS candidatures.\n- Vous orienter vers **Lettre de motivation**, **E-mails Fitz**, **Traduction** ou **Vérification du dossier**.\n\nReformulez votre question en une phrase, ou dites-moi simplement où vous en êtes dans votre candidature.`;

}

// ==========================================================
// LECTURE DU DIAGNOSTIC (bloc « L'analyse de Fitz » de results.html)
// ==========================================================
//
// Compose les quatre sections attendues par le bloc #fitzAnalysis à
// partir des SEULES valeurs déjà calculées : le score et ses
// sous-scores viennent de js/eligibility-ai.js (moteur déterministe,
// sans IA), les opportunités et leurs échéances viennent du catalogue.
//
// ⚠️ RIEN N'EST INVENTÉ ICI, et ce n'est pas négociable : aucune date,
// aucun montant, aucun nom d'établissement n'est produit par ce
// fichier — tout vient de `input`. Quand une échéance manque, on écrit
// qu'elle est à vérifier sur le portail ; on ne la devine jamais. Une
// date fausse coûte une année à un étudiant. C'est exactement la règle
// que le prompt `diagnostic` impose au vrai modèle : la lecture reste
// donc de même nature le jour où la passerelle sera rebranchée.
//
// PAS DE PLAN DE PROGRESSION : la page en propose déjà un, réservé aux
// étudiants accompagnés. Le doubler ici le viderait de sa valeur.

function sousScoresTries(sousScores) {

return (Array.isArray(sousScores) ? sousScores : [])
.filter((s) => s && s.libelle && Number.isFinite(Number(s.valeur)))
.map((s) => ({ libelle: String(s.libelle), valeur: Number(s.valeur) }))
.sort((a, b) => b.valeur - a.valeur);

}

// Une échéance du catalogue peut être une date ISO ou un texte libre.
// On ne s'en sert pour TRIER que lorsqu'elle est réellement lisible ;
// à l'affichage, on la recopie telle quelle, sans reformulation.
function dateEcheance(valeur) {

if (!valeur) return null;

const d = new Date(valeur);

return Number.isNaN(d.getTime()) ? null : d;

}

// Le premier dossier à ouvrir est celui dont l'échéance FUTURE est la
// plus proche : c'est celui qui se referme en premier. À défaut de
// date exploitable, on garde l'ordre du moteur, qui classe déjà par
// pertinence.
function opportunitePrioritaire(opportunites) {

const liste = Array.isArray(opportunites) ? opportunites.filter(Boolean) : [];

if (!liste.length) return null;

const datees = liste
.map((o) => ({ o, d: dateEcheance(o.echeance) }))
.filter((x) => x.d && x.d.getTime() >= Date.now())
.sort((a, b) => a.d - b.d);

return datees.length ? datees[0].o : liste[0];

}

function lieuOpportunite(o) {
return [o.universite, o.pays].filter(Boolean).join(", ");
}

// L'échéance est RECOPIÉE, jamais reconstruite : on se contente de la
// mettre en français quand elle est lisible comme date, et on la laisse
// telle quelle sinon. Aucune date n'est complétée ni arrondie.
function echeanceLisible(valeur) {

const d = dateEcheance(valeur);

return d ? formatFr(d) : String(valeur);

}

/**
* Les obstacles lisibles dans le PARCOURS déclaré — pas dans le
* barème. Aucune invention : chaque phrase découle d'une réponse
* explicite de l'étudiant, et le silence vaut silence.
*/
function freinsDuParcours(parcours) {

const p = parcours || {};
const freins = [];

const exp = String(p.experienceProfessionnelle || "").toLowerCase();

if (exp.includes("aucune") || exp.includes("moins d'un an")) {
// Fait vérifié le 2026-09-05 sur chevening.org : « at least two
// years' work experience […] equivalent to 2,800 hours ».
freins.push("Votre expérience professionnelle est encore courte : plusieurs bourses de master en font un critère éliminatoire — Chevening exige 2 800 heures, soit environ deux ans acquis après la licence.");
}

const adm = String(p.candidaturesUniversitaires || "").toLowerCase();

if (adm.includes("aucune")) {
freins.push("Aucune candidature universitaire n'est encore déposée : plusieurs bourses ne financent qu'un étudiant DÉJÀ admis, ce qui met l'admission avant la bourse dans votre calendrier.");
}

const rech = String(p.projetDeRecherche || "").toLowerCase();

if (rech.includes("pas encore") || rech.includes("pas de sujet")) {
freins.push("Votre projet de recherche n'est pas encore écrit : c'est la pièce qu'un comité de doctorat lit en premier, avant vos notes.");
}

const dir = String(p.directeurOuLaboratoire || "").toLowerCase();

if (dir.includes("non") || dir.includes("ne sais pas")) {
freins.push("Sans directeur de thèse ni laboratoire d'accueil, un dossier de doctorat n'a pas de destinataire — c'est ce contact qui conditionne le reste.");
}

const passeport = String(p.passeport || "").toLowerCase();

if (passeport.includes("pas encore") || passeport.includes("expiré")) {
freins.push("Votre passeport n'est pas en règle : les délais se comptent en mois et bloquent aussi bien la candidature que le visa.");
}

return freins;

}

export function generateDiagnosticReading(input = {}) {

const score = Number.isFinite(Number(input.score)) ? Number(input.score) : null;
const classes = sousScoresTries(input.sousScores);
const meilleur = classes[0] || null;
const plusFaible = classes.length > 1 ? classes[classes.length - 1] : null;

const forces = (input.strengths || []).filter(Boolean);
const freins = (input.weaknesses || []).filter(Boolean);
const compatibles = Number(input.nombreRetenu) || Number(input.totalCompatible) || 0;
const choisie = opportunitePrioritaire(input.opportunites);

const domaine = input.profile?.desiredField || "";
const destination = input.profile?.desiredCountry || "";
const cycle = input.niveauVise || "";

const lignes = [];

// ---------- Votre situation ----------

lignes.push("### Votre situation");
lignes.push("");

const situation = [];

if (score !== null) {
situation.push(`Votre dossier obtient **${score} sur 100**.`);
}

if (cycle || domaine) {
situation.push(
`Vous visez ${[cycle, domaine].filter(Boolean).join(" en ")}${destination ? `, avec ${destination} en tête` : ""}.`
);
} else if (destination) {
situation.push(`Vous visez ${destination}.`);
}

if (compatibles > 0) {
const ouvertes = Number(input.echeancesOuvertes) || 0;
situation.push(
`Fitz a retenu ${compatibles} opportunité${compatibles > 1 ? "s" : ""} pour vous${ouvertes > 0 ? `, dont ${ouvertes} dont les candidatures sont encore ouvertes` : ""}.`
);
} else {
situation.push("Aucune opportunité du catalogue ne correspond à ce profil aujourd'hui.");
}

if (meilleur && plusFaible) {
situation.push(
`Le détail est plus parlant que le total : « ${meilleur.libelle} » à ${meilleur.valeur} %, « ${plusFaible.libelle} » à ${plusFaible.valeur} %. Un comité lit cet écart avant de lire la moyenne.`
);
}

lignes.push(situation.join(" "));
lignes.push("");

// ---------- Ce qui rend votre dossier crédible ----------

lignes.push("### Ce qui rend votre dossier crédible");
lignes.push("");

if (forces.length) {

forces.slice(0, 3).forEach((f) => lignes.push(`- ${f}`));
lignes.push("");
lignes.push(
"Ces points comptent parce qu'un comité cherche d'abord la cohérence d'un parcours, pas la performance brute : il veut comprendre pourquoi ce candidat demande ce programme-là."
);

} else if (meilleur) {

lignes.push(
`Le point sur lequel vous pouvez vous appuyer est « ${meilleur.libelle} » (${meilleur.valeur} %). C'est peu, mais c'est un appui réel : un dossier se construit à partir de ce qui tient, pas à partir de ce qui manque.`
);

} else {

lignes.push(
"L'analyse n'a pas encore relevé de point d'appui net. Ce n'est pas un verdict sur vos capacités : c'est le signe que le questionnaire manque d'éléments sur votre parcours."
);

}

lignes.push("");

// ---------- Ce qui va vous coûter des places ----------

lignes.push("### Ce qui va vous coûter des places");
lignes.push("");

if (freins.length) {

freins.slice(0, 2).forEach((f) => lignes.push(`- ${f}`));
lignes.push("");

}

// Les freins tirés du PARCOURS déclaré (questionnaire par niveau,
// 2026-09-05). Ils ne viennent pas du barème mais des réponses
// propres au cycle — et ce sont souvent les plus décisifs : deux
// candidats au même score n'ont pas le même dossier selon qu'ils ont
// ou non l'expérience professionnelle qu'une bourse exige.
const duParcours = freinsDuParcours(input.parcours);

if (duParcours.length) {
duParcours.slice(0, 2).forEach((f) => lignes.push(`- ${f}`));
lignes.push("");
}

if (plusFaible && plusFaible.valeur < 60) {

lignes.push(
`Le point le plus faible est « ${plusFaible.libelle} », à ${plusFaible.valeur} %. C'est le genre d'élément qui écarte un dossier avant même sa lecture au fond, parce qu'il se vérifie en trente secondes.`
);

} else if (!freins.length && score !== null && score < 50) {

// Silence du moteur + score bas = questionnaire incomplet, pas
// dossier sain. Écrire « aucun frein » ici serait un mensonge par
// omission, et le pire service à rendre à un étudiant.
lignes.push(
`L'analyse n'a pas isolé de frein nommé, mais un total de ${score} sur 100 ne s'explique pas tout seul : il signifie que plusieurs éléments attendus par les comités manquent encore à votre dossier ou n'ont pas été renseignés dans le questionnaire.`
);

} else if (!freins.length) {

lignes.push(
"L'analyse ne relève pas de frein bloquant. Le risque qui reste est celui du calendrier : un dossier moyen déposé tôt passe devant un dossier solide déposé trop tard."
);

} else {

lignes.push(
"Aucun de ces points n'est éliminatoire, à une condition : que le calendrier soit tenu. Les certifications de langue et les documents officiels se demandent des semaines à l'avance."
);

}

lignes.push("");

// ---------- Les trois dossiers à ouvrir ----------

lignes.push("### Les trois dossiers à ouvrir");
lignes.push("");

const dossiers = (Array.isArray(input.opportunites) ? input.opportunites : []).filter(Boolean).slice(0, 3);

if (dossiers.length) {

// Une première action DIFFÉRENTE pour chacun : trois fois le même
// conseil sous trois noms de bourse, c'est le contraire d'une
// lecture personnalisée.
const premieresActions = [
"ouvrez sa fiche et relevez la liste exacte des pièces demandées, puis repérez celle qui ne dépend pas de vous — c'est toujours celle-là qui fait rater une échéance",
"vérifiez la date de clôture sur le portail officiel et notez-la dans votre calendrier avec un rappel trois semaines avant",
"identifiez dès maintenant qui écrira votre lettre de recommandation, et prévenez cette personne : c'est le délai le plus long de tout le dossier"
];

dossiers.forEach((o, i) => {

const lieu = lieuOpportunite(o);
const raison = (o.raisons || []).filter(Boolean)[0] || "";

lignes.push(`**${o.nom}**${lieu ? ` — ${lieu}` : ""}.`);
lignes.push("");

const corps = [];

// Minuscule sur la PREMIÈRE lettre seulement : tout passer en
// minuscules écrivait « programme de niveau master » et « domaine
// (commerce) », en abîmant les noms propres.
if (raison) corps.push(`Pourquoi celle-là : ${raison.charAt(0).toLowerCase()}${raison.slice(1)}.`);

if (o.candidaturesOuvertes && typeof o.joursRestants === "number") {
corps.push(
o.joursRestants <= 14
? `Il ne reste que ${o.joursRestants} jour${o.joursRestants > 1 ? "s" : ""} : n'engagez ce dossier que si vos pièces sont déjà réunies.`
: `Les candidatures sont ouvertes et il vous reste ${o.joursRestants} jours.`
);
} else if (o.echeance) {
corps.push(`L'échéance annoncée dans notre catalogue est le ${echeanceLisible(o.echeance)} — confirmez-la sur le portail officiel avant toute autre chose.`);
} else {
corps.push("Aucune date de clôture ne figure dans notre catalogue : votre première tâche est d'aller la chercher sur le portail officiel — nous ne la devinons pas pour vous.");
}

corps.push(`Cette semaine : ${premieresActions[i] || premieresActions[0]}.`);

lignes.push(corps.join(" "));
lignes.push("");

});

// L'échéance la PLUS PROCHE commande l'ordre, pas le score : c'est
// la seule contrainte qu'on ne peut pas rattraper.
const ouverts = dossiers
.filter((o) => o.candidaturesOuvertes && typeof o.joursRestants === "number")
.sort((a, b) => a.joursRestants - b.joursRestants);

const commencerPar = ouverts[0] || dossiers[0];

if (ouverts.length === 1) {
lignes.push(`Commencez par **${commencerPar.nom}** : c'est la seule des trois dont les candidatures sont ouvertes aujourd'hui, donc la seule sur laquelle vous pouvez agir cette semaine.`);
} else if (ouverts.length > 1) {
lignes.push(`Commencez par **${commencerPar.nom}** : c'est celle qui ferme le plus tôt, dans ${commencerPar.joursRestants} jours. Les autres attendront sans rien vous coûter ; celle-ci, non.`);
} else {
lignes.push(`Commencez par **${commencerPar.nom}** : c'est celle dont votre profil est le plus proche. Aucune de ces trois n'affiche de date confirmée — allez la chercher sur les portails avant de rédiger quoi que ce soit.`);
}

} else {

lignes.push(
"Nous n'avons pas d'opportunité à vous désigner aujourd'hui : aucune de celles du catalogue ne correspond à la combinaison de votre nationalité, de votre cycle et de votre destination, ou leurs candidatures de cette année sont closes. Élargir la destination visée est ce qui change le plus vite cet éventail."
);

}

lignes.push("");
lignes.push(
"Nous accompagnons un dossier, nous n'attribuons aucune bourse et n'influençons aucune décision d'admission."
);

return lignes.join("\n").replace(/\n{3,}/g, "\n\n").trim();

}
