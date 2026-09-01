// ============================================================
// Fitz — Diagnostic applicationPortalUrl manquants (2026-08-28)
// Outil de LECTURE SEULE. Aucune écriture.
// Sert à re-vérifier en direct les 14 universités identifiées par
// l'audit initial où officialWebsite et applicationPortalUrl ne sont
// pas tous les deux renseignés, avant de rechercher les liens de
// candidature manquants (tâche #10).
// ============================================================

import { db } from "../firebase-config.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

function log(el, message, cls = "") {
el.classList.add("is-visible");
const line = document.createElement("div");
if (cls) line.className = cls;
line.textContent = message;
el.appendChild(line);
el.scrollTop = el.scrollHeight;
}

const readBtn = document.getElementById("readBtn");
const readLog = document.getElementById("readLog");

readBtn.addEventListener("click", async () => {

readBtn.disabled = true;
readLog.innerHTML = "";

try {

const snap = await getDocs(collection(db, "universities"));
const universities = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

log(readLog, `${universities.length} université(s) au total.`, "ok");
log(readLog, "");

const missingOne = universities.filter((u) => (u.officialWebsite && !u.applicationPortalUrl) || (!u.officialWebsite && u.applicationPortalUrl));
const missingBoth = universities.filter((u) => !u.officialWebsite && !u.applicationPortalUrl);
const identical = universities.filter((u) => u.officialWebsite && u.applicationPortalUrl && u.officialWebsite === u.applicationPortalUrl);

log(readLog, `-------- Un des deux champs manque (${missingOne.length}) --------`, "ok");
for (const u of missingOne.sort((a, b) => (a.name || "").localeCompare(b.name || ""))) {
log(readLog, `id: ${u.id}`);
log(readLog, `  nom: ${u.name || "(sans nom)"}`);
log(readLog, `  pays: ${u.country || "(pays manquant)"}`);
log(readLog, `  officialWebsite: ${u.officialWebsite || "(absent)"}`);
log(readLog, `  applicationPortalUrl: ${u.applicationPortalUrl || "(absent)"}`);
}
log(readLog, "");

log(readLog, `-------- Les deux champs manquent (${missingBoth.length}) --------`, missingBoth.length ? "warn" : "ok");
for (const u of missingBoth.sort((a, b) => (a.name || "").localeCompare(b.name || ""))) {
log(readLog, `id: ${u.id}`);
log(readLog, `  nom: ${u.name || "(sans nom)"}`);
log(readLog, `  pays: ${u.country || "(pays manquant)"}`);
}
log(readLog, "");

log(readLog, `-------- officialWebsite === applicationPortalUrl, identiques (${identical.length}) --------`, identical.length ? "warn" : "ok");
for (const u of identical.sort((a, b) => (a.name || "").localeCompare(b.name || ""))) {
log(readLog, `id: ${u.id}`);
log(readLog, `  nom: ${u.name || "(sans nom)"}`);
log(readLog, `  lien: ${u.officialWebsite}`);
}
log(readLog, "");

log(readLog, "-------- Fin --------", "ok");
log(readLog, "Copie-colle tout ce bloc dans la conversation.", "ok");

} catch (error) {

console.error(error);
log(readLog, `Erreur : ${error.message}`, "err");

} finally {

readBtn.disabled = false;

}

});
