// ============================================================
// FitzUniverse — lot 80 : deux photos de ville REMPLACÉES (2026-09-24)
//
// Contrôle à l'œil des 41 photos de ville les plus anciennes (celles
// qui n'avaient aucun crédit dans CREDITS.md), fait le 2026-09-24 :
//
//   godollo.jpg (Hungarian University of Agriculture and Life Sciences,
//     à Gödöllő) montrait ESZTERGOM : la ville vue du château, le Danube
//     et le pont Mária Valéria vers la Slovaquie, à 60 km de Gödöllő.
//   szeged.jpg (University of Szeged) montrait BUDAPEST de nuit : le
//     château de Buda et l'église Matthias.
//
// Même défaut que milan.jpg (Vernazza) au 2026-08-31 : un nom de fichier
// juste, une image fausse. Les deux fichiers sont réécrits SOUS LE MÊME
// NOM : le champ `image` des fiches ne change pas, aucun lot Firestore
// n'accompagne ce script (même méthode que le correctif du lot 27).
//
// Candidats REGARDÉS au navigateur avant d'écrire ce fichier :
//   Gödöllő : l'arrière du palais royal (Grassalkovich), lieu confirmé
//     par la fiche Unsplash (« Gödöllő, Hungary », « The back of Godollo
//     Palace »).
//   Szeged : l'église votive et ses deux flèches, place du Dôme. Rien de
//     reconnaissable sur Unsplash (fleurs, origami, grande roue) : on
//     passe par Wikimedia Commons, CC BY-SA 4.0, attribution obligatoire.
//
//   node scripts/add-lot80-photos.mjs
//
// Ensuite : prévenir Claude, qui regarde les deux fichiers 800w puis met
// à jour CREDITS.md et credits.html depuis le journal.
// ============================================================

