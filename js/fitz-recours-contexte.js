/**
* ============================================================
* FitzUniverse — le contexte d'un blocage, assemblé dans le navigateur
* (lot FITZ-RECOURS, 2026-09-10)
* ============================================================
*
* js/fitz-recours.js est PUR et attend un contexte : la candidature, ses
* étapes qualifiées, sa procédure de portail, la bourse du catalogue, la
* formule du compte. Ce module l'assemble depuis les MÊMES sources que
* les pages — computeJourneySteps, trouverProcedure, le catalogue — pour
* que Fitz et la page lisent la même chose. Il ne calcule rien lui-même.
*
* Aucune écriture Firestore ici : le journal des blocages est dans
* js/fitz-recours-journal.js.
* ============================================================
*/

import { computeJourneySteps } from "./application-journey.js";
import { trouverProcedure } from "./procedures/index.js";
import { documentDuCatalogue } from "./catalog-data.js";
import { calculateAiScore } from "./profile-score.js";
import { lireParcours } from "./parcours.js";

/**
* @param {Object} ctx  — la session du shell (bootstrapShell) : profile, planId,
*                        planPreinscriptionId, featureFlags, testerAccess, hasFitzExpress, espace
* @param {Object} blocage — sortie de lireBlocage()
* @param {Array}  applications — les candidatures de l'étudiant (documents Firestore normalisés)
*/
export async function contexteDeBlocage(ctx, blocage, applications = []) {

const profile = ctx.profile || {};
const profileScore = calculateAiScore(profile);
const aujourdhui = new Date();

const app = blocage.app ? applications.find((a) => a.id === blocage.app) || null : null;

// La procédure de portail : préinscription seulement, même clé que
// applications.js (procedurePour) — destination, portail, résidence.
let uni = null;
let bourse = null;

if (app) {
try {
if (app.universityId) uni = await documentDuCatalogue("universities", app.universityId) || null;
if (app.scholarshipId) bourse = await documentDuCatalogue("scholarships", app.scholarshipId) || null;
} catch (error) {
console.warn("Contexte de blocage sans catalogue :", error);
}
}

const procedure = app && lireParcours(app) === "preinscription"
? trouverProcedure({
paysDestination: (uni && uni.country) || app.country || "",
portailUrl: app.portalUrl || (uni && uni.applicationPortalUrl) || "",
paysResidence: profile.originCountry || profile.country || ""
})
: null;

const etapesDe = (a) => computeJourneySteps(a, {
profileScore,
procedure: lireParcours(a) === "preinscription" ? procedure : null,
aujourdhui
});

// Les fiches de documents (114 Ko) : chargées seulement pour le
// blocage qui les lit — jamais sur les autres pages (lot PEIGNE-FIN).
let fichesDocuments = [];
if (blocage.code === "documents") {
try { ({ DOCUMENTS: fichesDocuments } = await import("./documents-data.js")); } catch (e) { fichesDocuments = []; }
}

return {
app,
bourse,
procedure,
fichesDocuments,
etapes: app ? etapesDe(app) : [],
// Toutes les candidatures, avec leurs étapes : c'est ce que
// prochaineAction() lit sur le tableau de bord — même entrée, même
// sortie (test anti-divergence).
applications: applications.map((a) => ({ ...a, etapes: etapesDe(a) })),
profile,
profileScore,
parcours: app ? lireParcours(app) : (ctx.espace === "preinscription" ? "preinscription" : "bourse"),
planId: ctx.planId || "gratuit",
planPreinscriptionId: ctx.planPreinscriptionId || "",
featureFlags: ctx.featureFlags,
testerAccess: ctx.testerAccess === true,
hasFitzExpress: ctx.hasFitzExpress === true,
aujourdhui
};

}
