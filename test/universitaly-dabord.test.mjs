/**
* UNIVERSITALY D'ABORD (2026-09-25).
*
* En Italie, la plupart des universités font candidater sur leur propre
* site avant Universitaly, et la route place leur étape avant. Trois cas
* font l'inverse, lus sur leurs pages officielles : Naples, et Florence
* et Pise en licence et en cycle unique. Pour eux, l'étape de
* l'université vient après la validation d'Universitaly, et ce n'est
* plus un dépôt : ce sont les démarches qu'elle demande ensuite.
*/
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { construireRoutePays, cleNiveauVoeu, portailNationalDabord } from "../js/route-destination.js";
import { DESTINATIONS_ACCOMPAGNEES, destination } from "../js/destinations-preinscription.js";
import { trouverProcedure } from "../js/procedures/index.js";
import { defautsDesEnClair } from "../js/route-preinscription.js";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(join(racine, f), "utf8");
const procedureDe = (id) => trouverProcedure({ paysDestination: destination(id).nom });
const catalogue = JSON.parse(lire("assets/data/catalogue.json"));
const ITALIE = catalogue.universities.filter((u) => u.country === "Italie");

const voeu = (university, niveau) => ({ id: "pre-it-1", university, formation: "Informatique", niveau, status: "a_preparer" });
const route = (v, dossier = {}) => construireRoutePays({ id: "italie", procedure: procedureDe("italie"), voeux: [v], universites: ITALIE, dossier });
const ids = (r) => r.etapes.map((e) => e.id);

test("les niveaux d'un vœu se lisent en clés de fiche", () => {
const d = destination("italie");
assert.deepEqual(d.niveaux.map(cleNiveauVoeu), ["licence", "master", "cycle_unique", "doctorat", "foundation"]);
assert.equal(cleNiveauVoeu(""), "");
assert.equal(cleNiveauVoeu("Autre chose"), "");
});

test("le catalogue : les trois cas lus, et eux seuls", () => {
const avec = Object.fromEntries(ITALIE.filter((u) => u.admission && u.admission.portailNationalDabord).map((u) => [u.id, u.admission.portailNationalDabord]));
assert.deepEqual(avec, {
"universita-degli-studi-di-napoli-federico-ii-naples": ["licence", "master", "cycle_unique"],
"universita-di-firenze-florence": ["licence", "cycle_unique"],
"universita-di-pisa-pise": ["licence", "cycle_unique"]
});
});

test("Pise en licence : l'étape de l'université vient après la validation d'Universitaly", () => {
const v = voeu("Università di Pisa", "Laurea (licence)");
assert.equal(portailNationalDabord(v, ITALIE), true);
const r = route(v);
const l = ids(r);
const i = l.indexOf("candidature_universite");
assert.equal(l[i - 1], "it_validation", "l'étape ne suit pas la validation");
assert.ok(l.indexOf("motivations") < l.indexOf("it_soumission"), "les lettres doivent précéder le dépôt sur Universitaly");
const e = r.etapes[i];
assert.equal(e.kind, "universite");
assert.equal(e.titre, "Suivre les démarches de votre université");
assert.equal(e.depot, false);
assert.equal(e.ignorable, true);
assert.equal(e.preuve.requise, false, "rien à prouver : le dépôt est parti sur Universitaly");
assert.equal(e.voeux[0].fiche.id, "universita-di-pisa-pise", "la fiche de l'université est servie");
assert.equal(e.faite, false);
assert.deepEqual(defautsDesEnClair([{ id: e.id, enClair: e.enClair }]), []);
// « C'est fait », sans preuve, la règle.
assert.equal(route(v, { etapes: { candidature_universite: { faite: true } } }).etapes[i].faite, true);
});

test("Pise en master, Bologne en licence : l'ordre habituel ne change pas", () => {
for (const v of [voeu("Università di Pisa", "Laurea Magistrale (master)"), voeu("Università di Bologna", "Laurea (licence)"), voeu("Inconnue", "Laurea (licence)")]) {
assert.equal(portailNationalDabord(v, ITALIE), false, v.university);
const r = route(v);
const l = ids(r);
const i = l.indexOf("candidature_universite");
assert.equal(l[i + 1], "it_comparabilite", `${v.university} : l'étape n'est plus avant Universitaly`);
assert.equal(r.etapes[i].kind, "candidature");
}
});

test("les autres pays ne changent pas", () => {
for (const id of DESTINATIONS_ACCOMPAGNEES.filter((x) => x !== "italie")) {
const r = construireRoutePays({ id, procedure: procedureDe(id), voeux: [voeu("Università di Pisa", "Licence")], universites: ITALIE });
assert.ok(!r.etapes.some((e) => e.kind === "universite"), id);
}
});

test("l'espace sait peindre l'étape", () => {
const js = lire("espace-preinscription.js");
assert.ok(js.includes('case "universite": return htmlUniversiteApres(e);'));
assert.match(js, /e\.kind !== "candidature" && e\.kind !== "universite"/);
});
