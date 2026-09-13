/**
* ============================================================
* Fitz — ce qu'une université coûte, et ce qu'on en sait
* ============================================================
*
* LE PROBLÈME QUE CE FICHIER RÉSOUT (lot D1 du chantier préinscription,
* 2026-09-07)
* --------------------------------------------------------------------
* Une préinscription est une admission que l'étudiant FINANCE lui-même.
* Le prix est donc la première information qui décide s'il clique — et
* le catalogue n'en disait rien. Ce lot pose le contenant : deux champs
* sur `universities` (`fraisScolarite`, `exoneration`), ce module qui
* les lit, et un affichage honnête. Les données viennent au lot D2.
*
* LA RÈGLE DES TROIS VALEURS, ENCORE
* -----------------------------------
* Champ absent ≠ zéro ≠ inconnu. Une université sans `fraisScolarite`
* n'affiche RIEN sur le prix : jamais une estimation, jamais un « 0 »
* qui viendrait d'un champ vide. Un montant n'est affiché QUE s'il est
* SOURCÉ (une URL officielle) et DATÉ (`verifieLe`) : sans l'un des
* deux, l'état est « inconnu », même si le chiffre est là. Même doctrine
* que estEligible(), etatCandidature() et lireExigences().
*
* Et dans l'autre sens (D1-bis) : la règle n'est pas « ne jamais parler
* de gratuité », c'est « ne jamais AFFIRMER une gratuité non vérifiée,
* et toujours la dire quand elle l'est ». Un zéro vérifié et sourcé —
* l'université publique allemande, exactement — est l'information la
* plus favorable du catalogue : il se lit « Gratuit », pas « 0 €/an »,
* qu'un étudiant prendrait pour une donnée manquante.
*
* Devise stockée telle qu'elle est facturée (EUR pour la France).
* Aucune conversion FCFA — décision fermée, hors périmètre.
*
* Aucun DOM, aucun Firestore : testable sous Node.
* ============================================================
*/

import { formaterDate } from "./echeance.js";

/** Le vocabulaire fermé des politiques d'exonération. */
export const POLITIQUES_EXONERATION = [
"systematique",       // l'établissement exonère par défaut
"possible_plafonnee", // exonération possible, contingentée
"aucune",             // pas d'exonération
"inconnue"            // on ne sait pas — la valeur par défaut honnête
];

export const LIBELLES_EXONERATION = {
systematique: "Exonération des frais par défaut",
possible_plafonnee: "Exonération possible, places limitées",
aucune: "Pas d'exonération des frais",
inconnue: "Exonération non vérifiée"
};

/**
* Seuils de bande, PAR DEVISE. Pour l'euro : arrêtés lors de l'audit
* « Hubs », gratuit de 0 à 500 €/an, peu cher jusqu'à ~2 500 €/an.
*
* Une devise ABSENTE de ce tableau -> bande « inconnu », et c'est
* voulu : le seuil se pose à la main, une fois, avec une source — jamais
* recalculé à la volée depuis un taux de change.
*
* CE QUE LE SEUIL JUGE (précisé au lot SEUILS-DEVISES, 2026-09-12).
* « Abordable » ne parle pas du coût de la vie dans le pays d'accueil :
* il parle du PORTEFEUILLE DE L'ÉTUDIANT — une famille de Dakar, d'Abidjan
* ou de Douala — devant un droit d'inscription. Ce portefeuille est le
* même que l'établissement facture en francs suisses ou en wons. Les
* seuils des autres devises sont donc les MÊMES 500 € et 2 500 €, écrits
* dans la devise facturée : convertis UNE FOIS, à la main, au taux de
* référence de la BCE du 11 septembre 2026 (1 € = 1,1592 USD, 0,85815 GBP,
* 0,9451 CHF, 1,6064 CAD, 178,56 JPY, 1 556,56 KRW, 7,7762 CNY — source :
* ecb.europa.eu, taux de référence quotidiens), puis ARRONDIS à un chiffre
* rond. C'est un jugement figé avec sa source et sa date, pas un calcul :
* si un taux bouge de 10 %, la bande d'aucune université du catalogue ne
* change (le plus proche d'un seuil est Pavia à 390 €, en euros). À
* revoir seulement si l'euro décroche durablement contre une devise.
*
* Devises à venir avec leurs universités (MAD, TRY, XOF…) : même méthode,
* même source, une ligne chacune.
*/
export const SEUILS_PAR_DEVISE = {
EUR: { gratuit: 500, abordable: 2500 },
USD: { gratuit: 600, abordable: 3000 },
GBP: { gratuit: 450, abordable: 2200 },
CHF: { gratuit: 500, abordable: 2400 },
CAD: { gratuit: 800, abordable: 4000 },
JPY: { gratuit: 90000, abordable: 450000 },
KRW: { gratuit: 800000, abordable: 4000000 },
CNY: { gratuit: 4000, abordable: 20000 },
// Rand, dirham, livre turque, rouble : ajoutés avec les lots 53 et 54.
// Convertis depuis les seuils EUR au taux du jour, puis arrondis.
ZAR: { gratuit: 10000, abordable: 50000 },
MAD: { gratuit: 5500, abordable: 27000 },
TRY: { gratuit: 24000, abordable: 120000 },
// RUB : la BCE ne publie plus de cours du rouble depuis 2022.
// Référence retenue : Banque centrale de Russie, 12.09.2026,
// 1 EUR = 97,8728 RUB (https://www.cbr.ru/scripts/XML_daily.asp).
RUB: { gratuit: 49000, abordable: 245000 }
};

