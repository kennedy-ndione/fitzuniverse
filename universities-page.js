import { trackEvent } from "./js/analytics.js";

import { resolveCityImage } from "./js/scholarship-image.js";

// Chargeur de catalogue partagé et mémoïsé — voir js/catalog-data.js.
import { chargerCatalogue } from "./js/catalog-data.js";

// La vue par pays, partagée avec scholarships.js — voir l'en-tête de
// js/catalogue-vue.js. Cette page souffrait du même mal : 155 cartes
// empilées, une page dont on ne voit pas la fin.
import { decouperVue, ligneEtendue, libelleVoirTout } from "./js/catalogue-vue.js";

// Le coût réel par université (lot D1, 2026-09-07) — voir l'en-tête de
// js/frais.js. Règle des trois valeurs : sans prix VÉRIFIÉ (sourcé et
// daté), la carte dit « Frais non vérifiés », jamais « gratuit ».
import { BANDES, LIBELLES_BANDES, LIBELLES_EXONERATION, lireFrais, lireExoneration, bandeCout, formaterMontant } from "./js/frais.js";
import { formaterDate } from "./js/echeance.js";

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

function slugify(str) {

return (str || "")
.normalize("NFD")
.replace(/[̀-ͯ]/g, "")
.toLowerCase()
.replace(/[^a-z0-9]+/g, "-")
.replace(/^-+|-+$/g, "");

}

