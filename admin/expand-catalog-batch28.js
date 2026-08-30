// ============================================================
// FitzUniverse — Niveaux d'études, Lot 28 (2026-08-30)
//
// Renseigne le champ `levels` sur les 24 bourses que l'export du
// catalogue (30/08/2026) listait avec `niveaux: []`. Ne crée aucun
// document, n'en supprime aucun : un seul champ, en setDoc merge.
//
// LE DÉFAUT CORRIGÉ
// `scholarships.js:365` filtre ainsi :
//     scholarships.filter((s) => (s.levels || []).includes(niveau))
// Une bourse au tableau vide ne passe donc AUCUN filtre de niveau. Un
// doctorant qui coche « Doctorat » dans le catalogue perd d'un coup les
// onze bourses de doctorat italiennes — précisément ce qu'il cherche.
// 24 bourses sur 131, soit 18 % du catalogue, disparaissent dès qu'un
// niveau est coché.
//
// Le moteur de recommandation, lui, n'est PAS touché : il compare
// `program.level` — le niveau du PROGRAMME, pas de la bourse — et n'en
// tire qu'un bonus de +3, jamais un filtre (js/recommend-programs.js
// lignes 149 et 201). Ce lot corrige donc le catalogue, pas le moteur.
//
// D'OÙ VIENNENT LES NIVEAUX, ET COMMENT ILS SONT VÉRIFIÉS
// 23 des 24 bourses ont des programmes liés qui portent, eux, un champ
// `level`. L'étape 1 ne se contente PAS de la valeur écrite ci-dessous :
// elle lit les programmes réellement en base, normalise leurs niveaux
// avec le même vocabulaire que le moteur (LEVEL_ALIASES de
// js/recommend-programs.js) et REFUSE d'écrire si ce qu'elle observe ne
// correspond pas à ce qui est attendu. La valeur proposée ici est une
// hypothèse ; ce sont les programmes qui tranchent.
//
// Une seule bourse fait exception : `vanier-canada-graduate-scholarship`
// n'a AUCUN programme lié. Son niveau vient de la source (programme
// exclusivement doctoral, aujourd'hui fermé et remplacé par la Bourse
// d'études supérieures du Canada – doctorat). Elle est marquée
// `base: "source"` et l'étape 1 le dit explicitement au lieu de faire
// silence sur l'absence de preuve.
//
// Vocabulaire : "Licence", "Master", "Doctorat", dans cet ordre.
// ============================================================

import { db } from "../firebase-config.js";

