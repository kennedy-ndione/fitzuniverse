/**
* Lot PROFIL-PAR-NIVEAU (2026-09-11) — un profil qui ne demande que ce
* qui compte pour CET étudiant.
*
*  1. les huit paliers sont EXACTEMENT ceux du questionnaire public ;
*  2. la table d'applicabilité, palier par palier (la table du brief) ;
*  3. un score de 10/10 est POSSIBLE pour chaque palier ;
*  4. un profil ancien sans palier se lit comme aujourd'hui (10 sections) ;
*  5. le seuil de préparation (7) est inchangé, et un bachelier qui a
*     tout rempli passe au-dessus — avant, il plafonnait à 8/10 ;
*  6. le dénominateur réel pour l'admin (bilanProfil) ;
*  7. le test de langue : lecture tolérante, « pas encore passé, date
*     prévue » est un état légitime ;
*  8. les langues lisibles (chaînes ET objets) ;
*  9. le studentStatus hérité dérivé du palier ;
* 10. la règle « parcours scolaire » d'un lycéen (série ou mention, et
*     moyenne du bac) ;
* 11. la signature de calculateAiScore : un nombre sur 10, jamais NaN.
*
* Chaque garde est prouvée par mutation — voir le rapport du lot.
*/
import { test } from "node:test";
import assert from "node:assert/strict";

import { NIVEAUX_ACTUELS, PISTES } from "../js/eligibility-pistes.js";
import {
PALIERS, SECTIONS, applicabilite, sectionsPour, lirePalier, libellePalier,
champsAcademiques, estSecondaire, studentStatusDuPalier,
TESTS_DE_LANGUE, lireTestLangue, phraseTestLangue, languesLisibles
} from "../js/profil-par-niveau.js";
import { calculateAiScore, bilanProfil, PROFILE_READY_THRESHOLD, PROFILE_SECTION_RULES } from "../js/profile-score.js";

// Un profil où TOUTES les sections sont remplies (règles de profile-score.js).
function profilComplet(extra = {}) {
return {
firstName: "Awa", lastName: "Diop", birthDate: "2007-03-02", country: "Sénégal",
lastDegree: "Baccalauréat", currentInstitution: "Lycée Blaise Diagne", academicAverage: "15", studentStatus: "nouveau_bachelier",
bacSeries: "S2", bacMention: "bien", bacAverage: "15",
projects: "Un projet",
languages: [{ code: "fr", level: "C1" }],
desiredField: "Informatique", desiredDegree: "Licence",
preferredCountries: ["France"], universityType: "publique",
budget: "1 000 000 FCFA", hasSponsor: "non", fundingWanted: ["full_scholarship"],
documentsAvailable: ["passport"],
internships: "Un stage",
whyLeave: "Pourquoi", careerGoals: "Objectifs", dreams: "Rêves",
...extra
};
}

const ID_PALIERS = Object.values(PISTES);

test("profil-par-niveau 1 — les huit paliers sont ceux du questionnaire public, dans son ordre", () => {
assert.equal(PALIERS.length, 8);
assert.deepEqual(PALIERS.map((p) => p.label), NIVEAUX_ACTUELS.map((n) => n.label));
assert.deepEqual(PALIERS.map((p) => p.id), [
"lycee", "bac_obtenu", "licence_en_cours", "licence_obtenue",
"master_en_cours", "master_obtenu", "doctorat_en_cours", "doctorat_obtenu"
]);
// Aucun palier inventé : chaque identifiant est une piste connue.
for (const p of PALIERS) assert.ok(ID_PALIERS.includes(p.id), p.id);
assert.equal(libellePalier("bac_obtenu"), "Bac obtenu");
assert.equal(libellePalier("inconnu"), "");
});

