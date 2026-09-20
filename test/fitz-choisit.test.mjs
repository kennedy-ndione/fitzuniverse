/**
* Lot FITZ-CHOISIT (2026-09-11) — c'est Fitz qui choisit les universités.
*
* Décisions de Charles : l'étudiant ne choisit pas ; une proposition se
* refuse et Fitz propose la suivante ; plus de « hors catalogue » en
* bourses ; les N candidatures se travaillent en même temps.
*
*  1. le moteur écarte les pays EXCLUS par l'étudiant (excludedCountries
*     était collecté par profile.js et lu nulle part) — filtre dur ;
*  2. le moteur écarte les universités REFUSÉES (universitesRefusees) et
*     celles déjà occupées, par identifiant ou par nom (cartes anciennes) ;
*  3. la décision de remplir attend le profil minimal : nationalité,
*     niveau visé, domaine, au moins une langue ;
*  4. la carte construite par le remplacement porte les bonnes clés du
*     catalogue et repart NEUVE — le bug du 2026-09-11 : replaceRecommendation
*     changeait le nom sans changer scholarshipId/programId ;
*  5. l'identité d'une candidature bourse choisie par Fitz est
*     verrouillée ; une préinscription ou une bourse ancienne hors
*     catalogue ne l'est pas ;
*  6. la ligne d'état dit la vérité dans ses trois cas.
*
* Chaque garde est prouvée par mutation (scripts/verifier ne suffit pas :
* le harnais ne voit que le rendu) — voir le rapport du lot.
*/
import { test } from "node:test";
import assert from "node:assert/strict";

import { retenirOpportunites, recommendPrograms, paysExclu } from "../js/recommend-programs.js";
import { profilPretPourFitz, universitesAEviter, carteFitz, identiteVerrouillee, etatChoixFitz, CHAMPS_IDENTITE, PHRASE_REGLE } from "../js/fitz-choisit.js";

const LE_JOUR = new Date("2026-09-11T12:00:00Z");

function catalogue() {
const universitiesById = new Map([
["u1", { firestoreId: "u1", name: "Université Alpha", country: "France", officialWebsite: "https://alpha.fr" }],
["u2", { firestoreId: "u2", name: "Université Beta", country: "Allemagne", officialWebsite: "https://beta.de" }],
["u3", { firestoreId: "u3", name: "Université Gamma", country: "Canada", officialWebsite: "https://gamma.ca" }]
]);
const scholarshipsById = new Map([
["b1", { firestoreId: "b1", title: "Bourse Alpha", isActive: true }],
["b2", { firestoreId: "b2", title: "Bourse Beta", isActive: true }],
["b3", { firestoreId: "b3", title: "Bourse Gamma", isActive: true }]
]);
const programs = [
{ firestoreId: "p1", universityId: "u1", scholarshipId: "b1", level: "Master", deadline: "2027-03-01", applicationUrl: "https://alpha.fr/apply" },
{ firestoreId: "p2", universityId: "u2", scholarshipId: "b2", level: "Master", deadline: "2027-03-01", applicationUrl: "https://beta.de/apply" },
{ firestoreId: "p3", universityId: "u3", scholarshipId: "b3", level: "Master", deadline: "2027-03-01", applicationUrl: "https://gamma.ca/apply" }
];
return { universitiesById, scholarshipsById, programs };
}

const PROFIL = { nationality: "Sénégal", desiredDegree: "Master", desiredField: "Informatique", languages: ["français"], excludedCountries: [] };

const retenir = (profile, extra = {}) => retenirOpportunites({ profile, ...catalogue(), aujourdhui: LE_JOUR, ...extra }).retenues.map((r) => r.universityId);

test("fitz-choisit 1 — un pays exclu par l'étudiant ne sort jamais, ni du hub ni du sélecteur", () => {
assert.deepEqual(retenir(PROFIL).sort(), ["u1", "u2", "u3"], "témoin : sans exclusion, les trois sortent");
assert.deepEqual(retenir({ ...PROFIL, excludedCountries: ["Allemagne"] }).sort(), ["u1", "u3"]);
// Insensible à la casse et aux accents.
assert.deepEqual(retenir({ ...PROFIL, excludedCountries: ["allemagne", "CANADA"] }), ["u1"]);
const picks = recommendPrograms({ profile: { ...PROFIL, excludedCountries: ["France"] }, ...catalogue(), count: 10 }).map((p) => p.universityId);
assert.ok(!picks.includes("u1"), "recommendPrograms écarte aussi le pays exclu");
assert.equal(paysExclu({ country: "France" }, { excludedCountries: ["france"] }), true);
assert.equal(paysExclu({ country: "France" }, {}), false);
});

test("fitz-choisit 2 — les universités refusées ou déjà occupées sont écartées par le moteur", () => {
const aEviter = universitesAEviter({
applications: [{ universityId: "u1" }, { university: "université beta" }],
universitesRefusees: ["u3"],
universitesParNom: new Map([["université beta", "u2"]])
});
assert.deepEqual([...aEviter].sort(), ["u1", "u2", "u3"]);
assert.deepEqual(retenir(PROFIL, { exclureUniversites: new Set(["u2"]) }).sort(), ["u1", "u3"]);
assert.deepEqual(retenir(PROFIL, { exclureUniversites: ["u1", "u3"] }), ["u2"], "un tableau est accepté");
assert.deepEqual(retenir(PROFIL, { exclureUniversites: aEviter }), [], "tout évité → rien proposé, jamais une refusée « faute de mieux »");
});

