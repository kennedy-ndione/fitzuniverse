/**
* ============================================================
* FitzUniverse — couche de résidence : France × Cameroun (lot S2)
* ============================================================
*
* Même forme que js/procedures/residences/france-senegal.js.
*
* ✅ LU DIRECTEMENT À L'ÉCRAN le 2026-09-08, pas à travers un résumé.
* Page « La procédure en 7 étapes », mise à jour le 07 octobre 2025.
* Toutes les phrases ci-dessous viennent de cette page ou de la page
* « Consultez ici calendrier de candidatures ».
*
* CE QUE LE CAMEROUN NE FAIT COMME PERSONNE.
* Trois pays, trois mécaniques de paiement complètement différentes :
*   Sénégal        — 85 000 F en agence SUNU BANK, APRÈS une demande de
*                    paiement ; « ne payez jamais avant ».
*   Côte d'Ivoire  — 80 000 F en agence Société Générale, DÈS la
*                    soumission du dossier.
*   Cameroun       — 85 000 F réglés SUR RENDEZ-VOUS À TLS CONTACT, plus
*                    16 000 F de frais TLS payables en ligne, et
*                    seulement après une autorisation de paiement que
*                    seuls les dossiers jugés conformes reçoivent.
* C'est la démonstration que la ligne de partage tronc / couche est au
* bon endroit : rien de tout cela ne pouvait vivre dans le tronc.
*
* ⚠️ DEUX AJOUTS AU MODÈLE SONT PROPOSÉS ICI (voir aussi la couche
* Côte d'Ivoire) : `absences` et `decomposition`. Ni l'un ni l'autre
* n'est encore compris par composerProcedure().
*
* Aucun DOM, aucun Firestore : testable sous Node.
* ============================================================
*/

const VERIFIE = "2026-09-08";

/** Les pages officielles de l'espace Campus France Cameroun. */
const SOURCES_CM = {
// « Mise à jour le 07 octobre 2025 ».
ETAPES: "https://www.cameroun.campusfrance.org/fr/vous-souhaitez-etudier-en-france-la-procedure-en-7-etapes",
// Calendrier publié pour la rentrée 2026, ouvert depuis le 6 octobre 2025.
CALENDRIER: "https://www.cameroun.campusfrance.org/fr/consultez-ici-calendrier-de-candidatures",
// « Publié le : 04/12/2025 » — confirme la fenêtre de paiement TLS.
DELAIS: "https://www.cameroun.campusfrance.org/fr/les-delais-a-ne-surtout-pas-manquer-pour-vos-candidatures-2025-2026",
OU_NOUS_TROUVER: "https://www.cameroun.campusfrance.org/fr/ou-nous-trouver"
};

