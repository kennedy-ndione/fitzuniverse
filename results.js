// -------- results.js --------
// Calcule et affiche un résultat réel à partir des réponses laissées
// par l'utilisateur sur eligibility-questions.html (sessionStorage).
// Le score global (académique, langue, documents...) vient de
// EligibilityAI (eligibility-ai.js) — inchangé, synchrone, aucune
// donnée externe. Les opportunités concrètes (nom d'université, bourse,
// deadline) viennent en revanche du vrai catalogue Firestore, via
// recommendPrograms() (js/recommend-programs.js) — la même jointure
// programs/universities/scholarships déjà utilisée par applications.js,
// jamais une 2e façon de résoudre bourse↔université (audit du
// 2026-08-14, remplace l'ancien calculateDestination() qui ne
// reconnaissait que 4 pays codés en dur).
//
// Devient nécessairement asynchrone (comme chargerUniversite() dans
// details.js) : impossible d'afficher les vraies opportunités avant
// d'avoir attendu la lecture Firestore. Un état de chargement dédié
// (#resultsLoading) reste visible jusque-là.
//
// Audit du 2026-08-22 ("nos questions orientent-elles vraiment tout
// étudiant, de tout pays et de tout cycle ?") : buildProfileFromResponses()
// transmet désormais desiredField/fundingGoal/nationality en plus du
// niveau d'études et de la destination — trois réponses collectées par
// le test mais jusqu'ici jamais lues par recommendPrograms(). Le
// français rejoint l'anglais dans "languages" et dans la ligne "Langue"
// de buildScoreBreakdown() (levelFromLanguages, meilleur des deux). La
// réponse "motivation" personnalise désormais buildNarrative().
//
// Refonte de la présentation (2026-08-22, retour utilisateur) : le
// score et chaque ligne de sa décomposition sont désormais colorés
// vert / ambre / rouge selon leur valeur, au lieu du bleu de marque
// uniforme qui rendait un 31/100 visuellement identique à un 92/100.
// Ce fichier ne décide RIEN de cette couleur : il pose une classe de
// ton d'après scoreTier()/toneForValue() (js/fitz-voice.js), et
// results.css la traduit en couleurs. Toutes les phrases de Fitz sont
// sorties d'ici vers ce même fichier de voix — ce module affiche, il
// ne rédige plus.
//
// Refonte du questionnaire (2026-08-29) : les réponses portent désormais
// currentLevel (5 paliers) et targetLevel (cycle VISÉ) au lieu de
// l'ancien studyLevel unique. buildProfileFromResponses() transmet
// targetLevel (résolu par resolveTargetLevel(), eligibility-ai.js) à
// recommendPrograms() — le bonus de niveau va enfin au cycle que
// l'étudiant veut intégrer, plus jamais à celui qu'il vient de terminer.
// Chaque carte d'opportunité affiche désormais SES raisons propres
// (pick.reasons, js/recommend-programs.js:explainMatch) au lieu des
// mêmes raisons génériques dupliquées sous les 6 cartes ; matchReasons()
// reste le repli quand un programme n'a aucune raison spécifique.

import { EligibilityAI, normalizeAverageToPercent, resolveTargetLevel } from "./eligibility-ai.js";
import { recommendPrograms } from "./js/recommend-programs.js";
import { resolveCityImage } from "./js/scholarship-image.js";

// Champ lexical de Fitz (js/fitz-voice.js) : ce fichier ne rédige plus
// aucune phrase de Fitz lui-même — il ne fait que les afficher. Voir la
// section CHAMP LEXICAL de fitz-voice.js pour la raison (deux registres
// coexistaient pour un même personnage, et rien n'était transmissible
// au futur moteur d'IA).
import {
scoreTier,
toneForValue,
RECIT,
MOTIVATION_NARRATIVE,
IMPROVEMENT_TIPS,
ETATS_VIDES
} from "./js/fitz-voice.js";

// Chargeur de catalogue partagé et mémoïsé — voir js/catalog-data.js.
import { chargerCatalogue } from "./js/catalog-data.js";

// Classe CSS correspondant à un ton (js/fitz-voice.js) — voir la
// section "TONS D'ÉTAT" de results.css. Passer par cette fonction
// plutôt que par une concaténation `is-${tone}` garde la liste des
// classes réellement existantes visible en un seul endroit.
const TONE_CLASS = {
positive: "is-positive",
moyen: "is-moyen",
faible: "is-faible"
};

