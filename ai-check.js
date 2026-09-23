/**
* ============================================================
* FitzUniverse — AI Check (ai-check.js)
* ============================================================
* Vérification de dossier : dépôt de documents avec typage manuel,
* analyse simulée par catégories (js/ai/simulated-responses.js via
* js/ai/ai-client.js), résultat affiché directement sur la page
* (anneau de score, barres par catégorie, points forts/faibles,
* suggestions, checklist croisée avec le profil).
* ============================================================
*/

import { db } from "./firebase-config.js";
import { doc, updateDoc, serverTimestamp, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { initShellChrome, bootstrapShell, unlockingPlans, PLAN_LABELS, ESPACE_OUTILS } from "./js/app-shell.js";
import { FITZ_UNLOCK_CTA, unlockPlanPhrase } from "./js/fitz-voice.js";
import { generate, messageErreurFitz, estArret } from "./js/ai/ai-client.js";
// LA MESURE ET LE JUGEMENT (lot MESURE-ET-JUGEMENT, 2026-09-18).
// `computeApplicationReport` porte un nom de simulateur, mais depuis le
// lot B1 elle ne fait plus que CHOISIR entre deux modules purs —
// controle-depot.js (préinscription) et controle-bourse.js (bourses) —
// et leur passer les fichiers dans la forme qu'ils attendent. C'est
// donc elle, et pas une copie de sa dispatch, qui mesure ici : une
// deuxième façon de mapper les fichiers aurait dérivé de la première au
// premier champ ajouté. Elle ne touche ni le réseau ni Firebase.
import { DOCUMENT_TYPES, computeApplicationReport } from "./js/ai/simulated-responses.js";
import { fusionnerRapport } from "./js/ai/fusion-rapport.js";
import { parcoursDOutil, titreDuVoeu, PAYS_PREINSCRIPTION } from "./js/parcours.js";
import { destinationDeLAdresse } from "./js/plan-features.js";
// Lot ACCEPTATION (2026-09-11) : la vérification exige, en bourses, une
// candidature ACCEPTÉE — elle ne tourne plus « sans candidature ».
import { candidaturesPourOutils } from "./js/fitz-choisit.js";
import { blocageOutil, afficherBlocage } from "./js/outil-acceptation.js";
import { showToast } from "./js/ai/toast.js";
import { trackEvent } from "./js/analytics.js";
import { extractTextFromFile } from "./js/ai/extract-text.js";

// Contexte candidature (2026-09-02) — le patron d'ai-letter/ai-email
// enfin répliqué ici (c'était la dernière page « reste à faire » de la
// note de Phase 3) : ?applicationId= présélectionne la candidature.
const applicationId = new URLSearchParams(window.location.search).get("applicationId");

initShellChrome();

if (window["pdfjsLib"]) {
window["pdfjsLib"].GlobalWorkerOptions.workerSrc =
"https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
}

function renderLockedState(container, ctx) {

const flags = ctx.featureFlags.ai_check;
const target = unlockingPlans(ctx.planId, flags)[0];

container.innerHTML = `
<div class="ai-locked-hero">
<div class="ai-locked-icon"><i data-lucide="lock"></i></div>
<h2>Vérification du dossier</h2>
<p>Cette fonctionnalité est disponible avec ${unlockPlanPhrase(target ? PLAN_LABELS[target] : null)}. Passez à une formule supérieure pour faire vérifier votre dossier par Fitz.</p>
<a href="${target ? `offers.html#${target}` : "offers.html"}" class="btn btn-primary">
<span>${FITZ_UNLOCK_CTA}</span>
</a>
</div>
`;

container.hidden = false;

if (window.lucide) lucide.createIcons();

}

function fileIcon(type) {

const icons = {
cv: "file-user",
lettre: "pen-line",
passeport: "book-user",
releve: "graduation-cap",
diplome: "award",
recommandation: "users",
langue: "languages",
financement: "wallet",
autre: "file"
};

return icons[type] || "file";

}

async function initCheckTool(ctx) {

const { profile } = ctx;

// ==========================================================
// LE CONTEXTE APPARTIENT À FITZ (2026-09-02) — la vérification
// s'ancre sur une candidature suivie : sélecteur + pastilles (rien à
// ajuster à la main ici), bannière d'enregistrement, et le score de
// l'analyse est écrit sur le document de la candidature (champ
// dossierCheck) pour que le suivi s'en souvienne.
// ==========================================================

let trackedApplications = [];

try {

const appsSnap = await getDocs(collection(db, "users", ctx.user.uid, "applications"));
trackedApplications = appsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

} catch (error) {

console.error("Impossible de charger les candidatures suivies :", error);

}

let application = applicationId
? trackedApplications.find((a) => a.id === applicationId) || null
: null;

const contextBanner = document.getElementById("applicationContext");
const contextBackLink = document.getElementById("applicationContextBackLink");
const fieldApplication = document.getElementById("fieldApplication");
const contextChips = document.getElementById("contextChips");

function syncContextBanner() {

if (!contextBanner) return;

if (application) {

contextBanner.hidden = false;
contextBanner.querySelector("span").textContent =
`Cette vérification sera enregistrée dans le suivi de "${application.university}".`;

// LE LIEN SECONDAIRE NE SORT PLUS DE LA ROUTE (lot R13, 2026-09-18).
// Pour un vœu de préinscription, il menait à applications.html — la
// page de l'espace BOURSES, avec son vieux formulaire. Or le lien de
// retour de cette page dit déjà « Retour à l'étape 9 » et ramène à la
// route : deux liens pour deux destinations différentes, dont une
// mauvaise. On garde le bon, on retire l'autre.
if (contextBackLink) {
const versLaRoute = parcoursDOutil({ espace: ctx.espace, application }) === "preinscription";
contextBackLink.hidden = versLaRoute;
if (!versLaRoute) contextBackLink.href = `applications.html#${application.id}`;
}

} else {

contextBanner.hidden = true;
if (contextBackLink) contextBackLink.hidden = true;

}

}

