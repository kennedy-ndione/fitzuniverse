/**
* ============================================================
* LOT 106 — LES BOURSES PROPRES DES UNIVERSITÉS PRIVÉES
* (2026-09-25)
* ============================================================
*
* Suite du lot 105. Les universités privées de Malaisie, de Turquie et
* du Maroc restaient sans bourse : l'argent public (MIS, Türkiye
* Bursları, AMCI) ne passe pas par elles. Charles : « lance ce lot, on
* accélère ». Chaque université retenue reçoit SA bourse, lue sur son
* site officiel le 2026-09-25, avec sa photo (un monument de la ville,
* scripts/add-lot106-photos.mjs).
*
* RETENUES (6) : APU, INTI, Sunway, Taylor's (recherche seulement),
* Özyeğin, Université Euromed de Fès.
*
* ÉCARTÉES, AVEC LEUR MOTIF :
*   - SEGi : toutes ses bourses sont réservées aux Malaisiens (« Must
*     be a Malaysian »).
*   - UCSI : la page officielle annonce des bourses pour les
*     internationaux sans en publier ni le nom, ni le montant, ni les
*     critères. Une fiche vide ne se crée pas.
*   - Taylor's en licence : « Scholarships are only available for
*     Malaysian and Taylor's Education Group (TEG) International
*     progression students. »
*   - UIC et UM6SS : aucune aide lue n'est ouverte aux étrangers ; la
*     bourse d'excellence de l'UM6SS exige un baccalauréat obtenu au
*     Maroc.
*   - UIR : site illisible par nos outils (certificat refusé), rien de
*     vérifié. À relire à la main.
*   - Saint-Boniface : bourses d'entrée réservées aux citoyens canadiens
*     et résidents permanents.
*
* EXÉCUTION (sur l'ordinateur de Charles, après la sauvegarde) :
*   node scripts\add-lot106-photos.mjs
*   node scripts\lot.mjs analyser 106-bourses-privees
*   node scripts\lot.mjs ecrire 106-bourses-privees
*   node scripts\lot.mjs verifier 106-bourses-privees
* ============================================================
*/

import { existsSync } from "node:fs";

const LE = "2026-09-25";
const PAR = "IlXJmAScj2U5ucV2ctUgeJjadNd2";
const LU = "2026-09-25T21:40:00.000Z";
const preuve = (url, citation) => ({ url, citation, le: LU, parUid: PAR });
const MONDE = (note) => ({ note, scope: "monde" });

// Les grilles publiées par les universités de Malaisie ne connaissent
// que l'A-Level, l'IB ou l'ATAR : un bachelier africain doit demander
// l'équivalence de son diplôme.
const BAC_AFRICAIN = "Les grilles publiées ne citent que l'A-Level, l'IB ou l'ATAR : un baccalauréat africain n'y figure pas. Demandez au bureau international l'équivalence de votre diplôme avant de compter sur la réduction.";

