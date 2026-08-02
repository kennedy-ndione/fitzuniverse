import { db } from "./firebase-config.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import { trackEvent } from "./js/analytics.js";

// Page publique, en accès libre — voir la note dans universities.css.
// Aucun garde d'authentification ici, volontairement : le catalogue est
// une information publique, jamais verrouillée derrière un compte ou
// une formule (voir [[portal-transparency-philosophy]]).
//
// Architecture relationnelle (2026-07-30) : "universities" est déjà un
// document par établissement réel (plus de duplication par niveau — le
// regroupement client qui existait ici auparavant a disparu, il n'a
// plus lieu d'être). Les niveaux/bourses disponibles pour chaque
// université se lisent via "programs" (where universityId == cette
// université), jamais via un champ texte sur le profil.

const LEVEL_ORDER = ["Licence", "Master", "Doctorat"];

function statusClass(status) {
return String(status || "").toLowerCase().includes("ouvert") ? "is-open" : "";
}

function renderCard(university) {

const card = document.createElement("div");
card.className = "card uni-card";
card.setAttribute("role", "button");
card.setAttribute("tabindex", "0");

const levelChips = university.levels.length
? university.levels.map((level) => `<span class="uni-card-chip"><i data-lucide="graduation-cap"></i>${level}</span>`).join("")
: "";

const scholarshipLabel = university.scholarshipTitles.length
? university.scholarshipTitles.join(" · ")
: "";

card.innerHTML = `
<div class="uni-card-media uni-card-media--variant-${university.photoVariant || 0}">
<img src="assets/images/cities/${university.image || "default.jpg"}" alt="${university.city || university.name}" loading="lazy">
${university.ranking ? `<span class="uni-card-rank"><i data-lucide="trophy"></i>${university.ranking}</span>` : ""}
${university.status ? `<span class="uni-card-status ${statusClass(university.status)}">${university.status}</span>` : ""}
<div class="uni-card-location">
${university.flag ? `<img src="assets/flags/${university.flag}" alt="">` : ""}
<span>${[university.city, university.country].filter(Boolean).join(", ")}</span>
</div>
</div>
<div class="uni-card-body">
<h3>${university.name || "Université"}</h3>
${scholarshipLabel ? `<p class="uni-card-scholarship">${scholarshipLabel}</p>` : ""}
<div class="uni-card-meta">
${levelChips}
${university.language ? `<span class="uni-card-chip"><i data-lucide="languages"></i>${university.language}</span>` : ""}
</div>
<div class="uni-card-footer">
${university.deadline ? `<span class="uni-card-deadline"><i data-lucide="clock"></i>${university.deadline}</span>` : `<span></span>`}
<span class="uni-card-cta">Voir les détails<i data-lucide="arrow-right"></i></span>
</div>
</div>
`;

function goToDetails() {

trackEvent("university_viewed", {
country: university.country,
university: university.name
});

window.location.href = `scholarship-details.html?id=${university.primaryProgramId}`;

}

card.addEventListener("click", goToDetails);
card.addEventListener("keydown", (event) => {
if (event.key === "Enter" || event.key === " ") {
event.preventDefault();
goToDetails();
}
});

return card;

}

function renderEmptyState() {

container.innerHTML = `
<div class="uni-empty-state">
<div class="uni-empty-state-icon"><i data-lucide="search-x"></i></div>
<h3>Pas encore de résultat pour cette recherche</h3>
<p>Essayez un autre pays, un autre niveau, ou modifiez votre recherche.</p>
</div>
`;

}

const params = new URLSearchParams(window.location.search);
const scholarshipIdFilter = params.get("scholarshipId") || "";

const container = document.getElementById("universities-list");
const searchInput = document.getElementById("searchInput");
const countryFilter = document.getElementById("countryFilter");
const levelFilter = document.getElementById("levelFilter");
const resetBtn = document.getElementById("resetFiltersBtn");
const resultsCount = document.getElementById("resultsCount");
const statTotal = document.getElementById("statTotal");
const statCountries = document.getElementById("statCountries");
const scholarshipContext = document.getElementById("scholarshipContext");
const scholarshipContextName = document.getElementById("scholarshipContextName");
const heroTitle = document.getElementById("title");
const heroSubtitle = document.getElementById("subtitle");

levelFilter.value = params.get("level") || "";

let allUniversities = [];
let allPrograms = [];
let allScholarshipsById = new Map();

function renderSkeleton() {

container.innerHTML = "";

for (let i = 0; i < 6; i++) {

const card = document.createElement("div");
card.className = "uni-card-skeleton";

card.innerHTML = `
<div class="ai-skeleton uni-skel-media"></div>
<div class="ai-skeleton uni-skel-line" style="width:70%;"></div>
<div class="ai-skeleton uni-skel-line" style="width:45%;"></div>
<div class="ai-skeleton uni-skel-line" style="width:85%;"></div>
`;

container.appendChild(card);

}

}

// Combine un profil d'université avec ses programmes (niveaux, bourses,
// deadline la plus proche...) — une seule carte par établissement,
// enrichie plutôt que dupliquée.
function buildCardModel(university, programsForUniversity, photoVariant) {

const levels = [...new Set(programsForUniversity.map((p) => p.level).filter(Boolean))]
.sort((a, b) => LEVEL_ORDER.indexOf(a) - LEVEL_ORDER.indexOf(b));

const scholarshipTitles = [...new Set(
programsForUniversity.map((p) => (allScholarshipsById.get(p.scholarshipId) || {}).title).filter(Boolean)
)];

const deadlines = programsForUniversity.map((p) => p.deadline).filter(Boolean).sort();
const languages = [...new Set(programsForUniversity.map((p) => p.language).filter(Boolean))];
const statuses = programsForUniversity.map((p) => p.status).filter(Boolean);

return {
...university,
levels,
scholarshipTitles,
deadline: deadlines[0] || "",
language: languages[0] || "",
status: statuses.find((s) => String(s).toLowerCase().includes("ouvert")) || statuses[0] || "",
primaryProgramId: programsForUniversity[0] ? programsForUniversity[0].firestoreId : university.firestoreId,
photoVariant
};

}

