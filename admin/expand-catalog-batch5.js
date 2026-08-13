// ============================================================
// ScholarBridge — Élargissement du catalogue, Lot 5 (2026-08-13)
// Donne enfin une université partenaire aux 5 bourses qui n'en avaient
// toujours aucune depuis l'import initial : MEXT (Japon), Global Korea
// Scholarship (Corée du Sud), Türkiye Bursları (Turquie), Romanian
// Government Scholarship (Roumanie), King Abdulaziz Scholarship
// (Arabie Saoudite, renommée dans ce lot).
//
// Même patron que expand-catalog-batch1.js (recherche par titre
// plutôt que id en dur, comme pour Pearson) : ces 5 bourses sont des
// stubs déjà en base depuis l'import initial (aucun champ fiable,
// jamais reliées à une université), donc des MISES À JOUR, pas des
// créations — même principe que "open-doors-scholarship" au lot 3.
//
// Recherche par correspondance normalisée (minuscules, diacritiques
// ignorés) plutôt qu'égalité stricte de titre : le titre exact stocké
// en base pour la bourse turque est incertain ("Türkiye Burslari" vu
// dans import-scholarships.js, sans les diacritiques ı/ş de l'écriture
// correcte "Türkiye Bursları") — l'étape d'analyse affiche le titre
// exact trouvé pour chaque bourse avant toute écriture, et bloque
// proprement si 0 ou plusieurs matchs.
//
// Toutes les 5 bourses passent à isActive: false (deadlines passées ou
// fenêtres non confirmées) — le badge public Ouverte/Fermée ne lit que
// isActive, jamais le texte de status.
//
// Aucune nouvelle photo/drapeau ce lot-ci : tokyo/seoul/istanbul/
// bucharest/riyadh.jpg et jp/kr/tr/ro/sa.svg existent déjà.
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

// -------- Bourses stub à retrouver par titre (5) --------
const EXPECTED_SCHOLARSHIPS = [
{
key: "mext",
label: "MEXT Scholarship",
match: (title) => normalize(title).includes("mext")
},
{
key: "gks",
label: "Global Korea Scholarship",
match: (title) => normalize(title).includes("global korea")
},
{
key: "turkiye",
label: "Türkiye Bursları / Türkiye Burslari",
match: (title) => normalize(title).includes("turkiye")
},
{
key: "romania",
label: "Romanian Government Scholarship",
match: (title) => normalize(title).includes("romanian government")
},
{
key: "saudi",
label: "King Abdulaziz Scholarship",
match: (title) => normalize(title).includes("king abdulaziz")
}
];

