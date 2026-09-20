/**
 * ============================================================
 * Control Center — la recherche globale (lot ADMIN-RECHERCHE, 2026-09-20)
 * ============================================================
 *
 * Ctrl+K (ou Cmd+K) depuis N'IMPORTE QUELLE page de l'admin : taper un
 * nom d'étudiant, une bourse, une université ou une page, et y aller.
 * « Un espace qui sait tout du site, et de façon simple » — la demande
 * de Charles, au mot près.
 *
 * BRANCHEMENT : admin-auth.js, le seul module commun à toutes les pages
 * (même logique que initFitzSelects). Aucune page n'a été modifiée.
 *
 * COÛT : ZÉRO tant que la palette n'est pas ouverte. À la première
 * ouverture : le catalogue (instantané statique, 0 lecture Firestore)
 * + la liste des étudiants (N lectures, une fois par page). Les
 * ouvertures suivantes réutilisent tout.
 *
 * La palette est construite au premier appel, retirée à la fermeture du
 * DOM visuel (hidden), jamais dupliquée. Échapper ferme, ↑↓ naviguent,
 * Entrée ouvre, la souris aussi.
 * ============================================================
 */

import { chargerCatalogue } from "../js/catalog-data.js";
import { getAllUsers } from "./firebase-admin.js";

