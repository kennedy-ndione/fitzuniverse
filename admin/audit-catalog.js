// ============================================================
// Fitz — Audit du catalogue (2026-08-28, étendu le 2026-08-28)
// LECTURE SEULE. Combien d'universités sont réellement rattachées à
// chaque bourse ? Sert à cibler la recherche du prochain lot sur les
// bourses réellement dégarnies, plutôt qu'au jugé.
//
// Ce n'est PAS un lot d'expansion : aucun setDoc, aucun updateDoc,
// aucun deleteDoc n'est importé dans ce fichier — la seule chose
// qu'il sait faire du SDK Firestore, c'est lire. Un bouton unique,
// pas d'étape "Écrire", pas de confirm().
//
// Lit TOUTE la collection scholarships, pas seulement ce qu'ont créé
// les lots 1 à 6 : les bourses antérieures au premier lot sont
// justement celles qu'on risque d'oublier.
//
// ORPHELINS
// ---------
// Un programme dont le scholarshipId ou l'universityId ne correspond
// à aucun document est signalé à part. Ça arrive quand une bourse ou
// une université est supprimée à la main dans la console Firebase
// sans nettoyer les programmes qui la référençaient : le lien reste
// en base, invisible côté public (les pages filtrent sur les
// documents existants), et fausse tout comptage naïf.
//
// PAYS DIFFÉRENT
// --------------
// Une bourse rattachée à une université d'un autre pays est signalée
// comme anomalie à REGARDER, pas comme erreur : c'est parfois
// légitime (un programme financé par un pays A pour étudier dans un
// pays B). On l'affiche, on ne juge pas.
//
// PHOTOS PARTAGÉES (ajouté 2026-08-28)
// -------------------------------------
// L'utilisateur a demandé qu'aucune université ne partage plus sa
// photo avec une autre. Les lots 5 à 9 de cette session ont été
// corrigés à la main (liste connue), mais le catalogue contient aussi
// des universités importées avant ces lots (import-universities.js,
// converties via migrate.js, jamais relues par cette session — ni
// device_bash ni accès direct à Firestore ici). Cette section groupe
// TOUTE la collection universities par champ "image" et signale tout
// groupe de 2+ : c'est la seule façon fiable de voir les doublons
// antérieurs à cette session, invisibles depuis le code source seul.
//
// LIENS PORTAIL/CANDIDATURE (ajouté 2026-08-28)
// -----------------------------------------------
// L'utilisateur a demandé que officialWebsite (site de l'université)
// et applicationPortalUrl (portail de candidature) soient toujours
// distincts. Signale : les deux champs identiques (aucune distinction
// réelle, cas trouvé sur Istanbul University), et les cas où l'un des
// deux champs est vide alors que l'autre est renseigné (lien manquant
// — le bouton correspondant reste caché côté public, voir details.js).
// ============================================================

import { db } from "../firebase-config.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

function log(el, message, cls = "") {
el.classList.add("is-visible");
const line = document.createElement("div");
if (cls) line.className = cls;
line.textContent = message;
el.appendChild(line);
el.scrollTop = el.scrollHeight;
}

const auditBtn = document.getElementById("auditBtn");
const auditLog = document.getElementById("auditLog");
const auditResult = document.getElementById("auditResult");

function cell(row, text, cls) {
const td = document.createElement("td");
if (cls) td.className = cls;
td.textContent = text;
row.appendChild(td);
return td;
}

function section(title) {
const h = document.createElement("h3");
h.className = "audit-section-title";
h.textContent = title;
auditResult.appendChild(h);
}

