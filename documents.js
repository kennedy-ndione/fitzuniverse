import { db } from "./firebase-config.js";
import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { DOCUMENTS, DOCUMENT_CATEGORIES, PRIORITY_LEVELS } from "./js/documents-data.js";
import { initShellChrome, bootstrapShell, unlockingPlans, PLAN_LABELS } from "./js/app-shell.js";

initShellChrome();

// Identifiant stable pour un document de la bibliothèque statique
// (DOCUMENTS n'a pas de champ `id` — seul `title` est unique et stable
// dans cette liste). Utilisé comme clé du champ Firestore
// users/{uid}.documentsObtained, une map { slug: true }.
function slugify(title) {
return title
.toLowerCase()
.normalize("NFD").replace(/[̀-ͯ]/g, "")
.replace(/[^a-z0-9]+/g, "-")
.replace(/^-+|-+$/g, "");
}

// Lecture défensive de "generatedDocuments" : une entrée corrompue dans
// le localStorage d'un navigateur (ex. écriture partielle, ancienne
// valeur "undefined" laissée par une version antérieure d'un outil
// Fitz) faisait planter JSON.parse ici de façon synchrone et non
// rattrapée, ce qui interrompait initDocumentsPage() avant même
// d'atteindre applyFilters() : la bibliothèque de 45 documents ne
// s'affichait alors jamais, sans aucune erreur visible à l'écran. La
// lecture ci-dessous ne peut plus jamais bloquer le reste du rendu.
function getGeneratedDocuments() {
try {
const stored = JSON.parse(localStorage.getItem("generatedDocuments") || "[]");
return Array.isArray(stored) ? stored : [];
} catch (error) {
console.warn("Entrée 'generatedDocuments' corrompue dans le localStorage, réinitialisation :", error);
localStorage.removeItem("generatedDocuments");
return [];
}
}

