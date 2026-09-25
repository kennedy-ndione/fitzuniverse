/**
* ============================================================
* LOT 105 — LES UNIVERSITÉS AJOUTÉES REÇOIVENT LEURS BOURSES
* (2026-09-25)
* ============================================================
*
* Charles : « est-ce qu'on ne devrait pas rattacher ces universités à
* des bourses pour consolider la proposition du diagnostic gratuit et
* l'accompagnement côté bourse ? » Oui : une université sans programme
* est invisible au moteur de recommandation. Avant ce lot, 2 universités
* sur 20 étaient reliées à une bourse en Roumanie, 6 sur 22 en Turquie,
* 3 sur 22 en Allemagne et 2 sur 17 en Malaisie.
*
* CE QUE LE LOT FAIT : il crée des programmes, rien d'autre. Aucune
* université, aucune bourse n'est modifiée, et les candidatures de
* Brigitte ne sont pas touchées.
*
* LA RÈGLE : un lien n'existe que si une source officielle prouve que
* CETTE université accueille les boursiers de CETTE bourse, au niveau
* indiqué. La preuve est posée sur chaque programme (sourceVerification,
* lue le 2026-09-25). Le calendrier de l'appel, la couverture et la
* durée sont repris des programmes déjà vérifiés de la même bourse, au
* même niveau, avec leur propre date de vérification (ouverteVerifieeLe).
*
* CE QUI EST VOLONTAIREMENT LAISSÉ SANS LIEN :
*   - Özyeğin (Turquie) : absente de la recherche officielle des
*     programmes Türkiye Bursları.
*   - Les six universités de médecine et de pharmacie de Roumanie : la
*     bourse du gouvernement roumain exclut la médecine, la médecine
*     dentaire et la pharmacie, leur cœur de métier. Les relier ferait
*     espérer une bourse qui ne couvre pas ce que l'étudiant vient y
*     faire.
*   - TUM et Leipzig pour le Deutschlandstipendium : participation
*     connue, mais ouverture aux étudiants internationaux non citable
*     sur une page lue.
*   - Six universités privées de Malaisie (APU, INTI, SEGi, Sunway,
*     Taylor's, UCSI) : absentes de la liste officielle MIS 2026.
*   - Maroc : les quatre établissements non reliés sont privés, et le
*     répertoire AMCI 2025/2026 ne cite que des établissements publics.
*   - Canada : Saint-Boniface n'offre pas de doctorat, seul niveau de la
*     bourse Vanier.
*
* EXÉCUTION (sur l'ordinateur de Charles, après la sauvegarde) :
*   node scripts\lot.mjs analyser 105-liens-bourses
*   node scripts\lot.mjs ecrire 105-liens-bourses
*   node scripts\lot.mjs verifier 105-liens-bourses
* ============================================================
*/

const PAR = "IlXJmAScj2U5ucV2ctUgeJjadNd2";
const LU = "2026-09-25T21:00:00.000Z";
const preuve = (url, citation) => ({ url, citation, le: LU, parUid: PAR });

// ------------------------------------------------------------------
// 1. TURQUIE — Türkiye Bursları
// Source : la recherche officielle des programmes, filtrée par
// université et par niveau. L'État place les boursiers : l'université
// se demande, elle ne se choisit pas.
// ------------------------------------------------------------------
const TB_RECHERCHE = "https://www.turkiyeburslari.gov.tr/ScholarshipSearch?UniversityFilter=";
const TB_NIVEAU = { Licence: "Bachelor%E2%80%99s+Degree", Master: "Master%27s+Degree", Doctorat: "PhD" };

const TB_MODELE = {
status: "Fermée",
isActive: false,
deadlineISO: "2026-02-20",
ouverteVerifieeLe: "2026-09-20",
duration: "Variable selon le niveau",
coverage: "Scolarité, logement, 4 500 à 9 000 TL par mois, santé, avion, année de turc obligatoire",
deadline: "L'appel 2026 s'est terminé le 20 février 2026. La période officielle va du 10 janvier au 20 février, avec des résultats début août. L'appel 2027 devrait ouvrir le 10 janvier 2027 et se terminer le 20 février 2027. Confirmez ces dates sur la page officielle, tbbs.turkiyeburslari.gov.tr."
};

