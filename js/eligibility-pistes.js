/**
* ============================================================
* FitzUniverse — le questionnaire de diagnostic, PAR NIVEAU
* ============================================================
*
* POURQUOI CE FICHIER EXISTE (refonte du 2026-09-05)
*
* Jusqu'ici, les quatorze questions étaient les mêmes pour tout le
* monde. Un lycéen et un titulaire de master répondaient au même
* formulaire, et le diagnostic ne pouvait donc pas être meilleur que
* le plus petit dénominateur commun entre eux.
*
* Or les organismes, eux, ne demandent pas la même chose selon le
* cycle. Trois exemples VÉRIFIÉS, qui ont dicté la structure de ce
* fichier :
*
*  - Chevening (master) exige « au moins deux ans d'expérience
*    professionnelle, acquise APRÈS la licence, équivalant à
*    2 800 heures », une licence terminée, et TROIS candidatures dans
*    des universités britanniques avec au moins une offre
*    inconditionnelle. Rien de tout cela n'était demandé au candidat.
*  - Les grandes bourses de licence (MEXT, Türkiye Bursları, CSC)
*    fixent des limites d'âge basses et regardent la filière du
*    secondaire. Le catalogue porte déjà ces limites (champ `ageMax`).
*  - Un dossier de doctorat se joue sur un projet de recherche et un
*    laboratoire d'accueil — deux choses qu'on ne demandait jamais.
*
* D'où la règle de conception : ON NE POSE UNE QUESTION QUE SI ELLE
* CORRESPOND À UNE EXIGENCE RÉELLE DU CYCLE VISÉ. Une question qu'un
* comité de sélection ne poserait pas n'a rien à faire ici — elle
* allonge le parcours et dilue le diagnostic.
*
* PORTÉE MONDIALE (doctrine permanente, doctrine_portee_mondiale) :
* aucune question ne suppose un système scolaire particulier. La
* filière du secondaire est proposée en FAMILLES qui existent partout,
* avec une saisie libre en secours — un Sénégalais en série S, un
* Nigérian avec le WAEC et un Indien en PCM doivent tous se
* reconnaître.
*
* CE FICHIER EST PUR : aucun DOM, aucun réseau, aucun état global.
* C'est ce qui le rend testable (test/eligibility-pistes.test.mjs) —
* l'ancien couple questions.js + eligibility.engine.js était fait de
* scripts classiques, donc invérifiable par `npm test`.
* ============================================================
*/

import { NATIONALITES } from "./nationalites.js";

// ============================================================
// PAYS — la liste mondiale, servie par la question « country » (le
// pays de résidence). type:"search" ne l'impose jamais : une saisie
// libre est enregistrée telle quelle, donc un pays absent d'ici
// fonctionne déjà. Les 15 premiers restent en tête (cœur probable de
// l'audience), le reste suit par continent.
//
// JUSQU'AU 2026-09-12, cette même liste servait aussi « nationality ».
// Elle ne la sert plus : à « Quelle est votre nationalité ? » on répond
// « Sénégalais(e) », pas « Sénégal ». Les gentilés vivent dans
// js/nationalites.js, dans le MÊME ORDRE que cette liste —
// test/nationalites.test.mjs vérifie qu'elles restent jumelles, donc un
// pays ajouté ici sans son gentilé fait rougir la suite.
// ============================================================
export const PAYS_DU_MONDE = [

"Sénégal",
"Côte d'Ivoire",
"Mali",
"Guinée",
"Cameroun",
"Bénin",
"Burkina Faso",
"Togo",
"Niger",
"République démocratique du Congo",
"Gabon",
"Madagascar",
"Maroc",
"Tunisie",
"Algérie",

// Reste de l'Afrique
"Afrique du Sud", "Angola", "Botswana", "Burundi", "Cap-Vert",
"Comores", "Congo (République du)", "Djibouti", "Égypte", "Érythrée",
"Eswatini", "Éthiopie", "Gambie", "Ghana", "Guinée équatoriale",
"Guinée-Bissau", "Kenya", "Lesotho", "Liberia", "Libye", "Malawi",
"Maurice", "Mauritanie", "Mozambique", "Namibie", "Nigeria",
"Ouganda", "République centrafricaine", "Rwanda",
"Sao Tomé-et-Principe", "Sierra Leone", "Somalie", "Soudan",
"Soudan du Sud", "Tanzanie", "Tchad", "Zambie", "Zimbabwe",

// Europe
"Albanie", "Allemagne", "Andorre", "Autriche", "Belgique",
"Bosnie-Herzégovine", "Bulgarie", "Chypre", "Croatie", "Danemark",
"Espagne", "Estonie", "Finlande", "France", "Grèce", "Hongrie",
"Irlande", "Islande", "Italie", "Kosovo", "Lettonie",
"Liechtenstein", "Lituanie", "Luxembourg", "Macédoine du Nord",
"Malte", "Moldavie", "Monaco", "Monténégro", "Norvège", "Pays-Bas",
"Pologne", "Portugal", "République tchèque", "Roumanie",
"Royaume-Uni", "Russie", "Saint-Marin", "Serbie", "Slovaquie",
"Slovénie", "Suède", "Suisse", "Ukraine", "Vatican",

// Amériques
"Antigua-et-Barbuda", "Argentine", "Bahamas", "Barbade", "Belize",
"Bolivie", "Brésil", "Canada", "Chili", "Colombie", "Costa Rica",
"Cuba", "Dominique", "Équateur", "États-Unis", "Grenade",
"Guatemala", "Guyana", "Haïti", "Honduras", "Jamaïque", "Mexique",
"Nicaragua", "Panama", "Paraguay", "Pérou", "République dominicaine",
"Saint-Kitts-et-Nevis", "Saint-Vincent-et-les-Grenadines",
"Sainte-Lucie", "Suriname", "Trinité-et-Tobago", "Uruguay",
"Venezuela",

// Asie et Moyen-Orient
"Afghanistan", "Arabie Saoudite", "Arménie", "Azerbaïdjan",
"Bahreïn", "Bangladesh", "Bhoutan", "Brunei", "Cambodge", "Chine",
"Corée du Nord", "Corée du Sud", "Émirats Arabes Unis", "Géorgie",
"Inde", "Indonésie", "Irak", "Iran", "Israël", "Japon", "Jordanie",
"Kazakhstan", "Kirghizistan", "Koweït", "Laos", "Liban", "Malaisie",
"Maldives", "Mongolie", "Myanmar", "Népal", "Oman", "Ouzbékistan",
"Pakistan", "Palestine", "Philippines", "Qatar", "Singapour",
"Sri Lanka", "Syrie", "Tadjikistan", "Taïwan", "Thaïlande",
"Timor oriental", "Turkménistan", "Turquie", "Vietnam", "Yémen",

// Océanie
"Australie", "Fidji", "Îles Marshall", "Îles Salomon", "Kiribati",
"Micronésie", "Nauru", "Nouvelle-Zélande", "Palaos",
"Papouasie-Nouvelle-Guinée", "Samoa", "Tonga", "Tuvalu", "Vanuatu"

];

