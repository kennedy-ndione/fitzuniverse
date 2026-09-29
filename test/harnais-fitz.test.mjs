/**
 * ============================================================
 * test/harnais-fitz.test.mjs — l'analyse de Fitz dans le harnais
 * ============================================================
 *
 * `node scripts/verifier/verifier.mjs --moteur=webkit licence-obtenue`
 * échouait une passe sur trois, sur « Erreur console : [Fitz] analyse du
 * diagnostic : FitzError: Fitz est momentanément indisponible… ».
 * Chronométré le 2026-09-28 (32 passes, deux moteurs) : la page finissait
 * CHAQUE fois dans le même état, et l'erreur arrivait entre −19 et
 * +187 ms autour du relevé de la console. Elle a été comptée 6 fois.
 * Deux causes, toutes deux dans le harnais :
 *
 *   - la doublure visiteur ne rendait aucune session anonyme et refusait
 *     fitzGenerate, là où le vrai serveur écrit sa lecture au visiteur ;
 *   - le relevé de la console n'attendait pas la fin de l'analyse, lancée
 *     sans `await` en fin de rendu (results.js).
 *
 *  1. la doublure visiteur écrit la lecture, comme le vrai serveur ;
 *  2. le refus doublé est celui du vrai serveur au plafond des sessions
 *     anonymes, et seul fitzGenerate « diagnostic » change de règle ;
 *  3. le relevé de la console attend la fin de l'analyse, et le refus a
 *     son contrôle, une fois par moteur ;
 *  4. aucune erreur de Fitz n'est classée en bruit (décision de Charles,
 *     2026-09-28 : « les deux chemins », pas un filtre).
 *
 * Ce test ne lance aucun navigateur : que la page AFFICHE la lecture et
 * l'échec, c'est `npm run verifier` qui le prouve.
 * ============================================================
 */

import { test, after } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

import { couperLeReseau, estBruitConsole, TITRES_LECTURE_FITZ, REFUS_FITZ } from "../scripts/verifier/hors-ligne.mjs";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(path.join(RACINE, f), "utf8").replace(/\r\n/g, "\n");
const echapper = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const DOSSIER = mkdtempSync(path.join(tmpdir(), "harnais-fitz-"));
after(() => rmSync(DOSSIER, { recursive: true, force: true }));

/**
 * Le module que le harnais sert à la page pour un fichier du SDK
 * Firebase : on rejoue le gestionnaire de route de couperLeReseau() sur
 * une fausse requête, puis on importe le corps servi.
 */
async function moduleDouble(fichier, options = {}) {

  let gestionnaire = null;
  await couperLeReseau({ route: async (_motif, g) => { gestionnaire = g; } }, options);

  let corps = null;
  await gestionnaire({
    request: () => ({ url: () => `https://www.gstatic.com/firebasejs/11.10.0/${fichier}` }),
    fulfill: (reponse) => { corps = reponse.body; },
    continue: () => {}
  });

  const f = path.join(DOSSIER, `${options.fitz || "defaut"}-${fichier.replace(/\W/g, "_")}.mjs`);
  writeFileSync(f, corps);
  return import(pathToFileURL(f).href);

}

test("harnais Fitz 1 — la doublure visiteur écrit la lecture du diagnostic, comme le vrai serveur", async () => {

  // results.html ouvre une session ANONYME (js/ai/diagnostic-fitz.js).
  // L'ancienne coquille ne rendait AUCUN utilisateur : un état que le
  // vrai SDK ne produit jamais.
  const auth = await moduleDouble("firebase-auth.js");
  const { user } = await auth.signInAnonymously({});
  assert.equal(user.isAnonymous, true);
  assert.ok(user.uid);

  const fonctions = await moduleDouble("firebase-functions.js");
  const fitz = fonctions.httpsCallable({}, "fitzGenerate");

  const { stream, data } = await fitz.stream({ task: "diagnostic", system: "s", user: "u" });
  let texte = "";
  let fragments = 0;
  for await (const fragment of stream) { texte += fragment.delta; fragments += 1; }

  assert.ok(fragments > 1, "la lecture doit être diffusée par fragments, comme response.sendChunk()");
  assert.equal((await data).text, texte, "la valeur de retour fait foi, et vaut le texte diffusé");
  assert.equal((await fitz({ task: "diagnostic" })).data.text, texte, "l'appel sans flux rend la même lecture");

  // Les quatre titres, dans l'ordre, sont ceux du prompt `diagnostic` :
  // diagnostic-fitz.js en fait les quatre cartes que le harnais exige.
  const titres = texte.split("\n").filter((l) => l.startsWith("### ")).map((l) => l.slice(4));
  assert.deepEqual(titres, TITRES_LECTURE_FITZ);

  const prompts = lire("js/ai/prompts.js");
  for (const titre of TITRES_LECTURE_FITZ) {
    assert.ok(prompts.includes(`"### ${titre}"`), `« ${titre} » n'est plus un titre du prompt diagnostic : aligner TITRES_LECTURE_FITZ`);
  }

});

