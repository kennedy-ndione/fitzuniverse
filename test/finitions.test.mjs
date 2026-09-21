/**
* ============================================================
* test/finitions.test.mjs — les finitions du 21 septembre 2026
* ============================================================
*
* Défauts vus en ligne pendant le test du parcours bourse complet et
* laissés hors du lot DÉPART :
*
*  1. « Établissement actif dans votre domaine (Commerce) » pour un
*     étudiant qui avait écrit « Économie ».
*  2. « Une langue que vous maîtrisez » pour un anglais « Intermédiaire ».
*  3. La carte UNIL sans ligne d'échéance (date ISO, pas de phrase).
*  4. Pearson : « 46 jours pour déposer » alors que la nomination par le
*     lycée ferme le 9 octobre (lot 66, champ portesAvant).
*  5. Une carte déjà posée n'était jamais revérifiée (Pearson chez une
*     bachelière de 2022) ; ses jours restaient figés au jour de la pose.
*  6. L'étape « Dossier de candidature » validée avec une seule pièce.
* ============================================================
*/

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { explainMatch, etatEcheance, proposable, libelleFenetre, pourquoiPlusProposable, remplacementSansRefus, JOURS_MINIMUM_POUR_UNE_PORTE } from "../js/recommend-programs.js";
import { computeJourneySteps } from "../js/application-journey.js";
import { PATCHES as LOT66 } from "../scripts/data/lot66-pearson-portes.mjs";
import { validerPatches } from "../scripts/lot-validate.mjs";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(path.join(RACINE, f), "utf8");

const AUJOURDHUI = new Date("2026-09-21T10:00:00Z");

const PEARSON = {
  id: "university-of-toronto-toronto__lester-b-pearson-international-scholarship",
  universityId: "university-of-toronto-toronto",
  scholarshipId: "lester-b-pearson-international-scholarship",
  level: "Licence",
  language: "Anglais",
  status: "Ouverte",
  deadlineISO: "2026-11-06",
  ouverteVerifieeLe: "2026-09-19",
  portesAvant: LOT66[0].champs.portesAvant
};

const BOURSE_PEARSON = { id: "lester-b-pearson-international-scholarship", status: "Ouverte", anneeBacMin: 2026 };

test("1 — la raison de domaine reprend les mots de l'étudiant, pas la famille du catalogue", () => {
  const raisons = explainMatch({ level: "Master" }, { fields: ["Commerce"] }, null, { desiredField: "Économie" });
  assert.ok(raisons.includes("Établissement actif dans votre domaine (Économie)"), raisons.join(" | "));
  assert.ok(!raisons.some((r) => r.includes("(Commerce)")));
});

test("2 — « maîtrisez » seulement à partir du niveau d'études", () => {
  const prog = { language: "Anglais" };
  const inter = explainMatch(prog, {}, null, { languages: ["Anglais"], niveauxDeLangue: { anglais: "Intermédiaire" } });
  assert.ok(inter.some((r) => r.includes("une langue que vous pratiquez déjà")), inter.join(" | "));
  assert.ok(!inter.some((r) => r.includes("maîtrisez")));
  const bon = explainMatch(prog, {}, null, { languages: ["Anglais"], niveauxDeLangue: { anglais: "Bon niveau" } });
  assert.ok(bon.some((r) => r.includes("une langue que vous maîtrisez")));
  // Ancien profil sans niveau : la formule d'avant, rien de retiré.
  const inconnu = explainMatch(prog, {}, null, { languages: ["Anglais"] });
  assert.ok(inconnu.some((r) => r.includes("une langue que vous maîtrisez")));
});

test("2 bis — results.js transmet les niveaux déclarés au moteur", () => {
  const src = lire("results.js");
  assert.match(src, /niveauxDeLangue: \{\s*anglais: responses\.english \|\| "",\s*français: responses\.french \|\| ""\s*\}/);
});

