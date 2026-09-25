/**
* LOT 107 — la bourse d'études de l'Université Internationale de Rabat
* (2026-09-25), lue sur la page officielle et le guide du boursier des
* étudiants internationaux.
*/
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { validerLot } from "../scripts/lot-validate.mjs";
import { premierePhrase } from "../js/scholarship-filters.js";

process.env.LOT107_SANS_PHOTOS = "1";
const lot = await import("../scripts/data/lot107-bourse-uir.mjs");
const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(join(racine, f), "utf8").replace(/\r\n/g, "\n");

test("lot 107 — une bourse, deux programmes, la preuve du guide officiel", () => {
const v = validerLot(lot, new Date("2026-09-25T23:00:00Z"));
assert.deepEqual(v.erreurs, []);
assert.equal(v.programmes.length, 2);
assert.deepEqual(v.universitesDeBase.map((u) => u.uid), ["universite-internationale-de-rabat", "universite-internationale-de-rabat"]);
const d = lot.SCHOLARSHIPS[0].data;
assert.deepEqual(d.levels, ["Licence", "Master"], "le guide ne parle pas du doctorat");
assert.match(d.generalCriteria, /baccalauréat l'année même de l'inscription/);
// Les textes de carte tiennent dans la carte (lisible 6).
assert.ok(d.description.length <= 150 && premierePhrase(d.funding).length <= 70 && d.periodeOuverture.length <= 130 && d.status.length <= 55);
for (const l of lot.LINKS) assert.match(l.champs.sourceVerification.url, /^https:\/\/www\.uir\.ac\.ma\//);
});

test("lot 107 — la photo et son crédit", () => {
assert.match(lire("scripts/add-lot107-photos.mjs"), /base: "uir-bourse-etudes-internationaux"/);
assert.ok(lire("CREDITS.md").includes("### `uir-bourse-etudes-internationaux.jpg`"));
});