// Pastilles informatives : ce que le suivi sait du dossier visé. Sans
// candidature liée, la pastille dit sur quoi porte l'analyse.
function renderContextChips() {

contextChips.innerHTML = "";

const chips = application
? [
{ label: "Université", value: application.university || "" },
// La formation d'un vœu vit dans son propre champ depuis le lot R1 :
    // titreDuVoeu() lit le neuf puis l'ancien (js/parcours.js).
    { label: parcoursDOutil({ application }) === "preinscription" ? "Formation" : "Bourse", value: titreDuVoeu(application) },
{ label: "Date limite", value: application.deadline || "" }
].filter((c) => c.value)
: [{ label: "Portée", value: "Dossier général — reliez une candidature pour une analyse ciblée" }];

chips.forEach(({ label, value }) => {

const chip = document.createElement("div");
chip.className = "ai-context-chip";

const dt = document.createElement("dt");
dt.textContent = label;

const dd = document.createElement("dd");
dd.textContent = value;

chip.appendChild(dt);
chip.appendChild(dd);
contextChips.appendChild(chip);

});

}

// Lot ACCEPTATION : le sélecteur ne propose que les candidatures
// bourses ACCEPTÉES, plus les préinscriptions et les cartes sans
// programId (js/fitz-choisit.js : candidaturesPourOutils).
// ET SEULEMENT CELLES DU PARCOURS OÙ L'ON EST (2026-09-17) : vu en
// ligne, un outil ouvert depuis la route proposait deux bourses.
// js/fitz-choisit.js documente la règle ; l'identifiant de l'URL est
// gardé quoi qu'il arrive, un lien ancien reste sélectionnable.
candidaturesPourOutils(trackedApplications, parcoursDOutil({ espace: ctx.espace }), applicationId || "")
.slice()
.sort((a, b) => String(a.university || "").localeCompare(String(b.university || ""), "fr"))
.forEach((app) => {

const option = document.createElement("option");
option.value = app.id;
const titre = titreDuVoeu(app);
option.textContent = titre ? `${app.university} — ${titre}` : (app.university || "Candidature sans nom");
fieldApplication.appendChild(option);

});

