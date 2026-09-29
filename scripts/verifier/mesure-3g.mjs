// ============================================================
// scripts/verifier/mesure-3g.mjs — le premier chargement, sur 3G
// ============================================================
//
//   node scripts/verifier/mesure-3g.mjs                       mesure le dépôt courant
//   node scripts/verifier/mesure-3g.mjs --racine=<dossier>    mesure un autre arbre (ex. un
//                                                             `git worktree` de main : « avant »)
//   node scripts/verifier/mesure-3g.mjs --miroir=<dossier>    sert unpkg, gstatic et Google Fonts
//                                                             depuis une copie locale (réseau filtré)
//   node scripts/verifier/mesure-3g.mjs --preparer-miroir=<dossier>   fabrique cette copie
//   node scripts/verifier/mesure-3g.mjs --sortie=<fichier.json>       garde les chiffres
//
// POURQUOI (lot PERF 3G, 2026-09-28)
// Mesuré en ligne le 28/09 : scholarships.html faisait 116 requêtes et
// ~725 Ko compressés au premier chargement. Ce script refait la mesure
// en local, À L'IDENTIQUE avant et après un changement, pour que le
// rapport (PERF-2026-10.md) compare deux chiffres obtenus de la même
// façon, et pas un chiffre en ligne à un chiffre local.
//
// CE QUI EST IMITÉ DE LA PRODUCTION
//  - HTTP/2 sur TLS, comme Firebase Hosting (sans cela, le navigateur se
//    limite à 6 connexions par hôte et les 70 modules font la queue : le
//    local serait plus lent que le vrai site, pour une mauvaise raison) ;
//  - la compression brotli des fichiers texte (Hosting sert catalogue.json
//    en brotli : 262 Ko mesurés en ligne pour 2,2 Mo bruts) ;
//  - les en-têtes Cache-Control de firebase.json ;
//  - les CDN externes : unpkg (avec sa redirection 302 vers le fichier
//    réel), gstatic (SDK Firebase 11.10.0), Google Fonts. Avec --miroir,
//    ils sont servis par ce script depuis une copie exacte ; sans, par
//    le vrai réseau.
//  - le réseau : profil « 3G » du protocole Chrome, le même que
//    scripts/verifier/mesure.mjs (1,6 Mbit/s, 300 ms de latence mesurée
//    sur une connexion mobile ouest-africaine).
//
// LES DEUX PROFILS
//  - visiteur : navigateur neuf, aucun cache, aucune session. C'est le
//    « premier chargement » d'un étudiant qui découvre le site.
//  - étudiant : le compte de test de l'ÉMULATEUR Firebase
//    (npm run emulators puis npm run seed:emulator — voir TESTING.md),
//    connecté une fois, puis navigateur neuf AVEC la session : cache HTTP
//    vide, IndexedDB d'authentification conservée. Jamais la production :
//    les pages sont ouvertes sur localhost avec ?useEmulator=1.
//
// CE QUE LE SCRIPT RELÈVE, PAR PAGE
//  requêtes (et combien de JS), octets transférés (en-têtes compris,
//  comme la colonne « Transferred » de DevTools), locaux et externes,
//  URL demandées deux fois, temps jusqu'au contenu utile, erreurs console,
//  puis le débordement horizontal à 360, 390 et 430 px.
// ============================================================

import http2 from "node:http2";
import zlib from "node:zlib";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { chromium } from "playwright";

import { RESEAU_LENT } from "./mesure.mjs";
import { estBruitConsole } from "./hors-ligne.mjs";
import { jouerQuestionnaire } from "./questionnaire.mjs";
import { profilParCle } from "./profils.mjs";
import { listerPublies } from "../hosting-publie.mjs";

const DEPOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

// lucide.min.js, trouvé comme dans hors-ligne.mjs : Node résout le point
// d'entrée du paquet, puis on remonte au dossier dont le package.json porte
// son nom. Un chemin fixe sous la racine ne vaut rien dans un worktree.
function fichierLucideMin() {
  try {
    let d = path.dirname(createRequire(import.meta.url).resolve("lucide"));
    while (d !== path.dirname(d)) {
      const p = path.join(d, "package.json");
      if (fs.existsSync(p) && JSON.parse(fs.readFileSync(p, "utf8")).name === "lucide") return path.join(d, "dist", "umd", "lucide.min.js");
      d = path.dirname(d);
    }
  } catch { /* paquet absent : rien à servir */ }
  return null;
}
const LUCIDE_MIN = fichierLucideMin();

