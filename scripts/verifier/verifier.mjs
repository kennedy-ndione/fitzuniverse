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
 *   npm run verifier -- finitions           logo/contenu, profil, messages, pied de page (finitions.mjs)
 *
 * PRÉ-REQUIS, UNE SEULE FOIS :  npx playwright install chromium webkit
 * (toujours AVEC les noms : sans argument, Playwright télécharge aussi
 * Firefox.)
 * ============================================================
 */

import { demarrerServeur } from "./serveur.mjs";
import { couperLeReseau, estBruitConsole, LUCIDE_SERVI, TITRES_LECTURE_FITZ, REFUS_FITZ } from "./hors-ligne.mjs";
import { jouerQuestionnaire } from "./questionnaire.mjs";
import { verifierPagesCatalogue } from "./pages.mjs";
import { verifierEspaceEtudiant } from "./espace.mjs";
import { verifierControlCenter } from "./control-center.mjs";
// Lot PEIGNE-FIN (2026-09-10) : la mesure de performance sur réseau lent.
import { mesurerPerformance } from "./mesure.mjs";
import { peignerLeSite } from "./peigne.mjs";
// Lot FINITIONS-VISUELLES (2026-09-11) : logo / premier contenu, profil,
// messages sur téléphone, pied de page — ce que le peigne ne voyait pas.
import { verifierFinitions } from "./finitions.mjs";
import { PROFILS, profilParCle } from "./profils.mjs";

import path from "node:path";
import { fileURLToPath } from "node:url";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

// L'écran de réflexion dure 6–8 s par construction (PALIER_MS dans
// results.js, réduit le 2026-09-23 ; test/resultats-lecture.test.mjs,
// lecture 6). La marge sert au chargement du catalogue, pas au décor.
const ATTENTE_RESULTATS = 60000;

// L'analyse de Fitz, après les résultats (lot FITZ-CONSOLE, 2026-09-28).
// La lecture doublée s'écrit en quelques millisecondes ; le refus
// arrive après les deux réessais de generate() (0,5 s puis 1 s). Ces
// quinze secondes évitent seulement d'attendre sans fin : un bloc encore
// « en cours » au-delà est un défaut.
const ATTENTE_FITZ = 15000;

// Sous refus, l'échec DOIT être signalé en console (FitzError
// « signalable », js/ai/ai-errors.js) : cette ligne-là, et elle seule.
// Chromium ajoute la pile à la suite : on compare la première ligne.
const LIGNE_REFUS_FITZ = `[Fitz] analyse du diagnostic : FitzError: ${REFUS_FITZ.message}`;

// Les 404 sur ces extensions font ÉCHOUER : une feuille de style ou un
// module manquant casse la page. Les autres (images, polices) sont
// signalés sans faire échouer — dans ce harnais hors ligne, une
// vignette absente ne dit rien sur la logique du site.
const EXTENSIONS_BLOQUANTES = [".js", ".mjs", ".css", ".json", ".html"];

const MOTEURS = ["chromium", "webkit"];

// Les mots-clés qui ne sont PAS des profils. Un mot absent d'ici est
// pris pour une clé de profil et arrête l'exécution sur « Profil
// inconnu » — c'est voulu, une faute de frappe ne doit pas passer.
const MOTS_CLES = ["espace", "admin", "mesure", "peigne", "iphone", "finitions"];

function estBloquante(url) {
  const chemin = new URL(url).pathname.toLowerCase();
  return EXTENSIONS_BLOQUANTES.some((ext) => chemin.endsWith(ext));
}

/**
 * L'analyse de Fitz, une fois FINIE (lot FITZ-CONSOLE, 2026-09-28).
 *
 * results.js la lance sans `await`, en dernier : elle se termine APRÈS
 * l'apparition des résultats. Tant que le harnais relevait la console
 * dès les résultats affichés, une erreur de l'analyse arrivait entre −19
 * et +187 ms autour du relevé. Elle était comptée 6 passes sur 32, selon
 * le moteur et le moment, alors que la page finissait chaque fois dans
 * le même état. On attend donc l'état final du bloc, quel qu'il soit,
 * AVANT le relevé : l'erreur console qui l'accompagne est émise avant
 * lui (même tâche, diagnostic-fitz.js) et arrive donc avant la réponse
 * de cette attente.
 */
