/**
 * ============================================================
 * Lot VITRINE-COMMERCIALE (2026-09-11) — un site qui donne envie
 * d'acheter, sans rien inventer.
 * ============================================================
 *
 *  1. LE PRIX DU PREMIER DOSSIER : 25 000 F, miroir exact entre la grille
 *     affichée (pricing-plans.js) et la grille facturée
 *     (functions/lib/achat.js) — et rien d'autre n'a bougé.
 *  2. LES CARTES DISENT VRAI : chaque puce d'offers.html est, mot pour
 *     mot, un `highlights` de pricing-plans.js ; chaque offre vendue porte
 *     un `niveau` (entree / recommande / humain) et un `cta` ; le libellé
 *     du bouton est ce `cta`.
 *  3. UN SEUL COMPOSANT : css/formule.css chargée par les trois pages qui
 *     affichent un prix ; plus aucune règle .consult-* / .plan-card-featured
 *     dans les feuilles d'offers.html ; ni backdrop-filter ni flou dans la
 *     carte.
 *  4. LES BOUTONS : trois niveaux dans css/base.css et nulle part
 *     ailleurs ; dans le HTML statique, au plus UN .btn-accent par
 *     <section> ; le secondaire est papier plein en littéraux.
 *  5. LE TON : aucune phrase qui décourage dans le texte VISIBLE des pages
 *     publiques et du paiement ; et, dans l'autre sens, aucune promesse
 *     de résultat ni chiffre inventé.
 *  6. LA FICHE : plus de bloc « Avant de candidater », et plus de code mort
 *     derrière lui.
 *  7. L'ACCUEIL : plus de bande de chiffres ; un bloc de conclusion avec
 *     trois étapes, un bouton principal vers le diagnostic gratuit et un
 *     lien vers les formules — sans nombre d'étudiants ni avis.
 * ============================================================
 */

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(path.join(RACINE, f), "utf8").replace(/\r\n/g, "\n");
const require = createRequire(import.meta.url);

function chargerGrille() {
const bac = { window: {} };
vm.createContext(bac);
vm.runInContext(lire("pricing-plans.js"), bac);
return bac.window.SCHOLARBRIDGE_PLANS;
}

const OFFRES = chargerGrille();
const { GRILLE } = require("../functions/lib/achat.js");

