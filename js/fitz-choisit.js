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

import { STATUTS_DEPOSES, STATUTS_REPONSE } from "./journey-map.js";
import { lireParcours } from "./parcours.js";
import { languesParlees } from "./niveaux-langue.js";

// Ce que Fitz doit savoir AVANT de choisir. Le moteur tolère les
// champs absents ; c'est la DÉCISION de remplir qui attend.
export const CHAMPS_PROFIL_REQUIS = [
{ cle: "nationality", libelle: "votre nationalité" },
{ cle: "desiredDegree", libelle: "le niveau visé" },
{ cle: "desiredField", libelle: "votre domaine" },
// Lot R16 : ce champ porte sa propre règle, parce qu'un tableau non
// vide ne suffit plus. « Je ne parle pas cette langue » s'enregistre
// (level "aucun", js/niveaux-langue.js) : un profil qui n'aurait que
// des « non » aurait un tableau plein et pas une langue.
{ cle: "languages", libelle: "au moins une langue", estRenseigne: (v) => languesParlees(v).length > 0 }
];

function renseigne(valeur) {
if (Array.isArray(valeur)) return valeur.length > 0;
return typeof valeur === "string" ? valeur.trim() !== "" : valeur != null;
}

/** La règle du champ quand il en porte une, la règle générale sinon. */
function champRenseigne(champ, profil) {
return typeof champ.estRenseigne === "function" ? !!champ.estRenseigne(profil[champ.cle]) : renseigne(profil[champ.cle]);
}

