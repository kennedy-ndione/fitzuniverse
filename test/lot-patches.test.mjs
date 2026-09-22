/**
 * ============================================================
 * Tests — forme PATCHES du runner de lots (2026-08-31)
 *
 * Les trois autres formes (UNIVERSITIES / SCHOLARSHIPS / LINKS) ne
 * savent que CRÉER ; un patch met à jour PARTIELLEMENT un document
 * existant. Ce que ce test verrouille est exactement ce que le runner
 * refuse (scripts/lot-validate.mjs, appelé par `analyser`).
 *
 * Le piège central, testé explicitement : une chaîne VIDE est une
 * valeur légitime (« vider ce champ »), jamais une absence. Trois
 * universités marocaines publiques du lot 33 en dépendent.
 *
 * Lancer : npm test   (ou : node --test test/)
 * ============================================================
 */

import test from "node:test";
import assert from "node:assert/strict";

import { validerPatches, validerLot, refusPortailProgramme, boursesSansProgramme, COLLECTIONS_PATCHABLES, refusDatesDeLecture } from "../scripts/lot-validate.mjs";
import * as lot33 from "../scripts/data/lot33-portails.mjs";

function patchMinimal(surcharges = {}) {
return {
collection: "universities",
id: "u1",
champs: { applicationPortalUrl: "https://exemple.test/apply" },
motif: "motif de test",
...surcharges
};
}

// ============================================================
// 1. Le validateur
// ============================================================

test("patch minimal correct : aucune erreur", () => {
assert.deepEqual(validerPatches([patchMinimal()]), []);
});

test("collection hors énuméré refusée ; les trois collections légitimes acceptées", () => {
assert.ok(validerPatches([patchMinimal({ collection: "users" })]).some((e) => e.includes("hors énuméré")));
assert.ok(validerPatches([patchMinimal({ collection: "admins" })]).some((e) => e.includes("hors énuméré")));
for (const collection of COLLECTIONS_PATCHABLES) {
assert.deepEqual(validerPatches([patchMinimal({ collection })]), [], collection);
}
});

test("champs vide ou absent refusé — un patch qui n'écrit rien n'a pas lieu d'être", () => {
assert.ok(validerPatches([patchMinimal({ champs: {} })]).some((e) => e.includes("champs")));
assert.ok(validerPatches([patchMinimal({ champs: undefined })]).some((e) => e.includes("champs")));
});

test("motif absent, vide ou blanc refusé", () => {
for (const motif of [undefined, "", "   "]) {
assert.ok(validerPatches([patchMinimal({ motif })]).some((e) => e.includes("motif")), JSON.stringify(motif));
}
});

test("deux patches sur le même document refusés (conflit d'intention)", () => {
const erreurs = validerPatches([patchMinimal(), patchMinimal({ champs: { officialWebsite: "https://autre.test" } })]);
assert.ok(erreurs.some((e) => e.includes("double")));
});

test("même id dans DEUX collections différentes : accepté, ce sont deux documents", () => {
const erreurs = validerPatches([
patchMinimal({ collection: "universities", id: "jkuat-juja" }),
patchMinimal({ collection: "programs", id: "jkuat-juja" })
]);
assert.deepEqual(erreurs, []);
});

test("UNE CHAÎNE VIDE EST UNE VALEUR : le validateur l'accepte comme n'importe quelle autre", () => {
assert.deepEqual(validerPatches([patchMinimal({ champs: { applicationPortalUrl: "" } })]), []);
// Et en tant que valeur attendue, elle est un sous-ensemble valide.
assert.deepEqual(validerPatches([patchMinimal({
champs: { applicationPortalUrl: "" },
attendu: { applicationPortalUrl: "" }
})]), []);
});

test("attendu doit être un sous-ensemble des clés de champs", () => {
const intrus = validerPatches([patchMinimal({ attendu: { officialWebsite: "https://ailleurs.test" } })]);
assert.ok(intrus.some((e) => e.includes("sous-ensemble")));

// Sous-ensemble strict : accepté.
assert.deepEqual(validerPatches([patchMinimal({
champs: { applicationPortalUrl: "https://a.test", officialWebsite: "https://b.test" },
attendu: { applicationPortalUrl: "https://ancien.test" }
})]), []);
});

