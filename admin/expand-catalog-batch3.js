// ============================================================
// ScholarBridge — Élargissement du catalogue, Lot 3 (2026-08-11)
// Russie (HSE University Moscou, sur la bourse Open Doors déjà
// existante en base mais jusqu'ici vide) et Royaume-Uni (Oxford,
// Imperial College London, University of Edinburgh, toutes 3 sur la
// nouvelle bourse Chevening Scholarships).
//
// Arabie Saoudite volontairement absente : la bourse
// "king-abdulaziz-scholarship" existe déjà en base (vide, comme
// Open Doors avant ce lot) mais son portail officiel
// (dsa-scholarships.kau.edu.sa et les autres sous-domaines KAU) est
// injoignable — à traiter dans un futur lot une fois un portail
// vérifiable identifié.
//
// Même patron que expand-catalog-batch1.js / batch2.js : analyse en
// lecture seule -> écriture -> vérification automatique. Toutes les
// URLs de candidature ont un contenu réel vérifié (WebFetch/WebSearch)
// — voir la conversation associée pour le détail.
//
// Particularité de ce lot : "open-doors-scholarship" existe déjà en
// base (stub vide créé lors de l'import initial) — ce n'est PAS une
// collision, c'est une mise à jour intentionnelle. Elle reçoit en
// plus un champ "securityNotice" (nouveau, lu par scholarship-details
// /details.js) affiché comme bandeau visible sur la fiche : des
// réseaux frauduleux ciblent les étudiants africains en Russie avec
// de fausses offres d'études/travail, distinct du programme Open
// Doors lui-même (légitime, organisé par le Ministère russe de
// l'Enseignement supérieur depuis 2017) mais un risque réel du même
// contexte pays (rapport INPACT, fév. 2026 : 1400+ Africains de 35
// pays engagés dans l'armée russe 2023-2025, 300+ tués).
//
// Chevening : gagner le concours HSE/Open Doors ne garantit pas
// l'admission à HSE (jusqu'à 6 établissements à classer) ; côté
// Chevening, candidature possible sans offre d'admission mais une
// offre ferme d'université britannique reste nécessaire pour
// finaliser la bourse — d'où la mention "admission séparée
// nécessaire" dans chaque description de programme UK.
// ============================================================

import { db } from "../firebase-config.js";

