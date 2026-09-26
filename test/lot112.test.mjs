/**
* LOT 112 — LES QUATRE POINTS (2026-09-26)
*
* 1. Les pièces des six bourses restées sans liste au lot 110.
* 2. Le genre et l'expérience professionnelle, lus par le diagnostic et
*    par le moteur (réservées aux femmes, limites d'âge des hommes,
*    expérience exigée).
* 3. Les guides de départ du Royaume-Uni, de la Suisse, du Japon et de
*    la Corée.
* 4. La case qui rallume les rappels de dates limites.
*/
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { PATCHES } from "../scripts/data/lot112-quatre-points.mjs";
import { validerLot } from "../scripts/lot-validate.mjs";
import { piecesDeLaBourse, lireExigences, EXIGENCES } from "../js/exigences.js";
import { accesDepuisLeProfil, pourquoiPlusProposable, experienceSuffit, experienceExigee, limitesAgePour } from "../js/recommend-programs.js";
import { questionsPour, NIVEAUX_ACTUELS, genreDepuisReponse, trancheExperience, TRANCHES_EXPERIENCE } from "../js/eligibility-pistes.js";
import { profilDepuisDiagnostic } from "../js/diagnostic-vers-profil.js";
import { respecteLimiteAge } from "../js/age-limits.js";
import { GUIDES_DEPART, guideDepartPour } from "../js/visa-destinations.js";
import { guideVisaPour, etapesDeDestination } from "../js/visa-depart.js";
import { defautsDeProcedure, trouverProcedure } from "../js/procedures/index.js";
import { texteConsigne } from "../js/procedures/vocabulaire.js";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(join(racine, f), "utf8").replace(/\r\n/g, "\n");
const catalogue = JSON.parse(lire("assets/data/catalogue.json"));
for (const p of PATCHES) Object.assign(catalogue.scholarships.find((s) => s.id === p.id), p.champs);
const S = new Map(catalogue.scholarships.map((s) => [s.id, s]));
const JOUR = new Date("2026-09-26T09:00:00Z");

// ------------------------------------------------------------------
// POINT 1
// ------------------------------------------------------------------

test("112 — le lot est valide, et chaque « attendu » dit ce que le catalogue porte vraiment", () => {
assert.deepEqual(validerLot({ PATCHES }, JOUR).erreurs, []);
const brut = JSON.parse(lire("assets/data/catalogue.json"));
for (const p of PATCHES) {
const b = brut.scholarships.find((s) => s.id === p.id);
assert.ok(b, `${p.id} : absente du catalogue`);
// Avant l'écriture, le catalogue porte « attendu » ; après l'export, il
// porte « champs ». Toute autre valeur veut dire qu'il a changé entre-temps.
for (const [cle, valeur] of Object.entries(p.attendu || {})) {
const lu = JSON.stringify(b[cle]);
assert.ok(lu === JSON.stringify(valeur) || lu === JSON.stringify(p.champs[cle]), `${p.id}.${cle} : ${lu}`);
}
}
});

