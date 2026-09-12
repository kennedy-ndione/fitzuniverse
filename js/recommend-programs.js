/**
* ============================================================
* Fitz — recommandation d'universités pour les créneaux de
* candidature (applications.js) et le diagnostic gratuit (results.js)
* ============================================================
*
* N'existait nulle part avant : la seule évaluation de compatibilité
* réelle du projet (details.js:computeCompatibility) note UNE université
* à la fois, à partir des réponses du diagnostic gratuit en
* sessionStorage — jamais du profil Firestore persistant, et jamais en
* lot sur tout le catalogue. Ce fichier comble ce manque avec la même
* logique de jointure "programs" que scholarships.js/
* universities-page.js/details.js (jamais une deuxième façon de
* résoudre bourse↔université).
*
* Fonction pure : ne fait aucun appel Firebase, ne connaît aucune
* formule/quota — les appelants lui fournissent les données déjà
* chargées (profile, programs, universities, scholarships) et appliquent
* eux-mêmes le quota de la formule active.
*
* Refonte 2026-08-29 (avec la refonte du questionnaire) :
* 1. CYCLE VISÉ plutôt que dernier diplôme. Le bonus de niveau
*    comparait program.level au niveau ACTUEL de l'étudiant — un
*    titulaire de licence recevait donc le bonus sur les programmes de
*    licence, exactement le cycle qu'il vient de terminer, jamais sur
*    les masters qu'il vise réellement. profile.targetLevel (résolu par
*    resolveTargetLevel(), eligibility-ai.js) prime désormais ;
*    lastDegree/currentDegree restent le repli pour les appelants de
*    l'espace connecté (applications.js, dashboard.js) dont le profil
*    Firestore n'a pas encore ce champ.
* 2. explainMatch() : chaque recommandation sait désormais expliquer
*    POURQUOI ce programme précis correspond à ce profil précis, à
*    partir des vraies données du catalogue (niveau, langue
*    d'enseignement, statut, pays, financement) — avant, results.js
*    affichait les mêmes raisons génériques sous les 6 cartes.
*    recommendPrograms() attache ces raisons à chaque pick (clé
*    "reasons", ignorée sans risque par les appelants existants).
* ============================================================
*/

// Le chemin d'import est relatif à CE fichier (js/) — eligibility-
// countries.js vit dans le même dossier.
import { estEligible } from "./eligibility-countries.js";
import { auPays } from "./pays-grammaire.js";
import { computeAge, respecteLimiteAge, respecteLimiteAgeTranche } from "./age-limits.js";
import { familleDeDomaine } from "./eligibility-pistes.js";
import { analyserEcheance, joursAvant } from "./echeance.js";

// "bachelier" ajouté (audit 2026-08-22) : un lycéen qui vient d'obtenir
// son bac vise un programme de 1er cycle, le même "Licence" que
// program.level dans le catalogue. "bachelor" couvre aussi le libellé
// "Licence (Bachelor)" de la nouvelle question targetLevel
// (questions.js, refonte 2026-08-29).
const LEVEL_ALIASES = {
"licence": "Licence", "bachelor": "Licence", "bachelier": "Licence",
"master": "Master",
"doctorat": "Doctorat", "phd": "Doctorat", "doctorate": "Doctorat"
};

/**
* L'IDENTIFIANT D'UN DOCUMENT, QUELLE QUE SOIT LA FORME REÇUE
* -----------------------------------------------------------
* Les appelants ne passent pas tous les mêmes objets. results.js
* transmet les documents du catalogue TELS QUELS (ils portent `id`) ;
* dashboard.js et applications.js les renomment d'abord
* (`{ firestoreId: id, ...reste }`) et n'ont donc plus d'`id` du tout.
*
* CE QUE CETTE DIVERGENCE A COÛTÉ (trouvé le 2026-09-06) : la clé de
* dédoublonnage par bourse valait `c.scholarship.id`, donc `undefined`
* pour tout appelant de l'espace connecté. `boursesVues` contenait
* alors une seule entrée — `undefined` — et TOUT candidat suivant était
* écarté comme un doublon. Le hub ne retenait qu'UNE opportunité sur
* les 101 qui passaient les filtres. Rien ne plantait : le chiffre
* était simplement faux, et personne ne pouvait le deviner.
*
* On lit donc les deux formes ici, une fois pour toutes, plutôt que
* d'exiger des appelants une convention qu'un seul d'entre eux
* respectait.
*/
function idDe(doc) {
return (doc && (doc.id || doc.firestoreId)) || "";
}

