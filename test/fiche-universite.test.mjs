/**
* ============================================================
* Lot 76-77 (2026-09-24) — LA FICHE D'ÉTABLISSEMENT, ET LES FICHES
* QUI LA NOURRISSENT
* ============================================================
*
* Deux choses sont gardées ici.
*
* 1. LA PAGE. Une carte de universities.html menait au PREMIER programme
*    de l'université — ou, pour une université sans programme, à
*    « Cette opportunité n'est plus disponible » (Witwatersrand, puis
*    les 31 établissements des lots 76 et 77). Elle mène désormais à
*    universite.html, qui dit tout ce que le catalogue sait de
*    l'établissement et liste ses programmes.
*
* 2. LES DONNÉES DES LOTS 76 ET 77. Charles : « qu'aucun détail ne soit
*    omis ». Chaque établissement porte sa démarche de candidature, ses
*    sources et leur date — et ces textes, lus par des bacheliers,
*    suivent les mêmes règles que le reste du catalogue (lisible 8) :
*    ni tiret long, ni mot crié en capitales, ni note de travail.
*
* Preuves par mutation faites le 2026-09-24 :
*   la carte rendue à `scholarship-details.html?id=${primaryProgramId}`
*     sans condition → test 1 rouge ;
*   `admission.procedure` d'UdeM vidé → test 5 rouge ;
*   un « — » ajouté dans une démarche → test 6 rouge ;
*   `.textContent` remplacé par `.innerHTML` pour la note des frais
*     → test 3 rouge.
* ============================================================
*/
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { ficheUniversite, resumeFiche, adresseFiche, domaineDe } from "../js/fiche-universite.js";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(path.join(RACINE, f), "utf8").replace(/\r\n/g, "\n");
const codeSeul = (f) => lire(f)
.replace(/\/\*[\s\S]*?\*\//g, "")
.replace(/^\s*\/\/.*$/gm, "")
.replace(/<!--[\s\S]*?-->/g, "");

const cat = JSON.parse(lire("assets/data/catalogue.json"));
const JOUR = new Date("2026-09-24T12:00:00Z");

// Les établissements des lots 76 et 77 : ceux qui portent `admission`.
const AVEC_DEMARCHE = cat.universities.filter((u) => u.admission);

// ------------------------------------------------------------------

test("fiche 1 — une carte d'université mène à la fiche d'établissement, sauf depuis une bourse", () => {

const src = codeSeul("universities-page.js");
assert.match(src, /import \{ adresseFiche \} from "\.\/js\/fiche-adresse\.js";/);
assert.match(src, /window\.location\.href = scholarshipIdFilter && university\.primaryProgramId\n\? `scholarship-details\.html\?id=\$\{university\.primaryProgramId\}`\n: adresseFiche\(university\.firestoreId\);/,
"la carte doit mener à la fiche, et au programme seulement quand la page est filtrée sur une bourse");
// Plus jamais l'identifiant d'une UNIVERSITÉ passé à la fiche programme.
assert.ok(!/primaryProgramId: programsForUniversity\[0\] \? programsForUniversity\[0\]\.firestoreId : university\.firestoreId/.test(src),
"une université sans programme redonnerait son propre id à scholarship-details.html");
assert.equal(adresseFiche("universite-laval-quebec"), "universite.html?id=universite-laval-quebec");
assert.equal(adresseFiche("a b"), "universite.html?id=a%20b");

});

test("fiche 2 — chaque université du catalogue a une fiche qui se rend, avec un coût dit", () => {

assert.ok(cat.universities.length >= 150);
for (const u of cat.universities) {
const vue = ficheUniversite({ universite: u, programmes: cat.programs, bourses: cat.scholarships, aujourdhui: JOUR });
assert.ok(vue, u.id);
assert.ok(vue.titre && vue.titre !== "Établissement du catalogue", `${u.id} : sans nom`);
assert.ok(vue.couts.lignes.length >= 1, `${u.id} : aucune ligne de coût`);
for (const l of vue.couts.lignes) assert.ok(l.texte, `${u.id} : ligne de coût vide`);
// Un programme de l'université est listé, et aucun autre.
const siens = cat.programs.filter((p) => p.universityId === u.id).length;
assert.equal(vue.programmes.length, siens, `${u.id} : ${vue.programmes.length} programmes listés, ${siens} au catalogue`);
for (const p of vue.programmes) assert.match(p.href, /^scholarship-details\.html\?id=/);
// La description courte tient dans une balise meta.
assert.ok(resumeFiche(vue).length <= 161, `${u.id} : résumé trop long`);
}

assert.equal(ficheUniversite({ universite: null }), null);
assert.equal(ficheUniversite({}), null);

});

test("fiche 3 — la page pose chaque texte du catalogue en textContent, jamais en innerHTML", () => {

const src = codeSeul("universite-page.js");
assert.ok(!/\.innerHTML\s*=/.test(src), "universite-page.js écrit du HTML : une source qui contiendrait un chevron écrirait dans la page");
assert.ok(!/insertAdjacentHTML/.test(src));
// Même canonique paramétrée que la fiche programme.
assert.ok(src.includes('meta[property="og:url"]'));
// Le portail : seulement pour un abonné, et par la fonction serveur.
assert.match(src, /const abonne = !!session && \(session\.testerAccess \|\| session\.planId !== "gratuit" \|\| !!session\.planPreinscriptionId \|\| session\.hasFitzExpress\);/);
assert.match(src, /portail = portailUniversite\(\{ universityId: vue\.id \}\);/);

const html = lire("universite.html");
assert.equal((html.replace(/<!--[\s\S]*?-->/g, "").match(/<h1\b/g) || []).length, 1, "un seul <h1>");
assert.match(html, /<link rel="canonical" href="https:\/\/fitzuniverse\.com\/universite\.html">/);
assert.match(html, /<script type="module" src="universite-page\.js"><\/script>/);
assert.ok(!/noindex/.test(html), "la fiche d'établissement est publique et indexable");

});

test("fiche 4 — la voie d'admission se dit sans portail, et s'éteint quand un portail existe", () => {

const publique = cat.universities.find((u) => u.voieAdmission === "voie_diplomatique_amci");
assert.ok(publique, "au moins une université passe par l'AMCI");
const vue = ficheUniversite({ universite: publique, programmes: cat.programs, bourses: cat.scholarships, aujourdhui: JOUR });
assert.ok(vue.candidature.voie, "la voie AMCI doit être dite");
assert.match(vue.candidature.voie.explication, /pas de portail|aucun dépôt/i);

// La page ne la montre qu'à défaut de portail.
const src = codeSeul("universite-page.js");
assert.match(src, /const voie = portail \? null : c\.voie;/);

// Et la destination vendue mène à SA page.
assert.equal(vue.destination && vue.destination.page, "preinscription-maroc.html");

});

test("fiche 5 — les établissements des lots 76 et 77 sont complets et sourcés", (t) => {

// Avant l'export des lots, le catalogue n'en porte aucun : le test le
// DIT (skip) au lieu de passer en silence sur une liste vide.
if (!AVEC_DEMARCHE.length) { t.skip("aucun établissement avec démarche : lots 76 et 77 pas encore exportés"); return; }

assert.ok(AVEC_DEMARCHE.length >= 31, `${AVEC_DEMARCHE.length} établissements avec démarche`);

for (const u of AVEC_DEMARCHE) {
const a = u.admission;
assert.ok(a.procedure && a.procedure.length > 60, `${u.id} : démarche absente ou trop courte`);
assert.ok(a.langue, `${u.id} : exigence de langue non dite`);
assert.ok(a.fraisDossier, `${u.id} : frais de dossier non dits`);
assert.match(a.verifieLe, /^\d{4}-\d{2}-\d{2}$/, `${u.id} : date de lecture`);
assert.ok(new Date(`${a.verifieLe}T00:00:00Z`) <= new Date(Date.now() + 86400000), `${u.id} : date de lecture dans le futur`);
assert.ok(Array.isArray(a.sources) && a.sources.length >= 3, `${u.id} : moins de trois sources`);
for (const s of a.sources) {
assert.match(s, /^https:\/\/\S+$/, `${u.id} : source ${s}`);
assert.ok(domaineDe(s), `${u.id} : source illisible ${s}`);
// Jamais un agrégateur ni un classement comme source d'un fait.
assert.ok(!/studyportals|mastersportal|topuniversities|wikipedia|edurank/.test(s), `${u.id} : source interdite ${s}`);
}
assert.ok(u.exoneration && u.exoneration.detail && u.exoneration.source, `${u.id} : exonération non sourcée`);
// Le portail ne vit jamais dans le catalogue public (lot S3) ; la voie
// d'admission des établissements sans portail est gardée par
// test/portails.test.mjs.
assert.ok(!u.applicationPortalUrl, `${u.id} : un portail a fui dans le catalogue public`);
if (u.country === "Canada") assert.match(u.numeroEED || "", /^O\d{11,12}$/, `${u.id} : numéro EED`);
if (u.country === "Maroc") assert.ok(u.reconnaissance, `${u.id} : statut juridique non dit`);
}

});

test("fiche 6 — les textes lus par l'étudiant suivent les règles du catalogue", (t) => {

if (!AVEC_DEMARCHE.length) { t.skip("lots 76 et 77 pas encore exportés"); return; }

// Les mêmes interdits que « lisible 8 », étendus aux champs neufs.
const CRI = /\b(NON|PAS|AUCUNE?|SEULE?S?|UNIQUEMENT|OBLIGATOIRES?|EXCLUSIVEMENT|ATTENTION|PIÈGE|IMPORTANT|JAMAIS|TOUS|TOUTES|AVANT|APRÈS|DOIT|FAUT|DÉJÀ|ENTIÈREMENT|GRATUITE?S?|COMPLÈTE?S?|RÉSERVÉ|GARANTI|LE|LA|LES|DES|DU|ET)\b/;
const INTERNE = /import initial|relais tiers|à la lecture d|pages? lues?\b|lot \d{2}\b/i;

const fautes = [];
for (const u of AVEC_DEMARCHE) {
const textes = [
["reconnaissance", u.reconnaissance], ["langueEnseignement", u.langueEnseignement],
["exoneration.detail", u.exoneration && u.exoneration.detail],
["fraisScolarite.note", u.fraisScolarite && u.fraisScolarite.note],
...Object.entries(u.admission).filter(([, v]) => typeof v === "string" && !/^\d{4}-/.test(v)).map(([k, v]) => [`admission.${k}`, v])
];
for (const [champ, t] of textes) {
if (typeof t !== "string") continue;
if (t.includes("—")) fautes.push(`${u.id}.${champ} : tiret long`);
const cri = t.match(CRI);
if (cri) fautes.push(`${u.id}.${champ} : « ${cri[0]} » en capitales`);
const note = t.match(INTERNE);
if (note) fautes.push(`${u.id}.${champ} : note de travail « ${note[0]} »`);
}
}
assert.deepEqual(fautes, [], fautes.join("\n"));

});

test("fiche 7 — les champs neufs d'une université sont LUS par le site", () => {

// Même règle que « champs 1 » pour le profil : un champ que personne
// n'ouvre est du travail de recherche jeté.
// codeSeul : un champ cité seulement dans un commentaire n'est pas lu.
const lecteur = codeSeul("js/fiche-universite.js");
for (const champ of ["province", "langueEnseignement", "numeroEED", "reconnaissance", "admission", "procedure", "conditions", "calendrier", "langue", "fraisDossier", "coutIndicatif", "sources"]) {
assert.ok(new RegExp(`\\b${champ}\\b`).test(lecteur), `js/fiche-universite.js ne lit pas « ${champ} »`);
}

});
