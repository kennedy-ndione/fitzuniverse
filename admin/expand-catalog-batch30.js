// ============================================================
// FitzUniverse — Backfill du bailleur, Lot 30 (2026-08-30)
//
// Renseigne `funder`, `funderName` et `entryPoint` sur les 131 bourses
// du catalogue. N'écrit QUE ces trois champs, sur la seule collection
// `scholarships` : aucune université, aucun programme, aucun autre
// champ de bourse n'est touché.
//
// POURQUOI CE LOT
// La phase 1 (2026-08-30) a introduit les trois champs, le formulaire
// admin, le filtre catalogue et le portail du bailleur sur la fiche.
// Tant que la base ne les porte pas, les 5 valeurs du filtre renvoient
// 0 résultat et le bouton « portail officiel de la bourse » reste en
// dernier partout. Ce lot rend la phase 1 visible.
//
// LA CLASSIFICATION, ET LA RÈGLE QUI LA TIENT
// Le bailleur est celui qui DÉCIDE ET PAIE, tel que l'étudiant le
// rencontre. Deux conséquences assumées :
//   - Les OPÉRATEURS PUBLICS NATIONAUX d'une politique de bourses
//     (DAAD, ARES, VLIR-UOS, Campus France, AMCI, NAWA, Camões,
//     Svenska institutet, JICA, KOICA, YTB, NIIED, ICCR, CSC) sont
//     classés "gouvernement", avec l'agence en `funderName`. Ce sont
//     des associations ou des instituts, pas des ministères — mais
//     pour un candidat ce sont des programmes nationaux : portail
//     central, fenêtre annuelle, condition de nationalité.
//   - Les FONDATIONS POLITIQUES ALLEMANDES (Ebert, Böll, Adenauer,
//     Luxemburg), les BANQUES DE DÉVELOPPEMENT (Banque mondiale, BAD,
//     BID) et les fondations privées (Mastercard, Rhodes, Rotary,
//     Honjo, Samsung, Zeno Karl Schindler, Weidenfeld-Hoffmann) sont
//     classées "organisation" : elles sont juridiquement indépendantes
//     d'un État, même quand elles reçoivent des fonds publics.
//
// LES BOURSES RÉGIONALES ITALIENNES ONT entryPoint:"bourse"
// Correction d'une intuition fausse : le droit à l'étude italien exige
// bien l'admission d'abord, mais le DOSSIER DE BOURSE se dépose sur le
// portail de l'organisme régional (laziodisco.it, edisu.piemonte.it,
// er-go.it...), avec l'attestation ISEE — jamais auprès de
// l'université. `entryPoint` dit où va le dossier, pas ce qui arrive
// en premier dans le calendrier ; la chronologie appartient à
// `generalCriteria`.
//
// DEUX BOURSES RESTENT SANS entryPoint, À DESSEIN
//   - knight-hennessy-scholars : deux candidatures SÉPARÉES et toutes
//     deux obligatoires (le programme Knight-Hennessy ET le diplôme
//     Stanford), avec leurs propres échéances. Aucune des deux valeurs
//     n'est vraie ; le champ reste absent.
//   - fao-hungarian-government-scholarship : programme conjoint FAO /
//     gouvernement hongrois dont la porte n'a pas été vérifiée à la
//     source. Un champ absent est un inconnu — on ne devine pas.
// C'est la même règle que `estEligible` : ne jamais transformer une
// inconnue en valeur par défaut.
//
// CE LOT NE SUPPRIME RIEN
// L'écriture se fait par `updateDoc` avec les seuls champs du plan.
// Une bourse déjà classée à la main dans l'admin est signalée à
// l'étape 1 quand la valeur en base diffère du plan : c'est à
// l'administrateur de trancher avant d'écrire.
// ============================================================

import { db } from "../firebase-config.js";

