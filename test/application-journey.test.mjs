/**
* ============================================================
* test/application-journey.test.mjs — deux parcours, pas un (lot B)
* ============================================================
*
* Le test principal est la NON-RÉGRESSION : une candidature sans
* `track` garde exactement les étapes d'avant le lot B, mêmes ids,
* même ordre. Ensuite : le parcours préinscription et ses deux étapes
* « documents », lues dans users/{uid}.documentsObtained via les slugs
* de js/documents-data.js.
* ============================================================
*/

import { test } from "node:test";
import assert from "node:assert/strict";

import { computeJourneySteps, isJourneyComplete } from "../js/application-journey.js";
import { SLUGS } from "../js/documents-data.js";
import { PROFILE_READY_THRESHOLD } from "../js/profile-score.js";
import { qualifierEtapes } from "../js/next-action.js";

const ids = (steps) => steps.map((s) => s.id);

const bourse = { id: "slot-1", university: "EPFL", checklist: [] };
const pre = { id: "slot-2", university: "Université de Bordeaux", track: "preinscription", checklist: [] };

// ------------------------------------------------------------------
// Non-régression : le parcours bourse est INCHANGÉ
// ------------------------------------------------------------------

test("sans `track` : exactement les étapes d'aujourd'hui, mêmes ids, même ordre", () => {
assert.deepEqual(ids(computeJourneySteps(bourse, { profileScore: 0 })), ["profile", "checklist", "letter", "readiness"]);
assert.deepEqual(ids(computeJourneySteps(bourse, { profileScore: 0, advisorUnlocked: true })), ["profile", "checklist", "letter", "readiness", "advisor"]);
});

test("track:\"bourse\" explicite = même parcours que sans track", () => {
assert.deepEqual(
computeJourneySteps({ ...bourse, track: "bourse" }, { profileScore: 4 }),
computeJourneySteps(bourse, { profileScore: 4 })
);
});

test("bourse : letter/readiness gardent leurs libellés, icônes et marqueurs Fitz", () => {
const steps = computeJourneySteps({ ...bourse, generatedLetter: "…", fitzReadiness: { ready: true } }, { profileScore: 0 });
const letter = steps.find((s) => s.id === "letter");
const readiness = steps.find((s) => s.id === "readiness");
assert.equal(letter.label, "Lettre de motivation");
assert.equal(letter.isFitz, true);
assert.equal(letter.done, true);
assert.equal(readiness.label, "Vérifiée par Fitz");
assert.equal(readiness.action, "run-readiness");
assert.equal(readiness.done, true);
});

test("bourse : documentsObtained n'a aucun effet", () => {
const tout = { [SLUGS.traductions]: true, [SLUGS.legalisation]: true, [SLUGS.ressources]: true };
assert.deepEqual(
computeJourneySteps(bourse, { profileScore: 0, documentsObtained: tout }),
computeJourneySteps(bourse, { profileScore: 0 })
);
});

// ------------------------------------------------------------------
// Le parcours préinscription
// ------------------------------------------------------------------

// RÉÉCRITS EN CONSCIENCE le 2026-09-18 (lot B2-bis). L'étape
// « checklist » a disparu du parcours d'un VŒU : le lot B2 a retiré le
// bloc « Dossier de candidature » de sa carte — les pièces d'une
// préinscription vivent à l'étape 4 de la route, au niveau du DOSSIER.
// Son `action: "focus-checklist"` visait donc un bloc absent.
//
// CE DÉFAUT A ÉTÉ TROUVÉ DANS LE NAVIGATEUR, PAS ICI : la carte du vœu
// ne s'affichait plus du tout (TypeError sur le bouton de repli
// manquant). D'où le test suivant, qui interdit une action pointant
// vers un bloc que ce parcours n'a plus.

test("preinscription : [profile, traductions, ressources], jamais checklist, letter ni readiness", () => {
const steps = computeJourneySteps(pre, { profileScore: 0 });
assert.deepEqual(ids(steps), ["profile", "traductions", "ressources"]);
assert.ok(steps.every((s) => !s.isFitz), "aucune étape Fitz en préinscription");
assert.ok(steps.every((s) => s.label !== "Lettre de motivation" && s.label !== "Vérifiée par Fitz"));
});

test("preinscription + advisorUnlocked : advisor en dernier", () => {
assert.deepEqual(ids(computeJourneySteps(pre, { profileScore: 0, advisorUnlocked: true })), ["profile", "traductions", "ressources", "advisor"]);
});