if (application) fieldApplication.value = application.id;

// Lot ACCEPTATION : la ligne de blocage, avant la zone de dépôt.
const zoneDepot = document.getElementById("dropzone");
function syncBlocage() {
afficherBlocage(zoneDepot, blocageOutil({ espace: ctx.espace, application }));
}

fieldApplication.addEventListener("change", () => {
application = trackedApplications.find((a) => a.id === fieldApplication.value) || null;
syncContextBanner();
renderContextChips();
syncBlocage();
});

syncContextBanner();
renderContextChips();
syncBlocage();

const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("fileInput");
const fileList = document.getElementById("fileList");
const analyzeBtn = document.getElementById("analyzeBtn");

const resultsPanel = document.getElementById("resultsPanel");
const scoreRing = document.getElementById("scoreRing");
const scoreValue = document.getElementById("scoreValue");
const categoryList = document.getElementById("categoryList");
const strengthsList = document.getElementById("strengthsList");
const weaknessesList = document.getElementById("weaknessesList");
const suggestionsList = document.getElementById("suggestionsList");
const checklist = document.getElementById("checklist");
const scoreUnite = document.getElementById("scoreUnite");
const titreForts = document.getElementById("titreForts");
const titreFaibles = document.getElementById("titreFaibles");
const titreSuggestions = document.getElementById("titreSuggestions");

// Le titre d'une carte : son icône reste, seul le mot change. Le libellé
// d'origine est mémorisé au premier passage, pour qu'un rapport sans
// `listLabels` (parcours préinscription) le retrouve intact.
function poserTitre(h3, texte) {
if (!h3) return;
const libelle = h3.querySelector("span");
if (!libelle) return;
if (!h3.dataset.defaut) h3.dataset.defaut = libelle.textContent;
libelle.textContent = texte || h3.dataset.defaut;
}

let entries = [];
let entryCounter = 0;

function addFiles(fileArray) {

fileArray.forEach((file) => {

entries.push({
id: `f${entryCounter++}`,
file,
name: file.name,
size: file.size,
type: ""
});

});

renderFileList();

}

function removeEntry(id) {
entries = entries.filter((e) => e.id !== id);
renderFileList();
}

function renderFileList() {

fileList.innerHTML = "";

entries.forEach((entry) => {

const row = document.createElement("div");
row.className = "ai-file-row";

row.innerHTML = `
<div class="ai-file-row-icon"><i data-lucide="${fileIcon(entry.type)}"></i></div>
<div class="ai-file-row-info">
<strong></strong>
<span></span>
</div>
<select aria-label="Type de document"></select>
<button type="button" class="ai-file-row-remove" aria-label="Retirer"><i data-lucide="x"></i></button>
`;

row.querySelector("strong").textContent = entry.name;
row.querySelector("span").textContent = `${(entry.size / 1024 / 1024).toFixed(2)} Mo`;

const select = row.querySelector("select");
select.add(new Option("Détection automatique", ""));
DOCUMENT_TYPES.forEach((t) => select.add(new Option(t.label, t.key)));
select.value = entry.type;

select.addEventListener("change", () => {
entry.type = select.value;
row.querySelector(".ai-file-row-icon i").setAttribute("data-lucide", fileIcon(entry.type));
if (window.lucide) lucide.createIcons();
});

row.querySelector(".ai-file-row-remove").addEventListener("click", () => removeEntry(entry.id));

fileList.appendChild(row);

});

analyzeBtn.disabled = entries.length === 0;

if (window.lucide) lucide.createIcons();

}

dropzone.addEventListener("click", () => fileInput.click());

["dragover", "dragenter"].forEach((evt) => {
dropzone.addEventListener(evt, (e) => {
e.preventDefault();
dropzone.classList.add("is-dragover");
});
});

["dragleave", "drop"].forEach((evt) => {
dropzone.addEventListener(evt, () => dropzone.classList.remove("is-dragover"));
});

dropzone.addEventListener("drop", (e) => {
e.preventDefault();
if (e.dataTransfer.files.length) addFiles(Array.from(e.dataTransfer.files));
});

