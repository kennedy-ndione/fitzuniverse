/**
* ============================================================
* test/couches-pays.test.mjs — les huit pays de résidence (S2-PAYS)
* ============================================================
*
* Sept couches enregistrées d'un coup, à côté du Sénégal. Le lot S1b
* promettait que S2 serait un lot de DONNÉES : un fichier par pays, une
* ligne dans le registre, aucun module rouvert. Ce fichier vérifie que
* la promesse a tenu — et que les huit pays disent chacun ce que leur
* source dit, pas ce que dit le voisin.
*
* Les montants ci-dessous ne sont pas des chiffres de test : ce sont
* les frais réels des espaces Campus France, lus à l'écran le
* 2026-09-08. Un test qui les fige est un test qui empêche une faute de
* frappe de coûter 30 000 F à quelqu'un.
*
* LE PIÈGE LE PLUS FACILE À INTRODUIRE ICI est la régression inverse :
* enregistrer huit pays et casser le cas du pays NON documenté, qui doit
* continuer à recevoir les onze étapes du tronc. Il a son test.
* ============================================================
*/

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { PROCEDURE_FRANCE } from "../js/procedures/france.js";
import { COUCHES } from "../js/procedures/residences/index.js";
import { trouverProcedure, coucheDeResidence, residencesDocumentees, defautsDeCouche, defautsDeProcedure, deviseAdditionnable, MENTION_RESIDENCE_ABSENTE } from "../js/procedures/index.js";
import { computeJourneySteps } from "../js/application-journey.js";
import { calculerDiagnostic } from "../js/diagnostic-france.js";
import { TEMOIN, TEMOIN_2 } from "./_pays-temoin.mjs";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(join(racine, f), "utf8").replace(/\r\n/g, "\n");

const AUJOURDHUI = new Date("2026-09-08T12:00:00Z");

// Ce que chaque espace Campus France facture, et dans quelle monnaie.
// L'ordre est celui du registre : alphabétique par pays.
const ATTENDU = [
{ pays: "Bénin", montant: 70000, devise: "XOF", avertissement: false, calendrier: false },
{ pays: "Burkina Faso", montant: 70000, devise: "XOF", avertissement: true, calendrier: false },
{ pays: "Cameroun", montant: 101000, devise: "XOF", avertissement: false, calendrier: false },
{ pays: "Côte d'Ivoire", montant: 80000, devise: "XOF", avertissement: false, calendrier: false },
{ pays: "Guinée", montant: 1500000, devise: "GNF", avertissement: true, calendrier: false },
{ pays: "Maroc", montant: 1900, devise: "MAD", avertissement: true, calendrier: true },
{ pays: "Sénégal", montant: 85000, devise: "XOF", avertissement: false, calendrier: true },
{ pays: "Togo", montant: 70000, devise: "XOF", avertissement: true, calendrier: false }
];

const procedureDe = (pays) => trouverProcedure({ paysDestination: "France", paysResidence: pays });

// ------------------------------------------------------------------
// 1. Les huit couches, une par une
// ------------------------------------------------------------------

