/**
 * Lot R3 (2026-09-17) — « CHAQUE CASE GUIDE L'ÉTUDIANT ».
 *
 * Demande de Charles, mot pour mot : « pas de question complexe, chaque
 * case doit guider l'étudiant ou lui donner un exemple », et « pas de
 * sidebar à l'ancienne ». Ce fichier garde les trois choses qui le
 * rendent vrai, et qu'une prochaine passe pourrait défaire sans le
 * voir :
 *
 *  1. AUCUN CHAMP MUET dans « Mon profil » : tout champ de saisie libre
 *     porte un exemple (placeholder) ou une ligne d'aide. Un champ vide
 *     sans exemple est précisément ce qui fait abandonner un
 *     formulaire de cinquante-six cases ;
 *  2. UN SEUL SYSTÈME de champs guidés — js/champs-guides.js, partagé
 *     par la route et le profil : ni la route ni le profil ne
 *     réimplémentent les pastilles ou la liste filtrée, et les clés
 *     déclarées dans le HTML existent dans les tables ;
 *  3. LA COLONNE COLLANTE A DISPARU : le profil n'a plus de sidebar,
 *     mais garde les identifiants que profile.js pilote (les coches, le
 *     compteur, la ligne d'état).
 *
 * Preuves par mutation faites le 2026-09-17 : `placeholder` retiré de
 * `#city` → test 1 rouge ; une table de 18 pastilles remise dans
 * EXEMPLES → test 2 rouge ; `.profile-nav{position:sticky}` réintroduit
 * dans profile.css → test 3 rouge.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { EXEMPLES, LISTES, SOURCES, htmlChips, htmlSuggest, defautsDesExemples, sansAccent } from "../js/champs-guides.js";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(path.join(RACINE, f), "utf8").replace(/\r\n/g, "\n");
const sansCommentairesHtml = (s) => s.replace(/<!--[\s\S]*?-->/g, "");

/** Les champs de saisie libre d'une page, avec leurs attributs. */
function champsLibres(html) {
  const out = [];
  for (const m of html.matchAll(/<(input|textarea)\b([^>]*)>/g)) {
    const [, balise, attrs] = m;
    if (balise === "input") {
      const type = (attrs.match(/type="([^"]+)"/) || [null, "text"])[1];
      if (!["text", "tel", "email", "number", "url", "search"].includes(type)) continue;
    }
    if (/\breadonly\b/.test(attrs)) continue;
    out.push({ balise, attrs, id: (attrs.match(/id="([^"]+)"/) || [null, ""])[1], fin: m.index + m[0].length });
  }
  return out;
}

test("guidé 1 — dans « Mon profil », aucun champ de saisie n'est laissé muet", () => {
  const html = sansCommentairesHtml(lire("profile.html"));
  const muets = [];
  for (const champ of champsLibres(html)) {
    if (/placeholder="/.test(champ.attrs)) continue;
    // Une ligne d'aide posée juste après le champ compte autant qu'un
    // exemple : « laissez vide si vous ne savez pas » guide aussi.
    if (html.slice(champ.fin, champ.fin + 300).includes('class="field-aide"')) continue;
    muets.push(`#${champ.id || "sans-id"}`);
  }
  assert.deepEqual(muets, [], "ces champs n'ont ni exemple ni aide");
  // Et l'aide existe vraiment en tant que composant, pas en style local.
  assert.match(lire("profile.css"), /\.field-aide\{/);
  // Les libellés qui demandaient de décoder ont été réécrits.
  for (const jargon of ["Classement éventuel", "Matières faibles", "Publications scientifiques", "Budget personnel"]) {
    assert.ok(!html.includes(`>${jargon}<`), `le libellé « ${jargon} » est revenu`);
  }
});

test("guidé 2 — un seul système de champs guidés, et les clés déclarées existent", () => {
  assert.deepEqual(defautsDesExemples(), []);

  // Les pastilles sont des raccourcis : huit au plus (le reste est une
  // liste, et une liste se cherche en tapant).
  for (const [cle, liste] of Object.entries(EXEMPLES)) {
    assert.ok(liste.length <= 8, `${cle} : ${liste.length} pastilles`);
  }
  // Chaque liste longue a sa source, et l'inverse.
  assert.deepEqual(Object.keys(SOURCES).sort(), Object.keys(LISTES).sort());
  for (const [cle, source] of Object.entries(SOURCES)) {
    assert.ok(source().length >= 10, `${cle} : une liste de moins de dix entrées est une table d'exemples`);
  }

  // AUCUN DOMAINE MUET (2026-09-17). Constaté à l'étape 3 en ligne :
  // « licence psy » ne proposait RIEN, alors que la liste des domaines
  // proposait Psychologie depuis le début. Un étudiant qui ne trouve
  // pas son mot croit que sa formation n'existe pas ici.
  //
  // La racine d'un domaine : sa première branche avant le « / », puis
  // ses six premières lettres si c'est un seul mot — « Ingénierie »
  // doit pouvoir être servie par « Diplôme d'ingénieur », et
  // « Biologie » par « BUT Génie biologique ». Un domaine en deux mots
  // (« Sciences politiques ») se cherche en entier : « sciences » seul
  // se satisferait de n'importe quelle licence de sciences.
  //
  // Preuve par mutation (2026-09-17) : « Licence Psychologie » et
  // « Master Psychologie » retirés de LISTES.formation → rouge.
  const racineDomaine = (domaine) => {
    const branche = sansAccent(domaine).split("/")[0].replace(/\(.*/, "").trim();
    return branche.includes(" ") ? branche : branche.slice(0, 6);
  };
  const formations = LISTES.formation.map(sansAccent);
  const muets = LISTES.domaine.filter((d) => !formations.some((f) => f.includes(racineDomaine(d))));
  assert.deepEqual(muets, [], "ces domaines n'ont aucune formation qui les nomme");

  // Le rendu : échappé, et sans rien inventer.
  assert.equal(htmlChips("x", null), "");
  assert.match(htmlChips("desiredField", ["A", "B"]), /^<div class="fitz-chips" data-chips-pour="desiredField">/);
  assert.ok(htmlChips("x", ['<script>"']).includes("&lt;script&gt;&quot;"));
  assert.ok(htmlSuggest('a"b', "<i>", "p", "pays").includes('name="a&quot;b"'));
  assert.equal(sansAccent("Sénégal"), "senegal");
  assert.equal(sansAccent("CÔTE D'IVOIRE"), "cote d'ivoire");

  // LES DEUX PAGES PARTAGENT LE MODULE — aucune copie locale.
  const moteur = lire("espace-preinscription.js");
  const profil = lire("profile.js");
  assert.match(moteur, /from "\.\/js\/champs-guides\.js"/);
  assert.match(profil, /from "\.\/js\/champs-guides\.js"/);
  for (const src of [moteur, profil]) {
    assert.ok(!/function brancherSuggest\(/.test(src), "une copie locale du champ à suggestions est revenue");
    assert.ok(!/class="rt-chips"/.test(src), "une copie locale des pastilles est revenue");
  }
  assert.ok(!/\.rt-chip\{|\.rt-suggest\{/.test(lire("css/route.css")), "css/route.css redéfinit le composant partagé");
  // Le composant vit dans sa feuille, chargée par les deux pages.
  const guide = lire("css/guide.css");
  assert.match(guide, /\.fitz-chips\{[^}]*flex-wrap:nowrap/, "les pastilles doivent tenir sur UNE ligne qui défile");
  for (const page of ["espace-preinscription.html", "profile.html"]) {
    assert.match(sansCommentairesHtml(lire(page)), /<link rel="stylesheet" href="css\/guide\.css">/, page);
  }

  // Les clés déclarées dans le HTML du profil existent.
  const html = sansCommentairesHtml(lire("profile.html"));
  for (const m of html.matchAll(/data-exemples="([^"]+)"/g)) {
    assert.ok(EXEMPLES[m[1]], `data-exemples="${m[1]}" n'a pas de table`);
  }
  // « pays » est fourni par la page (le référentiel du site), les autres
  // par le module.
  for (const m of html.matchAll(/data-suggest="([^"]+)"/g)) {
    assert.ok(SOURCES[m[1]] || m[1] === "pays", `data-suggest="${m[1]}" n'a pas de source`);
  }
  assert.match(profil, /brancherChampsGuides\(document, \{ pays: \(\) => COUNTRY_NAMES \}\)/);
  assert.match(profil, /import \{ COUNTRY_NAMES \} from "\.\/js\/countries\.js"/);
});

test("guidé 3 — la sidebar du profil a disparu, et profile.js pilote toujours la barre pilote", () => {
  const html = sansCommentairesHtml(lire("profile.html"));
  const css = lire("profile.css");

  // Plus de colonne collante, ni en HTML ni en CSS.
  assert.ok(!html.includes('class="profile-nav"'), "la colonne de gauche est revenue");
  assert.ok(!/\.profile-nav\{/.test(css), "profile.css garde la règle de la colonne");
  assert.ok(!/grid-template-columns:240px/.test(css), "la grille à deux colonnes est revenue");

  // La barre pilote existe, collante, et NE PORTE AUCUN enregistrement
  // (décision de Charles, gardée aussi par « contrôles 7 »).
  assert.match(html, /<nav class="profile-pilote" id="profileNav"/);
  assert.match(css, /\.profile-pilote\{[^}]*position:sticky/);
  const pilote = html.slice(html.indexOf('<nav class="profile-pilote"'), html.indexOf("</nav>"));
  assert.ok(!/type="submit"|btn-profile-save/.test(pilote), "le pilote ne doit porter aucun bouton d'enregistrement");

  // Ce que profile.js pilote, sans une ligne de modification.
  assert.ok(pilote.includes('id="navScoreValue"'), "le compteur");
  assert.ok(pilote.includes('id="profileEtat"'), "la ligne d'état");
  const entrees = [...pilote.matchAll(/class="section-nav-item" data-section="(sec-[a-z]+)"/g)].map((m) => m[1]);
  assert.equal(entrees.length, 9, `${entrees.length} entrées de section`);
  assert.equal(new Set(entrees).size, 9);
  for (const id of entrees) {
    assert.ok(html.includes(`id="${id}"`), `${id} n'existe pas comme section`);
  }
  const js = lire("profile.js");
  for (const pilotage of ['querySelectorAll(".section-nav-item")', 'getElementById("navScoreValue")', 'getElementById("profileEtat")']) {
    assert.ok(js.includes(pilotage), `profile.js ne pilote plus ${pilotage}`);
  }
  // L'ancre d'une section s'arrête SOUS la barre collante.
  assert.match(css, /scroll-margin-top:calc\(var\(--topbar-height\) \+ 108px\)/);
});
