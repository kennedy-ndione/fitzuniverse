// ============================================================
// FitzUniverse — Rattachement des bourses orphelines, Lot 29 (2026-08-30)
//
// Crée les documents `programs` manquants pour les 23 bourses qui
// n'avaient AUCUNE université rattachée et pouvaient être reliées à une
// université déjà présente en base. Ne modifie aucune bourse, aucune
// université : ce lot n'écrit que dans la collection `programs`.
//
// POURQUOI C'EST LE DÉFAUT LE PLUS COÛTEUX DU CATALOGUE
// `recommendPrograms()` (js/recommend-programs.js) itère sur la
// collection `programs`, jamais sur `scholarships` :
//     programs.filter((p) => p.universityId && universitiesById.has(...))
// Une bourse sans programme lié ne peut donc JAMAIS être recommandée
// par le moteur payant. L'export du 30/08/2026 en comptait 35 dans ce
// cas — 27 % du catalogue invisible pour la fonctionnalité facturée.
// Ce lot en traite 23 ; les 12 autres exigent de créer l'université
// d'abord (Milano Statale, Pavie, Gênes, Bari, Trieste, Scuola Normale,
// IHEID, Fribourg, Genève, UNIL, SPbU) et feront l'objet d'un lot à
// part. `vanier-canada-graduate-scholarship` est volontairement laissée
// sans rattachement : le programme est fermé et remplacé, lui inventer
// une université d'accueil serait faux.
//
// LES NIVEAUX NE SONT PAS ÉCRITS DANS CE FICHIER
// Un programme est créé par couple (université, NIVEAU DE LA BOURSE),
// convention déjà en place dans la base (stipendium-hungaricum : 11
// universités × 3 cycles = 33 programmes). Les niveaux sont LUS sur le
// document de la bourse — champ `levels`, renseigné et vérifié par le
// lot 28 — et jamais recopiés ici. Une bourse dont `levels` serait vide
// bloque le lot au lieu de produire des programmes sans niveau.
//
// CE QUE LES PROGRAMMES PORTENT, ET CE QU'ILS NE PORTENT PAS
// Trois champs seulement : `universityId`, `scholarshipId`, `level`.
// PAS de `deadline`, `coverage`, `language` ni `duration` : ces valeurs
// n'existent pas par couple université/bourse, et les inventer mettrait
// de fausses dates limites devant un étudiant. `details.js` retombe
// proprement sur « — » pour un champ absent, et `applicationUrl` suit
// déjà le modèle « Option B » — vide au niveau programme, hérité de
// `applicationPortalUrl` de l'université.
//
// LES LIBELLÉS DE PAYS SONT CEUX DE LA BASE, ACCENTS COMPRIS
// Le champ `pays` de chaque entrée est comparé tel quel au champ
// `country` de l'université. Un « Coree du Sud » écrit sans accent a
// bloqué le premier lancement de ce lot le 30/08/2026 : la garde a
// correctement refusé les trois universités coréennes. Ne pas
// « normaliser » ces libellés — c'est la comparaison stricte qui fait la
// valeur de la garde.
//
// LES UNIVERSITÉS SONT REPRÉSENTATIVES, PAS EXCLUSIVES
// Même convention que Chevening, rattachée à Oxford, Edinburgh et
// Imperial sans que ce soient les seules universités britanniques
// éligibles. Chaque rattachement porte ci-dessous sa justification en
// une ligne, et l'étape 1 la réaffiche avant écriture.
// ============================================================

import { db } from "../firebase-config.js";

