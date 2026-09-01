// ============================================================
// FitzUniverse — Universités orphelines, Lot 22 (2026-08-30)
//
// Crée les 7 universités dont les BOURSES existent déjà en base
// depuis le lot 19, mais qui n'avaient pas de fiche : leurs bourses
// étaient donc invisibles depuis les pages « universités ».
//
// Crée 7 universités et 8 programmes. Ne crée aucune bourse, n'en
// modifie aucune.
//
// PRÉREQUIS ABSOLU — lancer d'abord :
//   powershell -ExecutionPolicy Bypass -File scripts\add-lot22-city-photos.ps1
// Sans les 35 fichiers photo, les fiches s'afficheront avec l'image
// de repli et la règle « une photo par université » (lot 11) sera
// violée dès la création.
//
// Les 8 bourses visées sont résolues EN DIRECT par identifiant,
// re-vérifié par comparaison de titre avant toute écriture — même
// patron que les lots 8, 18, 19 et 20.
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
.replace(/ı/g, "i")
.replace(/İ/g, "i")
.normalize("NFD")
.replace(/[̀-ͯ]/g, "")
.toLowerCase()
.trim();
}

// -------- Les 7 universités --------
const UNIVERSITIES = [
{
id: "seoul-national-university-seoul",
data: {
name: "Seoul National University",
city: "Séoul",
country: "Corée du Sud",
image: "snu-seoul.jpg",
flag: "kr.svg",
ranking: "Première université nationale de Corée du Sud",
description: "Porte deux dispositifs distincts pour les internationaux : la SNU Global Scholarship, la plus large en volume (environ 160 boursiers par an), et la Glo-Harmony financée par la Fondation Samsung, réservée aux pays de la liste CAD de l'OCDE.",
officialWebsite: "https://en.snu.ac.kr",
applicationPortalUrl: "https://en.snu.ac.kr/admission/graduate/scholarships/after_admission",
fields: []
}
},
{
id: "kaist-daejeon",
data: {
name: "KAIST (Korea Advanced Institute of Science and Technology)",
city: "Daejeon",
country: "Corée du Sud",
image: "daejeon.jpg",
flag: "kr.svg",
ranking: "Première université scientifique et technologique de Corée du Sud",
description: "Sa bourse ne se demande pas séparément : il suffit de cocher l'option dans le dossier d'admission, les chefs de département recommandant ensuite les meilleurs profils.",
officialWebsite: "https://www.kaist.ac.kr",
applicationPortalUrl: "https://admission.kaist.ac.kr/intl-graduate/",
fields: []
}
},
{
id: "postech-pohang",
data: {
name: "POSTECH (Pohang University of Science and Technology)",
city: "Pohang",
country: "Corée du Sud",
image: "pohang.jpg",
flag: "kr.svg",
ranking: "Université de recherche privée, spécialisée sciences et ingénierie",
description: "Le financement passe par l'assistanat d'enseignement ou de recherche plutôt que par une bourse nominative, et couvre scolarité, résidence et subsistance. Deux départements accueillent des internationaux : GIFT (matériaux) et Battery Engineering.",
officialWebsite: "https://www.postech.ac.kr",
applicationPortalUrl: "https://admission.postech.ac.kr/international/",
fields: []
}
},
{
id: "korea-national-university-of-arts-seoul",
data: {
name: "Korea National University of Arts (K-Arts)",
city: "Séoul",
country: "Corée du Sud",
image: "karts-seoul.jpg",
flag: "kr.svg",
ranking: "Université nationale des arts de Corée du Sud",
description: "Seul établissement coréen portant une grande bourse gouvernementale entièrement dédiée aux arts — musique, danse, théâtre, cinéma, arts visuels et arts traditionnels. Un portfolio est exigé selon le département.",
officialWebsite: "https://www.karts.ac.kr",
applicationPortalUrl: "https://www.karts.ac.kr/en/karts/ama.do",
fields: []
}
},
{
id: "koc-university-istanbul",
data: {
name: "Koç University",
city: "Istanbul",
country: "Turquie",
image: "koc-istanbul.jpg",
flag: "tr.svg",
ranking: "Université privée de recherche, campus de Sarıyer sur le Bosphore",
description: "Ses bourses au mérite sont attribuées automatiquement à l'examen du dossier d'admission, sans candidature distincte. Attention : les masters sans thèse et la médecine en sont exclus.",
officialWebsite: "https://www.ku.edu.tr",
applicationPortalUrl: "https://international.ku.edu.tr/scholarships/",
fields: []
}
},
{
id: "sabanci-university-istanbul",
data: {
name: "Sabancı University",
city: "Istanbul",
country: "Turquie",
image: "sabanci-istanbul.jpg",
flag: "tr.svg",
ranking: "Université privée de recherche, campus de Tuzla sur la rive asiatique",
description: "Porte le financement de troisième cycle le plus élevé de Turquie sur source officielle : les bourses sur projet y dépassent largement toute bourse gouvernementale turque.",
officialWebsite: "https://www.sabanciuniv.edu",
applicationPortalUrl: "https://www.sabanciuniv.edu/en/graduate-scholarships",
fields: []
}
},
{
id: "bilkent-university-ankara",
data: {
name: "Bilkent University",
city: "Ankara",
country: "Turquie",
image: "ankara.jpg",
flag: "tr.svg",
ranking: "Première université privée de Turquie, fondée en 1984",
description: "Barème d'exonération à cinq paliers attribué sur dossier à l'admission, avec une bourse logement réservée à l'élite des boursiers à 100 %. Réservée à qui n'a jamais eu la nationalité turque.",
officialWebsite: "https://w3.bilkent.edu.tr",
applicationPortalUrl: "https://w3.bilkent.edu.tr/international/scholarships-for-international-students/",
fields: []
}
}
];

