// ============================================================
// ScholarBridge — Correctif catalogue, Lot 13 (2026-08-28)
// Ne crée RIEN. Corrige le champ "image" de 14 universités qui
// partageaient jusque-là leur photo avec une autre — 9 groupes de
// doublons trouvés par l'audit étendu (admin/audit-catalog.html,
// section "Photos partagées"), tous antérieurs à cette session
// (catalogue importé avant les lots 1-9) :
//
//   budapest.jpg (x4)   -> corvinus.jpg + bme-budapest.jpg + obuda.jpg
//                          + semmelweis.jpg (Eötvös Loránd garde budapest.jpg)
//   shanghai.jpg (x3)   -> shanghai-jiaotong.jpg + shanghai-maritime.jpg
//                          + tongji.jpg (Fudan garde shanghai.jpg)
//   beijing.jpg (x2)    -> beihang.jpg + tsinghua.jpg (Peking University
//                          garde beijing.jpg)
//   delhi.jpg (x1)      -> university-of-delhi.jpg (Jawaharlal Nehru
//                          garde delhi.jpg)
//   kualalumpur.jpg (x1)-> universiti-malaya.jpg (Universiti Kebangsaan
//                          Malaysia garde kualalumpur.jpg)
//   milan.jpg (x1)      -> bocconi.jpg (Politecnico di Milano garde milan.jpg)
//   seoul.jpg (x1)      -> yonsei.jpg (Korea University garde seoul.jpg)
//   tokyo.jpg (x1)      -> waseda.jpg (University of Tokyo garde tokyo.jpg)
//
// (nanjing.jpg, le 9e groupe trouvé par l'audit, n'a besoin d'aucune
// photo : c'était un doublon de fiche université, réglé par fusion au
// lot 12, pas par une photo.)
//
// Contrairement aux lots 10/11 (ids déjà connus, lus dans mon propre
// code des lots précédents), ces 14 universités n'ont jamais été
// traitées par moi auparavant — leurs ids Firestore exacts ne sont
// pas connus avec certitude. Ce lot les retrouve donc par RECHERCHE
// PAR NOM NORMALISÉ dans toute la collection "universities", et
// bloque proprement si une recherche ne renvoie pas exactement 1
// résultat (0 = université introuvable, 2+ = ambiguïté), plutôt que
// de deviner un id.
//
// setDoc(..., {merge:true}) : seul le champ "image" est touché.
// ============================================================

import { db } from "../firebase-config.js";

