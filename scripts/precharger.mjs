// ============================================================
// scripts/precharger.mjs — la navigation de l'espace ne fait plus la queue
// ============================================================
//
//     node scripts/precharger.mjs          réécrit le bloc de chaque page
//     node scripts/precharger.mjs --verif  ne touche à rien, dit ce qui est périmé
//
// POURQUOI (lot NAVIGATION RAPIDE, 2026-09-21)
// Charles : « le clic pour être redirigé vers une autre page prend
// souvent du temps ». MESURÉ en production le même jour : chaque page de
// l'espace charge 45 à 75 modules JavaScript, en cascade sur DIX niveaux
// d'import (dashboard.js importe app-shell.js, qui importe
// plan-features.js, qui importe…). Le navigateur ne découvre un niveau
// qu'après avoir reçu le précédent, et firebase.json impose `no-cache`
// aux .js (chaque fichier se revalide, à juste titre : un module périmé
// mêlé à des neufs casse la page après un déploiement). Résultat : dix
// allers-retours réseau à la file avant que la page puisse s'afficher —
// imperceptible en fibre, 2 à 3 secondes sur un réseau mobile où un
// aller-retour vaut 200 ou 300 ms.
//
// LE REMÈDE : `<link rel="modulepreload">` pour TOUT le graphe statique
// de chaque page, écrit dans son <head>. Le navigateur demande alors les
// 45 à 75 modules d'un coup, en parallèle : un aller-retour au lieu de
// dix. On garde `no-cache` — la fraîcheur après déploiement n'est pas
// sacrifiée à la vitesse.
//
// Seuls les imports STATIQUES entrent dans le bloc : un import()
// dynamique est paresseux exprès (Fitz, le catalogue, un outil rare), le
// précharger annulerait ce choix.
//
// test/precharger.test.mjs recalcule chaque bloc : un module ajouté ou
// retiré sans relancer ce script fait échouer `npm test`, avec la
// commande à taper.
// ============================================================

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export const DEBUT = "<!-- précharge:début — généré par scripts/precharger.mjs, ne pas modifier à la main -->";
export const FIN = "<!-- précharge:fin -->";

const IMPORT_STATIQUE = /(?:^|[;\n}])\s*(?:import|export)\s+(?:[^"'`;()]*?\s+from\s+)?["']([^"']+)["']/g;

function importsDe(fichier) {
  const source = fs.readFileSync(fichier, "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");
  const sortie = [];
  for (const m of source.matchAll(IMPORT_STATIQUE)) {
    const cible = m[1];
    sortie.push(/^https?:\/\//.test(cible) ? cible : path.resolve(path.dirname(fichier), cible));
  }
  return sortie;
}

/** Les modules d'entrée d'une page : ses <script type="module" src>. */
export function entreesDe(html, dossierPage) {
  return [...html.matchAll(/<script\b[^>]*\btype="module"[^>]*\bsrc="([^"]+)"/g)]
    .map((m) => m[1].split("?")[0])
    .filter((src) => !/^https?:\/\//.test(src))
    .map((src) => path.resolve(dossierPage, src));
}

/**
 * Tout le graphe statique, entrées comprises, dans un ordre stable : les
 * modules du site d'abord (chemin relatif à la page), puis les modules
 * externes (SDK Firebase), chacun trié.
 */
export function grapheDe(entrees, dossierPage) {
  const vus = new Set();
  const file = [...entrees];
  while (file.length) {
    const f = file.shift();
    if (vus.has(f)) continue;
    vus.add(f);
    if (/^https?:\/\//.test(f) || !fs.existsSync(f)) continue;
    file.push(...importsDe(f));
  }
  const locaux = [...vus].filter((f) => !/^https?:\/\//.test(f) && fs.existsSync(f))
    .map((f) => path.relative(dossierPage, f).split(path.sep).join("/"))
    .sort();
  const externes = [...vus].filter((f) => /^https?:\/\//.test(f)).sort();
  return [...locaux, ...externes];
}

export function blocPour(fichierHtml) {
  const html = fs.readFileSync(fichierHtml, "utf8");
  const dossier = path.dirname(fichierHtml);
  const modules = grapheDe(entreesDe(html, dossier), dossier);
  if (!modules.length) return "";
  const fin = html.includes("\r\n") ? "\r\n" : "\n";
  return [DEBUT, ...modules.map((m) => `<link rel="modulepreload" href="${m}">`), FIN].join(fin);
}

/** Le HTML avec son bloc à jour (inséré avant </head>, ou remplacé). */
export function avecBloc(fichierHtml) {
  const html = fs.readFileSync(fichierHtml, "utf8");
  const bloc = blocPour(fichierHtml);
  const fin = html.includes("\r\n") ? "\r\n" : "\n";
  const i = html.indexOf(DEBUT);
  if (i !== -1) {
    const j = html.indexOf(FIN, i) + FIN.length;
    return html.slice(0, i) + bloc + html.slice(j);
  }
  if (!bloc) return html;
  return html.replace("</head>", `${bloc}${fin}</head>`);
}

/** Les pages du site qui chargent au moins un module (racine du dépôt). */
export function pagesAModules() {
  return fs.readdirSync(RACINE)
    .filter((f) => f.endsWith(".html"))
    .filter((f) => /<script\b[^>]*\btype="module"[^>]*\bsrc=/.test(fs.readFileSync(path.join(RACINE, f), "utf8")))
    .sort();
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const verif = process.argv.includes("--verif");
  let perimees = 0;
  for (const page of pagesAModules()) {
    const fichier = path.join(RACINE, page);
    const actuel = fs.readFileSync(fichier, "utf8");
    const attendu = avecBloc(fichier);
    if (actuel === attendu) continue;
    perimees++;
    if (verif) console.log(`périmé : ${page}`);
    else { fs.writeFileSync(fichier, attendu, "utf8"); console.log(`écrit  : ${page}`); }
  }
  console.log(perimees ? `${perimees} page(s) ${verif ? "à régénérer : node scripts/precharger.mjs" : "mises à jour"}.` : "Toutes les pages sont à jour.");
  if (verif && perimees) process.exitCode = 1;
}
