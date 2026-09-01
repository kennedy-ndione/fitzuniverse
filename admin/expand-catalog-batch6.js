// ============================================================
// ScholarBridge — Élargissement du catalogue, Lot 6 (2026-08-28)
// Débloque les DEUX stubs laissés en attente au lot 4 (voir
// expand-catalog-batch4.js, lignes 24-28) : ils existaient sans
// université ni programme rattaché, faute de photo de ville en stock.
//
// - Mastercard Foundation Scholars @ UM6P (Benguerir, Maroc)
// - ARES @ UCLouvain (Louvain-la-Neuve, Belgique)
//
// Même patron que expand-catalog-batch1.js à batch5.js :
// analyse en lecture seule -> écriture -> vérification automatique.
//
// CE QUI CHANGE PAR RAPPORT AUX LOTS PRÉCÉDENTS
// ---------------------------------------------
// Aucune bourse n'est CRÉÉE ce lot-ci : les deux existent déjà. Une
// seule est MISE À JOUR (voir SCHOLARSHIP_UPDATES plus bas), et
// l'analyse attend donc l'inverse de d'habitude pour elle — son id
// DOIT déjà exister, une absence est l'anomalie. SCHOLARSHIPS reste
// présent mais vide, pour garder la structure des cinq lots
// précédents plutôt que supprimer une section et rendre les six
// fichiers non comparables entre eux.
//
// Seul generalCriteria est réécrit sur la bourse UM6P, via un merge :
// title/funding/description/status/isActive/levels/officialWebsite
// sont laissés intacts. La phrase retirée ("Stub volontaire : aucune
// université ni aucun programme reliés ce lot-ci...") devient fausse
// à la seconde où le programme ci-dessous est écrit.
//
// bourses-formations-internationales-ares n'est PAS touchée : rien
// dans son document ne mentionne un statut de stub.
//
// PHOTOS DE VILLE (l'étape qui bloquait le lot 4)
// -----------------------------------------------
// assets/images/cities/benguerir.jpg et louvainlaneuve.jpg créées
// dans ce lot, + déclinaisons -400w/-800w/-1200w/-1600w. Les deux
// sont sous CC BY-SA 4.0, donc créditées dans CREDITS.md — première
// fois que des photos de assets/images/cities/ exigent une
// attribution depuis Amsterdam et Delft.
//
// Aucun drapeau à créer : ma.svg et be.svg existent depuis le lot 4.
//
// COUVERTURE DES SOURCES
// ----------------------
// UM6P : en.wikipedia.org/wiki/University_Mohammed_VI_Polytechnic +
// um6p.ma. Aucun classement QS trouvé pour cet établissement, d'où un
// "ranking" en Times Higher Education — le champ est du texte libre
// dans tout le catalogue, on n'invente pas un rang QS pour la forme.
//
// UCLouvain : la date de fondation est contestée selon les sources
// (1425 pour la racine médiévale commune avec KU Leuven, 1834 pour la
// réorganisation post-indépendance belge). La description contourne
// le problème en datant ce qui n'est pas contesté — 1425 comme racine
// commune, 1970 comme installation à Louvain-la-Neuve après la
// scission linguistique de 1968 — plutôt que de trancher une
// "fondation" unique qui serait fausse pour la moitié des lecteurs.
// ============================================================

import { db } from "../firebase-config.js";

