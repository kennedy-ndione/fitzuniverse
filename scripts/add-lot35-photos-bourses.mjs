// ============================================================
// FitzUniverse — photos du lot 35 bis (France — 2026-09-03)
//
// Rattrapage de la RÈGLE DU CATALOGUE que le lot 35 n'avait pas
// respectée : CHAQUE BOURSE a sa photo propre (un MONUMENT de la ville),
// CHAQUE UNIVERSITÉ a sa photo de VILLE, et aucune image n'est partagée.
// Le lot 35 avait laissé huit bourses sur la cascade (photo de
// l'université rattachée) : cartes jumelles à l'écran.
//
// Ce script produit :
//   - 9 photos de bourses dans assets/images/scholarships/<id>.jpg
//     (+ 400/800/1200/1600w en JPEG — convention du dossier : JPEG seul),
//     dont le REMPLACEMENT de bourse-emile-boutmy (montrait la pyramide
//     du Louvre, comme paris.jpg de Sciences Po : même monument, deux
//     fichiers — « fichiers distincts ≠ images distinctes »).
//   - 1 photo de ville pour l'École polytechnique dans
//     assets/images/cities/polytechnique-palaiseau.jpg (+ JPEG/WebP/AVIF),
//     tirée de Wikimedia Commons : le script interroge l'API pour
//     l'auteur et la licence, les AFFICHE (à recopier dans CREDITS.md)
//     et REFUSE toute licence qui ne serait pas CC / domaine public.
//
// Sujets choisis pour ne doubler ni les photos d'universités (Louvre,
// Sorbonne, Panthéon, BnF, CentraleSupélec, Lyon aérien, bulles de
// Grenoble) ni la tour Eiffel (bourse Eiffel) :
//   Sciences Po / Émile-Boutmy ........ musée d'Orsay (7e, à 600 m de la rue Saint-Guillaume)
//   ENS-PSL sélection internationale .. palais et jardin du Luxembourg (le quartier de la rue d'Ulm)
//   SMARTS-UP Paris Cité .............. Notre-Dame (les facultés historiques de Paris Cité bordent la Seine)
//   France Excellence-Major (MEAE) .... Arc de Triomphe
//   Programme France-Sénégal .......... pont Alexandre-III (un pont : le lien entre les deux pays)
//   Polytechnique FUI ................. dôme des Invalides (l'X relève du ministère des Armées)
//   ENS Lyon Ampère ................... basilique de Fourvière
//   UGA IDEX .......................... l'Isère et ses quais sous les montagnes
//   Paris-Saclay International Master's château de Versailles (l'UVSQ est membre de Paris-Saclay)
//
// COMME AU LOT 35 : le sandbox n'a pas pu REGARDER ces images (pages
// Unsplash vérifiées : licence gratuite, champ Location, description).
// Le sujet, le ratio et l'absence de texte se contrôlent ICI, à l'œil,
// après téléchargement — et le script SAUTE un refus au lieu de
// s'interrompre. Ordre non négociable : ce script, PUIS `lot.mjs
// analyser 35-photos` (le lot refuse de se charger si un fichier manque).
// ============================================================

