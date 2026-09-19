/**
 * ============================================================
 * test/ligne-piece.test.mjs — le nom du fichier reste lisible
 * ============================================================
 *
 * DÉFAUT SIGNALÉ PAR CHARLES le 2026-09-19, reproduit en direct sur
 * ai-check.html avec le code et le CSS réellement servis : le nom du
 * fichier ABSENT (pas tronqué — absent, sans même ses trois points) et
 * « 0.64 Mo » coupé sur deux lignes.
 *
 * LA MÉCANIQUE, et c'est elle que ces tests tiennent. `.ai-file-row` est
 * un flex à quatre enfants. L'icône et la croix ne rétrécissent pas. Le
 * <select> n'avait aucune consigne de partage — or un menu déroulant se
 * dimensionne sur son option LA PLUS LONGUE, pas sur celle qu'il affiche.
 * `.ai-file-row-info` (flex:1 ; min-width:0) était donc le seul enfant
 * souple, et encaissait la totalité du manque.
 *
 * Même famille que la pastille de formule du lot PREMIUM 1, en miroir.
 *
 * Fins de ligne : css/ai-suite.css est en CRLF, on normalise à la lecture.
 * ============================================================
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(path.join(RACINE, f), "utf8").replace(/\r\n/g, "\n");

/**
 * TOUTES les déclarations d'un sélecteur, espaces normalisés.
 *
 * Deux pièges payés comptant en écrivant ce fichier : (1) un sélecteur
 * peut être déclaré PLUSIEURS fois (une règle de base puis un ajout plus
 * bas, et la dernière gagne) — ne lire que la première fait échouer le
 * test sur du code correct ; (2) écraser tous les espaces transforme
 * `flex:0 1 auto` en `flex:01auto` et aucune assertion lisible ne matche.
 * On garde donc une espace simple.
 */
function regle(css, selecteur) {
  const blocs = [];
  let i = 0;
  while ((i = css.indexOf(selecteur + "{", i)) !== -1) {
    // Un sélecteur plus long qui se termine pareil (« .a .b » vs « .b »)
    // ne doit pas être confondu avec celui qu'on cherche.
    const avant = css[i - 1];
    if (avant === undefined || /[\s{};,>]/.test(avant)) {
      blocs.push(css.slice(i + selecteur.length + 1, css.indexOf("}", i)));
    }
    i += selecteur.length;
  }
  assert.ok(blocs.length, `règle « ${selecteur} » introuvable`);
  return blocs.join(" ").replace(/\s+/g, " ").trim();
}

test("pièce 1 — le menu déroulant partage la ligne au lieu de la prendre", () => {

  const css = lire("css/ai-suite.css");
  const select = regle(css, ".ai-file-row select");

  // Sans max-width, l'option la plus longue (« Justificatif de
  // financement ») dicte la largeur de toute la ligne, quel que soit ce
  // que le menu affiche.
  assert.match(select, /max-width:\d+%/, "le menu n'a plus de largeur maximale : il reprend toute la ligne");
  assert.match(select, /min-width:0/, "le menu ne peut plus descendre sous sa plus longue option");
  assert.match(select, /flex:0 1 auto/, "le menu ne partage plus la ligne");

});

test("pièce 2 — le nom garde un plancher, et la taille ne se coupe pas en deux", () => {

  const css = lire("css/ai-suite.css");

  // min-width:0 laissait la colonne tomber à zéro : une ellipse a besoin
  // d'un peu de place pour exister. Le plancher est ce qui distingue
  // « relev… » de rien du tout.
  assert.match(regle(css, ".ai-file-row-info"), /min-width:7ch/,
    "la colonne du nom peut de nouveau tomber à zéro pixel");

  // L'ellipse doit rester : le plancher seul ne suffit pas, il faut que
  // le nom trop long se termine par des points plutôt que d'être coupé net.
  assert.match(regle(css, ".ai-file-row-info strong"), /text-overflow:ellipsis/,
    "le nom tronqué ne montre plus ses trois points");

  // « 0.64 Mo » est une seule information : elle ne se plie pas en deux.
  assert.match(regle(css, ".ai-file-row-info span"), /white-space:nowrap/,
    "la taille du fichier peut de nouveau se couper sur deux lignes");

});

test("pièce 3 — sous 420 px la ligne passe à deux rangées au lieu de s'écraser", () => {

  const css = lire("css/ai-suite.css");
  const i = css.indexOf("@media (max-width: 420px){");
  assert.ok(i !== -1, "le repli en deux rangées a disparu");

  const bloc = css.slice(i, css.indexOf("\n}", i));
  assert.match(bloc, /\.ai-file-row\{[^}]*flex-wrap:wrap/, "la ligne ne se replie plus sur un téléphone");
  assert.match(bloc, /\.ai-file-row select\{[^}]*flex:1 1 100%/, "le menu ne prend plus sa propre rangée");
  assert.match(bloc, /\.ai-file-row-remove\{[^}]*order:2/, "la croix passe après le menu : elle n'est plus à portée de pouce");

});
