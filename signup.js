import { auth, db } from "./firebase-config.js";
import {
createUserWithEmailAndPassword,
updateProfile
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
doc,
setDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import {
showFormError,
clearFormError,
setButtonLoading,
getAuthErrorMessage
} from "./auth-ui.js";

import { trackEvent } from "./js/analytics.js";

const form = document.getElementById("signupForm");

const nameInput = document.getElementById("signupName");
const emailInput = document.getElementById("signupEmail");
const passwordInput = document.getElementById("signupPassword");
const confirmPasswordInput = document.getElementById("signupConfirmPassword");
const termsInput = document.getElementById("terms");
const submitButton = form.querySelector("button[type='submit']");

// Construit le document Firestore par défaut d'un nouvel utilisateur.
function buildDefaultUserDoc(uid, name, email) {
return {
uid,
name,
email,
createdAt: serverTimestamp(),
profile: {
originCountry: "",
age: "",
currentDegree: "",
academicAverage: "",
englishLevel: "",
desiredField: "",
desiredCountry: ""
}
};
}

form.addEventListener("submit", async (event) => {

event.preventDefault();
clearFormError(form);

const name = nameInput.value.trim();
const email = emailInput.value.trim().toLowerCase();
const password = passwordInput.value;
const confirmPassword = confirmPasswordInput.value;

if (!name || !email || !password || !confirmPassword) {
showFormError(form, "Merci de remplir tous les champs pour continuer.");
return;
}

if (name.length < 2) {
showFormError(form, "Merci d'indiquer votre nom complet.");
nameInput.focus();
return;
}

if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
showFormError(form, "Vérifiez le format de votre adresse e-mail.");
emailInput.focus();
return;
}

if (password.length < 8) {
showFormError(form, "Votre mot de passe a besoin d'au moins 8 caractères.");
passwordInput.focus();
return;
}

if (!/[A-Z]/.test(password)) {
showFormError(form, "Votre mot de passe a besoin d'au moins une majuscule.");
passwordInput.focus();
return;
}

if (!/[0-9]/.test(password)) {
showFormError(form, "Votre mot de passe a besoin d'au moins un chiffre.");
passwordInput.focus();
return;
}

if (password !== confirmPassword) {
showFormError(form, "Vérifiez que les deux mots de passe soient identiques.");
confirmPasswordInput.focus();
return;
}

if (termsInput && !termsInput.checked) {
showFormError(form, "Merci d'accepter les conditions d'utilisation pour continuer.");
return;
}

setButtonLoading(submitButton, true, "Création du compte...");

let createdUser = null;

try {

const userCredential = await createUserWithEmailAndPassword(
auth,
email,
password
);

createdUser = userCredential.user;

await updateProfile(createdUser, {
displayName: name
});

try {

await setDoc(
doc(db, "users", createdUser.uid),
buildDefaultUserDoc(createdUser.uid, name, email)
);

} catch (firestoreError) {

// Le compte Auth existe déjà : on ne bloque pas l'utilisateur,
// mais on journalise l'échec. dashboard.js recréera le document
// Firestore manquant au prochain chargement (voir onAuthStateChanged).
console.error("Échec de création du profil Firestore :", firestoreError);

}

trackEvent("signup");

sessionStorage.setItem("just_created", "true");

window.location.href = "dashboard.html";

} catch (error) {

console.error(error);
showFormError(form, getAuthErrorMessage(error));
setButtonLoading(submitButton, false);

}

});
