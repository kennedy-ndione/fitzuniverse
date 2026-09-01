/**
 * ============================================================
 * Tests unitaires — limites d'âge des bourses (champ ageMax),
 * lot du 2026-08-30.
 *
 * Règle commune, la même que estEligible et funder : un champ ABSENT
 * est un INCONNU, jamais « aucune limite d'âge » — et null ne doit
 * JAMAIS être traité comme false par un appelant. Ces tests
 * verrouillent les quatre consommateurs :
 *   - js/age-limits.js (import direct : module pur) ;
 *   - le moteur (js/recommend-programs.js) : écarte sur false,
 *     n'écarte PAS sur null — le test qui compte ;
 *   - le filtre catalogue (bourseCompatibleAge) : garde les bourses
 *     sans limite connue ;
 *   - le formulaire admin (admin/scholarships.js, extraction vm) :
 *     refus de `tous` + clé de cycle, aller-retour sans effacement.
 *
 * Les 5 tranches d'âge sont EXTRAITES de questions.js (le séparateur
 * est un tiret demi-cadratin entouré d'espaces) : les retaper ici
 * aurait pu masquer une divergence de caractère entre la question et
 * la table TRANCHES_AGE du module.
 *
 * Lancer : npm test   (ou : node --test test/)
 * ============================================================
 */

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import vm from "node:vm";

import {
limiteApplicable,
respecteLimiteAge,
respecteLimiteAgeTranche,
libelleLimiteAge,
bourseCompatibleAge,
computeAge
} from "../js/age-limits.js";

import { recommendPrograms } from "../js/recommend-programs.js";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const sourceAdmin = readFileSync(join(racine, "admin", "scholarships.js"), "utf8");
const sourceQuestions = readFileSync(join(racine, "questions.js"), "utf8");

// Les 5 libellés RÉELS de la question ageBracket, lus dans questions.js.
const blocAgeBracket = sourceQuestions.slice(sourceQuestions.indexOf('id:"ageBracket"'));
const TRANCHES = [...blocAgeBracket.matchAll(/label:"([^"]+)"/g)].slice(0, 5).map((m) => m[1]);

const [MOINS_18, T18_24, T25_29, T30_34, T35_PLUS] = TRANCHES;

test("les 5 tranches lues dans questions.js sont bien celles attendues", () => {
assert.equal(TRANCHES.length, 5);
assert.equal(MOINS_18, "Moins de 18 ans");
assert.ok(T18_24.startsWith("18"));
assert.ok(T25_29.startsWith("25"));
assert.ok(T30_34.startsWith("30"));
assert.ok(T35_PLUS.startsWith("35"));
});

// ============================================================
// 1. limiteApplicable / respecteLimiteAge
// ============================================================

test("ageMax absent -> null partout, et l'appelant n'exclut rien", () => {
assert.equal(limiteApplicable(undefined, "Master"), null);
assert.equal(limiteApplicable(null, "Licence"), null);
assert.equal(respecteLimiteAge(undefined, 45, "Master"), null);
// Le prédicat catalogue GARDE une bourse sans limite connue.
assert.equal(bourseCompatibleAge({ levels: ["Master"] }, 45, "Master"), true);
});

test("`tous` l'emporte sur les clés de cycle", () => {
const ageMax = { tous: 32, master: 25 };
assert.equal(limiteApplicable(ageMax, "Master"), 32);
assert.equal(limiteApplicable(ageMax, "Licence"), 32);
});

test("niveau inconnu ou absent -> null, jamais la plus basse des limites", () => {
const ageMax = { licence: 25, master: 30 };
assert.equal(limiteApplicable(ageMax, ""), null);
assert.equal(limiteApplicable(ageMax, "MBA"), null);
assert.equal(limiteApplicable({ tous: 26 }, ""), null);
assert.equal(respecteLimiteAge({ tous: 26 }, 40, ""), null);
});

test("âge exact : <= limite -> true, > limite -> false, âge inexploitable -> null", () => {
const ageMax = { master: 30 };
assert.equal(respecteLimiteAge(ageMax, 30, "Master"), true);
assert.equal(respecteLimiteAge(ageMax, 31, "Master"), false);
assert.equal(respecteLimiteAge(ageMax, "", "Master"), null);
assert.equal(respecteLimiteAge(ageMax, 0, "Master"), null);
assert.equal(respecteLimiteAge(ageMax, "abc", "Master"), null);
// Niveau sans clé et sans `tous` : pas de limite applicable.
assert.equal(respecteLimiteAge(ageMax, 40, "Doctorat"), null);
});

// ============================================================
// 2. Les 5 tranches exactes face à une limite de 26
// ============================================================

