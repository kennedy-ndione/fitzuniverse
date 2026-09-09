/**
* ============================================================
* FitzUniverse — couche de résidence : France × Maroc (lot S2)
* ============================================================
*
* Même forme que js/procedures/residences/france-senegal.js.
*
* ✅ LU DIRECTEMENT À L'ÉCRAN le 2026-09-08. Deux pages officielles :
* « Les frais de dossier Campus France » et « La procédure de
* candidature "Je suis candidat" sur Études en France ».
*
* LE MAROC EST LE PAYS LE PLUS DIFFÉRENT DES QUATRE.
*
* 1. C'EST LE SEUL DONT LA CAMPAGNE QUI VIENT EST DÉJÀ PUBLIÉE, et elle
*    est courte : du 1er octobre au 15 NOVEMBRE 2026, 23h59 heure
*    marocaine. Six semaines. Un mois plus tôt que la clôture
*    sénégalaise du 15 décembre. Un étudiant marocain qui suit le
*    calendrier d'un autre pays a perdu sa campagne.
*
* 2. C'EST LE SEUL QUI NE PAIE PAS EN FRANCS CFA : 1 900 DIRHAMS, en
*    ligne par carte bancaire. Le dirham n'a pas de parité fixe avec
*    l'euro, contrairement au franc CFA. Le diagnostic ne sait pas
*    convertir cette somme — voir la note en fin de fichier.
*
* 3. C'EST LE SEUL OÙ L'ON SOUMET AVANT DE PAYER. Sénégal : payer après
*    une demande de paiement. Côte d'Ivoire : payer dès la soumission.
*    Cameroun : payer sur rendez-vous à TLS après autorisation. Maroc :
*    soumettre, puis payer en ligne.
*
* 4. C'EST LE SEUL QUI EXIGE UNE CERTIFICATION DE FRANÇAIS DE TOUS,
*    sauf cas de dispense — et non des seuls candidats d'une filière
*    particulière, comme le bac Arabe L-AR sénégalais ou le GCE A-level
*    camerounais.
*
* Aucun DOM, aucun Firestore : testable sous Node.
* ============================================================
*/

const VERIFIE = "2026-09-08";

/** Les pages officielles de l'espace Campus France Maroc. */
const SOURCES_MA = {
FRAIS: "https://www.maroc.campusfrance.org/les-frais-de-dossier-campus-france",
CANDIDATURE: "https://www.maroc.campusfrance.org/la-procedure-de-candidature-sur-etudes-en-france-de-campus-france",
PROCEDURES: "https://www.maroc.campusfrance.org/les-procedures-de-campus-france-maroc"
};

