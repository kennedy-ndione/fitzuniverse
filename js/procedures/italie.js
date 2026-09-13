/**
* ============================================================
* FitzUniverse — le TRONC de la procédure Universitaly (Italie)
* lot S3 (2026-09-13), complété le même jour après lecture des PDF
* ============================================================
*
* Une destination, un portail : Universitaly, portail unique et GRATUIT
* du Ministero dell'Università e della Ricerca. Aucun consulat italien
* n'accepte une demande de visa d'études sans préinscription VALIDÉE
* là-dessus.
*
* CE QUI A CHANGÉ EN COURS DE JOURNÉE. Les lecteurs automatiques ne
* pouvaient pas ouvrir les PDF officiels : universitaly-private.cineca.it
* interdit l'accès automatisé par robots.txt. Trois étapes restaient donc
* `a_confirmer`, et une quatrième portait une affirmation fausse. Charles
* a ouvert les quatre documents dans son navigateur et les a transmis ;
* ils ont été lus page par page le 2026-09-13. Toutes les étapes sont
* désormais vérifiées sur la source, et quatre erreurs sont corrigées —
* elles sont nommées ci-dessous, parce qu'une correction qu'on ne nomme
* pas se refait.
*
* ERREUR 1 — « l'annexe 1 liste pays par pays les titres valables ».
* FAUX. L'Allegato 1 ne contient AUCUNE liste de pays : c'est un texte
* de règles générales (12 ans de scolarité, et ce qu'on demande quand il
* en manque), plus des sections pour les titres américains, britanniques,
* du Baccalauréat International, des Écoles européennes et de quelques
* écoles étrangères opérant en Italie. Un candidat sénégalais, ivoirien
* ou camerounais n'y trouve pas son pays : il applique la règle générale
* et compte lui-même ses années.
*
* ERREUR 2 — « la dichiarazione di valore n'est pas obligatoire ».
* Vrai pour l'UNIVERSITÉ, faux pour le CONSULAT. La FAQ ministérielle
* tranche : « ai fini del rilascio del visto lo studente dovrà produrre
* la DOV oppure l'attestazione CIMEA ». L'un des deux est donc
* obligatoire pour le visa, même si l'établissement ne l'exige pas.
*
* ERREUR 3 — « le visa est révoqué au 31 janvier pour les candidats en
* Laurea ». Le périmètre est plus large : Laurea, Laurea Magistrale,
* Diploma accademico de premier ET de second niveau, y compris à cycle
* unique.
*
* ERREUR 4 — « pas de date d'ouverture publiée, introuvable ». Il n'y en
* a pas À TROUVER : la circulaire dit que les délais de préinscription
* « sono definiti da ogni singola Istituzione della formazione superiore
* e pubblicati nei rispettivi siti ». L'absence était la réponse.
*
* ET UNE RÈGLE NEUVE, qui n'existait dans aucune de nos sources
* secondaires : à partir de 2026-2027, un établissement ne peut valider
* que 120 % de ses places réservées. Au-delà, un « supporto di
* monitoraggio » suspend les validations. Une préinscription peut donc
* être refusée pour épuisement du quota de validation, dossier parfait
* ou non. C'est l'information la plus actionnable du document : elle dit
* qu'il faut déposer TÔT.
*
* AUCUNE COUCHE DE RÉSIDENCE. La circulaire est biennale (2026-2027 et
* 2027-2028) et vaut pour tous les pays : mêmes étapes, mêmes montants,
* mêmes dates. Seul le consulat compétent varie, et it_rdv le dit.
* `residenceRequise: false`.
* ============================================================
*/

const VERIFIE = "2026-09-13";

