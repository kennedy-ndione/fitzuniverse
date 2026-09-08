// ============================================================
// preinscriptions.html — rendu des sept pays (lot Préinscriptions,
// 2026-09-07). La page EXPLIQUE et ORIENTE ; elle ne recopie aucune
// liste d'établissements : chaque carte renvoie dans universities.html
// avec le filtre pays, qui existe et fonctionne en ligne.
//
// Tout ce qui est un fait, un chiffre ou un niveau de préparation vient
// de js/pays-preinscription.js ; les deux effectifs de chaque carte
// (établissements, coûts vérifiés) sont CALCULÉS depuis le catalogue
// (etatDunPays rejoue lireFrais). Rien n'est tapé ici.
// ============================================================
import { chargerCatalogue } from "./catalog-data.js";
import { lirePays, etatDunPays, libelleProcedure, jalonDeCampagne } from "./pays-preinscription.js";
// Lot E2 : quand une procédure existe pour un pays, la carte dit
// honnêtement son état (« documentée depuis les sources publiques ;
// N étapes à confirmer ») et la France, en plein, montre ses étapes.
// Page publique : la résidence est le Sénégal, le premier public du site.
import { trouverProcedure, libelleProcedureDocumentee, codeProcedurePour } from "./procedures/index.js";
import { texteConsigne, LIBELLES_FIABILITE, ICONES_TYPE } from "./procedures/vocabulaire.js";

const RESIDENCE_PAR_DEFAUT = "Sénégal";
import { formaterDate } from "./echeance.js";
import { escapeHtml } from "./ai/format.js";

const liste = document.getElementById("paysListe");
const faitsFrance = document.getElementById("faitsFrance");

function renderFait(f) {
return `<li class="pre-fait">
<i data-lucide="check" aria-hidden="true"></i>
<div>
<p>${escapeHtml(f.texte)}</p>
<a class="pre-fait-source" href="${escapeHtml(f.source)}" target="_blank" rel="noopener">Vérifié le ${escapeHtml(formaterDate(f.verifieLe))} — source</a>
</div>
</li>`;
}

function renderProcedure(procedure) {
const etapes = procedure.etapes.map((e) => {
const jalon = e.echeance ? jalonDeCampagne(e.echeance.cle) : null;
return `<li class="pre-procedure-etape fiab-${escapeHtml(e.fiabilite)}">
<i data-lucide="${escapeHtml(ICONES_TYPE[e.type] || "circle-help")}" aria-hidden="true"></i>
<div>
<p class="pre-procedure-titre"><strong>${escapeHtml(e.titre)}</strong> <span class="pre-procedure-fiabilite is-${escapeHtml(e.fiabilite)}">${escapeHtml(LIBELLES_FIABILITE[e.fiabilite] || e.fiabilite)}</span></p>
<p>${escapeHtml(texteConsigne(e))}</p>
${jalon ? `<p class="pre-procedure-date">${jalon.debut ? "À partir du" : "Jusqu'au"} ${escapeHtml(formaterDate(jalon.iso))}</p>` : ""}
<a class="pre-fait-source" href="${escapeHtml(e.source)}" target="_blank" rel="noopener">Vérifié le ${escapeHtml(formaterDate(e.verifieLe))} — source</a>
</div>
</li>`;
}).join("");
return `<details class="pre-procedure" id="procedure-${escapeHtml(procedure.paysDestination.toLowerCase())}">
<summary><i data-lucide="route" aria-hidden="true"></i><span>La procédure ${escapeHtml(procedure.portail.nom)}, depuis le ${escapeHtml(procedure.paysResidence)} : ${procedure.etapes.length} étapes</span></summary>
<p class="pre-lead">Lue sur les pages publiques de Campus France Sénégal. Les étapes marquées « À confirmer » se passent derrière l'authentification, ou viennent d'un agrégateur : elles seront précisées à la première passe réelle.</p>
<ol class="pre-procedure-liste">${etapes}</ol>
</details>`;
}

function renderPays(pays, etat, principal) {

const lien = `universities.html?country=${encodeURIComponent(pays.nom)}`;
const procedure = trouverProcedure({ paysDestination: pays.nom, paysResidence: RESIDENCE_PAR_DEFAUT });
const code = codeProcedurePour(pays, procedure);
const libelle = procedure ? libelleProcedureDocumentee(procedure) : libelleProcedure(pays);

return `<article class="pre-pays${principal ? " pre-pays--principal" : ""}" id="pays-${escapeHtml(pays.id)}">
<div class="pre-pays-head">
<img src="assets/flags/${escapeHtml(pays.code)}.svg" alt="" width="28" height="21" loading="lazy" decoding="async">
<h3>${escapeHtml(pays.nom)}</h3>
${principal ? "" : `<span class="pre-pays-prochain">Prochaine destination</span>`}
</div>
<p class="pre-pays-position">${escapeHtml(pays.positionnement)}</p>
<p class="pre-pays-effectifs"><strong>${etat.etablissements}</strong> établissement${etat.etablissements > 1 ? "s" : ""} au catalogue · <strong>${etat.coutsVerifies}</strong> avec coût vérifié</p>
<p class="pre-pays-procedure ${escapeHtml(code)}"><i data-lucide="${code === "documentee" || procedure ? "route" : "clock"}" aria-hidden="true"></i><span>${escapeHtml(libelle)}${pays.portail ? ` — portail : <a href="${escapeHtml(pays.portail.url)}" target="_blank" rel="noopener">${escapeHtml(pays.portail.nom)}</a>` : ""}</span></p>
${procedure && principal ? renderProcedure(procedure) : ""}
<p class="pre-pays-langues"><i data-lucide="languages" aria-hidden="true"></i><span>${escapeHtml(pays.langue.join(", "))}</span></p>
${pays.faits.length && !principal ? `<ul class="pre-faits">${pays.faits.map(renderFait).join("")}</ul>` : ""}
${pays.avertissement ? `<p class="pre-pays-avertissement"><i data-lucide="triangle-alert" aria-hidden="true"></i><span>${escapeHtml(pays.avertissement)}</span></p>` : ""}
<a class="pre-pays-lien" href="${lien}">Voir les établissements<i data-lucide="arrow-right" aria-hidden="true"></i></a>
</article>`;

}

async function initialiser() {

const pays = lirePays();
const france = pays.find((p) => p.id === "france");

// Les faits France de la section « Ce que ça coûte vraiment », depuis la
// même source que la carte.
if (faitsFrance && france) faitsFrance.innerHTML = france.faits.map(renderFait).join("");

let catalogue = null;
try {
catalogue = await chargerCatalogue();
} catch (e) {
console.warn("Catalogue indisponible pour les effectifs par pays :", e);
}

liste.innerHTML = pays.map((p, i) => renderPays(p, etatDunPays(p, catalogue), i === 0)).join("");

if (window.lucide) lucide.createIcons();

}

initialiser();
