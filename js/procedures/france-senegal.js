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
*   AGREG      demarchesetrangers.fr/blog/etudes-en-france-campus-france
*              — un AGRÉGATEUR : « 73 pays », « 7 vœux par niveau »,
*              « entretien 20-30 min ». Marqué "a_confirmer" quand aucune
*              page Campus France ne le confirme.
*
* RÈGLES DURES (test/procedures.test.mjs)
*   - une étape sans `source` ET `verifieLe` n'existe pas ;
*   - tout ce qui se passe APRÈS la connexion à la plateforme (écrans,
*     pièges, formats exacts, tailles) est "a_confirmer", avec la
*     consigne « à confirmer lors de la première passe réelle » — même
*     quand une page publique le décrit : c'est la passe réelle (le
*     porteur du projet, ou le premier étudiant) qui tranchera, et les
*     codes changeront alors un par un. `apresConnexion: true` le marque ;
*   - aucune étape n'invente une pièce, un format ou une taille : si la
*     page ne le dit pas, le champ est absent ;
*   - le calendrier vient de js/pays-preinscription.js (CAMPAGNE_FRANCE.
*     jalons), jamais recopié : `echeance.cle` désigne un jalon.
*
* L'étape de type "soumission" est celle qui alimente preuveDepot (lot
* E1) : la cocher AVEC son numéro de dossier remplit la preuve de dépôt.
* ============================================================
*/

const VERIFIE = "2026-09-07";

const SOURCES = {
FAQ: "https://www.senegal.campusfrance.org/les-questions-frequemment-posees",
CAL: "https://www.senegal.campusfrance.org/calendrier-de-la-procedure-2026",
PROC: "https://www.senegal.campusfrance.org/la-procedure-etudes-en-france",
DOSSIER: "https://www.senegal.campusfrance.org/je-constitue-mon-dossier-sur-etudes-en-france",
CANDID: "https://www.senegal.campusfrance.org/candidater-a-une-formation",
PRECONS: "https://www.senegal.campusfrance.org/la-phase-pre-consulaire",
AGREG: "https://demarchesetrangers.fr/blog/etudes-en-france-campus-france"
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
consigne: "Renseignez identité, coordonnées (adresse et deux numéros de téléphone), CV et statut particulier. L'adresse indiquée détermine l'antenne où se tiendra votre entretien : donnez une adresse proche de l'antenne souhaitée, pas votre lieu de naissance.",
prerequis: ["ef_compte", "profile"],
preuve: "aucune",
pieces: [
{ nom: "Photo d'identité", format: "scan", tailleMax: "50 Ko", traduction: false, legalisation: false },
{ nom: "Pièce d'identité (CNI ou passeport ; pour un étranger, titre de séjour et justificatifs d'activité au Sénégal depuis un an)", format: "scan", tailleMax: "500 Ko", traduction: false, legalisation: false },
{ nom: "Curriculum vitae", format: "scan", tailleMax: "500 Ko", traduction: false, legalisation: false }
],
echeance: null,
apresConnexion: true,
fiabilite: "a_confirmer",
source: SOURCES.DOSSIER,
verifieLe: VERIFIE
},

{
id: "ef_pieces",
type: "pieces",
titre: "Renseigner mon parcours et joindre mes diplômes",
consigne: "Détaillez chaque année d'études avec ses justificatifs : relevés de notes des trois dernières années, tous les diplômes obtenus (bac et son relevé, licence, master, BTS, DUT…), l'attestation d'accréditation ANAQ-Sup pour une formation privée, la certification B2 pour un bac Arabe L-AR. Tout document doit être en français ou traduit par un traducteur assermenté, l'original joint.",
prerequis: ["ef_saisie", "checklist", "traductions"],
preuve: "aucune",
pieces: [
{ nom: "Relevés de notes des 3 dernières années", format: "scan", tailleMax: "500 Ko", traduction: true, legalisation: false },
{ nom: "Diplômes obtenus (bac + relevé, licence, master, BTS, DUT…)", format: "scan", tailleMax: "500 Ko", traduction: true, legalisation: false },
{ nom: "Attestation d'accréditation ANAQ-Sup (formations privées)", format: "scan", tailleMax: "500 Ko", traduction: false, legalisation: false },
{ nom: "Certification B2 de français (bac Arabe L-AR uniquement)", format: "scan", tailleMax: "500 Ko", traduction: false, legalisation: false }
],
echeance: null,
apresConnexion: true,
fiabilite: "a_confirmer",
source: SOURCES.FAQ,
verifieLe: VERIFIE
},

{
id: "ef_voeux",
type: "voeux",
titre: "Formuler mes vœux de formation et mes motivations",
consigne: "Choisissez vos formations parmi les établissements connectés et rédigez une motivation claire et personnalisée pour chacune. Le plafond de 7 vœux par niveau vient d'un agrégateur, aucune page Campus France Sénégal ne le confirme.",
prerequis: ["ef_pieces"],
preuve: "aucune",
pieces: [],
echeance: null,
apresConnexion: true,
fiabilite: "a_confirmer",
source: SOURCES.AGREG,
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
