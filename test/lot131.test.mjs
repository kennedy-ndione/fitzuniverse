/*
* ============================================================
* Lot 131 — audit des échéances des bourses (audit 2026-10).
*
* Le lot a été préparé dans une session cloud qui ne pouvait ouvrir
* aucune page officielle. Seul ce que Charles a vérifié au navigateur le
* 2026-09-28 (Chevening, Commonwealth Master's et PhD) est dans PATCHES ;
* le reste attend sa relecture en PATCHES_CONDITIONNELS. Le lot passe la
* même validation que le runner, section B comprise une fois les
* citations recopiées.
* ============================================================
*/

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

import { validerLot, validerPatches } from "../scripts/lot-validate.mjs";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const CHEMIN = join(racine, "scripts/data/lot131-audit-echeances.mjs");
const source = readFileSync(CHEMIN, "utf8");
const GABARIT = 'const RELU_LE = "AAAA-MM-JJ";';
const relu = !source.includes(GABARIT);

// Une copie du lot avec la date et les citations remplies, dans un
// dossier temporaire : ce que Charles obtiendra après sa relecture.
async function lotRempli() {
const dossier = mkdtempSync(join(tmpdir(), "lot131-"));
try {
const texte = source
.replace(GABARIT, 'const RELU_LE = "2026-09-28";')
.replace('const A_RELEVER = "";', 'const A_RELEVER = "phrase relue sur la page";');
const copie = join(dossier, "lot131.mjs");
writeFileSync(copie, texte);
return await import(pathToFileURL(copie).href);
} finally {
rmSync(dossier, { recursive: true, force: true });
}
}

// Ce que Charles a vérifié au navigateur le 2026-09-28, et rien d'autre.
const VERIFIE = {
scholarships: ["chevening-scholarships", "commonwealth-masters-scholarships", "commonwealth-phd-scholarships"],
programs: [
"imperial-college-london-london__chevening-scholarships",
"university-of-edinburgh-edinburgh__chevening-scholarships",
"university-of-oxford-oxford__chevening-scholarships",
"imperial-college-london-london__commonwealth-masters-scholarships__master",
"university-of-edinburgh-edinburgh__commonwealth-masters-scholarships__master",
"university-of-oxford-oxford__commonwealth-masters-scholarships__master",
"imperial-college-london-london__commonwealth-phd-scholarships__doctorat",
"university-of-edinburgh-edinburgh__commonwealth-phd-scholarships__doctorat",
"university-of-oxford-oxford__commonwealth-phd-scholarships__doctorat"
]
};

test("lot 131 : PATCHES ne porte que ce que Charles a vérifié au navigateur (Chevening, Commonwealth Master's et PhD)", async () => {
const lot = await import(pathToFileURL(CHEMIN).href);
assert.ok(relu, "la relecture est datée");
assert.match(source, /const RELU_LE = "2026-09-28";/);
const ecrits = lot.PATCHES.map((p) => `${p.collection}/${p.id}`).sort();
const attendus = [...VERIFIE.scholarships.map((id) => `scholarships/${id}`), ...VERIFIE.programs.map((id) => `programs/${id}`)].sort();
assert.deepEqual(ecrits, attendus);
// Les programmes passent de « Fermée » à « Ouverte », et rien d'autre ne
// change sur eux ; les bourses gardent la date de relecture.
for (const p of lot.PATCHES.filter((x) => x.collection === "programs")) {
assert.deepEqual(p.attendu, { status: "Fermée" }, p.id);
assert.deepEqual(p.champs, { status: "Ouverte" }, p.id);
}
for (const p of lot.PATCHES.filter((x) => x.collection === "scholarships")) assert.equal(p.champs.verifieLe, "2026-09-28", p.id);
// Chaque motif cite la page officielle et la date confirmée.
for (const p of lot.PATCHES) {
if (p.id.includes("chevening")) assert.ok(p.motif.includes("https://www.chevening.org/scholarships/application-timeline/") && p.motif.includes("6 octobre 2026 à 11:00 UTC"), p.id);
if (p.id.includes("commonwealth-masters")) assert.ok(p.motif.includes("https://cscuk.fcdo.gov.uk/scholarships/commonwealth-masters-scholarships/") && p.motif.includes("20 octobre 2026 à 16:00 BST"), p.id);
if (p.id.includes("commonwealth-phd")) assert.ok(p.motif.includes("https://cscuk.fcdo.gov.uk/scholarships/commonwealth-phd-scholarships/") && p.motif.includes("20 octobre 2026 à 16:00 BST"), p.id);
}
assert.deepEqual(validerLot({ PATCHES: lot.PATCHES }).erreurs, []);
});

test("lot 131 : ce qui n'a pas été relu (Fribourg, ETH, UCT, section B) reste hors de PATCHES", async () => {
const lot = await import(pathToFileURL(CHEMIN).href);
const ids = new Set(lot.PATCHES.map((p) => p.id));
for (const id of ["universite-de-fribourg-fribourg__unifr-research-scholarships__doctorat", "eth-zurich-zurich__eth-esop", "university-of-cape-town-le-cap__mastercard-foundation-scholars-uct", "honjo-international-scholarship", "uni-hamburg-leistungsstipendien", "nl-scholarship"]) {
assert.ok(!ids.has(id), `${id} n'a pas été relu`);
assert.ok(lot.PATCHES_CONDITIONNELS.some((p) => p.id === id), `${id} reste proposé en section conditionnelle`);
}
});

test("lot 131 : la section B reste bloquée tant que la citation officielle n'est pas recopiée", async () => {
const lot = await import(pathToFileURL(CHEMIN).href);
const avecCitation = lot.PATCHES_CONDITIONNELS.filter((p) => p.champs && "sourceVerification" in p.champs);
assert.ok(avecCitation.length > 0);
if (!source.includes('const A_RELEVER = "";')) return;
const erreurs = validerPatches(avecCitation);
assert.ok(erreurs.some((e) => /sans citation/.test(e)));
});

test("lot 131 : une fois relu, PATCHES et section B passent la validation du runner, ensemble", async () => {
const lot = await lotRempli();
assert.deepEqual(validerLot({ PATCHES: lot.PATCHES }).erreurs, []);
// Déplacer n'importe quel bloc de B dans PATCHES ne crée pas de doublon.
assert.deepEqual(validerPatches([...lot.PATCHES, ...lot.PATCHES_CONDITIONNELS]), []);
});

test("lot 131 : aucun portail, voix d'entreprise, vouvoiement", async () => {
const lot = await import(pathToFileURL(CHEMIN).href);
for (const p of [...lot.PATCHES, ...lot.PATCHES_CONDITIONNELS]) {
assert.ok(!("applicationUrl" in p.champs) && !("applicationPortalUrl" in p.champs), p.id);
for (const v of Object.values(p.champs)) {
if (typeof v !== "string") continue;
assert.doesNotMatch(v, /(^|[\s«(])(je|j'|me|m'|mon|ma|mes)\s/i, `${p.id} : voix d'entreprise`);
assert.doesNotMatch(v, /\b(tu|ton|ta|tes|toi)\b/i, `${p.id} : vouvoiement`);
}
}
});

test("lot 131 : le patch UCT attend la décision de Charles (section B)", async () => {
const lot = await import(pathToFileURL(CHEMIN).href);
const uct = "university-of-cape-town-le-cap__mastercard-foundation-scholars-uct";
assert.ok(!lot.PATCHES.some((p) => p.id === uct), "hors de PATCHES : il ferait rougir test/lot114 après l'export");
assert.ok(lot.PATCHES_CONDITIONNELS.some((p) => p.id === uct));
});
