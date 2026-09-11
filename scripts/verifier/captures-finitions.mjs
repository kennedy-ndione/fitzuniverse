/**
* ==========================================================
* Harnais Fitz — CAPTURES DU LOT FINITIONS-VISUELLES (2026-09-11)
* ==========================================================
* Les cinq écrans que Charles a vus, avant puis après le lot, sous
* Chromium, aux tailles de ses captures :
*
*   accueil        index.html            1366 × 768   (logo / surtitre)
*   profil         profile.html          1440 × 900   (cartes, barre)
*   messages       messages.html          390 × 844   (iPhone)
*   fiche admin    admin/student-detail   1280 × 900   liste « Formule » OUVERTE
*   bas de page    scholarships.html     1280 × 900   défilé tout en bas
*
*   node scripts/verifier/captures-finitions.mjs avant
*   node scripts/verifier/captures-finitions.mjs apres
*
* Sortie : scripts/verifier/sortie/<AAAA-MM-JJ>/finitions/<étiquette>/
* Hors ligne, session doublée (hors-ligne.mjs) : aucune lecture Firestore.
* ==========================================================
*/

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { demarrerServeur } from "./serveur.mjs";
import { couperLeReseau } from "./hors-ligne.mjs";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const ETIQUETTE = process.argv[2];
if (!["avant", "apres"].includes(ETIQUETTE)) { console.error("usage : node scripts/verifier/captures-finitions.mjs avant|apres"); process.exit(2); }

const DATE = new Date().toISOString().slice(0, 10);
const DOSSIER = path.join(RACINE, "scripts", "verifier", "sortie", DATE, "finitions", ETIQUETTE);
fs.mkdirSync(DOSSIER, { recursive: true });

const dans = (n) => new Date(Date.now() + n * 864e5).toISOString();

const ETUDIANT = {
uid: "harnais-finitions",
userData: { firstName: "Awa", lastName: "Diallo", name: "Awa Diallo", email: "harnais@fitz.local", plan: "conseiller-6", planExpiresAt: dans(90), track: "bourse", profileCompleted: true, profile: { name: "Awa Diallo", palier: "licence_en_cours", nationality: "Sénégalaise", desiredDegree: "Master", desiredField: "Informatique", languages: ["français"] } },
applications: [],
portails: { universites: {}, programmes: {}, bourses: {} }
};

const ADMIN = {
uid: "harnais-admin",
email: "proprietaire@fitz.local",
// Sans champ role : un propriétaire par amorçage (js/roles-admin.js).
adminDoc: { email: "proprietaire@fitz.local", isActive: true },
etudiantUid: "harnais-etudiant-fiche",
etudiantDoc: { name: "Awa Diallo", email: "awa.diallo@example.org", plan: "conseiller-6", planExpiresAt: "2027-03-31", planPreinscription: "dossier-france", planPreinscriptionExpiresAt: "2027-01-15", createdAt: "2026-02-10", firstName: "Awa", lastName: "Diallo", nationality: "Sénégal", country: "Sénégal", desiredField: "Informatique", desiredDegree: "Master", disabled: false, testerAccess: false }
};

