/**
* ============================================================
* test/frais.test.mjs — le coût réel par université (lot D1)
* ============================================================
*
* LE test qui compte : un montant présent mais NON SOURCÉ ou NON DATÉ ne
* s'affiche pas. Et une université sans le champ ne dit jamais
* « gratuit » ni « 0 ».
* ============================================================
*/

import { test } from "node:test";
import assert from "node:assert/strict";

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
POLITIQUES_EXONERATION, LIBELLES_EXONERATION, BANDES, LIBELLES_BANDES,
SEUILS_PAR_DEVISE, SEUIL_GRATUIT, SEUIL_ABORDABLE, JOURS_FRAICHEUR, ORDRE_NIVEAUX, LIBELLE_SANS_PRIX,
bandeCout, lireFrais, lireExoneration, formaterMontant, libelleMontant, libelleFrais,
premierNiveauVerifie, libellePuce
} from "../js/frais.js";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const AUJOURDHUI = new Date("2026-09-07T10:00:00Z");

const iso = (jours) => {
const d = new Date(AUJOURDHUI);
d.setUTCDate(d.getUTCDate() - jours);
return d.toISOString().slice(0, 10);
};

/** Une université AVEC frais vérifiés, complète. */
function verifiee(surcharge = {}) {
return {
id: "u1", name: "Université Témoin",
fraisScolarite: {
licence: { montant: 3950, devise: "EUR", periode: "an" },
master: { montant: 2400, devise: "EUR", periode: "an" },
source: "https://exemple.invalid/frais",
verifieLe: iso(10),
...surcharge
}
};
}

const plat = (s) => s.replace(/[  ]/g, " ");

// ------------------------------------------------------------------
// Vocabulaires fermés
// ------------------------------------------------------------------

test("POLITIQUES_EXONERATION est fermé et chaque code a un libellé non vide", () => {
assert.deepEqual(POLITIQUES_EXONERATION, ["systematique", "possible_plafonnee", "aucune", "inconnue"]);
for (const p of POLITIQUES_EXONERATION) assert.ok(LIBELLES_EXONERATION[p] && LIBELLES_EXONERATION[p].trim(), `libellé vide pour ${p}`);
assert.deepEqual(Object.keys(LIBELLES_EXONERATION).sort(), [...POLITIQUES_EXONERATION].sort());
});

test("BANDES est fermé, chaque bande a un libellé, seuils 500 / 2 500", () => {
assert.deepEqual(BANDES, ["gratuit", "abordable", "eleve", "inconnu"]);
for (const b of BANDES) assert.ok(LIBELLES_BANDES[b] && LIBELLES_BANDES[b].trim());
assert.equal(SEUIL_GRATUIT, 500);
assert.equal(SEUIL_ABORDABLE, 2500);
assert.equal(JOURS_FRAICHEUR, 180);
});

test("les libellés de bandes sont neutres : ni symbole monétaire ni chiffre", () => {
for (const b of BANDES) {
assert.ok(!/[0-9€$£]/.test(LIBELLES_BANDES[b]), `${b} : « ${LIBELLES_BANDES[b]} »`);
assert.ok(!/CHF|EUR|USD|MAD/.test(LIBELLES_BANDES[b]), `${b} : code de devise dans le libellé`);
}
assert.equal(LIBELLES_BANDES.gratuit, "Gratuit ou presque");
assert.equal(LIBELLES_BANDES.eleve, "Plus cher");
});

test("aucun libellé de bande ne contient « non vérifié » — seule la puce de la carte le dit", () => {
for (const b of BANDES) assert.ok(!/non vérifié/i.test(LIBELLES_BANDES[b]), `${b} : « ${LIBELLES_BANDES[b]} »`);
assert.equal(LIBELLES_BANDES.inconnu, "Coût non classé");
assert.equal(LIBELLE_SANS_PRIX, "Frais non vérifiés");
assert.equal(libellePuce({ etat: "inconnu" }, {}), "Frais non vérifiés");
assert.equal(libelleFrais({}, "Licence"), "Frais non vérifiés");
});

