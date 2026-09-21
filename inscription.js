/**
 * ============================================================
 * inscription.js — la porte d'entrée du compte gratuit
 * ============================================================
 *
 * Décision de Charles du 2026-09-20 : un étudiant crée son compte
 * SANS payer, pour conserver son diagnostic, remplir son profil et
 * être alerté quand une bourse ouvre. La création elle-même vit dans
 * js/creer-compte.js (creerCompteGratuit — le module du 2026-09-04,
 * resté orphelin jusqu'à cette page) : ce fichier ne fait que lire le
 * formulaire, valider avec les MÊMES règles que le tunnel de paiement,
 * enregistrer le consentement aux alertes, puis conduire l'étudiant
 * vers son espace (dashboard.html, l'aiguillage bourse/préinscription).
 *
 * LE CONSENTEMENT AUX ALERTES (alerteBourses) est écrit dans
 * users/{uid} APRÈS la création — jamais dedans : le document de
 * création est bâti par js/compte-par-defaut.js, partagé avec
 * payment.js, et on ne le bifurque pas pour un champ. Un échec de
 * cette écriture ne bloque pas l'inscription : le compte prime, le
 * consentement se rattrapera depuis le compte.
 */

import { creerCompteGratuit } from "./js/creer-compte.js";
import { trackEvent } from "./js/analytics.js";
import { retourSur, avecRetour } from "./js/retour-apres-compte.js";

// COMPTE D'ABORD (2026-09-21) : un visiteur qui vient d'une formule
// (payment.html) y retourne une fois son compte créé — voir
// js/retour-apres-compte.js. Le lien « Connectez-vous » emporte le même
// retour, pour qui découvre ici qu'il avait déjà un compte.
const RETOUR = retourSur(window.location.search);
if (RETOUR) {
document.querySelectorAll('a[href="login.html"]').forEach((a) => a.setAttribute("href", avecRetour("login.html", RETOUR)));
}

const form = document.getElementById("inscriptionForm");
const nomInput = document.getElementById("inscriptionNom");
const emailInput = document.getElementById("inscriptionEmail");
const motDePasseInput = document.getElementById("inscriptionMotDePasse");
const alertesInput = document.getElementById("inscriptionAlertes");
const erreurEl = document.getElementById("inscriptionErreur");
const bouton = document.getElementById("inscriptionSubmit");

function afficherErreur(message) {
erreurEl.textContent = message;
erreurEl.hidden = false;
}

// Les MÊMES règles que js/creer-compte.js et payment.js : un étudiant
// qui s'inscrit ici et un étudiant qui achète ne doivent pas rencontrer
// deux exigences différentes pour le même mot de passe.
function valider({ nom, email, motDePasse }) {

if (!nom || nom.length < 2) return "Indiquez votre nom complet.";
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Vérifiez le format de votre adresse e-mail.";
if (motDePasse.length < 8) return "Votre mot de passe a besoin d'au moins 8 caractères.";
if (!/[A-Z]/.test(motDePasse)) return "Votre mot de passe a besoin d'au moins une majuscule.";
if (!/[0-9]/.test(motDePasse)) return "Votre mot de passe a besoin d'au moins un chiffre.";

return null;

}

function messageFirebase(code) {

if (code === "auth/email-already-in-use") {
return "Cette adresse a déjà un compte. Connectez-vous pour le retrouver.";
}
if (code === "auth/invalid-email") return "Vérifiez le format de votre adresse e-mail.";
if (code === "auth/weak-password") return "Votre mot de passe a besoin d'au moins 8 caractères.";
if (code === "auth/network-request-failed") {
return "Connexion interrompue. Vérifiez votre réseau, puis réessayez.";
}
if (code === "auth/too-many-requests") {
return "Trop de tentatives. Patientez quelques minutes avant de réessayer.";
}

return "La création du compte n'a pas abouti. Réessayez dans un instant.";

}

if (form) {

form.addEventListener("submit", async (evenement) => {

evenement.preventDefault();
erreurEl.hidden = true;

const nom = nomInput.value.trim();
const email = emailInput.value.trim().toLowerCase();
const motDePasse = motDePasseInput.value;

const probleme = valider({ nom, email, motDePasse });

if (probleme) {
afficherErreur(probleme);
return;
}

bouton.disabled = true;
bouton.textContent = "Création du compte...";

try {

const utilisateur = await creerCompteGratuit({ nom, email, motDePasse });

// Le consentement aux alertes, puis l'e-mail de vérification
// Firebase (gratuit, natif). Ni l'un ni l'autre ne bloque
// l'arrivée dans l'espace : le compte existe, c'est l'essentiel.
try {

const { db } = await import("./firebase-config.js");
const { doc, updateDoc, serverTimestamp } = await import(
"https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js"
);

await updateDoc(doc(db, "users", utilisateur.uid), {
alerteBourses: alertesInput ? alertesInput.checked === true : false,
alerteBoursesMajLe: serverTimestamp()
});

} catch (erreurConsentement) {
console.warn("[Fitz] consentement aux alertes non enregistré :", erreurConsentement);
}

try {
const { sendEmailVerification } = await import(
"https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js"
);
await sendEmailVerification(utilisateur);
} catch (erreurVerification) {
console.warn("[Fitz] e-mail de vérification non envoyé :", erreurVerification);
}

trackEvent("compte_gratuit_cree", { alertes: alertesInput ? alertesInput.checked : false });

// L'aiguillage existant : dashboard.html mène au choix
// bourse / préinscription, exactement ce que doit voir un compte
// qui n'a encore rien payé.
window.location.replace(RETOUR || "dashboard.html");

} catch (error) {

console.error("[Fitz] création de compte :", error);

bouton.disabled = false;
bouton.textContent = "Créer mon compte gratuit";

afficherErreur(messageFirebase(error?.code));

}

});

}
