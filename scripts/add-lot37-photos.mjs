// ============================================================
// FitzUniverse — photos du lot 37 (Tunisie, Algérie, PAUWES — 2026-09-03)
//
// Règle du catalogue appliquée DÈS LE LOT : chaque université a sa photo
// de VILLE (assets/images/cities, JPEG + WebP + AVIF), chaque bourse son
// MONUMENT (assets/images/scholarships, JPEG seul — convention du
// dossier), aucune image partagée.
//
// Chaque entrée porte une LISTE de candidats (Unsplash ou Wikimedia
// Commons), essayés dans l'ordre : le premier qui passe (licence libre,
// ratio ≥ 1,3) est retenu. Tlemcen et le Maqam Echahid sont rares sur
// Unsplash et leurs candidats sont en hauteur : Commons prend le relais.
// Les crédits Commons (auteur, licence) sont AFFICHÉS : à recopier dans
// CREDITS.md.
//
// COMME AUX LOTS 35/36 : rien n'a été REGARDÉ depuis le sandbox. Sujet,
// cadrage, absence de texte : à contrôler à l'œil après ce script, qui
// SAUTE un refus au lieu de s'interrompre. Ordre : ce script, PUIS
// `lot.mjs analyser 37-maghreb` (le lot refuse de se charger si un
// fichier manque).
// ============================================================

