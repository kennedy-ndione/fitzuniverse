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
*
* Même audit, functions/ : les identifiants venus du navigateur (tâche
* Fitz, formule achetée) ne lisent plus les propriétés héritées du
* prototype ; une IPN « non completed » ne touche plus un paiement
* appliqué ; l'e-mail de bienvenue part à l'adresse du compte Auth.
* ============================================================
*/

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
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

// ------------------------------------------------------------------
// functions/ — les clés du prototype
// ------------------------------------------------------------------
const require = createRequire(import.meta.url);
const HERITEES = ["constructor", "__proto__", "toString", "hasOwnProperty", "valueOf"];

test("Fitz : une tâche héritée du prototype n'est pas une tâche", () => {
const { tacheConnue } = require(join(racine, "functions/lib/fitz-acces.js"));
const taches = { chat: { poids: 1 }, check: { poids: 7 } };
for (const t of HERITEES) assert.equal(tacheConnue(taches, t), null, t);
assert.equal(tacheConnue(taches, undefined), null);
assert.equal(tacheConnue(taches, ["chat"]), null, "un tableau n'est pas un nom de tâche");
assert.deepEqual(tacheConnue(taches, "chat"), { poids: 1 });
});

test("Fitz : des points illisibles ne se réservent jamais, et ne passent pas le plafond du site", () => {
const { pointsValides, verdictSysteme } = require(join(racine, "functions/lib/fitz-acces.js"));
for (const p of [NaN, undefined, null, 0, -1, 1.5, Infinity, "4"]) assert.equal(pointsValides(p), false, String(p));
for (const p of [1, 4, 7, 23]) assert.equal(pointsValides(p), true, String(p));
const jour = "2026-10-01";
assert.equal(verdictSysteme({ systeme: { jour, pointsJour: 199 }, jourCourant: jour, points: NaN }).ok, false);
assert.equal(verdictSysteme({ systeme: {}, jourCourant: jour, points: NaN }).ok, false);
assert.equal(verdictSysteme({ systeme: {}, jourCourant: jour, points: 1 }).ok, true, "un appel normal passe");
});

test("Fitz : fitz.js lit la tâche par tacheConnue et refuse les points invalides avant toute transaction", () => {
const fitz = lire("functions/fitz.js");
assert.ok(fitz.includes("const config = tacheConnue(TACHES, task);"));
assert.ok(!/TACHES\[task\]/.test(fitz), "plus de lecture directe TACHES[task]");
const reserver = fitz.slice(fitz.indexOf("async function reserverPoints("));
assert.ok(reserver.indexOf("if (!pointsValides(points))") < reserver.indexOf("runTransaction"));
});

test("Achat : une formule héritée du prototype n'est pas en vente, n'a ni offre ni rang", () => {
const { estEnVente, offreDe, calculerMiseAJour, refusAchat, libelleOffre } = require(join(racine, "functions/lib/achat.js"));
for (const t of HERITEES) {
assert.equal(estEnVente(t), false, t);
assert.equal(offreDe(t), undefined, t);
assert.equal(calculerMiseAJour({ planId: t, user: {}, supprimer: null }).statut, "formule-inconnue", t);
assert.equal(libelleOffre(t, "france"), "", t);
}
assert.equal(estEnVente("essentiel-4"), true, "une vraie formule reste en vente");
assert.equal(typeof refusAchat, "function");
const paiement = lire("functions/paiement.js");
assert.ok(!/GRILLE\[(planId|p\.planId)\]/.test(paiement), "paiement.js passe par offreDe");
});

test("IPN non completed : jamais par-dessus « paye », jamais pour une facture inconnue", () => {
const paiement = lire("functions/paiement.js");
const bloc = paiement.slice(paiement.indexOf('if (data.status !== "completed") {'));
const fin = bloc.indexOf('res.status(200).send("OK");');
const corps = bloc.slice(0, fin);
assert.ok(corps.includes("runTransaction"));
assert.ok(corps.includes("if (!snap.exists) return;"));
assert.ok(corps.includes('...(snap.data().statut === "paye" ? {} : { statut: statutIpn })'));
assert.ok(!corps.includes("{ merge: true }"), "plus de set(merge) aveugle");
});

test("E-mail de bienvenue : l'adresse du compte Auth, jamais celle du seul profil", () => {
const emails = lire("functions/emails.js");
const bloc = emails.slice(emails.indexOf("exports.emailBienvenue"), emails.indexOf("exports.envoyerAlerteBourse"));
assert.ok(bloc.includes("await admin.auth().getUser(uid)"));
assert.ok(bloc.includes("aEmail: emailCompte,"));
assert.ok(!bloc.includes("aEmail: u.email"));
assert.ok(bloc.indexOf("getUser(uid)") < bloc.indexOf("emailsEnvoyes/bienvenue-"), "contrôle avant le verrou d'idempotence");
});

// ------------------------------------------------------------------
// Le rapport d'audit décrit des failles non corrigées : il ne part JAMAIS
// en ligne (firebase.json publie la racine par défaut).
// ------------------------------------------------------------------
test("le rapport AUDIT-2026-10.md n'est pas publié par Firebase Hosting", async () => {
const { lireMotifs, listerPublies, motifVersRegex } = await import("../scripts/hosting-publie.mjs");
assert.ok(lireMotifs().includes("AUDIT-*.md"));
assert.ok(motifVersRegex("AUDIT-*.md").test("AUDIT-2026-10.md"));
const publies = listerPublies();
assert.ok(!publies.some((f) => /^AUDIT-/.test(f)), "un rapport d'audit serait servi en ligne");
});

// ------------------------------------------------------------------
// Harnais (audit 2026-10) : « Fitz a besoin de le niveau visé » sur le hub
// ------------------------------------------------------------------
test("hub : la phrase des champs manquants reste française pour toute combinaison", async () => {
const { CHAMPS_PROFIL_REQUIS } = await import("../js/fitz-choisit.js");
const tableau = lire("dashboard.js");
const m = tableau.match(/\? `Avant de choisir, ([^$]*)\$\{listeFrancaise\(manquants\)\}\./);
assert.ok(m, "la phrase du hub compose toujours la liste des manquants");
assert.equal(m[1], "il manque encore à Fitz ");
// La liste telle que listeFrancaise() la compose (dashboard.js).
const liste = (l) => (l.length <= 1 ? l[0] || "" : `${l.slice(0, -1).join(", ")} et ${l[l.length - 1]}`);
const libelles = CHAMPS_PROFIL_REQUIS.map((c) => c.libelle);
for (let masque = 1; masque < 1 << libelles.length; masque++) {
const choisis = libelles.filter((_, i) => masque & (1 << i));
const phrase = `Avant de choisir, ${m[1]}${liste(choisis)}.`;
assert.doesNotMatch(phrase, /\bde (le|les|au|aux)\b|\bde [aeiouéè]/i, phrase);
}
});
