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
 * DEUX MOTEURS (lot DEUX-MOTEURS, 2026-09-11)
 *
 * Sur iPhone, TOUS les navigateurs sont WebKit (Chrome iOS compris, et
 * les navigateurs intégrés de WhatsApp, Instagram, Facebook). Deux
 * défauts vus sur l'iPhone de Charles n'avaient jamais été vus par ce
 * harnais, qui ne lançait que Chromium. Il lance désormais les deux
 * moteurs (`--moteur=tous`, le défaut) sur le même serveur local, et
 * chaque ligne du rapport est préfixée de son moteur. Une section
 * « Écarts entre moteurs » clôt le rapport.
 *
 * Ce que le WebKit de Playwright sous Windows ne reproduit PAS : le
 * moteur de COMPOSITION de l'iPhone (la façon dont les calques sont
 * peints et empilés par le GPU). Un défaut de composition vu sur iPhone
 * peut donc ne pas apparaître ici ; l'absence ici ne prouve rien.
 * `mesure` repose sur le protocole Chrome (CDP) : Chromium seulement.
 *
 * USAGE
 *
 *   npm run verifier                        tout, sous les deux moteurs
 *   npm run verifier -- --moteur=chromium   un seul moteur (itérations rapides)
 *   npm run verifier -- --moteur=webkit
 *   npm run verifier -- licence-obtenue     un seul profil
 *   npm run verifier -- --montrer           fenêtre visible (débogage)
 *   npm run verifier -- espace              seulement l'espace étudiant (session stubbée)
 *   npm run verifier -- iphone              captures ciblées 375×812 (captures-iphone.mjs)
 *
 * PRÉ-REQUIS, UNE SEULE FOIS :  npx playwright install chromium webkit
 * (toujours AVEC les noms : sans argument, Playwright télécharge aussi
 * Firefox.)
 * ============================================================
 */

import { demarrerServeur } from "./serveur.mjs";
import { couperLeReseau, estBruitConsole } from "./hors-ligne.mjs";
import { jouerQuestionnaire } from "./questionnaire.mjs";
import { verifierPagesCatalogue } from "./pages.mjs";
import { verifierEspaceEtudiant } from "./espace.mjs";
import { verifierControlCenter } from "./control-center.mjs";
// Lot PEIGNE-FIN (2026-09-10) : la mesure de performance sur réseau lent.
import { mesurerPerformance } from "./mesure.mjs";
import { peignerLeSite } from "./peigne.mjs";
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

const MOTEURS = ["chromium", "webkit"];

