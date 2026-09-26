// LOT 126 (2026-09-26) — plus d'import statique de Firebase ici : le
// catalogue public n'en a besoin que pour pré-remplir la nationalité
// d'un étudiant CONNECTÉ (plus bas). Firebase n'est chargé que si le
// navigateur garde une trace de session (js/session-memorisee.js).
import { sessionMemorisee } from "./js/session-memorisee.js";

import { estEligible, paysAvecArticle } from "./js/eligibility-countries.js";

import { bourseCompatibleAge } from "./js/age-limits.js";

import { COUNTRY_NAMES } from "./js/countries.js";
import { initFitzCombobox } from "./js/fitz-combobox.js";

import {
estFinancementIntegral,
meilleurRangQS,
libelleFunder,
correspondTypeBourse,
premierePhrase
} from "./js/scholarship-filters.js";

import { resolveScholarshipImage } from "./js/scholarship-image.js";

import { etatCandidature } from "./js/echeance.js";

// La vue par pays — voir l'en-tête de js/catalogue-vue.js : 103 077 px
// de page mesurés le 2026-09-06, soit 113 écrans.
import { decouperVue, ligneEtendue, libelleVoirTout } from "./js/catalogue-vue.js";

// Chargeur de catalogue partagé et mémoïsé — voir js/catalog-data.js.
import { chargerCatalogue } from "./js/catalog-data.js";

// Signale à js/catalog-watchdog.js que ce module a bien démarré.
// À GARDER COMME PREMIÈRE INSTRUCTION EXÉCUTABLE du fichier, et à ne
// jamais déplacer dans une fonction : tout ce qui suit les imports ne
// s'exécute que si les quatre fichiers du SDK Firebase ont pu être
// téléchargés depuis www.gstatic.com. Quand l'un d'eux échoue (réseau
// coupé, délai dépassé, CDN bloqué), le navigateur n'exécute PAS ce
// module — donc ni le squelette de chargement, ni le bloc "Chargement
// interrompu" du try/catch plus bas ne s'affichent, et l'étudiant se
// retrouve devant une grille vide sans la moindre explication.
// Ce drapeau permet au filet de sécurité de distinguer "le module n'a
// jamais démarré" (il parle) de "le module tourne et gère lui-même ses
// erreurs, ou n'a légitimement rien à afficher" (il se tait).
// Voir js/catalog-watchdog.js pour le raisonnement complet.
window.__catalogueDemarre = true;

// ============================
// Page publique, en accès libre — même philosophie que
// universities-page.js (voir [[portal-transparency-philosophy]]).
//
// Architecture relationnelle (2026-07-30) : "scholarships" est déjà un
// document par programme (plus de duplication par niveau ni par
// université — voir admin/migrate.js pour la migration). Les
// universités partenaires d'une bourse se lisent via "programs"
// (where scholarshipId == cette bourse), jamais via un champ texte.
// ============================

function slugify(str) {

return (str || "")
.normalize("NFD")
.replace(/[̀-ͯ]/g, "")
.toLowerCase()
.replace(/[^a-z0-9]+/g, "-")
.replace(/^-+|-+$/g, "");

}

const params = new URLSearchParams(window.location.search);

// `let`, plus `const`, depuis le 2026-09-20 : la recherche est VIVANTE.
// Avant, la barre était muette à la saisie — elle n'agissait qu'à la
// touche Entrée, en rechargeant la page. Constaté par Charles sur le
// site en ligne. Le modèle est universities-page.js, vivant depuis le
// 2026-09-06 ; cette page ne l'avait jamais rattrapé.
let recherche = params.get("search") || "";

// La même normalisation que la recherche des universités : un étudiant
// qui tape « senegal » sans accent doit trouver « Sénégal ».
const normaliserRecherche = (t) => String(t || "")
.normalize("NFD")
.replace(/[̀-ͯ]/g, "")
.toLowerCase();
const niveau = params.get("level") || "";
const paysFiltre = params.get("country") || "";

// Alimentés par le quiz d'accueil (index.html, #pathQuiz) — de simples
// liens <a href="scholarships.html?funding=full">, aucun JS partagé
// entre les deux pages. "funding=full" et "maxRank=<entier>" sont des
// filtres à part entière, pas un vocabulaire propre au quiz : rien
// n'empêche d'y accrocher plus tard un contrôle dans cette page elle-
// même, exactement comme countryFilter/levelFilter aujourd'hui.
const financementIntegralFiltre = params.get("funding") === "full";
const rangMaxParam = parseInt(params.get("maxRank"), 10);
const rangMaxFiltre = Number.isFinite(rangMaxParam) ? rangMaxParam : null;

// Type de bourse (2026-08-30) — filtre exact sur le champ `funder` du
// document (voir correspondTypeBourse, js/scholarship-filters.js).
// Porté par l'URL comme les autres filtres : survit au rechargement et
// aux navigations reconstruites par navigateWithFilters().
const typeBourseFiltre = params.get("funder") || "";

// Filtre d'âge (2026-08-30) : `age` dans l'URL coche la case et
// pré-remplit le champ au chargement — le filtrage lui-même reste
// vivant (sans rechargement), comme la nationalité : un âge se tape au
// clavier. navigateWithFilters() porte la valeur d'une navigation à
// l'autre pour que changer de pays ou de niveau ne la perde pas.
const ageParam = parseInt(params.get("age"), 10);
const ageFiltreInitial = Number.isFinite(ageParam) && ageParam > 0 ? ageParam : null;

