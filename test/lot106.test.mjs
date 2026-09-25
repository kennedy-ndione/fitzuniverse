/**
* LOT 106 — LES BOURSES PROPRES DES UNIVERSITÉS PRIVÉES (2026-09-25)
*
* Six bourses d'université, lues sur les sites officiels, chacune avec
* sa photo ; les universités sans bourse ouverte aux étrangers restent
* sans lien, avec leur motif dans l'en-tête du lot.
*/
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { validerLot, FUNDERS, ENTRY_POINTS } from "../scripts/lot-validate.mjs";

// Les photos se fabriquent sur l'ordinateur de Charles : la garde du lot
// se lève ici pour tester les données seules.
process.env.LOT106_SANS_PHOTOS = "1";
const lot = await import("../scripts/data/lot106-bourses-privees.mjs");

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(join(racine, f), "utf8").replace(/\r\n/g, "\n");
const JOUR = new Date("2026-09-25T22:00:00Z");

test("lot 106 — six bourses, chacune reliée à SON université, avec sa preuve", () => {
const v = validerLot(lot, JOUR);
assert.deepEqual(v.erreurs, []);
assert.deepEqual(v.orphelines, []);
assert.equal(lot.SCHOLARSHIPS.length, 6);
assert.equal(v.programmes.length, 12);
assert.equal(v.universitesDeBase.length, 7, "les universités sont en base : analyser les contrôle");
for (const s of lot.SCHOLARSHIPS) {
const d = s.data;
assert.equal(d.funder, "universite", s.id);
assert.ok(FUNDERS.includes(d.funder) && ENTRY_POINTS.includes(d.entryPoint), s.id);
assert.equal(d.eligibility.scope, "monde", s.id);
assert.match(d.officialWebsite, /^https:\/\//, s.id);
assert.equal(d.image, `${s.id}.jpg`, `${s.id} : chaque bourse a SA photo`);
assert.equal(d.verifieLe, "2026-09-25", s.id);
}
for (const l of lot.LINKS) {
const sv = l.champs.sourceVerification;
assert.match(sv.url, /^https:\/\//);
assert.ok(sv.citation.length > 20);
assert.ok(!/@/.test(JSON.stringify(sv)));
}
});

test("lot 106 — ce qui n'est pas ouvert aux étrangers ne devient pas une bourse", () => {
const unis = new Set(lot.LINKS.flatMap((l) => l.universityIds));
for (const id of ["segi-university-kota-damansara", "ucsi-university-kuala-lumpur", "universite-internationale-de-casablanca", "universite-internationale-de-rabat", "universite-mohammed-vi-des-sciences-et-de-la-sante-casablanca", "universite-de-saint-boniface-winnipeg"]) {
assert.ok(!unis.has(id), id);
}
// Taylor's : la recherche seulement, sa licence est fermée aux internationaux.
const taylors = lot.SCHOLARSHIPS.find((s) => s.id === "taylors-research-excellence-scholarship");
assert.deepEqual(taylors.data.levels, ["Master", "Doctorat"]);
// Les grilles de Malaisie ignorent le bac africain : la fiche le dit.
for (const id of ["apu-international-merit-awards", "sunway-academic-excellence-scholarships"]) {
assert.match(lot.SCHOLARSHIPS.find((s) => s.id === id).data.generalCriteria, /un baccalauréat africain n'y figure pas/);
}
});

test("lot 106 — les photos et leurs crédits", () => {
const script = lire("scripts/add-lot106-photos.mjs");
assert.match(script, /const DIR_VILLES = "assets\/images\/scholarships";/);
const credits = lire("CREDITS.md");
for (const s of lot.SCHOLARSHIPS) {
assert.match(script, new RegExp(`base: "${s.id}"`), `${s.id} : pas de candidat photo`);
assert.ok(credits.includes(`### \`${s.id}.jpg\``), `${s.id} : pas de crédit`);
}
// Le lot refuse de se charger sans ses photos.
assert.match(lire("scripts/data/lot106-bourses-privees.mjs"), /throw new Error\(`Lot 106 : \$\{manquants\.length\} photo\(s\) absente\(s\)/);
});

test("lot 106-longueurs — après correction, chaque texte de carte tient dans la carte", async () => {
const { PATCHES } = await import("../scripts/data/lot106-longueurs.mjs");
const { premierePhrase } = await import("../js/scholarship-filters.js");
assert.deepEqual(validerLot({ PATCHES }, JOUR).erreurs, []);
for (const s of lot.SCHOLARSHIPS) {
const p = PATCHES.find((x) => x.id === s.id);
if (p) for (const [k, v] of Object.entries(p.attendu)) assert.equal(s.data[k], v, `${s.id}.${k} : « attendu » ne correspond plus au lot 106`);
const d = { ...s.data, ...(p ? p.champs : {}) };
assert.ok(d.description.length <= 150 && !/\n/.test(d.description), `${s.id}.description`);
assert.ok(premierePhrase(d.funding).length <= 70, `${s.id}.funding`);
assert.ok(d.status.length <= 55 && d.periodeOuverture.length <= 130, s.id);
}
});
