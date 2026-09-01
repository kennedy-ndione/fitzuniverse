// INCOMPLET — ne produit que du JPEG (voir ASSETS.md).
// Les variantes WebP et AVIF servies par les <picture> du site ne sont
// PAS reconstruites ici, et aucun autre script ne les reconstruit à
// partir des originaux locaux : les seuls qui en produisent sont ceux
// des lots, qui re-téléchargent depuis Unsplash une liste codée en dur.
// C'est pourquoi les variantes sont versionnées au lieu d'être traitées
// comme des artefacts. Un scripts/regenerate-all-variants.mjs couvrant
// les trois formats lèverait cette dette.
// Régénère toutes les images de villes avec une qualité JPEG supérieure (85 au lieu de 78)
import { readdir } from "node:fs/promises";
import { extname, basename, join } from "node:path";
import sharp from "sharp";

const DIR = "assets/images/cities";
const WIDTHS = [400, 800, 1200, 1600];
const QUALITY = 92; // Qualité quasi sans perte (était 78, puis 85)

const files = (await readdir(DIR)).filter((f) => /\.jpe?g$/i.test(f) && !/-\d+w\.jpg$/i.test(f));

console.log(`🌍 Régénération de ${files.length} images de villes...\n`);

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
    await sharp(input)
      .resize({ width, withoutEnlargement: true })
      .jpeg({ quality: QUALITY, mozjpeg: true })
      .toFile(output);
    console.log(`✅ ${base} → ${width}px`);
  }
}

console.log(`\n✨ Toutes les images de villes sont maintenant en meilleure qualité (Q${QUALITY})!`);
