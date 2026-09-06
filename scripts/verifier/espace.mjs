/**
 * ============================================================
 * scripts/verifier/espace.mjs — l'espace étudiant, session stubbée
 * ============================================================
 *
 * Le harnais de profils vérifie le diagnostic public ; pages.mjs, le
 * catalogue. Les deux s'arrêtaient à la porte de la session connectée
 * — et c'est derrière cette porte que vivaient les deux défauts de la
 * passe espace étudiant 1/3 (2026-09-06) : « Échéance dans N j » sur
 * un cycle que le catalogue dit clos, et une date unique pré-remplie
 * sur une bourse dont la date dépend du pays.
 *
 * Ce contrôle ouvre dashboard.html et applications.html HORS LIGNE,
 * avec un étudiant stubbé (voir le mode `etudiant` de hors-ligne.mjs)
 * dont les candidatures sont CHOISIES dans le catalogue réel :
 *
 *   slot-1  liée par sa clé à un programme dont la fiche est CLOSE,
 *           mais avec une date étudiante future — le cas exact du
 *           défaut. Attendu : aucun « Échéance dans », une pastille
 *           close, une alerte « cycle clos », hors du radar.
 *   slot-2  hors clé, en TEXTE (nom d'université + titre exacts) vers
 *           un programme OUVERT à date ferme, avec une date étudiante
 *           décalée. Attendu : le rattrapage écrit la clé (et
 *           seulement la clé), la divergence propose un bouton, et
 *           SEUL ce bouton écrit la `deadline`.
 *   slot-3  hors catalogue. Attendu : le rendu d'origine, inchangé.
 *
 * Comme pages.mjs : on ne regarde pas seulement si la page s'affiche,
 * on RECOMPTE en Node ce qu'elle doit dire et on compare au DOM.
 * ============================================================
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { couperLeReseau } from "./hors-ligne.mjs";
import { indexerCatalogue, etatDeLaCandidature, normaliserTitre } from "../../js/candidature-catalogue.js";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

const EXTENSIONS_BLOQUANTES = [".js", ".mjs", ".css", ".json", ".html"];

const UID = "harnais-etudiant";

function iso(d) {
  return d.toISOString().slice(0, 10);
}

function dansNJours(n) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + n);
  return iso(d);
}

/**
 * Choisit les témoins dans le catalogue réel et construit la session.
 * Rend null pour un témoin introuvable — le contrôle correspondant est
 * alors sauté, et dit pourquoi.
 */
