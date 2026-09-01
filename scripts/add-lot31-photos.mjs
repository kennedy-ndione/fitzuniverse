// ============================================================
// FitzUniverse — photos du lot 31 (Afrique, 2026-08-30)
//
// Télécharge les 13 photos du lot (12 universités dans
// assets/images/cities/, 1 bourse — Al-Azhar, orpheline volontaire —
// dans assets/images/scholarships/) puis génère les déclinaisons
// 400/800/1200/1600w attendues par resolveCityImage() /
// resolveScholarshipImage() (js/scholarship-image.js) : JPEG q92
// mozjpeg comme scripts/generate-city-srcset.mjs, plus AVIF et WebP.
//
// CHAQUE image a été REGARDÉE avant d'être retenue (règle n°1 du lot,
// après les quinze doublons du lot 25), chaque identifiant CDN vérifié
// absent de CREDITS.md avant téléchargement (garde du lot 26), et les
// auteurs/licences relevés — voir CREDITS.md, section lot 31.
//
// Volontairement limité aux 13 fichiers du lot : generate-city-srcset
// ré-encode TOUT le dossier cities/ à chaque exécution (voir son
// commentaire dans CREDITS.md), ce lot n'a aucune raison de toucher
// les quarante autres villes.
// ============================================================

import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const WIDTHS = [400, 800, 1200, 1600];
const QUALITY = 92; // même réglage que generate-city-srcset.mjs

const UA = "FitzUniverse-catalog/1.0 (charlendione30@gmail.com)";

// `source` : URL du fichier d'origine. Unsplash est plafonné à 2000px
// (largeur du fichier de référence, convention Benguerir/Louvain) ;
// les fichiers Commons arrivent en pleine résolution et sont ramenés
// à 2000px au moment d'écrire la référence.
// RÉVISION DU 2026-08-31 (relecture Cowork) : quatre photos remplacées.
//   - auc-cairo et al-azhar-cairo étaient en PORTRAIT (0,56 / 0,67) :
//     la fente ~2:1 de .scholarship-card-media (object-fit:cover,
//     158px de haut) n'en gardait qu'une bande centrale — felouque et
//     minarets coupés. Remplacées par le même sujet en PAYSAGE.
//   - alu-kigali et aims-kigali montraient LA MÊME SCÈNE (deux
//     collines aux toits orange) : fichiers distincts n'est pas images
//     distinctes. ALU passe sur une vue de nuit.
//   - cmu-africa-kigali (feu d'artifice, carré 1,00) : le dôme du KCC
//     en vue aérienne de jour — même repère, sans le Nouvel An.
// RÈGLE DES RATIOS, vérifiée sur chaque fichier : viser 1,5 (3:2) ou
// plus large, refuser tout ratio < 1,3.
const PHOTOS = [
{ base: "cmu-africa-kigali", dir: "assets/images/cities", source: "https://upload.wikimedia.org/wikipedia/commons/4/43/An_aerial_of_Kigali_Convention_Center_on_June_19%2C_2019._Photo_by_Emmanuel_Kwizera.jpg" },
{ base: "university-of-rwanda-kigali", dir: "assets/images/cities", source: "https://images.unsplash.com/photo-1687986261123-b17f08f2796c?w=2000&q=85&fm=jpg" },
{ base: "alu-kigali", dir: "assets/images/cities", source: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Kigali2018.jpg" },
{ base: "aims-kigali", dir: "assets/images/cities", source: "https://images.unsplash.com/photo-1708772565599-2c4e4b3ed9db?w=2000&q=85&fm=jpg" },
{ base: "ashesi-berekuso", dir: "assets/images/cities", source: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Ashesi%27s_Archer_Cornfield_Courtyard.jpg" },
{ base: "knust-kumasi", dir: "assets/images/cities", source: "https://upload.wikimedia.org/wikipedia/commons/0/0d/Knust_campus-_Commercial_area.jpg" },
{ base: "aims-accra", dir: "assets/images/cities", source: "https://images.unsplash.com/photo-1630386226447-af0a955c1009?w=2000&q=85&fm=jpg" },
{ base: "jkuat-juja", dir: "assets/images/cities", source: "https://upload.wikimedia.org/wikipedia/commons/4/4d/JKUAT_-_PAUSTI.jpg" },
{ base: "usiu-nairobi", dir: "assets/images/cities", source: "https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=2000&q=85&fm=jpg" },
{ base: "icipe-nairobi", dir: "assets/images/cities", source: "https://images.unsplash.com/photo-1634662101368-fa8021773862?w=2000&q=85&fm=jpg" },
{ base: "auc-cairo", dir: "assets/images/cities", source: "https://images.unsplash.com/photo-1720400995876-506098f4c238?w=2000&q=85&fm=jpg" },
{ base: "senghor-alexandrie", dir: "assets/images/cities", source: "https://images.unsplash.com/photo-1633624646814-3a61ed3e2847?w=2000&q=85&fm=jpg" },
{ base: "al-azhar-cairo", dir: "assets/images/scholarships", source: "https://images.unsplash.com/photo-1646763143121-1bbf5aaf2f2d?w=2000&q=85&fm=jpg" }
];

// Ne régénérer QUE ces bases (les 9 autres sont déjà en place et
// conformes) : node scripts/add-lot31-photos.mjs cmu-africa-kigali ...
const filtres = process.argv.slice(2);
const aTraiter = filtres.length ? PHOTOS.filter((p) => filtres.includes(p.base)) : PHOTOS;

for (const photo of aTraiter) {

const reponse = await fetch(photo.source, { headers: { "User-Agent": UA } });
if (!reponse.ok) throw new Error(`${photo.base} : téléchargement refusé (${reponse.status})`);
const original = Buffer.from(await reponse.arrayBuffer());

// Fichier de référence <base>.jpg, plafonné à 2000px : c'est lui que
// vise le repli onerror (fallbackOriginal) — jamais l'original
// pleine résolution de Commons (4000-5000px).
const reference = await sharp(original).resize({ width: 2000, withoutEnlargement: true }).jpeg({ quality: QUALITY, mozjpeg: true }).toBuffer();
await writeFile(join(photo.dir, `${photo.base}.jpg`), reference);

for (const width of WIDTHS) {
const pipeline = sharp(reference).resize({ width, withoutEnlargement: true });
await pipeline.clone().jpeg({ quality: QUALITY, mozjpeg: true }).toFile(join(photo.dir, `${photo.base}-${width}w.jpg`));
await pipeline.clone().webp({ quality: 85 }).toFile(join(photo.dir, `${photo.base}-${width}w.webp`));
await pipeline.clone().avif({ quality: 60 }).toFile(join(photo.dir, `${photo.base}-${width}w.avif`));
}

const meta = await sharp(reference).metadata();
console.log(`${photo.base} : référence ${meta.width}px + ${WIDTHS.length} largeurs × jpg/webp/avif`);

// Politesse envers les CDN (Wikimedia rejette les rafales sans pause).
await new Promise((r) => setTimeout(r, 900));

}

console.log("\nLot 31 : 13 photos déclinées. Vérification suivante : admin/audit-catalog.html (photos partagées).");
