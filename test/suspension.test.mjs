/*
 * ============================================================
 * Audit 2026-10 — la suspension vit HORS du profil.
 *
 * suspensions/{uid}, que seul un administrateur écrit (firestore.rules),
 * fait foi même si l'étudiant supprime ou recrée son profil :
 *   - règles : le suspendu n'écrit plus à l'équipe et ne recrée pas son
 *     profil (preuve réelle : scripts/rejouer-regles.mjs, « suspension
 *     hors du profil ») ;
 *   - fonctions : Fitz, le paiement, les portails et les alertes lisent
 *     la suspension (functions/lib/suspension.js) — ici le VRAI code,
 *     hors ligne (test/_doublures-functions.cjs) ;
 *   - client : access-guard renvoie vers suspended.html le suspendu dont
 *     le profil ne peut plus être recréé ; l'admin écrit les deux
 *     documents dans un même lot.
 * ============================================================
 */

import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(join(racine, f), "utf8").replace(/\r\n/g, "\n");

const H = require("./_doublures-functions.cjs");
const { estSuspendu, uidsSuspendus } = H.charger("lib/suspension.js");
const { fitzGenerate } = H.charger("fitz.js");
const { creerPaiement } = H.charger("paiement.js");
const { portails } = H.charger("portails.js");

const session = (uid) => ({ uid, token: { firebase: { sign_in_provider: "password" }, email: `${uid}@exemple.test` } });
const lettre = { task: "letter", system: "Consigne", user: "Ma lettre" };

// Un client Conseiller dont le profil NE PORTE PAS « disabled » — le cas
// de l'étudiant qui a supprimé puis recréé son profil —, suspendu dans
// suspensions/{uid}.
function suspendu(uid, champsProfil = { plan: "conseiller-6", email: `${uid}@exemple.test` }) {
if (champsProfil) H.store.set(`users/${uid}`, champsProfil);
H.store.set(`suspensions/${uid}`, { suspendu: true, par: "admin-1", le: "2026-10-01T10:00:00.000Z" });
}

async function refus(promesse) {
try { await promesse; } catch (e) { return e; }
return null;
}

beforeEach(() => {
H.remettreAZero();
H.repondre(async (url) => H.json(url.includes("/checkout-invoice/create") ? { response_code: "00", token: "tok_1", response_text: "https://paydunya.test/x" } : {}));
});

test("estSuspendu : le document hors profil fait foi, « disabled » reste lu, une suspension levée ne compte plus", async () => {
const db = { doc: (p) => ({ get: async () => { const d = H.store.get(p); return { exists: d !== undefined, data: () => d }; } }) };
H.store.set("suspensions/a", { suspendu: true });
H.store.set("suspensions/b", { suspendu: false });
assert.equal(await estSuspendu(db, "a", { plan: "conseiller-6" }), true, "hors profil");
assert.equal(await estSuspendu(db, "a", undefined), true, "profil supprimé");
assert.equal(await estSuspendu(db, "b", {}), false, "levée");
assert.equal(await estSuspendu(db, "c", { disabled: true }), true, "ancienne suspension (profil)");
assert.equal(await estSuspendu(db, "c", {}), false);
});

test("uidsSuspendus : une requête, les seuls suspendus en cours", async () => {
H.store.set("suspensions/a", { suspendu: true });
H.store.set("suspensions/b", { suspendu: false });
H.store.set("suspensions/c", { suspendu: true });
const { firestore } = require("firebase-admin");
assert.deepEqual([...(await uidsSuspendus(firestore()))].sort(), ["a", "c"]);
});

test("Fitz : un client payant suspendu hors profil est refusé, même profil recréé sans « disabled »", async () => {
suspendu("awa");
const e = await refus(fitzGenerate({ auth: session("awa"), data: lettre, acceptsStreaming: false }, { sendChunk() {} }));
assert.ok(e, "l'appel devait être refusé");
assert.equal(e.code, "permission-denied");
assert.equal(e.details.fitzCode, "AUTH");
assert.equal(H.appelsModele.length, 0, "aucun appel au modèle");
});

test("Fitz : suspension levée → le client est de nouveau servi", async () => {
suspendu("binta");
H.store.set("suspensions/binta", { suspendu: false, par: "admin-1", le: "2026-10-02T10:00:00.000Z" });
const r = await fitzGenerate({ auth: session("binta"), data: lettre, acceptsStreaming: false }, { sendChunk() {} });
assert.ok(r.text);
});