fileInput.addEventListener("change", () => {
if (fileInput.files.length) addFiles(Array.from(fileInput.files));
fileInput.value = "";
});

function renderCategories(categories, labels) {

categoryList.innerHTML = "";

Object.entries(categories).forEach(([key, value]) => {

const row = document.createElement("div");
row.className = "ai-category-row";

row.innerHTML = `
<div class="ai-category-row-top"><span>${labels[key]}</span><strong>${value}/100</strong></div>
<div class="ai-category-bar-track"><div class="ai-category-bar-fill" style="width:0%"></div></div>
`;

categoryList.appendChild(row);

requestAnimationFrame(() => {
row.querySelector(".ai-category-bar-fill").style.width = `${value}%`;
});

});

}

function renderList(el, items, emptyText) {

el.innerHTML = "";

if (!items.length) {
el.innerHTML = `<li>${emptyText}</li>`;
return;
}

items.forEach((text) => {
const li = document.createElement("li");
li.textContent = text;
el.appendChild(li);
});

}

function renderChecklist(items) {

checklist.innerHTML = "";

items.forEach((item) => {

const row = document.createElement("div");
row.className = `ai-checklist-item${item.present ? " is-done" : ""}`;
row.innerHTML = `<i data-lucide="${item.present ? "check-circle-2" : "circle"}"></i><span>${item.label}</span>`;

checklist.appendChild(row);

});

if (window.lucide) lucide.createIcons();

}