// Le pays de l'université figure-t-il dans les pays EXCLUS par
// l'étudiant ? Comparaison insensible à la casse et aux accents (les
// libellés de profile.html sont ceux du catalogue, mais on ne parie pas
// dessus). Rien d'exclu, ou pays inconnu → false.
const normPays = (s) => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").trim().toLowerCase();

export function paysExclu(university, profile) {
const exclus = profile && Array.isArray(profile.excludedCountries) ? profile.excludedCountries : [];
if (!exclus.length || !university || !university.country) return false;
const pays = normPays(university.country);
return exclus.some((e) => normPays(e) === pays);
}

function normalizeLevel(value) {
const text = String(value || "").toLowerCase();
for (const key in LEVEL_ALIASES) {
if (text.includes(key)) return LEVEL_ALIASES[key];
}
return "";
}

/**
* Niveau que l'étudiant VISE.
*
* L'ORDRE EST LA FONCTION — chaque cran est une source de moins en
* moins sûre du PROJET de l'étudiant :
*
*   1. `targetLevel`    — le diagnostic gratuit le DEMANDE
*                         (resolveTargetLevel, eligibility-ai.js).
*                         Réponse explicite : rien ne la dépasse.
*   2. `desiredDegree`  — « Diplôme recherché » de profile.html, le
*                         même projet dit par un étudiant CONNECTÉ.
*   3. `lastDegree` /
*      `currentDegree`  — le diplôme DÉJÀ OBTENU. Un repli, jamais un
*                         projet : on suppose alors qu'il vise le
*                         cycle qu'il a, faute de mieux.
*
* POURQUOI `desiredDegree` A ÉTÉ AJOUTÉ (2026-09-06)
* --------------------------------------------------
* Le bug conceptuel corrigé côté public le 2026-08-29 — récompenser le
* diplôme obtenu au lieu du diplôme visé — était resté vivant côté
* CONNECTÉ, c'est-à-dire côté PAYANT. `targetLevel` n'existe que sur le
* profil du diagnostic ; le profil de l'espace porte `desiredDegree`
* (profile.js l'écrit, profile.html le propose : Licence / Master /
* Doctorat) et RIEN ne le lisait. Un titulaire de licence qui déclarait
* viser un master se voyait donc bonifier les licences.
*
* `desiredDegree` passe APRÈS `targetLevel` (une réponse de diagnostic
* reste prioritaire, elle est plus récente et plus contextualisée) et
* AVANT les diplômes obtenus (un projet déclaré bat toujours une
* déduction).
*
* Une seule définition, partagée par scoreProgram(), explainMatch() et
* retenirOpportunites(), pour que le score, son explication et le
* filtre ne puissent jamais diverger.
*/
function studentTargetLevel(profile) {
return normalizeLevel(profile.targetLevel || profile.desiredDegree || profile.lastDegree || profile.currentDegree);
}

// Dérive un signal financement simple à partir des deux formes de profil
// possibles : "fundingGoal" (chaîne libre issue de la question "goal" du
// diagnostic gratuit) ou "fundingWanted" (tableau de codes issu du
// profil connecté, profile.js/profile.html). scoreProgram() est partagée
// entre les deux contextes, donc les deux formes doivent être comprises
// sans erreur (audit 2026-08-22).
function fundingSignal(profile) {

const goal = String(profile.fundingGoal || "").toLowerCase();
const wanted = Array.isArray(profile.fundingWanted) ? profile.fundingWanted : [];

return {
wantsFull: goal.includes("complète") || wanted.includes("full_scholarship"),
wantsPartial: goal.includes("partielle") || wanted.includes("partial_scholarship")
};

}

// Correspondance financement bourse↔souhait — extraite de scoreProgram()
// pour être partagée avec explainMatch() (même règle, jamais deux
// implémentations). scholarship.funding est un texte libre saisi par un
// administrateur (admin/scholarships.js) — correspondance volontairement
// prudente par mots-clés plutôt qu'un pourcentage inventé.
function fundingMatches(scholarship, profile) {

if (!scholarship || !scholarship.funding) return { full: false, partial: false };

const { wantsFull, wantsPartial } = fundingSignal(profile);
const funding = String(scholarship.funding).toLowerCase();

return {
full: wantsFull && (funding.includes("100") || funding.includes("intégral") || funding.includes("complèt")),
partial: wantsPartial && (funding.includes("partiel") || funding.includes("variable"))
};

}

