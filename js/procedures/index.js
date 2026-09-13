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
import { PROCEDURE_ROUMANIE } from "./roumanie.js";
import { PROCEDURE_TURQUIE } from "./turquie.js";
import { PROCEDURE_MAROC } from "./maroc.js";
import { PROCEDURE_ITALIE } from "./italie.js";
import { PROCEDURE_ALLEMAGNE } from "./allemagne.js";
import { PROCEDURE_CANADA } from "./canada.js";
import { COUCHES } from "./residences/index.js";
import { FIABILITE, TYPES_ETAPE, TYPES_PREUVE } from "./vocabulaire.js";
import { findCountry } from "../countries.js";

/**
* Les troncs connus : une DESTINATION chacun. L'ordre est celui des sept
* pays de js/pays-preinscription.js — la France d'abord, parce qu'elle
* est la seule à avoir des couches de résidence, puis les six du lot S3.
*/
export const TRONCS = [
PROCEDURE_FRANCE,
PROCEDURE_ROUMANIE,
PROCEDURE_TURQUIE,
PROCEDURE_MAROC,
PROCEDURE_ITALIE,
PROCEDURE_ALLEMAGNE,
PROCEDURE_CANADA
];

/**
* LA RÉSIDENCE N'EST PAS TOUJOURS UNE CONDITION (lot S3, 2026-09-13).
*
* La France exige une couche de résidence parce que Campus France a un
* espace PAR PAYS, avec ses frais, son calendrier et son lieu
* d'entretien : sans la couche, la procédure française est réellement
* incomplète, et `codeProcedurePour` avait raison d'exiger
* `residenceDocumentee`.
*
* Les six destinations du lot S3 ne marchent pas comme ça. La circulaire
* italienne est biennale et vaut pour tous les pays ; le Sperrkonto
* allemand est fédéral ; les seuils de fonds canadiens sont fédéraux ou
* québécois ; le calendrier Türkiye Bursları et celui de l'ÖSYM sont
* nationaux ; la lettre d'acceptation roumaine vient du ministère ; et
* la voie AMCI marocaine est la même depuis les huit pays qu'elle
* dessert — la seule chose qui varie, la dispense de visa, est écrite
* nationalité par nationalité DANS la consigne. Exiger d'eux une couche
* de résidence reviendrait à leur reprocher de ne pas avoir un problème
* qu'ils n'ont pas, et à afficher « en cours de documentation » sur des
* procédures entièrement documentées.
*
* Un tronc déclare donc `residenceRequise: false` quand il est complet
* sans couche. Absent, le champ vaut true : la France, et tout tronc
* futur, garde l'exigence par défaut.
*/
export function residenceRequise(tronc) {
return !tronc || tronc.residenceRequise !== false;
}

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
const CLES_VALEUR = ["montant", "devise", "decomposition"];

/**
* LES DEUX SEULES DEVISES QU'ON ADDITIONNE (lot S2-MODÈLE, 2026-09-08).
*
* Le franc CFA a une parité LÉGALE et FIXE avec l'euro (655,957) : les
* additionner est une opération exacte, et tout le Diagnostic France
* repose dessus. Le dirham marocain n'en a pas. Convertir un dirham
* demanderait un taux, c'est-à-dire un chiffre qui vieillit tout seul
* dans un dépôt qui refuse déjà ce genre de valeur pour les échéances —
* et un total « exact » calculé sur un taux d'il y a six mois est pire
* qu'une addition qu'on refuse de faire.
*
* La règle est donc : on additionne XOF et EUR, et rien d'autre. Un
* montant dans une autre devise s'affiche EN L'ÉTAT, à côté du total,
* avec la mention qu'il s'y ajoute. Le total ne l'absorbe jamais.
*/
export const DEVISES_ADDITIONNABLES = ["EUR", "XOF"];

export function deviseAdditionnable(devise) {
return DEVISES_ADDITIONNABLES.includes(String(devise || "").toUpperCase());
}

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