const COMPTE_EMULATEUR = { email: "test.essentiel@scholarbridge.local", motDePasse: "TestEssentiel123!" };

// JAMAIS LA PRODUCTION. Toute page publique charge js/analytics.js une
// fois la page chargée (js/mobile-nav.js), qui ÉCRIT une visite dans
// Firestore. Une mesure qui atteindrait le vrai projet compterait donc
// de faux visiteurs dans le Control Center — c'est arrivé le 2026-09-28,
// lors de la mise au point de ce script. Deux verrous depuis :
//  1. chaque page est ouverte avec ?useEmulator=1 sur localhost : le
//     SDK parle aux émulateurs (firebase-config.js), comme un vrai
//     visiteur parlerait à la production — mêmes requêtes, autre cible ;
//  2. les hôtes ci-dessous ne se résolvent plus dans le navigateur de
//     mesure, et une requête qui les vise fait échouer la mesure.
export const PRODUCTION = [
  "firestore.googleapis.com", "identitytoolkit.googleapis.com", "securetoken.googleapis.com",
  "firebasestorage.googleapis.com", "firebaseinstallations.googleapis.com", "firebaselogging-pa.googleapis.com",
  "content-firebaseappcheck.googleapis.com", "www.googleapis.com", "scholarbridge-e0d84.firebaseapp.com",
  "scholarbridge-e0d84.web.app", "scholarbridge-e0d84-default-rtdb.firebaseio.com",
  "europe-west1-scholarbridge-e0d84.cloudfunctions.net", "us-central1-scholarbridge-e0d84.cloudfunctions.net",
  "fitzuniverse.com", "www.fitzuniverse.com"
];

const surEmulateur = (chemin) => (/[?&]useEmulator=1\b/.test(chemin) ? chemin : `${chemin}${chemin.includes("?") ? "&" : "?"}useEmulator=1`);

// Les pages mesurées. `pret` dit quand le contenu UTILE est là (pas le
// squelette) : c'est le moment que l'étudiant attend.
export const PAGES = [
  { nom: "index.html", chemin: "index.html", profil: "visiteur", pret: () => !!document.querySelector(".hero h1") },
  { nom: "scholarships.html", chemin: "scholarships.html", profil: "visiteur", pret: () => !!document.querySelector(".scholarship-card") },
  { nom: "eligibility-questions.html", chemin: "eligibility-questions.html", profil: "visiteur", pret: () => !!document.querySelector("#question[data-question]") },
  { nom: "results.html", chemin: "results.html", profil: "visiteur", reponses: true, pret: () => { const c = document.getElementById("resultsContent"); return !!c && !c.hidden; } },
  { nom: "espace-bourse.html", chemin: "espace-bourse.html", profil: "etudiant", pret: () => { const h = document.getElementById("welcomeMessage"); return !!h && h.textContent.trim() !== "Bonjour"; } },
  { nom: "scholarships.html (connecté)", chemin: "scholarships.html", profil: "etudiant", pret: () => !!document.querySelector(".scholarship-card") },
  { nom: "scholarship-details.html", chemin: "scholarship-details.html?id=university-of-oxford-oxford__chevening-scholarships", profil: "visiteur", pret: () => { const t = document.querySelector("h1"); return !!t && t.textContent.trim().length > 3 && !/chargement/i.test(t.textContent); } }
];

export const LARGEURS = [360, 390, 430];

// ---------------------------------------------------------------
// Le serveur : le site comme Firebase Hosting, et les CDN du miroir
// ---------------------------------------------------------------

const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8", ".svg": "image/svg+xml", ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp",
  ".avif": "image/avif", ".ico": "image/x-icon", ".woff2": "font/woff2", ".woff": "font/woff"
};

const COMPRESSIBLE = /^(text\/|application\/(json|xml|javascript)|image\/svg\+xml)/;

// Brotli qualité 11 coûte ~2 s sur catalogue.json : compressé une fois
// par contenu, pas une fois par requête.
const dejaCompresse = new Map();
function compresser(corps, encodage, cle) {
  const k = `${encodage}:${cle}:${corps.length}`;
  if (!dejaCompresse.has(k)) {
    dejaCompresse.set(k, encodage === "br"
      ? zlib.brotliCompressSync(corps, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11, [zlib.constants.BROTLI_PARAM_SIZE_HINT]: corps.length } })
      : zlib.gzipSync(corps, { level: 9 }));
  }
  return dejaCompresse.get(k);
}

