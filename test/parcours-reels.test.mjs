/**
* CE QUE LES PARCOURS RÉELS ONT TROUVÉ (compte de test, 2026-09-25).
*
* Canada, Maroc, Turquie, France, Allemagne, Roumanie, Chine et Malaisie
* parcourus en ligne sur le compte de test. Ces tests tiennent les
* corrections :
*   1. la lettre de vœu (quatre à cinq lignes, Études en France) ne sert
*      qu'à la France ; ailleurs, une lettre de motivation d'admission ;
*   2. une voie directe du Maroc (UM6P, Al Akhawayn) ne montre que les
*      vœux de SON université ;
*   3. le portail du pays ne s'affiche plus sous les lettres et les
*      réponses quand le dépôt se fait université par université ;
*   4. le calendrier Campus France Sénégal relu (19 décembre, 30 juillet) ;
*   5. l'exonération selon le décret du 19 mai 2026.
*/
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { buildPrompt } from "../js/ai/prompts.js";
import { construireRoutePays } from "../js/route-destination.js";
import { destination } from "../js/destinations-preinscription.js";
import { trouverProcedure } from "../js/procedures/index.js";
import { CAMPAGNE_FRANCE, jalonDeCampagne, faitFrance } from "../js/pays-preinscription.js";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(join(racine, f), "utf8");

test("1 — hors France, une lettre de motivation d'admission ; en France, la lettre de vœu", () => {
const base = { parcours: "preinscription", university: "University of Toronto", program: "Computer Science", level: "Licence", profile: {} };
const canada = buildPrompt("letter", { ...base, destination: "canada" });
assert.match(canada.system, /lettre de motivation d'une candidature d'admission/);
assert.match(canada.system, /en anglais/);
assert.ok(!/lettre de vœu|Études en France/.test(canada.system + canada.user));
assert.ok(!/bourse/i.test(canada.system + canada.user), "jamais le mot bourse en préinscription");
const france = buildPrompt("letter", { ...base, university: "Université de Lille", destination: "france" });
assert.match(france.system, /lettre de vœu/);
// Sans destination : la France, comme avant.
assert.deepEqual(buildPrompt("letter", { ...base, university: "Université de Lille" }), france);
// La page envoie la destination et ne parle de vœu qu'en France.
const page = lire("ai-letter.js");
assert.match(page, /function lettreDeVoeu\(\) \{\n\s*return parcoursCourant\(\) === "preinscription" && destinationLettre\(\) === "france";/);
assert.match(page, /destination: parcoursCourant\(\) === "preinscription" \? destinationLettre\(\) : undefined,/);
});

test("2 — Maroc : la voie Al Akhawayn ne montre que les vœux à Al Akhawayn", () => {
const procedure = trouverProcedure({ paysDestination: "Maroc" });
const unis = [
{ id: "universite-mohammed-v-rabat", name: "Université Mohammed V de Rabat", country: "Maroc" },
{ id: "al-akhawayn-university-ifrane", name: "Al Akhawayn University", country: "Maroc" }
];
const mv = { id: "pre-ma-1", university: "Université Mohammed V de Rabat", status: "deposee" };
const aui = { id: "pre-ma-2", university: "Al Akhawayn University", status: "a_preparer" };
const route = (voeux, u = unis) => construireRoutePays({ id: "maroc", procedure, voeux, universites: u, dossier: { voie: "aui" } });
let e = route([mv]).etapes.find((x) => x.id === "ma_aui");
assert.equal(e.voeux.length, 0, "un vœu à Mohammed V n'est pas une candidature à Al Akhawayn");
assert.equal(e.faite, false);
assert.match(e.empechement, /à Al Akhawayn/);
e = route([mv, aui]).etapes.find((x) => x.id === "ma_aui");
assert.deepEqual(e.voeux.map((v) => v.id), ["pre-ma-2"]);
// Avant le chargement du catalogue, le nom suffit.
e = route([mv, aui], []).etapes.find((x) => x.id === "ma_aui");
assert.deepEqual(e.voeux.map((v) => v.id), ["pre-ma-2"]);
// Al Akhawayn n'est plus présentée comme privée (lot 94).
const voie = destination("maroc").voies.options.find((o) => o.id === "aui");
assert.ok(!/privée/.test(voie.aide));
});

test("3 — le portail du pays ne s'affiche sous les lettres et les réponses que pour un dépôt national", () => {
const js = lire("espace-preinscription.js");
assert.match(js, /if \(\(e\.kind === "motivations" \|\| e\.kind === "reponses"\) && !estFrance\(\) && !portailNationalDeDepot\(\)\) return "";/);
assert.match(js, /return !!\(etat\.route && etat\.route\.etapes\.some\(\(x\) => x\.depot && x\.kind !== "candidature"\)\);/);
// Et la phrase d'avertissement s'accorde au singulier.
assert.match(js, /\$\{n > 1 \? "s ne sont" : " n'est"\} pas encore/);
});

test("4 — le calendrier Campus France Sénégal relu le 2026-09-25", () => {
const jour = new Date("2026-09-25T12:00:00Z");
assert.equal(jalonDeCampagne("paiement", jour).iso, "2026-12-19");
assert.equal(jalonDeCampagne("complements", jour).iso, "2027-07-30");
assert.equal(CAMPAGNE_FRANCE.jalonsVerifiesLe, "2026-09-25");
assert.match(faitFrance("calendrier").texte, /19 décembre 2026/);
});

test("5 — l'exonération selon le décret du 19 mai 2026", () => {
const droits = faitFrance("droits");
assert.equal(droits.plafondExoneration, 0.25);
assert.match(droits.texte, /décret du 19 mai 2026/);
assert.match(droits.source, /enseignementsup-recherche\.gouv\.fr/);
});
