// ============================================================
// FitzUniverse — Photos des bourses, Lot 25 (2026-08-30)
//
// Pose le champ `image` sur les 30 bourses dont le fichier vient d'être
// téléchargé par scripts/add-lot25-scholarship-photos.ps1. Ne crée aucun
// document, n'en supprime aucun : un seul champ, en setDoc merge.
//
// À NE LANCER QU'APRÈS LE SCRIPT POWERSHELL. L'étape 1 ne peut pas
// vérifier depuis le navigateur que les fichiers existent sur le disque —
// c'est le script lui-même qui compte ses 150 fichiers et refuse de rendre
// la main s'il en manque un. Écrire le champ avant que les fichiers soient
// là produirait 30 images cassées, la cascade de repli ne s'appliquant plus
// dès que `image` est renseigné.
//
// POURQUOI CE LOT
// Aucune de ces 30 cartes n'était cassée : chacune affichait déjà une vraie
// photo, via l'étage 3 de la cascade de js/scholarship-image.js (la capitale
// du pays). Le défaut était la RÉPÉTITION — les 8 bourses italiennes
// montraient toutes Rome, les 6 allemandes Berlin, les 5 suisses Zurich,
// les 5 japonaises Tokyo, les 5 turques Istanbul, la coréenne Séoul. Six
// images pour trente cartes.
//
// Après ce lot, 86 des 131 bourses portent une photo propre. Les 45
// restantes tombent sur l'étage 2 (photo de l'université liée), qui est
// déjà varié — 41 d'entre elles — ou sur le repli générique corrigé par le
// lot 24.
//
// Les identifiants viennent de l'export JSON de la base, et le titre exact
// lu dans cet export sert de garde contre un identifiant réutilisé.
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
  // ---------------- ITALIE (8) — les huit affichaient Rome ----------------
  {
    id: "adisu-puglia",
    expectTitle: "Bando Benefici e Servizi ADISU Puglia",
    image: "adisu-puglia.jpg",
    sujet: "les trulli d'Alberobello — Pouilles"
  },
  {
    id: "aliseo-liguria",
    expectTitle: "Borsa di studio universitaria ALiSEO — Liguria",
    image: "aliseo-liguria.jpg",
    sujet: "Manarola, Cinque Terre — Ligurie"
  },
  {
    id: "ardis-friuli-venezia-giulia",
    expectTitle: "Bando unico per i benefici regionali — ARDiS Friuli-Venezia Giulia",
    image: "ardis-friuli-venezia-giulia.jpg",
    sujet: "le front de mer de Trieste — Frioul-Vénétie Julienne"
  },
  {
    id: "dsu-lombardia-milano-statale",
    expectTitle: "Borsa di studio DSU — Regione Lombardia (Università degli Studi di Milano)",
    image: "dsu-lombardia-milano-statale.jpg",
    sujet: "la cour de Brera et sa statue de Napoléon, Milan — Lombardie"
  },
  {
    id: "edisu-pavia",
    expectTitle: "Borsa di studio EDiSU Pavia",
    image: "edisu-pavia.jpg",
    sujet: "le Ponte Coperto sur le Tessin, Pavie — Pavie"
  },
  {
    id: "ergo-emilia-romagna",
    expectTitle: "Borsa di studio ER.GO — Emilia-Romagna",
    image: "ergo-emilia-romagna.jpg",
    sujet: "le campanile de Parme — Émilie-Romagne"
  },
  {
    id: "invest-your-talent-italy",
    expectTitle: "Invest Your Talent in Italy (IYT)",
    image: "invest-your-talent-italy.jpg",
    sujet: "Vérone et l'Adige — Vérone"
  },
  {
    id: "scuola-normale-superiore-phd",
    expectTitle: "Corso di perfezionamento (PhD) — Scuola Normale Superiore",
    image: "scuola-normale-superiore-phd.jpg",
    sujet: "la tour Guinigi, Lucques — Lucques (Toscane)"
  },
  // ---------------- ALLEMAGNE (6) — les six affichaient Berlin ----------------
  {
    id: "daad-epos",
    expectTitle: "DAAD Development-Related Postgraduate Courses (EPOS)",
    image: "daad-epos.jpg",
    sujet: "les tours de Francfort — Francfort"
  },
  {
    id: "daad-helmut-schmidt-programme",
    expectTitle: "DAAD Helmut-Schmidt-Programme (Public Policy and Good Governance)",
    image: "daad-helmut-schmidt-programme.jpg",
    sujet: "l'Elbphilharmonie, Hambourg — Hambourg"
  },
  {
    id: "friedrich-ebert-stiftung",
    expectTitle: "Friedrich-Ebert-Stiftung — Grundförderung für ausländische Studierende",
    image: "friedrich-ebert-stiftung.jpg",
    sujet: "Heidelberg, son pont et le Neckar — Heidelberg"
  },
  {
    id: "heinrich-boell-stiftung",
    expectTitle: "Heinrich-Böll-Stiftung Studienwerk",
    image: "heinrich-boell-stiftung.jpg",
    sujet: "la cathedrale de Cologne — Cologne"
  },
  {
    id: "konrad-adenauer-stiftung",
    expectTitle: "Konrad-Adenauer-Stiftung — Stipendienprogramm für ausländische Studierende",
    image: "konrad-adenauer-stiftung.jpg",
    sujet: "Bonn — Bonn"
  },
  {
    id: "rosa-luxemburg-stiftung",
    expectTitle: "Rosa-Luxemburg-Stiftung Studienwerk",
    image: "rosa-luxemburg-stiftung.jpg",
    sujet: "Leipzig et son beffroi — Leipzig"
  },
  // ---------------- JAPON (5) — les cinq affichaient Tokyo ----------------
  {
    id: "abe-initiative-jica",
    expectTitle: "ABE Initiative (African Business Education Initiative for Youth)",
    image: "abe-initiative-jica.jpg",
    sujet: "Yokohama de nuit — Yokohama"
  },
  {
    id: "honjo-international-scholarship",
    expectTitle: "Honjo International Scholarship Foundation",
    image: "honjo-international-scholarship.jpg",
    sujet: "une pagode de Kyoto — Kyoto"
  },
  {
    id: "jasso-monbukagakusho-honors",
    expectTitle: "JASSO Monbukagakusho Honors Scholarship",
    image: "jasso-monbukagakusho-honors.jpg",
    sujet: "le chateau d'Osaka — Osaka"
  },
  {
    id: "jica-sdgs-global-leader",
    expectTitle: "JICA SDGs Global Leader Program",
    image: "jica-sdgs-global-leader.jpg",
    sujet: "le mont Fuji — Mont Fuji"
  },
  {
    id: "rotary-yoneyama-overseas",
    expectTitle: "Rotary Yoneyama Memorial Foundation — Scholarship for Overseas Candidates",
    image: "rotary-yoneyama-overseas.jpg",
    sujet: "les daims de Nara — Nara"
  },
  // ---------------- SUISSE (5) — les cinq affichaient Zurich ----------------
  {
    id: "iheid-scholarships",
    expectTitle: "Bourses de l'Institut de hautes études internationales et du développement (IHEID)",
    image: "iheid-scholarships.jpg",
    sujet: "le Palais des Nations, Geneve — Geneve"
  },
  {
    id: "unifr-research-scholarships",
    expectTitle: "Bourses de recherche de l'Université de Fribourg",
    image: "unifr-research-scholarships.jpg",
    sujet: "la vieille ville de Fribourg et la Sarine — Fribourg"
  },
  {
    id: "unige-excellence-master-fellowships",
    expectTitle: "Excellence Master Fellowships — Université de Genève",
    image: "unige-excellence-master-fellowships.jpg",
    sujet: "le Jet d'eau de Geneve — Geneve"
  },
  {
    id: "unil-master-grants",
    expectTitle: "UNIL Master's Grants — Université de Lausanne",
    image: "unil-master-grants.jpg",
    sujet: "la cathedrale de Lausanne — Lausanne"
  },
  {
    id: "zeno-karl-schindler-master-thesis",
    expectTitle: "Master Thesis Grant — Fondation Zeno Karl Schindler",
    image: "zeno-karl-schindler-master-thesis.jpg",
    sujet: "Berne et les ponts de l'Aar — Berne"
  },
  // ---------------- TURQUIE (5) — les cinq affichaient Istanbul ----------------
  {
    id: "diyanet-tdv-international",
    expectTitle: "Bourses internationales de théologie de la Fondation Diyanet de Turquie (TDV)",
    image: "diyanet-tdv-international.jpg",
    sujet: "une mosquee ottomane — Turquie"
  },
  {
    id: "tubitak-2216-research-fellowship",
    expectTitle: "TÜBİTAK 2216 — Research Fellowship Programme for International Researchers",
    image: "tubitak-2216-research-fellowship.jpg",
    sujet: "Anitkabir, Ankara — Ankara"
  },
  {
    id: "turkiye-burslari-research",
    expectTitle: "Türkiye Bursları Araştırma Bursu (Research Scholarship)",
    image: "turkiye-burslari-research.jpg",
    sujet: "les montgolfieres de Cappadoce — Cappadoce"
  },
  {
    id: "turkiye-burslari-success",
    expectTitle: "Türkiye Bursları Başarı Bursu (Success Scholarship)",
    image: "turkiye-burslari-success.jpg",
    sujet: "la tour de l'Horloge d'Izmir — Izmir"
  },
  {
    id: "ytb-isdb-joint-scholarship",
    expectTitle: "Programme conjoint Türkiye Bursları – Banque islamique de développement (YTB-IsDB)",
    image: "ytb-isdb-joint-scholarship.jpg",
    sujet: "le dome turquoise du mausolee de Mevlana, Konya — Konya"
  },
  // ---------------- CORÉE DU SUD (1) — affichait Séoul ----------------
  {
    id: "koica-ciat-scholarship",
    expectTitle: "KOICA Scholarship Program (CIAT)",
    image: "koica-ciat-scholarship.jpg",
    sujet: "le village de Gamcheon, Busan — Busan"
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
    log(analyzeLog, "RAPPEL : les 150 fichiers doivent déjà être sur le disque.", "warn");
    log(analyzeLog, "Si scripts/add-lot25-scholarship-photos.ps1 n'a pas affiché « 150/150 fichiers présents », arrêter ici : écrire le champ `image` désactive la cascade de repli et produirait 30 images cassées.", "warn");

    if (blocking) {
      log(analyzeLog, "");
      log(analyzeLog, "Anomalie(s) détectée(s) — corriger avant l'étape 2. Aucune écriture n'a eu lieu.", "err");
      return;
    }

    if (!plan.length) {
      log(analyzeLog, "");
      log(analyzeLog, "Rien à écrire : les 30 bourses portent déjà une image. Lot déjà passé.", "ok");
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
      log(verifyLog, `${lastPlan.length}/${lastPlan.length} conformes, 0 écart. Lot 25 terminé.`, "ok");
      log(verifyLog, "Ouvrir scholarships.html et vérifier À L'ŒIL que les 30 cartes montrent bien 30 images différentes — aucun contrôle automatique ne peut juger qu'une photo est la bonne.", "warn");
    } else {
      log(verifyLog, `${ecarts} écart(s) — NE PAS considérer le lot comme terminé.`, "err");
    }

  } catch (err) {
    log(verifyLog, `ERREUR : ${err.message}`, "err");
  } finally {
    verifyBtn.disabled = false;
  }

});
