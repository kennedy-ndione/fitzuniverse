import { auth } from "./firebase-config.js";
import {
signInWithEmailAndPassword,
sendPasswordResetEmail,
setPersistence,
browserLocalPersistence,
browserSessionPersistence
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
showFormError,
clearFormError,
setButtonLoading,
getAuthErrorMessage
} from "./auth-ui.js";

import { trackEvent } from "./js/analytics.js";

// ======================
// Éléments du formulaire
// ======================

const form = document.getElementById("loginForm");
const emailInput = document.getElementById("signupEmail");
const passwordInput = document.getElementById("signupPassword");
const rememberMeInput = document.getElementById("rememberMe");
const submitButton = form ? form.querySelector("button[type='submit']") : null;

// ======================
// Connexion
// ======================

if (form) {

form.addEventListener("submit", async (event) => {

event.preventDefault();
clearFormError(form);

const email = emailInput.value.trim().toLowerCase();
const password = passwordInput.value;

if (!email || !password) {
showFormError(form, "Veuillez remplir tous les champs.");
return;
}

if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
showFormError(form, "Adresse e-mail invalide.");
emailInput.focus();
return;
}

setButtonLoading(submitButton, true, "Connexion...");

try {

// "Se souvenir de moi" décoché → session limitée à cet onglet
// (browserSessionPersistence), effacée à la fermeture du navigateur.
// Coché (ou par défaut) → persiste comme avant (browserLocalPersistence).
// Réglé avant signIn : Firebase applique la persistance à la session
// qui va être créée par cet appel, pas à une session déjà ouverte.
await setPersistence(
auth,
rememberMeInput && !rememberMeInput.checked ? browserSessionPersistence : browserLocalPersistence
);

const identifiants = await signInWithEmailAndPassword(auth, email, password);

// Marqueur d'accueil : écrit seulement si la case est cochée, effacé
// sinon — pour qu'un utilisateur qui la décoche sur un poste partagé
// ne laisse aucune trace derrière lui, même celle d'une visite
// précédente. Voir le bloc ACCUEIL PERSONNALISÉ en fin de fichier.
if (rememberMeInput && rememberMeInput.checked) {
memoriserVisiteur(identifiants && identifiants.user);
} else {
oublierVisiteur();
}

trackEvent("login");

// Redirection après connexion réussie. On garde le bouton
// désactivé jusqu'au changement de page pour éviter tout
// double clic pendant la navigation.
window.location.href = "dashboard.html";

} catch (error) {

console.error(error);
showFormError(form, getAuthErrorMessage(error));
setButtonLoading(submitButton, false);

}

});

}

// ======================
// Mot de passe oublié — envoie un vrai e-mail de réinitialisation
// Firebase (remplace l'ancienne notice statique "contactez l'assistance").
// ======================

const forgotLink = document.getElementById("forgotPasswordLink");
const forgotNote = document.getElementById("forgotPasswordNote");

if (forgotLink && forgotNote && emailInput) {

forgotLink.addEventListener("click", async (event) => {

event.preventDefault();

const email = emailInput.value.trim().toLowerCase();

if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {

forgotNote.hidden = false;
forgotNote.textContent = "Entrez votre adresse e-mail ci-dessus, puis cliquez à nouveau sur ce lien.";
emailInput.focus();

return;

}

if (forgotLink.dataset.busy === "true") return;
forgotLink.dataset.busy = "true";

const originalText = forgotLink.textContent;
forgotLink.textContent = "Envoi en cours...";

forgotNote.hidden = false;
forgotNote.textContent = "";

try {

await sendPasswordResetEmail(auth, email);

forgotNote.textContent = `Si un compte existe avec l'adresse ${email}, un e-mail de réinitialisation vient d'être envoyé. Vérifiez aussi vos courriers indésirables.`;

} catch (error) {

// Volontairement pas de distinction "compte inexistant" ici (message
// identique au succès) pour ne jamais révéler quelles adresses sont
// enregistrées — sauf pour les erreurs qui ne concernent pas
// l'existence du compte (adresse mal formée, réseau, quota).
if (error.code === "auth/user-not-found") {

forgotNote.textContent = `Si un compte existe avec l'adresse ${email}, un e-mail de réinitialisation vient d'être envoyé. Vérifiez aussi vos courriers indésirables.`;

} else {

console.error(error);
forgotNote.textContent = getAuthErrorMessage(error);

}

} finally {

forgotLink.textContent = originalText;
forgotLink.dataset.busy = "false";

}

});

}

