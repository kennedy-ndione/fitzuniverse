/**
* ============================================================
* test/roles-admin.test.mjs — la panne du 2026-09-09, mise sous test
* ============================================================
*
* Une fiche étudiant morte pour TOUT administrateur ordinaire, et une
* heure de diagnostic. La cause tenait en un trait d'union : le document
* `admins` du propriétaire portait `role: "super-admin"`, quand le code
* comparait à `"superAdmin"`.
*
* Il y avait pourtant un test censé couvrir exactement cela — « un test
* compare les deux formulations de estSuperAdminDoc ». Il n'a rien
* attrapé, et la raison mérite d'être écrite : il RECOPIAIT la logique
* dans le corps du test, puis rejouait la copie. Une copie ne peut pas
* contredire l'original ; elle ne peut que vieillir avec lui. Et il
* comparait des FORMULATIONS — deux textes qui se ressemblent — au lieu
* des VALEURS effectivement acceptées de part et d'autre.
*
* D'où les quatre exigences vérifiées ici :
*
*   1. LES VALEURS, pas les phrases. On extrait des règles Firestore la
*      liste des `role` acceptés, et on la compare à celle du client. Un
*      trait d'union ajouté d'un seul côté fait rougir ce test.
*   2. UNE SEULE ORTHOGRAPHE. Aucune chaîne de rôle n'est écrite en dur
*      hors de js/roles-admin.js.
*   3. AUCUN ÉLÉMENT RÉSERVÉ N'EST LU SANS GARDE. appliquerRole() RETIRE
*      les blocs `[data-super-admin]` : tout `getElementById` qui vise
*      l'un d'eux et déréférence sans vérifier tue la page entière.
*   4. L'ÉCRAN D'ERREUR NE MENT PAS. Il distingue une panne réseau d'une
*      erreur de code, et nomme l'erreur réelle.
* ============================================================
*/

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import vm from "node:vm";

import {
estSuperAdminDoc,
porteRoleProprietaire,
defautDeRole,
libelleDefautDeRole,
ROLE_SUPER_ADMIN,
ROLE_ADMIN,
ROLE_SUPER_ADMIN_HERITE,
ROLES_SUPER_ADMIN,
ROLES_CONNUS
} from "../js/roles-admin.js";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(join(racine, f), "utf8").replace(/\r\n/g, "\n");

