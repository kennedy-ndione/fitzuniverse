/**
* ============================================================
* FitzUniverse — le TRONC de la procédure Maroc (lot S3)
* ============================================================
*
* LA PHRASE QUI COMMANDE TOUT LE RESTE, citée mot pour mot par
* l'Université Cadi Ayyad : « Tout dossier non transmis par l'AMCI ne
* sera pas pris en considération ». Pour un établissement PUBLIC
* marocain, il n'existe AUCUNE candidature directe : le dossier part de
* l'autorité compétente du pays d'origine, passe par la voie
* diplomatique, arrive à l'Agence Marocaine de Coopération
* Internationale, puis au ministère, qui délivre une autorisation
* d'inscription électronique. Un étudiant qui écrit à une université
* marocaine attend une réponse qui ne viendra jamais.
*
* IL EXISTE UNE SECONDE PORTE, et elle est légitime : l'UM6P et Al
* Akhawayn admettent directement, sans passer par l'AMCI. Elles sont
* dans ce tronc, à la fin, parce qu'un étudiant qui rate la campagne
* AMCI de juillet n'est pas pour autant sans solution.
*
* AUCUNE COUCHE DE RÉSIDENCE — et pourtant la nationalité compte
* énormément ici, pour le visa. On ne l'a pas mise en couche : on l'a
* mise DANS la consigne de ma_visa, nationalité par nationalité, telle
* que la liste officielle du portail consulaire la publie. Un fragment
* par pays aurait dispersé une information qui se lit mieux d'un bloc.
* `residenceRequise: false`.
*
* CE QU'ON N'A PAS TROUVÉ, et qu'on refuse d'estimer : le calendrier
* détaillé de la campagne AMCI au-delà de la date de dépôt du 31
* juillet, le montant de la bourse mensuelle du Royaume, les droits
* d'inscription des universités publiques pour un étudiant
* international, le nombre maximum de vœux, et le délai exact en jours
* pour déposer la carte de séjour après l'arrivée. Plusieurs sites
* officiels marocains refusent la lecture automatisée : c'est dit, ce
* n'est pas contourné.
* ============================================================
*/

const VERIFIE = "2026-09-13";

export const SOURCES = {
AMCI: "https://www.amci.ma/",
AMCI_COOPERATION: "https://www.amci.ma/cooperation-academique",
AMCI_FORMULAIRE: "https://www.amci.ma/sites/default/files/2022-05/Formulaire%20de%20candidature%202022-2023.pdf",
AMBASSADE: "https://fr.diplomatie.ma/fr/etudier-au-maroc",
CONSULAT_VISAS: "https://www.consulat.ma/fr/visas-ordinaires",
CONSULAT_DISPENSE: "https://www.consulat.ma/fr/liste-des-pays-dont-les-ressortissants-sont-dispenses-du-visa-dentree-au-maroc",
AEVM: "https://www.acces-maroc.ma/",
UM5: "https://www.um5.ac.ma/um5/inscription-des-etudiants-internationaux",
UCA_AMCI: "https://www.uca.ma/fr/page/agence-marocaine-de-la-cooperation-internationale-amci",
UCA_SEJOUR: "https://www.uca.ma/fr/page/maroc-pays-daccueil",
UH1: "https://www.uh1.ac.ma/vie-estudiantine/vie-pratique/etudiants-etrangers/",
ENSSUP: "https://www.enssup.gov.ma/en/la-mobilite-etudiante",
UM6P: "https://um6p.ma/en/enrollment/admissions",
AUI: "https://aui.ma/admission-aid/internationals"
};