// -------- Données de mise à jour des 5 bourses (id résolu à l'étape 1) --------
const SCHOLARSHIP_UPDATE_DATA = {
mext: {
title: "MEXT Scholarship",
country: "Japon",
funding: "Frais de scolarité intégralement pris en charge + allocation mensuelle (117 000-145 000 ¥/mois selon le niveau) + billet d'avion aller-retour — assurance santé NON couverte (à souscrire séparément)",
description: "Bourse du gouvernement japonais (MEXT, Ministry of Education, Culture, Sports, Science and Technology), pour étudiants internationaux dans les universités japonaises publiques et privées.",
status: "Fermée",
isActive: false,
levels: ["Licence", "Master", "Doctorat"],
officialWebsite: "https://www.studyinjapan.go.jp/en/planning/scholarships/mext-scholarships/",
generalCriteria: "Deadline Sénégal 1er juin 2026 déjà passée ; prochaine fenêtre estimée avril 2027 (non confirmée). Deux pistes de candidature : via l'Ambassade du Japon à Dakar (culture-sn@dk.mofa.go.jp, couvre aussi Cap-Vert/Gambie/Guinée-Bissau), ou directement auprès de l'université visée si elle propose la piste \"university recommendation\"."
},
gks: {
title: "Global Korea Scholarship",
country: "Corée du Sud",
funding: "Scolarité + année de coréen + allocation mensuelle (~1 000 000 KRW/mois en master) + indemnité d'installation + billet d'avion + assurance santé",
description: "Bourse du gouvernement sud-coréen (NIIED), avec deux programmes distincts et des calendriers séparés : GKS-U (Licence) et GKS-G (Master/Doctorat).",
status: "Fermée",
isActive: false,
levels: ["Licence", "Master", "Doctorat"],
officialWebsite: "https://www.studyinkorea.go.kr",
generalCriteria: "GKS-U (Licence) : prochaine fenêtre estimée septembre 2026. GKS-G (Master/Doctorat) : prochaine fenêtre estimée février-mars 2027. Aucune date confirmée. Candidature via l'Ambassade de Corée à Dakar (piste ambassade) OU directement auprès de l'université visée (piste université) — un seul des deux canaux, pas les deux."
},
turkiye: {
title: "Türkiye Bursları",
country: "Turquie",
funding: "Scolarité + logement + allocation mensuelle (4 500-9 000 TL/mois selon niveau) + assurance santé + billet d'avion + année de turc obligatoire",
description: "Bourse du gouvernement turc (YTB, Türkiye Bursları), couvrant plus de 200 universités turques publiques et privées.",
status: "Fermée",
isActive: false,
levels: ["Licence", "Master", "Doctorat"],
officialWebsite: "https://www.turkiyeburslari.gov.tr",
generalCriteria: "Cycle annuel janvier-février ; prochaine fenêtre estimée janvier 2027 (à vérifier sur le calendrier officiel). Candidature 100% en ligne via turkiyeburslari.gov.tr. Sénégal éligible dans la catégorie \"pays africains\" pour la Licence ; Master et Doctorat ouverts à tous les pays."
},
romania: {
title: "Romanian Government Scholarship",
country: "Roumanie",
funding: "Scolarité gratuite + année de roumain si besoin + allocation mensuelle (montant à confirmer)",
description: "Bourse du gouvernement roumain, sélection assurée par le Ministère roumain des Affaires étrangères — l'Ambassade de Roumanie à Dakar a publié par le passé des appels réguliers pour les étudiants sénégalais (éligibilité très probable mais non confirmée pour le cycle en cours).",
status: "Fermée",
isActive: false,
levels: ["Licence", "Master", "Doctorat"],
officialWebsite: "https://scholarships.studyinromania.gov.ro",
generalCriteria: "Cycle 2025-2026 clos le 31 mars 2026 ; prochaine fenêtre estimée février-mars 2027. Candidature 100% en ligne via scholarships.studyinromania.gov.ro. Médecine, Dentaire et Pharmacie exclues du programme."
},
saudi: {
title: "Bourses du gouvernement saoudien pour étudiants internationaux",
country: "Arabie Saoudite",
funding: "Scolarité gratuite + logement + allocation mensuelle + billet d'avion annuel + couverture santé",
description: "Renommée depuis \"King Abdulaziz Scholarship\", qui ne correspondait à aucun programme officiel réel identifiable et dont l'ancien portail était mort. Programme national rattaché au Ministère de l'Éducation saoudien, couvrant plus de 50 universités publiques. Enseignement en arabe, année préparatoire d'arabe obligatoire pour les non-arabophones.",
status: "Fermée, réouverture annuelle non datée",
isActive: false,
levels: ["Licence", "Master", "Doctorat"],
officialWebsite: "https://studyinsaudi.sa/en",
generalCriteria: "Candidature via le portail national studyinsaudi.sa/en (Ministère de l'Éducation), qui couvre plus de 50 universités publiques saoudiennes. Année préparatoire d'arabe obligatoire pour les non-arabophones avant le début du cursus."
}
};

