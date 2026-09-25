// ============================================================
// FitzUniverse — photos du lot 107 (bourse de l'UIR),
// 2026-09-25
//
// Copie du script du lot 106. Chaque bourse a SA photo : un MONUMENT de
// la ville (assets/images/scholarships, JPEG + WebP + AVIF en
// 400/800/1200/1600w), jamais un sujet déjà pris par le site. Évités :
// les tours Petronas, Merdeka 118, l'horizon de Kuala Lumpur, le
// bâtiment Sultan Abdul Samad, les grottes de Batu, le stade de Bukit
// Jalil, la mosquée Putra ; à Istanbul, Galata, la tour de Léandre,
// Rumeli Hisarı, Dolmabahçe, Ortaköy, Sainte-Sophie, la Mosquée bleue ;
// à Fès, les tanneries Chouara et la médina vue d'en haut ; à Rabat, la
// tour Hassan, la kasbah des Oudayas et la marina du Bouregreg.
// Lieu relu dans la fiche Unsplash ou la description Commons ; vues
// extérieures seulement.
//
//   node scripts/add-lot107-photos.mjs                 toutes
//   node scripts/add-lot107-photos.mjs <id-de-bourse>  une seule
//
// Ordre : ce script, PUIS `node scripts\lot.mjs analyser 107-bourse-uir`
// (le lot refuse de se charger si une photo manque).
// ============================================================

import { writeFile, readFile, rm, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const WIDTHS = [400, 800, 1200, 1600];
const QUALITY = 92;
const DIR_VILLES = "assets/images/scholarships";
const JOURNAL = "scripts/data/journal-photos-lot107.json";
// Licences libres ET commerciales seulement : CC BY, CC BY-SA, CC0,
// domaine public. Une clause NC ou ND ne passe pas.
const LICENCES_OK = /^(cc[- ]by(-sa)?([- ]\d\.\d)?( [a-z]{2,3})?|cc0( 1\.0)?|public domain|pd)$/i;
const UA = { "User-Agent": "FitzUniverse-catalogue/1.0 (photos du catalogue ; contact via le dépôt)" };

const U = (page, cdn, auteur, sujet) => ({ src: "unsplash", page, cdn, auteur, sujet });
const C = (fichier, sujet) => ({ src: "commons", fichier, sujet });

const VILLES = [
  { base: "uir-bourse-etudes-internationaux", candidats: [
    C("Rabat Chellah (3) (13712768113).jpg", "la porte monumentale du Chellah, Rabat"),
    C("Rabat. Chellah (8177217511).jpg", "les remparts et la tour du Chellah, Rabat")] }
];
const reussies = [];
const refusees = [];
const journal = [];

async function ecrire(base, original) {
  const reference = await sharp(original).rotate().resize({ width: 2000, withoutEnlargement: true }).jpeg({ quality: QUALITY, mozjpeg: true }).toBuffer();
  const meta = await sharp(reference).metadata();
  const ratio = meta.width / meta.height;
  if (ratio < 1.3) throw new Error(`ratio ${ratio.toFixed(2)} < 1,3 (${meta.width}x${meta.height}) — portrait refusé`);
  if (meta.width < 1600) throw new Error(`largeur ${meta.width} < 1600 : la variante 1600w serait agrandie`);
  await writeFile(join(DIR_VILLES, `${base}.jpg`), reference);
  for (const width of WIDTHS) {
    const pipeline = sharp(reference).resize({ width, withoutEnlargement: true });
    await pipeline.clone().jpeg({ quality: QUALITY, mozjpeg: true }).toFile(join(DIR_VILLES, `${base}-${width}w.jpg`));
    await pipeline.clone().webp({ quality: 85 }).toFile(join(DIR_VILLES, `${base}-${width}w.webp`));
    await pipeline.clone().avif({ quality: 60 }).toFile(join(DIR_VILLES, `${base}-${width}w.avif`));
  }
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
  // Correctif du 2026-09-25 : Commons renvoie 429 (trop de demandes) sur
  // l'ORIGINAL de certains gros fichiers. On télécharge une vignette de
  // 2 400 px, servie par le cache, largement assez pour la variante 1600w.
  api.searchParams.set("iiurlwidth", "2400");
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
  const cible = info.thumburl || info.url;
  let img;
  // Jusqu'à 4 essais si Commons répond 429, en attendant ce qu'il demande
  // (en-tête Retry-After), 20 secondes par défaut.
  for (let essai = 1; essai <= 4; essai++) {
    img = await fetch(cible, { headers: UA });
    if (img.status !== 429) break;
    const attente = Math.min(Number(img.headers.get("retry-after")) || 20, 120);
    console.log(`   Commons 429, nouvel essai dans ${attente} s (${essai}/4)`);
    await new Promise((r) => setTimeout(r, attente * 1000));
  }
  if (!img.ok) throw new Error(`téléchargement Commons ${img.status}`);
  const dims = await ecrire(base, Buffer.from(await img.arrayBuffer()));
  console.log(`OK ${base} : ${dims} — ${c.sujet} — Commons, ${auteur}, ${licence}`);
  journal.push({ base, source: "Wikimedia Commons", sujet: c.sujet, auteur, licence, lien: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(c.fichier.replace(/ /g, "_"))}`, fichier: c.fichier, original: `${info.width}x${info.height}`, dimensions: dims });
}

// --refaire : refabrique une photo déjà présente (correctif du 2026-09-25 :
// la photo d'Urla était sortie à l'envers, l'orientation EXIF de
// l'original n'était pas appliquée ; `.rotate()` l'applique désormais).
const refaire = process.argv.includes("--refaire");
const filtres = process.argv.slice(2).filter((a) => a !== "--refaire");
await mkdir(DIR_VILLES, { recursive: true });

for (const { base, candidats } of VILLES) {
  if (filtres.length && !filtres.includes(base)) continue;
  if (!refaire && existsSync(join(DIR_VILLES, `${base}-1600w.avif`))) { console.log(`${base} : déjà complète — ignorée.`); reussies.push(base); continue; }
  let ok = false;
  for (const c of candidats) {
    try { await essayer(base, c); ok = true; break; }
    catch (err) { console.error(`   écarté ${c.page || c.fichier} : ${err.message}`); await rm(join(DIR_VILLES, `${base}.jpg`), { force: true }); }
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

console.log(`\nLot 107 photos : ${reussies.length} prête(s)` + (refusees.length ? ` — ${refusees.length} REFUSÉE(S) [${refusees.join(", ")}] : prévenir Claude avant d'aller plus loin.` : "."));
console.log(`Journal des crédits : ${JOURNAL} (${parBase.size} entrée(s)).`);
console.log("\nÉtape suivante : node scripts\\lot.mjs analyser 107-bourse-uir");
if (refusees.length) process.exitCode = 1;
