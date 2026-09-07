/**
* ============================================================
* test/grille-a.test.mjs — la révision des paliers bourses
* ============================================================
*
* La grille A remplace le comptage par la profondeur : quatre offres
* bourses en vente (fitzExpress, premier-dossier, essentiel-4,
* conseiller-6), Ambition et Signature retirées, essentiel et
* signature-focus remplacées. LA RÈGLE D'OR : aucun client existant ne
* perd rien — ce sont les tests qui comptent ici. Puis : la messagerie
* selon le parcours, le service après-vente, WhatsApp hors de toute
* offre en vente, le délai à un seul endroit, la cohérence des quatre
* endroits du prix, le refus serveur d'un id déprécié, le routage
* d'offers.html, et les en-têtes des pages catalogue.
* ============================================================
*/

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createRequire } from "node:module";
import vm from "node:vm";

import { PLAN_ORDER, PLAN_LABELS, PLAN_PREINSCRIPTION_ORDER, DEFAULT_FEATURE_CONFIG, PREINSCRIPTION_FEATURE_CONFIG, FEATURE_CATALOG, resolveFeatureFlags, decideVerrou } from "../js/plan-features.js";
import { resoudreVueOffres, urlDuParcours } from "../js/offres-parcours.js";
import { DELAI_REPONSE, DELAI_REPONSE_HEURES } from "../js/delai-reponse.js";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(join(racine, f), "utf8");
const require = createRequire(import.meta.url);
const { GRILLE, RANG, estEnVente, calculerMiseAJour } = require(join(racine, "functions/lib/achat.js"));

function chargerGrille() {
const bacASable = { window: {} };
vm.createContext(bacASable);
vm.runInContext(lire("pricing-plans.js"), bacASable);
return bacASable.window.SCHOLARBRIDGE_PLANS;
}
const OFFRES = chargerGrille();
const regles = lire("firestore.rules");
const offersHtml = lire("offers.html");
const flags = resolveFeatureFlags(null);
const verrou = (planId, featureKey, extra = {}) => decideVerrou({ planId, featureFlags: flags, featureKey, ...extra });

const BOURSES_EN_VENTE = ["fitzExpress", "premier-dossier", "essentiel-4", "conseiller-6"];
const ANCIENS = ["essentiel", "accompagnement", "premium", "signature-focus", "signature"];
const enVente = Object.values(OFFRES).filter((o) => o.deprecated !== true);

// ------------------------------------------------------------------
// La grille
// ------------------------------------------------------------------

test("côté bourses, exactement 4 offres non dépréciées ; aucune ne dépasse un quota de 6", () => {
const bourses = enVente.filter((o) => o.parcours === "bourse").map((o) => o.id);
assert.deepEqual(bourses.sort(), [...BOURSES_EN_VENTE].sort());
for (const id of bourses) {
const q = OFFRES[id].maxAccompaniedApplications;
if (q !== undefined) assert.ok(Number.isFinite(q) && q <= 6, `${id} : quota ${q}`);
}
assert.equal(OFFRES["essentiel-4"].maxAccompaniedApplications, 4);
assert.equal(OFFRES["conseiller-6"].maxAccompaniedApplications, 6);
assert.equal(OFFRES["essentiel-4"].priceFCFA, 45000);
assert.equal(OFFRES["conseiller-6"].priceFCFA, 150000);
assert.equal(OFFRES["essentiel-4"].duration, "6 mois");
assert.equal(OFFRES["conseiller-6"].duration, "9 mois");
assert.equal(OFFRES["essentiel-4"].label, "Forfait Essentiel");
assert.equal(OFFRES["conseiller-6"].label, "Forfait Conseiller");
});

test("aucune offre en vente, tous parcours confondus, n'a un quota Infinity", () => {
for (const o of enVente) {
assert.notEqual(o.maxAccompaniedApplications, Infinity, o.id);
assert.notEqual(o.maxPreinscriptions, Infinity, o.id);
}
assert.equal(OFFRES.signature.maxAccompaniedApplications, Infinity, "Signature (dépréciée) garde sa convention pour ses détenteurs");
});

