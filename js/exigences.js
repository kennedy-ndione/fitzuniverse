/**
* ============================================================
* Fitz — ce qu'une bourse exige, et sous quelle forme
* ============================================================
*
* LE PROBLÈME QUE CE FICHIER RÉSOUT (passe espace étudiant 3/3, 2026-09-06)
* -------------------------------------------------------------------------
* Le champ `exigences` est renseigné sur 99 bourses sur 156, et n'était
* lu par AUCUN fichier du site. Une donnée vérifiée à la main, bourse
* par bourse, qui ne servait à personne.
*
* Parmi ce qu'elle dit, une chose comptait plus que toutes les autres :
* sur **27 bourses**, l'étudiant NE DÉPOSE PAS son dossier lui-même.
* C'est l'établissement, l'ambassade, ou une autorité nationale qui le
* présente. Sans cette phrase, un étudiant peut surveiller pendant des
* mois l'ouverture d'un portail qui ne le concerne pas — et laisser
* passer la seule date qui comptait, celle de l'organisme qui devait le
* nommer.
*
* CINQ FORMES, PARCE QUE CE NE SONT PAS CINQ FOIS LA MÊME CHOSE
* -------------------------------------------------------------
* La tentation était de tout verser dans la checklist du dossier. Ce
* serait faux : sur treize codes, DEUX seulement sont des pièces à
* rassembler. Les autres sont un ordre à respecter, une voie de dépôt,
* une condition d'éligibilité ou une pièce à produire — rien qu'on
* « coche ».
*
*   voie       PAR OÙ le dossier passe
*   ordre      l'admission vient avant la bourse
*   condition  une condition d'éligibilité
*   piece      un document à produire
*   dossier    un élément de la checklist existante
*
* « VOIE » VEUT DIRE LA ROUTE, PAS « QUELQU'UN D'AUTRE DÉPOSE »
* (précisé le 2026-09-14). La forme était glosée « l'étudiant ne dépose
* pas lui-même », parce que ses cinq premiers codes décrivaient tous une
* nomination par un tiers. Le lot des portails a buté sur deux bourses
* où l'étudiant dépose bel et bien lui-même, mais ailleurs que sur un
* portail : par courriel (bourse FAO-Hongrie) et par la poste
* (Mastercard Foundation à KNUST). Sans code pour ça, ces candidats ne
* lisaient RIEN sur l'endroit du dépôt — ni portail, ni phrase : la
* fiche se taisait sur la seule chose qui comptait. La forme dit donc
* par où le dossier passe, et « un tiers vous présente » n'en est qu'un
* cas parmi d'autres.
*
* Les comptes par forme ne sont plus écrits ici : ils changeaient à
* chaque lot de données et personne ne les remettait à jour. Pour les
* obtenir, `bilanExigences` (en bas de ce fichier) les calcule.
*
* LA RÈGLE DES TROIS VALEURS, ENCORE
* -----------------------------------
* `exigences` absent ou vide = INCONNU, jamais « aucune exigence ». Les
* 57 bourses sans le champ n'affichent RIEN : pas de bloc vide, pas de
* « rien d'exigé ». Une bourse dont personne n'a encore relevé les
* exigences n'est pas une bourse sans exigences. Même doctrine que
* estEligible() et etatCandidature().
*
* Un code inconnu — ajouté un jour à la main dans l'admin — est IGNORÉ,
* jamais affiché brut : « nomination_par_ecole_bis » sur une fiche
* publique serait pire que rien.
*
* Aucun DOM, aucun Firestore : testable sous Node.
* ============================================================
*/