function renderLockedState(container, ctx) {

const flags = ctx.featureFlags.documents;
const target = unlockingPlans(ctx.planId, flags)[0];

container.innerHTML = `
<div class="ai-locked-hero">
<div class="ai-locked-icon"><i data-lucide="lock"></i></div>
<h2>Documents à préparer</h2>
<p>Débloquez les checklists détaillées de Fitz avec ${target ? `la formule <strong>${PLAN_LABELS[target]}</strong>` : "une formule supérieure"} : préparez chaque document sans rien laisser au hasard.</p>
<a href="${target ? `offers.html#${target}` : "offers.html"}" class="btn btn-primary">
<i data-lucide="sparkles"></i>
<span>Choisir ma formule</span>
</a>
</div>
`;

container.hidden = false;

if (window.lucide) lucide.createIcons();

}

function initDocumentsPage(ctx) {

const container = document.getElementById("documentsContainer");
const modal = document.getElementById("documentModal");
const modalIcon = document.getElementById("modalIcon");
const modalCategory = document.getElementById("modalCategory");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const modalClose = document.getElementById("modalClose");
const searchInput = document.getElementById("searchDocument");
const categoryFilters = document.getElementById("categoryFilters");
const resultsCount = document.getElementById("resultsCount");
const obtainedCountEl = document.getElementById("obtainedCount");
const generatedSection = document.getElementById("aiDocumentsSection");
const generatedContainer = document.getElementById("generatedDocuments");

let activeCategory = "";

// État "obtenu" — persisté sur users/{uid}.documentsObtained (map
// slug -> true), pas sur un document séparé : léger, jamais interrogé
// ailleurs que sur cette page, pas besoin d'une sous-collection.
const obtained = { ...(ctx.userData?.documentsObtained || {}) };

function renderObtainedCount() {
const total = DOCUMENTS.length;
const count = DOCUMENTS.filter((d) => obtained[slugify(d.title)]).length;
obtainedCountEl.textContent = `${count}/${total} documents obtenus`;
}

async function toggleObtained(docTitle) {

const slug = slugify(docTitle);
obtained[slug] = !obtained[slug];

renderObtainedCount();
applyFilters();

try {
await updateDoc(doc(db, "users", ctx.user.uid), {
[`documentsObtained.${slug}`]: obtained[slug]
});
} catch (error) {
console.error("Impossible d'enregistrer ce document comme obtenu :", error);
}

}

function categoryLabel(key) {
const found = DOCUMENT_CATEGORIES.find((c) => c.key === key);
return found ? found.label : key;
}

function categoryIcon(key) {
const found = DOCUMENT_CATEGORIES.find((c) => c.key === key);
return found ? found.icon : "file";
}

function renderCategoryFilters() {

DOCUMENT_CATEGORIES.forEach((cat) => {

const chip = document.createElement("button");
chip.type = "button";
chip.className = "docs-category-chip";
chip.dataset.category = cat.key;
chip.innerHTML = `<i data-lucide="${cat.icon}"></i><span>${cat.label}</span>`;

chip.addEventListener("click", () => {
activeCategory = cat.key;
updateActiveChip();
applyFilters();
});

categoryFilters.appendChild(chip);

});

categoryFilters.querySelector('[data-category=""]').addEventListener("click", () => {
activeCategory = "";
updateActiveChip();
applyFilters();
});

}

function updateActiveChip() {

categoryFilters.querySelectorAll(".docs-category-chip").forEach((chip) => {
chip.classList.toggle("is-active", chip.dataset.category === activeCategory);
});

}

function renderCard(docItem, index) {

const card = document.createElement("article");
const isObtained = !!obtained[slugify(docItem.title)];
card.className = "card doc-card" + (isObtained ? " is-obtained" : "");

card.innerHTML = `
<div class="doc-card-icon"><i data-lucide="${docItem.icon}"></i></div>
<span class="doc-card-category">${categoryLabel(docItem.category)}</span>
<h3>${docItem.title}</h3>
<p>${docItem.description}</p>
<label class="doc-card-obtained" data-no-open>
<input type="checkbox" ${isObtained ? "checked" : ""}>
<span>J'ai ce document</span>
</label>
<span class="doc-card-cta">Voir les détails<i data-lucide="arrow-right"></i></span>
`;

card.querySelector(".doc-card-obtained input").addEventListener("click", (event) => {
event.stopPropagation();
toggleObtained(docItem.title);
});

card.querySelector(".doc-card-obtained").addEventListener("click", (event) => event.stopPropagation());

card.addEventListener("click", () => openDetails(index));
card.setAttribute("role", "button");
card.setAttribute("tabindex", "0");
card.addEventListener("keydown", (event) => {
if (event.key === "Enter" || event.key === " ") {
event.preventDefault();
openDetails(index);
}
});

return card;

}

function applyFilters() {

const search = searchInput.value.trim().toLowerCase();

const filteredIndexes = DOCUMENTS.map((doc, index) => index).filter((index) => {

const doc = DOCUMENTS[index];
const matchesCategory = !activeCategory || doc.category === activeCategory;
const matchesSearch = !search ||
doc.title.toLowerCase().includes(search) ||
doc.description.toLowerCase().includes(search) ||
doc.importance.toLowerCase().includes(search);

return matchesCategory && matchesSearch;

});

container.innerHTML = "";

resultsCount.textContent = `${filteredIndexes.length} document${filteredIndexes.length > 1 ? "s" : ""}`;

if (!filteredIndexes.length) {

container.innerHTML = `
<div class="docs-empty-state">
<div class="docs-empty-state-icon"><i data-lucide="search-x"></i></div>
<h3>Essayez une autre recherche</h3>
<p>Changez de mot-clé ou de catégorie pour élargir votre recherche.</p>
</div>
`;

} else {

// Regroupées par priorité (essentiels d'abord) plutôt qu'une seule
// grille de 40+ cartes — l'étudiant se concentre d'abord sur ce qui
// compte le plus, per la philosophie "ne pas surcharger l'interface".
PRIORITY_LEVELS.forEach((tier) => {

const tierIndexes = filteredIndexes.filter((index) => (DOCUMENTS[index].priority || "frequent") === tier.key);

if (!tierIndexes.length) return;

const section = document.createElement("section");
section.className = "docs-priority-section";

const heading = document.createElement("div");
heading.className = "docs-priority-heading";
heading.innerHTML = `
<h3>${tier.label}<span class="docs-priority-count">${tierIndexes.length}</span></h3>
<p>${tier.description}</p>
`;
section.appendChild(heading);

const grid = document.createElement("div");
grid.className = "docs-grid";
tierIndexes.forEach((index) => grid.appendChild(renderCard(DOCUMENTS[index], index)));
section.appendChild(grid);

container.appendChild(section);

});

}

if (window.lucide) lucide.createIcons();

}

function openDetails(index) {

const doc = DOCUMENTS[index];

modalIcon.setAttribute("data-lucide", doc.icon);
modalCategory.textContent = categoryLabel(doc.category);
modalTitle.textContent = doc.title;

modalBody.innerHTML = `
<div class="docs-modal-facts">
<div><span>Niveau</span><strong>${doc.level || "Tous niveaux"}</strong></div>
<div><span>Délivré par</span><strong>${doc.issuedBy || "—"}</strong></div>
<div><span>Temps moyen</span><strong>${doc.averageTime || "—"}</strong></div>
<div><span>Validité</span><strong>${doc.validity || "Pas de limite"}</strong></div>
</div>

<section class="docs-modal-section">
<h4><i data-lucide="info"></i>Pourquoi ce document est important</h4>
<p>${doc.importance}</p>
</section>

${doc.context || doc.requestedBy ? `
<section class="docs-modal-section">
<h4><i data-lucide="calendar-clock"></i>Quand et pour qui</h4>
${doc.context ? `<p><strong>Quand : </strong>${doc.context}</p>` : ""}
${doc.requestedBy ? `<p><strong>Qui le demande le plus souvent : </strong>${doc.requestedBy}</p>` : ""}
</section>
` : ""}

${doc.howToObtain ? `
<section class="docs-modal-section">
<h4><i data-lucide="map-pin"></i>Comment l'obtenir</h4>
<p>${doc.howToObtain}</p>
</section>
` : ""}

<section class="docs-modal-section">
<h4><i data-lucide="scan-line"></i>Ce qu'il faut préparer</h4>
<ul class="docs-modal-list">
${doc.scan.map((item) => `<li><i data-lucide="check"></i><span>${item}</span></li>`).join("")}
</ul>
</section>

<section class="docs-modal-section">
<h4><i data-lucide="lightbulb"></i>Conseils</h4>
<ul class="docs-modal-list is-tips">
${doc.tips.map((item) => `<li><i data-lucide="sparkle"></i><span>${item}</span></li>`).join("")}
</ul>
</section>

<section class="docs-modal-section">
<h4><i data-lucide="triangle-alert"></i>Erreurs fréquentes</h4>
<ul class="docs-modal-list is-mistakes">
${doc.mistakes.map((item) => `<li><i data-lucide="x"></i><span>${item}</span></li>`).join("")}
</ul>
</section>

<div class="docs-modal-tip">
<i data-lucide="graduation-cap"></i>
<div>
<strong>Conseil ScholarBridge</strong>
<p>${doc.scholarBridgeTip}</p>
</div>
</div>

${doc.title === "Lettre de motivation" ? `
<a href="ai-letter.html" class="btn btn-primary docs-modal-generate">
<i data-lucide="sparkles"></i>
<span>Générer ma lettre avec Fitz</span>
</a>
` : ""}
`;

modal.hidden = false;

if (window.lucide) lucide.createIcons();

}

function closeModal() {
modal.hidden = true;
}

modalClose.addEventListener("click", closeModal);
modal.addEventListener("click", (event) => {
if (event.target === modal) closeModal();
});

// ===============================
// Documents générés par Fitz (localStorage — écrits par ai-letter.js,
// ai-email.js, ai-check.js, ai-translate.js)
// ===============================
function renderGeneratedDocuments() {

const generatedDocuments = getGeneratedDocuments();

if (!generatedDocuments.length) {
generatedSection.hidden = true;
return;
}

generatedSection.hidden = false;
generatedContainer.innerHTML = "";

generatedDocuments.forEach((doc, index) => {

const card = document.createElement("article");
card.className = "generated-doc-card";

card.innerHTML = `
<div class="generated-doc-icon"><i data-lucide="${doc.icon || "file-text"}"></i></div>
<div class="generated-doc-body">
<h3>${doc.title}</h3>
<span class="generated-doc-date"><i data-lucide="sparkles"></i>Généré par Fitz · ${doc.date || ""}</span>
</div>
<div class="generated-doc-actions">
<button type="button" class="btn-ghost btn-sm" data-action="view"><i data-lucide="eye"></i></button>
<button type="button" class="btn-ghost btn-sm" data-action="download"><i data-lucide="download"></i></button>
<button type="button" class="btn-ghost btn-sm" data-action="delete"><i data-lucide="trash-2"></i></button>
</div>
`;

card.querySelector('[data-action="view"]').addEventListener("click", () => viewGeneratedDocument(index));
card.querySelector('[data-action="download"]').addEventListener("click", () => downloadGeneratedDocument(index));
card.querySelector('[data-action="delete"]').addEventListener("click", () => deleteGeneratedDocument(index));

generatedContainer.appendChild(card);

});

if (window.lucide) lucide.createIcons();

}

function viewGeneratedDocument(index) {

const generatedDocuments = getGeneratedDocuments();
const doc = generatedDocuments[index];

if (!doc) return;

modalIcon.setAttribute("data-lucide", doc.icon || "file-text");
modalCategory.textContent = "Généré par Fitz";
modalTitle.textContent = doc.title;
modalBody.innerHTML = `<section class="docs-modal-section"><p style="white-space:pre-wrap;line-height:1.8;">${doc.content}</p></section>`;

modal.hidden = false;

if (window.lucide) lucide.createIcons();

}

function downloadGeneratedDocument(index) {

const generatedDocuments = getGeneratedDocuments();
const doc = generatedDocuments[index];

if (!doc || !window.jspdf) return;

const { jsPDF } = window.jspdf;
const pdf = new jsPDF();

pdf.setFont("helvetica", "bold");
pdf.setFontSize(18);
pdf.text(doc.title, 20, 20);

pdf.setFont("helvetica", "normal");
pdf.setFontSize(12);

const lignes = pdf.splitTextToSize(doc.content, 170);
pdf.text(lignes, 20, 35);

pdf.save(doc.title.replace(/\s+/g, "_") + ".pdf");

}

function deleteGeneratedDocument(index) {

if (!confirm("Voulez-vous vraiment supprimer ce document ?")) return;

const generatedDocuments = getGeneratedDocuments();
generatedDocuments.splice(index, 1);

localStorage.setItem("generatedDocuments", JSON.stringify(generatedDocuments));

renderGeneratedDocuments();

}

searchInput.addEventListener("input", applyFilters);

renderCategoryFilters();
renderGeneratedDocuments();
renderObtainedCount();
applyFilters();

}

bootstrapShell({ feature: "documents" }).then((ctx) => {

if (ctx.locked) {

document.getElementById("documentsApp").remove();
renderLockedState(document.getElementById("lockedState"), ctx);
return;

}

initDocumentsPage(ctx);

}).catch((error) => {

// Filet de sécurité : sans ce .catch(), une exception levée pendant
// initDocumentsPage()/renderLockedState() (ex. donnée corrompue,
// erreur inattendue) rejetait cette promesse silencieusement — la
// page restait affichée (loader déjà masqué par bootstrapShell) mais
// sans aucun document ni message, sans la moindre erreur visible.
console.error("Erreur lors de l'affichage de la page Documents :", error);

const content = document.querySelector("main.content");

if (content) {
content.innerHTML = `
<div style="padding:40px;text-align:center;color:var(--text-color);">
<h2>Cette page n'a pas pu s'afficher</h2>
<p>Vérifiez votre connexion Internet, puis réessayez.</p>
<button type="button" class="btn btn-primary" onclick="window.location.reload()">Réessayer</button>
</div>
`;
}

});