test("profil-par-niveau 2 — la table d'applicabilité, palier par palier", () => {
// La table du brief : seules les sections 3 et 9 varient.
const attendu = {
lycee: { "sec-academique": "masquee", "sec-experiences": "facultative" },
bac_obtenu: { "sec-academique": "masquee", "sec-experiences": "facultative" },
licence_en_cours: { "sec-academique": "requise", "sec-experiences": "facultative" },
licence_obtenue: { "sec-academique": "requise", "sec-experiences": "requise" },
master_en_cours: { "sec-academique": "requise", "sec-experiences": "requise" },
master_obtenu: { "sec-academique": "requise", "sec-experiences": "requise" },
doctorat_en_cours: { "sec-academique": "requise", "sec-experiences": "requise" },
doctorat_obtenu: { "sec-academique": "requise", "sec-experiences": "requise" }
};
for (const [palier, ligne] of Object.entries(attendu)) {
for (const s of SECTIONS) {
const voulu = ligne[s.id] || "requise";
assert.equal(applicabilite(s.id, palier), voulu, `${palier} / ${s.id}`);
}
const nbRequises = sectionsPour(palier).filter((s) => s.applicabilite === "requise").length;
const nbMasquees = Object.values(ligne).filter((a) => a === "masquee").length;
const nbFacultatives = Object.values(ligne).filter((a) => a === "facultative").length;
assert.equal(nbRequises, 10 - nbMasquees - nbFacultatives, palier);
}
// Sans palier : tout est requis.
assert.ok(sectionsPour("").every((s) => s.applicabilite === "requise"));
assert.ok(sectionsPour("inconnu").every((s) => s.applicabilite === "requise"));
});

test("profil-par-niveau 3 — un score de 10/10 est possible pour CHAQUE palier, et un bachelier n'est plus plafonné à 8", () => {
for (const palier of ID_PALIERS) {
assert.equal(calculateAiScore(profilComplet({ palier })), 10, palier);
}
// Le cas de Charles : un bachelier SANS mémoire ni stage — tout ce qu'il peut remplir.
const bachelier = profilComplet({ palier: "bac_obtenu", projects: "", internships: "" });
assert.equal(calculateAiScore(bachelier), 10);
assert.equal(bilanProfil(bachelier).applicables, 8);
// Le même profil sans palier : les dix sections comptent, il plafonne à 8.
assert.equal(calculateAiScore({ ...bachelier, palier: "" }), 8);
// Un lycéen : idem.
assert.equal(calculateAiScore(profilComplet({ palier: "lycee", projects: "", internships: "" })), 10);
// Une licence en cours : la section académique compte, les expériences non.
const l2 = profilComplet({ palier: "licence_en_cours", internships: "" });
assert.equal(calculateAiScore(l2), 10);
assert.equal(calculateAiScore({ ...l2, projects: "" }), 8.9);
// Un master : mémoire ET expériences comptent.
const master = profilComplet({ palier: "master_obtenu", lastDegree: "Licence" });
assert.equal(calculateAiScore(master), 10);
assert.equal(calculateAiScore({ ...master, projects: "", internships: "" }), 8);
});

test("profil-par-niveau 4 — un profil ancien, sans palier, se lit comme aujourd'hui", () => {
// Le profil vide historique (payment.js) : 0/10, dix sections, aucune exception.
assert.equal(calculateAiScore({ originCountry: "", age: "", currentDegree: "", academicAverage: "", englishLevel: "", desiredField: "", desiredCountry: "" }), 0);
assert.equal(bilanProfil({}).applicables, 10);
assert.equal(bilanProfil(null).applicables, 10);
assert.equal(calculateAiScore(undefined), 0);
// Un profil partiel d'avant : la règle « parcours » exige encore studentStatus.
const ancien = profilComplet({ projects: "", thesis: "", internships: "" });
delete ancien.palier;
assert.equal(calculateAiScore(ancien), 8);
assert.equal(calculateAiScore({ ...ancien, studentStatus: "" }), 7);
// Valeurs de palier inconnues, null, mauvaise casse : "" — jamais une exception.
for (const v of [null, undefined, 42, "", "  ", "Ingénieur", {}]) {
assert.equal(lirePalier({ palier: v }), "", String(v));
}
// Un libellé du questionnaire est reconnu (tolérance, comme le diagnostic).
assert.equal(lirePalier({ palier: "Master obtenu" }), "master_obtenu");
assert.equal(lirePalier({ palier: "licence_en_cours" }), "licence_en_cours");
});

