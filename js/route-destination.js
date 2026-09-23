/**
* ============================================================
* js/route-destination.js — LA ROUTE des six autres destinations
* (2026-09-23, « finir les pays restants comme on l'a fait avec la France »)
* ============================================================
*
* PURE : aucun DOM, aucun Firestore. Testée par
* test/destinations-preinscription.test.mjs. Rendue par
* espace-preinscription.js quand l'adresse porte ?d=<pays>.
*
* LE MÊME PRINCIPE QUE LA ROUTE FRANCE : « une route, une étape à la
* fois, un geste par étape ». Et la MÊME FORME d'objet que
* construireRoute() (js/route-preinscription.js) — numéro, titre, en
* clair, texte officiel, preuve, pièces, vœux —, pour que l'espace peigne
* les sept destinations avec les mêmes fonctions.
*
* D'OÙ VIENNENT LES ÉTAPES
* ------------------------
*   1. Votre situation      — le mini-profil, la question de langue du pays
*   2. Vos ressources       — le Diagnostic du pays (diagnostic-pays.html)
*   3. Vos vœux             — plafond du pays (un seul cours en Italie)
*   4. … la procédure officielle du pays (js/procedures/<pays>.js), étape
*      par étape, avec son titre simple et son « en clair »
*      (js/destinations-preinscription.js) ; le texte officiel reste
*      servi mot pour mot, avec sa source. Une étape de type « pièces »
*      devient une liste à cocher ; l'étape de réponse se note vœu par
*      vœu ; les lettres de motivation (sauf au Maroc) se glissent juste
*      avant le premier dépôt.
*   n. Le départ            — le guide des six démarches (js/visa-depart.js)
*
* CE QUI NE CONCERNE PAS TOUT LE MONDE. Deux pays ont plusieurs portes :
* la Turquie (la bourse, ou l'autofinancement) et le Maroc (l'AMCI, ou
* l'UM6P, ou Al Akhawayn). L'étape où la procédure fait choisir devient
* un CHOIX DE VOIE (kind « voie ») ; la voie choisie, les étapes des
* autres voies sortent de la route. Et toute étape de procédure peut
* encore être déclarée « ne me concerne pas » : elle compte alors comme
* réglée, et la route n'attend pas un geste qui n'est pas le sien.
*
* LES ÉTATS vivent dans users/{uid}.dossiersPays.<pays> :
*   { etapes: { <id>: { faite, faitLe, preuve, nonConcerne } }, pieces: { <slug>: true|"non-concerne" }, voie: "<id>" }
* ============================================================
*/

import { VISA_ETAPES } from "./journey-map.js";
import { LIBELLES_PREUVE, ICONES_TYPE, texteConsigne } from "./procedures/vocabulaire.js";
import { destination, enClairDe, questionLangue } from "./destinations-preinscription.js";
import { slugPiece } from "./route-preinscription.js";
import { auPays } from "./pays-grammaire.js";

/** L'étape de réponse ajoutée à une voie qui n'en a pas (UM6P, Al Akhawayn). */
export const ETAPE_REPONSE_ETABLISSEMENT = "reponse_etablissement";

/** Les huit questions de la situation, adaptées au pays (langue, budget). */
export function questionsSituationPays(id) {
const d = destination(id);
if (!d) return [];
const dans = auPays(d.nom);
return [
{ cle: "country", libelle: "Dans quel pays vivez-vous aujourd'hui ?", type: "pays", aide: "C'est de ce pays que partent votre dossier, votre visa et vos démarches." },
{ cle: "nationality", libelle: "Quelle est votre nationalité ?", type: "pays" },
{ cle: "desiredDegree", libelle: `Quel niveau visez-vous ${dans} ?`, type: "choix", options: ["Licence", "Master", "Doctorat"] },
{ cle: "desiredField", libelle: "Dans quel domaine ?", type: "liste", liste: "domaine", exemple: "Commencez à écrire : Informatique, Droit, Médecine…" },
{ cle: "lastDegree", libelle: "Votre dernier diplôme (obtenu ou en cours) ?", type: "texte", exemple: "Baccalauréat S2, Licence 3 Économie…", suggestions: "diplome" },
{ cle: "currentInstitution", libelle: "Dans quel établissement ?", type: "texte", exemple: "Lycée, université ou école" },
questionLangue(id),
{ cle: "budget", libelle: `De combien disposez-vous par mois pour vivre ${dans} ?`, type: "texte", exemple: "Ex. 500 000 F CFA, ou 800 €", suggestions: "budget", aide: "Vous, votre famille ou un garant. Fitz s'en sert à l'étape suivante pour vérifier que le projet tient." }
].filter(Boolean);
}

