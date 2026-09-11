/**
* ============================================================
* test/admin-roles.test.mjs — deux niveaux d'admin (lot ADMIN)
* ============================================================
*
* Deux choses se règlent ici, et la première est la plus sensible du
* projet : les règles Firestore.
*
*   1. `admins/{uid}` passe de `allow write: if false` à une écriture
*      réservée au superAdmin, qui ne peut créer que des `role:"admin"`
*      et ne peut RIEN supprimer.
*   2. L'attribution manuelle d'une formule s'ouvre aux DEUX grilles,
*      réservée au superAdmin, et laisse une trace (`attributionManuelle`).
*
* CE QUE CE FICHIER PEUT ET NE PEUT PAS FAIRE. Il vérifie la FORME des
* règles — leur texte, clause par clause, chacune rattachée à
* l'exigence qu'elle tient. Il ne les EXÉCUTE pas : cela demanderait
* l'émulateur Firestore (donc Java) et @firebase/rules-unit-testing, que
* `npm test` n'embarque pas. La compilation, elle, est vérifiée à chaque
* déploiement (`firebase deploy --only firestore:rules` échoue sur une
* règle invalide). C'est dit ici plutôt que sous-entendu : un test de
* forme qui se ferait passer pour un test de comportement serait pire
* qu'aucun test.
*
* L'AMORÇAGE a son test à lui, et il ne doit jamais casser : un document
* `admins` ACTIF et SANS champ `role` vaut superAdmin. C'est ce qui
* permet à l'interface de fonctionner dès le déploiement, sans une seule
* écriture manuelle en console.
* ============================================================
*/

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { PLAN_ORDER, PLAN_PREINSCRIPTION_ORDER } from "../js/plan-features.js";
import { estSuperAdminDoc, ROLE_SUPER_ADMIN, ROLE_ADMIN } from "../js/roles-admin.js";

const require = createRequire(import.meta.url);
const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(join(racine, f), "utf8").replace(/\r\n/g, "\n");

const regles = lire("firestore.rules");
const blocAdmins = regles.slice(regles.indexOf("match /admins/{uid} {"), regles.indexOf("}", regles.indexOf("allow delete: if false;", regles.indexOf("match /admins/{uid} {"))));

// ------------------------------------------------------------------
// 1. L'AMORÇAGE — un document sans rôle est celui du propriétaire
// ------------------------------------------------------------------

test("un document admins ACTIF et SANS champ role est reconnu superAdmin", () => {

// La règle, côté serveur.
const fonction = regles.slice(regles.indexOf("function estSuperAdminDoc"), regles.indexOf("function isSuperAdmin"));
assert.match(fonction, /d\.isActive == true/);
assert.match(fonction, /!d\.keys\(\)\.hasAny\(\["role"\]\)/, "un document SANS rôle doit passer");

// Le miroir, côté navigateur, n'est PLUS recopié ici : on appelle la
// vraie fonction. Ce test rejouait une copie de la logique, écrite à la
// main dans le test — et une copie ne peut pas contredire l'original,
// elle ne peut que vieillir avec lui. Voir test/roles-admin.test.mjs
// pour la comparaison des VALEURS acceptées de part et d'autre.
assert.equal(estSuperAdminDoc({ isActive: true }), true, "L'AMORÇAGE : sans rôle, c'est le propriétaire");
assert.equal(estSuperAdminDoc({ isActive: true, role: ROLE_SUPER_ADMIN }), true);
assert.equal(estSuperAdminDoc({ isActive: true, role: ROLE_ADMIN }), false);
assert.equal(estSuperAdminDoc({ isActive: false }), false, "un compte révoqué n'est plus rien");
assert.equal(estSuperAdminDoc({ isActive: false, role: ROLE_SUPER_ADMIN }), false);
assert.equal(estSuperAdminDoc(null), false);

// Et le Control Center la RE-EXPORTE, il ne la réécrit pas.
const role = lire("admin/admin-role.js");
assert.match(role, /export \{[^}]*estSuperAdminDoc[^}]*\} from "\.\.\/js\/roles-admin\.js";/);
assert.ok(!/function estSuperAdminDoc\(/.test(role), "admin-role.js ne doit plus contenir sa propre copie");

});

