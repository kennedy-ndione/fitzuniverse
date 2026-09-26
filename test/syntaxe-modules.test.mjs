/**
* LA SYNTAXE DES MODULES DU NAVIGATEUR (2026-09-26, après le lot 114)
*
* Le lot 113 a laissé dans details.js un bout de fonction en double,
* APRÈS l'accolade fermante : un `return` au niveau du module. Un
* navigateur refuse ce fichier en entier (« Illegal return statement ») :
* la fiche de CHAQUE bourse (scholarship-details.html) est restée vide en
* production, du déploiement du lot 113 à la correction.
*
* Rien ne l'a vu, pour deux raisons :
*   - `node --check details.js` a répondu « OK » : sans "type": "module"
*     dans package.json, Node essaie d'abord le fichier comme CommonJS,
*     où un `return` au premier niveau est permis ;
*   - aucun test n'importe details.js (il charge le SDK Firebase par URL) :
*     les tests lisaient son TEXTE avec des expressions régulières.
*
* Ce test analyse chaque module du site EXACTEMENT comme un navigateur :
* en module ES (vm.SourceTextModule), sans l'exécuter. Un seul processus
* pour tous les fichiers.
*/
import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");

// Ni les dépendances, ni les fonctions (Node, pas navigateur), ni les
// outils, ni les copies locales.
const EXCLUS = new Set(["node_modules", "functions", "scripts", "test", "sauvegardes", ".git", ".sim", ".claude", ".firebase"]);

function fichiersJs(dossier) {
const sortie = [];
for (const e of readdirSync(dossier, { withFileTypes: true })) {
if (e.isDirectory()) {
if (!EXCLUS.has(e.name)) sortie.push(...fichiersJs(join(dossier, e.name)));
} else if (e.isFile() && e.name.endsWith(".js") && !e.name.endsWith(".min.js")) {
sortie.push(join(dossier, e.name));
}
}
return sortie;
}

const ANALYSE = `
const vm = require("node:vm");
const fs = require("node:fs");
const fichiers = JSON.parse(fs.readFileSync(0, "utf8"));
const modules = [];
const fautes = [];
for (const f of fichiers) {
const source = fs.readFileSync(f, "utf8");
// Seuls les fichiers qui SONT des modules (import/export au premier niveau).
if (!/^\\s*(import|export)\\s/m.test(source)) continue;
modules.push(f);
try { new vm.SourceTextModule(source, { identifier: f }); }
catch (e) { fautes.push(f + " : " + e.name + " : " + e.message); }
}
process.stdout.write(JSON.stringify({ modules: modules.length, fautes }));
`;

test("syntaxe — chaque module du site se lit comme un navigateur le lit (module ES)", () => {
const fichiers = fichiersJs(racine);
const r = spawnSync(process.execPath, ["--experimental-vm-modules", "--no-warnings", "-e", ANALYSE], {
input: JSON.stringify(fichiers),
encoding: "utf8",
maxBuffer: 16 * 1024 * 1024
});
assert.equal(r.status, 0, r.stderr);
const { modules, fautes } = JSON.parse(r.stdout);
assert.ok(modules > 100, `seulement ${modules} modules trouvés : la recherche des fichiers est cassée`);
assert.deepEqual(fautes.map((f) => relative(racine, f.split(" : ")[0]) + " : " + f.split(" : ").slice(1).join(" : ")), [],
"Ces fichiers sont refusés par le navigateur (la page qui les charge reste vide) :");
});

test("syntaxe — le test sait voir la faute du lot 113", () => {
// La forme exacte de la faute : une fonction exportée, puis sa fin recopiée
// après l'accolade fermante.
const fichier = join(mkdtempSync(join(tmpdir(), "syntaxe-")), "details-lot113.js");
writeFileSync(fichier, 'import { x } from "./x.js";\nexport function f(v) {\nreturn v;\n}\nif (x) return 1;\n');
const r = spawnSync(process.execPath, ["--experimental-vm-modules", "--no-warnings", "-e", ANALYSE], {
input: JSON.stringify([fichier]),
encoding: "utf8"
});
const { modules, fautes } = JSON.parse(r.stdout);
assert.equal(modules, 1);
assert.equal(fautes.length, 1);
assert.match(fautes[0], /Illegal return statement/);
});
