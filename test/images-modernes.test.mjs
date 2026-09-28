/**
* Lot PERF 3G (2026-09-28) — l'AVIF et le WebP sur les cartes et les fiches,
* sans rien changer à la netteté.
*
* Mesuré le 28/09 : sur scholarships.html, les quatre premières photos de
* bourses pesaient 564 Ko en JPEG, 194 Ko en AVIF (même 800 px). Les
* jumeaux AVIF/WebP n'existent qu'en 400 et 800 px : un <source> sans
* condition servirait donc 800 px là où le JPEG en donne 1 200 (écrans
* 3x). La condition `media` de mediaModernes() l'empêche — ce fichier le
* prouve contre les DEUX façons de choisir une variante :
*   - WebKit (Safari, tous les navigateurs d'iPhone) : la première
*     variante dont la densité atteint celle de l'écran ;
*   - Chromium : la même, sauf si la précédente est « assez proche »
*     (moyenne géométrique des deux densités au-dessus de celle de l'écran).
* Pour chaque largeur d'écran de 300 à 1 920 px et chaque densité de 1 à
* 4 : si le <source> moderne s'applique, les deux moteurs y choisissent
* EXACTEMENT la largeur qu'ils auraient prise dans le JPEG.
*
* Preuves par mutation (2026-09-28) : LARGEUR_MAX_MODERNE passée à 1 000
* → tests 1 et 1 bis rouges (écrans 2,5x servis en 800 au lieu de 1 200) ;
* la condition `media` retirée de sourcesPicture → test 1 bis rouge.
*/
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { mediaModernes, sourcesPicture, sourcesModernes, resolveScholarshipImage, resolveCityImage, LARGEUR_MAX_MODERNE } from "../js/scholarship-image.js";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(path.join(RACINE, f), "utf8");
const sansCommentaires = (s) => s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:"'`\\])\/\/.*$/gm, "$1");

// Les `sizes` du site qui reçoivent des <source> modernes.
const TAILLES = {
  "cartes de bourses (scholarships.js)": "(max-width:640px) 100vw, (max-width:1024px) 50vw, 380px",
  "cartes d'universités (universities-page.js)": "(max-width:640px) 100vw, (max-width:1024px) 50vw, 360px",
  "vignettes des résultats (results.js)": "44px",
  "couvertures des fiches (details.js, universite-page.js)": "100vw"
};

// ---- un petit évaluateur des deux syntaxes en jeu ----

function largeurEmplacement(sizes, vw) {
  for (const entree of sizes.split(",")) {
    const m = /^\s*(?:\(\s*max-width\s*:\s*(\d+)px\s*\)\s*)?(\d+(?:\.\d+)?)(px|vw)\s*$/.exec(entree);
    if (m[1] && vw > Number(m[1])) continue;
    return m[3] === "px" ? Number(m[2]) : (vw * Number(m[2])) / 100;
  }
  throw new Error(`sizes illisible : ${sizes}`);
}

function mediaVraie(media, vw, dpr) {
  if (media === "") return true;
  return media.split(",").some((clause) => clause.trim().split(/\s+and\s+/).every((c) => {
    const m = /^\((max-resolution|min-width|max-width)\s*:\s*([\d.]+)(dppx|px)\)$/.exec(c.trim());
    assert.ok(m, `condition inattendue : ${c}`);
    const v = Number(m[2]);
    if (m[1] === "max-resolution") return dpr <= v;
    if (m[1] === "min-width") return vw >= v;
    return vw <= v;
  }));
}

function choixWebKit(largeurs, emplacement, dpr) {
  const tri = [...largeurs].sort((a, b) => a - b);
  return tri.find((w) => w / emplacement >= dpr) ?? tri[tri.length - 1];
}

function choixChromium(largeurs, emplacement, dpr) {
  const tri = [...largeurs].sort((a, b) => a - b);
  const i = tri.findIndex((w) => w / emplacement >= dpr);
  if (i === -1) return tri[tri.length - 1];
  if (i > 0 && Math.sqrt((tri[i - 1] / emplacement) * (tri[i] / emplacement)) > dpr) return tri[i - 1];
  return tri[i];
}

const JPEG = [400, 800, 1200, 1600];
const MODERNES = [400, 800];
const LARGEURS_ECRAN = [];
for (let w = 300; w <= 1920; w += 5) LARGEURS_ECRAN.push(w);
const DENSITES = [1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.625, 2.75, 3, 3.5, 4];

