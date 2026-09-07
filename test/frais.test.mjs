/**
* ============================================================
* test/frais.test.mjs — le coût réel par université (lot D1)
* ============================================================
*
* LE test qui compte : un montant présent mais NON SOURCÉ ou NON DATÉ ne
* s'affiche pas. Et une université sans le champ ne dit jamais
* « gratuit » ni « 0 ».
* ============================================================
*/

import { test } from "node:test";
import assert from "node:assert/strict";

import {
POLITIQUES_EXONERATION, LIBELLES_EXONERATION, BANDES, LIBELLES_BANDES,
SEUIL_GRATUIT, SEUIL_ABORDABLE, JOURS_FRAICHEUR,
bandeCout, lireFrais, lireExoneration, formaterMontant, libelleFrais
} from "../js/frais.js";

const AUJOURDHUI = new Date("2026-09-07T10:00:00Z");

const iso = (jours) => {
const d = new Date(AUJOURDHUI);
d.setUTCDate(d.getUTCDate() - jours);
return d.toISOString().slice(0, 10);
};

/** Une université AVEC frais vérifiés, complète. */
function verifiee(surcharge = {}) {
return {
id: "u1", name: "Université Témoin",
fraisScolarite: {
licence: { montant: 3950, devise: "EUR", periode: "an" },
master: { montant: 2400, devise: "EUR", periode: "an" },
source: "https://exemple.invalid/frais",
verifieLe: iso(10),
...surcharge
}
};
}

const plat = (s) => s.replace(/[  ]/g, " ");

// ------------------------------------------------------------------
// Vocabulaires fermés
// ------------------------------------------------------------------

test("POLITIQUES_EXONERATION est fermé et chaque code a un libellé non vide", () => {
assert.deepEqual(POLITIQUES_EXONERATION, ["systematique", "possible_plafonnee", "aucune", "inconnue"]);
for (const p of POLITIQUES_EXONERATION) assert.ok(LIBELLES_EXONERATION[p] && LIBELLES_EXONERATION[p].trim(), `libellé vide pour ${p}`);
assert.deepEqual(Object.keys(LIBELLES_EXONERATION).sort(), [...POLITIQUES_EXONERATION].sort());
});

test("BANDES est fermé, chaque bande a un libellé, seuils 500 / 2 500", () => {
assert.deepEqual(BANDES, ["gratuit", "abordable", "eleve", "inconnu"]);
for (const b of BANDES) assert.ok(LIBELLES_BANDES[b] && LIBELLES_BANDES[b].trim());
assert.equal(SEUIL_GRATUIT, 500);
assert.equal(SEUIL_ABORDABLE, 2500);
assert.equal(JOURS_FRAICHEUR, 180);
});

// ------------------------------------------------------------------
// La règle des trois valeurs
// ------------------------------------------------------------------

test("université sans le champ → etat inconnu, libellé sans « 0 » ni « gratuit »", () => {
for (const uni of [{}, { fraisScolarite: null }, { fraisScolarite: {} }, null, undefined]) {
const f = lireFrais(uni, "Licence", { aujourdhui: AUJOURDHUI });
assert.equal(f.etat, "inconnu");
assert.equal(f.montant, null);
const l = libelleFrais(uni, "Licence", { aujourdhui: AUJOURDHUI });
assert.equal(l, "Frais non vérifiés");
assert.ok(!/0/.test(l) && !/gratuit/i.test(l));
}
});

test("montant présent mais source absente → inconnu (le chiffre non sourcé ne s'affiche pas)", () => {
const sansSource = verifiee({ source: undefined });
delete sansSource.fraisScolarite.source;
assert.equal(lireFrais(sansSource, "Licence", { aujourdhui: AUJOURDHUI }).etat, "inconnu");
assert.equal(libelleFrais(sansSource, "Licence", { aujourdhui: AUJOURDHUI }), "Frais non vérifiés");

const sourceInvalide = verifiee({ source: "page officielle" });
assert.equal(lireFrais(sourceInvalide, "Licence", { aujourdhui: AUJOURDHUI }).etat, "inconnu");
});

test("montant présent mais verifieLe absent ou illisible → inconnu", () => {
const sansDate = verifiee();
delete sansDate.fraisScolarite.verifieLe;
assert.equal(lireFrais(sansDate, "Licence", { aujourdhui: AUJOURDHUI }).etat, "inconnu");
assert.equal(lireFrais(verifiee({ verifieLe: "septembre 2026" }), "Licence", { aujourdhui: AUJOURDHUI }).etat, "inconnu");
assert.equal(lireFrais(verifiee({ verifieLe: "2026-13-45" }), "Licence", { aujourdhui: AUJOURDHUI }).etat, "inconnu");
});

