// -------- offers.js --------
// Page de choix du niveau d'accompagnement Fitz. Aucun paiement
// n'est traité ici : le palier choisi est transmis à payment.html
// via l'URL et sessionStorage, prêt pour
// l'intégration future de PayDunya (Wave, Orange Money, carte).
// Dépend de pricing-plans.js (SCHOLARBRIDGE_PLANS, buildCheckoutPayload).

const FITZ_MESSAGES = [
"Fitz analyse votre profil.",
"Fitz construit votre stratégie.",
"Fitz améliore votre CV.",
"Fitz optimise vos documents.",
"Fitz prépare votre dossier.",
"Fitz vous accompagne jusqu'au dépôt."
];

function initFitzRotator() {

const el = document.getElementById("fitzRotatorMessage");

if (!el) return;

let index = 0;

setInterval(() => {

index = (index + 1) % FITZ_MESSAGES.length;

el.classList.add("is-swapping");

setTimeout(() => {

el.textContent = FITZ_MESSAGES[index];
el.classList.remove("is-swapping");

}, 280);

}, 2800);

}

function initReveal() {

document.documentElement.classList.add("js-ready");

const items = document.querySelectorAll(".reveal");

if (!items.length) return;

if (!("IntersectionObserver" in window)) {
items.forEach((item) => item.classList.add("is-visible"));
return;
}

const observer = new IntersectionObserver((entries) => {

entries.forEach((entry) => {
if (entry.isIntersecting) {
entry.target.classList.add("is-visible");
observer.unobserve(entry.target);
}
});

// CAUSE B — seuil indépendant de la hauteur.
// L'ancien `threshold: 0.12` exigeait que 12% de l'élément soit
// visible : au-delà d'une hauteur de viewport/0.12, la condition
// devient mathématiquement impossible et l'élément reste invisible
// pour toujours. La section du tableau comparatif atteint 5072px en
// mode empilé, soit 609px requis — inatteignable sur un téléphone en
// paysage. Le rootMargin négatif conserve l'effet recherché (révéler
// un peu après l'entrée à l'écran) sans dépendre de la hauteur.
}, { threshold: 0, rootMargin: "0px 0px -60px 0px" });

items.forEach((item) => {

// CAUSE A — ne jamais laisser un élément invisible faute d'avoir été vu.
// Poser `js-ready` bascule tous les .reveal à opacity:0 : la
// visibilité ne revient que par l'observer. Or au rechargement,
// Chrome restaure la position de défilement, et l'observer démarre
// donc avec une partie de la page DÉJÀ dépassée. Ces éléments-là
// n'entreront plus jamais dans le viewport si l'utilisateur ne
// remonte pas — le haut de la page restait blanc. On les révèle
// immédiatement plutôt que de les laisser masqués.
if (item.getBoundingClientRect().bottom < 0) {
item.classList.add("is-visible");
return;
}

observer.observe(item);

});

}

// Grille B (2026-09-07), puis grille A : les prix de la page (F CFA et
// équivalent en euros) viennent de pricing-plans.js — offers.html ne
// contient AUCUN montant d'offre écrit en dur. Le « coût par
// candidature » a disparu avec la grille A : le volume n'est plus
// l'argument.
const EUR_PER_XOF = 655.957;
const formatF = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

function initDerivedPrices() {

// Lot PAIEMENT-SÛR (2026-09-17) : le F CFA porte le montant (en gros,
// l'unité « F CFA » est écrite à côté dans le HTML), l'euro n'est plus
// qu'un repère en petit. C'est le F CFA que PayDunya débite.
document.querySelectorAll("[data-price-of]").forEach((el) => {
const plan = SCHOLARBRIDGE_PLANS[el.dataset.priceOf];
if (plan) el.textContent = formatF(plan.priceFCFA);
});

document.querySelectorAll("[data-eur-of]").forEach((el) => {
const plan = SCHOLARBRIDGE_PLANS[el.dataset.eurOf];
if (plan) el.textContent = `soit environ ${Math.round(plan.priceFCFA / EUR_PER_XOF)} €`;
});

}

