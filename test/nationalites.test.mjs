/**
* Lot NATIONALITÉS (2026-09-12) — « Sénégalais(e) », et non « Sénégal ».
*
* Sept contrôles :
*  1. la table couvre PAYS_DU_MONDE une pour une, dans le même ordre —
*     ajouter un pays sans son gentilé fait rougir ici ;
*  2. aucun gentilé en double : la liste offrirait deux entrées
*     identiques, l'étudiant ne saurait pas laquelle choisir ;
*  3. la forme : masculin d'abord, féminin entre parenthèses, et rien
*     d'autre entre parenthèses que le féminin ou la désambiguïsation
*     des deux Congo ;
*  4. l'aller-retour pays → gentilé → pays tient sur les 194 ;
*  5. LE CONTRÔLE QUI COMPTE : chaque gentilé se résout en code ISO.
*     Sans lui, estEligible() rendrait null sur toutes les réponses
*     neuves et les bourses réservées resteraient affichées à tout le
*     monde — un défaut qu'aucune capture d'écran ne montre ;
*  6. les réponses d'AVANT ce lot (« Sénégal », « senegal », « SN »)
*     se résolvent toujours : la rétrocompatibilité est une exigence,
*     pas un effet de bord ;
*  7. les saisies libres plausibles (« sénégalaise », « senegalais »)
*     retombent sur le bon pays, et une saisie ambiguë (« congolais »,
*     à cheval sur les deux Congo) rend null plutôt que de deviner.
*
* Preuve par mutation faite le 2026-09-12 : « Vietnamien(ne) » privé de
* la seconde lecture de la table d'ALIAS → contrôle 5 rouge (10 pays).
*/
import { test } from "node:test";
import assert from "node:assert/strict";

import { PAYS_ET_NATIONALITES, NATIONALITES, paysDeNationalite, nationaliteDePays } from "../js/nationalites.js";
import { PAYS_DU_MONDE } from "../js/eligibility-pistes.js";
import { isoDeNationalite, estEligible } from "../js/eligibility-countries.js";

test("nationalités 1 — la table couvre PAYS_DU_MONDE, dans le même ordre", () => {
const pays = PAYS_ET_NATIONALITES.map(([nom]) => nom);
assert.equal(pays.length, PAYS_DU_MONDE.length, "nombre de pays");
assert.deepEqual(pays, PAYS_DU_MONDE, "les deux listes doivent rester jumelles");
});

test("nationalités 2 — aucun gentilé en double", () => {
const vus = new Map();
for (const [pays, gentile] of PAYS_ET_NATIONALITES) {
assert.ok(!vus.has(gentile), `« ${gentile} » sert deux fois : ${vus.get(gentile)} et ${pays}`);
vus.set(gentile, pays);
}
assert.equal(NATIONALITES.length, PAYS_ET_NATIONALITES.length);
});

test("nationalités 3 — la forme : masculin, puis le féminin entre parenthèses", () => {
for (const [pays, gentile] of PAYS_ET_NATIONALITES) {
assert.ok(gentile.trim() === gentile && gentile.length > 2, `${pays} : gentilé douteux (${gentile})`);
assert.ok(/^[A-ZÀ-Þ]/.test(gentile), `${pays} : le gentilé prend une majuscule (${gentile})`);
const ouvrantes = (gentile.match(/\(/g) || []).length;
const fermantes = (gentile.match(/\)/g) || []).length;
assert.equal(ouvrantes, fermantes, `${pays} : parenthèses déséquilibrées (${gentile})`);
assert.ok(ouvrantes <= 1 || /Congo/.test(gentile), `${pays} : une seule parenthèse, sauf les deux Congo (${gentile})`);
}
// Les deux Congo sont bien distingués, sans quoi le contrôle 2 aurait
// déjà parlé — on nomme ici la raison.
const congos = PAYS_ET_NATIONALITES.filter(([, g]) => g.startsWith("Congolais"));
assert.equal(congos.length, 2);
assert.notEqual(congos[0][1], congos[1][1]);
});

test("nationalités 4 — l'aller-retour pays → gentilé → pays tient sur les 194", () => {
for (const [pays, gentile] of PAYS_ET_NATIONALITES) {
assert.equal(nationaliteDePays(pays), gentile, `gentilé de ${pays}`);
assert.equal(paysDeNationalite(gentile), pays, `pays de « ${gentile} »`);
assert.equal(paysDeNationalite(pays), pays, `${pays} doit rester reconnu tel quel`);
}
});

test("nationalités 5 — chaque gentilé se résout en code ISO", () => {
const muets = [];
for (const [pays, gentile] of PAYS_ET_NATIONALITES) {
if (!isoDeNationalite(gentile)) muets.push(`${gentile} (${pays})`);
}
assert.deepEqual(muets, [], `gentilés muets pour estEligible() : ${muets.join(", ")}`);
});

test("nationalités 6 — les réponses d'avant le lot se résolvent toujours", () => {
assert.equal(isoDeNationalite("Sénégal"), "SN");
assert.equal(isoDeNationalite("senegal"), "SN");
assert.equal(isoDeNationalite("SN"), "SN");
assert.equal(isoDeNationalite("Côte d'Ivoire"), "CI");
assert.equal(isoDeNationalite("Vietnam"), "VN");
assert.equal(isoDeNationalite("République démocratique du Congo"), "CD");
// Et la bourse réservée continue de trancher, dans les deux graphies.
assert.equal(estEligible({ scope: "liste", include: ["SN"] }, "Sénégal"), true);
assert.equal(estEligible({ scope: "liste", include: ["SN"] }, "Sénégalais(e)"), true);
assert.equal(estEligible({ scope: "liste", include: ["SN"] }, "Malien(ne)"), false);
});

test("nationalités 7 — saisie libre tolérée, ambiguïté refusée", () => {
assert.equal(paysDeNationalite("sénégalaise"), "Sénégal");
assert.equal(paysDeNationalite("senegalais"), "Sénégal");
assert.equal(paysDeNationalite("SÉNÉGALAIS"), "Sénégal");
assert.equal(paysDeNationalite("ivoirienne"), "Côte d'Ivoire");
assert.equal(paysDeNationalite("burkinabe"), "Burkina Faso");
// Nigérian / Nigérien : le piège classique, et deux pays réels.
assert.equal(isoDeNationalite("Nigérian(e)"), "NG");
assert.equal(isoDeNationalite("Nigérien(ne)"), "NE");
// « congolais » seul est à cheval sur les deux Congo : on refuse.
assert.equal(paysDeNationalite("congolais"), null);
// Et on ne devine pas sur un fragment trop court ni sur du bruit.
assert.equal(paysDeNationalite("in"), null);
assert.equal(paysDeNationalite("xyz"), null);
assert.equal(paysDeNationalite(""), null);
assert.equal(paysDeNationalite(null), null);
});