test("pourquoi l'amorçage n'est pas une faille : aucun client ne peut créer un document sans rôle", () => {
// C'est la clause qui rend la règle d'amorçage sûre — un document sans
// `role` ne peut naître que dans la console Firebase.
assert.match(blocAdmins, /allow create: if isSuperAdmin\(\)\s*&& request\.resource\.data\.role == "admin"/);
});

// ------------------------------------------------------------------
// 2. LES RÈGLES admins/{uid}
// ------------------------------------------------------------------

test("admins : seul un superAdmin écrit, et il ne peut fabriquer qu'un « admin »", () => {

// Plus de `allow write: if false` — mais rien n'est ouvert à la ronde.
assert.ok(!/match \/admins\/\{uid\} \{[\s\S]{0,200}allow write: if false;/.test(regles), "la règle a bien changé");

for (const clause of ["allow create: if isSuperAdmin()", "allow update: if isSuperAdmin()"]) {
assert.ok(blocAdmins.includes(clause), `manque : ${clause}`);
}

// Ni pair, ni successeur : le rôle écrit est TOUJOURS "admin".
assert.equal((blocAdmins.match(/request\.resource\.data\.role == "admin"/g) || []).length, 2, "création ET mise à jour doivent forcer role:\"admin\"");
assert.ok(!/request\.resource\.data\.role == "superAdmin"/.test(blocAdmins));

// Les champs autorisés, et eux seuls.
const champs = blocAdmins.match(/hasOnly\(\["role", "isActive", "nommeLe", "nommePar", "email", "nom"\]\)/g) || [];
assert.equal(champs.length, 2, "création ET mise à jour doivent limiter les champs");

// On ne se modifie pas soi-même, et on ne touche pas au document du
// propriétaire : `get("role", "superAdmin")` traite un document SANS
// rôle comme intouchable — c'est ce qui protège l'amorçage.
assert.match(blocAdmins, /request\.auth\.uid != uid/);
assert.match(blocAdmins, /resource\.data\.get\("role", "superAdmin"\) == "admin"/);

// On ne supprime pas un administrateur : on le désactive.
assert.match(blocAdmins, /allow delete: if false;/);

// La liste : lisible par le propriétaire (la page administrateurs).
assert.match(blocAdmins, /allow read: if isOwner\(uid\) \|\| isSuperAdmin\(\);/);

});

test("isAdmin() n'a pas changé : un lot qui touche aux rôles ne doit pas fermer une porte au passage", () => {
const fonction = regles.slice(regles.indexOf("function isAdmin()"), regles.indexOf("// DEUX NIVEAUX"));
assert.match(fonction, /exists\(\/databases\/\$\(database\)\/documents\/admins\/\$\(request\.auth\.uid\)\)/);
assert.match(fonction, /\.data\.isActive == true/);
assert.ok(!/role/.test(fonction), "isAdmin ne doit pas dépendre du rôle : un collègue reste administrateur");
});

// ------------------------------------------------------------------
// 3. LA FICHE ÉTUDIANT
// ------------------------------------------------------------------

test("aucun identifiant de formule n'est écrit en dur dans admin/student-detail.html", () => {

const html = lire("admin/student-detail.html");

// La liste s'était déjà désynchronisée deux fois de la grille réelle.
// Elle vient maintenant des constantes, à la construction du sélecteur.
for (const id of [...PLAN_ORDER.filter((p) => p !== "gratuit"), ...PLAN_PREINSCRIPTION_ORDER]) {
assert.ok(!html.includes(`value="${id}"`), `« ${id} » est écrit en dur dans le HTML`);
}

assert.match(html, /<select id="planSelect"[^>]*><\/select>/, "le sélecteur bourse doit être vide dans le HTML");
assert.match(html, /<select id="planPreinscriptionSelect"[^>]*><\/select>/, "le sélecteur préinscription doit être vide dans le HTML");

// Lot FINITIONS-VISUELLES (2026-09-11) : les deux groupes viennent du
// module pur js/formules-admin.js (lui-même construit sur PLAN_ORDER et
// PLAN_PREINSCRIPTION_ORDER — test/formules-admin.test.mjs), qui donne à
// chaque formule une étiquette DISTINCTE (« Essentiel · 4 candidatures »
// ≠ « Essentiel (ancienne) · 5 candidatures »).
const js = lire("admin/student-detail.js");
assert.match(js, /optionsFormules\(\{ vide: "Sans formule", pass: false, preinscription: false \}\)/, "le sélecteur bourse vient du module");
assert.match(js, /optionsFormules\(\{ vide: "Sans offre", pass: false, bourse: false \}\)/, "le sélecteur préinscription vient du module");
const module_ = lire("js/formules-admin.js");
assert.match(module_, /PLAN_ORDER\.filter\(\(id\) => id !== "gratuit" && !estRetiree\(id\)\)/, "le groupe « En vente » vient de PLAN_ORDER");
assert.match(module_, /PLAN_ORDER\.filter\(\(id\) => id !== "gratuit" && estRetiree\(id\)\)/, "le groupe « Retirées » aussi");
assert.match(module_, /TITRE_EN_VENTE = "En vente"/);
assert.match(module_, /TITRE_RETIREES = "Retirées de la vente — anciens comptes"/);
assert.match(module_, /\.\.\.PLAN_PREINSCRIPTION_ORDER/);

});

test("la fiche ne dit plus que l'offre préinscription est non modifiable", () => {
const html = lire("admin/student-detail.html");
const js = lire("admin/student-detail.js");
// La phrase était vraie et coûteuse ; elle est fausse depuis ce lot, et
// une phrase fausse sur une fiche client est pire qu'un champ manquant.
// Les deux phrases survivent dans les COMMENTAIRES qui racontent leur
// retrait — c'est permis, et c'est utile. On regarde ce qui est RENDU.
const htmlVisible = html.replace(/<!--[\s\S]*?-->/g, " ");
const jsVisible = js.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/(^|\s)\/\/.*$/gm, "$1");
assert.ok(!htmlVisible.includes("aucune modification manuelle depuis cette fiche"));
assert.ok(!jsVisible.includes("non modifiable ici"));
// Et les deux boutons existent.
assert.match(html, /id="savePlanPreinscriptionBtn"/);
assert.match(html, /id="savePlanPreinscriptionExpiryBtn"/);
});