test("112 — les six bourses sans liste ont désormais leurs pièces, avec leur source", () => {
const six = ["bilkent-international-scholarships", "reach-oxford-scholarship", "mastercard-foundation-scholars-um6p", "snu-global-scholarship", "snu-glo-harmony-scholarship", "utokyo-fellowship"];
for (const id of six) {
const lot = piecesDeLaBourse(S.get(id));
assert.ok(lot, `${id} : toujours sans pièces`);
assert.match(lot.source, /^https:\/\//, id);
assert.ok(lot.pieces.length >= 3 && lot.pieces.length <= 10, `${id} : ${lot.pieces.length} pièces`);
for (const x of lot.pieces) {
assert.ok(x.label.length >= 2 && x.label.length <= 90, `${id} : « ${x.label} »`);
assert.ok(!/—/.test(x.label + x.detail), `${id} : tiret long`);
assert.ok(!/@/.test(x.label + x.detail), `${id} : une adresse e-mail dans une pièce publique`);
}
}
// Reach Oxford : le formulaire n'est pas encore publié, et la pièce le dit.
const reach = piecesDeLaBourse(S.get("reach-oxford-scholarship")).pieces.map((p) => p.detail).join(" ");
assert.match(reach, /janvier 2027/);
assert.match(reach, /26 janvier 2027/);
// UTokyo : la liste est celle d'UNE école, et la première pièce le dit.
assert.match(piecesDeLaBourse(S.get("utokyo-fellowship")).pieces[0].detail, /Chaque école doctorale fixe la sienne/);
// Plus aucune bourse proposable sans pièces parmi celles que l'audit nommait.
const sans = catalogue.scholarships.filter((s) => six.includes(s.id) && !piecesDeLaBourse(s));
assert.deepEqual(sans, []);
});

// ------------------------------------------------------------------
// POINT 2
// ------------------------------------------------------------------

test("112 — le diagnostic demande le genre à tous, et « je préfère ne pas répondre » ne ferme rien", () => {
for (const n of NIVEAUX_ACTUELS) {
const ids = questionsPour({ currentLevel: n.label }).map((q) => q.id);
assert.ok(ids.includes("gender"), n.label);
assert.ok(ids.indexOf("gender") > ids.indexOf("ageBracket"), `${n.label} : le genre vient après l'âge`);
}
assert.equal(genreDepuisReponse("Une femme"), "femme");
assert.equal(genreDepuisReponse("Un homme"), "homme");
assert.equal(genreDepuisReponse("Je préfère ne pas répondre"), "");
assert.equal(genreDepuisReponse(undefined), "");
// Les libellés du questionnaire et ceux que lit genreDepuisReponse sont les mêmes.
const q = questionsPour({ currentLevel: "Licence obtenue" }).find((x) => x.id === "gender");
assert.deepEqual(q.options.map((o) => o.label), ["Une femme", "Un homme", "Je préfère ne pas répondre"]);
});

test("112 — les tranches d'expérience du questionnaire sont toutes lisibles par le moteur", () => {
const q = questionsPour({ currentLevel: "Licence obtenue", targetLevel: "Master" }).find((x) => x.id === "workExperience");
for (const o of q.options) assert.ok(trancheExperience(o.label), `tranche illisible : ${o.label}`);
assert.deepEqual(Object.keys(TRANCHES_EXPERIENCE), q.options.map((o) => o.label));
assert.equal(trancheExperience("Vendeur dans la boutique familiale, deux ans"), null, "un texte libre reste un inconnu");
});

test("112 — l'UM6P n'est plus proposée à un homme, et le motif dit pourquoi", () => {
const um6p = S.get("mastercard-foundation-scholars-um6p");
const homme = { targetLevel: "Master", gender: "homme", desiredField: "Informatique" };
assert.equal(accesDepuisLeProfil(um6p, homme), false);
assert.equal(accesDepuisLeProfil(um6p, { ...homme, gender: "" }), true, "genre inconnu : rien n'est fermé");
assert.equal(pourquoiPlusProposable({ program: { level: "Master" }, scholarship: um6p, profile: homme, aujourdhui: JOUR }), "elle est réservée aux femmes");
});

test("112 — l'expérience exigée ferme seulement ce qui est sûr", () => {
const chevening = S.get("chevening-scholarships");
const epos = S.get("daad-epos");
const jj = S.get("jj-wbgsp");
const senghor = S.get("universite-senghor-master-developpement");
const si = S.get("swedish-institute-scholarships-global-professionals");
const base = { targetLevel: "Master", palier: "licence_obtenue", desiredField: "Économie" };

assert.equal(experienceExigee(chevening, "Master"), 2);
assert.equal(experienceExigee(jj, "Master"), 3);
// Entièrement en dessous : fermée.
assert.equal(experienceSuffit(chevening, { ...base, experienceProTranche: "Aucune pour l'instant" }), false);
assert.equal(experienceSuffit(chevening, { ...base, experienceProTranche: "Moins d'un an" }), false);
assert.equal(accesDepuisLeProfil(epos, { ...base, experienceProTranche: "Aucune pour l'instant" }), false);
// À cheval : ne tranche pas.
assert.equal(experienceSuffit(chevening, { ...base, experienceProTranche: "1 à 2 ans" }), true);
assert.equal(experienceSuffit(jj, { ...base, experienceProTranche: "1 à 2 ans" }), false, "trois ans exigés : « 1 à 2 ans » est en dessous");
assert.equal(experienceSuffit(jj, { ...base, experienceProTranche: "2 à 5 ans" }), true);
// Inconnu : rien n'est fermé.
assert.equal(experienceSuffit(chevening, base), null);
assert.equal(experienceSuffit(chevening, { ...base, workExperience: "Stage de six mois chez Orange" }), null);
// La tranche reprise dans le profil de l'espace compte aussi.
assert.equal(experienceSuffit(senghor, { ...base, workExperience: "Moins d'un an" }), false);
assert.equal(experienceSuffit(si, { ...base, experienceProTranche: "Moins d'un an" }), false);
assert.equal(experienceSuffit(si, { ...base, experienceProTranche: "1 à 2 ans" }), true);
// Pas encore de licence : pas d'expérience APRÈS la licence.
assert.equal(accesDepuisLeProfil(chevening, { ...base, palier: "licence_en_cours" }), false);
assert.equal(accesDepuisLeProfil(senghor, { ...base, palier: "licence_en_cours" }), true, "la Senghor ne dit pas « après le diplôme »");
// Le motif.
assert.equal(pourquoiPlusProposable({ program: { level: "Master" }, scholarship: chevening, profile: { ...base, experienceProTranche: "Aucune pour l'instant" }, aujourdhui: JOUR }), "elle exige une expérience professionnelle que votre profil n'atteint pas encore");
// Le code « deux ans » ne ment plus sur la Banque mondiale.
assert.ok(!lireExigences(jj).includes("experience_pro_2ans"));
assert.ok(lireExigences(jj).includes("experience_pro_requise"));
assert.ok(EXIGENCES.experience_pro_requise && EXIGENCES.experience_pro_requise.forme === "condition");
});

test("112 — l'Université panafricaine applique aux hommes leur propre limite d'âge", () => {
const pausti = S.get("pan-african-university-pausti");
assert.deepEqual(limitesAgePour(pausti, { gender: "homme" }), { master: 25, doctorat: 28 });
assert.deepEqual(limitesAgePour(pausti, { gender: "femme" }), pausti.ageMax);
assert.deepEqual(limitesAgePour(pausti, {}), pausti.ageMax, "genre inconnu : la limite la plus favorable");
assert.equal(respecteLimiteAge(limitesAgePour(pausti, { gender: "homme" }), 27, "Master"), false);
assert.equal(respecteLimiteAge(limitesAgePour(pausti, { gender: "femme" }), 27, "Master"), true);
// Le moteur le dit à la carte.
const homme27 = { targetLevel: "Master", gender: "homme", birthDate: "1999-01-15" };
assert.equal(pourquoiPlusProposable({ program: { level: "Master" }, scholarship: pausti, profile: homme27, aujourdhui: JOUR }), "votre âge dépasse la limite fixée par cette bourse");
});

test("112 — le diagnostic passe le genre et la tranche au profil de l'espace", () => {
const p = profilDepuisDiagnostic({ currentLevel: "Licence obtenue", targetLevel: "Master", workExperience: "Aucune pour l'instant", gender: "Une femme" });
assert.equal(p.gender, "femme");
assert.equal(p.experienceProTranche, "Aucune pour l'instant");
assert.equal(p.workExperience, undefined, "« Aucune » n'entre pas dans la zone de texte des expériences");
// Question non posée à ce palier : rien n'est repris.
assert.equal(profilDepuisDiagnostic({ currentLevel: "Bac obtenu", workExperience: "2 à 5 ans" }).experienceProTranche, undefined);
assert.equal(profilDepuisDiagnostic({ currentLevel: "Bac obtenu", gender: "Je préfère ne pas répondre" }).gender, undefined);
// Et results.js les transmet au moteur.
const res = lire("results.js");
assert.match(res, /gender: genreDepuisReponse\(responses\.gender\)/);
assert.match(res, /experienceProTranche: responses\.workExperience \|\| ""/);
});

// ------------------------------------------------------------------
// POINT 3
// ------------------------------------------------------------------

test("112 — quatre guides de départ, à la forme des procédures, chaque étape sourcée et datée", () => {
assert.deepEqual(GUIDES_DEPART.map((g) => g.paysDestination), ["Royaume-Uni", "Suisse", "Japon", "Corée du Sud"]);
for (const g of GUIDES_DEPART) {
assert.deepEqual(defautsDeProcedure(g), [], g.paysDestination);
assert.ok(g.etapes.length >= 5, `${g.paysDestination} : ${g.etapes.length} étapes`);
for (const e of g.etapes) {
assert.equal(e.phaseDepart, true, e.id);
assert.equal(e.fiabilite, "verifie_source_officielle", e.id);
assert.match(e.source, /^https:\/\/[^/]*(gov\.uk|admin\.ch|zh\.ch|ge\.ch|vd\.ch|go\.jp|moj\.go\.jp|mofa\.go\.kr|go\.kr|korea\.kr|or\.kr)\//, `${e.id} : source non officielle ${e.source}`);
assert.equal(e.verifieLe, "2026-09-26", e.id);
assert.ok(e.consigne.length > 120, e.id);
assert.equal(texteConsigne(e), e.consigne.trim(), `${e.id} : consigne ferme`);
}
assert.equal(etapesDeDestination(g).length, g.etapes.length);
}
// Les montants du jour, à l'endroit où l'étudiant les lit.
const ru = JSON.stringify(guideDepartPour("Royaume-Uni"));
for (const m of ["1 529 £", "1 171 £", "558 £", "776 £", "28 jours", "31 jours"]) assert.ok(ru.includes(m), `Royaume-Uni : ${m}`);
assert.ok(JSON.stringify(guideDepartPour("Japon")).includes("60 000 F CFA"));
assert.ok(JSON.stringify(guideDepartPour("Corée du Sud")).includes("20 millions de wons"));
assert.ok(JSON.stringify(guideDepartPour("Suisse")).includes("21 000 CHF"));
});

test("112 — le guide suit l'appariement ISO, et ne se fait pas passer pour une procédure de préinscription", () => {
assert.equal(guideDepartPour("royaume-uni").paysDestination, "Royaume-Uni");
assert.equal(guideDepartPour("GB").paysDestination, "Royaume-Uni");
assert.equal(guideDepartPour("Coree du Sud").paysDestination, "Corée du Sud");
assert.equal(guideDepartPour("France"), null, "la France a sa procédure");
assert.equal(guideDepartPour(""), null);
for (const pays of ["Royaume-Uni", "Suisse", "Japon", "Corée du Sud"]) {
assert.equal(trouverProcedure({ paysDestination: pays }), null, `${pays} : pas de procédure de préinscription`);
}
const guide = guideVisaPour({ espace: "bourse", procedure: guideDepartPour("Japon") });
assert.equal(guide.destination.documentee, true);
assert.equal(guide.destination.pays, "Japon");
// Le tableau de bord s'en sert, sans écraser une procédure qui a déjà ses étapes de départ.
const dash = lire("dashboard.js");
assert.match(dash, /import \{ guideDepartPour \} from "\.\/js\/visa-destinations\.js";/);
assert.match(dash, /if \(procedure && etapesDeDestination\(procedure\)\.length\) return procedure;/);
assert.match(dash, /procedureDeDepart\(applications, departDe\)/);
});

// ------------------------------------------------------------------
// POINT 4
// ------------------------------------------------------------------

test("112 — la case des rappels lit et écrit le champ que l'envoi respecte", () => {
const html = lire("account.html");
assert.match(html, /<input type="checkbox" id="rappelsEcheancesToggle">/);
assert.match(html, /id="rappelsEcheancesStatus"/);
assert.doesNotMatch(html, /Rappels d'échéances et messages de l'équipe/, "l'ancien libellé disait que les rappels ne partaient pas");
const js = lire("account.js");
// Même règle que l'envoi : coché sauf false.
assert.match(js, /rappelsToggle\.checked = ctx\.userData\.rappelsEcheances !== false;/);
assert.match(js, /rappelsEcheances: active,\nrappelsEcheancesMajLe: serverTimestamp\(\)/);
const emails = lire("functions/emails.js");
assert.match(emails, /u\.rappelsEcheances === false\) continue;/);
assert.match(emails, /réactiver les rappels depuis « Mes paramètres »/);
// La règle Firestore laisse l'étudiant écrire ce champ (rien ne l'interdit).
assert.doesNotMatch(lire("firestore.rules"), /rappelsEcheances/);
});
