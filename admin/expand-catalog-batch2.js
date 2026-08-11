// ============================================================
// ScholarBridge — Élargissement du catalogue, Lot 2 (2026-08-11)
// Allemagne (Leibniz Universität Hannover, Universität Hamburg,
// Humboldt-Universität zu Berlin — toutes 3 sur la bourse DAAD Study
// Scholarships) et Suisse (ETH Zurich — Swiss Government Excellence
// Scholarships / ESKAS). Norvège volontairement absente : NTNU et
// University of Bergen confirment sur leurs propres pages ne proposer
// aucune bourse aux étudiants non-UE depuis la réforme des frais de
// scolarité de 2023 ; la réforme qui devait la lever au 1er août 2026
// n'est pas encore votée à date (2026-08-11) — à revoir dans un futur
// lot une fois la situation clarifiée.
//
// Même patron que expand-catalog-batch1.js / backfill-portal-data.js :
// analyse en lecture seule -> écriture -> vérification automatique.
// Toutes les URLs de candidature ont un contenu réel vérifié
// (WebFetch/WebSearch), pas juste la forme de l'URL — voir la
// conversation associée pour le détail de la vérification.
//
// Particularité ESKAS documentée dans la description du programme :
// candidature via la représentation diplomatique suisse du pays
// d'origine (pas un portail web direct) + superviseur académique
// suisse à identifier avant de candidater. Campagne 2027/2028 :
// ouverture le 20 août 2026, deadline par pays publiée ensuite —
// inconnue à l'écriture de ce lot.
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
id: "leibniz-universitat-hannover-hannover",
data: {
name: "Leibniz Universität Hannover",
city: "Hannover",
country: "Allemagne",
image: "hannover.jpg",
flag: "de.svg",
ranking: "#433 mondial (QS 2026)",
description: "Université polytechnique historique de Hanovre, reconnue en ingénierie, sciences naturelles et architecture.",
officialWebsite: "https://www.uni-hannover.de",
applicationPortalUrl: "https://www2.daad.de/deutschland/stipendium/datenbank/en/21148-scholarship-database/?detail=50026200",
fields: []
}
},
{
id: "universitat-hamburg-hamburg",
data: {
name: "Universität Hamburg",
city: "Hambourg",
country: "Allemagne",
image: "hamburg.jpg",
flag: "de.svg",
ranking: "#193 mondial (QS 2026)",
description: "Plus grande université du nord de l'Allemagne, pluridisciplinaire, forte réputation en sciences et sciences humaines.",
officialWebsite: "https://www.uni-hamburg.de",
applicationPortalUrl: "https://www2.daad.de/deutschland/stipendium/datenbank/en/21148-scholarship-database/?detail=50026200",
fields: []
}
},
{
id: "humboldt-universitat-zu-berlin-berlin",
data: {
name: "Humboldt-Universität zu Berlin",
city: "Berlin",
country: "Allemagne",
image: "berlin.jpg",
flag: "de.svg",
ranking: "#130 mondial (QS 2026)",
description: "Plus ancienne université de Berlin (1810), référence en sciences humaines, droit et sciences, alma mater de nombreux lauréats du prix Nobel.",
officialWebsite: "https://www.hu-berlin.de",
applicationPortalUrl: "https://www2.daad.de/deutschland/stipendium/datenbank/en/21148-scholarship-database/?detail=50026200",
fields: []
}
},
{
id: "eth-zurich-zurich",
data: {
name: "ETH Zurich",
city: "Zurich",
country: "Suisse",
image: "zurich.jpg",
flag: "ch.svg",
ranking: "#7 mondial (QS 2026) — 1ʳᵉ université d'Europe continentale",
description: "École polytechnique fédérale de Zurich, référence mondiale en sciences, ingénierie et technologies.",
officialWebsite: "https://www.ethz.ch",
applicationPortalUrl: "https://www.sbfi.admin.ch/en/swiss-government-excellence-scholarships",
fields: []
}
}
];

// -------- Bourses (2) --------
const SCHOLARSHIPS = [
{
id: "daad-study-scholarships",
data: {
title: "DAAD Study Scholarships",
country: "Allemagne",
funding: "100% (scolarité + ~992 €/mois)",
description: "Bourse d'État allemande pour étudiants internationaux admis en Master, toutes disciplines, dans n'importe quelle université publique allemande.",
status: "Ouverte",
isActive: true,
levels: ["Master"],
officialWebsite: "https://www2.daad.de/deutschland/stipendium/datenbank/en/21148-scholarship-database/?detail=50026200",
generalCriteria: "Diplôme de premier cycle terminé. Admission séparée à un programme de Master en Allemagne requise en parallèle de la candidature DAAD — deux démarches distinctes."
}
},
{
id: "swiss-government-excellence-scholarships",
data: {
title: "Swiss Government Excellence Scholarships",
country: "Suisse",
funding: "100% (bourse gouvernementale complète)",
description: "Bourse du gouvernement suisse pour chercheurs de doctorat ou postdoctorat, dans n'importe quelle université ou école polytechnique fédérale suisse (dont ETH Zurich et EPFL).",
status: "Ouverte",
isActive: true,
levels: ["Doctorat"],
officialWebsite: "https://www.sbfi.admin.ch/en/swiss-government-excellence-scholarships",
generalCriteria: "Superviseur académique suisse à identifier avant de candidater. Candidature déposée via la représentation diplomatique suisse du pays d'origine, pas un portail web direct. Campagne 2027/2028 : ouverture le 20 août 2026, deadline par pays publiée ensuite."
}
}
];