// « Tout afficher » (2026-09-06) : restaure le rendu d'avant la vue par
// pays — les 156 cartes dépliées d'un coup. C'est une porte de sortie
// assumée, pas le défaut : voir l'en-tête de js/catalogue-vue.js pour
// les 103 077 px que la vue par défaut corrige.
const toutAfficher = params.get("all") === "1";

const container = document.getElementById("scholarship-list");
const searchInput = document.getElementById("searchInput");
const searchClearBtn = document.getElementById("searchClearBtn");
const countryFilter = document.getElementById("countryFilter");
const levelFilter = document.getElementById("levelFilter");
const funderFilter = document.getElementById("funderFilter");
const resultsCount = document.getElementById("resultsCount");
const clearFiltersLink = document.getElementById("clearFiltersLink");
const countryPills = document.getElementById("countryPills");
const nationalityCheck = document.getElementById("nationalityFilterCheck");
const nationalityInput = document.getElementById("nationalityFilterInput");
// Lot CONTRÔLES-UNIFIÉS (2026-09-11) : les suggestions de pays sont un
// champ maison au rendu du site (js/fitz-combobox.js), plus un datalist.
const nationalityDatalist = null;
const ageCheck = document.getElementById("ageFilterCheck");
const ageInput = document.getElementById("ageFilterInput");

// ============================
// Éligibilité par nationalité (2026-08-30).
//
// estEligible() a TROIS valeurs de retour : false (exclu), true
// (éligible), null (on ne sait pas — restriction absente, nationalité
// vide, pays inconnu du référentiel). Tous les tests ci-dessous
// comparent STRICTEMENT à false : traiter null comme false cacherait
// des bourses à tort, le seul bug réellement grave de cette
// fonctionnalité (voir test/eligibility-countries.test.mjs).
//
// La valeur saisie survit d'une visite à l'autre (localStorage) et le
// profil Firestore la remplace dès que la session est connue — le
// profil est la donnée la plus fiable.
// ============================

let nationaliteCourante = "";
try { nationaliteCourante = localStorage.getItem("fitzNationalite") || ""; } catch { /* stockage bloqué */ }

if (nationalityInput) {
nationalityInput.value = nationaliteCourante;
initFitzCombobox(nationalityInput, COUNTRY_NAMES);
if (nationalityDatalist) {
}
}

// Âge courant du filtre « Compatibles avec mon âge » — même survie
// d'une visite à l'autre que la nationalité (localStorage) ; le
// paramètre d'URL `age`, quand il est là, prime ET coche la case.
let ageCourant = ageFiltreInitial;
if (ageCourant === null) {
try {
const memorise = parseInt(localStorage.getItem("fitzAge"), 10);
if (Number.isFinite(memorise) && memorise > 0) ageCourant = memorise;
} catch { /* stockage bloqué */ }
}

if (ageInput && ageCourant !== null) ageInput.value = ageCourant;
if (ageCheck && ageFiltreInitial !== null) ageCheck.checked = true;

// Pré-remplissage depuis le profil Firestore quand l'étudiant est
// connecté. Arrive après le rendu initial : on re-filtre si besoin.
// Lot 126 : seulement pour un navigateur qui garde une session.
sessionMemorisee().then(async (memorisee) => {
if (!memorisee || !nationalityInput) return;
const [{ db, auth }, { doc, getDoc }, { onAuthStateChanged }] = await Promise.all([
import("./firebase-config.js"),
import("https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js"),
import("https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js")
]);
onAuthStateChanged(auth, async (user) => {
if (!user) return;
try {
const snap = await getDoc(doc(db, "users", user.uid));
const natio = snap.exists() && snap.data().profile && snap.data().profile.nationality;
if (natio) {
nationaliteCourante = natio;
nationalityInput.value = natio;
try { localStorage.setItem("fitzNationalite", natio); } catch { /* stockage bloqué */ }
if (allScholarships.length) applyFilters();
}
} catch { /* hors ligne ou règles : le champ garde la valeur locale */ }
});
}).catch(() => { /* le pré-remplissage ne doit jamais toucher au catalogue */ });

function renderSkeleton() {

container.innerHTML = "";

for (let i = 0; i < 6; i++) {

const card = document.createElement("div");
card.className = "bourses-skeleton";

card.innerHTML = `
<div class="bourses-skeleton-line" style="width:100%;height:150px;border-radius:14px;"></div>
<div class="bourses-skeleton-line" style="width:50%;height:24px;margin-top:18px;"></div>
<div class="bourses-skeleton-line" style="width:80%;"></div>
<div class="bourses-skeleton-line" style="width:60%;"></div>
`;

container.appendChild(card);

}

}

