/**
* ============================================================
* test/portails.test.mjs — le portail est une donnée payante (S3)
* ============================================================
*
* LE DÉFAUT QUE CE FICHIER GARDE FERMÉ. Le catalogue est servi en
* fichier statique par Hosting, donc public par construction. Il
* portait `applicationPortalUrl` en clair pour 147 universités sur 155 :
* le verrou de details.js masquait un BOUTON, pas une DONNÉE, et
* « portail réservé aux clients » était une phrase, pas un fait.
*
* Les contrôles vont dans l'ordre de la chaîne : ce que le fichier
* public ne porte plus, ce que le fichier privé porte, à qui le serveur
* le rend, ce que le client en fait, et ce que les pages promettent.
* ============================================================
*/

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { separerPortails, fuitesDePortail, CHAMPS_PORTAIL } from "../scripts/instantane-portails.mjs";
import { boursesSansPortail } from "../scripts/lot-validate.mjs";
import { validerInstantane } from "../js/catalog-snapshot.js";
import { PLAN_ORDER, PLAN_PREINSCRIPTION_ORDER } from "../js/plan-features.js";

const require = createRequire(import.meta.url);
const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(join(racine, f), "utf8").replace(/\r\n/g, "\n");

const publique = JSON.parse(lire("assets/data/catalogue.json"));
const privee = JSON.parse(lire("functions/data/catalogue-portails.json"));
const { droitAuxPortails, PLANS_PAYANTS, PLANS_PREINSCRIPTION } = require(join(racine, "functions/lib/acces.js"));

const MAINTENANT = new Date("2026-09-08T12:00:00Z");
const HIER = "2026-09-07T00:00:00.000Z";
const DEMAIN = "2026-12-01T00:00:00.000Z";

// ------------------------------------------------------------------
// 1. Le fichier public ne porte plus aucun portail
// ------------------------------------------------------------------

test("assets/data/catalogue.json ne contient AUCUN champ de portail", () => {
// Le contrôle qui compte vraiment est textuel : c'est ce que lit
// quelqu'un qui ouvre l'URL du JSON, sans rien savoir de sa forme.
const texte = lire("assets/data/catalogue.json");
assert.equal(texte.includes("applicationPortalUrl"), false, "universities.applicationPortalUrl est encore dans le fichier public");
assert.equal(texte.includes("applicationUrl"), false, "programs.applicationUrl est encore dans le fichier public");
// Et le contrôle par la structure, qui nomme le document fautif.
assert.deepEqual(fuitesDePortail(publique), []);
});

test("tout le reste du catalogue est intact, et js/catalog-snapshot.js le lit sans modification", () => {
const valide = validerInstantane(publique);
assert.ok(valide, "l'instantané amputé doit rester un instantané valide");
// LES COMPTES SE DÉDUISENT, ILS NE SE PHOTOGRAPHIENT PAS (lot 68,
// 2026-09-22). Ce test disait « 156 bourses » en dur : il a rougi le
// jour où le lot 68 a CRÉÉ la bourse régionale DSU du Politecnico — même
// faute que le « 147 » corrigé plus bas, au même fichier. Ce qu'il veut
// dire : l'amputation des portails n'a retiré AUCUN document, et le
// catalogue ne s'est pas effondré. Un plancher garde l'effondrement.
assert.equal(valide.universities.length, publique.universities.length);
assert.equal(valide.scholarships.length, publique.scholarships.length);
assert.ok(publique.universities.length >= 155, `${publique.universities.length} universités — le catalogue a perdu des fiches`);
assert.ok(publique.scholarships.length >= 156, `${publique.scholarships.length} bourses — le catalogue a perdu des fiches`);
assert.ok(valide.programs.length > 300);
// officialWebsite est une SOURCE, pas un privilège : il reste public,
// sur les universités comme sur les bourses — sur TOUTES.
assert.equal(publique.universities.filter((u) => u.officialWebsite).length, publique.universities.length);
assert.equal(publique.scholarships.filter((s) => s.officialWebsite).length, publique.scholarships.length);
// Les champs qui font vivre le catalogue sont là.
const bordeaux = publique.universities.find((u) => u.id === "universite-de-bordeaux-bordeaux");
assert.ok(bordeaux && bordeaux.name && bordeaux.country === "France" && bordeaux.city);
});

// ------------------------------------------------------------------
// 2. Le fichier privé porte les portails, et n'est pas publié
// ------------------------------------------------------------------

