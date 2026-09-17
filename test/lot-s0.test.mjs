/**
* ============================================================
* test/lot-s0.test.mjs — les cinq défauts de production du lot S0
* ============================================================
*
* Chaque test ci-dessous a échoué au moins une fois pour de vrai : ce
* sont des régressions constatées en production, pas des hypothèses.
*
*  1. admin/ appelait un symbole non importé (fiche étudiant HS) ;
*  2. diagnostic-france.html n'était atteignable que depuis payment.js ;
*  3. le Diagnostic France servait le Sénégal à tout le monde ;
*  4. le conseiller payé restait masqué ;
*  5. offers.html#signature-focus pointait vers une carte disparue.
*
* Fins de ligne : core.autocrlf=true sur la machine de développement, donc
* TOUT fichier lu ici passe par lire(), qui normalise en \n. Un test qui
* cherche « a\nb » dans un fichier livré en CRLF échoue sans rien dire
* d'utile — voir la note du lot ACCUEIL-5.
* ============================================================
*/

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { advisorOuvert, DEFAULT_FEATURE_CONFIG, PREINSCRIPTION_FEATURE_CONFIG, resolveFeatureFlags } from "../js/plan-features.js";
import { calculerDiagnostic, residenceDocumentee } from "../js/diagnostic-france.js";
import { faitFrance } from "../js/pays-preinscription.js";
// Le témoin « pays non documenté » se choisit tout seul — voir
// test/_pays-temoin.mjs, et l'historique des quatre pays qu'il a usés.
import { TEMOIN, TEMOIN_2 } from "./_pays-temoin.mjs";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(join(racine, f), "utf8").replace(/\r\n/g, "\n");

// ------------------------------------------------------------------
// 1. Aucun fichier de admin/ n'appelle un symbole qu'il n'importe pas
// ------------------------------------------------------------------

/**
* Analyse volontairement grossière — elle ne remplace pas un vrai
* résolveur de modules, elle attrape la faute qui a coûté la fiche
* étudiant : un nom appelé comme fonction, exporté par un module du
* dépôt, mais absent de la liste d'import du fichier qui l'appelle.
*
* On ne considère QUE les symboles exportés par js/*.js et admin/*.js :
* les globales du navigateur, les fonctions locales et les méthodes
* d'objet ne sont jamais candidates, ce qui évite les faux positifs.
*/
function symbolesExportes() {
const noms = new Map();
for (const dossier of ["js", "admin"]) {
for (const f of readdirSync(join(racine, dossier))) {
if (!f.endsWith(".js")) continue;
const src = lire(`${dossier}/${f}`);
for (const m of src.matchAll(/^export\s+(?:async\s+)?function\s+([A-Za-z_$][\w$]*)/gm)) noms.set(m[1], `${dossier}/${f}`);
for (const m of src.matchAll(/^export\s+(?:const|let|var)\s+([A-Za-z_$][\w$]*)/gm)) noms.set(m[1], `${dossier}/${f}`);
}
}
return noms;
}

