/**
 * L'instantané statique du catalogue (js/catalog-snapshot.js) — sans
 * réseau, sans Firebase. Ce qu'on garantit :
 *   - un JSON valide est servi, et Firestore n'est JAMAIS appelé ;
 *   - un JSON absent, cassé ou incomplet fait retomber sur Firestore,
 *     TOUT ou rien (jamais deux états mélangés dans une page) ;
 *   - le fichier n'est téléchargé qu'une fois par page ;
 *   - la garde d'architecture : le site ne lit les trois collections
 *     que via js/catalog-data.js, et l'export écrit bien le fichier
 *     que le site attend.
 */

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { validerInstantane, creerLecteurAvecInstantane, documentDeLInstantane, COLLECTIONS } from "../js/catalog-snapshot.js";
import { creerCacheCatalogue } from "../js/catalog-cache.js";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");

function instantaneValide() {
  return {
    genereLe: "2026-09-03T19:00:00.000Z",
    programs: [{ id: "u1__b1__master", universityId: "u1", scholarshipId: "b1", level: "Master" }],
    universities: [{ id: "u1", name: "Université Un", country: "France" }],
    scholarships: [{ id: "b1", title: "Bourse Un", country: "France" }]
  };
}

// ---------------- validerInstantane ----------------

test("un instantané complet est accepté et normalisé", () => {
  const v = validerInstantane(instantaneValide());
  assert.ok(v);
  assert.equal(v.genereLe, "2026-09-03T19:00:00.000Z");
  assert.equal(v.programs.length, 1);
  assert.equal(v.universities[0].name, "Université Un");
});

test("null, un tableau, une chaîne ou un objet vide sont refusés", () => {
  for (const mauvais of [null, undefined, [], "", "{}", {}, 42]) {
    assert.equal(validerInstantane(mauvais), null, `devrait refuser ${JSON.stringify(mauvais)}`);
  }
});

test("une collection manquante refuse TOUT l'instantané (jamais partiel)", () => {
  for (const nom of COLLECTIONS) {
    const json = instantaneValide();
    delete json[nom];
    assert.equal(validerInstantane(json), null, `sans ${nom}, l'instantané doit être refusé en bloc`);
  }
});

test("un document sans id refuse l'instantané", () => {
  const json = instantaneValide();
  json.scholarships.push({ title: "sans id" });
  assert.equal(validerInstantane(json), null);
});

test("l'ancien export d'audit (scripts/export-catalog.json, clés françaises) N'EST PAS un instantané", () => {
  // Il porte `bourses`/`universites`/`programmes`, pas les noms des
  // collections : le site ne doit jamais le prendre pour le fichier
  // attendu, sinon il afficherait des fiches vides.
  const ancien = { genereLe: "x", bourses: [{ id: "b" }], universites: [{ id: "u" }], programmes: [{ id: "p" }] };
  assert.equal(validerInstantane(ancien), null);
});

// ---------------- creerLecteurAvecInstantane ----------------

test("avec un instantané valide, Firestore n'est jamais appelé", async () => {
  let appelsFirestore = 0;
  const lecteur = creerLecteurAvecInstantane({
    chargerInstantane: async () => instantaneValide(),
    lireFirestore: async () => { appelsFirestore++; return []; }
  });
  const cache = creerCacheCatalogue(lecteur.lireCollection);

  const r = await cache.charger(["programs", "universities", "scholarships"]);

  assert.equal(appelsFirestore, 0, "le quota ne doit pas bouger d'une lecture");
  assert.equal(r.universities[0].name, "Université Un");
  assert.equal(lecteur.source(), "instantane");
  assert.equal(lecteur.genereLe(), "2026-09-03T19:00:00.000Z");
});

test("sans instantané (404 → null), on relit Firestore comme avant", async () => {
  const appels = [];
  const lecteur = creerLecteurAvecInstantane({
    chargerInstantane: async () => null,
    lireFirestore: async (nom) => { appels.push(nom); return [{ id: `${nom}-1` }]; }
  });
  const cache = creerCacheCatalogue(lecteur.lireCollection);

  const r = await cache.charger(["programs", "universities", "scholarships"]);

  assert.deepEqual([...appels].sort(), ["programs", "scholarships", "universities"]);
  assert.equal(r.programs[0].id, "programs-1");
  assert.equal(lecteur.source(), "firestore");
  assert.equal(lecteur.genereLe(), "");
});

