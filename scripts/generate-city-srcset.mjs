// INCOMPLET — ne produit que du JPEG (voir ASSETS.md).
// Les variantes WebP et AVIF servies par les <picture> du site ne sont
// PAS reconstruites ici, et aucun autre script ne les reconstruit à
// partir des originaux locaux : les seuls qui en produisent sont ceux
// des lots, qui re-téléchargent depuis Unsplash une liste codée en dur.
// C'est pourquoi les variantes sont versionnées au lieu d'être traitées
// comme des artefacts. Un scripts/regenerate-all-variants.mjs couvrant
// les trois formats lèverait cette dette.
// Génère des variantes de largeur (400/800/1200px) pour chaque photo de
// ville, consommées via srcset par js/homepage-teaser.js — les cartes
// de l'aperçu (133 à 571px de large selon le slot bento) chargeaient
// jusqu'ici la même image ~2000px/300-580KB quelle que soit leur
// taille réelle à l'écran. Lancé une fois manuellement (pas de build
// step dans ce dépôt), pas un script à ré-exécuter en CI.
import { readdir } from "node:fs/promises";
import { extname, basename, join } from "node:path";
import sharp from "sharp";

const DIR = "assets/images/cities";
const WIDTHS = [400, 800, 1200, 1600];
const QUALITY = 92; // Qualité quasi sans perte (était 78, puis 85)

const files = (await readdir(DIR)).filter((f) => /\.jpe?g$/i.test(f) && !/-\d+w\.jpg$/i.test(f));

for (const file of files) {

const base = basename(file, extname(file));
const input = join(DIR, file);
const meta = await sharp(input).metadata();

for (const width of WIDTHS) {

// withoutEnlargement : le fichier -Nw.jpg doit toujours exister (le
// srcset dans homepage-teaser.js le référence sans condition), sinon
// une source plus petite que N provoque un 404 silencieux sur ce
// candidat srcset plutôt qu'un repli propre sur une autre taille.
const output = join(DIR, `${base}-${width}w.jpg`);
await sharp(input).resize({ width, withoutEnlargement: true }).jpeg({ quality: QUALITY, mozjpeg: true }).toFile(output);
console.log(`${output} (${meta.width}px -> ${width}px, Q${QUALITY})`);

}

}
