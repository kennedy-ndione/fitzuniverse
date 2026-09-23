/**
* ============================================================
* test/compte-d-abord.test.mjs — on paie depuis un compte ouvert
* ============================================================
*
* Décision de Charles du 2026-09-21 : la page de paiement ne crée plus
* de compte. Depuis que le compte est gratuit (inscription.html,
* 2026-09-20), le formulaire nom / e-mail / mot de passe de
* payment.html faisait doublon et mélangeait deux décisions sur le même
* écran. Un visiteur crée son compte (ou se connecte) et REVIENT sur la
* formule qu'il avait choisie ; le paiement n'existe à l'écran que pour
* un compte connecté.
* ============================================================
*/

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { retourSur, avecRetour } from "../js/retour-apres-compte.js";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(path.join(RACINE, f), "utf8").replace(/\r\n/g, "\n");
const sansCommentaires = (js) => js.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

test("compte d'abord 1 — payment.html ne porte plus aucun champ de compte", () => {
  const html = lire("payment.html").replace(/<!--[\s\S]*?-->/g, "");
  assert.ok(!/type="password"/.test(html), "aucun mot de passe sur la page de paiement");
  assert.ok(!/id="accountSection"|id="accountForm"|id="accountEmail"|id="accountTerms"/.test(html));
  assert.match(html, /<section class="section reveal compte-requis" id="compteRequis" hidden>/);
  assert.match(html, /<a href="inscription\.html" class="btn btn-accent" id="compteRequisInscription">/);
  assert.match(html, /<a href="login\.html" class="btn btn-secondary" id="compteRequisConnexion">/);
  assert.match(html, /<section class="section reveal" id="paiementSection" hidden>/);
  assert.match(html, /<div class="activation reveal" id="activationBloc" hidden>/);
});

test("compte d'abord 2 — payment.js ne crée plus de compte, et ne paie que pour une session", () => {
  const js = sansCommentaires(lire("payment.js"));
  for (const interdit of ["createUserWithEmailAndPassword", "updateProfile", "setDoc(", "readAccountFields", "ensureAccount", "documentUtilisateurParDefaut", "just_created", '"signup"']) {
    assert.ok(!js.includes(interdit), `payment.js contient encore ${interdit}`);
  }
  const init = js.slice(js.indexOf("function initCompteRequis"), js.indexOf("async function marquerIntention"));
  assert.match(init, /bloc\.hidden = !!session;/);
  assert.match(init, /paiement\.hidden = !session;/);
  assert.match(init, /activation\.hidden = !session;/);
  // 2026-09-23 : le pays d'un dossier survit au détour par le compte.
  assert.ok(init.includes('const retour = `payment.html?plan=${planId}${destination !== "france" ? `&destination=${destination}` : ""}`;'));
  assert.match(init, /avecRetour\("inscription\.html", retour\)/);
  assert.match(init, /avecRetour\("login\.html", retour\)/);
  const activation = js.slice(js.indexOf("function initActivation"), js.indexOf("function attendreActivation"));
  assert.ok(activation.indexOf("if (!session) return;") > -1 && activation.indexOf("if (!session) return;") < activation.indexOf("button.addEventListener"), "le bouton ne se branche pas sans session");
  assert.match(activation, /const uid = session\.user\.uid;/);
  assert.match(js, /initCompteRequis\(session, planId, destination\);/);
});

test("compte d'abord 3 — le retour n'accepte QUE la page de paiement avec une formule", () => {
  assert.equal(retourSur("?retour=payment.html%3Fplan%3Dessentiel"), "payment.html?plan=essentiel");
  assert.equal(retourSur("?retour=payment.html%3Fplan%3Dsignature-focus"), "payment.html?plan=signature-focus");
  for (const piege of ["?retour=https://exemple.com", "?retour=//exemple.com", "?retour=dashboard.html", "?retour=payment.html", "?retour=payment.html%3Fplan%3D", "?retour=payment.html%3Fplan%3Da%26x%3D1", "?retour=javascript:alert(1)", "", "?autre=1"]) {
    assert.equal(retourSur(piege), "", piege);
  }
  assert.equal(avecRetour("login.html", "payment.html?plan=essentiel"), "login.html?retour=payment.html%3Fplan%3Dessentiel");
  // La destination d'un dossier (2026-09-23) : acceptée, dans la liste fermée seulement.
  assert.equal(retourSur("?retour=payment.html%3Fplan%3Ddossier-france%26destination%3Ditalie"), "payment.html?plan=dossier-france&destination=italie");
  for (const piege of ["?retour=payment.html%3Fplan%3Ddossier-france%26destination%3Datlantide", "?retour=payment.html%3Fplan%3Ddossier-france%26destination%3Ditalie%26x%3D1", "?retour=payment.html%3Fdestination%3Ditalie"]) {
    assert.equal(retourSur(piege), "", piege);
  }
  assert.equal(avecRetour("login.html", ""), "login.html");
});

test("compte d'abord 4 — inscription et connexion ramènent à la formule, et se passent le retour", () => {
  const inscription = sansCommentaires(lire("inscription.js"));
  assert.match(inscription, /const RETOUR = retourSur\(window\.location\.search\);/);
  assert.match(inscription, /window\.location\.replace\(RETOUR \|\| "dashboard\.html"\);/);
  assert.match(inscription, /a\[href="login\.html"\][\s\S]{0,80}avecRetour\("login\.html", RETOUR\)/);
  const connexion = sansCommentaires(lire("login.js"));
  assert.match(connexion, /const RETOUR = retourSur\(window\.location\.search\);/);
  assert.match(connexion, /window\.location\.href = RETOUR \|\| "dashboard\.html";/);
  assert.match(connexion, /a\[href="inscription\.html"\][\s\S]{0,80}avecRetour\("inscription\.html", RETOUR\)/);
  // Les liens que ces scripts réécrivent existent bien dans les pages.
  assert.match(lire("inscription.html"), /<a href="login\.html">/);
  assert.match(lire("login.html"), /<a href="inscription\.html">/);
});

test("compte d'abord 5 — les CGV décrivent le même chemin", () => {
  assert.match(lire("cgv.html"), /Vous vous connectez à votre compte FitzUniverse, ou vous le créez gratuitement si vous n'en avez pas encore&nbsp;: vous revenez ensuite sur la formule choisie\./);
});
