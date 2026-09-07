/**
* ============================================================
* test/parcours.test.mjs — le parcours d'une candidature (lot A)
* ============================================================
*
* Ce qui compte ici : une candidature ancienne, sans `track`, se lit
* « bourse » — et le module ne touche jamais au document qu'on lui
* passe. Le défaut est à la lecture, pas en base.
* ============================================================
*/

import { test } from "node:test";
import assert from "node:assert/strict";

import { PARCOURS, LIBELLES, lireParcours, estPreinscription } from "../js/parcours.js";

test("PARCOURS a exactement deux valeurs", () => {
assert.deepEqual(PARCOURS, ["bourse", "preinscription"]);
});

test("un document sans `track` se lit « bourse »", () => {
assert.equal(lireParcours({}), "bourse");
assert.equal(estPreinscription({}), false);
});

test("« preinscription » exactement se lit « preinscription »", () => {
assert.equal(lireParcours({ track: "preinscription" }), "preinscription");
assert.equal(estPreinscription({ track: "preinscription" }), true);
});

test("mauvaise casse, valeur inconnue, null, undefined : « bourse », sans exception", () => {
assert.equal(lireParcours({ track: "Preinscription" }), "bourse");
assert.equal(lireParcours({ track: "xyz" }), "bourse");
assert.equal(lireParcours({ track: null }), "bourse");
assert.equal(lireParcours(null), "bourse");
assert.equal(lireParcours(undefined), "bourse");
assert.equal(estPreinscription(null), false);
});

test("l'argument n'est jamais muté", () => {
const app = { id: "a1", university: "X" };
const avant = JSON.stringify(app);
lireParcours(app);
estPreinscription(app);
assert.equal(JSON.stringify(app), avant);
assert.equal("track" in app, false);
});

test("chaque valeur de PARCOURS a un LIBELLES avec court et long non vides", () => {
for (const p of PARCOURS) {
assert.ok(LIBELLES[p], `LIBELLES manque pour ${p}`);
assert.ok(typeof LIBELLES[p].court === "string" && LIBELLES[p].court.trim(), `court vide pour ${p}`);
assert.ok(typeof LIBELLES[p].long === "string" && LIBELLES[p].long.trim(), `long vide pour ${p}`);
}
});