// ============================================================
// LES PISTES
// ============================================================

export const PISTES = {
LYCEE: "lycee",
BAC_OBTENU: "bac_obtenu",
LICENCE_EN_COURS: "licence_en_cours",
LICENCE_OBTENUE: "licence_obtenue",
MASTER_EN_COURS: "master_en_cours",
MASTER_OBTENU: "master_obtenu",
DOCTORAT_EN_COURS: "doctorat_en_cours",
DOCTORAT_OBTENU: "doctorat_obtenu"
};

/**
* Libellés proposés à la question d'aiguillage, dans l'ordre.
*
* HUIT paliers, et la symétrie est volontaire : « en cours » /
* « obtenu » pour chacun des quatre diplômes. Demandé par Charles le
* 2026-09-05, et il a raison — la distinction n'est pas cosmétique,
* c'est celle que font les organismes eux-mêmes :
*
*  - un diplôme EN COURS se candidate sur certificat de scolarité et
*    relevés partiels, et l'admission est conditionnelle à l'obtention ;
*  - un diplôme OBTENU se candidate sur le diplôme lui-même, et son
*    ANCIENNETÉ devient un critère (certains programmes veulent un
*    diplôme récent, d'autres exigent au contraire des années
*    d'expérience entre les deux).
*
* Les libellés sont volontairement courts et parallèles : la forme
* même de la liste enseigne la distinction avant qu'on ait à
* l'expliquer.
*/
export const NIVEAUX_ACTUELS = [
{ label: "Au lycée", icon: "school" },
{ label: "Bac obtenu", icon: "file-check" },
{ label: "Licence en cours", icon: "book-open" },
{ label: "Licence obtenue", icon: "award" },
{ label: "Master en cours", icon: "graduation-cap" },
{ label: "Master obtenu", icon: "medal" },
{ label: "Doctorat en cours", icon: "microscope" },
{ label: "Doctorat obtenu", icon: "book-marked" }
];

/**
* Piste d'un libellé de niveau actuel.
*
* Reconnaissance par MOTS-CLÉS et non par égalité stricte, pour une
* raison précise : les cinq anciens libellés (« Bac en cours ou
* obtenu », « Licence en cours », « Licence obtenue », « Master en
* cours ou obtenu », « Doctorat en cours ou obtenu ») vivent encore
* dans le sessionStorage des visites en cours et dans d'anciens
* profils. Une table d'égalité les aurait tous renvoyés vers `null`
* et cassé le diagnostic d'un étudiant à mi-parcours. L'ordre des
* tests compte : « doctorat » avant « master » avant « licence ».
*/
export function pisteDepuisNiveau(libelle) {

const t = String(libelle || "").toLowerCase();

if (!t) return "";

// UNE seule règle, appliquée aux quatre diplômes : le libellé
// annonce-t-il un diplôme DÉJÀ OBTENU ? Un libellé qui porte les deux
// mentions (« Bac en cours ou obtenu », « Doctorat en cours ou
// obtenu » — anciens libellés) est traité comme EN COURS : c'est le
// choix prudent, celui qui pose encore les questions de fin de
// cursus plutôt que de supposer un diplôme que l'étudiant n'a
// peut-être pas.
const obtenu = (t.includes("obtenu") || t.includes("soutenue"))
&& !t.includes("en cours")
&& !t.includes("étudiant");

if (t.includes("doctorat") || t.includes("phd") || t.includes("thèse")) {
return obtenu ? PISTES.DOCTORAT_OBTENU : PISTES.DOCTORAT_EN_COURS;
}

if (t.includes("master")) {
return obtenu ? PISTES.MASTER_OBTENU : PISTES.MASTER_EN_COURS;
}

if (t.includes("licence") || t.includes("bachelor")) {
return obtenu ? PISTES.LICENCE_OBTENUE : PISTES.LICENCE_EN_COURS;
}

if (t.includes("lycée") || t.includes("lycee") || t.includes("bachelier") || t.includes("bac") || t.includes("secondaire")) {
return obtenu ? PISTES.BAC_OBTENU : PISTES.LYCEE;
}

return "";

}

