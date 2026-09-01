// ============================================================
// ScholarBridge — Élargissement du catalogue, Lot 7 (2026-08-28)
// Consolidation demandée avant l'ajout de nouveaux pays : donner une
// DEUXIÈME université réelle aux bourses nationales/gouvernementales
// coincées à 0 ou 1 seule, identifiées par admin/audit-catalog.js.
//
// Les 5 bourses ciblées (audit du 28/08/2026) :
// - Eiffel Excellence Scholarship (France)         0 université
// - Italian Government Scholarship (Italie)        0 université
// - Bourses du gouvernement saoudien (Ar. Saoudite) 1 (King Saud)
// - Romanian Government Scholarship (Roumanie)      1 (Univ. Bucarest)
// - Swiss Government Excellence Scholarships (CH)   1 (ETH Zurich)
//
// Vanier Canada Graduate Scholarship (0 université) reste hors
// périmètre — fermée/remplacée, sans urgence (voir audit).
//
// RÉSOLUTION PAR RECHERCHE, JAMAIS PAR ID EN DUR
// ------------------------------------------------
// Les 5 bourses ci-dessus sont antérieures aux lots 1-6 (import
// initial + migration du 2026-07-30) : leurs ids réels ne sont pas
// fiables à deviner. Même patron que le lot 5 (EXPECTED_SCHOLARSHIPS,
// recherche par titre normalisé) — étendu ici aux UNIVERSITÉS : pour
// réutiliser Sapienza, Bologne et Sciences Po (déjà au catalogue),
// EXPECTED_UNIVERSITIES les retrouve par nom plutôt que de deviner
// leur id, avec le même blocage propre en cas de 0 ou plusieurs
// correspondances. Sciences Po a d'abord été codée par erreur comme
// une CRÉATION dans une première version de ce script — l'étape 1 a
// détecté la collision d'id à l'exécution (déjà au catalogue,
// vraisemblablement via la bourse Émile Boutmy) et bloqué proprement,
// exactement le rôle attendu de l'étape "Analyser" : rattraper une
// hypothèse fausse avant toute écriture, pas seulement les vraies
// pannes.
//
// CE QUI EST MIS À JOUR, CE QUI NE L'EST PAS
// --------------------------------------------
// Eiffel et Italian Government Scholarship sont de VRAIS stubs à 0
// université depuis l'import initial (comme MEXT/GKS/Türkiye avant le
// lot 5) : leur jeu de champs est probablement incomplet ou faux (le
// niveau "Licence" d'Eiffel, en particulier — Eiffel est Master et
// Doctorat uniquement, confirmé par la page officielle Campus France).
// Ces deux bourses sont donc réécrites en ENTIER (setDoc SANS merge,
// même mécanisme que le lot 5), avec le jeu de 9 champs standard du
// catalogue.
//
// Saoudite/Roumanie/Suisse ont déjà 1 université fonctionnelle et des
// champs corrects (Saoudite et Roumanie réécrits proprement au lot 5 ;
// Suisse jamais touché par aucun lot, donc migré directement avec un
// programme ETH Zurich qui marche). Aucune des trois bourses n'est
// donc modifiée ici — seuls de nouveaux programmes/universités sont
// ajoutés, exactement comme ARES au lot 6.
//
// COUVERTURE DES SOURCES (établissements ajoutés)
// -------------------------------------------------
// Eiffel -> Sciences Po (sciencespo.fr, page Eiffel officielle),
// RÉUTILISÉE (déjà au catalogue, vraisemblablement via Émile Boutmy),
// et Sorbonne Université (sorbonne-universite.fr, actualité Eiffel
// 2026/2027), NOUVELLE : deux établissements parisiens confirmés
// participants, avec calendrier/domaines propres à chacun.
//
// Italie -> Sapienza et Università di Bologna, RÉUTILISÉES (déjà au
// catalogue pour leur propre PhD Scholarship interne) : le bando MAECI
// national (studyinitaly.esteri.it, deadline 26/03/2026 pour le cycle
// 2026-2027) est un programme distinct et cumulable avec les bourses
// doctorales internes de ces mêmes établissements.
//
// Arabie Saoudite -> Princess Nourah bint Abdulrahman University,
// Riyad. Confirmée dans la liste des 27 universités du portail
// studyinsaudi.moe.gov.sa (guide truescho.com croisé avec la structure
// à 50+ universités publiques déjà documentée au lot 5). King Abdulaziz
// University (Jeddah) est également confirmée éligible mais écartée ce
// lot-ci : aucune photo de Jeddah en stock (voir plus bas).
//
// Roumanie -> Universitatea Națională de Știință și Tehnologie
// Politehnica din București (ex-Universitatea Politehnica din
// București, renommée après une fusion universitaire récente — upb.ro
// confirme le nouveau nom). Grande école d'ingénieurs publique de
// Bucarest, portail scholarships.studyinromania.gov.ro confirme une
// affectation par le Ministère à un établissement accrédité, sans
// liste fermée — cohérent avec le principe déjà appliqué à l'Université
// de Bucarest au lot 5.
//
// Suisse -> University of Zurich (UZH). La page officielle sbfi.admin.ch
// confirme explicitement l'éligibilité de "any Swiss cantonal
// university" en plus d'ETHZ/EPFL/instituts du domaine des EPF — UZH
// est la plus grande université cantonale du pays.
//
// PHOTOS DE VILLE — AUCUNE NOUVELLE CE LOT-CI
// ----------------------------------------------
// paris.jpg, rome.jpg (Sapienza), bologna.jpg, riyadh.jpg, bucharest.jpg
// et zurich.jpg existent déjà, de même que fr.svg/it.svg/sa.svg/ro.svg/
// ch.svg. Premier lot d'expansion depuis le 4 à ne nécessiter AUCUN
// nouvel asset (image ou drapeau) — d'où l'absence de section "PHOTOS"
// bloquante comme aux lots 4 et 6.
//
// CANDIDATS ÉCARTÉS FAUTE DE PHOTO EN STOCK (pistes pour un lot futur)
// -----------------------------------------------------------------------
// - EPFL (Lausanne, Suisse) : explicitement éligible aux Swiss Gov.
//   Excellence Scholarships, mais aucune photo de Lausanne en stock.
// - King Abdulaziz University (Jeddah, Arabie Saoudite) : confirmée
//   éligible, mais aucune photo de Jeddah en stock.
// Même logique que UM6P/UCLouvain, laissés en stub au lot 4 et
// débloqués seulement au lot 6 une fois les photos disponibles.
// ============================================================