test("3 — une carte des résultats sans phrase d'échéance mais avec des jours a sa ligne", () => {
  const src = lire("results.js");
  assert.match(src, /\$\{scholarship\.deadline \|\| typeof scholarship\.jours === "number" \? `<p class="opportunity-deadline">/);
  assert.match(src, /"Échéance à confirmer sur le portail officiel"/);
});

test("4 — la première porte avant la date limite devient le décompte", () => {
  const e = etatEcheance(PEARSON, AUJOURDHUI);
  assert.equal(e.jours, 46);
  assert.deepEqual(e.porte, { dateISO: "2026-10-09", quoi: "la nomination par votre lycée", jours: 18 });
  assert.equal(libelleFenetre({ ...e, dateConfirmee: true }).texte,
    "Première étape : la nomination par votre lycée, au plus tard le 9 octobre 2026 — il reste 18 jours");
  // Une porte a son propre plancher (14 jours) : à 18 jours de la
  // nomination et 46 du dossier, Pearson reste proposable.
  assert.equal(JOURS_MINIMUM_POUR_UNE_PORTE, 14);
  assert.equal(proposable(PEARSON, BOURSE_PEARSON, e).ok, true);
  // À 10 jours de la nomination, elle ne l'est plus.
  const tard = etatEcheance(PEARSON, new Date("2026-09-29T10:00:00Z"));
  assert.equal(tard.porte.jours, 10);
  assert.equal(proposable(PEARSON, BOURSE_PEARSON, tard).raison, "trop_tard");
});

test("4 bis — une porte passée ferme la candidature, la date limite finale ne la rouvre pas", () => {
  const e = etatEcheance(PEARSON, new Date("2026-10-12T10:00:00Z"));
  assert.equal(e.ouverte, false);
  assert.equal(e.porteManquee.quoi, "la nomination par votre lycée");
});

test("4 ter — sans portesAvant, rien ne change", () => {
  const { portesAvant, ...sans } = PEARSON;
  const e = etatEcheance(sans, AUJOURDHUI);
  assert.equal(e.porte, undefined);
  assert.equal(e.jours, 46);
  assert.equal(proposable(sans, BOURSE_PEARSON, e).ok, true);
});

test("4 quater — le lot 66 est valide et cite la source", () => {
  assert.deepEqual(validerPatches(LOT66), []);
  assert.equal(LOT66.length, 1);
  assert.equal(LOT66[0].collection, "programs");
  assert.match(lire("scripts/data/lot66-pearson-portes.mjs"), /future\.utoronto\.ca\/pearson-scholarships/);
});

test("5 — une carte déjà posée se revérifie : la bachelière de 2022 et Pearson", () => {
  const brigitte = { palier: "bac_obtenu", graduationYear: "2022", desiredDegree: "Licence", nationality: "Sénégal" };
  const raison = pourquoiPlusProposable({ program: PEARSON, scholarship: BOURSE_PEARSON, profile: brigitte, aujourdhui: AUJOURDHUI });
  assert.equal(raison, "elle est réservée aux élèves de terminale et aux bacheliers de 2026 ou après");
  // Un lycéen reste admissible, et le plancher de 30 jours ne disqualifie
  // pas une carte déjà posée.
  const lyceen = { palier: "lycee", desiredDegree: "Licence" };
  assert.equal(pourquoiPlusProposable({ program: PEARSON, scholarship: BOURSE_PEARSON, profile: lyceen, aujourdhui: AUJOURDHUI }), "");
});

test("5 bis — la carte recalcule sa fenêtre et affiche la raison, sans rien écrire", () => {
  const src = lire("applications.js");
  assert.match(src, /function renderFaitsDuChoix\(app, lecture\)/);
  assert.match(src, /const ech = etatEcheance\(lecture\.programme\);/);
  assert.match(src, /\$\{renderFaitsDuChoix\(app, lecture\)\}/);
  assert.match(src, /function renderPlusProposable\(app, lecture\)/);
  assert.match(src, /\$\{fermee \? "" : renderPlusProposable\(app, lecture\)\}/);
  const fn = src.slice(src.indexOf("function renderPlusProposable"), src.indexOf("function renderCard("));
  assert.ok(!/updateDoc|setDoc|deleteDoc/.test(fn), "constat seulement");
});

test("6 — « Dossier de candidature » ne se valide pas tant qu'une exigence manque", () => {
  const app = { id: "slot-1", checklist: [{ type: "recommendation", status: "complete" }] };
  const etape = (opts) => computeJourneySteps(app, opts).find((e) => e.id === "checklist");
  assert.equal(etape({}).done, true);
  assert.equal(etape({ exigencesManquantes: 2 }).done, false);
  assert.match(lire("applications.js"), /procedure: procedurePour\(app\), exigencesManquantes \}\)/);
  assert.match(lire("dashboard.js"), /procedure: procedureDe\(app\), exigencesManquantes \}\)/);
});

test("7 — remplacement sans refus : miroir exact de firestore.rules (exceptionFenetreBac)", () => {
  assert.equal(remplacementSansRefus(BOURSE_PEARSON, { palier: "bac_obtenu", graduationYear: "2022" }), true);
  assert.equal(remplacementSansRefus(BOURSE_PEARSON, { palier: "bac_obtenu", graduationYear: 2022 }), true);
  assert.equal(remplacementSansRefus(BOURSE_PEARSON, { palier: "licence_en_cours" }), true);
  assert.equal(remplacementSansRefus(BOURSE_PEARSON, { palier: "bac_obtenu", graduationYear: "2026" }), false);
  assert.equal(remplacementSansRefus(BOURSE_PEARSON, { palier: "lycee" }), false);
  assert.equal(remplacementSansRefus(BOURSE_PEARSON, { palier: "bac_obtenu", graduationYear: "" }), false);
  assert.equal(remplacementSansRefus({ status: "Ouverte" }, { palier: "master_obtenu" }), false);

  const regles = lire("firestore.rules");
  assert.match(regles, /function exceptionFenetreBac\(\)/);
  // Seulement en DERNIÈRE branche d'un OU : elle ne peut rien refuser de ce qui passait avant.
  assert.match(regles, /\(exceptionFenetreBac\(\) && refusApres\(\) == refusAvant\(\)\);\s*\}/);
  assert.match(regles, /\(accepteeAvant\(\) && !accepteeApres\(\) && choixChange\(\) && exceptionFenetreBac\(\)\);\s*\}/);
  assert.ok(!/exceptionCatalogue\(\)[^;]*exceptionFenetreBac/.test(regles.slice(regles.indexOf("function exceptionCatalogue"), regles.indexOf("function exceptionFenetreBac"))));

  const js = lire("applications.js");
  assert.match(js, /const gratuit = remplacementSansRefus\(lecture\.bourse, profile\);/);
});
