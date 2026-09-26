/**
* ============================================================
* FitzUniverse — du diagnostic gratuit au profil (lot PROFIL-PAR-NIVEAU,
* partie 4, 2026-09-11)
* ============================================================
*
* LE PROBLÈME
* -----------
* Le diagnostic gratuit enregistre ses réponses dans
* sessionStorage.eligibilityResponses (eligibility-questions.js, finish()).
* Jusqu'à ce lot, elles étaient perdues : un compte créé au paiement ou
* depuis les résultats recevait un profil VIDE, et l'étudiant devait
* répondre une seconde fois à ce qu'il venait de dire.
*
* LA RÈGLE
* --------
*  - la table de correspondance se construit depuis les VRAIES
*    définitions : les questions de js/eligibility-pistes.js (identifiants
*    et libellés d'options) et les valeurs de profile.html/profile.js ;
*  - une valeur qu'on ne sait pas convertir SANS DEVINER reste vide
*    (le niveau CECRL d'un « Bon niveau », la nature d'un « Oui, en
*    anglais (IELTS, TOEFL…) »…) ;
*  - on ne pré-remplit que les champs VIDES : jamais écraser une valeur
*    déjà saisie (fusionnerSansEcraser) ;
*  - les champs repris sont listés dans `reprisDuDiagnostic`, pour la
*    mention « Repris de votre diagnostic — vérifiez » ; profile.js vide
*    cette liste quand l'étudiant enregistre.
*
* CE FICHIER EST PUR : aucun DOM, aucun Firestore (lireReponsesDiagnostic
* lit sessionStorage quand il existe, et rend null sinon). Testé champ
* par champ dans test/diagnostic-vers-profil.test.mjs.
* ============================================================
*/

import { pisteDepuisNiveau, PISTES, genreDepuisReponse, trancheExperience } from "./eligibility-pistes.js";

// ---------- Tables, depuis les définitions réelles ----------

// CYCLE_VISE (eligibility-pistes.js) → <select id="desiredDegree"> (profile.html)
const CYCLE_VERS_DIPLOME = {
"Licence (Bachelor)": "Licence",
"Master": "Master",
"Doctorat (PhD)": "Doctorat"
};

// Le palier dit quel est le dernier diplôme OBTENU, sans deviner :
// « Licence en cours » ⇒ le bac est obtenu ; « Master obtenu » ⇒ master.
const DERNIER_DIPLOME_DU_PALIER = {
[PISTES.LYCEE]: "",
[PISTES.BAC_OBTENU]: "Baccalauréat",
[PISTES.LICENCE_EN_COURS]: "Baccalauréat",
[PISTES.LICENCE_OBTENUE]: "Licence",
[PISTES.MASTER_EN_COURS]: "Licence",
[PISTES.MASTER_OBTENU]: "Master",
[PISTES.DOCTORAT_EN_COURS]: "Master",
[PISTES.DOCTORAT_OBTENU]: "Doctorat"
};

// licenceYear (piste licence en cours) → <select id="currentLevel">.
// « Année de reprise ou de césure » ne dit pas l'année : vide.
const ANNEE_LICENCE_VERS_NIVEAU = {
"1re année": "L1",
"2e année": "L2",
"3e année (ou dernière année)": "L3"
};

// goal (tronc commun) → cases `fundingWanted` (profile.html).
const FINANCEMENT_VERS_CASES = {
"Une bourse complète": ["full_scholarship"],
"Une bourse partielle": ["partial_scholarship"],
"Les deux m'intéressent": ["full_scholarship", "partial_scholarship"]
};

// Les échelles de moyenne portent les MÊMES identifiants des deux côtés
// (question `average`, eligibility-pistes.js ; AVERAGE_SCALES, profile.js).
const ECHELLES = new Set(["20", "100", "gpa4", "letters", "other"]);

const DEBUTANT = "Débutant";

function chaine(v) {
return typeof v === "string" ? v.trim() : (typeof v === "number" && Number.isFinite(v) ? String(v) : "");
}