import { writeFile, readFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const WIDTHS = [400, 800, 1200, 1600];
const QUALITY = 92;
const DIR_VILLES = "assets/images/cities";
const JOURNAL = "scripts/data/journal-photos-lot80.json";
// Licences libres ET commerciales seulement : CC BY, CC BY-SA, CC0,
// domaine public. Une clause NC ou ND ne passe pas (l'ancien motif, qui
// ne regardait que le début, les laissait passer).
const LICENCES_OK = /^(cc[- ]by(-sa)?([- ]\d\.\d)?( [a-z]{2,3})?|cc0( 1\.0)?|public domain|pd)$/i;
const UA = { "User-Agent": "FitzUniverse-catalogue/1.0 (photos du catalogue ; contact via le dépôt)" };

const U = (page, cdn, auteur, sujet) => ({ src: "unsplash", page, cdn, auteur, sujet });
const C = (fichier, sujet) => ({ src: "commons", fichier, sujet });

const VILLES = [
  { base: "godollo", candidats: [
    U("J8z_McvlZEQ", "photo-1660987286221-6e74fd13d731", "Linda Gerbec", "le palais royal de Gödöllő, vu de sa cour arrière")] },
  { base: "szeged", candidats: [
    C("Szeged, Dóm tér 2021 01.jpg", "l'église votive et la place du Dôme, Szeged")] }
];

const reussies = [];
const refusees = [];
const journal = [];

async function ecrire(base, original) {
  // Tout est préparé EN MÉMOIRE avant la première écriture : ce script
  // remplace des fichiers déjà publiés, et une variante qui échouerait
  // à mi-chemin laisserait sinon un mélange de l'ancienne et de la
  // nouvelle photo sous le même nom.
  const reference = await sharp(original).resize({ width: 2000, withoutEnlargement: true }).jpeg({ quality: QUALITY, mozjpeg: true }).toBuffer();
  const meta = await sharp(reference).metadata();
  const ratio = meta.width / meta.height;
  if (ratio < 1.3) throw new Error(`ratio ${ratio.toFixed(2)} < 1,3 (${meta.width}x${meta.height}) — portrait refusé`);
  if (meta.width < 1600) throw new Error(`largeur ${meta.width} < 1600 : la variante 1600w serait agrandie`);
  const fichiers = [[`${base}.jpg`, reference]];
  for (const width of WIDTHS) {
    const pipeline = sharp(reference).resize({ width, withoutEnlargement: true });
    fichiers.push([`${base}-${width}w.jpg`, await pipeline.clone().jpeg({ quality: QUALITY, mozjpeg: true }).toBuffer()]);
    fichiers.push([`${base}-${width}w.webp`, await pipeline.clone().webp({ quality: 85 }).toBuffer()]);
    fichiers.push([`${base}-${width}w.avif`, await pipeline.clone().avif({ quality: 60 }).toBuffer()]);
  }
  for (const [nom, contenu] of fichiers) await writeFile(join(DIR_VILLES, nom), contenu);
  return `${meta.width}x${meta.height} (ratio ${ratio.toFixed(2)})`;
}

async function essayer(base, c) {
  if (c.src === "unsplash") {
    const rep = await fetch(`https://images.unsplash.com/${c.cdn}?w=2000&q=85&fm=jpg`);
    if (!rep.ok) throw new Error(`Unsplash ${rep.status}`);
    const dims = await ecrire(base, Buffer.from(await rep.arrayBuffer()));
    console.log(`OK ${base} : ${dims} — ${c.sujet} — ${c.auteur}, https://unsplash.com/photos/${c.page}`);
    journal.push({ base, source: "Unsplash", sujet: c.sujet, auteur: c.auteur, licence: "Licence Unsplash", lien: `https://unsplash.com/photos/${c.page}`, cdn: c.cdn, dimensions: dims });
    return;
  }
  const api = new URL("https://commons.wikimedia.org/w/api.php");
  api.searchParams.set("action", "query");
  api.searchParams.set("titles", `File:${c.fichier}`);
  api.searchParams.set("prop", "imageinfo");
  api.searchParams.set("iiprop", "url|size|extmetadata");
  api.searchParams.set("format", "json");
  const rep = await fetch(api, { headers: UA });
  if (!rep.ok) throw new Error(`API Commons ${rep.status}`);
  const page = Object.values((await rep.json()).query.pages)[0];
  if (!page.imageinfo) throw new Error("introuvable sur Commons");
  const info = page.imageinfo[0];
  const meta = info.extmetadata || {};
  const licence = (meta.LicenseShortName || {}).value || "";
  const auteur = ((meta.Artist || {}).value || "").replace(/<[^>]+>/g, "").trim() || "NON RENSEIGNÉ";
  console.log(`   Commons ${c.fichier} : ${info.width}x${info.height} — licence « ${licence} » — auteur « ${auteur} »`);
  if (!LICENCES_OK.test(licence)) throw new Error(`licence « ${licence} » non acceptée`);
  // Une licence CC BY exige le nom de l'auteur : sans lui, le crédit
  // serait incomplet.
  if (auteur === "NON RENSEIGNÉ" && !/^(cc0|public domain|pd)/i.test(licence)) throw new Error("auteur non renseigné sur Commons");
  if (info.width / info.height < 1.3) throw new Error(`ratio ${(info.width / info.height).toFixed(2)} < 1,3`);
  const img = await fetch(info.url, { headers: UA });
  if (!img.ok) throw new Error(`téléchargement Commons ${img.status}`);
  const dims = await ecrire(base, Buffer.from(await img.arrayBuffer()));
  console.log(`OK ${base} : ${dims} — ${c.sujet} — Commons, ${auteur}, ${licence}`);
  journal.push({ base, source: "Wikimedia Commons", sujet: c.sujet, auteur, licence, lien: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(c.fichier.replace(/ /g, "_"))}`, fichier: c.fichier, original: `${info.width}x${info.height}`, dimensions: dims });
}

const filtres = process.argv.slice(2);
await mkdir(DIR_VILLES, { recursive: true });

for (const { base, candidats } of VILLES) {
  if (filtres.length && !filtres.includes(base)) continue;
  // Pas de « déjà complète » : ce script REMPLACE des fichiers existants.
  let ok = false;
  for (const c of candidats) {
    try { await essayer(base, c); ok = true; break; }
    catch (err) { console.error(`   écarté ${c.page || c.fichier} : ${err.message}`); }
    await new Promise((r) => setTimeout(r, 500));
  }
  (ok ? reussies : refusees).push(base);
  if (!ok) console.error(`REFUSÉE ${base} : aucun candidat retenu.`);
  await new Promise((r) => setTimeout(r, 700));
}

// Le journal s'ENRICHIT d'un passage à l'autre : relancer le script pour
// une seule photo ne doit pas effacer les crédits des autres.
let ancien = [];
try { ancien = JSON.parse(await readFile(JOURNAL, "utf8")); } catch { ancien = []; }
const parBase = new Map(ancien.map((e) => [e.base, e]));
for (const e of journal) parBase.set(e.base, e);
await writeFile(JOURNAL, JSON.stringify([...parBase.values()], null, 2) + "\n");

console.log(`\nLot 80 photos : ${reussies.length} prête(s)` + (refusees.length ? ` — ${refusees.length} REFUSÉE(S) [${refusees.join(", ")}] : prévenir Claude avant d'aller plus loin.` : "."));
console.log(`Journal des crédits : ${JOURNAL} (${parBase.size} entrée(s)).`);
console.log("\nÉtape suivante : prévenir Claude (il regarde les deux photos avant les crédits).");
if (refusees.length) process.exitCode = 1;