const CIBLES = [
{ nom: "accueil-1366x768", page: "index.html", viewport: { width: 1366, height: 768 } },
{ nom: "accueil-1280x720", page: "index.html", viewport: { width: 1280, height: 720 } },
{ nom: "profil-1440", page: "profile.html", viewport: { width: 1440, height: 900 }, session: { etudiant: ETUDIANT }, attendre: "#palierGrid .palier-option", pleine: true },
{ nom: "profil-1440-milieu", page: "profile.html", viewport: { width: 1440, height: 900 }, session: { etudiant: ETUDIANT }, attendre: "#palierGrid .palier-option", defilerVers: "#sec-parcours" },
{ nom: "messages-390x844", page: "messages.html", viewport: { width: 390, height: 844 }, mobile: true, session: { etudiant: ETUDIANT }, attendre: "#messagesPageComposerHost .messages-composer, #messagesPageComposerHost .messages-composer-locked" },
{ nom: "messages-390x844-clavier", page: "messages.html", viewport: { width: 390, height: 844 }, mobile: true, session: { etudiant: ETUDIANT }, attendre: "#messagesPageComposerHost .messages-composer, #messagesPageComposerHost .messages-composer-locked", clavier: true },
{ nom: "messages-390x844-feuille", page: "messages.html", viewport: { width: 390, height: 844 }, mobile: true, session: { etudiant: ETUDIANT }, attendre: "#supportOpenBtn:not([hidden])", ouvrir: "#supportOpenBtn" },
{ nom: "fiche-admin-formules-ouvertes", page: "admin/student-detail.html?uid=harnais-etudiant-fiche", viewport: { width: 1280, height: 900 }, session: { admin: ADMIN }, attendre: "#planSelect + .fitz-select .fitz-select-trigger", cliquerAvant: '.tab-btn[data-tab="abonnement"]', ouvrir: "#planSelect + .fitz-select .fitz-select-trigger" },
{ nom: "liste-admin-filtre-ouvert", page: "admin/students.html", viewport: { width: 1280, height: 900 }, session: { admin: ADMIN }, attendre: "#planFilter + .fitz-select .fitz-select-trigger", ouvrir: "#planFilter + .fitz-select .fitz-select-trigger" },
{ nom: "bas-de-page-bourses-1280", page: "scholarships.html", viewport: { width: 1280, height: 900 }, bas: true },
{ nom: "bas-de-page-formules-1280", page: "offers.html", viewport: { width: 1280, height: 900 }, bas: true }
];

const serveur = await demarrerServeur({ racine: RACINE });
const navigateur = await chromium.launch();

// --seulement=nom : une seule capture (itérations rapides).
const SEULEMENT = (process.argv.find((a) => a.startsWith("--seulement=")) || "").slice("--seulement=".length);

for (const c of CIBLES) {
if (SEULEMENT && c.nom !== SEULEMENT) continue;
const contexte = await navigateur.newContext({ viewport: c.viewport, isMobile: !!c.mobile, hasTouch: !!c.mobile, locale: "fr-FR", reducedMotion: "reduce" });
await couperLeReseau(contexte, c.session || {});
const page = await contexte.newPage();
try {
await page.goto(`${serveur.url}/${c.page}`, { waitUntil: "load", timeout: 60000 });
if (c.attendre) await page.waitForSelector(c.attendre, { timeout: 20000 }).catch(() => {});
await page.waitForTimeout(900);
await page.addStyleTag({ content: ".reveal{opacity:1!important;transform:none!important;transition:none!important}" });
if (c.defilerVers) { await page.evaluate((s) => document.querySelector(s)?.scrollIntoView({ block: "start" }), c.defilerVers); await page.waitForTimeout(300); }
if (c.bas) { await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight)); await page.waitForTimeout(400); }
if (c.cliquerAvant) { await page.click(c.cliquerAvant); await page.waitForTimeout(300); }
if (c.ouvrir) { await page.click(c.ouvrir); await page.waitForTimeout(300); }
if (c.clavier) {
// Clavier simulé : le cadre visible tombe à 844 − 336 px, comme sur
// iPhone (js/mobile-nav.js lit visualViewport ; on pose ses variables).
await page.evaluate(() => { document.documentElement.style.setProperty("--vvh", "508px"); document.documentElement.classList.add("kb-open"); });
await page.focus("#messagesPageComposerHost .messages-composer textarea").catch(() => {});
await page.waitForTimeout(300);
}
await page.screenshot({ path: path.join(DOSSIER, `${c.nom}.png`), fullPage: !!c.pleine, animations: "disabled" });
process.stdout.write(`  ${c.nom.padEnd(36)} ok\n`);
} catch (e) {
process.stdout.write(`  ${c.nom.padEnd(36)} ÉCHEC : ${e.message.split("\n")[0].slice(0, 120)}\n`);
}
await contexte.close();
}

await navigateur.close();
await serveur.arreter();
console.log(`\nCaptures « ${ETIQUETTE} » : ${DOSSIER}`);
