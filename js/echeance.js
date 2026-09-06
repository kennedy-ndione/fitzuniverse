/**
* ============================================================
* Fitz — lire une échéance dans la prose du catalogue
* ============================================================
*
* LE PROBLÈME QUE CE FICHIER RÉSOUT
* ---------------------------------
* Le champ `deadline` des documents "programs" est du texte libre,
* écrit à la main lors de la vérification de chaque bourse. Il dit
* parfois une date nette :
*
*     "15 février 2027"
*     "6 octobre 2026, 11h00 UTC (candidature 2027-2028)"
*
* et parfois, honnêtement, qu'il n'y a pas de date :
*
*     "À confirmer selon l'année académique"
*     "GKS-U (Licence) : prochaine fenêtre estimée septembre 2026 —
*      GKS-G (Master/Doctorat) : estimée février-mars 2027, aucune
*      date confirmée"
*
* Cette prose est un ACQUIS, pas un défaut : elle dit la vérité, y
* compris quand la vérité est « on ne sait pas ». Aucune migration ne
* doit l'écraser, et ce module n'écrit rien : il LIT, au moment de
* l'affichage, et rend une structure exploitable.
*
* CE QUI EST INTERDIT ICI
* -----------------------
* Inventer une date. Quand la lecture est incertaine, la fonction
* rend `etat:"inconnue"` en conservant le texte d'origine — jamais une
* date approchée. Un étudiant qui rate une candidature parce que le
* site a « deviné » le 15 mars au lieu du 5 aurait perdu une année.
* C'est la seule règle non négociable de ce fichier.
*
* POURQUOI À LA LECTURE, ET PAS EN MIGRATION
* ------------------------------------------
* Une migration Firestore aurait été le geste naturel. Elle a deux
* défauts : elle touche 159 documents avant d'avoir montré le moindre
* résultat, et elle fige une interprétation. Lire à l'affichage ne
* touche rien, marche dès aujourd'hui sur la base telle qu'elle est,
* et laisse la migration devenir ce qu'elle doit être — une manière de
* rendre durable une lecture déjà éprouvée, avec sa date de
* vérification et sa source.
*
* Aucun import : ce module est testable sous Node sans DOM ni réseau.
* ============================================================
*/

/* ------------------------------------------------------------------
* 1. Vocabulaire des dates françaises
* ------------------------------------------------------------------ */

const MOIS = {
janvier: 0, "février": 1, fevrier: 1, mars: 2, avril: 3, mai: 4,
juin: 5, juillet: 6, "août": 7, aout: 7, septembre: 8,
octobre: 9, novembre: 10, "décembre": 11, decembre: 11
};

