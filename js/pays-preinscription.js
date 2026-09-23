/**
* ============================================================
* FitzUniverse — les pays de préinscription, et ce qu'on en sait
* ============================================================
*
* LA SOURCE de preinscriptions.html (lot Préinscriptions, 2026-09-07).
* Rien dans le HTML de cette page ne doit être un fait, un chiffre ou
* un niveau de préparation tapé à la main : tout vient d'ici, et les
* effectifs (établissements, coûts vérifiés) sont CALCULÉS depuis
* assets/data/catalogue.json en rejouant lireFrais() de js/frais.js.
*
* DEUX RÈGLES DURES
* -----------------
* 1. Un FAIT sans `source` (URL http/https) OU sans `verifieLe`
*    (AAAA-MM-JJ) ne peut pas exister dans PAYS : le test parcourt tous
*    les faits de tous les pays et refuse le premier manquant. Ce qui
*    n'a pas pu être sourcé le jour de la lecture n'entre pas comme
*    fait — au mieux comme phrase prudente dans `positionnement`.
* 2. `procedure` est un code fermé. Tant qu'un pays n'est pas
*    « documentee », aucune carte ne peut dire « pas à pas » : le
*    libellé vient de LIBELLES_PROCEDURE, jamais d'une phrase locale.
*
* L'ORDRE DES PAYS EST VALIDÉ (0. décisions prises) : France, Roumanie,
* Turquie, Maroc, Italie, Allemagne, Canada. Les États-Unis n'y sont
* pas (restrictions de visa de janvier 2026, postes consulaires
* africains fermés). La France est « en plein », les six autres sont
* nommés et présentés comme les prochains.
*
* Aucun DOM, aucun Firestore : testable sous Node.
* ============================================================
*/

import { lireFrais, ORDRE_NIVEAUX } from "./frais.js";

/** Le vocabulaire fermé de la procédure de portail. */
export const PROCEDURE = ["documentee", "en_cours", "a_venir"];

export const LIBELLES_PROCEDURE = {
documentee: "Procédure de portail documentée, accompagnée pas à pas",
en_cours: "Procédure de portail en cours de documentation",
a_venir: "Procédure de portail à venir"
};

// ==========================================================
// L'ACCOMPAGNEMENT — une décision de VENTE (lot PRÉINSCRIPTIONS-VITRINE)
// ==========================================================
//
// `procedure` dit ce qu'on SAIT ; `accompagnement` dit ce qu'on VEND.
// Les deux ne se déduisent pas l'un de l'autre, et les confondre a un
// coût dans les deux sens : une destination peut être entièrement
// documentée sans être encore vendue (le temps de former quelqu'un), ou
// ouverte à la vente avant que le dernier fait soit posé (parce que ce
// qui manque n'empêche pas de déposer un dossier).
//
// Le hub ne lit QUE ce champ pour décider d'afficher un bouton. Ouvrir
// une destination doit rester purement documentaire : écrire les
// données, basculer ce champ, copier la page. Aucun module à rouvrir.
export const ACCOMPAGNEMENT = ["ouvert", "a_venir"];

/**
* LE CONTRAT D'UNE DESTINATION OUVERTE.
*
* Ce qu'un pays doit porter pour avoir le droit de passer à « ouvert ».
* La liste est ici, en clair, parce que c'est elle qui empêchera
* d'ouvrir une destination à moitié prête — et parce que la personne qui
* ouvrira la Roumanie dans six mois lira ceci, pas une conversation.
*
*   nom            le nom du pays, tel que le catalogue l'écrit
*   code           le code du drapeau (assets/flags/<code>.svg)
*   langue         au moins une langue d'enseignement
*   positionnement la phrase qui dit à qui cette destination convient
*   portail        { nom, url } — le portail officiel de dépôt
*   procedure      une procédure de portail COMPOSÉE, avec ses étapes
*                  (js/procedures/) — injectée, voir defautsDeDestination
*   faits          au moins un fait sourcé et daté, et au moins un
*                  DIFFUSABLE en public : sans lui, la page de la
*                  destination n'a aucune preuve à montrer gratuitement,
*                  et c'est justement la preuve qui fait vendre.
*/
export const CONTRAT_DESTINATION = ["nom", "code", "langue", "positionnement", "portail", "procedure", "faitPublic"];

/**
* LA DIFFUSION D'UN FAIT — gratuit ou payant, décidé fait par fait.
*
* La ligne du lot : PUBLIER LA RÈGLE, VENDRE LE CALCUL.
*
*   "public"  la règle. Les seuils français, les droits, le plafond
*             d'exonération, le plafond des vœux : ce sont des textes
*             publiés par l'État, et les afficher avec leur source est
*             la preuve que nos chiffres sont vrais. Cette preuve est
*             gratuite, sinon elle ne prouve rien.
*   "client"  le calcul. Les frais de dossier du pays de RÉSIDENCE, le
*             nom de la banque, le moment du paiement, les dates de la
*             campagne : c'est exactement ce que le Diagnostic (10 000 F)
*             et le Dossier France (75 000 F) vendent. Ces faits restent
*             dans les données et alimentent le Diagnostic et l'espace
*             client — seul leur AFFICHAGE PUBLIC est retiré.
*
* DÉFAUT : "client". Un fait dont personne n'a décidé la diffusion ne
* part pas en ligne. C'est le sens sûr : oublier de publier une règle se
* voit et se corrige, publier par inadvertance ce qu'on vend ne se
* rattrape pas.
*/
export const DIFFUSION = ["public", "client"];

export const DIFFUSION_PAR_DEFAUT = "client";

