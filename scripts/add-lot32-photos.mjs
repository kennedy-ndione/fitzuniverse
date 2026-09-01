// ============================================================
// FitzUniverse — photos du lot 32 (Italie, Suisse, Russie — 2026-08-31)
//
// Onze photos de ville pour les onze universités du lot, déclinées aux
// largeurs attendues par resolveCityImage() (js/scholarship-image.js) :
// référence 2000px + 400/800/1200/1600w en JPEG q92 mozjpeg, plus AVIF
// et WebP. Jamais la taille d'origine servie.
//
// QUATRE VILLES ÉTAIENT DÉJÀ OCCUPÉES — c'est le point de vigilance de
// ce lot, et l'échec du lot 31 (deux fichiers distincts montrant la
// même colline de Kigali) :
//   - Milan : milan.jpg (Politecnico) et bocconi.jpg (le Duomo)
//             -> ici les Navigli, de nuit. Aucune confusion possible.
//             NOTE : milan.jpg montre en réalité VERNAZZA, dans les
//             Cinque Terre — donc la côte ligure. Raison de plus pour
//             que genes.jpg soit une vue de VILLE (toits et port) et
//             non un village côtier ligure de plus.
//   - Pise : pisa.jpg (Piazza dei Miracoli vue d'en haut, avec la tour)
//            -> ici les quais de l'Arno, sans la tour.
//   - Lausanne : lausanne.jpg (toits et lac, en automne)
//            -> ici le château d'Ouchy, au bord de l'eau.
//   - Genève reçoit DEUX établissements de ce lot : le jet d'eau vu du
//     lac (IHEID) et le pont du Mont-Blanc vu d'en haut (UNIGE).
//
// Chaque image a été REGARDÉE avant d'être retenue, chaque identifiant
// CDN vérifié absent de CREDITS.md (la garde a écarté trois candidates
// déjà utilisées : le front de mer de Trieste sert déjà à la bourse
// ARDiS, et deux vues suisses étaient prises), et chaque ratio mesuré :
// 1,33 minimum, la carte étant une fente d'environ 2:1 en
// object-fit:cover où un portrait perd son sujet.
// ============================================================

import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const WIDTHS = [400, 800, 1200, 1600];
const QUALITY = 92;
const DIR = "assets/images/cities";

const PHOTOS = [
{ base: "unimi-milan", cdn: "photo-1668784290849-aa5acd24edcd" },
{ base: "pavia", cdn: "photo-1751098663661-da1b55e7e91f" },
{ base: "genes", cdn: "photo-1693067038040-044640fad0f7" },
{ base: "bari", cdn: "photo-1564863756233-e90e6d2f264b" },
{ base: "trieste", cdn: "photo-1718553124786-473af4238076" },
{ base: "scuola-normale-pise", cdn: "photo-1540685889031-268df9f16803" },
{ base: "iheid-geneve", cdn: "photo-1667758682790-c58fa23dc76f" },
{ base: "fribourg", cdn: "photo-1782564173527-0f435c646e72" },
{ base: "unige-geneve", cdn: "photo-1584200463394-bba4b2117e4d" },
{ base: "unil-lausanne", cdn: "photo-1657557494887-59caee68dae8" },
{ base: "saint-petersbourg", cdn: "photo-1691583224443-1fefd0afaa51" }
];

const filtres = process.argv.slice(2);
const aTraiter = filtres.length ? PHOTOS.filter((p) => filtres.includes(p.base)) : PHOTOS;

for (const photo of aTraiter) {

const reponse = await fetch(`https://images.unsplash.com/${photo.cdn}?w=2000&q=85&fm=jpg`);
if (!reponse.ok) throw new Error(`${photo.base} : téléchargement refusé (${reponse.status})`);
const original = Buffer.from(await reponse.arrayBuffer());

const reference = await sharp(original).resize({ width: 2000, withoutEnlargement: true }).jpeg({ quality: QUALITY, mozjpeg: true }).toBuffer();
await writeFile(join(DIR, `${photo.base}.jpg`), reference);

const meta = await sharp(reference).metadata();
const ratio = meta.width / meta.height;

// Garde de ratio, appliquée au moment d'écrire : refuser tôt vaut
// mieux que découvrir un portrait recadré sur la grille.
if (ratio < 1.3) throw new Error(`${photo.base} : ratio ${ratio.toFixed(2)} < 1,3 — portrait refusé, la carte est une fente 2:1.`);

for (const width of WIDTHS) {
const pipeline = sharp(reference).resize({ width, withoutEnlargement: true });
await pipeline.clone().jpeg({ quality: QUALITY, mozjpeg: true }).toFile(join(DIR, `${photo.base}-${width}w.jpg`));
await pipeline.clone().webp({ quality: 85 }).toFile(join(DIR, `${photo.base}-${width}w.webp`));
await pipeline.clone().avif({ quality: 60 }).toFile(join(DIR, `${photo.base}-${width}w.avif`));
}

console.log(`${photo.base} : ${meta.width}x${meta.height} (ratio ${ratio.toFixed(2)}) + ${WIDTHS.length} largeurs × jpg/webp/avif`);

await new Promise((r) => setTimeout(r, 700));

}

console.log("\nLot 32 : photos prêtes. Les fichiers existent AVANT l'écriture du lot — un champ `image` renseigné sans fichier donne une carte cassée.");
