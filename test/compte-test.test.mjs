/**
* LE COMPTE DE TEST (2026-09-25).
*
* Charles : « fais en sorte de pouvoir faire tous les tests des pays
* dans ce compte ». Un compte en accès test complet (testerAccess, posé
* par l'administrateur seul) :
*   - ouvre les neuf pays et les liste tous dans la navigation ;
*   - peut remettre le pays affiché à zéro (vœux, étapes et pièces,
*     diagnostic), après une confirmation dans la page ;
*   - et c'est le seul : aucun compte payant ne voit ce bouton.
*/
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { resoudreEspace } from "../js/plan-features.js";
import { DESTINATIONS_VENDUES } from "../js/destinations-preinscription.js";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(join(racine, f), "utf8");
const js = lire("espace-preinscription.js");

test("l'accès test ouvre les deux espaces, et les neuf pays sont vendus", () => {
assert.equal(resoudreEspace({ testerAccess: true, planId: "gratuit", planPreinscriptionId: "" }), "les-deux");
assert.equal(DESTINATIONS_VENDUES.length, 9);
// La route d'un pays non acheté s'ouvre pour l'accès test.
assert.match(js, /if \(!planPays && !session\.testerAccess\) \{/);
});

test("la navigation liste les neuf pays pour un compte de test", () => {
assert.match(js, /const liste = estCompteTest\(\) \? DESTINATIONS_VENDUES\.map\(\(d\) => \(\{ destination: d \}\)\)/);
});

test("la remise à zéro : compte de test seulement, confirmée, limitée au pays affiché", () => {
assert.match(js, /function estCompteTest\(\) \{\n\s*return !!\(etat\.session && etat\.session\.testerAccess === true\);/);
assert.match(js, /zone\.hidden = !estCompteTest\(\);/);
assert.match(js, /async function remettreAZero\(\) \{\n\s*if \(!estCompteTest\(\)\) return;/);
// Confirmation dans la page, jamais par une boîte du navigateur.
assert.match(js, /Tout effacer pour ce pays \?/);
assert.ok(!/\bconfirm\(/.test(js));
// Ce qui s'efface : les vœux du pays, son dossier, son diagnostic.
assert.match(js, /for \(const v of \[\.\.\.etat\.voeux\]\) \{\n\s*await deleteDoc\(doc\(db, "users", etat\.session\.user\.uid, "applications", v\.id\)\);/);
assert.match(js, /\{ dossierFrance: deleteField\(\), diagnosticFrance: deleteField\(\) \}/);
assert.match(js, /\{ \[`dossiersPays\.\$\{etat\.destination\}`\]: deleteField\(\), \[`diagnosticsPays\.\$\{etat\.destination\}`\]: deleteField\(\) \}/);
// Jamais un champ de formule ni le profil.
const bloc = js.slice(js.indexOf("async function remettreAZero"), js.indexOf("async function remettreAZero") + 1200);
assert.ok(!/plan|testerAccess:|profile/.test(bloc.replace(/estCompteTest/g, "")), "la remise à zéro ne touche ni formule ni profil");
});

test("la page porte la zone, cachée par défaut", () => {
const html = lire("espace-preinscription.html");
assert.match(html, /<section class="rt-test" id="rtTest" hidden><\/section>/);
assert.match(lire("css/route.css"), /\.rt-test\{/);
});
