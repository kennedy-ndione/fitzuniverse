/**
* ============================================================
* Tests — js/echeance.js
* ============================================================
*
* Les chaînes testées ici ne sont pas inventées : ce sont, mot pour
* mot, les valeurs du champ `deadline` présentes dans
* admin/expand-catalog-batch1..5.js et admin/import-universities.js.
* Un test qui passerait sur des exemples arrangés ne prouverait rien
* du comportement sur la vraie base.
*
* La propriété la plus importante à protéger est négative : le module
* ne doit JAMAIS produire une date là où la prose n'en garantit pas
* une. Plusieurs tests ci-dessous ne vérifient que ça.
* ============================================================
*/

import test from "node:test";
import assert from "node:assert/strict";

import {
analyserEcheance,
joursAvant,
etatAffichable,
formaterDate,
libelleEcheance,
scoreOpportunite,
classerOpportunites,
opportunitesOuvertes,
JOURS_CRITIQUE,
JOURS_PROCHE
} from "../js/echeance.js";

/** Date de référence figée : les tests ne doivent pas dépendre du jour. */
const LE_27_AOUT = new Date("2026-08-27T09:00:00Z");

/* ==========================================================
* 1. Dates nettes
* ========================================================== */

test("lit une date simple du catalogue", () => {

const e = analyserEcheance("15 février 2027");

assert.equal(e.etat, "datee");
assert.equal(e.date, "2027-02-15");
assert.equal(e.confiance, "haute");
assert.equal(e.texte, "15 février 2027");

});

test("lit les autres dates simples présentes en base", () => {

const cas = [
["15 janvier 2027", "2027-01-15"],
["6 novembre 2026", "2026-11-06"],
["30 novembre 2026", "2026-11-30"],
["1 décembre 2026", "2026-12-01"],
["21 janvier 2027", "2027-01-21"]
];

for (const [texte, attendu] of cas) {
assert.equal(analyserEcheance(texte).date, attendu, texte);
}

});

test("lit une date suivie d'une parenthèse de campagne", () => {

// admin/expand-catalog-batch2.js — DAAD
const e = analyserEcheance("31 août 2026 (campagne 2027)");

assert.equal(e.etat, "datee");
assert.equal(e.date, "2026-08-31");

});

test("lit l'heure et le fuseau quand ils sont donnés", () => {

// admin/expand-catalog-batch3.js — Chevening ferme à l'heure près
const e = analyserEcheance("6 octobre 2026, 11h00 UTC (candidature 2027-2028)");

assert.equal(e.date, "2026-10-06");
assert.equal(e.heure, "11:00");
assert.equal(e.fuseau, "UTC");

});

test("lit une heure sans minutes", () => {

// admin/expand-catalog-batch1.js — Knight-Hennessy
const e = analyserEcheance("6 octobre 2026, 13h (heure Pacifique)");

assert.equal(e.date, "2026-10-06");
assert.equal(e.heure, "13:00");
assert.equal(e.fuseau, "Pacifique");

});

test("lit « 12h00 » sur la ligne ARES", () => {

const e = analyserEcheance("18 septembre 2026, 12h00 (candidature 2027-2028)");

assert.equal(e.date, "2026-09-18");
assert.equal(e.heure, "12:00");

});

/* ==========================================================
* 2. Ce qu'il ne faut SURTOUT pas dater
* ========================================================== */

test("refuse de dater « À confirmer selon l'année académique »", () => {

const e = analyserEcheance("À confirmer selon l'année académique");

assert.equal(e.etat, "inconnue");
assert.equal(e.date, null);
assert.equal(e.texte, "À confirmer selon l'année académique");

});

test("refuse de dater « À confirmer selon l'appel à candidatures »", () => {

assert.equal(analyserEcheance("À confirmer selon l'appel à candidatures").date, null);

});

