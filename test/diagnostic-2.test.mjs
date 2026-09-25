/**
* ============================================================
* test/diagnostic-2.test.mjs — le diagnostic devient un chemin
* ============================================================
*
* Le Diagnostic France rendait un TOTAL. Un total est une donnée ;
* l'étudiant a payé 10 000 F pour une DÉCISION et un CHEMIN. Ce lot
* assemble ce que le produit avait déjà — procédures par pays, sources
* datées, calendriers, moteur de bourses, frais vérifiés — et ce fichier
* tient les promesses qui en découlent.
*
* CE QUI EST VÉRIFIÉ ICI, ET POURQUOI CHAQUE CONTRÔLE EXISTE :
*
*   1. Les trois verdicts basculent aux bons seuils, et l'écart affiché
*      est exact. C'est la première phrase que l'étudiant lit ; une
*      erreur de 20 % la retournerait.
*   2. Aucun montant sans source ne s'affiche. C'est le seul élément de
*      cette page qu'aucun concurrent ne peut copier honnêtement.
*   3. Un point de vigilance sans source ni date est REFUSÉ. Un
*      avertissement a l'autorité d'un fait, et l'étudiant y obéira.
*   4. Un pays sans calendrier n'affiche AUCUNE date. Six des huit pays
*      documentés portent encore, sur leurs pages officielles, des dates
*      de 2023, 2024 et 2025 qui se contredisent.
*   5. Le levier « bourses » ne compte que des échéances OUVERTES et lues
*      à la source, et seulement pour la France : une bourse hongroise ne
*      retire pas un euro d'un total de préinscription française.
*   6. Le levier « université » n'apparaît qu'avec des frais vérifiés.
*   7. Les quatre phrases de fin, chacune sur son cas, et le ton tenu par
*      un test : aucun point d'exclamation, aucune formule interdite.
*   8. NON-RÉGRESSION : les huit totaux du lot S2-PAYS sont inchangés, et
*      un pays non documenté rend toujours 13 432 € sans frais de dossier.
*
* Fins de ligne : tout fichier lu ici passe par .replace(/\r\n/g,"\n").
* ============================================================
*/

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import vm from "node:vm";

import {
calculerDiagnostic,
verdictChiffre,
lignesChiffrees,
phraseDeFin,
formatEUR,
deviseDeResidence,
SEUIL_ECART_IMPORTANT,
PHRASES_INTERDITES,
HORS_TOTAL
} from "../js/diagnostic-france.js";

import {
vigilanceDe,
calendrierDe,
levierUniversite,
levierBourses,
levierNiveau,
levierExoneration,
leviersDe,
etapesRestantes,
PREAMBULE_OFFRE,
OFFRES_ACCOMPAGNEMENT
} from "../js/diagnostic-conseil.js";

import { COUCHES } from "../js/procedures/residences/index.js";
import { defautsDeCouche, TRONCS, pointsDeVigilanceDe } from "../js/procedures/index.js";
import { TEMOIN } from "./_pays-temoin.mjs";

const require = createRequire(import.meta.url);
const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(join(racine, f), "utf8").replace(/\r\n/g, "\n");

const SEUIL_MENSUEL = 877.5;
const SEUIL_ANNUEL = 10530;
const DROITS_LICENCE = 2902;
const DROITS_MASTER = 3950;

const catalogue = (() => {
const brut = JSON.parse(lire("assets/data/catalogue.json"));
return { programs: brut.programs, universities: brut.universities, scholarships: brut.scholarships };
})();

function diag(entrees) {
return calculerDiagnostic({ devise: "EUR", niveau: "licence", ...entrees });
}

// ------------------------------------------------------------------
// 1. LE VERDICT — trois états, aux bons seuils
// ------------------------------------------------------------------

test("les trois verdicts basculent aux bons seuils", () => {

// La frontière est à 20 % du seuil, soit 175,50 € par mois.
const frontiere = SEUIL_MENSUEL * SEUIL_ECART_IMPORTANT;
assert.equal(frontiere, 175.5);

// Au seuil PILE : ça tient. Un centime en dessous : ça ne tient plus.
assert.equal(verdictChiffre(diag({ ressourcesMensuelles: SEUIL_MENSUEL, paysResidence: "Sénégal" })).etat, "tient");
assert.equal(verdictChiffre(diag({ ressourcesMensuelles: SEUIL_MENSUEL + 400, paysResidence: "Sénégal" })).etat, "tient");
assert.equal(verdictChiffre(diag({ ressourcesMensuelles: SEUIL_MENSUEL - 0.01, paysResidence: "Sénégal" })).etat, "ecart-faible");

// Juste SOUS la frontière : écart faible. PILE dessus : important.
// L'égalité bascule du côté « important » à dessein — au seuil, aucun
// des trois leviers ne suffit plus seul, et le dire trop tard coûte
// plus cher que le dire trop tôt.
assert.equal(verdictChiffre(diag({ ressourcesMensuelles: SEUIL_MENSUEL - frontiere + 0.01, paysResidence: "Sénégal" })).etat, "ecart-faible");
assert.equal(verdictChiffre(diag({ ressourcesMensuelles: SEUIL_MENSUEL - frontiere, paysResidence: "Sénégal" })).etat, "ecart-important");
assert.equal(verdictChiffre(diag({ ressourcesMensuelles: 0, paysResidence: "Sénégal" })).etat, "ecart-important");

});

