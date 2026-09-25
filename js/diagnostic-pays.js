/**
* ============================================================
* Diagnostic <pays> — de l'arithmétique, aucune IA (2026-09-23)
* ============================================================
*
* Le Diagnostic des destinations ouvertes le 23 septembre : Roumanie,
* Turquie, Maroc, Italie, Allemagne, Canada, puis Chine et Malaisie
* (même soir). Même promesse que
* le Diagnostic France : vos ressources contre le seuil publié, le coût
* de l'année chiffre par chiffre, chaque montant avec sa source et sa
* date. Les faits viennent de js/destinations-preinscription.js
* (DIAGNOSTICS), jamais recopiés ici.
*
* TROIS RÈGLES, héritées du Diagnostic France
* -------------------------------------------
* 1. LE VERDICT PARLE DE SEUILS PUBLIÉS, JAMAIS DE VISA. « Vos ressources
*    atteignent le seuil exigé », pas « vous aurez votre visa ».
* 2. UN TAUX DE CHANGE DATÉ, JAMAIS CACHÉ (révisé le 2026-09-25, test
*    « Moussa »). Ce dont la parité est LÉGALE et FIXE (franc CFA et
*    euro, 655,957) se compare exactement. Pour les autres devises, le
*    montant officiel reste affiché tel quel, suivi de son équivalent
*    « environ … F CFA » au taux de référence d'une banque centrale,
*    daté (js/taux-indicatifs.js) ; une comparaison à ce taux le dit, et
*    un écart de moins de 5 % reste « à confirmer ».
* 3. CE QU'ON NE SAIT PAS SE DIT. Le Maroc, la Turquie, la Chine et la
*    Malaisie ne chiffrent aucun seuil de ressources : pas de verdict « atteint », mais la
*    phrase officielle qui l'explique, et le coût de l'année.
*
* Module pur : aucun DOM, aucun Firestore. La page diagnostic-pays.html
* le branche et enregistre le résultat sur
* users/{uid}.diagnosticsPays.<pays>.
* ============================================================
*/

import { DIAGNOSTICS, destination } from "./destinations-preinscription.js";
import { auPays } from "./pays-grammaire.js";
import { enFcfa, formatFcfa, equivalentFcfa, equivalentFcfaFourchette, mentionTaux, conversionExacte } from "./taux-indicatifs.js";

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
MAD: "MAD",
CNY: "CNY",
MYR: "RM"
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
const decimales = devise !== "XOF" && arrondi % 1 !== 0 ? 2 : 0;
const texte = arrondi.toLocaleString("fr-FR", { minimumFractionDigits: decimales, maximumFractionDigits: devise === "XOF" ? 0 : 2 }).replace(/ |\s/g, NBSP);
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
// Le niveau visé (lot 102) : il choisit les droits d'inscription quand le
// pays les publie par niveau (Canada), et le repère du coût de la vie.
const niveau = ["licence", "master", "doctorat"].includes(entrees.niveau) ? entrees.niveau : "";
const droitsNiveau = niveau && faits.droitsParNiveau && faits.droitsParNiveau[niveau];
const droits = droitsNiveau
? (variante && droitsNiveau.variantes && droitsNiveau.variantes[variante.id]) || droitsNiveau
: faits.droits || null;

const devisesPossibles = devisesDeSaisie(id);
const devise = devisesPossibles.includes(entrees.devise) ? entrees.devise : "XOF";
const brut = Number(entrees.ressourcesMensuelles);
const declare = Number.isFinite(brut) && brut >= 0 ? brut : 0;

// ---- 1. Le verdict : calculé après le total (voir 4.) ----

