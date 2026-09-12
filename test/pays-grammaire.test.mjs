/**
 * ============================================================
 * Tests — l'article des noms de pays (lot VITRINE-COMMERCIALE, 2026-09-11)
 * ============================================================
 *
 * Le défaut d'origine : « le Côte d'Ivoire », « le Guinée » sur la page
 * preinscription-france.html, parce qu'un test d'initiale vocalique
 * tenait lieu de grammaire. Et « Étudier en Canada », « en Maroc »,
 * parce que la préposition était écrite en dur.
 *
 * Deux contrats :
 *   1. chaque pays du CATALOGUE, chaque pays de RÉSIDENCE documenté et
 *      chaque DESTINATION de préinscription a ses trois formes, et elles
 *      sont les bonnes — vérifiées une par une ci-dessous ;
 *   2. un pays inconnu n'est JAMAIS précédé d'un article deviné.
 *
 * Et un balayage : aucune page ni module du site ne compose plus un
 * article ou une préposition avec un nom de pays dans un gabarit.
 * ============================================================
 */

import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { avecArticle, auPays, duPays, formesDePays, paysConnus } from "../js/pays-grammaire.js";
import { paysAvecArticle } from "../js/eligibility-countries.js";
import { COUCHES } from "../js/procedures/residences/index.js";
import { lirePays } from "../js/pays-preinscription.js";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => fs.readFileSync(path.join(RACINE, f), "utf8");

// Les formes attendues, écrites à la main. Un pays absent d'ici mais
// présent au catalogue, en résidence ou en destination fait échouer le
// test 2 : c'est voulu, un nouveau pays se vérifie à l'œil avant
// d'être affiché.
const ATTENDU = {
"Afrique du Sud": ["l'Afrique du Sud", "en Afrique du Sud", "de l'Afrique du Sud"],
"Algérie": ["l'Algérie", "en Algérie", "de l'Algérie"],
"Allemagne": ["l'Allemagne", "en Allemagne", "de l'Allemagne"],
"Arabie Saoudite": ["l'Arabie saoudite", "en Arabie saoudite", "de l'Arabie saoudite"],
"Belgique": ["la Belgique", "en Belgique", "de la Belgique"],
"Bénin": ["le Bénin", "au Bénin", "du Bénin"],
"Burkina Faso": ["le Burkina Faso", "au Burkina Faso", "du Burkina Faso"],
"Cameroun": ["le Cameroun", "au Cameroun", "du Cameroun"],
"Canada": ["le Canada", "au Canada", "du Canada"],
"Chine": ["la Chine", "en Chine", "de la Chine"],
"Corée du Sud": ["la Corée du Sud", "en Corée du Sud", "de la Corée du Sud"],
"Côte d'Ivoire": ["la Côte d'Ivoire", "en Côte d'Ivoire", "de la Côte d'Ivoire"],
"Égypte": ["l'Égypte", "en Égypte", "de l'Égypte"],
"États-Unis": ["les États-Unis", "aux États-Unis", "des États-Unis"],
"France": ["la France", "en France", "de la France"],
"Ghana": ["le Ghana", "au Ghana", "du Ghana"],
"Guinée": ["la Guinée", "en Guinée", "de la Guinée"],
"Hongrie": ["la Hongrie", "en Hongrie", "de la Hongrie"],
"Inde": ["l'Inde", "en Inde", "de l'Inde"],
"Italie": ["l'Italie", "en Italie", "de l'Italie"],
"Japon": ["le Japon", "au Japon", "du Japon"],
"Kenya": ["le Kenya", "au Kenya", "du Kenya"],
"Malaisie": ["la Malaisie", "en Malaisie", "de la Malaisie"],
"Maroc": ["le Maroc", "au Maroc", "du Maroc"],
"Pays-Bas": ["les Pays-Bas", "aux Pays-Bas", "des Pays-Bas"],
"Pologne": ["la Pologne", "en Pologne", "de la Pologne"],
"Portugal": ["le Portugal", "au Portugal", "du Portugal"],
"Roumanie": ["la Roumanie", "en Roumanie", "de la Roumanie"],
"Royaume-Uni": ["le Royaume-Uni", "au Royaume-Uni", "du Royaume-Uni"],
"Russie": ["la Russie", "en Russie", "de la Russie"],
"Rwanda": ["le Rwanda", "au Rwanda", "du Rwanda"],
"Sénégal": ["le Sénégal", "au Sénégal", "du Sénégal"],
"Suède": ["la Suède", "en Suède", "de la Suède"],
"Suisse": ["la Suisse", "en Suisse", "de la Suisse"],
"Togo": ["le Togo", "au Togo", "du Togo"],
"Tunisie": ["la Tunisie", "en Tunisie", "de la Tunisie"],
"Turquie": ["la Turquie", "en Turquie", "de la Turquie"],
// Les exemples du brief, hors catalogue.
"Israël": ["Israël", "en Israël", "d'Israël"],
"Madagascar": ["Madagascar", "à Madagascar", "de Madagascar"],
"Maurice": ["Maurice", "à Maurice", "de Maurice"],
"Singapour": ["Singapour", "à Singapour", "de Singapour"],
"Mauritanie": ["la Mauritanie", "en Mauritanie", "de la Mauritanie"],
"Mexique": ["le Mexique", "au Mexique", "du Mexique"],
"Yémen": ["le Yémen", "au Yémen", "du Yémen"],
"Haïti": ["Haïti", "en Haïti", "d'Haïti"],
"Jamaïque": ["la Jamaïque", "à la Jamaïque", "de la Jamaïque"],
"Guinée-Bissau": ["la Guinée-Bissau", "en Guinée-Bissau", "de la Guinée-Bissau"],
"Comores": ["les Comores", "aux Comores", "des Comores"]
};