test("tranches vs limite 26 : la tranche ne tranche que si elle tombe entière d'un côté", () => {
const ageMax = { tous: 26 };
assert.equal(respecteLimiteAgeTranche(ageMax, T18_24, "Master"), true);
assert.equal(respecteLimiteAgeTranche(ageMax, T25_29, "Master"), null);
assert.equal(respecteLimiteAgeTranche(ageMax, T30_34, "Master"), false);
assert.equal(respecteLimiteAgeTranche(ageMax, T35_PLUS, "Master"), false);
assert.equal(respecteLimiteAgeTranche(ageMax, MOINS_18, "Master"), true);
});

test("tranches : « 35 ans et plus » ne peut jamais donner true, « Moins de 18 ans » jamais false", () => {
// Limite très haute : la tranche ouverte vers le haut reste un inconnu.
assert.equal(respecteLimiteAgeTranche({ tous: 90 }, T35_PLUS, "Master"), null);
// Limite très basse : la tranche ouverte vers le bas reste un inconnu.
assert.equal(respecteLimiteAgeTranche({ tous: 10 }, MOINS_18, "Master"), null);
// Tranche hors référentiel ou limite absente : null.
assert.equal(respecteLimiteAgeTranche({ tous: 26 }, "20-25", "Master"), null);
assert.equal(respecteLimiteAgeTranche(undefined, T30_34, "Master"), null);
});

// ============================================================
// 3. libelleLimiteAge
// ============================================================

test("libelleLimiteAge : \"\" si rien — jamais « pas de limite »", () => {
assert.equal(libelleLimiteAge(undefined), "");
assert.equal(libelleLimiteAge(null), "");
assert.equal(libelleLimiteAge({}), "");
});

test("libelleLimiteAge : \"26 ans\" pour `tous`, cycles dans l'ordre avec « · »", () => {
assert.equal(libelleLimiteAge({ tous: 26 }), "26 ans");
assert.equal(libelleLimiteAge({ licence: 25, master: 30 }), "25 ans (licence) · 30 ans (master)");
assert.equal(libelleLimiteAge({ doctorat: 40, master: 30 }), "30 ans (master) · 40 ans (doctorat)");
});

// ============================================================
// 4. Le moteur — écarte sur false, n'écarte PAS sur null
// ============================================================

// Date de naissance donnant exactement `n` ans aujourd'hui (1er janvier
// d'il y a n ans : l'anniversaire est toujours passé).
function naissanceIlYA(n) {
return `${new Date().getFullYear() - n}-01-01`;
}

function monterCatalogue(scholarship) {
return {
programs: [{ universityId: "u1", scholarshipId: "s1", level: "Master", status: "Ouverte" }],
universitiesById: new Map([["u1", { name: "Université Test", country: "Kenya" }]]),
scholarshipsById: new Map([["s1", { title: "Bourse Test", ...scholarship }]]),
count: 3
};
}

test("computeAge : âge exact depuis birthDate, null quand la date est absente ou illisible", () => {
assert.equal(computeAge(naissanceIlYA(30)), 30);
assert.equal(computeAge(""), null);
assert.equal(computeAge("pas-une-date"), null);
});

test("le moteur écarte une bourse dont l'âge exact dépasse le plafond (filtre dur)", () => {
const picks = recommendPrograms({
profile: { targetLevel: "Master", birthDate: naissanceIlYA(30) },
...monterCatalogue({ ageMax: { tous: 26 } })
});
assert.equal(picks.length, 0);
});

test("le moteur n'écarte PAS sur null : tranche à cheval, âge inconnu, limite absente", () => {
// Tranche à cheval sur la limite (25-29 vs 26) : inconnu, la bourse reste.
const chevauche = recommendPrograms({
profile: { targetLevel: "Master", ageBracket: T25_29 },
...monterCatalogue({ ageMax: { tous: 26 } })
});
assert.equal(chevauche.length, 1);

// Aucun âge connu : la bourse reste, même avec une limite.
const sansAge = recommendPrograms({
profile: { targetLevel: "Master" },
...monterCatalogue({ ageMax: { tous: 26 } })
});
assert.equal(sansAge.length, 1);

// Aucune limite connue : la bourse reste, même pour un profil âgé.
const sansLimite = recommendPrograms({
profile: { targetLevel: "Master", birthDate: naissanceIlYA(50) },
...monterCatalogue({})
});
assert.equal(sansLimite.length, 1);
});

test("le moteur écarte sur une tranche entièrement au-dessus du plafond (diagnostic gratuit)", () => {
const picks = recommendPrograms({
profile: { targetLevel: "Master", ageBracket: T30_34 },
...monterCatalogue({ ageMax: { tous: 26 } })
});
assert.equal(picks.length, 0);
});

