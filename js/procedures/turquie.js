/**
* ============================================================
* FitzUniverse — le TRONC de la procédure Turquie (lot S3)
* ============================================================
*
* DEUX VOIES, ET IL FAUT CHOISIR TÔT. La bourse Türkiye Bursları se
* candidate UNE SEULE FOIS PAR AN, du 10 janvier au 20 février, sur un
* système unique (TBBS), et c'est elle qui place le lauréat dans une
* université et un département — l'étudiant ne postule pas aux
* universités. La voie autofinancée passe par un examen (TR-YÖS de
* l'ÖSYM, ou YÖS propre à l'établissement, ou équivalent accepté) puis
* par une candidature directe à chaque université, sur les quotas
* publiés par le YÖK. Les deux voies sont dans ce tronc, et l'étape
* tr_choix_voie dit qu'il faut trancher AVANT décembre si on vise la
* bourse : le calendrier est fixe et sans rattrapage.
*
* LE PIÈGE DES DEUX MINISTÈRES. L'équivalence du diplôme de fin de
* SECONDAIRE est délivrée par le ministère de l'Éducation nationale
* (MEB), via e-Denklik. Celle des diplômes de l'ENSEIGNEMENT SUPÉRIEUR
* relève du YÖK. Confondre les deux fait perdre des semaines, et c'est
* l'erreur la plus fréquente.
*
* AUCUNE COUCHE DE RÉSIDENCE : le calendrier Türkiye Bursları et le
* calendrier ÖSYM sont nationaux ; seuls le consulat compétent et un
* nombre de questions au test de licence varient par pays, et l'étape
* concernée le dit. `residenceRequise: false`.
*
* CE QU'ON N'A PAS TROUVÉ : le montant des frais d'examen TR-YÖS
* (publié uniquement dans le guide PDF de chaque session, serveur
* inaccessible) et le droit de visa étudiant pour les nationalités
* d'Afrique de l'Ouest et du Maghreb (le barème en ligne du ministère
* ne couvre que l'e-visa et le visa à l'arrivée). Les deux sont dits
* comme introuvables dans la consigne, avec l'endroit où les lire.
* ============================================================
*/

const VERIFIE = "2026-09-13";

export const SOURCES = {
PORTAIL: "https://studyinturkiye.gov.tr/",
TRYOS_INFO: "https://studyinturkiye.gov.tr/StudyinTurkey/StudyinTurkeyTRYOS",
VISA_SEJOUR: "https://studyinturkiye.gov.tr/StudyinTurkey/ShowDetail?rID=Egqvn0o1tiU=&&cId=PE4Nr0mMoY4=",
SANTE: "https://studyinturkiye.gov.tr/StudyinTurkey/ShowDetail?rID=aOSryNclUYg=&&cId=PE4Nr0mMoY4=",
TB_CRITERES: "https://turkiyeburslari.gov.tr/scholarshipsprograms",
TB_ETAPES: "https://turkiyeburslari.gov.tr/applysteps",
TB_ANNONCE: "https://turkiyeburslari.gov.tr/announcements/turkiye-scholarships-2026-applications-121",
TB_COUVERTURE: "https://turkiyeburslari.gov.tr/fulltimeprograms",
TB_AVANTAGES: "https://turkiyeburslari.gov.tr/whyturkiyescholarships",
TB_EVALUATION: "https://turkiyeburslari.gov.tr/evaluationandselectionprocess",
OSYM_OUVERTURE: "https://www.osym.gov.tr/2026-turkiye-yurt-disindan-ogrenci-kabul-sinavi-2026tryos2-basvurularinin-alinmasiapplications-for-2026-exam-for-foreign-students-for-higher-education-in-turkiye-2026tryos2",
OSYM_PROLONGATION: "https://www.osym.gov.tr/2026-turkiye-yurt-disindan-ogrenci-kabul-sinavi-2026-tr-yos2-basvuru-suresinin-uzatilmasi-extension-of-the-application-period-for-2026-exam-for-foreign-students-for-higher-education-in-turkiye-2026-tr-yos2",
MEB_DENKLIK: "https://edenklik.meb.gov.tr/",
MFA_VISA: "https://www.mfa.gov.tr/visa-information-for-foreigners.en.mfa",
IKAMET: "https://www.goc.gov.tr/ikamet-sss"
};

