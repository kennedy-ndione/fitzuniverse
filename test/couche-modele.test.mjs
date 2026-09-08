/**
* ============================================================
* test/couche-modele.test.mjs — la forme d'une couche (S2-MODÈLE)
* ============================================================
*
* Quatre pays lus à la source (Sénégal, Côte d'Ivoire, Cameroun, Maroc)
* ont fait apparaître trois cas que composerProcedure() ne savait pas
* représenter, plus une question de devise. Ce lot n'ajoute AUCUN pays :
* il ouvre la forme, pour que les fichiers de données des pays suivants
* puissent être chargés sans rouvrir un module.
*
*   absences        une couche peut être PARTIELLEMENT documentée — le
*                   cas le plus fréquent, pas l'exception ;
*   decomposition   un montant peut être une somme (Cameroun : 85 000 F
*                   de Campus France + 16 000 F de TLS) ;
*   avertissement   ce que l'organisme officiel du pays dit de nous
*                   (Maroc : aucun intermédiaire privé n'est accrédité) ;
*   devise          on n'additionne que XOF et EUR, dont la parité est
*                   légale et fixe. Le dirham s'affiche en dirhams.
*
* LE TEST QUI COMPTE LE PLUS EST LE DERNIER : la couche Sénégal, qui n'a
* pas bougé, doit produire exactement ce qu'elle produisait avant.
* ============================================================
*/

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { PROCEDURE_FRANCE } from "../js/procedures/france.js";
import { COUCHE_FRANCE_SENEGAL } from "../js/procedures/residences/france-senegal.js";
import { composerProcedure, defautsDeCouche, defautsDeProcedure, trouverProcedure, deviseAdditionnable, DEVISES_ADDITIONNABLES, MENTION_RESIDENCE_ABSENTE } from "../js/procedures/index.js";
import { calculerDiagnostic, enEuros, formatMontant, texteDecomposition, textesRendus } from "../js/diagnostic-france.js";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(join(racine, f), "utf8").replace(/\r\n/g, "\n");

const SOURCE = "https://exemple.org/frais";
const LE = "2026-09-08";

/** Une couche factice complète, à laquelle chaque test retire ou ajoute. */
function couche(extra = {}) {
return {
id: "france-factice",
destination: "France",
pays: "Côte d'Ivoire",
verifieLe: LE,
faits: {
fraisDossier: { montant: 75000, devise: "XOF", texte: "x", source: SOURCE, verifieLe: LE }
},
etapes: {},
...extra
};
}

// ------------------------------------------------------------------
// 1. absences — une couche partiellement documentée
// ------------------------------------------------------------------

const PHRASE_CALENDRIER = "Le calendrier de la campagne n'est pas encore publié pour votre pays : Campus France ne le met en ligne qu'à l'ouverture, début octobre.";

test("absences.calendrier : les étapes qui en dépendent portent la phrase de la couche, sans échéance", () => {

const partielle = composerProcedure(PROCEDURE_FRANCE, couche({ absences: { calendrier: PHRASE_CALENDRIER } }));

assert.deepEqual(defautsDeProcedure(partielle), []);
assert.equal(partielle.residenceDocumentee, true, "le pays EST documenté — pour ses frais");
assert.equal(partielle.etapes.length, 11);

// Les cinq étapes qui citent « calendrier » dans leur dependDe.
const avecMention = partielle.etapes.filter((e) => e.mention);
assert.deepEqual(avecMention.map((e) => e.id), ["ef_soumission", "ef_paiement", "ef_confirmation", "ef_complement", "ef_visa"]);
for (const e of avecMention) {
assert.equal(e.mention, PHRASE_CALENDRIER, e.id);
assert.ok(e.consigne.endsWith(PHRASE_CALENDRIER), `${e.id} : la phrase doit être LUE, pas seulement portée`);
assert.deepEqual(e.absences, ["calendrier"], e.id);
}

// AUCUNE échéance calculée pour un jalon absent.
assert.equal(partielle.etapes.filter((e) => e.echeance).length, 0);

// Et surtout : la mention générale « votre pays n'est pas documenté »
// n'apparaît NULLE PART. Elle serait fausse — le pays l'est, pour ses
// frais — et c'est précisément le trou que ce champ vient combler :
// avant lui, l'étudiant voyait ses frais, aucune date, et aucune
// explication.
for (const e of partielle.etapes) {
assert.ok(!e.consigne.includes(MENTION_RESIDENCE_ABSENTE), `${e.id} : mention générale servie à tort`);
}

// Les étapes qui ne dépendent pas du calendrier restent intactes.
const compte = partielle.etapes.find((e) => e.id === "ef_compte");
assert.equal(compte.mention, undefined);
assert.equal(compte.consigne, PROCEDURE_FRANCE.etapes.find((e) => e.id === "ef_compte").consigne);
});

