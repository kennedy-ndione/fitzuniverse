/**
* « En ligne » et MESSAGE GROUPÉ (2026-09-23, demande de Charles).
*
* 1. La présence : un battement de 45 s, en ligne sous 2 minutes, et
*    jamais « en ligne » pour toujours (horloge en avance, document
*    marqué hors ligne à la déconnexion).
* 2. Les règles : presence/{uid} ne s'écrit que par son propriétaire,
*    avec l'heure du serveur, et ne se lit que par lui et l'admin.
* 3. Le message groupé : les bons destinataires par groupe, jamais un
*    compte suspendu, et un {prénom} qui ne laisse jamais de trace.
*/

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { BATTEMENT_MS, SEUIL_EN_LIGNE_MS, etatPresence, libelleDerniereVisite, enMillis } from "../js/presence-etat.js";
import { SEGMENTS, MODELES, destinataires, correspond, personnaliser, prenom, estGratuit, diagnosticFait } from "../js/destinataires.js";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(join(racine, f), "utf8");

const MAINTENANT = Date.UTC(2026, 8, 23, 14, 0, 0);

// ------------------------------------------------------------------
// 1. La présence
// ------------------------------------------------------------------

test("présence 1 — un battement bien plus court que le seuil : on ne clignote pas entre deux battements", () => {
assert.equal(BATTEMENT_MS, 45_000);
assert.equal(SEUIL_EN_LIGNE_MS, 120_000);
assert.ok(SEUIL_EN_LIGNE_MS >= 2 * BATTEMENT_MS, "deux battements manqués avant de passer hors ligne");
});

test("présence 2 — en ligne sous deux minutes, « Vu il y a… » au-delà", () => {
assert.deepEqual(etatPresence({ enLigne: true, vuLe: MAINTENANT - 30_000 }, MAINTENANT), { enLigne: true, libelle: "En ligne", vuLe: MAINTENANT - 30_000 });
assert.equal(etatPresence({ enLigne: true, vuLe: MAINTENANT - 119_000 }, MAINTENANT).enLigne, true);
const passe = etatPresence({ enLigne: true, vuLe: MAINTENANT - 5 * 60_000 }, MAINTENANT);
assert.equal(passe.enLigne, false);
assert.equal(passe.libelle, "Vu il y a 5 min");
assert.equal(libelleDerniereVisite(MAINTENANT - 3 * 3_600_000, MAINTENANT), "Vu il y a 3 h");
assert.match(libelleDerniereVisite(MAINTENANT - 3 * 86_400_000, MAINTENANT), /^Vu le 20 sept\.$/);
});

test("présence 3 — la déconnexion volontaire compte tout de suite, et une horloge en avance ne rend pas éternel", () => {
assert.equal(etatPresence({ enLigne: false, vuLe: MAINTENANT - 1_000 }, MAINTENANT).enLigne, false);
assert.equal(etatPresence({ enLigne: false, vuLe: MAINTENANT - 1_000 }, MAINTENANT).libelle, "Vu à l'instant");
// vuLe dans le futur (horloge d'appareil en avance) : en ligne, mais
// l'âge est ramené à zéro — pas un statut figé pour toujours.
assert.equal(etatPresence({ enLigne: true, vuLe: MAINTENANT + 60_000 }, MAINTENANT + 60_000 + SEUIL_EN_LIGNE_MS).enLigne, false);
assert.deepEqual(etatPresence(null, MAINTENANT), { enLigne: false, libelle: "Pas encore vu", vuLe: 0 });
assert.equal(enMillis({ toMillis: () => 42 }), 42);
assert.equal(enMillis("n'importe quoi"), 0);
});

test("présence 4 — l'espace étudiant démarre la présence depuis les DEUX coquilles, et la pastille dit « En ligne »", () => {
for (const f of ["js/app-shell.js", "js/dual-shell.js"]) {
const js = lire(f);
assert.match(js, /import \{ demarrerPresence \} from "\.\/presence\.js";/, f);
assert.match(js, /demarrerPresence\(session\.user\.uid\);/, f);
}
const p = lire("js/presence.js");
assert.match(p, />En ligne</);
assert.match(p, /"Hors ligne"/);
assert.match(p, /setDoc\(reference, \{ enLigne, vuLe: serverTimestamp\(\) \}\)/, "deux clés, heure du serveur");
assert.ok(!/pagehide|beforeunload/.test(p.replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "")), "on n'écrit pas « hors ligne » en changeant de page");
assert.match(lire("css/journey-shell.css"), /\.presence-pill\{/);
});

// ------------------------------------------------------------------
// 2. Les règles
// ------------------------------------------------------------------

