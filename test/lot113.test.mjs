/**
* LOT 113 — LES RESTRICTIONS DE NATIONALITÉ, LISIBLES PAR LE MOTEUR
* (2026-09-26)
*
* 36 bourses ne portaient leur restriction que dans une phrase. Le lot
* pose des champs que estEligible() sait lire, et le moteur écarte ce
* qui est fermé à la nationalité (ou, pour l'ARES, au pays de résidence)
* de l'étudiant.
*/
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { PATCHES } from "../scripts/data/lot113-nationalites.mjs";
import { validerLot } from "../scripts/lot-validate.mjs";
import { estEligible, paysEligibles, AFRIQUE, UE, EEE } from "../js/eligibility-countries.js";
import { pourquoiPlusProposable } from "../js/recommend-programs.js";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(join(racine, f), "utf8").replace(/\r\n/g, "\n");
const brut = JSON.parse(lire("assets/data/catalogue.json"));
const catalogue = JSON.parse(lire("assets/data/catalogue.json"));
for (const p of PATCHES) Object.assign(catalogue.scholarships.find((s) => s.id === p.id), p.champs);
const S = new Map(catalogue.scholarships.map((s) => [s.id, s]));
const el = (id) => S.get(id).eligibility;
const JOUR = new Date("2026-09-26T09:00:00Z");

test("113 — le lot est valide, et chaque « attendu » dit ce que la base porte (avant) ou ce que le lot écrit (après)", () => {
assert.deepEqual(validerLot({ PATCHES }, JOUR).erreurs, []);
assert.equal(PATCHES.length, 33);
for (const p of PATCHES) {
const b = brut.scholarships.find((s) => s.id === p.id);
assert.ok(b, p.id);
for (const [cle, valeur] of Object.entries(p.attendu || {})) {
const lu = JSON.stringify(b[cle]);
assert.ok(lu === JSON.stringify(valeur) || lu === JSON.stringify(p.champs[cle]), `${p.id}.${cle}`);
}
// Chaque éligibilité garde une note : c'est elle que la fiche affiche.
assert.ok(p.champs.eligibility.note && p.champs.eligibility.note.length > 30, `${p.id} : note absente`);
assert.ok(!/—/.test(p.champs.eligibility.note), `${p.id} : tiret long dans la note`);
}
});

test("113 — « ouverte à tous sauf… » : l'exclusion ne touche que la nationalité reconnue et exclue", () => {
const tb = el("turkiye-burslari");
assert.equal(estEligible(tb, "Turc(que)"), false);
assert.equal(estEligible(tb, "Turquie"), false);
assert.equal(estEligible(tb, "Sénégalais(e)"), true);
assert.equal(estEligible(tb, ""), true, "nationalité inconnue : l'ouverture tient");
assert.equal(estEligible(tb, "Wakanda"), true);
assert.equal(estEligible({ scope: "monde" }, "Allemagne"), true, "« monde » sans exclusion reste ouvert à tous");
for (const id of ["nl-scholarship"]) assert.deepEqual([...el(id).exclude].sort(), [...EEE].sort());
assert.deepEqual([...el("romanian-government-scholarship").exclude].sort(), [...UE].sort());
assert.equal(estEligible(el("nl-scholarship"), "Allemagne"), false);
assert.equal(estEligible(el("nl-scholarship"), "Norvège"), false);
assert.equal(estEligible(el("bourse-emile-boutmy"), "Suisse"), false);
assert.equal(estEligible(el("bourse-emile-boutmy"), "Ivoirien(ne)"), true);
assert.equal(estEligible(el("eiffel-excellence-scholarship"), "France"), false);
assert.equal(estEligible(el("chinese-government-scholarship"), "Chine"), false);
assert.equal(estEligible(el("king-abdulaziz-scholarship"), "Arabie Saoudite"), false);
assert.equal(estEligible(el("king-abdulaziz-scholarship"), "Malien(ne)"), true);
});

test("113 — l'ARES juge le pays où l'on vit, pas la nationalité", () => {
const ares = el("bourses-formations-internationales-ares");
assert.equal(ares.base, "residence");
assert.equal(paysEligibles(ares).size, 32);
assert.equal(estEligible(ares, "Togolais(e)", "Sénégal"), true, "un Togolais qui vit au Sénégal est admis");
assert.equal(estEligible(ares, "Sénégalais(e)", "France"), false, "un Sénégalais qui vit en France ne l'est pas");
assert.equal(estEligible(ares, "Sénégalais(e)", ""), null, "sans pays de résidence, on ne tranche pas");
assert.equal(estEligible(ares, "Palestine", "Égypte"), true, "les Palestiniens sont admis où qu'ils vivent");
assert.equal(S.get("bourses-formations-internationales-ares").experienceProMinAns, 2);
assert.equal(S.get("bourses-formations-internationales-ares").experienceApresDiplome, true);
// Le motif dit « vivre », pas « nationalité ».
const p = { targetLevel: "Master", nationality: "Sénégalais(e)", country: "France" };
assert.equal(pourquoiPlusProposable({ program: { level: "Master" }, scholarship: S.get("bourses-formations-internationales-ares"), profile: p, aujourdhui: JOUR }), "elle est réservée aux personnes qui vivent dans l'un des pays de son appel");
});