export const COUCHE_FRANCE_MAROC = {

id: "france-maroc",
destination: "France",
pays: "Maroc",
verifieLe: VERIFIE,

faits: {

fraisDossier: {
texte: "Frais de dossier Campus France Maroc : 1 900 dirhams, payables EN LIGNE par carte bancaire. Ils ne sont en aucun cas remboursables, même en cas de désistement, de non-admission ou de refus de visa. Un seul paiement par compte et par période : si vous avez plusieurs dossiers « Je suis candidat » et « Je suis accepté », vous ne payez qu'une fois par campagne. Comptez environ 5 jours ouvrés pour la quittance électronique — n'attendez pas de la recevoir pour soumettre votre dossier.",
montant: 1900,
devise: "MAD",
source: SOURCES_MA.FRAIS,
verifieLe: VERIFIE
},

// LE SEUL CALENDRIER DE LA CAMPAGNE QUI VIENT QUI SOIT DÉJÀ PUBLIÉ,
// au 8 septembre 2026. Il n'a pas été déduit d'une campagne passée :
// la page porte les dates 2026 en toutes lettres.
calendrier: {
jalons: {
soumission: { mois: 11, jour: 15, libelle: "Clôture de la candidature — 23h59, heure marocaine" }
},
source: SOURCES_MA.CANDIDATURE,
verifieLe: VERIFIE
}
},

absences: {
// Le calendrier existe, mais il est partiel : la page publie la
// fenêtre de candidature, pas les dates d'entretien, de réponse ni
// de choix définitif. Dire « calendrier documenté » sans le préciser
// laisserait croire à l'étudiant qu'il connaît toutes ses échéances.
jalonsAval: "La fenêtre de candidature est publiée (1er octobre → 15 novembre 2026), mais Campus France Maroc n'a pas encore publié les dates d'entretien, de réponse des établissements ni de choix définitif pour cette campagne. Surveillez votre compte Études en France : les convocations y arrivent par la messagerie intégrée."
},

// Campus France Maroc publie sur ses propres pages un avertissement
// explicite contre les intermédiaires privés. Le lui cacher serait
// exactement le comportement qu'il dénonce ; le lui montrer est la
// preuve que nous ne sommes pas ce qu'il décrit. FitzUniverse organise,
// informe et prépare — il ne rédige aucun dossier, ne se réclame
// d'aucun partenariat et ne promet ni admission ni visa.
avertissement: "Campus France Maroc rappelle qu'il est le seul interlocuteur officiel de la procédure et qu'aucun organisme privé n'est accrédité pour la mener à votre place. Aucun intermédiaire ne peut garantir une admission ou un visa. FitzUniverse vous aide à comprendre, organiser et préparer votre dossier : vous le remplissez et le soumettez vous-même, sur votre compte Études en France.",

// LES POINTS DE VIGILANCE (lot DIAGNOSTIC-2, 2026-09-09).
// Aucun fait neuf : ces phrases sont la partie des consignes ci-dessous
// qui coûte cher quand on ne la lit pas, remontée en tête du Diagnostic
// France. Même source, même date que la consigne dont elles sortent.
pointsDeVigilance: [
{
texte: "La fenêtre de candidature est courte : du 1er octobre au 15 novembre 2026. Elle ferme un mois avant celle de plusieurs pays voisins — ne vous fiez pas au calendrier d'un voisin.",
source: "https://www.maroc.campusfrance.org/la-procedure-de-candidature-sur-etudes-en-france-de-campus-france",
verifieLe: VERIFIE
}
],

etapes: {

// REMPLACEMENT — l'ordre lui-même change : au Maroc on SOUMET, puis on
// paie. Le nom de l'étape le dit, sans quoi un étudiant attendra une
// autorisation de paiement qui n'existe pas dans ce pays.
ef_paiement: {
titre: "Payer les frais de dossier — 1 900 Dhs, en ligne, après soumission",
consigne: "Au Maroc, on soumet d'abord son dossier, puis on paie : il n'y a pas d'autorisation de paiement à attendre. Réglez 1 900 dirhams en ligne par carte bancaire. Votre dossier ne sera traité que si les frais sont payés ET le dossier soumis, et les dossiers sont traités par ordre de soumission et de paiement — soumettre et payer tôt vous fait traiter tôt. Inutile d'envoyer le reçu : la quittance électronique arrive sur votre dossier sous environ 5 jours ouvrés. Vérifiez que vous êtes bien concerné par la procédure avant de payer : en cas d'erreur, il n'y a aucun remboursement.",
montant: 1900,
devise: "MAD",
source: SOURCES_MA.FRAIS,
verifieLe: VERIFIE
},

// AJOUT — au Maroc, la certification de français se prépare AVANT de
// s'inscrire, et l'inscription au test suffit pour candidater : la
// convocation ou le reçu de paiement sont acceptés. C'est une nuance
// qui débloque des candidats persuadés de devoir attendre leur
// résultat.
ef_pieces: {
consigneSup: "Avant de vous inscrire, prenez date pour une certification de français — TCF TP, DELF B2 ou DALF — sauf si vous relevez d'un cas de dispense. Vous n'avez pas besoin d'attendre votre résultat pour candidater : la convocation ou le reçu de paiement du test sont acceptés dans la procédure.",
source: SOURCES_MA.CANDIDATURE,
verifieLe: VERIFIE
},

// AJOUT — qui peut passer par cette procédure, et qui n'en relève pas.
// La plateforme « Mon Master » attire beaucoup de candidats marocains
// à tort : le dire évite une campagne perdue sur la mauvaise porte.
ef_compte: {
consigneSup: "Cette procédure s'adresse aux étudiants non européens résidant au Maroc, issus de l'enseignement marocain — bac international compris — ou de l'enseignement étranger. La plateforme « Mon Master » ne concerne pas les étudiants marocains : elle s'adresse aux candidats résidant dans des pays sans procédure Études en France et aux ressortissants de l'Union européenne, de l'EEE, d'Andorre, de Suisse ou de Monaco.",
source: SOURCES_MA.CANDIDATURE,
verifieLe: VERIFIE
},

// AJOUT — la fenêtre est courte et c'est LE fait marocain à ne pas
// manquer. Il est répété ici, dans l'étape de soumission, parce qu'un
// jalon de calendrier se lit dans un tableau et qu'une consigne se lit
// dans le parcours.
ef_soumission: {
consigneSup: "La fenêtre de candidature marocaine est courte : du 1er octobre au 15 novembre 2026, 23h59 heure marocaine. Elle ferme un mois avant celle de plusieurs autres pays — ne vous fiez pas au calendrier d'un voisin. Soumettez le plus tôt possible : les dossiers sont traités par ordre de soumission et de paiement.",
source: SOURCES_MA.CANDIDATURE,
verifieLe: VERIFIE
}

// ef_saisie, ef_entretien, ef_visa : rien de local n'a été lu à la
//   source. Les « cas de dispense » de certification, les pièces
//   détaillées par étape et le centre de dépôt des visas vivent sur
//   des pages que je n'ai pas ouvertes : ils restent à lire.
}

};

/*
* ⚠️ CE QUE CE FICHIER CASSE, ET QU'IL FAUT TRANCHER AVANT DE LE POSER.
*
* Le dirham n'a PAS de parité fixe avec l'euro — le franc CFA en a une
* (655,957), et tout le calcul du Diagnostic France repose dessus
* (PARITE_EUR_XOF dans js/diagnostic-france.js). js/frais.js ne connaît
* de seuils que pour l'EUR. Un montant en MAD n'a donc aujourd'hui aucun
* chemin de conversion : le diagnostic l'ignorera ou l'additionnera à
* tort.
*
* Deux réponses possibles, et c'est un arbitrage produit, pas technique :
*   a) N'additionner que ce qui a une parité fixe. Le total du diagnostic
*      reste en euros, les 1 900 Dhs s'affichent à part, en dirhams, avec
*      la mention qu'ils s'ajoutent au total. Rien de faux n'est écrit.
*   b) Convertir avec un taux daté, affiché comme tel (« taux indicatif
*      au JJ/MM/AAAA »). Plus confortable à lire, mais c'est un chiffre
*      qui vieillit tout seul — exactement ce que le dépôt refuse
*      ailleurs pour les échéances.
*
* Recommandation : (a). Un budget qui dit « plus 1 900 Dhs » est moins
* élégant qu'un total unique, et plus honnête qu'un total dont un poste
* dérive silencieusement avec le marché des changes.
*/
