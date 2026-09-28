/**
* LOT 114 — LES BOURSES SUISSES ROUVERTES, ET UN BANDEAU D'ACCUEIL
* QUI NE MONTRE QUE DES ÉCHÉANCES ENCORE DANS LES TEMPS (2026-09-26)
*
* 1. Les bourses d'excellence de la Confédération suisse : appel
*    2027-2028 ouvert, dépôt sur GO ESKAS, une date limite par pays
*    d'Afrique (`echeancesParPays`), que le moteur et la fiche donnent à
*    chaque étudiant selon sa nationalité.
* 2. Le bandeau : programme ouvert, date vérifiée d'abord, 30 jours au
*    moins, jamais « déjà inscrit sur place », la une en tête.
*/
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { PATCHES, ECHEANCES_PAR_PAYS } from "../scripts/data/lot114-bourses-suisses.mjs";
import { validerLot } from "../scripts/lot-validate.mjs";
import { AFRIQUE } from "../js/eligibility-countries.js";
import { analyserEcheance, joursAvant } from "../js/echeance.js";
import {
echeanceDuPays, programmePourLeProfil, etatEcheance, proposable, retenirOpportunites,
explainMatch, pourquoiPlusProposable, JOURS_MINIMUM_POUR_DEPOSER
} from "../js/recommend-programs.js";
import {
selectionnerOpportunites, libelleCarte, dansLesTemps, echeanceDuProgramme,
JOURS_MINIMUM_BANDEAU, MAX_CARTES
} from "../js/bandeau-selection.js";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(join(racine, f), "utf8").replace(/\r\n/g, "\n");
const brut = JSON.parse(lire("assets/data/catalogue.json"));
const catalogue = JSON.parse(lire("assets/data/catalogue.json"));
for (const p of PATCHES) Object.assign(catalogue[p.collection].find((d) => d.id === p.id), p.champs);
const B = new Map(catalogue.scholarships.map((b) => [b.id, b]));
const U = new Map(catalogue.universities.map((u) => [u.id, u]));
const JOUR = new Date("2026-09-26T09:00:00Z");
const ESKAS = "swiss-government-excellence-scholarships";
const bourse = B.get(ESKAS);
const programmes = catalogue.programs.filter((p) => p.scholarshipId === ESKAS);

test("114 — le lot est valide, et chaque « attendu » dit ce que la base porte (avant) ou ce que le lot écrit (après)", () => {
assert.deepEqual(validerLot({ PATCHES }, JOUR).erreurs, []);
assert.equal(PATCHES.length, 4);
for (const p of PATCHES) {
const b = brut[p.collection].find((d) => d.id === p.id);
assert.ok(b, p.id);
for (const [cle, valeur] of Object.entries(p.attendu || {})) {
const lu = JSON.stringify(b[cle]);
assert.ok(lu === JSON.stringify(valeur) || lu === JSON.stringify(p.champs[cle]), `${p.id}.${cle}`);
}
for (const [cle, valeur] of Object.entries(p.champs)) {
if (typeof valeur === "string") assert.ok(!valeur.includes("—"), `${p.id}.${cle} : tiret long`);
}
}
});

test("114 — les 54 pays d'Afrique ont chacun leur date, et seulement eux", () => {
assert.deepEqual(Object.keys(ECHEANCES_PAR_PAYS).sort(), [...AFRIQUE].sort());
assert.deepEqual(bourse.echeancesParPays, ECHEANCES_PAR_PAYS);
const dates = [...new Set(Object.values(ECHEANCES_PAR_PAYS))].sort();
assert.deepEqual(dates, ["2026-10-13", "2026-10-27", "2026-11-10", "2026-11-13", "2026-11-27", "2026-11-30"]);
assert.equal(ECHEANCES_PAR_PAYS.SN, "2026-11-30");
assert.equal(ECHEANCES_PAR_PAYS.CI, "2026-11-27");
assert.equal(ECHEANCES_PAR_PAYS.CM, "2026-11-27");
assert.equal(ECHEANCES_PAR_PAYS.TN, "2026-10-13");
assert.equal(ECHEANCES_PAR_PAYS.MA, "2026-11-10");
assert.equal(ECHEANCES_PAR_PAYS.CD, "2026-11-30");
});

