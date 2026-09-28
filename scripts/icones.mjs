// ============================================================
// scripts/icones.mjs — les icônes du site, servies par le site
// ============================================================
//
//     node scripts/icones.mjs          réécrit js/lucide-icones.js et js/lucide-1.31.0.min.js
//     node scripts/icones.mjs --verif  ne touche à rien, dit si c'est périmé
//
// POURQUOI (lot PERF 3G, 2026-09-28)
// Chaque page chargeait https://unpkg.com/lucide@1.31.0 : TOUTE la
// bibliothèque (plus de 1 700 icônes, 417 Ko bruts, ~72 Ko compressés),
// depuis un site tiers, derrière une redirection 302 — deux allers-retours
// vers une origine de plus avant la première icône. Le site en emploie
// environ 240. js/lucide-icones.js n'en porte que celles-là, avec le code
// de lucide 1.31.0 qui les dessine, recopié à l'identique : même
// window.lucide.createIcons(), mêmes <svg>, mêmes classes. Rien ne change
// à l'écran.
//
// QUELLES ICÔNES
// Toute chaîne entre guillemets, dans un fichier .html ou .js PUBLIÉ
// (la liste de scripts/hosting-publie.mjs), qui est un nom d'icône lucide
// (alias compris). C'est volontairement plus large que les seuls
// `data-lucide="…"` : les noms qui arrivent par une table (icon: "…"),
// un ternaire ou un setAttribute sont des chaînes eux aussi. Le prix de
// cette prudence : quelques icônes jamais dessinées (des mots comme
// « type » ou « table » sont aussi des noms d'icônes), soit quelques Ko.
//
// ET SI UNE ICÔNE MANQUE QUAND MÊME ?
// (un nom calculé, ou venu d'une donnée) : js/lucide-icones.js charge
// alors, une fois, la bibliothèque complète — la même version, copiée
// depuis node_modules dans js/lucide-1.31.0.min.js, servie par le site —
// et redessine. L'étudiant voit l'icône ; le site paie ce jour-là ce
// qu'il payait avant. En développement, la console le signale.
//
// test/icones-locales.test.mjs recalcule le fichier : une icône ajoutée
// dans le code sans relancer ce script fait échouer `npm test`, avec la
// commande à taper.
// ============================================================

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

import { listerPublies } from "./hosting-publie.mjs";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export const SORTIE = "js/lucide-icones.js";
export const COMPLETE = "js/lucide-1.31.0.min.js";
const UMD = "node_modules/lucide/dist/umd/lucide.js";
const UMD_MIN = "node_modules/lucide/dist/umd/lucide.min.js";

// Les deux fonctions de nommage de lucide 1.31.0, à l'identique : c'est
// ainsi que createIcons() passe de data-lucide="arrow-left" à ArrowLeft.
const toCamelCase = (s) => s.replace(/^([A-Z])|[\s-_]+(\w)/g, (m, p1, p2) => (p2 ? p2.toUpperCase() : p1.toLowerCase()));
export const toPascalCase = (s) => { const c = toCamelCase(s); return c.charAt(0).toUpperCase() + c.slice(1); };

/** Les icônes du paquet installé (alias compris), telles que le site les recevait d'unpkg. */
export function iconesDuPaquet(racine = RACINE) {
  const src = fs.readFileSync(path.join(racine, UMD), "utf8");
  const ctx = { window: {}, self: {} };
  ctx.globalThis = ctx;
  vm.runInNewContext(`${src}\n;this.__lucide = (typeof lucide !== 'undefined' ? lucide : window.lucide);`, ctx);
  return ctx.__lucide.icons;
}

export function versionDuPaquet(racine = RACINE) {
  return JSON.parse(fs.readFileSync(path.join(racine, "node_modules/lucide/package.json"), "utf8")).version;
}

/** Les fichiers dont on relève les noms : le HTML et le JS publiés, hors fichiers d'icônes eux-mêmes. */
export function fichiersScannes(racine = RACINE) {
  return listerPublies(racine)
    .filter((f) => /\.(html|js)$/.test(f))
    .filter((f) => f !== SORTIE && f !== COMPLETE);
}

/**
 * Tous les noms d'icônes cités en chaîne littérale dans les fichiers
 * publiés. Rend une Map nom → Set(fichiers).
 */
