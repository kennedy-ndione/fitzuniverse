// ============================================================
// FitzUniverse — photos du lot 36 (France, consolidation — 2026-09-03)
//
// 18 photos de VILLE, une par établissement (règle du catalogue : chaque
// université a sa photo de ville, aucune image partagée). Sujets choisis
// pour ne doubler AUCUN sujet déjà en place : Paris (Louvre, Sorbonne,
// Panthéon, BnF, tour Eiffel, Orsay, Luxembourg, Notre-Dame, Arc de
// Triomphe, pont Alexandre-III, Invalides), Lyon (vue aérienne,
// Fourvière), Grenoble (bulles, quais de l'Isère), Versailles, Gif.
//
// Déclinaisons attendues par resolveCityImage() : référence 2000px +
// 400/800/1200/1600w en JPEG q92 mozjpeg, WebP et AVIF.
//
// HEC (Jouy-en-Josas) et ESSEC (Cergy) : aucune photo Unsplash de la
// ville ; Wikimedia Commons est tenté D'ABORD (API interrogée ici, le
// sandbox n'y accède pas) — licence CC exigée, auteur AFFICHÉ à recopier
// dans CREDITS.md — puis repli Unsplash sur la vallée de Chevreuse /
// les bords de l'Oise, les deux paysages des communes voisines.
//
// COMME AUX LOTS 35 : le sandbox n'a pas REGARDÉ ces images (pages
// Unsplash vérifiées : licence gratuite, champ Location, description).
// Sujet, ratio, absence de texte : à contrôler à l'œil après ce script,
// qui SAUTE un refus au lieu de s'interrompre. Ordre : ce script, PUIS
// `lot.mjs analyser 36-france` (le lot refuse de se charger si un
// fichier manque).
// ============================================================

