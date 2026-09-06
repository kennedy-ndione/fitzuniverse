/**
 * ============================================================
 * scripts/radar-echeances.mjs — le radar, en ligne de commande
 * ============================================================
 *
 * La logique vit dans `js/radar.js`, module PUR partagé avec la page
 * `admin/radar.html`. Ce fichier-ci n'est qu'une façade : il lit
 * l'instantané sur le disque, appelle le module, imprime, écrit le
 * rapport. Rien de métier ici — un radar en double finirait par donner
 * deux chiffres différents.
 *
 * USAGE
 *   npm run radar                 rapport à l'écran
 *   npm run radar -- --json       le rapport complet en JSON
 *   npm run radar -- --lot 30     les 30 premières
 * ============================================================
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { construireRadar, bascules, RISQUES } from "../js/radar.js";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const AUJOURDHUI = new Date();

function chargerCatalogue() {

  const fichier = path.join(RACINE, "assets/data/catalogue.json");

  if (!fs.existsSync(fichier)) {
    throw new Error("assets/data/catalogue.json est absent — lancer `node scripts/lot.mjs export` d'abord.");
  }

  return JSON.parse(fs.readFileSync(fichier, "utf8"));

}

function afficher(radar, mouvements, limite) {

  const parRisque = new Map();
  for (const l of radar.lignes) parRisque.set(l.risque, (parRisque.get(l.risque) || 0) + 1);

  console.log(`\nRadar des échéances — instantané du ${radar.genereLe.slice(0, 10) || "?"}, ${radar.lignes.length} bourses`);
  console.log(`Exposition mesurée sur ${radar.profils} profils d'étudiants.\n`);

  for (const [cle, def] of Object.entries(RISQUES)) {
    const n = parRisque.get(cle) || 0;
    if (n) console.log(`  ${String(n).padStart(4)}  ${def.libelle}`);
  }

  const jamaisVerifiees = radar.lignes.filter((l) => !l.verifieLe).length;
  console.log(`\n  ${String(jamaisVerifiees).padStart(4)}  sans date de vérification (champ verifieLe absent)`);

  // Les deux listes qui bougent toutes seules avec le calendrier —
  // c'est ce qu'un passage hebdomadaire vient chercher.
  if (mouvements.vientDeFermer.length) {
    console.log(`\nVIENT DE FERMER (30 derniers jours) :`);
    for (const m of mouvements.vientDeFermer) {
      console.log(`  · ${m.titre} — ${m.pays} — échéance ${m.date}, il y a ${-m.jours} j${/^ouverte/i.test(m.statut || "") ? "  ⚠ statut encore « Ouverte »" : ""}`);
    }
  }

  if (mouvements.fermeBientot.length) {
    console.log(`\nFERME DANS LES 14 JOURS :`);
    for (const m of mouvements.fermeBientot) {
      console.log(`  · ${m.titre} — ${m.pays} — J-${m.jours} (${m.date})`);
    }
  }

  console.log(`\nÀ revérifier en priorité (${limite} premières) :\n`);

  radar.lignes.slice(0, limite).forEach((l, i) => {
    const jours = l.jours === null ? "" : ` · ${l.jours >= 0 ? `J-${l.jours}` : `${-l.jours} j de retard`}`;
    console.log(`${String(i + 1).padStart(3)}. [${String(l.priorite).padStart(3)}] ${l.titre}`);
    console.log(`      ${l.pays} · ${l.risqueLibelle}${jours} · vue par ${l.vuePar}/${radar.profils} profils`);
    console.log(`      ${l.site || "— pas de site officiel enregistré —"}`);
  });

  console.log("");

}

function principal() {

  const args = process.argv.slice(2);
  const catalogue = chargerCatalogue();

  const radar = construireRadar(catalogue, AUJOURDHUI);
  const mouvements = bascules(catalogue, AUJOURDHUI);

  if (args.includes("--json")) {
    console.log(JSON.stringify({ ...radar, ...mouvements }, null, 2));
    return;
  }

  const iLot = args.indexOf("--lot");
  const limite = iLot >= 0 ? Number(args[iLot + 1] || 30) : 25;

  afficher(radar, mouvements, limite);

  const sortie = path.join(RACINE, "scripts/data/radar-echeances.json");
  fs.mkdirSync(path.dirname(sortie), { recursive: true });
  fs.writeFileSync(sortie, JSON.stringify({ ...radar, ...mouvements }, null, 2), "utf8");

  console.log(`Rapport complet : scripts/data/radar-echeances.json\n`);

}

// Exécuté seulement en ligne de commande.
if (process.argv[1] && process.argv[1].endsWith("radar-echeances.mjs")) principal();
