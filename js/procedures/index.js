/**
* ============================================================
* FitzUniverse — les procédures de portail connues (lot E2, 2026-09-07)
* ============================================================
*
* Un module pur par couple destination × résidence (js/procedures/
* <destination>-<residence>.js), et ici l'index : trouverProcedure()
* rend la procédure qui correspond à une candidature, ou null.
*
* Une procédure ne concerne que la PRÉINSCRIPTION (js/parcours.js) : le
* parcours bourse n'en reçoit aucune, même quand l'université est sur
* Études en France — c'est js/application-journey.js qui tient cette
* règle, pas ce fichier, qui ne connaît que des pays et des portails.
*
* Aucun DOM, aucun Firestore.
* ============================================================
*/

import { PROCEDURE_FRANCE_SENEGAL } from "./france-senegal.js";
import { FIABILITE, TYPES_ETAPE, TYPES_PREUVE } from "./vocabulaire.js";

export const PROCEDURES = [PROCEDURE_FRANCE_SENEGAL];

function normaliser(texte) {
return String(texte || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

// Quelques graphies du même pays de résidence, telles qu'un profil peut
// les porter (profile.originCountry est un champ libre).
const ALIAS_PAYS = {
senegal: ["senegal", "sn", "republique du senegal"],
france: ["france", "fr"]
};

function memePays(a, b) {
const na = normaliser(a), nb = normaliser(b);
if (!na || !nb) return false;
if (na === nb) return true;
for (const alias of Object.values(ALIAS_PAYS)) {
if (alias.includes(na) && alias.includes(nb)) return true;
}
return false;
}

/**
* La procédure d'une candidature, ou null.
* @param {{paysDestination?:string, portailUrl?:string, paysResidence?:string}} p
*   La destination se reconnaît par le pays de l'université OU par
*   l'URL du portail (le motif de la procédure) ; la résidence est
*   celle du profil de l'étudiant.
*/
export function trouverProcedure({ paysDestination = "", portailUrl = "", paysResidence = "" } = {}) {
for (const procedure of PROCEDURES) {
if (!memePays(procedure.paysResidence, paysResidence)) continue;
const parPays = memePays(procedure.paysDestination, paysDestination);
const parPortail = !!portailUrl && new RegExp(procedure.portail.motif, "i").test(String(portailUrl));
if (parPays || parPortail) return procedure;
}
return null;
}

/** Vrai si une URL de portail appartient à une procédure connue (sans regarder la résidence). */
export function portailDocumente(portailUrl) {
return PROCEDURES.some((p) => !!portailUrl && new RegExp(p.portail.motif, "i").test(String(portailUrl)));
}

/** Les étapes encore « à confirmer » d'une procédure. */
export function etapesAConfirmer(procedure) {
return ((procedure && procedure.etapes) || []).filter((e) => e.fiabilite === "a_confirmer");
}

/**
* Le code de procédure qu'un pays MÉRITE : "documentee" seulement quand
* une procédure existe ET qu'aucune étape n'est "a_confirmer". Sinon,
* le code déclaré du pays (js/pays-preinscription.js). Aujourd'hui la
* France reste "en_cours".
*/
export function codeProcedurePour(pays, procedure) {
if (!procedure || !Array.isArray(procedure.etapes) || !procedure.etapes.length) return pays && pays.procedure;
return etapesAConfirmer(procedure).length === 0 ? "documentee" : (pays && pays.procedure) || "en_cours";
}

/**
* Le libellé honnête d'un pays dont la procédure est documentée depuis
* les sources publiques : « procédure documentée depuis les sources
* publiques ; N étapes à confirmer ». Sans procédure : "".
*/
export function libelleProcedureDocumentee(procedure) {
if (!procedure) return "";
const n = etapesAConfirmer(procedure).length;
if (n === 0) return "Procédure de portail documentée, accompagnée pas à pas";
return `Procédure documentée depuis les sources publiques ; ${n} étape${n > 1 ? "s" : ""} à confirmer`;
}

/**
* Vérifie la forme d'une procédure : vocabulaire fermé, source + date
* sur chaque étape, prérequis existants, aucun cycle. Rend la liste des
* défauts (vide = valide). Utilisé par les tests, et utilisable par un
* script de contrôle.
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
return defauts;
}
