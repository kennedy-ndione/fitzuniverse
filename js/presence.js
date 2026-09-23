/**
* ============================================================
* FitzUniverse — la pastille « En ligne » de l'espace étudiant
* (2026-09-23, demande de Charles)
* ============================================================
*
* Deux choses, démarrées une seule fois par page par js/app-shell.js et
* js/dual-shell.js, une fois la session connue :
*
*  1. LE BATTEMENT — tant que la page est affichée ET que l'appareil a du
*     réseau, presence/{uid} reçoit { enLigne:true, vuLe:serverTimestamp }
*     toutes les BATTEMENT_MS (js/presence-etat.js explique pourquoi on
*     n'écrit jamais « hors ligne » en quittant une page). C'est ce que le
*     Control Center écoute pour dire qui est en ligne.
*
*  2. LA PASTILLE — « En ligne » en vert dans la barre haute, à gauche de
*     la cloche. Elle dit la vérité du réseau : « Hors ligne », en gris,
*     quand l'appareil perd sa connexion (événements online/offline).
*
* Forme du document imposée par firestore.rules (match /presence/{uid}) :
* deux clés, et vuLe == request.time — un étudiant ne peut pas se dater
* dans le futur pour paraître en ligne.
* ============================================================
*/

import { auth, db } from "../firebase-config.js";

import {
doc,
setDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import { BATTEMENT_MS } from "./presence-etat.js";

let demarree = false;

function monterPastille() {
const barre = document.querySelector(".journey-topbar-actions");
if (!barre) return null;
const existante = barre.querySelector(".presence-pill");
if (existante) return existante;
const pastille = document.createElement("span");
pastille.className = "presence-pill";
pastille.setAttribute("role", "status");
pastille.innerHTML = `<span class="presence-dot" aria-hidden="true"></span><span class="presence-texte">En ligne</span>`;
barre.insertBefore(pastille, barre.firstChild);
return pastille;
}

function peindre(pastille) {
if (!pastille) return;
const enLigne = navigator.onLine !== false;
pastille.classList.toggle("is-hors-ligne", !enLigne);
pastille.querySelector(".presence-texte").textContent = enLigne ? "En ligne" : "Hors ligne";
pastille.title = enLigne ? "Vous êtes connecté à FitzUniverse" : "Connexion perdue : vos changements partiront au retour du réseau";
}

/**
* @param {string} uid
*/
export function demarrerPresence(uid) {

if (demarree || !uid) return;
demarree = true;

const reference = doc(db, "presence", uid);

// Une présence qui échoue (hors ligne, règles pas encore déployées) ne
// doit JAMAIS casser la page : on se tait.
const ecrire = (enLigne) => setDoc(reference, { enLigne, vuLe: serverTimestamp() }).catch(() => {});

const pastille = monterPastille();
peindre(pastille);

const visible = () => document.visibilityState === "visible";
let minuteur = null;

const battre = () => {
if (visible() && navigator.onLine !== false) ecrire(true);
};

const relancer = () => {
clearInterval(minuteur);
battre();
minuteur = setInterval(battre, BATTEMENT_MS);
};

document.addEventListener("visibilitychange", () => {
if (visible()) relancer();
else clearInterval(minuteur);
});

window.addEventListener("online", () => { peindre(pastille); battre(); });
window.addEventListener("offline", () => peindre(pastille));

// Déconnexion volontaire : l'admin doit voir tout de suite « hors
// ligne ». Écouteur en phase de CAPTURE pour partir avant signOut().
const deconnexion = document.getElementById("logoutBtn");
if (deconnexion) {
deconnexion.addEventListener("click", () => {
clearInterval(minuteur);
if (auth.currentUser) ecrire(false);
}, { capture: true });
}

if (visible()) relancer();

}
