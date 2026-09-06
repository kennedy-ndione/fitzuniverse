// ============================================================
// FitzUniverse — photos du lot 35 (France — 2026-09-03)
//
// Quatre photos de ville pour cinq des six établissements du lot
// (l'École polytechnique n'a pas de candidate : voir en bas), déclinées
// aux largeurs attendues par resolveCityImage() : référence 2000px +
// 400/800/1200/1600w en JPEG q92 mozjpeg, plus AVIF et WebP.
//
// ⚠️ LIMITE DE CE LOT — À LIRE AVANT DE LANCER
// Le sandbox qui a préparé ce lot n'atteint NI le CDN Unsplash NI
// Wikimedia : aucune de ces images n'a pu être REGARDÉE. Ce qui a été
// vérifié : la page Unsplash de chacune (identifiant CDN, licence
// Unsplash gratuite — deux candidates Unsplash+ ont été ÉCARTÉES —,
// champ « Location », description), et l'absence de l'identifiant CDN
// dans CREDITS.md. Ce qui ne l'a PAS été : le sujet à l'œil, le ratio,
// l'absence de texte ou de blason. La règle de photos_bourses_cascade
// (« le nom de fichier n'est pas une preuve du sujet ») s'applique
// donc EN PLUS ici : ouvrir chaque page `https://unsplash.com/photos/<page>`
// et regarder AVANT d'exécuter. Le script refuse tout ratio < 1,3.
//
// PARIS EST DÉJÀ OCCUPÉE DEUX FOIS (paris.jpg — Sciences Po ;
// sorbonne.jpg). Les deux parisiennes du lot prennent des sujets
// visuellement distincts : le Panthéon (l'ENS est rue d'Ulm, derrière
// le Panthéon) et les tours de la BnF (face au campus des Grands
// Moulins de Paris Cité). Vérifier au passage que paris.jpg et
// sorbonne.jpg ne montrent pas déjà le Panthéon.
// ============================================================

