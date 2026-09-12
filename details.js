import { db } from "./firebase-config.js";

import {
doc,
getDoc,
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// Instantané statique du catalogue (2026-09-03) : la fiche lit son
// programme, son université et sa bourse dans assets/data/catalogue.json
// quand il est là — 0 lecture Firestore — et retombe sur getDoc sinon.
// Voir l'en-tête de js/catalog-snapshot.js.
import { documentDuCatalogue } from "./js/catalog-data.js";

import { trackEvent } from "./js/analytics.js";
import { resolveSession, fetchFeatureFlags, isFeatureLocked } from "./js/access-guard.js";

import { resolveCityImage } from "./js/scholarship-image.js";

import { trouverProcedure } from "./js/procedures/index.js";
// Lot S3 : le portail de candidature ne vient plus du catalogue public
// (il en a été retiré), mais de la Cloud Function `portails`, qui
// vérifie l'abonnement avant de rendre quoi que ce soit.
import { chargerPortails, portailUniversite, portailBourse } from "./js/portails.js";
import { etatCandidature } from "./js/echeance.js";
import { estEligible, libelleEligibilite, paysAvecArticle } from "./js/eligibility-countries.js";
import { computeAge, respecteLimiteAge, libelleLimiteAge } from "./js/age-limits.js";

// Bloc « Votre situation face à cette bourse » (2026-08-31) : tout est
// déjà écrit ailleurs, on ne fait qu'appeler. explainMatch est la même
// fonction qui explique les recommandations du tableau de bord, et
// createApplicationFromRecommendation la même écriture que le bouton
// « Candidater » — jamais une seconde façon de faire la même chose.
import { lireExigences, groupees, ORDRE_FORMES } from "./js/exigences.js";
import { explainMatch } from "./js/recommend-programs.js";
import { createApplicationFromRecommendation } from "./js/application-actions.js";
import { isQuotaReached } from "./js/plan-features.js";

// ===============================
// Paramètres URL
// ===============================
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

// Le bloc « Avant de candidater — Fitz peut analyser votre compatibilité
// avec cette université » a quitté la fiche avec le lot VITRINE-COMMERCIALE
// (2026-09-11, décision de Charles) : le diagnostic général suffit.
// computeCompatibility(), renderDiagnostic(), renderDiagnosticPrompt() et
// buildReturnUrl() sont partis avec lui — sans laisser de code mort.

// Transmet le programme (et le score de compatibilité, une fois connu)
// aux 3 CTA de cette page qui mènent à offers.html — sans ça, cliquer
// "Choisir ma formule" perdait le contexte ("cette université précise",
// "ce diagnostic") au moment où il aurait le plus servi l'argument
// (audit du 2026-08-10).
function buildOffersUrl(programId, score) {

// Grille A : une fiche bourse mène à la grille bourses.
const searchParams = new URLSearchParams({ parcours: "bourse", program: programId });

if (typeof score === "number") searchParams.set("score", score);

return `offers.html?${searchParams.toString()}`;

}

// ===============================
// Bailleur de la bourse (2026-08-30) — funder / funderName /
// entryPoint / scholarshipWebsite / generalCriteria, saisis dans
// admin/scholarships.html. Sémantique de entryPoint (la porte qui
// vient EN PREMIER dans le parcours réel du candidat) :
//   "bourse"     -> le dossier se dépose chez le BAILLEUR (portail
//                   d'État, ambassade, site de la fondation).
//                   L'université vient après, ou se déclare en vœux.
//                   Typique de funder=gouvernement et
//                   funder=organisation.
//   "universite" -> le dossier se dépose auprès de l'ÉTABLISSEMENT ;
//                   la bourse est souvent une case du dossier
//                   d'admission, ou s'attribue après admission.
//                   Typique de funder=universite et funder=region
//                   (bourses italiennes de droit à l'étude : admission
//                   d'abord, bourse sur revenus ISEE ensuite).
//   absent       -> INCONNU, jamais une valeur par défaut (même règle
//                   des trois valeurs que estEligible).
// ===============================

// Le bouton « portail du bailleur » n'apparaît que si la BOURSE porte
// un site officiel (scholarshipWebsite — jamais celui de l'université).
// Sans site : il reste hidden. On n'affiche RIEN plutôt qu'un lien mort
// ou un « bailleur non renseigné ».
// DEUX conditions depuis le 2026-08-31 : la bourse porte un site
// officiel ET le visiteur est abonné. Ce bouton était public depuis le
// 2026-08-30 — une déduction, jamais une demande : un non-abonné ne
// doit voir qu'un seul lien, le site de l'université.
// LOT S3 : `portailBourse()` d'abord, `scholarshipWebsite` ensuite.
// Le champ neuf scholarships.applicationPortalUrl est le lieu où l'on
// DÉPOSE ; officialWebsite est la page du bailleur, qui fait
// aujourd'hui le travail des deux et se trompe donc une fois sur deux
// (jica.go.jp/…/internship.html est une page d'information,
// aims.edu.gh/application/… un vrai portail). Le champ neuf est vide
// sur les 156 bourses tant que le lot de données n'a pas eu lieu — ce
// bouton se comporte donc EXACTEMENT comme avant, et se corrigera tout
// seul, bourse par bourse, au fil du remplissage. Voir
// scripts/data/triage-portails-bourses.mjs.
function configurerPortailBailleur(university, funderBtn, funderLabelEl, isPaidUser) {

const lien = portailBourse(university.scholarshipId) || university.scholarshipWebsite;

if (!funderBtn || !isPaidUser || !lien) return;

funderBtn.href = lien;

if (funderLabelEl) {
funderLabelEl.textContent = "Accéder au portail officiel de la bourse" + (university.funderName ? ` — ${university.funderName}` : "");
}

funderBtn.hidden = false;

}

// Ordonne les liens du bloc « avancer par vous-même » selon entryPoint :
// "bourse" place le portail du bailleur EN PREMIER (c'est là que le
// dossier se dépose) ; "universite" ou absent laisse l'ordre actuel
// (#universityPortalBtn puis #applyBtn) et range le portail bailleur en
// dernier. Déplacement de nœud (insertBefore), jamais CSS `order` :
// l'ordre de tabulation clavier doit suivre l'ordre visuel.
function ordonnerPortails(entryPoint, funderBtn, universityBtn, lockedNote) {

const parent = funderBtn && funderBtn.parentNode;

if (!parent || !universityBtn) return;

if (entryPoint === "bourse") {
parent.insertBefore(funderBtn, universityBtn);
} else {
parent.insertBefore(funderBtn, lockedNote || null);
}

}

// Phrase d'orientation au-dessus des liens : ne remplace le texte
// générique du HTML que quand entryPoint est RENSEIGNÉ — absent, on ne
// devine rien et la phrase actuelle reste telle quelle ("" ici).
//
// `portailBailleurVisible` (2026-08-31) vaut
// `isPaidUser && !!university.scholarshipWebsite` : faux pour tout
// visiteur, et faux aussi pour un abonné sur une bourse sans site
// officiel. Sans ce second paramètre, un visiteur lisait « le dossier
// ne se dépose PAS auprès de l'université » juste au-dessus d'un
// bouton qui mène à l'université — l'information était vraie, mais la
// page se contredisait : on annonçait une porte, et la seule visible
// était l'autre. On GARDE donc l'information, on change la formulation
// pour qu'elle désigne ce qui est réellement à l'écran.
function phraseOrientationPortails(entryPoint, portailBailleurVisible) {

if (entryPoint === "bourse") {
return portailBailleurVisible
? "Le dossier se dépose auprès du bailleur, pas auprès de l'université."
: "Le dossier de cette bourse se dépose auprès du bailleur. Le lien ci-dessous mène à l'établissement d'accueil.";
}

if (entryPoint === "universite") return "Le dossier se dépose auprès de l'université ; la bourse s'attribue dans le cadre de l'admission.";

return "";

}

// L'âge du profil dépasse-t-il le plafond ageMax sur TOUS les cycles
// que ce programme mentionne ? university.level peut en lister
// plusieurs ("Licence / Master / Doctorat" pour un programme flexible
// comme MEXT) : on n'avertit que si CHAQUE cycle reconnu répond false
// (respecteLimiteAge, js/age-limits.js) — un seul cycle encore possible
// ou inconnu (null), et on ne dit rien. Aucun niveau reconnu dans le
// texte -> false : on n'avertit jamais sur un « on ne sait pas ».
function depasseLimiteAgePartout(ageMax, age, levelText) {

const niveaux = ["Licence", "Master", "Doctorat"]
.filter((n) => String(levelText || "").toLowerCase().includes(n.toLowerCase()));

if (!niveaux.length) return false;

return niveaux.every((n) => respecteLimiteAge(ageMax, age, n) === false);

}

// ===============================
// « Votre situation face à cette bourse » — bloc RÉSERVÉ AUX ABONNÉS
// (2026-08-31). Ces trois fonctions sont PURES : elles décident quoi
// écrire, sans toucher au DOM ni à Firestore, pour être vérifiables
// hors navigateur (test/details-situation.test.mjs).
//
// Elles n'inventent aucun moteur : estEligible, respecteLimiteAge,
// libelleLimiteAge et explainMatch existent déjà et sont appelées
// telles quelles.
// ===============================

// RÈGLE ABSOLUE, la même que partout ailleurs : null n'est PAS « oui ».
// On n'écrit jamais « vous êtes éligible » sur un inconnu — on dit
// qu'aucune restriction n'est connue, ce qui est autre chose.
export function verdictNationalite(eligibility, nationalite) {

if (!nationalite) {
return { ton: "invitation", texte: "Renseignez votre nationalité pour savoir si cette bourse vous est ouverte.", lien: "profile.html" };
}

const verdict = estEligible(eligibility, nationalite);

if (verdict === true) return { ton: "favorable", texte: `Ouverte à votre nationalité (${nationalite})` };
if (verdict === false) return { ton: "defavorable", texte: `Fermée aux ressortissants ${paysAvecArticle(nationalite)}` };

return { ton: "neutre", texte: "Aucune restriction de nationalité connue pour cette bourse" };

}

// null -> on ne rend RIEN (surtout pas « aucune limite d'âge » : le
// champ absent est un inconnu, pas une absence de plafond).
export function verdictAge(ageMax, birthDate, niveau) {

const libelle = libelleLimiteAge(ageMax);

if (!libelle) return null;

if (!birthDate) {
return { ton: "invitation", texte: `Cette bourse fixe une limite d'âge (${libelle}) — renseignez votre date de naissance pour savoir où vous en êtes.`, lien: "profile.html" };
}

const verdict = respecteLimiteAge(ageMax, computeAge(birthDate), niveau);

if (verdict === true) return { ton: "favorable", texte: `Dans les limites d'âge (${libelle})` };
if (verdict === false) return { ton: "defavorable", texte: `Au-delà du plafond (${libelle})` };

return null;

}

// Un cadre vide sur une fonctionnalité payante est pire que pas de
// cadre : sans raison à afficher, on dit franchement ce qui manque.
export function messageRaisonsVides(raisons) {

return Array.isArray(raisons) && raisons.length
? null
: "Votre profil ne contient pas encore assez d'éléments pour évaluer cette bourse.";

}

// « Conditions à connaître » — le champ generalCriteria de la bourse :
// information DISQUALIFIANTE (pays non partenaires, filières exclues,
// dates de clôture réelles), affichée avant les détails pratiques.
// textContent, jamais innerHTML : texte libre saisi en admin. La
// section reste hidden tant que le champ est vide ou absent.
function afficherCriteresGeneraux(texte, sectionEl, texteEl) {

const t = (texte || "").trim();

if (!sectionEl || !texteEl || !t) return;

texteEl.textContent = t;
sectionEl.hidden = false;

}

// « Comment cette bourse se demande » — le champ `exigences`, lu par le
// même module que l'espace connecté (js/exigences.js) pour que la fiche
// publique et la carte de candidature disent EXACTEMENT la même chose de
// la même bourse.
//
// La voie de dépôt passe en premier et en gras : sur 27 bourses,
// l'étudiant ne dépose pas lui-même, et l'ignorer lui fait surveiller un
// portail qui ne le concerne pas.
//
// Règle des trois valeurs : sans exigence exploitable, la section reste
// hidden. Un code inconnu est écarté par lireExigences(), jamais rendu
// brut sur une page publique.
function afficherExigences(bourse, sectionEl, contenuEl) {

if (!sectionEl || !contenuEl) return;

const codes = lireExigences(bourse);

if (!codes.length) return;

const g = groupees(codes);

contenuEl.innerHTML = "";

for (const forme of ORDRE_FORMES) {

for (const e of g[forme]) {

const bloc = document.createElement("div");
bloc.className = `details-exigence details-exigence--${forme}`;

const titre = document.createElement("strong");
titre.textContent = e.libelle;

const texte = document.createElement("p");
// textContent, jamais innerHTML : ces libellés sont des constantes du
// code, mais la règle de cette page ne souffre pas d'exception.
texte.textContent = e.explication;

bloc.append(titre, texte);
contenuEl.append(bloc);

}

}

sectionEl.hidden = false;

}

// Met à jour les 2 CTA statiques de la page (sidebar + nudge de retour
// portail) avec le programme courant. Le paramètre `score` reste
// accepté (buildOffersUrl le transmet à offers.html), mais plus rien ne
// le fournit depuis le retrait du diagnostic par université (lot
// VITRINE-COMMERCIALE, 2026-09-11).
function updateFitzCtas(programId, score) {

const primary = document.getElementById("fitzCtaPrimary");
const nudge = document.getElementById("fitzCtaNudge");

const url = buildOffersUrl(programId, score);

if (primary) primary.href = url;
if (nudge) nudge.href = url;

}

// ===============================
// Nudge au retour du portail — n'apparaît que si l'étudiant a
// effectivement cliqué sur le lien du portail avant de revenir sur
// l'onglet, pas à chaque changement d'onglet anodin.
// ===============================
// Fenêtre de validité du nudge : au-delà, un retour sur l'onglet n'a
// plus grand-chose à voir avec ce clic précis (l'étudiant est probablement
// revenu pour une tout autre raison) — évite un nudge hors contexte
// après une longue absence.
const PORTAL_NUDGE_MAX_AGE_MS = 30 * 60 * 1000;

function initPortalNudge() {

const nudge = document.getElementById("portalNudge");
const closeBtn = document.getElementById("portalNudgeClose");
const applyBtn = document.getElementById("applyBtn");

let portalOpenedAt = null;

applyBtn.addEventListener("click", () => {

// Ne pose le marqueur que si un vrai portail est sur le point de
// s'ouvrir (href réel) — pas sur le cas où applicationUrl est encore
// absent, où ce même clic ne fait qu'afficher une alerte "lien à
// venir" (voir plus bas) sans jamais quitter l'onglet : sans cette
// condition, n'importe quel changement d'onglet ultérieur déclenchait
// à tort "De retour du portail ?" alors qu'aucun portail n'a été
// ouvert.
const href = applyBtn.getAttribute("href");

if (href && href !== "#") {
portalOpenedAt = Date.now();
}

});

document.addEventListener("visibilitychange", () => {

if (document.visibilityState !== "visible" || !portalOpenedAt) return;

const withinWindow = Date.now() - portalOpenedAt < PORTAL_NUDGE_MAX_AGE_MS;

portalOpenedAt = null;

if (!withinWindow) return;

nudge.hidden = false;

if (window.lucide) lucide.createIcons();

});

closeBtn.addEventListener("click", () => {
nudge.hidden = true;
});

}

// ===============================
// Chargement de l'université
// ===============================

// État d'erreur (2026-08-29) — remplaçait auparavant document.body
// ENTIER par deux lignes de texte brut : plus d'en-tête, plus de
// styles, aucun lien de sortie. Un visiteur arrivé ici depuis un
// vieux lien ou un favori était dans une impasse. On garde désormais
// la page telle quelle et on ne remplace que le contenu de <main>,
// avec deux portes de sortie vers le catalogue (classes .btn de
// css/base.css, chargée par cette page).
function afficherErreur(titre, message) {

const main = document.getElementById("detailsMain");
if (!main) return;

main.innerHTML = `
<div style="max-width:560px;margin:0 auto;padding:140px 24px 96px;text-align:center;">
<h1 style="margin-bottom:12px;">${titre}</h1>
<p style="color:var(--text-light);margin-bottom:28px;">${message}</p>
<div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
<a href="scholarships.html" class="btn btn-primary">Voir les bourses</a>
<a href="universities.html" class="btn btn-secondary">Voir les universités</a>
</div>
</div>
`;
main.hidden = false;

document.title = `${titre} | FitzUniverse`;

}

// ===============================
// « Votre situation face à cette bourse » — assemblage.
//
// Ne calcule rien lui-même : il appelle les modules existants et pose
// leurs réponses dans le DOM. Toute erreur est absorbée — ce bloc est
// un bonus d'abonné, il ne doit jamais empêcher la fiche de s'afficher.
// ===============================
async function rendreSituation({ session, university, program, universityProfile, scholarshipData }) {

const section = document.getElementById("situationSection");
if (!section) return;

const profile = (session && session.profile) || {};
const verdictsEl = document.getElementById("situationVerdicts");

// --- Verdicts nationalité et âge.
const verdicts = [
verdictNationalite(university.eligibility, profile.nationality || ""),
verdictAge(university.ageMax, profile.birthDate || "", university.level)
].filter(Boolean);

if (verdictsEl) {
verdictsEl.innerHTML = "";
for (const v of verdicts) {
const li = document.createElement("li");
li.className = `situation-verdict is-${v.ton}`;
li.textContent = v.texte;
if (v.lien) {
li.append(" ");
const a = document.createElement("a");
a.href = v.lien;
a.textContent = "Compléter mon profil";
li.appendChild(a);
}
verdictsEl.appendChild(li);
}
}

// --- Raisons de correspondance : explainMatch(), la fonction qui
// explique déjà les recommandations du tableau de bord. Aucun second
// calcul, aucune phrase réécrite ici.
const raisons = explainMatch(program, universityProfile, scholarshipData, profile) || [];
const messageVide = messageRaisonsVides(raisons);

const reasonsEl = document.getElementById("situationReasons");
const listEl = document.getElementById("situationReasonsList");
const emptyEl = document.getElementById("situationEmpty");

if (messageVide) {
if (emptyEl) {
emptyEl.textContent = messageVide + " ";
const a = document.createElement("a");
a.href = "profile.html";
a.textContent = "Compléter mon profil";
emptyEl.appendChild(a);
emptyEl.hidden = false;
}
} else if (reasonsEl && listEl) {
listEl.innerHTML = "";
for (const raison of raisons) {
const li = document.createElement("li");
li.textContent = raison;
listEl.appendChild(li);
}
reasonsEl.hidden = false;
}

// --- Actions : parcours et lettre.
await brancherActionsSituation({ session, university });

section.hidden = false;

if (window.lucide) lucide.createIcons();

}

// Boutons « Ajouter à mon parcours » et « Rédiger ma lettre avec Fitz ».
// Le quota est vérifié par l'appelant, comme le veut le contrat de
// createApplicationFromRecommendation() : isQuotaReached() vit dans
// js/plan-features.js et le plafond dans window.SCHOLARBRIDGE_PLANS.
async function brancherActionsSituation({ session, university }) {

const addBtn = document.getElementById("addToJourneyBtn");
const letterBtn = document.getElementById("letterBtn");
const notice = document.getElementById("situationNotice");

const direNotice = (texte, href, libelle) => {
if (!notice) return;
notice.textContent = texte + (href ? " " : "");
if (href) {
const a = document.createElement("a");
a.href = href;
a.textContent = libelle;
notice.appendChild(a);
}
notice.hidden = false;
};

// Le drapeau `applications` existe déjà : s'il est fermé pour cette
// formule, aucun bouton de parcours n'apparaît.
let flags = null;
try {
flags = await fetchFeatureFlags();
} catch { /* valeurs par défaut : on ne bloque pas la fiche */ }

const parcoursVerrouille = flags
? isFeatureLocked(session.planId, flags, "applications", session.testerAccess, session.hasFitzExpress, session.planPreinscriptionId)
: false;

if (parcoursVerrouille) {
direNotice("Le suivi de candidatures n'est pas inclus dans votre formule.", "offers.html", "Voir les formules");
return;
}

// Candidatures existantes : sert à la fois au quota et à la détection
// d'un doublon sur ce couple (université, bourse) — mêmes champs que
// ceux écrits par createApplicationFromRecommendation().
let candidatures = [];
try {
const snap = await getDocs(collection(db, "users", session.user.uid, "applications"));
candidatures = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
} catch {
direNotice("Vos candidatures n'ont pas pu être lues pour le moment.");
return;
}

const memeCouple = (a) =>
(a.university || "").trim().toLowerCase() === (university.university || "").trim().toLowerCase() &&
(a.scholarship || "").trim().toLowerCase() === (university.scholarship || "").trim().toLowerCase();

const existante = candidatures.find(memeCouple);

// --- Déjà dans le parcours : pas de doublon, on montre la sortie.
if (existante) {
direNotice("Déjà dans votre parcours.", "applications.html", "Voir mes candidatures");
if (letterBtn) {
letterBtn.href = `ai-letter.html?applicationId=${encodeURIComponent(existante.id)}`;
letterBtn.hidden = false;
}
return;
}

const plan = window.SCHOLARBRIDGE_PLANS && window.SCHOLARBRIDGE_PLANS[session.planId];
const quota = plan ? plan.maxAccompaniedApplications : null;

// --- Quota atteint : message clair et chemin de sortie, jamais un
// bouton qui échouerait en silence.
if (isQuotaReached(quota, candidatures.length)) {
direNotice(`Votre formule couvre ${quota} candidature${quota > 1 ? "s" : ""} accompagnée${quota > 1 ? "s" : ""}, toutes utilisées.`, "offers.html", "Augmenter mon quota");
return;
}

if (!addBtn) return;

addBtn.hidden = false;

// Le bouton lettre crée d'abord la candidature, puis navigue : la
// logique de pré-remplissage vit dans ai-letter.js (?applicationId=),
// jamais dupliquée ici.
const creerPuis = async (apres) => {
addBtn.disabled = true;
try {
const nouvelId = await createApplicationFromRecommendation(session.user.uid, {
universityName: university.university,
scholarshipTitle: university.scholarship
}, {
// Créneaux anti-triche (2026-09-02) : la création vise l'id
// "slot-N" borné par firestore.rules — voir application-actions.js.
existingApplications: candidatures,
quota
});
trackEvent("application_created_from_details", { university: university.university, country: university.country });
apres(nouvelId);
} catch {
addBtn.disabled = false;
direNotice("La candidature n'a pas pu être créée. Réessayez dans un instant.");
}
};

addBtn.addEventListener("click", () => creerPuis(() => {
window.location.href = "applications.html";
}));

if (letterBtn) {
letterBtn.hidden = false;
letterBtn.href = "#";
letterBtn.addEventListener("click", (event) => {
event.preventDefault();
creerPuis((nouvelId) => {
window.location.href = `ai-letter.html?applicationId=${encodeURIComponent(nouvelId)}`;
});
});
}

}

async function chargerUniversite() {

try {

if (!id) {
throw new Error("ID du programme manquant.");
}

// Architecture relationnelle (2026-07-30) : cette page affiche un
// PROGRAMME précis (université × bourse × niveau), pas un profil
// d'université brut — "programs" porte les données propres à cette
// offre (deadline, portail, langue...), jointes ici à son université
// et à sa bourse pour l'affichage.
// Un document du catalogue : l'instantané d'abord (undefined = pas
// d'instantané → getDoc, exactement comme avant), null = absent.
async function lireDocument(nom, docId) {
const depuisInstantane = await documentDuCatalogue(nom, docId);
if (depuisInstantane !== undefined) return depuisInstantane;
const snap = await getDoc(doc(db, nom, docId));
return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

const program = await lireDocument("programs", id);

if (!program) {
afficherErreur("Cette opportunité n'est plus disponible", "Ce programme a peut-être été retiré ou mis à jour récemment — le reste du catalogue vous attend.");
return;
}

const [universityDoc, scholarshipDoc] = await Promise.all([
program.universityId ? lireDocument("universities", program.universityId) : null,
program.scholarshipId ? lireDocument("scholarships", program.scholarshipId) : null
]);

const universityProfile = universityDoc || {};
const scholarshipData = scholarshipDoc || {};

const university = {
id: program.id,
// Les deux clés qui servent à retrouver le portail auprès de la
// fonction `portails` (lot S3) : `id` ci-dessus est celui du
// PROGRAMME, et l'université a le sien.
programId: program.id,
universityId: program.universityId || "",
scholarshipId: program.scholarshipId || "",
university: universityProfile.name || "",
country: universityProfile.country || "",
city: universityProfile.city || "",
ranking: universityProfile.ranking || "",
image: universityProfile.image || "",
flag: universityProfile.flag || "",
level: program.level || "",
scholarship: scholarshipData.title || "",
deadline: program.deadline || "",
// PRISE EN CHARGE : le programme gagne, la bourse comble le trou (lot
// PROGRAMMES, 2026-09-12) — même règle que `description` plus bas.
// Mesuré ce jour-là : 296 programmes sur 507 n'avaient pas de
// `coverage`, et la fiche affichait « — » alors que la bourse porte,
// pour CHACUN d'eux, un `funding` vérifié et détaillé (Eiffel : 1 200
// €/mois, frais NON couverts ; Excellence-Major : 280 ou 860 €/mois…).
// Le `funding` d'une bourse vaut pour toutes les universités qu'elle
// finance : le recopier dans 296 programmes aurait créé 296 copies qui
// divergent. Un `coverage` propre au programme ne s'écrit que quand la
// prise en charge diffère VRAIMENT d'une université à l'autre (Bilkent :
// exonération de 20 à 100 % selon le classement).
coverage: program.coverage || scholarshipData.funding || "",
language: program.language || "",
duration: program.duration || "",
status: program.status || "",
// Traçabilité de l'échéance (lot C2, 2026-09-05). Le programme gagne
// sur la bourse — même doctrine que applicationUrl juste en dessous :
// une date de dépôt propre à une université est vérifiée sur la page
// de CETTE université, pas sur celle du bailleur. Champs absents =
// inconnus, l'affichage reste juste, simplement moins précis.
periodeOuverture: program.periodeOuverture || scholarshipData.periodeOuverture || "",
verifieLe: program.verifieLe || scholarshipData.verifieLe || "",
sourceEcheance: program.sourceEcheance || scholarshipData.sourceEcheance || "",
echeanceVariable: program.echeanceVariable || scholarshipData.echeanceVariable || "",
statutBourse: scholarshipData.status || "",
actifBourse: scholarshipData.isActive,
// Modèle "Option B" (migration du 2026-08-10, voir admin/migrate-portal.js) :
// applicationUrl vit par défaut au niveau université
// (applicationPortalUrl), le champ programme ne reste rempli que pour
// une vraie exception (ex. Politecnico di Milano : portail PhD
// distinct du portail Licence/Master). Le programme gagne toujours
// s'il porte une valeur — sinon on retombe sur le défaut université.
//
// LOT S3 : ces deux champs ne sont plus dans le catalogue public, ils
// valent donc "" ici pour tout le monde. La résolution vit maintenant
// dans js/portails.js (portailUniversite), avec la MÊME priorité
// programme > université. La ligne reste : le jour où un instantané
// non scindé revient (restauration, machine d'un autre), elle continue
// de fonctionner, et `separerPortails` reste le seul endroit qui décide
// que ce champ est privé.
applicationUrl: program.applicationUrl || universityProfile.applicationPortalUrl || "",
officialWebsite: universityProfile.officialWebsite || "",
// Champs propres à la BOURSE (2026-08-30), jusqu'ici perdus à la
// jointure : officialWebsite ci-dessus est celui de l'UNIVERSITÉ, et
// tous les liens de la page envoyaient vers elle — la mauvaise porte
// quand le dossier se dépose chez le bailleur (MEXT, fondations…).
// Un champ absent en base reste "" ici : INCONNU, jamais un défaut —
// même règle des trois valeurs que `eligibility` ci-dessous.
funder: scholarshipData.funder || "",
funderName: scholarshipData.funderName || "",
entryPoint: scholarshipData.entryPoint || "",
scholarshipWebsite: scholarshipData.officialWebsite || "",
generalCriteria: scholarshipData.generalCriteria || "",
// Les exigences de dépôt, portées par la BOURSE. Tableau absent =
// inconnu : lireExigences() rendra [] et la section restera masquée.
exigences: Array.isArray(scholarshipData.exigences) ? scholarshipData.exigences : null,
// Limite d'âge de la bourse (2026-08-30) — même règle des trois
// valeurs : ageMax absent reste null, un inconnu, jamais « pas de
// limite » (voir js/age-limits.js).
ageMax: scholarshipData.ageMax || null,
ageMaxNote: scholarshipData.ageMaxNote || "",
description: program.description || scholarshipData.description || universityProfile.description || "",
securityNotice: scholarshipData.securityNotice || "",
// Restriction de nationalité — portée par la BOURSE, pas par le
// programme ni l'université (lot admin/expand-catalog-batch20).
eligibility: scholarshipData.eligibility || null
};

// Portail de candidature réservé aux abonnés (peu importe la formule —
// Pass Express et Premier Dossier inclus), portail université toujours
// public : règle indépendante des restrictions de fonctionnalités par
// formule (chat seul pour Pass Express, 1 candidature pour Premier
// Dossier — voir js/access-guard.js/js/plan-features.js), donc pas
// question de réutiliser isFeatureLocked() ici. resolveSession() ne
// redirige jamais (contrairement à requireAuth/requireFeature) : cette
// page reste 100% publique même pour vérifier ce simple statut.
const session = await resolveSession().catch(() => null);
// Lot S3 : `planPreinscriptionId` ajouté à la condition. Un client
// Dossier France (grille B) paie, et ne passait pourtant aucun de ces
// trois tests — il ne voyait pas le portail du bailleur. Même famille
// d'oubli que le conseiller du lot S0 : une deuxième grille tarifaire
// ajoutée sans repasser sur les conditions écrites pour la première.
const isPaidUser = !!session && (session.testerAccess || session.planId !== "gratuit" || !!session.planPreinscriptionId || session.hasFitzExpress);

// La carte des portails, demandée UNE fois pour la session. Rend null
// pour un visiteur, un compte sans abonnement actif, ou hors ligne —
// et la page se rend alors exactement comme pour un visiteur : sans
// bouton, sans cadenas, sans bloc vide.
await chargerPortails();

// ===============================
// Éléments HTML
// ===============================
const title = document.getElementById("title");
const country = document.getElementById("country");
const city = document.getElementById("city");
const level = document.getElementById("level");
const scholarship = document.getElementById("scholarship");
const description = document.getElementById("description");
const flag = document.getElementById("flag");
const cityImage = document.getElementById("cityImage");
const deadline = document.getElementById("deadline");
const coverage = document.getElementById("coverage");
const language = document.getElementById("language");
const duration = document.getElementById("duration");
const ranking = document.getElementById("ranking");
const status = document.getElementById("status");
const applyBtn = document.getElementById("applyBtn");
const universityPortalBtn = document.getElementById("universityPortalBtn");
const funderPortalBtn = document.getElementById("funderPortalBtn");
const funderPortalLabel = document.getElementById("funderPortalLabel");
const portalIntro = document.getElementById("portalIntro");
const criteriaSection = document.getElementById("criteriaSection");
const generalCriteriaEl = document.getElementById("generalCriteria");
const securityNotice = document.getElementById("securityNotice");
const securityNoticeText = document.getElementById("securityNoticeText");

// ===============================
// Remplissage des informations
// ===============================
// Lot LANGAGE (2026-09-10) : « Détails de la bourse » était un nom de
// fichier. Le titre et la description sont construits depuis la bourse
// affichée — le programme, le pays, le niveau — et ne promettent rien
// d'autre que ce que la fiche donne.
const nomBourse = university.scholarship || "Bourse";
const pageTitle = `${[nomBourse, university.country, university.level].filter(Boolean).join(" · ")} | FitzUniverse`;

document.title = pageTitle;

const metaDescription = document.querySelector('meta[name="description"]');

if (metaDescription) {
const ou = [university.university, university.country].filter(Boolean).join(", ");
const resume = `${nomBourse}${ou ? ` (${ou})` : ""}${university.level ? `, niveau ${university.level}` : ""} : critères, échéance datée et site officiel.`;
const complement = university.description ? ` ${university.description}` : "";
metaDescription.setAttribute("content", (resume + complement).slice(0, 160));
}

// Canonical + Open Graph propres à CE programme (2026-08-29) : la
// page est paramétrée (?id=…) — sans canonical incluant l'id, un
// moteur de recherche peut replier toutes les fiches sur une seule ;
// et un partage WhatsApp/Facebook affichait « ABSENT » faute
// d'og:title. Le domaine vient de la balise posée dans le HTML (à
// mettre à jour avec le futur nom de domaine), seul l'id est ajouté.
const canonical = document.querySelector('link[rel="canonical"]');
if (canonical) {
const base = canonical.href.split("?")[0];
canonical.href = `${base}?id=${encodeURIComponent(id)}`;
}
const ogTitle = document.querySelector('meta[property="og:title"]');
if (ogTitle) ogTitle.setAttribute("content", document.title);
const ogDesc = document.querySelector('meta[property="og:description"]');
if (ogDesc && university.description) ogDesc.setAttribute("content", university.description.slice(0, 160));

if (title) title.textContent = university.university || "Université";
if (country) country.textContent = university.country || "Non renseigné";
if (city) city.textContent = university.city || "Ville non renseignée";
if (level) level.textContent = university.level || "Niveau non renseigné";
if (scholarship) scholarship.textContent = university.scholarship || "";

if (description) description.textContent = university.description || "Aucune description disponible.";

afficherCriteresGeneraux(university.generalCriteria, criteriaSection, generalCriteriaEl);

afficherExigences(university, document.getElementById("exigencesSection"), document.getElementById("exigencesContent"));

if (securityNotice && securityNoticeText && university.securityNotice) {
securityNoticeText.textContent = university.securityNotice;
securityNotice.hidden = false;
}

if (flag) {
flag.src = `assets/flags/${university.flag || "default.svg"}`;
flag.alt = university.country || "Drapeau";
}

if (cityImage) {

// Photo de couverture en variantes responsives (2026-08-29). Avant
// ce correctif, cette ligne posait le FICHIER D'ORIGINE : mesurée sur
// une fiche Oxford, la page chargeait 3,3 Mo dont 2,6 Mo pour cette
// seule image, affichée sur une bande de 340 px de haut. Le repli
// "default.jpg" visait en plus un fichier absent du dépôt.
// Voir resolveCityImage() dans js/scholarship-image.js.
const photo = resolveCityImage(university.image);
cityImage.srcset = photo.srcset;
cityImage.sizes = "100vw";
cityImage.src = photo.src;
cityImage.width = 800;
cityImage.height = 533;
cityImage.decoding = "async";
cityImage.onerror = () => {
cityImage.onerror = null;
cityImage.removeAttribute("srcset");
cityImage.src = photo.fallbackOriginal;
};
cityImage.alt = university.city || "Ville";

}

// ÉCHÉANCE ET STATUT — lus, jamais recopiés (2026-09-05).
//
// Avant ce correctif, cette page imprimait `program.deadline` tel
// quel sous l'étiquette « Date limite ». Sur la Shanghai Government
// Scholarship, elle affichait donc « 1er décembre 2025 – 30 avril
// 2026 (cycle 2026) » comme date limite, et « Ouverte » juste à
// côté — en septembre 2026. Un étudiant pouvait y croire et
// travailler des semaines pour rien.
//
// etatCandidature() (js/echeance.js) tranche : une date lue et
// dépassée ferme, quoi que dise le statut, et la date dépassée
// change alors d'étiquette — « Dernière échéance connue », plus
// jamais « Date limite ».
const candidature = etatCandidature({
// LES DEUX statuts, pas l'un OU l'autre. Les 33 programmes de
// Stipendium Hungaricum disent « Ouverte » quand la bourse dit
// « Fermée » : prendre le premier non vide faisait dire à cette
// fiche « Candidatures ouvertes » pendant que la carte du
// catalogue disait « pas encore ouvertes ». Il suffit qu'un des
// deux annonce un cycle clos pour qu'on cesse de promettre un
// portail ouvert.
statut: [university.status, university.statutBourse],
actif: university.actifBourse,
echeances: [university.deadline],
periodeOuverture: university.periodeOuverture,
verifieLe: university.verifieLe,
echeanceVariable: university.echeanceVariable
});

if (deadline) deadline.textContent = candidature.valeur;

const deadlineLabel = document.getElementById("deadlineLabel");
if (deadlineLabel) deadlineLabel.textContent = candidature.etiquette;

const deadlineNote = document.getElementById("deadlineNote");

if (deadlineNote) {

// La source est un lien quand on l'a : « à confirmer sur le portail
// officiel » sans dire OÙ ne demande à l'étudiant qu'un travail de
// plus.
const source = university.sourceEcheance
? ` <a href="${university.sourceEcheance}" target="_blank" rel="noopener noreferrer">Voir la source</a>`
: "";

deadlineNote.innerHTML = "";
deadlineNote.append(candidature.detail);
if (candidature.verifie) deadlineNote.append(` · ${candidature.verifie}`);
if (source) deadlineNote.insertAdjacentHTML("beforeend", source);

// LE TEXTE DU CATALOGUE, EN ENTIER (2026-09-05).
//
// Depuis que cette case affiche l'échéance LUE (« 6 octobre 2026 »)
// au lieu du champ brut, tout ce que la prose disait autour
// disparaissait de l'écran : l'heure et le fuseau, le millésime de la
// campagne, la porte d'entrée du compte GIRAF à valider deux semaines
// avant, la double candidature de Knight-Hennessy… C'est précisément
// là que vit l'information qu'un étudiant ne trouvera nulle part
// ailleurs. On affiche donc les deux : l'état calculé, qui ne ment
// pas, PUIS la phrase d'origine, qui explique.
const prose = (university.deadline || "").trim();

if (prose && prose !== candidature.valeur) {
const bloc = document.createElement("span");
bloc.className = "details-info-prose";
bloc.textContent = prose;
deadlineNote.append(bloc);
}

deadlineNote.hidden = !candidature.detail && !prose;

}
if (coverage) coverage.textContent = university.coverage || "—";
if (language) language.textContent = university.language || "—";
if (duration) duration.textContent = university.duration || "—";
if (ranking) ranking.textContent = university.ranking || "—";
// Le statut affiché est celui que la LECTURE de l'échéance a établi,
// pas la chaîne saisie en base : les deux se contredisaient sur 4
// bourses au 2026-09-04 (dont l'Eiffel, dépassée de neuf mois).
if (status) {
status.textContent = candidature.badge;
status.dataset.ton = candidature.ton;
}

// ===============================
// Éligibilité par nationalité (2026-08-30). Deux affichages, deux
// conditions distinctes — voir la règle des trois valeurs dans
// js/eligibility-countries.js :
//  - le critère « Nationalités éligibles » n'apparaît que si la bourse
//    porte une restriction en base (libelleEligibilite non nul) ;
//  - l'avertissement au-dessus des liens de candidature n'apparaît que
//    si la nationalité de l'étudiant est connue ET explicitement
//    exclue (estEligible === false, jamais null).
// Le bouton reste actif et le site officiel visible dans la même
// zone : on informe, on n'empêche pas.
// ===============================
const eligibilityItem = document.getElementById("eligibilityItem");
const eligibilityLabel = document.getElementById("eligibilityLabel");
const libelle = libelleEligibilite(university.eligibility);
if (eligibilityItem && eligibilityLabel && libelle) {
eligibilityLabel.textContent = libelle;
eligibilityItem.hidden = false;
}

let nationalite = (session && session.profile && session.profile.nationality) || "";
if (!nationalite) {
try { nationalite = localStorage.getItem("fitzNationalite") || ""; } catch { /* stockage bloqué */ }
}

const eligibilityWarning = document.getElementById("eligibilityWarning");
if (eligibilityWarning && estEligible(university.eligibility, nationalite) === false) {
eligibilityWarning.textContent = `D'après les critères officiels, cette bourse n'est pas ouverte aux ressortissants ${paysAvecArticle(nationalite)}. Vérifiez sur le site officiel avant de candidater.`;
eligibilityWarning.hidden = false;
}

// ===============================
// Limite d'âge (2026-08-30) — même dualité d'affichage que
// l'éligibilité par nationalité juste au-dessus :
//  - le critère « Limite d'âge » n'apparaît que si la bourse porte une
//    limite en base (libelleLimiteAge non vide) ; ageMaxNote, quand
//    elle existe, s'affiche sous la grille en texte secondaire —
//    jamais de « pas de limite » quand le champ est absent ;
//  - l'avertissement au-dessus des liens n'apparaît que si l'âge du
//    profil connecté est connu ET dépasse le plafond sur TOUS les
//    cycles du programme (depasseLimiteAgePartout — jamais sur null).
//    On informe, on n'empêche pas : boutons et liens restent intacts,
//    même posture que #eligibilityWarning.
// ===============================
const ageLimitItem = document.getElementById("ageLimitItem");
const ageLimitLabel = document.getElementById("ageLimitLabel");
const ageLimitNote = document.getElementById("ageLimitNote");
const libelleAge = libelleLimiteAge(university.ageMax);

if (ageLimitItem && ageLimitLabel && libelleAge) {
ageLimitLabel.textContent = libelleAge;
ageLimitItem.hidden = false;
}

if (ageLimitNote && university.ageMaxNote) {
ageLimitNote.textContent = university.ageMaxNote;
ageLimitNote.hidden = false;
}

const ageEtudiant = computeAge(session && session.profile && session.profile.birthDate);
const ageLimitWarning = document.getElementById("ageLimitWarning");

if (ageLimitWarning && ageEtudiant !== null && depasseLimiteAgePartout(university.ageMax, ageEtudiant, university.level)) {
ageLimitWarning.textContent = `D'après les critères officiels, ce programme fixe une limite d'âge (${libelleAge}) que votre profil dépasse. Vérifiez sur le site officiel avant de candidater.`;
ageLimitWarning.hidden = false;
}

// Les CTA portent le programme, sans score : le diagnostic par
// université a quitté la fiche (lot VITRINE-COMMERCIALE).
updateFitzCtas(university.id);

trackEvent("scholarship_viewed", {
country: university.country,
university: university.university,
field: university.level
});

document.getElementById("detailsMain").hidden = false;

if (window.lucide) lucide.createIcons();

// ===============================
// « Votre situation face à cette bourse » — rendu.
// N'est appelé QUE pour un abonné : pour un visiteur, la section reste
// `hidden` telle qu'elle est écrite dans le HTML, donc rien n'existe.
// ===============================
if (isPaidUser && session) {
await rendreSituation({
session,
university,
program,
universityProfile,
scholarshipData
});
}

// ===============================
// Portail université — toujours public, jamais de friction. Le lien
// officiel s'ouvre immédiatement, comme n'importe quel lien externe.
// ===============================
if (universityPortalBtn) {

if (university.officialWebsite) {
universityPortalBtn.href = university.officialWebsite;
} else {
// Pas de site : on masque, au lieu d'un bouton qui répondait
// « sera ajouté prochainement » (même défaut de valeur que celui
// corrigé sur applyBtn le 2026-08-31). C'est aussi ce qui rend le
// cas limite atteignable — sans site d'université ET sans les
// liens abonné, le bloc entier disparaît plus bas.
universityPortalBtn.hidden = true;
}

universityPortalBtn.addEventListener("click", () => {
trackEvent("university_portal_opened", {
country: university.country,
university: university.university
});
});

}

// ===============================
// Portail du BAILLEUR — le site officiel de la BOURSE (voir le bloc
// bailleur en tête de fichier). Public, jamais verrouillé : même
// posture que le site de l'université et la mention .portal-trust.
// L'ordre des liens suit entryPoint, et la phrase d'orientation
// au-dessus des boutons aussi — quand il est renseigné.
// ===============================
configurerPortailBailleur(university, funderPortalBtn, funderPortalLabel, isPaidUser);
ordonnerPortails(university.entryPoint, funderPortalBtn, universityPortalBtn, null);

// Lot S3 : la MÊME condition que configurerPortailBailleur ci-dessus,
// portail de dépôt compris — sans quoi la phrase d'orientation et le
// bouton pourraient se contredire le jour où une bourse portera son
// applicationPortalUrl sans officialWebsite.
const portailBailleurVisible = isPaidUser && !!(portailBourse(university.scholarshipId) || university.scholarshipWebsite);
const phraseOrientation = phraseOrientationPortails(university.entryPoint, portailBailleurVisible);
if (portalIntro && phraseOrientation) portalIntro.textContent = phraseOrientation;

// CAS LIMITE : plus aucun lien à montrer (université sans site — aucune
// aujourd'hui, mais ça arrivera). On masque TOUT le bloc, intro
// comprise : jamais un cadre vide, jamais une intro sans boutons.
const blocPortails = document.getElementById("portalBlock");
if (blocPortails) {
const liensVisibles = [funderPortalBtn, universityPortalBtn, applyBtn].filter((a) => a && !a.hidden);
blocPortails.hidden = liensVisibles.length === 0;
}

if (funderPortalBtn) {
funderPortalBtn.addEventListener("click", () => {
trackEvent("funder_portal_opened", {
country: university.country,
funder: university.funder,
funderName: university.funderName
});
});
}

// ===============================
// Portail de candidature — réservé aux abonnés (voir isPaidUser
// ci-dessus), jamais visible d'un visiteur public quelle que soit la
// page. Un abonné voit toujours les 2 liens, y compris Pass Express et
// Premier Dossier : cette règle est indépendante de ce que leur formule
// débloque par ailleurs dans l'espace étudiant.
// ===============================
if (applyBtn) {

// Deux conditions, pas une seule (correctif du 2026-08-31, lot 33) :
// être abonné NE SUFFIT PAS, encore faut-il qu'un portail existe.
// Avant ce correctif, un champ vide affichait quand même le bouton à
// l'abonné, avec une alerte « sera ajouté prochainement » au clic —
// une case vide vendue à quelqu'un qui paie. Or un champ vide est
// désormais une RÉPONSE, pas un trou : les trois universités
// marocaines publiques n'ont aucun portail d'admission ouvert aux
// étrangers (tout passe par l'AMCI, voir scripts/data/lot33-portails.mjs).
// La mention « réservé aux abonnés » qui accompagnait ce bouton a été
// retirée de la page le 2026-08-31 : annoncer une porte fermée, c'est
// encore montrer la porte.
// LOT S3 : l'URL vient de la fonction `portails`, jamais du catalogue.
// `portailUniversite` rend "" tant que la carte n'a pas été obtenue —
// c'est-à-dire pour un visiteur, un compte sans abonnement actif, ou
// hors ligne. Les deux conditions d'avant tiennent toujours et restent
// écrites séparément : être abonné ne suffit pas, encore faut-il qu'un
// portail existe, et un portail connu ne s'affiche pas à qui n'y a pas
// droit. Simplement, la seconde est désormais tranchée par le serveur.
const portail = portailUniversite({ universityId: university.universityId, programId: university.programId })
|| university.applicationUrl;
const aUnPortail = !!portail;

applyBtn.hidden = !isPaidUser || !aUnPortail;

// Lot E2 : la procédure du portail, si elle est documentée — visible de
// tous, elle ne dit rien que Campus France ne publie.
//
// LOT S3 : décidée par le PAYS DE DESTINATION, plus par l'URL du
// portail. Deux raisons, et la seconde est la vraie. D'abord l'URL
// n'est plus publique : la garder comme critère aurait retiré à tous
// les visiteurs un lien qui doit rester public. Ensuite, depuis le lot
// S1b, une procédure EST documentée par destination et non par
// université — la faire dépendre d'un champ propre à chaque
// établissement était déjà une incohérence, qui masquait le lien sur
// les universités françaises dont le portail n'est pas Études en France.
const procedureLink = document.getElementById("procedureLink");
if (procedureLink) {
const procedure = trouverProcedure({ paysDestination: university.country });
procedureLink.hidden = !procedure;
if (procedure) procedureLink.href = `preinscriptions.html#procedure-${encodeURIComponent(String(university.country || "france").toLowerCase())}`;
}

if (isPaidUser && aUnPortail) {

applyBtn.href = portail;

applyBtn.addEventListener("click", () => {
trackEvent("application_portal_opened", {
country: university.country,
university: university.university
});
});

}

}

initPortalNudge();

// Un retour du questionnaire avec ?fromTest=1 (ancien bloc « Avant de
// candidater ») aboutit ici sans rien de plus : la fiche se lit, entière,
// sans bloc à relancer — ni erreur ni impasse.

} catch (error) {

console.error("Erreur :", error);

afficherErreur("Chargement interrompu", "Vérifiez votre connexion Internet, puis rechargez la page.");

}

}

// ===============================
// Initialisation
// ===============================
chargerUniversite();
