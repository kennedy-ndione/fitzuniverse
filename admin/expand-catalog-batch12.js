// ============================================================
// ScholarBridge — Correctif catalogue, Lot 12 (2026-08-28)
// Corrige 2 vrais doublons d'université trouvés par l'audit étendu
// (admin/audit-catalog.html, section "Photos partagées") :
//
// - "Peking University" existe en DEUX documents distincts :
//   peking-university-pekin (préexistant, rattaché à Chinese
//   Government Scholarship) et peking-university-beijing (créé par
//   erreur au lot 8, rattaché à Beijing Government Scholarship, sans
//   vérifier que Peking University existait déjà sous un autre id).
// - Même bug pour "Nanjing University" :
//   nanjing-university-nankin (préexistant, Chinese Government
//   Scholarship) et nanjing-university-nanjing (créé au lot 8,
//   Nanjing Government Scholarship).
//
// Ce n'est PAS juste une photo partagée (voir lot 13 pour ça) : c'est
// la MÊME université réelle sous deux fiches Firestore différentes,
// donc deux pages université distinctes pour un seul établissement.
// Correctif : garder UN seul document par université (celui dont l'id
// utilise l'orthographe anglaise/pinyin — "beijing"/"nanjing" — déjà
// utilisée partout ailleurs dans le catalogue pour cette ville :
// beijing.jpg, nanjing.jpg, etc. — plutôt que l'orthographe française
// "pekin"/"nankin", un résidu isolé d'une convention antérieure),
// migrer le programme de l'autre bourse vers ce document unique, puis
// supprimer le document et le programme devenus redondants.
//
// Corrige aussi Politecnico di Milano : officialWebsite et
// applicationPortalUrl étaient identiques (polimi.it/en) — même bug
// que King Saud/Istanbul University (lots 10). applicationPortalUrl
// pointe désormais vers la page "Scholarships" dédiée (vérifiée par
// recherche web, 2026-08-28).
//
// PREMIER lot de cette session à supprimer des documents (deleteDoc).
// Étape d'analyse volontairement très explicite : montre EXACTEMENT
// quel document sera supprimé, lequel sera créé, et bloque sur la
// moindre ambiguïté (nom qui ne correspond pas, id introuvable,
// nombre de documents inattendu, collision avec un programme
// existant) plutôt que de deviner.
// ============================================================

import { db } from "../firebase-config.js";

