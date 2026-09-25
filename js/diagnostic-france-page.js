// ============================================================
// diagnostic-france.html — branchement de js/diagnostic-france.js
// (grille B, 2026-09-07). OUVERT À TOUT COMPTE depuis le lot 97
// (2026-09-25) : le diagnostic est gratuit, et il commence par « Puis-je
// me lancer ? » (lot 98, js/recevabilite.js).
//
// LOT DIAGNOSTIC-2 (2026-09-09) — cette page rendait un TOTAL. Un total
// est une donnée ; l'étudiant a payé 10 000 F pour une DÉCISION et un
// CHEMIN. Elle rend désormais, dans cet ordre : le verdict en une
// phrase, le détail sourcé ligne par ligne, les points de vigilance de
// son pays, son calendrier en jours, les leviers qui font baisser le
// total, les onze étapes qui lui restent, l'offre une seule fois, et la
// phrase de fin.
//
// RIEN N'EST MASQUÉ POUR FAIRE PAYER LA SUITE. Le catalogue est chargé
// pour calculer les leviers ; s'il ne se charge pas, les deux leviers
// qui en dépendent disparaissent — les autres restent. Une section
// absente n'est jamais une section verrouillée.
//
// Le résultat est enregistré sur users/{uid}.diagnosticFrance pour que
// l'étudiant le retrouve et le rejoue quand ses chiffres changent ;
// c'est la seule écriture de la page.
// ============================================================
import { db } from "../firebase-config.js";
import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { initShellChrome, bootstrapShell } from "./app-shell.js";
import { puisJeMeLancer } from "./recevabilite.js";
import { poserQuestions, lireReponses, manquantes, signalerManque, peindreVoyants } from "./recevabilite-ui.js";
import { calculerDiagnostic, formatEUR, verdictChiffre, lignesChiffrees, phraseDeFin } from "./diagnostic-france.js";
import {
vigilanceDe,
calendrierDe,
leviersDe,
etapesRestantes,
PREAMBULE_OFFRE,
OFFRES_ACCOMPAGNEMENT
} from "./diagnostic-conseil.js";
import { chargerCatalogue } from "./catalog-data.js";
import { COUNTRY_NAMES } from "./countries.js";
import { initFitzCombobox } from "./fitz-combobox.js";
import { formaterDate } from "./echeance.js";
import { escapeHtml } from "./ai/format.js";
import { resolvePlanPreinscriptionFrance } from "./plan-features.js";

initShellChrome();

// Le catalogue sert UNIQUEMENT aux deux leviers qui en dépendent
// (université la moins chère, bourses ouvertes). Il est chargé une fois,
// en parallèle du reste, et son échec ne casse rien : `null` fait
// simplement disparaître ces deux leviers-là.
let CATALOGUE = null;

// Le lien de source n'est rendu que s'il y en a une. Un bloc « non
// verifie pour votre pays » n'a pas de source : lui en fabriquer une
// (celle du Senegal, la plus proche) serait exactement le mensonge que
// le lot S2 corrige.
function lienSource(source, verifieLe, absente = "Aucune source vérifiée pour votre pays à ce jour.") {
return source
? `<a class="diag-source" href="${escapeHtml(source)}" target="_blank" rel="noopener">${escapeHtml(hoteDe(source))} — vérifié le ${escapeHtml(formaterDate(verifieLe))}</a>`
: `<span class="diag-source diag-source--absente">${escapeHtml(absente)}</span>`;
}

// Le NOM DU SITE plutôt que « Source ». « campusfrance.org » dit d'où
// vient le chiffre sans qu'on clique — et c'est précisément ce qu'aucun
// concurrent ne peut copier honnêtement.
function hoteDe(url) {
try {
return new URL(url).hostname.replace(/^www\./, "");
} catch {
return "Source";
}
}

function renderLignes(resultat) {

document.getElementById("diagBlocs").innerHTML = lignesChiffrees(resultat).map((l) => `
<li class="diag-bloc ${l.absente ? "is-ecart" : ""}">
<strong>${escapeHtml(l.libelle)}</strong>
<p>${escapeHtml(l.texte)}</p>
${lienSource(l.source, l.verifieLe)}
</li>`).join("");

document.getElementById("diagTotal").textContent = resultat.total.texte;

}

