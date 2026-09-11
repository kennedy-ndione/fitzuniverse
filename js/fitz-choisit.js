/**
* ==========================================================
* js/fitz-choisit.js — C'EST FITZ QUI CHOISIT (lot FITZ-CHOISIT, 2026-09-11)
* ==========================================================
* Décisions de Charles (2026-09-11), le cadre :
*  1. l'étudiant ne choisit pas ses universités : FitzUniverse propose
*     celles où il a le plus de chances ;
*  2. une proposition ne convient pas ? il en demande une autre — Fitz
*     propose l'université compatible suivante, jamais de choix libre ;
*  3. le lien « hors catalogue » disparaît du parcours bourses ;
*  4. les N candidatures d'une formule se travaillent EN MÊME TEMPS.
*
* Ce module est PUR (aucun DOM, aucun Firestore) : il porte les deux
* décisions que le remplissage (seedRecommendedSlots) et le remplacement
* (refuserEtRemplacer) partagent, pour qu'elles ne divergent plus — le
* bug du 2026-09-11 (le remplacement gardait scholarshipId/programId de
* l'ancienne bourse) venait de deux constructions de carte écrites à
* la main, à deux endroits.
* ==========================================================
*/

// Ce que Fitz doit savoir AVANT de choisir. Le moteur tolère les
// champs absents ; c'est la DÉCISION de remplir qui attend.
export const CHAMPS_PROFIL_REQUIS = [
{ cle: "nationality", libelle: "votre nationalité" },
{ cle: "desiredDegree", libelle: "le niveau visé" },
{ cle: "desiredField", libelle: "votre domaine" },
{ cle: "languages", libelle: "au moins une langue" }
];

function renseigne(valeur) {
if (Array.isArray(valeur)) return valeur.length > 0;
return typeof valeur === "string" ? valeur.trim() !== "" : valeur != null;
}

/**
* { pret, manquants } — `pret` vaut true quand la nationalité, le
* niveau visé, le domaine et au moins une langue sont là.
*/
export function profilPretPourFitz(profile) {
const p = profile || {};
const manquants = CHAMPS_PROFIL_REQUIS.filter((c) => !renseigne(p[c.cle])).map((c) => c.libelle);
return { pret: manquants.length === 0, manquants };
}

// Les identifiants d'université qu'un choix de Fitz doit éviter : celles
// déjà occupées par un autre créneau, et celles que l'étudiant a
// refusées (users/{uid}.universitesRefusees).
export function universitesAEviter({ applications = [], universitesRefusees = [], universitesParNom = new Map() } = {}) {
const ids = new Set();
for (const a of applications) {
if (a && a.universityId) ids.add(a.universityId);
// Les candidatures anciennes n'ont qu'un nom : on le rapproche.
else if (a && a.university) {
const id = universitesParNom.get(String(a.university).trim().toLowerCase());
if (id) ids.add(id);
}
}
for (const id of universitesRefusees || []) if (id) ids.add(id);
return ids;
}

/**
* LA carte que Fitz écrit — remplissage ET remplacement, même fonction.
* `rec` est une retenue de retenirOpportunites() ; `portalUrl` est résolu
* par l'appelant (la carte des portails est privée, js/portails.js).
* Une carte NEUVE : statut « à préparer », date remise à zéro, dossier
* (checklist) vide, aucune lettre ni e-mail hérités — l'ancienne bourse
* ne laisse rien derrière elle.
*/
export function carteFitz(rec, { portalUrl = "", nextCheckDate = null, reminderFrequency = 14 } = {}) {
return {
university: rec.universityName || "",
scholarship: rec.scholarshipTitle || "",
scholarshipId: rec.scholarshipId || null,
programId: rec.programId || null,
universityId: rec.universityId || null,
portalUrl: portalUrl || "",
universityWebsite: rec.universityWebsite || "",
status: "a_preparer",
track: "bourse",
deadline: null,
reminderFrequency,
notes: "",
checklist: [],
generatedLetter: null,
generatedEmail: null,
premiumProtected: false,
isRecommendation: true,
nextCheckDate
};
}

// Les champs d'identité d'une candidature bourse : ceux que seul Fitz
// écrit (lecture seule dans le formulaire, cohérence catalogue exigée
// par firestore.rules).
export const CHAMPS_IDENTITE = ["university", "scholarship", "scholarshipId", "programId", "universityId", "portalUrl", "universityWebsite"];

/** Une candidature bourse dont l'identité vient du catalogue (donc verrouillée). */
export function identiteVerrouillee(app) {
if (!app) return false;
if (app.track === "preinscription") return false;
return !!(app.programId || app.scholarshipId || app.isRecommendation);
}

/**
* La ligne d'état sous « Mes candidatures » (parcours bourses).
* { code, texte, lienProfil }
*/
export function etatChoixFitz({ quota, nombre, profilPret }) {
if (!Number.isFinite(quota) || quota <= 0) return null;
if (nombre >= quota) return { code: "complet", texte: `Fitz a choisi vos ${quota} universités`, lienProfil: false };
if (!profilPret) return { code: "profil", texte: `Complétez votre profil : Fitz choisira vos ${quota} universités dès qu'il vous connaît`, lienProfil: true };
return { code: "aucune", texte: "Fitz n'a pas trouvé d'autre université compatible pour l'instant", lienProfil: true };
}

// La phrase de la règle, dite AVANT l'achat (offers, payment) et dans
// l'espace. Un seul littéral, jamais reformulé.
export const PHRASE_REGLE = "Vous ne choisissez pas vos universités : Fitz les choisit parmi celles où votre profil a le plus de chances. Une proposition ne vous convient pas ? Fitz vous en propose une autre.";