/**
* Le vocabulaire fermé, à UN SEUL endroit — c'est ce qui garantit que la
* fiche publique et l'espace connecté disent exactement la même chose de
* la même bourse.
*
* `explication` s'adresse à l'étudiant, à la deuxième personne, et dit
* ce qu'il doit FAIRE ou comprendre — pas ce que le champ signifie.
*/
export const EXIGENCES = {

admission_prealable: {
forme: "ordre",
libelle: "Admission préalable exigée",
explication: "Vous devez d'abord être admis par l'établissement. La bourse se demande ensuite, ou en même temps que l'admission — jamais avant."
},

candidature_via_etablissement: {
forme: "voie",
libelle: "Le dossier est déposé par l'établissement",
explication: "Vous ne déposez pas cette candidature vous-même : c'est l'établissement qui présente votre dossier, et il fixe sa propre date limite interne, souvent plus tôt que celle du programme."
},

candidature_via_ambassade: {
forme: "voie",
libelle: "Candidature via l'ambassade",
explication: "Le dossier passe par l'ambassade ou le consulat du pays d'accueil dans votre pays de résidence. Contactez-les tôt : ce sont eux qui annoncent le calendrier, et il ne figure pas toujours en ligne."
},

nomination_autorite_nationale: {
forme: "voie",
libelle: "Nomination par une autorité nationale",
explication: "Cette bourse se demande auprès des autorités de votre pays d'origine, qui présentent les candidats retenus. Aucun dépôt direct n'est possible : le ministère concerné est votre premier interlocuteur."
},

nomination_par_ecole: {
forme: "voie",
libelle: "Nomination par votre école",
explication: "C'est votre établissement actuel qui vous présente. Adressez-vous à son service des relations internationales : c'est lui qui détient la procédure et les délais."
},

// LES DEUX CODES OÙ L'ÉTUDIANT DÉPOSE LUI-MÊME, MAIS PAS SUR UN PORTAIL
// (ajoutés le 2026-09-14, lot des portails de bourse).
//
// Le champ `applicationPortalUrl` reste VIDE sur ces bourses, et un
// champ vide est une réponse — mais une réponse muette. Ces deux codes
// la rendent lisible : sans eux, le candidat de la bourse FAO-Hongrie
// n'avait aucun moyen d'apprendre qu'il fallait écrire à une adresse
// électronique, et celui de KNUST qu'il fallait poster un dossier
// papier. Aucune des deux fiches ne disait où aller.

depot_par_courriel: {
forme: "voie",
libelle: "Dépôt par courriel",
explication: "Il n'y a pas de formulaire en ligne : le dossier complet s'envoie par courrier électronique, à l'adresse publiée par le bailleur. Vérifiez le format exigé — un seul PDF, ou des pièces séparées et nommées : c'est souvent éliminatoire."
},

depot_par_courrier: {
forme: "voie",
libelle: "Dépôt par la poste",
explication: "Il n'y a pas de dépôt en ligne : le dossier part par la poste ou par transporteur. C'est la date de RÉCEPTION qui compte, pas celle de l'envoi — comptez les délais largement, et gardez une preuve d'expédition."
},

experience_pro_2ans: {
forme: "condition",
libelle: "Deux ans d'expérience professionnelle",
explication: "Le programme demande au moins deux années d'expérience professionnelle après le diplôme. C'est une condition d'éligibilité, pas un critère de préférence."
},

// LOT 108 (2026-09-26) — DEUX CONDITIONS QUI FERMENT LA BOURSE À QUI
// PART DE CHEZ LUI. L'audit du diagnostic l'a mesuré : la bourse JASSO
// (déjà inscrit au Japon) sortait pour 54 profils sur 72, Vanier (déjà
// doctorant au Canada) pour 16, le mémoire Zeno Karl Schindler (déjà en
// master) pour 24 candidats qui n'ont que leur licence. Le moteur lit
// désormais ces deux codes comme des filtres durs
// (js/recommend-programs.js, accesDepuisLeProfil).

deja_inscrit_sur_place: {
forme: "condition",
libelle: "Réservée aux étudiants déjà inscrits sur place",
explication: "Cette bourse ne se demande pas depuis votre pays : il faut déjà être inscrit dans un établissement du pays d'accueil. Elle vous concernera une fois sur place, pas pour partir."
},

cycle_en_cours: {
forme: "condition",
libelle: "Réservée aux étudiants déjà engagés dans ce cycle",
explication: "Il faut déjà être inscrit dans le cycle financé (en master pour un mémoire, en doctorat pour une recherche) : elle ne finance pas l'entrée dans ce cycle."
},

diplome_recent: {
forme: "condition",
libelle: "Diplôme récent exigé",
explication: "Le programme limite l'ancienneté du dernier diplôme. Vérifiez la borne exacte sur le portail officiel avant d'engager un dossier."
},

projet_recherche: {
forme: "piece",
libelle: "Projet de recherche",
explication: "Un projet de recherche rédigé est attendu au dépôt. C'est la pièce la plus longue à produire : commencez par elle."
},

directeur_these: {
forme: "piece",
libelle: "Directeur de thèse identifié",
explication: "Un encadrant doit avoir accepté de vous suivre avant le dépôt. Prenez contact plusieurs mois à l'avance — un accord écrit est souvent demandé."
},

lettres_recommandation: {
forme: "dossier",
libelle: "Lettres de recommandation",
explication: "Des lettres de recommandation sont demandées. Sollicitez vos référents tôt : ce sont eux qui fixent leur propre rythme.",
typeChecklist: "recommendation"
},

certification_langue_requise: {
forme: "dossier",
libelle: "Certification de langue",
explication: "Un test de langue officiel est exigé. Comptez le délai d'inscription ET celui des résultats avant la date limite.",
typeChecklist: "language_test"
}

};

