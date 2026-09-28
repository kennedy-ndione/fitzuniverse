/* ==========================================================
* FITZUNIVERSE — COUCHE « VIVANT » (2026-09-03)
* Moteur de mouvement. Va avec css/vivant.css.
* ==========================================================
*
* POURQUOI CE N'EST PAS UN MODULE
* C'est un <script> classique, volontairement, pour la même raison
* que js/catalog-watchdog.js : un module ES qui importe
* firebase-config.js ne s'exécute PAS DU TOUT si un seul
* téléchargement gstatic échoue. Une couche d'animation qui meurt
* avec le SDK Firebase serait une couche inutile précisément les
* jours où le réseau va mal — c'est-à-dire souvent, sur les
* connexions que Fitz vise. Ce fichier ne doit donc JAMAIS gagner
* d'`import` ni d'attribut type="module".
*
* CONTRAT AVEC LA FEUILLE
* Il pose `vivant` sur <html> à sa première ligne, avant le premier
* paint. Tout ce qui, dans css/vivant.css, masque ou décale un
* élément est conditionné à cette classe : si ce script n'est pas là,
* le site reste celui d'avant, entier et visible.
*
* CE QU'IL FAIT, DANS L'ORDRE
*   1. Échelonnement et révélation — y compris des cartes INJECTÉES
*      APRÈS COUP par scholarships.js / universities-page.js, que
*      l'observateur de js/main.js ne voyait jamais.
*   2. Images qui se déposent (classe `est-chargee`).
*   3. Titres éditoriaux découpés en lignes réelles.
*   4. Halo ambre suivant le pointeur sur les cartes.
*   5. Barre de progression de lecture.
*   6. Parallaxe douce sur [data-parallaxe].
*   7. Transition de page catalogue → fiche.
*
* DISCIPLINE DE PERFORMANCE
* Un seul IntersectionObserver, un seul écouteur de défilement, un
* seul de pointeur, tous passifs et cadencés par requestAnimationFrame.
* Aucune lecture de géométrie dans une boucle d'écriture. Chaque
* élément est retiré de l'observation dès qu'il est révélé.
* ========================================================== */

(function () {
"use strict";

/* --- Garde-fous ------------------------------------------------ */

var racine = document.documentElement;

// Mouvement réduit : on ne pose PAS la classe. Aucun élément ne sera
// masqué ni décalé, et la feuille n'a plus rien à annuler. C'est plus
// sûr que de tout neutraliser après coup.
var mouvementReduit = window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!mouvementReduit) racine.classList.add("vivant");

var supporteIO = "IntersectionObserver" in window;

/* Un seul rendez-vous d'animation partagé : plusieurs sources
(défilement, pointeur) peuvent demander une mise à jour, une seule
image est calculée. */
function cadence(travail) {
  var enAttente = false;
  return function () {
    if (enAttente) return;
    enAttente = true;
    requestAnimationFrame(function () {
      enAttente = false;
      travail();
    });
  };
}

function pret(fn) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fn, { once: true });
  } else {
    fn();
  }
}


/* ==========================================================
* 1. RÉVÉLATION ET ÉCHELONNEMENT
* ==========================================================
* Le manque le plus visible du site : les cartes du catalogue sont
* créées par JS APRÈS le DOMContentLoaded où js/main.js installe son
* observateur. Elles n'ont jamais porté `.reveal` — 153 cartes
* apparaissaient d'un seul bloc, sans rythme.
*
* Ici : un observateur unique, alimenté à la fois par le balisage
* présent au chargement ET par un MutationObserver qui surveille les
* conteneurs de listes. Une carte ajoutée dans dix secondes sera
* traitée comme celles du premier rendu.
*/

var CIBLES = [
  ".scholarship-card",
  ".uni-card",
  ".catalog-country-group > *",
  "[data-vivant]"
].join(",");

var PLAFOND_INDEX = 10; // au-delà, l'attente se ferait sentir

var observateur = null;

/* Les éléments préparés mais pas encore révélés. Sert au FILET DE
SÉCURITÉ plus bas : un observateur d'intersection peut rater un
élément lors d'un défilement très rapide (le doigt qui lance la page
d'un coup, cas courant sur un catalogue de 35 000 px), parce que
l'élément n'a jamais été composé dans une seule image. Mesuré : 8
cartes sur 153 restaient invisibles après un parcours complet.
Un élément invisible est un défaut BIEN PIRE que l'absence
d'animation — d'où ce filet. */
var enAttenteDeRevelation = [];

