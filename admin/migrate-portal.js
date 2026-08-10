// ============================================================
// ScholarBridge — Migration "portail de candidature par défaut"
// (2026-08-10). Voir l'audit complet dans la conversation associée :
// 35 universités sur 36 ont EXACTEMENT la même applicationUrl sur
// tous leurs programmes (donnée dupliquée par nécessité du modèle
// actuel, pas par choix), 1 (Politecnico di Milano) a un portail PhD
// distinct du portail Licence/Master. Cette migration fait remonter
// la valeur commune vers universities.applicationPortalUrl (nouveau
// champ) et ne laisse programs.applicationUrl rempli que pour les
// vraies exceptions (override).
//
// Même patron que migrate.js (2026-07-30) : analyse en lecture seule
// -> confirmation explicite -> écriture -> vérification automatique.
// Outil à usage unique, non lié dans la navigation, protégé par
// admin-auth.js comme toute page admin/.
// ============================================================

import { db } from "../firebase-config.js";

import {
collection,
getDocs,
doc,
updateDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

function log(el, message, cls = "") {
el.classList.add("is-visible");
const line = document.createElement("div");
if (cls) line.className = cls;
line.textContent = message;
el.appendChild(line);
el.scrollTop = el.scrollHeight;
}

// ==========================================================
// Calcul (partagé entre l'analyse et l'écriture, pour qu'elles ne
// puissent jamais diverger — même principe que migrate.js).
// ==========================================================

// Valeur majoritaire parmi les applicationUrl non vides d'une
// université. Un champ vide ne doit jamais "gagner" face à une vraie
// URL : il est exclu du décompte, pas traité comme une valeur candidate.
function majorityUrl(programs) {

const counts = new Map();

programs.forEach((p) => {
const url = (p.applicationUrl || "").trim();
if (!url) return;
counts.set(url, (counts.get(url) || 0) + 1);
});

if (counts.size === 0) return { value: "", count: 0, tie: false };

const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
const [topUrl, topCount] = sorted[0];

// Égalité parfaite (ex. 2 programmes, 2 URL différentes, aucune
// majorité) : signalé comme anomalie plutôt que de choisir au hasard.
const tie = sorted.length > 1 && sorted[1][1] === topCount;

return { value: topUrl, count: topCount, tie };

}

async function computePlan() {

const [universitiesSnap, programsSnap] = await Promise.all([
getDocs(collection(db, "universities")),
getDocs(collection(db, "programs"))
]);

const universities = universitiesSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
const programs = programsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

const programsByUni = new Map();

programs.forEach((p) => {
const key = p.universityId || "NONE";
if (!programsByUni.has(key)) programsByUni.set(key, []);
programsByUni.get(key).push(p);
});

// Snapshot AVANT migration — valeur brute de chaque programme
// aujourd'hui (tout vit au niveau programme). Référence de
// non-régression pour la Phase 3, comparée après écriture.
const beforeSnapshot = new Map(programs.map((p) => [p.id, (p.applicationUrl || "").trim()]));

const universityUpdates = [];
const programOverrides = [];
const programsToClear = [];
const anomalies = [];

universities.forEach((u) => {

const progs = programsByUni.get(u.id) || [];
const name = u.name || u.id;

if (!progs.length) {
anomalies.push({ type: "no-programs", university: name, detail: `Aucun programme rattaché à ${u.id} — ignorée, aucune écriture.` });
return;
}

const { value, tie } = majorityUrl(progs);

if (tie) {
anomalies.push({
type: "tie",
university: name,
detail: `Égalité parfaite entre plusieurs applicationUrl (${progs.map((p) => `${p.id}:"${p.applicationUrl || ""}"`).join(", ")}) — aucune majorité, décision manuelle requise. Université ignorée, AUCUNE écriture (ni applicationPortalUrl, ni programmes touchés).`
});
return;

}

if (!value) {
anomalies.push({ type: "all-empty", university: name, detail: `Tous les programmes de ${name} ont applicationUrl vide — rien à remonter. Université ignorée.` });
return;
}

universityUpdates.push({ id: u.id, name, applicationPortalUrl: value, programCount: progs.length });

progs.forEach((p) => {

const current = (p.applicationUrl || "").trim();

if (current === value) {
// Correspond au défaut : le champ programme devient redondant,
// vidé pour que l'override redevienne un signal fiable (présent
// = vraie exception, absent = hérite du défaut).
programsToClear.push({ id: p.id, university: name, level: p.level || "", previousValue: current });
} else if (current) {
// Diffère du défaut ET non vide : override réel, jamais touché.
programOverrides.push({ id: p.id, university: name, level: p.level || "", value: current });
}
// current vide : rien à clear (déjà vide), pas un override — après
// migration ce programme héritera du défaut université, ce qui est
// une amélioration (il n'affichait rien avant), pas une perte.

});

});

return { universities, programs, universityUpdates, programOverrides, programsToClear, anomalies, beforeSnapshot };

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
log(analyzeLog, "Lecture de universities / programs...");

try {

lastPlan = await computePlan();

log(analyzeLog, `${lastPlan.universities.length} universités, ${lastPlan.programs.length} programmes lus.`, "ok");
log(analyzeLog, `${lastPlan.universityUpdates.length} université(s) recevront applicationPortalUrl :`, "ok");

lastPlan.universityUpdates.forEach((u) => {
log(analyzeLog, `  - ${u.name} (${u.id}) -> "${u.applicationPortalUrl}" (${u.programCount} programme(s))`);
});

log(analyzeLog, `${lastPlan.programsToClear.length} programme(s) verront applicationUrl vidé (redondant avec le défaut université).`, "ok");
log(analyzeLog, `${lastPlan.programOverrides.length} override(s) réel(s) conservé(s) tel quel :`, lastPlan.programOverrides.length ? "warn" : "ok");

lastPlan.programOverrides.forEach((o) => {
log(analyzeLog, `  - ${o.university} / ${o.id} (${o.level || "niveau ?"}) : "${o.value}"`, "warn");
});

if (lastPlan.anomalies.length) {
log(analyzeLog, `${lastPlan.anomalies.length} anomalie(s) — université(s) IGNORÉE(S), aucune écriture pour elles :`, "err");
lastPlan.anomalies.forEach((a) => log(analyzeLog, `  - [${a.type}] ${a.detail}`, "err"));
} else {
log(analyzeLog, "Aucune anomalie détectée.", "ok");
}

log(analyzeLog, "Analyse terminée. Vérifiez le détail ci-dessus avant de passer à l'étape 2.", "ok");

writeBtn.disabled = false;

} catch (error) {

console.error(error);
log(analyzeLog, `Erreur : ${error.message}`, "err");

} finally {

analyzeBtn.disabled = false;

}

});

