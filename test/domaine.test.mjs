/**
* Lot DOMAINE (2026-09-17) — le site ne se présente plus que sous
* https://fitzuniverse.com.
*
* Pourquoi un test : PayDunya ouvre le site pendant la vérification du
* compte (KYC). Le nom du dossier (RCCM « FITZUNIVERSE »), le site de la
* boutique (functions/paiement.js) et les adresses que le site annonce
* aux moteurs de recherche (canonical, og:image, robots.txt, sitemap.xml)
* doivent tous dire la même chose. L'ancienne adresse provisoire
* scholarbridge-e0d84.web.app porte l'ancienne marque : elle ne doit
* plus apparaître nulle part dans ce qui est publié.
*
* Hors périmètre, à dessein : firebase-config.js (authDomain en
* .firebaseapp.com est un identifiant technique de Firebase Auth, jamais
* montré au visiteur) et l'URL du webhook en cloudfunctions.net (appelée
* par PayDunya seul, invisible de l'étudiant).
*/
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(path.join(RACINE, f), "utf8").replace(/\r\n/g, "\n");
const DOMAINE = "https://fitzuniverse.com";
const ANCIEN = /scholarbridge-e0d84\.web\.app|scholarbridge\.example/;

// Même périmètre que test/liens.test.mjs.
function pagesServies() {
const out = [];
const parcourir = (d) => {
for (const e of readdirSync(path.join(RACINE, d), { withFileTypes: true })) {
if (e.isDirectory()) { if (!/^(node_modules|\.git|\.claude|sauvegardes|Claude outputs|design-previews|functions|scripts|test)$/.test(e.name)) parcourir(path.join(d, e.name)); }
else if (e.name.endsWith(".html")) out.push(path.join(d, e.name));
}
};
parcourir(".");
return out;
}

test("domaine — aucune page publiée ne cite l'ancienne adresse", () => {
const fautifs = pagesServies().filter((f) => ANCIEN.test(lire(f)));
assert.deepEqual(fautifs, []);
});

test("domaine — chaque canonical et og:image pointe vers fitzuniverse.com", () => {
const ecarts = [];
for (const f of pagesServies()) {
const html = lire(f).replace(/<!--[\s\S]*?-->/g, "");
for (const m of html.matchAll(/<link rel="canonical" href="([^"]+)"/g)) {
if (!m[1].startsWith(DOMAINE + "/")) ecarts.push(`${f} canonical → ${m[1]}`);
}
for (const m of html.matchAll(/<meta property="og:(?:image|url)" content="([^"]+)"/g)) {
if (!m[1].startsWith(DOMAINE + "/")) ecarts.push(`${f} og → ${m[1]}`);
}
}
assert.deepEqual(ecarts, []);
});

test("domaine — l'accueil se déclare à la racine, pas sur /index.html", () => {
assert.ok(lire("index.html").includes(`<link rel="canonical" href="${DOMAINE}/">`));
});

test("domaine — robots.txt annonce le sitemap du bon domaine", () => {
const robots = lire("robots.txt");
assert.doesNotMatch(robots, ANCIEN);
assert.match(robots, /^Sitemap: https:\/\/fitzuniverse\.com\/sitemap\.xml$/m);
});

test("domaine — chaque adresse du sitemap est sur fitzuniverse.com", () => {
const sitemap = lire("sitemap.xml");
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
assert.ok(locs.length >= 7, `sitemap trop court : ${locs.length} adresses`);
assert.deepEqual(locs.filter((u) => !u.startsWith(DOMAINE + "/")), []);
assert.ok(locs.includes(`${DOMAINE}/`), "l'accueil doit figurer à la racine");
});

test("domaine — la facture PayDunya présente fitzuniverse.com", () => {
const paiement = lire("functions/paiement.js");
assert.match(paiement, /const SITE = "https:\/\/fitzuniverse\.com";/);
assert.doesNotMatch(paiement, ANCIEN);
assert.match(paiement, /website_url: SITE/);
assert.match(paiement, /return_url: `\$\{SITE\}\/payment\.html/);
assert.match(paiement, /cancel_url: `\$\{SITE\}\/payment\.html/);
});
