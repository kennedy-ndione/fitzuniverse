/**
 * ============================================================
 * test/diagnostic-garde.test.mjs — deux promesses tenues
 * ============================================================
 *
 * Les deux défauts trouvés le 2026-09-20 en faisant, pas à pas et sur le
 * site déployé, le parcours d'un vrai compte gratuit.
 *
 *  1. L'ACCUEIL D'UN COMPTE GRATUIT ÉTAIT VIDE. css/journey.css replie
 *     le contenu des phases tant que le <body> ne porte pas
 *     `data-parcours-pret`. Ce drapeau n'était levé que dans la chaîne
 *     du hub accompagné (dashboard.js) ; l'accueil minimal, démasqué par
 *     js/aiguillage.js pour les comptes SANS accompagnement, ne passait
 *     jamais par là. L'étudiant voyait deux titres nus, sous une phrase
 *     qui lui promettait une action « juste en dessous ».
 *     Le 2026-09-28, la même panne sur test-prep.html : la garde 8 bis
 *     tient désormais la règle pour TOUTE page qui porte des phases.
 *
 *  2. « CONSERVEZ VOTRE DIAGNOSTIC » N'ÉTAIT PAS TENU. Les réponses
 *     vivaient dans le sessionStorage de l'onglet, et le report vers le
 *     profil n'avait lieu qu'à la CRÉATION du compte. Faire le
 *     diagnostic après s'être inscrit — l'ordre que le site propose —
 *     laissait le profil à 0/6.
 *
 * Ce fichier tient les deux : la règle d'affichage par une garde de
 * forme sur les sources, la mémoire du diagnostic par des tests de
 * comportement sur un module pur.
 * ============================================================
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import {
memoriser, lireMemoire, oublier, miseAJourDuCompte, CLE_MEMOIRE, JOURS_VALIDITE
} from "../js/diagnostic-garde.js";
import { lireReponsesDiagnostic } from "../js/diagnostic-vers-profil.js";
import { pagesAModules, entreesDe, grapheDe } from "../scripts/precharger.mjs";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(path.join(RACINE, f), "utf8").replace(/\r\n/g, "\n");

const LE_JOUR = new Date("2026-09-20T22:00:00Z");

// Les réponses telles que eligibility-questions.js les écrit, pour le
// profil réellement joué en production ce soir-là.
const REPONSES = {
currentLevel: "Licence obtenue",
targetLevel: "Master",
diplomaWhen: "Il y a 1 à 2 ans",
workExperience: "Aucune pour l'instant",
country: "Sénégal",
nationality: "Sénégalaise",
studyCategory: "Informatique",
ageBracket: "25 – 29 ans",
english: "Bon niveau",
french: "Courant / Langue maternelle",
langCert: "Oui, en anglais (IELTS, TOEFL…)",
timeline: "Dans les 6 prochains mois",
destinationCountry: "France",
goal: "Une bourse complète",
passport: "Passeport valide"
};

/** Un localStorage de laboratoire : le module ne doit dépendre d'aucun
 *  navigateur, et c'est ce qui le rend vérifiable ici. */
function stockageFactice(initial = {}) {
const m = new Map(Object.entries(initial));
return {
getItem: (k) => (m.has(k) ? m.get(k) : null),
setItem: (k, v) => m.set(k, String(v)),
removeItem: (k) => m.delete(k),
get taille() { return m.size; }
};
}

// ------------------------------------------------------------------
// 1. La mémoire survit à l'onglet — et ne ment pas sur son âge
// ------------------------------------------------------------------

test("garde 1 — le diagnostic mémorisé se relit, avec sa date", () => {

const s = stockageFactice();
assert.equal(memoriser(REPONSES, { maintenant: LE_JOUR, stockage: s }), true);

const relu = lireMemoire({ maintenant: LE_JOUR, stockage: s });
assert.deepEqual(relu, REPONSES);

// La date est écrite à côté des réponses, pas devinée à la relecture.
const paquet = JSON.parse(s.getItem(CLE_MEMOIRE));
assert.equal(paquet.le, LE_JOUR.toISOString());

});

test("garde 2 — un diagnostic trop vieux ne pré-remplit plus rien", () => {

// Un diagnostic n'est pas un état civil : il décrit un étudiant à un
// moment. Pré-remplir un compte avec les réponses d'il y a un an est
// pire que ne rien pré-remplir — l'étudiant ne les relit pas, et
// candidate avec un portrait périmé.
const s = stockageFactice();
memoriser(REPONSES, { maintenant: LE_JOUR, stockage: s });

const veille = new Date(LE_JOUR.getTime() + (JOURS_VALIDITE - 1) * 86400000);
const lendemain = new Date(LE_JOUR.getTime() + (JOURS_VALIDITE + 1) * 86400000);

assert.deepEqual(lireMemoire({ maintenant: veille, stockage: s }), REPONSES, "la veille de l'échéance, c'est encore bon");
assert.equal(lireMemoire({ maintenant: lendemain, stockage: s }), null, "le lendemain, non");
assert.equal(JOURS_VALIDITE, 90, "trois mois");

});