// CE TEST PHOTOGRAPHIAIT 147 ET EST TOMBÉ AU LOT SUIVANT (2026-09-14).
//
// Le lot 61 a ajouté le portail de l'IHEID : 148. Le test disait « 147 »
// en dur, et il a fait rougir `npm test` chez Charles pour une donnée
// qui venait d'être CORRIGÉE. Un décompte figé transforme chaque progrès
// en régression apparente.
//
// Ce qu'il voulait dire n'était pas « 147 » mais « la carte porte un
// portail pour toutes les universités qui en ont un, et une URL valide
// pour chacune ». C'est ça qu'on vérifie : le compte se DÉDUIT du
// catalogue, et les sept qui n'ont pas de portail sont nommées, parce
// que c'est un fait vérifié à la source et non un trou (elles portent
// `voieAdmission` à la place — js/voie-admission.js).
const VOIE_AU_LIEU_DUN_PORTAIL = [
"universite-cadi-ayyad-marrakech",
"universite-de-carthage-tunis",
"universite-de-sfax-sfax",
"universite-de-sousse-sousse",
"universite-de-tunis-el-manar-tunis",
"universite-hassan-ii-casablanca",
"universite-mohammed-v-rabat"
];

test("functions/data/catalogue-portails.json porte un portail pour toute université qui en a un", () => {

const ids = new Set(publique.universities.map((u) => u.id));
const avecPortail = Object.keys(privee.universites);
const sansPortail = [...ids].filter((id) => !privee.universites[id]).sort();

// Le compte n'est plus écrit : il se déduit. Ce qui est ÉPINGLÉ, c'est
// la liste de celles qui n'en ont pas — chacune pour une raison
// documentée, chacune portant sa voie d'admission à la place.
assert.deepEqual(sansPortail, [...VOIE_AU_LIEU_DUN_PORTAIL].sort(),
"une université a perdu ou gagné son portail sans que ce test le sache");

assert.equal(avecPortail.length, ids.size - sansPortail.length);
assert.ok(avecPortail.length > 140, `seulement ${avecPortail.length} portails — quelque chose a disparu`);

// Et les sept sans portail disent par où l'on passe : un champ vide
// est une réponse, à condition d'être DITE.
for (const id of VOIE_AU_LIEU_DUN_PORTAIL) {
const u = publique.universities.find((x) => x.id === id);
assert.ok(u, id);
assert.ok(u.voieAdmission, `${id} : sans portail ET sans voie d'admission — la fiche se tairait`);
}

for (const url of Object.values(privee.universites)) assert.match(url, /^https?:\/\//);
// Les 17 universités françaises d'Études en France s'y retrouvent.
const pastel = Object.values(privee.universites).filter((u) => /pastel\.diplomatie\.gouv\.fr\/etudesenfrance/.test(u));
assert.equal(pastel.length, 17);
assert.ok(privee.universites["universite-de-bordeaux-bordeaux"]);
// Les trois cartes existent même vides : la forme ne dépend pas des
// données du jour (bourses et programmes se rempliront plus tard).
assert.deepEqual(Object.keys(privee).sort(), ["bourses", "genereLe", "programmes", "universites"]);
});

test("firebase.json ne publie ni la fonction, ni ses données, ni les scripts qui portent les mêmes URL", () => {
const config = JSON.parse(lire("firebase.json"));
const ignore = config.hosting.ignore;
// TROUVÉ EN ÉCRIVANT CE LOT, et sans rapport avec les portails :
// `"public": "."` servait AUSSI sauvegardes/, où scripts/sauvegarde.mjs
// dépose les instantanés Firestore. https://…/sauvegardes/<date>/users.json
// répondait 200 le 2026-09-08 — 15 comptes avec leurs adresses, plus
// admins.json et payments.json. Le répertoire est gitignoré, ce qui
// masquait le problème : absent du dépôt, mais présent sur le disque au
// moment du `firebase deploy`, donc déployé.
assert.ok(ignore.includes("sauvegardes/**"), "les sauvegardes Firestore ne doivent JAMAIS être servies");
assert.ok(ignore.includes("Claude outputs/**"), "les notes de travail ne sont pas du site");
// Sans cette ligne, tout ce lot serait décoratif : "public": "." sert
// le dépôt entier, functions/ compris — vérifié en ligne le
// 2026-09-08, /functions/paiement.js répondait 200.
assert.ok(ignore.includes("functions/**"), "functions/** doit être exclu de Hosting");
// Les mêmes portails vivent dans scripts/data/lot3*-portails.mjs : les
// retirer du catalogue sans retirer les scripts n'aurait fermé qu'une
// porte sur deux.
assert.ok(ignore.includes("scripts/**"), "scripts/** doit être exclu de Hosting");
assert.ok(ignore.includes("test/**"), "test/** doit être exclu de Hosting");
});

test("aucun fichier PUBLIÉ ne porte d'URL de portail en clair", () => {
// Le balayage que le lot doit passer : on relit les répertoires
// réellement servis, et on y cherche le motif d'un portail connu.
const publies = [];
// Les répertoires exclus ici sont EXACTEMENT ceux que firebase.json
// n'envoie pas (plus assets/, dont le catalogue est vérifié à part).
const exclus = new Set(["node_modules", "functions", "scripts", "test", "assets", "sauvegardes", "Claude outputs"]);
const visiter = (rel) => {
for (const e of readdirSync(join(racine, rel), { withFileTypes: true })) {
if (e.name.startsWith(".") || exclus.has(e.name)) continue;
const chemin = rel ? `${rel}/${e.name}` : e.name;
if (e.isDirectory()) visiter(chemin);
else if (/\.(js|html|json)$/.test(e.name)) publies.push(chemin);
}
};
visiter("");
// Un portail réel du catalogue, choisi au hasard des données : s'il
// apparaît dans un fichier servi, la donnée est encore publique.
const temoin = privee.universites["universite-de-bordeaux-bordeaux"];
const coupables = publies.filter((f) => lire(f).includes(temoin));
assert.deepEqual(coupables, [], `le portail de Bordeaux est encore lisible dans un fichier publié`);
});

// ------------------------------------------------------------------
// 3. La séparation, comme fonction pure
// ------------------------------------------------------------------

test("separerPortails : retire les trois champs, n'en touche aucun autre", () => {
const source = {
genereLe: "2026-09-08T00:00:00.000Z",
universities: [{ id: "u1", name: "U", country: "France", applicationPortalUrl: "https://p/u1", officialWebsite: "https://u1" }],
programs: [{ id: "p1", universityId: "u1", applicationUrl: "https://p/p1", level: "Master" }],
scholarships: [{ id: "b1", title: "B", applicationPortalUrl: "https://p/b1", officialWebsite: "https://b1" }]
};
const { public: pub, portails, comptes } = separerPortails(source);

assert.deepEqual(pub.universities[0], { id: "u1", name: "U", country: "France", officialWebsite: "https://u1" });
assert.deepEqual(pub.programs[0], { id: "p1", universityId: "u1", level: "Master" });
assert.deepEqual(pub.scholarships[0], { id: "b1", title: "B", officialWebsite: "https://b1" });

assert.deepEqual(portails.universites, { u1: "https://p/u1" });
assert.deepEqual(portails.programmes, { p1: "https://p/p1" });
assert.deepEqual(portails.bourses, { b1: "https://p/b1" });
assert.deepEqual(comptes, { universites: 1, programmes: 1, bourses: 1 });

// Un champ VIDE est une réponse, pas un trou à transporter : il sort du
// fichier public et n'entre pas dans la carte.
const vide = separerPortails({ universities: [{ id: "u2", applicationPortalUrl: "" }] });
assert.deepEqual(vide.public.universities[0], { id: "u2" });
assert.deepEqual(vide.portails.universites, {});

// Idempotent : rejouer sur un instantané déjà scindé ne casse rien.
assert.deepEqual(fuitesDePortail(pub), []);
assert.deepEqual(separerPortails(pub).portails.universites, {});
assert.deepEqual(separerPortails(undefined).public.universities, []);
});

test("les trois champs de portail sont nommés une seule fois, dans le module pur", () => {
assert.deepEqual(CHAMPS_PORTAIL, {
universities: "applicationPortalUrl",
programs: "applicationUrl",
scholarships: "applicationPortalUrl"
});
// lot.mjs et separer-portails.mjs passent tous les deux par lui : il
// n'y a pas deux définitions de « ce qui est un portail ».
assert.ok(lire("scripts/lot.mjs").includes('from "./instantane-portails.mjs"'));
assert.ok(lire("scripts/separer-portails.mjs").includes('from "./instantane-portails.mjs"'));
});

// ------------------------------------------------------------------
// 4. Le serveur : à qui la carte est rendue
// ------------------------------------------------------------------

test("droitAuxPortails REFUSE : sans compte, gratuit, formule expirée", () => {
assert.equal(droitAuxPortails(null, MAINTENANT).autorise, false);
assert.equal(droitAuxPortails({}, MAINTENANT).autorise, false);
assert.equal(droitAuxPortails({ plan: "gratuit" }, MAINTENANT).autorise, false);
// L'expiration est LE point déjà oublié une fois côté client : un
// forfait terminé doit se comporter comme un compte gratuit.
assert.equal(droitAuxPortails({ plan: "essentiel-4", planExpiresAt: HIER }, MAINTENANT).autorise, false);
assert.equal(droitAuxPortails({ preinscriptionsPays: { chine: { plan: "dossier-france", expiresAt: HIER } } }, MAINTENANT).autorise, false, "un dossier de pays expiré non plus");
// Hors France, une offre SANS échéance n'ouvre rien (miroir de droitsPreinscription).
assert.equal(droitAuxPortails({ preinscriptionsPays: { chine: { plan: "dossier-france" } } }, MAINTENANT).autorise, false);
// Les anciennes formules sont supprimées (2026-09-24) : hors vocabulaire.
for (const ancien of ["essentiel", "accompagnement", "premium", "signature-focus", "signature"]) {
assert.equal(droitAuxPortails({ plan: ancien }, MAINTENANT).autorise, false, `${ancien} : supprimée, n'ouvre plus rien`);
}
assert.equal(droitAuxPortails({ planPreinscription: "dossier-france", planPreinscriptionExpiresAt: HIER }, MAINTENANT).autorise, false);
assert.equal(droitAuxPortails({ fitzExpressExpiresAt: HIER }, MAINTENANT).autorise, false);
// Une valeur hors vocabulaire n'ouvre rien, même en forgeant le document.
assert.equal(droitAuxPortails({ plan: "administrateur" }, MAINTENANT).autorise, false);
assert.equal(droitAuxPortails({ testerAccess: "oui" }, MAINTENANT).autorise, false, "seul le booléen true compte");
});

test("droitAuxPortails ACCEPTE : plan bourse, plan préinscription (France ou autre pays), testerAccess, Fitz Express", () => {
assert.equal(droitAuxPortails({ plan: "essentiel-4", planExpiresAt: DEMAIN }, MAINTENANT).motif, "plan");
// Sans date d'expiration : une formule sans échéance reste active (le
// webhook en pose toujours une, mais un compte ancien peut ne pas en
// avoir — on ne lui retire pas son accès pour ça).
assert.equal(droitAuxPortails({ plan: "conseiller-6" }, MAINTENANT).autorise, true);
assert.equal(droitAuxPortails({ plan: "premier-dossier" }, MAINTENANT).autorise, true, "la formule la plus basse donne aussi les portails");
assert.equal(droitAuxPortails({ planPreinscription: "dossier-france", planPreinscriptionExpiresAt: DEMAIN }, MAINTENANT).motif, "planPreinscription");
assert.equal(droitAuxPortails({ planPreinscription: "diagnostic-france" }, MAINTENANT).autorise, true);
// Les huit autres pays (2026-09-24) : un Dossier Chine payé ouvre les
// portails comme un Dossier France — ce module ne lisait que la France.
const chine = droitAuxPortails({ preinscriptionsPays: { chine: { plan: "dossier-france", expiresAt: DEMAIN } } }, MAINTENANT);
assert.equal(chine.motif, "preinscriptionPays");
assert.equal(chine.pays, "chine");
assert.equal(droitAuxPortails({ preinscriptionsPays: { maroc: { plan: "diagnostic-france", expiresAt: HIER }, turquie: { plan: "dossier-france-conseiller", expiresAt: DEMAIN } } }, MAINTENANT).planPreinscription, "dossier-france-conseiller");
assert.equal(droitAuxPortails({ testerAccess: true }, MAINTENANT).motif, "testerAccess");
assert.equal(droitAuxPortails({ fitzExpressExpiresAt: DEMAIN }, MAINTENANT).motif, "fitzExpress");
// Un Timestamp Firestore (objet à .toDate()) est lu comme une date.
assert.equal(droitAuxPortails({ plan: "essentiel-4", planExpiresAt: { toDate: () => new Date(DEMAIN) } }, MAINTENANT).autorise, true);
});

test("les listes de formules du serveur sont le MIROIR de celles du site", () => {
// Même garde que test/functions-achat.test.mjs sur la clôture de
// campagne : deux copies, un test qui les compare.
assert.deepEqual(PLANS_PAYANTS, PLAN_ORDER.filter((p) => p !== "gratuit"));
assert.deepEqual(PLANS_PREINSCRIPTION, PLAN_PREINSCRIPTION_ORDER);
});

test("la fonction refuse un anonyme AVANT toute lecture Firestore, et la carte ne vient pas de la base", () => {
const source = lire("functions/portails.js");
assert.ok(source.indexOf("if (!request.auth)") < source.indexOf("collection(\"users\")"), "l'anonyme doit être refusé avant la lecture");
assert.ok(source.includes('require("./data/catalogue-portails.json")'), "la carte est un fichier embarqué, pas 147 lectures Firestore");
assert.ok(!/collection\("universities"\)|collection\("programs"\)/.test(source), "la fonction ne lit pas le catalogue dans Firestore");
assert.ok(lire("functions/index.js").includes('exports.portails = require("./portails").portails'));
assert.ok(source.includes('region: "europe-west1"'));
});

// ------------------------------------------------------------------
// 5. Le client : en mémoire, et jamais sur la machine
// ------------------------------------------------------------------

test("js/portails.js n'écrit rien dans localStorage ni sessionStorage", () => {
const source = lire("js/portails.js");
assert.ok(!/localStorage|sessionStorage|indexedDB/i.test(source.replace(/^\s*\*.*$/gm, "").replace(/\/\/.*$/gm, "")), "aucun stockage persistant : c'est de la donnée payante");
// Et la session peut être oubliée — un poste partagé ne garde pas les
// portails de l'étudiant précédent.
assert.ok(source.includes("export function oublierPortails"));
// Un appel par session, pas par page : la promesse en vol est partagée.
assert.ok(source.includes("if (enVol) return enVol;"));
});

test("details.js résout le portail par le module, plus par l'objet université", () => {
const source = lire("details.js");
assert.ok(source.includes('from "./js/portails.js"'));
assert.ok(source.includes("portailUniversite({ universityId: university.universityId, programId: university.programId })"));
assert.ok(source.includes("applyBtn.href = portail;"), "le bouton pointe sur l'URL servie par la fonction");
// La doctrine d'affichage NE CHANGE PAS : les deux conditions restent.
assert.ok(source.includes("applyBtn.hidden = !isPaidUser || !aUnPortail;"));
// Le lien de PROCÉDURE reste public : il ne peut plus dépendre d'une
// URL que le visiteur n'a pas.
assert.ok(source.includes("trouverProcedure({ paysDestination: university.country })"));
assert.ok(!source.includes("portailDocumente(university.applicationUrl)"));
// Un client de la grille B (préinscription) est un client payant.
assert.ok(source.includes("!!session.planPreinscriptionId"));
});

test("applications.js remplit encore le portail d'une candidature suggérée", () => {
const source = lire("applications.js");
assert.ok(source.includes('from "./js/portails.js"'));
assert.ok(source.includes("function portailDeLEntree(entree)"));
// Les endroits qui écrivent portalUrl depuis le catalogue : le
// remplissage, le remplacement après un REFUS et la remplaçante d'une
// bourse FERMÉE par l'organisme (lot ACCEPTATION) — les trois via
// carteFitz. Les deux points du sélecteur de catalogue ont disparu avec
// lui (lot FITZ-CHOISIT, 2026-09-11 : c'est Fitz qui choisit).
assert.equal((source.match(/portailDeLEntree\(/g) || []).length, 4, "la définition + les trois points de remplissage");
assert.ok(/carteFitz\(rec, \{ portalUrl: portailDeLEntree\(rec\)/.test(source), "le remplissage passe le portail à carteFitz");
assert.ok(/carteFitz\(alternative, \{ portalUrl: portailDeLEntree\(alternative\)/.test(source), "le remplacement aussi");
assert.ok(!/portalUrl: rec\.applicationUrl/.test(source));
assert.ok(!/portalUrl: alternative\.applicationUrl/.test(source));
});

// ------------------------------------------------------------------
// 6. Le champ neuf de la bourse, et les textes qui promettaient trop
// ------------------------------------------------------------------

test("boursesSansPortail : un dépôt chez le bailleur sans portail est un trou de catalogue", () => {
const bourses = [
{ id: "a", entryPoint: "bourse", applicationPortalUrl: "https://x" },
{ id: "b", entryPoint: "bourse" },
{ id: "c", entryPoint: "bourse", applicationPortalUrl: "   " },
{ id: "d", entryPoint: "universite" },
// entryPoint ABSENT = inconnu : on ne réclame rien (règle des trois valeurs).
{ id: "e" }
];
assert.deepEqual(boursesSansPortail(bourses), ["b", "c"]);
assert.deepEqual(boursesSansPortail([]), []);
assert.deepEqual(boursesSansPortail(undefined), []);
});

test("admin/scholarships expose les DEUX liens, avec la distinction écrite", () => {
const html = lire("admin/scholarships.html");
assert.ok(html.includes('id="officialWebsite"'), "la page du bailleur était modifiable nulle part");
assert.ok(html.includes('id="applicationPortalUrl"'), "le portail de dépôt, champ neuf du lot S3");
assert.match(html, /page du bailleur/i);
assert.match(html, /réservé aux abonnés/i);
const js = lire("admin/scholarships.js");
assert.ok(js.includes("officialWebsiteInput") && js.includes("applicationPortalUrlInput"));
// Pré-remplis à l'édition, sinon ré-enregistrer une fiche effacerait
// officialWebsite sur les 156 bourses.
assert.ok(js.includes("officialWebsiteInput.value = s.officialWebsite"));
assert.ok(js.includes('"officialWebsite", "applicationPortalUrl"'), "vidés explicitement = supprimés, jamais \"\"");
});

test("le triage des 156 bourses existe et n'écrit rien en base", () => {
const source = lire("scripts/data/triage-portails-bourses.mjs");
assert.ok(!/firestore|firebase|setDoc|updateDoc/i.test(source.replace(/^\s*\*.*$/gm, "")), "un triage ne touche pas la base");
const csv = lire("scripts/data/triage-portails-bourses.csv").trim().split("\n");
assert.equal(csv[0], "id;titre;pays;entryPoint;url;verdict;raison;dejaRempli;portail");
assert.equal(csv.length, 157, "l'en-tête + les 156 bourses");
});

test("la colonne « déjà rempli » du triage lit la carte PRIVÉE, jamais l'instantané public", () => {

// LE DÉFAUT (corrigé le 2026-09-14). Elle valait
// `b.applicationPortalUrl ? "oui" : ""`, lu dans
// assets/data/catalogue.json — d'où `separerPortails` RETIRE ce champ
// par construction. La colonne était condamnée à rester vide quel que
// soit le remplissage : le script aurait annoncé « 0 fait » le jour où
// les 156 seraient faites, et le deuxième passage qu'il dit servir
// n'aurait servi à rien. C'est un outil de travail dont le compteur
// était mort-né.
const source = lire("scripts/data/triage-portails-bourses.mjs");

assert.ok(source.includes('join(racine, "functions", "data", "catalogue-portails.json")'),
"le triage ne lit plus la carte privée : sa colonne « dejaRempli » ne peut pas se remplir");

const code = source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

assert.ok(!/b\.applicationPortalUrl/.test(code),
"le triage relit applicationPortalUrl dans l'instantané public, d'où le champ est absent");

// Et il survit à l'absence du fichier privé : c'est une colonne
// d'information, elle ne doit pas empêcher le triage sur un dépôt
// frais où `export` n'a pas encore tourné.
assert.match(code, /try\s*\{[\s\S]{0,400}?readFile\(PORTAILS[\s\S]{0,400}?\}\s*catch/,
"un fichier privé manquant fait échouer tout le triage");

// Le compte qui sert à la suite : combien restent, par verdict.
assert.ok(source.includes("FAIT :") && source.includes("RESTE :"),
"le triage ne dit plus combien de portails restent à trouver");

});

test("aucune page ne promet le portail de candidature à un visiteur", () => {
// Les trois phrases relevées par l'audit du lot S3 : elles vivaient
// sur des surfaces PUBLIQUES, dont une qui part dans chaque partage.
assert.ok(!lire("scholarships.html").includes("portail de candidature inclus"));
assert.ok(!lire("scholarship-details.html").includes('content="Conditions, couverture, échéances et portail de candidature'));
// results.html : page publique, donc aucun cadenas et aucun
// « verrouillé » — la doctrine du 2026-08-31 vaut partout.
const results = lire("results.html");
assert.ok(!/reco-locked-icon" data-lucide="lock"/.test(results), "le cadenas de results.html contredisait la doctrine");
assert.ok(!/verrouill/i.test(lire("results.js").split("renderImprovementReveal")[1] || ""), "« verrouillée » ne s'annonce pas à un visiteur");
});
