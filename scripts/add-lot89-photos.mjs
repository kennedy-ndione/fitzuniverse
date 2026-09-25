// ============================================================
// FitzUniverse — photos du lot 89 (Turquie), 2026-09-25
//
// Même règle et même mécanique que scripts/add-lot88-photos.mjs :
// chaque université a SA photo de VILLE (assets/images/cities, JPEG +
// WebP + AVIF en 400/800/1200/1600w), jamais partagée, jamais un sujet
// déjà pris par le site. Déjà pris en Turquie, donc ÉVITÉS : la tour de
// Galata vue du Bosphore (Boğaziçi, istanbul.jpg), la skyline aux
// mosquées (Istanbul Üniversitesi), la tour de Léandre (ITU), Rumeli
// Hisarı (Koç), le Bosphore et Çamlıca (Sabancı), la citadelle d'Ankara
// (Bilkent) ; et pour les bourses : Anıtkabir, les montgolfières de
// Cappadoce, la tour de l'Horloge d'Izmir, le mausolée de Mevlana à
// Konya, une mosquée ottomane. Candidats choisis sur planche au
// navigateur le 2026-09-25, lieu relu dans la fiche Unsplash (ville
// renseignée) ; Urla, Gebze et Serdivan viennent de Wikimedia Commons.
// Écartée à l'œil : une porte monumentale d'université (Istanbul).
//
// Le premier candidat qui passe les contrôles (licence libre, ratio
// ≥ 1,3, largeur ≥ 1 600 px) est retenu ; un refus est sauté.
// Journal : scripts/data/journal-photos-lot89.json.
//
//   node scripts/add-lot89-photos.mjs            toutes
//   node scripts/add-lot89-photos.mjs urla-port  une seule
//
// Ordre : ce script, PUIS `node scripts/lot.mjs analyser 89-turquie`
// (le lot refuse de se charger si une photo manque).
// ============================================================

