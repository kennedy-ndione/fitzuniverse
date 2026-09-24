// ============================================================
// FitzUniverse — photos du lot 84 (Roumanie), 2026-09-24
//
// Même règle et même mécanique que scripts/add-lot76-photos.mjs :
// chaque université a SA photo de VILLE (assets/images/cities, JPEG +
// WebP + AVIF en 400/800/1200/1600w), jamais partagée, jamais un sujet
// déjà pris par le site. Déjà pris en Roumanie, donc ÉVITÉS : l'arc de
// triomphe et la vue aérienne de Bucarest, la statue de Matthias
// Corvin et les maisons colorées de Cluj, le palais de la Culture de
// Iași, le château de Bran.
//
// Les candidats ont été REGARDÉS avant d'écrire ce fichier (planche du
// 2026-09-24, au navigateur), et leur lieu relu dans la fiche Unsplash
// quand elle le donne. Écartés à l'œil : un bâtiment d'université
// (Politehnica de Timișoara), l'église Saint-Michel de Cluj déjà
// visible derrière la statue de Corvin, des photos sans rapport avec la
// ville (animaux, intérieurs). Craiova n'a sur Unsplash qu'une photo
// utilisable : la place Mihai-Viteazul vient de Wikimedia Commons.
//
// Le premier candidat qui passe les contrôles (licence libre, ratio
// ≥ 1,3, largeur ≥ 1 600 px) est retenu ; un refus est sauté.
// Journal : scripts/data/journal-photos-lot84.json.
//
//   node scripts/add-lot84-photos.mjs            toutes
//   node scripts/add-lot84-photos.mjs sibiu-grande-place   une seule
//
// Ordre : ce script, PUIS `node scripts/lot.mjs analyser 84-roumanie`
// (le lot refuse de se charger si une photo manque).
// ============================================================