import {
  collection,
  getDocs,
  getDoc,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// Les 5 valeurs EXACTES de l'énuméré (js/scholarship-filters.js,
// LIBELLES_FUNDER) et les 2 de entryPoint. Le lot se refuse à écrire
// une valeur hors de ces listes.
const FUNDERS = ["gouvernement", "universite", "region", "organisation", "entreprise"];
const ENTRY_POINTS = ["bourse", "universite"];

// entryPoint vide = champ VOLONTAIREMENT ABSENT, jamais "".
const PLAN = [

  // ---------------- Afrique du Sud ----------------
  { id: "mastercard-foundation-scholars-uct", funder: "organisation", funderName: "Mastercard Foundation", entryPoint: "universite" },

  // ---------------- Allemagne ----------------
  { id: "daad-epos", funder: "gouvernement", funderName: "DAAD", entryPoint: "universite" },
  { id: "daad-helmut-schmidt-programme", funder: "gouvernement", funderName: "DAAD", entryPoint: "bourse" },
  { id: "daad-study-scholarships", funder: "gouvernement", funderName: "DAAD", entryPoint: "bourse" },
  { id: "deutschlandstipendium", funder: "universite", funderName: "Deutschlandstipendium", entryPoint: "universite" },
  { id: "friedrich-ebert-stiftung", funder: "organisation", funderName: "Friedrich-Ebert-Stiftung", entryPoint: "bourse" },
  { id: "heinrich-boell-stiftung", funder: "organisation", funderName: "Heinrich-Böll-Stiftung", entryPoint: "bourse" },
  { id: "konrad-adenauer-stiftung", funder: "organisation", funderName: "Konrad-Adenauer-Stiftung", entryPoint: "bourse" },
  { id: "landesstipendium-niedersachsen", funder: "region", funderName: "Land de Basse-Saxe", entryPoint: "universite" },
  { id: "rosa-luxemburg-stiftung", funder: "organisation", funderName: "Rosa-Luxemburg-Stiftung", entryPoint: "bourse" },
  { id: "uni-hamburg-leistungsstipendien", funder: "universite", funderName: "Universität Hamburg", entryPoint: "universite" },

  // ---------------- Arabie Saoudite ----------------
  { id: "king-abdulaziz-scholarship", funder: "gouvernement", funderName: "Ministère saoudien de l'Éducation", entryPoint: "bourse" },

  // ---------------- Belgique ----------------
  { id: "bourse-master-in-wbi", funder: "gouvernement", funderName: "Wallonie-Bruxelles International", entryPoint: "bourse" },
  { id: "bourses-formations-internationales-ares", funder: "gouvernement", funderName: "ARES (coopération belge)", entryPoint: "bourse" },
  { id: "icp-connect-scholarships-vlir-uos", funder: "gouvernement", funderName: "VLIR-UOS", entryPoint: "universite" },

  // ---------------- Canada ----------------
  { id: "lester-b-pearson-international-scholarship", funder: "universite", funderName: "University of Toronto", entryPoint: "universite" },
  { id: "mcgill-major-entrance-scholarships", funder: "universite", funderName: "McGill University", entryPoint: "universite" },
  { id: "ubc-international-scholars-program", funder: "universite", funderName: "University of British Columbia", entryPoint: "universite" },
  { id: "vanier-canada-graduate-scholarship", funder: "gouvernement", funderName: "Gouvernement du Canada", entryPoint: "universite" },

  // ---------------- Chine ----------------
  { id: "beijing-government-scholarship", funder: "region", funderName: "Municipalité de Pékin", entryPoint: "universite" },
  { id: "chinese-government-scholarship", funder: "gouvernement", funderName: "China Scholarship Council (CSC)", entryPoint: "bourse" },
  { id: "nanjing-government-scholarship", funder: "region", funderName: "Municipalité de Nankin (Jiangsu)", entryPoint: "universite" },
  { id: "shanghai-government-scholarship", funder: "region", funderName: "Municipalité de Shanghai", entryPoint: "universite" },

  // ---------------- Corée du Sud ----------------
  { id: "ama-plus-scholarship", funder: "gouvernement", funderName: "Ministère coréen de la Culture (MCST)", entryPoint: "universite" },
  { id: "snu-glo-harmony-scholarship", funder: "organisation", funderName: "Samsung Foundation", entryPoint: "universite" },
  { id: "global-korea-scholarship", funder: "gouvernement", funderName: "NIIED (Study in Korea)", entryPoint: "bourse" },
  { id: "kaist-scholarship", funder: "universite", funderName: "KAIST", entryPoint: "universite" },
  { id: "koica-ciat-scholarship", funder: "gouvernement", funderName: "KOICA", entryPoint: "bourse" },
  { id: "ku-global-leader-scholarship", funder: "universite", funderName: "Korea University", entryPoint: "universite" },
  { id: "postech-gift-scholarship", funder: "universite", funderName: "POSTECH", entryPoint: "universite" },
  { id: "snu-global-scholarship", funder: "universite", funderName: "Seoul National University", entryPoint: "universite" },

  // ---------------- États-Unis ----------------
  { id: "knight-hennessy-scholars", funder: "universite", funderName: "Stanford University", entryPoint: "" },
  { id: "mastercard-foundation-scholars-program", funder: "organisation", funderName: "Mastercard Foundation", entryPoint: "universite" },

  // ---------------- France ----------------
  { id: "bourse-emile-boutmy", funder: "universite", funderName: "Sciences Po", entryPoint: "universite" },
  { id: "eiffel-excellence-scholarship", funder: "gouvernement", funderName: "Campus France (MEAE)", entryPoint: "universite" },

  // ---------------- Hongrie ----------------
  { id: "corvinus-scholarship", funder: "universite", funderName: "Corvinus University of Budapest", entryPoint: "universite" },
  { id: "fao-hungarian-government-scholarship", funder: "organisation", funderName: "FAO – Gouvernement hongrois", entryPoint: "" },
  { id: "semmelweis-pannonia-in-excellence", funder: "universite", funderName: "Semmelweis University", entryPoint: "universite" },
  { id: "stipendium-hungaricum", funder: "gouvernement", funderName: "Tempus Public Foundation", entryPoint: "bourse" },
  { id: "szte-start-scholarship", funder: "universite", funderName: "University of Szeged", entryPoint: "universite" },
  { id: "ud-international-scholarship", funder: "universite", funderName: "University of Debrecen", entryPoint: "universite" },

  // ---------------- Inde ----------------
  { id: "iccr-africa-scholarship-scheme", funder: "gouvernement", funderName: "ICCR", entryPoint: "bourse" },

  // ---------------- Italie — régionales de droit à l'étude ----------------
  { id: "adisu-puglia", funder: "region", funderName: "ADISU Puglia", entryPoint: "bourse" },
  { id: "ardis-friuli-venezia-giulia", funder: "region", funderName: "ARDiS Friuli-Venezia Giulia", entryPoint: "bourse" },
  { id: "dsu-lombardia-milano-statale", funder: "region", funderName: "Regione Lombardia (DSU)", entryPoint: "bourse" },
  { id: "edisu-pavia", funder: "region", funderName: "EDiSU Pavia", entryPoint: "bourse" },
  { id: "ergo-emilia-romagna", funder: "region", funderName: "ER.GO Emilia-Romagna", entryPoint: "bourse" },
  { id: "aliseo-liguria", funder: "region", funderName: "ALiSEO Liguria", entryPoint: "bourse" },
  { id: "campania-regional-scholarship", funder: "region", funderName: "ADISURC Campania", entryPoint: "bourse" },
  { id: "dsu-toscana-scholarship", funder: "region", funderName: "DSU Toscana", entryPoint: "bourse" },
  { id: "edisu-piemonte-scholarship", funder: "region", funderName: "EDISU Piemonte", entryPoint: "bourse" },
  { id: "laziodisco-scholarship", funder: "region", funderName: "DiSCo Lazio", entryPoint: "bourse" },
  { id: "opera-universitaria-scholarship", funder: "region", funderName: "Opera Universitaria di Trento", entryPoint: "bourse" },
  { id: "veneto-regional-scholarship", funder: "region", funderName: "ESU Veneto", entryPoint: "bourse" },

  // ---------------- Italie — universitaires ----------------
  { id: "bocconi-graduate-merit-award", funder: "universite", funderName: "Università Bocconi", entryPoint: "universite" },
  { id: "bocconi-merit-award", funder: "universite", funderName: "Università Bocconi", entryPoint: "universite" },
  { id: "bocconi-phd-scholarship", funder: "universite", funderName: "Università Bocconi", entryPoint: "universite" },
  { id: "scuola-normale-superiore-phd", funder: "universite", funderName: "Scuola Normale Superiore", entryPoint: "universite" },
  { id: "international-talents-unibo", funder: "universite", funderName: "Università di Bologna", entryPoint: "universite" },
  { id: "politecnico-di-milano-merit-based-scholarship", funder: "universite", funderName: "Politecnico di Milano", entryPoint: "universite" },
  { id: "politecnico-di-milano-phd-scholarship", funder: "universite", funderName: "Politecnico di Milano", entryPoint: "universite" },
  { id: "polito-phd-scholarship", funder: "universite", funderName: "Politecnico di Torino", entryPoint: "universite" },
  { id: "sapienza-phd-scholarship", funder: "universite", funderName: "Sapienza Università di Roma", entryPoint: "universite" },
  { id: "unibo-phd-scholarship", funder: "universite", funderName: "Università di Bologna", entryPoint: "universite" },
  { id: "university-of-florence-phd-scholarship", funder: "universite", funderName: "Università di Firenze", entryPoint: "universite" },
  { id: "university-of-naples-federico-ii-phd-scholarship", funder: "universite", funderName: "Università di Napoli Federico II", entryPoint: "universite" },
  { id: "university-of-padua-phd-scholarship", funder: "universite", funderName: "Università di Padova", entryPoint: "universite" },
  { id: "university-of-pisa-phd-scholarship", funder: "universite", funderName: "Università di Pisa", entryPoint: "universite" },
  { id: "university-of-trento-phd-scholarship", funder: "universite", funderName: "Università di Trento", entryPoint: "universite" },

  // ---------------- Italie — nationales ----------------
  { id: "invest-your-talent-italy", funder: "gouvernement", funderName: "MAECI (Invest Your Talent)", entryPoint: "bourse" },
  { id: "italian-government-scholarship", funder: "gouvernement", funderName: "MAECI (Study in Italy)", entryPoint: "bourse" },

  // ---------------- Japon ----------------
  { id: "abe-initiative-jica", funder: "gouvernement", funderName: "JICA", entryPoint: "bourse" },
  { id: "honjo-international-scholarship", funder: "organisation", funderName: "Honjo International Scholarship Foundation", entryPoint: "bourse" },
  { id: "jads-japan-africa-dream", funder: "organisation", funderName: "Banque africaine de développement", entryPoint: "bourse" },
  { id: "jasso-monbukagakusho-honors", funder: "gouvernement", funderName: "JASSO (MEXT)", entryPoint: "universite" },
  { id: "jica-sdgs-global-leader", funder: "gouvernement", funderName: "JICA", entryPoint: "bourse" },
  { id: "jj-wbgsp", funder: "organisation", funderName: "Banque mondiale (JJ/WBGSP)", entryPoint: "bourse" },
  { id: "mext-scholarship", funder: "gouvernement", funderName: "MEXT", entryPoint: "bourse" },
  { id: "rotary-yoneyama-overseas", funder: "organisation", funderName: "Rotary Yoneyama Memorial Foundation", entryPoint: "bourse" },
  { id: "utokyo-fellowship", funder: "universite", funderName: "University of Tokyo", entryPoint: "universite" },
  { id: "waseda-partial-tuition-waiver", funder: "universite", funderName: "Waseda University", entryPoint: "universite" },

  // ---------------- Malaisie ----------------
  { id: "malaysia-international-scholarship", funder: "gouvernement", funderName: "Ministère malaisien de l'Enseignement supérieur", entryPoint: "bourse" },

  // ---------------- Maroc ----------------
  { id: "bourse-gouvernement-maroc-amci", funder: "gouvernement", funderName: "AMCI", entryPoint: "bourse" },
  { id: "bourses-master-aui", funder: "universite", funderName: "Al Akhawayn University", entryPoint: "universite" },
  { id: "mastercard-foundation-scholars-um6p", funder: "organisation", funderName: "Mastercard Foundation", entryPoint: "universite" },

  // ---------------- Pays-Bas ----------------
  { id: "nl-scholarship", funder: "gouvernement", funderName: "Ministère néerlandais de l'Éducation (OCW)", entryPoint: "universite" },

  // ---------------- Pologne ----------------
  { id: "nawa-banach-scholarship", funder: "gouvernement", funderName: "NAWA", entryPoint: "bourse" },

  // ---------------- Portugal ----------------
  { id: "bolsas-cooperacao-camoes", funder: "gouvernement", funderName: "Camões, I.P.", entryPoint: "bourse" },

  // ---------------- Roumanie ----------------
  { id: "bourse-george-darie", funder: "universite", funderName: "POLITEHNICA Bucarest", entryPoint: "universite" },
  { id: "auf-petrache-poenaru", funder: "organisation", funderName: "Agence universitaire de la Francophonie", entryPoint: "bourse" },
  { id: "auf-eugen-ionescu", funder: "organisation", funderName: "Agence universitaire de la Francophonie", entryPoint: "bourse" },
  { id: "unibuc-international-scholarships", funder: "universite", funderName: "Université de Bucarest", entryPoint: "universite" },
  { id: "politehnica-excellence-scholarship", funder: "universite", funderName: "POLITEHNICA Bucarest", entryPoint: "universite" },
  { id: "romanian-government-scholarship", funder: "gouvernement", funderName: "Ministère roumain des Affaires étrangères", entryPoint: "bourse" },

  // ---------------- Royaume-Uni ----------------
  { id: "chevening-scholarships", funder: "gouvernement", funderName: "FCDO (Chevening)", entryPoint: "bourse" },
  { id: "clarendon-fund-scholarships", funder: "universite", funderName: "University of Oxford", entryPoint: "universite" },
  { id: "commonwealth-masters-scholarships", funder: "gouvernement", funderName: "Commonwealth Scholarship Commission (FCDO)", entryPoint: "bourse" },
  { id: "commonwealth-phd-scholarships", funder: "gouvernement", funderName: "Commonwealth Scholarship Commission (FCDO)", entryPoint: "bourse" },
  { id: "commonwealth-shared-scholarships", funder: "gouvernement", funderName: "Commonwealth Scholarship Commission (FCDO)", entryPoint: "bourse" },
  { id: "great-scholarships", funder: "gouvernement", funderName: "British Council (GREAT)", entryPoint: "universite" },
  { id: "imperial-presidents-phd-scholarships", funder: "universite", funderName: "Imperial College London", entryPoint: "universite" },
  { id: "mastercard-foundation-edinburgh", funder: "organisation", funderName: "Mastercard Foundation", entryPoint: "universite" },
  { id: "mastercard-foundation-afox-oxford", funder: "organisation", funderName: "Mastercard Foundation", entryPoint: "universite" },
  { id: "reach-oxford-scholarship", funder: "universite", funderName: "University of Oxford", entryPoint: "universite" },
  { id: "rhodes-scholarships-west-africa", funder: "organisation", funderName: "Rhodes Trust", entryPoint: "bourse" },
  { id: "weidenfeld-hoffmann-scholarships", funder: "organisation", funderName: "Weidenfeld-Hoffmann Trust", entryPoint: "universite" },

  // ---------------- Russie ----------------
  { id: "hse-merit-scholarships", funder: "universite", funderName: "HSE University", entryPoint: "universite" },
  { id: "hse-into-olympiad", funder: "universite", funderName: "HSE University", entryPoint: "universite" },
  { id: "spbu-open-olympiad", funder: "universite", funderName: "Université d'État de Saint-Pétersbourg", entryPoint: "universite" },
  { id: "open-doors-scholarship", funder: "gouvernement", funderName: "Ministère russe de l'Enseignement supérieur", entryPoint: "bourse" },
  { id: "quota-gouvernement-russe", funder: "gouvernement", funderName: "Rossotrudnichestvo", entryPoint: "bourse" },

  // ---------------- Suède ----------------
  { id: "swedish-institute-scholarships-global-professionals", funder: "gouvernement", funderName: "Svenska institutet", entryPoint: "bourse" },

  // ---------------- Suisse ----------------
  { id: "iheid-scholarships", funder: "universite", funderName: "IHEID", entryPoint: "universite" },
  { id: "unifr-research-scholarships", funder: "universite", funderName: "Université de Fribourg", entryPoint: "universite" },
  { id: "epfl-edic-doctoral", funder: "universite", funderName: "EPFL", entryPoint: "universite" },
  { id: "epfl-master-excellence-fellowships", funder: "universite", funderName: "EPFL", entryPoint: "universite" },
  { id: "eth-esop", funder: "universite", funderName: "ETH Zurich", entryPoint: "universite" },
  { id: "unige-excellence-master-fellowships", funder: "universite", funderName: "Université de Genève", entryPoint: "universite" },
  { id: "zeno-karl-schindler-master-thesis", funder: "organisation", funderName: "Fondation Zeno Karl Schindler", entryPoint: "bourse" },
  { id: "swiss-government-excellence-scholarships", funder: "gouvernement", funderName: "SEFRI (Confédération suisse)", entryPoint: "bourse" },
  { id: "unil-master-grants", funder: "universite", funderName: "Université de Lausanne", entryPoint: "universite" },
  { id: "uzh-candoc-grant", funder: "universite", funderName: "University of Zurich", entryPoint: "universite" },

  // ---------------- Turquie ----------------
  { id: "bilkent-international-scholarships", funder: "universite", funderName: "Bilkent University", entryPoint: "universite" },
  { id: "diyanet-tdv-international", funder: "organisation", funderName: "Fondation Diyanet de Turquie (TDV)", entryPoint: "bourse" },
  { id: "koc-university-merit-scholarships", funder: "universite", funderName: "Koç University", entryPoint: "universite" },
  { id: "ytb-isdb-joint-scholarship", funder: "organisation", funderName: "Banque islamique de développement (avec YTB)", entryPoint: "bourse" },
  { id: "sabanci-graduate-scholarships", funder: "universite", funderName: "Sabancı University", entryPoint: "universite" },
  { id: "tubitak-2216-research-fellowship", funder: "gouvernement", funderName: "TÜBİTAK", entryPoint: "bourse" },
  { id: "turkiye-burslari", funder: "gouvernement", funderName: "YTB (Türkiye Bursları)", entryPoint: "bourse" },
  { id: "turkiye-burslari-research", funder: "gouvernement", funderName: "YTB (Türkiye Bursları)", entryPoint: "bourse" },
  { id: "turkiye-burslari-success", funder: "gouvernement", funderName: "YTB (Türkiye Bursları)", entryPoint: "bourse" },
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
// Étape 1 — analyse (lecture seule, aucune écriture)
// ==========================================================

analyzeBtn.addEventListener("click", async () => {

  analyzeBtn.disabled = true;
  analyzeLog.innerHTML = "";
  lastPlan = null;

  try {

    let blocking = false;

    // --- Garde de vocabulaire : le plan lui-même, avant toute lecture.
    const idsPlan = PLAN.map((p) => p.id);
    const doublons = idsPlan.filter((id, i) => idsPlan.indexOf(id) !== i);
    if (doublons.length) {
      log(analyzeLog, `Le plan contient des identifiants en double : ${[...new Set(doublons)].join(", ")}`, "err");
      blocking = true;
    }
    for (const p of PLAN) {
      if (!FUNDERS.includes(p.funder)) {
        log(analyzeLog, `${p.id} : funder « ${p.funder} » hors énuméré`, "err"); blocking = true;
      }
      if (p.entryPoint && !ENTRY_POINTS.includes(p.entryPoint)) {
        log(analyzeLog, `${p.id} : entryPoint « ${p.entryPoint} » hors énuméré`, "err"); blocking = true;
      }
      if (!p.funderName) {
        log(analyzeLog, `${p.id} : funderName vide`, "err"); blocking = true;
      }
    }

    // --- Lecture du catalogue réel.
    const snap = await getDocs(collection(db, "scholarships"));
    const enBase = new Map();
    snap.docs.forEach((d) => enBase.set(d.id, d.data()));

    log(analyzeLog, `Catalogue lu : ${enBase.size} bourses en base, ${PLAN.length} dans le plan.`);
    log(analyzeLog, "");

    // --- Toute bourse du plan doit exister.
    for (const p of PLAN) {
      if (!enBase.has(p.id)) {
        log(analyzeLog, `INTROUVABLE en base : ${p.id}`, "err"); blocking = true;
      }
    }

    // --- Toute bourse en base doit être au plan. BLOQUANT et non
    // « avertissement » : une bourse oubliée resterait sans bailleur
    // sans que rien ne le signale — exactement le défaut silencieux
    // que ce chantier corrige.
    for (const [id, d] of enBase) {
      if (!idsPlan.includes(id)) {
        log(analyzeLog, `ABSENTE DU PLAN : ${id} — « ${d.title || "(sans titre)"} » (${d.country || "?"})`, "err");
        blocking = true;
      }
    }

    log(analyzeLog, "");

    // --- Conflits avec une valeur déjà posée à la main.
    const plan = [];
    let conflits = 0;
    let inchangees = 0;

    for (const p of PLAN) {
      const d = enBase.get(p.id);
      if (!d) continue;

      const actuel = {
        funder: d.funder || "",
        funderName: d.funderName || "",
        entryPoint: d.entryPoint || ""
      };

      const identique = actuel.funder === p.funder
        && actuel.funderName === p.funderName
        && actuel.entryPoint === p.entryPoint;

      if (identique) { inchangees++; continue; }

      if (actuel.funder && actuel.funder !== p.funder) {
        log(analyzeLog, `CONFLIT ${p.id} : la base dit « ${actuel.funder} », le plan dit « ${p.funder} » — trancher avant d'écrire.`, "warn");
        conflits++;
      }

      plan.push({ ...p, titre: d.title || "", pays: d.country || "" });
    }

    log(analyzeLog, `${inchangees} bourse(s) déjà conformes, ${plan.length} à écrire, ${conflits} conflit(s) signalé(s).`, conflits ? "warn" : "ok");
    log(analyzeLog, "");

    // --- Récapitulatif lisible, groupé par type.
    for (const f of FUNDERS) {
      const lot = plan.filter((p) => p.funder === f);
      if (!lot.length) continue;
      log(analyzeLog, `— ${f} (${lot.length})`);
      lot.forEach((p) => {
        log(analyzeLog, `    ${p.id} · ${p.funderName} · dossier ${p.entryPoint ? "chez « " + p.entryPoint + " »" : "NON RENSEIGNÉ (volontaire)"}`);
      });
      log(analyzeLog, "");
    }

    if (blocking) {
      log(analyzeLog, "BLOQUÉ : corriger les erreurs ci-dessus avant d'écrire.", "err");
      return;
    }

    lastPlan = plan;
    writeBtn.disabled = false;
    writeBtn.textContent = `Écrire (${plan.length} bourses)`;
    log(analyzeLog, "Analyse terminée, sans erreur bloquante. Étape 2 débloquée.", "ok");

  } catch (err) {
    log(analyzeLog, `ERREUR : ${err.message}`, "err");
  } finally {
    analyzeBtn.disabled = false;
  }

});

// ==========================================================
// Étape 2 — écriture (3 champs, rien d'autre)
// ==========================================================

writeBtn.addEventListener("click", async () => {

  if (!lastPlan) { log(writeLog, "Lancer l'étape 1 d'abord.", "err"); return; }

  writeBtn.disabled = true;
  writeLog.innerHTML = "";

  try {
    for (const p of lastPlan) {
      // entryPoint vide -> champ NON ÉCRIT (il reste absent en base),
      // jamais "" : un inconnu ne doit pas devenir une fausse valeur.
      const patch = { funder: p.funder, funderName: p.funderName };
      if (p.entryPoint) patch.entryPoint = p.entryPoint;
      await updateDoc(doc(db, "scholarships", p.id), patch);
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
// Étape 3 — vérification champ par champ
// ==========================================================

verifyBtn.addEventListener("click", async () => {

  if (!lastPlan) { log(verifyLog, "Lancer les étapes 1 et 2 d'abord.", "err"); return; }

  verifyBtn.disabled = true;
  verifyLog.innerHTML = "";

  try {
    let ecarts = 0;

    for (const p of lastPlan) {
      const snap = await getDoc(doc(db, "scholarships", p.id));
      if (!snap.exists()) {
        log(verifyLog, `MANQUANTE : ${p.id}`, "err"); ecarts++; continue;
      }
      const d = snap.data();
      const attenduEntry = p.entryPoint || undefined;
      if (d.funder !== p.funder || d.funderName !== p.funderName || d.entryPoint !== attenduEntry) {
        log(verifyLog, `ÉCART : ${p.id}`, "err");
        log(verifyLog, `    attendu : ${p.funder} / ${p.funderName} / ${p.entryPoint || "(absent)"}`, "err");
        log(verifyLog, `    en base : ${d.funder} / ${d.funderName} / ${d.entryPoint === undefined ? "(absent)" : d.entryPoint}`, "err");
        ecarts++;
      } else {
        log(verifyLog, `OK ${p.id}`, "ok");
      }
    }

    log(verifyLog, "");
    if (ecarts === 0) {
      log(verifyLog, `${lastPlan.length}/${lastPlan.length} conformes, 0 écart. Lot 30 terminé.`, "ok");
      log(verifyLog, "Contrôles à faire ensuite sur le site public :", "warn");
      log(verifyLog, "  1. scholarships.html — le filtre « Type de bourse » doit renvoyer des résultats sur les 4 valeurs utilisées (gouvernement, université, région, organisation) et 0 sur « Entreprise », qu'aucune bourse ne porte aujourd'hui.", "warn");
      log(verifyLog, "  2. Une fiche de bourse d'État (Italian Government Scholarship via Sapienza, ou CGS via Beihang) — le bouton « portail officiel de la bourse » doit être EN PREMIER, et la phrase doit dire que le dossier se dépose auprès du bailleur.", "warn");
      log(verifyLog, "  3. Une fiche universitaire (Bocconi, EPFL) — ordre inchangé, portail bailleur en dernier.", "warn");
    } else {
      log(verifyLog, `${ecarts} écart(s) — NE PAS considérer le lot comme terminé.`, "err");
    }
  } catch (err) {
    log(verifyLog, `ERREUR : ${err.message}`, "err");
  } finally {
    verifyBtn.disabled = false;
  }

});