// Résout, pour une bourse, ses universités partenaires (via programs)
// afin d'en tirer les pays réellement éligibles et une photo
// représentative — jamais le nom/logo d'une université précise,
// volontairement, pour ne pas empiéter sur le rôle du catalogue
// Universités.
function enrichWithProgramData(scholarship, programs, universitiesById, flagByCountry) {

const linkedPrograms = programs.filter((p) => p.scholarshipId === scholarship.id);

const linkedUniversities = linkedPrograms
.map((p) => universitiesById.get(p.universityId))
.filter(Boolean);

const countries = [...new Set(
linkedUniversities.map((u) => u.country).filter(Boolean).concat(scholarship.country ? [scholarship.country] : [])
)];

const withImage = linkedUniversities.find((u) => u.image);

// Même résolution que la photo ci-dessus (première université liée qui
// porte le champ) en priorité — reste la plus précise, propre à cette
// bourse. Repli sur flagByCountry (voir chargerBourses) si la bourse n'a
// aucun programme lié (stub, ex. Mastercard Foundation UM6P) ou si son
// université liée n'a pas de flag : toujours pas de table de
// correspondance pays -> code ISO écrite à la main, juste un 2e passage
// sur les universités déjà chargées, cette fois sans filtrer par lien.
const withFlag = linkedUniversities.find((u) => u.flag);
const flag = withFlag ? withFlag.flag : (flagByCountry.get(scholarship.country) || null);

const { image, imageSrcset } = resolveScholarshipImage({
pays: scholarship.country,
texteHash: scholarship.title || scholarship.id,
universiteImage: withImage ? withImage.image : null,
bourseImage: scholarship.image || null
});

// Voir js/scholarship-filters.js : le meilleur (plus petit) rang QS
// parmi les universités liées, ou null si aucune n'en a un. Choisi de
// la même façon que la photo et le drapeau juste au-dessus — une
// bourse est aussi bien classée que sa meilleure porte d'entrée.
const bestRanking = meilleurRangQS(linkedUniversities);

// COMPTAGE dédoublonné par université (2026-08-30) : la base modélise
// UN programme par couple (université, niveau), donc linkedUniversities
// contient la même université une fois par niveau — .length comptait
// des programmes ("41 universités partenaires" pour les 15 réelles de
// chinese-government-scholarship, "33" pour les 11 de
// stipendium-hungaricum). linkedUniversities reste NON dédoublonné plus
// haut : photo, drapeau et meilleurRangQS s'en accommodent (un doublon
// n'y change rien), seul le comptage affiché exigeait le Set.
const partnerCount = new Set(
linkedPrograms.map((p) => p.universityId).filter((id) => universitiesById.has(id))
).size;

// L'ÉTAT RÉEL DES CANDIDATURES (2026-09-05). Cette carte affichait
// « Candidatures ouvertes » dès que `isActive` n'était pas false —
// un drapeau éditorial qui ne dit rien du cycle. Mesuré sur
// l'instantané du 2026-09-04 : 42 bourses dont le champ `status`
// disait « Fermée » s'affichaient « ouvertes », et 4 autres dont
// l'échéance était derrière nous. On lit désormais les ÉCHÉANCES des
// programmes liés, et le statut seulement à défaut — voir
// etatCandidature() dans js/echeance.js pour l'ordre de décision.
const candidature = etatCandidature({
statut: scholarship.status,
actif: scholarship.isActive,
echeances: linkedPrograms.map((p) => p.deadline),
// LOT ÉCHÉANCES (2026-09-20) : les dates VÉRIFIÉES des mêmes
// programmes, agrégées comme les proses. Une seule encore à venir
// laisse la bourse ouverte ; toutes passées la ferment, même si la
// prose ne porte aucune date lisible. La carte et la fiche disent
// ainsi la même chose — c'est le défaut décrit juste au-dessus, vu
// cette fois par l'autre bout.
echeanceISO: linkedPrograms.map((p) => p.deadlineISO),
periodeOuverture: scholarship.periodeOuverture,
verifieLe: scholarship.verifieLe,
// « pays » ou « etablissement » : quand la date limite n'appartient
// pas à la bourse (DAAD, Eiffel, Shanghai — vérifié le 2026-09-05).
echeanceVariable: scholarship.echeanceVariable
});

return { ...scholarship, countries, image, imageSrcset, flag, partnerCount, bestRanking, candidature };

}

// Description de la carte.
//
// Réécrite le 2026-08-22. L'ancienne version fabriquait TOUJOURS une
// phrase à partir des champs pays/financement/niveaux quand la bourse
// n'avait pas de description propre :
//
//   "Bourse d'État accordée par le gouvernement de Hongrie financée à
//    100 %, ouverte du niveau Licence, Master."
//
// Or le pays est déjà l'en-tête du groupe qui surplombe la carte, le
// financement est la puce ambrée, et les niveaux sont les puces
// suivantes. Cette phrase répétait donc mot pour mot les trois
// informations affichées à 30 px en dessous — trois lignes de texte
// identiques d'une carte à l'autre, qui poussaient le vrai contenu
// vers le bas et faisaient se ressembler toutes les bourses.
//
// Ne reste que la description RÉELLE, celle saisie en base par
// l'administrateur. Elle est rare aujourd'hui, mais c'est la seule
// qui apprenne quelque chose ; le jour où elle est écrite, elle
// mérite sa place. Sans elle, la carte n'affiche simplement pas de
// paragraphe : mieux vaut une carte courte qu'une carte remplie de
// texte qui ne dit rien.
function buildDescription(scholarship) {

return scholarship.description || "";

}

let allScholarships = [];

// Conservé au niveau du module : renderHeroStats() en a besoin pour
// compter les universités DISTINCTES reliées à une bourse, et
// `programs` était jusqu'ici une variable locale à chargerBourses().
let programmesCharges = [];

async function chargerBourses() {

renderSkeleton();

try {

const catalogue = await chargerCatalogue();

const programs = catalogue.programmes;
programmesCharges = programs;
const universitiesById = new Map(catalogue.universites.map((u) => [u.id, u]));

// Repli drapeau par pays (voir enrichWithProgramData) : première
// université de tout le catalogue — pas seulement celles liées à cette
// bourse précise — qui porte ce pays et un flag. Construit une seule
// fois ici plutôt qu'à chaque bourse.
const flagByCountry = new Map();
for (const university of universitiesById.values()) {
if (university.country && university.flag && !flagByCountry.has(university.country)) {
flagByCountry.set(university.country, university.flag);
}
}

allScholarships = catalogue.bourses
.map((s) => enrichWithProgramData(s, programs, universitiesById, flagByCountry));

renderHeroStats(universitiesById);
populateCountryFilter();
applyFilters();

}

catch (error) {

console.error("Erreur Firestore :", error);

container.innerHTML = `
<div class="bourses-empty-state">
<div class="bourses-empty-state-icon"><i data-lucide="wifi-off"></i></div>
<h3>Chargement interrompu</h3>
<p>Vérifiez votre connexion Internet, puis réessayez.</p>
</div>
`;

if (window.lucide) lucide.createIcons();

}

}

