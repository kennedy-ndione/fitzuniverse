/**
* ============================================================
* Fitz — ce que le bandeau de l'accueil a le droit de montrer
* ============================================================
*
* Logique PURE du bandeau « Ouvert en ce moment » (js/opportunites-bandeau.js),
* sortie le 2026-09-26 (lot 114) pour être testée hors navigateur :
* aucun DOM, aucun réseau, seulement js/echeance.js.
*
* POURQUOI CE LOT
* ---------------
* Charles : « met à jour ce panneau publicitaire avec des bourses dont
* les échéances sont dans les temps ». Mesuré le 26/09 sur le catalogue
* en production : le bandeau montrait l'University of Cape Town et APU
* (4 jours), Veneto et DSU Lombardia (4 jours), Chevening et
* Knight-Hennessy (10 jours), Semmelweis et Hambourg (19 jours). Aucun
* étudiant qui découvre le site ne réunit un dossier en quatre jours ;
* Chevening avait déjà ses programmes fermés ; Semmelweis et Hambourg ne
* concernent que des étudiants déjà inscrits sur place.
*
* LES RÈGLES, DANS L'ORDRE
* ------------------------
*   1. Un programme fermé (statut « ferm… » ou `isActive:false`) ne fait
*      pas de carte, même si sa bourse dit « Ouverte ».
*   2. Une bourse réservée aux étudiants déjà inscrits dans le pays
*      (`deja_inscrit_sur_place`) n'est pas une opportunité pour le
*      visiteur de l'accueil.
*   3. La bourse doit être ouverte selon etatCandidature(), la même
*      autorité que partout ailleurs.
*   4. La date VÉRIFIÉE (`deadlineISO`) passe avant la prose.
*   5. Il faut au moins JOURS_MINIMUM_BANDEAU jours (30, le plancher du
*      moteur de recommandation) avant la date limite, ou une
*      candidature au fil de l'eau.
*   6. Une bourse dont la date dépend du pays n'a de carte que si elle
*      publie ses dates pays par pays (`echeancesParPays`, bourses
*      suisses) : la carte dit « Selon votre pays, du … au … », et elle
*      reste tant que la DERNIÈRE de ces dates est à 30 jours ou plus.
*   7. Les bourses mises à la une (`aLaUne`) passent en tête.
* ============================================================
*/

import {
analyserEcheance,
joursAvant,
formaterDate,
libelleEcheance,
classerOpportunites,
etatCandidature,
JOURS_PROCHE
} from "./echeance.js";

/**
* Le temps minimum qu'une carte laisse à l'étudiant pour réunir son
* dossier. C'est JOURS_MINIMUM_POUR_DEPOSER de js/recommend-programs.js,
* recopié ici pour ne pas charger tout le moteur sur l'accueil :
* test/lot114.test.mjs vérifie que les deux valeurs restent égales.
*/
export const JOURS_MINIMUM_BANDEAU = 30;

/**
* Nombre de cartes retenues. Au-delà, la piste devient si longue
* qu'une carte donnée ne repasse qu'après plusieurs minutes — le
* bandeau cesse d'être une annonce et devient un catalogue lent.
*/
export const MAX_CARTES = 12;

const RE_DATE_ISO = /^\d{4}-\d{2}-\d{2}$/;
const RE_FERME = /ferm/i;

/** Une date ISO nue ET réelle (« 2026-02-30 » n'en est pas une). */
function dateIsoValide(valeur) {
if (typeof valeur !== "string" || !RE_DATE_ISO.test(valeur)) return false;
const d = new Date(`${valeur}T00:00:00Z`);
return !isNaN(d.getTime()) && d.toISOString().slice(0, 10) === valeur;
}

/** Une date vérifiée, dans la forme que rend analyserEcheance(). */
export function echeanceVerifiee(iso) {
return { etat: "datee", date: iso, heure: null, fuseau: null, confiance: "haute", texte: formaterDate(iso) };
}

