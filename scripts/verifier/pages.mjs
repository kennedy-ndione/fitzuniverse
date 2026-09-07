/**
 * ============================================================
 * scripts/verifier/pages.mjs — le catalogue et la fiche
 * ============================================================
 *
 * Le harnais de profils vérifie le parcours de diagnostic. Ces
 * contrôles-ci vérifient les DEUX pages où le catalogue se montre au
 * public : la liste des bourses et la fiche d'une opportunité.
 *
 * Ils existent à cause d'un défaut mesuré le 2026-09-05 : la pastille
 * « Candidatures ouvertes » des cartes se calculait sur `isActive`, un
 * drapeau éditorial. 45 cartes sur 156 annonçaient l'inverse de ce que
 * disaient les échéances et le statut. Aucun test unitaire ne pouvait
 * le voir : le défaut n'était pas dans une fonction, il était dans le
 * fait qu'on n'appelait pas la bonne.
 *
 * D'où la forme de la vérification : on ne se contente pas de regarder
 * si la page s'affiche, on RECOMPTE en Node ce qu'elle devrait
 * afficher, et on compare au DOM. Une page qui cesserait d'appeler
 * etatCandidature() ferait immédiatement diverger les deux chiffres.
 * ============================================================
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { couperLeReseau } from "./hors-ligne.mjs";
import { etatCandidature, analyserEcheance, etatAffichable } from "../../js/echeance.js";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

const EXTENSIONS_BLOQUANTES = [".js", ".mjs", ".css", ".json", ".html"];

function attendu() {

  const catalogue = JSON.parse(
    fs.readFileSync(path.join(RACINE, "assets/data/catalogue.json"), "utf8")
  );

  const parBourse = new Map();

  for (const p of catalogue.programs) {
    if (!p.scholarshipId) continue;
    if (!parBourse.has(p.scholarshipId)) parBourse.set(p.scholarshipId, []);
    parBourse.get(p.scholarshipId).push(p);
  }

  // On compte PAR PASTILLE, pas par booléen : « Candidatures ouvertes »
  // et « Candidatures au fil de l'eau » sont toutes deux ouvertes, et
  // comparer un total à un seul libellé faisait diverger le compte
  // d'exactement un — bruit qui aurait fini par être ignoré.
  const badges = new Map();

  for (const bourse of catalogue.scholarships) {

    const liees = parBourse.get(bourse.id) || [];

    const etat = etatCandidature({
      statut: bourse.status,
      actif: bourse.isActive,
      echeances: liees.map((p) => p.deadline),
      periodeOuverture: bourse.periodeOuverture,
      verifieLe: bourse.verifieLe
    });

    badges.set(etat.badge, (badges.get(etat.badge) || 0) + 1);

  }

  // ---- LES PROGRAMMES TÉMOINS ----
  //
  // Ils sont choisis en REJOUANT l'état que la fiche affichera, avec
  // les deux statuts (programme ET bourse) comme le fait details.js —
  // pas en lisant la seule échéance du programme.
  //
  // Pourquoi : le 2026-09-05, après le lot 38, l'ancien choix a désigné
  // `bme-bachelor` comme « fiche ouverte » parce que son échéance
  // (15 janvier 2027) est future — alors que sa bourse est « pas encore
  // ouverte » et que la fiche affiche donc « Clôture annoncée ». Le
  // harnais a crié au loup sur un site parfaitement juste. Un contrôle
  // qui se trompe de témoin est pire que pas de contrôle : il fait
  // douter d'un déploiement sain.
  const etatDeLaFiche = (p) => {

    const b = catalogue.scholarships.find((x) => x.id === p.scholarshipId);
    if (!b) return null;

    return etatCandidature({
      statut: [p.status, b.status],
      actif: b.isActive,
      echeances: [p.deadline],
      periodeOuverture: p.periodeOuverture || b.periodeOuverture,
      verifieLe: p.verifieLe || b.verifieLe,
      echeanceVariable: p.echeanceVariable || b.echeanceVariable
    });

  };

  // Une valeur qui porte une année est une DATE affichée : c'est la
  // seule forme sur laquelle les contrôles de libellé ont un sens.
  const porteUneDate = (etat) => etat && /\d{4}/.test(etat.valeur);

  const avecEtat = catalogue.programs
    .filter((p) => p.deadline)
    .map((p) => ({ p, etat: etatDeLaFiche(p) }))
    .filter((x) => x.etat);

  // Pour la fiche close on PRÉFÈRE un témoin qui affiche encore une
  // date (c'est là que se jouait le défaut d'origine : une date
  // dépassée étiquetée « Date limite »), mais on se rabat sur une
  // fiche close sans date plutôt que de sauter le contrôle. Après le
  // lot 38, plus aucune échéance dépassée ne subsiste sous forme de
  // date — c'est une bonne nouvelle, ce n'est pas une raison de cesser
  // de vérifier la branche.
  const clos = (avecEtat.find((x) => x.etat.ton === "close" && porteUneDate(x.etat))
    || avecEtat.find((x) => x.etat.ton === "close") || {}).p;
  const ouvert = (avecEtat.find((x) => x.etat.ton === "ouverte" && porteUneDate(x.etat)) || {}).p;
  const attente = (avecEtat.find((x) => x.etat.ton === "attente") || {}).p;

  return { badges, total: catalogue.scholarships.length, clos, ouvert, attente };

}

async function ouvrir(navigateur, base, options = {}) {

  const contexte = await navigateur.newContext({
    viewport: options.large ? { width: 1280, height: 900 } : { width: 390, height: 844 },
    locale: "fr-FR"
  });

  await couperLeReseau(contexte, options);

  const page = await contexte.newPage();

  const erreurs = [];

  page.on("pageerror", (e) => erreurs.push(`Exception JavaScript : ${e.message}`));

  page.on("console", (m) => {
    if (m.type() !== "error") return;
    if (/Failed to load resource/i.test(m.text())) return;
    erreurs.push(`Erreur console : ${m.text()}`);
  });

  page.on("response", (r) => {
    const url = r.url();
    if (!url.startsWith(base) || r.status() < 400) return;
    const chemin = new URL(url).pathname.toLowerCase();
    if (EXTENSIONS_BLOQUANTES.some((x) => chemin.endsWith(x))) {
      erreurs.push(`Fichier absent (${r.status()}) : ${chemin}`);
    }
  });

  return { contexte, page, erreurs };

}

export async function verifierPagesCatalogue({ navigateur, base }) {

  const cible = attendu();

  const anomalies = [];
  const notes = [];

  // ---------- 1. La liste des bourses ----------
  {
    const { contexte, page, erreurs } = await ouvrir(navigateur, base);

    try {

      // `?all=1` depuis le 2026-09-06 : la vue PAR DÉFAUT n'affiche plus
      // que ~16 cartes (voir js/catalogue-vue.js — la page faisait
      // 103 077 px de haut). Ce contrôle-ci confronte les pastilles de
      // TOUT le catalogue à ce que Node recalcule : il lui faut donc
      // toutes les cartes. La vue par défaut a son propre contrôle, plus
      // bas.
      await page.goto(`${base}/scholarships.html?all=1`, { waitUntil: "domcontentloaded" });
      await page.waitForSelector(".scholarship-card .scholarship-card-status", { timeout: 20000 });

      const vu = await page.evaluate(() => {

        const pastilles = [...document.querySelectorAll(".scholarship-card-status")];
        const compte = {};

        for (const p of pastilles) {
          const t = p.textContent.trim();
          compte[t] = (compte[t] || 0) + 1;
        }

        // L'ordre, groupe par groupe : le rang doit être croissant
        // (ouverte 0, inconnue 1, close 2). Une carte ouverte qui
        // apparaîtrait après une close ferait revenir le défaut que le
        // tri corrige.
        // Même ordre que RANGS dans scholarships.js : ouverte, pas
        // encore ouverte, inconnue, close.
        const RANGS = {
          "Candidatures ouvertes": 0,
          "Candidatures au fil de l'eau": 0,
          "Candidatures pas encore ouvertes": 1,
          "Calendrier à confirmer": 2,
          "Candidatures closes": 3
        };

        const rang = (texte) => RANGS[texte] ?? 2;

        const desordres = [];
        const ouvertesParGroupe = [];

        for (const groupe of document.querySelectorAll(".catalog-country-group")) {

          const rangs = [...groupe.querySelectorAll(".scholarship-card-status")]
            .map((p) => rang(p.textContent.trim()));

          for (let i = 1; i < rangs.length; i += 1) {
            if (rangs[i] < rangs[i - 1]) {
              desordres.push(groupe.querySelector("h2")?.textContent?.trim() || "?");
              break;
            }
          }

          ouvertesParGroupe.push(rangs.filter((r) => r === 0).length);

        }

        return {
          cartes: document.querySelectorAll(".scholarship-card").length,
          compte,
          desordres,
          ouvertesParGroupe
        };

      });

      if (vu.desordres.length) {
        anomalies.push(`Cartes ouvertes affichées après des cartes closes dans : ${vu.desordres.join(", ")}.`);
      }

      for (let i = 1; i < vu.ouvertesParGroupe.length; i += 1) {
        if (vu.ouvertesParGroupe[i] > vu.ouvertesParGroupe[i - 1]) {
          anomalies.push(
            `Les sections pays ne sont plus triées par nombre de candidatures ouvertes ` +
            `(section ${i + 1} en compte ${vu.ouvertesParGroupe[i]}, la précédente ${vu.ouvertesParGroupe[i - 1]}).`
          );
          break;
        }
      }

      if (vu.cartes !== cible.total) {
        anomalies.push(`${vu.cartes} carte(s) affichée(s), ${cible.total} bourses au catalogue.`);
      }

      for (const [badge, n] of cible.badges) {
        const vus = vu.compte[badge] || 0;
        if (vus !== n) {
          anomalies.push(
            `${vus} carte(s) « ${badge} » à l'écran, ${n} attendue(s) d'après les échéances. ` +
            `La page n'applique pas etatCandidature().`
          );
        }
      }

      for (const badge of Object.keys(vu.compte)) {
        if (!cible.badges.has(badge)) {
          anomalies.push(`Pastille inattendue à l'écran : « ${badge} » (${vu.compte[badge]} fois).`);
        }
      }

      notes.push(`catalogue : ${vu.cartes} cartes — ${Object.entries(vu.compte).map(([k, n]) => `${n} ${k.toLowerCase()}`).join(", ")}`);
      notes.push(`ordre : ${vu.ouvertesParGroupe.length} sections pays, ouvertes en tête (${vu.ouvertesParGroupe.slice(0, 6).join(" ≥ ")} …)`);

    } catch (e) {
      anomalies.push(`ÉCHEC catalogue : ${e.message}`);
    }

    anomalies.push(...erreurs);
    await contexte.close();
  }

  // ---------- 1 bis. La vue par défaut A UNE FIN ----------
  //
  // Ajouté le 2026-09-06. Le contrôle ci-dessus regarde `?all=1`, donc
  // il ne verrait RIEN si la vue par défaut redevenait un mur de 156
  // cartes. Or c'est précisément ce qu'on vient de corriger : mesurée à
  // 390 px, la page passait de 103 077 px à ~12 000. On vérifie donc
  // l'étendue elle-même, sur les deux catalogues.
  for (const [page_, selCarte, total] of [
    ["scholarships.html", ".scholarship-card", cible.total],
    ["universities.html", ".uni-card", null]
  ]) {

    const { contexte, page, erreurs } = await ouvrir(navigateur, base);

    try {

      await page.goto(`${base}/${page_}`, { waitUntil: "domcontentloaded" });
      await page.waitForSelector(selCarte, { timeout: 20000 });

      const vu = await page.evaluate((sel) => ({
        hauteur: document.documentElement.scrollHeight,
        deborde: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        cartes: document.querySelectorAll(sel).length,
        index: document.querySelectorAll(".catalog-country-index-pills .catalog-country-pill").length,
        portee: (document.getElementById("resultsCount") || {}).textContent || "",
        // Une pastille qui pointe encore vers « #country-… » est une
        // ancre : elle ferait défiler 40 000 px au lieu de filtrer.
        ancres: [...document.querySelectorAll("#countryPills .catalog-country-pill")]
          .filter((a) => (a.getAttribute("href") || "").startsWith("#")).length
      }), selCarte);

      // 30 écrans de téléphone : très au-dessus de la vue visée (~13),
      // très en dessous des 113 d'avant. Un seuil qui n'alerte que si la
      // découpe a réellement cessé de s'appliquer.
      if (vu.hauteur > 25000) {
        anomalies.push(`${page_} : la vue par défaut fait ${vu.hauteur} px de haut — la découpe par pays ne s'applique plus.`);
      }

      if (vu.deborde) anomalies.push(`${page_} : débordement horizontal à 390 px.`);
      if (vu.ancres) anomalies.push(`${page_} : ${vu.ancres} pastille(s) de pays pointent encore vers une ancre au lieu de filtrer.`);
      if (!vu.index) anomalies.push(`${page_} : la table des matières des pays a disparu — la vue courte cacherait alors le catalogue.`);
      if (!/\d/.test(vu.portee)) anomalies.push(`${page_} : aucune ligne d'étendue au-dessus de la liste.`);
      if (total !== null && vu.cartes >= total) {
        anomalies.push(`${page_} : ${vu.cartes} cartes affichées d'emblée sur ${total} — la vue par défaut n'est plus finie.`);
      }

      notes.push(`${page_} par défaut : ${vu.hauteur} px · ${vu.cartes} cartes · index ${vu.index} pays · « ${vu.portee.trim()} »`);

    } catch (e) {
      anomalies.push(`ÉCHEC vue par défaut ${page_} : ${e.message}`);
    }

    anomalies.push(...erreurs);
    await contexte.close();

  }

  // ---------- 2. Une fiche à cycle CLOS ----------
  if (cible.clos) {

    const { contexte, page, erreurs } = await ouvrir(navigateur, base);

    try {

      await page.goto(`${base}/scholarship-details.html?id=${encodeURIComponent(cible.clos.id)}`, { waitUntil: "domcontentloaded" });
      await page.waitForFunction(() => {
        const el = document.getElementById("deadline");
        return el && el.textContent.trim().length > 0;
      }, null, { timeout: 20000 });

      const vu = await page.evaluate(() => ({
        etiquette: document.getElementById("deadlineLabel")?.textContent?.trim() || "",
        valeur: document.getElementById("deadline")?.textContent?.trim() || "",
        note: document.getElementById("deadlineNote")?.textContent?.trim() || "",
        statut: document.getElementById("status")?.textContent?.trim() || ""
      }));

      if (vu.etiquette === "Date limite") {
        anomalies.push(`Fiche close : la date dépassée est encore étiquetée « Date limite » (${cible.clos.id}).`);
      }

      if (vu.statut !== "Candidatures closes") {
        anomalies.push(`Fiche close : statut affiché « ${vu.statut} » au lieu de « Candidatures closes » (${cible.clos.id}).`);
      }

      if (!/closes/i.test(vu.note)) {
        anomalies.push(`Fiche close : aucune explication sous l'échéance (${cible.clos.id}).`);
      }

      notes.push(`fiche close (${cible.clos.id}) : « ${vu.etiquette} : ${vu.valeur} » — ${vu.statut}`);

    } catch (e) {
      anomalies.push(`ÉCHEC fiche close : ${e.message}`);
    }

    anomalies.push(...erreurs);
    await contexte.close();

  } else {
    notes.push("aucun programme à échéance dépassée dans le catalogue — contrôle de la fiche close sauté.");
  }

  // ---------- 3. Une fiche à cycle OUVERT ----------
  if (cible.ouvert) {

    const { contexte, page, erreurs } = await ouvrir(navigateur, base);

    try {

      await page.goto(`${base}/scholarship-details.html?id=${encodeURIComponent(cible.ouvert.id)}`, { waitUntil: "domcontentloaded" });
      await page.waitForFunction(() => {
        const el = document.getElementById("deadline");
        return el && el.textContent.trim().length > 0;
      }, null, { timeout: 20000 });

      const vu = await page.evaluate(() => ({
        etiquette: document.getElementById("deadlineLabel")?.textContent?.trim() || "",
        valeur: document.getElementById("deadline")?.textContent?.trim() || "",
        note: document.getElementById("deadlineNote")?.textContent?.trim() || "",
        statut: document.getElementById("status")?.textContent?.trim() || ""
      }));

      if (vu.etiquette !== "Date limite") {
        anomalies.push(`Fiche ouverte : étiquette « ${vu.etiquette} » au lieu de « Date limite » (${cible.ouvert.id}).`);
      }

      if (!/\d{4}/.test(vu.valeur)) {
        anomalies.push(`Fiche ouverte : aucune date affichée (« ${vu.valeur} », ${cible.ouvert.id}).`);
      }

      if (!/reste/i.test(vu.note)) {
        anomalies.push(`Fiche ouverte : le décompte de jours restants ne s'affiche pas (${cible.ouvert.id}).`);
      }

      // Le texte du catalogue doit rester lisible SOUS l'état calculé.
      // Depuis que la case affiche l'échéance lue et non le champ brut,
      // c'est le seul endroit où survivent l'heure, le fuseau, le
      // millésime de la campagne et les portes d'entrée intermédiaires.
      // Quand le champ `deadline` ne contient QUE la date (« 15 février
      // 2027 »), il n'y a rien à réafficher : details.js ne répète pas
      // ce que la case dit déjà. L'assertion ne vaut donc que si la
      // prose porte davantage — c'est le cas qui nous intéresse.
      const proseUtile = cible.ouvert.deadline.trim() !== vu.valeur.trim();

      if (proseUtile && !vu.note.includes(cible.ouvert.deadline.slice(0, 30))) {
        anomalies.push(
          `Fiche ouverte : le texte du catalogue n'est plus affiché sous l'échéance (${cible.ouvert.id}). ` +
          `Attendu quelque part dans la note : « ${cible.ouvert.deadline.slice(0, 40)}… »`
        );
      }

      notes.push(`fiche ouverte (${cible.ouvert.id}) : « ${vu.etiquette} : ${vu.valeur} » — ${vu.note.slice(0, 60)}`);

    } catch (e) {
      anomalies.push(`ÉCHEC fiche ouverte : ${e.message}`);
    }

    anomalies.push(...erreurs);
    await contexte.close();

  }

  // ---------- 3 bis. Une fiche « pas encore ouverte » ----------
  if (cible.attente) {

    const { contexte, page, erreurs } = await ouvrir(navigateur, base);

    try {

      await page.goto(`${base}/scholarship-details.html?id=${encodeURIComponent(cible.attente.id)}`, { waitUntil: "domcontentloaded" });
      await page.waitForFunction(() => {
        const el = document.getElementById("deadline");
        return el && el.textContent.trim().length > 0;
      }, null, { timeout: 20000 });

      const vu = await page.evaluate(() => ({
        etiquette: document.getElementById("deadlineLabel")?.textContent?.trim() || "",
        valeur: document.getElementById("deadline")?.textContent?.trim() || "",
        note: document.getElementById("deadlineNote")?.textContent?.trim() || "",
        statut: document.getElementById("status")?.textContent?.trim() || ""
      }));

      if (vu.statut !== "Candidatures pas encore ouvertes") {
        anomalies.push(
          `Fiche « pas encore ouverte » : statut « ${vu.statut} » au lieu de ` +
          `« Candidatures pas encore ouvertes » (${cible.attente.id}). ` +
          `La fiche et la carte du catalogue se contredisent.`
        );
      }

      if (vu.etiquette !== "Clôture annoncée") {
        anomalies.push(`Fiche « pas encore ouverte » : étiquette « ${vu.etiquette} » au lieu de « Clôture annoncée » (${cible.attente.id}).`);
      }

      if (/reste \d+ jour/.test(vu.note)) {
        anomalies.push(`Fiche « pas encore ouverte » : un décompte de jours restants est affiché alors que le portail n'est pas ouvert (${cible.attente.id}).`);
      }

      notes.push(`fiche pas encore ouverte (${cible.attente.id}) : « ${vu.etiquette} : ${vu.valeur} » — ${vu.statut}`);

    } catch (e) {
      anomalies.push(`ÉCHEC fiche pas encore ouverte : ${e.message}`);
    }

    anomalies.push(...erreurs);
    await contexte.close();

  } else {
    notes.push("aucune bourse « pas encore ouverte » dans le catalogue — contrôle sauté.");
  }

  // ---------- 4. Le radar du Control Center ----------
  //
  // Une page d'outil qui plante à l'ouverture ne se remarque que le
  // jour où on en a besoin. Celle-ci recalcule le même radar que
  // `npm run radar` : on vérifie qu'elle s'ouvre, qu'elle rend un
  // tableau, et que son compte de contradictions est le même qu'en
  // ligne de commande — deux surfaces, un seul module (js/radar.js).
  {
    const { contexte, page, erreurs } = await ouvrir(navigateur, base, { admin: true, large: true });

    try {

      await page.goto(`${base}/admin/radar.html`, { waitUntil: "domcontentloaded" });

      if (page.url().includes("login.html")) {
        throw new Error("redirigée vers la connexion — la doublure admin n'a pas pris.");
      }

      await page.click("#radarBtn");

      await page.waitForSelector("#radarResult .audit-table", { timeout: 60000 });

      const vu = await page.evaluate(() => ({
        lignes: document.querySelectorAll("#radarResult tbody tr").length,
        resume: [...document.querySelectorAll(".radar-resume li")].map((li) => li.textContent.trim()),
        journalErreur: /Échec/.test(document.getElementById("radarLog")?.textContent || "")
      }));

      if (vu.journalErreur) anomalies.push("Le radar du Control Center a affiché un échec dans son journal.");
      if (!vu.lignes) anomalies.push("Le radar du Control Center n'affiche aucune ligne.");

      const contradictions = vu.resume.find((t) => t.includes("CONTRADICTION"));

      notes.push(`radar admin : ${vu.lignes} lignes de tableau — ${contradictions || "aucune contradiction"}`);

    } catch (e) {
      anomalies.push(`ÉCHEC radar admin : ${e.message}`);
    }

    anomalies.push(...erreurs);
    await contexte.close();

  }

  // ---------- 5. Le bandeau « Ouvert en ce moment » de l'accueil ----------
  //
  // Ajouté le 2026-09-05, après un défaut trouvé À L'ŒIL sur une
  // capture d'écran de Charles — pas par ce harnais, qui ne regardait
  // pas l'accueil. Le bandeau lisait la seule date du programme : une
  // date future suffisait à produire une carte « 31 jours restants »
  // sous un titre promettant des candidatures ouvertes, alors que le
  // catalogue affichait « pas encore ouvertes » pour la même bourse.
  // 13 des 34 cartes étaient dans ce cas.
  //
  // Le contrôle est donc une CONFRONTATION, pas une vérification de
  // forme : chaque carte du bandeau doit exister dans le catalogue
  // avec une pastille ouverte. Deux pages, une seule vérité.
  {
    const { contexte, page, erreurs } = await ouvrir(navigateur, base);

    try {

      await page.goto(`${base}/index.html`, { waitUntil: "domcontentloaded" });

      // Le bandeau se retire lui-même s'il n'a rien de sûr à montrer :
      // son absence n'est pas une anomalie, mais elle se dit.
      const present = await page.waitForSelector("#opportunitesTrack .opportunite", { timeout: 20000 })
        .then(() => true)
        .catch(() => false);

      if (!present) {

        notes.push("bandeau d'accueil : retiré (aucune échéance sûre) — vérifier que c'est voulu");

      } else {

        const vu = await page.evaluate(() => {

          // La seconde passe du carrousel est aria-hidden : on ne
          // compte les cartes qu'une fois.
          const cartes = [...document.querySelectorAll("#opportunitesTrack .opportunite")]
            .filter((a) => a.getAttribute("aria-hidden") !== "true");

          return {
            cartes: cartes.map((a) => ({
              nom: a.querySelector("h3")?.textContent.trim() || "",
              compte: a.querySelector(".opportunite-compte")?.textContent.trim() || ""
            })),
            lien: document.getElementById("opportunitesLienLabel")?.textContent.trim() || ""
          };

        });

        // Les mêmes titres, lus sur la page catalogue avec leur pastille.
        const etats = await page.evaluate(async () => {
          const { chargerCatalogue } = await import("/js/catalog-data.js");
          const { etatCandidature } = await import("/js/echeance.js");
          const cat = await chargerCatalogue();
          const parBourse = new Map();
          for (const p of cat.programmes) {
            if (!p.scholarshipId) continue;
            if (!parBourse.has(p.scholarshipId)) parBourse.set(p.scholarshipId, []);
            parBourse.get(p.scholarshipId).push(p.deadline);
          }
          const out = {};
          for (const b of cat.bourses) {
            out[b.title] = etatCandidature({
              statut: b.status, actif: b.isActive,
              echeances: parBourse.get(b.id) || [],
              periodeOuverture: b.periodeOuverture, verifieLe: b.verifieLe,
              echeanceVariable: b.echeanceVariable
            }).badge;
          }
          return out;
        }).catch(() => null);

        if (!etats) {

          anomalies.push("bandeau d'accueil : impossible de recalculer l'état des bourses pour la confrontation.");

        } else {

          for (const carte of vu.cartes) {
            const badge = etats[carte.nom];
            if (!badge) {
              anomalies.push(`Bandeau d'accueil : « ${carte.nom} » ne correspond à aucune bourse du catalogue.`);
            } else if (badge !== "Candidatures ouvertes" && badge !== "Candidatures au fil de l'eau") {
              anomalies.push(
                `Bandeau d'accueil : « ${carte.nom} » annonce « ${carte.compte} » alors que le catalogue ` +
                `affiche « ${badge} ». L'accueil ne passe pas par etatCandidature().`
              );
            }
          }

        }

        notes.push(`bandeau d'accueil : ${vu.cartes.length} carte(s), toutes ouvertes au catalogue — bouton « ${vu.lien} »`);

      }

    } catch (e) {
      anomalies.push(`ÉCHEC bandeau d'accueil : ${e.message}`);
    }

    anomalies.push(...erreurs);
    await contexte.close();

  }

  // ---------- 6. Le coût réel par université (lot D1, 2026-09-07) ----------
  //
  // Aujourd'hui aucune université du catalogue ne porte `fraisScolarite`
  // (la donnée arrive au lot D2) : le contrôle se fait sur deux FIXTURES
  // injectées dans l'instantané servi à la page — une AVEC frais
  // vérifiés (sourcés, datés), une SANS. Attendu : la première montre
  // un montant daté, la seconde « Frais non vérifiés », aucune des deux
  // ne dit « gratuit ». Puis le filtre de coût : « Tous » par défaut
  // laisse voir la bande « inconnu », une bande explicite la retire.
  {
    const { contexte, page, erreurs } = await ouvrir(navigateur, base, { large: true });

    try {

      const snapshot = JSON.parse(fs.readFileSync(path.join(RACINE, "assets/data/catalogue.json"), "utf8"));

      const ilYa = (jours) => {
        const d = new Date();
        d.setUTCDate(d.getUTCDate() - jours);
        return d.toISOString().slice(0, 10);
      };

      const fixtures = [
        {
          id: "harnais-frais-verifies", name: "Harnais Université Frais Vérifiés", country: "Harnais", city: "Fixture", image: "", flag: "",
          fraisScolarite: { licence: { montant: 3950, devise: "EUR", periode: "an" }, source: "https://exemple.invalid/frais", verifieLe: ilYa(10) },
          exoneration: { politique: "possible_plafonnee", detail: "Exonération sur dossier, contingentée", source: "https://exemple.invalid/exoneration", verifieLe: ilYa(10) }
        },
        { id: "harnais-frais-inconnus", name: "Harnais Université Frais Inconnus", country: "Harnais", city: "Fixture", image: "", flag: "" },
        // D1-bis : un zéro VÉRIFIÉ se dit « Gratuit », jamais « 0 € ».
        {
          id: "harnais-frais-gratuits", name: "Harnais Université Frais Gratuits", country: "Harnais", city: "Fixture", image: "", flag: "",
          fraisScolarite: { licence: { montant: 0, devise: "EUR", periode: "an" }, source: "https://exemple.invalid/frais-zero", verifieLe: ilYa(10) }
        }
      ];

      const programmes = fixtures.map((u) => ({ id: `${u.id}__prog`, universityId: u.id, scholarshipId: null, level: "Licence", language: "Français", status: "Ouvert", deadline: null }));

      const catalogue = { ...snapshot, universities: [...snapshot.universities, ...fixtures], programs: [...snapshot.programs, ...programmes] };

      // Enregistrée APRÈS couperLeReseau : la route la plus récente gagne.
      await page.route("**/assets/data/catalogue.json", (route) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(catalogue) }));

      await page.goto(`${base}/universities.html?search=harnais`, { waitUntil: "domcontentloaded" });
      await page.waitForSelector(".uni-card", { timeout: 20000 });

      const lire = () => page.evaluate(() => {
        const cartes = [...document.querySelectorAll(".uni-card")].map((c) => ({
          nom: c.querySelector("h3")?.textContent.trim() || "",
          cout: c.querySelector(".uni-card-chip.is-cost")?.textContent.replace(/\s+/g, " ").trim() || "",
          coutTitle: c.querySelector(".uni-card-chip.is-cost")?.getAttribute("title") || "",
          inconnu: c.querySelector(".uni-card-chip.is-cost-unknown")?.textContent.replace(/\s+/g, " ").trim() || "",
          exoneration: c.querySelector(".uni-card-chip.is-exoneration")?.textContent.replace(/\s+/g, " ").trim() || "",
          texte: c.textContent.replace(/\s+/g, " ")
        }));
        const select = document.getElementById("costFilter");
        return { cartes, filtre: select ? select.value : null, options: select ? [...select.options].map((o) => o.value) : [] };
      });

      const defaut = await lire();

      const verifiee = defaut.cartes.find((c) => /Frais Vérifiés/.test(c.nom));
      const inconnue = defaut.cartes.find((c) => /Frais Inconnus/.test(c.nom));
      const gratuite = defaut.cartes.find((c) => /Frais Gratuits/.test(c.nom));

      if (!verifiee || !inconnue || !gratuite) throw new Error(`fixtures non affichées (${defaut.cartes.map((c) => c.nom).join(", ")})`);

      if (!/^Gratuit\b/.test(gratuite.cout)) anomalies.push(`fixture à 0 € vérifié : la puce dit « ${gratuite.cout} » au lieu de « Gratuit ».`);
      if (/0\s*€/.test(gratuite.cout.replace(/[  ]/g, " "))) anomalies.push(`fixture à 0 € vérifié : « ${gratuite.cout} » affiche un zéro.`);
      if (!/vérifié le/i.test(gratuite.coutTitle)) anomalies.push("fixture à 0 € vérifié : la date de vérification manque dans le title.");

      if (defaut.filtre !== "") anomalies.push(`universities.html : le filtre de coût vaut « ${defaut.filtre} » par défaut au lieu de « Tous ».`);
      if (defaut.options.join(",") !== ",gratuit,abordable,eleve,inconnu") anomalies.push(`universities.html : options du filtre de coût « ${defaut.options.join(",")} ».`);

      if (!/3 950/.test(verifiee.cout.replace(/[  ]/g, " "))) anomalies.push(`fixture vérifiée : la puce de coût dit « ${verifiee.cout} » au lieu du montant 3 950 €/an.`);
      if (!/vérifié le/i.test(verifiee.coutTitle)) anomalies.push(`fixture vérifiée : la date de vérification manque dans le title (« ${verifiee.coutTitle} »).`);
      if (verifiee.inconnu) anomalies.push("fixture vérifiée : porte aussi « Frais non vérifiés ».");
      if (!/places limitées/i.test(verifiee.exoneration)) anomalies.push(`fixture vérifiée : puce d'exonération « ${verifiee.exoneration} ».`);

      if (inconnue.inconnu !== "Frais non vérifiés") anomalies.push(`fixture sans frais : « ${inconnue.inconnu} » au lieu de « Frais non vérifiés ».`);
      if (inconnue.cout) anomalies.push(`fixture sans frais : un montant s'affiche (« ${inconnue.cout} »).`);
      if (inconnue.exoneration) anomalies.push("fixture sans frais : une puce d'exonération s'affiche sans donnée.");

      for (const c of [verifiee, inconnue]) {
        if (/gratuit/i.test(c.texte)) anomalies.push(`${c.nom} : la carte contient « gratuit ».`);
      }

      // Le filtre : « eleve » ne garde que la fixture vérifiée ; retour à
      // « Tous » ramène la bande « inconnu ».
      const filtrer = async (valeur) => {
        await page.evaluate((v) => {
          const s = document.getElementById("costFilter");
          s.value = v;
          s.dispatchEvent(new Event("change", { bubbles: true }));
        }, valeur);
        return lire();
      };

      const eleve = await filtrer("eleve");
      if (eleve.cartes.length !== 1 || !/Frais Vérifiés/.test(eleve.cartes[0].nom)) anomalies.push(`filtre « eleve » : ${eleve.cartes.map((c) => c.nom).join(", ") || "aucune carte"} au lieu de la seule fixture vérifiée.`);

      const inconnuSeul = await filtrer("inconnu");
      if (inconnuSeul.cartes.length !== 1 || !/Frais Inconnus/.test(inconnuSeul.cartes[0].nom)) anomalies.push(`filtre « inconnu » : ${inconnuSeul.cartes.map((c) => c.nom).join(", ") || "aucune carte"} au lieu de la seule fixture sans frais.`);

      const gratuitSeul = await filtrer("gratuit");
      if (gratuitSeul.cartes.length !== 1 || !/Frais Gratuits/.test(gratuitSeul.cartes[0].nom)) anomalies.push(`filtre « gratuit » : ${gratuitSeul.cartes.map((c) => c.nom).join(", ") || "aucune carte"} au lieu de la seule fixture à 0 € vérifié.`);

      const tous = await filtrer("");
      if (tous.cartes.length !== 3) anomalies.push(`retour à « Tous » : ${tous.cartes.length} carte(s) au lieu de 3 — la bande « inconnu » n'est pas revenue.`);

      // Le lien porte le filtre (urlAvecFiltres) : une pastille de pays
      // rendue pendant qu'un coût est choisi doit le conserver. Les
      // pastilles n'existent qu'à partir de deux pays : on lève la
      // recherche (tout le catalogue, sans prix vérifié aujourd'hui)
      // et on choisit la bande « inconnu ».
      await page.evaluate(() => {
        const s = document.getElementById("searchInput");
        s.value = "";
        s.dispatchEvent(new Event("input", { bubbles: true }));
      });
      await filtrer("inconnu");
      const lien = await page.evaluate(() => document.querySelector("#countryPills .catalog-country-pill")?.getAttribute("href") || "");
      if (!/cost=inconnu/.test(lien)) anomalies.push(`urlAvecFiltres : la pastille de pays perd le filtre de coût (« ${lien} »).`);

      notes.push(`coût (fixtures) : « ${verifiee.cout} » / « ${inconnue.inconnu} » / « ${gratuite.cout} » · filtre eleve → 1, inconnu → 1, gratuit → 1, Tous → 3 · lien « ${lien.slice(0, 60)} »`);

    } catch (e) {
      anomalies.push(`ÉCHEC coût par université : ${e.message}`);
    }

    anomalies.push(...erreurs);
    await contexte.close();
  }

  return { anomalies, notes };

}
