/**
* ============================================================
* FitzUniverse — la procédure Études en France, depuis le Sénégal (E2)
* ============================================================
*
* UNE PROCÉDURE = UN COUPLE destination × résidence. Celle-ci : la
* France, pour un candidat résidant au Sénégal, sur la plateforme
* Études en France (pastel.diplomatie.gouv.fr). Remplie UNIQUEMENT
* avec ce qui est LISIBLE SANS AUTHENTIFICATION, le 2026-09-07 :
*
*   FAQ        senegal.campusfrance.org/les-questions-frequemment-posees
*              (85 000 F non remboursables, SUNU BANK, aucun paiement
*              à l'avance, demande de paiement reçue après soumission et
*              traitement, numéro de dossier « SN… », entretien dans
*              l'antenne choisie, paiement non validé après 7 jours)
*   CAL        senegal.campusfrance.org/calendrier-de-la-procedure-2026
*              (+ PDF Calendrier2026VF_0.pdf, lu avec pdftotext) :
*              formations connectées 1er oct → 15 déc, paiement → 27 déc,
*              RDV entretien sous 7 jours, réponses selon le calendrier
*              des établissements, confirmation → 31 mai, compléments
*              → 27 juillet, demande de visa à partir du 1er mai
*   PROC       senegal.campusfrance.org/la-procedure-etudes-en-france
*   DOSSIER    senegal.campusfrance.org/je-constitue-mon-dossier-sur-etudes-en-france
*              (création du compte ; puis les écrans APRÈS connexion :
*              photo < 50 Ko, CV < 500 Ko, tout fichier ≤ 500 Ko,
*              documents en français ou traduits par un traducteur
*              assermenté, original joint)
*   CANDID     senegal.campusfrance.org/candidater-a-une-formation
*   PRECONS    senegal.campusfrance.org/la-phase-pre-consulaire
*
* PLUS AUCUN AGRÉGATEUR ICI (lot EEF-DOC, 2026-09-08). La table portait
* demarchesetrangers.fr, d'où venaient « 73 pays », « 7 vœux par niveau »
* et « entretien 20-30 min ». Un agrégateur n'est pas une source : il
* recopie, il vieillit, et il se trompe. Celui-ci se trompait — voir la
* note de ef_voeux : le plafond n'est pas de 7 PAR NIVEAU, il est de 7
* AU TOTAL, et un candidat qui suivait cet agrégateur perdait des vœux.
*
* RÈGLES DURES (test/procedures.test.mjs)
*   - une étape sans `source` ET `verifieLe` n'existe pas ;
*   - une étape qui se passe APRÈS la connexion (`apresConnexion: true`)
*     n'est FERME que si sa source est la page qui décrit ces écrans-là,
*     c'est-à-dire DOSSIER. Sinon elle est "a_confirmer". La règle a
*     changé le 2026-09-08 : elle disait « après connexion ⇒ toujours
*     a_confirmer », par prudence, en supposant que seule une passe
*     authentifiée pourrait trancher. C'était trop fort — Campus France
*     Sénégal DÉCRIT publiquement ses propres écrans après connexion
*     (tailles des fichiers, règle de traduction, plafond de vœux,
*     exemption CEDEAO). Une source officielle qui documente l'écran
*     vaut mieux qu'une passe réelle non faite. Le garde-fou qui reste :
*     on ne promeut pas un écran d'après-connexion en citant le
*     calendrier ou la FAQ, seulement DOSSIER ;
*   - aucune étape n'invente une pièce, un format ou une taille : si la
*     page ne le dit pas, le champ est absent ;
*   - le calendrier vient de js/pays-preinscription.js (CAMPAGNE_FRANCE.
*     jalons), jamais recopié : `echeance.cle` désigne un jalon.
*
* L'étape de type "soumission" est celle qui alimente preuveDepot (lot
* E1) : la cocher AVEC son numéro de dossier remplit la preuve de dépôt.
* ============================================================
*/

// 2026-09-08 : les QUATRE pages citées ci-dessous ont été relues ce
// jour-là, pas seulement DOSSIER (elle-même datée « Mise à jour le 02
// octobre 2025 »). C'est ce qui autorise une date unique : `verifieLe`
// dit « cette étape a été confrontée à sa source à cette date », et
// dater d'aujourd'hui une étape dont on n'a pas rouvert la page serait
// exactement le genre d'à-peu-près que ce fichier existe pour empêcher.
const VERIFIE = "2026-09-08";