// Les mots-clés qui ne sont PAS des profils. Un mot absent d'ici est
// pris pour une clé de profil et arrête l'exécution sur « Profil
// inconnu » — c'est voulu, une faute de frappe ne doit pas passer.
const MOTS_CLES = ["espace", "admin", "mesure", "peigne", "iphone"];

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

  // Le bruit de console (« Failed to load resource », doublon d'un 404
  // que l'écouteur de réponses attrape déjà ; l'avertissement WebKit sur
  // la clé viewport Chrome) est filtré par estBruitConsole, une seule
  // liste pour tous les modules — voir hors-ligne.mjs.
  page.on("console", (msg) => {
    if (msg.type() !== "error") return;
    if (estBruitConsole(msg.text())) return;
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

/**
 * Témoin d'émulation (leçon « témoins du harnais » : un contrôle doit
 * prouver qu'il mesure ce qu'il croit mesurer). Tous les contrôles à
 * 375 px supposent que le moteur rend VRAIMENT une fenêtre de 375 px.
 * Un défaut de ce type a existé dans WebKit sous Windows
 * (playwright#33702, corrigé en r2130) ; on vérifie quand même, sous
 * chaque moteur. En échec, les résultats 375 de ce moteur ne valent rien.
 */
async function temoinEmulation({ navigateur, base, moteur }) {
  const anomalies = [];
  const notes = [];
  const contexte = await navigateur.newContext({ viewport: { width: 375, height: 812 }, locale: "fr-FR", isMobile: true, hasTouch: true });
  await couperLeReseau(contexte);
  const page = await contexte.newPage();
  try {
    await page.goto(`${base}/bientot.html`, { waitUntil: "domcontentloaded", timeout: 60000 });
    const lu = await page.evaluate(() => ({ inner: window.innerWidth, client: document.documentElement.clientWidth, dpr: window.devicePixelRatio, touch: navigator.maxTouchPoints, ua: navigator.userAgent }));
    if (lu.inner !== 375 || lu.client !== 375) {
      anomalies.push(`émulation mobile inopérante sous ${moteur} — résultats 375 non valables (innerWidth ${lu.inner}, clientWidth ${lu.client})`);
    } else {
      notes.push(`innerWidth ${lu.inner} = clientWidth ${lu.client} = 375, ${lu.touch} point(s) de toucher, dpr ${lu.dpr} — ${lu.ua.slice(0, 90)}`);
    }
  } catch (e) {
    anomalies.push(`témoin d'émulation impossible sous ${moteur} : ${e.message.split("\n")[0]}`);
  }
  await contexte.close();
  return { anomalies, notes };
}

/**
 * La catégorie d'une anomalie, pour la comparaison entre moteurs.
 * WebKit et Chromium ne formulent pas leurs exceptions de la même façon :
 * on compare « page @vue + catégorie », jamais le texte exact.
 */
export function categoriser(texte) {
  const t = texte.toLowerCase();
  if (/exception|échec :|echec :/.test(t)) return "exception";
  if (/console/.test(t)) return "console";
  if (/fichier absent/.test(t)) return "fichier absent";
  if (/débordement/.test(t)) return "débordement";
  if (/sans nom/.test(t)) return "sans nom";
  if (/rendu vide/.test(t)) return "rendu vide";
  if (/contrôle système/.test(t)) return "contrôle système";
  if (/chevauche|analyse en direct/.test(t)) return "chevauchement";
  if (/ouverture/.test(t)) return "ouverture";
  if (/émulation/.test(t)) return "émulation";
  return "autre";
}

/** La clé de comparaison d'une anomalie : « contrôle · page @vue · catégorie ». */
export function cleEcart(controle, texte) {
  const m = texte.match(/^(\S+(?:\?\S*)?) @(\d+) — /);
  const lieu = m ? `${m[1]} @${m[2]}` : "";
  const cat = categoriser(texte);
  // « autre » n'a pas de catégorie : on garde le texte, sans ses chiffres
  // (une durée, un compte), pour ne pas comparer mot à mot.
  const detail = cat === "autre" ? " · " + texte.replace(/\d+([.,]\d+)?/g, "N").slice(0, 80) : "";
  return `${controle}${lieu ? " · " + lieu : ""} · ${cat}${detail}`;
}

/** Ajoute au tableau `lignes` les blocs d'un contrôle, préfixés du moteur. */
function afficher(prefixe, nom, resultat) {
  console.log(`${prefixe} ${nom.padEnd(20)} ${resultat.anomalies.length ? "ÉCHEC" : "ok"}`);
  for (const note of resultat.notes) console.log(`${prefixe}     · ${note}`);
  for (const anomalie of resultat.anomalies) console.log(`${prefixe}     ✗ ${anomalie}`);
  console.log("");
}

async function passerUnMoteur({ moteur, lanceur, montrer, base, choisis, cles, seuls, dossierIphone }) {

  const prefixe = `[${moteur}]`;
  const navigateur = await lanceur.launch({ headless: !montrer });
  const version = navigateur.version();

  console.log(`${prefixe} ${moteur} ${version}\n`);

  // Le contrôle et ses anomalies, dans l'ordre : c'est la matière de la
  // section « Écarts entre moteurs » et du décompte final.
  const controles = [];
  const noter = (nom, resultat) => { controles.push({ nom, ...resultat }); afficher(prefixe, nom, resultat); };

  const toutSauf = (...exceptions) => !cles.length && !MOTS_CLES.some((m) => seuls[m] && !exceptions.includes(m));

  // 1.3 — le témoin d'émulation, avant tout ce qui se joue à 375 px.
  noter("témoin 375", await temoinEmulation({ navigateur, base, moteur }));

  for (const profil of choisis) {
    noter(profil.cle, await verifierUnProfil({ navigateur, base, profil }));
  }

  // Les pages publiques du catalogue, une fois pour toutes (elles ne
  // dépendent d'aucun profil). Sautées quand un profil précis est
  // demandé en argument : on débogue alors le parcours, pas le
  // catalogue.
  if (toutSauf()) noter("pages catalogue", await verifierPagesCatalogue({ navigateur, base }));

  // L'espace étudiant (dashboard.html, applications.html), session
  // stubbée — voir espace.mjs. Les deux défauts de la passe 1/3 vivaient
  // derrière la connexion, là où ni les profils ni les pages publiques ne
  // regardaient.
  if (toutSauf("espace")) noter("espace étudiant", await verifierEspaceEtudiant({ navigateur, base }));

  // Le Control Center, une session d'administrateur par niveau. La
  // panne du 2026-09-09 vivait ici, derrière une porte que le harnais
  // ne savait franchir que dans le seul rôle où la page marchait.
  if (toutSauf("admin")) noter("control center", await verifierControlCenter({ navigateur, base }));

  // La mesure de performance (lot PEIGNE-FIN) : réseau ralenti, 375 px.
  // Ses chiffres sont le point de départ de toute correction de lenteur.
  // Elle repose sur le protocole Chrome (newCDPSession) : Chromium
  // seulement. Sous WebKit, on le dit en clair — ce n'est pas une erreur.
  if (toutSauf("mesure")) {
    if (moteur === "chromium") noter("mesure (3G rapide)", await mesurerPerformance({ navigateur, base }));
    else noter("mesure (3G rapide)", { anomalies: [], notes: ["mesure : Chromium seulement (CDP)"] });
  }

  // Le peigne fin (lot PEIGNE-FIN) : toutes les pages, 375 et 1280 px.
  if (toutSauf("peigne")) noter("peigne fin", await peignerLeSite({ navigateur, base }));

  // Les captures ciblées de l'iPhone (lot DEUX-MOTEURS) — sur demande
  // seulement : elles laissent passer les polices Google (réseau) et
  // durent ~30 s par moteur.
  if (seuls.iphone) {
    const { capturerIphone } = await import("./captures-iphone.mjs");
    noter("captures iphone", await capturerIphone({ navigateur, base, moteur, dossier: dossierIphone }));
  }

  await navigateur.close();

  return { moteur, version, controles };

}

async function principal() {

  const args = process.argv.slice(2);
  const montrer = args.includes("--montrer");

  // --moteur=chromium|webkit|tous (défaut : tous).
  const optionMoteur = (args.find((a) => a.startsWith("--moteur=")) || "--moteur=tous").slice("--moteur=".length);
  const moteurs = optionMoteur === "tous" ? MOTEURS : [optionMoteur];
  if (!moteurs.every((m) => MOTEURS.includes(m))) {
    console.error(`Moteur inconnu : « ${optionMoteur} ». Disponibles : ${[...MOTEURS, "tous"].join(", ")}`);
    process.exit(2);
  }

  // « espace » n'est pas un profil de questionnaire : c'est le contrôle de
  // l'espace étudiant seul (espace.mjs), pour itérer vite dessus.
  // « admin » : le Control Center seul (control-center.mjs).
  // « mesure » : la performance seule (mesure.mjs). « peigne » : toutes les
  // pages, deux largeurs (peigne.mjs). « iphone » : captures ciblées
  // 375 × 812 sous chaque moteur (captures-iphone.mjs).
  const seuls = Object.fromEntries(MOTS_CLES.map((m) => [m, args.includes(m)]));
  const cles = args.filter((a) => !a.startsWith("--") && !MOTS_CLES.includes(a));
  const unSeul = MOTS_CLES.some((m) => seuls[m]);

  const choisis = cles.length
    ? cles.map((c) => {
        const p = profilParCle(c);
        if (!p) throw new Error(`Profil inconnu : « ${c} ». Disponibles : ${PROFILS.map((x) => x.cle).join(", ")}`);
        return p;
      })
    : (unSeul ? [] : PROFILS);

  let lanceurs;

  try {
    const pw = await import("playwright");
    lanceurs = { chromium: pw.chromium, webkit: pw.webkit };
  } catch {
    console.error("\nPlaywright n'est pas installé. Une seule fois :\n\n  npm install --save-dev playwright\n  npx playwright install chromium webkit\n");
    process.exit(2);
  }

  const serveur = await demarrerServeur({ racine: RACINE });

  const dossierIphone = path.join(RACINE, "scripts", "verifier", "sortie", new Date().toISOString().slice(0, 10));

  console.log(`\nHarnais Fitz — ${choisis.length} profil(s), moteur(s) : ${moteurs.join(" + ")}, site servi sur ${serveur.url}\n`);

  const passes = [];

  for (const moteur of moteurs) {
    try {
      passes.push(await passerUnMoteur({ moteur, lanceur: lanceurs[moteur], montrer, base: serveur.url, choisis, cles, seuls, dossierIphone }));
    } catch (e) {
      // Un moteur qui ne se lance pas (non installé, par exemple) est un
      // échec de CE moteur, pas de tout le harnais : l'autre a tourné.
      console.log(`[${moteur}] ÉCHEC — ${e.message.split("\n")[0]}\n`);
      passes.push({ moteur, version: "?", controles: [{ nom: "lancement", anomalies: [`ÉCHEC : ${e.message.split("\n")[0]}`], notes: [] }] });
    }
  }

  await serveur.arreter();

  // ---- Écarts entre moteurs (1.4) : ce qu'un moteur voit et pas l'autre.
  if (passes.length > 1) {
    console.log("Écarts entre moteurs\n");
    const clesDe = (passe) => new Set(passe.controles.flatMap((c) => c.anomalies.map((a) => cleEcart(c.nom, a))));
    let total = 0;
    for (const passe of passes) {
      const autres = passes.filter((p) => p !== passe);
      const ailleurs = new Set(autres.flatMap((p) => [...clesDe(p)]));
      const propres = [...clesDe(passe)].filter((k) => !ailleurs.has(k));
      total += propres.length;
      console.log(`  ${passe.moteur} seulement : ${propres.length ? "" : "aucune anomalie propre"}`);
      for (const k of propres) console.log(`    ✗ ${k}`);
    }
    if (!total) console.log("  Les deux moteurs voient les mêmes anomalies (par page, vue et catégorie).");
    console.log("");
  }

  // ---- Décompte final, par moteur.
  let totalEchecs = 0;
  for (const passe of passes) {
    const echecs = passe.controles.filter((c) => c.anomalies.length);
    totalEchecs += echecs.length;
    console.log(echecs.length
      ? `[${passe.moteur}] ${echecs.length} contrôle(s) en échec : ${echecs.map((c) => c.nom).join(", ")}`
      : `[${passe.moteur}] ${passe.controles.length} contrôle(s) vérifiés de bout en bout, aucune anomalie.`);
  }
  console.log("");

  process.exit(totalEchecs ? 1 : 0);

}

principal().catch((erreur) => {
  console.error(erreur);
  process.exit(1);
});