// ------------------------------------------------------------------
// Un niveau replié ne classe pas (D2-ter)
// ------------------------------------------------------------------

test("replie → bande « inconnu », même pour un montant qui serait « gratuit » ; sans repli, le 0 € du niveau le plus bas reste « gratuit »", () => {
assert.equal(bandeCout(398, "EUR", { replie: true }), "inconnu");
assert.equal(bandeCout(0, "EUR", { replie: true }), "inconnu");
assert.equal(bandeCout(0, "EUR", { replie: false }), "gratuit");
assert.equal(bandeCout(0, "EUR"), "gratuit");
const zero = verifiee({ licence: { montant: 0, devise: "EUR", periode: "an" } });
const r = premierNiveauVerifie(zero, ["Licence", "Master"], OPT);
assert.equal(r.replie, false);
assert.equal(bandeCout(r.frais.montant, r.frais.devise, { replie: r.replie }), "gratuit");
});

/**
* LA RÈGLE, PAS LE DÉCOMPTE (réécrit le 2026-09-13, lots 57 et 58).
*
* Ce test comptait « onze eleve, zéro gratuit ». Le lot 57 a rempli dix
* universités françaises de plus et les deux affirmations sont tombées.
* La seconde avait raison sur le fond et a rendu un vrai service : elle a
* révélé que l'Université Grenoble Alpes affichait 178 €, c'est-à-dire le
* montant APRÈS une exonération qu'il faut DEMANDER et qui est plafonnée
* à 30 % des inscrits hors UE. Un étudiant aurait budgété 178 € et reçu
* une facture de 2 902 €. Corrigé par le lot 58.
*
* Ce qui est verrouillé ici n'est donc plus un nombre — il bougera à
* chaque lot — mais LA RÈGLE que cette erreur a mise au jour :
*
*   une université ne peut apparaître en bande « gratuit » que si son
*   exonération est `systematique`, c'est-à-dire accordée d'office.
*
* Si une exonération doit être demandée, le montant retenu doit être le
* TARIF PLEIN, le montant réduit allant dans la note. Toute violation
* future de cette règle fera tomber ce test avec le nom du coupable.
*/
test("règle des bandes françaises : « gratuit » exige une exonération systématique, et le repli laisse « inconnu »", () => {
const catalogue = JSON.parse(fs.readFileSync(path.join(RACINE, "assets/data/catalogue.json"), "utf8"));
const francaises = catalogue.universities.filter((u) => u.country === "France");
const niveauxDe = (u) => [...new Set(catalogue.programs.filter((p) => p.universityId === u.id).map((p) => p.level).filter(Boolean))];
const lu = new Map();
for (const u of francaises) {
const r = premierNiveauVerifie(u, niveauxDe(u));
lu.set(u.name, {
bande: bandeCout(r.frais.montant, r.frais.devise, { replie: r.replie }),
puce: plat(libellePuce(r.frais, r)),
politique: (u.exoneration || {}).politique || "inconnue",
replie: r.replie
});
}
const par = (b) => [...lu.entries()].filter(([, v]) => v.bande === b).map(([n]) => n).sort();

// LA RÈGLE. Un prix quasi nul ne s'affiche que si personne n'a de
// démarche à faire pour l'obtenir.
for (const nom of par("gratuit")) {
assert.equal(lu.get(nom).politique, "systematique",
`${nom} est en bande « gratuit » alors que son exonération est « ${lu.get(nom).politique} » : retenir le tarif plein et mettre le montant réduit dans la note`);
}
// LOT 93 (2026-09-25) : le décret n° 2026-385 du 19 mai 2026 supprime
// les exonérations générales pour les premières inscriptions à partir
// de 2027-2028. Toulouse, Paris-Saclay, Paris Cité et Rennes, qui
// exonéraient d'office en 2026-2027, affichent désormais le tarif plein,
// avec une exonération individuelle possible : jamais « gratuit ».
for (const nom of ["Université de Toulouse", "Université Paris-Saclay", "Université Paris Cité", "Université de Rennes"]) {
assert.notEqual(lu.get(nom).bande, "gratuit", nom);
assert.equal(lu.get(nom).politique, "possible_plafonnee", nom);
}

// LE REPLI. Un niveau replié n'est jamais classé, quel que soit le
// montant — mais il s'affiche quand même, avec « à partir de ».
for (const nom of ["Sorbonne Université", "École polytechnique", "École normale supérieure — PSL"]) {
assert.equal(lu.get(nom).replie, true, nom);
assert.equal(lu.get(nom).bande, "inconnu", nom);
assert.match(lu.get(nom).puce, /^à partir de /, `${nom} : ${lu.get(nom).puce}`);
}
assert.equal(lu.get("Sorbonne Université").puce, "à partir de 398 €/an · doctorat");

// Paris Cité (lot 75, puis lot 93) : non repliée. Son moratoire
// 2026-2027 ne peut pas valoir pour une première inscription en
// 2027-2028 (décret du 19 mai 2026) : la fiche affiche le tarif plein
// de la licence, et la note dit ce qui valait en 2026-2027.
assert.equal(lu.get("Université Paris Cité").replie, false);
assert.equal(lu.get("Université Paris Cité").politique, "possible_plafonnee");
assert.match(lu.get("Université Paris Cité").puce, /^2 902 €\/an/);

// L'ESSEC (lot 75) : 27 300 € par an en Master in Management pour un
// étudiant hors UE, le tarif plein, et une bourse au mérite qu'il faut
// obtenir (exonération « possible, places limitées »). Master, son
// niveau le plus bas : non repliée, classée « élevé ».
assert.equal(lu.get("ESSEC Business School").bande, "eleve");
assert.equal(lu.get("ESSEC Business School").replie, false);
assert.equal(lu.get("ESSEC Business School").politique, "possible_plafonnee");
assert.match(lu.get("ESSEC Business School").puce, /^27 300 €\/an/);
});