test("Ambition, Signature, essentiel et signature-focus sont dépréciées — premium l'était déjà", () => {
for (const id of ANCIENS) assert.equal(OFFRES[id].deprecated, true, id);
for (const id of BOURSES_EN_VENTE) assert.notEqual(OFFRES[id].deprecated, true, id);
});

test("les offres préinscription du lot B sont intactes : mêmes ids, mêmes prix, mêmes quotas", () => {
assert.deepEqual(PLAN_PREINSCRIPTION_ORDER, ["diagnostic-france", "dossier-france", "dossier-france-conseiller"]);
assert.equal(OFFRES["diagnostic-france"].priceFCFA, 10000);
assert.equal(OFFRES["dossier-france"].priceFCFA, 75000);
assert.equal(OFFRES["dossier-france-conseiller"].priceFCFA, 150000);
assert.equal(OFFRES["dossier-france"].maxPreinscriptions, 7);
assert.equal(OFFRES["dossier-france-conseiller"].maxPreinscriptions, 7);
for (const id of PLAN_PREINSCRIPTION_ORDER) assert.notEqual(OFFRES[id].deprecated, true, id);
});

// ------------------------------------------------------------------
// NON-RÉGRESSION — les tests qui comptent
// ------------------------------------------------------------------

test("un compte `essentiel` conserve un quota de 5 ET la messagerie", () => {
assert.equal(OFFRES.essentiel.maxAccompaniedApplications, 5);
assert.equal(OFFRES.essentiel.priceFCFA, 45000);
assert.equal(OFFRES.essentiel.duration, "6 mois");
assert.equal(verrou("essentiel", "student_messaging"), false);
for (const k of ["applications", "ai_letter", "documents", "interview_prep", "support_ticket"]) assert.equal(verrou("essentiel", k), false, k);
});

test("un compte `accompagnement` conserve 9 ; un compte `signature` conserve son quota, la messagerie ET whatsapp_direct", () => {
assert.equal(OFFRES.accompagnement.maxAccompaniedApplications, 9);
assert.equal(OFFRES.accompagnement.priceFCFA, 75000);
assert.equal(verrou("accompagnement", "student_messaging"), false);
assert.equal(OFFRES.signature.maxAccompaniedApplications, Infinity);
assert.equal(verrou("signature", "student_messaging"), false);
assert.equal(verrou("signature", "whatsapp_direct"), false);
assert.equal(verrou("signature", "advisor"), false);
assert.equal(verrou("signature-focus", "advisor"), false);
assert.equal(verrou("signature-focus", "student_messaging"), false);
assert.equal(OFFRES["signature-focus"].maxAccompaniedApplications, 12);
});

test("aucun ancien identifiant n'a disparu : PLAN_ORDER, PLAN_LABELS, chaque drapeau, la GRILLE serveur, les règles", () => {
for (const id of ANCIENS) {
assert.ok(PLAN_ORDER.includes(id), `${id} absent de PLAN_ORDER`);
assert.ok(PLAN_LABELS[id], `${id} sans libellé`);
for (const { key } of FEATURE_CATALOG) assert.equal(typeof DEFAULT_FEATURE_CONFIG[key][id], "boolean", `${key}/${id}`);
assert.ok(regles.includes(`'${id}'`), `${id} absent de firestore.rules`);
}
for (const id of ["essentiel", "accompagnement", "signature-focus", "signature"]) assert.equal(GRILLE[id] && GRILLE[id].deprecated, true, `${id} : GRILLE serveur`);
});

// ------------------------------------------------------------------
// WhatsApp, messagerie, service après-vente
// ------------------------------------------------------------------

test("aucune offre NON dépréciée ne porte whatsapp_direct ; aucune n'en parle dans sa copie", () => {
for (const o of enVente) {
assert.equal(flags.whatsapp_direct[o.id] === true, false, o.id);
assert.ok(!/whatsapp/i.test(JSON.stringify(o)), `${o.id} mentionne WhatsApp`);
}
assert.equal(flags.whatsapp_direct.signature, true);
});