test("garde 3 — une mémoire absente, illisible ou refusée ne fait jamais tomber la page", () => {

// Navigation privée, quota plein, stockage bloqué par l'entreprise :
// tous ces cas existent chez le public de ce site. Aucun ne doit
// produire une exception.
assert.equal(lireMemoire({ stockage: stockageFactice() }), null);
assert.equal(lireMemoire({ stockage: stockageFactice({ [CLE_MEMOIRE]: "{pas du json" }) }), null);
assert.equal(lireMemoire({ stockage: stockageFactice({ [CLE_MEMOIRE]: '{"le":"pas une date","reponses":{"a":1}}' }) }), null);
assert.equal(lireMemoire({ stockage: stockageFactice({ [CLE_MEMOIRE]: '{"le":"2026-09-20T22:00:00Z"}' }) }), null);

const refuse = { getItem() { throw new Error("refusé"); }, setItem() { throw new Error("refusé"); }, removeItem() { throw new Error("refusé"); } };
assert.equal(lireMemoire({ stockage: refuse }), null);
assert.equal(memoriser(REPONSES, { stockage: refuse }), false);
assert.equal(oublier({ stockage: refuse }), false);

// Et sous Node, sans localStorage du tout.
assert.equal(lireReponsesDiagnostic(), null);

});

// ------------------------------------------------------------------
// 2. L'écriture dans le compte — et ce qu'elle n'écrase pas
// ------------------------------------------------------------------

test("garde 4 — un compte au profil vide reçoit le diagnostic", () => {

const maj = miseAJourDuCompte({ uid: "u1", profile: {} }, REPONSES, { aujourdhui: LE_JOUR });

assert.ok(maj, "il y a quelque chose à écrire");
assert.equal(maj.profile.nationality, "Sénégalaise");
assert.equal(maj.profile.country, "Sénégal");
assert.equal(maj.profile.desiredDegree, "Master");
assert.equal(maj.profile.lastDegree, "Licence");
assert.equal(maj.profile.desiredField, "Informatique");

// Les alias du schéma plat, comme js/compte-par-defaut.js les pose à
// la création : sans eux, profile.js lirait des cases vides à côté
// des cases remplies.
assert.equal(maj.profile.originCountry, "Sénégal");
assert.equal(maj.profile.currentDegree, "Licence");
assert.equal(maj.profile.desiredCountry, "France");

// Les réponses brutes sont gardées telles quelles : c'est ce qui
// permettra un jour de rejouer le diagnostic sans le refaire.
assert.deepEqual(maj.diagnostic, REPONSES);
assert.ok(maj.diagnosticLe);

});

test("garde 5 — JAMAIS écraser une réponse déjà donnée", () => {

// Le cas qui compte : l'étudiant a corrigé sa nationalité à la main
// dans son profil. Un diagnostic refait ne doit pas la réécrire.
const compte = { profile: { nationality: "Malienne", desiredField: "Droit" } };
const maj = miseAJourDuCompte(compte, REPONSES, { aujourdhui: LE_JOUR });

assert.equal(maj.profile.nationality, "Malienne", "la valeur saisie gagne, toujours");
assert.equal(maj.profile.desiredField, "Droit");
assert.equal(maj.profile.country, "Sénégal", "les cases VIDES, elles, se remplissent");

// L'objet d'origine n'est pas modifié.
assert.equal(compte.profile.country, undefined);

});

test("garde 6 — rien de neuf, aucune écriture", () => {

// La page de résultats peut être rouverte dix fois. Sans cette
// sortie, chaque ouverture coûterait une écriture Firestore pour
// réécrire exactement la même chose.
const complet = miseAJourDuCompte({ profile: {} }, REPONSES, { aujourdhui: LE_JOUR });
const compte = { profile: complet.profile, diagnostic: REPONSES };

assert.equal(miseAJourDuCompte(compte, REPONSES, { aujourdhui: LE_JOUR }), null);

// Mais un diagnostic DIFFÉRENT s'écrit, même si le profil est plein.
const autre = { ...REPONSES, destinationCountry: "Canada" };
assert.ok(miseAJourDuCompte(compte, autre, { aujourdhui: LE_JOUR }));

// Et des réponses vides ne déclenchent jamais d'écriture.
assert.equal(miseAJourDuCompte({ profile: {} }, null, {}), null);
assert.equal(miseAJourDuCompte({ profile: {} }, {}, {}), null);

});

