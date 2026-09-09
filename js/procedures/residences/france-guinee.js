/**
* ============================================================
* FitzUniverse — couche de résidence : France × Guinée (lot S2)
* ============================================================
*
* Même forme que js/procedures/residences/france-senegal.js.
*
* ✅ LU DIRECTEMENT À L'ÉCRAN le 2026-09-08, sur deux pages officielles.
*
* ⚠️ FRAÎCHEUR — À DIRE FRANCHEMENT.
* L'espace Campus France Guinée est le moins tenu à jour des cinq lus.
* La page « Calendrier de la procédure » porte « Mise à jour le
* 12 septembre 2024 » et décrit la rentrée 2024 ; la page « Les 6 étapes
* de la procédure » ne porte aucune date de mise à jour et cite encore
* « la rentrée de septembre 2021 » et une liste de documents 2022-2023.
* Les FAITS retenus ici sont ceux que les DEUX pages énoncent
* identiquement — montant, banque, numéro de compte, mécanique. Aucune
* date de campagne n'a été retenue.
*
* ⚠️ LA SOURCE SE CONTREDIT SUR LA BANQUE, ET ON NE TRANCHE PAS À SA
* PLACE. Sur la même page, un encadré dit « Tout paiement se fait
* seulement et uniquement à la BICIGUI », un autre « seulement et
* uniquement à la VISTAGUI », et l'avertissement chiffré donne VISTA-GUI
* avec un numéro de compte. VISTAGUI l'emporte en nombre et en
* précision, et la page des 6 étapes dit VISTAGUI elle aussi — mais un
* étudiant qui paie dans la mauvaise banque perd 1 500 000 GNF. La
* consigne porte donc les deux et lui dit d'appeler avant de payer.
*
* Aucun DOM, aucun Firestore : testable sous Node.
* ============================================================
*/

const VERIFIE = "2026-09-08";

/** Les pages officielles de l'espace Campus France Guinée. */
const SOURCES_GN = {
// « Mise à jour le 12 septembre 2024 » — montant, banque, compte.
CALENDRIER: "https://www.guinee.campusfrance.org/calendrier-de-la-procedure",
// Sans date de mise à jour ; cite encore la rentrée 2021.
ETAPES: "https://www.guinee.campusfrance.org/les-6-etapes-de-la-procedure"
};

