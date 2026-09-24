/**
 * ============================================================
 * test/vitesse-accueil.test.mjs — lot A « vitesse sur téléphone »
 * ============================================================
 *
 * Audit du 2026-09-24, PageSpeed sur un téléphone en 4G lente : note de
 * performance 64/100, titre du hero visible à 7,5 s. Trois causes, trois
 * gardes :
 *
 *  1. le titre du hero était masqué par `.reveal` jusqu'à ce que
 *     js/main.js le révèle ;
 *  2. les SDK Firebase (environ 200 Kio) étaient préchargés et
 *     téléchargés dès l'arrivée, en concurrence avec le titre et la
 *     photo, pour un visiteur qui n'en a pas besoin ;
 *  3. les photos du bandeau « Ouvert en ce moment » étaient servies en
 *     JPEG qualité 92 : 970 Kio, dont 855 évitables.
 *
 * Lot A-bis (même jour, après mesure : 71 à 81/100, titre à 4,1-5,2 s).
 * Le titre attendait encore deux choses, deux gardes de plus :
 *
 *  4. la police du titre, chez Google : une feuille sur un autre domaine
 *     qui bloquait l'affichage, puis des fichiers découverts après elle ;
 *  5. deux feuilles de style qui ne touchent pas le premier écran
 *     (sections sous le hero, bandeau masqué) mais le bloquaient.
 *
 * Lancer : npm test   (ou : node --test test/vitesse-accueil.test.mjs)
 * ============================================================
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { DEBUT, FIN } from "../scripts/precharger.mjs";
import { manquants, DOSSIERS } from "../scripts/formats-modernes.mjs";
import { sourcesModernes, resolveScholarshipImage } from "../js/scholarship-image.js";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(path.join(RACINE, f), "utf8").replace(/\r\n/g, "\n");
const sansCommentairesCss = (css) => css.replace(/\/\*[\s\S]*?\*\//g, "");
const sansCommentairesJs = (js) => js.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

/** Profondeur d'accolades à une position : 0 = règle de base, hors @media. */
function profondeur(css, index) {
  let n = 0;
  for (let i = 0; i < index; i++) {
    if (css[i] === "{") n++;
    else if (css[i] === "}") n--;
  }
  return n;
}

// ------------------------------------------------------------------
// 1. Le titre du hero s'affiche dès le premier rendu
// ------------------------------------------------------------------