/** L'ordre d'affichage des formes — du plus structurant au plus détaillé. */
export const ORDRE_FORMES = ["voie", "ordre", "condition", "piece", "dossier"];

/**
* Les codes exploitables d'une bourse.
*
* @param {Object} bourse - document `scholarships`
* @returns {string[]} vide quand le champ est absent, vide, ou ne
* contient que des codes inconnus. Un tableau vide veut dire « rien à
* afficher » — JAMAIS « aucune exigence ».
*/
export function lireExigences(bourse) {

const brut = bourse && bourse.exigences;

if (!Array.isArray(brut)) return [];

// Les codes inconnus disparaissent ici, une fois pour toutes : aucun
// appelant n'a à se demander s'il peut afficher ce qu'il reçoit.
// Le dédoublonnage protège d'une saisie en double dans l'admin.
const vus = new Set();

return brut.filter((code) => {
if (typeof code !== "string") return false;
if (!EXIGENCES[code]) return false;
if (vus.has(code)) return false;
vus.add(code);
return true;
});

}

/**
* Les codes rangés par forme, chacun avec son libellé et son explication.
*
* @param {string[]} codes - sortie de lireExigences()
* @returns {{voie:Array, ordre:Array, condition:Array, piece:Array, dossier:Array}}
* Chaque entrée : { code, libelle, explication, typeChecklist? }
*/
export function groupees(codes) {

const sortie = { voie: [], ordre: [], condition: [], piece: [], dossier: [] };

for (const code of Array.isArray(codes) ? codes : []) {

const meta = EXIGENCES[code];
if (!meta) continue;

sortie[meta.forme].push({ code, ...meta });

}

return sortie;

}

/**
* COMBIEN DE BOURSES PAR FORME, ET PAR CODE.
*
* L'en-tête de ce fichier portait ces comptes en dur (« 27 bourses »,
* « 56 bourses »…). Ils étaient justes le jour où ils ont été écrits, et
* chaque lot de données les a rendus un peu plus faux sans que personne
* ne les corrige. Un chiffre qu'on ne recalcule pas est un chiffre qui
* mentira : celui-ci se recalcule.
*
* @param {Array<Object>} bourses - documents `scholarships`
* @returns {{parForme:Object, parCode:Object, avecChamp:number, total:number}}
*          `avecChamp` compte les bourses qui portent au moins un code
*          exploitable — les autres ne sont pas « sans exigences », elles
*          sont INCONNUES (règle des trois valeurs, voir plus haut).
*/
export function bilanExigences(bourses = []) {

const parForme = { voie: 0, ordre: 0, condition: 0, piece: 0, dossier: 0 };
const parCode = {};
let avecChamp = 0;

const liste = Array.isArray(bourses) ? bourses : [];

for (const bourse of liste) {

const codes = lireExigences(bourse);

if (!codes.length) continue;

avecChamp++;

const vues = new Set();

for (const code of codes) {
parCode[code] = (parCode[code] || 0) + 1;
// Une bourse qui porte deux codes de la même forme ne compte
// qu'une fois pour cette forme : on compte des BOURSES, pas des
// codes — sinon « 56 bourses » voudrait dire autre chose selon la
// ligne qu'on lit.
const forme = EXIGENCES[code].forme;
if (!vues.has(forme)) { parForme[forme]++; vues.add(forme); }
}

}

return { parForme, parCode, avecChamp, total: liste.length };

}