// Les en-têtes Cache-Control de firebase.json, dans son ordre (le
// dernier motif qui correspond l'emporte, comme sur Hosting).
function enTetesHosting(racine) {
  let regles = [];
  try {
    const config = JSON.parse(fs.readFileSync(path.join(racine, "firebase.json"), "utf8"));
    regles = (config.hosting && config.hosting.headers) || [];
  } catch { regles = []; }
  const versRegex = (motif) => {
    if (motif === "/") return /^\/$/;
    // Jetons provisoires : les remplacements des étoiles ne doivent pas
    // retoucher les « .* » qu'ils viennent d'écrire.
    let re = motif.replace(/[.+^${}()|[\]\\]/g, "\\$&")
      .replace(/@\\\(([^)]*)\\\)/g, (_, alt) => `(${alt.replace(/\\\|/g, "|")})`)
      .replace(/\*\*\//g, "\u0001").replace(/\*\*/g, "\u0002").replace(/\*/g, "[^/]*")
      .replace(/\u0001/g, "(?:.*/)?").replace(/\u0002/g, ".*");
    if (!re.startsWith("/")) re = `/${re}`;
    return new RegExp(`^${re}$`);
  };
  const compilees = regles.map((r) => ({ re: versRegex(r.source), headers: r.headers || [] }));
  return (chemin) => {
    const sortie = {};
    for (const r of compilees) if (r.re.test(chemin)) for (const h of r.headers) sortie[h.key.toLowerCase()] = h.value;
    return sortie;
  };
}

/**
 * Tout ce qu'une page peut demander, compressé AVANT la première mesure.
 * Compressé à la première demande, un gros fichier bloquait le serveur
 * pendant la mesure (catalogue.json : ~2 s en brotli 11) : du temps de
 * serveur local compté comme du réseau, que Hosting ne fait pas payer au
 * visiteur — il sert une copie déjà compressée. Constaté le 2026-09-28 :
 * la fiche bourse mesurée seule ou après d'autres pages donnait 4 s
 * d'écart sur le même arbre.
 * @returns {number} fichiers compressés
 */
export function precompresser(racine, miroir) {
  const fichiers = listerPublies(racine).map((relatif) => path.join(racine, relatif));
  if (LUCIDE_MIN) fichiers.push(LUCIDE_MIN);
  if (miroir) {
    const sdk = path.join(miroir, "firebasejs");
    if (fs.existsSync(sdk)) for (const v of fs.readdirSync(sdk)) for (const f of fs.readdirSync(path.join(sdk, v))) fichiers.push(path.join(sdk, v, f));
    for (const f of ["newsreader-publicsans.css", "inter-sora.css"]) fichiers.push(path.join(miroir, "fonts", f));
  }
  let n = 0;
  for (const fichier of fichiers) {
    const type = TYPES[path.extname(fichier).toLowerCase()] || "application/octet-stream";
    if (!COMPRESSIBLE.test(type) || !fs.existsSync(fichier)) continue;
    compresser(fs.readFileSync(fichier), "br", fichier);
    n += 1;
  }
  return n;
}

function repondreFichier(req, res, fichier, extra = {}) {
  let corps;
  try { corps = fs.readFileSync(fichier); } catch { return repondre(res, 404, "text/plain; charset=utf-8", Buffer.from("Not found")); }
  const type = TYPES[path.extname(fichier).toLowerCase()] || "application/octet-stream";
  const accepte = String(req.headers["accept-encoding"] || "");
  const encodage = COMPRESSIBLE.test(type) ? (/\bbr\b/.test(accepte) ? "br" : /\bgzip\b/.test(accepte) ? "gzip" : null) : null;
  const envoye = encodage ? compresser(corps, encodage, fichier) : corps;
  repondre(res, 200, type, envoye, { ...(encodage ? { "content-encoding": encodage, vary: "Accept-Encoding" } : {}), ...extra });
}

function repondre(res, statut, type, corps, extra = {}) {
  res.writeHead(statut, { "content-type": type, "content-length": corps.length, ...extra });
  res.end(corps);
}

/**
 * Un seul serveur HTTP/2 pour le site (localhost) et les hôtes du miroir :
 * le navigateur y est dirigé par --host-resolver-rules, le nom d'hôte
 * reste celui du CDN (SNI, en-tête :authority).
 */
