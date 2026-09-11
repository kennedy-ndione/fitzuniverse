/**
* ============================================================
* FitzUniverse — le document utilisateur par défaut, à UN SEUL endroit
* ============================================================
*
* Jusqu'au lot PROFIL-PAR-NIVEAU (2026-09-11), payment.js
* (buildDefaultUserDoc) et js/creer-compte.js (creerCompteGratuit)
* construisaient chacun leur copie du document `users/{uid}` — une dette
* documentée dans creer-compte.js (« toute évolution doit être
* répercutée DANS LES DEUX FICHIERS »). Les deux passent désormais ici.
*
* Ce que ce module N'ÉCRIT PAS : `plan`, `planExpiresAt`, `disabled`,
* `testerAccess` — firestore.rules les réserve à l'administrateur, et une
* création qui les contiendrait serait refusée en bloc. `pendingPlan` est
* une INTENTION (payment.js), pas un accès.
*
* Le profil de départ reprend les réponses du diagnostic gratuit quand
* elles sont là (js/diagnostic-vers-profil.js) : c'est la seule façon,
* pour un Pass Découverte qui n'ouvre jamais profile.html, que Fitz le
* connaisse dans le chat.
*
* PUR : `serverTimestamp` est passé par l'appelant (SDK Firebase), jamais
* importé ici — le module se teste sous Node.
* ============================================================
*/

import { appliquerDiagnostic } from "./diagnostic-vers-profil.js";

/** Le profil vide historique (schéma plat de profile.js, alias compris). */
export function profilVide() {
return {
originCountry: "",
age: "",
currentDegree: "",
academicAverage: "",
englishLevel: "",
desiredField: "",
desiredCountry: ""
};
}

/**
* @param {Object} p
* @param {string} p.uid
* @param {string} p.name
* @param {string} p.email
* @param {string} [p.planId]           — intention de formule (paiement) ; absent pour un compte gratuit
* @param {Object|null} [p.reponsesDiagnostic] — sessionStorage.eligibilityResponses, ou null
* @param {() => any} p.serverTimestamp  — serverTimestamp du SDK Firestore
*/
export function documentUtilisateurParDefaut({ uid, name, email, planId = "", reponsesDiagnostic = null, serverTimestamp }) {

const horodatage = typeof serverTimestamp === "function" ? serverTimestamp : () => new Date();

let profile = profilVide();

if (reponsesDiagnostic && typeof reponsesDiagnostic === "object") {
const { profil } = appliquerDiagnostic(profile, reponsesDiagnostic);
profile = profil;
// Alias hérités, recalculés comme le fait profile.js à l'enregistrement.
if (profile.country && !profile.originCountry) profile.originCountry = profile.country;
if (Array.isArray(profile.preferredCountries) && profile.preferredCountries.length && !profile.desiredCountry) profile.desiredCountry = profile.preferredCountries[0];
if (profile.lastDegree && !profile.currentDegree) profile.currentDegree = profile.lastDegree;
}

const document = {
uid,
name,
email,
createdAt: horodatage(),
profile
};

if (planId) {
document.pendingPlan = planId;
document.pendingPlanRequestedAt = horodatage();
}

return document;

}