export const PROCEDURE_TURQUIE = {

id: "turquie",
paysDestination: "Turquie",
portail: {
nom: "Study in Türkiye (YÖK)",
url: "https://studyinturkiye.gov.tr/",
motif: "studyinturkiye\\.gov\\.tr|turkiyeburslari\\.gov\\.tr"
},
sources: SOURCES,
residenceRequise: false,

etapes: [

{
id: "tr_denklik",
type: "pieces",
titre: "Faire reconnaître mon diplôme de fin de secondaire (denklik)",
consigne: "Le denklik de votre baccalauréat est délivré par le ministère de l'ÉDUCATION NATIONALE (MEB), pas par le YÖK — c'est la confusion la plus fréquente, et elle coûte des semaines. Déposez une pré-demande en ligne sur e-Denklik, puis présentez-vous dans l'un des 227 centres de denklik : 146 en Turquie et 81 À L'ÉTRANGER, rattachés aux représentations turques. Ce dernier point est précieux : vous pouvez engager la démarche DEPUIS VOTRE PAYS, avant le départ. Vous devez obtenir le Denklik Belgesi : il vous sera réclamé au moment de l'inscription universitaire. Le YÖK, lui, ne traite que les diplômes de l'enseignement supérieur obtenus à l'étranger.",
prerequis: [],
preuve: "numero_dossier",
pieces: [
{ nom: "Diplôme de fin d'études secondaires", format: "original papier", tailleMax: null, traduction: true, legalisation: true, precision: "traduction assermentée en turc ; apostille" },
{ nom: "Relevé de notes des années du secondaire", format: "original papier", tailleMax: null, traduction: true, legalisation: true },
{ nom: "Formulaire de demande de denklik", format: "PDF", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Passeport", format: "original papier", tailleMax: null, traduction: false, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.MEB_DENKLIK,
verifieLe: VERIFIE
},

{
id: "tr_choix_voie",
type: "saisie",
titre: "Choisir ma voie : bourse Türkiye Bursları ou autofinancement",
consigne: "Deux voies mènent à une université turque, et elles ne se ressemblent pas. La bourse Türkiye Bursları, financée par l'État, se candidate UNE SEULE FOIS PAR AN, du 10 janvier au 20 février, sur un système unique ; c'est elle qui vous PLACE dans une université et un département, vous ne postulez pas ailleurs. La voie autofinancée passe par une candidature directe à chaque université, sur les quotas d'étudiants internationaux publiés chaque année par le YÖK sous l'onglet « Students Who will Fund their Studies », avec un score d'examen exigé par l'établissement : TR-YÖS, YÖS propre à l'université, ou équivalent tel que SAT, Abitur ou IB. Tranchez AVANT décembre si vous visez la bourse : le calendrier est fixe, il n'y a pas de session de rattrapage, et rater le 20 février coûte une année entière. Les deux voies ne s'excluent pas dans l'absolu, mais elles demandent deux préparations différentes.",
prerequis: [],
preuve: "aucune",
pieces: [],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.TRYOS_INFO,
verifieLe: VERIFIE
},

{
id: "tr_tb_compte",
type: "compte",
titre: "Créer mon compte sur le système Türkiye Bursları (TBBS)",
consigne: "La candidature à la bourse se fait EXCLUSIVEMENT en ligne, sur le Türkiye Scholarships Application System. Créez votre compte dès l'ouverture, annoncée chaque année pour la période du 10 janvier au 20 février. Vérifiez AVANT de commencer que vous remplissez les critères, sinon vous perdez votre temps : moyenne minimale de 70 % pour l'associate et la licence, 75 % pour le master et le doctorat, 90 % pour les sciences de la santé (médecine, dentaire, pharmacie). Et les limites d'âge : moins de 21 ans pour l'associate et la licence, moins de 30 ans pour le master, moins de 35 ans pour le doctorat. Les ressortissants turcs et anciens ressortissants turcs sont inéligibles.",
prerequis: ["tr_choix_voie"],
preuve: "capture",
pieces: [],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.TB_CRITERES,
verifieLe: VERIFIE
},

{
id: "tr_tb_pieces",
type: "pieces",
titre: "Téléverser mes pièces dans TBBS",
consigne: "Tous les candidats téléversent : un document d'identité valide (carte d'identité ou passeport), une photographie DE MOINS D'UN AN, les résultats de vos examens nationaux s'il en existe dans votre pays, votre diplôme ou une attestation provisoire de fin d'études, et votre relevé de notes. Ajoutez les résultats d'examens internationaux (GRE, GMAT, SAT) et de tests de langue (TOEFL, DELF) si l'université ou le programme visé les exige. Les candidats au doctorat ajoutent une proposition de sujet de recherche et un exemple écrit de leurs travaux. Si vous n'avez pas de résultat d'examen national mais des qualifications internationales de type SAT ou GCSE, vous devez fournir le niveau minimal requis pour valider le secondaire selon ces examens. Les formats et tailles maximales de fichiers ne sont pas publiés : préparez des PDF lisibles et légers.",
prerequis: ["tr_tb_compte"],
preuve: "capture",
pieces: [
{ nom: "Document d'identité valide (carte d'identité ou passeport)", format: "scan", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Photographie prise dans l'année écoulée", format: "scan", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Résultats d'examens nationaux, le cas échéant", format: "scan", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Diplôme ou attestation provisoire de fin d'études", format: "scan", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Relevé de notes", format: "scan", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Résultats d'examens internationaux (GRE, GMAT, SAT), si exigés par le programme", format: "scan", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Test de langue (TOEFL, DELF ou équivalent), si exigé par le programme", format: "scan", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Doctorat : proposition de sujet de recherche et exemple de travaux écrits", format: "scan", tailleMax: null, traduction: false, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.TB_ETAPES,
verifieLe: VERIFIE
},

{
id: "tr_tb_voeux",
type: "voeux",
titre: "Exprimer mes douze préférences dans TBBS",
consigne: "Türkiye Bursları place elle-même ses lauréats : vous ne postulez pas auprès des universités, vous exprimez des préférences, et douze choix vous sont ouverts. Les universités et départements proposés dépendent de votre parcours antérieur, et vous ne pouvez choisir que parmi ceux que le système vous présente. Vérifiez pour chaque programme sa LANGUE d'enseignement : beaucoup de cursus sont en turc, certains en anglais ou dans une autre langue, et ceux-là exigent alors un certificat de langue internationalement reconnu, le plus souvent accompagné d'un score d'admission international (GRE, GMAT, SAT). Une exclusion à connaître : Türkiye Bursları n'attribue pas de bourse en sciences de la santé au niveau master et doctorat.",
prerequis: ["tr_tb_pieces"],
preuve: "capture",
pieces: [],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.TB_AVANTAGES,
verifieLe: VERIFIE
},

{
id: "tr_tb_soumission",
type: "soumission",
titre: "Soumettre ma candidature avant le 20 février",
consigne: "Validez et soumettez votre dossier AU PLUS TARD le dernier jour de la période annuelle : le 20 février pour l'édition ouverte le 10 janvier 2026. La candidature est GRATUITE — aucun frais de dossier n'est mentionné sur les pages officielles, donc si on vous en réclame, c'est une arnaque. Conservez votre preuve de soumission et votre numéro de dossier : convocation au test, à l'entretien, et résultats vous sont notifiés VIA TBBS et nulle part ailleurs. Les autres programmes du YTB — Research Scholarships, Success Scholarships, KATİP — ont des périodes différentes, annoncées séparément.",
prerequis: ["tr_tb_voeux"],
preuve: "numero_dossier",
pieces: [],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.TB_ANNONCE,
verifieLe: VERIFIE
},

{
id: "tr_tb_entretien",
type: "entretien",
titre: "Passer le test écrit et l'entretien",
consigne: "Après une présélection administrative puis une évaluation par un comité d'experts, les candidats retenus sont convoqués : l'évaluation se déroule de mars à avril, les entretiens d'avril à juin. En licence, vous passez AVANT l'entretien un test de 30 questions de mathématiques, géométrie et logique, en 60 minutes ; les énoncés nécessitant une explication sont fournis en turc et en anglais. Des variantes existent : 50 questions pour l'Azerbaïdjan, la Grèce et la RTCN, et des épreuves de 80 à 100 questions dans les pays à forte affluence comme l'Afghanistan et le Soudan. L'entretien dure généralement 15 à 30 minutes et se tient LE MÊME JOUR que le test, en session du matin ou de l'après-midi. Apportez tous les documents et certificats de votre dernière formation achevée, en original.",
prerequis: ["tr_tb_soumission"],
preuve: "convocation",
pieces: [
{ nom: "Documents et certificats du dernier niveau d'études achevé, en original", format: "original papier", tailleMax: null, traduction: false, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.TB_EVALUATION,
verifieLe: VERIFIE
},

{
id: "tr_tb_reponse",
type: "reponse",
titre: "Recevoir les résultats et savoir ce que la bourse couvre",
consigne: "Les résultats tombent début août, les formalités initiales se font en août, et les transferts vers la Turquie en septembre. La bourse couvre : le placement en université et département, les frais de scolarité, une année de cours de turc, l'hébergement, l'assurance maladie, et un billet d'avion aller à l'arrivée puis un retour à la fin des études. L'allocation mensuelle est de 4 500 TL en associate et licence, 6 500 TL en master, 9 000 TL en doctorat, doublée pour les lauréats du Merit Scholarship Program ; les étudiants de master et doctorat logent en résidence la première année puis reçoivent une aide au logement de 6 000 TL à Istanbul et Ankara, 5 000 TL ailleurs. UNE OBLIGATION QUE BEAUCOUP DÉCOUVRENT TROP TARD : tout boursier qui n'a pas de certificat de turc de niveau C1 doit suivre UN AN de cours de turc et atteindre C1 en fin d'année académique — y compris s'il est placé dans un programme enseigné en anglais.",
prerequis: ["tr_tb_entretien"],
preuve: "capture",
pieces: [],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.TB_COUVERTURE,
verifieLe: VERIFIE
},

{
id: "tr_yos_inscription",
type: "compte",
titre: "M'inscrire à l'examen TR-YÖS (voie autofinancée)",
consigne: "Le TR-YÖS est l'examen d'admission des étudiants internationaux, organisé DEUX FOIS PAR AN par l'ÖSYM, le centre national d'évaluation, en turc, allemand, arabe, FRANÇAIS, anglais et russe, dans des centres en Turquie et à l'étranger. Vous vous inscrivez individuellement sur le portail de l'ÖSYM. Pour la session 2026-TR-YÖS/2, l'examen a lieu le 11 octobre 2026 et les candidatures ont été reçues du 9 juillet 2026 à 10h00 au 3 août 2026, prolongées jusqu'au 11 août 2026 ; la session 2026-TR-YÖS/1 avait publié ses résultats le 27 avril 2026. Bonne nouvelle : aucun certificat de langue turque n'est exigé pour PASSER le TR-YÖS. Lisez le guide de candidature (Kılavuz) de votre session, publié sur la page TR-YÖS de l'ÖSYM : c'est là, et seulement là, que figure le montant des frais d'examen.",
prerequis: ["tr_choix_voie"],
preuve: "numero_dossier",
pieces: [
{ nom: "Passeport ou document d'identité accepté par l'ÖSYM", format: "scan", tailleMax: null, traduction: false, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.OSYM_OUVERTURE,
verifieLe: VERIFIE
},

{
id: "tr_yos_paiement",
type: "paiement",
titre: "Payer les frais d'examen TR-YÖS",
consigne: "Votre inscription au TR-YÖS n'est validée QU'APRÈS paiement des frais, effectué depuis le portail de candidature de l'ÖSYM. Pour la session 2026-TR-YÖS/2, l'ÖSYM a prolongé conjointement « les opérations de candidature ET de paiement des frais d'examen » jusqu'au 11 août 2026, pour un examen fixé au 11 octobre : un dossier saisi mais NON PAYÉ à cette date n'existe pas. Le montant exact n'est publié que dans le guide PDF de la session, sur le serveur documentaire de l'ÖSYM : lisez-le avant de payer, nous ne le reproduisons pas ici faute d'avoir pu l'ouvrir nous-mêmes.",
prerequis: ["tr_yos_inscription"],
preuve: "recu",
pieces: [],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.OSYM_PROLONGATION,
verifieLe: VERIFIE
},

{
id: "tr_uni_candidature",
type: "soumission",
titre: "Candidater aux universités sur les quotas internationaux",
consigne: "Les quotas réservés aux étudiants internationaux, dans les universités publiques comme dans les universités de fondation, sont publiés chaque année par le YÖK sous l'onglet « Students Who will Fund their Studies » de la rubrique « Students ». Chaque université fixe ses PROPRES conditions et la liste des examens qu'elle accepte — TR-YÖS, YÖS maison, Abitur, SAT ou IB — indiquée sur son site officiel. Vous déposez donc un dossier PAR université visée, avec les pièces exigées par chacune. Repère de calendrier : les YÖS organisés par les universités de fondation s'ouvrent généralement en février ou mars, certaines acceptant les candidatures jusqu'en mai. Certains programmes d'arts, de musique et de sport imposent en plus une épreuve d'aptitude spécifique.",
prerequis: ["tr_yos_paiement", "tr_denklik"],
preuve: "numero_dossier",
pieces: [
{ nom: "Relevé de score TR-YÖS, YÖS ou examen équivalent accepté par l'université", format: "scan", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Diplôme de fin de secondaire et relevé de notes", format: "scan", tailleMax: null, traduction: true, legalisation: false, precision: "traduction assermentée en turc" },
{ nom: "Passeport", format: "scan", tailleMax: null, traduction: false, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.TRYOS_INFO,
verifieLe: VERIFIE
},

{
id: "tr_admission",
type: "reponse",
titre: "Obtenir ma lettre d'acceptation",
consigne: "L'université rend sa décision sous forme de lettre d'acceptation. C'est la clé de tout ce qui suit : le portail officiel du YÖK dit de déposer la demande de visa étudiant DÈS réception de cette lettre, parce que les procédures consulaires prennent du temps. Si vous êtes boursier Türkiye Bursları, votre placement vous vient directement du programme et vous n'avez pas de candidature séparée à déposer. Conservez l'ORIGINAL : il vous sera redemandé au consulat, puis à l'inscription sur place, puis à l'appui de votre demande de permis de séjour.",
prerequis: ["tr_uni_candidature"],
preuve: "capture",
pieces: [
{ nom: "Lettre d'acceptation de l'université turque", format: "original papier", tailleMax: null, traduction: false, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.VISA_SEJOUR,
verifieLe: VERIFIE
},

{
id: "tr_visa",
phaseDepart: true,
type: "visa",
titre: "Demander mon visa étudiant au consulat de Türkiye",
consigne: "Le visa électronique turc ne vaut QUE pour le tourisme et le commerce : le ministère des Affaires étrangères précise que pour tous les autres motifs, dont les études, le visa est délivré par les ambassades et consulats. Déposez donc votre demande auprès de la représentation turque la plus proche de votre domicile, après pré-demande en ligne sur le portail consulaire, qui sert aussi à prendre rendez-vous. Une règle qui recale beaucoup de dossiers : votre passeport doit être valable AU MOINS 60 JOURS au-delà de la durée de séjour accordée par le visa (article 7.1b de la loi n° 6458, en vigueur depuis le 1er janvier 2015). Le montant du droit de visa étudiant dépend de votre nationalité et n'est pas publié dans le barème en ligne du ministère, qui ne couvre que l'e-visa et le visa à l'arrivée : demandez-le au consulat compétent, nous ne l'inventons pas.",
prerequis: ["tr_admission"],
preuve: "recu",
pieces: [
{ nom: "Lettre d'acceptation de l'université turque", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Passeport valable au moins 60 jours au-delà de la durée de séjour du visa", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Formulaire de demande de visa", format: "PDF", tailleMax: null, traduction: false, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.MFA_VISA,
verifieLe: VERIFIE
},

{
id: "tr_inscription",
phaseDepart: true,
type: "confirmation",
titre: "M'inscrire à l'université à l'arrivée",
consigne: "Arrivé en Turquie avec votre visa étudiant, présentez-vous au bureau de la scolarité (Student Affairs Office) ou au bureau des étudiants internationaux de votre université, avec les ORIGINAUX de votre diplôme, de votre certificat de denklik du MEB et de votre lettre d'acceptation. Cette inscription commande tout le reste : c'est elle qui ouvre le droit au permis de séjour étudiant, et c'est elle qui fait courir le délai de trois mois pour l'assurance maladie publique. Obtenez et conservez votre certificat d'inscription (öğrenci belgesi) : il est exigé pour la demande de permis de séjour.",
prerequis: ["tr_visa"],
preuve: "capture",
pieces: [
{ nom: "Certificat de denklik délivré par le MEB", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Diplôme de fin de secondaire et relevé de notes", format: "original papier", tailleMax: null, traduction: true, legalisation: false },
{ nom: "Lettre d'acceptation et passeport avec visa étudiant", format: "original papier", tailleMax: null, traduction: false, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.VISA_SEJOUR,
verifieLe: VERIFIE
},

{
id: "tr_ikamet",
phaseDepart: true,
type: "complement",
titre: "Demander mon permis de séjour sur e-ikamet",
consigne: "Le permis de séjour étudiant est obligatoire pour tout étranger inscrit dans un programme d'enseignement supérieur (articles 38 à 41 de la loi n° 6458). Il ne se demande PAS depuis l'étranger : vous devez d'abord entrer en Turquie, puis déposer votre demande en ligne, GRATUITEMENT, sur le système e-ikamet, où vous prenez aussi votre rendez-vous. La date de référence n'est pas celle de votre arrivée mais celle de la FIN DE VOTRE VISA : l'administration précise que les demandes en ligne faites dans les 10 jours suivant l'expiration du visa ou de l'exemption restent recevables, et que le permis court à partir de la date d'expiration du visa. Votre passeport doit être valable au moins 60 jours de plus que la durée de séjour sollicitée. La décision intervient dans un délai maximal de 90 jours à compter de la remise complète des pièces, et l'administration peut vous accorder jusqu'à 30 jours pour compléter un dossier incomplet. Depuis le protocole YÖK–ministère de l'Intérieur du 29 novembre 2023, remettez le formulaire d'enregistrement et les pièces au bureau compétent de votre université SANS ATTENDRE la date de votre rendez-vous. Côté frais 2026 : la carte elle-même coûte 964,00 TL, sans exemption pour aucune nationalité, mais le droit de séjour (harç) n'est PAS perçu pour les étudiants des écoles et facultés turques ; tout doit être payé avant la date du rendez-vous. Aucun permis n'est délivré pour l'enseignement ouvert ou à distance.",
prerequis: ["tr_inscription"],
preuve: "numero_dossier",
pieces: [
{ nom: "Formulaire d'enregistrement de demande de permis de séjour étudiant", format: "PDF", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Certificat d'inscription universitaire (öğrenci belgesi)", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Passeport valable au moins 60 jours de plus que la durée de séjour demandée", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Justificatif d'adresse de résidence en Turquie", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Reçu du paiement du coût de la carte (964,00 TL en 2026)", format: "original papier", tailleMax: null, traduction: false, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.IKAMET,
verifieLe: VERIFIE
},

{
id: "tr_assurance",
phaseDepart: true,
type: "complement",
titre: "M'assurer dans les trois mois qui suivent l'inscription",
consigne: "Vous devez être couvert par une assurance maladie pendant toute la durée de votre séjour officiel. Deux options : une police privée pour étrangers, dont la couverture est limitée aux hôpitaux conventionnés ; ou l'assurance maladie générale publique (Genel Sağlık Sigortası, GSS), qui ouvre les soins gratuits dans TOUS les hôpitaux publics et laisse un reste à charge très faible sur les médicaments. LE POINT CRITIQUE EST UN DÉLAI : la demande de GSS doit être déposée dans les TROIS MOIS qui suivent votre inscription universitaire. Passé ce délai, le droit est perdu définitivement et une assurance privée devient obligatoire — c'est irréversible. L'assurance se renouvelle chaque année, et c'est aussi la condition du renouvellement de votre permis de séjour. Les boursiers Türkiye Bursları ont leur assurance prise en charge par le programme.",
prerequis: ["tr_inscription"],
preuve: "recu",
pieces: [
{ nom: "Demande d'affiliation à la GSS auprès de l'institution de sécurité sociale", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Certificat d'inscription universitaire", format: "original papier", tailleMax: null, traduction: false, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.SANTE,
verifieLe: VERIFIE
}

]
};