function renderVigilance(pays) {

const points = vigilanceDe(pays);
const section = document.getElementById("diagSectionVigilance");

// Aucun bloc vide : un pays sans point de vigilance documenté ne reçoit
// pas un titre suivi de rien (règle du lot S2-MODÈLE).
if (!points.length) { section.hidden = true; return; }

section.hidden = false;
document.getElementById("diagVigilanceTitre").textContent = `Les points de vigilance ${pays ? `— ${pays}` : "de votre pays"}`;
document.getElementById("diagVigilance").innerHTML = points.map((p) => `
<li>
<p>${escapeHtml(p.texte)}</p>
${lienSource(p.source, p.verifieLe)}
</li>`).join("");

}

function renderCalendrier(pays) {

const cal = calendrierDe(pays);
const liste = document.getElementById("diagCalendrier");
const absence = document.getElementById("diagCalendrierAbsence");
const source = document.getElementById("diagCalendrierSource");

// AUCUNE URGENCE INVENTÉE. Sans calendrier publié, on affiche la phrase
// d'absence de la couche — jamais une date reprise d'une campagne
// passée, même « à titre indicatif ».
liste.innerHTML = cal.documente
? cal.jalons.map((j) => `<li class="${j.jours < 0 ? "is-passe" : j.jours <= 30 ? "is-proche" : ""}">${escapeHtml(j.texte)}</li>`).join("")
: "";

absence.hidden = cal.documente;
absence.textContent = cal.documente ? "" : cal.absence;

source.hidden = !cal.source;
source.innerHTML = cal.source ? lienSource(cal.source, cal.verifieLe) : "";

}

function renderLeviers(resultat) {

const leviers = leviersDe(resultat, {
catalogue: CATALOGUE,
profile: resultat.profil || null
});

document.getElementById("diagLeviers").innerHTML = leviers
// Un levier « non disponible » qui a quand même une phrase la dit :
// « nous n'avons pas encore vérifié les frais » est une information.
// Un levier vide (aucune bourse ouverte) disparaît, il ne s'affiche pas
// en creux — le briefing l'exige, et « 0 bourse » se lirait comme un
// verdict sur le profil.
.filter((l) => l.texte)
.map((l) => `
<li class="diag-levier ${l.disponible ? "" : "is-partiel"}">
<p>${escapeHtml(l.texte)}</p>
${Array.isArray(l.bourses) && l.bourses.length ? `<ul class="diag-bourses">${l.bourses.map((b) => `
<li>
<strong>${escapeHtml(b.titre)}</strong> — ${escapeHtml(b.universite)}${typeof b.jours === "number" ? ` · clôture dans ${b.jours} jour${b.jours > 1 ? "s" : ""}` : ""}
${b.financement ? `<p>${escapeHtml(b.financement)}</p>` : ""}
${b.source ? lienSource(b.source, b.verifieLe) : ""}
</li>`).join("")}</ul>` : ""}
${l.lien ? `<a class="diag-passerelle" href="${escapeHtml(l.lien)}">Voir les formules bourse</a>` : ""}
${l.source ? lienSource(l.source, l.verifieLe) : ""}
</li>`).join("");

}

function renderEtapes(pays) {

const { etapes, residenceDocumentee, avertissement } = etapesRestantes(pays);

document.getElementById("diagEtapesIntro").textContent = residenceDocumentee
// « depuis votre pays de résidence (Sénégal) » et non « depuis
// Sénégal » (vu en ligne le 2026-09-18) : un nom de pays injecté après
// une préposition demande son article — le Sénégal, la Côte d'Ivoire,
// mais Madagascar sans article. Plutôt qu'une table de grammaire à
// tenir pour deux cents pays, la phrase est tournée pour n'en avoir
// pas besoin — même esprit que l'élision des langues dans
// js/ai/prompts.js (« de l'anglais », « du français »).
? `La procédure Études en France, telle qu'elle s'applique depuis votre pays de résidence (${pays}) : ${etapes.length} étapes, dans l'ordre. Elle est écrite ici en entier — vous pouvez la suivre seul.`
: `La procédure Études en France, ${etapes.length} étapes, dans l'ordre. Les montants, les dates et les lieux qui dépendent de votre pays de résidence ne sont pas encore vérifiés : chaque étape concernée le dit.`;

const bandeau = document.getElementById("diagAvertissement");
bandeau.hidden = !avertissement;
bandeau.textContent = avertissement || "";

document.getElementById("diagEtapes").innerHTML = etapes.map((e) => `
<li>
<strong>${escapeHtml(e.titre)}</strong>
${e.echeance ? `<span class="diag-etape-echeance">${escapeHtml(e.echeance.texte)}</span>` : ""}
<p>${escapeHtml(e.consigne)}</p>
${lienSource(e.source, e.verifieLe)}
</li>`).join("");

}