export async function demarrerServeur({ racine, miroir, cle, cert }) {
  const entetes = enTetesHosting(racine);
  const lucide = LUCIDE_MIN || path.join(DEPOT, "lucide-introuvable");
  const serveur = http2.createSecureServer({ key: cle, cert, allowHTTP1: true }, (req, res) => {
    const hote = String(req.headers[":authority"] || req.headers.host || "").replace(/:\d+$/, "");
    const url = new URL(req.url, `https://${hote}`);
    const chemin = decodeURIComponent(url.pathname);

    if (hote === "localhost" || hote === "127.0.0.1") {
      const relatif = chemin === "/" ? "/index.html" : chemin;
      const fichier = path.join(racine, relatif);
      if (!fichier.startsWith(racine)) return repondre(res, 403, "text/plain", Buffer.from("Forbidden"));
      return repondreFichier(req, res, fichier, entetes(chemin));
    }

    if (!miroir) return repondre(res, 502, "text/plain", Buffer.from("pas de miroir"));
    const cacheCdn = { "cache-control": "public, max-age=31536000", "access-control-allow-origin": "*" };

    if (hote === "unpkg.com") {
      // unpkg redirige l'adresse du paquet vers son fichier « unpkg » :
      // DEUX requêtes en production, deux ici.
      if (/^\/lucide@[^/]+$/.test(chemin)) {
        res.writeHead(302, { location: `${chemin}/dist/umd/lucide.min.js`, "cache-control": "public, max-age=600", "access-control-allow-origin": "*" });
        return res.end();
      }
      if (/^\/lucide@[^/]+\/dist\/umd\/lucide\.min\.js$/.test(chemin)) return repondreFichier(req, res, lucide, cacheCdn);
    }
    if (hote === "www.gstatic.com") {
      const m = chemin.match(/^\/firebasejs\/([^/]+)\/([a-z-]+\.js)$/);
      if (m) return repondreFichier(req, res, path.join(miroir, "firebasejs", m[1], m[2]), cacheCdn);
    }
    if (hote === "fonts.googleapis.com" && chemin === "/css2") {
      const famille = url.searchParams.getAll("family").join("&");
      const fichier = /Newsreader/.test(famille) ? "newsreader-publicsans.css" : /Inter/.test(famille) ? "inter-sora.css" : null;
      if (fichier) return repondreFichier(req, res, path.join(miroir, "fonts", fichier), { "cache-control": "private, max-age=86400", "access-control-allow-origin": "*" });
    }
    if (hote === "fonts.gstatic.com") return repondreFichier(req, res, path.join(miroir, "fonts", "gstatic", chemin), cacheCdn);
    if (hote.endsWith("cloudfunctions.net")) {
      // Les fonctions appelables de production ne connaissent pas le
      // compte de l'émulateur : elles répondraient « non authentifié ».
      const cors = { "access-control-allow-origin": req.headers.origin || "*", "access-control-allow-headers": "authorization, content-type, x-firebase-appcheck, x-firebase-gmpid, x-firebase-client", "access-control-allow-methods": "POST, OPTIONS" };
      if (req.method === "OPTIONS") { res.writeHead(204, cors); return res.end(); }
      return repondre(res, 401, "application/json", Buffer.from(JSON.stringify({ error: { message: "Unauthenticated", status: "UNAUTHENTICATED" } })), cors);
    }
    return repondre(res, 404, "text/plain", Buffer.from(`absent du miroir : ${hote}${chemin}`));
  });
  await new Promise((ok) => serveur.listen(0, "127.0.0.1", ok));
  return { port: serveur.address().port, arreter: () => new Promise((ok) => serveur.close(ok)) };
}

export function certificatAutoSigne(dossier) {
  const cle = path.join(dossier, "cle.pem");
  const cert = path.join(dossier, "cert.pem");
  if (!fs.existsSync(cle) || !fs.existsSync(cert)) {
    execFileSync("openssl", ["req", "-x509", "-newkey", "rsa:2048", "-nodes", "-keyout", cle, "-out", cert, "-days", "30", "-subj", "/CN=localhost",
      "-addext", "subjectAltName=DNS:localhost,DNS:unpkg.com,DNS:www.gstatic.com,DNS:fonts.googleapis.com,DNS:fonts.gstatic.com,DNS:*.cloudfunctions.net,IP:127.0.0.1"], { stdio: "ignore" });
  }
  return { cle: fs.readFileSync(cle), cert: fs.readFileSync(cert) };
}

// ---------------------------------------------------------------
// Le miroir des CDN (une fois, depuis un réseau qui les laisse passer)
// ---------------------------------------------------------------