test("vitesse 1 — le texte du hero n'attend aucun script pour s'afficher", () => {
  const css = sansCommentairesCss(lire("css/hero.css"));
  const regle = /html\.js-ready \.hero \.reveal\{\s*opacity:1;\s*transform:none;\s*transition:none;\s*\}/;
  const m = regle.exec(css);
  assert.ok(m, "css/hero.css ne neutralise plus .reveal dans le hero");
  assert.equal(profondeur(css, m.index), 0, "la règle doit valoir partout, pas dans un @media");
  // Elle doit l'emporter sur l'état masqué de css/animations.css.
  assert.match(sansCommentairesCss(lire("css/animations.css")), /html\.js-ready \.reveal\{\s*opacity:0;/);
  // Le titre est bien dans le hero.
  const html = lire("index.html");
  const hero = html.slice(html.indexOf('<section class="hero">'), html.indexOf("</section>", html.indexOf('<section class="hero">')));
  assert.match(hero, /<h1 class="hero-title reveal hero-stagger">/);
});

// ------------------------------------------------------------------
// 2. Firebase hors du chemin critique
// ------------------------------------------------------------------

test("vitesse 2 — l'accueil ne précharge ni Firebase ni les modules qui en dépendent", () => {
  const html = lire("index.html");
  const i = html.indexOf(DEBUT), j = html.indexOf(FIN);
  assert.ok(i > -1 && j > i, "le bloc de préchargement a disparu");
  const bloc = html.slice(i, j);
  for (const interdit of ["gstatic.com", "firebase-config.js", "js/analytics.js", "js/access-guard.js", "js/admin-access.js"]) {
    assert.ok(!bloc.includes(interdit), `l'accueil précharge ${interdit}`);
  }
  // Plus aucun module d'entrée qui tirerait Firebase au chargement.
  assert.ok(!/<script type="module" src="js\/admin-access\.js"><\/script>/.test(html), "admin-access.js est redevenu un module d'entrée");
  assert.ok(!/^import \{ resolveSession \}/m.test(html), "access-guard.js est redevenu un import statique");
});

test("vitesse 3 — la session n'est vérifiée que si le navigateur en garde une trace, et la redirection est intacte", () => {
  const html = lire("index.html");
  const debut = html.indexOf('const CLE_SESSION = "firebase:authUser:";');
  assert.ok(debut > -1 && html.indexOf("function sessionMemorisee()") > debut, "la recherche de trace de session a disparu");
  const script = html.slice(debut, html.indexOf("</script>", debut));
  // Les trois endroits où Firebase range une session.
  assert.match(script, /const CLE_SESSION = "firebase:authUser:";/);
  assert.match(script, /localStorage/);
  assert.match(script, /sessionStorage/);
  assert.match(script, /indexedDB\.open\("firebaseLocalStorageDb"\)/);
  // La base n'est jamais créée par la lecture.
  assert.match(script, /onupgradeneeded = \(\) => demande\.transaction\.abort\(\);/);
  // Dans le doute, comportement d'avant.
  assert.match(script, /setTimeout\(\(\) => reponse\(true\), 1500\);/);
  // Trace trouvée : la vérification et la pastille, comme avant.
  assert.match(script, /if \(await sessionMemorisee\(\)\) \{/);
  assert.match(script, /import\("\.\/js\/access-guard\.js"\)/);
  assert.match(script, /window\.location\.replace\("dashboard\.html"\)/);
  assert.match(script, /import\("\.\/js\/admin-access\.js"\)/);
});

test("vitesse 4 — le catalogue et le suivi ne tirent plus Firebase au chargement", () => {
  const catalogue = sansCommentairesJs(lire("js/catalog-data.js"));
  assert.ok(!/^import [^;]*firebase/m.test(catalogue), "js/catalog-data.js importe de nouveau Firebase au chargement");
  // Firestore reste le repli, chargé seulement s'il sert.
  assert.match(catalogue, /import\("\.\.\/firebase-config\.js"\)/);
  assert.match(catalogue, /import\("https:\/\/www\.gstatic\.com\/firebasejs\/11\.10\.0\/firebase-firestore\.js"\)/);

  const teaser = sansCommentairesJs(lire("js/homepage-teaser.js"));
  assert.ok(!/^import [^;]*analytics\.js/m.test(teaser), "js/homepage-teaser.js importe de nouveau analytics.js au chargement");
  assert.match(teaser, /import\("\.\/analytics\.js"\)/);
  // La visite est toujours signalée, une fois la page affichée.
  assert.match(teaser, /window\.addEventListener\("load", lancer, \{ once: true \}\)/);
  assert.match(teaser, /m\.trackVisitOnce\(\)/);
});

// ------------------------------------------------------------------
// 3. Photos du bandeau en AVIF et WebP
// ------------------------------------------------------------------

test("vitesse 5 — chaque photo du catalogue a ses jumeaux AVIF et WebP", () => {
  for (const dossier of DOSSIERS) assert.ok(existsSync(path.join(RACINE, dossier)), `${dossier} introuvable`);
  const liste = manquants(RACINE);
  assert.deepEqual(liste.slice(0, 10).map((m) => m.cible), [],
    `${liste.length} fichier(s) manquant(s) — lancer : node scripts/formats-modernes.mjs`);
});

test("vitesse 6 — sourcesModernes ne promet que des fichiers qui existent", () => {
  const bourse = resolveScholarshipImage({ pays: "Royaume-Uni", texteHash: "x", universiteImage: null, bourseImage: "chevening-scholarships.jpg" });
  assert.deepEqual(sourcesModernes(bourse.image), {
    avif: "assets/images/scholarships/chevening-scholarships-400w.avif 400w, assets/images/scholarships/chevening-scholarships-800w.avif 800w",
    webp: "assets/images/scholarships/chevening-scholarships-400w.webp 400w, assets/images/scholarships/chevening-scholarships-800w.webp 800w"
  });
  const ville = resolveScholarshipImage({ pays: "Italie", texteHash: "x", universiteImage: null, bourseImage: null });
  assert.match(sourcesModernes(ville.image).avif, /^assets\/images\/cities\/rome-400w\.avif 400w, /);
  // Les replis génériques (hero-bg*) n'ont pas tous leurs jumeaux :
  // aucun <source>, le JPEG seul.
  const generique = resolveScholarshipImage({ pays: "Nulle part", texteHash: "x", universiteImage: null, bourseImage: null });
  assert.equal(sourcesModernes(generique.image), null);
  assert.equal(sourcesModernes(""), null);
  assert.equal(sourcesModernes(undefined), null);
});

test("vitesse 7 — le bandeau sert AVIF, puis WebP, puis JPEG", () => {
  const js = lire("js/opportunites-bandeau.js");
  assert.match(js, /import \{ resolveScholarshipImage, sourcesModernes \} from "\.\/scholarship-image\.js";/);
  const i = js.indexOf("<picture>"), j = js.indexOf("</picture>");
  assert.ok(i > -1 && j > i, "le bandeau n'utilise plus <picture>");
  const bloc = js.slice(js.indexOf("const sources = modernes"), j);
  assert.ok(bloc.indexOf('type="image/avif"') < bloc.indexOf('type="image/webp"'), "l'AVIF doit passer avant le WebP");
  assert.ok(bloc.indexOf('type="image/webp"') < bloc.indexOf("<img "), "le JPEG reste le dernier recours");
  assert.match(bloc, /loading="lazy"/);
  // Le <picture> prend la hauteur du cadre.
  assert.match(sansCommentairesCss(lire("css/opportunites.css")), /\.opportunite-media picture\{\s*display:block;\s*height:100%;\s*\}/);
});

// ------------------------------------------------------------------
// 4. Lot A-bis — les polices du titre, hébergées sur le site
// ------------------------------------------------------------------

/** Le <head> de l'accueil, commentaires HTML retirés. */
function teteDeLAccueil() {
  const html = lire("index.html");
  return html.slice(0, html.indexOf("</head>")).replace(/<!--[\s\S]*?-->/g, "");
}

test("vitesse 8 — l'accueil n'attend plus Google Fonts : ses polices viennent du site", () => {
  const tete = teteDeLAccueil();
  assert.ok(!/fonts\.googleapis\.com|fonts\.gstatic\.com/.test(tete), "l'accueil charge de nouveau ses polices chez Google");
  const faces = [...tete.matchAll(/@font-face\{([^}]*)\}/g)].map((m) => m[1]);
  assert.equal(faces.length, 9, "trois familles/styles × trois alphabets");
  for (const f of faces) {
    assert.match(f, /font-display:swap;/, "texte toujours visible pendant le chargement");
    assert.match(f, /unicode-range:/, "un alphabet par fichier, comme chez Google");
    const url = /src:url\(([^)]+)\) format\("woff2"\)/.exec(f);
    assert.ok(url, "chaque police est un woff2 local");
    assert.ok(url[1].startsWith("assets/fonts/"), url[1]);
    assert.ok(existsSync(path.join(RACINE, url[1])) && statSync(path.join(RACINE, url[1])).size > 1000, `${url[1]} absent ou vide`);
  }
  // Ce que la page demandait à Google : Newsreader 400 à 800 et son italique
  // 500, Public Sans 400 à 800.
  const descr = faces.map((f) => /font-family:"([^"]+)";font-style:(\w+);font-weight:([^;]+);/.exec(f).slice(1).join(" "));
  for (const attendu of ["Newsreader italic 500", "Newsreader normal 400 800", "Public Sans normal 400 800"]) {
    assert.equal(descr.filter((d) => d === attendu).length, 3, `${attendu} : un bloc par alphabet`);
  }
  // La licence (SIL OFL 1.1) et la provenance sont écrites dans ASSETS.md :
  // assets/ ne publie aucun .txt (scripts/hosting-publie.mjs).
  const doc = lire("ASSETS.md");
  assert.match(doc, /## Les polices de l'accueil/);
  assert.match(doc, /SIL OPEN FONT LICENSE Version 1\.1/);
  assert.match(doc, /The Newsreader Project Authors/);
  assert.match(doc, /The Public Sans Project Authors/);
});

