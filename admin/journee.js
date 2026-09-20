/**
 * ============================================================
 * Control Center — « Votre journée » (lot ADMIN-JOURNÉE, 2026-09-20)
 * ============================================================
 *
 * Le tableau de bord MONTRAIT ; ce module DIT QUOI FAIRE. Cinq tuiles,
 * chacune une pile de travail réelle, chacune un lien vers le geste :
 *
 *   1. Messages sans réponse      → messages.html
 *   2. Demandes conseiller        → la fiche de l'étudiant
 *   3. Bourses à revérifier       → radar.html / verification.html
 *   4. Paiements à examiner       → students.html (la fiche, à terme)
 *   5. Nouveaux inscrits (7 j)    → students.html
 *
 * DOCTRINE DE COÛT — chaque tuile dit ce qu'elle coûte :
 *   - Bourses : ZÉRO lecture (instantané statique + js/radar.js, comme
 *     radar.html).
 *   - Nouveaux inscrits : zéro lecture PROPRE (réutilise la liste users
 *     chargée pour les messages).
 *   - Messages : 1 lecture users + 1 agrégation par étudiant — même
 *     approche assumée que admin/messages.js, à revoir par
 *     collectionGroup au-delà de quelques centaines d'étudiants.
 *   - Conseiller : 1 agrégation par compte PAYANT seulement (les
 *     demandes n'existent que là — firestore.rules l'impose).
 *   - Paiements : 3 petites requêtes (un statut chacune, limit 5, sans
 *     orderBy — pas d'index composite à déployer).
 *
 * CHAQUE TUILE EST INDÉPENDANTE : celle qui échoue affiche « n'a pas pu
 * être lu » sans emporter les autres. Le tableau de bord d'un matin
 * pressé ne doit jamais être tout ou rien.
 * ============================================================
 */

import { db } from "../firebase-config.js";