/**
* Cycles réellement candidatables depuis un niveau donné.
*
* Ce n'est pas une préférence d'affichage : proposer « Doctorat » à un
* bachelier produisait une réponse que le barème devait ensuite
* sanctionner (« un doctorat exige d'abord un master »). Mieux vaut
* une interface qui rend l'erreur impossible qu'un score qui la
* punit.
*/
export function cyclesVisesPour(piste) {

switch (piste) {

case PISTES.LYCEE:
case PISTES.BAC_OBTENU:
return ["Licence (Bachelor)"];

case PISTES.LICENCE_EN_COURS:
// Deux projets légitimes : terminer sa licence à l'étranger, ou
// préparer dès maintenant le master qui suivra.
return ["Licence (Bachelor)", "Master"];

case PISTES.LICENCE_OBTENUE:
// La seconde licence existe (réorientation) mais reste rare et peu
// financée — proposée en second, jamais en premier.
return ["Master", "Licence (Bachelor)"];

case PISTES.MASTER_EN_COURS:
return ["Master", "Doctorat (PhD)"];

case PISTES.MASTER_OBTENU:
// Un second master (MBA, spécialisation) est un projet courant et
// bien financé : il reste proposé.
return ["Doctorat (PhD)", "Master"];

case PISTES.DOCTORAT_EN_COURS:
// Mobilité, cotutelle ou financement de la thèse en cours : le cycle
// reste le doctorat.
return ["Doctorat (PhD)"];

case PISTES.DOCTORAT_OBTENU:
// Le catalogue ne porte pas encore de post-doctorat : on propose ce
// qui existe vraiment plutôt qu'un cycle qu'on ne saurait pas servir.
return ["Doctorat (PhD)", "Master"];

default:
return ["Licence (Bachelor)", "Master", "Doctorat (PhD)"];

}

}

const ICONE_CYCLE = {
"Licence (Bachelor)": "book-open",
"Master": "graduation-cap",
"Doctorat (PhD)": "microscope"
};

// Le cycle visé effectif, y compris quand la question a été SAUTÉE
// parce qu'un seul cycle était possible (un bachelier ne peut viser
// qu'une licence). Sauter une question à une seule réponse est un
// service rendu ; encore faut-il que le reste du code retrouve la
// valeur.
export function cycleViseEffectif(reponses) {

const explicite = reponses.targetLevel;

if (explicite) return explicite;

const cycles = cyclesVisesPour(pisteDepuisNiveau(reponses.currentLevel));

return cycles.length === 1 ? cycles[0] : "";

}

function vise(reponses, cycle) {
return cycleViseEffectif(reponses) === cycle;
}

// ============================================================
// LES QUESTIONS
//
// Un champ peut être une VALEUR ou une FONCTION des réponses déjà
// données (`question`, `assistant`, `options`, `suggestions`) : c'est
// ce qui permet de demander « votre moyenne au lycée » à un bachelier
// et « votre moyenne de master » à un doctorant sans dupliquer la
// question ni le code qui la lit.
//
// `when(reponses)` conditionne l'affichage. Une question dont le
// `when` devient faux voit sa réponse EFFACÉE (purgerHorsPiste) : un
// étudiant qui revient en arrière et se déclare doctorant ne doit pas
// traîner une réponse sur sa série du baccalauréat.
// ============================================================

// ---------- 1. L'aiguillage ----------

const AIGUILLAGE = {

id: "currentLevel",
icon: "graduation-cap",
question: "Où en êtes-vous aujourd'hui dans vos études ?",
assistant: "C'est la question qui commande toutes les suivantes : les organismes n'attendent pas la même chose d'un bachelier et d'un titulaire de master. Je vais adapter le reste du diagnostic à votre réponse.",
type: "cards",
options: NIVEAUX_ACTUELS

};

// ---------- 2. Le cycle visé, filtré par la piste ----------

const CYCLE_VISE = {

id: "targetLevel",
icon: "target",

question: "Quel diplôme visez-vous à l'étranger ?",

assistant: (r) => pisteDepuisNiveau(r.currentLevel) === PISTES.LICENCE_EN_COURS
? "Deux projets sont possibles depuis votre situation : partir terminer votre licence, ou préparer dès maintenant le master qui suivra. Les bourses ne sont pas les mêmes."
: "C'est le critère n°1 de toutes les bourses : chaque programme finance un cycle précis, et exige le diplôme du cycle précédent.",

type: "cards",

options: (r) => cyclesVisesPour(pisteDepuisNiveau(r.currentLevel))
.map((cycle) => ({ label: cycle, icon: ICONE_CYCLE[cycle] })),

// Sautée quand un seul cycle est possible — voir cycleViseEffectif().
when: (r) => cyclesVisesPour(pisteDepuisNiveau(r.currentLevel)).length > 1

};

// ---------- 3. Les questions propres à chaque piste ----------

const FILIERES_SECONDAIRE = [
{ label: "Scientifique", icon: "flask-conical" },
{ label: "Économique & gestion", icon: "trending-up" },
{ label: "Littéraire & sciences humaines", icon: "book" },
{ label: "Technique & professionnel", icon: "wrench" },
{ label: "Programme international (IB, A-Levels, WAEC…)", icon: "globe-2" },
{ label: "Autre filière", icon: "circle-help" }
];