/** Retire les accents pour comparer des mots-clés sans piège. */
function sansAccent(texte) {
return texte.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

/* ------------------------------------------------------------------
* 2. Les marqueurs qui décident de l'état AVANT toute lecture de date
* ------------------------------------------------------------------
* L'ordre compte. « Cycle 2025-2026 clos le 31 mars 2026 — prochaine
* fenêtre estimée février-mars 2027 » contient une date parfaitement
* lisible (31 mars 2026) qui serait fausse à afficher : c'est la date
* de FERMETURE du cycle précédent. Le marqueur « clos » doit donc
* l'emporter sur la présence d'une date.
*/

/** Le cycle est terminé — la date présente est celle de la clôture passée. */
const MARQUEURS_CLOS = [
"ferme pour ce cycle", "fermee", "ferme,", "clos", "close pour",
"appel 2026-2027 clos", "cycle 2025-2026 clos"
];

/** Pas de date limite : on candidate au fil de l'eau. */
const MARQUEURS_CONTINUS = [
"continu", "au fil de l'eau", "candidatures continues"
];

/** Une date est évoquée mais explicitement non garantie. */
const MARQUEURS_INCERTAINS = [
"a confirmer", "estimee", "estime", "non encore annoncee",
"non datee", "non confirmee", "a verifier", "variable",
"prochaine fenetre", "publiee ensuite", "deadline par pays"
];

function contient(texteNormalise, marqueurs) {
return marqueurs.some((m) => texteNormalise.includes(m));
}

/* ------------------------------------------------------------------
* 3. Lecture d'une date
* ------------------------------------------------------------------ */

// « 15 février 2027 », « 1er décembre 2026 », « 6 octobre 2026 »
const RE_DATE = /(\d{1,2})\s*(?:er)?\s+([a-zA-ZéûôàèÉÛÔÀÈ]+)\s+(\d{4})/g;

// « 11h00 », « 12h00 », « 13h »
const RE_HEURE = /(\d{1,2})\s*h\s*(\d{2})?/i;

// « UTC », « heure Pacifique », « heure de Paris »
const RE_FUSEAU = /\b(UTC|GMT)\b|heure\s+(?:du\s+)?([A-Za-zéèêàû-]+)/i;

/** @returns {{date:string, mois:number}|null} */
function lireDate(fragment) {

const jour = Number(fragment[1]);
const nomMois = sansAccent(fragment[2]);
const annee = Number(fragment[3]);

// Les clés de MOIS portent des accents ; on compare sans.
const mois = Object.keys(MOIS).find((k) => sansAccent(k) === nomMois);

if (mois === undefined) return null;
if (jour < 1 || jour > 31) return null;

const index = MOIS[mois];

// Vérifie que la date existe réellement : « 31 février » doit
// échouer plutôt que devenir le 3 mars.
const d = new Date(Date.UTC(annee, index, jour));
if (d.getUTCMonth() !== index || d.getUTCDate() !== jour) return null;

return {
date: `${annee}-${String(index + 1).padStart(2, "0")}-${String(jour).padStart(2, "0")}`
};

}

/* ------------------------------------------------------------------
* 4. L'analyse
* ------------------------------------------------------------------ */

/**
* Lit une chaîne `deadline` du catalogue et rend une échéance
* structurée. N'invente jamais : en cas de doute, `etat:"inconnue"`.
*
* @param {string} texte - le champ deadline, tel qu'il est en base
* @returns {{
*   etat: "datee"|"close"|"continue"|"inconnue",
*   date: string|null,        // ISO "AAAA-MM-JJ"
*   heure: string|null,       // "11:00"
*   fuseau: string|null,      // "UTC"
*   confiance: "haute"|"moyenne",
*   texte: string             // la prose d'origine, intacte
* }}
*/
export function analyserEcheance(texte) {

const brut = typeof texte === "string" ? texte.trim() : "";

const vide = {
etat: "inconnue", date: null, heure: null, fuseau: null,
confiance: "haute", texte: brut
};

if (!brut) return vide;

const n = sansAccent(brut);

// --- 4.1 Les marqueurs l'emportent sur les dates présentes ---

if (contient(n, MARQUEURS_CLOS)) {
return { ...vide, etat: "close" };
}

if (contient(n, MARQUEURS_CONTINUS)) {
return { ...vide, etat: "continue" };
}

// --- 4.2 Lecture des dates ---

RE_DATE.lastIndex = 0;
const trouvees = [];
let m;
while ((m = RE_DATE.exec(brut)) !== null) {
const lue = lireDate(m);
if (lue) trouvees.push(lue.date);
}

// Aucune date lisible : on rend la prose telle quelle.
if (trouvees.length === 0) return vide;

// Une date est là, mais le texte dit lui-même qu'elle n'est pas
// ferme. On refuse de la présenter comme une échéance.
if (contient(n, MARQUEURS_INCERTAINS)) {
return { ...vide, etat: "inconnue" };
}

// --- 4.3 Choix de la date quand il y en a plusieurs ---
//
// « Inscription dès le 20 août 2026, 1ère étape jusqu'au 1er
// novembre 2026 » : ce qui compte pour l'étudiant est la date où
// ça FERME, pas celle où ça ouvre. « jusqu'au » la désigne.

let date = trouvees[0];
let confiance = trouvees.length === 1 ? "haute" : "moyenne";

const jusquAu = brut.match(/jusqu'au\s+(\d{1,2})\s*(?:er)?\s+([a-zA-ZéûôàèÉÛÔÀÈ]+)\s+(\d{4})/i);
if (jusquAu) {
const lue = lireDate(jusquAu);
if (lue) { date = lue.date; confiance = "moyenne"; }
}

// --- 4.4 Heure et fuseau ---

const heureBrute = brut.match(RE_HEURE);
const heure = heureBrute
? `${String(Number(heureBrute[1])).padStart(2, "0")}:${heureBrute[2] || "00"}`
: null;

const fuseauBrut = brut.match(RE_FUSEAU);
const fuseau = fuseauBrut ? (fuseauBrut[1] || fuseauBrut[2] || null) : null;

return { etat: "datee", date, heure, fuseau, confiance, texte: brut };

}

/* ------------------------------------------------------------------
* 5. Du structuré à l'affichage
* ------------------------------------------------------------------ */

/** Minuit UTC du jour donné — pour compter des jours, pas des heures. */
function minuit(d) {
return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

/**
* @param {Object} echeance - sortie d'analyserEcheance()
* @param {Date} [aujourdhui]
* @returns {number|null} jours pleins restants, négatif si dépassée
*/
export function joursAvant(echeance, aujourdhui = new Date()) {

if (!echeance || echeance.etat !== "datee" || !echeance.date) return null;

const cible = new Date(`${echeance.date}T00:00:00Z`);

return Math.round((minuit(cible) - minuit(aujourdhui)) / 86400000);

}

/**
* Seuils DÉLIBÉRÉMENT différents de ceux de js/next-action.js
* (3 et 14 jours), et il ne faut pas les aligner.
*
* Là-bas, on parle à un étudiant qui a déjà un dossier en cours : sa
* prochaine étape est une tâche de quelques heures, « urgent » veut
* donc dire trois jours. Ici, on parle à un visiteur qui n'a rien
* commencé : pour lui, une bourse qui ferme dans dix jours est déjà
* hors d'atteinte s'il lui faut un test de langue, et une bourse à
* deux mois mérite qu'il s'y mette maintenant.
*
* Même mot, deux horizons. Les confondre afficherait « tranquille »
* à quelqu'un qui n'a en réalité plus le temps.
*/
export const JOURS_CRITIQUE = 14;
export const JOURS_PROCHE = 60;

/**
* @returns {"critique"|"proche"|"ouverte"|"close"|"continue"|"inconnue"}
*/
export function etatAffichable(echeance, aujourdhui = new Date()) {

if (!echeance) return "inconnue";
if (echeance.etat === "close") return "close";
if (echeance.etat === "continue") return "continue";
if (echeance.etat !== "datee") return "inconnue";

const j = joursAvant(echeance, aujourdhui);

if (j === null) return "inconnue";
if (j < 0) return "close";
if (j <= JOURS_CRITIQUE) return "critique";
if (j <= JOURS_PROCHE) return "proche";

return "ouverte";

}

const MOIS_LONGS = [
"janvier", "février", "mars", "avril", "mai", "juin",
"juillet", "août", "septembre", "octobre", "novembre", "décembre"
];

/** « 6 octobre 2026 », « 1er décembre 2026 ». */
export function formaterDate(iso) {

if (!iso) return "";

const [a, m, j] = iso.split("-").map(Number);
const jour = j === 1 ? "1er" : String(j);

return `${jour} ${MOIS_LONGS[m - 1]} ${a}`;

}

/**
* La phrase de décompte affichée sur une carte.
* @returns {{ton:string, chiffre:string, texte:string, titre:string}}
*/
export function libelleEcheance(echeance, aujourdhui = new Date()) {

const etat = etatAffichable(echeance, aujourdhui);
const titreDate = echeance && echeance.date
? `Clôture le ${formaterDate(echeance.date)}${echeance.heure ? `, ${echeance.heure.replace(":", "h")}` : ""}${echeance.fuseau ? ` ${echeance.fuseau}` : ""}`
: (echeance ? echeance.texte : "");

if (etat === "close") return { ton: "close", chiffre: "", texte: "Clôturée", titre: titreDate };
if (etat === "continue") return { ton: "continue", chiffre: "", texte: "Sans date limite", titre: titreDate };
if (etat === "inconnue") return { ton: "inconnue", chiffre: "", texte: "Date à confirmer", titre: titreDate };

const j = joursAvant(echeance, aujourdhui);

if (j === 0) return { ton: "critique", chiffre: "", texte: "Dernier jour", titre: titreDate };
if (j === 1) return { ton: "critique", chiffre: "1", texte: "jour restant", titre: titreDate };

return {
ton: etat === "critique" ? "critique" : etat === "proche" ? "proche" : "calme",
chiffre: String(j),
texte: "jours restants",
titre: titreDate
};

}

/* ------------------------------------------------------------------
* 6. Le classement
* ------------------------------------------------------------------
* Consigne de Charles, 27 août 2026 : « il faut toujours mettre en
* avant les opportunités qui attirent les étudiants africains et
* internationaux ».
*
* Traduit en règle : une bourse explicitement ouverte — ou réservée —
* aux ressortissants africains passe devant, et une couverture totale
* passe devant une couverture partielle.
*
* POURQUOI L'URGENCE NE DOMINE PAS
* --------------------------------
* Le réflexe serait de faire remonter d'abord ce qui ferme le plus
* tôt, puisque c'est ce qu'on perd. J'ai écrit le classement comme ça,
* puis un test l'a mis en défaut, et le test avait tort.
*
* Une bourse qui ferme dans quatre jours n'est pas une opportunité
* pour quelqu'un qui découvre le site : sans test de langue, sans
* traductions et sans lettres de recommandation, personne ne dépose un
* dossier DAAD en quatre jours. La montrer en premier ne fait pas
* gagner une candidature, elle fait rater une visite.
*
* Le palier vraiment utile est donc « proche » — entre deux semaines
* et deux mois — parce que c'est la seule fenêtre où un étudiant peut
* encore tout faire. « Critique » vient juste après : c'est une
* information honnête à donner, pas une invitation à foncer.
*/

/** Une opportunité dont la couverture cite l'Afrique ou les PMA. */
const RE_AFRIQUE = /afric|afrique|pays en developpement|mastercard foundation/;

/** Couverture intégrale, quelle que soit la formulation employée. */
const RE_TOTALE = /100\s*%|couverture complete|integralite|bourse gouvernementale complete/;

/**
* @param {{couverture?:string, echeance:Object}} opp
* @returns {number} plus haut = mis en avant
*/
export function scoreOpportunite(opp, aujourdhui = new Date()) {

const etat = etatAffichable(opp.echeance, aujourdhui);

// Une échéance dépassée ne remonte jamais, quoi qu'elle couvre.
if (etat === "close") return -1000;

const couv = sansAccent(opp.couverture || "");

let score = 0;

// Pertinence pour le public de Fitz — le critère demandé.
if (RE_AFRIQUE.test(couv)) score += 60;
if (RE_TOTALE.test(couv)) score += 35;

// Urgence : le sommet est « proche », pas « critique ». Voir le
// commentaire de section — une échéance à quatre jours est une
// information, pas une opportunité pour qui arrive aujourd'hui.
if (etat === "proche") score += 34;
else if (etat === "critique") score += 26;
else if (etat === "ouverte") score += 14;
else if (etat === "continue") score += 10;
else score += 0;               // date inconnue : présent, mais après

return score;

}

/**
* Trie une liste d'opportunités pour l'affichage public.
* Ne modifie pas le tableau reçu.
*/
export function classerOpportunites(liste, aujourdhui = new Date()) {

return [...liste].sort((a, b) => {

const ecart = scoreOpportunite(b, aujourdhui) - scoreOpportunite(a, aujourdhui);
if (ecart !== 0) return ecart;

// À score égal, la plus proche de sa clôture d'abord.
const ja = joursAvant(a.echeance, aujourdhui);
const jb = joursAvant(b.echeance, aujourdhui);

if (ja === null && jb === null) return 0;
if (ja === null) return 1;
if (jb === null) return -1;

return ja - jb;

});

}

/**
* Ne garde que ce qu'on peut montrer sans mentir : une échéance datée
* et encore ouverte, ou une candidature explicitement continue.
* Les dates incertaines et les cycles clos restent dans le catalogue,
* mais pas dans un bandeau qui promet « ouvert en ce moment ».
*/
export function opportunitesOuvertes(liste, aujourdhui = new Date()) {

return liste.filter((o) => {
const etat = etatAffichable(o.echeance, aujourdhui);
return etat === "critique" || etat === "proche"
|| etat === "ouverte" || etat === "continue";
});

}

/* ------------------------------------------------------------------
* 8. L'ÉTAT DE CANDIDATURE AFFICHÉ — la seule source de vérité
* ------------------------------------------------------------------
*
* Ajouté le 2026-09-05, après une mesure : sur les cartes du
* catalogue, la pastille « Candidatures ouvertes / fermées » était
* calculée sur `scholarship.isActive`, un drapeau éditorial qui n'a
* jamais voulu dire « le cycle est ouvert ». Résultat mesuré sur
* l'instantané du 2026-09-04 : **42 bourses dont le champ `status` dit
* « Fermée » s'affichaient « Candidatures ouvertes »**, et une le
* contraire. À quoi s'ajoutaient 4 bourses annoncées ouvertes dont
* l'échéance était derrière nous — dont l'Eiffel, dépassée de neuf
* mois.
*
* Un étudiant qui prépare un dossier pour une bourse close perd des
* semaines. C'est la faute la plus grave que ce site puisse commettre.
*
* L'ORDRE DE DÉCISION, ET POURQUOI IL EST DANS CET ORDRE
* -----------------------------------------------------
*  1. `actif === false` ferme. C'est le seul retrait volontaire, il
*     n'est jamais contredit.
*  2. TOUTES LES DATES LUES DÉPASSÉES FERMENT — même si le statut dit
*     « Ouverte ». C'est ici que la date prime sur la prose, et c'est
*     tout l'objet de ce module.
*  3. Une date encore À VENIR ouvre — SAUF si le statut dit que le
*     cycle est clos : on affiche alors « pas encore ouverte ».
*  4. À défaut de toute date exploitable seulement, on lit le statut.
*
* `statut` accepte UNE chaîne ou PLUSIEURS. La fiche d'une opportunité
* en passe deux — celui du programme et celui de la bourse — et il
* suffit qu'UN SEUL dise « fermée » pour que le cycle soit tenu pour
* clos. Trouvé en production le 2026-09-05 : les 33 programmes de
* Stipendium Hungaricum portent `status: "Ouverte"` pendant que la
* bourse porte « Fermée ». La carte du catalogue (qui lit la bourse)
* affichait « pas encore ouvertes » et la fiche (qui lisait le
* programme) affichait « Candidatures ouvertes · il vous reste
* 132 jours ». Le même site disait deux choses contraires du même
* dossier. Le doute penche du côté prudent : on ne promet pas un
* portail ouvert sur la foi du champ le plus optimiste.
*
* UNE DATE PROUVE QU'UN CYCLE EST FINI, JAMAIS QU'IL A COMMENCÉ
* -------------------------------------------------------------
* Première version de ce module (matin du 2026-09-05) : « une date
* encore à venir ouvre, quoi que dise le statut ». La première
* vérification réelle l'a mise en défaut le jour même.
*
* Stipendium Hungaricum — la bourse la plus exposée du catalogue,
* retenue pour 360 profils sur 360 — porte `status: "Fermée"` ET
* l'échéance « 15 janvier 2027 ». Les deux sont VRAIS : l'appel
* 2026/27 s'est clos le 15 janvier 2026, et l'appel 2027/28 n'ouvre
* qu'en novembre 2026 pour se clore le 15 janvier 2027. Une date future
* ne dit donc pas « on peut candidater », elle dit « voilà quand ça
* fermera ». Afficher « Candidatures ouvertes » envoyait l'étudiant
* vers un portail qui n'accepte rien.
*
* La règle corrigée est DISSYMÉTRIQUE, et c'est volontaire : une date
* dépassée prouve à elle seule que le cycle est fini — rien ne peut
* plus y être déposé — tandis qu'une date à venir ne prouve rien sur
* l'ouverture. Le doute penche donc du côté prudent : l'état « pas
* encore ouverte » dit la date sans promettre le portail.
*
* CE QUE CE MODULE NE FAIT JAMAIS : inventer une date, ni transformer
* « on ne sait pas » en « non ». `ouvert` vaut true, false ou **null**,
* et null n'est pas false — même règle que estEligible()
* (js/eligibility-countries.js).
*
* CHAMPS DE TRAÇABILITÉ (lot C2) : `periodeOuverture` et `verifieLe`
* sont FACULTATIFS. Tant qu'ils sont absents, l'affichage reste juste,
* simplement moins précis — il dit « prochaine ouverture non
* annoncée » au lieu de « réouverture attendue en octobre ». Aucune
* migration n'est nécessaire pour que ce fichier serve.
*/

const RE_STATUT_FERME = /^\s*(fermee|close|cloturee|suspendue)/;

/**
* LA PONCTUATION APPARTIENT À L'AFFICHAGE, PAS À LA DONNÉE (2026-09-06)
* --------------------------------------------------------------------
* 88 des 129 `periodeOuverture` du catalogue se terminent déjà par un
* point, les 41 autres non — parce qu'elles ont été écrites à la main,
* une par une, en vérifiant la bourse. C'est très bien ainsi : ce sont
* des notes, pas des fragments de phrase calibrés.
*
* Le défaut était de notre côté : `Réouverture attendue : ${periode}.`
* produisait « … bourse complète pour tous les admis.. » sur 88 fiches.
* On a donc DEUX choix : retoucher 88 documents, ou retirer la
* ponctuation finale au moment de composer la phrase. Le second est le
* bon — une migration fige une décision d'affichage dans la donnée, et
* la prochaine tournure de phrase la retrouverait de travers.
*
* Cette fonction retire ce qui traîne en fin de note (points, espaces),
* pour que l'appelant pose SON point, un seul. Elle ne touche ni aux
* points de milieu de phrase, ni aux « ... » ailleurs que tout à la fin.
*/
function phrase(texte) {
return String(texte || "").trim().replace(/[.\s]+$/, "");
}

/**
 * QUAND LA DATE N'EST PAS UNE PROPRIÉTÉ DE LA BOURSE (2026-09-05)
 * ---------------------------------------------------------------
 * Vérification du lot 38 : sur cinq grandes bourses, la date limite
 * n'appartient pas au programme de bourses mais au couple
 * (bourse, pays de l'étudiant) ou (bourse, établissement) —
 *   DAAD : une date par pays de résidence ;
 *   Eiffel : chaque établissement français fixe la sienne, et
 *     Sorbonne Université écrit noir sur blanc de ne PAS se fier à
 *     celle de Campus France ;
 *   Shanghai : dépôt université par université.
 * Afficher une date unique est structurellement faux pour un site
 * ouvert à tout étudiant où qu'il soit. `echeanceVariable` dit
 * laquelle des deux, et la page le formule au lieu d'inventer.
 */
const MENTION_VARIABLE = {
pays: "de votre pays de résidence",
etablissement: "de l'établissement choisi"
};
const RE_STATUT_OUVERT = /^\s*(ouverte|ouvert|en cours|reouverture)/;

/**
* @param {Object} entree
* @param {string|string[]} [entree.statut]   status, texte libre — une
*        chaîne, ou plusieurs (programme ET bourse) : « fermée »
*        quelque part suffit à fermer
* @param {boolean} [entree.actif]            scholarship.isActive
* @param {string[]} [entree.echeances]       les program.deadline de cette bourse
* @param {string} [entree.periodeOuverture]  « appel annuel, en février-mars »
* @param {string} [entree.verifieLe]         ISO « 2026-09-05 »
* @param {"pays"|"etablissement"} [entree.echeanceVariable] quand la
*        date limite n'est pas une propriété de la bourse
* @param {Date} [aujourdhui]
* @returns {{
*   ouvert: boolean|null, ton: "ouverte"|"attente"|"close"|"inconnue",
*   badge: string, etiquette: string, valeur: string,
*   detail: string, verifie: string, jours: number|null
* }}
*/
export function etatCandidature(entree, aujourdhui = new Date()) {

const e = entree || {};

const periode = (e.periodeOuverture || "").trim();
const verifie = e.verifieLe ? `Vérifié le ${formaterDate(e.verifieLe)}` : "";

// Un statut ou plusieurs — voir l'en-tête. « Fermée » quelque part
// ferme ; « Ouverte » ne vaut que si personne ne dit le contraire.
const statuts = [].concat(e.statut || [])
.filter((t) => typeof t === "string" && t.trim())
.map((t) => sansAccent(t.toLowerCase()));

const ditFerme = statuts.some((t) => RE_STATUT_FERME.test(t));
const ditOuvert = !ditFerme && statuts.some((t) => RE_STATUT_OUVERT.test(t));

const lues = (e.echeances || [])
.filter((t) => typeof t === "string" && t.trim())
.map((t) => analyserEcheance(t));

const ouvertes = lues.filter((ech) => {
const etat = etatAffichable(ech, aujourdhui);
return etat === "critique" || etat === "proche" || etat === "ouverte" || etat === "continue";
});

const closes = lues.filter((ech) => etatAffichable(ech, aujourdhui) === "close");

// --- 1. Le retrait volontaire ---
if (e.actif === false) {
return ferme({ lues, closes, periode, verifie, variable: MENTION_VARIABLE[e.echeanceVariable] });
}

// --- 2. Toutes les dates lues sont derrière nous : le cycle est fini ---
//
// Placé AVANT l'ouverture : une date dépassée est une PREUVE, elle
// passe donc en premier et rien ne la contredit.
if (!ouvertes.length && closes.length) {
return ferme({ lues, closes, periode, verifie, variable: MENTION_VARIABLE[e.echeanceVariable] });
}

// --- 3. Une date à venir, mais le statut dit le cycle clos ---
//
// « Pas encore ouverte » : la date est réelle, le portail ne l'est pas.
if (ouvertes.length && ditFerme) {

const datees = ouvertes
.filter((ech) => ech.etat === "datee")
.sort((a, b) => (joursAvant(a, aujourdhui) - joursAvant(b, aujourdhui)));

const prochaine = datees[0];

return {
ouvert: false, ton: "attente", jours: null,
badge: "Candidatures pas encore ouvertes",
etiquette: prochaine ? "Clôture annoncée" : "Candidatures",
valeur: prochaine ? formaterDate(prochaine.date) : "Closes",
detail: periode
? `Le cycle en cours est clos. Ouverture attendue : ${phrase(periode)}.`
: "Le cycle en cours est clos et la prochaine ouverture n'est pas annoncée. La date ci-dessus est la clôture attendue, pas l'ouverture.",
verifie
};

}

// --- 4. Une date encore à venir ouvre ---
if (ouvertes.length) {

// SAUF si la date n'appartient pas à la bourse et qu'on en agrège
// plusieurs. Vu le 2026-09-05 sur la page d'accueil : le
// Deutschlandstipendium annonçait « 25 jours restants » parce que
// l'UN de ses trois établissements (Hanovre) publie sa fenêtre —
// les deux autres ont leur propre calendrier. Une date valable
// pour une université était présentée comme celle du programme.
//
// Une seule échéance transmise = on regarde UNE fiche, et cette
// date est bien la sienne : on la garde. Plusieurs = c'est une
// vue d'ensemble (carte du catalogue, bandeau), et la seule
// réponse honnête est la mention. La date connue la plus proche
// reste dite, mais comme exemple, pas comme échéance.
const variableAgregee = MENTION_VARIABLE[e.echeanceVariable] && lues.length > 1;

if (variableAgregee) {

const datees = ouvertes
.filter((ech) => ech.etat === "datee")
.sort((a, b) => (joursAvant(a, aujourdhui) - joursAvant(b, aujourdhui)));

const exemple = datees[0]
? ` Le premier calendrier publié ferme le ${formaterDate(datees[0].date)}.`
: "";

return {
ouvert: true, ton: "ouverte", jours: null,
badge: "Candidatures ouvertes",
etiquette: "Date limite",
valeur: e.echeanceVariable === "pays" ? "Selon votre pays" : "Selon l'établissement",
detail: `La date limite dépend ${MENTION_VARIABLE[e.echeanceVariable]}${periode ? ` — ${phrase(periode)}` : ""}.${exemple}`,
verifie
};

}

// La plus proche des dates encore ouvertes : c'est celle que
// l'étudiant doit tenir.
const datees = ouvertes.filter((ech) => ech.etat === "datee");

if (!datees.length) {
return {
ouvert: true, ton: "ouverte", jours: null,
badge: "Candidatures au fil de l'eau",
etiquette: "Candidatures", valeur: "Sans date limite",
detail: phraseSeule(periode) || "Le dossier s'examine à réception, à confirmer sur le portail officiel.",
verifie
};
}

datees.sort((a, b) => (joursAvant(a, aujourdhui) - joursAvant(b, aujourdhui)));

const prochaine = datees[0];
const jours = joursAvant(prochaine, aujourdhui);

return {
ouvert: true, ton: "ouverte", jours,
badge: "Candidatures ouvertes",
etiquette: "Date limite",
valeur: formaterDate(prochaine.date),
detail: jours === 0
? "Dernier jour pour candidater."
: `Il vous reste ${jours} jour${jours > 1 ? "s" : ""}.`,
verifie
};

}

// --- 5. Aucune date exploitable : le statut, faute de mieux ---
if (ditFerme) {
return ferme({ lues, closes, periode, verifie, variable: MENTION_VARIABLE[e.echeanceVariable] });
}

if (ditOuvert) {
const variable = MENTION_VARIABLE[e.echeanceVariable];

return {
ouvert: true, ton: "ouverte", jours: null,
badge: "Candidatures ouvertes",
etiquette: "Date limite",
valeur: variable ? (e.echeanceVariable === "pays" ? "Selon votre pays" : "Selon l'établissement") : "Non publiée",
detail: variable
? `La date limite dépend ${variable}${periode ? ` — ${phrase(periode)}` : ""}. À lire sur le portail officiel avant toute démarche.`
: (phraseSeule(periode) || "Aucune date limite publiée à ce jour — à confirmer sur le portail officiel."),
verifie
};
}

return {
ouvert: null, ton: "inconnue", jours: null,
badge: "Calendrier à confirmer",
etiquette: "Date limite", valeur: "À confirmer",
detail: phraseSeule(periode) || "Le calendrier de cette bourse n'est pas publié — à confirmer sur le portail officiel.",
verifie
};

}

/**
* La période rendue SEULE — elle EST la phrase, alors elle doit se
* terminer comme une phrase.
*
* Mesure du 2026-09-06 : 9 bourses affichaient un `detail` qui s'arrêtait
* dans le vide (« … suit les trois sessions d'admission de KAIST »),
* parce que le gabarit n'ajoutait rien et que la note, écrite à la main,
* n'était pas ponctuée. phrase() retire ce qui traîne, ce point-ci
* termine — exactement ce que fait ferme() depuis le même jour.
*
* Une note déjà ponctuée ressort identique : on ne double jamais le
* point. Une note vide reste vide, pour que le `||` de l'appelant fasse
* son office.
*/
function phraseSeule(texte) {
const t = phrase(texte);
return t ? `${t}.` : "";
}

/**
* La forme fermée, factorisée : elle doit dire la MÊME chose partout,
* et surtout ne jamais présenter la date dépassée sous l'étiquette
* « Date limite » — c'est cette étiquette-là qui trompait.
*/
function ferme({ lues, closes, periode, verifie, variable }) {

const derniere = [...closes, ...lues].find((ech) => ech && ech.etat === "datee" && ech.date);

const mention = variable ? ` La date limite dépend ${variable}.` : "";

// Le point avant la mention : sans lui, « … octobre-novembre La date
// limite dépend … » se lisait d'une traite.
const suite = (periode
? `Réouverture attendue : ${phrase(periode)}.`
: "Prochaine ouverture non annoncée — à surveiller sur le portail officiel.") + mention;

if (derniere) {
return {
ouvert: false, ton: "close", jours: null,
// « Candidatures closes — prochaine session à surveiller » plutôt
// que « fermées » tout court : une bourse close n'est pas une
// bourse perdue, c'est une bourse à préparer. Le dire ferme la
// porte du mensonge sans fermer celle de l'espoir.
badge: "Candidatures closes",
etiquette: "Dernière échéance connue",
valeur: formaterDate(derniere.date),
detail: `Les candidatures de ce cycle sont closes. ${suite}`,
verifie
};
}

// La même phrase d'ouverture que la forme datée : sans elle, la
// fiche d'un cycle clos SANS date connue n'expliquait rien, elle
// enchaînait directement sur la réouverture. Les deux formes
// doivent dire la même chose.
return {
ouvert: false, ton: "close", jours: null,
badge: "Candidatures closes",
etiquette: "Candidatures", valeur: "Closes",
detail: `Les candidatures de ce cycle sont closes. ${suite}`,
verifie
};

}
