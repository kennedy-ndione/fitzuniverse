/**
* ============================================================
* Diagnostic <pays> — de l'arithmétique, aucune IA (2026-09-23)
* ============================================================
*
* Le Diagnostic des six destinations ouvertes le 23 septembre :
* Roumanie, Turquie, Maroc, Italie, Allemagne, Canada. Même promesse que
* le Diagnostic France : vos ressources contre le seuil publié, le coût
* de l'année chiffre par chiffre, chaque montant avec sa source et sa
* date. Les faits viennent de js/destinations-preinscription.js
* (DIAGNOSTICS), jamais recopiés ici.
*
* TROIS RÈGLES, héritées du Diagnostic France
* -------------------------------------------
* 1. LE VERDICT PARLE DE SEUILS PUBLIÉS, JAMAIS DE VISA. « Vos ressources
*    atteignent le seuil exigé », pas « vous aurez votre visa ».
* 2. AUCUN TAUX DE CHANGE. On n'additionne et on ne compare que ce dont
*    la parité est LÉGALE et FIXE : le franc CFA et l'euro (655,957).
*    Un seuil en dollars canadiens, en lei ou en livres turques se
*    compare à des ressources déclarées DANS CETTE DEVISE ; sinon la
*    page le demande, au lieu d'inventer un taux qui vieillit tout seul.
* 3. CE QU'ON NE SAIT PAS SE DIT. Le Maroc et la Turquie ne chiffrent
*    aucun seuil de ressources : pas de verdict « atteint », mais la
*    phrase officielle qui l'explique, et le coût de l'année.
*
* Module pur : aucun DOM, aucun Firestore. La page diagnostic-pays.html
* le branche et enregistre le résultat sur
* users/{uid}.diagnosticsPays.<pays>.
* ============================================================
*/

import { DIAGNOSTICS, destination } from "./destinations-preinscription.js";
import { auPays } from "./pays-grammaire.js";

/** Parité fixe F CFA ↔ euro (la même que payment.js et diagnostic-france.js). */
export const PARITE_EUR_XOF = 655.957;

const NBSP = " ";

const SYMBOLES = {
EUR: "€",
XOF: `F${NBSP}CFA`,
CAD: `$${NBSP}CA`,
USD: "USD",
TRY: "TL",
RON: "lei",
MAD: "MAD"
};

/** Les devises proposées à la saisie : F CFA, euro, et celle du seuil du pays. */
export function devisesDeSaisie(id) {
const f = DIAGNOSTICS[id];
const devises = ["XOF", "EUR"];
const seuil = f && (f.ressources || null);
if (seuil && !devises.includes(seuil.devise)) devises.push(seuil.devise);
return devises;
}

export function libelleDevise(devise) {
return SYMBOLES[devise] || devise;
}

/** « 11 904 € », « 600 000 F CFA », « 23 448 $ CA » — espaces insécables. */
export function formatMontant(montant, devise) {
const n = Number(montant);
if (!Number.isFinite(n)) return "";
const arrondi = devise === "XOF" ? Math.round(n) : Math.round(n * 100) / 100;
const texte = arrondi.toLocaleString("fr-FR", { maximumFractionDigits: devise === "XOF" ? 0 : 2 }).replace(/ |\s/g, NBSP);
return `${texte}${NBSP}${libelleDevise(devise)}`;
}

/**
* Convertit un montant d'une devise vers une autre, SEULEMENT quand la
* parité est fixe (F CFA ↔ euro) ou que les deux devises sont les mêmes.
* Sinon `null` : on ne devine pas un taux.
*/
export function convertir(montant, de, vers) {
if (!Number.isFinite(montant)) return null;
if (de === vers) return montant;
if (de === "XOF" && vers === "EUR") return montant / PARITE_EUR_XOF;
if (de === "EUR" && vers === "XOF") return montant * PARITE_EUR_XOF;
return null;
}

/** La famille d'additionnabilité : le F CFA se range avec l'euro. */
function famille(devise) {
return devise === "XOF" ? "EUR" : devise;
}

/** Le montant mensuel d'un seuil, quelle que soit sa période. */
function mensuelDe(seuil) {
if (!seuil) return null;
if (seuil.periode === "mois") return seuil.montant;
if (Number.isFinite(seuil.mensuel)) return seuil.mensuel;
return seuil.montant / 12;
}

function annuelDe(seuil) {
if (!seuil) return null;
return seuil.periode === "mois" ? seuil.montant * 12 : seuil.montant;
}

/** Ce que le total n'inclut jamais : dit sous le total, comme pour la France. */
export const HORS_TOTAL_PAYS = "Hors billet d'avion, et hors ce qui dépend de votre choix d'établissement : dépôts, frais de candidature propres à une université, logement au-delà du seuil exigé.";

