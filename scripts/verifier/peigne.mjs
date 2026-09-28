/**
* ==========================================================
* Harnais Fitz — LE PEIGNE FIN (lot PEIGNE-FIN, 2026-09-10)
* ==========================================================
* « Ne te limite pas aux captures : scrute le site au peigne. »
*
* TOUTES les pages — publiques, espace étudiant (session stubbée),
* Control Center (administrateur stubbé) — à 375 px ET à 1280 px :
*  1. zéro exception JavaScript, zéro erreur console ;
*  2. zéro fichier manquant : aucune réponse ≥ 400 sur une ressource
*     locale, quel que soit son type (js, css, json, image, police) ;
*  3. zéro débordement horizontal (scrollWidth ≤ innerWidth) ;
*  4. aucun bouton ni lien visible sans nom accessible ;
*  5. sur l'accueil, la carte « Analyse en direct » : jamais deux
*     lignes qui se chevauchent, observé sur un cycle entier.
*
*  7. (lot CONTRÔLES-UNIFIÉS, 2026-09-11) aucun contrôle dessiné par le
*     système : select non habillé, datalist, nombre à curseur, date nue ;
*  6. (lot ICONE-BTN, 2026-09-11) aucun élément interactif visible au
*     contenu rendu vide : ni texte, ni <svg>/<img> de dimensions non
*     nulles — lucide est le VRAI paquet installé, pas une coquille.
*
* Ce que le peigne NE voit PAS : les états vides « muets », qui se
* lisent, pas ne se mesurent.
* ==========================================================
*/

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { couperLeReseau, estBruitConsole } from "./hors-ligne.mjs";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const UID = "harnais-peigne";
const dans = (n) => new Date(Date.now() + n * 864e5).toISOString();

const ETUDIANT = {
  uid: UID,
  userData: { firstName: "Awa", lastName: "Diallo", email: "harnais@fitz.local", plan: "conseiller-6", planExpiresAt: dans(90), planPreinscription: "dossier-france", planPreinscriptionExpiresAt: dans(200), track: "bourse", profileCompleted: true },
  applications: [],
  portails: { universites: {}, programmes: {}, bourses: {} }
};

// Les pages publiques s'ouvrent sans compte ; celles de l'espace avec
// l'étudiant ; celles du Control Center avec l'administrateur amorcé.
const PUBLIQUES = ["index.html", "scholarships.html", "universities.html", "preinscriptions.html", "preinscription-france.html", "offers.html", "eligibility-test.html", "eligibility-questions.html", "results.html", "login.html", "bientot.html", "suspended.html", "payment.html"];
const ESPACE = ["dashboard.html", "espace-bourse.html", "espace-preinscription.html", "applications.html", "documents.html", "profile.html", "account.html", "messages.html", "advisor.html", "ai-chat.html", "ai-letter.html", "ai-email.html", "ai-check.html", "ai-translate.html", "compress.html", "interview-prep.html", "test-prep.html", "diagnostic-france.html"];
const VUES = [{ nom: "375", viewport: { width: 375, height: 812 }, mobile: true }, { nom: "1280", viewport: { width: 1280, height: 900 }, mobile: false }];

function pagesAdmin() {
  return fs.readdirSync(path.join(RACINE, "admin"))
    .filter((f) => f.endsWith(".html") && !/^(expand-catalog|import|migrate|backfill)/.test(f))
    .map((f) => `admin/${f}`);
}

function premierProgramme() {
  try {
    const cat = JSON.parse(fs.readFileSync(path.join(RACINE, "assets/data/catalogue.json"), "utf8"));
    const p = (cat.programs || []).find((x) => x.id);
    return p ? p.id : null;
  } catch { return null; }
}