// Chiffres de la bannière — calculés sur les données RÉELLEMENT
// chargées, jamais écrits en dur : un catalogue qui annonce
// "50 bourses" et en affiche 31 perd la confiance qu'il vient
// justement de demander.
//
// Les trois valeurs comptent des choses volontairement différentes :
//   - bourses      : le nombre de documents du catalogue ;
//   - pays d'accueil : les pays QUI ACCORDENT une bourse (le champ
//     `country` de la bourse), pas les pays éligibles ;
//   - universités concernées : le nombre d'établissements DISTINCTS
//     reliés à au moins une bourse — volontairement PAS le total du
//     catalogue affiché par universities.html et l'accueil
//     (« Établissements vérifiés ») : deux comptes différents portent
//     deux libellés différents, sinon 110 ici et 111 là se lisent
//     comme une incohérence. Compter les `partnerCount` de
//     chaque bourse aurait compté deux fois toute université reliée
//     à deux bourses, et gonflé le chiffre — exactement l'erreur que
//     ce bloc doit éviter.
//
// Si un des éléments manque (page modifiée), on sort sans rien
// casser : le tiret cadratin du HTML reste affiché.
function renderHeroStats(universitiesById) {

// Lot LANGAGE : la phrase d'entrée dit combien de bourses le
// catalogue compte — lu ici, jamais écrit dans le HTML.
const nombreEntree = document.getElementById("heroBoursesNombre");
if (nombreEntree && allScholarships.length) {
nombreEntree.textContent = String(allScholarships.length);
document.getElementById("heroBoursesTotal").hidden = false;
}

const elBourses = document.getElementById("statScholarships");
const elPays = document.getElementById("statCountries");
const elUniversites = document.getElementById("statPartners");

if (!elBourses || !elPays || !elUniversites) return;

const pays = new Set(allScholarships.map((s) => s.country).filter(Boolean));

const universitesLiees = new Set();
for (const programme of programmesCharges) {
if (programme.scholarshipId && programme.universityId && universitiesById.has(programme.universityId)) {
universitesLiees.add(programme.universityId);
}
}

elBourses.textContent = allScholarships.length;
elPays.textContent = pays.size;
elUniversites.textContent = universitesLiees.size;

}

function populateCountryFilter() {

const countries = [...new Set(allScholarships.map((s) => s.country).filter(Boolean))].sort((a, b) => a.localeCompare(b));

countries.forEach((country) => {
countryFilter.add(new Option(country, country));
});

if (paysFiltre && countries.includes(paysFiltre)) {
countryFilter.value = paysFiltre;
}

}

function applyFilters() {

let scholarships = allScholarships;

if (recherche) {
scholarships = scholarships.filter((scholarship) => {

const haystack = [
scholarship.title,
scholarship.country,
...(scholarship.countries || []),
...(scholarship.levels || [])
].join(" ");

return normaliserRecherche(haystack).includes(normaliserRecherche(recherche));

});
}

// Le filtre PAYS est volontairement appliqué en DERNIER (voir la fin de
// cette fonction) : l'index des pays du bas de page doit lister tous les
// pays qui restent après les AUTRES filtres. Le calculer sur la liste
// déjà réduite à un pays ne proposerait plus que ce pays-là — un index
// qui ne mène nulle part.

if (niveau) {
scholarships = scholarships.filter((scholarship) => (scholarship.levels || []).includes(niveau));
}

if (financementIntegralFiltre) {
scholarships = scholarships.filter((scholarship) => estFinancementIntegral(scholarship.funding));
}

if (rangMaxFiltre !== null) {
scholarships = scholarships.filter((scholarship) => scholarship.bestRanking !== null && scholarship.bestRanking <= rangMaxFiltre);
}

// Type de bourse : correspondance EXACTE sur `funder`. Une bourse sans
// champ (bailleur inconnu) n'est retirée que quand un type précis est
// choisi — sur « Tous les types » elle reste visible, un champ absent
// est un inconnu, jamais une valeur par défaut.
if (typeBourseFiltre) {
scholarships = scholarships.filter((scholarship) => correspondTypeBourse(scholarship.funder, typeBourseFiltre));
}

// « Ouvertes à ma nationalité » : ne retire QUE les bourses dont la
// restriction officielle exclut cette nationalité. `!== false` est le
// cœur de la règle — null (pas de restriction connue, nationalité
// vide, pays non résolu) reste affiché.
if (nationalityCheck && nationalityCheck.checked) {
scholarships = scholarships.filter((scholarship) => estEligible(scholarship.eligibility, nationaliteCourante) !== false);
}

// « Compatibles avec mon âge » : ne retire que les bourses dont le
// plafond ageMax est dépassé — sur le niveau filtré, ou sur TOUS les
// niveaux de la bourse quand aucun niveau n'est filtré (possible sur
// un seul cycle = affichée). Les bourses sans limite connue restent
// affichées : un champ absent est un inconnu, jamais « exclu » — voir
// bourseCompatibleAge, js/age-limits.js.
if (ageCheck && ageCheck.checked && ageCourant !== null) {
scholarships = scholarships.filter((scholarship) => bourseCompatibleAge(scholarship, ageCourant, niveau));
}

// Tous les filtres SAUF le pays : c'est la portée de l'index des pays.
const sansPays = scholarships;

const visibles = paysFiltre
? sansPays.filter((scholarship) => scholarship.country === paysFiltre)
: sansPays;

afficherBourses(visibles, sansPays);

}