/** L'échéance d'un programme : la date vérifiée d'abord, la prose ensuite. */
export function echeanceDuProgramme(programme) {
const p = programme || {};
return dateIsoValide(p.deadlineISO) ? echeanceVerifiee(p.deadlineISO) : analyserEcheance(p.deadline);
}

/** Les dates d'une bourse qui en publie une par pays, triées, sans doublon. */
export function datesParPays(bourse) {
const table = bourse && bourse.echeancesParPays;
if (!table || typeof table !== "object" || Array.isArray(table)) return [];
return [...new Set(Object.values(table).filter(dateIsoValide))].sort();
}

/** Au moins 30 jours devant soi, ou une candidature au fil de l'eau. */
export function dansLesTemps(echeance, aujourdhui = new Date()) {
if (!echeance) return false;
if (echeance.etat === "continue") return true;
const jours = joursAvant(echeance, aujourdhui);
return jours !== null && jours >= JOURS_MINIMUM_BANDEAU;
}

/** Le programme lui-même est-il ouvert ? (règle 1) */
export function programmeOuvert(programme) {
const p = programme || {};
return p.isActive !== false && !RE_FERME.test(String(p.status || ""));
}

const niveauxDe = (programme) => String((programme && programme.level) || "")
.split("/")
.map((s) => s.trim())
.filter(Boolean);

/**
* Les cartes du bandeau, triées : la une d'abord, puis l'ordre de
* classerOpportunites() (bourses pour l'Afrique, couverture complète,
* fenêtre « proche »).
*
* Un même couple bourse × pays existe en plusieurs programmes (un par
* université et par niveau) : le Stipendium Hungaricum occuperait 33
* cartes à lui seul. On n'en garde qu'une, avec la date la plus proche
* PARMI CELLES QUI LAISSENT ENCORE LE TEMPS, et les niveaux cumulés.
*
* @param {Object[]} programmes - documents `programs`
* @param {Map} bourses - id -> document `scholarships`
* @param {Map} universites - id -> document `universities`
* @returns {{ouvertes: Object[], retenues: Object[]}} toutes les cartes
* dans les temps, et les MAX_CARTES premières
*/
export function selectionnerOpportunites(programmes, bourses, universites, aujourdhui = new Date()) {

// L'état de chaque bourse, calculé une fois, sur TOUS ses programmes.
const proseParBourse = new Map();
const isoParBourse = new Map();

for (const p of programmes || []) {
if (!p || !p.scholarshipId) continue;
if (!proseParBourse.has(p.scholarshipId)) {
proseParBourse.set(p.scholarshipId, []);
isoParBourse.set(p.scholarshipId, []);
}
proseParBourse.get(p.scholarshipId).push(p.deadline);
if (dateIsoValide(p.deadlineISO)) isoParBourse.get(p.scholarshipId).push(p.deadlineISO);
}

const etatParBourse = new Map();

const bourseOuverte = (bourse) => {
if (!etatParBourse.has(bourse.id)) {
etatParBourse.set(bourse.id, etatCandidature({
statut: bourse.status,
actif: bourse.isActive,
echeances: proseParBourse.get(bourse.id) || [],
echeanceISO: isoParBourse.get(bourse.id) || [],
periodeOuverture: bourse.periodeOuverture,
verifieLe: bourse.verifieLe,
echeanceVariable: bourse.echeanceVariable
}, aujourdhui));
}
return etatParBourse.get(bourse.id).ton === "ouverte";
};

const parCle = new Map();

for (const p of programmes || []) {

const bourse = p && bourses.get(p.scholarshipId);

// Sans titre de bourse, la carte n'aurait rien à annoncer.
if (!bourse || !bourse.title) continue;

// 1. Le programme fermé.
if (!programmeOuvert(p)) continue;

// 2. Réservée aux étudiants déjà inscrits sur place.
const exigences = Array.isArray(bourse.exigences) ? bourse.exigences : [];
if (exigences.includes("deja_inscrit_sur_place")) continue;

// 3. La bourse elle-même.
if (!bourseOuverte(bourse)) continue;

// 6. Une date par pays : la carte dit la fourchette, et tient tant que
// la dernière date laisse le temps. Une date qui dépend du pays sans
// table publiée n'a pas de chiffre vrai pour le lecteur : pas de carte.
const dates = datesParPays(bourse);
if (bourse.echeanceVariable && !dates.length) continue;

// 4. La date vérifiée d'abord.
const echeance = dates.length ? echeanceVerifiee(dates[dates.length - 1]) : echeanceDuProgramme(p);

// 5. Le temps de réunir un dossier.
if (!dansLesTemps(echeance, aujourdhui)) continue;

const universite = universites.get(p.universityId);
const pays = p.country || (universite && universite.country) || "";
const cle = `${p.scholarshipId}|${pays}`;
const existant = parCle.get(cle);

if (existant) {
for (const niveau of niveauxDe(p)) {
if (!existant.niveaux.includes(niveau)) existant.niveaux.push(niveau);
}
// La date la plus proche parmi celles qui laissent le temps.
if (!dates.length && echeance.date && (!existant.echeance.date || echeance.date < existant.echeance.date)) {
existant.echeance = echeance;
}
continue;
}

parCle.set(cle, {
scholarshipId: p.scholarshipId,
nom: bourse.title,
pays,
drapeau: (universite && universite.flag) || "",
universite: (universite && universite.name) || "",
couverture: p.coverage || bourse.coverage || "",
niveaux: niveauxDe(p),
verifieLe: p.verifieLe || null,
echeance,
parPays: dates.length ? { premiere: dates[0], derniere: dates[dates.length - 1], nombre: Object.keys(bourse.echeancesParPays).length } : null,
aLaUne: bourse.aLaUne === true,
// La carte mène à la bourse elle-même dans le catalogue, pas à la
// liste entière.
lien: `scholarships.html?search=${encodeURIComponent(bourse.title)}`,
// Ce qu'il faut pour choisir la photo (js/scholarship-image.js), que
// le bandeau résout au rendu.
imageEntree: {
pays,
texteHash: bourse.title || p.scholarshipId,
universiteImage: (universite && universite.image) || null,
bourseImage: bourse.image || null
}
});

}

// 7. La une d'abord, puis le classement habituel.
const classees = classerOpportunites([...parCle.values()], aujourdhui);
const ouvertes = [...classees.filter((o) => o.aLaUne), ...classees.filter((o) => !o.aLaUne)];

return { ouvertes, retenues: ouvertes.slice(0, MAX_CARTES) };

}

