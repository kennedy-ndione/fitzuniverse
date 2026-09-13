/**
* ============================================================
* test/visa-depart.test.mjs — le guide VISA & DÉPART (lot S3)
* ============================================================
*
* CE QUE CE TEST PROTÈGE. La phase 06 était six cases à cocher avec une
* phrase chacune, écrites en dur DEUX FOIS — dans espace-bourse.html et
* dans espace-preinscription.html. Le guide vit maintenant dans
* js/visa-depart.js, en un seul endroit, et il a deux étages : un socle
* générique, et les étapes réelles de la destination, qui viennent des
* procédures avec leur source et leur date.
*
* La règle la plus importante est négative : AUCUN chiffre de pays dans
* le socle. Un montant écrit là échapperait à la discipline
* « source + date » des procédures, et vieillirait sans que personne ne
* s'en aperçoive — c'est exactement ce qui était arrivé aux faits
* sourcés sur des agrégateurs.
* ============================================================
*/

import { test } from "node:test";
import assert from "node:assert/strict";

import { VISA_ETAPES, visaComplete } from "../js/journey-map.js";
import { SOCLE_VISA, socleDe, estEtapeDeDepart, etapesDeDestination, guideVisaPour, defautsDuSocle } from "../js/visa-depart.js";
import { TRONCS, trouverProcedure } from "../js/procedures/index.js";
import { PAYS } from "../js/pays-preinscription.js";

test("le socle couvre exactement les six étapes de VISA_ETAPES, et il est substantiel", () => {
assert.deepEqual(defautsDuSocle(), []);
assert.deepEqual(SOCLE_VISA.map((e) => e.id), VISA_ETAPES);
// « Substantiel » se mesure : trois actions et deux pièges au minimum
// par étape — c'est ce qui sépare un accompagnement d'un aide-mémoire.
for (const e of SOCLE_VISA) {
assert.ok(e.actions.length >= 3, `${e.id} : ${e.actions.length} action(s)`);
assert.ok(e.vigilance.length >= 2, `${e.id} : ${e.vigilance.length} point(s) de vigilance`);
assert.ok(e.pourquoi.length >= 80, `${e.id} : le « pourquoi » ne dit pas de conséquence`);
}
assert.equal(socleDe("inconnue"), null);
assert.equal(socleDe("visa"), null, "« visa » n'est pas un id du socle : les six ids sont ceux de VISA_ETAPES");
assert.ok(socleDe("rdv_visa"));
});

test("aucun chiffre de pays dans le socle : les montants vivent dans les procédures", () => {
// Le test le plus important du fichier. Un montant, une devise ou une
// date écrits ici n'auraient ni source ni `verifieLe`, et personne ne
// saurait qu'ils ont vieilli.
const textes = SOCLE_VISA.flatMap((e) => [e.quand, e.pourquoi, ...e.actions, ...e.vigilance, ...Object.values(e.variantes)]).join("  ");
assert.ok(!/[€$£]/.test(textes), "un symbole monétaire dans le socle");
assert.ok(!/\b(EUR|USD|XOF|CAD|MAD|TRY|RON)\b/.test(textes), "un code devise dans le socle");
assert.ok(!/\d{4}-\d{2}-\d{2}/.test(textes), "une date ISO dans le socle");
// Les repères de durée relatifs, eux, sont voulus : ils ne vieillissent pas.
assert.match(SOCLE_VISA.find((e) => e.id === "finances").quand, /[Tt]rois mois/);
});

test("deux parcours, une seule variante servie — jamais les deux", () => {
const bourse = guideVisaPour({ espace: "bourse" });
const preins = guideVisaPour({ espace: "preinscription" });
assert.equal(bourse.espace, "bourse");
assert.equal(preins.espace, "preinscription");
for (let i = 0; i < SOCLE_VISA.length; i++) {
assert.equal(bourse.etapes[i].variante, SOCLE_VISA[i].variantes.bourse);
assert.equal(preins.etapes[i].variante, SOCLE_VISA[i].variantes.preinscription);
assert.notEqual(bourse.etapes[i].variante, preins.etapes[i].variante, `${SOCLE_VISA[i].id} : la même phrase pour les deux parcours`);
// L'objet servi ne porte PAS la table des variantes : un rendu ne
// doit pas pouvoir afficher par erreur la phrase de l'autre parcours.
assert.equal(bourse.etapes[i].variantes, undefined);
}
// Un espace inconnu retombe sur le parcours bourse, jamais sur rien.
assert.equal(guideVisaPour({ espace: "n'importe quoi" }).espace, "bourse");
assert.equal(guideVisaPour().etapes.length, 6);
});

