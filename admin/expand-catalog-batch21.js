// ============================================================
// FitzUniverse — Élargissement du catalogue, Lot 21 (2026-08-30)
//
// Termine les 10 pays qui n'avaient qu'UNE SEULE bourse au catalogue.
// Le lot 19 avait traité Royaume-Uni, Allemagne, Japon, Corée et
// Turquie ; celui-ci traite les cinq derniers : HONGRIE, ITALIE,
// ROUMANIE, RUSSIE et SUISSE.
//
// Crée 31 bourses, met à jour 5 bourses existantes dont les données
// étaient fausses ou périmées, et crée des programmes vers les
// universités DÉJÀ en base. Ne crée AUCUNE université — aucune photo
// neuve requise.
//
// Toutes les données proviennent de pages officielles chargées et
// vérifiées le 30/08/2026. Aucun site agrégateur n'a servi de source
// chiffrée.
//
// CONVENTION DE STATUT, identique au lot 19 :
//   "Ouverte" = on peut candidater au 30/08/2026, OU la prochaine
//               fenêtre a une date d'ouverture publiée à moins de
//               6 semaines.
//   "Fermée"  = cycle clos, prochaine fenêtre lointaine ou non datée.
// La fenêtre exacte est TOUJOURS écrite dans generalCriteria.
//
// CE QUE CE LOT APPREND SUR LE PUBLIC SÉNÉGALAIS — à lire avant de
// relire les fiches, parce que trois de ces cinq pays sont bien moins
// ouverts qu'ils n'en ont l'air :
//   - HONGRIE : le Sénégal n'est PAS pays partenaire du Stipendium
//     Hungaricum, qui fonctionne par accord bilatéral. Les seules
//     voies réellement ouvertes sont la bourse Corvinus et la SZTE
//     Start, toutes deux sans condition de nationalité.
//   - SUISSE : l'ESKAS inclut bien le Sénégal, mais UNIQUEMENT en
//     Research Fellowship et doctorat. Aucune bourse fédérale de
//     master. Un licencié sénégalais doit passer par l'ETH ESOP,
//     l'EPFL ou l'IHEID.
//   - RUSSIE : 130 places attribuées au Sénégal pour 2026-2027, mais
//     l'allocation (~1 500 ₽/mois) ne couvre même pas le loyer de la
//     résidence universitaire. C'est une exonération de frais, pas un
//     financement de vie — et les fiches le disent.
//   - ROUMANIE : la vraie porte est francophone et passe par l'AUF
//     (Eugen Ionescu puis Petrache Poenaru), pas par la bourse
//     gouvernementale dont la licence et le master s'enseignent
//     uniquement en roumain.
//   - ITALIE : les bourses régionales sont attribuées sur REVENU via
//     l'ISEE Parificato, dont chaque justificatif doit être légalisé
//     par l'ambassade d'Italie à Dakar — le Sénégal n'étant pas partie
//     à la Convention de La Haye, l'apostille ne s'applique pas.
//
// Patron de sécurité identique aux lots précédents : les bourses à
// mettre à jour et les universités à relier sont résolues EN DIRECT
// par titre/nom à l'étape 1, avec priorité à l'égalité EXACTE de
// titre — leçon du lot 20, où « Türkiye Bursları » correspondait à
// quatre documents.
// ============================================================

import { db } from "../firebase-config.js";

