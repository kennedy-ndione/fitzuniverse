/**
 * ============================================================
 * Tests — mémoïsation des lectures de catalogue (2026-08-31)
 *
 * Le défaut mesuré : index.html chargeait DEUX modules qui lisaient
 * chacun les trois collections entières, soit ~1 182 lectures Firestore
 * par affichage de l'accueil au lieu de ~591 — environ 42 chargements
 * par jour avant d'épuiser le quota gratuit. applications.js faisait la
 * même chose deux fois dans sa propre page.
 *
 * Ces tests comptent les allers-retours sur un lecteur SIMULÉ : aucune
 * dépendance Firebase, aucun réseau.
 *
 * Lancer : npm test
 * ============================================================
 */

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";

import { creerCacheCatalogue } from "../js/catalog-cache.js";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");

// Lecteur simulé : compte les appels par collection et renvoie un
// nombre de documents réaliste (l'export du 2026-08-31).
function lecteurSimule() {
const appels = [];
const tailles = { programs: 335, universities: 111, scholarships: 145 };
const lire = async (nom) => {
appels.push(nom);
return Array.from({ length: tailles[nom] || 0 }, (_, i) => ({ id: `${nom}-${i}` }));
};
return { lire, appels };
}

// ============================================================
// 1. Le cœur : deux appels, un seul aller-retour
// ============================================================

test("deux appels au catalogue ne déclenchent qu'un aller-retour par collection", async () => {
const { lire, appels } = lecteurSimule();
const cache = creerCacheCatalogue(lire);

await cache.charger(["programs", "universities", "scholarships"]);
await cache.charger(["programs", "universities", "scholarships"]);

assert.equal(appels.length, 3, `${appels.length} lectures au lieu de 3 — la mémoïsation ne tient pas`);
assert.deepEqual([...appels].sort(), ["programs", "scholarships", "universities"]);
});

test("deux appels EN PARALLÈLE partagent le même aller-retour", async () => {
// Cas réel de l'accueil : les deux modules démarrent dans le même
// tick, avant que la première réponse ne soit revenue. Mémoriser le
// résultat n'aurait pas suffi — c'est la PROMESSE qui est mémorisée.
const { lire, appels } = lecteurSimule();
const cache = creerCacheCatalogue(lire);

await Promise.all([
cache.charger(["programs", "universities", "scholarships"]),
cache.charger(["programs", "universities", "scholarships"])
]);

assert.equal(appels.length, 3, `${appels.length} lectures au lieu de 3 en parallèle`);
});

test("les deux appelants reçoivent les mêmes données", async () => {
const { lire } = lecteurSimule();
const cache = creerCacheCatalogue(lire);

const [a, b] = await Promise.all([
cache.charger(["programs"]),
cache.charger(["programs"])
]);

assert.equal(a.programs, b.programs, "les deux appelants doivent partager le même tableau");
});

// ============================================================
// 2. Mémoïsation PAR COLLECTION — le choix qui protège les pages
//    qui n'ont besoin que des universités
// ============================================================

test("demander les universités seules ne lit QUE les universités", async () => {
const { lire, appels } = lecteurSimule();
const cache = creerCacheCatalogue(lire);

await cache.charger(["universities"]);

assert.deepEqual(appels, ["universities"], "profile.html et eligibility-questions.html ne doivent pas payer les 3 collections");
});

test("un sous-ensemble déjà chargé n'est jamais relu", async () => {
const { lire, appels } = lecteurSimule();
const cache = creerCacheCatalogue(lire);

await cache.charger(["universities"]);
await cache.charger(["programs", "universities"]);
await cache.charger(["programs", "universities", "scholarships"]);

assert.equal(appels.length, 3, `${appels.length} lectures — chaque collection ne doit être lue qu'une fois`);
});

// ============================================================
// 3. Le compteur de lectures, qui rend le coût visible
// ============================================================

