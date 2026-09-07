/**
* ============================================================
* FitzUniverse — la prochaine action
* ============================================================
*
* « Fais en sorte que l'espace étudiant soit en mesure de guider les
* étudiants dans leurs dépôts de candidatures solides et efficaces. »
*
* CE QUI MANQUAIT
* ---------------
* L'espace savait déjà dire OÙ EN EST une candidature :
* js/application-journey.js calcule ses cinq étapes à partir des
* données réelles, et aucune ne peut s'afficher faite sans l'être.
*
* Il ne savait pas dire QUOI FAIRE ENSUITE. Le tableau de bord
* affichait quatre cartes de conseil de poids égal — « complétez
* votre profil », « préparez vos documents », « découvrez vos
* opportunités », « conseil Fitz » — dans un ordre fixe. C'est un
* menu, pas un accompagnement. Un étudiant à quatre jours d'une date
* limite y voyait la même chose qu'un étudiant qui vient de
* s'inscrire.
*
* LE VRAI DÉFAUT : L'ORDRE
* ------------------------
* Plus grave que la hiérarchie des conseils : les cinq étapes ont des
* PRÉREQUIS, et rien ne les disait.
*
* Fitz rédige la lettre de motivation à partir du profil — c'est
* littéralement ce que fait describeProfile() dans js/ai/prompts.js.
* Générer sa lettre avec un profil à 3/10 produit une lettre creuse,
* qui parle de personne. Elle sera pourtant marquée « faite » dans le
* parcours, d'un vert identique à celui d'une lettre excellente.
*
* De même, la vérification avant dépôt lit la checklist et l'existence
* de la lettre : la lancer avant d'avoir rempli l'une ou l'autre, c'est
* vérifier un dossier vide et recevoir un feu vert qui ne vaut rien.
*
* Un étudiant pouvait donc franchir les cinq étapes dans un ordre qui
* garantit un dossier faible, avec un parcours entièrement vert. C'est
* exactement le contraire de ce que l'espace doit produire.
*
* CE QUE FAIT CE FICHIER
* ----------------------
* Une seule décision, pure et testable : à partir de l'état réel de
* l'étudiant, dire LA prochaine action — une seule — avec son
* urgence et la raison qui la justifie. Aucun DOM, aucun Firestore,
* aucune date implicite : la date du jour est passée en paramètre,
* pour que les tests puissent se placer à trois jours d'une échéance.
* ============================================================
*/

import { PROFILE_READY_THRESHOLD } from "./profile-score.js";

/**
* Prérequis de chaque étape du parcours.
*
* Ils ne sont pas décoratifs : chacun correspond à une donnée que
* l'étape suivante consomme réellement.
*
*   letter    ← profile    : js/ai/prompts.js construit la lettre à
*                            partir de describeProfile(input.profile).
*   readiness ← checklist  : computeApplicationReadiness() lit la
*               + letter     checklist et hasGeneratedLetter.
*   advisor   ← readiness  : la revue humaine est la ressource la plus
*               | traductions rare du service ; la dépenser sur un
*               + ressources  dossier que personne n'a encore préparé,
*                            c'est la dépenser à relever des pièces
*                            manquantes au lieu du fond.
*
* `profile` et `checklist` n'ont pas de prérequis : on peut remplir
* son profil et rassembler ses pièces dans n'importe quel ordre.
*
* LA RÈGLE DES PARCOURS (lot B, 2026-09-07) : on déclare ici TOUS les
* prérequis possibles d'une étape, tous parcours confondus, et
* qualifierEtapes() ne retient que ceux qui EXISTENT dans le parcours
* courant. En bourse, `advisor` n'attend donc que `readiness` ; en
* préinscription (js/application-journey.js), où `readiness` n'existe
* pas, il attend `traductions` ET `ressources`. Un prérequis absent du
* parcours ne bloque jamais — sans quoi la revue conseiller resterait
* prématurée pour toujours en préinscription.
*/
export const PREREQUIS = {
profile: [],
checklist: [],
letter: ["profile"],
readiness: ["checklist", "letter"],
advisor: ["readiness", "traductions", "ressources"]
};

