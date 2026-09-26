/**
* ============================================================
* test/functions-achat.test.mjs — ce que le webhook écrit (grille B)
* ============================================================
*
* Rejoue la décision d'achat de functions/lib/achat.js (la logique que
* paydunyaWebhook applique dans sa transaction) sans émulateur ni
* PayDunya. LE test qui compte : acheter Dossier France sur un compte
* bourse (Essentiel) laisse `plan` INCHANGÉ et pose `planPreinscription` avec la
* bonne échéance — un achat de septembre comme un achat de mars
* expirent au 31 juillet.
* ============================================================
*/

import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { CAMPAGNE_FRANCE, finDeCampagne as finDeCampagneSite } from "../js/pays-preinscription.js";

const require = createRequire(import.meta.url);
const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { GRILLE, CLOTURE_CAMPAGNE, finDeCampagne, calculerMiseAJour } = require(path.join(RACINE, "functions/lib/achat.js"));

const SUPPRIMER = Symbol("delete");
// Un compte bourse (Forfait Essentiel, sans échéance). Jusqu'au
// 2026-09-24 c'était un compte Ambition (`accompagnement`), formule
// supprimée depuis.
const boursier = { plan: "essentiel-4" };

test("la clôture de campagne du serveur est le MIROIR de CAMPAGNE_FRANCE (une seule règle, deux fichiers)", () => {
assert.deepEqual(CLOTURE_CAMPAGNE, CAMPAGNE_FRANCE.cloture);
for (const d of ["2026-09-15T10:00:00Z", "2027-03-10T10:00:00Z", "2026-08-01T00:00:00Z", "2026-07-31T23:00:00Z"]) {
assert.equal(finDeCampagne(new Date(d)).toISOString(), finDeCampagneSite(new Date(d)).toISOString(), d);
}
});

test("finDeCampagne : septembre → 31 juillet de l'année suivante ; mars → 31 juillet de la même année", () => {
assert.equal(finDeCampagne(new Date("2026-09-15T10:00:00Z")).toISOString().slice(0, 10), "2027-07-31");
assert.equal(finDeCampagne(new Date("2027-03-10T10:00:00Z")).toISOString().slice(0, 10), "2027-07-31");
assert.equal(finDeCampagne(new Date("2026-08-01T00:00:00Z")).toISOString().slice(0, 10), "2027-07-31");
assert.equal(finDeCampagne(new Date("2026-07-31T12:00:00Z")).toISOString().slice(0, 10), "2026-07-31");
assert.equal(finDeCampagne(new Date("2026-12-31T23:59:00Z")).toISOString().slice(0, 10), "2027-07-31");
});

test("Dossier France sur un compte Essentiel (septembre) : plan INCHANGÉ, planPreinscription posé, expiration 2027-07-31", () => {
const r = calculerMiseAJour({ planId: "dossier-france", user: boursier, maintenant: new Date("2026-09-15T10:00:00Z"), supprimer: SUPPRIMER });
assert.equal(r.statut, "applique");
assert.ok(!("plan" in r.misAJour), "plan ne doit pas être écrit");
assert.ok(!("planExpiresAt" in r.misAJour), "planExpiresAt ne doit pas être écrit");
assert.equal(r.misAJour.planPreinscription, "dossier-france");
assert.equal(r.misAJour.planPreinscriptionExpiresAt.slice(0, 10), "2027-07-31");
assert.equal(r.misAJour.pendingPlan, SUPPRIMER);
assert.equal(r.misAJour.dernierPaiementLe, "2026-09-15T10:00:00.000Z");
});

test("Dossier France + Conseiller acheté en mars : expiration au 31 juillet de la même année", () => {
const r = calculerMiseAJour({ planId: "dossier-france-conseiller", user: boursier, maintenant: new Date("2027-03-10T10:00:00Z"), supprimer: SUPPRIMER });
assert.equal(r.misAJour.planPreinscription, "dossier-france-conseiller");
assert.equal(r.misAJour.planPreinscriptionExpiresAt.slice(0, 10), "2027-07-31");
assert.ok(!("plan" in r.misAJour));
});

test("Diagnostic France : 14 jours, sans toucher plan ; prolongé s'il est encore actif", () => {
const r = calculerMiseAJour({ planId: "diagnostic-france", user: {}, maintenant: new Date("2026-09-15T10:00:00Z"), supprimer: SUPPRIMER });
assert.equal(r.misAJour.planPreinscription, "diagnostic-france");
assert.equal(r.misAJour.planPreinscriptionExpiresAt.slice(0, 10), "2026-09-29");
const encore = { planPreinscription: "diagnostic-france", planPreinscriptionExpiresAt: "2026-09-25T00:00:00.000Z" };
const r2 = calculerMiseAJour({ planId: "diagnostic-france", user: encore, maintenant: new Date("2026-09-20T10:00:00Z"), supprimer: SUPPRIMER });
assert.equal(r2.misAJour.planPreinscriptionExpiresAt.slice(0, 10), "2026-10-09");
});

