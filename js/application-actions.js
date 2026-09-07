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
import { collection, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// ==========================================================
// CRÉNEAUX ANTI-TRICHE (audit sécurité 2026-09-02).
// Le quota de candidatures (maxAccompaniedApplications) n'était
// vérifié QUE côté client : un étudiant outillé pouvait créer autant
// de documents qu'il voulait depuis la console développeur. Les
// règles Firestore ne savent pas COMPTER une sous-collection — mais
// elles savent contraindre un IDENTIFIANT. Chaque candidature est
// donc créée sous un id de créneau "slot-N" (N = 1..quota), et
// firestore.rules refuse toute création dont le N dépasse le quota
// de la formule : il ne peut mécaniquement pas exister plus de
// candidatures SIMULTANÉES que de créneaux. Supprimer une
// candidature libère son créneau — cohérent avec la promesse
// commerciale (« N candidatures À LA FOIS »).
//
// Toute création de candidature, où qu'elle soit dans le code, DOIT
// passer par slotIdLibre() + setDoc — plus jamais addDoc (un id
// auto-généré serait refusé par les règles).
// ==========================================================

/**
* Premier créneau libre pour une nouvelle candidature.
* @param {Array<{id:string}>} existingApplications - candidatures déjà chargées
* @param {number} quota - maxAccompaniedApplications de la formule (Infinity accepté)
* @param {string} [prefixe="slot"] - "slot" pour une bourse, "pre" pour une préinscription
* @returns {string|null} "slot-N" / "pre-N", ou null si tous les créneaux sont pris
*
* `prefixe` (grille B, 2026-09-07) : deux espaces d'identifiants distincts,
* donc deux quotas qui ne se consomment jamais l'un l'autre
* (firestore.rules, preSlotPattern). Passer ici les candidatures DU MÊME
* parcours.
*/
export function slotIdLibre(existingApplications, quota, prefixe = "slot") {

const motif = new RegExp("^" + prefixe + "-(\\d+)$");

const pris = new Set(
(existingApplications || [])
.map((a) => motif.exec(a.id || ""))
.filter(Boolean)
.map((m) => parseInt(m[1], 10))
);

// Signature (quota Infinity) : les règles serveur plafonnent à 999 —
// bien au-delà de tout usage réel, mais fini, pour rester exprimable.
const max = Number.isFinite(quota) ? quota : 999;

for (let n = 1; n <= max; n++) {
if (!pris.has(n)) return `${prefixe}-${n}`;
}

return null;

}

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
* @param {{existingApplications:Array<{id:string}>, quota:number}} contexte - candidatures déjà chargées + quota de la formule (l'appelant a déjà vérifié isQuotaReached ; ces deux valeurs servent à choisir le créneau)
* @returns {Promise<string>} l'id du document de candidature créé ("slot-N")
*/
export async function createApplicationFromRecommendation(uid, rec, { existingApplications, quota }) {

const slotId = slotIdLibre(existingApplications, quota);

if (!slotId) {
throw new Error("Aucun créneau de candidature libre pour cette formule.");
}

const appsCol = collection(db, "users", uid, "applications");

await setDoc(doc(appsCol, slotId), {
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

return slotId;

}