// Compatibilité : les deux anciens noms restent exportés, mais dérivés
// du tableau — une seule source.
export const SEUIL_GRATUIT = SEUILS_PAR_DEVISE.EUR.gratuit;
export const SEUIL_ABORDABLE = SEUILS_PAR_DEVISE.EUR.abordable;

export const BANDES = ["gratuit", "abordable", "eleve", "inconnu"];

// Neutres : ni montant ni symbole. « jusqu'à 500 €/an » serait faux dès
// qu'une seconde devise existe. Le montant exact reste sur la carte,
// où il est juste.
export const LIBELLES_BANDES = {
gratuit: "Gratuit ou presque",
abordable: "Peu cher",
eleve: "Plus cher",
// « Coût non classé », pas « Frais non vérifiés » (D2-ter) : la bande
// « inconnu » couvre AUSSI un établissement dont le prix affiché est celui
// d'un niveau replié — un prix vérifié qui ne permet pas de classer.
inconnu: "Coût non classé"
};

/**
* La phrase de la CARTE quand aucun montant n'est vérifié. Distincte du
* libellé de bande « Coût non classé » : deux phrases pour deux endroits,
* et c'est voulu — une carte sans prix dit que rien n'a été vérifié, le
* filtre dit seulement qu'il ne sait pas ranger.
*/
export const LIBELLE_SANS_PRIX = "Frais non vérifiés";

/**
* Fraîcheur d'une vérification de frais : 180 jours. Les droits
* d'inscription changent UNE FOIS PAR AN, à la rentrée — ce n'est pas
* une échéance de candidature. Le seuil de 90 jours du radar
* (scripts/radar-echeances.mjs) est fait pour des dates qui bougent
* plusieurs fois par cycle ; l'appliquer ici marquerait « à recouper »
* la moitié du catalogue en permanence, pour rien. Ne PAS le réutiliser.
*/
export const JOURS_FRAICHEUR = 180;

const NIVEAUX = { licence: "licence", master: "master", doctorat: "doctorat" };

// « ¥ CN » et non « ¥ » pour le yuan : le yen et le yuan partagent le
// symbole, et Tokyo comme Fudan sont au catalogue — l'ambiguïté coûterait
// un facteur 25 à qui lit vite.
const SYMBOLES = { EUR: "€", USD: "$", GBP: "£", CHF: "CHF", CAD: "$ CA", JPY: "¥", KRW: "₩", CNY: "¥ CN", ZAR: "R", MAD: "MAD", TRY: "TL", RUB: "₽" };

function cleNiveau(niveau) {
if (typeof niveau !== "string") return null;
const n = niveau.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
return NIVEAUX[n] || null;
}