async function runAnalysis() {

// Lot ACCEPTATION : en bourses, pas de vérification sans candidature acceptée.
const blocage = blocageOutil({ espace: ctx.espace, application });
if (blocage) {
syncBlocage();
showToast(blocage.texte, { type: "warning" });
return;
}

analyzeBtn.disabled = true;
analyzeBtn.querySelector("span").textContent = "Analyse en cours…";

// Extraction de contenu best-effort (PDF uniquement pour l'instant,
// voir js/ai/extract-text.js) — le résultat simulé actuel
// (js/ai/simulated-responses.js) ignore `content`, mais le jour où une
// vraie analyse de contenu sera branchée, elle recevra déjà le texte
// des PDF sans qu'il faille toucher à cette boucle. Une extraction qui
// échoue (Word, image, PDF scanné sans texte) laisse `content`
// undefined plutôt que de bloquer l'analyse — le nom/type déclaré
// reste la donnée minimale garantie.
const files = await Promise.all(entries.map(async (entry) => {

// L'ÉTAT DE LECTURE, SANS AMBIGUÏTÉ (lot B1, 2026-09-18).
// `content: undefined` ne distinguait pas « le format ne se lit pas
// ici » de « pdf.js a échoué » de « le PDF est une image scannée sans
// texte » — trois situations qui ne se disent pas de la même façon à
// l'étudiant. Le contrôle ne devine plus : la page nomme le cas.
// Même leçon que le champ `size` du lot R11 — une donnée ambiguë
// produit un verdict faux avec l'air d'être sérieux.
let content;
let extraction;

try {
content = await extractTextFromFile(entry.file);
extraction = String(content || "").trim() ? "lue" : "vide";
} catch (error) {
content = undefined;
extraction = error && error.message === "UNSUPPORTED_FORMAT" ? "format" : "erreur";
}

return {
name: entry.name,
size: (entry.size / 1024 / 1024).toFixed(2),
// LE POIDS EN OCTETS, BRUT (lot R11, 2026-09-17). `size` ci-dessus est
// une CHAÎNE en mégaoctets, arrondie à deux décimales : lisible pour
// une phrase, inutilisable pour un contrôle. Le plafond du portail
// s'exprime en kilo-octets (500 Ko, 50 Ko pour la photo) et se joue à
// quelques octets près — js/ai/controle-depot.js ne lit donc que ce
// champ-ci, et refuse de conclure quand il manque.
octets: entry.size,
type: entry.type || undefined,
content,
extraction
};

}));

// LES PIÈCES DE LA ROUTE, CHARGÉES À LA DEMANDE (lot R11, 2026-09-17).
//
// Le contrôle avant dépôt d'une préinscription se juge sur des faits
// que seule la procédure du pays porte : le plafond de poids de chaque
// pièce, la liste des pièces, celles qui demandent une traduction. Les
// modules qui les connaissent pèsent 75 Ko à eux deux — on ne les
// impose donc pas aux comptes du parcours bourses, qui n'en ont aucun
// usage. Même patron que js/fitz-recours-contexte.js pour les fiches
// de documents.
//
// Un échec de chargement ne bloque RIEN : le contrôle se fait alors
// sans la liste des pièces, et dit ce qu'il a pu vérifier.
const parcoursCheck = parcoursDOutil({ espace: ctx.espace, application });
let piecesRoute = [];
let traductionRoute = null;

// HORS FRANCE (2026-09-23) : le pays du vœu, sinon celui de la route
// (`?d=`). Ses pièces sont celles de SA procédure, cochées dans SON
// dossier (dossiersPays.<pays>) — jamais la liste Études en France.
const destinationCheck = (application && application.destination && application.destination !== "france")
? String(application.destination)
: destinationDeLAdresse(window.location.search);

if (parcoursCheck === "preinscription" && destinationCheck) {
try {
const [routePays, procedures, destinations] = await Promise.all([
import("./js/route-destination.js"),
import("./js/procedures/index.js"),
import("./js/destinations-preinscription.js")
]);
const config = destinations.destination(destinationCheck);
const procedure = config ? procedures.trouverProcedure({ paysDestination: config.nom }) : null;
const dossier = (ctx.userData && ctx.userData.dossiersPays && ctx.userData.dossiersPays[destinationCheck]) || {};
piecesRoute = procedure ? routePays.piecesDuDossierPays({ id: destinationCheck, procedure, dossier }) : [];
// La règle de traduction de la route France (« en français ») ne vaut pas ici.
traductionRoute = null;
} catch (error) {
console.warn("Contrôle sans la liste des pièces :", error);
piecesRoute = [];
traductionRoute = null;
}
} else if (parcoursCheck === "preinscription") {
try {
const [route, procedures] = await Promise.all([
import("./js/route-preinscription.js"),
import("./js/procedures/index.js")
]);
const profil = ctx.profile || {};
const procedure = procedures.trouverProcedure({
paysDestination: PAYS_PREINSCRIPTION,
portailUrl: route.PORTAIL_ETUDES_EN_FRANCE,
paysResidence: profil.country || profil.originCountry || ""
});
const dossier = (ctx.userData && ctx.userData.dossierFrance) || {};
const cochees = (dossier.pieces && typeof dossier.pieces === "object") ? dossier.pieces : {};
piecesRoute = route.piecesDuDossier(procedure).map((p) => ({
...p,
obtenue: cochees[p.slug] === true,
ecartee: cochees[p.slug] === "non-concerne"
}));
traductionRoute = route.etatTraduction(piecesRoute, dossier);
} catch (error) {
console.warn("Contrôle sans la liste des pièces :", error);
piecesRoute = [];
traductionRoute = null;
}
}

try {

// 1. LA MESURE — locale, gratuite, instantanée, vérifiable. Elle ne
// dépend d'aucun réseau : même si Fitz ne répond pas, l'étudiant
// obtient au moins les faits (poids contre plafond du portail, pièces
// réglées, langue). C'est aussi ce qui remplit l'anneau de score,
// décision de Charles du 2026-09-18 : le chiffre affiché est mesuré,
// jamais un jugement de style déguisé en note.
const mesure = computeApplicationReport({ files, profile, parcours: parcoursCheck, pieces: piecesRoute, traduction: traductionRoute });

// 2. LE JUGEMENT — le modèle lit le contenu. Il reçoit les mesures
// (`controle`) pour ne pas les contredire ni les refaire : voir la
// consigne dans js/ai/prompts.js.
const { data: donneesIA } = await generate({ task: "check", input: { files, profile, application, parcours: parcoursCheck, pieces: piecesRoute, traduction: traductionRoute, controle: mesure.controle, track: application ? application.track : undefined } });

// 3. LA FUSION — qui a dit quoi reste lisible (js/ai/fusion-rapport.js).
const data = fusionnerRapport({ controle: mesure, ia: donneesIA });

// UN RAPPORT PEUT N'AVOIR AUCUNE NOTE (lot B1, 2026-09-18).
// Sur le parcours bourses, rien n'est notable : pas de plafond de poids
// publié, pas de liste de pièces exacte, et personne ne lit le contenu
// en mode simulé. Un anneau à 0 se lirait « votre dossier est mauvais »
// alors qu'on ne juge rien — c'est la règle du lot R11, appliquée cette
// fois au score global : ce qu'on ne peut pas juger est ABSENT, pas nul.
const noteChiffree = typeof data.overallScore === "number";
scoreRing.style.setProperty("--ai-score", noteChiffree ? data.overallScore : 0);
scoreValue.textContent = noteChiffree ? data.overallScore : "—";
if (scoreUnite) scoreUnite.hidden = !noteChiffree;

// CE QUE LE CHIFFRE MESURE, ÉCRIT SOUS LE CHIFFRE (2026-09-18).
// Depuis le lot MESURE-ET-JUGEMENT, l'anneau porte la conformité au
// dépôt — poids des fichiers, pièces, langue — et les catégories
// portent le jugement du contenu. Sans légende, un « 0 » dû à un seul
// fichier trop lourd surplombe des catégories à 40 et se lit comme un
// verdict sur tout le dossier. Le chiffre était déjà juste ; c'est sa
// lecture qui ne l'était plus.
const scoreLegende = document.getElementById("scoreLegende");
if (scoreLegende) {
scoreLegende.textContent = "Conformité au dépôt : poids des fichiers, pièces, langue.";
scoreLegende.hidden = !noteChiffree;
}

// Les trois listes changent de TITRE quand le rapport en fournit :
// « Points forts » au-dessus d'une mesure de poids serait un compliment
// fabriqué de plus. Sans `listLabels`, les titres du HTML restent.
poserTitre(titreForts, data.listLabels && data.listLabels.strengths);
poserTitre(titreFaibles, data.listLabels && data.listLabels.weaknesses);
poserTitre(titreSuggestions, data.listLabels && data.listLabels.suggestions);

renderCategories(data.categories, data.categoryLabels);
renderList(strengthsList, data.strengths, "Vos points forts apparaîtront ici dès qu'un document sera analysé.");
renderList(weaknessesList, data.weaknesses, "Aucun point faible majeur détecté — votre dossier est sur la bonne voie.");
renderList(suggestionsList, data.suggestions, "Pas de suggestion supplémentaire — votre dossier est déjà bien préparé.");
renderChecklist(data.checklist);

resultsPanel.hidden = false;
resultsPanel.scrollIntoView({ behavior: "smooth", block: "start" });

// Le suivi de candidature se souvient de la vérification — même
// principe que generatedLetter/generatedEmail (ai-letter/ai-email).
if (application) {

try {

await updateDoc(doc(db, "users", ctx.user.uid, "applications", application.id), {
dossierCheck: {
score: data.overallScore,
fileCount: files.length,
checkedAt: serverTimestamp()
}
});

} catch (error) {

console.error("Impossible d'enregistrer la vérification sur la candidature :", error);

}

}

trackEvent("verification_run", { fileCount: files.length });

showToast(application ? `Analyse terminée — enregistrée dans "${application.university}".` : "Analyse terminée.");

} catch (error) {

if (!estArret(error)) {
console.error(error);
showToast(messageErreurFitz(error), { type: "error" });
}

} finally {

analyzeBtn.disabled = entries.length === 0;
analyzeBtn.querySelector("span").textContent = "Analyser mon dossier";

}

}

analyzeBtn.addEventListener("click", runAnalysis);

}

bootstrapShell({ feature: "ai_check", espace: ESPACE_OUTILS }).then((ctx) => {

if (ctx.locked) {

document.getElementById("checkApp").remove();
renderLockedState(document.getElementById("lockedState"), ctx);
return;

}

initCheckTool(ctx);

});