test("absences : une clé libre ne touche que les étapes qui la déclarent (Maroc : les jalons d'aval)", () => {
const phrase = "Les dates d'entretien et de réponse ne sont pas publiées par votre espace Campus France.";
const partielle = composerProcedure(PROCEDURE_FRANCE, couche({ absences: { jalonsAval: phrase } }));
const touchees = partielle.etapes.filter((e) => e.mention).map((e) => e.id);
assert.deepEqual(touchees, ["ef_entretien", "ef_reponse"]);
// Le reste du calendrier, lui, n'est pas déclaré absent : les échéances
// des étapes amont survivent si la couche porte ses jalons.
assert.deepEqual(defautsDeProcedure(partielle), []);
});

test("absences : deux phrases sur une même étape se suivent, dans l'ordre de dependDe", () => {
const partielle = composerProcedure(PROCEDURE_FRANCE, couche({
faits: {},
absences: { fraisDossier: "Le montant n'est pas publié.", calendrier: "Le calendrier non plus." }
}));
const paiement = partielle.etapes.find((e) => e.id === "ef_paiement");
assert.equal(paiement.mention, "Le montant n'est pas publié. Le calendrier non plus.");
assert.deepEqual(paiement.absences, ["fraisDossier", "calendrier"]);
});

test("absences : refusée si vide, si le fait est pourtant présent, ou si personne ne la consomme", () => {
const defauts = (c) => defautsDeCouche(c, PROCEDURE_FRANCE);
assert.ok(defauts(couche({ absences: { calendrier: "  " } })).some((d) => /absence calendrier : sans phrase/.test(d)));
// La contradiction la plus dangereuse : un montant affiché ET déclaré
// inconnu. L'étudiant lirait les deux.
assert.ok(defauts(couche({ absences: { fraisDossier: "Inconnu." } })).some((d) => /ce fait est pourtant présent/.test(d)));
// Une phrase que personne ne sert est une phrase écrite pour rien, et
// le lot suivant croira l'avoir affichée.
assert.ok(defauts(couche({ absences: { horaires: "Inconnus." } })).some((d) => /aucune étape ne la consomme/.test(d)));
assert.deepEqual(defauts(couche({ absences: { calendrier: PHRASE_CALENDRIER } })), []);
});

// ------------------------------------------------------------------
// 2. decomposition — un montant qui est une somme
// ------------------------------------------------------------------

const CAMEROUN = {
montant: 101000, devise: "XOF", texte: "x", source: SOURCE, verifieLe: LE,
decomposition: [
{ libelle: "frais Campus France", montant: 85000, devise: "XOF" },
{ libelle: "frais TLS", montant: 16000, devise: "XOF" }
]
};

test("decomposition : la somme doit être ÉGALE au montant, au franc près", () => {
const avec = (fraisDossier) => defautsDeCouche(couche({ faits: { fraisDossier } }), PROCEDURE_FRANCE);
assert.deepEqual(avec(CAMEROUN), [], "85 000 + 16 000 = 101 000");
// Un écart n'est pas un arrondi à tolérer : c'est un chiffre faux
// quelque part, et on ne sait pas lequel.
assert.ok(avec({ ...CAMEROUN, montant: 100000 }).some((d) => /la décomposition fait 101000, le montant dit 100000/.test(d)));
assert.ok(avec({ ...CAMEROUN, decomposition: [{ libelle: "a", montant: 84999, devise: "XOF" }, { libelle: "b", montant: 16000, devise: "XOF" }] }).some((d) => /décomposition fait/.test(d)));
});