test("SEUIL_GRATUIT / SEUIL_ABORDABLE dérivent de SEUILS_PAR_DEVISE.EUR (source unique)", () => {
assert.equal(SEUIL_GRATUIT, SEUILS_PAR_DEVISE.EUR.gratuit);
assert.equal(SEUIL_ABORDABLE, SEUILS_PAR_DEVISE.EUR.abordable);
// Lot SEUILS-DEVISES (2026-09-12) : les sept devises facturées par les
// universités des lots 48-50, chacune posée à la main au taux BCE du
// 2026-09-11 puis arrondie — voir le commentaire de SEUILS_PAR_DEVISE.
assert.deepEqual(Object.keys(SEUILS_PAR_DEVISE), ["EUR", "USD", "GBP", "CHF", "CAD", "JPY", "KRW", "CNY", "ZAR", "MAD", "TRY", "RUB", "TND", "SEK", "MYR", "INR", "SAR"]);
for (const [devise, s] of Object.entries(SEUILS_PAR_DEVISE)) {
assert.ok(Number.isInteger(s.gratuit) && Number.isInteger(s.abordable) && s.gratuit > 0 && s.abordable > s.gratuit, devise);
}
// Les seuils sont les 500 € / 2 500 € du jugement Hubs exprimés dans la
// devise : à ±10 % près du taux BCE du 2026-09-11 (l'arrondi à un chiffre
// rond ne doit jamais déformer le jugement).
// RUB (lot 54) : la BCE ne cote plus le rouble depuis 2022. Taux de
// référence : Banque centrale de Russie du 12.09.2026, 1 EUR = 97,8728 RUB.
const TAUX = { USD: 1.1592, GBP: 0.85815, CHF: 0.9451, CAD: 1.6064, JPY: 178.56, KRW: 1556.56, CNY: 7.7762, ZAR: 20.45, MAD: 10.82, TRY: 48.20, RUB: 97.8728, TND: 3.3824, SEK: 11.2373, MYR: 4.7185, INR: 110.7675, SAR: 4.3559 };
for (const [devise, taux] of Object.entries(TAUX)) {
const s = SEUILS_PAR_DEVISE[devise];
assert.ok(Math.abs(s.gratuit / (500 * taux) - 1) <= 0.10, `${devise} gratuit hors tolérance`);
assert.ok(Math.abs(s.abordable / (2500 * taux) - 1) <= 0.10, `${devise} abordable hors tolérance`);
}
// Et les montants du catalogue se classent : un yen n'est plus « inconnu ».
assert.equal(bandeCout(642960, "JPY"), "eleve");
assert.equal(bandeCout(390, "EUR"), "gratuit");
assert.equal(bandeCout(4380, "CHF"), "eleve");
assert.equal(bandeCout(23000, "CNY"), "eleve");
assert.equal(bandeCout(176, "EUR"), "gratuit", "Trieste : exonérée, seuls timbre et taxe régionale");
assert.equal(bandeCout(139300, "ZAR"), "eleve");
assert.equal(bandeCout(79000, "TRY"), "abordable", "ITU, licence lettres et sciences");
assert.equal(bandeCout(490000, "RUB"), "eleve", "HSE, master a Moscou");
assert.equal(bandeCout(200000, "RUB"), "abordable", "HSE Perm, licence la moins chere");
// TND (lot 56) : cours Banque Centrale de Tunisie du 10/09/2026, 1 EUR = 3,3824 TND.
assert.equal(bandeCout(5000, "TND"), "abordable", "grille nationale tunisienne, licence");
assert.equal(bandeCout(15000, "TND"), "eleve", "grille nationale tunisienne, etudes medicales");
// Lot 57 (2026-09-13) : quatre devises de plus.
assert.equal(bandeCout(192500, "SEK"), "eleve", "KTH, master");
assert.equal(bandeCout(21600, "MYR"), "eleve", "Universiti Malaya, master");
assert.equal(bandeCout(129000, "INR"), "abordable", "University of Delhi, master");
assert.equal(bandeCout(0, "SAR"), "gratuit", "universites publiques saoudiennes : bourse d'Etat");
// KES et RWF n'ont PAS de seuil, et c'est voulu : aucun cours officiel
// lisible le 2026-09-13. Verrouille ici pour que l'ajout d'un seuil soit
// un geste conscient, pas un effet de bord.
assert.equal(bandeCout(343200, "KES"), "inconnu", "shilling kenyan : seuil non pose");
assert.equal(bandeCout(1600000, "RWF"), "inconnu", "franc rwandais : seuil non pose");
assert.equal(bandeCout(1000, "XOF"), "inconnu", "une devise sans seuil reste non classée");
assert.match(formaterMontant(23000, "CNY"), /^23.000.¥ CN\/an$/, "yuan distingué du yen");
assert.match(formaterMontant(642960, "JPY"), /^642.960.¥\/an$/);
});