function revele(el) {
  el.classList.add("est-la");
  if (observateur) observateur.unobserve(el);
  var i = enAttenteDeRevelation.indexOf(el);
  if (i !== -1) enAttenteDeRevelation.splice(i, 1);
}

if (supporteIO && !mouvementReduit) {
  observateur = new IntersectionObserver(function (entrees) {
    for (var i = 0; i < entrees.length; i++) {
      if (!entrees[i].isIntersecting) continue;
      revele(entrees[i].target);
    }
  }, {
    // Déclenche un peu AVANT que l'élément touche le bas de l'écran :
    // l'animation a le temps de se jouer pendant qu'il monte, au lieu
    // de démarrer une fois l'élément déjà bien visible.
    rootMargin: "0px 0px -8% 0px",
    threshold: 0.06
  });
}

/* L'index d'échelonnement est celui de l'élément DANS SON PARENT, et
non dans la page : chaque groupe de pays repart de zéro. Sans ça, la
120e carte d'un catalogue attendrait plusieurs secondes. */
function prepare(el) {
  if (!el || el.__vivant) return;
  el.__vivant = true;

  if (el.style.getPropertyValue("--i") === "") {
    var parent = el.parentElement;
    var rang = 0;
    if (parent) {
      var freres = parent.children;
      for (var i = 0; i < freres.length; i++) {
        if (freres[i] === el) { rang = i; break; }
      }
    }
    el.style.setProperty("--i", Math.min(rang, PLAFOND_INDEX));
  }

  el.classList.add("vivant-arrive");

  if (observateur) {
    observateur.observe(el);
    enAttenteDeRevelation.push(el);
    balayagePlanifie();
  } else {
    el.classList.add("est-la");
  }
}

/* LE FILET. Toutes les 320 ms, tant qu'il reste des éléments en
attente : tout ce qui est déjà entré dans l'écran (ou passé au-dessus)
est révélé, que l'observateur l'ait vu ou non. La boucle s'arrête
d'elle-même quand la liste est vide — aucun minuteur ne tourne sur une
page au repos. */
var minuteurBalayage = null;

function balayage() {
  var vh = window.innerHeight || 0;
  for (var i = enAttenteDeRevelation.length - 1; i >= 0; i--) {
    var el = enAttenteDeRevelation[i];
    if (!el.isConnected) { enAttenteDeRevelation.splice(i, 1); continue; }
    if (el.getBoundingClientRect().top < vh) revele(el);
  }
  // Le filet des images passe par le même balayage : une photo posée
  // dans un conteneur que le MutationObserver ne surveille pas est
  // quand même prise en charge. Une couche d'animation n'a pas le
  // droit de faire disparaître du contenu — jamais.
  depose(document);
}

function balayagePlanifie() {
  if (minuteurBalayage || !enAttenteDeRevelation.length) return;
  minuteurBalayage = setInterval(function () {
    if (!enAttenteDeRevelation.length) {
      clearInterval(minuteurBalayage);
      minuteurBalayage = null;
      balayage();
      return;
    }
    balayage();
  }, 320);
}

/* Le défilement lui-même déclenche le balayage : entre deux tours de
320 ms, un lecteur rapide peut faire monter et sortir une carte que
l'observateur n'a pas eu le temps de signaler. Mesuré : 8 cartes sur
153 restaient invisibles après un défilement complet. */
var balayageDemande = false;
window.addEventListener("scroll", function () {
  if (balayageDemande || !enAttenteDeRevelation.length) return;
  balayageDemande = true;
  requestAnimationFrame(function () { balayageDemande = false; balayage(); });
}, { passive: true });

function prepareTout(racineDeRecherche) {
  var els = (racineDeRecherche || document).querySelectorAll(CIBLES);
  for (var i = 0; i < els.length; i++) prepare(els[i]);
}