function applyTone(element, tone) {

if (!element) return;

element.classList.remove("is-positive", "is-moyen", "is-faible");

if (TONE_CLASS[tone]) element.classList.add(TONE_CLASS[tone]);

}

const rawResponses = sessionStorage.getItem("eligibilityResponses");

if (!rawResponses) {

window.location.replace("eligibility-test.html");

} else {

const responses = JSON.parse(rawResponses);

main(responses);

}

// ==========================================================
// PROFIL — traduit les réponses du diagnostic gratuit dans le même
// format que profile.js (profil Firestore persistant), pour que
// recommendPrograms()/scoreProgram() n'aient besoin d'aucune variante :
// même fonction, deux sources de profil différentes selon le contexte
// (session anonyme ici, profil connecté dans applications.js).
// ==========================================================
function buildProfileFromResponses(responses) {

return {
// Cycle VISÉ (refonte 2026-08-29) : resolveTargetLevel() renvoie le
// choix explicite de l'étudiant (question targetLevel) ou, s'il a
// répondu "Je ne sais pas encore", le prochain cycle naturel dérivé de
// son niveau actuel. C'est CE niveau que scoreProgram() compare à
// program.level — voir js/recommend-programs.js.
targetLevel: resolveTargetLevel(responses),
// lastDegree conservé en repli (ancien contrat de scoreProgram) —
// responses.studyLevel n'existe plus que pour d'anciennes sessions
// dont le sessionStorage date d'avant la refonte.
lastDegree: responses.currentLevel || responses.studyLevel || "",
preferredCountries: responses.destinationCountry && responses.destinationCountry !== "Je ne sais pas encore"
? [responses.destinationCountry]
: [],
// scoreProgram() ne vérifie que la présence d'une langue dans
// program.language — un niveau "Débutant" ne mérite pas le bonus de
// compatibilité linguistique. "Français" ajoutée (audit 2026-08-22,
// voir la question "french" dans questions.js) : jusqu'ici un
// programme enseigné en français ne pouvait jamais recevoir ce bonus,
// même pour un étudiant francophone confirmé.
languages: [
...(responses.english && responses.english !== "Débutant" ? ["Anglais"] : []),
...(responses.french && responses.french !== "Débutant" ? ["Français"] : [])
],
// desiredField/fundingGoal (audit 2026-08-22) : scoreProgram() ne
// lisait jusqu'ici ni le domaine d'études ni la préférence de
// financement — deux réponses collectées par le test mais silencieuses
// sur les résultats réels. Voir js/recommend-programs.js.
desiredField: responses.studyCategory || "",
fundingGoal: responses.goal || "",
// nationality : consommée depuis le 2026-08-30 par scoreProgram()
// (js/recommend-programs.js), qui écarte toute bourse dont la
// restriction officielle exclut cette nationalité (champ eligibility
// des bourses, posé par admin/expand-catalog-batch20).
nationality: responses.nationality || "",
// ageBracket : la tranche d'âge du diagnostic (questions.js) servait
// déjà au score (calculateAge, eligibility-ai.js) mais n'atteignait
// pas le moteur — depuis le branchement des limites d'âge
// (2026-08-30), ageMatch() (js/recommend-programs.js) écarte toute
// bourse dont le plafond `ageMax` est dépassé par la tranche ENTIÈRE
// (une tranche à cheval sur la limite ne tranche pas : règle des
// trois valeurs, js/age-limits.js).
ageBracket: responses.ageBracket || ""
};

}

// ==========================================================
// CHARGEMENT DU CATALOGUE + RECOMMANDATIONS RÉELLES
// ==========================================================
const OPPORTUNITIES_COUNT = 6;

