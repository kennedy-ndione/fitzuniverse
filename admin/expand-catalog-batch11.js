// ============================================================
// ScholarBridge — Correctif catalogue, Lot 11 (2026-08-28)
// Ne crée RIEN. Corrige le champ "image" de 9 universités qui
// partageaient jusque-là leur photo avec une autre (audit demandé par
// l'utilisateur : "je ne veux plus voir deux universités avec les
// mêmes photos"). Chaque groupe de doublon (lots 1 à 9) laisse UNE
// université garder sa photo actuelle (non touchée par ce lot) et
// donne aux autres une photo neuve, unique, déjà téléchargée par
// scripts/add-lot11-unique-photos.sh (PRÉALABLE OBLIGATOIRE — ce
// script Firestore ne vérifie pas que les fichiers existent sur
// disque, même limitation documentée dans expand-catalog-batch9.js) :
//
//   newyork.jpg (erreur, x2) -> stanford.jpg (Stanford) + berkeley.jpg (UC Berkeley)
//   paris.jpg (x2)           -> sorbonne.jpg (Sorbonne Université — Sciences Po garde paris.jpg)
//   istanbul.jpg (x3)        -> istanbul-university.jpg (Istanbul University)
//                                + istanbul-technical.jpg (ITU — Boğaziçi garde istanbul.jpg)
//   riyadh.jpg (x2)          -> princess-nourah.jpg (Princess Nourah — King Saud garde riyadh.jpg)
//   bucharest.jpg (x2)       -> politehnica-bucuresti.jpg (Politehnica — Univ. de Bucarest garde bucharest.jpg)
//   zurich.jpg (x2)          -> zurich-grossmunster.jpg (UZH — ETH Zurich garde zurich.jpg)
//   moscow.jpg (x2)          -> rudn.jpg (RUDN — HSE garde moscow.jpg)
//
// Stanford et UC Berkeley n'étaient pas de simples doublons entre eux
// : les deux utilisaient par erreur "newyork.jpg", qui ne représente
// ni l'une ni l'autre (ni même la même côte). Corrigé en même temps
// que les vrais doublons, même mécanisme de correction.
//
// Même patron de sécurité que le lot 10 (et sa motivation, la
// collision Sciences Po du lot 7) : chaque id, bien que connu avec
// certitude (lu dans expand-catalog-batch1.js/2.js/3.js/5.js/7.js/
// 8.js), est re-vérifié en direct par lecture + comparaison de nom
// avant toute écriture.
//
// setDoc(..., {merge:true}) : seul le champ "image" est touché.
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

