import { db } from "./firebase-config.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// ============================
// Page publique, en accès libre — même philosophie que
// universities-page.js (voir [[portal-transparency-philosophy]]).
//
// Architecture relationnelle (2026-07-30) : "scholarships" est déjà un
// document par programme (plus de duplication par niveau ni par
// université — voir admin/migrate.js pour la migration). Les
// universités partenaires d'une bourse se lisent via "programs"
// (where scholarshipId == cette bourse), jamais via un champ texte.
// ============================

// Repli si aucune université partenaire n'est encore enregistrée pour
// ce programme (donc aucune photo à réutiliser) : capitale du pays qui
// accorde la bourse, quand une photo existe déjà dans
// assets/images/cities (réutilisée telle quelle, aucun nouvel asset).
const COUNTRY_FALLBACK_IMAGE = {
"Chine": "beijing.jpg",
"Japon": "tokyo.jpg",
"Corée du Sud": "seoul.jpg",
"Hongrie": "budapest.jpg",
"Italie": "rome.jpg",
"Turquie": "istanbul.jpg",
"Roumanie": "bucharest.jpg",
"Arabie Saoudite": "riyadh.jpg"
};

const GENERIC_FALLBACK_IMAGES = ["hero-bg.jpg", "hero-bg2.jpg", "hero-bg3.jpg", "hero-bg4.jpg", "hero-bg5.jpg"];

function hashCode(str) {
let hash = 0;
for (let i = 0; i < str.length; i++) {
hash = (hash << 5) - hash + str.charCodeAt(i);
hash |= 0;
}
return hash;
}

const params = new URLSearchParams(window.location.search);

const recherche = params.get("search") || "";
const niveau = params.get("level") || "";

const container = document.getElementById("scholarship-list");
const searchInput = document.getElementById("searchInput");
const levelFilter = document.getElementById("levelFilter");
const resultsCount = document.getElementById("resultsCount");
const clearFiltersLink = document.getElementById("clearFiltersLink");

function renderSkeleton() {

container.innerHTML = "";

for (let i = 0; i < 6; i++) {

const card = document.createElement("div");
card.className = "bourses-skeleton";

card.innerHTML = `
<div class="bourses-skeleton-line" style="width:100%;height:150px;border-radius:14px;"></div>
<div class="bourses-skeleton-line" style="width:50%;height:24px;margin-top:18px;"></div>
<div class="bourses-skeleton-line" style="width:80%;"></div>
<div class="bourses-skeleton-line" style="width:60%;"></div>
`;

container.appendChild(card);

}

}

// Résout, pour une bourse, ses universités partenaires (via programs)
// afin d'en tirer les pays réellement éligibles et une photo
// représentative — jamais le nom/logo d'une université précise,
// volontairement, pour ne pas empiéter sur le rôle du catalogue
// Universités.
function enrichWithProgramData(scholarship, programs, universitiesById) {

const linkedPrograms = programs.filter((p) => p.scholarshipId === scholarship.id);

const linkedUniversities = linkedPrograms
.map((p) => universitiesById.get(p.universityId))
.filter(Boolean);

const countries = [...new Set(
linkedUniversities.map((u) => u.country).filter(Boolean).concat(scholarship.country ? [scholarship.country] : [])
)];

const withImage = linkedUniversities.find((u) => u.image);

const image = withImage
? `assets/images/cities/${withImage.image}`
: COUNTRY_FALLBACK_IMAGE[scholarship.country]
? `assets/images/cities/${COUNTRY_FALLBACK_IMAGE[scholarship.country]}`
: `assets/images/${GENERIC_FALLBACK_IMAGES[Math.abs(hashCode(scholarship.title || scholarship.id)) % GENERIC_FALLBACK_IMAGES.length]}`;

return { ...scholarship, countries, image, partnerCount: linkedUniversities.length };

}

// Description courte construite uniquement à partir des champs déjà en
// base (pays, financement, niveaux) — aucune donnée inventée.
function buildDescription(scholarship) {

if (scholarship.description) return scholarship.description;

const levels = (scholarship.levels || []).length ? scholarship.levels.join(", ") : null;
const funding = scholarship.funding ? ` financée à ${scholarship.funding}` : "";
const country = scholarship.country ? ` par le gouvernement de ${scholarship.country}` : "";

return `Bourse d'État accordée${country}${funding}${levels ? `, ouverte du niveau ${levels}` : ""}.`;

}

let allScholarships = [];