// ---- 2. Les lignes, chiffre par chiffre ----
const lignes = [];
if (seuil) lignes.push({ cle: "ressources", libelle: "Ressources exigées", texte: seuil.texte, montant: annuelDe(seuil), devise: seuil.devise, compte: true, source: seuil.source, verifieLe: seuil.verifieLe });
else if (faits.ressourcesAbsence) lignes.push({ cle: "ressources", libelle: "Ressources exigées", texte: faits.ressourcesAbsence.texte, absente: true, compte: false, source: faits.ressourcesAbsence.source, verifieLe: faits.ressourcesAbsence.verifieLe });
if (variante && faits.ressources) lignes.push({ cle: "ressourcesHors", libelle: "Hors Québec, pour comparer", texte: faits.ressources.texte, compte: false, source: faits.ressources.source, verifieLe: faits.ressources.verifieLe });
if (droits) lignes.push({ cle: "droits", libelle: "Droits d'inscription", texte: droits.texte, min: droits.min, max: droits.max, devise: droits.devise, compte: true, source: droits.source, verifieLe: droits.verifieLe, fcfa: equivalentFcfaFourchette(droits.min, droits.max, droits.devise) });
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
verifieLe: f.verifieLe,
fcfa: Number.isFinite(f.montant) ? equivalentFcfa(f.periode === "mois" ? f.montant * 12 : f.montant, f.devise) : ""
});
}
for (const l of lignes) if (l.cle === "ressources" && Number.isFinite(l.montant)) l.fcfa = equivalentFcfa(l.montant, l.devise);

// ---- 3. Le total de la première année, par devise additionnable ----
const totaux = {};
// Le F CFA se range avec l'euro (parité fixe). Mais quand AUCUNE ligne de
// cette famille n'est en euros — la Chine : les frais du centre de visas
// de Dakar, seuls —, le total reste en F CFA : « 21 500 F CFA » est ce
// que l'étudiant paiera, « 33 € » serait une conversion qu'il n'a pas
// demandée.
const ajouter = (dev, min, max) => {
const fam = famille(dev);
const k = totaux[fam] || (totaux[fam] = { devise: fam, min: 0, max: 0, minXof: 0, maxXof: 0, horsXof: false });
const cmin = convertir(min, dev, fam);
const cmax = convertir(max, dev, fam);
k.min += cmin; k.max += cmax;
if (dev === "XOF") { k.minXof += min; k.maxXof += max; } else k.horsXof = true;
};
for (const l of lignes) {
if (!l.compte) continue;
if (l.cle === "droits") ajouter(l.devise, l.min, l.max);
else ajouter(l.devise, l.montant, l.montant);
}
const listeTotaux = Object.values(totaux).map((t) => (t.devise === "EUR" && !t.horsXof)
? { devise: "XOF", min: Math.round(t.minXof), max: Math.round(t.maxXof) }
: { devise: t.devise, min: Math.round(t.min), max: Math.round(t.max) });

const morceaux = listeTotaux.map((t) => t.min === t.max
? formatMontant(t.min, t.devise)
: `de ${formatMontant(t.min, t.devise)} à ${formatMontant(t.max, t.devise)}`);
// ---- 4. La première année en F CFA, et le verdict ----
// Au tarif le plus bas (min) et le plus haut (max), toutes lignes
// comptées. Exact quand tout est en euros ou en F CFA ; « environ », au
// taux daté, sinon ; impossible si une devise n'a pas de taux.
let totalMinXof = 0;
let totalMaxXof = 0;
let convertible = true;
let exact = true;
for (const l of lignes) {
if (!l.compte) continue;
const lo = l.cle === "droits" ? l.min : l.montant;
const hi = l.cle === "droits" ? l.max : l.montant;
const a = enFcfa(lo, l.devise);
const b = enFcfa(hi, l.devise);
if (a === null || b === null) { convertible = false; continue; }
if (!conversionExacte(l.devise)) exact = false;
totalMinXof += a;
totalMaxXof += b;
}
const seulEnXof = listeTotaux.length === 1 && listeTotaux[0].devise === "XOF";
const fourchetteXof = Math.round(totalMinXof / 1000) === Math.round(totalMaxXof / 1000)
? formatFcfa(totalMinXof)
: `${formatFcfa(totalMinXof).replace(`${NBSP}F${NBSP}CFA`, "")} à ${formatFcfa(totalMaxXof)}`;
const enFcfaTexte = convertible && morceaux.length && !seulEnXof
? ` Soit ${exact ? "" : "environ "}${fourchetteXof}${exact ? "" : `, ${mentionTaux()}`}.`
: "";
const totalTexte = morceaux.length
? `Pour la première année ${dans}${seuil ? ", ressources exigées comprises" : ", hors frais de vie (aucun seuil publié)"} : ${morceaux.join(", auxquels s'ajoutent ")}.${enFcfaTexte}`
: "";

const declareXof = enFcfa(declare, devise);
const exactDeclare = conversionExacte(devise);
let verdict;