/* Les listes que les pages remplissent après leur requête. On
surveille les conteneurs plutôt que le <body> entier : moins de bruit,
et aucun risque de réagir à un rendu de modale ou de menu. */
var CONTENEURS = [
  "#scholarship-list",
  "#universities-list",
  // Orthographe historique, gardée par prudence : si une page revient
  // un jour à l'ancien identifiant, la couche continue de la voir.
  "#university-list",
  ".catalog-grid",
  ".opportunites-piste",
  "[data-vivant-liste]"
];

function surveille() {
  if (!("MutationObserver" in window)) return;

  var mo = new MutationObserver(function (mutations) {
    for (var i = 0; i < mutations.length; i++) {
      var ajouts = mutations[i].addedNodes;
      for (var j = 0; j < ajouts.length; j++) {
        var n = ajouts[j];
        if (n.nodeType !== 1) continue;
        if (n.matches && n.matches(CIBLES)) prepare(n);
        prepareTout(n);
        depose(n);
      }
    }
  });

  for (var k = 0; k < CONTENEURS.length; k++) {
    var els = document.querySelectorAll(CONTENEURS[k]);
    for (var m = 0; m < els.length; m++) {
      mo.observe(els[m], { childList: true, subtree: true });
    }
  }
}


/* ==========================================================
* 2. IMAGES QUI SE DÉPOSENT
* ==========================================================
* Les photos de carte sont en loading="lazy" : sans ça elles
* surgissent d'un coup quand elles arrivent. La classe est posée sur
* `load`, et TOUT DE SUITE si l'image était déjà en cache (complete),
* sinon une image mise en cache resterait invisible pour toujours.
*/

/* Photo de carte UNIQUEMENT — `> img` et non ` img` : le drapeau du
pays vit dans .uni-card-location, à l'intérieur du même conteneur
média. Mesuré : avec le sélecteur large, les 146 drapeaux étaient
comptés comme des photos et passaient en opacity:0. */
// Lot PERF 3G : la photo peut être dans un <picture> (AVIF, WebP, JPEG).
var SELECTEUR_IMAGES = ".scholarship-card-media > img, .uni-card-media > img, .scholarship-card-media > picture > img, .uni-card-media > picture > img";

function marqueChargee() {
  this.classList.add("est-chargee");
}

/* Le filet est armé PAR IMAGE. Il l'a déjà été une fois dans une
boucle `for (var i…)` : `var` est de portée fonction, donc les 292
minuteurs se refermaient tous sur la DERNIÈRE image et 291 photos
restaient invisibles. La fonction dédiée crée une portée par appel. */
function armeFilet(img) {
  setTimeout(function () { img.classList.add("est-chargee"); }, 2200);
}

function depose(racineDeRecherche) {
  var imgs = (racineDeRecherche || document)
    .querySelectorAll(SELECTEUR_IMAGES);

  for (var i = 0; i < imgs.length; i++) {
    var img = imgs[i];
    if (img.__vivantImg) continue;
    img.__vivantImg = true;

    if (img.complete && img.naturalWidth > 0) {
      img.classList.add("est-chargee");
      continue;
    }

    img.addEventListener("load", marqueChargee, { once: true });

    // Une image en échec ne doit pas rester invisible : mieux vaut le
    // cadre vide du navigateur qu'un trou silencieux.
    img.addEventListener("error", marqueChargee, { once: true });

    /* FILET DE SÉCURITÉ — la leçon la plus chère de ce chantier.
    Mesuré sur universities.html : 292 images sur 292 restaient à
    opacity:0. Une <img> sans src, avec un src vide, ou dont le
    chargement n'aboutit jamais n'émet NI `load` NI `error` : l'image
    n'apparaît alors plus jamais. Une couche d'animation n'a pas le
    droit de faire disparaître du contenu. Passé ce délai, on affiche,
    point — au pire on perd un fondu, jamais une image. */
    armeFilet(img);
  }
}


/* ==========================================================
* 3. TITRES ÉDITORIAUX, LIGNE À LIGNE
* ==========================================================
* Les grands titres sont composés en Newsreader sur deux à quatre
* lignes : c'est ce qui donne au site son air de magazine. Les faire
* monter ligne par ligne derrière un masque vaut mieux que de les
* faire apparaître d'un bloc.
*
* PRUDENCE — on ne découpe QUE les titres sans balisage interne.
* Plusieurs titres du site portent un <em> ou un <span> d'accent
* (« … qui sont réellement faites pour vous »), et reconstruire des
* blocs de ligne autour d'une balise inline la casserait. Ceux-là
* gardent la révélation simple du §2 : le rendu reste bon, et rien
* n'est mis en danger pour un effet.
*
* Les lignes sont mesurées APRÈS mise en page (position réelle des
* mots), donc justes à toute largeur ; le découpage est refait au
* redimensionnement.
*/

