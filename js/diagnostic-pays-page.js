// ============================================================
// diagnostic-pays.html?d=<pays> — branchement de js/diagnostic-pays.js
// (2026-09-23, les six destinations ouvertes le même jour)
//
// Même page que le Diagnostic France, dans le même ordre : le verdict en
// une phrase, le détail sourcé ligne par ligne, le calendrier publié, ce
// que nous n'avons pas trouvé, les étapes de la procédure, et l'offre une
// seule fois.
//
// QUI Y ENTRE (lot 97, 2026-09-25). TOUT COMPTE, gratuit compris :
// Charles, « il faut que le diagnostic puisse tout dire à l'étudiant
// avant de passer à n'importe quel parcours ». L'offre Diagnostic à
// 10 000 F est retirée de la vente ; la page ne vérifie plus aucune
// formule.
//
// « PUIS-JE ME LANCER ? » (lot 98) : les questions sur les études
// (js/recevabilite-ui.js) et les quatre voyants (js/recevabilite.js)
// viennent en tête du résultat, avant le détail chiffré.
//
// Le résultat est enregistré sur users/{uid}.diagnosticsPays.<pays>
// (l'étape 2 de la route du pays le relit), et les réponses sur les
// études dans le profil : elles valent pour tous les pays.
// ============================================================
import { db } from "../firebase-config.js";
import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { initShellChrome, bootstrapShell } from "./app-shell.js";
import { calculerDiagnosticPays, devisesDeSaisie, libelleDevise, formatMontant } from "./diagnostic-pays.js";
import { destination, DIAGNOSTICS, enClairDe } from "./destinations-preinscription.js";
import { planPreinscriptionPour } from "./plan-features.js";
import { puisJeMeLancer } from "./recevabilite.js";
import { poserQuestions, lireReponses, manquantes, signalerManque, peindreVoyants } from "./recevabilite-ui.js";
import { trouverProcedure } from "./procedures/index.js";
import { texteConsigne } from "./procedures/vocabulaire.js";
import { formaterDate } from "./echeance.js";
import { escapeHtml } from "./ai/format.js";
import { initFitzSelects } from "./fitz-select.js";
import { auPays, avecArticle } from "./pays-grammaire.js";

initShellChrome();

const ID = String(new URLSearchParams(window.location.search).get("d") || "").toLowerCase();
// La France a sa page (Campus France, pays de résidence) : ?d=france y mène.
if (ID === "france") window.location.replace("diagnostic-france.html");
const DEST = destination(ID);

function minusculeInitiale(t) {
const x = String(t || "");
return x.charAt(0).toLowerCase() + x.slice(1);
}

/** La voie choisie dans le formulaire (Turquie, Maroc, Chine), ou "". */
function voieChoisie() {
const el = document.getElementById("diagVoie");
const champ = document.getElementById("diagVoieChamp");
return el && champ && !champ.hidden ? String(el.value || "") : "";
}

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
<strong>${escapeHtml(l.libelle)}${l.compte && Number.isFinite(l.montant) ? ` — ${escapeHtml(formatMontant(l.montant, l.devise))}${l.cle === "ressources" ? " sur l'année" : ""}` : ""}${l.compte && l.cle === "droits" ? ` — de ${escapeHtml(formatMontant(l.min, l.devise))} à ${escapeHtml(formatMontant(l.max, l.devise))} par an` : ""}${l.fcfa ? ` <span class="diag-fcfa">(${escapeHtml(l.fcfa)})</span>` : ""}</strong>
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

renderEtapes(voieChoisie());

document.getElementById("diagResultat").hidden = false;
if (window.lucide) lucide.createIcons();

}

/**
* Les étapes des AUTRES voies sortent de la liste (test « Moussa » : parti
* « en me finançant », il lisait sept étapes de la bourse d'État sur seize).
* Sans voie choisie, tout reste affiché.
*/
function etapesHorsVoie(voie) {
const voies = DEST && DEST.voies;
if (!voies || !voie) return new Set();
const choisie = voies.options.find((o) => o.id === voie);
if (!choisie) return new Set();
const garder = new Set(choisie.etapes);
const hors = new Set();
for (const o of voies.options) if (o.id !== voie) for (const e of o.etapes) if (!garder.has(e)) hors.add(e);
return hors;
}

function renderEtapes(voie = "") {
const procedure = trouverProcedure({ paysDestination: DEST.nom });
if (!procedure) return;
const hors = etapesHorsVoie(voie);
const etapes = procedure.etapes.filter((e) => !hors.has(e.id));
const option = voie && DEST.voies ? DEST.voies.options.find((o) => o.id === voie) : null;
document.getElementById("diagEtapesIntro").textContent = `La procédure ${procedure.portail.nom}${option ? `, pour ${minusculeInitiale(option.libelle)}` : ""} : ${etapes.length} étapes, dans l'ordre. Elle est écrite ici en entier — vous pouvez la suivre seul ; votre espace vous la présente une étape à la fois.`;
document.getElementById("diagEtapes").innerHTML = etapes.map((e) => {
const clair = enClairDe(ID, e.id);
return `
<li>
<strong>${escapeHtml((clair && clair.titre) || e.titre)}</strong>
<p>${escapeHtml((clair && clair.enClair) || texteConsigne(e))}</p>
${lienSource(e.source, e.verifieLe)}
</li>`;
}).join("");
}