export const PROCEDURE_MAROC = {

id: "maroc",
paysDestination: "Maroc",
portail: {
nom: "AMCI — Agence Marocaine de Coopération Internationale",
url: "https://www.amci.ma/",
motif: "amci\\.ma"
},
sources: SOURCES,
residenceRequise: false,

etapes: [

{
id: "ma_porte_entree",
type: "compte",
titre: "Comprendre qu'il n'y a pas de candidature directe",
consigne: "Avant tout : pour une université PUBLIQUE marocaine, vous ne créez aucun compte et vous ne déposez aucune candidature en ligne. L'Université Mohammed V l'écrit : « Les candidatures des étudiants internationaux à une inscription à l'Université sont soumises par voie diplomatique à l'Agence Marocaine de Coopération Internationale (AMCI) ». L'Université Cadi Ayyad ajoute : « Tout dossier non transmis par l'AMCI ne sera pas pris en considération ». Votre travail à cette étape est donc d'identifier deux choses : l'autorité de VOTRE pays qui transmet les dossiers — le plus souvent la direction nationale des bourses ou le ministère des Affaires étrangères — et l'ambassade du Maroc accréditée chez vous. Écrire directement à une université marocaine ne produira rien. Si cette voie ne vous convient pas, sautez aux deux dernières étapes : l'UM6P et Al Akhawayn admettent en direct.",
prerequis: [],
preuve: "aucune",
pieces: [],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.UM5,
verifieLe: VERIFIE
},

{
id: "ma_formulaire",
type: "saisie",
titre: "Remplir le formulaire de candidature AMCI",
consigne: "Téléchargez le « Formulaire de candidature pour une formation au Maroc » publié par l'AMCI et remplissez-le intégralement : état civil, filiation, parcours scolaire, niveau demandé. C'est un document PAPIER à remplir et à joindre au dossier — il n'existe pas de saisie en ligne côté étudiant. UN AVERTISSEMENT UTILE : le seul millésime publié sur le site de l'AMCI à ce jour est celui de l'année 2022/2023. Demandez à votre autorité nationale de transmission, ou à l'ambassade du Maroc, le formulaire de la campagne en cours avant de remplir celui-là. Vous devez en sortir avec un formulaire complet, daté et signé.",
prerequis: ["ma_porte_entree"],
preuve: "aucune",
pieces: [
{ nom: "Formulaire de candidature AMCI dûment rempli et signé", format: "original papier", tailleMax: null, traduction: false, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.AMCI_FORMULAIRE,
verifieLe: VERIFIE
},

{
id: "ma_voeux",
type: "voeux",
titre: "Classer mes vœux d'établissements et de filières",
consigne: "La rubrique 7 du formulaire, « Formation demandée au Maroc (par ordre de préférence) », vous demande pour chaque vœu quatre colonnes : Établissements, Filières, Villes, Diplômes à préparer. Classez-les par ordre de préférence réel. Le formulaire publié ne fixe AUCUN nombre maximum de vœux : nous ne l'inventons pas, demandez-le à votre autorité nationale. Sachez surtout que vos vœux ne sont pas garantis : l'AMCI sélectionne « conformément aux quotas et aux critères préalablement arrêtés par l'AMCI et les représentants désignés par les autorités compétentes des pays bénéficiaires ». Le Maroc offre des « places pédagogiques AVEC OU SANS bourse » : être retenu ne veut pas dire être boursier.",
prerequis: ["ma_formulaire"],
preuve: "aucune",
pieces: [],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.AMCI_FORMULAIRE,
verifieLe: VERIFIE
},

{
id: "ma_pieces",
type: "pieces",
titre: "Constituer mon dossier de pièces",
consigne: "Le formulaire AMCI dit que « Le dossier de candidature doit comporter obligatoirement les pièces suivantes ». Réunissez-les en DOUBLE exemplaire là où le formulaire l'exige, et faites certifier conformes les copies de diplômes et de relevés de notes. Si vous candidatez en mastère ou en doctorat, ajoutez les copies certifiées conformes de vos diplômes de l'enseignement supérieur, vos relevés de notes, le descriptif du programme d'études suivi et un exemplaire de votre mémoire ou de votre thèse. Aucune exigence de traduction n'est mentionnée par le formulaire officiel : ne payez pas pour une traduction qu'on ne vous demande pas, mais faites confirmer par votre autorité de transmission.",
prerequis: ["ma_formulaire"],
preuve: "aucune",
pieces: [
{ nom: "02 photocopies certifiées conformes du baccalauréat ou de l'attestation de réussite", format: "photocopie certifiée conforme", tailleMax: null, traduction: false, legalisation: true },
{ nom: "02 photocopies certifiées conformes du relevé de notes du baccalauréat", format: "photocopie certifiée conforme", tailleMax: null, traduction: false, legalisation: true },
{ nom: "02 extraits d'acte de naissance", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "02 photocopies du passeport, si disponible", format: "photocopie", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Extrait de casier judiciaire récent", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Certificat médical des services de santé publique : aptitude physique, vaccination, absence de maladie contagieuse ou aiguë", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "02 photos d'identité récentes en couleur, nom, prénom(s) et nationalité au verso", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Mastère ou doctorat : diplômes du supérieur et relevés certifiés conformes, descriptif du programme, exemplaire du mémoire ou de la thèse", format: "photocopie certifiée conforme", tailleMax: null, traduction: false, legalisation: true }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.AMCI_FORMULAIRE,
verifieLe: VERIFIE
},

{
id: "ma_depot",
type: "soumission",
titre: "Déposer mon dossier auprès de l'autorité de mon pays",
consigne: "Vous ne vous adressez pas vous-même à l'AMCI. L'Ambassade du Royaume du Maroc l'écrit : les étudiants « doivent adresser à l'Agence Marocaine de Coopération Internationale PAR L'INTERMÉDIAIRE DES AUTORITÉS COMPÉTENTES DE LEUR PAYS D'ORIGINE, une demande expliquant leurs choix ainsi que leurs dossiers d'études ». Au Sénégal, en Côte d'Ivoire, au Bénin, au Burkina Faso, au Cameroun, en Guinée, au Togo ou au Mali, ce guichet est la direction nationale des bourses ou le ministère des Affaires étrangères, qui présélectionne puis transmet. Réclamez un récépissé de dépôt : c'est votre seule trace tant que le dossier n'est pas enregistré à Rabat.",
prerequis: ["ma_pieces", "ma_voeux"],
preuve: "recu",
pieces: [],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.AMBASSADE,
verifieLe: VERIFIE
},

{
id: "ma_transmission",
type: "soumission",
titre: "Transmission par la voie diplomatique — avant le 31 juillet",
consigne: "Votre autorité nationale transmet le dossier par la voie diplomatique à l'AMCI. L'Ambassade du Royaume du Maroc précise que les dossiers « doivent être envoyés par voie diplomatique à l'Agence Marocaine de Coopération Internationale (6, Rue Tamesloht – Rabat) AVANT LE 31 JUILLET DE CHAQUE ANNÉE ». C'est la seule date officiellement publiée. L'Université Mohammed V ajoute que les délais précis sont « communiqués chaque année par l'Agence aux représentations diplomatiques marocaines à l'étranger » : faites donc confirmer la date de clôture de la campagne en cours par l'ambassade du Maroc de votre pays, car votre autorité nationale doit clore AVANT, pour avoir le temps de transmettre. Un dossier non transmis par l'AMCI ne sera jamais examiné, quelle que soit sa qualité.",
prerequis: ["ma_depot"],
preuve: "aucune",
pieces: [],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.AMBASSADE,
verifieLe: VERIFIE
},

{
id: "ma_selection",
type: "reponse",
titre: "Sélection par l'AMCI",
consigne: "L'AMCI examine et sélectionne « conformément aux quotas et aux critères préalablement arrêtés par l'AMCI et les représentants désignés par les autorités compétentes des pays bénéficiaires », puis transmet les dossiers retenus au Ministère de l'Enseignement Supérieur, Direction de la Coopération et du Partenariat (DCP), « à travers la plateforme de gestion des demandes d'inscription des étudiants internationaux ». Vous n'avez aucune démarche à faire pendant cette phase : vous serez informé par votre autorité nationale ou par l'ambassade du Maroc. L'Université Hassan I rappelle que « Seuls peuvent bénéficier d'une inscription, et éventuellement d'une bourse d'étude du gouvernement marocain, les candidats proposés officiellement à l'AMCI ». Aucun entretien de sélection n'est mentionné par les sources officielles.",
prerequis: ["ma_transmission"],
preuve: "aucune",
pieces: [],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.UM5,
verifieLe: VERIFIE
},

{
id: "ma_autorisation",
type: "reponse",
titre: "Recevoir mon autorisation d'inscription",
consigne: "La Direction de la Coopération et du Partenariat délivre une autorisation d'inscription ÉLECTRONIQUE, « sous forme d'un numéro de série unique propre à chaque étudiant ». Deux régimes selon votre niveau. Pour le 1er cycle (DUT, Licence S1) et le doctorat en médecine, pharmacie et médecine dentaire, l'autorisation est délivrée DIRECTEMENT par la DCP, « sans passer par l'Université ». Pour la licence S3 ou S5, le master, le cycle ingénieur, la spécialité médecine et le cycle doctoral, elle n'est délivrée qu'APRÈS avis favorable de l'établissement, les dossiers lui étant envoyés via la plateforme. Notez et conservez ce numéro de série : c'est la pièce qui conditionne à la fois votre visa et votre inscription.",
prerequis: ["ma_selection"],
preuve: "numero_dossier",
pieces: [],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.UM5,
verifieLe: VERIFIE
},

{
id: "ma_visa",
phaseDepart: true,
type: "visa",
titre: "Visa d'entrée, ou vérification de ma dispense",
consigne: "Vérifiez D'ABORD si vous êtes dispensé de visa. Sur la liste officielle du portail consulaire marocain figurent, dispensés : le SÉNÉGAL, la CÔTE D'IVOIRE, le BURKINA FASO, le TOGO, le NIGER et le GABON. Sont dispensés MAIS avec une AEVM à demander en ligne sur le portail officiel acces-maroc.ma : le MALI, la GUINÉE (Conakry) et le CONGO-BRAZZAVILLE. Ne figurent PAS sur la liste, donc visa requis : le BÉNIN et le CAMEROUN. Pour le visa étudiant, le consulat exige le formulaire de demande, deux photos 4x3 sur fond blanc, une pièce d'identité, le passeport en cours de validité plus une photocopie, « une attestation d'inscription et/ou de bourse délivrée par l'AMCI », la vérification que votre nom figure « sur la liste, préalablement notifiée par l'AMCI à la mission diplomatique », une attestation d'inscription dans l'établissement, et une prise en charge LÉGALISÉE d'un garant résidant au Maroc. UN PIÈGE QUI COÛTE UNE ANNÉE : « le changement de type de visa déjà obtenu n'est pas autorisé une fois son titulaire entré sur le territoire marocain. Un nouveau visa doit être sollicité à partir du pays de résidence ». Entrer au Maroc en touriste pour s'inscrire ensuite n'est donc pas une option. Enfin, une dispense de visa ne dispense PAS du titre de séjour.",
prerequis: ["ma_autorisation"],
preuve: "aucune",
pieces: [
{ nom: "Formulaire de demande de visa d'entrée au Royaume du Maroc, en caractères latins majuscules", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Deux photos d'identité en couleur, fond blanc, 4 x 3 cm, récentes", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Carte d'identité, carte de séjour ou document en tenant lieu", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Passeport valable au-delà de la durée du séjour, + photocopie des pages d'identité et de validité", format: "original + photocopie", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Attestation d'inscription et/ou de bourse délivrée par l'AMCI", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Attestation d'inscription dans un établissement universitaire marocain", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Prise en charge d'un parent proche ou d'un garant résidant au Maroc, signée et légalisée", format: "original papier", tailleMax: null, traduction: false, legalisation: true, precision: "doit couvrir la solvabilité, l'hébergement, l'engagement de régularisation auprès de la DGSN, les frais de rapatriement, et l'engagement de quitter le territoire à l'expiration du titre de séjour" }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.CONSULAT_VISAS,
verifieLe: VERIFIE
},

{
id: "ma_inscription",
phaseDepart: true,
type: "confirmation",
titre: "M'inscrire dans mon établissement",
consigne: "Arrivé au Maroc, présentez-vous à l'établissement qui vous a été attribué. L'Université Cadi Ayyad précise que « L'inscription auprès d'un établissement universitaire se fait sur présentation de l'autorisation d'inscription délivrée par le Ministère », et l'Université Mohammed V confirme qu'il s'agit du « numéro de série unique propre à chaque étudiant ». Apportez ce numéro, votre passeport et vos diplômes ORIGINAUX. Le montant des droits d'inscription pour un étudiant international dans une université publique n'est publié sur aucune page officielle que nous ayons pu lire : demandez-le à l'établissement, ne partez pas avec une estimation. Vous devez ressortir avec votre carte d'étudiant et votre attestation d'inscription, indispensable pour le titre de séjour.",
prerequis: ["ma_autorisation", "ma_visa"],
preuve: "aucune",
pieces: [],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.UCA_AMCI,
verifieLe: VERIFIE
},

{
id: "ma_sejour",
phaseDepart: true,
type: "complement",
titre: "Demander mon titre de séjour",
consigne: "L'Université Cadi Ayyad l'écrit sans ambiguïté : « À leur arrivée au Maroc, TOUS les étudiants, quelle que soit leur nationalité, doivent demander un titre de séjour auprès des autorités locales pour légaliser leur séjour durant leurs études ». Même dispensé de visa, vous êtes concerné. La demande se dépose auprès des services compétents de la Direction Générale de la Sûreté Nationale — le visa étudiant comporte d'ailleurs un « engagement de régularisation de situation de séjour en qualité d'étudiant étranger » auprès d'eux. Les pièces citées sont la copie du visa si vous en aviez besoin, l'attestation d'inscription, un justificatif de moyens financiers, une preuve de logement et un casier judiciaire ; d'autres peuvent être demandées. Le délai exact en jours après l'arrivée n'est publié sur aucune page officielle accessible : demandez-le au service dès votre arrivée plutôt que d'attendre, car c'est un délai qu'on ne rattrape pas.",
prerequis: ["ma_inscription"],
preuve: "aucune",
pieces: [
{ nom: "Copie du visa, pour ceux qui en ont besoin", format: "photocopie", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Attestation d'inscription dans l'université", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Justificatif de moyens financiers", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Preuve de logement", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Casier judiciaire", format: "original papier", tailleMax: null, traduction: false, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.UCA_SEJOUR,
verifieLe: VERIFIE
},

{
id: "ma_um6p",
type: "soumission",
titre: "La voie directe : candidater à l'UM6P",
consigne: "L'Université Mohammed VI Polytechnique ne passe PAS par l'AMCI : vous candidatez directement sur sa plateforme, via la page Apply, qui distingue les Post-Bac Programs, les Engineer programs et les Master's programs pour 2026-2027. Chaque programme affiche sa PROPRE date de clôture sur cette page — par exemple le Doctorate in Medicine porte « Closing date 24/06/2026 ». Il n'existe donc pas de date unique pour toute l'université : relevez celle du programme précis que vous visez. L'UM6P publie aussi une page « International Applicants » et un calendrier académique 2026-2027 précisant les périodes d'admission par catégorie. Les frais de scolarité ne figurent pas sur les pages que nous avons pu lire : demandez-les avant de candidater.",
prerequis: [],
preuve: "aucune",
pieces: [],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.UM6P,
verifieLe: VERIFIE
},

{
id: "ma_aui",
type: "soumission",
titre: "La voie directe : candidater à Al Akhawayn",
consigne: "Al Akhawayn University in Ifrane admet directement les étudiants internationaux, sans AMCI : les dossiers passent par son Office of Admissions and Outreach, et l'université demande de les envoyer « bien avant » ses dates limites. Si votre langue d'enseignement n'était pas l'anglais, il vous faut un score IELTS ou TOEFL. Une admission directe est possible pour les très bons dossiers ayant passé au moins les deux dernières années de lycée dans un établissement international hors du Maroc, avec entretien en ligne le cas échéant. L'université publie ses coûts, ce qui est rare et précieux : scolarité 50 400 MAD, logement 5 880 MAD, restauration 8 500 MAD, frais d'inscription 5 100 MAD, assurance semestrielle 550 MAD, livres 3 000 MAD, frais de tests 1 000 MAD, dépôt universitaire 3 000 MAD, orientation 160 MAD, carte d'étudiant 200 MAD, impression 100 MAD — soit un total estimé de 77 790 MAD. Pour les bourses de master MAISD, NAMES et MAIS, le formulaire doit parvenir au Financial Aid Office avant le 31 mai pour le semestre d'automne, le 31 octobre pour celui de printemps.",
prerequis: [],
preuve: "aucune",
pieces: [],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.AUI,
verifieLe: VERIFIE
}

]
};