// ==========================================================
// Étape 2 — écriture (après confirmation explicite)
// ==========================================================

writeBtn.addEventListener("click", async () => {

if (!lastPlan) return;

const confirmed = confirm(
`Écrire applicationPortalUrl sur ${lastPlan.universityUpdates.length} université(s) et vider applicationUrl sur ${lastPlan.programsToClear.length} programme(s) ? ${lastPlan.programOverrides.length} override(s) resteront inchangé(s). ${lastPlan.anomalies.length} université(s) ignorée(s) (voir le rapport).`
);

if (!confirmed) return;

writeBtn.disabled = true;
writeLog.innerHTML = "";

try {

log(writeLog, "Écriture de universities.applicationPortalUrl...");

for (const u of lastPlan.universityUpdates) {
await updateDoc(doc(db, "universities", u.id), { applicationPortalUrl: u.applicationPortalUrl });
log(writeLog, `  - ${u.name} (${u.id}) écrit.`);
}

log(writeLog, `${lastPlan.universityUpdates.length} université(s) mise(s) à jour.`, "ok");

log(writeLog, "Vidage de programs.applicationUrl (programmes redondants avec le défaut)...");

for (const p of lastPlan.programsToClear) {
await updateDoc(doc(db, "programs", p.id), { applicationUrl: "" });
log(writeLog, `  - ${p.university} / ${p.id} vidé (était "${p.previousValue}").`);
}

log(writeLog, `${lastPlan.programsToClear.length} programme(s) vidé(s). Les ${lastPlan.programOverrides.length} override(s) n'ont pas été touchés.`, "ok");
log(writeLog, "Étape 2 terminée. Lancez l'étape 3 pour vérifier automatiquement qu'aucune donnée n'a été perdue.", "ok");

verifyBtn.disabled = false;

} catch (error) {

console.error(error);
log(writeLog, `Erreur : ${error.message}`, "err");

} finally {

writeBtn.disabled = false;

}

});

// ==========================================================
// Étape 3 — vérification automatique post-migration. Compare, pour
// chaque programme, la valeur EFFECTIVE nouvelle
// (program.applicationUrl || university.applicationPortalUrl) à la
// valeur brute d'AVANT migration (lastPlan.beforeSnapshot). Un
// programme qui avait déjà une vraie valeur avant doit retrouver
// EXACTEMENT la même après — 0 tolérance. Un programme qui était vide
// avant peut désormais hériter du défaut université : ce n'est pas un
// échec, c'est le comportement voulu (il n'affichait rien avant).
// ==========================================================

verifyBtn.addEventListener("click", async () => {

if (!lastPlan) return;

verifyBtn.disabled = true;
verifyLog.innerHTML = "";
log(verifyLog, "Relecture de universities / programs après écriture...");

try {

const [universitiesSnap, programsSnap] = await Promise.all([
getDocs(collection(db, "universities")),
getDocs(collection(db, "programs"))
]);

const universitiesById = new Map(universitiesSnap.docs.map((d) => [d.id, d.data()]));
const programs = programsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

let unchanged = 0;
let filledFromEmpty = 0;
let mismatches = 0;

programs.forEach((p) => {

const before = lastPlan.beforeSnapshot.get(p.id);

// Programme apparu après l'analyse (improbable en usage normal,
// mais on ne suppose rien) : hors périmètre de cette vérification.
if (before === undefined) return;

const university = universitiesById.get(p.universityId) || {};
const after = (p.applicationUrl || "").trim() || (university.applicationPortalUrl || "").trim();

if (before) {

if (after === before) {
unchanged++;
} else {
mismatches++;
log(verifyLog, `MISMATCH ${p.id} (${university.name || p.universityId}) : avant="${before}" après="${after}"`, "err");
}

} else if (after) {
filledFromEmpty++;
} else {
unchanged++; // vide avant, vide après (université ignorée en anomalie)
}

});

log(verifyLog, `${unchanged} programme(s) inchangé(s), ${filledFromEmpty} programme(s) désormais pourvus (héritent du défaut, étaient vides avant).`, "ok");

if (mismatches === 0) {
log(verifyLog, `Vérification réussie : ${programs.length} programme(s) contrôlés, 0 perte de données.`, "ok");
} else {
log(verifyLog, `ÉCHEC : ${mismatches} programme(s) ont une valeur effective différente d'avant migration — voir le détail ci-dessus.`, "err");
}

} catch (error) {

console.error(error);
log(verifyLog, `Erreur : ${error.message}`, "err");

} finally {

verifyBtn.disabled = false;

}

});