async function loadRealOpportunities(responses) {

const catalogue = await chargerCatalogue();

const programs = catalogue.programmes;
const universitiesById = new Map(catalogue.universites.map((u) => [u.id, u]));
const scholarshipsById = new Map(catalogue.bourses.map((s) => [s.id, s]));

const profile = buildProfileFromResponses(responses);

const picks = recommendPrograms({
profile,
programs,
universitiesById,
scholarshipsById,
excludeUniversityIds: new Set(),
count: OPPORTUNITIES_COUNT
});

// Repli seulement (refonte 2026-08-29) : chaque pick porte désormais
// SES raisons propres (pick.reasons, js/recommend-programs.js:
// explainMatch) — les raisons génériques du profil ne servent plus que
// si un programme retenu n'a aucune correspondance spécifique (score
// bas mais catalogue peu fourni), pour ne jamais afficher une liste
// vide sous "Pourquoi cette opportunité vous correspond".
const fallbackReasons = new EligibilityAI(responses).matchReasons();

// image/flag : déjà vérifiées et utilisées pour cette même université
// ailleurs sur le site (universities-page.js, details.js) — aucune
// nouvelle photo à sourcer, on rend simplement visible ici la
// reconnexion au vrai catalogue. Même repli que details.js
// (default.jpg/default.svg) pour ne jamais casser l'affichage si un
// document a ces champs vides.
const scholarshipDetails = picks.map((pick) => {

const university = universitiesById.get(pick.universityId) || {};

// resolveCityImage() (js/scholarship-image.js) plutôt que le nom de
// fichier brut : la vignette de 44 px chargeait le fichier D'ORIGINE
// (oxford.jpg = 2,6 Mo) — LE défaut "photo servie en taille d'origine"
// corrigé sur les pages catalogue le 2026-08-29 ; ce point d'appel
// avait été oublié. La variante 400w suffit largement ici.
return {
name: pick.scholarshipTitle || `Programme à ${pick.universityName}`,
university: pick.universityName,
country: university.country || "",
deadline: pick.deadline,
photo: resolveCityImage(university.image),
flag: university.flag || "default.svg",
reasons: (Array.isArray(pick.reasons) && pick.reasons.length) ? pick.reasons : fallbackReasons
};

});

const eligibleCountries = [...new Set(scholarshipDetails.map((s) => s.country).filter(Boolean))];

// Filet minimal si le catalogue n'a produit aucune correspondance (ex.
// destination très spécifique sans programme encore en base) : la
// destination déclarée reste affichée, sans jamais inventer d'opportunité.
if (!eligibleCountries.length && responses.destinationCountry && responses.destinationCountry !== "Je ne sais pas encore") {
eligibleCountries.push(responses.destinationCountry);
}

// scholarships : les documents bruts, pour que noteNationality()
// (eligibility-ai.js) calcule « votre nationalité vous ouvre N des M
// bourses » sur le catalogue réel plutôt qu'une phrase générique.
return { scholarshipDetails, eligibleCountries, scholarships: [...scholarshipsById.values()] };

}

// ==========================================================
// ÉTAT DE CHARGEMENT
// ==========================================================
function setLoading(isLoading) {

const loading = document.getElementById("resultsLoading");
const content = document.getElementById("resultsContent");

if (loading) loading.hidden = !isLoading;
if (content) content.hidden = isLoading;

}

async function main(responses) {

setLoading(true);

// Le catalogue est chargé AVANT analyze() (réordonné le 2026-08-30) :
// noteNationality() s'en sert pour une phrase calculée sur les vraies
// restrictions de nationalité. En cas d'échec réseau, analyze() tourne
// sans catalogue, exactement comme avant — le score n'en dépend pas.
let catalogue = null;

try {

catalogue = await loadRealOpportunities(responses);

} catch (error) {

console.error("Erreur Firestore (catalogue) :", error);

}

const result = new EligibilityAI(responses).analyze(catalogue ? catalogue.scholarships : null);

const score = Math.max(0, Math.min(100, Math.round(result.score)));

if (catalogue) {

result.scholarshipDetails = catalogue.scholarshipDetails;
result.eligibleScholarships = catalogue.scholarshipDetails.map((s) => s.name);
result.eligibleCountries = catalogue.eligibleCountries;

} else {

result.scholarshipDetails = [];
result.eligibleScholarships = [];
result.eligibleCountries = [];

}

render(responses, result, score);

setLoading(false);

}