test("images modernes 1 — quand le <source> AVIF/WebP s'applique, la largeur choisie est celle du JPEG, dans les deux moteurs", () => {
  assert.equal(LARGEUR_MAX_MODERNE, 800, "les jumeaux s'arrêtent à 800 px (scripts/formats-modernes.mjs)");
  for (const [ou, sizes] of Object.entries(TAILLES)) {
    const media = mediaModernes(sizes);
    assert.notEqual(media, null, `${ou} : aucune condition calculée`);
    let servis = 0;
    for (const vw of LARGEURS_ECRAN) {
      for (const dpr of DENSITES) {
        if (!mediaVraie(media, vw, dpr)) continue;
        servis++;
        const s = largeurEmplacement(sizes, vw);
        for (const [moteur, choix] of [["WebKit", choixWebKit], ["Chromium", choixChromium]]) {
          const jpeg = choix(JPEG, s, dpr);
          const moderne = choix(MODERNES, s, dpr);
          assert.equal(moderne, jpeg, `${ou} @${vw}px ×${dpr} (${moteur}) : ${moderne} en AVIF au lieu de ${jpeg} en JPEG`);
        }
      }
    }
    assert.ok(servis > 0, `${ou} : l'AVIF ne serait jamais servi`);
  }
});

test("images modernes 1 bis — les téléphones visés reçoivent bien l'AVIF, les écrans 3x gardent leur JPEG", () => {
  const cartes = mediaModernes(TAILLES["cartes de bourses (scholarships.js)"]);
  // Téléphones d'entrée de gamme (720 × 1 600 → 360 px en 2x), iPhone SE,
  // et le profil de la mesure 3G (390 px en 2x) : AVIF.
  for (const [vw, dpr] of [[360, 2], [375, 2], [390, 2], [360, 1.5], [412, 1.5]]) assert.ok(mediaVraie(cartes, vw, dpr), `${vw}px ×${dpr}`);
  // Écrans 3x et 2,625x : la variante 1 200 du JPEG, comme avant.
  for (const [vw, dpr] of [[390, 3], [412, 2.625], [430, 3], [360, 3]]) assert.ok(!mediaVraie(cartes, vw, dpr), `${vw}px ×${dpr}`);
  // Ordinateur (emplacement de 380 px) : AVIF jusqu'à 2x.
  assert.ok(mediaVraie(cartes, 1366, 1) && mediaVraie(cartes, 1440, 2) && !mediaVraie(cartes, 1440, 3));
  // La vignette de 44 px : toujours.
  assert.equal(mediaModernes("44px"), "");
  // Un sizes que le module ne sait pas lire : jamais de <source> moderne.
  assert.equal(mediaModernes("calc(100vw - 32px)"), null);
  assert.equal(mediaModernes("(min-width:640px) 50vw, 100vw"), null);
  // Et sourcesPicture pose la condition sur les DEUX <source>.
  const html = sourcesPicture("assets/images/scholarships/chevening-scholarships-800w.jpg", TAILLES["cartes de bourses (scholarships.js)"]);
  assert.equal((html.match(/ media="\(max-resolution: 1dppx\)/g) || []).length, 2);
  assert.match(html, /^<source hidden type="image\/avif" media="[^"]+" srcset="[^"]+-400w\.avif 400w, [^"]+-800w\.avif 800w" sizes="\(max-width:640px\) 100vw, \(max-width:1024px\) 50vw, 380px"><source hidden type="image\/webp"/);
});

test("images modernes 2 — chaque photo du catalogue a ses jumeaux, et les replis n'en réclament pas", () => {
  const catalogue = JSON.parse(lire("assets/data/catalogue-liste.json"));
  const photos = new Set();
  for (const s of catalogue.scholarships) {
    photos.add(resolveScholarshipImage({ pays: s.country, texteHash: s.title || s.id, universiteImage: null, bourseImage: s.image || null }).image);
  }
  for (const u of catalogue.universities) photos.add(resolveCityImage(u.image).src);
  let modernes = 0;
  for (const image of photos) {
    const m = sourcesModernes(image);
    if (!m) { assert.equal(sourcesPicture(image, "44px"), "", `${image} : un repli sans jumeaux ne doit pas avoir de <source>`); continue; }
    modernes++;
    for (const url of [...m.avif.split(", "), ...m.webp.split(", ")].map((c) => c.split(" ")[0])) {
      assert.ok(existsSync(path.join(RACINE, url)), `${url} manque : un <source> vers un fichier absent casse l'image`);
    }
  }
  assert.ok(modernes > 300, `${modernes} photos seulement ont leurs jumeaux`);
});

test("images modernes 3 — les pages posent les <source> avec le MÊME sizes que l'<img>, et le repli les retire", () => {
  const cartes = sansCommentaires(lire("scholarships.js"));
  assert.match(cartes, /const TAILLES_CARTE = "\(max-width:640px\) 100vw, \(max-width:1024px\) 50vw, 380px";/);
  assert.match(cartes, /sizes="\$\{TAILLES_CARTE\}"/);
  assert.match(cartes, /sourcesPicture\(scholarship\.image, TAILLES_CARTE\)/);
  assert.match(cartes, /<picture>\$\{sourcesModernesCarte\}\$\{photoCarte\}<\/picture>/);

  const unis = sansCommentaires(lire("universities-page.js"));
  assert.match(unis, /sourcesPicture\(cityPhoto\.src, TAILLES_CARTE\)/);
  assert.match(unis, /sizes="\$\{TAILLES_CARTE\}"/);
  assert.match(unis, /onerror="this\.onerror=null;if\(this\.parentNode\.tagName==='PICTURE'\)this\.parentNode\.querySelectorAll\('source'\)\.forEach\(function\(s\)\{s\.remove\(\)\}\);/);

  const resultats = sansCommentaires(lire("results.js"));
  assert.match(resultats, /sourcesPicture\(scholarship\.photo\.src, "44px"\)/);
  assert.match(resultats, /sizes="44px"[^`]*querySelectorAll\('source'\)/);

  // Des <source> sans boîte : sinon, dans un conteneur flex à `gap`, chacun
  // ajoute un écart (la vignette de results.html bougeait de 28 px).
  assert.match(lire("js/scholarship-image.js"), /const s = doc\.createElement\("source"\);\s*s\.hidden = true;/);

  // Les couvertures : les <source> AVANT la source de l'image (sinon deux
  // téléchargements), et le repli qui les retire.
  for (const [f, img] of [["details.js", "cityImage"], ["universite-page.js", "img"]]) {
    const js = sansCommentaires(lire(f));
    const iSources = js.indexOf(`poserSourcesModernes(${img}, photo.src, "100vw");`);
    const iSrc = js.indexOf(`${img}.src = photo.src;`);
    const iSrcset = js.indexOf(`${img}.srcset = photo.srcset;`);
    assert.ok(iSources > -1 && iSources < iSrc && iSources < iSrcset, `${f} : les <source> doivent précéder src et srcset`);
    assert.match(js, new RegExp(`retirerSourcesModernes\\(${img}\\);\\s*${img}\\.removeAttribute\\("srcset"\\)`));
  }
});

test("images modernes 4 — la couche « vivant » suit la photo dans son <picture>, sans s'élargir aux drapeaux", () => {
  const css = lire("css/vivant.css");
  for (const media of ["scholarship-card-media", "uni-card-media"]) {
    assert.ok(css.includes(`html.vivant .${media} > picture > img,`) || css.includes(`html.vivant .${media} > picture > img {`), `${media} > picture > img`);
    assert.ok(css.includes(`.${media} > picture > img.est-chargee`));
  }
  assert.ok(!/card-media\s+img/.test(css.replace(/\/\*[\s\S]*?\*\//g, "").split("§4")[0].split("§3")[1] || ""), "jamais le sélecteur large");
  assert.match(lire("js/vivant.js"), /var SELECTEUR_IMAGES = "\.scholarship-card-media > img, \.uni-card-media > img, \.scholarship-card-media > picture > img, \.uni-card-media > picture > img";/);
});

test("images modernes 5 — sous la ligne de flottaison, les photos restent différées", () => {
  for (const f of ["scholarships.js", "universities-page.js"]) {
    const js = sansCommentaires(lire(f));
    assert.match(js, /if \(i < 2 && img\.getBoundingClientRect\(\)\.top < hauteurEcran\) \{\s*img\.loading = "eager";/, `${f} : la priorité haute seulement au-dessus de la ligne de flottaison`);
    assert.ok(!/if \(i < 2\) \{\s*img\.loading = "eager"/.test(js), `${f} : plus de priorité haute sans condition`);
  }
  // Les photos des cartes et des vignettes partent en `lazy`.
  assert.match(lire("scholarships.js"), /const photoCarte = `<img [^`]*loading="lazy"/);
  assert.match(lire("universities-page.js"), /const imgCarte = `<img [^`]*loading="lazy"/);
  assert.match(lire("results.js"), /const vignette = `<img class="opportunity-thumb"[^`]*loading="lazy"/);
});