test("Paiement : un compte suspendu hors profil ne peut pas ouvrir de facture", async () => {
suspendu("coumba", { email: "coumba@exemple.test" });
const e = await refus(creerPaiement({ auth: session("coumba"), data: { planId: "essentiel-4" } }));
assert.ok(e);
assert.equal(e.code, "permission-denied");
assert.ok(!H.appelsFetch.some((a) => a.url.includes("/checkout-invoice/create")), "aucune facture chez PayDunya");
});

test("Portails : un client payant suspendu n'obtient pas les portails ; non suspendu, si", async () => {
suspendu("dieynaba");
const e = await refus(portails({ auth: session("dieynaba"), data: {} }));
assert.ok(e);
assert.equal(e.code, "permission-denied");
H.store.set("users/fatou", { plan: "conseiller-6", email: "fatou@exemple.test" });
const ok = await portails({ auth: session("fatou"), data: {} });
assert.ok(ok && typeof ok.universites === "object");
});

test("Alertes : les suspendus hors profil sont écartés des envois", () => {
const emails = lire("functions/emails.js");
const bloc = emails.slice(emails.indexOf("exports.envoyerAlerteBourse"), emails.indexOf("exports.desabonnementAlertes"));
assert.ok(bloc.includes("const suspendus = await uidsSuspendus(admin.firestore());"));
assert.match(bloc, /\.filter\(\(u\) => u\.email && !dejaServis\.has\(u\.uid\) && u\.disabled !== true && !suspendus\.has\(u\.uid\)\)/);
});

test("Client : le suspendu dont le profil ne peut plus être recréé est renvoyé vers suspended.html", () => {
const garde = lire("js/access-guard.js");
const bloc = garde.slice(garde.indexOf("// Auto-guérison"), garde.indexOf("const userData = "));
assert.ok(bloc.includes('getDoc(doc(db, "suspensions", firebaseUser.uid))'));
assert.ok(bloc.includes("suspenduHorsProfil = true;"));
assert.ok(bloc.includes("throw erreur;"), "tout autre échec reste une erreur");
assert.ok(garde.includes("disabled: suspenduHorsProfil || userData.disabled === true,"));
assert.ok(garde.includes('window.location.replace("suspended.html");'));
// Aucune lecture de plus sur le chemin normal : la suspension n'est lue
// que dans le catch.
assert.equal((garde.match(/"suspensions"/g) || []).length, 1);
});

test("Admin : suspendre écrit suspensions/{uid} ET le profil, dans un même lot", () => {
const adm = lire("admin/firebase-admin.js");
const f = adm.slice(adm.indexOf("export async function setUserDisabled"), adm.indexOf("\n}\n", adm.indexOf("export async function setUserDisabled")) + 2);
assert.ok(f.includes("const lot = writeBatch(db);"));
assert.ok(f.includes('lot.set(doc(db, "suspensions", uid), { suspendu: disabled === true, par: auth.currentUser.uid, le: serverTimestamp() });'));
assert.ok(f.includes('lot.update(doc(db, "users", uid), { disabled });'));
assert.ok(f.includes("await lot.commit();"));
});

test("Règles : suspensions/{uid} écrit par l'admin seul, jamais supprimé ; le suspendu ne recrée pas son profil", () => {
const r = lire("firestore.rules");
const bloc = r.slice(r.indexOf("match /suspensions/{uid} {"), r.indexOf("\n}\n", r.indexOf("match /suspensions/{uid} {")) + 2);
assert.ok(bloc.includes("allow read: if isOwner(uid) || isAdmin();"));
assert.ok(bloc.includes("allow create, update: if isAdmin() &&"));
assert.ok(bloc.includes('request.resource.data.keys().hasOnly(["suspendu", "par", "le"])'));
assert.ok(bloc.includes("request.resource.data.par == request.auth.uid"));
assert.ok(bloc.includes("request.resource.data.le == request.time"));
assert.ok(bloc.includes("allow delete: if false;"));
assert.match(r, /function compteSuspendu\(uid\) \{\nreturn suspenduHorsProfil\(uid\) \|\|/);
const creation = r.slice(r.indexOf("match /users/{uid} {"), r.indexOf("allow update:", r.indexOf("match /users/{uid} {")));
assert.ok(creation.includes("&& !suspenduHorsProfil(uid);"));
});
