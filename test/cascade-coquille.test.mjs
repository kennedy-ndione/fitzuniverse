/**
* Lot PERF 3G (2026-09-28) — la coquille de l'espace ne traîne plus tout
* le diagnostic de Fitz.
*
* js/app-shell.js (la coquille de l'espace, chargée aussi sur les pages
* publiques pour un étudiant connecté), le tableau de bord, les
* candidatures et l'espace préinscription importaient `boutonRecours`
* depuis js/fitz-recours.js — et avec lui les procédures des neuf pays,
* le diagnostic France, les préinscriptions. Mesuré le 28/09 :
*   js/dual-shell.js   49 modules, 257 Ko compressés → 12 modules, 51 Ko
*   profile.js         63 → 38 modules ; documents.js 51 → 15.
* Le bouton vit désormais dans js/fitz-recours-lien.js (déplacé à
* l'identique), et js/fitz-recours.js le ré-exporte.
*
* Preuve par mutation (2026-09-28) : app-shell.js réimportant depuis
* ./fitz-recours.js → tests 2 et 3 rouges.
*/
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { grapheDe } from "../scripts/precharger.mjs";
import * as lien from "../js/fitz-recours-lien.js";
import * as recours from "../js/fitz-recours.js";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(path.join(RACINE, f), "utf8");
const sansCommentaires = (s) => s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

test("coquille 1 — le bouton est le même, et js/fitz-recours.js le ré-exporte", () => {
  for (const nom of ["CODES_BLOCAGE", "LIBELLE_RECOURS", "lienRecours", "lireBlocage", "boutonRecours"]) {
    assert.ok(lien[nom], `${nom} manque à js/fitz-recours-lien.js`);
    assert.equal(recours[nom], lien[nom], `js/fitz-recours.js doit ré-exporter ${nom}, le même`);
  }
  // Module pur : aucun import (c'est tout son intérêt).
  assert.ok(!/^\s*import\b/m.test(sansCommentaires(lire("js/fitz-recours-lien.js"))), "js/fitz-recours-lien.js ne doit rien importer");
  assert.equal(lien.boutonRecours({ code: "verrou", feature: "ai_letter" }),
    '<a href="ai-chat.html?bloc=verrou&amp;feature=ai_letter" class="fitz-recours" data-recours="verrou"><i data-lucide="life-buoy" aria-hidden="true"></i><span>Bloqué ? Demandez à Fitz</span></a>');
});

test("coquille 2 — qui n'a besoin que du bouton ne l'importe que lui", () => {
  for (const [f, chemin] of [["js/app-shell.js", "./fitz-recours-lien.js"], ["dashboard.js", "./js/fitz-recours-lien.js"], ["applications.js", "./js/fitz-recours-lien.js"], ["espace-preinscription.js", "./js/fitz-recours-lien.js"]]) {
    const js = sansCommentaires(lire(f));
    assert.ok(js.includes(`import { boutonRecours } from "${chemin}";`), `${f} : le bouton depuis ${chemin}`);
    assert.ok(!/from "[./]*(js\/)?fitz-recours\.js"/.test(js), `${f} : plus d'import de js/fitz-recours.js pour le seul bouton`);
  }
});

test("coquille 3 — la coquille des pages publiques reste légère", () => {
  const graphe = grapheDe([path.join(RACINE, "js/dual-shell.js")], RACINE);
  const locaux = graphe.filter((m) => !/^https?:/.test(m));
  assert.ok(!locaux.includes("js/fitz-recours.js"), "js/fitz-recours.js est revenu dans la coquille");
  assert.ok(!locaux.some((m) => m.startsWith("js/procedures/")), "les procédures des pays sont revenues dans la coquille");
  assert.ok(locaux.length <= 15, `${locaux.length} modules dans la coquille (12 au 28/09, 49 avant)`);
  assert.ok(locaux.every((m) => existsSync(path.join(RACINE, m))));
});