test("harnais Fitz 2 — le refus doublé est celui du vrai serveur au plafond anonyme, et seul fitzGenerate « diagnostic » change de règle", async () => {

  const refus = await moduleDouble("firebase-functions.js", { fitz: "refus" });

  await assert.rejects(refus.httpsCallable({}, "fitzGenerate").stream({ task: "diagnostic" }), (e) => {
    assert.equal(e.code, REFUS_FITZ.code);
    assert.deepEqual(e.details, { fitzCode: REFUS_FITZ.fitzCode });
    assert.equal(e.message, REFUS_FITZ.message);
    return true;
  });

  // Le code, le code Fitz et le message sont ceux que functions/fitz.js
  // lève quand le plafond des sessions anonymes est atteint (le SDK du
  // navigateur préfixe le code de « functions/ »).
  const serveur = lire("functions/fitz.js");
  const branche = serveur.slice(serveur.indexOf('reservation.portee === "anonymes"'), serveur.indexOf('reservation.portee === "robinet"'));
  assert.ok(branche.includes("Plafond des sessions anonymes atteint"), "branche du plafond anonyme introuvable dans functions/fitz.js");
  assert.match(branche, new RegExp(`refus\\(\\s*"${echapper(REFUS_FITZ.code.replace(/^functions\//, ""))}",\\s*"${REFUS_FITZ.fitzCode}",\\s*"${echapper(REFUS_FITZ.message)}"`));

  // Tout le reste garde le refus « unauthenticated » du LOT S3, dans les
  // deux modes : la carte des portails, et les tâches réservées aux
  // formules.
  for (const options of [{}, { fitz: "refus" }]) {
    const m = await moduleDouble("firebase-functions.js", options);
    await assert.rejects(m.httpsCallable({}, "portails")(), { code: "unauthenticated" });
    await assert.rejects(m.httpsCallable({}, "fitzGenerate").stream({ task: "chat" }), { code: "unauthenticated" });
  }

});

test("harnais Fitz 3 — le relevé de la console attend la fin de l'analyse, et le refus a son contrôle, une fois par moteur", () => {

  const verifieur = lire("scripts/verifier/verifier.mjs");
  const profil = verifieur.slice(verifieur.indexOf("async function verifierUnProfil("), verifieur.indexOf("async function temoinEmulation("));
  assert.ok(profil.length > 0, "verifierUnProfil() introuvable");

  const attente = profil.indexOf("await lireAnalyseFitz(page)");
  const releve = profil.indexOf("for (const message of erreursComptees)");
  assert.ok(attente > 0, "verifierUnProfil() n'attend plus la fin de l'analyse de Fitz");
  assert.ok(releve > attente, "la console doit être relevée APRÈS la fin de l'analyse de Fitz");

  // La lecture doit s'afficher en quatre cartes ; sous refus, une seule
  // ligne console est attendue, par son texte exact.
  assert.match(profil, /analyse\.titres\.join\(" \| "\) !== TITRES_LECTURE_FITZ\.join\(" \| "\)/);
  assert.match(profil, /erreursConsole\.findIndex\(\(m\) => m\.split\("\\n"\)\[0\] === LIGNE_REFUS_FITZ\)/);
  assert.match(verifieur, /const LIGNE_REFUS_FITZ = `\[Fitz\] analyse du diagnostic : FitzError: \$\{REFUS_FITZ\.message\}`;/);

  // Le refus, une fois par moteur, dès qu'un profil a été joué — après
  // les profils, dans passerUnMoteur().
  const moteur = verifieur.slice(verifieur.indexOf("async function passerUnMoteur("), verifieur.indexOf("async function principal("));
  const boucle = moteur.indexOf("for (const profil of choisis) {");
  const controle = moteur.indexOf('\n  if (choisis.length) noter("analyse Fitz refusée", await verifierUnProfil({ navigateur, base, profil: choisis[0], fitz: "refus" }));\n');
  assert.ok(boucle > 0, "la boucle des profils est introuvable dans passerUnMoteur()");
  assert.ok(controle > boucle, "le contrôle « analyse Fitz refusée » doit suivre les profils, sous la condition `choisis.length`");

});

test("harnais Fitz 4 — aucune erreur de Fitz n'est classée en bruit de console", () => {

  // Le filtre masquerait la ligne dans TOUS les contrôles, même lors d'un
  // vrai échec, et laisserait la course ouverte pour toute autre erreur
  // tardive de l'analyse.
  assert.equal(estBruitConsole(`[Fitz] analyse du diagnostic : FitzError: ${REFUS_FITZ.message}`), false);
  assert.equal(estBruitConsole("[Fitz] analyse du diagnostic : FitzError: Fitz est momentanément indisponible. Notre équipe est prévenue — réessayez un peu plus tard."), false);
  assert.equal(estBruitConsole("[Fitz] identification impossible : Error: auth/operation-not-allowed"), false);

});
