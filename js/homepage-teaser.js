import { TESTIMONIALS } from "./testimonials-data.js";

// Entrée du site pour le Control Center (2026-09-02) : une visite par
// session de navigateur, signalée depuis la page d'accueil — le point
// d'entrée public principal (l'espace connecté a la sienne via
// js/app-shell.js, même garde sessionStorage, jamais de doublon).
import { trackVisitOnce } from "./analytics.js";

// Chargeur de catalogue partagé et mémoïsé — voir js/catalog-data.js.
import { chargerCatalogue } from "./catalog-data.js";

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

// Sélection éditoriale plutôt qu'un tirage arbitraire : l'ordre de
// retour Firestore plaçait souvent 2 villes chinoises côte à côte (peu
// de diversité perçue) pour la toute première impression du site.
// Retombe sur pickDiverse() si l'un de ces identifiants disparaît un
// jour (désinscription d'université, etc.).
//
// REVUE DU 2026-09-01 — la sélection datait du 2026-08-11, quand le
// catalogue comptait bien moins d'établissements. Avec 122 universités
// dans 28 pays, le critère devient la NOTORIÉTÉ MONDIALE : cette
// section s'intitule « un échantillon de ce qui vous attend », et
// quatre noms que l'étudiant reconnaît immédiatement disent mieux la
// solidité du catalogue que quatre noms choisis pour leurs couleurs.
//
// Sortent : Sciences Po (excellente en science politique, mais au-delà
// de #350 au classement général) et Toronto (#29, remplaçable par plus
// haut). Entrent : Stanford et Tsinghua.
//
// Les quatre couvrent quatre pays et trois continents, et chacun a une
// photo distincte au catalogue — contrainte du tirage : `withPhoto`.
const FEATURED_UNIVERSITY_IDS = [
"university-of-oxford-oxford",   // Royaume-Uni — top 5 mondial
"stanford-university-stanford",  // États-Unis  — top 5 mondial
"eth-zurich-zurich",             // Suisse      — top 10 mondial
"tsinghua-university-pekin"      // Chine       — top 20 mondial
];