export async function preparerMiroir(dossier) {
  const UA = "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36";
  fs.mkdirSync(path.join(dossier, "firebasejs", "11.10.0"), { recursive: true });
  // Le SDK tel que gstatic le sert : ce sont les fichiers à la racine du
  // paquet npm `firebase`, même version (registre npm, pas gstatic).
  const tgz = path.join(dossier, "firebase-11.10.0.tgz");
  const rep = await fetch("https://registry.npmjs.org/firebase/-/firebase-11.10.0.tgz");
  fs.writeFileSync(tgz, Buffer.from(await rep.arrayBuffer()));
  const extrait = path.join(dossier, "extrait");
  fs.mkdirSync(extrait, { recursive: true });
  execFileSync("tar", ["xzf", tgz, "-C", extrait]);
  for (const f of ["firebase-app.js", "firebase-auth.js", "firebase-firestore.js", "firebase-storage.js", "firebase-functions.js"]) {
    fs.copyFileSync(path.join(extrait, "package", f), path.join(dossier, "firebasejs", "11.10.0", f));
  }
  fs.mkdirSync(path.join(dossier, "fonts", "gstatic"), { recursive: true });
  const familles = {
    "newsreader-publicsans.css": "https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,500;0,600;0,700;0,800;1,500&family=Public+Sans:wght@400;500;600;700;800&display=swap",
    "inter-sora.css": "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Sora:wght@600;700;800&display=swap"
  };
  for (const [nom, url] of Object.entries(familles)) {
    const css = await (await fetch(url, { headers: { "user-agent": UA } })).text();
    fs.writeFileSync(path.join(dossier, "fonts", nom), css);
    for (const m of css.matchAll(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g)) {
      const cible = path.join(dossier, "fonts", "gstatic", new URL(m[1]).pathname);
      if (fs.existsSync(cible)) continue;
      fs.mkdirSync(path.dirname(cible), { recursive: true });
      fs.writeFileSync(cible, Buffer.from(await (await fetch(m[1])).arrayBuffer()));
    }
  }
  console.log(`Miroir prêt : ${dossier}`);
}

// ---------------------------------------------------------------
// La mesure d'une page
// ---------------------------------------------------------------

async function nouveauContexte(navigateur, { largeur = 390, hauteur = 844, etat = null } = {}) {
  return navigateur.newContext({
    viewport: { width: largeur, height: hauteur }, deviceScaleFactor: 2, isMobile: true, hasTouch: true,
    locale: "fr-FR", ignoreHTTPSErrors: true, ...(etat ? { storageState: etat } : {})
  });
}

async function injecterReponses(contexte, reponses) {
  if (!reponses) return;
  await contexte.addInitScript((json) => {
    try { if (location.pathname.endsWith("/results.html")) sessionStorage.setItem("eligibilityResponses", json); } catch { /* rien */ }
  }, JSON.stringify(reponses));
}