import {
collection,
getDocs,
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

// -------- Les 14 universités à corriger, retrouvées par nom --------
const FIXES = [
{
match: (name) => normalize(name) === "corvinus university of budapest",
label: "Corvinus University of Budapest",
newImage: "corvinus.jpg",
reason: "partageait budapest.jpg avec 3 autres universités ; Eötvös Loránd garde cette photo."
},
{
match: (name) => normalize(name).includes("budapest university of technology"),
label: "Budapest University of Technology and Economics",
newImage: "bme-budapest.jpg",
reason: "partageait budapest.jpg."
},
{
match: (name) => normalize(name) === "obuda university" || normalize(name) === "óbuda university",
label: "Óbuda University",
newImage: "obuda.jpg",
reason: "partageait budapest.jpg."
},
{
match: (name) => normalize(name) === "semmelweis university",
label: "Semmelweis University",
newImage: "semmelweis.jpg",
reason: "partageait budapest.jpg."
},
{
match: (name) => normalize(name).includes("shanghai jiao tong") || normalize(name).includes("shanghai jiaotong"),
label: "Shanghai Jiao Tong University",
newImage: "shanghai-jiaotong.jpg",
reason: "partageait shanghai.jpg avec 2 autres universités ; Fudan garde cette photo."
},
{
match: (name) => normalize(name).includes("shanghai maritime"),
label: "Shanghai Maritime University",
newImage: "shanghai-maritime.jpg",
reason: "partageait shanghai.jpg."
},
{
match: (name) => normalize(name) === "tongji university",
label: "Tongji University",
newImage: "tongji.jpg",
reason: "partageait shanghai.jpg."
},
{
match: (name) => normalize(name).includes("beihang"),
label: "Beihang University",
newImage: "beihang.jpg",
reason: "partageait beijing.jpg avec Tsinghua ; Peking University garde cette photo."
},
{
match: (name) => normalize(name) === "tsinghua university",
label: "Tsinghua University",
newImage: "tsinghua.jpg",
reason: "partageait beijing.jpg."
},
{
match: (name) => normalize(name).includes("delhi") && !normalize(name).includes("jawaharlal"),
label: "University of Delhi",
newImage: "university-of-delhi.jpg",
reason: "partageait delhi.jpg avec Jawaharlal Nehru University, qui garde cette photo."
},
{
match: (name) => normalize(name).includes("universiti malaya"),
label: "Universiti Malaya",
newImage: "universiti-malaya.jpg",
reason: "partageait kualalumpur.jpg avec Universiti Kebangsaan Malaysia, qui garde cette photo."
},
{
match: (name) => normalize(name).includes("bocconi"),
label: "Università Bocconi",
newImage: "bocconi.jpg",
reason: "partageait milan.jpg avec Politecnico di Milano, qui garde cette photo."
},
{
match: (name) => normalize(name) === "yonsei university",
label: "Yonsei University",
newImage: "yonsei.jpg",
reason: "partageait seoul.jpg avec Korea University, qui garde cette photo."
},
{
match: (name) => normalize(name) === "waseda university",
label: "Waseda University",
newImage: "waseda.jpg",
reason: "partageait tokyo.jpg avec University of Tokyo, qui garde cette photo."
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

log(analyzeLog, "Lecture de toutes les universités...");

const universitiesSnap = await getDocs(collection(db, "universities"));
const universities = universitiesSnap.docs.map((d) => ({ id: d.id, data: d.data() }));

log(analyzeLog, `${universities.length} université(s) lue(s). Recherche des 14 universités du lot 13 par nom...`, "ok");

const plan = [];
let failed = false;

for (const fix of FIXES) {

const matches = universities.filter((u) => fix.match(u.data.name || ""));

if (matches.length !== 1) {
log(analyzeLog, `ERREUR : ${matches.length} document(s) trouvé(s) pour "${fix.label}" (1 attendu). Résolution manuelle requise.`, "err");
matches.forEach((m) => log(analyzeLog, `  - ${m.id} ("${m.data.name}")`, "err"));
failed = true;
continue;
}

const u = matches[0];
const before = u.data.image || "";

if (before === fix.newImage) {
log(analyzeLog, `"${u.data.name}" (${u.id}) : déjà sur "${fix.newImage}", aucun changement nécessaire.`, "ok");
continue;
}

log(analyzeLog, `"${u.data.name}" (${u.id}) — ${fix.reason}`, "ok");
log(analyzeLog, `  image : "${before}" -> "${fix.newImage}"`, "ok");

plan.push({ id: u.id, name: u.data.name, newImage: fix.newImage });

}

if (failed) {
log(analyzeLog, "Anomalie(s) détectée(s) — corriger avant de passer à l'étape 2. AUCUNE écriture ne sera faite.", "err");
return;
}

if (!plan.length) {
log(analyzeLog, "Rien à écrire : les 14 documents sont déjà corrects. Étape 2 inutile.", "ok");
lastPlan = null;
return;
}

lastPlan = plan;

log(analyzeLog, `Analyse terminée, ${plan.length} document(s) à mettre à jour (merge, champ "image" seulement).`, "ok");
log(analyzeLog, `RAPPEL : vérifier que les 14 fichiers existent dans assets/images/cities/ (scripts/add-lot13-more-unique-photos.ps1) avant de continuer.`, "warn");

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
log(verifyLog, "ÉCRITURE EN BASE CONFIRMÉE — lot 13 terminé, 0 écart. Vérifiez ensuite visuellement chaque page université dans le navigateur.", "ok");
} else {
log(verifyLog, `ÉCHEC — ${mismatch} écart(s) détecté(s). Si ce sont les MÊMES documents qui viennent d'être écrits à l'instant, relancez simplement l'étape 3 : Firestore peut prendre quelques secondes à propager l'écriture (déjà vu au lot 12). Sinon, voir le détail ci-dessus.`, "err");
}

} catch (error) {

console.error(error);
log(verifyLog, `Erreur : ${error.message}`, "err");

} finally {

verifyBtn.disabled = false;

}

});
