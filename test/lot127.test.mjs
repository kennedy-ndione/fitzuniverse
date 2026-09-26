/**
* LOT 127 (2026-09-26) — DEUX RETOURS DE CHARLES, SUR IPHONE
*
* 1. « Formules » côté préinscriptions, sans compte, menait au seul
*    « Diagnostic France » alors que la préinscription est ouverte dans
*    neuf pays. La vue d'offers.html commence désormais par le choix du
*    pays ; les trois cartes se réécrivent pour ce pays depuis
*    offrePourDestination (pricing-plans.js) et le bouton d'achat emporte
*    la destination jusqu'au paiement.
* 2. « Rends la page statique, ça va dans tous les sens » (diagnostic
*    préinscription). Mesuré entre 402 et 430 px pour un compte qui a les
*    deux accompagnements : la barre haute dépassait de 50 à 70 px et la
*    page glissait de côté sous le doigt.
*/
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import vm from "node:vm";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(path.join(RACINE, f), "utf8").replace(/\r\n/g, "\n");

test("127 — la vue préinscriptions commence par le choix du pays", () => {
  const html = lire("offers.html");
  const vue = html.slice(html.indexOf('id="preinscriptions"'), html.indexOf("offer-footnotes"));
  const choix = vue.indexOf('id="destinationChoix"');
  const grille = vue.indexOf('id="preinscriptionGrille"');
  assert.ok(choix > 0 && grille > choix, "le choix du pays précède les cartes");
  assert.match(vue, /<div class="destination-choix-liste" id="destinationChoixListe" role="group"/);
  assert.match(vue, /Vous payez pour <strong>un dossier, dans le pays de votre choix<\/strong>/);
  assert.ok(!/Vous payez pour <strong>un dossier Études en France<\/strong>/.test(vue), "le texte d'entrée ne parle plus de la seule France");
});

test("127 — les cartes se réécrivent pour le pays choisi, et l'achat emporte la destination", () => {
  const js = lire("offers.js");
  assert.match(js, /window\.offrePourDestination\(planId, d\.id\)/);
  assert.match(js, /`diagnostic-pays\.html\?d=\$\{encodeURIComponent\(d\.id\)\}`/);
  assert.match(js, /&destination=\$\{encodeURIComponent\(destination\)\}/);
  assert.match(js, /if \(destination && destination !== "france"\) payload\.destination = destination;/);
  // Les boutons ne sont jamais recréés : ils gardent leurs écouteurs.
  assert.ok(!/\.innerHTML = originaux/.test(js) && !/c\.innerHTML =/.test(js));
  // Sans pays choisi, plus de « Diagnostic France » présenté à tous.
  assert.match(js, /grille\.hidden = true;/);
  // Un pays passé dans l'adresse (pages de destination) est appliqué.
  assert.match(js, /new URLSearchParams\(window\.location\.search\)\.get\("destination"\)/);
});

test("127 — chaque destination a ses trois cartes, au même prix", () => {
  const bac = { window: {}, console };
  bac.window = bac;
  vm.createContext(bac);
  vm.runInContext(readFileSync(path.join(RACINE, "pricing-plans.js"), "utf8"), bac);
  const dest = bac.SCHOLARBRIDGE_DESTINATIONS;
  assert.equal(Object.keys(dest).length, 8, "France + huit pays = neuf");
  for (const [id, d] of Object.entries(dest)) {
    for (const planId of ["dossier-france", "dossier-france-conseiller"]) {
      const o = bac.offrePourDestination(planId, id);
      assert.ok(o.label.includes(d.nom), `${planId} / ${id} : ${o.label}`);
      assert.equal(o.priceFCFA, bac.SCHOLARBRIDGE_PLANS[planId].priceFCFA, `${planId} / ${id} : même prix`);
      assert.ok(o.highlights.length > 0 && o.cta);
    }
  }
});

test("127 — la barre haute de l'espace tient sur un grand iPhone, et la page ne glisse jamais de côté", () => {
  const css = lire("css/journey-shell.css");
  const i = css.indexOf("@media (max-width: 520px){\n.journey-topbar:has(.journey-context)");
  assert.ok(i > 0, "bascule en icônes seules jusqu'à 520 px sur les pages à titre");
  assert.match(css.slice(i, i + 700), /\.journey-topbar:has\(\.journey-context\) \.espace-bascule-libelle\{ display:none; \}/);
  assert.match(css, /html:has\(\.journey-topbar\),\nhtml:has\(\.journey-topbar\) body\{\noverflow-x:clip;\n\}/);
  // Le libellé garde sa règle de base hors @media (test icone-btn 3).
  assert.match(css, /\n\.espace-bascule-libelle\{ display:inline; \}/);
});
