// ============================================================
// FitzUniverse — remplacement de la photo de Sorbonne Paris Nord
// (2026-09-03) : le Stade de France vu de l'intérieur un soir de match
// (lot 36) ne lisait pas comme une « ville » — décision utilisateur.
//
// Nouveau sujet : la basilique de Saint-Denis (nécropole des rois de
// France, à 3 km du campus de Villetaneuse et voisine du site de
// Saint-Denis). Aucune photo libre exploitable sur Unsplash (la
// recherche renvoie La Réunion, le stade ou un EHPAD du Mesnil) :
// Wikimedia Commons, candidats essayés dans l'ordre, le premier qui
// passe (licence CC / domaine public + ratio ≥ 1,3) est retenu.
// L'auteur et la licence sont AFFICHÉS : à recopier dans CREDITS.md.
//
// Produit assets/images/cities/saint-denis-basilique.jpg (+ 400/800/
// 1200/1600w JPEG, WebP, AVIF). Les anciens fichiers
// saint-denis-stade-de-france* ne sont PAS supprimés ici (la fiche les
// référence jusqu'au patch du lot 36-saint-denis) : à supprimer à la
// main APRÈS l'export, puis retirer leur entrée de CREDITS.md.
// ============================================================

import { writeFile, rm } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const WIDTHS = [400, 800, 1200, 1600];
const QUALITY = 92;
const DIR = "assets/images/cities";
const BASE = "saint-denis-basilique";

const CANDIDATS = [
  "Saint Denis - La Basilique 2.jpg",
  "Basilica of Saint Denis, Paris, France.JPG",
  "Basilique St Denis façade ouest St Denis Seine St Denis 16.jpg",
  "Basilique St Denis façade ouest St Denis Seine St Denis 20.jpg",
  "Saint-Denis - Façade.jpg"
];
const LICENCES_OK = /^(cc[- ]by(-sa)?(-[0-9.]+)?|cc0|public domain|pd)/i;
const UA = { "User-Agent": "FitzUniverse-catalogue/1.0 (photos du catalogue ; contact via le dépôt)" };

let retenue = false;
for (const fichier of CANDIDATS) {
  try {
    const api = new URL("https://commons.wikimedia.org/w/api.php");
    api.searchParams.set("action", "query");
    api.searchParams.set("titles", `File:${fichier}`);
    api.searchParams.set("prop", "imageinfo");
    api.searchParams.set("iiprop", "url|size|extmetadata");
    api.searchParams.set("format", "json");
    const rep = await fetch(api, { headers: UA });
    if (!rep.ok) throw new Error(`API Commons : ${rep.status}`);
    const page = Object.values((await rep.json()).query.pages)[0];
    if (!page.imageinfo) throw new Error("fichier introuvable sur Commons");
    const info = page.imageinfo[0];
    const meta = info.extmetadata || {};
    const licence = (meta.LicenseShortName || {}).value || "";
    const auteur = ((meta.Artist || {}).value || "").replace(/<[^>]+>/g, "").trim();
    const ratio = info.width / info.height;
    console.log(`Commons ${fichier} : ${info.width}x${info.height} (ratio ${ratio.toFixed(2)}) — licence « ${licence} » — auteur « ${auteur || "NON RENSEIGNÉ"} »`);
    if (!LICENCES_OK.test(licence)) throw new Error(`licence « ${licence} » non acceptée`);
    if (ratio < 1.3) throw new Error(`ratio ${ratio.toFixed(2)} < 1,3 — portrait, la carte est une fente 2:1`);
    const img = await fetch(info.url, { headers: UA });
    if (!img.ok) throw new Error(`téléchargement Commons : ${img.status}`);
    const original = Buffer.from(await img.arrayBuffer());
    const reference = await sharp(original).resize({ width: 2000, withoutEnlargement: true }).jpeg({ quality: QUALITY, mozjpeg: true }).toBuffer();
    const m = await sharp(reference).metadata();
    await writeFile(join(DIR, `${BASE}.jpg`), reference);
    for (const width of WIDTHS) {
      const pipeline = sharp(reference).resize({ width, withoutEnlargement: true });
      await pipeline.clone().jpeg({ quality: QUALITY, mozjpeg: true }).toFile(join(DIR, `${BASE}-${width}w.jpg`));
      await pipeline.clone().webp({ quality: 85 }).toFile(join(DIR, `${BASE}-${width}w.webp`));
      await pipeline.clone().avif({ quality: 60 }).toFile(join(DIR, `${BASE}-${width}w.avif`));
    }
    console.log(`OK ${BASE} : ${m.width}x${m.height} (ratio ${(m.width / m.height).toFixed(2)}) — basilique de Saint-Denis`);
    console.log(`   >>> À RECOPIER DANS CREDITS.md (section Wikimedia) : auteur « ${auteur} », licence « ${licence} », source File:${fichier}, original ${info.width}x${info.height}`);
    retenue = true;
    break;
  } catch (err) {
    console.error(`ÉCARTÉ ${fichier} : ${err.message}`);
    await rm(join(DIR, `${BASE}.jpg`), { force: true });
  }
}

if (!retenue) {
  console.error("\nAucun candidat retenu : la fiche garde le Stade de France, ne pas lancer le lot 36-saint-denis.");
  process.exitCode = 1;
} else {
  console.log("\nREGARDER le fichier, puis `node scripts\\lot.mjs analyser 36-saint-denis`.");
}