export function nomsCites(racine = RACINE, icones = iconesDuPaquet(racine)) {
  const noms = new Map();
  for (const f of fichiersScannes(racine)) {
    const texte = fs.readFileSync(path.join(racine, f), "utf8");
    for (const m of texte.matchAll(/["'`]([a-z][a-z0-9]*(?:-[a-z0-9]+)*)["'`]/g)) {
      if (!icones[toPascalCase(m[1])]) continue;
      if (!noms.has(m[1])) noms.set(m[1], new Set());
      noms.get(m[1]).add(f);
    }
  }
  return noms;
}

// Un nœud d'icône lucide ([["path", {d: "…"}], …]) en JS compact et
// stable : mêmes données, écrites de la même façon d'une exécution à
// l'autre (diff git propre).
function enJs(noeud) {
  return JSON.stringify(noeud);
}

/** Le contenu attendu de js/lucide-icones.js. */
export function genererIcones(racine = RACINE) {
  const icones = iconesDuPaquet(racine);
  const version = versionDuPaquet(racine);
  const noms = [...nomsCites(racine, icones).keys()].sort();

  // Une entrée par clé PascalCase réellement demandée ; un alias et son
  // icône partagent le même tableau (déclaré une fois).
  const cles = [...new Set(noms.map(toPascalCase))].sort();
  const parNoeud = new Map();
  const lignes = [];
  for (const cle of cles) {
    const noeud = icones[cle];
    const texte = enJs(noeud);
    if (parNoeud.has(texte)) lignes.push(`I.${cle} = I.${parNoeud.get(texte)};`);
    else { parNoeud.set(texte, cle); lignes.push(`I.${cle} = ${texte};`); }
  }

  return `/**
 * @license lucide v${version} - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
// ============================================================
// js/lucide-icones.js — GÉNÉRÉ par scripts/icones.mjs, ne pas modifier
// à la main (node scripts/icones.mjs après avoir ajouté une icône).
//
// Les ${noms.length} icônes que le site cite, sur les ${Object.keys(icones).length} noms de
// lucide ${version}, et le code de lucide qui les dessine, recopié à
// l'identique (dist/umd/lucide.js) : window.lucide.createIcons() rend les
// mêmes <svg> qu'avant, quand ce fichier était chargé depuis unpkg.com.
// Une icône absente d'ici fait charger, une fois, la bibliothèque
// complète servie par le site (${COMPLETE}) — voir scripts/icones.mjs.
// ============================================================

(function () {
"use strict";

var I = {};
${lignes.join("\n")}

// ---- lucide ${version}, dist/umd/lucide.js, à l'identique ----

const defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": 2,
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
};

const createSVGElement = ([tag, attrs, children]) => {
  const element = document.createElementNS("http://www.w3.org/2000/svg", tag);
  Object.keys(attrs).forEach((name) => {
    element.setAttribute(name, String(attrs[name]));
  });
  if (children?.length) {
    children.forEach((child) => {
      const childElement = createSVGElement(child);
      element.appendChild(childElement);
    });
  }
  return element;
};
const createElement = (iconNode, customAttrs = {}) => {
  const tag = "svg";
  const attrs = {
    ...defaultAttributes,
    ...customAttrs
  };
  return createSVGElement([tag, attrs, iconNode]);
};

const hasA11yProp = (props) => {
  for (const prop in props) {
    if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
      return true;
    }
  }
  return false;
};

const mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();

const toCamelCase = (string) => string.replace(
  /^([A-Z])|[\\s-_]+(\\w)/g,
  (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase()
);

const toPascalCase = (string) => {
  const camelCase = toCamelCase(string);
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};

const getAttrs = (element) => Array.from(element.attributes).reduce((attrs, attr) => {
  attrs[attr.name] = attr.value;
  return attrs;
}, {});
const getClassNames = (attrs) => {
  if (typeof attrs === "string") return attrs;
  if (!attrs || !attrs.class) return "";
  if (attrs.class && typeof attrs.class === "string") {
    return attrs.class.split(" ");
  }
  if (attrs.class && Array.isArray(attrs.class)) {
    return attrs.class;
  }
  return "";
};
const replaceElement = (element, { nameAttr, icons, attrs }) => {
  const iconName = element.getAttribute(nameAttr);
  if (iconName == null) return;
  const ComponentName = toPascalCase(iconName);
  const iconNode = icons[ComponentName];
  if (!iconNode) {
    // (Ajout FitzUniverse) : absente du jeu local — la bibliothèque
    // complète est chargée et finira le travail, voir plus bas.
    if (icons === I) return manquante(iconName);
    return console.warn(
      \`\${element.outerHTML} icon name was not found in the provided icons object.\`
    );
  }
  const elementAttrs = getAttrs(element);
  const ariaProps = hasA11yProp(elementAttrs) ? {} : { "aria-hidden": "true" };
  const iconAttrs = {
    ...defaultAttributes,
    "data-lucide": iconName,
    ...ariaProps,
    ...attrs,
    ...elementAttrs
  };
  const elementClassNames = getClassNames(elementAttrs);
  const className = getClassNames(attrs);
  const classNames = mergeClasses(
    "lucide",
    \`lucide-\${iconName}\`,
    ...elementClassNames,
    ...className
  );
  if (classNames) {
    Object.assign(iconAttrs, {
      class: classNames
    });
  }
  const svgElement = createElement(iconNode, iconAttrs);
  return element.parentNode?.replaceChild(svgElement, element);
};

const createIcons = ({
  icons = I,
  nameAttr = "data-lucide",
  attrs = {},
  root = document,
  inTemplates
} = {}) => {
  if (!Object.values(icons).length) {
    throw new Error(
      "Please provide an icons object.\\nIf you want to use all the icons you can import it like:\\n \`import { createIcons, icons } from 'lucide';\\nlucide.createIcons({icons});\`"
    );
  }
  if (typeof root === "undefined") {
    throw new Error("\`createIcons()\` only works in a browser environment.");
  }
  const elementsToReplace = Array.from(root.querySelectorAll(\`[\${nameAttr}]\`));
  elementsToReplace.forEach((element) => replaceElement(element, { nameAttr, icons, attrs }));
  if (inTemplates) {
    const templates = Array.from(root.querySelectorAll("template"));
    templates.forEach(
      (template) => createIcons({
        icons,
        nameAttr,
        attrs,
        root: template.content,
        inTemplates
      })
    );
  }
  if (nameAttr === "data-lucide") {
    const deprecatedElements = root.querySelectorAll("[icon-name]");
    if (deprecatedElements.length > 0) {
      console.warn(
        "[Lucide] Some icons were found with the now deprecated icon-name attribute. These will still be replaced for backwards compatibility, but will no longer be supported in v1.0 and you should switch to data-lucide"
      );
      Array.from(deprecatedElements).forEach(
        (element) => replaceElement(element, { nameAttr: "icon-name", icons, attrs })
      );
    }
  }
};

// ---- (Ajout FitzUniverse) le filet : la bibliothèque complète, une fois ----

const SCRIPT = document.currentScript && document.currentScript.src;
let complete = null;

function manquante(nom) {
  try {
    const h = location.hostname;
    if (h === "localhost" || h === "127.0.0.1" || h === "") {
      console.warn(\`[Fitz] icône « \${nom} » absente de ${SORTIE} : bibliothèque complète chargée. Lancer node scripts/icones.mjs.\`);
    }
  } catch (e) { /* rien */ }
  if (complete || !SCRIPT) return;
  complete = document.createElement("script");
  complete.src = new URL("lucide-${version}.min.js", SCRIPT).href;
  // La bibliothèque complète remplace window.lucide : tous les appels
  // suivants passent par elle. On redessine ce qui attendait.
  complete.onload = () => { try { window.lucide.createIcons(); } catch (e) { /* rien */ } };
  document.head.appendChild(complete);
}

window.lucide = { icons: I, createIcons, createElement };

})();
`;
}

/** La copie servie par le site de la bibliothèque complète (le filet). */
export function genererComplete(racine = RACINE) {
  return fs.readFileSync(path.join(racine, UMD_MIN), "utf8").replace(/\n?\/\/# sourceMappingURL=\S+\s*$/, "\n");
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const verif = process.argv.includes("--verif");
  const attendus = [[SORTIE, genererIcones()], [COMPLETE, genererComplete()]];
  let perimes = 0;
  for (const [fichier, contenu] of attendus) {
    const chemin = path.join(RACINE, fichier);
    const actuel = fs.existsSync(chemin) ? fs.readFileSync(chemin, "utf8") : null;
    if (actuel === contenu) continue;
    perimes++;
    if (verif) console.log(`périmé : ${fichier}`);
    else { fs.writeFileSync(chemin, contenu, "utf8"); console.log(`écrit  : ${fichier} (${Math.round(contenu.length / 1024)} Ko)`); }
  }
  console.log(perimes ? `${perimes} fichier(s) ${verif ? "à régénérer : node scripts/icones.mjs" : "mis à jour"}.` : "Icônes à jour.");
  if (verif && perimes) process.exitCode = 1;
}
