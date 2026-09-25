/**
* LOT 101 — LE TEST « MOUSSA » (2026-09-25)
*
* Claude a joué un étudiant de Thiès (bac S2 2026, 200 000 F CFA par
* mois) sur le site en ligne ; dix défauts relevés, Charles : « fais
* toutes les corrections que tu as soulignées, c'est important », et
* pour le Canada « il faut qu'on accompagne aussi les licences ».
* Rapport : claude/test-etudiant-moussa-2026-09-25.md.
*/
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { enFcfa, equivalentFcfa, equivalentFcfaFourchette, formatFcfa, conversionExacte, TAUX_INDICATIFS, PARITE_EUR_XOF } from "../js/taux-indicatifs.js";
import { voyantArgent, puisJeMeLancer } from "../js/recevabilite.js";
import { PAYS, faitsPublics } from "../js/pays-preinscription.js";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(join(racine, f), "utf8").replace(/\r\n/g, "\n");
const NB = " ";

test("les taux indicatifs : datés, sourcés auprès d'une banque centrale, jamais pour l'euro", () => {
assert.match(TAUX_INDICATIFS.date, /^\d{4}-\d{2}-\d{2}$/);
assert.match(TAUX_INDICATIFS.sources.bce, /^https:\/\/www\.ecb\.europa\.eu\//);
assert.match(TAUX_INDICATIFS.sources.bam, /^https:\/\/www\.bkam\.ma\//);
for (const d of ["USD", "TRY", "RON", "CAD", "CNY", "MYR", "MAD"]) assert.ok(TAUX_INDICATIFS.parEuro[d] > 0, d);
// L'euro : la parité légale, exacte.
assert.equal(enFcfa(1, "EUR"), PARITE_EUR_XOF);
assert.ok(conversionExacte("EUR") && conversionExacte("XOF") && !conversionExacte("USD"));
// Une autre devise : « environ », arrondi au millier, espaces insécables.
assert.equal(equivalentFcfa(2000, "USD"), `environ 1${NB}150${NB}000${NB}F${NB}CFA`);
assert.equal(equivalentFcfa(1000, "EUR"), `655${NB}957${NB}F${NB}CFA`.replace(`655${NB}957`, `656${NB}000`));
assert.equal(equivalentFcfa(1000, "XOF"), "");
assert.equal(equivalentFcfa(10, "GNF"), "", "une devise sans taux ne se redit pas");
assert.match(equivalentFcfaFourchette(2000, 14850, "USD"), /^environ 1 150 000 à 8 542 000 F CFA$/);
assert.equal(formatFcfa(8472), `8${NB}472${NB}F${NB}CFA`);
});

test("l'argent qui manque bloque ; un écart trop fin se confirme ; un budget sans seuil se vérifie", () => {
assert.equal(voyantArgent({ etat: "manque", phrase: "x" }).etat, "bloque");
assert.match(voyantArgent({ etat: "manque", phrase: "x" }).deblocage, /garant/);
assert.equal(voyantArgent({ etat: "a-confirmer", phrase: "x" }).etat, "condition");
assert.equal(voyantArgent({ etat: "sans-seuil", phrase: "x", resteMensuelXof: 88000 }).etat, "condition");
assert.equal(voyantArgent({ etat: "sans-seuil", phrase: "x" }).etat, "info");
assert.equal(voyantArgent({ etat: "atteint", phrase: "x" }).etat, "ok");
// Moussa en France : « Pas encore », plus « Vous pouvez vous lancer ».
const r = puisJeMeLancer("france", { diplomeActuel: "bac", paysDiplome: "SN", anneeBac: 2026, desiredDegree: "Licence", statutLangue_france: "etudes" }, {
aujourdhui: new Date("2026-09-25T12:00:00Z"),
verdictArgent: { etat: "manque", phrase: "Il manque 9 903 € sur l'année." }
});
assert.equal(r.verdict.etat, "pas-encore");
assert.equal(r.verdict.phrase, "Pas encore en France : vos ressources ne couvrent pas encore la première année. Le détail, et ce qui vous débloque, est juste en dessous.");
});

test("France : la source du seuil de 877,50 € est officielle ; le niveau ne se demande qu'une fois", () => {
const fr = PAYS.find((p) => p.id === "france");
const ressources = fr.faits.find((f) => f.cle === "ressources");
assert.equal(ressources.source, "https://www.service-public.gouv.fr/particuliers/vosdroits/F2231");
assert.equal(ressources.montants.mensuel, 877.5);
assert.ok(!/infomigrants/.test(lire("js/pays-preinscription.js")));
assert.match(lire("diagnostic-france.html"), /<div class="field" id="diagNiveauChamp">/);
assert.match(lire("js/diagnostic-france-page.js"), /document\.getElementById\("diagNiveauChamp"\)\.hidden = !!radio;/);
assert.match(lire("css/diagnostic-france.css"), /\.diag-form \.field\[hidden\]\{ display:none; \}/);
});

test("Turquie : l'autofinancement d'abord, et le diagnostic trie les étapes selon la voie", () => {
const tr = PAYS.find((p) => p.id === "turquie");
const publics = faitsPublics(tr);
assert.equal(publics[0].cle, "autofinancement");
assert.equal(publics[1].cle, "droitsAutofinancement");
assert.ok(!/ÉDUCATION NATIONALE/.test(JSON.stringify(tr)));
const page = lire("js/diagnostic-pays-page.js");
assert.match(page, /function etapesHorsVoie\(voie\)/);
assert.match(page, /voie: voieChoisie\(\),/);
assert.match(lire("diagnostic-pays.html"), /id="diagVoieChamp" hidden/);
});

test("Canada : la licence est accompagnée, avec la lettre de la province", () => {
const ca = PAYS.find((p) => p.id === "canada");
assert.match(ca.positionnement, /^Licence, maîtrise et doctorat\./);
assert.ok(!/uniquement/.test(ca.positionnement));
});

test("les textes : neuf pays sur l'accueil, plus de phrase fausse sur la page des destinations", () => {
const index = lire("index.html");
assert.ok(!index.includes("En France à vos frais"));
assert.match(index, /procédure officielle de neuf pays jusqu'au dépôt/);
const pre = lire("preinscriptions.html");
assert.ok(!/compétition/.test(pre));
assert.ok(!/sans promesse de date/.test(pre));
assert.match(pre, /Les neuf destinations ouvertes/);
const italie = PAYS.find((p) => p.id === "italie").positionnement;
assert.ok(!/120 %/.test(italie), "le quota se dit en mots, sans jargon");
assert.match(PAYS.find((p) => p.id === "malaisie").positionnement, /lettre électronique d'approbation du visa \(eVAL\)/);
});

test("le paiement : le récapitulatif s'affiche sans attendre la session, et dit qu'il n'y a pas de remboursement", () => {
const html = lire("payment.html");
assert.match(html, /<dt>Remboursement<\/dt>/);
assert.match(html, /href="cgv\.html#cgv-remboursement"/);
assert.match(lire("cgv.html"), /id="cgv-remboursement"/);
const js = lire("payment.js");
const pre = js.indexOf("if (plan) renderPlan(plan, null);");
assert.ok(pre > 0 && pre < js.indexOf("resolveSession().then(bootstrap)"), "le récapitulatif précède la vérification de session");
});

test("le catalogue redit chaque coût en F CFA", () => {
assert.match(lire("universities-page.js"), /\$\{puceFcfa\(frais\)\}/);
assert.match(lire("js/fiche-universite.js"), /fcfa: verifie && f\.montant > 0/);
assert.match(lire("universite-page.js"), /if \(ligne\.fcfa\) valeur\.append/);
});