// ------------------------------------------------------------------
// La règle des trois valeurs
// ------------------------------------------------------------------

test("université sans le champ → etat inconnu, libellé sans « 0 » ni « gratuit »", () => {
for (const uni of [{}, { fraisScolarite: null }, { fraisScolarite: {} }, null, undefined]) {
const f = lireFrais(uni, "Licence", { aujourdhui: AUJOURDHUI });
assert.equal(f.etat, "inconnu");
assert.equal(f.montant, null);
const l = libelleFrais(uni, "Licence", { aujourdhui: AUJOURDHUI });
assert.equal(l, "Frais non vérifiés");
assert.ok(!/0/.test(l) && !/gratuit/i.test(l));
}
});

test("montant présent mais source absente → inconnu (le chiffre non sourcé ne s'affiche pas)", () => {
const sansSource = verifiee({ source: undefined });
delete sansSource.fraisScolarite.source;
assert.equal(lireFrais(sansSource, "Licence", { aujourdhui: AUJOURDHUI }).etat, "inconnu");
assert.equal(libelleFrais(sansSource, "Licence", { aujourdhui: AUJOURDHUI }), "Frais non vérifiés");

const sourceInvalide = verifiee({ source: "page officielle" });
assert.equal(lireFrais(sourceInvalide, "Licence", { aujourdhui: AUJOURDHUI }).etat, "inconnu");
});

