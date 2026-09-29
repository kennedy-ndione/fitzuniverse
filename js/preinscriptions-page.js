// ============================================================
// preinscriptions.html — LE HUB DES DESTINATIONS
// (lot PRÉINSCRIPTIONS-VITRINE, 2026-09-09)
// ============================================================
//
// CE QUE CETTE PAGE FAISAIT DE TROP, ET CE QU'ELLE FAISAIT DE MAL.
//
// Elle donnait gratuitement ce que le Diagnostic (10 000 F) et le
// Dossier France (75 000 F) vendent : le contenu des onze étapes, les
// frais de dossier du Sénégal, le nom de la banque, le moment du
// paiement, les dates de la campagne. Publier la RÈGLE est une preuve ;
// publier le CALCUL est une reprise.
//
// Et elle affichait six destinations à « 0 établissement avec coût
// vérifié · procédure à venir ». Répété six fois, un zéro ne dit pas
// « ambitieux », il dit « pas prêt » — et il abîme la seule carte
// excellente de la page, celle de la France.
//
// CE QU'ELLE FAIT MAINTENANT : une grille de destinations, et rien
// d'autre. La destination OUVERTE mène à sa page dédiée, qui vend. Les
// destinations À VENIR portent leur nom, leur drapeau et une phrase —
// pas un compteur, pas un zéro, pas un bouton.
//
// LE HUB NE LIT QU'UN CHAMP pour décider : `accompagnement`. Basculer un
// pays de "a_venir" à "ouvert" dans js/pays-preinscription.js lui donne
// son bouton, sans toucher à ce fichier ni au HTML.
// ============================================================
// Lot PERF 3G : le catalogue des LISTES (sans les champs des fiches).
import { chargerCatalogueListe } from "./catalog-data.js";
import { lirePays, etatDunPays, estOuverte, pageDeDestination } from "./pays-preinscription.js";
import { residencesDocumentees } from "./procedures/index.js";
import { escapeHtml } from "./ai/format.js";
// « Étudier en France », « au Canada », « en Roumanie » : la préposition
// suit le pays. Le gabarit écrivait « en France » en dur et « — <pays> »
// pour les autres (lot VITRINE-COMMERCIALE, 2026-09-11).
import { auPays } from "./pays-grammaire.js";

const liste = document.getElementById("paysListe");

/**
* La carte d'une destination À VENIR : le nom, le drapeau, la phrase de
* positionnement, la mention. RIEN D'AUTRE.
*
* Pas de compteur, pas de « 0 avec coût vérifié », pas de « procédure à
* venir » répété six fois, pas de bouton. Ce qu'on ne vend pas encore
* s'annonce ; ça ne se détaille pas.
*/
function carteAVenir(pays) {
return `<article class="pre-dest pre-dest--a-venir" id="pays-${escapeHtml(pays.id)}">
<div class="pre-dest-head">
<img src="assets/flags/${escapeHtml(pays.code)}.svg" alt="" width="28" height="21" loading="lazy" decoding="async">
<h3>${escapeHtml(pays.nom)}</h3>
</div>
<p class="pre-dest-position">${escapeHtml(pays.positionnement)}</p>
<p class="pre-dest-prochain">Prochaine destination</p>
</article>`;
}

/**
* La carte d'une destination OUVERTE : celle qui a quelque chose à
* montrer, et un bouton vers sa page.
*
* Les deux effectifs sont CALCULÉS depuis le catalogue (etatDunPays
* rejoue lireFrais), et le nombre de pays de résidence vient du registre
* des couches. Aucun chiffre n'est tapé ici : le premier pays ajouté
* ferait mentir celui qui le serait.
*
* Le bouton est SECONDAIRE (papier), pas principal (2026-09-28, décision
* de Charles). Ambre tant que la France était seule ouverte ; depuis le
* 23/09, neuf destinations ouvertes faisaient neuf boutons ambre dans la
* même section, et un ambre répété neuf fois ne désigne plus rien
* (contrôle 9 du peigne, scripts/verifier/peigne.mjs). Neuf choix égaux
* n'ont pas d'action principale : l'ambre de la page reste « Voir les
* établissements », seul dans sa section. Gardé par « vitrine 4c ».
*/
function carteOuverte(pays, etat) {

const residences = residencesDocumentees(pays.nom);

return `<article class="pre-dest pre-dest--ouverte" id="pays-${escapeHtml(pays.id)}">
<div class="pre-dest-head">
<img src="assets/flags/${escapeHtml(pays.code)}.svg" alt="" width="28" height="21" loading="lazy" decoding="async">
<h3>${escapeHtml(pays.nom)}</h3>
<span class="pre-dest-ouverte">Accompagnement ouvert</span>
</div>
<p class="pre-dest-position">${escapeHtml(pays.positionnement)}</p>
${etat ? `<p class="pre-dest-effectifs"><strong>${etat.etablissements}</strong> établissement${etat.etablissements > 1 ? "s" : ""} au catalogue · <strong>${etat.coutsVerifies}</strong> avec coût vérifié</p>` : ""}
${residences.length ? `<p class="pre-dest-residences"><i data-lucide="map-pin" aria-hidden="true"></i><span>Frais, calendrier et pièces vérifiés depuis <strong>${residences.length} pays de résidence</strong></span></p>` : ""}
<p class="pre-dest-langues"><i data-lucide="languages" aria-hidden="true"></i><span>${escapeHtml(pays.langue.join(", "))}</span></p>
<a class="btn btn-secondary pre-dest-cta" href="${escapeHtml(pageDeDestination(pays))}"><span>Étudier ${escapeHtml(auPays(pays.nom))}</span><i data-lucide="arrow-right" aria-hidden="true"></i></a>
</article>`;

}

async function initialiser() {

if (!liste) return;

const pays = lirePays();

// Le catalogue ne sert qu'aux effectifs de la ou des destinations
// ouvertes. Son échec ne casse rien : la carte perd sa ligne de
// compteurs, elle garde tout le reste.
let catalogue = null;
try {
catalogue = await chargerCatalogueListe();
} catch (e) {
console.warn("Catalogue indisponible pour les effectifs par destination :", e);
}

liste.innerHTML = pays
.map((p) => (estOuverte(p) ? carteOuverte(p, catalogue ? etatDunPays(p, catalogue) : null) : carteAVenir(p)))
.join("");

if (window.lucide) lucide.createIcons();

}

initialiser();