// Langues que le profil maîtrise suffisamment (results.js n'y met que
// les niveaux au-dessus de "Débutant") face à la langue d'enseignement
// du programme — extraite pour la même raison que fundingMatches().
function languageMatch(program, profile) {

const languages = Array.isArray(profile.languages) ? profile.languages : [];

if (!program.language || !languages.length) return "";

const match = languages.find((lang) => String(program.language).toLowerCase().includes(String(lang).toLowerCase()));

return match || "";

}

// Limite d'âge de la bourse face à l'âge de l'étudiant — deux sources
// selon le contexte, comme fundingSignal() gère déjà deux formes de
// profil : `birthDate` (profil connecté, profile.js) donne un âge
// exact ; `ageBracket` (diagnostic gratuit, questions.js) ne donne
// qu'une tranche, tranchée seulement quand l'intervalle entier tombe
// d'un côté de la limite. Le niveau comparé est le niveau VISÉ
// (studentTargetLevel), pas celui du programme. Renvoie true | false |
// null — null (limite inconnue, âge inconnu, tranche à cheval) ne doit
// JAMAIS être traité comme false : même règle des trois valeurs que
// estEligible, verrouillée par test (test/age-limits.test.mjs).
function ageMatch(scholarship, profile) {

if (!scholarship || !scholarship.ageMax) return null;

const niveau = studentTargetLevel(profile);

const age = computeAge(profile.birthDate);
if (age !== null) return respecteLimiteAge(scholarship.ageMax, age, niveau);

if (profile.ageBracket) return respecteLimiteAgeTranche(scholarship.ageMax, profile.ageBracket, niveau);

return null;

}

/**
* Le domaine visé correspond-il aux domaines de l'université ?
*
* CORRECTIF DU 2026-09-05 — mesuré sur le catalogue réel : 79 des 155
* universités portent un champ `fields`, et il n'existe que DIX valeurs
* dans tout le catalogue (Commerce, Sciences sociales, Ingénierie,
* Informatique, Architecture, Sciences, Lettres, Droit, Médecine,
* Agriculture). Le commentaire précédent, qui affirmait que ce champ
* « reste vide sur tout le catalogue », était périmé.
*
* L'ancienne comparaison de texte brut ne pouvait pas fonctionner : la
* question du diagnostic propose 35 spécialités fines et
* « Intelligence artificielle » ne contient pas « Informatique ». La
* réponse est donc TRADUITE vers le vocabulaire du catalogue par
* familleDeDomaine() avant d'être comparée — la question reste riche,
* c'est son résultat qui devient exploitable.
*
* Renvoie true | false | null : null quand l'université ne déclare
* aucun domaine (la moitié du catalogue). Comme partout ailleurs, null
* ne vaut JAMAIS false.
*/
export function domaineCorrespond(university, profile) {

const champs = Array.isArray(university.fields) ? university.fields.filter(Boolean) : [];

if (!champs.length) return null;

const famille = familleDeDomaine(profile.desiredField);

if (!famille) return null;

return champs.some((f) => String(f).trim().toLowerCase() === famille.toLowerCase());

}

/**
* État de l'échéance d'un programme, du point de vue « puis-je encore
* candidater ? ».
*
* MESURE DU 2026-09-05 : 167 programmes portent `status:"Ouverte"`
* alors que 39 seulement ont une date encore future. Se fier au statut
* seul revient donc à proposer des trains déjà partis — la faute qui
* décrédibilise un diagnostic en une ligne.
*
* @returns {{ouverte: boolean|null, jours: number|null}} ouverte vaut
* null quand aucune date exploitable n'existe : inconnu, jamais fermé.
*/
export function etatEcheance(program, aujourdhui = new Date()) {

if (String(program.status || "").toLowerCase().includes("fermé")) {
return { ouverte: false, jours: null };
}

if (!program.deadline) return { ouverte: null, jours: null };

// Les échéances du catalogue sont écrites EN FRANÇAIS (« 15 janvier
// 2027 », « 31 octobre 2026 (rentrée de printemps) »), pas en ISO :
// c'est analyserEcheance() qui sait les lire, et elle reconnaît aussi
// deux états qu'une simple date ne dit pas.
const echeance = analyserEcheance(String(program.deadline));

// « Candidatures closes » : fermé, sans qu'aucune date ne soit
// nécessaire.
if (echeance.etat === "close") return { ouverte: false, jours: null };

// Admission au fil de l'eau : ouvert en permanence — le refuser
// faute de date serait exactement l'erreur inverse de celle qu'on
// corrige ici.
if (echeance.etat === "continue") return { ouverte: true, jours: null };

const jours = joursAvant(echeance, aujourdhui);

if (jours === null) return { ouverte: null, jours: null };

return { ouverte: jours >= 0, jours };

}

