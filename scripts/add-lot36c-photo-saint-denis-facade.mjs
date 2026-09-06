// ============================================================
// FitzUniverse — Saint-Denis, 2ᵉ tentative : la FAÇADE, pas la nef
// (2026-09-04)
//
// POURQUOI CE SCRIPT EXISTE
// `add-lot36b-photo-saint-denis.mjs` a retenu son premier candidat,
// « Saint Denis - La Basilique 2.jpg » : licence libre, ratio 1,5, tout
// au vert — et c'est L'INTÉRIEUR DE LA NEF. Exactement le défaut que
// l'utilisateur avait signalé sur le Stade de France (« l'intérieur ne
// lit pas comme une ville »). Regardé le 2026-09-04, écarté.
//
// Deux leçons, toutes deux appliquées ici :
//   1. Aucune garde automatique ne voyait le problème : licence et
//      ratio ne disent RIEN du sujet. Ce script lit donc en plus les
//      CATÉGORIES et la DESCRIPTION Commons du fichier, et refuse tout
//      ce qui porte un marqueur d'intérieur (nef, chœur, crypte,
//      vitrail, gisant, orgue, tombeau…). La machine ne voit pas, mais
//      elle sait LIRE les métadonnées — c'est un cran de plus que le
//      nom de fichier, qui n'a jamais été une preuve du sujet.
//   2. Les noms de fichiers devinés ne suffisent pas. Après la liste
//      explicite, le script INTERROGE Commons lui-même (catégorie
//      « Exterior of Basilique Saint-Denis », puis recherche plein
//      texte) au lieu de s'arrêter faute de candidat.
//
// MÊME NOM DE FICHIER que le lot 36-saint-denis (`saint-denis-basilique`),
// déjà écrit et vérifié en base : ce script REMPLACE les images, aucun
// nouveau patch n'est nécessaire, rien à relancer côté `lot.mjs`.
//
// Après exécution : REGARDER le fichier (moi, pas vous), puis recopier
// le crédit affiché dans CREDITS.md, puis `firebase deploy --only hosting`.
// ============================================================

import { writeFile, rm } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const WIDTHS = [400, 800, 1200, 1600];
const QUALITY = 92;
const DIR = "assets/images/cities";
const BASE = "saint-denis-basilique";
const LARGEUR_MIN = 1600;

const LICENCES_OK = /^(cc[- ]by(-sa)?(-[0-9.]+)?|cc0|public domain|pd)/i;

// Marqueurs d'INTÉRIEUR — cherchés dans le titre, les catégories et la
// description. C'est la garde qui manquait au lot 36b.
const INTERIEUR = /(interior|intérieur|interieur|\bnave\b|\bnef\b|choir|ch(œ|oe)ur|crypt|crypte|transept|ambulatory|déambulatoire|deambulatoire|stained[- ]glass|vitrai|vitrau|tomb|tombeau|gisant|effigy|effigie|organ\b|orgue|altar|autel|pulpit|chapel|chapelle|ceiling|voûte|voute|vault|column|colonne|pillar|pilier|inside)/i;

// Marqueurs d'EXTÉRIEUR — au moins un doit apparaître : on veut une
// preuve positive, pas seulement l'absence de preuve du contraire.
const EXTERIEUR = /(exterior|extérieur|exterieur|fa(ç|c)ade|west front|portail|portal|tour|tower|spire|flèche|fleche|chevet|abside vue|vue générale|general view|from the|depuis|rue|street|parvis|square|place)/i;

const UA = { "User-Agent": "FitzUniverse-catalogue/1.0 (photos du catalogue ; contact via le dépôt)" };
const API = "https://commons.wikimedia.org/w/api.php";

// 1) Candidats explicites, façade uniquement (les deux « façade ouest »
//    de la liste du lot 36b, jamais atteints puisque la nef passait en
//    premier).
const CANDIDATS = [
  "Basilique St Denis façade ouest St Denis Seine St Denis 16.jpg",
  "Basilique St Denis façade ouest St Denis Seine St Denis 20.jpg",
  "Saint-Denis - Façade.jpg",
  "Basilique Saint-Denis façade occidentale.jpg"
];

async function api(params) {
  const url = new URL(API);
  for (const [k, v] of Object.entries({ format: "json", formatversion: "2", ...params })) url.searchParams.set(k, v);
  const rep = await fetch(url, { headers: UA });
  if (!rep.ok) throw new Error(`API Commons : ${rep.status}`);
  return rep.json();
}

// 2) Si la liste explicite ne donne rien : demander à Commons.
async function candidatsAutomatiques() {
  const titres = [];
  try {
    const cat = await api({
      action: "query", list: "categorymembers",
      cmtitle: "Category:Exterior of Basilique Saint-Denis",
      cmtype: "file", cmlimit: "50"
    });
    for (const m of (cat.query && cat.query.categorymembers) || []) titres.push(m.title.replace(/^File:/, ""));
  } catch (e) {
    console.error(`  (catégorie Commons injoignable : ${e.message})`);
  }
  if (!titres.length) {
    try {
      const rech = await api({
        action: "query", list: "search",
        srsearch: 'basilique Saint-Denis façade extérieur filetype:bitmap',
        srnamespace: "6", srlimit: "50"
      });
      for (const m of (rech.query && rech.query.search) || []) titres.push(m.title.replace(/^File:/, ""));
    } catch (e) {
      console.error(`  (recherche Commons injoignable : ${e.message})`);
    }
  }
  return titres.filter((t) => /\.(jpe?g|png)$/i.test(t));
}

