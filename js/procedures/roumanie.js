/**
* ============================================================
* FitzUniverse — le TRONC de la procédure Roumanie (lot S3)
* ============================================================
*
* UNE PIÈCE COMMANDE TOUT : la « scrisoare de acceptare la studii », la
* lettre d'acceptation aux études, délivrée par le MINISTÈRE de
* l'Éducation — pas par l'université. L'étudiant dépose son dossier à
* l'université, l'université l'évalue et le transmet elle-même au
* ministère, qui tranche en 30 jours ouvrables au plus. Sans cette
* lettre, ni visa ni inscription.
*
* L'ORDRE APOSTILLE PUIS TRADUCTION, dans ce sens et pas l'autre : on
* authentifie l'original dans le pays émetteur, PUIS on fait traduire.
* L'inverse oblige à tout refaire, et c'est une erreur fréquente et
* coûteuse.
*
* UNE VOIE PARALLÈLE, FACULTATIVE : la campagne de bourses du ministère
* roumain des Affaires étrangères, exclusivement en ligne, du 16
* février au 31 mars, sans médecine, médecine dentaire ni pharmacie.
* Elle est ici parce qu'elle ferme AVANT que beaucoup de candidats ne
* commencent à chercher.
*
* DEUX CONTRADICTIONS ENTRE PAGES OFFICIELLES, signalées telles quelles
* plutôt qu'arbitrées : les moyens de subsistance (2 000 € selon le
* portail Study in Romania, le salaire minimum brut national selon
* l'IGI) et l'assurance santé après 26 ans (463 €/an sur une page,
* « à partir de 12 €/mois » sur une autre du même portail). Trancher à
* leur place serait inventer.
*
* AUCUNE COUCHE DE RÉSIDENCE : montants et délais sont nationaux.
* `residenceRequise: false`.
*
* CE QU'ON N'A PAS TROUVÉ : les montants planchers de l'Ordonnance
* 22/2009, la taxe de prolongation du séjour, le montant du salaire
* minimum de référence, et le calendrier de bourses 2027 — non publié
* au 13 septembre 2026.
* ============================================================
*/

const VERIFIE = "2026-09-13";

export const SOURCES = {
MINISTERE: "https://www.edu.ro/studenti%20non%20ue",
PORTAIL: "https://studyinromania.gov.ro/procedures",
RECONNAISSANCE: "https://studyinromania.gov.ro/recognition",
VISA: "https://studyinromania.gov.ro/visa",
SEJOUR_PORTAIL: "https://studyinromania.gov.ro/residence-procedures",
BOURSES: "https://scholarships.studyinromania.gov.ro/scholarship-about",
COUTS: "https://studyinromania.gov.ro/faq-costs",
EVIZA: "https://eviza.mae.ro/",
EVIZA_TAXES: "https://eviza.mae.ro/ro_VisaFees",
IGI_ETUDES: "https://igi.mai.gov.ro/studii/",
IGI_PERMIS: "https://igi.mai.gov.ro/permis-de-sedere/",
CNRED: "https://cnred.edu.ro/",
// L'ordre du ministère n° 5655/2024 (méthodologie d'admission des
// étudiants étrangers payants), relu le 2026-09-25 : art. 8 et 9.
ORDIN_5655: "https://www.edu.ro/sites/default/files/fisiere%20articole/OM_5655-2024.pdf"
};

