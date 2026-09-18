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
import { initShellChrome, bootstrapShell, unlockingPlans, PLAN_LABELS, ESPACE_OUTILS } from "./js/app-shell.js";
import { FITZ_UNLOCK_CTA, unlockPlanPhrase } from "./js/fitz-voice.js";
import { parcoursDOutil } from "./js/parcours.js";
import { themesPour, checklistPour, CADRE_PREINSCRIPTION } from "./js/entretien-questions.js";
import { formaterDate } from "./js/echeance.js";

initShellChrome();

// DEUX ENTRETIENS, DEUX PRÉPARATIONS (lot R12, 2026-09-18). Les thèmes
// et la checklist vivent dans js/entretien-questions.js, avec leurs
// sources officielles ; cette page ne fait que les rendre. L'entretien
// pédagogique de la procédure Études en France n'a rien à voir avec un
// entretien de bourse, et la page servait le second aux candidats du
// premier — depuis l'étape 11 de la route, qui mène ici.
const ech = (v) => String(v == null ? "" : v).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function renderLockedState(container, ctx) {

const flags = ctx.featureFlags.interview_prep;
const target = unlockingPlans(ctx.planId, flags)[0];

container.innerHTML = `
<div class="ai-locked-hero">
<div class="ai-locked-icon"><i data-lucide="lock"></i></div>
<h2>Préparation aux entretiens</h2>
<p>Débloquez la banque de questions et la checklist de préparation avec ${unlockPlanPhrase(target ? PLAN_LABELS[target] : null)} : arrivez à votre entretien déjà prêt(e).</p>
<a href="${target ? `offers.html#${target}` : "offers.html"}" class="btn btn-primary">
<span>${FITZ_UNLOCK_CTA}</span>
</a>
</div>
`;

container.hidden = false;

if (window.lucide) lucide.createIcons();

}

/**
* LE CADRE, en préinscription seulement : qui évalue, ce qui est évalué,
* et QUI LIRA LE COMPTE-RENDU. Ce dernier point ne figurait nulle part,
* et c'est le plus important — l'entretien est une pièce obligatoire du
* dossier de visa, lue par les établissements et par le consulat.
*/
function renderCadre(parcours) {

const bloc = document.getElementById("ivpCadre");
const intro = document.getElementById("ivpIntro");
const titre = document.getElementById("ivpQuestionsTitre");

if (parcours !== "preinscription") {
if (bloc) bloc.hidden = true;
return;
}

if (intro) intro.textContent = "Un conseiller de Campus France vous reçoit pour parler de votre projet. Préparez vos réponses, cochez ce qui est prêt, puis entraînez-vous à voix haute avec Fitz.";

// LA LIGNE QU'ON NE FRANCHIT PAS : les AXES de l'entretien sont
// sourcés, les QUESTIONS sont du matériel d'entraînement. Aucune
// source officielle ne publie la liste des questions posées, et le
// titre doit le dire à l'étudiant plutôt que de le laisser croire.
if (titre) titre.textContent = "Ce sur quoi l'entretien porte, et des questions pour vous y entraîner";

if (!bloc) return;

const c = CADRE_PREINSCRIPTION;
bloc.innerHTML = `<i data-lucide="alert-triangle"></i><span><strong>${ech(c.titre)}.</strong> ${ech(c.texte)} <span class="ivp-source">Vérifié le ${ech(formaterDate(c.verifieLe))} — <a href="${ech(c.sourceResidence)}" target="_blank" rel="noopener noreferrer">l'espace Campus France de votre pays</a> · <a href="${ech(c.source)}" target="_blank" rel="noopener noreferrer">la FAQ Campus France</a>.</span></span>`;
bloc.hidden = false;

}

/** Les thèmes du parcours, rendus dans le conteneur de la page. */
function renderThemes(parcours) {

const hote = document.getElementById("ivpCategories");
if (!hote) return;

hote.innerHTML = themesPour(parcours).map((theme) => `
<div class="ivp-category" data-theme="${ech(theme.id)}">
<button type="button" class="ivp-category-head is-open" data-action="toggle-category">
<span><i data-lucide="${ech(theme.icone)}"></i>${ech(theme.titre)}</span>
<i data-lucide="chevron-down" class="ivp-category-chevron"></i>
</button>
<ul class="ivp-question-list">${theme.questions.map((q) => `
<li>${ech(q)}</li>`).join("")}</ul>
</div>`).join("");

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

function initChecklist(uid, savedState, items) {

const listEl = document.getElementById("ivpChecklistList");
const progressEl = document.getElementById("ivpChecklistProgress");
const state = { ...(savedState || {}) };

function renderProgress() {
const done = items.filter((item) => state[item.id]).length;
progressEl.textContent = `${done}/${items.length} prêts`;
}

listEl.innerHTML = items.map((item) => `
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

bootstrapShell({ feature: "interview_prep", espace: ESPACE_OUTILS }).then((ctx) => {

if (ctx.locked) {

document.getElementById("interviewPrepApp").remove();
renderLockedState(document.getElementById("lockedState"), ctx);
return;

}

// L'ORDRE COMPTE : on rend AVANT de brancher les bascules, parce que
// celles-ci s'attachent bouton par bouton et non par délégation.
const parcours = parcoursDOutil({ espace: ctx.espace });
renderCadre(parcours);
renderThemes(parcours);
initCategoryToggles();
initChecklist(ctx.user.uid, ctx.userData?.interviewPrepChecklist, checklistPour(parcours));
if (window.lucide) lucide.createIcons();

});