// ------------------------------------------------------------------
// LES BOURSES
// ------------------------------------------------------------------
export const SCHOLARSHIPS = [

{ id: "apu-international-merit-awards", data: {
title: "APU International Scholarships & Merit Awards",
country: "Malaisie",
status: "Ouverte",
isActive: true,
levels: ["Licence", "Master"],
officialWebsite: "https://www.apu.edu.my/apu-international-students-scholarships-merit-awards",
image: "apu-international-merit-awards.jpg",
funder: "universite",
funderName: "Asia Pacific University of Technology & Innovation (APU)",
entryPoint: "universite",
exigences: ["admission_prealable"],
sourceEcheance: "https://www.apu.edu.my/apu-international-students-scholarships-merit-awards",
verifieLe: LE,
funding: "Réduction de 10 %, 20 % ou 30 % sur les frais de scolarité seulement. Le logement, l'inscription, les dépôts et la vie sur place restent à votre charge.",
description: "Réduction des frais de scolarité d'APU, à Kuala Lumpur, ouverte à toutes les nationalités, selon vos résultats : en licence sur les notes du diplôme de fin d'études secondaires, en master sur la moyenne de licence.",
eligibility: MONDE("Ouverte à toutes les nationalités. Réductions attribuées par ordre d'arrivée, dans la limite des places."),
periodeOuverture: "licence : jusqu'au 30 septembre 2026 pour la rentrée en cours ; master : demande en ligne, sans date publiée",
generalCriteria: [
"Licence : 30 % avec AAA en A-Level ou 34 points et plus à l'IB, 20 % avec AAB ou 30 à 33 points, 10 % avec ABB, AAC ou 26 à 29 points.",
BAC_AFRICAIN,
"Master : 30 % avec une moyenne de licence d'au moins 3,7 sur 4, 20 % à partir de 3,5, 10 % à partir de 3,2. La demande se fait par le formulaire en ligne des bourses de master, avec diplôme, relevés et CV.",
"Pour garder la réduction d'une année sur l'autre, il faut une moyenne cumulée d'au moins 2,50.",
"En licence, la réduction n'est garantie qu'après le paiement des frais de candidature et de dossier d'APU, de 3 600 RM.",
"La réduction ne se cumule pas avec une autre remise."
].join("\n")
} },

{ id: "inti-international-education-scholarship", data: {
title: "INTI International Education Scholarship",
country: "Malaisie",
status: "Ouverte",
isActive: true,
levels: ["Licence", "Master", "Doctorat"],
officialWebsite: "https://newinti.edu.my/international-students/international-scholarship/",
image: "inti-international-education-scholarship.jpg",
funder: "universite",
funderName: "INTI International University",
entryPoint: "universite",
exigences: ["admission_prealable"],
sourceEcheance: "https://newinti.edu.my/international-students/international-scholarship/",
verifieLe: LE,
funding: "Jusqu'à 45 % des frais de scolarité. Aucune allocation de vie n'est annoncée.",
description: "Bourse d'INTI réservée aux nouveaux étudiants internationaux, dans tous ses programmes sauf l'anglais intensif, attribuée par ordre d'arrivée.",
eligibility: MONDE("Réservée aux nouveaux étudiants internationaux : les Malaisiens en sont exclus."),
periodeOuverture: "toute l'année, par ordre d'arrivée, dans la limite des bourses disponibles ; aucune date publiée",
generalCriteria: [
"Réservée aux nouveaux étudiants internationaux, dans tous les programmes sauf l'anglais intensif.",
"Le pourcentage, jusqu'à 45 %, n'est pas lié à une grille publiée : remplir les conditions ne garantit pas la bourse.",
"Les bourses sont attribuées par ordre d'arrivée, en nombre limité, et les demandes tardives ne sont pas examinées : déposez votre demande en même temps que votre candidature.",
"La page ne décrit pas la démarche : demandez-la au bureau international d'INTI.",
"Pour garder la bourse, il faut réussir toutes les matières et rester à plein temps."
].join("\n")
} },

{ id: "sunway-academic-excellence-scholarships", data: {
title: "Sunway Academic Excellence Scholarships",
country: "Malaisie",
status: "Ouverte",
isActive: true,
levels: ["Licence"],
officialWebsite: "https://scholarship.sunway.edu.my/scholarships/academic-excellence-scholarships",
image: "sunway-academic-excellence-scholarships.jpg",
funder: "universite",
funderName: "Sunway University",
entryPoint: "universite",
exigences: ["admission_prealable"],
sourceEcheance: "https://scholarship.sunway.edu.my/scholarships/academic-excellence-scholarships",
verifieLe: LE,
funding: "6 000 RM ou 11 000 RM déduits des frais de scolarité chaque année, de la 1re à la 3e année de licence.",
description: "Bourse au mérite de Sunway University, ouverte aux Malaisiens comme aux étrangers, pour les licences, hors médecine.",
eligibility: MONDE("Ouverte aux Malaisiens comme aux étrangers : « Applicant can be Malaysian or International citizen. »"),
periodeOuverture: "demande dans les deux semaines qui suivent le début du cursus ou la publication de vos résultats",
generalCriteria: [
"6 000 RM par an avec ABB, BBB, AAC ou ABC en A-Level, au moins 29 points à l'IB ou un ATAR d'au moins 80 ; 11 000 RM par an avec AAA ou AAB, au moins 33 points à l'IB ou un ATAR d'au moins 90.",
BAC_AFRICAIN,
"La demande se fait séparément, par le formulaire de bourse de Sunway, avec vos justificatifs.",
"Pour la garder, il faut une moyenne annuelle d'au moins 3,25 pour la bourse de 6 000 RM et 3,45 pour celle de 11 000 RM.",
"La médecine et les programmes de la Sunway School of American Education sont exclus."
].join("\n")
} },

{ id: "taylors-research-excellence-scholarship", data: {
title: "Taylor's Research Excellence Scholarship",
country: "Malaisie",
status: "Ouverte",
isActive: true,
levels: ["Master", "Doctorat"],
officialWebsite: "https://university.taylors.edu.my/en/study/scholarships-and-financial-aid/postgraduate-scholarships.html",
image: "taylors-research-excellence-scholarship.jpg",
funder: "universite",
funderName: "Taylor's University",
entryPoint: "universite",
exigences: ["admission_prealable", "projet_recherche"],
sourceEcheance: "https://university.taylors.edu.my/en/study/scholarships-and-financial-aid/postgraduate-scholarships.html",
verifieLe: LE,
funding: "Frais de scolarité payés à 100 %, et selon la formule une allocation mensuelle : 1 500 RM en master par la recherche, jusqu'à 2 300 RM en doctorat.",
description: "Bourse de recherche de Taylor's University, ouverte aux étudiants malaisiens et internationaux, pour un master par la recherche ou un doctorat. Les masters en cours ne sont pas concernés.",
eligibility: MONDE("Ouverte aux étudiants locaux et internationaux : « Applicable to eligible local and international students ». La licence de Taylor's, elle, est fermée aux étudiants internationaux venus d'Afrique."),
periodeOuverture: "demandes acceptées toute l'année, avec une date par rentrée fixée par l'université",
generalCriteria: [
"Seulement pour un master par la recherche ou un doctorat, pas pour un master en cours.",
"Doctorat : licence avec une moyenne d'au moins 3,33 et master avec au moins 3,50, ou master par la recherche.",
"Master par la recherche : licence avec une moyenne d'au moins 3,00.",
"La demande se fait avec le formulaire d'aide aux études de recherche et un projet de recherche, envoyés à postgraduate@taylors.edu.my.",
"Les bourses de licence de Taylor's sont réservées aux Malaisiens et aux élèves des écoles du groupe Taylor's."
].join("\n")
} },

{ id: "ozyegin-international-admission-scholarships", data: {
title: "Özyeğin University International Admission Scholarships",
country: "Turquie",
status: "Fermée, dates 2027-2028 non publiées",
isActive: true,
levels: ["Licence"],
officialWebsite: "https://admissions.ozyegin.edu.tr/en/tuition-fees-and-scholarship/",
image: "ozyegin-international-admission-scholarships.jpg",
funder: "universite",
funderName: "Özyeğin University",
entryPoint: "universite",
exigences: ["admission_prealable"],
sourceEcheance: "https://admissions.ozyegin.edu.tr/en/admission-process/",
verifieLe: LE,
funding: "Réduction de 40 %, 50 % ou 60 % sur des frais de 25 000 USD par an en 2026-2027 : il reste 15 000, 12 500 ou 10 000 USD à payer.",
description: "Bourse d'admission d'Özyeğin University, à Istanbul, pour les étudiants internationaux en licence. Tous les candidats sont évalués automatiquement, sans demande séparée.",
eligibility: MONDE("Ouverte aux étudiants admis dans le contingent international, quelle que soit leur nationalité."),
periodeOuverture: "suit le calendrier des admissions internationales ; la date limite de 2026-2027 était le 15 septembre 2026",
generalCriteria: [
"Tous les candidats sont évalués pour la bourse, sans demande séparée : le pourcentage figure dans la lettre d'admission.",
"L'évaluation tient compte des résultats scolaires, du parcours, de la lettre de motivation et des places par programme ; aucune note minimale n'est publiée.",
"La bourse ne s'applique pas au programme de pilotage professionnel.",
"Elle est reconduite chaque année selon le règlement des bourses de l'université.",
"Un acompte de 1 000 USD confirme l'inscription.",
"Özyeğin ne figure pas dans la liste des universités de Türkiye Bursları."
].join("\n")
} },

{ id: "uemf-bourse-etudiants-internationaux", data: {
title: "Bourse de l'Université Euromed de Fès pour étudiants internationaux",
country: "Maroc",
status: "Ouverte",
isActive: true,
levels: ["Licence", "Master", "Doctorat"],
officialWebsite: "https://ueuromed.org/fr/etudier-a-l-euromed",
image: "uemf-bourse-etudiants-internationaux.jpg",
funder: "universite",
funderName: "Université Euromed de Fès (UEMF)",
entryPoint: "universite",
exigences: ["admission_prealable"],
sourceEcheance: "https://ueuromed.org/fr/bourses-aides-financieres",
verifieLe: LE,
funding: "Une partie des frais de scolarité. Les bourses de l'UEMF vont de 25 % à 100 % des frais ; des bourses sociales peuvent inclure le logement et la restauration.",
description: "Bourse spéciale de l'Université Euromed de Fès pour ses étudiants internationaux, du cycle préparatoire au doctorat, attribuée par une commission sur dossier.",
eligibility: MONDE("Réservée aux étudiants internationaux de l'UEMF : « Les étudiants internationaux bénéficient d'une bourse spéciale couvrant une partie de leurs frais de scolarité »."),
periodeOuverture: "demande en ligne sur la plateforme de l'UEMF ; aucune date limite publiée",
generalCriteria: [
"Le pourcentage accordé aux étudiants internationaux n'est pas publié : les bourses de l'UEMF couvrent 25 %, 50 %, 75 % et jusqu'à 100 % des frais.",
"Les dossiers sont examinés par une commission, sur des critères académiques, sociaux et économiques : joignez vos relevés de notes et des justificatifs de revenus.",
"La demande se dépose en ligne sur la plateforme de l'UEMF.",
"La bourse vaut pour une année et peut être renouvelée selon son type.",
"L'UEMF est privée : la bourse de l'AMCI ne la concerne pas."
].join("\n")
} }

];