// Un même établissement existe en 3 documents Firestore (un par niveau
// Licence/Master/Doctorat) — sans ce regroupement, le tirage pourrait
// afficher le même établissement (et la même photo) plusieurs fois.
function dedupeByUniversity(list) {

const seen = new Set();
const result = [];

list.forEach((entry) => {

const key = `${entry.name || ""}|${entry.city || ""}`;

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
// (max-width:599px) 80vw et non 100vw : en dessous de 600px, les
// cartes sont un carrousel horizontal (voir css/homepage-sections.css,
// correctif "carrousel mobile") où chaque carte ne prend que 80 % de
// l'écran, plafonné à 300px — jamais toute la largeur. Le bento
// (colonne 2 / bannière 4) ne s'applique qu'à partir de 1024px, donc
// les 3 tailles de slot ne divergent qu'à partir de ce palier.
function sizesForSlot(index) {

if (index === 0) return "(max-width:599px) 80vw, (max-width:1023px) 50vw, 570px";
if (index === 3) return "(max-width:599px) 80vw, (max-width:1023px) 50vw, 1160px";

return "(max-width:599px) 80vw, (max-width:1023px) 50vw, 275px";

}

function renderCard(university, scholarshipTitle, index) {

const card = document.createElement("a");
card.className = "teaser-card";
card.href = "universities.html";

const image = university.image || "default.jpg";
const base = image.replace(/\.jpe?g$/i, "");

// Variantes générées par scripts/generate-city-srcset.mjs à partir des
// photos ~2000px d'origine. La 1re carte (index 0) est la seule à
// charger avant le scroll : elle seule reçoit fetchpriority/eager.
//
// 1600w AJOUTÉ le 2026-08-22. La liste s'arrêtait à 1200w alors que la
// variante 1600w existe pour TOUTES les villes du dossier. Or la 4e
// carte occupe toute la largeur de la grille (grid-column:1/-1) et son
// `sizes` annonce 1160px : sur un écran à densité 2 — la majorité des
// portables aujourd'hui — le navigateur avait besoin de 2320px réels et
// n'avait rien de mieux que 1200. La bannière la plus grande de la page
// d'accueil était donc agrandie d'un facteur 2. C'est ce qui la faisait
// paraître molle, pas la photo elle-même.
const srcset = [400, 800, 1200, 1600].map((w) => `assets/images/cities/${base}-${w}w.jpg ${w}w`).join(", ");

// university.name (pas .university, champ inexistant sur le document —
// voir universities-page.js qui lit le même champ) : sans ce correctif
// chaque carte retombait sur le libellé de repli au lieu du vrai nom.
// Ce repli ne dit plus « partenaire » (doctrine de rédaction, gardée par
// test/copy-partenaire.test.mjs) : les universités du catalogue ne sont
// pas des partenaires de FitzUniverse.
card.innerHTML = `
<div class="teaser-card-media">
<img src="assets/images/cities/${base}-800w.jpg" srcset="${srcset}" sizes="${sizesForSlot(index)}" alt="${university.city || university.name || ""}" ${index === 0 ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'}>
${university.ranking ? `<span class="teaser-card-rank"><i data-lucide="trophy"></i>${university.ranking}</span>` : ""}
</div>
<div class="teaser-card-body">
${university.flag ? `<img class="teaser-card-flag" src="assets/flags/${university.flag}" alt="" onerror="this.onerror=null;this.src='assets/flags/default.svg'">` : ""}
<h3>${university.name || "Université"}</h3>
<p>${[university.city, university.country].filter(Boolean).join(", ")}</p>
${scholarshipTitle ? `<span class="teaser-card-tag"><i data-lucide="award"></i>${scholarshipTitle}</span>` : ""}
</div>
`;

return card;

}

// ==========================================================
// SECTION CONFIANCE (bandeau "Des établissements réels, vérifiés un par un")
// Réutilise le fetch Firestore de loadTeaser() ci-dessous plutôt qu'un
// second aller-retour réseau : mêmes universités/bourses, juste agrégées
// différemment (logos + compteurs au lieu de 4 cartes).
// ==========================================================

function renderTrustLogos(universities) {

const track = document.getElementById("trustMarqueeTrack");

if (!track) return;

const names = dedupeByUniversity(universities)
.map((u) => u.name)
.filter(Boolean)
.sort((a, b) => a.localeCompare(b, "fr"));

if (!names.length) {
document.getElementById("trustLogosRow")?.remove();
return;
}

// Nom seul, sans vignette ni code pays : la version "vignette" essayée
// le 2026-08-22 (bloc encadré + code pays + pays) a été écartée au
// rendu — elle alourdissait le bandeau et le faisait ressembler à une
// grille de cartes plutôt qu'à une frise. L'identité visuelle demandée
// passe uniquement par la couleur, voir .trust-logo dans
// css/homepage-sections.css.
const itemsHtml = names.map((name) => `<span class="trust-logo">${name}</span>`).join("");

// 2 copies identiques pour un défilement CSS sans coupure (voir
// @keyframes trust-marquee-scroll, css/homepage-sections.css : la piste
// glisse de -50%, donc la 2e moitié doit être une répétition exacte de
// la 1re). La 2e est aria-hidden pour ne pas doubler la liste au
// lecteur d'écran, qui lit déjà la 1re normalement.
track.innerHTML = `
<div class="trust-marquee-set">${itemsHtml}</div>
<div class="trust-marquee-set" aria-hidden="true">${itemsHtml}</div>
`;

}

// ==========================================================
// COMPTEUR ANIMÉ AU SCROLL (2026-09-01, demande utilisateur)
// L'ancien compteur data-count-to de main.js comptait vers des valeurs
// écrites EN DUR dans le HTML et avait été débranché : déclenché à
// l'entrée dans le viewport, il partait souvent avant la fin du fetch
// Firestore et animait un chiffre faux ou vide. Ici l'ordre est
// inversé et la course disparaît : on n'observe l'élément QU'UNE FOIS
// la vraie valeur connue — l'animation part donc toujours du bon
// chiffre, immédiatement si l'élément est déjà à l'écran, sinon à son
// entrée dans le viewport. Durée et easing repris de l'ancien système
// (1400 ms, easeOutCubic) : même langage d'animation que le reste de
// la page. prefers-reduced-motion : pas d'animation, valeur posée
// directement — même politique que animations.css.
// ==========================================================

const REDUCED_MOTION = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

function animateCountTo(el, target) {

const duration = 1400;
const start = performance.now();

// Filet (clôture, 2026-09-07) : requestAnimationFrame ne tourne pas dans
// un onglet en arrière-plan ni dans un cadre qui ne compose jamais — la
// première image, « 0 », resterait alors affichée. Quoi qu'il arrive,
// la valeur finale est posée à la fin de la durée prévue : le pire cas
// redevient « le nombre ne s'anime pas », jamais « le nombre dit zéro ».
const filet = setTimeout(() => { el.textContent = `${target}`; }, duration + 200);

function step(now) {
const progress = Math.min((now - start) / duration, 1);
const eased = 1 - Math.pow(1 - progress, 3);
el.textContent = `${Math.round(eased * target)}`;
if (progress < 1) requestAnimationFrame(step);
else clearTimeout(filet);
}

// Pas d'animation du tout hors écran : on garde la valeur déjà écrite.
if (document.visibilityState !== "visible") return;

requestAnimationFrame(step);

}

function setCount(el, value) {

if (!el) return;

// LA VRAIE VALEUR D'ABORD, TOUJOURS (clôture du chantier préinscription,
// 2026-09-07). Avant : « 0 » posé ici, et la vraie valeur seulement
// quand l'IntersectionObserver déclenchait — constaté en ligne, dans un
// navigateur réel : les trois compteurs du hero restaient à « 0 » alors
// que universities.html, qui écrit sa valeur directement dans
// textContent, affichait 155 et 30 dans le même navigateur. Le premier
// chiffre que lit un visiteur ne peut pas être « 0 Bourses référencées ».
// Même motif que universities-page.js désormais : la valeur est écrite,
// point ; l'animation de comptage est une amélioration par-dessus, et
// son pire cas est « le nombre ne s'anime pas », jamais « le nombre dit
// zéro ». Aucun « + » ajouté ici ni dans le HTML (piège « 40++ »).
el.textContent = `${value}`;

if (REDUCED_MOTION || !("IntersectionObserver" in window)) return;

const observer = new IntersectionObserver((entries) => {
entries.forEach((entry) => {
if (!entry.isIntersecting) return;
observer.unobserve(entry.target);
animateCountTo(entry.target, value);
});
}, { threshold: 0.4 });

observer.observe(el);

}

// Alimente aussi les 2 chiffres du hero (Bourses référencées / Pays de
// destination) — anciennement "500+"/"30+" codés en dur dans
// index.html, en contradiction avec les vrais chiffres affichés plus
// bas par cette même fonction (audit du 2026-08-13). Mêmes données,
// pas de 2e fetch : simplement 2 cibles DOM de plus.
function renderTrustStats(universities, scholarshipCount) {

// trustCountryCount / trustScholarshipCount ont disparu de l'accueil le
// 2026-09-01 : la section « catalogue » n'affiche plus qu'un compteur,
// celui des universités, le hero portant déjà les trois. Les deux
// recherches sont CONSERVÉES — elles renvoient null sans rien casser, et
// elles évitent de casser toute page qui reprendrait ce bloc à trois.
const universityCountEl = document.getElementById("trustUniversityCount");
const countryCountEl = document.getElementById("trustCountryCount");
const scholarshipCountEl = document.getElementById("trustScholarshipCount");
const heroScholarshipCountEl = document.getElementById("heroScholarshipCount");
const heroCountryCountEl = document.getElementById("heroCountryCount");
const heroUniversityCountEl = document.getElementById("heroUniversityCount");

if (!universityCountEl && !countryCountEl && !scholarshipCountEl && !heroScholarshipCountEl && !heroCountryCountEl && !heroUniversityCountEl) return;

const deduped = dedupeByUniversity(universities);
const countryCount = new Set(deduped.map((u) => u.country).filter(Boolean)).size;

if (!deduped.length) {
document.getElementById("trustStats")?.remove();
return;
}

// SUFFIXE « + » RETIRÉ le 2026-09-01. Le catalogue compte EXACTEMENT
// ces nombres — ils sont comptés sur les documents réellement chargés,
// pas estimés. « 122+ » laissait entendre davantage, et c'est le seul
// endroit du site où un chiffre en promettait plus qu'il n'en tenait.
// Un catalogue qui se vend sur la vérification à la main ne gagne rien
// à arrondir vers le haut.
setCount(universityCountEl, deduped.length);
setCount(countryCountEl, countryCount);
setCount(scholarshipCountEl, scholarshipCount);
setCount(heroScholarshipCountEl, scholarshipCount);
setCount(heroCountryCountEl, countryCount);
setCount(heroUniversityCountEl, deduped.length);

}

// ==========================================================
// TÉMOIGNAGES
// Source statique locale (js/testimonials-data.js), pas Firestore : ce
// sont des citations qui n'existeront qu'après validation humaine
// explicite de l'étudiant·e, pas un contenu qui doit pouvoir apparaître
// via une écriture Firestore quelconque. Indépendant du fetch de
// loadTeaser() ci-dessous — n'a pas besoin des données université.
// ==========================================================

function initials(firstName) {
return (firstName || "?").trim().charAt(0).toUpperCase();
}

function renderTestimonialCard(testimonial) {

const card = document.createElement("article");
card.className = "info-card testimonial-card";

const meta = [testimonial.country, testimonial.university].filter(Boolean).join(" · ");

card.innerHTML = `
<div class="testimonial-avatar" aria-hidden="true">${initials(testimonial.firstName)}</div>
<blockquote>“${testimonial.quote}”</blockquote>
<footer>
<strong>${testimonial.firstName}</strong>
<span>${meta}${testimonial.status === "obtenue" ? " — bourse obtenue" : ""}</span>
</footer>
`;

return card;

}

// Reste "hidden" (voir index.html) tant que TESTIMONIALS est vide — pas
// de carte vide ni de placeholder qui ressemblerait à un vrai témoignage.
function renderTestimonials() {

const section = document.getElementById("trustTestimonials");
const grid = document.getElementById("testimonialGrid");

if (!section || !grid || !TESTIMONIALS.length) return;

grid.innerHTML = "";
TESTIMONIALS.forEach((testimonial) => grid.appendChild(renderTestimonialCard(testimonial)));
section.hidden = false;

}

async function loadTeaser() {

const grid = document.getElementById("teaserGrid");

try {

// Passe par le chargeur partagé (js/catalog-data.js) : ce module et
// js/opportunites-bandeau.js lisaient chacun les trois collections
// entières sur la MÊME page, soit le double du nécessaire.
const { universites, programmes, bourses } = await chargerCatalogue();

const all = universites;
const programs = programmes;
const scholarshipsById = new Map(bourses.map((b) => [b.id, b]));

renderTrustLogos(all);
renderTrustStats(all, bourses.length);

if (!grid) return;

if (!all.length) {
grid.remove();
return;
}

const withPhoto = all.filter((u) => u.image);
const pool = dedupeByUniversity(withPhoto.length >= TEASER_COUNT ? withPhoto : all);

const featured = FEATURED_UNIVERSITY_IDS
.map((id) => pool.find((u) => u.id === id))
.filter(Boolean);

const remainingPool = pool.filter((u) => !featured.includes(u));
const picks = featured.length >= TEASER_COUNT
? featured.slice(0, TEASER_COUNT)
: featured.concat(pickDiverse(remainingPool, TEASER_COUNT - featured.length));

grid.innerHTML = "";
picks.forEach((university, index) => grid.appendChild(renderCard(university, firstScholarshipTitle(university.id, programs, scholarshipsById), index)));

if (window.lucide) lucide.createIcons();

} catch (error) {

console.error("Aperçu des opportunités : échec du chargement", error);
if (grid) grid.remove();
document.getElementById("trustLogosRow")?.remove();
document.getElementById("trustStats")?.remove();

// La rangée de statistiques DU HERO n'était pas couverte par ce
// filet (2026-08-29) : elle est remplie par la même requête, mais
// vit dans une autre section, et restait donc bloquée sur ses trois
// tirets « — » — la toute première chose que voit un visiteur si
// Firestore est lent, bloqué par un réseau d'entreprise ou hors
// ligne. Trois tirets au-dessus de la ligne de flottaison font lire
// « site cassé », pas « chiffres en cours de chargement ». On les
// retire : ne pas annoncer un chiffre qu'on n'a pas est plus honnête
// que d'en inventer un, et le hero reste complet sans eux (titre,
// promesse, bénéfices, visuel, bouton).
document.querySelector(".hero-stats")?.remove();

}

}

renderTestimonials();
loadTeaser();
trackVisitOnce();
