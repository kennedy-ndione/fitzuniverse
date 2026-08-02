const QUESTIONS = [

{
id:"country",

icon:"map-pin",

question:"Dans quel pays vivez-vous actuellement ?",

assistant:"Pour commencer, dites-moi d'où vous me parlez : cela m'aide à repérer les programmes accessibles depuis votre région.",

type:"search",

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
"Algérie"
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

assistant:"Beaucoup d'universités et de bourses s'appuient sur ce chiffre pour évaluer les dossiers.",

type:"slider",

min:0,
max:20,
step:0.1

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

suggestions:[
"Canada",
"France",
"Allemagne",
"Belgique",
"Pays-Bas",
"Italie",
"Espagne",
"Royaume-Uni",
"États-Unis",
"Irlande",
"Australie",
"Nouvelle-Zélande",
"Japon",
"Corée du Sud",
"Chine",
"Turquie",
"Arabie Saoudite",
"Qatar",
"Émirats Arabes Unis",
"Maroc",
"Hongrie",
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