test("student_messaging : les TROIS offres préinscription et la SEULE offre bourse à 150 000 F ; absente de fitzExpress, premier-dossier et du nouvel Essentiel", () => {
for (const id of PLAN_PREINSCRIPTION_ORDER) assert.equal(PREINSCRIPTION_FEATURE_CONFIG.student_messaging[id], true, id);
for (const id of PLAN_PREINSCRIPTION_ORDER) assert.equal(decideVerrou({ planId: "gratuit", planPreinscriptionId: id, featureFlags: flags, featureKey: "student_messaging" }), false, id);
const boursesVendues = enVente.filter((o) => o.parcours === "bourse" && flags.student_messaging[o.id] === true).map((o) => o.id);
assert.deepEqual(boursesVendues, ["conseiller-6"]);
assert.equal(OFFRES["conseiller-6"].priceFCFA, 150000);
assert.equal(verrou("premier-dossier", "student_messaging"), true);
assert.equal(verrou("essentiel-4", "student_messaging"), true);
assert.equal(verrou("gratuit", "student_messaging", { hasFitzExpress: true }), true, "fitzExpress");
});

test("support_ticket : accessible à toute formule payante (Pass compris), à aucune gratuite", () => {
for (const id of PLAN_ORDER.filter((p) => p !== "gratuit")) assert.equal(verrou(id, "support_ticket"), false, id);
for (const id of PLAN_PREINSCRIPTION_ORDER) assert.equal(decideVerrou({ planId: "gratuit", planPreinscriptionId: id, featureFlags: flags, featureKey: "support_ticket" }), false, id);
assert.equal(verrou("gratuit", "support_ticket", { hasFitzExpress: true }), false, "le Pass Découverte a le service après-vente");
assert.equal(verrou("gratuit", "support_ticket"), true);
assert.equal(verrou("gratuit", "student_messaging", { hasFitzExpress: true }), true, "et rien de plus");
assert.ok(FEATURE_CATALOG.some((f) => f.key === "support_ticket"));
});

test("firestore.rules : messagerie resserrée (anciennes formules conservées), supportTickets ouvert au payant, nouveaux quotas ajoutés", () => {
const bloc = (nom) => { const m = regles.match(new RegExp(`function ${nom}\\(uid\\) \\{([\\s\\S]*?)\\n\\}`)); assert.ok(m, nom); return m[1]; };
const messagerie = bloc("isMessagingPlan");
for (const id of ["essentiel", "accompagnement", "premium", "signature-focus", "signature", "conseiller-6"]) assert.ok(messagerie.includes(`'${id}'`), `isMessagingPlan : ${id}`);
assert.ok(!messagerie.includes("'essentiel-4'") && !messagerie.includes("'premier-dossier'"));
const payant = bloc("isPaidPlan");
for (const id of ["essentiel-4", "conseiller-6", ...ANCIENS, "premier-dossier"]) assert.ok(payant.includes(`'${id}'`), `isPaidPlan : ${id}`);
assert.ok(bloc("isSignaturePlan").includes("'conseiller-6'"));
const slot = bloc("slotPattern");
assert.ok(slot.includes(`planOf(uid) == 'essentiel-4' ? 'slot-[1-4]'`));
assert.ok(slot.includes(`planOf(uid) == 'conseiller-6' ? 'slot-[1-6]'`));
assert.ok(slot.includes(`planOf(uid) == 'essentiel' ? 'slot-[1-5]'`), "l'ancien Essentiel garde ses 5 créneaux");
assert.ok(slot.includes(`planOf(uid) == 'signature' ? 'slot-([1-9][0-9]{0,2})'`));
assert.ok(/^slot-\[1-4\]$/.test("slot-[1-4]") && /^slot-[1-4]$/.test("slot-4") && !/^slot-[1-4]$/.test("slot-5"));
assert.ok(/^slot-[1-6]$/.test("slot-6") && !/^slot-[1-6]$/.test("slot-7"));
const tickets = regles.slice(regles.indexOf("match /supportTickets/{ticketId}"), regles.indexOf("match /scholarships/"));
assert.ok(/isPaidPlan\(request\.auth\.uid\) \|\| hasPreinscription\(request\.auth\.uid\) \|\| hasFitzExpressPass\(request\.auth\.uid\)/.test(tickets));
assert.ok(/request\.resource\.data\.status == "nouveau"/.test(tickets));
assert.ok(/allow update: if isAdmin\(\)/.test(tickets));
});