test("decomposition : toutes les lignes portent la devise du fait", () => {
const melange = { ...CAMEROUN, decomposition: [{ libelle: "a", montant: 85000, devise: "XOF" }, { libelle: "b", montant: 16000, devise: "EUR" }] };
const defauts = defautsDeCouche(couche({ faits: { fraisDossier: melange } }), PROCEDURE_FRANCE);
assert.ok(defauts.some((d) => /ligne « b » en EUR au lieu de XOF/.test(d)));
});

test("decomposition : une ligne sans libellé, sans montant, ou une liste vide sont refusées", () => {
const avec = (decomposition) => defautsDeCouche(couche({ faits: { fraisDossier: { ...CAMEROUN, decomposition } } }), PROCEDURE_FRANCE);
assert.ok(avec([]).some((d) => /decomposition vide/.test(d)));
assert.ok(avec([{ montant: 101000, devise: "XOF" }]).some((d) => /sans libellé/.test(d)));
assert.ok(avec([{ libelle: "a", devise: "XOF" }]).some((d) => /sans montant/.test(d)));
});

test("decomposition : le total ET le détail s'affichent ensemble, jamais l'un sans l'autre", () => {
assert.equal(texteDecomposition({ montant: 5 }), "", "sans décomposition : rien, pas de bloc vide");
const phrase = texteDecomposition(CAMEROUN);
assert.match(phrase, /frais Campus France 85 000 F CFA/);
assert.match(phrase, /frais TLS 16 000 F CFA/);
});

// ------------------------------------------------------------------
// 3. avertissement — ce que l'organisme officiel dit de nous
// ------------------------------------------------------------------

const AVERTISSEMENT = "Campus France Maroc rappelle qu'aucun organisme privé n'est accrédité pour constituer votre dossier : ces dossiers sont aisément reconnaissables et vous exposez à un risque juridique.";

test("avertissement : rendu quand la couche en porte un, absent sinon — jamais de bloc vide", () => {
const avec = composerProcedure(PROCEDURE_FRANCE, couche({ avertissement: AVERTISSEMENT }));
assert.equal(avec.avertissement, AVERTISSEMENT);
assert.deepEqual(defautsDeProcedure(avec), []);

const sans = composerProcedure(PROCEDURE_FRANCE, couche());
assert.equal(sans.avertissement, "", "chaîne vide : l'appelant n'affiche rien");

const sansCouche = composerProcedure(PROCEDURE_FRANCE, null);
assert.equal(sansCouche.avertissement, "");

// Présent mais vide = une erreur de saisie, pas un choix.
assert.ok(defautsDeCouche(couche({ avertissement: "   " }), PROCEDURE_FRANCE).some((d) => /avertissement : présent mais vide/.test(d)));
});

test("avertissement : affiché EN TÊTE du parcours, hors du bloc repliable", () => {
const source = lire("applications.js");
// Hors du <details> : un avertissement qu'il faut déplier n'avertit
// personne. Le test vérifie l'ORDRE, pas seulement la présence.
assert.ok(source.includes("const blocAvertissement = avertissement"));
assert.ok(source.includes("return `${blocAvertissement}<details class=\"app-procedure\">"));
assert.ok(lire("applications.css").includes(".app-procedure-avertissement{"));
});

// ------------------------------------------------------------------
// 4. La devise — ne convertir que ce qui a une parité fixe
// ------------------------------------------------------------------

test("on n'additionne que XOF et EUR ; toute autre devise ne se convertit pas", () => {
assert.deepEqual(DEVISES_ADDITIONNABLES, ["EUR", "XOF"]);
assert.equal(deviseAdditionnable("XOF"), true);
assert.equal(deviseAdditionnable("eur"), true);
assert.equal(deviseAdditionnable("MAD"), false);
assert.equal(deviseAdditionnable(""), false);
// LE défaut corrigé : enEuros rendait le montant tel quel pour toute
// devise inconnue — 1 900 dirhams ressortaient en « 1 900 € », une
// erreur d'un facteur dix sur le seul chiffre que ce produit vend.
assert.equal(enEuros(1900, "MAD"), null);
assert.equal(enEuros(655957, "XOF"), 1000);
assert.equal(enEuros(1000, "EUR"), 1000);
});

