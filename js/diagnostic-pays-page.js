// ============================================================
// diagnostic-pays.html?d=<pays> — branchement de js/diagnostic-pays.js
// (2026-09-23, les six destinations ouvertes le même jour)
//
// Même page que le Diagnostic France, dans le même ordre : le verdict en
// une phrase, le détail sourcé ligne par ligne, le calendrier publié, ce
// que nous n'avons pas trouvé, les étapes de la procédure, et l'offre une
// seule fois.
//
// QUI Y ENTRE. Une offre préinscription DE CE PAYS (Diagnostic, Dossier
// ou Dossier + Conseiller), lue dans users/{uid}.preinscriptionsPays.<pays>
// (planPreinscriptionPour) — un Diagnostic Maroc n'ouvre pas le
// Diagnostic Italie. L'accès test (testerAccess) ouvre tout, comme
// ailleurs.
//
// Le résultat est enregistré sur users/{uid}.diagnosticsPays.<pays>, la
// seule écriture de la page : l'étape 2 de la route du pays le relit.
// ============================================================
import { db } from "../firebase-config.js";
import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { initShellChrome, bootstrapShell } from "./app-shell.js";
import { calculerDiagnosticPays, devisesDeSaisie, libelleDevise, formatMontant } from "./diagnostic-pays.js";
import { destination, DIAGNOSTICS, enClairDe } from "./destinations-preinscription.js";
import { planPreinscriptionPour } from "./plan-features.js";
import { trouverProcedure } from "./procedures/index.js";
import { texteConsigne } from "./procedures/vocabulaire.js";
import { formaterDate } from "./echeance.js";
import { escapeHtml } from "./ai/format.js";
import { auPays, avecArticle } from "./pays-grammaire.js";

initShellChrome();

const ID = String(new URLSearchParams(window.location.search).get("d") || "").toLowerCase();
const DEST = destination(ID);

function hoteDe(url) {
try {
return new URL(url).hostname.replace(/^www\./, "");
} catch {
return "Source";
}
}

function lienSource(source, verifieLe) {
return source
? `<a class="diag-source" href="${escapeHtml(source)}" target="_blank" rel="noopener">${escapeHtml(hoteDe(source))} — vérifié le ${escapeHtml(formaterDate(verifieLe))}</a>`
: `<span class="diag-source diag-source--absente">Aucune source officielle trouvée à ce jour.</span>`;
}

function render(resultat) {

document.getElementById("diagVerdict").textContent = resultat.verdict.phrase;

document.getElementById("diagBlocs").innerHTML = resultat.lignes.map((l) => `
<li class="diag-bloc ${l.absente ? "is-ecart" : ""}">
<strong>${escapeHtml(l.libelle)}${l.compte && Number.isFinite(l.montant) ? ` — ${escapeHtml(formatMontant(l.montant, l.devise))}${l.cle === "ressources" ? " sur l'année" : ""}` : ""}${l.compte && l.cle === "droits" ? ` — de ${escapeHtml(formatMontant(l.min, l.devise))} à ${escapeHtml(formatMontant(l.max, l.devise))} par an` : ""}</strong>
<p>${escapeHtml(l.texte)}</p>
${lienSource(l.source, l.verifieLe)}
</li>`).join("");

document.getElementById("diagTotal").textContent = resultat.totalTexte;
document.getElementById("diagHorsTotal").textContent = resultat.horsTotal;

const cal = resultat.calendrier;
document.getElementById("diagCalendrier").textContent = cal ? cal.texte : "Aucun calendrier officiel n'est encore publié pour la prochaine rentrée.";
document.getElementById("diagCalendrierSource").innerHTML = cal ? lienSource(cal.source, cal.verifieLe) : "";

const absences = resultat.absences || [];
document.getElementById("diagSectionAbsences").hidden = !absences.length;
document.getElementById("diagAbsences").innerHTML = absences.map((a) => `<li><p>${escapeHtml(a)}</p></li>`).join("");

renderEtapes();

document.getElementById("diagResultat").hidden = false;
if (window.lucide) lucide.createIcons();

}