export const COUCHE_FRANCE_CAMEROUN = {

id: "france-cameroun",
destination: "France",
pays: "Cameroun",
verifieLe: VERIFIE,

faits: {

// LE MONTANT EST UN TOTAL, ET C'EST DÉLIBÉRÉ.
// Un étudiant camerounais ne peut pas terminer la procédure en payant
// 85 000 F : les 16 000 F de TLS sont obligatoires, pas une option.
// Porter 85 000 dans le budget du diagnostic sous-estimerait sa
// dépense réelle de 16 000 F — et un budget faux d'un seul poste est
// un budget faux. La décomposition dit d'où vient chaque franc, pour
// que le total ne soit jamais un chiffre tombé du ciel.
fraisDossier: {
texte: "Frais de procédure Campus France Cameroun : 85 000 F CFA, à régler sur rendez-vous à TLS Contact, auxquels s'ajoutent 16 000 F CFA de frais TLS payables en ligne — soit 101 000 F CFA au total. Les frais de procédure ne sont pas remboursables. Le justificatif de paiement est à conserver jusqu'à la demande de visa.",
montant: 101000,
devise: "XOF",
decomposition: [
{ libelle: "Frais de procédure Campus France", montant: 85000, devise: "XOF" },
{ libelle: "Frais TLS Contact (payables en ligne)", montant: 16000, devise: "XOF" }
],
source: SOURCES_CM.ETAPES,
verifieLe: VERIFIE
}

// calendrier : VOLONTAIREMENT ABSENT — voir `absences`.
},

absences: {
calendrier: "Le calendrier de la campagne 2027-28 n'est pas encore publié par Campus France Cameroun. Le calendrier en ligne est celui de la rentrée 2026, ouvert le 6 octobre 2025 : ses dates sont passées et ne se reportent pas d'une année sur l'autre. Consultez le calendrier officiel à partir du début du mois d'octobre. Une seule date se répète chaque année et figure telle quelle dans votre parcours : la confirmation du choix définitif, au plus tard le 31 mai."
},

// LES POINTS DE VIGILANCE (lot DIAGNOSTIC-2, 2026-09-09).
// Aucun fait neuf : ces phrases sont la partie des consignes ci-dessous
// qui coûte cher quand on ne la lit pas, remontée en tête du Diagnostic
// France. Même source, même date que la consigne dont elles sortent.
pointsDeVigilance: [
{
texte: "Aucun rendez-vous de paiement tant que votre panier ne contient pas au moins deux formations connectées, et que votre parcours et vos diplômes ne sont pas renseignés.",
source: "https://www.cameroun.campusfrance.org/fr/vous-souhaitez-etudier-en-france-la-procedure-en-7-etapes",
verifieLe: VERIFIE
}
],

etapes: {

// AJOUT — deux exigences linguistiques propres au Cameroun, et elles
// ne concernent pas les mêmes candidats. Le TCF-DAP vise le GCE
// A-level en première année ; la traduction ministérielle vise TOUT
// candidat qui a étudié en anglais, quel que soit son niveau. La
// seconde CONTREDIT en apparence le tronc, qui parle de traducteur
// assermenté : au Cameroun l'autorité compétente est nommée, et c'est
// elle qui prime pour un dossier déposé depuis ce pays.
ef_pieces: {
consigneSup: "Si vous avez suivi un cursus en anglais, quel que soit votre niveau de candidature, faites traduire vos justificatifs académiques au Ministère de l'Enseignement Supérieur à Yaoundé ou au Centre linguistique de BONANJO à Douala. Et si vous candidatez en 1re année d'université avec un GCE A-level, obtenu ou à venir, vous devez impérativement passer le TCF-DAP sans expression orale, organisé par l'Institut français du Cameroun à Yaoundé et à Douala : anticipez-le, il conditionne votre candidature.",
source: SOURCES_CM.ETAPES,
verifieLe: VERIFIE
},

// REMPLACEMENT — la mécanique entière est locale : autorisation
// préalable, rendez-vous, guichet TLS, deux montants, et deux
// conditions à remplir AVANT de pouvoir seulement demander le
// rendez-vous. Un étudiant qui ignore la seconde attendra une
// autorisation qui ne viendra pas.
ef_paiement: {
titre: "Payer les frais de procédure — 85 000 F à TLS, plus 16 000 F de frais TLS",
consigne: "Campus France vérifie d'abord votre dossier : seuls les dossiers jugés conformes reçoivent une autorisation de paiement, envoyée uniquement par la messagerie de votre compte Études en France. Pour l'obtenir, votre parcours et vos diplômes doivent être renseignés et votre panier doit contenir au moins deux formations connectées ; adressez ensuite une demande via la messagerie du dossier, objet « RDV paiement frais de procédure ». L'autorisation contient le lien de prise de rendez-vous et la liste des documents originaux à apporter. TLS Contact ne peut recevoir aucun candidat sans cette autorisation. Réglez 85 000 F CFA sur rendez-vous à TLS, plus 16 000 F CFA de frais TLS payables en ligne. Vos originaux sont retenus par TLS, transmis à Campus France pour vérification, puis rendus à TLS qui vous notifiera pour le retrait. Conservez le justificatif de paiement jusqu'à la demande de visa : les frais ne sont pas remboursables.",
montant: 101000,
devise: "XOF",
source: SOURCES_CM.ETAPES,
verifieLe: VERIFIE
},

// AJOUT — la seule date de la campagne qui se répète d'une année sur
// l'autre et que la source écrit sans millésime.
ef_confirmation: {
consigneSup: "En cas d'acceptation, la confirmation du choix définitif est obligatoire au plus tard le 31 mai.",
source: SOURCES_CM.ETAPES,
verifieLe: VERIFIE
},

// REMPLACEMENT — trois agences, un seul rendez-vous, aucun
// intermédiaire. La phrase sur les intermédiaires est de la source :
// elle vise des rabatteurs qui monnaient de faux rendez-vous, et la
// retirer priverait l'étudiant d'un avertissement qu'on lui doit.
ef_visa: {
consigne: "Le dépôt du dossier de visa se fait à TLS Contact, après un rendez-vous octroyé exclusivement par Campus France : aucun intermédiaire ne peut le faciliter, et vous n'avez droit qu'à un seul rendez-vous. Le message de rendez-vous indiquera l'adresse de l'agence TLS (Yaoundé, Douala ou Garoua). Ne demandez ce rendez-vous que si votre dossier est complet — la liste des pièces est sur France-Visas et sur le site du consulat de l'ambassade de France au Cameroun. Si vous avez moins de 18 ans au 31 décembre de l'année en cours, une procédure de visa particulière s'applique.",
source: SOURCES_CM.ETAPES,
verifieLe: VERIFIE
}

// ef_saisie : rien. Aucune exigence de titre de séjour pour un
//   étranger résidant au Cameroun n'a été lue sur une page officielle.
// ef_entretien : rien de local. La page dit seulement que seuls les
//   dossiers complets ET soumis sont programmés pour l'entretien —
//   c'est déjà la règle du tronc. Les antennes existent à Yaoundé et
//   Douala (accompagnement en ligne pour les candidats hors de ces
//   deux villes), mais la page « Où nous trouver » ne donne pas les
//   adresses : on ne les écrit donc pas.
}

};