const QUESTIONS_PISTE = {

[PISTES.LYCEE]: [

{
id: "secondaryTrack",
icon: "compass",
question: "Quelle est votre filière au secondaire ?",
// Familles volontairement larges : le site s'adresse à tout
// étudiant, où qu'il soit. Une liste de séries francophones
// (S, L, G, T) aurait exclu d'emblée le reste du monde.
assistant: "Choisissez la famille qui correspond le mieux à votre système scolaire — je m'en sers pour vérifier la cohérence entre votre parcours et le domaine que vous visez, le premier point qu'un comité regarde.",
type: "cards",
options: FILIERES_SECONDAIRE
},

{
id: "secondaryTrackOther",
icon: "pen-line",
question: "Précisez votre filière.",
assistant: "Écrivez-la comme elle apparaît sur vos relevés : je la reprendrai telle quelle.",
type: "search",
suggestions: [],
when: (r) => r.secondaryTrack === "Autre filière"
},

{
id: "secondaryExpected",
icon: "calendar-clock",
// Piste « au lycée » : le diplôme n'est PAS obtenu. La seule
// question utile est donc QUAND il le sera — elle fixe la rentrée
// visée et détermine si une candidature est déjà possible cette
// année (sur certificat de scolarité et bulletins) ou s'il faut
// viser le cycle suivant.
question: "Quand passez-vous votre diplôme de fin d'études secondaires ?",
assistant: "Une candidature peut souvent se déposer AVANT d'avoir le diplôme, sur bulletins et certificat de scolarité — l'admission devient alors conditionnelle à l'obtention. Votre date fixe la rentrée que nous visons.",
type: "cards",
options: [
{ label: "Cette année" },
{ label: "L'an prochain" },
{ label: "Dans 2 ans ou plus" }
]
}

],

[PISTES.BAC_OBTENU]: [

{
id: "secondaryTrack",
icon: "compass",
question: "Quelle était votre filière au secondaire ?",
assistant: "Choisissez la famille qui correspond le mieux à votre système scolaire — je m'en sers pour vérifier la cohérence entre votre parcours et le domaine que vous visez, le premier point qu'un comité regarde.",
type: "cards",
options: FILIERES_SECONDAIRE
},

{
id: "secondaryTrackOther",
icon: "pen-line",
question: "Précisez votre filière.",
assistant: "Écrivez-la comme elle apparaît sur vos relevés : je la reprendrai telle quelle.",
type: "search",
suggestions: [],
when: (r) => r.secondaryTrack === "Autre filière"
},

{
id: "diplomaWhen",
icon: "calendar",
// Diplôme OBTENU : c'est son ANCIENNETÉ qui devient un critère.
// Plusieurs bourses de licence s'adressent aux bacheliers de
// l'année ; au-delà de deux ans, un comité attend une explication
// sur ce qui a été fait entre-temps.
question: "Quand avez-vous obtenu votre diplôme de fin d'études secondaires ?",
assistant: "Plusieurs bourses de licence s'adressent aux bacheliers de l'année. Au-delà de deux ans, ce n'est pas éliminatoire, mais un comité voudra savoir ce que vous avez fait entre-temps.",
type: "cards",
options: [
{ label: "Cette année" },
{ label: "L'an dernier" },
{ label: "Il y a 2 ans ou plus" }
]
}

],

[PISTES.LICENCE_EN_COURS]: [

{
id: "licenceYear",
icon: "layers",
question: "En quelle année de licence êtes-vous ?",
assistant: "Le niveau atteint détermine ce que vous pouvez déposer aujourd'hui : relevés partiels, certificat de scolarité, ou diplôme.",
type: "cards",
options: [
{ label: "1re année" },
{ label: "2e année" },
{ label: "3e année (ou dernière année)" },
{ label: "Année de reprise ou de césure" }
]
},

{
id: "licenceExpected",
icon: "calendar-clock",
question: "Quand obtiendrez-vous votre licence ?",
assistant: "Les bourses de master se candidatent souvent PENDANT la dernière année, sur certificat de scolarité : connaître votre date de diplôme fixe votre fenêtre de tir.",
type: "cards",
options: [
{ label: "Cette année" },
{ label: "L'an prochain" },
{ label: "Dans 2 ans ou plus" }
]
}

],

[PISTES.LICENCE_OBTENUE]: [

{
id: "diplomaWhen",
icon: "calendar",
question: "Quand avez-vous obtenu votre licence ?",
assistant: "Certaines bourses demandent un diplôme récent ; d'autres, au contraire, réclament plusieurs années entre le diplôme et la candidature.",
type: "cards",
options: [
{ label: "Cette année" },
{ label: "Il y a 1 à 2 ans" },
{ label: "Il y a 3 à 5 ans" },
{ label: "Il y a plus de 5 ans" }
]
},

{
id: "workExperience",
icon: "briefcase",
question: "Depuis votre diplôme, quelle expérience professionnelle avez-vous ?",
// Fait VÉRIFIÉ le 2026-09-05 sur chevening.org : « at least two
// years' work experience, acquired after completing your
// undergraduate degree, equivalent to 2,800 hours ». C'est un
// critère ÉLIMINATOIRE, et le questionnaire ne le posait pas.
assistant: "Pour certaines bourses c'est éliminatoire : Chevening exige 2 800 heures, soit environ deux ans, acquises APRÈS la licence. Comptez stages rémunérés, emplois et missions.",
type: "cards",
options: [
{ label: "Aucune pour l'instant" },
{ label: "Moins d'un an" },
{ label: "1 à 2 ans" },
{ label: "2 à 5 ans" },
{ label: "Plus de 5 ans" }
]
}

],

[PISTES.MASTER_EN_COURS]: [

{
id: "masterExpected",
icon: "calendar-clock",
question: "Quand obtiendrez-vous votre master ?",
assistant: "Un doctorat se candidate souvent pendant la dernière année de master, dès que le sujet de recherche se dessine.",
type: "cards",
options: [
{ label: "Cette année" },
{ label: "L'an prochain" },
{ label: "Dans 2 ans ou plus" }
]
},

{
id: "workExperience",
icon: "briefcase",
question: "Avez-vous une expérience professionnelle ?",
assistant: "Elle compte davantage qu'on ne le croit dans les dossiers de master à l'étranger, et devient éliminatoire pour certaines bourses.",
type: "cards",
options: [
{ label: "Aucune pour l'instant" },
{ label: "Moins d'un an" },
{ label: "1 à 2 ans" },
{ label: "2 à 5 ans" },
{ label: "Plus de 5 ans" }
]
}

],

[PISTES.MASTER_OBTENU]: [

{
id: "diplomaWhen",
icon: "calendar",
question: "Quand avez-vous obtenu votre master ?",
assistant: "L'ancienneté du diplôme change les programmes accessibles, et ce qu'un comité attendra de vous entre-temps.",
type: "cards",
options: [
{ label: "Cette année" },
{ label: "Il y a 1 à 2 ans" },
{ label: "Il y a 3 à 5 ans" },
{ label: "Il y a plus de 5 ans" }
]
},

{
id: "workExperience",
icon: "briefcase",
question: "Depuis votre diplôme, quelle expérience professionnelle avez-vous ?",
assistant: "Pour un second master comme pour un doctorat professionnel, c'est souvent ce qui distingue deux dossiers académiquement équivalents.",
type: "cards",
options: [
{ label: "Aucune pour l'instant" },
{ label: "Moins d'un an" },
{ label: "1 à 2 ans" },
{ label: "2 à 5 ans" },
{ label: "Plus de 5 ans" }
]
}

],

[PISTES.DOCTORAT_EN_COURS]: [

{
id: "phdYear",
icon: "microscope",
question: "En quelle année de thèse êtes-vous ?",
assistant: "L'année de thèse distingue un financement de démarrage d'une mobilité de recherche en cours de route — ce ne sont pas les mêmes programmes.",
type: "cards",
options: [
{ label: "1re année" },
{ label: "2e année" },
{ label: "3e année ou au-delà" }
]
}

],

[PISTES.DOCTORAT_OBTENU]: [

{
id: "thesisWhen",
icon: "calendar",
question: "Quand avez-vous soutenu votre thèse ?",
// L'ancienneté du doctorat commande l'accès aux financements
// post-doctoraux : la plupart se ferment quelques années après la
// soutenance.
assistant: "La plupart des financements post-doctoraux se ferment quelques années après la soutenance : votre date détermine ce qui vous reste ouvert.",
type: "cards",
options: [
{ label: "Cette année" },
{ label: "Il y a 1 à 3 ans" },
{ label: "Il y a plus de 3 ans" }
]
},

{
id: "workExperience",
icon: "briefcase",
question: "Quelle expérience avez-vous depuis votre thèse ?",
assistant: "Enseignement, recherche, secteur privé : tout compte, et c'est souvent ce qui oriente vers un programme plutôt qu'un autre.",
type: "cards",
options: [
{ label: "Aucune pour l'instant" },
{ label: "Moins d'un an" },
{ label: "1 à 2 ans" },
{ label: "2 à 5 ans" },
{ label: "Plus de 5 ans" }
]
}

]

};

