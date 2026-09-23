/**
* ============================================================
* FitzUniverse — actions sensibles du compte utilisateur
* ============================================================
*
* Changement de mot de passe et suppression définitive de compte,
* utilisés par account.html/account.js. Isolé dans son propre module
* (plutôt que dans account.js) car ces deux actions sont les seules du
* site à exiger une réauthentification Firebase (mot de passe ressaisi)
* et à toucher directement Firebase Authentication en plus de
* Firestore — logique volontairement séparée de l'UI qui l'appelle.
*
* Périmètre de la suppression de compte (choix assumé, à faire évoluer
* si besoin) :
*  - SUPPRIMÉS : le document users/{uid} (profil, préférences...) et sa
*    messagerie (users/{uid}/messages, la boîte de réception de
*    l'étudiant).
*  - CONSERVÉES : les notes internes admin (users/{uid}/adminNotes —
*    pratique CRM standard, historique de suivi conservé même après le
*    départ d'un étudiant) et le journal d'événements analytics
*    (analyticsEvents — déjà non modifiable par un client, voir
*    firestore.rules). Si ce choix doit changer, coordonner avec
*    firestore.rules (ces deux collections sont aujourd'hui verrouillées
*    en écriture/suppression pour tout le monde sauf l'admin).
*  - Le compte Firebase Authentication est supprimé EN DERNIER (une
*    fois supprimé, le jeton de l'utilisateur n'est plus valide pour
*    d'autres écritures Firestore).
* ============================================================
*/

import { auth, db } from "../firebase-config.js";

import {
EmailAuthProvider,
reauthenticateWithCredential,
updatePassword,
deleteUser
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
doc,
deleteDoc,
updateDoc,
collection,
getDocs,
writeBatch
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// Clés localStorage globales (non préfixées par uid) posées par le
// reste du site — nettoyées pour ne laisser aucune trace locale de
// l'ancien compte sur cet appareil.
const GLOBAL_LOCAL_KEYS = [
"generatedDocuments",
"uploadedDocuments",
"scholarbridge_sidebar_collapsed",
"scholarbridge_remembered_email",
"sb_ai_translate_history"
];

/**
* Reconfirme l'identité de l'utilisateur via son mot de passe actuel —
* requis par Firebase avant toute action sensible (changement de mot
* de passe, suppression de compte) si la session n'est pas "récente".
*/
async function reauthenticate(password) {

const user = auth.currentUser;

if (!user || !user.email) {
throw new Error("Aucune session active.");
}

const credential = EmailAuthProvider.credential(user.email, password);

await reauthenticateWithCredential(user, credential);

}

export async function changePassword(currentPassword, newPassword) {

await reauthenticate(currentPassword);
await updatePassword(auth.currentUser, newPassword);

}

// Réglage "Fitz peut me prévenir par e-mail" (account.html). N'importe
// aucune action de réauthentification comme les deux fonctions
// ci-dessus/dessous : ce n'est pas une action sensible, un simple champ
// booléen sur users/{uid}, déjà autorisé en écriture par le
// propriétaire (firestore.rules — seul un jeu de champs réservé à
// l'admin, plan/disabled/testerAccess/..., est bloqué). Aucun e-mail
// n'est envoyé aujourd'hui quand ce réglage est activé — voir
// js/fitz-voice.js (FITZ_EMAIL_TEMPLATES) pour le texte déjà prêt pour
// la future Cloud Function qui le consommera.
export async function setEmailNotifications(uid, enabled) {
await updateDoc(doc(db, "users", uid), { emailNotifications: enabled === true });
}

export async function deleteAccount(password) {

const user = auth.currentUser;

if (!user) {
throw new Error("Aucune session active.");
}

const uid = user.uid;

await reauthenticate(password);

// 1. Messagerie de l'étudiant (users/{uid}/messages) — l'étudiant en
// est propriétaire, firestore.rules l'autorise désormais à la
// supprimer. Les notes admin (adminNotes) ne sont volontairement PAS
// touchées ici (voir en-tête de fichier).
const messagesSnap = await getDocs(collection(db, "users", uid, "messages"));

if (!messagesSnap.empty) {

const batch = writeBatch(db);
messagesSnap.docs.forEach((docSnap) => batch.delete(docSnap.ref));
await batch.commit();

}

// 1 bis. La présence « En ligne » (presence/{uid}, 2026-09-23) — une
// trace d'activité : elle part avec le compte. Un échec ici ne doit
// pas bloquer la suppression.
await deleteDoc(doc(db, "presence", uid)).catch(() => {});

// 2. Document utilisateur principal (profil, préférences...).
await deleteDoc(doc(db, "users", uid));

// 3. Stockage local associé à ce compte, pour ne rien laisser derrière
// sur cet appareil.
GLOBAL_LOCAL_KEYS.forEach((key) => localStorage.removeItem(key));
localStorage.removeItem(`sb_ai_chat_${uid}`);

// 4. Compte Firebase Authentication — toujours en dernier : une fois
// supprimé, le jeton de l'utilisateur n'est plus valide pour aucune
// autre opération Firestore.
await deleteUser(user);

}