// Score de compatibilité programme↔profil — mêmes critères que
// details.js:computeCompatibility (niveau, langue, pays), adaptés pour
// lire indifféremment le profil Firestore persistant (profile.js) ou le
// profil dérivé du diagnostic gratuit (results.js:
// buildProfileFromResponses).
function scoreProgram(program, university, scholarship, profile) {

// Une bourse fermée à la nationalité de l'étudiant ne peut pas être
// recommandée, quel que soit son score sur les autres critères.
// estEligible renvoie null quand on ne sait pas — on ne pénalise alors pas.
// Score sentinelle négatif, écarté par recommendPrograms() AVANT le tri :
// retirer des points ne suffirait pas, une bourse fermée ne doit jamais
// remonter, même faute de mieux. Rien dans explainMatch() : c'est un
// FILTRE, pas un bonus (voir l'en-tête du fichier).
if (scholarship && estEligible(scholarship.eligibility, profile.nationality) === false) {
return -1;
}

// Même mécanique pour la limite d'âge (champ ageMax, 2026-08-30) :
// filtre DUR, score sentinelle écarté avant le tri — un plafond d'âge
// dépassé est aussi disqualifiant qu'une exclusion de nationalité, la
// bourse ne doit pas remonter même faute de mieux. Rien dans
// explainMatch() : c'est un FILTRE, pas un bonus. Uniquement sur
// false — jamais sur null (limite ou âge inconnus, tranche à cheval).
if (ageMatch(scholarship, profile) === false) {
return -1;
}

// Lot FITZ-CHOISIT (2026-09-11) : un pays que l'étudiant a EXCLU
// (profile.html, « Pays exclus » → excludedCountries) est un filtre
// DUR, même mécanique : le champ était collecté et jamais lu. Vaut pour
// le remplissage des créneaux, le remplacement et le sélecteur du
// diagnostic — jamais un pays exclu, faute de mieux ou non.
if (paysExclu(university, profile)) {
return -1;
}

let score = 0;

// Niveau VISÉ (refonte 2026-08-29, voir l'en-tête) : le bonus le plus
// élevé des critères va au programme du cycle que l'étudiant veut
// intégrer, plus jamais à celui qu'il vient de terminer.
const targetLevel = studentTargetLevel(profile);
if (targetLevel && program.level && targetLevel === program.level) score += 3;

const preferredCountries = Array.isArray(profile.preferredCountries) ? profile.preferredCountries : [];
if (university.country && preferredCountries.includes(university.country)) score += 2;

if (languageMatch(program, profile)) score += 1;

if (String(program.status || "").toLowerCase().includes("ouvert")) score += 1;

// LE DOMAINE PÈSE AUTANT QUE LE CYCLE (3 points, 2026-09-05).
//
// Ce bonus valait 1 point depuis son câblage, à une époque où AUCUNE
// université du catalogue ne renseignait `fields` : il ne s'appliquait
// à personne. Le lot 42 a renseigné 48 des 76 universités qui n'en
// avaient pas, et la mesure a montré que remplir la donnée ne suffisait
// pas — à 1 point, deux étudiants de disciplines différentes recevaient
// toujours NEUF recommandations identiques sur douze, parce qu'un point
// ne déplace rien face au seuil de sélection (meilleur − 3).
//
// Mesuré sur les 360 profils de grilleDeProfils(), données du lot 42 :
//   poids 1 → 9 pistes identiques sur 12 entre six domaines ; 41 bourses
//             distinctes proposées par l'ensemble des profils.
//   poids 2 → 8 sur 12 ; 41 bourses distinctes.
//   poids 3 → 3 sur 12 ; 48 bourses distinctes.
//   poids 5 → 0 sur 12 — écarté : un étudiant ne verrait plus les
//             grandes bourses ouvertes à toutes les disciplines.
//
// À 3, le domaine compte exactement autant que le cycle visé : on ne
// propose pas une école d'ingénieurs à un futur juriste, de la même
// façon qu'on ne propose pas un doctorat à un bachelier. Les bourses
// généralistes (Chevening, Mastercard, CSC, Stipendium) apparaissent
// PLUS souvent qu'avant, pas moins — elles sont rattachées à des
// universités pluridisciplinaires, qui correspondent à tous.
//
// CONTREPARTIE ASSUMÉE, à relire quand les 28 universités restantes
// seront renseignées : les disciplines rares du catalogue reçoivent
// moins de pistes (agriculture 11,6 → 8,4 ; architecture 10,9 → 8,8 ;
// plancher individuel 9 → 6). Une partie de cette baisse n'est pas la
// réalité du monde mais un trou de notre catalogue — seules 7 des 48
// universités renseignées déclarent l'agriculture. La remesurer après
// avoir complété les 28 (scripts/data/domaines-a-completer-2026-09-05.md).
//
// domaineCorrespond() rend null quand l'université ne déclare aucun
// domaine : un trou de données ne vaut donc pas non-correspondance, il
// ne rapporte simplement rien — jamais de pénalité pour une fiche que
// nous n'avons pas encore lue.
if (domaineCorrespond(university, profile)) score += 3;

const funding = fundingMatches(scholarship, profile);
if (funding.full) score += 1;
if (funding.partial) score += 1;

return score;

}

