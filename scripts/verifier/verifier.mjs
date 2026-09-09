/**
 * ============================================================
 * scripts/verifier/verifier.mjs — le robot navigateur
 * ============================================================
 *
 * POURQUOI CE FICHIER EXISTE
 *
 * `npm test` vérifie des fonctions. Il ne charge aucune page, ne
 * construit aucun DOM, n'exécute aucun module dans un navigateur. Le
 * 2026-09-05, deux pannes sont passées avec 377 tests au vert :
 *
 *   1. `main()` appelé en tête de results.js — zone morte temporelle
 *      sur PALIER_MS, la page restait sur l'écran de chargement ;
 *   2. `eligibleCountries` calculé mais absent de l'objet rendu — même
 *      symptôme, autre cause.
 *
 * Les deux étaient invisibles pour `node --test` et évidentes pour un
 * navigateur. Ce harnais est ce navigateur : il OUVRE les pages,
 * RÉPOND au questionnaire clic par clic, ATTEND les résultats et
 * VÉRIFIE ce qui s'affiche. Il tourne hors ligne (voir hors-ligne.mjs)
 * et ne consomme aucune lecture Firestore.
 *
 * USAGE
 *
 *   npm run verifier                 tous les profils
 *   npm run verifier -- licence-obtenue      un seul
 *   npm run verifier -- --montrer    fenêtre visible (débogage)
 *   npm run verifier -- espace       seulement l'espace étudiant (session stubbée)
 *
 * PRÉ-REQUIS, UNE SEULE FOIS :  npx playwright install chromium
 * ============================================================
 */

import { demarrerServeur } from "./serveur.mjs";
import { couperLeReseau } from "./hors-ligne.mjs";
import { jouerQuestionnaire } from "./questionnaire.mjs";
import { verifierPagesCatalogue } from "./pages.mjs";
import { verifierEspaceEtudiant } from "./espace.mjs";
import { verifierControlCenter } from "./control-center.mjs";
import { PROFILS, profilParCle } from "./profils.mjs";

import path from "node:path";
import { fileURLToPath } from "node:url";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

// L'écran de réflexion dure 12–18 s par construction (PALIER_MS dans
// results.js). La marge sert au chargement du catalogue, pas au décor.
const ATTENTE_RESULTATS = 60000;

// Les 404 sur ces extensions font ÉCHOUER : une feuille de style ou un
// module manquant casse la page. Les autres (images, polices) sont
// signalés sans faire échouer — dans ce harnais hors ligne, une
// vignette absente ne dit rien sur la logique du site.
const EXTENSIONS_BLOQUANTES = [".js", ".mjs", ".css", ".json", ".html"];

function estBloquante(url) {
  const chemin = new URL(url).pathname.toLowerCase();
  return EXTENSIONS_BLOQUANTES.some((ext) => chemin.endsWith(ext));
}