test("inversement : une offre bourse n'écrit jamais le forfait préinscription", () => {
const user = { planPreinscription: "dossier-france", planPreinscriptionExpiresAt: "2027-07-31T23:59:59.000Z" };
const r = calculerMiseAJour({ planId: "conseiller-6", user, maintenant: new Date("2026-09-15T10:00:00Z"), supprimer: SUPPRIMER });
assert.equal(r.misAJour.plan, "conseiller-6");
assert.ok(!("planPreinscription" in r.misAJour));
assert.ok(!("planPreinscriptionExpiresAt" in r.misAJour));
});

test("préinscription : pas de rétrogradation (Diagnostic acheté sur un Dossier actif = compte inchangé, paiement signalé)", () => {
const user = { planPreinscription: "dossier-france", planPreinscriptionExpiresAt: "2027-07-31T23:59:59.000Z" };
const r = calculerMiseAJour({ planId: "diagnostic-france", user, maintenant: new Date("2026-10-01T10:00:00Z"), supprimer: SUPPRIMER });
assert.equal(r.statut, "rang-inferieur");
assert.ok(!("planPreinscription" in r.misAJour));
// Un Dossier acheté sur un Diagnostic actif monte, et n'est jamais raccourci.
const r2 = calculerMiseAJour({ planId: "dossier-france", user: { planPreinscription: "diagnostic-france", planPreinscriptionExpiresAt: "2026-10-10T00:00:00.000Z" }, maintenant: new Date("2026-10-01T10:00:00Z"), supprimer: SUPPRIMER });
assert.equal(r2.misAJour.planPreinscription, "dossier-france");
assert.equal(r2.misAJour.planPreinscriptionExpiresAt.slice(0, 10), "2027-07-31");
});

test("le forfait bourse garde son comportement (non-régression) : montée sans échéance, pas de rétrogradation, Premier Dossier sans échéance", () => {
// Toutes les formules bourse en vente sont sans échéance : monter efface
// l'échéance, jamais n'en pose une. (La prolongation de 9 mois testée
// ici jusqu'au 2026-09-24 était celle d'Ambition, supprimée.)
const r = calculerMiseAJour({ planId: "conseiller-6", user: { plan: "essentiel-4", planExpiresAt: "2027-03-01T00:00:00.000Z" }, maintenant: new Date("2026-09-15T10:00:00Z"), supprimer: SUPPRIMER });
assert.equal(r.statut, "applique");
assert.equal(r.misAJour.plan, "conseiller-6");
assert.equal(r.misAJour.planExpiresAt, SUPPRIMER);
const retro = calculerMiseAJour({ planId: "premier-dossier", user: boursier, maintenant: new Date("2026-09-15T10:00:00Z"), supprimer: SUPPRIMER });
assert.equal(retro.statut, "rang-inferieur");
const pd = calculerMiseAJour({ planId: "premier-dossier", user: {}, maintenant: new Date("2026-09-15T10:00:00Z"), supprimer: SUPPRIMER });
assert.equal(pd.misAJour.plan, "premier-dossier");
assert.equal(pd.misAJour.planExpiresAt, SUPPRIMER);
assert.equal(calculerMiseAJour({ planId: "inconnue", supprimer: SUPPRIMER }).statut, "formule-inconnue");
// Les anciennes formules sont inconnues du serveur : un paiement qui les
// nommerait n'écrit rien.
for (const ancien of ["essentiel", "accompagnement", "premium", "signature-focus", "signature"]) {
assert.equal(calculerMiseAJour({ planId: ancien, user: {}, supprimer: SUPPRIMER }).statut, "formule-inconnue", ancien);
}
});

test("GRILLE serveur : les trois offres préinscription, prix décidés, parcours sur toutes les offres", () => {
assert.equal(GRILLE["diagnostic-france"].prix, 10000);
assert.equal(GRILLE["dossier-france"].prix, 45000);
assert.equal(GRILLE["dossier-france-conseiller"].prix, 70000);
for (const [id, o] of Object.entries(GRILLE)) assert.ok(["bourse", "preinscription"].includes(o.parcours), `${id} sans parcours`);
assert.equal(GRILLE["dossier-france"].maxPreinscriptions, 7);
assert.equal(GRILLE["dossier-france-conseiller"].maxPreinscriptions, 7);
});