test("pays-grammaire 1 — chaque forme attendue est rendue telle quelle", () => {
for (const [pays, [article, locatif, provenance]] of Object.entries(ATTENDU)) {
assert.equal(avecArticle(pays), article, `article : ${pays}`);
assert.equal(auPays(pays), locatif, `locatif : ${pays}`);
assert.equal(duPays(pays), provenance, `provenance : ${pays}`);
}
});

test("pays-grammaire 2 — catalogue, résidences et destinations sont tous couverts par une forme vérifiée", () => {
const cat = JSON.parse(lire("assets/data/catalogue.json"));
const catalogue = [...new Set(cat.universities.map((u) => u.country).filter(Boolean))];
const residences = COUCHES.map((c) => c.pays);
const destinations = lirePays().map((p) => p.nom);
for (const pays of [...catalogue, ...residences, ...destinations]) {
assert.ok(ATTENDU[pays], `« ${pays} » n'a pas de forme vérifiée dans ce test`);
assert.ok(formesDePays(pays), `« ${pays} » est inconnu du référentiel`);
}
});

test("pays-grammaire 3 — un pays inconnu n'est jamais précédé d'un article deviné", () => {
for (const inconnu of ["Zzzland", "Sénégale", "", null, undefined, "   "]) {
const nu = String(inconnu || "").trim();
assert.equal(avecArticle(inconnu), nu);
assert.equal(auPays(inconnu), nu);
assert.equal(duPays(inconnu), nu);
assert.equal(formesDePays(inconnu), null);
}
});

test("pays-grammaire 4 — la saisie libre est ramenée au nom canonique", () => {
assert.equal(avecArticle("senegal"), "le Sénégal");
assert.equal(auPays("COTE D'IVOIRE"), "en Côte d'Ivoire");
assert.equal(duPays("SN"), "du Sénégal");
assert.equal(auPays("  guinée "), "en Guinée");
});

test("pays-grammaire 5 — tout pays connu a une forme, et « l' » ne laisse pas d'espace", () => {
for (const pays of paysConnus()) {
const f = formesDePays(pays);
assert.ok(f, pays);
assert.ok(!/l' /.test(avecArticle(pays)), `espace après l' : ${pays}`);
assert.ok(!/de l' |d' /.test(duPays(pays)), `espace après l'élision : ${pays}`);
// Aucun article plein devant une initiale vocalique : « le Équateur »
// ou « la Italie » seraient une faute qu'on entend.
assert.ok(!/^(le|la) [aeiou]/i.test(avecArticle(pays).normalize("NFD")), `article plein devant une voyelle : ${pays}`);
}
});

test("pays-grammaire 6 — paysAvecArticle (eligibility-countries) n'est plus qu'un relais", () => {
assert.equal(paysAvecArticle("Côte d'Ivoire"), "de la Côte d'Ivoire");
assert.equal(paysAvecArticle("Madagascar"), "de Madagascar");
assert.equal(paysAvecArticle(""), "");
const src = lire("js/eligibility-countries.js");
assert.ok(!/PAYS_SANS_ARTICLE|PAYS_PLURIELS|MASCULINS_EN_E/.test(src), "les listes d'exception ont quitté eligibility-countries.js");
});

test("pays-grammaire 7 — plus aucun gabarit du site ne colle un article ou une préposition à un pays", () => {
// Le motif d'origine, et ses cousins : « le ${p} », « en ${pays.nom} »…
const suspects = [/`l'\$\{/, /\ble \$\{p\}/, /Étudier en \$\{/, /Situé en \$\{/, /pays\.nom === "France" \? "en France"/];
for (const f of ["js/preinscription-destination.js", "js/preinscriptions-page.js", "js/recommend-programs.js", "js/catalogue-vue.js"]) {
const src = lire(f);
for (const re of suspects) assert.ok(!re.test(src), `${f} : ${re}`);
}
assert.ok(/auPays\(pays\.nom\)/.test(lire("js/preinscription-destination.js")));
assert.ok(/avecArticle\(p\)/.test(lire("js/preinscription-destination.js")));
assert.ok(/auPays\(pays\.nom\)/.test(lire("js/preinscriptions-page.js")));
assert.ok(/auPays\(university\.country\)/.test(lire("js/recommend-programs.js")));
});
