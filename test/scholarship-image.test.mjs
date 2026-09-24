/**
 * ============================================================
 * Tests unitaires — cascade photo d'une bourse
 * (js/scholarship-image.js : resolveScholarshipImage)
 * ============================================================
 *
 * Lancer : npm test   (ou : node --test test/)
 *
 * Premier test de cette cascade (lot 24). Les quatre étages sont
 * verrouillés — pas seulement les deux entrées Royaume-Uni/Russie
 * ajoutées par le lot : c'est l'ordre de préséance et la forme des URLs
 * qui protègent l'étudiant, pas une entrée de table isolée.
 *
 * Règle transverse : ni `image` ni aucune URL de `srcset` ne pointe
 * JAMAIS vers un fichier d'origine non redimensionné (london.jpg pèse
 * 2,2 Mo, moscow.jpg 3,3 Mo) — c'est exactement le défaut « catalogue
 * servi en taille d'origine » corrigé le 2026-08-29.
 * ============================================================
 */

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import {
resolveScholarshipImage,
COUNTRY_FALLBACK_IMAGE,
GENERIC_FALLBACK_IMAGES
} from "../js/scholarship-image.js";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");

// Toute URL produite doit porter un suffixe de largeur — jamais le
// fichier source brut.
const URL_VARIANTE = /^assets\/images\/(?:cities\/|scholarships\/)?[a-z0-9-]+-(400|800|1200|1600)w\.jpg$/;

function verifierVariantes({ image, imageSrcset }, largeursAttendues) {
assert.match(image, URL_VARIANTE, `src sans suffixe de largeur : ${image}`);
const entrees = imageSrcset.split(", ").map((e) => e.split(" "));
assert.deepEqual(entrees.map(([, w]) => w), largeursAttendues.map((w) => `${w}w`));
for (const [url] of entrees) {
assert.match(url, URL_VARIANTE, `srcset contient un fichier d'origine : ${url}`);
}
}

// ------------------------------------------------------------
// Étage 1 — photo propre à la bourse
// ------------------------------------------------------------

test("étage 1 : bourseImage prime sur tout le reste", () => {
const r = resolveScholarshipImage({ pays: "Royaume-Uni", texteHash: "x", universiteImage: "oxford.jpg", bourseImage: "chevening.jpg" });
assert.equal(r.image, "assets/images/scholarships/chevening-800w.jpg");
verifierVariantes(r, [400, 800, 1200, 1600]);
assert.ok(r.imageSrcset.includes("assets/images/scholarships/chevening-400w.jpg 400w"));
});

// ------------------------------------------------------------
// Étage 2 — photo de l'université liée
// ------------------------------------------------------------

test("étage 2 : sans bourseImage, la photo de l'université liée", () => {
const r = resolveScholarshipImage({ pays: "Royaume-Uni", texteHash: "x", universiteImage: "oxford.jpg", bourseImage: null });
assert.equal(r.image, "assets/images/cities/oxford-800w.jpg");
verifierVariantes(r, [400, 800, 1200, 1600]);
});

// ------------------------------------------------------------
// Étage 3 — capitale du pays, dont les deux entrées du lot 24
// ------------------------------------------------------------

test("étage 3 : Royaume-Uni -> Londres (lot 24 — les 3 bourses Commonwealth quittent le fond générique)", () => {
const r = resolveScholarshipImage({ pays: "Royaume-Uni", texteHash: "commonwealth-masters-scholarships", universiteImage: null, bourseImage: null });
assert.equal(r.image, "assets/images/cities/london-800w.jpg");
verifierVariantes(r, [400, 800, 1200, 1600]);
});

test("étage 3 : Russie -> Moscou (lot 24 — spbu-open-olympiad quitte le fond générique)", () => {
const r = resolveScholarshipImage({ pays: "Russie", texteHash: "spbu-open-olympiad", universiteImage: null, bourseImage: null });
assert.equal(r.image, "assets/images/cities/moscow-800w.jpg");
verifierVariantes(r, [400, 800, 1200, 1600]);
});

test("étage 3 : une entrée historique (Italie -> Rome) inchangée", () => {
const r = resolveScholarshipImage({ pays: "Italie", texteHash: "x", universiteImage: null, bourseImage: null });
assert.equal(r.image, "assets/images/cities/rome-800w.jpg");
verifierVariantes(r, [400, 800, 1200, 1600]);
});

test("les 8 variantes Londres/Moscou existent réellement sur le disque — pas seulement dans la table", () => {
for (const base of ["london", "moscow"]) {
for (const w of [400, 800, 1200, 1600]) {
const chemin = join(racine, "assets", "images", "cities", `${base}-${w}w.jpg`);
assert.ok(existsSync(chemin), `fichier manquant : ${chemin}`);
}
}
});

test("chaque entrée de COUNTRY_FALLBACK_IMAGE a ses 4 variantes sur le disque", () => {
for (const [pays, fichier] of Object.entries(COUNTRY_FALLBACK_IMAGE)) {
const base = fichier.replace(/\.jpe?g$/i, "");
for (const w of [400, 800, 1200, 1600]) {
const chemin = join(racine, "assets", "images", "cities", `${base}-${w}w.jpg`);
assert.ok(existsSync(chemin), `${pays} : fichier manquant ${chemin}`);
}
}
});

// ------------------------------------------------------------
// Étage 4 — hero générique, atteint uniquement si le pays est inconnu
// ------------------------------------------------------------

test("étage 4 : atteint uniquement quand le pays est absent de la table", () => {
const r = resolveScholarshipImage({ pays: "Atlantide", texteHash: "bourse-imaginaire", universiteImage: null, bourseImage: null });
assert.match(r.image, /^assets\/images\/hero-bg[0-9]?-800w\.jpg$/);
verifierVariantes(r, [400, 800, 1200]);
// Déterministe : le même texteHash redonne toujours le même fond.
const r2 = resolveScholarshipImage({ pays: "Atlantide", texteHash: "bourse-imaginaire", universiteImage: null, bourseImage: null });
assert.equal(r2.image, r.image);
// Et le fichier choisi vient bien de la liste des génériques.
const bases = GENERIC_FALLBACK_IMAGES.map((f) => f.replace(/\.jpe?g$/i, ""));
assert.ok(bases.some((b) => r.image === `assets/images/${b}-800w.jpg`));
});

test("étage 4 : chaque fond générique existe et est crédité (2026-09-24)", () => {
const credits = readFileSync(new URL("../CREDITS.md", import.meta.url), "utf8");
assert.ok(GENERIC_FALLBACK_IMAGES.length >= 3);
for (const f of GENERIC_FALLBACK_IMAGES) {
// hero-bg.jpg (disparu du disque) et hero-bg2.jpg (source introuvable)
// ne doivent plus revenir : un fond générique sans crédit n'a pas sa place.
assert.match(credits, new RegExp("### `" + f.replace(/[.]/g, "\\.") + "`"), `${f} n'est pas crédité dans CREDITS.md`);
}
assert.ok(!GENERIC_FALLBACK_IMAGES.includes("hero-bg.jpg"));
assert.ok(!GENERIC_FALLBACK_IMAGES.includes("hero-bg2.jpg"));
});

test("étage 4 : plus jamais atteint pour le Royaume-Uni ni la Russie (le défaut corrigé)", () => {
for (const pays of ["Royaume-Uni", "Russie"]) {
const r = resolveScholarshipImage({ pays, texteHash: "x", universiteImage: null, bourseImage: null });
assert.ok(!r.image.includes("hero-bg"), `${pays} retombe encore sur un fond générique : ${r.image}`);
}
});