test("sans destination documentée, le guide sert le socle et n'annonce aucun bloc vide", () => {
const sans = guideVisaPour({ espace: "bourse", procedure: null });
assert.equal(sans.etapes.length, 6);
assert.equal(sans.destination.documentee, false);
assert.deepEqual(sans.destination.etapes, []);
assert.equal(sans.destination.pays, "");
// Une procédure sans aucune étape de départ ne doit pas non plus
// afficher un titre prometteur au-dessus du vide.
const creuse = guideVisaPour({ procedure: { paysDestination: "Nulle part", etapes: [] } });
assert.equal(creuse.destination.documentee, false);
assert.equal(etapesDeDestination(undefined).length, 0);
assert.equal(etapesDeDestination({ etapes: null }).length, 0);
});

test("chaque destination apporte ses propres étapes de départ, sourcées et datées", () => {
for (const pays of PAYS) {
const procedure = trouverProcedure({ paysDestination: pays.nom });
const guide = guideVisaPour({ espace: "preinscription", procedure });
assert.equal(guide.destination.pays, pays.nom);
assert.equal(guide.destination.documentee, true, `${pays.nom} : aucune étape de départ`);
assert.ok(guide.destination.etapes.length >= 3, `${pays.nom} : ${guide.destination.etapes.length} étape(s) de départ`);
for (const e of guide.destination.etapes) {
assert.ok(estEtapeDeDepart(e), `${pays.nom} / ${e.id}`);
assert.match(e.source, /^https:\/\//, `${pays.nom} / ${e.id} : sans source`);
assert.match(e.verifieLe, /^\d{4}-\d{2}-\d{2}$/, `${pays.nom} / ${e.id} : sans date`);
assert.ok(e.consigne && e.consigne.length >= 80, `${pays.nom} / ${e.id} : consigne trop courte`);
}
// Le visa lui-même est toujours là.
assert.ok(guide.destination.etapes.some((e) => e.type === "visa"), `${pays.nom} : aucune étape de type visa`);
}
});

test("les délais d'après-arrivée, qui sont les plus courts du parcours, sont réellement dits", () => {
// Ce test n'est pas cosmétique : ce sont ces délais-là qui font perdre
// un droit. S'ils disparaissent d'une consigne, l'étudiant ne les lit
// nulle part ailleurs.
const attendus = {
Italie: /huit jours ouvrables/i,
Allemagne: /deux semaines/i,
Turquie: /trois mois/i,
Roumanie: /30 premiers jours/i,
Canada: /30 jours/i
};
for (const [pays, motif] of Object.entries(attendus)) {
const guide = guideVisaPour({ procedure: trouverProcedure({ paysDestination: pays }) });
const textes = guide.destination.etapes.map((e) => e.consigne).join("  ");
assert.match(textes, motif, `${pays} : le délai d'après-arrivée a disparu des consignes`);
}
});

test("le guide reste branché sur la mesure de la phase 06", () => {
// Le guide décrit ; journey-map MESURE. Les deux doivent parler des
// mêmes six ids, sinon une case cochée ne ferait avancer aucune phase.
const coche = {};
for (const e of SOCLE_VISA) coche[e.id] = true;
assert.equal(visaComplete(coche), true);
delete coche[SOCLE_VISA[0].id];
assert.equal(visaComplete(coche), false);
assert.equal(visaComplete({}), false);
});

test("tous les troncs déclarent leurs étapes de départ : aucune destination muette", () => {
for (const tronc of TRONCS) {
const depart = tronc.etapes.filter(estEtapeDeDepart);
assert.ok(depart.length >= 3, `${tronc.id} : ${depart.length} étape(s) marquée(s) phaseDepart`);
}
});
