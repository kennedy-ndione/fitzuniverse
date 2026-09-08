/**
* ============================================================
* FitzUniverse — couche de résidence : France × Burkina Faso (lot S2)
* ============================================================
*
* Même forme que js/procedures/residences/france-senegal.js.
*
* ✅ LU DIRECTEMENT À L'ÉCRAN le 2026-09-08, sur deux pages officielles
* datées du 20 septembre 2024 (mises à jour le 27/01/2025).
*
* LE BURKINA EST LE SEUL PAYS OÙ LA PROCÉDURE REDEVIENT DU PAPIER.
* Après la validation du dossier numérique, il faut retirer une FICHE
* D'ADHÉSION, payer, puis se présenter à un RENDEZ-VOUS DE DÉPÔT avec
* les originaux, le reçu de banque, deux photos d'identité et la fiche
* remplie. Aucun des six autres pays lus n'a d'équivalent. Faute d'étape
* « dépôt papier » dans le tronc, cette exigence est portée par
* `ef_complement`, dont le sens — compléments de dossier et vérification
* des originaux — est le plus proche. Si le modèle autorise un jour une
* couche à AJOUTER une étape, c'est le premier cas réel rencontré.
*
* ET C'EST LE PAYS QUI ÉNONCE LA SANCTION LA PLUS LOURDE : un faux
* document entraîne l'inéligibilité à TOUTE procédure Campus France ET
* consulaire, et relève du code pénal. Ce n'est pas un avertissement de
* forme, c'est la fin d'un projet d'études.
*
* Aucun DOM, aucun Firestore : testable sous Node.
* ============================================================
*/

const VERIFIE = "2026-09-08";

/** Les pages officielles de l'espace Campus France Burkina. */
const SOURCES_BF = {
// « Mise à jour le 20 septembre 2024 » — les étapes et les pièces.
ETAPES: "https://www.burkina.campusfrance.org/les-grandes-etapes-de-la-procedure",
// « Publié le 20/09/2024, mis à jour le 27/01/2025 » — montant, fraude, intermédiaires.
CALENDRIER: "https://www.burkina.campusfrance.org/calendrier-de-la-procedure-de-candidatures-2024-2025"
};

