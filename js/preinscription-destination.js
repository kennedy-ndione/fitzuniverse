// ============================================================
// preinscription-<destination>.html — LA PAGE QUI VEND
// (lot PRÉINSCRIPTIONS-VITRINE, 2026-09-09)
// ============================================================
//
// UNE PAGE PAR DESTINATION OUVERTE, et une VRAIE page HTML — jamais un
// paramètre d'URL. `preinscription-france.html` doit pouvoir se
// positionner sur « étudier en France depuis le Sénégal » ; une page
// unique paramétrée par ?destination= n'est indexable qu'une fois.
//
// CE MODULE EST LE MODÈLE. Il ne connaît aucune destination : il lit
// `document.body.dataset.destination`. Ouvrir la Roumanie, c'est copier
// preinscription-france.html en preinscription-roumanie.html, changer un
// attribut, et basculer `accompagnement` dans les données. Aucun module
// à rouvrir — si ce n'est pas vrai, ce lot a raté.
//
// LA LIGNE QUI COMMANDE TOUT : publier la RÈGLE, vendre le CALCUL.
//   PUBLIC   les seuils et droits, avec source et date ; la règle des
//            vœux ; le NOMBRE d'étapes ; la LISTE des pays de résidence
//            vérifiés.
//   CLIENT   le contenu des étapes, les frais de dossier par pays, le
//            nom de la banque, le moment du paiement, les dates.
//
// Le partage n'est pas décidé ici : il est déclaré fait par fait dans
// js/pays-preinscription.js (`diffusion`), et faitsPublics() est la
// seule porte. Un fait ajouté demain sans `diffusion` ne sort pas.
// ============================================================
import { chargerCatalogue } from "./catalog-data.js";
import { lirePays, etatDunPays, estOuverte, faitsPublics, defautsDeDestination } from "./pays-preinscription.js";
import { trouverProcedure, residencesDocumentees } from "./procedures/index.js";
import { formaterDate } from "./echeance.js";
import { escapeHtml } from "./ai/format.js";

const ID = (document.body && document.body.dataset.destination) || "";

const DESTINATION = lirePays().find((p) => p.id === ID) || null;

/** Une liste de noms, à la française : « a, b et c ». */
function enumerer(noms) {
if (noms.length <= 1) return noms.join("");
return `${noms.slice(0, -1).join(", ")} et ${noms[noms.length - 1]}`;
}

function poser(id, texte) {
const el = document.getElementById(id);
if (el) el.textContent = texte;
}

function poserHtml(id, html) {
const el = document.getElementById(id);
if (el) el.innerHTML = html;
}

// ----------------------------------------------------------
// a) LE HERO
// ----------------------------------------------------------
function renderHero(pays) {
document.title = `Étudier en ${pays.nom} : préinscription accompagnée | FitzUniverse`;
poser("destTitre", `Étudier en ${pays.nom}`);
poser("destPosition", pays.positionnement);
poser("destBadge", pays.nom);
const drapeau = document.getElementById("destDrapeau");
if (drapeau) {
drapeau.setAttribute("src", `assets/flags/${pays.code}.svg`);
drapeau.setAttribute("alt", "");
}
const langues = document.getElementById("destLangues");
if (langues) langues.textContent = pays.langue.join(", ");
}

// ----------------------------------------------------------
// c) LES RÈGLES PUBLIQUES — la preuve, et elle est gratuite
// ----------------------------------------------------------
//
// Chaque règle avec sa source et sa date de vérification. C'est la
// preuve que nos chiffres sont vrais, et une preuve payante ne prouve
// rien : elle reste publique, entière, sans compte.
function renderRegles(pays) {

const publics = faitsPublics(pays);

poserHtml("destRegles", publics.map((f) => `<li class="pre-fait">
<i data-lucide="check" aria-hidden="true"></i>
<div>
<p>${escapeHtml(f.texte)}</p>
<a class="pre-fait-source" href="${escapeHtml(f.source)}" target="_blank" rel="noopener">Vérifié le ${escapeHtml(formaterDate(f.verifieLe))} — source</a>
</div>
</li>`).join(""));

}

