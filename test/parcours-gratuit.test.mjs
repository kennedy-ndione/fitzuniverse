/**
 * ============================================================
 * test/parcours-gratuit.test.mjs — deux phrases qui disaient faux
 * ============================================================
 *
 * Trouvées le 2026-09-20 en faisant, pas à pas et sur le site déployé,
 * le parcours d'un vrai compte gratuit (voir le compte rendu
 * claude/parcours-etudiant-teste-2026-09-20.md du projet).
 *
 *  1. LA CARTE DES RÉSULTATS COLLAIT LA PROSE DERRIÈRE « ÉCHÉANCE LE ».
 *     Deux cartes sur trois, juste après le diagnostic :
 *       « Il vous reste 42 jours — échéance le Clôture le 1er novembre
 *         2026 à 23h59 (heure suisse), puis le 1er mai 2027… »
 *
 *  2. LES PARAMÈTRES DÉMENTAIENT LES ALERTES QUI FONCTIONNENT.
 *     « Ces e-mails ne sont pas encore envoyés automatiquement » — alors
 *     que les alertes d'ouverture de bourses partent depuis le 20 — et
 *     le consentement coché à l'inscription n'apparaissait nulle part.
 *     Le bandeau du hub, lui, poussait vers le réglage qui n'envoie rien.
 * ============================================================
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { formaterDate } from "../js/echeance.js";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(path.join(RACINE, f), "utf8").replace(/\r\n/g, "\n");
const sansCommentaires = (js) => js.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

// ------------------------------------------------------------------
// 1. La carte des résultats dit une DATE
// ------------------------------------------------------------------

test("parcours 1 — la carte des résultats ne colle plus la prose derrière « échéance le »", () => {

const code = sansCommentaires(lire("results.js"));

assert.ok(!/échéance le \$\{scholarship\.deadline\}/.test(code),
"« échéance le ${scholarship.deadline} » est revenu : la prose du catalogue n'est pas une date");
assert.match(code, /échéance le \$\{dateDansNJours\(scholarship\.jours\)\}/,
"la carte doit dire la date reconstituée depuis le décompte");
assert.match(code, /import \{ formaterDate \} from "\.\/js\/echeance\.js";/,
"une seule façon d'écrire une date : celle de la fiche");

});

test("parcours 2 — la date reconstituée est exactement celle de l'échéance", () => {

// La fonction de results.js, recopiée à l'identique : le module est
// une page (DOM, catalogue) et ne s'importe pas sous Node. La garde de
// forme ci-dessous vérifie que la copie ne diverge pas de l'original.
const dateDansNJours = (n, aujourdhui) => {
const minuit = Date.UTC(aujourdhui.getUTCFullYear(), aujourdhui.getUTCMonth(), aujourdhui.getUTCDate());
return formaterDate(new Date(minuit + n * 86400000).toISOString().slice(0, 10));
};

// Les deux cartes vues cassées en production, à l'heure où elles
// l'étaient (21h50) — le décompte et la date doivent se répondre.
assert.equal(dateDansNJours(71, new Date("2026-09-20T21:50:00Z")), "30 novembre 2026", "Émile Boutmy");
assert.equal(dateDansNJours(42, new Date("2026-09-20T21:50:00Z")), "1er novembre 2026", "Zeno Karl Schindler");
// Le lendemain matin, un jour de moins, la MÊME date.
assert.equal(dateDansNJours(70, new Date("2026-09-21T06:30:00Z")), "30 novembre 2026");
// Un passage d'année.
assert.equal(dateDansNJours(12, new Date("2026-12-20T23:59:00Z")), "1er janvier 2027");

assert.match(lire("results.js"),
/const minuit = Date\.UTC\(aujourdhui\.getUTCFullYear\(\), aujourdhui\.getUTCMonth\(\), aujourdhui\.getUTCDate\(\)\);\nreturn formaterDate\(new Date\(minuit \+ n \* 86400000\)\.toISOString\(\)\.slice\(0, 10\)\);/,
"dateDansNJours a changé dans results.js : relire ce test");

});

// ------------------------------------------------------------------
// 2. Les réglages e-mail disent ce qu'ils font
// ------------------------------------------------------------------

test("parcours 3 — le consentement aux alertes se voit et se change dans les paramètres", () => {

const html = lire("account.html");
const js = lire("account.js");

assert.match(html, /id="alerteBoursesToggle"/, "le réglage des alertes de bourses doit exister");
assert.match(html, /<label class="account-toggle-row" for="alerteBoursesToggle" id="alertes">/,
"et porter l'ancre où le hub envoie l'étudiant");

// Il lit et écrit LE champ que la fonction d'envoi interroge — un nom
// voisin (alertesBourses, alerteBourse…) laisserait le réglage sans effet.
assert.match(js, /alerteToggle\.checked = ctx\.userData\.alerteBourses === true;/);
assert.match(js, /alerteBourses: active,\nalerteBoursesMajLe: serverTimestamp\(\)/);
assert.match(lire("functions/emails.js"), /\.where\("alerteBourses", "==", true\)/,
"la fonction d'envoi a changé de champ : le réglage ne commanderait plus rien");
assert.match(lire("inscription.js"), /alerteBourses: alertesInput/,
"l'inscription écrit le même champ que les paramètres");

});

test("parcours 4 — plus aucune phrase ne dit que les e-mails ne partent pas", () => {

const html = lire("account.html").replace(/<!--[\s\S]*?-->/g, "");

assert.ok(!/ne sont pas encore envoyés automatiquement/.test(html),
"la phrase qui démentait les alertes est revenue");
// Le réglage qui n'envoie encore rien le DIT, et dit où lire en attendant.
assert.match(html, /Rappels d'échéances et messages de l'équipe/);
assert.match(html, /Pas encore envoyés par e-mail/);

});

test("parcours 5 — le bandeau du hub pousse vers ce qui fonctionne", () => {

const hub = lire("espace-bourse.html").replace(/<!--[\s\S]*?-->/g, "");
const bandeau = hub.slice(hub.indexOf('id="emailNudge"'), hub.indexOf("</div>\n</div>", hub.indexOf('id="emailNudge"')));

assert.match(bandeau, /href="account\.html#alertes"/, "le bandeau mène au réglage des alertes");
assert.ok(!/activez les notifications e-mail/.test(bandeau),
"le bandeau pousse de nouveau vers le réglage qui n'envoie rien");

// Et il se tait quand les alertes sont actives — pas quand l'AUTRE
// réglage l'est.
const dash = lire("dashboard.js");
assert.match(dash, /emailNudge\.hidden = userData\.alerteBourses === true;/);
assert.ok(!/emailNudge\.hidden = userData\.emailNotifications/.test(dash));

});