// ------------------------------------------------------------------
// Le délai, à un seul endroit
// ------------------------------------------------------------------

test("aucune chaîne « 24 h » ne subsiste comme délai de réponse ; « 48 h » partout où le délai est annoncé", () => {
assert.equal(DELAI_REPONSE_HEURES, 48);
assert.equal(DELAI_REPONSE, "48 h ouvrées");
for (const f of ["messages.html", "pricing-plans.js", "offers.html", "account.html", "js/student-messages.js", "js/support-ticket.js", "js/ai/fitz-voice.js", "js/fitz-voice.js"]) {
let texte; try { texte = lire(f); } catch { continue; }
assert.ok(!/\b24 ?h\b/.test(texte), `${f} annonce encore 24 h`);
}
assert.ok(lire("messages.html").includes("data-delai-reponse"));
assert.ok(lire("js/messages-page.js").includes("DELAI_REPONSE"));
assert.ok(JSON.stringify(OFFRES["conseiller-6"].highlights).includes(DELAI_REPONSE), "la puce du Conseiller annonce le même délai que js/delai-reponse.js");
assert.ok(JSON.stringify(OFFRES["essentiel-4"].highlights).includes(DELAI_REPONSE));
assert.ok(offersHtml.includes(DELAI_REPONSE));
});

// ------------------------------------------------------------------
// Les quatre endroits du prix
// ------------------------------------------------------------------

test("cohérence pricing-plans.js ↔ GRILLE serveur ↔ PLAN_ORDER ↔ RANG pour les nouveaux ids", () => {
for (const id of ["essentiel-4", "conseiller-6"]) {
assert.ok(GRILLE[id], `${id} absent de la GRILLE serveur`);
assert.equal(GRILLE[id].prix, OFFRES[id].priceFCFA);
assert.equal(GRILLE[id].parcours, "bourse");
assert.ok(PLAN_ORDER.includes(id));
assert.equal(typeof RANG[id], "number");
}
assert.equal(GRILLE["essentiel-4"].dureeMois, 6);
assert.equal(GRILLE["conseiller-6"].dureeMois, 9);
// RANG est le miroir de PLAN_ORDER.
for (const id of PLAN_ORDER) assert.equal(RANG[id], PLAN_ORDER.indexOf(id), `RANG[${id}]`);
assert.ok(RANG["essentiel-4"] < RANG.essentiel && RANG["conseiller-6"] < RANG["signature-focus"], "une nouvelle offre se range sous l'ancienne qu'elle remplace");
});

test("le serveur refuse un achat sur un id déprécié, accepte les nouveaux, et n'écrit jamais un forfait déprécié depuis un achat", () => {
for (const id of ["essentiel", "accompagnement", "signature", "signature-focus"]) assert.equal(estEnVente(id), false, id);
for (const id of BOURSES_EN_VENTE) assert.equal(estEnVente(id), true, id);
assert.equal(estEnVente("premium"), false);
assert.equal(estEnVente("inconnue"), false);
assert.ok(lire("functions/paiement.js").includes("estEnVente(planId)"), "creerPaiement vérifie estEnVente avant de créer la facture");
const r = calculerMiseAJour({ planId: "essentiel-4", user: {}, maintenant: new Date("2026-09-07T12:00:00Z"), supprimer: null });
assert.equal(r.statut, "applique");
assert.equal(r.misAJour.plan, "essentiel-4");
assert.equal(r.misAJour.planExpiresAt.slice(0, 10), "2027-03-07");
// Un client Essentiel (5) encore actif ne peut pas être rétrogradé vers essentiel-4.
const bas = calculerMiseAJour({ planId: "essentiel-4", user: { plan: "essentiel", planExpiresAt: "2027-01-01T00:00:00.000Z" }, maintenant: new Date("2026-09-07T12:00:00Z"), supprimer: null });
assert.equal(bas.statut, "rang-inferieur");
// Le webhook honore encore un paiement Ambition créé avant le retrait.
const enVol = calculerMiseAJour({ planId: "accompagnement", user: {}, maintenant: new Date("2026-09-07T12:00:00Z"), supprimer: null });
assert.equal(enVol.statut, "applique");
assert.equal(enVol.misAJour.plan, "accompagnement");
});