/**
* Les points de vigilance d'un pays de résidence — le tableau vide quand
* le pays n'est pas documenté, ou qu'il n'en déclare aucun. Jamais null :
* l'appelant boucle, il ne teste pas.
*/
export function pointsDeVigilanceDe(paysDestination, paysResidence) {
const couche = coucheDeResidence(paysDestination, paysResidence);
return (couche && couche.pointsDeVigilance) || [];
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

// LES ABSENCES DÉCLARÉES (lot S2-MODÈLE). Une couche peut être
// documentée pour ses frais et muette sur son calendrier : c'est l'état
// le plus fréquent, pas une exception. L'étape reçoit alors la phrase de
// la COUCHE — plus précise que la mention générale du tronc, et servie à
// sa place — et son échéance disparaît d'elle-même, faute de jalon.
const absences = (couche && couche.absences) || null;
const manquants = absences ? (etape.dependDe || []).filter((cle) => absences[cle]) : [];

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

// Avec une couche, la mention servie n'est plus celle du tronc mais
// celle de la couche, clé par clé : « le calendrier de la campagne n'est
// pas encore publié » vaut mieux que « votre pays n'est pas documenté »,
// qui serait faux ici. Plusieurs absences sur une même étape se suivent
// dans l'ordre où l'étape les déclare.
if (manquants.length) {
composee.mention = manquants.map((cle) => absences[cle]).join(" ");
composee.absences = [...manquants];
}

if (!fragment) {
if (composee.mention) composee.consigne = `${etape.consigne} ${composee.mention}`;
return composee;
}

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

// La mention d'absence se pose APRÈS le fragment : elle parle de ce que
// la couche n'a pas, y compris quand la couche a écrit la consigne. Un
// pays peut décrire son guichet de paiement sans connaître encore la
// date limite de la campagne.
if (composee.mention) composee.consigne = `${composee.consigne} ${composee.mention}`;

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
// Voir residenceRequise() : false = ce tronc est complet sans couche.
residenceRequise: residenceRequise(tronc),
faits: (couche && couche.faits) || null,
// Ce que la couche déclare NE PAS savoir, et ce que l'organisme
// officiel du pays dit de nous. Les deux sont des champs facultatifs de
// la couche ; absents, ils valent "" et null, et rien ne s'affiche —
// jamais un bloc vide (lot S2-MODÈLE).
absences: (couche && couche.absences) || null,
avertissement: (couche && couche.avertissement) || "",
// Lot DIAGNOSTIC-2 : une à trois phrases qui coûtent cher quand on ne
// les lit pas. Tableau VIDE et non null quand la couche n'en déclare
// pas : l'appelant boucle sans se demander si le champ existe.
pointsDeVigilance: (couche && couche.pointsDeVigilance) || [],
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
const residenceOk = procedure.residenceDocumentee === true || procedure.residenceRequise === false;
const complete = etapesAConfirmer(procedure).length === 0 && residenceOk;
return complete ? "documentee" : (pays && pays.procedure) || "en_cours";
}