import { writeFile, readFile, rm, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const WIDTHS = [400, 800, 1200, 1600];
const QUALITY = 92;
const DIR_VILLES = "assets/images/cities";
const JOURNAL = "scripts/data/journal-photos-lot84.json";
// Licences libres ET commerciales seulement : CC BY, CC BY-SA, CC0,
// domaine public. Une clause NC ou ND ne passe pas (l'ancien motif, qui
// ne regardait que le début, les laissait passer).
const LICENCES_OK = /^(cc[- ]by(-sa)?([- ]\d\.\d)?( [a-z]{2,3})?|cc0( 1\.0)?|public domain|pd)$/i;
const UA = { "User-Agent": "FitzUniverse-catalogue/1.0 (photos du catalogue ; contact via le dépôt)" };

const U = (page, cdn, auteur, sujet) => ({ src: "unsplash", page, cdn, auteur, sujet });
const C = (fichier, sujet) => ({ src: "commons", fichier, sujet });

const VILLES = [
  // ---------------- Cluj-Napoca ----------------
  { base: "cluj-napoca-theatre-national", candidats: [
    U("1Sm2b6K85ZE", "photo-1622569061848-8be92da6fde2", "Lucut Razvan", "le Théâtre national de Cluj-Napoca"),
    U("ruqNWXz2eRg", "photo-1738686373369-d83d5eba53b6", "Biro Zoltan", "le Théâtre national de Cluj-Napoca, de nuit")] },
  { base: "cluj-napoca-vue-sur-les-toits", candidats: [
    U("LC54UhNn95M", "photo-1583751636643-94790958040a", "Tamas Pap", "les toits de Cluj-Napoca sous un ciel nuageux"),
    U("u450hw1m_f0", "photo-1572805645502-c6cf9bdbbc77", "Lorena Tintea", "les toits de Cluj-Napoca vus d'une colline")] },
  { base: "cluj-napoca-reflets-au-bord-de-l-eau", candidats: [
    U("SzWrRCo7_0E", "photo-1514489793613-577418d65ae1", "Sinziana Susa", "des immeubles de Cluj-Napoca reflétés dans l'eau")] },

  // ---------------- Iași ----------------
  { base: "iasi-ensemble-palas-de-nuit", candidats: [
    U("6mTQUk3RHjo", "photo-1570771696100-83d4df94f09b", "Tudor Baciu", "le quartier Palas de Iași, de nuit")] },
  { base: "iasi-vue-nocturne-des-collines", candidats: [
    U("sXkVCq3MzX4", "photo-1553960346-80863a247704", "Tudor Baciu", "Iași au crépuscule, vue des collines")] },
  { base: "iasi-tramway-du-centre", candidats: [
    U("MCWeK5YtC3c", "photo-1784393222467-24d393535366", "David Stroia", "un tramway sur un boulevard de Iași"),
    U("EGmHLwBo0b0", "photo-1784393222475-94d2a0a2aa91", "David Stroia", "un tramway dans une rue de Iași au soleil couchant")] },

  // ---------------- Timișoara ----------------
  { base: "timisoara-immeubles-du-centre", candidats: [
    U("vF3cl3QsnTM", "photo-1687696162212-73aed15d7e6b", "Bogdan Vlad", "immeubles du début du XXe siècle au centre de Timișoara")] },
  { base: "timisoara-cathedrale-metropolitaine", candidats: [
    U("2GfqKcZZGpo", "photo-1693074893993-aeb2339d00c3", "Cristian Coaja", "la cathédrale métropolitaine de Timișoara, de nuit"),
    U("J2Lb7REl5yA", "photo-1687696162053-0358eea87c8b", "Bogdan Vlad", "la cathédrale métropolitaine de Timișoara au-dessus du parc")] },
  { base: "timisoara-piata-unirii", candidats: [
    U("4cajbfV-QqM", "photo-1687696162729-a75f9ddc004d", "Bogdan Vlad", "la place de l'Union, Timișoara"),
    U("dUYKSsonOEw", "photo-1699359104158-18970636cff9", "Rebecca Hausner", "la place de l'Union et ses façades baroques, Timișoara")] },

  // ---------------- Bucarest ----------------
  { base: "bucarest-athenee-roumain", candidats: [
    U("lwqOS1Lkyhc", "photo-1586808538936-5b921bbe92d9", "Aidan Joyce", "l'Athénée roumain, Bucarest"),
    U("pfK5VOyLLVY", "photo-1706191418928-a5c99f34e893", "Fildan Gabriele", "le dôme de l'Athénée roumain, Bucarest")] },
  { base: "bucarest-palais-du-parlement", candidats: [
    U("2D9qjPHazVk", "photo-1730120257566-9f4b7f37f20d", "Winston Tjia", "le palais du Parlement, Bucarest")] },

  // ---------------- Craiova ----------------
  { base: "craiova-parc-nicolae-romanescu", candidats: [
    U("O_CmbSd84Io", "photo-1644920367938-ed407e658794", "Cimpueru Filip", "le parc Nicolae-Romanescu, Craiova")] },
  { base: "craiova-place-mihai-viteazul", candidats: [
    C("Plaza Craiova.JPG", "la place Mihai-Viteazul et le palais administratif, Craiova")] },

  // ---------------- Brașov, Sibiu, Constanța, Târgu Mureș, Galați ----------------
  { base: "brasov-vieille-ville-et-eglise-noire", candidats: [
    U("v_0Nj6vdq4o", "photo-1636288087131-7e912d7d37cf", "Daniela Turcanu", "la vieille ville de Brașov et l'Église noire"),
    U("PV1tisUCIiQ", "photo-1555423414-36ac96bd6a1e", "Florin Gorgan", "l'Église noire dans la brume, Brașov")] },
  { base: "sibiu-grande-place", candidats: [
    U("pkUsKFmAQIM", "photo-1456491882918-2bc1929963f6", "Alisa Anton", "la Grande Place de Sibiu")] },
  { base: "constanta-casino", candidats: [
    U("Cjyv6Lcc6Ac", "photo-1582122149104-548d9ead3ff1", "Ruxandra Gogea", "le casino de Constanța")] },
  { base: "targu-mures-citadelle", candidats: [
    U("UxOaJoyjI4s", "photo-1635182508069-73a718391c42", "M. X.", "la citadelle de Târgu Mureș en automne")] },
  { base: "galati-promenade-du-danube", candidats: [
    U("8HuFkoTQItQ", "photo-1664912879009-fcf1fb932009", "Paladuta Stefan", "Galați et la promenade du Danube, vue du ciel"),
    U("M9yu6Eo2FdY", "photo-1662912010005-b78241da50fb", "Paladuta Stefan", "Galați vue du ciel, avec le Danube au loin")] }
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

console.log(`\nLot 84 photos : ${reussies.length} prête(s)` + (refusees.length ? ` — ${refusees.length} REFUSÉE(S) [${refusees.join(", ")}] : prévenir Claude avant d'aller plus loin.` : "."));
console.log(`Journal des crédits : ${JOURNAL} (${parBase.size} entrée(s)).`);
console.log("\nÉtape suivante : node scripts\\lot.mjs analyser 84-roumanie 2>&1");
if (refusees.length) process.exitCode = 1;
