/**
* ============================================================
* FitzUniverse — le profil par palier (lot PROFIL-PAR-NIVEAU, 2026-09-11)
* ============================================================
*
* LE PROBLÈME QUE CE FICHIER RÉSOUT
* ---------------------------------
* Charles, le 2026-09-10 : « il y a des zones à remplir qu'un lycéen qui
* vient d'obtenir son bac n'a pas besoin de remplir ». Le profil avait
* dix sections, toutes comptées, toutes affichées : un nouveau bachelier
* ne pouvait JAMAIS remplir « Mémoire, publications, recherche » ni
* « Stages, emploi », plafonnait donc à 8/10, et lisait des champs qui
* lui disaient « ce site n'est pas pour toi » — à l'endroit exact où il
* venait de payer (profile.html?pour=fitz, lot ACCEPTATION).
*
* LA RÈGLE : LE PALIER D'ABORD, PUIS SEULEMENT CE QUI S'APPLIQUE
* -------------------------------------------------------------
* Le palier est l'un des HUIT du questionnaire public (NIVEAUX_ACTUELS,
* js/eligibility-pistes.js) — on ne réinvente pas une seconde échelle.
* Il est enregistré sous `profile.palier` avec l'identifiant de piste
* (PISTES : "lycee", "bac_obtenu", "licence_en_cours"…). À la lecture, un
* libellé du questionnaire (« Bac obtenu ») est reconnu aussi, par
* pisteDepuisNiveau — même tolérance que le diagnostic.
*
* Chaque section du profil est, pour un palier donné :
*   - "requise"     : affichée et comptée dans le score ;
*   - "facultative" : affichée avec « si vous en avez », PAS comptée ;
*   - "masquee"     : ni affichée ni comptée.
*
* COMPATIBILITÉ ASCENDANTE — LE DÉFAUT EST À LA LECTURE
* -----------------------------------------------------
* Un profil SANS palier (tous les profils écrits avant ce lot) se lit
* comme avant : dix sections, toutes requises. Aucune écriture Firestore
* de rattrapage, jamais — même doctrine que js/parcours.js.
*
* CE FICHIER EST PUR : aucun DOM, aucun Firestore. Testé palier par
* palier dans test/profil-par-niveau.test.mjs.
* ============================================================
*/

import { PISTES, NIVEAUX_ACTUELS, pisteDepuisNiveau } from "./eligibility-pistes.js";

/** Les huit paliers, dans l'ordre du questionnaire, avec leur identifiant. */
export const PALIERS = NIVEAUX_ACTUELS.map((n) => ({
id: pisteDepuisNiveau(n.label),
label: n.label,
icon: n.icon
}));

const IDS_PALIERS = new Set(PALIERS.map((p) => p.id));

/**
* Le palier d'un profil, ou "" s'il n'en a pas (profil d'avant ce lot,
* valeur inconnue, null…). Ne modifie jamais l'argument.
*/
export function lirePalier(profile) {
const brut = profile && typeof profile === "object" ? profile.palier : "";
if (typeof brut !== "string" || !brut.trim()) return "";
const t = brut.trim();
if (IDS_PALIERS.has(t)) return t;
// Un libellé du questionnaire (« Master obtenu ») est accepté aussi.
const piste = pisteDepuisNiveau(t);
return IDS_PALIERS.has(piste) ? piste : "";
}

export function libellePalier(palierId) {
const p = PALIERS.find((x) => x.id === palierId);
return p ? p.label : "";
}

/**
* Les dix sections, dans l'ordre de profile.html — le MÊME ordre que
* PROFILE_SECTION_RULES (js/profile-score.js) et SECTION_LABELS de la
* fiche admin, qui s'indexent dessus.
*/
export const SECTIONS = [
{ id: "sec-personal", libelle: "Informations personnelles" },
{ id: "sec-parcours", libelle: "Parcours scolaire" },
{ id: "sec-academique", libelle: "Niveau académique" },
{ id: "sec-langues", libelle: "Langues" },
{ id: "sec-projet", libelle: "Projet d'études" },
{ id: "sec-destination", libelle: "Préférences de destination" },
{ id: "sec-financier", libelle: "Préférences financières" },
{ id: "sec-documents", libelle: "Documents disponibles" },
{ id: "sec-experiences", libelle: "Expériences" },
{ id: "sec-objectifs", libelle: "Objectifs" }
];

