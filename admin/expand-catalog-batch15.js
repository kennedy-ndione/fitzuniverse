// ============================================================
// ScholarBridge — Correctif catalogue, Lot 15 (2026-08-28)
// Ne crée ni ne supprime aucun document université ou programme.
// Ajoute (setDoc merge) le champ "image" à 15 bourses — deuxième
// vague du remplacement des photos de bourse (voir lot 14) : les
// pays à plusieurs bourses hors Italie (Belgique 3, Canada 4, Chine
// 4, États-Unis 2, France 2). L'Italie (21 bourses) suit dans un lot
// dédié vu son volume.
//
// Même patron de sécurité que le lot 14 : id connu (lu dans
// admin/diag-scholarships.js, lecture directe de la base), re-vérifié
// en direct par comparaison de titre avant toute écriture.
//
// PRÉALABLE OBLIGATOIRE : scripts/add-lot15-scholarship-photos.ps1
// (télécharge les 15 photos dans assets/images/scholarships/).
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

// -------- Les 15 bourses à corriger, id connu + titre attendu pour
// re-vérification live avant toute écriture --------
const FIXES = [
{ id: "bourse-master-in-wbi", expectedTitleIncludes: "bourse master in", newImage: "bourse-master-in-wbi.jpg", reason: "Atomium, Bruxelles." },
{ id: "bourses-formations-internationales-ares", expectedTitleIncludes: "bourses de formations internationales", newImage: "bourses-formations-internationales-ares.jpg", reason: "beffroi de Bruges." },
{ id: "icp-connect-scholarships-vlir-uos", expectedTitleIncludes: "icp connect scholarships", newImage: "icp-connect-scholarships-vlir-uos.jpg", reason: "gare centrale d'Anvers." },
{ id: "lester-b-pearson-international-scholarship", expectedTitleIncludes: "lester b. pearson", newImage: "lester-b-pearson-international-scholarship.jpg", reason: "CN Tower, Toronto." },
{ id: "mcgill-major-entrance-scholarships", expectedTitleIncludes: "mcgill major entrance", newImage: "mcgill-major-entrance-scholarships.jpg", reason: "basilique Notre-Dame, Montréal." },
{ id: "ubc-international-scholars-program", expectedTitleIncludes: "ubc international scholars", newImage: "ubc-international-scholars-program.jpg", reason: "pont suspendu de Capilano, Vancouver." },
{ id: "vanier-canada-graduate-scholarship", expectedTitleIncludes: "vanier canada graduate", newImage: "vanier-canada-graduate-scholarship.jpg", reason: "colline du Parlement, Ottawa." },
{ id: "beijing-government-scholarship", expectedTitleIncludes: "beijing government scholarship", newImage: "beijing-government-scholarship.jpg", reason: "Temple du Ciel, Pékin." },
{ id: "chinese-government-scholarship", expectedTitleIncludes: "chinese government scholarship", newImage: "chinese-government-scholarship.jpg", reason: "armée de terre cuite, Xi'an (symbole national, pas Pékin-spécifique)." },
{ id: "nanjing-government-scholarship", expectedTitleIncludes: "nanjing government scholarship", newImage: "nanjing-government-scholarship.jpg", reason: "temple Jiming, Nankin." },
{ id: "shanghai-government-scholarship", expectedTitleIncludes: "shanghai government scholarship", newImage: "shanghai-government-scholarship.jpg", reason: "Shanghai vue depuis la Jin Mao Tower, heure dorée." },
{ id: "knight-hennessy-scholars", expectedTitleIncludes: "knight-hennessy scholars", newImage: "knight-hennessy-scholars.jpg", reason: "Golden Gate Bridge, San Francisco (distinct de Hoover Tower déjà utilisée par Stanford)." },
{ id: "mastercard-foundation-scholars-program", expectedTitleIncludes: "mastercard foundation scholars program", newImage: "mastercard-foundation-scholars-program.jpg", reason: "statue de la Liberté, New York." },
{ id: "eiffel-excellence-scholarship", expectedTitleIncludes: "eiffel excellence scholarship", newImage: "eiffel-excellence-scholarship.jpg", reason: "tour Eiffel — cohérent avec le nom de la bourse." },
{ id: "bourse-emile-boutmy", expectedTitleIncludes: "bourse emile boutmy", newImage: "bourse-emile-boutmy.jpg", reason: "pyramide du Louvre." }
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

log(analyzeLog, "Vérification en direct des 15 documents à corriger...");

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
log(analyzeLog, "Rien à écrire : les 15 documents sont déjà corrects. Étape 2 inutile.", "ok");
lastPlan = null;
return;
}

lastPlan = plan;

log(analyzeLog, `Analyse terminée, ${plan.length} document(s) à mettre à jour (merge, champ "image" seulement).`, "ok");
log(analyzeLog, `RAPPEL : vérifier que les 15 fichiers existent dans assets/images/scholarships/ (scripts/add-lot15-scholarship-photos.ps1) avant de continuer.`, "warn");

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
log(verifyLog, "ÉCRITURE EN BASE CONFIRMÉE — lot 15 terminé, 0 écart. Vérifiez ensuite visuellement les cartes de ces bourses dans le navigateur.", "ok");
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
