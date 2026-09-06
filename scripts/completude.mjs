// ============================================================
// FitzUniverse — audit de complétude du catalogue
//
//     node scripts/completude.mjs           tableau de bord
//     node scripts/completude.mjs --bourse <id>   le détail d'une fiche
//     node scripts/completude.mjs --manque verifieLe   qui manque ce champ
//
// POURQUOI CE FICHIER EXISTE (2026-09-05)
// ---------------------------------------
// Décision de Charles, le soir du chantier de fraîcheur : « à partir
// de maintenant, à chaque fois qu'on attaquera une bourse, on ne
// laissera pas de côté ces détails ».
//
// Une règle qu'on se rappelle est une règle qu'on oublie. Celle-ci est
// donc CALCULÉE : le script dit, pour chaque bourse et chaque
// université, ce qui manque encore — et le dit dans le même terminal
// que `npm test` et `npm run verifier`, à côté du reste.
//
// Ce que l'histoire a coûté, et qui justifie chaque ligne ci-dessous :
//   - 156 bourses affichées « ouvertes » dont 45 ne l'étaient pas,
//     parce que la carte lisait isActive au lieu de l'échéance ;
//   - 4 contradictions à l'écran, une bourse annoncée ouverte avec une
//     date dépassée ;
//   - 76 universités sans domaine : un futur médecin et un futur
//     juriste recevaient 11 recommandations identiques sur 12 ;
//   - 8 pays proposés par le questionnaire que le module d'éligibilité
//     ne savait pas résoudre.
// Aucun de ces défauts n'était visible en regardant une fiche. Tous se
// voient dans un compte.
//
// CE SCRIPT NE CORRIGE RIEN et n'écrit rien : il compte, il nomme, il
// classe par exposition. Ce qu'on en fait est un lot.
// ============================================================

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { etatCandidature } from "../js/echeance.js";
import { grilleDeProfils } from "../js/radar.js";
import { retenirOpportunites } from "../js/recommend-programs.js";

const RACINE = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

// ------------------------------------------------------------
// CE QU'UNE FICHE COMPLÈTE DOIT PORTER
// ------------------------------------------------------------
// Chaque entrée dit : le champ, la question à laquelle il répond pour
// l'étudiant, et pourquoi son absence fait mal. L'ordre est celui de
// la douleur : d'abord ce qui trompe, ensuite ce qui manque.

const EXIGENCES_BOURSE = [
  {
    champ: "verifieLe",
    question: "quand quelqu'un a-t-il lu la page officielle ?",
    absent: (b) => !b.verifieLe,
    douleur: "une date sans date de lecture est une promesse sans garantie"
  },
  {
    champ: "sourceEcheance",
    question: "où l'échéance a-t-elle été lue ?",
    absent: (b) => !b.sourceEcheance,
    douleur: "l'étudiant ne peut pas vérifier lui-même"
  },
  {
    champ: "periodeOuverture",
    question: "quand faut-il revenir si c'est fermé ?",
    absent: (b) => !b.periodeOuverture,
    douleur: "une bourse close sans rythme annoncé est une impasse"
  },
  {
    champ: "exigences",
    question: "que faut-il AVANT de candidater ?",
    absent: (b) => !Array.isArray(b.exigences),
    douleur: "admission préalable, directeur de thèse, nomination : découverts trop tard"
  },
  {
    champ: "eligibility",
    question: "qui a le droit de candidater ?",
    absent: (b) => !b.eligibility || (!b.eligibility.scope && !b.eligibility.note),
    douleur: "sans portée, la bourse est proposée à des étudiants qui en sont exclus"
  },
  {
    champ: "levels",
    question: "quel cycle ?",
    absent: (b) => !Array.isArray(b.levels) || !b.levels.length,
    douleur: "sans niveau, le moteur ne peut ni la proposer ni l'écarter"
  },
  {
    champ: "funder",
    question: "qui paie ?",
    absent: (b) => !b.funder,
    douleur: "gouvernement, université ou fondation : ce n'est pas le même dossier"
  }
];

const EXIGENCES_UNIVERSITE = [
  {
    champ: "fields",
    question: "qu'enseigne cet établissement ?",
    absent: (u) => !Array.isArray(u.fields) || !u.fields.length,
    douleur: "sans domaine, tous les étudiants reçoivent la même liste"
  },
  {
    champ: "applicationPortalUrl",
    question: "où dépose-t-on le dossier ?",
    absent: (u) => !u.applicationPortalUrl,
    douleur: "c'est la valeur que l'abonnement fait payer"
  },
  {
    champ: "officialWebsite",
    question: "où vérifier ?",
    absent: (u) => !u.officialWebsite,
    douleur: "aucune source à montrer"
  }
];

function lireCatalogue() {
  const f = path.join(RACINE, "assets/data/catalogue.json");
  if (!fs.existsSync(f)) throw new Error("assets/data/catalogue.json absent — lancer `node scripts/lot.mjs export`.");
  return JSON.parse(fs.readFileSync(f, "utf8"));
}

// L'exposition : combien de profils d'étudiants voient cette fiche.
// Même instrument que le radar — une fiche incomplète que personne ne
// voit ne se répare pas avant une fiche incomplète vue par tous.
function mesurerExposition(catalogue) {
  const U = new Map(catalogue.universities.map((u) => [u.id, u]));
  const S = new Map(catalogue.scholarships.map((s) => [s.id, s]));
  const bourses = new Map();
  const universites = new Map();
  for (const profile of grilleDeProfils()) {
    const { retenues } = retenirOpportunites({
      profile, programs: catalogue.programs, universitiesById: U, scholarshipsById: S
    });
    for (const r of retenues) {
      if (r.scholarshipId) bourses.set(r.scholarshipId, (bourses.get(r.scholarshipId) || 0) + 1);
      if (r.universityId) universites.set(r.universityId, (universites.get(r.universityId) || 0) + 1);
    }
  }
  return { bourses, universites };
}

