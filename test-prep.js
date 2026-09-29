// -------- test-prep.js — Préparation aux tests (2026-08-30) --------
// Nouvelle page de l'espace « Mon parcours » : l'étudiant prépare les
// tests de langue et examens d'admission À PARTIR DES EXIGENCES RÉELLES
// de ses candidatures — deux sources, jamais une donnée inventée :
//
//  1. Les items « Test de langue » de la checklist de chaque
//     candidature (applications.html) : nom du test, seuil requis par
//     la bourse, date prévue, statut — saisis depuis la fiche de la
//     bourse elle-même.
//  2. La langue d'enseignement des programmes visés — celle du programme
//     de la candidature (programId), à défaut celle de son université
//     (par le nom exact du catalogue) — pour SUGGÉRER un test quand la
//     checklist n'en exige pas encore.
//
// Les fiches (format, exigences habituelles, plan) viennent de
// js/test-prep-data.js — factuelles, avec les mises en garde honnêtes
// (MEXT fait passer ses propres épreuves ; GKS et beaucoup de bourses
// CSC incluent une année de langue).

import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { initShellChrome, bootstrapShell } from "./js/app-shell.js";
import { joursRestants } from "./js/next-action.js";
import { tonEcheance } from "./js/journey-map.js";
import { TESTS, testDepuisNom, testsPourLangue, languesDuCatalogue, langueDeLaCandidature, langueDansUnePhrase } from "./js/test-prep-data.js";

// Chargeur de catalogue partagé et mémoïsé — voir js/catalog-data.js.
import { chargerProgrammesEtUniversites } from "./js/catalog-data.js";

const STATUT_ITEM = { manquant: "Non planifié", en_cours: "Planifié", complete: "Passé" };

// ==========================================================
// SOURCES
// ==========================================================
async function chargerCandidatures(uid) {
try {
const snap = await getDocs(collection(db, "users", uid, "applications"));
return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
} catch (error) {
console.error("Impossible de charger les candidatures :", error);
return [];
}
}

// Langues d'enseignement du catalogue (même donnée que details.js, lue,
// jamais réécrite) : par programme et par nom d'université. Chaque
// candidature y prend la sienne — voir langueDeLaCandidature().
async function chargerLangues() {
try {
// Deux collections seulement : cette page n'a pas besoin des bourses,
// et le chargeur ne lit que ce qu'on lui demande.
const { programmes, universites } = await chargerProgrammesEtUniversites();
// Des objets simples { id, …champs }, pas des instantanés Firestore :
// la jointure vit dans js/test-prep-data.js, où Node la vérifie.
return languesDuCatalogue(programmes, universites);
} catch (error) {
console.warn("Catalogue injoignable — les suggestions par langue sont désactivées :", error);
return languesDuCatalogue([], []);
}
}

// ==========================================================
// « VOS TESTS » — exigences + suggestions
// ==========================================================
function collecterExigences(applications) {

const exigences = [];

applications.forEach((app) => {
(Array.isArray(app.checklist) ? app.checklist : [])
.filter((item) => item.type === "language_test")
.forEach((item) => {
exigences.push({
app,
item,
fiche: testDepuisNom(item.meta?.testName || item.label)
});
});
});

return exigences;

}

function collecterSuggestions(applications, langues, dejaExiges) {

const suggestions = [];
const vus = new Set(dejaExiges.map((e) => e.fiche && e.fiche.id).filter(Boolean));

applications.forEach((app) => {
const langue = langueDeLaCandidature(app, langues);
if (!langue) return;
testsPourLangue(langue).forEach((fiche) => {
if (vus.has(fiche.id)) return;
vus.add(fiche.id);
suggestions.push({ app, fiche, langue });
});
});

return suggestions;

}

