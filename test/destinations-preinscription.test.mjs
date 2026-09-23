/**
* ============================================================
* LES SIX DESTINATIONS DE PLUS (2026-09-23)
* ============================================================
*
* « Finir les pays restants comme on l'a fait avec la France » : la
* Roumanie, la Turquie, le Maroc, l'Italie, l'Allemagne et le Canada
* sont vendus le même jour, aux prix de la grille France, chacun avec
* son dossier (users/{uid}.preinscriptionsPays.<pays>).
*
* Ce fichier tient CINQ endroits qui doivent dire la même chose :
*   js/destinations-preinscription.js  la config de chaque pays
*   pricing-plans.js                   le nombre de vœux vendu
*   firestore.rules                    les créneaux pre-<code>-N
*   functions/lib/achat.js             les destinations vendues
*   js/plan-features.js                les noms des libellés
* Puis : la route, le diagnostic, l'achat, la page.
* ============================================================
*/

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createRequire } from "node:module";
import vm from "node:vm";

import {
DESTINATIONS_ACCOMPAGNEES, DESTINATIONS_VENDUES, PREFIXES_VOEU, DESTINATIONS, DIAGNOSTICS,
destination, enClairDe, idDestinationDuPays, questionLangue
} from "../js/destinations-preinscription.js";
import { construireRoutePays, questionsSituationPays, situationCompletePays } from "../js/route-destination.js";
import { calculerDiagnosticPays, devisesDeSaisie, formatMontant, convertir } from "../js/diagnostic-pays.js";
import { trouverProcedure } from "../js/procedures/index.js";
import { defautsDesEnClair } from "../js/route-preinscription.js";
import { PAYS, estOuverte, pageDeDestination } from "../js/pays-preinscription.js";
import {
droitsPreinscription, planPreinscriptionPour, resolvePlanPreinscription, resolvePlanPreinscriptionFrance,
NOMS_DESTINATIONS_PREINSCRIPTION, libelleOffrePreinscription, libellePreinscriptionDuCompte,
destinationDeLAdresse, paysDeLAdresse
} from "../js/plan-features.js";
import { DESTINATIONS_RETOUR, retourSur } from "../js/retour-apres-compte.js";
import { piecesDuDossierPays, ETAPE_REPONSE_ETABLISSEMENT } from "../js/route-destination.js";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(join(racine, f), "utf8").replace(/\r\n/g, "\n");
const require = createRequire(import.meta.url);
const achat = require(join(racine, "functions/lib/achat.js"));

function chargerGrille() {
const bac = { window: {}, console };
bac.window.window = bac.window;
vm.createContext(bac);
vm.runInContext(lire("pricing-plans.js"), bac);
return bac.window;
}
const W = chargerGrille();

const procedureDe = (id) => trouverProcedure({ paysDestination: destination(id).nom });
const JOUR = 86400000;
const futur = (jours = 30) => new Date(Date.now() + jours * JOUR).toISOString();
const passe = (jours = 1) => new Date(Date.now() - jours * JOUR).toISOString();

// ------------------------------------------------------------------
// 1. LES MIROIRS
// ------------------------------------------------------------------

test("les six destinations, dans le même ordre partout", () => {
assert.deepEqual(DESTINATIONS_ACCOMPAGNEES, ["roumanie", "turquie", "maroc", "italie", "allemagne", "canada"]);
assert.deepEqual(DESTINATIONS_VENDUES, ["france", ...DESTINATIONS_ACCOMPAGNEES]);
assert.deepEqual(Object.keys(DESTINATIONS), DESTINATIONS_ACCOMPAGNEES);
assert.deepEqual(Object.keys(DIAGNOSTICS), DESTINATIONS_ACCOMPAGNEES);
assert.deepEqual(Object.keys(PREFIXES_VOEU), DESTINATIONS_ACCOMPAGNEES);
// Le serveur vend les mêmes.
assert.deepEqual(achat.DESTINATIONS_VENDUES, DESTINATIONS_VENDUES);
// Le retour après création de compte accepte les mêmes, et rien d'autre.
assert.deepEqual(DESTINATIONS_RETOUR, DESTINATIONS_VENDUES);
assert.equal(retourSur("?retour=payment.html%3Fplan%3Ddossier-france%26destination%3Dcanada"), "payment.html?plan=dossier-france&destination=canada");
// Les libellés du site nomment les mêmes.
assert.deepEqual(Object.keys(NOMS_DESTINATIONS_PREINSCRIPTION), DESTINATIONS_VENDUES);
for (const id of DESTINATIONS_ACCOMPAGNEES) {
assert.equal(NOMS_DESTINATIONS_PREINSCRIPTION[id], destination(id).nom);
assert.equal(idDestinationDuPays(destination(id).nom), id);
}
// Et la carte des pays : chaque destination y est, ouverte.
for (const id of DESTINATIONS_VENDUES) {
const p = PAYS.find((x) => x.id === id);
assert.ok(p, `${id} absent de js/pays-preinscription.js`);
assert.equal(estOuverte(p), true, `${id} n'est pas ouvert à la vente`);
}
});