import { writeFile, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const WIDTHS = [400, 800, 1200, 1600];
const QUALITY = 92;
const DIR_VILLES = "assets/images/cities";
const DIR_BOURSES = "assets/images/scholarships";
const LICENCES_OK = /^(cc[- ]by(-sa)?(-[0-9.]+)?|cc0|public domain|pd)/i;
const UA = { "User-Agent": "FitzUniverse-catalogue/1.0 (photos du catalogue ; contact via le dépôt)" };

const U = (page, cdn, auteur, sujet) => ({ src: "unsplash", page, cdn, auteur, sujet });
const C = (fichier, sujet) => ({ src: "commons", fichier, sujet });

// --- Villes (universités) ---
const VILLES = [
  { base: "tunis", candidats: [U("6XuI9V3C51I", "photo-1674764186749-ad9beea35e85", "Hammami Ghazi", "Bab Bhar, centre de Tunis"), U("dbVp4jxZz7E", "photo-1726428977866-d6237650c4d6", "Brahim Guedich", "place de la Kasbah, Tunis")] },
  { base: "carthage", candidats: [U("5jaj-mU6VW0", "photo-1728361328876-74e396d3defc", "Martin Casagrand", "ruines de Carthage"), U("cLl9cowwU1Y", "photo-1665063692740-a2063f202bba", "Hamoudi", "Sidi Bou Saïd, commune de Carthage")] },
  { base: "sousse", candidats: [U("V87fJdumBY0", "photo-1624921768886-5d12e2cdc584", "Amal Bourkhis", "médina de Sousse, vue aérienne"), U("WBm8IVW-8oc", "photo-1605196562508-7b0773ab6a3a", "JR Harris", "ribat de Sousse")] },
  { base: "sfax", candidats: [U("WFhrK6g1DKA", "photo-1594424015009-59bef65fa9ec", "Taha Loukil", "médina de Sfax"), U("6CjuVye7aN0", "photo-1594424015102-3e76439bfde0", "Taha Loukil", "remparts de la médina de Sfax, de nuit")] },
  { base: "tlemcen", candidats: [C("Mosquée de Mansourah, Tlemcen, 2024.jpg", "mosquée de Mansourah, Tlemcen"), C("Mansourah Tlemcen city, Algeria.jpg", "Tlemcen depuis Mansourah"), C("Tlemcen, Algeria - Ruin of Mansoura.jpg", "ruines de Mansourah, Tlemcen"), C("Muraille de mansourah,Tlemcen..jpg", "muraille de Mansourah, Tlemcen")] }, // Unsplash FlRrOkGxAck ÉCARTÉE le 2026-09-03 : mur de maison anonyme, vu sur la planche
  { base: "alger-baie", candidats: [U("RCsOlTBX5Tw", "photo-1652614706616-a49396a2ee29", "Sid Ahmed SAOUD", "la baie d'Alger"), U("jHo1miI-ZJE", "photo-1610133290889-0ed892ce5157", "Azzedine Rouichi", "la Casbah et le port d'Alger")] },
  { base: "alger-centre", candidats: [U("YcJjjAv1TA0", "photo-1751788109158-a46f8fbacc08", "Ondrej Bocek", "Alger-Centre, place et escaliers"), U("jHo1miI-ZJE", "photo-1610133290889-0ed892ce5157", "Azzedine Rouichi", "la Casbah et le port d'Alger")] },
  { base: "constantine", candidats: [U("fvqCkzsWv-4", "photo-1664403775784-8a0b32536a0c", "zenad nabil", "pont et gorges du Rhummel, Constantine"), U("0-NbYedFNtk", "photo-1664567960558-641b3fc6213c", "zenad nabil", "pont suspendu de Constantine")] },
  { base: "oran", candidats: [U("jGlnjl6fHhQ", "photo-1653815129496-445487ae0479", "Brahim Abderrahman", "Oran et sa baie vues du fort de Santa Cruz")] } // vEob3rMRUcQ ÉCARTÉE le 2026-09-03 : cour à arcades non identifiable
];

// --- Monuments (bourses) ---
const BOURSES = [
  { base: "bourses-cooperation-tunisie", candidats: [U("5NqUXa6pZDM", "photo-1607869861980-da5f9b8b4969", "Noelle Guirola", "Sidi Bou Saïd"), U("UIUUXRoEj6Q", "photo-1590764536930-11b69515592a", "ferdaous fellah", "Sidi Bou Saïd"), U("aLKef4vISks", "photo-1700459075234-a04dc1800f3f", "Brahim Guedich", "médina de Tunis")] },
  { base: "bourses-cooperation-algerie", candidats: [U("ESkI6T_Ef5A", "photo-1658996403259-5a2dd3efc6fa", "Halima Bouchouicha", "Maqam Echahid, Alger"), U("sb3WvR0osKk", "photo-1784387226156-474cc805b477", "Zineddine Dinar", "la Grande Poste d'Alger")] },
  { base: "pan-african-university-pauwes", candidats: [U("ysL_MNXjJ_4", "photo-1669097564242-3c6c75aea9a0", "Halima Bouchouicha", "minaret de Mansourah, Tlemcen"), C("Mosquée de Mansourah, Tlemcen, 2024.jpg", "mosquée de Mansourah, Tlemcen"), C("Mansoura Tlemcen Algerie (12).JPG", "Mansourah, Tlemcen"), C("Muraille de mansourah,Tlemcen..jpg", "muraille de Mansourah, Tlemcen")] }
];

const reussies = [];
const refusees = [];
const credits = [];

async function ecrire(base, dir, original, avecWebpAvif) {
  const reference = await sharp(original).resize({ width: 2000, withoutEnlargement: true }).jpeg({ quality: QUALITY, mozjpeg: true }).toBuffer();
  const meta = await sharp(reference).metadata();
  const ratio = meta.width / meta.height;
  if (ratio < 1.3) throw new Error(`ratio ${ratio.toFixed(2)} < 1,3 (${meta.width}x${meta.height}) — portrait refusé`);
  await writeFile(join(dir, `${base}.jpg`), reference);
  for (const width of WIDTHS) {
    const pipeline = sharp(reference).resize({ width, withoutEnlargement: true });
    await pipeline.clone().jpeg({ quality: QUALITY, mozjpeg: true }).toFile(join(dir, `${base}-${width}w.jpg`));
    if (avecWebpAvif) {
      await pipeline.clone().webp({ quality: 85 }).toFile(join(dir, `${base}-${width}w.webp`));
      await pipeline.clone().avif({ quality: 60 }).toFile(join(dir, `${base}-${width}w.avif`));
    }
  }
  return `${meta.width}x${meta.height} (ratio ${ratio.toFixed(2)})`;
}

async function essayer(base, dir, c, avecWebpAvif) {
  if (c.src === "unsplash") {
    const rep = await fetch(`https://images.unsplash.com/${c.cdn}?w=2000&q=85&fm=jpg`);
    if (!rep.ok) throw new Error(`Unsplash ${rep.status}`);
    const dims = await ecrire(base, dir, Buffer.from(await rep.arrayBuffer()), avecWebpAvif);
    console.log(`OK ${base} : ${dims} — ${c.sujet} — ${c.auteur}, https://unsplash.com/photos/${c.page}`);
    credits.push(`${base} — Unsplash — ${c.sujet} — ${c.auteur} — CDN ${c.cdn}, page ${c.page}`);
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
  if (info.width / info.height < 1.3) throw new Error(`ratio ${(info.width / info.height).toFixed(2)} < 1,3`);
  const img = await fetch(info.url, { headers: UA });
  if (!img.ok) throw new Error(`téléchargement Commons ${img.status}`);
  const dims = await ecrire(base, dir, Buffer.from(await img.arrayBuffer()), avecWebpAvif);
  console.log(`OK ${base} : ${dims} — ${c.sujet} — Commons, ${auteur}, ${licence}`);
  credits.push(`${base} — Commons — ${c.sujet} — auteur « ${auteur} », licence « ${licence} », source File:${c.fichier}, original ${info.width}x${info.height}`);
}

async function traiterListe(liste, dir, avecWebpAvif, filtres) {
  for (const { base, candidats } of liste) {
    if (filtres.length && !filtres.includes(base)) continue;
    if (existsSync(join(dir, `${base}-1600w.jpg`))) { console.log(`${base} : déjà complète — ignorée.`); reussies.push(base); continue; }
    let ok = false;
    for (const c of candidats) {
      try { await essayer(base, dir, c, avecWebpAvif); ok = true; break; }
      catch (err) { console.error(`   écarté ${c.page || c.fichier} : ${err.message}`); await rm(join(dir, `${base}.jpg`), { force: true }); }
      await new Promise((r) => setTimeout(r, 500));
    }
    (ok ? reussies : refusees).push(base);
    if (!ok) console.error(`REFUSÉE ${base} : aucun candidat retenu.`);
    await new Promise((r) => setTimeout(r, 700));
  }
}

const filtres = process.argv.slice(2);
await traiterListe(VILLES, DIR_VILLES, true, filtres);
await traiterListe(BOURSES, DIR_BOURSES, false, filtres);

console.log(`\nLot 37 photos : ${reussies.length} prête(s) [${reussies.join(", ")}]` + (refusees.length ? ` — ${refusees.length} REFUSÉE(S) [${refusees.join(", ")}] : vider le champ image correspondant dans le lot avant d'écrire.` : "."));
console.log("\n>>> À RECOPIER DANS CREDITS.md :");
for (const l of credits) console.log("   " + l);
console.log("\nREGARDER chaque fichier (sujet, cadrage, pas de texte), puis `node scripts\\lot.mjs analyser 37-maghreb`.");
if (refusees.length) process.exitCode = 1;
