/**
* ============================================================
* FitzUniverse — création d'une candidature à partir d'une
* recommandation Fitz
* ============================================================
*
* Extrait du bloc addDoc() qui vivait auparavant en dur dans la boucle
* de seedRecommendedSlots() (applications.js) — utilisé maintenant à la
* fois par ce pré-remplissage automatique ET par le bouton "Candidater"
* de la section "Recommandé pour vous" (dashboard.js), pour ne jamais
* avoir deux façons de créer une candidature à partir d'une
* recommandation. Ne fait qu'écrire le document Firestore : ni le calcul
* de la recommandation (js/recommend-programs.js, fonction pure sans
* appel Firebase — ce module ne doit jamais le devenir), ni la
* vérification de quota (isQuotaReached(), js/plan-features.js), laissées
* à la charge de l'appelant.
* ============================================================
*/

import { db } from "../firebase-config.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// Dupliqué à l'identique de applications.js plutôt qu'importé : ce
// module est en amont d'applications.js dans le graphe de dépendances
// (applications.js importera createApplicationFromRecommendation
// ci-dessous) — importer nextCheckFromToday depuis applications.js
// créerait une dépendance circulaire. Fonction de 3 lignes, même
// tolérance que le reste du projet pour ce type de petit utilitaire.
function nextCheckFromToday(frequencyDays) {
const d = new Date();
d.setDate(d.getDate() + parseInt(frequencyDays, 10));
return d.toISOString().slice(0, 10);
}

/**
* @param {string} uid
* @param {{universityName:string, scholarshipTitle?:string}} rec - entrée de recommendPrograms() (js/recommend-programs.js)
* @returns {Promise<string>} l'id du document de candidature créé
*/
export async function createApplicationFromRecommendation(uid, rec) {

const appsCol = collection(db, "users", uid, "applications");

const ref = await addDoc(appsCol, {
university: rec.universityName,
scholarship: rec.scholarshipTitle,
portalUrl: "",
status: "a_preparer",
deadline: null,
reminderFrequency: 14,
notes: "",
premiumProtected: false,
isRecommendation: true,
nextCheckDate: nextCheckFromToday(14),
createdAt: serverTimestamp()
});

return ref.id;

}