// [id, filtre de la recherche officielle, type, { niveau: ligne de résultat lue }]
const TURQUIE = [
["ankara-university-ankara", "ANKARA+UNIVERSITY", "publique", {
Licence: "ANKARA UNIVERSITY FACULTY OF LANGUAGE HISTORY AND GEOGRAPHY / Anthropology — Bachelor's Degree",
Master: "ANKARA UNIVERSITY GRADUATE SCHOOL OF SOCIAL SCIENCES / Business Administration — master's Degree",
Doctorat: "ANKARA UNIVERSITY INSTITUTE OF BIOTECHNOLOGY / Basic Biotechnology — PhD" }],
["ataturk-university-erzurum", "ATATURK+UNIVERSITY", "publique", {
Licence: "ATATURK UNIVERSITY FACULTY OF ENGINEERING / Industrial Engineering — Bachelor's Degree",
Master: "ATATURK UNIVERSITY GRADUATE SCHOOL OF SOCIAL SCIENCES / Econometrics — Master's Degree",
Doctorat: "ATATURK UNIVERSITY INSTITUTE OF EDUCATIONAL SCIENCES / Curriculum And Instruction — PhD" }],
["dokuz-eylul-university-izmir", "DOKUZ+EYL%C3%9CL+UNIVERSITY", "publique", {
Licence: "DOKUZ EYLÜL UNIVERSITY BUCA FACULTY OF EDUCATION / Turkish Teaching — Bachelor's Degree",
Master: "DOKUZ EYLÜL UNIVERSITY INSTITUTE OF HEALTH SCIENCES / Biochemistry — master's Degree",
Doctorat: "DOKUZ EYLÜL UNIVERSITY INSTITUTE OF HEALTH SCIENCES / Public Health — PhD" }],
["ege-university-izmir", "EGE+UNIVERSITY", "publique", {
Licence: "EGE UNIVERSITY FACULTY OF AGRICULTURE / Horticulture — Bachelor's Degree",
Master: "EGE UNIVERSITY GRADUATE SCHOOL OF NATURAL AND APPLIED SCIENCES / Biology — Master's Degree",
Doctorat: "EGE UNIVERSITY GRADUATE SCHOOL OF NATURAL AND APPLIED SCIENCES / Mechanical Engineering — PhD" }],
["erciyes-university-kayseri", "ERC%C4%B0YES+UNIVERSITY", "publique", {
Licence: "ERCİYES UNIVERSITY FACULTY OF ENGINEERING / Biomedical Engineering — Bachelor's Degree",
Master: "ERCİYES UNIVERSITY GRADUATE SCHOOL OF NATURAL AND APPLIED SCIENCES / Biology — Master's Degree",
Doctorat: "ERCİYES UNIVERSITY GRADUATE SCHOOL OF NATURAL AND APPLIED SCIENCES / Civil Engineering — PhD" }],
// Listée sous son ancien nom anglais, Gebze Higher Institute of Technology.
["gebze-technical-university-gebze", "GEBZE+HIGHER+INSTITUTE+OF+TECHNOLOGY", "publique", {
Licence: "GEBZE HIGHER INSTITUTE OF TECHNOLOGY FACULTY OF ENGINEERING / Chemical Engineering (English) — Bachelor's Degree",
Master: "GEBZE HIGHER INSTITUTE OF TECHNOLOGY GRADUATE SCHOOL OF NATURAL AND APPLIED SCIENCES / Chemical Engineering — Master's Degree",
Doctorat: "GEBZE HIGHER INSTITUTE OF TECHNOLOGY NANOTECHNOLOGY INSTITUTE / Nanoscience and Nanoengineering (PhD) (With Thesis) — PhD" }],
["hacettepe-university-ankara", "HACETTEPE+UNIVERSITY", "publique", {
Licence: "HACETTEPE UNIVERSITY FACULTY OF MEDICINE / Medicine (English) — Bachelor's Degree",
Master: "HACETTEPE UNIVERSITY GRADUATE SCHOOL OF NATURAL AND APPLIED SCIENCES / Chemical Engineering — Master's Degree",
Doctorat: "HACETTEPE UNIVERSITY GRADUATE SCHOOL OF NATURAL AND APPLIED SCIENCES / Mining Engineering — PhD" }],
// Pas de doctorat dans la recherche officielle ; un seul master.
["izmir-institute-of-technology-urla", "%C4%B0ZM%C4%B0R+INSTITUTE+OF+TECHNOLOGY", "publique", {
Licence: "İZMİR INSTITUTE OF TECHNOLOGY FACULTY OF ARCHITECTURE / Architecture (English) — Bachelor's Degree",
Master: "İZMİR INSTITUTE OF TECHNOLOGY INSTITUTE OF GRADUATE PROGRAMS / Architectural Restoration (İngilizce) — Master's Degree" }],
["karabuk-university-karabuk", "KARAB%C3%9CK+UNIVERSITY", "publique", {
Licence: "KARABÜK UNIVERSITY FACULTY OF BUSINESS ADMINISTRATION / Business Administration — Bachelor's Degree",
Master: "KARABÜK UNIVERSITY INSTITUTE OF GRADUATE PROGRAMS / Computer Engineering — Master's Degree",
Doctorat: "KARABÜK UNIVERSITY INSTITUTE OF GRADUATE PROGRAMS / Computer Engineering — PhD" }],
["marmara-university-istanbul", "MARMARA+UNIVERSITY", "publique", {
Licence: "MARMARA UNIVERSITY ATATÜRK FACULTY OF EDUCATION / Pre-School Teaching — Bachelor's Degree",
Master: "MARMARA UNIVERSITY GRADUATE SCHOOL OF SOCIAL SCIENCES / International Business — Master's Degree",
Doctorat: "MARMARA UNIVERSITY GRADUATE SCHOOL OF SOCIAL SCIENCES / Private Law — PhD" }],
["middle-east-technical-university-ankara", "MIDDLE+EAST+TECHNICAL+UNIVERSITY", "publique", {
Licence: "MIDDLE EAST TECHNICAL UNIVERSITY FACULTY OF SCIENCE AND LITERATURE / Physics (English) — Bachelor's Degree",
Master: "MIDDLE EAST TECHNICAL UNIVERSITY GRADUATE SCHOOL OF NATURAL AND APPLIED SCIENCES / Computer Engineering — master's Degree",
Doctorat: "MIDDLE EAST TECHNICAL UNIVERSITY GRADUATE SCHOOL OF NATURAL AND APPLIED SCIENCES / Chemical Engineering — PhD" }],
["sakarya-university-serdivan", "SAKARYA+UNIVERSITY", "publique", {
Licence: "SAKARYA UNIVERSITY FACULTY OF BUSINESS ADMINISTRATION / Business Administration — Bachelor's Degree",
Master: "SAKARYA UNIVERSITY GRADUATE SCHOOL OF NATURAL AND APPLIED SCIENCES / Physics — Master's Degree",
Doctorat: "SAKARYA UNIVERSITY GRADUATE SCHOOL OF NATURAL AND APPLIED SCIENCES / Industrial Engineering — PhD" }],
["selcuk-university-konya", "SEL%C3%87UK+UNIVERSITY", "publique", {
Licence: "SELÇUK UNIVERSITY FACULTY OF LAW / Law — Bachelor's Degree",
Master: "SELÇUK UNIVERSITY GRADUATE SCHOOL OF NATURAL AND APPLIED SCIENCES / Computer Engineering — Master's Degree",
Doctorat: "SELÇUK UNIVERSITY GRADUATE SCHOOL OF SOCIAL SCIENCES / History — PhD" }],
["yildiz-technical-university-istanbul", "YILDIZ+TECHNICAL+UNIVERSITY", "publique", {
Licence: "YILDIZ TECHNICAL UNIVERSITY FACULTY OF MECHANICAL ENGINEERING / Mechatronic Engineering — Bachelor's Degree",
Master: "YILDIZ TECHNICAL UNIVERSITY GRADUATE SCHOOL OF NATURAL AND APPLIED SCIENCES / Computer Engineering — Master's Degree",
Doctorat: "YILDIZ TECHNICAL UNIVERSITY GRADUATE SCHOOL OF NATURAL AND APPLIED SCIENCES / Physics — PhD" }],
["istanbul-aydin-university-istanbul", "%C4%B0STANBUL+AYDIN+UNIVERSITY", "privée", {
Licence: "İSTANBUL AYDIN UNIVERSITY FACULTY OF ENGINEERING / Electrical And Electronic Engineering (English) — Bachelor's Degree",
Master: "İSTANBUL AYDIN UNIVERSITY INSTITUTE OF GRADUATE PROGRAMS / Computer Engineering — Master's Degree",
Doctorat: "İSTANBUL AYDIN UNIVERSITY INSTITUTE OF GRADUATE PROGRAMS / Computer Engineering — PhD" }]
];

