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
* Colonne « Contact » (e-mail, téléphone, page contact) à la place de
* l'ancienne colonne « Légal » — demandé par Charles le 2026-09-20,
* inspiré du pied de page d'İstanbul Üniversitesi. Les valeurs sont
* celles de contact.html — si l'une change, changer les DEUX.
* Les liens légaux (mentions légales, CGV, confidentialité) restent
* OBLIGATOIRES (paiement) mais vivent en petit dans la ligne du bas,
* comme sur les grands sites — jamais en vitrine.
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
] }
];

// La colonne Contact remplace la colonne Légal (décision de Charles,
// 2026-09-20, à la manière des grands sites et du pied de page
// d'İstanbul Üniversitesi) : les coordonnées en colonne, les liens
// légaux en petit dans la ligne du bas — présents, jamais en vitrine.
// Icônes nues, métrique Lucide (24×24, stroke 2, currentColor).
const CONTACT = `<div>
<p class="footer-col-title">Contact</p>
<ul class="footer-contact">
<li><a href="mailto:contact@fitzuniverse.com"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg><span>contact@fitzuniverse.com</span></a></li>
<li><a href="tel:+221339046678"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg><span>+221 33 904 66 78</span></a></li>
<li><a href="contact.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg><span>Nous contacter</span></a></li>
</ul>
</div>`;

function colonne(c) {
return `<div>
<p class="footer-col-title">${c.titre}</p>
<ul>${c.liens.map(([href, libelle]) => `<li><a href="${href}">${libelle}</a></li>`).join("")}</ul>
</div>`;
}

// Phrase de marque (choisie par Charles le 2026-09-24) : elle reprend le
// surtitre du hero (« Né en Afrique. Ouvert au monde ») et le vocabulaire
// du site (bourse ou préinscription). Elle remplace « accompagne les
// étudiants africains, vers une bourse ou une admission qu'ils financent
// eux-mêmes. La plateforme est ouverte à tout étudiant, où qu'il soit » :
// virgule fautive, « admission » au lieu de « préinscription », et deux
// phrases qui se contredisaient (« africains » puis « tout étudiant »).
function markup() {
return `${PHOTO}
<div class="container">
<div class="footer-top">
<div class="footer-brand">
<a href="index.html" class="fitz-lockup" aria-label="FitzUniverse — accueil">${MARK_SVG}<span class="fitz-lockup-text"><span class="fitz-lockup-name">Fitz</span><span class="fitz-lockup-sub">Universe</span></span></a>
<p>Né en Afrique, ouvert au monde&nbsp;: FitzUniverse accompagne chaque étudiant vers une bourse ou une préinscription à l'étranger, jusqu'au jour du départ.</p>
</div>
<div class="footer-links">${COLONNES.map(colonne).join("")}${CONTACT}</div>
</div>
<div class="footer-bottom">
<p>© ${new Date().getFullYear()} FitzUniverse. Tous droits réservés. — <a href="credits.html">Crédits photo</a></p>
<nav class="footer-legal" aria-label="Informations légales">
<a href="mentions-legales.html">Mentions légales</a>
<a href="cgv.html">Conditions de vente</a>
<a href="confidentialite.html">Confidentialité</a>
</nav>
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
