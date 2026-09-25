/**
* TROIS GARDE-FOUS AUTOUR DU DÉPÔT (test en ligne du 2026-09-25).
*
* 1. Retirer un vœu se confirme dans la carte, et prévient quand le vœu
*    est déjà déclaré déposé (sa preuve serait perdue).
* 2. Déclarer un dépôt alors que des étapes d'avant ne sont pas faites
*    affiche un avertissement, sans bloquer.
* 3. Un vœu posé après la déclaration du dépôt (ou reposé après un
*    retrait) rouvre l'étape de dépôt, qui se redéclare pour lui.
*/
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { construireRoutePays } from "../js/route-destination.js";
import { destination } from "../js/destinations-preinscription.js";
import { trouverProcedure } from "../js/procedures/index.js";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(join(racine, f), "utf8");
const procedureDe = (id) => trouverProcedure({ paysDestination: destination(id).nom });

const voeu = (status) => ({ id: "pre-it-1", university: "Università di Bologna", formation: "Test", niveau: "Laurea (licence)", status });
const depotItalie = (voeux) => construireRoutePays({
id: "italie", procedure: procedureDe("italie"), voeux,
dossier: { etapes: { it_soumission: { faite: true, preuve: "TEST-1" } } }
}).etapes.find((e) => e.id === "it_soumission");

test("3 — un vœu non déposé rouvre l'étape de dépôt déjà déclarée", () => {
const ouvert = depotItalie([voeu("a_preparer")]);
assert.equal(ouvert.cochee, true);
assert.equal(ouvert.voeuxADeclarer, 1);
assert.equal(ouvert.faite, false, "le nouveau vœu n'est pas déposé : l'étape ne peut pas être faite");
const regle = depotItalie([voeu("deposee")]);
assert.equal(regle.voeuxADeclarer, 0);
assert.equal(regle.faite, true);
assert.equal(depotItalie([]).faite, true, "sans vœu, la déclaration seule compte, comme avant");
});

test("3 — les étapes qui ne sont pas des dépôts ne changent pas", () => {
const procedure = procedureDe("italie");
const etapes = Object.fromEntries(procedure.etapes.map((x) => [x.id, { faite: true, preuve: "X" }]));
const r = construireRoutePays({ id: "italie", procedure, voeux: [voeu("a_preparer")], dossier: { etapes } });
const autres = r.etapes.filter((x) => x.kind === "procedure" && !x.depot);
assert.ok(autres.length > 5);
for (const e of autres) {
assert.equal(e.voeuxADeclarer, 0, e.id);
assert.equal(e.faite, true, e.id);
}
});

test("l'espace : confirmer le retrait, avertir avant le dépôt, redéclarer", () => {
const js = lire("espace-preinscription.js");
// 1. La croix demande confirmation ; jamais de boîte du navigateur.
assert.match(js, /\[data-retirer\]"\)\.forEach\(\(b\) => b\.addEventListener\("click", \(\) => demanderRetrait\(b\)\)\)/);
assert.ok(!/\bconfirm\(/.test(js), "pas de confirm() : il bloque la page");
assert.match(js, /sa déclaration et sa preuve \(numéro ou capture\) seront perdues/);
// 2. L'avertissement, sur l'étape de dépôt et sur la candidature par vœu.
assert.match(js, /\$\{htmlAvantDepot\(e\)\}\n\s*<div class="rt-geste">/);
assert.match(js, /e\.voeux\.some\(\(v\) => !v\.depose\) \? htmlAvantDepot\(e\) : ""/);
// 3. La redéclaration.
assert.match(js, /if \(e\.depot && e\.cochee && e\.voeuxADeclarer > 0\) return htmlRedeclarer\(e\);/);
assert.match(js, /redeclarer\.addEventListener\("click", \(\) => redeclarerDepot\(\)\)/);
const css = lire("css/route.css");
assert.match(css, /\.rt-voeu-confirmer\{/);
assert.match(css, /\.rt-btn--retirer\{/);
});