import { writeFile, readFile, rm, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const WIDTHS = [400, 800, 1200, 1600];
const QUALITY = 92;
const DIR_VILLES = "assets/images/cities";
const JOURNAL = "scripts/data/journal-photos-lot89.json";
// Licences libres ET commerciales seulement : CC BY, CC BY-SA, CC0,
// domaine public. Une clause NC ou ND ne passe pas.
const LICENCES_OK = /^(cc[- ]by(-sa)?([- ]\d\.\d)?( [a-z]{2,3})?|cc0( 1\.0)?|public domain|pd)$/i;
const UA = { "User-Agent": "FitzUniverse-catalogue/1.0 (photos du catalogue ; contact via le dépôt)" };

const U = (page, cdn, auteur, sujet) => ({ src: "unsplash", page, cdn, auteur, sujet });
const C = (fichier, sujet) => ({ src: "commons", fichier, sujet });

const VILLES = [
  // ---------------- Ankara ----------------
  { base: "ankara-atakule", candidats: [
    U("xYM7T6l9M0g", "photo-1787255700155-2d3dcfd3be3a", "Cengiz Özarpat", "la tour Atakule et son dôme de verre, Ankara"),
    U("42tuYr7QarQ", "photo-1619602480389-d7334ec9a206", "Çağlar Oskay", "Ankara et la tour Atakule, vues du parc du 50e anniversaire")] },
  { base: "ankara-grande-mosquee", candidats: [
    U("c9cYtNCXzRs", "photo-1771738841091-49dda284e8fe", "ekrem osmanoglu", "une grande mosquée d'Ankara et ses quatre minarets"),
    U("w5NYrTTdV60", "photo-1773211323543-8b217251e0a5", "ekrem osmanoglu", "une grande mosquée d'Ankara sous un ciel nuageux")] },
  { base: "ankara-vue-aerienne", candidats: [
    U("S9ULqp6XWps", "photo-1584816152587-382580af2d85", "ekrem osmanoglu", "Ankara vue d'en haut"),
    U("kgAhA1rt3Qg", "photo-1582224738455-ca31e4bf5217", "ekrem osmanoglu", "l'horizon d'Ankara un jour de ciel bleu")] },

  // ---------------- Istanbul ----------------
  { base: "istanbul-dolmabahce", candidats: [
    U("G4E_ZfGhaGg", "photo-1601565465051-67971a2d838c", "Berkin Üregen", "le palais de Dolmabahçe vu du Bosphore, Istanbul"),
    U("bdWAAbGLVYA", "photo-1739524318403-05fe79333d25", "Georgii Eletskikh", "la porte du palais de Dolmabahçe, Istanbul")] },
  { base: "istanbul-ortakoy", candidats: [
    U("O1n-f15L668", "photo-1763965368246-5e89755e4455", "Spenser Sembrat", "la mosquée d'Ortaköy et le pont du Bosphore au coucher du soleil, Istanbul"),
    U("JnLp1kus3Ks", "photo-1605581810011-c6d684e7ca22", "Michael Jerrard", "la mosquée d'Ortaköy à l'heure dorée, Istanbul")] },
  { base: "istanbul-mosquee-bleue", candidats: [
    U("QLXwWbismFA", "photo-1593544648982-cf4bbfb8fc38", "Lewis J Goetz", "la mosquée Bleue et son parc, Istanbul")] },
  { base: "istanbul-sainte-sophie", candidats: [
    U("34PWUSxBNiU", "photo-1777985329764-f19172bc9aa7", "Husien Bisky", "Sainte-Sophie et ses minarets, Istanbul")] },

  // ---------------- Kocaeli, Sakarya ----------------
  { base: "gebze-centre", candidats: [
    C("Gebze Merkez (20221116).jpg", "le centre de Gebze"),
    C("Gebze Kocaeli - panoramio.jpg", "une avenue de Gebze")] },
  { base: "serdivan-sakarya", candidats: [
    C("Serdivan, Sakarya.jpg", "Serdivan et la plaine de Sakarya vues d'en haut")] },

  // ---------------- Izmir ----------------
  { base: "izmir-baie", candidats: [
    U("wQLJSvJd6nw", "photo-1676845720871-493d7d821481", "Mert Kahveci", "la baie d'Izmir vue des hauteurs"),
    U("0_Cq1M9KlSI", "photo-1682360194949-ce97ef6714de", "Oleksandr Korenivskyi", "la baie d'Izmir et ses quartiers")] },
  { base: "izmir-tramway", candidats: [
    U("j49sLH08tM0", "photo-1719688550738-c7186f2494b8", "Parastoo Maleki", "le tramway d'Izmir entre les immeubles"),
    U("J2ovUoNN9bk", "photo-1688743433138-fe7b1b1dad25", "ismail yazıcı", "Izmir au bord de sa baie")] },
  { base: "urla-port", candidats: [
    C("İzmir Urla İskele.jpg", "le port d'Urla et ses bateaux de pêche")] },

  // ---------------- Anatolie ----------------
  { base: "konya-mosquee", candidats: [
    U("WU87q6Rkzm8", "photo-1759930019002-1361e69bf74e", "ekrem osmanoglu", "une grande mosquée à coupoles de Konya"),
    U("wzxi-zhATKg", "photo-1759930018645-67ca077737e4", "ekrem osmanoglu", "une mosquée de Konya au coucher du soleil")] },
  { base: "kayseri-mont-erciyes", candidats: [
    U("mKsW6suT6yc", "photo-1654004669656-0c2408ccdb95", "Ömer Haktan Bulut", "Kayseri et le mont Erciyes enneigé")] },
  { base: "erzurum-hiver", candidats: [
    U("6tH3ikiuTjg", "photo-1635433084393-c569daa8b0d5", "Alperen Tosun", "Erzurum sous la neige et sa tour de l'horloge"),
    U("pJmQ1kRriuM", "photo-1691350589276-ac2b45bfdae4", "Ahmed Emre Özdemir", "un tombeau seldjoukide d'Erzurum")] },
  { base: "safranbolu-vue", candidats: [
    U("lf_3JfVcEno", "photo-1578999305993-6a63f621cca6", "ekrem osmanoglu", "Safranbolu, ville des facultés de l'université de Karabük, vue d'en haut"),
    U("grjpwLR2uF8", "photo-1594036863222-0416669b07e0", "Melih Piranlıoğlu", "les maisons ottomanes de Safranbolu")] },
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

console.log(`\nLot 89 photos : ${reussies.length} prête(s)` + (refusees.length ? ` — ${refusees.length} REFUSÉE(S) [${refusees.join(", ")}] : prévenir Claude avant d'aller plus loin.` : "."));
console.log(`Journal des crédits : ${JOURNAL} (${parBase.size} entrée(s)).`);
console.log("\nÉtape suivante : node scripts\\lot.mjs analyser 89-turquie 2>&1");
if (refusees.length) process.exitCode = 1;
