/**
* ============================================================
* FitzUniverse — l'index des procédures de portail (lot S1b, 2026-09-08)
* ============================================================
*
* DEUX ÉTAGES, ET UNE COMPOSITION.
*
*   le TRONC       js/procedures/<destination>.js — les étapes de la
*                  plateforme, sans aucun pays de résidence ;
*   la COUCHE      js/procedures/residences/<destination>-<residence>.js
*                  — les montants, les dates, les lieux et les pièces
*                  locales, en fragments ;
*   la COMPOSITION composerProcedure(tronc, couche) — une procédure de
*                  la même forme qu'avant, plus `residence` et
*                  `residenceDocumentee`.
*
* POURQUOI (2026-09-08). trouverProcedure() filtrait la RÉSIDENCE avant
* la destination : toute résidence autre que le Sénégal rendait null, et
* un profil dont le pays d'origine était vide aussi. Un Ivoirien qui
* visait la France par Études en France voyait donc son dossier SANS
* aucune étape, sans pièces, sans jalons — et rien ne le lui disait. Il
* en concluait, raisonnablement, que le produit était mince.
*
* Désormais la destination seule décide qu'une procédure existe. La
* résidence décide seulement de ce qu'on peut en dire de PRÉCIS : sans
* couche, les onze étapes sont toutes là, et celles qui dépendent du
* pays portent une mention qui l'avoue et perdent leur échéance. Jamais
* un montant, jamais une date, jamais un zéro empruntés à un autre pays.
*
* Un seul appariement de pays dans le dépôt : findCountry() de
* js/countries.js, par code ISO, insensible à la casse et aux accents.
* La table d'alias qui vivait ici ne connaissait que deux pays, et un
* étudiant dont le profil portait une graphie qu'elle ignorait tombait
* du côté « aucune procédure » sans jamais savoir pourquoi.
*
* Une procédure ne concerne que la PRÉINSCRIPTION (js/parcours.js) : le
* parcours bourse n'en reçoit aucune — c'est js/application-journey.js
* qui tient cette règle, pas ce fichier, qui ne connaît que des pays et
* des portails.
*
* Aucun DOM, aucun Firestore.
* ============================================================
*/

import { PROCEDURE_FRANCE } from "./france.js";
import { COUCHES } from "./residences/index.js";
import { FIABILITE, TYPES_ETAPE, TYPES_PREUVE } from "./vocabulaire.js";
import { findCountry } from "../countries.js";

/** Les troncs connus : une DESTINATION chacun. */
export const TRONCS = [PROCEDURE_FRANCE];

/**
* Le début de la mention servie à une étape dont le pays de résidence
* n'est pas documenté. Un tronc peut donner la sienne, plus précise
* (`mentionResidence`) ; celle-ci est le filet.
*/
export const MENTION_RESIDENCE_ABSENTE = "Votre pays de résidence n'est pas encore documenté ici";

const MENTION_PAR_DEFAUT = `${MENTION_RESIDENCE_ABSENTE} : les montants, les dates et les lieux qui en dépendent restent à vérifier auprès de l'organisme de votre pays de résidence.`;

// Un fragment de couche AJOUTE ou REMPLACE — jamais les deux pour le
// même champ. Le partage est déclaré ici, une fois, et c'est lui que
// defautsDeProcedure() fait respecter.
const CLES_AJOUT = ["consigneSup", "piecesSup"];
const CLES_REMPLACEMENT = ["titre", "consigne", "pieces"];
const CLES_VALEUR = ["montant", "devise"];

/**
* Deux graphies du même pays ? Une seule règle : le code ISO du
* référentiel. « senegal », « Sénégal », « SN » sont un seul pays ;
* « Sénégalaise » n'est pas un pays, et ne trouve rien.
*/
export function memePays(a, b) {
const pa = findCountry(a);
const pb = findCountry(b);
return !!pa && !!pb && pa.iso === pb.iso;
}

/** La couche d'une destination pour un pays de résidence, ou null. */
export function coucheDeResidence(paysDestination, paysResidence) {
if (!paysResidence) return null;
return COUCHES.find((c) => memePays(c.destination, paysDestination) && memePays(c.pays, paysResidence)) || null;
}

