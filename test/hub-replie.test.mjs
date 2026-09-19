/**
 * ============================================================
 * test/hub-replie.test.mjs — le hub bourse applique enfin sa doctrine
 * ============================================================
 *
 * LOT PREMIUM 5 (2026-09-19). Mesuré sur le compte d'une vraie cliente :
 * l'espace bourse déroulait SES SIX PHASES d'affilée, dont quatre en
 * cartes pleines « cette phase s'ouvre avec… » + « Jeter un œil ».
 * L'espace préinscription, lui, ne montre qu'UNE étape à la fois.
 *
 * Or la règle était déjà écrite, en tête de js/revelation.js :
 *
 *   entrouverte  son titre, ce qui vous y attend, et ce qui l'ouvrira.
 *   scellee      son titre et UNE SEULE PHRASE.
 *
 * Elle n'avait jamais atteint la feuille de style : la seule différence
 * entre les deux états était `opacity:.82`. Ces tests tiennent l'écart
 * fermé.
 *
 * Fins de ligne : tout fichier lu ici passe par .replace(/\r\n/g,"\n").
 * ============================================================
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { etatDesPhases } from "../js/journey-map.js";
import { revelerPhases, promesseDePhase, resumeDePhase } from "../js/revelation.js";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(path.join(RACINE, f), "utf8").replace(/\r\n/g, "\n");

// Le code sans ses commentaires — comme « révélation 4 » de
// test/espace-etudiant.test.mjs. Sans ça, une assertion qui cherche
// `.filter(` dans renderRail tombe sur le commentaire qui explique
// justement pourquoi il n'y en a pas. C'est arrivé.
const codeSeul = (f) => lire(f).replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/[^\n]*$/gm, "");

/** Le cas réel du 2026-09-19 : profil très bas, douze cartes de Fitz,
 *  aucune déposée. C'est l'écran qui a déclenché ce lot. */
const CAS_REEL = {
  profileScore: 1.7,
  applications: Array.from({ length: 12 }, (_, i) => ({ id: `slot-${i + 1}`, status: "proposee", etapes: [] })),
  visaChecklist: {},
  espace: "bourse"
};

test("replié 1 — une phase scellée ne montre plus une condition déjà remplie", () => {

  const { phases } = etatDesPhases(CAS_REEL);
  const revelees = revelerPhases(phases);

  const profil = revelees.find((p) => p.id === "profil");
  const opportunites = revelees.find((p) => p.id === "opportunites");
  const dossiers = revelees.find((p) => p.id === "dossiers");

  // L'état de départ, mesuré : le profil est la phase courante, les
  // opportunités sont FAITES (douze cartes existent), et « dossiers »
  // est donc SCELLÉE — pas entrouverte.
  assert.equal(profil.revelation, "ouverte", "le profil n'est plus la phase courante de ce cas");
  assert.equal(opportunites.faite, true, "douze candidatures ne rendent plus la phase 02 faite");
  assert.equal(dossiers.revelation, "scellee", "le cas réel ne produit plus une phase 03 scellée");

  // LE DÉFAUT : la condition d'ouverture de cette phase scellée est
  // « votre première candidature suivie » — et elle est DÉJÀ remplie.
  // La phrase affichée était donc fausse à l'écran.
  assert.match(promesseDePhase("dossiers", "bourse").ouvrePar, /candidature suivie/);
  assert.match(resumeDePhase("opportunites", { candidatures: 12, espace: "bourse" }), /12 candidatures en cours de suivi/);

  // LA PARADE : la feuille de style retire cette ligne des phases
  // scellées — et d'elles seules.
  const css = lire("css/journey.css");
  assert.match(css, /\.jy-phase\.is-scellee \.jy-voile-cle\{\s*display:none;\s*\}/,
    "la condition d'ouverture est de nouveau affichée sur une phase scellée");
  assert.ok(!/^\.jy-voile-cle\{[^}]*display:none/m.test(css),
    "la condition a été masquée partout : la phase entrouverte la perd aussi");
  assert.match(css, /\.jy-phase\.is-scellee\.is-devoilee \.jy-voile-cle\{\s*display:flex;\s*\}/,
    "une phase scellée ouverte à la main ne retrouve plus sa condition");

});