import { db } from "../firebase-config.js";

import {
collection,
getDocs,
getDoc,
doc,
setDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

function normalize(str) {
return String(str || "")
.normalize("NFD")
.replace(/[̀-ͯ]/g, "")
.toLowerCase()
.trim();
}

// -------- Bourses à retrouver par titre (5) --------
const EXPECTED_SCHOLARSHIPS = [
{
key: "eiffel",
label: "Eiffel Excellence Scholarship",
match: (title) => normalize(title).includes("eiffel")
},
{
key: "italy",
label: "Italian Government Scholarship",
match: (title) => normalize(title).includes("italian government")
},
{
key: "saudi",
label: "Bourses du gouvernement saoudien pour étudiants internationaux",
match: (title) => normalize(title).includes("gouvernement saoudien")
},
{
key: "romania",
label: "Romanian Government Scholarship",
match: (title) => normalize(title).includes("romanian government")
},
{
key: "swiss",
label: "Swiss Government Excellence Scholarships",
match: (title) => normalize(title).includes("swiss government")
}
];

// -------- Universités déjà au catalogue à retrouver par nom (3) --------
// Réutilisées telles quelles, aucun champ université n'est modifié,
// seul un nouveau programme est créé vers chacune. Sapienza et Bologne
// pour l'Italian Government Scholarship (prévu dès la conception de ce
// lot). Sciences Po pour Eiffel a été ajoutée après coup : l'étape 1
// a détecté une collision d'id à l'exécution (déjà au catalogue,
// vraisemblablement via la bourse Émile Boutmy — voir l'audit) — signe
// que le plan initial la traitait à tort comme une création.
const EXPECTED_UNIVERSITIES = [
{
key: "sapienza",
label: "Sapienza (Rome)",
match: (u) => normalize(u.name).includes("sapienza")
},
{
key: "bologna",
label: "Università di Bologna",
match: (u) => normalize(u.name).includes("bologna")
},
{
key: "sciencespo",
label: "Sciences Po",
match: (u) => normalize(u.name).includes("sciences po")
}
];

// -------- Données de réécriture complète (2 bourses, id résolu à
// l'étape 1) — setDoc SANS merge, même mécanisme que le lot 5 : ce
// sont de vrais stubs, on fournit le jeu de champs complet et correct
// plutôt que de fusionner avec un contenu d'origine douteux. --------
const SCHOLARSHIP_UPDATE_DATA = {
eiffel: {
title: "Eiffel Excellence Scholarship",
country: "France",
funding: "Master : 1 200 €/mois — Doctorat : 2 100 €/mois (tarifs en vigueur, Campus France, janvier 2026) + aide transport + assurance + accompagnement logement. Frais de scolarité NON couverts.",
description: "Bourse du Ministère français de l'Europe et des Affaires étrangères, gérée par Campus France. Toute université ou grande école française peut candidater pour présenter un étudiant — il n'existe pas de liste fermée d'établissements éligibles, chaque candidature est déposée par l'établissement d'accueil lui-même via le portail Campus France.",
status: "Ouverte",
isActive: true,
levels: ["Master", "Doctorat"],
officialWebsite: "https://www.campusfrance.org/en/the-france-excellence-eiffel-scholarship-program",
generalCriteria: "Licence NON éligible (Master et Doctorat uniquement — l'import initial incluait Licence par erreur). Candidature déposée par l'établissement français d'accueil, pas directement par l'étudiant : se renseigner auprès du service des relations internationales de l'université visée. Domaines et nombre de places variables selon l'établissement candidat chaque année."
},
italy: {
title: "Italian Government Scholarship",
country: "Italie",
funding: "Prise en charge partielle ou totale des frais universitaires + logement en résidence universitaire (ou allocation logement) + couverture santé + allocation mensuelle — montants exacts fixés chaque année par le bando MAECI.",
description: "Bourse du gouvernement italien (MAECI — Ministero degli Affari Esteri e della Cooperazione Internazionale), candidature centralisée via le portail studyinitaly.esteri.it, valable dans les universités publiques et établissements AFAM italiens.",
status: "Ouverte",
isActive: true,
levels: ["Licence", "Master", "Doctorat"],
officialWebsite: "https://studyinitaly.esteri.it/ListaBandi",
generalCriteria: "Cycle 2026-2027 : candidature en ligne close le 26 mars 2026 à 14h (heure de Rome) — prochaine fenêtre estimée février-mars 2027. Liste des pays éligibles publiée sur le portail, à vérifier avant candidature. Montant net et frais restants variables selon l'université d'accueil choisie."
}
};

// -------- Universités créées (4) --------
const UNIVERSITIES = [
{
id: "sorbonne-universite-paris",
data: {
name: "Sorbonne Université",
city: "Paris",
country: "France",
image: "paris.jpg",
flag: "fr.svg",
ranking: "Grande université de recherche pluridisciplinaire, héritière historique de la Sorbonne",
description: "Candidatures Eiffel ouvertes en Master (12-24 mois) et Doctorat (12-18 mois en cotutelle, 36 mois en première inscription), sur 7 domaines nommés : biologie-santé, transition écologique, mathématiques/numérique, ingénierie, histoire/langue/civilisation françaises, droit/sciences politiques, économie-gestion.",
officialWebsite: "https://www.sorbonne-universite.fr",
applicationPortalUrl: "https://www.sorbonne-universite.fr/en/news/france-excellence-eiffel-scholarship-programme-2026/2027",
fields: []
}
},
{
id: "princess-nourah-university-riyad",
data: {
name: "Princess Nourah bint Abdulrahman University",
city: "Riyad",
country: "Arabie Saoudite",
image: "riyadh.jpg",
flag: "sa.svg",
ranking: "Une des plus grandes universités féminines au monde",
description: "Université publique de Riyad, l'une des 27 universités saoudiennes rattachées au portail national studyinsaudi.sa. Enseignement en arabe, année préparatoire obligatoire pour les non-arabophones.",
officialWebsite: "https://www.pnu.edu.sa",
applicationPortalUrl: "https://studyinsaudi.sa/en",
fields: []
}
},
{
id: "politehnica-bucuresti-bucarest",
data: {
name: "Universitatea Națională de Știință și Tehnologie Politehnica din București (UNSTPB)",
city: "Bucarest",
country: "Roumanie",
image: "bucharest.jpg",
flag: "ro.svg",
ranking: "Plus grande école d'ingénieurs publique de Roumanie",
description: "Anciennement Universitatea Politehnica din București — a pris son nom actuel après une fusion universitaire récente (upb.ro). Grande université technique publique de Bucarest, nombreux programmes ouverts aux étudiants internationaux.",
officialWebsite: "https://upb.ro/en/",
applicationPortalUrl: "https://scholarships.studyinromania.gov.ro",
fields: []
}
},
{
id: "university-of-zurich-zurich",
data: {
name: "University of Zurich (UZH)",
city: "Zurich",
country: "Suisse",
image: "zurich.jpg",
flag: "ch.svg",
ranking: "Plus grande université de Suisse par les effectifs",
description: "Université cantonale généraliste (à distinguer d'une école polytechnique fédérale comme ETH Zurich, déjà partenaire du catalogue) — explicitement éligible aux Swiss Government Excellence Scholarships au même titre que toute université cantonale suisse.",
officialWebsite: "https://www.uzh.ch",
applicationPortalUrl: "https://www.sbfi.admin.ch/en/swiss-government-excellence-scholarships",
fields: []
}
}
];

// -------- Programmes (7) — dépendent des ids de bourse résolus (les
// 5) et des ids d'université résolus pour Sapienza/Bologne/Sciences Po
// (les 3 réutilisées) ; construits dynamiquement à l'étape 1. --------
function buildPrograms(scholarshipIds, universityIds) {
return [
{
id: `${universityIds.sciencespo}__${scholarshipIds.eiffel}`,
data: {
universityId: universityIds.sciencespo,
scholarshipId: scholarshipIds.eiffel,
level: "Master",
deadline: "Fin octobre / novembre selon le cycle (calendrier 2026-2027 clos le 29/10/2025) — vérifier le calendrier à venir sur sciencespo.fr",
applicationUrl: "https://www.sciencespo.fr/students/en/fees-funding/bursaries-financial-aid/eiffel-scholarship/",
language: "Français / Anglais selon le programme",
duration: "12 à 24 mois",
coverage: "1 200 €/mois (tarif janvier 2026) + transport + assurance + logement — scolarité non couverte",
description: "Nombre de nominations limité par Sciences Po. Réservé aux non-Français de moins de 25 ans, jamais inscrits à Sciences Po, sans financement français antérieur pour ce diplôme ; Doctorat et Masters d'un an exclus.",
status: "Ouverte",
isActive: true
}
},
{
id: `sorbonne-universite-paris__${scholarshipIds.eiffel}`,
data: {
universityId: "sorbonne-universite-paris",
scholarshipId: scholarshipIds.eiffel,
level: "Master / Doctorat",
deadline: "24 novembre 2025 (Doctorat) / 28 novembre 2025 (Master) pour le cycle 2026-2027 — vérifier le calendrier 2027-2028 sur sorbonne-universite.fr",
applicationUrl: "https://www.sorbonne-universite.fr/en/news/france-excellence-eiffel-scholarship-programme-2026/2027",
language: "Français / Anglais selon le domaine",
duration: "Master : 12-24 mois — Doctorat : 12-18 mois (cotutelle) ou 36 mois (première inscription)",
coverage: "1 200 €/mois (Master) ou 2 100 €/mois (Doctorat) + transport + assurance + logement — scolarité non couverte",
description: "7 domaines couverts : biologie-santé, transition écologique, mathématiques/numérique, ingénierie, histoire/langue/civilisation françaises, droit/sciences politiques, économie-gestion. Moyenne minimale de 15/20 sur les 3 dernières années académiques exigée.",
status: "Ouverte",
isActive: true
}
},
{
id: `${universityIds.sapienza}__${scholarshipIds.italy}`,
data: {
universityId: universityIds.sapienza,
scholarshipId: scholarshipIds.italy,
level: "Licence / Master / Doctorat",
deadline: "26 mars 2026, 14h (cycle 2026-2027) — prochaine fenêtre estimée février-mars 2027",
applicationUrl: "https://studyinitaly.esteri.it/ListaBandi",
language: "Italien (certains cursus en anglais)",
duration: "Variable selon le niveau et le cursus",
coverage: "Bourse MAECI nationale — voir le champ funding de la bourse",
description: "Sapienza est éligible au bando MAECI national, en plus de sa propre bourse doctorale interne (Sapienza PhD Scholarship, déjà au catalogue) — deux voies de financement distinctes vers le même établissement.",
status: "Ouverte",
isActive: true
}
},
{
id: `${universityIds.bologna}__${scholarshipIds.italy}`,
data: {
universityId: universityIds.bologna,
scholarshipId: scholarshipIds.italy,
level: "Licence / Master / Doctorat",
deadline: "26 mars 2026, 14h (cycle 2026-2027) — prochaine fenêtre estimée février-mars 2027",
applicationUrl: "https://studyinitaly.esteri.it/ListaBandi",
language: "Italien (certains cursus en anglais)",
duration: "Variable selon le niveau et le cursus",
coverage: "Bourse MAECI nationale — voir le champ funding de la bourse",
description: "Università di Bologna, doyenne des universités du monde occidental (fondée en 1088), également éligible au bando MAECI en plus de sa propre PhD Scholarship interne déjà au catalogue.",
status: "Ouverte",
isActive: true
}
},
{
id: `princess-nourah-university-riyad__${scholarshipIds.saudi}`,
data: {
universityId: "princess-nourah-university-riyad",
scholarshipId: scholarshipIds.saudi,
level: "Licence / Master / Doctorat",
deadline: "Fermée, réouverture annuelle non datée",
applicationUrl: "https://studyinsaudi.sa/en",
language: "Arabe (année préparatoire obligatoire pour non-arabophones)",
duration: "Variable selon le niveau et la filière",
coverage: "Scolarité gratuite + logement + allocation mensuelle + billet d'avion annuel + couverture santé",
description: "L'une des plus grandes universités féminines au monde ; université publique de Riyad rattachée aux 27 établissements du portail national studyinsaudi.sa.",
status: "Fermée",
isActive: false
}
},
{
id: `politehnica-bucuresti-bucarest__${scholarshipIds.romania}`,
data: {
universityId: "politehnica-bucuresti-bucarest",
scholarshipId: scholarshipIds.romania,
level: "Licence / Master / Doctorat",
deadline: "Cycle 2025-2026 clos le 31 mars 2026 — prochaine fenêtre estimée février-mars 2027",
applicationUrl: "https://scholarships.studyinromania.gov.ro",
language: "Roumain / Anglais (nombreux programmes anglophones pour étudiants internationaux)",
duration: "Variable selon le niveau",
coverage: "Scolarité gratuite + année de roumain si besoin + allocation mensuelle (montant à confirmer)",
description: "Grande école d'ingénieurs publique de Bucarest ; établissement d'accueil désigné par le Ministère roumain des Affaires étrangères, qui ne décerne pas elle-même la bourse. Médecine/Dentaire/Pharmacie exclues du programme (non concerné, établissement d'ingénierie).",
status: "Fermée",
isActive: false
}
},
{
id: `university-of-zurich-zurich__${scholarshipIds.swiss}`,
data: {
universityId: "university-of-zurich-zurich",
scholarshipId: scholarshipIds.swiss,
level: "Doctorat / post-doctorat (recherche) — Master en Arts (pays limités)",
deadline: "Candidatures ouvertes à partir du 20 août 2026 — dates précises par pays d'origine publiées à cette date sur sbfi.admin.ch (à vérifier)",
applicationUrl: "https://www.sbfi.admin.ch/en/swiss-government-excellence-scholarships",
language: "Anglais / Allemand selon le programme",
duration: "Généralement 1 an, renouvelable une fois",
coverage: "2 450 CHF/mois (tarif 2027-2028) + frais annexes selon profil",
description: "Éligible au même titre que toute université cantonale suisse ou école polytechnique fédérale (ETHZ/EPFL) — University of Zurich est la plus grande université cantonale du pays. Limite d'âge 35 ans ; résultats annoncés fin mai.",
status: "Ouverte",
isActive: true
}
}
];
}

function log(el, message, cls = "") {
el.classList.add("is-visible");
const line = document.createElement("div");
if (cls) line.className = cls;
line.textContent = message;
el.appendChild(line);
el.scrollTop = el.scrollHeight;
}

// ==========================================================
// Étape 1 — analyse
// ==========================================================

let lastPlan = null;

const analyzeBtn = document.getElementById("analyzeBtn");
const analyzeLog = document.getElementById("analyzeLog");
const writeBtn = document.getElementById("writeBtn");
const writeLog = document.getElementById("writeLog");
const verifyBtn = document.getElementById("verifyBtn");
const verifyLog = document.getElementById("verifyLog");

analyzeBtn.addEventListener("click", async () => {

analyzeBtn.disabled = true;
analyzeLog.innerHTML = "";

try {

log(analyzeLog, "Recherche des 5 bourses cibles par titre...");

const scholarshipsSnap = await getDocs(collection(db, "scholarships"));
const scholarships = scholarshipsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

const scholarshipIds = {};
let lookupFailed = false;

for (const expected of EXPECTED_SCHOLARSHIPS) {

const matches = scholarships.filter((s) => expected.match(s.title));

if (matches.length === 0) {
log(analyzeLog, `ERREUR : aucune bourse trouvée pour "${expected.label}". Vérifier que le titre n'a pas changé en base.`, "err");
lookupFailed = true;
} else if (matches.length > 1) {
log(analyzeLog, `ERREUR : ${matches.length} bourses correspondent à "${expected.label}" — ambigu, résolution manuelle requise :`, "err");
matches.forEach((m) => log(analyzeLog, `  - ${m.id} ("${m.title}")`, "err"));
lookupFailed = true;
} else {
scholarshipIds[expected.key] = matches[0].id;
log(analyzeLog, `"${expected.label}" trouvée : id "${matches[0].id}", titre en base "${matches[0].title}".`, "ok");
}

}

log(analyzeLog, "Recherche des 3 universités déjà au catalogue (Sapienza, Bologne, Sciences Po) par nom...");

const universitiesSnap = await getDocs(collection(db, "universities"));
const existingUniversities = universitiesSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
const existingUniversityIds = new Set(existingUniversities.map((u) => u.id));

const universityIds = {};

for (const expected of EXPECTED_UNIVERSITIES) {

const matches = existingUniversities.filter((u) => expected.match(u));

if (matches.length === 0) {
log(analyzeLog, `ERREUR : aucune université trouvée pour "${expected.label}". Vérifier que le nom n'a pas changé en base.`, "err");
lookupFailed = true;
} else if (matches.length > 1) {
log(analyzeLog, `ERREUR : ${matches.length} universités correspondent à "${expected.label}" — ambigu, résolution manuelle requise :`, "err");
matches.forEach((m) => log(analyzeLog, `  - ${m.id} ("${m.name}", ${m.city})`, "err"));
lookupFailed = true;
} else {
universityIds[expected.key] = matches[0].id;
log(analyzeLog, `"${expected.label}" trouvée : id "${matches[0].id}" ("${matches[0].name}", ${matches[0].city}).`, "ok");
}

}

if (lookupFailed) {
log(analyzeLog, "Anomalie(s) détectée(s) lors de la recherche — corriger avant de passer à l'étape 2.", "err");
return;
}

const universityCollisions = UNIVERSITIES.filter((u) => existingUniversityIds.has(u.id));

if (universityCollisions.length) {
log(analyzeLog, `${universityCollisions.length} id(s) d'université (nouvelle) collisionnent déjà avec un document existant :`, "err");
universityCollisions.forEach((u) => log(analyzeLog, `  - ${u.id}`, "err"));
} else {
log(analyzeLog, `${UNIVERSITIES.length}/4 identifiants de nouvelle université libres.`, "ok");
}

const programs = buildPrograms(scholarshipIds, universityIds);

const programsSnap = await getDocs(collection(db, "programs"));
const existingProgramIds = new Set(programsSnap.docs.map((d) => d.id));

const programCollisions = programs.filter((p) => existingProgramIds.has(p.id));

if (programCollisions.length) {
log(analyzeLog, `${programCollisions.length} id(s) de programme collisionnent déjà avec un document existant :`, "err");
programCollisions.forEach((p) => log(analyzeLog, `  - ${p.id}`, "err"));
} else {
log(analyzeLog, `${programs.length}/7 identifiants de programme libres.`, "ok");
}

const hasBlockingIssue = universityCollisions.length || programCollisions.length;

if (hasBlockingIssue) {
log(analyzeLog, "Anomalie(s) détectée(s) — corriger avant de passer à l'étape 2.", "err");
return;
}

lastPlan = { scholarshipIds, universityIds, programs };

log(analyzeLog, "Analyse terminée, aucune anomalie. Vérifiez le détail ci-dessus avant de passer à l'étape 2.", "ok");

writeBtn.disabled = false;

} catch (error) {

console.error(error);
log(analyzeLog, `Erreur : ${error.message}`, "err");

} finally {

analyzeBtn.disabled = false;

}

});

// ==========================================================
// Étape 2 — écriture
// ==========================================================

writeBtn.addEventListener("click", async () => {

if (!lastPlan) return;

const confirmed = confirm(
`Créer ${UNIVERSITIES.length} université(s) et ${lastPlan.programs.length} programme(s), et réécrire entièrement 2 bourses (Eiffel, Italian Government Scholarship) ? Cette action écrit en base de production.`
);

if (!confirmed) return;

writeBtn.disabled = true;
writeLog.innerHTML = "";

try {

log(writeLog, "Écriture des universités...");

for (const u of UNIVERSITIES) {
await setDoc(doc(db, "universities", u.id), u.data);
log(writeLog, `  - ${u.data.name} (${u.id}) écrit.`);
}

log(writeLog, `${UNIVERSITIES.length} université(s) écrite(s).`, "ok");

log(writeLog, "Réécriture complète des 2 bourses (Eiffel, Italian Government Scholarship)...");

for (const key of Object.keys(SCHOLARSHIP_UPDATE_DATA)) {
const id = lastPlan.scholarshipIds[key];
const data = SCHOLARSHIP_UPDATE_DATA[key];
await setDoc(doc(db, "scholarships", id), data);
log(writeLog, `  - ${data.title} (${id}) réécrite.`);
}

log(writeLog, "2 bourse(s) réécrite(s) en entier, 0 créée, 3 non touchées (Saoudite/Roumanie/Suisse).", "ok");

log(writeLog, "Écriture des programmes...");

for (const p of lastPlan.programs) {
await setDoc(doc(db, "programs", p.id), p.data);
log(writeLog, `  - ${p.id} écrit.`);
}

log(writeLog, `${lastPlan.programs.length} programme(s) écrit(s).`, "ok");
log(writeLog, "Étape 2 terminée. Lancez l'étape 3 pour vérifier automatiquement.", "ok");

verifyBtn.disabled = false;

} catch (error) {

console.error(error);
log(writeLog, `Erreur : ${error.message}`, "err");

} finally {

writeBtn.disabled = false;

}

});

// ==========================================================
// Étape 3 — vérification automatique. Relit chaque document créé ou
// modifié et compare CHAQUE champ attendu (comparaison de valeur
// exacte), pas un simple "existe".
// ==========================================================

verifyBtn.addEventListener("click", async () => {

if (!lastPlan) return;

verifyBtn.disabled = true;
verifyLog.innerHTML = "";
log(verifyLog, "Relecture de Firestore après écriture...");

try {

let ok = 0;
let mismatch = 0;

for (const u of UNIVERSITIES) {
const snap = await getDoc(doc(db, "universities", u.id));
const current = snap.exists() ? snap.data() : null;
const fieldsMatch = current && Object.keys(u.data).every((key) => JSON.stringify(current[key]) === JSON.stringify(u.data[key]));
if (fieldsMatch) {
ok++;
} else {
mismatch++;
log(verifyLog, `MISMATCH université ${u.id} : document ${current ? "trouvé mais différent" : "introuvable"}.`, "err");
}
}

for (const key of Object.keys(SCHOLARSHIP_UPDATE_DATA)) {
const id = lastPlan.scholarshipIds[key];
const data = SCHOLARSHIP_UPDATE_DATA[key];
const snap = await getDoc(doc(db, "scholarships", id));
const current = snap.exists() ? snap.data() : null;
const fieldsMatch = current && Object.keys(data).every((k) => JSON.stringify(current[k]) === JSON.stringify(data[k]));
if (fieldsMatch) {
ok++;
} else {
mismatch++;
log(verifyLog, `MISMATCH bourse ${id} (${data.title}) : document ${current ? "trouvé mais différent" : "introuvable"}.`, "err");
}
}

for (const p of lastPlan.programs) {
const snap = await getDoc(doc(db, "programs", p.id));
const current = snap.exists() ? snap.data() : null;
const fieldsMatch = current && Object.keys(p.data).every((key) => JSON.stringify(current[key]) === JSON.stringify(p.data[key]));
if (fieldsMatch) {
ok++;
} else {
mismatch++;
log(verifyLog, `MISMATCH programme ${p.id} : document ${current ? "trouvé mais différent" : "introuvable"}.`, "err");
}
}

const total = UNIVERSITIES.length + Object.keys(SCHOLARSHIP_UPDATE_DATA).length + lastPlan.programs.length;

log(verifyLog, `${ok}/${total} document(s) confirmé(s) en base, champ par champ.`, mismatch === 0 ? "ok" : "err");

if (mismatch === 0) {
log(verifyLog, "ÉCRITURE EN BASE CONFIRMÉE — lot 7 terminé, 0 écart. Les 5 bourses ciblées ont désormais 2 universités chacune.", "ok");
} else {
log(verifyLog, `ÉCHEC — ${mismatch} écart(s) détecté(s), voir le détail ci-dessus.`, "err");
}

} catch (error) {

console.error(error);
log(verifyLog, `Erreur : ${error.message}`, "err");

} finally {

verifyBtn.disabled = false;

}

});