const espacer = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

// PARTIE B — LES 10 000 F DU DIAGNOSTIC SE DÉDUISENT. Nulle part cette
// mention n'a plus sa place qu'ici : la personne qui la lit vient
// précisément de payer ce diagnostic. Le prix affiché est celui du
// compte ; celui qui FAIT FOI est recalculé par la Cloud Function avant
// la facture (functions/lib/achat.js).
function renderOffre(userData, etatRecevabilite) {

// On ne vend jamais un accompagnement à qui ne peut pas encore postuler (lot 98).
const section = document.getElementById("diagOffrePreambule").closest("section");
if (section) section.hidden = etatRecevabilite === "pas-encore";

document.getElementById("diagOffrePreambule").textContent = PREAMBULE_OFFRE;

document.getElementById("diagOffres").innerHTML = OFFRES_ACCOMPAGNEMENT.map((o) => {

const plan = (window.SCHOLARBRIDGE_PLANS || {})[o.id];
if (!plan) return `<li><strong>${escapeHtml(o.label)}</strong> — ${escapeHtml(o.ligne)}</li>`;

const tarif = typeof window.prixAvecDeduction === "function"
? window.prixAvecDeduction(o.id, userData || {})
: null;

const prix = tarif && tarif.deduction
? `${espacer(tarif.prix)} F au lieu de ${espacer(tarif.base)} F — ${tarif.mention}`
: `${espacer(plan.priceFCFA)} F`;

return `<li><strong>${escapeHtml(o.label)} (${escapeHtml(prix)})</strong> — ${escapeHtml(o.ligne)}</li>`;

}).join("");

}

function render(resultat) {

document.getElementById("diagVerdict").textContent = verdictChiffre(resultat).phrase;

renderLignes(resultat);
renderVigilance(resultat.residence.pays);
renderCalendrier(resultat.residence.pays);
renderLeviers(resultat);
renderEtapes(resultat.residence.pays);
renderOffre(resultat.userData || null, resultat.etatRecevabilite);

// Le dernier mot appartient au projet de l'étudiant : la phrase de fin
// vient APRÈS l'offre, et elle ne vend pas.
document.getElementById("diagFin").textContent = phraseDeFin(resultat).texte;

document.getElementById("diagResultat").hidden = false;
if (window.lucide) lucide.createIcons();

}