import { writeFile, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const WIDTHS = [400, 800, 1200, 1600];
const QUALITY = 92;
const DIR_BOURSES = "assets/images/scholarships";
const DIR_VILLES = "assets/images/cities";

const BOURSES = [
  { base: "bourse-emile-boutmy", sujet: "musée d'Orsay depuis la Seine", cdn: "photo-1764929316321-a920a59306df", page: "pYVT_YWvj3Y", auteur: "T (@t0nn)" },
  { base: "ens-psl-selection-internationale", sujet: "palais du Luxembourg et son jardin", cdn: "photo-1778397277715-5587af2a38a7", page: "s7oVdTjjKhs", auteur: "Mikael Padeiro" },
  { base: "smarts-up-universite-paris-cite", sujet: "Notre-Dame de Paris", cdn: "photo-1574870310056-79c4b3c7d449", page: "t9yW6tegIRU", auteur: "Marcel Strauß" },
  { base: "france-excellence-major", sujet: "Arc de Triomphe", cdn: "photo-1595540089942-545def48cf3e", page: "KX5ZQkluQ9U", auteur: "ian kelsall" },
  { base: "programme-bourses-france-senegal", sujet: "pont Alexandre-III et Grand Palais", cdn: "photo-1747464362908-8bc10e50ca3f", page: "arPLE2yYHRU", auteur: "Sinisa Lekovic" },
  { base: "polytechnique-concours-international-fui", sujet: "dôme des Invalides sur les toits", cdn: "photo-1773671334580-5b61c34a7b56", page: "-1v5OV58dm0", auteur: "Mikael Padeiro" },
  { base: "ens-lyon-ampere-scholarships", sujet: "basilique de Fourvière", cdn: "photo-1677389931416-9832636048ff", page: "zNnpb7NjPBs", auteur: "Salya T" },
  { base: "uga-idex-master-scholarships", sujet: "l'Isère, ses quais et les montagnes, Grenoble", cdn: "photo-1720717374256-cb67e1dae73b", page: "mKCXxdlAl1A", auteur: "Christian Attard" },
  { base: "paris-saclay-international-masters-scholarship", sujet: "entrée du château de Versailles", cdn: "photo-1667752920461-a5ea0883f438", page: "FUxXFfgbyOU", auteur: "Louis Paulin" }
];

// École polytechnique — Wikimedia Commons. Deux candidats, le premier
// qui passe (licence acceptée + ratio ≥ 1,3) est retenu.
const COMMONS_CANDIDATS = [
  "Ecole_Polytechnique_France_seen_from_lake_DSC03389.JPG",
  "Campus_Ecole_polytechnique_de_palaiseau.jpg",
  "Ecole_Polytechnique_France_lake_DSC03360.JPG"
];
const LICENCES_OK = /^(cc[- ]by(-sa)?(-[0-9.]+)?|cc0|public domain|pd)/i;

const reussies = [];
const refusees = [];

async function declinerJpeg(reference, dir, base, avecWebpAvif) {
  for (const width of WIDTHS) {
    const pipeline = sharp(reference).resize({ width, withoutEnlargement: true });
    await pipeline.clone().jpeg({ quality: QUALITY, mozjpeg: true }).toFile(join(dir, `${base}-${width}w.jpg`));
    if (avecWebpAvif) {
      await pipeline.clone().webp({ quality: 85 }).toFile(join(dir, `${base}-${width}w.webp`));
      await pipeline.clone().avif({ quality: 60 }).toFile(join(dir, `${base}-${width}w.avif`));
    }
  }
}

async function traiter(base, dir, original, avecWebpAvif, etiquette) {
  const reference = await sharp(original).resize({ width: 2000, withoutEnlargement: true }).jpeg({ quality: QUALITY, mozjpeg: true }).toBuffer();
  const meta = await sharp(reference).metadata();
  const ratio = meta.width / meta.height;
  if (ratio < 1.3) throw new Error(`ratio ${ratio.toFixed(2)} < 1,3 (${meta.width}x${meta.height}) — portrait refusé, la carte est une fente 2:1.`);
  await writeFile(join(dir, `${base}.jpg`), reference);
  await declinerJpeg(reference, dir, base, avecWebpAvif);
  console.log(`OK ${base} : ${meta.width}x${meta.height} (ratio ${ratio.toFixed(2)}) — ${etiquette}`);
}

const filtres = process.argv.slice(2);

// --- 1. Les neuf bourses (Unsplash) ---
for (const photo of BOURSES) {
  if (filtres.length && !filtres.includes(photo.base)) continue;
  try {
    const reponse = await fetch(`https://images.unsplash.com/${photo.cdn}?w=2000&q=85&fm=jpg`);
    if (!reponse.ok) throw new Error(`téléchargement refusé (${reponse.status})`);
    const original = Buffer.from(await reponse.arrayBuffer());
    await traiter(photo.base, DIR_BOURSES, original, false, `${photo.sujet} — ${photo.auteur}, https://unsplash.com/photos/${photo.page}`);
    reussies.push(photo.base);
  } catch (err) {
    console.error(`REFUSÉE ${photo.base} : ${err.message}`);
    refusees.push(photo.base);
  }
  await new Promise((r) => setTimeout(r, 700));
}

// --- 2. L'École polytechnique (Wikimedia Commons) ---
if (!filtres.length || filtres.includes("polytechnique-palaiseau")) {
  let retenue = false;
  for (const fichier of COMMONS_CANDIDATS) {
    try {
      const api = new URL("https://commons.wikimedia.org/w/api.php");
      api.searchParams.set("action", "query");
      api.searchParams.set("titles", `File:${fichier}`);
      api.searchParams.set("prop", "imageinfo");
      api.searchParams.set("iiprop", "url|size|extmetadata");
      api.searchParams.set("format", "json");
      const rep = await fetch(api, { headers: { "User-Agent": "FitzUniverse-catalogue/1.0 (photos du catalogue ; contact via le dépôt)" } });
      if (!rep.ok) throw new Error(`API Commons : ${rep.status}`);
      const page = Object.values((await rep.json()).query.pages)[0];
      if (!page.imageinfo) throw new Error("fichier introuvable sur Commons");
      const info = page.imageinfo[0];
      const meta = info.extmetadata || {};
      const licence = (meta.LicenseShortName || {}).value || "";
      const auteur = ((meta.Artist || {}).value || "").replace(/<[^>]+>/g, "").trim();
      const ratio = info.width / info.height;
      console.log(`Commons ${fichier} : ${info.width}x${info.height} (ratio ${ratio.toFixed(2)}) — licence « ${licence} » — auteur « ${auteur || "NON RENSEIGNÉ"} »`);
      if (!LICENCES_OK.test(licence)) throw new Error(`licence « ${licence} » non acceptée (il faut CC BY / CC BY-SA / CC0 / domaine public)`);
      if (ratio < 1.3) throw new Error(`ratio ${ratio.toFixed(2)} < 1,3`);
      const img = await fetch(info.url, { headers: { "User-Agent": "FitzUniverse-catalogue/1.0" } });
      if (!img.ok) throw new Error(`téléchargement Commons : ${img.status}`);
      const original = Buffer.from(await img.arrayBuffer());
      await traiter("polytechnique-palaiseau", DIR_VILLES, original, true, `campus de Palaiseau — ${auteur}, ${licence}, https://commons.wikimedia.org/wiki/File:${fichier}`);
      console.log(`   >>> À RECOPIER DANS CREDITS.md (section Wikimedia) : auteur « ${auteur} », licence « ${licence} », source File:${fichier}`);
      reussies.push("polytechnique-palaiseau");
      retenue = true;
      break;
    } catch (err) {
      console.error(`ÉCARTÉ ${fichier} : ${err.message}`);
      await rm(join(DIR_VILLES, "polytechnique-palaiseau.jpg"), { force: true });
    }
  }
  if (!retenue) refusees.push("polytechnique-palaiseau");
}

console.log(`\nLot 35 bis photos : ${reussies.length} prête(s) [${reussies.join(", ")}]` + (refusees.length ? ` — ${refusees.length} REFUSÉE(S) [${refusees.join(", ")}] : retirer ces ids du lot 35-photos avant d'écrire.` : "."));
console.log("REGARDER chaque fichier (sujet, cadrage, pas de texte), puis `node scripts\\lot.mjs analyser 35-photos`.");
if (refusees.length) process.exitCode = 1;