function renderCard(scholarship) {

const card = document.createElement("div");

card.className = "card scholarship-card";

// `candidature` est posé par enrichWithProgramData ; le repli garde
// la carte affichable si un appelant l'oublie un jour.
const candidature = scholarship.candidature || etatCandidature({
statut: scholarship.status,
actif: scholarship.isActive
});

const isOpen = candidature.ouvert === true;

const levelChips = (scholarship.levels || [])
.map((level) => `<span class="scholarship-card-chip"><i data-lucide="graduation-cap"></i>${level}</span>`)
.join("");

// N'affiche la liste des pays éligibles que si elle apporte une
// information (plus d'un pays, ou différente du pays déjà montré sur
// la photo) — sinon c'est une redite pure.
const otherCountries = (scholarship.countries || []).filter((c) => c !== scholarship.country);
const showCountriesRow = otherCountries.length > 0;

const srcsetAttr = scholarship.imageSrcset
? ` srcset="${scholarship.imageSrcset}" sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 380px"`
: "";

// Repli sur l'icône globe si aucune université liée ne porte de champ
// flag (en théorie jamais atteint, chaque bourse du catalogue a au
// moins un programme lié) — jamais d'image cassée.
const countryIconHtml = scholarship.flag
? `<img src="assets/flags/${scholarship.flag}" alt="" width="20" height="15" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='assets/flags/default.svg'">`
: `<i data-lucide="globe"></i>`;

// Nombre d'universités concernées. Il était calculé depuis toujours
// par enrichWithProgramData() et n'était affiché NULLE PART — alors
// que c'est la réponse à "est-ce que cette bourse ouvre sur beaucoup
// de portes ?", et exactement ce que le clic va montrer.
// Au singulier/pluriel, et tu de la carte quand il vaut 0 (bourse
// encore sans programme lié) plutôt qu'afficher "0 université".
const partners = scholarship.partnerCount || 0;

// PUCE FINANCEMENT (lot 74, 2026-09-22) : la première phrase du
// `funding`, en entier — voir premierePhrase() dans
// js/scholarship-filters.js. Plus de « financé » accolé : la phrase
// se suffit (« Bourse complète », « 1 000 € par mois… »), et plus de
// line-clamp : rien n'est coupé, ni sur téléphone ni sur ordinateur.
//
// Uniquement une description saisie en base (voir buildDescription) :
// la phrase générée automatiquement qui vivait ici répétait le pays,
// le financement et les niveaux affichés juste en dessous.
const description = buildDescription(scholarship);

const partnersHtml = partners > 0
? `<p class="scholarship-card-partners">
<i data-lucide="landmark"></i>
<span><strong>${partners}</strong> université${partners > 1 ? "s" : ""} concernée${partners > 1 ? "s" : ""}</span>
</p>`
: "";

// Type de bourse — libellé texte discret, seulement quand `funder` est
// présent en base (libelleFunder renvoie "" sinon : on n'affiche RIEN,
// jamais « bailleur non renseigné »). Volontairement PAS un badge : le
// badge Fitz (.fitz-badge/.ai-badge) est un composant unique défini
// dans css/base.css et ne se redéfinit ni ne se détourne.
const typeBourse = libelleFunder(scholarship.funder);
const funderHtml = typeBourse
? `<p class="scholarship-card-funder">${typeBourse}${scholarship.funderName ? ` · ${scholarship.funderName}` : ""}</p>`
: "";

// La ligne pays (drapeau + nom du pays) a été retirée le 2026-08-22 :
// l'en-tête du groupe qui surplombe la carte annonce déjà ce pays,
// drapeau compris, à 40 px au-dessus. countryIconHtml reste calculé
// plus haut car renderCountryPills() et l'en-tête de groupe s'en
// servent — c'est bien la ligne DANS la carte qui faisait doublon,
// pas le drapeau lui-même.
//
// La description générée par buildDescription() est retirée pour la
// même raison : "Bourse d'État accordée par le gouvernement de X
// financée à 100 %, ouverte du niveau Licence, Master" répétait mot
// pour mot le pays du groupe, la puce de financement et les puces de
// niveau affichées juste en dessous. Trois lignes identiques sur
// toutes les cartes, pour zéro information nouvelle.
card.innerHTML = `
<div class="scholarship-card-media">
<img src="${scholarship.image}"${srcsetAttr} width="800" height="533" alt="" loading="lazy" decoding="async">
<span class="scholarship-card-status ${isOpen ? "is-open" : ""}" title="${candidature.detail}">${candidature.badge}</span>
</div>

<div class="scholarship-card-body">

<h3>${scholarship.title || "Bourse d'études"}</h3>

${funderHtml}

${estEligible(scholarship.eligibility, nationaliteCourante) === false ? `<p class="scholarship-card-inel">Non ouverte aux ressortissants ${paysAvecArticle(nationaliteCourante)}</p>` : ""}

${description ? `<p class="scholarship-card-desc">${description}</p>` : ""}

${partnersHtml}

<div class="scholarship-card-meta">
${scholarship.funding ? `<span class="scholarship-card-chip is-funding"><i data-lucide="coins"></i><span>${premierePhrase(scholarship.funding)}</span></span>` : ""}
${levelChips}
</div>

${showCountriesRow ? `<div class="scholarship-card-countries"><strong>Aussi éligible depuis :</strong><span>${scholarship.countries.filter((c) => c !== scholarship.country).join(", ")}</span></div>` : ""}

<button type="button" class="scholarship-card-cta details-btn">
<span>Voir les universités concernées</span>
<i data-lucide="arrow-right"></i>
</button>

</div>
`;

// Toute la carte est cliquable, pas seulement le bouton : sur une
// grille de vignettes, viser un lien de 200 px de large au milieu
// d'une cible de 340 px n'a aucun sens. Le bouton reste dans le DOM
// pour le clavier et les lecteurs d'écran (c'est lui qui porte le
// libellé de l'action), et .scholarship-card:focus-within porte le
// contour de focus pour que la cible visible corresponde à la cible
// réelle.
card.style.cursor = "pointer";

function ouvrirUniversites() {
window.location.href = `universities.html?scholarshipId=${encodeURIComponent(scholarship.id)}`;
}

// Le clic sur le bouton remonte jusqu'à la carte : sans ce stopPropagation
// le gestionnaire s'exécuterait deux fois. Inoffensif ici (deux fois la
// même navigation) mais ce serait un vrai bogue le jour où l'action
// devient autre chose qu'un window.location.
card.querySelector(".details-btn").addEventListener("click", (event) => {
event.stopPropagation();
ouvrirUniversites();
});

card.addEventListener("click", ouvrirUniversites);

return card;

}