/**
* Retire commentaires et littéraux de chaîne. Sans cela le scanner
* accusait deux fichiers innocents : admin/expand-catalog-batch29.js
* « appelait » recommendPrograms() et admin/scholarships.js
* estEligible() — dans un commentaire, l'un et l'autre. Un test qui
* signale du code mentionné en prose n'est pas prudent, il est bruyant,
* et un test bruyant finit désactivé.
*/
function sansCommentaires(src) {
return src
.replace(/\/\*[\s\S]*?\*\//g, " ")
.replace(/(^|[^:])\/\/[^\n]*/g, "$1")
.replace(/`(?:\\[\s\S]|[^\\`])*`/g, "``")
.replace(/'(?:\\.|[^\\'])*'/g, "''")
.replace(/"(?:\\.|[^\\"])*"/g, '""');
}

function nomsImportes(src) {
const noms = new Set();
for (const m of src.matchAll(/import\s+([\s\S]*?)\s+from\s+["'][^"']+["']/g)) {
// Un commentaire DANS la liste d'import (admin/student-detail.js :
// « // Lot ADMIN : … » avant attribuerFormuleManuellement) collait le
// nom au commentaire, et le nom n'était plus lu. Le test passait par
// hasard (lot ACCEPTATION, 2026-09-11) : l'appel était avalé par une
// paire d'apostrophes mal fermée de sansCommentaires(). On retire les
// commentaires de la clause avant de la découper.
const clause = m[1].replace(/\/\/[^\n]*/g, "");
for (const accolades of clause.matchAll(/\{([\s\S]*?)\}/g)) {
for (const piece of accolades[1].split(",")) {
const nom = piece.trim().split(/\s+as\s+/).pop().trim();
if (nom) noms.add(nom);
}
}
const direct = clause.replace(/\{[\s\S]*?\}/g, "").replace(/^\s*,|,\s*$/g, "").trim();
if (/^[A-Za-z_$][\w$]*$/.test(direct)) noms.add(direct);
for (const ns of clause.matchAll(/\*\s+as\s+([A-Za-z_$][\w$]*)/g)) noms.add(ns[1]);
}
return noms;
}

test("aucun fichier de admin/ n'appelle une fonction exportée qu'il a oublié d'importer", () => {

const exportes = symbolesExportes();
const manques = [];

for (const f of readdirSync(join(racine, "admin"))) {

if (!f.endsWith(".js")) continue;

const brut = lire(`admin/${f}`);
if (!/^import\s/m.test(brut)) continue;

const src = sansCommentaires(brut);
// Les imports se lisent sur la source BRUTE : sansCommentaires() vide
// les littéraux de chaîne, donc les `from "./x.js"` que le motif exige.
const importes = nomsImportes(brut);
// Déclarations locales : tout ce que le fichier définit lui-même.
const locaux = new Set();
for (const m of src.matchAll(/(?:^|\n)\s*(?:export\s+)?(?:async\s+)?function\s+([A-Za-z_$][\w$]*)/g)) locaux.add(m[1]);
for (const m of src.matchAll(/(?:^|\n)\s*(?:export\s+)?(?:const|let|var)\s+([A-Za-z_$][\w$]*)/g)) locaux.add(m[1]);

// Appels `nom(` non précédés d'un point (donc pas une méthode).
for (const m of src.matchAll(/(^|[^.\w$])([A-Za-z_$][\w$]*)\s*\(/g)) {
const nom = m[2];
if (!exportes.has(nom)) continue;
if (importes.has(nom) || locaux.has(nom)) continue;
manques.push(`admin/${f} : appelle « ${nom} » (exporté par ${exportes.get(nom)}) sans l'importer`);
}

}

assert.deepEqual([...new Set(manques)], [], manques.join("\n"));

});

test("student-detail : resolvePlanPreinscription est importée, et le parcours de chaque candidature est affiché", () => {
const src = lire("admin/student-detail.js");
assert.match(src, /import \{[^}]*resolvePlanPreinscription[^}]*\} from "\.\.\/js\/access-guard\.js"/);
assert.ok(src.includes("resolvePlanPreinscription(userData)"), "la fonction est bien appelée");
// Le parcours (bourse / préinscription) dans la liste des candidatures.
assert.ok(src.includes("lireParcours(app)"), "le parcours vient de lireParcours(), pas de app.track brut");
assert.match(src, /import \{ lireParcours, LIBELLES as LIBELLES_PARCOURS \} from "\.\.\/js\/parcours\.js"/);
// Le bloc « offre préinscription » a sa propre section, plus celle du Pass.
const html = lire("admin/student-detail.html");
const avant = html.slice(0, html.indexOf('id="planPreinscriptionStatus"'));
const derniereSection = avant.lastIndexOf("<h3>");
assert.match(avant.slice(derniereSection, derniereSection + 60), /<h3>Offre préinscription<\/h3>/, "le bloc n'est plus niché sous « Pass Fitz Express »");
});

// ------------------------------------------------------------------
// 2. Le Diagnostic France est atteignable sans repasser par un paiement
// ------------------------------------------------------------------