const NIVEAU_TEXTE = { Licence: "en licence", Master: "en master", Doctorat: "en doctorat" };

const liensTurquie = TURQUIE.flatMap(([id, filtre, type, lignes]) =>
Object.entries(lignes).map(([niveau, ligne]) => ({
scholarshipId: "turkiye-burslari",
pays: "Turquie",
universityIds: [id],
niveaux: [niveau],
language: "Turc ou anglais selon le programme, après une année préparatoire de turc",
motif: "Lot 105 — université présente dans la recherche officielle des programmes Türkiye Bursları.",
champs: {
...TB_MODELE,
description: `Université ${type === "privée" ? "privée, gérée par une fondation" : "publique"}. Elle figure dans la recherche officielle des programmes Türkiye Bursları ${NIVEAU_TEXTE[niveau]}. C'est l'État turc qui place chaque boursier : vous pouvez demander cette université, mais l'affectation n'est pas garantie.`,
sourceVerification: preuve(`${TB_RECHERCHE}${filtre}&LevelNameFilter=${TB_NIVEAU[niveau]}`, ligne)
}
}))
);

// ------------------------------------------------------------------
// 2. ALLEMAGNE — DAAD, quatre fondations, Deutschlandstipendium
// Les 19 universités sont publiques. Le DAAD et les fondations
// financent des études dans toute université allemande publique ou
// reconnue par l'État : la règle officielle est la preuve.
// ------------------------------------------------------------------
const ALLEMAGNE = [
["albert-ludwigs-universitat-freiburg-fribourg-en-brisgau", "l'Université de Fribourg-en-Brisgau"],
["freie-universitat-berlin-berlin", "l'Université libre de Berlin"],
["georg-august-universitat-gottingen-gottingen", "l'Université de Göttingen"],
["goethe-universitat-frankfurt-francfort", "l'Université Goethe de Francfort"],
["johannes-gutenberg-universitat-mainz-mayence", "l'Université Johannes-Gutenberg de Mayence"],
["karlsruher-institut-fur-technologie-karlsruhe", "l'Institut de technologie de Karlsruhe"],
["ludwig-maximilians-universitat-munchen-munich", "la LMU de Munich"],
["rwth-aachen-aix-la-chapelle", "la RWTH Aachen"],
["technische-universitat-berlin-berlin", "l'Université technique de Berlin"],
["technische-universitat-darmstadt-darmstadt", "l'Université technique de Darmstadt"],
["technische-universitat-dresden-dresde", "l'Université technique de Dresde"],
["technische-universitat-munchen-munich", "l'Université technique de Munich"],
["universitat-bonn-bonn", "l'Université de Bonn"],
["universitat-des-saarlandes-sarrebruck", "l'Université de la Sarre"],
["universitat-heidelberg-heidelberg", "l'Université de Heidelberg"],
["universitat-leipzig-leipzig", "l'Université de Leipzig"],
["universitat-munster-munster", "l'Université de Münster"],
["universitat-stuttgart-stuttgart", "l'Université de Stuttgart"],
["universitat-zu-koln-cologne", "l'Université de Cologne"]
];
// LA LANGUE DES FONDATIONS (corrigée le 2026-09-25). Les quatre
// fondations exigent l'allemand B2 MÊME pour un cursus en anglais :
// leurs séminaires se tiennent en allemand. L'ancien libellé
// « … / Anglais selon le cursus » laissait le moteur les proposer à un
// étudiant qui ne parle que français et anglais (langueCompatible()
// cherche le nom de la langue dans ce champ). Le mot « anglais » ne
// doit donc pas y figurer.
//   KAS : « Even if your degree program is in English, you should reach
//         B2 level (Common European Framework) by the start of your
//         studies. » (kas.de/en/web/begabtenfoerderung-und-kultur/auslaenderfoerderung)
//   FES : « Selbst wenn Sie ein Studium in englischer Sprache
//         absolvieren, müssen Sie mit Ihrer Bewerbung ausreichende
//         deutsche Sprachkenntnisse nachweisen. »
//   Böll : « Ja, alle unsere Stipendiat*innen müssen über ausreichende
//         Kenntnisse der deutschen Sprache verfügen. »
//   RLS : « German language proficiency (B2 level or above) »
const LANGUE_FONDATIONS = "Allemand, niveau B2 exigé quelle que soit la langue du cursus";
const LANGUE_FONDATIONS_AVANT = "Allemand (B2 exigé) / Anglais selon le cursus";

