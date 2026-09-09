// ============================================================
// diagnostic-france.html — branchement de js/diagnostic-france.js
// (grille B, 2026-09-07). Verrouillé par "diagnostic_france". Le
// résultat est enregistré sur users/{uid}.diagnosticFrance pour que
// l'étudiant le retrouve ; c'est la seule écriture de la page.
// ============================================================
import { db } from "../firebase-config.js";
import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { initShellChrome, bootstrapShell } from "./app-shell.js";
import { calculerDiagnostic, formatEUR } from "./diagnostic-france.js";
import { COUNTRY_NAMES } from "./countries.js";
import { formaterDate } from "./echeance.js";
import { escapeHtml } from "./ai/format.js";

initShellChrome();

// Le lien de source n'est rendu que s'il y en a une. Un bloc « non
// verifie pour votre pays » n'a pas de source : lui en fabriquer une
// (celle du Senegal, la plus proche) serait exactement le mensonge que
// ce lot corrige.
function renderBloc(titre, bloc) {
const source = bloc.source
? `<a class="diag-source" href="${escapeHtml(bloc.source)}" target="_blank" rel="noopener">Source — vérifié le ${escapeHtml(formaterDate(bloc.verifieLe))}</a>`
: `<span class="diag-source diag-source--absente">Aucune source vérifiée pour votre pays à ce jour.</span>`;
return `<li class="diag-bloc ${bloc.atteint === false || bloc.documente === false ? "is-ecart" : ""}">
<strong>${escapeHtml(titre)}</strong>
<p>${escapeHtml(bloc.texte)}</p>
${source}
</li>`;
}

function render(resultat) {
document.getElementById("diagVerdict").textContent = resultat.verdict;
document.getElementById("diagBlocs").innerHTML =
renderBloc("Ressources exigées pour le visa", resultat.ressources) +
renderBloc("Droits d'inscription", resultat.droits) +
renderBloc("Frais de dossier Campus France", resultat.fraisDossier);
document.getElementById("diagTotal").textContent = resultat.total.texte;
document.getElementById("diagResultat").hidden = false;
if (window.lucide) lucide.createIcons();
}

// Verrou (grille B) : aucune formule bourse n'ouvre cette page — seules
// les trois offres préinscription le font. On n'emprunte donc pas
// unlockingPlans() (qui parcourt les formules bourse) ni la voix de
// Fitz : la page renvoie vers la colonne préinscription de la grille.
function renderLockedState(container) {
container.innerHTML = `
<div class="ai-locked-hero">
<div class="ai-locked-icon"><i data-lucide="lock"></i></div>
<h2>Diagnostic France</h2>
<p>Cette page est ouverte par les offres préinscription : Diagnostic France, Dossier France ou Dossier France + Conseiller. Elle n'est comprise dans aucune formule bourse.</p>
<a href="offers.html?parcours=preinscription" class="btn btn-primary"><span>Voir les offres préinscription</span></a>
</div>
`;
container.hidden = false;
if (window.lucide) lucide.createIcons();
}

bootstrapShell({ feature: "diagnostic_france", espace: "preinscription" }).then(async (ctx) => {

if (!ctx) return;

if (ctx.locked) {
document.getElementById("diagnosticApp").remove();
renderLockedState(document.getElementById("lockedState"));
return;
}

const form = document.getElementById("diagForm");
document.getElementById("diagPaysListe").innerHTML = COUNTRY_NAMES.map((n) => `<option value="${escapeHtml(n)}"></option>`).join("");

// Le pays de residence du profil pre-remplit le champ : la plupart des
// etudiants candidatent depuis chez eux, et redemander ce quon sait
// deja est une friction gratuite. Reste modifiable — on pre-remplit,
// on nimpose pas.
const paysProfil = (ctx.profile && (ctx.profile.country || ctx.profile.originCountry)) || "";
if (paysProfil) document.getElementById("diagPays").value = paysProfil;
const sauvegarde = document.getElementById("diagSauvegarde");

// Un diagnostic déjà enregistré se réaffiche tel quel.
const precedent = ctx.userData && ctx.userData.diagnosticFrance;
if (precedent && precedent.entrees) {
document.getElementById("diagPays").value = precedent.entrees.paysResidence || paysProfil || "";
document.getElementById("diagRessources").value = precedent.entrees.ressourcesMensuelles ?? "";
document.getElementById("diagDevise").value = precedent.entrees.devise || "XOF";
const niveau = form.querySelector(`input[name="niveau"][value="${precedent.entrees.niveau}"]`);
if (niveau) niveau.checked = true;
document.getElementById("diagExoneration").checked = precedent.entrees.exonerationEsperee === true;
render(calculerDiagnostic(precedent.entrees));
if (precedent.calculeLe) {
sauvegarde.textContent = `Dernier diagnostic enregistré le ${formaterDate(String(precedent.calculeLe).slice(0, 10))}.`;
sauvegarde.hidden = false;
}
}

form.addEventListener("submit", async (event) => {

event.preventDefault();

const entrees = {
paysResidence: document.getElementById("diagPays").value.trim(),
ressourcesMensuelles: Number(document.getElementById("diagRessources").value),
devise: document.getElementById("diagDevise").value,
niveau: form.querySelector('input[name="niveau"]:checked').value,
exonerationEsperee: document.getElementById("diagExoneration").checked
};

if (!entrees.paysResidence) {
document.getElementById("diagPays").focus();
return;
}

if (!Number.isFinite(entrees.ressourcesMensuelles) || entrees.ressourcesMensuelles < 0) {
document.getElementById("diagRessources").focus();
return;
}

const resultat = calculerDiagnostic(entrees);
render(resultat);

try {
await updateDoc(doc(db, "users", ctx.user.uid), {
diagnosticFrance: {
entrees,
verdict: resultat.verdict,
atteint: resultat.ressources.atteint,
ecartMensuel: resultat.ressources.ecartMensuel,
totalAnnuelEUR: resultat.total.annuelEUR,
paysResidence: entrees.paysResidence,
totalInclutFraisDossier: resultat.total.inclutFraisDossier,
calculeLe: new Date().toISOString()
}
});
sauvegarde.textContent = `Diagnostic enregistré — vous le retrouverez ici. Total annuel : ${formatEUR(resultat.total.annuelEUR)}.`;
sauvegarde.hidden = false;
} catch (error) {
console.error("Impossible d'enregistrer le diagnostic :", error);
sauvegarde.textContent = "Le diagnostic est calculé mais n'a pas pu être enregistré. Réessayez plus tard.";
sauvegarde.hidden = false;
}

});

});
