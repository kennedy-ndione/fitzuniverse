// ============================================================
// ScholarBridge — Élargissement du catalogue, Lot 9 (2026-08-28)
// Débloque les deux candidats explicitement écartés du lot 7 faute de
// photo de ville en stock (voir "CANDIDATS ÉCARTÉS FAUTE DE PHOTO EN
// STOCK" dans expand-catalog-batch7.js) — même logique que UM6P/
// UCLouvain, écartées au lot 4 puis débloquées au lot 6.
//
// - EPFL (Lausanne, Suisse) -> Swiss Government Excellence Scholarships
// - King Abdulaziz University (Jeddah, Arabie Saoudite) -> Bourses du
//   gouvernement saoudien pour étudiants internationaux
//
// PRÉALABLE — NE PAS LANCER CE LOT AVANT
// -----------------------------------------
// scripts/add-lot9-city-photos.sh doit avoir été exécuté (une seule
// fois, depuis la racine du dépôt) : il télécharge lausanne.jpg et
// jeddah.jpg (+ déclinaisons -400w/-800w/-1200w/-1600w) depuis Unsplash
// (licence libre, aucune attribution obligatoire, créditées dans
// CREDITS.md par choix). Ce script Firestore ne vérifie PAS que ces
// fichiers existent sur le disque — rien dans le SDK Firestore ne le
// permet — donc l'écrire sans avoir lancé le script shell produirait
// des universités avec une image cassée, silencieusement.
//
// KING ABDULAZIZ : UNIVERSITÉ RÉELLE, À NE PAS CONFONDRE AVEC L'ANCIEN
// NOM DE BOURSE
// ------------------------------------------------------------------------
// Le lot 5 a renommé la bourse "King Abdulaziz Scholarship" en
// "Bourses du gouvernement saoudien pour étudiants internationaux",
// car ce nom ne correspondait à aucun programme officiel réel
// identifiable et son ancien portail était mort. King Abdulaziz
// UNIVERSITY (Jeddah) est un établissement bien réel et distinct —
// une des plus grandes universités publiques saoudiennes, confirmée
// dans la liste des 27 universités du portail national
// studyinsaudi.moe.gov.sa (source croisée au lot 7 via truescho.com).
// Aucun rapport entre les deux hormis le nom du souverain fondateur.
//
// COUVERTURE DES SOURCES
// ------------------------
// EPFL : sbfi.admin.ch, page officielle des Swiss Government Excellence
// Scholarships, confirme explicitement l'éligibilité d'"ETHZ or EPFL"
// au même titre que toute université cantonale (déjà cité au lot 7
// pour University of Zurich).
// King Abdulaziz University : confirmée éligible au lot 7 (recherche
// truescho.com croisant le portail studyinsaudi.moe.gov.sa, 27
// universités participantes) mais écartée à l'époque faute de photo de
// Jeddah — débloquée ici.
//
// RÉSOLUTION PAR RECHERCHE, JAMAIS PAR ID EN DUR
// ------------------------------------------------
// Les deux bourses ciblées ont déjà été touchées aux lots 5-7 mais
// leurs ids résolus n'ont jamais été journalisés en dur dans le code
// (recherche à chaque fois) — même patron ici : retrouvées par titre,
// avec blocage propre en cas de 0 ou plusieurs correspondances.
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

// -------- Bourses à retrouver par titre (2) --------
const EXPECTED_SCHOLARSHIPS = [
{
key: "swiss",
label: "Swiss Government Excellence Scholarships",
match: (title) => normalize(title).includes("swiss government")
},
{
key: "saudi",
label: "Bourses du gouvernement saoudien pour étudiants internationaux",
match: (title) => normalize(title).includes("gouvernement saoudien")
}
];

// -------- Universités créées (2) --------
const UNIVERSITIES = [
{
id: "epfl-lausanne",
data: {
name: "École Polytechnique Fédérale de Lausanne (EPFL)",
city: "Lausanne",
country: "Suisse",
image: "lausanne.jpg",
flag: "ch.svg",
ranking: "École polytechnique fédérale, l'une des deux grandes écoles fédérales suisses (avec ETH Zurich, déjà partenaire du catalogue)",
description: "Explicitement éligible aux Swiss Government Excellence Scholarships, au même titre qu'ETH Zurich et toute université cantonale suisse (sbfi.admin.ch).",
officialWebsite: "https://www.epfl.ch",
applicationPortalUrl: "https://www.sbfi.admin.ch/en/swiss-government-excellence-scholarships",
fields: []
}
},
{
id: "king-abdulaziz-university-jeddah",
data: {
name: "King Abdulaziz University",
city: "Jeddah",
country: "Arabie Saoudite",
image: "jeddah.jpg",
flag: "sa.svg",
ranking: "Une des plus grandes universités publiques saoudiennes",
description: "Confirmée parmi les 27 universités du portail national studyinsaudi.moe.gov.sa. Établissement réel et distinct de l'ancien nom de bourse \"King Abdulaziz Scholarship\", corrigé au lot 5 en \"Bourses du gouvernement saoudien\" — aucun rapport hormis le nom du souverain fondateur.",
officialWebsite: "https://www.kau.edu.sa",
applicationPortalUrl: "https://studyinsaudi.sa/en",
fields: []
}
}
];

