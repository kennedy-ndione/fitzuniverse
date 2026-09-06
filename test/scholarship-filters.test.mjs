/**
* ============================================================
* Tests — js/scholarship-filters.js
* ============================================================
*
* Comme test/echeance.test.mjs : les chaînes testées ici ne sont pas
* inventées, ce sont, mot pour mot, les 20 valeurs du champ `funding`
* et un échantillon représentatif du champ `ranking` réellement
* présentes dans admin/expand-catalog-batch1..5.js et
* admin/import-universities.js. Un test sur des exemples arrangés ne
* prouverait rien du comportement sur la vraie base.
* ============================================================
*/

import test from "node:test";
import assert from "node:assert/strict";

import {
estFinancementIntegral,
extraireRangQS,
meilleurRangQS
} from "../js/scholarship-filters.js";

/* ==========================================================
* 1. Financement intégral — les 8 valeurs qui commencent par 100 %
* ========================================================== */

test("100 % suivi de n'importe quel détail est intégral", () => {

const valeurs = [
"100% (bourse gouvernementale complète)",
"100% (scolarité + allocation + voyage + programme de leadership)",
"100% (scolarité + bourse mensuelle)",
"100% (scolarité + indemnité mensuelle + billet d'avion)",
"100% (scolarité + logement + vie courante + assurance + billet d'avion annuel)",
"100% (scolarité + logement + voyage + assurance) — pas de bourse partielle",
"100% (scolarité + logement + voyage)",
"100% (scolarité + ~992 €/mois)"
];

for (const v of valeurs) assert.equal(estFinancementIntegral(v), true, v);

});

test("« pas de bourse partielle » ne doit pas être confondu avec « partielle »", () => {

// Le mot "partielle" apparaît littéralement dans cette phrase, mais
// niée par "pas de" — la reconnaissance du financement intégral ne
// doit pas en être perturbée : c'est déjà couvert par le "100%" en
// tête de chaîne, et rien dans MARQUEURS_FINANCEMENT_EXCLUS ne
// réagit au mot "partielle" isolé.
assert.equal(
estFinancementIntegral("100% (scolarité + logement + voyage + assurance) — pas de bourse partielle"),
true
);

});

/* ==========================================================
* 2. Financement intégral — "Scolarité gratuite"
* ========================================================== */

test("« Scolarité gratuite » sans réserve est intégral", () => {

assert.equal(
estFinancementIntegral("Scolarité gratuite + année de roumain si besoin + allocation mensuelle (montant à confirmer)"),
true
);

assert.equal(
estFinancementIntegral("Scolarité gratuite + logement + allocation mensuelle + billet d'avion annuel + couverture santé"),
true
);

});

test("une réserve ailleurs dans la phrase (montant à confirmer) ne doit pas annuler « scolarité gratuite »", () => {

// Le doute porte sur le MONTANT de l'allocation, pas sur la gratuité
// de la scolarité elle-même — la phrase ne doit pas être rejetée en
// bloc pour un détail secondaire incertain.
assert.equal(
estFinancementIntegral("Scolarité gratuite + année de roumain si besoin + allocation mensuelle (montant à confirmer)"),
true
);

});

/* ==========================================================
* 3. Financement intégral — exclusions explicites (priorité absolue)
* ========================================================== */

test("« quasi gratuite » n'est PAS un financement intégral", () => {

// Cas réel qui a dicté l'ordre de priorité du module : "gratuite"
// apparaît dans la phrase, mais "quasi" juste avant dit le contraire.
assert.equal(
estFinancementIntegral("Allocation mensuelle (750 MAD) + logement universitaire prioritaire, scolarité publique marocaine déjà quasi gratuite"),
false
);

});

test("une charge explicitement NON couverte exclut le financement intégral, même avec « intégralement pris en charge » ailleurs", () => {

// Le MEXT japonais : mondialement connu comme une bourse complète,
// mais le texte du catalogue signale lui-même une charge non
// couverte (l'assurance santé) — le filtre suit le texte, pas la
// réputation de la bourse. Voir le commentaire du module.
assert.equal(
estFinancementIntegral(
"Frais de scolarité intégralement pris en charge + allocation mensuelle (117 000-145 000 ¥/mois selon le niveau) + billet d'avion aller-retour — assurance santé NON couverte (à souscrire séparément)"
),
false
);

});

test("« Non quantifié publiquement » n'est pas un financement intégral", () => {

assert.equal(
estFinancementIntegral("Non quantifié publiquement — avance non remboursable de 10 000 MAD à l'acceptation, 10h/semaine de travail requises"),
false
);

});

