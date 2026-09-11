/**
* ==========================================================
* Harnais Fitz — CAPTURES iPHONE (lot DEUX-MOTEURS, 2026-09-11)
* ==========================================================
* « Voir ce que Charles voit. » Le 2026-09-10, deux captures de son
* iPhone (iOS 18.7, Safari 18.7, écran 375 × 812 pt) ont montré :
*
*  A. index.html, carte « Analyse en direct » : DEUX messages dessinés
*     l'un sur l'autre dans la bulle #fitz-message (l'ancien texte
*     jamais effacé). Un seul nœud texte : le contrôle de chevauchement
*     du peigne (rectangles de lignes) est aveugle à ce défaut.
*  B. offers.html : un CARRÉ NOIR à angles vifs (~180 × 180 px CSS) collé
*     au coin haut-gauche, par-dessus la barre de marque. Coupable
*     probable : le halo `.container::before` (flou 70 px, z-index -1)
*     — une portion de calque composé que WebKit n'a pas peinte.
*
* Ce module rejoue ces deux scènes à 375 × 812, dpr 3, tactile, avec les
* VRAIES polices (Public Sans et Newsreader changent les coupures de
* ligne), sous chaque moteur :
*  - index.html : la carte capturée toutes les 500 ms pendant ~25 s (deux
*    cycles de la démo), assemblée en une planche PNG par moteur ;
*  - offers.html (trois états) et payment.html : pleine page + coin
*    haut-gauche 200 × 200 px CSS, dont on mesure la part de pixels
*    noirs (R, G, B ≤ 8). Au-delà de 5 % : ÉCHEC « bloc noir ». Le
*    contrôle est PROUVÉ par mutation : un <div> noir injecté dans le
*    coin doit le faire échouer, sinon le contrôle lui-même est en échec.
*
* HONNÊTETÉ OBLIGATOIRE : le WebKit de Playwright sous Windows n'a pas
* le moteur de composition de l'iPhone. Il peut ne reproduire ni l'un
* ni l'autre des défauts. « Non reproduit » ne veut jamais dire
* « inexistant » : les captures de Charles sont la preuve.
*
* Sortie : scripts/verifier/sortie/<AAAA-MM-JJ>/<moteur>/…png (ignoré
* par git).
* ==========================================================
*/

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { couperLeReseau } from "./hors-ligne.mjs";

export const SEUIL_NOIR = 0.05;
export const COIN = { x: 0, y: 0, width: 200, height: 200 };

// Une image PNG → part de pixels « noirs » (R, G et B ≤ 8).
export async function partDeNoir(png) {
  const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let noirs = 0;
  const n = info.width * info.height;
  for (let i = 0; i < data.length; i += info.channels) {
    if (data[i] <= 8 && data[i + 1] <= 8 && data[i + 2] <= 8) noirs += 1;
  }
  return n ? noirs / n : 0;
}