/**
* Raisons de compatibilité propres à UN programme — le miroir exact des
* bonus de scoreProgram(), formulé en phrases : chaque raison affichée
* correspond à un point réellement compté, jamais l'inverse. results.js
* les affiche sous chaque carte d'opportunité (avant : les mêmes raisons
* génériques du profil, dupliquées sous les 6 cartes — refonte
* 2026-08-29).
*
* Exportée aussi pour details.js/applications.js si besoin — même
* signature que scoreProgram().
*
* @returns {Array<string>} raisons, de la plus forte à la plus faible ;
* peut être vide si rien ne correspond (l'appelant garde son repli).
*/
export function explainMatch(program, university, scholarship, profile) {

const reasons = [];

const targetLevel = studentTargetLevel(profile);
if (targetLevel && program.level && targetLevel === program.level) {
reasons.push(`Programme de niveau ${program.level} — le cycle que vous visez`);
}

const preferredCountries = Array.isArray(profile.preferredCountries) ? profile.preferredCountries : [];
if (university.country && preferredCountries.includes(university.country)) {
// « Situé au Canada », « en France », « aux États-Unis » : la
// préposition vient de js/pays-grammaire.js, jamais d'un « en » unique.
reasons.push(`Situé ${auPays(university.country)}, votre destination souhaitée`);
}

const lang = languageMatch(program, profile);
if (lang) {
reasons.push(`Enseigné en ${String(program.language).toLowerCase().includes("angl") ? "anglais" : String(program.language).toLowerCase().includes("fran") ? "français" : program.language} — une langue que vous maîtrisez`);
}

if (domaineCorrespond(university, profile) === true) {
reasons.push(`Établissement actif dans votre domaine (${familleDeDomaine(profile.desiredField)})`);
}

// L'échéance RÉELLE prime sur le statut affiché : un programme marqué
// « Ouverte » dont la date est passée ne doit pas être présenté comme
// ouvert (mesure du 2026-09-05 : 167 « Ouverte » pour 39 dates encore
// futures).
const echeance = etatEcheance(program);

if (echeance.ouverte === true) {
reasons.push(echeance.jours !== null && echeance.jours <= 400
? `Candidatures ouvertes — il vous reste ${echeance.jours} jours`
: `Candidatures ouvertes (échéance : ${program.deadline})`);
} else if (echeance.ouverte === null && String(program.status || "").toLowerCase().includes("ouvert")) {
reasons.push("Candidatures annoncées ouvertes — la date exacte est à confirmer sur le portail");
}

const funding = fundingMatches(scholarship, profile);
if (funding.full) reasons.push("Financement complet — ce que vous recherchez");
if (funding.partial) reasons.push("Financement partiel disponible, en phase avec votre objectif");

return reasons;

}

