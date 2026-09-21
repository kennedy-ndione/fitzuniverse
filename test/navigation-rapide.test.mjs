/**
* ============================================================
* test/navigation-rapide.test.mjs — l'espace ne fait plus la queue
* ============================================================
*
* Lot du 2026-09-21. Deux demandes de Charles :
*
*  1. « Fitz analyse votre profil… » restait affiché 40 à 60 s après
*     le diagnostic : le serveur rendait une réponse VIDE au premier
*     appel (4 fois dans la journée), le navigateur réessayait.
*
*  2. « Le clic pour être redirigé vers une autre page prend souvent du
*     temps. » MESURÉ en production : 45 à 75 modules chargés en cascade
*     sur dix niveaux, puis trois lectures Firestore à la file, puis le
*     catalogue en tout dernier.
* ============================================================
*/

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { pagesAModules, avecBloc, DEBUT, FIN } from "../scripts/precharger.mjs";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lireBrut = (f) => readFileSync(path.join(RACINE, f), "utf8");
const lire = (f) => lireBrut(f).replace(/\r\n/g, "\n");
const sansCommentaires = (js) => js.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

// ------------------------------------------------------------------
// 1. Fitz : un essai de plus, côté serveur
// ------------------------------------------------------------------

test("fitz 1 — la lecture du diagnostic a de la marge, et une réponse vide est retentée par le serveur, une fois", () => {
  const fitz = sansCommentaires(lire("functions/fitz.js"));
  assert.match(fitz, /diagnostic: \{\s*modele: "claude-sonnet-5",\s*maxTokens: 2048,/);
  const i = fitz.indexOf("let message = await generer(config.maxTokens);");
  const j = fitz.indexOf("message = await generer(config.maxTokens * 2);");
  assert.ok(i > -1 && j > i, "un second essai, au plafond doublé");
  const garde = fitz.slice(i, j);
  assert.match(garde, /if \(!config\.structuree && message\.stop_reason !== "refusal" && !texteDe\(message\)\.trim\(\)\)/);
  assert.match(garde, /logger\.warn\("Réponse vide — nouvel essai"/);
  // Jamais une seconde réservation de points pour une seule lecture.
  assert.equal((fitz.match(/await reserverPoints\(/g) || []).length, 1);
  assert.ok(fitz.indexOf("await reserverPoints(") < i, "la réservation précède les essais");
  // Le refus final reste journalisé (voir test/fitz-reel.test.mjs, « vide 1 »).
  assert.ok(fitz.indexOf('"Fitz n\'a rien renvoyé."') > j);
});

// ------------------------------------------------------------------
// 2a. Les modules partent ensemble
// ------------------------------------------------------------------

test("navigation 1 — chaque page à modules porte un bloc de préchargement À JOUR", () => {
  const pages = pagesAModules();
  assert.ok(pages.length >= 25, `trop peu de pages trouvées (${pages.length})`);
  const perimees = pages.filter((p) => lireBrut(p) !== avecBloc(path.join(RACINE, p)));
  assert.deepEqual(perimees, [], `bloc périmé — lancer : node scripts/precharger.mjs`);
});

test("navigation 2 — le bloc précharge tout le graphe statique, SDK compris, dans le <head>", () => {
  const html = lire("applications.html");
  const i = html.indexOf(DEBUT), j = html.indexOf(FIN), fin = html.indexOf("</head>");
  assert.ok(i > -1 && j > i && fin > j, "le bloc vit dans le <head>");
  const liens = html.slice(i, j).match(/<link rel="modulepreload" href="[^"]+">/g) || [];
  assert.ok(liens.length >= 40, `seulement ${liens.length} modules préchargés`);
  for (const attendu of ["applications.js", "js/app-shell.js", "js/access-guard.js", "firebase-config.js", "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js"]) {
    assert.ok(liens.some((l) => l.includes(`href="${attendu}"`)), `${attendu} n'est pas préchargé`);
  }
  // Un import() dynamique reste paresseux : results.js ne charge
  // js/diagnostic-garde.js qu'après l'affichage (conserverLeDiagnostic).
  assert.ok(!lire("results.html").includes('href="js/diagnostic-garde.js"'), "un module dynamique ne doit pas être préchargé");
});

// ------------------------------------------------------------------
// 2b. Les lectures de départ partent ensemble
// ------------------------------------------------------------------

test("navigation 3 — compte, fiche admin et configuration sont lus en parallèle", () => {
  const js = sansCommentaires(lire("js/access-guard.js"));
  const debut = js.indexOf("export function resolveSession");
  const bloc = js.slice(debut, js.indexOf("export function fetchFeatureFlags"));
  const iDrapeaux = bloc.indexOf("lancerLesDrapeaux();");
  const iAdmin = bloc.indexOf('const adminEnVol = getDoc(doc(db, "admins", firebaseUser.uid)).catch(() => null);');
  const iCompte = bloc.indexOf("let userSnap = await getDoc(userRef);");
  assert.ok(iDrapeaux > -1 && iAdmin > -1 && iCompte > -1);
  assert.ok(iDrapeaux < iCompte && iAdmin < iCompte, "les deux autres lectures partent AVANT d'attendre le compte");
  assert.match(bloc, /const ownerSnap = await adminEnVol;/);
  assert.ok(!/await getDoc\(doc\(db, "admins"/.test(bloc), "plus de lecture admin à la file");
  assert.match(js, /export function fetchFeatureFlags\(\) \{\s*return drapeauxEnVol \|\| lireLesDrapeaux\(\);\s*\}/);
});

test("navigation 4 — les hubs lancent le catalogue dès leur chargement", () => {
  assert.match(lire("js/catalog-data.js"), /export function prechargerCatalogue\(\) \{\s*telechargerInstantane\(\);\s*\}/);
  for (const f of ["dashboard.js", "applications.js", "espace-preinscription.js"]) {
    const js = sansCommentaires(lire(f));
    assert.match(js, /import \{ prechargerCatalogue, [^}]+\} from "\.\/js\/catalog-data\.js";\s*prechargerCatalogue\(\);/, f);
  }
});

// ------------------------------------------------------------------
// 2c. La page suivante part avant le clic
// ------------------------------------------------------------------

test("navigation 5 — règles de spéculation : prefetch seulement, jamais sur une page qui engage", () => {
  const js = sansCommentaires(lire("js/mobile-nav.js"));
  const f = js.slice(js.indexOf("function initPrechargementDesPages"), js.indexOf("function init()"));
  assert.match(f, /HTMLScriptElement\.supports\("speculationrules"\)/);
  assert.match(f, /prefetch: \[\{/);
  assert.ok(!/prerender/.test(f), "jamais de prerender : la page ne s'exécute pas en avance");
  for (const exclue of ["/payment.html*", "/login.html*", "/inscription.html*", "/admin/*"]) {
    assert.ok(f.includes(`{ not: { href_matches: "${exclue}" } }`), `${exclue} doit être exclue`);
  }
  assert.match(f, /eagerness: "moderate"/);
  assert.match(js, /function init\(\) \{[\s\S]*?initPrechargementDesPages\(\);\s*\}/);
});

test("diagnostic : la réflexion par défaut de sonnet-5 est coupée, les lectures tronquées sont caduques", () => {
  const fitz = readFileSync(new URL("../functions/fitz.js", import.meta.url), "utf8");
  // La tâche diagnostic déclare reflexion: false…
  assert.match(fitz, /diagnostic: \{[^}]*reflexion: false,/);
  // …et l'appel la traduit en thinking désactivé.
  assert.match(fitz, /config\.reflexion === false \? \{ thinking: \{ type: "disabled" \} \}/);
  // Une rédaction coupée au plafond laisse une trace.
  assert.match(fitz, /"Rédaction coupée au plafond"/);
  const client = readFileSync(new URL("../js/ai/diagnostic-fitz.js", import.meta.url), "utf8");
  assert.match(client, /const VERSION_LECTURE = [2-9];/);
  assert.match(client, /const signature = `v\$\{VERSION_LECTURE\}-\$\{empreinte\(responses\)\}`;/);
});
