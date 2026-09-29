/**
* Lot PERF 3G (2026-09-28) — les icônes servies par le site.
*
* Chaque page chargeait https://unpkg.com/lucide@1.31.0 : toute la
* bibliothèque (~72 Ko compressés), depuis un site tiers, derrière une
* redirection. js/lucide-icones.js ne porte que les icônes que le site
* cite, avec le code de lucide qui les dessine (scripts/icones.mjs).
*
* Ce que ces tests tiennent :
*  1. plus aucune page publiée ne va chercher lucide ailleurs que sur le site ;
*  2. le fichier généré est à jour (une icône ajoutée sans relancer le
*     générateur fait échouer ce test, avec la commande à taper) ;
*  3. toute icône citée par le site y est ;
*  4. RIEN NE CHANGE À L'ÉCRAN : pour chaque icône, le <svg> produit par
*     le fichier local est identique, attribut par attribut, à celui que
*     produit la bibliothèque complète — vérifié sur un DOM factice ;
*  5. le filet : une icône absente fait charger la bibliothèque complète,
*     servie par le site, et rien d'autre.
*
* Preuves par mutation (2026-09-28) : une icône retirée à la main de
* js/lucide-icones.js → tests 2, 3 et 4 rouges ; `"aria-hidden": "true"`
* changé en "false" dans js/lucide-icones.js → tests 2 et 4 rouges.
*/
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import vm from "node:vm";

import { genererIcones, genererComplete, nomsCites, iconesDuPaquet, toPascalCase, fichiersScannes, SORTIE, COMPLETE } from "../scripts/icones.mjs";
import { listerPublies } from "../scripts/hosting-publie.mjs";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(path.join(RACINE, f), "utf8");
const sansCommentaires = (html) => html.replace(/<!--[\s\S]*?-->/g, "");

// ------------------------------------------------------------------
// Un DOM factice, juste ce que lucide touche : createElementNS,
// setAttribute, appendChild, attributes, replaceChild, querySelectorAll.
// ------------------------------------------------------------------
function domFactice() {
  const head = { enfants: [], appendChild(n) { this.enfants.push(n); return n; } };
  class Noeud {
    constructor(tag) { this.tagName = tag; this._attrs = new Map(); this.childNodes = []; this.parentNode = null; }
    setAttribute(n, v) { this._attrs.set(n, String(v)); }
    getAttribute(n) { return this._attrs.has(n) ? this._attrs.get(n) : null; }
    get attributes() { return [...this._attrs].map(([name, value]) => ({ name, value })); }
    appendChild(e) { e.parentNode = this; this.childNodes.push(e); return e; }
    replaceChild(nouveau, ancien) { const i = this.childNodes.indexOf(ancien); this.childNodes[i] = nouveau; nouveau.parentNode = this; ancien.parentNode = null; return ancien; }
    querySelectorAll(sel) {
      const m = /^\[([a-z-]+)\]$/.exec(sel);
      const sortie = [];
      const visiter = (n) => { for (const e of n.childNodes) { if (m && e.getAttribute(m[1]) !== null) sortie.push(e); visiter(e); } };
      visiter(this);
      return sortie;
    }
    get outerHTML() { return `<${this.tagName}>`; }
  }
  const document = {
    head,
    currentScript: { src: "https://fitzuniverse.com/js/lucide-icones.js" },
    createElementNS: (_ns, tag) => new Noeud(tag),
    createElement: (tag) => new Noeud(tag),
    querySelectorAll: (sel) => racine.querySelectorAll(sel)
  };
  const racine = new Noeud("body");
  return { document, racine, Noeud, head };
}

/** Évalue un script de lucide (local ou complet) dans un bac à sable, rend son window.lucide. */
function charger(source, dom, avertissements = []) {
  const window = {};
  // Minuteurs inertes : l'observateur de js/icones.js, recopié en fin de
  // js/lucide-icones.js, en arme un au chargement.
  const ctx = {
    window, self: window, document: dom.document, console: { warn: (m) => avertissements.push(String(m)) },
    location: { hostname: "fitzuniverse.com" }, URL,
    setInterval: () => 0, clearInterval: () => {}, setTimeout: () => 0, clearTimeout: () => {}
  };
  ctx.globalThis = ctx;
  vm.runInNewContext(`${source}\n;this.__lucide = window.lucide || this.lucide;`, ctx);
  return ctx.__lucide;
}

/** Le <svg> rendu, sous une forme comparable. */
function arbre(n) {
  return { tag: n.tagName, attrs: n.attributes.map((a) => `${a.name}=${a.value}`), enfants: n.childNodes.map(arbre) };
}

function dessiner(lucide, dom, noms, attrsParIcone = () => ({})) {
  for (const nom of noms) {
    const i = new dom.Noeud("i");
    i.setAttribute("data-lucide", nom);
    for (const [k, v] of Object.entries(attrsParIcone(nom))) i.setAttribute(k, v);
    dom.racine.appendChild(i);
  }
  lucide.createIcons({ root: dom.racine });
  return dom.racine.childNodes.map(arbre);
}

// ------------------------------------------------------------------

test("icônes locales 1 — aucune page publiée ne charge lucide depuis un autre site", () => {
  const pages = listerPublies(RACINE).filter((f) => f.endsWith(".html"));
  const fautives = pages.filter((f) => /<script[^>]*src="https?:\/\/[^"]*lucide/i.test(sansCommentaires(lire(f))));
  assert.deepEqual(fautives, [], "lucide chargé depuis un CDN");
  const locales = pages.filter((f) => /<script[^>]*src="(\.\.\/)?js\/lucide-icones\.js"/.test(sansCommentaires(lire(f))));
  assert.ok(locales.length >= 50, `${locales.length} pages seulement chargent js/lucide-icones.js`);
});