// Regroupe par pays — jamais d'accordéon, toutes les sections restent
// dépliées. Le tri des sections a changé le 2026-09-05 : ce n'est plus
// la richesse (nombre de bourses) qui commande, mais le nombre de
// candidatures OUVERTES ; la richesse ne départage plus qu'à égalité.
//
// ORDRE D'AFFICHAGE — les candidatures ouvertes d'abord (2026-09-05)
//
// Le même jour, la pastille des cartes a cessé de mentir : 73 bourses
// sur 156 sont réellement closes. Les laisser mêlées aux ouvertes
// aurait fait payer l'honnêteté à l'étudiant, qui aurait dû ouvrir
// cinq fiches pour trouver une bourse sur laquelle agir cette semaine.
//
// QUATRE RANGS : ouverte, PAS ENCORE OUVERTE, inconnue, close.
//
// « Pas encore ouverte » (cycle clos mais clôture du suivant déjà
// annoncée, ex. Stipendium Hungaricum au 15 janvier 2027) se range
// juste derrière les ouvertes et devant les inconnues : c'est la
// bourse la plus préparable qui soit — on connaît la date, il reste
// des mois. La reléguer avec les closes serait perdre l'étudiant qui
// a justement le temps de monter un dossier.
//
// Un calendrier non publié n'est pas un refus non plus : même règle
// des trois valeurs que estEligible() — `null` ne se range jamais
// avec `false`.
//
// À l'intérieur d'un rang, l'ordre reçu est CONSERVÉ (tri stable). On
// ne remonte délibérément pas l'échéance la plus proche : voir la
// section 6 de js/echeance.js — une bourse qui ferme dans quatre jours
// n'est pas une opportunité pour qui découvre le site aujourd'hui.
const RANGS = { ouverte: 0, attente: 1, inconnue: 2, close: 3 };

function rangCandidature(item) {

const ton = item.candidature ? item.candidature.ton : "inconnue";

return RANGS[ton] ?? RANGS.inconnue;

}

function compterOuvertes(items) {
return items.filter((item) => rangCandidature(item) === 0).length;
}

function groupByCountry(items) {

const groups = new Map();

items.forEach((item) => {
const country = item.country || "Autre";
if (!groups.has(country)) groups.set(country, []);
groups.get(country).push(item);
});

return [...groups.entries()]
.map(([country, group]) => ({
country,
items: [...group].sort((a, b) => rangCandidature(a) - rangCandidature(b)),
ouvertes: compterOuvertes(group)
}))
// Les pays où l'on peut candidater MAINTENANT passent devant. Le
// volume ne départage plus qu'à nombre d'ouvertes égal : un pays qui
// porte quinze bourses toutes closes n'a rien à faire en tête.
.sort((a, b) =>
b.ouvertes - a.ouvertes ||
b.items.length - a.items.length ||
a.country.localeCompare(b.country, "fr")
);

}

// UNE PASTILLE EST UN FILTRE, PLUS UNE ANCRE (2026-09-06)
//
// Elle pointait vers `#country-italie`, c'est-à-dire vers un endroit de
// la même page interminable : cliquer « Italie » faisait défiler 40 000
// px et laissait l'étudiant au milieu de 156 cartes, sans repère. Elle
// charge maintenant `?country=Italie` — la même page, réduite à ce
// pays. Le bouton Retour du navigateur redevient utile, et l'URL se
// partage.
function pastillePays({ country, items }, actif) {

const flag = items.find((item) => item.flag) || {};
const flagImg = flag.flag ? `<img src="assets/flags/${flag.flag}" alt="" width="20" height="15" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='assets/flags/default.svg'">` : "";

// `tout: false` : cliquer un pays sort du mode « Tout afficher » —
// on a justement demandé à voir moins.
const href = urlAvecFiltres({ country, tout: false });

return `<a href="${href}" class="catalog-country-pill${actif ? " is-active" : ""}">${flagImg}<span>${country}</span><span class="catalog-country-pill-count">${items.length}</span></a>`;

}

function renderCountryPills(groups) {

if (groups.length <= 1) {
countryPills.hidden = true;
countryPills.innerHTML = "";
return;
}

countryPills.hidden = false;

countryPills.innerHTML = groups.map((g) => pastillePays(g, g.country === paysFiltre)).join("");

}

const NOMS_BOURSES = { un: "bourse", plusieurs: "bourses", accord: "e" };