// -------- Programmes (4) --------
const PROGRAMS = [
{
id: "leibniz-universitat-hannover-hannover__daad-study-scholarships",
data: {
universityId: "leibniz-universitat-hannover-hannover",
scholarshipId: "daad-study-scholarships",
level: "Master",
deadline: "31 août 2026 (campagne 2027)",
applicationUrl: "https://www2.daad.de/deutschland/stipendium/datenbank/en/21148-scholarship-database/?detail=50026200",
language: "Anglais / Allemand",
duration: "2 ans",
coverage: "100% scolarité + ~992 €/mois",
description: "Admission séparée à un programme de Master de Leibniz Universität Hannover requise en parallèle de la candidature DAAD — deux démarches distinctes.",
status: "Ouverte",
isActive: true
}
},
{
id: "universitat-hamburg-hamburg__daad-study-scholarships",
data: {
universityId: "universitat-hamburg-hamburg",
scholarshipId: "daad-study-scholarships",
level: "Master",
deadline: "31 août 2026 (campagne 2027)",
applicationUrl: "https://www2.daad.de/deutschland/stipendium/datenbank/en/21148-scholarship-database/?detail=50026200",
language: "Anglais / Allemand",
duration: "2 ans",
coverage: "100% scolarité + ~992 €/mois",
description: "Admission séparée à un programme de Master de Universität Hamburg requise en parallèle de la candidature DAAD — deux démarches distinctes.",
status: "Ouverte",
isActive: true
}
},
{
id: "humboldt-universitat-zu-berlin-berlin__daad-study-scholarships",
data: {
universityId: "humboldt-universitat-zu-berlin-berlin",
scholarshipId: "daad-study-scholarships",
level: "Master",
deadline: "31 août 2026 (campagne 2027)",
applicationUrl: "https://www2.daad.de/deutschland/stipendium/datenbank/en/21148-scholarship-database/?detail=50026200",
language: "Anglais / Allemand",
duration: "2 ans",
coverage: "100% scolarité + ~992 €/mois",
description: "Admission séparée à un programme de Master de Humboldt-Universität zu Berlin requise en parallèle de la candidature DAAD — deux démarches distinctes.",
status: "Ouverte",
isActive: true
}
},
{
id: "eth-zurich-zurich__swiss-government-excellence-scholarships",
data: {
universityId: "eth-zurich-zurich",
scholarshipId: "swiss-government-excellence-scholarships",
level: "Doctorat",
deadline: "Campagne 2027/2028 : ouverture 20 août 2026, deadline par pays publiée ensuite",
applicationUrl: "https://www.sbfi.admin.ch/en/swiss-government-excellence-scholarships",
language: "Anglais",
duration: "Variable selon projet de recherche",
coverage: "Bourse gouvernementale complète",
description: "Admission/accord préalable d'un superviseur académique à ETH Zurich requis avant de candidater. Candidature à déposer via la représentation diplomatique suisse du pays d'origine, pas de portail web direct — voir sbfi.admin.ch pour les modalités par pays.",
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

const scholarshipCollisions = SCHOLARSHIPS.filter((s) => existingScholarshipIds.has(s.id));

if (scholarshipCollisions.length) {
log(analyzeLog, `${scholarshipCollisions.length} id(s) de bourse collisionnent déjà avec un document existant :`, "err");
scholarshipCollisions.forEach((s) => log(analyzeLog, `  - ${s.id}`, "err"));
} else {
log(analyzeLog, `${SCHOLARSHIPS.length}/2 identifiants de bourse libres.`, "ok");
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

const hasBlockingIssue = universityCollisions.length || scholarshipCollisions.length || programCollisions.length;

if (hasBlockingIssue) {
log(analyzeLog, "Anomalie(s) détectée(s) — corriger avant de passer à l'étape 2.", "err");
return;
}

lastPlan = true;

log(analyzeLog, "Analyse terminée, aucune collision. Vérifiez le détail ci-dessus avant de passer à l'étape 2.", "ok");

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
`Créer ${UNIVERSITIES.length} université(s), ${SCHOLARSHIPS.length} bourse(s) et ${PROGRAMS.length} programme(s) ? Cette action écrit en base de production.`
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

log(writeLog, "Écriture des bourses...");

for (const s of SCHOLARSHIPS) {
await setDoc(doc(db, "scholarships", s.id), s.data);
log(writeLog, `  - ${s.data.title} (${s.id}) écrit.`);
}

log(writeLog, `${SCHOLARSHIPS.length} bourse(s) écrite(s).`, "ok");

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

const total = UNIVERSITIES.length + SCHOLARSHIPS.length + PROGRAMS.length;

log(verifyLog, `${ok}/${total} document(s) confirmé(s) en base, champ par champ.`, mismatch === 0 ? "ok" : "err");

if (mismatch === 0) {
log(verifyLog, "ÉCRITURE EN BASE CONFIRMÉE — lot 2 terminé, 0 écart.", "ok");
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
