/**
* ==========================================================
* CONTROL CENTER « NUIT » — le mouvement (lot 122, 2026-09-26)
* ==========================================================
* Script classique, sans dépendance, chargé en `defer` sur toutes les
* pages du Control Center, APRÈS admin/nuit.css. Il ne lit ni n'écrit
* aucune donnée : il anime ce que les autres modules affichent.
*
*  1. Le projecteur : une lueur d'ambre suit le curseur sur les cartes
*     (variables --mx / --my lues par nuit.css).
*  2. Les apparitions : les cartes montent en fondu à mesure qu'elles
*     entrent à l'écran, y compris celles créées plus tard par les
*     modules de la page.
*  3. Les compteurs : un chiffre qui s'affiche ou change défile jusqu'à
*     sa valeur, puis brille un instant. Le texte final est TOUJOURS
*     exactement celui écrit par la page.
*  4. L'inclinaison : les tuiles de chiffres s'inclinent légèrement sous
*     le curseur.
*  5. L'onde : un clic sur un bouton principal laisse une onde de lumière.
*
* Rien de tout cela ne tourne si le système demande moins de mouvement,
* et une erreur ici ne peut rien casser : chaque partie est isolée.
* ==========================================================
*/
(function () {
"use strict";

var sobre = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var tactile = window.matchMedia && window.matchMedia("(hover: none)").matches;

var CARTES = ".admin-auth-card, .panel-card, .journee-card, .pulse-card, .stat-card, .outcome-card, .overview-card, .tool-card, .detail-section, .plans-pays, .passation-guide, .pending-section";
var APPARITIONS = ".panel-card, .outcome-card, .tool-card, .overview-card, .detail-section, .journee-tuile, .visiteurs-chiffre, .plans-pays, .passation-guide, .pending-section, .content > .admin-table-wrap";
var CHIFFRES = ".pulse-resume-valeur, .stat-card-value, .visiteurs-valeur, .outcome-card-value, .journee-tuile-compte, .funnel-row-value, .top-list-count";
var BOUTONS = ".exec-action-btn, .btn-page-action, .btn-detail-action, .btn-profile-save, .seg-btn";

function essayer(nom, fn) {
try { fn(); } catch (e) { if (window.console) console.warn("[nuit] " + nom + " :", e); }
}

// ----------------------------------------------------------
// 1. Le projecteur
// ----------------------------------------------------------
function projecteur() {
if (tactile) return;
var enAttente = null;
var dernier = null;
document.addEventListener("pointermove", function (e) {
dernier = e;
if (enAttente) return;
enAttente = requestAnimationFrame(function () {
enAttente = null;
var cible = dernier.target && dernier.target.closest ? dernier.target.closest(CARTES) : null;
if (!cible) return;
var r = cible.getBoundingClientRect();
cible.style.setProperty("--mx", (dernier.clientX - r.left) + "px");
cible.style.setProperty("--my", (dernier.clientY - r.top) + "px");
});
}, { passive: true });
}

// ----------------------------------------------------------
// 2. Les apparitions
// ----------------------------------------------------------
function apparitions() {
if (sobre || !("IntersectionObserver" in window)) return;
var vus = new WeakSet();
var lot = 0;
var io = new IntersectionObserver(function (entrees) {
var i = 0;
entrees.forEach(function (en) {
if (!en.isIntersecting) return;
var el = en.target;
el.style.setProperty("--nuit-delai", Math.min(i * 70, 420) + "ms");
i += 1;
el.classList.add("is-vu");
io.unobserve(el);
// Une fois arrivée, la carte rend la main à ses propres transitions.
setTimeout(function () { el.classList.remove("nuit-apparait", "is-vu"); el.style.removeProperty("--nuit-delai"); }, 1400 + i * 70);
});
}, { rootMargin: "0px 0px -8% 0px", threshold: .08 });

function preparer(racine) {
var liste = [];
if (racine.matches && racine.matches(APPARITIONS)) liste.push(racine);
if (racine.querySelectorAll) liste = liste.concat(Array.prototype.slice.call(racine.querySelectorAll(APPARITIONS)));
liste.forEach(function (el) {
if (vus.has(el)) return;
vus.add(el);
el.classList.add("nuit-apparait");
io.observe(el);
});
lot += 1;
}

preparer(document.body);
new MutationObserver(function (muts) {
muts.forEach(function (m) {
m.addedNodes.forEach(function (n) { if (n.nodeType === 1) preparer(n); });
});
}).observe(document.body, { childList: true, subtree: true });
}

// ----------------------------------------------------------
// 3. Les compteurs
// ----------------------------------------------------------
var ESPACES = /[\s  ]/g;
var FORME = /^(\D{0,3}?)(\d[\d\s  ]*)(\s?(?:[%]|F(?:\s?CFA)?|€|pts?)?)$/;
var format = new Intl.NumberFormat("fr-FR");

function lireNombre(texte) {
var t = (texte || "").trim();
if (!t || t.length > 24) return null;
var m = t.match(FORME);
if (!m) return null;
var n = Number(m[2].replace(ESPACES, ""));
if (!Number.isFinite(n) || n > 1e9) return null;
return { avant: m[1], n: n, apres: m[3] || "", texte: t };
}

function compteurs() {
var enCours = new WeakMap();

function animer(el, depuis) {
var cible = lireNombre(el.textContent);
if (!cible) return;
var final = el.textContent;
if (sobre || cible.n === depuis) { el.__nuitAttendu = final; return; }
var ancien = enCours.get(el);
if (ancien) cancelAnimationFrame(ancien);
var debut = performance.now();
var duree = Math.min(1600, 700 + Math.log10(Math.abs(cible.n - depuis) + 1) * 260);
function pas(t) {
var p = Math.min(1, (t - debut) / duree);
var e = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
var v = Math.round(depuis + (cible.n - depuis) * e);
var texte = p === 1 ? final : cible.avant + format.format(v) + cible.apres;
el.__nuitAttendu = texte;
el.textContent = texte;
if (p < 1) enCours.set(el, requestAnimationFrame(pas));
else {
enCours.delete(el);
el.classList.remove("nuit-flash");
void el.offsetWidth;
el.classList.add("nuit-flash");
}
}
enCours.set(el, requestAnimationFrame(pas));
}

function surveiller(el) {
if (el.__nuitSuivi) return;
el.__nuitSuivi = true;
el.__nuitDernier = null;
var lu = lireNombre(el.textContent);
if (lu) { el.__nuitDernier = lu.n; animer(el, 0); }
new MutationObserver(function () {
if (el.textContent === el.__nuitAttendu) return;
var precedent = typeof el.__nuitDernier === "number" ? el.__nuitDernier : 0;
var nouveau = lireNombre(el.textContent);
if (!nouveau) { el.__nuitDernier = null; return; }
el.__nuitDernier = nouveau.n;
animer(el, precedent);
}).observe(el, { childList: true, characterData: true, subtree: true });
}

function balayer(racine) {
if (racine.matches && racine.matches(CHIFFRES)) surveiller(racine);
if (racine.querySelectorAll) Array.prototype.forEach.call(racine.querySelectorAll(CHIFFRES), surveiller);
}

balayer(document.body);
new MutationObserver(function (muts) {
muts.forEach(function (m) {
m.addedNodes.forEach(function (n) { if (n.nodeType === 1) balayer(n); });
});
}).observe(document.body, { childList: true, subtree: true });
}

// ----------------------------------------------------------
// 4. L'inclinaison des tuiles
// ----------------------------------------------------------
function inclinaison() {
if (sobre || tactile) return;
var TUILES = ".stat-card, .journee-tuile, .visiteurs-chiffre";
document.addEventListener("pointermove", function (e) {
var t = e.target && e.target.closest ? e.target.closest(TUILES) : null;
if (!t) return;
var r = t.getBoundingClientRect();
var x = (e.clientX - r.left) / r.width - .5;
var y = (e.clientY - r.top) / r.height - .5;
t.style.transform = "perspective(900px) rotateX(" + (-y * 4).toFixed(2) + "deg) rotateY(" + (x * 5).toFixed(2) + "deg) translateY(-3px)";
}, { passive: true });
document.addEventListener("pointerout", function (e) {
var t = e.target && e.target.closest ? e.target.closest(TUILES) : null;
if (t && !t.contains(e.relatedTarget)) t.style.transform = "";
}, { passive: true });
}

// ----------------------------------------------------------
// 5. L'onde au clic
// ----------------------------------------------------------
function ondes() {
if (sobre) return;
document.addEventListener("pointerdown", function (e) {
var b = e.target && e.target.closest ? e.target.closest(BOUTONS) : null;
if (!b) return;
var r = b.getBoundingClientRect();
var taille = Math.max(r.width, r.height) * 2.2;
var o = document.createElement("span");
o.className = "nuit-onde";
o.style.width = o.style.height = taille + "px";
o.style.left = (e.clientX - r.left - taille / 2) + "px";
o.style.top = (e.clientY - r.top - taille / 2) + "px";
if (getComputedStyle(b).position === "static") b.style.position = "relative";
b.style.overflow = "hidden";
b.appendChild(o);
setTimeout(function () { o.remove(); }, 750);
}, { passive: true });
}

function demarrer() {
essayer("projecteur", projecteur);
essayer("apparitions", apparitions);
essayer("compteurs", compteurs);
essayer("inclinaison", inclinaison);
essayer("ondes", ondes);
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", demarrer);
else demarrer();

})();
