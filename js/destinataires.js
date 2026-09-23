/**
* ============================================================
* FitzUniverse — le MESSAGE GROUPÉ : à qui, et avec quels mots
* (2026-09-23, demande de Charles)
* ============================================================
*
* Module PUR (aucun DOM, aucun Firebase), lu par admin/messages.js et
* testé sous Node. Il décide QUI reçoit un message groupé et PERSONNALISE
* le texte pour chacun.
*
* Chaque destinataire reçoit le message dans SA conversation, signé
* FitzUniverse, exactement comme un message individuel : il ne voit ni
* les autres destinataires, ni qu'il s'agit d'un envoi groupé. Les
* comptes suspendus n'en reçoivent jamais.
* ============================================================
*/

import { bilanProfil, pourcentProfil } from "./profile-score.js";
import { resolvePlan, resolvePlanPreinscription, hasFitzExpressAccess } from "./plan-features.js";

export const SEGMENTS = [
{ id: "tous", libelle: "Tous les inscrits" },
{ id: "profil-incomplet", libelle: "Profil incomplet (moins de 100 %)" },
{ id: "profil-faible", libelle: "Profil rempli à moins de 50 %" },
{ id: "sans-diagnostic", libelle: "Diagnostic gratuit pas encore fait" },
{ id: "gratuits", libelle: "Comptes gratuits" },
{ id: "payants", libelle: "Formules payantes (Pass compris)" },
{ id: "en-ligne", libelle: "En ligne maintenant" }
];

/** Des modèles de message, pour ne pas partir d'une page blanche. */
export const MODELES = [
{
id: "profil",
libelle: "Compléter le profil",
texte: "Bonjour {prénom}, votre profil FitzUniverse n'est pas encore complet. Prenez quelques minutes pour le remplir depuis votre espace (Mon profil) : c'est lui qui nous permet de vous proposer les bourses et les universités qui vous correspondent vraiment."
},
{
id: "diagnostic",
libelle: "Faire le diagnostic",
texte: "Bonjour {prénom}, vous n'avez pas encore fait votre diagnostic gratuit. Il prend cinq minutes et vous dit quelles bourses et quels pays sont à votre portée : le bouton est tout en haut de votre espace."
}
];

/** Le pourcentage de profil rempli (0-100), tel que l'étudiant le lit. */
export function pourcentDuCompte(user) {
return pourcentProfil(bilanProfil((user && user.profile) || {}).score);
}

export function diagnosticFait(user) {
const d = user && user.diagnostic;
return !!d && typeof d === "object" && Object.keys(d).length > 0;
}

/** Aucun accompagnement : ni formule bourse, ni offre France, ni Pass. */
export function estGratuit(user) {
return resolvePlan(user || {}) === "gratuit" && !resolvePlanPreinscription(user || {}) && !hasFitzExpressAccess(user || {});
}

/**
* @param {Object} user            un document users/{uid} (avec uid)
* @param {string} segmentId
* @param {{enLigne?:(uid:string)=>boolean}} [options]
*/
export function correspond(user, segmentId, { enLigne = () => false } = {}) {
if (!user || user.disabled === true) return false;
switch (segmentId) {
case "tous": return true;
case "profil-incomplet": return pourcentDuCompte(user) < 100;
case "profil-faible": return pourcentDuCompte(user) < 50;
case "sans-diagnostic": return !diagnosticFait(user);
case "gratuits": return estGratuit(user);
case "payants": return !estGratuit(user);
case "en-ligne": return enLigne(user.uid) === true;
default: return false;
}
}

/** Les destinataires d'un segment, triés par nom. */
export function destinataires(users, segmentId, options = {}) {
return (Array.isArray(users) ? users : [])
.filter((u) => correspond(u, segmentId, options))
.sort((a, b) => nomAffiche(a).localeCompare(nomAffiche(b), "fr"));
}

export function nomAffiche(user) {
return (user && (user.name || (user.email ? user.email.split("@")[0] : ""))) || "Étudiant";
}

/** Le prénom : celui du profil, à défaut le premier mot du nom. */
export function prenom(user) {
const p = user && user.profile && typeof user.profile.firstName === "string" ? user.profile.firstName.trim() : "";
if (p) return p;
const nom = user && typeof user.name === "string" ? user.name.trim() : "";
return nom ? nom.split(/\s+/)[0] : "";
}

/**
* Remplace {prénom} (ou {prenom}) par le prénom de l'étudiant. Sans
* prénom connu, la marque disparaît proprement : « Bonjour {prénom}, »
* devient « Bonjour, » — jamais « Bonjour , » ni « Bonjour undefined ».
*/
export function personnaliser(texte, user) {
const p = prenom(user);
return String(texte || "")
.replace(/[  ]?\{pr[ée]nom\}/gi, p ? ` ${p}` : "")
.replace(/^[\s,;:]+/, "")
.trim();
}
