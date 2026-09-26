/**
* LOTS 108 et 109 — L'AUDIT « DIAGNOSTIC ET ESPACE » DU 26/09/2026
*
* Charles : « regarde côté bourses comme côté diagnostic gratuit que le
* site propose des opportunités réelles et compatibles au profil, et que
* l'espace étudiant est en mesure d'accompagner à 100 % ».
* 108 : le moteur lit ce que la bourse exige d'avoir DÉJÀ (être sur
*       place, être dans le cycle), sa discipline, et le public réservé
*       aux femmes.
* 109 : l'espace porte la date du catalogue, le guichet de la bourse, la
*       fiche, et donne à Fitz les vraies règles de la bourse.
*/
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { accesDepuisLeProfil, retenirOpportunites } from "../js/recommend-programs.js";
import { EXIGENCES } from "../js/exigences.js";
import { carteFitz } from "../js/fitz-choisit.js";
import { buildPrompt } from "../js/ai/prompts.js";
import { PATCHES } from "../scripts/data/lot108-diagnostic-juste.mjs";
import { validerLot } from "../scripts/lot-validate.mjs";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(join(racine, f), "utf8").replace(/\r\n/g, "\n");
const catalogue = JSON.parse(lire("assets/data/catalogue.json"));
// Le catalogue tel qu'il sera après le lot 108 (même si l'export n'a pas
// encore été refait).
for (const p of PATCHES) Object.assign(catalogue.scholarships.find((s) => s.id === p.id), p.champs);
const S = new Map(catalogue.scholarships.map((s) => [s.id, s]));
const U = new Map(catalogue.universities.map((u) => [u.id, u]));
const AUJ = new Date("2026-09-26T09:00:00Z");

test("108 — le lot est valide, et le vocabulaire connaît les deux nouvelles conditions", () => {
assert.deepEqual(validerLot({ PATCHES }, AUJ).erreurs, []);
for (const code of ["deja_inscrit_sur_place", "cycle_en_cours"]) {
assert.equal(EXIGENCES[code].forme, "condition");
assert.ok(EXIGENCES[code].explication.length > 40);
}
});

test("108 — déjà sur place : proposable à qui réside dans le pays, jamais à qui part de chez lui", () => {
const jasso = S.get("jasso-monbukagakusho-honors");
assert.equal(accesDepuisLeProfil(jasso, { country: "Sénégal" }), false);
assert.equal(accesDepuisLeProfil(jasso, {}), false);
assert.equal(accesDepuisLeProfil(jasso, { country: "Japon" }), true);
assert.equal(accesDepuisLeProfil(S.get("vanier-canada-graduate-scholarship"), { country: "Côte d'Ivoire" }), false);
});

test("108 — déjà dans le cycle : le mémoire Zeno et la recherche Türkiye Bursları", () => {
const zeno = S.get("zeno-karl-schindler-master-thesis");
assert.equal(accesDepuisLeProfil(zeno, { targetLevel: "Master", lastDegree: "Licence obtenue", desiredField: "Génie civil" }), false);
assert.equal(accesDepuisLeProfil(zeno, { targetLevel: "Master", lastDegree: "Master en cours", desiredField: "Génie civil" }), true);
const tbr = S.get("turkiye-burslari-research");
assert.equal(accesDepuisLeProfil(tbr, { targetLevel: "Doctorat", lastDegree: "Master en cours ou obtenu" }), false);
assert.equal(accesDepuisLeProfil(tbr, { targetLevel: "Doctorat", lastDegree: "Doctorat en cours" }), true);
});

test("108 — la discipline : ce qu'une bourse finance, ce qu'elle exclut", () => {
assert.equal(accesDepuisLeProfil(S.get("epfl-edic-doctoral"), { desiredField: "Médecine" }), false);
assert.equal(accesDepuisLeProfil(S.get("epfl-edic-doctoral"), { desiredField: "Informatique" }), true);
assert.equal(accesDepuisLeProfil(S.get("iheid-scholarships"), { desiredField: "Informatique" }), false);
assert.equal(accesDepuisLeProfil(S.get("iheid-scholarships"), { desiredField: "Relations internationales" }), true);
for (const id of ["reach-oxford-scholarship", "koc-university-merit-scholarships", "sunway-academic-excellence-scholarships", "romanian-government-scholarship"]) {
assert.equal(accesDepuisLeProfil(S.get(id), { desiredField: "Médecine" }), false, id);
assert.equal(accesDepuisLeProfil(S.get(id), { desiredField: "Droit" }), true, id);
}
// Domaine inconnu : on ne tranche pas.
assert.equal(accesDepuisLeProfil(S.get("epfl-edic-doctoral"), {}), true);
});

