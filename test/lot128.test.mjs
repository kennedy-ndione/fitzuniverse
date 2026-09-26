/**
* LOT 128 (2026-09-26) — AUDIT AVANT LA PRÉSENTATION AU PUBLIC
*
* 1. Une adresse inconnue affichait la page anglaise de Firebase
*    (« Page Not Found »). 404.html la remplace — en français, avec les
*    trois portes du site. Firebase la sert À N'IMPORTE QUELLE
*    PROFONDEUR (/a/b/c) : tous ses chemins sont absolus.
* 2. Sur téléphone, la page de paiement glissait de côté (halo décoratif,
*    438 px de large pour 390 px d'écran).
*/
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(path.join(RACINE, f), "utf8").replace(/\r\n/g, "\n");

test("128 — la page introuvable est en français, et ne dépend d'aucun chemin relatif", () => {
  const html = lire("404.html");
  assert.match(html, /<html lang="fr">/);
  assert.match(html, /<title>Page introuvable \| FitzUniverse<\/title>/);
  assert.match(html, /<meta name="robots" content="noindex">/);
  const sansCom = html.replace(/<!--[\s\S]*?-->/g, "");
  for (const m of sansCom.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const u = m[1];
    assert.ok(/^(\/|#|https:\/\/)/.test(u), `chemin relatif dans 404.html : ${u}`);
  }
  for (const porte of ['href="/"', 'href="/scholarships.html"', 'href="/preinscriptions.html"']) assert.ok(sansCom.includes(porte), porte);
});

test("128 — sur téléphone, le halo de la page de paiement ne pousse plus la page", () => {
  const css = lire("payment.css");
  assert.match(css, /@media \(max-width: 720px\)\{\n\nmain\.container\{\n\noverflow-x:clip;/);
});