function renderOffre(userData, etatVerdict) {
const plan = planPreinscriptionPour(userData || {}, ID);
const section = document.getElementById("diagSectionOffre");
// Un compte qui a déjà un dossier de ce pays n'a rien à acheter ici ;
// et on ne vend jamais un accompagnement à qui ne peut pas encore
// postuler (lot 98).
if ((plan && plan !== "diagnostic-france") || etatVerdict === "pas-encore") { section.hidden = true; return; }
const offrir = typeof window.offrePourDestination === "function";
const dossier = offrir ? window.offrePourDestination("dossier-france", ID) : null;
const conseiller = offrir ? window.offrePourDestination("dossier-france-conseiller", ID) : null;
if (!dossier || !conseiller) { section.hidden = true; return; }
const tarif = typeof window.prixAvecDeduction === "function" ? window.prixAvecDeduction("dossier-france", userData || {}, new Date(), ID) : null;
const espacer = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
document.getElementById("diagOffrePreambule").textContent = `Vous savez maintenant si vous pouvez vous lancer. Pour être suivi étape par étape jusqu'au départ ${auPays(DEST.nom)} :`;
document.getElementById("diagOffres").innerHTML = [
{ o: dossier, prix: tarif && tarif.deduction ? `${espacer(tarif.prix)} F au lieu de ${espacer(tarif.base)} F — ${tarif.mention}` : `${espacer(dossier.priceFCFA)} F` },
{ o: conseiller, prix: `${espacer(conseiller.priceFCFA)} F` }
].map(({ o, prix }) => `<li><strong>${escapeHtml(o.label)} (${escapeHtml(prix)})</strong> — ${escapeHtml(o.tagline)} <a href="payment.html?plan=${escapeHtml(o.id)}&amp;destination=${escapeHtml(ID)}">Choisir</a></li>`).join("");
section.hidden = false;
}

