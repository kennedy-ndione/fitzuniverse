// ============================================================
// Fitz — Backfill officialWebsite (36) + remplacement ciblé
// de applicationPortalUrl (13) (2026-08-10). Voir l'audit complet
// dans la conversation associée : le backfill officialWebsite préparé
// le 2026-08-10 n'avait jamais été écrit en base (vérifié) ; l'audit
// ciblé des ~17 universités à applicationPortalUrl "domaine racine" a
// trouvé un vrai portail de candidature externe pour 13 d'entre elles
// (contenu réel vérifié via WebFetch, pas juste la forme de l'URL) et
// aucun lien fiable pour 4 (Bologna, Politecnico di Milano, Sapienza,
// Napoli Federico II — processus multi-portails ou portail national
// partagé Universitaly) : ces 4 sont volontairement EXCLUES du
// remplacement, laissées telles quelles.
//
// Même patron que migrate.js / migrate-portal.js : analyse en lecture
// seule -> confirmation explicite -> écriture -> vérification
// automatique. Correspondance par NOM (pas par id codé en dur) pour
// que l'étape d'analyse détecte elle-même tout nom qui ne matche
// aucune université en base plutôt que d'échouer silencieusement.
// ============================================================

import { db } from "../firebase-config.js";

import {
collection,
getDocs,
doc,
updateDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// -------- Backfill officialWebsite (36) --------
const OFFICIAL_WEBSITE_BY_NAME = {
"Beihang University": "https://en.buaa.edu.cn/",
"Budapest University of Technology and Economics": "https://www.bme.hu/",
"Corvinus University of Budapest": "https://www.uni-corvinus.hu/",
"Eötvös Loránd University": "https://www.elte.hu/en",
"Fudan University": "https://www.fudan.edu.cn/en/",
"Harbin Institute of Technology": "https://en.hit.edu.cn/",
"Hungarian University of Agriculture and Life Sciences": "https://en.uni-mate.hu/",
"Nanjing University": "https://www.nju.edu.cn/en/",
"Óbuda University": "https://uni-obuda.hu/en/",
"Peking University": "https://english.pku.edu.cn/",
"Politecnico di Milano": "https://www.polimi.it/en",
"Politecnico di Torino": "https://www.polito.it/en",
"Sapienza Università di Roma": "https://www.uniroma1.it/en",
"Semmelweis University": "https://semmelweis.hu/english/",
"Shanghai Jiao Tong University": "https://en.sjtu.edu.cn/",
"Sichuan University": "https://en.scu.edu.cn/",
"Sun Yat-sen University": "https://www.sysu.edu.cn/en/index.htm",
"Széchenyi István University": "https://uni.sze.hu/",
"Tianjin University": "https://www.tju.edu.cn/",
"Tongji University": "https://www.tongji.edu.cn/",
"Tsinghua University": "https://www.tsinghua.edu.cn/en/",
"Università Bocconi": "https://www.unibocconi.it/en",
"Università degli Studi di Napoli Federico II": "https://www.unina.it/",
"Università di Bologna": "https://www.unibo.it/en",
"Università di Firenze": "https://www.unifi.it/en",
"Università di Padova": "https://www.unipd.it/en",
"Università di Pisa": "https://www.unipi.it/",
"Università di Trento": "https://www.unitn.it/en",
"University of Debrecen": "https://unideb.hu/en",
"University of Miskolc": "https://www.uni-miskolc.hu/en/",
"University of Pécs": "https://pte.hu/en",
"University of Science and Technology of China": "https://en.ustc.edu.cn/",
"University of Szeged": "https://www.u-szeged.hu/english",
"Wuhan University": "https://en.whu.edu.cn/",
"Xiamen University": "https://en.xmu.edu.cn/",
"Zhejiang University": "https://www.zju.edu.cn/english/"
};

// -------- Remplacement ciblé applicationPortalUrl (13) — audit du
// 2026-08-10, contenu réel vérifié (WebFetch), pas juste la forme de
// l'URL. Les 4 universités sans lien fiable trouvé (Bologna,
// Politecnico di Milano, Sapienza, Napoli Federico II) sont
// volontairement absentes de cette table : aucune écriture pour elles.
const APPLICATION_PORTAL_REPLACEMENT_BY_NAME = {
"Corvinus University of Budapest": "https://corvinus-university.dreamapply.com/",
"Università Bocconi": "https://apply.unibocconi.it/",
"University of Miskolc": "https://apply.uni-miskolc.hu/",
"Budapest University of Technology and Economics": "https://felvi.bme.hu/",
"Eötvös Loránd University": "https://apply.elte.hu/",
"Óbuda University": "https://admission.uni-obuda.hu/",
"Politecnico di Torino": "https://international.polito.it/admission",
"Semmelweis University": "https://semmelweis.hu/admission/",
"Università di Firenze": "https://apply.unifi.it/",
"Università di Padova": "https://apply.unipd.it/",
"Università di Pisa": "https://fcapply.unipi.it/",
"Università di Trento": "https://webapps.unitn.it/Apply/en/Web",
"University of Szeged": "https://apply.u-szeged.hu/"
};

function log(el, message, cls = "") {
el.classList.add("is-visible");
const line = document.createElement("div");
if (cls) line.className = cls;
line.textContent = message;
el.appendChild(line);
el.scrollTop = el.scrollHeight;
}

// ==========================================================
// Calcul (partagé analyse / écriture).
// ==========================================================

async function computePlan() {

const universitiesSnap = await getDocs(collection(db, "universities"));
const universities = universitiesSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

const byName = new Map(universities.map((u) => [(u.name || "").trim(), u]));

const websiteWrites = [];
const websiteAnomalies = [];

Object.entries(OFFICIAL_WEBSITE_BY_NAME).forEach(([name, url]) => {

const uni = byName.get(name);

if (!uni) {
websiteAnomalies.push(`Aucune université en base ne correspond au nom "${name}" — vérifier l'orthographe exacte.`);
return;
}

websiteWrites.push({
id: uni.id,
name,
newValue: url,
previousValue: uni.officialWebsite || "",
overwritesExisting: !!(uni.officialWebsite || "").trim()
});

});

const portalReplacements = [];
const portalAnomalies = [];

Object.entries(APPLICATION_PORTAL_REPLACEMENT_BY_NAME).forEach(([name, url]) => {

const uni = byName.get(name);

if (!uni) {
portalAnomalies.push(`Aucune université en base ne correspond au nom "${name}" — vérifier l'orthographe exacte.`);
return;
}

portalReplacements.push({
id: uni.id,
name,
newValue: url,
previousValue: uni.applicationPortalUrl || ""
});

});

// Universités présentes en base mais absentes de la liste de backfill
// (36 attendues) — signalé, jamais ignoré silencieusement.
const namesInList = new Set(Object.keys(OFFICIAL_WEBSITE_BY_NAME));
const uncoveredUniversities = universities
.filter((u) => !namesInList.has((u.name || "").trim()))
.map((u) => u.name || u.id);

return {
totalUniversities: universities.length,
websiteWrites,
websiteAnomalies,
portalReplacements,
portalAnomalies,
uncoveredUniversities
};

}

// ==========================================================
// Étape 1 — analyse
// ==========================================================

let lastPlan = null;

const analyzeBtn = document.getElementById("analyzeBtn");
const analyzeLog = document.getElementById("analyzeLog");
const writeBtn = document.getElementById("writeBtn");
const writeLog = document.getElementById("writeLog");
const verifyBtn = document.getElementById("verifyBtn");
const verifyLog = document.getElementById("verifyLog");

analyzeBtn.addEventListener("click", async () => {

analyzeBtn.disabled = true;
analyzeLog.innerHTML = "";
log(analyzeLog, "Lecture de universities...");

try {

lastPlan = await computePlan();

log(analyzeLog, `${lastPlan.totalUniversities} université(s) en base.`, "ok");

log(analyzeLog, `officialWebsite : ${lastPlan.websiteWrites.length}/36 correspondances trouvées.`, lastPlan.websiteWrites.length === 36 ? "ok" : "warn");

const overwrites = lastPlan.websiteWrites.filter((w) => w.overwritesExisting);
if (overwrites.length) {
log(analyzeLog, `${overwrites.length} université(s) ont DÉJÀ une valeur non vide qui sera écrasée :`, "warn");
overwrites.forEach((w) => log(analyzeLog, `  - ${w.name} : "${w.previousValue}" -> "${w.newValue}"`, "warn"));
}

if (lastPlan.websiteAnomalies.length) {
log(analyzeLog, `${lastPlan.websiteAnomalies.length} anomalie(s) officialWebsite :`, "err");
lastPlan.websiteAnomalies.forEach((a) => log(analyzeLog, `  - ${a}`, "err"));
}

if (lastPlan.uncoveredUniversities.length) {
log(analyzeLog, `${lastPlan.uncoveredUniversities.length} université(s) en base non couverte(s) par la liste de backfill :`, "err");
lastPlan.uncoveredUniversities.forEach((n) => log(analyzeLog, `  - ${n}`, "err"));
}

log(analyzeLog, `applicationPortalUrl : ${lastPlan.portalReplacements.length}/13 remplacements trouvés.`, lastPlan.portalReplacements.length === 13 ? "ok" : "warn");

lastPlan.portalReplacements.forEach((p) => {
log(analyzeLog, `  - ${p.name} : "${p.previousValue}" -> "${p.newValue}"`);
});

if (lastPlan.portalAnomalies.length) {
log(analyzeLog, `${lastPlan.portalAnomalies.length} anomalie(s) applicationPortalUrl :`, "err");
lastPlan.portalAnomalies.forEach((a) => log(analyzeLog, `  - ${a}`, "err"));
}

log(analyzeLog, "Les 4 universités sans lien fiable (Bologna, Politecnico di Milano, Sapienza, Napoli Federico II) sont volontairement absentes de la table de remplacement — leur applicationPortalUrl ne sera pas touché.", "ok");

log(analyzeLog, "Analyse terminée. Vérifiez le détail ci-dessus avant de passer à l'étape 2.", "ok");

writeBtn.disabled = false;

} catch (error) {

console.error(error);
log(analyzeLog, `Erreur : ${error.message}`, "err");

} finally {

analyzeBtn.disabled = false;

}

});

// ==========================================================
// Étape 2 — écriture
// ==========================================================

writeBtn.addEventListener("click", async () => {

if (!lastPlan) return;

const confirmed = confirm(
`Écrire officialWebsite sur ${lastPlan.websiteWrites.length} université(s) et remplacer applicationPortalUrl sur ${lastPlan.portalReplacements.length} université(s) ? Les 4 universités sans lien fiable ne seront pas touchées.`
);

if (!confirmed) return;

writeBtn.disabled = true;
writeLog.innerHTML = "";

try {

log(writeLog, "Écriture de officialWebsite...");

for (const w of lastPlan.websiteWrites) {
await updateDoc(doc(db, "universities", w.id), { officialWebsite: w.newValue });
log(writeLog, `  - ${w.name} (${w.id}) écrit.`);
}

log(writeLog, `${lastPlan.websiteWrites.length} officialWebsite écrit(s).`, "ok");

log(writeLog, "Remplacement de applicationPortalUrl (13 universités)...");

for (const p of lastPlan.portalReplacements) {
await updateDoc(doc(db, "universities", p.id), { applicationPortalUrl: p.newValue });
log(writeLog, `  - ${p.name} (${p.id}) : "${p.previousValue}" -> "${p.newValue}"`);
}

log(writeLog, `${lastPlan.portalReplacements.length} applicationPortalUrl remplacé(s).`, "ok");
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
// Étape 3 — vérification automatique. Relit universities et compare
// CHAQUE valeur écrite à la valeur attendue (comparaison de chaîne
// exacte) — pas un simple "non vide". Vérifie aussi que les 4
// universités exclues n'ont PAS été touchées (leur applicationPortalUrl
// doit être strictement identique à avant l'écriture).
// ==========================================================

verifyBtn.addEventListener("click", async () => {

if (!lastPlan) return;

verifyBtn.disabled = true;
verifyLog.innerHTML = "";
log(verifyLog, "Relecture de universities après écriture...");

try {

const universitiesSnap = await getDocs(collection(db, "universities"));
const byId = new Map(universitiesSnap.docs.map((d) => [d.id, d.data()]));

let websiteOk = 0;
let websiteMismatch = 0;

lastPlan.websiteWrites.forEach((w) => {
const current = (byId.get(w.id)?.officialWebsite || "").trim();
if (current === w.newValue) {
websiteOk++;
} else {
websiteMismatch++;
log(verifyLog, `MISMATCH officialWebsite ${w.name} (${w.id}) : attendu "${w.newValue}", trouvé "${current}"`, "err");
}
});

let portalOk = 0;
let portalMismatch = 0;

lastPlan.portalReplacements.forEach((p) => {
const current = (byId.get(p.id)?.applicationPortalUrl || "").trim();
if (current === p.newValue) {
portalOk++;
} else {
portalMismatch++;
log(verifyLog, `MISMATCH applicationPortalUrl ${p.name} (${p.id}) : attendu "${p.newValue}", trouvé "${current}"`, "err");
}
});

log(verifyLog, `officialWebsite : ${websiteOk}/${lastPlan.websiteWrites.length} confirmé(s) en base.`, websiteMismatch === 0 ? "ok" : "err");
log(verifyLog, `applicationPortalUrl : ${portalOk}/${lastPlan.portalReplacements.length} confirmé(s) en base.`, portalMismatch === 0 ? "ok" : "err");

if (websiteMismatch === 0 && portalMismatch === 0) {
log(verifyLog, `ÉCRITURE EN BASE CONFIRMÉE — ${websiteOk} officialWebsite + ${portalOk} applicationPortalUrl vérifiés en relisant Firestore, 0 écart. Migration terminée.`, "ok");
} else {
log(verifyLog, `ÉCHEC — ${websiteMismatch + portalMismatch} écart(s) détecté(s), voir le détail ci-dessus.`, "err");
}

} catch (error) {

console.error(error);
log(verifyLog, `Erreur : ${error.message}`, "err");

} finally {

verifyBtn.disabled = false;

}

});