/**
* Ce que l'étudiant obtiendrait en franchissant l'étape trop tôt.
* Formulé comme une conséquence, pas comme une interdiction : rien
* n'est bloqué, l'étudiant reste libre. On lui dit seulement ce qu'il
* va récolter.
*/
const CONSEQUENCE_PREMATUREE = {
letter: "Fitz écrit votre lettre à partir de votre profil. Avec un profil encore incomplet, elle restera générique — et une lettre générique est ce qui écarte une candidature.",
readiness: "La vérification lit votre dossier et votre lettre. Lancée maintenant, elle n'aurait presque rien à examiner : son feu vert ne voudrait rien dire.",
// Vrai dans les deux parcours : en bourse le dossier est préparé par la
// vérification Fitz, en préinscription par les traductions et la preuve
// de ressources. Un seul message, honnête pour les deux.
advisor: "Votre conseiller relit un dossier déjà préparé. Le lui envoyer avant, c'est lui faire relever des pièces manquantes au lieu de travailler le fond — et sa relecture est la ressource la plus rare du service."
};

/** Libellés courts des étapes, pour les messages. */
const NOM_ETAPE = {
profile: "votre profil",
checklist: "votre dossier de candidature",
letter: "votre lettre de motivation",
readiness: "la vérification avant dépôt",
traductions: "vos traductions et légalisations",
ressources: "votre preuve de ressources",
advisor: "la revue de votre conseiller"
};

/**
* Jours restants avant une date limite.
* @returns {number|null} null si aucune date exploitable
*/
export function joursRestants(dateLimite, aujourdhui) {

if (!dateLimite) return null;

const cible = new Date(dateLimite);

if (Number.isNaN(cible.getTime())) return null;

const jour = new Date(aujourdhui);

cible.setHours(0, 0, 0, 0);
jour.setHours(0, 0, 0, 0);

return Math.round((cible - jour) / 86400000);

}

/**
* Qualifie chaque étape : faite, à faire, ou prématurée.
*
* « Prématurée » est le statut que le parcours ne savait pas dire.
* Une étape prématurée n'est pas interdite — elle est simplement
* signalée pour ce qu'elle est : un travail qui sera à refaire.
*
* @param {Array} etapes - sortie de computeJourneySteps()
* @returns {Array} les mêmes étapes, enrichies de `etat` et `bloquePar`
*/
export function qualifierEtapes(etapes) {

const faites = new Set(etapes.filter((e) => e.done).map((e) => e.id));

// Lot B (2026-09-07) : un prérequis ABSENT du parcours ne bloque rien.
// En préinscription il n'y a pas d'étape « readiness » ; sans ce
// filtre, « Revue conseiller » y resterait prématurée pour toujours.
const presentes = new Set(etapes.map((e) => e.id));

return etapes.map((etape) => {

if (etape.done) {
return { ...etape, etat: "faite", bloquePar: [] };
}

const manquants = (PREREQUIS[etape.id] || []).filter((id) => presentes.has(id) && !faites.has(id));

if (manquants.length) {
return {
...etape,
etat: "prematuree",
bloquePar: manquants,
consequence: CONSEQUENCE_PREMATUREE[etape.id] || ""
};
}

return { ...etape, etat: "a-faire", bloquePar: [] };

});

}

/**
* Première étape réellement faisable — celle dont tous les prérequis
* sont satisfaits. C'est elle, et pas la première étape non cochée,
* qui constitue la prochaine action sur une candidature.
*/
export function prochaineEtapeFaisable(etapes) {

return qualifierEtapes(etapes).find((e) => e.etat === "a-faire") || null;

}