test("une date « estimée » n'est jamais présentée comme une échéance", () => {

// admin/expand-catalog-batch5.js — MEXT
const e = analyserEcheance(
"Fermée pour ce cycle — prochaine fenêtre estimée avril 2027 (non confirmée)"
);

assert.equal(e.etat, "close");
assert.equal(e.date, null);

});

test("le GKS, avec ses deux fenêtres estimées, reste inconnu", () => {

const e = analyserEcheance(
"GKS-U (Licence) : prochaine fenêtre estimée septembre 2026 — GKS-G (Master/Doctorat) : estimée février-mars 2027, aucune date confirmée"
);

assert.equal(e.etat, "inconnue");
assert.equal(e.date, null);

});

test("un cycle clos ne rend pas la date de sa propre clôture", () => {

// Le piège central : la date est lisible, mais c'est celle du
// cycle PRÉCÉDENT. L'afficher serait un contresens dangereux.
const e = analyserEcheance(
"Cycle 2025-2026 clos le 31 mars 2026 — prochaine fenêtre estimée février-mars 2027"
);

assert.equal(e.etat, "close");
assert.equal(e.date, null, "la date du cycle clos ne doit jamais remonter");

});

test("un appel clos avec réouverture annoncée reste clos", () => {

const e = analyserEcheance(
"Appel 2026-2027 clos — réouverture 2027-2028 prévue mi-novembre 2026"
);

assert.equal(e.etat, "close");
assert.equal(e.date, null);

});

test("« Fermée, réouverture annuelle non datée »", () => {

assert.equal(analyserEcheance("Fermée, réouverture annuelle non datée").etat, "close");

});

test("« Variable, fixée chaque année par le ministère » reste inconnu", () => {

const e = analyserEcheance(
"Variable, fixée chaque année par le ministère de l'enseignement supérieur du pays d'origine"
);

assert.equal(e.etat, "inconnue");

});

test("« deadline par pays publiée ensuite » reste inconnu malgré la date d'ouverture", () => {

// admin/expand-catalog-batch2.js — bourses suisses
const e = analyserEcheance(
"Campagne 2027/2028 : ouverture 20 août 2026, deadline par pays publiée ensuite"
);

assert.equal(e.etat, "inconnue");
assert.equal(e.date, null, "la date d'OUVERTURE ne doit pas passer pour une clôture");

});

test("une date impossible n'est pas rattrapée en silence", () => {

assert.equal(analyserEcheance("31 février 2027").etat, "inconnue");

});

test("une chaîne vide ou absente ne casse rien", () => {

for (const valeur of ["", "   ", null, undefined, 42]) {
const e = analyserEcheance(valeur);
assert.equal(e.etat, "inconnue");
assert.equal(e.date, null);
}

});

/* ==========================================================
* 3. Plusieurs dates : « jusqu'au » désigne la clôture
* ========================================================== */

test("retient la date de clôture, pas celle d'ouverture", () => {

// admin/expand-catalog-batch3.js — Open Doors
const e = analyserEcheance(
"Inscription dès le 20 août 2026, 1ère étape jusqu'au 1er novembre 2026 (Licence/Master), résultats finaux 26 février 2027 (Doctorat/Postdoctorat)"
);

assert.equal(e.etat, "datee");
assert.equal(e.date, "2026-11-01");
assert.equal(e.confiance, "moyenne", "plusieurs dates : la confiance baisse");

});

/* ==========================================================
* 4. Candidatures continues
* ========================================================== */

test("reconnaît une candidature continue", () => {

// admin/expand-catalog-batch1.js — Mastercard Foundation
const e = analyserEcheance("Continu jusqu'à l'automne 2028 (1ᵉʳ tour du programme visé)");

assert.equal(e.etat, "continue");
assert.equal(etatAffichable(e, LE_27_AOUT), "continue");

});

/* ==========================================================
* 5. Décompte et états d'affichage
* ========================================================== */

test("compte les jours restants en jours pleins", () => {

const e = analyserEcheance("31 août 2026 (campagne 2027)");

assert.equal(joursAvant(e, LE_27_AOUT), 4);

});