auditBtn.addEventListener("click", async () => {

auditBtn.disabled = true;
auditLog.innerHTML = "";
auditResult.innerHTML = "";

try {

log(auditLog, "Lecture des trois collections (aucune écriture)...");

const [scholarshipsSnap, universitiesSnap, programsSnap] = await Promise.all([
getDocs(collection(db, "scholarships")),
getDocs(collection(db, "universities")),
getDocs(collection(db, "programs"))
]);

const scholarships = scholarshipsSnap.docs.map((d) => ({ id: d.id, data: d.data() }));
const universities = universitiesSnap.docs.map((d) => ({ id: d.id, data: d.data() }));
const programs = programsSnap.docs.map((d) => ({ id: d.id, data: d.data() }));

log(auditLog, `${scholarships.length} bourse(s), ${universities.length} université(s), ${programs.length} programme(s) lus.`, "ok");

const uniById = new Map(universities.map((u) => [u.id, u.data]));
const scholarshipIds = new Set(scholarships.map((s) => s.id));

// Regroupement par bourse. Set et non tableau : deux programmes
// distincts peuvent pointer la même université (niveaux différents),
// et on compte des UNIVERSITÉS, pas des programmes.
const byScholarship = new Map();
const orphans = [];

for (const p of programs) {

const sid = p.data.scholarshipId;
const uid = p.data.universityId;

const badScholarship = !scholarshipIds.has(sid);
const badUniversity = !uniById.has(uid);

if (badScholarship || badUniversity) {
orphans.push({ id: p.id, sid, uid, badScholarship, badUniversity });
// Rattaché à une bourse inexistante : ne compte pour personne.
if (badScholarship) continue;
}

if (!byScholarship.has(sid)) byScholarship.set(sid, new Set());
if (!badUniversity) byScholarship.get(sid).add(uid);

}

const rows = scholarships.map((s) => {

const linked = byScholarship.get(s.id) || new Set();
const unis = [...linked].map((id) => ({ id, ...uniById.get(id) }));
const mismatched = unis.filter((u) => s.data.country && u.country && u.country !== s.data.country);

return {
id: s.id,
title: s.data.title || "(sans titre)",
country: s.data.country || "(sans pays)",
status: s.data.status || "-",
isActive: s.data.isActive,
count: linked.size,
unis,
mismatched
};

// Tri par nombre croissant : les bourses les plus dégarnies en
// tête, c'est tout l'intérêt de l'outil. À nombre égal, ordre
// alphabétique pour que deux exécutions donnent le même tableau.
}).sort((a, b) => a.count - b.count || a.title.localeCompare(b.title, "fr"));

const zero = rows.filter((r) => r.count === 0);
const one = rows.filter((r) => r.count === 1);
const many = rows.filter((r) => r.count >= 2);

log(auditLog, `${rows.length} bourses au total, ${zero.length} avec 0 université, ${one.length} avec 1 seule, ${many.length} avec 2+.`, "ok");

if (orphans.length) {
log(auditLog, `${orphans.length} programme(s) orphelin(s) — voir le détail en bas du tableau.`, "err");
} else {
log(auditLog, "Aucun programme orphelin.", "ok");
}

// -------- Résumé --------
const summary = document.createElement("p");
summary.className = "audit-summary";
summary.textContent = `${rows.length} bourses au total, ${zero.length} avec 0 université, ${one.length} avec 1 seule, ${many.length} avec 2+. (${universities.length} universités, ${programs.length} programmes.)`;
auditResult.appendChild(summary);

// -------- Tableau principal --------
section("Toutes les bourses, des plus dégarnies aux mieux fournies");

const table = document.createElement("table");
table.className = "audit-table";

const thead = document.createElement("thead");
const htr = document.createElement("tr");
["Nb", "Bourse", "Pays", "Statut", "Universités rattachées"].forEach((h) => {
const th = document.createElement("th");
th.textContent = h;
htr.appendChild(th);
});
thead.appendChild(htr);
table.appendChild(thead);

const tbody = document.createElement("tbody");

for (const r of rows) {

const tr = document.createElement("tr");
if (r.count === 0) tr.className = "is-empty";
else if (r.count === 1) tr.className = "is-thin";

cell(tr, String(r.count), "audit-count");
cell(tr, r.title);
cell(tr, r.country);
cell(tr, `${r.status}${r.isActive === false ? " (inactive)" : ""}`);

const list = r.unis.length
? r.unis.map((u) => `${u.name} (${u.city}, ${u.country})`).join(" · ")
: "—";

const td = cell(tr, list);
if (r.mismatched.length) td.classList.add("audit-mismatch");

tbody.appendChild(tr);

}

table.appendChild(tbody);
auditResult.appendChild(table);

// -------- Anomalies de pays --------
const anomalies = rows.filter((r) => r.mismatched.length);

section(`Bourses rattachées à une université d'un autre pays (${anomalies.length})`);

const anomalyBox = document.createElement("div");
anomalyBox.className = "audit-note";

if (!anomalies.length) {
anomalyBox.textContent = "Aucune. Chaque bourse ne pointe que vers des universités de son propre pays.";
} else {
anomalyBox.textContent = "À regarder, pas forcément à corriger : un pays peut financer des études menées ailleurs.";
const ul = document.createElement("ul");
anomalies.forEach((r) => {
const li = document.createElement("li");
li.textContent = `${r.title} [${r.country}] -> ${r.mismatched.map((u) => `${u.name} (${u.country})`).join(", ")}`;
ul.appendChild(li);
});
anomalyBox.appendChild(ul);
}

auditResult.appendChild(anomalyBox);

// -------- Programmes orphelins --------
section(`Programmes orphelins — lien cassé (${orphans.length})`);

const orphanBox = document.createElement("div");
orphanBox.className = "audit-note";

if (!orphans.length) {
orphanBox.textContent = "Aucun. Tous les programmes pointent vers une bourse et une université qui existent.";
} else {
orphanBox.textContent = "Ces programmes référencent un document supprimé. Invisibles côté public, mais ils faussent tout comptage.";
const ul = document.createElement("ul");
orphans.forEach((o) => {
const why = [
o.badScholarship ? `scholarshipId inconnu (${o.sid})` : null,
o.badUniversity ? `universityId inconnu (${o.uid})` : null
].filter(Boolean).join(" + ");
const li = document.createElement("li");
li.textContent = `${o.id} — ${why}`;
ul.appendChild(li);
});
orphanBox.appendChild(ul);
}

auditResult.appendChild(orphanBox);

// -------- Photos partagées entre universités --------
const byImage = new Map();
for (const u of universities) {
const img = u.data.image;
if (!img) continue;
if (!byImage.has(img)) byImage.set(img, []);
byImage.get(img).push(u);
}
const sharedImages = [...byImage.entries()]
.filter(([, list]) => list.length >= 2)
.sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]));