/**
* Un fait = { texte, montant?, devise?, diffusion?, source, verifieLe }.
* `source` et `verifieLe` sont OBLIGATOIRES — voir la règle 1.
*/
export const PAYS = [

{
id: "france",
nom: "France",
ordre: 1,
code: "fr",
langue: ["français"],
portail: { nom: "Études en France", url: "https://pastel.diplomatie.gouv.fr/etudesenfrance/" },
procedure: "en_cours",
accompagnement: "ouvert",
faits: [
{
cle: "ressources",
diffusion: "public",
texte: "Ressources exigées pour le visa étudiant : 877,50 € par mois, soit environ 10 530 € par an, depuis le 1er août 2026 (décret n° 2026-526 du 22 juin 2026).",
montant: 877.5, devise: "EUR",
montants: { mensuel: 877.5, annuel: 10530 },
source: "https://www.infomigrants.net/fr/post/72455/france--le-niveau-minimum-de-ressources-pour-les-etudiants-etrangers-passe-a-877-euros-a-compter-du-1er-aout-2026",
verifieLe: "2026-09-07"
},
{
cle: "droits",
diffusion: "public",
texte: "Droits d'inscription différenciés 2026-2027 : 2 902 € en licence, 3 950 € en master. Les exonérations sont plafonnées à 30 % des étudiants non européens (25 % en 2027-2028).",
montant: 3950, devise: "EUR",
montants: { licence: 2902, master: 3950 },
plafondExoneration: 0.30,
source: "https://www.service-public.gouv.fr/particuliers/actualites/A18927?lang=en",
verifieLe: "2026-09-07"
},
// Réécrit le 2026-09-08 (lot EEF-DOC). Ce fait venait d'un agrégateur
// et portait la MÊME erreur que l'étape « vœux » de la procédure :
// « 7 vœux au maximum PAR NIVEAU ». Le plafond est de 7 AU TOTAL. Ce
// fait-ci est le plus exposé des deux — il s'affiche sur la page
// publique Préinscriptions (#faitsFrance) —, donc corriger la procédure
// sans le corriger revenait à laisser l'erreur là où elle se lit le
// plus. « 73 pays » et « frais variables selon le pays » partent avec :
// aucune page officielle consultée ne les porte, et les frais du
// Sénégal sont déjà dits, sourcés, dans le fait suivant.
{
cle: "procedure",
diffusion: "public",
texte: "Études en France : au maximum sept (7) choix de formations connectées AU TOTAL — un plafond global, et non par niveau. Chaque type de formation a son sous-plafond à l'intérieur de ces 7 : 3 pour la Licence 1 (DAP), 2 pour les écoles d'architecture (DAP Jaune), 7 pour les BUT, les licences 2 et 3 et les masters.",
source: "https://www.senegal.campusfrance.org/je-constitue-mon-dossier-sur-etudes-en-france",
verifieLe: "2026-09-08"
},
// `residence` ajouté le 2026-09-08. Ce fait n'a JAMAIS été général : ce
// sont les frais de l'espace Campus France du SÉNÉGAL, qui varient d'un
// pays à l'autre. Rien ne le disait en donnée — seulement le mot
// « Sénégal » au milieu d'une phrase —, si bien que le Diagnostic France
// facturait 85 000 F CFA à un acheteur ivoirien ou camerounais. Le champ
// rend la restriction lisible par le code, plus seulement par un
// lecteur humain attentif : js/diagnostic-france.js le compare au pays
// de résidence déclaré et se tait quand ils diffèrent.
{
cle: "fraisDossier",
diffusion: "client",
residence: "Sénégal",
texte: "Frais de dossier Campus France Sénégal : 85 000 F CFA, non remboursables. « Ne procéder à aucun paiement avant de recevoir cette demande » de paiement ; règlement en agence SUNU BANK.",
montant: 85000, devise: "XOF",
source: "https://www.senegal.campusfrance.org/les-questions-frequemment-posees",
verifieLe: "2026-09-07"
},
{
cle: "calendrier",
diffusion: "client",
texte: "Calendrier Sénégal, rentrée 2026 : ouverture le 1er octobre, dépôt jusqu'au 15 décembre pour les formations connectées (du 1er avril au 12 juillet pour les non connectées), vérification des documents jusqu'au 27 juillet — la campagne se termine fin juillet.",
source: "https://www.senegal.campusfrance.org/calendrier-de-la-procedure-2026",
verifieLe: "2026-09-07"
}
],
positionnement: "Le plus gros marché francophone, aux règles désormais publiées noir sur blanc : droits, ressources exigées et plafond d'exonération."
},

{
id: "roumanie",
nom: "Roumanie",
ordre: 2,
code: "ro",
langue: ["français", "anglais", "allemand", "roumain"],
portail: { nom: "Study in Romania", url: "https://studyinromania.gov.ro" },
procedure: "documentee",
accompagnement: "ouvert",
// Lot S3 (2026-09-13) : le fait d'avant venait de etudier-en-roumanie.com,
// un agrégateur — interdit par la doctrine du dépôt, et faux sur un point :
// il présentait la lettre d'acceptation comme une approbation ministérielle
// consécutive à une « pré-acceptation », en taisant que c'est l'UNIVERSITÉ
// qui saisit le ministère, jamais le candidat. Les cinq faits ci-dessous
// ont été lus le 2026-09-13 sur studyinromania.gov.ro, eviza.mae.ro et
// igi.mai.gov.ro.
faits: [
{
cle: "acceptation",
diffusion: "public",
texte: "La lettre d'acceptation aux études (scrisoare de acceptare la studii) est délivrée par le ministère de l'Éducation, pas par l'université : c'est l'université qui évalue le dossier puis saisit le ministère, dont le délai maximal de traitement est de 30 jours ouvrables.",
source: "https://studyinromania.gov.ro/procedures",
verifieLe: "2026-09-13"
},
{
cle: "droits",
diffusion: "public",
texte: "Frais de scolarité pour les non-UE : d'environ 2 000 € à près de 9 000 € par an selon l'université et le domaine — de 1 980 € à 8 550 € à l'université Babeș-Bolyai de Cluj en 2026-2027. Chaque université les publie programme par programme, au-dessus d'un plancher légal (Ordonnance du Gouvernement n° 22/2009).",
// Corrigé le 2026-09-23 : la borne basse « d'environ 400 € » de la FAQ
// du ministère ne correspond à aucune grille hors UE lue ce jour-là.
source: "https://www.ubbcluj.ro/ro/taxe/files/2026-2027/Regulament-privind-taxe-de-admitere_scolarizare_finalizare-a-studiilor-2026-2027.pdf",
verifieLe: "2026-09-23"
},
{
cle: "visa",
diffusion: "public",
texte: "Visa de long séjour pour études (D/SD) : 300 € pour les demandes transmises via le portail e-Viza à partir du 27 avril 2026, contre 120 € auparavant. Décision en 30 jours au plus, après avis de l'Inspectorat général pour l'immigration.",
montant: 300, devise: "EUR",
source: "https://eviza.mae.ro/ro_VisaFees",
verifieLe: "2026-09-13"
},
{
cle: "sejour",
diffusion: "client",
texte: "Le visa ne vaut que 90 jours : le permis de séjour temporaire, 265 lei TVA comprise, se dépose dans les 30 premiers jours suivant l'entrée et au plus tard 30 jours avant l'expiration du visa. Il est valable un an et se renouvelle chaque année.",
source: "https://igi.mai.gov.ro/studii/",
verifieLe: "2026-09-13"
},
{
cle: "bourse",
diffusion: "public",
texte: "Bourses du ministère roumain des Affaires étrangères : candidature exclusivement en ligne sur la plateforme officielle, du 16 février au 31 mars 2026, résultats vers le 15 juillet. Ni médecine, ni médecine dentaire, ni pharmacie ; licence et master uniquement en roumain.",
source: "https://scholarships.studyinromania.gov.ro/scholarship-about",
verifieLe: "2026-09-13"
}
],
positionnement: "Admission sur dossier, possible en français, dans l'espace Schengen — mais le visa roumain n'ouvre que la Roumanie. Toute la procédure tient à une pièce : la lettre d'acceptation du ministère."
},

{
id: "turquie",
nom: "Turquie",
ordre: 3,
code: "tr",
langue: ["turc", "anglais"],
portail: { nom: "Study in Türkiye (YÖK)", url: "https://studyinturkiye.gov.tr/" },
procedure: "documentee",
accompagnement: "ouvert",
// Lot S3 (2026-09-13) : le fait d'avant venait de study-abroad.org, un
// agrégateur. Les fourchettes de frais qu'il donnait ne sont publiées par
// aucune source officielle — aucun barème national n'existe, chaque
// université fixe les siens — et le catalogue porte désormais trois coûts
// turcs réellement vérifiés. Les faits ci-dessous ont été lus le
// 2026-09-13 sur turkiyeburslari.gov.tr, studyinturkiye.gov.tr,
// edenklik.meb.gov.tr et goc.gov.tr.
faits: [
{
cle: "bourse",
diffusion: "public",
texte: "Türkiye Bursları : une seule période de candidature par an, du 10 janvier au 20 février, sur un système unique. Évaluation en mars-avril, entretiens d'avril à juin, résultats début août, départs en septembre. Il n'existe aucune session de rattrapage.",
source: "https://turkiyeburslari.gov.tr/announcements/turkiye-scholarships-2026-applications-121",
verifieLe: "2026-09-13"
},
{
cle: "bourseMontant",
diffusion: "public",
texte: "La bourse d'État couvre le placement en université, les frais de scolarité, une année de cours de turc, l'hébergement, l'assurance maladie et le billet d'avion. Allocation mensuelle : 6 500 TL en licence, 9 500 TL en master, 13 000 TL en doctorat.",
montant: 6500, devise: "TRY",
source: "https://turkiyeburslari.gov.tr/fulltimeprograms",
verifieLe: "2026-09-23"
},
{
cle: "denklik",
diffusion: "public",
texte: "L'équivalence du diplôme de fin de secondaire (denklik) est délivrée par le ministère de l'ÉDUCATION NATIONALE, pas par le YÖK, via le système e-Denklik : 227 centres, dont 81 à l'étranger, ce qui permet d'engager la démarche avant le départ.",
source: "https://edenklik.meb.gov.tr/",
verifieLe: "2026-09-13"
},
{
cle: "sejour",
diffusion: "client",
texte: "Permis de séjour étudiant : demande en ligne gratuite sur e-ikamet, uniquement depuis la Turquie. La carte coûte 964,00 TL en 2026, sans exemption ; le droit de séjour n'est pas perçu pour les étudiants des écoles et facultés turques. La date de référence est l'expiration du visa, avec 10 jours de tolérance.",
montant: 964, devise: "TRY",
source: "https://www.goc.gov.tr/ikamet-sss",
verifieLe: "2026-09-13"
},
{
cle: "sante",
diffusion: "client",
texte: "L'assurance maladie publique (GSS) doit être demandée dans les trois mois suivant l'inscription universitaire. Passé ce délai, le droit est perdu et une assurance privée devient obligatoire.",
source: "https://studyinturkiye.gov.tr/StudyinTurkey/ShowDetail?rID=aOSryNclUYg=&&cId=PE4Nr0mMoY4=",
verifieLe: "2026-09-13"
}
],
positionnement: "Un très gros volume d'accueil, et deux voies distinctes : la bourse d'État, qui place elle-même ses lauréats, ou l'autofinancement, qui passe par l'examen TR-YÖS et une candidature par université.",
},

{
id: "maroc",
nom: "Maroc",
ordre: 4,
code: "ma",
langue: ["français", "arabe"],
portail: { nom: "AMCI — Agence Marocaine de Coopération Internationale", url: "https://www.amci.ma/" },
procedure: "documentee",
accompagnement: "ouvert",
// Lot S3 (2026-09-13) : ce pays n'avait AUCUN fait — sa carte publique
// était donc une promesse sans une seule ligne vérifiable. Les cinq faits
// ci-dessous ont été lus le 2026-09-13 sur fr.diplomatie.ma, consulat.ma,
// uca.ma, um5.ac.ma et aui.ma.
faits: [
{
cle: "porteEntree",
diffusion: "public",
texte: "Pour toute université publique, il n'existe aucune candidature directe : le dossier part de l'autorité compétente du pays d'origine et passe par la voie diplomatique jusqu'à l'AMCI. L'Université Cadi Ayyad l'écrit — « Tout dossier non transmis par l'AMCI ne sera pas pris en considération ».",
source: "https://www.uca.ma/fr/page/agence-marocaine-de-la-cooperation-internationale-amci",
verifieLe: "2026-09-13"
},
{
cle: "calendrier",
diffusion: "public",
texte: "Les dossiers doivent parvenir à l'AMCI avant le 31 juillet de chaque année. C'est la seule date publiée : les délais nationaux de dépôt, eux, sont communiqués chaque année par l'Agence aux représentations diplomatiques marocaines, et ferment plus tôt.",
source: "https://fr.diplomatie.ma/fr/etudier-au-maroc",
verifieLe: "2026-09-13"
},
{
cle: "visa",
diffusion: "public",
texte: "Dispense de visa d'entrée au Maroc : Sénégal, Côte d'Ivoire, Burkina Faso, Togo, Niger et Gabon sont dispensés ; Mali, Guinée (Conakry) et Congo-Brazzaville le sont avec une AEVM à demander en ligne. Le Bénin et le Cameroun ne figurent pas sur la liste : visa requis.",
source: "https://www.consulat.ma/fr/liste-des-pays-dont-les-ressortissants-sont-dispenses-du-visa-dentree-au-maroc",
verifieLe: "2026-09-13"
},
{
cle: "piegeVisa",
diffusion: "public",
texte: "« Le changement de type de visa déjà obtenu n'est pas autorisé une fois son titulaire entré sur le territoire marocain » : entrer en touriste pour s'inscrire ensuite est impossible, il faut ressortir et redemander depuis le pays de résidence. Et une dispense de visa ne dispense pas du titre de séjour.",
source: "https://www.consulat.ma/fr/visas-ordinaires",
verifieLe: "2026-09-13"
},
{
cle: "voiePrivee",
diffusion: "public",
texte: "Deux établissements admettent en direct, sans passer par l'AMCI : l'UM6P, dont chaque programme affiche sa propre date de clôture, et Al Akhawayn, qui publie un coût total estimé de 77 790 MAD — scolarité 50 400, logement 5 880, restauration 8 500, inscription 5 100, et frais annexes — sans dire s'il vaut pour un semestre ou pour l'année : sa scolarité se facture au crédit, 3 360 MAD le crédit.",
// Corrigé le 2026-09-23 : « par an » n'est pas écrit sur la page
// d'Al Akhawayn, et la scolarité de 50 400 MAD vaut exactement quinze
// crédits, la charge d'UN semestre.
montant: 77790, devise: "MAD",
source: "https://aui.ma/admission-aid/international/tuition-and-fees",
verifieLe: "2026-09-23"
}
],
positionnement: "Proche, francophone, souvent sans visa : mais dans le public, la porte d'entrée est diplomatique et se ferme le 31 juillet. Pour candidater soi-même, il faut viser le privé — UM6P ou Al Akhawayn."
},

{
id: "italie",
nom: "Italie",
ordre: 5,
code: "it",
langue: ["italien", "anglais"],
portail: { nom: "Universitaly", url: "https://www.universitaly.it/it/studenti-stranieri" },
// Passée à « documentee » le 2026-09-13, en fin de journée : les quatre
// PDF officiels (circulaire, Allegato 1, Allegato 2, FAQ) ont été lus
// page par page après que Charles les a ouverts lui-même — le serveur du
// ministère interdit l'accès automatisé. Les treize étapes sont
// désormais vérifiées sur la source, et quatre erreurs ont été corrigées.
procedure: "documentee",
accompagnement: "ouvert",
// Lot S3 (2026-09-13) : le fait d'avant venait de study-abroad.org, un
// agrégateur, et le catalogue porte désormais onze coûts italiens
// réellement vérifiés. Les faits ci-dessous ont été lus le 2026-09-13 sur
// universitaly.it, esteri.it et portaleimmigrazione.it.
faits: [
{
cle: "portail",
diffusion: "public",
texte: "Universitaly est le seul portail officiel de préinscription, et il est gratuit. Sans préinscription validée par l'établissement, aucun consulat italien n'accepte une demande de visa d'études — et un candidat titulaire d'un titre étranger ne peut indiquer qu'UN SEUL cours : il n'y a pas de vœux multiples.",
source: "https://www.universitaly.it/it/studenti-stranieri",
verifieLe: "2026-09-13"
},
{
cle: "quota",
diffusion: "public",
texte: "Nouveauté 2026-2027 : un établissement ne peut valider que 120 % de ses places réservées aux étudiants étrangers. Passé ce plafond, un système de suivi suspend toute nouvelle validation — une préinscription peut donc rester sans suite pour épuisement du quota, quelle que soit la qualité du dossier. Les places ne se libèrent qu'au fil des refus de visa signalés sur le portail : déposer tôt est décisif.",
source: "https://universitaly-private.cineca.it/uploads/universitaly-pubblico/Circolare_2026-2027_studenti_internazionali.pdf",
verifieLe: "2026-09-13"
},
{
cle: "titre",
diffusion: "public",
texte: "Le diplôme de fin d'études secondaires doit sanctionner au moins 12 années de scolarité. L'année préscolaire compte si elle est obligatoire, officiellement intégrée au parcours national et comprend lecture, écriture et calcul. S'il manque des années, elles se comblent par une ou deux années d'université validées dans le pays d'origine, un titre post-secondaire, ou un foundation course — mais cela n'ouvre que la première année, jamais une abréviation de cursus.",
source: "https://universitaly-private.cineca.it/uploads/universitaly-pubblico/Allegato_1-Circolare_2026_2027.pdf",
verifieLe: "2026-09-13"
},
{
cle: "comparabilite",
diffusion: "client",
texte: "Piège fréquent : l'université n'est pas tenue d'exiger une attestation CIMEA ou une dichiarazione di valore, mais le CONSULAT, lui, l'exige pour délivrer le visa. « Mon université ne me le demande pas » ne dispense de rien. Et depuis 2026-2027, une préinscription ne peut plus être validée « avec réserve » pour dossier incomplet : la réserve n'est admise que si le diplôme n'est pas encore obtenu, ou si des épreuves doivent être passées en Italie.",
source: "https://universitaly-private.cineca.it/uploads/universitaly-pubblico/FAQ.pdf",
verifieLe: "2026-09-13"
},
{
cle: "calendrier",
diffusion: "public",
texte: "La demande de visa doit être déposée au plus tard le 31 octobre 2027 pour l'année 2027-2028 (le 30 novembre 2026 pour 2026-2027), pour les cursus ordinaires — Laurea, Laurea Magistrale, cycle unique, diplômes académiques de 1er et 2e niveau. Pour les masters, doctorats et Foundation Courses, pas de date butoir ministérielle, mais jamais après le début des cours.",
source: "https://www.universitaly.it/it/studenti-stranieri",
verifieLe: "2026-09-23"
},
{
cle: "ressources",
diffusion: "public",
texte: "Moyens de subsistance exigés pour le visa : 10 179,85 € pour l'année, d'origine licite et traçable, hors billet retour et hors frais d'inscription. Les espèces, les garanties de tiers et les cautions bancaires sont refusées, et une candidature à une bourse régionale sans attestation d'attribution ne compte pas.",
montant: 10179.85, devise: "EUR",
source: "https://ambulaanbaatar.esteri.it/wp-content/uploads/2026/07/Checklist-Visto-studio-immatricolazione-2026-2027_Luglio26.pdf",
verifieLe: "2026-09-13"
},
{
cle: "sejour",
diffusion: "client",
texte: "Permesso di soggiorno : à demander dans les HUIT JOURS OUVRABLES suivant l'arrivée, auprès de la Questura, via le kit postale. Coût : 16 € de marca da bollo, 30,46 € pour le titre électronique, 30 € d'expédition, plus 40 € de contribution pour un permis de 3 mois à 1 an ou 50 € de 1 à 2 ans.",
source: "https://www.portaleimmigrazione.it/ITA/tabelleCosti.html",
verifieLe: "2026-09-13"
},
{
cle: "immatriculation",
diffusion: "public",
texte: "À compter du 31 janvier de l'année académique, tout candidat en Laurea, Laurea Magistrale, cycle unique ou diplôme académique de 1er et 2e niveau qui n'apparaît pas immatriculé sur Universitaly voit son visa d'entrée révoqué, avec signalement simultané à la Questura. L'immatriculation n'est donc pas une formalité de fin de parcours.",
source: "https://www.universitaly.it/it/studenti-stranieri",
verifieLe: "2026-09-13"
}
],
positionnement: "Sous-estimée : plusieurs établissements déjà au catalogue, et des bourses régionales DSU déjà listées. La procédure est entièrement publique et gratuite, mais elle tient à deux dates et à un quota — la date limite du visa (31 octobre 2027 pour la rentrée 2027-2028), le 31 janvier pour l'immatriculation, et 120 % de places validables seulement."
},

{
id: "allemagne",
nom: "Allemagne",
ordre: 6,
code: "de",
langue: ["allemand", "anglais"],
portail: { nom: "uni-assist", url: "https://my.uni-assist.de/" },
procedure: "documentee",
accompagnement: "ouvert",
// Lot S3 (2026-09-13) : le montant du compte bloqué était juste, mais sa
// source était mygermanuniversity.com, un agrégateur — pour un chiffre que
// le portail consulaire fédéral publie lui-même. Il est désormais sourcé
// là. Les quatre autres faits ont été lus le 2026-09-13 sur
// digital.diplo.de, dakar.diplo.de, uni-assist.de et uni-bonn.de.
faits: [
{
cle: "ressources",
diffusion: "public",
texte: "Compte bloqué exigé pour le visa : au minimum 992 € par mois pour un visa d'études, soit 11 904 € par an, aligné sur les taux maximaux du BAföG (1 091 €/mois, soit 13 092 €/an, pour un visa de recherche de place d'études).",
montant: 11904, devise: "EUR",
montants: { mensuel: 992, annuel: 11904 },
source: "https://digital.diplo.de/studium/",
verifieLe: "2026-09-13"
},
{
cle: "banques",
diffusion: "public",
texte: "Point décisif pour un candidat africain : l'ambassade d'Allemagne à Dakar n'accepte que les banques allemandes et européennes pour le compte bloqué — les banques africaines sont refusées. Et l'attestation d'ouverture doit indiquer le montant crédité ET la somme disponible chaque mois, sans quoi elle est rejetée.",
source: "https://dakar.diplo.de/sn-fr/service/visa/sperrkonto-1895102",
verifieLe: "2026-09-13"
},
{
cle: "fraisDossier",
diffusion: "public",
texte: "Frais de dossier uni-assist : 75 € pour le premier cursus choisi, puis 30 € par cursus supplémentaire, quel que soit le nombre d'universités. Même tarif en procédure VPD et pour les Studienkollegs ; le compteur repart à 75 € à chaque nouveau semestre.",
montant: 75, devise: "EUR",
source: "https://www.uni-assist.de/en/how-to-apply/pay-all-fees/handling-fees/",
verifieLe: "2026-09-13"
},
{
cle: "calendrier",
diffusion: "public",
texte: "Dates limites les plus courantes : 15 juillet pour une rentrée au semestre d'hiver, 15 janvier pour le semestre d'été. Mais la date opposable est celle que chaque université fixe pour chaque formation, souvent plus précoce — uni-assist recommande de candidater au moins 8 semaines avant.",
source: "https://www.uni-assist.de/en/how-to-apply/plan-your-application/deadlines-processing-time/",
verifieLe: "2026-09-13"
},
{
cle: "assurance",
diffusion: "client",
texte: "L'immatriculation ne peut pas être finalisée tant que l'université n'a pas reçu une notification ÉLECTRONIQUE émise par une caisse d'assurance maladie légale allemande — et cela vaut même pour un étudiant couvert par une assurance privée, qui doit alors obtenir une exemption délivrée par une caisse légale.",
source: "https://www.uni-bonn.de/en/studying/application-admission-and-enrollment/insurance-for-students",
verifieLe: "2026-09-13"
}
],
positionnement: "Réputée gratuite à étudier — la plupart des universités publiques ne prélèvent qu'une contribution par semestre, sauf pour les étudiants hors UE dans le Bade-Wurtemberg et à la TU Munich — et chère à entrer : le compte bloqué se constitue avant le visa, dans une banque européenne."
},

{
id: "canada",
nom: "Canada",
ordre: 7,
code: "ca",
langue: ["anglais", "français"],
portail: { nom: "Compte IRCC", url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/application/ircc-accounts.html" },
procedure: "documentee",
accompagnement: "ouvert",
// Lot S3 (2026-09-13) : le fait d'avant était juste mais sourcé sur
// visahq.news, un agrégateur — pour une règle qu'IRCC publie lui-même.
// Il est désormais sourcé sur canada.ca, et quatre faits l'accompagnent,
// dont celui qui compte le plus : la fin du Volet direct pour les études,
// que beaucoup de pages non officielles annoncent encore comme en vigueur.
faits: [
{
cle: "finVde",
diffusion: "public",
texte: "Le Volet direct pour les études (VDE/SDS) et le Nigeria Student Express ont été SUPPRIMÉS le 8 novembre 2024. Le Sénégal et le Maroc en faisaient partie. Il n'existe plus de voie accélérée par pays, plus d'obligation de CPG ni de test de langue à ce titre : tout passe par le volet régulier. Depuis la même date, on ne peut plus changer d'école sur le même permis.",
source: "https://www.canada.ca/en/immigration-refugees-citizenship/news/notices/end-student-direct-stream-nigeria-student-express.html",
verifieLe: "2026-09-13"
},
{
cle: "lap",
diffusion: "public",
texte: "Depuis le 1er janvier 2026, les étudiants de maîtrise et de doctorat menant à un diplôme dans un établissement d'enseignement désigné PUBLIC sont dispensés de la lettre d'attestation provinciale ou territoriale (LAP/LAT). L'exemption vise les établissements publics, pas les privés.",
source: "https://www.canada.ca/en/immigration-refugees-citizenship/news/notices/2026-provincial-territorial-allocations-under-international-student-cap.html",
verifieLe: "2026-09-13"
},
{
cle: "fonds",
diffusion: "public",
texte: "Preuve de fonds hors Québec, pour toute demande déposée le 1er septembre 2026 ou après : 23 448 $ CA pour une personne seule sur la première année, hors droits de scolarité et hors transport (29 192 $ pour 2 personnes, 35 888 $ pour 3). Au Québec, le barème du ministère s'applique : 24 617 $ CA pour une personne depuis le 1er janvier 2026.",
montant: 23448, devise: "CAD",
source: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/get-documents/financial-support.html",
verifieLe: "2026-09-13"
},
{
cle: "frais",
diffusion: "public",
texte: "Frais fédéraux : 150 $ CA pour le permis d'études, plus 85 $ CA de biométrie par demandeur, plafonnés à 170 $ CA pour une famille déposant en même temps. L'AVE ou le visa de résident temporaire est délivré automatiquement avec le permis, sans frais supplémentaires.",
montant: 150, devise: "CAD",
source: "https://ircc.canada.ca/english/information/fees/fees.asp",
verifieLe: "2026-09-23"
},
{
cle: "caq",
diffusion: "public",
texte: "Québec : le CAQ pour études est obligatoire au-delà de six mois, coûte 135 $ CA depuis le 1er janvier 2026, et se demande sur Arrima AVANT la demande de permis d'études. Le paiement doit être fait dans l'heure suivant l'envoi de la demande, puis les pièces téléversées sous 15 jours.",
montant: 135, devise: "CAD",
source: "https://www.quebec.ca/en/education/study-quebec/temporary-selection-studies",
verifieLe: "2026-09-13"
}
],
positionnement: "Master et doctorat en établissement public uniquement — c'est aussi l'un des profils dispensés de lettre d'attestation provinciale depuis 2026.",
avertissement: "Ce n'est pas une destination « pas cher et facile » : les frais sont élevés, la preuve de fonds est le premier motif de refus, et le Volet direct pour les études n'existe plus depuis le 8 novembre 2024."
}

];

/** Les pays, triés par `ordre`. Ne mute pas PAYS. */
export function lirePays() {
return [...PAYS].sort((a, b) => a.ordre - b.ordre);
}

/** Vrai quand cette destination est VENDUE aujourd'hui. */
export function estOuverte(pays) {
return !!pays && pays.accompagnement === "ouvert";
}

/** Les destinations vendues, dans l'ordre. */
export function destinationsOuvertes() {
return lirePays().filter(estOuverte);
}

/** Les destinations annoncées mais pas encore vendues, dans l'ordre. */
export function destinationsAVenir() {
return lirePays().filter((p) => !estOuverte(p));
}

/**
* La page dédiée d'une destination : `preinscription-<id>.html`.
*
* Une vraie page, jamais un paramètre d'URL : elle doit être indexable
* sur « étudier en France depuis le Sénégal ». Le nom se calcule ici,
* une fois, pour que le hub n'ait aucun chemin écrit en dur.
*/
export function pageDeDestination(pays) {
return `preinscription-${pays && pays.id}.html`;
}

/**
* La diffusion d'un fait, avec son défaut sûr.
* Un fait sans `diffusion` déclarée n'est PAS public.
*/
export function diffusionDuFait(fait) {
const d = fait && fait.diffusion;
return DIFFUSION.includes(d) ? d : DIFFUSION_PAR_DEFAUT;
}

/**
* Les faits qu'on a le droit d'afficher sur une page PUBLIQUE : la
* règle, jamais le calcul.
*
* C'est cette fonction, et elle seule, que les pages publiques appellent.
* Un fait ajouté demain sans `diffusion` ne sortira pas tout seul.
*/
export function faitsPublics(pays) {
return ((pays && pays.faits) || []).filter((f) => diffusionDuFait(f) === "public");
}

/** Les faits réservés aux clients — le Diagnostic et l'espace les lisent. */
export function faitsClients(pays) {
return ((pays && pays.faits) || []).filter((f) => diffusionDuFait(f) === "client");
}

/**
* Ce qui manque à un pays pour avoir le droit d'être « ouvert ».
* Liste vide = le contrat est tenu.
*
* LA PROCÉDURE ARRIVE EN ARGUMENT, et ce n'est pas un détail de style :
* js/procedures/residences/france-senegal.js importe CAMPAGNE_FRANCE
* d'ici. Importer js/procedures/ depuis ce module fermerait le cycle, et
* un cycle d'imports ESM se paie en `undefined` au premier chargement,
* dans le module qui a eu le malheur d'être évalué en second. L'appelant
* — le hub, la page de destination, le test — a déjà trouverProcedure()
* sous la main : il la passe.
*
* @param {Object} pays
* @param {{procedure?: Object|null}} [contexte] la procédure COMPOSÉE
*/
export function defautsDeDestination(pays, { procedure = null } = {}) {

const defauts = [];

if (!pays) return ["destination absente"];

if (!pays.nom || typeof pays.nom !== "string") defauts.push("nom manquant");
if (!pays.code || typeof pays.code !== "string") defauts.push("code de drapeau manquant");
if (!Array.isArray(pays.langue) || !pays.langue.length) defauts.push("aucune langue d'enseignement");
if (typeof pays.positionnement !== "string" || !pays.positionnement.trim()) defauts.push("positionnement vide");
if (!pays.portail || !/^https?:\/\//.test(pays.portail.url || "")) defauts.push("portail officiel manquant");
if (!ACCOMPAGNEMENT.includes(pays.accompagnement)) defauts.push(`accompagnement « ${pays.accompagnement} » hors vocabulaire`);

// La procédure : des étapes réelles, pas une intention. Une destination
// vendue sans procédure composée vendrait un accompagnement dont
// personne ne connaît les étapes.
if (!procedure || !Array.isArray(procedure.etapes) || !procedure.etapes.length) {
defauts.push("aucune procédure de portail composée");
}

// Au moins un fait sourcé et daté…
const solides = ((pays.faits) || []).filter((f) => /^https?:\/\//.test(f.source || "") && /^\d{4}-\d{2}-\d{2}$/.test(f.verifieLe || ""));
if (!solides.length) defauts.push("aucun fait sourcé et daté");

// …et au moins un DIFFUSABLE : la page publique d'une destination sans
// preuve gratuite n'a rien à montrer, et c'est la preuve qui vend.
if (!faitsPublics(pays).filter((f) => solides.includes(f)).length) defauts.push("aucun fait public sourcé et daté");

return defauts;

}

/**
* Ce que le catalogue sait d'un pays, CALCULÉ — jamais tapé :
*   etablissements : universités du catalogue dont `country` est ce pays
*   coutsVerifies  : celles dont au moins un niveau porte un montant
*                    vérifié (sourcé + daté), en rejouant lireFrais()
*   procedure      : le code fermé du pays
* Accepte l'instantané brut (`universities`) comme la forme du chargeur
* du site (`universites`).
*/
export function etatDunPays(pays, catalogue, options) {

const unis = (catalogue && (catalogue.universities || catalogue.universites)) || [];
const dUnPays = unis.filter((u) => u && u.country === pays.nom);

const coutsVerifies = dUnPays.filter((u) => ORDRE_NIVEAUX.some((n) => lireFrais(u, n, options).etat === "verifie")).length;

return { etablissements: dUnPays.length, coutsVerifies, procedure: pays.procedure };

}

/** Libellé de procédure, toujours depuis le vocabulaire fermé. */
export function libelleProcedure(pays) {
return LIBELLES_PROCEDURE[pays && pays.procedure] || LIBELLES_PROCEDURE.a_venir;
}

/**
* La campagne Études en France (grille B, 2026-09-07). `ouverture` est un
* fait (le 1er octobre, calendrier Campus France Sénégal — voir le fait
* « calendrier »). `cloture` est une BORNE COMMERCIALE : Campus France
* ne publie pas de date de fin de campagne pour 2027-2028 (vérifié le
* 2026-09-07) ; la dernière échéance publiée pour 2026 est le 27 juillet
* (vérification des documents). Le 31 juillet est donc la fin de la
* durée « une campagne » des offres Dossier France — pas un fait, une
* décision, dite comme telle. Le serveur (functions/lib/achat.js) en
* porte le MIROIR, et test/functions-achat.test.mjs compare les deux.
*/
export const CAMPAGNE_FRANCE = {
ouverture: { mois: 10, jour: 1 },
cloture: { mois: 7, jour: 31 },
faitCalendrier: "calendrier",
// Les JALONS publiés (lot E2, 2026-09-07) — formations connectées,
// calendrier Campus France Sénégal 2026 (page + PDF Calendrier2026VF_0).
// Une seule source pour js/procedures/* : jamais recopiés là-bas. Les
// mois d'octobre à décembre sont ceux de l'année d'ouverture, janvier à
// juillet ceux de l'année de clôture — jalonDeCampagne() fait le calcul.
jalons: {
soumission: { mois: 12, jour: 15, libelle: "Soumission du dossier (formations connectées)" },
paiement: { mois: 12, jour: 27, libelle: "Paiement des frais de dossier" },
visa: { mois: 5, jour: 1, libelle: "Demande de visa possible à partir du", debut: true },
confirmation: { mois: 5, jour: 31, libelle: "Confirmation du choix définitif" },
complements: { mois: 7, jour: 27, libelle: "Compléments de dossier et vérification des originaux" }
},
sourceJalons: "https://www.senegal.campusfrance.org/calendrier-de-la-procedure-2026",
jalonsVerifiesLe: "2026-09-07"
};

/**
* La date ISO d'un jalon pour la campagne en cours à `date` : un jalon
* d'octobre à décembre tombe dans l'année d'ouverture, un jalon de
* janvier à juillet dans l'année de clôture (finDeCampagne).
*
* `jalons` est le troisième argument depuis le lot S1b : le calendrier
* est une donnée du pays de RÉSIDENCE, pas de la destination, et il vit
* désormais dans la couche (js/procedures/residences/*). Par défaut ce
* sont ceux du Sénégal, les seuls publiés à ce jour — c'est ce qui
* permet au lot S2 d'ajouter un pays sans rouvrir ce module. La borne
* de campagne (octobre → 31 juillet) reste commune : elle est aussi la
* frontière commerciale des offres, et le webhook en porte le miroir.
*
* @returns {{cle:string, iso:string, libelle:string, debut:boolean}|null}
*/
export function jalonDeCampagne(cle, date = new Date(), jalons = CAMPAGNE_FRANCE.jalons) {
const jalon = (jalons || CAMPAGNE_FRANCE.jalons)[cle];
if (!jalon) return null;
const anneeCloture = finDeCampagne(date).getUTCFullYear();
const annee = jalon.mois > CAMPAGNE_FRANCE.cloture.mois ? anneeCloture - 1 : anneeCloture;
const iso = `${annee}-${String(jalon.mois).padStart(2, "0")}-${String(jalon.jour).padStart(2, "0")}`;
return { cle, iso, libelle: jalon.libelle, debut: jalon.debut === true };
}

/**
* Le 31 juillet de la campagne en cours à `date` (UTC, fin de journée) :
* août → décembre = l'année suivante ; janvier → juillet = la même année.
* Référence côté site ; le calcul qui FAIT FOI est celui du webhook.
*/
export function finDeCampagne(date) {
const d = date instanceof Date ? date : new Date(date);
const mois = d.getUTCMonth() + 1;
let annee = d.getUTCFullYear();
if (mois > CAMPAGNE_FRANCE.cloture.mois) annee += 1;
return new Date(Date.UTC(annee, CAMPAGNE_FRANCE.cloture.mois - 1, CAMPAGNE_FRANCE.cloture.jour, 23, 59, 59));
}

/** Un fait France par sa clé (`ressources`, `droits`, `fraisDossier`, …). */
export function faitFrance(cle) {
const france = PAYS.find((p) => p.id === "france");
const fait = france && france.faits.find((f) => f.cle === cle);
if (!fait) throw new Error(`Fait France introuvable : ${cle}`);
return fait;
}
