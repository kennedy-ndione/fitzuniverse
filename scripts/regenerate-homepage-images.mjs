// Régénère les variantes responsive pour les images de la page d'accueil
// avec une qualité JPEG supérieure (85 au lieu de 78)
import { basename, extname, join } from "node:path";
import sharp from "sharp";

const IMAGES_DIR = "assets/images";

// Images de la page d'accueil à traiter
const HOMEPAGE_IMAGES = [
  "hero-bg2.jpg",
  "hero-bg3.jpg",
  "hero-bg4.jpg",
  "hero-bg5.jpg",
  "amphitheatre.jpg",
  "graduation.jpg",
  "international-students.jpg",
  "university-building.jpg",
  "university-hall.jpg"
];

const WIDTHS = [400, 800, 1200, 1600, 1920];
const QUALITY = 92; // Qualité augmentée de 78 à 92 (quasi sans perte)

for (const file of HOMEPAGE_IMAGES) {
  const input = join(IMAGES_DIR, file);
  const base = basename(file, extname(file));

  try {
    const meta = await sharp(input).metadata();
    console.log(`\n📸 ${file} (${meta.width}x${meta.height})`);

    for (const width of WIDTHS) {
      if (meta.width && meta.width <= width) {
        console.log(`  ⏭️  ${width}px (original plus grande)`);
        continue;
      }

      const output = join(IMAGES_DIR, `${base}-${width}w.jpg`);
      await sharp(input)
        .resize({ width })
        .jpeg({ quality: QUALITY, mozjpeg: true })
        .toFile(output);

      console.log(`  ✅ ${output} (→ ${width}px, Q${QUALITY})`);
    }
  } catch (err) {
    console.error(`  ❌ Erreur: ${err.message}`);
  }
}

console.log("\n✨ Régénération complète! Les images sont maintenant en meilleure qualité.");