test("montant présent mais verifieLe absent ou illisible → inconnu", () => {
const sansDate = verifiee();
delete sansDate.fraisScolarite.verifieLe;
assert.equal(lireFrais(sansDate, "Licence", { aujourdhui: AUJOURDHUI }).etat, "inconnu");
assert.equal(lireFrais(verifiee({ verifieLe: "septembre 2026" }), "Licence", { aujourdhui: AUJOURDHUI }).etat, "inconnu");
assert.equal(lireFrais(verifiee({ verifieLe: "2026-13-45" }), "Licence", { aujourdhui: AUJOURDHUI }).etat, "inconnu");
});

test("niveau sans ligne → inconnu, même si un autre niveau est vérifié", () => {
const f = lireFrais(verifiee(), "Doctorat", { aujourdhui: AUJOURDHUI });
assert.equal(f.etat, "inconnu");
assert.equal(lireFrais(verifiee(), "Licence", { aujourdhui: AUJOURDHUI }).etat, "verifie");
assert.equal(lireFrais(verifiee(), "licence", { aujourdhui: AUJOURDHUI }).etat, "verifie", "casse indifférente");
assert.equal(lireFrais(verifiee(), "Ingénierie", { aujourdhui: AUJOURDHUI }).etat, "inconnu");
});

test("montant 0 vérifié et sourcé → verifie, montant 0 (jamais un « inconnu » déguisé)", () => {
const f = lireFrais(verifiee({ licence: { montant: 0, devise: "EUR", periode: "an" } }), "Licence", { aujourdhui: AUJOURDHUI });
assert.equal(f.etat, "verifie");
assert.equal(f.montant, 0);
});

test("zéro vérifié → « Gratuit · vérifié le … », jamais « 0 € »", () => {
const zero = verifiee({ licence: { montant: 0, devise: "EUR", periode: "an" } });
const l = plat(libelleFrais(zero, "Licence", { aujourdhui: AUJOURDHUI }));
assert.equal(l, "Gratuit · vérifié le 28 août 2026");
assert.ok(!/0 €/.test(l) && !/\b0 /.test(l), `« ${l} »`);
assert.equal(libelleMontant(lireFrais(zero, "Licence", { aujourdhui: AUJOURDHUI })), "Gratuit");
});

test("zéro vérifié mais pas fraîche → « Gratuit · à recouper »", () => {
const zero = verifiee({ licence: { montant: 0, devise: "EUR", periode: "an" }, verifieLe: iso(200) });
assert.equal(libelleFrais(zero, "Licence", { aujourdhui: AUJOURDHUI }), "Gratuit · à recouper");
});

test("libelleMontant : un montant non nul passe par formaterMontant, un état inconnu reste « Frais non vérifiés »", () => {
assert.equal(plat(libelleMontant(lireFrais(verifiee(), "Licence", { aujourdhui: AUJOURDHUI }))), "3 950 €/an");
assert.equal(libelleMontant(lireFrais({}, "Licence")), "Frais non vérifiés");
assert.equal(libelleMontant(null), "Frais non vérifiés");
});

// ------------------------------------------------------------------
// Fraîcheur et libellé
// ------------------------------------------------------------------