/**
* { pret, manquants } — `pret` vaut true quand la nationalité, le
* niveau visé, le domaine et au moins une langue sont là.
*/
export function profilPretPourFitz(profile) {
const p = profile || {};
const manquants = CHAMPS_PROFIL_REQUIS.filter((c) => !champRenseigne(c, p)).map((c) => c.libelle);
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
// LOT P2 (2026-09-19) — CE QUI ÉTAIT CALCULÉ PUIS JETÉ.
// retenirOpportunites() rend le pays, la raison du choix et l'état de
// la date depuis toujours. Cette fonction ne les écrivait pas : la
// carte d'acceptation demandait donc un engagement DÉFINITIF (deux
// refus par place, pas plus) sur un nom d'établissement seul, sans
// dire ni où il se trouve ni pourquoi Fitz l'a retenu.
// Les trois champs sont informatifs : ils ne font pas partie de
// CHAMPS_IDENTITE et firestore.rules ne les contraint pas.
country: rec.country || "",
raisonFitz: (rec.reasons && rec.reasons[0]) || "",
dateConfirmee: rec.dateConfirmee === true,
jours: typeof rec.jours === "number" ? rec.jours : null,
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
// Lot ACCEPTATION : une carte NEUVE n'a jamais été refusée. L'appelant
// qui REMPLACE une carte réécrit ensuite le compteur de la place
// (refus + 1 pour un refus, refus inchangé pour une remplaçante) :
// sans cela, chaque remplacement remettrait le compteur à zéro.
refus: 0,
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

// ==========================================================
// LOT ACCEPTATION (2026-09-11) — l'étudiant accepte le choix de Fitz
// ==========================================================
// Décisions de Charles : accepter est définitif ; deux refus par place,
// à la troisième proposition Fitz tranche ; les outils (lettre, e-mail,
// vérification) ne s'ouvrent qu'APRÈS l'acceptation ; les N
// candidatures d'une formule en vente sont un TOTAL — une décision
// reçue ne libère plus de place, c'est Charles qui décide la suite.
//
// Tout ce qui suit est PUR et partagé par la carte (applications.js),
// les trois outils (ai-letter, ai-email, ai-check) et les tests.

/** Deux refus par place, pas plus : à la 3ᵉ proposition, Fitz tranche. */
export const REFUS_MAX = 2;

/**
* Le plafond de remplissage quand la formule n'a pas de quota
* (Signature, retirée de la vente, quota Infinity) : Fitz remplit
* 12 places, jamais « l'infini ».
*/
export const PLACES_SANS_PLAFOND = 12;

/** Le nombre de places que Fitz remplit pour un quota donné. */
export function placesAFitz(quota) {
if (quota === Infinity) return PLACES_SANS_PLAFOND;
return Number.isFinite(quota) && quota > 0 ? quota : 0;
}

/** Les formules bourses EN VENTE : jamais de suppression d'une carte catalogue. */
export const FORMULES_BOURSE_EN_VENTE = ["premier-dossier", "essentiel-4", "conseiller-6"];

/**
* Les champs du CHOIX : ce qui dit QUELLE université et QUELLE bourse.
* `portalUrl` et `universityWebsite` sont des coordonnées, pas un choix.
*/
export const CHAMPS_CHOIX = ["programId", "scholarshipId", "universityId", "university", "scholarship"];

/**
* Une CARTE CATALOGUE : une candidature du parcours bourses qui porte un
* `programId`. Toutes les cartes de Fitz en sont ; une carte ancienne le
* devient quand rattraperLiaisons() lui écrit sa clé.
*/
export function carteCatalogue(app) {
if (!app || app.track === "preinscription") return false;
return typeof app.programId === "string" && app.programId !== "";
}

/**
* Une CARTE DE FITZ : toute carte bourse que Fitz a proposée — carte
* catalogue (programId) OU créneau rempli par Fitz (`isRecommendation`).
*
* A4 (campagne du 2026-09-18, décision de Charles le 19) : douze
* recommandations semées sans programId (retenue sans programme précis)
* ouvraient TOUS les outils, par l'exception « carte sans programId »
* pensée pour les cartes anciennes saisies à la main. Or firestore.rules
* dit déjà qu'une carte bourse naît PROPOSÉE ; c'est le client qui ne le
* tenait que pour les cartes à programId. Désormais l'acceptation
* s'applique à tout ce que Fitz propose ; les cartes anciennes (ni
* programId, ni isRecommendation) gardent leur comportement.
*/
export function carteDeFitz(app) {
if (!app || app.track === "preinscription") return false;
return carteCatalogue(app) || app.isRecommendation === true;
}

/** Le nombre de refus consommés sur cette place (une carte ancienne se lit 0). */
export function refusConsommes(app) {
const n = app && Number.isInteger(app.refus) ? app.refus : 0;
return Math.max(0, n);
}

/** Les refus qu'il reste à l'étudiant pour cette place : 2, 1, 0. */
export function refusRestants(app) {
return Math.max(0, REFUS_MAX - refusConsommes(app));
}

/**
* L'état d'une carte catalogue, ou null pour une carte qui n'en est pas
* (préinscription, carte ancienne hors catalogue) :
*   proposee   pas de accepteeLe, refus < 2
*   finale     pas de accepteeLe, refus = 2 — Fitz a fait sa proposition finale
*   acceptee   accepteeLe posé — ou une carte ancienne DÉJÀ déposée sans
*              accepteeLe (donnée d'avant le lot) : elle s'affiche acceptée,
*              sans date (`sansDate`).
*/
export function etatCarte(app) {
if (!carteDeFitz(app)) return null;
if (app.accepteeLe) return { code: "acceptee", sansDate: false };
if (STATUTS_DEPOSES.includes(app.status)) return { code: "acceptee", sansDate: true };
return { code: refusConsommes(app) >= REFUS_MAX ? "finale" : "proposee", sansDate: false };
}

/** Vrai quand la carte est acceptée (au sens de etatCarte). */
export function estAcceptee(app) {
const e = etatCarte(app);
return !!e && e.code === "acceptee";
}

/**
* L'étudiant peut-il REFUSER cette carte et demander une autre
* université ? Une carte catalogue proposée, avec des refus restants.
* Une carte bourse ancienne hors catalogue garde le comportement
* d'avant : refusable tant qu'elle n'est pas déposée.
*/
export function peutRefuser(app) {
if (!app || app.track === "preinscription") return false;
if (!carteCatalogue(app)) return !STATUTS_DEPOSES.includes(app.status);
return etatCarte(app).code === "proposee";
}

/**
* L'étudiant peut-il accepter cette carte ? Une carte catalogue
* proposée ou en proposition finale.
*/
export function peutAccepter(app) {
const e = etatCarte(app);
return !!e && e.code !== "acceptee";
}

/**
* Les outils de Fitz (lettre, e-mail, vérification) sur cette
* candidature : ouverts pour une préinscription, une carte ancienne
* saisie à la main (ni programId, ni isRecommendation), et une carte de
* Fitz ACCEPTÉE. Fermés sur une carte proposée — « Acceptez cette
* université pour commencer votre dossier ». (A4, 2026-09-19 : une
* recommandation de Fitz sans programId n'ouvre plus rien avant
* l'acceptation.)
*/
export function outilsOuverts(app) {
if (!app) return false;
if (!carteDeFitz(app)) return true;
return estAcceptee(app);
}

/**
* Les candidatures qu'un outil de Fitz PROPOSE dans « Candidature
* concernée » : les bourses acceptées, les préinscriptions, les cartes
* sans programId.
*
* ET CELLES DU PARCOURS OÙ L'ON SE TROUVE, SEULEMENT (2026-09-17).
* Mesuré en ligne : à l'étape 9 de la route — « Vérifier, puis
* soumettre » votre dossier Études en France — le sélecteur proposait
* « Mastercard Foundation Scholars Program » et « Bourses de théologie
* de la Fondation Diyanet ». Deux bourses, dans un outil ouvert depuis
* la préinscription, à un étudiant qui vérifie un dossier de
* préinscription. C'est exactement la confusion que la refonte doit
* supprimer : l'espace où l'on est EST le contexte, et la barre haute
* suffit à passer à l'autre en un clic.
*
* `parcours` absent ⇒ aucun filtre (l'ancien comportement, encore utile
* aux pages qui n'ont pas d'espace : le suivi de candidatures).
* `garder` est l'identifiant d'une candidature à ne JAMAIS retirer —
* celle que l'URL a nommée (`?applicationId=`) : un lien ancien qui
* désigne l'autre parcours doit rester sélectionnable, sinon la page
* afficherait un sélecteur vide en prétendant l'avoir choisie.
*/
export function candidaturesPourOutils(applications, parcours = "", garder = "") {
const liste = (applications || []).filter((a) => outilsOuverts(a));
if (!parcours) return liste;
return liste.filter((a) => lireParcours(a) === parcours || (garder && a.id === garder));
}

/**
* Un outil de Fitz tourne-t-il sans candidature dans ce parcours ?
* Plus de mode libre pour une bourse : dans le parcours bourses, la
* lettre, l'e-mail et la vérification exigent une candidature acceptée.
* Le mode libre ne reste qu'en préinscription (vœux saisis à la main).
*/
export function modeLibreAutorise(parcours) {
return parcours === "preinscription";
}

/**
* Les statuts qu'une carte peut prendre dans le formulaire.
*   - carte catalogue proposée : jamais un statut déposé — on accepte
*     d'abord (sinon un étudiant déposerait pour ouvrir ses outils, puis
*     repasserait « en cours », puis refuserait) ;
*   - carte catalogue déposée : jamais un retour vers un statut non
*     déposé — une erreur se corrige par « Signaler un problème » ;
*   - tout le reste : inchangé.
*/
export function statutsAutorises(app, tous) {
const liste = Array.isArray(tous) ? tous : [];
if (!carteDeFitz(app)) return liste;
if (!estAcceptee(app)) return liste.filter((s) => !STATUTS_DEPOSES.includes(s));
if (STATUTS_DEPOSES.includes(app.status)) return liste.filter((s) => STATUTS_DEPOSES.includes(s));
return liste;
}

/**
* L'étudiant peut-il supprimer cette candidature ?
*   - vœu pre-N, carte sans programId : comportement d'avant (une bourse
*     ancienne se supprime après le dépôt) ;
*   - formule en vente (premier-dossier, essentiel-4, conseiller-6) :
*     JAMAIS une carte catalogue — elle reste dans « Mes candidatures »,
*     c'est l'historique du dossier ;
*   - formule retirée de la vente : une carte acceptée dans un statut de
*     réponse, et elle seule (sa durée limite encore le recyclage).
*/
export function peutSupprimer(app, planId) {
if (!app) return false;
if (app.track === "preinscription") return true;
if (!carteCatalogue(app)) return STATUTS_DEPOSES.includes(app.status);
if (FORMULES_BOURSE_EN_VENTE.includes(planId)) return false;
return estAcceptee(app) && STATUTS_REPONSE.includes(app.status);
}

/**
* L'exception légitime : l'organisme ferme la bourse. Une carte
* catalogue NON DÉPOSÉE (proposée ou acceptée) dont la bourse passe à
* `isActive: false`, ou dont le programme (ou la bourse) a disparu du
* catalogue. Le client lit la fermeture dans l'instantané statique, qui
* garde une bourse fermée AVEC `isActive: false` ; une bourse absente
* est traitée de même. Une carte déjà déposée ne se remplace jamais.
*
* @param {Object} app
* @param {{ programme?: Object|null, bourse?: Object|null }} lecture
*   ce que l'index du catalogue connaît de cette carte
*/
export function bourseFermee(app, { programme = null, bourse = null } = {}) {
if (!carteCatalogue(app)) return false;
if (STATUTS_DEPOSES.includes(app.status)) return false;
if (!programme || !bourse) return true;
return bourse.isActive === false;
}

/**
* La ligne d'état sous « Mes candidatures » (parcours bourses).
* { code, texte, lienProfil }
*   reponses  les N cartes ont toutes reçu une réponse : la suite, c'est
*             l'équipe qui la décide ;
*   complet   toutes les places sont remplies ;
*   profil    Fitz ne connaît pas assez l'étudiant pour choisir ;
*   aucune    aucune université compatible restante.
* Singulier quand le quota vaut 1 (Premier Dossier).
*/
export function etatChoixFitz({ quota, nombre, profilPret, reponses = 0 }) {
if (!Number.isFinite(quota) || quota <= 0) return null;
const pluriel = quota > 1;
if (nombre >= quota && reponses >= quota) {
return { code: "reponses", texte: "Toutes vos candidatures ont reçu une réponse. L'équipe FitzUniverse vous indiquera la suite ici.", lienProfil: false };
}
if (nombre >= quota) return { code: "complet", texte: pluriel ? `Fitz a choisi vos ${quota} universités` : "Fitz a choisi votre université", lienProfil: false };
if (!profilPret) return { code: "profil", texte: pluriel ? `Complétez votre profil : Fitz choisira vos ${quota} universités dès qu'il vous connaît` : "Complétez votre profil : Fitz choisira votre université dès qu'il vous connaît", lienProfil: true };
return { code: "aucune", texte: "Fitz n'a pas trouvé d'autre université compatible pour l'instant", lienProfil: true };
}

// ==========================================================
// L'ADMIN : C'EST CHARLES QUI DÉCIDE LA SUITE (partie 6)
// ==========================================================
// Le décompte par statut des cartes bourses (« 2 admises · 1 refusée ·
// 1 en liste d'attente »), et `toutesRepondues` quand les N cartes de
// la formule sont dans un statut de réponse — le signal pour décider.
const LIBELLES_DECOMPTE = {
admise: ["admise", "admises"],
refusee: ["refusée", "refusées"],
liste_attente: ["en liste d'attente", "en liste d'attente"],
reponse_recue: ["réponse reçue", "réponses reçues"],
deposee: ["déposée", "déposées"],
en_attente: ["en attente", "en attente"],
en_cours: ["en préparation", "en préparation"],
a_preparer: ["à préparer", "à préparer"]
};

const ORDRE_DECOMPTE = ["admise", "refusee", "liste_attente", "reponse_recue", "deposee", "en_attente", "en_cours", "a_preparer"];

export function decompteBourses(applications, quota) {
const bourses = (applications || []).filter((a) => a && a.track !== "preinscription");
const parStatut = new Map();
for (const a of bourses) parStatut.set(a.status, (parStatut.get(a.status) || 0) + 1);
const ligne = ORDRE_DECOMPTE
.filter((s) => parStatut.has(s))
.map((s) => `${parStatut.get(s)} ${LIBELLES_DECOMPTE[s][parStatut.get(s) > 1 ? 1 : 0]}`)
.join(" · ");
const repondues = bourses.filter((a) => STATUTS_REPONSE.includes(a.status)).length;
const toutesRepondues = Number.isFinite(quota) && quota > 0 && bourses.length >= quota && repondues >= quota;
return { ligne, repondues, toutesRepondues };
}

// ==========================================================
// CHAQUE FORMULE MÈNE EXACTEMENT À SA PROCHAINE ÉTAPE (partie 3)
// ==========================================================
// Après le paiement (payment.js), les trois formules bourses en vente :
// profil pas prêt → profile.html?pour=fitz ; profil prêt →
// applications.html (les propositions à accepter). « Prêt » se lit avec
// profilPretPourFitz, la même fonction que le remplissage — jamais une
// deuxième règle. Un compte créé au paiement a un profil vide : il ira
// au profil, c'est voulu. `?action=new` ne fait plus rien côté bourses.
export const CIBLES_APRES_PAIEMENT = {
fitzExpress: "ai-chat.html",
"diagnostic-france": "diagnostic-france.html",
"dossier-france": "espace-preinscription.html?action=new",
"dossier-france-conseiller": "espace-preinscription.html?action=new"
};

export const CIBLE_PROFIL_POUR_FITZ = "profile.html?pour=fitz";
export const CIBLE_CANDIDATURES = "applications.html";

export function cibleApresPaiement(planId, profile) {
if (FORMULES_BOURSE_EN_VENTE.includes(planId)) {
return profilPretPourFitz(profile).pret ? CIBLE_CANDIDATURES : CIBLE_PROFIL_POUR_FITZ;
}
// Le repli vise l'espace bourse : les seules formules qui passent ici
// sans être listées sont les dépréciées, toutes des offres bourse.
return CIBLES_APRES_PAIEMENT[planId] || "espace-bourse.html";
}

// La phrase de la règle, dite AVANT l'achat (offers, payment) et dans
// l'espace. Un seul littéral, jamais reformulé. Comme il n'y a jamais de
// remboursement, elle dit les limites AVANT l'achat (lot ACCEPTATION).
export const PHRASE_REGLE = "Vous ne choisissez pas vos universités : Fitz les choisit parmi celles où votre profil a le plus de chances. Une proposition ne vous convient pas ? Fitz vous en propose une autre, jusqu'à deux fois par place. Une fois acceptée, une université ne se change plus.";
