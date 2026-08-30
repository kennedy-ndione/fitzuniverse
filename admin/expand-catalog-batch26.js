// ============================================================
// FitzUniverse — Photos des bourses, Lot 26 (2026-08-30)
//
// Pose le champ `image` sur 19 bourses, après le téléchargement par
// scripts/add-lot26-scholarship-photos.ps1.
//
// CE QUE LE LOT 25 AVAIT MANQUÉ
// Le lot 25 a traité les 30 bourses de l'étage 3 de la cascade (photo de
// la capitale du pays), en écartant l'étage 2 — photo de l'université
// liée, 41 bourses — au motif qu'il était « déjà varié ». C'était une
// supposition, pas une mesure. Vérification faite après signalement :
// 15 de ces 41 bourses répètent une image déjà prise dans leur pays,
// parce que plusieurs bourses pointent vers la MÊME université, ou vers
// des universités partageant une photo de ville. Cinq bourses d'Oxford
// affichaient la même photo d'Oxford.
//
// Le lot 24 avait par ailleurs aggravé deux cas : les trois programmes
// Commonwealth rattachés à london.jpg y rejoignaient deux bourses qui
// l'utilisaient déjà, et spbu-open-olympiad portait moscow.jpg à quatre
// cartes. Le correctif restait juste, mais il alimentait la répétition.
//
// ÉTAT MESURÉ AVANT CE LOT
//   Royaume-Uni  11 cartes,  3 images    oxford.jpg ×5, london.jpg ×5
//   Roumanie      5 cartes,  2 images    politehnica-bucuresti.jpg ×4
//   Russie        4 cartes,  1 image     moscow.jpg ×4
//   Japon         4 cartes,  2 images    tokyo.jpg ×3
//   Corée du Sud  6 cartes,  5 images    snu-seoul.jpg ×2
//   Hongrie       5 cartes,  4 images    debrecen.jpg ×2
//   Suisse        4 cartes,  3 images    lausanne.jpg ×2
//   Allemagne et Turquie : 3 images pour 3 cartes — rien à corriger.
//
// POURQUOI 19 ET NON 26
// Dans chaque groupe, UNE bourse conserve l'image partagée et les autres
// reçoivent la leur. Garder une carte sur l'image existante évite un
// téléchargement inutile sans laisser aucune répétition.
//
// Après ce lot : 105 des 131 bourses portent une photo propre, et plus
// aucun pays n'affiche deux fois la même image.
// ============================================================

import { db } from "../firebase-config.js";