// ----------------------------------------------------------
// d) D'OÙ VOUS CANDIDATEZ — la section qui convertit
// ----------------------------------------------------------
//
// Les pays de résidence sont NOMMÉS, un par un, lus dans le registre des
// couches (js/procedures/residences/index.js). Aucun détail n'est donné :
// savoir que le Cameroun est vérifié est une preuve de sérieux ; savoir
// ce qu'on y paie et quand est ce que le Diagnostic vend.
//
// Jamais en dur : un neuvième pays ajouté au registre apparaît ici sans
// qu'on touche au HTML.
function renderResidences(pays) {

const residences = residencesDocumentees(pays.nom).map((r) => r.pays);
const section = document.getElementById("destSectionResidences");

if (!residences.length) {
if (section) section.hidden = true;
return;
}

if (section) section.hidden = false;

// La phrase d'introduction nomme le PORTAIL, jamais le pays : « Campus
// France » écrit en dur dans le HTML aurait fait de cette page modèle
// une page française déguisée, et le prochain pays l'aurait recopiée.
const portail = (pays.portail && pays.portail.nom) || "";
poser("destResidencesIntro", `Les frais de dossier, la banque où l'on paie, le moment où l'on paie et les dates de la campagne ne sont pas les mêmes selon le pays d'où vous déposez. Nous les avons vérifiés, un pays à la fois, sur les pages officielles qui encadrent la procédure${portail ? ` ${portail}` : ""}.`);

poser("destResidencesPhrase", `Frais, calendrier et pièces vérifiés depuis ${enumerer(residences.map((p) => (/^[AEIOUY]/i.test(p) ? `l'${p}` : `le ${p}`)))}.`);
poser("destResidencesNombre", String(residences.length));
poserHtml("destResidencesListe", residences.map((p) => `<li>${escapeHtml(p)}</li>`).join(""));

}

// ----------------------------------------------------------
// e) LA PROCÉDURE — le NOMBRE d'étapes, pas leur contenu
// ----------------------------------------------------------
function renderProcedure(pays) {

const procedure = trouverProcedure({ paysDestination: pays.nom });
const section = document.getElementById("destSectionProcedure");

if (!procedure || !procedure.etapes.length) {
if (section) section.hidden = true;
return;
}

if (section) section.hidden = false;

poser("destProcedureTitre", `La procédure ${procedure.portail.nom} compte ${procedure.etapes.length} étapes`);
poser("destProcedurePhrase", `Elles sont les mêmes pour tout candidat, d'où qu'il parte, et nous les avons lues une par une sur les pages officielles. Ce qui change d'un pays de résidence à l'autre — les frais, la banque, le moment du paiement, les dates — est vérifié pays par pays.`);
// « Avec le Dossier France » nommait l'offre française dans un module
// qui doit servir toutes les destinations. Les formules sont nommées
// juste en dessous, avec leurs prix : la phrase n'a pas besoin de les
// répéter, et elle reste vraie le jour où la Roumanie aura les siennes.
poser("destProcedureClient", `Avec l'accompagnement, vous recevez la liste complète de ces ${procedure.etapes.length} étapes, les pièces exigées à chacune, les dates de VOTRE campagne et les pièges propres à votre pays de résidence.`);

}

// ----------------------------------------------------------
// f) LE PRIX ET LES DEUX OFFRES
// ----------------------------------------------------------
//
// LE PAYS VOYAGE JUSQU'À LA CAISSE : le lien porte `destination`. Une
// seule destination existe aujourd'hui et l'offre s'appelle déjà
// « Dossier France » — le paramètre se pose maintenant pour que la
// deuxième n'oblige pas à refaire la chaîne.
function espacer(n) {
return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

/**
* Les offres du parcours préinscription, LUES DANS LA GRILLE.
*
* La liste était écrite ici — ["diagnostic-france", "dossier-france",
* "dossier-france-conseiller"] — et c'était trois noms français dans le
* module qui doit servir toutes les destinations. Elle vient maintenant
* de pricing-plans.js, dans l'ordre de la grille, sans les offres
* retirées de la vente.
*/
function offresPreinscription() {
const grille = window.SCHOLARBRIDGE_PLANS || {};
return Object.values(grille).filter((o) => o && o.parcours === "preinscription" && o.deprecated !== true);
}

function renderOffres(pays) {

const offres = offresPreinscription();

// L'offre MISE EN AVANT est la première formule « campagne » — le
// dossier complet, pas le pass de diagnostic. Se régler sur le `type`
// et non sur un identifiant, c'est ce qui permet à la destination
// suivante d'avoir les siennes sans toucher à ce fichier.
const misEnAvant = (offres.find((o) => o.type === "campagne") || {}).id;

poserHtml("destOffres", offres.map((offre) => `<li class="pre-offre">
<div class="pre-offre-head">
<h3>${escapeHtml(offre.label)}</h3>
<span class="pre-offre-prix">${escapeHtml(espacer(offre.priceFCFA))} F</span>
</div>
<p>${escapeHtml(offre.tagline)}</p>
<a class="btn ${offre.id === misEnAvant ? "btn-primary" : "btn-secondary"}" href="offers.html?parcours=preinscription&amp;destination=${escapeHtml(pays.id)}"><span>Choisir ${escapeHtml(offre.label)}</span></a>
</li>`).join(""));

// La déduction, dite en clair et sans compte : c'est une règle
// commerciale, pas un calcul personnel. Le montant exact est recalculé
// au moment de payer (functions/lib/achat.js). Les formules concernées
// sont NOMMÉES depuis la grille — jamais recopiées ici.
const deduction = window.SCHOLARBRIDGE_DEDUCTION;
const grille = window.SCHOLARBRIDGE_PLANS || {};
const concernees = deduction ? deduction.plans.map((id) => grille[id] && grille[id].label).filter(Boolean) : [];
const declencheur = deduction ? (grille[deduction.offre] && grille[deduction.offre].label) : "";

poser("destDeduction", deduction && concernees.length && declencheur
? `Si vous commencez par le ${declencheur}, ses ${espacer(deduction.montant)} F sont déduits ${concernees.length > 1 ? "de l'une des formules suivantes" : "de la formule"} — ${enumerer(concernees)} — achetée dans les ${deduction.jours} jours.`
: "");

}

// ----------------------------------------------------------
// Le catalogue : les effectifs vérifiés de cette destination
// ----------------------------------------------------------
async function renderCatalogue(pays) {

const section = document.getElementById("destSectionCatalogue");

let catalogue = null;
try {
catalogue = await chargerCatalogue();
} catch (e) {
console.warn("Catalogue indisponible pour les effectifs de la destination :", e);
}

// Aucun bloc vide, et surtout aucun zéro : un compteur qu'on ne sait
// pas remplir se retire, il ne s'affiche pas à zéro.
if (!catalogue) {
if (section) section.hidden = true;
return;
}

const etat = etatDunPays(pays, catalogue);

if (!etat.etablissements) {
if (section) section.hidden = true;
return;
}

if (section) section.hidden = false;

poser("destCatalogue", `${etat.etablissements} établissement${etat.etablissements > 1 ? "s" : ""} de cette destination sont au catalogue${etat.coutsVerifies ? `, dont ${etat.coutsVerifies} dont nous avons vérifié le coût d'une année, à la source et à la date indiquée` : ""}.`);

const lien = document.getElementById("destCatalogueLien");
if (lien) lien.setAttribute("href", `universities.html?country=${encodeURIComponent(pays.nom)}`);

}

// ----------------------------------------------------------

async function initialiser() {

const app = document.getElementById("destApp");

// UNE DESTINATION FERMÉE N'A PAS DE PAGE OUVERTE. Si quelqu'un déploie
// une page dont la destination est repassée « a_venir », elle le dit
// plutôt que d'afficher une coquille à moitié remplie.
if (!DESTINATION || !estOuverte(DESTINATION)) {
if (app) app.innerHTML = `<div class="container"><p class="pre-lead">Cette destination n'est pas encore ouverte à l'accompagnement. <a href="preinscriptions.html">Voir les destinations</a>.</p></div>`;
return;
}

// Le contrat, rejoué dans le navigateur : une destination ouverte à qui
// il manque un champ le dit en console. Le test, lui, fait échouer la
// suite — c'est lui qui empêche d'ouvrir à moitié ; ceci n'est que le
// filet du jour où quelqu'un déploie sans lancer les tests.
const defauts = defautsDeDestination(DESTINATION, { procedure: trouverProcedure({ paysDestination: DESTINATION.nom }) });
if (defauts.length) console.warn(`[FitzUniverse] Destination « ${DESTINATION.nom} » ouverte mais incomplète : ${defauts.join(" ; ")}`);

renderHero(DESTINATION);
renderRegles(DESTINATION);
renderResidences(DESTINATION);
renderProcedure(DESTINATION);
renderOffres(DESTINATION);

if (window.lucide) lucide.createIcons();

await renderCatalogue(DESTINATION);

if (window.lucide) lucide.createIcons();

}

initialiser();