// « Vide » au sens de l'étudiant : rien de saisi. Un objet dont toutes
// les valeurs sont vides est vide — le profil par défaut de profile.js
// porte `testLangue: { nature: "", score: "", date: "", prevuLe: "" }`,
// et cet objet-là ne doit pas bloquer la reprise (bug vu au harnais le
// 2026-09-11 : le « Pas encore » du diagnostic n'arrivait jamais).
function vide(v) {
if (Array.isArray(v)) return v.length === 0;
if (v && typeof v === "object") return Object.values(v).every(vide);
return chaine(v) === "";
}

/**
* Traduit les réponses du diagnostic en un profil PARTIEL : seulement
* les champs qu'on sait convertir, avec des valeurs non vides.
*
* @param {Object} reponses  — sessionStorage.eligibilityResponses, désérialisé
* @param {{ aujourdhui?: Date }} [options] — pour « Cette année » (diplomaWhen)
*/
export function profilDepuisDiagnostic(reponses, { aujourdhui = new Date() } = {}) {

const r = reponses && typeof reponses === "object" ? reponses : {};
const partiel = {};
const pose = (cle, valeur) => { if (!vide(valeur)) partiel[cle] = valeur; };

// 1. Le palier — depuis le libellé de currentLevel (ou `piste` déjà
//    écrite par finish()). Reconnaissance par mots-clés, tolérante aux
//    anciens libellés (pisteDepuisNiveau).
const palier = pisteDepuisNiveau(r.currentLevel) || (typeof r.piste === "string" ? pisteDepuisNiveau(r.piste.replace(/_/g, " ")) : "");
pose("palier", palier);

if (palier) {
pose("lastDegree", DERNIER_DIPLOME_DU_PALIER[palier] || "");
}

// currentLevel du profil (L1…Doctorat) : seulement quand la question l'a dit.
if (palier === PISTES.LICENCE_EN_COURS) pose("currentLevel", ANNEE_LICENCE_VERS_NIVEAU[chaine(r.licenceYear)] || "");
if (palier === PISTES.DOCTORAT_EN_COURS) pose("currentLevel", "Doctorat");

// 2. Le cycle visé.
pose("desiredDegree", CYCLE_VERS_DIPLOME[chaine(r.targetLevel)] || "");

// 3. Identité et lieu — saisie libre des deux côtés, même liste.
pose("nationality", chaine(r.nationality));
pose("country", chaine(r.country));

// 4. Le domaine.
pose("desiredField", chaine(r.studyCategory));

// 5. La moyenne, avec son échelle — au bac pour un lycéen/bachelier, sinon générale.
const moyenne = chaine(r.average);
const echelle = ECHELLES.has(chaine(r.averageScale)) ? chaine(r.averageScale) : "";
if (moyenne && echelle) {
if (palier === PISTES.LYCEE || palier === PISTES.BAC_OBTENU) {
pose("bacAverage", moyenne);
pose("bacAverageScale", echelle);
} else {
pose("academicAverage", moyenne);
pose("academicAverageScale", echelle);
}
}

// 6. La filière du secondaire → série du bac. La saisie libre (« comme
//    sur vos relevés ») d'abord ; sinon la famille, sauf « Autre filière ».
const filiere = chaine(r.secondaryTrackOther) || (chaine(r.secondaryTrack) !== "Autre filière" ? chaine(r.secondaryTrack) : "");
if (palier === PISTES.LYCEE || palier === PISTES.BAC_OBTENU) pose("bacSeries", filiere);

// 7. Les langues : on sait qu'une langue est PRATIQUÉE (au-delà de
//    « Débutant »), pas son niveau CECRL — celui-ci reste vide, à
//    compléter. Même règle que results.js (buildProfileFromResponses).
const langues = [];
if (chaine(r.french) && chaine(r.french) !== DEBUTANT) langues.push({ code: "fr", level: "" });
if (chaine(r.english) && chaine(r.english) !== DEBUTANT) langues.push({ code: "en", level: "" });
pose("languages", langues);

// 8. Le test de langue : seule « Pas encore » se traduit sans deviner
//    (aucun test) ; « Oui, en anglais (IELTS, TOEFL…) » ne dit pas lequel.
// Lot R17 : l'état est désormais un champ à lui (`etat`) — « aucun »
// n'est plus un test déguisé rangé dans `nature`.
if (chaine(r.langCert) === "Pas encore") pose("testLangue", { etat: "aucun", nature: "", score: "", date: "", prevuLe: "" });

// 9. La destination.
const destination = chaine(r.destinationCountry);
if (destination && destination !== "Je ne sais pas encore") pose("preferredCountries", [destination]);

// 10. Le financement recherché.
pose("fundingWanted", FINANCEMENT_VERS_CASES[chaine(r.goal)] || []);

// 11. Le passeport : seul « valide » vaut « je le possède ».
if (chaine(r.passport) === "Passeport valide") pose("documentsAvailable", ["passport"]);

// 12. L'expérience professionnelle : le libellé, tel quel ; « Aucune
//     pour l'instant » n'est pas une expérience.
const exp = chaine(r.workExperience);
if (exp && exp !== "Aucune pour l'instant") pose("workExperience", exp);

// Lot 112 : la TRANCHE elle-même, « Aucune » comprise, dans un champ à
// part que le moteur sait lire (experienceProTranche). La zone de texte
// `workExperience` décrit des expériences ; « Aucune pour l'instant » n'y
// a pas sa place, mais c'est une réponse, et elle ferme le DAAD-EPOS ou
// Chevening. Seulement pour les paliers où la question est posée.
const PALIERS_EXPERIENCE = [PISTES.LICENCE_OBTENUE, PISTES.MASTER_EN_COURS, PISTES.MASTER_OBTENU, PISTES.DOCTORAT_OBTENU];
if (trancheExperience(exp) && PALIERS_EXPERIENCE.includes(palier)) pose("experienceProTranche", exp);

// Lot 112 : le genre, au vocabulaire du profil (profile.html).
pose("gender", genreDepuisReponse(r.gender));

// 13. L'année d'obtention, quand la question la date sans ambiguïté.
const quand = chaine(r.diplomaWhen);
const annee = aujourdhui instanceof Date && !Number.isNaN(+aujourdhui) ? aujourdhui.getFullYear() : null;
if (annee && palier && palier !== PISTES.LYCEE) {
if (quand === "Cette année") pose("graduationYear", String(annee));
if (quand === "L'an dernier") pose("graduationYear", String(annee - 1));
}

return partiel;

}