// ==========================================================
// URGENCES
// ==========================================================
// Quatre niveaux, et un seul critère pour les distinguer : ce que
// l'étudiant PERD s'il n'agit pas. Une date limite dépassée est une
// candidature perdue ; un profil incomplet est une lettre plus faible ;
// une exploration remise à demain ne coûte rien.

export const URGENCES = ["critique", "haute", "normale", "exploration"];

/**
* CES SEUILS DIVERGENT DE js/echeance.js, ET C'EST VOULU — NE PAS LES
* « ALIGNER » (constat consigné le 2026-09-06)
*
* Ici : 3 et 14 jours. Là-bas (JOURS_CRITIQUE / JOURS_PROCHE de
* js/echeance.js) : 14 et 60. Le même mot, deux horizons — l'en-tête de
* la section 5 de js/echeance.js explique pourquoi : on parle ici à un
* étudiant qui a DÉJÀ un dossier en cours, dont la prochaine étape est
* une tâche de quelques heures ; là-bas à un visiteur qui n'a rien
* commencé, pour qui une bourse à dix jours est hors d'atteinte.
*
* CE QUE LA PASSE 1 A CHANGÉ : depuis qu'une candidature LIÉE au
* catalogue prend son ton de etatCandidature() (`app.echeance`), cette
* divergence ne touche plus que les candidatures HORS catalogue — celles
* dont l'étudiant a saisi la date lui-même. Autrement dit, le champ
* d'application s'est réduit, la règle n'a pas changé.
*
* Uniformiser les deux jeux afficherait « tranquille » à quelqu'un qui
* n'a en réalité plus le temps.
*/

/** Fenêtre en deçà de laquelle une échéance devient critique. */
export const JOURS_CRITIQUE = 3;

/** Fenêtre en deçà de laquelle une échéance devient prioritaire. */
export const JOURS_PROCHE = 14;

/**
* Jours restants d'une candidature, EN PRÉFÉRANT l'état du catalogue.
*
* Depuis la passe espace étudiant 1/3 (2026-09-06), dashboard.js pose
* sur chaque candidature `app.echeance` = etatDeLaCandidature()
* (js/candidature-catalogue.js). Quand la candidature est liée à sa
* fiche :
*   - un cycle CLOS rend null, quoi que dise la date saisie par
*     l'étudiant — compter à rebours vers une porte fermée est le
*     défaut que cette passe corrige ;
*   - une date ferme du catalogue l'emporte sur la date gelée ;
*   - « Selon votre pays » (jours null, cycle ouvert) laisse parler la
*     date de l'étudiant : c'est lui qui connaît celle de son pays.
* Sans `echeance` (candidature hors catalogue, tests), le calcul
* d'origine sur `app.deadline` reste inchangé.
*/
function joursDeLaCandidature(app, aujourdhui) {

const e = app && app.echeance;
const etat = e && e.lie ? e.etat : null;

if (etat && etat.ouvert === false) return null;
if (etat && etat.jours !== null && etat.jours !== undefined) return etat.jours;

return joursRestants(app.deadline, aujourdhui);

}

/** Vrai quand la fiche du catalogue dit le cycle clos. */
function cycleClos(app) {
const e = app && app.echeance;
return !!(e && e.lie && e.etat && e.etat.ouvert === false);
}

function actionEtape(etape, app, urgence, raison) {

return {
cle: `${etape.id}:${app.id}`,
etapeId: etape.id,
applicationId: app.id,
titre: etape.id === "profile"
? "Complétez votre profil"
: `${etape.label} — ${app.university || "votre candidature"}`,
texte: raison,
cta: etape.id === "profile" ? "Compléter mon profil" : etape.label,
href: etape.href || "applications.html",
action: etape.action || null,
urgence
};

}