// ------------------------------------------------------------------
// LES LIENS — un programme par niveau, avec la phrase lue.
// ------------------------------------------------------------------
const lien = (scholarshipId, pays, universityId, niveaux, language, champs) => ({
scholarshipId, pays, universityIds: [universityId], niveaux, language,
motif: "Lot 106 — bourse propre de l'université, lue sur son site officiel.",
champs
});

export const LINKS = [

lien("apu-international-merit-awards", "Malaisie", "asia-pacific-university-kuala-lumpur", ["Licence"], "Anglais", {
status: "Ouverte", isActive: true, duration: "Durée du cursus, sous condition de moyenne",
deadlineISO: "2026-09-30", ouverteVerifieeLe: LE,
coverage: "10 %, 20 % ou 30 % des frais de scolarité",
deadline: "30 septembre 2026 pour la réduction de licence de la rentrée en cours. Réductions attribuées par ordre d'arrivée.",
description: "Réduction selon vos notes d'A-Level ou d'IB. Un baccalauréat africain n'est pas dans la grille : demandez l'équivalence avant de candidater.",
sourceVerification: preuve("https://www.apu.edu.my/apu-international-students-scholarships-merit-awards", "This Scholarship & Merit awards is applicable to all countries / nationalities. The deadline for this International Scholarship & Merit Awards is 30 September 2026.")
}),
lien("apu-international-merit-awards", "Malaisie", "asia-pacific-university-kuala-lumpur", ["Master"], "Anglais", {
status: "Ouverte", isActive: true, duration: "Durée du master",
ouverteVerifieeLe: LE,
coverage: "10 %, 20 % ou 30 % des frais de scolarité, selon la moyenne de licence",
deadline: "Aucune date limite publiée : demande par le formulaire en ligne des bourses de master, par ordre d'arrivée.",
description: "30 % avec une moyenne de licence d'au moins 3,7, 20 % à partir de 3,5, 10 % à partir de 3,2.",
sourceVerification: preuve("https://www.apu.edu.my/postgraduate-scholarships", "This postgraduate scholarship application is applicable for all countries.")
}),

lien("inti-international-education-scholarship", "Malaisie", "inti-international-university-nilai", ["Licence", "Master", "Doctorat"], "Anglais", {
status: "Ouverte", isActive: true, duration: "Selon les conditions de maintien",
ouverteVerifieeLe: LE,
coverage: "Jusqu'à 45 % des frais de scolarité",
deadline: "Aucune date limite publiée. Les bourses sont attribuées par ordre d'arrivée et les demandes tardives ne sont pas examinées : demandez-la en même temps que l'admission.",
description: "Réservée aux nouveaux étudiants internationaux, dans tous les programmes sauf l'anglais intensif.",
sourceVerification: preuve("https://newinti.edu.my/international-students/international-scholarship/", "All new international students only (not applicable to Malaysians). Up to a maximum of 45%")
}),

lien("sunway-academic-excellence-scholarships", "Malaisie", "sunway-university-bandar-sunway", ["Licence"], "Anglais", {
status: "Ouverte", isActive: true, duration: "De la 1re à la 3e année, sous condition de moyenne",
ouverteVerifieeLe: LE,
coverage: "6 000 RM ou 11 000 RM par an sur les frais de scolarité",
deadline: "Deux semaines après le début du cursus, ou deux semaines après la publication de vos résultats définitifs.",
description: "Demande séparée, par le formulaire de bourse de Sunway. Grilles publiées pour l'A-Level, l'IB et l'ATAR seulement.",
sourceVerification: preuve("https://scholarship.sunway.edu.my/scholarships/academic-excellence-scholarships", "Applicant can be Malaysian or International citizen.")
}),

lien("taylors-research-excellence-scholarship", "Malaisie", "taylors-university-subang-jaya", ["Master", "Doctorat"], "Anglais", {
status: "Ouverte", isActive: true, duration: "24 mois en master par la recherche, 36 mois en doctorat au maximum",
ouverteVerifieeLe: LE,
coverage: "100 % des frais de scolarité, et selon la formule une allocation mensuelle",
deadline: "Demandes acceptées toute l'année, avec une date limite par rentrée publiée par l'université.",
description: "Pour un master par la recherche ou un doctorat seulement. Formulaire d'aide aux études de recherche et projet de recherche à envoyer à postgraduate@taylors.edu.my.",
sourceVerification: preuve("https://university.taylors.edu.my/en/study/scholarships-and-financial-aid/postgraduate-scholarships.html", "Applicable to eligible local and international students commencing from January 2019 intake onwards.")
}),

lien("ozyegin-international-admission-scholarships", "Turquie", "ozyegin-university-istanbul", ["Licence"], "Anglais", {
status: "Fermée, dates 2027-2028 non publiées", isActive: true, duration: "Reconduite chaque année selon le règlement",
deadlineISO: "2026-09-15", ouverteVerifieeLe: LE,
coverage: "40 %, 50 % ou 60 % des frais de 25 000 USD par an",
deadline: "La date limite de la rentrée 2026-2027 était le 15 septembre 2026. Les dates de 2027-2028 ne sont pas encore publiées.",
description: "Évaluation automatique de tous les candidats, sans demande séparée : le pourcentage figure dans la lettre d'admission.",
sourceVerification: preuve("https://admissions.ozyegin.edu.tr/en/admission-process/", "DEADLINE: September 15, 2026. If you are awarded a scholarship, the scholarship percentage will be indicated in your admission letter.")
}),

lien("uemf-bourse-etudiants-internationaux", "Maroc", "universite-euromed-de-fes", ["Licence", "Master", "Doctorat"], "", {
status: "Ouverte", isActive: true, duration: "Une année, renouvelable selon le type de bourse",
ouverteVerifieeLe: LE,
coverage: "Une partie des frais de scolarité ; de 25 % à 100 % selon les bourses de l'UEMF",
deadline: "Aucune date limite publiée : la demande se dépose en ligne sur la plateforme de l'UEMF, et une commission décide.",
description: "Bourse spéciale des étudiants internationaux, sur critères académiques, sociaux et économiques.",
sourceVerification: preuve("https://ueuromed.org/fr/etudier-a-l-euromed", "Les étudiants internationaux bénéficient d'une bourse spéciale couvrant une partie de leurs frais de scolarité")
})

];

export const UNIVERSITIES = [];
export const PATCHES = [];
export const SUPPRESSIONS = [];

// Le lot refuse de se charger si une photo manque (incident du lot 35).
// Garde désactivable pour la validation hors ligne des tests seulement.
const manquants = SCHOLARSHIPS.map((s) => s.data.image)
.filter((f) => f && !existsSync(`assets/images/scholarships/${f.replace(/\.jpg$/, "")}-1600w.avif`));

if (manquants.length && !process.env.LOT106_SANS_PHOTOS) {
throw new Error(`Lot 106 : ${manquants.length} photo(s) absente(s) : lancer d'abord \`node scripts\\add-lot106-photos.mjs\` :\n  ${manquants.join("\n  ")}`);
}