async function contexteIphone(navigateur) {
  const contexte = await navigateur.newContext({
    viewport: { width: 375, height: 812 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    locale: "fr-FR"
  });
  await couperLeReseau(contexte, { polices: true });
  return contexte;
}

// ---- A. la carte « Analyse en direct », image par image ----
async function capturerDemo({ navigateur, base, dossier, notes, anomalies }) {
  const contexte = await contexteIphone(navigateur);
  const page = await contexte.newPage();
  const erreurs = [];
  page.on("pageerror", (e) => erreurs.push(e.message.split("\n")[0]));
  try {
    await page.goto(`${base}/index.html`, { waitUntil: "load", timeout: 60000 });
    // Les polices arrivent du réseau : on les attend, sinon la première
    // image est en police système et les suivantes non.
    await page.evaluate(() => document.fonts.ready).catch(() => {});
    // La carte est amenée en haut de la fenêtre (elle peut être plus
    // haute que la moitié de l'écran) ; le clip reste borné à la fenêtre.
    await page.evaluate(() => document.getElementById("fitz-demo")?.scrollIntoView({ block: "center" }));
    await page.waitForTimeout(300);
    await page.evaluate(() => { const c = document.querySelector("#fitz-demo .hero-demo"); if (c) window.scrollBy(0, c.getBoundingClientRect().top - 48); });
    await page.waitForTimeout(400);
    // La boîte de la carte, capturée par `clip` et non par
    // locator.screenshot() : ce dernier attend que l'élément soit
    // STABLE (aucune animation), or la barre de progression bouge — sous
    // WebKit, chaque image prenait 3 s au lieu de 500 ms.
    const boite = await page.locator("#fitz-demo .hero-demo").boundingBox();
    if (!boite) throw new Error("carte #fitz-demo .hero-demo introuvable");
    const vp = page.viewportSize();
    const x = Math.max(0, boite.x - 40), y = Math.max(0, boite.y - 40);
    const clip = { x, y, width: Math.min(boite.width + 80, vp.width - x), height: Math.min(boite.height + 80, vp.height - y) };
    const images = [];
    const textes = [];
    const t0 = Date.now();
    // ~10 s par cycle (1 s + 5 étapes à 1,5 s + 3 s de pause) : deux
    // cycles = 25 s, une image toutes les 500 ms.
    while (Date.now() - t0 < 25000) {
      const debut = Date.now();
      images.push(await page.screenshot({ type: "png", clip, animations: "allow" }));
      textes.push(await page.evaluate(() => {
        const m = document.getElementById("fitz-message");
        return { texte: (m?.textContent || "").trim().slice(0, 40), noeuds: m ? m.childNodes.length : 0, li: document.querySelectorAll("#analysis-list li").length };
      }));
      const reste = 500 - (Date.now() - debut);
      if (reste > 0) await page.waitForTimeout(reste);
    }
    // La planche : 5 colonnes, cellules à la taille de la plus grande image.
    const metas = await Promise.all(images.map((i) => sharp(i).metadata()));
    const cw = Math.max(...metas.map((m) => m.width));
    const ch = Math.max(...metas.map((m) => m.height));
    const colonnes = 5;
    const lignes = Math.ceil(images.length / colonnes);
    const planche = sharp({ create: { width: cw * colonnes, height: ch * lignes, channels: 4, background: { r: 245, g: 240, b: 232, alpha: 1 } } })
      .composite(images.map((input, i) => ({ input, left: (i % colonnes) * cw, top: Math.floor(i / colonnes) * ch })))
      .png();
    const fichier = path.join(dossier, "index-analyse-en-direct-planche.png");
    await planche.toFile(fichier);
    // Le journal des textes lus à chaque image : un « double message »
    // sous WebKit iPhone se verrait à l'image, pas dans le DOM (un seul
    // nœud texte) — le journal sert à dater chaque vignette.
    fs.writeFileSync(path.join(dossier, "index-analyse-en-direct-journal.json"), JSON.stringify(textes, null, 2));
    const distincts = new Set(textes.map((t) => t.texte)).size;
    const maxLi = Math.max(...textes.map((t) => t.li));
    notes.push(`index.html : ${images.length} images en ${((Date.now() - t0) / 1000).toFixed(1)} s, ${distincts} messages distincts, jusqu'à ${maxLi} lignes de liste — planche ${path.relative(process.cwd(), fichier)}`);
    if (distincts < 3) anomalies.push(`index.html : la démo n'a pas tourné (${distincts} message(s) distinct(s) en 25 s) — la planche ne montre rien`);
    if (textes.some((t) => t.noeuds > 1)) anomalies.push("index.html : #fitz-message a porté plus d'un nœud enfant à la fois");
  } catch (e) {
    anomalies.push(`index.html : ${e.message.split("\n")[0].slice(0, 160)}`);
  }
  for (const m of erreurs) anomalies.push(`index.html : exception : ${m.slice(0, 140)}`);
  await contexte.close();
}

// ---- B. le coin haut-gauche des pages à halos ----
// payment.html sans `?plan=` renvoie vers offers.html (getRequestedPlanId)
// — on lui donne une formule vendable, sinon on capture deux fois offers.
const PAGES_HALO = ["offers.html", "offers.html?parcours=bourse", "offers.html?parcours=preinscription", "payment.html?plan=essentiel-4"];

function nomFichier(cible) {
  return cible.replace(/\.html/, "").replace(/[?=]/g, "-");
}

async function capturerCoin({ navigateur, base, dossier, cible, notes, anomalies, mesures }) {
  const contexte = await contexteIphone(navigateur);
  const page = await contexte.newPage();
  const erreurs = [];
  page.on("pageerror", (e) => erreurs.push(e.message.split("\n")[0]));
  try {
    await page.goto(`${base}/${cible}`, { waitUntil: "load", timeout: 60000 });
    await page.evaluate(() => document.fonts.ready).catch(() => {});
    await page.waitForTimeout(1200);
    const nom = nomFichier(cible);
    await page.screenshot({ path: path.join(dossier, `${nom}-pleine-page.png`), fullPage: true, animations: "allow" });
    const coin = await page.screenshot({ clip: COIN, animations: "allow" });
    fs.writeFileSync(path.join(dossier, `${nom}-coin.png`), coin);
    const part = await partDeNoir(coin);
    mesures[cible] = part;
    // Preuve par mutation : un carré noir de 200 × 200 px dans le coin
    // doit faire échouer la mesure. Sinon, c'est le contrôle qui est en
    // panne (clip inopérant, capture d'un autre calque…).
    await page.evaluate(() => {
      const d = document.createElement("div");
      d.id = "__harnais-mutation";
      d.style.cssText = "position:fixed;top:0;left:0;width:200px;height:200px;background:#000;z-index:2147483647;pointer-events:none";
      document.body.appendChild(d);
    });
    const coinMute = await page.screenshot({ clip: COIN, animations: "allow" });
    const partMutee = await partDeNoir(coinMute);
    await page.evaluate(() => document.getElementById("__harnais-mutation")?.remove());
    notes.push(`${cible} : ${(part * 100).toFixed(2)} % de pixels noirs dans le coin 200 × 200 (témoin de mutation : ${(partMutee * 100).toFixed(0)} %)`);
    if (partMutee <= SEUIL_NOIR) anomalies.push(`${cible} : témoin de mutation en échec — un bloc noir injecté ne fait pas échouer la mesure (${(partMutee * 100).toFixed(1)} %)`);
    if (part > SEUIL_NOIR) anomalies.push(`${cible} : bloc noir — ${(part * 100).toFixed(1)} % de pixels noirs dans le coin haut-gauche (seuil ${SEUIL_NOIR * 100} %)`);
  } catch (e) {
    anomalies.push(`${cible} : ${e.message.split("\n")[0].slice(0, 160)}`);
  }
  for (const m of erreurs) anomalies.push(`${cible} : exception : ${m.slice(0, 140)}`);
  await contexte.close();
}

export async function capturerIphone({ navigateur, base, moteur, dossier }) {
  const anomalies = [];
  const notes = [];
  const mesures = {};
  const sousDossier = path.join(dossier, moteur);
  fs.mkdirSync(sousDossier, { recursive: true });
  await capturerDemo({ navigateur, base, dossier: sousDossier, notes, anomalies });
  for (const cible of PAGES_HALO) await capturerCoin({ navigateur, base, dossier: sousDossier, cible, notes, anomalies, mesures });
  fs.writeFileSync(path.join(sousDossier, "coins-noir.json"), JSON.stringify(mesures, null, 2));
  notes.push(`sortie : ${path.relative(process.cwd(), sousDossier)}`);
  return { anomalies, notes, mesures };
}