const LIRE_PAGE = () => {
  const visible = (e) => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none"; };
  const nom = (e) => (e.getAttribute("aria-label") || e.getAttribute("title") || e.textContent || "").trim()
    || [...e.querySelectorAll("img[alt], svg title, [aria-label]")].map((x) => x.getAttribute("alt") || x.getAttribute("aria-label") || x.textContent).join("").trim();
  const decrire = (e) => `${e.tagName.toLowerCase()}${e.id ? "#" + e.id : ""}${e.className && typeof e.className === "string" ? "." + e.className.trim().split(/\s+/).slice(0, 2).join(".") : ""}${e.getAttribute("aria-label") ? " « " + e.getAttribute("aria-label") + " »" : ""}`;
  const interactifs = [...document.querySelectorAll("button, a[href]")].filter((e) => visible(e) && !e.closest("[aria-hidden='true']"));
  const muets = interactifs.filter((e) => !nom(e)).map(decrire);
  // Lot ICONE-BTN : un bouton nommé mais au contenu RENDU vide — ni texte
  // visible, ni <svg>/<img> de dimensions non nulles — est un bouton
  // invisible pour l'œil (l'icône de 0×0 de l'historique du chat).
  // Compte comme contenu : un <svg>/<img> de dimensions non nulles, ou un
  // élément DESSINÉ en CSS (fond, bordure ou image de fond) de dimensions
  // non nulles — le hamburger du menu mobile est trois <span> à fond plein.
  const dessine = (d) => {
    const r = d.getBoundingClientRect();
    if (/^(svg|img)$/i.test(d.tagName)) return r.width > 2 && r.height > 2;
    // Un trait dessiné en CSS peut faire 2px de haut (les barres du menu).
    if (r.width < 1 || r.height < 1) return false;
    const cs = getComputedStyle(d);
    return (cs.backgroundColor !== "rgba(0, 0, 0, 0)" && cs.backgroundColor !== "transparent") || cs.backgroundImage !== "none" || parseFloat(cs.borderTopWidth) > 0;
  };
  const vides = interactifs.filter((e) => {
    if (e.textContent.trim()) return false;
    const descendants = [...e.querySelectorAll("*")];
    // Un contrôle SANS enfant peut être dessiné par lui-même : les points
    // du carrousel d'annonces de l'accueil (lot 130, .annonces-point :
    // fond sur content-box, nom dans aria-label). Seul ce cas est admis —
    // un bouton à icône reste jugé sur ses descendants.
    if (!descendants.length) return !dessine(e);
    return !descendants.some(dessine);
  }).map(decrire);
  // Lot CONTRÔLES-UNIFIÉS : aucun contrôle dessiné par le système ne doit
  // rester visible — un <select> sans habillage (ni fitz-select ni
  // catalog-select), un <datalist>, un nombre avec son curseur, une date
  // sans son habillage. Lu dans le DOM rendu, donc aussi sur les selects
  // créés par script.
  const systeme = [];
  for (const sel of document.querySelectorAll("select")) {
    if (sel.dataset.fitzSelectReady || sel.dataset.customSelectReady) continue;
    if (!visible(sel)) continue;
    systeme.push("select natif " + decrire(sel));
  }
  for (const d of document.querySelectorAll("datalist")) systeme.push("datalist#" + (d.id || "?"));
  for (const n of document.querySelectorAll("input[type='number']")) if (!n.classList.contains("fitz-num")) systeme.push("nombre sans .fitz-num " + decrire(n));
  for (const d of document.querySelectorAll("input[type='date']")) if (!d.classList.contains("fitz-date")) systeme.push("date sans .fitz-date " + decrire(d));
  for (const i of document.querySelectorAll("input[list]")) systeme.push("champ à datalist " + decrire(i));
  // Lot VITRINE-COMMERCIALE (2026-09-11), trois contrôles de plus :
  //  8. aucun bouton (.btn) visible sous 44 px de haut ;
  //  9. au plus UN bouton principal (.btn-accent) par section visible —
  //     la section la plus proche, sinon <main>, sinon le corps ;
  // 10. dans une grille de cartes de formule, les cartes d'une même rangée
  //     ont la même hauteur (± 2 px) et leurs boutons sont alignés en bas
  //     (± 2 px) — mesuré, pas supposé.
  const boutons = [...document.querySelectorAll(".btn")].filter((b) => visible(b) && !b.closest("[aria-hidden='true']"));
  const courts = boutons.filter((b) => b.getBoundingClientRect().height < 44).map((b) => `${decrire(b)} (${Math.round(b.getBoundingClientRect().height)} px)`);
  const parSection = new Map();
  for (const b of boutons.filter((x) => x.classList.contains("btn-accent"))) {
    const s = b.closest("section, main, body");
    const cle = s ? decrire(s) : "?";
    parSection.set(cle, (parSection.get(cle) || 0) + 1);
  }
  const principaux = [...parSection].filter(([, n]) => n > 1).map(([s, n]) => `${n} boutons principaux dans ${s}`);
  const cartes = [];
  for (const grille of document.querySelectorAll(".pricing-grid, .starter-stack, .pre-offres")) {
    const items = [...grille.querySelectorAll(":scope > .plan-card")].filter(visible);
    const rangees = new Map();
    for (const c of items) { const r = c.getBoundingClientRect(); const k = Math.round(r.top); rangees.set(k, [...(rangees.get(k) || []), c]); }
    for (const [, rangee] of rangees) {
      if (rangee.length < 2) continue;
      const hauteurs = rangee.map((c) => c.getBoundingClientRect().height);
      if (Math.max(...hauteurs) - Math.min(...hauteurs) > 2) cartes.push(`hauteurs ${hauteurs.map(Math.round).join(" / ")} px sur une même rangée`);
      const bas = rangee.map((c) => c.querySelector(".plan-cta")).filter(Boolean).map((b) => b.getBoundingClientRect().bottom);
      if (bas.length === rangee.length && Math.max(...bas) - Math.min(...bas) > 2) cartes.push(`boutons non alignés (${bas.map(Math.round).join(" / ")} px)`);
    }
  }
  return { scrollW: document.scrollingElement.scrollWidth, innerW: window.innerWidth, muets: [...new Set(muets)].slice(0, 8), vides: [...new Set(vides)].slice(0, 8), systeme: [...new Set(systeme)].slice(0, 8), courts: [...new Set(courts)].slice(0, 8), principaux, cartes: [...new Set(cartes)].slice(0, 8), titre: document.title };
};

