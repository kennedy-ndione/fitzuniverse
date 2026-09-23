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
serverTimestamp,
arrayUnion,
deleteField
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import { trackEvent } from "./js/analytics.js";
import { initShellChrome, bootstrapShell, unlockingPlans, isFeatureLocked, PLAN_LABELS } from "./js/app-shell.js";
import { isQuotaReached, PLAN_PREINSCRIPTION_LABELS } from "./js/plan-features.js";
// UN SEUL MOTEUR DE CHOIX — lot FITZ-CHOISIT (2026-09-11), décision de
// Charles : « l'étudiant ne choisit pas ses universités ». La doctrine
// de la passe 2/3 (« il a le droit de chercher n'importe quoi ») est
// RÉVOQUÉE : le sélecteur de catalogue, la recherche libre et le lien
// « hors catalogue » ont disparu du parcours bourses. Fitz remplit les
// places (retenirOpportunites — cinq filtres, la même sélection que le
// diagnostic gratuit) ; une proposition ne convient pas ? l'étudiant la
// REFUSE et Fitz propose la suivante, sur le même créneau, sans jamais
// revenir sur une université refusée (users/{uid}.universitesRefusees).
// Le parcours préinscription (pre-N) reste saisi à la main : hors lot.
import { retenirOpportunites, libelleFenetre, etatEcheance, pourquoiPlusProposable, remplacementSansRefus } from "./js/recommend-programs.js";
// Lot ACCEPTATION (2026-09-11) : l'étudiant ACCEPTE le choix de Fitz —
// définitivement. Deux refus par place ; les outils s'ouvrent après
// l'acceptation ; une formule en vente ne supprime jamais une carte
// catalogue. Toutes les décisions sont dans js/fitz-choisit.js (pur).
import {
profilPretPourFitz, universitesAEviter, carteFitz, identiteVerrouillee, etatChoixFitz, PHRASE_REGLE,
placesAFitz, carteCatalogue, etatCarte, estAcceptee, peutRefuser, peutAccepter, peutSupprimer, outilsOuverts,
refusRestants, refusConsommes, statutsAutorises, bourseFermee, REFUS_MAX
} from "./js/fitz-choisit.js";
import { STATUTS_REPONSE } from "./js/journey-map.js";
import { FITZ_UNLOCK_CTA, unlockPlanPhrase, FITZ_READINESS_PHRASES } from "./js/fitz-voice.js";
import { generate, messageErreurFitz, estArret } from "./js/ai/ai-client.js";
import { calculateAiScore } from "./js/profile-score.js";
import { showToast } from "./js/ai/toast.js";
import { computeJourneySteps, etapesDeProcedure } from "./js/application-journey.js";
// Créneaux anti-triche "slot-N" — voir l'en-tête de ce module.
import { slotIdLibre } from "./js/application-actions.js";
import { qualifierEtapes, avertissementsPrematures, LIBELLE_PREREQUIS } from "./js/next-action.js";
// escapeHtml : ces trois chaînes sont des constantes du code, pas de la
// saisie étudiante — mais elles traversent innerHTML, et une constante
// d'aujourd'hui devient un libellé configurable demain.
import { escapeHtml } from "./js/ai/format.js";

// Chargeur de catalogue partagé et mémoïsé — voir js/catalog-data.js.
import { prechargerCatalogue, chargerCatalogue } from "./js/catalog-data.js";

// Le catalogue part tout de suite, en parallèle de la connexion (lot
// NAVIGATION RAPIDE, 2026-09-21) — voir js/catalog-data.js.
prechargerCatalogue();

// Passe espace étudiant 1/3 (2026-09-06) : une candidature est RELIÉE à
// sa fiche du catalogue (clé `scholarshipId` / `programId`, ou
// rapprochement exact des titres) et affiche l'état que la fiche
// publie — etatCandidature(), la seule autorité. La date saisie par
// l'étudiant n'est JAMAIS écrasée : une divergence s'affiche, avec un
// bouton qu'il clique lui-même.
import { indexerCatalogue, lierCandidature, etatDeLaCandidature } from "./js/candidature-catalogue.js";
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
import { lienFitzSur } from "./js/liens-fitz.js";
import { deposeParUnTiers } from "./js/exigences.js";
import { STATUTS_DEPOSES } from "./js/journey-map.js";
import { compressImageToTarget } from "./js/compression-image.js";
// Lot E2 (2026-09-07) : la procédure de portail — des étapes DE PLUS dans
// le moteur de guidage existant, pour une préinscription vers un portail
// documenté (js/procedures/index.js). Aucun nouveau mécanisme.
import { trouverProcedure } from "./js/procedures/index.js";
// Lot S3 : le portail de candidature a quitté le catalogue public. Une
// candidature créée depuis une recommandation doit quand même arriver
// avec son lien — sinon l'étudiant qui paie retrouve la case vide que
// l'audit du 2026-08-28 avait justement fait remplir.
import { chargerPortails, portailUniversite } from "./js/portails.js";
import { texteConsigne, LIBELLES_FIABILITE, LIBELLES_PREUVE } from "./js/procedures/vocabulaire.js";
import { joursRestants, JOURS_PROCHE } from "./js/next-action.js";
// Le quota de candidatures : une seule définition pour la page ET pour
// le hub (lot ESPACE-ÉTUDIANT, 2026-09-13).
import { quotaDeLaFormule } from "./js/parcours-quota.js";
// Lot FITZ-RECOURS : le recours est à l'endroit du blocage — une étape
// prématurée, une étape de procédure, une échéance proche, un élément de
// dossier. Un seul composant, le contexte voyage dans le lien.
import { boutonRecours } from "./js/fitz-recours.js";
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

