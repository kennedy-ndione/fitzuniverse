// ============================================================
// ScholarBridge — Correctif catalogue, Lot 18 (2026-08-28)
// Ne crée ni ne supprime aucun document. Ajoute (setDoc merge) le
// champ "applicationPortalUrl" à 14 universités où seul
// "officialWebsite" était renseigné (tâche #10, identifiées par
// l'audit initial et re-vérifiées en direct via
// admin/diag-missing-portal.js avant ce lot).
//
// Même patron de sécurité que les lots précédents (ex. lot 10,
// correctif King Saud University / Istanbul University) : id connu
// (relu en direct via diag-missing-portal.js juste avant ce lot),
// re-vérifié en direct par comparaison de nom avant toute écriture.
// Ne touche jamais "officialWebsite", uniquement "applicationPortalUrl".
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

// -------- Les 14 universités à corriger, id connu + nom attendu
// pour re-vérification live avant toute écriture --------
const FIXES = [
{ id: "delft-university-of-technology-delft", expectedNameIncludes: "delft university of technology", newPortalUrl: "https://www.tudelft.nl/en/education/admission-and-application", reason: "page officielle « Admission and Application », TU Delft." },
{ id: "jagiellonian-university-cracovie", expectedNameIncludes: "jagiellonian university", newPortalUrl: "https://welcome.uj.edu.pl/en_GB/admission", reason: "portail « Welcome to the Jagiellonian University », admission des étudiants internationaux." },
{ id: "jawaharlal-nehru-university-delhi", expectedNameIncludes: "jawaharlal nehru university", newPortalUrl: "https://jnuee.jnu.ac.in/", reason: "portail officiel des examens d'entrée / candidatures, JNU." },
{ id: "kth-royal-institute-of-technology-stockholm", expectedNameIncludes: "kth royal institute of technology", newPortalUrl: "https://www.kth.se/en/studies/master/admissions/how-to-apply-for-masters-studies-1.68487", reason: "page officielle « How to apply for master's studies », KTH." },
{ id: "universiti-kebangsaan-malaysia-kuala-lumpur", expectedNameIncludes: "universiti kebangsaan malaysia", newPortalUrl: "https://join.ukm.my/", reason: "JOIN UKM, portail officiel de candidature." },
{ id: "universiti-malaya-kuala-lumpur", expectedNameIncludes: "universiti malaya", newPortalUrl: "https://study.um.edu.my/how-to-apply", reason: "Study@UM, page officielle « How to Apply »." },
{ id: "university-of-amsterdam-amsterdam", expectedNameIncludes: "university of amsterdam", newPortalUrl: "https://www.uva.nl/en/education/admissions/admissions.html", reason: "page officielle « Applying to a programme », UvA." },
{ id: "university-of-cape-town-le-cap", expectedNameIncludes: "university of cape town", newPortalUrl: "https://uct.ac.za/postgraduate-hub/apply-uct-international-applications/application-process-international-students", reason: "processus de candidature dédié aux étudiants internationaux, UCT." },
{ id: "university-of-delhi-delhi", expectedNameIncludes: "university of delhi", newPortalUrl: "https://fsr.du.ac.in/", reason: "Foreign Students' Registry, portail officiel des candidatures internationales, University of Delhi." },
{ id: "university-of-gothenburg-goteborg", expectedNameIncludes: "university of gothenburg", newPortalUrl: "https://www.gu.se/en/study-gothenburg/application-instructions", reason: "page officielle « Application instructions », University of Gothenburg." },
{ id: "university-of-lisbon-lisbonne", expectedNameIncludes: "university of lisbon", newPortalUrl: "https://estudanteinternacional.ulisboa.pt/index-en.html", reason: "International Student Guide, portail officiel dédié aux candidats internationaux, ULisboa." },
{ id: "university-of-porto-porto", expectedNameIncludes: "university of porto", newPortalUrl: "https://www.up.pt/portal/en/study/international-students/special-call-for-applications/", reason: "page officielle candidatures étudiants internationaux, University of Porto." },
{ id: "university-of-the-witwatersrand-johannesburg", expectedNameIncludes: "university of the witwatersrand", newPortalUrl: "https://www.wits.ac.za/internationalstudents/", reason: "portail officiel dédié aux étudiants internationaux, Wits." },
{ id: "university-of-warsaw-varsovie", expectedNameIncludes: "university of warsaw", newPortalUrl: "https://irk.uw.edu.pl/en-gb/", reason: "IRK, système officiel de recrutement en ligne des candidats, University of Warsaw." }
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

log(analyzeLog, "Vérification en direct des 14 documents à corriger...");

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

if (!current.officialWebsite) {
log(analyzeLog, `AVERTISSEMENT : universities/${fix.id} ("${name}") n'a pas non plus de officialWebsite — vérifier avant d'écrire.`, "warn");
}

const before = current.applicationPortalUrl || "";

if (before === fix.newPortalUrl) {
log(analyzeLog, `"${name}" (${fix.id}) : déjà sur "${fix.newPortalUrl}", aucun changement nécessaire.`, "ok");
continue;
}

if (before) {
log(analyzeLog, `ATTENTION : universities/${fix.id} ("${name}") a déjà un applicationPortalUrl différent ("${before}") — vérifier avant d'écrire.`, "warn");
}

log(analyzeLog, `"${name}" (${fix.id}) — ${fix.reason}`, "ok");
log(analyzeLog, `  applicationPortalUrl : "${before || "(absent)"}" -> "${fix.newPortalUrl}"`, "ok");

plan.push({ id: fix.id, name, newPortalUrl: fix.newPortalUrl });

}

