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
* voulu : un seuil n'est pas une conversion de taux, c'est un jugement
* sur ce qu'« abordable » veut dire dans ce pays. Il se pose à la main,
* une fois, avec une source — jamais calculé depuis un taux de change.
* Les devises des pays cibles (MAD, TRY, CAD, XOF…) se remplissent au
* lot D2, chacune avec sa source.
*/
export const SEUILS_PAR_DEVISE = {
EUR: { gratuit: 500, abordable: 2500 }
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
inconnu: "Frais non vérifiés"
};

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

const SYMBOLES = { EUR: "€", USD: "$", GBP: "£", CHF: "CHF", CAD: "$ CA" };

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
*/
export function bandeCout(montant, devise = "EUR") {
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
if (!frais || frais.etat !== "verifie") return LIBELLES_BANDES.inconnu;
return frais.montant === 0 ? "Gratuit" : formaterMontant(frais.montant, frais.devise, frais.periode);
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

if (f.etat !== "verifie") return LIBELLES_BANDES.inconnu;

const montant = libelleMontant(f);

return f.fraiche
? `${montant} · vérifié le ${formaterDate(f.verifieLe)}`
: `${montant} · à recouper`;

}