import {
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const SLUG = { "Licence": "licence", "Master": "master", "Doctorat": "doctorat" };

const LIENS = [
  // ---------------- ITALIE (2) ----------------
  {
    scholarshipId: "ergo-emilia-romagna",
    pays: "Italie",
    universityIds: ["universita-di-bologna-bologne"],
    motif: "seule université d'Émilie-Romagne en base — un partenaire réel plutôt que trois inventés"
  },
  {
    scholarshipId: "invest-your-talent-italy",
    pays: "Italie",
    universityIds: ["politecnico-di-milano-milan", "politecnico-di-torino-turin"],
    motif: "écoles d'ingénieurs et de design, cœur historique du réseau IYT"
  },
  // ---------------- ALLEMAGNE (6) — fondations nationales ----------------
  {
    scholarshipId: "daad-epos",
    pays: "Allemagne",
    universityIds: ["humboldt-universitat-zu-berlin-berlin", "leibniz-universitat-hannover-hannover", "universitat-hamburg-hamburg"],
    motif: "programme national du DAAD — universités hôtes représentatives"
  },
  {
    scholarshipId: "daad-helmut-schmidt-programme",
    pays: "Allemagne",
    universityIds: ["humboldt-universitat-zu-berlin-berlin", "universitat-hamburg-hamburg"],
    motif: "programme de politiques publiques : Hannover, école technique, est écartée"
  },
  {
    scholarshipId: "friedrich-ebert-stiftung",
    pays: "Allemagne",
    universityIds: ["humboldt-universitat-zu-berlin-berlin", "leibniz-universitat-hannover-hannover", "universitat-hamburg-hamburg"],
    motif: "fondation politique — finance dans toute université allemande"
  },
  {
    scholarshipId: "heinrich-boell-stiftung",
    pays: "Allemagne",
    universityIds: ["humboldt-universitat-zu-berlin-berlin", "leibniz-universitat-hannover-hannover", "universitat-hamburg-hamburg"],
    motif: "fondation politique — finance dans toute université allemande"
  },
  {
    scholarshipId: "konrad-adenauer-stiftung",
    pays: "Allemagne",
    universityIds: ["humboldt-universitat-zu-berlin-berlin", "leibniz-universitat-hannover-hannover", "universitat-hamburg-hamburg"],
    motif: "fondation politique — finance dans toute université allemande"
  },
  {
    scholarshipId: "rosa-luxemburg-stiftung",
    pays: "Allemagne",
    universityIds: ["humboldt-universitat-zu-berlin-berlin", "leibniz-universitat-hannover-hannover", "universitat-hamburg-hamburg"],
    motif: "fondation politique — finance dans toute université allemande"
  },
  // ---------------- JAPON (5) ----------------
  {
    scholarshipId: "abe-initiative-jica",
    pays: "Japon",
    universityIds: ["university-of-tokyo-tokyo", "waseda-university-tokyo"],
    motif: "programme national de la JICA — universités hôtes représentatives"
  },
  {
    scholarshipId: "honjo-international-scholarship",
    pays: "Japon",
    universityIds: ["university-of-tokyo-tokyo", "waseda-university-tokyo"],
    motif: "fondation privée, ouverte à toute université japonaise"
  },
  {
    scholarshipId: "jasso-monbukagakusho-honors",
    pays: "Japon",
    universityIds: ["university-of-tokyo-tokyo", "waseda-university-tokyo"],
    motif: "aide nationale JASSO, ouverte à toute université japonaise"
  },
  {
    scholarshipId: "jica-sdgs-global-leader",
    pays: "Japon",
    universityIds: ["university-of-tokyo-tokyo", "waseda-university-tokyo"],
    motif: "programme national de la JICA — universités hôtes représentatives"
  },
  {
    scholarshipId: "rotary-yoneyama-overseas",
    pays: "Japon",
    universityIds: ["university-of-tokyo-tokyo", "waseda-university-tokyo"],
    motif: "fondation Rotary, ouverte à toute université japonaise"
  },
  // ---------------- SUISSE (1) ----------------
  {
    scholarshipId: "zeno-karl-schindler-master-thesis",
    pays: "Suisse",
    universityIds: ["epfl-lausanne", "eth-zurich-zurich"],
    motif: "la fondation finance un travail de master mené dans l'un de ses établissements partenaires"
  },
  // ---------------- TURQUIE (5) ----------------
  {
    scholarshipId: "diyanet-tdv-international",
    pays: "Turquie",
    universityIds: ["istanbul-university-istanbul"],
    motif: "bourse de théologie : seule Istanbul University porte une faculté d'ilahiyat en base"
  },
  {
    scholarshipId: "ytb-isdb-joint-scholarship",
    pays: "Turquie",
    universityIds: ["bogazici-university-istanbul", "istanbul-technical-university-istanbul", "istanbul-university-istanbul"],
    motif: "programme national YTB — universités hôtes représentatives"
  },
  {
    scholarshipId: "tubitak-2216-research-fellowship",
    pays: "Turquie",
    universityIds: ["bogazici-university-istanbul", "istanbul-technical-university-istanbul", "istanbul-university-istanbul"],
    motif: "programme national TÜBİTAK, toutes disciplines"
  },
  {
    scholarshipId: "turkiye-burslari-research",
    pays: "Turquie",
    universityIds: ["bogazici-university-istanbul", "istanbul-technical-university-istanbul", "istanbul-university-istanbul"],
    motif: "programme national YTB — universités hôtes représentatives"
  },
  {
    scholarshipId: "turkiye-burslari-success",
    pays: "Turquie",
    universityIds: ["bogazici-university-istanbul", "istanbul-technical-university-istanbul", "istanbul-university-istanbul"],
    motif: "programme national YTB — universités hôtes représentatives"
  },
  // ---------------- ROYAUME-UNI (3) ----------------
  {
    scholarshipId: "commonwealth-masters-scholarships",
    pays: "Royaume-Uni",
    universityIds: ["university-of-oxford-oxford", "university-of-edinburgh-edinburgh", "imperial-college-london-london"],
    motif: "universités britanniques hôtes de boursiers Commonwealth"
  },
  {
    scholarshipId: "commonwealth-phd-scholarships",
    pays: "Royaume-Uni",
    universityIds: ["university-of-oxford-oxford", "university-of-edinburgh-edinburgh", "imperial-college-london-london"],
    motif: "universités britanniques hôtes de boursiers Commonwealth"
  },
  {
    scholarshipId: "commonwealth-shared-scholarships",
    pays: "Royaume-Uni",
    universityIds: ["university-of-oxford-oxford", "university-of-edinburgh-edinburgh", "imperial-college-london-london"],
    motif: "universités britanniques hôtes de boursiers Commonwealth"
  },
  // ---------------- CORÉE DU SUD (1) ----------------
  {
    scholarshipId: "koica-ciat-scholarship",
    pays: "Corée du Sud",
    universityIds: ["korea-university-seoul", "seoul-national-university-seoul", "yonsei-university-seoul"],
    motif: "programme KOICA hébergé par des universités coréennes partenaires"
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

    // Couples (université, bourse) DÉJÀ liés, quel que soit l'identifiant
    // du programme : la base mélange deux conventions d'id (« bme-master »
    // et « uni__bourse »), donc tester l'id ne suffirait pas à éviter un
    // doublon de liaison.
    const snapProgs = await getDocs(collection(db, "programs"));
    const couples = new Set();
    for (const p of snapProgs.docs) {
      const d = p.data();
      if (d.universityId && d.scholarshipId) couples.add(d.universityId + "||" + d.scholarshipId);
    }
    log(analyzeLog, `${snapProgs.size} programmes déjà en base, ${couples.size} couples (université, bourse) distincts.`);
    log(analyzeLog, "");

    for (const lien of LIENS) {

      const snapB = await getDoc(doc(db, "scholarships", lien.scholarshipId));

      if (!snapB.exists()) {
        log(analyzeLog, `ERREUR : bourse "${lien.scholarshipId}" absente de la base.`, "err");
        blocking = true;
        continue;
      }

      const bourse = snapB.data();
      const niveaux = Array.isArray(bourse.levels) ? bourse.levels : [];

      if (!niveaux.length) {
        log(analyzeLog, `ERREUR : "${lien.scholarshipId}" n'a pas de champ levels — le lot 28 a-t-il bien été exécuté ? Aucun programme ne sera créé sans niveau.`, "err");
        blocking = true;
        continue;
      }

      for (const niveau of niveaux) {
        if (!SLUG[niveau]) {
          log(analyzeLog, `ERREUR : "${lien.scholarshipId}" porte le niveau inattendu "${niveau}" — vocabulaire attendu : Licence, Master, Doctorat.`, "err");
          blocking = true;
        }
      }
      if (blocking) continue;

      log(analyzeLog, `${lien.scholarshipId}  [${niveaux.join(", ")}]`, "ok");
      log(analyzeLog, `    ${lien.motif}`);

      for (const uid of lien.universityIds) {

        const snapU = await getDoc(doc(db, "universities", uid));

        if (!snapU.exists()) {
          log(analyzeLog, `    ERREUR : université "${uid}" absente de la base.`, "err");
          blocking = true;
          continue;
        }

        // Garde de cohérence : une bourse nationale ne doit pas être
        // rattachée à une université d'un autre pays.
        const paysU = snapU.data().country || "";
        if (paysU !== lien.pays) {
          log(analyzeLog, `    ERREUR : "${uid}" est en ${paysU || "pays inconnu"}, la bourse est en ${lien.pays}.`, "err");
          blocking = true;
          continue;
        }

        if (couples.has(uid + "||" + lien.scholarshipId)) {
          log(analyzeLog, `    IGNORÉE : ${uid} est déjà liée à cette bourse — non touchée.`, "warn");
          continue;
        }

        for (const niveau of niveaux) {
          plan.push({
            id: `${uid}__${lien.scholarshipId}__${SLUG[niveau]}`,
            universityId: uid,
            scholarshipId: lien.scholarshipId,
            level: niveau,
            nomUniversite: snapU.data().name || uid
          });
        }

        log(analyzeLog, `    ${snapU.data().name || uid} → ${niveaux.length} programme(s)`, "ok");
      }

      log(analyzeLog, "");
    }

    // Aucun identifiant de programme ne doit déjà exister.
    const existants = new Set(snapProgs.docs.map((d) => d.id));
    for (const p of plan) {
      if (existants.has(p.id)) {
        log(analyzeLog, `ERREUR : l'identifiant "${p.id}" existe déjà.`, "err");
        blocking = true;
      }
    }

    const universites = new Set(plan.map((p) => p.universityId));
    const bourses = new Set(plan.map((p) => p.scholarshipId));

    log(analyzeLog, `${plan.length} programmes à créer, sur ${bourses.size} bourses et ${universites.size} universités.`,
        plan.length ? "ok" : "warn");
    log(analyzeLog, `Après ce lot, ces ${bourses.size} bourses deviennent visibles pour le moteur de recommandation.`);

    if (blocking) {
      log(analyzeLog, "");
      log(analyzeLog, "Anomalie(s) détectée(s) — corriger avant l'étape 2. Aucune écriture n'a eu lieu.", "err");
      return;
    }

    if (!plan.length) {
      log(analyzeLog, "");
      log(analyzeLog, "Rien à créer : toutes les liaisons existent déjà. Lot déjà passé.", "ok");
      return;
    }

    lastPlan = plan;
    log(analyzeLog, "");
    log(analyzeLog, "Plan prêt. Seuls des documents `programs` seront créés ; aucune bourse ni université n'est modifiée.", "ok");
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
      await setDoc(doc(db, "programs", p.id), {
        universityId: p.universityId,
        scholarshipId: p.scholarshipId,
        level: p.level
      }, { merge: true });
      log(writeLog, `  ${p.id}`, "ok");
    }
    log(writeLog, "");
    log(writeLog, `${lastPlan.length} programmes créés. Lancer l'étape 3.`, "ok");
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
      const snap = await getDoc(doc(db, "programs", p.id));
      if (!snap.exists()) {
        log(verifyLog, `MANQUANT : ${p.id}`, "err"); ecarts++; continue;
      }
      const d = snap.data();
      if (d.universityId !== p.universityId || d.scholarshipId !== p.scholarshipId || d.level !== p.level) {
        log(verifyLog, `ÉCART : ${p.id}`, "err");
        log(verifyLog, `    attendu : ${p.universityId} / ${p.scholarshipId} / ${p.level}`, "err");
        log(verifyLog, `    en base : ${d.universityId} / ${d.scholarshipId} / ${d.level}`, "err");
        ecarts++;
      } else {
        log(verifyLog, `OK ${p.id}`, "ok");
      }
    }

    log(verifyLog, "");
    if (ecarts === 0) {
      log(verifyLog, `${lastPlan.length}/${lastPlan.length} conformes, 0 écart. Lot 29 terminé.`, "ok");
      log(verifyLog, "Contrôle utile ensuite : sur scholarships.html, les cartes de ces bourses doivent afficher le bon nombre d'universités partenaires — 3 pour les fondations allemandes, 2 pour les japonaises, 1 pour ER.GO et Diyanet. Le correctif de dédoublonnage doit être en place, sinon le chiffre sera multiplié par le nombre de niveaux.", "warn");
    } else {
      log(verifyLog, `${ecarts} écart(s) — NE PAS considérer le lot comme terminé.`, "err");
    }
  } catch (err) {
    log(verifyLog, `ERREUR : ${err.message}`, "err");
  } finally {
    verifyBtn.disabled = false;
  }

});
