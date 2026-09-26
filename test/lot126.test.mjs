/**
* LOT 126 (2026-09-26) — LE CATALOGUE PUBLIC NE CHARGE PLUS L'ESPACE
* ÉTUDIANT NI FIREBASE POUR UN VISITEUR JAMAIS CONNECTÉ
*
* Charles : « le chargement des pages doit être rapide, pas lent ».
* Mesuré (réseau 4G lente, première visite, SDK Firebase non comptés) :
* scholarships.html chargeait 364 Ko de JavaScript et 99 fichiers, dont
* toute la coquille de l'espace (js/dual-shell.js → app-shell.js →
* fitz-recours.js → les neuf procédures pays) et, en plus, les SDK
* Firebase (775 Ko bruts chez gstatic) — pour un visiteur qui n'avait
* jamais eu de compte. Après : 112 Ko et 55 fichiers, sans Firebase avant
* l'affichage.
*
* La règle est celle de l'accueil (lot A) : on regarde d'abord si le
* navigateur garde une trace de session (js/session-memorisee.js).
*/
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { grapheDe, entreesDe } from "../scripts/precharger.mjs";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(path.join(RACINE, f), "utf8").replace(/\r\n/g, "\n");
const normal = (t) => t.replace(/\s+/g, " ").trim();

function corpsDeLaPromesse(source) {
  const i = source.indexOf("return new Promise((conclure) => {");
  assert.ok(i > -1, "la recherche de trace a disparu");
  let profondeur = 0;
  for (let j = source.indexOf("{", i); j < source.length; j++) {
    if (source[j] === "{") profondeur++;
    if (source[j] === "}" && --profondeur === 0) return normal(source.slice(i, j + 1));
  }
  throw new Error("promesse non refermée");
}

test("126 — la trace de session se cherche exactement comme sur l'accueil", () => {
  const module = lire("js/session-memorisee.js");
  assert.equal(corpsDeLaPromesse(module), corpsDeLaPromesse(lire("index.html")), "js/session-memorisee.js et index.html ont divergé");
  assert.match(module, /const CLE_SESSION = "firebase:authUser:";/);
  assert.match(module, /demande\.onupgradeneeded = \(\) => demande\.transaction\.abort\(\);/, "la lecture ne doit jamais créer la base");
  // Une seule lecture par page, quel que soit le nombre d'appels.
  assert.match(module, /if \(!enCours\) enCours = lireLaTrace\(\);/);
});

const COQUILLE = { "scholarships.html": "pageMain", "universities.html": "pageMain", "universite.html": "ficheMain", "scholarship-details.html": "detailsMain" };

test("126 — la coquille de l'espace ne part que si une session est mémorisée", () => {
  for (const [page, main] of Object.entries(COQUILLE)) {
    const html = lire(page).replace(/<!--[\s\S]*?-->/g, "");
    assert.ok(!/import \{ applyAuthenticatedShellIfLoggedIn \} from "\.\/js\/dual-shell\.js";/.test(html), `${page} : import statique de dual-shell revenu`);
    const i = html.indexOf('import { sessionMemorisee } from "./js/session-memorisee.js";');
    const j = html.indexOf("if (await sessionMemorisee()) {", i);
    const k = html.indexOf('import("./js/dual-shell.js")', j);
    assert.ok(i > -1 && j > i && k > j, `${page} : la coquille doit attendre la trace de session`);
    assert.ok(html.slice(k, k + 300).includes(`mainId: "${main}"`), `${page} : le bon <main> est toujours déplacé`);
  }
});

test("126 — la pastille admin non plus", () => {
  for (const page of ["scholarships.html", "universities.html", "preinscriptions.html"]) {
    const html = lire(page).replace(/<!--[\s\S]*?-->/g, "");
    assert.ok(!/<script type="module" src="js\/admin-access\.js"><\/script>/.test(html), `${page} : admin-access.js est redevenu un module d'entrée`);
    assert.match(html, /if \(await sessionMemorisee\(\)\)[\s\S]{0,600}import\("\.\/js\/admin-access\.js"\)/, `${page} : la pastille doit rester possible pour un admin connecté`);
  }
});

test("126 — le catalogue des bourses et celui des universités n'embarquent plus Firebase", () => {
  for (const page of ["scholarships.html", "universities.html", "preinscriptions.html"]) {
    const graphe = grapheDe(entreesDe(lire(page), RACINE), RACINE);
    const interdits = graphe.filter((m) => /gstatic\.com|firebase-config\.js|js\/analytics\.js|access-guard\.js|app-shell\.js|dual-shell\.js/.test(m));
    assert.deepEqual(interdits, [], `${page} : ${interdits.join(", ")} dans le chargement de départ`);
  }
  // Le pré-remplissage de la nationalité reste pour un étudiant connecté.
  const js = lire("scholarships.js");
  assert.match(js, /sessionMemorisee\(\)\.then\(async \(memorisee\) => \{\nif \(!memorisee \|\| !nationalityInput\) return;/);
  assert.match(js, /import\("\.\/firebase-config\.js"\)/);
  // Le suivi des universités consultées reste : chargé après l'affichage.
  const uni = lire("universities-page.js");
  assert.match(uni, /if \(!analytique\) analytique = import\("\.\/js\/analytics\.js"\);/);
  assert.match(uni, /trackEvent\("university_viewed", \{/);
});
