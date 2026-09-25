// ============================================================
// FitzUniverse — photos du lot 90 (Malaisie), 2026-09-25
//
// Copie du script du lot 89 (orientation EXIF appliquée par
// `.rotate()`, option --refaire). Chaque université a SA photo de
// VILLE (assets/images/cities, JPEG + WebP + AVIF en 400/800/1200/1600w),
// jamais partagée, jamais un sujet déjà pris par le site. Déjà pris en
// Malaisie, donc ÉVITÉS : les tours Petronas (Universiti Malaya), la
// tour Merdeka 118 et l'horizon de Kuala Lumpur (kualalumpur.jpg), les
// grottes de Batu (bourse MIS). Planche validée par Charles au
// navigateur le 2026-09-25 ; lieu relu dans la fiche Unsplash ou la
// description Commons.
// Substitutions assumées : UPM (Serdang) reçoit la mosquée Putra de
// Putrajaya, sa voisine ; UTP (Seri Iskandar) reçoit le château de
// Kellie, à Batu Gajah, à une vingtaine de kilomètres.
//
// Le premier candidat qui passe les contrôles (licence libre, ratio
// ≥ 1,3, largeur ≥ 1 600 px) est retenu ; un refus est sauté.
// Journal : scripts/data/journal-photos-lot90.json.
//
//   node scripts/add-lot90-photos.mjs              toutes
//   node scripts/add-lot90-photos.mjs bangi-nuit   une seule
//
// Ordre : ce script, PUIS `node scripts/lot.mjs analyser 90-malaisie`
// (le lot refuse de se charger si une photo manque).
// ============================================================

import { writeFile, readFile, rm, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const WIDTHS = [400, 800, 1200, 1600];
const QUALITY = 92;
const DIR_VILLES = "assets/images/cities";
const JOURNAL = "scripts/data/journal-photos-lot90.json";
// Licences libres ET commerciales seulement : CC BY, CC BY-SA, CC0,
// domaine public. Une clause NC ou ND ne passe pas.
const LICENCES_OK = /^(cc[- ]by(-sa)?([- ]\d\.\d)?( [a-z]{2,3})?|cc0( 1\.0)?|public domain|pd)$/i;
const UA = { "User-Agent": "FitzUniverse-catalogue/1.0 (photos du catalogue ; contact via le dépôt)" };

const U = (page, cdn, auteur, sujet) => ({ src: "unsplash", page, cdn, auteur, sujet });
const C = (fichier, sujet) => ({ src: "commons", fichier, sujet });

const VILLES = [
  { base: "penang-kek-lok-si", candidats: [
    U("Cs-vCRDsHho", "photo-1620488212381-dea91f7dd69a", "ONG WEI", "le temple de Kek Lok Si et sa pagode blanche, Air Itam, Penang")] },
  { base: "putrajaya-mosquee-putra", candidats: [
    C("Masjid Putra, Putrajaya.jpg", "la mosquée Putra au bord du lac, Putrajaya, voisine de Serdang")] },
  { base: "bangi-nuit", candidats: [
    C("Bangi night time from hotel.jpg", "Bangi de nuit, vue d'une tour"),
    C("Kariah Bangi Mosque.jpg", "la mosquée de Bangi")] },
  { base: "johor-bahru-front-de-mer", candidats: [
    U("MAGKY0NYl2Y", "photo-1610917125146-8536b0199df8", "Afifi Zulkifle", "le front de mer de Johor Bahru au coucher du soleil")] },
  { base: "batu-gajah-kellie", candidats: [
    C("Kellie's Castle Batu Gajah.jpg", "le château de Kellie à Batu Gajah, à une vingtaine de kilomètres de Seri Iskandar"),
    C("Kellie's Castle main building.JPG", "le château de Kellie, Batu Gajah")] },
  { base: "sintok-mosquee", candidats: [
    C("Sultan Badlishah Mosque.jpg", "la mosquée Sultan Badlishah, Sintok")] },
  { base: "gombak-bukit-tabur", candidats: [
    U("yVcmWsT2wvU", "photo-1665971428347-4b5dbacd1e09", "James T", "la crête de Bukit Tabur, Gombak")] },
  { base: "pekan-musee-mosquee", candidats: [
    C("Pekan 13.jpg", "l'ancienne mosquée Sultan Abdullah devenue musée, Pekan")] },
  { base: "kajang-nuit", candidats: [
    C("Kajang town at night.jpg", "le centre de Kajang de nuit")] },
  { base: "cyberjaya-vue", candidats: [
    U("jziJ5IBqXPM", "photo-1592755137776-d4b1d0c98b57", "Laurentiu Morariu", "Cyberjaya vue d'en haut")] },
  { base: "subang-jaya-ss15", candidats: [
    C("SS15 skyline from SS15 LRT Station (220711) 01.jpg", "le quartier SS15 de Subang Jaya vu de la gare"),
    C("KJ Line SS15 Overall View 1.jpg", "la gare SS15 de Subang Jaya")] },
  { base: "bandar-sunway-lac", candidats: [
    C("Bandar Sunway - South Quay Lake.jpg", "le lac South Quay à Bandar Sunway")] },
  { base: "kuala-lumpur-sultan-abdul-samad", candidats: [
    U("vqxnSwBhN0Y", "photo-1663237155810-a292cca8fe47", "Yosuke Ota", "le bâtiment Sultan Abdul Samad et sa tour de l'horloge, place Merdeka, Kuala Lumpur")] },
  { base: "bukit-jalil-stade", candidats: [
    C("Bukit Jalil National Stadium (220713).jpg", "le stade national de Bukit Jalil"),
    C("Axiata Arena, Bukit Jalil (220713).jpg", "l'Axiata Arena, Bukit Jalil")] },
  { base: "nilai-tour-horloge", candidats: [
    C("Clock tower, Nilai Square, Nilai.jpg", "la tour de l'horloge de Nilai Square, Nilai")] },
  { base: "kota-damansara-vue", candidats: [
    C("Aerial view of Kota Damansara from Emporis Kota Damansara 20230226 175946.jpg", "Kota Damansara vue d'en haut")] },
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

console.log(`\nLot 90 photos : ${reussies.length} prête(s)` + (refusees.length ? ` — ${refusees.length} REFUSÉE(S) [${refusees.join(", ")}] : prévenir Claude avant d'aller plus loin.` : "."));
console.log(`Journal des crédits : ${JOURNAL} (${parBase.size} entrée(s)).`);
console.log("\nÉtape suivante : node scripts\\lot.mjs analyser 90-malaisie 2>&1");
if (refusees.length) process.exitCode = 1;
