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

await signInWithEmailAndPassword(auth, email, password);

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