export const COUCHE_FRANCE_BURKINA_FASO = {

id: "france-burkina-faso",
destination: "France",
pays: "Burkina Faso",
verifieLe: VERIFIE,

faits: {

// 70 000 F, troisième pays à ce montant après le Bénin et le Togo, et
// la phrase de la source est mot pour mot celle de la Côte d'Ivoire :
// « payables dès que vous soumettez votre dossier. Ils ne sont pas
// remboursables. » Les espaces partagent visiblement un gabarit — ce
// qui n'autorise pas à recopier d'un pays sur l'autre : chaque montant
// garde sa propre source.
//
// LA BANQUE N'EST PAS NOMMÉE. Les deux pages parlent du « reçu de la
// banque » sans dire laquelle. On ne la devine pas.
fraisDossier: {
texte: "Frais de gestion de dossier Campus France Burkina : 70 000 F CFA, payables dès que vous soumettez votre dossier. Ils ne sont pas remboursables. Conservez impérativement le reçu de la banque : il fait partie des pièces à présenter au rendez-vous de dépôt de votre dossier papier. Les pages officielles ne nomment pas l'établissement bancaire — demandez-le à votre espace Campus France avant de vous déplacer.",
montant: 70000,
devise: "XOF",
source: SOURCES_BF.CALENDRIER,
verifieLe: VERIFIE
}

// calendrier : VOLONTAIREMENT ABSENT — voir `absences`.
},

absences: {
calendrier: "Campus France Burkina n'a pas publié le calendrier de la campagne à venir : la page en ligne est celle de la procédure 2024-2025. Aucune date n'est donc affichée ici. Les campagnes précédentes ouvraient le 1er octobre avec une date butoir de soumission au début décembre, mais ces dates ne se reportent pas : consultez la page officielle dès l'ouverture, et la fiche de procédures de votre espace."
},

// Deux dangers en un seul texte, et le second est le plus grave des six
// pays lus. Le relayer intégralement fait partie du service.
avertissement: "Campus France Burkina met en garde sur deux points. D'abord la fraude documentaire : la présentation d'un faux document — faux relevé de notes, faux diplôme, fausse inscription, faux document Campus France — entraîne l'inéligibilité à TOUTE procédure Campus France et consulaire, et relève du code pénal. Ensuite les intermédiaires : aucune agence n'est agréée, et Campus France Burkina, service de l'ambassade de France, se déclare le seul organisme habilité à accompagner les mobilités étudiantes vers la France. FitzUniverse ne remplit, ne rédige et ne soumet aucun dossier, ne produit aucun document destiné à votre candidature, et ne se réclame d'aucun agrément : votre compte Études en France reste le vôtre. Vérifiez aussi la source de ce que vous lisez en ligne — Campus France Burkina rappelle qu'il n'a qu'une seule page Facebook officielle.",

etapes: {

// AJOUT — le numéro burkinabè et le piège qui va avec : il ne sert pas
// à se connecter. Des candidats perdent des jours à essayer.
ef_compte: {
consigneSup: "Connectez-vous depuis le site de Campus France Burkina et sélectionnez « Campus France Burkina » dans le menu déroulant. Après confirmation par courriel, vous recevez un numéro de dossier de la forme BF suivi de 7 chiffres, à donner chaque fois que vous vous présentez dans les services. ATTENTION : ce numéro n'est PAS votre identifiant de connexion — conservez à part l'adresse électronique et le mot de passe avec lesquels vous vous connectez.",
source: SOURCES_BF.ETAPES,
verifieLe: VERIFIE
},

// REMPLACEMENT — les pièces burkinabè sont les plus précises des six
// pays, et surtout les plus EXCLUSIVES : un relevé annuel est
// explicitement refusé là où ailleurs il passerait. C'est le genre de
// détail qui fait renvoyer un dossier en correction et perdre trois
// semaines.
ef_pieces: {
consigne: "Le Burkina exige des bulletins TRIMESTRIELS, et refuse explicitement le relevé annuel ou le relevé récapitulatif du lycée. Pour une préinscription en 1re ou 2e année : les bulletins trimestriels depuis la classe de seconde, le diplôme et le relevé du baccalauréat, les relevés semestriels de L1 — ou, à défaut, l'attestation d'inscription et le programme des matières délivrés par l'établissement — et vos attestations de stage, de formation ou de travail. Au-delà de la 2e année : diplôme et relevé du bac, relevés semestriels de CHAQUE année de licence, diplômes intermédiaires, attestation d'inscription et programme des matières pour l'année en cours, attestations de stage et de travail. Votre cursus doit être continu et justifié jusqu'à aujourd'hui : toute année non expliquée devra l'être. Si vous êtes en terminale, fournissez le bulletin du 1er trimestre de l'année en cours — n'attendez surtout pas d'avoir le bac pour candidater, ce serait trop tard.",
source: SOURCES_BF.ETAPES,
verifieLe: VERIFIE
},

// REMPLACEMENT — l'ordre burkinabè : on paie dès la soumission, et le
// reçu devient une pièce du dossier papier.
ef_paiement: {
titre: "Payer les frais de gestion de dossier — 70 000 F, dès la soumission",
consigne: "Les 70 000 F CFA sont payables dès que vous soumettez votre dossier, et ne sont pas remboursables. Retirez d'abord la fiche d'adhésion à Campus France, puis payez et CONSERVEZ LE REÇU DE LA BANQUE : il vous sera réclamé au rendez-vous de dépôt de votre dossier papier, avec la fiche remplie. Les pages officielles ne nomment pas la banque : demandez-la à votre espace Campus France, à Ouagadougou ou à Bobo, avant de vous déplacer.",
montant: 70000,
devise: "XOF",
source: SOURCES_BF.ETAPES,
verifieLe: VERIFIE
},

// REMPLACEMENT — LE DOSSIER PAPIER. Unique aux six pays lus.
ef_complement: {
titre: "Déposer le dossier papier à l'espace Campus France",
consigne: "Après validation de votre dossier numérique, un dossier PAPIER doit être déposé en personne, sur rendez-vous et dans les délais impartis, à votre espace Campus France — Ouagadougou ou Bobo. Réunissez : les ORIGINAUX de tous les justificatifs que vous avez scannés, votre document d'identité, le certificat de scolarité de l'année en cours, le reçu de la banque, DEUX photos d'identité et la fiche d'adhésion remplie. Vos pièces y seront vérifiées une à une. Rien de tout cela ne se fait en ligne : prévoyez le déplacement et les photos à l'avance.",
source: SOURCES_BF.ETAPES,
verifieLe: VERIFIE
},

// AJOUT — deuxième passage physique, après l'admission.
ef_confirmation: {
consigneSup: "Une fois votre choix définitif fait dans « Je suis accepté », imprimez votre attestation de préinscription et DÉPOSEZ-LA à l'espace Campus France : c'est là que vous recevrez les informations concernant votre demande de visa. La décision d'accorder ou non le visa se fonde sur l'ensemble du dossier et relève uniquement du service des visas.",
source: SOURCES_BF.ETAPES,
verifieLe: VERIFIE
}

// ef_entretien : rien de local. L'entretien pédagogique est obligatoire
//   et le rendez-vous se prend depuis le compte Études en France —
//   c'est déjà ce que dit le tronc.
// ef_saisie, ef_visa : rien lu à la source.
}

};
