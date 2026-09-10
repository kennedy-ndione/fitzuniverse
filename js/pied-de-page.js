/**
* ==========================================================
* FitzUniverse — pied de page partagé (lot LANGAGE, 2026-09-10)
* ==========================================================
*
* Un seul script, chargé tel quel (pas un module) par toutes les pages
* publiques, qui INJECTE le pied de page — même approche que
* js/mobile-nav.js : aucun balisage à recopier, donc aucune page qui
* « oublie » son pied de page. Avant ce lot, `grep "<footer"` ne
* répondait que sur index.html : un visiteur venu de Google sur
* scholarships.html descendait et ne trouvait rien.
*
* Ce qu'il exige, il le charge lui-même : css/pied-de-page.css. Les
* variables (--amber-700, --fs-small…) et .fitz-lockup viennent de
* css/base.css, que toute page charge déjà.
*
* Colonne « Légal » : mentions légales, CGV, confidentialité, contact.
* Ces pages attendent le NINEA et le RCCM ; en attendant les liens
* mènent à bientot.html — mais la colonne est là, c'est elle qui se
* voit.
*
* Une fois le pied de page posé, le glossaire (js/glossaire.js) explique
* les termes techniques de la page, à leur première apparition.
* ==========================================================
*/

(() => {

"use strict";

const CSS = "css/pied-de-page.css";

const MARK_SVG = `<svg class="fitz-mark" viewBox="0 0 100 100" fill="none" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><circle class="mark-structure" cx="50" cy="50" r="34" stroke-width="11" stroke-linecap="round" stroke-dasharray="130 83.6" transform="rotate(-90 50 50)"/><circle class="mark-accent" cx="50" cy="50" r="34" stroke-width="11" stroke-linecap="round" stroke-dasharray="42 171.6" stroke-dashoffset="-150" transform="rotate(-90 50 50)"/></svg>`;

const PHOTO = `<div class="footer-photo">
<picture>
<source type="image/avif" srcset="assets/images/hero-bg4-400w.avif 400w, assets/images/hero-bg4-800w.avif 800w, assets/images/hero-bg4-1200w.avif 1200w, assets/images/hero-bg4-1600w.avif 1600w, assets/images/hero-bg4-1920w.avif 1920w" sizes="100vw">
<source type="image/webp" srcset="assets/images/hero-bg4-400w.webp 400w, assets/images/hero-bg4-800w.webp 800w, assets/images/hero-bg4-1200w.webp 1200w, assets/images/hero-bg4-1600w.webp 1600w, assets/images/hero-bg4-1920w.webp 1920w" sizes="100vw">
<img class="footer-photo-img" src="assets/images/hero-bg4-800w.jpg" width="800" height="533" srcset="assets/images/hero-bg4-400w.jpg 400w, assets/images/hero-bg4-800w.jpg 800w, assets/images/hero-bg4-1200w.jpg 1200w, assets/images/hero-bg4-1600w.jpg 1600w, assets/images/hero-bg4-1920w.jpg 1920w" sizes="100vw" alt="" loading="lazy" decoding="async">
</picture>
</div>`;

// Les colonnes. Les ancres de l'accueil sont écrites en absolu
// (index.html#…) : elles marchent depuis n'importe quelle page.
const COLONNES = [
{ titre: "Plateforme", liens: [
["scholarships.html", "Bourses"],
["preinscriptions.html", "Préinscriptions"],
["universities.html", "Universités"],
["eligibility-test.html", "Diagnostic gratuit"],
["offers.html", "Formules"]
] },
{ titre: "Comprendre", liens: [
["index.html#why-us", "Pourquoi nous choisir"],
["index.html#how-it-works", "Comment ça fonctionne"],
["index.html#vision", "Notre vision"],
["login.html", "Connexion"]
] },
{ titre: "Légal", liens: [
["bientot.html?page=mentions-legales", "Mentions légales"],
["bientot.html?page=cgv", "Conditions de vente"],
["bientot.html?page=confidentialite", "Confidentialité"],
["bientot.html?page=contact", "Contact"]
] }
];

function colonne(c) {
return `<div>
<p class="footer-col-title">${c.titre}</p>
<ul>${c.liens.map(([href, libelle]) => `<li><a href="${href}">${libelle}</a></li>`).join("")}</ul>
</div>`;
}

function markup() {
return `${PHOTO}
<div class="container">
<div class="footer-top">
<div class="footer-brand">
<a href="index.html" class="fitz-lockup" aria-label="FitzUniverse — accueil">${MARK_SVG}<span class="fitz-lockup-text"><span class="fitz-lockup-name">Fitz</span><span class="fitz-lockup-sub">Universe</span></span></a>
<p>FitzUniverse accompagne les étudiants africains, vers une bourse ou une admission qu'ils financent eux-mêmes. La plateforme est ouverte à tout étudiant, où qu'il soit.</p>
</div>
<div class="footer-links">${COLONNES.map(colonne).join("")}</div>
</div>
<div class="footer-bottom">
<p>© ${new Date().getFullYear()} FitzUniverse. Tous droits réservés. — <a href="CREDITS.md">Crédits photo</a></p>
</div>
</div>`;
}

function chargerStyle() {
if (document.querySelector(`link[href$="${CSS}"]`)) return;
const link = document.createElement("link");
link.rel = "stylesheet";
link.href = CSS;
document.head.appendChild(link);
}

function poser() {
if (document.querySelector("footer.footer")) return;
chargerStyle();
const footer = document.createElement("footer");
footer.className = "footer footer-photo-feature";
footer.setAttribute("data-pied-de-page", "partage");
footer.innerHTML = markup();
// Les pages « tunnel » (questionnaire, connexion) font de <body> une
// rangée flex qui centre leur carte : un pied de page ajouté en fin de
// body y devenait une DEUXIÈME COLONNE, et la carte se serrait sur
// 203 px à 375 px d'écran (mesuré le 2026-09-10). La classe fait passer
// la rangée à la ligne, le pied de page occupant toute la sienne
// (css/pied-de-page.css).
const style = window.getComputedStyle(document.body);
if (style.display === "flex" && /^row/.test(style.flexDirection)) {
document.body.classList.add("pied-de-page-en-rangee");
}
document.body.appendChild(footer);
}

function expliquer() {
// Module chargé à part : un échec (réseau filtrant) laisse la page et
// son pied de page intacts, sans explications — jamais sans contenu.
import("./glossaire.js")
.then((g) => g.surveillerTermes(document.querySelector("main") || document.body))
.catch((e) => console.warn("Glossaire indisponible :", e));
}

function init() {
poser();
expliquer();
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
else init();

})();