/**
* @param {Object} profile - profil Firestore de l'étudiant (profile.js) ou profil dérivé du diagnostic (results.js)
* @param {Array} programs - documents "programs" ({firestoreId, universityId, scholarshipId, level, language, status, ...})
* @param {Map} universitiesById - Map(universityId -> document "universities")
* @param {Map} scholarshipsById - Map(scholarshipId -> document "scholarships")
* @param {Set} excludeUniversityIds - universités déjà occupées par un autre créneau, à ne jamais reproposer
* @param {number} count - nombre de recommandations à renvoyer
* @returns {Array<{universityId, score, universityName, scholarshipTitle, deadline, applicationUrl, universityWebsite, reasons}>}
*/
export function recommendPrograms({ profile, programs, universitiesById, scholarshipsById, excludeUniversityIds, count }) {

const exclude = excludeUniversityIds || new Set();

const scored = programs
.filter((p) => p.universityId && !exclude.has(p.universityId) && universitiesById.has(p.universityId))
.map((p) => {

const scholarship = p.scholarshipId ? scholarshipsById.get(p.scholarshipId) : null;

return {
program: p,
university: universitiesById.get(p.universityId),
score: scoreProgram(p, universitiesById.get(p.universityId), scholarship, profile || {})
};

})
// Écarte les scores sentinelles AVANT le tri : une bourse fermée à la
// nationalité (score -1) ne doit jamais être retenue, même quand il
// n'y a rien de mieux à proposer.
.filter((e) => e.score >= 0)
.sort((a, b) => b.score - a.score);

const picked = [];
const pickedUniversityIds = new Set();

for (const entry of scored) {

if (picked.length >= count) break;
if (pickedUniversityIds.has(entry.program.universityId)) continue;

pickedUniversityIds.add(entry.program.universityId);

const scholarship = entry.program.scholarshipId ? scholarshipsById.get(entry.program.scholarshipId) : null;

picked.push({
universityId: entry.program.universityId,
// LES DEUX CLÉS VERS LE CATALOGUE (ajoutées le 2026-09-06)
//
// Elles manquaient, et leur absence rendait SILENCIEUSEMENT inerte
// tout un pan de la passe 1 : applications.js écrivait
// `scholarshipId: pickedEntry.scholarshipId || null` — donc toujours
// null — et son sélecteur ne pouvait afficher l'état publié par la
// fiche, faute de savoir de quelle bourse il parlait. Rien ne
// plantait, tout se taisait.
//
// `programId` désigne LE programme réellement noté ici, ce qu'aucune
// heuristique côté appelant ne pouvait déduire sans risque quand une
// université porte plusieurs fiches d'une même bourse.
scholarshipId: idDe(scholarship),
programId: idDe(entry.program),
// Exposé pour countCompatibleOpportunities() (dashboard.js), qui a
// besoin de savoir combien d'entrées correspondent réellement au
// profil (score > 0) plutôt que de compter tout le catalogue — champ
// ignoré sans risque par les appelants existants (applications.js) qui
// ne lisent pas cette clé.
score: entry.score,
// Bug corrigé (audit du 2026-08-14) : lisait entry.university.university,
// qui n'a jamais existé sur le schéma relationnel ("universities" porte
// name, pas university — university était le nom du champ dans l'ancien
// schéma à plat, avant migrate.js). Le fallback masquait silencieusement
// le problème : universityName retombait toujours sur "Université
// partenaire", jamais sur le vrai nom. Même bug corrigé dans
// applications.js (uni.university -> uni.name, 2 occurrences).
universityName: entry.university.name || "Établissement",
scholarshipTitle: scholarship ? scholarship.title : "",
deadline: entry.program.deadline || null,
// Audit du 2026-08-28 : ces deux champs manquaient ici, donc
// applications.js écrivait toujours portalUrl:"" pour un créneau
// suggéré par Fitz, alors même que programs/universities portent
// déjà applicationUrl/officialWebsite — même distinction et même
// ordre de repli que details.js:301-308 (le lien de candidature
// précis du programme prime sur le portail générique de l'université).
applicationUrl: entry.program.applicationUrl || entry.university.applicationPortalUrl || "",
universityWebsite: entry.university.officialWebsite || "",
// Refonte 2026-08-29 : les raisons PROPRES à ce programme, dérivées
// des mêmes règles que le score (voir explainMatch). Clé nouvelle,
// ignorée sans risque par les appelants qui ne la lisent pas.
reasons: explainMatch(entry.program, entry.university, scholarship, profile || {})
});

}

return picked;

}

