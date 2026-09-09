/**
* ============================================================
* Control Center — qui est connecté, et à quel niveau (lot ADMIN)
* ============================================================
*
* Deux niveaux d'administrateur depuis le 2026-09-09 :
*
*   superAdmin  le propriétaire. Nomme, révoque, et pose une formule à
*               la main.
*   admin       un collègue. Étudiants, messages, catalogue. Ne nomme
*               personne, ne révoque personne, n'attribue aucune formule.
*
* AMORÇAGE — la règle qui évite toute manipulation en console : un
* document `admins` ACTIF et SANS champ `role` vaut superAdmin. Les
* comptes qui existaient avant ce lot sont donc propriétaires d'office,
* et l'interface fonctionne dès le déploiement. C'est exactement ce que
* dit firestore.rules (estSuperAdminDoc), et les deux doivent rester
* d'accord — un test compare les deux formulations.
*
* Ce module est le SEUL endroit du Control Center qui lit `admins/{uid}`
* pour en tirer un droit. La promesse est mémorisée : trois pages qui
* l'importent ne font qu'une lecture Firestore.
*
* Il ne redirige jamais : c'est le travail de admin-auth.js. Ici on
* répond seulement « qui, et à quel niveau ».
* ============================================================
*/

import { auth, db } from "../firebase-config.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
doc,
getDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import { estSuperAdminDoc as estSuper, defautDeRole, libelleDefautDeRole, ROLE_ADMIN, ROLE_SUPER_ADMIN } from "../js/roles-admin.js";

// Les valeurs de rôle vivent dans js/roles-admin.js, et nulle part
// ailleurs — un test échoue si une chaîne de rôle est écrite en dur.
// Ce module ne fait que les BRANCHER sur Firestore : il ne peut pas être
// testé sous Node (il importe le SDK depuis un CDN), et c'est justement
// pour cela que la décision est ailleurs.
export { estSuperAdminDoc, porteRoleProprietaire, defautDeRole, libelleDefautDeRole } from "../js/roles-admin.js";

let promesse = null;

/**
* @returns {Promise<{uid:string, email:string, data:Object, role:string, superAdmin:boolean, defautDeRole:Object|null}|null>}
* null = personne de connecté, ou aucun document admin actif.
* REJETTE si la lecture échoue : « on n'a pas pu savoir » n'est pas
* « ce compte n'a pas de droits », et les confondre déconnecte des
* administrateurs légitimes sans leur dire pourquoi.
*/
export function chargerAdmin() {

if (promesse) return promesse;

promesse = new Promise((resolve, rejeter) => {

onAuthStateChanged(auth, async (user) => {

if (!user) { resolve(null); return; }

try {

const snap = await getDoc(doc(db, "admins", user.uid));

if (!snap.exists() || snap.data().isActive !== true) { resolve(null); return; }

const data = snap.data();
const superAdmin = estSuper(data);

// ON NE DÉGRADE JAMAIS EN SILENCE (correctif du 2026-09-09).
// Une valeur de `role` inconnue rendait « administrateur ordinaire »
// sans un mot : le propriétaire, dont le document portait
// « super-admin », a perdu ses droits et personne n'a su pourquoi
// pendant une heure. Le défaut est désormais dit, avec sa valeur.
const defaut = defautDeRole(data);

if (defaut) {
console.warn(`[FitzUniverse] Document admins/${user.uid} : ${libelleDefautDeRole(defaut)}`, { role: data.role, superAdminResolu: superAdmin });
}

resolve({
uid: user.uid,
email: user.email || data.email || "",
data,
// Le rôle AFFICHÉ : un document sans champ `role` est celui du
// propriétaire, et on le nomme ainsi plutôt que de laisser un vide.
role: superAdmin ? ROLE_SUPER_ADMIN : (data.role || ROLE_ADMIN),
superAdmin,
defautDeRole: defaut
});

} catch (erreur) {

// CE CATCH RÉSOLVAIT `null`, et c'était un mensonge.
//
// `null` veut dire « ce compte n'est pas administrateur », et
// admin-auth.js le déconnecte sur cette base. Une lecture refusée ou
// une coupure réseau ne disent rien de tel : elles disent « on n'a
// pas pu savoir ». Le propriétaire s'est vu éjecter ainsi, sans un
// mot — la même famille de faute que l'écran qui parlait de
// connexion Internet sur une TypeError.
//
// On PROPAGE donc. Chaque appelant décide quoi montrer, mais aucun
// ne peut plus confondre « pas de droits » avec « pas de réponse ».
console.error(
`[FitzUniverse] Lecture de admins/${user.uid} impossible (${(erreur && erreur.code) || "erreur inconnue"}).`,
erreur
);
rejeter(erreur);

}

});

});

return promesse;

}

/**
* Retire du DOM tout ce qui est réservé au propriétaire quand
* l'utilisateur n'en est pas un.
*
* RETIRE, ne masque pas : un élément caché reste dans la tabulation,
* dans un Ctrl+F et dans la lecture d'un lecteur d'écran — et sur une
* page d'administration, il annonce à un collègue une capacité qu'il
* n'a pas. Même règle que le lot S4 pour les outils d'un autre espace.
*/
export function appliquerRole(superAdmin) {
if (superAdmin) return;
document.querySelectorAll("[data-super-admin]").forEach((el) => el.remove());
}
