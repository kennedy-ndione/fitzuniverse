/**
 * ============================================================
 * test/finition.test.mjs — les gardes du lot FINITION (2026-09-20)
 * ============================================================
 *
 * Le lot FINITION a réglé sept points de l'audit du jour. Six d'entre
 * eux peuvent se défaire en silence : un fichier généré qu'on oublie de
 * régénérer, une page neuve qui n'entre pas dans le sitemap, une balise
 * recopiée d'une page à l'autre sans son adresse. Ce fichier est ce qui
 * les rattrape.
 *
 * Ce qu'il surveille, dans l'ordre du lot :
 *
 *  1. credits.html est À JOUR avec CREDITS.md — et ne publie aucun mot
 *     de chantier ;
 *  2. sitemap.xml déclare toutes les pages indexables, toutes les
 *     fiches, et AUCUNE page portant noindex ;
 *  3. chaque page indexable porte og:url = canonique, og:site_name et
 *     og:locale ;
 *  4. les quatorze pages d'admin portent noindex, et robots.txt ne
 *     publie plus le chemin de l'admin ;
 *  5. les deux H1 qui étaient vides ou réduits à un tiret portent un
 *     texte dans le HTML SERVI ;
 *  6. la devise s'écrit d'une seule façon dans tout le site ;
 *  7. aucun champ de saisie public sans nom accessible.
 *
 * Fins de ligne : tout fichier lu ici passe par .replace(/\r\n/g,"\n").
 * ============================================================
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { convertir } from "../scripts/credits-html.mjs";
import { PAGES, fichesDuCatalogue } from "../scripts/sitemap.mjs";
import { listerPublies } from "../scripts/hosting-publie.mjs";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(path.join(RACINE, f), "utf8").replace(/\r\n/g, "\n");

const NBSP = " ";

// Les pages publiques indexables : celles qui portent une canonique et
// PAS de noindex. La liste est calculée, jamais recopiée — une page
// neuve entre donc d'elle-même dans les contrôles ci-dessous.
const PAGES_RACINE = readdirSync(RACINE).filter((f) => f.endsWith(".html"));
const INDEXABLES = PAGES_RACINE.filter((f) => {
const html = lire(f);
return /<link rel="canonical"/.test(html) && !/noindex/.test(html);
});

// ------------------------------------------------------------------
// 1. credits.html : une page, pas un fichier de travail
// ------------------------------------------------------------------

test("finition 1 — credits.html est à jour avec CREDITS.md", () => {

// Le générateur est déterministe : relancé sur le markdown du dépôt,
// il doit retrouver exactement ce que la page publie. Si quelqu'un
// ajoute un crédit sans relancer `node scripts/credits-html.mjs`,
// c'est ici que ça se voit — pas six mois plus tard, sur une photo
// dont l'auteur réclame son nom.
const attendu = convertir(lire("CREDITS.md"));
const page = lire("credits.html");

const entrees = (page.match(/<section class="legal-bloc">/g) || []).length;
const lignes = (page.match(/<dt>/g) || []).length;

assert.equal(entrees, attendu.sections.length,
`credits.html porte ${entrees} entrées, CREDITS.md en donne ${attendu.sections.length} — relancer « node scripts/credits-html.mjs »`);
assert.equal(lignes, attendu.sections.reduce((n, s) => n + s.puces.length, 0),
"le nombre de lignes d'attribution ne correspond plus — relancer le générateur");

// Et la page reste une PAGE : titre, canonique, retour à l'accueil.
assert.match(page, /<link rel="canonical" href="https:\/\/fitzuniverse\.com\/credits\.html">/);
assert.match(page, /<h1>Crédits photo<\/h1>/);

});

test("finition 1 bis — aucun mot de chantier ne monte sur la page publique", () => {

// Même règle que le lot VOIX du même jour. CREDITS.md est un document
// de travail : il cite des scripts, des numéros de lot, des hachages
// de commit. La page n'en publie rien — seul le commentaire d'en-tête
// nomme son générateur, et c'est volontaire.
const corps = lire("credits.html").replace(/<!--[\s\S]*?-->/g, "");

for (const motif of [/\blots?\s*\d+/i, /scripts\//, /admin\//, /expand-catalog/, /\.mjs\b/, /\.ps1\b/]) {
assert.equal(motif.test(corps), false, `credits.html publie « ${motif} »`);
}

// Le fichier de travail, lui, ne part plus en ligne.
const ignore = JSON.parse(lire("firebase.json")).hosting.ignore;
assert.ok(ignore.includes("CREDITS.md"));
assert.ok(lire("js/pied-de-page.js").includes('href="credits.html"'));

});

// ------------------------------------------------------------------
// 2. sitemap.xml : tout le site, et rien que le site
// ------------------------------------------------------------------

test("finition 2 — le sitemap déclare chaque page indexable, et aucune page noindex", () => {

const xml = lire("sitemap.xml");
const adresses = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const declarees = new Set(adresses.map((u) => u.replace("https://fitzuniverse.com/", "").split("?")[0]));

for (const page of INDEXABLES) {
const attendu = page === "index.html" ? "" : page;
assert.ok(declarees.has(attendu) || declarees.has(page),
`${page} est indexable mais absente du sitemap — relancer « node scripts/sitemap.mjs »`);
}

// Le contraire compte autant : une page interdite aux moteurs qui se
// retrouverait dans le sitemap serait une contradiction envoyée à
// Google par le site lui-même.
for (const page of PAGES_RACINE) {
if (!/noindex/.test(lire(page))) continue;
assert.equal(declarees.has(page), false, `${page} porte noindex et figure au sitemap`);
}

// Les fiches : autant d'adresses que de programmes au catalogue.
const catalogue = JSON.parse(lire("assets/data/catalogue.json"));
const fiches = adresses.filter((u) => u.includes("scholarship-details.html?id="));
assert.equal(fiches.length, fichesDuCatalogue(catalogue).length);
assert.equal(fiches.length, (catalogue.programs || []).length,
"chaque programme du catalogue doit avoir son adresse — c'est le principal actif du site");

// Une date qui ment est pire que pas de date : celles qui sont là
// sont au format du jour, et aucune n'est dans le futur.
const aujourdhui = new Date().toISOString().slice(0, 10);
for (const m of xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)) {
assert.match(m[1], /^\d{4}-\d{2}-\d{2}$/);
assert.ok(m[1] <= aujourdhui, `lastmod dans le futur : ${m[1]}`);
}

// scholarship-details.html est indexable, mais elle n'entre PAS dans
// le sitemap comme page : elle y entre 507 fois, une par fiche. C'est
// la seule exception, et elle est nommée ici pour qu'une page neuve
// oubliée ne puisse pas se cacher derrière elle.
assert.equal(PAGES.length, INDEXABLES.length - 1,
"scripts/sitemap.mjs ne connaît pas le même nombre de pages indexables que le dépôt");
assert.ok(INDEXABLES.includes("scholarship-details.html"));

});

// ------------------------------------------------------------------
// 3. Open Graph : une adresse fait autorité, et c'est la canonique
// ------------------------------------------------------------------

test("finition 3 — og:url suit la canonique, og:site_name et og:locale sont posés", () => {

for (const page of INDEXABLES) {

const html = lire(page);
const canonique = /<link rel="canonical" href="([^"]+)">/.exec(html)[1];
const ogUrl = /<meta property="og:url" content="([^"]+)">/.exec(html);

assert.ok(ogUrl, `${page} : og:url manquant`);
assert.equal(ogUrl[1], canonique, `${page} : og:url ≠ canonique`);
assert.match(html, /<meta property="og:site_name" content="FitzUniverse">/, `${page} : og:site_name`);
assert.match(html, /<meta property="og:locale" content="fr_FR">/, `${page} : og:locale`);
assert.match(html, /<meta property="og:title"/, `${page} : og:title`);
assert.match(html, /<meta property="og:image"/, `${page} : og:image`);

}

// La fiche est paramétrée : sa canonique et son og:url sont réécrits
// au chargement, et doivent l'être ENSEMBLE.
const details = lire("details.js");
assert.ok(details.includes('meta[property="og:url"]'), "details.js doit mettre og:url à jour");
assert.ok(details.includes("ogUrl.setAttribute(\"content\", canonical.href)"));

});

// ------------------------------------------------------------------
// 4. L'admin ne s'indexe pas, et ne s'annonce pas
// ------------------------------------------------------------------

test("finition 4 — toutes les pages d'admin portent noindex, et robots.txt ne publie plus le chemin", () => {

// LES PAGES SERVIES, PAS LES FICHIERS SUR LE DISQUE. Le dossier
// admin/ porte une cinquantaine de pages HTML, dont l'outillage
// historique (expand-catalog-batch*, diag-*, migrate*, import-*,
// backfill-*) que firebase.json ne publie plus depuis le lot
// ADMIN-MÉNAGE. Une page que Hosting ne sert pas ne peut pas être
// indexée : lui demander un noindex serait du bruit, et la première
// version de ce test a échoué pour cette raison exacte.
// listerPublies() est la même source de vérité que
// test/hosting-publie.test.mjs et test/liens.test.mjs — si une page
// d'admin redevient publiée un jour, elle entre ici toute seule.
const publiees = listerPublies(RACINE).map((p) => p.replace(/\\/g, "/")).filter((p) => p.startsWith("admin/") && p.endsWith(".html"));
assert.ok(publiees.length >= 14, `${publiees.length} pages d'admin servies`);

for (const page of publiees) {
assert.match(lire(page), /<meta name="robots" content="noindex, nofollow">/,
`${page} : servie par Hosting sans noindex, la coquille peut être indexée`);
}

// Les lignes de commentaire expliquent justement pourquoi la
// directive a été retirée : les lire reviendrait à trouver ce qu'on
// vérifie absent.
const robots = lire("robots.txt").split("\n").filter((l) => !l.trim().startsWith("#")).join("\n");
assert.equal(/Disallow:\s*\/admin\//.test(robots), false,
"« Disallow: /admin/ » publie le chemin ET empêche le robot de lire le noindex");
assert.match(robots, /Sitemap: https:\/\/fitzuniverse\.com\/sitemap\.xml/);

});

// ------------------------------------------------------------------
// 5. Un titre dans le HTML servi
// ------------------------------------------------------------------

test("finition 5 — les deux H1 remplis par JavaScript ne partent plus vides", () => {

const fiche = /<h1 id="title">([^<]*)<\/h1>/.exec(lire("scholarship-details.html"));
assert.ok(fiche, "scholarship-details.html : H1 introuvable");
assert.ok(fiche[1].trim().length > 10, "le H1 servi de la fiche est vide");

const dest = /<h1 id="destTitre">([^<]*)<\/h1>/.exec(lire("preinscription-france.html"));
assert.ok(dest, "preinscription-france.html : H1 introuvable");
assert.ok(!/^[—\-\s]*$/.test(dest[1]), "le H1 servi est un tiret");

});

// ------------------------------------------------------------------
// 6 et 7. Une devise, et des champs qui se nomment
// ------------------------------------------------------------------

test("finition 6 — la devise s'écrit d'une seule façon", () => {

const fichiers = [...PAGES_RACINE, ...readdirSync(RACINE).filter((f) => f.endsWith(".js")),
...readdirSync(path.join(RACINE, "js")).filter((f) => f.endsWith(".js")).map((f) => `js/${f}`)];

for (const f of fichiers) {
const contenu = lire(f);
// « FCFA » collé et « F CFA » à espace ordinaire ont disparu ; seuls
// restent la forme retenue et les identifiants (priceFCFA…).
assert.equal(/(?<![A-Za-z_])FCFA(?![A-Za-z_])/.test(contenu), false, `${f} : « FCFA » collé`);
assert.equal(/\bF CFA\b/.test(contenu), false, `${f} : « F CFA » à espace ordinaire (il en faut une insécable)`);
}

// Et la forme retenue est bien présente là où l'on vend.
assert.ok(lire("offers.html").includes(`F${NBSP}CFA`));
assert.ok(lire("pricing-plans.js").includes(`F${NBSP}CFA`));

});

test("finition 7 — aucun champ de saisie public sans nom accessible", () => {

const sansNom = [];

for (const page of PAGES_RACINE) {

// Les commentaires HTML citent des balises en exemple (« habille les
// <select> pays/niveau ») : les compter donnerait quatre champs
// fantômes. On les retire, en gardant la longueur du document pour
// que les positions restent justes.
const html = lire(page).replace(/<!--[\s\S]*?-->/g, (bloc) => " ".repeat(bloc.length));
const pourQui = new Set([...html.matchAll(/<label[^>]*\bfor="([^"]+)"/g)].map((m) => m[1]));

for (const champ of html.matchAll(/<(input|select|textarea)\b([^>]*)>/g)) {

const [, balise, attributs] = champ;
const type = (/\btype="([^"]+)"/.exec(attributs) || [, ""])[1].toLowerCase();
if (balise === "input" && ["hidden", "submit", "button", "checkbox", "radio", "file"].includes(type)) continue;

const id = (/\bid="([^"]+)"/.exec(attributs) || [, ""])[1];
if (id && pourQui.has(id)) continue;
if (/aria-label(ledby)?=/.test(attributs)) continue;

// Un champ ENVELOPPÉ dans son <label> est nommé, lui aussi.
const avant = html.slice(0, champ.index);
if (avant.lastIndexOf("<label") > avant.lastIndexOf("</label>")) continue;

sansNom.push(`${page} #${id || "(sans id)"} <${balise}>`);

}

}

assert.deepEqual(sansNom, [],
`\n  Un placeholder n'est pas un libellé : il disparaît à la frappe.\n  ${sansNom.join("\n  ")}\n`);

});
