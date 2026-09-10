/**
* Lot PEIGNE-FIN (2026-09-10) — aucun lien mort.
*
* Chaque `href` et `src` interne des pages HTML servies pointe vers un
* fichier qui existe ET que Firebase Hosting publie (liste blanche de
* scripts/hosting-publie.mjs : un fichier présent sur le disque mais
* ignoré par hosting.ignore rend 404 en production — c'est arrivé avec
* les .md).
*/
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { listerPublies } from "../scripts/hosting-publie.mjs";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(path.join(RACINE, f), "utf8").replace(/\r\n/g, "\n");

// Les pages HTML servies (même périmètre que test/icones.test.mjs).
function pagesServies() {
const out = [];
const parcourir = (d) => {
for (const e of readdirSync(path.join(RACINE, d), { withFileTypes: true })) {
if (e.isDirectory()) { if (!/^(node_modules|\.git|\.claude|sauvegardes|Claude outputs|design-previews|functions|scripts|test)$/.test(e.name)) parcourir(path.join(d, e.name)); }
else if (e.name.endsWith(".html")) out.push(path.join(d, e.name));
}
};
parcourir(".");
return out;
}

test("liens — chaque href/src interne des pages existe et est publié", () => {
const publies = new Set(listerPublies(RACINE).map((p) => p.replace(/\\/g, "/")));
const morts = [];
for (const f of pagesServies()) {
const html = lire(f).replace(/<!--[\s\S]*?-->/g, "");
const dossier = path.dirname(f).replace(/\\/g, "/");
for (const m of html.matchAll(/\b(?:href|src)="([^"#?]+)(?:[#?][^"]*)?"/g)) {
const cible = m[1];
if (/^(https?:|mailto:|tel:|data:|javascript:|\/\/)/.test(cible) || cible === "" || cible === "/") continue;
const chemin = path.posix.normalize(path.posix.join(dossier, cible)).replace(/^\.\//, "");
if (!existsSync(path.join(RACINE, chemin))) { morts.push(`${f} → ${cible} (absent)`); continue; }
if (!publies.has(chemin)) morts.push(`${f} → ${cible} (non publié par Hosting)`);
}
}
assert.deepEqual(morts, []);
});
