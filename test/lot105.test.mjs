/**
* LOT 105 — LES UNIVERSITÉS AJOUTÉES REÇOIVENT LEURS BOURSES (2026-09-25)
*
* Charles : rattacher les universités de la préinscription à des bourses,
* pour le diagnostic gratuit et l'accompagnement bourse. Un lien n'existe
* que s'il est prouvé sur une source officielle, posée sur le programme.
*/
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import * as lot from "../scripts/data/lot105-liens-bourses.mjs";
import { validerLot, CHAMPS_PROGRAMME_LIEN } from "../scripts/lot-validate.mjs";
import { langueCompatible } from "../js/recommend-programs.js";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(join(racine, f), "utf8").replace(/\r\n/g, "\n");
const JOUR = new Date("2026-09-25T22:00:00Z");

test("lot 105 — le lot passe la validation, et chaque lien porte sa preuve officielle", () => {
const v = validerLot(lot, JOUR);
assert.deepEqual(v.erreurs, []);
assert.equal(lot.UNIVERSITIES.length + lot.SCHOLARSHIPS.length + lot.SUPPRESSIONS.length, 0, "le lot ne crée que des programmes");
for (const l of lot.LINKS) {
const ou = `${l.scholarshipId} → ${l.universityIds.join(", ")}`;
const sv = l.champs && l.champs.sourceVerification;
assert.ok(sv, `${ou} : sans preuve`);
assert.match(sv.url, /^https:\/\//, ou);
assert.ok(sv.citation.trim().length > 20, ou);
assert.equal(sv.parUid, "IlXJmAScj2U5ucV2ctUgeJjadNd2", ou);
assert.ok(l.champs.deadline && l.champs.ouverteVerifieeLe, `${ou} : calendrier absent`);
assert.ok(!/@/.test(JSON.stringify(sv)), `${ou} : une adresse e-mail dans un document public`);
}
});

test("lot 105 — les liens prouvés, pays par pays", () => {
const unis = (bourse) => new Set(lot.LINKS.filter((l) => l.scholarshipId === bourse).flatMap((l) => l.universityIds));
assert.equal(unis("turkiye-burslari").size, 15);
assert.equal(unis("romanian-government-scholarship").size, 12);
assert.equal(unis("malaysia-international-scholarship").size, 9);
assert.equal(unis("deutschlandstipendium").size, 17);
for (const b of ["daad-study-scholarships", "friedrich-ebert-stiftung", "konrad-adenauer-stiftung", "heinrich-boell-stiftung", "rosa-luxemburg-stiftung"]) {
assert.equal(unis(b).size, 19, b);
}
// Izmir : pas de doctorat dans la recherche officielle Türkiye Bursları.
const iyte = lot.LINKS.filter((l) => l.universityIds.includes("izmir-institute-of-technology-urla")).flatMap((l) => l.niveaux);
assert.deepEqual(iyte.sort(), ["Licence", "Master"]);
});

test("lot 105 — ce qui n'est pas prouvé n'est pas relié", () => {
const lies = (bourse) => new Set(lot.LINKS.filter((l) => l.scholarshipId === bourse).flatMap((l) => l.universityIds));
assert.ok(!lies("turkiye-burslari").has("ozyegin-university-istanbul"));
for (const umf of ["umf-carol-davila-bucarest", "umf-craiova", "umf-grigore-t-popa-iasi", "umf-iuliu-hatieganu-cluj-napoca", "umf-victor-babes-timisoara", "umfst-george-emil-palade-targu-mures"]) {
assert.ok(!lies("romanian-government-scholarship").has(umf), `${umf} : la bourse exclut la médecine et la pharmacie`);
}
assert.ok(!lies("deutschlandstipendium").has("technische-universitat-munchen-munich"));
assert.ok(!lies("deutschlandstipendium").has("universitat-leipzig-leipzig"));
for (const privee of ["asia-pacific-university-kuala-lumpur", "inti-international-university-nilai", "segi-university-kota-damansara", "sunway-university-bandar-sunway", "taylors-university-subang-jaya", "ucsi-university-kuala-lumpur"]) {
assert.ok(!lies("malaysia-international-scholarship").has(privee), privee);
}
assert.ok(!lot.LINKS.some((l) => l.pays === "Maroc" || l.pays === "Canada"));
// La Roumanie dit l'exclusion sur chaque programme.
for (const l of lot.LINKS.filter((x) => x.pays === "Roumanie")) {
assert.match(l.champs.description, /exclut la médecine, la médecine dentaire et la pharmacie/);
}
});

test("lot 105 — les fondations allemandes exigent l'allemand B2, même pour un cursus en anglais", () => {
const fondations = ["friedrich-ebert-stiftung", "konrad-adenauer-stiftung", "heinrich-boell-stiftung", "rosa-luxemburg-stiftung"];
for (const l of lot.LINKS.filter((x) => fondations.includes(x.scholarshipId))) {
assert.ok(!/anglais/i.test(l.language), `${l.scholarshipId} : « anglais » laisserait passer un étudiant sans allemand`);
assert.equal(langueCompatible({ language: l.language }, { languages: [{ code: "fr", level: "C1" }, { code: "en", level: "B2" }] }), false);
}
assert.equal(lot.PATCHES.length, 30, "les 30 programmes de fondations déjà en base reçoivent le même libellé");
for (const p of lot.PATCHES) {
assert.equal(p.collection, "programs");
assert.match(p.attendu.language, /Anglais selon le cursus/);
assert.ok(!/anglais/i.test(p.champs.language));
}
});

test("lot 105 — une année préparatoire de langue n'écarte pas celui qui ne parle pas encore la langue", () => {
const francophone = { languages: [{ code: "fr", level: "C1" }] };
assert.equal(langueCompatible({ language: "Roumain uniquement, après une année préparatoire de roumain si vous ne le parlez pas" }, francophone), true);
assert.equal(langueCompatible({ language: "Arabe (année préparatoire obligatoire pour non-arabophones)" }, francophone), true);
assert.equal(langueCompatible({ language: "Japonais (JLPT N3 exigé à la candidature)" }, francophone), false);
assert.equal(langueCompatible({ language: "Anglais" }, francophone), false);
});

test("lot 105 — un lien peut poser les champs d'un programme, dans une liste fermée et sous les gardes", () => {
assert.deepEqual(CHAMPS_PROGRAMME_LIEN, ["status", "isActive", "deadline", "deadlineISO", "ouverteVerifieeLe", "sourceVerification", "coverage", "description", "duration"]);
const base = { scholarshipId: "x", pays: "Turquie", universityIds: ["ankara-university-ankara"] };
const erreurs = (champs) => validerLot({ LINKS: [{ ...base, champs }] }, JOUR).erreurs;
assert.deepEqual(erreurs({ status: "Ouverte" }), []);
assert.match(erreurs({ applicationUrl: "https://a.b" }).join(), /non permis/);
assert.match(erreurs({ ouverteVerifieeLe: "2027-01-01" }).join(), /dans le futur/);
assert.match(erreurs({ sourceVerification: { url: "https://a.b", citation: "", le: "2026-09-25T00:00:00Z", parUid: "u" } }).join(), /sans citation/);
assert.match(erreurs({}).join(), /objet non vide/);
// Le runner les écrit sur chaque programme créé.
assert.match(lire("scripts/lot.mjs"), /level: niveau,\n\/\/ Champs vérifiés par université \(lot 105\) : preuve, statut, calendrier\.\n\.\.\.\(lien\.champs \|\| \{\}\)/);
});
