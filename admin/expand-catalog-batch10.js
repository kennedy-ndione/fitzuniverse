// ============================================================
// ScholarBridge — Correctif catalogue, Lot 10 (2026-08-28)
// Ne crée RIEN. Corrige 2 erreurs de données trouvées lors de l'audit
// demandé par l'utilisateur ("vérifie que chaque université a son
// propre lien qui redirige directement vers le portail de l'université
// et non vers le portail de candidature") sur des champs écrits au
// lot 5 (expand-catalog-batch5.js) :
//
// 1. King Saud University (king-saud-university-riyad) :
//    officialWebsite valait "https://dar.ksu.edu.sa/en/overseas" — une
//    page profonde du bureau des inscriptions (Deanship of Admission &
//    Registration, section "overseas"), pas le site général de
//    l'université. Corrigé vers "https://ksu.edu.sa/en", la page
//    d'accueil officielle (confirmée par recherche web, 2026-08-28).
//    applicationPortalUrl ("https://studyinsaudi.sa/en", le portail
//    national) était déjà correct et distinct — non touché.
//
// 2. Istanbul University (istanbul-university-istanbul) :
//    officialWebsite ET applicationPortalUrl valaient tous les deux
//    "https://www.istanbul.edu.tr" — aucune distinction réelle entre
//    site général et portail de candidature pour cette université,
//    contrairement à toutes les autres du catalogue. Corrigé :
//    applicationPortalUrl -> "https://isad.istanbul.edu.tr/en"
//    (İstanbul University International Students Admission — portail
//    dédié aux étudiants internationaux, confirmé par recherche web,
//    2026-08-28). officialWebsite reste "https://www.istanbul.edu.tr",
//    déjà correct.
//
// Comme au lot 8 (leçon tirée de la collision Sciences Po au lot 7) :
// même si ces 2 ids sont connus avec certitude (lus directement dans
// expand-catalog-batch5.js), ils sont re-vérifiés en direct par
// lecture + comparaison de nom avant toute écriture, jamais utilisés
// en dur sans contrôle.
//
// setDoc(..., {merge:true}) : seuls les champs listés sont touchés,
// aucun risque d'écraser un champ non listé (ranking, description,
// fields, etc. restent inchangés).
// ============================================================

import { db } from "../firebase-config.js";

import {
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

// -------- Les 2 universités à corriger, id connu + nom attendu pour
// re-vérification live avant toute écriture --------
const FIXES = [
{
id: "king-saud-university-riyad",
expectedNameIncludes: "king saud",
fields: {
officialWebsite: "https://ksu.edu.sa/en"
},
reason: "officialWebsite pointait vers une page profonde du bureau des inscriptions (dar.ksu.edu.sa/en/overseas), pas la page d'accueil de l'université."
},
{
id: "istanbul-university-istanbul",
expectedNameIncludes: "istanbul university",
fields: {
applicationPortalUrl: "https://isad.istanbul.edu.tr/en"
},
reason: "applicationPortalUrl était identique à officialWebsite (www.istanbul.edu.tr) — aucune distinction entre site général et portail de candidature."
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

try {

log(analyzeLog, "Vérification en direct des 2 documents à corriger...");

const plan = [];
let failed = false;

for (const fix of FIXES) {

const snap = await getDoc(doc(db, "universities", fix.id));

if (!snap.exists()) {
log(analyzeLog, `ERREUR : aucun document "universities/${fix.id}" trouvé. Id peut-être changé depuis le lot 5 — résolution manuelle requise.`, "err");
failed = true;
continue;
}

const current = snap.data();
const name = current.name || "";

if (!normalize(name).includes(fix.expectedNameIncludes)) {
log(analyzeLog, `ERREUR : universities/${fix.id} existe mais son nom ("${name}") ne correspond pas à "${fix.expectedNameIncludes}" — id probablement réutilisé pour une autre université. Résolution manuelle requise, AUCUNE écriture ne sera faite dessus.`, "err");
failed = true;
continue;
}

const changes = [];
let alreadyCorrect = true;

for (const key of Object.keys(fix.fields)) {
const before = current[key] || "";
const after = fix.fields[key];
if (before !== after) {
alreadyCorrect = false;
changes.push({ key, before, after });
}
}

if (alreadyCorrect) {
log(analyzeLog, `"${name}" (${fix.id}) : déjà correct, aucun changement nécessaire (peut-être déjà corrigé manuellement).`, "ok");
continue;
}

log(analyzeLog, `"${name}" (${fix.id}) — ${fix.reason}`, "ok");
changes.forEach((c) => log(analyzeLog, `  ${c.key} : "${c.before}" -> "${c.after}"`, "ok"));

plan.push({ id: fix.id, name, fields: fix.fields });

}

if (failed) {
log(analyzeLog, "Anomalie(s) détectée(s) — corriger avant de passer à l'étape 2.", "err");
return;
}

if (!plan.length) {
log(analyzeLog, "Rien à écrire : les 2 documents sont déjà corrects. Étape 2 inutile.", "ok");
lastPlan = null;
return;
}

lastPlan = plan;

log(analyzeLog, `Analyse terminée, ${plan.length} document(s) à mettre à jour (merge, champs listés seulement).`, "ok");

writeBtn.disabled = false;

} catch (error) {

console.error(error);
log(analyzeLog, `Erreur : ${error.message}`, "err");

} finally {

analyzeBtn.disabled = false;

}

});

// ==========================================================
// Étape 2 — écriture (merge, champs listés seulement)
// ==========================================================

writeBtn.addEventListener("click", async () => {

if (!lastPlan) return;

const confirmed = confirm(
`Corriger ${lastPlan.length} université(s) (mise à jour partielle, merge) ? Cette action écrit en base de production.`
);

if (!confirmed) return;

writeBtn.disabled = true;
writeLog.innerHTML = "";

try {

for (const item of lastPlan) {
await setDoc(doc(db, "universities", item.id), item.fields, { merge: true });
log(writeLog, `"${item.name}" (${item.id}) corrigé(e).`);
}

log(writeLog, `${lastPlan.length} document(s) corrigé(s).`, "ok");
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
// Étape 3 — vérification automatique
// ==========================================================

verifyBtn.addEventListener("click", async () => {

if (!lastPlan) return;

verifyBtn.disabled = true;
verifyLog.innerHTML = "";
log(verifyLog, "Relecture de Firestore après écriture...");

try {

let ok = 0;
let mismatch = 0;

for (const item of lastPlan) {

const snap = await getDoc(doc(db, "universities", item.id));
const current = snap.exists() ? snap.data() : null;
const fieldsMatch = current && Object.keys(item.fields).every((key) => current[key] === item.fields[key]);

if (fieldsMatch) {
ok++;
log(verifyLog, `"${item.name}" (${item.id}) : confirmé.`, "ok");
} else {
mismatch++;
log(verifyLog, `MISMATCH "${item.name}" (${item.id}) : document ${current ? "trouvé mais différent" : "introuvable"}.`, "err");
}

}

log(verifyLog, `${ok}/${lastPlan.length} document(s) confirmé(s) en base, champ par champ.`, mismatch === 0 ? "ok" : "err");

if (mismatch === 0) {
log(verifyLog, "ÉCRITURE EN BASE CONFIRMÉE — lot 10 terminé, 0 écart.", "ok");
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
