// ============================================================
// FitzUniverse — photos des lots 76 (Maroc) et 77 (Canada), 2026-09-24
//
// Règle du catalogue : chaque université a SA photo de VILLE
// (assets/images/cities, JPEG + WebP + AVIF en 400/800/1200/1600w),
// jamais partagée, jamais un sujet déjà utilisé par le site. Deux
// établissements d'une même ville montrent deux lieux différents :
// Fès (médina, tanneries), Casablanca (centre, Habous), Rabat (Oudayas,
// Bouregreg), Montréal (six lieux, aucun déjà pris : ni la vue du mont
// Royal, ni la basilique Notre-Dame).
//
// CE QUI CHANGE PAR RAPPORT AUX LOTS 35 À 37 : les candidats ont été
// REGARDÉS avant d'écrire ce fichier (planche du 2026-09-24, au
// navigateur), et l'ordre ci-dessous est celui de ce contrôle. Les
// candidats écartés à l'œil ne sont pas là du tout : pont vu de son
// tablier (Saguenay), photo noir et blanc (Stade olympique), texte
// dominant (marché Atwater, hôtel de ville de Toronto), sujet hors ville
// (Mehdia pour Kénitra, rue de nuit anonyme pour Oujda). Kénitra et
// Oujda passent donc par Wikimedia Commons.
//
// Le premier candidat qui passe les contrôles (licence libre, ratio
// ≥ 1,3) est retenu. Le script SAUTE un refus au lieu de s'interrompre.
//
// NOUVEAU : un JOURNAL, scripts/data/journal-photos-lot76.json, écrit
// à la fin. Il porte pour chaque photo retenue la source, l'auteur, la
// licence et le lien : c'est de lui que CREDITS.md et credits.html sont
// mis à jour, sans rien recopier à la main depuis la console.
//
//   node scripts/add-lot76-photos.mjs            toutes
//   node scripts/add-lot76-photos.mjs fes-tanneries-chouara   une seule
//
// Ordre : ce script, PUIS `node scripts/lot.mjs analyser 76-maroc` et
// `analyser 77-canada` (les lots refusent de se charger si une photo
// manque).
// ============================================================

