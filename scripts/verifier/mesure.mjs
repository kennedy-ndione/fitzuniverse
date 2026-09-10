/**
* ==========================================================
* Harnais Fitz — LA MESURE (lot PEIGNE-FIN, 2026-09-10)
* ==========================================================
* Charles, sur son téléphone : « ça peut prendre plus d'une minute avant
* que la page apparaisse ». Ne rien corriger avant d'avoir mesuré.
*
* Chaque page de la liste est ouverte à 375 px, session étudiante
* stubbée quand il le faut, sur un réseau RALENTI par le protocole
* Chrome (3G rapide : ~1,6 Mbit/s descendant, 300 ms de latence). On
* relève :
*  - le premier affichage utile (DOMContentLoaded, first-contentful-paint,
*    et le moment où le contenu de la page est visible) ;
*  - le nombre de requêtes et le poids transféré, par type ;
*  - la profondeur de la cascade d'imports (statique, sur les fichiers) ;
*  - les cinq requêtes les plus lentes, nommées.
*
* Ce que la mesure NE VOIT PAS : le SDK Firebase et lucide viennent des
* CDN, doublés hors ligne par des coquilles de quelques octets. Leur
* vrai poids est relevé à part (curl, 2026-09-10) : firebase-app 23 Ko,
* auth 44 Ko, firestore 120 Ko, storage 16 Ko, functions 7 Ko, lucide
* 98 Ko — tous gzip. Ils sont servis avec un cache d'un an.
*
* Seuils (anomalies) : contenu visible > 8 s sur 3G rapide, ou plus de
* 80 requêtes pour une page.
* ==========================================================
*/

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { couperLeReseau } from "./hors-ligne.mjs";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

// 3G rapide, telle que Chrome DevTools la définit, avec la latence
// d'une connexion mobile ouest-africaine mesurée à ~300 ms.
export const RESEAU_LENT = { latency: 300, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8, offline: false };

export const SEUILS = { contenuVisibleMs: 8000, requetes: 80 };

const UID = "harnais-mesure";
const dans = (n) => new Date(Date.now() + n * 864e5).toISOString();

// Un étudiant accompagné, pour les pages de l'espace.
const ETUDIANT = {
  uid: UID,
  userData: { firstName: "Awa", lastName: "Diallo", email: "harnais@fitz.local", plan: "conseiller-6", planExpiresAt: dans(90), planPreinscription: "", planPreinscriptionExpiresAt: null, track: "bourse", profileCompleted: true },
  applications: [],
  portails: { universites: {}, programmes: {}, bourses: {} }
};

// Les pages mesurées, et le sélecteur qui prouve que le contenu utile
// est là (pas seulement le squelette).
export const PAGES = [
  { page: "index.html", visible: ".hero h1", session: false },
  { page: "scholarships.html", visible: ".scholarship-card, #resultsCount", session: false },
  { page: "espace-bourse.html", visible: "#welcomeMessage, .jy-hello h1", session: true },
  { page: "applications.html", visible: "#applicationsList, main.content", session: true },
  { page: "ai-chat.html", visible: "#chatForm", session: true },
  { page: "documents.html", visible: "#documentsContainer, main.content", session: true }
];

// ---- la cascade d'imports, lue sur les fichiers ----
function importsDe(fichier) {
  const s = fs.readFileSync(fichier, "utf8");
  const out = [];
  for (const m of s.matchAll(/(?:^|\n)\s*(?:import|export)\s[^;]*?from\s*["']([^"']+)["']/g)) out.push(m[1]);
  for (const m of s.matchAll(/(?:^|\n)\s*import\s*["']([^"']+)["']/g)) out.push(m[1]);
  return out;
}

function profondeur(entree, vus, prof) {
  if (vus.has(entree)) return prof - 1;
  vus.add(entree);
  let max = prof;
  for (const imp of importsDe(entree)) {
    if (/^https?:/.test(imp)) continue;
    const cible = path.resolve(path.dirname(entree), imp);
    if (fs.existsSync(cible)) max = Math.max(max, profondeur(cible, vus, prof + 1));
  }
  return max;
}

export function cascadeDe(page) {
  const html = fs.readFileSync(path.join(RACINE, page), "utf8").replace(/<!--[\s\S]*?-->/g, "");
  const vus = new Set();
  let prof = 0;
  for (const m of html.matchAll(/<script[^>]*src="([^"]+)"/g)) {
    if (/^https?:/.test(m[1])) continue;
    const f = path.join(RACINE, m[1]);
    if (fs.existsSync(f)) prof = Math.max(prof, profondeur(f, vus, 1));
  }
  for (const bloc of html.matchAll(/<script type="module">([\s\S]*?)<\/script>/g)) {
    for (const m of bloc[1].matchAll(/from\s*["']([^"']+)["']/g)) {
      if (/^https?:/.test(m[1])) continue;
      const f = path.join(RACINE, m[1]);
      if (fs.existsSync(f)) prof = Math.max(prof, profondeur(f, vus, 1));
    }
  }
  const poids = [...vus].reduce((a, f) => a + fs.statSync(f).size, 0);
  return { modules: vus.size, profondeur: prof, poidsKo: Math.round(poids / 1024) };
}