// ============================================================
// LA SÉLECTION DU DIAGNOSTIC GRATUIT — « ce que Fitz a retenu »
// ============================================================
//
// POURQUOI CETTE FONCTION EXISTE, À CÔTÉ DE recommendPrograms()
//
// recommendPrograms() sert les CRÉNEAUX de candidature de l'espace
// connecté : elle garde tout ce qui n'est pas exclu et classe par
// score. C'est exactement ce qu'il faut là-bas — on remplit des
// créneaux, on ne trie pas le monde.
//
// Sur la page de résultats, ce comportement produisait une phrase
// fausse : « votre profil correspond à 154 opportunités ». 154, parce
// que le score par défaut est 0, que le filtre gardait tout score
// `>= 0`, et que « compatible » voulait donc dire « pas explicitement
// exclue par la nationalité ou l'âge ». Sur 155 universités, le
// chiffre était mécanique — trois profils différents donnaient trois
// fois le même nombre.
//
// Ici, CORRESPONDRE a un sens, et chaque condition est un critère que
// les organismes appliquent vraiment :
//
//   1. la bourse n'exclut pas la nationalité      (filtre existant)
//   2. la limite d'âge n'est pas dépassée         (filtre existant)
//   3. le programme est du CYCLE VISÉ             — obligatoire
//   4. la langue d'enseignement est praticable    — trois valeurs
//   5. l'échéance n'est PAS passée                — trois valeurs
//
// Puis une règle de PERTINENCE plutôt qu'un plafond arbitraire : on ne
// garde que ce qui se tient à moins de `marge` points du meilleur.
// Mesuré sur le catalogue réel le 2026-09-05, cela donne 4 à 12
// opportunités selon le profil, réparties sur 3 à 10 pays — un chiffre
// qui VARIE parce qu'il est calculé, pas parce qu'il est tronqué.
//
// Enfin : une opportunité = UNE BOURSE. Sans cela, « Stipendium
// Hungaricum » apparaissait trois fois dans la même liste (trois
// universités hongroises) et douze opportunités en devenaient sept.
// ============================================================

/**
* La langue d'enseignement est-elle praticable par cet étudiant ?
* true | false | null — null quand on ne sait pas, et null n'exclut
* jamais.
*
* Cas particulier assumé : un étudiant débutant dans les deux langues
* renvoie null et non false. Plusieurs grands programmes (CSC,
* Türkiye Bursları…) incluent une année de langue préparatoire — lui
* rendre une page vide serait faux autant qu'inutile. C'est l'analyse
* qui lui dira que la langue est son premier chantier.
*/
export function langueCompatible(program, profile) {

const langues = Array.isArray(profile.languages) ? profile.languages.filter(Boolean) : [];

if (!program.language || !langues.length) return null;

const langueProgramme = String(program.language).toLowerCase();

return langues.some((l) => langueProgramme.includes(String(l).toLowerCase()));

}