/**
* Le libellé honnête d'une procédure : ce qu'on sait, et ce qui manque.
* Sans procédure : "".
*/
export function libelleProcedureDocumentee(procedure) {
if (!procedure) return "";
if (procedure.residenceDocumentee === false && procedure.residenceRequise !== false) return "Procédure de portail documentée ; les détails de votre pays de résidence restent à vérifier";
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
/**
* UN MONTANT PEUT ÊTRE UNE SOMME (lot S2-MODÈLE, 2026-09-08).
*
* Au Cameroun, la procédure coûte 85 000 F de frais Campus France PLUS
* 16 000 F de frais TLS, tous deux obligatoires. Porter 85 000
* sous-estime la dépense réelle de 16 000 F ; porter 101 000 sans rien
* dire donne un chiffre tombé du ciel — et un étudiant qui compare avec
* la page officielle croit à une erreur.
*
* La forme : `montant` reste ce que l'étudiant paie RÉELLEMENT en tout,
* `decomposition` dit d'où vient chaque franc. La somme doit être
* ÉGALE, au franc près : un écart n'est pas un arrondi à tolérer, c'est
* un chiffre faux quelque part. Et toutes les lignes portent la devise
* du fait — une décomposition qui mélange les devises ne s'additionne
* pas (voir DEVISES_ADDITIONNABLES).
*/
function defautsDeDecomposition(cle, fait) {

const defauts = [];
if (!fait || fait.decomposition === undefined) return defauts;

if (!Array.isArray(fait.decomposition) || !fait.decomposition.length) {
defauts.push(`fait ${cle} : decomposition vide`);
return defauts;
}

let somme = 0;
for (const ligne of fait.decomposition) {
if (!ligne || !String(ligne.libelle || "").trim()) defauts.push(`fait ${cle} : ligne de décomposition sans libellé`);
if (typeof (ligne && ligne.montant) !== "number" || !Number.isFinite(ligne.montant)) {
defauts.push(`fait ${cle} : ligne « ${(ligne && ligne.libelle) || "?"} » sans montant`);
continue;
}
if (ligne.devise !== fait.devise) defauts.push(`fait ${cle} : ligne « ${ligne.libelle} » en ${ligne.devise} au lieu de ${fait.devise}`);
somme += ligne.montant;
}

if (somme !== fait.montant) defauts.push(`fait ${cle} : la décomposition fait ${somme}, le montant dit ${fait.montant}`);

return defauts;

}

export function defautsDeCouche(couche, tronc) {

const defauts = [];
if (!couche) return defauts;

if (!couche.pays) defauts.push("couche sans pays");
if (!findCountry(couche.pays)) defauts.push(`couche : pays « ${couche.pays} » inconnu du référentiel`);
if (!memePays(couche.destination, tronc && tronc.paysDestination)) defauts.push(`couche ${couche.id} : destination « ${couche.destination} » ne correspond pas au tronc`);

for (const [cle, fait] of Object.entries(couche.faits || {})) {
if (!/^https?:\/\//.test((fait && fait.source) || "")) defauts.push(`fait ${cle} : sans source`);
if (!/^\d{4}-\d{2}-\d{2}$/.test((fait && fait.verifieLe) || "")) defauts.push(`fait ${cle} : sans verifieLe`);
defauts.push(...defautsDeDecomposition(cle, fait));
}

// UNE ABSENCE EST UNE PHRASE, ET ELLE NE PORTE QUE SUR CE QUI MANQUE.
// Un fait ne peut pas être à la fois présent et déclaré absent : la
// contradiction serait invisible à l'affichage (l'étudiant lirait un
// montant ET « ce montant n'est pas connu »), et c'est exactement le
// genre d'incohérence qu'une couche de données doit rendre impossible.
for (const [cle, phrase] of Object.entries(couche.absences || {})) {
if (typeof phrase !== "string" || !phrase.trim()) defauts.push(`absence ${cle} : sans phrase`);
if (couche.faits && couche.faits[cle]) defauts.push(`absence ${cle} : ce fait est pourtant présent`);
// Une absence que personne ne consomme ne s'affiche nulle part : c'est
// une phrase écrite pour rien, et le lot suivant croira l'avoir servie.
if (tronc && Array.isArray(tronc.etapes) && !tronc.etapes.some((e) => (e.dependDe || []).includes(cle))) {
defauts.push(`absence ${cle} : aucune étape ne la consomme (voir dependDe)`);
}
}

if (couche.avertissement !== undefined && (typeof couche.avertissement !== "string" || !couche.avertissement.trim())) {
defauts.push("avertissement : présent mais vide");
}

// LES POINTS DE VIGILANCE (lot DIAGNOSTIC-2, 2026-09-09).
//
// Une à trois phrases par pays : la règle éliminatoire, le piège de
// calendrier, la porte qui se ferme. Elles ne sont pas un résumé des
// consignes — elles sont la partie des consignes qui coûte cher quand on
// ne la lit pas, remontée en tête du diagnostic.
//
// Même exigence que partout : SOURCE + DATE, sinon la couche est en
// défaut. Une phrase de vigilance non sourcée serait le pire des
// contenus de ce dépôt — un avertissement a l'autorité d'un fait, et
// l'étudiant y obéira.
//
// PLAFOND À TROIS, à dessein : au-delà, plus rien ne ressort. Un lot qui
// veut en ajouter une quatrième doit d'abord décider laquelle sort.
if (couche.pointsDeVigilance !== undefined) {

if (!Array.isArray(couche.pointsDeVigilance) || !couche.pointsDeVigilance.length) {
defauts.push("pointsDeVigilance : présent mais vide");
} else if (couche.pointsDeVigilance.length > 3) {
defauts.push(`pointsDeVigilance : ${couche.pointsDeVigilance.length} entrées, trois au maximum`);
}

for (const [i, point] of (Array.isArray(couche.pointsDeVigilance) ? couche.pointsDeVigilance : []).entries()) {
if (!point || typeof point.texte !== "string" || !point.texte.trim()) defauts.push(`point de vigilance ${i + 1} : sans texte`);
if (!/^https?:\/\//.test((point && point.source) || "")) defauts.push(`point de vigilance ${i + 1} : sans source`);
if (!/^\d{4}-\d{2}-\d{2}$/.test((point && point.verifieLe) || "")) defauts.push(`point de vigilance ${i + 1} : sans verifieLe`);
}

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