/** Ce qu'il manque à la situation, en libellés lisibles. */
export function situationCompletePays(id, profile) {
const p = profile || {};
const manquants = questionsSituationPays(id).filter((q) => !String(p[q.cle] || "").trim()).map((q) => q.libelle);
return { pret: manquants.length === 0, manquants };
}

/** Les outils de Fitz que chaque type d'étape emporte. */
const OUTILS_PAR_TYPE = {
pieces: [
{ feature: "compress", href: "compress.html", libelle: "Réduire une pièce au bon poids", icone: "file-archive" },
{ feature: "ai_translate", href: "ai-translate.html", libelle: "Comprendre ou traduire un document", icone: "languages" }
],
soumission: [{ feature: "ai_check", href: "ai-check.html", libelle: "Faire vérifier mon dossier par Fitz", icone: "shield-check", principal: true }],
entretien: [{ feature: "interview_prep", href: "interview-prep.html", libelle: "M'entraîner à l'entretien avec Fitz", icone: "messages-square", principal: true }],
confirmation: [{ feature: "ai_email", href: "ai-email.html", libelle: "Écrire à l'établissement", icone: "mail" }]
};

/** Les pièces d'une étape de procédure, avec un slug stable. */
function piecesDe(etape) {
return ((etape && etape.pieces) || []).map((p) => ({
slug: p.slug || slugPiece(p.nom),
nom: p.nom,
aide: p.aide || "",
tailleMax: p.tailleMax || "",
traduction: p.traduction === true,
legalisation: p.legalisation === true,
etape: etape.id
}));
}

/**
* Les pièces du dossier d'un pays — celles des étapes « pièces » de SA
* route (la voie choisie comprise), cochées ou écartées dans son dossier.
* Lu par ai-check.js pour le contrôle avant dépôt. Dédoublonnées.
*/
export function piecesDuDossierPays({ id, procedure, dossier = {} } = {}) {
const route = construireRoutePays({ id, procedure, dossier });
if (!route) return [];
const vues = new Set();
const pieces = [];
for (const e of route.etapes) {
if (e.kind !== "pieces" || e.nonConcerne) continue;
for (const p of e.pieces) {
if (vues.has(p.slug)) continue;
vues.add(p.slug);
pieces.push(p);
}
}
return pieces;
}