export const COUCHE_FRANCE_GUINEE = {

id: "france-guinee",
destination: "France",
pays: "Guinée",
verifieLe: VERIFIE,

faits: {

// 1 500 000 GNF : deuxième pays hors zone franc CFA après le Maroc.
// Le franc guinéen n'a aucune parité fixe avec l'euro — ce montant ne
// doit jamais être fondu dans un total en euros (voir la règle de
// devise du lot S2-MODÈLE).
fraisDossier: {
texte: "Frais de dossier Campus France Guinée : 1 500 000 GNF, à régler EN ESPÈCES dans une agence VISTA-GUI, sur le compte ouvert au nom de Campus France Guinée n° 08701000110, en précisant votre nom complet et votre numéro GN. Le paiement ne se fait qu'APRÈS réception du message de demande de paiement. Campus France Guinée ne reçoit aucun argent en espèces et ne travaille avec aucun partenaire extérieur.",
montant: 1500000,
devise: "GNF",
source: SOURCES_GN.CALENDRIER,
verifieLe: VERIFIE
}

// calendrier : VOLONTAIREMENT ABSENT — voir `absences`.
},

absences: {
calendrier: "Campus France Guinée n'a pas publié le calendrier de la campagne à venir : la page de calendrier en ligne décrit encore la rentrée 2024. Aucune date n'est donc affichée ici, faute de source à jour — ce qui vaut mieux qu'une date reprise d'une campagne passée. Appelez l'espace Campus France Guinée ou surveillez ses annonces à l'approche de l'automne."
},

// L'espace Campus France Guinée publie lui-même cet avertissement, et
// il vise des rabatteurs qui encaissent au nom de Campus France. Le
// relayer coûte trois lignes et peut épargner 1 500 000 GNF à quelqu'un.
avertissement: "Campus France Guinée ne reçoit aucun argent en espèces et ne travaille avec aucun partenaire extérieur : tout paiement passe par la banque, après le message de demande de paiement. Son seul bureau est au CCFG ; ses déplacements en régions se font avec les autorités scolaires et universitaires locales. En cas de doute, appelez le 622 55 28 12 ou le 622 55 28 13 aux horaires de bureau avant de payer quoi que ce soit à qui que ce soit.",

// LES POINTS DE VIGILANCE (lot DIAGNOSTIC-2, 2026-09-09).
// Aucun fait neuf : ces phrases sont la partie des consignes ci-dessous
// qui coûte cher quand on ne la lit pas, remontée en tête du Diagnostic
// France. Même source, même date que la consigne dont elles sortent.
pointsDeVigilance: [
{
texte: "Si vous ne prenez pas votre rendez-vous d'entretien dans les 10 jours suivant l'ouverture des créneaux, Campus France vous convoque d'office, à une date que vous n'aurez pas choisie.",
source: "https://www.guinee.campusfrance.org/les-6-etapes-de-la-procedure",
verifieLe: VERIFIE
}
],

etapes: {

// AJOUT — la Guinée exige un PASSEPORT en cours de validité dès la
// création du compte, là où d'autres pays acceptent une carte
// d'identité plus tard dans la procédure. Et l'état civil saisi est
// définitif : c'est une erreur qu'on ne rattrape pas.
ef_compte: {
consigneSup: "Munissez-vous d'un passeport en cours de validité et d'une adresse électronique valide : le compte se crée avec l'un et se confirme avec l'autre. Vérifiez vos noms, prénoms et date de naissance avant de valider — aucune modification ne sera possible ensuite. Vous obtiendrez un numéro de compte de la forme GN2X-XXXXX, à rappeler à chaque contact avec votre espace, et à la banque au moment de payer.",
source: SOURCES_GN.ETAPES,
verifieLe: VERIFIE
},

// REMPLACEMENT — mécanique locale entière, contradiction de la source
// comprise, et le conseil qui fait économiser le plus : le rendez-vous
// d'orientation est GRATUIT et se prend AVANT de payer.
ef_paiement: {
titre: "Payer les frais de dossier — 1 500 000 GNF, après la demande de paiement",
consigne: "Ne payez rien tant que vous n'avez pas reçu, sur votre compte Études en France, le message vous demandant de procéder au paiement. Avant de payer, prenez le rendez-vous d'orientation gratuit proposé par Campus France Guinée : il sert précisément à vérifier la cohérence et la faisabilité de votre projet avant que vous n'engagiez 1 500 000 GNF. Le règlement se fait ensuite en espèces à l'agence bancaire, sur le compte de Campus France Guinée n° 08701000110, en précisant votre nom complet et votre numéro GN. ATTENTION : les pages officielles se contredisent sur le nom de la banque — VISTA-GUI y figure trois fois, dont une avec le numéro de compte, et BICIGUI une fois. Appelez le 622 55 28 12 ou le 622 55 28 13 pour confirmer l'agence avant de vous déplacer.",
montant: 1500000,
devise: "GNF",
source: SOURCES_GN.CALENDRIER,
verifieLe: VERIFIE
},

// REMPLACEMENT — la règle des 10 jours est propre à la Guinée, et elle
// joue dans les deux sens : passé ce délai on ne choisit plus son
// créneau, on le subit.
ef_entretien: {
consigne: "Le rendez-vous d'entretien se prend en ligne, depuis votre compte Études en France, dès l'ouverture des créneaux. Prenez-le vite : si vous ne l'avez pas fait dans les 10 jours qui suivent l'ouverture, Campus France vous convoquera d'office, à une date que vous n'aurez pas choisie. Apportez les ORIGINAUX de tous les justificatifs scannés dans votre dossier ; vous y détaillerez votre projet d'études et professionnel, vos motivations, vos acquis et les raisons de vos choix.",
source: SOURCES_GN.ETAPES,
verifieLe: VERIFIE
},

// AJOUT — l'irréversibilité, dite par la source elle-même.
ef_confirmation: {
consigneSup: "Une fois votre choix définitif confirmé, il vous sera impossible de revenir en arrière : ne le validez que si vous êtes certain.",
source: SOURCES_GN.ETAPES,
verifieLe: VERIFIE
},

// AJOUT — deux délais de bon sens, et le rappel que la décision n'est
// ni celle de Campus France ni la nôtre.
ef_visa: {
consigneSup: "Demandez votre visa au moins deux mois avant la date de rentrée, et prévoyez d'arriver en France au moins quinze jours avant. Le Consulat est le seul décisionnaire : ni Campus France, ni l'établissement, ni personne d'autre ne peut garantir un visa.",
source: SOURCES_GN.ETAPES,
verifieLe: VERIFIE
}

// ef_voeux : rien à ajouter — la page guinéenne dit « 3 formations
//   maximum en DAP, 7 maximum hors DAP », ce qui confirme le plafond
//   du tronc depuis un troisième pays. Le tronc suffit.
// ef_saisie : rien. Aucune règle de séjour pour un étranger résidant
//   en Guinée n'a été lue à la source.
}

};
