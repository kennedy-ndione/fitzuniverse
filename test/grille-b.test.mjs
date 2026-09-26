/**
* ============================================================
* test/grille-b.test.mjs — la tarification préinscription
* ============================================================
*
* Quatre endroits portent le prix ou le quota : pricing-plans.js, la
* GRILLE serveur (functions/lib/achat.js), firestore.rules (motifs
* d'identifiants) et offers.html. Ce fichier échoue si l'un d'eux
* diverge. Puis : l'union des droits, le diagnostic, la page.
*
* Mis à jour par la grille A (2026-09-07) : la messagerie est comprise
* dans les TROIS offres préinscription ; les offres dépréciées restent
* dans la GRILLE serveur (deprecated: true, pour honorer un paiement
* en vol) ; offers.html n'affiche plus qu'une grille à la fois.
* ============================================================
*/

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createRequire } from "node:module";
import vm from "node:vm";

import { PLAN_ORDER, PLAN_PREINSCRIPTION_ORDER, PLAN_PREINSCRIPTION_LABELS, PREINSCRIPTION_FEATURE_CONFIG, FEATURE_CATALOG, resolveFeatureFlags, decideVerrou, isQuotaReached } from "../js/plan-features.js";
import { calculerDiagnostic, textesRendus, formatEUR } from "../js/diagnostic-france.js";
import { faitFrance, PAYS } from "../js/pays-preinscription.js";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
// Fins de ligne normalisées à la lecture, comme dans
// test/preuve-depot.test.mjs. Cette machine a core.autocrlf à true : le
// dépôt stocke firestore.rules en LF, le disque le rend en CRLF. Les
// motifs ci-dessous décrivent le CONTENU des règles, pas son encodage.
//
// Ici les deux motifs « function X(uid) { …\n} » passaient encore, mais
// par chance de forme : leur « [\s\S]*? » absorbait le \r avant le \n
// final. Un motif un peu moins tolérant aurait échoué sans prévenir, et
// le groupe capturé traînait un \r. On ne laisse pas un test dépendre
// d'un réglage de machine.
const lire = (f) => readFileSync(join(racine, f), "utf8").replace(/\r\n/g, "\n");
const require = createRequire(import.meta.url);
const { GRILLE } = require(join(racine, "functions/lib/achat.js"));

function chargerGrille() {
const bacASable = { window: {} };
vm.createContext(bacASable);
vm.runInContext(lire("pricing-plans.js"), bacASable);
return bacASable.window.SCHOLARBRIDGE_PLANS;
}
const OFFRES = chargerGrille();
const PRE = ["diagnostic-france", "dossier-france", "dossier-france-conseiller"];
const regles = lire("firestore.rules");
const offersHtml = lire("offers.html");

// ------------------------------------------------------------------
// pricing-plans.js
// ------------------------------------------------------------------

test("trois offres préinscription, aux prix du lot 118 : 10 000 (retiré) / 45 000 / 70 000", () => {
assert.deepEqual(PLAN_PREINSCRIPTION_ORDER, PRE);
assert.equal(OFFRES["diagnostic-france"].priceFCFA, 10000);
assert.equal(OFFRES["dossier-france"].priceFCFA, 45000);
assert.equal(OFFRES["dossier-france-conseiller"].priceFCFA, 70000);
for (const id of PRE) {
assert.equal(OFFRES[id].parcours, "preinscription");
assert.ok(PLAN_PREINSCRIPTION_LABELS[id]);
assert.ok(!PLAN_ORDER.includes(id), `${id} ne doit pas entrer dans PLAN_ORDER (forfait bourse)`);
}
assert.equal(OFFRES["dossier-france"].maxPreinscriptions, 7);
assert.equal(OFFRES["dossier-france-conseiller"].maxPreinscriptions, 7);
assert.equal(OFFRES["diagnostic-france"].maxPreinscriptions, 0);
});

test("`parcours` sur TOUTES les offres, bourse ou préinscription", () => {
for (const [id, o] of Object.entries(OFFRES)) {
assert.ok(["bourse", "preinscription"].includes(o.parcours), `${id} : parcours « ${o.parcours} »`);
}
assert.equal(OFFRES["essentiel-4"].parcours, "bourse");
assert.equal(OFFRES.fitzExpress.parcours, "bourse");
});

