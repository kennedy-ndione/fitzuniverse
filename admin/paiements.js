/**
 * ============================================================
 * Control Center — les paiements (lot ADMIN-PAIEMENTS, 2026-09-20 ;
 * passage au direct, lot ADMIN-PAIEMENTS-LIVE, 2026-09-21)
 * ============================================================
 *
 * LECTURE SEULE. La collection `payments` est écrite par
 * functions/paiement.js (creerPaiement pose l'intention, le webhook
 * PayDunya pose le verdict) ; firestore.rules n'ouvre ici que la
 * lecture, à l'administrateur. Aucun bouton de cette page ne peut
 * activer une formule ni corriger un montant : ces gestes-là passent
 * par la fiche étudiant (attribution tracée) ou par PayDunya.
 *
 * EN DIRECT (2026-09-21) : la page ne fait plus une lecture unique de
 * `payments` au chargement — elle s'abonne avec onSnapshot. Un
 * paiement qui arrive (facture créée, webhook qui la marque « payé »)
 * apparaît ou se met à jour ici sans recharger la page. Charles doit
 * pouvoir voir « qui vient de payer » à l'instant même. `users`, lui,
 * reste lu une seule fois : les comptes se créent bien moins souvent
 * que les paiements, et si un uid manque encore à l'affichage, la
 * ligne retombe sur l'identifiant tronqué (comportement déjà existant).
 *
 * COÛT : un abonnement temps réel à `payments` (facturé comme une
 * lecture par document reçu, initiale ou modifiée) + une lecture de
 * `users` à l'ouverture. Tri et filtres en mémoire — la collection se
 * compte en dizaines, pas en milliers ; le jour où elle grossit,
 * paginer par creeLe (orderBy + startAfter) sans changer l'écran.
 * ============================================================
 */

import { app, db } from "../firebase-config.js";

// Audit 2026-10 : la revérification passe par la fonction reverifierPaiement
// (functions/paiement.js), dans la région des paiements.
const REGION = "europe-west1";

import {
collection,
onSnapshot
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import { getAllUsers, estSessionAnonyme } from "./firebase-admin.js";
import { initSidebarToggle } from "./sidebar-toggle.js";
import { hidePageLoader } from "../js/app-shell.js";
import { initLogout } from "./deconnexion.js";
// Les neuf pays des préinscriptions (2026-09-24).
import { PAYS_ADMIN, nomDuPays } from "../js/formules-admin.js";
import { PLAN_PREINSCRIPTION_ORDER } from "../js/plan-features.js";

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
"formule-inconnue": { libelle: "Formule inconnue", classe: "is-disabled", famille: "anomalie" },
// Audit 2026-10 : la confirmation de PayDunya (statut non « completed »,
// facture d'un autre jeton) n'a pas permis de créditer.
"confirmation-refusee": { libelle: "Refusé à la confirmation", classe: "is-disabled", famille: "anomalie" }
};

function statutDe(p) {
return STATUTS[p.statut] || { libelle: p.statut || "inconnu", classe: "", famille: "autres" };
}

function pillStatut(p) {
const s = statutDe(p);
const applique = p.statut === "paye" && p.applique === false ? ` <span class="status-pill is-disabled">non appliqué</span>` : "";
return `<span class="status-pill ${s.classe}">${echapper(s.libelle)}</span>${applique}`;
}

// Le parcours d'un paiement : « bourse », ou le PAYS d'une préinscription.
// Les paiements préinscription d'avant le 2026-09-23 ne portent pas de
// destination : c'était toujours la France.
function paysDuPaiement(p) {
if (!PLAN_PREINSCRIPTION_ORDER.includes(p.planId)) return "bourse";
const d = String(p.destination || "france");
return PAYS_ADMIN.includes(d) ? d : "france";
}

function construireFiltrePays() {
const sel = document.getElementById("paiementsPays");
if (!sel || sel.options.length) return;
sel.innerHTML = `<option value="">Tous les parcours</option><option value="bourse">Bourses</option><optgroup label="Préinscriptions">${PAYS_ADMIN.map((pays) => `<option value="${pays}">${nomDuPays(pays)}</option>`).join("")}</optgroup>`;
}

construireFiltrePays();

function nomEtudiant(uid) {
return nomsParUid.get(uid) || null;
}

// ==========================================================
// Rendu
// ==========================================================

function afficherDerniereMiseAJour() {

const titre = document.querySelector(".topbar-title");
if (!titre) return;

let badge = document.getElementById("paiementsLiveBadge");
if (!badge) {
badge = document.createElement("span");
badge.id = "paiementsLiveBadge";
badge.className = "status-pill is-active";
badge.style.marginLeft = "10px";
badge.style.verticalAlign = "middle";
const h1 = titre.querySelector("h1");
if (h1) h1.appendChild(badge); else titre.appendChild(badge);
}

const heure = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
badge.textContent = `● En direct — mis à jour ${heure}`;

}

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
const filtrePays = document.getElementById("paiementsPays")?.value || "";

