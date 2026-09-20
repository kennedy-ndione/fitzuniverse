/**
 * ============================================================
 * Control Center — alertes e-mail de bourses (lot ADMIN-ALERTES, 2026-09-20)
 * ============================================================
 *
 * Le bouton de la Cloud Function envoyerAlerteBourse (functions/emails.js).
 * L'alerte ne part JAMAIS toute seule : l'administrateur choisit la
 * bourse, voit combien d'abonnés attendent, et clique DEUX FOIS — le
 * bouton devient « Confirmer l'envoi à N abonnés » avant d'envoyer
 * (jamais de confirm() natif : il bloque le navigateur intégré, et un
 * clic accidentel doit se rattraper d'un regard, pas d'un dialogue).
 *
 * CE QUE LA PAGE MONTRE : les bourses dont AU MOINS UN programme porte
 * une échéance FUTURE citée (deadlineISO) — la même règle que la
 * fonction, qui revérifie de son côté (la page propose, le serveur
 * décide). Zéro lecture Firestore pour cette liste : l'instantané
 * statique. Deux lectures légères en plus : le nombre d'abonnés
 * (agrégation) et le registre alertesBourses.
 *
 * PLAFOND BREVO (300/jour, plan gratuit) : la fonction envoie par lots
 * de 250 et rapporte le reste ; relancer le même bouton le lendemain
 * poursuit sans doublon (registre des uid servis).
 * ============================================================
 */

import { app, db } from "../firebase-config.js";