import {
collection,
getDocs,
getDoc,
doc,
setDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// -------- Universités (2) --------
const UNIVERSITIES = [
{
id: "universite-mohammed-vi-polytechnique-benguerir",
data: {
name: "Université Mohammed VI Polytechnique (UM6P)",
city: "Benguerir",
country: "Maroc",
image: "benguerir.jpg",
flag: "ma.svg",
ranking: "Top 400 mondial (Times Higher Education 2026)",
description: "Université privée à but non lucratif fondée en 2013, inaugurée en 2017, spécialisée en recherche (ingénierie, sciences, gouvernance) — campus principal à Benguerir, près de Marrakech.",
officialWebsite: "https://um6p.ma/",
applicationPortalUrl: "https://mastercardfdn.org/en/what-we-do/our-programs/mastercard-foundation-scholars-program/where-to-apply/universite-mohammed-vi-polytechnique/",
fields: []
}
},
{
id: "uclouvain-louvain-la-neuve",
data: {
name: "UCLouvain (Université catholique de Louvain)",
city: "Louvain-la-Neuve",
country: "Belgique",
image: "louvainlaneuve.jpg",
flag: "be.svg",
ranking: "Plus grande université francophone de Belgique",
description: "Descend de l'université de Louvain fondée en 1425 ; sa branche francophone s'installe à Louvain-la-Neuve en 1970 après la scission linguistique de 1968 (la branche néerlandophone reste à Louvain sous le nom KU Leuven, déjà partenaire du catalogue). Environ 27 000 étudiants de plus de 120 nationalités.",
officialWebsite: "https://www.uclouvain.be/",
applicationPortalUrl: "https://www.ares-ac.be/fr/bourses-de-formations-internationales-2027-2028",
fields: []
}
}
];

// -------- Bourses créées (0) --------
// Volontairement vide : les deux bourses de ce lot existent déjà
// depuis le lot 4. Voir SCHOLARSHIP_UPDATES juste en dessous.
const SCHOLARSHIPS = [];

// -------- Bourses mises à jour (1) --------
// Écrites avec { merge: true } : seules les clés listées dans "data"
// sont touchées, tout le reste du document est conservé tel quel.
// "before" n'est pas utilisé pour écrire — il sert à l'étape 1, qui
// vérifie que le document contient bien la valeur attendue AVANT
// modification, et prévient si ce n'est pas le cas (document déjà
// modifié à la main, ou lot déjà passé).
const SCHOLARSHIP_UPDATES = [
{
id: "mastercard-foundation-scholars-um6p",
before: {
generalCriteria: "Stub volontaire : aucune université ni aucun programme reliés ce lot-ci (UM6P/Benguerir n'a pas encore de photo de ville en stock). Réservé aux jeunes femmes africaines, priorité rural/réfugiées/mères/situation de handicap."
},
data: {
generalCriteria: "Réservé aux jeunes femmes africaines, priorité rural/réfugiées/mères/situation de handicap."
}
}
];

// -------- Programmes (2) --------
const PROGRAMS = [
{
id: "universite-mohammed-vi-polytechnique-benguerir__mastercard-foundation-scholars-um6p",
data: {
universityId: "universite-mohammed-vi-polytechnique-benguerir",
scholarshipId: "mastercard-foundation-scholars-um6p",
level: "Licence / Master",
deadline: "Non communiquée publiquement — cycle annuel, vérifier sur mastercardfdn.org",
applicationUrl: "https://mastercardfdn.org/en/what-we-do/our-programs/mastercard-foundation-scholars-program/where-to-apply/universite-mohammed-vi-polytechnique/",
language: "Anglais",
duration: "Variable selon le programme",
coverage: "100% (scolarité + logement + vie courante + assurance + billet d'avion annuel)",
description: "Réservé aux jeunes femmes africaines, priorité aux profils ruraux, réfugiées, mères ou en situation de handicap. Statut confirmé actif au 28/08/2026, aucune date limite publiée — vérifier le calendrier de la cohorte en cours sur mastercardfdn.org avant de candidater.",
status: "Ouverte",
isActive: true
}
},
{
id: "uclouvain-louvain-la-neuve__bourses-formations-internationales-ares",
data: {
universityId: "uclouvain-louvain-la-neuve",
scholarshipId: "bourses-formations-internationales-ares",
level: "Licence / Master",
deadline: "18 septembre 2026, 12h00 (candidature 2027-2028)",
applicationUrl: "https://www.ares-ac.be/fr/bourses-de-formations-internationales-2027-2028",
language: "Français",
duration: "Variable selon la formation du catalogue",
coverage: "Frais d'inscription + indemnité mensuelle + billet d'avion + assurance santé/rapatriement",
description: "ARES finance un catalogue fixe de formations spécialisées nommées (pas un master au choix) — consultez ares-ac.be pour vérifier qu'une formation précise de l'UCLouvain y figure avant de candidater. Aucune formation UCLouvain nommément confirmée dans le catalogue 2027-2028 à ce jour — même réserve que pour ULB/ULiège/UNamur au lot 4.",
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
log(analyzeLog, `${UNIVERSITIES.length}/2 identifiants d'université libres.`, "ok");
}

const scholarshipsSnap = await getDocs(collection(db, "scholarships"));
const existingScholarshipIds = new Set(scholarshipsSnap.docs.map((d) => d.id));

const scholarshipCollisions = SCHOLARSHIPS.filter((s) => existingScholarshipIds.has(s.id));

if (scholarshipCollisions.length) {
log(analyzeLog, `${scholarshipCollisions.length} id(s) de bourse collisionnent déjà avec un document existant :`, "err");
scholarshipCollisions.forEach((s) => log(analyzeLog, `  - ${s.id}`, "err"));
} else {
log(analyzeLog, `${SCHOLARSHIPS.length}/0 bourse créée ce lot-ci (les deux existent depuis le lot 4).`, "ok");
}

// Mises à jour : logique INVERSE des créations — le document doit
// exister, et son contenu actuel doit être celui qu'on croit.
let updateIssues = 0;

for (const s of SCHOLARSHIP_UPDATES) {

if (!existingScholarshipIds.has(s.id)) {
log(analyzeLog, `Bourse à mettre à jour INTROUVABLE : ${s.id} — le lot 4 doit avoir été passé avant celui-ci.`, "err");
updateIssues++;
continue;
}

const snap = await getDoc(doc(db, "scholarships", s.id));
const current = snap.data();

const alreadyDone = Object.keys(s.data).every((key) => JSON.stringify(current[key]) === JSON.stringify(s.data[key]));

if (alreadyDone) {
log(analyzeLog, `${s.id} : déjà à jour (lot 6 probablement déjà passé) — l'écriture sera sans effet, pas une erreur.`, "ok");
continue;
}

const matchesBefore = Object.keys(s.before).every((key) => JSON.stringify(current[key]) === JSON.stringify(s.before[key]));

if (matchesBefore) {
log(analyzeLog, `${s.id} : valeur actuelle conforme à l'attendu, prête à être mise à jour.`, "ok");
} else {
log(analyzeLog, `${s.id} : le champ generalCriteria en base ne correspond ni à l'avant ni à l'après attendus — modifié à la main ? Écriture bloquée.`, "err");
Object.keys(s.before).forEach((key) => {
log(analyzeLog, `    en base : ${JSON.stringify(current[key])}`, "err");
log(analyzeLog, `    attendu : ${JSON.stringify(s.before[key])}`, "err");
});
updateIssues++;
}

}

const programsSnap = await getDocs(collection(db, "programs"));
const existingProgramIds = new Set(programsSnap.docs.map((d) => d.id));

const programCollisions = PROGRAMS.filter((p) => existingProgramIds.has(p.id));

if (programCollisions.length) {
log(analyzeLog, `${programCollisions.length} id(s) de programme collisionnent déjà avec un document existant :`, "err");
programCollisions.forEach((p) => log(analyzeLog, `  - ${p.id}`, "err"));
} else {
log(analyzeLog, `${PROGRAMS.length}/2 identifiants de programme libres.`, "ok");
}

// Les programmes pointent vers des bourses qui ne sont PAS créées ce
// lot-ci : on vérifie donc que leurs cibles existent réellement,
// sans quoi on écrirait des liens vers le vide.
const missingTargets = PROGRAMS.filter((p) => !existingScholarshipIds.has(p.data.scholarshipId));

if (missingTargets.length) {
log(analyzeLog, `${missingTargets.length} programme(s) pointent vers une bourse inexistante :`, "err");
missingTargets.forEach((p) => log(analyzeLog, `  - ${p.id} -> ${p.data.scholarshipId}`, "err"));
} else {
log(analyzeLog, "Les 2 bourses ciblées par les programmes existent bien en base.", "ok");
}

const hasBlockingIssue = universityCollisions.length || scholarshipCollisions.length || programCollisions.length || updateIssues || missingTargets.length;

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
`Créer ${UNIVERSITIES.length} université(s) et ${PROGRAMS.length} programme(s), et mettre à jour ${SCHOLARSHIP_UPDATES.length} bourse(s) ? Cette action écrit en base de production.`
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

log(writeLog, "Mise à jour des bourses existantes...");

for (const s of SCHOLARSHIP_UPDATES) {
// merge: true — n'écrase QUE generalCriteria, laisse title,
// funding, description, status, isActive, levels et
// officialWebsite intacts.
await setDoc(doc(db, "scholarships", s.id), s.data, { merge: true });
log(writeLog, `  - ${s.id} : ${Object.keys(s.data).join(", ")} mis à jour.`);
}

log(writeLog, `${SCHOLARSHIP_UPDATES.length} bourse(s) mise(s) à jour, 0 créée.`, "ok");

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
// Étape 3 — vérification automatique. Relit chaque document créé ou
// modifié et compare CHAQUE champ attendu (comparaison de valeur
// exacte), pas un simple "existe".
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

// Pour une mise à jour, on relit DEUX choses : que le champ visé a
// bien la nouvelle valeur, et que la phrase retirée a réellement
// disparu (un merge mal formé pourrait laisser l'ancienne valeur).
for (const s of SCHOLARSHIP_UPDATES) {
const snap = await getDoc(doc(db, "scholarships", s.id));
const current = snap.exists() ? snap.data() : null;
const fieldsMatch = current && Object.keys(s.data).every((key) => JSON.stringify(current[key]) === JSON.stringify(s.data[key]));
const stubGone = current && !String(current.generalCriteria || "").includes("Stub volontaire");
if (fieldsMatch && stubGone) {
ok++;
} else {
mismatch++;
log(verifyLog, `MISMATCH bourse ${s.id} : ${current ? (fieldsMatch ? "mention \"Stub volontaire\" toujours présente" : "champ différent de l'attendu") : "document introuvable"}.`, "err");
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

const total = UNIVERSITIES.length + SCHOLARSHIP_UPDATES.length + PROGRAMS.length;

log(verifyLog, `${ok}/${total} document(s) confirmé(s) en base, champ par champ.`, mismatch === 0 ? "ok" : "err");

if (mismatch === 0) {
log(verifyLog, "ÉCRITURE EN BASE CONFIRMÉE — lot 6 terminé, 0 écart. Les deux stubs du lot 4 sont débloqués.", "ok");
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
