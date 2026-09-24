/**
* test/revelations.test.mjs — le bloc « Révélé par FitzUniverse »
*
* Ce que ces tests verrouillent (2026-09-24) :
*   - le chiffre affiché est COMPTÉ dans le catalogue, jamais écrit à la
*     main : il suit les fiches, dans les deux sens ;
*   - une fiche qui ne prouve pas la gratuité (prix absent, non nul,
*     périmé, exonération non systématique, autre pays) ne compte pas ;
*   - sous le minimum, pas de révélation du tout ;
*   - la révélation n'entre JAMAIS dans la frise « Ouvert en ce moment » :
*     elle se pose avant le pied, et elle est construite sans innerHTML.
*/

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { lireRevelation, REVELATIONS } from "../js/revelations.js";

const AUJOURDHUI = new Date("2026-09-25T12:00:00Z");

const publique = (id, extra = {}) => ({
id,
country: "Maroc",
flag: "ma.svg",
fraisScolarite: {
source: "https://web.archive.org/web/20250317151356/https://www.enssup.gov.ma/en/la-mobilite-etudiante",
verifieLe: "2026-09-24",
licence: { montant: 0, devise: "MAD", periode: "an" }
},
exoneration: { politique: "systematique" },
...extra
});

const cinq = ["a", "b", "c", "d", "e"].map((x) => publique(`pub-${x}`));

test("cinq publiques gratuites et vérifiées → la révélation, avec le compte réel", () => {
const r = lireRevelation(cinq, AUJOURDHUI);
assert.ok(r);
assert.equal(r.id, "maroc-public-gratuit");
assert.equal(r.nombre, 5);
assert.match(r.texte, /^5 établissements publics/);
assert.equal(r.lienCatalogue.texte, "Voir les 5");
assert.ok(r.texte.length <= 160, "une phrase, pas un paragraphe");
assert.equal(r.drapeau, "ma.svg");
assert.equal(r.verifieLe, "2026-09-24");
// Copie archivée : enssup.gov.ma ne répond pas depuis Dakar (lot 83).
assert.match(r.source.url, /^https:\/\/web\.archive\.org\/web\/\d{14}\/https:\/\/www\.enssup\.gov\.ma\//);
});

test("sous le minimum, aucune révélation", () => {
assert.equal(lireRevelation(cinq.slice(0, 4), AUJOURDHUI), null);
assert.equal(lireRevelation([], AUJOURDHUI), null);
assert.equal(lireRevelation(null, AUJOURDHUI), null);
});

test("ne compte que les fiches qui PROUVENT la gratuité", () => {
const intruses = [
publique("payante", { fraisScolarite: { ...publique("x").fraisScolarite, licence: { montant: 62000, devise: "MAD", periode: "an" } } }),
publique("sans-prix", { fraisScolarite: undefined }),
publique("sans-source", { fraisScolarite: { ...publique("x").fraisScolarite, source: "" } }),
publique("exo-plafonnee", { exoneration: { politique: "possible_plafonnee" } }),
publique("tunisie", { country: "Tunisie" })
];
const r = lireRevelation([...cinq, ...intruses], AUJOURDHUI);
assert.equal(r.nombre, 5, "aucune intruse ne doit être comptée");
});

test("des prix périmés (au-delà de la fraîcheur) éteignent la révélation d'eux-mêmes", () => {
assert.equal(lireRevelation(cinq, new Date("2027-06-01T00:00:00Z")), null);
});

test("la date affichée est celle de la fiche la PLUS ANCIENNE", () => {
const lot = [...cinq.slice(0, 4), publique("vieille", { fraisScolarite: { ...publique("x").fraisScolarite, verifieLe: "2026-08-01" } })];
assert.equal(lireRevelation(lot, AUJOURDHUI).verifieLe, "2026-08-01");
});

test("catalogue réel : si la révélation s'affiche, son chiffre est celui des fiches marocaines « Gratuit »", () => {
const cat = JSON.parse(readFileSync(new URL("../assets/data/catalogue.json", import.meta.url), "utf8"));
const r = lireRevelation(cat.universities, AUJOURDHUI);
const attendu = cat.universities.filter((u) => REVELATIONS[0].critere(u, AUJOURDHUI)).length;
if (attendu >= REVELATIONS[0].minimum) {
assert.ok(r);
assert.equal(r.nombre, attendu);
} else {
assert.equal(r, null);
}
});

test("le bandeau pose la révélation AVANT le pied, hors de la frise, sans innerHTML", () => {
const src = readFileSync(new URL("../js/opportunites-bandeau.js", import.meta.url), "utf8");
assert.match(src, /import \{ lireRevelation \} from "\.\/revelations\.js";/);
assert.match(src, /pied\.before\(construireRevelation\(revelation\)\)/);
const corps = src.slice(src.indexOf("function construireRevelation"), src.indexOf("* Montage"));
assert.ok(corps.length > 200, "construireRevelation introuvable");
assert.ok(!/innerHTML/.test(corps), "la révélation doit être construite en textContent");
assert.ok(!/piste\.append|track/i.test(corps), "la révélation ne doit pas entrer dans la frise");
});
