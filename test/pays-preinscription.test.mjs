/**
* ============================================================
* test/pays-preinscription.test.mjs — les sept pays, et leurs sources
* ============================================================
*
* LE test qui compte : chaque fait de chaque pays porte une URL ET une
* date. Un seul manquant = rouge. Et aucune carte ne peut dire « pas à
* pas » tant que sa procédure n'est pas « documentee ».
* ============================================================
*/

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { PROCEDURE, LIBELLES_PROCEDURE, PAYS, lirePays, etatDunPays, libelleProcedure } from "../js/pays-preinscription.js";
import { trouverProcedure, etapesAConfirmer } from "../js/procedures/index.js";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalogue = JSON.parse(fs.readFileSync(path.join(RACINE, "assets/data/catalogue.json"), "utf8"));

test("PROCEDURE est fermé et chaque code a un libellé non vide", () => {
assert.deepEqual(PROCEDURE, ["documentee", "en_cours", "a_venir"]);
for (const p of PROCEDURE) assert.ok(typeof LIBELLES_PROCEDURE[p] === "string" && LIBELLES_PROCEDURE[p].trim(), `libellé vide pour ${p}`);
assert.deepEqual(Object.keys(LIBELLES_PROCEDURE).sort(), [...PROCEDURE].sort());
});

// Neuf depuis le 2026-09-23 au soir : la Chine (8) et la Malaisie (9),
// ajoutées à la demande de Charles, après les sept pays validés.
test("exactement 9 pays, dans l'ordre validé ; ni États-Unis ni USA", () => {
const noms = lirePays().map((p) => p.nom);
assert.deepEqual(noms, ["France", "Roumanie", "Turquie", "Maroc", "Italie", "Allemagne", "Canada", "Chine", "Malaisie"]);
assert.equal(PAYS.length, 9);
for (const p of PAYS) {
assert.ok(!/etats-unis|usa|united-states/i.test(p.id), `id interdit : ${p.id}`);
assert.ok(!/États-Unis|Etats-Unis|USA/.test(p.nom), `nom interdit : ${p.nom}`);
}
assert.deepEqual([...new Set(PAYS.map((p) => p.ordre))].length, 9, "ordres uniques");
assert.deepEqual([...new Set(PAYS.map((p) => p.id))].length, 9, "ids uniques");
});