test("« Variable selon dossier » n'est pas un financement intégral", () => {

assert.equal(estFinancementIntegral("Variable selon dossier"), false);

});

/* ==========================================================
* 4. Financement intégral — partiel ou non affirmé explicitement
* ========================================================== */

test("un montant plafonné (« Jusqu'à X ») n'est pas un financement intégral", () => {

assert.equal(estFinancementIntegral("Jusqu'à 10 000 €/an (inscription, logement max 400 €/mois, billet d'avion, assurance)"), false);

});

test("« Partielle » n'est jamais un financement intégral", () => {

assert.equal(estFinancementIntegral("Partielle (10 000 – 25 000 $ CAD/an, renouvelable jusqu'à 4 ans)"), false);
assert.equal(estFinancementIntegral("Partielle (jusqu'à 19 000 €/an)"), false);

});

test("une liste de postes couverts sans « 100% »/« gratuite » n'est PAS présumée intégrale", () => {

// KGSP, bourses turques, CSC : des bourses réputées complètes, mais
// dont le texte du catalogue ne l'affirme pas explicitement — le
// module ne doit rien inventer au-delà de ce que dit le texte.
const valeurs = [
"Frais d'inscription + indemnité mensuelle + billet d'avion + assurance santé/rapatriement",
"Scolarité + année de coréen + allocation mensuelle (~1 000 000 KRW/mois en master) + indemnité d'installation + billet d'avion + assurance santé",
"Scolarité + logement + allocation mensuelle (4 500-9 000 TL/mois selon niveau) + assurance santé + billet d'avion + année de turc obligatoire"
];

for (const v of valeurs) assert.equal(estFinancementIntegral(v), false, v);

});

/* ==========================================================
* 5. Financement intégral — valeur absente
* ========================================================== */

test("un champ funding vide ou absent n'est jamais un financement intégral", () => {

assert.equal(estFinancementIntegral(""), false);
assert.equal(estFinancementIntegral(undefined), false);
assert.equal(estFinancementIntegral(null), false);

});

/* ==========================================================
* 6. Classement QS — extraction du rang
* ========================================================== */

test("extrait le rang d'un classement simple", () => {

assert.equal(extraireRangQS("#45 mondial (QS)"), 45);
assert.equal(extraireRangQS("#3 mondial (QS 2026) — 1ʳᵉ université d'Europe continentale"), 3);
assert.equal(extraireRangQS("#367 mondial (QS 2026) — #3 mondial en Sciences politiques"), 367);

});

test("sur un intervalle, retient la première valeur (la plus favorable)", () => {

assert.equal(extraireRangQS("#711-720 mondial (QS)"), 711);
assert.equal(extraireRangQS("#1201-1400 mondial (QS)"), 1201);
assert.equal(extraireRangQS("#251-300 mondial (Médecine - QS)"), 251);

});

test("une description sans numéro ne renvoie aucun rang — jamais un rang inventé", () => {

assert.equal(extraireRangQS("Grande université francophone de Belgique (LERU)"), null);
assert.equal(extraireRangQS("Université publique de référence à Casablanca"), null);
assert.equal(extraireRangQS("Université reconnue en ingénierie et technologies"), null);
assert.equal(extraireRangQS(""), null);
assert.equal(extraireRangQS(undefined), null);

});

/* ==========================================================
* 7. Meilleur rang parmi plusieurs universités liées
* ========================================================== */

test("meilleurRangQS retient le rang le plus favorable (le plus petit nombre)", () => {

const universites = [
{ ranking: "#367 mondial (QS 2026)" },
{ ranking: "#29 mondial (QS 2026)" },
{ ranking: "#130 mondial (QS 2026)" }
];

assert.equal(meilleurRangQS(universites), 29);

});

test("meilleurRangQS ignore les universités sans rang numérique plutôt que de les traiter comme les moins bien classées", () => {

const universites = [
{ ranking: "Grande université francophone de Belgique (LERU)" },
{ ranking: "#193 mondial (QS 2026)" }
];

assert.equal(meilleurRangQS(universites), 193);

});

test("meilleurRangQS renvoie null si aucune université liée n'a de rang numérique", () => {

assert.equal(meilleurRangQS([{ ranking: "Université de référence en Wallonie" }]), null);
assert.equal(meilleurRangQS([]), null);
assert.equal(meilleurRangQS(undefined), null);

});