test("vérifié il y a 10 jours → fraiche, libellé daté", () => {
const f = lireFrais(verifiee(), "Licence", { aujourdhui: AUJOURDHUI });
assert.equal(f.etat, "verifie");
assert.equal(f.fraiche, true);
assert.equal(plat(libelleFrais(verifiee(), "Licence", { aujourdhui: AUJOURDHUI })), "3 950 €/an · vérifié le 28 août 2026");
});

test("verifieLe vieux de 200 jours → fraiche false, libellé « à recouper »", () => {
const vieille = verifiee({ verifieLe: iso(200) });
const f = lireFrais(vieille, "Licence", { aujourdhui: AUJOURDHUI });
assert.equal(f.etat, "verifie");
assert.equal(f.fraiche, false);
assert.equal(plat(libelleFrais(vieille, "Licence", { aujourdhui: AUJOURDHUI })), "3 950 €/an · à recouper");
});

test("exactement 180 jours → encore fraîche ; 181 → à recouper", () => {
assert.equal(lireFrais(verifiee({ verifieLe: iso(180) }), "Licence", { aujourdhui: AUJOURDHUI }).fraiche, true);
assert.equal(lireFrais(verifiee({ verifieLe: iso(181) }), "Licence", { aujourdhui: AUJOURDHUI }).fraiche, false);
});

test("formaterMontant : milliers séparés, devise telle que facturée, période", () => {
assert.equal(plat(formaterMontant(3950)), "3 950 €/an");
assert.equal(plat(formaterMontant(450, "EUR", "an")), "450 €/an");
assert.equal(plat(formaterMontant(12500, "CHF", "semestre")), "12 500 CHF/semestre");
assert.equal(plat(formaterMontant(9000, "GBP")), "9 000 £/an");
});

// ------------------------------------------------------------------
// Bandes
// ------------------------------------------------------------------

test("bandeCout : 0 et 450 → gratuit ; 2 400 → abordable ; 3 950 → eleve ; absent → inconnu", () => {
assert.equal(bandeCout(0), "gratuit");
assert.equal(bandeCout(450), "gratuit");
assert.equal(bandeCout(500), "gratuit");
assert.equal(bandeCout(2400), "abordable");
assert.equal(bandeCout(2500), "abordable");
assert.equal(bandeCout(3950), "eleve");
assert.equal(bandeCout(null), "inconnu");
assert.equal(bandeCout(undefined), "inconnu");
assert.equal(bandeCout("3950"), "inconnu");
assert.equal(bandeCout(-1), "inconnu");
});

test("bandeCout : une devise sans seuils posés reste « inconnu » — jamais convertie", () => {
assert.equal(bandeCout(0, "EUR"), "gratuit");
// USD a ses seuils depuis le lot SEUILS-DEVISES (2026-09-12) : la devise
// « sans seuils » de ce test devient la livre turque, absente du tableau.
assert.equal(bandeCout(450, "XOF"), "inconnu");
assert.equal(bandeCout(12000, "XOF"), "inconnu", "une devise sans seuils posés reste non classée");
assert.equal(bandeCout(450, "EUR"), "gratuit");
});

test("bandeCout lit SEUILS_PAR_DEVISE : des seuils MAD posés (dans ce test seulement) rangent un montant en dirhams", () => {
// Valeurs de TEST, pas une décision : elles prouvent le mécanisme, sans
// figer un seuil marocain que seul le lot D2 posera, avec sa source.
SEUILS_PAR_DEVISE.MAD = { gratuit: 5000, abordable: 25000 };
try {
assert.equal(bandeCout(12000, "MAD"), "abordable");
assert.equal(bandeCout(4000, "MAD"), "gratuit");
assert.equal(bandeCout(40000, "MAD"), "eleve");
} finally {
delete SEUILS_PAR_DEVISE.MAD;
}
assert.equal(bandeCout(12000, "MAD"), "inconnu", "le tableau est revenu à son état d'origine");
});

// ------------------------------------------------------------------
// Exonération
// ------------------------------------------------------------------

