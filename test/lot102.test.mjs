/**
* LOT 102 — CE QUE LES RETESTS DU 25/09 AU SOIR ONT TROUVÉ
*
* Charles : « corrige tout maintenant… et pour le point 2, prends la
* meilleure décision ». Rapport : claude/retests-apres-lot101-2026-09-25.md.
*   1. Canada : un candidat en licence voyait les droits de maîtrise.
*   2. Un budget de vie absurde (3 980 F CFA par mois en Chine) passait :
*      le repère est désormais l'allocation que l'État verse à ses propres
*      boursiers, qu'il loge en plus. En dessous : « Pas encore ».
*   3. Les montants des pages pays se redisent en F CFA ; « 15 854,40 TL ».
*/
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { calculerDiagnosticPays, formatMontant } from "../js/diagnostic-pays.js";
import { DIAGNOSTICS } from "../js/destinations-preinscription.js";
import { montantsEnFcfa } from "../js/taux-indicatifs.js";
import { voyantArgent } from "../js/recevabilite.js";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(join(racine, f), "utf8").replace(/\r\n/g, "\n");
const NB = " ";

test("Canada : la licence a ses droits, au Québec comme ailleurs ; la maîtrise garde les siens", () => {
const lic = calculerDiagnosticPays("canada", { ressourcesMensuelles: 0, niveau: "licence" });
const droitsLic = lic.lignes.find((l) => l.cle === "droits");
assert.match(droitsLic.texte, /^Licence \(baccalauréat\)/);
assert.equal(droitsLic.min, 14345);
const qc = calculerDiagnosticPays("canada", { ressourcesMensuelles: 0, niveau: "licence", variante: "quebec" });
assert.equal(qc.lignes.find((l) => l.cle === "droits").min, 24552);
const mai = calculerDiagnosticPays("canada", { ressourcesMensuelles: 0, niveau: "master" });
assert.match(mai.lignes.find((l) => l.cle === "droits").texte, /^Maîtrise/);
// Doctorat (lot 103) : ses propres droits, plus ceux de la maîtrise.
const doc = calculerDiagnosticPays("canada", { ressourcesMensuelles: 0, niveau: "doctorat", variante: "quebec" });
const droitsDoc = doc.lignes.find((l) => l.cle === "droits");
assert.match(droitsDoc.texte, /^Doctorat/);
assert.equal(droitsDoc.min, 4680);
assert.match(droitsDoc.source, /^https:\/\/www\.etsmtl\.ca\//);
// Sans niveau : la valeur d'avant, inchangée.
assert.match(calculerDiagnosticPays("canada", { ressourcesMensuelles: 0 }).lignes.find((l) => l.cle === "droits").texte, /^Maîtrise/);
for (const d of [DIAGNOSTICS.canada.droitsParNiveau.licence, DIAGNOSTICS.canada.droitsParNiveau.licence.variantes.quebec]) {
assert.match(d.source, /^https:\/\//);
assert.ok(d.min < d.max);
}
});

test("le repère du coût de la vie : l'allocation des bourses d'État, sourcée, par niveau", () => {
for (const id of ["turquie", "chine"]) {
const r = DIAGNOSTICS[id].repereVie;
assert.ok(r.licence > 0 && r.master >= r.licence && r.doctorat >= r.master, id);
assert.match(r.source, /^https:\/\//, id);
assert.match(r.libelle, /logés gratuitement/, id);
}
assert.equal(DIAGNOSTICS.chine.repereVie.licence, 2500);
assert.equal(DIAGNOSTICS.turquie.repereVie.licence, 6500);
});

test("sous le repère, « Pas encore » ; tout près, « à confirmer » ; au-dessus, le logement à vérifier", () => {
// Chine, 200 000 F par mois : 3 980 F pour vivre, contre 2 500 CNY versés à un boursier logé.
const cn = calculerDiagnosticPays("chine", { ressourcesMensuelles: 200000, devise: "XOF", niveau: "licence" });
assert.equal(cn.verdict.etat, "manque");
assert.match(cn.verdict.phrase, /C'est moins que l'allocation mensuelle de la bourse du gouvernement chinois/);
assert.equal(voyantArgent(cn.verdict).etat, "bloque");
// Chine, 400 000 F : à moins de 5 % du repère.
assert.equal(calculerDiagnosticPays("chine", { ressourcesMensuelles: 400000, devise: "XOF", niveau: "licence" }).verdict.etat, "a-confirmer");
// Turquie, 200 000 F (Moussa) : au-dessus du repère de licence ; en doctorat, en dessous.
const tr = calculerDiagnosticPays("turquie", { ressourcesMensuelles: 200000, devise: "XOF", niveau: "licence" });
assert.equal(tr.verdict.etat, "sans-seuil");
assert.match(tr.verdict.phrase, /C'est au-dessus de l'allocation mensuelle de la bourse d'État Türkiye Bursları/);
assert.equal(voyantArgent(tr.verdict).etat, "condition");
assert.equal(calculerDiagnosticPays("turquie", { ressourcesMensuelles: 200000, devise: "XOF", niveau: "doctorat" }).verdict.etat, "manque");
// Sans repère officiel (Malaisie, Maroc) : la règle d'avant.
const my = calculerDiagnosticPays("malaisie", { ressourcesMensuelles: 3000000, devise: "XOF", niveau: "licence" });
assert.equal(my.verdict.etat, "sans-seuil");
assert.match(my.verdict.phrase, /comparez-le aux loyers de la ville visée/);
});

test("la page transmet le niveau visé au calcul", () => {
const page = lire("js/diagnostic-pays-page.js");
assert.match(page, /niveau: entrees\.niveau \|\| niveauVise\(reponses\.desiredDegree\)/);
assert.match(page, /entrees\.niveau = niveauVise\(reponses\.desiredDegree\);/);
});

test("les montants des pages pays se redisent en F CFA ; deux décimales quand il y en a", () => {
assert.equal(montantsEnFcfa("877,50 € par mois"), `En F${NB}CFA${NB}: 877,50${NB}€ = 575${NB}602${NB}F${NB}CFA.`);
assert.match(montantsEnFcfa("de 2 000 USD à 14 850 USD"), /2 000 USD ≈ 1 150 000 F CFA ; 14 850 USD ≈ 8 542 000 F CFA \(au taux de référence du 25/);
assert.equal(montantsEnFcfa("douze années, 25 %, sans montant"), "");
assert.match(lire("js/preinscription-destination.js"), /<p class="pre-fait-fcfa">\$\{escapeHtml\(montantsEnFcfa\(f\.texte\)\)\}<\/p>/);
assert.equal(formatMontant(15854.4, "TRY"), `15${NB}854,40${NB}TL`);
assert.equal(formatMontant(964, "TRY"), `964${NB}TL`);
});

test("lot 104 — la page des offres parle des neuf pays, et le menu de langue n'a pas de ligne vide", () => {
const offres = lire("offers.html");
assert.ok(!offres.includes("Pour une préinscription en France"));
assert.match(offres, /un dossier par pays, dans neuf pays, mené jusqu'au dépôt/);
assert.match(lire("js/recevabilite-ui.js"), /\$\{vide \? `<option value="">\$\{escapeHtml\(vide\)\}<\/option>` : ""\}/);
});