test("chaque pays a un nom présent dans le catalogue et un code de drapeau existant", () => {
const pays = new Set(catalogue.universities.map((u) => u.country));
for (const p of PAYS) {
assert.ok(pays.has(p.nom), `${p.nom} absent du catalogue`);
assert.ok(fs.existsSync(path.join(RACINE, "assets/flags", `${p.code}.svg`)), `drapeau ${p.code}.svg absent`);
assert.ok(PROCEDURE.includes(p.procedure), `${p.nom} : procédure hors vocabulaire`);
assert.ok(Array.isArray(p.langue) && p.langue.length, `${p.nom} : langues vides`);
assert.ok(typeof p.positionnement === "string" && p.positionnement.trim(), `${p.nom} : positionnement vide`);
if (p.portail !== null) assert.match(p.portail.url, /^https?:\/\//, `${p.nom} : portail sans URL`);
}
});

test("CHAQUE fait de CHAQUE pays porte une source http(s) ET une date valide", () => {
let total = 0;
for (const p of PAYS) {
assert.ok(Array.isArray(p.faits), `${p.nom} : faits n'est pas une liste`);
for (const f of p.faits) {
total++;
assert.ok(typeof f.texte === "string" && f.texte.trim(), `${p.nom} : fait sans texte`);
assert.match(String(f.source || ""), /^https?:\/\/\S+$/, `${p.nom} : fait sans source — « ${String(f.texte).slice(0, 50)} »`);
assert.match(String(f.verifieLe || ""), /^\d{4}-\d{2}-\d{2}$/, `${p.nom} : fait sans verifieLe — « ${String(f.texte).slice(0, 50)} »`);
assert.ok(!Number.isNaN(new Date(`${f.verifieLe}T00:00:00Z`).getTime()), `${p.nom} : date illisible ${f.verifieLe}`);
if ("montant" in f) {
assert.ok(typeof f.montant === "number" && f.montant >= 0, `${p.nom} : montant invalide`);
assert.ok(typeof f.devise === "string" && f.devise, `${p.nom} : montant sans devise`);
}
}
}
assert.ok(total >= 7, `au moins un fait par pays sourcé attendu au total, trouvé ${total}`);
});

/**
 * CE TEST A ÉTÉ CHANGÉ EN CONSCIENCE LE 2026-09-13 (lot S3).
 *
 * Il disait : « aucun pays n'est documentee aujourd'hui ». C'était vrai,
 * et c'était le problème — la page Préinscriptions promettait sept
 * destinations et n'en documentait aucune, la France comprise. Le lot S3
 * a écrit les six troncs manquants : Roumanie, Turquie, Maroc, Italie,
 * Allemagne, Canada. Cinq d'entre eux sont entièrement vérifiés sur
 * source officielle et passent donc à « documentee ».
 *
 * Ce qui remplace l'ancienne garde n'est pas « plus rien » : c'est une
 * garde PLUS DURE. Un pays ne peut être déclaré « documentee » que s'il
 * a réellement un tronc, avec des étapes, dont aucune n'est
 * « a_confirmer ». Déclarer « documentee » un pays sans procédure
 * redevient donc rouge — ce qui était exactement l'accident que
 * l'ancienne formulation cherchait à empêcher.
 */
test("un pays « documentee » a réellement un tronc complet — seule la France reste « en_cours », et pour une raison nommée", () => {
for (const pays of PAYS) {
const procedure = trouverProcedure({ paysDestination: pays.nom });
assert.ok(procedure, `${pays.nom} : aucun tronc de procédure`);
if (pays.procedure === "documentee") {
assert.ok(procedure.etapes.length >= 8, `${pays.nom} : déclaré « documentee » avec ${procedure.etapes.length} étapes`);
assert.deepEqual(etapesAConfirmer(procedure).map((e) => e.id), [], `${pays.nom} : déclaré « documentee » alors que des étapes restent à confirmer`);
}
assert.notEqual(pays.procedure, "a_venir", `${pays.nom} : plus aucun pays ne doit rester « a_venir » depuis le lot S3`);
}
// La France reste seule « en_cours », et pour une raison qui lui est
// propre : elle exige une couche de résidence, parce que Campus France a
// un espace par pays avec ses frais et son calendrier. Huit pays l'ont ;
// les autres lisent la procédure sans les montants locaux.
assert.equal(PAYS.find((p) => p.nom === "France").procedure, "en_cours");
// Huit depuis le 2026-09-23 : la Chine et la Malaisie n'ont aucune étape
// « a_confirmer » (l'avis de l'ambassade de Chine au Sénégal et la
// grille de caution EMGS ont été relus le jour même).
assert.equal(PAYS.filter((p) => p.procedure === "documentee").length, 8);
});

test("aucun agrégateur ne source un fait de pays, et chaque pays a un portail officiel", () => {
// LA DOCTRINE DU DÉPÔT, appliquée aux sept pays et plus seulement à la
// France. Avant le lot S3, cinq des sept pays avaient leur seul fait
// sourcé sur un agrégateur — etudier-en-roumanie.com, study-abroad.org,
// mygermanuniversity.com, visahq.news — et l'un d'eux était faux. Ces
// sites ne sont pas seulement interdits par principe : ils se trompent,
// et ils se trompent silencieusement.
const INTERDITS = /study-abroad|studyabroad|mygermanuniversity|visahq|etudier-en-roumanie|demarchesetrangers|campus-channel|eduopinions|mastersportal|studyportals|topuniversities|timeshighereducation|wikipedia/i;
for (const pays of PAYS) {
assert.ok(pays.portail && /^https?:\/\//.test(pays.portail.url), `${pays.nom} : portail officiel manquant`);
for (const f of pays.faits) {
assert.ok(!INTERDITS.test(f.source), `${pays.nom} : fait sourcé sur un agrégateur — ${f.source}`);
}
// Un pays qu'on affiche publiquement doit avoir de quoi être lu.
const publics = pays.faits.filter((f) => f.diffusion === "public");
assert.ok(publics.length >= 1, `${pays.nom} : aucun fait diffusable publiquement`);
}
// Et le compte global : sept pays, au moins trente faits sourcés.
assert.ok(PAYS.reduce((n, p) => n + p.faits.length, 0) >= 30);
});

/**
* PLANCHERS, PAS PHOTOGRAPHIE (corrigé le 2026-09-13).
*
* Ce test affirmait : « aucun autre pays que la France n'a de coût
* vérifié — le lot D2 n'a touché que la France ». C'était vrai le jour
* du lot D2. Ça a cessé de l'être au lot 48, quand le chantier des frais
* réels a commencé à remplir toutes les nationalités : la Turquie a
* aujourd'hui 3 coûts vérifiés, l'Italie 11, le Canada 3.
*
* Le test avait donc raison de tomber — il disait le contraire de ce que
* le catalogue contient. Mais l'égalité stricte était le mauvais outil :
* elle retombera en rouge à CHAQUE lot de frais, et un test qu'on
* rafistole à chaque fois finit par être modifié sans y penser, ce qui
* est exactement ce qu'il devait empêcher.
*
* Ce qui est gardé ici est ce qui doit vraiment tenir :
*   - un PLANCHER par pays, jamais une égalité — un lot peut ajouter des
*     coûts, jamais en effacer. Une régression (champ écrasé, export
*     parti d'une sauvegarde ancienne) fait tomber le test ; un lot qui
*     enrichit ne le fait pas ;
*   - la COHÉRENCE : on ne peut pas avoir plus de coûts vérifiés que
*     d'établissements ;
*   - l'accord entre les deux formes de catalogue (universities /
*     universites), qui est un vrai contrat de code.
*
* Relever un plancher est légitime et attendu. Le BAISSER veut dire
* qu'on a perdu des données : chercher pourquoi avant de toucher au
* chiffre.
*/
test("etatDunPays : planchers par pays, cohérence, et accord des deux formes de catalogue", () => {
// Relevé du 2026-09-13, après le lot 54. Ce sont des minimums.
const PLANCHERS = {
France: { etablissements: 26, coutsVerifies: 15 },
// Relevé du 2026-09-24, lot 84 : 18 établissements roumains de plus,
// tous avec leurs frais 2026-2027 ; les deux de Bucarest avaient déjà
// les leurs, relevés le 2026-09-13.
Roumanie: { etablissements: 20, coutsVerifies: 20 },
Turquie: { etablissements: 6, coutsVerifies: 3 },
// Relevé du 2026-09-24, lots 76 et 77 : 14 établissements marocains
// et 17 canadiens de plus, tous les canadiens avec leurs frais.
// Lot 82 (même jour) : les 13 publics marocains passent à 0 DH (place
// gratuite par l'AMCI). Seule l'UIC reste sans prix.
Maroc: { etablissements: 19, coutsVerifies: 18 },
Italie: { etablissements: 16, coutsVerifies: 9 },
// Relevé du 2026-09-24, lot 88 : 19 établissements allemands de plus,
// tous avec leurs frais 2026-2027 ; les trois existants (Humboldt,
// Hanovre, Hambourg) avaient déjà les leurs, relevés en septembre.
Allemagne: { etablissements: 22, coutsVerifies: 22 },
Canada: { etablissements: 20, coutsVerifies: 20 },
// Relevé du 2026-09-23 au soir, à l'ouverture des deux pays.
Chine: { etablissements: 16, coutsVerifies: 16 },
Malaisie: { etablissements: 2, coutsVerifies: 2 }
};
assert.deepEqual(Object.keys(PLANCHERS).sort(), PAYS.map((p) => p.nom).sort(), "un plancher par pays, ni plus ni moins");

for (const p of PAYS) {
const e = etatDunPays(p, catalogue);
const min = PLANCHERS[p.nom];
assert.ok(e.etablissements >= min.etablissements, `${p.nom} : ${e.etablissements} établissements, plancher ${min.etablissements} — des données ont été perdues`);
assert.ok(e.coutsVerifies >= min.coutsVerifies, `${p.nom} : ${e.coutsVerifies} coûts vérifiés, plancher ${min.coutsVerifies} — des frais ont été effacés`);
assert.ok(e.coutsVerifies <= e.etablissements, `${p.nom} : ${e.coutsVerifies} coûts pour ${e.etablissements} établissements`);
assert.equal(e.procedure, p.procedure);
// La forme du chargeur du site (universites) donne le même compte.
assert.deepEqual(etatDunPays(p, { universites: catalogue.universities }), e, `${p.nom} : les deux formes de catalogue divergent`);
}

// La France reste le seul pays « en_cours », et son compte est celui
// que la page annonce.
const france = PAYS.find((p) => p.nom === "France");
assert.equal(etatDunPays(france, catalogue).procedure, "en_cours");
assert.deepEqual(etatDunPays(france, null), { etablissements: 0, coutsVerifies: 0, procedure: "en_cours" });
});

test("« pas à pas » n'apparaît sur aucun texte rendu d'un pays non documenté", () => {
for (const p of PAYS) {
const textes = [libelleProcedure(p), p.positionnement, p.avertissement || "", ...p.faits.map((f) => f.texte)];
if (p.procedure !== "documentee") {
for (const t of textes) assert.ok(!/pas à pas/i.test(t), `${p.nom} : « ${t.slice(0, 60)} »`);
}
}
assert.match(LIBELLES_PROCEDURE.documentee, /pas à pas/);
});

test("lirePays ne mute pas PAYS", () => {
const avant = JSON.stringify(PAYS);
lirePays();
assert.equal(JSON.stringify(PAYS), avant);
});

test("preinscriptions.html charge mobile-nav.css et mobile-nav.js, sans noindex, et figure au sitemap", () => {
const html = fs.readFileSync(path.join(RACINE, "preinscriptions.html"), "utf8");
assert.match(html, /css\/mobile-nav\.css/);
assert.match(html, /js\/mobile-nav\.js/);
assert.ok(!/noindex/i.test(html), "la page doit être indexable");
assert.ok(!/Space Grotesk|Space\+Grotesk/.test(html), "aucune police nouvelle");
assert.ok(!/sparkle|data-lucide="star"|data-lucide="wand/i.test(html), "aucune étincelle");
const sitemap = fs.readFileSync(path.join(RACINE, "sitemap.xml"), "utf8");
assert.match(sitemap, /preinscriptions\.html/);
});