async function infos(fichier) {
  const rep = await api({
    action: "query", titles: `File:${fichier}`,
    prop: "imageinfo", iiprop: "url|size|extmetadata"
  });
  const page = (rep.query.pages || [])[0];
  if (!page || !page.imageinfo) throw new Error("fichier introuvable sur Commons");
  const info = page.imageinfo[0];
  const meta = info.extmetadata || {};
  const texte = (v) => ((meta[v] || {}).value || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return {
    url: info.url,
    width: info.width,
    height: info.height,
    licence: texte("LicenseShortName"),
    auteur: texte("Artist"),
    categories: texte("Categories").replace(/\|/g, " · "),
    description: texte("ImageDescription")
  };
}

async function essayer(fichier) {
  const i = await infos(fichier);
  const ratio = i.width / i.height;
  const contexte = `${fichier} ${i.categories} ${i.description}`;

  console.log(`\nCommons ${fichier}`);
  console.log(`  ${i.width}x${i.height} (ratio ${ratio.toFixed(2)}) — licence « ${i.licence} » — auteur « ${i.auteur || "NON RENSEIGNÉ"} »`);
  if (i.categories) console.log(`  catégories : ${i.categories.slice(0, 220)}`);

  if (!LICENCES_OK.test(i.licence)) throw new Error(`licence « ${i.licence} » non acceptée`);
  if (ratio < 1.3) throw new Error(`ratio ${ratio.toFixed(2)} < 1,3 — la carte est une fente 2:1`);
  if (i.width < LARGEUR_MIN) throw new Error(`largeur ${i.width} < ${LARGEUR_MIN}px`);
  const dedans = contexte.match(INTERIEUR);
  if (dedans) throw new Error(`marqueur d'INTÉRIEUR « ${dedans[0]} » — c'est la faute du lot 36b, on ne la refait pas`);
  if (!EXTERIEUR.test(contexte)) throw new Error("aucun marqueur d'extérieur (façade, portail, tour, vue générale…) — sujet non prouvé");

  const img = await fetch(i.url, { headers: UA });
  if (!img.ok) throw new Error(`téléchargement Commons : ${img.status}`);
  const original = Buffer.from(await img.arrayBuffer());
  const reference = await sharp(original).resize({ width: 2000, withoutEnlargement: true }).jpeg({ quality: QUALITY, mozjpeg: true }).toBuffer();
  const m = await sharp(reference).metadata();

  await writeFile(join(DIR, `${BASE}.jpg`), reference);
  for (const width of WIDTHS) {
    const pipeline = sharp(reference).resize({ width, withoutEnlargement: true });
    await pipeline.clone().jpeg({ quality: QUALITY, mozjpeg: true }).toFile(join(DIR, `${BASE}-${width}w.jpg`));
    await pipeline.clone().webp({ quality: 85 }).toFile(join(DIR, `${BASE}-${width}w.webp`));
    await pipeline.clone().avif({ quality: 60 }).toFile(join(DIR, `${BASE}-${width}w.avif`));
  }

  console.log(`\nOK ${BASE} : ${m.width}x${m.height} (ratio ${(m.width / m.height).toFixed(2)}) — façade de la basilique de Saint-Denis`);
  console.log(`   >>> CREDITS.md (section Wikimedia), REMPLACER l'entrée saint-denis-basilique du 2026-09-03 :`);
  console.log(`       auteur « ${i.auteur} », licence « ${i.licence} », source File:${fichier}, original ${i.width}x${i.height}`);
  return true;
}

let retenue = false;

for (const fichier of CANDIDATS) {
  try {
    retenue = await essayer(fichier);
    if (retenue) break;
  } catch (e) {
    console.error(`  ÉCARTÉ : ${e.message}`);
    await rm(join(DIR, `${BASE}.jpg`), { force: true });
  }
}

if (!retenue) {
  console.log("\nListe explicite épuisée — interrogation de Commons…");
  for (const fichier of await candidatsAutomatiques()) {
    try {
      retenue = await essayer(fichier);
      if (retenue) break;
    } catch (e) {
      console.error(`  ÉCARTÉ : ${e.message}`);
      await rm(join(DIR, `${BASE}.jpg`), { force: true });
    }
  }
}

if (!retenue) {
  console.error("\nAucun candidat retenu. Les images de la NEF sont toujours en place : NE PAS DÉPLOYER, me le dire.");
  process.exitCode = 1;
} else {
  console.log("\nFait. Envoyez-moi la sortie : je REGARDE l'image avant tout déploiement.");
  console.log("Aucun lot à relancer — le nom de fichier n'a pas changé.");
}
