/**
* ==========================================================
* Harnais Fitz — CAPTURES AVANT / APRÈS (lot DEUX-MOTEURS, 2026-09-11)
* ==========================================================
* Les halos décoratifs perdent leur `filter: blur()` (calque composé
* fragile sous WebKit) ; la douceur est reproduite dans le dégradé. La
* différence doit être IMPERCEPTIBLE à l'œil : on capture les pages
* touchées sous Chromium, à 375 et à 1280 px, avant puis après, et on
* mesure :
*  - la part de pixels qui changent entre les deux (au-delà de 16/255
*    sur un canal) ;
*  - les deux couleurs de la surface Fitz (css/base.css : #F6F0E4 sur
*    les bords, #F4DFB8 au centre) — l'écart doit rester ≤ 6 par canal.
*
*   node scripts/verifier/captures-avant-apres.mjs avant
*   node scripts/verifier/captures-avant-apres.mjs apres   (+ comparaison)
*
* Sortie : scripts/verifier/sortie/<AAAA-MM-JJ>/avant-apres/<étiquette>/
* ==========================================================
*/

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { chromium } from "playwright";
import { demarrerServeur } from "./serveur.mjs";
import { couperLeReseau } from "./hors-ligne.mjs";
import { jouerQuestionnaire } from "./questionnaire.mjs";
import { profilParCle } from "./profils.mjs";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const ETIQUETTE = process.argv[2];
if (!["avant", "apres"].includes(ETIQUETTE)) { console.error("usage : node scripts/verifier/captures-avant-apres.mjs avant|apres"); process.exit(2); }

const DATE = new Date().toISOString().slice(0, 10);
const DOSSIER = path.join(RACINE, "scripts", "verifier", "sortie", DATE, "avant-apres", ETIQUETTE);
fs.mkdirSync(DOSSIER, { recursive: true });

// Les pages touchées, et — quand elle en porte une — la surface Fitz à
// mesurer. Aucune page de l'ESPACE ne porte .fitz-surface (relevé du
// 2026-09-11 : eligibility-questions, eligibility-test, results
// seulement) ; l'accueil porte la recette d'origine sur .hero-demo.
const PAGES = [
{ page: "index.html", surface: "#fitz-demo .hero-demo", defiler: "#fitz-demo" },
{ page: "offers.html" },
{ page: "offers.html?parcours=bourse" },
{ page: "offers.html?parcours=preinscription" },
{ page: "payment.html?plan=essentiel-4" },
{ page: "eligibility-questions.html", surface: ".container.fitz-surface" },
{ page: "eligibility-test.html", surface: ".card.fitz-surface" },
{ page: "results.html", surface: "#narrativeIntro", questionnaire: "licence-obtenue" }
];
const VUES = [{ nom: "375", viewport: { width: 375, height: 812 }, mobile: true }, { nom: "1280", viewport: { width: 1280, height: 900 }, mobile: false }];

const nom = (p) => p.replace(/\.html/, "").replace(/[?=]/g, "-");
const hex = (r, g, b) => "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0").toUpperCase()).join("");

// La couleur la plus FRÉQUENTE d'une zone : le fond, jamais le texte ni
// un trait (le pixel le plus clair désignait la piste grise de la barre
// de progression, #E5E7EB, au centre de la carte de l'accueil).
async function fondDe(png, zone) {
const { data, info } = await sharp(png).extract(zone).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const comptes = new Map();
for (let i = 0; i < data.length; i += info.channels) {
const cle = (data[i] << 16) | (data[i + 1] << 8) | data[i + 2];
comptes.set(cle, (comptes.get(cle) || 0) + 1);
}
const [cle] = [...comptes.entries()].sort((a, b) => b[1] - a[1])[0];
return [(cle >> 16) & 255, (cle >> 8) & 255, cle & 255];
}

async function mesurerSurface(locator, fichier) {
const png = await locator.screenshot({ type: "png", animations: "disabled" });
fs.writeFileSync(fichier, png);
const { width, height } = await sharp(png).metadata();
const bord = await fondDe(png, { left: 2, top: Math.max(0, Math.floor(height / 2) - 30), width: 6, height: 60 });
// « Centre » = le milieu de la LARGEUR, dans la bande de rembourrage du
// haut (y 3–9 px) : au centre géométrique de la carte de l'accueil se
// trouvent la bulle et la barre de progression, jamais le fond.
const centre = await fondDe(png, { left: Math.floor(width / 2) - 30, top: 3, width: 60, height: 6 });
return { bord: hex(...bord), centre: hex(...centre), largeur: width, hauteur: height };
}

