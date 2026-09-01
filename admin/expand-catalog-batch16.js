// ============================================================
// ScholarBridge — Correctif catalogue, Lot 16 (2026-08-28)
// Ne crée ni ne supprime aucun document université ou programme.
// Ajoute (setDoc merge) le champ "image" à 21 bourses — les 21
// bourses italiennes (voir lots 14/15 pour les autres pays). Dernier
// lot du remplacement des photos de bourse : les 56 bourses du
// catalogue ont désormais toutes leur propre photo de monument.
//
// Même patron de sécurité que les lots 14/15 : id connu (lu dans
// admin/diag-scholarships.js, lecture directe de la base), re-vérifié
// en direct par comparaison de titre avant toute écriture.
//
// PRÉALABLE OBLIGATOIRE : scripts/add-lot16-scholarship-photos.ps1
// (télécharge les 21 photos dans assets/images/scholarships/).
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

// -------- Les 21 bourses italiennes à corriger, id connu + titre
// attendu pour re-vérification live avant toute écriture --------
const FIXES = [
{ id: "bocconi-merit-award", expectedTitleIncludes: "bocconi merit award", newImage: "bocconi-merit-award.jpg", reason: "château des Sforza, Milan." },
{ id: "bocconi-graduate-merit-award", expectedTitleIncludes: "bocconi graduate merit award", newImage: "bocconi-graduate-merit-award.jpg", reason: "Galleria Vittorio Emanuele II, Milan." },
{ id: "bocconi-phd-scholarship", expectedTitleIncludes: "bocconi phd scholarship", newImage: "bocconi-phd-scholarship.jpg", reason: "Navigli, Milan." },
{ id: "politecnico-di-milano-merit-based-scholarship", expectedTitleIncludes: "politecnico di milano merit", newImage: "politecnico-di-milano-merit-based-scholarship.jpg", reason: "Bosco Verticale, Milan." },
{ id: "politecnico-di-milano-phd-scholarship", expectedTitleIncludes: "politecnico di milano phd", newImage: "politecnico-di-milano-phd-scholarship.jpg", reason: "Arco della Pace, Milan." },
{ id: "edisu-piemonte-scholarship", expectedTitleIncludes: "edisu piemonte", newImage: "edisu-piemonte-scholarship.jpg", reason: "basilique de Superga, Turin." },
{ id: "polito-phd-scholarship", expectedTitleIncludes: "polito phd", newImage: "polito-phd-scholarship.jpg", reason: "Mole Antonelliana, Turin (distincte de Superga)." },
{ id: "international-talents-unibo", expectedTitleIncludes: "international talents", newImage: "international-talents-unibo.jpg", reason: "Piazza Maggiore / Palazzo d'Accursio, Bologne." },
{ id: "unibo-phd-scholarship", expectedTitleIncludes: "unibo phd", newImage: "unibo-phd-scholarship.jpg", reason: "portiques de Bologne (distincts de Piazza Maggiore)." },
{ id: "italian-government-scholarship", expectedTitleIncludes: "italian government scholarship", newImage: "italian-government-scholarship.jpg", reason: "Piazza Navona, Rome (bourse nationale, symbole de la capitale)." },
{ id: "laziodisco-scholarship", expectedTitleIncludes: "laziodisco", newImage: "laziodisco-scholarship.jpg", reason: "fontaine de Trevi, Rome." },
{ id: "sapienza-phd-scholarship", expectedTitleIncludes: "sapienza phd", newImage: "sapienza-phd-scholarship.jpg", reason: "Panthéon, Rome (distinct de Trevi et Piazza Navona)." },
{ id: "campania-regional-scholarship", expectedTitleIncludes: "campania regional", newImage: "campania-regional-scholarship.jpg", reason: "Vésuve (bourse régionale de Campanie)." },
{ id: "university-of-naples-federico-ii-phd-scholarship", expectedTitleIncludes: "university of naples federico ii", newImage: "university-of-naples-federico-ii-phd-scholarship.jpg", reason: "côte amalfitaine (distincte du Vésuve, même région)." },
{ id: "dsu-toscana-scholarship", expectedTitleIncludes: "dsu toscana", newImage: "dsu-toscana-scholarship.jpg", reason: "Piazza del Campo, Sienne (bourse régionale de Toscane, distincte de Florence/Pise)." },
{ id: "university-of-florence-phd-scholarship", expectedTitleIncludes: "university of florence phd", newImage: "university-of-florence-phd-scholarship.jpg", reason: "Ponte Vecchio, Florence." },
{ id: "university-of-pisa-phd-scholarship", expectedTitleIncludes: "university of pisa phd", newImage: "university-of-pisa-phd-scholarship.jpg", reason: "Duomo et baptistère, Piazza dei Miracoli, Pise." },
{ id: "university-of-padua-phd-scholarship", expectedTitleIncludes: "university of padua phd", newImage: "university-of-padua-phd-scholarship.jpg", reason: "basilique Saint-Antoine, Padoue." },
{ id: "veneto-regional-scholarship", expectedTitleIncludes: "veneto regional", newImage: "veneto-regional-scholarship.jpg", reason: "Piazza San Marco, Venise (bourse régionale de Vénétie)." },
{ id: "opera-universitaria-scholarship", expectedTitleIncludes: "opera universitaria", newImage: "opera-universitaria-scholarship.jpg", reason: "fontaine de la Piazza Duomo, Trente (Opera Universitaria = organisme régional du droit aux études de Trente, distinct de l'université elle-même)." },
{ id: "university-of-trento-phd-scholarship", expectedTitleIncludes: "university of trento phd", newImage: "university-of-trento-phd-scholarship.jpg", reason: "château du Buonconsiglio, Trente (distinct de la Piazza Duomo)." }
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

log(analyzeLog, "Vérification en direct des 21 documents à corriger...");

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
log(analyzeLog, "Rien à écrire : les 21 documents sont déjà corrects. Étape 2 inutile.", "ok");
lastPlan = null;
return;
}

lastPlan = plan;

log(analyzeLog, `Analyse terminée, ${plan.length} document(s) à mettre à jour (merge, champ "image" seulement).`, "ok");
log(analyzeLog, `RAPPEL : vérifier que les 21 fichiers existent dans assets/images/scholarships/ (scripts/add-lot16-scholarship-photos.ps1) avant de continuer.`, "warn");

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
log(verifyLog, "ÉCRITURE EN BASE CONFIRMÉE — lot 16 terminé, 0 écart. Les 56 bourses du catalogue ont maintenant chacune leur propre photo de monument. Vérifiez ensuite visuellement les cartes de ces bourses dans le navigateur.", "ok");
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
