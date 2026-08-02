import { auth, db } from "../firebase-config.js";

import {
signInWithEmailAndPassword,
signOut
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
doc,
getDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import {
showFormError,
clearFormError,
setButtonLoading,
getAuthErrorMessage
} from "../auth-ui.js";

const form = document.getElementById("adminLoginForm");
const submitButton = form ? form.querySelector("button[type='submit']") : null;

if (form) {

form.addEventListener("submit", async (event) => {

event.preventDefault();
clearFormError(form);

const email = document.getElementById("email").value.trim();
const password = document.getElementById("password").value;

setButtonLoading(submitButton, true, "Connexion...");

try {

const credential = await signInWithEmailAndPassword(auth, email, password);

const adminRef = doc(db, "admins", credential.user.uid);
const adminSnap = await getDoc(adminRef);

if (!adminSnap.exists() || adminSnap.data().isActive !== true) {

// Cohérent avec admin-auth.js (garde des autres pages admin) : on ne
// laisse jamais une session Firebase authentifiée mais non-admin
// ouverte, même sur l'écran de connexion.
await signOut(auth);

showFormError(form, "Vous n'êtes pas autorisé à accéder à l'administration.");
setButtonLoading(submitButton, false);

return;

}

window.location.href = "dashboard.html";

} catch (error) {

console.error(error);
showFormError(form, getAuthErrorMessage(error));
setButtonLoading(submitButton, false);

}

});

}