function render(responses, result, score) {

// ==========================================================
// RÉCIT D'OUVERTURE — Fitz présente son diagnostic
// ==========================================================

// Assemble le récit à partir des fabriques de RECIT (fitz-voice.js) :
// l'ordre des phrases et les conditions d'affichage restent ici (c'est
// de la logique de rendu), leur formulation vient du champ lexical.
function buildNarrative() {

const sentences = [];

sentences.push(RECIT.ouverture(result.eligibleScholarships.length, responses.studyCategory));

sentences.push(RECIT.atouts(result.strengths.length > 0));

// Uniquement s'il y a réellement des axes à renforcer — voir le
// commentaire sur RECIT.progression.
if (result.weaknesses.length) {
sentences.push(RECIT.progression);
}

const destinations = RECIT.destinations(result.eligibleCountries.length);

if (destinations) sentences.push(destinations);

if (MOTIVATION_NARRATIVE[responses.motivation]) {
sentences.push(MOTIVATION_NARRATIVE[responses.motivation]);
}

return sentences;

}

function renderNarrative() {

const container = document.getElementById("narrativeText");
container.innerHTML = "";

buildNarrative().forEach((sentence) => {

const p = document.createElement("p");
p.textContent = sentence;
container.appendChild(p);

});

}

// ==========================================================
// SCORE — présenté comme un indicateur, pas un verdict
// ==========================================================

// Libellé, message ET ton viennent du même palier (scoreTier,
// js/fitz-voice.js) : avant, les seuils étaient réécrits ici en deux
// cascades de if parallèles — un seuil modifié dans l'une et pas dans
// l'autre suffisait à afficher "Profil solide" avec le message d'un
// profil à préparer.
function renderScore() {

const tier = scoreTier(score);

document.getElementById("score").textContent = score;
document.getElementById("profileMessage").textContent = tier.message;
document.getElementById("scoreTier").textContent = tier.label;

// Le ton est posé sur la SECTION, pas sur l'anneau : la pastille du
// palier et le chiffre, qui vivent dans la colonne de droite, lisent
// les mêmes variables --tone-* (voir results.css).
applyTone(document.getElementById("scoreSection"), tier.tone);

const ring = document.getElementById("scoreRing");

// Deux temps volontaires : la valeur est posée sur un frame séparé
// pour que la transition CSS de stroke-dashoffset ait un état de
// départ (0) à animer. Sans ce décalage, l'anneau apparaîtrait déjà
// rempli — la valeur initiale et la valeur finale seraient appliquées
// dans le même frame.
ring.style.setProperty("--score-percent", 0);

requestAnimationFrame(() => {
requestAnimationFrame(() => {
ring.style.setProperty("--score-percent", score);
});
});

}

// ==========================================================
// DÉCOMPOSITION DU SCORE — lecture pédagogique, pas un second
// calcul : chaque catégorie est dérivée directement des réponses
// déjà fournies par l'utilisateur (aucune donnée inventée), pour
// expliquer visuellement ce qui compose le score produit par
// EligibilityAI. Le score global affiché plus haut reste celui de
// EligibilityAI ; ce détail ne le recalcule jamais.
// ==========================================================

// Refonte 2026-08-29 : lit currentLevel (les 5 nouveaux paliers de
// questions.js) et garde les anciens libellés studyLevel en repli pour
// une session dont le sessionStorage date d'avant la refonte.
function levelFromCurrentLevel(responses) {

const scale = {
"Bac en cours ou obtenu": 60,
"Licence en cours": 70,
"Licence obtenue": 80,
"Master en cours ou obtenu": 90,
"Doctorat en cours ou obtenu": 95,
// anciens libellés (question "studyLevel" retirée)
"Nouveau bachelier": 60,
"Licence": 75,
"Master": 90,
"Doctorat": 95
};

return scale[responses.currentLevel || responses.studyLevel] || 55;

}

// Remplace l'ancien levelFromEnglish (audit 2026-08-22, ajout de la
// question "french") : prend le meilleur des deux tiers plutôt que de
// ne lire que l'anglais, même principe que calculateLanguage() dans
// eligibility-ai.js. Les libellés "Courant / Bilingue" (english) et
// "Courant / Langue maternelle" (french) partagent le même palier 100 —
// ce sont les deux formulations d'un niveau natif/bilingue pour chaque
// langue, voir questions.js.
function languageTierScore(level) {

const scale = {
"Débutant": 25,
"Intermédiaire": 55,
"Bon niveau": 80,
"Courant / Bilingue": 100,
"Courant / Langue maternelle": 100
};

return scale[level] || 0;

}

function levelFromLanguages(responses) {

const best = Math.max(languageTierScore(responses.english), languageTierScore(responses.french));

const base = best || 40;

// Certification officielle (question "langCert", refonte 2026-08-29) :
// un test reconnu (IELTS, TOEFL, DELF, TCF…) est une exigence
// documentaire de la plupart des bourses — il rehausse la ligne Langue
// sans jamais dépasser 100. Même esprit que calculateCertification()
// dans eligibility-ai.js, sans recalculer le score global.
const hasCert = responses.langCert && responses.langCert !== "Pas encore";

return hasCert ? Math.min(100, base + 10) : base;

}

function levelFromPassport(passport) {

const scale = {
"Passeport valide": 100,
"Passeport en cours de demande": 60,
"Passeport expiré": 40,
"Je n'ai pas encore de passeport": 20
};

return scale[passport] || 30;

}

function levelFromTimeline(timeline) {

const scale = {
"Dans les 6 prochains mois": 90,
"D'ici 1 an": 70,
"Dans plus d'un an": 50,
"Je ne sais pas encore": 30
};

return scale[timeline] || 40;

}

function buildScoreBreakdown() {

const percent = normalizeAverageToPercent(responses.average, responses.averageScale);
const academicFromGrades = percent === null ? null : Math.round(percent);

return [
{
label: "Niveau académique",
icon: "graduation-cap",
value: academicFromGrades !== null
? Math.round((academicFromGrades + levelFromCurrentLevel(responses)) / 2)
: levelFromCurrentLevel(responses)
},
{ label: "Langue", icon: "languages", value: levelFromLanguages(responses) },
{ label: "Formation", icon: "book-open", value: levelFromCurrentLevel(responses) },
{ label: "Documents", icon: "file-text", value: levelFromPassport(responses.passport) },
{ label: "Préparation", icon: "hourglass", value: levelFromTimeline(responses.timeline) }
];

}

function renderScoreBreakdown() {

const container = document.getElementById("scoreBreakdown");

if (!container) return;

const breakdown = buildScoreBreakdown();

container.innerHTML = "";

breakdown.forEach((row) => {

const item = document.createElement("div");
item.className = "score-breakdown-row";

// Chaque ligne est colorée d'après SA propre valeur, pas d'après le
// score global : sur un même diagnostic, "Langue 100%" s'affiche en
// vert pendant que "Formation 60%" s'affiche en ambre. C'est ce qui
// rend la décomposition lisible d'un coup d'œil (retour utilisateur
// du 2026-08-22 sur "le trait progressif").
applyTone(item, toneForValue(row.value));

item.innerHTML = `
<span class="score-breakdown-label"><span class="score-breakdown-icon"><i data-lucide="${row.icon}"></i></span>${row.label}</span>
<span class="score-breakdown-bar"><span></span></span>
<span class="score-breakdown-pct">${row.value}%</span>
`;

container.appendChild(item);

// Largeur posée après insertion, pour la même raison que
// --score-percent dans renderScore() : appliquée dans l'attribut
// style du gabarit, la barre naîtrait déjà pleine et la transition
// CSS n'aurait rien à animer.
const fill = item.querySelector(".score-breakdown-bar span");

requestAnimationFrame(() => {
requestAnimationFrame(() => {
fill.style.width = `${row.value}%`;
});
});

});

renderImprovementReveal(breakdown);

}

// ==========================================================
// AMÉLIORATION — l'axe le plus faible est offert, les suivants
// sont un aperçu de ce que l'accompagnement débloque. Dérivé
// entièrement de la décomposition ci-dessus, aucun appel au
// moteur EligibilityAI.
// ==========================================================

function renderImprovementReveal(breakdown) {

const freeContainer = document.getElementById("improvementFree");
const locked = document.getElementById("recoLocked");
const lockedCount = document.getElementById("recoLockedCount");

if (!freeContainer || !locked) return;

const sorted = [...breakdown].sort((a, b) => a.value - b.value);
const [weakest, ...rest] = sorted;

// Le panneau prend le ton de l'axe qu'il désigne : un point faible à
// 60% se présente en ambre, à 25% en rouge. Il porte donc la même
// couleur que sa ligne dans la décomposition juste au-dessus, ce qui
// fait le lien entre les deux sans avoir à l'expliquer.
applyTone(freeContainer, toneForValue(weakest.value));

freeContainer.innerHTML = `
<i class="improvement-free-icon" data-lucide="${weakest.icon}"></i>
<div class="improvement-free-copy">
<strong>Point à améliorer en priorité : ${weakest.label} (${weakest.value}%)</strong>
<p>${IMPROVEMENT_TIPS[weakest.label] || ""}</p>
</div>
`;

if (rest.length) {

lockedCount.textContent = `+${rest.length} autre${rest.length > 1 ? "s" : ""} piste${rest.length > 1 ? "s" : ""} d'amélioration verrouillée${rest.length > 1 ? "s" : ""}`;
locked.hidden = false;

} else {

locked.hidden = true;

}

}

// ==========================================================
// LISTES — points forts, axes de progression, recommandations
// ==========================================================

function fillList(id, items, emptyText, icon) {

const list = document.getElementById(id);

list.innerHTML = "";

if (!items.length) {

const li = document.createElement("li");
li.textContent = emptyText;
li.classList.add("empty");
list.appendChild(li);

return;

}

items.forEach((item) => {

const li = document.createElement("li");

li.innerHTML = `<i data-lucide="${icon}"></i><span></span>`;
li.querySelector("span").textContent = item;

list.appendChild(li);

});

}

function renderCountries() {

const list = document.getElementById("countries");
list.innerHTML = "";

if (!result.eligibleCountries.length) {

const li = document.createElement("li");
li.className = "empty";
li.textContent = ETATS_VIDES.countries;
list.appendChild(li);

return;

}

result.eligibleCountries.forEach((country) => {

const li = document.createElement("li");
li.className = "country-pill";
li.innerHTML = `<i data-lucide="map-pin"></i><span></span>`;
li.querySelector("span").textContent = country;

list.appendChild(li);

});

}

// ==========================================================
// OPPORTUNITÉS — avec leur justification
// ==========================================================

function renderOpportunities() {

const wrapper = document.getElementById("scholarships");
wrapper.innerHTML = "";

if (!result.scholarshipDetails.length) {

const empty = document.createElement("p");
empty.className = "empty";
empty.textContent = ETATS_VIDES.opportunities;
wrapper.appendChild(empty);

return;

}

result.scholarshipDetails.forEach((scholarship) => {

const card = document.createElement("article");
card.className = "opportunity-card";

const reasonsHtml = scholarship.reasons
.map((reason) => `<li><i data-lucide="check"></i><span>${reason}</span></li>`)
.join("");

// university/deadline : n'existaient pas tant que les opportunités
// venaient des 4 pays codés en dur — le catalogue réel (via
// recommendPrograms) fournit désormais une université et une deadline
// précises, affichées ici sans changer la structure de la carte.
const subtitleParts = [scholarship.university, scholarship.country].filter(Boolean);

// Vignette de ville + drapeau : mêmes images déjà vérifiées et
// utilisées pour cette université sur universities.html/
// scholarship-details.html, rendent ici visible la reconnexion au vrai
// catalogue plutôt qu'une icône générique.
card.innerHTML = `
<div class="opportunity-head">
<img class="opportunity-thumb" src="${scholarship.photo.src}" srcset="${scholarship.photo.srcset}" sizes="44px" width="800" height="533" alt="" loading="lazy" decoding="async" onerror="this.onerror=null;this.removeAttribute('srcset');this.src='${scholarship.photo.fallbackOriginal}'">
<div>
<h3></h3>
<span class="opportunity-country"><img class="opportunity-flag" src="assets/flags/${scholarship.flag}" alt="" onerror="this.onerror=null;this.src='assets/flags/default.svg'"><span></span></span>
</div>
</div>
${scholarship.deadline ? `<p class="opportunity-deadline"><i data-lucide="calendar-clock"></i><span></span></p>` : ""}
<p class="opportunity-reasons-label">Pourquoi cette opportunité vous correspond :</p>
<ul class="opportunity-reasons">${reasonsHtml}</ul>
`;

card.querySelector("h3").textContent = scholarship.name;
card.querySelector(".opportunity-country span").textContent = subtitleParts.join(" — ");

const deadlineEl = card.querySelector(".opportunity-deadline span");
if (deadlineEl) deadlineEl.textContent = `Échéance : ${scholarship.deadline}`;

wrapper.appendChild(card);

});

}

// ==========================================================
// RÉVÉLATION AU DÉFILEMENT
// ==========================================================

function initReveal() {

document.documentElement.classList.add("js-ready");

const items = document.querySelectorAll(".reveal");

if (!items.length) return;

if (!("IntersectionObserver" in window)) {
items.forEach((item) => item.classList.add("is-visible"));
return;
}

const observer = new IntersectionObserver((entries) => {

entries.forEach((entry) => {
if (entry.isIntersecting) {
entry.target.classList.add("is-visible");
observer.unobserve(entry.target);
}
});

}, { threshold: 0.12 });

items.forEach((item) => observer.observe(item));

}

// ==========================================================
// RENDU
// ==========================================================

renderNarrative();
renderScore();
renderScoreBreakdown();

fillList("strengths", result.strengths, ETATS_VIDES.strengths, "check-circle");
fillList("weaknesses", result.weaknesses, ETATS_VIDES.weaknesses, "arrow-up-circle");
fillList("recommendations", result.recommendations, ETATS_VIDES.recommendations, "lightbulb");

renderCountries();
renderOpportunities();

initReveal();

if (window.lucide) lucide.createIcons();

}