test("replié 2 — scellée ≠ entrouverte par autre chose que l'opacité, et le clavier survit", () => {

  const css = lire("css/journey.css");

  // La phase SUIVANTE garde son voile entier : c'est la seule dont la
  // condition est le vrai prochain obstacle.
  assert.match(css, /\.jy-phase\.is-entrouverte > \.jy-phase-voile\{/,
    "la phase entrouverte n'a plus de traitement à elle");

  // Avant ce lot, la SEULE différence était l'opacité. Le bloc scellé
  // doit porter au moins une règle de mise en page à lui.
  const bloc = css.slice(css.indexOf(".jy-phase.is-scellee > .jy-phase-voile{"));
  const regleScellee = bloc.slice(0, bloc.indexOf("}"));
  assert.match(regleScellee, /padding:/,
    "la phase scellée est redevenue une carte pleine : seule l'opacité la distingue");

  // RIEN N'EST VERROUILLÉ (revelation.js) : le bouton n'est pas supprimé,
  // il est dégradé en lien. Un display:none lui coûterait le clavier.
  assert.match(css, /\.jy-phase\.is-scellee \.jy-voile-btn\{/,
    "le bouton d'une phase scellée n'est plus restylé");
  const blocBtn = css.slice(css.indexOf(".jy-phase.is-scellee .jy-voile-btn{"));
  assert.ok(!/display:\s*none/.test(blocBtn.slice(0, blocBtn.indexOf("}"))),
    "le bouton d'une phase scellée a été masqué : la phase n'est plus ouvrable au clavier");

});

test("replié 3 — la progression se compte, elle ne se pourcente plus", () => {

  const js = lire("dashboard.js");

  assert.ok(!/Parcours accompli à <strong>\$\{progressionPct\} %<\/strong>/.test(js),
    "le hub affiche de nouveau un pourcentage : « 17 % » ne se voit pas bouger");
  assert.match(js, /\$\{faites\} phase\$\{faites > 1 \? "s" : ""\} faite/,
    "le compte des phases faites a disparu de la ligne de progression");
  // Compté avec `reduce`, JAMAIS avec `filter` : « révélation 4 »
  // (test/espace-etudiant.test.mjs) interdit tout `.filter(` dans
  // renderRail pour qu'aucune phase ne puisse disparaître du rail.
  assert.match(js, /const faites = phases\.reduce\(\(n, phase\) => n \+ \(phase\.faite \? 1 : 0\), 0\);/,
    "le compte n'est plus tiré des phases mesurées");
  const nu = codeSeul("dashboard.js");
  const rail = nu.slice(nu.indexOf("function renderRail"), nu.indexOf("function renderRadar"));
  assert.ok(!/\.filter\(/.test(rail),
    "un .filter( est revenu dans renderRail : « révélation 4 » l'interdit");

  // Le chiffre affiché doit être celui des phases RÉELLEMENT faites du
  // cas mesuré — une seule, les opportunités.
  const { phases } = etatDesPhases(CAS_REEL);
  assert.equal(phases.filter((p) => p.faite).length, 1);

});

test("replié 4 — le bandeau e-mail ne prend plus le haut de l'écran", () => {

  const html = lire("espace-bourse.html");

  const iNudge = html.indexOf('id="emailNudge"');
  const iHello = html.indexOf('class="jy-hello"');
  const iAction = html.indexOf('id="jyAction"');
  const iRail = html.indexOf('id="jyRail"');
  const iPhase1 = html.indexOf('id="phase-profil"');

  assert.ok(iNudge !== -1 && iHello !== -1 && iRail !== -1 && iPhase1 !== -1, "la page a changé de structure");

  assert.ok(iNudge > iHello, "le bandeau e-mail repasse avant le nom de l'étudiante");
  assert.ok(iNudge > iAction, "le bandeau e-mail repasse avant sa prochaine action");
  assert.ok(iNudge > iRail, "le bandeau e-mail repasse avant le rail des phases");
  assert.ok(iNudge < iPhase1, "le bandeau e-mail a été relégué après les phases : il ne sera jamais lu");

});