test("aucune mensualité, aucun paiement fractionné, aucune remise dans la grille ni sur la page", () => {
const grille = JSON.stringify(OFFRES);
// « par mois » est exclu volontairement : le seuil de ressources
// (877,50 € par mois) est un fait affiché, pas un mode de paiement.
for (const mot of [/mensualit/i, /\/mois/i, /fractionn/i, /remise/i, /coupon/i, /rembours(?!ables)/i, /en \d+ fois/i]) {
assert.ok(!mot.test(grille), `grille : ${mot}`);
}
const colonnePre = offersHtml.slice(offersHtml.indexOf('id="preinscriptions"'));
for (const mot of [/mensualit/i, /par mois/i, /fractionn/i, /coupon/i]) assert.ok(!mot.test(colonnePre), `offers.html (préinscriptions) : ${mot}`);
});

test("les prix et quotas des offres BOURSE n'ont pas bougé", () => {
// 15 000 → 25 000 F le 2026-09-11 (lot VITRINE-COMMERCIALE) : le seul
// prix de la grille qui ait bougé ce jour-là. Les anciennes formules
// (Essentiel 5, Ambition, Conseiller 12, Signature) sont supprimées
// depuis le 2026-09-24 : ce sont les trois formules EN VENTE qui sont
// gardées ici.
assert.equal(OFFRES.fitzExpress.priceFCFA, 10000);
assert.equal(OFFRES["premier-dossier"].priceFCFA, 25000);
assert.equal(OFFRES["essentiel-4"].priceFCFA, 45000);
assert.equal(OFFRES["conseiller-6"].priceFCFA, 90000);
assert.equal(OFFRES["premier-dossier"].maxAccompaniedApplications, 1);
assert.equal(OFFRES["essentiel-4"].maxAccompaniedApplications, 4);
assert.equal(OFFRES["conseiller-6"].maxAccompaniedApplications, 6);
});

// ------------------------------------------------------------------
// Cohérence pricing-plans.js ↔ GRILLE serveur ↔ firestore.rules
// ------------------------------------------------------------------

test("GRILLE serveur : mêmes prix que pricing-plans.js ; une offre dépréciée y est refusée à la vente", () => {
for (const [id, o] of Object.entries(OFFRES)) {
if (o.deprecated) {
// Grille A : l'entrée peut rester (le webhook honore un paiement créé
// avant le retrait) mais elle DOIT porter deprecated: true.
if (GRILLE[id]) { assert.equal(GRILLE[id].deprecated, true, `${id} déprécié doit l'être aussi côté serveur`); assert.equal(GRILLE[id].prix, o.priceFCFA); }
continue;
}
assert.ok(GRILLE[id], `${id} absent de la GRILLE serveur`);
assert.notEqual(GRILLE[id].deprecated, true, `${id} est vendu côté client mais refusé côté serveur`);
assert.equal(GRILLE[id].prix, o.priceFCFA, `${id} : prix serveur ≠ prix client`);
assert.equal(GRILLE[id].parcours, o.parcours, `${id} : parcours serveur ≠ client`);
}
for (const id of ["dossier-france", "dossier-france-conseiller"]) assert.equal(GRILLE[id].maxPreinscriptions, OFFRES[id].maxPreinscriptions);
});

function motifRegle(nom) {
const m = regles.match(new RegExp(`function ${nom}\\(uid\\) \\{([\\s\\S]*?)\\n\\}`));
assert.ok(m, `firestore.rules : fonction ${nom} introuvable`);
return m[1];
}

