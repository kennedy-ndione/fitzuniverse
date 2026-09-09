/**
* ============================================================
* FitzUniverse — couche de résidence : France × Togo (lot S2)
* ============================================================
*
* Même forme que js/procedures/residences/france-senegal.js.
*
* ✅ LU DIRECTEMENT À L'ÉCRAN le 2026-09-08, sur trois pages officielles.
* L'espace Campus France Togo est le PLUS FRAIS des six lus : sa page
* de sessions d'information a été mise à jour la veille, le 7 septembre
* 2026, et annonce déjà la campagne rentrée 2027-2028.
*
* CE QUE LE TOGO DIT DE PLUS DUR QUE LES AUTRES.
* Sa page « Appel à la vigilance » nomme les intermédiaires qu'il refuse :
* « agence, cybercafé, officine, cabinet de coaching ». La ligne qu'il
* trace n'est pas entre gratuit et payant, elle est entre CONSEILLER et
* FAIRE À LA PLACE DE — il vise ceux « qui se font rémunérer à des tarifs
* exorbitants pour ÉLABORER votre dossier ». C'est exactement la doctrine
* FitzUniverse : suggérer, jamais écrire. L'avertissement est donc relayé
* tel quel, et notre position dite juste après.
*
* Aucun DOM, aucun Firestore : testable sous Node.
* ============================================================
*/

const VERIFIE = "2026-09-08";

/** Les pages officielles de l'espace Campus France Togo. */
const SOURCES_TG = {
// « Publié le 12/03/2025, mis à jour le 14/03/2025 » — le montant et la banque.
VIGILANCE: "https://www.togo.campusfrance.org/appel-a-la-vigilance",
// Numéro TG, absence d'attestation de compte.
INSCRIPTIONS: "https://www.togo.campusfrance.org/les-procedures-et-inscriptions",
// Les 8 étapes, mises à jour le 27/01/2025.
ETAPES: "https://www.togo.campusfrance.org/les-8-etapes-de-la-procedure-etudes-en-france",
// Mise à jour le 07/09/2026 : la campagne 2027-2028 s'annonce ici.
SESSIONS: "https://www.togo.campusfrance.org/sessions-d-informations-procedure-etudes-en-france-rentree-2027-2028"
};