// -------- Universités (8) --------
const UNIVERSITIES = [
{
id: "university-of-tokyo-tokyo",
data: {
name: "University of Tokyo",
city: "Tokyo",
country: "Japon",
image: "tokyo.jpg",
flag: "jp.svg",
ranking: "#36 mondial (QS 2026)",
description: "Université la plus prestigieuse du Japon, piste PEAK (Programs in English at Komaba) pour un premier cycle intégralement anglophone ; MEXT également accessible via la piste \"university recommendation\".",
officialWebsite: "https://www.u-tokyo.ac.jp",
applicationPortalUrl: "https://www.u-tokyo.ac.jp/en/prospective-students/mext_scholarship.html",
fields: []
}
},
{
id: "waseda-university-tokyo",
data: {
name: "Waseda University",
city: "Tokyo",
country: "Japon",
image: "tokyo.jpg",
flag: "jp.svg",
ranking: "#196 mondial (QS 2026)",
description: "Grande université privée de Tokyo, plusieurs graduate schools intégralement enseignées en anglais.",
officialWebsite: "https://www.waseda.jp",
applicationPortalUrl: "https://www.waseda.jp/inst/cie/en/to-waseda/mext",
fields: []
}
},
{
id: "yonsei-university-seoul",
data: {
name: "Yonsei University",
city: "Séoul",
country: "Corée du Sud",
image: "seoul.jpg",
flag: "kr.svg",
ranking: "#50 mondial (QS 2026)",
description: "Une des trois grandes universités historiques de Corée du Sud (SKY), piste GKS-G au niveau université.",
officialWebsite: "https://www.yonsei.ac.kr",
applicationPortalUrl: "https://graduate.yonsei.ac.kr/graduate_en/admission/kgsp_schedule.do",
fields: []
}
},
{
id: "korea-university-seoul",
data: {
name: "Korea University",
city: "Séoul",
country: "Corée du Sud",
image: "seoul.jpg",
flag: "kr.svg",
ranking: "#61 mondial (QS 2026)",
description: "Une des trois grandes universités historiques de Corée du Sud (SKY), page GKS la plus détaillée des établissements consultés.",
officialWebsite: "https://www.korea.ac.kr",
applicationPortalUrl: "https://graduate2.korea.ac.kr/scholarship/gkscholarships.html",
fields: []
}
},
{
id: "bogazici-university-istanbul",
data: {
name: "Boğaziçi University",
city: "Istanbul",
country: "Turquie",
image: "istanbul.jpg",
flag: "tr.svg",
ranking: "#345 mondial (QS 2026)",
description: "Enseignement intégralement en anglais, nommée explicitement par YTB comme exemple d'établissement hôte du programme Türkiye Bursları.",
officialWebsite: "https://www.bogazici.edu.tr",
applicationPortalUrl: "https://adaylar.bogazici.edu.tr/en-EN/Home",
fields: []
}
},
{
id: "istanbul-university-istanbul",
data: {
name: "Istanbul University",
city: "Istanbul",
country: "Turquie",
image: "istanbul.jpg",
flag: "tr.svg",
ranking: "#629 mondial (QS 2026)",
description: "Enseignement majoritairement en turc, également nommée par YTB comme établissement hôte du programme Türkiye Bursları.",
officialWebsite: "https://www.istanbul.edu.tr",
applicationPortalUrl: "https://www.istanbul.edu.tr",
fields: []
}
},
{
id: "universite-de-bucarest-bucarest",
data: {
name: "Université de Bucarest",
city: "Bucarest",
country: "Roumanie",
image: "bucharest.jpg",
flag: "ro.svg",
ranking: "Grande université publique roumaine",
description: "Établissement d'accueil du programme public roumain — ne décerne pas elle-même la bourse (sélection assurée par le Ministère roumain des Affaires étrangères, précisé par sa propre FAQ). Quelques filières enseignées en anglais/français au cas par cas ; Médecine, Dentaire et Pharmacie exclues du programme.",
officialWebsite: "https://unibuc.ro/international",
applicationPortalUrl: "https://scholarships.studyinromania.gov.ro",
fields: []
}
},
{
id: "king-saud-university-riyad",
data: {
name: "King Saud University",
city: "Riyad",
country: "Arabie Saoudite",
image: "riyadh.jpg",
flag: "sa.svg",
ranking: "Grande université publique saoudienne",
description: "Une des plus grandes universités publiques d'Arabie Saoudite, rattachée au portail national studyinsaudi.sa qui couvre plus de 50 universités publiques.",
officialWebsite: "https://dar.ksu.edu.sa/en/overseas",
applicationPortalUrl: "https://studyinsaudi.sa/en",
fields: []
}
}
];

