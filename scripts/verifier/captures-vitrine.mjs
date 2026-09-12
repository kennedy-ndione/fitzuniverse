/**
* ==========================================================
* Harnais Fitz — CAPTURES AVANT / APRÈS du lot VITRINE-COMMERCIALE
* (2026-09-11)
* ==========================================================
* Les cartes de formule (offers.html bourses et préinscription,
* preinscription-france.html), les boutons (preinscriptions.html,
* scholarship-details.html) et le bas de l'accueil, à 1440 et à 375 px,
* sous Chromium, hors ligne.
*
*   node scripts/verifier/captures-vitrine.mjs <étiquette> [racine]
*
* « avant » se capture depuis un second dossier de travail (git worktree
* de l'engagement précédent) passé en `racine` ; « apres » depuis le
* dépôt courant. Sortie :
* scripts/verifier/sortie/<AAAA-MM-JJ>/vitrine/<étiquette>/
* ==========================================================
*/

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { demarrerServeur } from "./serveur.mjs";
import { couperLeReseau } from "./hors-ligne.mjs";

const ICI = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const ETIQUETTE = process.argv[2];
const RACINE = path.resolve(process.argv[3] || ICI);
if (!ETIQUETTE) { console.error("usage : node scripts/verifier/captures-vitrine.mjs <étiquette> [racine]"); process.exit(2); }

const DATE = new Date().toISOString().slice(0, 10);
const DOSSIER = path.join(ICI, "scripts", "verifier", "sortie", DATE, "vitrine", ETIQUETTE);
fs.mkdirSync(DOSSIER, { recursive: true });

// Un premier programme du catalogue, pour la fiche.
function premierProgramme(racine) {
try {
const cat = JSON.parse(fs.readFileSync(path.join(racine, "assets/data/catalogue.json"), "utf8"));
const p = (cat.programs || []).find((x) => x.id);
return p ? p.id : null;
} catch { return null; }
}

const id = premierProgramme(RACINE);

const PAGES = [
{ nom: "offers-bourse", page: "offers.html?parcours=bourse", zone: "#bourses" },
{ nom: "offers-preinscription", page: "offers.html?parcours=preinscription", zone: "#preinscriptions" },
{ nom: "preinscription-france-offres", page: "preinscription-france.html", zone: "#offres", attendre: "#destOffres .pre-offre" },
{ nom: "preinscriptions-boutons", page: "preinscriptions.html", zone: ".pre-entree", attendre: "#paysListe article" },
{ nom: "accueil-bas", page: "index.html", zone: ".final-cta" },
{ nom: "accueil-etapes", page: "index.html", zone: "#how-it-works" },
...(id ? [{ nom: "fiche-bourse", page: `scholarship-details.html?id=${encodeURIComponent(id)}`, zone: ".details-body", attendre: "#description" }] : [])
];
const VUES = [{ nom: "1440", viewport: { width: 1440, height: 900 }, mobile: false }, { nom: "375", viewport: { width: 375, height: 812 }, mobile: true }];

const serveur = await demarrerServeur({ racine: RACINE });
const navigateur = await chromium.launch();

for (const cible of PAGES) for (const vue of VUES) {
const contexte = await navigateur.newContext({ viewport: vue.viewport, isMobile: vue.mobile, hasTouch: vue.mobile, locale: "fr-FR", reducedMotion: "reduce" });
await couperLeReseau(contexte);
const page = await contexte.newPage();
const cle = `${cible.nom}@${vue.nom}`;
try {
await page.goto(`${serveur.url}/${cible.page}`, { waitUntil: "load", timeout: 60000 });
if (cible.attendre) await page.waitForSelector(cible.attendre, { timeout: 20000 }).catch(() => {});
await page.waitForTimeout(900);
await page.addStyleTag({ content: ".reveal{opacity:1!important;transform:none!important;transition:none!important}" });
await page.waitForTimeout(200);
const zone = page.locator(cible.zone).first();
if (await zone.count()) {
await zone.scrollIntoViewIfNeeded();
await page.waitForTimeout(200);
await zone.screenshot({ path: path.join(DOSSIER, `${cle}.png`), animations: "disabled" });
} else {
await page.screenshot({ path: path.join(DOSSIER, `${cle}.png`), fullPage: true, animations: "disabled" });
}
process.stdout.write(`  ${cle.padEnd(40)} ok\n`);
} catch (e) {
process.stdout.write(`  ${cle.padEnd(40)} ÉCHEC : ${e.message.split("\n")[0].slice(0, 120)}\n`);
}
await contexte.close();
}

await navigateur.close();
await serveur.arreter();
console.log(`\nCaptures « ${ETIQUETTE} » : ${DOSSIER}`);