test("formatMontant : chaque devise dans la sienne, jamais un symbole inventé", () => {
assert.equal(formatMontant(85000, "XOF"), "85 000 F CFA");
assert.equal(formatMontant(1900, "MAD"), "1 900 Dhs");
assert.equal(formatMontant(2902, "EUR"), "2 902 €");
assert.equal(formatMontant(1000, "TND"), "1 000 TND", "une devise inconnue s'écrit par son code");
});

test("un fait en MAD : ni la composition ni le diagnostic ne se cassent, et aucun total en euros ne l'absorbe", () => {

// La couche marocaine n'existe pas encore : on prouve que la FORME la
// supporte, ce qui est tout l'objet de ce lot.
const maroc = composerProcedure(PROCEDURE_FRANCE, couche({
pays: "Maroc",
faits: { fraisDossier: { montant: 1900, devise: "MAD", texte: "x", source: SOURCE, verifieLe: LE } }
}));
assert.deepEqual(defautsDeProcedure(maroc), []);
assert.equal(maroc.faits.fraisDossier.devise, "MAD");

// Le diagnostic tourne sur le SÉNÉGAL (seul pays enregistré) : la
// preuve côté diagnostic se fait donc sur ses fonctions pures, plus
// l'assurance qu'un montant non convertible ne rentre pas dans le total.
const eur = 10530 + 2902;
const sansPays = calculerDiagnostic({ ressourcesMensuelles: 900, paysResidence: "Maroc" });
assert.equal(sansPays.total.annuelEUR, eur, "un pays non documenté : le total ne contient que les chiffres français");
assert.deepEqual(sansPays.total.enPlus, []);
// Et la règle de devise elle-même : 1 900 Dhs ne valent pas 1 900 €.
assert.notEqual(enEuros(1900, "MAD"), 1900);
assert.equal(formatMontant(1900, "MAD").includes("€"), false);
});

// ------------------------------------------------------------------
// 5. LA NON-RÉGRESSION — le Sénégal n'a pas bougé
// ------------------------------------------------------------------

test("la couche Sénégal, inchangée, produit exactement le même résultat qu'avant ce lot", () => {

const sn = trouverProcedure({ paysDestination: "France", paysResidence: "Sénégal" });

assert.deepEqual(defautsDeProcedure(sn), []);
assert.equal(sn.residenceDocumentee, true);
assert.equal(sn.etapes.length, 11);
// Aucune absence, aucun avertissement : la couche n'en déclare pas.
assert.equal(sn.absences, null);
assert.equal(sn.avertissement, "");
assert.equal(sn.etapes.filter((e) => e.mention).length, 0, "aucune mention : tout est documenté");
assert.equal(sn.etapes.filter((e) => e.echeance).length, 5, "les cinq échéances de la campagne");
assert.equal(sn.etapes.find((e) => e.id === "ef_paiement").montant, 85000);
assert.equal(COUCHE_FRANCE_SENEGAL.absences, undefined);
assert.equal(COUCHE_FRANCE_SENEGAL.avertissement, undefined);

// Et le diagnostic sénégalais, chiffre pour chiffre.
const r = calculerDiagnostic({ ressourcesMensuelles: 900, paysResidence: "Sénégal" });
assert.equal(r.fraisDossier.montant, 85000);
assert.equal(r.fraisDossier.additionnable, true);
assert.equal(r.fraisDossier.decomposition, null);
assert.match(r.fraisDossier.texte, /85 000 F CFA/);
assert.equal(r.total.inclutFraisDossier, true);
assert.deepEqual(r.total.enPlus, []);
assert.equal(r.total.annuelEUR, 10530 + 2902 + 130);
// Aucun texte ne promet un résultat, ni ne parle de taux de change.
for (const t of textesRendus(r)) assert.ok(!/visa (sera|est) accordé|taux de change/i.test(t), t);
});
