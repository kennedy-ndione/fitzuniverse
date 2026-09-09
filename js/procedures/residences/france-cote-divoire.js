/**
* ============================================================
* FitzUniverse — couche de résidence : France × Côte d'Ivoire (lot S2)
* ============================================================
*
* ✅ RELU DIRECTEMENT À L'ÉCRAN le 2026-09-08. Cette version REMPLACE
* une première rédaction faite à partir d'un résumé automatique, qui
* était FAUSSE sur le point le plus important du fichier.
*
* ⛔ CE QUE LA PREMIÈRE VERSION DISAIT DE FAUX.
* Elle affirmait que les frais sont « payables dès la soumission du
* dossier », en s'appuyant sur la page campagne (« payables dès que vous
* soumettez votre dossier »). La page de procédure, lue à l'écran, dit
* autre chose en pratique, à l'étape 5 : « À LA RÉCEPTION DE
* L'AUTORISATION DE PAIEMENT sur mon compte en ligne, je paie les frais
* de dossier […] sur présentation du message de paiement. »
* La Côte d'Ivoire fonctionne donc comme le Sénégal : on attend
* l'autorisation. Un étudiant envoyé à la banque trop tôt en revient
* sans avoir pu payer.
*
* La leçon vaut d'être écrite ici : les CITATIONS d'un résumé
* automatique étaient exactes, son CADRAGE ne l'était pas. C'est la
* deuxième fois en une journée. Un résumé peut servir à trouver une
* page ; il ne peut pas servir à écrire une consigne.
*
* Aucun DOM, aucun Firestore : testable sous Node.
* ============================================================
*/

const VERIFIE = "2026-09-08";

/** Les pages officielles de l'espace Campus France Côte d'Ivoire. */
const SOURCES_CI = {
// Licence 2/3, Master, cycle ingénieur — la page de procédure détaillée.
LMI: "https://www.ivoire.campusfrance.org/je-veux-m-inscrire-en-licence-23-master-12-cycle-ingenieur",
// « Mis à jour le : 03/10/2025 » — campagne 2025-2026.
CAMPAGNE: "https://www.ivoire.campusfrance.org/campagne-campus-france-2025-2026",
// Licence 1 / DAP.
DAP: "https://www.ivoire.campusfrance.org/je-veux-m-inscrire-en-licence-1-a-l-universite"
};

