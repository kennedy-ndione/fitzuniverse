/*
* ============================================================
* Lot 131 — audit des échéances des bourses (audit 2026-10).
*
* Le lot a été préparé dans une session cloud qui ne pouvait ouvrir
* aucune page officielle : il ne doit JAMAIS pouvoir s'écrire avant la
* relecture au navigateur. Tant que RELU_LE vaut "AAAA-MM-JJ",
* validerLot() le refuse (et `analyser` s'arrête avant de lire la base).
* Une fois la date posée — et les citations recopiées pour la
* section B —, il doit passer la même validation que le runner.
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

test("lot 131 : bloqué tant que la relecture n'est pas datée", async (t) => {
if (relu) return t.skip("RELU_LE est rempli : la relecture a eu lieu");
const lot = await import(pathToFileURL(CHEMIN).href);
const { erreurs } = validerLot({ PATCHES: lot.PATCHES });
assert.ok(erreurs.length > 0, "un lot non relu ne doit pas passer la validation");
for (const e of erreurs) assert.match(e, /AAAA-MM-JJ/, e);
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
