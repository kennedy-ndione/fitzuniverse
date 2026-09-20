/**
 * ============================================================
 * Control Center — les paiements (lot ADMIN-PAIEMENTS, 2026-09-20)
 * ============================================================
 *
 * LECTURE SEULE. La collection `payments` est écrite par
 * functions/paiement.js (creerPaiement pose l'intention, le webhook
 * PayDunya pose le verdict) ; firestore.rules n'ouvre ici que la
 * lecture, à l'administrateur. Aucun bouton de cette page ne peut
 * activer une formule ni corriger un montant : ces gestes-là passent
 * par la fiche étudiant (attribution tracée) ou par PayDunya.
 *
 * COÛT : une lecture de `payments` + une de `users` (pour les noms) à
 * l'ouverture. Tri et filtres en mémoire — la collection se compte en
 * dizaines, pas en milliers ; le jour où elle grossit, paginer par
 * creeLe (orderBy + startAfter) sans changer l'écran.
 * ============================================================
 */

import { db } from "../firebase-config.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import { getAllUsers } from "./firebase-admin.js";
import { initSidebarToggle } from "./sidebar-toggle.js";
import { hidePageLoader } from "../js/app-shell.js";
import { initLogout } from "./deconnexion.js";

initSidebarToggle();
initLogout();

let paiements = [];
let nomsParUid = new Map();

function echapper(texte) {
return String(texte == null ? "" : texte).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function francs(n) {
return Number.isFinite(n) ? `${new Intl.NumberFormat("fr-FR").format(n)} F` : "—";
}

function dateLisible(ts) {
if (!ts || typeof ts.toDate !== "function") return "—";
return ts.toDate().toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }) +
" · " + ts.toDate().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

/* Le vocabulaire des statuts vient de functions/paiement.js — on le
   TRADUIT, on ne l'invente pas. `anomalie` regroupe ce qui exige un
   humain : le compte n'a pas été touché et personne ne l'a décidé. */
const STATUTS = {
"paye": { libelle: "Payé", classe: "is-active", famille: "paye" },
"en-attente": { libelle: "En attente", classe: "is-attente", famille: "en-attente" },
"montant-incoherent": { libelle: "Montant incohérent", classe: "is-disabled", famille: "anomalie" },
"mode-incoherent": { libelle: "Mode incohérent", classe: "is-disabled", famille: "anomalie" },
"formule-inconnue": { libelle: "Formule inconnue", classe: "is-disabled", famille: "anomalie" }
};

function statutDe(p) {
return STATUTS[p.statut] || { libelle: p.statut || "inconnu", classe: "", famille: "autres" };
}

function pillStatut(p) {
const s = statutDe(p);
const applique = p.statut === "paye" && p.applique === false ? ` <span class="status-pill is-disabled">non appliqué</span>` : "";
return `<span class="status-pill ${s.classe}">${echapper(s.libelle)}</span>${applique}`;
}

function nomEtudiant(uid) {
return nomsParUid.get(uid) || null;
}

// ==========================================================
// Rendu
// ==========================================================

function renderChiffres() {

const payes = paiements.filter((p) => p.statut === "paye" && p.applique !== false);
const encaisse = payes.reduce((s, p) => s + (Number.isFinite(p.montantEncaisse) ? p.montantEncaisse : (p.montantAttendu || 0)), 0);
const attente = paiements.filter((p) => p.statut === "en-attente").length;
const anomalies = paiements.filter((p) => statutDe(p).famille === "anomalie" || (p.statut === "paye" && p.applique === false)).length;

document.getElementById("paiementsEncaisse").textContent = francs(encaisse);
document.getElementById("paiementsAttente").textContent = attente;
document.getElementById("paiementsAnomalies").textContent = anomalies;

}

