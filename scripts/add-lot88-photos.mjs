// ============================================================
// FitzUniverse — photos du lot 88 (Allemagne), 2026-09-24
//
// Même règle et même mécanique que scripts/add-lot84-photos.mjs :
// chaque université a SA photo de VILLE (assets/images/cities, JPEG +
// WebP + AVIF en 400/800/1200/1600w), jamais partagée, jamais un sujet
// déjà pris par le site. Déjà pris en Allemagne, donc ÉVITÉS : la rue et
// le tramway de Berlin (Humboldt), le clocher de Hambourg, le
// Welfenschloss de Hanovre, et pour les bourses le pont de Heidelberg
// sur le Neckar, la cathédrale de Cologne, les tours de Francfort,
// l'Elbphilharmonie, le beffroi de Leipzig, la photo de Bonn de la
// fondation Konrad-Adenauer et le château de Neuschwanstein.
//
// Les candidats ont été REGARDÉS avant d'écrire ce fichier (deux
// planches du 2026-09-24, au navigateur), et leur lieu relu dans la
// fiche Unsplash. Écartés à l'œil : le pont de Heidelberg (déjà pris),
// la cathédrale de Cologne (déjà prise), la photo de Bonn déjà en place,
// les bâtiments d'université (le château de Poppelsdorf à Bonn).
// Göttingen n'a sur Unsplash aucune photo utilisable : l'ancien hôtel de
// ville vient de Wikimedia Commons (licence CC BY-SA, auteur crédité).
//
// Le premier candidat qui passe les contrôles (licence libre, ratio
// ≥ 1,3, largeur ≥ 1 600 px) est retenu ; un refus est sauté.
// Journal : scripts/data/journal-photos-lot88.json.
//
//   node scripts/add-lot88-photos.mjs            toutes
//   node scripts/add-lot88-photos.mjs mayence-cathedrale   une seule
//
// Ordre : ce script, PUIS `node scripts/lot.mjs analyser 88-allemagne`
// (le lot refuse de se charger si une photo manque).
// ============================================================