function renderMesTests(exigences, suggestions) {

const sub = document.getElementById("mesTestsSub");
const list = document.getElementById("mesTestsList");

if (!exigences.length && !suggestions.length) {
sub.textContent = "Aucune exigence de test détectée pour l'instant. Ajoutez un « Test de langue » à la checklist d'une candidature (depuis la fiche de sa bourse), et il apparaîtra ici avec son plan de préparation.";
list.innerHTML = `<div class="jy-card jy-empty">Vos candidatures n'exigent pas encore de test — ou leur checklist ne le dit pas encore. <a href="applications.html">Ouvrir mes candidatures</a></div>`;
return;
}

sub.textContent = exigences.length
? "Détectés dans les checklists de vos candidatures — le seuil affiché est celui que VOTRE bourse exige."
: "Suggérés d'après la langue d'enseignement de vos programmes — à confirmer sur la fiche de chaque bourse.";

const cartes = [];

exigences.forEach(({ app, item, fiche }) => {

const jours = item.meta?.testDate ? joursRestants(item.meta.testDate, new Date()) : null;
const echeance = jours === null ? "" :
`<span class="jy-app-deadline is-${tonEcheance(jours)}">${jours < 0 ? "Date passée" : jours === 0 ? "Aujourd'hui" : `Test dans ${jours} j`}</span>`;

cartes.push(`
<article class="jy-card">
<div class="jy-app-top">
<h3>${item.meta?.testName || item.label || "Test de langue"}</h3>
<span class="jy-app-meta">Exigé pour ${app.university || "une candidature"}${item.meta?.scoreRequired ? ` · seuil : ${item.meta.scoreRequired}` : ""} · <span class="jy-status-pill ${item.status === "complete" ? "is-positive" : ""}">${STATUT_ITEM[item.status] || item.status}</span></span>
${echeance}
</div>
${fiche ? `<p class="jy-opp-reason"><i data-lucide="book-open"></i><span>${fiche.exigenceHabituelle}</span></p>
<div class="jy-tools">
<a href="#test-${fiche.id}" class="jy-tool"><i data-lucide="map"></i><span>Voir le plan de préparation</span></a>
<a href="${fiche.url}" target="_blank" rel="noopener" class="jy-tool"><i data-lucide="external-link"></i><span>Site officiel</span></a>
</div>` : `<p class="jy-opp-reason"><i data-lucide="info"></i><span>Test hors catalogue — vérifiez ses modalités sur le portail officiel de la bourse.</span></p>`}
</article>
`);

});

suggestions.forEach(({ app, fiche, langue }) => {
cartes.push(`
<article class="jy-card">
<div class="jy-app-top">
<h3>${fiche.nom}</h3>
<span class="jy-app-meta">Suggéré — ${app.university || "votre programme"} enseigne en ${langueDansUnePhrase(langue)}</span>
</div>
<p class="jy-opp-reason"><i data-lucide="book-open"></i><span>${fiche.exigenceHabituelle}</span></p>
<div class="jy-tools">
<a href="#test-${fiche.id}" class="jy-tool"><i data-lucide="map"></i><span>Voir le plan de préparation</span></a>
<a href="applications.html" class="jy-tool"><i data-lucide="clipboard-list"></i><span>Ajouter l'exigence à mon dossier</span></a>
</div>
</article>
`);
});

list.innerHTML = cartes.join("");

}

// ==========================================================
// FICHES
// ==========================================================
function renderFiches() {

document.getElementById("fichesList").innerHTML = TESTS.map((t) => `
<article class="jy-card" id="test-${t.id}" style="scroll-margin-top:84px;">
<div class="jy-app-top">
<h3>${t.nom}</h3>
<span class="jy-app-meta">${t.langue} · ${t.destinations.join(", ")}</span>
</div>
<ul class="jy-list">
<li><i data-lucide="layout-list"></i><span><strong>Format :</strong> ${t.format}</span></li>
<li><i data-lucide="target"></i><span><strong>Exigence habituelle :</strong> ${t.exigenceHabituelle}</span></li>
<li><i data-lucide="calendar-check"></i><span><strong>Validité :</strong> ${t.validite}</span></li>
<li><i data-lucide="calendar-days"></i><span><strong>Sessions :</strong> ${t.sessions}</span></li>
<li><i data-lucide="timer"></i><span><strong>Résultats :</strong> ${t.resultats}</span></li>
<li><i data-lucide="hourglass"></i><span><strong>Préparation conseillée :</strong> ${t.dureePrepa}</span></li>
</ul>
<p class="jy-app-meta" style="margin:14px 0 8px;font-weight:700;">Le plan de préparation :</p>
<ul class="jy-list">
${t.plan.map((etape, i) => `<li><i data-lucide="chevron-right"></i><span><strong>${i + 1}.</strong> ${etape}</span></li>`).join("")}
</ul>
<p class="jy-opp-reason" style="margin-top:14px;"><i data-lucide="message-circle"></i><span>${t.fitz}</span></p>
<div class="jy-tools">
<a href="${t.url}" target="_blank" rel="noopener" class="jy-tool"><i data-lucide="external-link"></i><span>Site officiel &amp; inscription</span></a>
<span data-feature="ai_chat"><a href="ai-chat.html?prep=${t.id}" data-real-href="ai-chat.html?prep=${t.id}" class="jy-tool"><i data-lucide="message-circle"></i><span>M'entraîner avec Fitz</span><i class="jy-lock" data-lucide="lock"></i></a></span>
</div>
</article>
`).join("");

}

// ==========================================================
// AMORÇAGE
// ==========================================================
initShellChrome();

bootstrapShell({ espace: "bourse" }).then(async (session) => {

if (!session) return;

renderFiches();

// css/journey.css replie le contenu de toute .jy-phase tant que le
// <body> ne porte pas data-parcours-pret : c'est le repli du hub « Mon
// parcours » (lot ESPACE-ETUDIANT, 2026-09-14), levé par dashboard.js et
// js/aiguillage.js. Cette page emprunte .jy-phase sans rien à replier, et
// ne le levait pas : depuis ce lot, l'étudiant n'y voyait que les deux
// titres (trouvé le 2026-09-28, garde 8 bis de
// test/diagnostic-garde.test.mjs). On le lève dès que les fiches sont
// peintes ; « Vos tests » affiche son propre « Chargement… » en attendant.
document.body.dataset.parcoursPret = "1";

const [applications, langues] = await Promise.all([
chargerCandidatures(session.user.uid),
chargerLangues()
]);

const exigences = collecterExigences(applications);
const suggestions = collecterSuggestions(applications, langues, exigences);

renderMesTests(exigences, suggestions);

if (window.lucide) lucide.createIcons();

});