// Calendriers et couvertures : ceux des programmes déjà vérifiés de la
// même bourse au même niveau (Universität Hamburg, 19 et 22 septembre).
const FONDATIONS = {
"daad-study-scholarships": {
language: "Anglais / Allemand",
preuve: preuve("https://www2.daad.de/deutschland/stipendium/datenbank/en/21148-scholarship-database.pdf?detail=50026200", "a postgraduate or Master's degree programme completed at a state or state-recognised university in Germany"),
description: (nom) => `En plus de la candidature au DAAD, vous devez demander séparément votre admission dans un master à ${nom}. Ce sont deux démarches distinctes, à mener en parallèle.`,
niveaux: {
Master: { duration: "2 ans", status: "Ouverte", isActive: true, ouverteVerifieeLe: "2026-09-22", coverage: "992 € par mois et des assurances. Le DAAD ne paie pas les frais de scolarité.", deadline: "La date limite dépend du pays d'origine. Elle n'existe que pour les 64 pays éligibles, et aucun pays africain n'en fait partie. Le dossier se dépose sur le portail du DAAD à partir du 1er juin, pour un financement qui commence en octobre 2027." }
}
},
"friedrich-ebert-stiftung": {
language: LANGUE_FONDATIONS,
description: (nom) => `La Fondation Friedrich-Ebert finance les étudiants étrangers inscrits dans une université allemande publique ou reconnue par l'État, comme ${nom}.`,
niveaux: {
Licence: { preuve: preuve("https://www.fes.de/studienfoerderung/stipendium/grundfoerderung-fuer-auslaender-innen", "Dieses Förderprogramm kommt infrage für alle, die […] bereits an einer deutschen, staatlichen oder staatlich anerkannten Hochschule oder Fachhochschule studieren."), ouverteVerifieeLe: "2026-09-22", coverage: "992 € par mois, assurance maladie payée, et 255 € de plus par enfant", deadline: "Candidature au fil de l'eau, c'est-à-dire à tout moment : après votre premier semestre d'études en Allemagne, et au plus tard trois semestres avant la fin de la durée normale de vos études. Vous devez déjà être inscrit dans une université allemande et vivre en Allemagne." },
Master: { preuve: preuve("https://www.fes.de/studienfoerderung/stipendium/grundfoerderung-fuer-auslaender-innen", "Dieses Förderprogramm kommt infrage für alle, die […] bereits an einer deutschen, staatlichen oder staatlich anerkannten Hochschule oder Fachhochschule studieren. […] Master: vor oder zu Beginn des ersten Hochschulsemesters des Masterstudiums (Wintersemester:bis zum 30.11., Sommersemester: bis zum 31.05.)"), deadlineISO: "2026-11-30", ouverteVerifieeLe: "2026-09-22", coverage: "992 € par mois, assurance maladie payée, et 255 € de plus par enfant", deadline: "Jusqu'au 30 novembre 2026 pour un master qui commence au semestre d'hiver 2026-2027. Si votre master commence au semestre d'été, la date limite est le 31 mai. Vous déposez votre candidature avant le premier semestre du master ou tout au début, une fois inscrit dans une université allemande." },
Doctorat: { preuve: preuve("https://www.fes.de/studienfoerderung/stipendium/promotionsfoerderung-fuer-auslaender-innen", "Die Förderung richtet sich an Doktorand:innen, die an einer staatlichen oder staatlich anerkannten deutschen Hochschule zur Promotion zugelassen sind."), ouverteVerifieeLe: "2026-09-22", coverage: "1 500 € par mois et une aide pour l'assurance maladie, en général pendant trois ans et demi", deadline: "Candidature au fil de l'eau, c'est-à-dire à tout moment, au plus tard environ deux ans avant la remise de votre thèse. Vous devez déjà être admis en doctorat dans une université allemande et vivre en Allemagne." }
}
},
"konrad-adenauer-stiftung": {
language: LANGUE_FONDATIONS,
preuve: preuve("https://www.kas.de/documents/d/begabtenfoerderung-und-kultur/rili-internationale-nachwuchsfoerderung-01_2026", "Bewerben können sich ausländische Studierende und Promovierende, die sich zum Zeitpunkt der Bewerbung noch nicht länger als 15 Monate in Deutschland aufhalten und an einer Hochschule in Deutschland studieren oder promovieren werden."),
description: (nom) => `La Fondation Konrad-Adenauer finance les étudiants et doctorants étrangers qui étudient dans une université en Allemagne, comme ${nom}, s'ils y vivent depuis moins de quinze mois au moment de la candidature.`,
niveaux: Object.fromEntries(["Licence", "Master", "Doctorat"].map((n) => [n, { status: "Ouverte", deadlineISO: "2027-07-15", ouverteVerifieeLe: "2026-09-19", deadline: "15 juillet 2027 à 12h00, heure d'Europe centrale. Cette date est la même chaque année pour la sélection. En licence, vous pouvez candidater à partir du 2e semestre. En master, il s'agit d'un programme de quatre semestres. En doctorat, une admission définitive dans une université allemande est exigée. Il faut un niveau d'allemand B2 minimum, par exemple avec un certificat Goethe. Il n'y a aucune limite d'âge." }]))
},
"heinrich-boell-stiftung": {
language: LANGUE_FONDATIONS,
preuve: preuve("https://www.boell.de/de/2024/03/04/bewerbungsvoraussetzungen", "Ja, das Studienwerk fördert auch Studierende und Promovierende aus Nicht-EU-Ländern – vorausgesetzt, sie wollen in Deutschland studieren und sind an einer staatlich anerkannten deutschen Hochschule eingeschrieben bzw. zur Promotion zugelassen."),
description: (nom) => `La Fondation Heinrich-Böll finance les étudiants et doctorants hors Union européenne inscrits dans une université allemande reconnue par l'État, comme ${nom}.`,
niveaux: Object.fromEntries(["Master", "Doctorat"].map((n) => [n, { status: "Fermée, dépôt du 15 janvier au 1er mars 2027", ouverteVerifieeLe: "2026-09-19", deadline: "Clôture le 1er mars 2027 pour le semestre de printemps 2027, avec un portail ouvert dès la mi-janvier. Puis clôture le 1er septembre 2027 pour l'automne 2027, avec un portail ouvert dès la mi-juillet. Il y a donc deux périodes de candidature par an. Pour les candidats internationaux, il faut un premier diplôme obtenu à l'étranger pour le master, ou un diplôme supérieur pour le doctorat. Priorité aux ressortissants des pays de la liste CAD qui ne résident pas encore en Allemagne au moment de la candidature." }]))
},
"rosa-luxemburg-stiftung": {
language: LANGUE_FONDATIONS,
preuve: preuve("https://www.rosalux.de/en/foundation/studienwerk", "You must be studying for a Master's degree and be enrolled at a state or state-recognized German university."),
description: (nom) => `La Fondation Rosa-Luxemburg finance les étudiants inscrits dans une université allemande publique ou reconnue par l'État, comme ${nom}.`,
niveaux: {
Master: { status: "Ouverte", deadlineISO: "2026-10-01", ouverteVerifieeLe: "2026-09-22", deadline: "1er octobre 2026 à 23h59 : clôture du portail, ouvert depuis le 20 août. Vous devez être inscrit en première année de master dans une université allemande. Si vous êtes seulement admis, vous devez justifier votre inscription avant le 1er novembre. Le financement commence au second semestre du master, c'est-à-dire au semestre d'été 2027. Après l'envoi, vous ne pouvez plus ajouter aucune pièce." },
Doctorat: { status: "Ouverte", deadlineISO: "2026-10-01", ouverteVerifieeLe: "2026-09-22", deadline: "1er octobre 2026 à 23h59 : clôture du portail des bourses de doctorat, ouvert depuis le 20 août. Après l'envoi, vous ne pouvez plus ajouter aucune pièce. La première réponse arrive à partir de début décembre." }
}
}
};

