/**
 * Lot R2 (2026-09-17) — LE RETOUR RAMÈNE À L'ÉTAPE, ET LA FORMATION A
 * SON PROPRE CHAMP.
 *
 * Trois choses à garder après la refonte de l'espace préinscription :
 *
 *  1. plus aucune page de l'espace ne renvoie l'étudiant sur
 *     l'AIGUILLAGE quand on peut faire mieux : js/back-link.js récrit le
 *     lien vers l'étape mémorisée, sinon vers le hub de l'espace ; et
 *     toute page qui porte un `.back-link` charge bien ce script ;
 *  2. les trois notes qui rendent ça vrai sont écrites aux trois bons
 *     endroits — l'étape par le moteur de la route, le hub par
 *     bootstrapShell, et la note d'étape EFFACÉE en entrant côté bourses
 *     (un client des deux espaces ne se fait pas renvoyer dans l'autre) ;
 *  3. `titreDuVoeu` est le SEUL endroit qui sache où lire la formation
 *     d'un vœu (le champ neuf, puis l'ancien) : les trois outils Fitz et
 *     l'espace admin passent par elle, aucun ne relit `scholarship` à la
 *     main.
 *
 * Preuves par mutation faites le 2026-09-17 : `court` retiré de la note
 * de la route → test 2 rouge ; `sessionStorage.removeItem("fitz_retour")`
 * retiré de dashboard.js → test 2 rouge ; `titreDuVoeu` remplacée par
 * `app.scholarship` dans ai-check.js → test 3 rouge.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { titreDuVoeu } from "../js/parcours.js";
import { ETAPES_ROUTE, TOTAL_ETAPES } from "../js/route-preinscription.js";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(path.join(RACINE, f), "utf8").replace(/\r\n/g, "\n");

// Les pages servies, à la racine et dans admin/ — même périmètre que
// test/liens.test.mjs, sans les dossiers d'outillage.
function pagesServies() {
  const out = [];
  for (const e of readdirSync(RACINE, { withFileTypes: true })) {
    if (e.isFile() && e.name.endsWith(".html")) out.push(e.name);
  }
  for (const e of readdirSync(path.join(RACINE, "admin"), { withFileTypes: true })) {
    if (e.isFile() && e.name.endsWith(".html")) out.push(`admin/${e.name}`);
  }
  return out.sort();
}

test("retour 1 — toute page qui porte un lien de retour charge js/back-link.js", () => {
  const manquantes = [];
  for (const page of pagesServies()) {
    const html = lire(page).replace(/<!--[\s\S]*?-->/g, "");
    // La classe EXACTE : login.html porte `.auth-back-link` et
    // admin/login.html `.admin-back-link` — deux composants à eux, dont
    // le lien va vers l'accueil public et n'a rien à récrire.
    if (!/class="(?:[^"]*\s)?back-link(?:\s[^"]*)?"/.test(html)) continue;
    // Le chemin du script dépend du dossier de la page.
    const attendu = page.startsWith("admin/") ? "../js/back-link.js" : "js/back-link.js";
    if (!html.includes(`src="${attendu}"`)) manquantes.push(page);
  }
  assert.deepEqual(manquantes, [], "sans le script, le lien reste fonctionnel mais repasse par l'aiguillage");
});

test("retour 2 — les trois notes : l'étape écrite par la route, le hub par la coquille, l'étape effacée côté bourses", () => {
  // a) LA ROUTE ÉCRIT L'ÉTAPE, à chaque peinture.
  const moteur = lire("espace-preinscription.js");
  assert.match(moteur, /sessionStorage\.setItem\("fitz_retour", JSON\.stringify\(\{/);
  // 2026-09-23 : l'adresse de l'étape porte aussi la destination (?d=).
  assert.match(moteur, /href: adresseRoute\(e\.id\),/);
  assert.match(moteur, /if \(etape\) p\.set\("etape", etape\);/);
  assert.match(moteur, /return `espace-preinscription\.html\$\{q \? `\?\$\{q\}` : ""\}`;/);
  assert.match(moteur, /court: `Étape \$\{e\.numero\}`/, "le libellé court du lien vient de la note");
  const peinture = moteur.indexOf("memoriserRetour(e);");
  assert.ok(peinture > 0 && peinture > moteur.indexOf("function peindreEtape"), "la note s'écrit à la peinture de l'étape");

  // b) LA COQUILLE ÉCRIT LE HUB de l'espace où l'on se trouve.
  const shell = lire("js/app-shell.js");
  assert.match(shell, /sessionStorage\.setItem\("fitz_hub", hub\)/);
  assert.match(shell, /const hub = HUB_ESPACE\[courant\] \|\| HUB_ESPACE\[espaceUtilisateur\] \|\| ""/);

  // c) ENTRER CÔTÉ BOURSES EFFACE L'ÉTAPE.
  const bourse = lire("dashboard.js");
  assert.match(bourse, /sessionStorage\.removeItem\("fitz_retour"\)/, "un client des deux espaces serait renvoyé dans l'autre");

  // d) Le script ne récrit QUE le lien de l'aiguillage, et n'utilise pas
  //    history.back() pour un retour vers une étape (l'URL de la route
  //    est nettoyée après lecture : on perdrait l'étape regardée).
  const back = lire("js/back-link.js");
  assert.match(back, /if \(href !== "dashboard\.html"\) return false;/);
  assert.match(back, /if \(versEtape\) return;/);
  assert.match(back, /link\.dataset\.retour = "etape"/);
  assert.match(back, /link\.dataset\.retour = "hub"/);
  // Aucune note lue sans filet : sessionStorage jette en navigation privée.
  for (const bloc of back.split("function ").slice(1)) {
    if (!bloc.includes("sessionStorage")) continue;
    assert.ok(/try \{/.test(bloc), `une lecture de sessionStorage sans try : ${bloc.slice(0, 40)}`);
  }
  // Le hub accepté est un nom de page, jamais une URL venue d'ailleurs.
  assert.match(back, /\/\^\[a-z0-9-\]\+\\\.html\$\//);

  // e) Le diagnostic, qui s'affiche tout en bas d'une longue page,
  //    propose le retour sous son verdict.
  const diag = lire("js/diagnostic-france-page.js");
  assert.match(diag, /function retourVersLaRoute\(\)/);
  assert.match(diag, /sessionStorage\.getItem\("fitz_retour"\)/);
  assert.ok(diag.indexOf("retourVersLaRoute();") > diag.indexOf("diagnosticFrance: {"), "le retour se propose après l'enregistrement");
});

test("retour 3 — le champ de la formation a UNE seule lecture, partagée", () => {
  // La règle : le champ neuf, puis l'ancien, et le niveau ajouté sans se
  // répéter.
  assert.equal(titreDuVoeu({ formation: "Master Informatique", niveau: "Master 1" }), "Master Informatique (Master 1)");
  assert.equal(titreDuVoeu({ formation: "Master 1 Informatique", niveau: "Master 1" }), "Master 1 Informatique", "le niveau ne se répète pas");
  assert.equal(titreDuVoeu({ formation: "Licence Droit" }), "Licence Droit");
  // Les vœux d'avant le lot R1 rangeaient la formation dans `scholarship`.
  assert.equal(titreDuVoeu({ scholarship: "Licence Économie" }), "Licence Économie");
  assert.equal(titreDuVoeu({ formation: "  ", scholarship: "Bourse Eiffel" }), "Bourse Eiffel");
  // Une bourse : son nom, inchangé.
  assert.equal(titreDuVoeu({ scholarship: "Bourse du gouvernement français" }), "Bourse du gouvernement français");
  assert.equal(titreDuVoeu({}), "");
  assert.equal(titreDuVoeu(null), "");

  // Et personne ne relit `scholarship` à la main là où un vœu peut passer.
  for (const f of ["ai-letter.js", "ai-check.js", "ai-email.js", "admin/student-detail.js"]) {
    const src = lire(f).replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
    assert.match(src, /titreDuVoeu/, `${f} doit passer par titreDuVoeu`);
    const brut = [...src.matchAll(/\b(?:app|application)\.scholarship\b/g)].length;
    // ai-letter garde deux lectures : la phrase « Candidature à la
    // bourse X », écrite aux deux endroits qui pré-remplissent les
    // motivations. Chacune DOIT être gardée par le parcours — c'est le
    // défaut trouvé en écrivant ce test : le second pré-remplissage
    // l'écrivait sur un vœu de préinscription.
    const permis = f === "ai-letter.js" ? 3 : 0;
    assert.ok(brut <= permis, `${f} : ${brut} lecture(s) brute(s) de scholarship (max ${permis})`);
    if (f === "ai-letter.js") {
      // Chaque lecture brute vit DANS une décision de parcours : on
      // regarde les 260 caractères qui la précèdent, pour couvrir aussi
      // bien une garde sur la même ligne qu'un `if` de deux lignes.
      for (const m of src.matchAll(/\b(?:app|application)\.scholarship\b/g)) {
        const avant = src.slice(Math.max(0, m.index - 260), m.index);
        assert.match(avant, /=== "bourse"/, `ai-letter.js : une lecture de scholarship hors d'une décision de parcours (…${avant.slice(-70)})`);
      }
    }
  }
});

test("retour 4 — l'admin lit la route sur le DOSSIER, sans la recalculer", () => {
  const src = lire("admin/student-detail.js");
  assert.match(src, /import \{ ETAPES_ROUTE, TOTAL_ETAPES \} from "\.\.\/js\/route-preinscription\.js"/, "les titres viennent du module de la route, pas d'une liste recopiée");
  assert.match(src, /userData\.dossierFrance/);
  assert.match(src, /function renderDossierFrance\(userData\)/);
  // Rendu APRÈS le chargement des candidatures, dans le même onglet.
  assert.ok(src.indexOf("renderDossierFrance(userData);") > src.indexOf("async function renderCandidatures"));
  // Pas de bloc vide sous un titre prometteur.
  assert.match(src, /section\.hidden = true;/);
  const html = lire("admin/student-detail.html");
  assert.match(html, /id="dossierFranceSection" hidden/);
  for (const id of ["dossierFranceResume", "dossierFranceEtapes"]) {
    assert.ok(html.includes(`id="${id}"`), `${id} manque`);
  }
  // Les étapes citées existent vraiment dans la route.
  assert.equal(ETAPES_ROUTE.length, TOTAL_ETAPES);
  assert.ok(ETAPES_ROUTE.every((e) => e.titre && e.id));
});
