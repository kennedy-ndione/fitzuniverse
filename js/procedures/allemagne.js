/**
* ============================================================
* FitzUniverse — le TRONC de la procédure Allemagne (lot S3)
* ============================================================
*
* DEUX PASSAGES OBLIGÉS, ET UN SEUL EST UNIVERSEL. uni-assist évalue
* les dossiers internationaux pour 180 universités allemandes et
* centralise saisie, pièces et frais — mais il n'est PAS un guichet
* national : d'autres universités publiques reçoivent les candidatures
* sur leur propre portail. Le vrai passage obligé, incontournable pour
* tout non-UE, est le Consular Services Portal du ministère fédéral des
* Affaires étrangères, pour le visa national D.
*
* On a choisi uni-assist comme `portail` du tronc parce que c'est là
* que commence le parcours de la grande majorité des candidats
* africains, et l'étape de_voeux dit explicitement qu'il faut vérifier
* établissement par établissement qui traite la candidature. Mentir par
* simplification aurait été de ne pas le dire.
*
* AUCUNE COUCHE DE RÉSIDENCE. Les montants sont fédéraux (Sperrkonto,
* frais uni-assist), les délais sont fédéraux ou fixés par chaque
* université, et le consulat compétent découle de la résidence sans
* qu'aucun chiffre n'en dépende. `residenceRequise: false`.
*
* UN POINT QUI VISE NOS ÉTUDIANTS DIRECTEMENT, et qu'on ne dilue pas :
* l'ambassade d'Allemagne à Dakar écrit que SEULES les banques
* allemandes et européennes sont acceptées pour le compte bloqué, et
* que les banques africaines ne le sont pas. C'est dans de_sperrkonto,
* en toutes lettres.
*
* CE QU'ON N'A PAS TROUVÉ : le montant des frais du visa national D
* pour études — aucune page officielle « études » ne le publie. Des
* pages diplo.de citent 75 € pour d'AUTRES visas nationaux : on ne les
* recopie pas ici.
* ============================================================
*/

const VERIFIE = "2026-09-13";

export const SOURCES = {
UNIASSIST: "https://www.uni-assist.de/en/",
ANABIN_CHECK: "https://www.uni-assist.de/en/tools/check-university-admission/",
STUDIENKOLLEG: "https://www.uni-assist.de/en/how-to-apply/get-information/studienkolleg-preparatory-course/",
CANDIDATURE: "https://www.uni-assist.de/en/how-to-apply/apply-online/",
FRAIS: "https://www.uni-assist.de/en/how-to-apply/pay-all-fees/handling-fees/",
DELAIS: "https://www.uni-assist.de/en/how-to-apply/plan-your-application/deadlines-processing-time/",
TRADUCTIONS: "https://www.uni-assist.de/en/how-to-apply/assemble-your-documents/translations/",
VPD: "https://www.uni-assist.de/en/how-to-apply/plan-your-application/vpd/",
ANABIN: "https://anabin.kmk.org/anabin.html",
PORTAIL_VISA: "https://digital.diplo.de/studium/",
DAKAR_VISA: "https://dakar.diplo.de/sn-fr/service/visa/national/studium",
DAKAR_SPERRKONTO: "https://dakar.diplo.de/sn-fr/service/visa/sperrkonto-1895102",
ANMELDUNG: "https://www.gesetze-im-internet.de/bmg/__17.html",
SEJOUR: "https://www.gesetze-im-internet.de/aufenthg_2004/__81.html",
ASSURANCE: "https://www.uni-bonn.de/en/studying/application-admission-and-enrollment/insurance-for-students",
IMMATRICULATION: "https://www.uni-bonn.de/en/studying/application-admission-and-enrollment/enrollment"
};

