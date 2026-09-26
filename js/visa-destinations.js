/**
* ============================================================
* FitzUniverse — les guides VISA & DÉPART des destinations sans
* procédure de préinscription (lot 112, 2026-09-26)
* ============================================================
*
* LE PROBLÈME. Le guide de départ de l'espace (js/visa-depart.js) a deux
* étages : un socle générique, et les étapes RÉELLES de la destination,
* prises dans js/procedures/<pays>.js. Or ces procédures n'existent que
* pour les neuf pays de la préinscription. Un boursier admis au
* Royaume-Uni, en Suisse, au Japon ou en Corée — les destinations les
* plus proposées après elles — ne lisait que le socle : ni le montant à
* prouver, ni le délai, ni le guichet, ni ce qu'il faut faire à
* l'arrivée.
*
* CE FICHIER porte, pour ces quatre pays, les SEULES étapes de départ
* (`phaseDepart: true`), dans la forme exacte des procédures : même
* vocabulaire fermé (js/procedures/vocabulaire.js), une source officielle
* et une date sur chaque étape, vérifiées par defautsDeProcedure() dans
* test/lot112.test.mjs. Ce ne sont PAS des procédures de préinscription :
* elles ne sont pas dans TRONCS, pour que la fiche d'une université
* britannique n'annonce pas une procédure d'admission qu'on n'a pas.
*
* Sources lues le 2026-09-26 : gov.uk (UKVI), l'ambassade de Suisse à
* Dakar, les cantons et l'OFSP, l'Agence des services d'immigration du
* Japon, le MOFA, l'ambassade du Japon à Dakar et JASSO, Study in Korea
* (NIIED), le ministère coréen de la Justice, l'ambassade de Corée au
* Sénégal, le NHIS. Les montants sont ceux du jour ; une étape dit d'où
* ils viennent.
*
* Aucun DOM, aucun Firestore : testable sous Node.
* ============================================================
*/

import { findCountry } from "./countries.js";

const VERIFIE = "2026-09-26";
const NBSP = " ";

// ---------------------------------------------------------------
// ROYAUME-UNI — le Student visa
// ---------------------------------------------------------------

const RU = {
COURSE: "https://www.gov.uk/student-visa/course",
ATAS: "https://www.gov.uk/guidance/academic-technology-approval-scheme",
TB: "https://www.gov.uk/tb-test-visa/countries-where-you-need-a-tb-test-to-enter-the-uk",
ARGENT: "https://www.gov.uk/guidance/financial-evidence-for-student-and-child-student-route-applicants",
VISA: "https://www.gov.uk/student-visa",
IDENTITE: "https://www.gov.uk/guidance/using-the-uk-immigration-id-check-app",
EVISA: "https://www.gov.uk/evisa",
TRAVAIL: "https://www.gov.uk/government/publications/points-based-system-student-route/student-and-child-student-accessible"
};