import {
collection,
getDocs,
getDoc,
doc,
setDoc,
deleteDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

function normalize(str) {
return String(str || "")
.normalize("NFD")
.replace(/[̀-ͯ]/g, "")
.toLowerCase()
.trim();
}

// -------- Les 2 paires à fusionner --------
const MERGE_PAIRS = [
{
key: "peking",
label: "Peking University",
match: (name) => normalize(name) === "peking university",
winnerSuffix: "-beijing",
loserSuffix: "-pekin"
},
{
key: "nanjing",
label: "Nanjing University",
match: (name) => normalize(name).includes("nanjing university"),
winnerSuffix: "-nanjing",
loserSuffix: "-nankin"
}
];

// -------- Politecnico di Milano : correctif de lien --------
const POLIMI_FIX = {
id: "politecnico-di-milano-milan",
expectedNameIncludes: "politecnico di milano",
fields: {
applicationPortalUrl: "https://www.polimi.it/en/prospective-students/how-much-does-it-cost/scholarships"
},
reason: "applicationPortalUrl était identique à officialWebsite (polimi.it/en) — aucune distinction réelle."
};

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

log(analyzeLog, "Lecture des universités et programmes...");

const [universitiesSnap, programsSnap] = await Promise.all([
getDocs(collection(db, "universities")),
getDocs(collection(db, "programs"))
]);

const universities = universitiesSnap.docs.map((d) => ({ id: d.id, data: d.data() }));
const programs = programsSnap.docs.map((d) => ({ id: d.id, data: d.data() }));

log(analyzeLog, `${universities.length} université(s), ${programs.length} programme(s) lus.`, "ok");

const mergePlans = [];
let failed = false;

for (const pair of MERGE_PAIRS) {

const matches = universities.filter((u) => pair.match(u.data.name));

if (matches.length !== 2) {
log(analyzeLog, `ERREUR : ${matches.length} document(s) trouvé(s) pour "${pair.label}" (2 attendus). Résolution manuelle requise.`, "err");
matches.forEach((m) => log(analyzeLog, `  - ${m.id} ("${m.data.name}")`, "err"));
failed = true;
continue;
}

const winner = matches.find((m) => m.id.endsWith(pair.winnerSuffix));
const loser = matches.find((m) => m.id.endsWith(pair.loserSuffix));

if (!winner || !loser) {
log(analyzeLog, `ERREUR : pour "${pair.label}", ids trouvés (${matches.map((m) => m.id).join(", ")}) ne correspondent pas aux suffixes attendus ("${pair.winnerSuffix}" / "${pair.loserSuffix}"). Résolution manuelle requise.`, "err");
failed = true;
continue;
}

const loserPrograms = programs.filter((p) => p.data.universityId === loser.id);

if (loserPrograms.length === 0) {
log(analyzeLog, `ERREUR : aucun programme ne pointe vers ${loser.id} — rien à migrer, suppression seule non prévue par ce script. Résolution manuelle requise.`, "err");
failed = true;
continue;
}

log(analyzeLog, `"${pair.label}" : garder ${winner.id}, retirer ${loser.id}.`, "ok");

const migrations = [];

for (const p of loserPrograms) {

const newProgramId = `${winner.id}__${p.data.scholarshipId}`;
const collisionExists = programs.some((other) => other.id === newProgramId);

if (collisionExists) {
log(analyzeLog, `ERREUR : ${newProgramId} existe déjà — impossible de migrer ${p.id} sans collision. Résolution manuelle requise.`, "err");
failed = true;
continue;
}

log(analyzeLog, `  Programme ${p.id} -> nouveau programme ${newProgramId} (universityId : ${loser.id} -> ${winner.id}), puis ${p.id} supprimé.`, "ok");

migrations.push({
oldProgramId: p.id,
newProgramId,
newProgramData: { ...p.data, universityId: winner.id }
});

}

log(analyzeLog, `  Puis universities/${loser.id} sera supprimé.`, "ok");

mergePlans.push({ key: pair.key, label: pair.label, winnerId: winner.id, loserId: loser.id, migrations });

}

// -------- Politecnico di Milano --------
const polimiSnap = await getDoc(doc(db, "universities", POLIMI_FIX.id));
let polimiPlan = null;

if (!polimiSnap.exists()) {
log(analyzeLog, `ERREUR : aucun document "universities/${POLIMI_FIX.id}" trouvé.`, "err");
failed = true;
} else {

const current = polimiSnap.data();
const name = current.name || "";

if (!normalize(name).includes(POLIMI_FIX.expectedNameIncludes)) {
log(analyzeLog, `ERREUR : universities/${POLIMI_FIX.id} existe mais son nom ("${name}") ne correspond pas. Résolution manuelle requise.`, "err");
failed = true;
} else {

const before = current.applicationPortalUrl || "";
const after = POLIMI_FIX.fields.applicationPortalUrl;

if (before === after) {
log(analyzeLog, `"${name}" : déjà correct, aucun changement nécessaire.`, "ok");
} else {
log(analyzeLog, `"${name}" (${POLIMI_FIX.id}) — ${POLIMI_FIX.reason}`, "ok");
log(analyzeLog, `  applicationPortalUrl : "${before}" -> "${after}"`, "ok");
polimiPlan = { id: POLIMI_FIX.id, name, fields: POLIMI_FIX.fields };
}

}

}

if (failed) {
log(analyzeLog, "Anomalie(s) détectée(s) — corriger avant de passer à l'étape 2. AUCUNE écriture ne sera faite.", "err");
return;
}

if (!mergePlans.length && !polimiPlan) {
log(analyzeLog, "Rien à faire : tout est déjà correct.", "ok");
lastPlan = null;
return;
}

lastPlan = { mergePlans, polimiPlan };

log(analyzeLog, "Analyse terminée. Relisez attentivement le plan ci-dessus (suppressions incluses) avant de passer à l'étape 2.", "ok");

writeBtn.disabled = false;

} catch (error) {

console.error(error);
log(analyzeLog, `Erreur : ${error.message}`, "err");

} finally {

analyzeBtn.disabled = false;

}

});