export const SOURCES = {
PORTAIL: "https://www.universitaly.it/it/studenti-stranieri",
COMPTE: "https://universitaly-private.cineca.it/index.php/login",
COURS: "https://www.universitaly.it/it/cerca-corsi",
CIRCULAIRE: "https://universitaly-private.cineca.it/uploads/universitaly-pubblico/Circolare_2026-2027_studenti_internazionali.pdf",
ANNEXE_TITRES: "https://universitaly-private.cineca.it/uploads/universitaly-pubblico/Allegato_1-Circolare_2026_2027.pdf",
ANNEXE_DIPLOMES: "https://universitaly-private.cineca.it/uploads/universitaly-pubblico/Allegato_2-Circolare_2026-2027.pdf",
FAQ: "https://universitaly-private.cineca.it/uploads/universitaly-pubblico/FAQ.pdf",
MAECI_TITRES: "https://www.esteri.it/en/temi/diplomazia_culturale/universita/riconoscimento_titoli_studio/",
CONSULAT_2026: "https://consbuenosaires.esteri.it/it/servizi-consolari-e-visti/servizi-per-il-cittadino-straniero/visti/studenti-internazionali-nuove-indicazioni-su-visto-e-immatricolazione-per-gli-anni-accademici-2026-2027-e-2027-2028/",
CHECKLIST_VISA: "https://ambulaanbaatar.esteri.it/wp-content/uploads/2026/07/Checklist-Visto-studio-immatricolazione-2026-2027_Luglio26.pdf",
RDV: "https://prenotami.esteri.it/",
SEJOUR: "https://www.portaleimmigrazione.it/ITA/tabelleCosti.html",
CODICE_FISCALE: "https://www.unito.it/internazionalita/arrivare-unito-dallestero/informazioni-pratiche-il-soggiorno/codice-fiscale"
};