test("l'écart affiché est exact, au mois comme à l'année", () => {

const v = verdictChiffre(diag({ ressourcesMensuelles: 800, paysResidence: "Sénégal" }));
assert.equal(v.etat, "ecart-faible");
assert.equal(v.manqueMensuelEUR, 77.5);
assert.equal(v.manqueAnnuelEUR, 930);
assert.match(v.phrase, /^Il vous manque 77,50 € par mois/);

const g = verdictChiffre(diag({ ressourcesMensuelles: 400, paysResidence: "Sénégal" }));
assert.equal(g.etat, "ecart-important");
assert.equal(g.manqueMensuelEUR, 477.5);
assert.equal(g.manqueAnnuelEUR, 5730);
assert.match(g.phrase, /^Il manque 5 730 € sur l'année/);

// Le verdict qui tient ne chiffre rien : il n'y a pas d'écart.
const t = verdictChiffre(diag({ ressourcesMensuelles: 1200, paysResidence: "Sénégal" }));
assert.equal(t.phrase, "Votre projet tient financièrement.");
assert.equal(t.manqueMensuelEUR, 0);

});

test("le montant manquant se redit en franc CFA, jamais en dirham ni en franc guinéen", () => {

// PARITÉ FIXE (655,957) : le franc CFA se redit, c'est une opération
// exacte. 77,50 € = 50 837 F.
const sn = verdictChiffre(diag({ ressourcesMensuelles: 800, paysResidence: "Sénégal" }));
assert.deepEqual(sn.local, { montant: 50837, devise: "XOF" });
assert.match(sn.phrase, /\(50 837 F CFA\)/);

// PAS DE PARITÉ FIXE : le dirham et le franc guinéen ne se redisent
// pas. Un « environ » à un taux du jour serait exactement le chiffre
// qui vieillit tout seul que ce dépôt refuse partout ailleurs.
for (const pays of ["Maroc", "Guinée"]) {
const v = verdictChiffre(diag({ ressourcesMensuelles: 800, paysResidence: pays }));
assert.equal(v.local, null, pays);
assert.ok(!/\(/.test(v.phrase), `${pays} : aucun montant entre parenthèses`);
}

assert.equal(deviseDeResidence("Sénégal"), "XOF");
assert.equal(deviseDeResidence("Maroc"), "MAD");
assert.equal(deviseDeResidence(TEMOIN), null, "un pays non documenté n'a pas de devise");

// Un pays non documenté ne redit rien non plus.
assert.equal(verdictChiffre(diag({ ressourcesMensuelles: 800, paysResidence: TEMOIN })).local, null);

});

// ------------------------------------------------------------------
// 2. CHAQUE LIGNE AVEC SA SOURCE ET SA DATE
// ------------------------------------------------------------------

test("aucun montant ne s'affiche sans sa source et sa date", () => {

for (const pays of [...COUCHES.map((c) => c.pays), TEMOIN]) {

for (const ligne of lignesChiffrees(diag({ ressourcesMensuelles: 900, paysResidence: pays }))) {

if (ligne.montant === null) {
// Ce qu'on ignore ne prend pas la forme de ce qu'on sait : ni
// montant, ni devise, ni source — et la ligne le DIT.
assert.equal(ligne.absente, true, `${pays}/${ligne.cle} : montant absent mais ligne non marquée`);
assert.equal(ligne.source, null, `${pays}/${ligne.cle}`);
assert.equal(ligne.dansLeTotal, false, `${pays}/${ligne.cle} : une ligne absente ne peut pas être dans le total`);
assert.ok(ligne.texte.length > 30, `${pays}/${ligne.cle} : l'absence doit être expliquée`);
continue;
}

assert.equal(ligne.absente, false, `${pays}/${ligne.cle}`);
assert.match(ligne.source, /^https?:\/\//, `${pays}/${ligne.cle} : montant sans source`);
assert.match(ligne.verifieLe, /^\d{4}-\d{2}-\d{2}$/, `${pays}/${ligne.cle} : montant sans date`);

}

}

});

test("les trois lignes du total sont toujours rendues, et leur somme est le total", () => {

const r = diag({ ressourcesMensuelles: 900, paysResidence: "Sénégal" });
const lignes = lignesChiffrees(r);

assert.deepEqual(lignes.map((l) => l.cle), ["ressources", "droits", "fraisDossier"]);

const somme = lignes
.filter((l) => l.dansLeTotal)
.reduce((n, l) => n + (l.devise === "XOF" ? l.montant / 655.957 : l.montant), 0);

assert.equal(Math.round(somme), r.total.annuelEUR);

// Devise sans parité fixe : la ligne existe, son montant est juste, et
// elle n'est PAS dans le total (lot S2-MODÈLE).
const ma = lignesChiffrees(diag({ ressourcesMensuelles: 900, paysResidence: "Maroc" }));
const frais = ma.find((l) => l.cle === "fraisDossier");
assert.equal(frais.devise, "MAD");
assert.equal(frais.dansLeTotal, false);
assert.match(frais.texte, /n'a pas de parité fixe/);

});

// ------------------------------------------------------------------
// 3. LES POINTS DE VIGILANCE
// ------------------------------------------------------------------

test("les huit pays documentés portent au moins un point de vigilance, sourcé et daté", () => {

for (const couche of COUCHES) {
const points = vigilanceDe(couche.pays);
assert.ok(points.length >= 1 && points.length <= 3, `${couche.pays} : ${points.length} point(s), attendu 1 à 3`);
for (const p of points) {
assert.ok(p.texte.trim().length > 40, `${couche.pays} : point trop court pour être utile`);
assert.match(p.source, /^https?:\/\//, `${couche.pays} : point sans source`);
assert.match(p.verifieLe, /^\d{4}-\d{2}-\d{2}$/, `${couche.pays} : point sans date`);
}
}

// Un pays non documenté n'en a aucun — et rend un TABLEAU, jamais null :
// l'appelant boucle, il ne teste pas.
assert.deepEqual(vigilanceDe(TEMOIN), []);
assert.deepEqual(pointsDeVigilanceDe("France", ""), []);

});

test("un point de vigilance sans source, sans date ou sans texte est REFUSÉ", () => {

const base = COUCHES.find((c) => c.pays === "Sénégal");
const tronc = TRONCS[0];

// Le témoin sain ne doit rien reprocher : sans cela, les cas fautifs
// ci-dessous prouveraient n'importe quoi.
assert.deepEqual(defautsDeCouche(base, tronc), []);

const fautifs = [
[{ texte: "Une phrase.", verifieLe: "2026-09-08" }, /sans source/],
[{ texte: "Une phrase.", source: "https://exemple.org" }, /sans verifieLe/],
[{ source: "https://exemple.org", verifieLe: "2026-09-08" }, /sans texte/],
[{ texte: "  ", source: "https://exemple.org", verifieLe: "2026-09-08" }, /sans texte/],
[{ texte: "Une phrase.", source: "pas-une-url", verifieLe: "2026-09-08" }, /sans source/],
[{ texte: "Une phrase.", source: "https://exemple.org", verifieLe: "08/09/2026" }, /sans verifieLe/]
];

for (const [point, motif] of fautifs) {
const defauts = defautsDeCouche({ ...base, pointsDeVigilance: [point] }, tronc);
assert.ok(defauts.some((d) => motif.test(d)), `attendu ${motif} — reçu ${JSON.stringify(defauts)}`);
}

// Vide, et au-delà de trois : au-delà, plus rien ne ressort. Un lot qui
// veut une quatrième phrase doit d'abord décider laquelle sort.
assert.ok(defautsDeCouche({ ...base, pointsDeVigilance: [] }, tronc).some((d) => /présent mais vide/.test(d)));
const quatre = Array.from({ length: 4 }, () => ({ texte: "Une phrase.", source: "https://exemple.org", verifieLe: "2026-09-08" }));
assert.ok(defautsDeCouche({ ...base, pointsDeVigilance: quatre }, tronc).some((d) => /trois au maximum/.test(d)));

});

// ------------------------------------------------------------------
// 4. LE CALENDRIER, EN JOURS
// ------------------------------------------------------------------

test("un pays sans calendrier publié n'affiche AUCUNE date, seulement sa phrase d'absence", () => {

const aujourdhui = new Date("2026-09-09T12:00:00Z");

for (const couche of COUCHES) {

const cal = calendrierDe(couche.pays, aujourdhui);
const aUnCalendrier = !!(couche.faits && couche.faits.calendrier);

assert.equal(cal.documente, aUnCalendrier, couche.pays);

if (aUnCalendrier) {
assert.ok(cal.jalons.length >= 1, `${couche.pays} : calendrier documenté mais aucun jalon`);
assert.equal(cal.absence, "", couche.pays);
for (const j of cal.jalons) {
assert.match(j.iso, /^\d{4}-\d{2}-\d{2}$/, couche.pays);
assert.equal(typeof j.jours, "number", couche.pays);
assert.ok(j.texte.includes(String(Math.abs(j.jours))), `${couche.pays} : le décompte en jours doit être DANS la phrase`);
}
continue;
}

// Aucun jalon, aucune source de calendrier, et une phrase qui dit
// quoi faire.
assert.deepEqual(cal.jalons, [], couche.pays);
assert.equal(cal.source, null, couche.pays);
assert.ok(cal.absence.length > 60, `${couche.pays} : la phrase d'absence doit expliquer`);

// AUCUN DÉCOMPTE. Les phrases d'absence citent des dates PASSÉES — et
// disent dans la même phrase qu'elles ne se reportent pas ; c'est
// utile, et c'est vérifié à la source. Ce qui est interdit, c'est le
// « dans N jours » : lui seul se lit comme une échéance à venir, et
// c'est la seule chose qu'on ne sait pas.
assert.ok(!/dans \d+ jour/.test(cal.absence), `${couche.pays} : aucun décompte ne doit être affiché sans calendrier publié`);
assert.match(cal.absence, /ne se reporte|pas encore publi|n'a pas publi|faute de source/i, `${couche.pays} : la phrase doit dire pourquoi il n'y a pas de date`);

}

// Un pays non documenté du tout : même règle, phrase générique.
const inconnu = calendrierDe(TEMOIN, aujourdhui);
assert.equal(inconnu.documente, false);
assert.deepEqual(inconnu.jalons, []);
assert.match(inconnu.absence, /n'est pas encore publié/);

});

test("le Maroc annonce sa clôture au 15 novembre, en jours", () => {

// 67 jours au 9 septembre 2026 — le chiffre qui rend le calendrier
// lisible, et qu'aucune page officielle ne donne.
const cal = calendrierDe("Maroc", new Date("2026-09-09T12:00:00Z"));
assert.equal(cal.documente, true);
assert.equal(cal.jalons.length, 1);
assert.equal(cal.jalons[0].iso, "2026-11-15");
assert.equal(cal.jalons[0].jours, 67);
assert.match(cal.jalons[0].texte, /dans 67 jours/);
assert.match(cal.source, /^https:\/\/www\.maroc\.campusfrance\.org\//);

});

// ------------------------------------------------------------------
// 5. LES LEVIERS
// ------------------------------------------------------------------

test("le levier « université » n'apparaît qu'avec des frais vérifiés", () => {

// Catalogue RÉEL : 15 universités françaises portent des frais
// vérifiés. Le levier annonce lui-même sur combien il a été calculé —
// ne pas laisser croire à une couverture complète.
const reel = levierUniversite(catalogue.universities, "licence");
assert.equal(reel.disponible, true);
assert.ok(reel.etablissements >= 1 && reel.etablissements <= catalogue.universities.length);
assert.match(reel.texte, new RegExp(`${reel.etablissements} université`));
assert.match(reel.source, /^https?:\/\//);

// AUCUNE donnée : le levier le dit, il ne s'invente pas un montant.
const sans = levierUniversite([{ id: "x", country: "France", name: "Université de Nulle Part" }], "licence");
assert.equal(sans.disponible, false);
assert.equal(sans.montantEUR, 0);
assert.match(sans.texte, /pas encore vérifié/);

// Un montant SANS source ou SANS date reste « inconnu » (js/frais.js) :
// le chiffre est là, et il ne compte pas.
const bancal = [{
id: "y", country: "France", name: "Sans source",
fraisScolarite: { verifieLe: "2026-09-07", licence: { montant: 1, devise: "EUR", periode: "an" } }
}];
assert.equal(levierUniversite(bancal, "licence").disponible, false);

// Une université HORS France ne compte pas : ce total est celui d'une
// préinscription française.
const ailleurs = [{
id: "z", country: "Canada", name: "Ailleurs",
fraisScolarite: { source: "https://exemple.org", verifieLe: "2026-09-07", licence: { montant: 1, devise: "EUR", periode: "an" } }
}];
assert.equal(levierUniversite(ailleurs, "licence").disponible, false);

});

test("le levier « bourses » ne compte que des échéances ouvertes, lues à la source, et pour la France", () => {

const aujourdhui = new Date("2026-09-09T12:00:00Z");

const uni = { id: "u1", country: "France", name: "Université témoin", officialWebsite: "https://exemple.org" };
const uniHongroise = { id: "u2", country: "Hongrie", name: "Université de Budapest" };

const bourseOuverte = { id: "b1", title: "Bourse ouverte", country: "France", isActive: true, funding: "Bourse complète.", officialWebsite: "https://exemple.org/b1", verifieLe: "2026-09-08", levels: ["Master"] };
const bourseInconnue = { id: "b2", title: "Bourse sans date", country: "France", isActive: true, funding: "Non documenté.", officialWebsite: "https://exemple.org/b2", levels: ["Master"] };
const bourseHongroise = { id: "b3", title: "Bourse hongroise", country: "Hongrie", isActive: true, funding: "Bourse complète.", officialWebsite: "https://exemple.org/b3", levels: ["Master"] };

const petit = {
universities: [uni, uniHongroise, { ...uni, id: "u3", name: "Deuxième témoin" }],
scholarships: [bourseOuverte, bourseInconnue, bourseHongroise],
programs: [
{ id: "p1", universityId: "u1", scholarshipId: "b1", level: "Master", deadline: "30 novembre 2026", status: "Ouverte" },
{ id: "p2", universityId: "u3", scholarshipId: "b2", level: "Master", status: "Ouverte" },
{ id: "p3", universityId: "u2", scholarshipId: "b3", level: "Master", deadline: "30 novembre 2026", status: "Ouverte" }
]
};

const profil = { desiredDegree: "Master", lastDegree: "Licence" };

const l = levierBourses({ profile: profil, catalogue: petit, aujourdhui });

assert.equal(l.disponible, true);
// UNE seule : l'échéance inconnue ne compte pas (« ouverte » et « pas
// fermée » sont deux idées), et la hongroise ne retire pas un euro d'un
// total de préinscription française.
assert.equal(l.nombre, 1);
assert.equal(l.bourses[0].titre, "Bourse ouverte");
assert.equal(l.bourses[0].financement, "Bourse complète.");
assert.equal(l.lien, "offers.html?parcours=bourse");

// AUCUN MONTANT COUVERT N'EST ANNONCÉ : le catalogue n'en porte pas.
assert.ok(!/jusqu'à \d/.test(l.texte), "aucun montant couvert ne doit être fabriqué");

// Profil sans bourse retenue : le bloc N'APPARAÎT PAS. « 0 bourse » se
// lirait comme un verdict sur le profil.
const vide = levierBourses({ profile: profil, catalogue: { universities: [uni], scholarships: [bourseInconnue], programs: [{ id: "p9", universityId: "u1", scholarshipId: "b2", level: "Master" }] }, aujourdhui });
assert.equal(vide.disponible, false);
assert.equal(vide.nombre, 0);
assert.equal(vide.texte, "");

});

test("les quatre leviers sont rendus, et deux disparaissent sans catalogue", () => {

const r = diag({ ressourcesMensuelles: 400, paysResidence: "Sénégal", niveau: "master" });

// Sans catalogue : les deux leviers français restent, les deux qui en
// dépendent disparaissent. Une section absente n'est jamais une section
// verrouillée — on ne cache rien pour faire payer la suite.
assert.deepEqual(leviersDe(r).map((l) => l.cle), ["niveau", "exoneration"]);

const avec = leviersDe(r, { catalogue, profile: { desiredDegree: "Master" } });
assert.deepEqual(avec.map((l) => l.cle), ["niveau", "exoneration", "universite", "bourses"]);

// L'écart de niveau est publié, et exact.
const n = levierNiveau("master");
assert.equal(n.montantEUR, DROITS_MASTER - DROITS_LICENCE);
assert.match(n.texte, /1 048 €/);

// L'exonération dit ce qu'elle retirerait ET qu'elle n'est pas acquise,
// dans la même phrase : un rabais annoncé seul se budgète comme acquis.
const e = levierExoneration("master");
assert.equal(e.montantEUR, DROITS_MASTER);
assert.match(e.texte, /3 950 €/);
assert.match(e.texte, /n'est PAS garantie/);
// Décret du 19 mai 2026 : 25 % pour une première inscription en 2027-2028.
assert.match(e.texte, /25 %/);

for (const l of [n, e]) {
assert.match(l.source, /^https?:\/\//);
assert.match(l.verifieLe, /^\d{4}-\d{2}-\d{2}$/);
}

});

// ------------------------------------------------------------------
// 6. CE QU'IL RESTE À FAIRE
// ------------------------------------------------------------------

test("les onze étapes de la procédure sont rendues en entier, pour tout le monde", () => {

const aujourdhui = new Date("2026-09-09T12:00:00Z");

// RIEN N'EST MASQUÉ POUR FAIRE PAYER LA SUITE : même un pays non
// documenté reçoit les onze étapes.
for (const pays of [...COUCHES.map((c) => c.pays), TEMOIN]) {
const { etapes } = etapesRestantes(pays, aujourdhui);
assert.equal(etapes.length, 11, pays);
for (const e of etapes) {
assert.ok(e.titre && e.consigne, `${pays}/${e.id}`);
assert.match(e.source, /^https?:\/\//, `${pays}/${e.id}`);
}
}

// Le Sénégal porte ses cinq échéances ; un pays sans calendrier n'en a
// aucune — jamais une date empruntée à la campagne d'un voisin.
assert.equal(etapesRestantes("Sénégal", aujourdhui).etapes.filter((e) => e.echeance).length, 5);
assert.equal(etapesRestantes("Côte d'Ivoire", aujourdhui).etapes.filter((e) => e.echeance).length, 0);
assert.equal(etapesRestantes(TEMOIN, aujourdhui).etapes.filter((e) => e.echeance).length, 0);

// L'avertissement de l'organisme officiel, quand le pays en publie un.
assert.match(etapesRestantes("Burkina Faso", aujourdhui).avertissement, /fraude documentaire/);
assert.equal(etapesRestantes("Sénégal", aujourdhui).avertissement, "");

});

// ------------------------------------------------------------------
// 7. L'OFFRE, PUIS LA PHRASE DE FIN
// ------------------------------------------------------------------

test("l'offre est dite une seule fois, et elle rappelle qu'on peut tout faire seul", () => {

assert.match(PREAMBULE_OFFRE, /Vous pouvez tout faire seul/);
assert.equal(OFFRES_ACCOMPAGNEMENT.length, 2);
assert.deepEqual(OFFRES_ACCOMPAGNEMENT.map((o) => o.id), ["dossier-france", "dossier-france-conseiller"]);
for (const o of OFFRES_ACCOMPAGNEMENT) assert.ok(o.ligne.length > 30 && o.ligne.length < 220, o.id);

// Le prix ne s'écrit pas ici : il vient de pricing-plans.js, comme
// partout. Une grille dupliquée finit par diverger.
for (const o of OFFRES_ACCOMPAGNEMENT) {
assert.ok(!/\d{2}[  ]?000/.test(o.ligne + o.label), `${o.id} : aucun prix écrit en dur`);
}

// L'offre ne prend PAS le dernier mot : la phrase de fin vient après.
const page = lire("diagnostic-france.html");
assert.ok(page.indexOf('id="diagSectionOffre"') < page.indexOf('id="diagFin"'), "la phrase de fin doit suivre l'offre");
assert.ok(page.indexOf('id="diagVerdict"') < page.indexOf('id="diagBlocs"'), "le verdict vient avant tout chiffre détaillé");

});

test("les quatre phrases de fin, chacune sur son cas", () => {

const cas = {
tient: diag({ ressourcesMensuelles: 1200, paysResidence: "Sénégal" }),
"ecart-faible": diag({ ressourcesMensuelles: 800, paysResidence: "Sénégal" }),
"ecart-important": diag({ ressourcesMensuelles: 400, paysResidence: "Sénégal" }),
"residence-non-documentee": diag({ ressourcesMensuelles: 1200, paysResidence: TEMOIN })
};

for (const [attendu, resultat] of Object.entries(cas)) {
assert.equal(phraseDeFin(resultat).cas, attendu);
}

// Chaque phrase porte son chiffre, et c'est le bon.
assert.match(phraseDeFin(cas["ecart-faible"]).texte, /Il vous manque 77,50 € par mois/);
assert.match(phraseDeFin(cas["ecart-important"]).texte, /l'écart est de 5 730 € sur l'année/);
assert.match(phraseDeFin(cas.tient).texte, /arriver à temps, avec un dossier complet/);
assert.match(phraseDeFin(cas["residence-non-documentee"]).texte, /sans rien repayer/);

// Le cas « pays non documenté » PRIME : quand il manque un chiffre, le
// dire est plus urgent que de commenter un total qu'on sait incomplet.
assert.equal(phraseDeFin(diag({ ressourcesMensuelles: 100, paysResidence: TEMOIN })).cas, "residence-non-documentee");

});

test("le ton : aucun point d'exclamation, aucune promesse, jamais un prix en dernier mot", () => {

const phrases = [
phraseDeFin(diag({ ressourcesMensuelles: 1200, paysResidence: "Sénégal" })).texte,
phraseDeFin(diag({ ressourcesMensuelles: 800, paysResidence: "Sénégal" })).texte,
phraseDeFin(diag({ ressourcesMensuelles: 400, paysResidence: "Sénégal" })).texte,
phraseDeFin(diag({ ressourcesMensuelles: 1200, paysResidence: TEMOIN })).texte
];

assert.equal(phrases.length, 4);

for (const p of phrases) {

assert.ok(!p.includes("!"), `point d'exclamation : « ${p.slice(0, 60)}… »`);

for (const interdite of PHRASES_INTERDITES) {
assert.ok(!p.toLowerCase().includes(interdite), `formule interdite « ${interdite} » : ${p.slice(0, 60)}…`);
}

// Finir sur une ACTION ou un CHEMIN, jamais sur un prix. Les seuls
// montants tolérés sont ceux qui NOMMENT l'écart de l'étudiant ; un
// tarif d'offre n'a rien à faire dans le dernier mot.
assert.ok(!/(75 000|150 000|10 000)/.test(p), `un prix dans la phrase de fin : ${p.slice(0, 60)}…`);

// La réassurance vient de la PRÉCISION : chaque phrase dit quoi faire
// ensuite, pas ce qu'il faut ressentir.
assert.ok(p.length > 90, `phrase trop courte pour dire un chemin : ${p}`);

}

// Les trois verdicts eux-mêmes tiennent le même ton.
for (const r of [1200, 800, 400].map((n) => diag({ ressourcesMensuelles: n, paysResidence: "Sénégal" }))) {
assert.ok(!verdictChiffre(r).phrase.includes("!"));
}

});

// ------------------------------------------------------------------
// 8. NON-RÉGRESSION — les totaux du lot S2-PAYS n'ont pas bougé
// ------------------------------------------------------------------

test("NON-RÉGRESSION : les huit totaux du lot S2-PAYS sont inchangés", () => {

const RESSOURCES_ET_DROITS = SEUIL_ANNUEL + DROITS_LICENCE;

for (const [pays, eur] of [["Sénégal", 130], ["Cameroun", 154], ["Côte d'Ivoire", 122], ["Bénin", 107], ["Togo", 107], ["Burkina Faso", 107]]) {
const r = diag({ ressourcesMensuelles: 900, paysResidence: pays });
assert.equal(r.total.annuelEUR, RESSOURCES_ET_DROITS + eur, pays);
assert.equal(r.total.inclutFraisDossier, true, pays);
}

for (const [pays, montant, devise] of [["Maroc", 1900, "MAD"], ["Guinée", 1500000, "GNF"]]) {
const r = diag({ ressourcesMensuelles: 900, paysResidence: pays });
assert.equal(r.total.annuelEUR, RESSOURCES_ET_DROITS, pays);
assert.equal(r.total.inclutFraisDossier, false, pays);
assert.deepEqual(r.total.enPlus, [{ montant, devise }], pays);
}

// Un pays NON documenté : 13 432 €, sans frais de dossier, et le total
// annonce lui-même ce qu'il exclut.
const inconnu = diag({ ressourcesMensuelles: 900, paysResidence: TEMOIN });
assert.equal(inconnu.total.annuelEUR, 13432);
assert.equal(inconnu.total.annuelEUR, RESSOURCES_ET_DROITS);
assert.equal(inconnu.total.inclutFraisDossier, false);
assert.equal(inconnu.residence.documentee, false);
assert.match(inconnu.total.texte, /HORS frais de dossier Campus France/);

// CE QUE LE TOTAL NE COMPREND PAS (lot R10, 2026-09-17). « Total annuel
// à justifier et à payer » se lit « tout », et trois dépenses réelles
// restent dehors : la traduction assermentée (obligatoire, comptée en
// semaines ET en argent), les frais de visa et de service, le voyage.
// Les taire, c'est laisser un étudiant boucler un budget faux avec un
// verdict qui dit « ça tient ». On les NOMME sans les chiffrer : ce
// module ne porte que des montants publiés, et une estimation inventée
// aurait l'air juste. Preuve par mutation : `${horsTotal}` retiré des
// trois phrases du total → rouge.
for (const r of [inconnu, calculerDiagnostic({ ressourcesMensuelles: 700, devise: "EUR", niveau: "licence", paysResidence: "Sénégal" }), calculerDiagnostic({ ressourcesMensuelles: 700, devise: "EUR", niveau: "master", paysResidence: "Maroc" })]) {
assert.equal(r.total.horsTotal, HORS_TOTAL, "la réserve doit venir de la constante, pas d'une phrase recopiée");
assert.ok(r.total.texte.includes(HORS_TOTAL), "le total s'affiche sans dire ce qu'il ne comprend pas");
}
assert.match(HORS_TOTAL, /traduction assermentée/);
assert.match(HORS_TOTAL, /visa/);
assert.match(HORS_TOTAL, /voyage/);
// Nommer n'est pas chiffrer : aucun montant inventé dans la réserve.
assert.ok(!/\d/.test(HORS_TOTAL), "la réserve ne doit porter aucun chiffre");

});

// ------------------------------------------------------------------
// 9. LA PAGE — l'ordre des sections EST le produit
// ------------------------------------------------------------------

test("la page rend les sept sections, dans l'ordre, et rien n'est masqué pour faire payer", () => {

const page = lire("diagnostic-france.html");
const js = lire("js/diagnostic-france-page.js");

const ordre = [
"diagVerdict", "diagBlocs", "diagTotal", "diagSectionVigilance",
"diagSectionCalendrier", "diagSectionLeviers", "diagSectionEtapes",
"diagSectionOffre", "diagFin"
];

let precedent = -1;
for (const id of ordre) {
const i = page.indexOf(`id="${id}"`);
assert.notEqual(i, -1, `${id} absent de la page`);
assert.ok(i > precedent, `${id} n'est pas à sa place dans l'ordre de lecture`);
precedent = i;
}

// Chaque section a son rendu, et le rendu passe par les modules purs.
for (const appel of ["renderVigilance(", "renderCalendrier(", "renderLeviers(", "renderEtapes(", "renderOffre(", "phraseDeFin("]) {
assert.ok(js.includes(appel), `${appel} n'est pas appelé`);
}

// AUCUN VERROU dans le résultat : pas de bloc flouté, pas de compteur
// « payez pour voir ». Les commentaires racontent la règle et n'ont pas
// à être fouillés — on regarde ce qui est RENDU.
const rendu = js.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/(^|\s)\/\/[^\n]*/g, "$1");
for (const phrase of ["payez pour", "débloquer", "problèmes détectés", "blur"]) {
assert.ok(!rendu.toLowerCase().includes(phrase), `« ${phrase} » ne doit pas exister dans le rendu`);
}

// Le résultat est enregistré ET rejouable.
assert.match(js, /diagnosticFrance: \{/);
assert.match(js, /calculeLe: new Date\(\)\.toISOString\(\)/);
assert.match(js, /etatVerdict: verdict\.etat/);
assert.match(js, /relancez le calcul/);

});

// ------------------------------------------------------------------
// 10. PARTIE B — les 10 000 F du diagnostic se déduisent
// ------------------------------------------------------------------

const { GRILLE, DEDUCTION_DIAGNOSTIC, prixAvecDeduction, calculerMiseAJour } = require(join(racine, "functions/lib/achat.js"));

const OFFRES_CLIENT = (() => {
const bac = { window: {} };
bac.window.window = bac.window;
vm.createContext(bac);
vm.runInContext(lire("pricing-plans.js"), bac);
return bac;
})();

test("un diagnostic payé depuis moins de 30 jours retire 10 000 F des deux Dossiers France", () => {

const maintenant = new Date("2026-09-09T12:00:00Z");
const recent = { diagnosticPayeLe: "2026-09-04T00:00:00Z" };

for (const [id, base] of [["dossier-france", 75000], ["dossier-france-conseiller", 150000]]) {
const t = prixAvecDeduction(id, recent, maintenant);
assert.equal(t.base, base, id);
assert.equal(t.deduction, 10000, id);
assert.equal(t.prix, base - 10000, id);
assert.equal(t.mention, "vos 10 000 F de diagnostic sont déduits", id);
}

// Sans diagnostic, hors délai, dans le futur : plein tarif.
for (const user of [{}, { diagnosticPayeLe: "2026-07-31T00:00:00Z" }, { diagnosticPayeLe: "2026-12-01T00:00:00Z" }]) {
const t = prixAvecDeduction("dossier-france", user, maintenant);
assert.equal(t.deduction, 0, JSON.stringify(user));
assert.equal(t.prix, 75000, JSON.stringify(user));
}

// PILE 30 jours : encore déduit. 31 : plus.
assert.equal(prixAvecDeduction("dossier-france", { diagnosticPayeLe: "2026-08-10T12:00:00Z" }, maintenant).deduction, 10000);
assert.equal(prixAvecDeduction("dossier-france", { diagnosticPayeLe: "2026-08-09T11:00:00Z" }, maintenant).deduction, 0);

// Le diagnostic lui-même ne se déduit pas de lui-même, et les formules
// bourse n'ont rien à voir avec lui.
for (const id of ["diagnostic-france", "conseiller-6", "fitzExpress"]) {
assert.equal(prixAvecDeduction(id, recent, maintenant).deduction, 0, id);
}

// Formule inconnue : null, jamais un prix improvisé.
assert.equal(prixAvecDeduction("formule-inexistante", recent, maintenant), null);

});

test("le filet pour les comptes payés AVANT ce lot, et la date que le webhook pose désormais", () => {

const maintenant = new Date("2026-09-09T12:00:00Z");

// Sans `diagnosticPayeLe`, l'échéance du diagnostic en cours moins sa
// durée (14 j) date l'achat. Sans ce filet, un compte qui vient de
// payer perdrait une déduction qu'il a achetée.
const ancien = { planPreinscription: "diagnostic-france", planPreinscriptionExpiresAt: "2026-09-18T00:00:00Z" };
assert.equal(prixAvecDeduction("dossier-france", ancien, maintenant).deduction, 10000);

// Un compte dont le forfait préinscription n'est PAS le diagnostic ne
// déclenche rien : un Dossier France en cours n'est pas un diagnostic.
const autre = { planPreinscription: "dossier-france", planPreinscriptionExpiresAt: "2027-07-31T00:00:00Z" };
assert.equal(prixAvecDeduction("dossier-france-conseiller", autre, maintenant).deduction, 0);

// Et le webhook pose la date à l'achat du diagnostic — seulement là.
const S = Symbol("supprimer");
const achat = calculerMiseAJour({ planId: "diagnostic-france", user: {}, maintenant, supprimer: S });
assert.equal(achat.statut, "applique");
assert.equal(achat.misAJour.diagnosticPayeLe, maintenant.toISOString());

for (const id of ["dossier-france", "conseiller-6"]) {
const autre = calculerMiseAJour({ planId: id, user: {}, maintenant, supprimer: S });
assert.equal(autre.misAJour.diagnosticPayeLe, undefined, id);
}

});

test("la déduction est écrite DEUX fois, et les deux disent la même chose", () => {

// Miroir client ↔ serveur, comme les prix et les quotas : une Cloud
// Function ne peut pas importer un module du site.
const client = OFFRES_CLIENT.window.SCHOLARBRIDGE_DEDUCTION;

assert.ok(client, "pricing-plans.js n'expose pas SCHOLARBRIDGE_DEDUCTION");
assert.equal(client.montant, DEDUCTION_DIAGNOSTIC.montant);
assert.equal(client.jours, DEDUCTION_DIAGNOSTIC.jours);
assert.equal(client.offre, DEDUCTION_DIAGNOSTIC.offre);
assert.equal(client.mention, DEDUCTION_DIAGNOSTIC.mention);
// join() et non deepEqual : le miroir client vit dans un autre realm
// (vm), et deux tableaux identiques n'y sont pas « reference-equal ».
assert.equal(client.plans.join(","), DEDUCTION_DIAGNOSTIC.plans.join(","));
assert.equal(client.dureeDiagnosticJours, DEDUCTION_DIAGNOSTIC.dureeDiagnosticJours);

// Et la durée recopiée est bien celle de la grille.
assert.equal(DEDUCTION_DIAGNOSTIC.dureeDiagnosticJours, GRILLE[DEDUCTION_DIAGNOSTIC.offre].dureeJours);

// Même verdict, sur les mêmes entrées.
const maintenant = new Date("2026-09-09T12:00:00Z");
const cas = [{}, { diagnosticPayeLe: "2026-09-04T00:00:00Z" }, { diagnosticPayeLe: "2026-07-31T00:00:00Z" }, { planPreinscription: "diagnostic-france", planPreinscriptionExpiresAt: "2026-09-18T00:00:00Z" }];

for (const user of cas) {
for (const id of ["dossier-france", "dossier-france-conseiller", "diagnostic-france"]) {
const serveur = prixAvecDeduction(id, user, maintenant);
const navigateur = OFFRES_CLIENT.window.prixAvecDeduction(id, user, maintenant);
assert.equal(navigateur.prix, serveur.prix, `${id} / ${JSON.stringify(user)}`);
assert.equal(navigateur.deduction, serveur.deduction, `${id} / ${JSON.stringify(user)}`);
}
}

});

test("c'est le prix SERVEUR qui est facturé, et la déduction est tracée sur le paiement", () => {

const paiement = lire("functions/paiement.js");

// Le navigateur n'envoie qu'un identifiant : le montant est recalculé
// ici, depuis le document users/{uid} lu au serveur.
// 2026-09-23 : la déduction se lit dans le pays de l'achat.
assert.match(paiement, /const tarif = prixAvecDeduction\(planId, profil, new Date\(\), destination\);/);
assert.match(paiement, /const montant = tarif\.prix;/);
assert.match(paiement, /total_amount: montant,/);
assert.match(paiement, /unit_price: String\(montant\)/);
assert.match(paiement, /montantAttendu: montant,/);

// La trace : ce qu'on a facturé, ce qu'affiche le catalogue, et l'écart.
assert.match(paiement, /montantCatalogue: tarif\.base,/);
assert.match(paiement, /deduction: tarif\.deduction,/);

// Plus aucun `offre.prix` ne part chez PayDunya.
assert.ok(!/total_amount: offre\.prix/.test(paiement));
assert.ok(!/unit_price: String\(offre\.prix\)/.test(paiement));

// Et les deux pages qui affichent un prix personnalisé passent par le
// miroir client — jamais par priceFCFA seul.
assert.match(lire("payment.js"), /window\.prixAvecDeduction/);
assert.match(lire("js/diagnostic-france-page.js"), /window\.prixAvecDeduction/);

});
