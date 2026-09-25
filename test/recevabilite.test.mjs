/**
* « PUIS-JE ME LANCER ? » ET LE DIAGNOSTIC GRATUIT (lots 97 et 98, 2026-09-25)
*
* Charles : « il faut que le diagnostic puisse tout dire à l'étudiant
* avant de passer à n'importe quel parcours de candidature, pour qu'il
* sache s'il peut se lancer ou pas » — « tout gratuit, argent compris »,
* « Sénégal + 7 pays voisins ».
*
* Ces tests tiennent les règles officielles relues le 2026-09-25 (base du
* DAAD pays par pays, liste de la MQA, répertoire de l'AMCI, circulaire
* italienne 2026-2027, Laval pour le Maroc, critères de Campus France
* Sénégal), et le retrait de l'offre Diagnostic.
*/
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import vm from "node:vm";
import { puisJeMeLancer, voyantNiveau, normaliserEntrees, PAYS_DIPLOME, LANGUES_COURS, niveauVise } from "../js/recevabilite.js";
import { DESTINATIONS_VENDUES } from "../js/destinations-preinscription.js";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(join(racine, f), "utf8");
const JOUR = new Date("2026-09-25T12:00:00Z");
const argentOk = { etat: "atteint", phrase: "Vos ressources atteignent le seuil." };
const lancer = (id, brut, opts = {}) => puisJeMeLancer(id, brut, { aujourdhui: JOUR, verdictArgent: argentOk, ...opts });
const niveau = (id, brut, opts) => lancer(id, brut, opts).voyants[0];
const bac = (pays, extra = {}) => ({ diplomeActuel: "bac", paysDiplome: pays, desiredDegree: "Licence", ...extra });

test("les huit pays du diplôme, et « autre » qui n'invente rien", () => {
assert.deepEqual(PAYS_DIPLOME.map((p) => p.id), ["SN", "CI", "CM", "MA", "BJ", "GN", "TG", "BF", "autre"]);
for (const id of DESTINATIONS_VENDUES) {
const v = niveau(id, bac("autre"));
assert.equal(v.etat, "condition", id);
assert.equal(v.aVerifier, true, id);
assert.match(v.texte, /avant de payer quoi que ce soit/);
}
assert.equal(niveauVise("Doctorat"), "doctorat");
assert.equal(niveauVise("Master"), "master");
assert.equal(niveauVise("Licence"), "licence");
});