import { writeFile, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const WIDTHS = [400, 800, 1200, 1600];
const QUALITY = 92;
const DIR = "assets/images/cities";

const UNSPLASH = [
  { base: "strasbourg", sujet: "quartier de la Petite France, Strasbourg", cdn: "photo-1596036986070-e84592a19917", page: "Cq4BqP4IYN4", auteur: "Lucile Noiriel" },
  { base: "marseille", sujet: "le Vieux-Port de Marseille", cdn: "photo-1759244569310-0c4fa51434ff", page: "qetNTyxJRcs", auteur: "Sebastien Devocelle" },
  { base: "toulouse", sujet: "le Capitole de Toulouse", cdn: "photo-1650707199496-b02442055332", page: "vNyGKzCUfAU", auteur: "Korng Sok" },
  { base: "bordeaux", sujet: "place de la Bourse et miroir d'eau, Bordeaux", cdn: "photo-1698608216843-67ae1151b2b8", page: "ZtrpZX8ZGx8", auteur: "Wojciech Rzepka" },
  { base: "lille", sujet: "la Grand-Place de Lille", cdn: "photo-1764671708519-447591cd8179", page: "riAzFTGPCGc", auteur: "Martin Robac" },
  { base: "montpellier", sujet: "place de la Comédie, Montpellier", cdn: "photo-1666886677737-2cd1f108e080", page: "2DxcRRxedUQ", auteur: "Héctor J. Rivas" },
  { base: "nantes", sujet: "le Grand Éléphant des Machines de l'île, Nantes", cdn: "photo-1676283898167-addc4238bee8", page: "LxJ5FHD495Y", auteur: "Pascal Bernardon" },
  { base: "rennes", sujet: "place du Parlement de Bretagne, Rennes", cdn: "photo-1724516042952-63ee061f6980", page: "t3LUVgkXnCg", auteur: "Thanh Ly" },
  { base: "nancy", sujet: "place Stanislas, Nancy", cdn: "photo-1614891202431-e4ba6b3d9edb", page: "s2bAvgNZ6vI", auteur: "Gérard GRIFFAY" },
  { base: "nice", sujet: "baie des Anges et promenade des Anglais, Nice", cdn: "photo-1784840232787-74d27de8557c", page: "aCkb4PPolGI", auteur: "Pierre Goiffon" },
  { base: "lyon-tete-d-or", sujet: "parc de la Tête d'Or, Lyon", cdn: "photo-1761144459402-80182d476772", page: "uvCaQjAPx60", auteur: "Thomas K" },
  { base: "lyon-bellecour", sujet: "place Bellecour, Lyon", cdn: "photo-1775359226314-d74827afffcb", page: "3v_bZOM_XTs", auteur: "Tuan P." },
  { base: "paris-sacre-coeur", sujet: "basilique du Sacré-Cœur, Montmartre", cdn: "photo-1561370665-7e266065fce1", page: "NgiEm-SbXZg", auteur: "DAVID TAPIA SAN MARTIN" },
  { base: "paris-fondation-louis-vuitton", sujet: "Fondation Louis Vuitton, bois de Boulogne", cdn: "photo-1597041151430-e11bed3c1973", page: "N_2OP0Ul7us", auteur: "Louis Colbee" },
  { base: "saint-denis-stade-de-france", sujet: "le Stade de France, Saint-Denis", cdn: "photo-1646350639591-e324c3e72b9c", page: "N38vLBBypS0", auteur: "Denise Jans" },
  { base: "paris-pont-neuf", sujet: "le Pont-Neuf sur la Seine, Paris", cdn: "photo-1624209060513-2b1b76ed0caa", page: "SkgPTTk_eXE", auteur: "Bastien Nvs" }
];

// Commons d'abord, Unsplash (paysage des environs) en repli.
const MIXTES = [
  {
    base: "hec-jouy-en-josas",
    commons: ["Chateau, HEC Paris, Jouy-en-Josas, South view 20160501 1.jpg", "HEC Paris entrée.JPG"],
    repli: { sujet: "vallée de Chevreuse (Yvelines), aux portes de Jouy-en-Josas", cdn: "photo-1453053131046-5aea58348d50", page: "JgGiG2bMtSM", auteur: "Nima Izadi" }
  },
  {
    base: "essec-cergy",
    commons: ["ESSEC campus cergy.jpg", "ESSEC-Business-School.jpg"],
    repli: { sujet: "bords de l'Oise à Pontoise (agglomération de Cergy-Pontoise)", cdn: "photo-1729972403656-f94b4c8e4fa8", page: "KeMSz3yUN0c", auteur: "Yves Destours" }
  }
];

const LICENCES_OK = /^(cc[- ]by(-sa)?(-[0-9.]+)?|cc0|public domain|pd)/i;
const UA = { "User-Agent": "FitzUniverse-catalogue/1.0 (photos du catalogue ; contact via le dépôt)" };

const reussies = [];
const refusees = [];

async function traiter(base, original, etiquette) {
  const reference = await sharp(original).resize({ width: 2000, withoutEnlargement: true }).jpeg({ quality: QUALITY, mozjpeg: true }).toBuffer();
  const meta = await sharp(reference).metadata();
  const ratio = meta.width / meta.height;
  if (ratio < 1.3) throw new Error(`ratio ${ratio.toFixed(2)} < 1,3 (${meta.width}x${meta.height}) — portrait refusé, la carte est une fente 2:1.`);
  await writeFile(join(DIR, `${base}.jpg`), reference);
  for (const width of WIDTHS) {
    const pipeline = sharp(reference).resize({ width, withoutEnlargement: true });
    await pipeline.clone().jpeg({ quality: QUALITY, mozjpeg: true }).toFile(join(DIR, `${base}-${width}w.jpg`));
    await pipeline.clone().webp({ quality: 85 }).toFile(join(DIR, `${base}-${width}w.webp`));
    await pipeline.clone().avif({ quality: 60 }).toFile(join(DIR, `${base}-${width}w.avif`));
  }
  console.log(`OK ${base} : ${meta.width}x${meta.height} (ratio ${ratio.toFixed(2)}) — ${etiquette}`);
}

async function depuisUnsplash(base, p) {
  const reponse = await fetch(`https://images.unsplash.com/${p.cdn}?w=2000&q=85&fm=jpg`);
  if (!reponse.ok) throw new Error(`téléchargement Unsplash refusé (${reponse.status})`);
  await traiter(base, Buffer.from(await reponse.arrayBuffer()), `${p.sujet} — ${p.auteur}, https://unsplash.com/photos/${p.page}`);
}

async function depuisCommons(base, fichier) {
  const api = new URL("https://commons.wikimedia.org/w/api.php");
  api.searchParams.set("action", "query");
  api.searchParams.set("titles", `File:${fichier}`);
  api.searchParams.set("prop", "imageinfo");
  api.searchParams.set("iiprop", "url|size|extmetadata");
  api.searchParams.set("format", "json");
  const rep = await fetch(api, { headers: UA });
  if (!rep.ok) throw new Error(`API Commons : ${rep.status}`);
  const page = Object.values((await rep.json()).query.pages)[0];
  if (!page.imageinfo) throw new Error("fichier introuvable sur Commons");
  const info = page.imageinfo[0];
  const meta = info.extmetadata || {};
  const licence = (meta.LicenseShortName || {}).value || "";
  const auteur = ((meta.Artist || {}).value || "").replace(/<[^>]+>/g, "").trim();
  const ratio = info.width / info.height;
  console.log(`Commons ${fichier} : ${info.width}x${info.height} (ratio ${ratio.toFixed(2)}) — licence « ${licence} » — auteur « ${auteur || "NON RENSEIGNÉ"} »`);
  if (!LICENCES_OK.test(licence)) throw new Error(`licence « ${licence} » non acceptée`);
  if (ratio < 1.3) throw new Error(`ratio ${ratio.toFixed(2)} < 1,3`);
  const img = await fetch(info.url, { headers: UA });
  if (!img.ok) throw new Error(`téléchargement Commons : ${img.status}`);
  await traiter(base, Buffer.from(await img.arrayBuffer()), `Commons — ${auteur}, ${licence}, https://commons.wikimedia.org/wiki/File:${encodeURIComponent(fichier)}`);
  console.log(`   >>> À RECOPIER DANS CREDITS.md (section Wikimedia) : ${base} — auteur « ${auteur} », licence « ${licence} », source File:${fichier}`);
}

const filtres = process.argv.slice(2);
const veut = (base) => !filtres.length || filtres.includes(base);
const dejaFaite = (base) => existsSync(join(DIR, `${base}-1600w.avif`));

for (const p of UNSPLASH) {
  if (!veut(p.base)) continue;
  if (dejaFaite(p.base)) { console.log(`${p.base} : déjà complète — ignorée.`); reussies.push(p.base); continue; }
  try {
    await depuisUnsplash(p.base, p);
    reussies.push(p.base);
  } catch (err) {
    console.error(`REFUSÉE ${p.base} : ${err.message}`);
    await rm(join(DIR, `${p.base}.jpg`), { force: true });
    refusees.push(p.base);
  }
  await new Promise((r) => setTimeout(r, 700));
}

for (const m of MIXTES) {
  if (!veut(m.base)) continue;
  if (dejaFaite(m.base)) { console.log(`${m.base} : déjà complète — ignorée.`); reussies.push(m.base); continue; }
  let ok = false;
  for (const fichier of m.commons) {
    try { await depuisCommons(m.base, fichier); ok = true; break; }
    catch (err) { console.error(`ÉCARTÉ Commons ${fichier} : ${err.message}`); await rm(join(DIR, `${m.base}.jpg`), { force: true }); }
  }
  if (!ok) {
    try { console.log(`${m.base} : repli Unsplash (paysage des environs)`); await depuisUnsplash(m.base, m.repli); ok = true; }
    catch (err) { console.error(`REFUSÉE ${m.base} : ${err.message}`); await rm(join(DIR, `${m.base}.jpg`), { force: true }); }
  }
  (ok ? reussies : refusees).push(m.base);
  await new Promise((r) => setTimeout(r, 700));
}

console.log(`\nLot 36 photos : ${reussies.length} prête(s) [${reussies.join(", ")}]` + (refusees.length ? ` — ${refusees.length} REFUSÉE(S) [${refusees.join(", ")}] : vider le champ image de ces établissements dans le lot avant d'écrire.` : "."));
console.log("REGARDER chaque fichier (sujet, cadrage, pas de texte), puis `node scripts\\lot.mjs analyser 36-france`.");
if (refusees.length) process.exitCode = 1;
