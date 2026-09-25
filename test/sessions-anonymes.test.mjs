/**
* LES « SANS NOM » DE L'ADMIN (2026-09-25)
*
* Charles : « 3 étudiants viennent de s'inscrire mais leurs mails et leurs
* noms ne s'affichent pas ». La sauvegarde du 25/09 (18 h 04) montrait 7
* fiches users au nom et à l'e-mail VIDES, dont 4 récentes, et deux
* factures « en attente » ouvertes par elles. La cause : la page de
* résultats ouvre une session ANONYME pour la lecture de Fitz
* (js/ai/diagnostic-fitz.js) ; le visiteur qui allait ensuite vers
* l'espace ou le paiement passait pour connecté, et l'auto-guérison de
* js/access-guard.js lui créait une fiche vide.
*
* Trois verrous, et l'admin qui ne compte plus ces fiches :
*   1. resolveSession : une session anonyme vaut « personne » ;
*   2. firestore.rules : une session anonyme ne crée pas de fiche ;
*   3. creerPaiement : une session anonyme n'ouvre pas de facture.
*/
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(join(racine, f), "utf8").replace(/\r\n/g, "\n");

test("1 — l'espace ne prend jamais une session anonyme pour un compte", () => {
const js = lire("js/access-guard.js");
assert.match(js, /if \(!firebaseUser \|\| firebaseUser\.isAnonymous\) \{\nresolve\(null\);\nreturn;\n\}/);
// Et c'est bien AVANT l'auto-guérison qui crée la fiche.
assert.ok(js.indexOf("firebaseUser.isAnonymous") < js.indexOf("await setDoc(userRef, defaultData);"));
// La lecture de Fitz garde sa session anonyme (plafond par identifiant).
assert.match(lire("js/ai/diagnostic-fitz.js"), /signInAnonymously\(auth\)/);
});

test("2 — les règles refusent la création d'une fiche par une session anonyme", () => {
const regles = lire("firestore.rules");
assert.match(regles, /allow create: if isOwner\(uid\) && request\.auth\.token\.firebase\.sign_in_provider != 'anonymous' && /);
});

test("3 — le serveur refuse une facture à une session anonyme, avant tout le reste", () => {
const p = lire("functions/paiement.js");
const i = p.indexOf('if (fournisseur === "anonymous") {');
assert.ok(i > 0, "le refus existe");
assert.ok(i < p.indexOf("const uid = request.auth.uid;"), "avant de lire l'uid");
assert.ok(i < p.indexOf("checkout-invoice/create"), "avant la facture");
});

test("4 — l'admin ne compte plus les sessions anonymes, et les nomme dans les paiements", async () => {
const admin = lire("admin/firebase-admin.js");
assert.match(admin, /export function estSessionAnonyme\(user\) \{/);
assert.match(admin, /return avecSessionsAnonymes \? tous : tous\.filter\(\(u\) => !estSessionAnonyme\(u\)\);/);
assert.match(admin, /getCountFromServer\(query\(usersCollection, where\("email", "!=", ""\)\)\)/);
assert.match(lire("admin/paiements.js"), /getAllUsers\(\{ avecSessionsAnonymes: true \}\)/);
// La règle elle-même, sur les cas vus dans la sauvegarde.
const src = admin.slice(admin.indexOf("export function estSessionAnonyme"), admin.indexOf("export async function getAllUsers"));
const estSessionAnonyme = new Function(`${src.replace("export ", "")}; return estSessionAnonyme;`)();
assert.equal(estSessionAnonyme({ name: "", email: "" }), true);
assert.equal(estSessionAnonyme({}), true);
assert.equal(estSessionAnonyme({ name: "Marie Mendy", email: "m@exemple.sn" }), false);
assert.equal(estSessionAnonyme({ name: "", email: "m@exemple.sn" }), false);
});