const SOURCES = {
FAQ: "https://www.senegal.campusfrance.org/les-questions-frequemment-posees",
CAL: "https://www.senegal.campusfrance.org/calendrier-de-la-procedure-2026",
PROC: "https://www.senegal.campusfrance.org/la-procedure-etudes-en-france",
DOSSIER: "https://www.senegal.campusfrance.org/je-constitue-mon-dossier-sur-etudes-en-france",
CANDID: "https://www.senegal.campusfrance.org/candidater-a-une-formation",
PRECONS: "https://www.senegal.campusfrance.org/la-phase-pre-consulaire"
};

export const PROCEDURE_FRANCE_SENEGAL = {

id: "france-senegal",
paysDestination: "France",
paysResidence: "Sénégal",
portail: {
nom: "Études en France",
url: "https://pastel.diplomatie.gouv.fr/etudesenfrance/",
// Ce qui reconnaît une université du catalogue comme « sur ce portail ».
motif: "pastel\\.diplomatie\\.gouv\\.fr/etudesenfrance"
},
sources: SOURCES,

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
// La phrase sur l'antenne est un CONSEIL, pas un fait de la source, et
// elle le dit (2026-09-08). Elle affirmait auparavant que « l'adresse
// indiquée détermine l'antenne où se tiendra votre entretien » : la
// page DOSSIER ne dit rien de tel — elle demande une adresse, point.
// C'est la FAQ qui relie l'entretien à l'antenne choisie selon le lieu
// de résidence déclaré. Le conseil est bon, mais un conseil présenté
// comme une règle de Campus France est un mensonge utile, et c'est
// encore un mensonge.
consigne: "Renseignez identité, coordonnées (adresse et deux numéros de téléphone), CV et statut particulier ; toutes ces informations doivent être exactes et conformes à vos documents officiels. Si vous n'êtes pas sénégalais, joignez en plus une carte de séjour en cours de validité ou un récépissé obtenu auprès des autorités sénégalaises — sauf pour les ressortissants de la zone CEDEAO, exemptés de titre de séjour au Sénégal à la date de rédaction de cette page — ainsi que les justificatifs d'une activité au Sénégal, travail ou études, depuis au moins un an. Nous vous conseillons de déclarer une adresse proche de l'antenne Campus France où vous souhaitez passer votre entretien, le lieu de résidence déclaré déterminant l'antenne : c'est notre conseil, cette page ne le formule pas.",
prerequis: ["ef_compte", "profile"],
preuve: "aucune",
pieces: [
{ nom: "Photo d'identité", format: "scan", tailleMax: "50 Ko", traduction: false, legalisation: false },
{ nom: "Pièce d'identité (CNI ou passeport ; pour un étranger, carte de séjour en cours de validité ou récépissé — sauf ressortissants de la zone CEDEAO, exemptés — et justificatifs d'une activité au Sénégal depuis au moins un an)", format: "scan", tailleMax: "500 Ko", traduction: false, legalisation: false },
{ nom: "Curriculum vitae", format: "scan", tailleMax: "500 Ko", traduction: false, legalisation: false }
],
echeance: null,
apresConnexion: true,
fiabilite: "verifie_source_officielle",
source: SOURCES.DOSSIER,
verifieLe: VERIFIE
},

