// ============================================================
// scripts/catalogue-liste.mjs — le catalogue des LISTES, et une fiche par document
// ============================================================
//
//     node scripts/catalogue-liste.mjs          réécrit les fichiers dérivés depuis assets/data/catalogue.json
//     node scripts/catalogue-liste.mjs --verif  ne touche à rien, dit ce qui est périmé
//
// C'est `node scripts/lot.mjs export` qui les écrit, avec catalogue.json,
// sur les mêmes documents : une seule source de vérité (Firestore, lue
// une fois par l'export). Ce script-ci ne sert qu'à refaire les dérivés
// quand catalogue.json est déjà là (il ne lit jamais Firestore).
//
// POURQUOI (lot PERF 3G, 2026-09-28)
// assets/data/catalogue.json pèse 2,2 Mo (262 Ko compressés) et chaque
// page du catalogue le chargeait en entier — la liste des bourses comme
// la page de questions, qui n'y lit que des noms de pays. Plus de la
// moitié de ce poids ne sert qu'aux FICHES : la preuve de vérification
// des échéances, la procédure d'admission de chaque université, la note
// sur ses frais, les critères généraux d'une bourse…
//
// DEUX DÉRIVÉS
//  - assets/data/catalogue-liste.json : le même instantané MOINS les champs
//    de DETAIL ci-dessous. Lu par les listes, le moteur de recommandation
//    et les diagnostics (js/catalog-data.js, chargerCatalogueListe).
//  - assets/data/fiches/<collection>/<id>.json : UN document, COMPLET, tel
//    qu'il est dans catalogue.json. Lu à la demande par les fiches
//    (documentDuCatalogue) : quelques Ko au lieu de tout le catalogue.
//
// LA RÈGLE DES CHAMPS DE DÉTAIL
// Un champ n'entre dans DETAIL que si AUCUN module qui lit la liste ne le
// lit — c'est test/catalogue-liste.test.mjs qui le tient, en cherchant
// ces accès dans le code, et en rejouant le moteur de recommandation et
// les diagnostics sur les deux fichiers (résultats identiques exigés).
// Tout champ NOUVEAU va donc dans la liste par défaut : on ne peut pas
// oublier d'y mettre ce qu'un futur lot fera lire au moteur.
// ============================================================

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export const COMPLET = "assets/data/catalogue.json";
export const LISTE = "assets/data/catalogue-liste.json";
export const FICHES = "assets/data/fiches";
export const COLLECTIONS = ["programs", "universities", "scholarships"];

// Les champs que SEULES les fiches lisent (un point = un sous-champ).
// Qui les lit, relevé le 2026-09-28 :
export const DETAIL = {
  programs: [
    "sourceVerification",     // aucun module du site (preuve pour l'audit : scripts/, test/fraicheur)
    "description"             // details.js (fiche)
  ],
  universities: [
    "admission",              // js/fiche-universite.js (fiche), js/route-destination.js (espace préinscription, sur le complet)
    "description",            // js/fiche-universite.js, details.js (fiches)
    "fraisScolarite.note"     // js/fiche-universite.js (fiche) ; js/frais.js ne lit que montants, source et date
  ],
  scholarships: [
    "generalCriteria",        // details.js (fiche), applications.js (sur le complet)
    "sourceEcheance",         // details.js
    "securityNotice",         // details.js
    "ageMaxNote"              // details.js
  ]
};

/** Un document sans ses champs de détail (copie : l'original n'est pas touché). */
export function sansDetail(docu, champs) {
  const copie = { ...docu };
  for (const champ of champs) {
    const [tete, sous] = champ.split(".");
    if (!sous) { delete copie[tete]; continue; }
    const parent = copie[tete];
    if (parent && typeof parent === "object" && !Array.isArray(parent) && sous in parent) {
      const reste = { ...parent };
      delete reste[sous];
      copie[tete] = reste;
    }
  }
  return copie;
}

/** L'instantané des listes, à partir de l'instantané public complet. */
export function versionListe(instantane) {
  const sortie = { genereLe: instantane.genereLe };
  for (const nom of COLLECTIONS) sortie[nom] = (instantane[nom] || []).map((d) => sansDetail(d, DETAIL[nom]));
  return sortie;
}

