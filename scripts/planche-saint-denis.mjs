// ============================================================
// FitzUniverse — PLANCHE Saint-Denis, v2 (2026-09-04)
//
// TROIS ÉCHECS DERRIÈRE NOUS, tous passés au vert par des gardes :
//   36b → l'INTÉRIEUR de la nef (licence OK, ratio 1,50).
//   36c → la façade, mais une PLAQUE DE PRESSE DE 1917 (Agence Rol,
//         Gallica, noir et blanc, numéro d'inventaire sur le négatif).
//   v1  → deux candidats seulement, et regardés : n° 1 = gros plan d'un
//         tympan de portail, n° 2 = le flanc nord en contre-plongée sur
//         ciel blanc. Ni l'un ni l'autre ne lit comme une VILLE.
//
// DEUX CAUSES, corrigées ici :
//   1. « portail / portal / tour » figuraient dans mes marqueurs
//      d'extérieur POSITIFS. Un portail est un DÉTAIL d'architecture,
//      pas une vue de ville : c'est lui qui a fait entrer le n° 1.
//      Les détails sont maintenant ÉCARTÉS (tympan, gargouille, rosace,
//      statue, chapiteau, porte, fenêtre, bas-relief…).
//   2. Commons a renvoyé **429 (trop de requêtes)** sur 8 téléchargements
//      d'affilée — et parmi les perdus, les plus prometteurs :
//      « Saint-Denis - Basilique Saint-Denis et l'abbaye », « Saint-Denis
//      îlot Basilique », « Basilica di saint Denis esterno 04 ». On
//      télécharge donc lentement, avec reprise progressive sur 429.
//
// Et un CLASSEMENT, au lieu du seul « le plus large d'abord » : les
// vues d'ENSEMBLE (abbaye, îlot, vue générale, esterno, parvis, place,
// aérienne) passent devant les gros plans.
//
//   node scripts\planche-saint-denis.mjs              → construit la planche
//   node scripts\planche-saint-denis.mjs --garder 4   → promeut le n° 4
//
// La planche vit dans .planche-saint-denis\ (dossier en point : ignoré
// par Firebase Hosting, voir "**/.*" dans firebase.json). À supprimer à
// la main une fois la photo choisie.
//
// La promotion écrit assets/images/cities/saint-denis-basilique.* — LE
// MÊME NOM que la fiche déjà écrite et vérifiée en base : aucun lot à
// relancer, juste un `lot.mjs export` final puis le déploiement.
// ============================================================

