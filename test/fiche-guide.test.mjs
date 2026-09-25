/**
 * ============================================================
 * test/fiche-guide.test.mjs — « chaque fiche guide » (2026-09-25)
 *
 * LA PROMESSE : dans les 9 pays de préinscription, un étudiant trouve,
 * sur la fiche de CHAQUE université, de quoi aller jusqu'au dépôt :
 * la démarche, le calendrier, la langue, les frais de dossier, au
 * moins trois sources officielles, un portail ou une voie d'admission,
 * un coût (vérifié, ou indicatif et expliqué), l'exonération possible,
 * la région, et la page de préparation du pays.
 *
 * Le test lit ce que l'étudiant VOIT : la vue de js/fiche-universite.js
 * construite sur l'instantané public, et la carte privée des portails
 * (functions/data/catalogue-portails.json). Il liste TOUTES les fiches
 * en défaut d'un coup, au lieu de s'arrêter à la première.
 *
 * Il bloque aussi le temps : une démarche lue il y a plus d'un an est
 * à relire avant le prochain déploiement (les calendriers changent
 * chaque année). C'est voulu.
 *
 * Posé après le lot 94, qui a complété les 177 fiches des 9 pays.
 * ============================================================
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { PAYS, estOuverte } from "../js/pays-preinscription.js";
import { ficheUniversite } from "../js/fiche-universite.js";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => JSON.parse(fs.readFileSync(path.join(RACINE, f), "utf8"));
const catalogue = lire("assets/data/catalogue.json");
const portails = lire("functions/data/catalogue-portails.json").universites || {};

const NOMS = new Set(PAYS.filter(estOuverte).map((p) => p.nom));
const FICHES = catalogue.universities.filter((u) => NOMS.has(u.country));
const UN_AN = 365 * 86400000;

function vue(u) {
return ficheUniversite({ universite: u, programmes: catalogue.programs, bourses: catalogue.scholarships });
}

test("guide 0 — les 9 pays sont ouverts et comptent au moins 177 fiches", () => {
assert.equal(NOMS.size, 9, `${NOMS.size} pays ouverts`);
assert.ok(FICHES.length >= 177, `${FICHES.length} fiches dans les 9 pays — des universités ont disparu`);
});

test("guide 1 — chaque fiche des 9 pays mène jusqu'au dépôt", () => {

const fautes = [];

for (const u of FICHES) {
const v = vue(u);
const f = (m) => fautes.push(`${u.id} : ${m}`);
if (!v) { f("fiche illisible"); continue; }

// La démarche, étape par étape.
const etapes = new Set(v.candidature.etapes.map((e) => e.cle));
for (const cle of ["procedure", "calendrier", "langue", "fraisDossier"]) {
if (!etapes.has(cle)) f(`étape « ${cle} » absente`);
}
const procedure = v.candidature.etapes.find((e) => e.cle === "procedure");
if (procedure && procedure.texte.length <= 60) f("démarche trop courte pour guider");

// La preuve.
if (v.candidature.sources.length < 3) f(`${v.candidature.sources.length} source(s), il en faut 3`);
if (!v.candidature.verifieLe) f("démarche sans date de lecture");

// Où déposer : un portail (abonnés) ou une voie d'admission dite.
if (!portails[u.id] && !u.voieAdmission) f("ni portail ni voie d'admission : l'étudiant ne sait pas où déposer");

// Combien : un coût vérifié, ou un coût indicatif qui explique pourquoi.
if (!v.couts.lignes.some((l) => l.verifie) && !v.couts.coutIndicatif) f("aucun coût, ni vérifié ni indicatif");
if (!v.couts.exoneration) f("exonération non dite");

// Où, et la suite du parcours.
if (!u.province || !v.lieu.includes(u.province)) f("région absente de l'en-tête");
if (!v.destination || !v.destination.page) f("pas de lien vers la préparation du pays");

// Ce que chaque pays exige en plus.
const bref = new Set(v.enBref.map((e) => e.cle));
if (u.country === "Canada" && !bref.has("eed")) f("numéro EED absent (exigé pour le permis d'études)");
if (u.country === "Maroc" && !bref.has("statut")) f("statut juridique absent");
}

assert.deepEqual(fautes, [], `${fautes.length} défaut(s) :\n${fautes.join("\n")}`);

});

test("guide 2 — aucune démarche lue il y a plus d'un an", () => {
const maintenant = Date.now();
const vieilles = FICHES
.filter((u) => !(u.admission && u.admission.verifieLe) || maintenant - new Date(`${u.admission.verifieLe}T00:00:00Z`) > UN_AN)
.map((u) => `${u.id} (${(u.admission && u.admission.verifieLe) || "sans date"})`);
assert.deepEqual(vieilles, [], `démarches à relire avant de déployer :\n${vieilles.join("\n")}`);
});

test("guide 3 — les conditions d'admission ne reculent pas", () => {
// Au 2026-09-25 : 142 fiches sur 177 disent les conditions (diplôme
// accepté, notes, tests). Les 35 autres les mêlent à la démarche ou
// ne les publient pas ; le plancher empêche d'en perdre.
const avec = FICHES.filter((u) => u.admission && typeof u.admission.conditions === "string" && u.admission.conditions.trim()).length;
assert.ok(avec >= 142, `${avec} fiches avec conditions, plancher 142`);
});
