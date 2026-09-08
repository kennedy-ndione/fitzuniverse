/**
 * ==========================================================
 * js/homepage-teaser.js — les trois chiffres du hero
 * ==========================================================
 *
 * LE NOM EST HISTORIQUE. Ce fichier a longtemps rempli l'aperçu du
 * catalogue de la page d'accueil : quatre cartes d'université, une
 * bande défilante de noms d'établissements, un bloc de témoignages.
 * Les trois ont quitté la page le 2026-09-08 (l'aperçu et la bande
 * montraient le catalogue à qui n'a encore rien demandé ; le bloc de
 * témoignages était vide depuis sa création). Le fichier garde son nom
 * parce qu'une demi-douzaine de commentaires de feuilles et de
 * documents le citent — le renommer aurait laissé autant de renvois
 * vers un fichier absent.
 *
 * CE QU'IL FAIT AUJOURD'HUI, ET RIEN DE PLUS
 *   1. il remplit les trois compteurs du hero (bourses, pays,
 *      établissements) à partir du catalogue partagé ;
 *   2. il signale une visite par session de navigateur ;
 *   3. si le catalogue est injoignable, il retire la rangée de
 *      compteurs plutôt que de laisser trois tirets au-dessus de la
 *      ligne de flottaison.
 *
 * Aucune lecture Firestore ne lui est propre : chargerCatalogue() est
 * mémoïsé et partagé avec js/opportunites-bandeau.js sur cette même
 * page, et sert l'instantané statique assets/data/catalogue.json quand
 * il est valide.
 * ==========================================================
 */


// Entrée du site pour le Control Center (2026-09-02) : une visite par
// session de navigateur, signalée depuis la page d'accueil — le point
// d'entrée public principal (l'espace connecté a la sienne via
// js/app-shell.js, même garde sessionStorage, jamais de doublon).
import { trackVisitOnce } from "./analytics.js";

// Chargeur de catalogue partagé et mémoïsé — voir js/catalog-data.js.
import { chargerCatalogue } from "./catalog-data.js";

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
// LE CHARGEMENT
// ==========================================================

async function chargerChiffres() {

try {

// Passe par le chargeur partagé (js/catalog-data.js) : ce module et
// js/opportunites-bandeau.js lisaient chacun les trois collections
// entières sur la MÊME page, soit le double du nécessaire.
const { universites, bourses } = await chargerCatalogue();

renderTrustStats(universites, bourses.length);

} catch (error) {

console.error("Chiffres de l'accueil : échec du chargement", error);

// La rangée de statistiques DU HERO est remplie par cette requête :
// sans ce filet, elle resterait bloquée sur ses trois tirets « — » —
// la toute première chose que voit un visiteur si le catalogue est
// lent, bloqué par un réseau d'entreprise ou hors ligne. Trois tirets
// au-dessus de la ligne de flottaison font lire « site cassé », pas
// « chiffres en cours de chargement ». On les retire : ne pas
// annoncer un chiffre qu'on n'a pas est plus honnête que d'en
// inventer un, et le hero reste complet sans eux.
document.querySelector(".hero-stats")?.remove();

}

}

chargerChiffres();
trackVisitOnce();