test("un téléchargement qui REJETTE (réseau) retombe sur Firestore sans propager l'erreur", async () => {
  let appelsFirestore = 0;
  const lecteur = creerLecteurAvecInstantane({
    chargerInstantane: async () => { throw new Error("hors ligne"); },
    lireFirestore: async () => { appelsFirestore++; return [{ id: "x" }]; }
  });
  const r = await lecteur.lireCollection("universities");
  assert.equal(r[0].id, "x");
  assert.equal(appelsFirestore, 1);
});

test("un instantané CASSÉ (JSON valide mais forme fausse) retombe sur Firestore", async () => {
  let appelsFirestore = 0;
  const lecteur = creerLecteurAvecInstantane({
    chargerInstantane: async () => ({ programs: [], universities: "pas un tableau" }),
    lireFirestore: async () => { appelsFirestore++; return []; }
  });
  await lecteur.lireCollection("programs");
  assert.equal(appelsFirestore, 1);
  assert.equal(lecteur.source(), "firestore");
});

test("le fichier n'est téléchargé qu'UNE fois pour les trois collections", async () => {
  let telechargements = 0;
  const lecteur = creerLecteurAvecInstantane({
    chargerInstantane: async () => { telechargements++; return instantaneValide(); },
    lireFirestore: async () => []
  });
  await Promise.all(COLLECTIONS.map((n) => lecteur.lireCollection(n)));
  await lecteur.lireCollection("programs");
  assert.equal(telechargements, 1);
});

test("une lecture qui échoue N'ÉCRASE PAS la mémoïsation de l'instantané", async () => {
  // Cas limite : instantané absent ET Firestore hors ligne — le cache
  // doit évincer et réessayer (comportement de catalog-cache.js),
  // et le rejet doit remonter à l'appelant.
  let tentatives = 0;
  const lecteur = creerLecteurAvecInstantane({
    chargerInstantane: async () => null,
    lireFirestore: async () => { tentatives++; throw new Error("hors ligne"); }
  });
  const cache = creerCacheCatalogue(lecteur.lireCollection);
  await assert.rejects(() => cache.charger(["programs"]), /hors ligne/);
  await assert.rejects(() => cache.charger(["programs"]), /hors ligne/);
  assert.equal(tentatives, 2);
});

// ---------------- documentDeLInstantane ----------------

test("un document ciblé est trouvé par id, null s'il est absent", () => {
  const snap = validerInstantane(instantaneValide());
  assert.equal(documentDeLInstantane(snap, "scholarships", "b1").title, "Bourse Un");
  assert.equal(documentDeLInstantane(snap, "scholarships", "inconnue"), null);
  assert.equal(documentDeLInstantane(snap, "programs", ""), null);
  assert.equal(documentDeLInstantane(null, "programs", "x"), null);
});

// ---------------- gardes d'architecture ----------------

test("scripts/lot.mjs écrit bien assets/data/catalogue.json avec les noms des collections", () => {
  const src = readFileSync(join(racine, "scripts", "lot.mjs"), "utf8");
  assert.match(src, /assets[\/\\"', ]+data[\/\\"', ]+catalogue\.json/, "l'export doit écrire assets/data/catalogue.json");
  for (const nom of COLLECTIONS) {
    assert.ok(src.includes(`${nom}:`) || src.includes(`"${nom}"`), `l'instantané doit porter la clé ${nom}`);
  }
});

test("js/catalog-data.js lit l'instantané à l'emplacement que l'export écrit", () => {
  const src = readFileSync(join(racine, "js", "catalog-data.js"), "utf8");
  assert.match(src, /assets\/data\/catalogue\.json/);
  assert.match(src, /creerLecteurAvecInstantane/);
});

test("firebase.json ne déploie pas le fichier avec un cache long", () => {
  const cfg = JSON.parse(readFileSync(join(racine, "firebase.json"), "utf8"));
  const regles = (cfg.hosting && cfg.hosting.headers) || [];
  const regle = regles.find((r) => /catalogue\.json/.test(r.source || ""));
  assert.ok(regle, "firebase.json doit porter une règle d'en-têtes pour assets/data/catalogue.json");
  const cc = (regle.headers || []).find((h) => /cache-control/i.test(h.key));
  assert.ok(cc && /max-age=(0|[1-5]?\d{1,2}|[1-2]\d{2}|300)\b/.test(cc.value), "Cache-Control doit rester court (≤ 300 s) pour qu'un nouvel export soit vu vite");
  const ignores = (cfg.hosting && cfg.hosting.ignore) || [];
  assert.ok(!ignores.some((i) => /catalogue\.json|assets\/data/.test(i)), "assets/data/catalogue.json ne doit pas être ignoré au déploiement");
});