test("icônes locales 2 — js/lucide-icones.js et la bibliothèque de secours sont à jour", () => {
  // Fins de ligne ramenées à LF des deux côtés : sous Windows, Git écrit
  // ces fichiers générés en CRLF, sans que leur contenu ait changé.
  const lf = (s) => s.replace(/\r\n/g, "\n");
  assert.equal(lf(lire(SORTIE)), lf(genererIcones()), "js/lucide-icones.js est périmé : node scripts/icones.mjs");
  assert.equal(lf(lire(COMPLETE)), lf(genererComplete()), `${COMPLETE} est périmé : node scripts/icones.mjs`);
});

test("icônes locales 3 — toute icône citée par le site est dans le fichier local", () => {
  const dom = domFactice();
  const locales = charger(lire(SORTIE), dom).icons;
  const paquet = iconesDuPaquet();
  const cites = nomsCites();
  assert.ok(cites.size > 150, `${cites.size} noms relevés seulement : le relevé ne voit plus le site`);
  // Le relevé strict (data-lucide littéral, icon: "…", branches d'un
  // data-lucide="${…}") est inclus dans le relevé large : on le refait
  // ici, indépendamment du générateur.
  const stricts = new Set();
  for (const f of fichiersScannes()) {
    const s = lire(f);
    for (const m of s.matchAll(/data-lucide="([a-z0-9-]+)"/g)) stricts.add(m[1]);
    for (const m of s.matchAll(/\bicon:\s*"([a-z0-9-]+)"/g)) stricts.add(m[1]);
    for (const m of s.matchAll(/data-lucide="\$\{([^}]*)\}"/g)) {
      for (const n of m[1].matchAll(/"([a-z0-9-]+)"/g)) stricts.add(n[1]);
    }
    for (const m of s.matchAll(/setAttribute\("data-lucide",\s*"([a-z0-9-]+)"\)|dataset\.lucide\s*=\s*"([a-z0-9-]+)"/g)) stricts.add(m[1] || m[2]);
  }
  const manquantes = [...stricts].filter((n) => paquet[toPascalCase(n)] && !locales[toPascalCase(n)]);
  assert.deepEqual(manquantes, [], "icônes citées absentes du fichier local : node scripts/icones.mjs");
  const absentesDuRelevé = [...cites.keys()].filter((n) => !locales[toPascalCase(n)]);
  assert.deepEqual(absentesDuRelevé, []);
  // Et le fichier reste bien plus petit que la bibliothèque.
  assert.ok(Object.keys(locales).length < Object.keys(paquet).length / 4, "le fichier local porte presque toute la bibliothèque");
});

test("icônes locales 4 — chaque icône est dessinée EXACTEMENT comme par la bibliothèque complète", () => {
  const noms = [...nomsCites().keys()].sort();
  // Les attributs que le site pose réellement sur ses <i> : classe, aria,
  // title, style — ils doivent se retrouver sur le <svg> à l'identique.
  const attrs = (nom) => {
    const h = [...nom].reduce((a, c) => a + c.charCodeAt(0), 0) % 4;
    return [{}, { class: "catalog-search-icon extra" }, { "aria-label": "Libellé", class: "x" }, { title: "Titre", style: "width:14px" }][h];
  };
  const domLocal = domFactice();
  const domComplet = domFactice();
  const avertLocal = [];
  const avertComplet = [];
  const rendusLocaux = dessiner(charger(lire(SORTIE), domLocal, avertLocal), domLocal, noms, attrs);
  const rendusComplets = dessiner(charger(lire("node_modules/lucide/dist/umd/lucide.js"), domComplet, avertComplet), domComplet, noms, attrs);
  assert.equal(rendusLocaux.length, noms.length);
  assert.ok(rendusLocaux.every((r) => r.tag === "svg"), "une icône n'a pas été dessinée");
  assert.deepEqual(rendusLocaux, rendusComplets);
  assert.deepEqual(avertLocal, avertComplet);
  assert.equal(domLocal.head.enfants.length, 0, "aucune icône manquante : la bibliothèque complète n'est pas chargée");
});

test("icônes locales 5 — une icône absente charge la bibliothèque complète du SITE, une seule fois", () => {
  const dom = domFactice();
  const lucide = charger(lire(SORTIE), dom);
  const paquet = iconesDuPaquet();
  const absente = Object.keys(paquet).map((k) => k.replace(/([a-z0-9])([A-Z0-9])/g, "$1-$2").toLowerCase())
    .find((n) => paquet[toPascalCase(n)] && !lucide.icons[toPascalCase(n)]);
  assert.ok(absente, "le paquet devrait avoir des icônes hors du fichier local");
  for (let k = 0; k < 2; k++) {
    const i = new dom.Noeud("i");
    i.setAttribute("data-lucide", absente);
    dom.racine.appendChild(i);
  }
  lucide.createIcons({ root: dom.racine });
  lucide.createIcons({ root: dom.racine });
  assert.equal(dom.head.enfants.length, 1, "la bibliothèque complète doit être demandée une fois");
  assert.equal(dom.head.enfants[0].src, "https://fitzuniverse.com/js/lucide-1.31.0.min.js", "et depuis le site, à côté de js/lucide-icones.js");
  // Ce fichier de secours est bien publié, et c'est la même version.
  assert.ok(listerPublies(RACINE).includes(COMPLETE));
  assert.match(lire(COMPLETE), /^\/\*\*\s*\n\s*\* @license lucide v1\.31\.0/);
});
