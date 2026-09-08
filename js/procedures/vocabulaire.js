/**
* ============================================================
* FitzUniverse — le vocabulaire fermé des procédures de portail (lot E2)
* ============================================================
*
* Une procédure de portail, ce sont DES ÉTAPES DE PLUS dans le moteur
* de guidage qui existe déjà (js/next-action.js) — avec leurs
* prérequis, leurs dates et leurs preuves. Ce fichier ne porte que le
* vocabulaire : trois listes fermées, et la seule règle d'affichage qui
* en découle (texteConsigne).
*
* FIABILITÉ — les trois niveaux du briefing produit, repris tels quels :
*   verifie_source_officielle : lu sur une page de l'organisme lui-même
*                               (Campus France, ministère). Seul niveau
*                               affiché en CONSIGNE FERME.
*   a_confirmer               : valeur LÉGITIME, pas un échec — ce qu'on
*                               met partout où seule une passe derrière
*                               l'authentification tranche (écrans,
*                               formats exacts, pièges), ou ce qu'un
*                               agrégateur affirme sans qu'une page
*                               officielle le confirme. Affiché AVEC sa
*                               réserve, visible.
*   retour_etudiant           : rapporté par un étudiant réel. Affiché
*                               avec sa mention.
*
* Aucun DOM, aucun Firestore : testable sous Node.
* ============================================================
*/

export const FIABILITE = ["verifie_source_officielle", "a_confirmer", "retour_etudiant"];

export const TYPES_ETAPE = ["compte", "saisie", "voeux", "pieces", "soumission", "paiement", "entretien", "reponse", "confirmation", "complement", "visa"];

export const TYPES_PREUVE = ["numero_dossier", "recu", "convocation", "capture", "aucune"];

export const LIBELLES_FIABILITE = {
verifie_source_officielle: "Vérifié sur la source officielle",
a_confirmer: "À confirmer",
retour_etudiant: "Retour d'un étudiant"
};

/** La réserve, mot pour mot — c'est elle que le test cherche dans le texte. */
export const RESERVE_A_CONFIRMER = "à confirmer lors de la première passe réelle";

export const MENTION_RETOUR_ETUDIANT = "rapporté par un étudiant, non vérifié sur une source officielle";

/** Ce qu'on attend comme preuve, en clair. */
export const LIBELLES_PREUVE = {
numero_dossier: "votre numéro de dossier",
recu: "la référence de votre reçu",
convocation: "la référence de votre convocation",
capture: "une capture ou une référence",
aucune: ""
};

/** Une icône Lucide par type d'étape (noms vérifiés dans le bundle 1.31). */
export const ICONES_TYPE = {
compte: "log-in",
saisie: "pen-line",
voeux: "list-checks",
pieces: "paperclip",
soumission: "send",
paiement: "wallet",
entretien: "messages-square",
reponse: "mail",
confirmation: "circle-check",
complement: "file-plus",
visa: "plane"
};

/**
* LA règle d'affichage : une consigne n'est rendue FERME que si elle est
* vérifiée sur la source officielle. Les deux autres niveaux portent
* leur réserve dans le texte même — pas dans une icône qu'on peut ne
* pas voir.
*/
export function texteConsigne(etape) {
const consigne = String((etape && etape.consigne) || "").trim();
switch (etape && etape.fiabilite) {
case "verifie_source_officielle":
return consigne;
case "retour_etudiant":
return `${consigne} (${MENTION_RETOUR_ETUDIANT})`;
default:
return `${consigne} — ${RESERVE_A_CONFIRMER.charAt(0).toUpperCase()}${RESERVE_A_CONFIRMER.slice(1)}.`;
}
}

/** Vrai si la consigne peut s'afficher sans réserve. */
export function estConsigneFerme(etape) {
return !!etape && etape.fiabilite === "verifie_source_officielle";
}