import { writeFile, readFile, rm, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const WIDTHS = [400, 800, 1200, 1600];
const QUALITY = 92;
const DIR_VILLES = "assets/images/cities";
const JOURNAL = "scripts/data/journal-photos-lot88.json";
// Licences libres ET commerciales seulement : CC BY, CC BY-SA, CC0,
// domaine public. Une clause NC ou ND ne passe pas.
const LICENCES_OK = /^(cc[- ]by(-sa)?([- ]\d\.\d)?( [a-z]{2,3})?|cc0( 1\.0)?|public domain|pd)$/i;
const UA = { "User-Agent": "FitzUniverse-catalogue/1.0 (photos du catalogue ; contact via le dépôt)" };

const U = (page, cdn, auteur, sujet) => ({ src: "unsplash", page, cdn, auteur, sujet });
const C = (fichier, sujet) => ({ src: "commons", fichier, sujet });

const VILLES = [
  // ---------------- Bavière ----------------
  { base: "munich-frauenkirche", candidats: [
    U("6lwB0GejTDY", "photo-1692726781304-fa1d2f1cc4c5", "Daniel Schmidt", "les deux tours de la Frauenkirche au-dessus des toits de Munich"),
    U("WJsGUDk-x74", "photo-1649609765902-254a227dc960", "Anastasiya Dalenka", "le centre de Munich vu d'en haut")] },
  { base: "munich-marienplatz", candidats: [
    U("H-7zZBodgpM", "photo-1649609766229-a6c0811161a5", "Anastasiya Dalenka", "le nouvel hôtel de ville sur la Marienplatz, Munich"),
    U("O3a2K69WUk8", "photo-1633171413709-c9ae4efeab46", "ian kelsall", "la Marienplatz et ses hôtels de ville, Munich")] },

  // ---------------- Bade-Wurtemberg ----------------
  { base: "heidelberg-chateau", candidats: [
    U("E-Igyj-W7ck", "photo-1748198162816-93dd425137f6", "Eli Omen", "le château de Heidelberg au coucher du soleil"),
    U("Q2ugWU2R2t8", "photo-1714577632110-ab90fe662303", "Sebastian Frederik Jacobsen", "le château de Heidelberg dans les arbres")] },
  { base: "karlsruhe-chateau", candidats: [
    U("y05Z-XD0Frs", "photo-1744761402617-d34192e39434", "Marc Rentschler", "le château de Karlsruhe et ses pelouses"),
    U("SPRaszW7DXI", "photo-1635697598363-39cc50116ca0", "Lāsma Artmane", "le château de Karlsruhe")] },
  { base: "stuttgart-schlossplatz", candidats: [
    U("bvwiunL3iyI", "photo-1778574744503-9c7772f3b9b1", "Margo Evardson", "la Schlossplatz et le Nouveau Château, Stuttgart"),
    U("lQUnXXlVjg0", "photo-1778574744460-70268fbd9636", "Margo Evardson", "la Schlossplatz de Stuttgart un jour d'été")] },
  { base: "fribourg-en-brisgau-cathedrale", candidats: [
    U("4RAyNOpulFk", "photo-1639910269924-e6229de33e95", "David Hertle", "Fribourg-en-Brisgau et la flèche de sa cathédrale")] },

  // ---------------- Rhénanie-du-Nord-Westphalie ----------------
  { base: "aix-la-chapelle-hotel-de-ville", candidats: [
    U("hw0ZD2JJqPc", "photo-1606819788285-5e709f0c798f", "Alexander Schimmeck", "l'hôtel de ville d'Aix-la-Chapelle pendant le marché de Noël"),
    U("daWF_UJP7CI", "photo-1606819788625-8cb0d6953f02", "Alexander Schimmeck", "le marché de Noël d'Aix-la-Chapelle")] },
  { base: "bonn-cerisiers-en-fleurs", candidats: [
    U("ae4VmMbhanQ", "photo-1586789821310-3c0941c56a4f", "Stephan Widua", "les cerisiers en fleurs de la Heerstraße, Bonn"),
    U("9VRHQHJT4fM", "photo-1604910699329-660e534c71c6", "Carolina Nichitin", "le Rhin à Bonn, vers la Post Tower")] },
  { base: "cologne-grue-du-rheinauhafen", candidats: [
    U("s4m74kabDXM", "photo-1571423401107-99e9c7977250", "Chris Hoppe", "une ancienne grue du port du Rheinauhafen, Cologne"),
    U("IE3JvwotSW8", "photo-1570609910613-d74d138970b2", "Leon Shefi", "le Rhin à Cologne, le matin")] },
  { base: "munster-arcades-de-nuit", candidats: [
    U("_5BkX50vkOM", "photo-1610893876081-1e7c076a30c3", "Nico Brüggemann", "les arcades du centre historique de Münster, de nuit")] },

  // ---------------- Hesse ----------------
  { base: "darmstadt-karolinenplatz", candidats: [
    U("sbdwwoT_rcw", "photo-1702307383737-5c6c30a2c650", "Abhinav Das", "la Karolinenplatz de Darmstadt, de nuit"),
    U("mUHT8M5jgeg", "photo-1738875248583-65f8ca0cd2b5", "Jimmy Liu", "un clocher de Darmstadt éclairé la nuit")] },
  { base: "francfort-romerberg", candidats: [
    U("yatyW_GSvBI", "photo-1638648152833-90ee0114f084", "Lāsma Artmane", "la place de la vieille ville de Francfort, le Römerberg"),
    U("4UsmQZVMcoc", "photo-1651178887535-d3d8a3686a8d", "Joshua Kettle", "la vieille ville de Francfort")] },

  // ---------------- Berlin et Saxe ----------------
  { base: "berlin-porte-de-brandebourg", candidats: [
    U("uFGi0_YciE0", "photo-1587330979470-3595ac045ab0", "Florian Wehde", "la porte de Brandebourg éclairée la nuit, Berlin"),
    U("mtfTz0FnwBw", "photo-1554072675-66db59dba46f", "Ansgar Scheffold", "la porte de Brandebourg et la tour de télévision, Berlin")] },
  { base: "berlin-cathedrale", candidats: [
    U("Zr-ZnTNekEY", "photo-1569404225992-9ac478f3c14e", "Christian Ladewig", "la cathédrale de Berlin"),
    U("sjUufQqEnHI", "photo-1509136561942-7d8663edaaa2", "Anthony Reungère", "la cathédrale de Berlin en automne")] },
  { base: "dresde-vieille-ville-et-elbe", candidats: [
    U("9YUsgVnnsTk", "photo-1619120810930-6ca5048deee1", "Oliver Guhr", "la vieille ville de Dresde et ses bateaux à vapeur sur l'Elbe")] },
  { base: "leipzig-monument-bataille-des-nations", candidats: [
    U("XCTL1dnDRP4", "photo-1583602690006-31db03a8b86f", "Chris", "le monument de la Bataille des Nations, Leipzig")] },

  // ---------------- Sarre, Basse-Saxe, Rhénanie-Palatinat ----------------
  { base: "sarrebruck-bord-de-la-sarre", candidats: [
    U("ntHtKyKLDWE", "photo-1706112790751-994699168f4f", "Mariia Yesionova", "un édifice blanc au bord de la Sarre, Sarrebruck"),
    U("BcVDYvncGSI", "photo-1706112789896-1b2b2eb8055e", "Mariia Yesionova", "un édifice blanc à tour d'horloge, Sarrebruck")] },
  { base: "gottingen-ancien-hotel-de-ville", candidats: [
    C("Blick auf das alte Rathaus aus südöstlicher Richtung. Im Vordergrund ist der Marktplatz mit dem Gänseliesel zu sehen. - panoramio.jpg", "l'ancien hôtel de ville et la fontaine de la Gänseliesel, Göttingen"),
    C("Goettingen Marktplatz Oct06.jpg", "la place du Marché et l'ancien hôtel de ville, Göttingen")] },
  { base: "mayence-cathedrale", candidats: [
    U("9c9ES3pmI00", "photo-1636381310700-d6931fc00bce", "Markus Winkler", "la cathédrale de Mayence")] },
];

const reussies = [];
const refusees = [];
const journal = [];

async function ecrire(base, original) {
  const reference = await sharp(original).resize({ width: 2000, withoutEnlargement: true }).jpeg({ quality: QUALITY, mozjpeg: true }).toBuffer();
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
  if (existsSync(join(DIR_VILLES, `${base}-1600w.avif`))) { console.log(`${base} : déjà complète — ignorée.`); reussies.push(base); continue; }
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

console.log(`\nLot 88 photos : ${reussies.length} prête(s)` + (refusees.length ? ` — ${refusees.length} REFUSÉE(S) [${refusees.join(", ")}] : prévenir Claude avant d'aller plus loin.` : "."));
console.log(`Journal des crédits : ${JOURNAL} (${parBase.size} entrée(s)).`);
console.log("\nÉtape suivante : node scripts\\lot.mjs analyser 88-allemagne 2>&1");
if (refusees.length) process.exitCode = 1;
