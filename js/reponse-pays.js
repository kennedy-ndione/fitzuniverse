/**
* ============================================================
* FitzUniverse — les pays du questionnaire se CHOISISSENT dans la liste
* (2026-09-23, décision de Charles)
* ============================================================
*
* CE QU'IL CORRIGE. Constaté en jouant le diagnostic en ligne le
* 2026-09-23 : « Informatique » passait comme pays de résidence. Les
* questions pays sont de type "search", et eligibility-questions.js
* enregistrait n'importe quelle saisie. Or une résidence ou une
* nationalité que isoDeNationalite() ne reconnaît pas rend estEligible()
* muet : les bourses réservées à d'autres nationalités restent affichées,
* et le résultat est faussé sans que rien ne le signale à l'écran.
*
* LA RÈGLE. Pour les trois questions pays — résidence, nationalité,
* destination — la réponse ENREGISTRÉE est toujours une entrée de la
* liste proposée. La SAISIE reste tolérante, puis elle est ramenée à
* l'entrée exacte :
*   - sans accents ni majuscules (« senegal » → « Sénégal ») ;
*   - l'apostrophe courbe du téléphone (« Côte d’Ivoire ») ;
*   - les graphies connues de js/eligibility-countries.js (« RDC »,
*     « Ivory Coast », « Turkey ») et quelques noms d'usage (« USA »,
*     « Angleterre ») ;
*   - à la nationalité, un gentilé libre (« sénégalaise », « malien »)
*     OU un nom de pays (« Sénégal » → « Sénégalais(e) ») ;
*   - à la résidence, un gentilé (« Sénégalais » → « Sénégal ») ;
*   - à la destination, « je ne sais pas », « non », « peu importe »…
* Ce qui ne correspond à RIEN, ou à plusieurs pays (« Congo »), est
* refusé avec une consigne : on ne devine jamais.
*
* Un code de deux lettres (« ma », « ci ») n'est PAS accepté ici, alors
* que isoDeNationalite() le reconnaît : un étudiant qui a tapé deux
* lettres et appuyé sur Continuer voulait finir son mot, pas répondre
* « Maroc ».
*
* MODULE PUR : aucun DOM, aucun réseau. Testé par
* test/reponse-pays.test.mjs.
* ============================================================
*/

import { isoDeNationalite } from "./eligibility-countries.js";
import { PAYS_ET_NATIONALITES, paysDeNationalite, nationaliteDePays } from "./nationalites.js";

/** Les questions dont la réponse doit venir de la liste. */
export const QUESTIONS_PAYS = ["country", "nationality", "destinationCountry"];

export const JE_NE_SAIS_PAS = "Je ne sais pas encore";

/** Noms d'usage absents du référentiel. Court exprès : on ne devine pas. */
const NOMS_D_USAGE = {
"usa": "US", "u s a": "US", "amerique": "US",
"uk": "GB", "angleterre": "GB",
"hollande": "NL",
"emirats": "AE", "emirats arabes": "AE"
};

// « Avez-vous une destination en tête ? » — « Non » est une vraie réponse.
const SANS_PREFERENCE = /^(je ne sais pas|je sais pas|je ne sais|pas encore|pas d idee|aucune idee|aucune preference|peu importe|n importe|indifferent|nsp|non|aucune?|pas vraiment)\b/;

function aplatir(texte) {
return String(texte || "")
.normalize("NFD")
.replace(/\p{Diacritic}/gu, "")
.toLowerCase()
.replace(/[^a-z0-9]+/g, " ")
.trim();
}

/** Le code ISO d'une saisie, sans jamais accepter un code de deux lettres. */
function isoDeSaisie(saisie) {
const clef = aplatir(saisie);
if (NOMS_D_USAGE[clef]) return NOMS_D_USAGE[clef];
if (clef.replace(/\s/g, "").length < 3) return null;
return isoDeNationalite(saisie) || null;
}

let isoParIndex = null;

/** L'entrée [pays, gentilé] de la table dont le code ISO est `iso`. */
function entreeDuCode(iso) {
if (!iso) return null;
if (!isoParIndex) isoParIndex = PAYS_ET_NATIONALITES.map(([nom]) => isoDeNationalite(nom));
const i = isoParIndex.indexOf(iso);
return i >= 0 ? PAYS_ET_NATIONALITES[i] : null;
}

