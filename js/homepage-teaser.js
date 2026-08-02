import { db } from "../firebase-config.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

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

function renderCard(university) {

const card = document.createElement("a");
card.className = "teaser-card";
card.href = "universities.html";

card.innerHTML = `
<div class="teaser-card-media">
<img src="assets/images/cities/${university.image || "default.jpg"}" alt="${university.city || university.university || ""}" loading="lazy">
${university.ranking ? `<span class="teaser-card-rank"><i data-lucide="trophy"></i>${university.ranking}</span>` : ""}
</div>
<div class="teaser-card-body">
${university.flag ? `<img class="teaser-card-flag" src="assets/flags/${university.flag}" alt="">` : ""}
<h3>${university.university || "Université partenaire"}</h3>
<p>${[university.city, university.country].filter(Boolean).join(", ")}</p>
${university.scholarship ? `<span class="teaser-card-tag"><i data-lucide="award"></i>${university.scholarship}</span>` : ""}
</div>
`;

return card;

}

async function loadTeaser() {

const grid = document.getElementById("teaserGrid");

if (!grid) return;

try {

const snapshot = await getDocs(collection(db, "universities"));

const all = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));

if (!all.length) {
grid.remove();
return;
}

const withPhoto = all.filter((u) => u.image);
const pool = dedupeByUniversity(withPhoto.length >= TEASER_COUNT ? withPhoto : all);
const picks = pickDiverse(pool, TEASER_COUNT);

grid.innerHTML = "";
picks.forEach((university) => grid.appendChild(renderCard(university)));

if (window.lucide) lucide.createIcons();

} catch (error) {

console.error("Aperçu des opportunités : échec du chargement", error);
grid.remove();

}

}

loadTeaser();