// ==========================================================
// Étape 2 — écriture (créations + SUPPRESSIONS)
// ==========================================================

writeBtn.addEventListener("click", async () => {

if (!lastPlan) return;

const nMerges = lastPlan.mergePlans.length;
const nDeletedPrograms = lastPlan.mergePlans.reduce((sum, m) => sum + m.migrations.length, 0);

const confirmed = confirm(
`Fusionner ${nMerges} paire(s) d'université en double (${nDeletedPrograms} document(s) "programs" migré(s), ${nMerges} document(s) "universities" SUPPRIMÉ(S))` +
(lastPlan.polimiPlan ? ` + corriger Politecnico di Milano` : "") +
` ? Cette action écrit ET supprime en base de production. Irréversible.`
);

if (!confirmed) return;

writeBtn.disabled = true;
writeLog.innerHTML = "";

try {

for (const merge of lastPlan.mergePlans) {

log(writeLog, `Fusion "${merge.label}"...`);

for (const m of merge.migrations) {
await setDoc(doc(db, "programs", m.newProgramId), m.newProgramData);
log(writeLog, `  programs/${m.newProgramId} créé.`);
await deleteDoc(doc(db, "programs", m.oldProgramId));
log(writeLog, `  programs/${m.oldProgramId} supprimé.`);
}

await deleteDoc(doc(db, "universities", merge.loserId));
log(writeLog, `  universities/${merge.loserId} supprimé.`);
log(writeLog, `"${merge.label}" fusionnée sur ${merge.winnerId}.`, "ok");

}

if (lastPlan.polimiPlan) {
await setDoc(doc(db, "universities", lastPlan.polimiPlan.id), lastPlan.polimiPlan.fields, { merge: true });
log(writeLog, `"${lastPlan.polimiPlan.name}" corrigé.`, "ok");
}

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

for (const merge of lastPlan.mergePlans) {

const loserSnap = await getDoc(doc(db, "universities", merge.loserId));
if (loserSnap.exists()) {
mismatch++;
log(verifyLog, `MISMATCH : universities/${merge.loserId} existe encore (devrait être supprimé).`, "err");
} else {
ok++;
log(verifyLog, `universities/${merge.loserId} : confirmé supprimé.`, "ok");
}

for (const m of merge.migrations) {

const oldSnap = await getDoc(doc(db, "programs", m.oldProgramId));
if (oldSnap.exists()) {
mismatch++;
log(verifyLog, `MISMATCH : programs/${m.oldProgramId} existe encore (devrait être supprimé).`, "err");
} else {
ok++;
}

const newSnap = await getDoc(doc(db, "programs", m.newProgramId));
const current = newSnap.exists() ? newSnap.data() : null;
const fieldsMatch = current && Object.keys(m.newProgramData).every((key) => JSON.stringify(current[key]) === JSON.stringify(m.newProgramData[key]));
if (fieldsMatch) {
ok++;
log(verifyLog, `programs/${m.newProgramId} : confirmé.`, "ok");
} else {
mismatch++;
log(verifyLog, `MISMATCH : programs/${m.newProgramId} ${current ? "trouvé mais différent" : "introuvable"}.`, "err");
}

}

}

if (lastPlan.polimiPlan) {
const snap = await getDoc(doc(db, "universities", lastPlan.polimiPlan.id));
const current = snap.exists() ? snap.data() : null;
const fieldsMatch = current && Object.keys(lastPlan.polimiPlan.fields).every((key) => current[key] === lastPlan.polimiPlan.fields[key]);
if (fieldsMatch) {
ok++;
log(verifyLog, `"${lastPlan.polimiPlan.name}" : confirmé.`, "ok");
} else {
mismatch++;
log(verifyLog, `MISMATCH "${lastPlan.polimiPlan.name}".`, "err");
}
}

log(verifyLog, `${ok} confirmation(s), ${mismatch} écart(s).`, mismatch === 0 ? "ok" : "err");

if (mismatch === 0) {
log(verifyLog, "ÉCRITURE EN BASE CONFIRMÉE — lot 12 terminé, 0 écart. Vérifiez ensuite visuellement les pages Peking University / Nanjing University / Politecnico di Milano dans le navigateur, et que les bourses Beijing/Nanjing Government Scholarship affichent bien leur université.", "ok");
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
