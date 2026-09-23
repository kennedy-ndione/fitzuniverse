/**
* ============================================================
* FitzUniverse — le TRONC de la procédure Malaisie (2026-09-23)
* ============================================================
*
* UNE SEULE VOIE. On candidate DIRECTEMENT auprès d'un établissement
* reconnu (université publique, ou établissement privé enregistré), puis
* la demande de Student Pass part chez EMGS (Education Malaysia Global
* Services), le plus souvent par l'établissement lui-même. EMGS fait
* l'examen académique, l'Immigration délivre l'eVAL, et le Student Pass
* n'est collé dans le passeport qu'APRÈS l'arrivée et la visite médicale.
*
* LE PIÈGE DU SÉNÉGALAIS : l'eVAL ne suffit pas. Le Sénégal est sur la
* liste EMGS des pays dont les étudiants doivent obtenir un visa à entrée
* unique (SEV) avant d'entrer, à demander sur le portail eVISA de
* l'Immigration. Deuxième piège : la visite médicale dans les 7 jours
* ouvrables après l'arrivée, sans laquelle rien n'est apposé.
*
* LA CAUTION PERSONNELLE (relue le 2026-09-23) : la grille EMGS v1.2 ne
* nomme pas le Sénégal ; il relève de sa ligne « Fee for all other
* countries », 1 500 RM. Les conditions de restitution sont celles de la
* page EMGS des pièces requises.
*
* CE QU'ON N'A PAS PU VÉRIFIER : les frais de service du portail eVISA,
* la page de l'ambassade de Malaisie à Dakar, la liste MQA des diplômes
* d'entrée reconnus et la liste « fièvre jaune » du ministère de la
* Santé (sites inaccessibles le 2026-09-23). C'est dit dans les
* consignes et dans les absences du diagnostic.
*
* Toutes les étapes après la lettre d'offre sont de la phase « Visa &
* départ » : en Malaisie, la demande de visa EST la suite de l'admission.
* ============================================================
*/

const VERIFIE = "2026-09-23";