/** Les pays de résidence documentés pour une destination, dans l'ordre du registre. */
export function residencesDocumentees(paysDestination) {
return COUCHES.filter((c) => memePays(c.destination, paysDestination)).map((c) => ({ pays: c.pays, verifieLe: c.verifieLe }));
}

function mentionDe(tronc) {
return (tronc && tronc.mentionResidence) || MENTION_PAR_DEFAUT;
}

/**
* Une étape du tronc + son fragment de couche (ou rien).
*
* SANS COUCHE, une étape `dependResidence` reçoit la mention DANS sa
* consigne : c'est le seul endroit que tous les rendus lisent déjà
* (applications.js, preinscriptions-page.js, next-action.js). Un champ
* à part serait plus propre et ne s'afficherait nulle part — c'est-à-dire
* qu'il ne dirait rien à personne. Le champ `mention` existe quand même,
* pour qui voudra le styler.
*
* AVEC une couche, une étape qui n'a pas de fragment n'est pas pour
* autant incomplète : « confirmer son choix » ne demande rien de local
* que sa date, et la couche la lui donne. La mention se règle donc sur
* la présence de la COUCHE, pas sur celle du fragment — s'en remettre au
* fragment collerait « votre pays n'est pas documenté » sous trois
* étapes d'un dossier sénégalais entièrement documenté.
*/
function composerEtape(etape, fragment, couche, tronc) {

const calendrier = (couche && couche.faits && couche.faits.calendrier) || null;

const composee = { ...etape };

// L'échéance ne survit que si le calendrier de la résidence porte ce
// jalon : sans couche, aucune date n'est affichée. C'est ainsi qu'un
// Ivoirien ne lit pas les dates de la campagne sénégalaise.
if (composee.echeance && composee.echeance.cle) {
const jalons = (calendrier && calendrier.jalons) || null;
if (!jalons || !jalons[composee.echeance.cle]) composee.echeance = null;
}

if (!couche) {
if (etape.dependResidence) {
composee.mention = mentionDe(tronc);
composee.consigne = `${etape.consigne} ${composee.mention}`;
}
return composee;
}

if (!fragment) return composee;

if (fragment.titre) composee.titre = fragment.titre;

if (fragment.consigne) composee.consigne = fragment.consigne;
else if (fragment.consigneSup) composee.consigne = `${etape.consigne} ${fragment.consigneSup}`;

if (Array.isArray(fragment.pieces)) composee.pieces = [...fragment.pieces];
else if (Array.isArray(fragment.piecesSup)) composee.pieces = [...(etape.pieces || []), ...fragment.piecesSup];

for (const cle of CLES_VALEUR) if (fragment[cle] !== undefined) composee[cle] = fragment[cle];

// LA SOURCE SUIT LE TEXTE. Un fragment qui REMPLACE la consigne
// remplace aussi la source affichée : montrer « je constitue mon
// dossier » sous une phrase qui parle de SUNU BANK enverrait le lecteur
// vérifier au mauvais endroit. Un fragment qui AJOUTE laisse la source
// du tronc en tête et pose la sienne à côté.
if (fragment.consigne) {
composee.source = fragment.source;
composee.verifieLe = fragment.verifieLe;
} else {
composee.sourceResidence = fragment.source;
composee.verifieLeResidence = fragment.verifieLe;
}

return composee;

}

/**
* Le tronc, plus la couche si elle existe. Rend une procédure de la même
* forme qu'avant le lot S1b, plus :
*   residence            le pays de résidence, ou "" ;
*   residenceDocumentee  vrai seulement si une couche a été appliquée ;
*   faits                les faits de pays de la couche, ou null ;
*   couche               la couche elle-même, pour les contrôles.
*/
export function composerProcedure(tronc, couche = null) {

const fragments = (couche && couche.etapes) || {};

return {
...tronc,
id: couche ? couche.id : tronc.id,
residence: couche ? couche.pays : "",
residenceDocumentee: !!couche,
faits: (couche && couche.faits) || null,
couche: couche || null,
etapes: tronc.etapes.map((e) => composerEtape(e, fragments[e.id] || null, couche, tronc))
};

}

// Composer à chaque appel rendrait un objet neuf à chaque rendu de
// carte. La mémoire est ici pour que deux appels identiques rendent le
// MÊME objet : les rendus comparent parfois par identité, et rien ne
// mute une procédure.
const composees = new Map();

