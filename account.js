/**
* ============================================================
* FitzUniverse — Paramètres du compte (account.js)
* ============================================================
* Affichage des informations de compte, changement de mot de passe et
* suppression définitive de compte. La logique sensible (réauth,
* Firebase Auth, cascade Firestore) vit dans js/account-actions.js —
* cette page ne fait que collecter le formulaire et afficher le
* résultat.
* ============================================================
*/

import { initShellChrome, bootstrapShell, PLAN_LABELS } from "./js/app-shell.js";
import { passSeul, PASS_LABEL } from "./js/plan-features.js";
import { changePassword, deleteAccount, setEmailNotifications } from "./js/account-actions.js";
import { getAuthErrorMessage } from "./auth-ui.js";
import { showToast } from "./js/ai/toast.js";

// Section « Mon abonnement » (2026-09-02) : quota utilisé (lecture des
// candidatures), demande de changement en cours (pendingPlan) et son
// annulation. deleteField : retirer proprement pendingPlan du document
// plutôt que d'y laisser un null qui traîne.
import { db } from "./firebase-config.js";
import { doc, updateDoc, deleteField, collection, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

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
// Mon abonnement (2026-09-02) — changer de formule sans friction :
// état actuel + échéance + quota utilisé, demande en cours annulable,
// CTA vers le comparatif. Le choix d'une formule n'écrit jamais
// `plan` (réservé à l'équipe, firestore.rules) : il écrit
// `pendingPlan` (payment.js), affiché ici jusqu'à l'activation.
// ==========================================================

initSubscriptionSection();

async function initSubscriptionSection() {

const planMeta = document.getElementById("subPlanMeta");
const quotaWrap = document.getElementById("subQuotaWrap");
const quotaValue = document.getElementById("subQuotaValue");
const pendingBanner = document.getElementById("subPendingBanner");
const pendingLabel = document.getElementById("subPendingLabel");
const pendingCancelBtn = document.getElementById("subPendingCancelBtn");
const changeBtn = document.getElementById("subChangeBtn");

const plans = window.SCHOLARBRIDGE_PLANS || {};
const plan = plans[planId];

// Ligne d'état sous la formule : échéance quand elle existe, situation
// claire pour la formule gratuite.
const formatDateFR = (iso) => {
const d = new Date(iso);
return isNaN(d) ? iso : d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
};

if (passSeul(ctx)) {
// Lot ACCEPTATION, partie 4 : un Pass seul n'est pas « Gratuit ».
document.getElementById("accountPlan").textContent = PASS_LABEL;
planMeta.textContent = `${PASS_LABEL} — actif jusqu'au ${formatDateFR(userData.fitzExpressExpiresAt)} : vos questions à Fitz`;
planMeta.hidden = false;
changeBtn.querySelector("span").textContent = "Choisir ma formule";
} else if (planId === "gratuit") {
planMeta.textContent = "Les outils Fitz et le suivi de candidatures s'ouvrent avec une formule payante.";
planMeta.hidden = false;
changeBtn.querySelector("span").textContent = "Choisir ma formule";
} else if (userData.planExpiresAt) {
const expired = new Date(userData.planExpiresAt).getTime() < Date.now();
planMeta.textContent = expired
? `Expirée le ${formatDateFR(userData.planExpiresAt)} — choisissez une formule pour reprendre votre accompagnement.`
: `Active jusqu'au ${formatDateFR(userData.planExpiresAt)}.`;
planMeta.hidden = false;
} else if (plan && plan.duration) {
planMeta.textContent = `Accompagnement de ${plan.duration}.`;
planMeta.hidden = false;
} else if (plan && plan.parcours === "bourse") {
// Lot ACCEPTATION, partie 5 : plus de durée en mois — une formule
// bourses se définit par son nombre de candidatures.
planMeta.textContent = "Sans échéance : chaque candidature est suivie jusqu'à la décision de l'université.";
planMeta.hidden = false;
}

// Quota de candidatures accompagnées — mesuré sur les vraies données.
// Lecture bornée par le quota lui-même (petite sous-collection).
const quota = plan ? plan.maxAccompaniedApplications : null;

if (quota && (Number.isFinite(quota) || quota === Infinity)) {

try {

const appsSnap = await getDocs(collection(db, "users", user.uid, "applications"));
quotaValue.textContent = Number.isFinite(quota)
? `${appsSnap.size} / ${quota} utilisée${appsSnap.size > 1 ? "s" : ""}`
: `${appsSnap.size} · illimitées`;
quotaWrap.hidden = false;

} catch (error) {
console.error("Quota de candidatures illisible :", error);
}

}

// Demande de changement en cours. Cas particulier : la demande
// correspond à la formule DÉJÀ active (l'équipe a activé sans que le
// champ soit nettoyé) — on l'efface silencieusement, il n'y a plus
// rien « en cours ».
const pending = userData.pendingPlan;

async function clearPending() {
await updateDoc(doc(db, "users", user.uid), {
pendingPlan: deleteField(),
pendingPlanRequestedAt: deleteField()
});
}

if (pending && pending === planId) {
clearPending().catch(() => { /* nettoyage best-effort */ });
} else if (pending) {

const requestedAt = userData.pendingPlanRequestedAt && typeof userData.pendingPlanRequestedAt.toDate === "function"
? ` (demandée le ${userData.pendingPlanRequestedAt.toDate().toLocaleDateString("fr-FR", { day: "numeric", month: "long" })})`
: "";

const pendingName = PLAN_LABELS[pending] || (plans[pending] && plans[pending].label) || pending;
pendingLabel.textContent = pending === "fitzExpress"
? `Activation du ${pendingName} en cours${requestedAt}.`
: `Passage à la formule ${pendingName} en cours d'activation${requestedAt}.`;
pendingBanner.hidden = false;

pendingCancelBtn.addEventListener("click", async () => {

pendingCancelBtn.disabled = true;

try {
await clearPending();
pendingBanner.hidden = true;
showToast("Demande de changement annulée — votre formule actuelle continue normalement.");
} catch (error) {
console.error(error);
pendingCancelBtn.disabled = false;
showToast("L'annulation n'a pas abouti. Réessayez dans un instant.", { type: "error" });
}

});

}

}

// ==========================================================
// Alertes d'ouverture de bourses (2026-09-21)
// ==========================================================
//
// Le consentement coché à l'inscription — et celui que la page de
// désinscription promet de pouvoir « réactiver depuis votre espace ».
// Mêmes champs, mêmes noms que inscription.js et que la fonction
// desabonnementAlertes : `alerteBourses` (booléen) et sa date de mise à
// jour. C'est ce champ, et lui seul, que lit envoyerAlerteBourse
// (functions/emails.js : .where("alerteBourses", "==", true)).

const alerteToggle = document.getElementById("alerteBoursesToggle");
const alerteStatus = document.getElementById("alerteBoursesStatus");

if (alerteToggle) {

alerteToggle.checked = ctx.userData.alerteBourses === true;

alerteToggle.addEventListener("change", async () => {

const active = alerteToggle.checked;

alerteToggle.disabled = true;

try {

await updateDoc(doc(db, "users", user.uid), {
alerteBourses: active,
alerteBoursesMajLe: serverTimestamp()
});

alerteStatus.textContent = active
? "Alertes activées : vous serez prévenu dès qu'une bourse ouvre ses candidatures."
: "Alertes désactivées : vous ne recevrez plus d'e-mail d'ouverture de bourse.";

showToast(active ? "Alertes de bourses activées." : "Alertes de bourses désactivées.");

} catch (error) {

console.error(error);
alerteToggle.checked = !active;
alerteStatus.textContent = "Un souci est survenu — réessayez dans un instant.";

} finally {

alerteToggle.disabled = false;

}

});

}

// ==========================================================
// Notifications e-mail
// ==========================================================
// LOT 112 (2026-09-26) — LES RAPPELS DE DATES LIMITES
// ==========================================================
// Le lot 111 envoie les rappels chaque matin (functions/emails.js,
// rappelsEcheances) à tout compte dont `rappelsEcheances` n'est pas
// false. Le lien du pied de chaque rappel écrit false ; jusqu'ici, rien
// ne permettait de revenir en arrière. La case lit la même règle que
// l'envoi : coché sauf false.

const rappelsToggle = document.getElementById("rappelsEcheancesToggle");
const rappelsStatus = document.getElementById("rappelsEcheancesStatus");

if (rappelsToggle) {

rappelsToggle.checked = ctx.userData.rappelsEcheances !== false;

rappelsToggle.addEventListener("change", async () => {

const active = rappelsToggle.checked;

rappelsToggle.disabled = true;

try {

await updateDoc(doc(db, "users", user.uid), {
rappelsEcheances: active,
rappelsEcheancesMajLe: serverTimestamp()
});

rappelsStatus.textContent = active
? "Rappels activés : vous recevrez un e-mail avant chaque date limite de vos candidatures datées."
: "Rappels désactivés : vos échéances restent affichées dans votre espace, sans e-mail.";

showToast(active ? "Rappels de dates limites activés." : "Rappels de dates limites désactivés.");

} catch (error) {

console.error(error);
rappelsToggle.checked = !active;
rappelsStatus.textContent = "Un souci est survenu — réessayez dans un instant.";

} finally {

rappelsToggle.disabled = false;

}

});

}

// ==========================================================

const emailToggle = document.getElementById("emailNotificationsToggle");
const emailStatus = document.getElementById("emailNotificationsStatus");

emailToggle.checked = ctx.userData.emailNotifications === true;

emailToggle.addEventListener("change", async () => {

const enabled = emailToggle.checked;

emailToggle.disabled = true;

try {

await setEmailNotifications(user.uid, enabled);

emailStatus.textContent = enabled
? "Notifications e-mail activées."
: "Notifications e-mail désactivées.";

showToast(enabled ? "Notifications e-mail activées." : "Notifications e-mail désactivées.");

} catch (error) {

console.error(error);
emailToggle.checked = !enabled;
emailStatus.textContent = "Un souci est survenu — réessayez dans un instant.";

} finally {

emailToggle.disabled = false;

}

});

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