test("114 — la bourse et ses trois programmes disent l'appel 2027-2028", () => {
assert.deepEqual(bourse.exigences, ["directeur_these"], "le dépôt ne passe plus par l'ambassade");
assert.equal(bourse.aLaUne, true);
assert.equal(bourse.status, "Ouverte");
assert.ok(bourse.description.length <= 150 && !/postdoc/i.test(bourse.description));
assert.ok(bourse.periodeOuverture.length <= 130);
assert.match(bourse.generalCriteria, /GO ESKAS/);
assert.match(bourse.generalCriteria, /31 juillet 2027/);
assert.match(bourse.generalCriteria, /30 juin 2027 pour l'ETH Zurich/);
assert.match(bourse.generalCriteria, /31 décembre 1991/);
assert.ok(!/ambassade|dakar@/i.test(bourse.generalCriteria));
assert.equal(programmes.length, 3);
for (const p of programmes) {
assert.equal(p.status, "Ouverte", p.id);
assert.equal(p.level, "Doctorat", p.id);
assert.ok(p.coverage.length <= 100, p.id);
assert.ok(!/ambassade|représentation diplomatique/i.test(`${p.deadline} ${p.description}`), `${p.id} : le dépôt ne passe plus par l'ambassade`);
// La prose ne porte aucune date : sinon elle deviendrait la date limite de tout le monde.
assert.equal(analyserEcheance(p.deadline).etat, "inconnue", p.id);
assert.equal(p.sourceVerification.parUid.length > 0, true);
}
});

test("114 — le moteur donne à chaque étudiant la date de SON pays, et le plancher de 30 jours s'y applique", () => {
assert.equal(echeanceDuPays(bourse, "Sénégalais(e)"), "2026-11-30");
assert.equal(echeanceDuPays(bourse, "Sénégal"), "2026-11-30");
assert.equal(echeanceDuPays(bourse, "Tunisien(ne)"), "2026-10-13");
assert.equal(echeanceDuPays(bourse, ""), null);
assert.equal(echeanceDuPays(bourse, "Français(e)"), null, "hors d'Afrique : pas de date publiée ici");
assert.equal(echeanceDuPays({}, "Sénégalais(e)"), null);
assert.equal(echeanceDuPays({ echeancesParPays: { SN: "30 novembre" } }, "Sénégalais(e)"), null, "une date qui n'est pas ISO ne vaut rien");

const p = programmes[0];
const perso = programmePourLeProfil(p, bourse, { nationality: "Sénégalais(e)" });
assert.equal(perso.deadlineISO, "2026-11-30");
assert.equal(p.deadlineISO, undefined, "le document du catalogue n'est pas modifié");
assert.equal(programmePourLeProfil(p, bourse, { nationality: "" }), p);

const sen = etatEcheance(perso, JOUR);
assert.equal(sen.ouverte, true);
assert.equal(sen.jours, 65);
assert.equal(sen.certitude, "verifiee");
assert.equal(proposable(perso, bourse, sen).ok, true);

const tun = etatEcheance(programmePourLeProfil(p, bourse, { nationality: "Tunisien(ne)" }), JOUR);
assert.equal(tun.jours, 17);
assert.equal(proposable(p, bourse, tun).raison, "trop_tard", "17 jours ne suffisent pas à réunir un dossier");

assert.ok(explainMatch(p, U.get(p.universityId), bourse, { nationality: "Sénégalais(e)" }, JOUR).includes("Candidatures ouvertes — il vous reste 65 jours"));
assert.equal(pourquoiPlusProposable({ program: p, scholarship: bourse, profile: { nationality: "Tunisien(ne)" }, aujourdhui: new Date("2026-10-14T09:00:00Z") }), "sa date limite est passée pour ce cycle");
assert.equal(pourquoiPlusProposable({ program: p, scholarship: bourse, profile: { nationality: "Sénégalais(e)" }, aujourdhui: new Date("2026-10-14T09:00:00Z") }), "");
});

test("114 — un doctorant sénégalais se voit proposer la bourse suisse, avec sa date ; un Tunisien non", () => {
const profil = (nationality) => ({ nationality, country: "Sénégal", targetLevel: "Doctorat", palier: "master_obtenu", birthDate: "1996-05-01", languages: ["Français", "Anglais"], fundingNeed: "Financement complet", desiredField: "Informatique" });
const suisses = (nationality) => retenirOpportunites({ profile: profil(nationality), programs: catalogue.programs, universitiesById: U, scholarshipsById: B, aujourdhui: JOUR, max: 50 })
.retenues.filter((r) => r.scholarshipId === ESKAS);
const sen = suisses("Sénégalais(e)");
assert.equal(sen.length, 1);
assert.equal(sen[0].deadlineISO, "2026-11-30");
assert.equal(sen[0].jours, 65);
assert.equal(sen[0].dateConfirmee, true);
assert.equal(suisses("Tunisien(ne)").length, 0);
});

test("114 — le plancher du bandeau est celui du moteur", () => {
assert.equal(JOURS_MINIMUM_BANDEAU, JOURS_MINIMUM_POUR_DEPOSER);
assert.equal(MAX_CARTES, 12);
});

test("114 — le bandeau : la bourse suisse en tête, puis seulement des échéances à 30 jours ou plus", () => {
const { ouvertes, retenues } = selectionnerOpportunites(catalogue.programs, B, U, JOUR);
assert.ok(ouvertes.length >= 5, "assez de cartes pour défiler");
assert.ok(retenues.length <= MAX_CARTES);
const une = retenues[0];
assert.equal(une.scholarshipId, ESKAS);
assert.deepEqual(une.parPays, { premiere: "2026-10-13", derniere: "2026-11-30", nombre: 54 });
assert.equal(une.lien, "scholarships.html?search=Swiss%20Government%20Excellence%20Scholarships");
const l = libelleCarte(une, JOUR);
assert.equal(l.texte, "Selon votre pays, du 13 oct. au 30 nov.");
assert.equal(l.chiffre, "");
assert.equal(l.titre, "La date limite dépend de votre pays : entre le 13 octobre 2026 et le 30 novembre 2026");
for (const o of ouvertes) {
const b = B.get(o.scholarshipId);
assert.ok(o.echeance.etat === "continue" || joursAvant(o.echeance, JOUR) >= 30, `${o.nom} : moins de 30 jours`);
assert.ok(!(b.exigences || []).includes("deja_inscrit_sur_place"), `${o.nom} : réservée aux étudiants déjà inscrits`);
}
const noms = ouvertes.map((o) => o.scholarshipId);
for (const absente of ["chevening-scholarships", "knight-hennessy-scholars", "semmelweis-pannonia-in-excellence", "mastercard-foundation-scholars-uct", "veneto-regional-scholarship", "dsu-lombardia-milano-statale"]) {
assert.ok(B.has(absente), `${absente} : identifiant inconnu, le test ne prouverait rien`);
assert.ok(!noms.includes(absente), absente);
}
// Le 1er novembre, la dernière date suisse (30 novembre) est à 29 jours : la carte s'en va d'elle-même.
const novembre = selectionnerOpportunites(catalogue.programs, B, U, new Date("2026-11-01T09:00:00Z"));
assert.ok(!novembre.ouvertes.some((o) => o.scholarshipId === ESKAS));
const octobre = selectionnerOpportunites(catalogue.programs, B, U, new Date("2026-10-31T09:00:00Z"));
assert.equal(octobre.retenues[0].scholarshipId, ESKAS);
});

test("114 — les règles du bandeau, sur des cas construits", () => {
const bourses = new Map([
["a", { id: "a", title: "A", status: "Ouverte", isActive: true }],
["b", { id: "b", title: "B", status: "Ouverte", isActive: true, exigences: ["deja_inscrit_sur_place"] }],
["c", { id: "c", title: "C", status: "Ouverte", isActive: true, echeanceVariable: "pays" }],
["d", { id: "d", title: "D", status: "Ouverte", isActive: true, aLaUne: true }],
["e", { id: "e", title: "E", status: "Ouverte", isActive: true }]
]);
const universites = new Map([["u", { id: "u", country: "Pays" }]]);
const prog = (id, scholarshipId, champs) => ({ id, scholarshipId, universityId: "u", level: "Master", ...champs });
const { ouvertes } = selectionnerOpportunites([
// La date vérifiée passe avant la prose : 60 jours, pas 10.
prog("a1", "a", { status: "Ouverte", deadline: "Clôture le 6 octobre 2026.", deadlineISO: "2026-11-25" }),
prog("b1", "b", { status: "Ouverte", deadline: "Clôture le 30 décembre 2026." }),
prog("c1", "c", { status: "Ouverte", deadline: "Clôture le 30 décembre 2026." }),
prog("d1", "d", { status: "Ouverte", deadline: "Clôture le 15 janvier 2027." }),
// Programme fermé, bourse ouverte : pas de carte.
prog("e1", "e", { status: "Fermée", deadline: "Clôture le 30 décembre 2026." })
], bourses, universites, JOUR);
assert.deepEqual(ouvertes.map((o) => o.scholarshipId), ["d", "a"], "la une d'abord ; b (déjà inscrit), c (date par pays sans table) et e (programme fermé) écartés");
assert.equal(ouvertes[1].echeance.date, "2026-11-25");
assert.equal(echeanceDuProgramme({ deadline: "Clôture le 6 octobre 2026.", deadlineISO: "2026-02-30" }).date, "2026-10-06", "une date ISO impossible ne prime pas");
assert.equal(dansLesTemps({ etat: "continue" }, JOUR), true);
assert.equal(dansLesTemps(analyserEcheance("Clôture le 26 octobre 2026."), JOUR), true, "30 jours : dans les temps");
assert.equal(dansLesTemps(analyserEcheance("Clôture le 25 octobre 2026."), JOUR), false, "29 jours : trop tard");
assert.equal(dansLesTemps(analyserEcheance("Date à confirmer."), JOUR), false, "une date inconnue ne fait pas de carte");
});

test("114 — le rendu passe par le module de sélection, la fiche et le moteur lisent la date du pays", () => {
const bandeau = lire("js/opportunites-bandeau.js");
assert.match(bandeau, /import \{ selectionnerOpportunites, libelleCarte \} from "\.\/bandeau-selection\.js";/);
assert.match(bandeau, /a\.href = opp\.lien \|\| "scholarships\.html";/);
assert.match(bandeau, /échéances encore dans les temps/);
assert.ok(!/function regrouper/.test(bandeau));
// L'accueil ne charge pas le moteur de recommandation pour autant.
assert.ok(!/recommend-programs/.test(lire("js/bandeau-selection.js").replace(/\/\*[\s\S]*?\*\//g, "")));
const details = lire("details.js");
assert.match(details, /const datePays = echeanceDuPays\(university, nationaliteFiche\);/);
assert.match(details, /echeancesParPays: scholarshipData\.echeancesParPays \|\| null,/);
const moteur = lire("js/recommend-programs.js");
assert.equal((moteur.match(/programmePourLeProfil\(/g) || []).length, 4, "définition + explainMatch + retenirOpportunites + pourquoiPlusProposable");
});