function procedureComposee(tronc, couche) {
const cle = `${tronc.id}|${couche ? couche.id : ""}`;
if (!composees.has(cle)) composees.set(cle, composerProcedure(tronc, couche));
return composees.get(cle);
}

/**
* La procédure d'une candidature, ou null.
*
* Elle ne rend null que si la DESTINATION est inconnue. Une destination
* connue rend toujours ses étapes : avec la couche du pays de résidence
* quand elle existe, sans elle sinon — et alors la procédure le dit.
*
* @param {{paysDestination?:string, portailUrl?:string, paysResidence?:string}} p
*   La destination se reconnaît par le pays de l'université OU par
*   l'URL du portail (le motif de la procédure) ; la résidence est
*   celle du profil de l'étudiant.
*/
export function trouverProcedure({ paysDestination = "", portailUrl = "", paysResidence = "" } = {}) {
for (const tronc of TRONCS) {
const parPays = memePays(tronc.paysDestination, paysDestination);
const parPortail = !!portailUrl && new RegExp(tronc.portail.motif, "i").test(String(portailUrl));
if (!parPays && !parPortail) continue;
return procedureComposee(tronc, coucheDeResidence(tronc.paysDestination, paysResidence));
}
return null;
}

/** Vrai si une URL de portail appartient à une destination connue. */
export function portailDocumente(portailUrl) {
return TRONCS.some((t) => !!portailUrl && new RegExp(t.portail.motif, "i").test(String(portailUrl)));
}

/** Les étapes encore « à confirmer » d'une procédure. */
export function etapesAConfirmer(procedure) {
return ((procedure && procedure.etapes) || []).filter((e) => e.fiabilite === "a_confirmer");
}

/**
* Le code de procédure qu'un pays MÉRITE : "documentee" seulement quand
* une procédure existe, qu'aucune étape n'est "a_confirmer" ET que le
* pays de résidence est documenté. Sinon, le code déclaré du pays
* (js/pays-preinscription.js).
*
* « a_confirmer » et « résidence non documentée » sont DEUX idées, et
* elles ont deux champs : la première dit « à confirmer lors de la
* première passe réelle » sur un fait qu'on affiche déjà, la seconde dit
* qu'on n'a rien à afficher du tout pour ce pays-là. On ne marque donc
* jamais une étape « a_confirmer » faute de couche.
*/
export function codeProcedurePour(pays, procedure) {
if (!procedure || !Array.isArray(procedure.etapes) || !procedure.etapes.length) return pays && pays.procedure;
const complete = etapesAConfirmer(procedure).length === 0 && procedure.residenceDocumentee === true;
return complete ? "documentee" : (pays && pays.procedure) || "en_cours";
}

/**
* Le libellé honnête d'une procédure : ce qu'on sait, et ce qui manque.
* Sans procédure : "".
*/
export function libelleProcedureDocumentee(procedure) {
if (!procedure) return "";
if (procedure.residenceDocumentee === false) return "Procédure de portail documentée ; les détails de votre pays de résidence restent à vérifier";
const n = etapesAConfirmer(procedure).length;
if (n === 0) return "Procédure de portail documentée, accompagnée pas à pas";
return `Procédure documentée depuis les sources publiques ; ${n} étape${n > 1 ? "s" : ""} à confirmer`;
}