// Regroupe par pays, sections triées par richesse décroissante (le
// pays le mieux fourni en premier), égalité départagée alphabétique —
// jamais d'accordéon, toutes les sections restent ouvertes.
function groupByCountry(items) {

const groups = new Map();

items.forEach((item) => {
const country = item.country || "Autre";
if (!groups.has(country)) groups.set(country, []);
groups.get(country).push(item);
});

return [...groups.entries()]
.map(([country, group]) => ({ country, items: group }))
.sort((a, b) => b.items.length - a.items.length || a.country.localeCompare(b.country));

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

// Lot D1 : le coût, honnête. Vérifié → le montant, la date en title ;
// inconnu → « Frais non vérifiés » en gris atténué, jamais en rouge :
// ce n'est pas une alerte, c'est une information manquante.
const { frais, exoneration, niveau } = university.cout || { frais: { etat: "inconnu" }, exoneration: { politique: "inconnue" }, niveau: "" };

const costChip = frais.etat === "verifie"
? `<span class="uni-card-chip is-cost" title="${niveau} — ${frais.fraiche ? "vérifié le" : "à recouper, vérifié le"} ${formaterDate(frais.verifieLe)}"><i data-lucide="wallet"></i>${formaterMontant(frais.montant, frais.devise, frais.periode)}${frais.fraiche ? "" : " · à recouper"}</span>`
: `<span class="uni-card-chip is-cost-unknown" title="Aucun montant vérifié pour cet établissement"><i data-lucide="wallet"></i>${LIBELLES_BANDES.inconnu}</span>`;

const exonerationChip = exoneration.politique !== "inconnue"
? `<span class="uni-card-chip is-exoneration" title="${exoneration.detail || LIBELLES_EXONERATION[exoneration.politique]}"><i data-lucide="badge-percent"></i>${LIBELLES_EXONERATION[exoneration.politique]}</span>`
: "";

// Photo de ville en variantes responsives (2026-08-29). Avant ce
// correctif, cette ligne posait le FICHIER D'ORIGINE de
// assets/images/cities/ — oxford.jpg fait 2,6 Mo, waseda.jpg 2,6 Mo :
// mesuré, huit cartes suffisaient à charger 11 Mo d'images. Le
// repli "default.jpg" visait par ailleurs un fichier absent du dépôt.
// Voir resolveCityImage() dans js/scholarship-image.js.
const cityPhoto = resolveCityImage(university.image);

card.innerHTML = `
<div class="uni-card-media uni-card-media--variant-${university.photoVariant || 0}">
<img src="${cityPhoto.src}" srcset="${cityPhoto.srcset}" sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 360px" width="800" height="533" alt="${university.city || university.name}" loading="lazy" decoding="async" onerror="this.onerror=null;this.removeAttribute('srcset');this.src='${cityPhoto.fallbackOriginal}'">
${university.ranking ? `<span class="uni-card-rank"><i data-lucide="trophy"></i>${university.ranking}</span>` : ""}
${university.status ? `<span class="uni-card-status ${statusClass(university.status)}">${university.status}</span>` : ""}
<div class="uni-card-location">
${university.flag ? `<img src="assets/flags/${university.flag}" alt="" width="20" height="15" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='assets/flags/default.svg'">` : ""}
<span>${[university.city, university.country].filter(Boolean).join(", ")}</span>
</div>
</div>
<div class="uni-card-body">
<h3>${university.name || "Université"}</h3>
${scholarshipLabel ? `<p class="uni-card-scholarship">${scholarshipLabel}</p>` : ""}
<div class="uni-card-meta">
${levelChips}
${university.language ? `<span class="uni-card-chip"><i data-lucide="languages"></i>${university.language}</span>` : ""}
${costChip}
${exonerationChip}
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
const searchClearBtn = document.getElementById("searchClearBtn");
const countryFilter = document.getElementById("countryFilter");
const levelFilter = document.getElementById("levelFilter");
const costFilter = document.getElementById("costFilter");
const resetBtn = document.getElementById("resetFiltersBtn");

// Les bandes viennent de js/frais.js, jamais recopiées ici. « Tous »
// est déjà dans le HTML ; js/catalog-select.js voit les options
// arriver (MutationObserver) et rebâtit son menu.
BANDES.forEach((bande) => costFilter.add(new Option(LIBELLES_BANDES[bande], bande)));
const resultsCount = document.getElementById("resultsCount");
const countryPills = document.getElementById("countryPills");
const statTotal = document.getElementById("statTotal");
const statCountries = document.getElementById("statCountries");
const scholarshipContext = document.getElementById("scholarshipContext");
const scholarshipContextName = document.getElementById("scholarshipContextName");
const heroTitle = document.getElementById("title");
const heroSubtitle = document.getElementById("subtitle");

levelFilter.value = params.get("level") || "";
costFilter.value = BANDES.includes(params.get("cost")) ? params.get("cost") : "";

// La recherche traverse l'URL depuis le 2026-09-06 (voir
// urlAvecFiltres) : elle doit donc aussi en revenir, sinon un lien
// partagé ou un retour arrière afficherait un champ vide au-dessus
// d'une liste filtrée.
searchInput.value = params.get("search") || "";
searchClearBtn.hidden = !searchInput.value;

// « Tout afficher » (2026-09-06) : la porte de sortie vers le rendu
// d'avant la vue par pays — les 155 cartes d'un coup. Voir l'en-tête de
// js/catalogue-vue.js.
const toutAfficher = params.get("all") === "1";

const NOMS_UNIS = { un: "établissement", plusieurs: "établissements", accord: "" };

// Les pastilles de pays sont des FILTRES, plus des ancres (2026-09-06) —
// même correctif que scholarships.js. `?country=` était déjà lu par
// populateCountryFilter() ; ce qui manquait, c'était un lien pour
// l'écrire. Les autres filtres présents dans l'URL sont conservés :
// aller voir la France ne doit pas perdre la bourse ou le niveau déjà
// choisis.
function urlAvecFiltres({ country = countryFilter.value, level = levelFilter.value, cost = costFilter.value, search = searchInput.value.trim(), tout = toutAfficher } = {}) {

const url = new URL("universities.html", window.location.origin);

if (scholarshipIdFilter) url.searchParams.set("scholarshipId", scholarshipIdFilter);
if (country) url.searchParams.set("country", country);
if (level) url.searchParams.set("level", level);
if (cost) url.searchParams.set("cost", cost);
// La recherche de cette page est vivante (aucun rechargement à la
// frappe) mais elle traverse désormais l'URL : sans ça, cliquer un pays
// après avoir tapé trois lettres effaçait la recherche en silence.
if (search) url.searchParams.set("search", search);
if (tout) url.searchParams.set("all", "1");

return url.pathname.split("/").pop() + url.search;

}

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

// Le niveau dont on affiche le coût : celui du filtre niveau ; sinon le
// niveau le plus bas disponible sur l'université ; sinon, pour une
// université sans programme, le plus bas niveau renseigné dans ses
// frais, et « Licence » en dernier recours.
function niveauCourant(university, levels) {

if (levelFilter.value) return levelFilter.value;

const tries = [...levels].sort((a, b) => LEVEL_ORDER.indexOf(a) - LEVEL_ORDER.indexOf(b));
if (tries[0]) return tries[0];

const frais = university.fraisScolarite || {};
return LEVEL_ORDER.find((niveau) => frais[niveau.toLowerCase()]) || LEVEL_ORDER[0];

}

// Le coût pour le niveau courant, sa bande et la politique
// d'exonération — calculés au même endroit pour le filtre et la carte.
function coutPour(university, levels) {

const niveau = niveauCourant(university, levels);
const frais = lireFrais(university, niveau);

return {
niveau,
frais,
bande: bandeCout(frais.montant, frais.devise),
exoneration: lireExoneration(university)
};

}

// Combine un profil d'université avec ses programmes (niveaux, bourses,
// deadline la plus proche...) — une seule carte par établissement,
// enrichie plutôt que dupliquée.
function buildCardModel(university, programsForUniversity, photoVariant) {

const levels = [...new Set(programsForUniversity.map((p) => p.level).filter(Boolean))]
.sort((a, b) => LEVEL_ORDER.indexOf(a) - LEVEL_ORDER.indexOf(b));

const cout = coutPour(university, levels);

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
photoVariant,
cout
};

}