// ---- une page, sur le réseau lent ----
async function mesurerPage({ navigateur, base, cible }) {
  const contexte = await navigateur.newContext({ viewport: { width: 375, height: 812 }, locale: "fr-FR", hasTouch: true, isMobile: true });
  await couperLeReseau(contexte, cible.session ? { etudiant: ETUDIANT } : {});
  const page = await contexte.newPage();
  const cdp = await contexte.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.emulateNetworkConditions", RESEAU_LENT);

  const requetes = [];
  page.on("response", async (r) => {
    const url = r.url();
    const req = r.request();
    let octets = 0;
    try { const corps = await r.body(); octets = corps.length; } catch { octets = 0; }
    requetes.push({ url, type: req.resourceType(), statut: r.status(), octets, debut: req.timing().startTime, duree: r.request().timing().responseEnd });
  });

  const t0 = Date.now();
  await page.goto(`${base}/${cible.page}`, { waitUntil: "domcontentloaded", timeout: 120000 });
  const dcl = Date.now() - t0;
  let visibleMs = null;
  try {
    await page.waitForSelector(cible.visible, { state: "visible", timeout: 60000 });
    visibleMs = Date.now() - t0;
  } catch { visibleMs = null; }
  // Laisser finir ce qui arrive encore, pour compter toutes les requêtes.
  await page.waitForTimeout(2500);
  const fcp = await page.evaluate(() => { const p = performance.getEntriesByType("paint").find((e) => e.name === "first-contentful-paint"); return p ? Math.round(p.startTime) : null; });
  const ressources = await page.evaluate(() => performance.getEntriesByType("resource").map((e) => ({ nom: e.name, duree: Math.round(e.duration), taille: e.transferSize || e.encodedBodySize || 0 })));

  await contexte.close();

  const locales = requetes.filter((r) => r.url.startsWith(base));
  const parType = {};
  for (const r of locales) { parType[r.type] = parType[r.type] || { n: 0, ko: 0 }; parType[r.type].n += 1; parType[r.type].ko += r.octets / 1024; }
  const poidsKo = Math.round(locales.reduce((a, r) => a + r.octets, 0) / 1024);
  const lentes = ressources.filter((r) => r.nom.startsWith(base)).sort((a, b) => b.duree - a.duree).slice(0, 5).map((r) => `${r.nom.slice(base.length + 1)} ${r.duree} ms`);
  const cascade = cascadeDe(cible.page);
  return { page: cible.page, dclMs: dcl, fcpMs: fcp, visibleMs, requetes: locales.length, poidsKo, parType: Object.fromEntries(Object.entries(parType).map(([k, v]) => [k, `${v.n} (${Math.round(v.ko)} Ko)`])), lentes, cascade };
}

export async function mesurerPerformance({ navigateur, base, pages = PAGES }) {
  const anomalies = [];
  const notes = [];
  const lignes = [];
  for (const cible of pages) {
    try {
      const m = await mesurerPage({ navigateur, base, cible });
      lignes.push(m);
      const visible = m.visibleMs === null ? "jamais" : `${(m.visibleMs / 1000).toFixed(1)} s`;
      notes.push(`${m.page} : contenu visible en ${visible} (DCL ${(m.dclMs / 1000).toFixed(1)} s, FCP ${m.fcpMs === null ? "?" : (m.fcpMs / 1000).toFixed(1) + " s"}), ${m.requetes} requêtes, ${m.poidsKo} Ko, cascade ${m.cascade.profondeur} niveaux / ${m.cascade.modules} modules (${m.cascade.poidsKo} Ko de JS) — ${Object.entries(m.parType).map(([k, v]) => `${k} ${v}`).join(", ")} ; les plus lentes : ${m.lentes.join(" · ")}`);
      if (m.visibleMs === null || m.visibleMs > SEUILS.contenuVisibleMs) anomalies.push(`MESURE ${m.page} : contenu visible en ${visible} sur 3G rapide (seuil ${SEUILS.contenuVisibleMs / 1000} s).`);
      if (m.requetes > SEUILS.requetes) anomalies.push(`MESURE ${m.page} : ${m.requetes} requêtes (seuil ${SEUILS.requetes}).`);
    } catch (e) {
      anomalies.push(`ÉCHEC MESURE ${cible.page} : ${e.message}`);
    }
  }
  return { anomalies, notes, lignes };
}
