/**
* LOT 123 (2026-09-26) — LE CONTROL CENTER « NUIT » ALLÉGÉ
*
* Constat de Charles après le déploiement du lot 122 : « les modifications
* sont trop lourdes, la navigation dans mon espace admin est lente ».
* Mesuré : 13 images/s au lieu de 60. Cause : l'aurore ANIMÉE derrière des
* cartes en verre FLOUTÉ (backdrop-filter) — chaque image, chaque carte
* recalculait son flou. Après correction : 60 images/s, et le tableau de
* bord coûte moins de calcul qu'avant le lot 122.
*
* Ces garde-fous empêchent le retour de ce qui coûtait. Lot 124 : resserrés
* (plus aucune animation en boucle, plus de lueur).
*/
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const css = readFileSync(join(racine, "admin/nuit.css"), "utf8").replace(/\r\n/g, "\n").replace(/\/\*[\s\S]*?\*\//g, "");
const regles = [...css.matchAll(/([^{}]*)\{([^{}]*)\}/g)].map((m) => ({ sel: m[1].trim(), corps: m[2] }));

test("123 — pas de flou d'arrière-plan hors des couches passagères", () => {
const permis = /\.(modal-base|cmdk-overlay|cmdk-panel|sidebar-backdrop)\b/;
for (const { sel, corps } of regles) {
if (/backdrop-filter/.test(corps)) assert.match(sel, permis, `flou d'arrière-plan sur « ${sel} »`);
}
});

test("123 — plus d'aurore derrière les cartes (lot 124 : fond sombre uni)", () => {
const aurore = regles.find((r) => r.sel === "body::before");
if (aurore) assert.ok(!/animation|filter/.test(aurore.corps), "body::before ne doit être ni animé ni filtré");
});

test("123 — aucune animation infinie qui repeint à chaque image", () => {
for (const { sel, corps } of regles) {
assert.ok(!/infinite/.test(corps), `« ${sel} » : animation infinie`);
}
assert.ok(!regles.some((r) => r.sel === ".nuit-apparait"), "les apparitions animées sont retirées");
});

test("123 — plus de lueur floutée sur les courbes (lot 124)", () => {
const js = readFileSync(join(racine, "admin/dashboard.js"), "utf8");
assert.ok(!/shadowBlur/.test(js), "aucune ombre floutée dans le graphique");
});
