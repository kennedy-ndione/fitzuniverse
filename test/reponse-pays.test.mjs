/**
* LES PAYS DU QUESTIONNAIRE SE CHOISISSENT DANS LA LISTE (2026-09-23).
*
* Constaté en ligne : « Informatique » passait comme pays de résidence,
* et une résidence ou une nationalité non reconnue rend estEligible()
* muet — le résultat est faussé sans que rien ne le dise. La saisie
* reste tolérante (accents, apostrophe du téléphone, RDC, gentilés…),
* mais la réponse enregistrée est toujours une entrée de la liste.
*/

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { QUESTIONS_PAYS, JE_NE_SAIS_PAS, reponseDeListe, consigneHorsListe } from "../js/reponse-pays.js";
import { PAYS_DU_MONDE } from "../js/eligibility-pistes.js";
import { NATIONALITES } from "../js/nationalites.js";
import { isoDeNationalite } from "../js/eligibility-countries.js";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(join(racine, f), "utf8");

const DESTINATIONS = ["Allemagne", "Canada", "Chine", "États-Unis", "France", "Royaume-Uni", "Turquie", JE_NE_SAIS_PAS];

test("pays 1 — ce qui n'est pas un pays est refusé, à chacune des trois questions", () => {
assert.deepEqual(QUESTIONS_PAYS, ["country", "nationality", "destinationCountry"]);
assert.equal(reponseDeListe("country", "Informatique", PAYS_DU_MONDE), null);
assert.equal(reponseDeListe("nationality", "Informatique", NATIONALITES), null);
assert.equal(reponseDeListe("destinationCountry", "Informatique", DESTINATIONS), null);
assert.equal(reponseDeListe("country", "   ", PAYS_DU_MONDE), null);
// Ambigu : on ne choisit pas entre les deux Congo.
assert.equal(reponseDeListe("country", "Congo", PAYS_DU_MONDE), null);
assert.equal(reponseDeListe("nationality", "congolais", NATIONALITES), null);
// Deux lettres : l'étudiant n'avait pas fini son mot.
assert.equal(reponseDeListe("country", "ma", PAYS_DU_MONDE), null);
assert.equal(reponseDeListe("nationality", "sn", NATIONALITES), null);
});

test("pays 2 — une saisie tolérante, ramenée à l'entrée exacte de la liste", () => {
assert.equal(reponseDeListe("country", "senegal", PAYS_DU_MONDE), "Sénégal");
assert.equal(reponseDeListe("country", "Côte d’Ivoire", PAYS_DU_MONDE), "Côte d'Ivoire", "apostrophe courbe du téléphone");
assert.equal(reponseDeListe("country", "Burkina-Faso", PAYS_DU_MONDE), "Burkina Faso");
assert.equal(reponseDeListe("country", "RDC", PAYS_DU_MONDE), "République démocratique du Congo");
assert.equal(reponseDeListe("country", "Sénégalais", PAYS_DU_MONDE), "Sénégal");
assert.equal(reponseDeListe("country", "USA", PAYS_DU_MONDE), "États-Unis");
assert.equal(reponseDeListe("nationality", "Sénégal", NATIONALITES), "Sénégalais(e)");
assert.equal(reponseDeListe("nationality", "sénégalaise", NATIONALITES), "Sénégalais(e)");
assert.equal(reponseDeListe("nationality", "malien", NATIONALITES), "Malien(ne)");
assert.equal(reponseDeListe("nationality", "RDC", NATIONALITES), "Congolais(e) (RDC)");
assert.equal(reponseDeListe("destinationCountry", "turkey", DESTINATIONS), "Turquie");
assert.equal(reponseDeListe("destinationCountry", "UK", DESTINATIONS), "Royaume-Uni");
for (const s of ["je ne sais pas", "Non", "peu importe", "aucune idée"]) {
assert.equal(reponseDeListe("destinationCountry", s, DESTINATIONS), JE_NE_SAIS_PAS, s);
}
});

test("pays 3 — chaque entrée des listes est acceptée telle quelle, et chaque réponse reste résoluble en code ISO", () => {
for (const p of PAYS_DU_MONDE) {
assert.equal(reponseDeListe("country", p, PAYS_DU_MONDE), p, p);
assert.ok(isoDeNationalite(p), `${p} : sans code ISO, estEligible() serait muet`);
}
NATIONALITES.forEach((g, i) => {
assert.equal(reponseDeListe("nationality", g, NATIONALITES), g, g);
assert.equal(reponseDeListe("nationality", PAYS_DU_MONDE[i], NATIONALITES), g, `${PAYS_DU_MONDE[i]} → ${g}`);
assert.ok(isoDeNationalite(g), g);
});
});

test("pays 4 — la destination : un pays hors catalogue est dit comme tel ; sans réseau, on laisse avancer", () => {
assert.equal(reponseDeListe("destinationCountry", "Maroc", DESTINATIONS), null);
assert.match(consigneHorsListe("destinationCountry", "Maroc"), /^« Maroc » n'est pas encore dans notre catalogue\./);
assert.match(consigneHorsListe("destinationCountry", "Informatique"), /^« Informatique » n'est pas dans la liste\./);
// Filet de secours (catalogue non chargé) : un vrai pays passe.
assert.equal(reponseDeListe("destinationCountry", "maroc", [JE_NE_SAIS_PAS]), "Maroc");
assert.equal(reponseDeListe("destinationCountry", "Informatique", [JE_NE_SAIS_PAS]), null);
assert.match(consigneHorsListe("country", "Informatique"), /^« Informatique » n'est pas dans la liste\. Tapez le début du nom de votre pays/);
assert.match(consigneHorsListe("nationality", "x"), /nationalité/);
// Des pays proches sont proposés : la consigne dit seulement où toucher.
assert.equal(consigneHorsListe("country", "Congo", { proposes: 2 }), "« Congo » : touchez votre pays dans la liste ci-dessous.");
assert.equal(consigneHorsListe("nationality", "congolais", { proposes: 2 }), "« congolais » : touchez votre nationalité dans la liste ci-dessous.");
});

test("pays 5 — le questionnaire s'en sert, et la consigne se lit sous le champ", () => {
const js = lire("eligibility-questions.js");
assert.match(js, /import \{ QUESTIONS_PAYS, reponseDeListe, consigneHorsListe \} from "\.\/js\/reponse-pays\.js";/);
assert.match(js, /if \(QUESTIONS_PAYS\.includes\(question\.id\)\) \{/);
assert.match(js, /montrerConsigne\(consigneHorsListe\(question\.id, value, \{ proposes: suggestionsBox\.childElementCount \}\)\);/);
assert.match(js, /parcours\.enregistrer\(question\.id, reponse\);/);
assert.ok(!/parcours\.enregistrer\(question\.id, value\);/.test(js), "une saisie brute ne doit plus être enregistrée");
const html = lire("eligibility-questions.html");
assert.match(html, /<p class="answer-invite" id="answerInvite" role="alert" hidden><\/p>/);
assert.match(html, /aria-describedby="answerInvite"/);
const css = lire("eligibility-questions.css");
assert.match(css, /\.answer-invite\[hidden\]\{/);
assert.match(css, /input#answer\.is-hors-liste:focus\{/);
});
