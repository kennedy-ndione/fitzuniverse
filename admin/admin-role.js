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

/**
* Vrai si ce document `admins` est celui d'un propriétaire.
* MIROIR de estSuperAdminDoc() dans firestore.rules — le serveur fait
* foi, celle-ci ne sert qu'à décider ce qu'on AFFICHE.
*/
export function estSuperAdminDoc(data) {
if (!data || data.isActive !== true) return false;
return !("role" in data) || data.role === "superAdmin";
}

let promesse = null;

/**
* @returns {Promise<{uid:string, email:string, data:Object, role:string, superAdmin:boolean}|null>}
* null = personne de connecté, ou aucun document admin actif.
*/
export function chargerAdmin() {

if (promesse) return promesse;

promesse = new Promise((resolve) => {

onAuthStateChanged(auth, async (user) => {

if (!user) { resolve(null); return; }

try {

const snap = await getDoc(doc(db, "admins", user.uid));

if (!snap.exists() || snap.data().isActive !== true) { resolve(null); return; }

const data = snap.data();

resolve({
uid: user.uid,
email: user.email || data.email || "",
data,
// Le rôle AFFICHÉ : un document sans champ `role` est celui du
// propriétaire, et on le nomme ainsi plutôt que de laisser un vide.
role: estSuperAdminDoc(data) ? "superAdmin" : (data.role || "admin"),
superAdmin: estSuperAdminDoc(data)
});

} catch (erreur) {

console.error("Lecture du rôle administrateur impossible :", erreur);
resolve(null);

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