function renderEtapes() {
const procedure = trouverProcedure({ paysDestination: DEST.nom });
if (!procedure) return;
document.getElementById("diagEtapesIntro").textContent = `La procédure ${procedure.portail.nom}, ${procedure.etapes.length} étapes, dans l'ordre. Elle est écrite ici en entier — vous pouvez la suivre seul ; votre espace vous la présente une étape à la fois.`;
document.getElementById("diagEtapes").innerHTML = procedure.etapes.map((e) => {
const clair = enClairDe(ID, e.id);
return `
<li>
<strong>${escapeHtml((clair && clair.titre) || e.titre)}</strong>
<p>${escapeHtml((clair && clair.enClair) || texteConsigne(e))}</p>
${lienSource(e.source, e.verifieLe)}
</li>`;
}).join("");
}

function renderOffre(userData) {
const plan = planPreinscriptionPour(userData || {}, ID);
const section = document.getElementById("diagSectionOffre");
// Un compte qui a déjà un dossier de ce pays n'a rien à acheter ici.
if (plan && plan !== "diagnostic-france") { section.hidden = true; return; }
const offrir = typeof window.offrePourDestination === "function";
const dossier = offrir ? window.offrePourDestination("dossier-france", ID) : null;
const conseiller = offrir ? window.offrePourDestination("dossier-france-conseiller", ID) : null;
if (!dossier || !conseiller) { section.hidden = true; return; }
const tarif = typeof window.prixAvecDeduction === "function" ? window.prixAvecDeduction("dossier-france", userData || {}, new Date(), ID) : null;
const espacer = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
document.getElementById("diagOffrePreambule").textContent = `Ce diagnostic vous a donné le chiffre. Pour être suivi étape par étape jusqu'au départ ${auPays(DEST.nom)} :`;
document.getElementById("diagOffres").innerHTML = [
{ o: dossier, prix: tarif && tarif.deduction ? `${espacer(tarif.prix)} F au lieu de ${espacer(tarif.base)} F — ${tarif.mention}` : `${espacer(dossier.priceFCFA)} F` },
{ o: conseiller, prix: `${espacer(conseiller.priceFCFA)} F` }
].map(({ o, prix }) => `<li><strong>${escapeHtml(o.label)} (${escapeHtml(prix)})</strong> — ${escapeHtml(o.tagline)} <a href="payment.html?plan=${escapeHtml(o.id)}&amp;destination=${escapeHtml(ID)}">Choisir</a></li>`).join("");
section.hidden = false;
}

function renderLockedState(container) {
container.innerHTML = `
<div class="ai-locked-hero">
<div class="ai-locked-icon"><i data-lucide="lock"></i></div>
<h2>Diagnostic ${escapeHtml(DEST ? DEST.nom : "")}</h2>
<p>Cette page est ouverte par une offre préinscription de ce pays : ${escapeHtml(DEST ? `Diagnostic ${DEST.nom}, Dossier ${DEST.nom} ou Dossier ${DEST.nom} + Conseiller` : "")}.</p>
<a href="${DEST ? `preinscription-${escapeHtml(ID)}.html` : "preinscriptions.html"}" class="btn btn-primary"><span>Voir les offres</span></a>
</div>`;
container.hidden = false;
if (window.lucide) lucide.createIcons();
}

