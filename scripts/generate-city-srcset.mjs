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
const WIDTHS = [400, 800, 1200];

const files = (await readdir(DIR)).filter((f) => /\.jpe?g$/i.test(f) && !/-\d+w\.jpg$/i.test(f));

for (const file of files) {

const base = basename(file, extname(file));
const input = join(DIR, file);
const meta = await sharp(input).metadata();

for (const width of WIDTHS) {

if (meta.width && meta.width <= width) continue;

const output = join(DIR, `${base}-${width}w.jpg`);
await sharp(input).resize({ width }).jpeg({ quality: 78, mozjpeg: true }).toFile(output);
console.log(`${output} (${meta.width}px -> ${width}px)`);

}

}