function initPlanSelection() {

document.querySelectorAll(".plan-cta").forEach((button) => {

button.addEventListener("click", () => {

const planId = button.dataset.plan;
const payload = buildCheckoutPayload(planId);

if (!payload) return;

// Lot 127 : la destination choisie voyage jusqu'au paiement (payment.js
// la lit dans l'adresse, le serveur ouvre le dossier de CE pays).
const destination = button.dataset.destination || "";
if (destination && destination !== "france") payload.destination = destination;

sessionStorage.setItem("scholarbridgeCheckout", JSON.stringify(payload));

window.location.href = `payment.html?plan=${encodeURIComponent(planId)}${destination && destination !== "france" ? `&destination=${encodeURIComponent(destination)}` : ""}`;

});

});

}

// ==========================================================
// LOT 127 (2026-09-26) — LA PRÉINSCRIPTION DANS NEUF PAYS
// ==========================================================
// Charles, sur téléphone : « Formules » côté préinscriptions menait au
// seul Diagnostic France. La vue commence désormais par le choix du
// pays. Les trois cartes du HTML (France) restent la référence et le
// repli sans JavaScript ; pour un autre pays, elles sont réécrites
// depuis offrePourDestination (pricing-plans.js) — la même source que
// les pages de destination (js/preinscription-destination.js). Le
// pays choisi reste dans l'adresse (?destination=), que l'on peut
// partager, et que les pages de destination utilisent déjà.

const NOM_FRANCE = "France";

function destinationsDisponibles() {
const autres = window.SCHOLARBRIDGE_DESTINATIONS || {};
return [{ id: "france", nom: NOM_FRANCE }].concat(Object.keys(autres).map((id) => ({ id, nom: autres[id].nom })));
}

function echapper(texte) {
return String(texte == null ? "" : texte).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[c]));
}

function puces(liste) {
return liste.map((h) => `<li><i data-lucide="check"></i><span>${echapper(h)}</span></li>`).join("");
}