test("108 — le programme 100 % féminin de l'UM6P", () => {
const um6p = S.get("mastercard-foundation-scholars-um6p");
assert.equal(um6p.reserveeAuxFemmes, true);
assert.equal(accesDepuisLeProfil(um6p, { gender: "homme" }), false);
assert.equal(accesDepuisLeProfil(um6p, { gender: "femme" }), true);
assert.equal(accesDepuisLeProfil(um6p, {}), true, "inconnu n'exclut pas");
assert.match(um6p.eligibility.note, /^Réservée aux jeunes femmes africaines/);
});

test("108 — sur 72 profils types, plus aucune proposition impossible", () => {
const NIV = [["Bac en cours ou obtenu", "Licence (Bachelor)"], ["Licence obtenue", "Master"], ["Master en cours ou obtenu", "Doctorat (PhD)"]];
const DOM = ["Informatique", "Médecine", "Droit", "Commerce & Économie", "Agronomie", "Génie civil"];
const DEST = ["", "Japon", "Canada", "Suisse", "Allemagne", "Turquie"];
const fautes = [];
let n = 0;
for (const [cur, tgt] of NIV) for (const dom of DOM) for (const dest of DEST) {
const profil = { targetLevel: tgt.startsWith("Licence") ? "Licence" : tgt.startsWith("Master") ? "Master" : "Doctorat", lastDegree: cur, desiredField: dom, nationality: "Sénégalais(e)", country: "Sénégal", preferredCountries: dest ? [dest] : [], languages: ["Français", "Anglais"], ageBracket: "18 – 24 ans", gender: "homme" };
const { retenues } = retenirOpportunites({ profile: profil, programs: catalogue.programs, universitiesById: U, scholarshipsById: S, aujourdhui: AUJ });
n += retenues.length;
for (const r of retenues) {
const b = S.get(r.scholarshipId);
if (b && accesDepuisLeProfil(b, profil) === false) fautes.push(`${cur}/${dom}/${dest} → ${r.scholarshipId}`);
if (["jasso-monbukagakusho-honors", "vanier-canada-graduate-scholarship", "zeno-karl-schindler-master-thesis", "turkiye-burslari-research"].includes(r.scholarshipId) && !cur.startsWith("Master en cours")) fautes.push(`${cur}/${dom} → ${r.scholarshipId}`);
}
}
assert.ok(n > 300, `seulement ${n} propositions`);
assert.deepEqual(fautes, []);
});

test("109 — la carte que Fitz écrit porte la date vérifiée du catalogue", () => {
const carte = carteFitz({ universityName: "U", scholarshipTitle: "B", deadlineISO: "2026-11-30", reasons: [] });
assert.equal(carte.deadline, "2026-11-30");
assert.equal(carteFitz({ universityName: "U", deadlineISO: "2027" }).deadline, null, "jamais une date inventée");
assert.match(lire("js/recommend-programs.js"), /deadlineISO: \/\^\\d\{4\}-\\d\{2\}-\\d\{2\}\$\/\.test\(String\(c\.program\.deadlineISO/);
});

test("109 — la carte de candidature mène à la fiche, et au guichet de la bourse quand il n'est pas celui de l'université", () => {
const js = lire("applications.js");
assert.match(js, /import \{ chargerPortails, portailUniversite, portailBourse \} from "\.\/js\/portails\.js";/);
assert.match(js, /<span>Fiche et conditions<\/span>/);
assert.match(js, /<span>Dépôt de la bourse<\/span>/);
assert.match(js, /depotChezLeBailleur\(lecture\) \? "Admission université" : "Candidature"/);
});

test("109 — Fitz vérifie le dossier sur les vraies règles, sans réclamer une date non publiée", () => {
const { user } = buildPrompt("readiness", { university: "U", scholarship: "B", track: "bourse", dateNonPubliee: true, voieDeDepot: "chez l'organisme de la bourse", paysBourse: "Rwanda", exigencesBourse: ["admission_prealable"], conditionsBourse: ["Il faut être africain."], checklist: [], profile: {} });
assert.match(user, /non publiée par l'organisme \(ce n'est PAS un manque du dossier/);
assert.match(user, /Le dossier se dépose chez l'organisme de la bourse/);
assert.match(user, /Conditions publiées de la bourse :\n- Il faut être africain\./);
assert.match(lire("applications.js"), /\.\.\.contexteBoursePourFitz\(app\),/);
});

test("109 — le guide de départ suit l'admission, jamais un refus ni le pays d'une autre candidature", () => {
const js = lire("dashboard.js");
assert.match(js, /const admises = applications\.filter\(\(a\) => a\.status === "admise"\);/);
// Lot 117 : le filtre écarte aussi, sans admission, les cycles clos et les bourses fermées au profil.
assert.match(js, /const candidates = applications\.filter\(\(a\) => a\.status !== "refusee"/);
});
