/**
* LOT 115 (2026-09-26) — trois corrections demandées par Charles
*
* 1. Le portail de dépôt GO ESKAS des bourses suisses (donnée privée).
* 2. La fiche d'une bourse fermée au profil ne dit plus « pourquoi cette
*    bourse vous correspond » et ne propose plus de l'ajouter au parcours.
* 3. Le diagnostic gratuit de préinscription : le visiteur sans compte y
*    revient après l'inscription ou la connexion, tout compte l'ouvre (un
*    client bourse compris), et l'accueil d'un compte gratuit le montre.
*/
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { PATCHES, PORTAIL_ESKAS } from "../scripts/data/lot115-portail-eskas.mjs";
import { validerLot } from "../scripts/lot-validate.mjs";
import { separerPortails } from "../scripts/instantane-portails.mjs";
import { retourSur, retourDepuisPage, phraseDeRetour, pageDeCompte, NOMS_DESTINATIONS, DESTINATIONS_RETOUR } from "../js/retour-apres-compte.js";
import { diagnosticsPreinscription, LIBELLES_VERDICT } from "../js/diagnostics-sauvegardes.js";
import { paysAvecArticle } from "../js/eligibility-countries.js";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(join(racine, f), "utf8").replace(/\r\n/g, "\n");
const JOUR = new Date("2026-09-26T09:00:00Z");

test("115 — le portail GO ESKAS : lot valide, lien officiel, et il reste PRIVÉ", () => {
assert.deepEqual(validerLot({ PATCHES }, JOUR).erreurs, []);
assert.equal(PATCHES.length, 1);
assert.equal(PATCHES[0].id, "swiss-government-excellence-scholarships");
assert.match(PORTAIL_ESKAS, /^https:\/\/www\.go\.eskas\.ch\/BewerbungServlet\?identifier=SBFI&/);
const catalogue = JSON.parse(lire("assets/data/catalogue.json"));
const bourse = catalogue.scholarships.find((s) => s.id === PATCHES[0].id);
assert.equal(bourse.entryPoint, "bourse", "le dossier se dépose chez le bailleur");
// L'export range le portail dans la carte privée, jamais dans l'instantané public.
const simule = { ...catalogue, scholarships: catalogue.scholarships.map((s) => (s.id === bourse.id ? { ...s, ...PATCHES[0].champs } : s)) };
const { public: pub, portails } = separerPortails(simule);
assert.equal(portails.bourses[bourse.id], PORTAIL_ESKAS);
assert.ok(!("applicationPortalUrl" in pub.scholarships.find((s) => s.id === bourse.id)));
});