test("sélecteurs, dates et promotion sont RETIRÉS du DOM pour un admin ordinaire", () => {

const html = lire("admin/student-detail.html");

// Chaque bloc réservé porte le marqueur…
for (const bloc of ['id="planSelect"', 'id="planExpiryInput"', 'id="planPreinscriptionSelect"', 'id="planPreinscriptionExpiryInput"', 'id="promoteAdminBtn"']) {
const i = html.indexOf(bloc);
assert.notEqual(i, -1, `${bloc} absent de la fiche`);
const avant = html.slice(Math.max(0, i - 400), i);
assert.match(avant, /data-super-admin/, `${bloc} n'est pas dans un bloc data-super-admin`);
}

// …et le marqueur fait RETIRER, pas masquer : un élément caché reste
// dans la tabulation, dans un Ctrl+F et dans un lecteur d'écran.
const role = lire("admin/admin-role.js");
assert.match(role, /querySelectorAll\("\[data-super-admin\]"\)\.forEach\(\(el\) => el\.remove\(\)\)/);
assert.match(role, /export function appliquerRole\(superAdmin\) \{\s*if \(superAdmin\) return;/);

// Appliqué sur TOUTES les pages d'admin, depuis la garde d'entrée :
// une garde qu'il faut penser à recopier est une garde qu'on oubliera.
assert.match(lire("admin/admin-auth.js"), /appliquerRole\(administrateur\.superAdmin\)/);

});

// ------------------------------------------------------------------
// 4. LA TRACE, ET LES CHIFFRES
// ------------------------------------------------------------------

test("une attribution manuelle écrit sa trace dans la MÊME requête que la formule", () => {

const src = lire("admin/firebase-admin.js");
const fonction = src.slice(src.indexOf("export async function attribuerFormuleManuellement"));

// Une seule écriture : si les règles refusent, rien n'est posé — ni la
// formule, ni la trace.
// La borne : jusqu'au bloc suivant. Le style du dépôt ferme les blocs
// en colonne 0, donc « \n} » tomberait sur la fin de la boucle `for`.
const corps = fonction.slice(0, fonction.indexOf("// =========="));
assert.equal((corps.match(/await updateDoc/g) || []).length, 1, "une seule écriture : la formule et sa trace partent ensemble");
assert.match(fonction, /patch\.attributionManuelle = \{/);
assert.match(fonction, /par: parUid/);
assert.match(fonction, /le: new Date\(\)\.toISOString\(\)\.slice\(0, 10\)/);

// `undefined` ≠ `null` : enregistrer la seule grille préinscription ne
// doit pas effacer la formule bourse du compte.
assert.match(fonction, /if \(formules\[champ\] !== undefined\) patch\[champ\] = formules\[champ\] \|\| null;/);

});

test("un VRAI paiement efface la mention d'attribution manuelle", () => {

const { calculerMiseAJour } = require(join(racine, "functions/lib/achat.js"));
const SUPPRIMER = Symbol("delete");

// Les trois branches — pass, préinscription, bourse — effacent la
// mention : elle vit dans l'objet commun.
for (const planId of ["fitzExpress", "dossier-france", "conseiller-6"]) {
const decision = calculerMiseAJour({ planId, user: {}, maintenant: new Date("2026-09-09T12:00:00Z"), supprimer: SUPPRIMER });
assert.equal(decision.statut, "applique", planId);
assert.equal(decision.misAJour.attributionManuelle, SUPPRIMER, `${planId} : la mention doit être effacée`);
}

// Même sur un achat de rang inférieur : la formule n'est pas appliquée,
// mais l'argent a bien été versé — la mention « aucun paiement
// associé » devient fausse.
const inferieur = calculerMiseAJour({
planId: "essentiel-4",
user: { plan: "signature", planExpiresAt: "2027-06-01T00:00:00.000Z" },
maintenant: new Date("2026-09-09T12:00:00Z"),
supprimer: SUPPRIMER
});
assert.equal(inferieur.statut, "rang-inferieur");
assert.equal(inferieur.misAJour.attributionManuelle, SUPPRIMER);

});

test("un compte posé à la main n'est pas compté comme une vente", () => {

// Les compteurs de formule du Control Center viennent de
// `analyticsPlanCounters`, alimentés par l'événement `payment_attempted`
// — jamais des documents `users`. Une attribution manuelle n'émet
// aucun événement, elle ne peut donc pas gonfler la courbe.
const admin = lire("admin/firebase-admin.js");
const fonction = admin.slice(admin.indexOf("export async function attribuerFormuleManuellement"), admin.indexOf("export async function listerAdmins"));
assert.ok(!/trackEvent|payment_attempted|analytics/i.test(fonction), "l'attribution manuelle ne doit émettre aucun événement de vente");

const breakdown = admin.slice(admin.indexOf("export async function getPlanBreakdown"));
assert.match(breakdown.slice(0, 400), /collection\(db, "analyticsPlanCounters"\)/, "la répartition vient des compteurs, pas des comptes");

const analytics = lire("js/analytics.js");
assert.match(analytics, /payment_attempted: \{ counters: \["totals", "byDay", "byPlan"\] \}/);
assert.ok(!/attributionManuelle/.test(analytics), "analytics n'a pas à connaître l'attribution manuelle : elle ne passe pas par lui");

});

test("la mention se lit en tête de fiche, et disparaît quand le champ est absent", () => {
const js = lire("admin/student-detail.js");
assert.match(js, /function renderAttributionManuelle\(userData\)/);
assert.match(js, /Formule posée à la main le \$\{formatISODate\(trace\.le\)\} — aucun paiement associé\./);
// Aucun bloc vide quand il n'y a rien à dire.
assert.match(js, /if \(!trace \|\| typeof trace !== "object"\) \{\s*el\.hidden = true;/);
const html = lire("admin/student-detail.html");
assert.ok(html.indexOf('id="attributionManuelle"') < html.indexOf('class="detail-tabs"'), "la mention doit précéder les onglets");
});

// ------------------------------------------------------------------
// 5. LES BOUTONS PARLENT — aucun chemin muet
// ------------------------------------------------------------------

test("chaque action rend un message de succès OU d'échec, et relit l'état", () => {

const js = lire("admin/student-detail.js");
const admins = lire("admin/administrateurs.js");

// L'ancien code répondait par alert("Impossible de …") : une boîte qui
// ne dit pas POURQUOI et qu'on ne peut pas relire.
for (const [fichier, src] of [["student-detail.js", js], ["administrateurs.js", admins]]) {
assert.ok(!/alert\("Impossible/.test(src), `${fichier} : il reste un alert() muet`);
}

// Les quatre boutons de formule passent par une seule fonction, qui
// répond dans les deux issues et RELIT depuis la base.
const enregistrer = js.slice(js.indexOf("async function enregistrerFormule"), js.indexOf('document.getElementById("savePlanBtn")'));
assert.match(enregistrer, /succes\(/);
assert.match(enregistrer, /echec\(/);
assert.match(enregistrer, /const relu = await getUser\(uid\);/, "on affiche l'état ENREGISTRÉ, pas l'état espéré");

// Promotion, révocation, réactivation : même exigence.
assert.match(js, /succes\(`\$\{nom\} est désormais administrateur/);
assert.match(js, /echec\("La promotion a échoué", error\)/);
assert.match(admins, /echec\(revoquer \? "La révocation a échoué" : "La réactivation a échoué", error\)/);
assert.match(admins, /await charger\(\);/, "la liste est relue après l'action");

// Un refus du serveur est traduit, pas avalé.
const notifier = lire("admin/notifier.js");
assert.match(notifier, /permission-denied/);
assert.match(notifier, /vous n'avez pas ce droit/);
assert.match(notifier, /unavailable\|network\|deadline-exceeded/);

});

test("on ne se révoque pas soi-même, et le propriétaire n'a pas de bouton", () => {
const admins = lire("admin/administrateurs.js");
// Deux gardes : celle du rendu (aucun bouton) et celle du clic (une
// URL, un DOM modifié, un double-clic — tout peut arriver).
assert.match(admins, /if \(moi && cible === moi\.uid\)/);
assert.match(admins, /echec\("Vous ne pouvez pas vous révoquer vous-même\."\)/);
assert.match(admins, /if \(proprietaire\) action = /);
assert.match(admins, /Compte propriétaire — non modifiable ici\./);
// Et la règle serveur dit la même chose, en dernier ressort.
assert.match(blocAdmins, /request\.auth\.uid != uid/);
});

test("la page des administrateurs est fermée à un admin ordinaire — jusqu'à l'URL tapée à la main", () => {
const admins = lire("admin/administrateurs.js");
assert.match(admins, /if \(!moi \|\| !moi\.superAdmin\)/);
assert.match(admins, /Réservé au propriétaire/);
// Le lien de la barre latérale porte le marqueur, sur toutes les pages
// qui l'ont — et il est RETIRÉ, pas masqué.
const pages = ["admin/dashboard.html", "admin/students.html", "admin/student-detail.html", "admin/administrateurs.html"];
for (const p of pages) {
const html = lire(p);
const i = html.indexOf('href="administrateurs.html"');
assert.notEqual(i, -1, `${p} : lien vers administrateurs.html absent`);
assert.match(html.slice(Math.max(0, i - 300), i), /data-super-admin/, `${p} : le lien n'est pas réservé`);
}
});

test("on ne crée jamais de compte depuis le Control Center : on promeut un compte existant", () => {
const admin = lire("admin/firebase-admin.js");
const js = lire("admin/student-detail.js");
const page = lire("admin/administrateurs.html");
// Aucun mot de passe, nulle part.
for (const [nom, src] of [["firebase-admin.js", admin], ["student-detail.js", js], ["administrateurs.html", page]]) {
assert.ok(!/createUserWithEmailAndPassword|type="password"/.test(src), `${nom} : aucune création de compte ici`);
}
assert.match(admin, /export async function promouvoirAdmin\(uid, \{ email = "", nom = "" \} = \{\}, parUid = ""\)/);
// La CONSTANTE, pas la chaîne : c'est tout l'objet du correctif du
// 2026-09-09 (voir test/roles-admin.test.mjs).
assert.match(admin, /role: ROLE_ADMIN,\s*isActive: true,/);
assert.match(admin, /import \{ ROLE_ADMIN \} from "\.\.\/js\/roles-admin\.js";/);
// On ne supprime jamais : la fonction n'existe pas.
assert.ok(!/deleteDoc\(doc\(db, "admins"/.test(admin), "un administrateur se désactive, il ne se supprime pas");
assert.match(admin, /export async function changerActivationAdmin\(uid, actif\)/);
});