// Aucune formule exigée : la page s'ouvre à tout compte (lot 97). Elle
// reste une page de l'espace préinscription.
bootstrapShell({ espace: "preinscription" }).then(async (ctx) => {

if (!ctx) return;

const offreFrance = ctx.testerAccess === true || !!resolvePlanPreinscriptionFrance(ctx.userData || {});
const retour = document.getElementById("diagRetour");
if (retour && !offreFrance) {
retour.setAttribute("href", "preinscription-france.html");
const texte = retour.querySelector("span");
if (texte) texte.textContent = "France";
}

const form = document.getElementById("diagForm");
const questions = document.getElementById("recQuestions");
poserQuestions(questions, "france", (ctx.userData && ctx.userData.profile) || ctx.profile || {});
// Le niveau des droits suit le niveau visé (licence ou master), et la
// question ne se pose plus deux fois (test « Moussa », 2026-09-25) : elle
// ne réapparaît qu'au doctorat, où l'étudiant garde la main sur le calcul.
const majNiveauDroits = () => {
const v = String(questions.querySelector("#recNiveau").value || "").toLowerCase();
const radio = form.querySelector(`input[name="niveau"][value="${v}"]`);
if (radio) radio.checked = true;
document.getElementById("diagNiveauChamp").hidden = !!radio;
};
questions.querySelector("#recNiveau").addEventListener("change", majNiveauDroits);
majNiveauDroits();
// Lot CONTRÔLES-UNIFIÉS : suggestions au rendu du site (plus de datalist).
initFitzCombobox(document.getElementById("diagPays"), COUNTRY_NAMES);

// Le pays de residence du profil pre-remplit le champ : la plupart des
// etudiants candidatent depuis chez eux, et redemander ce quon sait
// deja est une friction gratuite. Reste modifiable — on pre-remplit,
// on nimpose pas.
const paysProfil = (ctx.profile && (ctx.profile.country || ctx.profile.originCountry)) || "";
if (paysProfil) document.getElementById("diagPays").value = paysProfil;
const sauvegarde = document.getElementById("diagSauvegarde");

/**
* Un lien vers l'étape de la route d'où vient l'étudiant, posé après le
* bloc de sauvegarde. Silencieux s'il n'y a pas de note : la page reste
* accessible depuis le menu et depuis un lien partagé.
*/
function retourVersLaRoute() {
let note = null;
try { note = JSON.parse(sessionStorage.getItem("fitz_retour") || "null"); } catch (error) { note = null; }
if (!note || typeof note.href !== "string" || !note.href) return;
let lien = document.getElementById("diagRetourRoute");
if (!lien) {
lien = document.createElement("a");
lien.id = "diagRetourRoute";
lien.className = "btn btn-primary";
lien.style.marginTop = "12px";
sauvegarde.insertAdjacentElement("afterend", lien);
}
lien.setAttribute("href", note.href);
lien.innerHTML = `<i data-lucide="arrow-left" aria-hidden="true"></i><span>Revenir à mon dossier — ${String(note.court || "ma route").toLowerCase()}</span>`;
if (window.lucide) lucide.createIcons();
}

// Le catalogue n'est chargé QUE pour les leviers, et son échec ne doit
// rien casser : deux leviers de moins valent mieux qu'une page morte.
try {
const catalogue = await chargerCatalogue();
// chargerCatalogue() rend { programmes, universites, bourses } ; le
// moteur de recommandation, lui, parle anglais. La traduction est ici,
// une fois — pas dans le module pur, qui ne doit connaître qu'une forme.
CATALOGUE = { programs: catalogue.programmes, universities: catalogue.universites, scholarships: catalogue.bourses };
} catch (error) {
console.warn("[FitzUniverse] Catalogue indisponible : les leviers « université » et « bourses » ne seront pas calculés.", error);
}

// Le profil de l'étudiant sert au levier « bourses » : ce sont ses
// filtres durs (nationalité, cycle, langue, âge) qui décident ce qui
// « correspond à votre profil ».
const profil = ctx.profile || null;

function calculer(entrees, reponses = lireReponses(questions, "france")) {
const resultat = calculerDiagnostic(entrees);
const v = verdictChiffre(resultat);
resultat.recevabilite = puisJeMeLancer("france", { ...(profil || {}), ...reponses }, {
verdictArgent: { etat: v.etat === "tient" ? "atteint" : "manque", phrase: v.phrase, source: resultat.ressources.source, verifieLe: resultat.ressources.verifieLe }
});
resultat.etatRecevabilite = resultat.recevabilite.verdict.etat;
// Le profil sert au levier « bourses » (filtres durs), le document
// utilisateur à la déduction des 10 000 F. Ni l'un ni l'autre n'entre
// dans le CALCUL du total : ils décident de ce qu'on peut dire en plus.
resultat.profil = profil;
resultat.userData = ctx.userData || null;
return resultat;
}

// Un diagnostic déjà enregistré se réaffiche tel quel — et se REJOUE :
// les chiffres d'un étudiant changent, et un résultat qu'on retrouve
// vaut deux fois un résultat qu'on lit une fois.
const precedent = ctx.userData && ctx.userData.diagnosticFrance;
if (precedent && precedent.entrees) {
document.getElementById("diagPays").value = precedent.entrees.paysResidence || paysProfil || "";
document.getElementById("diagRessources").value = precedent.entrees.ressourcesMensuelles ?? "";
document.getElementById("diagDevise").value = precedent.entrees.devise || "XOF";
const niveau = form.querySelector(`input[name="niveau"][value="${precedent.entrees.niveau}"]`);
if (niveau) niveau.checked = true;
document.getElementById("diagExoneration").checked = precedent.entrees.exonerationEsperee === true;
const r0 = calculer(precedent.entrees);
render(r0);
peindreVoyants(document.getElementById("recResultat"), r0.recevabilite);
if (precedent.calculeLe) {
sauvegarde.textContent = `Diagnostic enregistré le ${formaterDate(String(precedent.calculeLe).slice(0, 10))}. Vos chiffres ont changé ? Modifiez-les ci-dessus et relancez le calcul : c'est le même diagnostic, remis à jour, sans rien repayer.`;
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

const reponses = lireReponses(questions, "france");
const manque = manquantes(reponses, "france", questions);
if (manque.length) {
signalerManque(questions, manque);
return;
}

if (!entrees.paysResidence) {
document.getElementById("diagPays").focus();
return;
}

if (!Number.isFinite(entrees.ressourcesMensuelles) || entrees.ressourcesMensuelles < 0) {
document.getElementById("diagRessources").focus();
return;
}

const resultat = calculer(entrees, reponses);
render(resultat);
peindreVoyants(document.getElementById("recResultat"), resultat.recevabilite);
document.getElementById("recResultat").scrollIntoView({ behavior: "smooth", block: "start" });
const champsProfil = Object.fromEntries(Object.entries(reponses).map(([k, v]) => [`profile.${k}`, v === undefined ? null : v]));

const verdict = verdictChiffre(resultat);

try {
await updateDoc(doc(db, "users", ctx.user.uid), {
...champsProfil,
diagnosticFrance: {
entrees,
verdict: verdict.phrase,
// L'ÉTAT, et pas seulement la phrase (lot DIAGNOSTIC-2) : c'est lui
// qui permettra plus tard de savoir à qui parler de bourses sans
// relire le calcul, et il ne bouge pas quand la phrase est réécrite.
etatVerdict: verdict.etat,
manqueMensuelEUR: verdict.manqueMensuelEUR,
manqueAnnuelEUR: verdict.manqueAnnuelEUR,
atteint: resultat.ressources.atteint,
ecartMensuel: resultat.ressources.ecartMensuel,
totalAnnuelEUR: resultat.total.annuelEUR,
paysResidence: entrees.paysResidence,
totalInclutFraisDossier: resultat.total.inclutFraisDossier,
recevabilite: { etat: resultat.recevabilite.verdict.etat, phrase: resultat.recevabilite.verdict.phrase, voyants: resultat.recevabilite.voyants.map((x) => ({ voyant: x.voyant, etat: x.etat, titre: x.titre })) },
calculeLe: new Date().toISOString()
}
});
sauvegarde.textContent = `Diagnostic enregistré — vous le retrouverez ici, et vous pourrez le rejouer quand vos chiffres changeront. Total annuel : ${formatEUR(resultat.total.annuelEUR)}.`;
sauvegarde.hidden = false;
// LE CHEMIN DU RETOUR, LÀ OÙ L'ÉTUDIANT EST (lot R2, 2026-09-17).
// Le verdict s'affiche tout en bas d'une longue page : le « ← » de la
// barre haute est à deux écrans de défilement. Quand la route a
// déposé l'étape d'où l'on vient (js/back-link.js décrit la note),
// on la propose ici même, sous le verdict.
retourVersLaRoute();
} catch (error) {
console.error("Impossible d'enregistrer le diagnostic :", error);
sauvegarde.textContent = "Le diagnostic est calculé et affiché en entier ci-dessus, mais il n'a pas pu être enregistré. Vous pourrez le relancer plus tard.";
sauvegarde.hidden = false;
}

});

});