async function mesurerUnePage({ navigateur, base, cible, etat, reponses, redirigesEnLocal = [] }) {
  const contexte = await nouveauContexte(navigateur, { etat: cible.profil === "etudiant" ? etat : null });
  if (cible.reponses) await injecterReponses(contexte, reponses);
  await contexte.addInitScript(() => {
    window.__lcp = 0;
    try {
      new PerformanceObserver((liste) => { for (const e of liste.getEntries()) window.__lcp = Math.round(e.startTime); })
        .observe({ type: "largest-contentful-paint", buffered: true });
    } catch { /* navigateur sans LCP */ }
  });
  const page = await contexte.newPage();
  const cdp = await contexte.newCDPSession(page);
  await cdp.send("Network.enable");
  // --cache-desactive : comme la case « Disable cache » de DevTools, avec
  // laquelle les mesures en ligne sont souvent prises.
  await cdp.send("Network.setCacheDisabled", { cacheDisabled: process.argv.includes("--cache-desactive") });
  await cdp.send("Network.emulateNetworkConditions", RESEAU_LENT);

  const requetes = new Map();
  let derniere = Date.now();
  let saut = 0;
  cdp.on("Network.requestWillBeSent", (e) => {
    const url = e.request.url;
    if (url.startsWith("data:") || url.startsWith("blob:")) return;
    derniere = Date.now();
    if (e.redirectResponse && requetes.has(e.requestId)) {
      const ancienne = requetes.get(e.requestId);
      requetes.set(`${e.requestId}~${saut++}`, { ...ancienne, statut: e.redirectResponse.status, octets: e.redirectResponse.encodedDataLength || 0, fini: true });
    }
    requetes.set(e.requestId, { url, type: e.type || "Other", statut: 0, octets: 0, fini: false, echec: null });
  });
  cdp.on("Network.responseReceived", (e) => {
    const r = requetes.get(e.requestId);
    if (!r) return;
    r.statut = e.response.status;
    r.type = e.type || r.type;
    r.protocole = e.response.protocol;
  });
  cdp.on("Network.loadingFinished", (e) => {
    const r = requetes.get(e.requestId);
    if (r) { r.octets = e.encodedDataLength; r.fini = true; }
  });
  cdp.on("Network.loadingFailed", (e) => {
    const r = requetes.get(e.requestId);
    if (r) { r.echec = e.canceled ? "annulée" : e.errorText; r.fini = true; }
  });

  const erreurs = [];
  page.on("console", (m) => { if (m.type() === "error" && !estBruitConsole(m.text())) erreurs.push(m.text().slice(0, 300)); });
  page.on("pageerror", (e) => erreurs.push(`pageerror: ${e.message.slice(0, 300)}`));

  const debut = Date.now();
  await page.goto(`${base}/${surEmulateur(cible.chemin)}`, { waitUntil: "load", timeout: 120000 });
  let pretMs = null;
  try {
    await page.waitForFunction(cible.pret, null, { timeout: 90000, polling: 50 });
    pretMs = Math.round(await page.evaluate(() => performance.now()));
  } catch { pretMs = null; }

  // Le calme : plus aucune requête depuis 3 s (plafond 45 s). Le canal
  // d'écoute Firestore reste ouvert par construction : on ne l'attend pas.
  while (Date.now() - derniere < 3000 && Date.now() - debut < 45000) await page.waitForTimeout(250);

  const temps = await page.evaluate(() => {
    const nav = performance.getEntriesByType("navigation")[0];
    const fcp = performance.getEntriesByType("paint").find((p) => p.name === "first-contentful-paint");
    return { dcl: nav ? Math.round(nav.domContentLoadedEventEnd) : null, load: nav ? Math.round(nav.loadEventEnd) : null, fcp: fcp ? Math.round(fcp.startTime) : null, lcp: window.__lcp || null };
  });
  await contexte.close();

  const liste = [...requetes.values()];
  const origine = new URL(base).host;
  const estLocale = (u) => { try { return new URL(u).host === origine; } catch { return false; } };
  const somme = (l) => l.reduce((a, r) => a + (r.octets || 0), 0);
  const parType = {};
  for (const r of liste) {
    const t = r.type;
    parType[t] = parType[t] || { n: 0, octets: 0 };
    parType[t].n += 1;
    parType[t].octets += r.octets || 0;
  }
  const vues = new Map();
  for (const r of liste) {
    // Ni les redirections, ni les pré-vols CORS (OPTIONS, type « Preflight ») :
    // un appel à une fonction ou à Auth en émet un avant la vraie requête,
    // à la même adresse — ce n'est pas un doublon.
    if ((r.statut >= 300 && r.statut < 400) || r.type === "Preflight") continue;
    vues.set(r.url, (vues.get(r.url) || 0) + 1);
  }
  const doublons = [...vues.entries()].filter(([, n]) => n > 1).map(([u, n]) => `${u.replace(base, "")} ×${n}`);
  const locales = liste.filter((r) => estLocale(r.url));
  const externes = liste.filter((r) => !estLocale(r.url));
  // D'où viennent les octets : le site (Hosting), les CDN, ou Firebase
  // (l'émulateur tient ici la place de Firestore et d'Auth ; les
  // fonctions appelables, du bouchon local).
  const origineDe = (u) => {
    const x = new URL(u);
    if (x.host === origine) return "site";
    if (x.hostname === "localhost" || x.hostname === "127.0.0.1") return "firebase";
    if (x.hostname.endsWith("cloudfunctions.net")) return "firebase";
    return "cdn";
  };
  const parOrigine = {};
  for (const r of liste) {
    const o = origineDe(r.url);
    parOrigine[o] = parOrigine[o] || { n: 0, octets: 0 };
    parOrigine[o].n += 1;
    parOrigine[o].octets += r.octets || 0;
  }
  return {
    page: cible.nom,
    profil: cible.profil,
    requetes: liste.length,
    js: liste.filter((r) => r.type === "Script").length,
    octets: somme(liste),
    locales: { n: locales.length, octets: somme(locales) },
    externes: { n: externes.length, octets: somme(externes), hotes: [...new Set(externes.map((r) => new URL(r.url).host))] },
    parType,
    parOrigine,
    doublons,
    echecs: liste.filter((r) => r.statut >= 400 || (r.echec && r.echec !== "annulée")).map((r) => `${r.statut || r.echec} ${r.url.replace(base, "")}`),
    // Une requête qui VISE la production, même bloquée : la mesure est
    // fausse (et, sans le verrou, elle aurait écrit). Voir PRODUCTION.
    // (Un hôte du miroir, servi par ce script, n'est pas une fuite : la
    // fonction appelable y reçoit « non authentifié » en local.)
    fuites: liste.filter((r) => { try { const h = new URL(r.url).hostname; return PRODUCTION.includes(h) && !redirigesEnLocal.includes(h); } catch { return false; } }).map((r) => r.url),
    pretMs,
    ...temps,
    erreurs,
    detail: liste.map((r) => ({ url: r.url.replace(base, ""), type: r.type, statut: r.statut, octets: r.octets }))
  };
}