test("le décompte ignore l'heure de la journée", () => {

const e = analyserEcheance("31 août 2026");

const matin = new Date("2026-08-27T00:01:00Z");
const soir = new Date("2026-08-27T23:59:00Z");

assert.equal(joursAvant(e, matin), joursAvant(e, soir));

});

test("une échéance dépassée bascule en « close »", () => {

const e = analyserEcheance("15 janvier 2026");

assert.equal(etatAffichable(e, LE_27_AOUT), "close");

});

test("les trois paliers d'urgence", () => {

const critique = analyserEcheance("31 août 2026");        // 4 j
const proche = analyserEcheance("6 octobre 2026");        // 40 j
const calme = analyserEcheance("15 février 2027");        // 172 j

assert.equal(etatAffichable(critique, LE_27_AOUT), "critique");
assert.equal(etatAffichable(proche, LE_27_AOUT), "proche");
assert.equal(etatAffichable(calme, LE_27_AOUT), "ouverte");

});

test("les seuils sont ceux du bandeau public, pas ceux du parcours", () => {

// Garde-fou volontaire : si quelqu'un aligne un jour ces valeurs
// sur celles de next-action.js (3 et 14), ce test le signale.
assert.equal(JOURS_CRITIQUE, 14);
assert.equal(JOURS_PROCHE, 60);

});

test("le libellé affiché dit ce qu'il faut, au bon ton", () => {

assert.deepEqual(
libelleEcheance(analyserEcheance("31 août 2026"), LE_27_AOUT),
{ ton: "critique", chiffre: "4", texte: "jours restants", titre: "Clôture le 31 août 2026" }
);

const dernierJour = libelleEcheance(analyserEcheance("27 août 2026"), LE_27_AOUT);
assert.equal(dernierJour.texte, "Dernier jour");
assert.equal(dernierJour.chiffre, "");

const demain = libelleEcheance(analyserEcheance("28 août 2026"), LE_27_AOUT);
assert.equal(demain.texte, "jour restant");
assert.equal(demain.chiffre, "1");

});

test("le titre au survol porte l'heure et le fuseau quand ils existent", () => {

const l = libelleEcheance(
analyserEcheance("6 octobre 2026, 11h00 UTC (candidature 2027-2028)"),
LE_27_AOUT
);

assert.equal(l.titre, "Clôture le 6 octobre 2026, 11h00 UTC");

});

test("formaterDate écrit « 1er » et pas « 1 »", () => {

assert.equal(formaterDate("2026-12-01"), "1er décembre 2026");
assert.equal(formaterDate("2026-12-02"), "2 décembre 2026");
assert.equal(formaterDate(null), "");

});

/* ==========================================================
* 6. Le classement — la consigne de Charles
* ========================================================== */

const BERKELEY = {
nom: "Mastercard Foundation Scholars — UC Berkeley",
couverture: "100% (scolarité + logement + voyage) — réservé aux citoyens de pays africains",
echeance: analyserEcheance("Continu jusqu'à l'automne 2028 (1ᵉʳ tour du programme visé)")
};

const DAAD = {
nom: "DAAD Study Scholarships",
couverture: "100% scolarité + ~992 €/mois",
echeance: analyserEcheance("31 août 2026 (campagne 2027)")   // 4 jours
};

const MCGILL = {
nom: "McGill Major Entrance Scholarships",
couverture: "Montant variable selon dossier",
echeance: analyserEcheance("21 janvier 2027")                 // 147 jours
};

const CLOSE = {
nom: "MEXT Scholarship",
couverture: "100% scolarité + allocation mensuelle",
echeance: analyserEcheance("Fermée pour ce cycle — prochaine fenêtre estimée avril 2027 (non confirmée)")
};