/* ==========================================================
* 4. enrichWithProgramData (scholarships.js) — partnerCount
* dédoublonné par université
*
* POURQUOI LE DÉDOUBLONNAGE EST NÉCESSAIRE : la base modélise UN
* programme par couple (université, niveau) — une université qui offre
* la même bourse en Licence ET en Master apparaît donc deux fois dans
* linkedUniversities. Compter .length compte des programmes, pas des
* universités : mesuré sur la vraie base, chinese-government-scholarship
* affichait « 41 universités partenaires » pour 15 universités réelles,
* et stipendium-hungaricum « 33 » pour 11. Le comptage doit passer par
* un Set d'identifiants d'université ; linkedUniversities, lui, reste
* volontairement non dédoublonné (photo, drapeau et meilleurRangQS s'en
* accommodent — un doublon n'y change rien).
*
* scholarships.js est un module navigateur (imports CDN Firebase) :
* impossible à importer sous Node. enrichWithProgramData est EXTRAITE
* DU FICHIER RÉEL et évaluée dans un contexte vm avec ses deux
* dépendances pures injectées — même approche que
* test/admin-eligibility-form.test.mjs.
* ========================================================== */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import vm from "node:vm";
import { resolveScholarshipImage } from "../js/scholarship-image.js";
import { etatCandidature } from "../js/echeance.js";

function chargerEnrichWithProgramData() {

const source = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "..", "scholarships.js"), "utf8");

const debut = source.indexOf("function enrichWithProgramData(");
assert.notEqual(debut, -1, "enrichWithProgramData introuvable dans scholarships.js");
let i = source.indexOf("{", debut);
let profondeur = 0;
do {
if (source[i] === "{") profondeur++;
if (source[i] === "}") profondeur--;
i++;
} while (profondeur > 0 && i < source.length);

// etatCandidature ajoutée le 2026-09-05 : enrichWithProgramData
// calcule désormais l'état réel des candidatures (voir la pastille des
// cartes). La fonction est extraite du fichier et exécutée dans un vm
// sans ses imports — toute nouvelle dépendance doit être déclarée ici,
// sinon le test échoue sur « ... is not defined » et non sur ce qu'il
// prétend vérifier.
const contexte = { resolveScholarshipImage, meilleurRangQS, etatCandidature };
vm.createContext(contexte);
vm.runInContext(`${source.slice(debut, i)}\nthis.enrichWithProgramData = enrichWithProgramData;`, contexte);
return contexte.enrichWithProgramData;

}

test("partnerCount : 3 programmes sur 2 universités comptent 2 partenaires, pas 3", () => {

const enrich = chargerEnrichWithProgramData();

// Le motif réel du défaut : u1 offre la bourse en Licence ET en Master
// (deux documents "programs"), u2 en Master seulement.
const programs = [
{ scholarshipId: "bourse-x", universityId: "u1", level: "Licence" },
{ scholarshipId: "bourse-x", universityId: "u1", level: "Master" },
{ scholarshipId: "bourse-x", universityId: "u2", level: "Master" },
// Bruit : autre bourse et université inconnue, aucun des deux ne compte.
{ scholarshipId: "autre-bourse", universityId: "u1", level: "Master" },
{ scholarshipId: "bourse-x", universityId: "u-disparue", level: "Master" }
];

const universitiesById = new Map([
["u1", { country: "Chine", image: "beijing.jpg", flag: "cn.svg", ranking: "#12 mondial (QS 2026)" }],
["u2", { country: "Chine", image: "shanghai.jpg", flag: "cn.svg", ranking: "#52 mondial (QS 2026)" }]
]);

const enriched = enrich(
{ id: "bourse-x", title: "Bourse X", country: "Chine" },
programs,
universitiesById,
new Map()
);

assert.equal(enriched.partnerCount, 2);

// Le reste de l'enrichissement n'est pas dégradé par le correctif :
// photo/drapeau/rang viennent toujours du linkedUniversities complet.
assert.equal(enriched.flag, "cn.svg");
assert.equal(enriched.bestRanking, 12);
assert.equal(enriched.image, "assets/images/cities/beijing-800w.jpg");

});

test("partnerCount : 0 pour une bourse sans programme lié (stub)", () => {

const enrich = chargerEnrichWithProgramData();
const enriched = enrich({ id: "stub", title: "Stub", country: "Maroc" }, [], new Map(), new Map());
assert.equal(enriched.partnerCount, 0);

});