async function debordements({ navigateur, base, cible, etat, reponses }) {
  const sortie = {};
  for (const largeur of LARGEURS) {
    const contexte = await nouveauContexte(navigateur, { largeur, hauteur: 800, etat: cible.profil === "etudiant" ? etat : null });
    if (cible.reponses) await injecterReponses(contexte, reponses);
    const page = await contexte.newPage();
    const erreurs = [];
    page.on("console", (m) => { if (m.type() === "error" && !estBruitConsole(m.text())) erreurs.push(m.text().slice(0, 200)); });
    page.on("pageerror", (e) => erreurs.push(`pageerror: ${e.message.slice(0, 200)}`));
    await page.goto(`${base}/${surEmulateur(cible.chemin)}`, { waitUntil: "load", timeout: 60000 });
    try { await page.waitForFunction(cible.pret, null, { timeout: 60000, polling: 100 }); } catch { /* relevé tel quel */ }
    await page.waitForTimeout(1200);
    // On descend jusqu'en bas : ce qui arrive au défilement (images
    // paresseuses, révélations) doit tenir dans la largeur, lui aussi.
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(600);
    sortie[largeur] = await page.evaluate(() => {
      const largeurVue = document.documentElement.clientWidth;
      const deborde = Math.max(document.documentElement.scrollWidth, document.body ? document.body.scrollWidth : 0) - largeurVue;
      const fautifs = [];
      if (deborde > 0) {
        for (const el of document.querySelectorAll("body *")) {
          const r = el.getBoundingClientRect();
          if (r.width && r.right > largeurVue + 1) fautifs.push(`${el.tagName.toLowerCase()}${el.id ? "#" + el.id : ""}${el.classList.length ? "." + [...el.classList].join(".") : ""} (${Math.round(r.right)} px)`);
          if (fautifs.length >= 5) break;
        }
      }
      return { deborde: Math.max(0, deborde), fautifs };
    });
    sortie[largeur].erreurs = erreurs;
    await contexte.close();
  }
  return sortie;
}

// ---------------------------------------------------------------
// Les deux préalables : la session étudiante, les réponses au
// questionnaire (results.html les lit dans sessionStorage)
// ---------------------------------------------------------------

async function sessionEtudiante(navigateur, base) {
  const contexte = await nouveauContexte(navigateur);
  const page = await contexte.newPage();
  await page.goto(`${base}/login.html?useEmulator=1`, { waitUntil: "load" });
  await page.evaluate(async ({ email, motDePasse }) => {
    const { auth } = await import("/firebase-config.js");
    const { signInWithEmailAndPassword } = await import("https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js");
    await signInWithEmailAndPassword(auth, email, motDePasse);
  }, COMPTE_EMULATEUR);
  await page.waitForTimeout(1500);
  const etat = await contexte.storageState({ indexedDB: true });
  await contexte.close();
  return etat;
}

async function reponsesQuestionnaire(navigateur, base) {
  const contexte = await nouveauContexte(navigateur);
  const page = await contexte.newPage();
  await page.goto(`${base}/${surEmulateur("eligibility-questions.html")}`, { waitUntil: "load" });
  await jouerQuestionnaire(page, profilParCle("licence-obtenue"));
  await page.waitForURL("**/results.html", { timeout: 15000 });
  const json = await page.evaluate(() => sessionStorage.getItem("eligibilityResponses"));
  await contexte.close();
  return JSON.parse(json);
}

// ---------------------------------------------------------------
// Point d'entrée
// ---------------------------------------------------------------