function decoupeEnLignes(titre) {
  var texte = titre.textContent.replace(/\s+/g, " ").trim();
  if (!texte) return false;

  // Mémorise l'original une seule fois : c'est lui qu'on redécoupe à
  // chaque redimensionnement, et lui qu'on restaure en cas de pépin.
  if (titre.__vivantOriginal == null) titre.__vivantOriginal = titre.innerHTML;

  var mots = texte.split(" ");
  var html = "";
  for (var i = 0; i < mots.length; i++) {
    html += '<span class="vivant-mot">' + mots[i] + "</span> ";
  }
  titre.innerHTML = html;

  var spans = titre.querySelectorAll(".vivant-mot");
  if (!spans.length) { titre.innerHTML = titre.__vivantOriginal; return false; }

  // Regroupe par position verticale : deux mots sur la même ligne
  // ont le même offsetTop.
  var lignes = [];
  var hautCourant = null;
  for (var j = 0; j < spans.length; j++) {
    var haut = spans[j].offsetTop;
    if (hautCourant === null || Math.abs(haut - hautCourant) > 2) {
      hautCourant = haut;
      lignes.push([]);
    }
    lignes[lignes.length - 1].push(spans[j].textContent);
  }

  // Une seule ligne : le découpage n'apporte rien, on rend l'original.
  if (lignes.length < 2) { titre.innerHTML = titre.__vivantOriginal; return false; }

  var sortie = "";
  for (var k = 0; k < lignes.length; k++) {
    sortie += '<span class="vivant-ligne" style="--l:' + k + '"><span>' +
      lignes[k].join(" ") + "</span></span>";
  }
  titre.innerHTML = sortie;
  titre.classList.add("vivant-lignes");
  return true;
}

function titresEnLignes() {
  if (mouvementReduit) return;

  var titres = document.querySelectorAll("[data-vivant-titre]");
  if (!titres.length) return;

  var traites = [];

  for (var i = 0; i < titres.length; i++) {
    var t = titres[i];
    // Balisage interne → on laisse tomber le découpage (voir plus haut).
    if (t.children.length && !t.classList.contains("vivant-lignes")) {
      prepare(t);
      continue;
    }
    if (decoupeEnLignes(t)) {
      traites.push(t);
      if (observateur) observateur.observe(t);
      else t.classList.add("est-la");
    }
  }

  if (!traites.length) return;

  // Redécoupage au redimensionnement : le nombre de lignes change avec
  // la largeur. Temporisé, et seulement si la largeur a bougé (sur
  // téléphone, l'apparition du clavier change la HAUTEUR en
  // permanence — redécouper à chaque fois ferait clignoter le titre).
  var largeur = window.innerWidth;
  var minuteur = null;

  window.addEventListener("resize", function () {
    if (window.innerWidth === largeur) return;
    largeur = window.innerWidth;
    clearTimeout(minuteur);
    minuteur = setTimeout(function () {
      for (var n = 0; n < traites.length; n++) {
        var t = traites[n];
        var etaitVisible = t.classList.contains("est-la");
        t.innerHTML = t.__vivantOriginal;
        t.classList.remove("vivant-lignes", "est-la");
        if (decoupeEnLignes(t) && etaitVisible) t.classList.add("est-la");
      }
    }, 220);
  }, { passive: true });
}


/* ==========================================================
* 4. HALO AMBRE SUIVANT LE POINTEUR
* ==========================================================
* Un seul écouteur pour toutes les cartes de la page, cadencé par
* requestAnimationFrame : au pire une mise à jour par image, quel que
* soit le nombre de cartes. Les coordonnées sont écrites en
* pourcentage dans deux propriétés personnalisées lues par la feuille.
*
* Uniquement là où un pointeur fin existe : au doigt, il n'y a pas de
* survol, et la feuille désactive de son côté le dégradé de fond.
*/