export const PROCEDURE_ROUMANIE = {

id: "roumanie",
paysDestination: "Roumanie",
portail: {
nom: "Study in Romania",
url: "https://studyinromania.gov.ro",
motif: "studyinromania\\.gov\\.ro"
},
sources: SOURCES,
residenceRequise: false,

etapes: [

{
id: "ro_programme",
type: "voeux",
titre: "Choisir mon programme et mon université",
consigne: "Choisissez dans le catalogue officiel du portail Study in Romania, qui affiche pour chaque programme la langue d'enseignement, la durée, les crédits ECTS et les frais de scolarité annuels applicables aux non-UE. Le portail officiel annonce une fourchette allant d'environ 400 € par an à près de 9 000 € par an selon le domaine, chaque université fixant ses propres tarifs au-dessus d'un plancher légal. Vérifiez impérativement que l'établissement est accrédité ou autorisé provisoirement selon la loi roumaine : sinon, aucune lettre d'acceptation ne pourra être émise et tout le reste s'écroule. Sortez de cette étape avec le nom exact de l'université, le programme, la langue d'enseignement et le montant annuel.",
prerequis: [],
preuve: "capture",
pieces: [],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.COUTS,
verifieLe: VERIFIE
},

{
id: "ro_apostille",
type: "pieces",
titre: "Apostiller mes documents, PUIS les faire traduire",
consigne: "L'ORDRE COMPTE, et l'inverser oblige à tout recommencer. D'abord vous faites AUTHENTIFIER vos documents originaux dans le pays qui les a émis : apostille de La Haye, ou visa d'authentification de l'ambassade de Roumanie de ce pays. ENSUITE seulement vous faites établir les traductions légalisées. Le portail officiel accepte la traduction en roumain OU dans une langue de circulation internationale, donc le français ou l'anglais conviennent — ce qui vous évite souvent un traducteur roumain assermenté. Cette authentification préalable n'est pas exigée si vos études antérieures ont été faites en Roumanie, dans un pays de l'Union européenne, ou dans un pays lié à la Roumanie par un accord d'assistance juridique. Vous devez détenir, à la fin, chaque acte en original apostillé ET sa traduction légalisée.",
prerequis: ["ro_programme"],
preuve: "aucune",
pieces: [
{ nom: "Diplôme de baccalauréat, ou de licence / master selon le cycle visé", format: "original papier", tailleMax: null, traduction: true, legalisation: true, precision: "apostille de La Haye d'abord, traduction légalisée ensuite ; roumain, français ou anglais acceptés" },
{ nom: "Relevés de notes des études effectuées (foi matricole)", format: "original papier", tailleMax: null, traduction: true, legalisation: true },
{ nom: "Acte de naissance", format: "original papier", tailleMax: null, traduction: true, legalisation: true }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.RECONNAISSANCE,
verifieLe: VERIFIE
},

{
id: "ro_dossier",
type: "soumission",
titre: "Déposer mon dossier auprès de l'université",
consigne: "Envoyez votre dossier complet au bureau des admissions de l'université choisie : le ministère de l'Éducation ne reçoit AUCUN dossier directement d'un candidat, c'est l'université qui saisit le ministère. Votre dossier contient obligatoirement la demande de délivrance de la lettre d'acceptation aux études (ANEXA nr. 2) remplie EN DEUX EXEMPLAIRES, plus un exemplaire en copie légalisée et une photocopie des autres pièces. Comptez environ 15 jours pour une décision préliminaire de l'université. Toutes les universités facturent des frais de dossier par programme, dont le montant n'est pas publié de façon centralisée : demandez-le. Sortez de cette étape avec l'accusé de réception de votre dossier.",
prerequis: ["ro_apostille"],
preuve: "numero_dossier",
pieces: [
{ nom: "Cerere de eliberare a Scrisorii de acceptare la studii (ANEXA nr. 2), en deux exemplaires", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Acte d'études qualifiant pour le cycle visé", format: "copie légalisée + traduction", tailleMax: null, traduction: true, legalisation: true },
{ nom: "Relevés de notes et programme analytique, si vous demandez la reconnaissance de périodes d'études", format: "copie légalisée + traduction", tailleMax: null, traduction: true, legalisation: true },
{ nom: "Diplôme de fin d'année préparatoire ou certificat de compétence linguistique, selon le cas", format: "copie", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Acte de naissance", format: "copie légalisée + traduction", tailleMax: null, traduction: true, legalisation: true },
{ nom: "Passeport", format: "copie", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Certificat médical attestant l'absence de maladies contagieuses ou d'affections incompatibles avec la future profession", format: "original papier, en langue de circulation internationale", tailleMax: null, traduction: true, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.MINISTERE,
verifieLe: VERIFIE
},

{
id: "ro_scrisoare",
type: "reponse",
titre: "Obtenir la scrisoare de acceptare du ministère",
consigne: "C'est la pièce qui commande tout. L'université évalue votre dossier puis le transmet ELLE-MÊME au ministère de l'Éducation et de la Recherche, avec la liste des personnes proposées. Le délai maximal de traitement par le ministère est de 30 JOURS OUVRABLES. En cas de décision favorable, le ministère émet la scrisoare de acceptare la studii et l'envoie à l'établissement et, selon le cas, aux missions diplomatiques. Un cas à connaître : si l'université demandée ne peut pas honorer la demande, le ministère peut vous proposer un AUTRE établissement correspondant à votre profil. Sans cette lettre, vous n'obtiendrez ni visa ni inscription.",
prerequis: ["ro_dossier"],
preuve: "capture",
pieces: [],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.PORTAIL,
verifieLe: VERIFIE
},

{
id: "ro_langue",
type: "complement",
titre: "Année préparatoire de roumain, ou preuve de compétence",
consigne: "Les ressortissants hors UE ne sont inscrits en langue roumaine qu'APRÈS avoir suivi l'année préparatoire : une année scolaire ou universitaire complète pour le préuniversitaire et la licence, au moins 6 mois pour le master, le doctorat et le rezidentiat. À noter : le rezidentiat, la spécialisation médicale postuniversitaire, ne se fait QU'EN ROUMAIN, sans exception. L'ordre n° 5655/2024 (art. 8) admet trois preuves du roumain : l'attestation de fin d'année préparatoire ; des études d'au moins trois années consécutives en roumain, dans le système national roumain ; ou un certificat de compétence linguistique de niveau B1 au moins, délivré par une université roumaine qui organise l'année préparatoire, par l'Institut de la langue roumaine ou par l'Institut culturel roumain. Pour un programme enseigné en langue étrangère (art. 9), ce sont les critères de CHAQUE université qui s'appliquent : beaucoup dispensent les candidats d'un pays dont la langue officielle est celle du programme, d'autres demandent un certificat ou des années d'études dans la langue — lisez le règlement de l'université visée.",
prerequis: ["ro_scrisoare"],
preuve: "aucune",
pieces: [
{ nom: "Certificat de compétence linguistique en roumain, ou diplôme de fin d'année préparatoire", format: "original papier", tailleMax: null, traduction: false, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.ORDIN_5655,
verifieLe: VERIFIE
},

{
id: "ro_bourse_mae",
type: "soumission",
titre: "Voie parallèle : la bourse du ministère roumain des Affaires étrangères",
consigne: "Voie facultative et parallèle, ouverte aux ressortissants de tous les pays non-UE, fondée sur la Décision de Gouvernement n° 288/1993. La candidature se fait EXCLUSIVEMENT en ligne sur la plateforme Study in Romania : toute candidature envoyée directement au ministère des Affaires étrangères, au ministère de l'Éducation, à l'adresse personnelle d'un agent ou à une mission diplomatique est REJETÉE. Pour la campagne publiée, les dépôts étaient ouverts du 16 février au 31 mars 2026, résultats autour du 15 juillet 2026. Trois limites décisives : aucune bourse en MÉDECINE, MÉDECINE DENTAIRE ni PHARMACIE ; en licence et master les études se font uniquement en roumain, seul le doctorat pouvant être en langue étrangère fixée par l'école doctorale ; et il faut une moyenne des années du dernier cycle achevé d'au moins 7 sur l'échelle roumaine, ou la mention « Bien ». Pour les admis, c'est le ministère de l'Éducation qui émet la lettre d'acceptation, dont l'original part vers l'université, une copie scannée restant téléchargeable. Avantage notable : les boursiers de l'État roumain sont exonérés des taxes consulaires et de la taxe de permis de séjour, et n'ont pas à prouver leurs moyens de subsistance. Le calendrier 2027 n'est pas publié à ce jour.",
prerequis: [],
preuve: "capture",
pieces: [
{ nom: "Copies des diplômes obtenus", format: "PDF scanné individuellement d'après l'original", tailleMax: null, traduction: true, legalisation: true },
{ nom: "Copies des relevés de notes des études achevées", format: "PDF scanné individuellement d'après l'original", tailleMax: null, traduction: true, legalisation: true },
{ nom: "Copie de l'acte de naissance", format: "PDF", tailleMax: null, traduction: true, legalisation: true },
{ nom: "Copie des trois premières pages du passeport en cours de validité", format: "PDF", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Curriculum vitae, en anglais, français ou roumain", format: "PDF", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Doctorat : lettre d'intention, liste des travaux scientifiques, projet de recherche détaillé, accord écrit d'un directeur de thèse membre de l'école doctorale", format: "PDF", tailleMax: null, traduction: false, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.BOURSES,
verifieLe: VERIFIE
},

{
id: "ro_scolarite",
phaseDepart: true,
type: "paiement",
titre: "Payer au moins une année de scolarité",
consigne: "Avant de déposer votre demande de visa, vous devez régler à l'université les frais couvrant AU MOINS UNE ANNÉE d'études : l'Inspectorat général pour l'immigration exige explicitement la preuve de ce paiement parmi les pièces du dossier de visa. Le montant est celui affiché par l'université pour votre programme ; le cadre légal des montants minimaux en devises pour les ressortissants d'États tiers est fixé par l'Ordonnance du Gouvernement n° 22/2009, approuvée par la Loi n° 1/2010, chaque établissement fixant ensuite ses tarifs au-dessus de ce plancher — que le ministère ne reproduit pas sur sa page, et que nous ne devinons pas. Les boursiers de l'État roumain et ceux des établissements d'enseignement supérieur d'État accrédités en sont dispensés. Conservez le justificatif émis par l'université.",
prerequis: ["ro_scrisoare"],
preuve: "recu",
pieces: [
{ nom: "Preuve du paiement des frais de scolarité pour au moins une année d'études", format: "original papier", tailleMax: null, traduction: false, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.IGI_ETUDES,
verifieLe: VERIFIE
},

{
id: "ro_visa",
phaseDepart: true,
type: "visa",
titre: "Demander mon visa de long séjour pour études (D/SD)",
consigne: "La demande se dépose OBLIGATOIREMENT par voie électronique via le portail e-Viza du ministère des Affaires étrangères — c'est aussi le seul moyen de prendre rendez-vous — puis physiquement à la mission diplomatique ou au poste consulaire roumain territorialement compétent, où vous présentez en original votre document de voyage et vos pièces. ATTENTION AU TARIF, il a changé : la taxe de visa de long séjour est de 300 EUROS pour les demandes transmises via e-Viza à partir du 27 avril 2026, contre 120 euros avant cette date. Le non-paiement rend la demande irrecevable et elle n'est pas prise au guichet. La décision intervient dans un délai maximal de 30 jours à compter de la présentation au poste, et le Centre national des visas n'approuve qu'après l'avis de l'Inspectorat général pour l'immigration, rendu en 30 jours au plus, prolongeable de 15. Un point qui surprend souvent : la Roumanie est dans l'espace Schengen depuis le 1er janvier 2025, mais ce visa n'autorise l'entrée QU'EN ROUMANIE — il ne donne pas le droit de voyager ni de résider dans les autres pays Schengen ou de l'UE. Il est accordé pour 90 jours, avec un ou plusieurs voyages. Sur les moyens de subsistance, deux chiffres officiels coexistent et nous ne tranchons pas : l'IGI exige au moins le salaire de base minimum brut national par mois pour toute la période du visa ; le portail Study in Romania parle d'au moins 2 000 euros sur le compte. Prévoyez le plus exigeant.",
prerequis: ["ro_scrisoare", "ro_scolarite"],
preuve: "recu",
pieces: [
{ nom: "Scrisoare de acceptare la studii délivrée par le ministère de l'Éducation", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Preuve du paiement des frais de scolarité pour au moins une année", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Preuve des moyens de subsistance pour toute la période inscrite dans le visa", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Preuve de la connaissance de la langue d'enseignement, sauf pour l'année préparatoire de roumain", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Certificat de casier judiciaire ou document de même valeur juridique", format: "original papier", tailleMax: null, traduction: false, legalisation: true },
{ nom: "Assurance médicale de voyage couvrant le rapatriement, les soins et l'hospitalisation d'urgence ou le décès, valable dans tous les États membres, couverture minimale 30 000 EUR", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Accord des parents ou du tuteur, si vous êtes mineur", format: "original papier", tailleMax: null, traduction: false, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.IGI_ETUDES,
verifieLe: VERIFIE
},

{
id: "ro_inmatriculare",
phaseDepart: true,
type: "confirmation",
titre: "M'inscrire (înmatriculare) à l'université",
consigne: "L'inscription se fait selon le calendrier de l'établissement, AU PLUS TARD à la fin du premier semestre de l'année universitaire pour laquelle l'acceptation a été émise. Présentez les documents de votre dossier EN ORIGINAL, visés pour authentification par l'ambassade de Roumanie du pays émetteur ou apostillés selon le cas, avec la scrisoare de acceptare et votre passeport portant un visa valable en scope « études ». Les universités peuvent exiger que tous les documents soient accompagnés de copies authentifiées ET de traductions légalisées en roumain : demandez leur liste avant de partir. Vous présentez aussi le certificat médical attestant votre aptitude aux études et l'absence de maladies contagieuses. Vous devez ressortir avec votre contrat d'études signé et votre statut d'étudiant inscrit.",
prerequis: ["ro_visa", "ro_langue"],
preuve: "recu",
pieces: [
{ nom: "Dossier complet en documents originaux", format: "original papier", tailleMax: null, traduction: true, legalisation: true },
{ nom: "Scrisoare de acceptare la studii", format: "original + copie", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Passeport avec visa D/SD valable", format: "original + copie", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Certificat médical d'aptitude aux études et d'absence de maladies contagieuses", format: "original papier", tailleMax: null, traduction: true, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.MINISTERE,
verifieLe: VERIFIE
},

{
id: "ro_permis",
phaseDepart: true,
type: "complement",
titre: "Obtenir mon permis de séjour auprès de l'IGI",
consigne: "Votre visa ne vaut que 90 jours. Adressez-vous au service territorial de l'Inspectorat général pour l'immigration du département où vous résidez PENDANT LES 30 PREMIERS JOURS suivant votre entrée, et en tout état de cause déposez votre dossier personnellement AU MOINS 30 JOURS AVANT l'expiration du droit de séjour accordé par le visa ; le dépôt en ligne est également possible sur le portail de l'IGI. La demande est tranchée en 30 jours à compter du dépôt, prolongeables de 15 si des vérifications supplémentaires sont nécessaires. Le permis de séjour temporaire coûte 265 lei TVA comprise, payables aux caisses ou automates de CEC BANK ; les boursiers de l'État roumain l'obtiennent avec exonération des taxes. Il est valable UN AN et se renouvelle chaque année, au moins 30 jours avant l'expiration du précédent ; la scrisoare de acceptare n'est demandée qu'à la première prolongation. Enfin, les étudiants étrangers ayant atteint 26 ans doivent présenter une assurance sociale de santé au titre de la Loi n° 95/2006 : sur son coût, deux pages officielles du même portail se contredisent (463 €/an d'un côté, « à partir de 12 €/mois » de l'autre), nous ne tranchons pas à leur place.",
prerequis: ["ro_inmatriculare"],
preuve: "recu",
pieces: [
{ nom: "Cerere — formulaire de demande", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Document de franchissement de la frontière (passeport, titre de voyage)", format: "original + copie", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Scrisoare de acceptare la studii, uniquement à la première prolongation", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Adeverință de l'établissement prouvant l'inscription en formation à fréquence de jour", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Preuve des moyens de subsistance pour au moins 6 mois", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Preuve de la détention légale de l'espace d'habitation", format: "original + copie", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Adeverință medicală", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Preuve d'assurance santé valable en Roumanie (assurance sociale obligatoire à partir de 26 ans)", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Justificatif de paiement des taxes — 265 lei TVA comprise pour le permis", format: "original papier", tailleMax: null, traduction: false, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.IGI_ETUDES,
verifieLe: VERIFIE
}

]
};
