// ============================================================
// FitzUniverse — lot 81 : seize photos de ville REMPLACÉES par des
// photos dont la source est connue (2026-09-24)
//
// Ces seize fichiers n'avaient AUCUN crédit, et leur source n'a pas pu
// être retrouvée (empreinte visuelle contre la recherche Unsplash, voir
// CREDITS.md, « Provenance non établie »). Charles a demandé de les
// remplacer. Deux avaient en plus un sujet faible : porto.jpg (un
// immeuble vu d'un parking) et wuhan.jpg (des pagodes jumelles qu'on
// ne pouvait pas rattacher à Wuhan).
//
// Chaque candidat a été REGARDÉ au navigateur avant d'être écrit ici,
// et sa fiche Unsplash donne le lieu (champ « location ») : c'est bien
// la ville de l'université. Même sujet que l'ancienne photo quand il
// était bon (la main de Homigot à Pohang, l'hôtel de ville de Louvain,
// les hanok à Séoul), jamais un sujet déjà pris par une autre carte :
// à Marrakech, la Koutoubia sert déjà à la bourse Mastercard (UM6P),
// on prend Jemaa el-Fna.
//
// Les fichiers sont réécrits SOUS LE MÊME NOM : aucun lot Firestore.
// Tout est préparé en mémoire avant la première écriture (voir
// ecrire()). Le premier candidat qui passe est retenu, le second sert
// de secours.
//
//   node scripts/add-lot81-photos.mjs            les seize
//   node scripts/add-lot81-photos.mjs porto      une seule
//
// Ensuite : prévenir Claude, qui regarde les seize fichiers 800w puis
// met à jour CREDITS.md et credits.html depuis le journal.
// ============================================================