test("lireExoneration : absent ou code hors vocabulaire → inconnue", () => {
assert.equal(lireExoneration({}).politique, "inconnue");
assert.equal(lireExoneration({ exoneration: { politique: "Systematique" } }).politique, "inconnue");
assert.equal(lireExoneration({ exoneration: { politique: "possible_plafonnee", detail: "Places limitées" } }).politique, "possible_plafonnee");
assert.equal(lireExoneration(null).politique, "inconnue");
});

// ------------------------------------------------------------------
// Le niveau que la carte affiche (D2-bis)
// ------------------------------------------------------------------

const OPT = { aujourdhui: AUJOURDHUI };

/** Université avec un montant vérifié en MASTER seulement. */
function masterSeul(surcharge = {}) {
return { id: "u2", name: "Master seul", fraisScolarite: { master: { montant: 3950, devise: "EUR", periode: "an" }, source: "https://exemple.invalid/m", verifieLe: iso(10), ...surcharge } };
}

test("montant en master seulement, sans filtre → le master s'affiche, « à partir de » et le nom du niveau", () => {
const r = premierNiveauVerifie(masterSeul(), ["Licence", "Master", "Doctorat"], OPT);
assert.equal(r.niveau, "Master");
assert.equal(r.frais.etat, "verifie");
assert.equal(r.replie, true);
assert.equal(plat(libellePuce(r.frais, r)), "à partir de 3 950 €/an · master");
});

test("montant en licence → libellé inchangé, PAS de « à partir de » (non-régression)", () => {
const r = premierNiveauVerifie(verifiee(), ["Licence", "Master"], OPT);
assert.equal(r.niveau, "Licence");
assert.equal(r.replie, false);
assert.equal(plat(libellePuce(r.frais, r)), "3 950 €/an");
assert.ok(!/à partir de/.test(libellePuce(r.frais, r)));
});

test("aucun montant vérifié → « Frais non vérifiés », niveau le plus bas comme avant", () => {
const r = premierNiveauVerifie({ id: "u3" }, ["Master", "Doctorat"], OPT);
assert.equal(r.niveau, "Master", "le plus bas niveau de l'établissement");
assert.equal(r.frais.etat, "inconnu");
assert.equal(r.replie, false);
assert.equal(libellePuce(r.frais, r), "Frais non vérifiés");
});

test("ordre Licence / Master / Doctorat : un doctorat vérifié ne passe pas devant un master vérifié", () => {
const deux = masterSeul({ doctorat: { montant: 398, devise: "EUR", periode: "an" } });
assert.equal(premierNiveauVerifie(deux, [], OPT).niveau, "Master");
const docSeul = { id: "u4", fraisScolarite: { doctorat: { montant: 398, devise: "EUR", periode: "an" }, source: "https://exemple.invalid/d", verifieLe: iso(10) } };
const r = premierNiveauVerifie(docSeul, ["Licence", "Doctorat"], OPT);
assert.equal(r.niveau, "Doctorat");
assert.equal(plat(libellePuce(r.frais, r)), "à partir de 398 €/an · doctorat");
});

test("les niveaux PROPOSÉS passent d'abord : HEC (master seulement au catalogue) affiche son master, pas son bachelor", () => {
const hec = verifiee({ licence: { montant: 26500, devise: "EUR", periode: "an" }, master: { montant: 29450, devise: "EUR", periode: "an" } });
const r = premierNiveauVerifie(hec, ["Master"], OPT);
assert.equal(r.niveau, "Master");
assert.equal(r.replie, false);
assert.equal(plat(libellePuce(r.frais, r)), "29 450 €/an");
});

test("filtre master actif sur une université sans prix master → « Frais non vérifiés », le repli ne s'applique pas", () => {
// La page lit alors directement le niveau demandé, sans repli.
const f = lireFrais(verifiee({ master: undefined }), "Master", OPT);
assert.equal(f.etat, "inconnu");
assert.equal(libellePuce(f, { niveau: "Master", replie: false }), "Frais non vérifiés");
});

