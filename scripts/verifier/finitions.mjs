/**
 * ============================================================
 * scripts/verifier/finitions.mjs — ce qui saute aux yeux de Charles
 * (lot FINITIONS-VISUELLES, 2026-09-11)
 * ============================================================
 *
 * Quatre captures de Charles (ordinateur et iPhone), quatre défauts que
 * ni `npm test` ni le peigne ne voyaient. Ce module les MESURE, sous les
 * deux moteurs :
 *
 *  1. LOGO / PREMIER CONTENU — sur toute page publique à en-tête fixe,
 *     la boîte du logo (.header .fitz-lockup) et celle du premier texte
 *     de la page ne se touchent jamais : au moins 24 px d'écart, à
 *     1366 × 768, 1280 × 720, 1440 × 900, 1920 × 1080, au zoom 125 %
 *     (1093 × 614 px CSS), 375 × 667 et 390 × 844. Le hero de l'accueil
 *     passait sous l'en-tête sur un portable.
 *
 *  2. PROFIL (1440 et 375) — aucune icône interdite (sparkles, star,
 *     wand) ; aucun rond de case système visible ; sur les huit cartes
 *     de niveau, l'icône ne chevauche jamais le texte ; aucun élément
 *     fixe ou collant ne recouvre un champ ou un bouton du formulaire
 *     pendant le défilement (l'ancienne barre « Enregistrer mon profil »
 *     flottait sur les champs).
 *
 *  3. MESSAGES (390 × 844 et 375 × 667) — la zone de saisie et le bouton
 *     d'envoi entièrement dans l'écran, clavier fermé et clavier simulé
 *     ouvert ; le fil visible fait au moins la moitié de l'écran ; un
 *     message se tape et s'envoie (écriture consignée) ; « Signaler un
 *     problème » ouvre la feuille, le formulaire s'envoie, la feuille
 *     se ferme (croix, Échap, extérieur) ; un compte Pass Découverte
 *     seul voit le bouton.
 *
 *  4. PIED DE PAGE — il ne reste que sur l'accueil ; aucune autre page
 *     publique ne se termine sur un vide ni sur un contenu collé au bas.
 *
 * Hors ligne, session doublée (hors-ligne.mjs) : aucune lecture ni
 * écriture Firestore — les écritures sont CONSIGNÉES dans
 * window.__harnaisEcritures.
 * ============================================================
 */

import { couperLeReseau, estBruitConsole } from "./hors-ligne.mjs";

const dans = (n) => new Date(Date.now() + n * 864e5).toISOString();

const UID = "harnais-finitions";

const PROFIL = { name: "Awa Diallo", palier: "licence_en_cours", nationality: "Sénégalaise", desiredDegree: "Master", desiredField: "Informatique", languages: ["français"] };

const ETUDIANT = (extra = {}) => ({
  uid: UID,
  userData: { firstName: "Awa", lastName: "Diallo", name: "Awa Diallo", email: "harnais@fitz.local", plan: "essentiel-4", planExpiresAt: dans(90), track: "bourse", profileCompleted: true, profile: PROFIL, ...extra },
  applications: [],
  portails: { universites: {}, programmes: {}, bourses: {} }
});

// Un client du Forfait Conseiller : il peut RÉPONDRE dans la messagerie.
const CONSEILLER = ETUDIANT({ plan: "conseiller-6" });
// Un compte qui n'a QUE le Pass Découverte (lot ACCEPTATION, partie 4).
const PASS_SEUL = ETUDIANT({ plan: "gratuit", planExpiresAt: null, fitzExpressExpiresAt: dans(10) });

const PAGES_EN_TETE = ["index.html", "scholarships.html", "universities.html", "preinscriptions.html", "preinscription-france.html", "offers.html", "eligibility-test.html", "eligibility-questions.html", "login.html", "bientot.html", "payment.html"];