// LA TABLE DES MATIÈRES (2026-09-06)
//
// C'est elle qui rend la vue courte acceptable : on ne montre plus les
// 30 pays d'un coup, mais on les NOMME tous, avec leur compte, à portée
// d'un clic. Sans elle, réduire la page reviendrait à cacher le
// catalogue.
//
// Elle est rendue DANS le conteneur de liste, qui est vidé à chaque
// affichage : aucun risque d'en accumuler deux quand la page se
// re-rend (recherche vivante, changement de filtre).
function renderIndexPays(groupesIndex, vue) {

if (groupesIndex.length <= 1) return;

const nav = document.createElement("nav");
nav.className = "catalog-country-index";
nav.setAttribute("aria-label", "Tous les pays du catalogue");

const restants = vue.partielle
? `<p class="catalog-country-index-lead">Le catalogue compte ${vue.total} bourse${vue.total > 1 ? "s" : ""} dans ${groupesIndex.length} pays. Choisissez une destination :</p>`
: `<p class="catalog-country-index-lead">Toutes les destinations du catalogue :</p>`;

nav.innerHTML = restants
+ `<div class="catalog-country-index-pills">${groupesIndex.map((g) => pastillePays(g, g.country === paysFiltre)).join("")}</div>`
// « Tout afficher » reste possible, et reste discret : c'est la porte
// de sortie de quelqu'un qui sait ce qu'il fait, pas le chemin normal.
+ (toutAfficher
? `<a class="catalog-tout-afficher" href="${urlAvecFiltres({ country: "", tout: false })}">Revenir à la vue par pays</a>`
: `<a class="catalog-tout-afficher" href="${urlAvecFiltres({ country: "", tout: true })}">Tout afficher (${vue.total} bourse${vue.total > 1 ? "s" : ""} d'un coup)</a>`);

container.appendChild(nav);

}

function afficherBourses(scholarships, sansPays = scholarships) {

container.innerHTML = "";

clearFiltersLink.hidden = !(recherche || niveau || paysFiltre || typeBourseFiltre || financementIntegralFiltre || rangMaxFiltre !== null || toutAfficher || (nationalityCheck && nationalityCheck.checked) || (ageCheck && ageCheck.checked));

if (scholarships.length === 0) {

resultsCount.textContent = "Aucune bourse ne correspond à ces filtres";

countryPills.hidden = true;
countryPills.innerHTML = "";

container.innerHTML = `
<div class="bourses-empty-state">
<div class="bourses-empty-state-icon"><i data-lucide="search-x"></i></div>
<h3>Pas encore de résultat pour cette recherche</h3>
<p>Essayez un autre pays, un autre niveau, ou modifiez votre recherche.</p>
</div>
`;

if (window.lucide) lucide.createIcons();

return;

}

const groups = groupByCountry(scholarships);

// L'index (barre du haut ET table des matières du bas) porte tous les
// pays qui survivent aux autres filtres — pas seulement ceux de la vue.
const groupesIndex = groupByCountry(sansPays);

renderCountryPills(groupesIndex);

// La vue a une fin : voir js/catalogue-vue.js. Le tri des pays et le
// rang des cartes arrivent ici déjà faits, et ressortent intacts.
const vue = decouperVue(groups, { paysFiltre, tout: toutAfficher });

resultsCount.textContent = ligneEtendue(vue, NOMS_BOURSES, {
pays: groupesIndex.length,
paysFiltre,
ouvertes: vue.mode === "pays" && groups[0] ? groups[0].ouvertes : undefined
});

vue.groupes.forEach((groupe) => {

const { country, items, ecourte } = groupe;
const ouvertes = groupe.source.ouvertes;
const total = groupe.total;

const section = document.createElement("section");
section.className = "catalog-country-group";
section.id = `country-${slugify(country)}`;

const flag = items.find((item) => item.flag) || {};
const flagImg = flag.flag ? `<img src="assets/flags/${flag.flag}" alt="" width="20" height="15" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='assets/flags/default.svg'">` : "";

section.innerHTML = `
<div class="catalog-country-header">
${flagImg}
<h2>${country}</h2>
<span>(${total} bourse${total > 1 ? "s" : ""} · ${ouvertes ? `${ouvertes} ouverte${ouvertes > 1 ? "s" : ""}` : "aucune ouverte"})</span>
</div>
<div class="bourses-grid"></div>
${ecourte ? `<a class="catalog-country-more" href="${urlAvecFiltres({ country, tout: false })}"><span>${libelleVoirTout(groupe, NOMS_BOURSES)}</span><i data-lucide="arrow-right"></i></a>` : ""}
`;

const grid = section.querySelector(".bourses-grid");
items.forEach((scholarship) => grid.appendChild(renderCard(scholarship)));

container.appendChild(section);

});

renderIndexPays(groupesIndex, vue);


// Les toutes premières cartes sont au-dessus de la ligne de
// flottaison : les servir en `lazy` retarde la plus grande image
// visible (LCP). Les deux premières photos rendues repassent en
// chargement prioritaire — les suivantes restent différées.
// (2026-08-29, passe de fluidité.)
container.querySelectorAll(".scholarship-card-media img, .uni-card-media img").forEach((img, i) => {
if (i < 2) {
img.loading = "eager";
img.setAttribute("fetchpriority", "high");
}
});

if (window.lucide) lucide.createIcons();

}

// ============================
// Barre de recherche (reconstruit l'URL à partir de l'état courant des
// 6 filtres — recherche, pays, niveau, type de bourse, financement
// intégral, rang QS maximum — pour que changer l'un ne perde jamais
// les autres, cf. audit du 2026-08-16).
//
// funding/maxRank ne sont jamais TOUCHÉS par les contrôles de recherche
// existants (aucun n'y touche) — seulement PORTÉS d'une navigation à
// l'autre : un visiteur arrivé du quiz d'accueil (funding=full) qui
// tape un mot dans la recherche ne doit pas perdre silencieusement le
// filtre qu'il avait choisi en arrivant.
// ============================

