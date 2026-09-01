/**
 * ============================================================
 * Tests — données du lot 31 (Afrique) et validateur de lots
 * (scripts/lot-validate.mjs), sans réseau.
 *
 * Ce que le test vérifie est EXACTEMENT ce que le runner refuse
 * (scripts/lot.mjs, étape `analyser`) : même module, mêmes règles.
 * Le croisement avec la base vivante (documents existants, couples
 * déjà liés) reste l'affaire du runner — il exige le réseau.
 *
 * Lancer : npm test   (ou : node --test test/)
 * ============================================================
 */

import test from "node:test";
import assert from "node:assert/strict";

import { validerLot, FUNDERS, ENTRY_POINTS } from "../scripts/lot-validate.mjs";
import * as lot31 from "../scripts/data/lot31.mjs";

const resultat = validerLot(lot31);

test("lot 31 : aucune erreur bloquante hors ligne", () => {
assert.deepEqual(resultat.erreurs, []);
});

test("lot 31 : le compte annoncé — 12 universités, 14 bourses, 15 programmes", () => {
assert.equal(resultat.attendus.universites, 12);
assert.equal(resultat.attendus.bourses, 14);
assert.equal(resultat.attendus.programmes, 15);
});

test("lot 31 : aucun identifiant en double, dans aucune des trois familles", () => {
const idsU = lot31.UNIVERSITIES.map((u) => u.id);
const idsB = lot31.SCHOLARSHIPS.map((s) => s.id);
const idsP = resultat.programmes.map((p) => p.id);
assert.equal(new Set(idsU).size, idsU.length);
assert.equal(new Set(idsB).size, idsB.length);
assert.equal(new Set(idsP).size, idsP.length);
});

test("lot 31 : chaque universityIds pointe vers une université du même lot", () => {
const idsU = new Set(lot31.UNIVERSITIES.map((u) => u.id));
for (const lien of lot31.LINKS) {
for (const uid of lien.universityIds) {
assert.ok(idsU.has(uid), `"${uid}" (lien ${lien.scholarshipId}) absent des universités du lot`);
}
}
});

test("lot 31 : la garde pays passe, comparaison stricte accents compris", () => {
const parId = new Map(lot31.UNIVERSITIES.map((u) => [u.id, u.data]));
for (const lien of lot31.LINKS) {
for (const uid of lien.universityIds) {
assert.equal(parId.get(uid).country, lien.pays, `pays du lien ${lien.scholarshipId} vs ${uid}`);
}
}
});

test("lot 31 : funder et entryPoint restent dans leurs énumérés", () => {
for (const s of lot31.SCHOLARSHIPS) {
if ("funder" in s.data) assert.ok(FUNDERS.includes(s.data.funder), s.id);
if ("entryPoint" in s.data) assert.ok(ENTRY_POINTS.includes(s.data.entryPoint), s.id);
}
});

test("lot 31 : al-azhar est la seule orpheline volontaire, et elle porte sa propre image", () => {
assert.deepEqual(resultat.orphelines, ["al-azhar-bourses-etudiants-etrangers"]);
const alAzhar = lot31.SCHOLARSHIPS.find((s) => s.id === "al-azhar-bourses-etudiants-etrangers");
// Sans image propre, la cascade de resolveScholarshipImage()
// descendrait au 3e étage (photo de pays) faute d'université liée.
assert.equal(alAzhar.data.image, "al-azhar-cairo.jpg");
assert.deepEqual(alAzhar.data.levels, []);
});

test("lot 31 : la langue d'un programme n'est écrite que lorsqu'elle est vérifiée (jamais \"\")", () => {
for (const p of resultat.programmes) {
if ("language" in p) assert.ok(p.language, p.id);
}
});

// ============================================================
// Le validateur lui-même : il doit refuser ce que le lot évite.
// ============================================================

function lotMinimal(surcharges = {}) {
return {
UNIVERSITIES: [{ id: "u1", data: { name: "U", country: "Kenya" } }],
SCHOLARSHIPS: [{ id: "s1", data: { title: "S", country: "Kenya", levels: ["Master"] } }],
LINKS: [{ scholarshipId: "s1", pays: "Kenya", universityIds: ["u1"], language: "" }],
...surcharges
};
}

test("validateur : un lot minimal correct passe sans erreur", () => {
const r = validerLot(lotMinimal());
assert.deepEqual(r.erreurs, []);
assert.equal(r.programmes.length, 1);
assert.equal(r.programmes[0].id, "u1__s1__master");
});

test("validateur : funder hors énuméré refusé, funder absent accepté", () => {
const mauvais = lotMinimal();
mauvais.SCHOLARSHIPS[0].data.funder = "etat";
assert.ok(validerLot(mauvais).erreurs.some((e) => e.includes("funder")));
});

test("validateur : ageMax.tous + clé de cycle refusé ; entiers 1..99 exigés ; {} refusé", () => {
const double = lotMinimal();
double.SCHOLARSHIPS[0].data.ageMax = { tous: 26, master: 30 };
assert.ok(validerLot(double).erreurs.some((e) => e.includes("EXCLUSIF")));

const horsBorne = lotMinimal();
horsBorne.SCHOLARSHIPS[0].data.ageMax = { tous: 150 };
assert.ok(validerLot(horsBorne).erreurs.some((e) => e.includes("entre 1 et 99")));

const vide = lotMinimal();
vide.SCHOLARSHIPS[0].data.ageMax = {};
assert.ok(validerLot(vide).erreurs.some((e) => e.includes("ageMax vide")));
});

test("validateur : garde pays stricte — un accent manquant bloque", () => {
const lot = lotMinimal();
lot.UNIVERSITIES[0].data.country = "Égypte";
lot.LINKS[0].pays = "Egypte";
assert.ok(validerLot(lot).erreurs.some((e) => e.includes("Garde pays")));
});

test("validateur : une bourse LIÉE sans niveau bloque ; une orpheline sans niveau ne bloque pas", () => {
const liee = lotMinimal();
liee.SCHOLARSHIPS[0].data.levels = [];
assert.ok(validerLot(liee).erreurs.some((e) => e.includes("sans niveau")));

const orpheline = lotMinimal({ LINKS: [] });
orpheline.SCHOLARSHIPS[0].data.levels = [];
const r = validerLot(orpheline);
assert.deepEqual(r.erreurs, []);
assert.deepEqual(r.orphelines, ["s1"]);
});

test("validateur : identifiants en double refusés", () => {
const lot = lotMinimal();
lot.SCHOLARSHIPS.push({ id: "s1", data: { title: "Bis", country: "Kenya", levels: ["Master"] } });
assert.ok(validerLot(lot).erreurs.some((e) => e.includes("double")));
});