import {
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const ORDRE = ["Licence", "Master", "Doctorat"];

// Repris tel quel de js/recommend-programs.js — même vocabulaire, pour
// que ce lot lise les programmes exactement comme le moteur les lit.
const LEVEL_ALIASES = {
  "licence": "Licence", "bachelor": "Licence", "bachelier": "Licence",
  "master": "Master",
  "doctorat": "Doctorat", "phd": "Doctorat", "doctorate": "Doctorat"
};

function normalizeLevel(value) {
  const text = String(value || "").toLowerCase();
  for (const key in LEVEL_ALIASES) {
    if (text.includes(key)) return LEVEL_ALIASES[key];
  }
  return "";
}

function normalizeTitre(str) {
  return String(str || "")
    .replace(/ı/g, "i").replace(/İ/g, "i")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().trim();
}

function trier(niveaux) {
  return ORDRE.filter((n) => niveaux.includes(n));
}

const FIXES = [
  // ---------------- ITALIE (20) — 18 bourses régionales ou d'université + 2 Bocconi ----------------
  {
    id: "bocconi-merit-award",
    expectTitle: "Bocconi Merit Award",
    levels: ["Licence"],
    base: "prog"
  },
  {
    id: "bocconi-graduate-merit-award",
    expectTitle: "Bocconi Graduate Merit Award",
    levels: ["Master"],
    base: "prog"
  },
  {
    id: "bocconi-phd-scholarship",
    expectTitle: "Bocconi PhD Scholarship",
    levels: ["Doctorat"],
    base: "prog"
  },
  {
    id: "politecnico-di-milano-merit-based-scholarship",
    expectTitle: "Politecnico di Milano Merit-Based Scholarship",
    levels: ["Licence", "Master"],
    base: "prog"
  },
  {
    id: "politecnico-di-milano-phd-scholarship",
    expectTitle: "Politecnico di Milano PhD Scholarship",
    levels: ["Doctorat"],
    base: "prog"
  },
  {
    id: "edisu-piemonte-scholarship",
    expectTitle: "EDISU Piemonte Scholarship",
    levels: ["Licence", "Master"],
    base: "prog"
  },
  {
    id: "polito-phd-scholarship",
    expectTitle: "Polito PhD Scholarship",
    levels: ["Doctorat"],
    base: "prog"
  },
  {
    id: "international-talents-unibo",
    expectTitle: "International Talents @Unibo",
    levels: ["Licence", "Master"],
    base: "prog"
  },
  {
    id: "unibo-phd-scholarship",
    expectTitle: "Unibo PhD Scholarship",
    levels: ["Doctorat"],
    base: "prog"
  },
  {
    id: "laziodisco-scholarship",
    expectTitle: "LazioDisco Scholarship",
    levels: ["Licence", "Master"],
    base: "prog"
  },
  {
    id: "sapienza-phd-scholarship",
    expectTitle: "Sapienza PhD Scholarship",
    levels: ["Doctorat"],
    base: "prog"
  },
  {
    id: "campania-regional-scholarship",
    expectTitle: "Campania Regional Scholarship",
    levels: ["Licence", "Master"],
    base: "prog"
  },
  {
    id: "university-of-naples-federico-ii-phd-scholarship",
    expectTitle: "University of Naples Federico II PhD Scholarship",
    levels: ["Doctorat"],
    base: "prog"
  },
  {
    id: "dsu-toscana-scholarship",
    expectTitle: "DSU Toscana Scholarship",
    levels: ["Licence", "Master"],
    base: "prog"
  },
  {
    id: "university-of-florence-phd-scholarship",
    expectTitle: "University of Florence PhD Scholarship",
    levels: ["Doctorat"],
    base: "prog"
  },
  {
    id: "university-of-pisa-phd-scholarship",
    expectTitle: "University of Pisa PhD Scholarship",
    levels: ["Doctorat"],
    base: "prog"
  },
  {
    id: "veneto-regional-scholarship",
    expectTitle: "Veneto Regional Scholarship",
    levels: ["Licence", "Master"],
    base: "prog"
  },
  {
    id: "university-of-padua-phd-scholarship",
    expectTitle: "University of Padua PhD Scholarship",
    levels: ["Doctorat"],
    base: "prog"
  },
  {
    id: "opera-universitaria-scholarship",
    expectTitle: "Opera Universitaria Scholarship",
    levels: ["Licence", "Master"],
    base: "prog"
  },
  {
    id: "university-of-trento-phd-scholarship",
    expectTitle: "University of Trento PhD Scholarship",
    levels: ["Doctorat"],
    base: "prog"
  },
  // ---------------- HONGRIE et CHINE (2) — programmes nationaux couvrant les trois cycles ----------------
  {
    id: "stipendium-hungaricum",
    expectTitle: "Stipendium Hungaricum",
    levels: ["Licence", "Master", "Doctorat"],
    base: "prog"
  },
  {
    id: "chinese-government-scholarship",
    expectTitle: "Chinese Government Scholarship",
    levels: ["Licence", "Master", "Doctorat"],
    base: "prog"
  },
  // ---------------- CANADA (2) ----------------
  {
    id: "lester-b-pearson-international-scholarship",
    expectTitle: "Lester B. Pearson International Scholarship",
    levels: ["Licence"],
    base: "prog"
  },
  {
    id: "vanier-canada-graduate-scholarship",
    expectTitle: "Vanier Canada Graduate Scholarship",
    levels: ["Doctorat"],
    base: "source"
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
// Étape 1 — analyse : les PROGRAMMES tranchent, pas ce fichier
// ==========================================================

analyzeBtn.addEventListener("click", async () => {

  analyzeBtn.disabled = true;
  analyzeLog.innerHTML = "";
  lastPlan = null;

  try {

    let blocking = false;
    const plan = [];

    log(analyzeLog, "Lecture de la collection programs...");
    const snapProgs = await getDocs(collection(db, "programs"));
    const parBourse = new Map();
    let sansNiveau = 0;

    for (const p of snapProgs.docs) {
      const d = p.data();
      if (!d.scholarshipId) continue;
      const niv = normalizeLevel(d.level);
      if (!niv) { sansNiveau++; continue; }
      if (!parBourse.has(d.scholarshipId)) parBourse.set(d.scholarshipId, new Set());
      parBourse.get(d.scholarshipId).add(niv);
    }

    log(analyzeLog, `${snapProgs.size} programmes lus, ${parBourse.size} bourses ont au moins un programme au niveau exploitable.`);
    if (sansNiveau) {
      log(analyzeLog, `${sansNiveau} programme(s) sans champ level exploitable — ignorés, ils ne peuvent ni confirmer ni infirmer.`, "warn");
    }
    log(analyzeLog, "");

    for (const f of FIXES) {

      const snap = await getDoc(doc(db, "scholarships", f.id));

      if (!snap.exists()) {
        log(analyzeLog, `ERREUR : "${f.id}" absent de la base.`, "err");
        blocking = true;
        continue;
      }

      const titre = snap.data().title || "";
      if (normalizeTitre(titre) !== normalizeTitre(f.expectTitle)) {
        log(analyzeLog, `ERREUR : "${f.id}" existe mais son titre a changé.`, "err");
        log(analyzeLog, `    attendu : "${f.expectTitle}"`, "err");
        log(analyzeLog, `    en base : "${titre}"`, "err");
        blocking = true;
        continue;
      }

      // Ne jamais écraser des niveaux déjà renseignés.
      const dejaLa = snap.data().levels;
      if (Array.isArray(dejaLa) && dejaLa.length) {
        log(analyzeLog, `IGNORÉE : "${f.id}" porte déjà ${JSON.stringify(dejaLa)} — non touchée.`, "warn");
        continue;
      }

      const attendu = trier(f.levels);

      if (f.base === "source") {
        const observes = parBourse.get(f.id);
        if (observes && observes.size) {
          log(analyzeLog, `ERREUR : "${f.id}" est déclarée sans programme lié, mais ${observes.size} niveau(x) ont été observés : ${trier([...observes]).join(", ")}. Reprendre la fiche.`, "err");
          blocking = true;
          continue;
        }
        log(analyzeLog, `${f.id} → ${attendu.join(", ")}   (aucun programme lié — base documentaire, non vérifiable ici)`, "warn");
        plan.push({ id: f.id, levels: attendu, base: f.base });
        continue;
      }

      const observes = parBourse.get(f.id);

      if (!observes || !observes.size) {
        log(analyzeLog, `ERREUR : "${f.id}" attend une déduction par les programmes, mais AUCUN programme exploitable n'est lié. Passer la fiche en base documentaire ou corriger les liaisons.`, "err");
        blocking = true;
        continue;
      }

      const vus = trier([...observes]);

      if (vus.join("|") !== attendu.join("|")) {
        log(analyzeLog, `ERREUR : "${f.id}" — les programmes ne disent pas ce qui est attendu.`, "err");
        log(analyzeLog, `    attendu dans ce lot : ${attendu.join(", ")}`, "err");
        log(analyzeLog, `    observé en base     : ${vus.join(", ")}`, "err");
        blocking = true;
        continue;
      }

      log(analyzeLog, `${f.id} → ${attendu.join(", ")}   (confirmé par ${observes.size} niveau(x) de programme)`, "ok");
      plan.push({ id: f.id, levels: attendu, base: f.base });
    }

    log(analyzeLog, "");
    log(analyzeLog, `${plan.length}/${FIXES.length} bourses prêtes.`, plan.length === FIXES.length ? "ok" : "warn");

    const parProg = plan.filter((p) => p.base === "prog").length;
    log(analyzeLog, `${parProg} confirmées par les programmes réels, ${plan.length - parProg} sur base documentaire seule.`);

    if (blocking) {
      log(analyzeLog, "");
      log(analyzeLog, "Anomalie(s) détectée(s) — corriger avant l'étape 2. Aucune écriture n'a eu lieu.", "err");
      return;
    }

    if (!plan.length) {
      log(analyzeLog, "");
      log(analyzeLog, "Rien à écrire : les 24 bourses portent déjà des niveaux. Lot déjà passé.", "ok");
      return;
    }

    lastPlan = plan;
    log(analyzeLog, "");
    log(analyzeLog, "Plan prêt. Seul le champ `levels` sera écrit.", "ok");
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

  if (!lastPlan) { log(writeLog, "Lancer l'étape 1 d'abord.", "err"); return; }

  writeBtn.disabled = true;
  writeLog.innerHTML = "";

  try {
    for (const p of lastPlan) {
      await setDoc(doc(db, "scholarships", p.id), { levels: p.levels }, { merge: true });
      log(writeLog, `  ${p.id} → ${p.levels.join(", ")}`, "ok");
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
// Étape 3 — vérification champ par champ
// ==========================================================

function sameArray(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

verifyBtn.addEventListener("click", async () => {

  if (!lastPlan) { log(verifyLog, "Lancer les étapes 1 et 2 d'abord.", "err"); return; }

  verifyBtn.disabled = true;
  verifyLog.innerHTML = "";

  try {
    let ecarts = 0;
    for (const p of lastPlan) {
      const snap = await getDoc(doc(db, "scholarships", p.id));
      if (!snap.exists()) {
        log(verifyLog, `MANQUANT : ${p.id}`, "err"); ecarts++; continue;
      }
      if (!sameArray(snap.data().levels, p.levels)) {
        log(verifyLog, `ÉCART : ${p.id}`, "err");
        log(verifyLog, `    attendu : ${JSON.stringify(p.levels)}`, "err");
        log(verifyLog, `    en base : ${JSON.stringify(snap.data().levels)}`, "err");
        ecarts++;
      } else {
        log(verifyLog, `OK ${p.id} → ${p.levels.join(", ")}`, "ok");
      }
    }
    log(verifyLog, "");
    if (ecarts === 0) {
      log(verifyLog, `${lastPlan.length}/${lastPlan.length} conformes, 0 écart. Lot 28 terminé.`, "ok");
      log(verifyLog, "Contrôle utile ensuite : sur scholarships.html, cocher « Doctorat » — les onze bourses de doctorat italiennes doivent maintenant rester affichées.", "warn");
    } else {
      log(verifyLog, `${ecarts} écart(s) — NE PAS considérer le lot comme terminé.`, "err");
    }
  } catch (err) {
    log(verifyLog, `ERREUR : ${err.message}`, "err");
  } finally {
    verifyBtn.disabled = false;
  }

});
