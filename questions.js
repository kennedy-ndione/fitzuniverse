// Liste mondiale de pays, réutilisée par "country" (résidence) ET
// "nationality" (nationalité/citoyenneté) — audit 2026-08-22 : les deux
// questions posent la même liste, factoriser évite que les deux copies
// divergent avec le temps. type:"search" n'impose jamais cette liste :
// answerInput.value.trim() est enregistré tel quel (voir
// eligibility-questions.js), donc taper un pays absent d'ici fonctionne
// déjà. Mais visuellement, une liste limitée aux 15 pays francophones
// d'Afrique/Maghreb ci-dessous laissait croire que Fitz
// n'était pensé que pour eux — audit du 2026-08-14, "tout étudiant, où
// qu'il soit". Aucune liste de pays mondiale n'existait déjà ailleurs
// dans le projet (vérifié : data/countries.js n'a que 3 pays de
// destination, pas un référentiel pays de résidence). Les 15 premiers
// restent en tête, cœur probable de l'audience ; le reste suit en
// ordre alphabétique par continent.
const WORLD_COUNTRY_SUGGESTIONS = [

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

];

// ============================================================
// QUESTIONS — refonte du 2026-08-29.
//
// Chaque question correspond à un CRITÈRE OBJECTIF utilisé par les
// grands programmes de bourses (Chevening, DAAD, Eiffel, MEXT, CSC,
// Türkiye Bursları, Stipendium Hungaricum, Mastercard Foundation…),
// jamais à une préférence décorative :
//
//   1-2. résidence + nationalité — conditions de citoyenneté et
//        programmes régionaux ;
//   3-4. parcours ACTUEL et diplôme VISÉ, désormais séparés. L'ancienne
//        question unique servait le niveau actuel au moteur, qui le
//        comparait au niveau du programme : un titulaire de licence
//        était orienté vers… des licences, alors qu'il vise un master.
//        C'est le diplôme VISÉ qui se compare aux programmes ; l'écart
//        entre les deux niveaux sert à vérifier la cohérence du projet ;
//   5.   domaine d'études — affiné par Fitz, prêt pour le champ
//        university.fields du catalogue ;
//   6.   moyenne, dans le système de notation de l'étudiant ;
//   7.   tranche d'âge — plusieurs bourses officielles fixent des
//        limites d'âge PAR CYCLE (MEXT licence ≤ 24 ans, Türkiye
//        Bursları licence < 21, CSC master < 35…). La tranche suffit,
//        la date de naissance n'est jamais demandée ;
//   8-9. anglais + français — les deux langues d'enseignement du
//        catalogue ;
//   10.  certification de langue — quasi toutes les bourses financées
//        exigent une preuve officielle (IELTS/TOEFL, DELF/TCF) ;
//   11.  calendrier — les grandes bourses nationales ouvrent UNE fois
//        par an, viser à moins de 6 mois ferme des portes ;
//   12.  destination éventuelle — synchronisée avec le vrai catalogue ;
//   13.  financement recherché — croisé avec scholarship.funding ;
//   14.  passeport — premier document exigé par tous les portails.
//
// Les icônes d'options suivent la règle "Icônes" de DESIGN_SYSTEM.md :
// une icône n'est posée que si elle AJOUTE du sens ; les échelles de
// niveau (langues, âge) n'en portent pas — l'ordre des cartes dit déjà
// la progression, et eligibility-questions.js:renderCards() accepte
// les options sans icône.
// ============================================================
const QUESTIONS = [

{
id:"country",

icon:"map-pin",

question:"Dans quel pays vivez-vous actuellement ?",

assistant:"Pour commencer, dites-moi d'où vous me parlez : cela m'aide à repérer les programmes accessibles depuis votre région.",

type:"search",

suggestions:WORLD_COUNTRY_SUGGESTIONS

},

{
id:"nationality",

icon:"id-card",

question:"Quelle est votre nationalité ?",

// Distincte du pays de résidence : beaucoup de bourses posent des
// conditions sur la citoyenneté, pas sur le lieu de vie actuel — un
// étudiant sénégalais installé au Maroc reste éligible aux programmes
// réservés aux Sénégalais.
assistant:"Si elle diffère de votre pays de résidence, précisez-la : plusieurs bourses ciblent la nationalité plutôt que le lieu de vie actuel.",

type:"search",

suggestions:WORLD_COUNTRY_SUGGESTIONS

},

{
id:"currentLevel",

icon:"graduation-cap",

question:"Où en êtes-vous aujourd'hui dans vos études ?",

assistant:"Votre situation actuelle, pas celle que vous visez — la prochaine question porte justement sur votre objectif.",

type:"cards",

options:[
{ label:"Bac en cours ou obtenu", icon:"school" },
{ label:"Licence en cours", icon:"book-open" },
{ label:"Licence obtenue", icon:"award" },
{ label:"Master en cours ou obtenu", icon:"graduation-cap" },
{ label:"Doctorat en cours ou obtenu", icon:"microscope" }
]

},

{
id:"targetLevel",

icon:"target",

// C'est CETTE réponse que le moteur compare au niveau des programmes
// du catalogue (voir js/recommend-programs.js) — pas le niveau actuel.
question:"Quel diplôme visez-vous à l'étranger ?",

assistant:"C'est le critère n°1 de toutes les bourses : chaque programme finance un cycle précis. Si vous hésitez, je vous orienterai d'après votre parcours.",

type:"cards",

options:[
{ label:"Licence (Bachelor)", icon:"book-open" },
{ label:"Master", icon:"graduation-cap" },
{ label:"Doctorat (PhD)", icon:"microscope" },
{ label:"Je ne sais pas encore", icon:"help-circle" }
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
id:"ageBracket",

icon:"calendar",

question:"Quelle est votre tranche d'âge ?",

// Critère réellement discriminant : MEXT (licence) exige ≤ 24 ans,
// Türkiye Bursları < 21 ans en licence et < 30 en master, le CSC
// chinois < 25 en licence et < 35 en master, Eiffel plafonne aussi
// par cycle. La tranche suffit pour situer ces seuils — jamais de
// date de naissance.
assistant:"Plusieurs bourses officielles fixent des limites d'âge par cycle d'études. Votre tranche me suffit — je ne vous demanderai jamais votre date de naissance.",

type:"cards",

options:[
{ label:"Moins de 18 ans" },
{ label:"18 – 24 ans" },
{ label:"25 – 29 ans" },
{ label:"30 – 34 ans" },
{ label:"35 ans et plus" }
]

},

{
id:"english",

icon:"languages",

question:"Quel est votre niveau en anglais ?",

assistant:"De nombreux programmes internationaux sont enseignés en anglais : répondez simplement avec honnêteté, cela m'aide à cibler juste.",

type:"cards",

options:[
{ label:"Débutant" },
{ label:"Intermédiaire" },
{ label:"Bon niveau" },
{ label:"Courant / Bilingue" }
]

},

{
id:"french",

icon:"languages",

question:"Et votre niveau en français ?",

assistant:"Le français reste la langue d'enseignement d'une partie du catalogue (France, Belgique, Suisse, Canada francophone) — utile même si l'anglais est votre priorité.",

type:"cards",

options:[
{ label:"Débutant" },
{ label:"Intermédiaire" },
{ label:"Bon niveau" },
{ label:"Courant / Langue maternelle" }
]

},

{
id:"langCert",

icon:"file-check",

question:"Avez-vous une certification de langue officielle ?",

// La quasi-totalité des bourses financées exige une preuve officielle
// du niveau (IELTS/TOEFL pour l'anglais, DELF/DALF/TCF pour le
// français) — l'avoir déjà est un accélérateur concret de dossier,
// pas un détail.
assistant:"La plupart des bourses financées demandent une preuve officielle du niveau de langue. Si vous ne l'avez pas encore, ce n'est pas bloquant : ce sera une étape de votre plan d'action.",

type:"cards",

options:[
{ label:"Oui, en anglais (IELTS, TOEFL…)", icon:"file-check" },
{ label:"Oui, en français (DELF, TCF…)", icon:"file-check" },
{ label:"Oui, dans les deux langues", icon:"files" },
{ label:"Pas encore", icon:"circle-slash" }
]

},

{
id:"timeline",

icon:"calendar-clock",

question:"Quand souhaitez-vous démarrer vos études à l'étranger ?",

// Les grandes bourses nationales (Chevening, MEXT, Eiffel, Türkiye
// Bursları…) ouvrent UNE fois par an : viser un départ à moins de
// 6 mois ferme mécaniquement une partie des portes de l'année.
assistant:"Les grandes bourses ouvrent une fois par an, souvent 8 à 12 mois avant la rentrée : votre calendrier détermine celles qui restent atteignables.",

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

assistant:"Si un pays vous fait rêver, dites-le-moi. Sinon, choisissez « Je ne sais pas encore » et je vous proposerai les destinations où votre profil est le plus compétitif.",

type:"search",

// Liste remplacée dynamiquement par les pays réellement présents dans
// le catalogue (voir loadDestinationCountries, eligibility-questions.js).
suggestions:[
"Je ne sais pas encore"
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
{ label:"Je n'ai pas de préférence", icon:"compass" }
]

},

{
id:"passport",

icon:"id-card",

question:"Où en êtes-vous avec votre passeport ?",

assistant:"C'est le premier document exigé par tous les portails de candidature — et les délais d'obtention se comptent souvent en mois.",

type:"cards",

options:[
{ label:"Passeport valide", icon:"check-circle" },
{ label:"Passeport expiré", icon:"alert-circle" },
{ label:"Passeport en cours de demande", icon:"loader" },
{ label:"Je n'ai pas encore de passeport", icon:"circle-slash" }
]

}

];