function haloPointeur() {
  if (mouvementReduit) return;
  if (!window.matchMedia || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  var derniere = null;
  var carteCourante = null;

  var applique = cadence(function () {
    if (!derniere || !carteCourante) return;
    var r = carteCourante.getBoundingClientRect();
    if (!r.width || !r.height) return;
    var x = ((derniere.x - r.left) / r.width) * 100;
    var y = ((derniere.y - r.top) / r.height) * 100;
    carteCourante.style.setProperty("--mx", x.toFixed(1) + "%");
    carteCourante.style.setProperty("--my", y.toFixed(1) + "%");
  });

  document.addEventListener("pointermove", function (e) {
    var carte = e.target.closest && e.target.closest(".scholarship-card, .uni-card");
    if (!carte) { carteCourante = null; return; }
    carteCourante = carte;
    derniere = { x: e.clientX, y: e.clientY };
    applique();
  }, { passive: true });
}


/* ==========================================================
* 5. BARRE DE PROGRESSION DE LECTURE
* ==========================================================
* Sur une page catalogue de 35 000 px (88 000 sur téléphone), savoir
* où l'on en est n'est pas un ornement : c'est l'information qui
* manque. Un filet ambre de 3 px, piloté par un scaleX — donc aucun
* recalcul de mise en page, uniquement de la composition.
*
* Ne s'installe QUE si la page est réellement longue : sur une page
* courte, une barre toujours pleine serait du bruit.
*/

function progression() {
  if (mouvementReduit) return;

  /* NE PAS décider ici si la page est longue. Mesuré : sur
  scholarships.html, `load` survient alors que le catalogue est encore
  VIDE — la page fait quelques centaines de pixels, la barre n'était
  donc jamais créée… puis les 153 cartes arrivaient et la page passait
  à 35 000 px sans repère. Exactement l'inverse du besoin.

  La barre est donc toujours créée, et c'est la mise à jour (qui, elle,
  s'exécute à chaque défilement) qui décide de la montrer ou non selon
  la hauteur RÉELLE du moment. */

  var barre = document.createElement("div");
  barre.className = "vivant-progression";
  barre.setAttribute("aria-hidden", "true");
  barre.setAttribute("data-debut", "1");
  barre.innerHTML = "<span></span>";
  document.body.appendChild(barre);

  var trait = barre.firstChild;

  var maj = cadence(function () {
    var total = document.documentElement.scrollHeight - window.innerHeight;

    // Page courte : une barre toujours pleine serait du bruit.
    if (total < window.innerHeight * 1.5) {
      barre.setAttribute("data-court", "1");
      return;
    }
    barre.removeAttribute("data-court");

    var p = window.scrollY / total;
    if (p < 0) p = 0; else if (p > 1) p = 1;
    trait.style.setProperty("--avancement", p.toFixed(4));
    barre.setAttribute("data-debut", p > 0.005 ? "0" : "1");
  });

  window.addEventListener("scroll", maj, { passive: true });
  window.addEventListener("resize", maj, { passive: true });

  // La hauteur change quand le catalogue se remplit : on remesure.
  if ("ResizeObserver" in window) {
    try { new ResizeObserver(maj).observe(document.body); } catch (e) {}
  }

  maj();
}


/* ==========================================================
* 6. PARALLAXE DOUCE
* ==========================================================
* Même principe que la photo du pied de page (js/main.js), généralisé
* à tout élément marqué [data-parallaxe]. Le ratio est réglable par
* l'attribut ; 0,08 par défaut, volontairement faible : un effet de
* profondeur qui se remarque est un effet raté.
*/

function parallaxe() {
  if (mouvementReduit) return;

  var cibles = document.querySelectorAll("[data-parallaxe]");
  if (!cibles.length) return;

  var maj = cadence(function () {
    var vh = window.innerHeight || 1;
    for (var i = 0; i < cibles.length; i++) {
      var el = cibles[i];
      var r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) continue;
      var ratio = parseFloat(el.getAttribute("data-parallaxe")) || 0.08;
      // -1 quand l'élément entre par le bas, +1 quand il sort par le haut.
      var avancement = (r.top + r.height / 2 - vh / 2) / vh;
      el.style.transform = "translate3d(0," + (-avancement * ratio * r.height).toFixed(1) + "px,0)";
    }
  });

  window.addEventListener("scroll", maj, { passive: true });
  window.addEventListener("resize", maj, { passive: true });
  maj();
}