export const PROCEDURE_ALLEMAGNE = {

id: "allemagne",
paysDestination: "Allemagne",
portail: {
nom: "uni-assist",
url: "https://my.uni-assist.de/",
motif: "uni-assist\\.de"
},
sources: SOURCES,
residenceRequise: false,

etapes: [

{
id: "de_anabin",
type: "saisie",
titre: "Vérifier dans anabin ce que vaut mon diplôme",
consigne: "Avant toute chose : votre diplôme de fin d'études secondaires vaut-il Hochschulzugangsberechtigung (HZB), c'est-à-dire droit d'accès à l'université allemande ? Saisissez votre pays dans l'outil « Check: university admission » de uni-assist, construit avec le DAAD à partir des évaluations de la Kultusministerkonferenz publiées dans anabin ; si votre pays n'y figure pas, allez directement dans anabin, rubrique « Schulabschlüsse mit Hochschulzugang », où la recherche se fait par pays. Trois issues possibles : accès direct, accès conditionné à un Studienkolleg, ou pas d'accès. Une réserve que uni-assist écrit lui-même : ces évaluations sont une ORIENTATION et ne lient pas les autorités qui décideront de votre dossier.",
prerequis: [],
preuve: "capture",
pieces: [
{ nom: "Diplôme de fin d'études secondaires", format: "PDF", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Relevés de notes détaillés", format: "PDF", tailleMax: null, traduction: false, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.ANABIN_CHECK,
verifieLe: VERIFIE
},

{
id: "de_studienkolleg",
type: "complement",
titre: "Passer par un Studienkolleg si mon diplôme ne suffit pas",
consigne: "Si anabin conclut que votre diplôme n'ouvre pas l'accès direct, vous devez passer par un Studienkolleg puis réussir la Feststellungsprüfung ; cet examen obtenu, vous étudiez dans le domaine correspondant au cours suivi. Un point qui surprend beaucoup de candidats : l'enseignement en Studienkolleg se fait EN ALLEMAND, donc un niveau d'allemand est exigé à l'admission même si la licence que vous visez ensuite est en anglais. Les critères, les délais et les modalités sont fixés par chaque université et chaque Studienkolleg, pas par uni-assist : interrogez directement les universités visées. Leurs dates limites sont souvent plus précoces que celles des licences.",
prerequis: ["de_anabin"],
preuve: "aucune",
pieces: [
{ nom: "Certificat de langue allemande exigé par le Studienkolleg", format: "PDF", tailleMax: null, traduction: false, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.STUDIENKOLLEG,
verifieLe: VERIFIE
},

{
id: "de_compte",
type: "compte",
titre: "Créer mon compte My assist",
consigne: "Créez votre compte sur My assist : il vous attribue un numéro de candidat uni-assist unique, qui vous servira pour toutes vos candidatures, y compris sur plusieurs semestres. C'est de là que vous déposez vos pièces, suivez vos dossiers, transmettez un résultat TestAS et écrivez à uni-assist. Notez ce numéro : c'est la référence de tous vos échanges. uni-assist écrit sur son site qu'elle ne coopère avec AUCUNE agence commerciale, en Allemagne ou à l'étranger, pour placer des étudiants — si on vous propose un placement payant en son nom, c'est faux.",
prerequis: ["de_anabin"],
preuve: "numero_dossier",
pieces: [],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.CANDIDATURE,
verifieLe: VERIFIE
},

{
id: "de_pieces",
type: "pieces",
titre: "Rassembler mes pièces et faire traduire",
consigne: "Numérisez vos diplômes et relevés de notes et téléversez-les DANS LEUR LANGUE D'ORIGINE, accompagnés d'une traduction en allemand OU EN ANGLAIS — l'anglais est accepté, une traduction assermentée vers l'allemand n'est donc pas toujours nécessaire, ce qui vous économise du temps et de l'argent. Même règle pour le relevé détaillé des matières et des notes. Si votre pays délivre déjà ses certificats en allemand ou en anglais, aucune traduction n'est demandée, sauf exception listée dans « Info country by country ». En revanche uni-assist n'accepte QUE les traductions faites par une personne ou une institution habilitée à traduire sous serment ou admise devant les tribunaux, ou par un service habilité de l'établissement émetteur : une traduction d'agence ordinaire est refusée. Un document ne se téléverse qu'une fois, avec un nom de fichier explicite en allemand ou en anglais.",
prerequis: ["de_compte"],
preuve: "aucune",
pieces: [
{ nom: "Diplôme de fin d'études secondaires", format: "PDF", tailleMax: null, traduction: true, legalisation: false, precision: "traduction assermentée en allemand OU en anglais" },
{ nom: "Relevé détaillé des matières et des notes", format: "PDF", tailleMax: null, traduction: true, legalisation: false, precision: "traduction assermentée en allemand OU en anglais" },
{ nom: "Certificat de langue (allemand et/ou anglais, selon la langue d'enseignement)", format: "PDF", tailleMax: null, traduction: false, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.TRADUCTIONS,
verifieLe: VERIFIE
},

{
id: "de_voeux",
type: "voeux",
titre: "Choisir mes universités et mes formations",
consigne: "Cherchez votre université et votre formation sous « Search courses of study », sélectionnez chaque cursus visé et remplissez intégralement le formulaire correspondant. AVANT tout, vérifiez auprès de chaque université la date limite RÉELLE de la formation choisie : uni-assist applique la date de l'université, et le formulaire comme le dossier complet doivent être dans votre compte avant elle. Les dates les plus courantes sont le 15 juillet pour une rentrée au semestre d'hiver et le 15 janvier pour le semestre d'été, mais beaucoup d'universités imposent plus tôt, notamment pour les masters et les Studienkollegs. uni-assist recommande de candidater au moins 8 SEMAINES avant l'échéance, pour avoir le temps qu'on vous signale une pièce manquante. Vérifiez aussi que votre université passe bien par uni-assist : certaines reçoivent les candidatures sur leur propre portail.",
prerequis: ["de_pieces"],
preuve: "numero_dossier",
pieces: [],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.DELAIS,
verifieLe: VERIFIE
},

{
id: "de_vpd",
type: "complement",
titre: "Demander une VPD si mon université l'exige",
consigne: "Certaines universités n'acceptent pas de candidature VIA uni-assist mais exigent une Vorprüfungsdokumentation (VPD) : un document où uni-assist atteste quels certificats vous avez produits, comment elle les évalue, et à quelle note allemande elle convertit votre moyenne. Vérifiez sur la liste des universités uni-assist, et auprès de l'université elle-même, si la VPD est requise ; si oui, votre candidature en ligne vaut demande de VPD. Comptez 4 à 6 semaines à partir du dépôt du formulaire ; la VPD arrive dans « My Inbox » de votre compte, avec un courriel. Elle est valable UN AN à compter de son émission, quel que soit le semestre choisi. Attention au piège : c'est ensuite à VOUS de l'envoyer directement à l'université, avec votre dossier, avant SA date limite.",
prerequis: ["de_voeux"],
preuve: "recu",
pieces: [
{ nom: "Vorprüfungsdokumentation (VPD) délivrée par uni-assist", format: "PDF", tailleMax: null, traduction: false, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.VPD,
verifieLe: VERIFIE
},

{
id: "de_paiement",
type: "paiement",
titre: "Payer les frais de dossier uni-assist",
consigne: "Payez dans My assist, par virement ou par carte de crédit. Pour un même semestre : 75,00 € pour le PREMIER cursus choisi, puis 30,00 € par cursus supplémentaire, quel que soit le nombre d'universités — trois vœux répartis sur deux universités coûtent donc 135,00 €. Le tarif est identique en procédure standard et en procédure VPD, s'applique aussi aux Studienkollegs et aux cours préparatoires d'allemand, et reste dû quel que soit le résultat. Si vous recandidatez pour un autre semestre, le compteur repart à 75,00 €. Deux choses à savoir : le délai de traitement ne commence à courir qu'à réception du formulaire PAYÉ, et certaines universités prennent ces frais à leur charge — une mention apparaît alors dans la liste de sélection de My assist.",
prerequis: ["de_voeux"],
preuve: "recu",
pieces: [],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.FRAIS,
verifieLe: VERIFIE
},

{
id: "de_zulassung",
type: "reponse",
titre: "Recevoir l'évaluation puis la lettre d'admission",
consigne: "Suivez l'état de votre dossier dans My assist. uni-assist traite les candidatures dans leur ordre d'arrivée et annonce un résultat d'évaluation en 4 à 6 semaines en règle générale, à compter de la réception du formulaire ; au 7 septembre 2026, le délai affiché pour la région « Afrique, Moyen-Orient et Iran » est de 4 à 5 semaines, comme pour toutes les autres régions, avec des cas plus longs. Retenez ceci : uni-assist N'ADMET PAS. C'est l'université qui décide et qui envoie le Zulassungsbescheid, la lettre d'admission, où figure le délai d'immatriculation à respecter sous peine de perdre votre place. C'est cette lettre qui conditionne votre visa.",
prerequis: ["de_paiement"],
preuve: "numero_dossier",
pieces: [
{ nom: "Lettre d'admission (Zulassungsbescheid) ou confirmation d'admission en Studienkolleg", format: "PDF", tailleMax: null, traduction: false, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.DELAIS,
verifieLe: VERIFIE
},

{
id: "de_sperrkonto",
phaseDepart: true,
type: "pieces",
titre: "Ouvrir mon compte bloqué et prouver mes ressources",
consigne: "Avant de déposer votre demande de visa, vous devez prouver que vous pouvez vivre un an. Le portail consulaire fédéral exige au minimum 992 € par mois pour un visa d'études, et 1 091 € par mois pour un visa de recherche de place d'études ; l'ambassade publie les équivalents annuels de 11 904 € et 13 092 €, alignés sur les taux du BAföG. Trois preuves possibles : un compte bloqué, où la somme d'une année entière est versée et où vous ne retirez qu'un douzième par mois ; une déclaration de prise en charge signée par une personne domiciliée en Allemagne, datée de six mois au maximum et portant la mention « solvabilité prouvée » ; ou une bourse, à compléter par des relevés si son montant est inférieur au minimum. DEUX POINTS QUI COÛTENT CHER SI ON LES IGNORE. L'ambassade d'Allemagne à Dakar n'accepte QUE les banques allemandes et européennes : les banques africaines sont refusées. Et l'attestation d'ouverture doit indiquer le montant crédité ET la somme disponible chaque mois — sans ces deux chiffres, elle est rejetée. Les frais du compte bloqué s'ajoutent au montant bloqué ; le bénéficiaire du blocage est l'ambassade avant le visa, puis le service des étrangers après votre entrée.",
prerequis: ["de_zulassung"],
preuve: "recu",
pieces: [
{ nom: "Attestation d'ouverture de compte bloqué, indiquant le montant crédité ET la somme mensuelle disponible", format: "PDF", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Déclaration de prise en charge (Verpflichtungserklärung), alternative au compte bloqué", format: "original papier", tailleMax: null, traduction: false, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.PORTAIL_VISA,
verifieLe: VERIFIE
},

{
id: "de_visa_dossier",
phaseDepart: true,
type: "visa",
titre: "Déposer ma demande de visa national D en ligne",
consigne: "Enregistrez-vous sur le Consular Services Portal du ministère fédéral des Affaires étrangères, indiquez votre pays de résidence — le Sénégal, le Maroc, la Tunisie, l'Algérie, la Côte d'Ivoire, le Mali, le Burkina Faso, la Guinée, la Mauritanie, le Togo, le Bénin, le Nigeria et le Ghana y figurent tous — remplissez le formulaire et téléversez vos pièces pour un pré-contrôle. Les conditions de fond sont : une lettre d'admission d'une université publique ou reconnue par l'État, ou une confirmation d'admission en Studienkolleg ; un niveau de langue suffisant ; et la preuve de vos ressources. L'ambassade vous répond via le portail si une pièce manque, et vous corrigez en ligne. Certaines ambassades travaillent avec des prestataires qui facturent des frais de service, indiqués en cours de procédure.",
prerequis: ["de_sperrkonto"],
preuve: "numero_dossier",
pieces: [
{ nom: "Passeport en cours de validité", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Lettre d'admission ou confirmation d'admission en Studienkolleg", format: "PDF", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Preuve de ressources : compte bloqué, prise en charge ou bourse", format: "PDF", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Certificat de langue", format: "PDF", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Tout document qui n'est ni en allemand, ni en français, ni en anglais", format: "PDF", tailleMax: null, traduction: true, legalisation: false, precision: "traduction certifiée conforme — la règle du consulat est plus stricte que celle de uni-assist" }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.PORTAIL_VISA,
verifieLe: VERIFIE
},

{
id: "de_visa_rdv",
phaseDepart: true,
type: "entretien",
titre: "Rendez-vous consulaire, biométrie et décision",
consigne: "Le pré-contrôle passé, vous recevez un lien pour prendre rendez-vous et vous vous présentez EN PERSONNE : originaux des documents, questions sur votre séjour, photo et empreintes digitales, paiement des frais de dossier. Trois avertissements que l'ambassade de Dakar écrit elle-même. Les rendez-vous se prennent GRATUITEMENT ; elle ne travaille avec aucun agent, agence de voyage ou intermédiaire, et qui prétend le contraire agit généralement de façon frauduleuse. Se présenter sans pré-contrôle positif entraîne un refus systématique ET un blocage de toute nouvelle réservation, même si vous complétez votre dossier ensuite. Enfin le délai d'examen va de quelques jours à plusieurs mois, et l'ambassade ne renseigne pas sur l'avancement pendant les quatre à dix premières semaines. Le visa national D est délivré en règle générale pour une durée allant jusqu'à un an. Emportez tous vos originaux en bagage à main : la police des frontières peut les exiger à l'entrée.",
prerequis: ["de_visa_dossier"],
preuve: "convocation",
pieces: [
{ nom: "Originaux de toutes les pièces téléversées", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Photos d'identité", format: "original papier", tailleMax: null, traduction: false, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.DAKAR_VISA,
verifieLe: VERIFIE
},

{
id: "de_anmeldung",
phaseDepart: true,
type: "confirmation",
titre: "Déclarer mon domicile — deux semaines après l'emménagement",
consigne: "Dès que vous emménagez dans un logement, vous avez DEUX SEMAINES pour vous déclarer auprès du service de la population (Meldebehörde) de votre commune : c'est le § 17 alinéa 1 de la loi fédérale sur la déclaration de domicile. Vous en ressortez avec votre Meldebescheinigung, l'attestation d'enregistrement, qui vous sera demandée pour presque tout le reste — service des étrangers, banque, assurance. Il vous faut votre passeport avec le visa D et l'attestation de votre bailleur (Wohnungsgeberbestätigung) : demandez-la au propriétaire avant de signer.",
prerequis: ["de_visa_rdv"],
preuve: "recu",
pieces: [
{ nom: "Passeport avec visa national D", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Attestation du bailleur (Wohnungsgeberbestätigung)", format: "original papier", tailleMax: null, traduction: false, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.ANMELDUNG,
verifieLe: VERIFIE
},

{
id: "de_assurance",
phaseDepart: true,
type: "pieces",
titre: "M'affilier à l'assurance maladie et faire envoyer la notification",
consigne: "Les étudiants inscrits dans une université publique ou reconnue par l'État sont assujettis à l'assurance maladie obligatoire (§ 5 SGB V). Et voici le mécanisme qui bloque le plus d'inscriptions : en application du § 199a SGB V, l'université et les caisses légales s'échangent l'information DIRECTEMENT. L'université doit avoir reçu, au plus tard au moment de l'immatriculation, une notification ÉLECTRONIQUE émise par une caisse légale allemande — et cela vaut même si vous êtes couvert par une assurance privée. Contactez donc très tôt une caisse légale de votre choix, donnez-lui le numéro d'expéditeur de votre université pour que la notification parte au bon destinataire, et obtenez soit votre affiliation, soit, si vous restez en privé, une exemption délivrée par une caisse légale. Sans cette notification, votre immatriculation ne peut pas être finalisée.",
prerequis: ["de_anmeldung"],
preuve: "aucune",
pieces: [
{ nom: "Notification électronique d'assurance maladie, transmise par une caisse légale allemande à votre université", format: "transmission électronique caisse → université", tailleMax: null, traduction: false, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.ASSURANCE,
verifieLe: VERIFIE
},

{
id: "de_immatriculation",
phaseDepart: true,
type: "confirmation",
titre: "M'immatriculer à l'université",
consigne: "Immatriculez-vous auprès du Studierendensekretariat dans le délai indiqué sur votre lettre d'admission : ce délai est impératif, le dépasser vous fait perdre votre place. La procédure se fait en ligne ; vous téléversez la déclaration d'immatriculation signée, la lettre d'admission, votre passeport, votre titre d'accès à l'enseignement supérieur, et la notification électronique d'assurance maladie doit être arrivée. L'immatriculation n'est acquise que lorsque le secrétariat a reçu et vérifié l'ensemble des pièces, le paiement de la contribution semestrielle ET la notification de la caisse : vous recevez alors un courriel de confirmation et pouvez télécharger vos certificats de scolarité. Rappel utile : les universités publiques ne prélèvent pas de frais de scolarité, mais une contribution sociale (Semesterbeitrag) est due chaque semestre, d'un montant propre à chaque établissement.",
prerequis: ["de_assurance"],
preuve: "capture",
pieces: [
{ nom: "Déclaration d'immatriculation signée", format: "PDF", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Lettre d'admission (Zulassungsbescheid)", format: "PDF", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Passeport ou pièce d'identité", format: "PDF", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Titre d'accès à l'enseignement supérieur (HZB)", format: "PDF", tailleMax: null, traduction: true, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.IMMATRICULATION,
verifieLe: VERIFIE
},

{
id: "de_titre_sejour",
phaseDepart: true,
type: "complement",
titre: "Demander mon titre de séjour avant l'expiration du visa",
consigne: "Votre visa national D a une durée limitée : vous devez demander votre titre de séjour pour études auprès du service des étrangers (Ausländerbehörde) de votre lieu de résidence AVANT que ce visa n'expire. Le § 81 alinéa 4 de la loi sur le séjour dit que si la demande est déposée avant l'expiration, votre titre en cours est réputé subsister jusqu'à la décision ; une demande tardive ne bénéficie de cette protection que si l'administration l'ordonne pour éviter une rigueur excessive. On vous délivre alors une Fiktionsbescheinigung, l'attestation d'effet de la demande. Présentez de nouveau les originaux fournis pour le visa, plus votre certificat d'immatriculation, votre attestation de domicile et votre preuve de ressources ; le compte bloqué reste bloqué, au profit du service des étrangers cette fois. Aucun délai chiffré unique n'est fixé par la loi : le repère, c'est l'expiration du visa — et les rendez-vous sont longs à obtenir, alors prenez-le dès votre arrivée.",
prerequis: ["de_immatriculation"],
preuve: "recu",
pieces: [
{ nom: "Certificat d'immatriculation (Immatrikulationsbescheinigung)", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Attestation d'enregistrement de domicile (Meldebescheinigung)", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Preuve de ressources et attestation d'assurance maladie", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Originaux déposés lors de la procédure de visa", format: "original papier", tailleMax: null, traduction: false, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.SEJOUR,
verifieLe: VERIFIE
}

]
};