import {
collection,
getDocs,
getDoc,
doc,
setDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// -------- Universités (4) --------
const UNIVERSITIES = [
{
id: "hse-university-moscow",
data: {
name: "HSE University (Higher School of Economics)",
city: "Moscou",
country: "Russie",
image: "moscow.jpg",
flag: "ru.svg",
ranking: "#423 mondial (QS 2026)",
description: "Une des universités les plus prestigieuses de Russie en sciences sociales et économie, organisatrice historique du programme Open Doors, très prisée par les étudiants internationaux.",
officialWebsite: "https://www.hse.ru/en/",
applicationPortalUrl: "https://od.globaluni.ru/",
fields: []
}
},
{
id: "university-of-oxford-oxford",
data: {
name: "University of Oxford",
city: "Oxford",
country: "Royaume-Uni",
image: "oxford.jpg",
flag: "gb.svg",
ranking: "#4 mondial (QS 2026)",
description: "Plus ancienne université du monde anglophone (fondée au XIe siècle), référence mondiale toutes disciplines confondues.",
officialWebsite: "https://www.ox.ac.uk",
applicationPortalUrl: "https://www.chevening.org/apply/",
fields: []
}
},
{
id: "imperial-college-london-london",
data: {
name: "Imperial College London",
city: "Londres",
country: "Royaume-Uni",
image: "london.jpg",
flag: "gb.svg",
ranking: "#2 mondial (QS 2026)",
description: "Référence mondiale en sciences, ingénierie, médecine et gestion, exclusivement dédiée aux STEM.",
officialWebsite: "https://www.imperial.ac.uk",
applicationPortalUrl: "https://www.chevening.org/apply/",
fields: []
}
},
{
id: "university-of-edinburgh-edinburgh",
data: {
name: "University of Edinburgh",
city: "Édimbourg",
country: "Royaume-Uni",
image: "edinburgh.jpg",
flag: "gb.svg",
ranking: "#34 mondial (QS 2026)",
description: "Plus ancienne université d'Écosse (1583), forte réputation en sciences, médecine et sciences humaines, ville classée au patrimoine mondial de l'UNESCO.",
officialWebsite: "https://www.ed.ac.uk",
applicationPortalUrl: "https://www.chevening.org/apply/",
fields: []
}
}
];

// -------- Bourse déjà existante à mettre à jour (1) --------
const SCHOLARSHIP_UPDATE = {
id: "open-doors-scholarship",
data: {
title: "Open Doors: Russian Scholarship Project",
country: "Russie",
funding: "100% (scolarité + bourse mensuelle)",
description: "Concours d'excellence académique du gouvernement russe (Ministère de l'Enseignement supérieur), organisé par l'association \"Global Universities\" depuis 2017. Donne accès à un cursus gratuit dans l'une des 24 universités russes participantes, dont HSE University.",
status: "Ouverte",
isActive: true,
levels: ["Licence", "Master", "Doctorat", "Postdoctorat"],
officialWebsite: "https://od.globaluni.ru/",
generalCriteria: "Concours en 2 étapes à distance (portfolio + épreuve en ligne). Gagner le concours ne garantit pas l'admission dans une université précise : les lauréats s'inscrivent ensuite sur le système du Ministère et classent jusqu'à 6 établissements par ordre de préférence.",
securityNotice: "⚠️ Vigilance : des réseaux frauduleux ciblent les étudiants africains en Russie avec de fausses offres d'études/travail. Ne passez jamais par un intermédiaire non officiel — toute démarche se fait uniquement via le portail officiel od.globaluni.ru et votre ambassade."
}
};

// -------- Nouvelle bourse (1) --------
const SCHOLARSHIPS_NEW = [
{
id: "chevening-scholarships",
data: {
title: "Chevening Scholarships",
country: "Royaume-Uni",
funding: "100% (scolarité + indemnité mensuelle + billet d'avion)",
description: "Bourse phare du gouvernement britannique (Foreign, Commonwealth and Development Office), pour un Master d'un an dans n'importe quelle université du Royaume-Uni. Financée depuis 1983, plus de 60 000 boursiers dans 160+ pays.",
status: "Ouverte",
isActive: true,
levels: ["Master"],
officialWebsite: "https://www.chevening.org/apply/",
generalCriteria: "⏰ Deadline urgente : 6 octobre 2026, 11h00 UTC (candidature 2027-2028, ouverte depuis le 4 août 2026). Minimum 2 800 heures d'expérience professionnelle requises (~2 ans — stages/bénévolat/temps partiel comptent). Licence niveau 2:1 britannique ou équivalent, terminée au moins 2 ans avant la deadline. Candidature possible sans offre d'admission (3 formations à choisir dès la candidature), mais une offre ferme d'une université britannique reste nécessaire pour finaliser la bourse. Engagement de retour au pays d'origine 2 ans minimum après la bourse."
}
}
];

// -------- Programmes (4) --------
const PROGRAMS = [
{
id: "hse-university-moscow__open-doors-scholarship",
data: {
universityId: "hse-university-moscow",
scholarshipId: "open-doors-scholarship",
level: "Licence / Master / Doctorat / Postdoctorat",
deadline: "Inscription dès le 20 août 2026, 1ère étape jusqu'au 1er novembre 2026 (Licence/Master), résultats finaux 26 février 2027 (Doctorat/Postdoctorat)",
applicationUrl: "https://od.globaluni.ru/",
language: "Anglais / Russe",
duration: "Variable selon le niveau et le programme",
coverage: "100% scolarité + bourse mensuelle (transport, logement, assurance à la charge de l'étudiant)",
description: "HSE University est l'une des universités organisatrices d'Open Doors, très prisée sur le programme. Gagner le concours ne garantit toutefois pas une place à HSE : les lauréats classent jusqu'à 6 établissements par ordre de préférence lors de l'inscription finale.",
status: "Ouverte",
isActive: true
}
},
{
id: "university-of-oxford-oxford__chevening-scholarships",
data: {
universityId: "university-of-oxford-oxford",
scholarshipId: "chevening-scholarships",
level: "Master",
deadline: "6 octobre 2026, 11h00 UTC (candidature 2027-2028)",
applicationUrl: "https://www.chevening.org/apply/",
language: "Anglais",
duration: "1 an",
coverage: "100% scolarité + indemnité mensuelle (1 516 £/mois à Londres, 1 215 £/mois ailleurs) + billet d'avion aller-retour",
description: "Admission séparée nécessaire : la candidature Chevening peut se faire sans offre d'admission, mais 3 formations éligibles doivent être choisies dès la candidature, et une offre ferme de University of Oxford doit être obtenue avant la finalisation de la bourse.",
status: "Ouverte",
isActive: true
}
},
{
id: "imperial-college-london-london__chevening-scholarships",
data: {
universityId: "imperial-college-london-london",
scholarshipId: "chevening-scholarships",
level: "Master",
deadline: "6 octobre 2026, 11h00 UTC (candidature 2027-2028)",
applicationUrl: "https://www.chevening.org/apply/",
language: "Anglais",
duration: "1 an",
coverage: "100% scolarité + indemnité mensuelle (1 516 £/mois à Londres, 1 215 £/mois ailleurs) + billet d'avion aller-retour",
description: "Admission séparée nécessaire : la candidature Chevening peut se faire sans offre d'admission, mais 3 formations éligibles doivent être choisies dès la candidature, et une offre ferme de Imperial College London doit être obtenue avant la finalisation de la bourse.",
status: "Ouverte",
isActive: true
}
},
{
id: "university-of-edinburgh-edinburgh__chevening-scholarships",
data: {
universityId: "university-of-edinburgh-edinburgh",
scholarshipId: "chevening-scholarships",
level: "Master",
deadline: "6 octobre 2026, 11h00 UTC (candidature 2027-2028)",
applicationUrl: "https://www.chevening.org/apply/",
language: "Anglais",
duration: "1 an",
coverage: "100% scolarité + indemnité mensuelle (1 516 £/mois à Londres, 1 215 £/mois ailleurs) + billet d'avion aller-retour",
description: "Admission séparée nécessaire : la candidature Chevening peut se faire sans offre d'admission, mais 3 formations éligibles doivent être choisies dès la candidature, et une offre ferme de University of Edinburgh doit être obtenue avant la finalisation de la bourse.",
status: "Ouverte",
isActive: true
}
}
];

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

const universitiesSnap = await getDocs(collection(db, "universities"));
const existingUniversityIds = new Set(universitiesSnap.docs.map((d) => d.id));

const universityCollisions = UNIVERSITIES.filter((u) => existingUniversityIds.has(u.id));

if (universityCollisions.length) {
log(analyzeLog, `${universityCollisions.length} id(s) d'université collisionnent déjà avec un document existant :`, "err");
universityCollisions.forEach((u) => log(analyzeLog, `  - ${u.id}`, "err"));
} else {
log(analyzeLog, `${UNIVERSITIES.length}/4 identifiants d'université libres.`, "ok");
}

const scholarshipsSnap = await getDocs(collection(db, "scholarships"));
const existingScholarshipIds = new Set(scholarshipsSnap.docs.map((d) => d.id));

const scholarshipCollisions = SCHOLARSHIPS_NEW.filter((s) => existingScholarshipIds.has(s.id));

if (scholarshipCollisions.length) {
log(analyzeLog, `${scholarshipCollisions.length} id(s) de nouvelle bourse collisionnent déjà avec un document existant :`, "err");
scholarshipCollisions.forEach((s) => log(analyzeLog, `  - ${s.id}`, "err"));
} else {
log(analyzeLog, `${SCHOLARSHIPS_NEW.length}/1 identifiant de nouvelle bourse libre.`, "ok");
}

const openDoorsExists = existingScholarshipIds.has(SCHOLARSHIP_UPDATE.id);

if (!openDoorsExists) {
log(analyzeLog, `"${SCHOLARSHIP_UPDATE.id}" est introuvable en base — attendu comme stub existant à mettre à jour, pas une création. Anomalie.`, "err");
} else {
log(analyzeLog, `"${SCHOLARSHIP_UPDATE.id}" trouvé en base — sera mis à jour (pas une collision).`, "ok");
}

const programsSnap = await getDocs(collection(db, "programs"));
const existingProgramIds = new Set(programsSnap.docs.map((d) => d.id));

const programCollisions = PROGRAMS.filter((p) => existingProgramIds.has(p.id));

if (programCollisions.length) {
log(analyzeLog, `${programCollisions.length} id(s) de programme collisionnent déjà avec un document existant :`, "err");
programCollisions.forEach((p) => log(analyzeLog, `  - ${p.id}`, "err"));
} else {
log(analyzeLog, `${PROGRAMS.length}/4 identifiants de programme libres.`, "ok");
}

const hasBlockingIssue = universityCollisions.length || scholarshipCollisions.length || !openDoorsExists || programCollisions.length;

if (hasBlockingIssue) {
log(analyzeLog, "Anomalie(s) détectée(s) — corriger avant de passer à l'étape 2.", "err");
return;
}

lastPlan = true;

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
`Créer ${UNIVERSITIES.length} université(s), 1 nouvelle bourse (Chevening), mettre à jour 1 bourse existante (Open Doors) et créer ${PROGRAMS.length} programme(s) ? Cette action écrit en base de production.`
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

log(writeLog, "Écriture de la nouvelle bourse...");

for (const s of SCHOLARSHIPS_NEW) {
await setDoc(doc(db, "scholarships", s.id), s.data);
log(writeLog, `  - ${s.data.title} (${s.id}) écrit.`);
}

log(writeLog, "Mise à jour de la bourse existante (Open Doors)...");

await setDoc(doc(db, "scholarships", SCHOLARSHIP_UPDATE.id), SCHOLARSHIP_UPDATE.data);
log(writeLog, `  - ${SCHOLARSHIP_UPDATE.data.title} (${SCHOLARSHIP_UPDATE.id}) mis à jour.`);

log(writeLog, "Écriture des programmes...");

for (const p of PROGRAMS) {
await setDoc(doc(db, "programs", p.id), p.data);
log(writeLog, `  - ${p.id} écrit.`);
}

log(writeLog, `${PROGRAMS.length} programme(s) écrit(s).`, "ok");
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

for (const s of SCHOLARSHIPS_NEW) {
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

{
const snap = await getDoc(doc(db, "scholarships", SCHOLARSHIP_UPDATE.id));
const current = snap.exists() ? snap.data() : null;
const fieldsMatch = current && Object.keys(SCHOLARSHIP_UPDATE.data).every((key) => JSON.stringify(current[key]) === JSON.stringify(SCHOLARSHIP_UPDATE.data[key]));
if (fieldsMatch) {
ok++;
} else {
mismatch++;
log(verifyLog, `MISMATCH bourse ${SCHOLARSHIP_UPDATE.id} : document ${current ? "trouvé mais différent" : "introuvable"}.`, "err");
}
}

for (const p of PROGRAMS) {
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

const total = UNIVERSITIES.length + SCHOLARSHIPS_NEW.length + 1 + PROGRAMS.length;

log(verifyLog, `${ok}/${total} document(s) confirmé(s) en base, champ par champ.`, mismatch === 0 ? "ok" : "err");

if (mismatch === 0) {
log(verifyLog, "ÉCRITURE EN BASE CONFIRMÉE — lot 3 terminé, 0 écart.", "ok");
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