export const APPLICABILITES = ["requise", "facultative", "masquee"];

/**
* ============================================================
* LE NOYAU : CE QUI DÉCIDE DE CE QU'ON PROPOSE (2026-09-14)
* ============================================================
*
* Charles, le 2026-09-14 : « regarde à nouveau la partie compléter mon
* profil car je vois il y a des questions qui ne sont pas nécessaires
* pour connaitre réellement le client et lui proposer ses opportunités
* [...] essaie juste de poser au client des questions simples et
* efficaces qu'il pourra répondre sans se casser la tête ».
*
* Il a raison, et c'est DÉMONTRABLE. Le moteur de recommandation
* (js/recommend-programs.js) ne lit que huit champs du profil :
*   preferredCountries, excludedCountries, languages, desiredField,
*   desiredDegree/targetLevel, fundingWanted, nationality, birthDate.
*
* Or pour atteindre le seuil de 7/10 — celui qui fait basculer la phase
* 01 du parcours, qui débloque l'affichage des opportunités et qui
* commande la prochaine action — l'étudiant devait remplir DIX sections,
* dont quatre que le moteur n'ouvre jamais :
*
*   sec-academique  mémoire, publications, recherche, classement,
*                   matières fortes et faibles ;
*   sec-experiences stages, emploi, associations, bénévolat,
*                   entrepreneuriat ;
*   sec-documents   les pièces déjà en main ;
*   sec-objectifs   pourquoi partir, objectifs de carrière, rêves.
*
* Une vingtaine de champs, donc, dont aucun ne change UNE SEULE des
* opportunités qu'on lui propose. Le lot PROFIL-PAR-NIVEAU du
* 2026-09-11 avait allégé DEUX sections sur dix ; les huit autres
* restaient obligatoires pour tout le monde.
*
* CE QUI CHANGE, ET CE QUI NE CHANGE PAS
* --------------------------------------
* Ces quatre sections deviennent « facultative » : elles restent
* AFFICHÉES, remplissables, et Fitz s'en sert toujours pour écrire les
* lettres et vérifier les dossiers — elles ne BLOQUENT plus. Rien n'est
* retiré du profil, rien n'est effacé en base.
*
* Et la règle ne dépend plus du palier : elle vaut pour tous, profils
* anciens compris. Un profil sans palier n'a aucune raison de rester
* soumis à des questions qui ne servent à personne — la compatibilité
* ascendante protégeait le SCORE, pas l'inconfort.
*
* `sec-academique` reste MASQUÉE pour un lycéen ou un bachelier : il n'a
* pas de niveau académique supérieur à décrire (décision du 2026-09-11).
*
* Il reste donc SIX sections mesurées, et toutes les six portent au
* moins un champ que le moteur lit :
*   sec-personal    birthDate (plafonds d'âge), pays d'origine
*   sec-parcours    le dernier diplôme -> le cycle
*   sec-langues     languages
*   sec-projet      desiredField, desiredDegree
*   sec-destination preferredCountries, excludedCountries
*   sec-financier   fundingWanted
*
* L'AUTRE PORTE NE BOUGE PAS. `profilPretPourFitz` (js/fitz-choisit.js,
* quatre champs) reste ce qui autorise Fitz à CHOISIR les universités.
* Les deux mesures se rapprochent au lieu de se contredire, et c'était
* tout le problème : la porte commerciale demandait quatre champs, le
* parcours en exigeait une vingtaine de plus.
* ============================================================
*/
const ENRICHISSENT = new Set([
"sec-academique",
"sec-experiences",
"sec-documents",
"sec-objectifs"
]);

