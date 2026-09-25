/**
* LOT 110 — LES PIÈCES QUE CHAQUE BOURSE DEMANDE VRAIMENT (2026-09-25)
*/
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { PATCHES } from "../scripts/data/lot110-pieces.mjs";
import { validerLot } from "../scripts/lot-validate.mjs";
import { piecesDeLaBourse, dossierAAjouter } from "../js/exigences.js";
import { accesDepuisLeProfil } from "../js/recommend-programs.js";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(join(racine, f), "utf8").replace(/\r\n/g, "\n");
const catalogue = JSON.parse(lire("assets/data/catalogue.json"));
for (const p of PATCHES) Object.assign(catalogue.scholarships.find((s) => s.id === p.id), p.champs);
const S = new Map(catalogue.scholarships.map((s) => [s.id, s]));

test("110 — le lot est valide ; chaque liste de pièces a sa source officielle et des libellés propres", () => {
assert.deepEqual(validerLot({ PATCHES }, new Date("2026-09-26T09:00:00Z")).erreurs, []);
const avec = PATCHES.filter((p) => p.champs.piecesDossier);
assert.ok(avec.length >= 30, `${avec.length} bourses seulement`);
for (const p of avec) {
const d = p.champs.piecesDossier;
assert.ok(["propre", "admission"].includes(d.type), p.id);
assert.match(d.sourceVerification.url, /^https:\/\//, p.id);
assert.ok(d.sourceVerification.citation.length > 10, p.id);
assert.ok(d.pieces.length >= 1 && d.pieces.length <= 10, p.id);
for (const x of d.pieces) {
assert.ok(x.label.length >= 2 && x.label.length <= 90, `${p.id} : « ${x.label} »`);
assert.ok(!/—/.test(x.label + x.detail), `${p.id} : tiret long`);
}
}
});

test("110 — la carte propose les pièces de la bourse, sans doublon, après les exigences", () => {
const inti = S.get("inti-international-education-scholarship");
const lot = piecesDeLaBourse(inti);
assert.equal(lot.type, "admission");
const toutes = dossierAAjouter(inti, []);
assert.ok(toutes.length >= lot.pieces.length);
assert.ok(toutes.every((e) => e.type && e.label));
const deja = [{ type: "piece_bourse", label: lot.pieces[0].label.toUpperCase() }];
assert.equal(dossierAAjouter(inti, deja).filter((e) => e.type === "piece_bourse").length, lot.pieces.length - 1, "une pièce déjà là n'est pas reproposée");
assert.equal(piecesDeLaBourse({}), null);
});

test("110 — l'espace, l'admin et la fiche connaissent les pièces de la bourse", () => {
const app = lire("applications.js");
assert.match(app, /piece_bourse: \{\ntitle: "Pièces demandées par la bourse"/);
assert.match(app, /\? dossierAAjouter\(lecture\.bourse, app\.checklist\)\.length/);
assert.match(lire("dashboard.js"), /\? dossierAAjouter\(echeance\.bourse, app\.checklist\)\.length/);
assert.match(lire("admin/student-detail.js"), /piece_bourse: "Pièce demandée par la bourse"/);
assert.match(lire("scholarship-details.html"), /<section class="details-section" id="piecesSection" hidden>/);
assert.match(lire("details.js"), /afficherPieces\(university\);/);
});

test("110 — disciplines : Imperial sans le droit, pas de médecine en premier cycle au Canada, Semmelweis sur place", () => {
assert.equal(accesDepuisLeProfil(S.get("imperial-presidents-phd-scholarships"), { desiredField: "Droit" }), false);
assert.equal(accesDepuisLeProfil(S.get("imperial-presidents-phd-scholarships"), { desiredField: "Médecine" }), true);
for (const id of ["mcgill-major-entrance-scholarships", "ubc-international-scholars-program", "lester-b-pearson-international-scholarship"]) {
assert.equal(accesDepuisLeProfil(S.get(id), { desiredField: "Médecine" }), false, id);
assert.equal(accesDepuisLeProfil(S.get(id), { desiredField: "Soins infirmiers" }), true, id);
}
assert.equal(accesDepuisLeProfil(S.get("semmelweis-pannonia-in-excellence"), { country: "Sénégal" }), false);
});
