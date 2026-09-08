/**
* ============================================================
* FitzUniverse — le TRONC de la procédure Études en France (lot S1b)
* ============================================================
*
* Ce fichier ne connaît qu'une DESTINATION : la France, sur la
* plateforme Études en France (pastel.diplomatie.gouv.fr). Il ne
* connaît AUCUN pays de résidence — tout ce qui dépend de l'endroit d'où
* part l'étudiant vit dans js/procedures/residences/<destination>-
* <residence>.js, et la composition les réunit (js/procedures/index.js,
* composerProcedure).
*
* POURQUOI CE PARTAGE (2026-09-08). Ce fichier s'appelait
* france-senegal.js et l'index refusait de le rendre à qui ne résidait
* pas au Sénégal : un Ivoirien qui visait la France par Études en France
* voyait son dossier SANS aucune étape, sans pièces, sans jalons, et
* rien ne le lui disait. Or les onze étapes ci-dessous sont celles de la
* PLATEFORME — créer son compte, saisir son parcours, formuler ses vœux,
* soumettre, payer, passer l'entretien, attendre, confirmer, compléter,
* demander son visa. Ce qui change d'un pays à l'autre, ce sont les
* MONTANTS, les DATES, les LIEUX et les pièces d'identité locales : rien
* de tout cela n'est ici.
*
* CE QUE LES SOURCES SONT, ET CE QU'ELLES NE SONT PAS. Les pages citées
* sont celles de Campus France SÉNÉGAL, relues le 2026-09-08. C'est là
* que ce texte a été vérifié, et c'est donc ce qu'on affiche — citer une
* page nationale qu'on n'a pas ouverte, pour faire moins local, serait
* exactement le mensonge que ce dossier existe pour empêcher. Le partage
* s'est fait dans un seul sens : le tronc ne dit RIEN de plus que ces
* pages, il en dit MOINS. Chaque phrase propre au Sénégal — les 85 000 F,
* SUNU BANK, l'exemption CEDEAO, le préfixe « SN », le test de français
* du bac Arabe L-AR, les antennes, le rendez-vous VFS de Dakar, les
* dates du calendrier — est partie dans la couche Sénégal, avec sa
* source. Le tronc ne peut donc pas prêter à un Ivoirien un fait
* sénégalais : il n'en porte plus aucun.
*
* LA CONTREPARTIE, DITE : une étape marquée `dependResidence: true` est
* incomplète sans sa couche. Quand la couche manque, composerProcedure
* lui ajoute une MENTION qui le dit, et lui retire son échéance — jamais
* un montant, jamais une date, jamais un zéro empruntés à un autre pays.
*
* `dependDe` (lot S2-MODÈLE, 2026-09-08) : CE QUE L'ÉTAPE CONSOMME dans
* la couche, clé par clé. Il existe un troisième état entre « pays
* documenté » et « pays inconnu », et c'est le plus fréquent : le pays
* est documenté pour ses frais, pas pour son calendrier — Campus France
* ne publie le calendrier d'une campagne qu'au moment de l'ouvrir. Une
* couche déclare alors `absences: { calendrier: "<phrase>" }`, et
* composerProcedure sert cette phrase aux étapes qui citent « calendrier »
* dans leur `dependDe`. Sans ce champ, l'étudiant voyait ses frais, aucune
* échéance, et AUCUNE explication : son pays comptant pour documenté, la
* mention générale ne s'affichait pas.
*
* Les clés utilisées ici :
*   "fraisDossier" le montant dû à l'espace Campus France du pays ;
*   "calendrier"   les jalons de la campagne locale ;
*   "jalonsAval"   les dates d'APRÈS le dépôt (entretien, réponses). Un
*                  espace peut publier sa fenêtre de candidature sans
*                  publier celles-là — c'est le cas du Maroc — et deux
*                  étapes en dépendent sans porter d'échéance elles-mêmes.
*
* RÈGLES DURES (test/procedures.test.mjs)
*   - une étape sans `source` ET `verifieLe` n'existe pas ;
*   - une étape qui se passe APRÈS la connexion (`apresConnexion: true`)
*     n'est FERME que si sa source est la page qui décrit ces écrans-là,
*     c'est-à-dire DOSSIER. Sinon elle est "a_confirmer" ;
*   - aucune étape n'invente une pièce, un format ou une taille : si la
*     page ne le dit pas, le champ est absent ;
*   - aucune date n'est recopiée : `echeance.cle` désigne un jalon du
*     calendrier de la COUCHE de résidence, jamais un jour écrit ici.
*
* L'étape de type "soumission" est celle qui alimente preuveDepot (lot
* E1) : la cocher AVEC son numéro de dossier remplit la preuve de dépôt.
* ============================================================
*/

