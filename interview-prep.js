// -------- interview-prep.js --------
// Préparation aux entretiens : contenu statique (banque de questions)
// + une checklist de préparation, réellement persistée (users/{uid}.
// interviewPrepChecklist, map id -> bool) plutôt qu'un simple état
// local perdu au rechargement — même exigence que le reste du site
// (aucune fonctionnalité "pour de faux").
//
// Volontairement PAS lié à applications.js : cette checklist est
// générique (une seule fois par étudiant, pas par candidature), à la
// différence du "Dossier de candidature" par candidature. Mélanger les
// deux aurait forcé l'étudiant à cocher les mêmes cases sur chaque
// candidature suivie pour rien.

import { db } from "./firebase-config.js";
import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { trackEvent } from "./js/analytics.js";
import { initShellChrome, bootstrapShell, unlockingPlans, PLAN_LABELS } from "./js/app-shell.js";
import { FITZ_UNLOCK_CTA, unlockPlanPhrase } from "./js/fitz-voice.js";

initShellChrome();

const CHECKLIST_ITEMS = [
{ id: "reread_letter", label: "Relire ma lettre de motivation — on m'interrogera probablement dessus." },
{ id: "concrete_examples", label: "Préparer 2-3 exemples concrets illustrant mes compétences et mon parcours." },
{ id: "why_university", label: "Rechercher le programme, le département et pourquoi cette université en particulier." },
{ id: "questions_to_ask", label: "Préparer 2-3 questions précises à poser en fin d'entretien." },
{ id: "tech_check", label: "Tester ma connexion, mon micro et ma caméra si l'entretien a lieu en visioconférence." },
{ id: "outfit", label: "Préparer une tenue adaptée au format de l'entretien." },
{ id: "practice_aloud", label: "M'entraîner à voix haute sur au moins 5 questions (seul(e) ou avec Fitz)." }
];

function renderLockedState(container, ctx) {

const flags = ctx.featureFlags.interview_prep;
const target = unlockingPlans(ctx.planId, flags)[0];

container.innerHTML = `
<div class="ai-locked-hero">
<div class="ai-locked-icon"><i data-lucide="lock"></i></div>
<h2>Préparation aux entretiens</h2>
<p>Débloquez la banque de questions et la checklist de préparation avec ${unlockPlanPhrase(target ? PLAN_LABELS[target] : null)} : arrivez à votre entretien de bourse déjà prêt(e).</p>
<a href="${target ? `offers.html#${target}` : "offers.html"}" class="btn btn-primary">
<i data-lucide="sparkles"></i>
<span>${FITZ_UNLOCK_CTA}</span>
</a>
</div>
`;

container.hidden = false;

if (window.lucide) lucide.createIcons();

}

function initCategoryToggles() {

document.querySelectorAll('[data-action="toggle-category"]').forEach((btn) => {

const list = btn.closest(".ivp-category").querySelector(".ivp-question-list");

btn.addEventListener("click", () => {
const isOpen = btn.classList.toggle("is-open");
list.hidden = !isOpen;
});

});

}

function initChecklist(uid, savedState) {

const listEl = document.getElementById("ivpChecklistList");
const progressEl = document.getElementById("ivpChecklistProgress");
const state = { ...(savedState || {}) };

function renderProgress() {
const done = CHECKLIST_ITEMS.filter((item) => state[item.id]).length;
progressEl.textContent = `${done}/${CHECKLIST_ITEMS.length} prêts`;
}

listEl.innerHTML = CHECKLIST_ITEMS.map((item) => `
<li class="ivp-checklist-item">
<label>
<input type="checkbox" data-item-id="${item.id}" ${state[item.id] ? "checked" : ""}>
<span>${item.label}</span>
</label>
</li>
`).join("");

listEl.querySelectorAll("input[type=checkbox]").forEach((checkbox) => {

checkbox.addEventListener("change", async () => {

const itemId = checkbox.dataset.itemId;
state[itemId] = checkbox.checked;
renderProgress();

try {
await updateDoc(doc(db, "users", uid), {
[`interviewPrepChecklist.${itemId}`]: checkbox.checked
});
trackEvent("interview_prep_checklist_toggled", { itemId, checked: checkbox.checked });
} catch (error) {
console.error("Impossible d'enregistrer la case cochée :", error);
}

});

});

renderProgress();

}

bootstrapShell({ feature: "interview_prep" }).then((ctx) => {

if (ctx.locked) {

document.getElementById("interviewPrepApp").remove();
renderLockedState(document.getElementById("lockedState"), ctx);
return;

}

initCategoryToggles();
initChecklist(ctx.user.uid, ctx.userData?.interviewPrepChecklist);

});
