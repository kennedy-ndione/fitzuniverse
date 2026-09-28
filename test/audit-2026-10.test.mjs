/*
* ============================================================
* Audit 2026-10 — le journal analytics et ses compteurs.
*
* firestore.rules laissait tout visiteur, sans compte, écrire n'importe
* quel événement (au nom de n'importe quel uid) et SUPPRIMER les
* compteurs. Les règles suivent désormais la forme exacte qu'écrit
* js/analytics.js. Ces tests lisent les deux fichiers comme texte ; le
* rejeu réel est dans scripts/rejouer-regles.mjs (section « Audit
* 2026-10 — analytics »).
* ============================================================
*/

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(join(racine, f), "utf8").replace(/\r\n/g, "\n");

const COMPTEURS = ["analyticsCounters", "analyticsDailyCounters", "analyticsPlanCounters", "analyticsCountryCounters", "analyticsUniversityCounters", "analyticsFieldCounters"];

function bloc(regles, chemin) {
const debut = regles.indexOf(`match /${chemin} {`);
assert.ok(debut >= 0, `bloc ${chemin} introuvable`);
return regles.slice(debut, regles.indexOf("\n}", debut) + 2);
}

test("analyticsEvents : la règle accepte exactement les champs qu'écrit trackEvent", () => {
const regles = lire("firestore.rules");
const b = bloc(regles, "analyticsEvents/{eventId}");
const client = lire("js/analytics.js");
const ecriture = client.slice(client.indexOf('addDoc(collection(db, "analyticsEvents"), {'));
const champs = [...ecriture.slice(0, ecriture.indexOf("});")).matchAll(/^\s*(\w+)\s*[:,]/gm)].map((m) => m[1]);
assert.deepEqual(champs, ["type", "uid", "payload", "createdAt", "clientTs"]);
assert.ok(b.includes(`keys().hasOnly(${JSON.stringify(champs).replace(/,/g, ", ")})`), "hasOnly suit le client");
assert.ok(b.includes("(request.resource.data.uid == null || (isSignedIn() && request.resource.data.uid == request.auth.uid))"), "personne ne signe au nom d'un autre");
assert.ok(b.includes("request.resource.data.createdAt == request.time"), "heure du serveur");
assert.ok(ecriture.includes("createdAt: serverTimestamp()"));
assert.ok(ecriture.includes("uid: auth.currentUser ? auth.currentUser.uid : null"));
assert.ok(!/allow create: if true;/.test(b));
});

test("compteurs analytics : on incrémente, on ne supprime jamais", () => {
const regles = lire("firestore.rules");
for (const c of COMPTEURS) {
const b = bloc(regles, `${c}/{document}`);
assert.ok(b.includes("allow create, update: if true;"), c);
assert.ok(b.includes("allow delete: if false;"), c);
assert.ok(!b.includes("allow write"), c);
}
});

test("aucun client ne supprime un compteur ni un événement analytics", () => {
const fichiers = [];
const parcourir = (dossier) => {
for (const e of readdirSync(join(racine, dossier), { withFileTypes: true })) {
if (["node_modules", ".git", "functions", "test", "scripts", "sauvegardes"].includes(e.name)) continue;
const chemin = dossier ? `${dossier}/${e.name}` : e.name;
if (e.isDirectory()) parcourir(chemin);
else if (e.name.endsWith(".js")) fichiers.push(chemin);
}
};
parcourir("");
for (const f of fichiers) {
const s = lire(f);
assert.ok(!/deleteDoc\([^)]*["']analytics/.test(s), `${f} supprime un document analytics`);
}
});
