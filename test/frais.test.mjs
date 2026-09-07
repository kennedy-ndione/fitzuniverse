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
SEUILS_PAR_DEVISE, SEUIL_GRATUIT, SEUIL_ABORDABLE, JOURS_FRAICHEUR,
bandeCout, lireFrais, lireExoneration, formaterMontant, libelleMontant, libelleFrais
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

test("les libellés de bandes sont neutres : ni symbole monétaire ni chiffre", () => {
for (const b of BANDES) {
assert.ok(!/[0-9€$£]/.test(LIBELLES_BANDES[b]), `${b} : « ${LIBELLES_BANDES[b]} »`);
assert.ok(!/CHF|EUR|USD|MAD/.test(LIBELLES_BANDES[b]), `${b} : code de devise dans le libellé`);
}
assert.equal(LIBELLES_BANDES.gratuit, "Gratuit ou presque");
assert.equal(LIBELLES_BANDES.eleve, "Plus cher");
});

test("SEUIL_GRATUIT / SEUIL_ABORDABLE dérivent de SEUILS_PAR_DEVISE.EUR (source unique)", () => {
assert.equal(SEUIL_GRATUIT, SEUILS_PAR_DEVISE.EUR.gratuit);
assert.equal(SEUIL_ABORDABLE, SEUILS_PAR_DEVISE.EUR.abordable);
assert.deepEqual(Object.keys(SEUILS_PAR_DEVISE), ["EUR"], "aucune autre devise avant le lot D2");
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

test("zéro vérifié → « Gratuit · vérifié le … », jamais « 0 € »", () => {
const zero = verifiee({ licence: { montant: 0, devise: "EUR", periode: "an" } });
const l = plat(libelleFrais(zero, "Licence", { aujourdhui: AUJOURDHUI }));
assert.equal(l, "Gratuit · vérifié le 28 août 2026");
assert.ok(!/0 €/.test(l) && !/\b0 /.test(l), `« ${l} »`);
assert.equal(libelleMontant(lireFrais(zero, "Licence", { aujourdhui: AUJOURDHUI })), "Gratuit");
});

test("zéro vérifié mais pas fraîche → « Gratuit · à recouper »", () => {
const zero = verifiee({ licence: { montant: 0, devise: "EUR", periode: "an" }, verifieLe: iso(200) });
assert.equal(libelleFrais(zero, "Licence", { aujourdhui: AUJOURDHUI }), "Gratuit · à recouper");
});

test("libelleMontant : un montant non nul passe par formaterMontant, un état inconnu reste « Frais non vérifiés »", () => {
assert.equal(plat(libelleMontant(lireFrais(verifiee(), "Licence", { aujourdhui: AUJOURDHUI }))), "3 950 €/an");
assert.equal(libelleMontant(lireFrais({}, "Licence")), "Frais non vérifiés");
assert.equal(libelleMontant(null), "Frais non vérifiés");
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

test("bandeCout : une devise sans seuils posés reste « inconnu » — jamais convertie", () => {
assert.equal(bandeCout(0, "EUR"), "gratuit");
assert.equal(bandeCout(450, "USD"), "inconnu");
assert.equal(bandeCout(12000, "MAD"), "inconnu", "MAD absent du tableau tant que le lot D2 n'a pas posé ses seuils");
assert.equal(bandeCout(450, "EUR"), "gratuit");
});

test("bandeCout lit SEUILS_PAR_DEVISE : des seuils MAD posés (dans ce test seulement) rangent un montant en dirhams", () => {
// Valeurs de TEST, pas une décision : elles prouvent le mécanisme, sans
// figer un seuil marocain que seul le lot D2 posera, avec sa source.
SEUILS_PAR_DEVISE.MAD = { gratuit: 5000, abordable: 25000 };
try {
assert.equal(bandeCout(12000, "MAD"), "abordable");
assert.equal(bandeCout(4000, "MAD"), "gratuit");
assert.equal(bandeCout(40000, "MAD"), "eleve");
} finally {
delete SEUILS_PAR_DEVISE.MAD;
}
assert.equal(bandeCout(12000, "MAD"), "inconnu", "le tableau est revenu à son état d'origine");
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