// Les commentaires ont le droit de RACONTER la panne — c'est même tout
// leur intérêt. On ne lit donc jamais un fichier brut : on lit ce que le
// navigateur exécutera.
function sansCommentaires(source) {
return source
.replace(/<!--[\s\S]*?-->/g, " ")
.replace(/\/\*[\s\S]*?\*\//g, " ")
.replace(/(^|[^:"'`\\])\/\/[^\n]*/g, "$1");
}

// ------------------------------------------------------------------
// 1. LES VALEURS ACCEPTÉES, DES DEUX CÔTÉS
// ------------------------------------------------------------------

test("firestore.rules et le client acceptent EXACTEMENT les mêmes valeurs de rôle", () => {

const regles = lire("firestore.rules");
const fonction = regles.slice(regles.indexOf("function estSuperAdminDoc"), regles.indexOf("function isSuperAdmin"));
assert.ok(fonction.length > 40, "estSuperAdminDoc introuvable dans firestore.rules");

// Ce que le SERVEUR accepte, lu dans son texte plutôt que supposé.
const valeursServeur = [...fonction.matchAll(/d\.role == "([^"]+)"/g)].map((m) => m[1]).sort();

// Ce que le CLIENT accepte, demandé à la vraie fonction — pas à une
// copie écrite dans ce fichier.
const valeursClient = [...ROLES_SUPER_ADMIN].sort();

assert.deepEqual(
valeursServeur,
valeursClient,
`les règles acceptent ${JSON.stringify(valeursServeur)} et le client ${JSON.stringify(valeursClient)} — c'est exactement l'écart qui a coûté la panne du 2026-09-09`
);

// Et on le vérifie par le comportement, valeur par valeur : chacune de
// celles que le serveur accepte doit ouvrir les droits côté client.
for (const valeur of valeursServeur) {
assert.equal(estSuperAdminDoc({ isActive: true, role: valeur }), true, `le serveur accepte « ${valeur} », le client doit l'accepter aussi`);
}

// L'AMORÇAGE des deux côtés : un document sans champ `role`.
assert.match(fonction, /!d\.keys\(\)\.hasAny\(\["role"\]\)/);
assert.equal(estSuperAdminDoc({ isActive: true }), true);

// Le compte révoqué, des deux côtés.
assert.match(fonction, /d\.isActive == true/);
assert.equal(estSuperAdminDoc({ isActive: false }), false);

// Un rôle inconnu n'ouvre rien — ni ici, ni là-bas.
assert.equal(estSuperAdminDoc({ isActive: true, role: "root" }), false);
assert.equal(estSuperAdminDoc({ isActive: true, role: ROLE_ADMIN }), false);

});

test("la graphie héritée est ACCEPTÉE, et signalée comme un défaut de donnée", () => {

// Acceptée : personne ne reste enfermé dehors à cause d'un document
// écrit à la main il y a des mois.
assert.equal(estSuperAdminDoc({ isActive: true, role: ROLE_SUPER_ADMIN_HERITE }), true);

// Mais jamais silencieuse : c'est le silence qui a coûté le diagnostic.
const defaut = defautDeRole({ isActive: true, role: ROLE_SUPER_ADMIN_HERITE });
assert.deepEqual(defaut, { valeur: ROLE_SUPER_ADMIN_HERITE, herite: true });
assert.match(libelleDefautDeRole(defaut), /graphie héritée/);
assert.ok(libelleDefautDeRole(defaut).includes(ROLE_SUPER_ADMIN), "la phrase doit dire par quoi remplacer");

// Un rôle INCONNU est plus grave : personne ne sait ce que ce compte
// est censé pouvoir faire, et il est dégradé en admin ordinaire.
const inconnu = defautDeRole({ isActive: true, role: "root" });
assert.deepEqual(inconnu, { valeur: "root", herite: false });
assert.match(libelleDefautDeRole(inconnu), /rôle non reconnu/);
assert.match(libelleDefautDeRole(inconnu), /traité comme un administrateur ordinaire/);

// Les cas sains ne disent rien.
assert.equal(defautDeRole({ isActive: true }), null, "l'amorçage n'est pas un défaut");
assert.equal(defautDeRole({ isActive: true, role: ROLE_SUPER_ADMIN }), null);
assert.equal(defautDeRole({ isActive: true, role: ROLE_ADMIN }), null);
assert.equal(libelleDefautDeRole(null), "");

// Toutes les valeurs connues sont couvertes, et elles seules.
assert.deepEqual([...ROLES_CONNUS].sort(), [ROLE_ADMIN, ROLE_SUPER_ADMIN_HERITE, ROLE_SUPER_ADMIN].sort());

});

test("le défaut de rôle est DIT : en console au chargement, et à l'écran sur la page des administrateurs", () => {

const role = lire("admin/admin-role.js");
assert.match(role, /const defaut = defautDeRole\(data\);/);
assert.match(role, /console\.warn\(/, "un rôle fautif doit laisser une trace en console");
assert.match(role, /libelleDefautDeRole\(defaut\)/);

// Et l'écran, parce qu'une trace en console ne se lit que si on la
// cherche — or personne ne la cherche avant que quelque chose casse.
const page = lire("admin/administrateurs.js");
assert.match(page, /const defaut = defautDeRole\(a\);/);
assert.match(page, /libelleDefautDeRole\(defaut\)/);
assert.match(page, /class="admins-defaut/);
assert.match(lire("admin/control-center.css"), /\.admins-defaut\{/);

// La colonne « Rôle » dit ce que le document PORTE : un propriétaire
// révoqué reste un propriétaire, et ne reçoit pas un bouton
// « Réactiver » que les règles refuseront.
assert.equal(porteRoleProprietaire({ isActive: false }), true);
assert.equal(porteRoleProprietaire({ isActive: false, role: ROLE_ADMIN }), false);
assert.match(page, /const proprietaire = porteRoleProprietaire\(a\);/);

});

// ------------------------------------------------------------------
// 2. UNE SEULE ORTHOGRAPHE, DÉCLARÉE EN UN SEUL ENDROIT
// ------------------------------------------------------------------

test("aucune chaîne de rôle n'est écrite en dur hors de js/roles-admin.js", () => {

// Le seul fichier de PRODUCTION autorisé à contenir ces chaînes est
// celui qui les DÉCLARE. firestore.rules aussi, forcément — c'est
// l'autre langage, et le test ci-dessus compare les deux jeux de
// valeurs.
//
// Le harnais navigateur est exempté pour la raison INVERSE : ses
// sessions doivent porter les valeurs telles qu'elles existent EN BASE,
// graphie héritée et rôle inconnu compris. S'il importait les
// constantes, il suivrait le code au lieu de le confronter — et le jour
// où une constante change, il changerait avec elle sans rien dire. Ses
// valeurs sont vérifiées juste en dessous, une par une.
const exemptes = new Set(["js/roles-admin.js", "scripts/verifier/control-center.mjs"]);

const dossiers = ["js", "admin", "functions", "scripts"];
const fichiers = [];

const parcourir = (rel) => {
for (const entree of readdirSync(join(racine, rel), { withFileTypes: true })) {
if (entree.name === "node_modules" || entree.name.startsWith(".")) continue;
const chemin = `${rel}/${entree.name}`;
if (entree.isDirectory()) parcourir(chemin);
else if (/\.(js|mjs|html)$/.test(entree.name)) fichiers.push(chemin);
}
};

for (const d of dossiers) parcourir(d);
for (const f of readdirSync(racine)) {
if (/\.(js|html)$/.test(f)) fichiers.push(f);
}

// Une chaîne LITTÉRALE, pas un nom de propriété : `moi.superAdmin` est
// du code, `"superAdmin"` est une donnée dupliquée. Et l'attribut HTML
// `data-super-admin` n'est pas entre guillemets — il n'est pas visé.
const chaineRole = /(["'`])super-?[Aa]dmin\1/;

// `role: "admin"` seulement : le `role` d'un message de conversation
// ("user", "assistant", "system") porte le même nom de champ sans être
// la même idée, et js/ai/* en est plein.
const champRole = /\brole\s*(?::|===?)\s*(["'`])admin\1/;

const fautifs = [];

for (const fichier of fichiers) {
if (exemptes.has(fichier)) continue;
const source = sansCommentaires(lire(fichier));
if (chaineRole.test(source)) fautifs.push(`${fichier} : chaîne « ${source.match(chaineRole)[0]} » écrite en dur`);
if (champRole.test(source)) fautifs.push(`${fichier} : « ${source.match(champRole)[0].trim()}… » — utiliser ROLE_ADMIN / ROLE_SUPER_ADMIN`);
}

assert.deepEqual(fautifs, [], `deux chaînes égales écrites à deux endroits finissent par différer :\n${fautifs.join("\n")}`);

// Et le fichier qui les déclare les déclare bien toutes.
const declaration = lire("js/roles-admin.js");
assert.match(declaration, /export const ROLE_SUPER_ADMIN = "superAdmin";/);
assert.match(declaration, /export const ROLE_ADMIN = "admin";/);
assert.match(declaration, /export const ROLE_SUPER_ADMIN_HERITE = "super-admin";/);

// Module PUR : c'est ce qui permet de le comparer aux règles sous Node.
// Son en-tête RACONTE la panne, donc parle de Firestore et du
// navigateur — on regarde le code, pas le récit.
assert.ok(!/firebase|gstatic|document\.|window\./i.test(sansCommentaires(declaration)), "js/roles-admin.js doit rester sans Firebase ni DOM");

});

test("le harnais navigateur joue les trois rôles qui existent en base, pas seulement celui qui marchait", () => {

// Le harnais ne savait ouvrir le Control Center que dans UN rôle :
// un document sans champ `role`, donc le propriétaire par amorçage —
// exactement le seul pour qui la fiche ne cassait pas. Ses sessions
// couvrent désormais les trois autres états réels.
const harnais = lire("scripts/verifier/control-center.mjs");

const sessions = [...harnais.matchAll(/role: "([^"]+)"/g)].map((m) => m[1]);

assert.ok(sessions.includes(ROLE_ADMIN), "il manque la session « administrateur ordinaire » — celle qui a cassé");
assert.ok(sessions.includes(ROLE_SUPER_ADMIN_HERITE), "il manque la session « graphie héritée » — celle du propriétaire réel");
assert.ok(sessions.some((r) => !ROLES_CONNUS.includes(r)), "il manque une session au rôle inconnu");

// Et le quatrième état, qui n'est pas un rôle : la lecture qui échoue.
assert.match(harnais, /echecAdmins: true/);
assert.match(harnais, /renvoyé à la connexion/);

// Ce que chaque session vérifie : que la fiche s'ouvre ENTIÈREMENT, et
// que le réservé est absent plutôt que grisé.
assert.match(harnais, /reserveVisible/);
assert.match(harnais, /querySelectorAll\("\[data-super-admin\]"\)\.length/);
assert.match(harnais, /const ECRANS_D_ECHEC = \[/);

// Le harnais tourne dans `npm run verifier` sans qu'on ait à y penser.
const verifieur = lire("scripts/verifier/verifier.mjs");
assert.match(verifieur, /import \{ verifierControlCenter \} from "\.\/control-center\.mjs";/);
// Lot DEUX-MOTEURS (2026-09-11) : chaque contrôle passe par noter(), sous
// chaque moteur ; le décompte final additionne les contrôles en échec.
assert.match(verifieur, /noter\("control center", await verifierControlCenter\(/);
assert.match(verifieur, /totalEchecs \+= echecs\.length/, "un échec du Control Center doit faire échouer le harnais entier");

});

// ------------------------------------------------------------------
// 3. AUCUN ÉLÉMENT RÉSERVÉ LU SANS GARDE
// ------------------------------------------------------------------

/**
* Les `id` contenus dans un bloc `data-super-admin` — donc RETIRÉS du
* DOM par appliquerRole() pour un administrateur ordinaire.
*
* On compte les balises de même nom pour trouver la fermeture du bloc :
* c'est la seule façon d'être exact sur des blocs imbriqués, et c'est
* précisément la liste des éléments qu'un `getElementById(...).value`
* fait exploser.
*/
function idsReserves(html) {

const ids = new Set();
const marqueur = /<([a-z]+)([^>]*\bdata-super-admin\b[^>]*)>/g;
let m;

while ((m = marqueur.exec(html)) !== null) {

const balise = m[1];
let profondeur = 1;
let i = marqueur.lastIndex;
const ouvre = new RegExp(`<${balise}[\\s>]`, "g");
const ferme = new RegExp(`</${balise}>`, "g");

while (profondeur > 0 && i < html.length) {
ouvre.lastIndex = i;
ferme.lastIndex = i;
const o = ouvre.exec(html);
const f = ferme.exec(html);
if (!f) break;
if (o && o.index < f.index) { profondeur += 1; i = o.index + 1; }
else { profondeur -= 1; i = f.index + 1; }
}

for (const id of html.slice(m.index, i).matchAll(/\bid="([^"]+)"/g)) ids.add(id[1]);

}

return ids;

}

test("un élément réservé au propriétaire n'est jamais déréférencé sans garde", () => {

const pages = readdirSync(join(racine, "admin")).filter((f) => f.endsWith(".html"));
const reserves = new Set();

for (const page of pages) {
for (const id of idsReserves(lire(`admin/${page}`))) reserves.add(id);
}

// Le repère : si cette liste se vide, c'est le scanner qui est cassé,
// pas le HTML qui s'est assaini.
for (const attendu of ["planSelect", "planExpiryInput", "planPreinscriptionSelect", "planPreinscriptionExpiryInput", "promoteAdminBtn"]) {
assert.ok(reserves.has(attendu), `${attendu} devrait être détecté comme réservé`);
}

const fautes = [];

for (const fichier of readdirSync(join(racine, "admin")).filter((f) => f.endsWith(".js"))) {

const source = sansCommentaires(lire(`admin/${fichier}`));

for (const id of reserves) {
// Déréférencement immédiat : `.value`, `.textContent`, `[0]`… Tout
// sauf `?.`, qui est une garde en soi.
const motif = new RegExp(`getElementById\\(\\s*["'\`]${id}["'\`]\\s*\\)\\s*(\\.(?!\\?)|\\[)`);
if (motif.test(source)) fautes.push(`admin/${fichier} : getElementById("${id}") déréférencé sans garde`);
}

}

assert.deepEqual(fautes, [], `appliquerRole() RETIRE ces éléments : sans garde, la page entière meurt pour un administrateur ordinaire.\n${fautes.join("\n")}`);

});

test("renderSubscriptionTab survit à un DOM d'où tout le réservé a été retiré", () => {

const js = lire("admin/student-detail.js");
const debut = js.indexOf("function renderSubscriptionTab(userData) {");
assert.notEqual(debut, -1, "renderSubscriptionTab introuvable");

// Borne : la fonction suivante. Le style du dépôt ferme les blocs en
// colonne 0, donc la première ligne « function » qui suit fait office
// de fin.
const suite = js.slice(debut + 10).search(/\n(?:async )?function /);
const corps = sansCommentaires(js.slice(debut, debut + 10 + suite));

// CHAQUE lecture du DOM de cette fonction passe par une variable, et
// cette variable est vérifiée. C'est la ligne 350 d'origine qui a tué
// la fiche — `document.getElementById("planSelect").value = …`.
const lectures = [...corps.matchAll(/getElementById\(\s*["'`]([^"'`]+)["'`]\s*\)(\s*[.[])?/g)];
assert.ok(lectures.length > 5, "la fonction devrait lire plusieurs éléments");

const nus = lectures.filter((l) => l[2]).map((l) => l[1]);
assert.deepEqual(nus, [], `déréférencement immédiat dans renderSubscriptionTab : ${nus.join(", ")}`);

// Et chaque variable est réellement gardée avant usage.
for (const [, id] of lectures) {
const nom = corps.match(new RegExp(`const (\\w+) = document\\.getElementById\\(\\s*["'\`]${id}["'\`]`));
assert.ok(nom, `${id} : la lecture doit être rangée dans une variable`);
assert.match(corps, new RegExp(`if \\(!?${nom[1]}[).\\s]`), `${id} : la variable ${nom[1]} est utilisée sans garde`);
}

});

// ------------------------------------------------------------------
// 4. L'ÉCRAN D'ERREUR NE MENT PAS
// ------------------------------------------------------------------

test("l'écran d'erreur distingue une panne réseau, un refus du serveur et une erreur de code", () => {

const js = lire("admin/student-detail.js");

// La vraie fonction, extraite du fichier : student-detail.js importe
// Firebase depuis un CDN et ne s'importe donc pas sous Node — mais son
// verdict, lui, doit être testé pour de bon.
const source = js.slice(js.indexOf("const CODES_RESEAU ="), js.indexOf("function echapperTexte("));
const bac = { module: { exports: {} } };
vm.createContext(bac);
vm.runInContext(`${source}\nmodule.exports = categoriserErreur;`, bac);
const categoriser = bac.module.exports;

// La requête n'est pas arrivée : réessayer a un sens.
for (const code of ["unavailable", "deadline-exceeded", "resource-exhausted", "aborted", "cancelled", "auth/network-request-failed"]) {
assert.equal(categoriser({ code }), "reseau", `${code} est une panne passagère`);
}

// Elle est arrivée, et le serveur a refusé. Parler de connexion
// Internet ici serait exactement le filet qui ment : un droit manquant
// ne se répare pas en changeant de Wi-Fi.
for (const code of ["permission-denied", "unauthenticated", "not-found", "invalid-argument", "internal"]) {
assert.equal(categoriser({ code }), "serveur", `${code} est un refus, pas une coupure`);
}

// Aucune requête en cause : c'est un bug, et l'écran doit le dire.
assert.equal(categoriser(new TypeError("Cannot set properties of null (setting 'value')")), "code");
assert.equal(categoriser(new ReferenceError("resolvePlanPreinscription is not defined")), "code");
assert.equal(categoriser(null), "code");
assert.equal(categoriser({}), "code");
assert.equal(categoriser({ code: 42 }), "code", "un code qui n'est pas une chaîne n'est pas un code Firestore");

});

test("l'erreur réelle est nommée à l'écran, et laissée entière en console", () => {

const js = lire("admin/student-detail.js");
const debut = js.indexOf("console.error(\"Erreur de chargement de la fiche étudiant :\", error);");
const attrape = js.slice(debut, js.indexOf("if (pageLoader) pageLoader.style.display = \"none\";", debut));
assert.ok(attrape.length > 200, "le catch de loadStudent est introuvable");

// L'ancienne phrase mentait : elle disait « Impossible de charger cette
// fiche », sans jamais dire pourquoi, sur une TypeError.
const visible = sansCommentaires(js);
assert.ok(!/Impossible de charger cette fiche/.test(visible), "l'écran ne doit plus se contenter d'un « impossible » muet");

// Les trois écrans, un par famille — et ils disent trois choses
// différentes, sinon la distinction ne sert à rien.
assert.match(attrape, /const famille = categoriserErreur\(error\);/);
assert.match(attrape, /content\.innerHTML = ecrans\[famille\];/);
for (const famille of ["reseau:", "serveur:", "code:"]) {
assert.ok(attrape.includes(famille), `écran manquant : ${famille}`);
}
assert.match(attrape, /La connexion au serveur a échoué/);
assert.match(attrape, /la requête est bien arrivée, et elle a été refusée/);
assert.match(attrape, /Ce n'est pas un problème de connexion : réessayer ne changera rien/);

// « Réessayer » n'est proposé QUE sur une panne réseau : sur un refus
// ou un bug, c'est promettre que le hasard pourrait réparer.
const ecrans = attrape.slice(attrape.indexOf("const ecrans = {"));
const [avantServeur, apresServeur] = ecrans.split("serveur: `");
assert.match(avantServeur, /window\.location\.reload\(\)/, "l'écran réseau doit proposer de réessayer");
assert.ok(!/window\.location\.reload\(\)/.test(apresServeur), "aucun bouton « Réessayer » sur un refus ni sur une erreur de code");

// L'erreur est NOMMÉE : son code partout où il existe, sa pile dès que
// réessayer ne suffira pas.
assert.match(attrape, /const codeLisible = echapperTexte\(\(error && error\.code\) \|\| ""\);/);
assert.match(attrape, /error\.stack \|\| error\.message/);
assert.equal((attrape.match(/\$\{pileVisible\}/g) || []).length, 2, "la pile doit être montrée sur le refus ET sur le bug");

// Échappée, parce qu'un message d'erreur peut contenir n'importe quoi.
const source = js.slice(js.indexOf("function echapperTexte("), js.indexOf("const params = new URLSearchParams"));
const bac = { module: { exports: {} } };
vm.createContext(bac);
vm.runInContext(`${source}\nmodule.exports = echapperTexte;`, bac);
assert.equal(bac.module.exports("<img onerror=x>"), "&lt;img onerror=x&gt;");
assert.equal(bac.module.exports(null), "");

// Et la console garde tout, sans reformatage.
assert.match(js, /console\.error\("Erreur de chargement de la fiche étudiant :", error\);/);

// Même exigence en amont : une lecture de admins/{uid} qui échoue ne
// doit pas être indiscernable d'un « pas administrateur ».
const role = lire("admin/admin-role.js");
assert.match(role, /console\.error\(/);
assert.match(role, /\(erreur && erreur\.code\) \|\| "erreur inconnue"/);

});

test("« on n'a pas pu savoir » n'est jamais rendu comme « vous n'avez pas ce droit »", () => {

// chargerAdmin() résolvait `null` sur une lecture ratée. `null` veut
// dire « pas administrateur », et admin-auth.js DÉCONNECTE là-dessus :
// le propriétaire s'est vu éjecter sans un mot. La promesse propage
// désormais l'erreur, et chaque appelant la traite.
const role = sansCommentaires(lire("admin/admin-role.js"));
assert.match(role, /new Promise\(\(resolve, rejeter\)/);
assert.match(role, /rejeter\(erreur\);/);
assert.ok(!/catch \(erreur\) \{[\s\S]{0,400}resolve\(null\)/.test(role), "un échec de lecture ne doit plus se résoudre en null");

// La porte d'entrée : plus de redirection silencieuse vers login.
const auth = lire("admin/admin-auth.js");
const attrape = sansCommentaires(auth.slice(auth.lastIndexOf("} catch (error) {")));
assert.ok(!/login\.html/.test(attrape), "une erreur de lecture ne doit pas renvoyer à la connexion");
assert.ok(!/signOut/.test(attrape), "et ne doit pas déconnecter");
assert.match(attrape, /role", "alert"/);
assert.match(attrape, /n'ont pas pu être vérifiés/);
assert.match(attrape, /error\.code \|\| error\.message/);
assert.match(attrape, /textContent/, "un message d'erreur peut contenir n'importe quoi : jamais d'innerHTML");

// La page des administrateurs : « Réservé au propriétaire » affiché à
// un propriétaire serait la pire des pistes.
const page = lire("admin/administrateurs.js");
assert.match(page, /try \{\s*moi = await chargerAdmin\(\);\s*\} catch \(error\) \{/);
assert.match(page, /Vos droits n'ont pas pu être vérifiés/);
assert.ok(page.indexOf("Vos droits n'ont pas pu être vérifiés") < page.indexOf("Réservé au propriétaire"), "le cas « lecture ratée » doit être traité AVANT le cas « pas propriétaire »");

// Et la fiche étudiant ne relit plus admins/{uid} de son côté : deux
// endroits qui décident « est-ce un administrateur » finissent par
// répondre deux choses différentes.
const fiche = sansCommentaires(lire("admin/student-detail.js"));
const entree = fiche.slice(fiche.indexOf("const adminConnecte = await chargerAdmin();") - 600, fiche.indexOf("appliquerRole(currentAdmin.superAdmin);"));
assert.ok(!/getDoc\(doc\(db, "admins", user\.uid\)\)/.test(entree), "la garde d'entrée doit passer par chargerAdmin(), et par lui seul");
assert.match(entree, /if \(!adminConnecte\) \{\s*await signOut\(auth\);/);

});