import { writeFile, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const WIDTHS = [400, 800, 1200, 1600];
const QUALITY = 92;
const DIR = "assets/images/cities";

const PHOTOS = [
  // Université Paris-Saclay — bâtiment moderne, « Gif-sur-Yvette, France »
  // (Philippe Gras, page WIHa4vSUKow). Tags : campus, architecture.
  // Le tag « eiffel » est suspect : REGARDER qu'il ne s'agit pas
  // d'une vue parisienne.
  { base: "paris-saclay-gif", cdn: "photo-1617182926345-205718965035", page: "WIHa4vSUKow" },

  // ENS — PSL : le Panthéon, façade et dôme, « Pantheon, Paris, France »
  // (Kreshen, page pF7MZSCYsN4). REMPLACE la page 3UrP2tmccEc du premier
  // passage (2026-09-03) : elle était en PORTRAIT (2000×2667, ratio 0,75),
  // la garde de ratio l'a refusée et a interrompu le script — Lyon,
  // Grenoble et la BnF n'avaient jamais été téléchargées.
  { base: "ens-ulm-paris", cdn: "photo-1565200380227-ede88b62b5a0", page: "pF7MZSCYsN4" },

  // ENS de Lyon : Lyon en vue aérienne, le fleuve au milieu, « Lyon,
  // France » (Willian Justen de Vasconcellos, page Q8W2RhZgO6U).
  // Les vues Fourvière / Saint-Georges / tramway sont Unsplash+ (payantes) : écartées.
  { base: "lyon", cdn: "photo-1682249301492-c117bddca579", page: "Q8W2RhZgO6U" },

  // Université Grenoble Alpes : les « bulles » du téléphérique de la
  // Bastille au-dessus de la ville, « Grenoble, France »
  // (Fabe collage, page diqJhQtHHNk).
  { base: "grenoble", cdn: "photo-1580920950500-597f23bd6f72", page: "diqJhQtHHNk" },

  // Université Paris Cité : tours de verre au crépuscule, tags
  // « Library », « Paris architecture » (FELIXFELIX FELIX, page
  // nNqG3PewSGc). Location NON renseignée sur la page : à CONFIRMER
  // à l'œil qu'il s'agit bien de la BnF François-Mitterrand avant de
  // l'accepter — sinon retirer cette ligne et vider le champ image
  // de universite-paris-cite-paris dans le lot.
  { base: "paris-cite-bnf", cdn: "photo-1768913124310-d53597c80ea3", page: "nNqG3PewSGc" }
];

// École polytechnique (Palaiseau) : aucune photo libre trouvée sur
// Unsplash (« ecole polytechnique » → une statue sans lieu ;
// « palaiseau » → un coin de rue, des arbres). Pistes : Wikimedia
// Commons, catégorie « École polytechnique (Palaiseau) » (le lac et le
// bâtiment central, CC BY-SA → entrée obligatoire dans CREDITS.md,
// section Wikimedia), fichier à nommer `polytechnique-palaiseau.jpg`,
// puis renseigner `image` sur la fiche via un patch. En attendant, le
// champ est VIDE et la carte affiche le repli générique.

const filtres = process.argv.slice(2);
const aTraiter = filtres.length ? PHOTOS.filter((p) => filtres.includes(p.base)) : PHOTOS;

// Une photo refusée (téléchargement, ratio) est SIGNALÉE et SAUTÉE : le
// script continue avec les suivantes et récapitule à la fin. Leçon du
// premier passage : un `throw` au milieu de la liste laisse les fiches
// avec un champ `image` qui pointe vers un fichier absent (carte vide).
const reussies = [];
const refusees = [];

for (const photo of aTraiter) {
  try {
    if (existsSync(join(DIR, `${photo.base}-1600w.avif`))) {
      console.log(`${photo.base} : déjà complète (1600w.avif présent) — ignorée. Supprimer les fichiers ${photo.base}* pour la refaire.`);
      reussies.push(photo.base);
      continue;
    }

    const reponse = await fetch(`https://images.unsplash.com/${photo.cdn}?w=2000&q=85&fm=jpg`);
    if (!reponse.ok) throw new Error(`téléchargement refusé (${reponse.status})`);
    const original = Buffer.from(await reponse.arrayBuffer());

    const reference = await sharp(original).resize({ width: 2000, withoutEnlargement: true }).jpeg({ quality: QUALITY, mozjpeg: true }).toBuffer();
    const meta = await sharp(reference).metadata();
    const ratio = meta.width / meta.height;

    if (ratio < 1.3) {
      // On ne laisse AUCUN fichier orphelin derrière un refus.
      await rm(join(DIR, `${photo.base}.jpg`), { force: true });
      throw new Error(`ratio ${ratio.toFixed(2)} < 1,3 (${meta.width}x${meta.height}) — portrait refusé, la carte est une fente 2:1. Choisir une autre photo.`);
    }

    await writeFile(join(DIR, `${photo.base}.jpg`), reference);

    for (const width of WIDTHS) {
      const pipeline = sharp(reference).resize({ width, withoutEnlargement: true });
      await pipeline.clone().jpeg({ quality: QUALITY, mozjpeg: true }).toFile(join(DIR, `${photo.base}-${width}w.jpg`));
      await pipeline.clone().webp({ quality: 85 }).toFile(join(DIR, `${photo.base}-${width}w.webp`));
      await pipeline.clone().avif({ quality: 60 }).toFile(join(DIR, `${photo.base}-${width}w.avif`));
    }

    console.log(`OK ${photo.base} : ${meta.width}x${meta.height} (ratio ${ratio.toFixed(2)}) + ${WIDTHS.length} largeurs × jpg/webp/avif — page https://unsplash.com/photos/${photo.page}`);
    reussies.push(photo.base);
  } catch (err) {
    console.error(`REFUSÉE ${photo.base} : ${err.message}`);
    refusees.push(photo.base);
  }

  await new Promise((r) => setTimeout(r, 700));
}

console.log(`\nLot 35 photos : ${reussies.length} prête(s) [${reussies.join(", ")}]` + (refusees.length ? ` — ${refusees.length} REFUSÉE(S) [${refusees.join(", ")}] : ces fiches doivent garder image:"" tant qu'aucune photo n'est prête.` : "."));
console.log("REGARDER chaque fichier dans assets/images/cities, puis ajouter les crédits dans CREDITS.md (section Unsplash, même forme que le lot 32).");
if (refusees.length) process.exitCode = 1;
