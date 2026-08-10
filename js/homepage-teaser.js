import { db } from "../firebase-config.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// Résout, pour une université, une bourse compatible réelle via
// "programs" (université × bourse × niveau) — même pattern que
// universities-page.js/scholarships.js. Remplace l'ancien
// university.scholarship (champ plat de l'ex-modèle pré-migration
// 2026-07-30, où un même établissement existait en 3 documents par
// niveau) : ce champ n'est plus fiable ni garanti présent sur les
// documents "universities" créés depuis.
function firstScholarshipTitle(universityFirestoreId, programs, scholarshipsById) {

const program = programs.find((p) => p.universityId === universityFirestoreId && p.scholarshipId);

if (!program) return "";

const scholarship = scholarshipsById.get(program.scholarshipId);

return scholarship ? scholarship.title : "";

}

const TEASER_COUNT = 4;

// Un même établissement existe en 3 documents Firestore (un par niveau
// Licence/Master/Doctorat) — sans ce regroupement, le tirage pourrait
// afficher le même établissement (et la même photo) plusieurs fois.
function dedupeByUniversity(list) {

const seen = new Set();
const result = [];

list.forEach((entry) => {

const key = `${entry.university || ""}|${entry.city || ""}`;

if (seen.has(key)) return;

seen.add(key);
result.push(entry);

});

return result;

}

// Tirage à photos distinctes : plusieurs établissements peuvent partager
// la même ville (donc la même photo) — on prend au maximum un
// établissement par photo pour que les 4 cartes se ressemblent le moins
// possible.
function pickDiverse(list, count) {

const byPhoto = new Map();

list.forEach((entry) => {

const key = entry.image || "default.jpg";

if (!byPhoto.has(key)) byPhoto.set(key, []);
byPhoto.get(key).push(entry);

});

const groups = [...byPhoto.values()];
const picks = [];

let round = 0;

while (picks.length < count && groups.some((group) => group.length > round)) {

groups.forEach((group) => {
if (picks.length < count && group[round]) picks.push(group[round]);
});

round += 1;

}

return picks;

}

// Largeur réelle de chaque carte selon son slot dans la grille bento
// (voir css/homepage-sections.css .teaser-grid) : la carte 0 fait ~2x
// une carte normale sur desktop, la carte 3 devient une bannière pleine
// largeur en 2e rangée — sizes doit refléter ces 2 cas particuliers,
// sinon le navigateur choisirait une variante srcset trop petite pour
// ces slots-là.
function sizesForSlot(index) {

if (index === 0) return "(max-width:599px) 100vw, (max-width:1023px) 50vw, 570px";
if (index === 3) return "(max-width:599px) 100vw, (max-width:1023px) 50vw, 1160px";

return "(max-width:599px) 100vw, (max-width:1023px) 50vw, 275px";

}

function renderCard(university, scholarshipTitle, index) {

const card = document.createElement("a");
card.className = "teaser-card";
card.href = "universities.html";

const image = university.image || "default.jpg";
const base = image.replace(/\.jpe?g$/i, "");

// Variantes générées par scripts/generate-city-srcset.mjs (400/800/1200px)
// à partir des photos ~2000px/300-580KB d'origine : la 1re carte de
// l'aperçu (index 0) est la seule à charger avant le scroll, elle seule
// reçoit fetchpriority/loading="eager" — les 3 autres restent lazy.
const srcset = [400, 800, 1200].map((w) => `assets/images/cities/${base}-${w}w.jpg ${w}w`).join(", ");

card.innerHTML = `
<div class="teaser-card-media">
<img src="assets/images/cities/${base}-800w.jpg" srcset="${srcset}" sizes="${sizesForSlot(index)}" alt="${university.city || university.university || ""}" ${index === 0 ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'}>
${university.ranking ? `<span class="teaser-card-rank"><i data-lucide="trophy"></i>${university.ranking}</span>` : ""}
</div>
<div class="teaser-card-body">
${university.flag ? `<img class="teaser-card-flag" src="assets/flags/${university.flag}" alt="">` : ""}
<h3>${university.university || "Université partenaire"}</h3>
<p>${[university.city, university.country].filter(Boolean).join(", ")}</p>
${scholarshipTitle ? `<span class="teaser-card-tag"><i data-lucide="award"></i>${scholarshipTitle}</span>` : ""}
</div>
`;

return card;

}

async function loadTeaser() {

const grid = document.getElementById("teaserGrid");

if (!grid) return;

try {

const [universitiesSnap, programsSnap, scholarshipsSnap] = await Promise.all([
getDocs(collection(db, "universities")),
getDocs(collection(db, "programs")),
getDocs(collection(db, "scholarships"))
]);

const all = universitiesSnap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
const programs = programsSnap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
const scholarshipsById = new Map(scholarshipsSnap.docs.map((docSnap) => [docSnap.id, { id: docSnap.id, ...docSnap.data() }]));

if (!all.length) {
grid.remove();
return;
}

const withPhoto = all.filter((u) => u.image);
const pool = dedupeByUniversity(withPhoto.length >= TEASER_COUNT ? withPhoto : all);
const picks = pickDiverse(pool, TEASER_COUNT);

grid.innerHTML = "";
picks.forEach((university, index) => grid.appendChild(renderCard(university, firstScholarshipTitle(university.id, programs, scholarshipsById), index)));

if (window.lucide) lucide.createIcons();

} catch (error) {

console.error("Aperçu des opportunités : échec du chargement", error);
grid.remove();

}

}

loadTeaser();