/** Les fiches : chemin relatif → contenu, un document complet par fichier. */
export function fichesDe(instantane) {
  const fiches = new Map();
  for (const nom of COLLECTIONS) {
    for (const d of instantane[nom] || []) {
      // Les identifiants du catalogue sont des slugs ; un identifiant qui
      // ne ferait pas un nom de fichier sûr n'a pas de fiche (la page
      // retombe alors sur catalogue.json, voir js/catalog-data.js).
      if (!/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(d.id)) continue;
      fiches.set(`${FICHES}/${nom}/${d.id}.json`, JSON.stringify(d));
    }
  }
  return fiches;
}

/**
 * Écrit les dérivés d'un instantané public : le fichier des listes, et les
 * fiches (en retirant celles des documents qui n'existent plus).
 * Appelé par `lot.mjs export` juste après catalogue.json.
 * @returns {{ listeOctets: number, fiches: number, retirees: number }}
 */
export function ecrireDerives(instantane, racine = RACINE) {
  const liste = JSON.stringify(versionListe(instantane));
  fs.mkdirSync(path.join(racine, path.dirname(LISTE)), { recursive: true });
  fs.writeFileSync(path.join(racine, LISTE), liste, "utf8");
  const fiches = fichesDe(instantane);
  let retirees = 0;
  for (const nom of COLLECTIONS) {
    const dossier = path.join(racine, FICHES, nom);
    fs.mkdirSync(dossier, { recursive: true });
    for (const f of fs.readdirSync(dossier)) {
      if (!fiches.has(`${FICHES}/${nom}/${f}`)) { fs.rmSync(path.join(dossier, f)); retirees++; }
    }
  }
  for (const [relatif, contenu] of fiches) {
    const cible = path.join(racine, relatif);
    if (fs.existsSync(cible) && fs.readFileSync(cible, "utf8") === contenu) continue;
    fs.writeFileSync(cible, contenu, "utf8");
  }
  return { listeOctets: Buffer.byteLength(liste), fiches: fiches.size, retirees };
}

/** Ce qui, sur le disque, ne correspond pas à catalogue.json (vide = à jour). */
export function perimes(racine = RACINE) {
  const instantane = JSON.parse(fs.readFileSync(path.join(racine, COMPLET), "utf8"));
  const sortie = [];
  const listeAttendue = JSON.stringify(versionListe(instantane));
  const listeChemin = path.join(racine, LISTE);
  if (!fs.existsSync(listeChemin) || fs.readFileSync(listeChemin, "utf8") !== listeAttendue) sortie.push(LISTE);
  const fiches = fichesDe(instantane);
  for (const [relatif, contenu] of fiches) {
    const cible = path.join(racine, relatif);
    if (!fs.existsSync(cible) || fs.readFileSync(cible, "utf8") !== contenu) sortie.push(relatif);
  }
  for (const nom of COLLECTIONS) {
    const dossier = path.join(racine, FICHES, nom);
    if (!fs.existsSync(dossier)) continue;
    for (const f of fs.readdirSync(dossier)) if (!fiches.has(`${FICHES}/${nom}/${f}`)) sortie.push(`${FICHES}/${nom}/${f} (document disparu)`);
  }
  return sortie;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.includes("--verif")) {
    const liste = perimes();
    for (const p of liste.slice(0, 20)) console.log(`périmé : ${p}`);
    if (liste.length > 20) console.log(`… et ${liste.length - 20} autre(s).`);
    console.log(liste.length ? `${liste.length} fichier(s) à régénérer : node scripts/catalogue-liste.mjs` : "Catalogue des listes et fiches à jour.");
    if (liste.length) process.exitCode = 1;
  } else {
    const instantane = JSON.parse(fs.readFileSync(path.join(RACINE, COMPLET), "utf8"));
    const { listeOctets, fiches, retirees } = ecrireDerives(instantane);
    console.log(`${LISTE} écrit (${Math.round(listeOctets / 1024)} Ko) ; ${fiches} fiche(s) dans ${FICHES}/${retirees ? `, ${retirees} retirée(s)` : ""}.`);
  }
}