// ---------- 4. Les blocs commandés par le CYCLE VISÉ ----------
//
// Ces questions ne dépendent pas du niveau actuel mais de la cible :
// un étudiant en master qui vise un doctorat doit répondre sur son
// projet de recherche, exactement comme un doctorant.

const BLOC_MASTER = [

{
id: "admissionStatus",
icon: "send",
question: "Où en êtes-vous de vos candidatures universitaires ?",
// Vérifié le 2026-09-05 sur chevening.org : trois candidatures
// britanniques et au moins une offre INCONDITIONNELLE à la date
// limite. Plusieurs programmes financent après l'admission, pas
// avant — l'ordre des démarches en dépend entièrement.
assistant: "Plusieurs bourses financent APRÈS l'admission, pas avant : Chevening demande trois candidatures britanniques et au moins une offre inconditionnelle. L'ordre de vos démarches en dépend.",
type: "cards",
options: [
{ label: "Aucune démarche pour l'instant" },
{ label: "Je prépare mes dossiers" },
{ label: "Candidature(s) déposée(s)" },
{ label: "J'ai déjà une admission" }
]
}

];

const BLOC_DOCTORAT = [

{
id: "researchProject",
icon: "file-text",
question: "Où en êtes-vous de votre projet de recherche ?",
assistant: "C'est la pièce maîtresse d'un dossier de doctorat : c'est elle qu'un comité lit en premier, avant même vos notes.",
type: "cards",
options: [
{ label: "Rédigé et abouti" },
{ label: "Une idée précise, pas encore rédigée" },
{ label: "Un domaine, pas encore de sujet" },
{ label: "Pas encore commencé" }
],
// Inutile de la poser à qui est DÉJÀ en thèse ou l'a soutenue : le
// sujet existe. Poser une question dont on connaît la réponse est
// le meilleur moyen de faire douter l'étudiant du sérieux du reste.
when: (r) => {
const piste = pisteDepuisNiveau(r.currentLevel);
return piste !== PISTES.DOCTORAT_EN_COURS && piste !== PISTES.DOCTORAT_OBTENU;
}
},

{
id: "supervisorContact",
icon: "users",
// Formulation adaptée : celui qui n'a pas commencé cherche un
// directeur de thèse ; celui qui est déjà inscrit cherche un
// laboratoire d'ACCUEIL à l'étranger. Ce n'est pas la même
// démarche, et confondre les deux se voit tout de suite.
question: (r) => pisteDepuisNiveau(r.currentLevel) === PISTES.DOCTORAT_EN_COURS
? "Avez-vous un laboratoire d'accueil à l'étranger ?"
: "Avez-vous un directeur de thèse ou un laboratoire d'accueil ?",
assistant: "Beaucoup de financements de doctorat supposent qu'un chercheur vous accueille : sans ce contact, le dossier n'a pas de destinataire.",
type: "cards",
options: [
{ label: "Oui, avec un accord écrit" },
{ label: "Oui, un contact en cours" },
{ label: "Non, pas encore" },
{ label: "Je ne sais pas comment m'y prendre" }
]
},

{
id: "publications",
icon: "book-marked",
question: "Avez-vous déjà publié ou communiqué en conférence ?",
assistant: "Ce n'est presque jamais obligatoire, mais c'est ce qui départage deux candidats à dossier égal.",
type: "cards",
options: [
{ label: "Oui, plusieurs fois" },
{ label: "Une fois" },
{ label: "Pas encore" }
]
}

];

