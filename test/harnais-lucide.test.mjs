/**
 * ============================================================
 * test/harnais-lucide.test.mjs — le harnais sert le vrai lucide
 * ============================================================
 *
 * scripts/verifier/hors-ligne.mjs lisait lucide à un chemin fixe,
 * « ../../node_modules ». Un worktree n'a pas de node_modules à lui : le
 * harnais y servait la coquille, sans le dire, et le contrôle « contenu
 * rendu vide » du peigne (lot ICONE-BTN) sortait sur ai-chat.html la
 * même liste de huit boutons avec ou sans défaut réel. Preuve du
 * 2026-09-28 : la mutation d'ICONE-BTN (padding:0 retiré dans
 * css/ai-suite.css) ne changeait rien au rapport.
 *
 *  1. le module sert le paquet que Node résout depuis la racine ;
 *  2. aucun module du harnais ne lit node_modules par un chemin fixe ;
 *  3. chaque moteur passe le « témoin lucide », qui ÉCHOUE sous la
 *     coquille (décision de Charles, 2026-09-28), avant le peigne.
 *
 * Ce test ne lance aucun navigateur : que le paquet servi DESSINE, c'est
 * le témoin lui-même qui le prouve, dans `npm run verifier`.
 * ============================================================
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { LUCIDE_SERVI } from "../scripts/verifier/hors-ligne.mjs";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(path.join(RACINE, f), "utf8").replace(/\r\n/g, "\n");

// Le code sans ses lignes de commentaire : les commentaires du harnais
// racontent l'ancien chemin fixe, ils ne le lisent pas.
const code = (f) => lire(f).split("\n").filter((l) => !/^\s*(\/\/|\/\*|\*)/.test(l)).join("\n");

test("harnais lucide 1 — hors-ligne.mjs sert le vrai paquet, celui que Node résout depuis la racine", () => {

  assert.equal(LUCIDE_SERVI.reel, true, `coquille servie : ${LUCIDE_SERVI.raison}`);

  const entree = createRequire(path.join(RACINE, "package.json")).resolve("lucide");
  assert.ok(entree.startsWith(LUCIDE_SERVI.dossier + path.sep), `${entree} n'est pas dans ${LUCIDE_SERVI.dossier}`);

  const paquet = JSON.parse(readFileSync(path.join(LUCIDE_SERVI.dossier, "package.json"), "utf8"));
  assert.equal(paquet.name, "lucide");
  assert.equal(LUCIDE_SERVI.version, paquet.version);

});

test("harnais lucide 2 — aucun module du harnais ne lit node_modules par un chemin fixe", () => {

  const modules = readdirSync(path.join(RACINE, "scripts/verifier")).filter((f) => f.endsWith(".mjs"));
  assert.ok(modules.includes("hors-ligne.mjs"));

  const fautifs = modules.filter((f) => /node_modules/.test(code(`scripts/verifier/${f}`)));
  assert.deepEqual(fautifs, [], "chemin fixe vers node_modules : un worktree n'en a pas, résoudre avec createRequire");

  assert.match(code("scripts/verifier/hors-ligne.mjs"), /createRequire\(import\.meta\.url\)\.resolve\(nom\)/);

});

test("harnais lucide 3 — chaque moteur passe le témoin lucide, qui échoue sous la coquille, avant le peigne", () => {

  const verifieur = lire("scripts/verifier/verifier.mjs");

  const appel = verifieur.indexOf('noter("témoin lucide", await temoinLucide(');
  assert.ok(appel > 0, "le témoin lucide n'est pas lancé par passerUnMoteur()");
  assert.ok(appel < verifieur.indexOf('noter("peigne fin"'), "le témoin lucide doit passer avant le peigne");

  const temoin = verifieur.match(/async function temoinLucide\([\s\S]*?\n}\n/);
  assert.ok(temoin, "fonction temoinLucide() introuvable");
  // Sous la coquille : une ANOMALIE (le contrôle passe en ÉCHEC), pas une note.
  assert.match(temoin[0], /if \(!LUCIDE_SERVI\.reel\) \{\s*anomalies\.push\(/);

});