if (failed) {
log(analyzeLog, "Anomalie(s) détectée(s) — corriger avant de passer à l'étape 2.", "err");
return;
}

if (!plan.length) {
log(analyzeLog, "Rien à écrire : les 14 documents sont déjà corrects. Étape 2 inutile.", "ok");
lastPlan = null;
return;
}

lastPlan = plan;

log(analyzeLog, `Analyse terminée, ${plan.length} document(s) à mettre à jour (merge, champ "applicationPortalUrl" seulement — "officialWebsite" n'est jamais touché).`, "ok");

writeBtn.disabled = false;

} catch (error) {

console.error(error);
log(analyzeLog, `Erreur : ${error.message}`, "err");

} finally {

analyzeBtn.disabled = false;

}

});

// ==========================================================
// Étape 2 — écriture (merge, champ "applicationPortalUrl" seulement)
// ==========================================================

writeBtn.addEventListener("click", async () => {

if (!lastPlan) return;

const confirmed = confirm(
`Ajouter le lien de candidature (applicationPortalUrl) de ${lastPlan.length} université(s) (mise à jour partielle, merge, "officialWebsite" non touché) ? Cette action écrit en base de production.`
);

if (!confirmed) return;

writeBtn.disabled = true;
writeLog.innerHTML = "";

try {

for (const item of lastPlan) {
await setDoc(doc(db, "universities", item.id), { applicationPortalUrl: item.newPortalUrl }, { merge: true });
log(writeLog, `"${item.name}" (${item.id}) -> ${item.newPortalUrl}.`);
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
const fieldsMatch = current && current.applicationPortalUrl === item.newPortalUrl;

if (fieldsMatch) {
ok++;
log(verifyLog, `"${item.name}" (${item.id}) : confirmé (${item.newPortalUrl}).`, "ok");
} else {
mismatch++;
log(verifyLog, `MISMATCH "${item.name}" (${item.id}) : document ${current ? "trouvé mais différent" : "introuvable"}.`, "err");
}

}

log(verifyLog, `${ok}/${lastPlan.length} document(s) confirmé(s) en base.`, mismatch === 0 ? "ok" : "err");

if (mismatch === 0) {
log(verifyLog, "ÉCRITURE EN BASE CONFIRMÉE — lot 18 terminé, 0 écart. Les 14 applicationPortalUrl manquants sont maintenant tous renseignés. Vérifiez ensuite visuellement quelques fiches université dans le navigateur (le lien de candidature doit être distinct du site officiel).", "ok");
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
