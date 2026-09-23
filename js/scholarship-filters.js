/**
* ============================================================
* Fitz — filtres dérivés du catalogue (financement, classement)
* ============================================================
*
* Même principe que js/echeance.js : les champs `funding` et `ranking`
* du catalogue sont du texte libre écrit par un humain ("100 % (scolarité
* + logement + voyage)", "Partielle (jusqu'à 19 000 €/an)", "#45 mondial
* (QS)", "Grande université francophone de Belgique"...). Ce module LIT
* ce texte à l'affichage pour en tirer un critère de tri ; il ne modifie
* aucun document Firestore et n'invente jamais une valeur que le texte
* ne garantit pas.
*
* Sert le quiz d'accueil (index.html, #pathQuiz) et le filtrage de
* scholarships.js — les deux passent par les mêmes fonctions plutôt que
* par deux lectures différentes du même champ.
* ============================================================
*/

/**
* Financement intégral
* ---------------------
* Vérifié à la main contre les 20 valeurs RÉELLES de `funding` présentes
* dans admin/expand-catalog-batch1..5.js (voir test/scholarship-filters.test.mjs,
* qui les reprend mot pour mot).
*
* Les marqueurs d'EXCLUSION sont vérifiés EN PREMIER, avant les
* marqueurs positifs — même ordre de priorité que MARQUEURS_CLOS dans
* js/echeance.js, et pour la même raison : un texte peut contenir à la
* fois un mot qui ressemble à une couverture totale ET une réserve qui
* l'annule, et la réserve doit gagner.
*
* Exemple réel qui justifie cet ordre : "scolarité publique marocaine
* déjà QUASI gratuite" — "gratuite" apparaît bien dans la phrase, mais
* "quasi" dit explicitement que ce n'est pas le cas. Sans la priorité
* aux exclusions, ce texte serait classé "financement intégral" à
* cause d'un seul mot, alors que la phrase entière dit le contraire.
*
* Ce que ça exclut volontairement : le MEXT japonais ("...assurance
* santé NON couverte") n'est PAS classé comme financement intégral ici,
* alors qu'il est mondialement connu comme une bourse complète — parce
* que le texte du catalogue signale lui-même une charge non couverte.
* Le filtre sert à ORIENTER vers une liste, pas à trancher à la place
* de l'étudiant : la fiche complète, avec son texte réel, reste
* affichée sur chaque carte quel que soit le résultat de ce filtre.
*/
const MARQUEURS_FINANCEMENT_EXCLUS = [
/non\s+couvert/i,
/non\s+compris/i,
/non\s+inclus/i,
/non\s+pris\s+en\s+charge/i,
/non\s+quantifié/i,
/quasi/i,
/variable/i
];

const MARQUEURS_FINANCEMENT_INTEGRAL = [
/100\s?%/,
/scolarité\s+gratuite/i,
/intégralement\s+pris\s+en\s+charge/i
];

export function estFinancementIntegral(texte) {

const t = texte || "";

if (MARQUEURS_FINANCEMENT_EXCLUS.some((re) => re.test(t))) return false;

return MARQUEURS_FINANCEMENT_INTEGRAL.some((re) => re.test(t));

}

/**
* Classement mondial (QS)
* ------------------------
* `ranking` n'est un rang QS que pour une partie du catalogue — l'autre
* partie porte une description sans numéro ("Université de référence
* en agriculture et sciences de la vie"). extraireRangQS() renvoie
* `null` dans ce cas plutôt que d'inventer un rang : ces universités
* sont retirées du filtre "classement", jamais classées par défaut au
* dernier rang ou à un rang moyen.
*
* Sur un intervalle ("#711-720 mondial (QS)"), on retient la première
* valeur (la plus favorable) : au-delà de quelques centaines de rangs,
* l'écart entre les deux bornes ne change de toute façon jamais le
* résultat d'un seuil de type "top 200".
*/
export function extraireRangQS(texte) {

const m = /#\s*(\d+)/.exec(texte || "");

return m ? parseInt(m[1], 10) : null;

}

/**
* Meilleur rang QS parmi les universités liées à une bourse (voir
* enrichWithProgramData() dans scholarships.js, qui choisit déjà de la
* même façon la photo et le drapeau les plus pertinents). Une bourse
* reliée à plusieurs universités est aussi bonne que sa meilleure porte
* d'entrée pour ce critère.
*/
export function meilleurRangQS(universites) {

const rangs = (universites || [])
.map((u) => extraireRangQS(u.ranking))
.filter((r) => r !== null);

return rangs.length ? Math.min(...rangs) : null;

}

/**
* Type de bourse (bailleur)
* --------------------------
* `funder` est un énuméré à 5 valeurs exactes ("gouvernement" |
* "universite" | "region" | "organisation" | "entreprise"), saisi dans
* admin/scholarships.html — ou ABSENT. Même règle des trois valeurs que
* `estEligible` (js/eligibility-countries.js) : un champ absent est un
* INCONNU, jamais une valeur par défaut. On ne déduit jamais le bailleur
* du titre, du pays ou de la description, et on n'affiche jamais
* « bailleur non renseigné » — on n'affiche rien.
*/
export const LIBELLES_FUNDER = {
gouvernement: "Gouvernement",
universite: "Université",
region: "Région ou collectivité",
organisation: "Organisation",
entreprise: "Entreprise"
};

// "" quand le champ est absent ou hors énuméré : l'appelant n'affiche
// alors RIEN (jamais de libellé deviné, jamais de valeur par défaut).
export function libelleFunder(funder) {

return LIBELLES_FUNDER[funder] || "";

}

// Filtre exact sur `funder`. Sans type choisi ("" — « Tous les types »),
// tout passe, y compris les bourses SANS champ ; un type précis ne
// retient que les bourses portant EXACTEMENT cette valeur — une bourse
// sans champ (inconnu) en est retirée, jamais reclassée dans un type.
export function correspondTypeBourse(funder, filtre) {

if (!filtre) return true;

return funder === filtre;

}

/**
* Première phrase du financement (lot 74, 2026-09-22)
* ---------------------------------------------------
* La puce ambrée de la carte affichait `${funding} financé` : pensée
* pour des valeurs courtes (« 100 % »), elle recevait en réalité des
* paragraphes entiers, coupés à 3 lignes par un line-clamp. L'étudiant
* lisait « … » au milieu d'un montant.
*
* Depuis le lot 74, chaque `funding` COMMENCE par une phrase qui se
* comprend seule et tient en 70 caractères (« Bourse complète. »,
* « 1 000 € par mois, versés en lei roumains. »). La carte affiche
* cette phrase-là, en entier, sans point final ; la fiche garde le
* texte complet. Le découpage est le même que celui du contrôle de
* rédaction : fin de phrase = « . », « ! » ou « ? » suivi d'un espace
* (ou de la fin du texte). Un texte d'une seule phrase ressort entier.
*
* Pas de lookbehind (?<=…) ici : SyntaxError sur Safari avant iOS 16.4,
* et c'est le module entier qui tomberait (test « flou 3 »). Le
* lookahead (?=…), lui, est lu partout.
*/
export function premierePhrase(texte) {
const t = String(texte || "").trim();
if (!t) return "";
const m = t.match(/^[\s\S]*?[.!?](?=\s|$)/);
const premiere = (m ? m[0] : t).trim();
return premiere.replace(/\.$/, "");
}