async function chargerBourses() {

renderSkeleton();

try {

const [scholarshipsSnap, programsSnap, universitiesSnap] = await Promise.all([
getDocs(collection(db, "scholarships")),
getDocs(collection(db, "programs")),
getDocs(collection(db, "universities"))
]);

const programs = programsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
const universitiesById = new Map(universitiesSnap.docs.map((d) => [d.id, { id: d.id, ...d.data() }]));

allScholarships = scholarshipsSnap.docs
.map((d) => ({ id: d.id, ...d.data() }))
.map((s) => enrichWithProgramData(s, programs, universitiesById));

applyFilters();

}

catch (error) {

console.error("Erreur Firestore :", error);

container.innerHTML = `
<div class="bourses-empty-state">
<div class="bourses-empty-state-icon"><i data-lucide="wifi-off"></i></div>
<h3>Chargement interrompu</h3>
<p>Vérifiez votre connexion Internet, puis réessayez.</p>
</div>
`;

if (window.lucide) lucide.createIcons();

}

}

function applyFilters() {

let scholarships = allScholarships;

if (recherche) {
scholarships = scholarships.filter((scholarship) => {

const haystack = [
scholarship.title,
scholarship.country,
...(scholarship.countries || []),
...(scholarship.levels || [])
].join(" ").toLowerCase();

return haystack.includes(recherche.toLowerCase());

});
}

if (niveau) {
scholarships = scholarships.filter((scholarship) => (scholarship.levels || []).includes(niveau));
}

afficherBourses(scholarships);

}

function renderCard(scholarship) {

const card = document.createElement("div");

card.className = "card scholarship-card";

const isOpen = scholarship.isActive !== false;

const levelChips = (scholarship.levels || [])
.map((level) => `<span class="scholarship-card-chip"><i data-lucide="graduation-cap"></i>${level}</span>`)
.join("");

// N'affiche la liste des pays éligibles que si elle apporte une
// information (plus d'un pays, ou différente du pays déjà montré sur
// la photo) — sinon c'est une redite pure.
const otherCountries = (scholarship.countries || []).filter((c) => c !== scholarship.country);
const showCountriesRow = otherCountries.length > 0;

card.innerHTML = `
<div class="scholarship-card-media">
<img src="${scholarship.image}" alt="" loading="lazy">
<span class="scholarship-card-status ${isOpen ? "is-open" : ""}">${isOpen ? "Ouverte" : "Fermée"}</span>
</div>

<div class="scholarship-card-top">

<div class="scholarship-card-country">
<span class="scholarship-card-country-icon"><i data-lucide="globe"></i></span>
<span>${scholarship.country || "—"}</span>
</div>

</div>

<div class="scholarship-card-body">

<h3>${scholarship.title || "Bourse d'études"}</h3>

<p class="scholarship-card-desc">${buildDescription(scholarship)}</p>

<div class="scholarship-card-meta">
${levelChips}
${scholarship.funding ? `<span class="scholarship-card-chip is-funding"><i data-lucide="coins"></i>${scholarship.funding} financé</span>` : ""}
</div>

${showCountriesRow ? `<div class="scholarship-card-countries"><strong>Pays éligibles :</strong><span>${scholarship.countries.join(", ")}</span></div>` : ""}

<button type="button" class="scholarship-card-cta details-btn">
<span>Voir les universités partenaires</span>
<i data-lucide="arrow-right"></i>
</button>

</div>
`;

card.querySelector(".details-btn").addEventListener("click", () => {
window.location.href = `universities.html?scholarshipId=${encodeURIComponent(scholarship.id)}`;
});

return card;

}

function afficherBourses(scholarships) {

container.innerHTML = "";

resultsCount.textContent = `${scholarships.length} bourse${scholarships.length > 1 ? "s" : ""} trouvée${scholarships.length > 1 ? "s" : ""}`;
clearFiltersLink.hidden = !(recherche || niveau);

if (scholarships.length === 0) {

container.innerHTML = `
<div class="bourses-empty-state">
<div class="bourses-empty-state-icon"><i data-lucide="search-x"></i></div>
<h3>Pas encore de résultat pour cette recherche</h3>
<p>Essayez un autre pays, un autre niveau, ou modifiez votre recherche.</p>
</div>
`;

if (window.lucide) lucide.createIcons();

return;

}

scholarships.forEach((scholarship) => {
container.appendChild(renderCard(scholarship));
});

if (window.lucide) lucide.createIcons();

}

// ============================
// Barre de recherche
// ============================

if (searchInput) {

searchInput.value = recherche;

searchInput.addEventListener("keydown", function (event) {

if (event.key === "Enter") {

const value = searchInput.value.trim();

const url = new URL("scholarships.html", window.location.origin);

if (value) {
url.searchParams.set("search", value);
}

if (levelFilter && levelFilter.value) {
url.searchParams.set("level", levelFilter.value);
}

window.location.href = url.toString();

}

});

}

// ============================
// Filtre niveau
// ============================

if (levelFilter) {

levelFilter.value = niveau;

levelFilter.addEventListener("change", function () {

const url = new URL("scholarships.html", window.location.origin);

if (recherche) {
url.searchParams.set("search", recherche);
}

if (this.value) {
url.searchParams.set("level", this.value);
}

window.location.href = url.toString();

});

}

chargerBourses();
