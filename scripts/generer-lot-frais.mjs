// ============================================================
// FitzUniverse — générateur du lot « frais » DEPUIS le journal (lot D2)
//
//     node scripts/generer-lot-frais.mjs scripts/data/journal-frais-france-2026-09-07.md 45-frais-france
//
// POURQUOI CE FICHIER
// Jamais une valeur tapée à la main dans un lot : le journal de lecture
// (une entrée par université, l'URL exacte lue, le verdict) est la
// seule source. Ce script lit les blocs ```json frais du journal et
// écrit scripts/data/lot<nom>.mjs sous la forme PATCHES que
// scripts/lot.mjs sait analyser / écrire / vérifier.
//
// CE QU'IL REFUSE (exit 1, rien d'écrit)
//   - un bloc dont l'id n'est pas une université FRANÇAISE de
//     l'instantané (assets/data/catalogue.json) : ce lot ne touche
//     aucun autre pays ;
//   - un `fraisScolarite` ou une `exoneration` SANS `source` (URL http)
//     OU SANS `verifieLe` (AAAA-MM-JJ) — c'est la règle des trois
//     valeurs de js/frais.js : un chiffre non sourcé ne s'affiche pas,
//     donc ne s'écrit pas ;
//   - un niveau hors licence / master / doctorat, un montant qui n'est
//     pas un nombre ≥ 0, une devise qui n'est pas EUR (aucune autre
//     devise n'entre dans ce lot) ;
//   - une politique d'exonération hors du vocabulaire de js/frais.js ;
//   - deux blocs pour le même id.
// Un bloc dont les deux champs valent null n'écrit rien : c'est une
// université ILLISIBLE ou DÉDUITE, listée dans a-consulter-toi-meme.
// ============================================================
import { readFile, writeFile } from "node:fs/promises";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";
import { POLITIQUES_EXONERATION } from "../js/frais.js";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");

const [journalArg, nomLot] = process.argv.slice(2);
if (!journalArg || !nomLot) {
  console.error("Usage : node scripts/generer-lot-frais.mjs <journal.md> <nom-du-lot>");
  process.exit(1);
}

const journalPath = join(racine, journalArg);
const journal = await readFile(journalPath, "utf8");

const catalogue = JSON.parse(await readFile(join(racine, "assets/data/catalogue.json"), "utf8"));
const francaises = new Map(catalogue.universities.filter((u) => u.country === "France").map((u) => [u.id, u]));

const NIVEAUX = ["licence", "master", "doctorat"];
const erreurs = [];
const patches = [];
const vus = new Set();

const urlValide = (s) => typeof s === "string" && /^https?:\/\/\S+$/.test(s.trim());
const dateValide = (s) => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(new Date(`${s}T00:00:00Z`).getTime());

function verifierSourceEtDate(ou, champ) {
  if (!urlValide(champ.source)) erreurs.push(`${ou} : source absente ou pas une URL — refusé.`);
  if (!dateValide(champ.verifieLe)) erreurs.push(`${ou} : verifieLe absent ou pas au format AAAA-MM-JJ — refusé.`);
}

const blocs = [...journal.matchAll(/```json frais\s*\n([\s\S]*?)\n```/g)];
if (!blocs.length) {
  console.error("Aucun bloc ```json frais dans le journal.");
  process.exit(1);
}