function preparer() {

  const brut = JSON.parse(fs.readFileSync(path.join(RACINE, "assets/data/catalogue.json"), "utf8"));

  const catalogue = { programmes: brut.programs, universites: brut.universities, bourses: brut.scholarships };
  const index = indexerCatalogue(catalogue);

  const uniParId = index.uniParId;

  const lectures = brut.programs
    .filter((p) => p.scholarshipId && uniParId.has(p.universityId))
    .map((p) => ({ p, lecture: etatDeLaCandidature({ scholarshipId: p.scholarshipId, programId: p.id }, index) }))
    .filter((x) => x.lecture.lie && x.lecture.etat);

  // Témoin CLOS : la fiche dit close (ton "close").
  const clos = lectures.find((x) => x.lecture.etat.ton === "close");

  // Témoin OUVERT à date ferme, à plus de 20 jours (pour que la
  // prochaine action du tableau de bord ne soit pas une urgence sur
  // lui, mais bien le cycle clos), et déductible SANS ambiguïté par le
  // couple (université, titre) : un seul programme pour ce couple.
  const ouvert = lectures.find((x) => {
    const e = x.lecture.etat;
    if (e.ouvert !== true || e.jours === null || e.jours <= 20 || !x.lecture.dateCatalogue) return false;
    const freres = (index.programmesParBourse.get(x.p.scholarshipId) || []).filter((q) => q.universityId === x.p.universityId);
    const titre = x.lecture.bourse.title;
    return freres.length === 1 && index.bourseParTitreNorm.has(normaliserTitre(titre));
  });

  const commun = {
    status: "a_preparer",
    reminderFrequency: 14,
    nextCheckDate: dansNJours(10),
    notes: "",
    checklist: [],
    premiumProtected: false,
    isRecommendation: false,
    portalUrl: "",
    universityWebsite: ""
  };

  const applications = [];

  if (clos) {
    applications.push({
      ...commun,
      id: "slot-1",
      university: uniParId.get(clos.p.universityId).name,
      scholarship: clos.lecture.bourse.title,
      scholarshipId: clos.p.scholarshipId,
      programId: clos.p.id,
      universityId: clos.p.universityId,
      // Une date FUTURE gelée sur la fiche de l'étudiant : c'est elle
      // qui produisait « Échéance dans N j » vers une porte fermée.
      deadline: dansNJours(12)
    });
  }

  let dateDecalee = null;

  if (ouvert) {
    const d = new Date(`${ouvert.lecture.dateCatalogue}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() - 5);
    dateDecalee = iso(d);
    applications.push({
      ...commun,
      id: "slot-2",
      university: uniParId.get(ouvert.p.universityId).name,
      scholarship: ouvert.lecture.bourse.title,
      deadline: dateDecalee
    });
  }

  applications.push({
    ...commun,
    id: "slot-3",
    university: "Université de Nulle Part",
    scholarship: "Bourse maison",
    deadline: dansNJours(40)
  });

  const userData = {
    uid: UID,
    name: "Harnais",
    email: "harnais@fitz.local",
    // Formule « essentiel » : suivi des candidatures ouvert, quota 5 —
    // Fitz voudra donc pré-remplir des créneaux (setDoc consignés, pas
    // exécutés) ; c'est le comportement normal, on ne le bride pas.
    plan: "essentiel",
    planExpiresAt: dansNJours(90),
    profile: {
      name: "Harnais", email: "harnais@fitz.local",
      originCountry: "Sénégal", nationality: "Sénégalaise", age: "22",
      currentDegree: "Licence", academicAverage: "14", englishLevel: "Bon niveau",
      desiredField: "Informatique", desiredCountry: "France"
    }
  };

  return { index, applications, userData, clos, ouvert, dateDecalee };

}

async function ouvrir(navigateur, base, etudiant) {

  const contexte = await navigateur.newContext({ viewport: { width: 1280, height: 900 }, locale: "fr-FR" });

  await couperLeReseau(contexte, { etudiant });

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
    if (EXTENSIONS_BLOQUANTES.some((x) => chemin.endsWith(x))) erreurs.push(`Fichier absent (${r.status()}) : ${chemin}`);
  });

  return { contexte, page, erreurs };

}

export async function verifierEspaceEtudiant({ navigateur, base }) {

  const cible = preparer();
  const etudiant = { uid: UID, userData: cible.userData, applications: cible.applications };

  const anomalies = [];
  const notes = [];

  if (!cible.clos) notes.push("aucun programme à fiche close dans le catalogue — contrôle du cycle clos sauté.");
  if (!cible.ouvert) notes.push("aucun programme ouvert à date ferme (> 20 j) déductible sans ambiguïté — contrôle du rattrapage sauté.");

  // ---------- 1. applications.html ----------
  {
    const { contexte, page, erreurs } = await ouvrir(navigateur, base, etudiant);

    try {

      await page.goto(`${base}/applications.html`, { waitUntil: "domcontentloaded" });

      if (page.url().includes("login.html")) throw new Error("redirigée vers la connexion — la doublure étudiant n'a pas pris.");

      await page.waitForSelector("#applicationsList .app-card", { timeout: 30000 });

      // Le rattrapage écrit après le premier rendu ; on attend que la
      // liste porte bien nos trois cartes.
      await page.waitForFunction(() => document.querySelectorAll("#applicationsList .app-card").length >= 3, null, { timeout: 15000 });

      const vu = await page.evaluate(() => {

        const carte = (id) => document.getElementById(id);
        const texte = (el) => (el ? el.textContent.replace(/\s+/g, " ").trim() : "");

        return {
          cartes: document.querySelectorAll("#applicationsList .app-card").length,
          echeances: document.querySelectorAll("#applicationsList .app-echeance").length,
          slot1: {
            present: !!carte("slot-1"),
            close: !!carte("slot-1")?.querySelector(".app-echeance.is-close"),
            texte: texte(carte("slot-1")?.querySelector(".app-card-meta")),
            alerte: texte(carte("slot-1")?.querySelector(".app-echeance-alerte")),
            bouton: !!carte("slot-1")?.querySelector("[data-reprendre-date]")
          },
          slot2: {
            present: !!carte("slot-2"),
            liee: !!carte("slot-2")?.querySelector(".app-echeance"),
            ouverte: !!carte("slot-2")?.querySelector(".app-echeance.is-ouverte"),
            alerte: texte(carte("slot-2")?.querySelector(".app-echeance-alerte")),
            boutonDate: carte("slot-2")?.querySelector("[data-reprendre-date]")?.dataset.date || null
          },
          slot3: {
            present: !!carte("slot-3"),
            liee: !!carte("slot-3")?.querySelector(".app-echeance"),
            texte: texte(carte("slot-3")?.querySelector(".app-card-meta"))
          },
          ecritures: (window.__harnaisEcritures || []).map((e) => ({ op: e.op, chemin: e.chemin, cles: Object.keys(e.data || {}) }))
        };

      });

      if (vu.cartes !== cible.applications.length) anomalies.push(`${vu.cartes} carte(s) affichée(s), ${cible.applications.length} candidatures stubbées.`);
      if (!vu.echeances) anomalies.push("Aucune .app-echeance rendue : les candidatures ne sont pas reliées au catalogue.");

      if (cible.clos) {
        if (!vu.slot1.close) anomalies.push(`slot-1 (${cible.clos.p.id}) : la fiche est close mais la carte ne porte pas .app-echeance.is-close.`);
        if (/Échéance dans|Il vous reste|Date limite :/.test(vu.slot1.texte)) anomalies.push(`slot-1 : un décompte ou « Date limite » s'affiche sur un cycle clos — « ${vu.slot1.texte.slice(0, 120)} »`);
        if (!/clos/i.test(vu.slot1.alerte)) anomalies.push("slot-1 : aucune alerte « cycle clos » alors que la date étudiante est future.");
        if (vu.slot1.bouton) anomalies.push("slot-1 : un bouton « Reprendre » est proposé alors qu'aucune date du catalogue n'existe.");
        notes.push(`slot-1 clos (${cible.clos.p.id}) : « ${vu.slot1.texte.slice(0, 90)} »`);
      }

      if (cible.ouvert) {
        if (!vu.slot2.liee) anomalies.push("slot-2 : candidature en texte non reliée — le rapprochement exact n'a pas fonctionné.");
        if (!vu.slot2.ouverte) anomalies.push("slot-2 : la fiche est ouverte mais la carte ne porte pas .app-echeance.is-ouverte.");
        if (vu.slot2.boutonDate !== cible.ouvert.lecture.dateCatalogue) anomalies.push(`slot-2 : bouton « Reprendre » attendu vers ${cible.ouvert.lecture.dateCatalogue}, trouvé ${vu.slot2.boutonDate}.`);

        const rattrapage = vu.ecritures.filter((e) => e.op === "update" && e.chemin.endsWith("/applications/slot-2"));
        if (rattrapage.length !== 1) anomalies.push(`slot-2 : ${rattrapage.length} écriture(s) de rattrapage au lieu d'une.`);
        else {
          const cles = rattrapage[0].cles.sort().join(",");
          if (cles !== "catalogueLieLe,programId,scholarshipId") anomalies.push(`slot-2 : le rattrapage écrit « ${cles} » au lieu de la seule clé (catalogueLieLe, programId, scholarshipId).`);
        }
        notes.push(`slot-2 ouvert (${cible.ouvert.p.id}) : clé écrite par rattrapage, bouton vers le ${cible.ouvert.lecture.dateCatalogue}`);
      }

      // LA règle : aucune écriture de `deadline` sans clic.
      const deadlines = vu.ecritures.filter((e) => e.cles.includes("deadline") && e.op !== "set");
      if (deadlines.length) anomalies.push(`${deadlines.length} écriture(s) de « deadline » sans clic de l'étudiant : ${deadlines.map((e) => e.chemin).join(", ")}`);

      // Le rattrapage ne touche jamais slot-1 (déjà liée) ni slot-3 (hors catalogue).
      const indus = vu.ecritures.filter((e) => e.op === "update" && /\/applications\/slot-(1|3)$/.test(e.chemin));
      if (indus.length) anomalies.push(`Écriture(s) de rattrapage indue(s) : ${indus.map((e) => e.chemin).join(", ")}`);

      if (vu.slot3.liee) anomalies.push("slot-3 (hors catalogue) : rendue comme liée.");
      if (!/Date limite :/.test(vu.slot3.texte)) anomalies.push(`slot-3 (hors catalogue) : le rendu d'origine « Date limite : … » a disparu — « ${vu.slot3.texte.slice(0, 80)} »`);

      // ---- Le clic : le seul chemin qui écrit la date
      if (cible.ouvert && vu.slot2.boutonDate) {

        await page.click('#slot-2 [data-reprendre-date]');

        await page.waitForFunction(() => (window.__harnaisEcritures || []).some((e) => e.op === "update" && "deadline" in (e.data || {})), null, { timeout: 10000 })
          .catch(() => anomalies.push("slot-2 : le clic sur « Reprendre » n'a rien écrit."));

        const ecrite = await page.evaluate(() => {
          const e = (window.__harnaisEcritures || []).find((x) => x.op === "update" && "deadline" in (x.data || {}));
          return e ? { chemin: e.chemin, deadline: e.data.deadline } : null;
        });

        if (ecrite && (!ecrite.chemin.endsWith("/applications/slot-2") || ecrite.deadline !== cible.ouvert.lecture.dateCatalogue)) {
          anomalies.push(`slot-2 : le clic a écrit ${ecrite.deadline} sur ${ecrite.chemin}, attendu ${cible.ouvert.lecture.dateCatalogue}.`);
        }

        if (ecrite) notes.push(`clic « Reprendre » : deadline ${ecrite.deadline} écrite sur ${ecrite.chemin.split("/").pop()} — et seulement là`);

      }

      // ---- Le sélecteur ne propose plus de porte fermée
      await page.click("#addApplicationBtn");
      await page.waitForSelector("#pickerList .apps-pick", { timeout: 20000 });

      const picker = await page.evaluate(() => ({
        propositions: document.querySelectorAll("#pickerList .apps-pick").length,
        closes: document.querySelectorAll("#pickerList .apps-pick-deadline.is-close").length,
        datesSurCloses: [...document.querySelectorAll("#pickerList .apps-pick-deadline.is-close")].filter((el) => /Échéance :/.test(el.textContent)).length
      }));

      if (!picker.propositions) anomalies.push("Sélecteur : aucune suggestion affichée.");
      if (picker.closes) anomalies.push(`Sélecteur : ${picker.closes} bourse(s) close(s) parmi les suggestions.`);
      if (picker.datesSurCloses) anomalies.push(`Sélecteur : « Échéance : … » sur ${picker.datesSurCloses} bourse(s) close(s).`);

      notes.push(`sélecteur : ${picker.propositions} suggestions, aucune close`);

    } catch (e) {
      anomalies.push(`ÉCHEC applications.html : ${e.message}`);
    }

    anomalies.push(...erreurs);
    await contexte.close();
  }

  // ---------- 2. dashboard.html ----------
  {
    const { contexte, page, erreurs } = await ouvrir(navigateur, base, etudiant);

    try {

      await page.goto(`${base}/dashboard.html`, { waitUntil: "domcontentloaded" });

      if (page.url().includes("login.html")) throw new Error("redirigée vers la connexion — la doublure étudiant n'a pas pris.");

      await page.waitForSelector("#jyApps .jy-card", { timeout: 30000 });

      const vu = await page.evaluate((nomClos) => {

        const cartes = [...document.querySelectorAll("#jyApps .jy-card")].map((c) => ({
          titre: c.querySelector("h3")?.textContent.trim() || "",
          pastille: c.querySelector(".jy-app-deadline")?.textContent.trim() || "",
          close: !!c.querySelector(".jy-app-deadline.is-close")
        }));

        const carteClose = nomClos ? cartes.find((c) => c.titre === nomClos) : null;

        return {
          cartes,
          carteClose,
          radar: [...document.querySelectorAll("#jyRadarChips .jy-radar-chip")].map((c) => c.textContent.trim()),
          radarVisible: !document.getElementById("jyRadar")?.hidden,
          action: {
            titre: document.getElementById("jyActionTitle")?.textContent.trim() || "",
            texte: document.getElementById("jyActionText")?.textContent.trim() || ""
          }
        };

      }, cible.clos ? cible.applications[0].university : null);

      if (cible.clos) {
        if (!vu.carteClose) anomalies.push("Tableau de bord : la carte de la candidature close est absente.");
        else {
          if (!vu.carteClose.close) anomalies.push(`Tableau de bord : la candidature close n'a pas la pastille is-close (« ${vu.carteClose.pastille} »).`);
          if (/Échéance dans/.test(vu.carteClose.pastille)) anomalies.push(`Tableau de bord : « ${vu.carteClose.pastille} » sur un cycle clos.`);
        }
        const nomClos = cible.applications[0].university;
        if (vu.radar.some((t) => t.startsWith(nomClos))) anomalies.push(`Radar : la candidature close (${nomClos}) compte à rebours — « ${vu.radar.join(" | ")} ».`);
        if (!/clos/i.test(vu.action.titre + vu.action.texte)) anomalies.push(`Prochaine action : « ${vu.action.titre} » — le cycle clos n'est pas signalé.`);
        if (/Il reste/.test(vu.action.texte) && new RegExp(nomClos).test(vu.action.texte)) anomalies.push(`Prochaine action : compte à rebours vers un cycle clos — « ${vu.action.texte} ».`);
      }

      notes.push(`tableau de bord : ${vu.cartes.length} dossiers — ${vu.cartes.map((c) => `${c.titre.slice(0, 24)} [${c.pastille.slice(0, 40)}]`).join(" · ")}`);
      notes.push(`radar : ${vu.radarVisible ? vu.radar.join(" | ") : "masqué"} — action : « ${vu.action.titre.slice(0, 70)} »`);

    } catch (e) {
      anomalies.push(`ÉCHEC dashboard.html : ${e.message}`);
    }

    anomalies.push(...erreurs);
    await contexte.close();
  }

  return { anomalies, notes };

}