import { writeFile, readFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const WIDTHS = [400, 800, 1200, 1600];
const QUALITY = 92;
const DIR_VILLES = "assets/images/cities";
const JOURNAL = "scripts/data/journal-photos-lot81.json";
// Licences libres ET commerciales seulement : CC BY, CC BY-SA, CC0,
// domaine public. Une clause NC ou ND ne passe pas (l'ancien motif, qui
// ne regardait que le début, les laissait passer).
const LICENCES_OK = /^(cc[- ]by(-sa)?([- ]\d\.\d)?( [a-z]{2,3})?|cc0( 1\.0)?|public domain|pd)$/i;
const UA = { "User-Agent": "FitzUniverse-catalogue/1.0 (photos du catalogue ; contact via le dépôt)" };

const U = (page, cdn, auteur, sujet) => ({ src: "unsplash", page, cdn, auteur, sujet });
const C = (fichier, sujet) => ({ src: "commons", fichier, sujet });

const VILLES = [
  { base: "capetown", candidats: [
    U("1GgWbP74phY", "photo-1580060839134-75a5edca2e99", "Tobias Reich", "Le Cap, la montagne de la Table et le stade vus du ciel"),
    U("kpdWINVf3JI", "photo-1585061528750-3baca2cb6a10", "Marlin Clark", "Le Cap et la montagne de la Table vus du ciel")] },
  { base: "chengdu", candidats: [
    U("NumSJRpNUc8", "photo-1725076021478-173130f22f06", "pengfei Jin", "le pont Anshun et les tours de Chengdu"),
    U("zZKCzKGcNi0", "photo-1617571666183-159b12b8d20d", "Andreas Felske", "le pont Anshun, Chengdu")] },
  { base: "gothenburg", candidats: [
    U("TqeGF4M-Jqk", "photo-1662067164467-4a3f303f4824", "Hans Ott", "le Stora Hamnkanalen et ses façades, Göteborg"),
    U("20qv9cTILhU", "photo-1548194128-2e8440ccd6d7", "Jonas Jacobsson", "un canal du centre de Göteborg")] },
  { base: "hefei", candidats: [
    U("imYKxcVODCc", "photo-1597006419785-f77591f53d75", "Francisco Kemeny", "les tours de Hefei"),
    U("iT3ZWoDpD4M", "photo-1694443576027-52db37ac37a2", "Dong Xu", "Hefei vue d'en haut")] },
  { base: "johannesburg", candidats: [
    U("_h-L45TSmGM", "photo-1636706519609-988babca3dd5", "Simon Hurry", "les tours du centre de Johannesburg"),
    U("iAsUCcNUpGI", "photo-1604348489791-f95132c5d8c0", "Steffen Lemmerzahl", "Johannesburg à l'aube")] },
  { base: "karts-seoul", candidats: [
    U("cv3rLk4aNvc", "photo-1703825864792-5880081beaaf", "Elliot Gouy", "une ruelle de maisons traditionnelles à Anguk, Séoul"),
    U("-e6Xu27_T50", "photo-1535189043414-47a3c49a0bed", "Y K", "une ruelle de hanok à Séoul")] },
  { base: "krakow", candidats: [
    U("Uuhv9tA9eOI", "photo-1699791915109-c227726d2457", "Tomasz Zielonka", "la place du Marché et la halle aux draps, Cracovie"),
    U("2lK0291iNHI", "photo-1636903364559-0dfc358abd94", "Tomasz Tomal", "la place du Marché de Cracovie")] },
  { base: "leuven", candidats: [
    U("YXnXW6qTqgg", "photo-1684698769392-c6404a6427cb", "Winston Tjia", "l'hôtel de ville de Louvain"),
    U("Pr1ZTVXJz_8", "photo-1559592073-fb80a3fe112b", "kevin liebens", "la place Oude Markt, Louvain")] },
  { base: "lisbon", candidats: [
    U("K3XGEoZgA0s", "photo-1548707309-dcebeab9ea9b", "Claudio Schwarz", "la place du Commerce, Lisbonne"),
    U("X87yB-jvYHw", "photo-1525207934214-58e69a8f8a3e", "Andreas Brücker", "Lisbonne au coucher du soleil")] },
  { base: "marrakech", candidats: [
    U("7a_PHX91su8", "photo-1587974928442-77dc3e0dba72", "CALIN STAN", "la place Jemaa el-Fna, Marrakech"),
    U("FP9g9fNk9zA", "photo-1579283135011-0974a412341a", "Selina Bubendorfer", "la place Jemaa el-Fna vue d'en haut, Marrakech")] },
  { base: "namur", candidats: [
    U("f5Y3y1d_lic", "photo-1604413287507-b74b4e05cbad", "Alex Vasey", "Namur vue d'en haut"),
    U("9Muw_heaLOM", "photo-1697726951710-13c4833ae415", "Compagnons", "la citadelle et la ville de Namur")] },
  { base: "pohang", candidats: [
    U("GW6t6MKqbiM", "photo-1634805249588-48152bc9f729", "Drew Bae", "la main de bronze de Homigot sortant de la mer, Pohang"),
    U("8Ip4POdhf94", "photo-1610385652321-055f30f9dc55", "dk choi", "la main de Homigot face à la mer, Pohang")] },
  { base: "porto", candidats: [
    U("6ckFibuzLAU", "photo-1555881400-89d5a9c86668", "Nick Karvounis", "le pont Dom-Luís-Ier et les barques du Douro, Porto"),
    U("Prb-sjOUBFs", "photo-1555881400-74d7acaacd8b", "Nick Karvounis", "les quais de la Ribeira, Porto")] },
  { base: "stockholm", candidats: [
    U("uF4PfwZPOR8", "photo-1588653818221-2651ec1a6423", "Ana Bórquez", "Riddarholmen et ses reflets, Stockholm"),
    U("lqWf-yoQztI", "photo-1580339841933-f06ca55842d0", "Adam Gavlák", "Gamla stan vu de l'eau, Stockholm")] },
  { base: "warsaw", candidats: [
    U("p6gxHYb43v0", "photo-1577133192629-5140c5371590", "Lāsma Artmane", "la place du Château et la colonne de Sigismond, Varsovie"),
    U("okn8ZIjPMxI", "photo-1553422734-fd8dd260a116", "Maksym Harbar", "la place de la vieille ville de Varsovie")] },
  { base: "wuhan", candidats: [
    U("C2z6-TWsooU", "photo-1682082286090-0c8651b52004", "Bo Zhang", "la tour de la Grue jaune, Wuhan"),
    U("wwbjsrYw_Go", "photo-1696903619380-db0c500020d0", "Christian Feng", "l'ancienne douane de Jianghan, Wuhan")] },
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

console.log(`\nLot 81 photos : ${reussies.length} prête(s)` + (refusees.length ? ` — ${refusees.length} REFUSÉE(S) [${refusees.join(", ")}] : prévenir Claude avant d'aller plus loin.` : "."));
console.log(`Journal des crédits : ${JOURNAL} (${parBase.size} entrée(s)).`);
console.log("\nÉtape suivante : prévenir Claude (il regarde les seize photos avant les crédits).");
if (refusees.length) process.exitCode = 1;