export const COUCHE_FRANCE_COTE_DIVOIRE = {

id: "france-cote-divoire",
destination: "France",
pays: "Côte d'Ivoire",
verifieLe: VERIFIE,

faits: {

// 80 000 F, et ce n'est pas un simple droit de dossier : la formule
// « Campus Classique » inclut un atelier d'aide à la procédure et un
// entretien d'orientation individuel, tous deux facultatifs. Le dire
// évite qu'un étudiant paie ailleurs ce qu'il a déjà payé là.
fraisDossier: {
texte: "Frais de dossier Campus France Côte d'Ivoire : 80 000 F CFA, formule « Campus Classique », non remboursables. Elle comprend les frais de procédure Études en France, plus — facultatifs — un atelier d'aide à la procédure et un entretien d'orientation individuel. Le paiement se fait dans une agence Société Générale de Côte d'Ivoire, sur présentation du message d'autorisation de paiement. Ces frais sont valables pour UNE ANNÉE ACADÉMIQUE : si vous n'obtenez aucune acceptation à l'université et revenez ensuite avec une admission dans un établissement privé, vous ne repayez pas. Campus France y propose aussi « Campus Pro » à 110 000 F CFA, avec l'Institut français de Côte d'Ivoire : trois ateliers de deux heures — rédaction d'un CV, rédaction d'une lettre de motivation, préparation d'un entretien. Cette formule est facultative et, la source le dit elle-même, elle ne garantit pas la réussite de la procédure.",
montant: 80000,
devise: "XOF",
source: SOURCES_CI.LMI,
verifieLe: VERIFIE
}

// calendrier : VOLONTAIREMENT ABSENT — voir `absences`.
},

absences: {
calendrier: "Campus France Côte d'Ivoire n'a pas publié le calendrier de la campagne à venir : les dates encore en ligne sur les pages de procédure appartiennent à des campagnes passées et se contredisent entre elles (2023, 2024, 2025). Aucune date n'est donc affichée ici. Les campagnes précédentes se sont ouvertes le 1er octobre ; consultez la page officielle dès l'ouverture."
},

// LES POINTS DE VIGILANCE (lot DIAGNOSTIC-2, 2026-09-09).
// Aucun fait neuf : ces phrases sont la partie des consignes ci-dessous
// qui coûte cher quand on ne la lit pas, remontée en tête du Diagnostic
// France. Même source, même date que la consigne dont elles sortent.
pointsDeVigilance: [
{
texte: "Après deux corrections non suivies de modifications, votre dossier n'est plus recevable — et les frais versés restent dus.",
source: "https://www.ivoire.campusfrance.org/je-veux-m-inscrire-en-licence-23-master-12-cycle-ingenieur",
verifieLe: VERIFIE
},
{
texte: "Avant de déposer votre visa, imprimez depuis votre compte la quittance de paiement : elle fait passer les frais de 65 000 à 35 000 F CFA.",
source: "https://www.ivoire.campusfrance.org/je-veux-m-inscrire-en-licence-23-master-12-cycle-ingenieur",
verifieLe: VERIFIE
}
],

etapes: {

// REMPLACEMENT — l'ordre réel, celui de l'étape 5 de la page de
// procédure. Et le paiement par un tiers, qui n'existe nulle part
// ailleurs dans les sept pays : il faut trois mentions exactes sur le
// bordereau, faute de quoi le paiement ne sera pas rattaché au dossier.
ef_paiement: {
titre: "Payer les frais de dossier — 80 000 F, après l'autorisation de paiement",
consigne: "N'allez pas à la banque avant d'avoir reçu, sur votre compte en ligne, le message d'autorisation de paiement : c'est lui qu'on vous demandera au guichet. Réglez ensuite 80 000 F CFA dans n'importe quelle agence Société Générale de Côte d'Ivoire, sur présentation de ce message. Une tierce personne peut payer à votre place, à condition que le bordereau porte exactement le numéro de compte de l'agent comptable de l'IFCI, VOTRE nom et VOTRE identifiant Campus France — sans ces trois mentions, le paiement ne sera pas rattaché à votre dossier. Ces frais couvrent toute l'année académique, y compris si vous revenez plus tard avec une acceptation d'un établissement privé.",
montant: 80000,
devise: "XOF",
source: SOURCES_CI.LMI,
verifieLe: VERIFIE
},

// AJOUT — LA RÈGLE ÉLIMINATOIRE IVOIRIENNE. Après le paiement,
// Campus France corrige le dossier en ligne. Deux corrections restées
// sans effet, et le dossier n'est pas validé : plus d'entretien, donc
// plus de candidature — alors que les frais, eux, sont payés.
ef_complement: {
titre: "Répondre aux corrections — deux passages, pas trois",
consigne: "Après le paiement, Campus France corrige votre dossier en ligne et vous le renvoie annoté s'il est incomplet. Les remarques portent le plus souvent sur les informations personnelles (pièce d'identité illisible ou non valable, absence de contact téléphonique), sur le cursus (années ou expériences omises, scans illisibles, justificatifs manquants) ou sur le panier de formations (choix incohérents, inadaptés ou trop sélectifs). Suivez ces consignes à la lettre et resoumettez : APRÈS DEUX CORRECTIONS NON SUIVIES DE MODIFICATIONS, votre dossier ne sera pas validé et vous ne pourrez pas prendre rendez-vous pour l'entretien — les frais versés restant dus.",
source: SOURCES_CI.LMI,
verifieLe: VERIFIE
},

// AJOUT — la lettre de motivation ivoirienne a une longueur annoncée,
// et elle est courte. Le conseil de la source sur ce qu'il ne faut PAS
// écrire vaut d'être transmis tel quel.
ef_voeux: {
consigneSup: "Sélectionnez 7 universités. Vous pouvez postuler à deux niveaux différents — une Licence 3 et un Master 1, par exemple — mais Campus France Côte d'Ivoire recommande de viser le même niveau pour optimiser vos chances, les résultats de l'année en cours n'étant pas toujours connus avant la rentrée. Rédigez pour chaque spécialité une lettre de motivation courte, de quatre à cinq lignes, sans faute d'orthographe et adaptée à la formation : votre parcours local en bref, votre intérêt précis pour ce programme et cette université, et le lien avec votre objectif professionnel. Évitez le déluge de louanges sur la France et son enseignement — la source le dit, c'est inutile. Si vous visez un IAE, le Score IAE Message peut être exigé : il se passe au CPDEC/INPHB, à l'université FHB.",
source: SOURCES_CI.LMI,
verifieLe: VERIFIE
},

// REMPLACEMENT — la phrase qui compte est celle sur les photocopies :
// une légalisation, en Côte d'Ivoire, ne remplace pas l'original.
ef_entretien: {
consigne: "Une fois les frais payés et le dossier validé, prenez rendez-vous sur la plateforme pour votre entretien pédagogique. Venez muni de votre convocation, d'une pièce d'identité et des ORIGINAUX de vos documents pédagogiques : les photocopies légalisées et les scans ne sont pas acceptés. L'entretien sert à authentifier vos documents et à parler de vos motivations, de votre projet d'études et de votre projet professionnel — ce n'est pas un examen. Le conseiller cherche à comprendre votre cursus et à recueillir ce que le dossier ne montre pas, pour rendre un avis consultatif. Préparez-le sérieusement : il compte.",
source: SOURCES_CI.LMI,
verifieLe: VERIFIE
},

// REMPLACEMENT — et LE conseil le plus rentable des sept pays :
// imprimer une quittance fait passer les frais de visa de 65 000 à
// 35 000 F CFA. Trente mille francs pour un document déjà disponible
// dans le compte de l'étudiant.
ef_visa: {
consigne: "Dès la validation de votre choix définitif, la procédure consulaire se fait auprès de VFS Global, prestataire du Consulat général de France. AVANT de déposer, imprimez depuis votre compte deux documents : « la quittance de paiement », qui vous fait payer 35 000 F CFA de frais de visa au lieu de 65 000, et « l'attestation d'acceptation », disponible dans la rubrique « Je finalise ma procédure ». Joignez-les à votre demande. La procédure se suit sur france-visas.gouv.fr ; VFS répond au 225 25 20 00 48 70 et à info.frci@vfshelpline.com.",
source: SOURCES_CI.LMI,
verifieLe: VERIFIE
}

// ef_saisie : rien. Aucune règle de séjour pour un étranger résidant
//   en Côte d'Ivoire n'a été lue à la source.
// ef_compte, ef_pieces : rien de local. La page renvoie aux tutoriels
//   génériques de la plateforme, que le tronc couvre déjà.
}

};