for (const [, brut] of blocs) {
  let entree;
  try {
    entree = JSON.parse(brut);
  } catch (e) {
    erreurs.push(`Bloc illisible (${e.message.slice(0, 60)}) : ${brut.slice(0, 80).replace(/\s+/g, " ")}…`);
    continue;
  }

  const id = entree.id;
  const ou = `« ${id} »`;

  if (!francaises.has(id)) {
    erreurs.push(`${ou} : pas une université française de l'instantané — ce lot ne touche aucun autre pays.`);
    continue;
  }
  if (vus.has(id)) {
    erreurs.push(`${ou} : deux blocs pour le même id.`);
    continue;
  }
  vus.add(id);

  const champs = {};

  if (entree.fraisScolarite !== null && entree.fraisScolarite !== undefined) {
    const f = entree.fraisScolarite;
    if (typeof f !== "object") { erreurs.push(`${ou} : fraisScolarite n'est pas un objet.`); continue; }
    verifierSourceEtDate(`${ou} fraisScolarite`, f);

    const niveaux = Object.keys(f).filter((k) => !["note", "source", "verifieLe"].includes(k));
    if (!niveaux.length) erreurs.push(`${ou} : fraisScolarite sans aucun niveau — mettre null si rien n'a été lu.`);

    const propre = { source: (f.source || "").trim(), verifieLe: f.verifieLe };
    if (typeof f.note === "string" && f.note.trim()) propre.note = f.note.trim();

    for (const n of niveaux) {
      if (!NIVEAUX.includes(n)) { erreurs.push(`${ou} : niveau inconnu « ${n} ».`); continue; }
      const l = f[n] || {};
      if (typeof l.montant !== "number" || !Number.isFinite(l.montant) || l.montant < 0) erreurs.push(`${ou} ${n} : montant absent ou invalide.`);
      if (l.devise !== "EUR") erreurs.push(`${ou} ${n} : devise « ${l.devise} » — seule EUR entre dans ce lot.`);
      propre[n] = { montant: l.montant, devise: "EUR", periode: l.periode === "semestre" ? "semestre" : "an" };
    }

    champs.fraisScolarite = propre;
  }

  if (entree.exoneration !== null && entree.exoneration !== undefined) {
    const e = entree.exoneration;
    if (typeof e !== "object") { erreurs.push(`${ou} : exoneration n'est pas un objet.`); continue; }
    verifierSourceEtDate(`${ou} exoneration`, e);
    if (!POLITIQUES_EXONERATION.includes(e.politique)) erreurs.push(`${ou} : politique « ${e.politique} » hors vocabulaire (${POLITIQUES_EXONERATION.join(", ")}).`);
    if (typeof e.detail !== "string" || !e.detail.trim()) erreurs.push(`${ou} : exoneration sans detail.`);
    champs.exoneration = { politique: e.politique, detail: (e.detail || "").trim(), source: (e.source || "").trim(), verifieLe: e.verifieLe };
  }

  if (!Object.keys(champs).length) continue; // ILLISIBLE / DÉDUIT : rien à écrire.

  patches.push({
    collection: "universities",
    id,
    champs,
    motif: `Lot D2 (frais réels) — lu sur la page officielle le ${champs.fraisScolarite?.verifieLe || champs.exoneration.verifieLe} ; voir ${relative(racine, journalPath).replace(/\\/g, "/")}.`
  });
}

if (erreurs.length) {
  console.error(`\n${erreurs.length} refus — rien n'a été généré :\n`);
  for (const e of erreurs) console.error(`  ✗ ${e}`);
  process.exit(1);
}

const entete = `/**
 * ============================================================
 * LOT ${nomLot.toUpperCase()} — GÉNÉRÉ depuis ${relative(racine, journalPath).replace(/\\/g, "/")}
 * par scripts/generer-lot-frais.mjs. NE PAS ÉDITER À LA MAIN : corriger
 * le journal et régénérer.
 *
 * ${patches.length} patch(es) sur \`universities\` (françaises seulement) :
 * fraisScolarite et/ou exoneration, chaque entrée sourcée et datée.
 * Les universités ILLISIBLES ou DÉDUITES du journal n'ont pas de patch.
 * ============================================================
 */

export const PATCHES = ${JSON.stringify(patches, null, 2)};
`;

const sortie = join(racine, "scripts", "data", `lot${nomLot}.mjs`);
await writeFile(sortie, entete, "utf8");

const avecFrais = patches.filter((p) => p.champs.fraisScolarite).length;
const avecExo = patches.filter((p) => p.champs.exoneration).length;
console.log(`\n${blocs.length} blocs lus, ${patches.length} patches générés (${avecFrais} avec frais, ${avecExo} avec exonération), ${blocs.length - patches.length} université(s) sans écriture.`);
console.log(`→ ${relative(racine, sortie).replace(/\\/g, "/")}\n`);