/**
* @param {string} id - la destination (« italie »…)
* @param {Object} entrees
* @param {number} entrees.ressourcesMensuelles
* @param {string} [entrees.devise="XOF"]
* @param {string} [entrees.variante] - « quebec » pour le Canada
* @returns {Object|null} null pour une destination inconnue
*/
export function calculerDiagnosticPays(id, entrees = {}) {

const dest = destination(id);
const faits = DIAGNOSTICS[id];
if (!dest || !faits) return null;

const dans = auPays(dest.nom);
const variante = faits.variante && entrees.variante === faits.variante.id ? faits.variante : null;
const seuil = variante || faits.ressources || null;

const devisesPossibles = devisesDeSaisie(id);
const devise = devisesPossibles.includes(entrees.devise) ? entrees.devise : "XOF";
const brut = Number(entrees.ressourcesMensuelles);
const declare = Number.isFinite(brut) && brut >= 0 ? brut : 0;

// ---- 1. Le verdict ----
let verdict;
if (!seuil) {
verdict = {
etat: "sans-seuil",
phrase: faits.ressourcesAbsence ? faits.ressourcesAbsence.texte : `Aucun seuil de ressources n'est publié ${dans}.`,
source: faits.ressourcesAbsence ? faits.ressourcesAbsence.source : "",
verifieLe: faits.ressourcesAbsence ? faits.ressourcesAbsence.verifieLe : ""
};
} else {
const mensuel = mensuelDe(seuil);
const disponible = convertir(declare, devise, seuil.devise);
if (disponible === null) {
verdict = {
etat: "a-comparer",
phrase: `Le seuil ${dans} est fixé en ${libelleDevise(seuil.devise)} : ${formatMontant(mensuel, seuil.devise)} par mois. Indiquez vos ressources en ${libelleDevise(seuil.devise)} pour une comparaison exacte — votre banque vous donne le taux du jour ; nous n'en inventons pas.`,
source: seuil.source, verifieLe: seuil.verifieLe
};
} else {
const ecart = Math.round((disponible - mensuel) * 100) / 100;
verdict = ecart >= 0
? { etat: "atteint", ecartMensuel: ecart, phrase: `Vos ressources atteignent le seuil exigé ${dans} : ${formatMontant(disponible, seuil.devise)} par mois déclarés, pour un seuil de ${formatMontant(mensuel, seuil.devise)} par mois.`, source: seuil.source, verifieLe: seuil.verifieLe }
: { etat: "manque", ecartMensuel: ecart, phrase: `Il vous manque ${formatMontant(-ecart, seuil.devise)} par mois pour atteindre le seuil exigé ${dans} (${formatMontant(mensuel, seuil.devise)} par mois), soit ${formatMontant(-ecart * 12, seuil.devise)} sur l'année.`, source: seuil.source, verifieLe: seuil.verifieLe };
}
}

// ---- 2. Les lignes, chiffre par chiffre ----
const lignes = [];
if (seuil) lignes.push({ cle: "ressources", libelle: "Ressources exigées", texte: seuil.texte, montant: annuelDe(seuil), devise: seuil.devise, compte: true, source: seuil.source, verifieLe: seuil.verifieLe });
else if (faits.ressourcesAbsence) lignes.push({ cle: "ressources", libelle: "Ressources exigées", texte: faits.ressourcesAbsence.texte, absente: true, compte: false, source: faits.ressourcesAbsence.source, verifieLe: faits.ressourcesAbsence.verifieLe });
if (variante && faits.ressources) lignes.push({ cle: "ressourcesHors", libelle: "Hors Québec, pour comparer", texte: faits.ressources.texte, compte: false, source: faits.ressources.source, verifieLe: faits.ressources.verifieLe });
if (faits.droits) lignes.push({ cle: "droits", libelle: "Droits d'inscription", texte: faits.droits.texte, min: faits.droits.min, max: faits.droits.max, devise: faits.droits.devise, compte: true, source: faits.droits.source, verifieLe: faits.droits.verifieLe });
for (const f of faits.frais || []) {
// Un frais réservé à une variante (le CAQ, au Québec) ne compte que si
// l'étudiant l'a choisie ; il reste affiché sinon, à côté.
const applicable = !f.variante || (variante && variante.id === f.variante);
lignes.push({
cle: f.cle,
libelle: f.compte && applicable ? "Frais fixes" : "Selon votre choix",
texte: f.texte,
montant: f.periode === "mois" ? f.montant * 12 : f.montant,
devise: f.devise,
compte: !!f.compte && applicable && Number.isFinite(f.montant),
source: f.source,
verifieLe: f.verifieLe
});
}

// ---- 3. Le total de la première année, par devise additionnable ----
const totaux = {};
const ajouter = (dev, min, max) => {
const fam = famille(dev);
const k = totaux[fam] || (totaux[fam] = { devise: fam, min: 0, max: 0 });
const cmin = convertir(min, dev, fam);
const cmax = convertir(max, dev, fam);
k.min += cmin; k.max += cmax;
};
for (const l of lignes) {
if (!l.compte) continue;
if (l.cle === "droits") ajouter(l.devise, l.min, l.max);
else ajouter(l.devise, l.montant, l.montant);
}
const listeTotaux = Object.values(totaux).map((t) => ({ devise: t.devise, min: Math.round(t.min), max: Math.round(t.max) }));

const morceaux = listeTotaux.map((t) => t.min === t.max
? formatMontant(t.min, t.devise)
: `de ${formatMontant(t.min, t.devise)} à ${formatMontant(t.max, t.devise)}`);
const totalTexte = morceaux.length
? `Pour la première année ${dans}${seuil ? ", ressources exigées comprises" : ", hors frais de vie (aucun seuil publié)"} : ${morceaux.join(", plus ")}.`
: "";

return {
destination: id,
nom: dest.nom,
dans,
devise,
variante: variante ? variante.id : "",
verdict,
lignes,
totaux: listeTotaux,
totalTexte,
horsTotal: HORS_TOTAL_PAYS,
calendrier: faits.calendrier || null,
absences: faits.absences || []
};

}
