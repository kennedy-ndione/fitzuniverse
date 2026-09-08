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
import { coucheDeResidence } from "./procedures/index.js";

/**
* PAYS DE RÉSIDENCE — la question qui manquait (2026-09-08).
*
* Le diagnostic servait les frais de dossier de l'espace Campus France
* du SÉNÉGAL (85 000 F CFA) à tout acheteur, où qu'il vive. Un étudiant
* ivoirien payait pour lire un montant qui n'était pas le sien, dans un
* produit vendu comme « une réponse chiffrée avant de payer Campus
* France » — c'est-à-dire exactement là où se tromper coûte le plus.
*
* Le partage est net, et il tient à la géographie de la dépense :
*   - ce qui est FRANÇAIS vaut pour tout le monde. Le seuil de
*     ressources du visa, les droits différenciés, le plafond
*     d'exonération sont fixés par la France et ne dépendent pas d'où
*     part l'étudiant : ces blocs se calculent sans condition ;
*   - ce qui est LOCAL — les frais de l'espace Campus France du pays de
*     résidence — ne s'affiche que si ce pays est documenté.
*
* Un pays non documenté ne reçoit AUCUN montant inventé, ni une moyenne,
* ni « environ ». Il reçoit une phrase qui dit ce qu'on ne sait pas, et
* un total annuel qui annonce lui-même ce qu'il exclut : un total muet
* sur son propre trou serait pire qu'un mauvais chiffre, parce qu'il se
* lirait comme complet.
*
* Le Sénégal est le seul pays documenté à ce stade — les autres viendront
* du lot S2, avec leurs sources.
*
* LOT S1b (2026-09-08) : ce test lisait le champ `residence` du seul
* fait fraisDossier. Il lit maintenant le REGISTRE DES COUCHES
* (js/procedures/residences/index.js), c'est-à-dire le même endroit que
* la procédure de portail. Sans cela, le lot S2 aurait eu deux listes à
* tenir — celle du diagnostic et celle des procédures — et le jour où
* l'une aurait avancé sans l'autre, un étudiant aurait vu les étapes de
* son pays sans en voir le coût, ou l'inverse. Le comportement
* observable ne change pas : le Sénégal reste le seul pays servi.
*/
export function residenceDocumentee(paysResidence) {
// coucheDeResidence apparie par code ISO (findCountry) : « senegal »,
// « Sénégal » et « SN » sont un seul pays, et une saisie que le
// référentiel ne reconnaît pas n'est jamais tenue pour documentée.
return !!coucheDeResidence("France", paysResidence);
}

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
const paysResidence = String(entrees.paysResidence || "").trim();
// La couche du pays de résidence porte SES faits : les frais de dossier
// sortent d'elle, pas d'une table France où ils auraient l'air généraux.
const couche = coucheDeResidence("France", paysResidence);
const documente = !!couche;
const brut = Number(entrees.ressourcesMensuelles);
const disponibleEUR = Number.isFinite(brut) && brut >= 0 ? arrondi(enEuros(brut, devise), 2) : 0;

const fRessources = faitFrance("ressources");
const fDroits = faitFrance("droits");
const fDossier = couche ? couche.faits.fraisDossier : null;

const seuilMensuel = fRessources.montants.mensuel;
const seuilAnnuel = fRessources.montants.annuel;
const ecartMensuel = arrondi(disponibleEUR - seuilMensuel, 2);
const atteint = ecartMensuel >= 0;

const droitsMontant = fDroits.montants[niveau];
const plafond = fDroits.plafondExoneration;

// Zéro quand le pays n'est pas documenté : le total ne peut pas porter
// un montant qu'on ne connaît pas, et n'a pas le droit d'en deviner un.
const fraisDossierEUR = documente ? arrondi(enEuros(fDossier.montant, fDossier.devise), 0) : 0;

// Total annuel honnête : les ressources que le consulat exige de
// justifier + les droits du niveau visé + les frais de dossier. Pas
// une estimation du coût de la vie : les ressources exigées SONT le
// chiffre publié.
const totalAnnuelEUR = arrondi(seuilAnnuel + droitsMontant + fraisDossierEUR, 0);

const verdict = atteint
? `Vos ressources atteignent le seuil publié : ${formatEUR(disponibleEUR)} par mois pour ${formatEUR(seuilMensuel)} exigés.`
: `Vos ressources n'atteignent pas le seuil publié : il manque ${formatEUR(Math.abs(ecartMensuel))} par mois (${formatEUR(disponibleEUR)} pour ${formatEUR(seuilMensuel)} exigés).`;

return {
entrees: { ressourcesMensuelles: brut, devise, niveau, exonerationEsperee, paysResidence },
residence: { pays: paysResidence, documentee: documente },
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
// Pays non documenté : ni montant, ni devise, ni source — les champs
// sont ABSENTS plutôt que nuls ou à zéro. Un `montant: 0` se serait
// additionné, formaté, affiché « 0 F CFA » et lu comme « c'est
// gratuit ». Ce qu'on ignore ne prend pas la forme de ce qu'on sait.
fraisDossier: documente
? {
documente: true,
montant: fDossier.montant, devise: fDossier.devise, montantEUR: fraisDossierEUR,
texte: `Frais de dossier Campus France : ${formatXOF(fDossier.montant)}, non remboursables. Aucun paiement à l'avance : attendez la demande de paiement officielle.`,
source: fDossier.source, verifieLe: fDossier.verifieLe
}
: {
documente: false,
texte: "Frais de dossier Campus France : non encore vérifiés pour votre pays. Ils existent et varient d'un espace Campus France à l'autre : renseignez-vous auprès de celui de votre pays de résidence avant de budgéter.",
montantEUR: 0
},
total: {
annuelEUR: totalAnnuelEUR,
inclutFraisDossier: documente,
texte: documente
? `Total annuel à justifier et à payer : ${formatEUR(totalAnnuelEUR)} (${formatEUR(seuilAnnuel)} de ressources exigées + ${formatEUR(droitsMontant)} de droits + ${formatEUR(fraisDossierEUR)} de dossier).`
: `Total annuel à justifier et à payer : ${formatEUR(totalAnnuelEUR)} (${formatEUR(seuilAnnuel)} de ressources exigées + ${formatEUR(droitsMontant)} de droits) — HORS frais de dossier Campus France, non encore vérifiés pour votre pays. Le montant réel sera donc plus élevé.`
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
