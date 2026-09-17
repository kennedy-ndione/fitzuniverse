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

/**
* LA DESTINATION D'UNE CANDIDATURE, et le diplôme qu'elle vise.
*
* CE QUI S'EST PASSÉ, mesuré en ligne le 2026-09-17 pendant la recette
* de la route : depuis l'étape 8, « Écrire avec Fitz » ouvrait
* ai-letter.html?applicationId=pre-1 pour un vœu à l'Université de
* Lille — et le champ « Pays visé » affichait CHINE. Le programme visé,
* lui, gardait le domaine du profil et non la formation du vœu.
*
* La cause est la même des deux côtés : les trois outils préremplissent
* d'abord avec le PROFIL (`preferredCountries[0]`, `desiredField`,
* `desiredDegree`), puis `applyApplicationContext()` ne réécrivait que
* l'université. Un défaut de profil vieux de six mois gagnait donc
* contre la candidature qu'on a sous les yeux, et la lettre partait pour
* le mauvais pays.
*
* La règle, désormais : QUAND UNE CANDIDATURE EST SÉLECTIONNÉE, C'EST
* ELLE QUI DIT LA CIBLE. Le profil ne sert plus qu'à l'absence de
* candidature (« Sans candidature liée »). Ces deux fonctions sont le
* seul endroit qui sache lire cette cible.
*
* `paysDuVoeu` ne DEVINE rien : un vœu porte son pays depuis le lot R4
* (espace-preinscription.js l'écrit à la création et le rattrape au
* chargement pour les vœux d'avant). Sans pays écrit, elle rend "" et
* l'outil garde ce que le profil disait — jamais une destination
* inventée.
*/
export function paysDuVoeu(app) {
if (!app || typeof app !== "object") return "";
return String(app.country || "").trim();
}

/**
* Le DIPLÔME d'un niveau d'entrée : « Licence 2 » se prépare en licence,
* « Master 1 » en master. Les sélecteurs des outils n'offrent que ces
* trois valeurs (Licence, Master, Doctorat) — BUT et Architecture se
* rangent en licence, qui est leur cycle.
*
* Rend "" pour un niveau inconnu : l'outil garde alors la valeur du
* profil plutôt que d'afficher un diplôme que personne n'a choisi.
*/
export function degreDuVoeu(app) {
const niveau = String((app && app.niveau) || "").trim().toLowerCase();
if (!niveau) return "";
if (niveau.startsWith("doctorat")) return "Doctorat";
if (niveau.startsWith("master")) return "Master";
if (niveau.startsWith("licence") || niveau.startsWith("but") || niveau.startsWith("dut") || niveau.startsWith("bts") || niveau.startsWith("architecture")) return "Licence";
return "";
}

export function lireParcoursDeSaisie(input) {
const p = input && typeof input === "object" ? input.parcours : undefined;
if (typeof p === "string") return p === "preinscription" ? "preinscription" : "bourse";
return lireParcours(input);
}