function urlAvecFiltres({
search = recherche,
country = paysFiltre,
level = niveau,
funderType = typeBourseFiltre,
funding = financementIntegralFiltre,
maxRank = rangMaxFiltre,
tout = toutAfficher
} = {}) {

const url = new URL("scholarships.html", window.location.origin);

if (search) url.searchParams.set("search", search);
if (country) url.searchParams.set("country", country);
if (level) url.searchParams.set("level", level);
if (funderType) url.searchParams.set("funder", funderType);
if (funding) url.searchParams.set("funding", "full");
if (maxRank !== null && maxRank !== undefined) url.searchParams.set("maxRank", String(maxRank));
// Le filtre d'âge est vivant (pas de rechargement à la saisie) mais
// PORTÉ d'une navigation à l'autre dès que la case est cochée — sinon
// changer de pays ou de niveau le décocherait en silence.
if (ageCheck && ageCheck.checked && ageCourant !== null) url.searchParams.set("age", String(ageCourant));
if (tout) url.searchParams.set("all", "1");

return url.pathname.split("/").pop() + url.search;

}

// Les pastilles de pays et les liens « Voir les N bourses » passent par
// urlAvecFiltres() plutôt que de bâtir leur URL à la main : c'est ce qui
// garantit qu'aller voir l'Italie ne perd pas la recherche, le niveau ou
// le type de bourse déjà choisis (audit du 2026-08-16, même raison
// qu'ici).
function navigateWithFilters(options) {
window.location.href = urlAvecFiltres(options);
}

if (searchInput) {

searchInput.value = recherche;

searchClearBtn.hidden = !recherche;

// RECHERCHE VIVANTE (2026-09-20). La page répond À LA SAISIE, comme
// universities-page.js : un léger délai (200 ms) évite de re-rendre
// 156 cartes à chaque lettre. `recherche` étant devenue `let`, les
// navigations (pastilles, filtres pays/niveau) emportent la saisie
// courante via urlAvecFiltres, exactement comme avant. Entrée ne
// recharge plus la page : elle n'apportait rien que la saisie ne
// fasse déjà.
let attenteRecherche = null;
searchInput.addEventListener("input", () => {
searchClearBtn.hidden = !searchInput.value;
clearTimeout(attenteRecherche);
attenteRecherche = setTimeout(() => {
recherche = searchInput.value.trim();
if (allScholarships.length) applyFilters();
}, 200);
});

searchInput.addEventListener("keydown", function (event) {

if (event.key === "Enter") {
event.preventDefault();
clearTimeout(attenteRecherche);
recherche = searchInput.value.trim();
if (allScholarships.length) applyFilters();
}

});

}

if (searchClearBtn) {

searchClearBtn.addEventListener("click", () => {
searchInput.value = "";
searchClearBtn.hidden = true;
recherche = "";
if (allScholarships.length) applyFilters();
searchInput.focus();
});

}

// ============================
// Filtre pays
// ============================

if (countryFilter) {

countryFilter.addEventListener("change", function () {

navigateWithFilters({
search: recherche,
country: this.value,
level: niveau
});

});

}

// ============================
// Filtre niveau
// ============================

if (levelFilter) {

levelFilter.value = niveau;

levelFilter.addEventListener("change", function () {

navigateWithFilters({
search: recherche,
country: paysFiltre,
level: this.value
});

});

}

// ============================
// Filtre type de bourse
// ============================

if (funderFilter) {

funderFilter.value = typeBourseFiltre;

funderFilter.addEventListener("change", function () {

navigateWithFilters({
search: recherche,
country: paysFiltre,
level: niveau,
funderType: this.value
});

});

}

// ============================
// Filtre « Ouvertes à ma nationalité » — vivant, sans rechargement :
// contrairement aux filtres d'URL ci-dessus, la nationalité se tape au
// clavier ; renaviguer à chaque frappe serait inutilisable. Le lien
// #clearFiltersLink (href="scholarships.html") recharge la page, donc
// décoche la case comme il efface les autres filtres.
//
// La mention « Non ouverte aux ressortissants… » des cartes est rendue
// dès que la nationalité est connue, case cochée OU NON : on informe
// toujours, on ne retire qu'à la demande.
// ============================

if (nationalityCheck) {

nationalityCheck.addEventListener("change", () => {
if (allScholarships.length) applyFilters();
});

}

if (nationalityInput) {

nationalityInput.addEventListener("input", () => {
nationaliteCourante = nationalityInput.value.trim();
try { localStorage.setItem("fitzNationalite", nationaliteCourante); } catch { /* stockage bloqué */ }
if (allScholarships.length) applyFilters();
});

}

// ============================
// Filtre « Compatibles avec mon âge » — même vie sans rechargement que
// la nationalité juste au-dessus, mêmes raisons.
// ============================

if (ageCheck) {

ageCheck.addEventListener("change", () => {
if (allScholarships.length) applyFilters();
});

}

if (ageInput) {

ageInput.addEventListener("input", () => {
const valeur = parseInt(ageInput.value, 10);
ageCourant = Number.isFinite(valeur) && valeur > 0 ? valeur : null;
try {
if (ageCourant !== null) localStorage.setItem("fitzAge", String(ageCourant));
else localStorage.removeItem("fitzAge");
} catch { /* stockage bloqué */ }
if (allScholarships.length) applyFilters();
});

}

chargerBourses();
