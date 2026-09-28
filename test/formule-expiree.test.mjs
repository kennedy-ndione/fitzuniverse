/*
 * ============================================================
 * Audit 2026-10 — firestore.rules : une formule expirée ne donne plus
 * aucun accès.
 *
 * Les règles rendent la formule EFFECTIVE (planOf, planPreOf, planPays,
 * hasFitzExpressPass), avec la lecture du client (js/plan-features.js) :
 * bourse et Dossier France sans échéance = sans fin ; dossier par pays et
 * Pass Découverte valables seulement jusqu'à une échéance lisible.
 *
 * Ce test lit les règles comme texte. La preuve réelle est le rejeu à
 * l'émulateur (scripts/rejouer-regles.mjs, section « formules expirées » :
 * ISO passé, AAAA-MM-JJ, Timestamp, illisible, sans échéance).
 * ============================================================
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(join(racine, f), "utf8").replace(/\r\n/g, "\n");
const regles = lire("firestore.rules");
const corps = (nom) => {
const m = regles.match(new RegExp(`function ${nom}\\([^)]*\\) \\{([\\s\\S]*?)\\n\\}`));
assert.ok(m, `fonction ${nom} introuvable`);
return m[1];
};

test("règles : la formule bourse et le Dossier France lisent leur échéance (sans échéance = sans fin)", () => {
assert.match(corps("planOf"), /let e = d\.get\('planExpiresAt', null\);\nreturn \(sansEcheance\(e\) \|\| encoreValable\(e\)\) \? d\.get\('plan', ''\) : '';/);
assert.match(corps("planPreOf"), /let e = d\.get\('planPreinscriptionExpiresAt', null\);\nreturn \(sansEcheance\(e\) \|\| encoreValable\(e\)\) \? d\.get\('planPreinscription', ''\) : '';/);
});

test("règles : dossier par pays et Pass Découverte valables seulement jusqu'à une échéance lisible", () => {
assert.match(corps("planPays"), /e\.get\('plan', ''\) != '' && encoreValable\(e\.get\('expiresAt', null\)\)/);
assert.match(corps("hasFitzExpressPass"), /return encoreValable\(profilDe\(uid\)\.get\('fitzExpressExpiresAt', null\)\);/);
assert.doesNotMatch(corps("planPays"), /sansEcheance/, "un dossier pays sans échéance n'est pas un achat appliqué");
});

test("règles : une échéance présente mais illisible ferme l'accès ; AAAA-MM-JJ et ISO complet sont lus", () => {
assert.match(corps("sansEcheance"), /return v == null \|\| v == '';/);
const valable = corps("encoreValable");
assert.match(valable, /v is timestamp && v >= request\.time/);
assert.match(valable, /isoLisible\(v\) && instantIso\(v\) >= request\.time/);
// Le motif accepté par isoLisible couvre les deux formes écrites par le
// webhook (toISOString) et par l'administration (champ date).
const motif = corps("isoLisible").match(/v\.matches\('([^']+)'\)/)[1];
const re = new RegExp(`^${motif}$`);
for (const ok of [new Date().toISOString(), "2026-12-31", "2026-10-12T14:51:54Z"]) assert.ok(re.test(ok), ok);
for (const ko of ["bientôt", "31/12/2026", "2026-12-31T10:00+02:00", ""]) assert.ok(!re.test(ko), ko);
});

test("règles : plus aucune lecture brute d'une formule, hors de ces fonctions", () => {
const sansFonctions = regles.replace(/function (planOf|planPreOf|planPays|hasFitzExpressPass)\([^)]*\) \{[\s\S]*?\n\}/g, "");
assert.doesNotMatch(sansFonctions, /\.get\('plan', ''\)|\.get\('planPreinscription', ''\)|\.get\('fitzExpressExpiresAt'/);
// Les droits passent tous par ces fonctions.
for (const f of ["isPaidPlan", "isSignaturePlan", "isDossierFrance", "isDossierPays", "slotPattern"]) {
assert.match(corps(f), /planOf\(uid\)|planPreOf\(uid\)|planPays\(uid, pays\)/, f);
}
});
