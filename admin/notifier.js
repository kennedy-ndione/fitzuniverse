/**
* ============================================================
* Control Center — aucune action ne finit en silence (lot ADMIN)
* ============================================================
*
* Le Control Center répondait par `alert()` : une boîte système qui dit
* « Impossible de mettre à jour la formule. » et rien de plus. Elle ne
* dit pas POURQUOI — refus du serveur ? connexion perdue ? champ
* interdit ? — et elle disparaît avant qu'on ait pu la lire deux fois.
*
* Ici : un bandeau lisible, qui reste, qui nomme ce qui s'est passé, et
* qu'on peut relire. Trois tons, et une règle de rédaction :
*
*   succes   dit ce qui a été ENREGISTRÉ, avec sa valeur
*            (« Dossier France enregistré »), jamais « OK ».
*   erreur   dit la CAUSE, traduite depuis le code Firestore
*            (« refusé par le serveur : vous n'êtes pas propriétaire »).
*   info     un état, sans action réussie ni échouée.
*
* UN BOUTON QUI NE FAIT RIEN DE VISIBLE EST UN BOUTON CASSÉ : chaque
* action du lot passe par ici, dans les deux issues.
* ============================================================
*/

const DUREE = 9000;

let boite = null;
let minuterie = null;

function conteneur() {

if (boite && boite.isConnected) return boite;

boite = document.createElement("div");
boite.id = "adminNotifier";
boite.className = "admin-notifier";
boite.setAttribute("role", "status");
boite.setAttribute("aria-live", "polite");
document.body.appendChild(boite);

return boite;

}

/**
* Traduit une erreur Firestore en une phrase qui dit ce qui s'est passé.
* Le code `permission-denied` est le plus important : il signifie que le
* SERVEUR a refusé, et c'est une information, pas une panne — l'interface
* a proposé quelque chose que les règles n'autorisent pas.
*/
export function messageDErreur(erreur) {

const code = (erreur && (erreur.code || erreur.name)) || "";
const detail = (erreur && erreur.message) || "";

if (/permission-denied/.test(code)) {
return "refusé par le serveur : vous n'avez pas ce droit sur ce compte. Seul le propriétaire peut attribuer une formule ou nommer un administrateur.";
}
if (/unauthenticated/.test(code)) return "votre session a expiré — reconnectez-vous.";
if (/unavailable|network|deadline-exceeded/.test(code)) return "connexion perdue — rien n'a été enregistré. Réessayez.";
if (/not-found/.test(code)) return "ce document n'existe plus.";

return detail ? `erreur inattendue — ${detail}` : "erreur inattendue.";

}

export function notifier(message, ton = "info") {

const el = conteneur();

el.className = `admin-notifier is-${ton}`;
el.textContent = message;
el.hidden = false;

clearTimeout(minuterie);
minuterie = setTimeout(() => { el.hidden = true; }, DUREE);

return el;

}

export const succes = (message) => notifier(message, "succes");
export const echec = (message, erreur) => notifier(erreur ? `${message} — ${messageDErreur(erreur)}` : message, "erreur");
