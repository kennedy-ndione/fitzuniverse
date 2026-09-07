// -------- applications.js --------
// Suivi de candidatures : entièrement réel (Firestore, pas de
// simulation) pour la partie in-app — statuts, dates, export .ics de
// rappel téléchargeable côté client. La seule pièce non construite ici
// est l'ENVOI D'E-MAIL de rappel, qui nécessite un backend qui n'existe
// pas encore sur ce projet (Firebase doit passer en formule Blaze, et
// un service d'envoi d'e-mails doit être configuré — même blocage que
// le reste du backend, voir payment.js).
//
// Architecture prévue pour cette pièce manquante, à implémenter plus
// tard sans changer ce fichier : une Cloud Function planifiée
// (ex. tous les jours à 8h) qui interroge, pour chaque utilisateur, les
// documents users/{uid}/applications où nextCheckDate <= aujourd'hui,
// et envoie un e-mail récapitulatif via le service configuré. Aucun
// champ supplémentaire n'est nécessaire côté client : nextCheckDate
// (déjà écrit ici à chaque ajout et à chaque "J'ai vérifié") est tout
// ce dont cette fonction aurait besoin.

import { db } from "./firebase-config.js";

import {
collection,
setDoc,
updateDoc,
deleteDoc,
doc,
getDocs,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import { trackEvent } from "./js/analytics.js";
import { initShellChrome, bootstrapShell, unlockingPlans, isFeatureLocked, PLAN_LABELS } from "./js/app-shell.js";
import { isQuotaReached, PLAN_PREINSCRIPTION_LABELS } from "./js/plan-features.js";
// DEUX MOTEURS, DEUX USAGES — et c'est voulu (passe 2/3, 2026-09-06) :
//
//   retenirOpportunites  ce que Fitz PROPOSE de lui-même (créneaux
//                        pré-remplis, remplacement d'une suggestion).
//                        Cinq filtres : jamais un cycle clos, jamais un
//                        mauvais niveau. La même sélection que le
//                        diagnostic gratuit.
//   recommendPrograms    ce que l'étudiant CHERCHE dans le sélecteur.
//                        Le catalogue entier, classé. Il a le droit de
//                        chercher n'importe quoi — la passe 1 y a mis
//                        l'état honnête et écarté les closes des seules
//                        suggestions.
import { recommendPrograms, retenirOpportunites } from "./js/recommend-programs.js";
import { FITZ_UNLOCK_CTA, unlockPlanPhrase, FITZ_READINESS_PHRASES } from "./js/fitz-voice.js";
import { generate, messageErreurFitz, estArret } from "./js/ai/ai-client.js";
import { calculateAiScore } from "./js/profile-score.js";
import { showToast } from "./js/ai/toast.js";
import { computeJourneySteps } from "./js/application-journey.js";
// Créneaux anti-triche "slot-N" — voir l'en-tête de ce module.
import { slotIdLibre } from "./js/application-actions.js";
import { qualifierEtapes, avertissementsPrematures, LIBELLE_PREREQUIS } from "./js/next-action.js";
// escapeHtml : ces trois chaînes sont des constantes du code, pas de la
// saisie étudiante — mais elles traversent innerHTML, et une constante
// d'aujourd'hui devient un libellé configurable demain.
import { escapeHtml } from "./js/ai/format.js";

// Chargeur de catalogue partagé et mémoïsé — voir js/catalog-data.js.
import { chargerCatalogue } from "./js/catalog-data.js";

// Passe espace étudiant 1/3 (2026-09-06) : une candidature est RELIÉE à
// sa fiche du catalogue (clé `scholarshipId` / `programId`, ou
// rapprochement exact des titres) et affiche l'état que la fiche
// publie — etatCandidature(), la seule autorité. La date saisie par
// l'étudiant n'est JAMAIS écrasée : une divergence s'affiche, avec un
// bouton qu'il clique lui-même.
import { indexerCatalogue, lierCandidature, etatDeLaCandidature, normaliserTitre } from "./js/candidature-catalogue.js";
import { formaterDate } from "./js/echeance.js";
// Passe 3/3 : `exigences` (99 bourses) trouve enfin un destinataire.
// Vocabulaire et libellés dans js/exigences.js — jamais deux façons de
// dire la même exigence.
import { lireExigences, groupees, elementsAAjouter } from "./js/exigences.js";
// Lot A (2026-09-07) : le parcours porté par la candidature — bourse ou
// préinscription. Lu avec défaut « bourse », jamais rattrapé en base.
import { lireParcours, LIBELLES as LIBELLES_PARCOURS } from "./js/parcours.js";
// Lot E1 (2026-09-07) : la preuve de dépôt — une déclaration structurée,
// jamais une vérification. firestore.rules fait foi.
import { lirePreuve, preuveValide, libelleDemande, resumePreuve, cheminCapture, TAILLE_MAX_FICHIER, TYPES_FICHIER } from "./js/preuve-depot.js";
import { deposeParUnTiers } from "./js/exigences.js";
import { STATUTS_DEPOSES } from "./js/journey-map.js";
import { compressImageToTarget } from "./js/compression-image.js";
import { storage } from "./firebase-config.js";
import { ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-storage.js";

initShellChrome();

// ==========================================================
// LE CATALOGUE, INDEXÉ UNE FOIS PAR PAGE (0 lecture Firestore :
// chargerCatalogue() sert l'instantané statique). Toutes les lectures
// d'état de cette page passent par cet index.
// ==========================================================
let promesseIndex = null;

function indexDuCatalogue() {
if (!promesseIndex) {
promesseIndex = chargerCatalogue()
.then((catalogue) => indexerCatalogue(catalogue))
.catch((error) => {
console.warn("Catalogue indisponible : les candidatures s'affichent sans leur état du catalogue.", error);
promesseIndex = null;
return null;
});
}
return promesseIndex;
}

// La ligne d'échéance d'une carte. Candidature liée : l'état publié par
// la fiche, puis la date propre de l'étudiant si elle diffère.
// Candidature non liée : rendu d'origine, strictement inchangé.
function renderEcheanceCandidature(app, lecture) {

if (!lecture || !lecture.lie || !lecture.etat) {
return app.deadline ? `<span><i data-lucide="calendar"></i>Date limite : ${formatDateFR(app.deadline)}</span>` : "";
}

const etat = lecture.etat;
const dateDiffere = app.deadline && lecture.dateCatalogue !== app.deadline;

return `
<span class="app-echeance is-${etat.ton}">
<i data-lucide="calendar"></i>
<span>${escapeHtml(etat.etiquette)} : ${escapeHtml(etat.valeur)}</span>
${etat.detail ? `<span class="app-echeance-detail">${escapeHtml(etat.detail)}</span>` : ""}
${etat.verifie ? `<span class="app-echeance-verifie">${escapeHtml(etat.verifie)}</span>` : ""}
${dateDiffere ? `<span class="app-echeance-votre">Votre date : ${escapeHtml(formatDateFR(app.deadline) || app.deadline)}</span>` : ""}
</span>`;

}

// Le bloc de divergence — constat, jamais écriture. Le bouton n'existe
// que lorsqu'une date ferme du catalogue peut être reprise, et seul son
// clic écrit (voir le gestionnaire dans renderCard).
function renderDivergence(app, lecture, { bouton = true } = {}) {

const d = lecture && lecture.divergence;

if (!d) return "";

return `
<div class="app-echeance-alerte" role="status">
<i data-lucide="alert-triangle"></i>
<p>${escapeHtml(d.message)}</p>
${bouton && d.dateCatalogue ? `<button type="button" class="app-echeance-reprendre" data-reprendre-date="${escapeHtml(app.id)}" data-date="${escapeHtml(d.dateCatalogue)}"><i data-lucide="calendar-check"></i><span>Reprendre le ${escapeHtml(formaterDate(d.dateCatalogue))}</span></button>` : ""}
</div>`;

}

// Depuis le 2026-08-30, l'issue d'une réponse est modélisée (admise /
// refusée / liste d'attente) : c'est ce qui permet au parcours de
// féliciter, d'orienter vers le visa ou de proposer un rebond.
// `reponse_recue` reste accepté (candidatures existantes) et signifie
// « réponse reçue, issue pas encore précisée ».
const STATUS_LABELS = {
a_preparer: "À préparer",
en_cours: "En préparation",
deposee: "Déposée",
en_attente: "En attente de réponse",
reponse_recue: "Réponse reçue (à préciser)",
admise: "Admise",
liste_attente: "Liste d'attente",
refusee: "Refusée"
};

const STATUS_ORDER = ["a_preparer", "en_cours", "deposee", "en_attente", "reponse_recue", "liste_attente", "admise", "refusee"];

// ==========================================================
// DOSSIER DE CANDIDATURE — checklist par candidature (lettres de
// recommandation, test de langue, preuve financière). Une seule
// structure générique (champ `checklist`, array sur le document
// application) réutilisée pour les 3 types plutôt qu'un champ dédié
// par fonctionnalité : le score de complétude et les repères de
// calibration se calculent directement dessus, sans structure
// supplémentaire. Statut à 3 valeurs partagé par tous les types
// (manquant/en_cours/complete) — seul le libellé affiché change selon
// le type (CHECKLIST_TYPE_META.statusLabels), pour rester lisible
// ("Non demandée" a plus de sens que "Manquant" pour une lettre) sans
// dupliquer la logique d'état.
const CHECKLIST_STATUS_ORDER = ["manquant", "en_cours", "complete"];

const CHECKLIST_TYPE_META = {
recommendation: {
title: "Lettres de recommandation",
icon: "mail-check",
addLabel: "Demander une lettre",
statusLabels: { manquant: "Non demandée", en_cours: "Demandée", complete: "Reçue" }
},
language_test: {
title: "Test de langue",
icon: "languages",
addLabel: "Ajouter un test de langue",
statusLabels: { manquant: "Non planifié", en_cours: "Planifié", complete: "Passé" }
},
financial_proof: {
title: "Preuve financière",
icon: "banknote",
addLabel: "Ajouter une preuve financière",
statusLabels: { manquant: "Manquant", en_cours: "En préparation", complete: "Prêt" }
}
};

function makeChecklistItemId() {
if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
return `cl_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function nextChecklistStatus(status) {
const idx = CHECKLIST_STATUS_ORDER.indexOf(status);
return CHECKLIST_STATUS_ORDER[(idx + 1) % CHECKLIST_STATUS_ORDER.length];
}

function checklistScore(checklist) {
const items = Array.isArray(checklist) ? checklist : [];
return { completed: items.filter((i) => i.status === "complete").length, total: items.length };
}

// Repère de calibration (fonctionnalité 3) : compare deux valeurs
// saisies par l'étudiant lui-même sur CE test de langue (seuil requis
// par la bourse visée, score obtenu) — pas une comparaison contre le
// profil général, qui ne contient qu'un niveau qualitatif
// (débutant/avancé...), non comparable à un score TOEFL/IELTS chiffré.
function calibrationForItem(item) {
if (item.type !== "language_test") return null;
const required = parseFloat(item.meta?.scoreRequired);
const obtained = parseFloat(item.meta?.scoreObtained);
if (!Number.isFinite(required) || !Number.isFinite(obtained)) return null;
return obtained >= required
? { ok: true, text: "Dans la fourchette attendue" }
: { ok: false, text: "En dessous du seuil habituel" };
}

function checklistItemMetaLine(item) {
if (item.type === "language_test") {
const parts = [];
if (item.meta?.testName) parts.push(item.meta.testName);
if (item.meta?.testDate) parts.push(formatDateFR(item.meta.testDate));
if (item.meta?.scoreRequired) parts.push(`Seuil requis : ${item.meta.scoreRequired}`);
if (item.meta?.scoreObtained) parts.push(`Obtenu : ${item.meta.scoreObtained}`);
return parts.join(" · ");
}
if (item.type === "financial_proof") {
return [item.meta?.amountRequired, item.meta?.formatRequired].filter(Boolean).join(" · ");
}
if (item.type === "recommendation" && item.meta?.recommenderContact) {
return item.meta.recommenderContact;
}
return "";
}

function renderChecklistItem(item) {

const typeMeta = CHECKLIST_TYPE_META[item.type];
const statusLabel = typeMeta.statusLabels[item.status] || item.status;
const calibration = calibrationForItem(item);
const metaLine = checklistItemMetaLine(item);

return `
<li class="checklist-item" data-item-id="${item.id}">
<button type="button" class="checklist-status-chip checklist-status-${item.status}" data-action="cycle">${statusLabel}</button>
<div class="checklist-item-body">
<strong>${item.label}</strong>
${metaLine ? `<span class="checklist-item-meta">${metaLine}</span>` : ""}
${calibration ? `<span class="checklist-calibration ${calibration.ok ? "is-ok" : "is-warning"}"><i data-lucide="${calibration.ok ? "check-circle" : "alert-triangle"}"></i>${calibration.text}</span>` : ""}
</div>
<button type="button" class="checklist-item-remove" data-action="remove" aria-label="Supprimer cet élément"><i data-lucide="x"></i></button>
</li>`;

}

// ==========================================================
// CE QUE LA BOURSE EXIGE (passe espace étudiant 3/3, 2026-09-06)
// ==========================================================
// `exigences` était renseigné sur 99 bourses et lu par personne. Le
// vocabulaire et les libellés vivent dans js/exigences.js — un seul
// endroit, pour que la fiche publique et l'espace disent la même chose.
//
// RÈGLE DES TROIS VALEURS : une bourse sans le champ (57 sur 156)
// n'affiche RIEN. Pas de bloc vide, pas de « aucune exigence » — une
// bourse dont personne n'a relevé les exigences n'est pas une bourse
// sans exigences.

/**
* Le bloc le plus utile de cette passe : sur 27 bourses, l'étudiant NE
* DÉPOSE PAS son dossier lui-même. Sans cette phrase, il peut surveiller
* pendant des mois l'ouverture d'un portail qui ne le concerne pas.
*
* Ton informatif, jamais alarmant : ce n'est pas une mauvaise nouvelle,
* c'est une démarche différente — et savoir laquelle fait gagner du
* temps.
*/
function renderExigences(lecture) {

if (!lecture || !lecture.lie || !lecture.bourse) return "";

const codes = lireExigences(lecture.bourse);

if (!codes.length) return "";

const g = groupees(codes);

const voie = g.voie.length
? `
<div class="app-exigence-voie">
<i data-lucide="users"></i>
<div>
<strong>Vous ne déposez pas ce dossier vous-même.</strong>
${g.voie.map((e) => `<p>${escapeHtml(e.explication)}</p>`).join("")}
</div>
</div>`
: "";

const ordre = g.ordre.length
? `
<p class="app-exigence-ordre">
<i data-lucide="arrow-right-circle"></i>
<span>${escapeHtml(g.ordre[0].explication)}</span>
</p>`
: "";

// Conditions et pièces : une liste sobre. Ce ne sont pas des cases à
// cocher — traiter une condition d'éligibilité comme une tâche
// laisserait croire qu'on peut la « faire ».
const reste = [...g.condition, ...g.piece];

const liste = reste.length
? `
<div class="app-exigence-liste">
<span class="app-exigence-titre">Ce que cette bourse exige</span>
<ul>
${reste.map((e) => `<li><strong>${escapeHtml(e.libelle)}</strong><span>${escapeHtml(e.explication)}</span></li>`).join("")}
</ul>
</div>`
: "";

if (!voie && !ordre && !liste) return "";

return `<div class="app-exigences">${voie}${ordre}${liste}</div>`;

}

/**
* La suggestion de dossier — SUGGÉRER, JAMAIS ÉCRIRE.
*
* Même doctrine que la date limite de la passe 1 : le dossier appartient
* à l'étudiant. On dit ce que la bourse demande, et c'est SON clic qui
* écrit. Le bouton ne propose que ce qui manque, et disparaît quand il
* n'y a plus rien à ajouter.
*/
function renderSuggestionDossier(app, lecture) {

if (!lecture || !lecture.lie || !lecture.bourse) return "";

const aAjouter = elementsAAjouter(lireExigences(lecture.bourse), app.checklist);

if (!aAjouter.length) return "";

const noms = aAjouter.map((e) => e.label.toLowerCase()).join(", ");

return `
<div class="app-exigence-suggestion">
<i data-lucide="list-plus"></i>
<p>Cette bourse demande : ${escapeHtml(noms)}.</p>
<button type="button" class="app-exigence-ajouter" data-ajouter-dossier="${escapeHtml(app.id)}">
<i data-lucide="plus"></i><span>Ajouter à mon dossier</span>
</button>
</div>`;

}

function renderChecklistSection(app, lecture) {

const checklist = Array.isArray(app.checklist) ? app.checklist : [];
const { completed, total } = checklistScore(checklist);
const suggestion = renderSuggestionDossier(app, lecture);

const groups = Object.keys(CHECKLIST_TYPE_META).map((type) => {

const typeMeta = CHECKLIST_TYPE_META[type];
const items = checklist.filter((i) => i.type === type);

return `
<div class="checklist-group">
<div class="checklist-group-head">
<span><i data-lucide="${typeMeta.icon}"></i>${typeMeta.title}</span>
<button type="button" class="checklist-add-btn" data-action="add" data-type="${type}"><i data-lucide="plus"></i><span>${typeMeta.addLabel}</span></button>
</div>
${items.length ? `<ul class="checklist-items">${items.map(renderChecklistItem).join("")}</ul>` : `<p class="checklist-group-empty">Rien pour l'instant.</p>`}
${type === "recommendation" ? `<button type="button" class="checklist-guide-link" data-action="guide"><i data-lucide="book-open"></i><span>Guide : qui solliciter et comment</span></button>` : ""}
</div>`;

}).join("");

return `
<div class="app-checklist">
<button type="button" class="app-checklist-toggle" data-action="toggle-checklist">
<span><i data-lucide="clipboard-list"></i>Dossier de candidature</span>
${total > 0
? `<span class="app-checklist-score">${completed}/${total} complété${completed > 1 ? "s" : ""}</span>`
// L'état vide disait « Ajouter les exigences de cette bourse » sans
// jamais dire LESQUELLES. Quand le catalogue les connaît, la
// suggestion ci-dessous les nomme — l'invite générique n'a plus lieu
// d'être.
: suggestion
? `<span class="app-checklist-score is-empty">Fitz connaît les exigences de cette bourse</span>`
: `<span class="app-checklist-score is-empty">Ajouter les exigences de cette bourse</span>`}
<i data-lucide="chevron-down" class="app-checklist-chevron"></i>
</button>
<div class="checklist-groups" hidden>
${suggestion}
${groups}
<a href="documents.html" class="checklist-guide-link"><i data-lucide="library"></i><span>Voir la bibliothèque de documents (passeport, diplôme, CV...)</span></a>
</div>
</div>`;

}

// ==========================================================
// VÉRIFICATION FINALE AVANT DÉPÔT (Fitz) — panneau persisté sur
// `fitzReadiness` (voir runReadinessCheck). Réutilise le langage
// visuel .ai-checklist-item (css/ai-suite.css, déjà établi par
// ai-check.js) plutôt qu'un nouveau composant ; les textes viennent
// tous de js/fitz-voice.js, jamais codés en dur ici.
// ==========================================================

function formatDateTimeFR(timestamp) {
if (!timestamp || typeof timestamp.toDate !== "function") return "à l'instant";
return timestamp.toDate().toLocaleString("fr-FR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
}

function deadlineNote(daysLeft) {
if (daysLeft === null || daysLeft === undefined) return "";
if (daysLeft < 0) return FITZ_READINESS_PHRASES.deadlinePassed(daysLeft);
if (daysLeft === 0) return FITZ_READINESS_PHRASES.deadlineToday;
return FITZ_READINESS_PHRASES.deadlineSoon(daysLeft);
}

function renderReadinessItem(item) {

if (item.actionHref) {
return `
<a href="${item.actionHref}" class="ai-checklist-item app-readiness-item">
<i data-lucide="arrow-right-circle"></i>
<span>${item.text}</span>
</a>`;
}

return `
<button type="button" class="ai-checklist-item app-readiness-item" data-action="focus-checklist">
<i data-lucide="arrow-right-circle"></i>
<span>${item.text}</span>
</button>`;

}

function renderReadinessPanel(app, advisorUnlocked) {

const result = app.fitzReadiness;

if (!result) return `<div class="app-readiness" hidden></div>`;

const note = deadlineNote(result.daysLeft);

return `
<div class="app-readiness ${result.ready ? "is-ready" : "is-not-ready"}">
<div class="app-readiness-verdict">
<i data-lucide="${result.ready ? "check-circle-2" : "alert-circle"}"></i>
<span>${result.ready ? FITZ_READINESS_PHRASES.readyTitle : FITZ_READINESS_PHRASES.notReadyTitle(result.missingItems.length)}</span>
</div>
${result.missingItems.length ? `<ul class="ai-checklist app-readiness-items">${result.missingItems.map(renderReadinessItem).join("")}</ul>` : ""}
${note ? `<span class="app-readiness-meta">${note}</span>` : ""}
<span class="app-readiness-meta">${FITZ_READINESS_PHRASES.checkedAtLabel} : ${formatDateTimeFR(result.checkedAt)}</span>
${!result.ready && advisorUnlocked ? `<a href="advisor.html?applicationId=${app.id}&university=${encodeURIComponent(app.university || "")}" class="app-readiness-advisor-cta"><i data-lucide="user-check"></i><span>${FITZ_READINESS_PHRASES.advisorCta}</span></a>` : ""}
</div>`;

}

// ==========================================================
// PARCOURS GUIDÉ — stepper 5 étapes (js/application-journey.js),
// repère visuel de ce qu'il reste à faire avant le dépôt.
// ==========================================================

// Trois états, pas deux — voir js/next-action.js. Une étape peut être
// non cochée ET hors de portée : générer la lettre avant d'avoir
// complété le profil produit une lettre creuse, qui s'affichera
// pourtant du même vert qu'une lettre excellente.
//
// Rien n'est désactivé : l'étudiant garde la main sur l'ordre. Sous le
// stepper, un avertissement dit ce qu'il obtiendrait en s'y prenant
// maintenant — une conséquence, pas une interdiction.
function renderJourneyStepper(app, steps) {

const qualifiees = qualifierEtapes(steps);
const alertes = avertissementsPrematures(steps);

const avertissement = alertes.length
? `<p class="journey-warning">
<i data-lucide="info"></i>
<span>${escapeHtml(alertes[0].consequence)} Commencez par ${escapeHtml(alertes[0].prerequisLisible)}.</span>
</p>`
: "";

return `
<div class="application-journey">
${qualifiees.map((step) => {

const classes = [
"journey-step",
step.etat === "faite" ? "is-done" : "",
step.etat === "prematuree" ? "is-premature" : "",
step.isFitz ? "is-fitz" : ""
].filter(Boolean).join(" ");

const infobulle = step.etat === "prematuree"
? `${step.label} — à faire après ${step.bloquePar.map((id) => LIBELLE_PREREQUIS[id] || id).join(" et ")}`
: step.label;

return `
<button type="button" class="${classes}" data-journey-step="${step.id}" title="${escapeHtml(infobulle)}">
<span class="journey-step-dot"><i data-lucide="${step.etat === "faite" ? "check" : step.icon}"></i></span>
<span class="journey-step-label">${step.label}</span>
</button>`;

}).join("")}
</div>
${avertissement}`;

}

async function fetchApplications(uid) {
const snapshot = await getDocs(collection(db, "users", uid, "applications"));
return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

function renderProtectedReadOnlyState(container, protectedApps, index = null) {

container.innerHTML = `
<div class="alert alert-warning">
<i data-lucide="shield-check"></i>
<div>
<strong>Votre abonnement a expiré, mais Fitz continue de suivre votre candidature en attente jusqu'à sa résolution.</strong>
<p>Fitz garde vos candidatures en attente sous surveillance jusqu'à leur réponse. Renouvelez votre formule dès que vous le souhaitez pour retrouver la possibilité d'ajouter ou de modifier vos candidatures.</p>
</div>
</div>

<div class="apps-list">
${protectedApps.map((app) => {

const urgency = urgencyLabel(app);

// Lecture seule (abonnement expiré) : l'état du catalogue s'affiche,
// la divergence aussi — mais sans bouton, la page ne modifie rien.
const lecture = index ? etatDeLaCandidature(app, index) : null;

return `
<article class="card app-card">
<div class="app-card-top">
<div>
<h3>${app.university}</h3>
${app.scholarship ? `<p class="app-card-scholarship">${app.scholarship}</p>` : ""}
</div>
<span class="app-status-pill app-status-${app.status}">${STATUS_LABELS[app.status] || app.status}</span>
</div>

<div class="app-card-meta">
${renderEcheanceCandidature(app, lecture)}
<span class="${urgency.urgent ? "is-urgent" : ""}"><i data-lucide="bell"></i>${urgency.text}</span>
<span class="is-protected"><i data-lucide="shield-check"></i>Suivi maintenu même après votre abonnement</span>
</div>

${renderDivergence(app, lecture, { bouton: false })}

${app.notes ? `<p class="app-card-notes">${app.notes}</p>` : ""}

${(app.universityWebsite || app.portalUrl) ? `<div class="app-card-actions">
${app.universityWebsite ? `<a href="${app.universityWebsite}" target="_blank" rel="noopener" class="btn btn-ghost btn-sm"><i data-lucide="external-link"></i><span>Site université</span></a>` : ""}
${app.portalUrl ? `<a href="${app.portalUrl}" target="_blank" rel="noopener" class="btn btn-ghost btn-sm"><i data-lucide="external-link"></i><span>Candidature</span></a>` : ""}
</div>` : ""}
</article>
`;

}).join("")}
</div>

<div class="apps-toolbar">
<a href="offers.html" class="btn btn-primary">
<span>Renouveler mon abonnement</span>
</a>
</div>
`;

container.hidden = false;

if (window.lucide) lucide.createIcons();

}

function renderLockedState(container, ctx) {

const flags = ctx.featureFlags.applications;
const target = unlockingPlans(ctx.planId, flags)[0];

container.innerHTML = `
<div class="ai-locked-hero">
<div class="ai-locked-icon"><i data-lucide="lock"></i></div>
<h2>Suivi des candidatures</h2>
<p>Débloquez le suivi de vos candidatures avec ${unlockPlanPhrase(target ? PLAN_LABELS[target] : null)} : gardez chaque étape sous contrôle, avec les rappels de Fitz pour ne rien manquer.</p>
<a href="${target ? `offers.html#${target}` : "offers.html"}" class="btn btn-primary">
<span>${FITZ_UNLOCK_CTA}</span>
</a>
</div>
`;

container.hidden = false;

if (window.lucide) lucide.createIcons();

}

function daysBetween(dateA, dateB) {
const MS_PER_DAY = 86400000;
return Math.round((dateA.setHours(0,0,0,0) - dateB.setHours(0,0,0,0)) / MS_PER_DAY);
}

function formatDateFR(isoDate) {
if (!isoDate) return null;
const d = new Date(isoDate + "T00:00:00");
return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function urgencyLabel(app) {

if (!app.nextCheckDate) return { text: "Pas de rappel programmé", urgent: false };

const days = daysBetween(new Date(app.nextCheckDate + "T00:00:00"), new Date());

if (days < 0) return { text: `À vérifier — en retard de ${Math.abs(days)} j`, urgent: true };
if (days === 0) return { text: "À vérifier aujourd'hui", urgent: true };
if (days <= 2) return { text: `À vérifier dans ${days} j`, urgent: true };

return { text: `Prochaine vérification dans ${days} j`, urgent: false };

}

function buildICS(app) {

const target = app.nextCheckDate || app.deadline;
if (!target) return null;

const dt = target.replace(/-/g, "");
const title = `Vérifier ma candidature — ${app.university}`;
const desc = app.scholarship ? `Bourse : ${app.scholarship}` : "Rappel Fitz";

const ics = [
"BEGIN:VCALENDAR",
"VERSION:2.0",
"PRODID:-//Fitz//Suivi candidatures//FR",
"BEGIN:VEVENT",
`UID:${app.id}@scholarbridge`,
`DTSTAMP:${dt}T090000Z`,
`DTSTART;VALUE=DATE:${dt}`,
`SUMMARY:${title}`,
`DESCRIPTION:${desc}`,
"END:VEVENT",
"END:VCALENDAR"
].join("\r\n");

return ics;

}

function downloadICS(app) {

const ics = buildICS(app);
if (!ics) return;

const blob = new Blob([ics], { type: "text/calendar" });
const url = URL.createObjectURL(blob);
const a = document.createElement("a");
a.href = url;
a.download = `rappel-${(app.university || "candidature").toLowerCase().replace(/[^a-z0-9]+/g, "-")}.ics`;
document.body.appendChild(a);
a.click();
a.remove();
URL.revokeObjectURL(url);

}

function nextCheckFromToday(frequencyDays) {
const d = new Date();
d.setDate(d.getDate() + parseInt(frequencyDays, 10));
return d.toISOString().slice(0, 10);
}

// ==========================================================
// CRÉNEAUX RECOMMANDÉS — réutilise le quota déjà existant
// (SCHOLARBRIDGE_PLANS[planId].maxAccompaniedApplications), pas un
// second système de comptage. Un compte dont le quota est fini
// (Premier Dossier, Essentiel, Avancé, Premium, Signature Focus) et qui
// a moins de candidatures que ce quota se voit pré-remplir les
// créneaux manquants avec des suggestions réelles (jointure
// programs → universities/scholarships, même pattern que
// scholarships.js/universities-page.js/details.js — jamais une
// deuxième façon de résoudre bourse↔université).
//
// Signature (quota Infinity) n'est délibérément jamais pré-rempli :
// "3 créneaux" n'a de sens que pour un quota fini. isQuotaReached()
// (js/plan-features.js) traite déjà Infinity comme "jamais atteint" —
// même esprit ici : pas de créneaux à combler quand il n'y a pas de
// plafond.
//
// isRecommendation:true marque un créneau que Fitz a rempli lui-même
// (badge "Suggéré par Fitz" + bouton "Suggérer une autre université"
// dans renderCard) — purement informatif, ne change RIEN au quota : le
// document compte comme n'importe quelle candidature dès sa création,
// conformément à l'option retenue (pas d'état "recommandation non
// confirmée" distinct, pour ne pas dupliquer isQuotaReached()).
async function seedRecommendedSlots(uid, planId, existingApplications, profile) {

// Grille B : les créneaux suggérés sont des BOURSES — on ne compte que
// les candidatures de ce parcours, les préinscriptions (pre-N) ne
// consomment pas ce quota.
existingApplications = (existingApplications || []).filter((a) => lireParcours(a) !== "preinscription");

const plan = window.SCHOLARBRIDGE_PLANS && window.SCHOLARBRIDGE_PLANS[planId];
const quota = plan ? plan.maxAccompaniedApplications : null;

if (!Number.isFinite(quota) || quota <= 0) return false;

const missing = quota - existingApplications.length;

if (missing <= 0) return false;

// Chargeur partagé (js/catalog-data.js) : ce fichier lisait les trois
// collections DEUX fois par page — ici, puis à nouveau dans la
// suggestion d'alternative plus bas. Le second appel ne coûte plus
// rien : la promesse est déjà en cache.
let catalogueSnap;

try {

catalogueSnap = await chargerCatalogue();

} catch (error) {

console.warn("Impossible de charger le catalogue pour les recommandations Fitz :", error);
return false;

}

const programs = catalogueSnap.programmes.map(({ id, ...reste }) => ({ firestoreId: id, ...reste }));
const universitiesById = new Map(catalogueSnap.universites.map(({ id, ...reste }) => [id, { firestoreId: id, ...reste }]));
const scholarshipsById = new Map(catalogueSnap.bourses.map(({ id, ...reste }) => [id, { firestoreId: id, ...reste }]));

// Les candidatures existantes n'ont qu'un nom d'université en texte
// libre (pas d'identifiant Firestore — voir la note du schéma en tête
// de fichier) : seul un rapprochement par nom permet d'éviter de
// suggérer une université déjà occupée par un autre créneau.
const excludeNames = new Set(
existingApplications.map((a) => (a.university || "").trim().toLowerCase()).filter(Boolean)
);

const eligiblePrograms = programs.filter((p) => {
const uni = universitiesById.get(p.universityId);
// Bug corrigé (audit du 2026-08-14) : lisait uni.university, qui n'existe
// pas sur le schéma relationnel ("universities" porte name) — le filtre
// n'excluait donc jamais rien en pratique. Voir la même correction dans
// js/recommend-programs.js.
return uni && !excludeNames.has((uni.name || "").trim().toLowerCase());
});

// retenirOpportunites, et non plus recommendPrograms : un créneau que
// Fitz remplit LUI-MÊME ne doit jamais viser un cycle clos ni un
// mauvais niveau. L'ancien appel gardait tout `score >= 0`, sans
// filtrer ni le cycle ni l'échéance — l'étudiant trouvait donc en
// arrivant des candidatures vers des portes fermées, pré-remplies par
// le service qu'il paie.
//
// `eligiblePrograms` (et non tout le catalogue) reste passé tel quel :
// c'est lui qui écarte les universités déjà occupées par un autre
// créneau, ce que retenirOpportunites ne peut pas savoir.
const { retenues } = retenirOpportunites({
profile: profile || {},
programs: eligiblePrograms,
universitiesById,
scholarshipsById
});

// Dans l'ordre, autant que de créneaux libres.
const recommendations = retenues.slice(0, missing);

if (!recommendations.length) return false;

const appsCol = collection(db, "users", uid, "applications");

// Créneaux anti-triche (audit sécurité 2026-09-02) : chaque création
// prend l'id "slot-N" que firestore.rules borne au quota de la
// formule — voir l'en-tête de js/application-actions.js. La liste
// locale grandit à chaque écriture pour que deux recommandations ne
// visent jamais le même créneau.
const dejaCreees = [...existingApplications];

for (const rec of recommendations) {

const slotId = slotIdLibre(dejaCreees, quota);
if (!slotId) break;

await setDoc(doc(appsCol, slotId), {
university: rec.universityName,
scholarship: rec.scholarshipTitle,
// La clé vers le catalogue (passe 1/3, 2026-09-06) : c'est elle qui
// permet à la carte d'afficher l'état publié par la fiche, et à une
// correction de catalogue d'atteindre la candidature.
scholarshipId: rec.scholarshipId || null,
programId: rec.programId || null,
// Audit du 2026-08-28 : ces deux champs étaient "" en dur alors que
// rec porte déjà applicationUrl/universityWebsite (recommend-programs.js)
// — un créneau suggéré par Fitz n'affichait donc jamais aucun lien tant
// que l'étudiant n'éditait pas la carte à la main pour en coller un.
portalUrl: rec.applicationUrl || "",
universityWebsite: rec.universityWebsite || "",
status: "a_preparer",
// Lot A : ces créneaux viennent de retenirOpportunites() — toujours
// des bourses.
track: "bourse",
deadline: null,
reminderFrequency: 14,
notes: "",
premiumProtected: false,
isRecommendation: true,
nextCheckDate: nextCheckFromToday(14),
createdAt: serverTimestamp()
});

dejaCreees.push({ id: slotId });

}

return true;

}

// `documentsObtained` : users/{uid}.documentsObtained (lot B, 2026-09-07),
// LU par les étapes du parcours préinscription — écrit par documents.html
// seulement.
// `planPreinscriptionId` (grille B, 2026-09-07) : le second forfait. Les
// candidatures se comptent PAR PARCOURS : slot-N pour les bourses (quota
// maxAccompaniedApplications), pre-N pour les préinscriptions (quota
// maxPreinscriptions) — le serveur fait foi (firestore.rules).
function initApplicationsPage(uid, planId, profile, featureFlags, testerAccess, hasFitzExpress, documentsObtained = {}, planPreinscriptionId = "") {

const profileScore = calculateAiScore(profile);
const advisorUnlocked = !isFeatureLocked(planId, featureFlags, "advisor", testerAccess, hasFitzExpress, planPreinscriptionId);

const planBourse = window.SCHOLARBRIDGE_PLANS && window.SCHOLARBRIDGE_PLANS[planId];
const planPre = window.SCHOLARBRIDGE_PLANS && window.SCHOLARBRIDGE_PLANS[planPreinscriptionId];
const peutBourse = testerAccess || !!(planBourse && planBourse.maxAccompaniedApplications > 0);
const peutPreinscription = testerAccess || !!(planPre && planPre.maxPreinscriptions > 0);

function estPreinscription(track) { return track === "preinscription"; }
function quotaPour(track) {
if (estPreinscription(track)) return planPre ? planPre.maxPreinscriptions : null;
return planBourse ? planBourse.maxAccompaniedApplications : null;
}
function candidaturesDuParcours(track, liste) {
return (liste || []).filter((a) => (lireParcours(a) === "preinscription") === estPreinscription(track));
}
function nomFormulePour(track) {
return estPreinscription(track) ? (PLAN_PREINSCRIPTION_LABELS[planPreinscriptionId] || "Dossier France") : PLAN_LABELS[planId];
}

let advisorRequests = [];

async function loadAdvisorRequests() {
if (!advisorUnlocked) { advisorRequests = []; return; }
try {
const snapshot = await getDocs(collection(db, "users", uid, "advisorRequests"));
advisorRequests = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
} catch (error) {
console.error("Impossible de charger les demandes de revue conseiller :", error);
advisorRequests = [];
}
}

const listEl = document.getElementById("applicationsList");
const emptyEl = document.getElementById("applicationsEmpty");
const statTracked = document.getElementById("statTracked");
const statDue = document.getElementById("statDue");
const statPending = document.getElementById("statPending");

const modal = document.getElementById("applicationModal");
const modalTitle = document.getElementById("applicationModalTitle");
const form = document.getElementById("applicationForm");

const fields = {
track: document.getElementById("applicationTrack"),
university: document.getElementById("fieldUniversity"),
scholarship: document.getElementById("fieldScholarship"),
portalUrl: document.getElementById("fieldPortalUrl"),
status: document.getElementById("fieldStatus"),
deadline: document.getElementById("fieldDeadline"),
frequency: document.getElementById("fieldFrequency"),
notes: document.getElementById("fieldNotes"),
// Lot E1
preuveNumero: document.getElementById("preuveNumero"),
preuveDate: document.getElementById("preuveDate"),
preuveFichier: document.getElementById("preuveFichier")
};

// ==========================================================
// LA PREUVE DE DÉPÔT dans le formulaire (lot E1, 2026-09-07).
// Une déclaration, jamais une vérification (js/preuve-depot.js).
// Le select de statut ne propose les statuts déposés que si une
// preuve valide est saisie ; sinon la phrase de libelleDemande()
// explique ce qu'on attend. firestore.rules fait foi.
// ==========================================================
const preuveBlock = document.getElementById("preuveBlock");
const preuveDemande = document.getElementById("preuveDemande");
const preuveActuelle = document.getElementById("preuveActuelle");
const preuveEtat = document.getElementById("preuveEtat");

// La candidature en cours d'édition, et sa preuve déjà enregistrée.
let preuveEnregistree = null;
let preuveParTiers = false;

function dateISOAujourdhui() {
const d = new Date();
return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// Ce que le formulaire déclare maintenant (sans le fichier, qui n'a pas
// encore de chemin : on le représente par un marqueur si un fichier est
// choisi — le vrai chemin est écrit après l'envoi).
function preuveSaisie() {
const numero = fields.preuveNumero.value.trim();
const fichierChoisi = fields.preuveFichier.files && fields.preuveFichier.files.length > 0;
const fichierExistant = preuveEnregistree && preuveEnregistree.fichier;
const preuve = { deposeLe: fields.preuveDate.value };
if (numero) preuve.numeroDossier = numero;
if (fichierChoisi || fichierExistant) preuve.fichier = fichierChoisi ? "(à envoyer)" : fichierExistant;
preuve.mode = preuveParTiers ? "transmis" : (numero ? "numero" : "capture");
return preuve;
}

function fichierAcceptable(file) {
if (!file) return true;
if (file.size > TAILLE_MAX_FICHIER) return false;
return TYPES_FICHIER.some((t) => (file.type || "").startsWith(t));
}

// Active/désactive les statuts déposés selon la validité de la preuve,
// et dit pourquoi.
function rafraichirPreuve() {
if (preuveBlock.hidden) return;
const preuve = preuveSaisie();
const file = fields.preuveFichier.files && fields.preuveFichier.files[0];
const valide = preuveValide(preuve, { parTiers: preuveParTiers }) && fichierAcceptable(file);

fields.status.querySelectorAll("option").forEach((opt) => {
if (STATUTS_DEPOSES.includes(opt.value)) opt.disabled = !valide;
});

if (file && !fichierAcceptable(file)) {
preuveEtat.textContent = "Ce fichier n'est pas accepté : image ou PDF, 5 Mo au plus.";
preuveEtat.classList.remove("is-ok");
} else if (valide) {
preuveEtat.textContent = "Déclaration complète : vous pouvez passer la candidature en « Déposée ».";
preuveEtat.classList.add("is-ok");
} else if (preuve.deposeLe > dateISOAujourdhui()) {
preuveEtat.textContent = "La date de dépôt ne peut pas être dans le futur.";
preuveEtat.classList.remove("is-ok");
} else {
preuveEtat.textContent = "Les statuts « Déposée » et suivants s'ouvriront une fois la déclaration remplie.";
preuveEtat.classList.remove("is-ok");
}

// Si le statut choisi vient d'être invalidé, on redescend proprement.
const opt = fields.status.selectedOptions[0];
if (opt && opt.disabled) {
fields.status.value = "en_cours";
fields.status.dispatchEvent(new Event("change", { bubbles: true }));
}
}

// Prépare le bloc pour la candidature ouverte dans le modal.
function preparerPreuve(app, lecture) {
preuveEnregistree = lirePreuve(app);
preuveParTiers = !!(lecture && lecture.bourse && deposeParUnTiers(lireExigences(lecture.bourse)));
const dejaDeposee = !!app && STATUTS_DEPOSES.includes(app.status);
const dejaValide = preuveEnregistree && preuveValide(preuveEnregistree, { parTiers: preuveParTiers });

// Une candidature nouvelle ou en préparation : le bloc s'affiche pour
// permettre de déposer. Une candidature DÉJÀ déposée sans preuve
// (antérieure au lot) : rien n'est exigé sur ses autres champs —
// jamais de dégradation ; le bloc reste proposé, sans contrainte.
preuveBlock.hidden = false;
preuveDemande.textContent = libelleDemande(app, { parTiers: preuveParTiers });
preuveActuelle.hidden = !preuveEnregistree;
preuveActuelle.textContent = preuveEnregistree ? resumePreuve(preuveEnregistree) : "";

fields.preuveNumero.value = (preuveEnregistree && preuveEnregistree.numeroDossier) || "";
fields.preuveDate.value = (preuveEnregistree && preuveEnregistree.deposeLe) || dateISOAujourdhui();
fields.preuveDate.max = dateISOAujourdhui();
fields.preuveFichier.value = "";

if (dejaDeposee && !dejaValide) {
// Non-dégradation : les statuts déposés restent proposés tels quels
// tant que le statut ne bouge pas (firestore.rules ne joue qu'à la
// transition). On n'impose rien ici.
fields.status.querySelectorAll("option").forEach((opt) => { opt.disabled = false; });
preuveEtat.textContent = "Cette candidature a été déposée avant la déclaration de dépôt ; vous pouvez la compléter ici.";
preuveEtat.classList.remove("is-ok");
return;
}

rafraichirPreuve();
}

["input", "change"].forEach((evt) => {
fields.preuveNumero.addEventListener(evt, rafraichirPreuve);
fields.preuveDate.addEventListener(evt, rafraichirPreuve);
fields.preuveFichier.addEventListener(evt, rafraichirPreuve);
});

// L'envoi de la capture : compressée si c'est une image (même
// implémentation que compress.html), puis déposée dans le dossier
// Storage de CETTE candidature — le seul chemin que storage.rules
// et firestore.rules acceptent.
async function envoyerCapture(applicationId, file) {
let blob = file;
let ext = (file.name.split(".").pop() || "").toLowerCase();
if ((file.type || "").startsWith("image/")) {
blob = await compressImageToTarget(file, 1.5 * 1024 * 1024);
ext = "jpg";
}
if (file.type === "application/pdf") ext = "pdf";
const chemin = cheminCapture(uid, applicationId, ext);
await uploadBytes(storageRef(storage, chemin), blob, { contentType: blob.type || file.type });
return chemin;
}

// Construit le champ preuveDepot à écrire, ou null si rien n'est
// déclaré de neuf (on ne réécrit jamais declareLe pour rien).
async function preuveAEcrire(applicationId) {
if (preuveBlock.hidden) return null;
const file = fields.preuveFichier.files && fields.preuveFichier.files[0];
const saisie = preuveSaisie();
const inchangee = preuveEnregistree && !file &&
(saisie.numeroDossier || "") === (preuveEnregistree.numeroDossier || "") &&
saisie.deposeLe === preuveEnregistree.deposeLe;
if (inchangee) return null;
if (!preuveValide(saisie, { parTiers: preuveParTiers }) || !fichierAcceptable(file)) return null;

const preuve = { mode: saisie.mode, deposeLe: saisie.deposeLe, declareLe: serverTimestamp() };
if (saisie.numeroDossier) preuve.numeroDossier = saisie.numeroDossier;
if (file) preuve.fichier = await envoyerCapture(applicationId, file);
else if (preuveEnregistree && preuveEnregistree.fichier) preuve.fichier = preuveEnregistree.fichier;
return preuve;
}

const appsCol = collection(db, "users", uid, "applications");

let applications = [];
let editingId = null;

// ==========================================================
// SÉLECTEUR CATALOGUE (refonte 2026-09-02) — « c'est pas à
// l'étudiant de remplir des universités auxquelles candidater ni le
// lien de candidature » : le modal de création ne demande plus de
// taper quoi que ce soit. Fitz propose les universités du catalogue
// classées par compatibilité avec le profil (recommendPrograms —
// exactement les mêmes règles que les créneaux qu'il pré-remplit
// lui-même : nationalité et âge filtrés en dur, cycle visé, pays
// souhaités, langue, financement), la recherche couvre tout le
// catalogue, et la sélection remplit université, bourse, portail
// officiel, site de l'université et échéance d'un coup.
//
// L'enregistrement passe par les MÊMES champs cachés (#fieldUniversity
// etc.) : un seul chemin de soumission, que la valeur vienne du
// catalogue ou du repli manuel « hors catalogue ». L'édition d'une
// candidature existante ouvre directement les champs libres — on ne
// force jamais un re-choix de catalogue sur un dossier déjà en route.
// ==========================================================
const pickerSection = document.getElementById("pickerSection");
const pickerList = document.getElementById("pickerList");
const pickerSearch = document.getElementById("pickerSearch");
const pickerSummary = document.getElementById("pickerSummary");
const manualFields = document.getElementById("manualFields");
const trackSection = document.getElementById("trackSection");
const trackNote = document.getElementById("applicationTrackNote");
const detailsSection = document.getElementById("detailsSection");

// Lot A : une candidature liée à une bourse du catalogue ne peut pas
// être une préinscription — le select se verrouille sur « Bourse » et
// le dit. Hors catalogue (repli manuel ou édition), l'étudiant choisit.
function verrouillerParcours(verrouille) {
if (verrouille) fields.track.value = "bourse";
fields.track.disabled = verrouille;
trackNote.hidden = !verrouille;
}

// Résidu du lot A (corrigé lot B) : « Changer » puis « hors catalogue »
// laissait le titre de bourse, le portail et la date de l'entrée
// précédemment choisie — on pouvait enregistrer une préinscription qui
// traînait un titre de bourse. Ce que le catalogue a rempli, on le vide
// dès qu'on quitte l'entrée.
function viderChampsCatalogue() {
fields.university.value = "";
fields.scholarship.value = "";
fields.portalUrl.value = "";
fields.deadline.value = "";
}
const manualModeBtn = document.getElementById("manualModeBtn");
const saveBtn = document.getElementById("applicationSaveBtn");

let pickerEntries = null;
let pickedEntry = null;
let manualMode = false;

async function ensurePickerEntries() {

if (pickerEntries) return pickerEntries;

// Chargeur partagé (js/catalog-data.js) : si seedRecommendedSlots a
// déjà lu le catalogue sur cette page, cet appel ne coûte rien.
const catalogueSnap = await chargerCatalogue();

const programs = catalogueSnap.programmes.map(({ id, ...reste }) => ({ firestoreId: id, ...reste }));
const universitiesById = new Map(catalogueSnap.universites.map(({ id, ...reste }) => [id, { firestoreId: id, ...reste }]));
const scholarshipsById = new Map(catalogueSnap.bourses.map(({ id, ...reste }) => [id, { firestoreId: id, ...reste }]));

// count: Infinity — on veut TOUT le catalogue éligible, classé. Les
// bourses fermées à la nationalité ou au-delà de la limite d'âge sont
// écartées par recommendPrograms (score sentinelle) : Fitz ne propose
// jamais une porte fermée, même via la recherche.
const picks = recommendPrograms({
profile: profile || {},
programs,
universitiesById,
scholarshipsById,
count: Infinity
});

// L'état complet de chaque bourse (etatCandidature via le module de
// liaison), mémoïsé par couple bourse/programme : c'est l'état que la
// fiche publie, pas une deuxième lecture de la date.
const index = indexerCatalogue(catalogueSnap);
const etatsMemo = new Map();

function lectureDe(scholarshipId, programId) {
const cle = `${scholarshipId}|${programId || ""}`;
if (!etatsMemo.has(cle)) etatsMemo.set(cle, etatDeLaCandidature({ scholarshipId, programId }, index));
return etatsMemo.get(cle);
}

pickerEntries = picks.map((pick) => {

const uni = universitiesById.get(pick.universityId) || {};
const programId = pick.programId || null;
const lecture = pick.scholarshipId ? lectureDe(pick.scholarshipId, programId) : null;
const etat = lecture && lecture.lie ? lecture.etat : null;

return {
...pick,
programId,
etat,
// Passe 3/3 : de quoi dire, AVANT d'ouvrir un créneau, qu'une bourse
// ne se dépose pas soi-même. Seuls les codes « voie » et l'ordre
// d'admission sont retenus ici — le reste appartient à la carte, une
// fois la candidature créée.
exigences: lecture && lecture.bourse ? lireExigences(lecture.bourse) : [],
country: uni.country || "",
deadlineText: pick.deadline || "",
// Pré-remplissage du champ date UNIQUEMENT quand l'état dit le cycle
// ouvert ET porte un décompte — donc jamais sur une échéance par
// pays agrégée (« Selon votre pays »), jamais sur « pas encore
// ouverte », jamais sur un cycle clos. L'ISO vient du même calcul
// que l'état (dateCatalogue), au format d'un <input type="date">.
deadlineISO: (etat && etat.ouvert === true && etat.jours !== null && lecture.dateCatalogue) ? lecture.dateCatalogue : ""
};

});

return pickerEntries;

}

function renderPickerList() {

if (!pickerEntries) return;

// Insensible aux accents et à la casse (clôture, 2026-09-07) : « ecole »
// trouve « École », « koc » trouve « Koç ». Même normalisation que le
// rapprochement de candidature.
const q = normaliserTitre((pickerSearch.value || "").trim());

// Le sélecteur ne propose plus de porte fermée (passe 1/3) :
//  - « Suggérées pour votre profil » écarte les cycles clos — Fitz ne
//    propose pas un train déjà parti ;
//  - la RECHERCHE les garde (un étudiant peut vouloir suivre une bourse
//    qui rouvrira), avec la pastille honnête et classées après les
//    ouvertes.
const estClose = (e) => e.etat && e.etat.ton === "close";
const rang = (e) => (!e.etat ? 2 : e.etat.ton === "ouverte" ? 0 : e.etat.ton === "attente" ? 1 : e.etat.ton === "close" ? 3 : 2);

const matches = q
? pickerEntries
.filter((e) =>
normaliserTitre(e.universityName).includes(q) ||
normaliserTitre(e.country || "").includes(q) ||
normaliserTitre(e.scholarshipTitle || "").includes(q))
.sort((a, b) => rang(a) - rang(b))
: pickerEntries.filter((e) => !estClose(e));

const shown = matches.slice(0, q ? 12 : 6);

if (!shown.length) {
pickerList.innerHTML = `<p class="apps-picker-empty">Aucune université du catalogue ne correspond à « ${escapeHtml(q)} ». Si votre candidature est ailleurs, utilisez le lien hors catalogue ci-dessous.</p>`;
return;
}

pickerList.innerHTML = (q ? "" : `<p class="apps-picker-label">Suggérées pour votre profil</p>`) + shown.map((e) => {

// La pastille d'échéance porte déjà la date : la raison affichée est
// la première qui ne la répète pas (l'explication « candidatures
// ouvertes (échéance : …) » ferait doublon sur la même carte).
const reason = (e.reasons || []).find((r) => !r.toLowerCase().includes("chéance")) || "";

// La pastille : « Échéance : … » seulement sur une date ferme d'un
// cycle ouvert ; sinon le badge de l'état (« Candidatures closes »,
// « pas encore ouvertes », « Selon votre pays »…) — jamais une date
// sur une porte fermée.
const deadlineShort = e.deadlineISO
? `Échéance : ${formatDateFR(e.deadlineISO)}`
: e.etat ? (e.etat.ton === "ouverte" ? `${e.etat.etiquette} : ${e.etat.valeur}` : e.etat.badge) : e.deadlineText;
const tonPastille = e.etat ? ` is-${e.etat.ton}` : "";

return `
<button type="button" class="apps-pick" data-university-id="${escapeHtml(e.universityId)}">
<span class="apps-pick-main">
<strong>${escapeHtml(e.universityName)}</strong>
<span class="apps-pick-meta">${escapeHtml([e.country, e.scholarshipTitle].filter(Boolean).join(" · "))}</span>
${reason ? `<span class="apps-pick-reason">${escapeHtml(reason)}</span>` : ""}
</span>
${deadlineShort ? `<span class="apps-pick-deadline${tonPastille}">${escapeHtml(deadlineShort)}</span>` : ""}
</button>`;

}).join("");

pickerList.querySelectorAll(".apps-pick").forEach((btn) => {
btn.addEventListener("click", () => {
const entry = pickerEntries.find((e) => e.universityId === btn.dataset.universityId);
if (entry) selectPickerEntry(entry);
});
});

}

// CE QU'ON DOIT SAVOIR AVANT D'OUVRIR UN CRÉNEAU (passe 3/3)
//
// Une bourse qu'on ne dépose pas soi-même, ça se sait AVANT — pas après
// avoir consommé un créneau de sa formule. On ne montre ici que les
// deux faits qui changent la démarche : la voie de dépôt, et l'ordre
// admission/bourse. Le détail complet attend la carte.
function lignePreDepot(entry) {

const g = groupees(entry.exigences || []);

const bouts = [];

if (g.voie.length) bouts.push(g.voie[0].libelle);
if (g.ordre.length) bouts.push(g.ordre[0].libelle);

if (!bouts.length) return "";

return `<li class="apps-selection-depot"><i data-lucide="users"></i><span>${escapeHtml(bouts.join(" · "))}</span></li>`;

}

function selectPickerEntry(entry) {

pickedEntry = entry;
manualMode = false;

fields.university.value = entry.universityName;
fields.scholarship.value = entry.scholarshipTitle || "";
fields.portalUrl.value = entry.applicationUrl || "";
// Pré-rempli UNIQUEMENT sur une date ferme d'un cycle ouvert (voir
// ensurePickerEntries) ; sinon le champ reste vide et l'état s'explique
// dans le résumé ci-dessous.
fields.deadline.value = entry.deadlineISO || "";

pickerSection.hidden = true;
manualFields.hidden = true;
fields.university.required = false;
verrouillerParcours(true);
trackSection.hidden = false;
detailsSection.hidden = false;
saveBtn.disabled = false;

pickerSummary.innerHTML = `
<div class="apps-selection-head">
<i data-lucide="check-circle"></i>
<div>
<strong>${escapeHtml(entry.universityName)}</strong>
<span>${escapeHtml([entry.country, entry.scholarshipTitle].filter(Boolean).join(" · "))}</span>
</div>
<button type="button" class="apps-selection-change" id="pickerChangeBtn">Changer</button>
</div>
<ul class="apps-selection-facts">
${entry.applicationUrl ? `<li><i data-lucide="link"></i><span>Portail officiel de candidature renseigné automatiquement</span></li>` : ""}
${entry.etat ? `<li class="apps-selection-etat is-${escapeHtml(entry.etat.ton)}"><i data-lucide="calendar-check"></i><span><strong>${escapeHtml(entry.etat.etiquette)} : ${escapeHtml(entry.etat.valeur)}</strong>${entry.etat.detail ? ` — ${escapeHtml(entry.etat.detail)}` : ""}${entry.etat.verifie ? ` (${escapeHtml(entry.etat.verifie)})` : ""}</span></li>` : ""}
${lignePreDepot(entry)}
${entry.deadlineText ? `<li><i data-lucide="calendar-clock"></i><span>Échéance du catalogue : ${escapeHtml(entry.deadlineText)}${entry.deadlineISO ? " — date limite pré-remplie" : ""}</span></li>` : ""}
${entry.reasons && entry.reasons.length ? `<li><i data-lucide="target"></i><span>${escapeHtml(entry.reasons[0])}</span></li>` : ""}
</ul>`;

pickerSummary.hidden = false;
pickerSummary.querySelector("#pickerChangeBtn").addEventListener("click", showPickerAgain);

if (window.lucide) lucide.createIcons();

}

function showPickerAgain() {

pickedEntry = null;
manualMode = false;

pickerSummary.hidden = true;
pickerSummary.innerHTML = "";
manualFields.hidden = true;
trackSection.hidden = true;
verrouillerParcours(false);
viderChampsCatalogue();
detailsSection.hidden = true;
saveBtn.disabled = true;
pickerSection.hidden = false;

renderPickerList();

}

function enterManualMode() {

pickedEntry = null;
manualMode = true;

pickerSection.hidden = true;
pickerSummary.hidden = true;
pickerSummary.innerHTML = "";
manualFields.hidden = false;
fields.university.required = true;
verrouillerParcours(false);
viderChampsCatalogue();
trackSection.hidden = false;
detailsSection.hidden = false;
saveBtn.disabled = false;

fields.university.focus();

}

pickerSearch.addEventListener("input", renderPickerList);
manualModeBtn.addEventListener("click", enterManualMode);

function openModal(app) {

editingId = app ? app.id : null;
modalTitle.textContent = app ? "Modifier la candidature" : "Nouvelle candidature";

fields.track.value = lireParcours(app);
// Grille B : on ne propose que les parcours que le compte peut accompagner.
fields.track.querySelector('option[value="bourse"]').disabled = !peutBourse;
fields.track.querySelector('option[value="preinscription"]').disabled = !peutPreinscription;
if (!app && !peutBourse && peutPreinscription) fields.track.value = "preinscription";
fields.university.value = app?.university || "";
fields.scholarship.value = app?.scholarship || "";
fields.portalUrl.value = app?.portalUrl || "";
fields.status.value = app?.status || "a_preparer";
fields.deadline.value = app?.deadline || "";
fields.frequency.value = app?.reminderFrequency || "14";
fields.notes.value = app?.notes || "";

// Lot E1 : la déclaration de dépôt, selon la candidature (et sa bourse :
// déposée par un tiers ou non).
preparerPreuve(app, app && catalogueIndex ? etatDeLaCandidature(app, catalogueIndex) : null);

pickedEntry = null;
pickerSummary.hidden = true;
pickerSummary.innerHTML = "";

if (app) {

// Édition : champs libres directement — jamais de re-choix forcé.
manualMode = true;
pickerSection.hidden = true;
manualFields.hidden = false;
fields.university.required = true;
verrouillerParcours(false);
trackSection.hidden = false;
detailsSection.hidden = false;
saveBtn.disabled = false;

} else {

manualMode = false;
manualFields.hidden = true;
fields.university.required = false;
trackSection.hidden = true;
verrouillerParcours(false);
detailsSection.hidden = true;
saveBtn.disabled = true;
pickerSection.hidden = false;
pickerSearch.value = "";
pickerList.innerHTML = `<p class="apps-picker-empty">Fitz lit le catalogue…</p>`;

ensurePickerEntries().then(renderPickerList).catch((error) => {
console.warn("Catalogue indisponible pour le sélecteur de candidature :", error);
pickerList.innerHTML = `<p class="apps-picker-empty">Le catalogue est momentanément indisponible. Vous pouvez saisir votre candidature via le lien hors catalogue ci-dessous.</p>`;
});

}

modal.hidden = false;

}

function closeModal() {
modal.hidden = true;
editingId = null;
pickedEntry = null;
manualMode = false;
form.reset();
}

function renderStats() {

statTracked.textContent = applications.length;
statDue.textContent = applications.filter((a) => urgencyLabel(a).urgent).length;
statPending.textContent = applications.filter((a) => a.status === "en_attente").length;

}

// Lot E1 : « Déposée le <date> · dossier n° … » ou « · capture jointe » —
// la preuve reste consultable (le lien demande l'URL à Storage au clic).
function renderPreuve(app) {
const preuve = lirePreuve(app);
const resume = resumePreuve(preuve);
if (!resume) return "";
return `<span class="app-preuve"><i data-lucide="send"></i>${escapeHtml(resume)}${preuve.fichier ? ` <a href="#" data-voir-capture="${escapeHtml(preuve.fichier)}">voir</a>` : ""}</span>`;
}

function renderCard(app, lecture) {

const urgency = urgencyLabel(app);
const journeySteps = computeJourneySteps(app, { profileScore, advisorUnlocked, advisorRequests, documentsObtained });

const card = document.createElement("article");
card.className = "card app-card" + (urgency.urgent ? " app-card-urgent" : "");
card.id = app.id;
card.dataset.appId = app.id;

// L'étape « lettre » est-elle hors de portée pour cette candidature ?
// (voir js/next-action.js : Fitz écrit la lettre à partir du profil)
const lettrePrematuree = qualifierEtapes(journeySteps)
.some((e) => e.id === "letter" && e.etat === "prematuree");

card.innerHTML = `
<div class="app-card-top">
<div>
${app.isRecommendation ? `<span class="app-recommendation-badge">Suggéré par Fitz</span>` : ""}
<h3>${app.university}</h3>
${app.scholarship ? `<p class="app-card-scholarship">${app.scholarship}</p>` : ""}
</div>
<div class="app-card-pills">
<span class="app-track-pill" data-track="${lireParcours(app)}">${LIBELLES_PARCOURS[lireParcours(app)].court}</span>
<span class="app-status-pill app-status-${app.status}">${STATUS_LABELS[app.status] || app.status}</span>
</div>
</div>

${renderJourneyStepper(app, journeySteps)}

<div class="app-card-meta">
${renderEcheanceCandidature(app, lecture)}
<span class="${urgency.urgent ? "is-urgent" : ""}"><i data-lucide="bell"></i>${urgency.text}</span>
${app.premiumProtected ? `<span class="is-protected"><i data-lucide="shield-check"></i>Suivi maintenu même après votre abonnement</span>` : ""}
${renderPreuve(app)}
</div>

${renderDivergence(app, lecture)}

${renderExigences(lecture)}

${app.notes ? `<p class="app-card-notes">${app.notes}</p>` : ""}

<div class="app-card-documents">
<i data-lucide="pen-line"></i>
${app.generatedLetter
? `<span>Lettre de motivation générée pour cette candidature.</span><a href="ai-letter.html?applicationId=${app.id}" class="app-doc-link">Revoir / régénérer</a>`
: lettrePrematuree
// Deux messages contradictoires cohabitaient sur la même carte :
// l'avertissement du parcours conseillait de compléter le profil
// d'abord, et cette ligne-ci, dix pixels plus bas, invitait à
// générer la lettre tout de suite. L'invitation est donc alignée
// sur l'avertissement — même conseil, formulé en une ligne.
? `<span>Complétez d'abord votre profil : Fitz y puise la matière de votre lettre.</span><a href="profile.html" class="app-doc-link">Compléter mon profil</a>`
: `<span>Fitz peut générer une lettre de motivation pour cette candidature.</span><a href="ai-letter.html?applicationId=${app.id}" class="app-doc-link">Générer avec Fitz</a>`}
</div>

<div class="app-card-documents">
<i data-lucide="mail"></i>
${app.generatedEmail
? `<span>E-mail Fitz généré pour cette candidature.</span><a href="ai-email.html?applicationId=${app.id}" class="app-doc-link">Revoir / régénérer</a>`
: `<span>Fitz peut rédiger un e-mail pour cette candidature.</span><a href="ai-email.html?applicationId=${app.id}" class="app-doc-link">Générer avec Fitz</a>`}
</div>

${renderChecklistSection(app, lecture)}

${renderReadinessPanel(app, advisorUnlocked)}

<div class="app-card-actions">
${app.isRecommendation ? `<button type="button" class="btn btn-secondary btn-sm app-replace-btn"><i data-lucide="refresh-cw"></i><span>Suggérer une autre université</span></button>` : ""}
<button type="button" class="btn btn-secondary btn-sm app-checkin-btn"><i data-lucide="check"></i><span>J'ai vérifié</span></button>
<button type="button" class="btn btn-secondary btn-sm app-readiness-btn"><i data-lucide="shield-check"></i><span>Vérifier avant de déposer</span></button>
${app.universityWebsite ? `<a href="${app.universityWebsite}" target="_blank" rel="noopener" class="btn btn-ghost btn-sm"><i data-lucide="external-link"></i><span>Site université</span></a>` : ""}
${app.portalUrl ? `<a href="${app.portalUrl}" target="_blank" rel="noopener" class="btn btn-ghost btn-sm"><i data-lucide="external-link"></i><span>Candidature</span></a>` : ""}
<button type="button" class="btn btn-ghost btn-sm app-ics-btn"><i data-lucide="calendar-plus"></i><span>Rappel .ics</span></button>
<button type="button" class="btn btn-ghost btn-sm app-edit-btn"><i data-lucide="pen-line"></i></button>
<button type="button" class="btn btn-ghost btn-sm app-delete-btn"><i data-lucide="trash-2"></i></button>
</div>
`;

card.querySelector(".app-checkin-btn").addEventListener("click", () => checkIn(app));
card.querySelector(".app-ics-btn").addEventListener("click", () => downloadICS(app));
card.querySelector(".app-edit-btn").addEventListener("click", () => openModal(app));
card.querySelector("[data-voir-capture]")?.addEventListener("click", async (event) => {
event.preventDefault();
try {
const url = await getDownloadURL(storageRef(storage, event.currentTarget.dataset.voirCapture));
window.open(url, "_blank", "noopener");
} catch (error) {
console.error("Capture illisible :", error);
showToast("La capture n'a pas pu être ouverte.", { type: "error" });
}
});
card.querySelector(".app-delete-btn").addEventListener("click", () => removeApplication(app));
card.querySelector(".app-replace-btn")?.addEventListener("click", () => replaceRecommendation(app));
card.querySelector(".app-readiness-btn").addEventListener("click", () => runReadinessCheck(app));

// LE SEUL ENDROIT où une date du catalogue atteint la fiche de
// l'étudiant : son clic, sur la date affichée dans le bouton. Aucune
// écriture automatique ailleurs — même doctrine que le moteur de
// fraîcheur (constat, jamais écriture).
card.querySelector("[data-reprendre-date]")?.addEventListener("click", async (event) => {

const btn = event.currentTarget;
const dateCatalogue = btn.dataset.date;

if (!dateCatalogue) return;

btn.disabled = true;

try {
await updateDoc(doc(db, "users", uid, "applications", app.id), { deadline: dateCatalogue, updatedAt: serverTimestamp() });
trackEvent("application_deadline_reprise", {});
showToast(`Date limite mise à jour : ${formatDateFR(dateCatalogue)}.`, { type: "success" });
await loadApplications();
} catch (error) {
console.error("Impossible de reprendre la date du catalogue :", error);
showToast("La date n'a pas pu être mise à jour — réessayez dans un instant.", { type: "error" });
btn.disabled = false;
}

});

// SUGGÉRER, JAMAIS ÉCRIRE — le seul chemin par lequel une exigence du
// catalogue entre dans le dossier de l'étudiant est ce clic. Même
// doctrine que le bouton « Reprendre la date » de la passe 1.
card.querySelector("[data-ajouter-dossier]")?.addEventListener("click", async (event) => {

const btn = event.currentTarget;
const aAjouter = lecture && lecture.lie && lecture.bourse
? elementsAAjouter(lireExigences(lecture.bourse), app.checklist)
: [];

if (!aAjouter.length) return;

btn.disabled = true;

const nouveaux = aAjouter.map((e) => ({
id: makeChecklistItemId(),
type: e.type,
label: e.label,
status: "manquant",
meta: {}
}));

try {
await saveChecklist(app, [...(Array.isArray(app.checklist) ? app.checklist : []), ...nouveaux], "exigences_catalogue");
showToast(`${nouveaux.length} élément${nouveaux.length > 1 ? "s" : ""} ajouté${nouveaux.length > 1 ? "s" : ""} à votre dossier.`, { type: "success" });
} catch (error) {
console.error("Impossible d'ajouter les exigences au dossier :", error);
showToast("Ces éléments n'ont pas pu être ajoutés — réessayez dans un instant.", { type: "error" });
btn.disabled = false;
}

});

const checklistEl = card.querySelector(".app-checklist");

function focusChecklist() {
const checklistGroupsEl = checklistEl.querySelector(".checklist-groups");
checklistGroupsEl.hidden = false;
checklistEl.classList.add("is-open");
checklistEl.scrollIntoView({ behavior: "smooth", block: "center" });
if (window.lucide) lucide.createIcons();
}

card.querySelectorAll('[data-action="focus-checklist"]').forEach((btn) => {
btn.addEventListener("click", focusChecklist);
});

card.querySelectorAll('[data-journey-step]').forEach((btn) => {

const stepId = btn.dataset.journeyStep;
const step = journeySteps.find((s) => s.id === stepId);
if (!step) return;

if (step.href) {
btn.addEventListener("click", () => { window.location.href = step.href; });
} else if (step.action === "focus-checklist") {
btn.addEventListener("click", focusChecklist);
} else if (step.action === "run-readiness") {
btn.addEventListener("click", () => runReadinessCheck(app));
}

});
const checklistGroupsEl = checklistEl.querySelector(".checklist-groups");

checklistEl.querySelector('[data-action="toggle-checklist"]').addEventListener("click", () => {
checklistGroupsEl.hidden = !checklistGroupsEl.hidden;
checklistEl.classList.toggle("is-open", !checklistGroupsEl.hidden);
if (window.lucide) lucide.createIcons();
});

checklistEl.querySelectorAll('[data-action="add"]').forEach((btn) => {
btn.addEventListener("click", () => openChecklistModal(app, btn.dataset.type));
});

checklistEl.querySelectorAll('[data-action="cycle"]').forEach((btn) => {
btn.addEventListener("click", () => cycleChecklistStatus(app, btn.closest(".checklist-item").dataset.itemId));
});

checklistEl.querySelectorAll('[data-action="remove"]').forEach((btn) => {
btn.addEventListener("click", () => removeChecklistItem(app, btn.closest(".checklist-item").dataset.itemId));
});

checklistEl.querySelector('[data-action="guide"]')?.addEventListener("click", () => {
document.getElementById("recommendationGuideModal").hidden = false;
});

return card;

}

function render() {

applications.sort((a, b) => {
const da = a.nextCheckDate ? new Date(a.nextCheckDate) : new Date("2999-01-01");
const db_ = b.nextCheckDate ? new Date(b.nextCheckDate) : new Date("2999-01-01");
return da - db_;
});

listEl.innerHTML = "";

emptyEl.hidden = applications.length > 0;

applications.forEach((app) => listEl.appendChild(renderCard(app, catalogueIndex ? etatDeLaCandidature(app, catalogueIndex) : null)));

renderStats();

if (window.lucide) lucide.createIcons();

}

// L'index du catalogue de cette page (null si le catalogue est
// indisponible : les cartes s'affichent alors comme avant).
let catalogueIndex = null;

// RATTRAPAGE des candidatures existantes (passe 1/3) : celles créées
// avant l'écriture de la clé n'ont qu'un titre en texte. Quand le
// rapprochement EXACT désigne une bourse sans ambiguïté, la clé est
// écrite UNE fois (catalogueLieLe marque l'essai) ; ambigu ou
// introuvable → rien n'est écrit, la candidature reste hors catalogue
// et s'affiche comme aujourd'hui. Aucune règle Firestore à changer :
// l'étudiant est propriétaire du document et rien n'y contraint les
// champs. La `deadline` n'est jamais touchée ici.
async function rattraperLiaisons() {

if (!catalogueIndex) return;

for (const app of applications) {

if (app.scholarshipId || app.catalogueLieLe) continue;

const lien = lierCandidature(app, catalogueIndex);

if (lien.source !== "deduit" || lien.ambigu) continue;

const patch = { scholarshipId: lien.scholarshipId, programId: lien.programId, catalogueLieLe: serverTimestamp() };

try {
await updateDoc(doc(db, "users", uid, "applications", app.id), patch);
Object.assign(app, { scholarshipId: lien.scholarshipId, programId: lien.programId, catalogueLieLe: new Date() });
} catch (error) {
console.warn(`Liaison au catalogue non enregistrée pour ${app.id} :`, error);
}

}

}

async function loadApplications() {

applications = await fetchApplications(uid);

const seeded = await seedRecommendedSlots(uid, planId, applications, profile);
if (seeded) applications = await fetchApplications(uid);

if (!catalogueIndex) catalogueIndex = await indexDuCatalogue();

await rattraperLiaisons();

await loadAdvisorRequests();

render();

}

async function runReadinessCheck(app) {

const btn = document.getElementById(app.id)?.querySelector(".app-readiness-btn");

if (btn) { btn.disabled = true; btn.querySelector("span").textContent = "Vérification..."; }

try {

const { data } = await generate({
task: "readiness",
input: {
university: app.university,
scholarship: app.scholarship,
checklist: app.checklist || [],
hasGeneratedLetter: !!app.generatedLetter,
deadline: app.deadline,
profileScore,
applicationId: app.id,
profile
}
});

await updateDoc(doc(db, "users", uid, "applications", app.id), {
fitzReadiness: {
ready: data.ready,
missingItems: data.missingItems,
checklistDone: data.checklistDone,
checklistTotal: data.checklistTotal,
daysLeft: data.daysLeft,
checkedAt: serverTimestamp()
}
});

trackEvent("application_readiness_checked", { ready: data.ready });

showToast(
data.ready ? "Candidature prête à être déposée." : "Fitz a trouvé des points à régler avant le dépôt.",
{ type: data.ready ? "success" : "error" }
);

await loadApplications();

} catch (error) {

if (!estArret(error)) {
console.error("Impossible de vérifier cette candidature avant dépôt :", error);
showToast(messageErreurFitz(error), { type: "error" });
}

} finally {

if (btn) { btn.disabled = false; btn.querySelector("span").textContent = "Vérifier avant de déposer"; }

}

}

// Remplace le créneau `app` par une autre suggestion réelle (même
// jointure programs que seedRecommendedSlots), en excluant les
// universités déjà occupées par les autres créneaux — jamais de
// créneau supplémentaire créé, jamais le quota dépassé : c'est une
// mise à jour du document existant (même id), pas une création.
async function replaceRecommendation(app) {

const button = document.querySelector(`[data-app-id="${app.id}"] .app-replace-btn`);
if (button) { button.disabled = true; button.querySelector("span").textContent = "Recherche..."; }

try {

// Deuxième lecture du catalogue dans la même page : gratuite depuis
// le chargeur partagé.
const catalogueSnap = await chargerCatalogue();

const programs = catalogueSnap.programmes.map(({ id, ...reste }) => ({ firestoreId: id, ...reste }));
const universitiesById = new Map(catalogueSnap.universites.map(({ id, ...reste }) => [id, { firestoreId: id, ...reste }]));
const scholarshipsById = new Map(catalogueSnap.bourses.map(({ id, ...reste }) => [id, { firestoreId: id, ...reste }]));

const excludeNames = new Set(
applications.map((a) => (a.university || "").trim().toLowerCase()).filter(Boolean)
);

const eligiblePrograms = programs.filter((p) => {
const uni = universitiesById.get(p.universityId);
// uni.name, pas uni.university (voir la note plus haut dans ce fichier).
return uni && !excludeNames.has((uni.name || "").trim().toLowerCase());
});

// Même moteur que seedRecommendedSlots : « Suggérer une autre
// université » repose le drapeau `isRecommendation`, c'est donc un
// créneau rempli par Fitz au même titre. Le laisser sur
// recommendPrograms aurait gardé ici, et ici seulement, la porte que
// la passe 2/3 vient de fermer ailleurs.
const [alternative] = retenirOpportunites({
profile: profile || {},
programs: eligiblePrograms,
universitiesById,
scholarshipsById
}).retenues;

if (!alternative) {
alert("Aucune autre université compatible avec votre profil n'est disponible pour le moment.");
return;
}

await updateDoc(doc(db, "users", uid, "applications", app.id), {
university: alternative.universityName,
scholarship: alternative.scholarshipTitle,
// Audit du 2026-08-28 : manquait ici aussi (même oubli que
// seedRecommendedSlots) — la nouvelle université suggérée gardait les
// liens de l'ancienne, ou aucun lien si le créneau remplacé n'en avait
// jamais eu.
portalUrl: alternative.applicationUrl || "",
universityWebsite: alternative.universityWebsite || "",
isRecommendation: true,
updatedAt: serverTimestamp()
});

trackEvent("application_recommendation_replaced", {});

await loadApplications();

} catch (error) {

console.error("Impossible de proposer une autre université :", error);
alert("Un souci est survenu — réessayez dans un instant.");

} finally {

if (button) { button.disabled = false; button.querySelector("span").textContent = "Suggérer une autre université"; }

}

}

async function checkIn(app) {

const nextCheckDate = nextCheckFromToday(app.reminderFrequency || 14);

await updateDoc(doc(db, "users", uid, "applications", app.id), { nextCheckDate });

trackEvent("application_checked_in", { status: app.status });

await loadApplications();

}

async function removeApplication(app) {

if (!confirm(`Supprimer le suivi de "${app.university}" ?`)) return;

await deleteDoc(doc(db, "users", uid, "applications", app.id));

await loadApplications();

}

// ---------- Dossier de candidature (checklist) ----------

const checklistFieldsByType = {
recommendation: document.getElementById("clRecommendationFields"),
language_test: document.getElementById("clLanguageFields"),
financial_proof: document.getElementById("clFinancialFields")
};

let checklistContext = { app: null, type: null };

function openChecklistModal(app, type) {

checklistContext = { app, type };

const typeMeta = CHECKLIST_TYPE_META[type];

document.getElementById("checklistModalTitle").textContent = typeMeta.addLabel;
document.getElementById("clType").value = type;
document.getElementById("clItemId").value = "";
document.getElementById("clLabelCaption").textContent = type === "recommendation" ? "Nom du recommandant" : "Intitulé";
document.getElementById("clLabel").value = type === "language_test" ? "Test de langue" : type === "financial_proof" ? "Preuve financière" : "";
document.getElementById("clRecommenderContact").value = "";
document.getElementById("clTestName").value = "TOEFL";
document.getElementById("clTestDate").value = "";
document.getElementById("clScoreRequired").value = "";
document.getElementById("clScoreObtained").value = "";
document.getElementById("clAmountRequired").value = "";
document.getElementById("clFormatRequired").value = "";
document.getElementById("clStatus").value = "manquant";

Object.entries(checklistFieldsByType).forEach(([key, el]) => { el.hidden = key !== type; });

document.getElementById("checklistModal").hidden = false;

}

function closeChecklistModal() {
document.getElementById("checklistModal").hidden = true;
checklistContext = { app: null, type: null };
}

async function saveChecklist(app, newChecklist, eventType) {
await updateDoc(doc(db, "users", uid, "applications", app.id), { checklist: newChecklist, updatedAt: serverTimestamp() });
trackEvent("application_checklist_updated", { type: eventType || "unknown" });
await loadApplications();
}

async function cycleChecklistStatus(app, itemId) {
const checklist = Array.isArray(app.checklist) ? app.checklist : [];
const newChecklist = checklist.map((i) => (i.id === itemId ? { ...i, status: nextChecklistStatus(i.status) } : i));
await saveChecklist(app, newChecklist, "status_cycle");
}

async function removeChecklistItem(app, itemId) {
const checklist = Array.isArray(app.checklist) ? app.checklist : [];
const newChecklist = checklist.filter((i) => i.id !== itemId);
await saveChecklist(app, newChecklist, "remove");
}

document.getElementById("checklistForm").addEventListener("submit", async (event) => {

event.preventDefault();

const { app, type } = checklistContext;
if (!app || !type) return;

const label = document.getElementById("clLabel").value.trim();
if (!label) return;

const item = {
id: makeChecklistItemId(),
type,
label,
status: document.getElementById("clStatus").value,
meta: {}
};

if (type === "recommendation") {
item.meta.recommenderContact = document.getElementById("clRecommenderContact").value.trim();
} else if (type === "language_test") {
item.meta.testName = document.getElementById("clTestName").value;
item.meta.testDate = document.getElementById("clTestDate").value || "";
item.meta.scoreRequired = document.getElementById("clScoreRequired").value.trim();
item.meta.scoreObtained = document.getElementById("clScoreObtained").value.trim();
} else if (type === "financial_proof") {
item.meta.amountRequired = document.getElementById("clAmountRequired").value.trim();
item.meta.formatRequired = document.getElementById("clFormatRequired").value.trim();
}

const newChecklist = [...(Array.isArray(app.checklist) ? app.checklist : []), item];

await saveChecklist(app, newChecklist, type);

closeChecklistModal();

});

document.getElementById("checklistModalClose").addEventListener("click", closeChecklistModal);
document.getElementById("checklistCancelBtn").addEventListener("click", closeChecklistModal);

document.getElementById("checklistModal").addEventListener("click", (event) => {
if (event.target === document.getElementById("checklistModal")) closeChecklistModal();
});

// ---------- Guide lettres de recommandation (contenu statique) ----------

document.getElementById("recommendationGuideClose").addEventListener("click", () => {
document.getElementById("recommendationGuideModal").hidden = true;
});

document.getElementById("recommendationGuideModal").addEventListener("click", (event) => {
if (event.target === document.getElementById("recommendationGuideModal")) document.getElementById("recommendationGuideModal").hidden = true;
});

document.getElementById("copyRecommendationTemplateBtn").addEventListener("click", async () => {

const text = document.getElementById("recommendationTemplateText").value;
const btn = document.getElementById("copyRecommendationTemplateBtn");
const span = btn.querySelector("span");
const original = span.textContent;

try {
await navigator.clipboard.writeText(text);
span.textContent = "Copié !";
} catch (error) {
span.textContent = "Sélectionnez le texte manuellement";
} finally {
setTimeout(() => { span.textContent = original; }, 1800);
}

});

form.addEventListener("submit", async (event) => {

event.preventDefault();

// Règle (pricing-plans.js: extendsPendingApplications) : une candidature
// en attente de réponse, marquée "premiumProtected" pendant qu'un
// abonnement essentiel/accompagnement/premium est actif, doit rester
// suivie même après la fin des 6 mois — l'étudiant ne doit jamais se
// sentir abandonné au moment le plus important. Positionnement clarifié
// 2026-07-31 : ce n'était à l'origine qu'un avantage Premium, étendu
// depuis aux 3 paliers (seule leur limite de candidatures diffère,
// jamais la qualité de l'accompagnement) — condition lue depuis le flag
// de pricing-plans.js plutôt qu'un id de palier en dur, pour rester
// synchronisée avec les données. Nom de champ Firestore ("premiumProtected")
// gardé tel quel pour ne pas casser les documents déjà écrits. Le
// déverrouillage partiel de la PAGE au-delà de l'abonnement expiré est
// géré plus bas : quand bootstrapShell() verrouille applications.html
// dans son ensemble, on vérifie d'abord si une candidature
// premiumProtected existe pour cet utilisateur — si oui,
// renderProtectedReadOnlyState() l'affiche en lecture seule au lieu de
// l'écran de verrouillage générique.
const payload = {
university: fields.university.value.trim(),
scholarship: fields.scholarship.value.trim(),
portalUrl: fields.portalUrl.value.trim(),
status: fields.status.value,
// Lot A : le parcours. Tout ce qui n'est pas exactement
// « preinscription » est une bourse (js/parcours.js).
track: fields.track.value === "preinscription" ? "preinscription" : "bourse",
deadline: fields.deadline.value || null,
reminderFrequency: parseInt(fields.frequency.value, 10),
notes: fields.notes.value.trim(),
premiumProtected: SCHOLARBRIDGE_PLANS[planId]?.extendsPendingApplications === true && fields.status.value === "en_attente",
// Un enregistrement manuel (création ou modification via ce formulaire)
// est un choix délibéré de l'étudiant — même si ce créneau avait été
// pré-rempli par Fitz (isRecommendation), il perd ce statut dès qu'il
// est touché ici. Seul replaceRecommendation() (bouton "Suggérer une
// autre université") repose le flag.
isRecommendation: false,
updatedAt: serverTimestamp()
};

// Sélection catalogue (2026-09-02) : le site officiel de l'université
// et son identifiant Firestore accompagnent la candidature — même
// paire de champs que les créneaux suggérés par Fitz
// (seedRecommendedSlots), pour que la carte affiche les mêmes liens.
if (pickedEntry) {
payload.universityWebsite = pickedEntry.universityWebsite || "";
payload.universityId = pickedEntry.universityId || null;
// La clé vers le catalogue (passe 1/3) — même paire que les créneaux
// suggérés par Fitz (seedRecommendedSlots).
payload.scholarshipId = pickedEntry.scholarshipId || null;
payload.programId = pickedEntry.programId || null;
// Lot A : une candidature liée à une bourse du catalogue ne peut pas
// être une préinscription. La donnée gagne sur le formulaire.
if (pickedEntry.scholarshipId) payload.track = "bourse";
}

if (!payload.university) return;

// Lot E1 : un statut déposé exige une déclaration valide — le select
// ne l'offre qu'à cette condition, mais on le redit ici, en clair.
const veutDeposer = STATUTS_DEPOSES.includes(payload.status);
const previousApp = editingId ? applications.find((a) => a.id === editingId) : null;
const transition = !previousApp || previousApp.status !== payload.status;
if (veutDeposer && transition) {
const file = fields.preuveFichier.files && fields.preuveFichier.files[0];
if (!preuveValide(preuveSaisie(), { parTiers: preuveParTiers }) || !fichierAcceptable(file)) {
showToast(libelleDemande(previousApp, { parTiers: preuveParTiers }), { type: "warning" });
return;
}
}

if (editingId) {

// Issue de candidature (Control Center 2026-09-02) : quand l'étudiant
// fait BASCULER le statut vers admise/refusée/liste d'attente, on le
// signale au suivi — une fois par transition (jamais re-compté quand
// on ré-enregistre une candidature déjà dans cet état).
const OUTCOME_EVENTS = {
admise: "application_admitted",
refusee: "application_rejected",
liste_attente: "application_waitlisted"
};

const previous = applications.find((a) => a.id === editingId);
const outcomeEvent = OUTCOME_EVENTS[payload.status];

// Lot E1 : la preuve, si elle est nouvelle ou modifiée (la capture est
// envoyée AVANT l'écriture Firestore, pour que le chemin existe).
try {
const preuve = await preuveAEcrire(editingId);
if (preuve) payload.preuveDepot = preuve;
} catch (error) {
console.error("Capture non envoyée :", error);
showToast("La capture n'a pas pu être envoyée. Réessayez, ou déclarez un numéro de dossier.", { type: "error" });
return;
}

await updateDoc(doc(db, "users", uid, "applications", editingId), payload);
if (payload.preuveDepot && previous && previous.status !== payload.status) trackEvent("application_deposee_declaree", { mode: payload.preuveDepot.mode, track: payload.track });

if (outcomeEvent && previous && previous.status !== payload.status) {
trackEvent(outcomeEvent, { university: payload.university || "" });
}

} else {

// Grille B (2026-09-07) : le quota se lit PAR PARCOURS. Une préinscription
// demande une offre Dossier France (pre-N, 7 vœux) ; une bourse une
// formule bourse (slot-N). Ici on prévient poliment ; c'est
// firestore.rules qui fait foi.
const track = payload.track;

if (estPreinscription(track) && !peutPreinscription) {
showToast("Cette candidature suit une préinscription : elle demande l'offre Dossier France. Vos formules bourse ne l'accompagnent pas.", { type: "error" });
return;
}

if (!estPreinscription(track) && !peutBourse) {
showToast("Cette candidature suit une bourse : elle demande une formule bourse. Votre offre Dossier France accompagne les préinscriptions.", { type: "error" });
return;
}

const quota = quotaPour(track);
const duParcours = candidaturesDuParcours(track, applications);

if (isQuotaReached(quota, duParcours.length)) {
showToast(estPreinscription(track)
? `${nomFormulePour(track)} accompagne ${quota} vœux Études en France à la fois. Terminez-en un, ou retirez-en un.`
: `Votre formule ${nomFormulePour(track)} permet d'accompagner ${quota} candidature${quota > 1 ? "s" : ""} à la fois. Terminez-en une, ou passez à une formule supérieure pour en suivre davantage.`, { type: "error" });
return;
}

payload.nextCheckDate = nextCheckFromToday(payload.reminderFrequency);
payload.createdAt = serverTimestamp();

// Créneau anti-triche : l'id "slot-N" (bourse) ou "pre-N" (préinscription)
// est borné par firestore.rules — la seule voie de création acceptée.
const slotId = slotIdLibre(duParcours, quota, estPreinscription(track) ? "pre" : "slot");

if (!slotId) {
showToast(`Votre formule ${PLAN_LABELS[planId]} permet d'accompagner ${quota} candidature${quota > 1 ? "s" : ""} à la fois. Terminez-en une, ou passez à une formule supérieure pour en suivre davantage.`, { type: "error" });
return;
}

// Lot E1 : la preuve, si l'étudiant en déclare une dès la création.
try {
const preuve = await preuveAEcrire(slotId);
if (preuve) payload.preuveDepot = preuve;
} catch (error) {
console.error("Capture non envoyée :", error);
showToast("La capture n'a pas pu être envoyée. Réessayez, ou déclarez un numéro de dossier.", { type: "error" });
return;
}

await setDoc(doc(appsCol, slotId), payload);

trackEvent("application_added", { status: payload.status });

// Cas rare mais réel : une candidature créée directement avec une
// issue (l'étudiant enregistre a posteriori un dossier déjà tranché).
const CREATION_OUTCOME_EVENTS = {
admise: "application_admitted",
refusee: "application_rejected",
liste_attente: "application_waitlisted"
};

if (CREATION_OUTCOME_EVENTS[payload.status]) {
trackEvent(CREATION_OUTCOME_EVENTS[payload.status], { university: payload.university || "" });
}

}

closeModal();
await loadApplications();

});