test("diagnostic-france.html a deux entrées hors paiement, et chacune disparaît quand le droit est fermé", () => {

// LOT S4 : la carte a suivi le Diagnostic dans SON espace. Elle vivait
// sur dashboard.html, qui n'est plus qu'un aiguillage ; elle est
// maintenant dans le hub préinscription, à la phase où l'on choisit ses
// établissements — c'est-à-dire au moment où la question du coût se
// pose. Le retrait quand le droit est fermé ne dépend plus d'un code
// écrit exprès dans dashboard.js : son [data-feature] la fait retirer
// du DOM par applyFeatureLocks(), comme tous les autres.
const hubPre = lire("espace-preinscription.html");
const shell = lire("js/app-shell.js");
const nav = lire("js/mobile-nav.js");

// a) L'étape « Vos ressources » de la route (lot R1) : le diagnostic
// est l'outil principal de l'étape 2, sous son verrou.
const route = lire("js/route-preinscription.js");
assert.ok(route.includes('feature: "diagnostic_france", href: "diagnostic-france.html"'), "aucun lien vers le diagnostic dans la route préinscription");
assert.match(hubPre, /src="espace-preinscription\.js"/, "le hub doit être rendu par le moteur de la route");
// Retirée du DOM (remove), pas seulement masquée ni grisée.
// Lot FITZ-RECOURS : un OUTIL verrouillé laisse d'abord le recours
// (« Bloqué ? Demandez à Fitz »), puis l'élément est retiré — toujours
// retiré, jamais grisé.
assert.match(shell, /if \(locked\) \{[\s\S]{0,900}?el\.remove\(\);/, "un droit fermé RETIRE l'élément, il ne le grise pas");

// b) L'entrée du menu mobile.
assert.ok(nav.includes('href: "diagnostic-france.html"'), "aucune entrée de menu vers le diagnostic");
assert.ok(nav.includes('feature: "diagnostic_france"'), "l'entrée doit déclarer le droit qui la conditionne");
// Elle n'est PAS dans la liste rendue au montage : absente du DOM par défaut.
const menuItems = nav.slice(nav.indexOf("const MENU_ITEMS = ["), nav.indexOf("];", nav.indexOf("const MENU_ITEMS = [")));
assert.ok(!menuItems.includes("diagnostic-france.html"), "l'entrée ne doit pas être rendue au montage, avant que le droit soit connu");
assert.ok(nav.includes("function ouvrirEntree("), "ouvrirEntree doit exister");
// On vérifie le NOM exposé, pas la forme exacte de la ligne : elle a
// gagné appliquerEspace au lot S4, elle en gagnera d'autres.
assert.match(nav, /window[.]FitzMobileNav = [{][^}]*ouvrirEntree[,} ]/, "ouvrirEntree doit être exposée sur FitzMobileNav");

// c) Les deux coquilles ne l'ouvrent qu'après avoir vérifié le droit.
for (const f of ["js/app-shell.js", "js/dual-shell.js"]) {
const src = lire(f);
assert.match(src, /!isFeatureLocked\([^)]*"diagnostic_france"[^)]*\)[\s\S]{0,200}?ouvrirEntree\("diagnostic_france"\)/, `${f} ouvre l'entrée sans vérifier le droit`);
}

// d) payment.js n'est plus le seul chemin.
const liens = ["js/route-preinscription.js", "js/mobile-nav.js"].filter((f) => lire(f).includes("diagnostic-france.html"));
assert.equal(liens.length, 2, "les deux entrées doivent exister");

});

// ------------------------------------------------------------------
// 3. Le Diagnostic France ne sert plus le Sénégal à tout le monde
// ------------------------------------------------------------------

const BASE = { ressourcesMensuelles: 900, devise: "EUR", niveau: "licence" };

test("résidence non documentée : ni « 85 000 », ni « Sénégal », et le total dit ce qu'il exclut", () => {

const r = calculerDiagnostic({ ...BASE, paysResidence: TEMOIN });

const rendu = JSON.stringify(r);
assert.ok(!/85\s*000/.test(rendu), "le montant sénégalais ne doit apparaître nulle part");
assert.ok(!/Sénégal|senegal/i.test(rendu), "le mot « Sénégal » ne doit apparaître nulle part");

assert.equal(r.residence.documentee, false);
assert.equal(r.fraisDossier.documente, false);
assert.equal(r.fraisDossier.montant, undefined, "aucun montant, pas même 0 : un 0 se lirait « gratuit »");
assert.equal(r.fraisDossier.source, undefined, "aucune source empruntée à un autre pays");
assert.match(r.fraisDossier.texte, /non encore vérifiés pour votre pays/);

assert.equal(r.total.inclutFraisDossier, false);
assert.match(r.total.texte, /HORS frais de dossier Campus France/);
assert.match(r.total.texte, /plus élevé/);

});

test("les chiffres FRANÇAIS sont les mêmes pour tous : seuls les frais locaux changent", () => {

const sansCouche = calculerDiagnostic({ ...BASE, paysResidence: TEMOIN });
const sn = calculerDiagnostic({ ...BASE, paysResidence: "Sénégal" });

// Seuil de ressources, droits, plafond d'exonération : identiques.
assert.deepEqual(sansCouche.ressources, sn.ressources);
assert.deepEqual(sansCouche.droits, sn.droits);
assert.equal(sansCouche.verdict, sn.verdict);

// Les frais de dossier, eux, ne valent que pour le pays documenté.
assert.equal(sn.fraisDossier.documente, true);
assert.equal(sn.fraisDossier.montant, 85000);
assert.equal(sn.total.inclutFraisDossier, true);
// Et le total sénégalais est plus élevé d'exactement ces frais.
assert.equal(sn.total.annuelEUR - sansCouche.total.annuelEUR, sn.fraisDossier.montantEUR);

});