test("présence 5 — firestore.rules : le propriétaire écrit, avec l'heure du serveur ; lui et l'admin lisent", () => {
const regles = lire("firestore.rules").replace(/\r\n/g, "\n");
const i = regles.indexOf("match /presence/{uid} {");
assert.ok(i > 0, "bloc presence absent");
const bloc = regles.slice(i, regles.indexOf("\n}", i));
assert.match(bloc, /allow read: if isOwner\(uid\) \|\| isAdmin\(\);/);
assert.match(bloc, /allow create, update: if isOwner\(uid\) &&/);
assert.match(bloc, /keys\(\)\.hasOnly\(\["enLigne", "vuLe"\]\)/);
assert.match(bloc, /request\.resource\.data\.vuLe == request\.time/);
assert.match(bloc, /allow delete: if isOwner\(uid\);/);
// Et la suppression de compte l'emporte.
assert.match(lire("js/account-actions.js"), /deleteDoc\(doc\(db, "presence", uid\)\)/);
// La page de confidentialité le dit.
assert.match(lire("confidentialite.html"), /dernière activité dans votre espace/);
});

test("présence 6 — le Control Center voit qui est en ligne : liste des étudiants et messagerie", () => {
const etudiants = lire("admin/students.js");
assert.match(etudiants, /ecouterPresence\(/);
assert.match(etudiants, /pastillePresence\(etatDe\(user\.uid\)\)/);
assert.match(lire("admin/students.html"), /<option value="online">En ligne maintenant<\/option>/);
assert.match(lire("admin/students.html"), /<th>Présence<\/th>/);
const messages = lire("admin/messages.js");
assert.match(messages, /ecouterPresence\(/);
assert.match(messages, /avatar\.classList\.add\("is-en-ligne"\)/);
assert.match(lire("admin/presence-admin.js"), /setInterval\(emettre, 30_000\)/, "le réveil de 30 s fait vieillir les statuts");
});

// ------------------------------------------------------------------
// 3. Le message groupé
// ------------------------------------------------------------------

const AWA = { uid: "awa", name: "Awa Diop", profile: { firstName: "Awa" } };
const MOUSSA = { uid: "moussa", email: "moussa@exemple.sn", plan: "essentiel-4", diagnostic: { niveau: "licence" } };
const SUSPENDU = { uid: "z", name: "Zeyna Fall", disabled: true };
const TOUS = [MOUSSA, AWA, SUSPENDU];

test("groupe 1 — chaque groupe choisit les bons étudiants, et jamais un compte suspendu", () => {
const ids = (seg, opts) => destinataires(TOUS, seg, opts).map((u) => u.uid);
assert.deepEqual(ids("tous"), ["awa", "moussa"], "trié par nom, sans le suspendu");
assert.deepEqual(ids("profil-incomplet"), ["awa", "moussa"]);
assert.deepEqual(ids("sans-diagnostic"), ["awa"]);
assert.deepEqual(ids("gratuits"), ["awa"]);
assert.deepEqual(ids("payants"), ["moussa"]);
assert.deepEqual(ids("en-ligne", { enLigne: (uid) => uid === "moussa" }), ["moussa"]);
assert.equal(correspond(SUSPENDU, "tous"), false);
assert.equal(correspond(AWA, "inconnu"), false);
assert.equal(estGratuit(AWA), true);
assert.equal(diagnosticFait(MOUSSA), true);
assert.ok(SEGMENTS.every((s) => s.id && s.libelle));
});

test("groupe 2 — {prénom} devient le prénom, et disparaît proprement quand on ne le connaît pas", () => {
assert.equal(personnaliser("Bonjour {prénom}, pensez à votre profil.", AWA), "Bonjour Awa, pensez à votre profil.");
assert.equal(personnaliser("Bonjour {prenom}, pensez à votre profil.", AWA), "Bonjour Awa, pensez à votre profil.");
assert.equal(personnaliser("Bonjour {prénom}, pensez à votre profil.", MOUSSA), "Bonjour, pensez à votre profil.");
assert.equal(prenom({ name: "Fatou Ndiaye" }), "Fatou");
for (const m of MODELES) {
assert.match(m.texte, /^Bonjour \{prénom\},/, m.id);
assert.ok(!/undefined|\{/.test(personnaliser(m.texte, MOUSSA)), `${m.id} : aucune trace de marque`);
}
});

test("groupe 3 — l'admin envoie en deux clics, par lots, avec la forme d'un message individuel", () => {
const js = lire("admin/messages.js");
assert.match(js, /if \(!confirmationArmee\) \{/, "le premier clic arme, le second envoie");
assert.match(js, /i \+= 400/, "lots de 400 (limite writeBatch : 500)");
assert.match(js, /fromAdminUid: currentAdmin\.uid,\s*fromAdminEmail: currentAdmin\.email,\s*text: personnaliser\(texte, user\),\s*createdAt: serverTimestamp\(\),\s*read: false/);
assert.match(js, /trackEvent\("admin_message_groupe"/);
assert.match(lire("js/analytics.js"), /admin_message_groupe: \{ counters:/);
const html = lire("admin/messages.html");
for (const id of ["groupeOpenBtn", "groupeView", "groupeSegment", "groupeTexte", "groupeEnvoyer"]) assert.match(html, new RegExp(`id="${id}"`), id);
});