function renderTable() {

const terme = document.getElementById("paiementsSearch").value.trim().toLowerCase();
const filtreStatut = document.getElementById("paiementsStatut").value;
const filtreMode = document.getElementById("paiementsMode").value;

const lignes = paiements.filter((p) => {

if (filtreStatut) {
const famille = statutDe(p).famille;
if (filtreStatut === "anomalie" && famille !== "anomalie") return false;
if (filtreStatut === "autres" && famille !== "autres") return false;
if (["paye", "en-attente"].includes(filtreStatut) && p.statut !== filtreStatut) return false;
}

if (filtreMode && p.mode !== filtreMode) return false;

if (terme) {
const nom = nomEtudiant(p.uid) || "";
const botte = `${nom} ${p.label || ""} ${p.planId || ""} ${p.id || ""} ${p.uid || ""}`.toLowerCase();
if (!botte.includes(terme)) return false;
}

return true;

});

const tbody = document.getElementById("paiementsTableBody");

if (!lignes.length) {
tbody.innerHTML = `<tr><td colspan="8"><div class="admin-table-empty">${paiements.length ? "Aucun paiement ne correspond à ces critères." : "Aucun paiement enregistré pour l'instant — la première facture PayDunya apparaîtra ici."}</div></td></tr>`;
return;
}

tbody.innerHTML = lignes.map((p) => {

const nom = nomEtudiant(p.uid);
const montant = p.statut === "paye" && Number.isFinite(p.montantEncaisse) && p.montantEncaisse !== p.montantAttendu
? `${francs(p.montantEncaisse)} <span class="radar-muet">(attendu ${francs(p.montantAttendu)})</span>`
: francs(p.montantAttendu);

return `
<tr>
<td>${dateLisible(p.creeLe)}</td>
<td class="is-name">${nom ? echapper(nom) : `<span class="radar-muet">compte ${echapper(String(p.uid || "?").slice(0, 8))}…</span>`}</td>
<td>${echapper(p.label || p.planId || "—")}</td>
<td>${montant}</td>
<td>${echapper(p.methodeChoisie || "—")}</td>
<td>${p.mode === "live" ? `<span class="status-pill is-active">production</span>` : `<span class="status-pill">test</span>`}</td>
<td>${pillStatut(p)}</td>
<td>${p.uid ? `<a class="table-link-btn" href="student-detail.html?uid=${encodeURIComponent(p.uid)}">Voir la fiche</a>` : ""}</td>
</tr>`;

}).join("");

}

// ==========================================================
// Chargement
// ==========================================================

["paiementsSearch", "paiementsStatut", "paiementsMode"].forEach((id) => {
const el = document.getElementById(id);
el.addEventListener(el.tagName === "INPUT" ? "input" : "change", renderTable);
});

(async () => {

try {

// admin-auth.js garde la porte ; ici on attend simplement que la
// session soit résolue via la même promesse mémorisée.
const { chargerAdmin } = await import("./admin-role.js");
const administrateur = await chargerAdmin();
if (!administrateur) return; // admin-auth.js redirige déjà

const [snapshot, users] = await Promise.all([
getDocs(collection(db, "payments")),
getAllUsers()
]);

nomsParUid = new Map(users.map((u) => [u.uid, u.name || u.email || null]));

paiements = snapshot.docs
.map((d) => ({ id: d.id, ...(d.data() || {}) }))
.sort((a, b) => {
const ta = a.creeLe && a.creeLe.toMillis ? a.creeLe.toMillis() : 0;
const tb = b.creeLe && b.creeLe.toMillis ? b.creeLe.toMillis() : 0;
return tb - ta;
});

renderChiffres();
renderTable();

if (window.lucide) lucide.createIcons();

hidePageLoader();

} catch (erreur) {

console.error("Paiements illisibles :", erreur);

const content = document.querySelector(".content");
if (content) {
content.style.display = "";
content.innerHTML = `
<div style="padding:40px;text-align:center;">
<h2>Impossible de charger les paiements</h2>
<p>Rechargez la page. Si le message revient, les règles Firestore n'ont peut-être pas été déployées (firebase deploy --only firestore:rules).</p>
<button onclick="window.location.reload()">Réessayer</button>
</div>`;
}

const pageLoader = document.getElementById("pageLoader");
if (pageLoader) pageLoader.style.display = "none";

}

})();
