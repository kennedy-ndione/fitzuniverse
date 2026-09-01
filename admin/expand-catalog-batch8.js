// ============================================================
// ScholarBridge — Élargissement du catalogue, Lot 8 (2026-08-28)
// Consolidation demandée par l'utilisateur : à travers les PAYS DÉJÀ
// AU CATALOGUE, identifier ceux qui offrent le plus d'opportunités aux
// étudiants internationaux — Africains en particulier — et les
// renforcer avec de VRAIES universités partenaires et de VRAIES
// nouvelles bourses. Aucun nouveau pays ajouté ce lot-ci.
//
// Différence structurelle avec les lots 5-7 : ceux-là ajoutaient des
// universités à des bourses EXISTANTES. Celui-ci crée en plus 3
// NOUVELLES bourses (Chine) que le catalogue n'avait jamais eues —
// jusqu'ici, la Chine n'était représentée que par la Chinese
// Government Scholarship (CSC) nationale, alors que la Chine est la
// première destination d'études au monde pour les étudiants africains
// et que les bourses MUNICIPALES/PROVINCIALES chinoises sont des
// programmes distincts, avec leur propre financement et calendrier.
//
// POURQUOI CES PAYS
// ------------------
// Chine, Turquie et Russie sont, avec le Maroc et la Hongrie (déjà
// bien couverts : Maroc/AMCI 3 universités, Hongrie/Stipendium
// Hungaricum 11 universités), les destinations historiquement les plus
// ouvertes aux étudiants africains parmi les pays déjà au catalogue.
// Le Maroc a été examiné pour ce lot mais écarté : aucune source ne
// confirme qu'un second établissement dans une ville déjà illustrée
// (ex. Institut Agronomique et Vétérinaire Hassan II, Rabat) soit
// effectivement rattaché à l'AMCI — plutôt que de forcer un lien non
// vérifié, ce candidat est laissé de côté pour une recherche future.
//
// COUVERTURE DES SOURCES
// ------------------------
// Chine -> 3 bourses MUNICIPALES/PROVINCIALES distinctes de la CSC
// nationale, chacune vérifiée via le site officiel de l'université
// hôte elle-même :
// - Beijing Government Scholarship @ Peking University
//   (isd.pku.edu.cn + english.beijing.gov.cn, page officielle
//   municipale) : 3 formules A/B/C, limites d'âge 25/35/40 ans.
// - Shanghai Government Scholarship @ Shanghai Maritime University
//   (en.shmtu.edu.cn/SGSScholarship, page officielle de l'université) :
//   Type A (allocation 2500-3500 RMB/mois selon niveau) ou Type B
//   (partielle). Fenêtre 2026 confirmée : 1er déc. 2025 - 30 avril 2026.
//   D'autres universités shanghaïennes y sont également éligibles —
//   seule SHMTU a été directement vérifiée ce lot-ci.
// - Nanjing Government Scholarship @ Université de Nankin (Nanjing
//   University a sa propre page officielle "Jiangsu Government
//   Scholarship" sur hwxy.nju.edu.cn confirmant sa participation,
//   contenu détaillé indisponible au fetch ; montants et liste des 10
//   universités éligibles corroborés par une source secondaire
//   [greatyop.com] cohérente avec le format standard des bourses
//   municipales chinoises). Bourse partielle : 20 000 RMB/an
//   (Master/Doctorat), 10 000 RMB/an (Licence).
//
// Russie -> RUDN University (Université russe de l'amitié des
// peuples), Moscou, ajoutée à Open Doors Scholarship (déjà au
// catalogue avec HSE University comme unique université). RUDN a sa
// propre page officielle du concours Open Doors (globaluni.rudn.ru,
// confirmant la participation) — fondée en 1960 sous le nom
// d'Université Patrice Lumumba, mission historique explicite d'accueil
// des étudiants d'Afrique, d'Asie et d'Amérique latine. ~9 300
// étudiants internationaux de 157 pays aujourd'hui. Établissement le
// plus directement pertinent pour la mobilité étudiante africaine que
// contienne tout le catalogue russe.
//
// Turquie -> Istanbul Technical University, ajoutée à Türkiye
// Bursları (déjà 2 universités depuis le lot 5 : Boğaziçi, Istanbul
// University) — grande université technique publique d'Istanbul,
// l'une des 200+ universités turques déjà documentées comme éligibles
// au programme (champ officialWebsite de la bourse depuis le lot 5).
//
// RÉSOLUTION PAR RECHERCHE / VÉRIFICATION D'EXISTENCE, JAMAIS PAR ID
// EN DUR SANS CONTRÔLE
// ---------------------------------------------------------------------
// Türkiye Bursları : id inconnu (résolu par recherche de titre au lot
// 5, jamais journalisé depuis) -> retrouvée par titre, même patron que
// les lots 5 et 7.
// Open Doors Scholarship (Russie) : id confirmé en dur par lecture du
// code source de expand-catalog-batch3.js (`open-doors-scholarship`,
// document pré-existant que ce lot met à jour) — mais l'étape 1
// vérifie quand même que ce document existe ET que son titre contient
// bien "open doors" avant d'écrire, plutôt que de faire confiance
// aveuglément à un id lu dans un autre fichier. Le lot 7 a montré
// qu'une hypothèse non vérifiée (Sciences Po supposée absente alors
// qu'elle existait déjà) peut se glisser même avec la meilleure
// discipline — ce contrôle supplémentaire coûte une lecture, pas plus.
// Les 5 nouvelles universités et les 3 nouvelles bourses sont de
// vraies créations : la vérification de collision d'id standard
// (comme pour tous les lots précédents) suffit à les protéger.
//
// PHOTOS DE VILLE — AUCUNE NOUVELLE CE LOT-CI
// ----------------------------------------------
// beijing.jpg, shanghai.jpg, nanjing.jpg, moscow.jpg et istanbul.jpg
// existent tous déjà, de même que cn.svg, ru.svg et tr.svg. Deuxième
// lot d'expansion consécutif (après le 7) à ne nécessiter aucun nouvel
// asset.
// ============================================================