test("le compteur additionne les documents réellement lus, une seule fois", async () => {
const { lire } = lecteurSimule();
const cache = creerCacheCatalogue(lire);

await cache.charger(["programs", "universities", "scholarships"]);
assert.equal(cache.lectures(), 591, "335 + 111 + 145 = 591");

// Le second appel ne coûte rien : le compteur ne bouge pas.
await cache.charger(["programs", "universities", "scholarships"]);
assert.equal(cache.lectures(), 591, "un appel mémoïsé ne doit rien ajouter au compteur");
});

test("une lecture qui échoue est évincée du cache : le prochain appel réessaie", async () => {
// Sans éviction, une lecture ratée resterait mémorisée pour toute la
// vie de la page : plus personne ne réessaierait, et la seule issue
// serait un rechargement complet. Depuis le dédoublonnage, les deux
// modules de l'accueil partagent la même promesse et tombent donc
// ensemble — d'où l'importance de ce comportement.
let appels = 0;
const cache = creerCacheCatalogue(async () => { appels++; throw new Error("hors ligne"); });

await assert.rejects(() => cache.charger(["programs"]), /hors ligne/, "l'appelant doit voir le rejet, jamais un cache silencieux");
assert.equal(appels, 1);

// LE POINT DU TEST : un second appel relance une vraie tentative.
await assert.rejects(() => cache.charger(["programs"]), /hors ligne/);
assert.equal(appels, 2, "la promesse rejetée n'a pas été évincée — la page reste figée jusqu'au rechargement");
});

test("un échec n'empêche pas une réussite ultérieure, et le compteur reste juste", async () => {
let appels = 0;
const cache = creerCacheCatalogue(async (nom) => {
appels++;
// Premier appel : la connexion tombe. Second : elle revient.
if (appels === 1) throw new Error("hors ligne");
return Array.from({ length: 111 }, (_, i) => ({ id: `${nom}-${i}` }));
});

await assert.rejects(() => cache.charger(["universities"]));
assert.equal(cache.lectures(), 0, "une requête qui échoue ne lit aucun document");

const r = await cache.charger(["universities"]);
assert.equal(r.universities.length, 111);
assert.equal(cache.lectures(), 111);

// Et la réussite, elle, est bien mémoïsée.
await cache.charger(["universities"]);
assert.equal(appels, 2, "après une réussite, plus aucune requête");
});

// ============================================================
// 4. GARDE — plus aucune lecture directe du catalogue hors du chargeur
//
// C'est cette garde qui empêche le défaut de revenir : n'importe quel
// nouveau module qui ferait son propre getDocs sur les trois
// collections ferait échouer la suite.
// ============================================================

function fichiersJs(dir = racine, acc = []) {
for (const e of readdirSync(dir)) {
// admin/ garde ses outils ponctuels (lots, migrations, audits) : ils
// tournent une fois, à la main, jamais dans une page publique.
if (["node_modules", ".git", ".claude", "admin", "scripts", "functions"].includes(e)) continue;
const p = join(dir, e);
if (statSync(p).isDirectory()) fichiersJs(p, acc);
else if (e.endsWith(".js")) acc.push(p);
}
return acc;
}

test("aucun module du site ne lit les collections du catalogue en direct", () => {
const interdit = /getDocs\(\s*collection\(\s*db\s*,\s*"(scholarships|universities|programs)"\s*\)/;

for (const p of fichiersJs()) {
const nom = relative(racine, p).replace(/\\/g, "/");
if (nom === "js/catalog-data.js") continue;

const src = readFileSync(p, "utf8");
assert.ok(!interdit.test(src),
`${nom} lit une collection du catalogue en direct — passer par chargerCatalogue() (js/catalog-data.js)`);
}
});

test("le chargeur partagé est bien le seul point d'entrée, et il existe", () => {
const src = readFileSync(join(racine, "js", "catalog-data.js"), "utf8");
for (const fn of ["chargerCatalogue", "chargerUniversites", "chargerProgrammesEtUniversites"]) {
assert.ok(src.includes(`export async function ${fn}`), `js/catalog-data.js doit exporter ${fn}`);
}
});