const visible = (html) => html
.replace(/<!--[\s\S]*?-->/g, "")
.replace(/<script[\s\S]*?<\/script>/g, "")
.replace(/<style[\s\S]*?<\/style>/g, "")
.replace(/<head>[\s\S]*?<\/head>/, "");
const texteDe = (html) => visible(html).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
const sansCommentairesCss = (css) => css.replace(/\/\*[\s\S]*?\*\//g, "");
const sansCommentairesJs = (js) => js.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

const EN_VENTE = Object.values(OFFRES).filter((o) => o.deprecated !== true);

// ============================================================
// 1. Le prix du Premier Dossier
// ============================================================

test("vitrine 1 — Premier Dossier à 25 000 F, affiché ET facturé ; rien d'autre n'a bougé", () => {
assert.equal(OFFRES["premier-dossier"].priceFCFA, 25000);
assert.equal(GRILLE["premier-dossier"].prix, 25000);
for (const [id, offre] of Object.entries(OFFRES)) {
if (GRILLE[id]) assert.equal(GRILLE[id].prix, offre.priceFCFA, `${id} : affiché ≠ facturé`);
}
assert.equal(OFFRES.fitzExpress.priceFCFA, 10000);
assert.equal(OFFRES["essentiel-4"].priceFCFA, 45000);
assert.equal(OFFRES["conseiller-6"].priceFCFA, 150000);
assert.equal(OFFRES["diagnostic-france"].priceFCFA, 10000);
assert.equal(OFFRES["dossier-france"].priceFCFA, 75000);
assert.equal(OFFRES["dossier-france-conseiller"].priceFCFA, 150000);
// Plus aucun « 15 000 F » vivant pour le Premier Dossier.
assert.ok(!/priceFCFA: 15000\b/.test(lire("pricing-plans.js")));
});

// ============================================================
// 2. Les cartes disent vrai
// ============================================================

test("vitrine 2 — chaque offre vendue porte un niveau et un cta", () => {
for (const o of EN_VENTE) {
assert.ok(["entree", "recommande", "humain"].includes(o.niveau), `${o.id} : niveau « ${o.niveau} »`);
assert.ok(typeof o.cta === "string" && o.cta.length > 6, `${o.id} : cta`);
assert.ok(Array.isArray(o.highlights) && o.highlights.length >= 4 && o.highlights.length <= 6, `${o.id} : ${o.highlights.length} avantages (4 à 6 attendus)`);
}
const niveaux = Object.fromEntries(EN_VENTE.map((o) => [o.id, o.niveau]));
assert.deepEqual(niveaux, {
fitzExpress: "entree", "premier-dossier": "entree", "diagnostic-france": "entree",
"essentiel-4": "recommande", "dossier-france": "recommande",
"conseiller-6": "humain", "dossier-france-conseiller": "humain"
});
});

test("vitrine 2b — offers.html : chaque puce est un highlight, mot pour mot, et le bouton porte le cta", () => {
const html = lire("offers.html");
const cartes = [...html.matchAll(/<article class="plan-card[^"]*">[\s\S]*?<\/article>/g)].map((m) => m[0]);
assert.equal(cartes.length, EN_VENTE.length, "une carte par offre vendue");
for (const carte of cartes) {
const id = (carte.match(/data-plan="([^"]+)"/) || [])[1];
const offre = OFFRES[id];
assert.ok(offre, `carte sans offre : ${id}`);
const puces = [...carte.matchAll(/<li><i data-lucide="check"><\/i><span>([^<]+)<\/span><\/li>/g)].map((m) => m[1]);
// Array.from : la grille vient d'un contexte vm, son Array n'est pas
// celui du test — deepStrictEqual compare aussi les prototypes.
assert.deepEqual(puces, Array.from(offre.highlights), `${id} : les puces de la page ≠ highlights de la grille`);
assert.ok(carte.includes(`<span>${offre.cta}</span>`), `${id} : le bouton ne dit pas « ${offre.cta} »`);
assert.ok(carte.includes(`class="plan-tagline">${offre.tagline}<`), `${id} : la promesse ≠ tagline`);
assert.ok(carte.includes(`plan-card--${offre.niveau}`), `${id} : niveau de carte`);
// Un seul bouton ambre : celui de la formule recommandée.
const ambre = /btn-accent/.test(carte);
assert.equal(ambre, offre.niveau === "recommande", `${id} : bouton ambre ${ambre ? "en trop" : "manquant"}`);
}
});

test("vitrine 2c — la page de destination rend la même carte depuis la grille", () => {
const dest = sansCommentairesJs(lire("js/preinscription-destination.js"));
assert.ok(dest.includes('plan-card plan-card--${escapeHtml(niveau)}'));
assert.ok(dest.includes("offre.highlights"));
assert.ok(dest.includes("offre.cta"));
assert.ok(dest.includes("EUR_PER_XOF = 655.957"), "même parité que offers.js");
assert.ok(/btn-accent/.test(dest) && /btn-secondary/.test(dest));
// payment.html : le récapitulatif porte le niveau.
assert.ok(lire("payment.js").includes("`plan-card--${plan.niveau || \"entree\"}`"));
});

// ============================================================
// 3. Un seul composant
// ============================================================

test("vitrine 3 — css/formule.css est le seul composant de carte, sans flou", () => {
for (const page of ["offers.html", "preinscription-france.html", "payment.html"]) {
assert.ok(lire(page).includes('href="css/formule.css"'), `${page} sans css/formule.css`);
}
const formule = sansCommentairesCss(lire("css/formule.css"));
assert.ok(!/backdrop-filter/.test(formule), "backdrop-filter dans la carte");
assert.ok(!/filter\s*:\s*blur/.test(formule), "flou dans la carte");
for (const niveau of ["entree", "recommande", "humain"]) assert.ok(formule.includes(`.plan-card--${niveau}{`), niveau);
assert.ok(formule.includes(".plan-cta{") && /margin-top:auto/.test(formule), "les boutons s'ancrent en bas");
// Les anciennes règles ont quitté les feuilles d'offers.html.
for (const f of ["offers.css", "css/offers-redesign.css"]) {
const css = sansCommentairesCss(lire(f));
assert.ok(!/\.consult-banner|\.plan-card-featured|\.plan-card-premium|\.plan-card--human\b|\.starter-stack\{/.test(css), `${f} : règles de carte mortes`);
}
assert.ok(!/\.pre-offre\{/.test(sansCommentairesCss(lire("css/preinscriptions.css"))), "css/preinscriptions.css : .pre-offre redéfinit la carte");
assert.ok(!/consult-banner|plan-card-featured|plan-card--human\b/.test(visible(lire("offers.html"))));
});

// ============================================================
// 4. Les boutons
// ============================================================

test("vitrine 4 — trois niveaux dans base.css, aucun redéfini par une feuille de page", () => {
const base = sansCommentairesCss(lire("css/base.css"));
assert.ok(/\.btn-accent\{[^}]*min-height:52px/.test(base), "principal : 52 px");
assert.ok(/\.btn-secondary\{[^}]*background:#FDFCFA/.test(base) && /\.btn-secondary\{[^}]*color:#1A1714/.test(base), "secondaire : papier plein, en littéraux");
assert.ok(/\.btn-link\{/.test(base), "niveau lien");
assert.ok(/\.btn:hover > \.lucide-arrow-right[^{]*\{[^}]*translateX/.test(base), "la flèche glisse");
assert.ok(/prefers-reduced-motion:reduce\)\{[\s\S]*?\.btn > \.lucide-arrow-right/.test(base), "flèche immobile sous reduced-motion");
for (const f of ["css/homepage-sections.css", "css/preinscriptions.css", "css/vivant.css", "css/offers-redesign.css", "offers.css"]) {
const css = sansCommentairesCss(lire(f));
assert.ok(!/^\s*\.btn-(primary|secondary|accent|link)\s*[,{]/m.test(css) && !/\.steps-footer \.btn-primary\{|\.pre-entree \.btn-primary\{|^\s*\.btn-lg\{/m.test(css), `${f} redéfinit un niveau de bouton`);
}
});

test("vitrine 4b — au plus un bouton principal par section, dans le HTML statique", () => {
const pages = ["index.html", "offers.html", "preinscriptions.html", "preinscription-france.html", "scholarships.html", "universities.html", "scholarship-details.html", "results.html", "payment.html", "diagnostic-france.html"];
for (const page of pages) {
const html = visible(lire(page));
const sections = html.split(/<section\b/);
for (const s of sections) {
const n = (s.match(/btn-accent/g) || []).length;
assert.ok(n <= 1, `${page} : ${n} boutons principaux dans une même section`);
}
}
// Les actions qui vendent sont principales.
assert.ok(/id="fitzCtaPrimary" class="btn btn-accent/.test(lire("scholarship-details.html")));
assert.ok(/id="activateButton" class="btn btn-accent/.test(lire("payment.html")));
assert.ok(/class="btn btn-accent btn-lg steps-cta"/.test(lire("index.html")));
});

// ============================================================
// 5. Le ton
// ============================================================

const DECOURAGENT = [/\bjamais jusqu'à l'admission/i, /aucune promesse/i, /\bne promet\b/i, /\bne garantit\b/i, /sans garantie/i, /\brecaler\b/i, /\béchec\b/i, /\bimpossible\b/i, /pas de chance/i, /aucun taux/i, /ce qu'il ne promet pas/i];
// Les affirmations SUR FITZUNIVERSE qui seraient inventées (aucun client
// payant à ce jour). « Des milliers d'étudiants passent des semaines à
// chercher » parle du monde, pas de nous : ce n'est pas visé.
const INTERDITS = [/admission garantie/i, /bourse (assurée|garantie)/i, /100 ?% de réussite/i, /taux de réussite de \d/i, /le plus choisi/i, /nous font confiance/i, /\d+ étudiants accompagnés/i, /étudiants accompagnés l'année/i, /déjà accompagné/i];
const PUBLIQUES = ["index.html", "offers.html", "preinscriptions.html", "preinscription-france.html", "scholarships.html", "universities.html", "scholarship-details.html", "results.html", "eligibility-test.html", "eligibility-questions.html", "login.html", "payment.html"];

test("vitrine 5 — aucune phrase qui décourage, aucune promesse de résultat, dans le texte visible", () => {
for (const page of PUBLIQUES) {
const t = texteDe(lire(page));
for (const re of DECOURAGENT) assert.ok(!re.test(t), `${page} décourage : ${re}`);
for (const re of INTERDITS) assert.ok(!re.test(t), `${page} promet ou invente : ${re}`);
}
// Les modules qui produisent du texte public.
for (const f of ["js/preinscription-destination.js", "js/preinscriptions-page.js", "pricing-plans.js"]) {
const code = sansCommentairesJs(lire(f));
for (const re of DECOURAGENT) assert.ok(!re.test(code), `${f} décourage : ${re}`);
for (const re of INTERDITS) assert.ok(!re.test(code), `${f} promet ou invente : ${re}`);
}
// Les remplacements du brief, mot pour mot.
assert.ok(lire("index.html").includes("Gratuit, sans compte, en cinq minutes."));
assert.ok(lire("offers.html").includes("Paiement en une fois. Chaque formule met toutes les chances de votre côté."));
assert.ok(lire("offers.html").includes("Accompagné pas à pas jusqu'au dépôt d'un dossier complet et vérifié."));
assert.ok(lire("offers.html").includes("Comment FitzUniverse augmente-t-il mes chances ?"));
assert.ok(lire("offers.html").includes("Les universités et les jurys décident ; notre travail est de vous présenter sous votre meilleur jour."));
assert.ok(lire("preinscription-france.html").includes("Ce que nous vous garantissons"));
assert.ok(lire("preinscription-france.html").includes("ce qui fait la différence pour un dossier chez vous"));
for (const id of ["dossier-france", "dossier-france-conseiller"]) {
assert.ok(OFFRES[id].highlights.includes("Vous gardez la main : un dossier complet et vérifié, que vous déposez vous-même sur Études en France"), id);
}
// Ce qui reste, parce que ce n'est pas un découragement.
// « il vous dit ce qu'il ne sait pas » A QUITTÉ CETTE GARDE le
// 2026-09-12 (décision de Charles) : la refonte des accroches de
// l'accueil a réécrit le sous-titre du hero, seul endroit du site où
// la phrase vivait. Elle n'est plus exigée nulle part — voir aussi
// INTOUCHABLES dans test/langage.test.mjs.
assert.ok(lire("offers.html").includes("La décision d'admission et la délivrance du visa relèvent, elles, des établissements et des autorités consulaires"));
});

// ============================================================
// 6. La fiche
// ============================================================

test("vitrine 6 — plus de bloc « Avant de candidater », et plus de code mort derrière", () => {
const html = visible(lire("scholarship-details.html"));
assert.ok(!/Avant de candidater|analyser votre compatibilité|Analyser mon profil|diagnostic-block|analyzeBtn|diagnosticResult/.test(html));
const js = sansCommentairesJs(lire("details.js"));
assert.ok(!/computeCompatibility|renderDiagnostic|renderDiagnosticPrompt|buildReturnUrl|languageLevelScore|fromTest|analyzeBtn/.test(js), "details.js garde du code du bloc");
for (const f of ["scholarship-details.css", "css/details-redesign.css"]) {
assert.ok(!/\.diagnostic-|\.fitz-avatar/.test(sansCommentairesCss(lire(f))), `${f} : CSS du bloc`);
}
assert.ok(!/diagnostic|compatibilit/i.test(sansCommentairesJs(lire("universities-page.js"))));
// La colonne de droite et le lien vers le site de l'université restent.
assert.ok(/id="fitzCtaPrimary"/.test(html) && /id="applyBtn"/.test(html));
});

// ============================================================
// 7. L'accueil
// ============================================================

test("vitrine 7 — le bas de l'accueil : un appel à l'action, pas des chiffres répétés", () => {
const html = lire("index.html");
assert.ok(!/id="chiffres"/.test(html));
const cta = html.slice(html.indexOf('class="cta-box-panel"'), html.indexOf("</main>"));
assert.ok(cta.includes("Votre projet d'études commence aujourd'hui."));
assert.equal((cta.match(/<li><span class="cta-step-num">/g) || []).length, 3, "trois étapes");
assert.ok(/diagnostic gratuit/i.test(cta) && /formule/i.test(cta) && /déposé/i.test(cta));
assert.equal((cta.match(/btn-accent/g) || []).length, 1, "un seul bouton principal");
assert.ok(/href="eligibility-questions\.html" class="btn btn-accent/.test(cta), "le principal mène au diagnostic gratuit");
assert.ok(/href="offers\.html" class="btn btn-link/.test(cta), "les formules sont un lien");
assert.ok(!/\d+ étudiants|avis|témoignage/i.test(texteDe(cta)));
assert.ok(!/backdrop-filter:blur/.test(sansCommentairesCss(lire("css/homepage-sections.css")).split(".cta-box-panel{").pop().slice(0, 400)) || /backdrop-filter:none/.test(lire("css/homepage-sections.css")));
});