export const SOURCES = {
EMGS_ACCUEIL: "https://visa.educationmalaysia.gov.my/",
EMGS_PIECES: "https://visa.educationmalaysia.gov.my/guidelines/required-documents",
EMGS_GUIDELINES: "https://visa.educationmalaysia.gov.my/guidelines",
EMGS_SEV: "https://visa.educationmalaysia.gov.my/guidelines/sev-required-countries",
EMGS_MEDICAL: "https://visa.educationmalaysia.gov.my/guidelines/medical-screening",
EMGS_CLINIQUES: "https://visa.educationmalaysia.gov.my/guidelines/registered-malaysian-clinic",
EMGS_ASSURANCE: "https://visa.educationmalaysia.gov.my/guidelines/insurance-new-2026",
EMGS_CALCULATEUR: "https://visa.educationmalaysia.gov.my/student-visa/calculate-application-fees",
EMGS_BAREME: "https://visa.educationmalaysia.gov.my/media/cms_upload/Schedule_fees_-_v1.8_2_.pdf",
EMGS_CAUTION: "https://visa.educationmalaysia.gov.my/media/cms_upload/Personal-Bond-Requirementsv1.2.pdf",
EMGS_CERTIFICATION: "https://visa.educationmalaysia.gov.my/media/cms_upload/Document-Certification-Requirementsv_2.0.pdf",
EMGS_DECLARATION_SANTE: "https://visa.educationmalaysia.gov.my/media/docs/Lampiran_B_-_Health_Declaration_Form_For_Applicant.pdf",
EMGS_GUIDE: "https://visa.educationmalaysia.gov.my/media/docs/Student_Visa_Application_User_Guide.pdf?v=1.0%2F",
EMGS_MISSIONS: "https://visa.educationmalaysia.gov.my/media/docs/List_of_Malaysian_Missions_to_Obtain_Single_Entry_Visa_From.pdf",
EMGS_FAQ: "https://educationmalaysia.gov.my/get-in-touch/faq",
EMGS_ARRIVEE: "https://educationmalaysia.gov.my/plan-your-studies/start-to-prepare/on-arrival",
EMGS_ISAC: "https://educationmalaysia.gov.my/plan-your-studies/start-to-prepare/international-student-arrival-centre-(isac)",
IMI_STUDENT_PASS: "https://www.imi.gov.my/index.php/en/main-services/pass/student-pass/",
IMI_VISA_PAYS: "https://www.imi.gov.my/index.php/en/main-services/visa/visa-requirement-by-country/",
IMI_VISA_TARIFS: "https://www.imi.gov.my/index.php/en/main-services/visa/visa-fees/",
MQA_MQR: "https://www2.mqa.gov.my/mqr/english/eperutusan.cfm",
MQA_IPTS: "https://www2.mqa.gov.my/mqr/english/eakrbyipts.cfm",
MQA_ENTREE: "https://www.mqa.gov.my/new/nilai_taraf.cfm",
MOHE_IPTS: "https://jpt.mohe.gov.my/index.php/en/hei/private-hei/25-list-of-private-hei-registration-and-statistic",
UM_CANDIDATURE: "https://study.um.edu.my/how-to-apply",
UM_FAQ_ADMISSION: "https://aasd.um.edu.my/faq-ug-international-admission",
UM_FAQ_INFO: "https://study.um.edu.my/faqs-amp-info",
UM_INTERNATIONAL: "https://study.um.edu.my/international-student",
UM_FRAIS_VISA: "https://study.um.edu.my/doc/VISA%20SERVICES/International%20Student%20Processing%20Fees%20by%20Country%20-%20Updated%2010%20July%202026%202026.pdf",
UM_DROITS_LICENCE: "https://study.um.edu.my/doc/tution-fee/Fee%20Structure,%20UG,%20International%20-%20Updated%2022%20Oct%202025.pdf?_t=1761184801",
UM_DROITS_MASTER: "https://study.um.edu.my/doc/tution-fee/Fee%20Structure,%20PG,%20International%20-%20Updated%2022%20Oct%202025.pdf?_t=1761184209",
UKM_JOIN: "https://join.ukm.my/",
UKM_VISA: "https://www.ukm.my/ukmshape/visa-and-student-pass/",
UKM_DROITS_SSH: "https://shape.ukm.my/storage/lampiran/struktur_yuran/FSSK/pra/strukturyuran_FSSK_UKMi_pra_F_int_120242025.pdf",
UKM_DROITS_INFO: "https://shape.ukm.my/storage/lampiran/struktur_yuran/FTSM/pra/strukturyuran_FTSM_UKMi_pra_F_int.pdf",
UKM_LANGUE_2015: "https://www.ukm.my/akademik/how-to-apply/"
};

