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
import { lireParcours, PAYS_PREINSCRIPTION } from "./parcours.js";
import { construireRoute, situationComplete, PORTAIL_ETUDES_EN_FRANCE } from "./route-preinscription.js";

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

/**
* LA ROUTE, QUAND LE BLOCAGE VIENT D'UNE ÉTAPE DE LA ROUTE
* (lot R9, 2026-09-17).
*
* CE QUI S'EST PASSÉ : la route pose « Bloqué ? Demandez à Fitz » sous
* CHACUNE de ses quinze étapes, avec `?bloc=quoi_faire&etape=<id>`.
* C'est le seul recours de l'étudiant à chaque étape. Or Fitz arrivait
* AVEUGLE : `quoi_faire` ignorait `etape` et rendait la prochaine action
* du tableau de bord, et `etape` cherchait dans `c.etapes` — les étapes
* d'UNE candidature, construites seulement quand l'URL porte `?app=`,
* que la route ne passe jamais. Un étudiant coincé à l'étape 9 devant
* son numéro de dossier s'entendait donc parler de son profil.
*
* Ce module construit maintenant LA MÊME ROUTE que la page, avec LA
* MÊME fonction (`construireRoute`) et les mêmes entrées — c'est la
* règle 1 du module de recours : jamais une seconde copie de la règle.
* Fitz et la page ne peuvent pas se contredire, par construction.
*
* Deux enrichissements, faits ICI et non dans js/fitz-recours.js, qui
* doit rester sans dépendance : le total des étapes (pour dire « 9 sur
* 15 ») et, pour l'étape 1, les questions encore sans réponse — que
* seule `situationComplete` sait nommer. js/fitz-recours.js lit des
* données plates ; importer la route depuis lui ajouterait 75 Ko à
* toutes les pages qui posent le bouton, l'espace bourse compris.
*/
const surLaRoute = ctx.espace === "preinscription" || (app && lireParcours(app) === "preinscription");
let route = null;
let etapeRoute = null;

if (blocage.etape && surLaRoute) {
try {
const residence = profile.country || profile.originCountry || "";
route = construireRoute({
procedure: trouverProcedure({ paysDestination: PAYS_PREINSCRIPTION, portailUrl: PORTAIL_ETUDES_EN_FRANCE, paysResidence: residence }),
profile,
diagnostic: (ctx.userData && ctx.userData.diagnosticFrance) || null,
voeux: applications.filter((a) => lireParcours(a) === "preinscription"),
dossier: (ctx.userData && ctx.userData.dossierFrance) || {},
visaChecklist: (ctx.userData && ctx.userData.visaChecklist) || {},
aujourdhui
});
const trouvee = route.etapes.find((e) => e.id === blocage.etape) || null;
if (trouvee) {
// `total` et `courant` : pour que Fitz puisse dire « étape 9 sur 15 »
// et, si l'étudiant demande une étape qui vient plus loin, où il en
// est réellement. `manquants` : seule `situationComplete` sait nommer
// les questions sans réponse de l'étape 1.
etapeRoute = {
...trouvee,
total: route.total,
courant: route.courante ? { numero: route.courante.numero, titre: route.courante.titre } : null
};
if (trouvee.kind === "situation") etapeRoute.manquants = situationComplete(profile).manquants;
}
} catch (error) {
// Une route qu'on ne peut pas construire ne doit pas fermer le chat :
// Fitz retombe sur la prochaine action, comme avant ce lot.
console.warn("Contexte de blocage sans la route :", error);
route = null;
etapeRoute = null;
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
route,
etapeRoute,
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