if (!seuil) {
// AUCUN SEUIL PUBLIÉ (Maroc, Turquie, Chine, Malaisie). On ne l'invente
// pas ; mais on dit ce que vos ressources laissent pour vivre une fois
// payés les frais les moins chers de l'année (test « Moussa » : ses
// 200 000 F ne servaient à rien).
const absence = {
source: faits.ressourcesAbsence ? faits.ressourcesAbsence.source : "",
verifieLe: faits.ressourcesAbsence ? faits.ressourcesAbsence.verifieLe : ""
};
if (convertible && declareXof !== null) {
const resteAnnuel = declareXof * 12 - totalMinXof;
const precis = exact && exactDeclare;
const env = precis ? "" : "environ ";
if (resteAnnuel < 0) {
verdict = {
etat: "manque", ...absence,
manqueAnnuelXof: Math.round(-resteAnnuel),
phrase: `Vos ${formatFcfa(declareXof)} par mois (${formatFcfa(declareXof * 12)} sur l'année) ne couvrent pas les frais les moins chers de la première année ${dans} : ${env}${formatFcfa(totalMinXof)}, sans compter la vie sur place. Il manque ${env}${formatFcfa(-resteAnnuel)} sur l'année${precis ? "" : `, ${mentionTaux()}`}.`
};
} else if (totalMinXof < 1000) {
verdict = {
etat: "sans-seuil", ...absence,
resteMensuelXof: Math.round(declareXof),
phrase: `Aucun seuil de ressources n'est publié ${dans}, et la première année peut s'y faire sans droits d'inscription (dans le public). Vos ${formatFcfa(declareXof)} par mois vont donc tout entiers à la vie sur place, logement compris : comparez-les aux loyers de la ville visée.`
};
} else {
const reste = resteAnnuel / 12;
const baseReste = `Aucun seuil de ressources n'est publié ${dans}. Avec ${formatFcfa(declareXof)} par mois, les frais les moins chers de la première année (${env}${formatFcfa(totalMinXof)}) vous laisseraient ${env}${formatFcfa(reste)} par mois pour vivre, logement compris`;
// LE REPÈRE OFFICIEL (lot 102) : ce que l'État verse pour vivre à ses
// propres boursiers, qu'il loge en plus. En dessous, pour vivre ET se
// loger, le budget ne tient pas : « manque ».
const repere = faits.repereVie || null;
const montantRepere = repere ? repere[niveau || "licence"] : null;
const repereXof = Number.isFinite(montantRepere) ? enFcfa(montantRepere, repere.devise) : null;
if (repereXof !== null && reste < repereXof && reste >= repereXof * 0.95) {
// À moins de 5 % du repère : le taux du jour ne permet pas de trancher.
verdict = {
etat: "a-confirmer", source: repere.source, verifieLe: repere.verifieLe,
resteMensuelXof: Math.round(reste),
repereMensuelXof: Math.round(repereXof),
phrase: `${baseReste}. C'est tout près de ${repere.libelle} : ${formatMontant(montantRepere, repere.devise)} par mois (environ ${formatFcfa(repereXof)}), ${mentionTaux()}. Refaites le calcul au taux de votre banque, et vérifiez le prix d'un logement dans la ville visée.`
};
} else if (repereXof !== null && reste < repereXof) {
verdict = {
etat: "manque", source: repere.source, verifieLe: repere.verifieLe,
repereMensuelXof: Math.round(repereXof),
manqueAnnuelXof: Math.round((repereXof - reste) * 12),
phrase: `${baseReste}. C'est moins que ${repere.libelle} : ${formatMontant(montantRepere, repere.devise)} par mois (environ ${formatFcfa(repereXof)}). Il manque environ ${formatFcfa((repereXof - reste) * 12)} sur l'année pour atteindre ce repère, ${mentionTaux()}.`
};
} else if (repereXof !== null) {
verdict = {
etat: "sans-seuil", source: repere.source, verifieLe: repere.verifieLe,
resteMensuelXof: Math.round(reste),
repereMensuelXof: Math.round(repereXof),
phrase: `${baseReste}. C'est au-dessus de ${repere.libelle} : ${formatMontant(montantRepere, repere.devise)} par mois (environ ${formatFcfa(repereXof)}). Vérifiez le prix d'un logement dans la ville visée (montants convertis ${mentionTaux()}).`
};
} else {
verdict = {
etat: "sans-seuil", ...absence,
resteMensuelXof: Math.round(reste),
phrase: `${baseReste} : comparez-le aux loyers de la ville visée${precis ? "" : ` (montants convertis ${mentionTaux()})`}.`
};
}
}
} else {
verdict = {
etat: "sans-seuil", ...absence,
phrase: faits.ressourcesAbsence ? faits.ressourcesAbsence.texte : `Aucun seuil de ressources n'est publié ${dans}.`
};
}
} else {
// UN SEUIL PUBLIÉ. Il se compare à la PREMIÈRE ANNÉE ENTIÈRE, au tarif le
// plus bas : ressources exigées pour le visa, droits et frais. Le seuil
// seul ignorait les droits (au Canada, des dizaines de milliers de
// dollars) et disait « atteint » à qui ne pouvait pas payer l'année.
const mensuel = mensuelDe(seuil);
const sources = { source: seuil.source, verifieLe: seuil.verifieLe };
const rappelSeuil = `Le seuil exigé pour le visa est de ${formatMontant(mensuel, seuil.devise)} par mois.`;
const fam = famille(seuil.devise);
const memeFamille = famille(devise) === fam && listeTotaux.length === 1 && famille(listeTotaux[0].devise) === fam;
if (memeFamille) {
// Tout se compare exactement, dans la devise du seuil (ou l'euro).
const dispoAnnuel = Math.round(convertir(declare * 12, devise, fam));
const besoin = Math.round(convertir(listeTotaux[0].min, listeTotaux[0].devise, fam));
const ecart = dispoAnnuel - besoin;
const equiv = (n) => { const x = equivalentFcfa(n, fam); return x ? ` (${x})` : ""; };
verdict = ecart >= 0
? { etat: "atteint", ecartAnnuel: ecart, ...sources, phrase: `Vos ressources couvrent la première année ${dans} au tarif le plus bas : ${formatMontant(dispoAnnuel, fam)} sur l'année, pour ${formatMontant(besoin, fam)} de ressources exigées, de droits et de frais. ${rappelSeuil}` }
: { etat: "manque", ecartAnnuel: ecart, ...sources, phrase: `Il vous manque ${formatMontant(-ecart, fam)} sur l'année ${dans}${equiv(-ecart)} : la première année demande au moins ${formatMontant(besoin, fam)} (ressources exigées pour le visa, droits et frais), pour ${formatMontant(dispoAnnuel, fam)} déclarés. ${rappelSeuil}` };
} else if (convertible && declareXof !== null) {
// Deux devises : la comparaison se fait en F CFA, au taux daté, et le dit.
const dispo = declareXof * 12;
const ecart = dispo - totalMinXof;
if (Math.abs(ecart) < totalMinXof * 0.05) {
verdict = { etat: "a-confirmer", ...sources, phrase: `Vos ressources sont tout près de ce que demande la première année ${dans} : ${formatFcfa(dispo)} sur l'année, pour environ ${formatFcfa(totalMinXof)} (ressources exigées pour le visa, droits et frais), ${mentionTaux()}. Refaites le calcul au taux de votre banque. ${rappelSeuil}` };
} else if (ecart >= 0) {
verdict = { etat: "atteint", ...sources, phrase: `Vos ressources couvrent la première année ${dans} au tarif le plus bas : ${formatFcfa(dispo)} sur l'année, pour environ ${formatFcfa(totalMinXof)} de ressources exigées, de droits et de frais, ${mentionTaux()}. ${rappelSeuil}` };
} else {
verdict = { etat: "manque", manqueAnnuelXof: Math.round(-ecart), ...sources, phrase: `Il vous manque environ ${formatFcfa(-ecart)} sur l'année ${dans} : la première année demande au moins environ ${formatFcfa(totalMinXof)} (ressources exigées pour le visa, droits et frais), pour ${formatFcfa(dispo)} déclarés, ${mentionTaux()}. ${rappelSeuil}` };
}
} else {
verdict = {
etat: "a-comparer", ...sources,
phrase: `Le seuil ${dans} est fixé en ${libelleDevise(seuil.devise)} : ${formatMontant(mensuel, seuil.devise)} par mois. Indiquez vos ressources en ${libelleDevise(seuil.devise)} pour une comparaison exacte.`
};
}
}


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
