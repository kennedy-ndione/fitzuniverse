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

    // (6) Ce que Fitz reçoit vraiment — la liste a changé le jour où les
    // PDF ont été PROUVÉS (voir « pdf 4 », qui la tient désormais). Ce qui
    // est gardé ici, c'est la règle permanente : Fitz ne laisse jamais
    // croire qu'il reçoit un format qu'il ne reçoit pas.
    assert.match(system, /Word ou Excel ne t'arrive pas/, `${parcours} : Fitz laisse croire qu'il lit les fichiers Word`);

    // (7) « Il ne doit pas laisser l'étudiant confus. »
    assert.match(system, /NE TERMINE JAMAIS SUR UNE IMPUISSANCE/, `${parcours} : Fitz peut de nouveau finir sur un constat d'échec`);

  }

});

test("voit 4 — l'écran d'accueil dit ce que la capture débloque", () => {

  const html = lire("ai-chat.html");

  // L'ancienne phrase disait ce qu'on POUVAIT faire, en fin de paragraphe.
  assert.ok(!/Vous pouvez aussi joindre une capture d'écran, une photo ou un PDF\./.test(html),
    "l'annonce est redevenue une possibilité technique en fin de paragraphe");

  // Lot CHAT-VIVANT (2026-09-19) : ces trois promesses ne vivent plus
  // dans un paragraphe mais dans une CARTE CLIQUABLE (.ai-capacite).
  // Le test garde les promesses, pas la balise qui les porte.
  assert.match(html, /Bloqué sur un portail/, "l'accroche a disparu de l'écran d'accueil");
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

test("pdf 1 — les PDF partent sur leur propre canal, jamais sous le nom « images »", async () => {

  const { documentsPourLeModele } = await import("../js/ai/attachments.js");

  const donne = documentsPourLeModele([
    { type: "application/pdf", donnees: "data:application/pdf;base64,JVBERi0=" },
    { kind: "image", type: "image/png", previewUrl: "data:image/png;base64,AAAA" },
    { type: "application/pdf", donnees: "data:application/pdf;base64," },
    { type: "application/msword", donnees: "data:application/msword;base64,XXXX" },
    null
  ]);

  // Pour l'API un PDF est un bloc `document`, pas un bloc `image` : les
  // faire passer sous le nom « images » aurait été un mensonge de plus
  // dans une chaîne qui en a déjà coûté un aujourd'hui.
  assert.deepEqual(donne, [{ mediaType: "application/pdf", data: "JVBERi0=" }]);

  // Les deux canaux ne se mélangent pas.
  assert.deepEqual(
    imagesPourLeModele([{ type: "application/pdf", donnees: "data:application/pdf;base64,JVBERi0=" }]),
    []
  );

  assert.match(codeSeul("ai-chat.js"), /documents:\s*documentsPourLeModele\(/,
    "ai-chat.js n'envoie plus les PDF");
  assert.match(codeSeul("js/ai/ai-gateway.js"), /if \(documents\.length\) charge\.documents = documents;/,
    "la passerelle n'ajoute plus les documents à la charge");

});

test("pdf 2 — le serveur construit un bloc document, et le fait payer", () => {

  const serveur = readFileSync(path.join(RACINE, "functions/fitz.js"), "utf8").replace(/\r\n/g, "\n");
  const nu = serveur.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/[^\n]*$/gm, "");

  // LE BON TYPE DE BLOC. Un `image` à la place d'un `document` ferait lire
  // le PDF comme une suite d'octets illisibles.
  assert.match(nu, /type: "document",\s*source: \{ type: "base64", media_type: document\.mediaType, data: document\.data \}/,
    "le serveur n'assemble plus les PDF en bloc document");

  // Des limites À EUX : un PDF porte plusieurs pages, chaque page coûte
  // comme une image.
  assert.match(nu, /const MAX_DOCUMENTS = \d+;/, "les PDF n'ont plus de nombre maximum");
  assert.match(nu, /const MAX_OCTETS_DOCUMENT = \d+ \* 1024 \* 1024;/, "les PDF n'ont plus de taille maximale");
  assert.match(nu, /const POIDS_PAR_DOCUMENT = \d+;/, "un PDF ne coûte plus rien");

  // ET LE POIDS EST RÉELLEMENT COMPTÉ : sans cette ligne, un PDF de vingt
  // pages passerait au prix d'un message de chat.
  assert.match(nu, /documentsValides\.length \* POIDS_PAR_DOCUMENT/,
    "les PDF ne sont plus comptés dans les points réservés");

  // Un PDF est plus borné qu'une image, parce qu'il porte plusieurs pages.
  const maxDoc = Number(/const MAX_DOCUMENTS = (\d+);/.exec(nu)[1]);
  const maxImg = Number(/const MAX_IMAGES = (\d+);/.exec(nu)[1]);
  assert.ok(maxDoc <= maxImg, "on accepte désormais plus de PDF que d'images par message");

  // Et il est validé AVANT la réservation des points — en cherchant
  // l'APPEL, pas la définition de la fonction, qui vit plus haut dans le
  // fichier et rendait cette assertion toujours vraie.
  const iValide = nu.indexOf("const documentsValides = validerDocuments(documents);");
  const iPoints = nu.indexOf("documentsValides.length * POIDS_PAR_DOCUMENT");
  assert.ok(iValide !== -1, "les PDF ne passent plus par validerDocuments avant d'être utilisés");
  assert.ok(iValide < iPoints, "les PDF sont comptés avant d'être validés");

});

test("pdf 3 — un PDF ne réveille pas le garde de longueur du prompt", async () => {

  // Le défaut du 2026-09-19 serait revenu à l'identique, en pire : un PDF
  // pèse plus lourd qu'une capture.
  const base64 = "A".repeat(200000);

  const res = await generate({
    task: "chat",
    input: {
      message: "peux-tu lire mon diplôme ?",
      profile: {},
      history: [],
      attachments: [{ type: "application/pdf", donnees: "data:application/pdf;base64," + base64 }],
      documents: [{ mediaType: "application/pdf", data: base64 }]
    },
    adaptateur: genererViaSimulateur
  });

  assert.equal(typeof res.text, "string");
  assert.ok(res.text.length > 0, "un PDF joint bloque de nouveau la génération");

});

test("pdf 4 — la promesse est écrite, et seulement parce qu'elle est PROUVÉE", () => {

  // CE TEST A REMPLACÉ SON CONTRAIRE. Jusqu'au 2026-09-19 il vérifiait que
  // Fitz NE promettait PAS de lire les PDF — règle posée avec Charles : on
  // n'écrit pas dans l'interface une capacité qu'on n'a pas vue marcher.
  //
  // LA PREUVE : un RCCM scanné envoyé sur le compte angeliquendour30. Fitz
  // en a restitué le nom tel qu'il est IMPRIMÉ sur le document (« Charles
  // Fizgeral Kennedy Ndione », sans le t), l'entreprise, la liste des
  // activités, et l'enregistrement à Mbour le 10/09/2026. Il n'a pas
  // deviné : il a lu les caractères de la page.
  //
  // Ce test garde maintenant l'autre bord : la promesse est tenue par le
  // code, et ce qui n'est PAS prouvé n'est toujours pas promis.
  for (const parcours of ["bourse", "preinscription"]) {

    const { system } = buildPrompt("chat", { message: "x", profile: { parcours }, parcours, history: [] });

    assert.match(system, /tu LIS LES PDF/, `${parcours} : Fitz ne sait plus qu'il lit les PDF`);
    assert.match(system, /même scannés/, `${parcours} : le cas du scan a disparu — c'est pourtant le plus fréquent ici`);

    // Les limites sont dites au modèle : sans elles, il promet à
    // l'étudiant un envoi que le serveur refusera.
    assert.match(system, /Deux PDF au maximum par message, 10 Mo chacun/,
      `${parcours} : Fitz ne connaît plus les limites qu'il doit annoncer`);

    // ET CE QUI N'EST PAS PROUVÉ N'EST PAS PROMIS : Word et Excel
    // n'arrivent toujours pas, décision de Charles (aucun extracteur).
    assert.match(system, /Word ou Excel ne t'arrive pas/,
      `${parcours} : Fitz laisse croire qu'il lit les fichiers Word`);

    // Dire ce que le document EST avant ce qu'il vaut — la règle que
    // l'essai réel a fait apparaître : Fitz a d'abord identifié un RCCM,
    // puis expliqué en quoi ce n'était pas la pièce attendue.
    assert.match(system, /dis ce qu'il EST avant de dire ce qu'il vaut/,
      `${parcours} : Fitz peut de nouveau juger un document sans l'avoir identifié`);

  }

  // L'écran d'accueil l'annonce aussi, et avec le mot qui compte.
  const html = lire("ai-chat.html");
  assert.match(html, /Un document à faire lire/, "l'écran d'accueil ne propose plus les documents");
  assert.match(html, /même scanné/, "l'écran d'accueil ne dit plus que le scan est lu");

});

test("pdf 5 — le plafond des PDF est chiffré, et annoncé avant l'envoi", async () => {

  const serveur = readFileSync(path.join(RACINE, "functions/fitz.js"), "utf8").replace(/\r\n/g, "\n");
  const { MAX_OCTETS_PDF, validateFiles } = await import("../js/ai/attachments.js");

  // RECALIBRÉ sur le premier essai réel : un RCCM scanné refusé par un
  // plafond de 3 Mo, alors qu'une page de PDF coûte ~1,8 F CFA sur Sonnet.
  // Le plafond doit laisser passer un document que personne ne trouverait
  // anormal.
  const maxServeur = Number(/const MAX_OCTETS_DOCUMENT = (\d+) \* 1024 \* 1024;/.exec(serveur)[1]);
  assert.ok(maxServeur >= 10, `le plafond des PDF est redescendu à ${maxServeur} Mo : un scan ordinaire sera refusé`);

  // LE MIROIR CLIENT SUIT LE SERVEUR. S'ils divergent, l'étudiant attend
  // l'envoi pour rien, ou pire : on lui promet un plafond que le serveur
  // refuse.
  assert.equal(MAX_OCTETS_PDF, maxServeur * 1024 * 1024,
    "le plafond annoncé au navigateur ne correspond plus à celui du serveur");

  // Et le refus NOMME la taille : « trop lourd » sans chiffre ne dit pas
  // de combien il faut descendre.
  const gros = { name: "RCCM.pdf", type: "application/pdf", size: 12 * 1024 * 1024 };
  const { rejected } = validateFiles([gros], 0);
  assert.equal(rejected.length, 1, "un PDF au-dessus du plafond n'est plus arrêté avant l'envoi");
  assert.match(rejected[0].reason, /12\.0 Mo/, "le refus ne dit plus combien pèse le fichier");
  assert.match(rejected[0].reason, /10 Mo/, "le refus ne dit plus quel est le plafond");

  // Un PDF ordinaire passe toujours.
  assert.equal(validateFiles([{ name: "diplome.pdf", type: "application/pdf", size: 2 * 1024 * 1024 }], 0).accepted.length, 1);

});