function renderChecklistItem(item, app) {

const typeMeta = CHECKLIST_TYPE_META[item.type];
const statusLabel = typeMeta.statusLabels[item.status] || item.status;
const calibration = calibrationForItem(item);
const metaLine = checklistItemMetaLine(item);

return `
<li class="checklist-item" data-item-id="${item.id}">
<button type="button" class="checklist-status-chip checklist-status-${item.status}" data-action="cycle">${statusLabel}</button>
<div class="checklist-item-body">
<strong>${escapeHtml(item.label)}</strong>
${metaLine ? `<span class="checklist-item-meta">${escapeHtml(metaLine)}</span>` : ""}
${calibration ? `<span class="checklist-calibration ${calibration.ok ? "is-ok" : "is-warning"}"><i data-lucide="${calibration.ok ? "check-circle" : "alert-triangle"}"></i>${calibration.text}</span>` : ""}
${app ? boutonRecours({ code: "documents", app: app.id, etape: item.type }) : ""}
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

/**
 * Le « dossier » d'un vœu de préinscription : un renvoi vers la route,
 * et rien d'autre — sauf si des éléments y avaient été saisis, auquel
 * cas ils restent visibles et supprimables (voir le commentaire dans
 * renderChecklistSection).
 */
function htmlDossierDeVoeu(app, checklist) {

const items = Array.isArray(checklist) ? checklist : [];

const anciens = items.length ? `
<div class="checklist-groups">
<p class="checklist-group-empty">Ces éléments avaient été ajoutés sur ce vœu avant que les pièces ne vivent dans votre route. Vous pouvez les retirer : ils ne sont plus lus nulle part.</p>
<ul class="checklist-items">${items.map((item) => renderChecklistItem(item, app)).join("")}</ul>
</div>` : "";

return `
<div class="app-checklist app-checklist--voeu">
<p class="app-voeu-pieces">
<i data-lucide="paperclip"></i>
<span>Vos pièces se préparent <strong>à l'étape 4 de votre route</strong> — la liste exacte pour votre pays, le poids maximum de chaque fichier et ce qui doit être traduit. Elles valent pour tous vos vœux : rien à refaire ici.
<a href="espace-preinscription.html?etape=pieces">Ouvrir l'étape 4</a></span>
</p>
${anciens}
</div>`;

}

function renderChecklistSection(app, lecture) {

const checklist = Array.isArray(app.checklist) ? app.checklist : [];

// LE VŒU N'A PAS DE DOSSIER ICI (lot B2, 2026-09-18).
//
// RÉSERVE NOMMÉE AU LOT R13, TRANCHÉE. Ce bloc proposait à un vœu de
// préinscription trois groupes — lettres de recommandation, test de
// langue, preuve financière — dans le vocabulaire des bourses
// (« Non demandée », « Demander une lettre »). Trois problèmes, pas un :
//
//   1. LA PROCÉDURE NE LES DEMANDE PAS toutes. Études en France ne
//      réclame aucune lettre de recommandation ; la liste exacte des
//      pièces, elle, vit à l'étape 4 de la route, avec le poids maximum
//      de chaque fichier et l'état des traductions.
//   2. LES PIÈCES D'UNE PRÉINSCRIPTION SONT AU NIVEAU DU DOSSIER, pas
//      du vœu : le même diplôme sert les sept vœux. Une liste PAR vœu
//      invitait à saisir sept fois la même chose.
//   3. LA PREUVE FINANCIÈRE a déjà son étape — la 2. Un troisième
//      endroit pour la même chose, c'est le motif que les lots R5, R6,
//      R7 et R13 ont payé.
//
// CE QUI A ÉTÉ SAISI N'EST PAS CACHÉ : htmlDossierDeVoeu garde les
// éléments existants, affichés et supprimables. Masquer une donnée
// qu'un étudiant a entrée serait la perdre pour lui. Seuls les boutons
// d'AJOUT s'en vont, avec le vocabulaire qui n'est pas le sien.
//
// Le renvoi passe AVANT le calcul des groupes : rien de ce qui suit ne
// concerne un vœu.
if (lireParcours(app) === "preinscription") return htmlDossierDeVoeu(app, checklist);

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
${items.length ? `<ul class="checklist-items">${items.map((item) => renderChecklistItem(item, app)).join("")}</ul>` : `<p class="checklist-group-empty">Rien pour l'instant.</p>`}
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

// `item.text` et `item.actionHref` viennent de la réponse du modèle
// (data.missingItems) : c'est du texte qu'on n'a pas écrit, injecté par
// innerHTML. Il s'échappe comme une saisie d'étudiant, et pour la même
// raison — on ne fait confiance qu'à ce qui vient du code.
function renderReadinessItem(item) {

// Un href ne se protège pas en échappant : `javascript:…` ne contient
// aucun caractère à échapper. Lot DÉPART (2026-09-21) : « avoir l'air
// d'un chemin » ne suffit plus — le modèle inventait /profil,
// /candidature/dossier… (404). Seules les pages de js/liens-fitz.js
// donnent une ancre ; tout le reste redevient un bouton.
const lien = lienFitzSur(item.actionHref);
if (lien) {
return `
<a href="${escapeHtml(lien)}" class="ai-checklist-item app-readiness-item">
<i data-lucide="arrow-right-circle"></i>
<span>${escapeHtml(item.text)}</span>
</a>`;
}

return `
<button type="button" class="ai-checklist-item app-readiness-item" data-action="focus-checklist">
<i data-lucide="arrow-right-circle"></i>
<span>${escapeHtml(item.text)}</span>
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
</p>
${boutonRecours({ code: "prerequis", app: app.id, etape: alertes[0].id }, { classe: "fitz-recours--bloc" })}`
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
? `${step.label} — à faire après ${(step.bloqueParLibelles || step.bloquePar.map((id) => LIBELLE_PREREQUIS[id] || id)).join(" et ")}`
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

// LOT S4 — LA PAGE EST SCOPÉE PAR L'ESPACE D'OÙ L'ON VIENT.
// Une seule page, deux contenus : un client préinscription n'y voit que
// ses pre-N, un client bourse que ses slot-N. Sans cela, un client qui
// a les deux accompagnements lisait une liste mélangée où un dossier
// France s'intercalait entre deux bourses, avec des étapes et un
// vocabulaire qui ne se répondaient pas.
// ESPACE vaut "" pour un compte sans accompagnement (la page est alors
// verrouillée de toute façon, mais ses candidatures protégées doivent
// rester lisibles) : dans ce cas, on ne filtre rien.
let ESPACE = "";

// L'espace où l'on SE TROUVE, qui décide du parcours d'une NOUVELLE
// candidature. À ne pas confondre avec ESPACE ci-dessus, qui filtre la
// LISTE : un client des deux accompagnements voit ses deux parcours
// (ESPACE vide), mais il en écrit UN — celui de l'espace courant. Les
// avoir confondus faisait écrire « bourse » à un client passé en
// préinscription, sur un identifiant slot-N ; le harnais l'a attrapé.
let ESPACE_ECRITURE = "";

// Lot FITZ-CHOISIT : les universités que l'étudiant a refusées
// (users/{uid}.universitesRefusees). Lues avec la session ; complétées
// localement à chaque refus, pour que le remplacement suivant les évite
// sans relire le document.
let universitesRefusees = [];

async function fetchApplications(uid) {
const snapshot = await getDocs(collection(db, "users", uid, "applications"));
const toutes = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
return ESPACE ? toutes.filter((app) => lireParcours(app) === ESPACE) : toutes;
}

// ÉCRAN BLANC POUR UN ABONNEMENT EXPIRÉ — corrigé le 2026-09-13.
//
// Cette fonction vivait À L'INTÉRIEUR de initApplicationsPage(). Or
// renderProtectedReadOnlyState, juste en dessous, est déclarée au niveau
// du module et l'appelle : une déclaration de fonction n'est hissée que
// dans SA portée, donc `recoursEcheance is not defined`. Le `.then()`
// d'amorçage n'a pas de `.catch`, le loader avait déjà été retiré par
// bootstrapShell : l'étudiant tombait sur une PAGE VIDE.
//
// Et le chemin qui casse est exactement celui que ce code existe pour
// protéger : abonnement terminé + au moins une candidature encore en
// attente de réponse. Remontée au niveau du module — elle n'utilise que
// des imports (joursRestants, JOURS_PROCHE, boutonRecours).
//
// Seuils de js/next-action.js : 3 j critique, 14 j proche.
function recoursEcheance(app) {
const jours = app.deadline ? joursRestants(app.deadline, new Date()) : null;
if (jours === null || jours > JOURS_PROCHE) return "";
return boutonRecours({ code: "echeance", app: app.id });
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
<h3>${escapeHtml(app.university)}</h3>
${app.scholarship ? `<p class="app-card-scholarship">${escapeHtml(app.scholarship)}</p>` : ""}
</div>
<span class="app-status-pill app-status-${app.status}">${STATUS_LABELS[app.status] || app.status}</span>
</div>

<div class="app-card-meta">
${renderEcheanceCandidature(app, lecture)}
${recoursEcheance(app)}
<span class="${urgency.urgent ? "is-urgent" : ""}"><i data-lucide="bell"></i>${urgency.text}</span>
<span class="is-protected"><i data-lucide="shield-check"></i>Suivi maintenu même après votre abonnement</span>
</div>

${renderDivergence(app, lecture, { bouton: false })}

${app.notes ? `<p class="app-card-notes">${escapeHtml(app.notes)}</p>` : ""}

${(app.universityWebsite || app.portalUrl) ? `<div class="app-card-actions">
${app.universityWebsite ? `<a href="${escapeHtml(app.universityWebsite)}" target="_blank" rel="noopener" class="btn btn-ghost btn-sm"><i data-lucide="external-link"></i><span>Site université</span></a>` : ""}
${app.portalUrl ? `<a href="${escapeHtml(app.portalUrl)}" target="_blank" rel="noopener" class="btn btn-ghost btn-sm"><i data-lucide="external-link"></i><span>Candidature</span></a>` : ""}
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
// LE 3e ARGUMENT EST L'ESPACE, ET IL MANQUAIT.
// unlockingPlans(planId, flags, espace) existe précisément pour ça (voir
// sa note dans js/plan-features.js : « on montrait la porte des bourses
// à quelqu'un venu acheter un dossier France »). Sans lui, un client
// Diagnostic France — qui n'a pas `applications` — atterrissait ici et
// se voyait proposer le Forfait Premier Dossier et offers.html#premier-
// dossier : une offre BOURSE, à quelqu'un qui prépare une préinscription.
const target = unlockingPlans(ctx.planId, flags, ctx.espace || "")[0];

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

// Lot ACCEPTATION, partie 0 : Signature (quota Infinity, retirée de la
// vente) n'est plus laissée vide — Fitz remplit 12 places, le plafond de
// remplissage d'un quota infini (placesAFitz, js/fitz-choisit.js).
// Le quota lui-même passe par quotaDeLaFormule : c'était la troisième
// lecture directe de `maxAccompaniedApplications` du fichier, et une
// lecture de plus est une divergence de plus.
const quota = placesAFitz(quotaDeLaFormule({
espace: "bourse",
planId,
plans: window.SCHOLARBRIDGE_PLANS || null
}));

if (quota <= 0) return false;

const missing = quota - existingApplications.length;

if (missing <= 0) return false;

// Lot FITZ-CHOISIT : pas de choix avant de connaître l'étudiant. Sans
// nationalité, niveau visé, domaine et au moins une langue, Fitz ne
// remplit pas : un profil vide recevait des propositions génériques qui
// occupaient ses places. Le moteur, lui, tolère les champs absents.
if (!profilPretPourFitz(profile).pret) return false;

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

// Lot FITZ-CHOISIT : les universités à éviter — celles des autres
// créneaux (par identifiant, ou par nom pour les candidatures
// anciennes) et celles que l'étudiant a refusées — passent au moteur
// (exclureUniversites), qui les écarte AVANT toute sélection.
// retenirOpportunites, et non recommendPrograms : un créneau que Fitz
// remplit lui-même ne vise jamais un cycle clos ni un mauvais niveau.
const { retenues } = retenirOpportunites({
profile: profile || {},
programs,
universitiesById,
scholarshipsById,
exclureUniversites: universitesAEviter({ applications: existingApplications, universitesRefusees, universitesParNom: indexParNom(universitiesById) })
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

// La carte, construite par la MÊME fonction pure que le remplacement
// (js/fitz-choisit.js) : clés du catalogue, portail, site, statut « à
// préparer », date à zéro, dossier vide.
await setDoc(doc(appsCol, slotId), {
...carteFitz(rec, { portalUrl: portailDeLEntree(rec), nextCheckDate: nextCheckFromToday(14) }),
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
// nom d'université (normalisé) → identifiant, pour rapprocher les
// candidatures anciennes qui n'ont qu'un nom (universitesAEviter).
function indexParNom(universitiesById) {
const m = new Map();
for (const [id, u] of universitiesById) m.set(String(u.name || "").trim().toLowerCase(), id);
return m;
}

let LIBELLE_PREINSCRIPTION = "";

function initApplicationsPage(uid, planId, profile, featureFlags, testerAccess, hasFitzExpress, documentsObtained = {}, planPreinscriptionId = "") {

const profileScore = calculateAiScore(profile);
const advisorUnlocked = !isFeatureLocked(planId, featureFlags, "advisor", testerAccess, hasFitzExpress, planPreinscriptionId);

const planBourse = window.SCHOLARBRIDGE_PLANS && window.SCHOLARBRIDGE_PLANS[planId];
const planPre = window.SCHOLARBRIDGE_PLANS && window.SCHOLARBRIDGE_PLANS[planPreinscriptionId];
const peutBourse = testerAccess || !!(planBourse && planBourse.maxAccompaniedApplications > 0);
const peutPreinscription = testerAccess || !!(planPre && planPre.maxPreinscriptions > 0);

function estPreinscription(track) { return track === "preinscription"; }
// LE QUOTA A UNE SEULE DÉFINITION, ET ELLE N'EST PLUS ICI.
// Le hub (dashboard.js) doit répondre à la même question — « combien de
// candidatures cette formule donne-t-elle ? » — pour n'en proposer ni
// plus ni moins. Deux lectures des mêmes deux champs auraient divergé au
// premier correctif ; elles vivent maintenant dans js/parcours-quota.js,
// pure et testée sous Node.
function quotaPour(track) {
return quotaDeLaFormule({
espace: estPreinscription(track) ? "preinscription" : "bourse",
planId,
planPreinscriptionId,
plans: window.SCHOLARBRIDGE_PLANS || null
});
}
function candidaturesDuParcours(track, liste) {
return (liste || []).filter((a) => (lireParcours(a) === "preinscription") === estPreinscription(track));
}
function nomFormulePour(track) {
return estPreinscription(track) ? (LIBELLE_PREINSCRIPTION || PLAN_PREINSCRIPTION_LABELS[planPreinscriptionId] || "Dossier France") : PLAN_LABELS[planId];
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

// Lot ACCEPTATION : les statuts INTERDITS à la carte ouverte dans le
// formulaire (statutsAutorises, js/fitz-choisit.js). Ils sont retirés
// de la liste (hidden + disabled) ; la preuve de dépôt ne les rouvre
// jamais.
let statutsInterdits = new Set();

function restreindreStatuts(app) {
const tous = [...fields.status.options].map((o) => o.value);
const autorises = new Set(statutsAutorises(app, tous));
statutsInterdits = new Set(tous.filter((v) => !autorises.has(v)));
fields.status.querySelectorAll("option").forEach((opt) => {
const interdit = statutsInterdits.has(opt.value);
opt.hidden = interdit;
opt.disabled = interdit;
});
}

// Active/désactive les statuts déposés selon la validité de la preuve,
// et dit pourquoi.
function rafraichirPreuve() {
if (preuveBlock.hidden) return;
const preuve = preuveSaisie();
const file = fields.preuveFichier.files && fields.preuveFichier.files[0];
const valide = preuveValide(preuve, { parTiers: preuveParTiers }) && fichierAcceptable(file);

fields.status.querySelectorAll("option").forEach((opt) => {
if (STATUTS_DEPOSES.includes(opt.value)) opt.disabled = !valide || statutsInterdits.has(opt.value);
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
//
// « proprement » valait « en_cours », écrit en dur — et sur une carte
// DÉJÀ DÉPOSÉE ce statut est précisément l'un de ceux que
// statutsAutorises() interdit (une candidature déposée ne redescend
// pas). Il suffisait d'effacer son numéro de dossier pour que le
// formulaire sélectionne tout seul une option `hidden` + `disabled`,
// puis refuse l'enregistrement avec « Une candidature déposée ne
// redescend pas » : l'étudiant était bloqué par un statut qu'il n'avait
// pas choisi. On retombe sur le premier statut RÉELLEMENT ouvert.
const opt = fields.status.selectedOptions[0];
if (opt && opt.disabled) {
const repli = Array.from(fields.status.options).find((o) => !o.disabled && !statutsInterdits.has(o.value));
if (repli) {
fields.status.value = repli.value;
fields.status.dispatchEvent(new Event("change", { bubbles: true }));
}
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
// Lot ACCEPTATION : une carte catalogue PROPOSÉE ne se dépose pas — on
// accepte d'abord. Le bloc de dépôt n'a rien à lui proposer.
preuveBlock.hidden = !!app && carteCatalogue(app) && !estAcceptee(app);
if (preuveBlock.hidden) return;
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
// transition). On n'impose rien ici — sauf les statuts que le lot
// ACCEPTATION interdit à cette carte (jamais de retour en arrière).
fields.status.querySelectorAll("option").forEach((opt) => { opt.disabled = statutsInterdits.has(opt.value); });
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
// LE FORMULAIRE (lot FITZ-CHOISIT, 2026-09-11). Le sélecteur de
// catalogue de la refonte du 2026-09-02 (recherche libre + repli « hors
// catalogue ») a DISPARU : dans le parcours bourses, c'est Fitz qui
// choisit (seedRecommendedSlots), et l'étudiant refuse une proposition
// plutôt que d'en saisir une. Les champs libres ne servent plus qu'à
// la PRÉINSCRIPTION (vœux pre-N, saisis à la main — hors lot) et aux
// candidatures bourse anciennes créées hors catalogue, qui restent
// modifiables sur leurs champs autorisés (aucune régression).
// ==========================================================
const manualFields = document.getElementById("manualFields");
const detailsSection = document.getElementById("detailsSection");
const identiteNote = document.getElementById("identiteVerrouilleeNote");

// Lot A : une candidature liée à une bourse du catalogue ne peut pas
// être une préinscription — le select se verrouille sur « Bourse » et
// le dit. Hors catalogue (repli manuel ou édition), l'étudiant choisit.
// LOT S4 : plus de select à verrouiller — l'espace impose le parcours.
// La fonction reste pour ses appelants, et ne fait plus rien : une
// candidature créée depuis le catalogue des bourses dans l'espace
// préinscription n'existe pas, l'espace ayant déjà tranché.

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
const saveBtn = document.getElementById("applicationSaveBtn");

// Les champs d'identité : université, bourse, portail. Verrouillés quand
// l'identité vient du catalogue (Fitz a choisi), libres pour une
// préinscription ou une candidature bourse ancienne hors catalogue.
function verrouillerIdentite(verrouille) {
for (const champ of [fields.university, fields.scholarship, fields.portalUrl]) {
champ.readOnly = verrouille;
champ.setAttribute("aria-readonly", verrouille ? "true" : "false");
champ.closest(".apps-field")?.classList.toggle("is-verrouille", verrouille);
}
if (identiteNote) identiteNote.hidden = !verrouille;
}

function enterManualMode() {


manualFields.hidden = false;
fields.university.required = true;
verrouillerIdentite(false);
viderChampsCatalogue();
detailsSection.hidden = false;
saveBtn.disabled = false;

fields.university.focus();

}

function openModal(app) {

editingId = app ? app.id : null;
modalTitle.textContent = app ? "Modifier la candidature" : "Nouvelle candidature";

fields.university.value = app?.university || "";
fields.scholarship.value = app?.scholarship || "";
fields.portalUrl.value = app?.portalUrl || "";
fields.status.value = app?.status || "a_preparer";
fields.deadline.value = app?.deadline || "";
fields.frequency.value = app?.reminderFrequency || "14";
fields.notes.value = app?.notes || "";

// Lot ACCEPTATION : les statuts que cette carte peut prendre — une carte
// proposée n'offre pas les statuts déposés (on accepte d'abord), une
// carte déposée ne redescend pas (js/fitz-choisit.js : statutsAutorises).
restreindreStatuts(app);

// Lot E1 : la déclaration de dépôt, selon la candidature (et sa bourse :
// déposée par un tiers ou non).
preparerPreuve(app, app && catalogueIndex ? etatDeLaCandidature(app, catalogueIndex) : null);

if (app) {

// Édition. Lot FITZ-CHOISIT : l'université, la bourse, le portail et
// le site d'une candidature bourse choisie par Fitz sont en LECTURE
// SEULE — l'étudiant ne modifie que le statut, la date, les notes, les
// rappels et la preuve de dépôt. Une préinscription, ou une candidature
// bourse ancienne hors catalogue, garde ses champs libres.
manualFields.hidden = false;
fields.university.required = true;
verrouillerIdentite(identiteVerrouillee(app));
detailsSection.hidden = false;
saveBtn.disabled = false;

} else {

// Création : saisie manuelle. PLUS AUCUN APPEL N'ARRIVE ICI depuis le
// lot R13 (2026-09-18) : la préinscription pose ses vœux à l'étape 3 de
// la route, l'espace bourses laisse Fitz remplir ses places. La branche
// reste pour le jour où l'espace bourses rouvrira une création à la
// main ; elle n'est pas un chemin vivant, et ne doit pas être lue
// comme tel.
enterManualMode();

}

modal.hidden = false;

}

function closeModal() {
modal.hidden = true;
editingId = null;
verrouillerIdentite(false);
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

// Lot E2 : la procédure de portail de cette candidature, ou null. Une
// PRÉINSCRIPTION seulement ; la destination se lit sur l'université du
// catalogue (ou sur l'URL du portail), la résidence sur le profil.
function procedurePour(app) {
if (lireParcours(app) !== "preinscription") return null;
const uni = catalogueIndex && app.universityId ? catalogueIndex.uniParId.get(app.universityId) : null;
return trouverProcedure({
paysDestination: (uni && uni.country) || "",
portailUrl: app.portalUrl || (uni && uni.applicationPortalUrl) || "",
paysResidence: (profile && (profile.originCountry || profile.country)) || ""
});
}

// La procédure sur la carte : chaque étape avec sa consigne (ferme, ou
// avec sa réserve visible), son échéance de campagne, ses pièces, sa
// source — et la case « Fait », avec la preuve attendue.
function renderProcedure(app, steps) {

const etapes = qualifierEtapes(steps).filter((s) => s.action === "procedure");
if (!etapes.length) return "";

const faites = etapes.filter((s) => s.etat === "faite").length;
const aConfirmer = etapes.filter((s) => s.procedure.fiabilite === "a_confirmer").length;
// Lot S1b : ce titre disait « depuis le Sénégal » à tout le monde, y
// compris à un étudiant qui avait déclaré vivre ailleurs. Il nomme
// maintenant la résidence RÉELLE du profil, et ne nomme rien quand elle
// est inconnue. Entre parenthèses : « depuis le Sénégal », « depuis la
// Côte d'Ivoire », « depuis Maurice » — l'article change avec le pays,
// et une phrase qui se trompe d'article à chaque profil n'est pas une
// phrase, c'est un gabarit.
const procedure = procedurePour(app);
const residence = String((profile && (profile.originCountry || profile.country)) || "").trim();
const documentee = !!(procedure && procedure.residenceDocumentee);
const aujourdhui = new Date();

const lignes = etapes.map((s) => {
const p = s.procedure;
const jours = p.echeanceISO ? joursRestants(p.echeanceISO, aujourdhui) : null;
const echeance = p.echeanceISO
? `<p class="app-procedure-echeance${jours !== null && jours <= 14 && !p.echeanceDebut ? " is-proche" : ""}"><i data-lucide="calendar"></i><span>${p.echeanceDebut ? "À partir du" : "Jusqu'au"} ${escapeHtml(formaterDate(p.echeanceISO))}${jours !== null && !p.echeanceDebut ? (jours < 0 ? " — dépassé" : jours === 0 ? " — aujourd'hui" : ` — dans ${jours} j`) : ""}</span></p>`
: "";
const pieces = p.pieces.length
? `<ul class="app-procedure-pieces">${p.pieces.map((piece) => `<li>${escapeHtml(piece.nom)}${piece.tailleMax ? ` <span>· ${escapeHtml(piece.tailleMax)}</span>` : ""}${piece.traduction ? " <span>· traduction assermentée</span>" : ""}${piece.legalisation ? " <span>· légalisation</span>" : ""}</li>`).join("")}</ul>`
: "";
const saisie = p.saisie || {};
const demandePreuve = p.preuve !== "aucune";
return `<li class="app-procedure-etape is-${s.etat} fiab-${p.fiabilite}" data-procedure-etape="${s.id}">
<div class="app-procedure-tete">
<i data-lucide="${s.etat === "faite" ? "check" : s.icon}"></i>
<strong>${escapeHtml(s.label)}</strong>
<span class="app-procedure-fiabilite is-${p.fiabilite}">${escapeHtml(LIBELLES_FIABILITE[p.fiabilite] || p.fiabilite)}</span>
</div>
<p class="app-procedure-consigne">${escapeHtml(texteConsigne(p))}</p>
${echeance}
${pieces}
${s.etat === "prematuree" ? `<p class="app-procedure-attente"><i data-lucide="info"></i><span>À faire après ${escapeHtml((s.bloqueParLibelles || s.bloquePar).join(" et "))}.</span></p>` : ""}
${boutonRecours({ code: p.type === "paiement" ? "paiement" : "etape", app: app.id, etape: s.id })}
<form class="app-procedure-faire" data-procedure-form="${s.id}">
<label><input type="checkbox" name="faite" ${saisie.faite === true ? "checked" : ""}> <span>Fait${saisie.faitLe ? ` le ${escapeHtml(formaterDate(String(saisie.faitLe).slice(0, 10)))}` : ""}</span></label>
${demandePreuve ? `<input type="text" name="preuve" maxlength="64" placeholder="${escapeHtml(LIBELLES_PREUVE[p.preuve] || "référence")}" value="${escapeHtml(saisie.preuve || "")}" aria-label="${escapeHtml(LIBELLES_PREUVE[p.preuve] || "référence")}">` : ""}
<button type="submit" class="btn btn-ghost btn-sm"><span>Enregistrer</span></button>
</form>
<a class="app-procedure-source" href="${escapeHtml(p.source)}" target="_blank" rel="noopener">Source — vérifié le ${escapeHtml(formaterDate(p.verifieLe))}</a>
</li>`;
}).join("");

// LOT S2-MODÈLE : l'avertissement que l'organisme officiel du pays
// publie lui-même. Campus France Maroc met en garde, frontalement,
// contre les intermédiaires privés : aucun n'est accrédité, leurs
// dossiers « sont aisément reconnaissables ». Le cacher à un
// utilisateur marocain serait exactement le comportement dénoncé ; le
// lui montrer prouve le contraire. Il est donc HORS du <details> —
// visible sans un clic, non repliable — et absent sans bloc vide quand
// la couche n'en porte pas.
const avertissement = (procedure && procedure.avertissement) || "";
const blocAvertissement = avertissement
? `<p class="app-procedure-avertissement"><i data-lucide="triangle-alert"></i><span>${escapeHtml(avertissement)}</span></p>`
: "";

return `${blocAvertissement}<details class="app-procedure">
<summary><i data-lucide="route"></i><span>Procédure ${escapeHtml((procedure && procedure.portail.nom) || "de portail")}${residence ? ` (résidence : ${escapeHtml(residence)})` : ""} · ${faites}/${etapes.length} étape${etapes.length > 1 ? "s" : ""}${aConfirmer ? ` · ${aConfirmer} à confirmer` : ""}</span></summary>
<p class="app-procedure-lead">${documentee
? "Documentée depuis les sources publiques de Campus France. Les montants, les dates et les lieux sont ceux de votre pays de résidence. Une consigne « à confirmer » sera précisée à la première passe réelle sur la plateforme."
: "Ces étapes sont celles de la plateforme : elles valent pour tout candidat. Ce qui dépend de votre pays de résidence — frais de dossier, dates de la campagne, lieu de l'entretien — n'est pas encore vérifié pour lui, et chaque étape concernée le dit."}</p>
<ol class="app-procedure-liste">${lignes}</ol>
</details>`;

}

// Enregistre une étape de procédure. Une seule saisie, deux effets : la
// SOUMISSION cochée avec son numéro remplit aussi la preuve de dépôt
// (lot E1) — jamais deux champs à remplir.
async function enregistrerEtapeProcedure(app, etape, { faite, preuve }) {

const faitLe = dateISOAujourdhui();
const saisie = { faite: faite === true, preuve: (preuve || "").trim().slice(0, 64), faitLe };
const patchDoc = { [`procedure.${etape.id}`]: saisie, updatedAt: serverTimestamp() };

if (etape.procedure.type === "soumission" && saisie.faite && saisie.preuve) {
const nouvelle = { mode: "numero", numeroDossier: saisie.preuve, deposeLe: faitLe };
const actuelle = lirePreuve(app);
const memeNumero = actuelle && actuelle.numeroDossier === saisie.preuve;
if (!memeNumero && preuveValide(nouvelle, { parTiers: false })) {
patchDoc.preuveDepot = { ...nouvelle, declareLe: serverTimestamp() };
if (actuelle && actuelle.fichier) patchDoc.preuveDepot.fichier = actuelle.fichier;
}
}

await updateDoc(doc(db, "users", uid, "applications", app.id), patchDoc);
trackEvent("procedure_etape", { etape: etape.id, faite: saisie.faite });
showToast(saisie.faite ? `« ${etape.label} » enregistrée.` : `« ${etape.label} » décochée.`, { type: "success" });

}

// Lot ACCEPTATION (2026-09-11) : une carte catalogue PROPOSÉE se refuse
// (deux fois par place, puis Fitz tranche) ou s'accepte — et accepter
// est définitif. Une formule EN VENTE ne supprime jamais une carte
// catalogue : elle reste dans « Mes candidatures », c'est l'historique
// du dossier ; une décision reçue ne libère plus de place, la suite est
// décidée par l'équipe. Une formule retirée de la vente garde ce qui lui
// a été vendu : suppression d'une carte acceptée dans un statut de
// réponse. peutRefuser / peutSupprimer / etatCarte : js/fitz-choisit.js.
// Une préinscription (pre-N) et une carte ancienne hors catalogue
// gardent leur comportement d'avant.

// La fermeture d'une bourse par l'organisme, lue dans l'instantané du
// catalogue (bourse présente avec isActive:false, ou absente).
// `lecture` vient de etatDeLaCandidature() : `programme` et `bourse`
// sont null quand la fiche a été retirée. Sans index (catalogue
// indisponible), on ne déclare jamais une bourse fermée.
function fermeeParLOrganisme(app, lecture) {
if (!carteCatalogue(app) || !catalogueIndex || !lecture) return false;
return bourseFermee(app, { programme: lecture.programme || null, bourse: lecture.bourse || null });
}

function formatDateAcceptation(valeur) {
const d = valeur && typeof valeur.toDate === "function" ? valeur.toDate() : new Date(valeur);
return isNaN(d) ? "" : d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

// Le bloc d'acceptation d'une carte catalogue : bouton principal,
// refus restants, proposition finale, pastille « Acceptée le … » ou
// bourse fermée. Rien pour une carte qui n'est pas du catalogue.
function renderAcceptation(app, fermee) {
const etat = etatCarte(app);
if (!etat) return "";
if (fermee) {
return `<div class="app-acceptation app-acceptation--fermee" data-etat="fermee">
<p><i data-lucide="alert-circle"></i><span>Cette bourse a été fermée par l'organisme : Fitz vous propose une remplaçante.</span></p>
<div class="app-acceptation-actions"><button type="button" class="btn btn-primary btn-sm app-remplacer-btn"><i data-lucide="refresh-cw"></i><span>Voir la remplaçante</span></button></div>
</div>`;
}
if (etat.code === "acceptee") {
const date = etat.sansDate ? "" : formatDateAcceptation(app.accepteeLe);
return `<div class="app-acceptation app-acceptation--acceptee" data-etat="acceptee"><span class="app-acceptee-pill"><i data-lucide="check-circle"></i>${date ? `Acceptée le ${escapeHtml(date)}` : "Acceptée"}</span></div>`;
}
const restants = refusRestants(app);
if (etat.code === "finale") {
return `<div class="app-acceptation app-acceptation--finale" data-etat="finale">
<p><i data-lucide="info"></i><span>Fitz a fait sa proposition finale pour cette place. Si cette université pose un vrai problème, <a href="messages.html#supportCard">écrivez-nous</a>.</span></p>
<div class="app-acceptation-actions"><button type="button" class="btn btn-primary btn-sm app-accept-btn"><i data-lucide="check"></i><span>J'accepte cette université</span></button></div>
</div>`;
}
return `<div class="app-acceptation app-acceptation--proposee" data-etat="proposee">
<div class="app-acceptation-actions">
<button type="button" class="btn btn-primary btn-sm app-accept-btn"><i data-lucide="check"></i><span>J'accepte cette université</span></button>
<button type="button" class="btn btn-secondary btn-sm app-refuse-btn"><i data-lucide="refresh-cw"></i><span>Refuser et demander une autre université</span></button>
</div>
<p class="app-refus-restants" data-refus-restants="${restants}">Il vous reste ${restants} refus pour cette place</p>
</div>`;
}

/* LOT P2 (2026-09-19) — ON N'ACCEPTE PAS UN NOM, ON ACCEPTE UN CHOIX.

Cette carte porte le bouton « J'accepte cette université ». Accepter
est DÉFINITIF et l'étudiant n'a que deux refus par place — or elle ne
montrait ni le pays, ni la moindre raison. Le pays et la raison sont
calculés par retenirOpportunites() depuis toujours ; carteFitz() ne les
écrivait pas (corrigé dans le même lot).

Les cartes écrites AVANT ce lot n'ont pas ces champs : la ligne
disparaît alors entièrement plutôt que d'afficher un pays vide. */
function renderFaitsDuChoix(app, lecture) {

if (!app || !app.isRecommendation) return "";

// La ligne de fenêtre n'existe que sur les cartes qui portaient de quoi
// la calculer (lot P2) — jugé sur la carte TELLE QU'ÉCRITE, avant le
// recalcul ci-dessous. Sans cette garde, le recalcul l'aurait ajoutée
// aux cartes anciennes (ALU, TDV), en doublon de la ligne d'échéance
// que la carte affiche déjà plus bas.
const portaitUneFenetre = !!(app.certitude || app.dateConfirmee === true || typeof app.jours === "number" || app.dateConfirmee === false);
let close = false;

// LE DÉCOMPTE SE RECALCULE (finitions, 2026-09-21). La carte gardait
// les jours écrits le jour où Fitz l'avait posée : « 46 jours pour
// déposer » restait « 46 jours » une semaine plus tard. Quand le
// catalogue est là, la fenêtre est relue sur le programme, aujourd'hui ;
// sinon on garde ce que la carte porte.
if (lecture && lecture.programme) {
const ech = etatEcheance(lecture.programme);
// Une candidature close se dit dans la ligne d'échéance de la carte
// (« Candidatures : Closes ») : « date non confirmée » la contredirait.
close = ech.ouverte === false;
app = {
...app,
jours: ech.jours,
certitude: ech.certitude || app.certitude,
dateConfirmee: ech.ouverte === true && ech.jours !== null,
porte: ech.porte || null
};
}

const faits = [];

if (app.country) {
faits.push(`<span class="app-fait app-fait-pays"><i data-lucide="map-pin"></i><span>${escapeHtml(app.country)}</span></span>`);
}

// La fenêtre de dépôt, dite par le MÊME module que le hub
// (js/recommend-programs.js) : deux phrases différentes pour la même
// opportunité, c'est ainsi qu'un étudiant cesse de croire le site.
// Seulement quand la carte porte de quoi la calculer.
// Lot P5a : `certitude` suffit désormais à déclencher la ligne — une
// carte vérifiée doit pouvoir le dire même sans nombre de jours.
if (portaitUneFenetre && !close) {
const fenetre = libelleFenetre(app);
faits.push(`<span class="app-fait app-fait-fenetre is-${fenetre.etat}"><i data-lucide="${fenetre.etat === "a_verifier" ? "help-circle" : "calendar-clock"}"></i><span>${escapeHtml(fenetre.texte)}</span></span>`);
}

const raison = app.raisonFitz
? `<p class="app-raison-fitz"><i data-lucide="check"></i><span>${escapeHtml(app.raisonFitz)}</span></p>`
: "";

if (!faits.length && !raison) return "";

return `${faits.length ? `<div class="app-faits">${faits.join("")}</div>` : ""}${raison}`;

}

// UNE CARTE DÉJÀ POSÉE SE REVÉRIFIE (finitions, 2026-09-21). Fitz
// filtre ce qu'il propose, mais ne relisait jamais ce qu'il avait déjà
// proposé : Pearson restait prête à être acceptée chez une bachelière
// de 2022, que la bourse exclut. La raison est dite ici, avec les mots
// de pourquoiPlusProposable() (js/recommend-programs.js) — le même
// module que celui qui choisit. Constat seulement : aucune écriture.
function renderPlusProposable(app, lecture) {
if (!carteCatalogue(app) || !lecture || !lecture.programme) return "";
if (STATUTS_DEPOSES.includes(app.status)) return "";
const universite = catalogueIndex && lecture.programme.universityId ? catalogueIndex.uniParId.get(lecture.programme.universityId) : null;
const raison = pourquoiPlusProposable({ program: lecture.programme, university: universite || {}, scholarship: lecture.bourse || null, profile: profile || {} });
if (!raison) return "";
const acceptee = !!app.accepteeLe;
// L'erreur vient de Fitz quand la bourse a une fenêtre du bac que le
// profil ne remplit pas : le remplacement est alors GRATUIT, et
// firestore.rules l'autorise (exceptionFenetreBac). Le bouton n'existe
// que si le serveur acceptera l'écriture (miroir exact).
const gratuit = remplacementSansRefus(lecture.bourse, profile);
const suite = gratuit
? "Fitz vous en propose une autre : ce remplacement n'utilise aucun de vos refus."
: acceptee
? "Écrivez à l'équipe depuis la messagerie : elle vous dira comment poursuivre."
: "Ne l'acceptez pas : demandez à Fitz une autre université.";
return `<div class="app-plus-proposable" role="status">
<i data-lucide="alert-triangle"></i>
<div>
<p><strong>${acceptee ? "Vérifiez votre admissibilité avant d'aller plus loin" : "Fitz ne vous proposerait plus cette université"}</strong> : ${escapeHtml(raison)}. ${suite}</p>
${gratuit ? `<button type="button" class="btn btn-secondary btn-sm app-remplacer-btn"><i data-lucide="refresh-cw"></i><span>Voir la remplaçante</span></button>` : ""}
</div>
</div>`;
}

function renderCard(app, lecture) {

const urgency = urgencyLabel(app);
// Finitions (2026-09-21) : les pièces que le catalogue exige et qui ne
// sont pas encore dans le dossier empêchent l'étape « Dossier » de
// passer au vert (js/application-journey.js).
const exigencesManquantes = lecture && lecture.lie && lecture.bourse
? elementsAAjouter(lireExigences(lecture.bourse), app.checklist).length
: 0;
const journeySteps = computeJourneySteps(app, { profileScore, advisorUnlocked, advisorRequests, documentsObtained, procedure: procedurePour(app), exigencesManquantes });

const card = document.createElement("article");
card.className = "card app-card" + (urgency.urgent ? " app-card-urgent" : "");
card.id = app.id;
card.dataset.appId = app.id;

// L'étape « lettre » est-elle hors de portée pour cette candidature ?
// (voir js/next-action.js : Fitz écrit la lettre à partir du profil)
const lettrePrematuree = qualifierEtapes(journeySteps)
.some((e) => e.id === "letter" && e.etat === "prematuree");

// Lot ACCEPTATION : ce que la carte a le droit de montrer.
const fermee = fermeeParLOrganisme(app, lecture);
const outils = outilsOuverts(app);
const refusable = !fermee && peutRefuser(app);
const etat = etatCarte(app);
if (etat) card.dataset.acceptation = fermee ? "fermee" : etat.code;

card.innerHTML = `
<div class="app-card-top">
<div>
${app.isRecommendation ? `<span class="app-recommendation-badge">Suggéré par Fitz</span>` : ""}
<h3>${escapeHtml(app.university)}</h3>
${app.scholarship ? `<p class="app-card-scholarship">${escapeHtml(app.scholarship)}</p>` : ""}
${renderFaitsDuChoix(app, lecture)}
</div>
<div class="app-card-pills">
<span class="app-track-pill" data-track="${lireParcours(app)}">${LIBELLES_PARCOURS[lireParcours(app)].court}</span>
<span class="app-status-pill app-status-${app.status}">${STATUS_LABELS[app.status] || app.status}</span>
</div>
</div>

${renderJourneyStepper(app, journeySteps)}

${renderProcedure(app, journeySteps)}

<div class="app-card-meta">
${renderEcheanceCandidature(app, lecture)}
<span class="${urgency.urgent ? "is-urgent" : ""}"><i data-lucide="bell"></i>${urgency.text}</span>
${app.premiumProtected ? `<span class="is-protected"><i data-lucide="shield-check"></i>Suivi maintenu même après votre abonnement</span>` : ""}
${renderPreuve(app)}
</div>

${renderDivergence(app, lecture)}

${renderExigences(lecture)}

${app.notes ? `<p class="app-card-notes">${escapeHtml(app.notes)}</p>` : ""}

${fermee ? "" : renderPlusProposable(app, lecture)}

${renderAcceptation(app, fermee)}

${outils ? `<div class="app-card-documents">
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
</div>`
// Lot ACCEPTATION : les outils de Fitz (lettre, e-mail, vérification)
// ne s'ouvrent qu'APRÈS l'acceptation. Sur une carte proposée, une seule
// ligne, à leur place — et aucun lien.
: `<div class="app-card-documents app-outils-fermes"><i data-lucide="lock"></i><span>Acceptez cette université pour commencer votre dossier.</span></div>`}

${renderChecklistSection(app, lecture)}

${outils ? renderReadinessPanel(app, advisorUnlocked) : ""}

<div class="app-card-actions">
${refusable && !carteCatalogue(app) ? `<button type="button" class="btn btn-secondary btn-sm app-refuse-btn"><i data-lucide="refresh-cw"></i><span>Refuser et demander une autre université</span></button>` : ""}
<button type="button" class="btn btn-secondary btn-sm app-checkin-btn"><i data-lucide="check"></i><span>J'ai vérifié</span></button>
${outils ? `<button type="button" class="btn btn-secondary btn-sm app-readiness-btn"><i data-lucide="shield-check"></i><span>Vérifier avant de déposer</span></button>` : ""}
${app.universityWebsite ? `<a href="${escapeHtml(app.universityWebsite)}" target="_blank" rel="noopener" class="btn btn-ghost btn-sm"><i data-lucide="external-link"></i><span>Site université</span></a>` : ""}
${app.portalUrl ? `<a href="${escapeHtml(app.portalUrl)}" target="_blank" rel="noopener" class="btn btn-ghost btn-sm"><i data-lucide="external-link"></i><span>Candidature</span></a>` : ""}
<button type="button" class="btn btn-ghost btn-sm app-ics-btn"><i data-lucide="calendar-plus"></i><span>Rappel .ics</span></button>
<button type="button" class="btn btn-ghost btn-sm app-edit-btn" aria-label="Modifier"><i data-lucide="pen-line"></i></button>
${peutSupprimer(app, planId) ? `<button type="button" class="btn btn-ghost btn-sm app-delete-btn" aria-label="Supprimer le suivi" title="Supprimer le suivi"><i data-lucide="trash-2"></i></button>` : ""}
</div>
`;

card.querySelector(".app-accept-btn")?.addEventListener("click", () => accepter(app));
card.querySelector(".app-remplacer-btn")?.addEventListener("click", () => remplacerFermee(app, fermee ? "bourse_fermee" : "fenetre_bac"));
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
card.querySelector(".app-delete-btn")?.addEventListener("click", () => removeApplication(app));
card.querySelector(".app-refuse-btn")?.addEventListener("click", () => refuserEtRemplacer(app));
card.querySelector(".app-readiness-btn")?.addEventListener("click", () => runReadinessCheck(app));

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
// Une carte de vœu n'a plus de groupes à déplier (lot B2) : ses pièces
// vivent à l'étape 4 de la route. Rien à ouvrir, rien à casser.
const checklistGroupsEl = checklistEl.querySelector(".checklist-groups");
if (!checklistGroupsEl) return;
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
} else if (step.action === "procedure") {
// Lot E2 : ouvrir la procédure et aller à l'étape.
btn.addEventListener("click", () => {
const details = card.querySelector(".app-procedure");
if (details) details.open = true;
card.querySelector(`[data-procedure-etape="${step.id}"]`)?.scrollIntoView({ block: "center", behavior: "smooth" });
});
}

});

// Lot E2 : la case « Fait » de chaque étape de procédure.
card.querySelectorAll("[data-procedure-form]").forEach((form) => {
form.addEventListener("submit", async (event) => {
event.preventDefault();
const etape = journeySteps.find((s) => s.id === form.dataset.procedureForm);
if (!etape) return;
const bouton = form.querySelector("button");
bouton.disabled = true;
try {
await enregistrerEtapeProcedure(app, etape, { faite: form.elements.faite.checked, preuve: form.elements.preuve ? form.elements.preuve.value : "" });
await loadApplications();
} catch (error) {
console.error("Étape de procédure non enregistrée :", error);
showToast("L'étape n'a pas pu être enregistrée. Réessayez.", { type: "error" });
bouton.disabled = false;
}
});
});
const checklistGroupsEl = checklistEl.querySelector(".checklist-groups");

// LE BOUTON DE REPLI PEUT NE PAS EXISTER (lot B2-bis, 2026-09-18).
// Sur une carte de vœu, le bloc « Dossier de candidature » a été
// remplacé par un renvoi vers l'étape 4 : il n'a ni bouton ni groupes.
// Sans ce `?.`, cette ligne levait un TypeError et la carte du vœu ne
// s'affichait plus du tout. Trouvé en recette navigateur — les tests
// lisaient le code, pas l'écran.
checklistEl.querySelector('[data-action="toggle-checklist"]')?.addEventListener("click", () => {
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
renderEtatChoixFitz();

if (window.lucide) lucide.createIcons();

}

// Lot FITZ-CHOISIT : la ligne d'état honnête qui remplace le bouton
// « Nouvelle candidature » dans l'espace bourses. Trois cas
// (js/fitz-choisit.js) : toutes les places remplies ; profil trop mince
// pour choisir ; aucune université compatible restante.
function renderEtatChoixFitz() {

const etat = document.getElementById("fitzChoixEtat");
if (!etat) return;

if (ESPACE_ECRITURE === "preinscription") { etat.hidden = true; return; }

const quota = quotaPour("bourse");
const bourses = candidaturesDuParcours("bourse", applications);
const nombre = bourses.length;
// Lot ACCEPTATION : quand les N cartes ont toutes reçu une réponse,
// c'est l'équipe qui décide la suite — la ligne le dit (code `reponses`).
const reponses = bourses.filter((a) => STATUTS_REPONSE.includes(a.status)).length;
// Lot P3 : le verdict ENTIER, pour que la phrase nomme les champs
// manquants — la même que celle du hub des bourses.
const verdictProfil = profilPretPourFitz(profile);
const ligne = etatChoixFitz({ quota, nombre, profilPret: verdictProfil.pret, manquants: verdictProfil.manquants, reponses });

// « J'accepte les N choix de Fitz », dès qu'au moins 2 cartes sont
// proposées (ni acceptées, ni fermées par l'organisme).
const proposees = bourses.filter((a) => peutAccepter(a) && !fermeeParLOrganisme(a, catalogueIndex ? etatDeLaCandidature(a, catalogueIndex) : null));
const toutBtn = document.getElementById("accepterToutBtn");
if (toutBtn) {
toutBtn.hidden = proposees.length < 2;
const libelle = toutBtn.querySelector("span");
if (libelle) libelle.textContent = `J'accepte les ${proposees.length} choix de Fitz`;
}

if (!ligne) { etat.hidden = true; return; }

etat.hidden = false;
etat.dataset.etat = ligne.code;
const icone = ligne.code === "complet" ? "check-circle" : (ligne.code === "reponses" ? "mail-check" : "user-round");
etat.innerHTML = `<i data-lucide="${icone}"></i><span>${escapeHtml(ligne.texte)}</span>${ligne.lienProfil ? `<a href="profile.html" class="btn btn-secondary btn-sm">Compléter mon profil</a>` : ""}`;

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

// Lot ACCEPTATION : une carte ancienne a été CHOISIE par l'étudiant
// avant la doctrine — on ne la lui fait pas « accepter ». Elle devient
// carte catalogue (programId) ET acceptée dans le même patch ; sinon
// elle s'afficherait proposée, avec ses outils fermés.
if (lien.programId && !app.accepteeLe) patch.accepteeLe = serverTimestamp();

try {
await updateDoc(doc(db, "users", uid, "applications", app.id), patch);
Object.assign(app, { scholarshipId: lien.scholarshipId, programId: lien.programId, catalogueLieLe: new Date() });
if (patch.accepteeLe) app.accepteeLe = new Date();
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

// Nombre de jours avant `deadline` (ISO "AAAA-MM-JJ"), ou null sans
// échéance. Dupliqué à l'identique de js/ai/simulated-responses.js
// (daysUntil) plutôt qu'importé : ce module est purement local à cette
// page et n'a pas vocation à dépendre du module de simulation.
function joursAvantEcheance(isoDate) {
if (!isoDate) return null;
const cible = new Date(`${isoDate}T00:00:00`);
const aujourdhui = new Date();
cible.setHours(0, 0, 0, 0);
aujourdhui.setHours(0, 0, 0, 0);
return Math.round((cible - aujourdhui) / 86400000);
}

async function runReadinessCheck(app) {

const btn = document.getElementById(app.id)?.querySelector(".app-readiness-btn");

if (btn) { btn.disabled = true; btn.querySelector("span").textContent = "Vérification..."; }

try {

// Lot PRÉ-FITZ : le parcours voyage avec la demande. En préinscription,
// « prêt » se juge sur les étapes de la procédure de portail — faites,
// avec leurs preuves — et non sur le barème d'une bourse.
const parcours = lireParcours(app);
const etapesProcedure = parcours === "preinscription"
? etapesDeProcedure(app, procedurePour(app), new Date()).map((e) => ({ id: e.id, label: e.label, done: e.done, preuve: e.procedure ? e.procedure.preuve : "", echeanceISO: e.echeanceISO || null }))
: [];

const { data } = await generate({
task: "readiness",
input: {
university: app.university,
scholarship: app.scholarship,
program: app.scholarship,
track: app.track,
parcours,
etapesProcedure,
checklist: app.checklist || [],
hasGeneratedLetter: !!app.generatedLetter,
deadline: app.deadline,
profileScore,
applicationId: app.id,
profile
}
});

// checklistDone/checklistTotal/daysLeft (lot AI-STRUCTURE, 2026-09-18) :
// calculés ICI plutôt que demandés au modèle. Ce sont de purs calculs
// sur des données déjà connues du client — les faire recalculer par
// Fitz n'ajoutait qu'un risque d'erreur d'arithmétique, pour un champ
// que js/ai/prompts.js ne lui demande d'ailleurs plus (voir son
// commentaire "RÉPONSE JSON STRICTE").
const etapesFaites = parcours === "preinscription"
? etapesProcedure.filter((e) => e.done === true).length
: (app.checklist || []).filter((i) => i.status === "complete").length;
const etapesTotal = parcours === "preinscription"
? etapesProcedure.length
: (app.checklist || []).length;

await updateDoc(doc(db, "users", uid, "applications", app.id), {
fitzReadiness: {
ready: data.ready,
missingItems: data.missingItems,
checklistDone: etapesFaites,
checklistTotal: etapesTotal,
daysLeft: joursAvantEcheance(app.deadline),
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
// Lot FITZ-CHOISIT : l'étudiant REFUSE la proposition ; Fitz propose
// l'université compatible suivante sur le MÊME créneau (jamais de
// créneau supplémentaire, jamais le quota dépassé). Trois choses que
// l'ancien replaceRecommendation() ne faisait pas :
//   1. l'université refusée est MÉMORISÉE (users/{uid}.universitesRefusees)
//      — elle ne reviendra ni ici ni au remplissage ;
//   2. la carte repart NEUVE (carteFitz : scholarshipId, programId,
//      universityId, portail, site, statut « à préparer », date à zéro,
//      dossier vide) — l'ancienne gardait la clé de la bourse précédente
//      et pouvait afficher son échéance, son état et ses exigences ;
//   3. les pays exclus et les universités des autres créneaux sont
//      écartés par le moteur lui-même (exclureUniversites, paysExclu).
// Lot ACCEPTATION : deux chemins mènent à une remplaçante — le REFUS de
// l'étudiant (refus + 1, université mémorisée) et la FERMETURE de la
// bourse par l'organisme (refus inchangé, rien de mémorisé, accepteeLe
// retiré). La recherche est la même ; seule l'écriture diffère.
async function chercherRemplacante(app, { ecarterCelleCi }) {

// Deuxième lecture du catalogue dans la même page : gratuite depuis
// le chargeur partagé.
const catalogueSnap = await chargerCatalogue();

const programs = catalogueSnap.programmes.map(({ id, ...reste }) => ({ firestoreId: id, ...reste }));
const universitiesById = new Map(catalogueSnap.universites.map(({ id, ...reste }) => [id, { firestoreId: id, ...reste }]));
const scholarshipsById = new Map(catalogueSnap.bourses.map(({ id, ...reste }) => [id, { firestoreId: id, ...reste }]));
const parNom = indexParNom(universitiesById);

// L'université de la carte : son identifiant, ou celui de son
// programme, ou son nom rapproché (candidature ancienne).
const programme = app.programId ? programs.find((p) => p.firestoreId === app.programId) : null;
const universiteId = app.universityId || (programme && programme.universityId) || parNom.get(String(app.university || "").trim().toLowerCase()) || null;

// Une bourse fermée n'est pas un refus : l'université reste possible
// par une autre bourse. On écarte seulement cette carte-ci du calcul,
// pour que Fitz ne la re-propose pas telle quelle.
const aEviter = universitesAEviter({ applications: applications.filter((a) => a.id !== app.id), universitesRefusees, universitesParNom: parNom });
if (ecarterCelleCi && universiteId) aEviter.add(universiteId);

const [alternative] = retenirOpportunites({
profile: profile || {},
programs,
universitiesById,
scholarshipsById,
exclureUniversites: aEviter
}).retenues;

return { alternative: alternative || null, universiteId };

}

async function refuserEtRemplacer(app) {

// Deux refus par place, pas plus : à la troisième proposition, Fitz
// tranche. Le bouton n'existe plus à ce stade ; on le redit ici.
if (refusConsommes(app) >= REFUS_MAX) {
showToast("Fitz a fait sa proposition finale pour cette place.", { type: "warning" });
return;
}

const button = document.querySelector(`[data-app-id="${app.id}"] .app-refuse-btn`);
if (button) { button.disabled = true; button.querySelector("span").textContent = "Fitz cherche…"; }

try {

const { alternative, universiteId: refuseeId } = await chercherRemplacante(app, { ecarterCelleCi: true });

if (!alternative) {
showToast("Fitz n'a pas trouvé d'autre université compatible pour l'instant. Un profil plus complet élargit les possibilités.", { type: "warning" });
return;
}

// LA MÉMOIRE LOCALE NE PREND PAS D'AVANCE SUR LA BASE.
//
// Cette ligne était AU-DESSUS du test ci-dessus. Quand Fitz ne trouvait
// pas de remplaçante, on sortait aussitôt — mais l'université venait
// d'entrer dans `universitesRefusees` en mémoire, sans que `refus` soit
// incrémenté ni que Firestore soit écrit. Pour le reste de la session
// elle était exclue (universitesAEviter la lit), et au rechargement elle
// revenait : deux états divergents pour un refus qui n'a pas eu lieu.
if (refuseeId && !universitesRefusees.includes(refuseeId)) universitesRefusees = [...universitesRefusees, refuseeId];

// 1. La mémoire du refus, AVANT la carte : si l'écriture de la carte
// échoue, le refus reste acquis et la proposition suivante l'évitera.
if (refuseeId) {
await updateDoc(doc(db, "users", uid), { universitesRefusees: arrayUnion(refuseeId) });
}

// 2. La carte neuve — même fonction que le remplissage. carteFitz remet
// `refus` à 0 : le compteur de la PLACE est réécrit après, à refus + 1
// (firestore.rules l'exige : un refus qui n'incrémente pas est refusé).
await updateDoc(doc(db, "users", uid, "applications", app.id), {
...carteFitz(alternative, { portalUrl: portailDeLEntree(alternative), nextCheckDate: nextCheckFromToday(14), reminderFrequency: app.reminderFrequency || 14 }),
refus: refusConsommes(app) + 1,
updatedAt: serverTimestamp()
});

trackEvent("application_recommendation_replaced", { refusee: refuseeId || "", refus: refusConsommes(app) + 1 });

showToast(`Fitz vous propose ${alternative.universityName}.`, { type: "success" });

await loadApplications();

} catch (error) {

console.error("Impossible de proposer une autre université :", error);
showToast("Un souci est survenu — réessayez dans un instant.", { type: "error" });

} finally {

if (button) { button.disabled = false; button.querySelector("span").textContent = "Refuser et demander une autre université"; }

}

}

// L'exception légitime : l'organisme a fermé la bourse (isActive:false,
// ou fiche retirée) sur une carte NON DÉPOSÉE. La remplaçante arrive à
// l'état « proposée » : accepteeLe retiré, refus inchangé, rien dans
// universitesRefusees — l'étudiant n'a rien refusé.
async function remplacerFermee(app, motif = "bourse_fermee") {

const button = document.querySelector(`[data-app-id="${app.id}"] .app-remplacer-btn`);
if (button) { button.disabled = true; button.querySelector("span").textContent = "Fitz cherche…"; }

try {

const { alternative } = await chercherRemplacante(app, { ecarterCelleCi: true });

if (!alternative) {
showToast("Fitz n'a pas trouvé d'autre université compatible pour l'instant. Un profil plus complet élargit les possibilités.", { type: "warning" });
return;
}

await updateDoc(doc(db, "users", uid, "applications", app.id), {
...carteFitz(alternative, { portalUrl: portailDeLEntree(alternative), nextCheckDate: nextCheckFromToday(14), reminderFrequency: app.reminderFrequency || 14 }),
refus: refusConsommes(app),
accepteeLe: deleteField(),
updatedAt: serverTimestamp()
});

trackEvent(motif === "fenetre_bac" ? "application_hors_fenetre_remplacee" : "application_bourse_fermee_remplacee", { programme: app.programId || "" });

showToast(`Fitz vous propose ${alternative.universityName}.`, { type: "success" });

await loadApplications();

} catch (error) {

console.error("Impossible de proposer une remplaçante :", error);
showToast("Un souci est survenu — réessayez dans un instant.", { type: "error" });

} finally {

if (button) { button.disabled = false; button.querySelector("span").textContent = "Voir la remplaçante"; }

}

}

// ACCEPTER, C'EST DÉFINITIF (décision 1). L'horodatage vient du
// serveur ; firestore.rules n'accepte que request.time, une seule fois.
async function ecrireAcceptation(app) {
await updateDoc(doc(db, "users", uid, "applications", app.id), { accepteeLe: serverTimestamp(), updatedAt: serverTimestamp() });
trackEvent("application_acceptee", { refus: refusConsommes(app) });
}

async function accepter(app) {

if (!peutAccepter(app)) return;

if (!confirm(`Accepter « ${app.university} » ? Après acceptation, vous ne pourrez plus changer cette université.`)) return;

const button = document.querySelector(`[data-app-id="${app.id}"] .app-accept-btn`);
if (button) button.disabled = true;

try {
await ecrireAcceptation(app);
showToast(`« ${app.university} » acceptée : vos outils sont ouverts.`, { type: "success" });
await loadApplications();
} catch (error) {
console.error("Impossible d'enregistrer l'acceptation :", error);
showToast("L'acceptation n'a pas pu être enregistrée — réessayez dans un instant.", { type: "error" });
if (button) button.disabled = false;
}

}

// « J'accepte les N choix de Fitz » — toutes les cartes proposées (ni
// acceptées, ni fermées par l'organisme), une écriture par carte.
async function accepterTout() {

const proposees = candidaturesDuParcours("bourse", applications)
.filter((a) => peutAccepter(a) && !fermeeParLOrganisme(a, catalogueIndex ? etatDeLaCandidature(a, catalogueIndex) : null));

if (proposees.length < 2) return;

if (!confirm(`Accepter les ${proposees.length} universités choisies par Fitz ? Après acceptation, vous ne pourrez plus changer ces universités.`)) return;

const toutBtn = document.getElementById("accepterToutBtn");
if (toutBtn) toutBtn.disabled = true;

let acceptees = 0;

try {
for (const app of proposees) {
await ecrireAcceptation(app);
acceptees += 1;
}
showToast(`${acceptees} universités acceptées : vos outils sont ouverts.`, { type: "success" });
} catch (error) {
console.error("Acceptation groupée interrompue :", error);
showToast(acceptees ? `${acceptees} université${acceptees > 1 ? "s" : ""} acceptée${acceptees > 1 ? "s" : ""}, puis un souci est survenu — réessayez pour les autres.` : "L'acceptation n'a pas pu être enregistrée — réessayez dans un instant.", { type: "error" });
} finally {
if (toutBtn) toutBtn.disabled = false;
}

await loadApplications();

}

// LES ÉCRITURES QUI ÉCHOUAIENT EN SILENCE (corrigé le 2026-09-13).
//
// Quatre écritures Firestore de ce fichier n'avaient AUCUN try/catch,
// alors que toutes les autres en ont un (voir l'enregistrement du
// formulaire, l'acceptation, le refus). Réseau coupé, règle refusée,
// quota dépassé : la promesse était rejetée, personne ne l'attrapait, et
// l'étudiant repartait convaincu d'avoir enregistré. « J'ai vérifié », la
// suppression d'un suivi, le changement de statut d'une pièce et l'ajout
// d'une pièce au dossier tombaient tous dans ce trou.

async function checkIn(app) {

const nextCheckDate = nextCheckFromToday(app.reminderFrequency || 14);

try {
await updateDoc(doc(db, "users", uid, "applications", app.id), { nextCheckDate });
} catch (error) {
console.error("Impossible d'enregistrer la vérification :", error);
showToast("Votre vérification n'a pas pu être enregistrée. Vérifiez votre connexion, puis réessayez.", { type: "error" });
return;
}

trackEvent("application_checked_in", { status: app.status });

await loadApplications();

}

async function removeApplication(app) {

// Lot ACCEPTATION : la suppression dit ce qui sera perdu — la preuve de
// dépôt d'abord. Elle n'est proposée que là où peutSupprimer() le
// permet (js/fitz-choisit.js) ; firestore.rules fait foi. Une place
// libérée n'est plus promise à Fitz : pour une formule en vente, aucune
// carte catalogue ne se supprime, et la suite est décidée par l'équipe.
if (!peutSupprimer(app, planId)) return;

const perdu = [];
if (app.preuveDepot) perdu.push("votre preuve de dépôt");
if (Array.isArray(app.checklist) && app.checklist.length) perdu.push("votre dossier de candidature");
if (app.notes) perdu.push("vos notes");
const message = `Supprimer le suivi de « ${app.university} » ?${perdu.length ? ` Vous perdrez ${perdu.join(", ")} : ce suivi ne pourra pas être rétabli.` : ""}`;

if (!confirm(message)) return;

try {
await deleteDoc(doc(db, "users", uid, "applications", app.id));
} catch (error) {
console.error("Impossible de supprimer le suivi :", error);
showToast("Ce suivi n'a pas pu être supprimé. Vérifiez votre connexion, puis réessayez.", { type: "error" });
return;
}

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

// Rend `true` quand l'écriture a réellement eu lieu : les appelants
// (cycle de statut, retrait, ajout) n'ont plus à deviner, et le modal ne
// se ferme pas sur un enregistrement qui n'a pas abouti.
async function saveChecklist(app, newChecklist, eventType) {
try {
await updateDoc(doc(db, "users", uid, "applications", app.id), { checklist: newChecklist, updatedAt: serverTimestamp() });
} catch (error) {
console.error("Impossible d'enregistrer le dossier de candidature :", error);
showToast("Cette modification de votre dossier n'a pas pu être enregistrée. Vérifiez votre connexion, puis réessayez.", { type: "error" });
return false;
}
trackEvent("application_checklist_updated", { type: eventType || "unknown" });
await loadApplications();
return true;
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

if (!(await saveChecklist(app, newChecklist, type))) return;

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
// LOT S4 : l'espace impose le parcours. On ne demande plus à
// quelqu'un de choisir dans un menu ce qu'il vient d'acheter.
track: ESPACE_ECRITURE === "preinscription" ? "preinscription" : "bourse",
deadline: fields.deadline.value || null,
reminderFrequency: parseInt(fields.frequency.value, 10),
notes: fields.notes.value.trim(),
// LA FORMULE DU PARCOURS, ET UN ACCÈS GARDÉ.
// Deux défauts en une ligne : elle lisait TOUJOURS la formule bourse —
// y compris sur un vœu de préinscription — et c'était le seul accès non
// protégé à SCHOLARBRIDGE_PLANS du fichier (partout ailleurs :
// `window.SCHOLARBRIDGE_PLANS &&`). Si pricing-plans.js ne charge pas,
// tout le reste dégradait proprement et l'enregistrement, lui, levait
// un ReferenceError.
//
// On lit ESPACE_ECRITURE, et non `payload.track` : `payload` est en zone
// morte temporelle dans son propre initialiseur. C'est la même valeur,
// trois lignes plus haut.
premiumProtected: (ESPACE_ECRITURE === "preinscription" ? planPre : planBourse)?.extendsPendingApplications === true && fields.status.value === "en_attente",
updatedAt: serverTimestamp()
};

// Lot FITZ-CHOISIT : une candidature choisie par Fitz GARDE son badge
// quand l'étudiant modifie ses notes ou sa date — son identité est en
// lecture seule. Seule une CRÉATION manuelle (préinscription) est un
// choix de l'étudiant. Sur une carte verrouillée, les champs
// d'identité ne sont pas envoyés du tout : firestore.rules n'aurait
// rien à redire (valeurs inchangées), mais on ne renvoie pas ce qu'on
// n'a pas le droit de changer.
if (!editingId) payload.isRecommendation = false;
const enEdition = editingId ? applications.find((a) => a.id === editingId) : null;
// Lot ACCEPTATION : le parcours ne change jamais (firestore.rules le
// refuse). En édition, on ne le renvoie pas : un client des deux
// parcours qui modifiait une bourse depuis son espace préinscription
// lui réécrivait « preinscription » — un vrai défaut, corrigé ici.
if (editingId) delete payload.track;
if (enEdition && identiteVerrouillee(enEdition)) {
delete payload.university;
delete payload.scholarship;
delete payload.portalUrl;
} else if (!payload.university) {
return;
}

// Lot ACCEPTATION : le formulaire ne propose pas un statut interdit à
// cette carte ; on le redit ici, en clair, avant toute écriture.
if (enEdition && !statutsAutorises(enEdition, [payload.status]).length) {
showToast(estAcceptee(enEdition)
? "Une candidature déposée ne redescend pas. Une erreur ? Utilisez « Signaler un problème »."
: "Acceptez d'abord cette université pour déposer votre dossier.", { type: "warning" });
return;
}

// Lot E1 : un statut déposé exige une déclaration valide — le select
// ne l'offre qu'à cette condition, mais on le redit ici, en clair.
const veutDeposer = STATUTS_DEPOSES.includes(payload.status);
const previousApp = editingId ? applications.find((a) => a.id === editingId) : null;
const transition = !previousApp || previousApp.status !== payload.status;

// Lot ACCEPTATION : une carte ancienne déjà déposée SANS accepteeLe
// (donnée d'avant le lot) s'affiche acceptée ; à sa prochaine écriture
// de statut, le client pose accepteeLe dans la même écriture — sinon
// firestore.rules la refuserait (un statut déposé exige l'acceptation).
if (enEdition && carteCatalogue(enEdition) && !enEdition.accepteeLe && veutDeposer && transition) {
payload.accepteeLe = serverTimestamp();
}
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
if (payload.preuveDepot && previous && previous.status !== payload.status) trackEvent("application_deposee_declaree", { mode: payload.preuveDepot.mode, track: lireParcours(previous) });

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
// Douze lignes plus haut, le même refus dit la formule DU PARCOURS
// (nomFormulePour). Ici il disait `PLAN_LABELS[planId]` : sur un vœu de
// préinscription, un client sans formule bourse lisait « Votre formule
// Gratuit permet d'accompagner 7 candidatures ». Même refus, même
// phrase, même formule — celle de l'espace où il se trouve.
showToast(estPreinscription(track)
? `${nomFormulePour(track)} accompagne ${quota} vœux Études en France à la fois. Terminez-en un, ou retirez-en un.`
: `Votre formule ${nomFormulePour(track)} permet d'accompagner ${quota} candidature${quota > 1 ? "s" : ""} à la fois. Terminez-en une, ou passez à une formule supérieure pour en suivre davantage.`, { type: "error" });
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

// Lot FITZ-CHOISIT : plus de création manuelle dans l'espace bourses —
// le bouton n'y existe pas (Fitz remplit les places, la ligne d'état
// #fitzChoixEtat dit où il en est). Il ne reste que pour la
// préinscription (vœux pre-N saisis à la main, hors lot). Lot
// ACCEPTATION, partie 0 : Signature (sans plafond) ne l'a plus non plus —
// les règles refusent sa création manuelle depuis FITZ-CHOISIT, et Fitz
// lui remplit 12 places (seedRecommendedSlots).
// LA ROUTE EST LA SEULE PORTE D'UN VŒU (lot R13, 2026-09-18).
//
// Le bouton « Nouvelle candidature » ne restait que pour la
// préinscription — c'était donc, depuis la refonte, la SECONDE façon de
// créer un vœu, avec son vieux formulaire de dix champs (bourse,
// statut, date, fréquence, notes, portail facultatif…) à côté des TROIS
// champs de l'étape 3 : établissement, formation, niveau. Deux portes,
// deux formes de vœu, et un portail facultatif qui pouvait naître vide
// — ce qui faisait taire toute la procédure pour ce vœu.
//
// Ce dépôt a déjà payé trois fois le prix des deux chemins (lots R5, R6
// et R7 : la lettre qui partait pour la Chine, l'étape 13 sans son vœu,
// le sélecteur qui proposait l'autre espace). On ferme la seconde porte
// au lieu d'attendre la quatrième.
//
// La page reste ENTIÈRE pour l'espace bourses, dont elle est le
// gestionnaire de candidatures ; elle reste lisible en préinscription
// (la liste, les détails) — seule la CRÉATION s'en va, vers l'étape 3.
// Le bouton « Nouvelle candidature » est retiré de applications.html :
// un bouton caché que rien ne montre jamais est le piège que ce lot
// ferme — la prochaine passe l'aurait cru vivant.
document.getElementById("accepterToutBtn")?.addEventListener("click", accepterTout);
const regle = document.getElementById("fitzRegle");
if (regle) {
regle.hidden = false;
if (ESPACE_ECRITURE === "preinscription") {
regle.innerHTML = 'Vos vœux se posent dans votre route, à l\'étape 3 — l\'établissement, la formation, le niveau, et Fitz s\'occupe du reste. Cette page vous les montre, elle ne les crée plus. <a href="espace-preinscription.html?etape=voeux">Ouvrir l\'étape 3</a>';
} else {
regle.textContent = PHRASE_REGLE;
}
}
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

// LOT R13 : un vieux lien `?action=new` — un signet, un message, une
// page pas encore rejouée — n'ouvre plus le formulaire de dix champs à
// un étudiant en préinscription. Il est renvoyé à son étape 3, où le
// vœu se pose en trois champs. Les liens de `js/fitz-choisit.js`
// (après paiement d'un Dossier France) mènent déjà là ; celui-ci ferme
// le dernier passage.
if (ESPACE_ECRITURE === "preinscription" && params.get("action") === "new") {
window.location.replace("espace-preinscription.html?etape=voeux");
return;
}

const shouldOpen = params.get("action") === "new";

// PLUS AUCUNE CRÉATION MANUELLE ICI (lot R13, 2026-09-18).
//
// Cette fonction ouvrait le formulaire de dix champs et le pré-remplissait
// avec l'établissement et le portail passés dans l'URL par les cartes du
// hub préinscription. Depuis la refonte, un vœu se pose à l'étape 3 de la
// route, en trois champs, et le portail y est fixé — pas facultatif. Le
// bloc de pré-remplissage était donc devenu inatteignable : on le retire
// plutôt que de le laisser derrière un `return`, où la prochaine passe
// l'aurait cru vivant.
//
// Ce qui reste utile : nettoyer l'URL, pour qu'un rechargement ou un lien
// partagé ne rejoue pas `?action=new`.
if (!shouldOpen) return;

window.history.replaceState({}, "", window.location.pathname);

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

// Le portail d'une entrée du catalogue (recommandation, sélecteur,
// alternative). L'ordre dit la règle : ce que porte l'entrée d'abord —
// un instantané non scindé, ou une valeur déjà écrite —, la carte
// servie par la fonction `portails` ensuite. Rend "" quand l'étudiant
// n'y a pas droit ou que la carte n'a pas pu être chargée : une case
// vide, jamais un lien mort.
function portailDeLEntree(entree) {
if (!entree) return "";
return entree.applicationUrl
|| portailUniversite({ universityId: entree.universityId, programId: entree.programId })
|| "";
}

bootstrapShell({ feature: "applications" }).then(async (ctx) => {

// LOT S4 : l'espace d'où l'on vient, AVANT toute lecture de
// candidatures — c'est lui qui décide de ce que cette page montre.
// Un client qui a les DEUX accompagnements voit ses deux parcours ici,
// chaque carte portant son étiquette (« Bourse » / « Préinscription »,
// posée au lot A). La règle du lot S4 vise le client d'UN SEUL
// accompagnement — « un client préinscription n'y voit que ses pre-N » —
// et elle est tenue : son espace vaut alors « preinscription », et le
// filtre s'applique. Masquer la moitié de ses dossiers à quelqu'un qui a
// payé les deux serait lui cacher ce qu'il a acheté.
ESPACE = ctx.espaceUtilisateur === "les-deux" ? "" : (ctx.espace || "");
ESPACE_ECRITURE = ctx.espace || "";

// Une fois pour la session : cette page est déjà derrière
// bootstrapShell, l'appel ne coûte donc rien à un visiteur.
await chargerPortails();

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

universitesRefusees = Array.isArray(ctx.userData?.universitesRefusees) ? ctx.userData.universitesRefusees.filter((x) => typeof x === "string") : [];

// Le libellé au nom du pays de l'offre (« Dossier Italie »), 2026-09-23.
LIBELLE_PREINSCRIPTION = ctx.planPreinscriptionLabel || "";
initApplicationsPage(ctx.user.uid, ctx.planId, ctx.profile, ctx.featureFlags, ctx.testerAccess, ctx.hasFitzExpress, ctx.userData?.documentsObtained || {}, ctx.planPreinscriptionId || "");

});
