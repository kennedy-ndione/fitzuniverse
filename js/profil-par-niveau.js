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

// La table du brief, telle quelle. Tout ce qui n'y figure pas est
// « requise » : seules les sections 3 et 9 varient.
const TABLE = {
[PISTES.LYCEE]: { "sec-academique": "masquee", "sec-experiences": "facultative" },
[PISTES.BAC_OBTENU]: { "sec-academique": "masquee", "sec-experiences": "facultative" },
[PISTES.LICENCE_EN_COURS]: { "sec-experiences": "facultative" },
[PISTES.LICENCE_OBTENUE]: {},
[PISTES.MASTER_EN_COURS]: {},
[PISTES.MASTER_OBTENU]: {},
[PISTES.DOCTORAT_EN_COURS]: {},
[PISTES.DOCTORAT_OBTENU]: {}
};

/**
* L'applicabilité d'une section pour un palier. Sans palier (ou palier
* inconnu) : "requise" — le profil d'avant ce lot.
*/
export function applicabilite(sectionId, palierId) {
const ligne = TABLE[palierId];
if (!ligne) return "requise";
return ligne[sectionId] || "requise";
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