// -------- Les 8 bourses à relier, vérifiées par titre --------
const LINKS = [
{
universityId: "seoul-national-university-seoul",
scholarshipId: "snu-global-scholarship",
expectTitle: "snu global scholarship",
data: {
level: "Master / Doctorat",
deadline: "Indexée sur le calendrier d'admission de la SNU — la demande se fait à la réception de l'admission",
applicationUrl: "https://en.snu.ac.kr/admission/graduate/scholarships/after_admission",
language: "Anglais / Coréen selon le programme",
duration: "Durée du cursus",
coverage: "Frais de scolarité, subsistance, billet d'avion et logement, montants variables selon la situation",
description: "Dispositif le plus large en volume de la SNU : environ 160 boursiers par an, ouvert à tous les étudiants internationaux admis en cycle supérieur.",
status: "Ouverte"
}
},
{
universityId: "seoul-national-university-seoul",
scholarshipId: "snu-glo-harmony-scholarship",
expectTitle: "glo-harmony",
data: {
level: "Master / Doctorat",
deadline: "Deux fenêtres par an, en janvier et en juillet — celle de juillet 2026 est close, la suivante s'ouvre en janvier 2027",
applicationUrl: "https://en.snu.ac.kr/admission/graduate/scholarships/after_admission",
language: "Anglais / Coréen selon le programme",
duration: "4 semestres en master, 6 en doctorat",
coverage: "Montant fixé au cas par cas par la Fondation Samsung — non publié",
description: "Financée par la Fondation Samsung, réservée aux ressortissants des pays de la liste CAD de l'OCDE, Sénégal inclus. Présélection par la SNU, puis entretiens par la Fondation.",
status: "Fermée"
}
},
{
universityId: "kaist-daejeon",
scholarshipId: "kaist-scholarship",
expectTitle: "kaist scholarship",
data: {
level: "Master / Doctorat",
deadline: "Trois sessions par an (Spring, Fall Early, Fall Regular) — dates non publiées de façon accessible, se référer au calendrier d'admission",
applicationUrl: "https://admission.kaist.ac.kr/intl-graduate/FinancialSupport/Scholarship/KAISTScholarship",
language: "Anglais",
duration: "4 semestres (master) ou 8 semestres (doctorat)",
coverage: "Frais de scolarité intégraux, assurance maladie nationale, allocation mensuelle variable selon l'implication en recherche",
description: "Aucune candidature séparée : il suffit de cocher l'option bourse dans le dossier d'admission. La filière GDI-GTIP en est exclue.",
status: "Ouverte"
}
},
{
universityId: "postech-pohang",
scholarshipId: "postech-gift-scholarship",
expectTitle: "postech",
data: {
level: "Master / Doctorat",
deadline: "Deuxième session 2026-27 : 6 juillet au 11 septembre 2026 à 18h00 KST, résultats le 19 novembre 2026",
applicationUrl: "https://admission.postech.ac.kr/international/",
language: "Anglais",
duration: "Durée du cursus",
coverage: "Assistanat couvrant scolarité, résidence universitaire et subsistance, plus une allocation d'installation",
description: "Le candidat ET ses parents doivent être de nationalité étrangère. Anglais TOEFL iBT 79 minimum, avec dispense pour les diplômés d'universités anglophones.",
status: "Ouverte"
}
},
{
universityId: "korea-national-university-of-arts-seoul",
scholarshipId: "ama-plus-scholarship",
expectTitle: "ama+ scholarship",
data: {
level: "Licence / Master",
deadline: "Rythme constaté : candidature fin mars, résultats fin avril, test de coréen début mai, entretiens en juin, arrivée fin août",
applicationUrl: "https://www.karts.ac.kr/en/karts/ama.do",
language: "Coréen / Anglais selon le département",
duration: "Durée du cursus, plus 6 mois de coréen intensif",
coverage: "Scolarité intégrale, 800 000 KRW/mois, installation, prime de coréen, mémoire, billet d'avion, assurance",
description: "Le candidat ET ses deux parents doivent être ressortissants d'un pays de la liste CAD de l'OCDE — le Sénégal y figure. Portfolio exigé selon le département.",
status: "Fermée"
}
},
{
universityId: "koc-university-istanbul",
scholarshipId: "koc-university-merit-scholarships",
expectTitle: "university merit scholarships",
data: {
level: "Licence / Master / Doctorat",
deadline: "Dates 2026-2027 non publiées — la décision de bourse accompagne la lettre d'admission",
applicationUrl: "https://international.ku.edu.tr/scholarships/",
language: "Anglais",
duration: "Durée du cursus",
coverage: "Exonération de 25 à 100 % en licence ; bourse complète en doctorat, pouvant inclure logement et subsistance",
description: "Attribuée automatiquement à l'examen du dossier, sans candidature distincte et sans recours possible. Médecine et masters sans thèse exclus.",
status: "Ouverte"
}
},
{
universityId: "sabanci-university-istanbul",
scholarshipId: "sabanci-graduate-scholarships",
expectTitle: "university graduate scholarships",
data: {
level: "Master / Doctorat",
deadline: "Dates 2026-2027 non publiées — la décision est prise par le jury d'admission pendant l'évaluation",
applicationUrl: "https://www.sabanciuniv.edu/en/graduate-scholarships",
language: "Anglais",
duration: "Durée du cursus",
coverage: "Exonération totale des frais, plus 43 500 à 135 000 TL/an selon la formule, résidence gratuite, transport, assurance, ordinateur",
description: "Le financement de troisième cycle le plus élevé de Turquie sur source officielle. Ni billet d'avion ni cours de turc.",
status: "Ouverte"
}
},
{
universityId: "bilkent-university-ankara",
scholarshipId: "bilkent-international-scholarships",
expectTitle: "bilkent",
data: {
level: "Licence",
deadline: "Dates non publiées — évaluation sur dossier au moment de l'admission",
applicationUrl: "https://w3.bilkent.edu.tr/international/scholarships-for-international-students/",
language: "Anglais",
duration: "Jusqu'à 4 semestres de préparatoire d'anglais et 10 semestres de licence",
coverage: "Exonération de 20 à 100 % des frais ; bourse de logement pour un nombre limité des boursiers à 100 %",
description: "AUCUNE allocation mensuelle pour les internationaux — la bourse « Comprehensive » qui en comporte une est réservée aux nationaux turcs. Maintien conditionné à une moyenne de 2,00/4,00.",
status: "Ouverte"
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

let lastPlan = null;

const analyzeBtn = document.getElementById("analyzeBtn");
const analyzeLog = document.getElementById("analyzeLog");
const writeBtn = document.getElementById("writeBtn");
const writeLog = document.getElementById("writeLog");
const verifyBtn = document.getElementById("verifyBtn");
const verifyLog = document.getElementById("verifyLog");

// ==========================================================
// Étape 1 — analyse (lecture seule)
// ==========================================================

analyzeBtn.addEventListener("click", async () => {

analyzeBtn.disabled = true;
analyzeLog.innerHTML = "";
lastPlan = null;

try {

let blocking = false;

// --- 1a. Les 8 bourses cibles existent-elles, avec le bon titre ?
log(analyzeLog, "Vérification des 8 bourses créées par le lot 19...");

for (const l of LINKS) {
const snap = await getDoc(doc(db, "scholarships", l.scholarshipId));
if (!snap.exists()) {
log(analyzeLog, `ERREUR : bourse "${l.scholarshipId}" absente — le lot 19 a-t-il bien été exécuté ?`, "err");
blocking = true;
continue;
}
const titre = snap.data().title || "";
if (!normalize(titre).includes(normalize(l.expectTitle))) {
log(analyzeLog, `ERREUR : "${l.scholarshipId}" existe mais son titre ("${titre}") ne contient pas "${l.expectTitle}".`, "err");
blocking = true;
continue;
}
log(analyzeLog, `  ${l.scholarshipId} — "${titre}"`, "ok");
}

// --- 1b. Les 7 identifiants d'université sont-ils libres ?
const universitiesSnap = await getDocs(collection(db, "universities"));
const universities = universitiesSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
const existingIds = new Set(universities.map((u) => u.id));

log(analyzeLog, "");
const uniCollisions = UNIVERSITIES.filter((u) => existingIds.has(u.id));
if (uniCollisions.length) {
log(analyzeLog, `${uniCollisions.length} identifiant(s) d'université déjà pris :`, "err");
uniCollisions.forEach((u) => log(analyzeLog, `  - ${u.id}`, "err"));
blocking = true;
} else {
log(analyzeLog, `${UNIVERSITIES.length}/${UNIVERSITIES.length} identifiants d'université libres.`, "ok");
}

// --- 1c. Aucune de ces universités n'existe-t-elle déjà sous un AUTRE
// identifiant ? Une création en double serait invisible ici sans ce test.
log(analyzeLog, "");
log(analyzeLog, "Contrôle anti-doublon par nom (une même université sous un autre id) :");
for (const u of UNIVERSITIES) {
const cle = normalize(u.data.name).split("(")[0].trim();
const proches = universities.filter((x) => normalize(x.name).includes(cle) || cle.includes(normalize(x.name)));
if (proches.length) {
log(analyzeLog, `  ATTENTION : "${u.data.name}" ressemble à ${proches.map((p) => `${p.id} ("${p.name}")`).join(", ")}`, "warn");
}
}

// --- 1d. Règle du lot 11 : une photo par université, jamais partagée.
log(analyzeLog, "");
const imagesUtilisees = new Map();
universities.forEach((u) => { if (u.image) imagesUtilisees.set(u.image, u.name); });
let conflitPhoto = false;
for (const u of UNIVERSITIES) {
if (imagesUtilisees.has(u.data.image)) {
log(analyzeLog, `ERREUR : la photo "${u.data.image}" est déjà utilisée par "${imagesUtilisees.get(u.data.image)}" — règle du lot 11 violée.`, "err");
conflitPhoto = true;
blocking = true;
}
}
if (!conflitPhoto) log(analyzeLog, "Les 7 photos sont neuves — aucune n'est déjà utilisée par une autre université.", "ok");

// --- 1e. Les 8 identifiants de programme sont-ils libres ?
const programsSnap = await getDocs(collection(db, "programs"));
const existingProgramIds = new Set(programsSnap.docs.map((d) => d.id));
const programs = LINKS.map((l) => ({
id: `${l.universityId}__${l.scholarshipId}`,
data: { universityId: l.universityId, scholarshipId: l.scholarshipId, isActive: true, ...l.data }
}));
const progCollisions = programs.filter((p) => existingProgramIds.has(p.id));

log(analyzeLog, "");
if (progCollisions.length) {
log(analyzeLog, `${progCollisions.length} identifiant(s) de programme déjà pris :`, "err");
progCollisions.forEach((p) => log(analyzeLog, `  - ${p.id}`, "err"));
blocking = true;
} else {
log(analyzeLog, `${programs.length}/${programs.length} identifiants de programme libres.`, "ok");
}

if (blocking) {
log(analyzeLog, "");
log(analyzeLog, "Anomalie(s) détectée(s) — corriger avant l'étape 2. Aucune écriture n'a eu lieu.", "err");
return;
}

lastPlan = { programs };
log(analyzeLog, "");
log(analyzeLog, `Plan prêt : ${UNIVERSITIES.length} universités et ${programs.length} programmes à créer.`, "ok");
log(analyzeLog, "RAPPEL : le script scripts\\add-lot22-city-photos.ps1 doit avoir été lancé AVANT, sinon les 7 fiches s'afficheront avec l'image de repli.", "warn");
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

log(writeLog, `Création de ${UNIVERSITIES.length} universités...`);
for (const u of UNIVERSITIES) {
await setDoc(doc(db, "universities", u.id), u.data, { merge: true });
log(writeLog, `  ${u.id}`, "ok");
}

log(writeLog, "");
log(writeLog, `Création de ${lastPlan.programs.length} programmes...`);
for (const p of lastPlan.programs) {
await setDoc(doc(db, "programs", p.id), p.data, { merge: true });
log(writeLog, `  ${p.id}`, "ok");
}

log(writeLog, "");
log(writeLog, `${UNIVERSITIES.length + lastPlan.programs.length} documents écrits. Lancer l'étape 3.`, "ok");
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

function sameValue(a, b) {
if (Array.isArray(a) && Array.isArray(b)) return a.length === b.length && a.every((v, i) => v === b[i]);
return a === b;
}

verifyBtn.addEventListener("click", async () => {

if (!lastPlan) {
log(verifyLog, "Lancer les étapes 1 et 2 d'abord.", "err");
return;
}

verifyBtn.disabled = true;
verifyLog.innerHTML = "";

try {

let checked = 0;
let ecarts = 0;

const check = async (coll, id, expected, label) => {
const snap = await getDoc(doc(db, coll, id));
checked++;
if (!snap.exists()) {
log(verifyLog, `MANQUANT : ${coll}/${id}`, "err");
ecarts++;
return;
}
const actual = snap.data();
const bad = Object.keys(expected).filter((k) => !sameValue(actual[k], expected[k]));
if (bad.length) {
log(verifyLog, `ÉCART : ${coll}/${id} — champ(s) ${bad.join(", ")}`, "err");
bad.forEach((k) => {
log(verifyLog, `    attendu : ${JSON.stringify(expected[k])}`, "err");
log(verifyLog, `    en base : ${JSON.stringify(actual[k])}`, "err");
});
ecarts++;
} else {
log(verifyLog, `OK ${label} ${id}`, "ok");
}
};

log(verifyLog, "Relecture des universités créées...");
for (const u of UNIVERSITIES) await check("universities", u.id, u.data, "université");

log(verifyLog, "");
log(verifyLog, "Relecture des programmes créés...");
for (const p of lastPlan.programs) await check("programs", p.id, p.data, "programme");

log(verifyLog, "");
if (ecarts === 0) {
log(verifyLog, `${checked}/${checked} documents conformes, 0 écart. Lot 22 terminé.`, "ok");
log(verifyLog, "Ouvre universities.html et vérifie que les 7 nouvelles fiches affichent bien LEUR photo, et non l'image de repli.", "warn");
} else {
log(verifyLog, `${ecarts} écart(s) sur ${checked} documents — NE PAS considérer le lot comme terminé.`, "err");
}

} catch (err) {
log(verifyLog, `ERREUR : ${err.message}`, "err");
} finally {
verifyBtn.disabled = false;
}

});
