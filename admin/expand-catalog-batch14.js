// ============================================================
// ScholarBridge — Correctif catalogue, Lot 14 (2026-08-28)
// Ne crée ni ne supprime aucun document université ou programme.
// Ajoute (setDoc merge) le champ "image" à 17 bourses — une photo de
// monument distincte pour chacun des 17 pays qui n'ont qu'une seule
// bourse dans le catalogue. Les 39 autres bourses (pays à plusieurs
// bourses + Italie) suivront dans les lots 15+ ; en attendant, elles
// continuent de retomber sur l'ancienne cascade université/pays/hash
// (voir js/scholarship-image.js).
//
// Décision utilisateur du 2026-08-28 : abandon des photos de ville
// génériques pour les bourses (une proposition de visuel généré par
// dégradé/motif a été présentée puis refusée), au profit d'une vraie
// photo de monument, unique par bourse, jamais partagée avec une
// université ni une autre bourse.
//
// Même patron de sécurité que les lots 10/11 : id connu (lu dans
// admin/diag-scholarships.js, lecture directe de la base), re-vérifié
// en direct par comparaison de titre avant toute écriture.
//
// PRÉALABLE OBLIGATOIRE : scripts/add-lot14-scholarship-photos.ps1
// (télécharge les 17 photos dans assets/images/scholarships/ — ce
// script Firestore ne vérifie pas que les fichiers existent sur
// disque, même limitation documentée dans expand-catalog-batch9.js).
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

// -------- Les 17 bourses à corriger, id connu + titre attendu pour
// re-vérification live avant toute écriture --------
const FIXES = [
{ id: "mastercard-foundation-scholars-uct", expectedTitleIncludes: "mastercard foundation scholars", newImage: "mastercard-foundation-scholars-uct.jpg", reason: "Table Mountain, Le Cap." },
{ id: "daad-study-scholarships", expectedTitleIncludes: "daad study", newImage: "daad-study-scholarships.jpg", reason: "château de Neuschwanstein, Bavière." },
{ id: "king-abdulaziz-scholarship", expectedTitleIncludes: "bourses du gouvernement saoudien", newImage: "king-abdulaziz-scholarship.jpg", reason: "tour Al Faisaliyah, Riyad." },
{ id: "global-korea-scholarship", expectedTitleIncludes: "global korea scholarship", newImage: "global-korea-scholarship.jpg", reason: "palais Gyeongbokgung, Séoul." },
{ id: "stipendium-hungaricum", expectedTitleIncludes: "stipendium hungaricum", newImage: "stipendium-hungaricum.jpg", reason: "pont des Chaînes et basilique Saint-Étienne, Budapest." },
{ id: "iccr-africa-scholarship-scheme", expectedTitleIncludes: "iccr", newImage: "iccr-africa-scholarship-scheme.jpg", reason: "Taj Mahal, Agra." },
{ id: "mext-scholarship", expectedTitleIncludes: "mext scholarship", newImage: "mext-scholarship.jpg", reason: "mont Fuji." },
{ id: "malaysia-international-scholarship", expectedTitleIncludes: "malaysia international scholarship", newImage: "malaysia-international-scholarship.jpg", reason: "grottes de Batu, Kuala Lumpur." },
{ id: "nl-scholarship", expectedTitleIncludes: "nl scholarship", newImage: "nl-scholarship.jpg", reason: "champs de tulipes du Keukenhof." },
{ id: "nawa-banach-scholarship", expectedTitleIncludes: "banach nawa", newImage: "nawa-banach-scholarship.jpg", reason: "cathédrale du Wawel, Cracovie." },
{ id: "bolsas-cooperacao-camoes", expectedTitleIncludes: "bolsas de cooperac", newImage: "bolsas-cooperacao-camoes.jpg", reason: "tour de Belém, Lisbonne." },
{ id: "romanian-government-scholarship", expectedTitleIncludes: "romanian government scholarship", newImage: "romanian-government-scholarship.jpg", reason: "château de Bran." },
{ id: "chevening-scholarships", expectedTitleIncludes: "chevening", newImage: "chevening-scholarships.jpg", reason: "Tower Bridge, Londres." },
{ id: "open-doors-scholarship", expectedTitleIncludes: "open doors", newImage: "open-doors-scholarship.jpg", reason: "cathédrale Saint-Basile, Moscou." },
{ id: "swedish-institute-scholarships-global-professionals", expectedTitleIncludes: "swedish institute scholarships", newImage: "swedish-institute-scholarships-global-professionals.jpg", reason: "hôtel de ville de Stockholm." },
{ id: "swiss-government-excellence-scholarships", expectedTitleIncludes: "swiss government excellence", newImage: "swiss-government-excellence-scholarships.jpg", reason: "Cervin (Matterhorn)." },
{ id: "turkiye-burslari", expectedTitleIncludes: "turkiye burslari", newImage: "turkiye-burslari.jpg", reason: "montgolfières de Cappadoce." }
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

log(analyzeLog, "Vérification en direct des 17 documents à corriger...");

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
log(analyzeLog, "Rien à écrire : les 17 documents sont déjà corrects. Étape 2 inutile.", "ok");
lastPlan = null;
return;
}

lastPlan = plan;

log(analyzeLog, `Analyse terminée, ${plan.length} document(s) à mettre à jour (merge, champ "image" seulement).`, "ok");
log(analyzeLog, `RAPPEL : vérifier que les 17 fichiers existent dans assets/images/scholarships/ (scripts/add-lot14-scholarship-photos.ps1) avant de continuer.`, "warn");

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
log(verifyLog, "ÉCRITURE EN BASE CONFIRMÉE — lot 14 terminé, 0 écart. Vérifiez ensuite visuellement les pages/cartes de ces 17 bourses dans le navigateur.", "ok");
} else {
log(verifyLog, `ÉCHEC — ${mismatch} écart(s) détecté(s). Si ce sont les MÊMES documents qui viennent d'être écrits à l'instant, reclique simplement sur Vérifier après quelques secondes (Firestore peut prendre un instant à propager). Sinon, voir le détail ci-dessus.`, "err");
}

} catch (error) {

console.error(error);
log(verifyLog, `Erreur : ${error.message}`, "err");

} finally {

verifyBtn.disabled = false;

}

});