{
id: "ef_pieces",
type: "pieces",
titre: "Renseigner mon parcours et joindre mes diplômes",
// Source passée de FAQ à DOSSIER (2026-09-08) : c'est DOSSIER qui porte
// les tailles de fichier et la règle de traduction, citée ici mot pour
// mot. Conséquence assumée : le sigle « ANAQ-Sup » disparaît du texte.
// Il est réel et il est bien de Campus France Sénégal — mais il est sur
// la FAQ, pas sur DOSSIER, qui écrit « l'attestation d'accréditation de
// la formation (pour les établissements privés) ». Une étape ne porte
// qu'UNE source ; lui en faire dire plus qu'elle ne dit, c'est
// précisément ce qu'on reproche aux agrégateurs. Le sigle reviendra le
// jour où une étape pourra citer deux pages.
consigne: "Détaillez chaque année d'études avec ses justificatifs : relevés de notes des trois dernières années, tous les diplômes obtenus (bac et son relevé, licence, master, BTS, DUT…), et l'attestation d'accréditation de la formation si votre établissement est privé. Aucun fichier téléversé ne peut dépasser 500 Ko : le plafond est général, il vaut pour chaque pièce. Tous les documents doivent être en français ou traduits en Français auprès d'un traducteur assermenté. Dans le cas où le document est traduit, il faut joindre aussi obligatoirement le document original. Si votre baccalauréat porte la mention Arabe L-AR, vous devez obligatoirement passer un test de français AVANT de déposer votre dossier sur la plateforme : ne le laissez pas pour la fin, il conditionne le dépôt.",
prerequis: ["ef_saisie", "checklist", "traductions"],
preuve: "aucune",
pieces: [
{ nom: "Relevés de notes des 3 dernières années", format: "scan", tailleMax: "500 Ko", traduction: true, legalisation: false },
{ nom: "Diplômes obtenus (bac + relevé, licence, master, BTS, DUT…)", format: "scan", tailleMax: "500 Ko", traduction: true, legalisation: false },
{ nom: "Attestation d'accréditation de la formation (établissements privés)", format: "scan", tailleMax: "500 Ko", traduction: false, legalisation: false },
{ nom: "Certification B2 de français (bac Arabe L-AR uniquement)", format: "scan", tailleMax: "500 Ko", traduction: false, legalisation: false }
],
echeance: null,
apresConnexion: true,
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
consigne: "Vérifiez tout avant de soumettre : après la soumission, une modification n'est possible que par message depuis votre compte, sans garantie. Votre numéro de dossier commence par « SN » et figure dans vos informations personnelles : c'est lui que vous déclarez ici.",
prerequis: ["ef_voeux", "ressources"],
preuve: "numero_dossier",
pieces: [],
echeance: { depuis: "calendrier", cle: "soumission" },
fiabilite: "verifie_source_officielle",
source: SOURCES.FAQ,
verifieLe: VERIFIE
},

{
id: "ef_paiement",
type: "paiement",
titre: "Payer les frais de dossier — 85 000 F, non remboursables",
consigne: "Attendez le courriel de demande de paiement, envoyé après la soumission et le traitement de votre dossier : ne payez JAMAIS avant. Réglez en agence SUNU BANK (ex-BICIS) avec la demande de paiement, une pièce d'identité et votre numéro de dossier. Si le paiement n'est pas validé après 7 jours, présentez le reçu à l'espace Campus France le plus proche ou écrivez depuis votre compte. La demande de paiement ne signifie pas que le dossier est éligible.",
prerequis: ["ef_soumission"],
preuve: "recu",
pieces: [],
montant: 85000,
devise: "XOF",
echeance: { depuis: "calendrier", cle: "paiement" },
fiabilite: "verifie_source_officielle",
source: SOURCES.FAQ,
verifieLe: VERIFIE
},

{
id: "ef_entretien",
type: "entretien",
titre: "Prendre rendez-vous pour l'entretien pédagogique",
consigne: "Dès réception du courriel d'autorisation, prenez rendez-vous sur la plateforme dans les 7 jours. L'entretien a lieu à l'antenne déterminée par l'adresse de votre dossier. Si aucun créneau n'apparaît, Campus France en ouvre régulièrement : consultez le planning souvent.",
prerequis: ["ef_paiement"],
preuve: "convocation",
pieces: [],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.CAL,
verifieLe: VERIFIE
},

{
id: "ef_reponse",
type: "reponse",
titre: "Attendre la réponse des établissements",
consigne: "Les établissements répondent sur la plateforme selon leur propre calendrier. Une réorientation vers un niveau inférieur (master demandé, L3 proposée) n'est pas éligible.",
prerequis: ["ef_entretien"],
preuve: "aucune",
pieces: [],
echeance: null,
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
fiabilite: "verifie_source_officielle",
source: SOURCES.CAL,
verifieLe: VERIFIE
},

{
id: "ef_visa",
type: "visa",
titre: "Demander mon visa étudiant après le courriel de fin de procédure",
consigne: "Dès réception du courriel de fin de procédure, déposez votre demande de visa sur france-visas.gouv.fr (rendez-vous VFS Global à Dakar), et avant la clôture de la campagne visas : n'attendez pas le dernier moment.",
prerequis: ["ef_complement"],
preuve: "aucune",
pieces: [],
echeance: { depuis: "calendrier", cle: "visa" },
fiabilite: "verifie_source_officielle",
source: SOURCES.CAL,
verifieLe: VERIFIE
}

]

};