test("une opportunité réservée aux Africains est valorisée", () => {

const avec = scoreOpportunite(BERKELEY, LE_27_AOUT);

const sans = scoreOpportunite(
{ ...BERKELEY, couverture: "100% (scolarité + logement + voyage)" },
LE_27_AOUT
);

assert.ok(avec > sans, "la mention « pays africains » doit peser");

});

test("une couverture totale passe devant une couverture partielle, à urgence égale", () => {

const totale = { couverture: "100% scolarité", echeance: analyserEcheance("15 février 2027") };
const partielle = { couverture: "Jusqu'à 19 000 €/an (partielle)", echeance: analyserEcheance("15 février 2027") };

assert.ok(scoreOpportunite(totale, LE_27_AOUT) > scoreOpportunite(partielle, LE_27_AOUT));

});

test("la pertinence pour le public passe devant l'urgence", () => {

// Consigne de Charles : « toujours mettre en avant les opportunités
// qui attirent les étudiants africains ». Berkeley est intégralement
// financée, réservée aux citoyens africains, et sans date limite
// avant 2028 — elle ouvre le bandeau, devant une bourse allemande
// qui ferme dans quatre jours et que personne ne peut plus préparer.
const classees = classerOpportunites([MCGILL, BERKELEY, DAAD], LE_27_AOUT);

assert.equal(classees[0].nom, "Mastercard Foundation Scholars — UC Berkeley");
assert.equal(classees[1].nom, "DAAD Study Scholarships");
assert.equal(classees[2].nom, "McGill Major Entrance Scholarships");

});

test("le palier « proche » prime sur « critique » : deux mois valent mieux que quatre jours", () => {

const dansQuatreJours = { couverture: "100% scolarité", echeance: analyserEcheance("31 août 2026") };
const dansQuaranteJours = { couverture: "100% scolarité", echeance: analyserEcheance("6 octobre 2026") };

assert.ok(
scoreOpportunite(dansQuaranteJours, LE_27_AOUT) > scoreOpportunite(dansQuatreJours, LE_27_AOUT),
"une échéance encore préparable doit passer devant une échéance déjà hors d'atteinte"
);

});

test("à pertinence et urgence égales, la plus proche de sa clôture d'abord", () => {

const tot = { nom: "tôt", couverture: "100% scolarité", echeance: analyserEcheance("6 octobre 2026") };
const tard = { nom: "tard", couverture: "100% scolarité", echeance: analyserEcheance("20 octobre 2026") };

assert.equal(classerOpportunites([tard, tot], LE_27_AOUT)[0].nom, "tôt");

});

test("une opportunité clôturée ne remonte jamais, même à 100 % de couverture", () => {

const classees = classerOpportunites([CLOSE, MCGILL], LE_27_AOUT);

assert.equal(classees.at(-1).nom, "MEXT Scholarship");

});

test("classerOpportunites ne modifie pas le tableau reçu", () => {

const original = [MCGILL, DAAD, BERKELEY];
const copie = [...original];

classerOpportunites(original, LE_27_AOUT);

assert.deepEqual(original, copie);

});

test("le bandeau ne montre que ce qui est réellement ouvert", () => {

const INCONNUE = {
nom: "Bourse du Gouvernement du Maroc (AMCI)",
couverture: "Allocation mensuelle (750 MAD)",
echeance: analyserEcheance("Variable, fixée chaque année par le ministère de l'enseignement supérieur du pays d'origine")
};

const ouvertes = opportunitesOuvertes([DAAD, CLOSE, INCONNUE, BERKELEY], LE_27_AOUT);

const noms = ouvertes.map((o) => o.nom);

assert.ok(noms.includes("DAAD Study Scholarships"));
assert.ok(noms.includes("Mastercard Foundation Scholars — UC Berkeley"));
assert.ok(!noms.includes("MEXT Scholarship"), "une clôturée n'a rien à faire dans « ouvert en ce moment »");
assert.ok(!noms.includes("Bourse du Gouvernement du Maroc (AMCI)"), "sans date ferme, on ne promet pas « ouvert »");

});