async function lireAnalyseFitz(page) {

  const etat = await page.waitForFunction(
    () => {
      const bloc = document.getElementById("fitzAnalysis");
      if (!bloc) return "absent";
      if (bloc.hidden) return "masqué";
      if (bloc.classList.contains("is-ready")) return "affichée";
      if (bloc.classList.contains("is-error")) return "échec affiché";
      return false;
    },
    null,
    { timeout: ATTENTE_FITZ }
  ).then((h) => h.jsonValue()).catch(() => `toujours en cours après ${ATTENTE_FITZ / 1000} s`);

  const vu = await page.evaluate(() => {
    // Visible à l'œil, pas seulement présent : un élément masqué garde
    // son textContent, et un bouton `hidden` existe toujours dans le DOM.
    const visible = (el) => {
      if (!el) return false;
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== "hidden" && (!el.checkVisibility || el.checkVisibility());
    };
    const bloc = document.getElementById("fitzAnalysis");
    const message = bloc?.querySelector(":scope > p");
    return {
      titres: [...(bloc ? bloc.querySelectorAll(".fitz-point") : [])].filter(visible).map((c) => (c.querySelector("h3")?.textContent || "").trim()),
      message: visible(message) ? message.textContent.trim() : "",
      reessayer: visible(bloc?.querySelector("#fitzAnalysisRetry"))
    };
  });

  return { etat, ...vu };

}