async function partDifferente(a, b) {
const [ia, ib] = await Promise.all([a, b].map((f) => sharp(f).ensureAlpha().raw().toBuffer({ resolveWithObject: true })));
const w = Math.min(ia.info.width, ib.info.width), h = Math.min(ia.info.height, ib.info.height);
let diff = 0;
for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
const pa = (y * ia.info.width + x) * 4, pb = (y * ib.info.width + x) * 4;
if (Math.abs(ia.data[pa] - ib.data[pb]) > 16 || Math.abs(ia.data[pa + 1] - ib.data[pb + 1]) > 16 || Math.abs(ia.data[pa + 2] - ib.data[pb + 2]) > 16) diff += 1;
}
return { part: diff / (w * h), hauteurs: [ia.info.height, ib.info.height] };
}

const serveur = await demarrerServeur({ racine: RACINE });
const navigateur = await chromium.launch();
const couleurs = {};

for (const cible of PAGES) for (const vue of VUES) {
const contexte = await navigateur.newContext({ viewport: vue.viewport, isMobile: vue.mobile, hasTouch: vue.mobile, locale: "fr-FR", reducedMotion: "reduce" });
await couperLeReseau(contexte);
const page = await contexte.newPage();
const cle = `${nom(cible.page)}@${vue.nom}`;
try {
if (cible.questionnaire) {
await page.goto(`${serveur.url}/eligibility-questions.html`, { waitUntil: "domcontentloaded" });
await jouerQuestionnaire(page, profilParCle(cible.questionnaire));
await page.waitForURL("**/results.html", { timeout: 10000 });
await page.waitForFunction(() => { const c = document.getElementById("resultsContent"); return c && !c.hidden; }, null, { timeout: 60000 });
} else {
await page.goto(`${serveur.url}/${cible.page}`, { waitUntil: "load", timeout: 60000 });
}
await page.waitForTimeout(800);
// Tout .reveal visible d'emblée : la capture ne dépend pas d'un
// IntersectionObserver déclenché ou non.
await page.addStyleTag({ content: ".reveal{opacity:1!important;transform:none!important;transition:none!important}" });
if (cible.defiler) await page.evaluate((s) => document.querySelector(s)?.scrollIntoView({ block: "center" }), cible.defiler);
await page.waitForTimeout(300);
await page.screenshot({ path: path.join(DOSSIER, `${cle}.png`), fullPage: true, animations: "disabled" });
if (cible.surface) couleurs[cle] = await mesurerSurface(page.locator(cible.surface).first(), path.join(DOSSIER, `${cle}-surface.png`));
process.stdout.write(`  ${cle.padEnd(40)} ok${couleurs[cle] ? ` — surface bord ${couleurs[cle].bord}, centre ${couleurs[cle].centre}` : ""}\n`);
} catch (e) {
process.stdout.write(`  ${cle.padEnd(40)} ÉCHEC : ${e.message.split("\n")[0].slice(0, 120)}\n`);
}
await contexte.close();
}

fs.writeFileSync(path.join(DOSSIER, "couleurs-surface-fitz.json"), JSON.stringify(couleurs, null, 2));

// ---- après : comparaison avec « avant » ----
if (ETIQUETTE === "apres") {
const AVANT = path.join(DOSSIER, "..", "avant");
console.log("\nComparaison avant → après (part de pixels changés de plus de 16/255 sur un canal ; hauteurs de page)\n");
const rapport = {};
for (const f of fs.readdirSync(DOSSIER).filter((x) => x.endsWith(".png") && !x.endsWith("-surface.png"))) {
const a = path.join(AVANT, f);
if (!fs.existsSync(a)) { console.log(`  ${f.padEnd(44)} pas de capture « avant »`); continue; }
const d = await partDifferente(a, path.join(DOSSIER, f));
rapport[f] = d;
console.log(`  ${f.padEnd(44)} ${(d.part * 100).toFixed(2)} % ${d.hauteurs[0] === d.hauteurs[1] ? "" : `(hauteurs ${d.hauteurs.join(" → ")})`}`);
}
const avantCouleurs = JSON.parse(fs.readFileSync(path.join(AVANT, "couleurs-surface-fitz.json"), "utf8"));
console.log("\nSurface Fitz — bord / centre (écart max par canal, ≤ 6 exigé)\n");
const ecart = (h1, h2) => Math.max(...[1, 3, 5].map((i) => Math.abs(parseInt(h1.slice(i, i + 2), 16) - parseInt(h2.slice(i, i + 2), 16))));
for (const [cle, c] of Object.entries(couleurs)) {
const av = avantCouleurs[cle];
if (!av) continue;
const e = Math.max(ecart(av.bord, c.bord), ecart(av.centre, c.centre));
console.log(`  ${cle.padEnd(36)} ${av.bord} / ${av.centre}  →  ${c.bord} / ${c.centre}   écart ${e} ${e <= 6 ? "ok" : "TROP"}`);
}
fs.writeFileSync(path.join(DOSSIER, "comparaison.json"), JSON.stringify({ pixels: rapport, couleursAvant: avantCouleurs, couleursApres: couleurs }, null, 2));
}

await navigateur.close();
await serveur.arreter();
