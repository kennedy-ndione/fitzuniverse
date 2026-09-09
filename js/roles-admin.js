/**
* ============================================================
* Fitz — les rôles d'administrateur, écrits UNE fois (2026-09-09)
* ============================================================
*
* CE FICHIER EXISTE À CAUSE D'UNE PANNE, et elle mérite d'être racontée
* en entier parce que la leçon est plus large que le bug.
*
* Le lot ADMIN a posé deux niveaux — `superAdmin` et `admin` — et une
* règle d'amorçage : un document `admins` actif SANS champ `role` vaut
* propriétaire. La règle était juste. L'hypothèse ne l'était pas.
*
* Le document du propriétaire, créé en console des mois plus tôt,
* PORTAIT un champ `role` : « super-admin », avec un trait d'union. La
* comparaison `role === "superAdmin"` a donc rendu false, et trois
* choses sont tombées en même temps :
*   - le navigateur a retiré du DOM les commandes réservées, puis la
*     fiche étudiant a planté dessus (elle les lisait sans garde) ;
*   - les règles Firestore ont cessé de voir un superAdmin : le
*     propriétaire a perdu le droit d'écrire `plan` sur ses propres
*     clients ;
*   - et RIEN ne l'a dit. Une valeur inconnue était silencieusement
*     traitée comme « administrateur ordinaire ».
*
* Trois décisions en sortent, et elles tiennent ensemble :
*
*   1. UNE SEULE ORTHOGRAPHE, DÉCLARÉE ICI. Aucun autre fichier n'écrit
*      « superAdmin » ou « admin » en dur — un test le vérifie. Deux
*      chaînes égales écrites à deux endroits finissent par différer.
*   2. LA GRAPHIE HÉRITÉE EST ACCEPTÉE, ET SIGNALÉE. On ne la traite pas
*      comme un synonyme silencieux : elle est reconnue pour que personne
*      ne soit enfermé dehors, et rapportée comme un DÉFAUT DE DONNÉE
*      pour qu'elle finisse par disparaître.
*   3. UN RÔLE INCONNU N'EST JAMAIS UNE DÉGRADATION SILENCIEUSE. Il est
*      tracé avec sa valeur, et affiché sur la page des administrateurs.
*      C'est ce silence-là qui a coûté le diagnostic, pas la faute de
*      frappe.
*
* Module PUR : aucun Firebase, aucun DOM. C'est ce qui permet de le
* tester sous Node, et de comparer ses valeurs à celles de
* firestore.rules — la comparaison qui manquait.
* ============================================================
*/

/** La forme CANONIQUE, celle que le code écrit toujours. */
export const ROLE_SUPER_ADMIN = "superAdmin";
export const ROLE_ADMIN = "admin";

/**
* Graphie HÉRITÉE, présente en base avant le lot ADMIN. Acceptée pour ne
* enfermer personne dehors, jamais écrite par le code, et signalée comme
* un défaut de donnée partout où elle apparaît.
*/
export const ROLE_SUPER_ADMIN_HERITE = "super-admin";

/** Tout ce qui ouvre les droits du propriétaire. */
export const ROLES_SUPER_ADMIN = [ROLE_SUPER_ADMIN, ROLE_SUPER_ADMIN_HERITE];

/** Toutes les valeurs qu'un champ `role` peut légitimement porter. */
export const ROLES_CONNUS = [...ROLES_SUPER_ADMIN, ROLE_ADMIN];

/**
* Vrai si ce document `admins` est celui d'un propriétaire.
* MIROIR de estSuperAdminDoc() dans firestore.rules — le serveur fait
* foi, celle-ci ne décide que de ce qu'on AFFICHE. Un test compare les
* valeurs acceptées des deux côtés, pas seulement leur formulation :
* c'est la comparaison qui manquait, et qui aurait attrapé la panne.
*/
export function estSuperAdminDoc(data) {
if (!data || data.isActive !== true) return false;
if (!("role" in data)) return true; // L'AMORÇAGE : aucun rôle = le propriétaire.
return ROLES_SUPER_ADMIN.includes(data.role);
}

/**
* Ce que le document PORTE, indépendamment de son activation.
*
* estSuperAdminDoc() répond « ce compte a-t-il les droits », et un compte
* révoqué n'en a aucun. La colonne « Rôle » du tableau des
* administrateurs pose une autre question : un propriétaire révoqué
* reste un propriétaire, et le bouton « Réactiver » ne doit pas lui être
* proposé — les règles refusent d'écrire sur son document.
*/
export function porteRoleProprietaire(data) {
return estSuperAdminDoc({ ...(data || {}), isActive: true });
}

/**
* La valeur fautive d'un champ `role`, ou "" quand tout va bien.
*
* Deux cas la rendent non vide, et ils n'ont pas la même gravité :
*   - une valeur INCONNUE : personne ne sait ce que ce compte est censé
*     pouvoir faire, et il est traité comme un administrateur ordinaire ;
*   - la graphie HÉRITÉE : le compte fonctionne, mais il porte une
*     valeur que le code n'écrit plus, et qui a déjà cassé la production.
*
* @returns {{valeur:string, herite:boolean}|null}
*/
export function defautDeRole(data) {

if (!data || !("role" in data)) return null;

const valeur = data.role;

if (valeur === ROLE_SUPER_ADMIN_HERITE) return { valeur, herite: true };
if (!ROLES_CONNUS.includes(valeur)) return { valeur: String(valeur), herite: false };

return null;

}

/** La phrase à afficher pour un défaut de rôle. */
export function libelleDefautDeRole(defaut) {
if (!defaut) return "";
return defaut.herite
? `graphie héritée « ${defaut.valeur} » — à réécrire en « ${ROLE_SUPER_ADMIN} »`
: `rôle non reconnu : « ${defaut.valeur} » — ce compte est traité comme un administrateur ordinaire`;
}