test("profil-par-niveau 5 — le seuil de préparation est inchangé pour les consommateurs", () => {
assert.equal(PROFILE_READY_THRESHOLD, 7);
// 7 sections sur 10 = 7 ; 7 sur 8 = 8.8 : au-dessus du seuil dans les deux cas.
const sept = profilComplet({ projects: "", internships: "", dreams: "" }); // 7/10 sans palier
assert.equal(calculateAiScore(sept), 7);
assert.ok(calculateAiScore(sept) >= PROFILE_READY_THRESHOLD);
const bachelierSept = profilComplet({ palier: "bac_obtenu", projects: "", internships: "", dreams: "" }); // 7/8
assert.equal(calculateAiScore(bachelierSept), 8.8);
// 5 sur 8 = 6.3 : sous le seuil, comme 6/10 l'était.
const bachelierCinq = profilComplet({ palier: "bac_obtenu", projects: "", internships: "", dreams: "", budget: "", firstName: "" });
assert.equal(calculateAiScore(bachelierCinq), 6.3);
assert.ok(calculateAiScore(bachelierCinq) < PROFILE_READY_THRESHOLD);
});

test("profil-par-niveau 6 — le bilan donne le dénominateur réel à l'admin", () => {
const b = bilanProfil(profilComplet({ palier: "bac_obtenu", projects: "", internships: "" }));
assert.equal(b.palier, "bac_obtenu");
assert.equal(b.libellePalier, "Bac obtenu");
assert.equal(b.applicables, 8);
assert.equal(b.remplies, 8);
assert.equal(b.score, 10);
assert.equal(b.sections.length, 10);
assert.equal(b.sections.find((s) => s.id === "sec-academique").applicabilite, "masquee");
assert.equal(b.sections.find((s) => s.id === "sec-experiences").applicabilite, "facultative");
// Une section facultative remplie ne change pas le compte.
const b2 = bilanProfil(profilComplet({ palier: "bac_obtenu", projects: "", internships: "Un job d'été" }));
assert.equal(b2.applicables, 8);
assert.equal(b2.remplies, 8);
assert.equal(b2.sections.find((s) => s.id === "sec-experiences").remplie, true);
// PROFILE_SECTION_RULES reste un tableau de 10 fonctions : la fiche admin s'indexe dessus.
assert.equal(PROFILE_SECTION_RULES.length, 10);
assert.ok(PROFILE_SECTION_RULES.every((r) => typeof r === "function"));
});

test("profil-par-niveau 7 — le test de langue : lecture tolérante, « pas encore passé » est légitime", () => {
assert.deepEqual(TESTS_DE_LANGUE.map((t) => t.id), ["TCF", "TCF-DAP", "DELF", "DALF", "TEF", "IELTS", "TOEFL", "Duolingo", "aucun"]);
assert.deepEqual(lireTestLangue({}), { nature: "", score: "", date: "", prevuLe: "" });
assert.deepEqual(lireTestLangue({ testLangue: null }), { nature: "", score: "", date: "", prevuLe: "" });
assert.deepEqual(lireTestLangue({ testLangue: "IELTS" }), { nature: "", score: "", date: "", prevuLe: "" });
assert.deepEqual(lireTestLangue({ testLangue: { nature: "Cambridge", score: "B2" } }), { nature: "", score: "B2", date: "", prevuLe: "" });
const prevu = lireTestLangue({ testLangue: { nature: "TCF", prevuLe: "2026-11-15" } });
assert.deepEqual(prevu, { nature: "TCF", score: "", date: "", prevuLe: "2026-11-15" });
assert.equal(phraseTestLangue({ testLangue: { nature: "TCF", prevuLe: "2026-11-15" } }), "TCF prévu le 2026-11-15");
assert.equal(phraseTestLangue({ testLangue: { nature: "IELTS", score: "6.5", date: "2026-05-02" } }), "IELTS : 6.5 (passé le 2026-05-02)");
assert.equal(phraseTestLangue({ testLangue: { nature: "aucun" } }), "Aucun test de langue pour l'instant");
assert.equal(phraseTestLangue({}), "");
});