test("residenceDocumentee : insensible à la casse et aux accents, fermée par défaut", () => {
assert.equal(residenceDocumentee("Sénégal"), true);
assert.equal(residenceDocumentee("senegal"), true);
assert.equal(residenceDocumentee("SN"), true);
assert.equal(residenceDocumentee(TEMOIN), false);
assert.equal(residenceDocumentee(TEMOIN_2), false);
assert.equal(residenceDocumentee(""), false);
assert.equal(residenceDocumentee(undefined), false);
assert.equal(residenceDocumentee("Pays qui n'existe pas"), false, "une saisie non reconnue n'est jamais documentée");
// Le fait porte bien sa restriction en DONNÉE, pas seulement dans sa phrase.
assert.equal(faitFrance("fraisDossier").residence, "Sénégal");
});

test("le pays de résidence est demandé EN PREMIER dans le formulaire", () => {
const html = lire("diagnostic-france.html");
assert.ok(html.includes('id="diagPays"'), "le champ pays doit exister");
assert.ok(html.indexOf('id="diagPays"') < html.indexOf('id="diagRessources"'), "le pays se demande avant les ressources : il décide de ce que les autres réponses veulent dire");
// Lot CONTRÔLES-UNIFIÉS (2026-09-11) : le champ reste libre, mais ses
// suggestions viennent de js/fitz-combobox.js (panneau au rendu du site),
// plus d'un <datalist> dessiné par le système.
assert.ok(!html.includes('list="diagPaysListe"') && !html.replace(/<!--[\s\S]*?-->/g, "").includes("<datalist"), "plus de datalist : champ à suggestions maison");
assert.ok(lire("js/diagnostic-france-page.js").includes('initFitzCombobox(document.getElementById("diagPays"), COUNTRY_NAMES)'), "les suggestions de pays viennent du champ maison");
const page = lire("js/diagnostic-france-page.js");
assert.match(page, /import \{ COUNTRY_NAMES \} from "\.\/countries\.js"/, "la liste vient de js/countries.js, pas d'une nouvelle liste");
assert.ok(page.includes("paysResidence: document.getElementById(\"diagPays\").value.trim()"), "le champ est lu à la soumission");
});

// ------------------------------------------------------------------
// 4. Le conseiller payé est rendu
// ------------------------------------------------------------------

const FLAGS = resolveFeatureFlags(null);

test("advisorOuvert : vrai pour conseiller-6 ET pour dossier-france-conseiller", () => {

// Grille A — la formule à 150 000 F qui était oubliée.
assert.equal(advisorOuvert({ planId: "conseiller-6", featureFlags: FLAGS }), true);
assert.equal(advisorOuvert({ planId: "signature-focus", featureFlags: FLAGS }), true);
assert.equal(advisorOuvert({ planId: "signature", featureFlags: FLAGS }), true);

// Grille B — le forfait préinscription avec conseiller, quelle que soit
// la formule bourse (« gratuit » compris : c'est l'union des deux).
assert.equal(advisorOuvert({ planId: "gratuit", planPreinscriptionId: "dossier-france-conseiller", featureFlags: FLAGS }), true);

// Fermé partout ailleurs.
assert.equal(advisorOuvert({ planId: "gratuit", featureFlags: FLAGS }), false);
assert.equal(advisorOuvert({ planId: "essentiel-4", featureFlags: FLAGS }), false);
assert.equal(advisorOuvert({ planId: "premium", featureFlags: FLAGS }), false);
assert.equal(advisorOuvert({ planId: "gratuit", planPreinscriptionId: "dossier-france", featureFlags: FLAGS }), false);

// Accès test : ouvert. Aucun drapeau : fermé, jamais ouvert par défaut.
assert.equal(advisorOuvert({ planId: "gratuit", featureFlags: FLAGS, testerAccess: true }), true);
assert.equal(advisorOuvert({ planId: "signature", featureFlags: {} }), false);
assert.equal(advisorOuvert(), false);
// Une formule inconnue reste fermée : le `=== true` est délibéré.
assert.equal(advisorOuvert({ planId: "formule-inventee", featureFlags: FLAGS }), false);

});