const MOIS_COURTS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];

/** « 13 oct. », « 1er déc. » */
function dateCourte(iso) {
const [, m, j] = iso.split("-").map(Number);
return `${j === 1 ? "1er" : j} ${MOIS_COURTS[m - 1]}`;
}

/**
* La pastille de décompte d'une carte. Une carte « par pays » n'a pas de
* chiffre : aucun nombre de jours ne serait vrai pour tous ses lecteurs.
* @returns {{ton:string, chiffre:string, texte:string, titre:string}}
*/
export function libelleCarte(opp, aujourdhui = new Date()) {
if (opp && opp.parPays) {
const { premiere, derniere } = opp.parPays;
const jours = joursAvant(opp.echeance, aujourdhui);
return {
ton: jours !== null && jours <= JOURS_PROCHE ? "proche" : "calme",
chiffre: "",
texte: premiere === derniere
? `Jusqu'au ${dateCourte(derniere)}`
: `Selon votre pays, du ${dateCourte(premiere)} au ${dateCourte(derniere)}`,
titre: premiere === derniere
? `Clôture le ${formaterDate(derniere)}`
: `La date limite dépend de votre pays : entre le ${formaterDate(premiere)} et le ${formaterDate(derniere)}`
};
}
return libelleEcheance(opp && opp.echeance, aujourdhui);
}