test("vitesse 9 — les deux fichiers du titre partent dès l'arrivée, et ce sont ceux qu'il utilise", () => {
  const tete = teteDeLAccueil();
  const precharges = [...tete.matchAll(/<link rel="preload" href="([^"]+)" as="font" type="font\/woff2" crossorigin>/g)].map((m) => m[1]);
  assert.deepEqual(precharges, ["assets/fonts/newsreader-latin-wght-normal.woff2", "assets/fonts/newsreader-latin-italic-500.woff2"]);
  for (const f of precharges) {
    // Un préchargement qui ne correspond à aucune @font-face serait téléchargé deux fois.
    assert.ok(tete.includes(`src:url(${f}) format("woff2")`), `${f} préchargé mais déclaré nulle part`);
  }
  // Pas plus : chaque préchargement dispute la bande passante à la photo.
  assert.equal((tete.match(/rel="preload"/g) || []).length, 2);
});

// ------------------------------------------------------------------
// 5. Lot A-bis — seules les feuilles du premier écran bloquent
// ------------------------------------------------------------------

test("vitesse 10 — sections et bandeau ne bloquent plus le premier affichage, à leur place dans la cascade", () => {
  const tete = teteDeLAccueil();
  const liens = [...tete.matchAll(/<link rel="stylesheet" href="(css\/[^"]+)"([^>]*)>/g)].map((m) => ({ href: m[1], reste: m[2] }));
  const ordre = [...new Set(liens.map((l) => l.href))];
  // L'ordre des feuilles EST la cascade : il ne bouge pas.
  assert.deepEqual(ordre, ["css/base.css", "css/header.css", "css/hero.css", "css/homepage-sections.css", "css/opportunites.css", "css/animations.css", "css/homepage-typography.css", "css/homepage-redesign.css", "css/mobile-nav.css", "css/vivant.css"]);
  const differees = ["css/homepage-sections.css", "css/opportunites.css"];
  for (const l of liens) {
    const differee = / media="print" onload="this\.media='all'"/.test(l.reste);
    const dansNoscript = new RegExp(`<noscript><link rel="stylesheet" href="${l.href.replace(/[./]/g, "\\$&")}"></noscript>`).test(tete);
    if (differees.includes(l.href)) {
      assert.ok(differee || dansNoscript, `${l.href} : ni différée ni en <noscript>`);
    } else {
      // Toutes les autres stylent l'en-tête ou le hero : elles doivent bloquer,
      // sinon le premier écran s'afficherait sans elles.
      assert.ok(!differee, `${l.href} ne doit pas être différée : elle style le premier écran`);
    }
  }
  for (const f of differees) {
    assert.ok(new RegExp(`<link rel="stylesheet" href="${f.replace(/[./]/g, "\\$&")}" media="print" onload="this\.media='all'">`).test(tete), `${f} n'est plus différée`);
    assert.ok(tete.includes(`<noscript><link rel="stylesheet" href="${f}"></noscript>`), `${f} : repli sans JavaScript absent`);
  }
});