// `fitz` : "lecture" (défaut), Fitz écrit la lecture comme le vrai
// serveur ; "refus", il la refuse comme au plafond des sessions anonymes
// (REFUS_FITZ, hors-ligne.mjs).
async function verifierUnProfil({ navigateur, base, profil, fitz = "lecture" }) {

  const contexte = await navigateur.newContext({
    viewport: { width: 390, height: 844 },
    locale: "fr-FR"
  });

  await couperLeReseau(contexte, { fitz });

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

    // Le temps de réflexion est un engagement produit (6–8 s depuis le
    // 2026-09-23, cinq paliers de 1,1 à 1,7 s) : trop court, il n'inspire
    // rien ; trop long, on perd des gens sur un téléphone. On le mesure
    // au lieu de l'espérer.
    if (dureeReflexion < 6000) anomalies.push(`Réflexion trop courte : ${(dureeReflexion / 1000).toFixed(1)} s (cible 6–8 s).`);
    if (dureeReflexion > 15000) anomalies.push(`Réflexion trop longue : ${(dureeReflexion / 1000).toFixed(1)} s (cible 6–8 s).`);

    // ---- 4. Ce que la page affiche vraiment
    const vu = await page.evaluate(() => {

      // Refonte du 2026-09-23 (« la réponse d'abord ») : le nombre de
      // retenues est dans le titre du verdict — « N opportunités
      // correspondent à votre profil » —, plus dans la légende des cartes.
      const nombre = (texte) => {
        const m = (texte || "").match(/^(\d+) opportunités? correspond/i);
        return m ? Number(m[1]) : null;
      };

      const etapes = [...document.querySelectorAll("#reflexionSteps li")];

      return {
        score: Number(document.getElementById("score")?.textContent || "0"),
        palier: document.getElementById("scoreTier")?.textContent?.trim() || "",
        legende: document.getElementById("verdictTitre")?.textContent?.trim() || "",
        retenu: nombre(document.getElementById("verdictTitre")?.textContent?.trim()),
        cartes: document.querySelectorAll("#scholarships .opportunity-card").length,
        // Une raison visible (« Pourquoi vous : »), les autres repliées
        // dans .opportunity-plus (refonte 2026-09-23).
        raisonsVides: [...document.querySelectorAll("#scholarships .opportunity-card")]
          .filter((c) => !(c.querySelector(".opportunity-pourquoi-texte")?.textContent || "").trim()).length,
        decomposition: [...document.querySelectorAll("#scoreBreakdown .score-breakdown-row")].map((l) => ({
          label: l.querySelector(".score-breakdown-label")?.textContent?.trim(),
          pct: l.querySelector(".score-breakdown-pct")?.textContent?.trim()
        })),
        pays: document.querySelectorAll("#countries li").length,
        forces: document.querySelectorAll("#strengths li").length,
        recommandations: document.querySelectorAll("#recommendations li").length,
        etapes: etapes.length,
        etapesInachevees: etapes.filter((li) => !li.classList.contains("is-done")).length,
        // Le récit d'ouverture (#narrativeText) est parti le 2026-09-23 :
        // la phrase du verdict le remplace.
        narratif: (document.getElementById("verdictSous")?.textContent || "").trim().length
      };

    });

    if (vu.score <= 0 || vu.score > 100) anomalies.push(`Score hors bornes : ${vu.score}.`);
    if (!vu.palier) anomalies.push("Aucun palier affiché à côté du score.");
    if (!vu.retenu) anomalies.push(`Le verdict n'annonce aucune opportunité retenue : « ${vu.legende.slice(0, 120)} »`);
    if (vu.cartes !== Math.min(3, vu.retenu || 0)) anomalies.push(`${vu.cartes} carte(s) d'opportunité affichée(s), ${Math.min(3, vu.retenu || 0)} attendue(s).`);
    if (vu.raisonsVides) anomalies.push(`${vu.raisonsVides} carte(s) sans aucune raison « pourquoi cette opportunité vous correspond ».`);
    if (!vu.decomposition.length) anomalies.push("Décomposition du score vide.");
    if (vu.decomposition.some((l) => !l.pct)) anomalies.push("Une ligne de décomposition n'affiche pas de pourcentage.");
    if (!vu.pays) anomalies.push("Aucun pays d'éligibilité affiché.");
    if (!vu.narratif) anomalies.push("La phrase du verdict (#verdictSous) est vide.");
    if (vu.etapes < 5) anomalies.push(`Seulement ${vu.etapes} étapes de réflexion (5 attendues).`);
    if (vu.etapesInachevees) anomalies.push(`${vu.etapesInachevees} étape(s) de réflexion sans coche à la fin.`);

    notes.push(`score ${vu.score} (${vu.palier}) · ${vu.retenu} retenues · ${vu.cartes} cartes · ${vu.decomposition.length} axes · ${vu.pays} pays · réflexion ${(dureeReflexion / 1000).toFixed(1)} s`);

    // ---- 4 bis. L'analyse de Fitz, une fois finie (voir lireAnalyseFitz)
    const analyse = await lireAnalyseFitz(page);

    if (fitz === "refus") {
      // Ce que l'étudiant voit quand la lecture n'arrive pas : le message
      // du serveur, un moyen de relancer, et le reste de la page (vérifié
      // ci-dessus comme pour tout profil).
      if (analyse.etat !== "échec affiché") anomalies.push(`Fitz refusé : l'analyse finit en « ${analyse.etat} » au lieu d'afficher l'échec.`);
      else {
        if (analyse.message !== REFUS_FITZ.message) anomalies.push(`Fitz refusé : ${analyse.message ? `message affiché « ${analyse.message} »` : "aucun message visible"}, attendu celui du serveur, « ${REFUS_FITZ.message} ».`);
        if (!analyse.reessayer) anomalies.push("Fitz refusé : aucun bouton « Réessayer » visible sous l'échec.");
      }
      notes.push(`analyse de Fitz refusée : ${analyse.etat}, « ${analyse.message} »${analyse.reessayer ? ", bouton Réessayer" : ""}`);
    } else {
      if (analyse.etat !== "affichée") anomalies.push(`L'analyse de Fitz finit en « ${analyse.etat} » au lieu de s'afficher${analyse.message ? ` : « ${analyse.message} »` : ""}.`);
      else if (analyse.titres.join(" | ") !== TITRES_LECTURE_FITZ.join(" | ")) {
        anomalies.push(`L'analyse de Fitz ne rend pas ses quatre cartes (${TITRES_LECTURE_FITZ.join(", ")}) : ${analyse.titres.join(", ") || "aucune"}.`);
      }
      notes.push(`analyse de Fitz : ${analyse.etat}, ${analyse.titres.length} carte(s)`);
    }

  } catch (erreur) {

    anomalies.push(`ÉCHEC : ${erreur.message}`);

  }

  // ---- 5. Rien n'a cassé en silence. Le relevé vient APRÈS la fin de
  // l'analyse de Fitz (4 bis) : il ne dépend plus du chronométrage. Sous
  // refus, la ligne qui signale l'échec est attendue une fois, par son
  // texte exact ; toute autre erreur compte, un doublon compris.
  let erreursComptees = erreursConsole;

  if (fitz === "refus") {
    const i = erreursConsole.findIndex((m) => m.split("\n")[0] === LIGNE_REFUS_FITZ);
    if (i < 0) anomalies.push(`Fitz refusé : l'échec n'est pas signalé en console (attendu : « ${LIGNE_REFUS_FITZ} »).`);
    else erreursComptees = erreursConsole.filter((_, j) => j !== i);
  }

  for (const message of erreursPage) anomalies.push(`Exception JavaScript : ${message}`);
  for (const message of erreursComptees) anomalies.push(`Erreur console : ${message}`);

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
 * Témoin lucide (2026-09-28), même leçon. Le peigne juge un bouton à
 * icône sur son <svg> RENDU (contrôle « contenu rendu vide », lot
 * ICONE-BTN) : il suppose le VRAI lucide servi, et qui dessine. Sous la
 * coquille, aucun <i data-lucide> ne devient <svg>, et le peigne sort la
 * même liste de boutons « vides » avec ou sans défaut réel — vu dans un
 * worktree, où le paquet était cherché à un chemin fixe. En échec, ce
 * contrôle du peigne ne vaut rien sous ce moteur. Les messages ne nomment
 * pas le moteur (le préfixe du rapport le fait) : un même échec sous les
 * deux moteurs ne doit pas passer pour un écart entre eux.
 */