/**
* Les seuls codes qui deviennent des éléments de la checklist existante
* (applications.js : recommendation / language_test / financial_proof).
*
* Ils sont SUGGÉRÉS, jamais écrits : le dossier appartient à l'étudiant,
* même doctrine que la date limite de la passe 1. C'est son clic qui
* écrit.
*
* @returns {Array<{label:string, type:string, code:string}>}
*/
export function elementsDeDossier(codes) {

return groupees(codes).dossier.map((e) => ({
label: e.libelle,
type: e.typeChecklist,
code: e.code
}));

}

/**
* Ce qui manque encore au dossier de l'étudiant, parmi ce que la bourse
* demande. Un type déjà présent dans la checklist n'est jamais proposé
* deux fois — le bouton ne doit ajouter que ce qui manque, et
* disparaître quand il n'y a plus rien à ajouter.
*
* @param {string[]} codes - sortie de lireExigences()
* @param {Array} checklist - `app.checklist`, tel qu'il est en base
*/
export function elementsAAjouter(codes, checklist) {

const dejaLa = new Set(
(Array.isArray(checklist) ? checklist : [])
.map((item) => item && item.type)
.filter(Boolean)
);

return elementsDeDossier(codes).filter((e) => !dejaLa.has(e.type));

}

/**
* Vrai quand l'étudiant NE DÉPOSE PAS lui-même. C'est la question la
* plus utile que ce module sache répondre : elle change la nature même
* de ce qu'il doit surveiller.
*/
//
// LA FORME NE SUFFIT PLUS À RÉPONDRE (corrigé le 2026-09-14).
//
// Cette fonction rendait « un code de forme voie existe ». C'était juste
// tant que les cinq codes de cette forme décrivaient tous une
// nomination par un tiers. Les deux codes ajoutés le 2026-09-14
// (courriel, poste) sont des voies de dépôt où l'étudiant dépose
// LUI-MÊME : sans cette liste explicite, un candidat de la bourse
// FAO-Hongrie aurait lu « Vous ne déposez pas vous-même », et
// `applications.js` lui aurait demandé l'accusé de réception de
// quelqu'un d'autre au lieu de sa propre preuve d'envoi.
//
// Les deux ensembles ci-dessous doivent couvrir la forme « voie » en
// entier : un test le vérifie, pour qu'un code ajouté demain doive être
// rangé d'un côté ou de l'autre au lieu de tomber dans le mauvais par
// défaut.

/** Les voies où QUELQU'UN D'AUTRE présente le dossier. */
export const VOIES_PAR_UN_TIERS = Object.freeze([
"candidature_via_etablissement",
"candidature_via_ambassade",
"nomination_autorite_nationale",
"nomination_par_ecole"
]);

/** Les voies où l'étudiant dépose lui-même, mais hors portail. */
export const VOIES_PAR_SOI_MEME = Object.freeze([
"depot_par_courriel",
"depot_par_courrier"
]);

export function deposeParUnTiers(codes) {
const liste = Array.isArray(codes) ? codes : [];
return liste.some((code) => VOIES_PAR_UN_TIERS.includes(code));
}

/**
* L'étudiant dépose lui-même, mais pas sur un portail.
* @returns {Array<{code:string, libelle:string, explication:string}>}
*/
export function voiesHorsPortail(codes) {
return groupees(codes).voie.filter((v) => VOIES_PAR_SOI_MEME.includes(v.code));
}