function dateValide(iso) {
if (typeof iso !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
const d = new Date(`${iso}T00:00:00Z`);
return Number.isNaN(d.getTime()) ? null : d;
}

function urlValide(source) {
return typeof source === "string" && /^https?:\/\/\S+$/.test(source.trim());
}

const INCONNU = Object.freeze({ etat: "inconnu", montant: null, devise: null, periode: null, source: null, verifieLe: null, fraiche: false });

/**
* Bande de coût d'un montant ANNUEL, selon les seuils de SA devise. Une
* devise sans seuils posés ne peut pas être rangée honnêtement : elle
* reste « inconnu » (voir SEUILS_PAR_DEVISE).
*
* `replie` (D2-ter, 2026-09-07) : quand le montant est celui d'un niveau
* REPLIÉ — pas le plus bas de l'établissement, voir premierNiveauVerifie —
* la bande vaut « inconnu ». Sorbonne Université et Paris Cité sortaient
* en « Gratuit ou presque » parce que leur DOCTORAT est à 398 € alors
* que leur master est à 3 950 €. On connaît un prix, on ne sait pas
* classer l'établissement : c'est un aveu, pas une perte. Le montant
* reste affiché sur la carte. Le repli est la condition, pas le montant :
* un 0 € vérifié sur le niveau le plus bas reste « gratuit ».
*/
export function bandeCout(montant, devise = "EUR", { replie = false } = {}) {
if (replie) return "inconnu";
if (typeof montant !== "number" || !Number.isFinite(montant) || montant < 0) return "inconnu";
const seuils = SEUILS_PAR_DEVISE[devise || "EUR"];
if (!seuils) return "inconnu";
if (montant <= seuils.gratuit) return "gratuit";
if (montant <= seuils.abordable) return "abordable";
return "eleve";
}

/**
* Lit les frais d'une université pour un niveau.
* etat « inconnu » dès qu'il manque le montant OU la source OU verifieLe.
* Ne mute jamais `uni`.
*
* @param {Object} uni - document `universities`
* @param {string} niveau - "Licence" | "Master" | "Doctorat"
* @param {{aujourdhui?: Date}} [options] - pour les tests
*/
export function lireFrais(uni, niveau, { aujourdhui = new Date() } = {}) {

const frais = uni && typeof uni === "object" ? uni.fraisScolarite : null;
if (!frais || typeof frais !== "object") return { ...INCONNU };

const cle = cleNiveau(niveau);
const ligne = cle ? frais[cle] : null;
if (!ligne || typeof ligne !== "object") return { ...INCONNU };

const montant = ligne.montant;
const date = dateValide(frais.verifieLe);

if (typeof montant !== "number" || !Number.isFinite(montant) || montant < 0) return { ...INCONNU };
if (!urlValide(frais.source)) return { ...INCONNU };
if (!date) return { ...INCONNU };

const jours = Math.floor((aujourdhui.getTime() - date.getTime()) / 86400000);

return {
etat: "verifie",
montant,
devise: typeof ligne.devise === "string" && ligne.devise ? ligne.devise : "EUR",
periode: typeof ligne.periode === "string" && ligne.periode ? ligne.periode : "an",
source: frais.source.trim(),
verifieLe: frais.verifieLe,
fraiche: jours >= 0 && jours <= JOURS_FRAICHEUR
};

}

/**
* Lit la politique d'exonération. Un code hors vocabulaire, ou un champ
* absent, se lit « inconnue » — jamais affiché brut.
*/
export function lireExoneration(uni) {

const exo = uni && typeof uni === "object" ? uni.exoneration : null;
if (!exo || typeof exo !== "object") return { politique: "inconnue", detail: "", source: null, verifieLe: null };

return {
politique: POLITIQUES_EXONERATION.includes(exo.politique) ? exo.politique : "inconnue",
detail: typeof exo.detail === "string" ? exo.detail : "",
source: urlValide(exo.source) ? exo.source.trim() : null,
verifieLe: dateValide(exo.verifieLe) ? exo.verifieLe : null
};

}

/** « 3 950 €/an » — espaces insécables, devise telle que facturée. */
export function formaterMontant(montant, devise = "EUR", periode = "an") {
const entier = Math.round(montant);
const groupes = String(entier).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
const symbole = SYMBOLES[devise] || devise;
return `${groupes} ${symbole}/${periode}`;
}

/**
* Le montant tel qu'il se lit sur une carte, à partir d'un résultat de
* lireFrais() VÉRIFIÉ : « Gratuit » pour un zéro vérifié, le montant
* formaté sinon. C'est cette fonction, pas formaterMontant(), que
* l'affichage doit appeler.
*/
export function libelleMontant(frais) {
if (!frais || frais.etat !== "verifie") return LIBELLE_SANS_PRIX;
return frais.montant === 0 ? "Gratuit" : formaterMontant(frais.montant, frais.devise, frais.periode);
}

/** Ordre des niveaux, du plus bas au plus haut. */
export const ORDRE_NIVEAUX = ["Licence", "Master", "Doctorat"];

/**
* Le niveau qu'une carte affiche quand l'étudiant n'en a demandé aucun
* (correction D2-bis, 2026-09-07). Avant : le plus bas niveau de
* l'établissement — et Polytechnique, Sorbonne Université, Paris Cité
* cachaient un prix vérifié en master ou en doctorat derrière un « Frais
* non vérifiés » de licence. Maintenant : le PREMIER niveau, dans l'ordre
* Licence / Master / Doctorat, qui porte un montant vérifié ; à défaut, le
* plus bas niveau de l'établissement, comme avant (état « inconnu »).
*
* `niveaux` = les niveaux réellement proposés par l'établissement (ses
* programmes au catalogue). On les parcourt D'ABORD, dans l'ordre — HEC
* n'a que des programmes de master chez nous : c'est son master qui
* s'affiche, pas son bachelor. PUIS les niveaux restants, parce que
* Sorbonne Université n'a pas de programme « Doctorat » dans nos
* croisements université × bourse, mais son droit de doctorat est
* vérifié et sourcé — le cacher serait cacher un fait ; la puce dit
* alors « à partir de … · doctorat ». Ne s'applique PAS quand un filtre
* de niveau est actif : c'est alors le niveau demandé qui parle, même
* sans prix — la page ne passe pas par ici dans ce cas.
*
* @returns {{ niveau: string, frais: Object, plusBas: string, replie: boolean }}
*   `replie` : vrai quand le niveau affiché n'est pas le plus bas de
*   l'établissement — la puce doit alors nommer le niveau.
*/
export function premierNiveauVerifie(uni, niveaux = [], options) {

const proposes = ORDRE_NIVEAUX.filter((n) => niveaux.includes(n));
const plusBas = proposes[0] || ORDRE_NIVEAUX[0];
const candidats = [...proposes, ...ORDRE_NIVEAUX.filter((n) => !proposes.includes(n))];

for (const niveau of candidats) {
const frais = lireFrais(uni, niveau, options);
if (frais.etat === "verifie") return { niveau, frais, plusBas, replie: niveau !== plusBas };
}

return { niveau: plusBas, frais: lireFrais(uni, plusBas, options), plusBas, replie: false };

}

/**
* Le texte de la puce de coût d'une carte, à un seul endroit :
*   "3 950 €/an"                          niveau le plus bas, fraîche
*   "3 950 €/an · à recouper"             pas fraîche
*   "à partir de 3 950 €/an · master"     niveau replié (pas le plus bas)
*   "Gratuit"                             zéro vérifié
*   "Frais non vérifiés"                  rien de vérifié
*/
export function libellePuce(frais, { niveau = "", replie = false } = {}) {

if (!frais || frais.etat !== "verifie") return LIBELLE_SANS_PRIX;

const montant = libelleMontant(frais);
const tete = replie ? `à partir de ${montant} · ${String(niveau).toLowerCase()}` : montant;

return frais.fraiche ? tete : `${tete} · à recouper`;

}

/**
* La phrase honnête, à un seul endroit :
*   verifie + fraiche      -> "3 950 €/an · vérifié le 7 septembre 2026"
*   verifie + pas fraiche  -> "3 950 €/an · à recouper"
*   zéro vérifié           -> "Gratuit · vérifié le 7 septembre 2026"
*   inconnu                -> "Frais non vérifiés"
* Jamais une gratuité affirmée sans vérification ; toujours dite quand
* elle est vérifiée.
*/
export function libelleFrais(uni, niveau, options) {

const f = lireFrais(uni, niveau, options);

if (f.etat !== "verifie") return LIBELLE_SANS_PRIX;

const montant = libelleMontant(f);

return f.fraiche
? `${montant} · vérifié le ${formaterDate(f.verifieLe)}`
: `${montant} · à recouper`;

}