export const PROCEDURE_MALAISIE = {

id: "malaisie",
paysDestination: "Malaisie",
portail: {
nom: "EMGS",
url: "https://visa.educationmalaysia.gov.my/",
motif: "educationmalaysia\\.gov\\.my|imi\\.gov\\.my"
},
sources: SOURCES,
residenceRequise: false,

etapes: [

{
id: "my_etablissement",
type: "voeux",
titre: "Choisir un établissement et un programme reconnus",
consigne: "Tout part du choix de l'établissement : la demande de Student Pass passe par EMGS et par un établissement malaisien habilité, jamais par vous seul. Deux familles : les universités publiques (IPTA), comme l'Universiti Malaya (UM) et l'Universiti Kebangsaan Malaysia (UKM), et les établissements privés (IPTS), qui doivent être enregistrés auprès du ministère de l'Enseignement supérieur : sa direction de l'enseignement supérieur (JPT) publie la liste des IPTS enregistrés, et une liste distincte « By MOHA Approval ». Vérifiez ensuite le PROGRAMME, pas seulement l'école, dans le Malaysian Qualifications Register (MQR) de la MQA : c'est le registre national des programmes, diplômes et établissements accrédités, publics comme privés, avec leur période de validité, leur niveau et leur durée. Côté niveau d'entrée, la MQA pose la règle : un diplôme correspondant à 12 ans de scolarité ouvre la licence (niveau 6 du MQF) s'il est le plus haut diplôme scolaire du pays d'origine ET qu'il y donne accès à la licence ; un diplôme de 10 à moins de 12 ans de scolarité n'ouvre que Foundation, certificat (niveau 3) ou Diploma (niveau 4). La liste MQA des diplômes d'entrée reconnus (décembre 2025) n'a pas pu être ouverte : faites confirmer par l'université le traitement de votre baccalauréat. Dernier piège, la langue : une page du Centre de gestion académique de l'UKM, mise à jour en 2015, indique que les licences y sont enseignées en malais — vérifiez la langue de CHAQUE programme avant de candidater.",
prerequis: [],
preuve: "aucune",
pieces: [],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.MQA_MQR,
verifieLe: VERIFIE
},

{
id: "my_langue",
type: "pieces",
titre: "Obtenir mon certificat d'anglais",
consigne: "La plupart des cours sont dispensés en anglais, et EMGS exige un certificat d'anglais dans la demande de Student Pass. Tests acceptés par EMGS : MUET, IELTS, TOEFL iBT, TOEFL Essentials, PTE Academic, qualifications Cambridge English (B1 à C2), Linguaskill, OET ou niveau ELS CIEP. DEUX CONSÉQUENCES si le certificat n'est pas joint à la création de la demande : le traitement peut être retardé, et vous n'aurez PAS droit à un Student Pass couvrant toute la durée du cursus — il faudra le renouveler chaque année. Le score minimal est fixé par l'université : pour une licence, la FAQ d'admission internationale de l'UM accepte IELTS Academic 5.0, TOEFL 60 (iBT), 173 (CBT) ou 500 (PBT), MUET bande 3, ou PTE Academic 41 ; un programme peut exiger davantage. Dans le formulaire EMGS, vous déclarez aussi si votre dernier diplôme a été enseigné et évalué en anglais.",
prerequis: ["my_etablissement"],
preuve: "aucune",
pieces: [
{ nom: "Certificat de test d'anglais (IELTS, TOEFL iBT, MUET, PTE Academic, Cambridge English…)", format: "PDF", tailleMax: null, traduction: false, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.EMGS_PIECES,
verifieLe: VERIFIE
},

{
id: "my_candidature",
type: "soumission",
titre: "Candidater directement auprès de l'université",
consigne: "Il n'existe pas de portail national de candidature pour les étudiants internationaux : vous déposez votre dossier DIRECTEMENT auprès de chaque établissement, sur son propre portail et selon son calendrier. À l'UM : en ligne sur apply.um.edu.my. La page « How to apply » de l'UM, mise à jour le 8 septembre 2026, affiche 500 RM de frais par candidature en mode présentiel, mais sa FAQ écrit encore 300 RM : payez le montant affiché par le portail. Ces frais ne sont pas remboursés et se règlent par FPX, carte de crédit ou de débit, ou Flywire. Calendrier UM pour la rentrée de mars 2027 (semestre II, session 2026-2027) : candidatures du 7 septembre 2026 au 30 janvier 2027, en licence comme en master ; pour le Term I de juin 2027 (masters cliniques uniquement) : du 20 juillet 2026 au 31 janvier 2027. À l'UKM : sur le système JOIN UKM, en vous inscrivant avec votre passeport ; 100 RM (ou 30 USD) de frais strictement non remboursables ; l'UKM demande de candidater au moins deux mois avant la date d'inscription. Sortez de cette étape avec votre numéro de candidature.",
prerequis: ["my_etablissement"],
preuve: "numero_dossier",
pieces: [
{ nom: "Passeport (page d'identité)", format: "PDF", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Diplôme de fin d'études et relevés de notes", format: "PDF", tailleMax: null, traduction: true, legalisation: false, precision: "traduction anglaise si l'université l'exige" },
{ nom: "Certificat d'anglais", format: "PDF", tailleMax: null, traduction: false, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.UM_CANDIDATURE,
verifieLe: VERIFIE
},

{
id: "my_offre",
type: "reponse",
titre: "Recevoir et accepter ma lettre d'offre",
consigne: "L'université annonce sa décision par courriel : l'UM notifie tous les candidats retenus par EMAIL. La lettre d'offre (offer letter) ouvre tout le reste : EMGS exige une copie de la lettre d'offre ou d'acceptation de l'établissement AVANT de pouvoir déposer la demande de Student Pass. À l'UM, acceptez l'offre dans le portail MAYA et créez votre adresse Siswa Mail, la messagerie officielle de l'étudiant de l'UM : c'est par elle que passe la suite. Conservez le PDF original transmis par l'université, sans le modifier ; le guide d'utilisation EMGS limite ce fichier à 550 Ko.",
prerequis: ["my_candidature"],
preuve: "aucune",
pieces: [
{ nom: "Lettre d'offre de l'établissement", format: "PDF", tailleMax: null, traduction: false, legalisation: false, precision: "550 Ko au plus selon le guide d'utilisation EMGS" }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.UM_INTERNATIONAL,
verifieLe: VERIFIE
},

{
id: "my_emgs_dossier",
phaseDepart: true,
type: "pieces",
titre: "Constituer ma demande de Student Pass chez EMGS",
consigne: "La demande de Student Pass se fait EN LIGNE auprès d'EMGS (Education Malaysia Global Services) : par l'établissement via son système STARS, ou par vous-même sur le site EMGS ou l'application EMGS HUB. À l'UM, c'est l'université qui gère obligatoirement ce service eVAL ; à l'UKM, c'est le service UKMShape. Règle absolue de l'Immigration : vous devez être HORS de Malaisie au moment du dépôt. Pièces d'une nouvelle demande : une photo d'identité sur fond BLANC de 35 mm × 45 mm (en ligne, JPG de 217 × 280 pixels au plus selon le guide EMGS) ; la copie du passeport — page d'identité, toutes les pages portant un visa, page d'observations s'il y en a une — valable AU MOINS 18 MOIS ; la lettre d'offre ; le formulaire de déclaration de santé, que vous remplissez vous-même, en anglais ; tous vos diplômes et relevés ; votre certificat d'anglais ; et, si vous venez d'un pays désigné à risque de fièvre jaune par l'OMS, votre certificat de vaccination. Saisissez votre nom EXACTEMENT comme dans la bande lisible par machine (MRZ) du passeport, en majuscules, sans ponctuation. Toute pièce qui n'est ni en anglais ni en malais doit être accompagnée d'une traduction anglaise complète, vérifiable par EMGS, portant la confirmation d'exactitude, la date, le nom complet, la signature et les coordonnées du traducteur. Les copies certifiées conformes le sont, hors de Malaisie, par un avocat, un notaire, un juge de paix ou toute personne habilitée à recevoir une déclaration sous serment, avec cachet et signature. Le guide EMGS conseille de déposer au moins 30 jours avant de quitter votre pays.",
prerequis: ["my_offre", "my_langue"],
preuve: "numero_dossier",
pieces: [
{ nom: "Photo d'identité sur fond blanc (35 mm × 45 mm)", format: "JPG", tailleMax: null, traduction: false, legalisation: false, precision: "217 × 280 pixels au plus selon le guide EMGS" },
{ nom: "Copie du passeport : page d'identité, pages de visa, page d'observations — validité d'au moins 18 mois", format: "PDF", tailleMax: null, traduction: false, legalisation: false, precision: "2 000 Ko au plus selon le guide EMGS" },
{ nom: "Lettre d'offre de l'établissement", format: "PDF", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Formulaire de déclaration de santé EMGS, rempli en anglais", format: "PDF", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Diplômes, relevés de notes et certificats des études antérieures", format: "PDF", tailleMax: null, traduction: true, legalisation: false, precision: "traduction anglaise complète, datée et signée par le traducteur ; copies certifiées conformes" },
{ nom: "Certificat d'anglais", format: "PDF", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Certificat de vaccination contre la fièvre jaune, si vous venez d'un pays à risque", format: "PDF", tailleMax: null, traduction: false, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.EMGS_PIECES,
verifieLe: VERIFIE
},

{
id: "my_caution",
phaseDepart: true,
type: "complement",
titre: "Verser la caution personnelle (personal bond)",
consigne: "L'Immigration exige que l'établissement signe, pour chaque étudiant étranger, une caution personnelle (personal bond) qui l'engage pour une somme fixée selon la nationalité. Vous déposez ce montant auprès de l'établissement ; il vous est RENDU à la fin de vos études ou si vous les arrêtez, à condition de n'avoir enfreint aucune disposition du droit malaisien de l'immigration. Le formulaire de caution, tamponné, peut être remis après l'arrivée, pour l'apposition du Student Pass. MONTANT : la grille EMGS (version 1.2) fixe la somme par nationalité ; le Sénégal n'y est pas nommé et relève donc de sa ligne « Fee for all other countries », 1 500 RM. Faites confirmer le montant par votre établissement avant de payer. Pour comparaison, le Mali, la Côte d'Ivoire, le Cameroun et le Nigeria y figurent à 2 000 RM.",
prerequis: ["my_offre"],
preuve: "recu",
pieces: [
{ nom: "Formulaire de caution personnelle (personal bond), tamponné", format: "original papier", tailleMax: null, traduction: false, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.EMGS_CAUTION,
verifieLe: VERIFIE
},

{
id: "my_emgs_paiement",
phaseDepart: true,
type: "paiement",
titre: "Payer les frais EMGS",
consigne: "Le paiement accompagne la demande EMGS. Montants du barème EMGS mis à jour le 23 juin 2026, pour une université publique de la péninsule : frais de traitement d'une nouvelle demande, 800 RM pour six mois ou moins, 1 600 RM pour plus de six mois et jusqu'à douze mois ; frais d'eVAL, 150 RM. Ces deux frais supportent une taxe de service de 8 % : 1 728 RM de traitement, comme l'affiche le calculateur EMGS pour une nouvelle demande en université publique, et 162 RM d'eVAL. S'y ajoutent : la vignette du Student Pass, 60 RM ; l'i-Kad, 50 RM ; la visite médicale à l'arrivée, 340 RM ; le visa, qui dépend du pays (de 0 à 50 RM, 20 RM pour la plupart) — le calculateur EMGS affiche 20 RM pour le Sénégal ; et l'assurance santé (étape suivante). Les frais de traitement ne sont PAS remboursables, et EMGS n'accepte ni paiement partiel ni trop-perçu. Le guide d'utilisation EMGS, non daté, décrit trois moyens de paiement — par l'établissement, par carte Visa ou Mastercard (3 % de frais de service), ou par virement international en dollars (50 USD de frais) : vérifiez les options à l'écran. À l'UM, vous payez par ePAY@UM DEUX frais distincts : les frais de visa EMGS, qui couvrent l'eVAL, le Student Pass, la visite médicale, l'assurance, l'i-Kad, le visa à entrées multiples et les taxes pour un an, et les frais de traitement de l'étudiant international de l'UM, obligatoires et non remboursables ; la grille de l'UM du 10 juillet 2026 affiche, pour le Sénégal, 5 451 RM pour un visa d'un an et 20 RM de visa à entrées multiples, sans détailler ce que couvre ce total. À l'UKM, tous les frais de demande sont à la charge de l'étudiant et payés directement à EMGS ; depuis le 1er juillet 2026, les frais de visa passent par le portail financier eKewangan de l'UKM. Gardez le reçu et le numéro de demande.",
prerequis: ["my_emgs_dossier"],
preuve: "recu",
pieces: [],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.EMGS_BAREME,
verifieLe: VERIFIE
},

{
id: "my_assurance",
phaseDepart: true,
type: "complement",
titre: "Souscrire l'assurance santé obligatoire",
consigne: "L'assurance santé est OBLIGATOIRE pour tout étudiant entrant en Malaisie, et l'Immigration exige une couverture d'au moins 12 mois. Elle se prend avec la demande, par EMGS ou par l'établissement. Plans agréés 2026, pour douze mois : Etiqa (Plan 2 : 498 RM ; Plan 3 : 567 RM), Great Eastern (Regular : 547 RM ; Premium : 640 RM), The Pacific (Gold : 551 RM ; Platinum : 644 RM), avec un plafond de 30 000 RM ou 50 000 RM selon le plan et une franchise de 25 à 200 RM par visite selon l'assureur. Une police personnelle n'est possible qu'en passant par l'établissement, et seulement si elle respecte les exigences du ministère de l'Enseignement supérieur. La couverture démarre à l'arrivée si l'établissement est averti à temps de votre date d'entrée : communiquez-la-lui. Si l'assurance expire avant votre Student Pass, vous devez la prolonger.",
prerequis: ["my_emgs_dossier"],
preuve: "recu",
pieces: [],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.EMGS_ASSURANCE,
verifieLe: VERIFIE
},

{
id: "my_eval",
phaseDepart: true,
type: "reponse",
titre: "Recevoir mon eVAL (lettre électronique d'approbation de visa)",
consigne: "Une fois le dossier complet et payé, l'établissement confirme la validité de la demande, puis EMGS procède à l'examen académique et délivre la lettre « Approval to Study for International Student ». Le dossier part ensuite à l'unité Student Pass de l'Immigration, qui accorde l'eVAL (electronic Visa Approval Letter) sous réserve du contrôle du document de voyage et des vérifications de sécurité. La charte d'EMGS est de 14 jours ouvrables pour un dossier COMPLET. Suivez l'avancement sur le suivi de demande du site EMGS ou dans l'application. L'eVAL est valable SIX MOIS à compter de sa délivrance, et vous ne pouvez entrer en Malaisie qu'APRÈS l'avoir reçu : organisez visa et voyage dans ce délai.",
prerequis: ["my_emgs_paiement"],
preuve: "capture",
pieces: [
{ nom: "eVAL (electronic Visa Approval Letter)", format: "PDF", tailleMax: null, traduction: false, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.EMGS_FAQ,
verifieLe: VERIFIE
},

{
id: "my_visa",
phaseDepart: true,
type: "visa",
titre: "Demander mon visa à entrée unique (SEV) sur eVISA",
consigne: "L'eVAL ne suffit pas à tout le monde : le Sénégal figure sur la liste EMGS des pays dont les ressortissants doivent obtenir un visa à entrée unique (Single Entry Visa, SEV) AVANT d'entrer en Malaisie, et il n'est pas parmi les pays que l'Immigration dispense de visa de référence pour les études. Une fois l'eVAL obtenu, demandez le SEV EXCLUSIVEMENT sur le portail officiel eVISA de l'Immigration (malaysiavisa.imi.gov.my), accessible partout dans le monde sauf depuis la Malaisie, Israël et la Corée du Nord. Un document EMGS plus ancien désigne l'ambassade de Malaisie à Dakar comme poste de délivrance du SEV pour le Sénégal : la page actuelle de l'Immigration dit « exclusivement » eVISA — suivez-la, et en cas de doute, interrogez votre université. Le droit de visa est de 20 RM pour un Sénégalais : le barème de l'Immigration fixe 20 RM pour tous les pays qu'il ne liste pas, dont le Sénégal. Les éventuels frais de service du portail eVISA ne figurent pas sur les pages que nous avons pu lire. L'UM prévient : voyager sans SEV valide, quand il est exigé, peut retarder ou compliquer votre Student Pass ; ses étudiants envoient leur SEV en PDF à l'équipe eVAL (eval@um.edu.my). Passeport : voyagez avec celui qui a servi à la demande.",
prerequis: ["my_eval"],
preuve: "recu",
pieces: [
{ nom: "eVAL", format: "PDF", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Passeport utilisé pour la demande EMGS", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Visa à entrée unique (SEV) délivré par eVISA", format: "PDF", tailleMax: null, traduction: false, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.IMI_STUDENT_PASS,
verifieLe: VERIFIE
},

{
id: "my_arrivee",
phaseDepart: true,
type: "confirmation",
titre: "Arriver en Malaisie et passer par le comptoir ISAC",
consigne: "Voyagez avec, EN MAIN et non en soute : le passeport utilisé pour la demande, l'eVAL, votre SEV et la lettre d'offre. À l'aéroport international de Kuala Lumpur (KLIA, terminaux 1 et 2), rendez-vous au comptoir ISAC d'EMGS (International Student Arrival Centre), ouvert 24 heures sur 24 : il assiste les étudiants internationaux AVANT leur passage à la porte de l'Immigration et leur ouvre des files prioritaires. L'UM demande à ses étudiants de s'y présenter pour la coordination et la vérification du Student Pass, et de n'entrer en Malaisie PAS PLUS de deux semaines avant la semaine d'orientation. Si vous arrivez d'un pays à risque de fièvre jaune, l'Immigration exige le certificat de vaccination à l'arrivée ; la liste des pays concernés est tenue par le ministère malaisien de la Santé, que nous n'avons pas pu consulter : emportez votre carnet international de vaccination. Dès l'arrivée, le délai de la visite médicale commence à courir.",
prerequis: ["my_visa"],
preuve: "aucune",
pieces: [],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.EMGS_ISAC,
verifieLe: VERIFIE
},

{
id: "my_medical",
phaseDepart: true,
type: "complement",
titre: "Passer la visite médicale dans les 7 jours ouvrables",
consigne: "Tout nouvel étudiant international doit passer une visite médicale dans une clinique agréée (panel clinic) en Malaisie, dans les 7 JOURS OUVRABLES suivant son arrivée selon EMGS — l'Immigration écrit « dans les 7 jours » : ne jouez pas sur la différence, allez-y dès les premiers jours. La liste des cliniques est sur le site EMGS et dans l'application EMGS ; le calculateur EMGS propose aussi une option « cliniques des universités publiques ». Sans cette visite, EMGS NE PEUT PAS lancer l'apposition du Student Pass ni délivrer la lettre de soutien nécessaire à la vignette. Les frais (340 RM au barème du 23 juin 2026, pour une université publique de la péninsule) font partie des frais EMGS. Selon l'UM, comptez 3 à 4 jours ouvrables pour que les résultats remontent dans le système EMGS. La visite n'est pas exigée pour un renouvellement ; en cas de changement d'établissement ou de cursus, elle l'est si la dernière date de plus de 90 jours.",
prerequis: ["my_arrivee"],
preuve: "capture",
pieces: [
{ nom: "Passeport", format: "original papier", tailleMax: null, traduction: false, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.EMGS_MEDICAL,
verifieLe: VERIFIE
},

{
id: "my_inscription",
phaseDepart: true,
type: "confirmation",
titre: "M'enregistrer à l'université",
consigne: "Une fois arrivé, présentez-vous au bureau des étudiants internationaux de votre université pour vous enregistrer, avec votre passeport, votre visa et votre lettre d'acceptation, comme l'indique la page « On Arrival » d'EMGS. À l'UM, les droits de scolarité se paient par semestre, et peuvent être réglés une à deux semaines après l'inscription et le début des cours. Conservez tous les reçus.",
prerequis: ["my_arrivee"],
preuve: "capture",
pieces: [
{ nom: "Passeport avec visa", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Lettre d'offre ou d'acceptation", format: "original papier", tailleMax: null, traduction: false, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.EMGS_ARRIVEE,
verifieLe: VERIFIE
},

{
id: "my_student_pass",
phaseDepart: true,
type: "complement",
titre: "Obtenir l'apposition du Student Pass et mon i-Kad",
consigne: "Une fois la visite médicale passée et la lettre de soutien d'EMGS délivrée, c'est l'ÉTABLISSEMENT qui dépose votre demande au bureau de l'Immigration le plus proche de son adresse, pour l'apposition (endorsement) et la délivrance du Student Pass : une vignette de 60 RM collée dans le passeport. L'i-Kad, votre carte d'étudiant étranger (50 RM), est retirée par les représentants de l'établissement ou envoyée à ses bureaux (10 RM de courrier). Sa durée : EMGS précise qu'il couvre toute la durée du cursus si le certificat d'anglais a été joint à la demande ; sinon, il se renouvelle chaque année. Le travail est encadré : l'Immigration autorise au plus 20 heures par semaine dans des lieux agréés, et la FAQ d'EMGS précise « pendant les vacances semestrielles, avec l'accord préalable de l'Immigration » — ne travaillez jamais sans cet accord. RENOUVELLEMENT, quand il y a lieu : EMGS recommande de déposer la demande dès trois mois avant l'échéance ; il faut une moyenne cumulée (CGPA) d'au moins 2.0 et une assiduité d'au moins 80 %, sinon une lettre d'explication. Frais en université publique : 250 RM de traitement plus 8 % de taxe (270 RM au calculateur EMGS) et 60 RM de vignette, sans visite médicale. Prolongez votre assurance si elle expire avant le nouveau pass. Changer d'établissement, de cursus ou de niveau est une autre demande (« variation » ou « progression »).",
prerequis: ["my_medical", "my_inscription"],
preuve: "aucune",
pieces: [
{ nom: "Passeport", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Formulaire de caution personnelle tamponné, s'il n'a pas été remis avant", format: "original papier", tailleMax: null, traduction: false, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.IMI_STUDENT_PASS,
verifieLe: VERIFIE
}

]
};