export const DEPART_ROYAUME_UNI = {
paysDestination: "Royaume-Uni",
etapes: [
{
id: "ru_cas",
phaseDepart: true,
type: "reponse",
titre: "Recevoir mon CAS de l'université",
consigne: "Quand l'université vous a offert une place, elle vous envoie un numéro de référence, le CAS (Confirmation of Acceptance for Studies). C'est lui qui ouvre la demande de visa étudiant (Student visa). Vous devez déposer la demande dans les 6 mois qui suivent sa réception, et un CAS ne sert qu'à une seule demande. Vérifiez que votre nom, votre programme, les dates et les frais y sont exacts : c'est sur le montant des frais inscrit au CAS que se calcule l'argent à prouver.",
prerequis: [],
preuve: "numero_dossier",
pieces: [{ nom: "Numéro de CAS (Confirmation of Acceptance for Studies)", format: "PDF", tailleMax: null, traduction: false, legalisation: false }],
echeance: null,
fiabilite: "verifie_source_officielle",
source: RU.COURSE,
verifieLe: VERIFIE
},
{
id: "ru_atas",
phaseDepart: true,
type: "complement",
titre: "Obtenir le certificat ATAS, si mon programme l'exige",
consigne: "Certains masters et doctorats, dans des domaines scientifiques et technologiques sensibles, exigent un certificat ATAS (Academic Technology Approval Scheme) avant la demande de visa. Votre université vous dit si c'est votre cas. Les ressortissants africains n'en sont pas dispensés. Le traitement prend au moins 30 jours ouvrés (6 semaines), parfois davantage : demandez-le dès que l'université vous le signale.",
prerequis: ["ru_cas"],
preuve: "numero_dossier",
pieces: [{ nom: "Certificat ATAS", format: "PDF", tailleMax: null, traduction: false, legalisation: false }],
echeance: null,
fiabilite: "verifie_source_officielle",
source: RU.ATAS,
verifieLe: VERIFIE
},
{
id: "ru_tuberculose",
phaseDepart: true,
type: "complement",
titre: "Passer le test de tuberculose dans une clinique agréée",
consigne: "Le test est exigé si vous venez pour 6 mois ou plus et que vous avez vécu au moins 6 mois, au cours des 6 derniers mois, dans un pays de la liste. Le Sénégal, la Côte d'Ivoire, le Cameroun, le Nigeria et le Ghana y figurent, chacun avec des cliniques agréées. Le Mali, la Guinée, le Bénin, le Togo et le Burkina Faso y figurent aussi, mais sans clinique : il faut faire le test dans un autre pays. Seule une clinique agréée par le Home Office compte. Le certificat est valable 6 mois à compter de la radio : ne le faites pas trop tôt.",
prerequis: [],
preuve: "recu",
pieces: [{ nom: "Certificat de dépistage de la tuberculose d'une clinique agréée", format: "original papier", tailleMax: null, traduction: false, legalisation: false }],
echeance: null,
fiabilite: "verifie_source_officielle",
source: RU.TB,
verifieLe: VERIFIE
},
{
id: "ru_argent",
phaseDepart: true,
type: "pieces",
titre: "Prouver mes ressources selon la règle des 28 jours",
consigne: `Il faut prouver les frais de la première année, soit le montant inscrit sur votre CAS, plus 1${NBSP}529${NBSP}£ par mois pour un cours à Londres, ou 1${NBSP}171${NBSP}£ hors de Londres, pour 9 mois au plus. L'argent doit être resté sur le compte au moins 28 jours de suite, et la fin de ces 28 jours doit tomber dans les 31 jours qui précèdent votre demande. Une somme en francs CFA est convertie au cours OANDA du jour de la demande. Les ressortissants du Sénégal, de la Côte d'Ivoire, du Cameroun, du Mali et de la Guinée ne sont pas dispensés de cette preuve. Boursier : un financement officiel (gouvernement britannique ou de votre pays, British Council, organisation internationale, université) n'est pas soumis à la règle des 28 jours. S'il ne figure pas sur votre CAS, joignez la lettre du financeur : date, nom et coordonnées du financeur, durée, et montant versé ou prise en charge totale.`,
prerequis: ["ru_cas"],
preuve: "aucune",
pieces: [
{ nom: "Relevés bancaires couvrant 28 jours consécutifs, clôturés moins de 31 jours avant la demande", format: "PDF", tailleMax: null, traduction: true, legalisation: false },
{ nom: "Lettre du financeur officiel, si la bourse ne figure pas sur le CAS", format: "PDF", tailleMax: null, traduction: false, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: RU.ARGENT,
verifieLe: VERIFIE
},
{
id: "ru_demande",
phaseDepart: true,
type: "paiement",
titre: "Déposer la demande de Student visa et payer",
consigne: `La demande se fait en ligne sur gov.uk, au plus tôt 6 mois avant le début du cours. Frais : 558${NBSP}£ depuis l'étranger (tarif en vigueur depuis le 8 avril 2026), plus la surtaxe santé (Immigration Health Surcharge), 776${NBSP}£ par année de visa, payée avec la demande. Pièces : passeport en cours de validité, CAS, preuve de ressources, et selon votre cas le certificat ATAS, le résultat du test de tuberculose, et l'accord écrit de votre financeur s'il a payé vos frais et votre vie dans les 12 derniers mois. Une pièce qui n'est ni en anglais ni en gallois doit être accompagnée d'une traduction certifiée.`,
prerequis: ["ru_argent"],
preuve: "recu",
pieces: [
{ nom: "Passeport en cours de validité", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Reçu du paiement des frais de visa et de la surtaxe santé", format: "PDF", tailleMax: null, traduction: false, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: RU.VISA,
verifieLe: VERIFIE
},
{
id: "ru_biometrie",
phaseDepart: true,
type: "entretien",
titre: "Donner mes empreintes au centre de demande de visa",
consigne: "L'application UK Immigration: ID Check est réservée aux passeports biométriques de l'Union européenne, de l'Espace économique européen et de la Suisse. Vous prenez donc rendez-vous dans un centre de demande de visa (VAC), après avoir déposé la demande en ligne, pour vos empreintes et votre photo. Pour le Sénégal, gov.uk renvoie au portail VFS Global. La décision arrive en général sous 3 semaines quand on dépose depuis l'étranger.",
prerequis: ["ru_demande"],
preuve: "convocation",
pieces: [],
echeance: null,
fiabilite: "verifie_source_officielle",
source: RU.IDENTITE,
verifieLe: VERIFIE
},
{
id: "ru_evisa",
phaseDepart: true,
type: "confirmation",
titre: "Activer mon eVisa dans mon compte UKVI",
consigne: "Il n'y a plus de carte de séjour : votre visa est un eVisa. Créez votre compte UKVI, gratuit, et reliez-y le passeport qui a servi à la demande. C'est ce compte qui prouve votre droit au séjour, au passage de la frontière comme auprès de votre université.",
prerequis: ["ru_biometrie"],
preuve: "capture",
pieces: [],
echeance: null,
fiabilite: "verifie_source_officielle",
source: RU.EVISA,
verifieLe: VERIFIE
},
{
id: "ru_arrivee",
phaseDepart: true,
type: "confirmation",
titre: "Arriver au bon moment, et savoir ce que j'ai le droit de faire",
consigne: "Vous pouvez arriver au plus tôt 1 mois avant le début d'un cours de plus de 6 mois (1 semaine pour un cours de 6 mois ou moins), et jamais avant la date de début de votre visa. L'enregistrement auprès de la police n'existe plus depuis le 4 août 2022. Travail : 20 heures par semaine au plus pendant les périodes de cours pour un cursus de niveau licence ou au-dessus.",
prerequis: ["ru_evisa"],
preuve: "aucune",
pieces: [],
echeance: null,
fiabilite: "verifie_source_officielle",
source: RU.TRAVAIL,
verifieLe: VERIFIE
}
]
};

// ---------------------------------------------------------------
// SUISSE — le visa national D et le permis B
// ---------------------------------------------------------------

const CH = {
DAKAR_ETUDES: "https://www.schweiz-senegal.eda.admin.ch/dam/fr/eda-cms/5or7ppNl3e2q/visa-etudes_FR.pdf",
ZURICH: "https://www.zh.ch/de/migration-integration/aufenthalt/aufenthalt-ohne-erwerbstaetigkeit-fuer-drittstaatsangehoerige.html",
GENEVE_FAQ: "https://www.ge.ch/demander-permis-sejour-etudiant/reponses-aux-questions-frequentes-permis-etude",
VAUD_ANNONCE: "https://publication.vd.ch/publications/dgaic/aide-memoire/administration-communale/bureau-des-etrangers",
OFSP: "https://www.bag.admin.ch/fr/assurance-maladie-etudiants-etrangers-en-suisse"
};

export const DEPART_SUISSE = {
paysDestination: "Suisse",
etapes: [
{
id: "ch_dossier",
phaseDepart: true,
type: "pieces",
titre: "Réunir le dossier de visa national D",
consigne: "Pour étudier plus de 90 jours, il faut un visa national (type D), demandé en personne à la représentation suisse de votre pays de résidence. Liste de l'ambassade de Suisse à Dakar pour les études : trois formulaires de demande de visa de long séjour ; un passeport valable au moins 6 mois après l'entrée prévue ; trois photos identiques sur fond blanc ; l'attestation d'admission de l'école ou de l'université ; votre CV et vos diplômes ; le programme détaillé des cours ; une lettre de motivation ; la preuve des moyens financiers (compte bancaire, ou attestation de prise en charge émise par une banque) ; une lettre signée par laquelle vous vous engagez à quitter la Suisse au terme des études. Chaque original avec deux photocopies. Si vous résidez au Sénégal, en Gambie, en Guinée-Bissau, au Mali, en Mauritanie ou au Cap-Vert sans en avoir la nationalité, présentez votre permis de résidence.",
prerequis: [],
preuve: "aucune",
pieces: [
{ nom: "Trois formulaires de demande de visa de long séjour (D)", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Passeport valable au moins 6 mois après l'entrée prévue", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Trois photos identiques sur fond blanc", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Attestation d'admission de l'établissement suisse", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "CV et diplômes", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Programme détaillé des cours", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Lettre de motivation", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Preuve des moyens financiers", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Lettre d'engagement à quitter la Suisse au terme des études", format: "original papier", tailleMax: null, traduction: false, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: CH.DAKAR_ETUDES,
verifieLe: VERIFIE
},
{
id: "ch_argent",
phaseDepart: true,
type: "complement",
titre: "Prouver le montant fixé par le canton de mes études",
consigne: `Le montant exigé dépend du canton. Zurich (ETH, Université de Zurich) : 21${NBSP}000 CHF pour douze mois, prouvés par une banque autorisée en Suisse, par la déclaration d'un garant avec ses revenus, ou par l'engagement ferme d'une bourse. Genève : 20${NBSP}000 CHF par année d'études sur un compte d'une banque reconnue en Suisse, ou une prise en charge d'au moins 2${NBSP}500 CHF par mois. Vaud (EPFL, UNIL) ne chiffre pas le montant sur sa page : faites-le confirmer par votre établissement avant de préparer vos relevés.`,
prerequis: ["ch_dossier"],
preuve: "aucune",
pieces: [],
echeance: null,
fiabilite: "verifie_source_officielle",
source: CH.ZURICH,
verifieLe: VERIFIE
},
{
id: "ch_depot",
phaseDepart: true,
type: "visa",
titre: "Déposer ma demande en personne, trois mois avant la rentrée",
consigne: "Déposez la demande au moins trois mois avant le début des cours, le plus tôt possible, et en personne : à l'ambassade de Suisse à Dakar, la prise de rendez-vous est obligatoire. Comptez 8 à 12 semaines au minimum : c'est l'office des migrations du canton de vos études qui décide, pas l'ambassade, et celle-ci ne donne aucun renseignement pendant la procédure. Au Sénégal, les demandes de visa pour études sont exonérées de frais de visa.",
prerequis: ["ch_argent"],
preuve: "recu",
pieces: [],
echeance: null,
fiabilite: "verifie_source_officielle",
source: CH.DAKAR_ETUDES,
verifieLe: VERIFIE
},
{
id: "ch_arrivee",
phaseDepart: true,
type: "confirmation",
titre: "M'annoncer à la commune et obtenir mon permis B",
consigne: "Dès l'arrivée, annoncez-vous au contrôle des habitants de votre commune : 8 jours dans le canton de Vaud ; le délai varie selon le canton, vérifiez le vôtre dès votre arrivée. Le permis de séjour B est une carte biométrique : le canton vous convoque pour vos données biométriques. Travail : au plus tôt 6 mois après le début des études, 15 heures par semaine au plus pendant les cours et à plein temps pendant les vacances (Genève plafonne à 40 heures par semaine).",
prerequis: ["ch_depot"],
preuve: "aucune",
pieces: [],
echeance: null,
fiabilite: "verifie_source_officielle",
source: CH.VAUD_ANNONCE,
verifieLe: VERIFIE
},
{
id: "ch_assurance",
phaseDepart: true,
type: "complement",
titre: "M'assurer dans les trois mois",
consigne: "L'assurance maladie de base suisse est obligatoire, au plus tard trois mois après la prise de domicile. Un étudiant venu d'un pays hors de l'Union européenne et de l'AELE peut demander à l'autorité cantonale d'en être libéré s'il a une assurance privée dont la couverture est équivalente à celle d'une caisse-maladie suisse : faites la demande dans ce délai de trois mois.",
prerequis: ["ch_arrivee"],
preuve: "recu",
pieces: [],
echeance: null,
fiabilite: "verifie_source_officielle",
source: CH.OFSP,
verifieLe: VERIFIE
}
]
};

// ---------------------------------------------------------------
// JAPON — le certificat d'éligibilité, puis le visa « Étudiant »
// ---------------------------------------------------------------

const JP = {
ISA_ETUDIANT: "https://www.moj.go.jp/isa/applications/status/student.html",
MOFA_FAQ: "https://www.mofa.go.jp/j_info/visit/visa/faq.html",
MOFA_VISA: "https://www.mofa.go.jp/j_info/visit/visa/long/visa6.html",
DAKAR_FRAIS: "https://www.sn.emb-japan.go.jp/files/100903407.pdf",
JASSO_IMMIGRATION: "https://www.studyinjapan.go.jp/en/planning/immigration-procedures/",
JASSO_ASSURANCE: "https://www.studyinjapan.go.jp/en/life/insurance/"
};

export const DEPART_JAPON = {
paysDestination: "Japon",
etapes: [
{
id: "jp_coe",
phaseDepart: true,
type: "pieces",
titre: "Fournir à mon université les pièces du certificat d'éligibilité",
consigne: "Le certificat d'éligibilité (CoE) au statut « Étudiant » se demande auprès d'un bureau régional de l'immigration, au Japon : dans la plupart des cas, c'est votre université qui le fait pour vous. Vous lui fournissez le formulaire de demande de CoE, une photo aux normes, la déclaration de prise en charge des frais ou l'attestation de votre bourse, et les justificatifs de ressources qu'elle vous demande : attestation de solde de votre garant, attestation de ses revenus de l'année écoulée, origine des fonds. Toute pièce rédigée dans une langue étrangère doit être accompagnée de sa traduction en japonais.",
prerequis: [],
preuve: "aucune",
pieces: [
{ nom: "Formulaire de demande de certificat d'éligibilité", format: "PDF", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Photo d'identité aux normes", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Déclaration de prise en charge des frais, ou attestation de bourse", format: "PDF", tailleMax: null, traduction: true, legalisation: false },
{ nom: "Attestation de solde et de revenus du garant", format: "PDF", tailleMax: null, traduction: true, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: JP.ISA_ETUDIANT,
verifieLe: VERIFIE
},
{
id: "jp_coe_recu",
phaseDepart: true,
type: "reponse",
titre: "Recevoir mon certificat d'éligibilité",
consigne: "Le CoE peut vous être envoyé par e-mail (depuis le 17 mars 2023) et se présente tel quel. Il est valable trois mois : si vous n'êtes pas entré au Japon dans ce délai, il faut en obtenir un nouveau. Il ne garantit pas la délivrance du visa.",
prerequis: ["jp_coe"],
preuve: "capture",
pieces: [{ nom: "Certificat d'éligibilité (CoE)", format: "PDF", tailleMax: null, traduction: false, legalisation: false }],
echeance: null,
fiabilite: "verifie_source_officielle",
source: JP.MOFA_FAQ,
verifieLe: VERIFIE
},
{
id: "jp_visa",
phaseDepart: true,
type: "visa",
titre: "Demander le visa « Étudiant » à l'ambassade du Japon",
consigne: `Pièces : passeport, un formulaire de demande de visa, une photo, et le CoE (original ou copie). Délai standard : cinq jours ouvrés à compter du lendemain de l'acceptation du dossier, s'il est complet. À l'ambassade du Japon à Dakar, les demandes se déposent le matin, sur rendez-vous ; frais depuis le 1er juillet 2026 : 60${NBSP}000 F${NBSP}CFA pour une entrée simple. Boursier MEXT : vous demandez un nouveau visa « Étudiant » à la représentation japonaise de votre pays de nationalité avant de partir, faute de quoi le versement de la bourse est suspendu.`,
prerequis: ["jp_coe_recu"],
preuve: "recu",
pieces: [
{ nom: "Passeport", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Formulaire de demande de visa", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Photo d'identité", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Certificat d'éligibilité, original ou copie", format: "original papier", tailleMax: null, traduction: false, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: JP.MOFA_VISA,
verifieLe: VERIFIE
},
{
id: "jp_arrivee",
phaseDepart: true,
type: "confirmation",
titre: "Recevoir ma carte de résident à l'arrivée",
consigne: "Au contrôle de l'immigration, on appose dans votre passeport le tampon d'autorisation de débarquement et on vous remet votre carte de résident (zairyu card), délivrée pour tout séjour de plus de trois mois. Pour travailler à temps partiel, il faut une autorisation ; lors d'une première entrée pour plus de trois mois, vous pouvez la demander à l'aéroport. Plafond : 28 heures par semaine, 8 heures par jour pendant les longues vacances.",
prerequis: ["jp_visa"],
preuve: "aucune",
pieces: [],
echeance: null,
fiabilite: "verifie_source_officielle",
source: JP.JASSO_IMMIGRATION,
verifieLe: VERIFIE
},
{
id: "jp_mairie",
phaseDepart: true,
type: "complement",
titre: "Déclarer mon adresse en mairie et m'assurer",
consigne: "Dans les 14 jours qui suivent votre installation, présentez votre carte de résident à la mairie de votre commune pour vous enregistrer comme résident. Inscrivez-vous ensuite, à la même mairie, à l'assurance maladie nationale : elle est obligatoire pour un séjour de trois mois ou plus et prend en charge 70 % des frais médicaux. Les boursiers MEXT y sont également tenus.",
prerequis: ["jp_arrivee"],
preuve: "aucune",
pieces: [],
echeance: null,
fiabilite: "verifie_source_officielle",
source: JP.JASSO_ASSURANCE,
verifieLe: VERIFIE
}
]
};

// ---------------------------------------------------------------
// CORÉE DU SUD — le visa D-2
// ---------------------------------------------------------------

const KR = {
STUDY_VISA: "https://www.studyinkorea.go.kr/en/plan/visaAndStay.do",
DAKAR_D2: "https://overseas.mofa.go.kr/sn-fr/brd/m_20569/view.do?seq=41",
JUSTICE_FINANCES: "https://www.korea.kr/news/policyNewsView.do?newsId=148916751",
SEJOUR: "https://www.studyinkorea.go.kr/en/life/residenceAndStayInfo.do",
NHIS: "https://www.nhis.or.kr/lm/lmxsrv/law/lawFullContent.do?SEQ=41"
};

export const DEPART_COREE = {
paysDestination: "Corée du Sud",
etapes: [
{
id: "kr_admission",
phaseDepart: true,
type: "reponse",
titre: "Recevoir la lettre d'admission standard de l'université",
consigne: "L'université vous délivre une lettre d'admission standard (Standard Admission Letter), signée du président ou du doyen, et la copie de son certificat d'enregistrement. Ce sont les pièces qui prouvent votre admission au consulat : vérifiez que votre nom y est écrit exactement comme sur votre passeport.",
prerequis: [],
preuve: "capture",
pieces: [
{ nom: "Lettre d'admission standard (Standard Admission Letter)", format: "PDF", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Copie du certificat d'enregistrement de l'université", format: "PDF", tailleMax: null, traduction: false, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: KR.STUDY_VISA,
verifieLe: VERIFIE
},
{
id: "kr_argent",
phaseDepart: true,
type: "complement",
titre: "Réunir la preuve de ressources",
consigne: "Depuis le 3 juillet 2023, le ministère coréen de la Justice demande l'équivalent de 20 millions de wons pour un cursus diplômant, et de 16 millions de wons dans une université hors de la région capitale ; Séoul est dans la région capitale. L'ambassade de Corée au Sénégal demande le relevé bancaire des 6 derniers mois. Si vos parents vous financent, joignez le livret de famille, leur passeport, le relevé de compte de l'un d'eux, et la copie intégrale des actes d'état civil qui prouvent le lien de parenté.",
prerequis: ["kr_admission"],
preuve: "aucune",
pieces: [{ nom: "Relevé bancaire des 6 derniers mois", format: "original papier", tailleMax: null, traduction: false, legalisation: false }],
echeance: null,
fiabilite: "verifie_source_officielle",
source: KR.JUSTICE_FINANCES,
verifieLe: VERIFIE
},
{
id: "kr_visa",
phaseDepart: true,
type: "visa",
titre: "Demander le visa D-2 à l'ambassade de Corée",
consigne: "Liste de l'ambassade de Corée au Sénégal pour un séjour universitaire : formulaire de demande rempli en majuscules (un formulaire illisible ou incomplet est rejeté d'office) ; photo récente sur fond blanc, 3,5 × 4,5 cm, collée sur le formulaire ; passeport original valable au moins 6 mois et copie de la page d'identité ; attestation originale du dernier diplôme ; attestation d'inscription en Corée ; attestation de paiement des frais de scolarité ; relevé bancaire des 6 derniers mois ; billet d'avion aller-retour ; justificatif d'hébergement ; frais de visa. Votre dernier diplôme et votre relevé de notes doivent être légalisés par le ministère des Affaires étrangères du pays qui les a délivrés, puis par l'ambassade de Corée, dans les trois mois. Guichet des visas à Dakar : du lundi au jeudi, de 8 h 30 à 12 h 30 et de 14 h à 16 h ; le vendredi, de 8 h 30 à 12 h 30.",
prerequis: ["kr_argent"],
preuve: "recu",
pieces: [
{ nom: "Formulaire de demande de visa, rempli en majuscules, photo collée", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Passeport valable au moins 6 mois, et copie de la page d'identité", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Dernier diplôme et relevé de notes légalisés", format: "original papier", tailleMax: null, traduction: false, legalisation: true },
{ nom: "Attestation d'inscription en Corée", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Attestation de paiement des frais de scolarité", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Billet d'avion aller-retour", format: "PDF", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Justificatif d'hébergement", format: "original papier", tailleMax: null, traduction: false, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: KR.DAKAR_D2,
verifieLe: VERIFIE
},
{
id: "kr_arrivee",
phaseDepart: true,
type: "confirmation",
titre: "M'enregistrer à l'immigration dans les 90 jours",
consigne: "Tout étranger qui reste plus de 90 jours doit s'enregistrer au bureau de l'immigration dans les 90 jours qui suivent son entrée : formulaire, passeport, une photo récente au format passeport, certificat d'inscription délivré après l'entrée, et frais. Vous recevez alors votre carte de résident. Tout changement d'adresse se déclare ensuite dans les 15 jours : au-delà, l'amende peut atteindre 1 million de wons.",
prerequis: ["kr_visa"],
preuve: "recu",
pieces: [],
echeance: null,
fiabilite: "verifie_source_officielle",
source: KR.SEJOUR,
verifieLe: VERIFIE
},
{
id: "kr_assurance",
phaseDepart: true,
type: "complement",
titre: "Savoir que je suis affilié à l'assurance maladie nationale",
consigne: "Un étudiant au statut D-2 est affilié à l'assurance maladie nationale coréenne dès son entrée dans le pays (règlement du NHIS modifié en 2021), et non après six mois comme les autres étrangers. Les cotisations mensuelles commencent donc tout de suite : prévoyez-les dans votre budget, et gardez les avis de paiement.",
prerequis: ["kr_arrivee"],
preuve: "aucune",
pieces: [],
echeance: null,
fiabilite: "verifie_source_officielle",
source: KR.NHIS,
verifieLe: VERIFIE
}
]
};

/** Les quatre guides, dans l'ordre où le diagnostic les propose le plus. */
export const GUIDES_DEPART = [DEPART_ROYAUME_UNI, DEPART_SUISSE, DEPART_JAPON, DEPART_COREE];

/**
* Le guide de départ d'une destination, ou null. Même appariement que les
* procédures : le code ISO du référentiel (js/countries.js), insensible à
* la casse et aux accents.
*/
export function guideDepartPour(paysDestination) {
const cible = findCountry(paysDestination);
if (!cible) return null;
return GUIDES_DEPART.find((g) => {
const p = findCountry(g.paysDestination);
return p && p.iso === cible.iso;
}) || null;
}