test("chaque destination a sa règle pour les huit pays, à chaque niveau, sources comprises", () => {
for (const id of DESTINATIONS_VENDUES) {
assert.ok((LANGUES_COURS[id] || []).length, `${id} : langues des cours`);
for (const p of PAYS_DIPLOME.filter((x) => x.id !== "autre")) {
for (const [diplome, vise] of [["bac", "Licence"], ["licence", "Master"], ["master", "Doctorat"]]) {
const v = niveau(id, { diplomeActuel: diplome, paysDiplome: p.id, desiredDegree: vise, serieBac: "scientifique" }, { variante: "quebec" });
assert.ok(["ok", "condition", "bloque"].includes(v.etat), `${id} ${p.id} ${vise} : ${v.etat}`);
assert.ok(v.texte && v.texte.length > 20, `${id} ${p.id} ${vise} : texte`);
if (!v.aVerifier && v.etat !== "bloque") assert.ok(v.sources.length, `${id} ${p.id} ${vise} : une source`);
for (const s of v.sources) assert.match(s.url, /^https?:\/\//);
}
}
}
});

test("un diplôme trop bas : pas encore, et ce qui débloque", () => {
const v = niveau("italie", { diplomeActuel: "bac2", paysDiplome: "SN", desiredDegree: "Master" });
assert.equal(v.etat, "bloque");
assert.match(v.texte, /licence \(bac \+ 3\)/);
assert.ok(v.deblocage);
assert.equal(niveau("canada", { diplomeActuel: "licence", paysDiplome: "SN", desiredDegree: "Doctorat" }).etat, "bloque");
// En dernière année, la candidature est ouverte.
assert.notEqual(niveau("france", { diplomeActuel: "l3", paysDiplome: "SN", desiredDegree: "Master" }).etat, "bloque");
assert.equal(niveau("france", { diplomeActuel: "terminale", paysDiplome: "SN", desiredDegree: "Licence" }).etat, "ok");
});

test("France — Campus France Sénégal : bac récent, une reprise au plus ; Guinée : moins de quatre ans", () => {
// Rentrée 2027 (campagne ouverte le 1er octobre 2026) : bac 2026 ou 2027.
assert.equal(niveau("france", bac("SN", { anneeBac: 2026 })).etat, "ok");
const vieux = niveau("france", bac("SN", { anneeBac: 2024 }));
assert.equal(vieux.etat, "bloque");
assert.match(vieux.texte, /bac 2026 ou 2027/);
assert.match(vieux.deblocage, /ANAQ-Sup/);
// La phrase finale ne recopie pas le voyant : elle nomme ce qui bloque et renvoie au détail.
const verdictVieux = lancer("france", bac("SN", { anneeBac: 2024, statutLangue_france: "etudes" })).verdict;
assert.equal(verdictVieux.phrase, "Pas encore en France : votre niveau d'études ne permet pas encore de postuler. Le détail, et ce qui vous débloque, est juste en dessous.");
assert.equal(niveau("france", bac("SN", { anneeBac: 2026, reprisesBac: 2 })).etat, "bloque");
assert.equal(niveau("france", bac("GN", { anneeBac: 2021 })).etat, "bloque");
assert.equal(niveau("france", bac("GN", { anneeBac: 2024 })).etat, "ok");
// Un bac + 2 sénégalais (cycle validé) : recevable, même avec un vieux bac.
assert.equal(niveau("france", { diplomeActuel: "bac2", paysDiplome: "SN", anneeBac: 2020, desiredDegree: "Licence" }).etat, "ok");
});

test("France — le test de français : dispensé en Afrique francophone, obligatoire au Maroc et avec le GCE", () => {
const langue = (pays, extra = {}) => lancer("france", bac(pays, { anneeBac: 2026, statutLangue_france: "aucun", ...extra })).voyants[1];
for (const p of ["SN", "CI", "BJ", "GN", "TG", "CM"]) assert.equal(langue(p).etat, "ok", p);
assert.equal(langue("MA").etat, "condition");
assert.match(langue("MA").texte, /TCF, DELF B2 ou DALF/);
assert.equal(langue("CM", { systemeBac: "anglophone" }).etat, "condition");
assert.match(langue("BF").texte, /Burkina/);
});

test("Allemagne — la base du DAAD : accès direct ou Studienkolleg selon le pays du bac", () => {
for (const p of ["SN", "CI", "TG", "CM"]) {
const v = niveau("allemagne", bac(p, { serieBac: "scientifique" }));
assert.equal(v.etat, "ok", p);
assert.match(v.texte, /Pas de Studienkolleg/);
assert.match(v.sources[0].url, /daad\.de/);
}
for (const p of ["MA", "GN", "BF"]) {
const v = niveau("allemagne", bac(p, { serieBac: "scientifique" }));
assert.equal(v.etat, "condition", p);
assert.match(v.texte, /Studienkolleg/);
// Une année d'université réussie au pays ouvre la même discipline.
assert.equal(niveau("allemagne", { diplomeActuel: "bac1", paysDiplome: p, desiredDegree: "Licence" }).etat, "ok", `${p} + 1 an`);
}
assert.match(niveau("allemagne", bac("SN", { serieBac: "scientifique" })).texte, /sauf les lettres/);
assert.match(niveau("allemagne", bac("CI", { serieBac: "scientifique" })).texte, /toutes les disciplines/);
assert.equal(niveau("allemagne", bac("BJ", { serieBac: "litteraire" })).etat, "condition");
});

test("Canada — au Québec, treize années : le bac marocain demande une année de plus", () => {
assert.equal(niveau("canada", bac("MA"), { variante: "quebec" }).etat, "condition");
assert.match(niveau("canada", bac("MA"), { variante: "quebec" }).texte, /douze/);
assert.equal(niveau("canada", bac("SN"), { variante: "quebec" }).etat, "ok");
assert.equal(niveau("canada", { diplomeActuel: "bac1", paysDiplome: "MA", desiredDegree: "Licence" }, { variante: "quebec" }).etat, "ok");
assert.equal(niveau("canada", bac("MA")).etat, "ok", "hors Québec : accès direct");
assert.match(niveau("canada", bac("MA")).texte, /16 sur 20/);
});

test("Malaisie — la liste de la MQA : ni la Côte d'Ivoire ni le Burkina", () => {
for (const p of ["SN", "MA", "BJ", "GN", "TG", "CM"]) assert.equal(niveau("malaisie", bac(p)).etat, "ok", p);
for (const p of ["CI", "BF"]) {
const v = niveau("malaisie", bac(p));
assert.equal(v.etat, "condition");
assert.match(v.texte, /équivalence/);
}
});

test("Maroc — l'AMCI (bac récent, mention, âge), les admissions directes, et le Marocain", () => {
assert.equal(niveau("maroc", bac("SN", { anneeBac: 2026, mentionBac: "bien", anneeNaissance: 2007 })).etat, "ok");
const v = niveau("maroc", bac("SN", { anneeBac: 2022, mentionBac: "passable", anneeNaissance: 2000 }));
assert.equal(v.etat, "condition");
assert.match(v.texte, /UM6P, Al Akhawayn/);
const national = lancer("maroc", bac("MA", { nationality: "Maroc", statutLangue_maroc: "etudes" }));
assert.equal(national.voyants[0].etat, "bloque");
assert.equal(national.verdict.etat, "pas-encore");
assert.match(national.verdict.phrase, /pas étudiant étranger/);
});

test("Italie — douze années de scolarité, préinscription en terminale, italien B2", () => {
assert.equal(niveau("italie", bac("MA")).etat, "ok");
assert.match(niveau("italie", { diplomeActuel: "terminale", paysDiplome: "SN", desiredDegree: "Licence" }).texte, /sous réserve du bac/);
const l = lancer("italie", bac("SN", { langueCours_italie: "italien", statutLangue_italie: "aucun" })).voyants[1];
assert.equal(l.etat, "condition");
assert.match(l.texte, /B2/);
assert.match(l.sources[0].url, /Circolare_2026-2027/);
});

test("le verdict : lancer, lancer à condition, pas encore — jamais une promesse d'admission", () => {
const ok = lancer("allemagne", bac("SN", { serieBac: "scientifique", langueCours_allemagne: "allemand", statutLangue_allemagne: "test" }));
assert.equal(ok.verdict.etat, "lancer");
assert.match(ok.verdict.phrase, /droit de postuler/);
assert.match(ok.verdict.phrase, /l'admission, elle, reste la décision de chaque université/);
const si = lancer("allemagne", bac("GN", { serieBac: "scientifique", langueCours_allemagne: "allemand", statutLangue_allemagne: "aucun" }));
assert.equal(si.verdict.etat, "lancer-si");
assert.match(si.verdict.phrase, /2 points à régler/);
const manque = lancer("allemagne", bac("SN", { serieBac: "scientifique", statutLangue_allemagne: "test" }), { verdictArgent: { etat: "manque", phrase: "Il vous manque 200 €." } });
assert.equal(manque.verdict.etat, "lancer-si");
for (const r of [ok, si, manque]) assert.ok(!/serez admis|admission garantie|vous aurez votre visa/i.test(JSON.stringify(r)));
});

test("le calendrier France : à temps avant le 15 décembre, rentrée suivante après", () => {
const avant = lancer("france", bac("SN", { anneeBac: 2026, statutLangue_france: "etudes" })).voyants[3];
assert.equal(avant.etat, "ok");
assert.match(avant.texte, /rentrée 2027/);
const apres = puisJeMeLancer("france", bac("SN", { anneeBac: 2026, statutLangue_france: "etudes" }), { aujourdhui: new Date("2027-01-10T12:00:00Z"), verdictArgent: argentOk }).voyants[3];
assert.equal(apres.etat, "condition");
assert.match(apres.texte, /rentrée 2028/);
});

test("les entrées se lisent du profil (clés partagées par tous les pays)", () => {
const e = normaliserEntrees("chine", { diplomeActuel: "l3", paysDiplome: "TG", desiredDegree: "Master", anneeBac: "2023", langueCours_chine: "anglais", statutLangue_chine: "test", nationality: "Togo" });
assert.equal(e.diplome, "l3");
assert.equal(e.anneeBac, 2023);
assert.equal(e.langueCours, "anglais");
assert.equal(e.nationalite, "Togo");
assert.equal(normaliserEntrees("chine", { diplomeActuel: "n'importe" }).diplome, "");
});

// ------------------------------------------------------------------
// Lot 97 — le diagnostic est gratuit
// ------------------------------------------------------------------

function grilleClient() {
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(lire("pricing-plans.js"), ctx);
return ctx.window.SCHOLARBRIDGE_PLANS || ctx.SCHOLARBRIDGE_PLANS;
}

test("lot 97 — l'offre Diagnostic est retirée de la vente, côté site et côté serveur", () => {
const plans = grilleClient();
assert.equal(plans["diagnostic-france"].deprecated, true);
assert.equal(plans["diagnostic-france"].priceFCFA, 10000, "l'identifiant et le prix restent pour les acheteurs");
assert.match(lire("functions/lib/achat.js"), /"diagnostic-france": \{ label: "Diagnostic France", prix: 10000, dureeJours: 14, parcours: "preinscription", deprecated: true \}/);
});

test("lot 97 — les deux pages du diagnostic s'ouvrent à tout compte, et posent la question des études", () => {
for (const f of ["js/diagnostic-pays-page.js", "js/diagnostic-france-page.js"]) {
const js = lire(f);
assert.ok(js.includes('bootstrapShell({ espace: "preinscription" })'), f);
assert.ok(!/feature: "diagnostic_france"|ctx\.locked|renderLockedState/.test(js), `${f} : plus de verrou`);
assert.match(js, /poserQuestions\(/);
assert.match(js, /peindreVoyants\(/);
assert.match(js, /\.\.\.champsProfil,/, `${f} : les réponses vont dans le profil`);
// Jamais d'offre à qui ne peut pas encore postuler.
assert.match(js, /pas-encore/);
}
for (const f of ["diagnostic-pays.html", "diagnostic-france.html"]) {
const html = lire(f);
assert.ok(html.includes('<fieldset class="rec-questions" id="recQuestions"></fieldset>'), f);
assert.ok(html.includes('<section class="rec-resultat" id="recResultat" hidden></section>'), f);
assert.match(html, /Ce diagnostic est gratuit\./);
assert.ok(html.includes('<link rel="modulepreload" href="js/recevabilite.js">'), `${f} : préchargement`);
}
});

test("lot 97 — la vitrine : une carte gratuite avant les offres, plus de déduction", () => {
const dest = lire("js/preinscription-destination.js");
assert.match(dest, /poserHtml\("destOffres", carteDiagnosticGratuit\(pays\) \+ offres\.map/);
assert.match(dest, /diagnostic-pays\.html\?d=\$\{encodeURIComponent\(pays\.id\)\}/);
assert.match(dest, /grille\[deduction\.offre\]\.deprecated !== true/);
const offers = lire("offers.html");
assert.ok(offers.includes('<a href="diagnostic-france.html" class="btn btn-secondary plan-cta">'));
assert.ok(!offers.includes('data-plan="diagnostic-france"'), "plus de bouton d'achat du Diagnostic");
// ?d=france mène à la page France.
assert.match(lire("js/diagnostic-pays-page.js"), /if \(ID === "france"\) window\.location\.replace\("diagnostic-france\.html"\);/);
});

// ------------------------------------------------------------
// Le test par profils types (2026-09-25, après le lot 98) : treize
// étudiants fictifs passés dans les neuf pays. Cinq défauts trouvés,
// tenus ici.
// ------------------------------------------------------------
test("une réponse décisive laissée vide ne donne jamais « vous pouvez postuler »", () => {
const sn = niveau("france", bac("SN"));
assert.equal(sn.etat, "condition");
assert.match(sn.titre, /Année du bac/);
const gn = niveau("france", bac("GN"));
assert.equal(gn.etat, "condition");
const de = niveau("allemagne", bac("SN"));
assert.equal(de.etat, "condition");
assert.match(de.titre, /Série/);
const ma = niveau("maroc", bac("SN"));
assert.equal(ma.etat, "condition");
assert.match(ma.texte, /l'année de votre bac, votre mention et votre année de naissance/);
});

test("Maroc : en terminale, la mention reste à obtenir", () => {
const v = niveau("maroc", { diplomeActuel: "terminale", paysDiplome: "SN", desiredDegree: "Licence", anneeNaissance: 2008 });
assert.equal(v.etat, "condition");
assert.match(v.texte, /mention assez bien/);
assert.doesNotMatch(v.texte, /répond aux critères/);
});

test("Maroc : qui ne parle pas encore français n'entend pas « C'est bon »", () => {
const r = lancer("maroc", { ...bac("CM", { systemeBac: "anglophone", anneeBac: 2026, mentionBac: "bien", anneeNaissance: 2007 }), statutLangue_maroc: "aucun" });
assert.equal(r.voyants[1].etat, "condition");
assert.equal(r.verdict.etat, "lancer-si");
});

test("Canada : le bac burkinabè est dispensé du test de français (liste UQAM)", () => {
const r = lancer("canada", { ...bac("BF"), statutLangue_canada: "etudes" }, { variante: "quebec" });
assert.equal(r.voyants[1].etat, "ok");
});

test("France : un diplôme d'un autre pays ne se voit pas imposer le test de français d'office", () => {
const r = lancer("france", { ...bac("autre"), statutLangue_france: "etudes" });
assert.equal(r.voyants[1].titre, "À vérifier");
assert.match(r.voyants[1].texte, /langue officielle de votre pays/);
});

test("le formulaire exige toute question affichée, et le dit à l'écran", () => {
const ui = lire("js/recevabilite-ui.js");
assert.match(ui, /export function manquantes\(reponses, id, conteneur = null\)/);
assert.match(ui, /!champ\.hidden && !String\(el\.value/);
assert.match(ui, /Répondez à cette question pour voir votre diagnostic\./);
assert.match(ui, /\.fitz-select-trigger/);
for (const f of ["js/diagnostic-pays-page.js", "js/diagnostic-france-page.js"]) {
const src = lire(f);
assert.match(src, /manquantes\(reponses, (ID|"france"), questions\)/, f);
assert.match(src, /signalerManque\(questions, manque\)/, f);
}
});
