/**
* LOT 111 — LES RAPPELS D'ÉCHÉANCE PAR E-MAIL (2026-09-26)
*
* Audit du 26/09 : aucun rappel ne partait. Chaque matin à 8 h (Dakar),
* functions/emails.js (rappelsEcheances) écrit à l'étudiant dont une
* candidature qu'il suit arrive à J-30, J-14, J-7, J-3, J-1 ou au jour J.
*/
import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const require = createRequire(import.meta.url);
const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const R = require(path.join(RACINE, "functions/lib/rappels.js"));
const lire = (f) => readFileSync(path.join(RACINE, f), "utf8").replace(/\r\n/g, "\n");
const JOUR = "2026-10-01";

const carte = (o) => ({ id: "a1", university: "INTI International University", scholarship: "INTI International Education Scholarship", status: "a_preparer", accepteeLe: "2026-09-20", deadline: "2026-10-08", checklist: [], ...o });

test("111 — les paliers : J-30, J-14, J-7, J-3, J-1 et le jour même, jamais entre", () => {
assert.deepEqual(R.PALIERS, [30, 14, 7, 3, 1, 0]);
assert.equal(R.rappelsDuJour([carte({ deadline: "2026-10-08" })], JOUR)[0].jours, 7);
assert.equal(R.rappelsDuJour([carte({ deadline: "2026-10-01" })], JOUR)[0].jours, 0);
assert.deepEqual(R.rappelsDuJour([carte({ deadline: "2026-10-09" })], JOUR), [], "J-8 : pas de rappel");
assert.deepEqual(R.rappelsDuJour([carte({ deadline: "2026-09-30" })], JOUR), [], "une date passée ne se rappelle pas");
});

test("111 — seulement les cartes datées, portées par l'étudiant, pas encore déposées", () => {
assert.deepEqual(R.rappelsDuJour([carte({ deadline: null })], JOUR), []);
assert.deepEqual(R.rappelsDuJour([carte({ deadline: "2026" })], JOUR), [], "jamais une date inventée");
assert.deepEqual(R.rappelsDuJour([carte({ accepteeLe: null, isRecommendation: true })], JOUR), [], "une proposition de Fitz non acceptée");
assert.equal(R.rappelsDuJour([carte({ accepteeLe: null, isRecommendation: false })], JOUR).length, 1, "une carte créée par l'étudiant");
for (const status of R.STATUTS_DEPOSES) assert.deepEqual(R.rappelsDuJour([carte({ status })], JOUR), [], status);
});

test("111 — un e-mail par étudiant, l'échéance la plus proche d'abord, les pièces restantes comptées", () => {
const liste = R.rappelsDuJour([
carte({ id: "a1", deadline: "2026-10-15", checklist: [{ status: "complete" }, { status: "manquant" }] }),
carte({ id: "a2", university: "Taylor's University", deadline: "2026-10-02" })
], JOUR);
assert.deepEqual(liste.map((r) => r.id), ["a2", "a1"]);
assert.equal(liste[1].piecesRestantes, 1);
assert.equal(R.sujetRappel(liste), "2 dates limites approchent, la première demain");
assert.equal(R.sujetRappel([liste[1]]), "Date limite dans 14 jours : INTI International University");
const html = R.corpsRappel(liste, { prenom: "Moussa" });
assert.match(html, /Bonjour Moussa,/);
assert.match(html, /Date limite le 2 octobre 2026, demain\./);
assert.match(html, /Il reste 1 élément à terminer dans votre dossier\./);
assert.match(html, /applications\.html/);
assert.ok(!/—/.test(html));
});

test("111 — le registre : une clé par échéance et par palier ; l'échappement du HTML", () => {
const [r] = R.rappelsDuJour([carte({ id: "x/y" })], JOUR);
assert.equal(R.cleRappel("uid1", r), "uid1_x-y_2026-10-08_J7");
assert.match(R.corpsRappel([{ ...r, universite: "<script>" }]), /&lt;script&gt;/);
assert.equal(R.dateLongue("2026-11-01"), "1er novembre 2026");
});

test("111 — la fonction planifiée et la désinscription sont branchées", () => {
const js = lire("functions/emails.js");
assert.match(js, /exports\.rappelsEcheances = onSchedule\(/);
assert.match(js, /schedule: "0 8 \* \* \*",\n    timeZone: "Africa\/Dakar",/);
assert.match(js, /if \(!u\.email \|\| u\.rappelsEcheances === false\) continue;/);
assert.match(js, /\$\{lienDesabonnement\(docUser\.id\)\}&t=rappels/);
assert.match(js, /rappelsEcheances: false,/);
assert.match(lire("functions/index.js"), /exports\.rappelsEcheances = require\("\.\/emails"\)\.rappelsEcheances;/);
});