test("niveau sans ligne → inconnu, même si un autre niveau est vérifié", () => {
const f = lireFrais(verifiee(), "Doctorat", { aujourdhui: AUJOURDHUI });
assert.equal(f.etat, "inconnu");
assert.equal(lireFrais(verifiee(), "Licence", { aujourdhui: AUJOURDHUI }).etat, "verifie");
assert.equal(lireFrais(verifiee(), "licence", { aujourdhui: AUJOURDHUI }).etat, "verifie", "casse indifférente");
assert.equal(lireFrais(verifiee(), "Ingénierie", { aujourdhui: AUJOURDHUI }).etat, "inconnu");
});

test("montant 0 vérifié et sourcé → verifie, montant 0 (jamais un « inconnu » déguisé)", () => {
const f = lireFrais(verifiee({ licence: { montant: 0, devise: "EUR", periode: "an" } }), "Licence", { aujourdhui: AUJOURDHUI });
assert.equal(f.etat, "verifie");
assert.equal(f.montant, 0);
});

// ------------------------------------------------------------------
// Fraîcheur et libellé
// ------------------------------------------------------------------

test("vérifié il y a 10 jours → fraiche, libellé daté", () => {
const f = lireFrais(verifiee(), "Licence", { aujourdhui: AUJOURDHUI });
assert.equal(f.etat, "verifie");
assert.equal(f.fraiche, true);
assert.equal(plat(libelleFrais(verifiee(), "Licence", { aujourdhui: AUJOURDHUI })), "3 950 €/an · vérifié le 28 août 2026");
});

test("verifieLe vieux de 200 jours → fraiche false, libellé « à recouper »", () => {
const vieille = verifiee({ verifieLe: iso(200) });
const f = lireFrais(vieille, "Licence", { aujourdhui: AUJOURDHUI });
assert.equal(f.etat, "verifie");
assert.equal(f.fraiche, false);
assert.equal(plat(libelleFrais(vieille, "Licence", { aujourdhui: AUJOURDHUI })), "3 950 €/an · à recouper");
});

test("exactement 180 jours → encore fraîche ; 181 → à recouper", () => {
assert.equal(lireFrais(verifiee({ verifieLe: iso(180) }), "Licence", { aujourdhui: AUJOURDHUI }).fraiche, true);
assert.equal(lireFrais(verifiee({ verifieLe: iso(181) }), "Licence", { aujourdhui: AUJOURDHUI }).fraiche, false);
});

test("formaterMontant : milliers séparés, devise telle que facturée, période", () => {
assert.equal(plat(formaterMontant(3950)), "3 950 €/an");
assert.equal(plat(formaterMontant(450, "EUR", "an")), "450 €/an");
assert.equal(plat(formaterMontant(12500, "CHF", "semestre")), "12 500 CHF/semestre");
assert.equal(plat(formaterMontant(9000, "GBP")), "9 000 £/an");
});

// ------------------------------------------------------------------
// Bandes
// ------------------------------------------------------------------

test("bandeCout : 0 et 450 → gratuit ; 2 400 → abordable ; 3 950 → eleve ; absent → inconnu", () => {
assert.equal(bandeCout(0), "gratuit");
assert.equal(bandeCout(450), "gratuit");
assert.equal(bandeCout(500), "gratuit");
assert.equal(bandeCout(2400), "abordable");
assert.equal(bandeCout(2500), "abordable");
assert.equal(bandeCout(3950), "eleve");
assert.equal(bandeCout(null), "inconnu");
assert.equal(bandeCout(undefined), "inconnu");
assert.equal(bandeCout("3950"), "inconnu");
assert.equal(bandeCout(-1), "inconnu");
});

test("bandeCout : sans conversion, une devise autre que l'euro reste « inconnu »", () => {
assert.equal(bandeCout(450, "USD"), "inconnu");
assert.equal(bandeCout(450, "EUR"), "gratuit");
});

// ------------------------------------------------------------------
// Exonération
// ------------------------------------------------------------------

test("lireExoneration : absent ou code hors vocabulaire → inconnue", () => {
assert.equal(lireExoneration({}).politique, "inconnue");
assert.equal(lireExoneration({ exoneration: { politique: "Systematique" } }).politique, "inconnue");
assert.equal(lireExoneration({ exoneration: { politique: "possible_plafonnee", detail: "Places limitées" } }).politique, "possible_plafonnee");
assert.equal(lireExoneration(null).politique, "inconnue");
});

// ------------------------------------------------------------------
// Pureté
// ------------------------------------------------------------------

test("lireFrais et libelleFrais ne mutent jamais l'université", () => {
const uni = verifiee();
const avant = JSON.stringify(uni);
lireFrais(uni, "Licence", { aujourdhui: AUJOURDHUI });
lireFrais(uni, "Doctorat", { aujourdhui: AUJOURDHUI });
libelleFrais(uni, "Master", { aujourdhui: AUJOURDHUI });
lireExoneration(uni);
assert.equal(JSON.stringify(uni), avant);

const vide = {};
lireFrais(vide, "Licence");
libelleFrais(vide, "Licence");
assert.deepEqual(vide, {});
});