// -------- Programmes (8) — dépendent des ids de bourse résolus à
// l'étape 1, donc construits dynamiquement. --------
function buildPrograms(scholarshipIds) {
return [
{
id: `university-of-tokyo-tokyo__${scholarshipIds.mext}`,
data: {
universityId: "university-of-tokyo-tokyo",
scholarshipId: scholarshipIds.mext,
level: "Licence / Master / Doctorat",
deadline: "Fermée pour ce cycle — prochaine fenêtre estimée avril 2027 (non confirmée)",
applicationUrl: "https://www.u-tokyo.ac.jp/en/prospective-students/mext_scholarship.html",
language: "Anglais / Japonais",
duration: "Variable selon le niveau et le programme",
coverage: "Frais de scolarité intégralement pris en charge + allocation mensuelle (117 000-145 000 ¥/mois) + billet d'avion — assurance santé NON couverte",
description: "Piste PEAK (Programs in English at Komaba) pour un premier cycle intégralement anglophone ; MEXT également accessible via la piste \"university recommendation\" de University of Tokyo.",
status: "Fermée",
isActive: false
}
},
{
id: `waseda-university-tokyo__${scholarshipIds.mext}`,
data: {
universityId: "waseda-university-tokyo",
scholarshipId: scholarshipIds.mext,
level: "Licence / Master / Doctorat",
deadline: "Fermée pour ce cycle — prochaine fenêtre estimée avril 2027 (non confirmée)",
applicationUrl: "https://www.waseda.jp/inst/cie/en/to-waseda/mext",
language: "Anglais / Japonais",
duration: "Variable selon le niveau et le programme",
coverage: "Frais de scolarité intégralement pris en charge + allocation mensuelle (117 000-145 000 ¥/mois) + billet d'avion — assurance santé NON couverte",
description: "Plusieurs graduate schools de Waseda University intégralement enseignées en anglais, piste \"university recommendation\" MEXT disponible.",
status: "Fermée",
isActive: false
}
},
{
id: `yonsei-university-seoul__${scholarshipIds.gks}`,
data: {
universityId: "yonsei-university-seoul",
scholarshipId: scholarshipIds.gks,
level: "Licence / Master / Doctorat",
deadline: "GKS-U (Licence) : prochaine fenêtre estimée septembre 2026 — GKS-G (Master/Doctorat) : estimée février-mars 2027, aucune date confirmée",
applicationUrl: "https://graduate.yonsei.ac.kr/graduate_en/admission/kgsp_schedule.do",
language: "Anglais / Coréen",
duration: "Variable selon le niveau",
coverage: "Scolarité + année de coréen + allocation mensuelle (~1 000 000 KRW/mois en master) + indemnité d'installation + billet d'avion + assurance santé",
description: "Piste GKS-G au niveau université (Yonsei) — candidature via l'université, à ne pas cumuler avec la piste ambassade.",
status: "Fermée",
isActive: false
}
},
{
id: `korea-university-seoul__${scholarshipIds.gks}`,
data: {
universityId: "korea-university-seoul",
scholarshipId: scholarshipIds.gks,
level: "Licence / Master / Doctorat",
deadline: "GKS-U (Licence) : prochaine fenêtre estimée septembre 2026 — GKS-G (Master/Doctorat) : estimée février-mars 2027, aucune date confirmée",
applicationUrl: "https://graduate2.korea.ac.kr/scholarship/gkscholarships.html",
language: "Anglais / Coréen",
duration: "Variable selon le niveau",
coverage: "Scolarité + année de coréen + allocation mensuelle (~1 000 000 KRW/mois en master) + indemnité d'installation + billet d'avion + assurance santé",
description: "Page GKS la plus détaillée des établissements consultés — piste université, à ne pas cumuler avec la piste ambassade.",
status: "Fermée",
isActive: false
}
},
{
id: `bogazici-university-istanbul__${scholarshipIds.turkiye}`,
data: {
universityId: "bogazici-university-istanbul",
scholarshipId: scholarshipIds.turkiye,
level: "Licence / Master / Doctorat",
deadline: "Cycle annuel janvier-février — prochaine fenêtre estimée janvier 2027 (à vérifier)",
applicationUrl: "https://www.turkiyeburslari.gov.tr",
language: "Anglais",
duration: "Variable selon le niveau",
coverage: "Scolarité + logement + allocation mensuelle (4 500-9 000 TL/mois) + assurance santé + billet d'avion + année de turc obligatoire",
description: "Enseignement intégralement en anglais à Boğaziçi University, nommée explicitement par YTB comme exemple d'établissement hôte du programme Türkiye Bursları.",
status: "Fermée",
isActive: false
}
},
{
id: `istanbul-university-istanbul__${scholarshipIds.turkiye}`,
data: {
universityId: "istanbul-university-istanbul",
scholarshipId: scholarshipIds.turkiye,
level: "Licence / Master / Doctorat",
deadline: "Cycle annuel janvier-février — prochaine fenêtre estimée janvier 2027 (à vérifier)",
applicationUrl: "https://www.turkiyeburslari.gov.tr",
language: "Turc",
duration: "Variable selon le niveau",
coverage: "Scolarité + logement + allocation mensuelle (4 500-9 000 TL/mois) + assurance santé + billet d'avion + année de turc obligatoire",
description: "Enseignement majoritairement en turc à Istanbul University, également nommée par YTB comme établissement hôte du programme Türkiye Bursları.",
status: "Fermée",
isActive: false
}
},
{
id: `universite-de-bucarest-bucarest__${scholarshipIds.romania}`,
data: {
universityId: "universite-de-bucarest-bucarest",
scholarshipId: scholarshipIds.romania,
level: "Licence / Master / Doctorat",
deadline: "Cycle 2025-2026 clos le 31 mars 2026 — prochaine fenêtre estimée février-mars 2027",
applicationUrl: "https://scholarships.studyinromania.gov.ro",
language: "Roumain / Anglais / Français (selon filière)",
duration: "Variable selon le niveau",
coverage: "Scolarité gratuite + année de roumain si besoin + allocation mensuelle (montant à confirmer)",
description: "Université de Bucarest est un établissement d'accueil — elle ne décerne pas elle-même la bourse (sélection par le Ministère roumain des Affaires étrangères). Quelques filières enseignées en anglais/français au cas par cas ; Médecine, Dentaire et Pharmacie exclues.",
status: "Fermée",
isActive: false
}
},
{
id: `king-saud-university-riyad__${scholarshipIds.saudi}`,
data: {
universityId: "king-saud-university-riyad",
scholarshipId: scholarshipIds.saudi,
level: "Licence / Master / Doctorat",
deadline: "Fermée, réouverture annuelle non datée",
applicationUrl: "https://studyinsaudi.sa/en",
language: "Arabe (année préparatoire obligatoire pour non-arabophones)",
duration: "Variable selon le niveau et la filière",
coverage: "Scolarité gratuite + logement + allocation mensuelle + billet d'avion annuel + couverture santé",
description: "King Saud University fait partie des 50+ universités publiques couvertes par le portail national studyinsaudi.sa. Année préparatoire d'arabe obligatoire pour les non-arabophones avant le début du cursus.",
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

log(analyzeLog, "Recherche des 5 bourses stub par titre...");

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
log(analyzeLog, "Anomalie(s) détectée(s) lors de la recherche des bourses — corriger avant de passer à l'étape 2.", "err");
return;
}

const universitiesSnap = await getDocs(collection(db, "universities"));
const existingUniversityIds = new Set(universitiesSnap.docs.map((d) => d.id));

const universityCollisions = UNIVERSITIES.filter((u) => existingUniversityIds.has(u.id));

if (universityCollisions.length) {
log(analyzeLog, `${universityCollisions.length} id(s) d'université collisionnent déjà avec un document existant :`, "err");
universityCollisions.forEach((u) => log(analyzeLog, `  - ${u.id}`, "err"));
} else {
log(analyzeLog, `${UNIVERSITIES.length}/8 identifiants d'université libres.`, "ok");
}

const programs = buildPrograms(scholarshipIds);

const programsSnap = await getDocs(collection(db, "programs"));
const existingProgramIds = new Set(programsSnap.docs.map((d) => d.id));

const programCollisions = programs.filter((p) => existingProgramIds.has(p.id));

if (programCollisions.length) {
log(analyzeLog, `${programCollisions.length} id(s) de programme collisionnent déjà avec un document existant :`, "err");
programCollisions.forEach((p) => log(analyzeLog, `  - ${p.id}`, "err"));
} else {
log(analyzeLog, `${programs.length}/8 identifiants de programme libres.`, "ok");
}

const hasBlockingIssue = universityCollisions.length || programCollisions.length;

if (hasBlockingIssue) {
log(analyzeLog, "Anomalie(s) détectée(s) — corriger avant de passer à l'étape 2.", "err");
return;
}

lastPlan = { scholarshipIds, programs };

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
`Créer ${UNIVERSITIES.length} université(s), mettre à jour 5 bourse(s) existante(s) et créer ${lastPlan.programs.length} programme(s) ? Cette action écrit en base de production.`
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

log(writeLog, "Mise à jour des 5 bourses existantes...");

for (const expected of EXPECTED_SCHOLARSHIPS) {
const id = lastPlan.scholarshipIds[expected.key];
const data = SCHOLARSHIP_UPDATE_DATA[expected.key];
await setDoc(doc(db, "scholarships", id), data);
log(writeLog, `  - ${data.title} (${id}) mis à jour.`);
}

log(writeLog, "5 bourse(s) mise(s) à jour.", "ok");

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

for (const expected of EXPECTED_SCHOLARSHIPS) {
const id = lastPlan.scholarshipIds[expected.key];
const data = SCHOLARSHIP_UPDATE_DATA[expected.key];
const snap = await getDoc(doc(db, "scholarships", id));
const current = snap.exists() ? snap.data() : null;
const fieldsMatch = current && Object.keys(data).every((key) => JSON.stringify(current[key]) === JSON.stringify(data[key]));
if (fieldsMatch) {
ok++;
} else {
mismatch++;
log(verifyLog, `MISMATCH bourse ${id} (${expected.label}) : document ${current ? "trouvé mais différent" : "introuvable"}.`, "err");
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

const total = UNIVERSITIES.length + EXPECTED_SCHOLARSHIPS.length + lastPlan.programs.length;

log(verifyLog, `${ok}/${total} document(s) confirmé(s) en base, champ par champ.`, mismatch === 0 ? "ok" : "err");

if (mismatch === 0) {
log(verifyLog, "ÉCRITURE EN BASE CONFIRMÉE — lot 5 terminé, 0 écart.", "ok");
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