test("un lot peut porter PATCHES SEUL, sans les trois autres formes", () => {
const resultat = validerLot({ PATCHES: [patchMinimal()] });
assert.deepEqual(resultat.erreurs, []);
assert.equal(resultat.attendus.patches, 1);
assert.equal(resultat.attendus.universites, 0);
assert.deepEqual(resultat.programmes, []);
});

test("PATCHES cohabite avec les formes de création dans un même lot", () => {
const resultat = validerLot({
UNIVERSITIES: [{ id: "u1", data: { name: "U", country: "Kenya" } }],
SCHOLARSHIPS: [{ id: "s1", data: { title: "S", country: "Kenya", levels: ["Master"] } }],
LINKS: [{ scholarshipId: "s1", pays: "Kenya", universityIds: ["u1"] }],
PATCHES: [patchMinimal({ id: "autre-universite" })]
});
assert.deepEqual(resultat.erreurs, []);
assert.equal(resultat.programmes.length, 1);
assert.equal(resultat.attendus.patches, 1);
});

// ============================================================
// 2. Garde du portail de candidature (applicationUrl sur programs)
//
// La règle : le portail vit sur l'UNIVERSITÉ. Un programme ne le porte
// que pour une exception réelle, et cette exception doit être DÉCLARÉE.
// Sans cette garde, le prochain lot déferait le nettoyage — exactement
// comme les lots 19-31 ont défait la migration du 2026-08-10.
// ============================================================

function patchProgramme(surcharges = {}) {
return {
collection: "programs",
id: "politecnico-di-milano-milan__bourse__doctorat",
champs: { applicationUrl: "https://exemple.test/phd-apply" },
motif: "motif de test",
...surcharges
};
}

test("REFUS : poser une applicationUrl sur un programme sans motif d'exception", () => {
const erreurs = validerPatches([patchProgramme()]);
assert.equal(erreurs.length, 1);
assert.match(erreurs[0], /applicationUrl/);
// Le message doit ENSEIGNER la règle, pas seulement refuser.
assert.match(erreurs[0], /universities\.applicationPortalUrl/);
assert.match(erreurs[0], /overrideApplicationUrl/);
});

test("ACCEPTATION : la même écriture passe avec overrideApplicationUrl motivé", () => {
const erreurs = validerPatches([patchProgramme({
overrideApplicationUrl: "portail doctoral distinct du portail licence/master (Politecnico di Milano)"
})]);
assert.deepEqual(erreurs, []);
});

test("un override vide ou blanc ne vaut pas motif", () => {
for (const override of ["", "   ", true, 1]) {
assert.equal(validerPatches([patchProgramme({ overrideApplicationUrl: override })]).length, 1, JSON.stringify(override));
}
});

test("VIDER reste toujours permis, sans motif — c'est le remède, pas la maladie", () => {
assert.deepEqual(validerPatches([patchProgramme({ champs: { applicationUrl: "" } })]), []);
assert.deepEqual(validerPatches([patchProgramme({ champs: { applicationUrl: null } })]), []);
});

test("la garde ne vise QUE la collection programs", () => {
// Même champ sur une université : c'est là qu'il doit vivre.
assert.deepEqual(validerPatches([patchMinimal({
collection: "universities",
champs: { applicationPortalUrl: "https://exemple.test/apply" }
})]), []);
// Et un patch programs qui touche un AUTRE champ passe sans motif.
assert.deepEqual(validerPatches([patchProgramme({ champs: { deadline: "15 janvier 2027" } })]), []);
});

