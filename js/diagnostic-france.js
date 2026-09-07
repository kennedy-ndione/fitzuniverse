/**
* ============================================================
* Diagnostic France — de l'arithmétique, aucune IA (grille B, 2026-09-07)
* ============================================================
*
* Vos ressources contre le seuil publié, les droits selon le niveau,
* ce que change le plafond d'exonération, les 85 000 F de dossier — et
* un total annuel honnête. Chaque chiffre vient d'un FAIT sourcé et
* daté de js/pays-preinscription.js (France), jamais recopié ici.
*
* LE VERDICT PARLE DE SEUILS PUBLIÉS, JAMAIS DE VISA : « vos ressources
* atteignent le seuil exigé », pas « vous aurez votre visa ». Aucune
* promesse de résultat, nulle part.
*
* Module pur : aucun DOM, aucun Firestore. La page diagnostic-france.html
* le branche et enregistre le résultat sur users/{uid}.diagnosticFrance.
* ============================================================
*/

import { faitFrance } from "./pays-preinscription.js";

/** Parité fixe FCFA ↔ euro (la même que payment.js). */
export const PARITE_EUR_XOF = 655.957;

export const NIVEAUX_DIAGNOSTIC = ["licence", "master"];

export function enEuros(montant, devise) {
if (devise === "XOF") return montant / PARITE_EUR_XOF;
return montant;
}

function arrondi(n, decimales = 0) {
const f = Math.pow(10, decimales);
return Math.round(n * f) / f;
}

/**
* @param {Object} entrees
* @param {number} entrees.ressourcesMensuelles - ce dont l'étudiant dispose par mois
* @param {"EUR"|"XOF"} [entrees.devise="EUR"]
* @param {"licence"|"master"} [entrees.niveau="licence"]
* @param {boolean} [entrees.exonerationEsperee=false]
* @returns {Object} un résultat où chaque bloc porte sa source et sa date
*/
export function calculerDiagnostic(entrees = {}) {

const devise = entrees.devise === "XOF" ? "XOF" : "EUR";
const niveau = NIVEAUX_DIAGNOSTIC.includes(entrees.niveau) ? entrees.niveau : "licence";
const exonerationEsperee = entrees.exonerationEsperee === true;
const brut = Number(entrees.ressourcesMensuelles);
const disponibleEUR = Number.isFinite(brut) && brut >= 0 ? arrondi(enEuros(brut, devise), 2) : 0;

const fRessources = faitFrance("ressources");
const fDroits = faitFrance("droits");
const fDossier = faitFrance("fraisDossier");

const seuilMensuel = fRessources.montants.mensuel;
const seuilAnnuel = fRessources.montants.annuel;
const ecartMensuel = arrondi(disponibleEUR - seuilMensuel, 2);
const atteint = ecartMensuel >= 0;

const droitsMontant = fDroits.montants[niveau];
const plafond = fDroits.plafondExoneration;

const fraisDossierEUR = arrondi(enEuros(fDossier.montant, fDossier.devise), 0);

// Total annuel honnête : les ressources que le consulat exige de
// justifier + les droits du niveau visé + les frais de dossier. Pas
// une estimation du coût de la vie : les ressources exigées SONT le
// chiffre publié.
const totalAnnuelEUR = arrondi(seuilAnnuel + droitsMontant + fraisDossierEUR, 0);

const verdict = atteint
? `Vos ressources atteignent le seuil publié : ${formatEUR(disponibleEUR)} par mois pour ${formatEUR(seuilMensuel)} exigés.`
: `Vos ressources n'atteignent pas le seuil publié : il manque ${formatEUR(Math.abs(ecartMensuel))} par mois (${formatEUR(disponibleEUR)} pour ${formatEUR(seuilMensuel)} exigés).`;

return {
entrees: { ressourcesMensuelles: brut, devise, niveau, exonerationEsperee },
ressources: {
disponibleEUR, seuilMensuel, seuilAnnuel, ecartMensuel, atteint,
texte: verdict,
source: fRessources.source, verifieLe: fRessources.verifieLe
},
droits: {
niveau, montant: droitsMontant, plafondExoneration: plafond, exonerationEsperee,
texte: exonerationEsperee
? `Droits différenciés en ${niveau} : ${formatEUR(droitsMontant)} par an. Une exonération n'est accordée qu'à ${Math.round(plafond * 100)} % au plus des étudiants non européens : espérée, elle n'est pas acquise — budgétez le montant plein.`
: `Droits différenciés en ${niveau} : ${formatEUR(droitsMontant)} par an, à budgéter en totalité. Les exonérations sont plafonnées à ${Math.round(plafond * 100)} % des étudiants non européens.`,
source: fDroits.source, verifieLe: fDroits.verifieLe
},
fraisDossier: {
montant: fDossier.montant, devise: fDossier.devise, montantEUR: fraisDossierEUR,
texte: `Frais de dossier Campus France : ${formatXOF(fDossier.montant)}, non remboursables. Aucun paiement à l'avance : attendez la demande de paiement officielle.`,
source: fDossier.source, verifieLe: fDossier.verifieLe
},
total: {
annuelEUR: totalAnnuelEUR,
texte: `Total annuel à justifier et à payer : ${formatEUR(totalAnnuelEUR)} (${formatEUR(seuilAnnuel)} de ressources exigées + ${formatEUR(droitsMontant)} de droits + ${formatEUR(fraisDossierEUR)} de dossier).`
},
verdict
};

}

export function formatEUR(n) {
const entier = Math.round(n * 100) / 100;
const [partieEntiere, dec] = entier.toFixed(2).split(".");
const groupes = partieEntiere.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
return dec === "00" ? `${groupes} €` : `${groupes},${dec} €`;
}

export function formatXOF(n) {
return `${String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} F CFA`;
}

/** Tous les textes rendus, pour vérifier qu'aucun ne promet un résultat. */
export function textesRendus(resultat) {
return [resultat.verdict, resultat.ressources.texte, resultat.droits.texte, resultat.fraisDossier.texte, resultat.total.texte];
}
