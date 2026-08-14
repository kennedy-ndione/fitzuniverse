const QUESTIONS = [

{
id:"country",

icon:"map-pin",

question:"Dans quel pays vivez-vous actuellement ?",

assistant:"Pour commencer, dites-moi d'où vous me parlez : cela m'aide à repérer les programmes accessibles depuis votre région.",

type:"search",

// type:"search" n'impose jamais cette liste : answerInput.value.trim()
// est enregistré tel quel (voir eligibility-questions.js), donc taper
// un pays absent d'ici fonctionne déjà. Mais visuellement, une liste
// limitée aux 15 pays francophones d'Afrique/Maghreb ci-dessous
// laissait croire que ScholarBridge n'était pensé que pour eux — audit
// du 2026-08-14, "tout étudiant, où qu'il soit". Aucune liste de pays
// mondiale n'existait déjà ailleurs dans le projet (vérifié :
// data/countries.js n'a que 3 pays de destination, pas un référentiel
// pays de résidence). Les 15 premiers restent en tête, cœur probable
// de l'audience ; le reste suit en ordre alphabétique par continent.
suggestions:[

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
"Afrique du Sud",
"Angola",
"Botswana",
"Burundi",
"Cap-Vert",
"Comores",
"Congo (République du)",
"Djibouti",
"Égypte",
"Érythrée",
"Eswatini",
"Éthiopie",
"Gambie",
"Ghana",
"Guinée équatoriale",
"Guinée-Bissau",
"Kenya",
"Lesotho",
"Liberia",
"Libye",
"Malawi",
"Maurice",
"Mauritanie",
"Mozambique",
"Namibie",
"Nigeria",
"Ouganda",
"République centrafricaine",
"Rwanda",
"Sao Tomé-et-Principe",
"Sierra Leone",
"Somalie",
"Soudan",
"Soudan du Sud",
"Tanzanie",
"Tchad",
"Zambie",
"Zimbabwe",

// Europe
"Albanie",
"Allemagne",
"Andorre",
"Autriche",
"Belgique",
"Bosnie-Herzégovine",
"Bulgarie",
"Chypre",
"Croatie",
"Danemark",
"Espagne",
"Estonie",
"Finlande",
"France",
"Grèce",
"Hongrie",
"Irlande",
"Islande",
"Italie",
"Kosovo",
"Lettonie",
"Liechtenstein",
"Lituanie",
"Luxembourg",
"Macédoine du Nord",
"Malte",
"Moldavie",
"Monaco",
"Monténégro",
"Norvège",
"Pays-Bas",
"Pologne",
"Portugal",
"République tchèque",
"Roumanie",
"Royaume-Uni",
"Russie",
"Saint-Marin",
"Serbie",
"Slovaquie",
"Slovénie",
"Suède",
"Suisse",
"Ukraine",
"Vatican",

// Amériques
"Antigua-et-Barbuda",
"Argentine",
"Bahamas",
"Barbade",
"Belize",
"Bolivie",
"Brésil",
"Canada",
"Chili",
"Colombie",
"Costa Rica",
"Cuba",
"Dominique",
"Équateur",
"États-Unis",
"Grenade",
"Guatemala",
"Guyana",
"Haïti",
"Honduras",
"Jamaïque",
"Mexique",
"Nicaragua",
"Panama",
"Paraguay",
"Pérou",
"République dominicaine",
"Saint-Kitts-et-Nevis",
"Saint-Vincent-et-les-Grenadines",
"Sainte-Lucie",
"Suriname",
"Trinité-et-Tobago",
"Uruguay",
"Venezuela",

// Asie et Moyen-Orient
"Afghanistan",
"Arabie Saoudite",
"Arménie",
"Azerbaïdjan",
"Bahreïn",
"Bangladesh",
"Bhoutan",
"Brunei",
"Cambodge",
"Chine",
"Corée du Nord",
"Corée du Sud",
"Émirats Arabes Unis",
"Géorgie",
"Inde",
"Indonésie",
"Irak",
"Iran",
"Israël",
"Japon",
"Jordanie",
"Kazakhstan",
"Kirghizistan",
"Koweït",
"Laos",
"Liban",
"Malaisie",
"Maldives",
"Mongolie",
"Myanmar",
"Népal",
"Oman",
"Ouzbékistan",
"Pakistan",
"Palestine",
"Philippines",
"Qatar",
"Singapour",
"Sri Lanka",
"Syrie",
"Tadjikistan",
"Taïwan",
"Thaïlande",
"Timor oriental",
"Turkménistan",
"Turquie",
"Vietnam",
"Yémen",

// Océanie
"Australie",
"Fidji",
"Îles Marshall",
"Îles Salomon",
"Kiribati",
"Micronésie",
"Nauru",
"Nouvelle-Zélande",
"Palaos",
"Papouasie-Nouvelle-Guinée",
"Samoa",
"Tonga",
"Tuvalu",
"Vanuatu"

]

},

{
id:"studyLevel",

icon:"graduation-cap",

question:"Quel est votre niveau d'études actuel ?",

assistant:"Cette information me permet d'écarter tout de suite les programmes qui ne correspondent pas à votre parcours.",

type:"cards",

options:[
{ label:"Nouveau bachelier", icon:"school" },
{ label:"Licence", icon:"book-open" },
{ label:"Master", icon:"graduation-cap" },
{ label:"Doctorat", icon:"microscope" }
]

},

{
id:"studyCategory",

icon:"compass",

question:"Que souhaitez-vous étudier ?",

assistant:"Indiquez votre domaine, ou directement votre spécialité si vous la connaissez déjà : les deux fonctionnent.",

type:"search",

suggestions:[
"Informatique",
"Intelligence artificielle",
"Cybersécurité",
"Data Science",
"Développement Web",
"Génie logiciel",
"Génie civil",
"Génie mécanique",
"Génie électrique",
"Sciences & Ingénierie",
"Médecine",
"Pharmacie",
"Dentisterie",
"Soins infirmiers",
"Santé & Médecine",
"Commerce",
"Marketing",
"Finance",
"Comptabilité",
"Commerce & Économie",
"Droit",
"Relations internationales",
"Droit & Sciences politiques",
"Agronomie",
"Agriculture & Environnement",
"Architecture",
"Psychologie",
"Lettres & Sciences humaines",
"Arts & Communication",
"Économie",
"Biologie",
"Chimie",
"Physique",
"Mathématiques",
"Autre"
]

},

{
id:"average",

icon:"bar-chart-3",

question:"Quelle est votre moyenne générale ?",

assistant:"Beaucoup d'universités et de bourses s'appuient sur ce chiffre pour évaluer les dossiers — quel que soit votre système de notation, choisissez celui qui correspond avant de répondre.",

type:"slider",

// Sélecteur d'échelle (audit du 2026-08-14) : le curseur était câblé en
// dur sur /20 (système francophone), inutilisable honnêtement par un
// étudiant noté sur 100, en GPA /4 ou en lettres. eligibility-questions.js
// affiche une puce par entrée ci-dessous et adapte le curseur (ou bascule
// vers des boutons de lettres pour "letters") selon la sélection ;
// eligibility-ai.js (normalizeAverageToPercent) convertit la valeur brute
// + l'id d'échelle vers un pourcentage 0-100 commun avant d'appliquer les
// seuils de score — la table de conversion est documentée là-bas.
scales:[
{ id:"20", label:"/20", kind:"numeric", min:0, max:20, step:0.1 },
{ id:"100", label:"/100", kind:"numeric", min:0, max:100, step:1 },
{ id:"gpa4", label:"GPA /4", kind:"numeric", min:0, max:4, step:0.1 },
{ id:"letters", label:"Lettres (A-F)", kind:"letters", options:["A","B","C","D","F"] },
{ id:"other", label:"Autre système (%)", kind:"numeric", min:0, max:100, step:1 }
],

defaultScale:"20"

},

{
id:"english",

icon:"languages",

question:"Quel est votre niveau en anglais ?",

assistant:"De nombreux programmes internationaux sont enseignés en anglais : répondez simplement avec honnêteté, cela m'aide à cibler juste.",

type:"cards",

options:[
{ label:"Débutant", icon:"circle" },
{ label:"Intermédiaire", icon:"circle-dot" },
{ label:"Bon niveau", icon:"badge-check" },
{ label:"Courant / Bilingue", icon:"trophy" }
]

},

{
id:"timeline",

icon:"calendar-clock",

question:"Quand souhaitez-vous démarrer vos études à l'étranger ?",

assistant:"Cela m'aide à évaluer le temps que nous avons pour préparer votre dossier ensemble.",

type:"cards",

options:[
{ label:"Dans les 6 prochains mois", icon:"zap" },
{ label:"D'ici 1 an", icon:"calendar" },
{ label:"Dans plus d'un an", icon:"hourglass" },
{ label:"Je ne sais pas encore", icon:"help-circle" }
]

},

{
id:"destinationCountry",

icon:"globe-2",

question:"Avez-vous une destination en tête ?",

assistant:"Si un pays vous fait rêver, dites-le-moi. Sinon, choisissez « Je ne sais pas encore » et je vous proposerai les meilleures options.",

type:"search",

// Liste générée dynamiquement par eligibility-questions.js depuis les
// pays réellement présents dans la collection Firestore "universities"
// (audit du 2026-08-14) : l'ancienne liste codée en dur proposait des
// pays sans aucun programme en base (Pays-Bas, Espagne, Irlande,
// Australie, Nouvelle-Zélande, Qatar, Émirats Arabes Unis) et omettait
// des pays qui EN ONT (Russie, Roumanie, Suisse) — un étudiant pouvait
// "choisir" une destination fantôme, ou ne jamais voir suggérée une
// destination réelle. Ce tableau reste le filet de secours si la
// lecture Firestore échoue (pas de suggestion vide) ; "Je ne sais pas
// encore" est toujours ajoutée par-dessus, ici comme dynamiquement.
suggestions:[
"Je ne sais pas encore"
]

},

{
id:"passport",

icon:"id-card",

question:"Où en êtes-vous avec votre passeport ?",

assistant:"Un détail très concret, mais important pour anticiper les démarches administratives.",

type:"cards",

options:[
{ label:"Passeport valide", icon:"check-circle" },
{ label:"Passeport expiré", icon:"alert-circle" },
{ label:"Passeport en cours de demande", icon:"loader" },
{ label:"Je n'ai pas encore de passeport", icon:"circle-slash" }
]

},

{
id:"goal",

icon:"banknote",

question:"Quel niveau de financement recherchez-vous ?",

assistant:"Cela m'aide à concentrer mes recherches sur les opportunités réellement accessibles pour vous.",

type:"cards",

options:[
{ label:"Une bourse complète", icon:"trophy" },
{ label:"Une bourse partielle", icon:"coins" },
{ label:"Les deux m'intéressent", icon:"layers" },
{ label:"Je n'ai pas de préférence", icon:"sparkles" }
]

},

{
id:"motivation",

icon:"sparkles",

question:"Quelle est votre principale motivation pour étudier à l'étranger ?",

assistant:"Cette question m'aide à comprendre ce qui compte vraiment pour vous, au-delà des chiffres.",

type:"cards",

options:[
{ label:"Améliorer mes compétences et ma carrière", icon:"briefcase" },
{ label:"Accéder à un enseignement de meilleure qualité", icon:"award" },
{ label:"Découvrir une nouvelle culture et gagner en autonomie", icon:"globe" },
{ label:"Contribuer au développement de mon pays d'origine", icon:"heart-handshake" }
]

}

];
