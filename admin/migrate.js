// ============================================
// Fitz — Migration vers l'architecture relationnelle
// (2026-07-30). Voir le contexte complet en tête de admin/migrate.html
// et dans admin/firebase-admin.js. Outil à usage unique, non lié dans
// la navigation, protégé par admin-auth.js comme toute page admin/.
// ============================================

import { db } from "../firebase-config.js";

import {
collection,
getDocs,
doc,
setDoc,
updateDoc,
deleteDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// Doublon de test confirmé par l'utilisateur (session du 2026-07-30) —
// exclu définitivement de la migration plutôt que fusionné par
// heuristique.
const EXCLUDED_SCHOLARSHIP_IDS = ["china_csc_2027"];

const LEVEL_ORDER = ["Licence", "Master", "Doctorat"];

// Plage Unicode des diacritiques combinants (U+0300–U+036F), construite
// via des codes numériques plutôt que des caractères littéraux dans le
// code source, pour éviter tout risque d'ambiguïté d'encodage.
const DIACRITICS_RANGE_START = String.fromCharCode(0x0300);
const DIACRITICS_RANGE_END = String.fromCharCode(0x036f);
const DIACRITICS_PATTERN = new RegExp(`[${DIACRITICS_RANGE_START}-${DIACRITICS_RANGE_END}]`, "g");

function slugify(value) {
return String(value || "")
.toLowerCase()
.normalize("NFD")
.replace(DIACRITICS_PATTERN, "")
.replace(/[^a-z0-9]+/g, "-")
.replace(/^-+|-+$/g, "") || "sans-nom";
}

function uniqueSlug(base, used) {
let slug = base;
let n = 2;
while (used.has(slug)) {
slug = `${base}-${n}`;
n++;
}
used.add(slug);
return slug;
}

function log(el, message, cls = "") {
el.classList.add("is-visible");
const line = document.createElement("div");
if (cls) line.className = cls;
line.textContent = message;
el.appendChild(line);
el.scrollTop = el.scrollHeight;
}

// ==========================================================
// Calcul (partagé entre l'analyse en lecture seule et l'écriture
// réelle, pour que les deux ne puissent jamais diverger).
// ==========================================================

async function computePlan() {

const [scholarshipsSnap, universitiesSnap] = await Promise.all([
getDocs(collection(db, "scholarships")),
getDocs(collection(db, "universities"))
]);

const rawScholarships = scholarshipsSnap.docs
.map((d) => ({ id: d.id, ...d.data() }))
.filter((s) => !EXCLUDED_SCHOLARSHIP_IDS.includes(s.id));

const rawUniversities = universitiesSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

// ---- Bourses consolidées : un doc par titre, levels[] fusionné ----
const scholarshipGroups = new Map();
const scholarshipCountryConflicts = [];

rawScholarships.forEach((s) => {

const key = (s.title || "").trim();

if (!scholarshipGroups.has(key)) {
scholarshipGroups.set(key, { title: s.title, country: s.country, funding: s.funding, description: s.description || "", status: s.status, isActive: false, levels: [], oldIds: [] });
}

const group = scholarshipGroups.get(key);

// Un même titre avec un pays différent d'un document à l'autre est
// suspect (deux programmes distincts partageant un nom par erreur de
// saisie ?) — signalé, jamais fusionné silencieusement.
if (group.country && s.country && group.country !== s.country) {
scholarshipCountryConflicts.push({ title: key, countries: [group.country, s.country], docIds: [...group.oldIds, s.id] });
}

if (s.level) group.levels.push(s.level);
if (s.isActive !== false) group.isActive = true;
if (!group.description && s.description) group.description = s.description;
group.oldIds.push(s.id);

});

// Découverte de bourses qui n'ont JAMAIS existé comme document dans
// "scholarships" — uniquement comme texte libre sur des documents
// "universities" (ex. chaque université italienne a sa propre bourse
// nommée, jamais saisie séparément). Sans ce passage, ces programmes
// réels deviendraient des "programmes orphelins" alors qu'ils sont
// simplement incomplets dans le catalogue actuel — les promouvoir en
// vraies bourses, à partir des données déjà présentes sur le
// document université, est la seule façon de ne rien perdre.
const titlesKnownBeforeDiscovery = new Set(scholarshipGroups.keys());
const discoveredScholarships = [];

rawUniversities.forEach((u) => {

const key = (u.scholarship || "").trim();

if (!key || titlesKnownBeforeDiscovery.has(key)) return;

if (!scholarshipGroups.has(key)) {
scholarshipGroups.set(key, { title: u.scholarship, country: u.country, funding: u.funding, description: "", status: u.status, isActive: false, levels: [], oldIds: [], discovered: true });
discoveredScholarships.push(key);
}

const group = scholarshipGroups.get(key);

if (u.level) group.levels.push(u.level);
if (u.isActive !== false) group.isActive = true;

});

const usedScholarshipSlugs = new Set();

const cleanScholarships = [...scholarshipGroups.values()].map((group) => {

const newId = uniqueSlug(slugify(group.title), usedScholarshipSlugs);

return {
newId,
oldIds: group.oldIds,
idsToDelete: group.oldIds.filter((id) => id !== newId),
data: {
title: group.title,
country: group.country || "",
funding: group.funding || "",
description: group.description || "",
status: group.status || "Ouverte",
isActive: group.isActive,
levels: [...new Set(group.levels)].sort((a, b) => LEVEL_ORDER.indexOf(a) - LEVEL_ORDER.indexOf(b)),
officialWebsite: "",
generalCriteria: ""
}
};

});

const scholarshipIdByTitle = new Map(cleanScholarships.map((s) => [s.data.title, s.newId]));

// ---- Universités dédupliquées : un doc par (nom, ville) ----
const universityGroups = new Map();

rawUniversities.forEach((u) => {

const key = `${(u.university || "").trim()}|${(u.city || "").trim()}`;

if (!universityGroups.has(key)) {
universityGroups.set(key, {
name: u.university || "Université sans nom",
city: u.city || "",
country: u.country || "",
image: u.image || "",
flag: u.flag || "",
ranking: u.ranking || "",
description: u.description || ""
});
}

const group = universityGroups.get(key);
if (!group.description && u.description) group.description = u.description;
if (!group.ranking && u.ranking) group.ranking = u.ranking;

});

const usedUniversitySlugs = new Set();

const universityIdByKey = new Map();
const cleanUniversities = [];

universityGroups.forEach((group, key) => {

const newId = uniqueSlug(slugify(`${group.name}-${group.city}`), usedUniversitySlugs);

universityIdByKey.set(key, newId);

cleanUniversities.push({
newId,
data: {
name: group.name,
city: group.city,
country: group.country,
image: group.image,
flag: group.flag,
ranking: group.ranking,
description: group.description,
officialWebsite: "",
fields: []
}
});

});

// ---- Programmes : une entrée par ancien document d'offre. Un
// document sans bourse reconnue (champ "scholarship" vide ou ne
// correspondant à aucun titre connu — le bug historique de
// admin/universities.js qui posait "scholarship":"" en dur) est
// migré quand même, avec scholarshipId=null, plutôt que perdu : ses
// données (deadline, portail, langue...) restent exploitables, à
// rattacher manuellement depuis la fiche université. ----
const programs = [];
const orphans = [];

rawUniversities.forEach((u) => {

const universityKey = `${(u.university || "").trim()}|${(u.city || "").trim()}`;
const universityId = universityIdByKey.get(universityKey);

const scholarshipId = scholarshipIdByTitle.get((u.scholarship || "").trim()) || null;

if (!scholarshipId) {
orphans.push({ oldId: u.id, university: u.university, scholarshipText: u.scholarship || "(vide)" });
}

programs.push({
// Même ID que l'ancien document : les liens existants
// (scholarship-details.html?id=...) continuent de fonctionner.
id: u.id,
data: {
universityId,
scholarshipId,
level: u.level || "",
deadline: u.deadline || "",
applicationUrl: u.applicationUrl || "",
language: u.language || "",
duration: u.duration || "",
coverage: u.coverage || "",
description: u.description || "",
status: u.status || "",
isActive: u.isActive !== false
}
});

});

return {
rawScholarshipsCount: rawScholarships.length,
rawUniversitiesCount: rawUniversities.length,
cleanScholarships,
cleanUniversities,
programs,
orphans,
scholarshipCountryConflicts,
discoveredScholarships
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
const finalizeBtn = document.getElementById("finalizeBtn");
const finalizeLog = document.getElementById("finalizeLog");

analyzeBtn.addEventListener("click", async () => {

analyzeBtn.disabled = true;
analyzeLog.innerHTML = "";
log(analyzeLog, "Lecture des collections scholarships / universities...");

try {

lastPlan = await computePlan();

log(analyzeLog, `Bourses : ${lastPlan.rawScholarshipsCount} documents source -> ${lastPlan.cleanScholarships.length} bourses consolidées.`, "ok");

if (lastPlan.discoveredScholarships.length) {
log(analyzeLog, `dont ${lastPlan.discoveredScholarships.length} bourse(s) découverte(s) UNIQUEMENT en texte libre sur des documents universities (jamais saisies dans scholarships) — promues en vraies bourses plutôt que perdues :`, "warn");
lastPlan.discoveredScholarships.forEach((title) => log(analyzeLog, `  - "${title}"`, "warn"));
}

log(analyzeLog, `Universités : ${lastPlan.rawUniversitiesCount} documents source -> ${lastPlan.cleanUniversities.length} universités dédupliquées.`, "ok");
log(analyzeLog, `Programmes (relations) à créer : ${lastPlan.programs.length} (aucune donnée source perdue — voir orphelins ci-dessous).`, "ok");

if (lastPlan.scholarshipCountryConflicts.length) {
log(analyzeLog, `${lastPlan.scholarshipCountryConflicts.length} bourse(s) avec le même titre mais un pays différent selon le document — vérifiez qu'il ne s'agit pas de deux programmes distincts avant de continuer :`, "warn");
lastPlan.scholarshipCountryConflicts.forEach((c) => log(analyzeLog, `  - "${c.title}" : pays ${c.countries.join(" / ")} (docs ${c.docIds.join(", ")})`, "warn"));
}

if (lastPlan.orphans.length) {
log(analyzeLog, `${lastPlan.orphans.length} programme(s) migré(s) SANS bourse reconnue (scholarshipId=null) — leurs données (deadline, portail...) sont conservées, à rattacher manuellement depuis la fiche université après migration :`, "warn");
lastPlan.orphans.forEach((o) => log(analyzeLog, `  - ${o.oldId} (${o.university || "?"}) — champ scholarship="${o.scholarshipText}"`, "warn"));
}

log(analyzeLog, "Analyse terminée. Vérifiez les chiffres ci-dessus avant de passer à l'étape 2.", "ok");

writeBtn.disabled = false;
writeBtn.textContent = "Écrire";

} catch (error) {

console.error(error);
log(analyzeLog, `Erreur : ${error.message}`, "err");

} finally {

analyzeBtn.disabled = false;

}

});

// ==========================================================
// Étape 2 — écriture (scholarships nettoyées + programs +
// universities_draft) — n'importe jamais l'ancienne collection
// "universities", donc réversible sans perte tant que l'étape 3 n'a
// pas tourné.
// ==========================================================

writeBtn.addEventListener("click", async () => {

if (!lastPlan) return;

const confirmed = confirm(`Écrire ${lastPlan.cleanScholarships.length} bourses, ${lastPlan.programs.length} programmes et ${lastPlan.cleanUniversities.length} profils bruts dans Firebase ?`);
if (!confirmed) return;

writeBtn.disabled = true;
writeLog.innerHTML = "";

try {

log(writeLog, "Consolidation de scholarships...");

for (const s of lastPlan.cleanScholarships) {
await setDoc(doc(db, "scholarships", s.newId), s.data);
for (const oldId of s.idsToDelete) {
await deleteDoc(doc(db, "scholarships", oldId));
}
}

for (const excludedId of EXCLUDED_SCHOLARSHIP_IDS) {
try { await deleteDoc(doc(db, "scholarships", excludedId)); } catch { /* déjà absent */ }
}

log(writeLog, `scholarships : ${lastPlan.cleanScholarships.length} documents finaux écrits.`, "ok");

log(writeLog, "Écriture de programs...");

for (const p of lastPlan.programs) {
await setDoc(doc(db, "programs", p.id), p.data);
}

log(writeLog, `programs : ${lastPlan.programs.length} documents écrits.`, "ok");

log(writeLog, "Écriture de universities_draft (profils propres)...");

for (const u of lastPlan.cleanUniversities) {
await setDoc(doc(db, "universities_draft", u.newId), u.data);
}

log(writeLog, `universities_draft : ${lastPlan.cleanUniversities.length} profils écrits.`, "ok");
log(writeLog, "Étape 2 terminée. Vérifiez le résultat (console Firebase), puis lancez l'étape 3 pour basculer universities.", "ok");

finalizeBtn.disabled = false;

} catch (error) {

console.error(error);
log(writeLog, `Erreur : ${error.message}`, "err");

} finally {

writeBtn.disabled = false;

}

});

// ==========================================================
// Étape 3 — finalisation (destructrice) : supprime les anciens
// documents d'offres dans "universities", recopie universities_draft
// à leur place.
// ==========================================================

finalizeBtn.addEventListener("click", async () => {

const confirmed = confirm("Ceci supprime définitivement les anciens documents de \"universities\" (déjà repris dans programs à l'étape 2) et les remplace par les profils propres. Continuer ?");
if (!confirmed) return;

finalizeBtn.disabled = true;
finalizeLog.innerHTML = "";

try {

log(finalizeLog, "Lecture de l'ancienne collection universities...");

const oldSnap = await getDocs(collection(db, "universities"));

log(finalizeLog, `Suppression de ${oldSnap.docs.length} anciens documents d'offres...`);

for (const d of oldSnap.docs) {
await deleteDoc(doc(db, "universities", d.id));
}

log(finalizeLog, "Anciens documents supprimés.", "ok");

log(finalizeLog, "Recopie de universities_draft vers universities...");

const draftSnap = await getDocs(collection(db, "universities_draft"));

for (const d of draftSnap.docs) {
await setDoc(doc(db, "universities", d.id), d.data());
await deleteDoc(doc(db, "universities_draft", d.id));
}

log(finalizeLog, `${draftSnap.docs.length} profils recopiés dans universities. Migration terminée.`, "ok");
log(finalizeLog, "Le catalogue public et le panneau admin peuvent maintenant utiliser la nouvelle architecture.", "ok");

} catch (error) {

console.error(error);
log(finalizeLog, `Erreur : ${error.message}`, "err");

} finally {

finalizeBtn.disabled = false;

}

});