// Une date limite exige une preuve de CETTE date (garde de fraîcheur) :
// pour la RLS, la page du portail, déjà lue le 2026-09-22, la porte.
const PREUVE_DATE_RLS = { url: "https://www.rosalux.de/stipendienbewerbung", citation: "Die neue Bewerbungsrunde startet ab 20. August 2026. Bewerbungsschluss ist der 1. Oktober 2026 23:59 Uhr.", le: "2026-09-22T22:30:00.000Z", parUid: PAR };
const PREUVE_DATE_KAS = { url: "https://www.kas.de/en/web/begabtenfoerderung-und-kultur/auslaenderfoerderung", citation: "The application deadline for the domestic selection procedure is July 15 at 12:00 noon (CET) each year.", le: "2026-09-19T22:04:56.211Z", parUid: PAR };

const liensFondations = Object.entries(FONDATIONS).flatMap(([bourse, f]) =>
ALLEMAGNE.flatMap(([id, nom]) =>
Object.entries(f.niveaux).map(([niveau, { preuve: preuveNiveau, ...champs }]) => {
// La preuve d'éligibilité, sauf quand le programme porte une date
// limite : c'est alors la date qui doit être prouvée.
let sv = preuveNiveau || f.preuve;
if (champs.deadlineISO && bourse === "rosa-luxemburg-stiftung") sv = PREUVE_DATE_RLS;
if (champs.deadlineISO && bourse === "konrad-adenauer-stiftung") sv = PREUVE_DATE_KAS;
return {
scholarshipId: bourse,
pays: "Allemagne",
universityIds: [id],
niveaux: [niveau],
language: f.language,
motif: "Lot 105 — la bourse finance des études dans toute université allemande publique ou reconnue par l'État.",
champs: { ...champs, description: f.description(nom), sourceVerification: sv }
};
})
)
);