test("les listes de formules « conseiller » sont dérivées de la config, plus recopiées", () => {
const src = lire("js/entitlements.js");
assert.ok(!/const ADVISOR_PLANS = \[/.test(src), "ADVISOR_PLANS ne doit plus être une liste écrite en dur");
assert.match(src, /ADVISOR_PLANS = Object\.keys\(DEFAULT_FEATURE_CONFIG\.advisor\)/);
assert.match(src, /ADVISOR_PREINSCRIPTION = Object\.keys\(PREINSCRIPTION_FEATURE_CONFIG\.advisor\)/);
// La vraie config porte bien les deux formules attendues.
assert.equal(DEFAULT_FEATURE_CONFIG.advisor["conseiller-6"], true);
assert.equal(PREINSCRIPTION_FEATURE_CONFIG.advisor["dossier-france-conseiller"], true);
});

test("les trois coquilles décident du conseiller avec la MÊME fonction, et lui passent le forfait préinscription", () => {
for (const f of ["js/app-shell.js", "js/dual-shell.js", "js/entitlements.js"]) {
const src = lire(f);
// On vise les ARGUMENTS de l'appel réel, pas une mention du nom : les
// trois fichiers citent aussi advisorOuvert() dans un commentaire.
const appels = [...sansCommentaires(src).matchAll(/advisorOuvert\(\{([^}]*)\}/g)].map((m) => m[1]);
assert.ok(appels.length >= 1, `${f} doit appeler advisorOuvert()`);
assert.ok(appels.some((a) => a.includes("planPreinscriptionId")), `${f} doit passer planPreinscriptionId à advisorOuvert()`);
}
// Plus aucune copie locale de la règle.
assert.ok(!lire("js/dual-shell.js").includes("advisorFlags[session.planId] === true"), "la copie de dual-shell doit avoir disparu");
assert.ok(!lire("js/app-shell.js").includes("flags[planId] === true"), "la copie d'app-shell doit avoir disparu");
// applyAdvisorVisibility reçoit bien le 4e argument à l'appel.
assert.match(lire("js/app-shell.js"), /applyAdvisorVisibility\(session\.planId, featureFlags, session\.testerAccess, session\.planPreinscriptionId\)/);
// Et applyFeatureLocks son 5e, au rappel de dashboard.js.
assert.match(lire("dashboard.js"), /applyFeatureLocks\(planId, featureFlags, testerAccess, hasFitzExpress, session\.planPreinscriptionId\)/);
});

// ------------------------------------------------------------------
// 5. Les liens morts
// ------------------------------------------------------------------

test("aucune occurrence de offers.html#signature-focus dans le dépôt", () => {
const fichiers = [];
const visiter = (rel) => {
for (const e of readdirSync(join(racine, rel), { withFileTypes: true })) {
if (e.name.startsWith(".") || e.name === "node_modules") continue;
const chemin = rel ? `${rel}/${e.name}` : e.name;
if (e.isDirectory()) visiter(chemin);
else if (/\.(js|mjs|html|css)$/.test(e.name)) fichiers.push(chemin);
}
};
visiter("");
const coupables = fichiers.filter((f) => f !== "test/lot-s0.test.mjs" && lire(f).includes("offers.html#signature-focus"));
assert.deepEqual(coupables, [], "« signature-focus » est une formule dépréciée : sa carte n'existe plus sur offers.html");
// Le remplaçant est bien en place.
assert.ok(lire("advisor.js").includes('href="offers.html?parcours=bourse"'));
});

test("preinscriptions.html n'appelle plus la coquille authentifiée, qui ne faisait rien", () => {
const html = lire("preinscriptions.html");
// Le nom subsiste dans le commentaire qui explique le retrait : on
// vérifie l'absence de l'APPEL, pas l'absence du mot.
const sansCom = html.replace(/<!--[\s\S]*?-->/g, " ");
assert.ok(!sansCom.includes("applyAuthenticatedShellIfLoggedIn"), "l'appel était mort : la garde de dual-shell.js rendait null faute de #authShellRoot");
assert.ok(!sansCom.includes("dual-shell.js"), "plus aucun import de la coquille sur cette page");
assert.ok(!sansCom.includes("authShellRoot") && !sansCom.includes("dashboardMainContent"), "la page n'a toujours pas ces ancres — c'est bien pour ça que l'appel ne servait à rien");
// Le lot S4 a TRANCHÉ : cette page reste publique, et le commentaire le
// dit — il ne renvoie plus à un lot futur, il porte la décision.
assert.match(html, /LOT S4 — LA DÉCISION EST PRISE : CETTE PAGE RESTE PUBLIQUE/, "la décision doit être écrite, pas reportée");
assert.ok(!/le sujet du lot S4/.test(html), "plus de renvoi à un lot à venir");
});
