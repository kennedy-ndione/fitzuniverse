// ============================================================
// ScholarBridge — Correctif catalogue, Lot 17 (2026-08-28)
// Ne crée ni ne supprime aucun document université ou programme.
// Ajoute (setDoc merge) le champ "image" à 3 bourses marocaines —
// oubliées des lots 14/15/16 (elles n'apparaissaient pas dans le
// découpage par pays initialement suivi). Dernier lot du
// remplacement des photos de bourse : après celui-ci, les 56
// bourses du catalogue ont chacune leur propre photo de monument.
//
// Même patron de sécurité que les lots 14/15/16 : id connu (lu dans
// admin/diag-scholarships.js, lecture directe de la base), re-vérifié
// en direct par comparaison de titre avant toute écriture.
//
// PRÉALABLE OBLIGATOIRE : scripts/add-lot17-scholarship-photos.ps1
// (télécharge les 3 photos dans assets/images/scholarships/).
// ============================================================

import { db } from "../firebase-config.js";

import {
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

// -------- Les 3 bourses marocaines à corriger, id connu + titre
// attendu pour re-vérification live avant toute écriture --------
const FIXES = [
{ id: "bourse-gouvernement-maroc-amci", expectedTitleIncludes: "bourse du gouvernement du maroc", newImage: "bourse-gouvernement-maroc-amci.jpg", reason: "tour Hassan, Rabat (bourse gouvernementale, AMCI basée à Rabat)." },
{ id: "bourses-master-aui", expectedTitleIncludes: "bourses de master aui", newImage: "bourses-master-aui.jpg", reason: "singes magots de la forêt de cèdres d'Azrou, région d'Ifrane — distinct de ifrane.jpg déjà utilisée par Al Akhawayn University." },
{ id: "mastercard-foundation-scholars-um6p", expectedTitleIncludes: "programme mastercard foundation scholars", newImage: "mastercard-foundation-scholars-um6p.jpg", reason: "minaret de la Koutoubia, Marrakech — distinct de benguerir.jpg déjà utilisée par UM6P." }
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

log(analyzeLog, "Vérification en direct des 3 documents à corriger...");

const plan = [];
let failed = false;

for (const fix of FIXES) {

const snap = await getDoc(doc(db, "scholarships", fix.id));

if (!snap.exists()) {
log(analyzeLog, `ERREUR : aucun document "scholarships/${fix.id}" trouvé. Résolution manuelle requise.`, "err");
failed = true;
continue;
}

const current = snap.data();
const title = current.title || "";

if (!normalize(title).includes(fix.expectedTitleIncludes)) {
log(analyzeLog, `ERREUR : scholarships/${fix.id} existe mais son titre ("${title}") ne correspond pas à "${fix.expectedTitleIncludes}" — id probablement réutilisé. AUCUNE écriture ne sera faite dessus.`, "err");
failed = true;
continue;
}

const before = current.image || "";

if (before === fix.newImage) {
log(analyzeLog, `"${title}" (${fix.id}) : déjà sur "${fix.newImage}", aucun changement nécessaire.`, "ok");
continue;
}

log(analyzeLog, `"${title}" (${fix.id}) — ${fix.reason}`, "ok");
log(analyzeLog, `  image : "${before || "(aucune)"}" -> "${fix.newImage}"`, "ok");

plan.push({ id: fix.id, title, newImage: fix.newImage });

}

if (failed) {
log(analyzeLog, "Anomalie(s) détectée(s) — corriger avant de passer à l'étape 2.", "err");
return;
}

if (!plan.length) {
log(analyzeLog, "Rien à écrire : les 3 documents sont déjà corrects. Étape 2 inutile.", "ok");
lastPlan = null;
return;
}

lastPlan = plan;

log(analyzeLog, `Analyse terminée, ${plan.length} document(s) à mettre à jour (merge, champ "image" seulement).`, "ok");
log(analyzeLog, `RAPPEL : vérifier que les 3 fichiers existent dans assets/images/scholarships/ (scripts/add-lot17-scholarship-photos.ps1) avant de continuer.`, "warn");

writeBtn.disabled = false;

} catch (error) {

console.error(error);
log(analyzeLog, `Erreur : ${error.message}`, "err");

} finally {

analyzeBtn.disabled = false;

}

});

// ==========================================================
// Étape 2 — écriture (merge, champ "image" seulement)
// ==========================================================

writeBtn.addEventListener("click", async () => {

if (!lastPlan) return;

const confirmed = confirm(
`Ajouter la photo de ${lastPlan.length} bourse(s) (mise à jour partielle, merge) ? Vérifiez d'abord que les fichiers existent dans assets/images/scholarships/. Cette action écrit en base de production.`
);

if (!confirmed) return;

writeBtn.disabled = true;
writeLog.innerHTML = "";

try {

for (const item of lastPlan) {
await setDoc(doc(db, "scholarships", item.id), { image: item.newImage }, { merge: true });
log(writeLog, `"${item.title}" (${item.id}) -> ${item.newImage}.`);
}

log(writeLog, `${lastPlan.length} document(s) corrigé(s).`, "ok");
log(writeLog, "Étape 2 terminée. Attendez quelques secondes avant l'étape 3 (le temps que Firestore propage l'écriture).", "ok");

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

const snap = await getDoc(doc(db, "scholarships", item.id));
const current = snap.exists() ? snap.data() : null;
const fieldsMatch = current && current.image === item.newImage;

if (fieldsMatch) {
ok++;
log(verifyLog, `"${item.title}" (${item.id}) : confirmé (${item.newImage}).`, "ok");
} else {
mismatch++;
log(verifyLog, `MISMATCH "${item.title}" (${item.id}) : document ${current ? "trouvé mais différent" : "introuvable"}.`, "err");
}

}

log(verifyLog, `${ok}/${lastPlan.length} document(s) confirmé(s) en base.`, mismatch === 0 ? "ok" : "err");

if (mismatch === 0) {
log(verifyLog, "ÉCRITURE EN BASE CONFIRMÉE — lot 17 terminé, 0 écart. Les 56 bourses du catalogue ont maintenant toutes leur propre photo de monument (audit complet). Vérifiez ensuite visuellement les cartes de ces bourses dans le navigateur.", "ok");
} else {
log(verifyLog, `ÉCHEC — ${mismatch} écart(s) détecté(s). Si ce sont les MÊMES documents qui viennent d'être écrits à l'instant, reclique simplement sur Vérifier après quelques secondes. Sinon, voir le détail ci-dessus.`, "err");
}

} catch (error) {

console.error(error);
log(verifyLog, `Erreur : ${error.message}`, "err");

} finally {

verifyBtn.disabled = false;

}

});