test("115 — une bourse fermée au profil ne dit pas « pourquoi elle vous correspond »", () => {
const js = lire("details.js");
assert.match(js, /const fermeeAuProfil = verdicts\.some\(\(v\) => v\.ton === "defavorable"\);/);
assert.match(js, /const raisons = fermeeAuProfil \? \[\] : \(explainMatch\(/);
assert.match(js, /brancherActionsSituation\(\{ session, university, fermeeAuProfil \}\)/);
// Le refus vient APRÈS « déjà dans votre parcours » : une candidature créée reste joignable.
const actions = js.slice(js.indexOf("async function brancherActionsSituation"));
assert.ok(actions.indexOf("Déjà dans votre parcours") < actions.indexOf("if (fermeeAuProfil)"));
assert.ok(actions.indexOf("if (fermeeAuProfil)") < actions.indexOf("addBtn.hidden = false"));
// La phrase du verdict parle d'un pays, jamais d'un gentilé.
assert.equal(paysAvecArticle("Sénégalais(e)"), "du Sénégal");
assert.equal(paysAvecArticle("Ivoirien(ne)"), "de la Côte d'Ivoire");
assert.equal(paysAvecArticle("Sénégal"), "du Sénégal");
assert.equal(paysAvecArticle("Wakanda"), "Wakanda");
});

test("115 — le retour après le compte accepte les deux pages de diagnostic, et rien d'autre de neuf", () => {
assert.equal(retourSur("?retour=diagnostic-pays.html%3Fd%3Dmaroc"), "diagnostic-pays.html?d=maroc");
assert.equal(retourSur("?retour=diagnostic-france.html"), "diagnostic-france.html");
for (const piege of [
"?retour=diagnostic-pays.html%3Fd%3Datlantide",
"?retour=diagnostic-pays.html%3Fd%3Dmaroc%26x%3D1",
"?retour=diagnostic-pays.html",
"?retour=diagnostic-france.html%3Fx%3D1",
"?retour=https%3A%2F%2Fexemple.com%2Fdiagnostic-france.html",
"?retour=%2F%2Fexemple.com",
"?retour=dashboard.html"
]) assert.equal(retourSur(piege), "", piege);
// La page ouverte sans session.
assert.equal(retourDepuisPage("/diagnostic-pays.html", "?d=Maroc"), "diagnostic-pays.html?d=maroc");
assert.equal(retourDepuisPage("/diagnostic-france.html", ""), "diagnostic-france.html");
assert.equal(retourDepuisPage("/diagnostic-pays.html", "?d=atlantide"), "");
assert.equal(retourDepuisPage("/espace-bourse.html", ""), "");
// Inconnu : l'inscription ; déjà venu : la connexion. Chacune porte le retour.
assert.equal(pageDeCompte("diagnostic-pays.html?d=maroc", false), "inscription.html?retour=diagnostic-pays.html%3Fd%3Dmaroc");
assert.equal(pageDeCompte("diagnostic-france.html", true), "login.html?retour=diagnostic-france.html");
// Ce que la page de compte lui dit.
assert.match(phraseDeRetour("diagnostic-pays.html?d=maroc", "inscription"), /^Votre diagnostic Maroc est gratuit\. Créez votre compte/);
assert.match(phraseDeRetour("diagnostic-france.html", "connexion"), /^Votre diagnostic France s'ouvre dès la connexion/);
assert.equal(phraseDeRetour("payment.html?plan=essentiel", "inscription"), "");
assert.deepEqual(Object.keys(NOMS_DESTINATIONS).sort(), [...DESTINATIONS_RETOUR].sort());
});

test("115 — sans session, la page de diagnostic envoie au compte AVEC le retour ; tout compte l'ouvre", () => {
const shell = lire("js/app-shell.js");
assert.match(shell, /import \{ retourDepuisPage, pageDeCompte \} from "\.\/retour-apres-compte\.js";/);
assert.match(shell, /window\.location\.replace\(retour \? pageDeCompte\(retour, connu\) : "login\.html"\);/);
assert.match(shell, /if \(espace && !ouvertATous && !espaceAutorise\(/);
for (const f of ["js/diagnostic-pays-page.js", "js/diagnostic-france-page.js"]) {
assert.ok(lire(f).includes('bootstrapShell({ espace: "preinscription", ouvertATous: true })'), f);
}
// Seules ces deux pages sont ouvertes à tous.
const pages = ["espace-preinscription.js", "dashboard.js", "js/aiguillage.js", "applications.js", "documents.js", "profile.js"];
for (const f of pages) {
let src = "";
try { src = lire(f); } catch { continue; }
assert.ok(!/ouvertATous/.test(src), `${f} ne doit pas s'ouvrir à tous`);
}
// Les pages de compte le disent au visiteur.
assert.match(lire("inscription.js"), /phraseDeRetour\(RETOUR, "inscription"\)/);
assert.match(lire("login.js"), /phraseDeRetour\(RETOUR, "connexion"\)/);
// Le message d'enregistrement ne parle de « route » qu'à qui en a une.
assert.match(lire("js/diagnostic-pays-page.js"), /sauvegarde\.textContent = possede\n\? "Diagnostic enregistré dans votre dossier : l'étape 2 de votre route est faite\."\n: "Diagnostic enregistré dans votre compte : vous le retrouverez sur l'accueil de votre espace/);
});

test("115 — l'accueil d'un compte gratuit montre ses diagnostics de préinscription", () => {
const u = {
diagnosticFrance: { recevabilite: { etat: "pas-encore" }, calculeLe: "2026-09-20T10:00:00.000Z" },
diagnosticsPays: {
maroc: { recevabilite: { etat: "lancer" }, calculeLe: "2026-09-26T08:00:00.000Z" },
allemagne: { recevabilite: { etat: "lancer-si" }, calculeLe: "2026-09-25T08:00:00.000Z" },
atlantide: { recevabilite: { etat: "lancer" }, calculeLe: "2026-09-26T09:00:00.000Z" },
canada: null
}
};
const liste = diagnosticsPreinscription(u);
assert.deepEqual(liste.map((d) => d.id), ["maroc", "allemagne", "france"], "du plus récent au plus ancien, destinations connues seulement");
assert.equal(liste[0].href, "diagnostic-pays.html?d=maroc");
assert.equal(liste[2].href, "diagnostic-france.html");
assert.equal(liste[0].libelle, LIBELLES_VERDICT.lancer);
assert.equal(liste[0].date, "26 septembre 2026");
assert.equal(liste[0].nom, "Maroc");
assert.deepEqual(diagnosticsPreinscription({}), []);
assert.deepEqual(diagnosticsPreinscription(null), []);

const html = lire("dashboard.html");
const accueil = html.slice(html.indexOf('id="accueilMinimal"'), html.indexOf("</main>"));
const iDiag = accueil.indexOf('id="accueilDiagBtn"');
const iPre = accueil.indexOf('id="accueilPreinscription"');
const iCompte = accueil.indexOf('href="profile.html"');
assert.ok(iDiag > 0 && iDiag < iPre && iPre < iCompte, "bourses, puis préinscription, puis le compte");
assert.deepEqual([...accueil.matchAll(/jy-phase-num">(\d{2})</g)].map((m) => m[1]), ["01", "02", "03", "04"]);
const js = lire("js/aiguillage.js");
assert.match(js, /brancherDiagnosticsPreinscription\(session\.userData\);/);
const bloc = js.slice(js.indexOf("function brancherDiagnosticsPreinscription"), js.indexOf("const formaterPrix"));
assert.ok(bloc.length > 200 && !/innerHTML/.test(bloc), "construit en textContent");
});
