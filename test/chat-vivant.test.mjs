/**
 * ============================================================
 * test/chat-vivant.test.mjs — l'écran d'accueil de Fitz agit
 * ============================================================
 *
 * LOT CHAT-VIVANT (2026-09-19). Trois défauts de la même famille que
 * tout ce qui a été trouvé cette semaine : une capacité écrite dans le
 * code, jamais reliée à l'écran.
 *
 *  1. LES CARTES DE SUGGESTION ÉTAIENT MORTES. Vérifié en ligne, dans
 *     un cadre isolé avec un intercepteur d'envoi (aucun appel, aucun
 *     point dépensé) : quatre cartes personnalisées affichées, clic →
 *     saisie vide, aucun envoi. Le binding écoutait les nœuds du repli
 *     HTML ; renderHelpCards() les remplace par des nœuds neufs.
 *
 *  2. L'APERÇU DE CONVERSATION ÉCRASAIT LE TITRE. Le JS pose deux
 *     travées, la feuille les mettait en RANGÉE : titre et dernier
 *     message se partageaient une seule ligne.
 *
 *  3. LA PASTILLE DE PIÈCE JOINTE DÉBORDAIT : 3 lignes, 360px, aucune
 *     largeur maximale — alors que sa jumelle du composer était
 *     protégée depuis toujours.
 *
 * Et deux paragraphes en prose (portail / document) devenus deux
 * boutons qui font ce qu'ils annoncent.
 *
 * Fins de ligne : tout fichier lu ici passe par .replace(/\r\n/g,"\n").
 * ============================================================
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(path.join(RACINE, f), "utf8").replace(/\r\n/g, "\n");

// Le code sans ses commentaires : sans ça, une assertion qui interdit
// `querySelectorAll(".ai-help-card")` tombe sur le commentaire qui
// explique justement pourquoi il n'y en a plus. C'est déjà arrivé.
const codeSeul = (f) => lire(f).replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/[^\n]*$/gm, "");
const htmlSeul = (f) => lire(f).replace(/<!--[\s\S]*?-->/g, "");

/* ---------------------------------------------------------------
   1. Les cartes de suggestion cliquent
   --------------------------------------------------------------- */

