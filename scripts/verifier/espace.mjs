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

import { couperLeReseau, estBruitConsole } from "./hors-ligne.mjs";
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

  // LOT S3 : la carte des portails ne vit plus dans l instantane public.
  // Le harnais la lit la ou la Cloud Function la lit, et la sert a la
  // doublure httpsCallable — un etudiant abonne doit voir ses portails.
  const portails = JSON.parse(fs.readFileSync(path.join(RACINE, "functions/data/catalogue-portails.json"), "utf8"));

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

  // LOT E2 (2026-09-07) : une préinscription vers l'Université de Bordeaux
  // (sur Études en France) — la carte doit afficher la procédure, avec au
  // moins une consigne ferme et au moins une « à confirmer ».
  const bordeaux = uniParId.get("universite-de-bordeaux-bordeaux");
  if (bordeaux) {
    applications.push({
      ...commun,
      id: "pre-2",
      university: bordeaux.name,
      scholarship: "",
      track: "preinscription",
      universityId: bordeaux.id,
      portalUrl: portails.universites[bordeaux.id] || "",
      deadline: null
    });
  }

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

  // LOT S3 : un programme dont l'université a un portail connu — c'est
  // la fiche sur laquelle on vérifie qu'un CLIENT voit bien son bouton,
  // avec la bonne URL, servie par la fonction et non par le catalogue.
  const programmeAvecPortail = brut.programs.find((p) => p.universityId && portails.universites[p.universityId]) || null;
  const ficheAvecPortail = programmeAvecPortail
    ? { id: programmeAvecPortail.id, portail: portails.universites[programmeAvecPortail.universityId] }
    : null;

  return { index, applications, userData, portails, ficheAvecPortail, clos, ouvert, dateDecalee, badgeParTitre, avecVoie, nue,
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
    if (estBruitConsole(m.text())) return;
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
  const etudiant = { uid: UID, userData: cible.userData, applications: cible.applications, portails: cible.portails };

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

      // ---- LOT E2 : la procédure de portail sur pre-2 (Université de Bordeaux) ----
      {
        const proc = await page.evaluate(() => {
          const carte = document.getElementById("pre-2");
          if (!carte) return null;
          const details = carte.querySelector(".app-procedure");
          const etapes = [...carte.querySelectorAll(".app-procedure-etape")];
          const stepper = [...carte.querySelectorAll("[data-journey-step]")].map((b) => b.dataset.journeyStep);
          return {
            details: !!details,
            resume: details ? details.querySelector("summary").textContent.replace(/\s+/g, " ").trim() : "",
            etapes: etapes.length,
            fermes: etapes.filter((e) => e.classList.contains("fiab-verifie_source_officielle")).length,
            aConfirmer: etapes.filter((e) => e.classList.contains("fiab-a_confirmer")).length,
            reserveVisible: etapes.filter((e) => /à confirmer lors de la première passe réelle/i.test(e.querySelector(".app-procedure-consigne")?.textContent || "")).length,
            paiement: etapes.some((e) => /85 000 F/.test(e.textContent) && /SUNU BANK/.test(e.textContent)),
            stepperEf: stepper.filter((id) => id.startsWith("ef_")).length,
            ordre: stepper.join(",")
          };
        });
        if (!proc) {
          notes.push("E2 : pas de carte pre-2 (Université de Bordeaux absente du catalogue ?) — contrôle sauté.");
        } else {
          if (!proc.details) anomalies.push("pre-2 (Bordeaux, préinscription) : aucune procédure de portail affichée.");
          if (proc.fermes < 1) anomalies.push("pre-2 : aucune consigne ferme (vérifiée sur la source officielle).");
          // « Au moins une consigne à confirmer » a sauté le 2026-09-08 :
          // la France n'en a plus aucune. C'était un contrôle de l'état
          // des DONNÉES à un instant, pas un invariant — il devenait faux
          // le jour où le travail de sourçage aboutissait, ce qui était
          // pourtant le but. L'invariant, lui, est juste en dessous et
          // tient dans les deux sens : autant de réserves visibles que
          // d'étapes à confirmer, y compris zéro et zéro.
          if (proc.reserveVisible !== proc.aConfirmer) anomalies.push(`pre-2 : ${proc.aConfirmer} étape(s) à confirmer mais ${proc.reserveVisible} réserve(s) visible(s) dans le texte.`);
          if (!proc.paiement) anomalies.push("pre-2 : l'étape de paiement (85 000 F, SUNU BANK) est absente.");
          if (proc.stepperEf < 5) anomalies.push(`pre-2 : le stepper ne porte que ${proc.stepperEf} étape(s) de procédure.`);
          if (!/ressources,ef_compte/.test(proc.ordre)) anomalies.push(`pre-2 : les étapes de procédure ne suivent pas « ressources » (${proc.ordre}).`);
          notes.push(`E2 pre-2 : ${proc.resume} — ${proc.fermes} fermes, ${proc.aConfirmer} à confirmer`);
        }
        // Le parcours BOURSE d'une université française ne reçoit aucune étape.
        const bourseEf = await page.evaluate(() => [...document.querySelectorAll('#applicationsList .app-card')].filter((c) => c.querySelector('.app-track-pill[data-track="bourse"]')).some((c) => c.querySelector(".app-procedure")));
        if (bourseEf) anomalies.push("E2 : une candidature BOURSE affiche une procédure de portail.");
      }

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

      // ---- LOT FITZ-CHOISIT (2026-09-11) : plus de sélecteur de catalogue.
      //
      // Le contrôle « le sélecteur ne propose plus de porte fermée » et
      // l'enregistrement d'une bourse DEPUIS le sélecteur (lot S4, point 2)
      // ont disparu avec lui : dans l'espace bourses, c'est Fitz qui
      // choisit — voir le bloc 7 plus bas, qui vérifie l'absence du
      // sélecteur, du lien hors catalogue et du bouton de création, puis
      // le refus d'une proposition. Ce client-ci a les DEUX parcours, mais
      // la page est ouverte dans l'espace BOURSES (lot S4 : l'espace
      // courant décide de ce qu'on crée) : le bouton y est masqué ; il
      // réapparaît une fois passé en préinscription (point 3 ci-dessous).
      const creation = await page.evaluate(() => ({
        bouton: !!document.getElementById("addApplicationBtn") && !document.getElementById("addApplicationBtn").hidden,
        selecteur: !!document.getElementById("pickerList") || !!document.getElementById("pickerSearch"),
        horsCatalogue: !!document.getElementById("manualModeBtn")
      }));
      if (creation.selecteur) anomalies.push("Formulaire : le sélecteur de catalogue est encore dans le DOM (lot FITZ-CHOISIT).");
      if (creation.horsCatalogue) anomalies.push("Formulaire : le lien « hors catalogue » est encore dans le DOM (lot FITZ-CHOISIT).");
      if (creation.bouton) anomalies.push("Espace bourses : le bouton « Nouvelle candidature » est encore visible (lot FITZ-CHOISIT).");

      // ---- LOT S4 : l'ESPACE impose le parcours, il n'y a plus de select ----
      //
      // Le sélecteur « Ce que vise cette candidature » a disparu du
      // formulaire : on ne demande plus à quelqu'un de choisir dans un
      // menu ce qu'il vient d'acheter. Ce qu'on vérifie maintenant :
      //   1. le select n'est nulle part dans le DOM ;
      //   3. dans l'espace PRÉINSCRIPTION, la saisie manuelle part en
      //      track="preinscription" sur un pre-N — sans qu'on ait rien
      //      choisi. (Le point 2, la bourse enregistrée depuis le
      //      sélecteur, n'existe plus : lot FITZ-CHOISIT.)
      {

        const selectPresent = await page.evaluate(() => ({
          select: !!document.getElementById("applicationTrack"),
          section: !!document.getElementById("trackSection")
        }));
        if (selectPresent.select || selectPresent.section) {
          anomalies.push("Formulaire : le sélecteur de parcours est encore dans le DOM — l'espace doit imposer le parcours.");
        }

        // 3. Espace PRÉINSCRIPTION : on bascule comme le ferait le
        //    sélecteur de barre haute (sessionStorage, js/app-shell.js),
        //    puis on saisit hors catalogue. Rien d'autre ne change.
        await page.evaluate(() => sessionStorage.setItem("fitz.espace", "preinscription"));
        await page.goto(`${base}/applications.html?action=new`, { waitUntil: "domcontentloaded" });
        await page.waitForSelector("#applicationModal", { state: "visible", timeout: 20000 });

        const espaceRendu = await page.evaluate(() => ({
          body: document.body.dataset.espace || "",
          selectEncoreLa: !!document.getElementById("applicationTrack"),
          slotsVisibles: [...document.querySelectorAll("#applicationsList .app-card")].map((c) => c.id).filter((id) => /^slot-/.test(id))
        }));

        if (espaceRendu.body !== "preinscription") anomalies.push(`Bascule : la page reste dans l'espace « ${espaceRendu.body} » après le passage en préinscription.`);
        if (espaceRendu.selectEncoreLa) anomalies.push("Bascule : le sélecteur de parcours est réapparu.");

        await page.waitForSelector("#manualModeBtn", { state: "visible", timeout: 10000 }).catch(() => {});
        const manuel = await page.$("#manualModeBtn");
        if (manuel) await manuel.click();
        await page.waitForSelector("#fieldUniversity", { state: "visible", timeout: 10000 });

        await page.fill("#fieldUniversity", "Université Enregistrée en Préinscription");
        await page.evaluate(() => document.getElementById("applicationForm").requestSubmit());

        await page.waitForFunction(
          () => (window.__harnaisEcritures || []).some((e) => e.op === "set" && e.data && e.data.university === "Université Enregistrée en Préinscription"),
          null,
          { timeout: 10000 }
        ).catch(() => anomalies.push("Espace préinscription : rien n'a été écrit depuis le formulaire."));

        const enregistree = await page.evaluate(() => {
          const e = (window.__harnaisEcritures || []).find((x) => x.op === "set" && x.data && x.data.university === "Université Enregistrée en Préinscription");
          return e ? { chemin: e.chemin, track: e.data.track, scholarshipId: e.data.scholarshipId ?? null } : null;
        });

        if (enregistree) {
          // LA vérification du lot : le parcours vient de l'ESPACE, sans
          // qu'aucun menu n'ait été touché.
          if (enregistree.track !== "preinscription") anomalies.push(`Espace préinscription : track « ${enregistree.track} » écrit au lieu de « preinscription ».`);
          if (enregistree.scholarshipId) anomalies.push("Espace préinscription : une clé de bourse a été écrite.");
          // Grille B : une préinscription vit sur pre-N, jamais sur slot-N.
          if (!/\/applications\/pre-\d+$/.test(enregistree.chemin)) anomalies.push(`Espace préinscription : écrit sur ${enregistree.chemin} au lieu d'un identifiant pre-N.`);
          notes.push(`formulaire : « ${enregistree.track} » écrite sur ${enregistree.chemin.split("/").pop()}, sans sélecteur — l'espace a décidé`);
        }

      }

    } catch (e) {
      anomalies.push(`ÉCHEC applications.html : ${e.message}`);
    }

    anomalies.push(...erreurs);
    await contexte.close();
  }

  // ---------- 2. le hub bourse (ex-dashboard.html) ----------
  {
    const { contexte, page, erreurs } = await ouvrir(navigateur, base, etudiant);

    try {

      // LOT S4 : dashboard.html n'est plus qu'un aiguillage — le hub
      // porte désormais son propre nom.
      await page.goto(`${base}/espace-bourse.html`, { waitUntil: "domcontentloaded" });

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
      anomalies.push(`ÉCHEC espace-bourse.html : ${e.message}`);
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

  // ---------- 4. scholarship-details.html, vue par un CLIENT (lot S3) ----------
  //
  // La contre-épreuve de ce que pages.mjs vérifie côté visiteur. Le
  // portail a quitté le catalogue public : il faut donc prouver qu'il
  // arrive quand même chez celui qui paie, et avec la BONNE URL — celle
  // de functions/data/catalogue-portails.json, servie par la fonction
  // `portails` (ici doublée). Sans ce contrôle, « les portails ont
  // disparu pour les clients » passerait pour un succès du lot.
  if (cible.ficheAvecPortail) {

    const { contexte, page, erreurs } = await ouvrir(navigateur, base, etudiant);

    try {

      await page.goto(`${base}/scholarship-details.html?id=${encodeURIComponent(cible.ficheAvecPortail.id)}`, { waitUntil: "domcontentloaded" });
      await page.waitForFunction(() => {
        const el = document.getElementById("title");
        return el && el.textContent.trim().length > 0;
      }, null, { timeout: 20000 });

      // Le bouton est peint après resolveSession() et chargerPortails() :
      // on attend qu'il apparaisse plutôt que de lire trop tôt.
      await page.waitForFunction(() => {
        const el = document.getElementById("applyBtn");
        return el && !el.hidden;
      }, null, { timeout: 20000 }).catch(() => {});

      const vu = await page.evaluate(() => {
        const apply = document.getElementById("applyBtn");
        return {
          visible: !!apply && !apply.hidden,
          href: apply ? apply.getAttribute("href") : ""
        };
      });

      if (!vu.visible) {
        anomalies.push(`fiche client : le bouton de portail est masqué pour un compte abonné (${cible.ficheAvecPortail.id}).`);
      } else if (vu.href !== cible.ficheAvecPortail.portail) {
        anomalies.push(`fiche client : le bouton pointe sur « ${vu.href} » au lieu du portail servi par la fonction (« ${cible.ficheAvecPortail.portail} »).`);
      }

      notes.push(`fiche client (${cible.ficheAvecPortail.id}) : bouton ${vu.visible ? "visible" : "MASQUÉ"} — ${String(vu.href).slice(0, 60)}`);

    } catch (e) {
      anomalies.push(`ÉCHEC fiche client : ${e.message}`);
    }

    anomalies.push(...erreurs);
    await contexte.close();
  }

  // ---------- 5. LES DEUX ESPACES, SOUS SESSION (lot S4) ----------
  //
  // Le lot demandait cette vérification « sous session réelle, avec deux
  // comptes de test ». Aucun mot de passe n'est saisi ici : le harnais
  // STUBBE la session, ce qui donne la même preuve, reproductible, et
  // sans identifiants à faire circuler. Trois profils, dérivés du même
  // étudiant témoin — seules les formules changent :
  //
  //   client BOURSE          plan actif, aucun forfait préinscription
  //   client PRÉINSCRIPTION  aucune formule bourse, dossier-france actif
  //   compte GRATUIT         ni l'un ni l'autre
  //
  // Ce qu'on lit : où l'on ATTERRIT, ce qui est ABSENT du DOM, et où
  // mène une URL forcée de l'autre espace.
  {

    const profil = (userData) => ({ ...etudiant, userData: { ...etudiant.userData, ...userData } });

    const CLIENT_BOURSE = profil({ plan: "conseiller-6", planExpiresAt: dansNJours(90), planPreinscription: "", planPreinscriptionExpiresAt: null });
    const CLIENT_PRE = profil({ plan: "gratuit", planExpiresAt: null, planPreinscription: "dossier-france", planPreinscriptionExpiresAt: dansNJours(200) });
    const GRATUIT = profil({ plan: "gratuit", planExpiresAt: null, planPreinscription: "", planPreinscriptionExpiresAt: null });

    /** Ouvre une URL avec un profil donné et rend ce que le DOM porte. */
    const lireEspace = async (compte, url, attente) => {
      const { contexte, page, erreurs } = await ouvrir(navigateur, base, compte);
      try {
        await page.goto(`${base}/${url}`, { waitUntil: "domcontentloaded" });
        // Les redirections d'espace sont des window.location.replace :
        // on attend que l'URL se stabilise sur une page attendue…
        await page.waitForFunction((fins) => fins.some((f) => location.pathname.endsWith(f)), attente, { timeout: 20000 })
          .catch(() => {});
        // …PUIS que la coquille ait fini. bootstrapShell pose
        // body[data-espace] tout à la fin : sans cette attente, on lit un
        // DOM d'avant la résolution de session — pastille « … », onglet
        // Fitz encore présent, bouton flottant pas encore injecté. Les
        // trois « anomalies » du premier passage n'en étaient pas.
        // On attend la coquille APRÈS la redirection : body[data-espace] ET
        // la pastille remplie. Attendre le seul data-espace ne suffit pas —
        // un window.location.replace peut résoudre la condition sur le
        // document d'AVANT la navigation, et l'evaluate qui suit lit alors
        // le nouveau, encore à « … ».
        const coquillePrete = () => page.waitForFunction(() => {
          if (!document.body.dataset.espace) return false;
          const el = document.getElementById("topbarPlanLabel");
          return !el || el.textContent.trim() !== "…";
        }, null, { timeout: 20000, polling: 100 }).catch(() => {});
        await coquillePrete();
        // Lot DEUX-MOTEURS (2026-09-11) : sous WebKit, l'aiguillage
        // (dashboard.html) pose sa coquille PUIS redirige — la condition
        // ci-dessus était vraie sur le document de départ, et l'evaluate
        // lisait dashboard.html (passe 2) ou tombait sur « Execution
        // context was destroyed » (passe 3). Si on est encore sur la page
        // de départ alors qu'une autre est attendue, on laisse 1,5 s à la
        // redirection, puis on attend de nouveau la coquille. L'evaluate
        // est rejoué si une navigation le coupe.
        const depart = url.split("?")[0];
        const autres = attente.filter((f) => f !== depart);
        let vu = null;
        for (let essai = 0; essai < 3 && !vu; essai++) {
          try {
            const ici = await page.evaluate(() => location.pathname.split("/").pop());
            if (ici === depart && autres.length) {
              await page.waitForURL((u) => autres.some((f) => u.pathname.endsWith(f)), { timeout: 1500 }).catch(() => {});
              await coquillePrete();
            }
            vu = await page.evaluate(() => ({
              page: location.pathname.split("/").pop(),
              espace: document.body.dataset.espace || "",
              fab: !!document.getElementById("fitzFabWrap"),
              bascule: !!document.getElementById("espaceBascule"),
              basculeEntrees: [...document.querySelectorAll("#espaceBascule [data-espace]")].map((a) => a.dataset.espace),
              pastille: (document.getElementById("topbarPlanLabel") || {}).textContent || "",
              accueilMinimal: !!document.getElementById("accueilMinimal") && !document.getElementById("accueilMinimal").hidden,
              outilsFitz: [...document.querySelectorAll('a[href^="ai-"], a[href^="test-prep"], a[href^="interview-prep"]')].length
            }));
          } catch (e) {
            if (essai === 2 || !/Execution context was destroyed|navigation/i.test(e.message)) throw e;
            await page.waitForLoadState("domcontentloaded").catch(() => {});
          }
        }
        return { vu, erreurs, contexte };
      } catch (e) {
        return { vu: null, erreurs: [...erreurs, `ÉCHEC ${url} : ${e.message}`], contexte };
      }
    };

    // --- a) Le client BOURSE ---------------------------------------
    {
      const { vu, erreurs, contexte } = await lireEspace(CLIENT_BOURSE, "dashboard.html", ["espace-bourse.html", "dashboard.html"]);
      if (vu) {
        if (vu.page !== "espace-bourse.html") anomalies.push(`client bourse : atterrit sur ${vu.page} au lieu de espace-bourse.html.`);
        if (vu.espace !== "bourse") anomalies.push(`client bourse : body data-espace = « ${vu.espace} ».`);
        if (!vu.fab) anomalies.push("client bourse : le bouton flottant Fitz est absent alors qu'il a les outils.");
        if (vu.bascule) anomalies.push("client bourse : la bascule d'espace est dans le DOM — il n'a qu'un accompagnement.");
        if (/Dossier France|Diagnostic France/.test(vu.pastille)) anomalies.push(`client bourse : la pastille annonce un forfait préinscription (« ${vu.pastille} »).`);
        notes.push(`S4 client bourse : ${vu.page} — pastille « ${vu.pastille.trim()} », Fitz présent, aucune bascule`);
      }
      anomalies.push(...erreurs);
      await contexte.close();
    }

    // Une page de l'AUTRE espace ne le renvoie pas aux offres.
    {
      const { vu, erreurs, contexte } = await lireEspace(CLIENT_BOURSE, "diagnostic-france.html", ["espace-bourse.html", "offers.html", "diagnostic-france.html"]);
      if (vu) {
        if (vu.page === "offers.html") anomalies.push("client bourse sur diagnostic-france.html : renvoyé sur la page d'offres — on ne vend pas à quelqu'un qui a déjà payé.");
        else if (vu.page !== "espace-bourse.html") anomalies.push(`client bourse sur diagnostic-france.html : atterrit sur ${vu.page} au lieu de son hub.`);
        else notes.push("S4 URL forcée : diagnostic-france.html ramène le client bourse à espace-bourse.html");
      }
      anomalies.push(...erreurs);
      await contexte.close();
    }

    // --- b) Le client PRÉINSCRIPTION --------------------------------
    //
    // LOT PRÉ-FITZ (2026-09-10) : ce client a désormais les cinq outils
    // Fitz — verrouillés par FORMULE, pas par espace. On lit donc deux
    // comptes : le Dossier France, qui doit tout voir, et le Diagnostic
    // France (un pass, pas un accompagnement), qui ne doit rien voir.
    const OUTILS_PRE = ["ai_chat", "ai_letter", "ai_check", "ai_email", "ai_translate"];
    const CLIENT_DIAG = profil({ plan: "gratuit", planExpiresAt: null, planPreinscription: "diagnostic-france", planPreinscriptionExpiresAt: dansNJours(10) });

    const lireOutils = async (compte) => {
      const { contexte, page, erreurs } = await ouvrir(navigateur, base, compte);
      try {
        await page.goto(`${base}/espace-preinscription.html`, { waitUntil: "domcontentloaded" });
        await page.waitForFunction(() => {
          if (!document.body.dataset.espace) return false;
          const el = document.getElementById("topbarPlanLabel");
          return !el || el.textContent.trim() !== "…";
        }, null, { timeout: 20000, polling: 100 });
        // La VALEUR CALCULÉE, pas la position dans le DOM : un lien
        // présent mais invisible ne compterait pas.
        const vu = await page.evaluate((outils) => {
          const visible = (el) => { const r = el.getBoundingClientRect(); const c = getComputedStyle(el); return r.width > 0 && r.height > 0 && c.visibility !== "hidden" && c.display !== "none"; };
          const presents = {};
          for (const o of outils) {
            const span = document.querySelector(`[data-feature="${o}"]`);
            const lien = span && span.querySelector("a");
            presents[o] = !!lien && visible(lien);
          }
          return {
            page: location.pathname.split("/").pop(),
            presents,
            fab: !!document.getElementById("fitzFabWrap"),
            pastille: (document.getElementById("topbarPlanLabel") || {}).textContent || ""
          };
        }, OUTILS_PRE);
        return { vu, erreurs, contexte };
      } catch (e) {
        return { vu: null, erreurs: [...erreurs, `ÉCHEC espace-preinscription.html : ${e.message}`], contexte };
      }
    };

    {
      const { vu, erreurs, contexte } = await lireEspace(CLIENT_PRE, "dashboard.html", ["espace-preinscription.html", "dashboard.html"]);
      if (vu) {
        if (vu.page !== "espace-preinscription.html") anomalies.push(`client préinscription : atterrit sur ${vu.page} au lieu de espace-preinscription.html.`);
        if (vu.espace !== "preinscription") anomalies.push(`client préinscription : body data-espace = « ${vu.espace} ».`);
        if (!vu.fab) anomalies.push("client préinscription (Dossier France) : le bouton flottant Fitz est absent — il a le chat.");
        if (vu.bascule) anomalies.push("client préinscription : la bascule d'espace est dans le DOM — il n'a qu'un accompagnement.");
        if (!/Dossier France/.test(vu.pastille)) anomalies.push(`client préinscription : la pastille dit « ${vu.pastille} » au lieu de son forfait.`);
        notes.push(`S4 client préinscription : ${vu.page} — pastille « ${vu.pastille.trim()} », Fitz présent, aucune bascule`);
      }
      anomalies.push(...erreurs);
      await contexte.close();
    }

    {
      const { vu, erreurs, contexte } = await lireOutils(CLIENT_PRE);
      if (vu) {
        const absents = OUTILS_PRE.filter((o) => !vu.presents[o]);
        if (absents.length) anomalies.push(`Dossier France : outil(s) absent(s) ou invisible(s) dans espace-preinscription.html : ${absents.join(", ")}.`);
        else notes.push(`PRÉ-FITZ Dossier France : les 5 outils Fitz sont déverrouillés et visibles (${OUTILS_PRE.join(", ")})`);
      }
      anomalies.push(...erreurs);
      await contexte.close();
    }

    {
      const { vu, erreurs, contexte } = await lireOutils(CLIENT_DIAG);
      if (vu) {
        const presents = OUTILS_PRE.filter((o) => vu.presents[o]);
        if (presents.length) anomalies.push(`Diagnostic France : outil(s) Fitz dans le DOM alors que le pass n'en ouvre aucun : ${presents.join(", ")}.`);
        if (vu.fab) anomalies.push("Diagnostic France : le bouton flottant Fitz est dans le DOM — le pass n'a pas le chat.");
        if (!presents.length && !vu.fab) notes.push("PRÉ-FITZ Diagnostic France : aucun outil Fitz, aucun bouton flottant — absents du DOM, pas grisés");
      }
      anomalies.push(...erreurs);
      await contexte.close();
    }

    // LE CRITÈRE DE FIN DU LOT : « Ma lettre pour chaque vœu » s'ouvre pour
    // le client Dossier France et rend un texte court, propre à une
    // formation nommée, sans le mot « bourse » — lu à l'écran.
    {
      const { contexte, page, erreurs } = await ouvrir(navigateur, base, CLIENT_PRE);
      try {
        const preApp = (CLIENT_PRE.applications || []).find((a) => a.track === "preinscription");
        if (!preApp) throw new Error("aucune candidature de préinscription dans le stub");
        await page.goto(`${base}/ai-letter.html?applicationId=${preApp.id}`, { waitUntil: "domcontentloaded" });
        await page.waitForFunction(() => location.pathname.endsWith("ai-letter.html") && !!document.getElementById("generateLetterBtn") && !document.getElementById("letterApp").hidden && document.body.dataset.modeLettre, null, { timeout: 20000, polling: 100 });
        const avant = await page.evaluate(() => ({
          page: location.pathname.split("/").pop(),
          mode: document.body.dataset.modeLettre,
          styleGridCache: document.getElementById("styleGrid").hidden,
          notice: !document.getElementById("voeuNotice").hidden,
          titre: (document.querySelector(".ai-page-header-main h1") || {}).textContent || "",
          formation: (document.getElementById("fieldProgram") || {}).value || "",
          universite: (document.getElementById("fieldUniversity") || {}).value || ""
        }));
        if (avant.page !== "ai-letter.html") anomalies.push(`client préinscription : ai-letter.html le renvoie sur ${avant.page}.`);
        if (avant.mode !== "voeu") anomalies.push(`ai-letter pour une préinscription : mode « ${avant.mode} » au lieu de « voeu ».`);
        if (!avant.styleGridCache) anomalies.push("ai-letter en mode vœu : les cinq styles de lettre de bourse sont encore proposés.");
        if (!avant.notice) anomalies.push("ai-letter en mode vœu : la note « c'est vous qui recopiez » n'est pas affichée.");
        if (!/vœu/.test(avant.titre)) anomalies.push(`ai-letter en mode vœu : titre « ${avant.titre} ».`);
        if (!avant.formation || !avant.universite) anomalies.push("ai-letter en mode vœu : la formation ou l'établissement n'est pas pré-rempli depuis la candidature.");

        await page.click("#generateLetterBtn");
        await page.waitForFunction(() => {
          const btn = document.getElementById("generateLetterBtn");
          const txt = (document.getElementById("previewContent") || {}).innerText || "";
          return btn && !btn.disabled && txt.trim().length > 40 && !/apparaîtra ici/.test(txt);
        }, null, { timeout: 30000, polling: 150 });
        const lettre = await page.evaluate(() => (document.getElementById("previewContent") || {}).innerText || "");
        const lignes = lettre.split("\n").map((l) => l.trim()).filter(Boolean);
        if (lignes.length > 6) anomalies.push(`lettre de vœu : ${lignes.length} lignes, six au plus attendues.`);
        if (/bourse/i.test(lettre)) anomalies.push("lettre de vœu : le mot « bourse » apparaît.");
        if (avant.formation && !lettre.includes(avant.formation)) anomalies.push(`lettre de vœu : la formation « ${avant.formation} » n'est pas nommée.`);
        if (/la France|excellence française|enseignement français/i.test(lettre)) anomalies.push("lettre de vœu : louange sur la France.");
        notes.push(`PRÉ-FITZ lettre de vœu (${avant.universite} — ${avant.formation}) : ${lignes.length} lignes, sans « bourse » — « ${lignes[1] ? lignes[1].slice(0, 70) : ""}… »`);
      } catch (e) {
        anomalies.push(`ÉCHEC critère de fin PRÉ-FITZ (ai-letter, mode vœu) : ${e.message}`);
      }
      anomalies.push(...erreurs);
      await contexte.close();
    }

    // --- b bis) FITZ-RECOURS : le recours est à l'endroit du blocage ------
    //
    // Critère de fin du lot : un compte dossier-france ouvre une candidature
    // de préinscription arrêtée à l'étape du paiement. À côté de l'étape,
    // « Bloqué ? Demandez à Fitz ». Il clique. Fitz s'ouvre EN AYANT DÉJÀ
    // DIAGNOSTIQUÉ : la bonne banque, le bon montant, le bon moment, la
    // source et sa date, et une porte de sortie ouverte à sa formule.
    // Lu dans le DOM rendu, valeur par valeur.
    {
      const { contexte, page, erreurs } = await ouvrir(navigateur, base, CLIENT_PRE);
      try {
        await page.goto(`${base}/applications.html`, { waitUntil: "domcontentloaded" });
        await page.waitForSelector("#applicationsList .app-card", { timeout: 30000 });
        await page.waitForFunction(() => !!document.querySelector('.app-procedure-etape[data-procedure-etape="ef_paiement"] .fitz-recours'), null, { timeout: 20000 });

        const recours = await page.evaluate(() => {
          const a = document.querySelector('.app-procedure-etape[data-procedure-etape="ef_paiement"] .fitz-recours');
          const r = a.getBoundingClientRect();
          return { href: a.getAttribute("href"), texte: a.textContent.replace(/\s+/g, " ").trim(), visible: r.width > 0 && r.height > 0, nb: document.querySelectorAll(".fitz-recours").length };
        });
        if (!recours.visible) anomalies.push("recours : le lien à côté de l'étape du paiement n'est pas visible.");
        if (!/bloc=paiement/.test(recours.href)) anomalies.push(`recours : lien « ${recours.href} » sans bloc=paiement.`);
        if (!recours.texte.includes("Bloqué ? Demandez à Fitz")) anomalies.push(`recours : libellé « ${recours.texte} ».`);

        await page.goto(`${base}/${recours.href}`, { waitUntil: "domcontentloaded" });
        await page.waitForFunction(() => {
          const m = document.querySelector(".ai-msg-bot .ai-msg-bubble");
          return m && m.innerText.trim().length > 60 && location.pathname.endsWith("ai-chat.html");
        }, null, { timeout: 30000 });

        const fitz = await page.evaluate(() => {
          const m = document.querySelector(".ai-msg-bot .ai-msg-bubble");
          return { texte: m.innerText, liens: [...m.querySelectorAll("a")].map((a) => a.getAttribute("href")), utilisateur: document.querySelectorAll(".ai-msg-user").length };
        });
        if (fitz.utilisateur) anomalies.push("recours : Fitz devait parler le premier, sans message de l'étudiant.");
        for (const attendu of ["SUNU BANK", "85 000", "Vérifié le", "demande de paiement"]) {
          if (!fitz.texte.includes(attendu)) anomalies.push(`recours paiement (Sénégal) : « ${attendu} » manque dans la réponse de Fitz.`);
        }
        if (!fitz.liens.some((h) => /campusfrance\.org/.test(h || ""))) anomalies.push("recours : la source officielle n'est pas liée.");
        // Dossier France : la messagerie est ouverte — c'est le maillon suivant.
        if (!fitz.liens.some((h) => /messages\.html/.test(h || ""))) anomalies.push("recours : aucune porte de sortie (messagerie) proposée à un Dossier France.");
        if (fitz.liens.some((h) => /advisor\.html/.test(h || ""))) anomalies.push("recours : le conseiller est proposé à un Dossier France sans conseiller.");
        notes.push(`FITZ-RECOURS paiement (Dossier France, Sénégal) : ${recours.nb} recours sur la page, Fitz ouvre par « ${fitz.texte.slice(0, 70).replace(/\n/g, " ")}… », source liée, porte : messagerie`);
      } catch (e) {
        anomalies.push(`ÉCHEC critère de fin FITZ-RECOURS (paiement) : ${e.message}`);
      }
      anomalies.push(...erreurs);
      await contexte.close();
    }

    // La lettre bloquée par un profil incomplet : LE NOM du prérequis, pas
    // un conseil général. Le stub porte un profil partiel ; si le score
    // atteint le seuil, le cas ne se présente pas et on le dit.
    {
      const { contexte, page, erreurs } = await ouvrir(navigateur, base, etudiant);
      try {
        await page.goto(`${base}/ai-chat.html?bloc=prerequis&app=slot-2&etape=letter`, { waitUntil: "domcontentloaded" });
        await page.waitForFunction(() => { const m = document.querySelector(".ai-msg-bot .ai-msg-bubble"); return m && m.innerText.trim().length > 40; }, null, { timeout: 30000 });
        const texte = await page.evaluate(() => document.querySelector(".ai-msg-bot .ai-msg-bubble").innerText);
        if (/attend le profil/.test(texte)) notes.push("FITZ-RECOURS prérequis (bourse) : Fitz nomme le prérequis manquant — « le profil »");
        else if (/Rien ne bloque/.test(texte)) notes.push("FITZ-RECOURS prérequis (bourse) : profil du stub au seuil — Fitz dit que rien ne bloque la lettre");
        else anomalies.push(`recours prérequis : réponse inattendue « ${texte.slice(0, 90)} »`);
      } catch (e) {
        anomalies.push(`ÉCHEC FITZ-RECOURS (prérequis) : ${e.message}`);
      }
      anomalies.push(...erreurs);
      await contexte.close();
    }

    // Un code fabriqué dans la barre d'adresse : le chat normal, sans erreur.
    {
      const { contexte, page, erreurs } = await ouvrir(navigateur, base, etudiant);
      try {
        await page.goto(`${base}/ai-chat.html?bloc=nimportequoi`, { waitUntil: "domcontentloaded" });
        await page.waitForSelector("#chatForm", { timeout: 20000 });
        const vu = await page.evaluate(() => ({ bots: document.querySelectorAll(".ai-msg-bot").length, vide: !document.getElementById("chatEmptyState").hidden }));
        if (vu.bots && !vu.vide) anomalies.push("recours : un code inconnu a fait parler Fitz.");
        else notes.push("FITZ-RECOURS code inconnu : chat normal, aucune erreur");
      } catch (e) {
        anomalies.push(`ÉCHEC FITZ-RECOURS (code inconnu) : ${e.message}`);
      }
      anomalies.push(...erreurs);
      await contexte.close();
    }

    // --- c) Le client des DEUX : la bascule, et elle seule -----------
    {
      const { vu, erreurs, contexte } = await lireEspace(etudiant, "espace-bourse.html", ["espace-bourse.html"]);
      if (vu) {
        if (!vu.bascule) anomalies.push("client des deux : aucune bascule d'espace dans le DOM.");
        else if (vu.basculeEntrees.join(",") !== "bourse,preinscription") anomalies.push(`client des deux : bascule à « ${vu.basculeEntrees.join(",")} ».`);
        // La pastille ne dit QU'UN forfait, celui de l'espace courant.
        if (/·/.test(vu.pastille)) anomalies.push(`client des deux : la pastille concatène les deux forfaits (« ${vu.pastille} »).`);
        notes.push(`S4 client des deux : bascule ${vu.basculeEntrees.join(" / ")} — pastille « ${vu.pastille.trim()} »`);
      }
      anomalies.push(...erreurs);
      await contexte.close();
    }

    // --- d) Le compte GRATUIT : il reste, et il garde ses pages ------
    {
      const { vu, erreurs, contexte } = await lireEspace(GRATUIT, "dashboard.html", ["dashboard.html", "offers.html", "login.html"]);
      if (vu) {
        if (vu.page !== "dashboard.html") anomalies.push(`compte gratuit : expédié sur ${vu.page} — un compte sans accompagnement garde son accueil.`);
        if (!vu.accueilMinimal) anomalies.push("compte gratuit : l'accueil minimal ne s'affiche pas.");
        notes.push("S4 compte gratuit : reste sur dashboard.html, accueil minimal affiché");
      }
      anomalies.push(...erreurs);
      await contexte.close();
    }

    {
      const { vu, erreurs, contexte } = await lireEspace(GRATUIT, "profile.html", ["profile.html", "offers.html", "login.html"]);
      if (vu) {
        if (vu.page !== "profile.html") anomalies.push(`compte gratuit : profile.html le renvoie sur ${vu.page} — son profil doit rester accessible.`);
        else notes.push("S4 compte gratuit : profile.html accessible, aucune boucle de redirection");
      }
      anomalies.push(...erreurs);
      await contexte.close();
    }

  }

  // ---------- 6. LOT DIAGNOSTIC-2 : le diagnostic rend un CHEMIN ----------
  //
  // Trois profils, choisis parce qu'ils font basculer les trois états du
  // verdict ET les trois états de la documentation pays :
  //
  //   Sénégal au-dessus du seuil   pays entièrement documenté, calendrier
  //                                publié, verdict « tient ».
  //   Côte d'Ivoire loin en dessous  pays documenté SANS calendrier :
  //                                aucune date ne doit s'afficher.
  //   Rwanda                       pays NON documenté : ni frais de
  //                                dossier, ni vigilance, ni calendrier —
  //                                et les onze étapes quand même.
  //
  // On ne regarde pas « la page s'affiche » : on RELIT les valeurs, comme
  // partout dans ce harnais.
  {

    const PROFILS_DIAG = [
      {
        cle: "sn-au-dessus",
        pays: "Sénégal", ressources: 900, devise: "EUR", niveau: "licence",
        verdict: /^Votre projet tient financièrement\.$/,
        fin: /arriver à temps, avec un dossier complet/,
        vigilance: 1,
        calendrier: "dates",
        total: /13 562 €/
      },
      {
        cle: "ci-loin-dessous",
        pays: "Côte d'Ivoire", ressources: 400, devise: "EUR", niveau: "licence",
        verdict: /^Il manque 5 730 € sur l'année \(3 758 634 F CFA\)\.$/,
        fin: /Ce n'est pas un refus, c'est un chiffre/,
        vigilance: 2,
        calendrier: "absence",
        total: /13 554 €/
      },
      {
        cle: "rw-non-documente",
        pays: "Rwanda", ressources: 900, devise: "EUR", niveau: "licence",
        verdict: /^Votre projet tient financièrement\.$/,
        fin: /sans rien repayer/,
        vigilance: 0,
        calendrier: "absence",
        total: /13 432 €/
      }
    ];

    for (const p of PROFILS_DIAG) {

      const { contexte, page, erreurs } = await ouvrir(navigateur, base, etudiant);

      try {

        await page.goto(`${base}/diagnostic-france.html`, { waitUntil: "domcontentloaded" });

        if (page.url().includes("login.html")) throw new Error("redirigée vers la connexion — la doublure étudiant n'a pas pris.");

        await page.waitForSelector("#diagForm", { timeout: 30000 });

        await page.fill("#diagPays", p.pays);
        await page.fill("#diagRessources", String(p.ressources));
        // Le <select> natif est masqué derrière le composant maison
        // (js/fitz-select.js) : selectOption ne le voit pas. On pose la
        // valeur et on notifie, exactement comme le ferait le composant.
        await page.evaluate((devise) => {
          const el = document.getElementById("diagDevise");
          el.value = devise;
          el.dispatchEvent(new Event("change", { bubbles: true }));
        }, p.devise);
        await page.check(`input[name="niveau"][value="${p.niveau}"]`, { force: true });
        await page.click("#diagCalculer");

        await page.waitForFunction(() => {
          const v = document.getElementById("diagVerdict");
          const f = document.getElementById("diagFin");
          return v && v.textContent.trim() && f && f.textContent.trim();
        }, null, { timeout: 20000 });

        const vu = await page.evaluate(() => ({
          verdict: (document.getElementById("diagVerdict").textContent || "").trim(),
          total: (document.getElementById("diagTotal").textContent || "").trim(),
          fin: (document.getElementById("diagFin").textContent || "").trim(),
          lignes: document.querySelectorAll("#diagBlocs .diag-bloc").length,
          sansSource: document.querySelectorAll("#diagBlocs .diag-source--absente").length,
          vigilance: document.getElementById("diagSectionVigilance").hidden ? 0 : document.querySelectorAll("#diagVigilance li").length,
          jalons: document.querySelectorAll("#diagCalendrier li").length,
          absenceCalendrier: document.getElementById("diagCalendrierAbsence").hidden ? "" : (document.getElementById("diagCalendrierAbsence").textContent || "").trim(),
          leviers: document.querySelectorAll("#diagLeviers .diag-levier").length,
          bourses: document.querySelectorAll("#diagLeviers .diag-bourses li").length,
          passerelle: !!document.querySelector("#diagLeviers .diag-passerelle"),
          etapes: document.querySelectorAll("#diagEtapes li").length,
          offres: document.querySelectorAll("#diagOffres li").length,
          corps: document.getElementById("diagResultat").innerText
        }));

        if (!p.verdict.test(vu.verdict)) anomalies.push(`diagnostic ${p.cle} : verdict « ${vu.verdict} »`);
        if (!p.fin.test(vu.fin)) anomalies.push(`diagnostic ${p.cle} : phrase de fin « ${vu.fin.slice(0, 90)}… »`);
        if (!p.total.test(vu.total)) anomalies.push(`diagnostic ${p.cle} : total « ${vu.total.slice(0, 90)}… »`);
        if (vu.vigilance !== p.vigilance) anomalies.push(`diagnostic ${p.cle} : ${vu.vigilance} point(s) de vigilance, ${p.vigilance} attendu(s).`);

        // AUCUNE URGENCE INVENTÉE : un pays sans calendrier publié ne
        // montre aucune date, et dit pourquoi.
        if (p.calendrier === "dates") {
          if (!vu.jalons) anomalies.push(`diagnostic ${p.cle} : aucun jalon affiché alors que le calendrier est publié.`);
          if (vu.absenceCalendrier) anomalies.push(`diagnostic ${p.cle} : phrase d'absence affichée avec un calendrier publié.`);
        } else {
          if (vu.jalons) anomalies.push(`diagnostic ${p.cle} : ${vu.jalons} date(s) affichée(s) sans calendrier publié.`);
          if (!vu.absenceCalendrier) anomalies.push(`diagnostic ${p.cle} : ni date, ni phrase d'absence — la section est muette.`);
        }

        // Les onze étapes sont rendues pour tout le monde : on ne cache
        // rien pour faire payer la suite.
        if (vu.etapes !== 11) anomalies.push(`diagnostic ${p.cle} : ${vu.etapes} étapes rendues, 11 attendues.`);
        if (vu.lignes !== 3) anomalies.push(`diagnostic ${p.cle} : ${vu.lignes} lignes chiffrées, 3 attendues.`);
        if (vu.offres !== 2) anomalies.push(`diagnostic ${p.cle} : ${vu.offres} offre(s) rendue(s), 2 attendues.`);
        if (vu.leviers < 2) anomalies.push(`diagnostic ${p.cle} : ${vu.leviers} levier(s) rendus.`);

        // Un pays non documenté a EXACTEMENT une ligne sans source (les
        // frais de dossier) ; un pays documenté n'en a aucune.
        const sansSourceAttendu = p.pays === "Rwanda" ? 1 : 0;
        if (vu.sansSource !== sansSourceAttendu) anomalies.push(`diagnostic ${p.cle} : ${vu.sansSource} ligne(s) sans source, ${sansSourceAttendu} attendue(s).`);

        for (const interdit of ["payez pour", "débloquer", "Impossible"]) {
          if (vu.corps.toLowerCase().includes(interdit.toLowerCase())) anomalies.push(`diagnostic ${p.cle} : « ${interdit} » dans le résultat.`);
        }
        if (vu.corps.includes("!")) anomalies.push(`diagnostic ${p.cle} : un point d'exclamation dans le résultat.`);

        notes.push(`diagnostic ${p.cle} : « ${vu.verdict} » — ${vu.vigilance} vigilance, ${vu.jalons} date(s)${vu.absenceCalendrier ? " (absence dite)" : ""}, ${vu.leviers} leviers${vu.bourses ? ` dont ${vu.bourses} bourse(s)` : " sans bloc bourses"}, ${vu.etapes} étapes — fin : « ${vu.fin.slice(0, 60)}… »`);

      } catch (erreur) {

        anomalies.push(`diagnostic ${p.cle} : ÉCHEC — ${erreur.message}`);

      }

      anomalies.push(...erreurs);
      await contexte.close();

    }

  }

  // ---------- 7. C'EST FITZ QUI CHOISIT (lot FITZ-CHOISIT, 2026-09-11) ----------
  //
  // Décision de Charles : l'étudiant ne choisit pas ses universités. Sous
  // session stubbée, deux clients bourse (Essentiel, 4 places), deux
  // cartes choisies par Fitz chacun :
  //   COMPLET    profil minimal renseigné — dans l'espace bourses, aucun
  //              lien hors catalogue ni recherche libre ni bouton de
  //              création ; l'identité d'une carte est en lecture seule ;
  //              « Refuser et demander une autre » change d'université ET
  //              met à jour scholarshipId / programId (écritures consignées
  //              dans window.__harnaisEcritures) ;
  //   INCOMPLET  ni niveau visé ni langue — AUCUN remplissage (aucun `set`
  //              sur /applications), et la ligne d'état dit « Complétez
  //              votre profil ».
  {
    const brut = JSON.parse(fs.readFileSync(path.join(RACINE, "assets/data/catalogue.json"), "utf8"));
    const uniParId = new Map(brut.universities.map((u) => [u.id, u]));
    const bourseParId = new Map(brut.scholarships.map((b) => [b.id, b]));
    // Deux programmes d'universités distinctes, chacun avec sa bourse.
    const choisis = [];
    for (const p of brut.programs) {
      if (!uniParId.has(p.universityId) || !bourseParId.has(p.scholarshipId)) continue;
      if (choisis.some((c) => c.universityId === p.universityId)) continue;
      choisis.push(p);
      if (choisis.length === 2) break;
    }
    const carteFitzDe = (p, id) => ({
      id, university: uniParId.get(p.universityId).name, scholarship: bourseParId.get(p.scholarshipId).title,
      scholarshipId: p.scholarshipId, programId: p.id, universityId: p.universityId,
      portalUrl: "", universityWebsite: "", status: "a_preparer", track: "bourse", deadline: null,
      reminderFrequency: 14, notes: "", checklist: [], premiumProtected: false, isRecommendation: true, nextCheckDate: dansNJours(10)
    });
    const cartes = choisis.map((p, i) => carteFitzDe(p, `slot-${i + 1}`));
    const profilComplet = { ...etudiant.userData.profile, nationality: "Sénégalaise", desiredDegree: "Master", desiredField: "Informatique", languages: ["français"] };
    const profilIncomplet = { ...etudiant.userData.profile, desiredDegree: "", languages: [] };
    const client = (profile) => ({
      ...etudiant,
      uid: "harnais-fitz-choisit",
      userData: { ...etudiant.userData, plan: "essentiel-4", planExpiresAt: dansNJours(120), planPreinscription: "", planPreinscriptionExpiresAt: null, universitesRefusees: [], profile },
      applications: cartes
    });

    if (choisis.length < 2) {
      anomalies.push("FITZ-CHOISIT : moins de deux programmes exploitables dans le catalogue — contrôle impossible.");
    } else {
      // --- a) profil COMPLET
      const { contexte, page, erreurs } = await ouvrir(navigateur, base, client(profilComplet));
      try {
        await page.goto(`${base}/applications.html`, { waitUntil: "domcontentloaded" });
        await page.waitForFunction(() => document.querySelectorAll("#applicationsList .app-card").length >= 2, null, { timeout: 20000 });
        const vu = await page.evaluate(() => {
          const visible = (el) => !!el && !el.hidden && el.getBoundingClientRect().width > 0;
          return {
            horsCatalogue: !!document.getElementById("manualModeBtn"),
            recherche: !!document.getElementById("pickerSearch"),
            boutonCreation: visible(document.getElementById("addApplicationBtn")),
            etat: document.getElementById("fitzChoixEtat")?.dataset.etat || "",
            regle: (document.getElementById("fitzRegle")?.textContent || "").trim(),
            refuser: document.querySelectorAll("#applicationsList .app-refuse-btn").length,
            supprimer: document.querySelectorAll("#applicationsList .app-delete-btn").length,
            sets: (window.__harnaisEcritures || []).filter((e) => e.op === "set" && e.chemin.includes("/applications/")).length
          };
        });
        if (vu.horsCatalogue) anomalies.push("FITZ-CHOISIT : le lien « hors catalogue » (#manualModeBtn) est encore dans le DOM.");
        if (vu.recherche) anomalies.push("FITZ-CHOISIT : la recherche libre du catalogue (#pickerSearch) est encore dans le DOM.");
        if (vu.boutonCreation) anomalies.push("FITZ-CHOISIT : le bouton « Nouvelle candidature » est visible dans l'espace bourses.");
        if (!/^Vous ne choisissez pas vos universités/.test(vu.regle)) anomalies.push(`FITZ-CHOISIT : la règle n'est pas dite en tête de « Mes candidatures » (« ${vu.regle.slice(0, 60)} »).`);
        if (vu.refuser !== 2) anomalies.push(`FITZ-CHOISIT : ${vu.refuser} bouton(s) « Refuser » pour 2 cartes à préparer.`);
        if (vu.supprimer !== 0) anomalies.push(`FITZ-CHOISIT : ${vu.supprimer} bouton(s) « Supprimer » sur des cartes bourse non déposées.`);
        if (!vu.sets) anomalies.push("FITZ-CHOISIT (profil complet) : aucun remplissage des places libres — seedRecommendedSlots n'a rien écrit.");
        if (!["complet", "aucune"].includes(vu.etat)) anomalies.push(`FITZ-CHOISIT (profil complet) : ligne d'état « ${vu.etat} » (attendu complet ou aucune).`);

        // L'édition : identité en lecture seule.
        await page.click("#slot-1 .app-edit-btn");
        await page.waitForSelector("#applicationModal:not([hidden])", { timeout: 10000 });
        const edition = await page.evaluate(() => ({
          universite: document.getElementById("fieldUniversity").readOnly,
          bourse: document.getElementById("fieldScholarship").readOnly,
          portail: document.getElementById("fieldPortalUrl").readOnly,
          statut: document.getElementById("fieldStatus").disabled,
          notes: document.getElementById("fieldNotes").readOnly,
          note: !document.getElementById("identiteVerrouilleeNote").hidden
        }));
        if (!edition.universite || !edition.bourse || !edition.portail) anomalies.push("FITZ-CHOISIT : un champ d'identité (université, bourse, portail) est modifiable sur une carte choisie par Fitz.");
        if (edition.statut || edition.notes) anomalies.push("FITZ-CHOISIT : le statut ou les notes sont verrouillés — l'étudiant doit pouvoir les modifier.");
        if (!edition.note) anomalies.push("FITZ-CHOISIT : la note « choisis par Fitz » n'est pas affichée dans le formulaire.");
        await page.click("#applicationModalClose");

        // Le refus : une autre université, et les clés du catalogue à jour.
        const avant = cartes[0];
        await page.click("#slot-1 .app-refuse-btn");
        await page.waitForFunction(() => (window.__harnaisEcritures || []).some((e) => e.op === "update" && e.chemin.endsWith("/applications/slot-1") && e.data && "programId" in e.data), null, { timeout: 20000 })
          .catch(() => anomalies.push("FITZ-CHOISIT : aucune écriture de remplacement sur slot-1 après le refus."));
        const refus = await page.evaluate(() => {
          const ecritures = window.__harnaisEcritures || [];
          const carte = ecritures.find((e) => e.op === "update" && e.chemin.endsWith("/applications/slot-1") && e.data && "programId" in e.data);
          // Le chemin consigné par la doublure est « users/<uid> », sans barre initiale.
          const memoire = ecritures.find((e) => e.op === "update" && /^\/?users\/[^/]+$/.test(e.chemin) && e.data && "universitesRefusees" in e.data);
          return { carte: carte ? carte.data : null, memoire: !!memoire, ordre: ecritures.map((e) => e.chemin) };
        });
        if (refus.carte) {
          const c = refus.carte;
          if (c.university === avant.university) anomalies.push("FITZ-CHOISIT : après le refus, la carte porte encore la même université.");
          if (c.programId === avant.programId) anomalies.push("FITZ-CHOISIT : après le refus, programId n'a pas changé.");
          if (c.scholarshipId === avant.scholarshipId && c.universityId === avant.universityId) anomalies.push("FITZ-CHOISIT : après le refus, ni scholarshipId ni universityId n'ont changé.");
          if (c.universityId === cartes[1].universityId) anomalies.push("FITZ-CHOISIT : Fitz a proposé l'université déjà occupée par slot-2.");
          if (c.universityId === avant.universityId) anomalies.push("FITZ-CHOISIT : Fitz a re-proposé l'université refusée.");
          if (c.status !== "a_preparer" || c.deadline !== null || !Array.isArray(c.checklist) || c.checklist.length) anomalies.push("FITZ-CHOISIT : la carte de remplacement ne repart pas neuve (statut, date ou dossier hérités).");
          if (!c.universityId || !c.programId || !c.scholarshipId) anomalies.push("FITZ-CHOISIT : la carte de remplacement n'a pas ses trois clés du catalogue.");
          notes.push(`FITZ-CHOISIT : refus de « ${avant.university} » → « ${c.university} » (${c.programId})`);
        }
        if (!refus.memoire) anomalies.push("FITZ-CHOISIT : le refus n'est pas mémorisé sur users/{uid} (universitesRefusees).");
      } catch (e) {
        anomalies.push(`ÉCHEC FITZ-CHOISIT (profil complet) : ${e.message.split("\n")[0]}`);
      }
      anomalies.push(...erreurs);
      await contexte.close();

      // --- b) profil INCOMPLET : aucun remplissage, et le message.
      const b = await ouvrir(navigateur, base, client(profilIncomplet));
      try {
        await b.page.goto(`${base}/applications.html`, { waitUntil: "domcontentloaded" });
        await b.page.waitForFunction(() => document.querySelectorAll("#applicationsList .app-card").length >= 2, null, { timeout: 20000 });
        await b.page.waitForTimeout(800);
        const vu = await b.page.evaluate(() => ({
          sets: (window.__harnaisEcritures || []).filter((e) => e.op === "set" && e.chemin.includes("/applications/")).length,
          etat: document.getElementById("fitzChoixEtat")?.dataset.etat || "",
          texte: (document.getElementById("fitzChoixEtat")?.textContent || "").replace(/\s+/g, " ").trim(),
          lien: !!document.querySelector('#fitzChoixEtat a[href="profile.html"]')
        }));
        if (vu.sets) anomalies.push(`FITZ-CHOISIT (profil incomplet) : ${vu.sets} place(s) remplie(s) alors que Fitz ne connaît pas l'étudiant.`);
        if (vu.etat !== "profil" || !/Complétez votre profil/.test(vu.texte)) anomalies.push(`FITZ-CHOISIT (profil incomplet) : ligne d'état « ${vu.texte.slice(0, 80)} » (état ${vu.etat}).`);
        if (!vu.lien) anomalies.push("FITZ-CHOISIT (profil incomplet) : aucun lien vers le profil dans la ligne d'état.");
        notes.push(`FITZ-CHOISIT : profil incomplet → aucun remplissage, « ${vu.texte.slice(0, 70)} »`);
      } catch (e) {
        anomalies.push(`ÉCHEC FITZ-CHOISIT (profil incomplet) : ${e.message.split("\n")[0]}`);
      }
      anomalies.push(...b.erreurs);
      await b.contexte.close();
    }
  }

  return { anomalies, notes };

}
