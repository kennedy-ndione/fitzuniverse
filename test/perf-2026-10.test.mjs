/**
* Lot PERF 3G (2026-09-28) — le rapport et l'outil de mesure.
*
* 1. PERF-2026-10.md décrit l'incident de mesure et des pistes non
*    faites : comme les rapports d'audit, il ne part JAMAIS en ligne
*    (firebase.json publie la racine par défaut).
* 2. scripts/verifier/mesure-3g.mjs a écrit, pendant sa mise au point,
*    jusqu'à 8 visites fictives dans le Firestore de PRODUCTION (le
*    comptage des visites de js/analytics.js). Ses deux verrous — pages
*    ouvertes avec ?useEmulator=1, hôtes de production introuvables pour
*    le navigateur — sont tenus ici, sans lancer de navigateur.
*
* Preuve par mutation (2026-09-28) : un page.goto() sans surEmulateur(),
* ou firestore.googleapis.com retiré de PRODUCTION → test 2 rouge ;
* « PERF-*.md » retiré de hosting.ignore → test 1 rouge.
*/
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(path.join(RACINE, f), "utf8");
const sansCommentaires = (s) => s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

test("perf 1 — le rapport PERF-2026-10.md n'est pas publié par Firebase Hosting", async () => {
  const { lireMotifs, listerPublies, motifVersRegex } = await import("../scripts/hosting-publie.mjs");
  assert.ok(existsSync(path.join(RACINE, "PERF-2026-10.md")), "le rapport est à la racine du dépôt");
  assert.ok(lireMotifs().includes("PERF-*.md"));
  assert.ok(motifVersRegex("PERF-*.md").test("PERF-2026-10.md"));
  assert.ok(!listerPublies().some((f) => /^PERF-/.test(f)), "un rapport de performance serait servi en ligne");
});

test("perf 2 — la mesure 3G ne vise jamais la production", async () => {
  const { PRODUCTION } = await import("../scripts/verifier/mesure-3g.mjs");
  for (const hote of [
    "firestore.googleapis.com", "identitytoolkit.googleapis.com", "securetoken.googleapis.com",
    "firebasestorage.googleapis.com", "europe-west1-scholarbridge-e0d84.cloudfunctions.net", "fitzuniverse.com"
  ]) assert.ok(PRODUCTION.includes(hote), `${hote} doit rester introuvable pour le navigateur de mesure`);

  const js = sansCommentaires(lire("scripts/verifier/mesure-3g.mjs"));
  // Chaque page ouverte parle aux émulateurs (firebase-config.js lit ?useEmulator=1).
  const ouvertures = [...js.matchAll(/\.goto\(([^\n]*)/g)].map((m) => m[1]);
  assert.ok(ouvertures.length >= 4, `${ouvertures.length} page.goto() relevés`);
  for (const o of ouvertures) assert.ok(/surEmulateur\(|[?&]useEmulator=1/.test(o), `page ouverte sans l'émulateur : goto(${o}`);
  // Les hôtes de production ne se résolvent plus, sans proxy qui les résoudrait à sa place.
  assert.ok(js.includes("PRODUCTION.filter((h) => !(miroir && hotes.includes(h))).map((h) => `MAP ${h} ~NOTFOUND`)"));
  assert.ok(js.includes('"--no-proxy-server"'));
  // Une requête qui vise quand même la production arrête la mesure.
  assert.ok(/if \(m\.fuites\.length\) throw new Error/.test(js));
});