// ==========================================================
// ACCUEIL PERSONNALISÉ (2026-08-22)
// ==========================================================
// « Bon retour parmi nous » s'affichait à TOUT LE MONDE, y compris à
// quelqu'un qui découvrait le site. Une page de connexion qui salue un
// inconnu comme un habitué se trompe sur la personne dès la première
// phrase — et le vrai habitué, lui, ne reçoit rien de particulier.
//
// Le marqueur ci-dessous répare les deux : le message chaleureux est
// rendu à ceux à qui il s'adosse vraiment, et il devient personnel.
//
// CE QU'ON STOCKE, ET POURQUOI SI PEU
// -----------------------------------
// Uniquement le PRÉNOM, et uniquement si « Se souvenir de moi » est
// coché — c'est exactement ce que cette case promet, et ça lui donne
// enfin un effet visible.
//
// Pas l'adresse e-mail : sur un poste partagé (cybercafé, ordinateur
// familial — courant dans le public de Fitz), une adresse
// pré-remplie révèle qui utilise le service à la personne suivante.
// Un prénom seul est bien moins identifiant, et il est effaçable en un
// clic par le bouton « Ce n'est pas vous ? ».
//
// Pas de mot de passe, pas de jeton : la session reste gérée par
// Firebase (setPersistence plus haut). Ce marqueur ne connecte
// personne, il ne fait que choisir une phrase.
// ==========================================================

const CLE_VISITEUR = "sb_visiteur_connu";

const titreEl = document.getElementById("authTitle");
const sousTitreEl = document.getElementById("authSubtext");
const boutonPasVous = document.getElementById("authNotYou");

function lireVisiteur() {
try {
const brut = localStorage.getItem(CLE_VISITEUR);
if (!brut) return null;
const donnees = JSON.parse(brut);
return donnees && typeof donnees.prenom === "string" ? donnees : null;
} catch (error) {
// localStorage indisponible (navigation privée, cookies bloqués) ou
// contenu corrompu : on retombe sur l'accueil neutre, qui est vrai
// pour tout le monde. Jamais l'inverse.
return null;
}
}

function oublierVisiteur() {
try { localStorage.removeItem(CLE_VISITEUR); } catch (error) { /* sans effet */ }
}

function memoriserVisiteur(utilisateur) {
try {
const nomComplet = (utilisateur && utilisateur.displayName ? utilisateur.displayName : "").trim();
const prenom = nomComplet ? nomComplet.split(/\s+/)[0] : "";
localStorage.setItem(CLE_VISITEUR, JSON.stringify({ prenom }));
} catch (error) { /* sans effet */ }
}

function appliquerAccueil() {

if (!titreEl || !sousTitreEl) return;

const visiteur = lireVisiteur();

if (!visiteur) {
// Cas par défaut, déjà écrit dans le HTML : on n'y touche pas.
if (boutonPasVous) boutonPasVous.hidden = true;
return;
}

if (visiteur.prenom) {
titreEl.textContent = `Bon retour, ${visiteur.prenom}`;
sousTitreEl.textContent = "Votre diagnostic et vos candidatures vous attendent.";
if (boutonPasVous) boutonPasVous.hidden = false;
} else {
// Compte connu mais sans nom renseigné : on reste chaleureux sans
// inventer un prénom.
titreEl.textContent = "Bon retour parmi nous";
sousTitreEl.textContent = "Votre diagnostic et vos candidatures vous attendent.";
if (boutonPasVous) boutonPasVous.hidden = false;
}

}

if (boutonPasVous) {
boutonPasVous.addEventListener("click", () => {
oublierVisiteur();
if (titreEl) titreEl.textContent = "Connectez-vous à votre espace";
if (sousTitreEl) sousTitreEl.textContent = "Retrouvez votre diagnostic, vos candidatures et votre accompagnement avec Fitz.";
boutonPasVous.hidden = true;
if (emailInput) emailInput.focus();
});
}

appliquerAccueil();