import { writeFile, readFile, rm, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const WIDTHS = [400, 800, 1200, 1600];
const QUALITY = 92;
const DIR_VILLES = "assets/images/cities";
const JOURNAL = "scripts/data/journal-photos-lot76.json";
// Licences libres ET commerciales seulement : CC BY, CC BY-SA, CC0,
// domaine public. Une clause NC ou ND ne passe pas (l'ancien motif, qui
// ne regardait que le début, les laissait passer).
const LICENCES_OK = /^(cc[- ]by(-sa)?([- ]\d\.\d)?( [a-z]{2,3})?|cc0( 1\.0)?|public domain|pd)$/i;
const UA = { "User-Agent": "FitzUniverse-catalogue/1.0 (photos du catalogue ; contact via le dépôt)" };

const U = (page, cdn, auteur, sujet) => ({ src: "unsplash", page, cdn, auteur, sujet });
const C = (fichier, sujet) => ({ src: "commons", fichier, sujet });

const VILLES = [
  // ---------------- Maroc (lot 76) ----------------
  { base: "fes-medina-vue-d-en-haut", candidats: [
    U("e-6LEkIUvAw", "photo-1585213303814-2ca9c6bcb400", "Selina Bubendorfer", "les toits de la médina de Fès vus d'en haut"),
    U("9FFvBUYmCKQ", "photo-1655376407147-4acdf34667ff", "Matt Dany", "panorama de la médina de Fès"),
    U("uuFcJnLi540", "photo-1582742850838-24590fb39fdc", "Kyle Frost", "la médina de Fès au lever du soleil")] },
  { base: "fes-tanneries-chouara", candidats: [
    U("ZQaEb6kbMhk", "photo-1767936925033-9a5b59925613", "Nichika Sakurai", "les cuves de teinture des tanneries de Fès"),
    U("IK9TN_fX2rs", "photo-1553898439-93ac04cfe972", "Aleks", "la tannerie Chouara vue d'en haut, Fès")] },
  { base: "kenitra-avenue-mohammed-v", candidats: [
    C("Kenitra Avenue Mohamed V.JPG", "l'avenue Mohammed-V, centre de Kénitra")] },
  { base: "oujda-bab-el-gharbi", candidats: [
    C("Oujda. place de bab al gharbi.jpg", "la place Bab el Gharbi, Oujda"),
    C("Bab lgherbi.jpg", "Bab el Gharbi, Oujda")] },
  { base: "tetouan-ville-blanche", candidats: [
    U("egd0IU4wVy0", "photo-1579894461465-e8cdbe670cd1", "Maddie Leopardo", "maisons blanches et coupole, Tétouan"),
    U("kNRSTRJEZK8", "photo-1695601187773-4cc9137cf1b9", "Othman Alghanmi", "Tétouan vue d'une colline")] },
  { base: "agadir-plage-et-baie", candidats: [
    U("7MzuWztc8kY", "photo-1710092538995-4af0c11a3f3c", "SnapSaga", "la plage d'Agadir et sa colline"),
    U("Z4E0gFbcugQ", "photo-1702840648310-bfaacb533afb", "SnapSaga", "la plage d'Agadir au soir")] },
  { base: "el-jadida-theatre-mohamed-afifi", candidats: [
    U("hOUO9K73kjw", "photo-1652336019253-249003bf441f", "AYOUB OUAZIZI", "le théâtre Mohamed Afifi, El Jadida")] },
  { base: "meknes-remparts", candidats: [
    U("EK4gB5I6HWU", "photo-1706793989006-f0238c69f4a2", "Tomasz Anusiewicz", "les remparts de Meknès")] },
  { base: "settat-monument-du-cheval", candidats: [
    U("e6OvVi1vzkI", "photo-1704129656777-91194f1ddf40", "oussama laabidate", "le monument du cheval, Settat"),
    U("J9YPEnMuUEk", "photo-1704129654969-f4a30eb41650", "oussama laabidate", "la statue du cheval sur sa colonne, Settat")] },
  { base: "beni-mellal-vue-des-hauteurs", candidats: [
    U("e-z4GQpC43k", "photo-1652720187538-b1894af2dc35", "Oussama Abouchatir", "Béni Mellal vue d'une colline"),
    U("Dl0jWkTm_b4", "photo-1782938913921-62a2f47922fe", "AZIZ KOURI", "panorama de Béni Mellal")] },
  { base: "rabat-kasbah-des-oudayas", candidats: [
    U("rOlf7H5kALM", "photo-1758441011898-4e0e93c1942f", "Sheila C", "la plage de Rabat au pied de la kasbah des Oudayas"),
    U("bdYgjjlxvCo", "photo-1763838546113-81c013af03b4", "Xhiliana", "les remparts des Oudayas au-dessus de l'océan, Rabat")] },
  { base: "rabat-sale-marina-du-bouregreg", candidats: [
    U("Y-yQ5pEoP6o", "photo-1634324708844-7dd4b01b9191", "Souhail BIDA", "la marina du Bouregreg, côté Salé"),
    U("88j3odyPnYw", "photo-1582639529208-c5a630e3c55c", "Youssef D", "barques sur le Bouregreg, Rabat")] },
  { base: "casablanca-centre-ville-vu-d-en-haut", candidats: [
    U("hr31kfHe0Ao", "photo-1693532088390-d278b7cefed0", "Barry Talley", "les toits et immeubles de Casablanca"),
    U("3xtkv4deqhE", "photo-1579017461826-8ea20d5cdb28", "you deal", "le centre de Casablanca vu du ciel"),
    U("G1lFZ76gpeQ", "photo-1723225035980-141efd2f4a52", "badr badine", "la place Al Yassir et son tramway, Casablanca")] },
  { base: "casablanca-quartier-des-habous", candidats: [
    U("9JwZJD2-eew", "photo-1710211653847-d9a1657b0044", "Thales Botelho de Sousa", "une rue du quartier des Habous, Casablanca"),
    U("6zuwRqiTvJ0", "photo-1710211653894-dca97880cd2e", "Thales Botelho de Sousa", "rue commerçante des Habous, Casablanca")] },

  // ---------------- Canada (lot 77) ----------------
  { base: "quebec-chateau-frontenac", candidats: [
    U("w3xwKSSsFh4", "photo-1691516094855-809c50352aad", "Robert Macleod", "le Château Frontenac, Québec"),
    U("mWcg6CsDS_g", "photo-1695126016000-0567810ecdaa", "clement proust", "le Château Frontenac sur son promontoire")] },
  { base: "montreal-oratoire-saint-joseph", candidats: [
    U("vmff7d4g578", "photo-1592927857753-74e95148e02e", "Ahmed Neji", "l'oratoire Saint-Joseph, Montréal"),
    U("XKNXTyNzowg", "photo-1735160898742-2e4a7e120a4b", "Arthur (arisdla)", "l'oratoire Saint-Joseph et son dôme vert"),
    U("j8ph-h7SseU", "photo-1651457195938-42393e881a91", "Francis Xavier", "l'oratoire Saint-Joseph et son dôme")] },
  { base: "montreal-quartier-des-spectacles", candidats: [
    U("GItUM-nHVpw", "photo-1713274843857-84ac856d8471", "Dmitri M", "le Quartier des spectacles, Montréal"),
    U("i1HuF4mc7fM", "photo-1586117652181-1e68b751cc1b", "Manny Fortin", "la Place des Arts, Montréal")] },
  { base: "montreal-pont-jacques-cartier", candidats: [
    U("ni1ZCLFrcoY", "photo-1573492614524-e526f7f14b92", "Pascal Bernardon", "le pont Jacques-Cartier, Montréal"),
    U("c7UaXxmEwHM", "photo-1573492614636-f8ef3cfb37c2", "Pascal Bernardon", "le pont Jacques-Cartier de jour")] },
  { base: "montreal-stade-olympique", candidats: [
    U("X2OWQ3_pijc", "photo-1741924831592-64c4c907122d", "Jonathan Gagnon", "la tour du Stade olympique, Montréal")] },
  { base: "montreal-canal-de-lachine", candidats: [
    U("gu3jDlYzh4E", "photo-1699719506497-e941ad8f9701", "Pascal Bernardon", "le canal de Lachine et le marché Atwater, Montréal")] },
  { base: "montreal-habitat-67", candidats: [
    U("gSF2C2cuI34", "photo-1576443730831-02377debbff3", "philippe collard", "Habitat 67, Montréal"),
    U("zis0xceeKl8", "photo-1687440759235-b76c65685163", "Dana Andreea Gheorghe", "Habitat 67, Montréal")] },
  { base: "sherbrooke-vue-panoramique", candidats: [
    U("BWImWnGf40M", "photo-1652152026826-f7ceb8618422", "Adrien (add_rien_20)", "Sherbrooke dans sa vallée"),
    U("TXg7QGEnxn8", "photo-1652152027098-f262a2a90082", "Adrien (add_rien_20)", "Sherbrooke dans sa vallée"),
    U("d9uJbYzXFfs", "photo-1706009731040-7701affadce3", "Mathis Mauprivez", "Sherbrooke et sa rivière vues du ciel")] },
  { base: "trois-rivieres-pont-laviolette", candidats: [
    U("sUZ8XIruxnw", "photo-1778693640973-9b44990875dd", "Patrice S Dorsainville", "le pont Laviolette, Trois-Rivières"),
    U("C7DVY3TKXJA", "photo-1711731359612-6017e64cfc9f", "Pascal Bernardon", "le pont Laviolette en panorama")] },
  { base: "saguenay-chicoutimi-riviere-saguenay", candidats: [
    U("0FMvE6nO34o", "photo-1607122997098-5315d01e15b3", "Andre Ouellet", "Chicoutimi reflété dans la rivière Saguenay"),
    U("rZW6-Tr_TT8", "photo-1612500488537-77ef9ee355f1", "Louis Dupressoir", "la rivière Saguenay à Chicoutimi")] },
  { base: "rimouski-parc-du-bic", candidats: [
    U("THhNS4SRJxI", "photo-1731780029485-a1ed06d4f732", "Eric Parenteau", "le parc du Bic au bord du Saint-Laurent, Rimouski"),
    U("vUI_UqbyEbA", "photo-1731289648286-7e16367f76a4", "Eric Parenteau", "le parc du Bic en hiver, Rimouski")] },
  { base: "gatineau-musee-canadien-histoire", candidats: [
    U("tscxlKO4so0", "photo-1687710413165-090b41377237", "snap shoot (s_napshoot)", "le Musée canadien de l'histoire, Gatineau"),
    U("zs58Rc9ebLU", "photo-1622322973005-393d6c93b45e", "AH Morgan", "l'architecture du Musée canadien de l'histoire")] },
  { base: "ottawa-canal-rideau", candidats: [
    U("mlLoSetZABg", "photo-1727529802175-318920001940", "Caio Fernandes", "le canal Rideau gelé, Ottawa"),
    U("Ftf-2rae1mA", "photo-1785190422761-520d5a382292", "Alex Carriere", "les écluses du canal Rideau, Ottawa")] },
  { base: "moncton-centre-ville", candidats: [
    U("rw9I-b2o6bQ", "photo-1716668295838-a56cff6c641b", "Dat Tran", "le centre-ville de Moncton et sa tour de l'horloge")] },
  { base: "winnipeg-la-fourche-riviere-rouge", candidats: [
    U("uzp3jisBY7Y", "photo-1764276128259-15b02d37c3d8", "Cohen Berg", "la rivière Rouge et le centre de Winnipeg"),
    U("6EDhkOm3TbQ", "photo-1591658523269-4f48b4210c58", "m (brydoncreative)", "La Fourche vue du ciel, Winnipeg")] },
  { base: "edmonton-vallee-saskatchewan-nord", candidats: [
    U("PrmS75_I2QI", "photo-1656638706997-11ec84e134d9", "Derek Otway", "la vallée de la Saskatchewan Nord et Edmonton"),
    U("qc7PDr6xJOo", "photo-1667405069190-f03e61ffd035", "Fred Amini", "la rivière et le centre d'Edmonton"),
    U("-O84qJNN9aA", "photo-1729822581672-8ab662ca57b3", "Ziyao Xiong", "un pont sur la Saskatchewan Nord, Edmonton")] },
  { base: "toronto-hotel-de-ville-nathan-phillips", candidats: [
    U("NdTG0o-uZ5M", "photo-1573452996379-d0e623356520", "Photostore HK", "le Nathan Phillips Square et l'hôtel de ville, Toronto"),
    U("G6ZLNo28z2k", "photo-1446846365537-255ea07833ec", "Scott Webb", "l'hôtel de ville de Toronto")] }
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

console.log(`\nLots 76-77 photos : ${reussies.length} prête(s)` + (refusees.length ? ` — ${refusees.length} REFUSÉE(S) [${refusees.join(", ")}] : prévenir Claude avant d'aller plus loin.` : "."));
console.log(`Journal des crédits : ${JOURNAL} (${parBase.size} entrée(s)).`);
console.log("\nÉtape suivante : node scripts\\lot.mjs analyser 76-maroc");
if (refusees.length) process.exitCode = 1;