export const COUCHE_FRANCE_TOGO = {

id: "france-togo",
destination: "France",
pays: "Togo",
verifieLe: VERIFIE,

faits: {

// 70 000 F, comme au Bénin — et chez Orabank, comme les étudiants de
// Parakou. Deux pays voisins, deux montants identiques, une banque
// commune : c'est une coïncidence utile à connaître, pas une règle à
// généraliser. Chaque pays garde sa source.
fraisDossier: {
texte: "Frais de dossier Campus France Togo : 70 000 F CFA, réglés dans les agences ORABANK APRÈS la soumission de votre dossier de candidature sur la plateforme Études en France. Ce sont les seuls frais de procédure : aucun autre montant n'est dû à Campus France Togo ni à qui que ce soit d'autre en son nom.",
montant: 70000,
devise: "XOF",
source: SOURCES_TG.VIGILANCE,
verifieLe: VERIFIE
}

// calendrier : VOLONTAIREMENT ABSENT — voir `absences`.
},

absences: {
calendrier: "Campus France Togo n'a pas encore publié les dates limites de la campagne rentrée 2027-2028, mais il la prépare activement : sa page de sessions d'information a été mise à jour le 7 septembre 2026. Les sessions d'information sur la procédure ont lieu en octobre et novembre, celles de préparation au départ en mai et juin, à Lomé et à Kara — elles sont gratuites. Surveillez cette page : le calendrier y paraîtra."
},

// Relayé mot pour mot dans son intention, puis notre position. Le
// cacher à un utilisateur togolais serait exactement le comportement
// que Campus France dénonce ; le montrer prouve que nous ne sommes pas
// ce qu'il décrit.
avertissement: "Campus France Togo rappelle qu'il est le seul interlocuteur officiel de la préinscription et qu'il ne reconnaît aucun intermédiaire — agence, cybercafé, officine, cabinet de coaching — se faisant rémunérer pour ÉLABORER votre dossier de candidature ou consulaire. FitzUniverse ne remplit ni ne soumet aucun dossier à votre place : votre compte Études en France reste le vôtre, et vous seul y écrivez. Nous vous aidons à comprendre la procédure, à réunir vos pièces à temps et à ne pas manquer une échéance. Les sessions d'information de Campus France Togo sont gratuites, à Lomé et à Kara : allez-y, elles sont utiles.",

// LES POINTS DE VIGILANCE (lot DIAGNOSTIC-2, 2026-09-09).
// Aucun fait neuf : ces phrases sont la partie des consignes ci-dessous
// qui coûte cher quand on ne la lit pas, remontée en tête du Diagnostic
// France. Même source, même date que la consigne dont elles sortent.
pointsDeVigilance: [
{
texte: "Il n'existe aucune attestation de création de compte : si le CROUS en réclame une, fournissez une capture d'écran de votre compte ou votre convocation à l'entretien.",
source: "https://www.togo.campusfrance.org/les-procedures-et-inscriptions",
verifieLe: VERIFIE
}
],

etapes: {

// AJOUT — trois détails togolais dont un que personne n'anticipe :
// l'attestation de création de compte n'existe pas, alors que des
// organismes français la réclament.
ef_compte: {
consigneSup: "Notez votre numéro d'identifiant togolais, de la forme TGXX-XXXXX : il vous sera demandé par votre Espace Campus France Togo pour le paiement des frais et dans toutes vos correspondances. Attention, il n'existe AUCUNE attestation de création de compte : si un organisme vous en réclame une — le CROUS, par exemple — fournissez une capture d'écran de votre compte ou votre convocation à l'entretien. Enfin, Campus France Togo organise des sessions d'information gratuites sur la procédure, à Lomé et à Kara, en octobre et novembre : elles répondent à la plupart des questions que vous vous posez maintenant.",
source: SOURCES_TG.INSCRIPTIONS,
verifieLe: VERIFIE
},

// REMPLACEMENT — montant, banque, et l'ordre togolais : on soumet
// d'abord, on paie ensuite. La phrase « ce sont les seuls frais » est
// de la source et vaut d'être répétée : c'est elle qui protège
// l'étudiant d'un faux guichet.
ef_paiement: {
titre: "Payer les frais de dossier — 70 000 F chez Orabank, après soumission",
consigne: "Soumettez d'abord votre dossier sur la plateforme Études en France, puis réglez 70 000 F CFA dans une agence ORABANK. Ce sont les SEULS frais de procédure : si quelqu'un vous réclame autre chose au nom de Campus France, c'est une fraude. En cas de doute, écrivez à espace.campusfrance@institutfrancais-togo.com, appelez le (+228) 22 53 58 29 ou passez par la boîte WhatsApp officielle (+228) 96 13 18 44 avant de payer.",
montant: 70000,
devise: "XOF",
source: SOURCES_TG.VIGILANCE,
verifieLe: VERIFIE
}

// ef_saisie : rien. Aucune règle de séjour pour un étranger résidant
//   au Togo n'a été lue à la source.
// ef_entretien, ef_visa : rien de local n'a été lu. La page des
//   8 étapes énumère les étapes sans en détailler les modalités
//   togolaises ; le tronc suffit tant qu'une source ne dit pas mieux.
}

};

/*
* CE QUI N'EST PAS DANS CE FICHIER, ET POURQUOI.
*
* Campus France Togo a publié le 7 septembre 2026 les dates de ses
* sessions d'information pour la rentrée 2027-2028 : 25/09 à 14h30,
* 30/09 à 14h30, 03/10 à 10h, 10/10 à 10h (spécial parents et élèves de
* terminale), à l'auditorium de l'Institut français du Togo à Lomé,
* avenue de Gaulle ; plus une session à l'Université de Lomé et une à
* l'Université de Kara ; et des directs Facebook tous les mercredis du
* 14 octobre au 4 novembre, de 15h à 17h. Entrée libre et gratuite,
* arriver 15 minutes à l'avance, « la session est fermée aux
* retardataires ».
*
* Ces dates ne sont PAS dans les données : elles seront périmées dans
* six semaines, et une donnée qui pourrit dans un fichier de procédure
* est une donnée qui finira par mentir. Leur place est dans une
* actualité datée, pas dans le modèle.
*/
