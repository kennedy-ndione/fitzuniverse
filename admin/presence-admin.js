// ============================================
// Fitz Control Center — qui est en ligne, en temps réel (2026-09-23)
// ============================================
// Une seule écoute de la collection presence/{uid} (onSnapshot), et un
// réveil toutes les 30 secondes : sans lui, un étudiant qui ferme son
// onglet resterait « En ligne » à l'écran jusqu'au prochain changement
// de la collection. La règle (seuil, libellés) vit dans
// js/presence-etat.js, la même que celle de l'espace étudiant.
//
// COÛT : une lecture par battement d'étudiant affiché (45 s) tant que la
// page admin est ouverte. Négligeable à l'échelle actuelle.
// ============================================

import { db } from "../firebase-config.js";

import {
collection,
onSnapshot
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import { etatPresence } from "../js/presence-etat.js";

/**
* @param {(etat:(uid:string)=>{enLigne:boolean, libelle:string, vuLe:number}, enLigneMaintenant:number) => void} rappel
* @returns {() => void} arrêt de l'écoute
*/
export function ecouterPresence(rappel) {

let documents = new Map();

const emettre = () => {
const maintenant = Date.now();
const etat = (uid) => etatPresence(documents.get(uid), maintenant);
let enLigne = 0;
documents.forEach((_, uid) => { if (etat(uid).enLigne) enLigne++; });
rappel(etat, enLigne);
};

const arret = onSnapshot(collection(db, "presence"), (snapshot) => {
documents = new Map(snapshot.docs.map((d) => [d.id, d.data()]));
emettre();
}, (erreur) => {
console.error("Écoute de la présence impossible :", erreur);
});

const reveil = setInterval(emettre, 30_000);

return () => {
arret();
clearInterval(reveil);
};

}

/** La pastille admin : « ● En ligne » en vert, sinon « Vu il y a… » en gris. */
export function pastillePresence(etat) {
const e = etat || { enLigne: false, libelle: "Pas encore vu" };
return `<span class="presence-admin${e.enLigne ? " is-en-ligne" : ""}"><span class="presence-admin-dot" aria-hidden="true"></span>${e.libelle}</span>`;
}