async function temoinLucide({ navigateur, base }) {
  const anomalies = [];
  const notes = [];
  if (!LUCIDE_SERVI.reel) {
    anomalies.push(`coquille servie, paquet introuvable (${LUCIDE_SERVI.raison}) : le contrôle « contenu rendu vide » du peigne ne vaut rien`);
    return { anomalies, notes };
  }
  const contexte = await navigateur.newContext({ locale: "fr-FR" });
  const externes = await couperLeReseau(contexte);
  const page = await contexte.newPage();
  try {
    await page.goto(`${base}/login.html`, { waitUntil: "domcontentloaded", timeout: 60000 });
    // js/icones.js convertit dès que lucide est là. Options en 3e
    // paramètre de waitForFunction (voir verifierUnProfil).
    await page.waitForFunction(() => document.querySelector("svg.lucide") && !document.querySelector("i[data-lucide]"), null, { timeout: 10000 }).catch(() => {});
    const lu = await page.evaluate(() => ({
      icones: Object.keys((window.lucide && window.lucide.icons) || {}).length,
      svg: document.querySelectorAll("svg.lucide").length,
      restes: document.querySelectorAll("i[data-lucide]").length
    }));
    const demande = (externes.find((u) => u.includes("unpkg.com/lucide")) || "").match(/lucide@([^/?#]+)/);
    const servi = `lucide ${LUCIDE_SERVI.version}, paquet installé${demande ? ` (le site demande lucide@${demande[1]})` : ""}`;
    if (!lu.svg || lu.restes) anomalies.push(`${servi}, mais ${lu.svg} <svg> dessiné(s) et ${lu.restes} <i data-lucide> resté(s) vide(s) sur login.html`);
    else notes.push(`${servi} : ${lu.icones} icônes, ${lu.svg} <svg> dessinés sur login.html`);
  } catch (e) {
    anomalies.push(`témoin lucide impossible : ${e.message.split("\n")[0]}`);
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

  // Le témoin lucide, avant tout ce qui juge une icône (peigne, finitions).
  noter("témoin lucide", await temoinLucide({ navigateur, base }));

  for (const profil of choisis) {
    noter(profil.cle, await verifierUnProfil({ navigateur, base, profil }));
  }

  // L'autre chemin de l'analyse de Fitz (lot FITZ-CONSOLE), une fois par
  // moteur : le premier profil rejoué, Fitz refusé comme le refuse le
  // vrai serveur au plafond des sessions anonymes. Les profils ci-dessus
  // vérifient la lecture ; celui-ci, ce que l'étudiant voit quand elle
  // n'arrive pas.
  if (choisis.length) noter("analyse Fitz refusée", await verifierUnProfil({ navigateur, base, profil: choisis[0], fitz: "refus" }));

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

  // Les finitions (lot FINITIONS-VISUELLES) : logo / premier contenu à
  // sept tailles, profil sans barre flottante, messages sur téléphone,
  // pied de page sur l'accueil seul.
  if (toutSauf("finitions")) noter("finitions", await verifierFinitions({ navigateur, base }));

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