async function verifierUnProfil({ navigateur, base, profil }) {

  const contexte = await navigateur.newContext({
    viewport: { width: 390, height: 844 },
    locale: "fr-FR"
  });

  await couperLeReseau(contexte);

  const page = await contexte.newPage();

  const erreursConsole = [];
  const erreursPage = [];
  const manquants = [];

  // « Failed to load resource » est ignoré ICI : c'est le doublon
  // console d'un 404 que l'écouteur de réponses ci-dessous attrape
  // déjà, avec l'URL. Le garder ferait échouer le harnais pour une
  // vignette absente sans jamais dire laquelle.
  page.on("console", (msg) => {
    if (msg.type() !== "error") return;
    if (/Failed to load resource/i.test(msg.text())) return;
    erreursConsole.push(msg.text());
  });

  page.on("pageerror", (err) => erreursPage.push(err.message));

  page.on("response", (rep) => {
    const url = rep.url();
    if (!url.startsWith(base)) return;
    if (rep.status() >= 400) manquants.push({ url: url.slice(base.length), statut: rep.status() });
  });

  const anomalies = [];
  const notes = [];

  try {

    await page.goto(`${base}/eligibility-questions.html`, { waitUntil: "domcontentloaded" });

    const posees = await jouerQuestionnaire(page, profil);

    notes.push(`${posees.length} questions posées : ${posees.map((q) => q.id).join(", ")}`);

    const jamaisPosees = Object.keys(profil.reponses)
      .filter((cle) => cle !== "averageScale")
      .filter((cle) => !posees.some((q) => q.id === cle));

    if (jamaisPosees.length) {
      notes.push(`Réponses inutilisées (question retirée de la piste ?) : ${jamaisPosees.join(", ")}`);
    }

    // ---- 1. On arrive bien sur les résultats
    await page.waitForURL("**/results.html", { timeout: 10000 });

    // ---- 2. Le profil transmis contient le cycle visé et la piste
    const transmis = await page.evaluate(() => {
      try { return JSON.parse(sessionStorage.getItem("eligibilityResponses") || "null"); }
      catch { return null; }
    });

    if (!transmis) anomalies.push("Aucun profil dans sessionStorage à l'arrivée sur results.html.");
    else {
      if (!transmis.targetLevel) anomalies.push("Le profil transmis n'a pas de `targetLevel`.");
      if (!transmis.piste) anomalies.push("Le profil transmis n'a pas de `piste`.");
    }

    // ---- 3. L'écran de réflexion finit par céder la place
    const debutAttente = Date.now();

    // Le 2e paramètre de waitForFunction est l'ARGUMENT passé à la
    // fonction ; les options viennent en 3e. Passer les options en 2e
    // les rend silencieusement inopérantes — l'attente retombe alors
    // sur les 30 s par défaut, plus courtes que la réflexion elle-même.
    await page.waitForFunction(
      () => {
        const contenu = document.getElementById("resultsContent");
        return contenu && !contenu.hidden;
      },
      null,
      { timeout: ATTENTE_RESULTATS }
    );

    const dureeReflexion = Date.now() - debutAttente;

    const chargementCache = await page.evaluate(() => {
      const el = document.getElementById("resultsLoading");
      return !el || el.hidden;
    });

    if (!chargementCache) anomalies.push("L'écran de chargement est resté affiché sous le contenu.");

    // Le temps de réflexion est un engagement produit (12–18 s) : trop
    // court, il n'inspire rien ; trop long, on perd des gens sur un
    // téléphone. On le mesure au lieu de l'espérer.
    if (dureeReflexion < 10000) anomalies.push(`Réflexion trop courte : ${(dureeReflexion / 1000).toFixed(1)} s (cible 12–18 s).`);
    if (dureeReflexion > 25000) anomalies.push(`Réflexion trop longue : ${(dureeReflexion / 1000).toFixed(1)} s (cible 12–18 s).`);

    // ---- 4. Ce que la page affiche vraiment
    const vu = await page.evaluate(() => {

      const nombre = (texte) => {
        const m = (texte || "").match(/retenu (\d+) opportunit/i);
        return m ? Number(m[1]) : null;
      };

      const etapes = [...document.querySelectorAll("#reflexionSteps li")];

      return {
        score: Number(document.getElementById("score")?.textContent || "0"),
        palier: document.getElementById("scoreTier")?.textContent?.trim() || "",
        legende: document.getElementById("opportunitiesSubtext")?.textContent?.trim() || "",
        retenu: nombre(document.getElementById("opportunitiesSubtext")?.textContent),
        cartes: document.querySelectorAll("#scholarships .opportunity-card").length,
        raisonsVides: [...document.querySelectorAll("#scholarships .opportunity-card")]
          .filter((c) => c.querySelectorAll(".opportunity-reasons li").length === 0).length,
        decomposition: [...document.querySelectorAll("#scoreBreakdown .score-breakdown-row")].map((l) => ({
          label: l.querySelector(".score-breakdown-label")?.textContent?.trim(),
          pct: l.querySelector(".score-breakdown-pct")?.textContent?.trim()
        })),
        pays: document.querySelectorAll("#countries li").length,
        forces: document.querySelectorAll("#strengths li").length,
        recommandations: document.querySelectorAll("#recommendations li").length,
        etapes: etapes.length,
        etapesInachevees: etapes.filter((li) => !li.classList.contains("is-done")).length,
        narratif: (document.getElementById("narrativeText")?.textContent || "").trim().length
      };

    });

    if (vu.score <= 0 || vu.score > 100) anomalies.push(`Score hors bornes : ${vu.score}.`);
    if (!vu.palier) anomalies.push("Aucun palier affiché à côté du score.");
    if (!vu.retenu) anomalies.push(`La légende n'annonce aucune opportunité retenue : « ${vu.legende.slice(0, 120)} »`);
    if (vu.cartes !== Math.min(3, vu.retenu || 0)) anomalies.push(`${vu.cartes} carte(s) d'opportunité affichée(s), ${Math.min(3, vu.retenu || 0)} attendue(s).`);
    if (vu.raisonsVides) anomalies.push(`${vu.raisonsVides} carte(s) sans aucune raison « pourquoi cette opportunité vous correspond ».`);
    if (!vu.decomposition.length) anomalies.push("Décomposition du score vide.");
    if (vu.decomposition.some((l) => !l.pct)) anomalies.push("Une ligne de décomposition n'affiche pas de pourcentage.");
    if (!vu.pays) anomalies.push("Aucun pays d'éligibilité affiché.");
    if (!vu.narratif) anomalies.push("Le paragraphe d'introduction est vide.");
    if (vu.etapes < 6) anomalies.push(`Seulement ${vu.etapes} étapes de réflexion (6 attendues).`);
    if (vu.etapesInachevees) anomalies.push(`${vu.etapesInachevees} étape(s) de réflexion sans coche à la fin.`);

    notes.push(`score ${vu.score} (${vu.palier}) · ${vu.retenu} retenues · ${vu.cartes} cartes · ${vu.decomposition.length} axes · ${vu.pays} pays · réflexion ${(dureeReflexion / 1000).toFixed(1)} s`);

  } catch (erreur) {

    anomalies.push(`ÉCHEC : ${erreur.message}`);

  }

  // ---- 5. Rien n'a cassé en silence
  for (const message of erreursPage) anomalies.push(`Exception JavaScript : ${message}`);
  for (const message of erreursConsole) anomalies.push(`Erreur console : ${message}`);

  const bloquants = manquants.filter((m) => estBloquante(base + m.url));
  const decoratifs = manquants.filter((m) => !estBloquante(base + m.url));

  for (const m of bloquants) anomalies.push(`Fichier absent (${m.statut}) : ${m.url}`);
  if (decoratifs.length) notes.push(`${decoratifs.length} fichier(s) décoratif(s) absent(s) dans ce bac à sable (images, polices) — sans effet sur la logique.`);

  await contexte.close();

  return { profil, anomalies, notes };

}