import { db } from "../firebase-config.js";

import {
collection,
getDocs,
getDoc,
doc,
setDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

function normalize(str) {
return String(str || "")
.normalize("NFD")
.replace(/[̀-ͯ]/g, "")
.toLowerCase()
.trim();
}

// -------- Bourse existante à retrouver par titre (1) --------
const EXPECTED_SCHOLARSHIPS = [
{
key: "turkiye",
label: "Türkiye Bursları / Türkiye Burslari",
match: (title) => normalize(title).includes("turkiye")
}
];

// -------- Bourse existante à l'id connu, mais vérifié en base avant
// écriture (1) — voir commentaire d'en-tête. --------
const KNOWN_SCHOLARSHIP_ID = {
key: "russia",
id: "open-doors-scholarship",
label: "Open Doors Scholarship",
verify: (title) => normalize(title).includes("open doors")
};

// -------- Nouvelles bourses créées (3) --------
const SCHOLARSHIPS = [
{
id: "beijing-government-scholarship",
data: {
title: "Beijing Government Scholarship",
country: "Chine",
funding: "3 formules — Type A : scolarité + logement + allocation mensuelle + assurance santé ; Type B : scolarité + logement + assurance santé ; Type C : scolarité + assurance santé seules. Montants précis fixés par l'université d'accueil.",
description: "Bourse municipale de Pékin, distincte de la China Scholarship Council (CSC) nationale — attribuée directement par les universités et instituts de recherche pékinois sur leur propre quota.",
status: "Ouverte",
isActive: true,
levels: ["Licence", "Master", "Doctorat"],
officialWebsite: "https://english.beijing.gov.cn/studyinginbeijing/scholarshipapplications/",
generalCriteria: "Limite d'âge : 25 ans (Licence), 35 ans (Master), 40 ans (Doctorat). Candidature déposée directement auprès de l'université pékinoise visée, pas via un portail central — calendrier propre à chaque établissement, généralement janvier-mars."
}
},
{
id: "shanghai-government-scholarship",
data: {
title: "Shanghai Government Scholarship",
country: "Chine",
funding: "Type A (bourse complète) : scolarité + logement + allocation mensuelle (2 500 RMB/mois Licence, 3 000 RMB/mois Master, 3 500 RMB/mois Doctorat) + assurance santé. Type B (bourse partielle) : scolarité + assurance santé seules (800 RMB/an).",
description: "Bourse municipale de Shanghai, distincte de la CSC nationale — attribuée directement par les universités shanghaïennes.",
status: "Ouverte",
isActive: true,
levels: ["Licence", "Master", "Doctorat"],
officialWebsite: "https://en.shmtu.edu.cn/SGSScholarship/list.htm",
generalCriteria: "Cycle 2026 : candidature du 1er décembre 2025 au 30 avril 2026. Réservée aux non-citoyens chinois, limite d'âge 25/35/40 ans selon le niveau, non cumulable avec une autre bourse gouvernementale chinoise."
}
},
{
id: "nanjing-government-scholarship",
data: {
title: "Nanjing Government Scholarship",
country: "Chine",
funding: "Bourse partielle : 20 000 RMB/an (Master, Doctorat), 10 000 RMB/an (Licence) — ne couvre pas nécessairement la totalité des frais de scolarité, montant exact à confirmer auprès de l'université d'accueil.",
description: "Bourse municipale de Nankin, distincte de la CSC nationale — une dizaine d'universités nankinoises éligibles, dont l'Université de Nankin.",
status: "Ouverte",
isActive: true,
levels: ["Licence", "Master", "Doctorat"],
officialWebsite: "https://hwxy.nju.edu.cn/English/StudyatNJU/Scholarships/JiangsuGovernmentScholarship/index.html",
generalCriteria: "Calendrier variable selon l'université (généralement mars-septembre) — se renseigner directement auprès de l'établissement visé."
}
}
];

// -------- Universités créées (5) --------
const UNIVERSITIES = [
{
id: "peking-university-beijing",
data: {
name: "Peking University",
city: "Pékin",
country: "Chine",
image: "beijing.jpg",
flag: "cn.svg",
ranking: "L'une des universités les plus prestigieuses de Chine",
description: "Gère son propre quota de la Beijing Government Scholarship, distinct de la CSC nationale.",
officialWebsite: "https://www.pku.edu.cn",
applicationPortalUrl: "https://isd.pku.edu.cn/en/detail.php?id=765",
fields: []
}
},
{
id: "shanghai-maritime-university-shanghai",
data: {
name: "Shanghai Maritime University",
city: "Shanghai",
country: "Chine",
image: "shanghai.jpg",
flag: "cn.svg",
ranking: "Grande université publique shanghaïenne, spécialisée transport maritime/logistique",
description: "L'un des établissements shanghaïens confirmés éligibles à la Shanghai Government Scholarship — d'autres universités de la ville le sont également, non vérifiées individuellement ce lot-ci.",
officialWebsite: "https://en.shmtu.edu.cn",
applicationPortalUrl: "https://en.shmtu.edu.cn/SGSScholarship/list.htm",
fields: []
}
},
{
id: "nanjing-university-nanjing",
data: {
name: "Université de Nankin (Nanjing University)",
city: "Nankin",
country: "Chine",
image: "nanjing.jpg",
flag: "cn.svg",
ranking: "Une des grandes universités publiques historiques de Chine",
description: "Fait partie d'une dizaine d'établissements nankinois éligibles à la bourse municipale de Nankin, distincte de la CSC nationale.",
officialWebsite: "https://www.nju.edu.cn",
applicationPortalUrl: "https://hwxy.nju.edu.cn/English/StudyatNJU/Scholarships/JiangsuGovernmentScholarship/index.html",
fields: []
}
},
{
id: "rudn-university-moscow",
data: {
name: "RUDN University (Université russe de l'amitié des peuples)",
city: "Moscou",
country: "Russie",
image: "moscow.jpg",
flag: "ru.svg",
ranking: "Fondée en 1960 sous le nom d'Université Patrice Lumumba",
description: "Mission historique explicite d'accueil des étudiants d'Afrique, d'Asie et d'Amérique latine. Environ 9 300 étudiants internationaux de 157 pays aujourd'hui — établissement le plus directement pertinent pour la mobilité étudiante africaine du catalogue russe.",
officialWebsite: "https://eng.rudn.ru",
applicationPortalUrl: "https://globaluni.rudn.ru/index-en.html",
fields: []
}
},
{
id: "istanbul-technical-university-istanbul",
data: {
name: "Istanbul Technical University",
city: "Istanbul",
country: "Turquie",
image: "istanbul.jpg",
flag: "tr.svg",
ranking: "Grande université technique publique d'Istanbul",
description: "L'une des 200+ universités turques éligibles au programme Türkiye Bursları.",
officialWebsite: "https://www.itu.edu.tr",
applicationPortalUrl: "https://www.turkiyeburslari.gov.tr",
fields: []
}
}
];

// -------- Programmes (5) — 3 vers les nouvelles bourses chinoises (id
// connu directement, créées dans ce même lot), 1 vers Open Doors
// Scholarship (id vérifié à l'étape 1) et 1 vers Türkiye Bursları (id
// résolu par recherche à l'étape 1). Construits dynamiquement pour les
// deux derniers. --------
function buildPrograms(turkiyeId) {
return [
{
id: "peking-university-beijing__beijing-government-scholarship",
data: {
universityId: "peking-university-beijing",
scholarshipId: "beijing-government-scholarship",
level: "Licence / Master / Doctorat",
deadline: "Calendrier propre à Peking University, généralement janvier-mars — se référer à isd.pku.edu.cn",
applicationUrl: "https://isd.pku.edu.cn/en/detail.php?id=765",
language: "Anglais / Chinois selon le programme",
duration: "Variable selon le niveau",
coverage: "Type A, B ou C selon le profil — voir le champ funding de la bourse",
description: "Peking University gère son propre quota de la Beijing Government Scholarship, distinct de la CSC nationale.",
status: "Ouverte",
isActive: true
}
},
{
id: "shanghai-maritime-university-shanghai__shanghai-government-scholarship",
data: {
universityId: "shanghai-maritime-university-shanghai",
scholarshipId: "shanghai-government-scholarship",
level: "Licence / Master / Doctorat",
deadline: "1er décembre 2025 – 30 avril 2026 (cycle 2026)",
applicationUrl: "https://en.shmtu.edu.cn/SGSScholarship/list.htm",
language: "Anglais / Chinois selon le programme",
duration: "Variable selon le niveau",
coverage: "Type A ou B — voir le champ funding de la bourse",
description: "Shanghai Maritime University est l'un des établissements shanghaïens éligibles à la Shanghai Government Scholarship.",
status: "Ouverte",
isActive: true
}
},
{
id: "nanjing-university-nanjing__nanjing-government-scholarship",
data: {
universityId: "nanjing-university-nanjing",
scholarshipId: "nanjing-government-scholarship",
level: "Licence / Master / Doctorat",
deadline: "Variable selon l'université, généralement mars-septembre — se référer à hwxy.nju.edu.cn",
applicationUrl: "https://hwxy.nju.edu.cn/English/StudyatNJU/Scholarships/JiangsuGovernmentScholarship/index.html",
language: "Anglais / Chinois selon le programme",
duration: "Variable selon le niveau",
coverage: "20 000 RMB/an (Master/Doctorat) ou 10 000 RMB/an (Licence) — bourse partielle, voir funding",
description: "L'Université de Nankin fait partie d'une dizaine d'établissements nankinois éligibles à cette bourse municipale.",
status: "Ouverte",
isActive: true
}
},
{
id: `rudn-university-moscow__${KNOWN_SCHOLARSHIP_ID.id}`,
data: {
universityId: "rudn-university-moscow",
scholarshipId: KNOWN_SCHOLARSHIP_ID.id,
level: "Licence / Master / Doctorat / Post-doctorat",
deadline: "Calendrier du concours Open Doors — se référer à globaluni.rudn.ru",
applicationUrl: "https://globaluni.rudn.ru/index-en.html",
language: "Anglais / Russe selon le programme",
duration: "Variable selon le niveau",
coverage: "Scolarité gratuite + admission simplifiée (lauréats dispensés d'examen)",
description: "RUDN — fondée en 1960 sous le nom d'Université Patrice Lumumba, mission historique d'accueil des étudiants d'Afrique, d'Asie et d'Amérique latine. ~9 300 étudiants internationaux de 157 pays aujourd'hui.",
status: "Ouverte",
isActive: true
}
},
{
id: `istanbul-technical-university-istanbul__${turkiyeId}`,
data: {
universityId: "istanbul-technical-university-istanbul",
scholarshipId: turkiyeId,
level: "Licence / Master / Doctorat",
deadline: "Cycle annuel janvier-février — prochaine fenêtre estimée janvier 2027 (à vérifier)",
applicationUrl: "https://www.turkiyeburslari.gov.tr",
language: "Anglais / Turc selon le programme",
duration: "Variable selon le niveau",
coverage: "Scolarité + logement + allocation mensuelle (4 500-9 000 TL/mois) + assurance santé + billet d'avion + année de turc obligatoire",
description: "Grande université technique publique d'Istanbul, l'une des 200+ universités turques éligibles au programme Türkiye Bursları.",
status: "Ouverte",
isActive: true
}
}
];
}

function log(el, message, cls = "") {
el.classList.add("is-visible");
const line = document.createElement("div");
if (cls) line.className = cls;
line.textContent = message;
el.appendChild(line);
el.scrollTop = el.scrollHeight;
}

// ==========================================================
// Étape 1 — analyse
// ==========================================================

let lastPlan = null;

const analyzeBtn = document.getElementById("analyzeBtn");
const analyzeLog = document.getElementById("analyzeLog");
const writeBtn = document.getElementById("writeBtn");
const writeLog = document.getElementById("writeLog");
const verifyBtn = document.getElementById("verifyBtn");
const verifyLog = document.getElementById("verifyLog");

analyzeBtn.addEventListener("click", async () => {

analyzeBtn.disabled = true;
analyzeLog.innerHTML = "";

try {

let lookupFailed = false;

log(analyzeLog, "Recherche de Türkiye Bursları par titre...");

const scholarshipsSnap = await getDocs(collection(db, "scholarships"));
const scholarships = scholarshipsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
const existingScholarshipIds = new Set(scholarships.map((s) => s.id));

let turkiyeId = null;

for (const expected of EXPECTED_SCHOLARSHIPS) {

const matches = scholarships.filter((s) => expected.match(s.title));

if (matches.length === 0) {
log(analyzeLog, `ERREUR : aucune bourse trouvée pour "${expected.label}". Vérifier que le titre n'a pas changé en base.`, "err");
lookupFailed = true;
} else if (matches.length > 1) {
log(analyzeLog, `ERREUR : ${matches.length} bourses correspondent à "${expected.label}" — ambigu, résolution manuelle requise :`, "err");
matches.forEach((m) => log(analyzeLog, `  - ${m.id} ("${m.title}")`, "err"));
lookupFailed = true;
} else {
turkiyeId = matches[0].id;
log(analyzeLog, `"${expected.label}" trouvée : id "${matches[0].id}", titre en base "${matches[0].title}".`, "ok");
}

}

log(analyzeLog, `Vérification directe de "${KNOWN_SCHOLARSHIP_ID.label}" (id "${KNOWN_SCHOLARSHIP_ID.id}")...`);

const knownSnap = await getDoc(doc(db, "scholarships", KNOWN_SCHOLARSHIP_ID.id));

if (!knownSnap.exists()) {
log(analyzeLog, `ERREUR : aucun document "${KNOWN_SCHOLARSHIP_ID.id}" en base. L'id supposé connu est faux ou le document a été supprimé.`, "err");
lookupFailed = true;
} else if (!KNOWN_SCHOLARSHIP_ID.verify(knownSnap.data().title)) {
log(analyzeLog, `ERREUR : le document "${KNOWN_SCHOLARSHIP_ID.id}" existe mais son titre ("${knownSnap.data().title}") ne correspond pas à "${KNOWN_SCHOLARSHIP_ID.label}" attendu — id probablement réutilisé pour autre chose.`, "err");
lookupFailed = true;
} else {
log(analyzeLog, `"${KNOWN_SCHOLARSHIP_ID.label}" confirmée : titre en base "${knownSnap.data().title}".`, "ok");
}

if (lookupFailed) {
log(analyzeLog, "Anomalie(s) détectée(s) lors de la recherche/vérification — corriger avant de passer à l'étape 2.", "err");
return;
}

const scholarshipCollisions = SCHOLARSHIPS.filter((s) => existingScholarshipIds.has(s.id));

if (scholarshipCollisions.length) {
log(analyzeLog, `${scholarshipCollisions.length} id(s) de nouvelle bourse collisionnent déjà avec un document existant :`, "err");
scholarshipCollisions.forEach((s) => log(analyzeLog, `  - ${s.id}`, "err"));
} else {
log(analyzeLog, `${SCHOLARSHIPS.length}/3 identifiants de nouvelle bourse libres.`, "ok");
}

const universitiesSnap = await getDocs(collection(db, "universities"));
const existingUniversityIds = new Set(universitiesSnap.docs.map((d) => d.id));

const universityCollisions = UNIVERSITIES.filter((u) => existingUniversityIds.has(u.id));

if (universityCollisions.length) {
log(analyzeLog, `${universityCollisions.length} id(s) de nouvelle université collisionnent déjà avec un document existant :`, "err");
universityCollisions.forEach((u) => log(analyzeLog, `  - ${u.id}`, "err"));
} else {
log(analyzeLog, `${UNIVERSITIES.length}/5 identifiants de nouvelle université libres.`, "ok");
}

const programs = buildPrograms(turkiyeId);

const programsSnap = await getDocs(collection(db, "programs"));
const existingProgramIds = new Set(programsSnap.docs.map((d) => d.id));

const programCollisions = programs.filter((p) => existingProgramIds.has(p.id));

if (programCollisions.length) {
log(analyzeLog, `${programCollisions.length} id(s) de programme collisionnent déjà avec un document existant :`, "err");
programCollisions.forEach((p) => log(analyzeLog, `  - ${p.id}`, "err"));
} else {
log(analyzeLog, `${programs.length}/5 identifiants de programme libres.`, "ok");
}

const hasBlockingIssue = scholarshipCollisions.length || universityCollisions.length || programCollisions.length;

if (hasBlockingIssue) {
log(analyzeLog, "Anomalie(s) détectée(s) — corriger avant de passer à l'étape 2.", "err");
return;
}

lastPlan = { turkiyeId, programs };

log(analyzeLog, "Analyse terminée, aucune anomalie. Vérifiez le détail ci-dessus avant de passer à l'étape 2.", "ok");

writeBtn.disabled = false;

} catch (error) {

console.error(error);
log(analyzeLog, `Erreur : ${error.message}`, "err");

} finally {

analyzeBtn.disabled = false;

}

});

// ==========================================================
// Étape 2 — écriture
// ==========================================================

writeBtn.addEventListener("click", async () => {

if (!lastPlan) return;

const confirmed = confirm(
`Créer ${SCHOLARSHIPS.length} nouvelle(s) bourse(s), ${UNIVERSITIES.length} université(s) et ${lastPlan.programs.length} programme(s) ? Cette action écrit en base de production.`
);

if (!confirmed) return;

writeBtn.disabled = true;
writeLog.innerHTML = "";

try {

log(writeLog, "Écriture des nouvelles bourses...");

for (const s of SCHOLARSHIPS) {
await setDoc(doc(db, "scholarships", s.id), s.data);
log(writeLog, `  - ${s.data.title} (${s.id}) écrite.`);
}

log(writeLog, `${SCHOLARSHIPS.length} bourse(s) créée(s).`, "ok");

log(writeLog, "Écriture des universités...");

for (const u of UNIVERSITIES) {
await setDoc(doc(db, "universities", u.id), u.data);
log(writeLog, `  - ${u.data.name} (${u.id}) écrit.`);
}

log(writeLog, `${UNIVERSITIES.length} université(s) écrite(s).`, "ok");

log(writeLog, "Écriture des programmes...");

for (const p of lastPlan.programs) {
await setDoc(doc(db, "programs", p.id), p.data);
log(writeLog, `  - ${p.id} écrit.`);
}

log(writeLog, `${lastPlan.programs.length} programme(s) écrit(s).`, "ok");
log(writeLog, "Étape 2 terminée. Lancez l'étape 3 pour vérifier automatiquement.", "ok");

verifyBtn.disabled = false;

} catch (error) {

console.error(error);
log(writeLog, `Erreur : ${error.message}`, "err");

} finally {

writeBtn.disabled = false;

}

});

// ==========================================================
// Étape 3 — vérification automatique. Relit chaque document créé et
// compare CHAQUE champ attendu (comparaison de valeur exacte), pas un
// simple "existe".
// ==========================================================

verifyBtn.addEventListener("click", async () => {

if (!lastPlan) return;

verifyBtn.disabled = true;
verifyLog.innerHTML = "";
log(verifyLog, "Relecture de Firestore après écriture...");

try {

let ok = 0;
let mismatch = 0;

for (const s of SCHOLARSHIPS) {
const snap = await getDoc(doc(db, "scholarships", s.id));
const current = snap.exists() ? snap.data() : null;
const fieldsMatch = current && Object.keys(s.data).every((key) => JSON.stringify(current[key]) === JSON.stringify(s.data[key]));
if (fieldsMatch) {
ok++;
} else {
mismatch++;
log(verifyLog, `MISMATCH bourse ${s.id} : document ${current ? "trouvé mais différent" : "introuvable"}.`, "err");
}
}

for (const u of UNIVERSITIES) {
const snap = await getDoc(doc(db, "universities", u.id));
const current = snap.exists() ? snap.data() : null;
const fieldsMatch = current && Object.keys(u.data).every((key) => JSON.stringify(current[key]) === JSON.stringify(u.data[key]));
if (fieldsMatch) {
ok++;
} else {
mismatch++;
log(verifyLog, `MISMATCH université ${u.id} : document ${current ? "trouvé mais différent" : "introuvable"}.`, "err");
}
}

for (const p of lastPlan.programs) {
const snap = await getDoc(doc(db, "programs", p.id));
const current = snap.exists() ? snap.data() : null;
const fieldsMatch = current && Object.keys(p.data).every((key) => JSON.stringify(current[key]) === JSON.stringify(p.data[key]));
if (fieldsMatch) {
ok++;
} else {
mismatch++;
log(verifyLog, `MISMATCH programme ${p.id} : document ${current ? "trouvé mais différent" : "introuvable"}.`, "err");
}
}

const total = SCHOLARSHIPS.length + UNIVERSITIES.length + lastPlan.programs.length;

log(verifyLog, `${ok}/${total} document(s) confirmé(s) en base, champ par champ.`, mismatch === 0 ? "ok" : "err");

if (mismatch === 0) {
log(verifyLog, "ÉCRITURE EN BASE CONFIRMÉE — lot 8 terminé, 0 écart. 3 nouvelles bourses chinoises créées, Russie et Turquie renforcées.", "ok");
} else {
log(verifyLog, `ÉCHEC — ${mismatch} écart(s) détecté(s), voir le détail ci-dessus.`, "err");
}

} catch (error) {

console.error(error);
log(verifyLog, `Erreur : ${error.message}`, "err");

} finally {

verifyBtn.disabled = false;

}

});