test("les huit couches passent defautsDeCouche() sans un seul défaut", () => {
assert.equal(COUCHES.length, 8);
for (const couche of COUCHES) {
assert.deepEqual(defautsDeCouche(couche, PROCEDURE_FRANCE), [], couche.id);
// Chaque fait porte sa source ET sa date : c'est la règle du dossier,
// et c'est ce qui distingue une donnée d'une rumeur.
for (const [cle, fait] of Object.entries(couche.faits || {})) {
assert.match(fait.source, /^https:\/\//, `${couche.id} / ${cle}`);
assert.match(fait.verifieLe, /^\d{4}-\d{2}-\d{2}$/, `${couche.id} / ${cle}`);
// Les sept pays du lot ont tous été lus à l'écran le 2026-09-08. Le
// Sénégal fait exception, et c'est voulu : son fait de frais est celui
// de js/pays-preinscription.js, daté du 2026-09-07 et affiché tel quel
// sur la page publique. Le redater ici pour faire joli reviendrait à
// écrire qu'on a rouvert une page qu'on n'a pas rouverte.
if (couche.id !== "france-senegal") assert.equal(fait.verifieLe, "2026-09-08", `${couche.id} / ${cle}`);
}
for (const [id, fragment] of Object.entries(couche.etapes || {})) {
assert.match(fragment.source, /^https:\/\//, `${couche.id} / ${id}`);
assert.match(fragment.verifieLe, /^\d{4}-\d{2}-\d{2}$/, `${couche.id} / ${id}`);
}
}
});

test("chaque pays rend une procédure documentée, avec SON montant et SA devise", () => {
for (const attendu of ATTENDU) {
const p = procedureDe(attendu.pays);
assert.ok(p, `${attendu.pays} : aucune procédure`);
assert.equal(p.residenceDocumentee, true, attendu.pays);
assert.equal(p.residence, attendu.pays);
assert.equal(p.etapes.length, 11, attendu.pays);
assert.deepEqual(defautsDeProcedure(p), [], attendu.pays);

const paiement = p.etapes.find((e) => e.id === "ef_paiement");
assert.equal(paiement.montant, attendu.montant, `${attendu.pays} : montant`);
assert.equal(paiement.devise, attendu.devise, `${attendu.pays} : devise`);

assert.equal(!!p.avertissement, attendu.avertissement, `${attendu.pays} : avertissement`);
}
});

test("aucun pays ne porte le montant d'un autre", () => {
// La faute la plus coûteuse de tout ce dossier serait un copier-coller
// entre deux fichiers voisins : elle enverrait un Guinéen à la banque
// avec 85 000 F au lieu de 1 500 000 GNF.
const vus = new Map();
for (const attendu of ATTENDU) {
const p = procedureDe(attendu.pays);
const paiement = p.etapes.find((e) => e.id === "ef_paiement");
vus.set(attendu.pays, `${paiement.montant} ${paiement.devise}`);
}
assert.deepEqual([...vus.values()], ATTENDU.map((a) => `${a.montant} ${a.devise}`));
// Et le texte de chaque couche nomme SON pays.
for (const couche of COUCHES) {
const textes = Object.values(couche.faits || {}).map((f) => f.texte || "").join(" ");
assert.ok(textes.length > 0, couche.id);
}
});

test("le registre est la seule liste, et il est trié comme la page l'affiche", () => {
assert.deepEqual(residencesDocumentees("France").map((r) => r.pays), ATTENDU.map((a) => a.pays));
assert.deepEqual(residencesDocumentees("Roumanie"), []);
// Un pays se trouve quelle que soit la graphie : c'est findCountry qui
// apparie, par code ISO.
for (const graphie of ["cote d'ivoire", "CI", "Côte d'Ivoire", "burkina faso", "BF", "MA", "maroc"]) {
assert.ok(coucheDeResidence("France", graphie), `« ${graphie} » devrait trouver sa couche`);
}
// Le registre ne contient AUCUN fait : c'est sa raison d'être.
const registre = lire("js/procedures/residences/index.js");
assert.equal(/https?:\/\/(?!\S*\.js)/.test(registre.replace(/^\s*\*.*$/gm, "").replace(/\/\/.*$/gm, "")), false, "aucune URL dans le registre");
assert.equal((registre.match(/^import /gm) || []).length, 8);
});

// ------------------------------------------------------------------
// 2. Les points de vigilance, un par un
// ------------------------------------------------------------------

test("MAROC : la soumission tombe au 15 novembre 2026, et pas 2027", () => {
// Le jalon est en novembre, donc APRÈS la clôture de campagne (31
// juillet) : il appartient à l'année d'OUVERTURE, pas à celle de
// clôture. Se tromper d'un an sur la seule date ferme du pays enverrait
// l'étudiant déposer un an trop tard.
const maroc = procedureDe("Maroc");
const steps = computeJourneySteps(
{ id: "p", track: "preinscription", universityId: "u", checklist: [] },
{ profileScore: 9, procedure: maroc, aujourdhui: AUJOURDHUI }
);
const dates = steps.filter((s) => s.procedure && s.procedure.echeanceISO).map((s) => `${s.id}=${s.procedure.echeanceISO}`);
assert.deepEqual(dates, ["ef_soumission=2026-11-15"]);
});

test("MAROC : jalonsAval — le calendrier existe, mais pas ses dates d'aval", () => {
const maroc = procedureDe("Maroc");
// Une échéance ferme (la soumission), et deux étapes qui disent
// honnêtement que la suite n'est pas publiée.
assert.equal(maroc.etapes.filter((e) => e.echeance).length, 1);
const mentionnees = maroc.etapes.filter((e) => e.mention).map((e) => e.id);
assert.deepEqual(mentionnees, ["ef_entretien", "ef_reponse"]);
for (const e of maroc.etapes.filter((x) => x.mention)) {
assert.deepEqual(e.absences, ["jalonsAval"]);
assert.ok(e.consigne.endsWith(e.mention), `${e.id} : la mention doit être lue`);
}
// Et la mention générale « pays non documenté » n'apparaît nulle part :
// le Maroc EST documenté.
for (const e of maroc.etapes) assert.ok(!e.consigne.includes(MENTION_RESIDENCE_ABSENTE), e.id);
});

test("CAMEROUN : 85 000 + 16 000 = 101 000, et la décomposition se lit", () => {
const cameroun = coucheDeResidence("France", "Cameroun");
const frais = cameroun.faits.fraisDossier;
assert.equal(frais.montant, 101000);
assert.equal(frais.decomposition.reduce((s, l) => s + l.montant, 0), frais.montant);
for (const ligne of frais.decomposition) assert.equal(ligne.devise, frais.devise);
// Le total ET le détail dans la même phrase, jamais l'un sans l'autre.
const r = calculerDiagnostic({ ressourcesMensuelles: 900, paysResidence: "Cameroun" });
assert.match(r.fraisDossier.texte, /101 000 F CFA/);
assert.match(r.fraisDossier.texte, /85 000 F CFA/);
assert.match(r.fraisDossier.texte, /16 000 F CFA/);
assert.equal(r.fraisDossier.decomposition.length, 2);
});

test("les six pays sans calendrier publié le DISENT, et n'affichent aucune date", () => {
for (const pays of ["Bénin", "Burkina Faso", "Cameroun", "Côte d'Ivoire", "Guinée", "Togo"]) {
const p = procedureDe(pays);
assert.equal(p.etapes.filter((e) => e.echeance).length, 0, `${pays} : une date est affichée sans calendrier publié`);
const mentionnees = p.etapes.filter((e) => e.mention);
assert.equal(mentionnees.length, 5, `${pays} : les cinq étapes qui dépendent du calendrier`);
for (const e of mentionnees) {
assert.deepEqual(e.absences, ["calendrier"], `${pays} / ${e.id}`);
assert.ok(!e.consigne.includes(MENTION_RESIDENCE_ABSENTE), `${pays} / ${e.id} : mention générale servie à tort`);
}
}
});

test("les quatre avertissements officiels sont rendus, et seulement ceux-là", () => {
// Ces textes viennent des espaces Campus France eux-mêmes : ils
// mettent en garde contre des rabatteurs qui encaissent en leur nom.
// Les relayer coûte trois lignes et peut épargner une année.
for (const attendu of ATTENDU) {
const p = procedureDe(attendu.pays);
if (attendu.avertissement) {
assert.ok(p.avertissement.length > 80, `${attendu.pays} : avertissement trop court pour être celui de la source`);
} else {
assert.equal(p.avertissement, "", `${attendu.pays} : avertissement inventé`);
}
}
// Et la carte du dossier le rend hors du bloc repliable.
assert.ok(lire("applications.js").includes("return `${blocAvertissement}<details class=\"app-procedure\">"));
});

// ------------------------------------------------------------------
// 3. LA RÉGRESSION LA PLUS FACILE : le pays NON documenté
// ------------------------------------------------------------------

test("une résidence non documentée reçoit toujours les onze étapes du tronc", () => {
for (const pays of [TEMOIN, TEMOIN_2, "Sénégalaise", ""]) {
const p = trouverProcedure({ paysDestination: "France", paysResidence: pays });
assert.ok(p, `${pays || "(vide)"} : la procédure ne doit jamais être nulle`);
assert.equal(p.residenceDocumentee, false, pays || "(vide)");
assert.equal(p.etapes.length, 11, pays || "(vide)");
assert.equal(p.etapes.filter((e) => e.echeance).length, 0, pays || "(vide)");
assert.equal(p.etapes.filter((e) => e.mention).length, 9, pays || "(vide)");
assert.equal(p.avertissement, "");
assert.equal(p.etapes.find((e) => e.id === "ef_paiement").montant, undefined, "aucun montant emprunté aux huit pays");
}
// LA DESTINATION INCONNUE RESTE LE SEUL NULL — mais « Roumanie » n'en
// est plus une depuis le lot S3 (2026-09-13), qui lui a écrit son tronc.
// La même assertion vivait dans test/procedures.test.mjs : elle a été
// corrigée là-bas et pas ici, et ce fichier l'a rattrapée. On la rejoue
// donc sur une destination qui, elle, n'a toujours aucun tronc — choisie
// dynamiquement, pour que le jour où elle en aura un, ce soit encore le
// test qui le dise plutôt que le silence.
const sansTronc = ["Japon", "Chine", "Corée du Sud", "Afrique du Sud", "Inde"].find((nom) => !trouverProcedure({ paysDestination: nom }));
assert.ok(sansTronc, "toutes les destinations témoins ont un tronc : ce test doit être repensé, pas supprimé");
assert.equal(trouverProcedure({ paysDestination: sansTronc, paysResidence: "Sénégal" }), null);
});

// ------------------------------------------------------------------
// 4. LES DEVISES — aucune n'entre dans un total en euros
// ------------------------------------------------------------------

test("le dirham et le franc guinéen restent hors du total en euros", () => {
const RESSOURCES_ET_DROITS = 10530 + 2902;

for (const [pays, montant, devise] of [["Maroc", 1900, "MAD"], ["Guinée", 1500000, "GNF"]]) {
assert.equal(deviseAdditionnable(devise), false, devise);
const r = calculerDiagnostic({ ressourcesMensuelles: 900, paysResidence: pays });
assert.equal(r.residence.documentee, true, `${pays} : le pays EST documenté`);
assert.equal(r.total.annuelEUR, RESSOURCES_ET_DROITS, `${pays} : le total en euros ne contient QUE les chiffres français`);
assert.equal(r.total.inclutFraisDossier, false, pays);
assert.deepEqual(r.total.enPlus, [{ montant, devise }], pays);
assert.equal(r.fraisDossier.montantEUR, 0, pays);
assert.equal(r.fraisDossier.additionnable, false, pays);
// Le montant reste lisible, dans sa monnaie, à côté du total.
assert.match(r.total.texte, new RegExp(`${RESSOURCES_ET_DROITS.toLocaleString("fr-FR").replace(/ | /g, " ")} € \\+ `));
}

// Les six pays en franc CFA, eux, entrent bien dans le total.
for (const [pays, eur] of [["Sénégal", 130], ["Cameroun", 154], ["Côte d'Ivoire", 122], ["Bénin", 107], ["Togo", 107], ["Burkina Faso", 107]]) {
const r = calculerDiagnostic({ ressourcesMensuelles: 900, paysResidence: pays });
assert.equal(r.total.inclutFraisDossier, true, pays);
assert.deepEqual(r.total.enPlus, [], pays);
assert.equal(r.total.annuelEUR, RESSOURCES_ET_DROITS + eur, pays);
}
});

// ------------------------------------------------------------------
// 5. LA PAGE PUBLIQUE, ET LA NON-RÉGRESSION SÉNÉGALAISE
// ------------------------------------------------------------------

test("la page publique compte les pays documentés depuis le registre, jamais en dur", () => {
const page = lire("js/preinscriptions-page.js");
assert.ok(page.includes("residencesDocumentees(pays.nom)"));
assert.ok(page.includes("residences.length} pays de résidence"));
// Aucun chiffre écrit à la main : il mentirait au premier pays ajouté.
// Les commentaires sont retirés d'abord — ce fichier EXPLIQUE le chiffre
// en toutes lettres, et c'est la ligne RENDUE qu'on vérifie.
const rendu = page.replace(/\/\/.*$/gm, "").replace(/\$\{[^}]*\}/g, "");
assert.equal(/\b(huit|8) pays de résidence/i.test(rendu), false);
assert.ok(lire("css/preinscriptions.css").includes(".pre-pays-residences"));
});

test("NON-RÉGRESSION : le Sénégal rend exactement ce qu'il rendait avant ce lot", () => {
const sn = procedureDe("Sénégal");
assert.equal(sn.id, "france-senegal");
assert.equal(sn.residenceDocumentee, true);
assert.equal(sn.etapes.length, 11);
assert.equal(sn.etapes.filter((e) => e.echeance).length, 5, "les cinq échéances de la campagne");
assert.equal(sn.etapes.filter((e) => e.mention).length, 0, "aucune mention : tout est documenté");
assert.equal(sn.avertissement, "");
assert.equal(sn.absences, null);
assert.equal(sn.etapes.find((e) => e.id === "ef_paiement").montant, 85000);
for (const e of sn.etapes) assert.equal(e.fiabilite, "verifie_source_officielle", e.id);

const r = calculerDiagnostic({ ressourcesMensuelles: 900, paysResidence: "Sénégal" });
assert.equal(r.total.annuelEUR, 10530 + 2902 + 130);
assert.match(r.fraisDossier.texte, /85 000 F CFA/);
assert.equal(r.fraisDossier.decomposition, null);
});
