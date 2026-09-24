// ============================================================
// scripts/formats-modernes.mjs — les photos du catalogue en AVIF et WebP
// ============================================================
//
//     node scripts/formats-modernes.mjs          crée ce qui manque
//     node scripts/formats-modernes.mjs --verif  ne touche à rien, dit ce qui manque
//
// POURQUOI (lot A « vitesse sur téléphone », 2026-09-24)
// PageSpeed, téléphone en 4G lente : 970 Kio de photos pour le bandeau
// « Ouvert en ce moment » de l'accueil, dont 855 Kio évitables. Les
// photos des bourses (assets/images/scholarships/) n'existaient qu'en
// JPEG qualité 92, et 98 photos de villes sur 157 aussi. Le hero, lui,
// sert déjà de l'AVIF et du WebP.
//
// CE QUE FAIT LE SCRIPT
// Pour chaque « -400w.jpg » et « -800w.jpg » de ces deux dossiers, il
// crée les jumeaux « .avif » et « .webp » qui manquent, À PARTIR DE CE
// JPEG : même cadrage, même taille. Il ne remplace JAMAIS un fichier
// existant (les variantes produites par les scripts de lots restent
// intactes). Relancé, il ne refait rien.
//
// Réglages mesurés le 2026-09-24 sur cinq photos du catalogue :
// AVIF qualité 50, effort 2 (0,2 à 0,6 s par photo) et WebP qualité 75.
// Gain : 55 à 75 % sur le JPEG, sans différence visible à la taille
// d'affichage (une carte de 306 px de large).
//
// Seules les largeurs 400 et 800 : ce sont les deux que demande le
// bandeau (sizes « 268px » sur téléphone, « 306px » ailleurs, écrans
// jusqu'à 3x). test/vitesse-accueil.test.mjs vérifie que chaque JPEG
// a ses deux jumeaux : un <source> vers un fichier absent casserait
// l'image, sans repli.
// ============================================================

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export const DOSSIERS = ["assets/images/scholarships", "assets/images/cities"];
export const LARGEURS = [400, 800];
export const FORMATS = ["avif", "webp"];

const RE_VARIANTE = new RegExp(`^(.+)-(${LARGEURS.join("|")})w\\.jpg$`);

/** Les jumeaux absents : [{ source, cible, format }], chemins relatifs à la racine. */
export function manquants(racine = RACINE) {
  const sortie = [];
  for (const dossier of DOSSIERS) {
    const abs = path.join(racine, dossier);
    if (!fs.existsSync(abs)) continue;
    const presents = new Set(fs.readdirSync(abs));
    for (const nom of [...presents].sort()) {
      const m = RE_VARIANTE.exec(nom);
      if (!m) continue;
      for (const format of FORMATS) {
        const jumeau = `${m[1]}-${m[2]}w.${format}`;
        if (!presents.has(jumeau)) {
          sortie.push({ source: `${dossier}/${nom}`, cible: `${dossier}/${jumeau}`, format });
        }
      }
    }
  }
  return sortie;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const liste = manquants();

  if (process.argv.includes("--verif")) {
    for (const { cible } of liste) console.log(`manque : ${cible}`);
    console.log(liste.length ? `${liste.length} fichier(s) à créer : node scripts/formats-modernes.mjs` : "Toutes les photos ont leurs jumeaux AVIF et WebP.");
    if (liste.length) process.exitCode = 1;
  } else if (!liste.length) {
    console.log("Rien à faire : toutes les photos ont déjà leurs jumeaux AVIF et WebP.");
  } else {
    const { default: sharp } = await import("sharp");
    console.log(`${liste.length} fichier(s) à créer. Compter plusieurs minutes, ne pas fermer la fenêtre.`);
    let faits = 0;
    let echecs = 0;
    for (const { source, cible, format } of liste) {
      try {
        const image = sharp(path.join(RACINE, source));
        const sortie = format === "avif" ? image.avif({ quality: 50, effort: 2 }) : image.webp({ quality: 75 });
        await sortie.toFile(path.join(RACINE, cible));
        faits++;
        if (faits % 50 === 0) console.log(`  ${faits} / ${liste.length}…`);
      } catch (erreur) {
        echecs++;
        console.error(`ÉCHEC ${cible} : ${erreur.message}`);
      }
    }
    console.log(`Terminé : ${faits} créé(s), ${echecs} échec(s).`);
    if (echecs) process.exitCode = 1;
  }
}