test("profil-par-niveau 8 — les langues lisibles, chaînes et objets", () => {
assert.deepEqual(languesLisibles(["français", "Anglais"]), ["français", "Anglais"]);
assert.deepEqual(languesLisibles([{ code: "fr", level: "C1" }, { code: "en", level: "" }, { code: "autre", name: "Wolof", level: "C2" }]), ["Français C1", "Anglais", "Wolof C2"]);
assert.deepEqual(languesLisibles(null), []);
assert.deepEqual(languesLisibles([null, "", {}]), []);
});

test("profil-par-niveau 9 — le studentStatus hérité se dérive du palier", () => {
assert.equal(studentStatusDuPalier("lycee"), "nouveau_bachelier");
assert.equal(studentStatusDuPalier("bac_obtenu"), "nouveau_bachelier");
for (const p of ["licence_en_cours", "licence_obtenue", "master_en_cours", "master_obtenu", "doctorat_en_cours", "doctorat_obtenu"]) {
assert.equal(studentStatusDuPalier(p), "en_cours", p);
}
assert.equal(studentStatusDuPalier(""), "");
assert.equal(studentStatusDuPalier("inconnu"), "");
assert.equal(estSecondaire("lycee"), true);
assert.equal(estSecondaire("licence_en_cours"), false);
// Les champs académiques : rien au secondaire, la recherche au doctorat.
assert.deepEqual(champsAcademiques("lycee"), []);
assert.ok(champsAcademiques("licence_en_cours").includes("projects") && !champsAcademiques("licence_en_cours").includes("thesis"));
assert.ok(champsAcademiques("master_obtenu").includes("thesis"));
assert.ok(champsAcademiques("doctorat_en_cours").includes("researchExperience") && champsAcademiques("doctorat_en_cours").includes("publications"));
assert.equal(champsAcademiques("").length, 7);
});

test("profil-par-niveau 10 — le parcours scolaire d'un lycéen : série ou mention, et moyenne du bac", () => {
const base = profilComplet({ palier: "lycee", lastDegree: "", academicAverage: "", studentStatus: "", projects: "", internships: "" });
assert.equal(calculateAiScore(base), 10, "série + mention + moyenne du bac, sans dernier diplôme ni moyenne générale");
assert.equal(calculateAiScore({ ...base, bacSeries: "" }), 10, "la mention suffit");
assert.equal(calculateAiScore({ ...base, bacMention: "" }), 10, "la série suffit");
assert.equal(calculateAiScore({ ...base, bacSeries: "", bacMention: "" }), 8.8, "ni série ni mention : section 2 incomplète");
assert.equal(calculateAiScore({ ...base, bacAverage: "" }), 8.8, "sans moyenne du bac");
assert.equal(calculateAiScore({ ...base, currentInstitution: "" }), 8.8, "sans établissement");
// Un étudiant en licence : dernier diplôme, établissement, moyenne — sans studentStatus.
const licence = profilComplet({ palier: "licence_obtenue", studentStatus: "", bacSeries: "", bacMention: "", bacAverage: "" });
assert.equal(calculateAiScore(licence), 10);
assert.equal(calculateAiScore({ ...licence, academicAverage: "" }), 9);
});

test("profil-par-niveau 11 — calculateAiScore rend toujours un nombre sur 10", () => {
for (const p of [null, undefined, {}, [], "x", 7, { palier: "lycee" }, { languages: "fr" }]) {
const s = calculateAiScore(p);
assert.equal(typeof s, "number");
assert.ok(Number.isFinite(s) && s >= 0 && s <= 10, String(s));
}
});