// 2026-09-08 : les pages effectivement citées ci-dessous ont été relues
// ce jour-là. `verifieLe` dit « cette étape a été confrontée à sa source
// à cette date » ; dater d'aujourd'hui une étape dont on n'a pas rouvert
// la page serait le genre d'à-peu-près que ce fichier existe pour
// empêcher. Le lot S1b n'a rien rouvert : il a DÉPLACÉ des phrases déjà
// vérifiées, il ne les redate pas.
const VERIFIE = "2026-09-08";

export const SOURCES = {
FAQ: "https://www.senegal.campusfrance.org/les-questions-frequemment-posees",
CAL: "https://www.senegal.campusfrance.org/calendrier-de-la-procedure-2026",
PROC: "https://www.senegal.campusfrance.org/la-procedure-etudes-en-france",
DOSSIER: "https://www.senegal.campusfrance.org/je-constitue-mon-dossier-sur-etudes-en-france",
CANDID: "https://www.senegal.campusfrance.org/candidater-a-une-formation",
PRECONS: "https://www.senegal.campusfrance.org/la-phase-pre-consulaire"
};

export const PROCEDURE_FRANCE = {

id: "france",
paysDestination: "France",
portail: {
nom: "Études en France",
url: "https://pastel.diplomatie.gouv.fr/etudesenfrance/",
// Ce qui reconnaît une université du catalogue comme « sur ce portail ».
motif: "pastel\\.diplomatie\\.gouv\\.fr/etudesenfrance"
},
sources: SOURCES,

// Ce que lit un étudiant dont le pays de résidence n'a pas encore sa
// couche, sur chaque étape marquée `dependResidence`. Elle nomme les
// trois choses qui manquent vraiment, et elle envoie au seul endroit qui
// puisse les donner. La dernière phrase n'est pas une précaution de
// style : Études en France ne s'applique pas depuis tous les pays, et
// promettre onze étapes à quelqu'un qui relève d'une autre voie serait
// remplacer un silence par une erreur.
mentionResidence: "Votre pays de résidence n'est pas encore documenté ici : ce qu'il détermine — frais de dossier de l'espace Campus France, dates du calendrier local, lieu de l'entretien — reste à vérifier auprès de l'espace Campus France de votre pays, qui vous dira aussi si la procédure Études en France s'y applique.",

// L'ordre est l'ordre d'affichage ; les prérequis disent l'ordre RÉEL.
etapes: [

{
id: "ef_compte",
type: "compte",
titre: "Créer mon compte Études en France",
consigne: "Sur la plateforme, cliquez sur « Je m'inscris », avec une adresse de courriel valide ; validez le lien reçu, puis créez un mot de passe d'au moins 11 caractères (majuscule, minuscules, chiffre, caractère spécial). Si vous avez déjà un compte, n'en créez jamais un second : reconnectez-vous avec votre adresse.",
prerequis: [],
preuve: "aucune",
pieces: [],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.DOSSIER,
verifieLe: VERIFIE
},

{
id: "ef_saisie",
type: "saisie",
titre: "Compléter mes informations personnelles",
// Ce qui a quitté cette consigne le 2026-09-08 (lot S1b) et vit
// maintenant dans la couche Sénégal : la carte de séjour et le récépissé
// délivrés « auprès des autorités sénégalaises », l'exemption CEDEAO,
// les justificatifs d'une activité au Sénégal, et le conseil sur
// l'antenne. Aucun de ces quatre points ne vaut pour un candidat qui
// part d'ailleurs — le premier lui réclamerait même une pièce qu'il n'a
// aucune raison de posséder.
consigne: "Renseignez identité, coordonnées (adresse et deux numéros de téléphone), CV et statut particulier ; toutes ces informations doivent être exactes et conformes à vos documents officiels.",
prerequis: ["ef_compte", "profile"],
preuve: "aucune",
pieces: [
{ nom: "Photo d'identité", format: "scan", tailleMax: "50 Ko", traduction: false, legalisation: false },
{ nom: "Pièce d'identité (carte nationale d'identité ou passeport)", format: "scan", tailleMax: "500 Ko", traduction: false, legalisation: false },
{ nom: "Curriculum vitae", format: "scan", tailleMax: "500 Ko", traduction: false, legalisation: false }
],
echeance: null,
apresConnexion: true,
dependResidence: true,
dependDe: [],
fiabilite: "verifie_source_officielle",
source: SOURCES.DOSSIER,
verifieLe: VERIFIE
},

{
id: "ef_pieces",
type: "pieces",
titre: "Renseigner mon parcours et joindre mes diplômes",
// Le test de français exigé AVANT dépôt pour un baccalauréat portant la
// mention « Arabe L-AR » est une règle du baccalauréat sénégalais :
// elle est partie dans la couche, avec la pièce qui va avec. Ce qui
// reste vaut pour tout candidat : les relevés, les diplômes,
// l'accréditation d'un établissement privé, le plafond de 500 Ko et la
// règle de traduction, citée mot pour mot.
consigne: "Détaillez chaque année d'études avec ses justificatifs : relevés de notes des trois dernières années, tous les diplômes obtenus (bac et son relevé, licence, master, BTS, DUT…), et l'attestation d'accréditation de la formation si votre établissement est privé. Aucun fichier téléversé ne peut dépasser 500 Ko : le plafond est général, il vaut pour chaque pièce. Tous les documents doivent être en français ou traduits en Français auprès d'un traducteur assermenté. Dans le cas où le document est traduit, il faut joindre aussi obligatoirement le document original.",
prerequis: ["ef_saisie", "checklist", "traductions"],
preuve: "aucune",
pieces: [
{ nom: "Relevés de notes des 3 dernières années", format: "scan", tailleMax: "500 Ko", traduction: true, legalisation: false },
{ nom: "Diplômes obtenus (bac + relevé, licence, master, BTS, DUT…)", format: "scan", tailleMax: "500 Ko", traduction: true, legalisation: false },
{ nom: "Attestation d'accréditation de la formation (établissements privés)", format: "scan", tailleMax: "500 Ko", traduction: false, legalisation: false }
],
echeance: null,
apresConnexion: true,
dependResidence: true,
dependDe: [],
fiabilite: "verifie_source_officielle",
source: SOURCES.DOSSIER,
verifieLe: VERIFIE
},

{
id: "ef_voeux",
type: "voeux",
titre: "Formuler mes vœux de formation et mes motivations",
// LE PLAFOND EST GLOBAL, PAS PAR NIVEAU (correction du 2026-09-08).
// L'ancien texte reprenait un agrégateur : « 7 vœux par niveau ». La
// page DOSSIER dit « au maximum sept (7) choix de formations
// connectées », puis donne des sous-plafonds PAR TYPE de formation qui
// vivent SOUS ce total — elle le prouve par ses propres exemples, qui
// tombent tous les deux sur 7 : « une Licence 1 en Droit (3 universités)
// et un BUT en carrières juridiques (4 IUT) », « 3 DAP Licence
// Informatique et 4 Licence 2 Informatique ».
//
// L'erreur n'était pas cosmétique : un candidat en Licence 1 qui lisait
// « 7 par niveau » croyait disposer de 7 places de DAP alors qu'il en a
// 3. Il en demandait 7, la plateforme en refusait 4, et il l'apprenait
// au moment de valider — après avoir écrit sept lettres de motivation.
// D'où l'ordre du texte : le total d'abord, les sous-plafonds ensuite,
// et un exemple chiffré qui montre l'addition.
//
// C'est une règle de la PLATEFORME : elle ne dépend d'aucune résidence,
// et reste donc entière dans le tronc.
consigne: "Vous pouvez faire au maximum sept (7) choix de formations connectées : ce plafond de 7 est GLOBAL, toutes formations confondues. À l'intérieur de ces 7, chaque type de formation a son propre plafond — Licence 1 (DAP) : 3 formations ; écoles d'architecture (DAP Jaune) : 2 écoles ; BUT : 7 formations ; Licences 2, 3 et Masters : 7 formations. Ces sous-plafonds ne s'ajoutent pas au total, ils s'y logent : une Licence 1 en Droit (3 universités) et un BUT en carrières juridiques (4 IUT), cela fait 3 + 4 = 7, et vos vœux sont épuisés. Rédigez pour chacun une motivation claire et personnalisée, et veillez à la cohérence de l'ensemble.",
prerequis: ["ef_pieces"],
preuve: "aucune",
pieces: [],
echeance: null,
apresConnexion: true,
fiabilite: "verifie_source_officielle",
source: SOURCES.DOSSIER,
verifieLe: VERIFIE
},

{
id: "ef_soumission",
type: "soumission",
titre: "Soumettre mon dossier sur Études en France",
// Le préfixe du numéro de dossier est celui de l'espace du pays
// (« SN… » au Sénégal) : il est dans la couche. Ce qui reste dit où
// trouver le numéro, pas par quoi il commence.
consigne: "Vérifiez tout avant de soumettre : après la soumission, une modification n'est possible que par message depuis votre compte, sans garantie. Votre numéro de dossier figure dans vos informations personnelles : c'est lui que vous déclarez ici.",
prerequis: ["ef_voeux", "ressources"],
preuve: "numero_dossier",
pieces: [],
echeance: { depuis: "calendrier", cle: "soumission" },
dependResidence: true,
dependDe: ["calendrier"],
fiabilite: "verifie_source_officielle",
source: SOURCES.FAQ,
verifieLe: VERIFIE
},

{
id: "ef_paiement",
type: "paiement",
titre: "Payer les frais de dossier",
// ÉTAPE ENTIÈREMENT DE RÉSIDENCE pour ses chiffres : le montant, la
// banque et le délai de validation sont ceux de l'espace Campus France
// du pays. Ce que garde le tronc est la seule chose qui protège
// vraiment l'étudiant et qui ne dépend d'aucun pays : on ne paie
// qu'après avoir reçu la demande de paiement. La couche Sénégal
// REMPLACE cette consigne par la sienne, plus précise, avec sa source.
consigne: "Attendez le courriel de demande de paiement, envoyé après la soumission et le traitement de votre dossier : ne payez JAMAIS avant. La demande de paiement ne signifie pas que le dossier est éligible.",
prerequis: ["ef_soumission"],
preuve: "recu",
pieces: [],
echeance: { depuis: "calendrier", cle: "paiement" },
dependResidence: true,
dependDe: ["fraisDossier", "calendrier"],
fiabilite: "verifie_source_officielle",
source: SOURCES.FAQ,
verifieLe: VERIFIE
},

{
id: "ef_entretien",
type: "entretien",
titre: "Prendre rendez-vous pour l'entretien pédagogique",
// Le délai de 7 jours et l'antenne déterminée par l'adresse sont du
// calendrier et du réseau sénégalais : ils sont dans la couche.
consigne: "Dès réception du courriel d'autorisation, prenez rendez-vous sur la plateforme. Si aucun créneau n'apparaît, Campus France en ouvre régulièrement : consultez le planning souvent.",
prerequis: ["ef_paiement"],
preuve: "convocation",
pieces: [],
echeance: null,
dependResidence: true,
dependDe: ["jalonsAval"],
fiabilite: "verifie_source_officielle",
source: SOURCES.CAL,
verifieLe: VERIFIE
},

{
id: "ef_reponse",
type: "reponse",
titre: "Attendre la réponse des établissements",
// Le texte vaut partout ; c'est le CALENDRIER de la campagne locale qui
// dit quand ces réponses tombent, d'où `dependResidence`.
consigne: "Les établissements répondent sur la plateforme selon leur propre calendrier. Une réorientation vers un niveau inférieur (master demandé, L3 proposée) n'est pas éligible.",
prerequis: ["ef_entretien"],
preuve: "aucune",
pieces: [],
echeance: null,
dependResidence: true,
dependDe: ["jalonsAval"],
fiabilite: "verifie_source_officielle",
source: SOURCES.CAL,
verifieLe: VERIFIE
},

{
id: "ef_confirmation",
type: "confirmation",
titre: "Confirmer mon choix définitif et télécharger l'accord préalable",
consigne: "Validez votre choix de formation sur la plateforme avant la date limite, puis téléchargez l'accord préalable d'inscription.",
prerequis: ["ef_reponse"],
preuve: "capture",
pieces: [],
echeance: { depuis: "calendrier", cle: "confirmation" },
dependResidence: true,
dependDe: ["calendrier"],
fiabilite: "verifie_source_officielle",
source: SOURCES.PRECONS,
verifieLe: VERIFIE
},

{
id: "ef_complement",
type: "complement",
titre: "Fournir les compléments et présenter les originaux, si demandé",
consigne: "Si Campus France vous le demande, joignez tout complément de dossier ou présentez vos documents originaux, dès que possible et avant la date limite. Tous les compléments (relevés de l'année en cours, diplôme en cours d'obtention) doivent être ajoutés avant la clôture de la campagne.",
prerequis: ["ef_confirmation"],
preuve: "aucune",
pieces: [],
echeance: { depuis: "calendrier", cle: "complements" },
dependResidence: true,
dependDe: ["calendrier"],
fiabilite: "verifie_source_officielle",
source: SOURCES.CAL,
verifieLe: VERIFIE
},

{
id: "ef_visa",
type: "visa",
titre: "Demander mon visa étudiant après le courriel de fin de procédure",
// france-visas.gouv.fr est le guichet national : il reste au tronc. Le
// centre où l'on dépose (VFS Global à Dakar) est de la couche.
consigne: "Dès réception du courriel de fin de procédure, déposez votre demande de visa sur france-visas.gouv.fr, et avant la clôture de la campagne visas : n'attendez pas le dernier moment.",
prerequis: ["ef_complement"],
preuve: "aucune",
pieces: [],
echeance: { depuis: "calendrier", cle: "visa" },
dependResidence: true,
dependDe: ["calendrier"],
fiabilite: "verifie_source_officielle",
source: SOURCES.CAL,
verifieLe: VERIFIE
}

]

};