// ------------------------------------------------------------------
// offers.html — routage et copie
// ------------------------------------------------------------------

test("routage : ?parcours=, #<id> (grille du parcours de la formule), alias, ancre inconnue → le choix", () => {
assert.deepEqual(resoudreVueOffres({ search: "?parcours=bourse" }, OFFRES), { parcours: "bourse", cible: null });
assert.deepEqual(resoudreVueOffres({ search: "?parcours=preinscription" }, OFFRES), { parcours: "preinscription", cible: null });
assert.deepEqual(resoudreVueOffres({ hash: "#essentiel" }, OFFRES), { parcours: "bourse", cible: "essentiel" });
assert.deepEqual(resoudreVueOffres({ hash: "#conseiller-6" }, OFFRES), { parcours: "bourse", cible: "conseiller-6" });
assert.deepEqual(resoudreVueOffres({ hash: "#dossier-france" }, OFFRES), { parcours: "preinscription", cible: "dossier-france" });
assert.deepEqual(resoudreVueOffres({ hash: "#preinscriptions" }, OFFRES), { parcours: "preinscription", cible: null });
assert.deepEqual(resoudreVueOffres({ hash: "#inconnue" }, OFFRES), { parcours: null, cible: null });
assert.deepEqual(resoudreVueOffres({ hash: "#inconnue", search: "?parcours=bourse" }, OFFRES), { parcours: "bourse", cible: null });
assert.deepEqual(resoudreVueOffres({ search: "?parcours=autre" }, OFFRES), { parcours: null, cible: null });
assert.deepEqual(resoudreVueOffres({}, OFFRES), { parcours: null, cible: null });
assert.equal(urlDuParcours("bourse", "?program=x&score=80"), "?program=x&score=80&parcours=bourse");
assert.equal(urlDuParcours("preinscription", "?parcours=bourse"), "?parcours=preinscription");
});

test("offers.html : le choix à deux boutons de poids égal, une bascule par vue, les deux vues masquées d'office", () => {
assert.ok(/id="parcoursChoix"[^>]*hidden/.test(offersHtml));
const choix = offersHtml.slice(offersHtml.indexOf('id="parcoursChoix"'), offersHtml.indexOf('id="bourses"'));
const boutons = [...choix.matchAll(/class="parcours-choice-btn" data-parcours-switch="([^"]+)"/g)].map((m) => m[1]);
assert.deepEqual(boutons, ["bourse", "preinscription"]);
assert.ok(/id="bourses" data-parcours="bourse"[^>]*hidden/.test(offersHtml));
assert.ok(/id="preinscriptions" data-parcours="preinscription"[^>]*hidden/.test(offersHtml));
assert.equal((offersHtml.match(/class="parcours-switch"/g) || []).length, 2);
assert.ok(offersHtml.includes('data-parcours-switch="preinscription"') && offersHtml.includes('data-parcours-switch="bourse"'));
assert.ok(offersHtml.includes("js/offres-parcours.js"));
assert.ok(!/pricing-columns/.test(offersHtml), "les deux colonnes de la grille B ont disparu");
});