/**
* LA prochaine action.
*
* Le classement se fait par conséquence, pas par ordre de page :
*
*  1. une échéance dépassée ou à trois jours sur une candidature
*     incomplète — tout le reste peut attendre ;
*  2. une échéance à deux semaines sur une candidature incomplète ;
*  2 bis. un dossier en préparation vers un cycle que le catalogue dit
*     clos (`app.echeance`, posé par dashboard.js) — jamais compté
*     comme « pressé », jamais « Il reste N jours » ;
*  3. un profil sous le seuil ALORS QU'une candidature est en cours —
*     c'est lui qui dégrade tout ce qui vient après ;
*  4. l'étape faisable de la candidature la plus proche de son
*     échéance ;
*  5. un profil sous le seuil sans candidature en cours ;
*  6. explorer, quand il n'y a encore rien à finaliser.
*
* @param {Object} contexte
* @param {number} contexte.profileScore - calculateAiScore(profil)
* @param {Array} contexte.applications - candidatures, chacune avec ses `etapes`
*        (sortie de computeJourneySteps) déjà calculées par l'appelant
* @param {number} [contexte.opportunitesCount=0]
* @param {Date|string|number} [contexte.aujourdhui] - injectée pour les tests
* @returns {Object} l'action à afficher
*/
export function prochaineAction({
profileScore = 0,
applications = [],
opportunitesCount = 0,
aujourdhui = new Date()
} = {}) {

const enCours = applications
.map((app) => {

const etapes = Array.isArray(app.etapes) ? app.etapes : [];
const restantes = etapes.filter((e) => !e.done);

return {
app,
etapes,
complete: etapes.length > 0 && restantes.length === 0,
faisable: prochaineEtapeFaisable(etapes),
jours: joursDeLaCandidature(app, aujourdhui),
clos: cycleClos(app)
};

})
.filter((c) => !c.complete);

// Une candidature dont le catalogue dit le cycle clos n'entre dans
// AUCUN classement par échéance : elle n'est jamais « pressée », ne
// produit jamais « Il reste N jours ». Elle a sa propre action, plus
// bas — après une vraie urgence sur un dossier encore ouvert.
const closes = enCours.filter((c) => c.clos);
const ouvertes = enCours.filter((c) => !c.clos);

// Les candidatures sans date limite passent après celles qui en ont
// une : une échéance connue est une contrainte réelle, une échéance
// absente n'est qu'une information manquante.
const parEcheance = [...ouvertes].sort((a, b) => {
if (a.jours === null) return b.jours === null ? 0 : 1;
if (b.jours === null) return -1;
return a.jours - b.jours;
});

const pressee = parEcheance.find((c) => c.jours !== null && c.jours <= JOURS_PROCHE);

// ---- 1 et 2 : une échéance qui approche ----
if (pressee && pressee.faisable) {

const critique = pressee.jours <= JOURS_CRITIQUE;

const quand = pressee.jours < 0
? `La date limite est dépassée de ${Math.abs(pressee.jours)} jour${Math.abs(pressee.jours) > 1 ? "s" : ""}`
: pressee.jours === 0
? "La date limite est aujourd'hui"
: `Il reste ${pressee.jours} jour${pressee.jours > 1 ? "s" : ""}`;

// L'établissement est NOMMÉ dans la phrase même quand l'étape
// proposée est le profil : sans lui, « il reste 2 jours » ne dit pas
// de quelle candidature il s'agit, et un étudiant qui en suit trois
// ne sait pas laquelle est en jeu.
const ou = pressee.app.university ? ` pour ${pressee.app.university}` : "";

return actionEtape(
pressee.faisable,
pressee.app,
critique ? "critique" : "haute",
`${quand}${ou}, et il manque ${NOM_ETAPE[pressee.faisable.id] || "une étape"}.`
);

}

// ---- 2 bis : un dossier en préparation vers un cycle clos ----
//
// L'étudiant prépare un dossier que l'organisme n'accepte plus. Ce
// n'est pas une échéance à tenir, c'est une décision à prendre — et
// elle passe avant le profil : tout ce qu'il produirait pour ce
// dossier serait produit pour rien.
if (closes.length) {

const c = closes[0];
const bourse = c.app.scholarship || c.app.university || "cette bourse";

return {
cle: `cycle-clos:${c.app.id}`,
etapeId: null,
applicationId: c.app.id,
titre: `Le cycle de ${bourse} est clos`,
texte: `Le cycle de ${bourse} est clos. Vérifiez la prochaine ouverture ou choisissez une autre opportunité.`,
cta: "Voir cette candidature",
href: `applications.html#${c.app.id}`,
action: null,
urgence: "haute"
};

}

// ---- 3 : le profil, quand il dégrade une candidature en cours ----
if (profileScore < PROFILE_READY_THRESHOLD && enCours.length) {

return {
cle: "profile",
etapeId: "profile",
applicationId: null,
titre: "Complétez votre profil avant d'aller plus loin",
texte: `Votre profil est à ${profileScore}/10. C'est lui que Fitz lit pour écrire vos lettres et vérifier vos dossiers : tout ce que vous produirez avant de l'avoir complété sera à refaire.`,
cta: "Compléter mon profil",
href: "profile.html",
action: null,
urgence: "haute"
};

}

// ---- 4 : l'étape faisable la plus proche d'une échéance ----
const suivante = parEcheance.find((c) => c.faisable);

if (suivante) {

const quand = suivante.jours === null
? "Prochaine étape"
: `Il reste ${suivante.jours} jour${Math.abs(suivante.jours) > 1 ? "s" : ""}`;

return actionEtape(
suivante.faisable,
suivante.app,
"normale",
`${quand} : ${NOM_ETAPE[suivante.faisable.id] || "une étape"} vous attend.`
);

}

// ---- 5 : le profil, sans candidature en cours ----
if (profileScore < PROFILE_READY_THRESHOLD) {

return {
cle: "profile",
etapeId: "profile",
applicationId: null,
titre: "Complétez votre profil",
texte: `Votre profil est à ${profileScore}/10. C'est à partir de lui que Fitz identifie les opportunités qui vous correspondent vraiment.`,
cta: "Compléter mon profil",
href: "profile.html",
action: null,
urgence: "normale"
};

}

// ---- 6 : rien à finaliser ----
return {
cle: "explorer",
etapeId: null,
applicationId: null,
titre: "Choisissez votre prochaine candidature",
texte: opportunitesCount > 0
? `${opportunitesCount} opportunité${opportunitesCount > 1 ? "s correspondent" : " correspond"} à votre profil. Votre dossier est prêt : c'est le bon moment pour en ajouter une.`
: "Votre dossier est à jour. Explorez le catalogue pour repérer les programmes qui vous correspondent.",
cta: "Explorer les universités",
href: "universities.html",
action: null,
urgence: "exploration"
};

}

/**
* Les avertissements à afficher : les étapes que l'étudiant pourrait
* franchir maintenant, mais dont le résultat serait faible.
*
* Ils ne sont produits QUE pour les étapes qu'il a une raison de
* vouloir faire — celles dont il ne manque qu'un prérequis. Signaler
* d'un coup les trois étapes bloquées d'un compte vide serait du
* bruit, et le bruit fait ignorer les avertissements qui comptent.
*
* @param {Array} etapes - sortie de computeJourneySteps()
* @returns {Array<{id:string, label:string, consequence:string, bloquePar:string[]}>}
*/
export function avertissementsPrematures(etapes) {

return qualifierEtapes(etapes)
.filter((e) => e.etat === "prematuree" && e.bloquePar.length === 1)
.map((e) => ({
id: e.id,
label: e.label,
consequence: e.consequence,
bloquePar: e.bloquePar,
prerequisLisible: NOM_ETAPE[e.bloquePar[0]] || e.bloquePar[0]
}));

}