document.getElementById("addApplicationBtn").addEventListener("click", () => openModal(null));
document.getElementById("applicationModalClose").addEventListener("click", closeModal);
document.getElementById("applicationCancelBtn").addEventListener("click", closeModal);

modal.addEventListener("click", (event) => {
if (event.target === modal) closeModal();
});

// Arrivée depuis payment.js après activation de "Premier Dossier"
// (?action=new, voir POST_ACTIVATION_TARGETS) : ouvre directement le
// formulaire plutôt que de laisser l'étudiant chercher le bouton
// "Ajouter" — mais seulement si le quota le permet encore (même
// vérification qu'à l'enregistrement, isQuotaReached), sinon on laisse
// la page se charger normalement. L'URL est nettoyée pour qu'un
// rechargement ou un lien partagé ne rouvre pas le formulaire à chaque
// fois.
function maybeAutoOpenNewApplication() {

const params = new URLSearchParams(window.location.search);
const shouldOpen = params.get("action") === "new";
// Grille B : payment.js renvoie ici avec ?track=preinscription après un
// achat Dossier France — le formulaire s'ouvre hors catalogue, parcours
// pré-rempli (le select du lot A).
const track = params.get("track") === "preinscription" ? "preinscription" : "bourse";

if (!shouldOpen) return;

window.history.replaceState({}, "", window.location.pathname);

if (isQuotaReached(quotaPour(track), candidaturesDuParcours(track, applications).length)) return;

openModal(null);

if (estPreinscription(track) && peutPreinscription) {
enterManualMode();
fields.track.value = "preinscription";
fields.track.dispatchEvent(new Event("change", { bubbles: true }));
}

}