// -------- Les 9 universités à corriger, id connu + nom attendu pour
// re-vérification live avant toute écriture --------
const FIXES = [
{
id: "stanford-university-stanford",
expectedNameIncludes: "stanford",
newImage: "stanford.jpg",
reason: "utilisait newyork.jpg par erreur (Stanford n'est pas à New York)."
},
{
id: "university-of-california-berkeley-berkeley",
expectedNameIncludes: "california, berkeley",
newImage: "berkeley.jpg",
reason: "utilisait newyork.jpg par erreur (Berkeley n'est pas à New York)."
},
{
id: "sorbonne-universite-paris",
expectedNameIncludes: "sorbonne",
newImage: "sorbonne.jpg",
reason: "partageait paris.jpg avec Sciences Po, qui garde cette photo."
},
{
id: "istanbul-university-istanbul",
expectedNameIncludes: "istanbul university",
newImage: "istanbul-university.jpg",
reason: "partageait istanbul.jpg avec Boğaziçi et ITU ; Boğaziçi garde cette photo."
},
{
id: "istanbul-technical-university-istanbul",
expectedNameIncludes: "istanbul technical",
newImage: "istanbul-technical.jpg",
reason: "partageait istanbul.jpg avec Boğaziçi et Istanbul University."
},
{
id: "princess-nourah-university-riyad",
expectedNameIncludes: "princess nourah",
newImage: "princess-nourah.jpg",
reason: "partageait riyadh.jpg avec King Saud University, qui garde cette photo."
},
{
id: "politehnica-bucuresti-bucarest",
expectedNameIncludes: "politehnica",
newImage: "politehnica-bucuresti.jpg",
reason: "partageait bucharest.jpg avec l'Université de Bucarest, qui garde cette photo."
},
{
id: "university-of-zurich-zurich",
expectedNameIncludes: "zurich",
newImage: "zurich-grossmunster.jpg",
reason: "partageait zurich.jpg avec ETH Zurich, qui garde cette photo."
},
{
id: "rudn-university-moscow",
expectedNameIncludes: "rudn",
newImage: "rudn.jpg",
reason: "partageait moscow.jpg avec HSE University, qui garde cette photo."
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

log(analyzeLog, "Vérification en direct des 9 documents à corriger...");

const plan = [];
let failed = false;

for (const fix of FIXES) {

const snap = await getDoc(doc(db, "universities", fix.id));

if (!snap.exists()) {
log(analyzeLog, `ERREUR : aucun document "universities/${fix.id}" trouvé. Résolution manuelle requise.`, "err");
failed = true;
continue;
}

const current = snap.data();
const name = current.name || "";

if (!normalize(name).includes(fix.expectedNameIncludes)) {
log(analyzeLog, `ERREUR : universities/${fix.id} existe mais son nom ("${name}") ne correspond pas à "${fix.expectedNameIncludes}" — id probablement réutilisé. AUCUNE écriture ne sera faite dessus.`, "err");
failed = true;
continue;
}

const before = current.image || "";

if (before === fix.newImage) {
log(analyzeLog, `"${name}" (${fix.id}) : déjà sur "${fix.newImage}", aucun changement nécessaire.`, "ok");
continue;
}

log(analyzeLog, `"${name}" (${fix.id}) — ${fix.reason}`, "ok");
log(analyzeLog, `  image : "${before}" -> "${fix.newImage}"`, "ok");

plan.push({ id: fix.id, name, newImage: fix.newImage });

}

if (failed) {
log(analyzeLog, "Anomalie(s) détectée(s) — corriger avant de passer à l'étape 2.", "err");
return;
}

if (!plan.length) {
log(analyzeLog, "Rien à écrire : les 9 documents sont déjà corrects. Étape 2 inutile.", "ok");
lastPlan = null;
return;
}

lastPlan = plan;

log(analyzeLog, `Analyse terminée, ${plan.length} document(s) à mettre à jour (merge, champ "image" seulement).`, "ok");
log(analyzeLog, `RAPPEL : vérifier que les 9 fichiers existent dans assets/images/cities/ (scripts/add-lot11-unique-photos.sh) avant de continuer.`, "warn");

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
`Corriger la photo de ${lastPlan.length} université(s) (mise à jour partielle, merge) ? Vérifiez d'abord que les fichiers existent dans assets/images/cities/. Cette action écrit en base de production.`
);

if (!confirmed) return;

writeBtn.disabled = true;
writeLog.innerHTML = "";

try {

for (const item of lastPlan) {
await setDoc(doc(db, "universities", item.id), { image: item.newImage }, { merge: true });
log(writeLog, `"${item.name}" (${item.id}) -> ${item.newImage}.`);
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
const fieldsMatch = current && current.image === item.newImage;

if (fieldsMatch) {
ok++;
log(verifyLog, `"${item.name}" (${item.id}) : confirmé (${item.newImage}).`, "ok");
} else {
mismatch++;
log(verifyLog, `MISMATCH "${item.name}" (${item.id}) : document ${current ? "trouvé mais différent" : "introuvable"}.`, "err");
}

}

log(verifyLog, `${ok}/${lastPlan.length} document(s) confirmé(s) en base.`, mismatch === 0 ? "ok" : "err");

if (mismatch === 0) {
log(verifyLog, "ÉCRITURE EN BASE CONFIRMÉE — lot 11 terminé, 0 écart. Vérifiez ensuite visuellement chaque page université dans le navigateur.", "ok");
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