if (!DEST) {
window.location.replace("preinscriptions.html");
} else {

document.title = `Diagnostic ${DEST.nom} | FitzUniverse`;
document.getElementById("diagTitre").textContent = `Diagnostic ${DEST.nom}`;
document.getElementById("diagIntroTitre").textContent = `Une réponse chiffrée avant d'engager des frais ${auPays(DEST.nom)}`;
const retour = document.getElementById("diagRetour");
if (retour) retour.setAttribute("href", `espace-preinscription.html?d=${encodeURIComponent(ID)}`);

bootstrapShell({ feature: "diagnostic_france", espace: "preinscription" }).then(async (ctx) => {

if (!ctx) return;

const possede = ctx.testerAccess === true || !!planPreinscriptionPour(ctx.userData || {}, ID);
if (ctx.locked || !possede) {
document.getElementById("diagnosticApp").remove();
renderLockedState(document.getElementById("lockedState"));
return;
}

const form = document.getElementById("diagForm");
const select = document.getElementById("diagDevise");
const faits = DIAGNOSTICS[ID];
const seuil = faits.ressources;

// La devise par défaut : celle du SEUIL quand il n'est ni en euros ni en
// F CFA (dollar canadien, lei) — c'est la seule qui permette un verdict
// sans taux de change. Sinon le F CFA, comme pour la France.
select.innerHTML = devisesDeSaisie(ID).map((d) => `<option value="${d}">${escapeHtml(libelleDevise(d))}</option>`).join("");
select.value = seuil && !["EUR", "XOF"].includes(seuil.devise) ? seuil.devise : "XOF";
if (seuil && !["EUR", "XOF"].includes(seuil.devise)) {
document.getElementById("diagDeviseAide").textContent = `Le seuil ${auPays(DEST.nom)} est fixé en ${libelleDevise(seuil.devise)} : indiquez vos ressources dans cette devise pour une comparaison exacte. Nous n'utilisons aucun taux de change.`;
} else if (!seuil) {
// « Le Maroc », « La Chine »… : l'article vient de la grammaire des pays,
// jamais d'une alternative écrite pour deux pays (elle disait « La Turquie »
// pour la Chine et la Malaisie).
const sujet = avecArticle(DEST.nom);
document.getElementById("diagDeviseAide").textContent = `${sujet.charAt(0).toUpperCase()}${sujet.slice(1)} ne chiffre aucun seuil : vos ressources ne décident d'aucun verdict ici, mais le coût de l'année vous est donné en entier.`;
}

if (faits.variante) {
document.getElementById("diagVarianteChamp").hidden = false;
document.getElementById("diagVarianteLibelle").textContent = faits.variante.libelle;
}

const sauvegarde = document.getElementById("diagSauvegarde");
const precedent = ctx.userData && ctx.userData.diagnosticsPays && ctx.userData.diagnosticsPays[ID];

if (precedent && precedent.entrees) {
document.getElementById("diagRessources").value = precedent.entrees.ressourcesMensuelles ?? "";
if (precedent.entrees.devise) select.value = precedent.entrees.devise;
document.getElementById("diagVariante").checked = !!precedent.entrees.variante;
render(calculerDiagnosticPays(ID, precedent.entrees));
if (precedent.calculeLe) {
sauvegarde.textContent = `Diagnostic enregistré le ${formaterDate(String(precedent.calculeLe).slice(0, 10))}. Vos chiffres ont changé ? Modifiez-les ci-dessus et relancez le calcul, sans rien repayer.`;
sauvegarde.hidden = false;
}
}

renderOffre(ctx.userData);

form.addEventListener("submit", async (event) => {

event.preventDefault();

const entrees = {
ressourcesMensuelles: Number(document.getElementById("diagRessources").value),
devise: select.value,
variante: faits.variante && document.getElementById("diagVariante").checked ? faits.variante.id : ""
};

if (!Number.isFinite(entrees.ressourcesMensuelles) || entrees.ressourcesMensuelles < 0 || document.getElementById("diagRessources").value === "") {
document.getElementById("diagRessources").focus();
return;
}

const resultat = calculerDiagnosticPays(ID, entrees);
render(resultat);

try {
await updateDoc(doc(db, "users", ctx.user.uid), {
[`diagnosticsPays.${ID}`]: {
entrees,
verdict: resultat.verdict.phrase,
etatVerdict: resultat.verdict.etat,
totaux: resultat.totaux,
totalTexte: resultat.totalTexte,
calculeLe: new Date().toISOString()
}
});
sauvegarde.textContent = "Diagnostic enregistré dans votre dossier : l'étape 2 de votre route est faite.";
sauvegarde.hidden = false;
} catch (error) {
console.error("Diagnostic non enregistré :", error);
sauvegarde.textContent = "Le calcul est juste, mais il n'a pas pu être enregistré. Réessayez dans un instant.";
sauvegarde.hidden = false;
}

});

}).catch((error) => {
console.error("Le diagnostic n'a pas pu s'afficher :", error);
});

}