test("l'âge exact prime sur la tranche quand les deux existent (profil connecté)", () => {
// birthDate dit 24 ans (dans la limite), la tranche dirait false :
// la donnée précise gagne.
const picks = recommendPrograms({
profile: { targetLevel: "Master", birthDate: naissanceIlYA(24), ageBracket: T30_34 },
...monterCatalogue({ ageMax: { tous: 26 } })
});
assert.equal(picks.length, 1);
});

// ============================================================
// 5. Le filtre catalogue
// ============================================================

test("filtre catalogue : retire sur false pour le niveau filtré, garde l'inconnu", () => {
const bourse = { levels: ["Licence", "Master"], ageMax: { licence: 25 } };
assert.equal(bourseCompatibleAge(bourse, 28, "Licence"), false);
// Master n'a ni clé ni `tous` : inconnu, la bourse reste.
assert.equal(bourseCompatibleAge(bourse, 28, "Master"), true);
});

test("filtre catalogue sans niveau filtré : retirée seulement si false sur TOUS ses niveaux", () => {
// Possible sur un seul cycle -> reste affichée.
const partielle = { levels: ["Licence", "Master"], ageMax: { licence: 25, master: 35 } };
assert.equal(bourseCompatibleAge(partielle, 28, ""), true);

// False sur tous les cycles -> retirée.
const fermee = { levels: ["Licence", "Master"], ageMax: { tous: 26 } };
assert.equal(bourseCompatibleAge(fermee, 28, ""), false);

// Sans limite connue -> reste, quel que soit l'âge.
assert.equal(bourseCompatibleAge({ levels: ["Master"] }, 60, ""), true);
});

// ============================================================
// 6. Formulaire admin (extraction vm, comme les tests bailleur)
// ============================================================

function extraireFonction(source, nom, fichier) {
const debut = source.indexOf(`function ${nom}(`);
assert.notEqual(debut, -1, `function ${nom} introuvable dans ${fichier}`);
let i = source.indexOf("{", debut);
let profondeur = 0;
do {
if (source[i] === "{") profondeur++;
if (source[i] === "}") profondeur--;
i++;
} while (profondeur > 0 && i < source.length);
return source.slice(debut, i);
}

function monterFormulaireAge() {
const contexte = {
ageMaxTousInput: { value: "" },
ageMaxLicenceInput: { value: "" },
ageMaxMasterInput: { value: "" },
ageMaxDoctoratInput: { value: "" },
ageMaxNoteInput: { value: "" }
};
vm.createContext(contexte);
for (const nom of ["lireLimiteAge", "buildAgeMaxFieldsFromForm", "fillAgeMaxForm"]) {
vm.runInContext(`${extraireFonction(sourceAdmin, nom, "admin/scholarships.js")}\nthis.${nom} = ${nom};`, contexte);
}
return contexte;
}

function valeur(objet) {
return JSON.parse(JSON.stringify(objet));
}

test("admin : refus de « tous cycles » saisi en même temps qu'une clé de cycle", () => {
const f = monterFormulaireAge();
f.ageMaxTousInput.value = "26";
f.ageMaxMasterInput.value = "30";
const resultat = f.buildAgeMaxFieldsFromForm();
assert.ok(resultat.erreur, "un message d'erreur explicite est attendu");
assert.equal(resultat.fields, undefined);
});

test("admin : refus d'un nombre non entier, négatif ou supérieur à 99", () => {
const f = monterFormulaireAge();
for (const invalide of ["26.5", "-3", "150", "abc"]) {
f.ageMaxTousInput.value = invalide;
assert.ok(f.buildAgeMaxFieldsFromForm().erreur, `"${invalide}" doit être refusé`);
}
});

test("admin : ouvrir puis ré-enregistrer sans toucher conserve ageMax et sa note", () => {
const f = monterFormulaireAge();
const doc = { ageMax: { licence: 25, master: 30 }, ageMaxNote: "25 ans pour les candidats, 28 ans pour les candidates." };
f.fillAgeMaxForm(doc);
assert.deepEqual(valeur(f.buildAgeMaxFieldsFromForm().fields), doc);
});

test("admin : formulaire vierge -> AUCUN champ écrit (ni ageMax:{} ni note vide)", () => {
const f = monterFormulaireAge();
f.fillAgeMaxForm(null);
assert.deepEqual(valeur(f.buildAgeMaxFieldsFromForm().fields), {});
});

test("admin : note seule (sans limite chiffrée) -> seul ageMaxNote est écrit", () => {
const f = monterFormulaireAge();
f.fillAgeMaxForm({ ageMaxNote: "Limite variable selon l'appel annuel." });
assert.deepEqual(valeur(f.buildAgeMaxFieldsFromForm().fields), { ageMaxNote: "Limite variable selon l'appel annuel." });
});