/* ==========================================================
* 7. TRANSITION DE PAGE — CATALOGUE → FICHE
* ==========================================================
* css/vivant.css active la transition entre documents
* (@view-transition). Ici on ajoute la seule chose que le CSS ne peut
* pas deviner : QUELLE photo est celle qu'on vient de cliquer. Elle
* reçoit un nom de transition juste avant la navigation ; la photo de
* la fiche d'arrivée porte le même nom, et le navigateur fait glisser
* l'une vers l'autre.
*
* Un seul nom peut exister par page : on nettoie tout avant de poser.
* Si le navigateur ne connaît pas l'API, il ne se passe rien de plus
* qu'une navigation ordinaire.
*/

/* UN SKIP N'EST PAS UNE ERREUR (2026-09-06)
 *
 * Constaté en ligne : `AbortError: Transition was skipped. Navigation
 * aborted` remontait en rejet NON ATTRAPÉ dès qu'une navigation en
 * interrompait une autre — devenu fréquent depuis que les pastilles de
 * pays naviguent au lieu de faire défiler (js/catalogue-vue.js).
 *
 * Il n'y a pourtant AUCUN `document.startViewTransition()` dans ce
 * dépôt : la transition est ouverte par le navigateur lui-même, sur la
 * foi du `@view-transition { navigation: auto }` de css/vivant.css. Le
 * rejet appartient donc à une promesse que rien, côté site, ne tenait —
 * d'où le bruit. `pageswap` (page qui part) et `pagereveal` (page qui
 * arrive) sont les deux seuls endroits où cette promesse nous est
 * tendue : on la prend, et on la relâche.
 *
 * On n'AVALE rien d'autre : seules les promesses de CETTE transition
 * sont marquées comme traitées. Une vraie erreur applicative continue
 * de remonter — c'est tout l'intérêt de ne pas poser un
 * `unhandledrejection` global.
 */
function transitionSansBruit(evenement) {

  var t = evenement && evenement.viewTransition;
  if (!t) return;

  var rien = function () {};

  if (t.finished && t.finished.catch) t.finished.catch(rien);
  if (t.ready && t.ready.catch) t.ready.catch(rien);
  if (t.updateCallbackDone && t.updateCallbackDone.catch) t.updateCallbackDone.catch(rien);

}

// Hors du garde `mouvementReduit` de morphe() : le navigateur peut
// ouvrir la transition sans nous, le rejet doit être tenu dans tous les
// cas.
window.addEventListener("pageswap", transitionSansBruit);
window.addEventListener("pagereveal", transitionSansBruit);

function morphe() {
  if (mouvementReduit) return;
  if (!("startViewTransition" in document)) return;

  // Page d'arrivée : la photo de couverture de la fiche.
  var arrivee = document.getElementById("cityImage");
  if (arrivee) arrivee.classList.add("vivant-morphe");

  // Page de départ : la carte cliquée.
  document.addEventListener("click", function (e) {
    var lien = e.target.closest && e.target.closest("a[href]");
    if (!lien) return;
    if (lien.href.indexOf("scholarship-details") === -1) return;

    var carte = lien.closest(".scholarship-card, .uni-card") || lien;
    var media = carte.querySelector(".scholarship-card-media, .uni-card-media");
    if (!media) return;

    var deja = document.querySelectorAll(".vivant-morphe");
    for (var i = 0; i < deja.length; i++) deja[i].classList.remove("vivant-morphe");

    media.classList.add("vivant-morphe");
  }, true);
}


/* ==========================================================
* MISE EN ROUTE
* ========================================================== */

pret(function () {
  try { prepareTout(); } catch (e) {}
  try { depose(); } catch (e) {}
  try { surveille(); } catch (e) {}
  try { titresEnLignes(); } catch (e) {}
  try { haloPointeur(); } catch (e) {}
  try { parallaxe(); } catch (e) {}
  try { morphe(); } catch (e) {}
  // La barre attend la fin du chargement : la hauteur de page n'est
  // fiable qu'une fois les images dimensionnées.
  if (document.readyState === "complete") { try { progression(); } catch (e) {} }
  else window.addEventListener("load", function () { try { progression(); } catch (e) {} }, { once: true });
});

})();