/** L'entrée de `liste` qui désigne le même pays que `iso`. */
function dansLaListe(liste, iso) {
if (!iso) return null;
return liste.find((s) => isoDeNationalite(s) === iso) || null;
}

/**
* La réponse canonique pour une question pays, ou null si la saisie
* n'est pas dans la liste.
*
* @param {string} questionId   "country" | "nationality" | "destinationCountry"
* @param {string} saisie       ce que l'étudiant a tapé
* @param {string[]} suggestions la liste proposée pour cette question
* @returns {string|null}
*/
export function reponseDeListe(questionId, saisie, suggestions) {

const clef = aplatir(saisie);
if (!clef) return null;

const liste = Array.isArray(suggestions) ? suggestions.filter((s) => typeof s === "string" && s) : [];

// 1. Exactement une entrée de la liste, accents et majuscules mis à part.
const exacte = liste.find((s) => aplatir(s) === clef);
if (exacte) return exacte;

if (questionId === "nationality") {
// Un gentilé libre (« sénégalaise ») ou un nom de pays (« Sénégal »).
const pays = paysDeNationalite(saisie);
const gentile = pays ? nationaliteDePays(pays) : null;
if (gentile && liste.includes(gentile)) return gentile;
// Une graphie connue (« RDC », « Ivory Coast »).
const entree = entreeDuCode(isoDeSaisie(saisie));
return entree && liste.includes(entree[1]) ? entree[1] : null;
}

if (questionId === "destinationCountry") {
if (SANS_PREFERENCE.test(clef)) return JE_NE_SAIS_PAS;
const iso = isoDeSaisie(saisie);
const trouve = dansLaListe(liste, iso);
if (trouve) return trouve;
// Filet de secours : sans réseau, la liste se réduit à « Je ne sais
// pas encore » (eligibility-pistes.js). On n'empêche pas l'étudiant
// d'avancer pour autant : un pays reconnu est accepté, sous son nom
// de la liste mondiale.
const reelle = liste.filter((s) => s !== JE_NE_SAIS_PAS);
if (!reelle.length) {
const entree = entreeDuCode(iso);
return entree ? entree[0] : null;
}
return null;
}

// Résidence (et toute autre liste de pays) : graphie connue ou gentilé.
return dansLaListe(liste, isoDeSaisie(saisie));

}

/**
* La consigne affichée quand la saisie n'est pas dans la liste. Elle
* reprend ce qui a été tapé : l'étudiant comprend POURQUOI on l'arrête.
* Quand la liste propose des pays proches (« Congo » → les deux Congo,
* « Fran » → France), la consigne montre simplement où toucher.
*
* @param {string} questionId
* @param {string} saisie
* @param {{proposes?:number}} [options]  nombre de suggestions affichées
*/
export function consigneHorsListe(questionId, saisie, { proposes = 0 } = {}) {
const tape = String(saisie || "").trim().slice(0, 40);
if (tape && proposes > 0) {
const quoi = questionId === "nationality" ? "votre nationalité" : questionId === "destinationCountry" ? "un pays" : "votre pays";
return `« ${tape} » : touchez ${quoi} dans la liste ci-dessous.`;
}
const debut = tape ? `« ${tape} » n'est pas dans la liste. ` : "";
if (questionId === "nationality") return `${debut}Tapez le début de votre nationalité (par exemple « Sénégalais »), puis touchez-la dans la liste.`;
if (questionId === "destinationCountry") {
// Un vrai pays, que le catalogue ne couvre pas encore : on le dit tel
// quel, plutôt que de laisser croire à une faute de frappe.
if (tape && isoDeSaisie(tape)) return `« ${tape} » n'est pas encore dans notre catalogue. Choisissez un pays de la liste, ou « ${JE_NE_SAIS_PAS} ».`;
return `${debut}Choisissez un pays de la liste, ou « ${JE_NE_SAIS_PAS} ».`;
}
return `${debut}Tapez le début du nom de votre pays, puis touchez-le dans la liste.`;
}