function option(nom) {
  const a = process.argv.find((x) => x.startsWith(`--${nom}=`));
  return a ? a.slice(nom.length + 3) : null;
}

const ko = (o) => (o / 1024).toFixed(0);

export async function mesurer({ racine = DEPOT, miroir = null, pages = PAGES, emulateur = true } = {}) {
  const dossierCert = fs.mkdtempSync(path.join(os.tmpdir(), "fitz-mesure-"));
  const { cle, cert } = certificatAutoSigne(dossierCert);
  const serveur = await demarrerServeur({ racine: path.resolve(racine), miroir: miroir && path.resolve(miroir), cle, cert });
  const t0 = Date.now();
  const compresses = precompresser(path.resolve(racine), miroir && path.resolve(miroir));
  console.log(`${compresses} fichiers compressés d'avance (${((Date.now() - t0) / 1000).toFixed(1)} s) : la mesure ne compte pas le travail du serveur local.`);
  const base = `https://localhost:${serveur.port}`;
  const hotes = ["unpkg.com", "www.gstatic.com", "fonts.googleapis.com", "fonts.gstatic.com", "europe-west1-scholarbridge-e0d84.cloudfunctions.net"];
  // Seuls les hôtes des CDN sont redirigés : localhost (le site, et les
  // émulateurs sur :9099 et :8080) se résout normalement. Les hôtes de
  // PRODUCTION ne se résolvent plus du tout (voir PRODUCTION). Aucun
  // proxy : un proxy résout lui-même les noms, et ces règles ne
  // s'appliqueraient plus.
  const regles = [
    ...(miroir ? hotes.map((h) => `MAP ${h} 127.0.0.1:${serveur.port}`) : []),
    ...PRODUCTION.filter((h) => !(miroir && hotes.includes(h))).map((h) => `MAP ${h} ~NOTFOUND`)
  ];
  const args = [`--host-resolver-rules=${regles.join(", ")}`, "--no-proxy-server"];
  const navigateur = await chromium.launch({ executablePath: process.env.CHROMIUM_CHEMIN || undefined, args });
  const resultats = [];
  try {
    const avecSession = emulateur && pages.some((p) => p.profil === "etudiant");
    const etat = avecSession ? await sessionEtudiante(navigateur, base) : null;
    const reponses = pages.some((p) => p.reponses) ? await reponsesQuestionnaire(navigateur, base) : null;
    for (const cible of pages) {
      if (cible.profil === "etudiant" && !etat) continue;
      const m = await mesurerUnePage({ navigateur, base, cible, etat, reponses, redirigesEnLocal: miroir ? hotes : [] });
      m.debordements = await debordements({ navigateur, base, cible, etat, reponses });
      if (m.fuites.length) throw new Error(`${m.page} vise la PRODUCTION — mesure arrêtée :\n  ${m.fuites.join("\n  ")}`);
      resultats.push(m);
      const deb = Object.entries(m.debordements).map(([l, d]) => `${l}:${d.deborde}px`).join(" ");
      const o = (k) => (m.parOrigine[k] ? `${m.parOrigine[k].n}/${ko(m.parOrigine[k].octets)} Ko` : "0");
      console.log(`${m.page.padEnd(30)} ${String(m.requetes).padStart(4)} req (${m.js} JS) ${ko(m.octets).padStart(5)} Ko | site ${o("site")}, CDN ${o("cdn")}, Firebase ${o("firebase")} | prêt ${m.pretMs ?? "jamais"} ms, FCP ${m.fcp} ms, LCP ${m.lcp} ms | erreurs ${m.erreurs.length} | débord. ${deb}${m.doublons.length ? ` | doublons : ${m.doublons.join(", ")}` : ""}`);
    }
  } finally {
    await navigateur.close();
    await serveur.arreter();
    fs.rmSync(dossierCert, { recursive: true, force: true });
  }
  return resultats;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const aPreparer = option("preparer-miroir");
  if (aPreparer) {
    await preparerMiroir(path.resolve(aPreparer));
  } else {
    const filtre = option("pages");
    const pages = filtre ? PAGES.filter((p) => filtre.split(",").some((f) => p.nom.startsWith(f))) : PAGES;
    const resultats = await mesurer({ racine: option("racine") || DEPOT, miroir: option("miroir"), pages, emulateur: !process.argv.includes("--sans-emulateur") });
    const sortie = option("sortie");
    if (sortie) fs.writeFileSync(sortie, JSON.stringify({ le: new Date().toISOString(), reseau: RESEAU_LENT, resultats }, null, 2));
  }
}