function initDestinations() {

const section = document.getElementById("preinscriptions");
const choix = document.getElementById("destinationChoix");
const liste = document.getElementById("destinationChoixListe");
const grille = document.getElementById("preinscriptionGrille");
if (!section || !choix || !liste || !grille || typeof window.offrePourDestination !== "function") return;

const cartes = [...grille.querySelectorAll("article.plan-card")];
const carteDiagnostic = cartes.find((c) => c.querySelector('a[href="diagnostic-france.html"]'));
const carteDe = (planId) => cartes.find((c) => c.querySelector(`[data-plan="${planId}"]`));
// Les textes France du HTML, relevés une fois : revenir à la France,
// c'est les reposer. Les ÉLÉMENTS ne sont jamais recréés — les boutons
// gardent leurs écouteurs (initPlanSelection) et leurs marques
// (js/offers-current-plan.js).
const lireTexte = (carte, sel) => { const el = carte.querySelector(sel); return el ? el.textContent : ""; };
const lireHtml = (carte, sel) => { const el = carte.querySelector(sel); return el ? el.innerHTML : ""; };
const originaux = new Map(cartes.map((c) => [c, {
titre: lireTexte(c, ".plan-head h2"),
promesse: lireTexte(c, ".plan-tagline"),
terme: lireTexte(c, ".plan-price-term"),
note: c.querySelector(".plan-price-note"),
quota: lireHtml(c, ".plan-quota"),
puces: lireHtml(c, ".plan-features"),
cta: lireTexte(c, ".plan-cta span"),
lien: c.querySelector("a.plan-cta") ? c.querySelector("a.plan-cta").getAttribute("href") : null
}]));

function reposerFrance(carte) {
const o = originaux.get(carte);
const poser = (sel, texte) => { const el = carte.querySelector(sel); if (el) el.textContent = texte; };
poser(".plan-head h2", o.titre);
poser(".plan-tagline", o.promesse);
poser(".plan-price-term", o.terme);
poser(".plan-cta span", o.cta);
if (o.note && !o.note.isConnected) { const terme = carte.querySelector(".plan-price-term"); if (terme) terme.after(o.note); }
const quota = carte.querySelector(".plan-quota"); if (quota) quota.innerHTML = o.quota;
const liste = carte.querySelector(".plan-features"); if (liste) liste.innerHTML = o.puces;
if (o.lien) carte.querySelector("a.plan-cta").setAttribute("href", o.lien);
}

document.querySelectorAll("[data-prix-note]").forEach((el) => {
const plan = SCHOLARBRIDGE_PLANS[el.dataset.prixNote];
if (plan) el.textContent = formatF(plan.priceFCFA).replace(/ /g, "\u00a0");
});

const destinations = destinationsDisponibles();
liste.innerHTML = destinations.map((d) => `<button type="button" class="destination-choix-pays" data-destination="${echapper(d.id)}" aria-pressed="false">${echapper(d.nom)}</button>`).join("");

function ecrireDiagnostic(d) {
if (!carteDiagnostic) return;
carteDiagnostic.querySelector(".plan-head h2").textContent = `Diagnostic ${d.nom}`;
carteDiagnostic.querySelector(".plan-features").innerHTML = puces([
"Votre niveau d'études contre les règles officielles : pouvez-vous postuler, et sinon ce qui vous manque",
"La langue des cours, vos ressources contre le seuil publié, et le calendrier",
"Le coût de la première année, chaque montant avec sa source"
]);
carteDiagnostic.querySelector("a.plan-cta").setAttribute("href", `diagnostic-pays.html?d=${encodeURIComponent(d.id)}`);
}

function ecrireDossier(planId, d) {
const carte = carteDe(planId);
const offre = window.offrePourDestination(planId, d.id);
if (!carte || !offre) return;
carte.querySelector(".plan-head h2").textContent = offre.label;
carte.querySelector(".plan-tagline").textContent = offre.tagline;
const terme = carte.querySelector(".plan-price-term");
if (terme) terme.textContent = offre.duration ? `accompagnement de ${offre.duration}` : "";
const note = carte.querySelector(".plan-price-note");
if (note) note.remove();
const quota = carte.querySelector(".plan-quota");
if (quota) {
quota.innerHTML = offre.maxPreinscriptions === 1
? "<strong>1 cours</strong><span>la règle du pays : un seul choix</span>"
: `<strong>Jusqu'à ${offre.maxPreinscriptions}</strong><span>vœux, dans un seul dossier</span>`;
}
carte.querySelector(".plan-features").innerHTML = puces(offre.highlights || []);
const bouton = carte.querySelector("[data-plan]");
bouton.querySelector("span").textContent = offre.cta;
bouton.dataset.destination = d.id;
}

function appliquer(id, { memoriser } = { memoriser: true }) {
const d = destinations.find((x) => x.id === id);
if (!d) return;
liste.querySelectorAll(".destination-choix-pays").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.destination === id)));
cartes.forEach(reposerFrance);
if (id !== "france") {
ecrireDiagnostic(d);
ecrireDossier("dossier-france", d);
ecrireDossier("dossier-france-conseiller", d);
}
grille.querySelectorAll("[data-plan]").forEach((b) => { b.dataset.destination = id; });
grille.hidden = false;
if (window.lucide) window.lucide.createIcons();
if (memoriser) {
try {
const url = new URL(window.location.href);
url.searchParams.set("parcours", "preinscription");
url.searchParams.set("destination", id);
history.replaceState(history.state, "", url);
} catch (e) { /* l'adresse reste telle quelle */ }
}
}

liste.addEventListener("click", (evenement) => {
const bouton = evenement.target.closest(".destination-choix-pays");
if (!bouton) return;
appliquer(bouton.dataset.destination);
grille.scrollIntoView({ behavior: "smooth", block: "start" });
});

choix.hidden = false;
const demandee = new URLSearchParams(window.location.search).get("destination");
if (demandee && destinations.some((d) => d.id === demandee)) {
appliquer(demandee, { memoriser: false });
} else {
// Aucun pays encore : les prix sont dans la note, les cartes attendent
// le choix — plus de « Diagnostic France » présenté à tout le monde.
grille.hidden = true;
}

}

initFitzRotator();
initReveal();
initDerivedPrices();
initDestinations();
initPlanSelection();

// lucide est chargé avec `defer` (2026-08-29) : ce script classique
// s'exécute AVANT lui, un appel direct ne rendrait aucune icône (et ne
// lèverait aucune erreur — le garde-fou window.lucide le rend
// silencieux). DOMContentLoaded se déclenche après les scripts différés.
document.addEventListener("DOMContentLoaded", () => {
if (window.lucide) lucide.createIcons();
});