/** Les sections qui entrent dans la mesure — utile au test et à l'admin. */
export const SECTIONS_DU_NOYAU = SECTIONS.map((s) => s.id).filter((id) => !ENRICHISSENT.has(id));

/**
* ============================================================
* DEUX SECTIONS DE SCORE N'ONT PAS DE SECTION À ELLES DANS LA PAGE
* ============================================================
*
* `SECTIONS` ci-dessus compte DIX entrées parce que profile-score.js
* compte dix règles, et que les deux listes s'indexent l'une sur
* l'autre (le garde-fou est en bas de profile-score.js). Mais
* profile.html n'a que NEUF `<section>` : « Langues » et « Projet
* d'études » ont été remontées dans « Pour commencer » (#sec-depart)
* au lot PROFIL-PAR-NIVEAU, avec les quatre champs dont Fitz a besoin
* pour choisir — « un champ n'existe qu'une fois », dit le commentaire
* du HTML.
*
* Les identifiants `sec-langues` et `sec-projet` sont donc des noms de
* RÈGLES, pas des identifiants d'éléments. `document.getElementById`
* rendait `null` sur les deux, et profile.js passait son chemin sans
* rien dire : aujourd'hui c'est sans conséquence (les deux sont du
* noyau, donc toujours requises, donc rien à afficher), mais le jour
* où l'une deviendrait facultative, sa pastille ne serait jamais posée
* et personne ne le verrait.
*
* Cette table dit lequel des neuf `<section>` porte chaque règle. Le
* test la vérifie contre le HTML livré, ce qui ferme le piège dans les
* deux sens : une section renommée dans la page, ou une règle ajoutée
* sans emplacement, casse le test au lieu de disparaître en silence.
*/
export const SECTION_DOM = Object.freeze({
"sec-personal": "sec-personal",
"sec-parcours": "sec-parcours",
"sec-academique": "sec-academique",
"sec-langues": "sec-depart",
"sec-projet": "sec-depart",
"sec-destination": "sec-destination",
"sec-financier": "sec-financier",
"sec-documents": "sec-documents",
"sec-experiences": "sec-experiences",
"sec-objectifs": "sec-objectifs"
});

/**
* L'élément de page qui porte une section de score.
* @returns {string} l'id du `<section>`, ou l'id reçu s'il est inconnu.
*/
export function domDeSection(sectionId) {
return SECTION_DOM[sectionId] || sectionId;
}

/**
* L'applicabilité d'une section pour un palier.
*
* Une section du noyau est toujours « requise ». Les quatre autres sont
* « facultative » pour tout le monde — sauf « Niveau académique », qui
* est MASQUÉE au secondaire (un bachelier n'a rien à y écrire).
*/
export function applicabilite(sectionId, palierId) {
if (sectionId === "sec-academique" && estSecondaire(palierId)) return "masquee";
if (ENRICHISSENT.has(sectionId)) return "facultative";
return "requise";
}

/** Les sections avec leur applicabilité, dans l'ordre. */
export function sectionsPour(palierId) {
return SECTIONS.map((s, index) => ({ ...s, index, applicabilite: applicabilite(s.id, palierId) }));
}

/**
* Les champs de la section « Niveau académique » à AFFICHER pour un
* palier — la section elle-même est masquée pour un lycéen ou un
* bachelier. Les matières fortes/faibles accompagnent tout parcours en
* cours ou de licence/master ; un doctorant n'a pas de « matières ».
*/
export function champsAcademiques(palierId) {
switch (palierId) {
case PISTES.LYCEE:
case PISTES.BAC_OBTENU:
return [];
case PISTES.LICENCE_EN_COURS:
return ["projects", "strongSubjects", "weakSubjects"];
case PISTES.LICENCE_OBTENUE:
return ["projects", "ranking", "strongSubjects", "weakSubjects"];
case PISTES.MASTER_EN_COURS:
case PISTES.MASTER_OBTENU:
return ["thesis", "projects", "ranking", "strongSubjects", "weakSubjects"];
case PISTES.DOCTORAT_EN_COURS:
case PISTES.DOCTORAT_OBTENU:
return ["researchExperience", "publications", "thesis", "projects", "ranking"];
default:
// Sans palier : tout, comme avant.
return ["ranking", "strongSubjects", "weakSubjects", "projects", "thesis", "publications", "researchExperience"];
}
}