test("preinscription : aucune étape ne pointe vers un bloc que la carte n'a plus", () => {
// La règle qui aurait évité la carte blanche : sur un vœu, plus
// personne ne demande d'ouvrir le « Dossier de candidature ».
const app = { ...pre, checklist: [{ status: "complete" }, { status: "complete" }] };
const steps = computeJourneySteps(app, { profileScore: PROFILE_READY_THRESHOLD });
assert.equal(steps[0].done, true, "le profil se calcule comme en bourse");
assert.ok(!steps.some((s) => s.action === "focus-checklist"), "une étape ouvre encore le dossier d'un vœu");
assert.ok(!steps.some((s) => s.id === "checklist"), "l'étape « Dossier de candidature » est revenue sur un vœu");

// ET L'ESPACE BOURSES LA GARDE, entière : ce lot ne lui retire rien.
const bourseSteps = computeJourneySteps({ ...bourse, checklist: [{ status: "complete" }] }, { profileScore: PROFILE_READY_THRESHOLD });
const checklistStep = bourseSteps.find((s) => s.id === "checklist");
assert.ok(checklistStep, "l'étape « Dossier de candidature » a disparu des bourses");
assert.equal(checklistStep.action, "focus-checklist");
assert.equal(checklistStep.done, true);
});

test("traductions : done seulement si traductions ET (legalisation OU copies)", () => {
const done = (obtenus) => computeJourneySteps(pre, { documentsObtained: obtenus }).find((s) => s.id === "traductions").done;
assert.equal(done({}), false);
assert.equal(done({ [SLUGS.traductions]: true }), false, "traductions seules");
assert.equal(done({ [SLUGS.legalisation]: true }), false, "légalisation seule");
assert.equal(done({ [SLUGS.legalisation]: true, [SLUGS.copies]: true }), false, "sans traductions");
assert.equal(done({ [SLUGS.traductions]: true, [SLUGS.legalisation]: true }), true);
assert.equal(done({ [SLUGS.traductions]: true, [SLUGS.copies]: true }), true);
assert.equal(done({ [SLUGS.traductions]: true, [SLUGS.legalisation]: false, [SLUGS.copies]: "oui" }), false, "seul `true` compte");
});

test("ressources : done si ressources OU bancaire", () => {
const done = (obtenus) => computeJourneySteps(pre, { documentsObtained: obtenus }).find((s) => s.id === "ressources").done;
assert.equal(done({}), false);
assert.equal(done({ [SLUGS.ressources]: true }), true);
assert.equal(done({ [SLUGS.bancaire]: true }), true);
assert.equal(done({ [SLUGS.bancaire]: false }), false);
});

test("étapes documents : libellés, icônes et liens vers la bonne catégorie", () => {
const steps = computeJourneySteps(pre, {});
const t = steps.find((s) => s.id === "traductions");
const r = steps.find((s) => s.id === "ressources");
assert.equal(t.label, "Traductions et légalisations");
assert.equal(t.icon, "languages");
assert.equal(t.href, "documents.html?categorie=administratif");
assert.equal(r.label, "Preuve de ressources");
assert.equal(r.icon, "wallet");
assert.equal(r.href, "documents.html?categorie=financier");
});

test("documentsObtained absent, null ou d'un autre type : aucune étape document done, aucune exception", () => {
for (const valeur of [undefined, null, "x", 42]) {
const steps = computeJourneySteps(pre, { profileScore: 0, documentsObtained: valeur });
assert.equal(steps.find((s) => s.id === "traductions").done, false);
assert.equal(steps.find((s) => s.id === "ressources").done, false);
}
const sansOption = computeJourneySteps(pre);
assert.equal(sansOption.find((s) => s.id === "traductions").done, false);
});

test("isJourneyComplete : inchangée, vraie seulement si tout est fait", () => {
const tout = { [SLUGS.traductions]: true, [SLUGS.copies]: true, [SLUGS.bancaire]: true };
const app = { ...pre, checklist: [{ status: "complete" }] };
assert.equal(isJourneyComplete(computeJourneySteps(app, { profileScore: PROFILE_READY_THRESHOLD, documentsObtained: tout })), true);
assert.equal(isJourneyComplete(computeJourneySteps(app, { profileScore: 0, documentsObtained: tout })), false);
});

// ------------------------------------------------------------------
// Le qualificateur d'étapes ne bloque pas sur un prérequis absent
// ------------------------------------------------------------------

test("preinscription : « Revue conseiller » attend traductions et ressources, jamais une readiness qui n'existe pas", () => {
const steps = computeJourneySteps(pre, { profileScore: 0, advisorUnlocked: true });
const advisor = qualifierEtapes(steps).find((s) => s.id === "advisor");
assert.equal(advisor.etat, "prematuree");
assert.deepEqual([...advisor.bloquePar].sort(), ["ressources", "traductions"]);
assert.ok(!advisor.bloquePar.includes("readiness"));

const tout = { [SLUGS.traductions]: true, [SLUGS.legalisation]: true, [SLUGS.bancaire]: true };
const prete = qualifierEtapes(computeJourneySteps(pre, { profileScore: 0, advisorUnlocked: true, documentsObtained: tout })).find((s) => s.id === "advisor");
assert.equal(prete.etat, "a-faire");
assert.deepEqual(prete.bloquePar, []);
});

test("bourse : « Revue conseiller » reste prématurée tant que la vérification n'est pas faite", () => {
const steps = computeJourneySteps(bourse, { profileScore: 0, advisorUnlocked: true });
const advisor = qualifierEtapes(steps).find((s) => s.id === "advisor");
assert.equal(advisor.etat, "prematuree");
assert.deepEqual(advisor.bloquePar, ["readiness"]);
});