/**
* Fusionne un profil partiel dans un profil existant SANS écraser :
* seules les clés vides du profil reçoivent une valeur. Rend un nouvel
* objet (l'argument n'est pas modifié) et la liste des clés reprises.
*
* @returns {{ profil: Object, repris: string[] }}
*/
export function fusionnerSansEcraser(profile, partiel) {
const base = profile && typeof profile === "object" ? profile : {};
const p = partiel && typeof partiel === "object" ? partiel : {};
const profil = { ...base };
const repris = [];
for (const [cle, valeur] of Object.entries(p)) {
if (vide(valeur)) continue;
if (!vide(base[cle])) continue;
profil[cle] = Array.isArray(valeur) ? [...valeur] : (valeur && typeof valeur === "object" ? { ...valeur } : valeur);
repris.push(cle);
}
return { profil, repris };
}

/**
* Applique le diagnostic à un profil : fusion sans écrasement, et la
* liste `reprisDuDiagnostic` (les clés reprises, pour la mention à
* l'écran) — vide si rien n'a été repris.
*/
export function appliquerDiagnostic(profile, reponses, options) {
const { profil, repris } = fusionnerSansEcraser(profile, profilDepuisDiagnostic(reponses, options));
if (repris.length) profil.reprisDuDiagnostic = repris;
return { profil, repris };
}