const TAILLES_LOGO = [
  { nom: "1366×768", viewport: { width: 1366, height: 768 } },
  { nom: "1280×720", viewport: { width: 1280, height: 720 } },
  { nom: "1440×900", viewport: { width: 1440, height: 900 } },
  { nom: "1920×1080", viewport: { width: 1920, height: 1080 } },
  // Zoom 125 % sur un portable 1366 × 768 : 1093 × 614 px CSS.
  { nom: "zoom 125 % (1093×614)", viewport: { width: 1093, height: 614 } },
  { nom: "375×667", viewport: { width: 375, height: 667 }, mobile: true },
  { nom: "390×844", viewport: { width: 390, height: 844 }, mobile: true }
];

// Les pages publiques SANS pied de page (test/pied-de-page.test.mjs).
const PAGES_SANS_PIED = ["scholarships.html", "universities.html", "preinscriptions.html", "preinscription-france.html", "offers.html", "bientot.html", "eligibility-test.html", "eligibility-questions.html", "login.html"];

const REVEAL = ".reveal{opacity:1!important;transform:none!important;transition:none!important}";

async function ouvrir(navigateur, base, { viewport, mobile = false, session = {} }) {
  const contexte = await navigateur.newContext({ viewport, locale: "fr-FR", isMobile: mobile, hasTouch: mobile, reducedMotion: "reduce" });
  await couperLeReseau(contexte, session);
  const page = await contexte.newPage();
  const erreurs = [];
  page.on("pageerror", (e) => erreurs.push(`exception : ${e.message.split("\n")[0].slice(0, 140)}`));
  page.on("console", (m) => {
    if (m.type() !== "error" || estBruitConsole(m.text())) return;
    erreurs.push(`console : ${m.text().split("\n")[0].slice(0, 140)}`);
  });
  page.on("dialog", (d) => d.accept());
  return { contexte, page, erreurs };
}

// ---------------------------------------------------------------
// 1. Le logo et le premier contenu
// ---------------------------------------------------------------