if (!DEST) {
if (ID !== "france") window.location.replace("preinscriptions.html");
} else {

document.title = `Diagnostic ${DEST.nom} | FitzUniverse`;
document.getElementById("diagTitre").textContent = `Diagnostic ${DEST.nom}`;
document.getElementById("diagIntroTitre").textContent = `Puis-je me lancer ${auPays(DEST.nom)} ?`;

// Aucune formule exigée : la page s'ouvre à tout compte (lot 97). Elle
// reste une page de l'espace préinscription.
bootstrapShell({ espace: "preinscription" }).then(async (ctx) => {

if (!ctx) return;

// Le retour : la route du pays pour qui l'a ouverte, la page du pays sinon.
const possede = ctx.testerAccess === true || !!planPreinscriptionPour(ctx.userData || {}, ID);
const retour = document.getElementById("diagRetour");
if (retour) {
retour.setAttribute("href", possede ? `espace-preinscription.html?d=${encodeURIComponent(ID)}` : `preinscription-${encodeURIComponent(ID)}.html`);
const texte = retour.querySelector("span");
if (texte && !possede) texte.textContent = DEST.nom;
}

const profil = (ctx.userData && ctx.userData.profile) || {};
const questions = document.getElementById("recQuestions");
poserQuestions(questions, ID, profil);

const recevabilite = (entrees, reponses) => {
const res = calculerDiagnosticPays(ID, entrees);
return { res, rec: puisJeMeLancer(ID, { ...profil, ...reponses }, { verdictArgent: res.verdict, calendrier: DIAGNOSTICS[ID].calendrier, variante: entrees.variante }) };
};

const form = document.getElementById("diagForm");
const select = document.getElementById("diagDevise");
const faits = DIAGNOSTICS[ID];
const seuil = faits.ressources;

// La devise par défaut : celle du SEUIL quand il n'est ni en euros ni en
// F CFA (dollar canadien, lei) — c'est la seule qui permette un verdict
// sans taux de change. Sinon le F CFA, comme pour la France.
select.innerHTML = devisesDeSaisie(ID).map((d) => `<option value="${d}">${escapeHtml(libelleDevise(d))}</option>`).join("");
// Le F CFA par défaut, partout : c'est la monnaie dans laquelle la famille
// compte (test « Moussa »). Un seuil en dollars canadiens ou en lei se
// compare alors au taux de référence daté, et le résultat le dit.
select.value = "XOF";
if (seuil && !["EUR", "XOF"].includes(seuil.devise)) {
document.getElementById("diagDeviseAide").textContent = `Tout ce que votre famille ou votre garant peut réunir pour l'année, ramené au mois. Le seuil ${auPays(DEST.nom)} est fixé en ${libelleDevise(seuil.devise)} : nous le comparons à vos F CFA au taux de référence du jour indiqué ; pour un calcul exact, saisissez vos ressources en ${libelleDevise(seuil.devise)}.`;
} else if (seuil) {
document.getElementById("diagDeviseAide").textContent = "Tout ce que votre famille ou votre garant peut réunir pour l'année, ramené au mois : il doit couvrir la vie sur place, les droits d'inscription et les frais.";
} else if (!seuil) {
// « Le Maroc », « La Chine »… : l'article vient de la grammaire des pays,
// jamais d'une alternative écrite pour deux pays (elle disait « La Turquie »
// pour la Chine et la Malaisie).
const sujet = avecArticle(DEST.nom);
document.getElementById("diagDeviseAide").textContent = `${sujet.charAt(0).toUpperCase()}${sujet.slice(1)} ne chiffre aucun seuil : nous vous disons ce qu'il vous resterait chaque mois pour vivre, une fois payés les frais les moins chers de l'année.`;
}

if (faits.variante) {
document.getElementById("diagVarianteChamp").hidden = false;
document.getElementById("diagVarianteLibelle").textContent = faits.variante.libelle;
}

// LA VOIE (Turquie, Maroc, Chine) : la bourse ou ses propres moyens. Elle
// trie les étapes affichées ; elle se reprend du dossier ou du dernier
// diagnostic, et ne s'écrit que dans le diagnostic (la route garde son
// propre choix).
if (DEST.voies) {
const champVoie = document.getElementById("diagVoieChamp");
const selVoie = document.getElementById("diagVoie");
document.getElementById("diagVoieLibelle").textContent = DEST.voies.question;
selVoie.innerHTML = `<option value="">Je ne sais pas encore</option>${DEST.voies.options.map((o) => `<option value="${escapeHtml(o.id)}">${escapeHtml(o.libelle)}</option>`).join("")}`;
const dejaDossier = ctx.userData && ctx.userData.dossiersPays && ctx.userData.dossiersPays[ID] && ctx.userData.dossiersPays[ID].voie;
const dejaDiag = ctx.userData && ctx.userData.diagnosticsPays && ctx.userData.diagnosticsPays[ID] && ctx.userData.diagnosticsPays[ID].voie;
const deja = String(dejaDossier || dejaDiag || "");
if (DEST.voies.options.some((o) => o.id === deja)) selVoie.value = deja;
const aide = () => {
const o = DEST.voies.options.find((x) => x.id === selVoie.value);
document.getElementById("diagVoieAide").textContent = o ? o.aide : "Toutes les étapes s'affichent, celles de chaque voie.";
};
selVoie.addEventListener("change", () => {
aide();
if (!document.getElementById("diagResultat").hidden) renderEtapes(voieChoisie());
});
aide();
champVoie.hidden = false;
initFitzSelects(champVoie);
}

const sauvegarde = document.getElementById("diagSauvegarde");
const precedent = ctx.userData && ctx.userData.diagnosticsPays && ctx.userData.diagnosticsPays[ID];

if (precedent && precedent.entrees) {
document.getElementById("diagRessources").value = precedent.entrees.ressourcesMensuelles ?? "";
if (precedent.entrees.devise) select.value = precedent.entrees.devise;
document.getElementById("diagVariante").checked = !!precedent.entrees.variante;
const { res, rec } = recevabilite(precedent.entrees, lireReponses(questions, ID));
render(res);
peindreVoyants(document.getElementById("recResultat"), rec);
renderOffre(ctx.userData, rec.verdict.etat);
if (precedent.calculeLe) {
sauvegarde.textContent = `Diagnostic enregistré le ${formaterDate(String(precedent.calculeLe).slice(0, 10))}. Vos chiffres ont changé ? Modifiez-les ci-dessus et relancez le calcul, sans rien repayer.`;
sauvegarde.hidden = false;
}
}

if (!(precedent && precedent.entrees)) renderOffre(ctx.userData);

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

const reponses = lireReponses(questions, ID);
const manque = manquantes(reponses, ID, questions);
if (manque.length) {
signalerManque(questions, manque);
return;
}

const { res: resultat, rec } = recevabilite(entrees, reponses);
render(resultat);
peindreVoyants(document.getElementById("recResultat"), rec);
renderOffre(ctx.userData, rec.verdict.etat);
document.getElementById("recResultat").scrollIntoView({ behavior: "smooth", block: "start" });

// Les réponses sur les études vont dans le profil (tous les pays).
const champsProfil = Object.fromEntries(Object.entries(reponses).map(([k, v]) => [`profile.${k}`, v === undefined ? null : v]));

try {
await updateDoc(doc(db, "users", ctx.user.uid), {
...champsProfil,
[`diagnosticsPays.${ID}`]: {
entrees,
voie: voieChoisie(),
verdict: resultat.verdict.phrase,
etatVerdict: resultat.verdict.etat,
totaux: resultat.totaux,
totalTexte: resultat.totalTexte,
recevabilite: { etat: rec.verdict.etat, phrase: rec.verdict.phrase, voyants: rec.voyants.map((v) => ({ voyant: v.voyant, etat: v.etat, titre: v.titre })) },
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
