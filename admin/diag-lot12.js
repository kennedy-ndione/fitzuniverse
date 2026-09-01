// ============================================================
// Fitz — Diagnostic lot 12 (2026-08-28)
// Outil de LECTURE SEULE. Aucune écriture, aucune suppression.
// Sert à comprendre pourquoi l'étape "Vérifier" du lot 12
// (expand-catalog-batch12.html) a signalé 4 écarts alors que les
// suppressions d'université, elles, ont réussi.
//
// Affiche tout ce qui existe réellement en base aujourd'hui pour
// Peking University et Nanjing University : documents "universities"
// (ancien id ET nouvel id, qu'ils existent ou non) et TOUS les
// documents "programs" qui mentionnent "peking" ou "nanjing" dans
// leur id ou leur universityId — y compris d'éventuels doublons non
// prévus par le plan du lot 12.
// ============================================================

import { db } from "../firebase-config.js";

import {
collection,
getDocs,
getDoc,
doc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

function log(el, message, cls = "") {
el.classList.add("is-visible");
const line = document.createElement("div");
if (cls) line.className = cls;
line.textContent = message;
el.appendChild(line);
el.scrollTop = el.scrollHeight;
}

function logJson(el, obj) {
el.classList.add("is-visible");
const line = document.createElement("div");
line.className = "json";
line.textContent = JSON.stringify(obj, null, 2);
el.appendChild(line);
el.scrollTop = el.scrollHeight;
}

const readBtn = document.getElementById("readBtn");
const readLog = document.getElementById("readLog");

const UNIVERSITY_IDS_TO_CHECK = [
"peking-university-pekin",
"peking-university-beijing",
"nanjing-university-nankin",
"nanjing-university-nanjing"
];

readBtn.addEventListener("click", async () => {

readBtn.disabled = true;
readLog.innerHTML = "";

try {

log(readLog, "-------- Documents universities --------");

for (const id of UNIVERSITY_IDS_TO_CHECK) {
const snap = await getDoc(doc(db, "universities", id));
if (!snap.exists()) {
log(readLog, `universities/${id} : N'EXISTE PAS.`, "warn");
} else {
log(readLog, `universities/${id} : EXISTE.`, "ok");
logJson(readLog, snap.data());
}
}

log(readLog, "");
log(readLog, "-------- Documents programs (lecture de toute la collection) --------");

const programsSnap = await getDocs(collection(db, "programs"));
const allPrograms = programsSnap.docs.map((d) => ({ id: d.id, data: d.data() }));

log(readLog, `${allPrograms.length} programme(s) au total dans la collection.`);

const matching = allPrograms.filter((p) => {
const idLower = p.id.toLowerCase();
const uniLower = String(p.data.universityId || "").toLowerCase();
return idLower.includes("peking") || idLower.includes("nanjing") || uniLower.includes("peking") || uniLower.includes("nanjing");
});

log(readLog, `${matching.length} programme(s) mentionnant "peking" ou "nanjing" (id ou universityId) :`);
log(readLog, "");

for (const p of matching) {
log(readLog, `programs/${p.id}`, "ok");
logJson(readLog, p.data);
log(readLog, "");
}

if (matching.length === 0) {
log(readLog, "Aucun programme trouvé — vérifier manuellement.", "err");
}

log(readLog, "-------- Fin du diagnostic --------", "ok");
log(readLog, "Copie-colle tout ce bloc dans la conversation.", "ok");

} catch (error) {

console.error(error);
log(readLog, `Erreur : ${error.message}`, "err");

} finally {

readBtn.disabled = false;

}

});
