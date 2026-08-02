// -------- auth-ui.js --------
// Petits utilitaires partagés par les formulaires d'authentification
// (login.js, signup.js, admin/login.js) et par les pages qui traduisent
// des erreurs Firebase Auth en messages français (account.js, profile.js).
// Ne fait aucun appel Firebase lui-même — uniquement de la manipulation
// de DOM et une table de correspondance de codes d'erreur.

const AUTH_ERROR_MESSAGES = {
"auth/invalid-email": "Vérifiez le format de votre adresse e-mail.",
"auth/user-disabled": "Ce compte est désactivé — contactez-nous pour en savoir plus.",
"auth/user-not-found": "Cette adresse e-mail n'est associée à aucun compte pour l'instant.",
"auth/wrong-password": "Ce mot de passe ne correspond pas à ce compte.",
"auth/invalid-credential": "L'adresse e-mail ou le mot de passe ne correspond à aucun compte.",
"auth/missing-password": "Merci de saisir votre mot de passe pour continuer.",
"auth/email-already-in-use": "Un compte existe déjà avec cette adresse e-mail — connectez-vous directement.",
"auth/weak-password": "Votre mot de passe a besoin d'au moins 8 caractères.",
"auth/too-many-requests": "Merci de patienter quelques minutes avant de réessayer.",
"auth/network-request-failed": "Vérifiez votre connexion Internet, puis réessayez.",
"auth/requires-recent-login": "Reconnectez-vous pour continuer cette action.",
"auth/popup-closed-by-user": "La fenêtre de connexion a été fermée trop tôt — réessayez quand vous voulez."
};

export function getAuthErrorMessage(error) {
const code = error && error.code;
return AUTH_ERROR_MESSAGES[code] || "Une erreur est survenue. Veuillez réessayer.";
}

// Insère (ou réutilise) un bloc .form-error en tête du formulaire —
// le style (icône, couleur, display:none par défaut) vit dans auth.css.
export function showFormError(form, message) {

if (!form) return;

let errorEl = form.querySelector(".form-error");

if (!errorEl) {
errorEl = document.createElement("div");
errorEl.className = "form-error";
form.insertBefore(errorEl, form.firstChild);
}

errorEl.textContent = message;
errorEl.style.display = "flex";

}

export function clearFormError(form) {

if (!form) return;

const errorEl = form.querySelector(".form-error");

if (errorEl) {
errorEl.style.display = "none";
errorEl.textContent = "";
}

}

// Bascule un bouton de soumission entre son état normal et un état
// "en cours" (désactivé, libellé de chargement) — restaure le libellé
// d'origine à la fin, que le bouton contienne un <span> interne
// (admin/login.html) ou seulement du texte (login.html, signup.html).
export function setButtonLoading(button, isLoading, loadingText) {

if (!button) return;

const label = button.querySelector("span") || button;

if (isLoading) {

if (button.dataset.originalText === undefined) {
button.dataset.originalText = label.textContent;
}

label.textContent = loadingText || "Chargement…";
button.disabled = true;

} else {

if (button.dataset.originalText !== undefined) {
label.textContent = button.dataset.originalText;
}

button.disabled = false;

}

}
