/**
* LOT 99 — LES CONDITIONS D'ACCÈS RELUES (2026-09-25)
*
* La recherche de « Puis-je me lancer ? » a relu les règles officielles.
* Ces tests tiennent les corrections du code ; celles des fiches sont
* dans scripts/data/lot99-conditions-acces.mjs.
*   - Turquie : l'admission sur les notes du bac (YÖK, Yıldız) ; le
*     denklik se demande à l'inscription, pas avant la candidature ;
*     « études en anglais » ne dispense pas (règlement des langues).
*   - Roumanie : l'ordre n° 5655/2024, art. 8 (preuves du roumain) et
*     art. 9 (programmes en langue étrangère : règle de chaque université).
*/
import test from "node:test";
import assert from "node:assert/strict";
import { trouverProcedure } from "../js/procedures/index.js";
import { destination, enClairDe, questionLangue } from "../js/destinations-preinscription.js";
import { validerPatches } from "../scripts/lot-validate.mjs";
import { PATCHES } from "../scripts/data/lot99-conditions-acces.mjs";

const etape = (pays, id) => trouverProcedure({ paysDestination: destination(pays).nom }).etapes.find((e) => e.id === id);

test("Turquie — le bac suffit à certaines universités, et le denklik vient à l'inscription", () => {
const c = etape("turquie", "tr_uni_candidature");
assert.deepEqual(c.prerequis, ["tr_choix_voie"]);
assert.match(c.consigne, /NOTES DE VOTRE BAC/);
assert.match(c.consigne, /au moins 12 sur 20/);
const voie = destination("turquie").voies.options.find((o) => o.id === "autofinancement");
assert.match(voie.aide, /notes de votre bac/);
assert.match(enClairDe("turquie", "tr_yos_inscription").enClair, /ne vous concerne pas/);
assert.equal(questionLangue("turquie").libelles.etudes_dans_la_langue, "J'ai fait mes trois dernières années de lycée dans un pays anglophone");
});

test("Roumanie — l'ordre n° 5655/2024 fait foi pour la langue", () => {
const e = etape("roumanie", "ro_langue");
assert.match(e.source, /OM_5655-2024\.pdf$/);
assert.match(e.consigne, /niveau B1 au moins/);
assert.match(e.consigne, /critères de CHAQUE université/);
assert.ok(!/quatre années consécutives/.test(e.consigne), "l'ancienne règle des quatre ans a disparu");
assert.match(enClairDe("roumanie", "ro_langue").enClair, /chaque université fixe sa règle/);
});

test("le lot 99 est valide, motivé, et ne touche que l'admission des universités", () => {
assert.deepEqual(validerPatches(PATCHES), []);
assert.equal(PATCHES.length, 39);
for (const p of PATCHES) {
assert.equal(p.collection, "universities");
assert.deepEqual(Object.keys(p.champs), ["admission"]);
assert.equal(p.champs.admission.verifieLe, "2026-09-25");
assert.match(p.motif, /2026-09-25/);
}
const txt = JSON.stringify(PATCHES.map((p) => p.champs));
assert.ok(!/n'apparaît pas dans les conditions publiées/.test(txt), "la phrase fausse sur le bac sénégalais en Malaisie a disparu");
assert.ok(!/programme prolongé de 120 crédits/.test(txt));
});