function auditer(liste, exigences, exposition) {
  return liste.map((doc) => ({
    id: doc.id,
    nom: doc.title || doc.name || doc.id,
    pays: doc.country || "",
    vue: exposition.get(doc.id) || 0,
    manques: exigences.filter((e) => e.absent(doc)).map((e) => e.champ)
  })).filter((x) => x.manques.length)
    .sort((a, b) => (b.vue - a.vue) || (b.manques.length - a.manques.length) || a.nom.localeCompare(b.nom, "fr"));
}

function principal() {

  const catalogue = lireCatalogue();
  const args = process.argv.slice(2);
  const exposition = mesurerExposition(catalogue);

  const parBourse = new Map();
  for (const p of catalogue.programs) {
    if (!p.scholarshipId) continue;
    if (!parBourse.has(p.scholarshipId)) parBourse.set(p.scholarshipId, []);
    parBourse.get(p.scholarshipId).push(p);
  }

  const bourses = auditer(catalogue.scholarships, EXIGENCES_BOURSE, exposition.bourses);
  const universites = auditer(catalogue.universities, EXIGENCES_UNIVERSITE, exposition.universites);

  // --- Un champ précis ---
  const iManque = args.indexOf("--manque");
  if (iManque >= 0) {
    const champ = args[iManque + 1];
    const src = EXIGENCES_BOURSE.some((e) => e.champ === champ) ? bourses : universites;
    const cibles = src.filter((x) => x.manques.includes(champ));
    console.log(`\n${cibles.length} fiche(s) sans « ${champ} », les plus vues d'abord :\n`);
    for (const c of cibles) console.log(`  ${String(c.vue).padStart(3)} vues · ${c.pays.padEnd(16)}${c.nom.slice(0, 52)}`);
    return;
  }

  // --- Une fiche ---
  const iBourse = args.indexOf("--bourse");
  if (iBourse >= 0) {
    const id = args[iBourse + 1];
    const b = catalogue.scholarships.find((s) => s.id === id);
    if (!b) return console.log(`Aucune bourse « ${id} ».`);
    const etat = etatCandidature({
      statut: b.status, actif: b.isActive,
      echeances: (parBourse.get(b.id) || []).map((p) => p.deadline),
      periodeOuverture: b.periodeOuverture, verifieLe: b.verifieLe, echeanceVariable: b.echeanceVariable
    });
    console.log(`\n${b.title}\n${"—".repeat(Math.min(b.title.length, 70))}`);
    console.log(`  à l'écran : ${etat.badge} — ${etat.valeur}`);
    console.log(`  vue par ${exposition.bourses.get(b.id) || 0} profils sur ${grilleDeProfils().length}\n`);
    for (const e of EXIGENCES_BOURSE) {
      console.log(`  ${e.absent(b) ? "MANQUE " : "ok     "} ${e.champ.padEnd(18)} ${e.absent(b) ? e.douleur : ""}`);
    }
    return;
  }

  // --- Tableau de bord ---
  const total = catalogue.scholarships.length;
  console.log(`\nComplétude du catalogue — ${total} bourses, ${catalogue.universities.length} universités`);
  console.log(`Instantané du ${catalogue.genereLe || "?"}\n`);

  console.log("BOURSES — champs manquants :");
  for (const e of EXIGENCES_BOURSE) {
    const n = catalogue.scholarships.filter((b) => e.absent(b)).length;
    const barre = "█".repeat(Math.round((n / total) * 40));
    console.log(`  ${String(n).padStart(3)}/${total}  ${e.champ.padEnd(18)} ${barre}`);
  }

  console.log("\nUNIVERSITÉS — champs manquants :");
  for (const e of EXIGENCES_UNIVERSITE) {
    const n = catalogue.universities.filter((u) => e.absent(u)).length;
    const barre = "█".repeat(Math.round((n / catalogue.universities.length) * 40));
    console.log(`  ${String(n).padStart(3)}/${catalogue.universities.length}  ${e.champ.padEnd(18)} ${barre}`);
  }

  const vues = bourses.filter((b) => b.vue > 0);
  console.log(`\nÀ COMPLÉTER EN PRIORITÉ — fiches incomplètes QUE DES ÉTUDIANTS VOIENT (${vues.length}) :\n`);
  for (const b of vues.slice(0, 20)) {
    console.log(`  ${String(b.vue).padStart(3)} vues · ${b.pays.padEnd(14)} ${b.nom.slice(0, 44).padEnd(46)} manque : ${b.manques.join(", ")}`);
  }

  const uVues = universites.filter((u) => u.vue > 0);
  if (uVues.length) {
    console.log(`\nUNIVERSITÉS incomplètes que des étudiants voient (${uVues.length}) :\n`);
    for (const u of uVues.slice(0, 12)) {
      console.log(`  ${String(u.vue).padStart(3)} vues · ${u.pays.padEnd(14)} ${u.nom.slice(0, 44).padEnd(46)} manque : ${u.manques.join(", ")}`);
    }
  }

  console.log(`\n${bourses.length} bourses et ${universites.length} universités incomplètes au total.`);
  console.log("Détail d'une fiche : node scripts/completude.mjs --bourse <id>");
  console.log("Qui manque un champ : node scripts/completude.mjs --manque verifieLe\n");

}

principal();