const lignes = paiements.filter((p) => {

if (filtreStatut) {
const famille = statutDe(p).famille;
if (filtreStatut === "anomalie" && famille !== "anomalie") return false;
if (filtreStatut === "autres" && famille !== "autres") return false;
if (["paye", "en-attente"].includes(filtreStatut) && p.statut !== filtreStatut) return false;
}

if (filtreMode && p.mode !== filtreMode) return false;
if (filtrePays && paysDuPaiement(p) !== filtrePays) return false;

if (terme) {
const nom = nomEtudiant(p.uid) || "";
const botte = `${nom} ${p.label || ""} ${p.planId || ""} ${nomDuPays(paysDuPaiement(p))} ${p.id || ""} ${p.uid || ""}`.toLowerCase();
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
<td>${p.uid ? `<a class="table-link-btn" href="student-detail.html?uid=${encodeURIComponent(p.uid)}">Voir la fiche</a>` : ""}${p.statut === "en-attente" ? `<button type="button" class="table-link-btn" data-reverifier="${echapper(p.id)}">Revérifier auprès de PayDunya</button>` : ""}</td>
</tr>`;

}).join("");

}

// ==========================================================
// « Revérifier auprès de PayDunya » (audit 2026-10)
// ==========================================================
// Une IPN perdue laisse une facture « en attente » alors que l'étudiant a
// payé. Le bouton relance la MÊME confirmation que le webhook, côté
// serveur (reverifierPaiement) : PayDunya décide, et un paiement déjà
// appliqué ne l'est jamais deux fois. Le tableau se met à jour de lui-même
// (onSnapshot) quand le statut change.
const ISSUES_REVERIFICATION = {
"applique": "Payé : formule créditée",
"rang-inferieur": "Payé : compte déjà mieux doté, rien changé",
"deja-traite": "Déjà payé : rien de plus",
"non-complete": "Pas encore payé chez PayDunya",
"confirmation-refusee": "Refusé par PayDunya",
"montant-absent": "Montant absent : à examiner",
"montant-different": "Montant différent : à examiner",
"jeton-different": "Facture incohérente : à examiner",
"mode-incoherent": "Mode incohérent : à examiner"
};

async function reverifier(token) {
const { getFunctions, httpsCallable } = await import(
"https://www.gstatic.com/firebasejs/11.10.0/firebase-functions.js"
);
const appeler = httpsCallable(getFunctions(app, REGION), "reverifierPaiement");
const reponse = await appeler({ token });
return reponse.data;
}

document.getElementById("paiementsTableBody").addEventListener("click", async (event) => {
const bouton = event.target.closest("[data-reverifier]");
if (!bouton || bouton.disabled) return;
bouton.disabled = true;
bouton.textContent = "Vérification…";
try {
const { issue } = await reverifier(bouton.dataset.reverifier);
bouton.textContent = ISSUES_REVERIFICATION[issue] || `Issue : ${issue}`;
} catch (erreur) {
console.error(erreur);
bouton.textContent = erreur && erreur.code === "functions/unavailable" ? "PayDunya ne répond pas : réessayer" : "Échec : réessayer";
bouton.disabled = false;
}
});

// ==========================================================
// Chargement
// ==========================================================

["paiementsSearch", "paiementsStatut", "paiementsMode", "paiementsPays"].forEach((id) => {
const el = document.getElementById(id);
el.addEventListener(el.tagName === "INPUT" ? "input" : "change", renderTable);
});

function afficherErreurChargement(erreur) {

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

let premierInstantane = true;

(async () => {

try {

// admin-auth.js garde la porte ; ici on attend simplement que la
// session soit résolue via la même promesse mémorisée.
const { chargerAdmin } = await import("./admin-role.js");
const administrateur = await chargerAdmin();
if (!administrateur) return; // admin-auth.js redirige déjà

// Les sessions anonymes comprises : deux factures en attente (25/09)
// avaient été ouvertes par l'une d'elles — l'admin doit le lire.
const users = await getAllUsers({ avecSessionsAnonymes: true });
nomsParUid = new Map(users.map((u) => [u.uid, u.name || u.email || (estSessionAnonyme(u) ? "Session anonyme (sans compte)" : null)]));

// EN DIRECT : ce callback se déclenche à l'ouverture (premier
// instantané), puis à chaque création ou changement de statut d'une
// facture PayDunya — sans que quiconque recharge la page.
onSnapshot(collection(db, "payments"), (snapshot) => {

paiements = snapshot.docs
.map((d) => ({ id: d.id, ...(d.data() || {}) }))
.sort((a, b) => {
const ta = a.creeLe && a.creeLe.toMillis ? a.creeLe.toMillis() : 0;
const tb = b.creeLe && b.creeLe.toMillis ? b.creeLe.toMillis() : 0;
return tb - ta;
});

renderChiffres();
renderTable();
afficherDerniereMiseAJour();

if (window.lucide) lucide.createIcons();

if (premierInstantane) {
hidePageLoader();
premierInstantane = false;
}

}, (erreur) => afficherErreurChargement(erreur));

} catch (erreur) {

afficherErreurChargement(erreur);

}

})();