test("fitz-choisit 3 — la décision de remplir attend le profil minimal", () => {
assert.equal(profilPretPourFitz(PROFIL).pret, true);
assert.equal(profilPretPourFitz({}).pret, false);
assert.deepEqual(profilPretPourFitz({}).manquants, ["votre nationalité", "le niveau visé", "votre domaine", "au moins une langue"]);
assert.equal(profilPretPourFitz({ ...PROFIL, languages: [] }).pret, false);
assert.equal(profilPretPourFitz({ ...PROFIL, nationality: "  " }).pret, false);
assert.equal(profilPretPourFitz({ ...PROFIL, desiredField: "" }).pret, false);
assert.equal(profilPretPourFitz({ ...PROFIL, desiredDegree: "" }).pret, false);
// Le moteur, lui, tolère un profil vide : c'est la décision qui attend.
assert.ok(retenir({}).length > 0, "le moteur continue de tolérer les champs absents");
});

test("fitz-choisit 4 — la carte du remplacement porte les clés du catalogue et repart neuve", () => {
const { retenues } = retenirOpportunites({ profile: PROFIL, ...catalogue(), aujourdhui: LE_JOUR, exclureUniversites: new Set(["u1"]) });
const rec = retenues[0];
const carte = carteFitz(rec, { portalUrl: "https://portail.test", nextCheckDate: "2026-09-25" });
assert.equal(carte.universityId, rec.universityId);
assert.equal(carte.scholarshipId, rec.scholarshipId);
assert.equal(carte.programId, rec.programId);
assert.equal(carte.university, rec.universityName);
assert.equal(carte.scholarship, rec.scholarshipTitle);
assert.equal(carte.portalUrl, "https://portail.test");
assert.equal(carte.universityWebsite, rec.universityWebsite);
// Neuve : statut, date, dossier, lettre, e-mail, notes.
assert.equal(carte.status, "a_preparer");
assert.equal(carte.deadline, null);
assert.deepEqual(carte.checklist, []);
assert.equal(carte.generatedLetter, null);
assert.equal(carte.generatedEmail, null);
assert.equal(carte.notes, "");
assert.equal(carte.isRecommendation, true);
assert.equal(carte.track, "bourse");
assert.equal(carte.nextCheckDate, "2026-09-25");
// Le remplacement écrit les MÊMES champs d'identité que le remplissage :
// l'ancienne bourse ne peut plus rester accrochée à la carte.
for (const champ of CHAMPS_IDENTITE) assert.ok(champ in carte, `la carte porte ${champ}`);
});

test("fitz-choisit 5 — l'identité d'une bourse choisie par Fitz est verrouillée, pas celle d'un vœu ni d'une carte ancienne", () => {
assert.equal(identiteVerrouillee({ programId: "p1", track: "bourse" }), true);
assert.equal(identiteVerrouillee({ scholarshipId: "b1" }), true);
assert.equal(identiteVerrouillee({ isRecommendation: true }), true);
assert.equal(identiteVerrouillee({ university: "Université de Nulle Part" }), false, "bourse ancienne hors catalogue : libre");
assert.equal(identiteVerrouillee({ programId: "p1", track: "preinscription" }), false, "préinscription : hors lot, libre");
assert.equal(identiteVerrouillee(null), false);
});

test("fitz-choisit 6 — la ligne d'état dit la vérité, et la règle est un seul littéral", () => {
assert.equal(etatChoixFitz({ quota: 4, nombre: 4, profilPret: true }).code, "complet");
assert.match(etatChoixFitz({ quota: 4, nombre: 4, profilPret: true }).texte, /^Fitz a choisi vos 4 universités$/);
assert.equal(etatChoixFitz({ quota: 4, nombre: 2, profilPret: false }).code, "profil");
assert.match(etatChoixFitz({ quota: 4, nombre: 2, profilPret: false }).texte, /Complétez votre profil : Fitz choisira vos 4 universités dès qu'il vous connaît/);
assert.equal(etatChoixFitz({ quota: 4, nombre: 2, profilPret: true }).code, "aucune");
assert.match(etatChoixFitz({ quota: 4, nombre: 2, profilPret: true }).texte, /Fitz n'a pas trouvé d'autre université compatible pour l'instant/);
assert.equal(etatChoixFitz({ quota: Infinity, nombre: 2, profilPret: true }), null, "sans plafond, rien à dire");
// Lot ACCEPTATION : la règle dit les limites AVANT l'achat — deux refus
// par place, une acceptation définitive. Un seul littéral.
assert.equal(PHRASE_REGLE, "Vous ne choisissez pas vos universités : Fitz les choisit parmi celles où votre profil a le plus de chances. Une proposition ne vous convient pas ? Fitz vous en propose une autre, jusqu'à deux fois par place. Une fois acceptée, une université ne se change plus.");
});