test("113 — les listes officielles, pays par pays, pour les nationalités du site", () => {
const cas = [
// [bourse, nationalité, attendu]
["stipendium-hungaricum", "Sénégalais(e)", false],
["stipendium-hungaricum", "Burkinabè", true],
["stipendium-hungaricum", "Marocain(e)", true],
["stipendium-hungaricum", "Camerounais(e)", false],
["fao-hungarian-government-scholarship", "Sénégalais(e)", false],
["fao-hungarian-government-scholarship", "Malien(ne)", true],
["semmelweis-pannonia-in-excellence", "Sénégalais(e)", false],
["semmelweis-pannonia-in-excellence", "Sud-Africain(e)", true],
["chevening-scholarships", "Sénégalais(e)", true],
["chevening-scholarships", "Camerounais(e)", false],
["chevening-scholarships", "Soudanais(e)", false],
["chevening-scholarships", "Britannique", false],
["italian-government-scholarship", "Camerounais(e)", true],
["icp-connect-scholarships-vlir-uos", "Guinéen(ne)", true],
["icp-connect-scholarships-vlir-uos", "Ivoirien(ne)", false],
["icp-connect-scholarships-vlir-uos", "Togolais(e)", false],
["koica-ciat-scholarship", "Sénégalais(e)", true],
["koica-ciat-scholarship", "Guinéen(ne)", false],
["mastercard-foundation-scholars-uct", "Sud-Africain(e)", true],
["mastercard-foundation-scholars-um6p", "Français(e)", false],
["iccr-africa-scholarship-scheme", "Béninois(e)", true]
];
for (const [id, nat, attendu] of cas) assert.equal(estEligible(el(id), nat), attendu, `${id} / ${nat}`);
// L'Italie et l'ICCR couvrent les 54 pays d'Afrique ; Chevening en couvre 52.
const italie = paysEligibles(el("italian-government-scholarship"));
assert.deepEqual(AFRIQUE.filter((c) => !italie.has(c)), []);
assert.deepEqual(AFRIQUE.filter((c) => !paysEligibles(el("iccr-africa-scholarship-scheme")).has(c)), []);
assert.deepEqual(AFRIQUE.filter((c) => !paysEligibles(el("chevening-scholarships")).has(c)).sort(), ["CM", "SD"]);
});

test("113 — le moteur écarte une bourse fermée à la nationalité, avec son motif", () => {
const p = { targetLevel: "Master", nationality: "Sénégalais(e)", country: "Sénégal" };
assert.equal(pourquoiPlusProposable({ program: { level: "Master" }, scholarship: S.get("stipendium-hungaricum"), profile: p, aujourdhui: JOUR }), "cette bourse n'est pas ouverte à votre nationalité");
});

test("113 — des 36 bourses sans champ, il n'en reste que 8, chacune pour une raison écrite", () => {
const sansFiltre = catalogue.scholarships.filter((s) => {
const e = s.eligibility;
if (e && e.scope === "monde") return false;
return !paysEligibles(e);
}).map((s) => s.id).sort();
assert.deepEqual(sansFiltre, [
"al-azhar-bourses-etudiants-etrangers",
"auf-eugen-ionescu",
"auf-petrache-poenaru",
"bourse-gouvernement-maroc-amci",
"global-korea-scholarship",
"jica-sdgs-global-leader",
"swiss-government-excellence-scholarships",
"universite-senghor-master-developpement"
]);
// Les notes corrigées disent la vraie règle.
assert.match(el("auf-eugen-ionescu").note, /C'est le pays de votre université qui compte, pas votre nationalité/);
assert.match(el("global-korea-scholarship").note, /dépendent du volet/);
assert.match(el("swiss-government-excellence-scholarships").note, /pas de master/);
});

test("113 — la fiche parle de résidence quand c'est elle qui compte, et l'admin garde les nouveaux champs", () => {
const details = lire("details.js");
assert.match(details, /export function verdictNationalite\(eligibility, nationalite, residence = ""\)/);
assert.match(details, /verdictNationalite\(university\.eligibility, profile\.nationality \|\| "", profile\.country \|\| profile\.originCountry \|\| ""\)/);
const admin = lire("admin/scholarships.js");
assert.match(admin, /for \(const cle of \["base", "nationalitesToujours"\]\)/);
assert.match(admin, /scope === "groupes" \|\| scope === "liste" \|\| scope === "monde"\) \{\nconst exclude/);
const moteur = lire("js/recommend-programs.js");
assert.equal((moteur.match(/estEligible\(scholarship\.eligibility, (profile|p)\.nationality, (profile|p)\.country \|\| (profile|p)\.originCountry\)/g) || []).length, 2);
});
