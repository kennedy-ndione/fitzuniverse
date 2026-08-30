import { db, auth } from "./firebase-config.js";

import {
collection,
getDocs,
doc,
getDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import { estEligible, paysAvecArticle } from "./js/eligibility-countries.js";

import { COUNTRY_NAMES } from "./js/countries.js";

import {
estFinancementIntegral,
meilleurRangQS
} from "./js/scholarship-filters.js";

import { resolveScholarshipImage } from "./js/scholarship-image.js";

// Signale à js/catalog-watchdog.js que ce module a bien démarré.
// À GARDER COMME PREMIÈRE INSTRUCTION EXÉCUTABLE du fichier, et à ne
// jamais déplacer dans une fonction : tout ce qui suit les imports ne
// s'exécute que si les quatre fichiers du SDK Firebase ont pu être
// téléchargés depuis www.gstatic.com. Quand l'un d'eux échoue (réseau
// coupé, délai dépassé, CDN bloqué), le navigateur n'exécute PAS ce
// module — donc ni le squelette de chargement, ni le bloc "Chargement
// interrompu" du try/catch plus bas ne s'affichent, et l'étudiant se
// retrouve devant une grille vide sans la moindre explication.
// Ce drapeau permet au filet de sécurité de distinguer "le module n'a
// jamais démarré" (il parle) de "le module tourne et gère lui-même ses
// erreurs, ou n'a légitimement rien à afficher" (il se tait).
// Voir js/catalog-watchdog.js pour le raisonnement complet.
window.__catalogueDemarre = true;

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

function slugify(str) {

return (str || "")
.normalize("NFD")
.replace(/[̀-ͯ]/g, "")
.toLowerCase()
.replace(/[^a-z0-9]+/g, "-")
.replace(/^-+|-+$/g, "");

}

const params = new URLSearchParams(window.location.search);

const recherche = params.get("search") || "";
const niveau = params.get("level") || "";
const paysFiltre = params.get("country") || "";

// Alimentés par le quiz d'accueil (index.html, #pathQuiz) — de simples
// liens <a href="scholarships.html?funding=full">, aucun JS partagé
// entre les deux pages. "funding=full" et "maxRank=<entier>" sont des
// filtres à part entière, pas un vocabulaire propre au quiz : rien
// n'empêche d'y accrocher plus tard un contrôle dans cette page elle-
// même, exactement comme countryFilter/levelFilter aujourd'hui.
const financementIntegralFiltre = params.get("funding") === "full";
const rangMaxParam = parseInt(params.get("maxRank"), 10);
const rangMaxFiltre = Number.isFinite(rangMaxParam) ? rangMaxParam : null;

const container = document.getElementById("scholarship-list");
const searchInput = document.getElementById("searchInput");
const searchClearBtn = document.getElementById("searchClearBtn");
const countryFilter = document.getElementById("countryFilter");
const levelFilter = document.getElementById("levelFilter");
const resultsCount = document.getElementById("resultsCount");
const clearFiltersLink = document.getElementById("clearFiltersLink");
const countryPills = document.getElementById("countryPills");
const nationalityCheck = document.getElementById("nationalityFilterCheck");
const nationalityInput = document.getElementById("nationalityFilterInput");
const nationalityDatalist = document.getElementById("nationalityDatalist");

// ============================
// Éligibilité par nationalité (2026-08-30).
//
// estEligible() a TROIS valeurs de retour : false (exclu), true
// (éligible), null (on ne sait pas — restriction absente, nationalité
// vide, pays inconnu du référentiel). Tous les tests ci-dessous
// comparent STRICTEMENT à false : traiter null comme false cacherait
// des bourses à tort, le seul bug réellement grave de cette
// fonctionnalité (voir test/eligibility-countries.test.mjs).
//
// La valeur saisie survit d'une visite à l'autre (localStorage) et le
// profil Firestore la remplace dès que la session est connue — le
// profil est la donnée la plus fiable.
// ============================

let nationaliteCourante = "";
try { nationaliteCourante = localStorage.getItem("fitzNationalite") || ""; } catch { /* stockage bloqué */ }

if (nationalityInput) {
nationalityInput.value = nationaliteCourante;
if (nationalityDatalist) {
nationalityDatalist.innerHTML = COUNTRY_NAMES.map((n) => `<option value="${n}"></option>`).join("");
}
}

// Pré-remplissage depuis le profil Firestore quand l'étudiant est
// connecté. Arrive après le rendu initial : on re-filtre si besoin.
onAuthStateChanged(auth, async (user) => {
if (!user || !nationalityInput) return;
try {
const snap = await getDoc(doc(db, "users", user.uid));
const natio = snap.exists() && snap.data().profile && snap.data().profile.nationality;
if (natio) {
nationaliteCourante = natio;
nationalityInput.value = natio;
try { localStorage.setItem("fitzNationalite", natio); } catch { /* stockage bloqué */ }
if (allScholarships.length) applyFilters();
}
} catch { /* hors ligne ou règles : le champ garde la valeur locale */ }
});

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
function enrichWithProgramData(scholarship, programs, universitiesById, flagByCountry) {

const linkedPrograms = programs.filter((p) => p.scholarshipId === scholarship.id);

const linkedUniversities = linkedPrograms
.map((p) => universitiesById.get(p.universityId))
.filter(Boolean);

const countries = [...new Set(
linkedUniversities.map((u) => u.country).filter(Boolean).concat(scholarship.country ? [scholarship.country] : [])
)];

const withImage = linkedUniversities.find((u) => u.image);

// Même résolution que la photo ci-dessus (première université liée qui
// porte le champ) en priorité — reste la plus précise, propre à cette
// bourse. Repli sur flagByCountry (voir chargerBourses) si la bourse n'a
// aucun programme lié (stub, ex. Mastercard Foundation UM6P) ou si son
// université liée n'a pas de flag : toujours pas de table de
// correspondance pays -> code ISO écrite à la main, juste un 2e passage
// sur les universités déjà chargées, cette fois sans filtrer par lien.
const withFlag = linkedUniversities.find((u) => u.flag);
const flag = withFlag ? withFlag.flag : (flagByCountry.get(scholarship.country) || null);

const { image, imageSrcset } = resolveScholarshipImage({
pays: scholarship.country,
texteHash: scholarship.title || scholarship.id,
universiteImage: withImage ? withImage.image : null,
bourseImage: scholarship.image || null
});

// Voir js/scholarship-filters.js : le meilleur (plus petit) rang QS
// parmi les universités liées, ou null si aucune n'en a un. Choisi de
// la même façon que la photo et le drapeau juste au-dessus — une
// bourse est aussi bien classée que sa meilleure porte d'entrée.
const bestRanking = meilleurRangQS(linkedUniversities);

// COMPTAGE dédoublonné par université (2026-08-30) : la base modélise
// UN programme par couple (université, niveau), donc linkedUniversities
// contient la même université une fois par niveau — .length comptait
// des programmes ("41 universités partenaires" pour les 15 réelles de
// chinese-government-scholarship, "33" pour les 11 de
// stipendium-hungaricum). linkedUniversities reste NON dédoublonné plus
// haut : photo, drapeau et meilleurRangQS s'en accommodent (un doublon
// n'y change rien), seul le comptage affiché exigeait le Set.
const partnerCount = new Set(
linkedPrograms.map((p) => p.universityId).filter((id) => universitiesById.has(id))
).size;

return { ...scholarship, countries, image, imageSrcset, flag, partnerCount, bestRanking };

}

// Description de la carte.
//
// Réécrite le 2026-08-22. L'ancienne version fabriquait TOUJOURS une
// phrase à partir des champs pays/financement/niveaux quand la bourse
// n'avait pas de description propre :
//
//   "Bourse d'État accordée par le gouvernement de Hongrie financée à
//    100 %, ouverte du niveau Licence, Master."
//
// Or le pays est déjà l'en-tête du groupe qui surplombe la carte, le
// financement est la puce ambrée, et les niveaux sont les puces
// suivantes. Cette phrase répétait donc mot pour mot les trois
// informations affichées à 30 px en dessous — trois lignes de texte
// identiques d'une carte à l'autre, qui poussaient le vrai contenu
// vers le bas et faisaient se ressembler toutes les bourses.
//
// Ne reste que la description RÉELLE, celle saisie en base par
// l'administrateur. Elle est rare aujourd'hui, mais c'est la seule
// qui apprenne quelque chose ; le jour où elle est écrite, elle
// mérite sa place. Sans elle, la carte n'affiche simplement pas de
// paragraphe : mieux vaut une carte courte qu'une carte remplie de
// texte qui ne dit rien.
function buildDescription(scholarship) {

return scholarship.description || "";

}

let allScholarships = [];

// Conservé au niveau du module : renderHeroStats() en a besoin pour
// compter les universités DISTINCTES reliées à une bourse, et
// `programs` était jusqu'ici une variable locale à chargerBourses().
let programmesCharges = [];

async function chargerBourses() {

renderSkeleton();

try {

const [scholarshipsSnap, programsSnap, universitiesSnap] = await Promise.all([
getDocs(collection(db, "scholarships")),
getDocs(collection(db, "programs")),
getDocs(collection(db, "universities"))
]);

const programs = programsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
programmesCharges = programs;
const universitiesById = new Map(universitiesSnap.docs.map((d) => [d.id, { id: d.id, ...d.data() }]));

// Repli drapeau par pays (voir enrichWithProgramData) : première
// université de tout le catalogue — pas seulement celles liées à cette
// bourse précise — qui porte ce pays et un flag. Construit une seule
// fois ici plutôt qu'à chaque bourse.
const flagByCountry = new Map();
for (const university of universitiesById.values()) {
if (university.country && university.flag && !flagByCountry.has(university.country)) {
flagByCountry.set(university.country, university.flag);
}
}

allScholarships = scholarshipsSnap.docs
.map((d) => ({ id: d.id, ...d.data() }))
.map((s) => enrichWithProgramData(s, programs, universitiesById, flagByCountry));

renderHeroStats(universitiesById);
populateCountryFilter();
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

// Chiffres de la bannière — calculés sur les données RÉELLEMENT
// chargées, jamais écrits en dur : un catalogue qui annonce
// "50 bourses" et en affiche 31 perd la confiance qu'il vient
// justement de demander.
//
// Les trois valeurs comptent des choses volontairement différentes :
//   - bourses      : le nombre de documents du catalogue ;
//   - pays d'accueil : les pays QUI ACCORDENT une bourse (le champ
//     `country` de la bourse), pas les pays éligibles ;
//   - universités partenaires : le nombre d'établissements DISTINCTS
//     reliés à au moins une bourse. Compter les `partnerCount` de
//     chaque bourse aurait compté deux fois toute université reliée
//     à deux bourses, et gonflé le chiffre — exactement l'erreur que
//     ce bloc doit éviter.
//
// Si un des éléments manque (page modifiée), on sort sans rien
// casser : le tiret cadratin du HTML reste affiché.
function renderHeroStats(universitiesById) {

const elBourses = document.getElementById("statScholarships");
const elPays = document.getElementById("statCountries");
const elPartenaires = document.getElementById("statPartners");

if (!elBourses || !elPays || !elPartenaires) return;

const pays = new Set(allScholarships.map((s) => s.country).filter(Boolean));

const universitesLiees = new Set();
for (const programme of programmesCharges) {
if (programme.scholarshipId && programme.universityId && universitiesById.has(programme.universityId)) {
universitesLiees.add(programme.universityId);
}
}

elBourses.textContent = allScholarships.length;
elPays.textContent = pays.size;
elPartenaires.textContent = universitesLiees.size;

}

function populateCountryFilter() {

const countries = [...new Set(allScholarships.map((s) => s.country).filter(Boolean))].sort((a, b) => a.localeCompare(b));

countries.forEach((country) => {
countryFilter.add(new Option(country, country));
});

if (paysFiltre && countries.includes(paysFiltre)) {
countryFilter.value = paysFiltre;
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

if (paysFiltre) {
scholarships = scholarships.filter((scholarship) => scholarship.country === paysFiltre);
}

if (niveau) {
scholarships = scholarships.filter((scholarship) => (scholarship.levels || []).includes(niveau));
}

if (financementIntegralFiltre) {
scholarships = scholarships.filter((scholarship) => estFinancementIntegral(scholarship.funding));
}

if (rangMaxFiltre !== null) {
scholarships = scholarships.filter((scholarship) => scholarship.bestRanking !== null && scholarship.bestRanking <= rangMaxFiltre);
}

// « Ouvertes à ma nationalité » : ne retire QUE les bourses dont la
// restriction officielle exclut cette nationalité. `!== false` est le
// cœur de la règle — null (pas de restriction connue, nationalité
// vide, pays non résolu) reste affiché.
if (nationalityCheck && nationalityCheck.checked) {
scholarships = scholarships.filter((scholarship) => estEligible(scholarship.eligibility, nationaliteCourante) !== false);
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

const srcsetAttr = scholarship.imageSrcset
? ` srcset="${scholarship.imageSrcset}" sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 380px"`
: "";

// Repli sur l'icône globe si aucune université liée ne porte de champ
// flag (en théorie jamais atteint, chaque bourse du catalogue a au
// moins un programme lié) — jamais d'image cassée.
const countryIconHtml = scholarship.flag
? `<img src="assets/flags/${scholarship.flag}" alt="" width="20" height="15" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='assets/flags/default.svg'">`
: `<i data-lucide="globe"></i>`;

// Nombre d'universités partenaires. Il était calculé depuis toujours
// par enrichWithProgramData() et n'était affiché NULLE PART — alors
// que c'est la réponse à "est-ce que cette bourse ouvre sur beaucoup
// de portes ?", et exactement ce que le clic va montrer.
// Au singulier/pluriel, et tu de la carte quand il vaut 0 (bourse
// encore sans programme lié) plutôt qu'afficher "0 université".
const partners = scholarship.partnerCount || 0;

// Uniquement une description saisie en base (voir buildDescription) :
// la phrase générée automatiquement qui vivait ici répétait le pays,
// le financement et les niveaux affichés juste en dessous.
const description = buildDescription(scholarship);

const partnersHtml = partners > 0
? `<p class="scholarship-card-partners">
<i data-lucide="landmark"></i>
<span><strong>${partners}</strong> université${partners > 1 ? "s" : ""} partenaire${partners > 1 ? "s" : ""}</span>
</p>`
: "";

// La ligne pays (drapeau + nom du pays) a été retirée le 2026-08-22 :
// l'en-tête du groupe qui surplombe la carte annonce déjà ce pays,
// drapeau compris, à 40 px au-dessus. countryIconHtml reste calculé
// plus haut car renderCountryPills() et l'en-tête de groupe s'en
// servent — c'est bien la ligne DANS la carte qui faisait doublon,
// pas le drapeau lui-même.
//
// La description générée par buildDescription() est retirée pour la
// même raison : "Bourse d'État accordée par le gouvernement de X
// financée à 100 %, ouverte du niveau Licence, Master" répétait mot
// pour mot le pays du groupe, la puce de financement et les puces de
// niveau affichées juste en dessous. Trois lignes identiques sur
// toutes les cartes, pour zéro information nouvelle.
card.innerHTML = `
<div class="scholarship-card-media">
<img src="${scholarship.image}"${srcsetAttr} width="800" height="533" alt="" loading="lazy" decoding="async">
<span class="scholarship-card-status ${isOpen ? "is-open" : ""}">${isOpen ? "Candidatures ouvertes" : "Candidatures fermées"}</span>
</div>

<div class="scholarship-card-body">

<h3>${scholarship.title || "Bourse d'études"}</h3>

${estEligible(scholarship.eligibility, nationaliteCourante) === false ? `<p class="scholarship-card-inel">Non ouverte aux ressortissants ${paysAvecArticle(nationaliteCourante)}</p>` : ""}

${description ? `<p class="scholarship-card-desc">${description}</p>` : ""}

${partnersHtml}

<div class="scholarship-card-meta">
${scholarship.funding ? `<span class="scholarship-card-chip is-funding"><i data-lucide="coins"></i>${scholarship.funding} financé</span>` : ""}
${levelChips}
</div>

${showCountriesRow ? `<div class="scholarship-card-countries"><strong>Aussi éligible depuis :</strong><span>${scholarship.countries.filter((c) => c !== scholarship.country).join(", ")}</span></div>` : ""}

<button type="button" class="scholarship-card-cta details-btn">
<span>Voir les universités partenaires</span>
<i data-lucide="arrow-right"></i>
</button>

</div>
`;

// Toute la carte est cliquable, pas seulement le bouton : sur une
// grille de vignettes, viser un lien de 200 px de large au milieu
// d'une cible de 340 px n'a aucun sens. Le bouton reste dans le DOM
// pour le clavier et les lecteurs d'écran (c'est lui qui porte le
// libellé de l'action), et .scholarship-card:focus-within porte le
// contour de focus pour que la cible visible corresponde à la cible
// réelle.
card.style.cursor = "pointer";

function ouvrirPartenaires() {
window.location.href = `universities.html?scholarshipId=${encodeURIComponent(scholarship.id)}`;
}

// Le clic sur le bouton remonte jusqu'à la carte : sans ce stopPropagation
// le gestionnaire s'exécuterait deux fois. Inoffensif ici (deux fois la
// même navigation) mais ce serait un vrai bogue le jour où l'action
// devient autre chose qu'un window.location.
card.querySelector(".details-btn").addEventListener("click", (event) => {
event.stopPropagation();
ouvrirPartenaires();
});

card.addEventListener("click", ouvrirPartenaires);

return card;

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

function renderCountryPills(groups) {

if (groups.length <= 1) {
countryPills.hidden = true;
countryPills.innerHTML = "";
return;
}

countryPills.hidden = false;

countryPills.innerHTML = groups.map(({ country, items }) => {

const flag = items.find((item) => item.flag) || {};
const slug = slugify(country);
const flagImg = flag.flag ? `<img src="assets/flags/${flag.flag}" alt="" width="20" height="15" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='assets/flags/default.svg'">` : "";

return `<a href="#country-${slug}" class="catalog-country-pill${country === paysFiltre ? " is-active" : ""}">${flagImg}<span>${country}</span><span class="catalog-country-pill-count">${items.length}</span></a>`;

}).join("");

}

function afficherBourses(scholarships) {

container.innerHTML = "";

resultsCount.textContent = `${scholarships.length} bourse${scholarships.length > 1 ? "s" : ""} trouvée${scholarships.length > 1 ? "s" : ""}`;
clearFiltersLink.hidden = !(recherche || niveau || paysFiltre || financementIntegralFiltre || rangMaxFiltre !== null || (nationalityCheck && nationalityCheck.checked));

if (scholarships.length === 0) {

countryPills.hidden = true;
countryPills.innerHTML = "";

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

const groups = groupByCountry(scholarships);

renderCountryPills(groups);

groups.forEach(({ country, items }) => {

const section = document.createElement("section");
section.className = "catalog-country-group";
section.id = `country-${slugify(country)}`;

const flag = items.find((item) => item.flag) || {};
const flagImg = flag.flag ? `<img src="assets/flags/${flag.flag}" alt="" width="20" height="15" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='assets/flags/default.svg'">` : "";

section.innerHTML = `
<div class="catalog-country-header">
${flagImg}
<h2>${country}</h2>
<span>(${items.length} bourse${items.length > 1 ? "s" : ""})</span>
</div>
<div class="bourses-grid"></div>
`;

const grid = section.querySelector(".bourses-grid");
items.forEach((scholarship) => grid.appendChild(renderCard(scholarship)));

container.appendChild(section);

});


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

// ============================
// Barre de recherche (reconstruit l'URL à partir de l'état courant des
// 5 filtres — recherche, pays, niveau, financement intégral, rang QS
// maximum — pour que changer l'un ne perde jamais les autres, cf.
// audit du 2026-08-16).
//
// funding/maxRank ne sont jamais TOUCHÉS par les contrôles de recherche
// existants (aucun n'y touche) — seulement PORTÉS d'une navigation à
// l'autre : un visiteur arrivé du quiz d'accueil (funding=full) qui
// tape un mot dans la recherche ne doit pas perdre silencieusement le
// filtre qu'il avait choisi en arrivant.
// ============================

function navigateWithFilters({ search, country, level, funding = financementIntegralFiltre, maxRank = rangMaxFiltre }) {

const url = new URL("scholarships.html", window.location.origin);

if (search) url.searchParams.set("search", search);
if (country) url.searchParams.set("country", country);
if (level) url.searchParams.set("level", level);
if (funding) url.searchParams.set("funding", "full");
if (maxRank !== null && maxRank !== undefined) url.searchParams.set("maxRank", String(maxRank));

window.location.href = url.toString();

}

if (searchInput) {

searchInput.value = recherche;

searchClearBtn.hidden = !recherche;

searchInput.addEventListener("input", () => {
searchClearBtn.hidden = !searchInput.value;
});

searchInput.addEventListener("keydown", function (event) {

if (event.key === "Enter") {

navigateWithFilters({
search: searchInput.value.trim(),
country: countryFilter ? countryFilter.value : "",
level: levelFilter ? levelFilter.value : ""
});

}

});

}

if (searchClearBtn) {

searchClearBtn.addEventListener("click", () => {

navigateWithFilters({
search: "",
country: countryFilter ? countryFilter.value : "",
level: levelFilter ? levelFilter.value : ""
});

});

}

// ============================
// Filtre pays
// ============================

if (countryFilter) {

countryFilter.addEventListener("change", function () {

navigateWithFilters({
search: recherche,
country: this.value,
level: niveau
});

});

}

// ============================
// Filtre niveau
// ============================

if (levelFilter) {

levelFilter.value = niveau;

levelFilter.addEventListener("change", function () {

navigateWithFilters({
search: recherche,
country: paysFiltre,
level: this.value
});

});

}

// ============================
// Filtre « Ouvertes à ma nationalité » — vivant, sans rechargement :
// contrairement aux filtres d'URL ci-dessus, la nationalité se tape au
// clavier ; renaviguer à chaque frappe serait inutilisable. Le lien
// #clearFiltersLink (href="scholarships.html") recharge la page, donc
// décoche la case comme il efface les autres filtres.
//
// La mention « Non ouverte aux ressortissants… » des cartes est rendue
// dès que la nationalité est connue, case cochée OU NON : on informe
// toujours, on ne retire qu'à la demande.
// ============================

if (nationalityCheck) {

nationalityCheck.addEventListener("change", () => {
if (allScholarships.length) applyFilters();
});

}

if (nationalityInput) {

nationalityInput.addEventListener("input", () => {
nationaliteCourante = nationalityInput.value.trim();
try { localStorage.setItem("fitzNationalite", nationaliteCourante); } catch { /* stockage bloqué */ }
if (allScholarships.length) applyFilters();
});

}

chargerBourses();