test("le nombre de vœux vendu est celui de la route (pricing-plans.js ↔ config)", () => {
const offre = W.SCHOLARBRIDGE_DESTINATIONS;
assert.deepEqual(Object.keys(offre), DESTINATIONS_ACCOMPAGNEES);
for (const id of DESTINATIONS_ACCOMPAGNEES) {
assert.equal(offre[id].voeux, destination(id).plafondVoeux, `${id} : ${offre[id].voeux} vœux vendus, ${destination(id).plafondVoeux} dans la route`);
assert.equal(offre[id].nom, destination(id).nom);
// Même prix que la France, pour les trois offres.
for (const plan of ["diagnostic-france", "dossier-france", "dossier-france-conseiller"]) {
const o = W.offrePourDestination(plan, id);
assert.equal(o.priceFCFA, W.SCHOLARBRIDGE_PLANS[plan].priceFCFA, `${id} ${plan} : prix différent de la France`);
assert.ok(o.label.includes(destination(id).nom), `${id} ${plan} : « ${o.label} » ne nomme pas le pays`);
assert.ok(!o.label.includes("France"), `${id} ${plan} : « ${o.label} » nomme la France`);
}
assert.equal(W.offrePourDestination("dossier-france", id).maxPreinscriptions, destination(id).plafondVoeux);
}
// Jamais de mutation de la grille : la France reste la France.
assert.equal(W.SCHOLARBRIDGE_PLANS["dossier-france"].label, "Dossier France");
assert.equal(W.offrePourDestination("dossier-france", "france"), W.SCHOLARBRIDGE_PLANS["dossier-france"]);
});

