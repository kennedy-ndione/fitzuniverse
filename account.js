/**
* ============================================================
* ScholarBridge — Paramètres du compte (account.js)
* ============================================================
* Affichage des informations de compte, changement de mot de passe et
* suppression définitive de compte. La logique sensible (réauth,
* Firebase Auth, cascade Firestore) vit dans js/account-actions.js —
* cette page ne fait que collecter le formulaire et afficher le
* résultat.
* ============================================================
*/

import { initShellChrome, bootstrapShell, PLAN_LABELS } from "./js/app-shell.js";
import { changePassword, deleteAccount } from "./js/account-actions.js";
import { getAuthErrorMessage } from "./auth-ui.js";
import { showToast } from "./js/ai/toast.js";

initShellChrome();

function validatePassword(password) {

if (password.length < 8) return "Votre nouveau mot de passe a besoin d'au moins 8 caractères.";
if (!/[A-Z]/.test(password)) return "Votre nouveau mot de passe a besoin d'au moins une majuscule.";
if (!/[0-9]/.test(password)) return "Votre nouveau mot de passe a besoin d'au moins un chiffre.";

return null;

}

function showInlineError(el, message) {
el.textContent = message;
el.hidden = false;
}

function hideInlineError(el) {
el.hidden = true;
el.textContent = "";
}

bootstrapShell({}).then((ctx) => {

const { user, userData, planId } = ctx;

document.getElementById("accountName").textContent = user.displayName || userData.name || "—";
document.getElementById("accountEmail").textContent = user.email || "—";
document.getElementById("accountPlan").textContent = ctx.testerAccess
? `${PLAN_LABELS[planId]} · Accès test complet`
: PLAN_LABELS[planId];

// ==========================================================
// Changement de mot de passe
// ==========================================================

const passwordForm = document.getElementById("passwordForm");
const passwordError = document.getElementById("passwordFormError");
const passwordSubmitBtn = document.getElementById("passwordSubmitBtn");

passwordForm.addEventListener("submit", async (event) => {

event.preventDefault();
hideInlineError(passwordError);

const currentPassword = document.getElementById("currentPassword").value;
const newPassword = document.getElementById("newPassword").value;
const confirmNewPassword = document.getElementById("confirmNewPassword").value;

const validationError = validatePassword(newPassword);

if (validationError) {
showInlineError(passwordError, validationError);
return;
}

if (newPassword !== confirmNewPassword) {
showInlineError(passwordError, "Vérifiez que les deux mots de passe soient identiques.");
return;
}

passwordSubmitBtn.disabled = true;
passwordSubmitBtn.querySelector("span").textContent = "Mise à jour en cours…";

try {

await changePassword(currentPassword, newPassword);

passwordForm.reset();
showToast("Mot de passe mis à jour avec succès.");

} catch (error) {

console.error(error);
showInlineError(passwordError, getAuthErrorMessage(error));

} finally {

passwordSubmitBtn.disabled = false;
passwordSubmitBtn.querySelector("span").textContent = "Mettre à jour le mot de passe";

}

});

// ==========================================================
// Suppression de compte — confirmation en deux temps (mot de passe
// dans le formulaire + confirmation finale dans une modale), pour
// éviter toute suppression accidentelle.
// ==========================================================

const deleteForm = document.getElementById("deleteAccountForm");
const deleteError = document.getElementById("deleteFormError");
const deleteModal = document.getElementById("deleteConfirmModal");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

let pendingPassword = "";

deleteForm.addEventListener("submit", (event) => {

event.preventDefault();
hideInlineError(deleteError);

pendingPassword = document.getElementById("deletePassword").value;

if (!pendingPassword) {
showInlineError(deleteError, "Merci de saisir votre mot de passe pour confirmer.");
return;
}

deleteModal.hidden = false;

});

cancelDeleteBtn.addEventListener("click", () => {
deleteModal.hidden = true;
});

confirmDeleteBtn.addEventListener("click", async () => {

confirmDeleteBtn.disabled = true;
confirmDeleteBtn.textContent = "Suppression en cours…";

try {

await deleteAccount(pendingPassword);

window.location.replace("index.html");

} catch (error) {

console.error(error);

deleteModal.hidden = true;
showInlineError(deleteError, getAuthErrorMessage(error));

confirmDeleteBtn.disabled = false;
confirmDeleteBtn.textContent = "Oui, supprimer définitivement";

}

});

});