import {
  getDoc,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

function normalize(str) {
  return String(str || "")
    .replace(/ı/g, "i")
    .replace(/İ/g, "i")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

const FIXES = [
  // ---------------- ROYAUME-UNI (8) — 11 cartes pour 3 images : oxford.jpg ×5, london.jpg ×5 ----------------
  {
    id: "clarendon-fund-scholarships",
    expectTitle: "Clarendon Fund Scholarships",
    image: "clarendon-fund-scholarships.jpg",
    sujet: "les toits gothiques d'Oxford vus d'en haut — Oxford"
  },
  {
    id: "reach-oxford-scholarship",
    expectTitle: "Reach Oxford Scholarship",
    image: "reach-oxford-scholarship.jpg",
    sujet: "une facade de college d'Oxford — Oxford"
  },
  {
    id: "rhodes-scholarships-west-africa",
    expectTitle: "The Rhodes Scholarships for West Africa",
    image: "rhodes-scholarships-west-africa.jpg",
    sujet: "un quadrangle d'Oxford et sa pelouse — Oxford"
  },
  {
    id: "weidenfeld-hoffmann-scholarships",
    expectTitle: "Weidenfeld-Hoffmann Scholarships and Leadership Programme",
    image: "weidenfeld-hoffmann-scholarships.jpg",
    sujet: "la pierre blonde d'Oxford sous un ciel bleu — Oxford"
  },
  {
    id: "commonwealth-masters-scholarships",
    expectTitle: "Commonwealth Master's Scholarships",
    image: "commonwealth-masters-scholarships.jpg",
    sujet: "Big Ben et le Parlement au couchant — Londres"
  },
  {
    id: "commonwealth-phd-scholarships",
    expectTitle: "Commonwealth PhD Scholarships",
    image: "commonwealth-phd-scholarships.jpg",
    sujet: "le London Eye — Londres"
  },
  {
    id: "commonwealth-shared-scholarships",
    expectTitle: "Commonwealth Shared Scholarships",
    image: "commonwealth-shared-scholarships.jpg",
    sujet: "un pont sur la Tamise — Londres"
  },
  {
    id: "imperial-presidents-phd-scholarships",
    expectTitle: "Imperial College London President's PhD Scholarships",
    image: "imperial-presidents-phd-scholarships.jpg",
    sujet: "une cabine telephonique rouge devant un batiment londonien — Londres"
  },
  // ---------------- RUSSIE (3) — 4 cartes pour 1 image : moscow.jpg ×4 ----------------
  {
    id: "spbu-open-olympiad",
    expectTitle: "Olympiade internationale ouverte de l'Université d'État de Saint-Pétersbourg",
    image: "spbu-open-olympiad.jpg",
    sujet: "les fontaines de Peterhof, Saint-Petersbourg — Saint-Petersbourg"
  },
  {
    id: "hse-into-olympiad",
    expectTitle: "HSE International Olympiad (INTO)",
    image: "hse-into-olympiad.jpg",
    sujet: "la cathedrale Saint-Basile-le-Bienheureux — Moscou"
  },
  {
    id: "hse-merit-scholarships",
    expectTitle: "Bourses au mérite HSE University",
    image: "hse-merit-scholarships.jpg",
    sujet: "un batiment moscovite reflete dans l'eau — Moscou"
  },
  // ---------------- ROUMANIE (3) — 5 cartes pour 2 images : politehnica-bucuresti.jpg ×4 ----------------
  {
    id: "auf-eugen-ionescu",
    expectTitle: "Bourses de recherche doctorale et postdoctorale « Eugen Ionescu »",
    image: "auf-eugen-ionescu.jpg",
    sujet: "la statue equestre de Matthias Corvin, Cluj-Napoca — Cluj-Napoca"
  },
  {
    id: "auf-petrache-poenaru",
    expectTitle: "Bourses de recherche « Petrache Poenaru »",
    image: "auf-petrache-poenaru.jpg",
    sujet: "le palais de la Culture et son horloge, Iasi — Iasi"
  },
  {
    id: "bourse-george-darie",
    expectTitle: "Bourse d'excellence « George Darie »",
    image: "bourse-george-darie.jpg",
    sujet: "les maisons colorees du centre de Cluj-Napoca — Cluj-Napoca"
  },
  // ---------------- JAPON (2) — 4 cartes pour 2 images : tokyo.jpg ×3 ----------------
  {
    id: "jads-japan-africa-dream",
    expectTitle: "Japan Africa Dream Scholarship (JADS)",
    image: "jads-japan-africa-dream.jpg",
    sujet: "le carrefour de Shibuya, Tokyo — Tokyo"
  },
  {
    id: "jj-wbgsp",
    expectTitle: "Joint Japan/World Bank Graduate Scholarship Program (JJ/WBGSP)",
    image: "jj-wbgsp.jpg",
    sujet: "Tokyo vue du ciel — Tokyo"
  },
  // ---------------- CORÉE DU SUD (1) — snu-seoul.jpg ×2 ----------------
  {
    id: "snu-glo-harmony-scholarship",
    expectTitle: "Glo-Harmony Scholarship (Seoul National University / Fondation Samsung)",
    image: "snu-glo-harmony-scholarship.jpg",
    sujet: "un pavillon de palais seoulien — Seoul"
  },
  // ---------------- HONGRIE (1) — debrecen.jpg ×2 ----------------
  {
    id: "fao-hungarian-government-scholarship",
    expectTitle: "FAO–Hungarian Government Scholarship Programme",
    image: "fao-hungarian-government-scholarship.jpg",
    sujet: "le Parlement hongrois sur le Danube — Budapest"
  },
  // ---------------- SUISSE (1) — lausanne.jpg ×2 ----------------
  {
    id: "epfl-edic-doctoral",
    expectTitle: "EPFL — Programme doctoral EDIC (informatique et systèmes de communication)",
    image: "epfl-edic-doctoral.jpg",
    sujet: "le campus de l'EPFL et les Alpes — Lausanne"
  },
];

const analyzeBtn = document.getElementById("analyzeBtn");
const writeBtn = document.getElementById("writeBtn");
const verifyBtn = document.getElementById("verifyBtn");
const analyzeLog = document.getElementById("analyzeLog");
const writeLog = document.getElementById("writeLog");
const verifyLog = document.getElementById("verifyLog");

let lastPlan = null;

function log(box, msg, cls) {
  box.classList.add("is-visible");
  const line = document.createElement("div");
  if (cls) line.className = cls;
  line.textContent = msg;
  box.appendChild(line);
  box.scrollTop = box.scrollHeight;
}

// ==========================================================
// Étape 1 — analyse (lecture seule)
// ==========================================================

analyzeBtn.addEventListener("click", async () => {

  analyzeBtn.disabled = true;
  analyzeLog.innerHTML = "";
  lastPlan = null;

  try {

    let blocking = false;
    const plan = [];
    const vus = new Set();
    const images = new Set();

    log(analyzeLog, `Vérification des ${FIXES.length} bourses...`);

    for (const f of FIXES) {

      if (vus.has(f.id)) {
        log(analyzeLog, `ERREUR : "${f.id}" apparaît deux fois dans le lot.`, "err");
        blocking = true;
        continue;
      }
      vus.add(f.id);

      // Deux bourses ne doivent jamais partager un fichier : c'est la
      // règle depuis le lot 14, et c'est tout l'objet de ce lot-ci.
      if (images.has(f.image)) {
        log(analyzeLog, `ERREUR : le fichier "${f.image}" est attribué à deux bourses.`, "err");
        blocking = true;
        continue;
      }
      images.add(f.image);

      const snap = await getDoc(doc(db, "scholarships", f.id));

      if (!snap.exists()) {
        log(analyzeLog, `ERREUR : "${f.id}" absent de la base.`, "err");
        blocking = true;
        continue;
      }

      const titre = snap.data().title || "";
      if (normalize(titre) !== normalize(f.expectTitle)) {
        log(analyzeLog, `ERREUR : "${f.id}" existe mais son titre a changé.`, "err");
        log(analyzeLog, `    attendu : "${f.expectTitle}"`, "err");
        log(analyzeLog, `    en base : "${titre}"`, "err");
        blocking = true;
        continue;
      }

      // Ne jamais écraser une photo déjà posée par un lot précédent.
      const deja = snap.data().image;
      if (deja) {
        log(analyzeLog, `IGNORÉE : "${f.id}" porte déjà l'image "${deja}" — non touchée.`, "warn");
        continue;
      }

      plan.push({ id: f.id, image: f.image, sujet: f.sujet });
      log(analyzeLog, `${f.id} → ${f.image}   (${f.sujet})`, "ok");
    }

    log(analyzeLog, "");
    log(analyzeLog, `${plan.length}/${FIXES.length} bourses prêtes, ${images.size} fichiers tous distincts.`,
        plan.length === FIXES.length ? "ok" : "warn");

    log(analyzeLog, "");
    log(analyzeLog, "RAPPEL : les 95 fichiers doivent déjà être sur le disque.", "warn");
    log(analyzeLog, "Si scripts/add-lot26-scholarship-photos.ps1 n'a pas affiché « 95/95 fichiers présents », arrêter ici : écrire le champ `image` désactive la cascade de repli et produirait 19 images cassées.", "warn");

    if (blocking) {
      log(analyzeLog, "");
      log(analyzeLog, "Anomalie(s) détectée(s) — corriger avant l'étape 2. Aucune écriture n'a eu lieu.", "err");
      return;
    }

    if (!plan.length) {
      log(analyzeLog, "");
      log(analyzeLog, "Rien à écrire : les 19 bourses portent déjà une image. Lot déjà passé.", "ok");
      return;
    }

    lastPlan = plan;
    log(analyzeLog, "");
    log(analyzeLog, "Plan prêt. Seul le champ `image` sera écrit.", "ok");
    writeBtn.disabled = false;
    writeBtn.textContent = "Écrire";

  } catch (err) {
    log(analyzeLog, `ERREUR : ${err.message}`, "err");
  } finally {
    analyzeBtn.disabled = false;
  }

});

// ==========================================================
// Étape 2 — écriture
// ==========================================================

writeBtn.addEventListener("click", async () => {

  if (!lastPlan) {
    log(writeLog, "Lancer l'étape 1 d'abord.", "err");
    return;
  }

  writeBtn.disabled = true;
  writeLog.innerHTML = "";

  try {

    for (const p of lastPlan) {
      await setDoc(doc(db, "scholarships", p.id), { image: p.image }, { merge: true });
      log(writeLog, `  ${p.id}`, "ok");
    }

    log(writeLog, "");
    log(writeLog, `${lastPlan.length} bourses mises à jour. Lancer l'étape 3.`, "ok");
    verifyBtn.disabled = false;
    verifyBtn.textContent = "Vérifier";

  } catch (err) {
    log(writeLog, `ERREUR : ${err.message}`, "err");
  } finally {
    writeBtn.disabled = false;
  }

});

// ==========================================================
// Étape 3 — vérification
// ==========================================================

verifyBtn.addEventListener("click", async () => {

  if (!lastPlan) {
    log(verifyLog, "Lancer les étapes 1 et 2 d'abord.", "err");
    return;
  }

  verifyBtn.disabled = true;
  verifyLog.innerHTML = "";

  try {

    let ecarts = 0;

    for (const p of lastPlan) {
      const snap = await getDoc(doc(db, "scholarships", p.id));
      if (!snap.exists()) {
        log(verifyLog, `MANQUANT : ${p.id}`, "err");
        ecarts++;
        continue;
      }
      if (snap.data().image !== p.image) {
        log(verifyLog, `ÉCART : ${p.id}`, "err");
        log(verifyLog, `    attendu : ${p.image}`, "err");
        log(verifyLog, `    en base : ${snap.data().image}`, "err");
        ecarts++;
      } else {
        log(verifyLog, `OK ${p.id}`, "ok");
      }
    }

    log(verifyLog, "");
    if (ecarts === 0) {
      log(verifyLog, `${lastPlan.length}/${lastPlan.length} conformes, 0 écart. Lot 26 terminé.`, "ok");
      log(verifyLog, "Ouvrir scholarships.html et vérifier À L'ŒIL que plus aucune carte ne répète une image dans son pays — aucun contrôle automatique ne peut juger qu'une photo est la bonne.", "warn");
    } else {
      log(verifyLog, `${ecarts} écart(s) — NE PAS considérer le lot comme terminé.`, "err");
    }

  } catch (err) {
    log(verifyLog, `ERREUR : ${err.message}`, "err");
  } finally {
    verifyBtn.disabled = false;
  }

});