test("la garde s'applique aussi aux LIENS de création, pas seulement aux patches", () => {
const lot = {
UNIVERSITIES: [{ id: "u1", data: { name: "U", country: "Kenya" } }],
SCHOLARSHIPS: [{ id: "s1", data: { title: "S", country: "Kenya", levels: ["Master"] } }],
LINKS: [{ scholarshipId: "s1", pays: "Kenya", universityIds: ["u1"], applicationUrl: "https://exemple.test/apply" }]
};
assert.ok(validerLot(lot).erreurs.some((e) => e.includes("applicationUrl")));

lot.LINKS[0].overrideApplicationUrl = "portail réellement distinct, vérifié à la source";
assert.deepEqual(validerLot(lot).erreurs, []);
});

test("refusPortailProgramme : null quand le champ n'est pas touché du tout", () => {
assert.equal(refusPortailProgramme("test", { deadline: "x" }), null);
assert.equal(refusPortailProgramme("test", {}), null);
assert.equal(refusPortailProgramme("test", null), null);
});

// ============================================================
// 3. Les données du lot 33
// ============================================================

test("lot 33 : aucune erreur bloquante hors ligne", () => {
assert.deepEqual(validerLot(lot33).erreurs, []);
});

test("lot 33 : 24 patches, tous sur universities", () => {
assert.equal(lot33.PATCHES.length, 24);
for (const p of lot33.PATCHES) assert.equal(p.collection, "universities", p.id);
});

test("lot 33 : exactement 3 patches vident le portail (les publiques marocaines)", () => {
const vides = lot33.PATCHES.filter((p) => p.champs.applicationPortalUrl === "");
assert.equal(vides.length, 3);
assert.deepEqual(vides.map((p) => p.id).sort(), [
"universite-cadi-ayyad-marrakech",
"universite-hassan-ii-casablanca",
"universite-mohammed-v-rabat"
]);
});