/**
* @returns {{retenues: Array, nombre: number, ouvertes: number, pays: number}}
*/
export function retenirOpportunites({
profile,
programs,
universitiesById,
scholarshipsById,
aujourdhui = new Date(),
max = 12,
min = 5,
marge = 3,
maxParPays = 3,
// Lot FITZ-CHOISIT (2026-09-11) : les universités qu'un choix de Fitz
// doit éviter — déjà occupées par un autre créneau, ou REFUSÉES par
// l'étudiant (users/{uid}.universitesRefusees). Un Set d'identifiants.
exclureUniversites = null
}) {

const p = profile || {};
const cible = studentTargetLevel(p);
const aEviter = exclureUniversites instanceof Set ? exclureUniversites : new Set(exclureUniversites || []);

const candidats = [];

for (const program of programs) {

const university = universitiesById.get(program.universityId);

if (!university) continue;

// 0 — jamais une université refusée ou déjà occupée.
if (aEviter.has(program.universityId)) continue;

const scholarship = program.scholarshipId ? scholarshipsById.get(program.scholarshipId) : null;

// 1 & 2 — les filtres durs déjà en place, réutilisés tels quels.
if (scoreProgram(program, university, scholarship, p) < 0) continue;

// 3 — le cycle visé. Sans cible connue on ne filtre pas : mieux vaut
// une liste large qu'une page vide.
if (cible && program.level && normalizeLevel(program.level) !== cible) continue;

// 3 bis — le retrait volontaire. `isActive:false` est le seul geste
// editorial qui ferme une bourse sans condition : etatCandidature()
// le traite en PREMIER, avant meme les dates. Le filtre ne change
// rien aujourd'hui (les 27 bourses concernees portent aussi un statut
// « Fermee », mesure le 2026-09-06 : 0 fuite) — il ferme l'ecart pour
// le jour ou l'une d'elles n'en portera pas, et ou le hub proposerait
// alors une bourse que le catalogue affiche close.
if (scholarship && scholarship.isActive === false) continue;

// 4 — la langue.
if (langueCompatible(program, p) === false) continue;

// 5 — l'échéance.
const echeance = etatEcheance(program, aujourdhui);

if (echeance.ouverte === false) continue;

candidats.push({
program,
university,
scholarship,
echeance,
// Le bonus d'échéance ouverte est le plus fort après le cycle :
// entre deux bourses également pertinentes, celle dont les
// candidatures sont encore ouvertes est la seule sur laquelle
// l'étudiant peut agir cette semaine.
score: scoreProgram(program, university, scholarship, p) + (echeance.ouverte === true ? 2 : 0)
});

}

// Tri : pertinence, puis échéance la plus proche (les dates inconnues
// en dernier — on ne les fait pas passer devant une date réelle).
candidats.sort((a, b) =>
(b.score - a.score) ||
((a.echeance.jours ?? Number.MAX_SAFE_INTEGER) - (b.echeance.jours ?? Number.MAX_SAFE_INTEGER))
);

const seuil = candidats.length ? candidats[0].score - marge : 0;

const retenues = [];
const boursesVues = new Set();
const universitesVues = new Set();
const parPays = new Map();

for (const c of candidats) {

if (retenues.length >= max) break;

// Le seuil de pertinence ne s'applique qu'une fois le minimum
// atteint : mieux vaut cinq pistes dont deux moyennes qu'une page
// qui n'en propose qu'une.
if (c.score < seuil && retenues.length >= min) break;

// idDe() et non `.id` : voir son en-tete — la forme des documents
// depend de l'appelant, et la clef qui s'effondrait ne retenait qu'une
// opportunite sur cent.
const cleBourse = c.scholarship && idDe(c.scholarship)
? `bourse:${idDe(c.scholarship)}`
: `programme:${idDe(c.program) || c.program.universityId}`;

if (boursesVues.has(cleBourse)) continue;
if (universitesVues.has(c.program.universityId)) continue;

const pays = c.university.country || "";
if (pays && (parPays.get(pays) || 0) >= maxParPays) continue;

boursesVues.add(cleBourse);
universitesVues.add(c.program.universityId);
if (pays) parPays.set(pays, (parPays.get(pays) || 0) + 1);

retenues.push({
universityId: c.program.universityId,
universityName: c.university.name || "Établissement",
country: pays,
scholarshipId: idDe(c.scholarship),
// Le programme reellement retenu — meme raison que dans
// recommendPrograms : applications.js ecrit cette cle sur la
// candidature, et une heuristique cote appelant se tromperait des
// qu'une universite porte plusieurs fiches d'une meme bourse.
programId: idDe(c.program),
scholarshipTitle: c.scholarship ? c.scholarship.title : "",
deadline: c.program.deadline || null,
jours: c.echeance.jours,
echeanceOuverte: c.echeance.ouverte,
score: c.score,
applicationUrl: c.program.applicationUrl || c.university.applicationPortalUrl || "",
universityWebsite: c.university.officialWebsite || "",
reasons: explainMatch(c.program, c.university, c.scholarship, p)
});

}

return {
retenues,
nombre: retenues.length,
ouvertes: retenues.filter((r) => r.echeanceOuverte === true).length,
pays: new Set(retenues.map((r) => r.country).filter(Boolean)).size
};

}
