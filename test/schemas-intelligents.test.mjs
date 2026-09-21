/**
 * ============================================================
 * test/schemas-intelligents.test.mjs — quatre questions tranchées
 * ============================================================
 *
 * Le parcours d'un vrai compte gratuit (2026-09-20, voir
 * claude/parcours-etudiant-teste-2026-09-20.md, §6) a laissé quatre
 * questions de conception ouvertes. Elles ont été tranchées le
 * 2026-09-21 ; ce fichier garde chaque décision.
 *
 *  A. DEUX SCORES DE PROFIL QUI SE CONTREDISAIENT. Le hub disait « 3/6 »
 *     (sections applicables), Fitz et les outils « 5/10 ». Une seule
 *     lecture désormais : « complet à 50 % ». Un pourcentage ne ment
 *     pas sur son dénominateur et ne ressemble pas à une note.
 *
 *  B. LA FICHE D'UNE BOURSE (voir test/details-situation.test.mjs) :
 *     la situation se lit pour tout compte connecté ; les ACTIONS
 *     restent aux abonnés.
 *
 *  C. LA BARRE DU BAS PROMETTAIT CE QUE LE COMPTE N'A PAS. Un compte
 *     gratuit touchait « Candidatures » ou « Documents » et tombait sur
 *     des formules. Les deux onglets et l'entrée « Entretien » portent
 *     maintenant leur droit (data-feature), comme l'onglet Fitz :
 *     applyFeatureLocks les retire — absents, pas cadenassés (lot S4).
 *
 *  D. LE CURSEUR RÉPONDAIT À LA PLACE DE L'ÉTUDIANT. La moyenne partait
 *     du milieu (10/20) et « Continuer » l'enregistrait sans qu'on l'ait
 *     touchée. Désormais « — » tant qu'il n'est pas touché, et
 *     Continuer demande une réponse.
 * ============================================================
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { pourcentProfil, libellePourcentProfil } from "../js/profile-score.js";
import { DEFAULT_FEATURE_CONFIG } from "../js/plan-features.js";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(path.join(RACINE, f), "utf8").replace(/\r\n/g, "\n");
const sansCommentaires = (js) => js.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

// ------------------------------------------------------------------
// A. Un seul score, en pourcentage
// ------------------------------------------------------------------

test("A — le score se lit en pourcentage, borné, jamais NaN", () => {
  assert.equal(pourcentProfil(5), 50);
  assert.equal(pourcentProfil(3 / 6 * 10), 50);
  assert.equal(pourcentProfil(7), 70);
  assert.equal(pourcentProfil(10), 100);
  assert.equal(pourcentProfil(12), 100, "borné à 100");
  assert.equal(pourcentProfil(-1), 0, "borné à 0");
  assert.equal(pourcentProfil(undefined), 0);
  assert.equal(pourcentProfil("abc"), 0);
  assert.equal(libellePourcentProfil(8), "80 %", "espace insécable avant %");
});

test("A — plus aucun score de profil « sur 10 » dans le code affiché à l'étudiant", () => {
  const fichiers = ["dashboard.js", "js/next-action.js", "js/revelation.js", "ai-email.js", "ai-letter.js", "espace-bourse.html"];
  for (const f of fichiers) {
    const code = f.endsWith(".html") ? lire(f).replace(/<!--[\s\S]*?-->/g, "") : sansCommentaires(lire(f));
    assert.ok(!/\/\s*10\b|sur 10\b/.test(code), `${f} affiche encore un score sur 10`);
  }
});

// ------------------------------------------------------------------
// C. La barre du bas ne propose que ce que le compte a
// ------------------------------------------------------------------

function extraireNav() {
  const js = lire("js/mobile-nav.js");
  const tabs = js.slice(js.indexOf("const TABS = ["), js.indexOf("];", js.indexOf("const TABS = [")) + 2);
  const menu = js.slice(js.indexOf("const MENU_ITEMS = ["), js.indexOf("];", js.indexOf("const MENU_ITEMS = [")) + 2);
  const droit = js.slice(js.indexOf("function attributsDroit"), js.indexOf("function renderMenuItem"));
  // eslint-disable-next-line no-new-func
  return new Function(`${tabs}\n${menu}\n${droit}\nreturn { TABS, MENU_ITEMS, attributsDroit };`)();
}

test("C — Candidatures et Documents portent leur droit, avec des clés qui existent", () => {
  const { TABS, MENU_ITEMS, attributsDroit } = extraireNav();
  const cand = TABS.find((t) => t.href === "applications.html");
  const docs = TABS.find((t) => t.href === "documents.html");
  const entretien = MENU_ITEMS.find((m) => m.href === "interview-prep.html");
  assert.equal(cand.feature, "applications");
  assert.equal(docs.feature, "documents");
  assert.equal(entretien.feature, "interview_prep");
  for (const cle of [cand.feature, docs.feature, entretien.feature]) {
    assert.ok(DEFAULT_FEATURE_CONFIG[cle], `clé inconnue : ${cle}`);
    assert.equal(DEFAULT_FEATURE_CONFIG[cle].gratuit, false, `${cle} n'est pas ouvert au gratuit — sinon l'onglet resterait, et c'est voulu`);
  }
  // Le contrat de applyFeatureLocks : data-real-href + data-feature sur le lien.
  assert.equal(attributsDroit(cand), ' data-real-href="applications.html" data-feature="applications"');
  assert.equal(attributsDroit(TABS[0]), "", "le hub n'a pas de droit : il reste pour tous");
  const profil = MENU_ITEMS.find((m) => m.href === "profile.html");
  assert.equal(attributsDroit(profil), "", "le profil appartient à tout compte");
});

test("C — l'onglet et l'entrée de menu posent bien ces attributs sur le lien", () => {
  const js = sansCommentaires(lire("js/mobile-nav.js"));
  assert.match(js, /<a href="\$\{t\.href\}"\$\{attributsDroit\(t\)\} class="mnav-tab"/);
  assert.match(js, /<a href="\$\{m\.href\}"\$\{attributsDroit\(m\)\} class="mnav-menu-item"/);
});

test("C — la note du profil ne renvoie plus un compte gratuit vers des « candidatures suivies »", () => {
  const html = lire("profile.html");
  const note = html.slice(html.indexOf('id="profileNoteScore"'), html.indexOf("</p>", html.indexOf('id="profileNoteScore"')));
  assert.match(note, /<span data-feature="applications"> Chacune de vos <a href="applications\.html" data-real-href="applications\.html">/);
});

// ------------------------------------------------------------------
// D. Le curseur de moyenne attend une réponse
// ------------------------------------------------------------------

test("D — la moyenne n'est jamais enregistrée sans que le curseur ait été touché", () => {
  const js = sansCommentaires(lire("eligibility-questions.js"));
  const valider = js.slice(js.indexOf("function validerEtAvancer"), js.indexOf("function goBack"));
  const enregistrements = valider.match(/parcours\.enregistrer\(question\.id, sliderInput\.value\)/g) || [];
  const gardes = valider.match(/if \(!curseurTouche\) \{ demanderCurseur\(\); return; \}\s*parcours\.enregistrer\(question\.id, sliderInput\.value\)/g) || [];
  assert.equal(enregistrements.length, 2);
  assert.equal(gardes.length, 2, "chaque enregistrement du curseur est gardé");
});

test("D — une réponse déjà donnée est reprise ; sinon « — », jamais une valeur inventée", () => {
  const js = sansCommentaires(lire("eligibility-questions.js"));
  assert.match(js, /poserCurseur\(connue \? numericExisting : \(scale\.min \+ scale\.max\) \/ 2, connue\)/);
  assert.match(js, /sliderValue\.textContent = connue \? sliderInput\.value : "—"/);
  assert.ok(!/sliderValue\.textContent = value;/.test(js), "l'ancien affichage du milieu est parti");
  assert.match(lire("eligibility-questions.html"), /<output id="sliderValue">—<\/output>/);
});

test("D — toucher le pouce sans le bouger compte (10/20 pile doit pouvoir se confirmer)", () => {
  const js = sansCommentaires(lire("eligibility-questions.js"));
  assert.match(js, /sliderInput\.addEventListener\("pointerdown", marquerCurseurTouche\)/);
  assert.match(js, /sliderInput\.addEventListener\("input", marquerCurseurTouche\)/);
  assert.match(js, /event\.key === "Enter" \|\| event\.key === " "/);
});

test("D — l'invitation existe, est annoncée, et se voit quand Continuer la réclame", () => {
  const html = lire("eligibility-questions.html");
  assert.match(html, /<p class="slider-invite" id="sliderInvite" aria-live="polite">/);
  const css = lire("eligibility-questions.css");
  assert.match(css, /\.slider-container\.is-vierge input\[type="range"\]\{/);
  assert.match(css, /\.slider-container\.is-demande \.slider-invite\{/);
});

test("C — sur les pages catalogue aussi, la barre retire ce que le compte n'a pas (Fitz garde son cadenas)", () => {
  const js = sansCommentaires(lire("js/dual-shell.js"));
  assert.match(js, /if \(locked && el\.closest\("#mnavTabbar, #mnavMenuGrid"\) && !el\.classList\.contains\("mnav-tab--fitz"\)\) \{\s*el\.remove\(\);\s*return;\s*\}/);
});