/**
* Les défauts de forme d'une COUCHE de résidence : fragment vide,
* fragment qui vise une étape inexistante, fragment qui ajoute ET
* remplace le même champ, et surtout fragment sans source ni date.
*
* La règle du lot S1b est plus dure que le strict nécessaire : le
* briefing n'exigeait source + verifieLe que des fragments qui
* REMPLACENT. On les exige de tous, y compris de ceux qui ajoutent —
* parce qu'un ajout est un fait de plus, exactement comme un
* remplacement, et qu'un pays du lot S2 pourrait sinon glisser une
* phrase non vérifiée à la fin d'une consigne qui, elle, l'est.
*/
export function defautsDeCouche(couche, tronc) {

const defauts = [];
if (!couche) return defauts;

if (!couche.pays) defauts.push("couche sans pays");
if (!findCountry(couche.pays)) defauts.push(`couche : pays « ${couche.pays} » inconnu du référentiel`);
if (!memePays(couche.destination, tronc && tronc.paysDestination)) defauts.push(`couche ${couche.id} : destination « ${couche.destination} » ne correspond pas au tronc`);

for (const [cle, fait] of Object.entries(couche.faits || {})) {
if (!/^https?:\/\//.test((fait && fait.source) || "")) defauts.push(`fait ${cle} : sans source`);
if (!/^\d{4}-\d{2}-\d{2}$/.test((fait && fait.verifieLe) || "")) defauts.push(`fait ${cle} : sans verifieLe`);
}

const ids = new Set(((tronc && tronc.etapes) || []).map((e) => e.id));

for (const [id, fragment] of Object.entries(couche.etapes || {})) {

if (!ids.has(id)) { defauts.push(`fragment « ${id} » : aucune étape de ce nom dans le tronc`); continue; }

const ajoute = CLES_AJOUT.filter((c) => fragment[c] !== undefined);
const remplace = CLES_REMPLACEMENT.filter((c) => fragment[c] !== undefined);
const valeurs = CLES_VALEUR.filter((c) => fragment[c] !== undefined);

if (!ajoute.length && !remplace.length && !valeurs.length) defauts.push(`fragment « ${id} » : vide`);
if (ajoute.includes("consigneSup") && remplace.includes("consigne")) defauts.push(`fragment « ${id} » : ajoute ET remplace la consigne`);
if (ajoute.includes("piecesSup") && remplace.includes("pieces")) defauts.push(`fragment « ${id} » : ajoute ET remplace les pièces`);

if (!/^https?:\/\//.test(fragment.source || "")) defauts.push(`fragment « ${id} » : sans source`);
if (!/^\d{4}-\d{2}-\d{2}$/.test(fragment.verifieLe || "")) defauts.push(`fragment « ${id} » : sans verifieLe`);

for (const piece of [...(fragment.pieces || []), ...(fragment.piecesSup || [])]) {
if (!piece.nom) defauts.push(`fragment « ${id} » : pièce sans nom`);
}

}

return defauts;

}

/**
* Vérifie la forme d'une procédure — tronc, couche ou composition :
* vocabulaire fermé, source + date sur chaque étape, prérequis
* existants, aucun cycle, et les fragments de la couche s'il y en a
* une. Rend la liste des défauts (vide = valide).
*/
export function defautsDeProcedure(procedure) {
const defauts = [];
const ids = new Set((procedure.etapes || []).map((e) => e.id));
for (const e of procedure.etapes || []) {
if (!TYPES_ETAPE.includes(e.type)) defauts.push(`${e.id} : type « ${e.type} »`);
if (!TYPES_PREUVE.includes(e.preuve)) defauts.push(`${e.id} : preuve « ${e.preuve} »`);
if (!FIABILITE.includes(e.fiabilite)) defauts.push(`${e.id} : fiabilité « ${e.fiabilite} »`);
if (!/^https?:\/\//.test(e.source || "")) defauts.push(`${e.id} : sans source`);
if (!/^\d{4}-\d{2}-\d{2}$/.test(e.verifieLe || "")) defauts.push(`${e.id} : sans verifieLe`);
for (const p of e.prerequis || []) {
if (!ids.has(p) && !["profile", "checklist", "traductions", "ressources"].includes(p)) defauts.push(`${e.id} : prérequis inconnu « ${p} »`);
}
if (e.echeance && (e.echeance.depuis !== "calendrier" || !e.echeance.cle)) defauts.push(`${e.id} : échéance mal formée`);
for (const piece of e.pieces || []) {
if (!piece.nom) defauts.push(`${e.id} : pièce sans nom`);
}
}
// Cycles : parcours en profondeur sur les prérequis internes.
const parId = new Map((procedure.etapes || []).map((e) => [e.id, e]));
const etat = new Map();
const visiter = (id, pile) => {
if (etat.get(id) === "fait") return;
if (etat.get(id) === "en-cours") { defauts.push(`cycle de prérequis : ${[...pile, id].join(" → ")}`); return; }
etat.set(id, "en-cours");
for (const p of (parId.get(id) && parId.get(id).prerequis) || []) if (parId.has(p)) visiter(p, [...pile, id]);
etat.set(id, "fait");
};
for (const id of parId.keys()) visiter(id, []);
// La couche, quand la procédure en porte une.
if (procedure.couche) defauts.push(...defautsDeCouche(procedure.couche, TRONCS.find((t) => memePays(t.paysDestination, procedure.paysDestination)) || procedure));
return defauts;
}
