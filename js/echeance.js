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