/**
* @param {Object} p
* @param {string} p.id              la destination (« italie »…)
* @param {Object} p.procedure       trouverProcedure({ paysDestination: <nom> })
* @param {Object} p.profile         users/{uid}.profile
* @param {Object|null} p.diagnostic users/{uid}.diagnosticsPays.<id>
* @param {Array}  p.voeux           applications de ce pays
* @param {Object} p.dossier         users/{uid}.dossiersPays.<id>
* @param {Object} p.visaChecklist   users/{uid}.visaChecklist
*/
export function construireRoutePays({ id, procedure = null, profile = {}, diagnostic = null, voeux = [], dossier = {}, visaChecklist = {} } = {}) {

const d = destination(id);
if (!d || !procedure) return null;

const etatEtapes = (dossier && dossier.etapes && typeof dossier.etapes === "object") ? dossier.etapes : {};
const piecesCochees = (dossier && dossier.pieces && typeof dossier.pieces === "object") ? dossier.pieces : {};
const listeVoeux = Array.isArray(voeux) ? voeux : [];
const dans = auPays(d.nom);
const visa = {};
VISA_ETAPES.forEach((v) => { visa[v] = !!(visaChecklist && visaChecklist[v] === true); });
const visaFaites = VISA_ETAPES.filter((v) => visa[v]).length;

const defs = [
{ id: "situation", kind: "situation", icone: "user-round", titre: "Votre situation",
enClair: "Huit réponses, et Fitz sait d'où vous partez et où vous allez. Tout le reste de la route se règle sur elles." },
{ id: "ressources", kind: "diagnostic", icone: "calculator", titre: "Vos ressources",
enClair: `Avant de commencer un dossier, on vérifie que le projet tient financièrement. Fitz compare ce dont vous disposez au seuil exigé ${dans} et au coût de l'année, chiffre par chiffre, avec les sources.`,
outils: [{ feature: "diagnostic_france", href: `diagnostic-pays.html?d=${id}`, libelle: "Faire mon diagnostic avec Fitz", icone: "calculator", principal: true }] },
{ id: "voeux", kind: "voeux", icone: "list-checks", titre: d.plafondVoeux === 1 ? "Choisir votre cours" : "Choisir vos vœux",
enClair: d.plafondVoeux === 1
? "Ici, un seul cours : c'est la règle du pays. Dites l'établissement, la formation et le niveau : Fitz s'occupe du reste, et la route se règle sur ce choix."
: "Un vœu, c'est une formation dans un établissement. Dites simplement l'établissement, la formation et le niveau : Fitz s'occupe du reste." }
];

const depots = new Set(d.etapesDepot || []);
let motivationsPosees = !d.motivations;

// LA VOIE (Turquie, Maroc). Choisie, elle écarte les étapes propres aux
// AUTRES voies ; une étape commune à deux voies reste.
const voies = d.voies || null;
const voieChoisie = voies && dossier && typeof dossier.voie === "string"
? voies.options.find((o) => o.id === dossier.voie) || null
: null;
const horsVoie = new Set();
if (voieChoisie) {
for (const o of voies.options) {
if (o.id === voieChoisie.id) continue;
o.etapes.filter((x) => !voieChoisie.etapes.includes(x)).forEach((x) => horsVoie.add(x));
}
}

// LES ÉTAPES DE LA VOIE CHOISIE VIENNENT JUSTE APRÈS LE CHOIX. La
// procédure du Maroc décrit l'UM6P et Al Akhawayn à la fin, après le
// visa ; suivies dans cet ordre, elles feraient candidater l'étudiant
// après son titre de séjour. On garde l'ordre officiel À L'INTÉRIEUR de
// chaque bloc : avant le choix, la voie, puis ce qui est commun.
let etapesProcedure = procedure.etapes.filter((e) => !horsVoie.has(e.id));
if (voieChoisie) {
const propres = new Set(voieChoisie.etapes);
const iVoie = etapesProcedure.findIndex((e) => e.id === voies.etape);
etapesProcedure = [
...etapesProcedure.slice(0, iVoie + 1).filter((e) => !propres.has(e.id)),
...etapesProcedure.filter((e) => propres.has(e.id)),
...etapesProcedure.slice(iVoie + 1).filter((e) => !propres.has(e.id))
];
}
// Une voie sans étape de réponse (UM6P, Al Akhawayn : l'autorisation de
// l'AMCI n'est pas la leur) reçoit la sienne, juste après son dépôt :
// sans elle, ses vœux ne pourraient jamais être notés admis ou refusés.
const reponsePropre = !!voieChoisie && !etapesProcedure.some((e) => e.id === d.etapeReponses);
const dernierDepot = reponsePropre ? [...etapesProcedure].reverse().find((e) => depots.has(e.id)) : null;

for (const e of etapesProcedure) {
// Les lettres de motivation, vœu par vœu, juste avant le premier dépôt.
if (!motivationsPosees && depots.has(e.id)) {
defs.push({ id: "motivations", kind: "motivations", icone: "pen-line", titre: "Écrire vos lettres de motivation",
enClair: "Chaque établissement veut savoir pourquoi cette formation, pourquoi chez lui, et ce que vous en ferez. Fitz écrit un premier jet avec vous, vœu par vœu. Puis vous le relisez et le déposez." });
motivationsPosees = true;
}
const clair = enClairDe(id, e.id) || {};
const kind = voies && e.id === voies.etape ? "voie"
: e.type === "pieces" && (e.pieces || []).length ? "pieces"
: e.id === d.etapeReponses ? "reponses"
: "procedure";
defs.push({
id: e.id,
kind,
procedure: e.id,
titre: clair.titre || e.titre,
enClair: clair.enClair || "",
outils: (OUTILS_PAR_TYPE[e.type] || []).map((o) => ({ ...o })),
depot: depots.has(e.id)
});
if (dernierDepot && e.id === dernierDepot.id) {
defs.push({ id: ETAPE_REPONSE_ETABLISSEMENT, kind: "reponses", icone: "mail-check", titre: "Noter la réponse de l'établissement",
enClair: "Quand l'établissement vous répond, notez sa réponse ici, vœu par vœu : admis, refusé ou en liste d'attente. La suite de votre route se règle sur elle." });
}
}

defs.push({ id: "depart", kind: "depart", icone: "plane", titre: "Le départ, démarche par démarche",
enClair: "Une fois admis et le visa en main, il reste les démarches du départ : ressources, assurance, logement, billet. Cochez-les une à une ; chacune dit quand la faire, et ce qui fait échouer." });

const etapes = defs.map((def, index) => {

const officielle = def.procedure ? procedure.etapes.find((x) => x.id === def.procedure) : null;
const saisie = etatEtapes[def.id] && typeof etatEtapes[def.id] === "object" ? etatEtapes[def.id] : null;
// L'étape de DÉPÔT exige toujours une preuve : c'est elle qui se déclare
// sur chaque vœu du pays (le statut « déposé » l'exige dans les règles).
let preuveType = officielle ? (officielle.preuve || "aucune") : "aucune";
if (def.depot && preuveType === "aucune") preuveType = "capture";
const nonConcerne = !!(saisie && saisie.nonConcerne === true);
const preuvePresente = preuveType === "aucune" || nonConcerne || !!(saisie && typeof saisie.preuve === "string" && saisie.preuve.trim());
const cochee = !!(saisie && saisie.faite === true);
const pieces = def.kind === "pieces" ? piecesDe(officielle).map((p) => ({ ...p, obtenue: piecesCochees[p.slug] === true, ecartee: piecesCochees[p.slug] === "non-concerne" })) : [];

let faite = false;
let empechement = "";
switch (def.kind) {
case "situation": faite = situationCompletePays(id, profile).pret; break;
case "diagnostic": faite = !!(diagnostic && (diagnostic.etatVerdict || diagnostic.verdict)); break;
case "voeux": faite = listeVoeux.length > 0; break;
case "pieces": faite = nonConcerne || (pieces.length > 0 && pieces.every((p) => p.obtenue || p.ecartee)); break;
case "motivations":
faite = listeVoeux.length > 0 && listeVoeux.every((v) => v.motivation && v.motivation.faite === true);
if (!listeVoeux.length) empechement = "Posez d'abord au moins un vœu (étape 3).";
break;
case "reponses":
faite = nonConcerne || (listeVoeux.length > 0 && listeVoeux.every((v) => ["admise", "refusee", "liste_attente"].includes(v.status)));
if (!listeVoeux.length) empechement = "Posez d'abord au moins un vœu (étape 3).";
break;
case "voie": faite = !!voieChoisie; break;
case "depart": faite = visaFaites === VISA_ETAPES.length; break;
default: faite = (cochee && preuvePresente) || nonConcerne;
}

return {
numero: index + 1,
id: def.id,
kind: def.kind,
titre: def.titre,
enClair: def.enClair,
icone: def.icone || (officielle ? ICONES_TYPE[officielle.type] : "circle"),
faite,
cochee,
nonConcerne,
// Une étape de la procédure peut ne pas concerner l'étudiant ; celles
// de la route, jamais. Ni le choix de voie, ni une étape de DÉPÔT : sans
// dépôt déclaré, ses vœux ne passeraient jamais « déposés », et les
// réponses ne pourraient plus se noter (règles Firestore). Les pays à
// plusieurs portes règlent cela par la voie, pas par ce bouton.
ignorable: !!officielle && def.kind !== "voie" && !def.depot,
depot: !!def.depot,
empechement,
outils: (def.outils || []).map((o) => ({ ...o })),
officielle: officielle ? {
titre: officielle.titre,
consigne: texteConsigne(officielle),
source: officielle.source || "",
verifieLe: officielle.verifieLe || "",
sourceResidence: "",
mention: "",
montant: undefined,
devise: undefined,
// Les pièces d'une étape qui n'est pas une liste à cocher : dites
// quand même, sous le texte, pour qu'on sache quoi apporter.
pieces: def.kind === "pieces" ? [] : piecesDe(officielle)
} : null,
preuve: {
type: preuveType,
libelle: LIBELLES_PREUVE[preuveType] || "",
valeur: (saisie && typeof saisie.preuve === "string") ? saisie.preuve : "",
requise: preuveType !== "aucune" && !nonConcerne
},
echeance: null,
faitLe: (saisie && saisie.faitLe) || null,
pieces,
traduction: def.kind === "pieces" ? { concernees: [], declare: "", reglee: true } : null,
residenceAbsente: false,
voeux: ["voeux", "motivations", "reponses"].includes(def.kind) ? listeVoeux : [],
visa: def.kind === "depart" ? { etat: visa, faites: visaFaites, total: VISA_ETAPES.length } : null,
voie: def.kind === "voie" ? {
question: voies.question,
options: voies.options.map((o) => ({ id: o.id, libelle: o.libelle, aide: o.aide || "" })),
choisie: voieChoisie ? voieChoisie.id : ""
} : null
};

});

const courante = etapes.find((e) => !e.faite) || null;
etapes.forEach((e) => {
e.etat = e.faite ? "faite" : (courante && e.id === courante.id) ? "courante" : "a-venir";
});
const faites = etapes.filter((e) => e.faite).length;

return {
destination: id,
etapes,
courante,
faites,
total: etapes.length,
pourcentage: Math.round((faites / etapes.length) * 100),
residence: "",
residenceDocumentee: true,
portail: procedure.portail || { nom: d.nom, url: "" },
voie: voieChoisie ? voieChoisie.id : "",
avertissementsVoeux: listeVoeux.length > d.plafondVoeux ? [`${d.nom} : ${d.plafondVoeux} vœu${d.plafondVoeux > 1 ? "x" : ""} au maximum, vous en avez ${listeVoeux.length}.`] : [],
avertissementProcedure: null
};

}
