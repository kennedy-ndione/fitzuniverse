/**
* LOT 120 (2026-09-26) — le site officiel de Beihang (en.buaa.edu.cn ne
* répond plus ; ev.buaa.edu.cn est le site anglais officiel).
*/
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { PATCHES } from "../scripts/data/lot120-beihang-site.mjs";
import { validerLot } from "../scripts/lot-validate.mjs";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");

test("120 — un seul patch, gardé par l'ancienne valeur, et valide", () => {
assert.deepEqual(validerLot({ PATCHES }, new Date("2026-09-26T12:00:00Z")).erreurs, []);
assert.equal(PATCHES.length, 1);
const [p] = PATCHES;
assert.equal(p.id, "beihang-university-pekin");
assert.deepEqual(p.attendu, { officialWebsite: "https://en.buaa.edu.cn/" });
assert.deepEqual(p.champs, { officialWebsite: "https://ev.buaa.edu.cn/" });
const cat = JSON.parse(readFileSync(join(racine, "assets/data/catalogue.json"), "utf8"));
const u = cat.universities.find((x) => x.id === p.id);
assert.ok(u, "l'université existe dans l'instantané");
assert.ok([p.attendu.officialWebsite, p.champs.officialWebsite].includes(u.officialWebsite), "avant ou après l'export");
});