test("garde 7 — le document écrit ne touche QUE ses trois clés", () => {

// users/{uid} porte la formule, les alertes, l'historique de
// paiement. Une écriture large depuis la page de résultats serait une
// perte de données, et firestore.rules refuserait les champs admin.
const maj = miseAJourDuCompte({ profile: {}, plan: "signature", alerteBourses: true }, REPONSES, { aujourdhui: LE_JOUR });

assert.deepEqual(Object.keys(maj).sort(), ["diagnostic", "diagnosticLe", "profile"]);
for (const interdit of ["plan", "planExpiresAt", "disabled", "testerAccess", "alerteBourses"]) {
assert.equal(interdit in maj, false, `${interdit} n'a rien à faire dans cette écriture`);
}

// Et l'appelant écrit bien en fusion, pas en remplacement.
assert.match(lire("results.js"), /setDoc\(reference, maj, \{ merge: true \}\)/);

});

// ------------------------------------------------------------------
// 3. Les deux gardes de forme
// ------------------------------------------------------------------

test("garde 8 — toute branche qui démasque une phase lève le repli du CSS", () => {

// LA RÈGLE : `data-parcours-pret` est un état TRANSITOIRE. Le CSS
// replie par défaut pour éviter un effondrement à l'écran ; il faut
// donc que CHAQUE chemin qui finit de peindre le lève.
const css = lire("css/journey.css");
assert.match(css, /body:not\(\[data-parcours-pret\]\) \.jy-phase > \*:not\(\.jy-phase-head\)\{/,
"la règle de repli a changé de forme : cette garde doit être relue");

const aiguillage = lire("js/aiguillage.js");
assert.ok(aiguillage.includes('document.body.dataset.parcoursPret = "1"'),
"l'accueil minimal doit lever le repli : sans cela, un compte gratuit ne voit que deux titres nus");
assert.match(aiguillage, /\.catch\(/,
"et une session qui échoue ne doit pas laisser la page repliée");

// Les deux sorties de dashboard.js ne se perdent pas non plus.
assert.equal((lire("dashboard.js").match(/dataset\.parcoursPret = "1"/g) || []).length, 2,
"dashboard.js doit lever le repli à la fin du rendu ET dans son .catch");

});

test("garde 8 bis — toute page qui porte des phases lève le repli, dans son propre graphe de modules", () => {

// Trouvé le 2026-09-28 : test-prep.html charge css/journey.css et porte
// deux .jy-phase, mais aucun de ses modules ne levait le repli. Depuis le
// lot ESPACE-ETUDIANT (2026-09-14), la page ne montrait que ses deux
// titres — ni fiches, ni tests. La garde 8 ne pouvait pas le voir : elle
// relit les deux fichiers qui lèvent DÉJÀ le repli. Celle-ci part des
// PAGES : chacune doit avoir, dans le graphe statique de ses modules
// (celui du bloc de préchargement), au moins un module qui le lève.
// Preuve par mutation (2026-09-28) : la levée retirée de test-prep.js →
// rouge sur test-prep.html seul (« aucun de ses 55 modules »).
const classePhase = /class="(?:[^"]*\s)?jy-phase(?:\s[^"]*)?"/;
const pages = pagesAModules().filter((page) => {
const html = lire(page);
return html.includes('href="css/journey.css"') && classePhase.test(html);
});
assert.ok(pages.includes("test-prep.html"), `test-prep.html n'est plus parmi les pages à phases (${pages.join(", ")}) : cette garde doit être relue`);

for (const page of pages) {
const fichier = path.join(RACINE, page);
const dossier = path.dirname(fichier);
const modules = grapheDe(entreesDe(readFileSync(fichier, "utf8"), dossier), dossier).filter((m) => !/^https?:\/\//.test(m));
const leveurs = modules.filter((m) => readFileSync(path.join(dossier, m), "utf8").includes('document.body.dataset.parcoursPret = "1"'));
assert.ok(leveurs.length > 0,
`${page} porte des .jy-phase et charge css/journey.css, mais aucun de ses ${modules.length} modules ne lève le repli : l'étudiant ne voit que les titres des phases`);
}

});

test("garde 9 — la page d'inscription ne promet que ce qui est tenu", () => {

const inscription = lire("inscription.html");
assert.match(inscription, /Conservez votre diagnostic/,
"la promesse est en titre de la page");

// Ce qui la tient, désormais : la page de résultats mémorise et écrit.
const results = lire("results.js");
assert.ok(results.includes("js/diagnostic-garde.js"), "results.js doit charger la garde");
assert.match(results, /memoriser\(reponses\)/, "mémoire locale, pour tout le monde");
assert.match(results, /miseAJourDuCompte\(/, "écriture au compte, pour les connectés");
assert.match(results, /console\.warn\("Le diagnostic n'a pas pu être conservé/,
"et un échec de sauvegarde ne doit jamais emporter l'affichage du diagnostic");

// Et la lecture retombe sur la mémoire locale quand l'onglet est neuf.
assert.match(lire("js/diagnostic-vers-profil.js"), /fitz_diagnostic/,
"lireReponsesDiagnostic doit connaître la mémoire locale");

});
