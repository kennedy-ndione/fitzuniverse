/**
 * ============================================================
 * test/fitz-voit.test.mjs — la capture d'écran atteint vraiment Fitz
 * ============================================================
 *
 * LOT FITZ-VOIT (2026-09-19), demandé par Charles : « discuter avec Fitz
 * sera ce qui montrera à l'étudiant le chemin à prendre pour qu'il ne
 * puisse être bloqué nulle part ».
 *
 * LE DÉFAUT TROUVÉ EN CHERCHANT OÙ ÉCRIRE LA CONSIGNE. Le canal des
 * images était construit de bout en bout — ai-gateway.js normalise
 * `input.images`, functions/fitz.js les valide, les compte et les
 * assemble pour le modèle — et AUCUNE PAGE ne s'en servait. ai-chat.js
 * envoyait ses pièces sous `attachments`, une clé que personne ne lit.
 * La capture s'affichait à l'étudiant et n'atteignait jamais le modèle.
 *
 * Ces tests tiennent les deux moitiés : le TUYAU (l'image part) et le
 * MÉTIER (Fitz sait quoi en faire, et ne l'invente pas).
 *
 * Fins de ligne : ai-chat.js et attachments.js sont en CRLF.
 * ============================================================
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { imagesPourLeModele } from "../js/ai/attachments.js";
import { generate } from "../js/ai/ai-client.js";
import { genererViaSimulateur } from "../js/ai/ai-simulateur.js";
import { FitzError, CODES } from "../js/ai/ai-errors.js";
import { buildPrompt } from "../js/ai/prompts.js";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(path.join(RACINE, f), "utf8").replace(/\r\n/g, "\n");
const codeSeul = (f) => lire(f).replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/[^\n]*$/gm, "");

test("voit 1 — l'image part sous la clé que la passerelle lit vraiment", () => {

  const chat = codeSeul("ai-chat.js");

  // `attachments` sert à l'AFFICHAGE et n'est lu par personne en aval.
  // `images` est le canal réel (js/ai/ai-gateway.js → functions/fitz.js).
  assert.match(chat, /images:\s*imagesPourLeModele\(/,
    "ai-chat.js n'envoie plus d'images au modèle : la capture s'affiche et se perd");
  assert.match(chat, /imagesPourLeModele/,
    "le convertisseur n'est plus importé");

  // Les deux clés coexistent : retirer `attachments` casserait l'affichage.
  assert.match(chat, /attachments:\s*userMessage\.attachments/,
    "l'affichage des pièces dans la conversation a été perdu");

  // La passerelle lit bien `input.images` — si ce nom change là-bas, ce
  // test dit où est l'autre moitié.
  assert.match(codeSeul("js/ai/ai-gateway.js"), /normaliserImages\(input\?\.images\)/,
    "la passerelle ne lit plus input.images : la clé envoyée par le chat ne mène plus nulle part");

});

test("voit 2 — le base64 part nu, et seules les images partent", () => {

  const donne = imagesPourLeModele([
    { kind: "image", type: "image/png", previewUrl: "data:image/png;base64,AAAA" },
    { kind: "pdf", type: "application/pdf", previewUrl: null },
    { kind: "image", type: "image/jpeg", previewUrl: "data:image/jpeg;base64," },
    { kind: "image", type: "image/webp", previewUrl: "pas-une-url-de-donnees" },
    null
  ]);

  // Le préfixe « data:image/png;base64, » n'est PAS des octets d'image :
  // l'envoyer ferait lire au modèle le nom du format comme du contenu.
  assert.deepEqual(donne, [{ mediaType: "image/png", data: "AAAA" }]);

  assert.deepEqual(imagesPourLeModele(), []);
  assert.deepEqual(imagesPourLeModele("pas un tableau"), []);

});

test("voit 3 — Fitz sait guider dans un portail, et ne l'invente pas", () => {

  for (const parcours of ["bourse", "preinscription"]) {

    const { system } = buildPrompt("chat", {
      message: "je suis bloqué",
      profile: { parcours },
      parcours,
      history: []
    });

    // (1) Il réclame la capture au lieu de décrire un chemin de mémoire.
    assert.match(system, /DEMANDE-LUI UNE CAPTURE DE SON ÉCRAN/, `${parcours} : Fitz ne réclame plus la capture`);

    // (2) La raison de Charles : des pages entières ne sont pas traduites.
    assert.match(system, /langue qu'il ne lit pas/, `${parcours} : la traduction de l'écran a disparu`);
    assert.match(system, /EXACTEMENT tel qu'il est écrit/, `${parcours} : le bouton n'est plus nommé tel qu'il est écrit`);

    // (3) Une étape à la fois, jusqu'au dépôt.
    assert.match(system, /UNE SEULE étape à la fois/, `${parcours} : Fitz déverse de nouveau toute la procédure`);
    assert.match(system, /jusqu'au dépôt/, `${parcours} : l'accompagnement ne va plus jusqu'au dépôt`);

    // (4) LA RÈGLE NON NÉGOCIABLE.
    assert.match(system, /N'INVENTE JAMAIS un bouton/, `${parcours} : Fitz peut de nouveau inventer un bouton`);
    assert.match(system, /coûte une année/, `${parcours} : l'enjeu n'est plus dit au modèle`);

    // (5) Le geste, pour qui ne sait pas le faire.
    assert.match(system, /Android/, `${parcours} : le geste de la capture n'est plus expliqué`);
    assert.match(system, /iPhone/, `${parcours} : le geste iPhone a disparu`);

    // (6) Honnêteté sur ce qui n'arrive pas encore au modèle.
    assert.match(system, /Un PDF ou un document joint ne t'arrive pas/, `${parcours} : Fitz laisse croire qu'il lit les PDF`);

    // (7) « Il ne doit pas laisser l'étudiant confus. »
    assert.match(system, /NE TERMINE JAMAIS SUR UNE IMPUISSANCE/, `${parcours} : Fitz peut de nouveau finir sur un constat d'échec`);

  }

});

test("voit 4 — l'écran d'accueil dit ce que la capture débloque", () => {

  const html = lire("ai-chat.html");

  // L'ancienne phrase disait ce qu'on POUVAIT faire, en fin de paragraphe.
  assert.ok(!/Vous pouvez aussi joindre une capture d'écran, une photo ou un PDF\./.test(html),
    "l'annonce est redevenue une possibilité technique en fin de paragraphe");

  assert.match(html, /Bloqué sur un portail\s*\?/, "l'accroche a disparu de l'écran d'accueil");
  assert.match(html, /langue que vous ne lisez pas/, "la promesse de traduction a disparu");
  assert.match(html, /jusqu'au dépôt de votre dossier/, "l'accompagnement jusqu'au dépôt n'est plus annoncé");

});

test("voit 5 — une capture ne déclenche plus le garde de longueur du PROMPT", async () => {

  // LE DÉFAUT, VU EN PRODUCTION : « Le texte envoyé est trop long pour
  // être traité en une fois. Découpez-le en deux parties » — devant une
  // simple capture d'écran de portail. Le garde sommait TOUTES les
  // chaînes de l'entrée, donc le base64 de l'image, et DEUX FOIS
  // (previewUrl pour l'aperçu, data pour le modèle). 120 000 caractères
  // de plafond, c'est ~45 Ko d'image comptés en double : aucune capture
  // réelle ne pouvait passer, et le refus tombait AVANT l'envoi.
  const base64 = "A".repeat(200000);

  const res = await generate({
    task: "chat",
    input: {
      message: "où dois-je appuyer pour commencer ?",
      profile: {},
      history: [],
      attachments: [{ kind: "image", type: "image/jpeg", previewUrl: "data:image/jpeg;base64," + base64 }],
      images: [{ mediaType: "image/jpeg", data: base64 }]
    },
    adaptateur: genererViaSimulateur
  });

  assert.equal(typeof res.text, "string");
  assert.ok(res.text.length > 0, "la génération n'aboutit plus quand une capture est jointe");

  // Et le garde protège TOUJOURS ce pour quoi il existe : un prompt
  // réellement trop long doit encore être refusé.
  await assert.rejects(
    () => generate({
      task: "chat",
      input: { message: "x".repeat(200000), profile: {}, history: [] },
      adaptateur: genererViaSimulateur
    }),
    (e) => e.code === CODES.ENTREE_TROP_LONGUE,
    "le garde ne protège plus contre un prompt réellement trop long"
  );

});

test("voit 6 — le message précis du serveur gagne sur le texte générique", () => {

  // Un même code couvre plusieurs situations et le serveur sait
  // laquelle. « Découpez le texte en deux parties » devant une image
  // trop lourde est un conseil impossible à suivre.
  const duServeur = new FitzError(CODES.ENTREE_TROP_LONGUE, {
    message: "Cette capture est trop lourde. Réduisez-la, puis renvoyez-la."
  });
  assert.equal(duServeur.message, "Cette capture est trop lourde. Réduisez-la, puis renvoyez-la.");

  // Sans message du serveur, le texte du client reste.
  assert.match(new FitzError(CODES.ENTREE_TROP_LONGUE).message, /Découpez-le en deux parties/);

  // Et la passerelle ne le reprend QUE si le serveur a nommé le code :
  // une erreur seulement traduite d'un code HTTP garde le texte client.
  const gw = codeSeul("js/ai/ai-gateway.js");
  assert.match(gw, /const nomme = Boolean\(erreur\?\.details\?\.fitzCode\)/,
    "la passerelle reprend le message du serveur sans vérifier qu'il a nommé le code");
  assert.match(gw, /message: nomme \? String\(erreur\?\.message \|\| ""\) : ""/,
    "le message du serveur n'est plus transmis au client");

});

test("voit 7 — une capture de téléphone est allégée avant l'envoi", () => {

  const chat = codeSeul("ai-chat.js");

  // Un écran de portail photographié fait couramment 1 à 3 Mo, et le
  // modèle redimensionne de toute façon : les octets au-delà ne font que
  // ralentir l'envoi et gonfler la facture.
  assert.match(chat, /compressImageToTarget/, "les captures repartent en pleine taille");
  assert.match(chat, /readAttachment\(await allegerSiImage\(file\)\)/,
    "l'allègement n'est plus branché sur le chemin des pièces jointes");

  // Une seule implémentation de compression dans le dépôt : celle-ci.
  assert.match(chat, /from "\.\/js\/compression-image\.js"/,
    "une deuxième compression a été réécrite au lieu de réutiliser celle du dépôt");

  // Un PDF n'est pas une image : il ne passe pas par le canvas.
  assert.match(chat, /if \(!file\.type\.startsWith\("image\/"\)\) return file;/,
    "un fichier non-image passe maintenant par la compression d'image");

});