test("vivant 1 — plus aucun écouteur posé sur les cartes elles-mêmes", () => {

  const js = codeSeul("ai-chat.js");

  // La preuve par mutation : remettre `document.querySelectorAll(".ai-help-card")`
  // suivi d'un addEventListener fait retomber les cartes personnalisées
  // dans le vide. Ce test l'interdit.
  assert.ok(
    !/querySelectorAll\(["']\.ai-help-card["']\)/.test(js),
    "Les cartes sont reconstruites par renderHelpCards() : un écouteur posé sur les nœuds de départ meurt avec eux."
  );

});

test("vivant 2 — le conteneur des cartes écoute à leur place (délégation)", () => {

  const js = codeSeul("ai-chat.js");

  assert.match(js, /helpCardsEl\?\.addEventListener\("click"/,
    "La délégation doit être posée sur #chatHelpCards, qui lui ne change jamais.");
  assert.match(js, /closest\("\.ai-help-card"\)/,
    "L'écouteur délégué doit remonter du clic jusqu'à la carte.");
  assert.match(js, /form\.requestSubmit\(\)/,
    "Cliquer une carte doit ENVOYER la question, pas seulement l'écrire.");

});

/* ---------------------------------------------------------------
   2. Les deux portes remplacent les deux paragraphes
   --------------------------------------------------------------- */

test("vivant 3 — les deux annonces en prose ont quitté l'écran d'accueil", () => {

  const html = htmlSeul("ai-chat.html");

  assert.ok(!html.includes("Envoyez-moi une photo de l'écran où vous êtes"),
    "Le paragraphe « portail » est remplacé par un bouton.");
  assert.ok(!html.includes("Joignez-le en PDF — diplôme, relevé de notes"),
    "Le paragraphe « document » est remplacé par un bouton.");

});

test("vivant 4 — deux portes, chacune avec la phrase qu'elle écrit", () => {

  const html = lire("ai-chat.html");

  const phrases = [...html.matchAll(/class="ai-capacite"[^>]*data-phrase="([^"]+)"/g)].map((m) => m[1]);

  assert.equal(phrases.length, 2, "Exactement deux portes : le portail et le document.");
  phrases.forEach((phrase) => {
    assert.ok(phrase.trim().length > 30,
      `Une porte doit écrire une VRAIE phrase dans le champ de saisie, pas un mot : « ${phrase} »`);
  });

  assert.ok(html.includes('id="capacitePortail"') && html.includes('id="capaciteDocument"'),
    "Les deux portes restent identifiables.");

});

test("vivant 5 — une porte ouvre vraiment le sélecteur de fichier", () => {

  const js = codeSeul("ai-chat.js");

  const bloc = js.slice(js.indexOf('querySelectorAll(".ai-capacite")'));
  assert.ok(bloc.length > 0, "Les portes doivent être branchées dans ai-chat.js.");

  const corps = bloc.slice(0, 600);
  assert.match(corps, /input\.value = porte\.dataset\.phrase/,
    "La porte écrit sa phrase dans le champ de saisie…");
  assert.match(corps, /fileInput\.click\(\)/,
    "…ET ouvre le sélecteur de fichier. Une carte qui ne fait qu'écrire redevient un paragraphe.");
  assert.ok(!/requestSubmit/.test(corps),
    "Elle n'ENVOIE pas : l'étudiant doit d'abord choisir sa capture.");

});

/* ---------------------------------------------------------------
   3. La pastille de pièce jointe ne déborde plus
   --------------------------------------------------------------- */

test("vivant 6 — le nom du fichier joint est enveloppé, donc coupable", () => {

  const js = lire("ai-chat.js");

  assert.match(js, /class="ai-msg-attachment-name"/,
    "Un nœud de texte nu ne peut pas recevoir text-overflow : il faut une travée.");
  assert.match(js, /class="ai-msg-attachment-file" title="\$\{escapeHtml\(a\.name\)\}"/,
    "Le nom entier doit rester lisible au survol, puisqu'il est coupé à l'écran.");

});

test("vivant 7 — et la feuille le coupe pour de bon", () => {

  const css = lire("css/ai-suite.css");

  const bloc = css.slice(css.indexOf(".ai-msg-attachment-name{"));
  const regle = bloc.slice(0, bloc.indexOf("}"));

  assert.match(regle, /text-overflow:ellipsis/);
  assert.match(regle, /white-space:nowrap/);
  assert.match(regle, /min-width:0/);

  const pastille = css.slice(css.indexOf(".ai-msg-attachment-file{"));
  assert.match(pastille.slice(0, pastille.indexOf("}")), /max-width:100%/,
    "Sans largeur maximale, la coupure ne se déclenche jamais.");

});

/* ---------------------------------------------------------------
   4. L'historique : le titre d'abord, l'aperçu dessous
   --------------------------------------------------------------- */

test("vivant 8 — titre et aperçu ne se partagent plus une ligne", () => {

  const css = lire("css/ai-suite.css");

  const bloc = css.slice(css.indexOf(".ai-chat-history-item-select{"));
  const regle = bloc.slice(0, bloc.indexOf("}"));

  assert.match(regle, /flex-direction:column/,
    "En rangée, le dernier message mangeait la moitié de la largeur du titre.");

  assert.match(css, /\.ai-chat-history-item-preview\{/,
    "L'aperçu existe dans le JS depuis un lot : la feuille doit le connaître.");

});

test("vivant 9 — la conversation ouverte porte un filet, pas un décalage", () => {

  const css = lire("css/ai-suite.css");

  const bloc = css.slice(css.lastIndexOf(".ai-chat-history-item.is-active{"));
  const regle = bloc.slice(0, bloc.indexOf("}"));

  assert.match(regle, /box-shadow:inset 2px 0 0 var\(--amber-500\)/,
    "En ombre intérieure : une bordure décalerait le texte à chaque changement de conversation.");

});

/* ---------------------------------------------------------------
   5. La page de l'équipe : trois faits, plus un paragraphe
   --------------------------------------------------------------- */

test("vivant 10 — le bandeau de trois lignes est devenu trois faits", () => {

  const html = htmlSeul("messages.html");

  assert.ok(!html.includes("messages-page-notice"),
    "Le bandeau replié/déplié disparaît avec le défaut qu'il corrigeait.");

  const faits = [...html.matchAll(/class="messages-fait"/g)];
  assert.equal(faits.length, 3, "Trois faits : qui lit, sous quel délai, où la réponse arrive.");

  assert.match(html, /<strong data-delai-reponse>/,
    "Le délai reste posé par js/delai-reponse.js — une seule source (grille A).");

});

test("vivant 11 — le correctif de repli est parti avec le bandeau", () => {

  const js = codeSeul("js/messages-page.js");

  assert.ok(!js.includes("messages-page-notice"),
    "Plus de bandeau, plus de repli : ce JavaScript n'avait d'autre raison d'être.");
  assert.ok(!js.includes("is-open"),
    "Ni sa classe.");

  // Ce qui DOIT rester : le délai et le montage de la page.
  assert.match(js, /data-delai-reponse/);
  assert.match(js, /initMessagesPage/);

});

test("vivant 12 — l'état vide dit ce qu'on demande ICI, et pas à Fitz", () => {

  const js = lire("js/student-messages.js");

  assert.match(js, /class="messages-vide"/,
    "Un objet, pas un paragraphe gris.");
  assert.match(js, /Fitz n'a pas pu régler/,
    "La page de l'équipe doit se distinguer du chat : sinon l'étudiant écrit au mauvais endroit.");

  // Le glyphe est posé APRÈS le lucide.createIcons() de la page : sans
  // ce rappel, il ne serait jamais dessiné.
  const vide = js.slice(js.indexOf("messages-panel-empty"));
  assert.match(vide.slice(0, 400), /lucide\.createIcons\(\)/,
    "Le fil est rendu en temps réel : il doit redessiner ses icônes lui-même.");

});

test("vivant 13 — la feuille connaît les trois faits et l'état vide", () => {

  const css = lire("dashboard.css");

  // Sur la règle principale, pas sur celle de la requête média : une
  // présence nue passerait avec n'importe laquelle des deux.
  const faits = css.slice(css.indexOf(".messages-faits{"));
  assert.match(faits.slice(0, faits.indexOf("}")), /list-style:none/,
    "C'est une liste : sans ça, les trois faits arrivent avec des puces.");

  assert.match(css, /\.messages-fait\{/);
  assert.match(css, /\.messages-vide\{/);

  // Règle du projet : --amber-700 est la SEULE valeur de l'échelle
  // ambre admise pour du texte ou une icône.
  const glyphe = css.slice(css.indexOf(".messages-fait i,"));
  assert.match(glyphe.slice(0, 260), /color:var\(--amber-700\)/);

  assert.ok(!/^\.messages-page-notice\{/m.test(css),
    "L'ancienne règle ne doit plus exister : deux règles pour une seule boîte, c'est ainsi qu'on oublie laquelle gagne.");

});