import {
collection,
getDocs,
getDoc,
doc,
setDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

function normalize(str) {
return String(str || "")
.replace(/ı/g, "i")
.replace(/İ/g, "i")
.normalize("NFD")
.replace(/[̀-ͯ]/g, "")
.toLowerCase()
.trim();
}

// ==========================================================
// A. Bourses EXISTANTES à corriger (résolues par titre, égalité
//    exacte prioritaire — leçon du lot 20)
// ==========================================================

const SCHOLARSHIP_UPDATES = [
{
key: "stipendium",
label: "Stipendium Hungaricum",
exact: "stipendium hungaricum",
match: (t) => normalize(t).includes("stipendium hungaricum"),
patch: {
status: "Fermée",
officialWebsite: "https://stipendiumhungaricum.hu/",
generalCriteria: "LE SÉNÉGAL N'EST PAS PAYS PARTENAIRE. Le programme fonctionne par accord bilatéral avec nomination obligatoire par l'autorité du pays d'envoi : un candidat sénégalais ne peut pas postuler, quel que soit son dossier. En Afrique de l'Ouest, ONT un accord : Mali, Burkina Faso, Ghana, Nigeria, Cap-Vert, Gambie, Guinée-Bissau, Sierra Leone, Liberia. N'EN ONT PAS : Sénégal, Côte d'Ivoire, Niger, Guinée, Bénin, Togo, Mauritanie. Ailleurs en Afrique : Algérie, Angola, Botswana, Burundi, RD Congo, Égypte, Guinée équatoriale, Érythrée, Éthiopie, Kenya, Libye, Madagascar, Maurice, Maroc, Mozambique, Namibie, Rwanda, São Tomé-et-Príncipe, Seychelles, Afrique du Sud, Soudan, Tanzanie, Tunisie, Ouganda. Cycle 2026/27 clos le 15 janvier 2026 ; l'appel 2027/28 n'est pas publié au 30/08/2026, l'historique le place à la mi-novembre."
}
},
{
key: "italie",
label: "Italian Government Scholarship",
exact: "italian government scholarship",
match: (t) => normalize(t).includes("italian government scholarship"),
patch: {
funding: "10 800 € pour 9 mois (et 3 600 € pour les cours intensifs de langue de 3 mois), versés PAR TRANCHES et non sous forme de mensualité. Assurance santé collective incluse, hors pathologies préexistantes et soins dentaires. ATTENTION : l'exonération des frais d'inscription n'est PAS automatique — seules certaines universités l'accordent au titre de leur autonomie, et la taxe régionale reste à la charge de l'étudiant. Les cours de langue sont intégralement payants.",
officialWebsite: "https://studyinitaly.esteri.it",
generalCriteria: "LE SÉNÉGAL EST EXPLICITEMENT ÉLIGIBLE. Niveaux couverts : master (2e cycle), doctorat, AFAM, cours de langue et projets de recherche — la licence n'est ouverte qu'aux renouvellements. Cycle 2026/2027 clos le 26 mars 2026 à 14h00 ; prochain appel attendu vers février-mars 2027 sur studyinitaly.esteri.it.",
status: "Fermée"
}
},
{
key: "roumanie",
label: "Romanian Government Scholarship",
exact: "romanian government scholarship",
match: (t) => normalize(t).includes("romanian government scholarship"),
patch: {
funding: "Exonération des frais de scolarité, logement en résidence universitaire, et allocation mensuelle en équivalent lei de 65 € (licence), 75 € (master) ou 85 € (doctorat) selon la HG 844/2008. Un projet d'alignement sur la bourse sociale minimale (925 lei/mois) est en discussion mais n'est pas confirmé comme adopté.",
officialWebsite: "https://studyinromania.gov.ro/mfa_2026-2027",
generalCriteria: "TROIS RESTRICTIONS DÉCISIVES, souvent omises. (1) MÉDECINE, MÉDECINE DENTAIRE ET PHARMACIE SONT EXCLUES — texte officiel « all fields, with the exception of Medicine, Dental Medicine and Pharmacy ». (2) LICENCE ET MASTER S'ENSEIGNENT UNIQUEMENT EN ROUMAIN ; seul le doctorat peut se faire en langue étrangère. L'année préparatoire de roumain est donc obligatoire pour un francophone — elle est en revanche FINANCÉE, scolarité et allocation comprises, et peut être levée sur certificat de langue. (3) Le programme vise tous les pays non-UE, il n'est pas ciblé sur l'Afrique. Cycle 2026-2027 clos le 31 mars 2026, résultats officiellement retardés ; prochain cycle attendu vers février 2027.",
status: "Fermée"
}
},
{
key: "opendoors",
label: "Open Doors",
exact: "open doors: russian scholarship project",
match: (t) => normalize(t).includes("open doors"),
patch: {
status: "Ouverte",
funding: "Frais de scolarité pris en charge sur le budget fédéral, plus une allocation mensuelle. LE CANDIDAT PAIE le voyage, le logement, l'assurance et ses frais personnels. Les lauréats ayant besoin du russe accèdent à un programme préparatoire d'un an financé sur le budget fédéral, avec admission garantie ensuite.",
levels: ["Licence", "Master", "Doctorat"],
officialWebsite: "https://od.globaluni.ru/",
generalCriteria: "QUATRE PISTES et non une seule : Licence (16-23 ans), Master (20-33 ans), Doctorat (22-35 ans, master requis) et Post-doctorat (24-39 ans, doctorat requis). 24 universités russes participantes. Ouvert à tous les pays sauf la Russie, et intégralement EN LIGNE — aucun déplacement requis avant l'admission, ce qui en fait la voie russe la plus accessible depuis Dakar. Cycle 2026 : inscriptions du 20 août au 1er NOVEMBRE 2026 ; portfolio jusqu'au 13 novembre ; épreuves du 13 novembre au 21 décembre 2026 ; entretiens du 22 décembre 2026 au 26 février 2027. « Winners » = 5 % de tête ; « runners-up » = 25 % de tête (licence et master), admis si des places de quota restent."
}
},
{
key: "suisse",
label: "Swiss Government Excellence Scholarships",
exact: "swiss government excellence scholarships",
match: (t) => normalize(t).includes("swiss government excellence"),
patch: {
funding: "2 450 CHF par mois depuis le 1er janvier 2026. Le SEFRI précise que ce montant couvre « les frais de subsistance de base d'une personne » et que « cette bourse n'est PAS un salaire » : elle n'absorbe pas une famille à charge, et LES FRAIS DE SCOLARITÉ NE SONT PAS COUVERTS. Selon l'établissement d'accueil peuvent s'ajouter la prise en charge de l'assurance maladie pour les non-européens, le remboursement du vol retour et de l'abonnement demi-tarif, et un accès prioritaire au logement étudiant la première année.",
officialWebsite: "https://www.sbfi.admin.ch/eskas",
generalCriteria: "LE SÉNÉGAL EST ÉLIGIBLE POUR LE CYCLE 2027-2028, mais UNIQUEMENT en Research Fellowship et en doctorat — PAS EN MASTER. Un titulaire de licence sénégalais n'est donc pas éligible : il faut un master déjà achevé. Candidatures ouvertes depuis le 20 août 2026, DATE LIMITE SÉNÉGAL LE 30 NOVEMBRE 2026 À 23H59 (heure suisse), dépôt auprès de l'ambassade de Suisse à Dakar : dakar@eda.admin.ch. Autres pays d'Afrique de l'Ouest, même offre, date limite 27 novembre 2026 : Côte d'Ivoire, Burkina Faso, Bénin, Guinée, Niger, Togo, Ghana, Nigeria, Cameroun ; Mali au 30 novembre 2026.",
status: "Ouverte"
}
}
];

// ==========================================================
// B. Universités DÉJÀ en base auxquelles rattacher des bourses.
//    Résolues par nom : les noms exacts des universités hongroises
//    et italiennes viennent d'imports anciens, ils ne sont pas
//    devinables depuis le code. Une université introuvable ne
//    bloque pas le lot — ses programmes sont simplement ignorés.
// ==========================================================

const UNIVERSITY_LOOKUPS = [
{ key: "corvinus", label: "Corvinus", match: (n) => normalize(n).includes("corvinus") },
{ key: "semmelweis", label: "Semmelweis", match: (n) => normalize(n).includes("semmelweis") },
{ key: "debrecen", label: "Université de Debrecen", match: (n) => normalize(n).includes("debrecen") },
{ key: "szeged", label: "Université de Szeged", match: (n) => normalize(n).includes("szeged") },
{ key: "unstpb", label: "Politehnica Bucarest (UNSTPB)", match: (n) => normalize(n).includes("politehnica") },
{ key: "unibuc", label: "Université de Bucarest", match: (n) => normalize(n).includes("universite de bucarest") || normalize(n).includes("university of bucharest") },
{ key: "hse", label: "HSE University", match: (n) => normalize(n).includes("hse university") || normalize(n).includes("higher school of economics") },
{ key: "eth", label: "ETH Zurich", match: (n) => normalize(n).includes("eth zurich") },
{ key: "epfl", label: "EPFL", match: (n) => normalize(n).includes("epfl") || normalize(n).includes("polytechnique federale de lausanne") },
{ key: "uzh", label: "University of Zurich (UZH)", match: (n) => normalize(n).includes("university of zurich") || normalize(n).includes("uzh") }
];

// ==========================================================
// C. Les 31 nouvelles bourses
// ==========================================================

const SCHOLARSHIPS = [

// ---------------- HONGRIE (5) ----------------
{
id: "corvinus-scholarship",
data: {
title: "Corvinus Scholarship",
country: "Hongrie",
funding: "Exonération TOTALE des frais de scolarité, jusqu'à 4 semestres. N'inclut ni logement, ni frais de vie, ni voyage. Réductions cumulables selon les cas : −10 % « Early Bird », −30 % pour les anciens de Corvinus. Une aide « Study Grant » d'environ 200 €/mois maximum existe pour les auto-financés, sur performance.",
description: "Réservée à trois programmes — MSc Management and Leadership (CEMS), MSc Finance et International MBA — avec au maximum 20 bourses par programme, attribuées au fil de l'eau parmi les candidats atteignant le seuil.",
status: "Fermée",
isActive: true,
levels: ["Master"],
officialWebsite: "https://www.uni-corvinus.hu/main-page/life-at-corvinus/scholarship/corvinus-scholarship-2/?lang=en",
generalCriteria: "AUCUNE RESTRICTION DE NATIONALITÉ — c'est, avec l'Erasmus Mundus, la meilleure porte d'entrée hongroise pour un Sénégalais, que le Stipendium Hungaricum exclut. Réservée aux candidats auto-financés, avec un minimum de 75/100 points à l'admission (MSc) ou 90/100 (MBA). Maintien conditionné à 54 crédits sur deux semestres et une moyenne pondérée d'au moins 3,8. Cycle rentrée septembre 2026 : 3 novembre 2025 au 13 août 2026, clos ; prochain cycle attendu en novembre 2026."
}
},
{
id: "szte-start-scholarship",
data: {
title: "SZTE Start Scholarship",
country: "Hongrie",
funding: "900 € versés EN UNE SEULE FOIS comme aide au démarrage des études. Ce n'est PAS une réduction de frais de scolarité, et cela ne finance pas des études — c'est un coup de pouce à l'installation.",
description: "12 bourses au total, idéalement une par faculté de l'Université de Szeged ; c'est la seule bourse propre à cet établissement, distincte des dispositifs nationaux.",
status: "Fermée",
isActive: true,
levels: ["Licence", "Master"],
officialWebsite: "https://u-szeged.hu/prospective-students/szte-start-scholarship/szte-start-scholarship",
generalCriteria: "AUCUNE RESTRICTION DE NATIONALITÉ publiée — accessible à un candidat sénégalais. Ouverte aux auto-financés. Dossier complet via DreamApply (CV et lettre de recommandation) avant le 30 avril 2026 pour le cycle 2026/27, statut « Place reserved » au 30 juin, inscription sur place au 5 septembre 2026. Prochain cycle attendu début 2027."
}
},
{
id: "fao-hungarian-government-scholarship",
data: {
title: "FAO–Hungarian Government Scholarship Programme",
country: "Hongrie",
funding: "Le gouvernement hongrois prend en charge les frais de candidature et de scolarité (livres et supports inclus), le logement en résidence universitaire, les frais de subsistance et l'assurance maladie. Montants chiffrés non publiés. Aucun soutien pour les membres de la famille.",
description: "Programme conjoint FAO / gouvernement hongrois centré sur l'agronomie, adossé à trois masters précis. C'est le dispositif gouvernemental hongrois le plus accessible aux Ouest-Africains hors Stipendium Hungaricum.",
status: "Fermée",
isActive: true,
levels: ["Master"],
officialWebsite: "https://www.fao.org/europe/events/detail/fao-hungarian-government-scholarship-programme-2026-2027/en",
generalCriteria: "45 pays éligibles. En Afrique de l'Ouest : BURKINA FASO, MALI, GAMBIE, GHANA, NIGERIA, CAP-VERT — le Sénégal n'est PAS listé. Ailleurs en Afrique : Angola, Tchad, RD Congo, Égypte, Éthiopie, Kenya, Madagascar, Namibie, Somalie, Soudan du Sud, Soudan, Ouganda. Trois masters seulement : Agricultural Biotechnology (MATE Gödöllő), Animal Nutrition and Feed Safety Engineering (MATE Kaposvár), Plant Protection (Université de Debrecen). Dépôt par courriel du 21 janvier au 28 février 2026, clos ; prochain appel attendu janvier 2027. L'ouverture est conditionnée à un seuil minimum d'inscrits."
}
},
{
id: "ud-international-scholarship",
data: {
title: "UD International Scholarship (Université de Debrecen)",
country: "Hongrie",
funding: "Réduction des frais de scolarité : maximum 30 % en Médecine et Dentisterie, maximum 90 % dans toutes les autres filières, le taux dépendant du dossier et du concours d'entrée. Assurance maladie incluse. Montants absolus non publiés.",
description: "Programme pilote du gouvernement hongrois visant à attirer les internationaux vers les filières STIM et santé — agriculture, ingénierie, sciences de la santé, informatique, sciences. Rentrée de septembre uniquement.",
status: "Fermée",
isActive: true,
levels: ["Licence", "Master"],
officialWebsite: "https://edu.unideb.hu/p/ud-international-scholarship",
generalCriteria: "89 pays éligibles, mais en Afrique SEULEMENT l'Égypte, le Kenya, Maurice, la Namibie, le Nigeria et l'Afrique du Sud — LE SÉNÉGAL N'EST PAS SUR LA LISTE. Candidatures au fil de l'eau dans la limite du budget, ouvertes le 16 janvier 2026 et closes le 15 juin 2026 ; prochain cycle attendu janvier 2027."
}
},
{
id: "semmelweis-pannonia-in-excellence",
data: {
title: "Semmelweis Pannonia In Excellence Scholarship",
country: "Hongrie",
funding: "Montant annuel versé en 12 mensualités égales par virement : 2 000 000 HUF en Médecine et en Dentisterie, 1 300 000 HUF en Sciences pharmaceutiques, 900 000 HUF en Sciences de la santé, 2 900 000 HUF à la Faculté András Pető. Ni logement ni frais de scolarité pris en charge.",
description: "Bourse au mérite pour étudiants étrangers DÉJÀ INSCRITS à Semmelweis en filière anglophone ou germanophone — ce n'est pas une bourse d'entrée. Récompense l'excellence académique ou des résultats sportifs ou artistiques.",
status: "Ouverte",
isActive: true,
levels: ["Licence", "Master"],
officialWebsite: "https://semmelweis.hu/registrar/information/scholarships/semmelweis-pannonia-in-excellence-scholarship/",
generalCriteria: "En Afrique, SEULES la Namibie et l'Afrique du Sud sont éligibles — le Sénégal ne l'est pas. Études commencées au 1er semestre 2024/2025 ou après, au moins deux semestres actifs accomplis, non cumulable avec le Stipendium Hungaricum ni le programme Diaspora. Dépôt via l'interface Requests de Neptun, DATE LIMITE 15 OCTOBRE 2026."
}
},

// ---------------- ITALIE (8) ----------------
{
id: "dsu-lombardia-milano-statale",
data: {
title: "Borsa di studio DSU — Regione Lombardia (Università degli Studi di Milano)",
country: "Italie",
funding: "7 172 € (fuori sede, logé hors du domicile familial), 4 191 € (pendolare) ou 2 991 € (in sede). Pour les lauréats : exonération totale des frais universitaires ET un repas gratuit par jour du lundi au samedi au restaurant universitaire ; lauréats partiels : exonération de 50 %. Majorations jusqu'à +15 % en cas de fragilité économique et +40 % en situation de handicap.",
description: "En Lombardie la Région finance mais N'INSTRUIT PAS : chaque université publie son propre bando avec son calendrier. Cette fiche décrit celui de l'Université de Milan (Statale), doté de plus de 114 M€ à l'échelle régionale.",
status: "Ouverte",
isActive: true,
levels: ["Licence", "Master"],
officialWebsite: "https://www.unimi.it/en/study/financial-support/regional-scholarships",
generalCriteria: "Ouverte à toutes les nationalités, MAIS ATTRIBUÉE SUR REVENU et non au mérite : ISEE ≤ 26 887,93 € et ISPE ≤ 58 452,06 €. Pour une famille résidant hors d'Italie, il faut faire établir un ISEE Parificato, dont chaque justificatif doit être légalisé par l'ambassade d'Italie à Dakar — le Sénégal n'étant pas partie à la Convention de La Haye, l'apostille ne s'applique pas et aucune déclaration sur l'honneur n'est acceptée. Compter 2 à 3 mois. Exclus : masters professionnalisants, écoles de spécialisation médicale, doctorants déjà boursiers, temps partiel, redoublants. CYCLE 2026/2027 OUVERT DU 10 JUILLET AU 30 SEPTEMBRE 2026 ; classement définitif fin novembre 2026, premier versement de 50 % en décembre 2026."
}
},
{
id: "ardis-friuli-venezia-giulia",
data: {
title: "Bando unico per i benefici regionali — ARDiS Friuli-Venezia Giulia",
country: "Italie",
funding: "Bourse versée en plusieurs tranches, la première au plus tard le 31 décembre 2026, plus des contributions au logement et à la restauration. Les montants par catégorie figurent à l'article 17 du bando et ne sont pas repris sur les pages de synthèse.",
description: "Région aux SEUILS DE REVENU LES PLUS ÉLEVÉS D'ITALIE, ce qui en fait la plus accessible aux familles légèrement au-dessus des plafonds nationaux. Couvre Trieste et Udine.",
status: "Ouverte",
isActive: true,
levels: ["Licence", "Master"],
officialWebsite: "https://www.ardis.fvg.it/contenuti.php?view=page&id=268",
generalCriteria: "Ouverte à toutes les nationalités et PARTICULIÈREMENT FAVORABLE aux candidats africains : le bando prévoit explicitement l'ISEE universitario parificato pour les non-européens dont la famille réside à l'étranger, délivré GRATUITEMENT par les CAF conventionnés — ne pas payer d'intermédiaire privé. Conditions cumulatives : ISEE ≤ 28 339,88 € ET ISPE ≤ 61 608,48 €, calculés sur les revenus et le patrimoine 2024. Statut fuori sede : bail d'au moins 10 mois enregistré auprès du fisc. CYCLE OUVERT DEPUIS LE 15 JUILLET 2026, CLÔTURE LE 17 SEPTEMBRE 2026 À 13H00."
}
},
{
id: "edisu-pavia",
data: {
title: "Borsa di studio EDiSU Pavia",
country: "Italie",
funding: "Deux formules : jusqu'à 4 479 € avec logement en résidence universitaire et un repas par jour, ou jusqu'à 7 419 € sans logement mais avec les repas. Le pack logement + restauration réduit fortement le reste à charge.",
description: "Agence autonome de Pavie, distincte des agences régionales et à ne pas confondre avec EDISU Piemonte, qui est un autre organisme public avec ses propres montants.",
status: "Ouverte",
isActive: true,
levels: ["Licence", "Master", "Doctorat"],
officialWebsite: "https://en.unipv.it/en/education/bachelors-and-masters-degree-programs/fees-and-funding/financial-support",
generalCriteria: "Ouverte à toutes les nationalités, sur conditions de mérite ET de revenu (ISEE Parificato pour les familles résidant à l'étranger — voir la fiche Lombardie pour la procédure de légalisation à Dakar). L'Université de Pavie publie la méthode de calcul la plus détaillée d'Italie : revenus bruts 2025 convertis au taux moyen de la Banca d'Italia, plus 20 % du patrimoine, l'immobilier valorisé forfaitairement à 500 €/m². ATTENTION AU CALENDRIER DÉCALÉ : les documents ISEE sont à déposer avant le 22 octobre 2026, avec une pénalité de 165 € en cas de retard, alors que la bourse se clôt en août-septembre — il faut donc engager la procédure avant même de connaître le résultat de l'admission. Cycle 2026/2027 : formule avec logement close le 4 août 2026 ; FORMULE SANS LOGEMENT OUVERTE JUSQU'AU 15 SEPTEMBRE 2026 À 15H00."
}
},
{
id: "ergo-emilia-romagna",
data: {
title: "Borsa di studio ER.GO — Emilia-Romagna",
country: "Italie",
funding: "7 171,11 € (fuori sede), 4 190,71 € (pendolare) ou 2 890,16 € (in sede), plus l'exonération totale de la contribution universitaire et le remboursement de la taxe régionale de 140 €. Majorations de +15 % si l'ISEE est inférieur ou égal à 12 500 €, et de +20 % pour les étudiantes en filières STIM. Logement et restauration attribués dans le même concours.",
description: "L'un des dispositifs régionaux les mieux dotés d'Italie, avec plus de 160 M€ mobilisés ; couvre Bologne, Modène-Reggio, Parme et Ferrare.",
status: "Fermée",
isActive: true,
levels: ["Licence", "Master", "Doctorat"],
officialWebsite: "https://www.er-go.it/",
generalCriteria: "Ouverte à toutes les nationalités, sous condition d'ISEE ≤ 25 000 € (ISEE Parificato pour les familles à l'étranger — voir la fiche Lombardie). Une documentation économique simplifiée est prévue pour les étudiants venant de zones de conflit ou de crise humanitaire. Critère de mérite en crédits (CFU) pour les années suivantes. Cycle 2026/2027 clos le 24 août 2026 ; réouverture attendue vers juillet 2027."
}
},
{
id: "aliseo-liguria",
data: {
title: "Borsa di studio universitaria ALiSEO — Liguria",
country: "Italie",
funding: "Bourses jusqu'à 7 172 € selon le communiqué officiel de la Région, logement (nouveaux lits ouverts en 2026/27) et restauration inclus. Le détail par catégorie n'a pas pu être vérifié à la source.",
description: "Dispositif ligure couvrant l'Université de Gênes, avec des seuils ISEE relevés pour 2026/2027.",
status: "Fermée",
isActive: true,
levels: ["Licence", "Master"],
officialWebsite: "https://www.aliseo.liguria.it/benefici-economici-universitari/borsa-di-studio-universitaria/bando-2026-2027-istruzioni-per-luso/",
generalCriteria: "Ouverte à toutes les nationalités, AVEC UNE FACILITÉ PROCÉDURALE NOTABLE pour les non-européens : ils sont DISPENSÉS DE SPID et peuvent déposer avec leur passeport, et ALiSEO publie la liste des CAF habilités à établir l'ISEE parificato pour revenus exclusivement étrangers. Pièces exigées : attestation de préinscription, codice fiscale, pièce d'identité, documentation de revenus, IBAN italien ou SEPA, photo. Cycle clos le 31 juillet 2026 ; résultats pour les primo-entrants le 30 septembre 2026."
}
},
{
id: "adisu-puglia",
data: {
title: "Bando Benefici e Servizi ADISU Puglia",
country: "Italie",
funding: "7 172,00 € (fuori sede), 4 191,00 € (pendolare) ou 2 891,00 € (in sede), après revalorisation ISTAT de +1,4 %. Majorations de +20 % en filières STIM et de +15 % si l'ISEE est inférieur à la moitié du plafond. Logement et restauration inclus dans le concours.",
description: "Couvre Bari, Foggia, Lecce et le Polytechnique de Bari. Nouveauté 2026/2027 : l'accès à la restauration et au logement est étendu aux étudiants entrant en « semestre filtre » de Médecine, Odontologie et Vétérinaire.",
status: "Fermée",
isActive: true,
levels: ["Licence", "Master"],
officialWebsite: "https://press.regione.puglia.it/-/diritto-allo-studio-regione-puglia-approva-gli-indirizzi-per-il-bando-adisu-2026-2027",
generalCriteria: "Ouverte à toutes les nationalités : le texte prévoit des dérogations temporaires sur la production de justificatifs de revenus étrangers pour les étudiants internationaux et ceux issus de pays en conflit. Conditions : ISEE ≤ 26 000 € ET ISPE ≤ 56 000 €. ATTENTION : le bando a été approuvé et publié le 26 juin 2026, mais SA DATE DE CLÔTURE N'A PAS PU ÊTRE VÉRIFIÉE sur une source officielle accessible — vérifier directement sur adisupuglia.it avant de s'y fier."
}
},
{
id: "scuola-normale-superiore-phd",
data: {
title: "Corso di perfezionamento (PhD) — Scuola Normale Superiore",
country: "Italie",
funding: "18 848 € bruts par an (2026-2027), CONTRIBUTION LOGEMENT INCLUSE dans ce montant, plus des repas gratuits dans les structures de la SNS ou partenaires pendant toute la durée du cursus. Inscription et scolarité entièrement gratuites. REMBOURSEMENT DE VOYAGE JUSQU'À 1 000 € pour les candidats non-européens à l'arrivée.",
description: "L'une des bourses doctorales les mieux dotées d'Italie, environ 30 % au-dessus de la bourse doctorale standard, avec UNE PLACE RÉSERVÉE PAR COURS aux candidats titulaires d'un diplôme non italien — un avantage structurel rare pour un candidat africain.",
status: "Fermée",
isActive: true,
levels: ["Doctorat"],
officialWebsite: "https://www.sns.it/it/concorso-phd",
generalCriteria: "AUCUNE RESTRICTION DE NATIONALITÉ. Master obtenu dans les 5 ans précédant la date limite s'il a été délivré hors d'Italie ; équivalence appréciée par la commission. 34 places sur le site de Pise en Faculté de Sciences : Physique 7, Mathématiques 6, Méthodes computationnelles 6, Chimie 4, Technologies quantiques et nanosciences 6, Neurosciences 5. Deux sessions pour 2026/27, les 19 février et 22 juin 2026, toutes deux closes ; prochaine ouverture attendue vers janvier 2027."
}
},
{
id: "invest-your-talent-italy",
data: {
title: "Invest Your Talent in Italy (IYT)",
country: "Italie",
funding: "Bourse de 9 mois ; le montant n'est pas publié sur les pages officielles du MAECI ni sur le portail IYT, qui parlent seulement d'« une contribution ». Exonération de frais : non publiée.",
description: "Programme du ministère italien des Affaires étrangères couplant un master enseigné en anglais à un STAGE EN ENTREPRISE italienne — c'est cette composante professionnelle qui le distingue de la bourse MAECI classique. Domaines : ingénierie et technologies avancées, architecture et design, économie et management.",
status: "Fermée",
isActive: true,
levels: ["Master"],
officialWebsite: "https://www.esteri.it/en/servizi-opportunita/opportunita/borse-di-studio/per-cittadini-stranieri/progetti-speciali/invest-your-talent-in-italy/",
generalCriteria: "RÉSERVÉ À 18 PAYS PARTENAIRES ; en Afrique, SEULEMENT l'Égypte, l'Éthiopie et le Ghana. LE SÉNÉGAL N'EST PAS ÉLIGIBLE. Cycle 2026/2027 clos le 11 mai 2026 à 18h00 ; prochaine ouverture attendue vers mars-avril 2027."
}
},

// ---------------- ROUMANIE (5) ----------------
{
id: "auf-eugen-ionescu",
data: {
title: "Bourses de recherche doctorale et postdoctorale « Eugen Ionescu »",
country: "Roumanie",
funding: "Allocation mensuelle, voyage, logement et assurance, dont les montants ne sont pas publiés par l'AUF et sont à demander à bourses-ei@auf.org. Financement assuré par le ministère roumain des Affaires étrangères, contributeur principal, et le ministère de l'Éducation et de la Recherche ; deux universités roumaines cofinancent 10 bourses supplémentaires par an.",
description: "Créé au XIe Sommet de la Francophonie de Bucarest en 2006, ce programme finance un séjour de recherche de 3 mois dans plus de 30 universités roumaines d'accueil. TOUT LE DOSSIER SE DÉPOSE EN FRANÇAIS — c'est un avantage compétitif net pour un candidat sénégalais, et aucune année de roumain n'est requise.",
status: "Fermée",
isActive: true,
levels: ["Doctorat"],
officialWebsite: "https://www.auf.org/projet/bourses-de-recherche-doctorale-et-post-doctorale-eugen-ionescu/",
generalCriteria: "OUVERTE AU SÉNÉGAL, membre de l'OIF. Il faut être doctorant, post-doctorant ou enseignant-chercheur inscrit dans un établissement MEMBRE DE L'AUF situé dans un pays membre ou observateur de l'OIF, et obtenir au préalable une attestation d'accueil d'une institution roumaine. Dossier intégralement en français, en ligne uniquement : toute pièce manquante entraîne un rejet automatique et aucune pièce complémentaire n'est acceptée après validation. Cycle 2025-2026 clos le 30 novembre 2025 pour une mobilité du 1er mai au 31 juillet 2026 ; PROCHAIN APPEL ATTENDU VERS OCTOBRE 2026, à surveiller de près."
}
},
{
id: "auf-petrache-poenaru",
data: {
title: "Bourses de recherche « Petrache Poenaru »",
country: "Roumanie",
funding: "1 000 € PAR MOIS versés en lei roumains, plus l'exonération des frais de scolarité, le billet d'avion aller-retour, le transport international et l'assurance médicale. Le transport interne et les frais de visa restent à la charge du candidat.",
description: "Programme conjoint Politehnica Bucarest / AUF conçu comme la SUITE du programme « Eugen Ionescu » : il prolonge le parcours des chercheurs déjà passés par Politehnica. C'est le seul programme roumain identifié offrant une allocation à ce niveau.",
status: "Fermée",
isActive: true,
levels: ["Doctorat"],
officialWebsite: "https://www.auf.org/bourses-de-recherche-petrache-poenaru-appel-2026/",
generalCriteria: "OUVERTE AU SÉNÉGAL, membre de l'OIF. CONDITION BLOQUANTE : avoir été bénéficiaire d'une bourse « Eugen Ionescu » à Politehnica — c'est une seconde étape, pas une porte d'entrée. Exige aussi un français de niveau B2 minimum et 35 ans ou moins en décembre de l'année de candidature. Appel 2026 clos le 15 avril 2026, résultats le 10 mai, stage de 3 mois continus du 1er mai au 31 juillet ; appel annuel à partir de 2027. Contact : gina.stoica@upb.ro"
}
},
{
id: "politehnica-excellence-scholarship",
data: {
title: "POLITEHNICA Bucharest Excellence Scholarship",
country: "Roumanie",
funding: "Montant mensuel, exonération et logement non publiés sur les pages officielles. Programme pluriannuel courant de 2024 à 2029. Contact : international@upb.ro",
description: "Bourse propre de Politehnica, DISTINCTE de la bourse gouvernementale roumaine, réservée aux ressortissants de pays hors UE. La Maison de la Francophonie de Roumanie la présente comme orientée vers les PAYS FRANCOPHONES — un angle direct pour un candidat sénégalais.",
status: "Fermée",
isActive: true,
levels: ["Licence", "Master"],
officialWebsite: "https://international.upb.ro/education/learning-opportunities/scholarships-programs/politehnica-excellence-scholarship",
generalCriteria: "Ouverte à tous les pays hors UE, EEE et Suisse — le Sénégal est éligible. Conditions : moins de 35 ans au 31 décembre de l'année de nomination, moyenne minimale de 8/10 au baccalauréat, excellence académique démontrée (prix, olympiades) et engagement associatif. RECRUTEMENT PAR VOIE DIPLOMATIQUE : nomination via les ambassades de Roumanie et les ministères de l'Éducation des pays d'origine, pas de candidature directe. Calendrier du cycle en cours non publié. À combiner avec les filières francophones de Politehnica (FILS), qui dispensent de l'année préparatoire de roumain."
}
},
{
id: "bourse-george-darie",
data: {
title: "Bourse d'excellence « George Darie »",
country: "Roumanie",
funding: "Montant non publié.",
description: "Bourse d'excellence réservée aux étudiants de la FILIÈRE FRANCOPHONE de Politehnica (FILS). C'est une bourse d'aval : elle ne finance pas la venue en Roumanie, elle récompense un parcours francophone déjà engagé sur place.",
status: "Fermée",
isActive: true,
levels: ["Licence"],
officialWebsite: "https://international.upb.ro/education/learning-opportunities/scholarships-programs/george-darie",
generalCriteria: "Aucune restriction de nationalité, mais il faut être inscrit en licence FILIÈRE FRANÇAISE à Politehnica et justifier d'une moyenne générale d'au moins 9,00 sur les années antérieures. Réservée à la DERNIÈRE ANNÉE de licence. Dossier en 5 pièces. Cycle 2025-2026 : appel lancé le 31 octobre 2025, dépôt du 1er au 16 novembre, résultats le 26 novembre 2025 ; prochain appel attendu vers octobre-novembre 2026."
}
},
{
id: "unibuc-international-scholarships",
data: {
title: "Bourses et aides financières de l'Université de Bucarest",
country: "Roumanie",
funding: "RÉDUCTION DE 50 % DES FRAIS DE SCOLARITÉ pour les deux dispositifs de licence et master. Pour le doctorat, une bourse mensuelle de performance dont le montant est fixé chaque année par le Sénat de l'université, non publié. Ni logement ni allocation aux niveaux licence et master.",
description: "Trois dispositifs distincts réservés aux ressortissants non-européens payant des frais en devises. Le troisième, « soutien aux pays en développement », vise directement ce public : jusqu'à 10 étudiants par an. Ce sont des aides de MAINTIEN, pas d'accès — elles supposent une année déjà validée sur place.",
status: "Fermée",
isActive: true,
levels: ["Licence", "Master", "Doctorat"],
officialWebsite: "https://unibuc.ro/international/scholarships-and-financial-aid-offered-by-the-university-of-bucharest/?lang=en",
generalCriteria: "Réservée aux ressortissants NON-EUROPÉENS — le Sénégal est éligible, et le dispositif « pays en développement » le vise explicitement. Trois voies : performance académique licence/master (jusqu'à 10 % des internationaux inscrits, au moins une année achevée) ; performance doctorat (jusqu'à 15 % des doctorants, articles publiés dans des revues indexées Web of Science, SCOPUS ou ISI) ; pays en développement (jusqu'à 10 bénéficiaires, moyenne de l'année précédente d'au moins 7). DÉPÔT EN JUILLET précédant l'année universitaire ; échéance de juillet 2026 passée, prochaine en juillet 2027."
}
},

// ---------------- RUSSIE (4) ----------------
{
id: "quota-gouvernement-russe",
data: {
title: "Quota du Gouvernement de la Fédération de Russie",
country: "Russie",
funding: "Frais de scolarité INTÉGRALEMENT pris en charge par le budget fédéral, versés directement à l'université. Allocation mensuelle d'environ 1 484 à 1 600 ₽ (soit 15 à 20 USD). Le logement en résidence n'est PAS gratuit : tarif réduit de 1 600 à 3 769 ₽/mois selon l'université, soit 20 à 150 € d'après Rossotrudnichestvo. L'assurance maladie (5 500 à 6 000 ₽/an) et le voyage ne sont PAS couverts.",
description: "C'est le CANAL PRINCIPAL, distinct d'Open Doors : la première sélection se fait dans le pays d'origine par l'ambassade, la seconde par les universités russes. Le candidat choisit 1 à 6 universités sur un dossier unique. Plus de 500 universités participantes.",
status: "Fermée",
isActive: true,
levels: ["Licence", "Master", "Doctorat"],
officialWebsite: "https://education-in-russia.com/",
generalCriteria: "LE SÉNÉGAL A REÇU 130 BOURSES POUR 2026-2027, chiffre publié par le ministère sénégalais de l'Enseignement supérieur. AVERTISSEMENT INDISPENSABLE : l'allocation mensuelle NE COUVRE MÊME PAS le loyer de la résidence universitaire — c'est une exonération de frais de scolarité, PAS une bourse de subsistance. Un financement personnel ou familial est indispensable pour la totalité du coût de la vie. L'année préparatoire de russe est optionnelle, financée par la bourse, mais ÉLIMINATOIRE : l'échec aux examens finaux entraîne la perte du financement. Circuit sénégalais : inscription en ligne PUIS dépôt d'un dossier physique à la Direction des Bourses, 52 rue Saint-Michel, Dakar, avec une semaine d'écart entre les deux échéances ; certificats médicaux (VIH, hépatites B et C, tuberculose) et passeport valable 18 mois au-delà du visa. Cycle 2027-2028 : dates définitives publiées en septembre 2026, échéance annoncée au 15 janvier 2027 pour les pays hors CEI."
}
},
{
id: "hse-into-olympiad",
data: {
title: "HSE International Olympiad (INTO)",
country: "Russie",
funding: "Première place : EXONÉRATION TOTALE des frais sur les 4 années, financée par l'État. Deuxième et troisième places : réduction jusqu'à 75 %. L'avantage est acquis pour toute la durée des études, sans réévaluation annuelle ; le diplôme reste valable 2 ans.",
description: "Olympiade internationale de la HSE en 16 matières, à sa 9e édition — projet phare de l'université, distinct d'Open Doors et du quota gouvernemental.",
status: "Fermée",
isActive: true,
levels: ["Licence"],
officialWebsite: "https://olymp.hse.ru/en/inter/",
generalCriteria: "Ouverte à tous les ressortissants étrangers et aux apatrides, pour les élèves de dernières années du secondaire. Les dates du cycle en cours n'étaient pas publiées en anglais au 30/08/2026 — la page annonce « will be published here soon ». Dernier calendrier connu (cycle 2025) : candidatures du 26 août au 26 octobre, épreuves du 5 au 15 novembre. À SURVEILLER DE TRÈS PRÈS : par analogie, la fenêtre 2026 pourrait être ouverte en ce moment même."
}
},
{
id: "hse-merit-scholarships",
data: {
title: "Bourses au mérite HSE University",
country: "Russie",
funding: "Licence : 70 % des frais à partir de 170 points aux examens d'entrée, 50 % entre 150 et 169, 25 % entre 130 et 149. Master : 50 % à partir de 75 points au concours de portfolio, 25 % entre 60 et 74. 25 % pour les diplômés de l'année préparatoire HSE, 10 % pour ceux de la Summer University. NON CUMULABLES — une seule au choix. Aucune allocation, aucun logement.",
description: "Réductions sur frais de scolarité pour les candidats admis en filière payante — ce n'est pas une bourse complète.",
status: "Fermée",
isActive: true,
levels: ["Licence", "Master"],
officialWebsite: "https://www.hse.ru/en/news/admission/229679392.html",
generalCriteria: "Ouverte à toutes les nationalités. Cycle 2026 clos : inscriptions payantes du 20 juin au 3 août 2026 en licence, jusqu'au 8 août en master, avec inscription physique obligatoire du 20 au 31 août 2026. La HSE annonce l'ouverture du prochain cycle sur quota pour l'automne 2026."
}
},
{
id: "spbu-open-olympiad",
data: {
title: "Olympiade internationale ouverte de l'Université d'État de Saint-Pétersbourg",
country: "Russie",
funding: "Frais de scolarité des lauréats financés sur le budget fédéral. La bourse gouvernementale associée couvre les frais, une allocation académique mensuelle et un tarif réduit de résidence.",
description: "Voie d'accès propre à l'Université d'État de Saint-Pétersbourg, avec épreuves de russe à l'oral et à l'écrit et évaluation de portfolio.",
status: "Fermée",
isActive: true,
levels: ["Licence", "Master"],
officialWebsite: "https://english.spbu.ru/news-events/news/admission-russian-government-scholarship-opens-international-applicants",
generalCriteria: "Ouverte à toutes les nationalités. Les épreuves se déroulent EN RUSSE, ce qui en fait une voie difficile pour un primo-candidat francophone. Cycle 2026/2027 : ouverture le 12 novembre 2025, clôture le 6 février 2026, résultats au plus tard le 13 mars 2026, dépôt via l'espace personnel cabinet.spbu.ru. Cycle 2027/2028 non publié."
}
},

// ---------------- SUISSE (9) ----------------
{
id: "eth-esop",
data: {
title: "ETH Excellence Scholarship & Opportunity Programme (ESOP)",
country: "Suisse",
funding: "12 000 CHF par semestre, PORTÉ À 13 500 CHF PAR SEMESTRE à partir du semestre d'automne 2027 — soit environ 2 250 CHF par mois — ET exonération TOTALE des frais de scolarité pour la durée réglementaire du master. Logement, assurance et billet d'avion non couverts.",
description: "Environ 60 bourses par an, adossées à la ETH Zurich Foundation, avec mentorat et réseau d'anciens. C'EST LA SEULE BOURSE DE MASTER VÉRITABLEMENT COMPLÈTE de l'offre suisse : allocation vivable et plus aucun frais de scolarité.",
status: "Ouverte",
isActive: true,
levels: ["Master"],
officialWebsite: "https://ethz.ch/students/en/studies/financial/scholarships/excellencescholarship.html",
generalCriteria: "AUCUNE RESTRICTION DE NATIONALITÉ — le vrai filtre est académique : il faut un résultat de licence dans les 10 % SUPÉRIEURS de la promotion. Il ne faut pas déjà détenir un master ni être inscrit en master à l'ETH, et la candidature doit être déposée dans la PREMIÈRE fenêtre d'admission, avec un pré-projet de mémoire. Programmes MAS exclus. FENÊTRE DU 1er AU 30 NOVEMBRE 2026 À 23H59 via eApply, pour une rentrée à l'automne 2027 ; entretien en février, décisions fin mars 2027."
}
},
{
id: "epfl-master-excellence-fellowships",
data: {
title: "EPFL Master Excellence Fellowships",
country: "Suisse",
funding: "10 000 CHF par semestre, dans la limite de 4 semestres, soit jusqu'à 40 000 CHF — environ 1 667 CHF par mois. LOGEMENT ÉTUDIANT RÉSERVÉ ET GARANTI pour les candidats externes, ce qui neutralise le poste de dépense le plus lourd à Lausanne. L'exonération des frais de scolarité n'est pas annoncée : prévoir un complément.",
description: "Attribuée sur l'excellence académique mais aussi sur les réalisations en recherche, l'entrepreneuriat et l'engagement civique — un profil qui va au-delà des seules notes. Le logement garanti est ce qui la distingue vraiment des autres bourses partielles suisses.",
status: "Ouverte",
isActive: true,
levels: ["Master"],
officialWebsite: "https://www.epfl.ch/education/master/master-excellence-fellowships/how-to-apply/",
generalCriteria: "Aucune restriction de nationalité : toute personne candidatant à un master EPFL est éligible, sauf les détenteurs d'un master ou les personnes déjà inscrites en master. Une seule candidature par an, en cochant la case dédiée sur le formulaire d'admission. Renouvellement conditionné à 50 crédits ECTS et une moyenne de 5,0/6,0 après la première année. CALENDRIER DES CANDIDATS À DIPLÔME ÉTRANGER — celui qui concerne le Sénégal : première session le 15 DÉCEMBRE 2026, seconde le 31 mars 2027 ; notifications début avril puis début à mi-juin."
}
},
{
id: "epfl-edic-doctoral",
data: {
title: "EPFL — Programme doctoral EDIC (informatique et systèmes de communication)",
country: "Suisse",
funding: "CE N'EST PAS UNE BOURSE MAIS UN CONTRAT DE TRAVAIL SALARIÉ : 55 225 CHF bruts par an au 1er janvier 2026, avec affiliation sociale. Aucune ambiguïté sur la capacité à vivre. Frais de scolarité doctoraux, assurance et billet d'avion non détaillés sur la page.",
description: "Programme doctoral phare de l'EPFL en informatique : admission d'abord au programme, puis choix du laboratoire après une année de cours et de rotations. Le statut de salarié, et non de boursier, change tout sur le plan financier et administratif.",
status: "Ouverte",
isActive: true,
levels: ["Doctorat"],
officialWebsite: "https://www.epfl.ch/education/phd/edic-computer-and-communication-sciences/edic-for-applicants",
generalCriteria: "Aucune restriction de nationalité. Master requis. DEUX ÉCHÉANCES : 1er DÉCEMBRE 2026 et 15 avril 2027."
}
},
{
id: "uzh-candoc-grant",
data: {
title: "UZH Candoc Grant (ex-Forschungskredit)",
country: "Suisse",
funding: "Prise en charge du salaire au barème de l'Université de Zurich : 50 404 CHF la première année, 52 011 CHF la deuxième, 53 618 CHF les troisième et quatrième, majoré d'environ 15 % de charges patronales. Plus jusqu'à 10 000 CHF de frais de matériel et de voyage. Durée de 12 mois dans la plupart des facultés, jusqu'à 24 mois en lettres et sciences sociales.",
description: "Fonds de recherche interne de l'UZH finançant le salaire du doctorant sur son propre projet. C'est une consolidation de parcours, pas une porte d'entrée. Non cumulable avec un financement FNS Doc.CH.",
status: "Fermée",
isActive: true,
levels: ["Doctorat"],
officialWebsite: "https://www.research.uzh.ch/en/funding/phd/uzhcandoc.html",
generalCriteria: "Aucune restriction de nationalité, MAIS CONDITION BLOQUANTE : il faut être déjà inscrit à l'UZH comme doctorant, ou disposer d'une confirmation ferme d'un futur directeur de thèse. Inaccessible depuis l'étranger sans avoir d'abord décroché un encadrant — à considérer comme une bourse de seconde étape. Taux d'occupation de 80 % exigé, dérogation possible pour charge de famille. Appel 2026 clos le 2 février 2026 ; PROCHAIN APPEL ANNONCÉ POUR FÉVRIER 2027. À noter : l'UZH n'accorde AUCUNE aide aux étudiants internationaux de master ne détenant pas une licence suisse."
}
},
{
id: "iheid-scholarships",
data: {
title: "Bourses de l'Institut de hautes études internationales et du développement (IHEID)",
country: "Suisse",
funding: "MASTER : bourse totale ou partielle plafonnée à 20 000 CHF, accordée pour deux ans et cumulable avec une réduction des frais de scolarité, qui s'élèvent à 8 000 CHF par an pour les non-résidents. DOCTORAT : toute offre d'admission s'accompagne d'un paquet de financement sur quatre ans — 20 000 CHF par an versés à raison de 2 000 CHF par mois de septembre à juin, plus des frais réduits (3 000 CHF la première année, 1 000 CHF ensuite).",
description: "Institut spécialisé en relations internationales et études du développement, au cœur de la Genève internationale — ONU, OMC, CICR. IL EXISTE DES BOURSES SPÉCIFIQUEMENT RÉSERVÉES AUX RESSORTISSANTS D'AFRIQUE ET DU MOYEN-ORIENT, ainsi que des bourses réservées à 12 universités partenaires en Afrique, Asie et Amérique latine.",
status: "Ouverte",
isActive: true,
levels: ["Master", "Doctorat"],
officialWebsite: "https://www.graduateinstitute.ch/specific-scholarships",
generalCriteria: "LA MIEUX CIBLÉE SUR L'AFRIQUE DE TOUTE L'OFFRE SUISSE. Sélection sur l'excellence académique ET le besoin financier démontré. PIÈGE DE CALENDRIER À NE PAS MANQUER : la demande d'aide financière pour le master doit impérativement être déposée EN MÊME TEMPS que la candidature à l'admission, dans la session du 15 JANVIER 2027 — c'est la SEULE session qui ouvre droit à l'aide financière, l'Institut avertit qu'on ne peut plus la demander ensuite. Les sessions du 1er mars et du 15 avril 2027 n'y donnent pas droit. Doctorants candidats à l'ESKAS : 15 octobre 2026. NUANCE LINGUISTIQUE IMPORTANTE : les cours sont dispensés principalement EN ANGLAIS et un niveau C1 certifié est OBLIGATOIRE à l'admission (TOEFL 100, IELTS 7.0 ou Cambridge C1) ; en revanche les travaux et devoirs peuvent être rendus en anglais OU EN FRANÇAIS, avantage rare pour un francophone. Interdiction formelle de contacter directement les donateurs."
}
},
{
id: "unige-excellence-master-fellowships",
data: {
title: "Excellence Master Fellowships — Université de Genève",
country: "Suisse",
funding: "10 000 à 15 000 CHF par an, sans obligation d'enseignement, soit environ 833 à 1 250 CHF par mois. La page officielle NE MENTIONNE AUCUNE exonération des frais de scolarité, aucun logement, aucune assurance et aucun billet d'avion — considérer qu'ils ne sont pas couverts.",
description: "Réservée aux masters de la Faculté des sciences : astronomie, biologie, chimie et biochimie, informatique, mathématiques, physique, sciences pharmaceutiques et sciences de la Terre.",
status: "Fermée",
isActive: true,
levels: ["Master"],
officialWebsite: "https://www.unige.ch/sciences/en/enseignements/formations/masters/excellencemasterfellowships",
generalCriteria: "Aucune restriction de nationalité. Il faut être « parmi les meilleurs de sa promotion », remplir les conditions d'admission du master visé et ne pas avoir déjà commencé un master dans la Faculté. AVERTISSEMENT FINANCIER : c'est une BOURSE D'APPOINT en Suisse, pays au coût de la vie le plus élevé du catalogue. Partir à Genève avec cette seule bourse mettrait un étudiant en difficulté immédiate — elle n'a de sens qu'adossée à un second financement ou à une aide familiale. Dernière échéance publiée : 28 février 2026 pour une rentrée le 14 septembre 2026 ; celle du cycle suivant n'était pas publiée au 30/08/2026, attendue vers fin février 2027."
}
},
{
id: "unil-master-grants",
data: {
title: "UNIL Master's Grants — Université de Lausanne",
country: "Suisse",
funding: "Montant NON PUBLIÉ : le portail officiel de candidature n'est pas consultable et aucune page accessible ne le chiffre. À confirmer par téléphone au +41 21 692 40 10 avant de s'engager.",
description: "Bourses destinées spécifiquement aux TITULAIRES D'UN DIPLÔME D'UNE UNIVERSITÉ ÉTRANGÈRE souhaitant faire un master à l'UNIL. L'UNIL enseigne en français, ce qui en fait avec Genève et Fribourg l'une des portes d'entrée linguistiquement naturelles pour un public sénégalais.",
status: "Ouverte",
isActive: true,
levels: ["Master"],
officialWebsite: "https://www.unil.ch/central/en/home/menuinst/etudier/aides-financieres.html",
generalCriteria: "Le programme cible précisément les diplômés d'universités étrangères — un candidat sénégalais est dans le public visé. Il faut satisfaire aux conditions d'admission du master visé. ÉCHÉANCE ANNUELLE AU 1er NOVEMBRE 2026. Réserve à connaître : le montant n'a pas pu être vérifié à la source, seuls des agrégateurs le citent — ne pas construire un budget dessus sans confirmation écrite de l'université."
}
},
{
id: "unifr-research-scholarships",
data: {
title: "Bourses de recherche de l'Université de Fribourg",
country: "Suisse",
funding: "Montant mensuel NON PUBLIÉ sur la page officielle. Durée : 5 mois pour les doctorants, 3 mois pour les post-doctorants.",
description: "Bourses de séjour de recherche de courte durée pour chercheurs résidant à l'étranger, adossées à une collaboration avec un professeur de Fribourg — la seule université suisse officiellement bilingue français-allemand.",
status: "Fermée",
isActive: true,
levels: ["Doctorat"],
officialWebsite: "https://www.unifr.ch/studies/en/mobility/incoming/visitingscholars/research-scholarships-of-the-university-of-fribourg/",
generalCriteria: "Aucune restriction de nationalité, et la CONDITION DE RÉSIDENCE À L'ÉTRANGER joue en faveur des candidats africains. Il faut collaborer avec un professeur de l'Unifr, présenter un projet et justifier la nécessité de le mener à Fribourg. Deux échéances : 28 février pour un séjour débutant au plus tôt le 1er septembre suivant, 30 juin pour un séjour débutant au plus tôt le 1er février suivant ; les liens de candidature sont mis en ligne le 1er novembre et le 1er avril. PROCHAIN DÉPÔT À PARTIR DU 1er NOVEMBRE 2026, échéance 28 février 2027. Le montant n'étant pas publié, se renseigner à international-scholarship@unifr.ch avant de s'engager."
}
},
{
id: "zeno-karl-schindler-master-thesis",
data: {
title: "Master Thesis Grant — Fondation Zeno Karl Schindler",
country: "Suisse",
funding: "2 000 CHF par mois pendant 3 à 6 mois, plus un billet aller-retour en classe économique (avion ou train). NE COUVRE EXPLICITEMENT NI les frais d'inscription, NI les frais de scolarité, NI les frais administratifs.",
description: "Finance un mémoire de master mené en collaboration entre deux universités de pays différents, dont l'une obligatoirement en Suisse. Ciblage disciplinaire étroit : ingénierie (génie de l'environnement compris), disciplines médiévales, et humanités numériques à l'intersection des études médiévales et de l'informatique.",
status: "Ouverte",
isActive: true,
levels: ["Master"],
officialWebsite: "https://zenokarlschindler-foundation.ch/master-thesis-grant/",
generalCriteria: "Aucune restriction de nationalité, MAIS il faut déjà être inscrit en master : c'est une bourse de mobilité de fin de parcours, pas une bourse d'accès aux études. Exige d'excellents résultats (environ les 10 à 15 % de tête) et une mobilité entre deux universités de pays différents, l'une en Suisse ; les étudiants en programme d'échange inter-universitaire sont exclus. RÈGLE STRICTE : en cas de refus, il est IMPOSSIBLE de recandidater à la même bourse. Échéances les 1er mai et 1er NOVEMBRE 2026 à 23h59 heure suisse."
}
}

];

// ==========================================================
// D. Programmes — rattachent une bourse à une université DÉJÀ en base.
//    Construits après résolution des identifiants ; une université
//    introuvable ne bloque rien, ses programmes sont simplement omis.
// ==========================================================

function buildPrograms(uni) {
const P = [];
const add = (uniKey, scholarshipId, data) => {
if (!uni[uniKey]) return;
P.push({
id: `${uni[uniKey]}__${scholarshipId}`,
data: { universityId: uni[uniKey], scholarshipId, isActive: true, ...data }
});
};

// --- Hongrie
add("corvinus", "corvinus-scholarship", {
level: "Master", deadline: "Cycle rentrée 2026 clos le 13 août 2026 — prochain cycle attendu en novembre 2026",
applicationUrl: "https://www.uni-corvinus.hu/main-page/life-at-corvinus/scholarship/corvinus-scholarship-2/?lang=en",
language: "Anglais", duration: "Jusqu'à 4 semestres", coverage: "Exonération totale des frais de scolarité",
description: "Trois programmes seulement — MSc Management and Leadership (CEMS), MSc Finance, International MBA — et aucune restriction de nationalité : la meilleure porte d'entrée hongroise pour un Sénégalais.", status: "Fermée"
});
add("semmelweis", "semmelweis-pannonia-in-excellence", {
level: "Licence / Master", deadline: "15 octobre 2026, via l'interface Requests de Neptun",
applicationUrl: "https://semmelweis.hu/registrar/information/scholarships/semmelweis-pannonia-in-excellence-scholarship/",
language: "Anglais / Allemand", duration: "Annuelle", coverage: "900 000 à 2 900 000 HUF par an selon la filière, en 12 mensualités",
description: "Réservée aux étudiants DÉJÀ inscrits à Semmelweis. En Afrique, seules la Namibie et l'Afrique du Sud sont éligibles.", status: "Ouverte"
});
add("debrecen", "ud-international-scholarship", {
level: "Licence / Master", deadline: "Cycle 2026/27 clos le 15 juin 2026 — prochain cycle attendu janvier 2027",
applicationUrl: "https://edu.unideb.hu/p/ud-international-scholarship",
language: "Anglais", duration: "Durée du cursus", coverage: "Jusqu'à 90 % des frais (30 % en médecine et dentisterie), assurance incluse",
description: "89 pays éligibles mais, en Afrique, seulement l'Égypte, le Kenya, Maurice, la Namibie, le Nigeria et l'Afrique du Sud.", status: "Fermée"
});
add("debrecen", "fao-hungarian-government-scholarship", {
level: "Master", deadline: "Cycle 2026/27 clos le 28 février 2026 — prochain appel attendu janvier 2027",
applicationUrl: "https://www.fao.org/europe/events/detail/fao-hungarian-government-scholarship-programme-2026-2027/en",
language: "Anglais", duration: "Durée du master", coverage: "Scolarité, logement, subsistance et assurance maladie",
description: "L'Université de Debrecen accueille le master Plant Protection de ce programme conjoint FAO / gouvernement hongrois.", status: "Fermée"
});
add("szeged", "szte-start-scholarship", {
level: "Licence / Master", deadline: "Cycle 2026/27 clos le 30 avril 2026 — prochain cycle attendu début 2027",
applicationUrl: "https://u-szeged.hu/prospective-students/szte-start-scholarship/szte-start-scholarship",
language: "Anglais", duration: "Versement unique", coverage: "900 € en une fois, aide au démarrage",
description: "12 bourses par an, sans restriction de nationalité. Aide à l'installation, pas un financement d'études.", status: "Fermée"
});

// --- Roumanie
add("unstpb", "politehnica-excellence-scholarship", {
level: "Licence / Master", deadline: "Calendrier non publié — recrutement par voie diplomatique via les ambassades de Roumanie",
applicationUrl: "https://international.upb.ro/education/learning-opportunities/scholarships-programs/politehnica-excellence-scholarship",
language: "Français / Anglais / Roumain selon la filière", duration: "Durée du cursus", coverage: "Non publié",
description: "Bourse propre de Politehnica, orientée pays francophones. À combiner avec les filières francophones FILS, qui dispensent de l'année préparatoire de roumain.", status: "Fermée"
});
add("unstpb", "bourse-george-darie", {
level: "Licence", deadline: "Appel annuel en octobre-novembre — cycle 2025-2026 clos le 16 novembre 2025",
applicationUrl: "https://international.upb.ro/education/learning-opportunities/scholarships-programs/george-darie",
language: "Français", duration: "Dernière année de licence", coverage: "Non publié",
description: "Réservée à la filière francophone FILS, dernière année, moyenne d'au moins 9,00. Bourse d'aval, pas d'accès.", status: "Fermée"
});
add("unstpb", "auf-petrache-poenaru", {
level: "Doctorat", deadline: "Appel 2026 clos le 15 avril 2026 — appel annuel à partir de 2027",
applicationUrl: "https://www.auf.org/bourses-de-recherche-petrache-poenaru-appel-2026/",
language: "Français", duration: "3 mois continus, du 1er mai au 31 juillet", coverage: "1 000 €/mois, scolarité, billet d'avion, assurance médicale",
description: "Réservée aux anciens boursiers Eugen Ionescu de Politehnica. Français B2 exigé, 35 ans maximum.", status: "Fermée"
});
add("unstpb", "auf-eugen-ionescu", {
level: "Doctorat", deadline: "Cycle 2025-2026 clos le 30 novembre 2025 — prochain appel attendu vers octobre 2026",
applicationUrl: "https://www.auf.org/projet/bourses-de-recherche-doctorale-et-post-doctorale-eugen-ionescu/",
language: "Français", duration: "3 mois", coverage: "Allocation, voyage, logement et assurance — montants non publiés",
description: "Politehnica fait partie des plus de 30 universités roumaines d'accueil. Dossier intégralement en français, aucune année de roumain requise.", status: "Fermée"
});
add("unibuc", "auf-eugen-ionescu", {
level: "Doctorat", deadline: "Cycle 2025-2026 clos le 30 novembre 2025 — prochain appel attendu vers octobre 2026",
applicationUrl: "https://www.auf.org/projet/bourses-de-recherche-doctorale-et-post-doctorale-eugen-ionescu/",
language: "Français", duration: "3 mois", coverage: "Allocation, voyage, logement et assurance — montants non publiés",
description: "L'Université de Bucarest fait partie des universités roumaines d'accueil de ce programme francophone financé par l'État roumain.", status: "Fermée"
});
add("unibuc", "unibuc-international-scholarships", {
level: "Licence / Master / Doctorat", deadline: "Dépôt en juillet précédant l'année universitaire — échéance de juillet 2026 passée, prochaine en juillet 2027",
applicationUrl: "https://unibuc.ro/international/scholarships-and-financial-aid-offered-by-the-university-of-bucharest/?lang=en",
language: "Roumain / Anglais selon le programme", duration: "Une année universitaire", coverage: "Réduction de 50 % des frais en licence et master ; bourse mensuelle de performance en doctorat",
description: "Trois dispositifs pour non-Européens, dont un « soutien aux pays en développement » limité à 10 bénéficiaires par an. Aides de maintien : une année doit déjà être validée sur place.", status: "Fermée"
});

// --- Russie
add("hse", "hse-into-olympiad", {
level: "Licence", deadline: "Dates du cycle en cours non publiées — dernier calendrier connu : 26 août au 26 octobre",
applicationUrl: "https://olymp.hse.ru/en/inter/",
language: "Anglais", duration: "4 ans", coverage: "Exonération totale des frais pour la 1re place, jusqu'à 75 % pour les 2e et 3e",
description: "Olympiade en 16 matières, 9e édition. L'avantage est acquis pour toute la durée des études, sans réévaluation annuelle.", status: "Fermée"
});
add("hse", "hse-merit-scholarships", {
level: "Licence / Master", deadline: "Cycle 2026 clos — inscriptions du 20 juin au 3 août 2026 (licence) et 8 août (master)",
applicationUrl: "https://www.hse.ru/en/news/admission/229679392.html",
language: "Anglais / Russe selon le programme", duration: "Durée du cursus", coverage: "Réduction de 25 à 70 % des frais selon les points obtenus",
description: "Réductions pour les admis en filière payante : ni allocation, ni logement. Non cumulables entre elles.", status: "Fermée"
});
add("hse", "quota-gouvernement-russe", {
level: "Licence / Master / Doctorat", deadline: "Cycle 2027-2028 : dates définitives publiées en septembre 2026, échéance annoncée au 15 janvier 2027 hors CEI",
applicationUrl: "https://education-in-russia.com/",
language: "Russe / Anglais selon le programme", duration: "Durée du cursus, plus une éventuelle année préparatoire de russe",
coverage: "Scolarité intégrale + allocation d'environ 1 500 ₽/mois. Logement à tarif réduit mais NON gratuit, assurance et voyage à la charge de l'étudiant",
description: "La HSE fournit une place en résidence à tous les étudiants du quota. Rappel : l'allocation ne couvre pas le loyer — prévoir un financement personnel pour la vie courante.", status: "Fermée"
});

// --- Suisse
add("eth", "eth-esop", {
level: "Master", deadline: "1er au 30 novembre 2026 à 23h59 via eApply, pour une rentrée à l'automne 2027",
applicationUrl: "https://ethz.ch/students/en/studies/financial/scholarships/excellencescholarship.html",
language: "Anglais", duration: "3 ou 4 semestres", coverage: "12 000 CHF/semestre (13 500 CHF dès l'automne 2027) + exonération totale des frais",
description: "La seule bourse de master suisse véritablement complète. Environ 60 par an. Il faut être dans les 10 % supérieurs de sa promotion de licence.", status: "Ouverte"
});
add("epfl", "epfl-master-excellence-fellowships", {
level: "Master", deadline: "Candidats à diplôme étranger : 15 décembre 2026 (1re session) ou 31 mars 2027 (2e session)",
applicationUrl: "https://www.epfl.ch/education/master/master-excellence-fellowships/how-to-apply/",
language: "Anglais / Français selon le programme", duration: "Jusqu'à 4 semestres", coverage: "10 000 CHF/semestre + logement étudiant réservé et garanti",
description: "Le logement garanti neutralise le poste de dépense le plus lourd à Lausanne. Prévoir tout de même un complément : l'exonération des frais n'est pas annoncée.", status: "Ouverte"
});
add("epfl", "epfl-edic-doctoral", {
level: "Doctorat", deadline: "1er décembre 2026 ou 15 avril 2027",
applicationUrl: "https://www.epfl.ch/education/phd/edic-computer-and-communication-sciences/edic-for-applicants",
language: "Anglais", duration: "Durée du doctorat", coverage: "Contrat salarié de 55 225 CHF bruts par an, avec affiliation sociale",
description: "Ce n'est pas une bourse mais un emploi : admission d'abord au programme, choix du laboratoire après une année de cours et de rotations.", status: "Ouverte"
});
add("uzh", "uzh-candoc-grant", {
level: "Doctorat", deadline: "Appel 2026 clos le 2 février 2026 — prochain appel annoncé pour février 2027",
applicationUrl: "https://www.research.uzh.ch/en/funding/phd/uzhcandoc.html",
language: "Anglais / Allemand", duration: "12 mois, jusqu'à 24 en lettres et sciences sociales", coverage: "Salaire de 50 404 à 53 618 CHF/an + jusqu'à 10 000 CHF de frais de recherche",
description: "Exige d'être DÉJÀ inscrit à l'UZH ou de disposer d'une confirmation ferme d'un directeur de thèse. Bourse de seconde étape, inaccessible depuis l'étranger sans encadrant.", status: "Fermée"
});

return P;
}

function log(el, message, cls = "") {
el.classList.add("is-visible");
const line = document.createElement("div");
if (cls) line.className = cls;
line.textContent = message;
el.appendChild(line);
el.scrollTop = el.scrollHeight;
}

let lastPlan = null;

const analyzeBtn = document.getElementById("analyzeBtn");
const analyzeLog = document.getElementById("analyzeLog");
const writeBtn = document.getElementById("writeBtn");
const writeLog = document.getElementById("writeLog");
const verifyBtn = document.getElementById("verifyBtn");
const verifyLog = document.getElementById("verifyLog");

// ==========================================================
// Étape 1 — analyse (lecture seule)
// ==========================================================

analyzeBtn.addEventListener("click", async () => {

analyzeBtn.disabled = true;
analyzeLog.innerHTML = "";
lastPlan = null;

try {

let blocking = false;

// --- 1a. Bourses à corriger, résolues par titre avec priorité à
// l'égalité exacte (leçon du lot 20).
log(analyzeLog, `Résolution des ${SCHOLARSHIP_UPDATES.length} bourses à corriger...`);

const scholarshipsSnap = await getDocs(collection(db, "scholarships"));
const existing = scholarshipsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
const existingIds = new Set(existing.map((s) => s.id));

const updates = [];

for (const u of SCHOLARSHIP_UPDATES) {
const matches = existing.filter((s) => u.match(s.title));
const exacts = u.exact ? matches.filter((s) => normalize(s.title) === normalize(u.exact)) : [];
let retenue = null;

if (exacts.length === 1) {
retenue = exacts[0];
if (matches.length > 1) log(analyzeLog, `"${u.label}" : ${matches.length} titres contiennent le motif, départagés par égalité exacte.`, "warn");
} else if (exacts.length > 1) {
log(analyzeLog, `ERREUR : ${exacts.length} bourses portent EXACTEMENT le titre "${u.exact}" — doublon en base.`, "err");
blocking = true;
continue;
} else if (matches.length === 1) {
retenue = matches[0];
} else if (matches.length === 0) {
log(analyzeLog, `AVERTISSEMENT : "${u.label}" introuvable — correction ignorée.`, "warn");
continue;
} else {
log(analyzeLog, `ERREUR : ${matches.length} bourses correspondent à "${u.label}" et aucune ne porte le titre exact attendu :`, "err");
matches.forEach((m) => log(analyzeLog, `  - ${m.id} ("${m.title}")`, "err"));
blocking = true;
continue;
}

updates.push({ id: retenue.id, label: retenue.title, patch: u.patch });
log(analyzeLog, `"${u.label}" résolue : ${retenue.id} ("${retenue.title}").`, "ok");
}

// --- 1b. Universités à relier, résolues par nom.
log(analyzeLog, "");
log(analyzeLog, `Résolution des ${UNIVERSITY_LOOKUPS.length} universités à relier...`);

const universitiesSnap = await getDocs(collection(db, "universities"));
const universities = universitiesSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
const uni = {};

for (const u of UNIVERSITY_LOOKUPS) {
const matches = universities.filter((x) => u.match(x.name));
if (matches.length === 0) {
log(analyzeLog, `AVERTISSEMENT : "${u.label}" introuvable — ses programmes seront omis.`, "warn");
} else if (matches.length > 1) {
log(analyzeLog, `ERREUR : ${matches.length} universités correspondent à "${u.label}" — ambigu :`, "err");
matches.forEach((m) => log(analyzeLog, `  - ${m.id} ("${m.name}")`, "err"));
blocking = true;
} else {
uni[u.key] = matches[0].id;
log(analyzeLog, `"${u.label}" résolue : ${matches[0].id}.`, "ok");
}
}

if (blocking) {
log(analyzeLog, "");
log(analyzeLog, "Ambiguïté(s) détectée(s) — corriger avant l'étape 2. Aucune écriture n'a eu lieu.", "err");
return;
}

// --- 1c. Collisions d'identifiants.
log(analyzeLog, "");
const schCollisions = SCHOLARSHIPS.filter((s) => existingIds.has(s.id));
if (schCollisions.length) {
log(analyzeLog, `${schCollisions.length} id(s) de nouvelle bourse existent déjà :`, "err");
schCollisions.forEach((s) => log(analyzeLog, `  - ${s.id}`, "err"));
blocking = true;
} else {
log(analyzeLog, `${SCHOLARSHIPS.length}/${SCHOLARSHIPS.length} identifiants de nouvelle bourse libres.`, "ok");
}

const programs = buildPrograms(uni);
const programsSnap = await getDocs(collection(db, "programs"));
const existingProgramIds = new Set(programsSnap.docs.map((d) => d.id));
const progCollisions = programs.filter((p) => existingProgramIds.has(p.id));

if (progCollisions.length) {
log(analyzeLog, `${progCollisions.length} id(s) de programme existent déjà :`, "err");
progCollisions.forEach((p) => log(analyzeLog, `  - ${p.id}`, "err"));
blocking = true;
} else {
log(analyzeLog, `${programs.length} identifiants de programme libres.`, "ok");
}

log(analyzeLog, "");
const byCountry = {};
SCHOLARSHIPS.forEach((s) => { byCountry[s.data.country] = (byCountry[s.data.country] || 0) + 1; });
log(analyzeLog, "Nouvelles bourses par pays :");
Object.keys(byCountry).sort().forEach((c) => log(analyzeLog, `  ${c} : ${byCountry[c]}`));

if (blocking) {
log(analyzeLog, "");
log(analyzeLog, "Collision(s) détectée(s) — corriger avant l'étape 2. Aucune écriture n'a eu lieu.", "err");
return;
}

lastPlan = { updates, programs };
log(analyzeLog, "");
log(analyzeLog, `Plan prêt : ${SCHOLARSHIPS.length} bourses à créer, ${updates.length} à corriger, ${programs.length} programmes. Aucune université créée, aucune photo requise.`, "ok");
log(analyzeLog, "RAPPEL : les nouvelles bourses n'auront PAS de champ eligibility — il faudra une passe dédiée après ce lot.", "warn");
writeBtn.disabled = false;
writeBtn.textContent = "Écrire";

} catch (err) {
log(analyzeLog, `ERREUR : ${err.message}`, "err");
} finally {
analyzeBtn.disabled = false;
}

});

// ==========================================================
// Étape 2 — écriture
// ==========================================================

writeBtn.addEventListener("click", async () => {

if (!lastPlan) {
log(writeLog, "Lancer l'étape 1 d'abord.", "err");
return;
}

writeBtn.disabled = true;
writeLog.innerHTML = "";

try {

let n = 0;

log(writeLog, `Création de ${SCHOLARSHIPS.length} bourses...`);
for (const s of SCHOLARSHIPS) {
await setDoc(doc(db, "scholarships", s.id), s.data, { merge: true });
n++;
log(writeLog, `  ${s.id}`, "ok");
}

log(writeLog, "");
log(writeLog, `Correction de ${lastPlan.updates.length} bourses existantes (champs ciblés uniquement)...`);
for (const u of lastPlan.updates) {
await setDoc(doc(db, "scholarships", u.id), u.patch, { merge: true });
n++;
log(writeLog, `  ${u.id} — ${Object.keys(u.patch).join(", ")}`, "ok");
}

log(writeLog, "");
log(writeLog, `Création de ${lastPlan.programs.length} programmes...`);
for (const p of lastPlan.programs) {
await setDoc(doc(db, "programs", p.id), p.data, { merge: true });
n++;
log(writeLog, `  ${p.id}`, "ok");
}

log(writeLog, "");
log(writeLog, `${n} documents écrits. Lancer l'étape 3 — la vérification n'est pas optionnelle.`, "ok");
verifyBtn.disabled = false;
verifyBtn.textContent = "Vérifier";

} catch (err) {
log(writeLog, `ERREUR : ${err.message}`, "err");
} finally {
writeBtn.disabled = false;
}

});

// ==========================================================
// Étape 3 — vérification champ par champ
// ==========================================================

function sameValue(a, b) {
if (Array.isArray(a) && Array.isArray(b)) return a.length === b.length && a.every((v, i) => v === b[i]);
return a === b;
}

verifyBtn.addEventListener("click", async () => {

if (!lastPlan) {
log(verifyLog, "Lancer les étapes 1 et 2 d'abord.", "err");
return;
}

verifyBtn.disabled = true;
verifyLog.innerHTML = "";

try {

let checked = 0;
let mismatches = 0;

const check = async (coll, id, expected, label) => {
const snap = await getDoc(doc(db, coll, id));
checked++;
if (!snap.exists()) {
log(verifyLog, `MANQUANT : ${coll}/${id}`, "err");
mismatches++;
return;
}
const actual = snap.data();
const bad = Object.keys(expected).filter((k) => !sameValue(actual[k], expected[k]));
if (bad.length) {
log(verifyLog, `ÉCART : ${coll}/${id} — champ(s) ${bad.join(", ")}`, "err");
bad.forEach((k) => {
log(verifyLog, `    attendu : ${JSON.stringify(expected[k])}`, "err");
log(verifyLog, `    en base : ${JSON.stringify(actual[k])}`, "err");
});
mismatches++;
} else {
log(verifyLog, `OK ${label} ${id}`, "ok");
}
};

log(verifyLog, "Relecture des bourses créées...");
for (const s of SCHOLARSHIPS) await check("scholarships", s.id, s.data, "bourse");

log(verifyLog, "");
log(verifyLog, "Relecture des bourses corrigées (champs patchés uniquement)...");
for (const u of lastPlan.updates) await check("scholarships", u.id, u.patch, "correction");

log(verifyLog, "");
log(verifyLog, "Relecture des programmes créés...");
for (const p of lastPlan.programs) await check("programs", p.id, p.data, "programme");

log(verifyLog, "");
if (mismatches === 0) {
log(verifyLog, `${checked}/${checked} documents conformes, 0 écart. Lot 21 terminé.`, "ok");
log(verifyLog, "Les 10 pays qui n'avaient qu'une seule bourse sont désormais tous traités.", "ok");
} else {
log(verifyLog, `${mismatches} écart(s) sur ${checked} documents — NE PAS considérer le lot comme terminé.`, "err");
}

} catch (err) {
log(verifyLog, `ERREUR : ${err.message}`, "err");
} finally {
verifyBtn.disabled = false;
}

});
