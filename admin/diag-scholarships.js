// ============================================================
// Fitz — Diagnostic liste des bourses (2026-08-28)
// Outil de LECTURE SEULE. Aucune écriture.
// Sert à préparer l'attribution d'une photo de monument unique à
// chaque bourse : liste id/titre/pays/pays éligibles/image actuelle
// pour toutes les bourses de la collection "scholarships".
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

const snap = await getDocs(collection(db, "scholarships"));
const scholarships = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

log(readLog, `${scholarships.length} bourse(s) au total.`, "ok");
log(readLog, "");

const byCountry = new Map();
for (const s of scholarships) {
const c = s.country || "(pays manquant)";
if (!byCountry.has(c)) byCountry.set(c, []);
byCountry.get(c).push(s);
}

const sortedCountries = [...byCountry.keys()].sort((a, b) => a.localeCompare(b));

for (const country of sortedCountries) {
const list = byCountry.get(country);
log(readLog, `-------- ${country} (${list.length}) --------`, "ok");
for (const s of list) {
const otherCountries = (s.countries || []).filter((c) => c !== s.country);
log(readLog, `id: ${s.id}`);
log(readLog, `  titre: ${s.title || "(sans titre)"}`);
log(readLog, `  image actuelle (champ stocké) : ${s.image ? s.image : "(aucun — repli dynamique)"}`);
if (otherCountries.length) log(readLog, `  autres pays éligibles : ${otherCountries.join(", ")}`);
}
log(readLog, "");
}

log(readLog, "-------- Fin --------", "ok");
log(readLog, "Copie-colle tout ce bloc dans la conversation.", "ok");

} catch (error) {

console.error(error);
log(readLog, `Erreur : ${error.message}`, "err");

} finally {

readBtn.disabled = false;

}

});