async function principal() {

  const args = process.argv.slice(2);
  const montrer = args.includes("--montrer");
  // « espace » n'est pas un profil de questionnaire : c'est le contrôle de
  // l'espace étudiant seul (espace.mjs), pour itérer vite dessus.
  const seulEspace = args.includes("espace");
  // « admin » : le Control Center seul — quatre sessions d'administrateur
  // stubbées (voir control-center.mjs).
  const seulAdmin = args.includes("admin");
  const cles = args.filter((a) => !a.startsWith("--") && a !== "espace" && a !== "admin");

  const choisis = cles.length
    ? cles.map((c) => {
        const p = profilParCle(c);
        if (!p) throw new Error(`Profil inconnu : « ${c} ». Disponibles : ${PROFILS.map((x) => x.cle).join(", ")}`);
        return p;
      })
    : (seulEspace || seulAdmin ? [] : PROFILS);

  let chromium;

  try {
    ({ chromium } = await import("playwright"));
  } catch {
    console.error("\nPlaywright n'est pas installé. Une seule fois :\n\n  npm install --save-dev playwright\n  npx playwright install chromium\n");
    process.exit(2);
  }

  const serveur = await demarrerServeur({ racine: RACINE });
  const navigateur = await chromium.launch({ headless: !montrer });

  console.log(`\nHarnais Fitz — ${choisis.length} profil(s), site servi sur ${serveur.url}\n`);

  const resultats = [];

  for (const profil of choisis) {

    process.stdout.write(`  ${profil.cle.padEnd(20)} `);

    const resultat = await verifierUnProfil({ navigateur, base: serveur.url, profil });

    resultats.push(resultat);

    console.log(resultat.anomalies.length ? "ÉCHEC" : "ok");

    for (const note of resultat.notes) console.log(`      · ${note}`);
    for (const anomalie of resultat.anomalies) console.log(`      ✗ ${anomalie}`);

    console.log("");

  }

  // Les pages publiques du catalogue, une fois pour toutes (elles ne
  // dépendent d'aucun profil). Sautées quand un profil précis est
  // demandé en argument : on débogue alors le parcours, pas le
  // catalogue.
  let pages = { anomalies: [], notes: [] };

  if (!cles.length && !seulEspace && !seulAdmin) {

    process.stdout.write(`  ${"pages catalogue".padEnd(20)} `);

    pages = await verifierPagesCatalogue({ navigateur, base: serveur.url });

    console.log(pages.anomalies.length ? "ÉCHEC" : "ok");

    for (const note of pages.notes) console.log(`      · ${note}`);
    for (const anomalie of pages.anomalies) console.log(`      ✗ ${anomalie}`);

    console.log("");

  }

  // L'espace étudiant (dashboard.html, applications.html), session
  // stubbée — voir espace.mjs. Les deux défauts de la passe 1/3 vivaient
  // derrière la connexion, là où ni les profils ni les pages publiques ne
  // regardaient.
  let espace = { anomalies: [], notes: [] };

  if (!cles.length && !seulAdmin) {

    process.stdout.write(`  ${"espace étudiant".padEnd(20)} `);

    espace = await verifierEspaceEtudiant({ navigateur, base: serveur.url });

    console.log(espace.anomalies.length ? "ÉCHEC" : "ok");

    for (const note of espace.notes) console.log(`      · ${note}`);
    for (const anomalie of espace.anomalies) console.log(`      ✗ ${anomalie}`);

    console.log("");

  }

  // Le Control Center, une session d'administrateur par niveau. La
  // panne du 2026-09-09 vivait ici, derrière une porte que le harnais
  // ne savait franchir que dans le seul rôle où la page marchait.
  let centre = { anomalies: [], notes: [] };

  if (!cles.length && !seulEspace) {

    process.stdout.write(`  ${"control center".padEnd(20)} `);

    centre = await verifierControlCenter({ navigateur, base: serveur.url });

    console.log(centre.anomalies.length ? "ÉCHEC" : "ok");

    for (const note of centre.notes) console.log(`      · ${note}`);
    for (const anomalie of centre.anomalies) console.log(`      ✗ ${anomalie}`);

    console.log("");

  }

  await navigateur.close();
  await serveur.arreter();

  const echecs = resultats.filter((r) => r.anomalies.length);

  const totalEchecs = echecs.length + (pages.anomalies.length ? 1 : 0) + (espace.anomalies.length ? 1 : 0) + (centre.anomalies.length ? 1 : 0);

  console.log(totalEchecs
    ? `${totalEchecs} contrôle(s) en échec : ${[...echecs.map((r) => r.profil.cle), ...(pages.anomalies.length ? ["pages catalogue"] : []), ...(espace.anomalies.length ? ["espace étudiant"] : []), ...(centre.anomalies.length ? ["control center"] : [])].join(", ")}\n`
    : `${resultats.length} profil(s) + les pages du catalogue + l'espace étudiant + le Control Center vérifiés de bout en bout, aucune anomalie.\n`);

  process.exit(totalEchecs ? 1 : 0);

}

principal().catch((erreur) => {
  console.error(erreur);
  process.exit(1);
});
