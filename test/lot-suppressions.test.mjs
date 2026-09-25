/**
 * ============================================================
 * Tests — forme SUPPRESSIONS du runner de lots (2026-09-25)
 *
 * Retirer un document du catalogue est l'écriture la plus lourde du
 * runner : ce test verrouille ce que le validateur refuse (hors ligne)
 * et les trois gestes du runner (analyser bloque, ecrire supprime les
 * programmes d'abord, verifier contrôle l'absence).
 *
 * Cas fondateur : Sichuan University, retirée le 2026-09-25 parce que
 * son portail refuse l'accès depuis Dakar.
 *
 * Lancer : npm test   (ou : node --test test/)
 * ============================================================
 */

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { validerSuppressions, validerLot, COLLECTIONS_SUPPRIMABLES } from "../scripts/lot-validate.mjs";

function suppression(surcharges = {}) {
return {
collection: "universities",
id: "u1",
motif: "motif de test",
attendu: { name: "Université test", country: "Chine" },
...surcharges
};
}

test("suppression minimale correcte : aucune erreur", () => {
assert.deepEqual(validerSuppressions([suppression()]), []);
assert.deepEqual(validerSuppressions([suppression({ collection: "programs", id: "p1", attendu: { universityId: "u1" } })]), []);
});

test("une bourse ne se supprime jamais : on la ferme", () => {
assert.deepEqual(COLLECTIONS_SUPPRIMABLES, ["universities", "programs"]);
const e = validerSuppressions([suppression({ collection: "scholarships" })]);
assert.ok(e.some((m) => /non supprimable/.test(m)));
});

test("attendu obligatoire et non vide, motif obligatoire", () => {
assert.ok(validerSuppressions([suppression({ attendu: undefined })]).some((m) => /"attendu" obligatoire/.test(m)));
assert.ok(validerSuppressions([suppression({ attendu: {} })]).some((m) => /"attendu" obligatoire/.test(m)));
assert.ok(validerSuppressions([suppression({ attendu: ["x"] })]).some((m) => /"attendu" obligatoire/.test(m)));
assert.ok(validerSuppressions([suppression({ motif: "  " })]).some((m) => /sans motif/.test(m)));
});

test("identifiant propre, pas de doublon, pas de patch sur le même document", () => {
assert.ok(validerSuppressions([suppression({ id: "" })]).some((m) => /identifiant/.test(m)));
assert.ok(validerSuppressions([suppression({ id: "universities/u1" })]).some((m) => /identifiant/.test(m)));
assert.ok(validerSuppressions([suppression(), suppression()]).some((m) => /en double/.test(m)));
const patch = { collection: "universities", id: "u1", motif: "m", champs: { name: "x" } };
assert.ok(validerSuppressions([suppression()], [patch]).some((m) => /contradiction/.test(m)));
});

test("validerLot porte les suppressions et les compte", () => {
const r = validerLot({ SUPPRESSIONS: [suppression(), suppression({ collection: "programs", id: "p1", attendu: { universityId: "u1" } })] });
assert.deepEqual(r.erreurs, []);
assert.equal(r.suppressions.length, 2);
assert.equal(r.attendus.suppressions, 2);
assert.ok(validerLot({ SUPPRESSIONS: [suppression({ collection: "scholarships" })] }).erreurs.length);
assert.equal(validerLot({}).attendus.suppressions, 0, "un lot sans suppression en annonce zéro");
});

test("le runner : analyser bloque, ecrire supprime les programmes d'abord, verifier contrôle l'absence", () => {
const runner = readFileSync(new URL("../scripts/lot.mjs", import.meta.url), "utf8");
assert.match(runner, /SUPPRESSIONS: module\.SUPPRESSIONS \|\| \[\]/);
// analyser : attendu comparé à la base, programmes restants bloquants.
assert.match(runner, /const ecarts = diffChamps\(s\.attendu, snap\.data\(\)\);/);
assert.match(runner, /est encore citée par \$\{restants\.length\} programme\(s\)/);
// ecrire : programmes avant universités.
assert.match(runner, /const ordre = \{ programs: 0, universities: 1 \};/);
assert.match(runner, /await db\.collection\(s\.collection\)\.doc\(s\.id\)\.delete\(\);/);
// verifier : l'absence est la preuve.
assert.match(runner, /ENCORE PRÉSENT : \$\{s\.collection\}\/\$\{s\.id\}/);
});