test("offers.html ne contient plus « par candidature », aucun « illimité », aucun prix écrit en dur, aucune comparaison de nombre", () => {
const visible = offersHtml.replace(/<!--[\s\S]*?-->/g, "").replace(/<script[\s\S]*?<\/script>/g, "");
assert.ok(!/par candidature/i.test(visible), "par candidature");
assert.ok(!/illimit/i.test(visible), "illimité");
assert.ok(!/\d{1,3}(?: \d{3})+ ?FCFA/.test(visible), "un montant FCFA écrit en dur");
assert.ok(!/plan-amount"[^>]*>\s*\d/.test(visible), "un montant en euros écrit en dur");
assert.ok(!/candidatures de plus|au lieu de \d|meilleur prix/i.test(visible), "comparaison fondée sur le nombre");
assert.ok(!/taux de réussite|admission garantie|bourse garantie/i.test(visible));
assert.ok(!/mensualit|fractionn|rembours(?!ables)|coupon|remise/i.test(visible), "règles absolues");
assert.ok(/candidatures accompagnées à fond/.test(visible) && /chacune relue par un conseiller/.test(visible), "la promesse est la profondeur");
for (const id of BOURSES_EN_VENTE) assert.ok(offersHtml.includes(`data-plan="${id}"`), `${id} vendu sur la page`);
for (const id of ANCIENS) assert.ok(!offersHtml.includes(`data-plan="${id}"`), `${id} ne doit plus avoir de bouton`);
assert.ok(!/Ambition \(9 candidatures, 75 000 F\)/.test(offersHtml), "le commentaire sur la collision Ambition/Dossier France est retiré");
});

// ------------------------------------------------------------------
// Les entrées vers les prix, et le menu des pages catalogue
// ------------------------------------------------------------------

test("preinscriptions.html mène à ?parcours=preinscription ; le contexte bourse à ?parcours=bourse ; le menu à offers.html nu", () => {
assert.ok(lire("preinscriptions.html").includes('href="offers.html?parcours=preinscription"'));
assert.ok(!lire("preinscriptions.html").includes("offers.html#preinscriptions"));
assert.ok(lire("js/diagnostic-france-page.js").includes("offers.html?parcours=preinscription"));
assert.ok(lire("results.html").includes('href="offers.html?parcours=bourse"'));
assert.ok(lire("scholarship-details.html").includes('href="offers.html?parcours=bourse"'));
assert.ok(lire("details.js").includes('parcours: "bourse"'));
assert.ok(lire("js/mobile-nav.js").includes('{ href: "offers.html", title: "Formules"'));
});

test("scholarships.html et universities.html n'ont plus « Connexion » (en-tête ni menu mobile) ; l'accueil et preinscriptions.html sont inchangés", () => {
for (const page of ["scholarships.html", "universities.html"]) {
const entete = lire(page).slice(lire(page).indexOf('<header class="header"'), lire(page).indexOf("</header>"));
assert.ok(!/header-link-login|>Connexion</.test(entete), `${page} : Connexion dans l'en-tête`);
assert.ok(/>Bourses<\/span>/.test(entete) && /Préinscriptions/.test(entete) && /Universités/.test(entete), `${page} : les trois entrées`);
}
for (const page of ["index.html", "preinscriptions.html"]) assert.ok(lire(page).includes('href="login.html" class="header-link header-link-login"'), `${page} garde Connexion`);
const nav = lire("js/mobile-nav.js");
assert.ok(nav.includes('isCurrent("scholarships.html") || isCurrent("universities.html")'));
assert.ok(/sansConnexion \? "" : `/.test(nav));
});

test("le diagnostic d'éligibilité bourses reste gratuit : aucune fonctionnalité ne le verrouille", () => {
assert.ok(!FEATURE_CATALOG.some((f) => /eligib|diagnostic_bourse/i.test(f.key)));
assert.ok(!lire("eligibility-test.html").includes("requireFeature") && !lire("eligibility-test.html").includes("requireAuth"));
assert.ok(/Toujours gratuit/.test(offersHtml) && /diagnostic de compatibilité/.test(offersHtml));
});
