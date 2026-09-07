/**
* ============================================================
* Fitz — le parcours que suit une candidature
* ============================================================
*
* LE PROBLÈME QUE CE FICHIER RÉSOUT (lot A du chantier préinscription,
* 2026-09-07)
* --------------------------------------------------------------------
* Une candidature ne visait qu'une chose : une bourse. Or beaucoup
* d'étudiants visent une ADMISSION qu'ils financent eux-mêmes — une
* préinscription — et le suivi de FitzUniverse ne savait pas le dire.
* Ce lot pose seulement le champ `track` sur la candidature ; le
* parcours à l'écran (étapes, conseils) est le lot B.
*
* LA RÈGLE DURE : LE DÉFAUT EST À LA LECTURE
* -------------------------------------------
* Toutes les candidatures écrites avant ce lot n'ont pas de `track`.
* Elles sont des candidatures à une bourse — c'était la seule chose
* qu'on pouvait suivre. On le dit donc À LA LECTURE : un document sans
* le champ, avec une valeur inconnue, une mauvaise casse, null ou
* undefined, se lit « bourse ». Aucune écriture de rattrapage en base,
* jamais : une candidature ancienne ouverte dans l'espace ne doit
* produire AUCUNE écriture Firestore.
*
* Jamais d'exception, jamais de null renvoyé, jamais de mutation de
* l'argument. Aucun DOM, aucun Firestore : testable sous Node — même
* forme que js/exigences.js.
* ============================================================
*/

/** Le vocabulaire fermé, à UN SEUL endroit. */
export const PARCOURS = ["bourse", "preinscription"];

/**
* `court` va dans une pastille de carte ; `long` dans un select ou une
* phrase adressée à l'étudiant, à la première personne.
*/
export const LIBELLES = {
bourse: { court: "Bourse", long: "Candidature à une bourse" },
preinscription: { court: "Préinscription", long: "Admission que je finance" }
};

/**
* Lit le parcours d'une candidature. Rend TOUJOURS une des valeurs de
* PARCOURS ; « bourse » pour tout ce qui n'est pas exactement
* « preinscription » (champ absent, null, casse différente, inconnu).
*/
export function lireParcours(app) {
const track = app && typeof app === "object" ? app.track : undefined;
return track === "preinscription" ? "preinscription" : "bourse";
}

/** Vrai si la candidature vise une admission financée par l'étudiant. */
export function estPreinscription(app) {
return lireParcours(app) === "preinscription";
}