// ---------- 5. Le tronc commun ----------
//
// Ces critères sont demandés à TOUS les cycles — ce sont les
// conditions d'admissibilité que l'on retrouve d'un programme à
// l'autre quel que soit le diplôme visé. Seules les FORMULATIONS
// s'adaptent (la moyenne d'un bachelier n'est pas celle d'un
// doctorant).

const LIBELLE_MOYENNE = {
[PISTES.LYCEE]: "Quelle est votre moyenne au lycée ?",
[PISTES.BAC_OBTENU]: "Quelle était votre moyenne au bac (ou au lycée) ?",
[PISTES.LICENCE_EN_COURS]: "Quelle est votre moyenne générale en licence ?",
[PISTES.LICENCE_OBTENUE]: "Quelle était votre moyenne de licence ?",
[PISTES.MASTER_EN_COURS]: "Quelle est votre moyenne générale en master ?",
[PISTES.MASTER_OBTENU]: "Quelle était votre moyenne de master ?",
[PISTES.DOCTORAT_EN_COURS]: "Quelle était votre moyenne de master ?",
[PISTES.DOCTORAT_OBTENU]: "Quelle était votre moyenne de master ?"
};

const TRONC_COMMUN = [

{
id: "country",
icon: "map-pin",
question: "Dans quel pays vivez-vous actuellement ?",
assistant: "Cela m'aide à repérer les programmes accessibles depuis votre région, et les représentations locales qui les instruisent.",
type: "search",
suggestions: PAYS_DU_MONDE
},

{
id: "nationality",
icon: "id-card",
question: "Quelle est votre nationalité ?",
assistant: "Beaucoup de bourses posent leurs conditions sur la citoyenneté, pas sur le lieu de vie : un étudiant sénégalais installé au Maroc reste éligible aux programmes réservés aux Sénégalais.",
type: "search",
// LES GENTILÉS, ET NON LES PAYS (lot NATIONALITÉS, 2026-09-12) : à
// « Quelle est votre nationalité ? » on répond « Sénégalais(e) », pas
// « Sénégal ». La réponse enregistrée change donc de forme — c'est
// paysDeNationalite() (js/nationalites.js), appelée par
// isoDeNationalite(), qui la ramène au pays puis au code ISO, et qui
// continue d'accepter les réponses « Sénégal » d'avant ce lot.
suggestions: NATIONALITES
},

{
id: "studyCategory",
icon: "compass",
question: "Que souhaitez-vous étudier ?",
assistant: "Indiquez votre domaine, ou directement votre spécialité si vous la connaissez : les deux fonctionnent.",
type: "search",
suggestions: [
"Informatique", "Intelligence artificielle", "Cybersécurité",
"Data Science", "Développement Web", "Génie logiciel", "Génie civil",
"Génie mécanique", "Génie électrique", "Sciences & Ingénierie",
"Médecine", "Pharmacie", "Dentisterie", "Soins infirmiers",
"Santé & Médecine", "Commerce", "Marketing", "Finance",
"Comptabilité", "Commerce & Économie", "Droit",
"Relations internationales", "Droit & Sciences politiques",
"Agronomie", "Agriculture & Environnement", "Architecture",
"Psychologie", "Lettres & Sciences humaines", "Arts & Communication",
"Économie", "Biologie", "Chimie", "Physique", "Mathématiques",
"Autre"
]
},

{
id: "average",
icon: "bar-chart-3",
question: (r) => LIBELLE_MOYENNE[pisteDepuisNiveau(r.currentLevel)] || "Quelle est votre moyenne générale ?",
assistant: "Quel que soit votre système de notation, choisissez-le d'abord : je convertis ensuite sur une base commune pour comparer équitablement.",
type: "slider",
scales: [
{ id: "20", label: "/20", kind: "numeric", min: 0, max: 20, step: 0.1 },
{ id: "100", label: "/100", kind: "numeric", min: 0, max: 100, step: 1 },
{ id: "gpa4", label: "GPA /4", kind: "numeric", min: 0, max: 4, step: 0.1 },
{ id: "letters", label: "Lettres (A-F)", kind: "letters", options: ["A", "B", "C", "D", "F"] },
{ id: "other", label: "Autre système (%)", kind: "numeric", min: 0, max: 100, step: 1 }
],
defaultScale: "20"
},

{
id: "ageBracket",
icon: "calendar",
question: "Quelle est votre tranche d'âge ?",
assistant: (r) => vise(r, "Licence (Bachelor)")
? "C'est en licence que les limites d'âge sont les plus basses : plusieurs grandes bourses ferment avant 25 ans. Votre tranche me suffit — je ne demanderai jamais votre date de naissance."
: "Plusieurs bourses fixent une limite d'âge par cycle. Votre tranche me suffit — je ne demanderai jamais votre date de naissance.",
type: "cards",
options: [
{ label: "Moins de 18 ans" },
{ label: "18 – 24 ans" },
{ label: "25 – 29 ans" },
{ label: "30 – 34 ans" },
{ label: "35 ans et plus" }
]
},

{
id: "english",
icon: "languages",
question: "Quel est votre niveau en anglais ?",
assistant: "De nombreux programmes internationaux sont enseignés en anglais : répondez avec honnêteté, cela m'aide à cibler juste.",
type: "cards",
options: [
{ label: "Débutant" },
{ label: "Intermédiaire" },
{ label: "Bon niveau" },
{ label: "Courant / Bilingue" }
]
},

{
id: "french",
icon: "languages",
question: "Et votre niveau en français ?",
assistant: "Le français reste la langue d'enseignement d'une partie du catalogue (France, Belgique, Suisse, Canada francophone, Maghreb).",
type: "cards",
options: [
{ label: "Débutant" },
{ label: "Intermédiaire" },
{ label: "Bon niveau" },
{ label: "Courant / Langue maternelle" }
]
},

{
id: "langCert",
icon: "file-check",
question: "Avez-vous une certification de langue officielle ?",
assistant: "La plupart des bourses financées demandent une preuve officielle du niveau. Si vous ne l'avez pas encore, ce n'est pas bloquant : ce sera une étape de votre plan.",
type: "cards",
options: [
{ label: "Oui, en anglais (IELTS, TOEFL…)", icon: "file-check" },
{ label: "Oui, en français (DELF, TCF…)", icon: "file-check" },
{ label: "Oui, dans les deux langues", icon: "files" },
{ label: "Pas encore", icon: "circle-slash" }
]
},

{
id: "timeline",
icon: "calendar-clock",
question: "Quand souhaitez-vous démarrer vos études à l'étranger ?",
assistant: "Les grandes bourses ouvrent une fois par an, souvent 8 à 12 mois avant la rentrée : votre calendrier détermine celles qui restent atteignables.",
type: "cards",
options: [
{ label: "Dans les 6 prochains mois", icon: "zap" },
{ label: "D'ici 1 an", icon: "calendar" },
{ label: "Dans plus d'un an", icon: "hourglass" },
{ label: "Je ne sais pas encore", icon: "circle-help" }
]
},

{
id: "destinationCountry",
icon: "globe-2",
question: "Avez-vous une destination en tête ?",
assistant: "Si un pays vous fait rêver, dites-le-moi. Sinon, choisissez « Je ne sais pas encore » et je vous proposerai les destinations où votre profil est le plus compétitif.",
type: "search",
// Remplacée à l'exécution par les pays réellement présents au
// catalogue (loadDestinationCountries, eligibility-questions.js).
suggestions: ["Je ne sais pas encore"]
},

{
id: "goal",
icon: "banknote",
question: "Quel niveau de financement recherchez-vous ?",
assistant: "Cela concentre mes recherches sur les opportunités réellement accessibles pour vous.",
type: "cards",
options: [
{ label: "Une bourse complète", icon: "trophy" },
{ label: "Une bourse partielle", icon: "coins" },
{ label: "Les deux m'intéressent", icon: "layers" },
{ label: "Je n'ai pas de préférence", icon: "compass" }
]
},

{
id: "passport",
icon: "id-card",
question: "Où en êtes-vous avec votre passeport ?",
assistant: "C'est le premier document exigé par tous les portails de candidature — et les délais d'obtention se comptent souvent en mois.",
type: "cards",
options: [
{ label: "Passeport valide", icon: "check-circle" },
{ label: "Passeport expiré", icon: "alert-circle" },
{ label: "Passeport en cours de demande", icon: "loader" },
{ label: "Je n'ai pas encore de passeport", icon: "circle-slash" }
]
}

];

