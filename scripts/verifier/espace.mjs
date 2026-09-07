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
import { etatCandidature } from "../../js/echeance.js";
import { lireExigences, deposeParUnTiers, elementsAAjouter } from "../../js/exigences.js";
import { DOCUMENTS, SLUGS } from "../../js/documents-data.js";

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

  // TÉMOINS DE LA PASSE 3/3 — choisis dans le catalogue réel :
  //   voie   : une bourse que l'étudiant NE DÉPOSE PAS lui-même (27 au
  //            catalogue). Elle doit afficher le bloc qui le dit.
  //   nue    : une bourse SANS `exigences` (57 au catalogue). Elle ne
  //            doit afficher AUCUN bloc — règle des trois valeurs.
  const avecVoie = lectures.find((x) => deposeParUnTiers(lireExigences(x.lecture.bourse)));
  const nue = lectures.find((x) => lireExigences(x.lecture.bourse).length === 0);

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

  if (avecVoie) {
    applications.push({
      ...commun,
      id: "slot-4",
      university: uniParId.get(avecVoie.p.universityId).name,
      scholarship: avecVoie.lecture.bourse.title,
      scholarshipId: avecVoie.p.scholarshipId,
      programId: avecVoie.p.id,
      deadline: null
    });
  }

  if (nue) {
    applications.push({
      ...commun,
      id: "slot-5",
      university: uniParId.get(nue.p.universityId).name,
      scholarship: nue.lecture.bourse.title,
      scholarshipId: nue.p.scholarshipId,
      programId: nue.p.id,
      deadline: null
    });
  }

  applications.push({
    ...commun,
    id: "slot-3",
    university: "Université de Nulle Part",
    scholarship: "Bourse maison",
    deadline: dansNJours(40)
  });

  // LOT A (chantier préinscription, 2026-09-07) — le parcours.
  //   slot-6  hors catalogue, écrite avec track:"preinscription". Attendu :
  //           la carte affiche « Préinscription » après rechargement.
  //   slot-3  ANCIENNE : aucun champ `track`. Attendu : « Bourse », et
  //           AUCUNE écriture de rattrapage — le défaut est à la lecture.
  applications.push({
    ...commun,
    id: "slot-6",
    university: "Université Témoin Préinscription",
    scholarship: "",
    track: "preinscription",
    deadline: null
  });

  // LOT E1 (2026-09-07) : une préinscription DÉJÀ enregistrée sur pre-1,
  // en préparation — le harnais y déclare un dépôt par numéro ; puis un
  // dépôt par capture sur slot-1.
  applications.push({
    ...commun,
    id: "pre-1",
    university: "Université Témoin Dépôt",
    scholarship: "",
    track: "preinscription",
    deadline: null
  });

  const userData = {
    uid: UID,
    name: "Harnais",
    email: "harnais@fitz.local",
    // Formule « accompagnement » : suivi des candidatures ouvert, quota 9
    // (« essentiel » plafonnait à 5, et le lot A ajoute un sixième témoin
    // puis ENREGISTRE une candidature via le formulaire — le quota doit
    // laisser la place). Fitz voudra donc pré-remplir des créneaux
    // (setDoc consignés, pas exécutés) ; c'est le comportement normal,
    // on ne le bride pas.
    plan: "accompagnement",
    planExpiresAt: dansNJours(90),
    // Grille B (2026-09-07) : le second forfait. Sans lui, l'enregistrement
    // d'une préinscription hors catalogue est refusé (garde-fou client,
    // firestore.rules fait foi) — c'est précisément ce qu'on veut voir
    // PASSER ici, sur l'identifiant pre-N.
    planPreinscription: "dossier-france",
    planPreinscriptionExpiresAt: dansNJours(200),
    // LOT B : deux documents déjà cochés sur documents.html — de quoi
    // rendre FAITE l'étape « Traductions et légalisations » de slot-6,
    // et elle seule (aucun justificatif de ressources).
    documentsObtained: { [SLUGS.traductions]: true, [SLUGS.legalisation]: true },
    profile: {
      name: "Harnais", email: "harnais@fitz.local",
      originCountry: "Sénégal", nationality: "Sénégalaise", age: "22",
      currentDegree: "Licence", academicAverage: "14", englishLevel: "Bon niveau",
      desiredField: "Informatique", desiredCountry: "France"
    }
  };

  // De quoi confronter la phase 02 : le badge que le CATALOGUE affiche
  // pour chaque bourse, recalcule en Node. Une opportunite proposee par
  // le hub ne doit jamais porter « Candidatures closes ».
  const badgeParTitre = new Map();

  for (const bourse of brut.scholarships) {
    const liees = (index.programmesParBourse.get(bourse.id) || []).map((p) => p.deadline);
    badgeParTitre.set(bourse.title, etatCandidature({
      statut: bourse.status, actif: bourse.isActive, echeances: liees,
      periodeOuverture: bourse.periodeOuverture, verifieLe: bourse.verifieLe,
      echeanceVariable: bourse.echeanceVariable
    }).badge);
  }

  return { index, applications, userData, clos, ouvert, dateDecalee, badgeParTitre, avecVoie, nue,
    totalBourses: brut.scholarships.length,
    totalVoie: brut.scholarships.filter((b) => deposeParUnTiers(lireExigences(b))).length,
    totalSansExigence: brut.scholarships.filter((b) => lireExigences(b).length === 0).length };

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

      // ---- LOT E1 : la preuve de dépôt ----
      //
      // 1. pre-1 : « Déposée » est proposée seulement une fois un numéro
      //    saisi ; l'enregistrement écrit status + preuveDepot.mode numero.
      // 2. slot-1 : la capture passe par l'envoi Storage (consigné), puis
      //    la preuve écrite porte le chemin users/{uid}/applications/slot-1/.
      {
        const declarer = async (id, { numero, fichier }) => {
          await page.click(`#${id} .app-edit-btn`);
          await page.waitForSelector("#preuveBlock:not([hidden])", { timeout: 10000 });
          const avant = await page.evaluate(() => ({
            deposeeBloquee: document.querySelector('#fieldStatus option[value="deposee"]').disabled,
            demande: document.getElementById("preuveDemande").textContent.trim()
          }));
          if (!avant.deposeeBloquee) anomalies.push(`${id} : « Déposée » est proposée AVANT toute déclaration de dépôt.`);
          if (!/numéro de dossier|transmis/i.test(avant.demande)) anomalies.push(`${id} : la phrase de demande est muette — « ${avant.demande} »`);
          if (numero) await page.fill("#preuveNumero", numero);
          if (fichier) await page.setInputFiles("#preuveFichier", fichier);
          await page.waitForFunction(() => !document.querySelector('#fieldStatus option[value="deposee"]').disabled, null, { timeout: 5000 })
            .catch(() => anomalies.push(`${id} : « Déposée » reste bloquée après la déclaration.`));
          await page.evaluate(() => { const s = document.getElementById("fieldStatus"); s.value = "deposee"; s.dispatchEvent(new Event("change", { bubbles: true })); });
          await page.evaluate(() => document.getElementById("applicationForm").requestSubmit());
          await page.waitForFunction((id) => (window.__harnaisEcritures || []).some((e) => e.op === "update" && e.chemin.endsWith("/applications/" + id) && e.data && e.data.preuveDepot), id, { timeout: 15000 })
            .catch(() => anomalies.push(`${id} : aucune écriture de preuveDepot après la déclaration.`));
          return page.evaluate((id) => {
            const e = (window.__harnaisEcritures || []).find((x) => x.op === "update" && x.chemin.endsWith("/applications/" + id) && x.data && x.data.preuveDepot);
            const up = (window.__harnaisEcritures || []).find((x) => x.op === "upload" && x.chemin.includes("/applications/" + id + "/"));
            return e ? { status: e.data.status, preuve: e.data.preuveDepot, upload: up ? { chemin: up.chemin, ...up.data } : null } : null;
          }, id);
        };

        const parNumero = await declarer("pre-1", { numero: "EF-2026-000123" });
        if (parNumero) {
          if (parNumero.status !== "deposee") anomalies.push(`pre-1 : statut écrit « ${parNumero.status} » au lieu de « deposee ».`);
          if (parNumero.preuve.mode !== "numero" || parNumero.preuve.numeroDossier !== "EF-2026-000123") anomalies.push(`pre-1 : preuve écrite ${JSON.stringify(parNumero.preuve)}.`);
          if (!/^\d{4}-\d{2}-\d{2}$/.test(parNumero.preuve.deposeLe)) anomalies.push("pre-1 : deposeLe n'est pas une date.");
          notes.push(`E1 pre-1 : déposée par numéro ${parNumero.preuve.numeroDossier}, le ${parNumero.preuve.deposeLe}`);
        }

        // Une vraie image (PNG 1×1) : la compression canvas la transforme en JPEG.
        const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==", "base64");
        const parCapture = await declarer("slot-1", { fichier: { name: "confirmation.png", mimeType: "image/png", buffer: png } });
        if (parCapture) {
          if (parCapture.preuve.mode !== "capture") anomalies.push(`slot-1 : mode « ${parCapture.preuve.mode} » au lieu de « capture ».`);
          if (parCapture.preuve.fichier !== `users/${UID}/applications/slot-1/preuve-depot.jpg`) anomalies.push(`slot-1 : chemin de capture « ${parCapture.preuve.fichier} ».`);
          if (!parCapture.upload) anomalies.push("slot-1 : aucun envoi Storage consigné avant l'écriture de la preuve.");
          else if (!/^image\/jpeg$/.test(parCapture.upload.type)) anomalies.push(`slot-1 : la capture envoyée est « ${parCapture.upload.type} » — la compression image n'a pas été appliquée.`);
          notes.push(`E1 slot-1 : déposée par capture (${parCapture.upload ? parCapture.upload.type + ", " + parCapture.upload.taille + " o" : "sans envoi"})`);
        }

        // La page est rechargée plus bas par les contrôles suivants : on
        // rend la main avec la liste telle qu'au départ.
        await page.reload({ waitUntil: "domcontentloaded" });
        await page.waitForFunction(() => document.querySelectorAll("#applicationsList .app-card").length >= 3, null, { timeout: 15000 });
      }

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
          // PASSE 3/3 — les exigences
          voie: {
            bloc: !!carte("slot-4")?.querySelector(".app-exigence-voie"),
            texte: texte(carte("slot-4")?.querySelector(".app-exigence-voie"))
          },
          nue: {
            present: !!carte("slot-5"),
            blocs: carte("slot-5") ? carte("slot-5").querySelectorAll(".app-exigences, .app-exigence-suggestion").length : -1
          },
          suggestions: [...document.querySelectorAll("[data-ajouter-dossier]")].map((b) => b.dataset.ajouterDossier),
          // LOT A — la pastille de parcours
          parcours: {
            slot3: texte(carte("slot-3")?.querySelector(".app-track-pill")),
            slot6: texte(carte("slot-6")?.querySelector(".app-track-pill"))
          },
          // LOT B — les étapes du stepper, par parcours
          etapes: {
            slot3: [...(carte("slot-3")?.querySelectorAll(".journey-step") || [])].map((b) => ({ id: b.dataset.journeyStep, label: texte(b.querySelector(".journey-step-label")), faite: b.classList.contains("is-done") })),
            slot6: [...(carte("slot-6")?.querySelectorAll(".journey-step") || [])].map((b) => ({ id: b.dataset.journeyStep, label: texte(b.querySelector(".journey-step-label")), faite: b.classList.contains("is-done") }))
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

      // ---- PASSE 3/3 : les exigences ----
      //
      // Chaque assertion « aucun X » commence par affirmer qu'il y avait
      // bien quelque chose à examiner : le contrôle « aucune bourse close
      // suggérée » de la passe 1 passait au vert parce que l'ensemble
      // était vide (leçon du 2026-09-06).

      if (!cible.avecVoie) {
        notes.push("aucune bourse « déposée par un tiers » dans le catalogue — contrôle sauté.");
      } else {
        notes.push(`témoin voie : ${cible.avecVoie.lecture.bourse.title.slice(0, 40)} (${cible.totalVoie} bourses concernées au catalogue)`);
        if (!vu.voie.bloc) {
          anomalies.push(`slot-4 : la bourse « ${cible.avecVoie.lecture.bourse.title.slice(0, 46)} » ne se dépose pas par l'étudiant, et la carte ne le dit pas.`);
        } else if (!/ne déposez pas/i.test(vu.voie.texte)) {
          anomalies.push(`slot-4 : bloc présent mais muet — « ${vu.voie.texte.slice(0, 80)} »`);
        }
      }

      if (!cible.nue) {
        notes.push("aucune bourse sans exigences dans le catalogue — contrôle sauté.");
      } else {
        notes.push(`témoin sans exigence : ${cible.nue.lecture.bourse.title.slice(0, 40)} (${cible.totalSansExigence} bourses sans le champ)`);
        if (!vu.nue.present) {
          anomalies.push("slot-5 : la candidature témoin « sans exigences » est absente.");
        } else if (vu.nue.blocs !== 0) {
          anomalies.push(`slot-5 : ${vu.nue.blocs} bloc(s) d'exigences affiché(s) pour une bourse SANS le champ — la règle des trois valeurs est violée.`);
        }
      }

      // Le bouton « Ajouter à mon dossier » n'écrit RIEN tant qu'il n'est
      // pas cliqué : on le vérifie sur le journal d'écritures, pas sur
      // l'apparence.
      const ecrituresChecklist = vu.ecritures.filter((e) => e.cles.includes("checklist"));
      if (ecrituresChecklist.length) {
        anomalies.push(`${ecrituresChecklist.length} écriture(s) de checklist SANS clic : ${ecrituresChecklist.map((e) => e.chemin).join(", ")}`);
      }

      notes.push(`suggestions de dossier proposées : ${vu.suggestions.length ? vu.suggestions.join(", ") : "aucune"}`);

      // LA règle : aucune écriture de `deadline` sans clic.
      const deadlines = vu.ecritures.filter((e) => e.cles.includes("deadline") && e.op !== "set");
      if (deadlines.length) anomalies.push(`${deadlines.length} écriture(s) de « deadline » sans clic de l'étudiant : ${deadlines.map((e) => e.chemin).join(", ")}`);

      // Le rattrapage ne touche jamais slot-1 (déjà liée) ni slot-3 (hors catalogue).
      const indus = vu.ecritures.filter((e) => e.op === "update" && /\/applications\/slot-(1|3)$/.test(e.chemin));
      if (indus.length) anomalies.push(`Écriture(s) de rattrapage indue(s) : ${indus.map((e) => e.chemin).join(", ")}`);

      // ---- LOT A : le parcours porté par la candidature ----
      //
      // Le test qui compte le plus : une candidature ANCIENNE (sans
      // `track`) se lit « Bourse » et ne provoque AUCUNE écriture. Le
      // défaut est à la lecture, jamais rattrapé en base.
      if (vu.parcours.slot6 !== "Préinscription") anomalies.push(`slot-6 (track:"preinscription") : pastille « ${vu.parcours.slot6} » au lieu de « Préinscription ».`);
      if (vu.parcours.slot3 !== "Bourse") anomalies.push(`slot-3 (sans track) : pastille « ${vu.parcours.slot3} » au lieu de « Bourse ».`);

      const rattrapagesParcours = vu.ecritures.filter((e) => e.op !== "set" && e.cles.includes("track"));
      if (rattrapagesParcours.length) anomalies.push(`${rattrapagesParcours.length} écriture(s) de « track » sur des candidatures existantes : ${rattrapagesParcours.map((e) => e.chemin).join(", ")} — le défaut doit rester à la lecture.`);

      const seedsSansParcours = vu.ecritures.filter((e) => e.op === "set" && /\/applications\/slot-\d+$/.test(e.chemin) && !e.cles.includes("track"));
      if (seedsSansParcours.length) anomalies.push(`${seedsSansParcours.length} créneau(x) créé(s) par Fitz SANS champ track : ${seedsSansParcours.map((e) => e.chemin).join(", ")}`);

      notes.push(`parcours : slot-6 « ${vu.parcours.slot6} », slot-3 ancienne « ${vu.parcours.slot3} », aucune écriture de rattrapage`);

      // ---- LOT B : chaque parcours a ses propres étapes ----
      //
      // Bourse (slot-3, sans track) : EXACTEMENT les étapes d'avant le
      // lot B. Préinscription (slot-6) : jamais « Lettre de motivation »
      // ni « Vérifiée par Fitz ». Le stub userData porte traductions +
      // légalisation obtenues : l'étape 3 de slot-6 doit être FAITE, la
      // 4 non — c'est la moitié « après rechargement » du contrôle du
      // clic « J'ai ce document » (section 3 ci-dessous).
      const idsBourse = vu.etapes.slot3.map((e) => e.id).join(",");
      if (idsBourse !== "profile,checklist,letter,readiness") anomalies.push(`slot-3 (bourse) : étapes « ${idsBourse} » au lieu de profile,checklist,letter,readiness.`);

      const idsPre = vu.etapes.slot6.map((e) => e.id).join(",");
      if (idsPre !== "profile,checklist,traductions,ressources") anomalies.push(`slot-6 (préinscription) : étapes « ${idsPre} » au lieu de profile,checklist,traductions,ressources.`);
      if (vu.etapes.slot6.some((e) => /Lettre de motivation|Vérifiée par Fitz/.test(e.label))) anomalies.push("slot-6 (préinscription) : une étape de concours (lettre / vérification Fitz) s'affiche.");

      const traductions = vu.etapes.slot6.find((e) => e.id === "traductions");
      const ressources = vu.etapes.slot6.find((e) => e.id === "ressources");
      if (traductions && !traductions.faite) anomalies.push("slot-6 : traductions + légalisation obtenues dans documentsObtained, mais l'étape « Traductions et légalisations » n'est pas faite.");
      if (ressources && ressources.faite) anomalies.push("slot-6 : « Preuve de ressources » faite alors qu'aucun justificatif n'est obtenu.");

      notes.push(`étapes : bourse [${vu.etapes.slot3.map((e) => e.label).join(" · ")}] — préinscription [${vu.etapes.slot6.map((e) => `${e.label}${e.faite ? " ✓" : ""}`).join(" · ")}]`);

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

      // ---- Le clic « Ajouter à mon dossier » : et LÀ, ça écrit ----
      //
      // L'autre moitié de la preuve. Vérifier qu'on n'écrit pas sans clic
      // ne vaut que si l'on montre aussi que le clic, lui, écrit — sinon
      // un bouton mort passerait le contrôle haut la main.
      if (vu.suggestions.length) {

        const cible2 = vu.suggestions[0];

        // La suggestion vit DANS la section « Dossier de candidature »,
        // repliée par défaut. L'étudiant l'ouvre avant de cliquer ; le
        // harnais fait pareil, sinon il testerait un bouton que personne
        // ne peut atteindre. C'est aussi ce qui justifie le libellé
        // « Fitz connaît les exigences de cette bourse » sur l'en-tête
        // replié : sans lui, rien n'inviterait à ouvrir.
        await page.click(`#${cible2} [data-action="toggle-checklist"]`);
        await page.waitForSelector(`#${cible2} [data-ajouter-dossier]`, { state: "visible", timeout: 10000 });

        await page.click(`#${cible2} [data-ajouter-dossier]`);

        await page.waitForFunction(
          () => (window.__harnaisEcritures || []).some((e) => "checklist" in (e.data || {})),
          null,
          { timeout: 10000 }
        ).catch(() => anomalies.push("Le clic « Ajouter à mon dossier » n'a rien écrit."));

        const ecrit = await page.evaluate(() => {
          const e = (window.__harnaisEcritures || []).find((x) => "checklist" in (x.data || {}));
          return e ? { chemin: e.chemin, items: (e.data.checklist || []).map((i) => ({ type: i.type, status: i.status, label: i.label })) } : null;
        });

        if (ecrit) {

          if (!ecrit.chemin.endsWith(`/applications/${cible2}`)) {
            anomalies.push(`Le clic a écrit sur ${ecrit.chemin} au lieu de ${cible2}.`);
          }

          if (!ecrit.items.length) {
            anomalies.push("Le clic a écrit une checklist VIDE.");
          }

          const mauvais = ecrit.items.filter((i) => i.status !== "manquant");
          if (mauvais.length) anomalies.push(`${mauvais.length} élément(s) ajouté(s) avec un statut autre que « manquant ».`);

          const horsType = ecrit.items.filter((i) => !["recommendation", "language_test", "financial_proof"].includes(i.type));
          if (horsType.length) anomalies.push(`${horsType.length} élément(s) d'un type inconnu de la checklist.`);

          notes.push(`clic « Ajouter à mon dossier » : ${ecrit.items.map((i) => `${i.label} [${i.status}]`).join(", ")} sur ${cible2}`);

        }

      } else {
        notes.push("aucune suggestion de dossier parmi les témoins — contrôle du clic sauté.");
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

      // ---- LOT A : le select de parcours dans le formulaire ----
      //
      // 1. Une bourse du catalogue verrouille le select sur « Bourse ».
      // 2. Hors catalogue, l'étudiant choisit « Préinscription » ; la
      //    seule écriture produite porte track:"preinscription".
      if (picker.propositions) {

        await page.click("#pickerList .apps-pick");
        await page.waitForSelector("#trackSection:not([hidden])", { timeout: 10000 });

        const verrou = await page.evaluate(() => {
          const s = document.getElementById("applicationTrack");
          return { valeur: s.value, verrouille: s.disabled, note: !document.getElementById("applicationTrackNote").hidden };
        });

        if (verrou.valeur !== "bourse" || !verrou.verrouille) anomalies.push(`Sélecteur : une bourse du catalogue choisie, le parcours vaut « ${verrou.valeur} » ${verrou.verrouille ? "verrouillé" : "MODIFIABLE"} au lieu de « bourse » verrouillé.`);
        if (!verrou.note) anomalies.push("Sélecteur : la note « Cette candidature suit une bourse du catalogue. » n'apparaît pas.");

        await page.click("#pickerChangeBtn");
        await page.waitForSelector("#manualModeBtn", { state: "visible", timeout: 10000 });
        await page.click("#manualModeBtn");
        await page.waitForSelector("#fieldUniversity", { state: "visible", timeout: 10000 });

        const libre = await page.evaluate(() => {
          const s = document.getElementById("applicationTrack");
          return { verrouille: s.disabled, note: !document.getElementById("applicationTrackNote").hidden };
        });

        if (libre.verrouille || libre.note) anomalies.push("Hors catalogue : le parcours reste verrouillé (ou la note du catalogue reste affichée).");

        // Le select natif est habillé par js/fitz-select.js : on pose la
        // valeur sur le natif et on prévient le formulaire.
        await page.evaluate(() => {
          const s = document.getElementById("applicationTrack");
          s.value = "preinscription";
          s.dispatchEvent(new Event("change", { bubbles: true }));
        });
        await page.fill("#fieldUniversity", "Université Enregistrée en Préinscription");
        await page.evaluate(() => document.getElementById("applicationForm").requestSubmit());

        await page.waitForFunction(
          () => (window.__harnaisEcritures || []).some((e) => e.op === "set" && e.data && e.data.university === "Université Enregistrée en Préinscription"),
          null,
          { timeout: 10000 }
        ).catch(() => anomalies.push("Enregistrement hors catalogue en « Préinscription » : rien n'a été écrit."));

        const enregistree = await page.evaluate(() => {
          const e = (window.__harnaisEcritures || []).find((x) => x.op === "set" && x.data && x.data.university === "Université Enregistrée en Préinscription");
          return e ? { chemin: e.chemin, track: e.data.track, scholarshipId: e.data.scholarshipId ?? null } : null;
        });

        if (enregistree) {
          if (enregistree.track !== "preinscription") anomalies.push(`Enregistrement hors catalogue : track « ${enregistree.track} » écrit au lieu de « preinscription ».`);
          if (enregistree.scholarshipId) anomalies.push("Enregistrement hors catalogue : une clé de bourse a été écrite.");
          // Grille B : une préinscription vit sur pre-N, jamais sur slot-N.
          if (!/\/applications\/pre-\d+$/.test(enregistree.chemin)) anomalies.push(`Enregistrement hors catalogue : écrit sur ${enregistree.chemin} au lieu d'un identifiant pre-N.`);
          notes.push(`formulaire : « Préinscription » écrite sur ${enregistree.chemin.split("/").pop()} (track=${enregistree.track})`);
        }

      }

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
          // PHASE 02 — passe 2/3 : le hub sert desormais la MEME selection
          // que le diagnostic gratuit (retenirOpportunites). La phrase et
          // les cartes doivent en decouler.
          phrase02: document.getElementById("jyOppsSub")?.textContent.trim() || "",
          opportunites: [...document.querySelectorAll("#jyOpps .jy-opp")].map((c) => ({
            bourse: c.querySelector("h3")?.textContent.trim() || "",
            universite: c.querySelector(".jy-opp-uni")?.textContent.trim() || ""
          })),
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

      // ---- PHASE 02 : la phrase, et surtout ce qu'elle promet ----
      //
      // « Fitz a retenu N … dont M ouvertes » : le N doit etre celui de
      // la SELECTION, pas la taille du catalogue, et aucune des cartes
      // proposees ne doit viser un cycle que la fiche declare clos. On ne
      // se fie pas au libelle : on RECALCULE l'etat de chaque bourse
      // proposee, comme pages.mjs le fait pour le bandeau d'accueil.
      const chiffres = vu.phrase02.match(/retenu (\d+) opportunit\S+ pour votre profil, dont (\d+)/);

      if (!chiffres) {
        anomalies.push(`Phase 02 : la phrase n'annonce pas « Fitz a retenu N … dont M » — « ${vu.phrase02.slice(0, 110)} »`);
      } else {

        const [, nTexte, mTexte] = chiffres;
        const n = Number(nTexte);
        const m = Number(mTexte);

        if (m > n) anomalies.push(`Phase 02 : ${m} ouvertes annoncees pour ${n} retenues — impossible.`);
        if (n >= cible.totalBourses) anomalies.push(`Phase 02 : ${n} retenues pour ${cible.totalBourses} bourses au catalogue — le hub ne selectionne plus rien.`);

        notes.push(`phase 02 : ${n} retenues dont ${m} ouvertes (catalogue : ${cible.totalBourses} bourses)`);

      }

      for (const opp of vu.opportunites) {
        const badge = cible.badgeParTitre.get(opp.bourse);
        if (!badge) {
          anomalies.push(`Phase 02 : « ${opp.bourse} » ne correspond a aucune bourse du catalogue.`);
        } else if (badge === "Candidatures closes") {
          anomalies.push(`Phase 02 : « ${opp.bourse} » est proposee alors que le catalogue affiche « ${badge} ».`);
        }
      }

      notes.push(`opportunites proposees : ${vu.opportunites.map((o) => o.bourse.slice(0, 34)).join(" · ") || "aucune"}`);

      notes.push(`tableau de bord : ${vu.cartes.length} dossiers — ${vu.cartes.map((c) => `${c.titre.slice(0, 24)} [${c.pastille.slice(0, 40)}]`).join(" · ")}`);
      notes.push(`radar : ${vu.radarVisible ? vu.radar.join(" | ") : "masqué"} — action : « ${vu.action.titre.slice(0, 70)} »`);

    } catch (e) {
      anomalies.push(`ÉCHEC dashboard.html : ${e.message}`);
    }

    anomalies.push(...erreurs);
    await contexte.close();
  }

  // ---------- 3. documents.html (lot B) ----------
  //
  // L'autre moitié du contrôle des étapes « documents » : le clic
  // « J'ai ce document » ÉCRIT bien users/{uid}.documentsObtained sous le
  // slug que le parcours lit (js/documents-data.js, SLUGS). On part d'un
  // étudiant SANS document obtenu, on coche Traductions puis
  // Légalisation, et on vérifie les deux écritures. Puis la 46e fiche
  // s'ouvre et son modal est complet.
  {
    const vierge = { ...etudiant, userData: { ...etudiant.userData, documentsObtained: {} } };
    const { contexte, page, erreurs } = await ouvrir(navigateur, base, vierge);

    try {

      await page.goto(`${base}/documents.html?categorie=administratif`, { waitUntil: "domcontentloaded" });

      if (page.url().includes("login.html")) throw new Error("redirigée vers la connexion — la doublure étudiant n'a pas pris.");

      await page.waitForSelector("#documentsContainer .doc-card", { timeout: 30000 });

      const cocher = async (titre) => {
        const carte = page.locator("#documentsContainer .doc-card", { has: page.locator("h3", { hasText: titre }) }).first();
        await carte.locator(".doc-card-obtained input").click();
      };

      await cocher("Traductions certifiées");
      await cocher("Légalisation / apostille");

      const vu = await page.evaluate(() => ({
        actif: document.querySelector("#categoryFilters .docs-category-chip.is-active")?.dataset.category ?? null,
        cartes: document.querySelectorAll("#documentsContainer .doc-card").length,
        ecritures: (window.__harnaisEcritures || []).filter((e) => e.op === "update").map((e) => ({ chemin: e.chemin, cles: Object.keys(e.data || {}), valeurs: Object.values(e.data || {}) }))
      }));

      if (vu.actif !== "administratif") anomalies.push(`documents.html?categorie=administratif : filtre actif « ${vu.actif} » — le lien des étapes du parcours n'atterrit pas sur la bonne catégorie.`);

      const attendues = [`documentsObtained.${SLUGS.traductions}`, `documentsObtained.${SLUGS.legalisation}`];
      for (const cle of attendues) {
        const e = vu.ecritures.find((x) => x.cles.includes(cle));
        if (!e) anomalies.push(`documents.html : le clic « J'ai ce document » n'a pas écrit « ${cle} ».`);
        else if (!e.chemin.endsWith(`/users/${UID}`) && e.chemin !== `users/${UID}`) anomalies.push(`documents.html : « ${cle} » écrite sur ${e.chemin} au lieu de users/${UID}.`);
        else if (e.valeurs[0] !== true) anomalies.push(`documents.html : « ${cle} » écrite à ${e.valeurs[0]} au lieu de true.`);
      }

      notes.push(`documents.html : ${vu.cartes} cartes en « administratif », clics « J'ai ce document » → ${vu.ecritures.map((e) => e.cles.join(",")).join(" ; ")}`);

      // La 46e fiche
      const fiche = page.locator("#documentsContainer .doc-card", { has: page.locator("h3", { hasText: "Légalisation / apostille" }) }).first();
      if (!(await fiche.count())) {
        anomalies.push("documents.html : la fiche « Légalisation / apostille » est absente.");
      } else {
        await fiche.click();
        await page.waitForSelector("#documentModal:not([hidden])", { timeout: 10000 });
        const modal = await page.evaluate(() => ({
          titre: document.getElementById("modalTitle")?.textContent.trim() || "",
          sections: document.querySelectorAll("#modalBody .docs-modal-section").length,
          texte: document.getElementById("modalBody")?.textContent.replace(/\s+/g, " ") || ""
        }));
        if (modal.titre !== "Légalisation / apostille") anomalies.push(`documents.html : modal ouvert sur « ${modal.titre} ».`);
        if (!/La Haye/.test(modal.texte) || !/consulaire/.test(modal.texte)) anomalies.push("documents.html : le modal de la 46e fiche ne distingue pas apostille (La Haye) et légalisation consulaire.");
        if (modal.sections < 4) anomalies.push(`documents.html : modal de la 46e fiche incomplet (${modal.sections} section(s)).`);
        notes.push(`46e fiche : modal « ${modal.titre} », ${modal.sections} sections (${DOCUMENTS.length} documents au total)`);
      }

    } catch (e) {
      anomalies.push(`ÉCHEC documents.html : ${e.message}`);
    }

    anomalies.push(...erreurs);
    await contexte.close();
  }

  return { anomalies, notes };

}