function normaliser(s) {
return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function echapper(texte) {
return String(texte == null ? "" : texte).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

/* Les pages de l'admin — la carte du territoire. `superSeul` suit
   data-super-admin : un collègue ne se voit pas proposer une porte
   qu'il ne peut pas ouvrir. */
const PAGES = [
{ titre: "Tableau de bord", href: "dashboard.html", icone: "layout-dashboard" },
{ titre: "Messages", href: "messages.html", icone: "messages-square" },
{ titre: "Étudiants", href: "students.html", icone: "users" },
{ titre: "Formules", href: "plans.html", icone: "sliders-horizontal" },
{ titre: "Administrateurs", href: "administrateurs.html", icone: "shield-check", superSeul: true },
{ titre: "Bourses (catalogue)", href: "scholarships.html", icone: "graduation-cap" },
{ titre: "Universités (catalogue)", href: "universities.html", icone: "landmark" },
{ titre: "Paiements", href: "paiements.html", icone: "wallet" },
{ titre: "Alertes e-mail", href: "alertes.html", icone: "bell" },
{ titre: "Outils techniques", href: "tools.html", icone: "wrench" },
{ titre: "Radar des échéances", href: "radar.html", icone: "radar" },
{ titre: "Vérifier une bourse à sa source", href: "verification.html", icone: "globe" },
{ titre: "Audit du catalogue", href: "audit-catalog.html", icone: "search-check" },
{ titre: "Export du catalogue", href: "export-catalog.html", icone: "download" }
];

let overlay = null;
let champ = null;
let listeEl = null;
let resultats = [];
let selection = 0;
let donnees = null;      // { etudiants, bourses, universites } après 1re ouverture
let chargement = null;

function construire() {

if (overlay) return;

overlay = document.createElement("div");
overlay.className = "cmdk-overlay";
overlay.hidden = true;
overlay.innerHTML = `
<div class="cmdk-panel" role="dialog" aria-modal="true" aria-label="Recherche globale">
<div class="cmdk-champ">
<i data-lucide="search"></i>
<input type="text" id="cmdkInput" placeholder="Étudiant, bourse, université, page…" autocomplete="off" spellcheck="false">
<kbd>Échap</kbd>
</div>
<div class="cmdk-liste" id="cmdkListe" role="listbox"></div>
</div>`;

document.body.appendChild(overlay);

champ = overlay.querySelector("#cmdkInput");
listeEl = overlay.querySelector("#cmdkListe");

// Fermer : Échap, ou toucher le voile.
overlay.addEventListener("mousedown", (e) => { if (e.target === overlay) fermer(); });

champ.addEventListener("input", () => { selection = 0; rendre(); });

champ.addEventListener("keydown", (e) => {
if (e.key === "Escape") { fermer(); return; }
if (e.key === "ArrowDown") { e.preventDefault(); selection = Math.min(selection + 1, resultats.length - 1); rendre(false); }
if (e.key === "ArrowUp") { e.preventDefault(); selection = Math.max(selection - 1, 0); rendre(false); }
if (e.key === "Enter") {
e.preventDefault();
const r = resultats[selection];
if (r) window.location.href = r.href;
}
});

if (window.lucide) lucide.createIcons();

}

async function chargerDonnees() {

if (donnees) return donnees;

if (!chargement) {
chargement = Promise.all([
chargerCatalogue().catch(() => ({ bourses: [], universites: [], programmes: [] })),
getAllUsers().catch(() => [])
]).then(([c, users]) => {
donnees = {
etudiants: users.map((u) => ({ nom: u.name || u.email || "Étudiant", email: u.email || "", uid: u.uid })),
bourses: c.bourses.map((b) => ({ id: b.id, titre: b.title || b.id, pays: b.country || "" })),
universites: c.universites.map((u) => ({ id: u.id, nom: u.name || u.id, pays: u.country || "" }))
};
return donnees;
});
}

return chargement;

}

function chercher(terme, superAdmin) {

const t = normaliser(terme);
const sorties = [];

const pages = PAGES.filter((p) => (!p.superSeul || superAdmin) && (!t || normaliser(p.titre).includes(t)));
for (const p of pages.slice(0, t ? 4 : 6)) {
sorties.push({ section: "Pages", titre: p.titre, sous: "", href: p.href, icone: p.icone });
}

if (t && donnees) {

for (const e of donnees.etudiants.filter((e) => normaliser(e.nom + " " + e.email).includes(t)).slice(0, 5)) {
sorties.push({ section: "Étudiants", titre: e.nom, sous: e.email, href: `student-detail.html?uid=${encodeURIComponent(e.uid)}`, icone: "user-round" });
}

for (const b of donnees.bourses.filter((b) => normaliser(b.titre + " " + b.pays).includes(t)).slice(0, 5)) {
sorties.push({ section: "Bourses", titre: b.titre, sous: b.pays, href: "scholarships.html", icone: "graduation-cap" });
}

for (const u of donnees.universites.filter((u) => normaliser(u.nom + " " + u.pays).includes(t)).slice(0, 5)) {
sorties.push({ section: "Universités", titre: u.nom, sous: u.pays, href: `university.html?id=${encodeURIComponent(u.id)}`, icone: "landmark" });
}

}

return sorties;

}

function rendre(recalculer = true) {

const superAdmin = document.body.dataset.cmdkSuper === "oui";

if (recalculer) resultats = chercher(champ.value.trim(), superAdmin);

if (!resultats.length) {
listeEl.innerHTML = `<p class="cmdk-vide">${donnees ? "Rien ne correspond — essayez un autre mot." : "Chargement de l'index…"}</p>`;
return;
}

let html = "";
let sectionCourante = "";

resultats.forEach((r, i) => {
if (r.section !== sectionCourante) {
sectionCourante = r.section;
html += `<div class="cmdk-section">${echapper(r.section)}</div>`;
}
html += `
<a class="cmdk-item${i === selection ? " is-select" : ""}" href="${echapper(r.href)}" data-index="${i}" role="option" aria-selected="${i === selection}">
<i data-lucide="${echapper(r.icone)}"></i>
<span class="cmdk-item-titre">${echapper(r.titre)}</span>
${r.sous ? `<span class="cmdk-item-sous">${echapper(r.sous)}</span>` : ""}
</a>`;
});

listeEl.innerHTML = html;

listeEl.querySelectorAll(".cmdk-item").forEach((el) => {
el.addEventListener("mousemove", () => {
const i = Number(el.dataset.index);
if (i !== selection) { selection = i; rendre(false); }
});
});

const actif = listeEl.querySelector(".cmdk-item.is-select");
if (actif) actif.scrollIntoView({ block: "nearest" });

if (window.lucide) lucide.createIcons();

}

async function ouvrir() {

construire();
overlay.hidden = false;
champ.value = "";
selection = 0;
rendre();
champ.focus();

// L'index se charge à la PREMIÈRE ouverture, jamais avant.
await chargerDonnees();
rendre();

}

function fermer() {
if (overlay) overlay.hidden = true;
}

/**
 * @param {boolean} superAdmin — décide si la page Administrateurs est
 * proposée. Posé en data-attribute : la palette peut être reconstruite
 * sans retenir de fermeture sur ce module.
 */
export function initRecherche(superAdmin) {

document.body.dataset.cmdkSuper = superAdmin ? "oui" : "non";

document.addEventListener("keydown", (e) => {
if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
e.preventDefault();
if (overlay && !overlay.hidden) fermer(); else ouvrir();
}
});

// Le rappel visuel — injecté sous le badge « Control Center », pour
// que le raccourci s'apprenne en le voyant. Sur téléphone (pas de
// Ctrl), c'est LE bouton.
const badge = document.querySelector(".sidebar-badge");
if (badge && !document.getElementById("cmdkTrigger")) {
const bouton = document.createElement("button");
bouton.type = "button";
bouton.id = "cmdkTrigger";
bouton.className = "cmdk-trigger";
bouton.innerHTML = `<i data-lucide="search"></i><span>Rechercher</span><kbd>Ctrl K</kbd>`;
bouton.addEventListener("click", ouvrir);
badge.insertAdjacentElement("afterend", bouton);
if (window.lucide) lucide.createIcons();
}

}
