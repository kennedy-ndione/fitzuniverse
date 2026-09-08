/**
* ============================================================
* FitzUniverse — couche de résidence : France × Bénin (lot S2)
* ============================================================
*
* Même forme que js/procedures/residences/france-senegal.js.
*
* ✅ LU DIRECTEMENT À L'ÉCRAN le 2026-09-08. Page « La procédure de
* candidatures classiques 2025-2026 », mise à jour le 30 octobre 2025.
* La page « Calendrier des procédures », elle, date du 25 juin 2024 et
* mélange trois campagnes : seuls ses faits de STRUCTURE en ont été
* tirés — aucune de ses dates.
*
* LE BÉNIN A UNE PORTE QUE PERSONNE D'AUTRE N'A.
* Avant toute candidature, un TEST D'AUTO-ÉVALUATION obligatoire sur
* MonEspaceBJ rend un FEU ROUGE ou un FEU VERT. Feu rouge : le candidat
* ne peut pas candidater du tout. Et les conditions d'accès sont
* chiffrées — un seul redoublement, trois procédures classiques dans une
* vie. Un Béninois qui découvre cela après avoir payé 70 000 F a perdu
* son argent et sa campagne. C'est le fait le plus utile de ce fichier.
*
* Aucun DOM, aucun Firestore : testable sous Node.
* ============================================================
*/

const VERIFIE = "2026-09-08";

/** Les pages officielles de l'espace Campus France Bénin. */
const SOURCES_BJ = {
// « Mise à jour le 30 octobre 2025 » — la source de tout ce fichier.
ETAPES: "https://www.benin.campusfrance.org/la-procedure-de-candidatures-classiques-2025-2026",
// « Mise à jour le 25 juin 2024 » — structure seulement, aucune date.
CALENDRIER: "https://www.benin.campusfrance.org/calendrier-des-procedures",
// Le test d'auto-évaluation lui-même.
AUTOEVAL: "https://monespacebj.campusfrance.org/"
};

