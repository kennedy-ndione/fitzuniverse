/**
* LOT 119 (2026-09-26) — CE QUE L'AUDIT DES LIENS ET DES BOUTONS A TROUVÉ
*
* 1. La fiche d'une bourse menait à « preinscriptions.html#procedure-<pays> » :
*    l'ancre n'existe plus depuis que chaque destination a sa page.
* 2. « Signaler un problème » menait à messages.html#signaler, et la
*    feuille ne s'ouvrait pas ; « écrivez-nous » visait #supportCard, qui
*    n'existe pas.
* 3. L'administration ne montrait nulle part le prix des formules bourses,
*    et affichait « 10 000 F » pour un diagnostic gratuit.
* 4. Le choix du parcours préinscription parlait de la seule France.
*/
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { TRONCS } from "../js/procedures/index.js";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(join(racine, f), "utf8").replace(/\r\n/g, "\n");

test("119 — le lien « Voir la procédure » mène à la page de la destination, qui existe", () => {
const js = lire("details.js");
assert.ok(!/preinscriptions\.html#procedure-/.test(js), "plus d'ancre morte");
assert.match(js, /procedureLink\.href = pageDeProcedure\(procedure\);/);
const m = js.match(/const pageDeProcedure = \(p\) => (`[^`]+`);/);
assert.ok(m, "pageDeProcedure définie");
// eslint-disable-next-line no-new-func
const pageDeProcedure = new Function("p", `return ${m[1]};`);
assert.equal(TRONCS.length, 9);
for (const t of TRONCS) {
const page = pageDeProcedure(t);
assert.ok(existsSync(join(racine, page)), `${t.paysDestination} → ${page}`);
}
});

test("119 — « Signaler un problème » ouvre la feuille ; « écrivez-nous » mène à la messagerie", () => {
assert.match(lire("js/support-ticket.js"), /if \(window\.location\.hash === "#signaler"\) ouvrir\(\);/);
assert.match(lire("js/fitz-recours.js"), /href: "messages\.html#signaler"/);
for (const f of ["applications.js", "dashboard.js", "js/fitz-recours.js", "js/next-action.js"]) {
assert.ok(!/messages\.html#supportCard/.test(lire(f)), `${f} : ancre #supportCard morte`);
}
});

test("119 — l'administration montre le prix des formules bourses, et le diagnostic gratuit", () => {
const html = lire("admin/plans.html");
assert.match(html, /<tbody id="plansBoursesBody"><\/tbody>/);
assert.ok(html.indexOf("plansBoursesBody") < html.indexOf("plansPaysBody"));
const js = lire("admin/plans.js");
assert.match(js, /plans\[id\]\.parcours === "bourse" && !plans\[id\]\.deprecated/);
assert.match(js, /\$\{gratuitOuPrix\(offre\("diagnostic-france", pays\)\)\}/);
assert.match(js, /renderBourses\(\);\nrenderPays\(\);/);
});

test("119 — le choix du parcours préinscription parle des neuf pays", () => {
assert.match(lire("offers.html"), /<span class="parcours-choice-sub">Un dossier par pays, dans neuf pays, mené jusqu'au dépôt\.<\/span>/);
});

test("119 — chaque page du Control Center qui montre « Déconnexion » la branche", () => {

for (const f of readdirSync(join(racine, "admin")).filter((x) => x.endsWith(".html"))) {
const html = lire(`admin/${f}`);
if (!html.includes('id="logoutBtn"')) continue;
const js = `admin/${f.replace(/\.html$/, ".js")}`;
if (!existsSync(join(racine, js))) continue;
assert.match(lire(js), /initLogout\(\)|getElementById\("logoutBtn"\)/, `${js} : bouton Déconnexion inerte`);
}
});

test("119 — sur téléphone, la barre de l'espace ne pousse plus la page de côté", () => {
const css = lire("css/journey-shell.css");
const i = css.indexOf("@media (max-width: 480px){\n.presence-pill{ padding:7px; gap:0; }");
assert.ok(i > 0, "la pastille « En ligne » se réduit au point");
assert.match(css.slice(i, i + 400), /\.presence-pill \.presence-texte\{\nposition:absolute;/);
assert.match(css, /@media \(max-width: 400px\)\{\n\.journey-context \.back-link ~ h1,\n\.journey-context \.back-link ~ h2\{\nposition:absolute;/);
// Le texte reste dans le DOM : js/presence.js l'écrit toujours.
assert.match(lire("js/presence.js"), /<span class="presence-texte">En ligne<\/span>/);
});
