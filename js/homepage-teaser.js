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


// Chargeur de catalogue partagé et mémoïsé — voir js/catalog-data.js.
import { chargerCatalogue } from "./catalog-data.js";

// Entrée du site pour le Control Center (2026-09-02) : une visite par
// session de navigateur, signalée depuis la page d'accueil — le point
// d'entrée public principal (l'espace connecté a la sienne via
// js/app-shell.js, même garde sessionStorage, jamais de doublon).
//
// Module de suivi CHARGÉ À LA DEMANDE depuis le lot A « vitesse sur téléphone »
// (2026-09-24). js/analytics.js importe Firebase (environ 200 Kio) :
// en import statique, il était téléchargé en même temps que le titre
// et la photo du hero, et leur disputait un réseau lent. Il part
// désormais une fois la page affichée (événement load, puis temps
// libre du navigateur) — bien avant qu'un visiteur ait lu le hero et
// cliqué sur une porte. Même promesse pour tous les appels : un seul
// téléchargement.
let analytique = null;
function chargerAnalytique() {
if (!analytique) analytique = import("./analytics.js");
return analytique;
}
function trackEvent(type) {
return chargerAnalytique().then((m) => m.trackEvent(type));
}
function apresAffichage(tache) {
const lancer = () => {
if ("requestIdleCallback" in window) requestIdleCallback(tache, { timeout: 3000 });
else setTimeout(tache, 1);
};
if (document.readyState === "complete") lancer();
else window.addEventListener("load", lancer, { once: true });
}

// Lot LANGAGE (2026-09-10) : la bande « le catalogue en chiffres »
// compte aussi les pays de départ documentés à la source officielle —
// le registre des couches de résidence, jamais un nombre écrit.

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

// Les trois cibles trustUniversityCount / trustCountryCount /
// trustScholarshipCount ont été retirées le 2026-09-08 : la dernière
// page qui aurait pu les porter était l'accueil, et le bloc #trust qui
// les contenait a quitté le site. Vérifié avant suppression — zéro
// occurrence dans les fichiers suivis. Elles étaient gardées « au cas
// où une page reprendrait ce bloc à trois » ; plus aucune ne le fait,
// et trois recherches DOM qui renvoient null à chaque chargement ne
// documentent rien qu'un commentaire ne dise mieux.
const heroScholarshipCountEl = document.getElementById("heroScholarshipCount");
const heroCountryCountEl = document.getElementById("heroCountryCount");
const heroUniversityCountEl = document.getElementById("heroUniversityCount");

if (!heroScholarshipCountEl && !heroCountryCountEl && !heroUniversityCountEl) return;

const deduped = dedupeByUniversity(universities);
const countryCount = new Set(deduped.map((u) => u.country).filter(Boolean)).size;

// Catalogue joignable mais vide : on ne pose aucun chiffre. Le filet de
// fin de body (index.html, 8 s) retire alors la rangée du hero, qui
// reste sur ses tirets d'ici là. Auparavant cette branche retirait
// #trustStats, un élément qui n'existe plus nulle part.
if (!deduped.length) return;

// SUFFIXE « + » RETIRÉ le 2026-09-01. Le catalogue compte EXACTEMENT
// ces nombres — ils sont comptés sur les documents réellement chargés,
// pas estimés. « 122+ » laissait entendre davantage, et c'est le seul
// endroit du site où un chiffre en promettait plus qu'il n'en tenait.
// Un catalogue qui se vend sur la vérification à la main ne gagne rien
// à arrondir vers le haut.
setCount(heroScholarshipCountEl, scholarshipCount);
setCount(heroCountryCountEl, countryCount);
setCount(heroUniversityCountEl, deduped.length);

// La bande #chiffres (renderChiffres) est partie avec le lot
// VITRINE-COMMERCIALE (2026-09-11) : elle répétait les trois compteurs
// du hero. Les nombres continuent de se LIRE ici, jamais de s'écrire
// dans index.html (test/langage.test.mjs, contrôle 7).

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
apresAffichage(() => {
chargerAnalytique().then((m) => m.trackVisitOnce()).catch(() => {});
});

// Les trois chemins de l'accueil (lot PORTES-COULEUR) : un compteur par
// clic, rien d'autre. L'écriture part AVANT la navigation, qui attend
// son accusé — au plus 400 ms : une écriture perdue à l'unload ne
// compterait rien, et ces trois nombres sont la seule donnée qui
// tranchera l'égalité des portes. Ctrl/⌘-clic et clic du milieu : le
// navigateur fait son travail, on ne compte pas.
for (const lien of document.querySelectorAll("[data-chemin]")) {
lien.addEventListener("click", (e) => {
if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
e.preventDefault();
const href = lien.href;
let parti = false;
const partir = () => { if (parti) return; parti = true; window.location.assign(href); };
setTimeout(partir, 400);
Promise.resolve(trackEvent(lien.dataset.chemin)).catch(() => {}).finally(partir);
});
}