function applyFilters() {

const search = searchInput.value.trim().toLowerCase();
const country = countryFilter.value;
const level = levelFilter.value;
// Coût : « Tous » (vide) laisse passer TOUT, y compris la bande
// « inconnu » — une université sans prix vérifié reste visible tant
// que l'étudiant ne demande pas explicitement une bande.
const cost = costFilter.value;

// Le PAYS est retiré du filtre principal et appliqué en dernier (plus
// bas) : l'index du bas de page doit lister tous les pays qui restent
// après les AUTRES filtres, sinon il ne proposerait que le pays déjà
// choisi — un index qui ne mène nulle part.

const scope = scholarshipIdFilter
? allUniversities.filter((u) => allPrograms.some((p) => p.universityId === u.firestoreId && p.scholarshipId === scholarshipIdFilter))
: allUniversities;

const filtered = scope.filter((university) => {

const programsForUniversity = allPrograms.filter((p) => p.universityId === university.firestoreId);
const universityLevels = programsForUniversity.map((p) => p.level);

return (
(!level || universityLevels.includes(level)) &&
(!cost || coutPour(university, universityLevels.filter(Boolean)).bande === cost) &&
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

// Toutes les cartes SAUF le filtre pays : la portée de l'index.
const visibles = country ? cards.filter((c) => c.country === country) : cards;

if (visibles.length === 0) {

resultsCount.textContent = "Aucun établissement ne correspond à ces filtres";

countryPills.hidden = true;
countryPills.innerHTML = "";

renderEmptyState();

} else {

const groups = groupByCountry(visibles);
const groupesIndex = groupByCountry(cards);

renderCountryPills(groupesIndex, country);

// La vue a une fin — voir js/catalogue-vue.js. Le tri des pays
// (le mieux fourni d'abord) arrive ici déjà fait et ressort intact.
const vue = decouperVue(groups, { paysFiltre: country, tout: toutAfficher });

resultsCount.textContent = ligneEtendue(vue, NOMS_UNIS, {
pays: groupesIndex.length,
paysFiltre: country
});

vue.groupes.forEach((groupe) => {

const { country: groupCountry, items, ecourte, total } = groupe;

const section = document.createElement("section");
section.className = "catalog-country-group";
section.id = `country-${slugify(groupCountry)}`;

const flagItem = items.find((item) => item.flag);
const flagImg = flagItem ? `<img src="assets/flags/${flagItem.flag}" alt="" width="20" height="15" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='assets/flags/default.svg'">` : "";

section.innerHTML = `
<div class="catalog-country-header">
${flagImg}
<h2>${groupCountry}</h2>
<span>(${total} université${total > 1 ? "s" : ""})</span>
</div>
<div class="uni-grid"></div>
${ecourte ? `<a class="catalog-country-more" href="${urlAvecFiltres({ country: groupCountry, tout: false })}"><span>${libelleVoirTout(groupe, NOMS_UNIS)}</span><i data-lucide="arrow-right"></i></a>` : ""}
`;

const grid = section.querySelector(".uni-grid");
items.forEach((card) => grid.appendChild(renderCard(card)));

container.appendChild(section);

});

renderIndexPays(groupesIndex, vue, country);

}

// Les toutes premières cartes sont au-dessus de la ligne de
// flottaison : les servir en `lazy` retarde la plus grande image
// visible (LCP). Les deux premières photos rendues repassent en
// chargement prioritaire — les suivantes restent différées.
// (2026-08-29, passe de fluidité.)
container.querySelectorAll(".scholarship-card-media img, .uni-card-media img").forEach((img, i) => {
if (i < 2) {
img.loading = "eager";
img.setAttribute("fetchpriority", "high");
}
});

if (window.lucide) lucide.createIcons();

}

function pastillePays({ country: groupCountry, items }, actif) {

const flagItem = items.find((item) => item.flag);
const flagImg = flagItem ? `<img src="assets/flags/${flagItem.flag}" alt="" width="20" height="15" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='assets/flags/default.svg'">` : "";

// `tout: false` : choisir un pays sort du mode « Tout afficher » — on
// vient précisément de demander à voir moins.
const href = urlAvecFiltres({ country: groupCountry, tout: false });

return `<a href="${href}" class="catalog-country-pill${actif ? " is-active" : ""}">${flagImg}<span>${groupCountry}</span><span class="catalog-country-pill-count">${items.length}</span></a>`;

}

function renderCountryPills(groups, activeCountry) {

if (groups.length <= 1) {
countryPills.hidden = true;
countryPills.innerHTML = "";
return;
}

countryPills.hidden = false;

countryPills.innerHTML = groups.map((g) => pastillePays(g, g.country === activeCountry)).join("");

}

// La table des matières — voir la note jumelle dans scholarships.js.
// Rendue DANS le conteneur, vidé à chaque affichage : impossible d'en
// accumuler deux quand la recherche vivante re-rend la page.
function renderIndexPays(groupesIndex, vue, activeCountry) {

if (groupesIndex.length <= 1) return;

const nav = document.createElement("nav");
nav.className = "catalog-country-index";
nav.setAttribute("aria-label", "Tous les pays du catalogue");

nav.innerHTML = (vue.partielle
? `<p class="catalog-country-index-lead">Le catalogue compte ${vue.total} établissement${vue.total > 1 ? "s" : ""} dans ${groupesIndex.length} pays. Choisissez une destination :</p>`
: `<p class="catalog-country-index-lead">Toutes les destinations du catalogue :</p>`)
+ `<div class="catalog-country-index-pills">${groupesIndex.map((g) => pastillePays(g, g.country === activeCountry)).join("")}</div>`
+ (toutAfficher
? `<a class="catalog-tout-afficher" href="${urlAvecFiltres({ country: "", tout: false })}">Revenir à la vue par pays</a>`
: `<a class="catalog-tout-afficher" href="${urlAvecFiltres({ country: "", tout: true })}">Tout afficher (${vue.total} établissement${vue.total > 1 ? "s" : ""} d'un coup)</a>`);

container.appendChild(nav);

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

const catalogue = await chargerCatalogue();

// Cette page nomme l'identifiant `firestoreId` : le chargeur renvoie
// `id`, on renomme ici plutôt que d'imposer une convention au reste.
const renommer = ({ id, ...reste }) => ({ firestoreId: id, ...reste });

allUniversities = catalogue.universites.map(renommer);
allPrograms = catalogue.programmes.map(renommer);
allScholarshipsById = new Map(catalogue.bourses.map((s) => [s.id, renommer(s)]));

if (scholarshipIdFilter) {

const scholarship = allScholarshipsById.get(scholarshipIdFilter);

scholarshipContext.hidden = false;
scholarshipContextName.textContent = scholarship ? scholarship.title : "Bourse";

if (heroTitle) heroTitle.textContent = "Les universités du catalogue";
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

searchInput.addEventListener("input", () => {
searchClearBtn.hidden = !searchInput.value;
applyFilters();
});

searchClearBtn.addEventListener("click", () => {
searchInput.value = "";
searchClearBtn.hidden = true;
applyFilters();
searchInput.focus();
});

countryFilter.addEventListener("change", applyFilters);
levelFilter.addEventListener("change", applyFilters);
costFilter.addEventListener("change", applyFilters);

resetBtn.addEventListener("click", () => {

// Tout filtre porté par l'URL (bourse, pays, niveau, recherche,
// « tout afficher ») ne peut se réinitialiser qu'en RECHARGEANT :
// remettre les contrôles à zéro sur place laissait `?country=Italie`
// dans la barre d'adresse, et le moindre rechargement — ou un partage
// du lien — ramenait le filtre qu'on venait de retirer.
if (window.location.search) {
window.location.href = "universities.html";
return;
}

searchInput.value = "";
searchClearBtn.hidden = true;
countryFilter.value = "";
levelFilter.value = "";
costFilter.value = "";
applyFilters();

});

chargerUniversites();

if (window.lucide) lucide.createIcons();