test("libellePuce : replié ET pas fraîche → les deux mentions ; zéro vérifié replié → « à partir de Gratuit » jamais", () => {
const vieux = premierNiveauVerifie(masterSeul({ verifieLe: iso(200) }), [], OPT);
assert.equal(plat(libellePuce(vieux.frais, vieux)), "à partir de 3 950 €/an · master · à recouper");
assert.deepEqual(ORDRE_NIVEAUX, ["Licence", "Master", "Doctorat"]);
});

/**
* PLANCHER, PAS PHOTOGRAPHIE (corrigé le 2026-09-13, lot 57).
*
* Ce test exigeait EXACTEMENT 15 universités françaises avec un montant.
* C'était le relevé du jour où il a été écrit. Le lot 57 en a rempli dix
* de plus : 25 sur 26, seule l'ESSEC restant sans prix publié. Le test
* est donc tombé en annonçant 25 au lieu de 15 — en disant la réussite
* du lot, pas un défaut.
*
* Même correction qu'au test pays-preinscription : un PLANCHER. Un lot
* peut ajouter des prix, jamais en effacer. Le relever est normal ; le
* BAISSER veut dire qu'on a perdu des données — chercher pourquoi avant
* de toucher au chiffre.
*
* Ce qui reste une égalité, parce que c'est un vrai contrat de code :
* la liste des fiches REPLIÉES, celles où le niveau affiché n'est pas
* celui demandé. L'ENS-PSL y est entrée au lot 57 et c'est juste — elle
* ne délivre pas de licence, un profil licence voit donc son master.
*
* Lot 75 (2026-09-23) : 26 sur 26. L'ESSEC a son prix (27 300 € en
* master) et le plancher monte à 26. Paris Cité sort des repliées :
* sa licence (178 €) et son master (255 €) sont enfin vérifiés.
*/
test("rejeu sur les 26 universités françaises de l'instantané : au moins 26 affichent un montant", () => {
const catalogue = JSON.parse(fs.readFileSync(path.join(RACINE, "assets/data/catalogue.json"), "utf8"));
const francaises = catalogue.universities.filter((u) => u.country === "France");
assert.equal(francaises.length, 26);
const niveauxDe = (u) => [...new Set(catalogue.programs.filter((p) => p.universityId === u.id).map((p) => p.level).filter(Boolean))];
const affichees = francaises.filter((u) => premierNiveauVerifie(u, niveauxDe(u)).frais.etat === "verifie");
// Plancher relevé le 2026-09-23 après le lot 75 (25 au lot 57). Ne jamais le baisser.
assert.ok(affichees.length >= 26, `${affichees.length} universités françaises affichent un montant, plancher 26 — des prix ont été effacés`);
assert.ok(affichees.length <= francaises.length, "plus d'affichées que d'établissements");
const repliees = francaises.filter((u) => premierNiveauVerifie(u, niveauxDe(u)).replie).map((u) => u.name).sort();
assert.deepEqual(repliees, ["Sorbonne Université", "École normale supérieure — PSL", "École polytechnique"].sort());
});

// ------------------------------------------------------------------
// Pureté
// ------------------------------------------------------------------

test("lireFrais et libelleFrais ne mutent jamais l'université", () => {
const uni = verifiee();
const avant = JSON.stringify(uni);
lireFrais(uni, "Licence", { aujourdhui: AUJOURDHUI });
lireFrais(uni, "Doctorat", { aujourdhui: AUJOURDHUI });
libelleFrais(uni, "Master", { aujourdhui: AUJOURDHUI });
lireExoneration(uni);
assert.equal(JSON.stringify(uni), avant);

const vide = {};
lireFrais(vide, "Licence");
libelleFrais(vide, "Licence");
assert.deepEqual(vide, {});
});
