/**
* Lot PROFIL-PAR-NIVEAU (2026-09-11), resserré par le lot ESPACE-ÉTUDIANT
* (2026-09-13) — un profil qui ne demande que ce qui compte.
*
* CE QUE LE SECOND LOT A CHANGÉ, ET POURQUOI CES TESTS ONT SUIVI
* --------------------------------------------------------------
* La première version notait l'étudiant sur DIX sections, dont quatre que
* le moteur de recommandation ne lit jamais. Un bachelier qui avait donné
* son niveau, ses langues, son projet, sa destination et son budget —
* tout ce qui décide de ses opportunités — plafonnait sous le seuil parce
* qu'il n'avait pas raconté ses stages. Le seuil punissait le bavardage
* manquant, pas le dossier incomplet.
*
* Depuis, `applicabilite` connaît un NOYAU de six sections requises (les
* six que le moteur lit) et quatre sections « facultative » qui
* enrichissent sans jamais noter. Les tests 2, 3, 4, 5, 6 et 10 ont été
* réécrits sur ce dénominateur : ils photographiaient l'ancien (8/10 et
* 10/10), ils prouvent maintenant la règle (6 requises pour TOUS les
* paliers, y compris un profil ancien sans palier).
*
*  1. les huit paliers sont EXACTEMENT ceux du questionnaire public ;
*  2. LE NOYAU : seules les six sections qui décident sont requises ;
*  3. aucun palier n'est pénalisé, et l'enrichissement ne bouge pas le
*     score — ni vers le haut ni vers le bas ;
*  4. un profil ancien sans palier ne perd rien et profite de
*     l'allègement ;
*  5. le seuil (7) est inchangé, il se franchit sur ce qui COMPTE, et
*     AUCUN champ d'enrichissement ne peut faire passer dessous ;
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
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RACINE = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

import { NIVEAUX_ACTUELS, PISTES } from "../js/eligibility-pistes.js";
import {
PALIERS, SECTIONS, SECTIONS_DU_NOYAU, APPLICABILITES, SECTION_DOM, domDeSection,
applicabilite, sectionsPour, lirePalier, libellePalier,
champsAcademiques, estSecondaire, studentStatusDuPalier, languesLisibles
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
preferredCountries: ["France"],
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

test("profil-par-niveau 2 — LE NOYAU : seules les sections qui décident sont requises", () => {

// RÉÉCRIT EN CONSCIENCE le 2026-09-14 (Charles : « il y a des questions
// qui ne sont pas nécessaires pour connaitre réellement le client et lui
// proposer ses opportunités »).
//
// Ce test épinglait la table palier par palier. La règle ne dépend plus
// du palier : une section est requise si, et seulement si, elle porte un
// champ que le moteur de recommandation lit. Les quatre autres sont
// facultatives POUR TOUS — affichées, remplissables, jamais bloquantes.

assert.deepEqual(SECTIONS_DU_NOYAU,
["sec-personal", "sec-parcours", "sec-langues", "sec-projet", "sec-destination", "sec-financier"]);

const ENRICHISSENT = ["sec-academique", "sec-experiences", "sec-documents", "sec-objectifs"];

for (const palier of [...ID_PALIERS, "", "inconnu"]) {

const sections = sectionsPour(palier);

// Les six du noyau, toujours requises.
for (const id of SECTIONS_DU_NOYAU) {
assert.equal(sections.find((s) => s.id === id).applicabilite, "requise", `${palier} / ${id}`);
}

// Les quatre autres ne sont JAMAIS requises.
for (const id of ENRICHISSENT) {
assert.notEqual(sections.find((s) => s.id === id).applicabilite, "requise", `${palier} / ${id}`);
}

// Et le dénominateur est le même pour tout le monde : six.
assert.equal(sections.filter((s) => s.applicabilite === "requise").length, 6, palier);

}

// Seule exception conservée (décision du 2026-09-11) : un lycéen ou un
// bachelier n'a pas de niveau académique supérieur à décrire.
for (const palier of ["lycee", "bac_obtenu"]) {
assert.equal(sectionsPour(palier).find((s) => s.id === "sec-academique").applicabilite, "masquee", palier);
}
for (const palier of ["licence_en_cours", "master_obtenu", "doctorat_obtenu", ""]) {
assert.equal(sectionsPour(palier).find((s) => s.id === "sec-academique").applicabilite, "facultative", palier);
}

assert.deepEqual(APPLICABILITES, ["requise", "facultative", "masquee"]);

});

test("profil-par-niveau 3 — AUCUN palier n'est pénalisé, et l'enrichissement ne change JAMAIS le score", () => {

// Un profil complet vaut 10 partout — c'était déjà vrai.
for (const palier of ID_PALIERS) {
assert.equal(calculateAiScore(profilComplet({ palier })), 10, palier);
}

// Et voici ce qui change : les quatre sections d'enrichissement sont
// SANS EFFET sur le score, à tous les paliers. Avant ce lot, un master
// sans mémoire ni stage tombait à 8 — il devait donc remplir des champs
// dont aucun ne modifie une seule opportunité proposée.
const vide = {
projects: "", thesis: "", publications: "", researchExperience: "", ranking: "",
internships: "", workExperience: "", associations: "", volunteering: "", entrepreneurship: "",
documentsAvailable: [],
whyLeave: "", careerGoals: "", dreams: ""
};

for (const palier of [...ID_PALIERS, ""]) {
assert.equal(calculateAiScore(profilComplet({ palier, ...vide })), 10,
`${palier || "(sans palier)"} : une section d'enrichissement vide fait encore baisser le score`);
}

// Le dénominateur est six, quel que soit le palier — profils anciens
// compris : la compatibilité ascendante protégeait le score, pas
// l'inconfort de questions inutiles.
for (const palier of [...ID_PALIERS, ""]) {
assert.equal(bilanProfil(profilComplet({ palier })).applicables, 6, palier);
}

// Ce qui fait VRAIMENT baisser le score : une section du noyau.
const sansLangues = profilComplet({ palier: "master_obtenu", languages: [] });
assert.equal(calculateAiScore(sansLangues), 8.3);

});

test("profil-par-niveau 4 — un profil ancien ne jette rien, et profite de l'allègement", () => {

// Le profil vide historique (payment.js) : 0/10, aucune exception.
assert.equal(calculateAiScore({ originCountry: "", age: "", currentDegree: "", academicAverage: "", englishLevel: "", desiredField: "", desiredCountry: "" }), 0);
assert.equal(calculateAiScore(undefined), 0);

// Le dénominateur d'un profil sans palier est SIX, comme les autres.
// Il valait dix : un compte d'avant le 2026-09-11 restait soumis aux
// quatre sections que le moteur ne lit pas.
assert.equal(bilanProfil({}).applicables, 6);
assert.equal(bilanProfil(null).applicables, 6);

// La règle « parcours » d'un profil sans palier exige encore
// studentStatus — inchangé, c'est une donnée du noyau.
const ancien = profilComplet({ projects: "", thesis: "", internships: "" });
delete ancien.palier;
assert.equal(calculateAiScore(ancien), 10);
assert.equal(calculateAiScore({ ...ancien, studentStatus: "" }), 8.3);

// Valeurs de palier inconnues, null, mauvaise casse : "" — jamais une exception.
for (const v of [null, undefined, 42, "", "  ", "Ingénieur", {}]) {
assert.equal(lirePalier({ palier: v }), "", String(v));
}
// Un libellé du questionnaire est reconnu (tolérance, comme le diagnostic).
assert.equal(lirePalier({ palier: "Master obtenu" }), "master_obtenu");
assert.equal(lirePalier({ palier: "licence_en_cours" }), "licence_en_cours");

});

test("profil-par-niveau 5 — le seuil reste 7, et il se franchit sur ce qui COMPTE", () => {

assert.equal(PROFILE_READY_THRESHOLD, 7);

// Le seuil est inchangé pour tous ses consommateurs (journey-map,
// next-action, application-journey, les outils Fitz, la fiche admin) :
// 7/10 vaut toujours 70 % des sections applicables.

// Cinq sections du noyau sur six = 8,3 : au-dessus du seuil. Un étudiant
// qui n'a pas encore rempli ses préférences financières n'est plus
// bloqué par des mémoires et des stages qu'il n'a pas.
const cinqSur6 = profilComplet({ palier: "bac_obtenu", budget: "", hasSponsor: "", fundingWanted: [] });
assert.equal(calculateAiScore(cinqSur6), 8.3);
assert.ok(calculateAiScore(cinqSur6) >= PROFILE_READY_THRESHOLD);

// Quatre sur six = 6,7 : sous le seuil.
const quatreSur6 = profilComplet({ palier: "bac_obtenu", budget: "", hasSponsor: "", fundingWanted: [], languages: [] });
assert.equal(calculateAiScore(quatreSur6), 6.7);
assert.ok(calculateAiScore(quatreSur6) < PROFILE_READY_THRESHOLD);

// ET LA GARDE QUI COMPTE : aucune section d'enrichissement ne peut, à
// elle seule, faire passer un profil sous le seuil.
const noyauComplet = profilComplet({ palier: "master_obtenu" });
for (const champ of ["projects", "thesis", "publications", "researchExperience", "ranking",
"internships", "workExperience", "associations", "volunteering", "entrepreneurship",
"whyLeave", "careerGoals", "dreams"]) {
const p = { ...noyauComplet, [champ]: "" };
assert.ok(calculateAiScore(p) >= PROFILE_READY_THRESHOLD,
`vider « ${champ} » fait passer le profil sous le seuil : ce champ ne décide d'aucune opportunité`);
}
const sansDocs = { ...noyauComplet, documentsAvailable: [] };
assert.ok(calculateAiScore(sansDocs) >= PROFILE_READY_THRESHOLD);

});

test("profil-par-niveau 6 — le bilan donne le dénominateur réel à l'admin", () => {

const b = bilanProfil(profilComplet({ palier: "bac_obtenu", projects: "", internships: "" }));
assert.equal(b.palier, "bac_obtenu");
assert.equal(b.libellePalier, "Bac obtenu");
assert.equal(b.applicables, 6);
assert.equal(b.remplies, 6);
assert.equal(b.score, 10);
// Les DIX sections restent dans le bilan : la fiche admin les affiche
// toutes, avec leur applicabilité. On mesure moins, on ne montre pas moins.
assert.equal(b.sections.length, 10);
assert.equal(b.sections.find((s) => s.id === "sec-academique").applicabilite, "masquee");
assert.equal(b.sections.find((s) => s.id === "sec-experiences").applicabilite, "facultative");
assert.equal(b.sections.find((s) => s.id === "sec-objectifs").applicabilite, "facultative");
assert.equal(b.sections.find((s) => s.id === "sec-documents").applicabilite, "facultative");

// Une section facultative remplie ne change pas le compte, et son état
// reste lisible : l'équipe doit savoir ce que l'étudiant a écrit.
const b2 = bilanProfil(profilComplet({ palier: "bac_obtenu", projects: "", internships: "Un job d'été" }));
assert.equal(b2.applicables, 6);
assert.equal(b2.remplies, 6);
assert.equal(b2.sections.find((s) => s.id === "sec-experiences").remplie, true);

// PROFILE_SECTION_RULES reste un tableau de 10 fonctions : la fiche admin s'indexe dessus.
assert.equal(PROFILE_SECTION_RULES.length, 10);
assert.ok(PROFILE_SECTION_RULES.every((r) => typeof r === "function"));

});

// Lot R17 (2026-09-18) : le test de langue A DÉMÉNAGÉ vers
// js/test-de-langue.js, avec ses quatre états et la traduction vers
// `situationFrancais`. Ce qui était garanti ici l'est désormais par
// test/test-de-langue.test.mjs, en plus fort — la numérotation des
// tests suivants est laissée telle quelle, elle n'a pas de sens propre.

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
// 5 sections du noyau sur 6 = 8,3 (le dénominateur est passé de 8 à 6
// avec le lot NOYAU du 2026-09-14).
assert.equal(calculateAiScore({ ...base, bacSeries: "", bacMention: "" }), 8.3, "ni série ni mention : section 2 incomplète");
assert.equal(calculateAiScore({ ...base, bacAverage: "" }), 8.3, "sans moyenne du bac");
assert.equal(calculateAiScore({ ...base, currentInstitution: "" }), 8.3, "sans établissement");
// Un étudiant en licence : dernier diplôme, établissement, moyenne — sans studentStatus.
const licence = profilComplet({ palier: "licence_obtenue", studentStatus: "", bacSeries: "", bacMention: "", bacAverage: "" });
assert.equal(calculateAiScore(licence), 10);
assert.equal(calculateAiScore({ ...licence, academicAverage: "" }), 8.3);
});

test("profil-par-niveau 11 — calculateAiScore rend toujours un nombre sur 10", () => {
for (const p of [null, undefined, {}, [], "x", 7, { palier: "lycee" }, { languages: "fr" }]) {
const s = calculateAiScore(p);
assert.equal(typeof s, "number");
assert.ok(Number.isFinite(s) && s >= 0 && s <= 10, String(s));
}
});


// ==========================================================
// LOT ESPACE-ÉTUDIANT (2026-09-14) — LA TABLE ET LA PAGE
//
// `SECTIONS` compte dix entrées parce que le score compte dix règles.
// profile.html n'a que neuf `<section>` : « Langues » et « Projet
// d'études » ont été remontées dans « Pour commencer ». Les deux
// identifiants sont donc des noms de RÈGLES, et
// `document.getElementById` rendait `null` pour eux — la boucle
// d'applicabilité passait son chemin, et #sec-depart n'était décidé
// par aucune règle. Ces deux gardes ferment le piège dans les deux
// sens, et sont les seules du projet à lire le HTML livré.
// ==========================================================

test("profil-par-niveau 12 — chaque règle du score désigne une section qui EXISTE dans profile.html", () => {

const html = fs.readFileSync(path.join(RACINE, "profile.html"), "utf8");

const presentes = new Set(
[...html.matchAll(/<section[^>]*\bid="(sec-[a-z-]+)"/g)].map((m) => m[1])
);

assert.ok(presentes.size >= 9, `profile.html ne déclare que ${presentes.size} sections`);

for (const s of SECTIONS) {

const cible = domDeSection(s.id);

assert.ok(presentes.has(cible),
`la règle « ${s.libelle} » (${s.id}) pointe vers #${cible}, absent de profile.html`);

}

// Et l'inverse : une section de la page qu'aucune règle n'atteint ne
// serait décidée par rien — c'était le cas de #sec-depart.
const atteintes = new Set(SECTIONS.map((s) => domDeSection(s.id)));

for (const id of presentes) {
assert.ok(atteintes.has(id),
`#${id} existe dans profile.html mais aucune règle du score ne l'atteint`);
}

});

test("profil-par-niveau 13 — la table SECTION_DOM couvre les dix règles, sans invention", () => {

assert.deepEqual(Object.keys(SECTION_DOM).sort(), SECTIONS.map((s) => s.id).sort());

// Les deux seules règles qui partagent une section sont celles qui
// ont été remontées dans « Pour commencer ».
const partagees = Object.entries(SECTION_DOM).filter(([id, dom]) => id !== dom);

assert.deepEqual(partagees.sort(), [["sec-langues", "sec-depart"], ["sec-projet", "sec-depart"]]);

// Un identifiant inconnu se rend lui-même plutôt que `undefined` :
// sans quoi `getElementById(undefined)` chercherait l'élément « undefined ».
assert.equal(domDeSection("sec-inconnue"), "sec-inconnue");
assert.equal(domDeSection(""), "");

});