// Deux lignes de la carte « Analyse en direct » l'une sur l'autre.
const CHEVAUCHEMENT_DEMO = () => {
  const boites = [...document.querySelectorAll("#analysis-list li")].map((li) => li.getBoundingClientRect()).filter((b) => b.height > 0);
  const msg = document.getElementById("fitz-message");
  if (msg) boites.unshift(msg.getBoundingClientRect());
  for (let i = 1; i < boites.length; i++) if (boites[i].top < boites[i - 1].bottom - 2) return `« ${document.querySelectorAll("#analysis-list li")[i - 1]?.textContent.trim()} » chevauche la ligne précédente`;
  return null;
};

export async function peignerPage({ navigateur, base, page: cible, session, vue }) {
  const contexte = await navigateur.newContext({ viewport: vue.viewport, locale: "fr-FR", hasTouch: vue.mobile, isMobile: vue.mobile });
  await couperLeReseau(contexte, session);
  const page = await contexte.newPage();
  const erreurs = [];
  page.on("pageerror", (e) => erreurs.push(`exception : ${e.message.split("\n")[0].slice(0, 140)}`));
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    if (estBruitConsole(m.text())) return;
    erreurs.push(`console : ${m.text().split("\n")[0].slice(0, 140)}`);
  });
  page.on("response", (r) => {
    const url = r.url();
    if (!url.startsWith(base) || r.status() < 400) return;
    erreurs.push(`fichier absent (${r.status()}) : ${new URL(url).pathname}`);
  });
  try {
    await page.goto(`${base}/${cible}`, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(1400);
    // Les mesures portent sur la MISE EN PAGE, pas sur l'animation d'entrée :
    // un .reveal non encore déclenché est en scale(.97), et un bouton de
    // 44 px s'y mesure 42,7 (lot VITRINE-COMMERCIALE, faux positif vu sur
    // le lien du bloc de conclusion de l'accueil).
    await page.addStyleTag({ content: ".reveal{opacity:1!important;transform:none!important;transition:none!important}" }).catch(() => {});
    await page.waitForTimeout(150);
    // Les actions d'une conversation (renommer, supprimer) ne se montrent
    // qu'au survol : on survole la première avant de lire la page.
    const item = await page.$(".ai-chat-history-item");
    if (item) { await item.hover().catch(() => {}); await page.waitForTimeout(150); }
    const lu = await page.evaluate(LIRE_PAGE);
    // Lot DEUX-MOTEURS (2026-09-11) : la largeur de référence est celle
    // de la FENÊTRE DEMANDÉE, pas window.innerWidth. En émulation mobile,
    // Chromium élargit innerWidth jusqu'à contenir le contenu (407 px pour
    // une fenêtre de 375) : scrollWidth ≤ innerWidth toujours, et cinq
    // débordements réels de l'espace étudiant sont restés invisibles
    // jusqu'à ce que WebKit, qui garde innerWidth = 375, les montre.
    if (lu.scrollW > vue.viewport.width + 1) erreurs.push(`débordement horizontal : ${lu.scrollW} px pour ${vue.viewport.width}${lu.innerW !== vue.viewport.width ? ` (innerWidth élargi à ${lu.innerW})` : ""}`);
    if (lu.muets.length) erreurs.push(`sans nom accessible : ${lu.muets.join(", ")}`);
    if (lu.vides.length) erreurs.push(`contenu rendu vide (ni texte ni icône visible) : ${lu.vides.join(", ")}`);
    if (lu.systeme.length) erreurs.push(`contrôle système : ${lu.systeme.join(", ")}`);
    // Lot VITRINE-COMMERCIALE : boutons, hiérarchie, cartes alignées.
    if (vue.mobile && lu.courts.length) erreurs.push(`bouton sous 44 px sur téléphone : ${lu.courts.join(", ")}`);
    if (lu.principaux.length) erreurs.push(`hiérarchie des boutons : ${lu.principaux.join(" ; ")}`);
    if (!vue.mobile && lu.cartes.length) erreurs.push(`cartes de formule : ${lu.cartes.join(" ; ")}`);
    if (cible === "index.html") {
      await page.evaluate(() => document.getElementById("fitz-demo")?.scrollIntoView());
      for (let i = 0; i < 12; i++) {
        await page.waitForTimeout(700);
        const c = await page.evaluate(CHEVAUCHEMENT_DEMO);
        if (c) { erreurs.push(`carte Analyse en direct : ${c}`); break; }
      }
    }
  } catch (e) {
    erreurs.push(`ouverture : ${e.message.split("\n")[0].slice(0, 120)}`);
  }
  await contexte.close();
  return [...new Set(erreurs)];
}

export async function peignerLeSite({ navigateur, base }) {
  const anomalies = [];
  const notes = [];
  const id = premierProgramme();
  const cibles = [
    ...PUBLIQUES.map((p) => ({ page: p, session: {} })),
    ...(id ? [{ page: `scholarship-details.html?id=${encodeURIComponent(id)}`, session: {} }] : []),
    ...ESPACE.map((p) => ({ page: p, session: { etudiant: ETUDIANT } })),
    ...pagesAdmin().map((p) => ({ page: p, session: { admin: true } }))
  ];
  let ok = 0;
  for (const cible of cibles) {
    for (const vue of VUES) {
      const erreurs = await peignerPage({ navigateur, base, page: cible.page, session: cible.session, vue });
      if (erreurs.length) for (const e of erreurs) anomalies.push(`${cible.page} @${vue.nom} — ${e}`);
      else ok += 1;
    }
  }
  notes.push(`${cibles.length} pages × ${VUES.length} largeurs : ${ok} rendus sans erreur console, sans fichier manquant, sans débordement, sans bouton muet`);
  return { anomalies, notes };
}