// Deutschlandstipendium : chaque université participe, ou non, et
// fixe sa propre période. [id, nom, preuve, statut, calendrier, date ISO]
const DS = [
["albert-ludwigs-universitat-freiburg-fribourg-en-brisgau", "l'Université de Fribourg-en-Brisgau", preuve("https://uni-freiburg.de/en/studies/during-your-studies/financing-your-studies/deutschlandstipendium/", "Students of all nationalities may apply for the Deutschlandstipendium, provided they are enrolled on a degree programme as regular students at the University of Freiburg"), "Fermée, prochain appel en mars 2027", "L'appel 2026-2027 est clos. Le prochain ouvre le 1er mars 2027 d'après la page de l'université : vérifiez la date de clôture sur cette page."],
["freie-universitat-berlin-berlin", "l'Université libre de Berlin", preuve("https://www.fu-berlin.de/international/news-events/meldungen/2026-deutschlandstipendium/index.html", "Mit dem Deutschlandstipendium erhalten Studierende der Freien Universität aus allen Nationen, Fachrichtungen und allen Teilen der Gesellschaft die Möglichkeit, sich voll und ganz auf ihr Studium zu konzentrieren."), "Fermée, prochain appel à l'été 2027", "L'appel 2026-2027 a eu lieu du 16 juillet au 13 août 2026. Le suivant est attendu à l'été 2027."],
["georg-august-universitat-gottingen-gottingen", "l'Université de Göttingen", preuve("https://www.uni-goettingen.de/en/information+for+students/218535.html", "The Germany Scholarships at university of Göttingen, are intended to provide financial support to gifted students and applicants from all nations. The application has been possible from the 1st September by the 30th September 2026 23:59h."), "Ouverte", "Jusqu'au 30 septembre 2026 à 23h59, heure allemande. Vous devez être inscrit ou candidat à l'Université de Göttingen.", "2026-09-30"],
["goethe-universitat-frankfurt-francfort", "l'Université Goethe de Francfort", preuve("https://aktuelles.uni-frankfurt.de/en/studium/hoechstgrenze-geknackt-goethe-universitaet-beim-einwerben-von-deutschlandstipendien-erneut-sehr-erfolgreich/", "Chancenvielfalt wird beim Deutschlandstipendium großgeschrieben: 32 Prozent der Stipendiat*innen haben einen Migrationshintergrund, 16 Prozent einen ausländischen Pass."), "Fermée, prochain appel au printemps 2027", "L'appel 2026-2027 a eu lieu du 4 au 20 mai 2026. Le suivant est attendu au printemps 2027."],
["johannes-gutenberg-universitat-mainz-mayence", "l'Université Johannes-Gutenberg de Mayence", preuve("https://www.blogs.uni-mainz.de/foerdern-und-stiften/files/2020/02/FAQ_Bewerbung_Deutschlandstipendium.pdf", "Ja, es können sich auch ausländische Studierende für das Deutschlandstipendium bewerben."), "Fermée, période à confirmer", "La période de candidature n'est pas publiée sur les pages lues. Consultez la page Deutschlandstipendium de l'université."],
["karlsruher-institut-fur-technologie-karlsruhe", "l'Institut de technologie de Karlsruhe", preuve("https://www.careerservice.kit.edu/en/studierende/foerderprogramme/deutschlandstipendium/", "Yes, the Deutschlandstipendium is open to students of all nationalities."), "Fermée, prochain appel au printemps 2027", "L'appel 2026 a eu lieu du 13 au 30 avril 2026. Le suivant est attendu au printemps 2027."],
["ludwig-maximilians-universitat-munchen-munich", "la LMU de Munich", preuve("https://www.lmu.de/en/workspace-for-students/student-support-services/finance-your-studies/scholarships/deutschlandstipendium/application/", "The scholarship is intended for students of all nationalities, is independent of their income or that of their parents and does not count towards BAföG"), "Fermée, prochain appel au printemps 2027", "L'appel 2026 a eu lieu du 16 mars au 5 avril 2026. Le suivant est attendu au printemps 2027."],
["rwth-aachen-aix-la-chapelle", "la RWTH Aachen", preuve("https://www.rwth-aachen.de/cms/root/transfer/spenden-sponsoring/deutschlandstipendium/~bxah/faq/?lidx=1", "Yes, if you are enrolled at RWTH Aachen University or are currently applying for admission as a regular full-time student at RWTH, you are eligible to apply for a scholarship."), "Fermée, prochain appel en juin 2027", "La prochaine période de candidature aura lieu en juin 2027, d'après la page de la RWTH."],
["technische-universitat-berlin-berlin", "l'Université technique de Berlin", preuve("https://www.tu.berlin/en/careerservice/d-stipendium", "High-performing, socially committed students from different disciplines and all nationalities receive support for their education."), "Fermée, période à confirmer", "La période de candidature n'a pas pu être lue. Consultez la page Deutschlandstipendium de l'université."],
["technische-universitat-darmstadt-darmstadt", "l'Université technique de Darmstadt", preuve("https://www.tu-darmstadt.de/deutschlandstipendium/studierende_dls/faq_studierende/index.en.jsp", "Yes, international students are also eligible to receive the Deutschlandstipendium. The application is possible until 18 October 2026."), "Ouverte", "Jusqu'au 18 octobre 2026. Une traduction de vos relevés de notes étrangers, avec les notes converties dans le système allemand, est demandée.", "2026-10-18"],
["technische-universitat-dresden-dresde", "l'Université technique de Dresde", preuve("https://tu-dresden.de/studium/rund-ums-studium/foerderung-und-finanzierung/deutschlandstipendium/bewerben", "Studierende sowie Studienbewerber:innen der TU Dresden können sich für ein Deutschlandstipendium bewerben. Dabei spielen die Nationalität, Herkunft oder bisherige Bildungsabschlüsse keine Rolle"), "Fermée, prochain appel du 1er au 15 juillet 2027", "La prochaine période de candidature va du 1er au 15 juillet 2027 à minuit, d'après la page de l'université."],
["universitat-bonn-bonn", "l'Université de Bonn", preuve("https://www.uni-bonn.de/en/studying/consultation-and-service/financing-and-support/the-deutschlandstipendium/faq", "Yes! They will need to have been admitted to or enrolled at the University of Bonn at the start of the funding period."), "Fermée, prochain appel au printemps 2027", "L'appel 2026-2027 a eu lieu du 15 avril au 18 mai 2026. Le suivant est attendu au printemps 2027. Les candidats encore à l'étranger peuvent postuler s'ils sont admis à Bonn au début de la période financée."],
["universitat-des-saarlandes-sarrebruck", "l'Université de la Sarre", preuve("https://www.uni-saarland.de/studieren/deutschlandstipendium/bewerbung/faq.html", "Ja, Sie können sich auch als ausländischer Studierender für das Deutschlandstipendium bewerben."), "Fermée, prochain appel en juin 2027", "Les candidatures sont possibles du 1er au 30 juin de chaque année."],
["universitat-heidelberg-heidelberg", "l'Université de Heidelberg", preuve("https://www.uni-heidelberg.de/de/newsroom/deutschlandstipendium-bewerbung-ab-august-moeglich", "Gefördert werden Bewerberinnen und Bewerber aller Nationalitäten, die durch hervorragende Leistungen im Studium oder vielversprechende Berufsperspektiven überzeugen."), "Fermée, prochain appel en août 2027", "L'appel 2026-2027 a eu lieu du 1er au 31 août 2026. Le suivant est attendu en août 2027."],
["universitat-munster-munster", "l'Université de Münster", preuve("https://www.uni-muenster.de/protalent/stipendiatInnen/faq.html", "Ausländische Studierende, die ihr Abitur im Ausland erworben haben und an der Universität Münster eingeschrieben sind, können gefördert werden."), "Fermée, prochain appel au début de l'été 2027", "À Münster, le Deutschlandstipendium s'appelle ProTalent. La prochaine période, pour les bourses 2027-2028, aura lieu au début de l'été 2027."],
["universitat-stuttgart-stuttgart", "l'Université de Stuttgart", preuve("https://www.uni-stuttgart.de/studium/neu-in-stuttgart/finanzen/international/", "Für das Deutschlandstipendium an der Universität Stuttgart können sich sowohl nationale als auch internationale Studierende bewerben."), "Fermée, appel attendu en décembre 2026", "L'appel pour 2027-2028 est attendu en décembre 2026, avec un dépôt en général sur dix jours en janvier."],
["universitat-zu-koln-cologne", "l'Université de Cologne", preuve("https://uni-koeln.de/sites/uni/Universitaetsfoerderung/2024/Bewerbungsverfahren_2024/2024_FAQ.pdf", "Ja, ausländische Studierende, die an der Universität zu Köln eingeschrieben sind, können sich für ein Stipendium bewerben."), "Fermée, prochain appel en août 2027", "L'appel 2026 a eu lieu du 3 au 28 août 2026. Le suivant est attendu en août 2027."]
];