// Arrivée depuis ai-letter.js/ai-email.js via "Retour à ma candidature"
// (applications.html#<applicationId>) : fait défiler jusqu'à la carte
// concernée plutôt que de laisser l'étudiant la rechercher dans la liste.
function maybeScrollToHash() {

const id = window.location.hash.slice(1);
if (!id) return;

document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" });

}

loadApplications().then(() => {
maybeAutoOpenNewApplication();
maybeScrollToHash();
});

}

bootstrapShell({ feature: "applications" }).then(async (ctx) => {

if (ctx.locked) {

document.getElementById("applicationsApp").remove();

const existingApplications = await fetchApplications(ctx.user.uid);
const protectedApplications = existingApplications.filter((app) => app.premiumProtected === true);

if (protectedApplications.length > 0) {
// L'index du catalogue (0 lecture Firestore) pour afficher l'état
// publié par la fiche, même en lecture seule.
const index = await indexDuCatalogue();
renderProtectedReadOnlyState(document.getElementById("lockedState"), protectedApplications, index);
} else {
renderLockedState(document.getElementById("lockedState"), ctx);
}

return;

}

initApplicationsPage(ctx.user.uid, ctx.planId, ctx.profile, ctx.featureFlags, ctx.testerAccess, ctx.hasFitzExpress, ctx.userData?.documentsObtained || {}, ctx.planPreinscriptionId || "");

});