/**
* Les réponses du diagnostic, ou null. Ne lève jamais.
*
* DEUX SOURCES, DANS CET ORDRE (corrigé le 2026-09-20) :
*
*   1. `sessionStorage.eligibilityResponses` — l'onglet en cours, écrit
*      par eligibility-questions.js. C'est la source la plus fraîche.
*   2. la mémoire locale de js/diagnostic-garde.js — les mêmes réponses,
*      recopiées dans localStorage par la page de résultats.
*
* Le repli n'est pas un confort : sans lui, un étudiant qui fait son
* diagnostic, ferme l'onglet, puis revient créer son compte arrivait sur
* un profil vide. Le sessionStorage meurt avec l'onglet, et la page
* d'inscription promet en titre de CONSERVER le diagnostic.
*
* L'import est dynamique et enveloppé : ce module doit rester lisible
* sous Node par test/diagnostic-vers-profil.test.mjs, et la mémoire
* locale n'existe pas là-bas.
*/
export function lireReponsesDiagnostic() {
try {
if (typeof sessionStorage !== "undefined") {
const brut = sessionStorage.getItem("eligibilityResponses");
if (brut) {
const r = JSON.parse(brut);
if (r && typeof r === "object") return r;
}
}
} catch {
// Stockage refusé : on tente la mémoire locale ci-dessous.
}
return lireMemoireLocale();
}

/** La mémoire locale, sans importer le module quand il n'est pas là. */
function lireMemoireLocale() {
try {
if (typeof localStorage === "undefined") return null;
const brut = localStorage.getItem("fitz_diagnostic");
if (!brut) return null;
const paquet = JSON.parse(brut);
if (!paquet || typeof paquet.reponses !== "object" || !paquet.reponses) return null;
const le = new Date(paquet.le).getTime();
if (!Number.isFinite(le)) return null;
// Même fenêtre que js/diagnostic-garde.js (JOURS_VALIDITE = 90) :
// au-delà, ces réponses ne décrivent plus personne.
const jours = (Date.now() - le) / 86400000;
return jours >= 0 && jours <= 90 ? paquet.reponses : null;
} catch {
return null;
}
}

/**
* CE QUE LE DIAGNOSTIC DIT AUTREMENT QUE LE PROFIL (lot DÉPART, 2026-09-21).
*
* fusionnerSansEcraser ne remplit que les cases vides : c'est voulu, un
* diagnostic refait en cinq minutes ne doit pas effacer un profil
* construit en une heure. Mais l'écart restait MUET. Constaté le 21 sur
* un compte réel : diagnostic « Master, Économie, France », profil
* « Licence, Psychologie, Chine » — les résultats proposaient Sciences Po,
* l'espace continuait de proposer Toronto, et personne ne disait
* pourquoi. On ne tranche pas à la place de l'étudiant : on lui montre
* les trois écarts qui changent les propositions de Fitz, et on
* l'envoie à son profil s'il veut que son espace suive.
*
* Trois champs seulement, ceux qui décident de la sélection : le niveau
* visé, le domaine, la destination. Une case vide côté profil n'est pas
* un écart (le diagnostic la remplit déjà).
*
* @returns {Array<{champ:string, libelle:string, diagnostic:string, profil:string}>}
*/
export function ecartsDiagnosticProfil(profile, reponses) {

const p = profile && typeof profile === "object" ? profile : {};
const partiel = profilDepuisDiagnostic(reponses);
const plat = (v) => chaine(v).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const ecarts = [];

if (partiel.desiredDegree && chaine(p.desiredDegree) && plat(partiel.desiredDegree) !== plat(p.desiredDegree)) {
ecarts.push({ champ: "desiredDegree", libelle: "Niveau visé", diagnostic: partiel.desiredDegree, profil: chaine(p.desiredDegree) });
}

if (partiel.desiredField && chaine(p.desiredField) && plat(partiel.desiredField) !== plat(p.desiredField)) {
ecarts.push({ champ: "desiredField", libelle: "Domaine", diagnostic: partiel.desiredField, profil: chaine(p.desiredField) });
}

const pays = Array.isArray(p.preferredCountries) ? p.preferredCountries.map(chaine).filter(Boolean) : [];
const destination = Array.isArray(partiel.preferredCountries) ? partiel.preferredCountries[0] : "";
if (destination && pays.length && !pays.some((x) => plat(x) === plat(destination))) {
ecarts.push({ champ: "preferredCountries", libelle: "Destination", diagnostic: destination, profil: pays.join(", ") });
}

return ecarts;

}