const LIRE_LOGO_ET_CONTENU = () => {
  const logo = document.querySelector(".header .fitz-lockup");
  if (!logo) return { sansLogo: true };
  const header = logo.closest(".header");
  if (getComputedStyle(header).position !== "fixed" && getComputedStyle(header).position !== "sticky") return { sansEnTete: true };
  const l = logo.getBoundingClientRect();
  const exclu = (el) => el.closest(".header, .mnav-sheet, .mnav-tabbar, .skip-link, #pageLoader, [aria-hidden='true'], script, style, noscript");
  const visible = (el) => { const cs = getComputedStyle(el); const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none" && parseFloat(cs.opacity) > 0; };
  let premier = null;
  for (const el of document.body.querySelectorAll("*")) {
    if (exclu(el) || !visible(el)) continue;
    const texte = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join("").trim();
    if (!texte) continue;
    const r = el.getBoundingClientRect();
    if (!premier || r.top < premier.top) premier = { top: r.top, bottom: r.bottom, left: r.left, right: r.right, texte: texte.slice(0, 50), tag: el.tagName.toLowerCase() + (el.className && typeof el.className === "string" ? "." + el.className.trim().split(/\s+/)[0] : "") };
  }
  if (!premier) return { sansContenu: true };
  const chevauchent = !(premier.left >= l.right || premier.right <= l.left);
  return { logo: { top: l.top, bottom: l.bottom, left: l.left, right: l.right }, premier, ecart: premier.top - l.bottom, chevauchent };
};

async function logoEtContenu({ navigateur, base }) {
  const anomalies = [];
  const notes = [];
  let mesures = 0;
  let pire = null;
  for (const cible of PAGES_EN_TETE) {
    for (const t of TAILLES_LOGO) {
      const { contexte, page, erreurs } = await ouvrir(navigateur, base, { viewport: t.viewport, mobile: !!t.mobile });
      try {
        await page.goto(`${base}/${cible}`, { waitUntil: "domcontentloaded", timeout: 60000 });
        await page.waitForTimeout(700);
        await page.addStyleTag({ content: REVEAL });
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(120);
        const lu = await page.evaluate(LIRE_LOGO_ET_CONTENU);
        if (lu.sansLogo || lu.sansEnTete || lu.sansContenu) { /* page sans en-tête fixe : rien à mesurer */ }
        else {
          mesures += 1;
          // Si les deux boîtes se recouvrent horizontalement, il faut un
          // écart vertical d'au moins 24 px. Un contenu posé à DROITE du
          // logo (jamais au-dessus ni dessous) peut être plus haut.
          const ecart = lu.chevauchent ? lu.ecart : Math.max(lu.ecart, 24);
          if (pire === null || ecart < pire.ecart) pire = { ecart, cible, taille: t.nom, texte: lu.premier.texte };
          if (ecart < 24) anomalies.push(`${cible} @${t.nom} — le logo touche le premier contenu : écart ${Math.round(lu.ecart)} px (< 24) entre le bas du logo (${Math.round(lu.logo.bottom)}) et « ${lu.premier.texte} » (${lu.premier.tag}, haut ${Math.round(lu.premier.top)})`);
        }
      } catch (e) {
        anomalies.push(`${cible} @${t.nom} — ouverture : ${e.message.split("\n")[0].slice(0, 120)}`);
      }
      for (const e of erreurs) anomalies.push(`${cible} @${t.nom} — ${e}`);
      await contexte.close();
    }
  }
  notes.push(`logo / premier contenu : ${mesures} mesures (${PAGES_EN_TETE.length} pages × ${TAILLES_LOGO.length} tailles)${pire ? ` — écart minimal ${Math.round(pire.ecart)} px (${pire.cible} @${pire.taille}, « ${pire.texte} »)` : ""}`);
  return { anomalies, notes };
}

// ---------------------------------------------------------------
// 2. Le profil
// ---------------------------------------------------------------

const LIRE_PROFIL = () => {
  const interdites = /^(sparkles?|star|stars|wand)(-|$)/;
  const icones = [...document.querySelectorAll("[data-lucide]")].map((e) => e.getAttribute("data-lucide"))
    .concat([...document.querySelectorAll("svg.lucide")].map((s) => [...s.classList].find((c) => c.startsWith("lucide-") && c !== "lucide") || "").map((c) => c.replace(/^lucide-/, "")));
  const iconesInterdites = [...new Set(icones.filter((n) => interdites.test(n)))];
  // Un rond de case système VISIBLE : un radio dont la boîte rendue
  // dépasse 2 px et qui n'est pas retiré du flux visuel (clip).
  const radios = [...document.querySelectorAll('input[type="radio"]')];
  const rondsVisibles = radios.filter((i) => { const r = i.getBoundingClientRect(); const cs = getComputedStyle(i); return r.width > 2 && r.height > 2 && cs.visibility !== "hidden" && cs.display !== "none" && cs.clip === "auto"; }).map((i) => `${i.name}=${i.value}`);
  // Les cartes de niveau : icône avant le texte, jamais dessus.
  const cartes = [...document.querySelectorAll("#palierGrid .palier-option")];
  const chevauchements = [];
  for (const c of cartes) {
    const ic = c.querySelector(":scope > svg, :scope > i");
    const tx = c.querySelector(".palier-option-text");
    if (!ic || !tx) { chevauchements.push(`${c.dataset.value} : icône ou texte absent`); continue; }
    const a = ic.getBoundingClientRect(), b = tx.getBoundingClientRect();
    if (a.width === 0) { chevauchements.push(`${c.dataset.value} : icône de 0 px`); continue; }
    const separes = a.right + 4 <= b.left || b.right + 4 <= a.left || a.bottom <= b.top || b.bottom <= a.top;
    if (!separes) chevauchements.push(`${c.dataset.value} : icône ${Math.round(a.left)}–${Math.round(a.right)} / texte ${Math.round(b.left)}–${Math.round(b.right)}`);
    const coche = c.querySelector(".palier-option-check");
    const cocheVisible = coche && coche.getBoundingClientRect().width > 0;
    if (c.classList.contains("is-selected") && !cocheVisible) chevauchements.push(`${c.dataset.value} : carte choisie sans coche visible`);
    if (!c.classList.contains("is-selected") && cocheVisible) chevauchements.push(`${c.dataset.value} : coche visible sur une carte non choisie`);
  }
  const barre = document.querySelector(".profile-save-bar");
  const final = document.querySelector(".profile-save-final");
  return { iconesInterdites, rondsVisibles, cartes: cartes.length, chevauchements, barreCollante: !!barre, finalDansLeFlux: !!final && getComputedStyle(final).position === "static", hauteur: document.documentElement.scrollHeight };
};

// À une position de défilement donnée : chaque élément fixe ou collant
// visible (hors barre haute, barre d'onglets, feuille de menu) contre
// chaque champ ou bouton visible du formulaire.
const RECOUVREMENTS = () => {
  const visible = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none" && parseFloat(cs.opacity) > 0; };
  const flottants = [...document.querySelectorAll("body *")].filter((el) => {
    const p = getComputedStyle(el).position;
    if (p !== "fixed" && p !== "sticky") return false;
    if (el.closest(".journey-topbar, .mnav-tabbar, .mnav-sheet, .skip-link, #pageLoader, .save-toast, .fitz-select-list")) return false;
    return visible(el);
  });
  const champs = [...document.querySelectorAll("#profileForm input, #profileForm textarea, #profileForm button, #profileForm .fitz-select-trigger, #profileForm label.fitz-choice, #profileForm .palier-option")].filter((el) => visible(el) && !el.closest(".fitz-select-list"));
  const decrire = (el) => `${el.tagName.toLowerCase()}${el.id ? "#" + el.id : ""}${el.className && typeof el.className === "string" ? "." + el.className.trim().split(/\s+/)[0] : ""}`;
  const H = window.innerHeight;
  const out = [];
  for (const f of flottants) {
    const a = f.getBoundingClientRect();
    if (a.bottom <= 0 || a.top >= H) continue;
    for (const c of champs) {
      if (f.contains(c) || c.contains(f)) continue;
      const b = c.getBoundingClientRect();
      if (b.bottom <= 0 || b.top >= H) continue;
      const x = Math.min(a.right, b.right) - Math.max(a.left, b.left);
      const y = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      if (x > 2 && y > 2) out.push(`${decrire(f)} recouvre ${decrire(c)} (${Math.round(x)}×${Math.round(y)} px)`);
    }
  }
  return [...new Set(out)];
};

async function profil({ navigateur, base }) {
  const anomalies = [];
  const notes = [];
  for (const t of [{ nom: "1440", viewport: { width: 1440, height: 900 } }, { nom: "375", viewport: { width: 375, height: 812 }, mobile: true }]) {
    const { contexte, page, erreurs } = await ouvrir(navigateur, base, { viewport: t.viewport, mobile: !!t.mobile, session: { etudiant: ETUDIANT() } });
    try {
      await page.goto(`${base}/profile.html`, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForSelector("#palierGrid .palier-option", { timeout: 20000 });
      await page.waitForTimeout(900);
      await page.addStyleTag({ content: REVEAL });
      const lu = await page.evaluate(LIRE_PROFIL);
      if (lu.iconesInterdites.length) anomalies.push(`profile.html @${t.nom} — icône(s) interdite(s) : ${lu.iconesInterdites.join(", ")}`);
      if (lu.rondsVisibles.length) anomalies.push(`profile.html @${t.nom} — rond de case système visible : ${lu.rondsVisibles.slice(0, 6).join(", ")}`);
      if (lu.cartes !== 8) anomalies.push(`profile.html @${t.nom} — ${lu.cartes} cartes de niveau (8 attendues)`);
      for (const c of lu.chevauchements) anomalies.push(`profile.html @${t.nom} — carte de niveau : ${c}`);
      if (lu.barreCollante) anomalies.push(`profile.html @${t.nom} — la barre collante .profile-save-bar est encore là`);
      if (!lu.finalDansLeFlux) anomalies.push(`profile.html @${t.nom} — le bouton final « Enregistrer mon profil » n'est pas dans le flux`);
      // Le défilement : rien de fixe ni de collant ne recouvre un champ.
      const H = t.viewport.height;
      const pas = Math.max(200, Math.floor(H * 0.6));
      const recouvrements = new Set();
      let positions = 0;
      for (let y = 0; y <= lu.hauteur; y += pas) {
        await page.evaluate((v) => window.scrollTo(0, v), y);
        await page.waitForTimeout(80);
        for (const r of await page.evaluate(RECOUVREMENTS)) recouvrements.add(r);
        positions += 1;
      }
      for (const r of [...recouvrements].slice(0, 8)) anomalies.push(`profile.html @${t.nom} — pendant le défilement, ${r}`);
      notes.push(`profile.html @${t.nom} : ${lu.cartes} cartes, aucune icône interdite, ${lu.rondsVisibles.length} rond système, ${positions} positions de défilement, ${recouvrements.size} recouvrement(s)`);
    } catch (e) {
      anomalies.push(`profile.html @${t.nom} — ÉCHEC : ${e.message.split("\n")[0].slice(0, 140)}`);
    }
    for (const e of erreurs) anomalies.push(`profile.html @${t.nom} — ${e}`);
    await contexte.close();
  }
  return { anomalies, notes };
}

// ---------------------------------------------------------------
// 3. Les messages
// ---------------------------------------------------------------

const HAUTEUR_CLAVIER = 336;

const LIRE_MESSAGES = () => {
  const H = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--vvh")) || window.innerHeight;
  const boite = (sel) => { const el = document.querySelector(sel); if (!el) return null; const r = el.getBoundingClientRect(); return { top: r.top, bottom: r.bottom, left: r.left, right: r.right, height: r.height, width: r.width }; };
  const dedans = (b) => b && b.top >= -1 && b.bottom <= H + 1 && b.left >= -1 && b.right <= window.innerWidth + 1 && b.height > 0;
  return {
    H,
    innerH: window.innerHeight,
    saisie: boite("#messagesPageComposerHost .messages-composer textarea"),
    envoi: boite("#messagesPageComposerHost .messages-composer button[type='submit']"),
    verrou: boite("#messagesPageComposerHost .messages-composer-locked"),
    fil: boite("#messagesPageThread"),
    bouton: boite("#supportOpenBtn"),
    boutonCache: !document.getElementById("supportOpenBtn") || document.getElementById("supportOpenBtn").hidden,
    saisieDedans: dedans(boite("#messagesPageComposerHost .messages-composer textarea")),
    envoiDedans: dedans(boite("#messagesPageComposerHost .messages-composer button[type='submit']")),
    ancienneCarte: !!document.querySelector(".messages-support-card, #supportCard"),
    feuilleOuverte: !!document.getElementById("supportSheet") && !document.getElementById("supportSheet").hidden,
    carteFeuille: boite("#supportSheet .fitz-feuille-card"),
    ecritures: (window.__harnaisEcritures || []).map((e) => ({ op: e.op, chemin: e.chemin, texte: e.data && (e.data.text || e.data.texte) }))
  };
};

async function messages({ navigateur, base }) {
  const anomalies = [];
  const notes = [];
  for (const t of [{ nom: "390×844", viewport: { width: 390, height: 844 } }, { nom: "375×667", viewport: { width: 375, height: 667 } }]) {
    const { contexte, page, erreurs } = await ouvrir(navigateur, base, { viewport: t.viewport, mobile: true, session: { etudiant: CONSEILLER } });
    const ou = `messages.html @${t.nom}`;
    try {
      await page.goto(`${base}/messages.html`, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForSelector("#messagesPageComposerHost .messages-composer textarea", { timeout: 20000 });
      await page.waitForTimeout(900);
      await page.addStyleTag({ content: REVEAL });
      // a) clavier fermé
      let lu = await page.evaluate(LIRE_MESSAGES);
      if (lu.ancienneCarte) anomalies.push(`${ou} — la carte « Signaler un problème » est encore dans le flux de la page`);
      if (!lu.saisieDedans) anomalies.push(`${ou} — clavier fermé, la zone de saisie sort de l'écran : ${JSON.stringify(lu.saisie)} pour ${lu.H} px`);
      if (!lu.envoiDedans) anomalies.push(`${ou} — clavier fermé, le bouton d'envoi sort de l'écran : ${JSON.stringify(lu.envoi)} pour ${lu.H} px`);
      if (!lu.fil || lu.fil.height < t.viewport.height / 2) anomalies.push(`${ou} — le fil visible fait ${lu.fil ? Math.round(lu.fil.height) : 0} px, moins de la moitié de l'écran (${t.viewport.height / 2})`);
      if (lu.boutonCache) anomalies.push(`${ou} — le bouton « Signaler un problème » est masqué pour un client Conseiller`);
      const filFerme = lu.fil ? Math.round(lu.fil.height) : 0;
      // b) clavier simulé ouvert : le cadre visible perd 336 px (iPhone),
      // comme js/mobile-nav.js le lirait sur visualViewport.
      await page.evaluate((h) => { document.documentElement.style.setProperty("--vvh", (window.innerHeight - h) + "px"); document.documentElement.classList.add("kb-open"); }, HAUTEUR_CLAVIER);
      await page.focus("#messagesPageComposerHost .messages-composer textarea");
      await page.waitForTimeout(400);
      lu = await page.evaluate(LIRE_MESSAGES);
      if (!lu.saisieDedans) anomalies.push(`${ou} — clavier ouvert, la zone de saisie sort du cadre visible : ${JSON.stringify(lu.saisie)} pour ${lu.H} px`);
      if (!lu.envoiDedans) anomalies.push(`${ou} — clavier ouvert, le bouton d'envoi sort du cadre visible : ${JSON.stringify(lu.envoi)} pour ${lu.H} px`);
      // c) un message se tape et s'envoie
      await page.fill("#messagesPageComposerHost .messages-composer textarea", "Bonjour, ceci est un message du harnais.");
      await page.keyboard.press("Enter");
      await page.waitForTimeout(400);
      lu = await page.evaluate(LIRE_MESSAGES);
      const envoye = lu.ecritures.find((e) => e.op === "add" && e.chemin === `users/${UID}/messages` && /harnais/.test(e.texte || ""));
      if (!envoye) anomalies.push(`${ou} — le message tapé n'a pas été envoyé (écritures : ${JSON.stringify(lu.ecritures.map((e) => e.chemin).slice(0, 5))})`);
      // d) clavier refermé, la feuille « Signaler un problème »
      await page.evaluate(() => { document.documentElement.style.removeProperty("--vvh"); document.documentElement.classList.remove("kb-open"); });
      await page.click("#supportOpenBtn");
      await page.waitForTimeout(300);
      lu = await page.evaluate(LIRE_MESSAGES);
      if (!lu.feuilleOuverte) anomalies.push(`${ou} — le bouton n'ouvre pas la feuille`);
      else if (!lu.carteFeuille || lu.carteFeuille.bottom > lu.H + 1 || lu.carteFeuille.top < -1) anomalies.push(`${ou} — la feuille sort de l'écran : ${JSON.stringify(lu.carteFeuille)} pour ${lu.H} px`);
      await page.fill("#supportTexte", "Le harnais signale un problème de test.");
      await page.click("#supportSend");
      await page.waitForFunction(() => document.getElementById("supportSheet").hidden, null, { timeout: 4000 }).catch(() => {});
      lu = await page.evaluate(LIRE_MESSAGES);
      const signale = lu.ecritures.find((e) => e.op === "add" && e.chemin === "supportTickets" && /harnais/.test(e.texte || ""));
      if (!signale) anomalies.push(`${ou} — le signalement n'a pas été envoyé`);
      if (lu.feuilleOuverte) anomalies.push(`${ou} — la feuille ne s'est pas refermée après l'envoi`);
      // e) Échap et l'extérieur ferment la feuille
      await page.click("#supportOpenBtn");
      await page.waitForTimeout(200);
      await page.keyboard.press("Escape");
      await page.waitForTimeout(200);
      let ouverte = await page.evaluate(() => !document.getElementById("supportSheet").hidden);
      if (ouverte) anomalies.push(`${ou} — Échap ne ferme pas la feuille`);
      await page.click("#supportOpenBtn");
      await page.waitForTimeout(200);
      await page.mouse.click(8, 8);
      await page.waitForTimeout(200);
      ouverte = await page.evaluate(() => !document.getElementById("supportSheet").hidden);
      if (ouverte) anomalies.push(`${ou} — toucher l'extérieur ne ferme pas la feuille`);
      await page.click("#supportOpenBtn");
      await page.waitForTimeout(200);
      await page.click("#supportCloseBtn");
      await page.waitForTimeout(200);
      ouverte = await page.evaluate(() => !document.getElementById("supportSheet").hidden);
      if (ouverte) anomalies.push(`${ou} — la croix ne ferme pas la feuille`);
      notes.push(`${ou} : saisie et envoi dans l'écran (clavier fermé / ouvert), fil ${filFerme} px, message envoyé, signalement envoyé, feuille ouverte puis fermée (envoi, Échap, extérieur, croix)`);
    } catch (e) {
      anomalies.push(`${ou} — ÉCHEC : ${e.message.split("\n")[0].slice(0, 140)}`);
    }
    for (const e of erreurs) anomalies.push(`${ou} — ${e}`);
    await contexte.close();
  }
  // f) Un compte Pass Découverte seul voit le bouton — ET peut répondre :
  //    la messagerie est ouverte à tous les comptes, gratuits compris,
  //    depuis le 2026-09-23 (student_messaging dans DROITS_UNIVERSELS,
  //    js/plan-features.js ; doctrine de .claude/CLAUDE.md §6).
  {
    const { contexte, page, erreurs } = await ouvrir(navigateur, base, { viewport: { width: 390, height: 844 }, mobile: true, session: { etudiant: PASS_SEUL } });
    try {
      await page.goto(`${base}/messages.html`, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForSelector("#messagesPageComposerHost .messages-composer, #messagesPageComposerHost .messages-composer-locked", { timeout: 20000 });
      await page.waitForTimeout(700);
      const lu = await page.evaluate(LIRE_MESSAGES);
      if (lu.boutonCache) anomalies.push("messages.html (Pass Découverte seul) — le bouton « Signaler un problème » est masqué");
      if (lu.verrou) anomalies.push("messages.html (Pass Découverte seul) — la réponse est verrouillée alors que la messagerie est ouverte à tous les comptes (student_messaging, 2026-09-23)");
      if (!lu.saisie) anomalies.push("messages.html (Pass Découverte seul) — aucune zone de saisie : il doit pouvoir écrire à l'équipe");
      notes.push("messages.html (Pass Découverte seul) : bouton « Signaler un problème » visible, réponse ouverte");
    } catch (e) {
      anomalies.push(`messages.html (Pass Découverte seul) — ÉCHEC : ${e.message.split("\n")[0].slice(0, 140)}`);
    }
    for (const e of erreurs) anomalies.push(`messages.html (Pass Découverte seul) — ${e}`);
    await contexte.close();
  }
  return { anomalies, notes };
}

// ---------------------------------------------------------------
// 4. Le pied de page
// ---------------------------------------------------------------

const LIRE_BAS_DE_PAGE = () => {
  const visible = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none" && parseFloat(cs.opacity) > 0; };
  // Le bas RENDU d'un élément : rogné par tout ancêtre à overflow non
  // visible (le paragraphe d'une question de FAQ repliée dépasse sa
  // section à overflow:hidden — il n'est pas « collé au bas »).
  const basRendu = (el) => {
    let bas = el.getBoundingClientRect().bottom;
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      const ov = getComputedStyle(p).overflowY;
      if (ov !== "visible") bas = Math.min(bas, p.getBoundingClientRect().bottom);
    }
    return bas + window.scrollY;
  };
  let dernier = null;
  let premier = null;
  for (const el of document.body.querySelectorAll("*")) {
    if (el.closest(".mnav-sheet, .mnav-tabbar, script, style, [aria-hidden='true'], .fitz-fab-wrap, .fitz-select-list")) continue;
    // Le contenu d'un <details> replié n'est pas visible.
    const details = el.closest("details:not([open])");
    if (details && !el.closest("summary")) continue;
    const p = getComputedStyle(el).position;
    if (p === "fixed") continue;
    if (!visible(el)) continue;
    const texte = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join("").trim();
    if (!texte) continue;
    const bas = basRendu(el);
    if (!dernier || bas > dernier.bas) dernier = { bas, texte: texte.slice(0, 40) };
    const haut = el.getBoundingClientRect().top + window.scrollY;
    if (premier === null || haut < premier) premier = haut;
  }
  return { pied: !!document.querySelector("footer.footer"), hauteur: document.documentElement.scrollHeight, ecran: window.innerHeight, dernier, premier };
};

async function piedDePage({ navigateur, base }) {
  const anomalies = [];
  const notes = [];
  const marges = [];
  for (const cible of ["index.html", ...PAGES_SANS_PIED]) {
    for (const t of [{ nom: "1280", viewport: { width: 1280, height: 900 } }, { nom: "375", viewport: { width: 375, height: 812 }, mobile: true }]) {
      const { contexte, page, erreurs } = await ouvrir(navigateur, base, { viewport: t.viewport, mobile: !!t.mobile });
      try {
        await page.goto(`${base}/${cible}`, { waitUntil: "domcontentloaded", timeout: 60000 });
        await page.waitForTimeout(1200);
        await page.addStyleTag({ content: REVEAL });
        await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
        await page.waitForTimeout(300);
        const lu = await page.evaluate(LIRE_BAS_DE_PAGE);
        if (cible === "index.html") {
          if (!lu.pied) anomalies.push(`${cible} @${t.nom} — l'accueil a perdu son pied de page`);
        } else {
          if (lu.pied) anomalies.push(`${cible} @${t.nom} — un pied de page est encore là`);
          const marge = lu.dernier ? Math.round(lu.hauteur - lu.dernier.bas) : null;
          if (marge === null) anomalies.push(`${cible} @${t.nom} — aucun contenu texte visible`);
          else {
            marges.push(`${cible}@${t.nom}:${marge}`);
            if (marge < 16) anomalies.push(`${cible} @${t.nom} — le contenu est collé au bas de la page (${marge} px sous « ${lu.dernier.texte} »)`);
            // Une page qui ne défile pas (plus courte que l'écran) ne se
            // « termine » pas sur un vide si son contenu est centré : on
            // compare alors le blanc du haut à celui du bas.
            const sansDefilement = lu.hauteur <= lu.ecran + 1;
            const centree = sansDefilement && lu.premier !== null && Math.abs(lu.premier - marge) <= 120;
            if (marge > 320 && !centree) anomalies.push(`${cible} @${t.nom} — la page se termine sur un vide de ${marge} px sous « ${lu.dernier.texte} »${sansDefilement ? ` (page sans défilement, ${Math.round(lu.premier)} px de blanc en haut)` : ""}`);
          }
        }
      } catch (e) {
        anomalies.push(`${cible} @${t.nom} — ouverture : ${e.message.split("\n")[0].slice(0, 120)}`);
      }
      for (const e of erreurs) anomalies.push(`${cible} @${t.nom} — ${e}`);
      await contexte.close();
    }
  }
  notes.push(`pied de page : accueil seul ; marge basse (px) — ${marges.join(", ")}`);
  return { anomalies, notes };
}

export async function verifierFinitions({ navigateur, base }) {
  const anomalies = [];
  const notes = [];
  for (const bloc of [logoEtContenu, profil, messages, piedDePage]) {
    const r = await bloc({ navigateur, base });
    anomalies.push(...r.anomalies);
    notes.push(...r.notes);
  }
  return { anomalies: [...new Set(anomalies)], notes };
}