function applyFilters() {

const search = searchInput.value.trim().toLowerCase();
const country = countryFilter.value;
const level = levelFilter.value;

const scope = scholarshipIdFilter
? allUniversities.filter((u) => allPrograms.some((p) => p.universityId === u.firestoreId && p.scholarshipId === scholarshipIdFilter))
: allUniversities;

const filtered = scope.filter((university) => {

const programsForUniversity = allPrograms.filter((p) => p.universityId === university.firestoreId);
const universityLevels = programsForUniversity.map((p) => p.level);

return (
(!country || university.country === country) &&
(!level || universityLevels.includes(level)) &&
(!search ||
(university.name || "").toLowerCase().includes(search) ||
(university.city || "").toLowerCase().includes(search) ||
(university.country || "").toLowerCase().includes(search))
);

});

container.innerHTML = "";

// Plusieurs universités différentes peuvent légitimement partager la
// même ville (donc la même photo) — variante de cadrage différente
// pour chaque occurrence plutôt que des vignettes identiques.
const photoOccurrence = new Map();

const cards = filtered.map((university) => {

const photoKey = university.image || "default.jpg";
const variant = photoOccurrence.get(photoKey) || 0;
photoOccurrence.set(photoKey, variant + 1);

const programsForUniversity = scholarshipIdFilter
? allPrograms.filter((p) => p.universityId === university.firestoreId && p.scholarshipId === scholarshipIdFilter)
: allPrograms.filter((p) => p.universityId === university.firestoreId);

return buildCardModel(university, programsForUniversity, variant % 4);

});

resultsCount.textContent = `${cards.length} établissement${cards.length > 1 ? "s" : ""} trouvé${cards.length > 1 ? "s" : ""}`;

if (cards.length === 0) {
renderEmptyState();
} else {
cards.forEach((card) => container.appendChild(renderCard(card)));
}

if (window.lucide) lucide.createIcons();

}

function populateCountryFilter() {

// Scopé au programme quand on arrive filtré par bourse, pour ne
// jamais proposer un pays qui viderait la liste.
const scope = scholarshipIdFilter
? allUniversities.filter((u) => allPrograms.some((p) => p.universityId === u.firestoreId && p.scholarshipId === scholarshipIdFilter))
: allUniversities;

const countries = [...new Set(scope.map((u) => u.country).filter(Boolean))].sort((a, b) => a.localeCompare(b));

countries.forEach((country) => {
countryFilter.add(new Option(country, country));
});

const fromUrl = params.get("country");
if (fromUrl && countries.includes(fromUrl)) {
countryFilter.value = fromUrl;
}

}

async function chargerUniversites() {

renderSkeleton();

try {

const [universitiesSnap, programsSnap, scholarshipsSnap] = await Promise.all([
getDocs(collection(db, "universities")),
getDocs(collection(db, "programs")),
getDocs(collection(db, "scholarships"))
]);

allUniversities = universitiesSnap.docs.map((docSnap) => ({ firestoreId: docSnap.id, ...docSnap.data() }));
allPrograms = programsSnap.docs.map((docSnap) => ({ firestoreId: docSnap.id, ...docSnap.data() }));
allScholarshipsById = new Map(scholarshipsSnap.docs.map((docSnap) => [docSnap.id, { firestoreId: docSnap.id, ...docSnap.data() }]));

if (scholarshipIdFilter) {

const scholarship = allScholarshipsById.get(scholarshipIdFilter);

scholarshipContext.hidden = false;
scholarshipContextName.textContent = scholarship ? scholarship.title : "Bourse";

if (heroTitle) heroTitle.textContent = "Universités partenaires";
if (heroSubtitle) heroSubtitle.textContent = `Établissements proposant la bourse « ${scholarship ? scholarship.title : ""} ». Affinez par pays ou par niveau si besoin.`;

}

const statsScope = scholarshipIdFilter
? allUniversities.filter((u) => allPrograms.some((p) => p.universityId === u.firestoreId && p.scholarshipId === scholarshipIdFilter))
: allUniversities;

statTotal.textContent = statsScope.length;
statCountries.textContent = new Set(statsScope.map((u) => u.country).filter(Boolean)).size;

populateCountryFilter();
applyFilters();

} catch (error) {

console.error("Erreur lors du chargement des universités :", error);

container.innerHTML = `
<div class="uni-empty-state">
<div class="uni-empty-state-icon"><i data-lucide="wifi-off"></i></div>
<h3>Chargement interrompu</h3>
<p>Vérifiez votre connexion Internet, puis réessayez.</p>
</div>
`;

if (window.lucide) lucide.createIcons();

}

}

searchInput.addEventListener("input", applyFilters);
countryFilter.addEventListener("change", applyFilters);
levelFilter.addEventListener("change", applyFilters);

resetBtn.addEventListener("click", () => {

if (scholarshipIdFilter) {
window.location.href = "universities.html";
return;
}

searchInput.value = "";
countryFilter.value = "";
levelFilter.value = "";
applyFilters();

});

chargerUniversites();

if (window.lucide) lucide.createIcons();
