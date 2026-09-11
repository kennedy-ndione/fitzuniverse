/**
* ==========================================================
* Fitz - Hero Demo
* Fitz Demo v1.0
* ==========================================================
*/

document.addEventListener("DOMContentLoaded", () => {

// ==========================================================
// PHOTO DU HERO : disparition progressive au scroll
// L'image est fixe (pinned) tant qu'on est en haut de page,
// puis s'estompe et se rétracte légèrement au fil du scroll,
// pendant que le contenu du Hero défile normalement au-dessus.
// ==========================================================

const heroMedia = document.querySelector(".hero-media");

const reduceMotion = window.matchMedia(
"(prefers-reduced-motion: reduce)"
).matches;

if (heroMedia && !reduceMotion) {

const FADE_DISTANCE = 650;
let ticking = false;

function updateHeroMedia() {

const progress = Math.min(Math.max(window.scrollY / FADE_DISTANCE, 0), 1);

heroMedia.style.opacity = String(1 - progress);
heroMedia.style.transform =
`scale(${1 + progress * 0.06}) translateY(${progress * -30}px)`;
heroMedia.style.visibility = progress >= 1 ? "hidden" : "visible";

ticking = false;

}

updateHeroMedia();

window.addEventListener("scroll", () => {

if (!ticking) {
requestAnimationFrame(updateHeroMedia);
ticking = true;
}

}, { passive: true });

}

const message = document.getElementById("fitz-message");
const progressBar = document.getElementById("progress-bar");
const analysisList = document.getElementById("analysis-list");

// Si le Hero n'est pas présent sur la page,
// on quitte proprement.
if (!message || !progressBar || !analysisList) {
return;
}

const steps = [
{
icon: "graduation-cap",
message: "Niveau d'études identifié",
progress: 20
},
{
icon: "book-open",
message: "Domaine académique analysé",
progress: 40
},
{
icon: "languages",
message: "Langues prises en compte",
progress: 60
},
{
icon: "globe",
message: "Recherche des opportunités compatibles",
progress: 80
},
{
icon: "badge-check",
message: "12 opportunités trouvées",
progress: 100
}
];

let currentStep = 0;
let interval = null;
let pendingTimeout = null;

function stopDemo() {

if (interval) { clearInterval(interval); interval = null; }
if (pendingTimeout) { clearTimeout(pendingTimeout); pendingTimeout = null; }

}

// Lot DEUX-MOTEURS (2026-09-11) : un NOUVEAU <span> par message, avec
// son animation d'entrée CSS (css/hero.css, #fitz-message > span). Avant :
// opacité à 0, puis textContent changé 200 ms plus tard pendant la
// transition — sur l'iPhone de Charles, WebKit dessinait l'ancien et le
// nouveau message l'un sur l'autre. Plus de minuteur ici : rien à
// annuler dans stopDemo(), et resetDemo() ne peut plus recevoir un
// ancien message en retard.
function setMessage(text) {

const span = document.createElement("span");
span.textContent = text;
message.replaceChildren(span);

}

function addStep(step) {

const item = document.createElement("li");
item.className = "analysis-item";

item.innerHTML = `
<i data-lucide="${step.icon}"></i>
<span>${step.message}</span>
`;

analysisList.appendChild(item);

// Transforme les balises <i data-lucide="">
// en vraies icônes Lucide.
if (window.lucide) lucide.createIcons();

}

function updateStep() {

const step = steps[currentStep];

setMessage(step.message);

progressBar.style.width = step.progress + "%";

addStep(step);

currentStep++;

if (currentStep >= steps.length) {

clearInterval(interval);
interval = null;

pendingTimeout = setTimeout(resetDemo, 3000);

}

}

function resetDemo() {

currentStep = 0;

analysisList.innerHTML = "";

progressBar.style.width = "0%";

setMessage("Bonjour, je suis Fitz. Commençons par comprendre votre profil.");

pendingTimeout = setTimeout(startDemo, 1000);

}

function startDemo() {

updateStep();

interval = setInterval(updateStep, 1500);

}

// Pause hors écran (audit du 2026-08-13) : sans ça, le cycle tournait
// en continu même section loin hors du viewport ou onglet en
// arrière-plan — impact réel faible (mise à jour DOM légère toutes
// les 1,5s) mais consommait CPU/batterie en continu pour rien.
// reduceMotion (déjà défini plus haut pour le fondu du hero) : pas de
// cycle du tout dans ce cas, le message d'accueil statique suffit.
const fitzDemoSection = document.getElementById("fitz-demo");

if (reduceMotion) {

// Rien : #fitz-message garde son texte initial, la carte reste figée.

} else if (fitzDemoSection && "IntersectionObserver" in window) {

const demoObserver = new IntersectionObserver((entries) => {

entries.forEach((entry) => {

stopDemo();

if (entry.isIntersecting) resetDemo();

});

}, { threshold: 0.2 });

demoObserver.observe(fitzDemoSection);

} else {

resetDemo();

}

});