const liensDS = DS.map(([id, nom, sv, status, deadline, deadlineISO]) => ({
scholarshipId: "deutschlandstipendium",
pays: "Allemagne",
universityIds: [id],
language: "Allemand / Anglais selon le cursus",
motif: "Lot 105 — l'université participe au Deutschlandstipendium et l'ouvre aux étudiants de toutes nationalités.",
champs: {
status,
isActive: true,
duration: "1 an, prolongeable",
coverage: "300 € par mois",
ouverteVerifieeLe: "2026-09-25",
...(deadlineISO ? { deadlineISO } : {}),
deadline,
description: `Ouverte aux étudiants de toutes nationalités inscrits à ${nom}. Chaque université choisit elle-même ses boursiers. Le doctorat est exclu.`,
sourceVerification: sv
}
}));

// ------------------------------------------------------------------
// 3. ROUMANIE — bourse du gouvernement roumain (ministère des Affaires
// étrangères). La page de l'appel vaut pour toutes les universités
// accréditées ; chaque université ci-dessous est « Public » sur sa
// fiche officielle studyinromania.gov.ro.
// ------------------------------------------------------------------
const ROUMANIE = [
"academie-d-etudes-economiques-bucarest", // studyinromania.gov.ro/ase
"universite-alexandru-ioan-cuza-iasi", // /uaic
"universite-babes-bolyai-cluj-napoca", // /ubb
"universite-de-craiova", // /uc-craiova
"universite-de-l-ouest-de-timisoara", // /uvt
"universite-dunarea-de-jos-galati", // /UDJG
"universite-lucian-blaga-sibiu", // /ULBS
"universite-ovidius-constanta", // /uoc
"universite-politehnica-timisoara", // /upt
"universite-technique-de-cluj-napoca", // /utcn
"universite-technique-gheorghe-asachi-iasi", // /tuiasi
"universite-transilvania-brasov" // /utbv
];

// La langue dépend du cycle : « For Bachelor and Master, only study
// programs in Romanian are available » ; en doctorat, « applicants can
// also opt for a program in English or a foreign language ». L'année
// préparatoire de roumain est accordée à qui ne le parle pas.
const LANGUE_ROUMANIE = {
Licence: "Roumain uniquement, après une année préparatoire de roumain si vous ne le parlez pas",
Master: "Roumain uniquement, après une année préparatoire de roumain si vous ne le parlez pas",
Doctorat: "Roumain, anglais ou autre langue étrangère selon l'école doctorale, avec une année préparatoire de roumain pour un doctorat en roumain"
};

