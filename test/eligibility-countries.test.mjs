/**
 * ============================================================
 * Tests unitaires — éligibilité par nationalité
 * ============================================================
 *
 * Lancer : npm test   (ou : node --test test/)
 *
 * LE test qui compte le plus ici est celui des `null` : estEligible a
 * TROIS valeurs de retour, et traiter « on ne sait pas » (null) comme
 * « non » (false) cacherait des bourses à tort — le seul bug réellement
 * grave que la fonctionnalité peut introduire. Chaque consommateur
 * (filtre catalogue, cartes, fiche, moteur de recommandation) doit
 * comparer STRICTEMENT à false (`=== false`), jamais tester la
 * falsiness.
 * ============================================================
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
estEligible,
libelleEligibilite,
isoDeNationalite,
paysEligibles,
GROUPES,
COMMONWEALTH,
BID,
AFRIQUE,
CAD_APD,
CAD_PMA,
AFRIQUE_OUEST
} from "../js/eligibility-countries.js";

// ------------------------------------------------------------
// estEligible — la table de vérité imposée par la tâche
// ------------------------------------------------------------

test("Sénégal ↛ Commonwealth : exclu (false)", () => {
assert.equal(estEligible({ groups: ["commonwealth"] }, "Sénégal"), false);
});

test("Ghana → Commonwealth : éligible (true)", () => {
assert.equal(estEligible({ groups: ["commonwealth"] }, "Ghana"), true);
});

test("Sénégal → BID : éligible (true)", () => {
assert.equal(estEligible({ groups: ["bid"] }, "Sénégal"), true);
});

test("Cap-Vert ↛ BID : exclu (false) — piège connu d'Afrique de l'Ouest", () => {
assert.equal(estEligible({ groups: ["bid"] }, "Cap-Vert"), false);
});

test("scope monde : true — c'est une affirmation d'ouverture, pas une inconnue", () => {
assert.equal(estEligible({ scope: "monde" }, "Sénégal"), true);
// Vaut aussi quand la nationalité n'est pas résolue : l'ouverture de la
// bourse ne dépend pas du référentiel de pays.
assert.equal(estEligible({ scope: "monde" }, "Wakanda"), true);
assert.equal(estEligible({ scope: "monde" }, ""), true);
});

test("champ eligibility absent : null", () => {
assert.equal(estEligible(undefined, "Sénégal"), null);
assert.equal(estEligible(null, "Sénégal"), null);
});

test("nationalité vide : null, même avec une restriction explicite", () => {
assert.equal(estEligible({ groups: ["commonwealth"] }, ""), null);
assert.equal(estEligible({ groups: ["commonwealth"] }, undefined), null);
});

test("pays hors référentiel (Wakanda) : null, jamais false", () => {
assert.equal(estEligible({ groups: ["commonwealth"] }, "Wakanda"), null);
});

// null ≠ false : le contrat que tous les consommateurs doivent respecter.
// (scope:"monde" ne figure plus ici depuis le lot 24 : ce n'est plus une
// inconnue, c'est un true — voir le test dédié juste au-dessus.)
test("null et false sont distincts — un `=== false` ne capture aucun null", () => {
const inconnus = [
estEligible(undefined, "Sénégal"),
estEligible({ groups: ["commonwealth"] }, ""),
estEligible({ groups: ["commonwealth"] }, "Wakanda")
];
for (const v of inconnus) {
assert.equal(v, null);
assert.notEqual(v === false, true);
}
});

// ------------------------------------------------------------
// include / exclude — les deux ajustements au-delà des groupes
// ------------------------------------------------------------

test("include ajoute un pays hors groupe", () => {
assert.equal(estEligible({ groups: ["commonwealth"], include: ["SN"] }, "Sénégal"), true);
});

test("exclude retire un pays membre du groupe", () => {
assert.equal(estEligible({ groups: ["commonwealth"], exclude: ["GH"] }, "Ghana"), false);
});

test("liste explicite sans groupe", () => {
assert.equal(estEligible({ scope: "liste", include: ["SN", "ML"] }, "Sénégal"), true);
assert.equal(estEligible({ scope: "liste", include: ["SN", "ML"] }, "Ghana"), false);
});

// ------------------------------------------------------------
// isoDeNationalite — résolution de texte libre
// ------------------------------------------------------------

test("résolution accents/casse/alias/code ISO direct", () => {
assert.equal(isoDeNationalite("Sénégal"), "SN");
assert.equal(isoDeNationalite("senegal"), "SN");
assert.equal(isoDeNationalite("SN"), "SN");
assert.equal(isoDeNationalite("Cabo Verde"), "CV");
assert.equal(isoDeNationalite("Türkiye"), "TR");
assert.equal(isoDeNationalite("Côte d'Ivoire"), "CI");
assert.equal(isoDeNationalite("Wakanda"), null);
assert.equal(isoDeNationalite(""), null);
});

// ------------------------------------------------------------
// paysEligibles / libelleEligibilite — comportements de bord
// ------------------------------------------------------------

test("paysEligibles : monde et champ vide donnent null (personne n'est exclu)", () => {
// VOULU, y compris depuis le lot 24 : le contrat de paysEligibles()
// reste « null = on n'exclut personne » pour les deux cas — la
// distinction monde/absent se fait dans estEligible(), pas ici.
assert.equal(paysEligibles({ scope: "monde" }), null);
assert.equal(paysEligibles(null), null);
assert.equal(paysEligibles({ groups: [] }), null);
});

// Le cœur du lot 24 : monde (affirmation) et champ absent (inconnue) ne
// doivent plus jamais produire la même réponse.
test("monde et champ absent ne se confondent plus", () => {
assert.equal(estEligible({ scope: "monde" }, "Sénégal"), true);
assert.equal(estEligible(undefined, "Sénégal"), null);
assert.notEqual(
estEligible({ scope: "monde" }, "Sénégal"),
estEligible(undefined, "Sénégal")
);
});

test("libelleEligibilite : note prioritaire, sinon libellé de groupe, sinon null", () => {
assert.equal(libelleEligibilite({ note: "Réservée aux boursiers X.", groups: ["bid"] }), "Réservée aux boursiers X.");
assert.match(libelleEligibilite({ groups: ["commonwealth"] }), /Commonwealth/);
assert.equal(libelleEligibilite(null), null);
assert.equal(libelleEligibilite({}), null);
});

// ------------------------------------------------------------
// Intégrité des listes — les effectifs officiels vérifiés le 30/08/2026
// ------------------------------------------------------------

test("effectifs des groupes : 56/57/54/141/44/16", () => {
assert.equal(COMMONWEALTH.length, 56);
assert.equal(BID.length, 57);
assert.equal(AFRIQUE.length, 54);
assert.equal(CAD_APD.length, 141);
assert.equal(CAD_PMA.length, 44);
assert.equal(AFRIQUE_OUEST.length, 16);
});

test("aucun doublon dans les listes, et GROUPES les référence toutes", () => {
for (const [id, g] of Object.entries(GROUPES)) {
assert.equal(new Set(g.codes).size, g.codes.length, `doublon dans ${id}`);
assert.ok(g.label, `label manquant pour ${id}`);
}
});

test("pièges documentés : CV/GH/LR hors BID, SN hors Commonwealth, ZW hors Commonwealth", () => {
const bid = new Set(BID);
assert.ok(!bid.has("CV") && !bid.has("GH") && !bid.has("LR"));
const cw = new Set(COMMONWEALTH);
assert.ok(!cw.has("SN") && !cw.has("ZW"));
assert.ok(cw.has("GA") && cw.has("TG"), "Gabon et Togo membres depuis 2022");
});