/** Vrai pour un lycéen ou un bachelier : le bloc « diplôme de fin d'études secondaires ». */
export function estSecondaire(palierId) {
return palierId === PISTES.LYCEE || palierId === PISTES.BAC_OBTENU;
}

/**
* Le `studentStatus` hérité (deux valeurs, lu par les alias
* currentDegree/lastDegree de profile.js et par la fiche admin), dérivé
* du palier. "" sans palier : l'ancien bouton radio fait foi.
*/
export function studentStatusDuPalier(palierId) {
if (!palierId || !IDS_PALIERS.has(palierId)) return "";
return estSecondaire(palierId) ? "nouveau_bachelier" : "en_cours";
}

// ============================================================
// LE TEST DE LANGUE (partie 3 — décision du 2026-09-10)
// ============================================================
//
// `profile.testLangue` : { nature, score, date, prevuLe }. « Pas encore
// passé, date prévue » est un état LÉGITIME (celui de la plupart des
// candidats). Aucune règle d'exigence ici : on enregistre, on n'invente
// pas de barème.

export const TESTS_DE_LANGUE = [
{ id: "TCF", label: "TCF" },
{ id: "TCF-DAP", label: "TCF-DAP" },
{ id: "DELF", label: "DELF" },
{ id: "DALF", label: "DALF" },
{ id: "TEF", label: "TEF" },
{ id: "IELTS", label: "IELTS" },
{ id: "TOEFL", label: "TOEFL" },
{ id: "Duolingo", label: "Duolingo English Test" },
{ id: "aucun", label: "Aucun test pour l'instant" }
];

const IDS_TESTS = new Set(TESTS_DE_LANGUE.map((t) => t.id));

/** Lecture tolérante : toujours les quatre clés, toujours des chaînes. */
export function lireTestLangue(profile) {
const t = profile && typeof profile === "object" && profile.testLangue && typeof profile.testLangue === "object" ? profile.testLangue : {};
const nature = typeof t.nature === "string" && IDS_TESTS.has(t.nature) ? t.nature : "";
const chaine = (v) => (typeof v === "string" ? v.trim() : "");
return { nature, score: chaine(t.score), date: chaine(t.date), prevuLe: chaine(t.prevuLe) };
}

/** Phrase de lecture (fiche admin, prompts) — "" quand rien n'est renseigné. */
export function phraseTestLangue(profile) {
const t = lireTestLangue(profile);
if (!t.nature) return "";
if (t.nature === "aucun") return "Aucun test de langue pour l'instant";
const nom = (TESTS_DE_LANGUE.find((x) => x.id === t.nature) || {}).label || t.nature;
if (t.score || t.date) {
return `${nom}${t.score ? ` : ${t.score}` : ""}${t.date ? ` (passé le ${t.date})` : ""}`;
}
if (t.prevuLe) return `${nom} prévu le ${t.prevuLe}`;
return nom;
}

/**
* Les langues du profil, lisibles. Deux formes cohabitent en base : des
* chaînes (« français », anciens profils et harnais) et des objets
* {code, level, name?} écrits par profile.js. Sans cette lecture, un
* `join(", ")` donnait « [object Object] » à Fitz.
*/
const NOMS_LANGUES = { fr: "Français", en: "Anglais", es: "Espagnol", de: "Allemand", ar: "Arabe" };

export function languesLisibles(languages) {
if (!Array.isArray(languages)) return [];
return languages.map((l) => {
if (typeof l === "string") return l.trim();
if (!l || typeof l !== "object") return "";
const nom = l.code === "autre" ? String(l.name || "").trim() : (NOMS_LANGUES[l.code] || String(l.code || "").trim());
return [nom, l.level ? String(l.level) : ""].filter(Boolean).join(" ");
}).filter(Boolean);
}
