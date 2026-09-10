/**
* ============================================================
* FitzUniverse — le journal des blocages (lot FITZ-RECOURS, 2026-09-10)
* ============================================================
*
* Charles veut que les outils Fitz deviennent « très compétents ».
* Impossible tant qu'aucun vrai étudiant n'a rien demandé. Ce journal
* enregistre, à chaque ouverture de Fitz depuis un blocage, le CODE du
* blocage et son issue — rien d'autre.
*
* AUCUNE DONNÉE PERSONNELLE, AUCUN TEXTE DE CONVERSATION. Le document
* porte : code, applicationId, etapeId, parcours, plan, resolu, date.
* firestore.rules impose cette forme exacte (hasOnly) : un champ de
* plus est refusé par le serveur.
*
* C'est ce journal qui dira, en janvier, quelles questions les
* étudiants posent réellement, et sur quoi entraîner l'IA. La campagne
* d'octobre à décembre devient une collecte. Le Control Center en
* affiche le compte, trié.
* ============================================================
*/

import { db } from "../firebase-config.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

/** Le nom de la sous-collection — le même que dans firestore.rules et admin/firebase-admin.js. */
export const COLLECTION_BLOCAGES = "blocages";

/**
* Enregistre un blocage. N'échoue jamais bruyamment : un journal qui
* casse la page qu'il observe serait pire qu'aucun journal.
*/
export async function enregistrerBlocage(uid, { code, applicationId = "", etapeId = "", parcours = "bourse", plan = "gratuit", resolu = false }) {

if (!uid || !code) return false;

try {
await addDoc(collection(db, "users", uid, COLLECTION_BLOCAGES), {
code: String(code).slice(0, 32),
applicationId: String(applicationId || "").slice(0, 64),
etapeId: String(etapeId || "").slice(0, 64),
parcours: parcours === "preinscription" ? "preinscription" : "bourse",
plan: String(plan || "gratuit").slice(0, 40),
resolu: resolu === true,
date: serverTimestamp()
});
return true;
} catch (error) {
console.warn("[FitzUniverse] Blocage non journalisé :", error && error.code ? error.code : error);
return false;
}

}