test("les créneaux des règles : pre-<code>-1 à pre-<code>-<plafond>, pas un de plus", () => {
const regles = lire("firestore.rules");
for (const id of DESTINATIONS_ACCOMPAGNEES) {
const prefixe = PREFIXES_VOEU[id];
assert.equal(prefixe, `pre-${destination(id).code}`);
const m = new RegExp(`motifPays\\(uid, '${id}', '([^']+)'\\)`).exec(regles);
assert.ok(m, `${id} : aucun motif dans preSlotPatternPays`);
const motif = new RegExp(`^(?:${m[1]})$`);
const plafond = destination(id).plafondVoeux;
for (let n = 1; n <= plafond; n++) assert.ok(motif.test(`${prefixe}-${n}`), `${id} : ${prefixe}-${n} refusé par les règles`);
assert.ok(!motif.test(`${prefixe}-${plafond + 1}`), `${id} : ${prefixe}-${plafond + 1} accepté par les règles`);
assert.ok(!motif.test(`${prefixe}-0`), `${id} : ${prefixe}-0 accepté`);
assert.ok(!motif.test(`pre-${plafond}`), `${id} : le motif accepte un créneau France`);
// Les trois fonctions qui listent les pays les listent tous.
for (const fonction of ["aUnDossierPays", "conseillerPays", "diagnosticPays"]) {
const corps = regles.slice(regles.indexOf(`function ${fonction}(uid)`), regles.indexOf("}", regles.indexOf(`function ${fonction}(uid)`)));
assert.ok(corps.includes(`'${id}'`), `${fonction} oublie ${id}`);
}
}
// Le champ est réservé au webhook, comme planPreinscription.
assert.match(regles, /function champsFormule\(\) \{\s*return \[[^\]]*"preinscriptionsPays"/);
// Et la création d'un vœu préinscription accepte les deux espaces d'identifiants.
assert.ok(regles.includes("applicationId.matches(preSlotPattern(uid)) || applicationId.matches(preSlotPatternPays(uid))"));
});

// ------------------------------------------------------------------
// 2. LES TEXTES
// ------------------------------------------------------------------

test("chaque étape officielle a son titre simple et son « en clair », sans fait de pays", () => {
for (const id of DESTINATIONS_ACCOMPAGNEES) {
const procedure = procedureDe(id);
assert.ok(procedure && procedure.etapes.length >= 8, `${id} : procédure introuvable ou trop courte`);
const lignes = procedure.etapes.map((e) => {
const c = enClairDe(id, e.id);
assert.ok(c && c.titre && c.enClair, `${id} : ${e.id} sans « en clair »`);
return { id: `${id}/${e.id}`, enClair: c.enClair };
});
assert.deepEqual(defautsDesEnClair(lignes), [], `${id} : des « en clair » portent un fait de pays`);
}
});

test("la situation : huit questions, dont la langue du pays sous sa propre clé", () => {
for (const id of DESTINATIONS_ACCOMPAGNEES) {
const qs = questionsSituationPays(id);
assert.equal(qs.length, 8, `${id} : ${qs.length} questions`);
assert.equal(new Set(qs.map((q) => q.cle)).size, 8);
assert.ok(qs.some((q) => q.cle === `situationLangue_${id}`), `${id} : pas de question de langue propre`);
assert.deepEqual(questionLangue(id).options, ["etudes_dans_la_langue", "test_passe", "test_prevu", "aucun"]);
// Le budget s'écrit en F CFA avec une espace insécable (règle du site).
assert.ok(!qs.some((q) => /F CFA/.test(`${q.exemple || ""}${q.aide || ""}`)), `${id} : « F CFA » avec une espace ordinaire`);
}
const profil = {};
for (const q of questionsSituationPays("italie")) profil[q.cle] = "x";
assert.equal(situationCompletePays("italie", profil).pret, true);
// La réponse de langue d'un autre pays ne compte pas pour celui-ci.
delete profil.situationLangue_italie;
profil.situationLangue_canada = "test_passe";
assert.equal(situationCompletePays("italie", profil).pret, false);
});

// ------------------------------------------------------------------
// 3. LA ROUTE
// ------------------------------------------------------------------

test("la route de chaque pays : situation, ressources, vœux, la procédure, le départ", () => {
for (const id of DESTINATIONS_ACCOMPAGNEES) {
const d = destination(id);
const procedure = procedureDe(id);
const route = construireRoutePays({ id, procedure });
assert.ok(route, `${id} : pas de route`);
assert.deepEqual(route.etapes.slice(0, 3).map((e) => e.id), ["situation", "ressources", "voeux"]);
assert.equal(route.etapes.at(-1).id, "depart");
route.etapes.forEach((e, i) => assert.equal(e.numero, i + 1));
assert.equal(route.total, route.etapes.length);
assert.equal(route.courante.id, "situation");
// Le diagnostic ouvre la page du pays.
assert.equal(route.etapes[1].outils[0].href, `diagnostic-pays.html?d=${id}`);
// Chaque étape de dépôt et l'étape des réponses existent dans la procédure.
for (const dep of d.etapesDepot) {
const e = route.etapes.find((x) => x.id === dep);
assert.ok(e, `${id} : étape de dépôt ${dep} absente`);
assert.equal(e.depot, true);
assert.equal(e.preuve.requise, true, `${id} : ${dep} n'exige aucune preuve`);
}
assert.equal(route.etapes.find((x) => x.id === d.etapeReponses).kind, "reponses");
// Les lettres de motivation : juste avant le premier dépôt, sauf au Maroc.
const iMotiv = route.etapes.findIndex((x) => x.kind === "motivations");
if (d.motivations) {
assert.ok(iMotiv > 2, `${id} : pas d'étape motivations`);
assert.equal(route.etapes[iMotiv + 1].depot, true, `${id} : les lettres ne précèdent pas le dépôt`);
assert.ok(!route.etapes.slice(0, iMotiv).some((x) => x.depot), `${id} : un dépôt avant les lettres`);
} else {
assert.equal(iMotiv, -1, `${id} : des lettres de motivation qui ne sont pas demandées`);
}
// Seules les étapes officielles sont « ne me concerne pas » — ni le choix
// de voie, ni un dépôt (sans lui, les réponses ne se noteraient plus).
for (const e of route.etapes) {
assert.equal(e.ignorable, !!e.officielle && e.kind !== "voie" && !e.depot, `${id} : ${e.id} ignorable à tort`);
}
}
});

test("un geste fait avancer la route ; une étape qui ne concerne pas compte comme réglée", () => {
const id = "italie";
const procedure = procedureDe(id);
const profile = {};
for (const q of questionsSituationPays(id)) profile[q.cle] = "x";
const voeux = [{ id: "pre-it-1", university: "Università di Pisa", formation: "Laurea", status: "a_preparer", destination: "italie", motivation: { faite: false } }];
const base = { id, procedure, profile, voeux, diagnostic: { etatVerdict: "atteint", verdict: "ok" } };

let route = construireRoutePays(base);
assert.ok(["situation", "ressources", "voeux"].every((x) => route.etapes.find((e) => e.id === x).faite));

assert.ok(route.courante.officielle, "la première étape non faite est une étape officielle");
// Une étape de procédure cochée, sa preuve donnée : faite.
const suivante = route.etapes.find((e) => e.kind === "procedure" && !e.faite);
route = construireRoutePays({ ...base, dossier: { etapes: { [suivante.id]: { faite: true, preuve: "x" } } } });
assert.equal(route.etapes.find((e) => e.id === suivante.id).faite, true);
// Une liste de pièces se règle pièce par pièce : toutes cochées, faite.
const pieces = route.etapes.find((e) => e.kind === "pieces");
const cochees = Object.fromEntries(pieces.pieces.map((p) => [p.slug, true]));
route = construireRoutePays({ ...base, dossier: { pieces: cochees } });
assert.equal(route.etapes.find((e) => e.id === pieces.id).faite, true);

// « Ne me concerne pas » : réglée, sans preuve, sans geste.
route = construireRoutePays({ ...base, dossier: { etapes: { it_soumission: { nonConcerne: true } } } });
const soumission = route.etapes.find((e) => e.id === "it_soumission");
assert.equal(soumission.faite, true);
assert.equal(soumission.preuve.requise, false);

// Le dépôt exige sa preuve : cochée sans preuve, elle n'est pas faite.
route = construireRoutePays({ ...base, dossier: { etapes: { it_soumission: { faite: true, preuve: "" } } } });
assert.equal(route.etapes.find((e) => e.id === "it_soumission").faite, false);

// Italie : un seul cours. Deux vœux = un avertissement.
route = construireRoutePays({ ...base, voeux: [...voeux, { ...voeux[0], id: "pre-it-2" }] });
assert.equal(route.avertissementsVoeux.length, 1);
});

test("Turquie et Maroc : la voie choisie retire les étapes des autres voies", () => {
for (const id of ["turquie", "maroc"]) {
const d = destination(id);
const procedure = procedureDe(id);
const toutes = construireRoutePays({ id, procedure });
const choix = toutes.etapes.find((e) => e.kind === "voie");
assert.ok(choix, `${id} : pas d'étape de choix de voie`);
assert.equal(choix.id, d.voies.etape);
assert.equal(choix.faite, false);
assert.deepEqual(choix.voie.options.map((o) => o.id), d.voies.options.map((o) => o.id));
// Chaque étape nommée par une voie existe dans la procédure.
for (const o of d.voies.options) {
for (const e of o.etapes) assert.ok(procedure.etapes.some((x) => x.id === e), `${id}/${o.id} : ${e} n'existe pas`);
// Toute voie a son dépôt : sans lui, ses vœux ne passeraient jamais « déposés ».
assert.ok(o.etapes.some((e) => d.etapesDepot.includes(e)), `${id}/${o.id} : aucune étape de dépôt`);
}
for (const o of d.voies.options) {
const route = construireRoutePays({ id, procedure, dossier: { voie: o.id } });
assert.equal(route.voie, o.id);
assert.equal(route.etapes.find((e) => e.kind === "voie").faite, true);
const ids = new Set(route.etapes.map((e) => e.id));
for (const autre of d.voies.options.filter((x) => x.id !== o.id)) {
for (const e of autre.etapes.filter((x) => !o.etapes.includes(x))) assert.ok(!ids.has(e), `${id}/${o.id} : ${e} reste dans la route`);
}
for (const e of o.etapes) assert.ok(ids.has(e), `${id}/${o.id} : ${e} manque`);
assert.ok(route.total < toutes.total);
route.etapes.forEach((e, i) => assert.equal(e.numero, i + 1));
// Les lettres suivent la voie : avant SON dépôt.
if (d.motivations) {
const i = route.etapes.findIndex((x) => x.kind === "motivations");
assert.equal(route.etapes[i + 1].depot, true, `${id}/${o.id} : les lettres ne précèdent pas le dépôt de la voie`);
}
// La voie choisie vient juste après le choix, dans l'ordre officiel
// (les lettres de motivation, glissées avant le dépôt, mises à part).
const iChoix = route.etapes.findIndex((e) => e.kind === "voie");
const siennes = route.etapes.slice(iChoix + 1).filter((e) => e.kind !== "motivations").slice(0, o.etapes.length).map((e) => e.id);
assert.deepEqual(siennes, procedure.etapes.filter((e) => o.etapes.includes(e.id)).map((e) => e.id), `${id}/${o.id} : la voie ne suit pas le choix`);
// Et chaque voie a de quoi noter ses réponses.
assert.ok(route.etapes.some((e) => e.kind === "reponses"), `${id}/${o.id} : aucune étape de réponse`);
}
// Une voie inconnue ne retire rien.
assert.equal(construireRoutePays({ id, procedure, dossier: { voie: "inventee" } }).total, toutes.total);
}
});

// ------------------------------------------------------------------
// 4. LE DIAGNOSTIC — de l'arithmétique, aucun taux de change
// ------------------------------------------------------------------

test("le diagnostic de chaque pays rend un verdict, des lignes sourcées et un total", () => {
for (const id of DESTINATIONS_ACCOMPAGNEES) {
const r = calculerDiagnosticPays(id, { ressourcesMensuelles: 0, devise: "XOF" });
assert.ok(r, `${id} : aucun diagnostic`);
assert.ok(["atteint", "manque", "a-comparer", "sans-seuil"].includes(r.verdict.etat));
assert.ok(r.verdict.phrase.length > 20);
assert.ok(r.lignes.length >= 2, `${id} : moins de deux lignes`);
for (const l of r.lignes) assert.ok(l.source === "" || /^https:\/\//.test(l.source), `${id} : source douteuse ${l.source}`);
assert.ok(r.lignes.filter((l) => l.source).length >= 2, `${id} : pas assez de sources`);
assert.ok(r.totalTexte.length > 0, `${id} : pas de total`);
// Une espace insécable dans « F CFA », partout.
const tout = JSON.stringify(r);
assert.ok(!/F CFA/.test(tout), `${id} : « F CFA » avec une espace ordinaire`);
}
assert.equal(calculerDiagnosticPays("atlantide", {}), null);
});

test("le verdict ne compare que ce qui se compare sans taux", () => {
// Maroc et Turquie : aucun seuil publié.
assert.equal(calculerDiagnosticPays("maroc", { ressourcesMensuelles: 1e9 }).verdict.etat, "sans-seuil");
assert.equal(calculerDiagnosticPays("turquie", { ressourcesMensuelles: 1e9 }).verdict.etat, "sans-seuil");
// Italie et Allemagne : un seuil en euros, comparable au F CFA (parité fixe).
for (const id of ["italie", "allemagne"]) {
assert.equal(calculerDiagnosticPays(id, { ressourcesMensuelles: 1e9, devise: "XOF" }).verdict.etat, "atteint");
assert.equal(calculerDiagnosticPays(id, { ressourcesMensuelles: 1, devise: "XOF" }).verdict.etat, "manque");
}
// Canada : un seuil en dollars canadiens. En F CFA, on ne devine pas.
assert.equal(calculerDiagnosticPays("canada", { ressourcesMensuelles: 1e9, devise: "XOF" }).verdict.etat, "a-comparer");
assert.equal(calculerDiagnosticPays("canada", { ressourcesMensuelles: 1e9, devise: "CAD" }).verdict.etat, "atteint");
assert.ok(devisesDeSaisie("canada").includes("CAD"));
assert.equal(convertir(100, "CAD", "EUR"), null);
assert.equal(Math.round(convertir(655.957, "XOF", "EUR") * 1000) / 1000, 1);
assert.equal(formatMontant(600000, "XOF"), "600 000 F CFA");
// Le Québec a son propre seuil : la variante change la comparaison.
const f = DIAGNOSTICS.canada;
if (f.variante) {
const hors = calculerDiagnosticPays("canada", { ressourcesMensuelles: 0, devise: "CAD" });
const qc = calculerDiagnosticPays("canada", { ressourcesMensuelles: 0, devise: "CAD", variante: f.variante.id });
assert.equal(qc.variante, f.variante.id);
assert.notEqual(qc.verdict.phrase, hors.verdict.phrase);
}
});

// ------------------------------------------------------------------
// 5. L'ACHAT — un dossier par pays, la France intacte
// ------------------------------------------------------------------

test("acheter un dossier hors France écrit preinscriptionsPays.<pays>, jamais planPreinscription", () => {
const maintenant = new Date("2026-09-23T10:00:00Z");
const SUPPRIMER = { supprimer: true };
const r = achat.calculerMiseAJour({ planId: "dossier-france", user: {}, maintenant, supprimer: SUPPRIMER, destination: "italie" });
assert.equal(r.statut, "applique");
assert.equal(r.misAJour.planPreinscription, undefined);
assert.equal(r.misAJour.preinscriptionsPays.italie.plan, "dossier-france");
const fin = new Date(r.misAJour.preinscriptionsPays.italie.expiresAt);
assert.equal(fin.getUTCFullYear(), 2027);
assert.equal(fin.getUTCMonth(), 8, "un dossier dure douze mois");
assert.deepEqual(Object.keys(r.misAJour.preinscriptionsPays), ["italie"], "les autres pays ne sont pas touchés");

// La France reste la France.
const fr = achat.calculerMiseAJour({ planId: "dossier-france", user: {}, maintenant, supprimer: SUPPRIMER });
assert.equal(fr.misAJour.planPreinscription, "dossier-france");
assert.equal(fr.misAJour.preinscriptionsPays, undefined);

// Le diagnostic du pays : daté, pour la déduction.
const dg = achat.calculerMiseAJour({ planId: "diagnostic-france", user: {}, maintenant, supprimer: SUPPRIMER, destination: "maroc" });
assert.equal(dg.misAJour.preinscriptionsPays.maroc.plan, "diagnostic-france");
assert.equal(dg.misAJour.preinscriptionsPays.maroc.diagnosticPayeLe, maintenant.toISOString());

// Descendre d'offre dans un pays : refusé ; un autre pays : libre.
const user = { preinscriptionsPays: { italie: { plan: "dossier-france-conseiller", expiresAt: "2027-09-23T00:00:00.000Z" } } };
assert.equal(achat.calculerMiseAJour({ planId: "diagnostic-france", user, maintenant, supprimer: SUPPRIMER, destination: "italie" }).statut, "rang-inferieur");
assert.equal(achat.calculerMiseAJour({ planId: "diagnostic-france", user, maintenant, supprimer: SUPPRIMER, destination: "canada" }).statut, "applique");
});

test("la déduction du diagnostic vaut pour le dossier DU MÊME PAYS", () => {
const maintenant = new Date("2026-09-23T10:00:00Z");
const user = { preinscriptionsPays: { maroc: { plan: "diagnostic-france", expiresAt: "2026-10-01T00:00:00.000Z", diagnosticPayeLe: "2026-09-20T10:00:00.000Z" } } };
assert.equal(achat.prixAvecDeduction("dossier-france", user, maintenant, "maroc").deduction, 10000);
assert.equal(achat.prixAvecDeduction("dossier-france", user, maintenant, "italie").deduction, 0);
assert.equal(achat.prixAvecDeduction("dossier-france", user, maintenant, "france").deduction, 0);
});

test("le même dossier dans le même pays est refusé ; les destinations inconnues aussi", () => {
const maintenant = new Date("2026-09-23T10:00:00Z");
const user = { preinscriptionsPays: { canada: { plan: "dossier-france", expiresAt: "2027-09-23T00:00:00.000Z" } } };
const refus = achat.refusAchat({ planId: "dossier-france", user, maintenant, destination: "canada" });
assert.equal(refus.code, "meme-dossier");
assert.match(refus.message, /Dossier Canada/);
assert.equal(achat.refusAchat({ planId: "dossier-france", user, maintenant, destination: "turquie" }), null);
assert.equal(achat.destinationVendue("italie"), true);
assert.equal(achat.destinationVendue("atlantide"), false);
assert.equal(achat.destinationVendue(undefined), true, "absente = France");
assert.equal(achat.libelleOffre("dossier-france-conseiller", "allemagne"), "Dossier Allemagne + Conseiller");
});

test("les droits du compte : un dossier par pays, la France lue à part", () => {
const userData = {
planPreinscription: "diagnostic-france", planPreinscriptionExpiresAt: futur(10),
preinscriptionsPays: {
italie: { plan: "dossier-france", expiresAt: futur(300) },
canada: { plan: "dossier-france-conseiller", expiresAt: passe(2) },
maroc: { plan: "inventee", expiresAt: futur(300) },
turquie: { plan: "dossier-france" }
}
};
assert.deepEqual(droitsPreinscription(userData).map((d) => d.destination), ["france", "italie"]);
assert.equal(planPreinscriptionPour(userData, "italie"), "dossier-france");
assert.equal(planPreinscriptionPour(userData, "canada"), "", "expiré");
assert.equal(planPreinscriptionPour(userData, "turquie"), "", "sans échéance");
assert.equal(resolvePlanPreinscriptionFrance(userData), "diagnostic-france");
// Les droits (outils) : la meilleure offre de tous les pays.
assert.equal(resolvePlanPreinscription(userData), "dossier-france");
// Le libellé : au nom du pays de cette offre.
assert.equal(libellePreinscriptionDuCompte(userData), "Dossier Italie");
assert.equal(libelleOffrePreinscription("diagnostic-france", "maroc"), "Diagnostic Maroc");
assert.equal(libelleOffrePreinscription("dossier-france", "france"), "Dossier France");
assert.equal(libellePreinscriptionDuCompte({}), "");
});

// ------------------------------------------------------------------
// 6. LES PAGES
// ------------------------------------------------------------------

test("chaque destination a sa page, indexée, et son espace", () => {
for (const id of DESTINATIONS_ACCOMPAGNEES) {
const page = pageDeDestination({ id });
assert.equal(page, `preinscription-${id}.html`);
assert.ok(existsSync(join(racine, page)), `${page} manque`);
const html = lire(page);
assert.ok(html.includes(`data-destination="${id}"`), `${page} : data-destination`);
assert.ok(html.includes(`rel="canonical" href="https://fitzuniverse.com/${page}"`), `${page} : canonique`);
assert.ok(html.includes(`property="og:url" content="https://fitzuniverse.com/${page}"`), `${page} : og:url`);
assert.ok(html.includes(`assets/flags/${destination(id).code}.svg`), `${page} : drapeau`);
assert.ok(!/<title>[^<]*France/.test(html), `${page} : le titre nomme la France`);
assert.ok(lire("sitemap.xml").includes(`https://fitzuniverse.com/${page}`), `${page} absente du sitemap`);
}
});

test("l'espace préinscription sert les sept destinations sans toucher la France", () => {
const js = lire("espace-preinscription.js");
// La destination se lit dans l'adresse, et chaque pays a son champ.
assert.ok(js.includes('params.get("d")'));
assert.ok(js.includes("`dossiersPays.${etat.destination}`"));
assert.ok(js.includes('estFrance() ? "pre" : PREFIXES_VOEU[etat.destination]'), "le créneau suit le pays");
assert.ok(js.includes("payload.destination = etat.destination"), "le vœu porte son pays");
// La France garde son champ, son quota et ses vœux sans `destination`.
assert.ok(js.includes('"dossierFrance"'));
assert.ok(js.includes("resolvePlanPreinscriptionFrance(etat.userData)"), "le quota France se lit sur l'offre France seule");
assert.ok(js.includes('!app.destination || app.destination === "france"'));
// Un pays non acheté ne s'ouvre pas.
assert.ok(js.includes("peindreSansDossier()"));
// Aucun total d'étapes écrit en dur dans la peinture.
assert.ok(!/\$\{TOTAL_ETAPES\}/.test(js), "le total d'étapes doit venir de la route");
const html = lire("espace-preinscription.html");
assert.ok(html.includes('id="rtDestinations"'));
// Le diagnostic du pays : sa page existe et n'est pas indexée.
assert.ok(lire("diagnostic-pays.html").includes('name="robots" content="noindex"'));
});

test("un outil Fitz ouvert depuis la route d'un pays apprend ce pays", () => {
assert.equal(destinationDeLAdresse("?d=italie"), "italie");
assert.equal(destinationDeLAdresse("?applicationId=pre-it-1&d=Italie"), "italie");
assert.equal(destinationDeLAdresse("?d=france"), "", "la France reste le défaut, sans paramètre");
assert.equal(destinationDeLAdresse("?d=atlantide"), "");
assert.equal(destinationDeLAdresse(""), "");
assert.equal(paysDeLAdresse("?d=maroc"), "Maroc");
// Les deux outils de rédaction : l'espace dit le pays de la route, et le
// vœu, quand il y en a un, repasse après et gagne.
for (const page of ["ai-letter.js", "ai-email.js"]) {
const src = lire(page);
const i = src.indexOf("paysDeLAdresse(window.location.search)) fieldCountry.value");
assert.ok(i > 0, `${page} : le pays de la route n'est pas lu`);
assert.ok(i < src.indexOf("if (application) applyApplicationContext(application);"), `${page} : le pays de la route écraserait celui du vœu`);
}
// Le contrôle avant dépôt : les pièces de la procédure du pays.
const check = lire("ai-check.js");
assert.ok(check.includes("routePays.piecesDuDossierPays({ id: destinationCheck, procedure, dossier })"));
assert.ok(check.includes("ctx.userData.dossiersPays[destinationCheck]"));
const procedure = procedureDe("allemagne");
const pieces = piecesDuDossierPays({ id: "allemagne", procedure, dossier: { pieces: {} } });
assert.ok(pieces.length >= 3);
assert.equal(new Set(pieces.map((p) => p.slug)).size, pieces.length, "pièces dédoublonnées");
const une = pieces[0].slug;
assert.equal(piecesDuDossierPays({ id: "allemagne", procedure, dossier: { pieces: { [une]: true } } }).find((p) => p.slug === une).obtenue, true);
// Et la route passe le pays à chaque outil qu'elle ouvre.
assert.match(lire("espace-preinscription.js"), /d=\$\{encodeURIComponent\(etat\.destination\)\}/);
});

test("Maroc, voie directe : candidater juste après le choix, et une étape pour noter la réponse", () => {
const procedure = procedureDe("maroc");
for (const voie of ["um6p", "aui"]) {
const route = construireRoutePays({ id: "maroc", procedure, dossier: { voie } });
const ids = route.etapes.map((e) => e.id);
const iChoix = ids.indexOf("ma_porte_entree");
assert.equal(ids[iChoix + 1], `ma_${voie}`, `${voie} : la candidature ne suit pas le choix`);
assert.equal(ids[iChoix + 2], ETAPE_REPONSE_ETABLISSEMENT, `${voie} : pas d'étape de réponse après le dépôt`);
assert.ok(ids.indexOf(`ma_${voie}`) < ids.indexOf("ma_visa"), `${voie} : candidater après le visa`);
const reponse = route.etapes[iChoix + 2];
assert.equal(reponse.kind, "reponses");
assert.equal(reponse.ignorable, false);
assert.deepEqual(defautsDesEnClair([{ id: reponse.id, enClair: reponse.enClair }]), []);
assert.ok(!ids.includes("ma_autorisation"), `${voie} : l'autorisation de l'AMCI n'est pas la sienne`);
}
// La voie AMCI garde son étape officielle, et n'en reçoit pas d'autre.
const amci = construireRoutePays({ id: "maroc", procedure, dossier: { voie: "amci" } });
assert.ok(amci.etapes.some((e) => e.id === "ma_autorisation" && e.kind === "reponses"));
assert.ok(!amci.etapes.some((e) => e.id === ETAPE_REPONSE_ETABLISSEMENT));
});

test("le départ d'un pays est le sien ; un achat abandonné ne change pas le pays du suivant", () => {
const js = lire("espace-preinscription.js");
assert.ok(js.includes("visaChecklist: (etat.dossier && etat.dossier.visaChecklist) || {}"), "la route d'un pays lit son propre départ");
assert.ok(js.includes("[`${champDossier()}.visaChecklist`]: visa"), "la route d'un pays écrit son propre départ");
assert.ok(js.includes("await updateDoc(refUser(), { visaChecklist: visa });"), "la France garde son champ");
// Un Dossier Italie n'ouvre ni la route France, ni le Diagnostic France.
assert.ok(js.includes("if (!planPays && !session.testerAccess) {"));
assert.ok(lire("js/diagnostic-france-page.js").includes("if (ctx.locked || !offreFrance) {"));
// payment.js : la destination gardée ne vaut que pour l'offre gardée ;
// une adresse qui nomme un plan sans pays veut dire la France.
const pay = lire("payment.js");
assert.ok(pay.includes('if (params.get("plan")) return "france";'));
assert.ok(pay.includes("stored.plan === getRequestedPlanId()"));
// « ?d=constructor » n'est pas une destination.
assert.equal(destination("constructor"), null);
assert.equal(destination("__proto__"), null);
assert.equal(destinationDeLAdresse("?d=constructor"), "");
assert.equal(W.offrePourDestination("dossier-france", "constructor"), W.SCHOLARBRIDGE_PLANS["dossier-france"]);
});