test("firestore.rules : les quotas des règles sont le miroir des quotas de pricing-plans.js", () => {
const slot = motifRegle("slotPattern");
// 2026-09-24 : les trois formules EN VENTE, et elles seules (les
// anciennes sont supprimées des règles).
const attendu = { "premier-dossier": "slot-1", "essentiel-4": "slot-[1-4]", "conseiller-6": "slot-[1-6]" };
for (const [id, motif] of Object.entries(attendu)) {
assert.ok(slot.includes(`planOf(uid) == '${id}' ? '${motif}'`), `slotPattern : ${id} → ${motif}`);
}
assert.equal((slot.match(/planOf\(uid\) == '/g) || []).length, Object.keys(attendu).length, "aucune autre formule n'ouvre de créneau");
// Le motif borne bien au quota annoncé par pricing-plans.js.
const borne = (motif, n) => new RegExp(`^${motif}$`).test(`slot-${n}`);
for (const [id, motif] of Object.entries(attendu)) {
const q = OFFRES[id].maxAccompaniedApplications;
assert.ok(borne(motif, q) && !borne(motif, q + 1), `${id} : le motif ${motif} doit borner à ${q}`);
}

const pre = motifRegle("preSlotPattern");
assert.ok(pre.includes("'pre-[1-7]'"), "preSlotPattern : pre-[1-7]");
assert.ok(/^pre-[1-7]$/.test("pre-7") && !/^pre-[1-7]$/.test("pre-8"));
assert.equal(OFFRES["dossier-france"].maxPreinscriptions, 7, "le motif pre-[1-7] doit suivre maxPreinscriptions");
assert.ok(motifRegle("isDossierFrance").includes("['dossier-france', 'dossier-france-conseiller']"));
assert.ok(motifRegle("isDossierConseiller").includes("'dossier-france-conseiller'"));
});

test("firestore.rules : les formules restent hors de portée de l'étudiant, et de l'admin ORDINAIRE", () => {
// LOT ADMIN (2026-09-09) : la grille préinscription s'ouvre à
// l'attribution manuelle — mais au seul superAdmin. Ce que ce test
// gardait reste gardé, avec un cran de plus : l'administrateur
// ORDINAIRE, qui n'existait pas quand il a été écrit, ne peut écrire
// AUCUNE formule, ni bourse ni préinscription.
const bloc = regles.slice(regles.indexOf("match /users/{uid} {"), regles.indexOf("match /users/{uid}/messages"));

// L'étudiant : ni à la création, ni à la mise à jour.
assert.match(bloc, /allow create: if isOwner\(uid\) && request\.auth\.token\.firebase\.sign_in_provider != 'anonymous' && !request\.resource\.data\.keys\(\)\.hasAny\(champsFormule\(\)/);
assert.match(bloc, /\(isOwner\(uid\) && !request\.resource\.data\.diff\(resource\.data\)\.affectedKeys\(\)\.hasAny\(champsFormule\(\)/);

// La liste des champs de formule porte les DEUX grilles, et la trace
// d'attribution manuelle — que l'étudiant ne doit pas pouvoir effacer
// sur son propre compte.
const champs = regles.match(/function champsFormule\(\) \{\s*return \[([^\]]*)\]/);
assert.ok(champs, "champsFormule() introuvable dans les règles");
for (const champ of ["plan", "planExpiresAt", "planPreinscription", "planPreinscriptionExpiresAt", "attributionManuelle"]) {
assert.ok(champs[1].includes(`"${champ}"`), `champsFormule() devrait contenir ${champ}`);
}

// L'administrateur ORDINAIRE : de la modération, jamais un droit payant.
const ordinaire = regles.match(/function champsAdminOrdinaire\(\) \{\s*return \[([^\]]*)\]/);
assert.ok(ordinaire, "champsAdminOrdinaire() introuvable dans les règles");
assert.ok(!/plan/.test(ordinaire[1]), "un admin ordinaire ne doit écrire aucune formule");
assert.match(bloc, /\(isAdmin\(\) && request\.resource\.data\.diff\(resource\.data\)\.affectedKeys\(\)\.hasOnly\(champsAdminOrdinaire\(\)\)\)/);

// Le superAdmin : les deux grilles.
assert.match(bloc, /isSuperAdmin\(\) && request\.resource\.data\.diff\(resource\.data\)\.affectedKeys\(\)\.hasOnly\(champsFormule\(\)/);
// 2026-09-23 : les créneaux des six autres pays s'ajoutent (preSlotPatternPays).
assert.ok(/request\.resource\.data\.get\('track', 'bourse'\) == 'preinscription' && \(applicationId\.matches\(preSlotPattern\(uid\)\) \|\| applicationId\.matches\(preSlotPatternPays\(uid\)\)\)/.test(regles));
assert.ok(/isOwner\(uid\) &&\s*!compteSuspendu\(uid\) &&/.test(regles), "messagerie ouverte à tout compte, préinscription comprise (2026-09-23)");
assert.ok(motifRegle("hasPreinscription").includes("['diagnostic-france', 'dossier-france', 'dossier-france-conseiller']"));
assert.ok(/isSignaturePlan\(uid\) \|\| isDossierConseiller\(uid\) \|\| isTester\(uid\)/.test(regles), "conseiller ouvert à Dossier France + Conseiller");
});

// ------------------------------------------------------------------
// L'union des droits
// ------------------------------------------------------------------

const flags = resolveFeatureFlags(null);
const verrou = (planId, planPreinscriptionId, featureKey) => decideVerrou({ planId, planPreinscriptionId, featureFlags: flags, featureKey });

test("PREINSCRIPTION_FEATURE_CONFIG couvre chaque fonctionnalité et chaque offre préinscription", () => {
for (const { key } of FEATURE_CATALOG) {
assert.ok(PREINSCRIPTION_FEATURE_CONFIG[key], `config préinscription manquante pour ${key}`);
for (const id of PRE) assert.equal(typeof PREINSCRIPTION_FEATURE_CONFIG[key][id], "boolean", `${key}/${id}`);
for (const id of PRE) assert.equal(typeof flags[key][id], "boolean", `drapeau résolu manquant : ${key}/${id}`);
}
});

// Jusqu'au 2026-09-24 : « Ambition seul ». Ambition est supprimée ; la
// formule bourse du milieu en vente, Essentiel, tient le même rôle.
test("Essentiel seul : ses droits, et pas le diagnostic France", () => {
assert.equal(verrou("essentiel-4", "", "applications"), false);
assert.equal(verrou("essentiel-4", "", "ai_letter"), false);
assert.equal(verrou("essentiel-4", "", "advisor"), true);
assert.equal(verrou("essentiel-4", "", "diagnostic_france"), true);
});

test("Dossier France seul : candidatures, documents, entretiens, messagerie, diagnostic — PAS advisor — et, depuis le lot PRÉ-FITZ, les cinq outils Fitz", () => {
for (const k of ["applications", "documents", "interview_prep", "student_messaging", "diagnostic_france", "compress"]) assert.equal(verrou("gratuit", "dossier-france", k), false, k);
// Lot PRÉ-FITZ (2026-09-10) : les cinq outils Fitz sont OUVERTS au
// Dossier France — sept vœux = sept lettres de vœu, voir le commentaire
// de PREINSCRIPTION_FEATURE_CONFIG. Le conseiller et WhatsApp restent
// fermés.
for (const k of ["advisor", "whatsapp_direct"]) assert.equal(verrou("gratuit", "dossier-france", k), true, k);
for (const k of ["ai_chat", "ai_letter", "ai_check", "ai_email", "ai_translate"]) assert.equal(verrou("gratuit", "dossier-france", k), false, k);
assert.equal(verrou("gratuit", "dossier-france-conseiller", "advisor"), false);
assert.equal(verrou("gratuit", "dossier-france-conseiller", "ai_letter"), false);
});

test("les deux forfaits : l'union", () => {
for (const k of ["applications", "ai_letter", "diagnostic_france", "student_messaging"]) assert.equal(verrou("essentiel-4", "dossier-france", k), false, k);
assert.equal(verrou("essentiel-4", "dossier-france", "advisor"), true);
assert.equal(verrou("essentiel-4", "dossier-france-conseiller", "advisor"), false);
// 2026-09-20 : WhatsApp est retiré du site pour TOUTES les formules
// (décision de Charles) — le verrou reste donc fermé même pour l'union
// la plus large.
assert.equal(verrou("conseiller-6", "dossier-france-conseiller", "whatsapp_direct"), true);
});

test("Diagnostic seul : la page du diagnostic et la messagerie (grille A), aucun droit de candidature", () => {
assert.equal(verrou("gratuit", "diagnostic-france", "diagnostic_france"), false);
assert.equal(verrou("gratuit", "diagnostic-france", "student_messaging"), false, "grille A : la messagerie est comprise dans les trois offres préinscription");
for (const k of ["applications", "documents", "advisor", "ai_chat", "interview_prep"]) assert.equal(verrou("gratuit", "diagnostic-france", k), true, k);
assert.equal(OFFRES["diagnostic-france"].maxPreinscriptions, 0);
assert.equal(isQuotaReached(OFFRES["diagnostic-france"].maxPreinscriptions, 0), false, "quota 0 = aucune offre active, c'est le verrou de page qui interdit");
});

test("quota préinscription : 7 vœux passent, le 8e est bloqué (décision client, le serveur fait foi)", () => {
const q = OFFRES["dossier-france"].maxPreinscriptions;
assert.equal(isQuotaReached(q, 6), false);
assert.equal(isQuotaReached(q, 7), true);
});

// ------------------------------------------------------------------
// Le diagnostic
// ------------------------------------------------------------------

test("diagnostic : 900 €/mois → atteint ; 800 → pas atteint, écart 77,50 €", () => {
const ok = calculerDiagnostic({ ressourcesMensuelles: 900, devise: "EUR", niveau: "master" });
assert.equal(ok.ressources.atteint, true);
assert.match(ok.verdict, /atteignent le seuil publié/);
const ko = calculerDiagnostic({ ressourcesMensuelles: 800, devise: "EUR", niveau: "licence" });
assert.equal(ko.ressources.atteint, false);
assert.equal(ko.ressources.ecartMensuel, -77.5);
assert.match(ko.verdict, /il manque 77,50 € par mois/);
});

// paysResidence explicite depuis le lot S0 (2026-09-08) : les frais de dossier Campus France sont ceux de l espace du pays de residence, et ces deux tests verifient le cas senegalais. Sans pays declare, le diagnostic les exclut desormais — c etait tout l objet du correctif.
test("diagnostic en F CFA, residence Senegal : la parite fixe, et le total annuel", () => {
const r = calculerDiagnostic({ ressourcesMensuelles: 600000, devise: "XOF", niveau: "licence", paysResidence: "Sénégal" });
assert.equal(r.ressources.disponibleEUR, 914.69);
assert.equal(r.ressources.atteint, true);
assert.equal(r.droits.montant, 2902);
assert.equal(r.fraisDossier.montant, 85000);
assert.equal(r.total.annuelEUR, 10530 + 2902 + Math.round(85000 / 655.957));
assert.equal(calculerDiagnostic({ ressourcesMensuelles: 900, niveau: "master" }).droits.montant, 3950);
});

test("aucune sortie ne contient « visa accordé » ni « admis » ; le verdict parle de seuil publié", () => {
for (const entrees of [{ ressourcesMensuelles: 900 }, { ressourcesMensuelles: 100, exonerationEsperee: true, niveau: "master" }, { ressourcesMensuelles: 0 }]) {
for (const t of textesRendus(calculerDiagnostic(entrees))) {
assert.ok(!/visa accord/i.test(t) && !/\badmis/i.test(t) && !/vous aurez/i.test(t) && !/garanti/i.test(t), `« ${t} »`);
}
}
});

test("chaque chiffre affiché correspond à un fait sourcé de pays-preinscription.js", () => {
const r = calculerDiagnostic({ ressourcesMensuelles: 900, niveau: "master", exonerationEsperee: true, paysResidence: "Sénégal" });
const ressources = faitFrance("ressources"), droits = faitFrance("droits"), dossier = faitFrance("fraisDossier");
assert.equal(r.ressources.seuilMensuel, ressources.montants.mensuel);
assert.equal(r.ressources.seuilAnnuel, ressources.montants.annuel);
assert.equal(r.ressources.source, ressources.source);
assert.equal(r.droits.montant, droits.montants.master);
assert.equal(r.droits.plafondExoneration, droits.plafondExoneration);
assert.equal(r.droits.source, droits.source);
assert.equal(r.fraisDossier.montant, dossier.montant);
assert.equal(r.fraisDossier.source, dossier.source);
for (const f of [ressources, droits, dossier]) { assert.match(f.source, /^https?:\/\//); assert.match(f.verifieLe, /^\d{4}-\d{2}-\d{2}$/); }
assert.match(r.droits.texte, /25 %/);
assert.match(r.fraisDossier.texte, /85 000 F CFA/);
assert.equal(formatEUR(877.5), "877,50 €");
// Les faits France portent toujours source + date (test parcourant TOUS les faits).
for (const f of PAYS.find((p) => p.id === "france").faits) assert.match(f.source, /^https?:\/\//);
});

// ------------------------------------------------------------------
// offers.html : une vue par parcours (grille A remplace les deux colonnes)
// ------------------------------------------------------------------

test("offers.html : les deux vues existent, aucune offre bourse dans la vue préinscription et inversement", () => {
const debutB = offersHtml.indexOf('id="bourses"');
const debutP = offersHtml.indexOf('id="preinscriptions"');
assert.ok(debutB > 0 && debutP > debutB, "les deux vues existent, Bourses avant Préinscriptions");
const vueB = offersHtml.slice(debutB, debutP);
const vueP = offersHtml.slice(debutP, offersHtml.indexOf("offer-footnotes"));
const ids = (html) => [...html.matchAll(/data-plan="([^"]+)"/g)].map((m) => m[1]);
const idsB = ids(vueB), idsP = ids(vueP);
// Le Diagnostic est gratuit (lot 97) : sa carte n'a plus de bouton d'achat.
assert.deepEqual(idsP.sort(), PRE.filter((id) => !OFFRES[id].deprecated).sort());
assert.ok(vueP.includes('<a href="diagnostic-france.html" class="btn btn-secondary plan-cta">'), "la carte du diagnostic gratuit mène au diagnostic");
for (const id of idsB) assert.equal(OFFRES[id].parcours, "bourse", `${id} dans la vue Bourses`);
for (const id of idsP) assert.equal(OFFRES[id].parcours, "preinscription", `${id} dans la vue Préinscriptions`);
// Lot LANGAGE (2026-09-10) : « L'unité : … » est devenu « Vous payez
// par candidature » / « Vous payez pour un dossier » — même contrat,
// dit avec le mot concret d'abord.
// Lot ACCEPTATION (2026-09-11) : « sans abonnement », et un nombre de
// candidatures travaillées en même temps — plus « à la fois : terminer
// une candidature libère sa place ».
assert.ok(/Vous payez une formule, en une fois, sans abonnement\. Elle couvre un nombre de candidatures, travaillées <strong>en même temps<\/strong>/.test(vueB));
assert.ok(/Vous payez pour <strong>un dossier Études en France<\/strong>/.test(vueP));
assert.ok(!/jusqu'à l'admission(?!\.| —)/.test(vueP.replace(/jamais jusqu'à l'admission/g, "")), "aucune promesse d'admission");
// Les prix portent leur source (offers.js les remplit depuis pricing-plans.js).
for (const id of [...idsB, ...idsP]) assert.ok(offersHtml.includes(`data-price-of="${id}"`) && offersHtml.includes(`data-eur-of="${id}"`), `prix dérivés pour ${id}`);
});

test("diagnostic-france.html : ouverte à tout compte (lot 97), sans IA, sans promesse", () => {
const html = lire("diagnostic-france.html");
assert.ok(html.includes("noindex"));
assert.ok(!/data-lucide="sparkle/.test(html));
assert.ok(!/visa accord|vous aurez votre visa|admission garantie/i.test(html));
assert.ok(lire("js/diagnostic-france-page.js").includes('bootstrapShell({ espace: "preinscription", ouvertATous: true })'));
assert.ok(!/renderLockedState|ctx\.locked/.test(lire("js/diagnostic-france-page.js")), "plus aucun verrou");
assert.ok(!/fitzGenerate|ai-client|generate\(/.test(lire("js/diagnostic-france.js") + lire("js/diagnostic-france-page.js")), "aucune IA");
});