section(`Photos partagées par 2+ universités (${sharedImages.length} photo(s) concernée(s))`);

const imageBox = document.createElement("div");
imageBox.className = "audit-note";

if (!sharedImages.length) {
imageBox.textContent = "Aucune. Chaque université a une photo qui lui est propre.";
} else {
imageBox.textContent = "Chaque groupe ci-dessous doit finir avec une photo différente par université (une seule peut garder l'actuelle, les autres ont besoin d'une nouvelle photo) :";
const ul = document.createElement("ul");
sharedImages.forEach(([img, list]) => {
const li = document.createElement("li");
li.textContent = `${img} (${list.length}x) -> ${list.map((u) => `${u.data.name || "(sans nom)"} [${u.id}]`).join(", ")}`;
ul.appendChild(li);
});
imageBox.appendChild(ul);
}

auditResult.appendChild(imageBox);

// -------- Distinction site université / portail de candidature --------
const identical = universities.filter((u) => u.data.officialWebsite && u.data.applicationPortalUrl && u.data.officialWebsite === u.data.applicationPortalUrl);
const missingOne = universities.filter((u) => (u.data.officialWebsite && !u.data.applicationPortalUrl) || (!u.data.officialWebsite && u.data.applicationPortalUrl));
const missingBoth = universities.filter((u) => !u.data.officialWebsite && !u.data.applicationPortalUrl);

section(`Distinction site université / portail de candidature (${identical.length} identique(s), ${missingOne.length} incomplet(s), ${missingBoth.length} sans aucun lien)`);

const linkBox = document.createElement("div");
linkBox.className = "audit-note";

if (!identical.length && !missingOne.length && !missingBoth.length) {
linkBox.textContent = "Aucune anomalie. officialWebsite et applicationPortalUrl sont toujours renseignés et distincts.";
} else {

if (identical.length) {
const p1 = document.createElement("p");
p1.textContent = "officialWebsite == applicationPortalUrl (aucune distinction réelle) :";
linkBox.appendChild(p1);
const ul1 = document.createElement("ul");
identical.forEach((u) => {
const li = document.createElement("li");
li.textContent = `${u.data.name || "(sans nom)"} [${u.id}] -> ${u.data.officialWebsite}`;
ul1.appendChild(li);
});
linkBox.appendChild(ul1);
}

if (missingOne.length) {
const p2 = document.createElement("p");
p2.style.marginTop = "10px";
p2.textContent = "Un seul des deux champs renseigné (l'autre bouton reste caché côté public) :";
linkBox.appendChild(p2);
const ul2 = document.createElement("ul");
missingOne.forEach((u) => {
const li = document.createElement("li");
li.textContent = `${u.data.name || "(sans nom)"} [${u.id}] -> officialWebsite: "${u.data.officialWebsite || "(vide)"}" / applicationPortalUrl: "${u.data.applicationPortalUrl || "(vide)"}"`;
ul2.appendChild(li);
});
linkBox.appendChild(ul2);
}

if (missingBoth.length) {
const p3 = document.createElement("p");
p3.style.marginTop = "10px";
p3.textContent = `${missingBoth.length} université(s) sans aucun des deux liens (les deux boutons restent cachés) : ${missingBoth.map((u) => u.data.name || u.id).join(", ")}`;
linkBox.appendChild(p3);
}

}

auditResult.appendChild(linkBox);

log(auditLog, "Audit terminé. Aucune écriture effectuée.", "ok");

} catch (error) {

console.error(error);
log(auditLog, `Erreur : ${error.message}`, "err");

} finally {

auditBtn.disabled = false;

}

});