import {
collection,
query,
where,
getDocs,
getCountFromServer
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import { chargerCatalogue, genereLeCatalogue } from "../js/catalog-data.js";
import { initSidebarToggle } from "./sidebar-toggle.js";
import { hidePageLoader } from "../js/app-shell.js";
import { initLogout } from "./deconnexion.js";
import { succes, echec } from "./notifier.js";

const REGION = "europe-west1";

initSidebarToggle();
initLogout();

let lignes = [];          // { id, titre, echeance, registre }
let registres = new Map(); // clé alertesBourses -> données
let abonnes = 0;

function echapper(texte) {
return String(texte == null ? "" : texte).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function dateLisible(iso) {
if (!iso) return "—";
return new Date(iso + "T12:00:00Z").toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

function cleRegistre(scholarshipId, deadlineISO) {
// La MÊME normalisation que functions/emails.js — les deux doivent
// désigner le même document ou le suivi ment.
return `${scholarshipId}_${deadlineISO}`.replace(/[^\w.-]/g, "-");
}

async function appelerEnvoi(scholarshipId) {
const { getFunctions, httpsCallable } = await import(
"https://www.gstatic.com/firebasejs/11.10.0/firebase-functions.js"
);
const appeler = httpsCallable(getFunctions(app, REGION), "envoyerAlerteBourse");
const reponse = await appeler({ scholarshipId });
return reponse.data;
}

// ==========================================================
// Rendu
// ==========================================================

function celluleRegistre(ligne) {

const r = registres.get(cleRegistre(ligne.id, ligne.echeance));

if (!r) return `<span class="radar-muet">jamais envoyée pour cette échéance</span>`;

const servis = (Array.isArray(r.uids) ? r.uids : []).filter((u) => u !== "_aucun_").length;
const quand = r.dernierEnvoiLe && typeof r.dernierEnvoiLe.toDate === "function"
? r.dernierEnvoiLe.toDate().toLocaleDateString("fr-FR")
: "";

const reste = Math.max(0, abonnes - servis);

return `<strong>${servis}</strong> abonné${servis > 1 ? "s" : ""} servi${servis > 1 ? "s" : ""}${quand ? ` le ${quand}` : ""}${reste > 0 ? ` · <span class="audit-mismatch">${reste} restant${reste > 1 ? "s" : ""}</span>` : " · à jour"}`;

}

function boutonEnvoi(ligne) {

const r = registres.get(cleRegistre(ligne.id, ligne.echeance));
const servis = r ? (Array.isArray(r.uids) ? r.uids : []).filter((u) => u !== "_aucun_").length : 0;
const reste = Math.max(0, abonnes - servis);

if (!abonnes) return `<span class="radar-muet">aucun abonné</span>`;
if (r && reste === 0) return `<span class="status-pill is-active">tous prévenus</span>`;

const libelle = r ? `Relancer (${reste} restant${reste > 1 ? "s" : ""})` : "Prévenir les abonnés";

return `<button type="button" class="table-link-btn alertes-envoyer" data-id="${echapper(ligne.id)}" data-arme="non">${echapper(libelle)}</button>`;

}

function renderTable() {

const terme = document.getElementById("alertesSearch").value.trim().toLowerCase();
const tbody = document.getElementById("alertesTableBody");

const visibles = lignes.filter((l) => !terme || l.titre.toLowerCase().includes(terme));

if (!visibles.length) {
tbody.innerHTML = `<tr><td colspan="4"><div class="admin-table-empty">${lignes.length ? "Aucune bourse ne correspond à cette recherche." : "Aucune bourse ne porte d'échéance future citée pour l'instant — vérifiez des bourses (Outils → Vérifier une bourse à sa source) et elles apparaîtront ici."}</div></td></tr>`;
return;
}

tbody.innerHTML = visibles.map((l) => `
<tr>
<td class="is-name">${echapper(l.titre)}</td>
<td>${dateLisible(l.echeance)}</td>
<td>${celluleRegistre(l)}</td>
<td>${boutonEnvoi(l)}</td>
</tr>`).join("");

// LE DOUBLE CLIC VOULU : premier clic = le bouton s'arme et dit ce
// qu'il va faire ; second clic = envoi. Un clic ailleurs désarme.
tbody.querySelectorAll(".alertes-envoyer").forEach((btn) => {

btn.addEventListener("click", async () => {

if (btn.dataset.arme !== "oui") {
tbody.querySelectorAll(".alertes-envoyer").forEach((b) => { b.dataset.arme = "non"; b.classList.remove("is-arme"); });
btn.dataset.arme = "oui";
btn.classList.add("is-arme");
btn.textContent = `Confirmer l'envoi (${abonnes} abonné${abonnes > 1 ? "s" : ""} au plus)`;
return;
}

btn.disabled = true;
btn.textContent = "Envoi en cours…";

try {

const resultat = await appelerEnvoi(btn.dataset.id);
succes(resultat.message || `${resultat.envoyes} e-mail(s) envoyé(s).`);
await chargerRegistres();
renderTable();

} catch (erreur) {

console.error(erreur);
echec(erreur.message || "L'envoi a échoué.");
btn.disabled = false;
btn.dataset.arme = "non";
btn.classList.remove("is-arme");
btn.textContent = "Prévenir les abonnés";

}

});

});

}

function renderChiffres() {

document.getElementById("alertesAbonnes").textContent = abonnes;
document.getElementById("alertesEligibles").textContent = lignes.length;

const envoyees = [...registres.values()].filter((r) => (Array.isArray(r.uids) ? r.uids : []).some((u) => u !== "_aucun_")).length;
document.getElementById("alertesEnvoyees").textContent = envoyees;

}

// ==========================================================
// Chargement
// ==========================================================

async function chargerRegistres() {
const snap = await getDocs(collection(db, "alertesBourses"));
registres = new Map(snap.docs.map((d) => [d.id, d.data() || {}]));
}

document.getElementById("alertesSearch").addEventListener("input", renderTable);

(async () => {

try {

const { chargerAdmin } = await import("./admin-role.js");
const administrateur = await chargerAdmin();
if (!administrateur) return; // admin-auth.js redirige déjà

const [c] = await Promise.all([
chargerCatalogue(),
chargerRegistres(),
getCountFromServer(query(collection(db, "users"), where("alerteBourses", "==", true)))
.then((s) => { abonnes = s.data().count; })
]);

// La plus proche échéance FUTURE citée de chaque bourse — champ
// deadlineISO des programmes, la même lecture que la fonction.
const aujourdhui = new Date().toISOString().slice(0, 10);
const parBourse = new Map();

for (const p of c.programmes) {
const iso = String(p.deadlineISO || "").trim();
if (!/^\d{4}-\d{2}-\d{2}$/.test(iso) || iso <= aujourdhui || !p.scholarshipId) continue;
const actuel = parBourse.get(p.scholarshipId);
if (!actuel || iso < actuel) parBourse.set(p.scholarshipId, iso);
}

const titres = new Map(c.bourses.map((b) => [b.id, b.title || b.id]));

lignes = [...parBourse.entries()]
.map(([id, echeance]) => ({ id, titre: String(titres.get(id) || id), echeance }))
.sort((a, b) => a.echeance.localeCompare(b.echeance));

renderChiffres();
renderTable();

const genere = genereLeCatalogue();
if (genere) {
const note = document.querySelector(".dash-footnote span");
if (note) note.textContent += ` Liste établie sur l'instantané du ${genere.slice(0, 10)} — zéro lecture Firestore.`;
}

if (window.lucide) lucide.createIcons();

hidePageLoader();

} catch (erreur) {

console.error("Alertes illisibles :", erreur);

const content = document.querySelector(".content");
if (content) {
content.style.display = "";
content.innerHTML = `
<div style="padding:40px;text-align:center;">
<h2>Impossible de charger les alertes</h2>
<p>Rechargez la page. Si le message revient, les règles Firestore n'ont peut-être pas été déployées.</p>
<button onclick="window.location.reload()">Réessayer</button>
</div>`;
}

const pageLoader = document.getElementById("pageLoader");
if (pageLoader) pageLoader.style.display = "none";

}

})();