// -------- Programmes (2) — dépendent des ids de bourse résolus,
// construits dynamiquement à l'étape 1. --------
function buildPrograms(scholarshipIds) {
return [
{
id: `epfl-lausanne__${scholarshipIds.swiss}`,
data: {
universityId: "epfl-lausanne",
scholarshipId: scholarshipIds.swiss,
level: "Doctorat / post-doctorat (recherche) — Master en Arts (pays limités)",
deadline: "Candidatures ouvertes à partir du 20 août 2026 — dates précises par pays d'origine publiées à cette date sur sbfi.admin.ch (à vérifier)",
applicationUrl: "https://www.sbfi.admin.ch/en/swiss-government-excellence-scholarships",
language: "Anglais / Français selon le programme",
duration: "Généralement 1 an, renouvelable une fois",
coverage: "2 450 CHF/mois (tarif 2027-2028) + frais annexes selon profil",
description: "Éligible au même titre qu'ETH Zurich et toute université cantonale suisse — EPFL est l'une des deux grandes écoles polytechniques fédérales du pays. Limite d'âge 35 ans ; résultats annoncés fin mai.",
status: "Ouverte",
isActive: true
}
},
{
id: `king-abdulaziz-university-jeddah__${scholarshipIds.saudi}`,
data: {
universityId: "king-abdulaziz-university-jeddah",
scholarshipId: scholarshipIds.saudi,
level: "Licence / Master / Doctorat",
deadline: "Fermée, réouverture annuelle non datée",
applicationUrl: "https://studyinsaudi.sa/en",
language: "Arabe (année préparatoire obligatoire pour non-arabophones)",
duration: "Variable selon le niveau et la filière",
coverage: "Scolarité gratuite + logement + allocation mensuelle + billet d'avion annuel + couverture santé",
description: "Une des plus grandes universités publiques saoudiennes, confirmée parmi les 27 établissements du portail national studyinsaudi.sa.",
status: "Fermée",
isActive: false
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

log(analyzeLog, "Rappel : scripts/add-lot9-city-photos.sh doit avoir été exécuté avant l'étape 2 (ce script Firestore ne peut pas vérifier les fichiers sur disque).", "warn");

log(analyzeLog, "Recherche des 2 bourses cibles par titre...");

const scholarshipsSnap = await getDocs(collection(db, "scholarships"));
const scholarships = scholarshipsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

const scholarshipIds = {};
let lookupFailed = false;

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
scholarshipIds[expected.key] = matches[0].id;
log(analyzeLog, `"${expected.label}" trouvée : id "${matches[0].id}", titre en base "${matches[0].title}".`, "ok");
}

}

if (lookupFailed) {
log(analyzeLog, "Anomalie(s) détectée(s) lors de la recherche — corriger avant de passer à l'étape 2.", "err");
return;
}

const universitiesSnap = await getDocs(collection(db, "universities"));
const existingUniversityIds = new Set(universitiesSnap.docs.map((d) => d.id));

const universityCollisions = UNIVERSITIES.filter((u) => existingUniversityIds.has(u.id));

if (universityCollisions.length) {
log(analyzeLog, `${universityCollisions.length} id(s) de nouvelle université collisionnent déjà avec un document existant :`, "err");
universityCollisions.forEach((u) => log(analyzeLog, `  - ${u.id}`, "err"));
} else {
log(analyzeLog, `${UNIVERSITIES.length}/2 identifiants de nouvelle université libres.`, "ok");
}

const programs = buildPrograms(scholarshipIds);

const programsSnap = await getDocs(collection(db, "programs"));
const existingProgramIds = new Set(programsSnap.docs.map((d) => d.id));

const programCollisions = programs.filter((p) => existingProgramIds.has(p.id));

if (programCollisions.length) {
log(analyzeLog, `${programCollisions.length} id(s) de programme collisionnent déjà avec un document existant :`, "err");
programCollisions.forEach((p) => log(analyzeLog, `  - ${p.id}`, "err"));
} else {
log(analyzeLog, `${programs.length}/2 identifiants de programme libres.`, "ok");
}

const hasBlockingIssue = universityCollisions.length || programCollisions.length;

if (hasBlockingIssue) {
log(analyzeLog, "Anomalie(s) détectée(s) — corriger avant de passer à l'étape 2.", "err");
return;
}

lastPlan = { scholarshipIds, programs };

log(analyzeLog, "Analyse terminée, aucune anomalie. Vérifiez le détail ci-dessus — et que les photos existent bien sur disque — avant de passer à l'étape 2.", "ok");

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
`Créer ${UNIVERSITIES.length} université(s) (EPFL, King Abdulaziz University) et ${lastPlan.programs.length} programme(s) ? Vérifiez d'abord que lausanne.jpg et jeddah.jpg existent bien dans assets/images/cities/ — cette action écrit en base de production.`
);

if (!confirmed) return;

writeBtn.disabled = true;
writeLog.innerHTML = "";

try {

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

const total = UNIVERSITIES.length + lastPlan.programs.length;

log(verifyLog, `${ok}/${total} document(s) confirmé(s) en base, champ par champ.`, mismatch === 0 ? "ok" : "err");

if (mismatch === 0) {
log(verifyLog, "ÉCRITURE EN BASE CONFIRMÉE — lot 9 terminé, 0 écart. EPFL et King Abdulaziz University sont débloquées.", "ok");
log(verifyLog, "Pensez à vérifier visuellement les deux nouvelles pages université (photo bien affichée, pas de lien cassé).", "warn");
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