export const PROCEDURE_ITALIE = {

id: "italie",
paysDestination: "Italie",
portail: {
nom: "Universitaly",
url: "https://www.universitaly.it/it/studenti-stranieri",
motif: "universitaly\\.it"
},
sources: SOURCES,
residenceRequise: false,

etapes: [

{
id: "it_titre",
type: "pieces",
titre: "Compter mes années de scolarité",
consigne: "La règle est arithmétique avant d'être administrative : votre diplôme de fin d'études secondaires doit sanctionner AU MOINS 12 ANNÉES de scolarité, et il doit vous ouvrir, dans votre propre pays, l'accès à un cours analogue à celui que vous visez. Comptez vos années : l'année préscolaire compte si elle est officiellement reconnue comme partie intégrante du parcours scolaire national, si elle est obligatoire, et si son programme comprenait l'apprentissage de la lecture, de l'écriture et les premiers éléments de calcul. S'il vous manque des années, quatre compléments sont acceptés : la certification que vous avez validé TOUS les examens de la 1re année d'université dans votre pays (système scolaire de 11 ans) ou des DEUX premières années (système de 10 ans) ; un titre post-secondaire non universitaire d'un an (11 ans) ou de deux ans (10 ans), dans une matière proche du cours visé ; une certification de foundation course d'une université italienne ou d'un établissement étranger reconnu ; ou le foundation course propre de l'établissement, même d'une durée inférieure à un an. Sachez ce que ces compléments NE font pas : ils permettent uniquement l'immatriculation en PREMIÈRE année, jamais une abréviation de cursus. Enfin, si votre système prévoit une épreuve d'aptitude académique pour entrer à l'université chez vous, vous devez l'avoir passée — et l'exigence des 12 ans reste due malgré tout.",
prerequis: [],
preuve: "aucune",
pieces: [
{ nom: "Diplôme de fin d'études secondaires", format: "original + scan", tailleMax: null, traduction: true, legalisation: true, precision: "traduction assermentée en italien ; apostille de La Haye, ou légalisation consulaire si votre pays n'est pas partie à la Convention" },
{ nom: "Certification de réussite de la 1re (ou des 2 premières) année(s) d'université, si votre secondaire fait moins de 12 ans", format: "original + scan", tailleMax: null, traduction: true, legalisation: true },
{ nom: "Attestation de réussite de l'épreuve d'aptitude académique, si votre pays en prévoit une pour l'accès à l'université", format: "original + scan", tailleMax: null, traduction: true, legalisation: true }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.ANNEXE_TITRES,
verifieLe: VERIFIE
},

{
id: "it_comparabilite",
type: "pieces",
titre: "Obtenir mon attestation CIMEA ou ma dichiarazione di valore",
consigne: "Deux documents équivalents, et il vous en faut UN : l'attestation de comparabilité du CIMEA, centre ENIC-NARIC italien, accompagnée de son attestation de vérification d'authenticité ; ou la « Dichiarazione di valore in loco » délivrée par l'ambassade ou le consulat d'Italie de votre pays. Attention à la nuance, elle piège beaucoup de candidats : votre UNIVERSITÉ n'est pas obligée de l'exiger — la circulaire n'en fait pas une condition de validation, et l'évaluation du titre lui appartient. Mais le CONSULAT, lui, l'exige : la FAQ ministérielle dit que pour la délivrance du visa, l'étudiant devra produire la DOV ou l'attestation CIMEA. Ne partez donc pas du « mon université ne me le demande pas » : il vous le faudra au guichet des visas. Deuxième point qui a changé pour 2026-2027 : une préinscription ne peut plus être validée « avec réserve » pour cause de dossier incomplet. La réserve n'est admise que dans deux cas — vous n'avez pas encore votre diplôme, ou vous devez passer en Italie les examens d'admission ou l'épreuve de langue. Si votre pays a signé la Convention de Lisbonne, l'attestation de comparabilité se télécharge gratuitement depuis la plateforme ARDI.",
prerequis: ["it_titre"],
preuve: "capture",
pieces: [
{ nom: "Attestation de comparabilité CIMEA + attestation de vérification d'authenticité", format: "PDF", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Dichiarazione di valore in loco (voie alternative, délivrée par le consulat d'Italie)", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Diploma Supplement, pour des études supérieures déjà accomplies", format: "original + scan", tailleMax: null, traduction: true, legalisation: true }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.FAQ,
verifieLe: VERIFIE
},

{
id: "it_compte",
type: "compte",
titre: "Créer mon compte sur Universitaly",
consigne: "Universitaly est le SEUL portail officiel, et il est gratuit. Créez votre compte depuis « Registrati ora / Pre-iscriviti adesso ». Saisissez vos nom, prénom et date de naissance exactement comme ils figurent sur votre passeport — une différence d'une lettre bloque la suite au guichet consulaire. Aucun intermédiaire payant n'est nécessaire : une demande de préinscription passée par une autre voie n'existe pas aux yeux du consulat.",
prerequis: [],
preuve: "capture",
pieces: [
{ nom: "Passeport en cours de validité (page des données personnelles)", format: "PDF", tailleMax: null, traduction: false, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.COMPTE,
verifieLe: VERIFIE
},

{
id: "it_cours",
type: "voeux",
titre: "Choisir mon cours — un seul, et le plus tôt possible",
consigne: "Pas de vœux multiples comme en France : si vous présentez un titre étranger, vous ne pouvez indiquer QU'UN SEUL cours dans votre préinscription. Le choix libre, indépendant du nombre de places réservées, n'existe que pour les titulaires d'un diplôme de l'Allegato 2 — diplômes italiens, écoles italiennes à l'étranger, Écoles européennes : cela ne vous concerne presque certainement pas. ET VOICI CE QUI REND L'HEURE DU DÉPÔT DÉCISIVE. Chaque université fixe au plus tard le 31 décembre le nombre de places réservées aux étudiants étrangers pour l'année suivante, et le communique au CINECA avant l'ouverture du portail. Nouveauté 2026-2027 : un établissement ne peut valider QUE 120 % de ces places. Une fois ce plafond atteint, un système de suivi alerte l'établissement et SUSPEND toute nouvelle validation — votre dossier peut donc rester sans suite pour épuisement du quota, quelle que soit sa qualité. Les places se libèrent au compte-gouttes, dès qu'un consulat signale un refus de visa sur le portail. Déposez tôt. Deux précisions utiles : il n'existe aucune date d'ouverture nationale, chaque établissement publie ses propres délais sur son site, et c'est cette date-là qui vous concerne ; et les boursiers du gouvernement italien ou d'accords de coopération sont admis en surnombre, hors contingent.",
prerequis: ["it_compte", "it_titre"],
preuve: "aucune",
pieces: [],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.CIRCULAIRE,
verifieLe: VERIFIE
},

{
id: "it_langue",
type: "entretien",
titre: "Passer l'épreuve de langue",
consigne: "Il vous faut le niveau B2 au minimum pour une Laurea, une Laurea Magistrale ou un cycle unique ; B1 suffit pour un foundation course. Chaque établissement organise sa propre épreuve d'italien, AVANT la demande de visa et de préférence à distance : le résultat est certifié puis téléversé par l'université dans votre préinscription, ce qui dispense le consulat de le revérifier. Si votre cours est enseigné dans une autre langue, aucune épreuve d'italien n'est demandée, mais vous devez fournir une certification de cette langue-là, et elle doit figurer dans la préinscription. Une règle à ne pas sous-estimer : sans avoir réussi l'épreuve de langue, vous ne pouvez être admis à aucune autre épreuve de concours ou d'aptitude. Vous êtes dispensé si vous détenez le diplôme d'une école italienne à l'étranger, un titre de l'Allegato 2, le diplôme de langue et culture italiennes de Pérouse ou de Sienne, ou une certification CLIQ de niveau C1 ou C2 ; pour une Laurea Magistrale, seules les deux dernières dispenses valent. Et sachez que la dispense de langue ne vous sort pas du contingent : vous restez soumis au quota de places réservées.",
prerequis: ["it_cours"],
preuve: "capture",
pieces: [
{ nom: "Certification d'italien de niveau B2 ou plus (organisme certificateur reconnu)", format: "PDF", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Certification de langue étrangère, si le cours est dispensé dans cette langue", format: "PDF", tailleMax: null, traduction: false, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.CIRCULAIRE,
verifieLe: VERIFIE
},

{
id: "it_saisie",
type: "saisie",
titre: "Remplir ma domanda di preiscrizione",
consigne: "Connecté à votre compte, remplissez la demande de préinscription : état civil et passeport, établissement et cours choisis, représentation consulaire italienne compétente pour votre lieu de résidence, puis téléversez les pièces de votre diplôme et de votre niveau de langue. Si vous êtes encore en terminale et n'avez pas passé l'examen final, votre demande est enregistrée « accettata con riserva » : la réserve sera levée plus tard par l'établissement, sur présentation du diplôme. Le service est entièrement gratuit.",
prerequis: ["it_compte", "it_cours", "it_comparabilite", "it_langue"],
preuve: "numero_dossier",
apresConnexion: true,
pieces: [
{ nom: "Passeport en cours de validité", format: "PDF", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Diplôme de fin d'études secondaires, ou diplôme de premier cycle pour un master", format: "PDF", tailleMax: null, traduction: true, legalisation: true },
{ nom: "Attestation de comparabilité CIMEA ou dichiarazione di valore", format: "PDF", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Certification linguistique, ou attestation de l'épreuve de langue de l'établissement", format: "PDF", tailleMax: null, traduction: false, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.PORTAIL,
verifieLe: VERIFIE
},

{
id: "it_soumission",
type: "soumission",
titre: "Soumettre ma préinscription",
consigne: "Soumettez définitivement : votre demande part alors vers l'établissement choisi ET vers la représentation consulaire italienne. Conservez le numéro de dossier et imprimez le récapitulatif généré par la plateforme — c'est cette impression qui vous sera réclamée au guichet du consulat. Si votre cours est à accès programmé, vous devez en plus passer l'épreuve d'admission organisée par l'université, à l'issue de laquelle chaque établissement publie la « graduatoria di merito » du contingent réservé aux étrangers. Les cursus à accès programmé au niveau national sont ceux d'architecte et la Laurea Magistrale en Scienze della Formazione Primaria ; pour médecine, odontologie et médecine vétérinaire, les modalités relèvent de la loi du 14 mars 2025 n° 26 et seront précisées par une note ultérieure du ministère.",
prerequis: ["it_saisie"],
preuve: "numero_dossier",
apresConnexion: true,
pieces: [],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.CIRCULAIRE,
verifieLe: VERIFIE
},

{
id: "it_validation",
type: "reponse",
titre: "Attendre la validation de l'établissement",
consigne: "L'établissement évalue votre diplôme — cette compétence lui appartient exclusivement, en vertu de l'article 2 de la loi 148/2002 — puis valide ou non votre demande sur Universitaly, en indiquant les documents dont il a vérifié l'authenticité. SEULS les candidats dont la préinscription a été validée peuvent demander un visa. Suivez l'état depuis votre compte et téléchargez le récapitulatif validé. Trois réserves que le ministère impose aux universités d'écrire noir sur blanc, et qu'il vaut mieux entendre maintenant : l'acceptation par l'université ne donne aucun droit au visa ; l'obtention du visa ne donne aucun droit à l'immatriculation ; et l'acceptation ne donne aucun droit à l'immatriculation non plus, même une fois le visa obtenu, même une fois physiquement en Italie, même avec une bourse.",
prerequis: ["it_soumission"],
preuve: "capture",
apresConnexion: true,
pieces: [],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.CIRCULAIRE,
verifieLe: VERIFIE
},

{
id: "it_rdv",
phaseDepart: true,
type: "entretien",
titre: "Prendre rendez-vous au consulat d'Italie",
consigne: "Une fois la préinscription validée, prenez rendez-vous auprès de l'ambassade ou du consulat général d'Italie compétent pour votre lieu de résidence, par le système officiel Prenot@Mi du ministère des Affaires étrangères, ou par le prestataire externe désigné lorsque votre poste l'impose. Chaque poste publie ses propres modalités de rendez-vous sur son site ou sur celui de son prestataire : lisez les siennes, pas une règle générale. Depuis la mise en place du système de suivi, les bureaux des visas voient les validations arriver et contactent parfois eux-mêmes les étudiants, ou réservent des créneaux dédiés. Tout le dossier doit être présenté le jour même : il n'y a pas de dépôt en deux fois. Vous devez ressortir avec une convocation datée, portant l'heure et le lieu.",
prerequis: ["it_validation"],
preuve: "convocation",
pieces: [],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.FAQ,
verifieLe: VERIFIE
},

{
id: "it_visa",
phaseDepart: true,
type: "visa",
titre: "Déposer ma demande de visa national D « studio »",
consigne: "Pour l'année 2026/2027, la demande doit être déposée AU PLUS TARD LE 30 NOVEMBRE 2026 pour les cursus ordinaires — Laurea, Laurea Magistrale, Diploma accademico de 1er et 2e niveau, cycle unique compris (31 octobre 2027 pour 2027/2028). Mais attention : les établissements publient sur leurs portails des dates propres à chaque cours, et elles peuvent être ANTÉRIEURES à celle-là ; c'est la leur qui vous engage. Pour les masters, doctorats, Erasmus, cours isolés et foundation courses, il n'y a pas de date butoir ministérielle, mais la demande ne peut pas être postérieure au début des cours. Vous devez prouver des moyens de subsistance d'au moins 10 179,85 € pour l'année, d'origine licite et traçable, de préférence les vôtres — privilégiez, si votre pays le permet, un compte courant rotatif ou un compte bloqué à VOTRE nom — ou ceux de votre famille jusqu'au 4e degré. Le consulat vérifie la provenance des fonds, les mouvements du compte et leur cohérence avec les revenus et le patrimoine du foyer. Les espèces, les garanties de tiers et les cautions bancaires sont refusées, et une candidature à une bourse régionale sans attestation d'attribution ne compte pas. Sur le logement, un piège classique : une simple candidature, ou même une déclaration d'éligibilité à une place en résidence universitaire, N'EST PAS un justificatif valable. Depuis le 11 janvier 2025, les empreintes digitales sont obligatoires aussi pour les visas nationaux. Vous obtenez un visa D « Immatricolazione Università » valable 365 jours à entrées multiples. Deux exceptions : si vous n'avez pas encore matériellement votre diplôme, ou si vous devez passer en Italie l'épreuve de langue ou les examens d'admission, le consulat délivre un visa D plus court — au moins 100 jours, et jusqu'au 31 janvier de l'année académique concernée — le temps de passer ces épreuves sur place.",
prerequis: ["it_rdv"],
preuve: "recu",
pieces: [
{ nom: "Formulaire de visa national rempli, daté, signé, photo collée", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Passeport délivré depuis moins de 10 ans, valable 3 mois au-delà du séjour, 2 pages vierges", format: "original + photocopies", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Photo d'identité aux normes OACI, 3,5 x 4,0 cm, fond blanc, moins de 6 mois", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Récapitulatif Universitaly validé par l'établissement", format: "impression papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Diplôme donnant accès au cursus, avec copie authentifiée", format: "original papier", tailleMax: null, traduction: true, legalisation: true },
{ nom: "Attestation de comparabilité CIMEA ou dichiarazione di valore — obligatoire pour le visa, même si l'université ne l'a pas exigée", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Preuve de 10 179,85 € pour l'année : relevés bancaires, attestations d'emploi et de revenus, notification de bourse", format: "original papier", tailleMax: null, traduction: true, legalisation: true },
{ nom: "Assurance maladie et hospitalisation, sans limitation ni exception pour l'hospitalisation d'urgence", format: "original + copie", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Justificatif de logement effectif : bail enregistré, dichiarazione di ospitalità, hôtel — une candidature à une résidence universitaire ne suffit pas", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Réservation de billet et justification des moyens du voyage retour", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Acte de naissance et fiche d'état civil", format: "original papier", tailleMax: null, traduction: true, legalisation: true }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.CIRCULAIRE,
verifieLe: VERIFIE
},

{
id: "it_permesso",
phaseDepart: true,
type: "complement",
titre: "Demander mon permesso di soggiorno — 8 jours après l'arrivée",
consigne: "C'est le délai le plus court de toute la procédure : DANS LES HUIT JOURS OUVRABLES suivant votre arrivée en Italie, vous devez déposer votre demande de permesso di soggiorno auprès de la Questura de la ville où vous vous installez. Le dépôt se fait par le « kit postale » retiré dans un bureau de Poste Italiane avec guichet Sportello Amico, ou aux guichets ouverts dans certains établissements. Un point qui vous fera gagner du temps : au moment de vous remettre le visa, le bureau des visas vous délivre une attestation récapitulant votre dossier — préinscription, moyens financiers, assurance santé, logement — et c'est elle que vous joindrez à la demande de permesso. Vous payez : 16,00 € de marca da bollo, 30,46 € pour la production du titre électronique (compte courant postal n° 67422402), 30,00 € de frais d'expédition au guichet, et une contribution de 40,00 € pour un permis de 3 mois à 1 an, ou 50,00 € de 1 à 2 ans. Vous ressortez avec le reçu postal, le « cedolino » : il vaut titre de séjour provisoire, gardez-le sur vous. Si vous êtes entré avec le visa court de 100 jours et que vous réussissez vos épreuves, vous demandez à la Questura le RENOUVELLEMENT de votre permis pour l'année académique entière : vous n'avez PAS à rentrer dans votre pays pour redemander un visa.",
prerequis: ["it_visa"],
preuve: "recu",
pieces: [
{ nom: "Kit postale (modulo 1) rempli", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Photocopie intégrale du passeport avec le visa D", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Attestation récapitulative délivrée par le bureau des visas du consulat", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Marca da bollo de 16,00 €", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Reçu du versement de 30,46 € sur le CCP n° 67422402", format: "original papier", tailleMax: null, traduction: false, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.FAQ,
verifieLe: VERIFIE
},

{
id: "it_codice",
phaseDepart: true,
type: "complement",
titre: "Obtenir mon codice fiscale",
consigne: "Sans codice fiscale, vous ne pouvez ni vous inscrire, ni ouvrir un compte, ni signer un bail, ni vous affilier au service de santé. Vous pouvez le demander AVANT le départ auprès de la représentation consulaire italienne de votre pays, ou une fois sur place à un bureau de l'Agenzia delle Entrate ; beaucoup d'universités publiques le font pour vous via leur bureau international, en quelques jours ouvrables. Pour un ressortissant non-UE : passeport et visa, ou attestation d'identité avec photo délivrée par l'autorité consulaire italienne, plus votre titre de séjour italien.",
prerequis: ["it_permesso"],
preuve: "capture",
pieces: [
{ nom: "Passeport avec visa D", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Reçu de demande ou titre de séjour italien", format: "original papier", tailleMax: null, traduction: false, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.CODICE_FISCALE,
verifieLe: VERIFIE
},

{
id: "it_immatriculation",
phaseDepart: true,
type: "confirmation",
titre: "M'immatriculer, avant le 31 janvier",
consigne: "Finalisez votre immatriculation au secrétariat de l'établissement, avec les ORIGINAUX de toute votre documentation académique : l'établissement est tenu d'en vérifier la véracité, peut exiger l'apostille et la légalisation, et peut écrire directement à votre établissement d'origine. Deux choses à savoir sur l'argent et le calendrier. Les droits universitaires se paient normalement AVANT que l'immatriculation soit finalisée — ce qui veut dire que vous ne pouvez pas les payer tant que le visa n'est pas délivré : ne versez rien avant. Et si vous n'avez pas encore de titre de séjour valide au moment de vous inscrire, l'inscription se fait SOUS RÉSERVE jusqu'au mois de juin de l'année suivante, la Questura confirmant à l'établissement la délivrance ou le rejet de votre permis. Maintenant la date qui compte : à compter du 31 JANVIER de l'année académique, tout candidat en Laurea, Laurea Magistrale, Diploma accademico de premier ou de second niveau — cycle unique compris — qui n'apparaît pas immatriculé sur Universitaly voit son visa d'entrée RÉVOQUÉ, avec signalement simultané à la Questura. Et si vous renoncez, l'établissement est tenu de le signaler par courrier officiel au consulat pour révocation immédiate du visa, ainsi qu'à la Questura. Beaucoup d'établissements fixent en outre, sur leur propre portail, une date plus précoce que celle du ministère : c'est la leur qui vous concerne.",
prerequis: ["it_permesso", "it_codice"],
preuve: "numero_dossier",
pieces: [
{ nom: "Originaux du diplôme et des relevés de notes", format: "original papier", tailleMax: null, traduction: true, legalisation: true },
{ nom: "Attestation de comparabilité CIMEA ou dichiarazione di valore", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Passeport avec visa D et reçu de demande de permesso di soggiorno", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Codice fiscale", format: "original papier", tailleMax: null, traduction: false, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.CIRCULAIRE,
verifieLe: VERIFIE
}

]
};