import {
collection,
query,
where,
limit,
getDocs,
getCountFromServer
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import { getAllUsers, getUnreadStudentMessagesCount } from "./firebase-admin.js";
import { chargerCatalogue, genereLeCatalogue } from "../js/catalog-data.js";
import { construireRadar, bascules } from "../js/radar.js";
import { resolvePlan } from "../js/access-guard.js";
import { resolvePlanPreinscription } from "../js/plan-features.js";

function echapper(texte) {
return String(texte == null ? "" : texte).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

/* Une tuile. `compte` est LE chiffre (la taille de la pile) ; `lignes`
   sont les premiers éléments, cliquables quand `href` est là ; `zero`
   est la phrase du repos — une pile vide se DIT, elle ne se cache pas :
   « rien à traiter » est une information, pas une absence. */
function tuile({ id, icone, titre, compte, ton, lignes, zero, action }) {

const aTraiter = compte > 0;

return `
<article class="journee-tuile${aTraiter ? " is-active" : ""}" style="--tuile-ton:${ton};" id="${id}">
<div class="journee-tuile-head">
<span class="journee-tuile-icone"><i data-lucide="${icone}"></i></span>
<span class="journee-tuile-compte">${compte}</span>
</div>
<h3 class="journee-tuile-titre">${titre}</h3>
${aTraiter
? `<ul class="journee-lignes">${lignes.map((l) => `<li>${l.href ? `<a href="${echapper(l.href)}">${l.html}</a>` : l.html}</li>`).join("")}</ul>`
: `<p class="journee-zero">${zero}</p>`}
${action ? `<a class="journee-tuile-action" href="${echapper(action.href)}"><i data-lucide="arrow-right"></i>${echapper(action.libelle)}</a>` : ""}
</article>`;

}

function tuileErreur(id, icone, titre, action) {
return `
<article class="journee-tuile is-erreur" id="${id}">
<div class="journee-tuile-head">
<span class="journee-tuile-icone"><i data-lucide="${icone}"></i></span>
<span class="journee-tuile-compte">?</span>
</div>
<h3 class="journee-tuile-titre">${titre}</h3>
<p class="journee-zero">Cette pile n'a pas pu être lue — rechargez la page. Si cela persiste, ouvrez la page liée : elle dira ce qui se passe.</p>
${action ? `<a class="journee-tuile-action" href="${echapper(action.href)}"><i data-lucide="arrow-right"></i>${echapper(action.libelle)}</a>` : ""}
</article>`;
}

function nomCourt(user) {
return user.name || (user.email ? user.email.split("@")[0] : "Étudiant");
}

// ==========================================================
// Les cinq piles
// ==========================================================

/* 1 + 5 — messages sans réponse et nouveaux inscrits partagent UNE
   lecture de la liste users. */
async function pilesUtilisateurs() {

const users = await getAllUsers();

// --- Nouveaux inscrits (7 jours) — zéro lecture de plus.
const ilYA7Jours = Date.now() - 7 * 86400000;
const nouveaux = users
.filter((u) => u.createdAt && typeof u.createdAt.toDate === "function" && u.createdAt.toDate().getTime() >= ilYA7Jours)
.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());

// --- Messages non lus : une agrégation par étudiant (1 lecture
//     chacune). Même coût assumé que le centre de messages.
const nonLus = [];
await Promise.all(users.map(async (u) => {
const n = await getUnreadStudentMessagesCount(u.uid).catch(() => 0);
if (n > 0) nonLus.push({ user: u, n });
}));
nonLus.sort((a, b) => b.n - a.n);

// --- Demandes conseiller « nouveau » : seulement les comptes qui
//     PEUVENT en avoir (formule posée, bourse ou France) — les règles
//     n'en laissent créer nulle part ailleurs, inutile de payer une
//     agrégation sur les comptes gratuits.
const payants = users.filter((u) => {
const plan = resolvePlan(u);
return (plan && plan !== "gratuit") || resolvePlanPreinscription(u) || u.testerAccess === true;
});

const demandes = [];
await Promise.all(payants.map(async (u) => {
try {
const q = query(collection(db, "users", u.uid, "advisorRequests"), where("status", "==", "nouveau"));
const n = (await getCountFromServer(q)).data().count;
if (n > 0) demandes.push({ user: u, n });
} catch (e) { /* la tuile globale reste juste : ce compte est simplement absent */ }
}));
demandes.sort((a, b) => b.n - a.n);

return { nouveaux, nonLus, demandes };

}

/* 3 — les bourses, depuis l'instantané statique : zéro lecture. */
async function pileBourses() {

const c = await chargerCatalogue();

const catalogue = {
genereLe: genereLeCatalogue() || "",
programs: c.programmes,
universities: c.universites,
scholarships: c.bourses
};

const aujourdhui = new Date();
const radar = construireRadar(catalogue, aujourdhui);
const mouvements = bascules(catalogue, aujourdhui);

// La pile = ce qui BOUGE (vient de fermer, ferme sous 14 j) ; les
// lignes montrées = les plus prioritaires du radar (risque × exposition).
return {
compte: mouvements.vientDeFermer.length + mouvements.fermeBientot.length,
vientDeFermer: mouvements.vientDeFermer.length,
fermeBientot: mouvements.fermeBientot.length,
top: radar.lignes.slice(0, 3)
};

}

/* 4 — paiements dont le statut réclame un œil humain. Trois requêtes à
   UN statut chacune (égalité simple : aucun index composite à déployer,
   aucun orderBy). La collection est écrite par functions/paiement.js ;
   firestore.rules en ouvre la LECTURE à l'admin (lot ADMIN-JOURNÉE). */
async function pilePaiements() {

const STATUTS = [
{ statut: "en-attente", libelle: "en attente" },
{ statut: "mode-incoherent", libelle: "mode incohérent" },
{ statut: "montant-incoherent", libelle: "montant incohérent" }
];

const lots = await Promise.all(STATUTS.map(async ({ statut, libelle }) => {
const q = query(collection(db, "payments"), where("statut", "==", statut), limit(5));
const snap = await getDocs(q);
return snap.docs.map((d) => ({ id: d.id, libelle, ...(d.data() || {}) }));
}));

return lots.flat();

}

// ==========================================================
// Rendu
// ==========================================================

export async function initJournee() {

const hote = document.getElementById("journeeGrid");
if (!hote) return;

const [utilisateurs, bourses, paiements] = await Promise.allSettled([
pilesUtilisateurs(),
pileBourses(),
pilePaiements()
]);

const tuiles = [];

// --- 1. Messages
if (utilisateurs.status === "fulfilled") {
const { nonLus } = utilisateurs.value;
const total = nonLus.reduce((s, e) => s + e.n, 0);
tuiles.push(tuile({
id: "jrMessages", icone: "messages-square", titre: "Messages sans réponse",
compte: total, ton: "var(--amber-600, #B45309)",
lignes: nonLus.slice(0, 3).map((e) => ({
html: `<strong>${echapper(nomCourt(e.user))}</strong> — ${e.n} message${e.n > 1 ? "s" : ""} non lu${e.n > 1 ? "s" : ""}`,
href: "messages.html"
})),
zero: "Toutes les conversations sont à jour.",
action: { href: "messages.html", libelle: "Ouvrir le centre de messages" }
}));
} else {
console.warn("Journée — messages illisibles :", utilisateurs.reason);
tuiles.push(tuileErreur("jrMessages", "messages-square", "Messages sans réponse", { href: "messages.html", libelle: "Ouvrir le centre de messages" }));
}

// --- 2. Demandes conseiller
if (utilisateurs.status === "fulfilled") {
const { demandes } = utilisateurs.value;
const total = demandes.reduce((s, e) => s + e.n, 0);
tuiles.push(tuile({
id: "jrConseiller", icone: "user-check", titre: "Demandes conseiller à traiter",
compte: total, ton: "var(--accent-600, #7E71D8)",
lignes: demandes.slice(0, 3).map((e) => ({
html: `<strong>${echapper(nomCourt(e.user))}</strong> — ${e.n} demande${e.n > 1 ? "s" : ""}`,
href: `student-detail.html?uid=${encodeURIComponent(e.user.uid)}`
})),
zero: "Aucune demande en attente.",
action: { href: "students.html", libelle: "Voir les étudiants" }
}));
} else {
tuiles.push(tuileErreur("jrConseiller", "user-check", "Demandes conseiller à traiter", { href: "students.html", libelle: "Voir les étudiants" }));
}

// --- 3. Bourses
if (bourses.status === "fulfilled") {
const b = bourses.value;
tuiles.push(tuile({
id: "jrBourses", icone: "radar", titre: "Bourses à revérifier",
compte: b.compte, ton: "var(--danger-600, #DC2626)",
lignes: [
...(b.vientDeFermer ? [{ html: `<strong>${b.vientDeFermer}</strong> échéance${b.vientDeFermer > 1 ? "s" : ""} passée${b.vientDeFermer > 1 ? "s" : ""} (30 j)`, href: "radar.html" }] : []),
...(b.fermeBientot ? [{ html: `<strong>${b.fermeBientot}</strong> ferme${b.fermeBientot > 1 ? "nt" : ""} sous 14 jours`, href: "radar.html" }] : []),
...b.top.slice(0, 1).map((l) => ({ html: `Priorité n°1 : <strong>${echapper(l.titre)}</strong>`, href: "verification.html" }))
],
zero: "Aucune échéance ne bouge — le radar reste votre revue de fond.",
action: { href: "radar.html", libelle: "Lancer le radar" }
}));
} else {
console.warn("Journée — radar illisible :", bourses.reason);
tuiles.push(tuileErreur("jrBourses", "radar", "Bourses à revérifier", { href: "radar.html", libelle: "Lancer le radar" }));
}

// --- 4. Paiements
if (paiements.status === "fulfilled") {
const liste = paiements.value;
tuiles.push(tuile({
id: "jrPaiements", icone: "wallet", titre: "Paiements à examiner",
compte: liste.length, ton: "var(--success-600, #16A34A)",
lignes: liste.slice(0, 3).map((p) => ({
html: `<strong>${echapper(p.label || p.planId || "Formule")}</strong> — ${echapper(p.libelle)}${Number.isFinite(p.montantAttendu) ? ` · ${new Intl.NumberFormat("fr-FR").format(p.montantAttendu)} F` : ""}`,
href: p.uid ? `student-detail.html?uid=${encodeURIComponent(p.uid)}` : "students.html"
})),
zero: "Aucun paiement en souffrance.",
action: null
}));
} else {
console.warn("Journée — paiements illisibles :", paiements.reason);
tuiles.push(tuileErreur("jrPaiements", "wallet", "Paiements à examiner", null));
}

// --- 5. Nouveaux inscrits
if (utilisateurs.status === "fulfilled") {
const { nouveaux } = utilisateurs.value;
tuiles.push(tuile({
id: "jrInscrits", icone: "user-plus", titre: "Nouveaux inscrits (7 jours)",
compte: nouveaux.length, ton: "var(--amber-500, #E9A319)",
lignes: nouveaux.slice(0, 3).map((u) => ({
html: `<strong>${echapper(nomCourt(u))}</strong>${u.alerteBourses === true ? " · alertes ✓" : ""}`,
href: `student-detail.html?uid=${encodeURIComponent(u.uid)}`
})),
zero: "Personne cette semaine — la prochaine inscription s'affichera ici.",
action: { href: "students.html", libelle: "Tous les étudiants" }
}));
} else {
tuiles.push(tuileErreur("jrInscrits", "user-plus", "Nouveaux inscrits (7 jours)", { href: "students.html", libelle: "Tous les étudiants" }));
}

hote.innerHTML = tuiles.join("");

if (window.lucide) lucide.createIcons();

}
