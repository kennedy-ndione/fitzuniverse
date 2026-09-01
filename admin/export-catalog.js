// ============================================================
// FitzUniverse — Export du catalogue (créé le 2026-08-30)
//
// POURQUOI CET OUTIL
// admin/audit-catalog.html AUDITE le catalogue (photos partagées,
// liens identiques, programmes orphelins) mais n'en EXPORTE pas le
// contenu. Or déduire l'état de la base depuis les fichiers
// admin/expand-catalog-batch*.js donne une image FAUSSE : au
// 2026-08-30, cette reconstitution annonçait 17 pays et ~74 bourses
// là où la base en contenait 100, dont une bourse suédoise
// (swedish-institute-scholarships-global-professionals) qui
// n'apparaissait dans aucun lot lisible.
//
// Cet outil produit un JSON compact, copiable en un clic, pour
// travailler sur l'état RÉEL de la base.
//
// Lecture seule. N'écrit rien, ne modifie rien.
// ============================================================

import { db } from "../firebase-config.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const runBtn = document.getElementById("runBtn");
const copyBtn = document.getElementById("copyBtn");
const summaryEl = document.getElementById("summary");
const outputEl = document.getElementById("output");

// Ce qu'on exporte, et pourquoi ces champs-là : de quoi identifier une
// bourse, savoir à quel pays elle appartient, si elle est visible, et
// si son éligibilité par nationalité est renseignée. Volontairement
// SANS les longs textes (funding, description, generalCriteria) —
// l'export doit rester lisible et collable dans une conversation.
function resumeBourse(id, d) {
return {
id,
titre: d.title || "",
pays: d.country || "",
niveaux: Array.isArray(d.levels) ? d.levels : [],
statut: d.status || "",
actif: d.isActive !== false,
site: d.officialWebsite || "",
image: d.image || "",
eligibilite: d.eligibility
? {
scope: d.eligibility.scope || null,
groups: d.eligibility.groups || [],
include: d.eligibility.include || [],
exclude: d.eligibility.exclude || [],
note: d.eligibility.note ? "(renseignée)" : null
}
: null
};
}

function resumeUniversite(id, d) {
return {
id,
nom: d.name || "",
ville: d.city || "",
pays: d.country || "",
image: d.image || "",
site: d.officialWebsite || "",
portail: d.applicationPortalUrl || ""
};
}

runBtn.addEventListener("click", async () => {

runBtn.disabled = true;
summaryEl.textContent = "Lecture de Firestore...";
outputEl.value = "";
copyBtn.disabled = true;

try {

const [boursesSnap, universitesSnap, programmesSnap] = await Promise.all([
getDocs(collection(db, "scholarships")),
getDocs(collection(db, "universities")),
getDocs(collection(db, "programs"))
]);

const bourses = boursesSnap.docs
.map((d) => resumeBourse(d.id, d.data()))
.sort((a, b) => (a.pays + a.titre).localeCompare(b.pays + b.titre, "fr"));

const universites = universitesSnap.docs
.map((d) => resumeUniversite(d.id, d.data()))
.sort((a, b) => (a.pays + a.nom).localeCompare(b.pays + b.nom, "fr"));

const programmes = programmesSnap.docs.map((d) => ({
id: d.id,
universityId: d.data().universityId || "",
scholarshipId: d.data().scholarshipId || ""
}));

// --- Statistiques utiles à lire d'un coup d'œil
const parPays = {};
bourses.forEach((b) => { parPays[b.pays || "(sans pays)"] = (parPays[b.pays || "(sans pays)"] || 0) + 1; });

const sansEligibilite = bourses.filter((b) => !b.eligibilite).map((b) => b.id);
const sansImage = bourses.filter((b) => !b.image).map((b) => b.id);

const paysUnPeuple = Object.entries(parPays)
.filter(([, n]) => n === 1)
.map(([p]) => p)
.sort();

const exportJson = {
genereLe: new Date().toISOString(),
totaux: {
bourses: bourses.length,
universites: universites.length,
programmes: programmes.length,
pays: Object.keys(parPays).length,
boursesSansEligibilite: sansEligibilite.length,
boursesSansImage: sansImage.length
},
boursesParPays: Object.fromEntries(Object.entries(parPays).sort((a, b) => b[1] - a[1])),
paysAUneSeuleBourse: paysUnPeuple,
boursesSansEligibilite: sansEligibilite,
bourses,
universites,
programmes
};

const texte = JSON.stringify(exportJson, null, 2);
outputEl.value = texte;
copyBtn.disabled = false;

summaryEl.textContent =
`${bourses.length} bourses · ${universites.length} universités · ${programmes.length} programmes · ` +
`${Object.keys(parPays).length} pays · ${sansEligibilite.length} bourses sans éligibilité renseignée · ` +
`${Math.round(texte.length / 1024)} Ko d'export`;

} catch (err) {
summaryEl.textContent = `Erreur : ${err.message}`;
} finally {
runBtn.disabled = false;
}

});

copyBtn.addEventListener("click", async () => {
try {
await navigator.clipboard.writeText(outputEl.value);
copyBtn.textContent = "Copié";
setTimeout(() => { copyBtn.textContent = "Copier l'export"; }, 2000);
} catch {
// Repli quand le presse-papiers est refusé (page non sécurisée,
// permission navigateur) : on sélectionne, l'utilisateur fait Ctrl+C.
outputEl.select();
copyBtn.textContent = "Sélectionné — faire Ctrl+C";
setTimeout(() => { copyBtn.textContent = "Copier l'export"; }, 3000);
}
});
