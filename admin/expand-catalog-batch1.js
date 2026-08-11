// ============================================================
// ScholarBridge — Élargissement du catalogue, Lot 1 (2026-08-11)
// France (Sciences Po seule — Eiffel volontairement exclue, campagne
// 2027/2028 pas encore publiée par Campus France à date), Canada
// (University of Toronto, UBC, McGill), États-Unis (Stanford, UC
// Berkeley). Toutes les URLs de candidature ont un contenu réel
// vérifié (WebFetch/WebSearch), pas juste la forme de l'URL — voir la
// conversation associée pour le détail de la vérification.
//
// Même patron que backfill-portal-data.js / migrate.js : analyse en
// lecture seule -> écriture -> vérification automatique.
//
// Lester B. Pearson International Scholarship existe déjà dans
// "scholarships" (créée avant l'architecture relationnelle actuelle,
// jamais reliée à une université — c'est pour ça qu'elle retombait sur
// l'image générique du hero). On la retrouve par titre plutôt que de
// coder son id en dur, pour que l'étape d'analyse échoue proprement si
// elle a été renommée ou supprimée entre-temps.
// ============================================================

import { db } from "../firebase-config.js";

import {
collection,
getDocs,
getDoc,
doc,
setDoc,
query,
where
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const PEARSON_TITLE = "Lester B. Pearson International Scholarship";

// -------- Universités (6) --------
const UNIVERSITIES = [
{
id: "sciences-po-paris",
data: {
name: "Sciences Po",
city: "Paris",
country: "France",
image: "paris.jpg",
flag: "fr.svg",
ranking: "#367 mondial (QS 2026) — #3 mondial en Sciences politiques",
description: "Grande école parisienne de référence en sciences politiques, économie et relations internationales, sélective et internationalement reconnue.",
officialWebsite: "https://www.sciencespo.fr",
applicationPortalUrl: "https://www.sciencespo.fr/students/en/fees-funding/bursaries-financial-aid/emile-boutmy-scholarship/",
fields: []
}
},
{
id: "university-of-toronto-toronto",
data: {
name: "University of Toronto",
city: "Toronto",
country: "Canada",
image: "toronto.jpg",
flag: "ca.svg",
ranking: "#29 mondial (QS 2026)",
description: "Plus grande université du Canada, membre du U15, réputée pour la recherche et son corps professoral international.",
officialWebsite: "https://www.utoronto.ca",
applicationPortalUrl: "https://future.utoronto.ca/pearson-scholarships",
fields: []
}
},
{
id: "university-of-british-columbia-vancouver",
data: {
name: "University of British Columbia",
city: "Vancouver",
country: "Canada",
image: "vancouver.jpg",
flag: "ca.svg",
ranking: "#40 mondial (QS 2026)",
description: "Université publique de recherche sur la côte ouest canadienne, membre du U15, connue pour ses programmes en sciences et en commerce.",
officialWebsite: "https://you.ubc.ca",
applicationPortalUrl: "https://you.ubc.ca/financial-planning/scholarships-awards-international-students",
fields: []
}
},
{
id: "mcgill-university-montreal",
data: {
name: "McGill University",
city: "Montréal",
country: "Canada",
image: "montreal.jpg",
flag: "ca.svg",
ranking: "#27 mondial (QS 2026) — université canadienne la mieux classée",
description: "Université montréalaise réputée en médecine, droit et sciences, environnement explicitement bilingue anglais/français.",
officialWebsite: "https://www.mcgill.ca",
applicationPortalUrl: "https://www.mcgill.ca/studentaid/scholarships-aid/future-undergrads/entrance-scholarships",
fields: []
}
},
{
id: "stanford-university-stanford",
data: {
name: "Stanford University",
city: "Stanford",
country: "États-Unis",
image: "newyork.jpg",
flag: "us.svg",
ranking: "#3 mondial (QS 2026)",
description: "Université de recherche de la Silicon Valley, référence mondiale en ingénierie, informatique et entrepreneuriat.",
officialWebsite: "https://www.stanford.edu",
applicationPortalUrl: "https://apply.knight-hennessy.stanford.edu/apply/",
fields: []
}
},
{
id: "university-of-california-berkeley-berkeley",
data: {
name: "University of California, Berkeley",
city: "Berkeley",
country: "États-Unis",
image: "newyork.jpg",
flag: "us.svg",
ranking: "#17 mondial (QS 2026)",
description: "Université publique de recherche de la baie de San Francisco, l'une des plus prestigieuses au monde, pionnière en sciences et ingénierie.",
officialWebsite: "https://www.berkeley.edu",
applicationPortalUrl: "https://mcfscholarsprogram.berkeley.edu",
fields: []
}
}
];

// -------- Bourses nouvelles (5) — Pearson est retrouvée en base, pas
// recréée ici. --------
const SCHOLARSHIPS = [
{
id: "bourse-emile-boutmy",
data: {
title: "Bourse Émile Boutmy",
country: "France",
funding: "Partielle (jusqu'à 19 000 €/an)",
description: "Bourse de Sciences Po réservée aux étudiants non-UE admis en Licence ou Master, attribuée sur critères de mérite et de situation financière familiale.",
status: "Ouverte",
isActive: true,
levels: ["Licence", "Master"],
officialWebsite: "https://www.sciencespo.fr/students/en/fees-funding/bursaries-financial-aid/emile-boutmy-scholarship/",
generalCriteria: "Non-UE, premier candidat à Sciences Po, admis en Licence ou Master, dossier financier familial à fournir."
}
},
{
id: "ubc-international-scholars-program",
data: {
title: "UBC International Scholars Program (IMES)",
country: "Canada",
funding: "Partielle (10 000 – 25 000 $ CAD/an, renouvelable jusqu'à 4 ans)",
description: "Bourse d'entrée au mérite de l'University of British Columbia pour étudiants internationaux entrant en première année de Licence.",
status: "Ouverte",
isActive: true,
levels: ["Licence"],
officialWebsite: "https://you.ubc.ca/financial-planning/scholarships-awards-international-students",
generalCriteria: "Étudiant international entrant directement en 1ʳᵉ année à UBC, sous permis d'études canadien. Considération automatique après admission, aucune candidature de bourse distincte."
}
},
{
id: "mcgill-major-entrance-scholarships",
data: {
title: "McGill Major Entrance Scholarships",
country: "Canada",
funding: "Variable selon dossier",
description: "Bourses d'entrée au mérite de McGill University pour étudiants internationaux entrant en première année de Licence, montant variable selon le dossier.",
status: "Ouverte",
isActive: true,
levels: ["Licence"],
officialWebsite: "https://www.mcgill.ca/studentaid/scholarships-aid/future-undergrads/entrance-scholarships",
generalCriteria: "Candidature de bourse distincte requise sur le portail des admissions, en plus de la candidature à l'admission elle-même."
}
},
{
id: "knight-hennessy-scholars",
data: {
title: "Knight-Hennessy Scholars",
country: "États-Unis",
funding: "100% (scolarité + allocation + voyage + programme de leadership)",
description: "Bourse d'excellence de Stanford University pour étudiants de tous pays admis en 2ᵉ ou 3ᵉ cycle, tous domaines, jusqu'à 100 bourses attribuées par an.",
status: "Ouverte",
isActive: true,
levels: ["Master", "Doctorat"],
officialWebsite: "https://knight-hennessy.stanford.edu",
generalCriteria: "Ouvert à toutes nationalités. Admission à un programme de 2ᵉ ou 3ᵉ cycle de Stanford requise en parallèle — aucun frais de candidature pour la bourse elle-même."
}
},
{
id: "mastercard-foundation-scholars-program",
data: {
title: "Mastercard Foundation Scholars Program",
country: "États-Unis",
funding: "100% (scolarité + logement + voyage)",
description: "Bourse complète pour étudiants de Master à UC Berkeley — programme réservé aux citoyens de pays africains, non ouvert au premier cycle à Berkeley.",
status: "Ouverte",
isActive: true,
levels: ["Master"],
officialWebsite: "https://mcfscholarsprogram.berkeley.edu",
generalCriteria: "Réservé aux citoyens de pays africains. Candidature au 1ᵉʳ tour du programme de master visé obligatoire pour être considéré."
}
}
];

// -------- Programmes (6) — un par université, relié à sa bourse. La
// mention "admission séparée au programme visé requise" est répétée
// explicitement dans description comme demandé, même quand déjà
// présente dans generalCriteria de la bourse : c'est cette valeur-ci
// qui s'affiche sur scholarship-details.html. --------
function buildPrograms(pearsonId) {
return [
{
id: "sciences-po-paris__bourse-emile-boutmy",
data: {
universityId: "sciences-po-paris",
scholarshipId: "bourse-emile-boutmy",
level: "Master",
deadline: "30 novembre 2026",
applicationUrl: "https://www.sciencespo.fr/students/en/fees-funding/bursaries-financial-aid/emile-boutmy-scholarship/",
language: "Anglais",
duration: "2 ans",
coverage: "Jusqu'à 19 000 €/an (partielle)",
description: "Admission séparée au programme de Master de Sciences Po requise avant de pouvoir indiquer sa candidature à la bourse Émile Boutmy dans le dossier financier.",
status: "Ouverte",
isActive: true
}
},
{
id: "university-of-toronto-toronto__" + pearsonId,
data: {
universityId: "university-of-toronto-toronto",
scholarshipId: pearsonId,
level: "Licence",
deadline: "6 novembre 2026",
applicationUrl: "https://future.utoronto.ca/pearson-scholarships",
language: "Anglais",
duration: "4 ans",
coverage: "100% (scolarité + logement + livres)",
description: "Admission séparée au programme de premier cycle de l'University of Toronto (via OUAC) requise ; nomination par l'établissement secondaire obligatoire avant de pouvoir postuler à la bourse Pearson.",
status: "Ouverte",
isActive: true
}
},
{
id: "university-of-british-columbia-vancouver__ubc-international-scholars-program",
data: {
universityId: "university-of-british-columbia-vancouver",
scholarshipId: "ubc-international-scholars-program",
level: "Licence",
deadline: "1 décembre 2026",
applicationUrl: "https://you.ubc.ca/financial-planning/scholarships-awards-international-students",
language: "Anglais",
duration: "4 ans (renouvelable)",
coverage: "10 000 – 25 000 $ CAD/an (partielle)",
description: "Admission séparée au programme de premier cycle de UBC requise ; la bourse est automatiquement considérée après l'admission, aucune candidature distincte.",
status: "Ouverte",
isActive: true
}
},
{
id: "mcgill-university-montreal__mcgill-major-entrance-scholarships",
data: {
universityId: "mcgill-university-montreal",
scholarshipId: "mcgill-major-entrance-scholarships",
level: "Licence",
deadline: "21 janvier 2027",
applicationUrl: "https://www.mcgill.ca/studentaid/scholarships-aid/future-undergrads/entrance-scholarships",
language: "Anglais / Français",
duration: "Variable, renouvelable",
coverage: "Montant variable selon dossier",
description: "Admission séparée au programme de premier cycle de McGill requise, ainsi qu'une candidature de bourse distincte sur le portail des admissions.",
status: "Ouverte",
isActive: true
}
},
{
id: "stanford-university-stanford__knight-hennessy-scholars",
data: {
universityId: "stanford-university-stanford",
scholarshipId: "knight-hennessy-scholars",
level: "Master",
deadline: "6 octobre 2026, 13h (heure Pacifique)",
applicationUrl: "https://apply.knight-hennessy.stanford.edu/apply/",
language: "Anglais",
duration: "Variable (2-3 ans financés selon programme)",
coverage: "100% (scolarité + allocation + voyage + programme de leadership)",
description: "Admission séparée à un programme de 2ᵉ ou 3ᵉ cycle de Stanford (tous domaines, y compris Doctorat) requise en parallèle de la candidature Knight-Hennessy.",
status: "Ouverte",
isActive: true
}
},
{
id: "university-of-california-berkeley-berkeley__mastercard-foundation-scholars-program",
data: {
universityId: "university-of-california-berkeley-berkeley",
scholarshipId: "mastercard-foundation-scholars-program",
level: "Master",
deadline: "Continu jusqu'à l'automne 2028 (1ᵉʳ tour du programme visé)",
applicationUrl: "https://mcfscholarsprogram.berkeley.edu",
language: "Anglais",
duration: "Variable selon programme de master",
coverage: "100% (scolarité + logement + voyage) — réservé aux citoyens de pays africains",
description: "Admission séparée à un programme de Master de UC Berkeley requise, au 1ᵉʳ tour de candidature, avant nomination comme Mastercard Foundation Scholar. Non ouvert au premier cycle à Berkeley.",
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

log(analyzeLog, "Recherche de la bourse Pearson déjà en base...");

const scholarshipsSnap = await getDocs(collection(db, "scholarships"));
const scholarships = scholarshipsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

const pearson = scholarships.find((s) => (s.title || "").trim() === PEARSON_TITLE);

if (!pearson) {
log(analyzeLog, `ERREUR : aucune bourse "${PEARSON_TITLE}" trouvée en base. Impossible de relier University of Toronto — vérifier que le titre n'a pas changé.`, "err");
return;
}

log(analyzeLog, `Bourse Pearson trouvée : id "${pearson.id}".`, "ok");

const universitiesSnap = await getDocs(collection(db, "universities"));
const existingUniversityIds = new Set(universitiesSnap.docs.map((d) => d.id));

const universityCollisions = UNIVERSITIES.filter((u) => existingUniversityIds.has(u.id));

if (universityCollisions.length) {
log(analyzeLog, `${universityCollisions.length} id(s) d'université collisionnent déjà avec un document existant :`, "err");
universityCollisions.forEach((u) => log(analyzeLog, `  - ${u.id}`, "err"));
} else {
log(analyzeLog, `${UNIVERSITIES.length}/6 identifiants d'université libres.`, "ok");
}

const scholarshipCollisions = SCHOLARSHIPS.filter((s) => scholarships.some((existing) => existing.id === s.id));

if (scholarshipCollisions.length) {
log(analyzeLog, `${scholarshipCollisions.length} id(s) de bourse collisionnent déjà avec un document existant :`, "err");
scholarshipCollisions.forEach((s) => log(analyzeLog, `  - ${s.id}`, "err"));
} else {
log(analyzeLog, `${SCHOLARSHIPS.length}/5 identifiants de bourse libres.`, "ok");
}

const programs = buildPrograms(pearson.id);

const programsSnap = await getDocs(collection(db, "programs"));
const existingProgramIds = new Set(programsSnap.docs.map((d) => d.id));

const programCollisions = programs.filter((p) => existingProgramIds.has(p.id));

if (programCollisions.length) {
log(analyzeLog, `${programCollisions.length} id(s) de programme collisionnent déjà avec un document existant :`, "err");
programCollisions.forEach((p) => log(analyzeLog, `  - ${p.id}`, "err"));
} else {
log(analyzeLog, `${programs.length}/6 identifiants de programme libres.`, "ok");
}

const hasBlockingIssue = !pearson || universityCollisions.length || scholarshipCollisions.length || programCollisions.length;

if (hasBlockingIssue) {
log(analyzeLog, "Anomalie(s) détectée(s) — corriger avant de passer à l'étape 2.", "err");
return;
}

lastPlan = { pearsonId: pearson.id, programs };

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
`Créer ${UNIVERSITIES.length} université(s), ${SCHOLARSHIPS.length} bourse(s) et ${lastPlan.programs.length} programme(s) ? Cette action écrit en base de production.`
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

const total = UNIVERSITIES.length + SCHOLARSHIPS.length + lastPlan.programs.length;

log(verifyLog, `${ok}/${total} document(s) confirmé(s) en base, champ par champ.`, mismatch === 0 ? "ok" : "err");

if (mismatch === 0) {
log(verifyLog, "ÉCRITURE EN BASE CONFIRMÉE — lot 1 terminé, 0 écart.", "ok");
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