const CHAMPS_ROUMANIE = {
status: "Fermée",
isActive: false,
duration: "Variable selon le niveau",
deadlineISO: "2026-03-31",
ouverteVerifieeLe: "2026-09-20",
coverage: "Scolarité gratuite, année de roumain si besoin, allocation mensuelle au montant à confirmer",
deadline: "L'appel 2026-2027 s'est achevé le 31 mars 2026, avec des résultats attendus vers le 15 juillet 2026. L'appel 2027-2028 devrait ouvrir en janvier 2027, avec une clôture fin mars 2027. Recoupez ces dates sur la page officielle, studyinromania.gov.ro.",
description: "Université publique accréditée : elle peut accueillir les boursiers du gouvernement roumain. C'est le ministère roumain des Affaires étrangères qui attribue la bourse. La bourse exclut la médecine, la médecine dentaire et la pharmacie.",
sourceVerification: preuve("https://studyinromania.gov.ro/mfa_2026-2027", "The scholarship applicant can choose from any of the following three study cycles in accredited higher education institutions in Romania. Deadline for submitting your application: 31 March 2026")
};

const liensRoumanie = ["Licence", "Master", "Doctorat"].map((niveau) => ({
scholarshipId: "romanian-government-scholarship",
pays: "Roumanie",
universityIds: ROUMANIE,
niveaux: [niveau],
language: LANGUE_ROUMANIE[niveau],
motif: "Lot 105 — université publique accréditée, ouverte aux boursiers du gouvernement roumain.",
champs: CHAMPS_ROUMANIE
}));


// ------------------------------------------------------------------
// 4. MALAISIE — Malaysia International Scholarship (MIS)
// Liste officielle des 24 établissements du guide MIS 2026.
// ------------------------------------------------------------------
const MIS_GUIDE = "https://biasiswa.mohe.gov.my/INTER/doc/MIS/Guidelines%20MIS%202026.pdf";
const MALAISIE = [
["international-islamic-university-malaysia-gombak", "6. Universiti Islam Antarabangsa Malaysia (UIAM/IIUM)"],
["multimedia-university-cyberjaya", "23. Multimedia University (MMU)"],
// La liste emploie l'ancien nom, Universiti Malaysia Pahang.
["universiti-malaysia-pahang-pekan", "15. Universiti Malaysia Pahang (UMP)"],
["universiti-putra-malaysia-serdang", "3. Universiti Putra Malaysia (UPM)"],
["universiti-sains-malaysia-penang", "2. Universiti Sains Malaysia (USM)"],
["universiti-teknologi-malaysia-johor-bahru", "1. Universiti Teknologi Malaysia (UTM)"],
["universiti-teknologi-petronas-seri-iskandar", "21. Universiti Teknologi Petronas (UTP)"],
["universiti-tenaga-nasional-kajang", "22. Universiti Tenaga Nasional (UNITEN)"],
["universiti-utara-malaysia-sintok", "7. Universiti Utara Malaysia (UUM)"]
];

const liensMalaisie = MALAISIE.map(([id, ligne]) => ({
scholarshipId: "malaysia-international-scholarship",
pays: "Malaisie",
universityIds: [id],
language: "Anglais",
motif: "Lot 105 — établissement de la liste officielle MIS 2026.",
champs: {
status: "Fermée, appel 2026-2027 clos",
isActive: true,
duration: "Durée du cursus",
ouverteVerifieeLe: "2026-09-20",
coverage: "Scolarité, RM 1 500 par mois, billet d'avion et assurance",
deadline: "L'appel pour l'année 2026-2027 est terminé : le site officiel indique que les candidatures pour l'année 2026/2027 sont closes. Les résultats de la présélection pouvaient être consultés du 7 au 22 juillet 2026. Le prochain appel est attendu au printemps 2027. Les conditions détaillées, comme les niveaux, l'âge, la moyenne et la langue, figurent dans les MIS Guidelines du ministère. Elles ne sont pas reprises sur la page officielle.",
description: "Réservée aux domaines acceptés par la bourse MIS : les disciplines de l'université ne sont pas toutes concernées.",
sourceVerification: preuve(MIS_GUIDE, `Institutions listed below are supported under MIS: ${ligne}`)
}
}));

export const UNIVERSITIES = [];
export const SCHOLARSHIPS = [];
// Les 30 programmes de fondations déjà en base (Humboldt, Hannover,
// Hamburg) reçoivent le même libellé de langue.
const FONDATIONS_EN_BASE = {
"friedrich-ebert-stiftung": ["licence", "master", "doctorat"],
"konrad-adenauer-stiftung": ["licence", "master", "doctorat"],
"heinrich-boell-stiftung": ["master", "doctorat"],
"rosa-luxemburg-stiftung": ["master", "doctorat"]
};
export const PATCHES = ["humboldt-universitat-zu-berlin-berlin", "leibniz-universitat-hannover-hannover", "universitat-hamburg-hamburg"].flatMap((uni) =>
Object.entries(FONDATIONS_EN_BASE).flatMap(([bourse, niveaux]) => niveaux.map((n) => ({
collection: "programs",
id: `${uni}__${bourse}__${n}`,
motif: "Lot 105 — la fondation exige l'allemand B2 même pour un cursus en anglais : le libellé ne doit plus laisser croire qu'un cursus anglophone suffit.",
attendu: { language: LANGUE_FONDATIONS_AVANT },
champs: { language: LANGUE_FONDATIONS }
})))
);
export const SUPPRESSIONS = [];
export const LINKS = [
...liensTurquie,
...liensFondations,
...liensDS,
...liensRoumanie,
...liensMalaisie
];
