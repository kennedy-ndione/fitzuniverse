// -------- dashboard.js — « Mon parcours » (refonte 2026-08-30) --------
// L'espace étudiant n'est plus un tableau de bord à sidebar : c'est un
// parcours en six phases (profil → opportunités → dossiers → dépôt →
// réponse & bourse → visa & départ), calculé sur les données réelles.
// Ce fichier ORCHESTRE et AFFICHE ; les décisions viennent des modules
// testables déjà en place — rien n'est recalculé une deuxième fois :
//   - js/journey-map.js        : état des 6 phases + radar d'échéances
//   - js/next-action.js        : LA prochaine action (prérequis compris)
//   - js/application-journey.js: les étapes réelles de chaque dossier
//   - js/recommend-programs.js : opportunités compatibles + raisons
//   - js/profile-score.js      : score de profil X/10

import { db } from "./firebase-config.js";
import { collection, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { calculateAiScore, PROFILE_READY_THRESHOLD } from "./js/profile-score.js";
import { initShellChrome, bootstrapShell, PLAN_LABELS, nextPlanId, isFeatureLocked, applyFeatureLocks } from "./js/app-shell.js";
// retenirOpportunites : la MEME selection que results.js (le diagnostic
// gratuit) — cinq filtres, dedoublonnage par bourse et par universite,
// plafond par pays. Voir chargerOpportunites() plus bas.
import { retenirOpportunites, libelleFenetre } from "./js/recommend-programs.js";
import { computeJourneySteps } from "./js/application-journey.js";
import { trouverProcedure } from "./js/procedures/index.js";
import { prochaineAction, qualifierEtapes, joursRestants, LIBELLE_PREREQUIS } from "./js/next-action.js";
// Lot FITZ-RECOURS : le recours est à l'endroit du blocage.
import { boutonRecours } from "./js/fitz-recours.js";
import { lireParcours } from "./js/parcours.js";
import { etatDesPhases, radarEcheances, tonEcheance, STATUTS_DEPOSES, STATUTS_REPONSE, VISA_ETAPES } from "./js/journey-map.js";
// LOT ESPACE-ÉTUDIANT (2026-09-13) — deux décisions sortent d'ici, et
// elles ne se prennent plus au jugé dans le rendu :
//   - COMBIEN de candidatures on propose : celui de la formule, jamais 3
//     écrit en dur (js/parcours-quota.js) ;
//   - CE QU'ON MONTRE d'une phase selon où en est l'étudiant
//     (js/revelation.js). Le rail reste entier ; c'est le détail qui se
//     dévoile.
import { quotaDeLaFormule, nombreAProposer, phraseDuQuota } from "./js/parcours-quota.js";
import { revelerPhases, promesseDePhase, resumeDePhase, revelerEtapesVisa } from "./js/revelation.js";
// LOT PORTAILS (2026-09-14) — les trois portes d'une opportunité.
// Les portails ont quitté le catalogue public au lot S3 : ils sont
// servis par la Cloud Function `portails`, qui vérifie l'abonnement.
// Le hub n'en affichait AUCUN — les 147 portails d'université déjà
// renseignés étaient invisibles pour l'étudiant qui les avait payés.
import { chargerPortails, portailUniversite, portailBourse, portailsDisponibles } from "./js/portails.js";
import { liensDOpportunite, portailDeBourseOuRepli } from "./js/portails-opportunite.js";
// Lot S3 (2026-09-13) : le contenu du guide visa a quitté le HTML, où il
// était écrit DEUX FOIS — dans espace-bourse.html et dans
// espace-preinscription.html, avec le texte de la bourse recopié tel quel
// côté préinscription (« attestation de bourse » s'affichait à un
// autofinancé). Il vit désormais dans un seul module, qui sert la
// variante du parcours et va chercher, dans la procédure de la
// destination, les étapes réelles avec leur source et leur date.
import { guideVisaPour } from "./js/visa-depart.js";
import { texteConsigne } from "./js/procedures/vocabulaire.js";

// Chargeur de catalogue partagé et mémoïsé — voir js/catalog-data.js.
import { chargerCatalogue } from "./js/catalog-data.js";
// Passe espace étudiant 1/3 (2026-09-06) : chaque candidature est reliée
// à sa fiche du catalogue et porte l'état que la fiche publie
// (`app.echeance`) — consommé par la prochaine action, le radar et les
// cartes de dossier. Jamais une écriture.
import { indexerCatalogue, etatDeLaCandidature } from "./js/candidature-catalogue.js";

// ==========================================================
// CATALOGUE — un seul chargement pour les TROIS besoins de la page
// (compter les opportunités compatibles, proposer les 3 meilleures,
// et relier les candidatures à leur fiche). Même jointure et même
// moteur que applications.js — jamais une deuxième façon de compter
// (voir js/recommend-programs.js).
// ==========================================================
async function chargerOpportunites(profile, dejaSuivies = null) {

try {

const catalogue = await chargerCatalogue();

const index = indexerCatalogue(catalogue);

const renommer = ({ id, ...reste }) => ({ firestoreId: id, ...reste });

const programs = catalogue.programmes.map(renommer);
const universitiesById = new Map(catalogue.universites.map((u) => [u.id, renommer(u)]));
const scholarshipsById = new Map(catalogue.bourses.map((s) => [s.id, renommer(s)]));

// L'ESPACE PAYANT RECOMMANDAIT MOINS BIEN QUE LE DIAGNOSTIC GRATUIT
// (corrigé le 2026-09-06, passe espace étudiant 2/3)
//
// Ici tournait `recommendPrograms(...).filter(m => m.score > 0)`. Ce
// tri-là garde tout ce qui n'est pas négatif, donne +1 au statut
// « Ouverte » — que 167 programmes affichent pour 39 dates réellement
// futures — et ne filtre NI le cycle visé, NI l'échéance, NI les
// doublons de bourse. Le diagnostic gratuit, lui, passe par
// retenirOpportunites() : cinq filtres, dédoublonnage par bourse et
// par université, plafond par pays.
//
// Autrement dit, l'étudiant qui PAYAIT recevait la liste la moins
// travaillée des deux. On sert désormais la même que results.js — une
// seule définition de « ce qui correspond à ce profil ».
// `exclureUniversites` existait déjà (lot FITZ-CHOISIT) et n'était pas
// utilisé ici : le hub pouvait proposer, à un Conseiller qui suit deux
// dossiers, deux cartes pour les universités qu'il suit déjà — avec le
// bouton « voir cette proposition » à côté. On écarte ce qu'il a.
const selection = retenirOpportunites({
profile: profile || {},
programs,
universitiesById,
scholarshipsById,
exclureUniversites: dejaSuivies
});

// On rend `selection` tel quel : `nombre`, `ouvertes` et `pays` sont
// déjà calculés là-bas. Les recompter ici serait la deuxième source de
// vérité que cette passe supprime.
// `top` s'arrêtait à TROIS. C'était le plafond d'affichage déguisé en
// plafond de données : même en corrigeant le rendu, un Conseiller
// n'aurait jamais pu voir ses six places, faute de six entrées à
// montrer. On remonte tout ce que la sélection a retenu, dans la limite
// du plus grand quota affichable, et c'est le rendu qui coupe — au
// nombre de la formule (js/parcours-quota.js).
return { selection, count: selection.nombre, top: selection.retenues.slice(0, 12), index };

} catch (error) {

console.warn("Impossible de charger les opportunités compatibles :", error);
return { count: 0, top: [], index: null };

}

}

function readStorage(key, fallback) {
try {
const value = JSON.parse(localStorage.getItem(key));
return value || fallback;
} catch {
return fallback;
}
}

// ==========================================================
// RENDU — salutation, prochaine action, rail, radar
// ==========================================================

// LE NOM DE LA PHASE VIENT DE L'ESPACE, PAS D'UNE TABLE FIGÉE.
// Ici vivait `NOMS_PHASES`, construit sur PHASES — c'est-à-dire sur le
// vocabulaire BOURSE, et lui seul. Dans l'espace préinscription, un
// étudiant qui venait de choisir ses établissements lisait « Vous êtes à
// la phase Opportunités », mot que sa page n'emploie nulle part (elle dit
// « Établissements »), et « Réponse » là où elle dit « Admission ». Le lot
// DEUX-VOCABULAIRES avait dédoublé les libellés dans phasesDe() ; cette
// ligne-ci était restée branchée sur l'ancienne table. Les phases reçues
// portent DÉJÀ le bon `label` — on le lit, on ne le recherche plus.
function renderHello(nom, phases) {

document.getElementById("welcomeMessage").textContent = `Bonjour ${nom}`;

const ligne = document.getElementById("jyPhaseLine");
const courante = phases.find((p) => p.courante && !p.faite);

// Parcours accompli : « vous êtes à la phase Visa & départ » serait faux
// — il n'y a plus de phase où être.
ligne.innerHTML = courante
? `Vous êtes à la phase <strong>${ech(courante.label)}</strong> de votre parcours.`
: `Vos six phases sont accomplies. <strong>Bon voyage, et bonne rentrée.</strong>`;

}

const KICKERS = {
critique: "À faire maintenant",
haute: "Prioritaire",
normale: "Votre prochaine action",
exploration: "Quand vous voulez"
};

function renderProchaineAction(action) {

const section = document.getElementById("jyAction");

section.classList.remove("jy-action--critique", "jy-action--haute");
if (action.urgence === "critique") section.classList.add("jy-action--critique");
if (action.urgence === "haute") section.classList.add("jy-action--haute");

document.getElementById("jyActionKicker").textContent = KICKERS[action.urgence] || "Votre prochaine action";
document.getElementById("jyActionTitle").textContent = action.titre;
document.getElementById("jyActionText").textContent = action.texte;
document.getElementById("jyActionCta").setAttribute("href", action.href);
document.getElementById("jyActionCtaLabel").textContent = action.cta;

// « Bloqué ? Demandez à Fitz » sous la carte — toujours. Fitz y
// répond par la MÊME prochaineAction() (test anti-divergence).
let recours = document.getElementById("jyActionRecours");
if (!recours) {
recours = document.createElement("p");
recours.id = "jyActionRecours";
recours.className = "jy-action-recours";
document.getElementById("jyActionCta").insertAdjacentElement("afterend", recours);
}
recours.innerHTML = boutonRecours({ code: "quoi_faire", app: action.applicationId || "" }, { classe: "fitz-recours--bloc" });

section.hidden = false;

}

function renderRail(phases, progressionPct) {

const rail = document.getElementById("jyRail");

// LE RAIL RESTE ENTIER — C'EST LA CARTE, PAS LE CONTENU.
// La révélation progressive cache le DÉTAIL d'une phase, jamais son
// existence : un étudiant qui paie doit voir les six étapes de son
// voyage dès le premier jour. Le rail se contente donc d'estomper ce qui
// n'est pas encore atteint, et les six noms restent lisibles et
// cliquables.
rail.innerHTML = phases.map((phase, idx) => `
<a href="#phase-${phase.id}" class="jy-rail-item is-${phase.revelation || "ouverte"} ${phase.faite ? "is-done" : ""} ${phase.courante && !phase.faite ? "is-current" : ""}">
<span class="jy-rail-dot"><i data-lucide="${phase.faite ? "check" : phase.icon}"></i></span>
<span class="jy-rail-label">${idx + 1}. ${ech(phase.label)}</span>
</a>
`).join("");

// PREMIUM 5 (2026-09-19) — UN COMPTE, PAS UN POURCENTAGE.
//
// « Parcours accompli à 17 % » ne se voit jamais bouger : il faut finir
// une phase ENTIÈRE pour qu'il passe à 33. La route, elle, affiche
// « 3 étapes faites sur 15 » et « 0 pièce prête sur 9 » — des nombres
// que l'étudiant regarde avancer, et qu'il a envie de faire avancer.
// C'est là qu'est l'« addictif » demandé le 18, pas dans le poids d'un
// bouton. `progressionPct` reste calculé, il sert ailleurs ; ce n'est
// simplement plus lui qu'on montre.
// `reduce` et pas `filter` : « révélation 4 » (test/espace-etudiant.test.mjs)
// interdit TOUT `.filter(` dans renderRail, pour qu'aucune phase ne puisse
// jamais disparaître du rail. Le garde-fou ne sait pas distinguer un filtre
// qui compte d'un filtre qui cache — et c'est très bien ainsi : on compte
// donc sans filtrer, la règle reste entière.
const faites = phases.reduce((n, phase) => n + (phase.faite ? 1 : 0), 0);

document.getElementById("jyProgressLine").innerHTML =
progressionPct >= 100
? `<strong>Parcours accompli</strong> — bon voyage, et bonne rentrée !`
: `<strong>${faites} phase${faites > 1 ? "s" : ""} faite${faites > 1 ? "s" : ""} sur ${phases.length}</strong> — chaque phase s'ouvre sur une avancée réelle, jamais sur un clic.`;

}

function renderRadar(applications) {

const radar = document.getElementById("jyRadar");
const chips = document.getElementById("jyRadarChips");
const entries = radarEcheances(applications);

if (!entries.length) {
radar.hidden = true;
return;
}

chips.innerHTML = entries.map(({ app, jours }) => {

const quand = jours < 0
? `dépassée de ${Math.abs(jours)} j`
: jours === 0 ? "aujourd'hui"
: `${jours} j`;

return `<a href="applications.html" class="jy-radar-chip jy-radar-chip--${tonEcheance(jours)}">${ech(app.university || "Candidature")} · <strong>${quand}</strong></a>`;

}).join("");

radar.hidden = false;

}

// ==========================================================
// ÉTATS DE PHASE (pastille en tête de chaque section)
// ==========================================================
const CIBLES_ETAT = {
profil: "stateProfil",
opportunites: "stateOpportunites",
dossiers: "stateDossiers",
depot: "stateDepot",
reponse: "stateReponse",
depart: "stateDepart"
};

const PASTILLES = {
faite: `<i data-lucide="check-circle"></i>Faite`,
ouverte: `<i data-lucide="circle-dot"></i>Vous êtes ici`,
entrouverte: `<i data-lucide="circle-dashed"></i>Juste après`,
scellee: `<i data-lucide="circle"></i>À venir`
};

/**
* LE CORPS D'UNE PHASE EST ENVELOPPÉ ICI, PAS DANS LE HTML.
*
* Les deux hubs partagent leur coquille au caractère près (un test le
* vérifie) et le guide visa a déjà quitté le HTML : ajouter un conteneur
* dans les deux fichiers aurait été deux occasions de diverger. Le corps
* d'une phase, c'est tout ce qui suit son en-tête ; on l'emballe une
* seule fois, au premier rendu, et on le retrouve ensuite.
*/
function corpsDePhase(section) {

let corps = section.querySelector(":scope > .jy-phase-body");
if (corps) return corps;

corps = document.createElement("div");
corps.className = "jy-phase-body";

const tete = section.querySelector(".jy-phase-head");
let noeud = tete ? tete.nextSibling : section.firstChild;

while (noeud) {
const suivant = noeud.nextSibling;
corps.appendChild(noeud);
noeud = suivant;
}

section.appendChild(corps);
return corps;

}

/**
* LE VOILE — ce qu'on lit d'une phase qu'on n'a pas encore atteinte.
*
* Il dit deux choses, et c'est tout : ce qui vous y attend, et ce qui
* l'ouvrira. Pas un aperçu du contenu, pas une liste d'outils grisés :
* la phase suivante doit donner envie, pas frustrer.
*
* Le bouton n'est pas une politesse. `etatDesPhases` dit en toutes
* lettres que les phases à venir NE SONT PAS VERROUILLÉES : l'étudiant
* reste libre d'aller voir. On cachette l'enveloppe, on ne ferme pas la
* porte — et c'est lui qui décide de l'ouvrir.
*/
function voileDePhase(section, phase, espace) {

let voile = section.querySelector(":scope > .jy-phase-voile");
const promesse = promesseDePhase(phase.id, espace);
if (!promesse) return null;

if (!voile) {
voile = document.createElement("div");
voile.className = "jy-phase-voile";
voile.innerHTML = `
<p class="jy-voile-attend"></p>
<p class="jy-voile-cle"><i data-lucide="key-round"></i><span></span></p>
<button type="button" class="jy-voile-btn"><i data-lucide="eye"></i><span>Jeter un œil</span></button>`;
section.insertBefore(voile, section.querySelector(":scope > .jy-phase-body"));
voile.querySelector(".jy-voile-btn").addEventListener("click", () => {
section.classList.add("is-devoilee");
section.dataset.devoileeALaMain = "1";
if (window.lucide) lucide.createIcons();
});
}

voile.querySelector(".jy-voile-attend").textContent = promesse.attend;
voile.querySelector(".jy-voile-cle span").innerHTML =
`Cette phase s'ouvre avec <strong>${ech(promesse.ouvrePar)}</strong>.`;

return voile;

}

/** La ligne d'une phase repliée : ce qui a été accompli, et le chiffre. */
function resumeReplie(section, phase, ctx) {

let ligne = section.querySelector(":scope > .jy-phase-resume");

if (!ligne) {
ligne = document.createElement("button");
ligne.type = "button";
ligne.className = "jy-phase-resume";
ligne.innerHTML = `<i data-lucide="check"></i><span></span><i class="jy-phase-resume-caret" data-lucide="chevron-down"></i>`;
section.insertBefore(ligne, section.querySelector(":scope > .jy-phase-body"));
ligne.addEventListener("click", () => {
const ouverte = section.classList.toggle("is-devoilee");
section.dataset.devoileeALaMain = ouverte ? "1" : "0";
if (window.lucide) lucide.createIcons();
});
}

ligne.querySelector("span").textContent = resumeDePhase(phase.id, ctx);
return ligne;

}

/**
* Le rendu d'une phase : sa pastille d'état, et ce qu'elle laisse voir.
* `ctx` porte les chiffres réels du résumé — jamais un compte recalculé.
*/
function renderPhases(phases, ctx) {

const revelees = revelerPhases(phases);

revelees.forEach((phase) => {

const el = document.getElementById(CIBLES_ETAT[phase.id]);
if (!el) return;

const section = el.closest(".jy-phase");
if (!section) return;

corpsDePhase(section);

section.classList.toggle("is-done", phase.faite);
section.classList.toggle("is-current", phase.courante && !phase.faite);

// L'état de révélation change : on repart fermé — SAUF si l'étudiant
// avait ouvert cette phase lui-même.
//
// Sans la remise à zéro, une phase dévoilée restait ouverte en
// devenant « faite » et son résumé s'affichait sous son contenu. Mais
// sans l'exception, la phase 06 se refermait SOUS LE DOIGT : à la
// sixième démarche cochée, elle passe « faite », le guide dans lequel
// l'étudiant venait de cliquer disparaissait, et le geste de
// félicitation se lisait comme une perte. Un dévoilement à la main
// tient jusqu'à ce qu'il le referme.
const precedent = section.dataset.revelation;
if (precedent !== phase.revelation) {
if (section.dataset.devoileeALaMain !== "1") section.classList.remove("is-devoilee");
section.dataset.revelation = phase.revelation;
}

for (const etat of ["faite", "ouverte", "entrouverte", "scellee"]) {
section.classList.toggle(`is-${etat}`, phase.revelation === etat);
}

el.innerHTML = PASTILLES[phase.revelation] || PASTILLES.scellee;

// Une phase FAITE porte son résumé ; une phase à venir porte son
// voile ; la phase en cours ne porte ni l'un ni l'autre. Les deux
// éléments sont créés à la demande et réutilisés ensuite — on ne les
// refabrique pas à chaque re-peinture.
const faite = phase.revelation === "faite";
const ouverte = phase.revelation === "ouverte";

const voile = voileDePhase(section, phase, ctx.espace);
const resume = faite ? resumeReplie(section, phase, ctx) : section.querySelector(":scope > .jy-phase-resume");

if (voile) voile.hidden = faite || ouverte;
if (resume) resume.hidden = !faite;

});

return revelees;

}

// ==========================================================
// PHASE 1 — PROFIL
// ==========================================================
function renderProfil(score) {

document.getElementById("jyProfileScore").textContent = score;

document.getElementById("jyProfileCopy").textContent =
score >= PROFILE_READY_THRESHOLD
? "Votre profil est assez complet pour que Fitz travaille avec précision. Tenez-le à jour : chaque détail nourrit vos lettres et vos recommandations."
: `Votre profil est à ${score}/10. Sous ${PROFILE_READY_THRESHOLD}/10, les lettres et vérifications de Fitz restent génériques — complétez-le avant de produire quoi que ce soit.`;

const cta = document.getElementById("jyProfileCta");
if (score >= PROFILE_READY_THRESHOLD) {
cta.querySelector("span").textContent = "Mettre à jour mon profil";
} else {
cta.classList.add("jy-btn--primary");
}

}

// ==========================================================
// PHASE 2 — OPPORTUNITÉS
// ==========================================================
/**
* LA LIGNE DU QUOTA — « votre formule vous donne N ».
*
* Elle n'existait nulle part. Le quota était appliqué (applications.js
* bloquait à N+1) mais jamais DIT : un client Conseiller à 150 000 F
* pouvait parcourir tout son espace sans lire une seule fois le nombre
* six. On l'écrit là où il sert, au-dessus des propositions.
*/
function renderLigneQuota(quotaCtx) {

const ancre = document.getElementById("jyOppsSub");
if (!ancre) return;

let ligne = document.getElementById("jyQuotaLine");
const phrase = phraseDuQuota(quotaCtx);

if (!phrase) { if (ligne) ligne.hidden = true; return; }

if (!ligne) {
ligne = document.createElement("p");
ligne.id = "jyQuotaLine";
ligne.className = "jy-quota";
ligne.innerHTML = `<i data-lucide="ticket"></i><span></span>`;
ancre.insertAdjacentElement("afterend", ligne);
}

ligne.hidden = false;
ligne.classList.toggle("is-complet", phrase.complet);
ligne.querySelector("span").textContent = phrase.texte;

}

function renderOpportunites(opps, profileScore, quotaCtx) {

const grid = document.getElementById("jyOpps");
const sub = document.getElementById("jyOppsSub");

renderLigneQuota(quotaCtx);

if (profileScore < PROFILE_READY_THRESHOLD && !opps.top.length) {
sub.textContent = "Complétez d'abord votre profil : c'est lui que Fitz croise avec le catalogue pour repérer où votre dossier est compétitif.";
grid.innerHTML = "";
return;
}

// « Fitz A RETENU N », jamais « il n'existe que N » : le chiffre dit le
// travail de selection, pas une penurie. Meme phrase que results.js —
// un etudiant qui passe du diagnostic a son espace doit reconnaitre la
// meme voix et le meme compte.
const n = opps.count;
const m = opps.selection ? opps.selection.ouvertes : 0;

sub.textContent = n > 0
// « ouvertes » s'accorde avec « candidatures », toujours au pluriel —
// jamais avec M : « dont 0 aux candidatures encore ouverte » était une
// faute d'accord.
? `Fitz a retenu ${n} opportunité${n > 1 ? "s" : ""} pour votre profil, dont ${m} aux candidatures encore ouvertes.`
: "Le catalogue n'a pas encore de correspondance nette avec votre profil — explorez-le librement, il s'enrichit chaque semaine.";

// COMBIEN DE CARTES : CELUI DE LA FORMULE.
//
// Ici, `opps.top` valait `retenues.slice(0, 3)` — trois, toujours trois.
// Un Premier Dossier (UNE place) en voyait trois et se faisait proposer
// d'en suivre une quatrième ; un Conseiller (SIX places) en voyait trois
// et ignorait qu'il avait payé le double. On sert désormais exactement
// le nombre de places LIBRES (js/parcours-quota.js), plafonné par ce que
// le catalogue peut réellement remplir.
const combien = nombreAProposer({
quota: quotaCtx ? quotaCtx.quota : null,
dejaSuivies: quotaCtx ? quotaCtx.dejaSuivies : 0,
disponibles: opps.top.length
});

// Rien à proposer : DEUX causes, et il faut les distinguer.
// `nombreAProposer` rend 0 aussi bien quand toutes les places sont
// prises que quand le catalogue n'a rien à offrir (ou n'a pas pu être
// chargé). Annoncer « toutes vos places sont engagées » à un Conseiller
// qui n'a suivi aucune candidature — parce que le catalogue est hors
// ligne — serait faux, et juste sous un sous-titre qui dit le contraire.
if (!combien) {
const quota = quotaCtx ? quotaCtx.quota : null;
const restantes = quota ? Math.max(0, (quota === Infinity ? Infinity : quota) - (quotaCtx.dejaSuivies || 0)) : null;
grid.innerHTML = (quota && restantes === 0)
? `<div class="jy-card jy-empty">Toutes les places de votre formule sont engagées. Fitz suit ${quota > 1 ? "chacune" : "votre dossier"} jusqu'à la décision de l'établissement — <a href="applications.html">ouvrez vos dossiers</a> pour voir où ${quota > 1 ? "elles en sont" : "il en est"}.</div>`
: "";
return;
}

// LE LIEN DIT CE QU'IL FAIT.
// Les trois cartes menaient toutes à `applications.html?action=new`, sous
// le libellé « Suivre cette candidature ». Or ce paramètre n'ouvre plus
// rien depuis le lot FITZ-CHOISIT (c'est Fitz qui remplit les places) :
// trois boutons différents produisaient le même écran, et aucun ne
// faisait ce qu'il annonçait.

// L'ACCÈS AUX PORTAILS EST UNE DONNÉE PAYANTE.
// `portailsDisponibles()` est vrai seulement si la Cloud Function a
// répondu — donc pour un abonné actif. Faux : la carte ne porte que le
// site de l'université, exactement ce qu'un visiteur verrait. Ni
// cadenas, ni « réservé », ni bloc vide (doctrine du 2026-08-31).
const abonne = portailsDisponibles();
const bourseDe = (id) => (opps.index && id ? opps.index.bourseParId.get(id) : null) || null;

grid.innerHTML = opps.top.slice(0, combien).map((pick) => {

const bourse = bourseDe(pick.scholarshipId);

// Le portail du bailleur : le champ confirmé du lot S3 d'abord, le
// site officiel de la bourse en repli — MÊME règle que details.js.
// Le champ neuf est vide sur les 156 bourses tant que le lot de
// données n'a pas eu lieu ; le repli évite une carte sans aucune
// porte vers la bourse, et se corrigera tout seul au remplissage.
const bailleur = portailDeBourseOuRepli({
portailConfirme: portailBourse(pick.scholarshipId),
siteDeLaBourse: bourse ? bourse.officialWebsite : ""
});

const { liens, orientation } = liensDOpportunite({
site: pick.universityWebsite,
// Le portail d'ADMISSION ne vient plus du catalogue (il en a été
// retiré au lot S3) : `pick.applicationUrl` est donc vide sur les
// 155 universités. C'est portailUniversite() qui le sert.
portailAdmission: portailUniversite({ universityId: pick.universityId, programId: pick.programId }),
portailBourse: bailleur.url,
bourseConfirmee: bailleur.confirme,
// Les 8 universités SANS portail d'admission : leur voie (ambassade,
// procédure nationale, dépôt sur place) est dite au lieu d'un silence.
// Le champ vient du catalogue public via recommend-programs.js.
voieAdmission: pick.voieAdmission || "",
entryPoint: bourse ? bourse.entryPoint : "",
funderName: bourse ? bourse.funderName : "",
abonne
});

// Le lot R13 avait rendu vraie la branche « préinscription » de ce
// lien plutôt que de la retirer, faute d'être dans un lot qui touchait
// au hub des bourses. C'est ce lot-ci : elle est partie.
const lien = "applications.html";

const libelle = "Voir cette proposition";

// LOT P2 (2026-09-19) — LA CARTE DIT OÙ, QUAND ET POURQUOI.
//
// Elle portait le titre de la bourse, le nom de l'université et UNE
// raison. Or chaque retenue transporte depuis toujours son `country`,
// son `deadline`, ses `jours`, son `echeanceOuverte` et un TABLEAU de
// raisons : tout était calculé, puis jeté à l'affichage. Un étudiant
// ne peut pas choisir entre deux propositions s'il ignore dans quel
// pays elles sont et combien de temps il lui reste.
const fenetre = libelleFenetre(pick);

// Trois raisons au maximum : au-delà, la carte devient un argumentaire
// et on ne lit plus rien.
const raisons = (pick.reasons || []).slice(0, 3);

return `
<article class="jy-card jy-opp" style="margin-bottom:0;">
<h3>${ech(pick.scholarshipTitle || "Programme")}</h3>
<p class="jy-opp-uni">${ech(pick.universityName)}</p>
<div class="jy-opp-faits">
${pick.country ? `<span class="jy-opp-fait jy-opp-pays"><i data-lucide="map-pin"></i><span>${ech(pick.country)}</span></span>` : ""}
<span class="jy-opp-fait jy-opp-fenetre is-${ech(fenetre.etat)}"><i data-lucide="${fenetre.etat === "a_verifier" ? "help-circle" : "calendar-clock"}"></i><span>${ech(fenetre.texte)}</span></span>
</div>
${raisons.map((raison) => `<p class="jy-opp-reason"><i data-lucide="check"></i><span>${ech(raison)}</span></p>`).join("")}
${orientation ? `<p class="jy-opp-orientation"><i data-lucide="signpost"></i><span>${ech(orientation)}</span></p>` : ""}
${liens.length ? `<div class="jy-portes">${liens.map((l) => `
<a href="${ech(l.url)}" target="_blank" rel="noopener noreferrer" class="jy-porte jy-porte--${ech(l.cle)}${l.depot ? " jy-porte--depot" : ""}" title="${ech(l.titre)}">
<i data-lucide="${ech(l.icone)}"></i><span>${ech(l.libelle)}</span><i class="jy-porte-sortie" data-lucide="external-link"></i>
</a>`).join("")}</div>` : ""}
<a href="${ech(lien)}" class="jy-btn"><span>${libelle}</span><i data-lucide="arrow-right"></i></a>
</article>`;

}).join("");

}

// ==========================================================
// PHASE 3 — DOSSIERS (une carte + mini-stepper par candidature)
// ==========================================================
function renderEtapesChips(etapes) {

return qualifierEtapes(etapes).map((etape) => {

const classes = [
"jy-step",
etape.etat === "faite" ? "is-done" : "",
etape.etat === "prematuree" ? "is-premature" : ""
].filter(Boolean).join(" ");

const infobulle = etape.etat === "prematuree"
? `${etape.label} — à faire après ${etape.bloquePar.map((id) => LIBELLE_PREREQUIS[id] || id).join(" et ")}`
: etape.label;

return `<a href="${etape.href || "applications.html"}" class="${classes}" title="${infobulle}">
<i data-lucide="${etape.etat === "faite" ? "check" : etape.icon}"></i><span>${etape.label}</span>
</a>`;

}).join("");

}

const STATUS_LABELS = {
a_preparer: "À préparer",
en_cours: "En préparation",
deposee: "Déposée",
en_attente: "En attente de réponse",
reponse_recue: "Réponse reçue (à préciser)",
admise: "Admise",
liste_attente: "Liste d'attente",
refusee: "Refusée"
};

// `espace` a été retiré de la signature au lot B4 : ce hub n'en sert
// qu'un, et le paramètre ne décidait plus de rien.
function renderDossiers(applications) {

const wrap = document.getElementById("jyApps");

const enPreparation = applications.filter((app) => !STATUTS_DEPOSES.includes(app.status));

if (!enPreparation.length) {

wrap.innerHTML = applications.length
? ""
: `<div class="jy-card jy-empty">Aucun dossier en préparation pour l'instant. Fitz remplit vos places dès que votre profil lui permet de choisir — <a href="applications.html">ouvrez vos candidatures</a> pour voir ses propositions.</div>`;

return;

}

wrap.innerHTML = enPreparation.map((app) => {

// Candidature liée au catalogue : la pastille porte l'état publié par
// la fiche (`etat.ton` : ouverte / attente / close / inconnue) — plus
// jamais « Échéance dans N j » vers un cycle clos. Non liée : le
// calcul d'origine sur la date saisie, avec tonEcheance().
let echeance = "";

if (app.echeance && app.echeance.lie && app.echeance.etat) {
const etat = app.echeance.etat;
echeance = `<span class="jy-app-deadline is-${etat.ton}" title="${(etat.detail || "").replace(/"/g, "&quot;")}">${etat.etiquette} : ${etat.valeur}</span>`;
} else {
const jours = joursRestants(app.deadline, new Date());
echeance = jours === null ? "" :
`<span class="jy-app-deadline is-${tonEcheance(jours)}">${jours < 0 ? `Échéance dépassée de ${Math.abs(jours)} j` : jours === 0 ? "Échéance aujourd'hui" : `Échéance dans ${jours} j`}</span>`;
}

return `
<article class="jy-card">
<div class="jy-app-top">
<h3>${ech(app.university || "Votre candidature")}</h3>
<span class="jy-app-meta">${ech([app.scholarship, STATUS_LABELS[app.status] || ""].filter(Boolean).join(" · "))}</span>
${echeance}
</div>
<div class="jy-steps">${renderEtapesChips(app.etapes)}</div>
</article>
`;

}).join("") + `
<div class="jy-phase-actions" style="margin-bottom:14px;">
<a href="applications.html" class="jy-btn"><i data-lucide="list-checks"></i><span>Ouvrir mes candidatures</span></a>
</div>`;

}

// ==========================================================
// PHASES 4 & 5 — DÉPÔT / RÉPONSE
// ==========================================================
function renderDepot(applications) {

const wrap = document.getElementById("jyDepot");
const deposees = applications.filter((app) => STATUTS_DEPOSES.includes(app.status));

if (!deposees.length) {
wrap.innerHTML = "";
return;
}

wrap.innerHTML = `
<div class="jy-card">
<ul class="jy-list">
${deposees.map((app) => `
<li><i data-lucide="${STATUTS_REPONSE.includes(app.status) ? "mail-open" : "send"}"></i>
<span><strong>${ech(app.university || "Candidature")}</strong> — <span class="jy-status-pill ${["reponse_recue", "admise"].includes(app.status) ? "is-positive" : ""}">${STATUS_LABELS[app.status]}</span></span></li>
`).join("")}
</ul>
</div>`;

}

// Depuis le 2026-08-30 la phase 05 connaît l'ISSUE de chaque réponse
// (admise / refusée / liste d'attente) et réagit en conséquence :
// félicitations et cap sur le visa, rebond vers d'autres bourses, ou
// accompagnement de l'attente. `reponse_recue` (données existantes)
// = issue pas encore précisée → on invite à la préciser.
function renderReponse(applications, opportunitesCount) {

const wrap = document.getElementById("jyReponse");
const reponses = applications.filter((app) => STATUTS_REPONSE.includes(app.status));

if (!reponses.length) {
wrap.innerHTML = "";
return;
}

const admissions = reponses.filter((app) => app.status === "admise");
const refus = reponses.filter((app) => app.status === "refusee");
const attente = reponses.filter((app) => app.status === "liste_attente");
const aPreciser = reponses.filter((app) => app.status === "reponse_recue");

const blocs = [];

if (admissions.length) {
blocs.push(`
<div class="jy-card jy-reponse jy-reponse--admise">
<h3><i data-lucide="party-popper"></i>Félicitations — ${admissions.length > 1 ? `${admissions.length} admissions` : "vous êtes admis(e)"} !</h3>
<ul class="jy-list">
${admissions.map((app) => `<li><i data-lucide="award"></i><span><strong>${ech(app.university || "Candidature")}</strong>${app.scholarship ? ` · ${ech(app.scholarship)}` : ""} — admission confirmée.</span></li>`).join("")}
</ul>
<p class="jy-opp-reason"><i data-lucide="file-badge"></i><span>Vérifiez si la bourse est automatique ou demande une confirmation séparée, gardez les originaux de la lettre d'admission — puis cap sur le dernier kilomètre.</span></p>
<div class="jy-tools">
<a href="#phase-depart" class="jy-btn jy-btn--primary"><i data-lucide="plane"></i><span>Passer au visa &amp; départ</span></a>
<span data-feature="ai_email"><a href="ai-email.html" data-real-href="ai-email.html" class="jy-tool"><i data-lucide="mail"></i><span>Confirmer ma place par e-mail</span><i class="jy-lock" data-lucide="lock"></i></a></span>
</div>
</div>`);
}

if (attente.length) {
blocs.push(`
<div class="jy-card jy-reponse">
<h3><i data-lucide="hourglass"></i>Liste d'attente — rien n'est perdu</h3>
<ul class="jy-list">
${attente.map((app) => `<li><i data-lucide="clock"></i><span><strong>${ech(app.university || "Candidature")}</strong> — sur liste d'attente. Un court e-mail confirmant votre intérêt (et toute pièce nouvelle : résultat de test, distinction) peut faire la différence.</span></li>`).join("")}
</ul>
<div class="jy-tools">
<span data-feature="ai_email"><a href="ai-email.html" data-real-href="ai-email.html" class="jy-tool"><i data-lucide="mail"></i><span>Écrire l'e-mail d'intérêt</span><i class="jy-lock" data-lucide="lock"></i></a></span>
</div>
</div>`);
}

if (refus.length) {
blocs.push(`
<div class="jy-card jy-reponse">
<h3><i data-lucide="compass"></i>Refus — on rebondit</h3>
<ul class="jy-list">
${refus.map((app) => `<li><i data-lucide="corner-up-right"></i><span><strong>${ech(app.university || "Candidature")}</strong> — refusée. Un refus dit rarement quelque chose de votre valeur : les taux d'admission des bourses sélectives sont très bas, et votre dossier est déjà prêt à resservir.</span></li>`).join("")}
</ul>
<p class="jy-opp-reason"><i data-lucide="target"></i><span>${opportunitesCount > 0 ? `${opportunitesCount} autre${opportunitesCount > 1 ? "s" : ""} opportunité${opportunitesCount > 1 ? "s" : ""} du catalogue correspond${opportunitesCount > 1 ? "ent" : ""} à votre profil — vos lettres, traductions et relevés sont réutilisables tout de suite.` : "Le catalogue s'enrichit chaque semaine — votre dossier déjà constitué est réutilisable tout de suite."}</span></p>
<div class="jy-tools">
<a href="#phase-opportunites" class="jy-btn"><i data-lucide="compass"></i><span>Voir mes autres opportunités</span></a>
<!-- Lot R13 (2026-09-18) : « Lancer une nouvelle candidature » menait à
applications.html?action=new. Dans cet espace, c'est Fitz qui remplit les
places depuis le lot FITZ-CHOISIT : le paramètre n'ouvrait donc RIEN, et
le bouton promettait un écran qui ne venait jamais. Les propositions de
Fitz sont le lien d'à côté ; celui-ci mène à la liste. -->
<a href="applications.html" class="jy-tool"><i data-lucide="list-checks"></i><span>Ouvrir mes candidatures</span></a>
</div>
</div>`);
}

if (aPreciser.length) {
blocs.push(`
<div class="jy-card jy-reponse">
<h3><i data-lucide="mail-question"></i>Réponse reçue — précisez l'issue</h3>
<ul class="jy-list">
${aPreciser.map((app) => `<li><i data-lucide="mail-open"></i><span><strong>${ech(app.university || "Candidature")}</strong> — indiquez si c'est une admission, un refus ou une liste d'attente : votre parcours s'adaptera aussitôt.</span></li>`).join("")}
</ul>
<div class="jy-tools">
<a href="applications.html" class="jy-btn"><i data-lucide="list-checks"></i><span>Préciser dans mes candidatures</span></a>
</div>
</div>`);
}

wrap.innerHTML = blocs.join("");

}

// ==========================================================
// PHASE 6 — GUIDE VISA & DÉPART (rendu, cochable, persisté)
// ==========================================================
// L'état vit dans le champ `visaChecklist` (map id → bool) du document
// utilisateur — ids définis par VISA_ETAPES (js/journey-map.js). Cocher
// une étape re-calcule la carte du voyage en direct (rail, pastilles, %).
//
// LE CONTENU, LUI, EST RENDU ICI depuis js/visa-depart.js : le HTML ne
// porte plus qu'un conteneur vide. Deux étages — le socle générique, et
// les étapes réelles de la destination, servies telles quelles avec leur
// source et leur date.

/** Échappement : les URL et les textes passent par innerHTML. */
function ech(v) {
return String(v == null ? "" : v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/**
* La destination qui commande le guide : celle du dossier le plus
* avancé. Un étudiant admis en Italie et encore en attente au Canada
* doit lire le guide italien — c'est celui dont les délais courent.
* Sans aucun dossier, on rend null et le guide sert le socle seul.
*/
function procedureDeDepart(applications, procedureDe) {
const rang = (app) => (STATUTS_REPONSE.includes(app.status) ? 3 : STATUTS_DEPOSES.includes(app.status) ? 2 : 1);
const trie = applications.slice().sort((a, b) => rang(b) - rang(a));
for (const app of trie) {
const procedure = procedureDe(app);
if (procedure) return procedure;
}
return null;
}

/**
* Le socle : une carte par étape, avec son « pourquoi », ses actions et
* ses pièges.
*
* LE CONTENU EST TOUJOURS ÉCRIT, L'AFFICHAGE EST DÉCIDÉ PAR UNE CLASSE.
* Six cartes dépliées d'un coup faisaient neuf paragraphes avant la
* première action ; on n'en montre qu'une, celle en cours. Mais tout est
* là, dans le DOM : dévoiler une étape est instantané, et rien n'est
* refabriqué. Le bouton « Découvrir » n'appelle pas le serveur, il retire
* un cachet.
*/
function htmlEtapeSocle(etape) {
return `
<div class="jy-guide-step" data-visa-step="${ech(etape.id)}">
<h3><i data-lucide="${ech(etape.icone)}"></i><span class="jy-guide-rang">${etape.rang}</span>${ech(etape.titre)}</h3>
<p class="jy-guide-quand"><i data-lucide="clock"></i>${ech(etape.quand)}</p>
<div class="jy-guide-corps">
<p class="jy-guide-pourquoi">${ech(etape.pourquoi)}</p>
<p class="jy-guide-variante">${ech(etape.variante)}</p>
<details class="jy-guide-plus">
<summary>Ce qu'il faut faire, et ce qui fait échouer</summary>
<p class="jy-guide-soustitre">À faire, dans cet ordre</p>
<ul class="jy-guide-actions">${etape.actions.map((a) => `<li>${ech(a)}</li>`).join("")}</ul>
<p class="jy-guide-soustitre jy-guide-soustitre--alerte">Ce qui fait échouer</p>
<ul class="jy-guide-vigilance">${etape.vigilance.map((v) => `<li>${ech(v)}</li>`).join("")}</ul>
</details>
<button type="button" class="jy-visa-check" aria-pressed="false"></button>
</div>
<button type="button" class="jy-guide-devoiler"><i data-lucide="eye"></i><span>Découvrir cette étape</span></button>`;
}

/**
* Le bloc de destination : les étapes réelles du pays, dans l'ordre,
* chacune avec sa source et sa date de vérification. On ne recopie
* aucun chiffre — on sert ce que la procédure porte.
*/
function renderVisaDestination(destination) {

const bloc = document.getElementById("jyVisaDestination");
if (!bloc) return;

// Pas de bloc vide sous un titre prometteur.
if (!destination || !destination.documentee) { bloc.hidden = true; bloc.innerHTML = ""; return; }

bloc.hidden = false;
bloc.innerHTML = `
<h3><i data-lucide="map-pin"></i>Et pour ${ech(destination.pays)}, précisément</h3>
<p class="jy-destination-sub">${destination.etapes.length} étape${destination.etapes.length > 1 ? "s" : ""} de votre destination, vérifiée${destination.etapes.length > 1 ? "s" : ""} sur les sources officielles. Les délais ci-dessous sont ceux qui vous concernent vraiment.</p>
<ol class="jy-destination-list">
${destination.etapes.map((e) => `
<li>
<h4>${ech(e.titre)}</h4>
<p>${ech(texteConsigne(e))}</p>
<p class="jy-destination-src">Vérifié le ${ech(e.verifieLe)} · <a href="${ech(e.source)}" target="_blank" rel="noopener noreferrer">la source officielle</a></p>
</li>`).join("")}
</ol>`;

}

function initVisaChecklist(uid, initial, rafraichirCarte, guide) {

const etat = {};
VISA_ETAPES.forEach((id) => { etat[id] = initial && initial[id] === true; });

// Le guide est rendu AVANT d'aller chercher les cases : sans ça, les
// data-visa-step n'existent pas encore dans le DOM.
const conteneur = document.getElementById("jyVisaGuide");
if (conteneur && guide) conteneur.innerHTML = revelerEtapesVisa(guide.etapes, etat).map(htmlEtapeSocle).join("");
if (guide) renderVisaDestination(guide.destination);

const steps = Array.from(document.querySelectorAll("#jyVisaGuide [data-visa-step]"));

// Les étapes que l'étudiant a devoilees lui-même restent ouvertes : on
// ne lui reprend pas ce qu'il a choisi de voir, même quand il coche
// ailleurs et que le rang de l'étape courante se déplace.
const devoilees = new Set();

steps.forEach((step) => {
step.querySelector(".jy-guide-devoiler").addEventListener("click", () => {
devoilees.add(step.getAttribute("data-visa-step"));
peindre();
});
});

function peindre() {

const revelees = revelerEtapesVisa(guide ? guide.etapes : [], etat);
const parId = new Map(revelees.map((e) => [e.id, e.revelation]));

steps.forEach((step) => {
const id = step.getAttribute("data-visa-step");
const btn = step.querySelector(".jy-visa-check");
const fait = etat[id] === true;

step.classList.toggle("is-done", fait);

const revelation = devoilees.has(id) ? "ouverte" : (parId.get(id) || "ouverte");
for (const e of ["faite", "ouverte", "entrouverte", "scellee"]) {
step.classList.toggle(`is-${e}`, revelation === e);
}

btn.setAttribute("aria-pressed", String(fait));
btn.innerHTML = fait
? `<i data-lucide="check-circle"></i><span>Fait</span>`
: `<i data-lucide="circle"></i><span>Marquer comme fait</span>`;
});

const faites = VISA_ETAPES.filter((id) => etat[id]).length;
const restantes = VISA_ETAPES.length - faites;

// « 0 étape sur 6 accomplie » ne dit rien à qui n'a pas commencé. La
// ligne dit maintenant OÙ ON EN EST, et ce qui vient.
document.getElementById("jyVisaProgress").textContent =
faites === VISA_ETAPES.length
? "Les six démarches sont accomplies — vous êtes prêt(e) au départ. Bon voyage !"
: faites === 0
? `Six démarches vous séparent du départ. La première est ci-dessous ; les suivantes se découvrent au fur et à mesure.`
: `${faites} démarche${faites > 1 ? "s" : ""} accomplie${faites > 1 ? "s" : ""} sur ${VISA_ETAPES.length} — il vous en reste ${restantes}.`;

if (window.lucide) lucide.createIcons();

}

steps.forEach((step) => {
step.querySelector(".jy-visa-check").addEventListener("click", async () => {

const id = step.getAttribute("data-visa-step");
etat[id] = !etat[id];
peindre();
rafraichirCarte({ ...etat });

// Persistance en arrière-plan — l'interface n'attend pas le
// réseau ; en cas d'échec, l'état local reste juste et la
// prochaine visite repartira du serveur.
try {
await updateDoc(doc(db, "users", uid), { visaChecklist: { ...etat } });
} catch (error) {
console.warn("Impossible d'enregistrer la checklist visa :", error);
}

});
});

peindre();

}

// ==========================================================
// BANNIÈRES — mêmes règles qu'avant la refonte
// ==========================================================
function renderFitzExpressBanner(planId, hasFitzExpress, fitzExpressExpiresAt) {

const banner = document.getElementById("fitzExpressBanner");

if (!hasFitzExpress || planId !== "gratuit" || !fitzExpressExpiresAt) {
banner.hidden = true;
return;
}

const expiry = new Date(fitzExpressExpiresAt);
if (isNaN(expiry)) { banner.hidden = true; return; }

const daysLeft = Math.max(0, Math.ceil((expiry.getTime() - Date.now()) / 86400000));
document.getElementById("fitzExpressDaysLeft").textContent =
daysLeft <= 1 ? "moins d'1 jour" : `${daysLeft} jours`;

banner.hidden = false;

}

function renderUpgradeNudge(planId, testerAccess) {

const section = document.getElementById("upgradeNudge");
if (!section) return;

if (testerAccess) { section.hidden = true; return; }

const next = nextPlanId(planId);
const hasPlanData = typeof SCHOLARBRIDGE_PLANS !== "undefined" && SCHOLARBRIDGE_PLANS[next];

if (!next || !hasPlanData) { section.hidden = true; return; }

document.getElementById("upgradeCurrentPlan").textContent = PLAN_LABELS[planId];
document.getElementById("upgradeNextPlan").textContent = PLAN_LABELS[next];

// En ligne plutôt qu'en liste à puces : la montée en gamme est une
// note de bas de parcours, pas une section qui rivalise avec les
// phases (refonte 2026-08-30).
document.getElementById("upgradeHighlightsInline").textContent =
(SCHOLARBRIDGE_PLANS[next].highlights || []).slice(0, 2).join(" · ") + ".";

document.getElementById("upgradeCta").setAttribute("href", `offers.html#${next}`);

section.hidden = false;

}

// ==========================================================
// AMORÇAGE
// ==========================================================
initShellChrome();

// CE FICHIER EST LE MOTEUR DU HUB DES BOURSES, ET DE LUI SEUL
// (lot B4, 2026-09-18).
//
// Au lot S4 il servait deux hubs, et lisait donc son espace dans le
// <body data-espace>. La refonte de la préinscription lui a retiré le
// second : espace-preinscription.html porte la ROUTE
// (espace-preinscription.js), pas ce hub. Vérifié plutôt que supposé,
// au lot R13 puis de nouveau ici, sur le site déployé — un seul fichier
// charge ce script, espace-bourse.html, et il déclare `data-espace
// ="bourse"`. Un test l'exige (test/espace-etudiant.test.mjs, « bug 10 »)
// et tombera le jour où une autre page le chargera.
//
// Lire l'espace dans la page laissait donc vivre des branches
// « préinscription » que rien n'atteignait — un vocabulaire fantôme
// qu'une prochaine passe aurait cru servi à quelqu'un. Le contrat est
// maintenant écrit : ce hub est celui des bourses. Les branches mortes
// sont parties avec lui.
//
// Le nom du fichier est resté : une trentaine de tests, le harnais et
// les pages le référencent, et le renommer serait un lot à soi.
const ESPACE = "bourse";

// UN CLIENT DES DEUX ESPACES NE SE FAIT PAS RENVOYER DANS L'AUTRE.
// Le moteur de la route (espace-preinscription.js, lot R2) dépose dans
// sessionStorage l'étape où l'étudiant se trouve, pour que le « ←
// Mon parcours » des pages d'outils y revienne. Entrer ici veut dire
// qu'il travaille maintenant côté bourses : la note n'a plus cours.
try { sessionStorage.removeItem("fitz_retour"); } catch (error) { /* rien à effacer */ }

bootstrapShell({ espace: ESPACE }).then(async (session) => {

if (!session) return;

const { user, userData, profile, planId, featureFlags, testerAccess, hasFitzExpress } = session;

// Migration héritée (ai-letter.js écrivait sous une autre clé) —
// conservée telle quelle, voir l'historique du fichier.
const legacyDocuments = readStorage("documents", null);
if (legacyDocuments && legacyDocuments.length) {
const merged = [...legacyDocuments, ...readStorage("generatedDocuments", [])];
localStorage.setItem("generatedDocuments", JSON.stringify(merged));
localStorage.removeItem("documents");
}

// ---- Bannières d'événement (création de compte, activation) ----
if (sessionStorage.getItem("just_created") === "true") {
document.getElementById("welcomeAlert").hidden = false;
sessionStorage.removeItem("just_created");
}

if (sessionStorage.getItem("just_upgraded")) {
document.getElementById("accompagnementAlertTitle").textContent =
`Votre accompagnement ${sessionStorage.getItem("just_upgraded")} est activé.`;
document.getElementById("accompagnementAlert").hidden = false;
sessionStorage.removeItem("just_upgraded");
}

const emailNudge = document.getElementById("emailNudge");
if (emailNudge) emailNudge.hidden = userData.emailNotifications === true;

renderFitzExpressBanner(planId, hasFitzExpress, userData.fitzExpressExpiresAt || null);
renderUpgradeNudge(planId, testerAccess);

// « Mon conseiller » en phase 06 — visible seulement pour les forfaits
// avec humain, même règle que partout (isFeatureLocked).
const advisorBtn = document.getElementById("jyAdvisorBtn");
if (advisorBtn) {
advisorBtn.hidden = isFeatureLocked(planId, featureFlags, "advisor", testerAccess, hasFitzExpress, session.planPreinscriptionId);
}

// Diagnostic France en phase 02 — RETIRÉ du DOM si le droit est fermé,
// pas masqué : `hidden` laisserait le lien dans l'arbre, donc dans la
// tabulation d'un lecteur d'écran et dans un Ctrl+F. Pour un produit
// d'une autre grille, être annoncé puis inaccessible est pire que ne
// pas être annoncé. Voir le commentaire de la carte dans dashboard.html.
const diagBtn = document.getElementById("jyDiagnosticFranceBtn");
if (diagBtn && isFeatureLocked(planId, featureFlags, "diagnostic_france", testerAccess, hasFitzExpress, session.planPreinscriptionId)) {
diagBtn.remove();
}

// ---- Données du parcours ----
const profileScore = calculateAiScore(profile);

let applications = [];
try {
const applicationsSnap = await getDocs(collection(db, "users", user.uid, "applications"));
applications = applicationsSnap.docs
.map((d) => ({ id: d.id, ...d.data() }))
// LOT S4 : un hub ne montre que les candidatures de SON espace. Un
// client qui a les deux accompagnements a deux parcours distincts, pas
// une liste mélangée où un dossier de préinscription vient s'intercaler
// entre deux bourses — et le rail des phases mesurerait alors un
// parcours qui n'existe pas.
.filter((app) => lireParcours(app) === ESPACE);
} catch (error) {
console.error("Impossible de charger les candidatures :", error);
}

// LES PORTAILS NE METTENT PAS TOUT LE PARCOURS EN OTAGE.
//
// `chargerPortails()` ne rejette jamais (il avale ses erreurs et rend
// null) — mais il ATTEND : un import cross-origin depuis gstatic, puis
// un appel callable dont le SDK Firebase laisse tourner 70 secondes par
// défaut. Or js/app-shell.js retire le loader AVANT de résoudre sa
// promesse : pendant toute cette attente la page est VISIBLE, et le
// repli par défaut du CSS ne montre que six en-têtes de phase nus. Un
// réseau qui filtre gstatic (le cas décrit dans js/icones.js pour
// unpkg) ou un démarrage à froid de la fonction aurait donc affiché un
// hub mort, sans message et sans bouton, pour une donnée qui ne décore
// que trois liens.
//
// On borne donc l'attente. Le dépassement a déjà un comportement
// défini : portailsDisponibles() reste faux, et la carte se rend
// exactement comme pour un visiteur.
const DELAI_PORTAILS = 4000;

const [opps] = await Promise.all([
chargerOpportunites(
profile,
new Set(applications.map((app) => app.universityId).filter(Boolean))
),
Promise.race([
chargerPortails(),
new Promise((resoudre) => setTimeout(resoudre, DELAI_PORTAILS))
])
]);

// Étapes réelles de chaque dossier — calculées UNE fois, réutilisées
// par la prochaine action, les phases et les cartes. Et, depuis la
// passe 1/3, l'état publié par la fiche du catalogue (`echeance`) :
// posé AVANT tout rendu, lu par next-action.js, journey-map.js
// (radar) et renderDossiers. Sans catalogue, `echeance` reste absent
// et tout se calcule comme avant sur la date saisie.
// Lot E2 : la procédure de portail d'une préinscription (même règle
// que applications.js : université du catalogue ou URL du portail,
// résidence du profil).
const procedureDe = (app) => {
const uni = opps.index && app.universityId ? opps.index.uniParId.get(app.universityId) : null;
return trouverProcedure({
paysDestination: (uni && uni.country) || "",
portailUrl: app.portalUrl || (uni && uni.applicationPortalUrl) || "",
paysResidence: (profile && (profile.originCountry || profile.country)) || ""
});
};

applications = applications.map((app) => ({
...app,
etapes: computeJourneySteps(app, { profileScore, documentsObtained: userData?.documentsObtained || {}, procedure: procedureDe(app) }),
echeance: opps.index ? etatDeLaCandidature(app, opps.index) : null
}));

// ---- La carte du voyage ----
const visaChecklist = userData.visaChecklist || {};
const nomAffiche = user.displayName || userData.name || "Étudiant";

// Re-calcule et re-peint la carte (rail, pastilles, salutation) — la
// checklist visa la rappelle à chaque étape cochée, pour que la
// phase 06 vive comme les autres.
// LE QUOTA DE L'ESPACE OÙ L'ON SE TROUVE — une seule lecture, ici.
// Côté bourses c'est `maxAccompaniedApplications`, côté préinscription
// `maxPreinscriptions` : les deux ne se remplacent pas l'un l'autre
// (7 vœux Campus France n'est pas une décision commerciale, c'est le
// plafond du portail). Un accès test n'a pas de formule : le quota est
// alors null, et l'espace retombe sur son comportement d'exploration.
const quota = testerAccess ? null : quotaDeLaFormule({
espace: ESPACE,
planId,
planPreinscriptionId: session.planPreinscriptionId || "",
plans: typeof SCHOLARBRIDGE_PLANS !== "undefined" ? SCHOLARBRIDGE_PLANS : null
});

const nomFormule = PLAN_LABELS[planId] || "";

function rafraichirCarte(visa) {
const etat = etatDesPhases({ profileScore, applications, visaChecklist: visa, espace: ESPACE });
renderHello(nomAffiche, etat.phases);
// Les pastilles et les voiles d'abord : renderPhases rend les phases
// enrichies de leur état de révélation, dont le rail se sert pour
// estomper ce qui n'est pas encore atteint.
const revelees = renderPhases(etat.phases, {
espace: ESPACE,
profileScore,
candidatures: applications.length,
deposees: applications.filter((a) => STATUTS_DEPOSES.includes(a.status)).length,
reponses: applications.filter((a) => STATUTS_REPONSE.includes(a.status)).length,
visaFaites: VISA_ETAPES.filter((id) => visa && visa[id]).length,
visaTotal: VISA_ETAPES.length
});
renderRail(revelees, etat.progressionPct);
// Le rail et les pastilles viennent d'être re-injectés : leurs
// icônes doivent être re-transformées ici même (le createIcons de
// fin d'amorçage est déjà passé lors d'un rafraîchissement).
if (window.lucide) lucide.createIcons();
return etat;
}

rafraichirCarte(visaChecklist);

// LE PARCOURS EST PEINT — le CSS peut cesser de tout replier.
// Entre hideLoader() (js/app-shell.js, avant même la résolution de la
// promesse) et cette ligne, il y a deux allers-retours réseau : les
// candidatures, puis le catalogue entier. Pendant tout ce temps la page
// est VISIBLE. Sans repli par défaut en CSS, l'étudiant voyait les six
// phases dépliées — exactement les neuf écrans que ce lot supprime —
// avant de les voir s'effondrer d'un coup. On replie par défaut, et
// c'est l'arrivée des données qui ouvre.
document.body.dataset.parcoursPret = "1";

renderRadar(applications);

// La prochaine action ne se calcule que sur les dossiers ENCORE EN
// PRÉPARATION : une candidature déjà déposée n'a plus de checklist à
// pousser — sans ce filtre, une échéance passée sur un dossier déposé
// déclenchait un « À faire maintenant » à contresens (constaté sur la
// session de test du 2026-08-30, candidature Waseda en attente de
// réponse dont la date limite était passée).
renderProchaineAction(prochaineAction({
profileScore,
applications: applications.filter((app) => !STATUTS_DEPOSES.includes(app.status)),
opportunitesCount: opps.count
}));

renderProfil(profileScore);
renderOpportunites(opps, profileScore, {
espace: ESPACE,
quota,
dejaSuivies: applications.length,
nomFormule
});
renderDossiers(applications);
renderDepot(applications);
renderReponse(applications, opps.count);

// Les cartes de réponse viennent d'insérer des [data-feature] : on
// re-applique les verrous de formule sur ce DOM neuf.
// 5e argument (planPreinscriptionId) ajoute le 2026-09-08 : sans lui,
// ce second passage REVERROUILLAIT ce que le premier avait ouvert pour
// un forfait preinscription. Les cartes de reponse sont injectees apres
// coup ; leurs [data-feature] repassaient ici avec un argument de moins,
// donc evalues sur la seule formule bourse.
applyFeatureLocks(planId, featureFlags, testerAccess, hasFitzExpress, session.planPreinscriptionId);

initVisaChecklist(user.uid, visaChecklist, rafraichirCarte, guideVisaPour({
espace: ESPACE,
procedure: procedureDeDepart(applications, procedureDe)
}));

if (window.lucide) lucide.createIcons();

}).catch((erreur) => {

// LE PARCOURS NE RESTE JAMAIS REPLIÉ SUR UNE ERREUR.
// Cette chaîne n'avait aucun `.catch`. Une exception levée n'importe où
// dans le rendu laissait une rejection non gérée en console ET —
// depuis que le CSS replie par défaut — six en-têtes de phase nus,
// sans un mot. On journalise, et on lève le repli : ce qui a été peint
// avant l'erreur devient au moins lisible.
console.error("Le parcours n'a pas pu être rendu en entier :", erreur);
document.body.dataset.parcoursPret = "1";

});