test("lot 33 : les 21 autres portent une URL https, et chaque patch a son motif", () => {
for (const p of lot33.PATCHES) {
assert.ok(p.motif && p.motif.trim().length > 10, `motif trop court : ${p.id}`);
const url = p.champs.applicationPortalUrl;
assert.ok(url === "" || /^https:\/\//.test(url), `URL non https : ${p.id} -> ${url}`);
}
});

test("lot 33 : chaque patch ne touche QUE applicationPortalUrl", () => {
for (const p of lot33.PATCHES) {
assert.deepEqual(Object.keys(p.champs), ["applicationPortalUrl"], p.id);
}
});

test("lot 33 : aucun patch ne réécrit la valeur qu'il dit attendre", () => {
for (const p of lot33.PATCHES) {
if (!p.attendu) continue;
assert.notEqual(p.champs.applicationPortalUrl, p.attendu.applicationPortalUrl, p.id);
}
});

// ============================================================
// 4. boursesSansProgramme — l'indicateur de santé du moteur payant
//
// Une bourse qu'aucun programme ne référence est invisible à
// recommendPrograms(), donc à la fonctionnalité facturée. Testé sur des
// données factices : aucune lecture Firestore.
// ============================================================

test("une bourse liée et une bourse orpheline : compte 1, et c'est le bon id", () => {
const bourses = [{ id: "bourse-liee" }, { id: "bourse-orpheline" }];
const programmes = [{ id: "u1__bourse-liee__master", scholarshipId: "bourse-liee" }];
assert.deepEqual(boursesSansProgramme(bourses, programmes), ["bourse-orpheline"]);
});

test("aucun programme du tout : toutes les bourses sont orphelines", () => {
assert.deepEqual(boursesSansProgramme([{ id: "a" }, { id: "b" }], []), ["a", "b"]);
});

test("plusieurs programmes sur la même bourse ne la comptent pas deux fois", () => {
const programmes = [
{ scholarshipId: "a", level: "Licence" },
{ scholarshipId: "a", level: "Master" }
];
assert.deepEqual(boursesSansProgramme([{ id: "a" }, { id: "b" }], programmes), ["b"]);
});

test("un programme sans scholarshipId ne rattache rien", () => {
// Un programme orphelin côté bourse ne doit pas « sauver » une bourse.
assert.deepEqual(boursesSansProgramme([{ id: "a" }], [{ id: "orphelin" }]), ["a"]);
assert.deepEqual(boursesSansProgramme([{ id: "a" }], [{ scholarshipId: "" }]), ["a"]);
});

test("entrées absentes ou vides : jamais d'exception", () => {
assert.deepEqual(boursesSansProgramme(undefined, undefined), []);
assert.deepEqual(boursesSansProgramme([], []), []);
});

// ============================================================
// LINKS.niveaux — une université ne participe pas toujours à tous
// les cycles d'une bourse (2026-09-05)
// ============================================================
//
// Le Global Korea Scholarship publie DEUX listes d'universités
// désignées : celle de la licence (GKS-U) et celle du master et du
// doctorat (GKS-G). SNU, KAIST et POSTECH ne figurent que sur la
// seconde. Sans restriction, un lien créait un programme par niveau
// de la bourse et inventait une licence qui n'existe pas.

test("LINKS sans niveaux : un programme par niveau de la bourse, comme avant", () => {
  const r = validerLot({
    UNIVERSITIES: [{ id: "u1", data: { name: "U", country: "Corée du Sud" } }],
    SCHOLARSHIPS: [{ id: "s1", data: { title: "S", country: "Corée du Sud", levels: ["Licence", "Master", "Doctorat"] } }],
    LINKS: [{ scholarshipId: "s1", pays: "Corée du Sud", universityIds: ["u1"] }]
  });
  assert.deepEqual(r.erreurs, []);
  assert.equal(r.programmes.length, 3);
});

test("LINKS avec niveaux : seuls les cycles déclarés produisent un programme", () => {
  const r = validerLot({
    UNIVERSITIES: [{ id: "u1", data: { name: "U", country: "Corée du Sud" } }],
    SCHOLARSHIPS: [{ id: "s1", data: { title: "S", country: "Corée du Sud", levels: ["Licence", "Master", "Doctorat"] } }],
    LINKS: [{ scholarshipId: "s1", pays: "Corée du Sud", universityIds: ["u1"], niveaux: ["Master", "Doctorat"] }]
  });
  assert.deepEqual(r.erreurs, []);
  assert.equal(r.programmes.length, 2);
  assert.deepEqual(r.programmes.map((p) => p.level).sort(), ["Doctorat", "Master"]);
  assert.ok(!r.programmes.some((p) => p.id.endsWith("__licence")));
});

test("LINKS.niveaux hors vocabulaire : refusé, jamais approximé", () => {
  const r = validerLot({
    UNIVERSITIES: [{ id: "u1", data: { name: "U", country: "Corée du Sud" } }],
    SCHOLARSHIPS: [{ id: "s1", data: { title: "S", country: "Corée du Sud", levels: ["Master"] } }],
    LINKS: [{ scholarshipId: "s1", pays: "Corée du Sud", universityIds: ["u1"], niveaux: ["Postdoctorat"] }]
  });
  assert.ok(r.erreurs.some((e) => /niveau restreint inattendu/.test(e)));
  assert.equal(r.programmes.length, 0);
});

test("LINKS.niveaux qui ne recoupe aucun niveau de la bourse : refusé", () => {
  const r = validerLot({
    UNIVERSITIES: [{ id: "u1", data: { name: "U", country: "Corée du Sud" } }],
    SCHOLARSHIPS: [{ id: "s1", data: { title: "S", country: "Corée du Sud", levels: ["Licence"] } }],
    LINKS: [{ scholarshipId: "s1", pays: "Corée du Sud", universityIds: ["u1"], niveaux: ["Doctorat"] }]
  });
  assert.ok(r.erreurs.some((e) => /ne recoupe aucun niveau/.test(e)));
});

test("LINKS.niveaux vide : refusé — omettre le champ veut dire « tous »", () => {
  const r = validerLot({
    UNIVERSITIES: [{ id: "u1", data: { name: "U", country: "Corée du Sud" } }],
    SCHOLARSHIPS: [{ id: "s1", data: { title: "S", country: "Corée du Sud", levels: ["Master"] } }],
    LINKS: [{ scholarshipId: "s1", pays: "Corée du Sud", universityIds: ["u1"], niveaux: [] }]
  });
  assert.ok(r.erreurs.some((e) => /tableau non vide/.test(e)));
});

test("LINKS.niveaux sur une bourse DÉJÀ EN BASE : la restriction voyage jusqu'à analyser", () => {
  const r = validerLot({
    UNIVERSITIES: [{ id: "u1", data: { name: "U", country: "Corée du Sud" } }],
    LINKS: [{ scholarshipId: "deja-en-base", pays: "Corée du Sud", universityIds: ["u1"], niveaux: ["Master", "Doctorat"] }]
  });
  assert.deepEqual(r.erreurs, []);
  assert.equal(r.liensExternes.length, 1);
  assert.deepEqual(r.liensExternes[0].niveaux, ["Master", "Doctorat"]);
});

// ============================================================
// Garde des dates de lecture et de la preuve (lot 72, 2026-09-22)
// ============================================================

const LE_22 = new Date("2026-09-22T21:00:00Z");

test("dates de lecture 1 — une date en toutes lettres est refusée (le défaut du lot 40)", () => {
const erreurs = validerPatches([patchMinimal({ collection: "scholarships", champs: { verifieLe: "6 novembre 2026" } })], LE_22);
assert.ok(erreurs.some((e) => e.includes("AAAA-MM-JJ")), erreurs.join(" | "));
});

test("dates de lecture 2 — une date de lecture future est refusée, la veille et le jour même passent", () => {
const futur = validerPatches([patchMinimal({ collection: "scholarships", champs: { verifieLe: "2026-11-06" } })], LE_22);
assert.ok(futur.some((e) => e.includes("futur")), futur.join(" | "));
for (const v of ["2026-09-21", "2026-09-22"]) {
assert.deepEqual(validerPatches([patchMinimal({ collection: "programs", champs: { ouverteVerifieeLe: v } })], LE_22), [], v);
}
// Un jour impossible n'est pas une date.
assert.ok(refusDatesDeLecture("x", { verifieLe: "2026-02-30" }, LE_22).length);
});

test("dates de lecture 3 — vider reste permis", () => {
for (const v of ["", null]) {
assert.deepEqual(refusDatesDeLecture("x", { verifieLe: v, sourceVerification: null }, LE_22), [], JSON.stringify(v));
}
});

test("preuve 1 — une sourceVerification sans citation est refusée", () => {
const sv = { url: "https://exemple.test/appel.pdf", citation: "   ", le: "2026-09-22T20:00:00.000Z", parUid: "u" };
const erreurs = validerPatches([patchMinimal({ collection: "programs", champs: { sourceVerification: sv } })], LE_22);
assert.ok(erreurs.some((e) => e.includes("sans citation")), erreurs.join(" | "));
const bonne = { ...sv, citation: "within h. 11:59 pm CEST of Monday 3 August 2026" };
assert.deepEqual(validerPatches([patchMinimal({ collection: "programs", champs: { sourceVerification: bonne } })], LE_22), []);
});

test("preuve 2 — url qui n'est pas une adresse, ou lecture datée du futur : refusées", () => {
const base = { url: "https://exemple.test", citation: "phrase", le: "2026-09-22T20:00:00.000Z", parUid: "u" };
assert.ok(refusDatesDeLecture("x", { sourceVerification: { ...base, url: "voir le site" } }, LE_22).some((e) => e.includes("adresse")));
assert.ok(refusDatesDeLecture("x", { sourceVerification: { ...base, le: "2026-10-30T00:00:00.000Z" } }, LE_22).some((e) => e.includes("futur")));
// La tolérance d'un jour : un lot préparé le soir, exécuté après minuit.
assert.deepEqual(refusDatesDeLecture("x", { sourceVerification: { ...base, le: "2026-09-22T22:30:00.000Z" } }, LE_22), []);
});

test("dates de lecture 4 — la garde vaut aussi pour une bourse créée par un lot", () => {
const lot = { SCHOLARSHIPS: [{ id: "b1", data: { title: "B", country: "Italie", verifieLe: "22/09/2026" } }] };
assert.ok(validerLot(lot, LE_22).erreurs.some((e) => e.includes("AAAA-MM-JJ")));
});