// ============================================================
// DOMAINE D'ÉTUDES → FAMILLE DU CATALOGUE
//
// MESURÉ le 2026-09-05 sur assets/data/catalogue.json : 79 des 155
// universités portent un champ `fields`, et il n'existe que DIX
// familles dans tout le catalogue (Commerce, Sciences sociales,
// Ingénierie, Informatique, Architecture, Sciences, Lettres, Droit,
// Médecine, Agriculture).
//
// Or la question « Que souhaitez-vous étudier ? » propose des
// spécialités fines — « Intelligence artificielle », « Cybersécurité »,
// « Psychologie ». Le rapprochement fait par le moteur
// (js/recommend-programs.js) est une comparaison de texte : « intelligence
// artificielle » ne contient pas « informatique » et réciproquement, donc
// AUCUN de ces étudiants ne recevait le bonus de domaine. La question la
// plus intuitive du questionnaire ne changeait rien aux propositions.
//
// Ce n'est pas la question qu'il faut appauvrir — un étudiant doit
// pouvoir écrire « Cybersécurité ». C'est sa réponse qu'il faut TRADUIRE
// vers le vocabulaire du catalogue. Le commentaire de
// recommend-programs.js qui affirme que `fields` « reste vide sur tout le
// catalogue » est périmé : il l'était au moment où il a été écrit.
//
// RÈGLE DES TROIS VALEURS, comme pour l'éligibilité et l'âge : un domaine
// non reconnu renvoie "" — inconnu, jamais « ne correspond pas ». Il ne
// retire donc jamais rien à personne.
// ============================================================

