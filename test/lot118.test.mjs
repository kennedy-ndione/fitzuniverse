/**
* LOT 118 (2026-09-26) — LES PRIX BAISSENT
*
* Décision de Charles : « mon site est en train d'attirer beaucoup de gens
* mais personne n'a encore choisi de paiement ».
*   Dossier (préinscription, neuf pays)   75 000 → 45 000 F
*   Dossier + Conseiller (neuf pays)     150 000 → 70 000 F
*   Forfait Conseiller (bourses)         150 000 → 90 000 F
* Le reste ne bouge pas. Affiché (pricing-plans.js) = facturé
* (functions/lib/achat.js), pour chaque pays, déduction comprise.
*/
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createRequire } from "node:module";
import vm from "node:vm";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(join(racine, f), "utf8").replace(/\r\n/g, "\n");
const require = createRequire(import.meta.url);
const achat = require(join(racine, "functions/lib/achat.js"));

const bac = { window: {} };
vm.createContext(bac);
vm.runInContext(lire("pricing-plans.js"), bac);
const OFFRES = bac.window.SCHOLARBRIDGE_PLANS;

const PRIX = {
fitzExpress: 10000,
"premier-dossier": 25000,
"essentiel-4": 45000,
"conseiller-6": 90000,
"dossier-france": 45000,
"dossier-france-conseiller": 70000
};

test("118 — la nouvelle grille, affichée et facturée à l'identique", () => {
for (const [id, prix] of Object.entries(PRIX)) {
assert.equal(OFFRES[id].priceFCFA, prix, `${id} affiché`);
assert.equal(achat.GRILLE[id].prix, prix, `${id} facturé`);
assert.ok(achat.estEnVente(id), `${id} en vente`);
}
});

test("118 — le même prix dans les neuf pays", () => {
const pays = ["france", "roumanie", "turquie", "maroc", "italie", "allemagne", "canada", "chine", "malaisie"];
for (const d of pays) {
for (const id of ["dossier-france", "dossier-france-conseiller"]) {
const carte = bac.offrePourDestination(id, d);
assert.equal(carte.priceFCFA, PRIX[id], `${id} ${d}`);
assert.equal(achat.prixAvecDeduction(id, {}, new Date("2026-09-26T12:00:00Z"), d).prix, PRIX[id], `${id} ${d} facturé`);
}
}
});

test("118 — la déduction d'un ancien diagnostic suit le nouveau prix", () => {
const maintenant = new Date("2026-09-26T12:00:00Z");
const u = { diagnosticPayeLe: "2026-09-20T00:00:00Z" };
assert.equal(bac.prixAvecDeduction("dossier-france", u, maintenant).prix, 35000);
assert.equal(achat.prixAvecDeduction("dossier-france", u, maintenant).prix, 35000);
assert.equal(achat.prixAvecDeduction("dossier-france-conseiller", u, maintenant).prix, 60000);
});

test("118 — pas de prix barré : on ne solde pas un prix auquel personne n'a acheté", () => {
for (const f of ["offers.html", "offers.js", "payment.js", "js/preinscription-destination.js", "espace-preinscription.js"]) {
const src = lire(f);
assert.ok(!/(75|150)[\s  ]?000/.test(src), `${f} cite un ancien prix`);
}
});