export const COUCHE_FRANCE_BENIN = {

id: "france-benin",
destination: "France",
pays: "Bénin",
verifieLe: VERIFIE,

faits: {

// 70 000 F : le moins cher des quatre pays de la zone franc lus à ce
// jour (Sénégal 85 000, Côte d'Ivoire 80 000, Cameroun 101 000 tout
// compris). Deux banques, et la seconde ne dépend pas du candidat mais
// de sa VILLE — un détail que seul un texte local peut porter.
fraisDossier: {
texte: "Frais de gestion de dossier Campus France Bénin : 70 000 F CFA, à régler dans une agence de la Société Générale du Bénin sur le compte 502, muni de votre numéro BJ et d'une pièce d'identité. Les étudiants de Parakou règlent ces frais à Orabank. Le paiement précède la soumission du dossier.",
montant: 70000,
devise: "XOF",
source: SOURCES_BJ.ETAPES,
verifieLe: VERIFIE
}

// calendrier : VOLONTAIREMENT ABSENT — voir `absences`.
},

absences: {
calendrier: "Le calendrier de la campagne pour la rentrée 2027 n'est pas encore publié par Campus France Bénin. Les procédures s'ouvrent le 1er octobre ; lors de la campagne précédente, le paiement des frais devait être fait avant la mi-novembre et la première soumission du dossier avant le 20 novembre — des dates serrées, mais qui ne se reportent pas telles quelles d'une année sur l'autre. Consultez le calendrier officiel dès l'ouverture."
},

etapes: {

// AJOUT — LA PORTE. Trois choses qu'un candidat béninois doit savoir
// AVANT de dépenser un franc : le test d'auto-évaluation obligatoire,
// son feu rouge éliminatoire, et les conditions chiffrées. Aucune
// autre couche n'a d'équivalent.
ef_compte: {
consigneSup: "Au Bénin, la procédure commence AVANT la plateforme : passez d'abord le test d'auto-évaluation obligatoire sur MonEspaceBJ. Il rend un feu rouge — vous ne remplissez pas les conditions et ne pouvez pas candidater — ou un feu vert, qui vous ouvre la suite. Vérifiez d'abord les conditions d'accès, strictement appliquées : un seul redoublement, mentionné dans le parcours et cohérent avec le niveau visé (un enjambement, une année blanche ou une réorientation ne comptent pas comme un redoublement) ; une rétrogradation est acceptée ; et trois procédures classiques Campus France au maximum, toutes années confondues. Créez ensuite votre compte Études en France en sélectionnant l'espace Campus France Bénin, et conservez votre numéro BJ (BJXX-XXXXX) : il vous sera demandé à la banque.",
source: SOURCES_BJ.ETAPES,
verifieLe: VERIFIE
},

// AJOUT — deux justificatifs béninois qui ne se déposent pas là où on
// les attendrait : ni dans les pièces d'identité, ni dans les
// diplômes, mais en « Autre activité » du cursus. Un candidat qui les
// met ailleurs voit son dossier renvoyé en correction.
ef_pieces: {
consigneSup: "Deux justificatifs propres au Bénin se déposent dans « Mon cursus », partie « Autre activité », et nulle part ailleurs. Le premier : créez une ligne au titre « Conditions d'accès » suivi de votre numéro de test (par exemple « Conditions d'accès 15W4KWFXFS »), et joignez la capture d'écran du courriel de feu vert, numéro de référence bien visible. Le second, une fois les frais payés : une ligne « quittance de paiement » avec le scan de votre quittance.",
source: SOURCES_BJ.ETAPES,
verifieLe: VERIFIE
},

// REMPLACEMENT — montant, banque, numéro de compte, banque de repli
// pour une ville, et surtout l'ordre : on paie AVANT de soumettre.
ef_paiement: {
titre: "Payer les frais de gestion de dossier — 70 000 F, avant la soumission",
consigne: "Muni de votre numéro BJ et d'une pièce d'identité, réglez 70 000 F CFA dans une agence de la Société Générale du Bénin, sur le compte 502. Si vous étudiez à Parakou, le paiement se fait à Orabank. Au Bénin, le paiement précède la soumission : conservez la quittance, scannez-la et joignez-la à votre dossier en « Autre activité » avant de soumettre.",
montant: 70000,
devise: "XOF",
source: SOURCES_BJ.ETAPES,
verifieLe: VERIFIE
},

// AJOUT — l'ordre béninois, redit là où il se joue.
ef_soumission: {
consigneSup: "À partir du 1er octobre, remplissez votre panier de formations, joignez le scan de votre quittance de paiement, puis soumettez. Votre dossier sera ensuite vérifié par un conseiller Campus France, qui peut demander des corrections : consultez votre compte souvent et répondez vite, la date limite en vigueur au Bénin s'applique aussi aux corrections.",
source: SOURCES_BJ.ETAPES,
verifieLe: VERIFIE
},

// REMPLACEMENT — l'entretien béninois est un entretien de vérification
// ET de fond : les originaux y sont contrôlés un à un.
ef_entretien: {
consigne: "Quand votre dossier en ligne est complet, vous recevez une convocation à un entretien individuel. Apportez TOUS les documents originaux que vous avez joints en ligne : le conseiller les vérifie un à un. Vous y présenterez votre parcours et votre projet d'études, et le conseiller vous questionnera sur sa cohérence, vos motivations et votre niveau académique.",
source: SOURCES_BJ.ETAPES,
verifieLe: VERIFIE
},

// AJOUT — l'API tamponnée. Une pièce physique, délivrée par l'espace
// local, sans laquelle la demande de visa ne peut pas être déposée.
// Rien de tel au Sénégal, en Côte d'Ivoire, au Cameroun ni au Maroc.
ef_confirmation: {
consigneSup: "Après avoir validé votre choix définitif, téléchargez votre API — Accord Préalable d'Inscription. Elle doit être SIGNÉE ET TAMPONNÉE par Campus France Bénin avant votre demande de visa : prévoyez ce passage, il ne se fait pas en ligne.",
source: SOURCES_BJ.ETAPES,
verifieLe: VERIFIE
},

// REMPLACEMENT — troisième opérateur de visa rencontré : VFS Global au
// Sénégal, TLS Contact au Cameroun, Capago au Bénin.
ef_visa: {
consigne: "Créez votre compte sur france-visas.gouv.fr, puis prenez rendez-vous à Capago pour déposer vos justificatifs. Soignez particulièrement l'hébergement et le garant financier. L'espace Campus France Bénin organise des sessions d'information sur le logement, les démarches consulaires et la préparation au départ : demandez-en le calendrier.",
source: SOURCES_BJ.ETAPES,
verifieLe: VERIFIE
}

// ef_saisie : rien. Aucune exigence de titre de séjour pour un
//   étranger résidant au Bénin n'a été lue à la source.
// ef_voeux : rien. Aucune page béninoise lue ne donne de plafond de
//   vœux propre au pays ; le plafond du tronc s'applique.
}

};

/*
* HORS MODÈLE, MAIS À NE PAS PERDRE — TROIS PROCÉDURES AU BÉNIN.
* Campus France Bénin en distingue trois, et se tromper de porte coûte
* une campagne :
*   1. candidatures classiques — universités publiques et établissements
*      connectés (Licence, Master, école d'architecture, DUT) ;
*   2. pré-consulaire / « acceptation papier » — pour qui a candidaté
*      directement auprès d'un établissement, en général privé, et a
*      déjà reçu son acceptation ;
*   3. Parcoursup — BTS, CPGE, DCG, et les titulaires du baccalauréat
*      français. ATTENTION : Parcoursup NE DISPENSE PAS de la procédure
*      Études en France pré-consulaire « je suis accepté » dès réception
*      d'une acceptation.
* Les dates de ces deux dernières n'ont pas été retenues : la page qui
* les porte date du 25 juin 2024 et mélange trois campagnes.
*/