// ORDRE SIGNIFIANT : du plus spécifique au plus général. « Sciences
// sociales » et « Lettres & sciences humaines » doivent être reconnues
// AVANT « Sciences », sinon le mot « sciences » les absorbe toutes les
// deux — piège constaté au premier essai, corrigé ici. Même raison pour
// « génie logiciel », qui appartient à l'informatique et non au génie.
const FAMILLES_CATALOGUE = [

["Informatique", ["informatique", "intelligence artificielle", "cybersécurité", "cybersecurite", "data science", "génie logiciel", "genie logiciel", "developpement web", "développement web", "logiciel", "programmation", "numérique", "numerique", "software", "computer", "données", "donnees"]],

["Sciences sociales", ["sciences sociales", "science sociale", "psychologie", "sociologie", "anthropologie", "éducation", "education", "démographie", "demographie", "travail social", "pédagogie", "pedagogie"]],

["Lettres", ["lettres", "sciences humaines", "arts", "communication", "langues", "littérature", "litterature", "histoire", "philosophie", "journalisme", "traduction", "design", "musique", "cinéma", "cinema"]],

["Médecine", ["médecine", "medecine", "santé", "sante", "pharmacie", "dentisterie", "odontologie", "infirmier", "soins", "biomédical", "biomedical", "medicine", "health", "kinésithérapie", "kinesitherapie"]],

["Commerce", ["commerce", "management", "marketing", "finance", "comptabilité", "comptabilite", "gestion", "économie", "economie", "business", "mba", "banque", "assurance", "entrepreneuriat", "logistique"]],

["Droit", ["droit", "juridique", "relations internationales", "sciences politiques", "science politique", "law", "gouvernance", "diplomatie", "administration publique"]],

["Agriculture", ["agronomie", "agriculture", "agro", "environnement", "développement rural", "developpement rural", "élevage", "elevage", "forêt", "foret", "climat", "hydraulique", "pêche", "peche", "vétérinaire", "veterinaire"]],

// « Génie civil » et « travaux publics » sont VOLONTAIREMENT absents :
// ils appartiennent à l'ingénierie. Un étudiant en génie civil doit
// être rapproché des écoles d'ingénieurs, pas des écoles
// d'architecture — erreur constatée en production le 2026-09-05 et
// corrigée le jour même.
["Architecture", ["architecture", "urbanisme", "aménagement", "amenagement", "bâtiment", "batiment"]],

["Ingénierie", ["ingénierie", "ingenierie", "ingénieur", "ingenieur", "génie civil", "genie civil", "travaux publics", "génie", "genie", "mécanique", "mecanique", "électrique", "electrique", "électronique", "electronique", "énergie", "energie", "engineering", "industriel", "télécommunication", "telecommunication", "aéronautique", "aeronautique", "mines", "pétrole", "petrole"]],

["Sciences", ["biologie", "chimie", "physique", "mathématiques", "mathematiques", "maths", "statistique", "géologie", "geologie", "biotechnologie", "astronomie", "astrophysique", "océanographie", "oceanographie"]]

];

/**
* La famille du catalogue correspondant à un domaine saisi, ou "" si
* on ne sait pas. Un "" ne retire jamais rien à personne.
*/
export function familleDeDomaine(saisie) {

const t = String(saisie || "").toLowerCase().trim();

if (!t) return "";

for (const [famille, motifs] of FAMILLES_CATALOGUE) {
if (motifs.some((m) => t.includes(m))) return famille;
}

// Filet de dernier recours : un domaine scientifique non listé
// (« astrophysique quantique ») vaut mieux rattaché aux Sciences que
// laissé inconnu. Testé APRÈS tout le reste, pour ne pas absorber
// « sciences sociales » ni « sciences humaines ».
if (t.includes("science")) return "Sciences";

return "";

}

// ============================================================
// COMPOSITION DU PARCOURS
// ============================================================

/**
* Remplace les pays proposés pour la destination par ceux réellement
* présents au catalogue.
*
* Passer par une fonction plutôt que de laisser l'appelant modifier le
* tableau : la liste par défaut (« Je ne sais pas encore » seul) est un
* FILET DE SECOURS, pas une valeur de travail. Si Firestore ne répond
* pas, le questionnaire continue avec ce filet au lieu de s'arrêter —
* mais rien d'autre ne doit pouvoir écrire dedans par accident.
*/
export function definirSuggestionsDestination(pays) {

const question = TRONC_COMMUN.find((q) => q.id === "destinationCountry");

if (question && Array.isArray(pays) && pays.length) question.suggestions = pays;

}

/** Résout un champ qui peut être une valeur ou une fonction des réponses. */
export function resoudre(champ, reponses) {
return typeof champ === "function" ? champ(reponses || {}) : champ;
}

/**
* La liste ORDONNÉE des questions pour un jeu de réponses donné.
*
* L'ordre n'est pas cosmétique : l'aiguillage et le cycle visé passent
* en premier parce que TOUT le reste en dépend. Poser la nationalité
* avant de savoir à qui l'on parle, c'était le défaut de l'ancien
* parcours — la troisième question seulement révélait le niveau.
*/
export function questionsPour(reponses) {

const r = reponses || {};
const piste = pisteDepuisNiveau(r.currentLevel);

const liste = [AIGUILLAGE];

if (!piste) return liste;

liste.push(CYCLE_VISE);

liste.push(...(QUESTIONS_PISTE[piste] || []));

if (vise(r, "Master")) liste.push(...BLOC_MASTER);
if (vise(r, "Doctorat (PhD)")) liste.push(...BLOC_DOCTORAT);

liste.push(...TRONC_COMMUN);

return liste.filter((q) => (typeof q.when === "function" ? !!q.when(r) : true));

}

/**
* Efface les réponses aux questions qui ne font plus partie du
* parcours. Sans cela, un étudiant qui recule et se déclare doctorant
* garderait sa filière de baccalauréat dans le dossier transmis à
* Fitz, qui la commenterait — le genre de détail qui fait perdre toute
* crédibilité à une analyse.
*
* Les clés techniques (`<id>Scale` du sélecteur de moyenne) suivent
* leur question. Modifie l'objet reçu ET le renvoie.
*/
export function purgerHorsPiste(reponses) {

const r = reponses || {};

const gardees = new Set(questionsPour(r).map((q) => q.id));

// currentLevel commande tout : jamais purgée par sa propre absence.
gardees.add("currentLevel");

// targetLevel peut avoir été posée AVANT un changement de niveau qui
// la rend implicite : on la garde si elle reste un cycle valide.
const cyclesPossibles = cyclesVisesPour(pisteDepuisNiveau(r.currentLevel));
if (r.targetLevel && cyclesPossibles.includes(r.targetLevel)) gardees.add("targetLevel");

Object.keys(r).forEach((cle) => {

const base = cle.endsWith("Scale") ? cle.slice(0, -"Scale".length) : cle;

if (!gardees.has(base)) delete r[cle];

});

return r;

}