import { writeFile, readFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const DIR_PLANCHE = ".planche-saint-denis";
const DIR_VILLES = "assets/images/cities";
const BASE = "saint-denis-basilique";
const WIDTHS = [400, 800, 1200, 1600];
const QUALITY = 92;
const MAX_PLANCHE = 10;
const LARGEUR_MIN = 1600;
const RATIO_MIN = 1.3;
const PAUSE_MS = 2000;

const UA = { "User-Agent": "FitzUniverse-catalogue/1.0 (photos du catalogue ; contact via le dépôt)" };
const API = "https://commons.wikimedia.org/w/api.php";

const LICENCES_OK = /^(cc[- ]by(-sa)?(-[0-9.]+)?|cc0|public domain|pd)/i;

// Pas une photo de ville : l'intérieur du monument.
const INTERIEUR = /(interior|intérieur|interieur|\bnave\b|\bnef\b|choir|ch(œ|oe)ur|crypt|transept|ambulatory|déambulatoire|deambulatoire|stained[- ]glass|vitrai|vitrau|\btomb|tombeau|gisant|effig|organ\b|orgue|altar|autel|pulpit|chapel|chapelle|ceiling|voûte|voute|vault|inside)/i;

// Pas une photo contemporaine : l'archive et l'œuvre d'art.
const ARCHIVE = /(gallica|pd-old|pd-1996|pd-art|pd-scan|pd-france|agence rol|bibliothèque nationale|glass plate|plaque de verre|engraving|gravure|lithograph|etching|eau-forte|drawing|dessin|painting|peinture|\bin art\b|artwork|postcard|carte postale|old photograph|photochrom|daguerr|black[- ]and[- ]white|noir et blanc|\b1[5-9][0-9]{2}\b|\b19[0-8][0-9]\b)/i;

// Pas une vue de ville : le DÉTAIL d'architecture. La garde qui manquait
// à la v1 — « portail » était même dans mes marqueurs positifs.
const DETAIL = /(portail|portal|tympan|gargouille|gargoyle|rosace|\brose\b|statue|sculpture|bas[- ]relief|frieze|frise|chapiteau|capital|\bporte\b|\bdoor\b|fenêtre|window|vantail|linteau|lintel|détail|detail|close[- ]up|inscription|blason|coat of arms|plaque|vitrine)/i;

// Preuve POSITIVE d'extérieur (sans les détails, cette fois).
const EXTERIEUR = /(exterior|esterno|extérieur|exterieur|fa(ç|c)ade|west front|chevet|abbaye|abbey|îlot|ilot|vue générale|general view|ensemble|from the|depuis|\brue\b|street|parvis|square|\bplace\b|aerial|vue aérienne|panorama|skyline|\bville\b|\bcity\b)/i;

// Ce qui fait une VUE D'ENSEMBLE : passe devant, à qualité égale.
const ENSEMBLE = /(abbaye|abbey|îlot|ilot|vue générale|general view|ensemble|esterno|panorama|skyline|aerial|vue aérienne|parvis|\bplace\b|\brue\b|street|from the|depuis|\bville\b|\bcity\b)/i;

const CATEGORIES = [
  "Category:Exterior of Basilique Saint-Denis",
  "Category:Basilique Saint-Denis",
  "Category:Saint-Denis (Seine-Saint-Denis)"
];
const RECHERCHE = 'basilique Saint-Denis extérieur vue';

const dodo = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(params) {
  const url = new URL(API);
  for (const [k, v] of Object.entries({ format: "json", formatversion: "2", ...params })) url.searchParams.set(k, v);
  const rep = await fetch(url, { headers: UA });
  if (!rep.ok) throw new Error(`API Commons : ${rep.status}`);
  return rep.json();
}

// Commons limite le débit : 429 sur huit téléchargements d'affilée à la
// v1. On attend et on réessaie au lieu de perdre le candidat.
async function telecharger(url) {
  const attentes = [3000, 8000, 20000, 45000];
  for (let essai = 0; essai <= attentes.length; essai += 1) {
    const rep = await fetch(url, { headers: UA });
    if (rep.ok) return Buffer.from(await rep.arrayBuffer());
    if (rep.status !== 429 && rep.status !== 503) throw new Error(`téléchargement : ${rep.status}`);
    if (essai === attentes.length) throw new Error(`téléchargement : ${rep.status} après ${essai} reprises`);
    const t = attentes[essai];
    console.log(`      (${rep.status} — reprise dans ${t / 1000}s)`);
    await dodo(t);
  }
}

const texte = (meta, cle) => ((meta[cle] || {}).value || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

async function titresCandidats() {
  const vus = new Set();
  for (const cmtitle of CATEGORIES) {
    try {
      const r = await api({ action: "query", list: "categorymembers", cmtitle, cmtype: "file", cmlimit: "200" });
      for (const m of (r.query && r.query.categorymembers) || []) vus.add(m.title);
      console.log(`  ${cmtitle} : ${vus.size} fichiers cumulés`);
    } catch (e) {
      console.error(`  (${cmtitle} : ${e.message})`);
    }
  }
  try {
    const r = await api({ action: "query", list: "search", srsearch: RECHERCHE, srnamespace: "6", srlimit: "100" });
    for (const m of (r.query && r.query.search) || []) vus.add(m.title);
  } catch (e) {
    console.error(`  (recherche : ${e.message})`);
  }
  return [...vus].filter((t) => /\.(jpe?g|png)$/i.test(t));
}

async function metadonnees(titres) {
  const sortie = [];
  for (let i = 0; i < titres.length; i += 50) {
    const r = await api({ action: "query", titles: titres.slice(i, i + 50).join("|"), prop: "imageinfo", iiprop: "url|size|extmetadata" });
    for (const page of (r.query && r.query.pages) || []) {
      if (!page.imageinfo) continue;
      const info = page.imageinfo[0];
      const meta = info.extmetadata || {};
      sortie.push({
        titre: page.title.replace(/^File:/, ""),
        url: info.url,
        width: info.width,
        height: info.height,
        licence: texte(meta, "LicenseShortName"),
        auteur: texte(meta, "Artist"),
        categories: texte(meta, "Categories").replace(/\|/g, " · "),
        description: texte(meta, "ImageDescription")
      });
    }
  }
  return sortie;
}

const contexte = (c) => `${c.titre} ${c.categories} ${c.description}`;

function motif(c) {
  const ctx = contexte(c);
  const ratio = c.width / c.height;
  if (!LICENCES_OK.test(c.licence)) return `licence « ${c.licence || "?"} »`;
  if (c.width < LARGEUR_MIN) return `largeur ${c.width} < ${LARGEUR_MIN}`;
  if (ratio < RATIO_MIN) return `ratio ${ratio.toFixed(2)} < ${RATIO_MIN} (portrait)`;
  const a = ctx.match(ARCHIVE);
  if (a) return `ARCHIVE/ŒUVRE « ${a[0]} » — la faute du 36c`;
  const i = ctx.match(INTERIEUR);
  if (i) return `INTÉRIEUR « ${i[0]} » — la faute du 36b`;
  const d = ctx.match(DETAIL);
  if (d) return `DÉTAIL « ${d[0]} » — la faute de la v1 (tympan de portail)`;
  if (!EXTERIEUR.test(ctx)) return "aucun marqueur d'extérieur";
  return null;
}

async function derive(reference, dossier, base, avecAvif) {
  for (const width of WIDTHS) {
    const p = sharp(reference).resize({ width, withoutEnlargement: true });
    await p.clone().jpeg({ quality: QUALITY, mozjpeg: true }).toFile(join(dossier, `${base}-${width}w.jpg`));
    await p.clone().webp({ quality: 85 }).toFile(join(dossier, `${base}-${width}w.webp`));
    if (avecAvif) await p.clone().avif({ quality: 60 }).toFile(join(dossier, `${base}-${width}w.avif`));
  }
}

// ---------- Mode PROMOTION ----------
const garder = process.argv.includes("--garder") ? Number(process.argv[process.argv.indexOf("--garder") + 1]) : null;

if (garder) {
  const index = JSON.parse(await readFile(join(DIR_PLANCHE, "index.json"), "utf8"));
  const choix = index.find((e) => e.n === garder);
  if (!choix) {
    console.error(`Aucun candidat n° ${garder} dans la planche (1 à ${index.length}).`);
    process.exit(1);
  }
  const reference = await readFile(join(DIR_PLANCHE, choix.ref));
  const m = await sharp(reference).metadata();
  await writeFile(join(DIR_VILLES, `${BASE}.jpg`), reference);
  await derive(reference, DIR_VILLES, BASE, true);
  console.log(`\nOK ${BASE} : ${m.width}x${m.height} (ratio ${(m.width / m.height).toFixed(2)})`);
  console.log(`   sujet retenu : ${choix.titre}`);
  console.log(`   >>> CREDITS.md (section Wikimedia), REMPLACER l'entrée saint-denis-basilique :`);
  console.log(`       auteur « ${choix.auteur || "NON RENSEIGNÉ"} », licence « ${choix.licence} », source File:${choix.titre}, original ${choix.width}x${choix.height}`);
  console.log(`\nEnsuite : node scripts\\lot.mjs export   puis   firebase deploy --only hosting`);
  console.log(`Le dossier ${DIR_PLANCHE}\\ peut être supprimé à la main.`);
  process.exit(0);
}

// ---------- Mode PLANCHE ----------
await mkdir(DIR_PLANCHE, { recursive: true });
console.log("Collecte des candidats sur Commons…");
const titres = await titresCandidats();
console.log(`${titres.length} fichiers image trouvés. Lecture des métadonnées…\n`);

const tous = await metadonnees(titres);
const gardes = [];
const ecartes = [];
for (const c of tous) {
  const m = motif(c);
  if (m) ecartes.push(`${c.titre} — ${m}`);
  else gardes.push(c);
}

// Vues d'ensemble d'abord, puis la définition.
gardes.sort((a, b) => {
  const ea = ENSEMBLE.test(contexte(a)) ? 1 : 0;
  const eb = ENSEMBLE.test(contexte(b)) ? 1 : 0;
  if (ea !== eb) return eb - ea;
  return b.width - a.width;
});

console.log(`RETENUS : ${gardes.length} — les ${MAX_PLANCHE} premiers seront téléchargés (vues d'ensemble en tête).`);
console.log(`ÉCARTÉS : ${ecartes.length}`);
for (const e of ecartes.slice(0, 20)) console.log(`  - ${e}`);
if (ecartes.length > 20) console.log(`  … et ${ecartes.length - 20} autres`);
console.log(`\nTéléchargement lent (${PAUSE_MS / 1000}s entre deux, reprise sur 429) — comptez ~1 minute.\n`);

const index = [];
let n = 0;
for (const c of gardes) {
  if (n >= MAX_PLANCHE) break;
  try {
    const original = await telecharger(c.url);
    const reference = await sharp(original).resize({ width: 2000, withoutEnlargement: true }).jpeg({ quality: QUALITY, mozjpeg: true }).toBuffer();
    n += 1;
    const num = String(n).padStart(2, "0");
    const ref = `${num}-ref.jpg`;
    await writeFile(join(DIR_PLANCHE, ref), reference);
    await sharp(reference).resize({ width: 800 }).jpeg({ quality: 88, mozjpeg: true }).toFile(join(DIR_PLANCHE, `${num}-planche.jpg`));
    index.push({ n, ref, titre: c.titre, auteur: c.auteur, licence: c.licence, width: c.width, height: c.height, categories: c.categories.slice(0, 200) });
    console.log(`${num}. ${c.titre}`);
    console.log(`    ${c.width}x${c.height} (ratio ${(c.width / c.height).toFixed(2)}) — « ${c.licence} » — ${c.auteur || "auteur non renseigné"}${ENSEMBLE.test(contexte(c)) ? " — VUE D'ENSEMBLE" : ""}`);
  } catch (e) {
    console.error(`  (échec ${c.titre} : ${e.message})`);
  }
  await dodo(PAUSE_MS);
}

await writeFile(join(DIR_PLANCHE, "index.json"), JSON.stringify(index, null, 2), "utf8");

if (!index.length) {
  console.error("\nAucun candidat téléchargé. Les images actuelles restent en place : NE PAS DÉPLOYER, me le dire.");
  process.exitCode = 1;
} else {
  console.log(`\n${index.length} candidats dans ${DIR_PLANCHE}\\ (fichiers NN-planche.jpg).`);
  console.log("Envoyez-moi la sortie : je regarde la planche et je désigne le bon.");
  console.log(`Ensuite : node scripts\\planche-saint-denis.mjs --garder N`);
}
