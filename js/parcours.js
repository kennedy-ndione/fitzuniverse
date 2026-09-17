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

/**
* Le parcours d'une SAISIE d'outil Fitz (lot PRÉ-FITZ, 2026-09-10).
*
* Une page d'outil envoie soit la candidature elle-même (champ `track`,
* lu par lireParcours), soit — quand aucune candidature n'est liée —
* le parcours en clair, `parcours: "preinscription"`, déduit de l'espace
* où l'étudiant se trouve. Les deux formes passent par ICI, et par la
* même règle : tout ce qui n'est pas exactement « preinscription » est
* « bourse ». Ce n'est pas une seconde lecture, c'est la même, ouverte
* à une entrée de plus.
*
* NOTE : `parcours` peut aussi être un OBJET sur certains prompts (les
* faits déclarés du profil, lettre et diagnostic). Un objet n'est pas un
* parcours : il retombe sur le champ `track`, puis sur « bourse ».
*/
/**
* Le parcours dans lequel un OUTIL Fitz travaille : celui de la
* candidature liée quand il y en a une ; sinon celui de l'espace où
* l'étudiant se trouve (ctx.espace du shell). Un client des deux, dans
* son espace préinscription, écrit donc une lettre de vœu — et une lettre
* de bourse s'il bascule. Sans espace connu : « bourse », comme partout.
*/
export function parcoursDOutil({ espace = "", application = null } = {}) {
if (application) return lireParcours(application);
return espace === "preinscription" ? "preinscription" : "bourse";
}

/**
* CE QUE LA CANDIDATURE VISE, en une ligne lisible.
*
* Un vœu de préinscription porte sa formation dans `formation` et son
* niveau d'entrée dans `niveau` depuis le lot R1 (2026-09-17). Avant ce
* lot, le formulaire rangeait la formation dans `scholarship` — le champ
* « Bourse (optionnel) » — faute d'avoir mieux. Les trois pages d'outils
* et l'espace admin lisaient donc `scholarship` et n'affichaient plus
* rien pour un vœu neuf.
*
* Cette fonction est le SEUL endroit qui connaisse cet ordre de
* lecture : le champ neuf, puis l'ancien. Une bourse rend le nom de la
* bourse, inchangé.
*/
export function titreDuVoeu(app) {
if (!app || typeof app !== "object") return "";
const formation = String(app.formation || "").trim();
if (!formation) return String(app.scholarship || "").trim();
const niveau = String(app.niveau || "").trim();
if (!niveau || formation.toLowerCase().includes(niveau.toLowerCase())) return formation;
return `${formation} (${niveau})`;
}

export function lireParcoursDeSaisie(input) {
const p = input && typeof input === "object" ? input.parcours : undefined;
if (typeof p === "string") return p === "preinscription" ? "preinscription" : "bourse";
return lireParcours(input);
}
