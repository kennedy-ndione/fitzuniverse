/**
* ============================================================
* Diagnostic France — du total au CHEMIN (lot DIAGNOSTIC-2, 2026-09-09)
* ============================================================
*
* CE QUE CE MODULE CORRIGE
*
* Le diagnostic rendait un total annuel juste, sourcé, daté — et
* strictement inutilisable. Un total est une donnée ; l'étudiant a payé
* 10 000 F pour une DÉCISION et un CHEMIN. Entre les deux, il manquait
* l'assemblage : ses points de vigilance, son calendrier en jours, ce
* qui peut faire baisser le chiffre, et ce qu'il lui reste à faire.
*
* Presque rien n'est créé ici. Tout existe déjà dans le produit —
* procédures par pays, sources datées, calendriers, moteur de bourses,
* frais de scolarité vérifiés. Ce module ASSEMBLE, et refuse d'afficher
* ce qu'il n'a pas.
*
* LA RÈGLE QUI PASSE AVANT TOUTES LES AUTRES
* ------------------------------------------
* On ne cache JAMAIS une partie du résultat pour faire payer la suite.
* Pas de « 3 problèmes détectés, payez pour les voir ». Quatre des sept
* pays documentés publient un avertissement contre les officines qui
* font exactement cela — et nous ne serons pas la neuvième. Tout ce que
* le diagnostic promet est rendu en entier, immédiatement.
*
* Module PUR : aucun DOM, aucun Firestore. Le catalogue arrive en
* ARGUMENT, jamais par un import : c'est ce qui permet de tester les
* leviers sur un catalogue de trois lignes, et c'est ce qui empêche ce
* module de déclencher une lecture Firestore par surprise.
* ============================================================
*/

import { faitFrance, jalonDeCampagne } from "./pays-preinscription.js";
import { PROCEDURE_FRANCE } from "./procedures/france.js";
import { coucheDeResidence, composerProcedure, pointsDeVigilanceDe } from "./procedures/index.js";
import { lireFrais } from "./frais.js";
import { formaterDate } from "./echeance.js";
import { retenirOpportunites } from "./recommend-programs.js";
import { formatEUR } from "./diagnostic-france.js";

const DESTINATION = "France";

function joursEntre(iso, aujourdhui) {
const cible = new Date(`${iso}T00:00:00Z`);
const zero = new Date(Date.UTC(aujourdhui.getUTCFullYear(), aujourdhui.getUTCMonth(), aujourdhui.getUTCDate()));
return Math.round((cible.getTime() - zero.getTime()) / 86400000);
}

// ==========================================================
// 1. LES POINTS DE VIGILANCE DE SON PAYS
// ==========================================================
//
// C'est ici que les 10 000 F se justifient en une ligne. Ces phrases
// vivent dans les couches de résidence (js/procedures/residences/*.js),
// avec leur source et leur date — defautsDeCouche() refuse une phrase
// qui n'en aurait pas. Un avertissement a l'autorité d'un fait, et
// l'étudiant y obéira : il ne peut donc pas être écrit de mémoire.

export function vigilanceDe(paysResidence) {
return pointsDeVigilanceDe(DESTINATION, paysResidence);
}

// ==========================================================
// 2. SON CALENDRIER, EN JOURS
// ==========================================================
//
// « Dans 22 jours » se lit ; « 1er octobre » se calcule. La différence
// est tout le produit.
//
// AUCUNE URGENCE INVENTÉE. Un pays sans calendrier publié reçoit la
// phrase d'absence de sa couche — jamais une date reprise d'une campagne
// passée. Six des huit pays documentés sont dans ce cas, et leurs pages
// officielles portent encore des dates de 2023, 2024 et 2025 qui se
// contredisent : les afficher serait pire que de ne rien dire.
//
// Un jalon DÉJÀ PASSÉ ne disparaît pas — il se dit au passé. Le masquer
// laisserait croire qu'il reste du temps.

/**
* @returns {{documente:boolean, jalons:Array, absence:string, source:string|null, verifieLe:string|null}}
*/
export function calendrierDe(paysResidence, aujourdhui = new Date()) {

const couche = coucheDeResidence(DESTINATION, paysResidence);
const calendrier = couche && couche.faits && couche.faits.calendrier;

if (!calendrier || !calendrier.jalons) {
return {
documente: false,
jalons: [],
// La phrase de la COUCHE quand elle en a une : « les dates encore en
// ligne appartiennent à des campagnes passées et se contredisent »
// vaut mieux que « pas de calendrier », qui ne dit pas quoi faire.
absence: (couche && couche.absences && couche.absences.calendrier)
|| "Le calendrier de la campagne de votre pays n'est pas encore publié. Aucune date n'est affichée ici : consultez la page de votre espace Campus France dès l'ouverture.",
source: null,
verifieLe: null
};
}

const jalons = Object.keys(calendrier.jalons)
.map((cle) => jalonDeCampagne(cle, aujourdhui, calendrier.jalons))
.filter(Boolean)
.map((j) => {
const jours = joursEntre(j.iso, aujourdhui);
return {
...j,
jours,
texte: jours > 0
? `${j.libelle} : le ${formaterDate(j.iso)} — dans ${jours} jour${jours > 1 ? "s" : ""}.`
: jours === 0
? `${j.libelle} : aujourd'hui, ${formaterDate(j.iso)}.`
: `${j.libelle} : le ${formaterDate(j.iso)} — il y a ${Math.abs(jours)} jour${Math.abs(jours) > 1 ? "s" : ""}.`
};
})
.sort((a, b) => a.iso.localeCompare(b.iso));

return {
documente: true,
jalons,
absence: "",
source: calendrier.source || null,
verifieLe: calendrier.verifieLe || null
};

}

// ==========================================================
// 3. LES LEVIERS — ce qui peut faire baisser le total
// ==========================================================

/**
* a) LE NIVEAU. Licence et master ne coûtent pas la même chose, et
* l'écart est publié : 2 902 € contre 3 950 €. Ce n'est pas un conseil
* de viser plus bas — c'est un chiffre qu'un étudiant hésitant entre
* deux niveaux a le droit de connaître avant de choisir.
*/
export function levierNiveau(niveau) {

const droits = faitFrance("droits");
const licence = droits.montants.licence;
const master = droits.montants.master;
const ecart = master - licence;

return {
cle: "niveau",
disponible: true,
niveau,
montantEUR: ecart,
texte: niveau === "master"
? `Une licence coûte ${formatEUR(licence)} de droits contre ${formatEUR(master)} en master : ${formatEUR(ecart)} d'écart par an. Le niveau visé se choisit sur un projet, pas sur un prix — mais l'écart est publié, et vous avez le droit de le connaître.`
: `Vous visez la licence, le niveau le moins cher en droits différenciés : ${formatEUR(licence)} contre ${formatEUR(master)} en master. Ce levier est déjà tiré.`,
source: droits.source,
verifieLe: droits.verifieLe
};

}

/**
* b) L'EXONÉRATION. Depuis le décret du 19 mai 2026 (relu le 2026-09-25) :
* individuelle seulement, 30 % des inscrits hors UE en 2026-2027, 25 % en
* 2027-2028 — la rentrée que préparent nos étudiants. On affiche ce qu'elle
* RETIRERAIT du total, en disant dans la même phrase qu'elle n'est pas
* garantie : un chiffre d'exonération présenté seul se lit comme un
* rabais acquis, et c'est le budget de l'étudiant qui paie l'erreur.
*/
export function levierExoneration(niveau) {

const droits = faitFrance("droits");
const montant = droits.montants[niveau];
const plafond = droits.plafondExoneration;

return {
cle: "exoneration",
disponible: true,
montantEUR: montant,
texte: `Une exonération des droits différenciés retirerait ${formatEUR(montant)} de ce total. Elle n'est pas garantie : depuis le décret du 19 mai 2026, seule une exonération individuelle reste possible, sur demande, dans la limite de ${Math.round(plafond * 100)} % des inscrits hors Union européenne pour une première inscription en 2027-2028, et chaque établissement décide des siennes. Budgétez le montant plein, et considérez l'exonération comme un allègement possible, jamais comme un acquis.`,
source: droits.source,
verifieLe: droits.verifieLe
};

}

/**
* c) L'UNIVERSITÉ. Le levier le plus concret des trois, et le seul qui
* dépende de données que nous n'avons pas partout.
*
* 15 universités françaises sur 155 du catalogue portent `fraisScolarite`
* vérifié — et c'est un chiffre qu'il faut dire plutôt que masquer. Le
* levier ne s'affiche donc QUE si au moins un montant vérifié existe pour
* le niveau visé, et il annonce lui-même sur combien d'établissements il
* a été calculé.
*
* lireFrais() fait foi : un montant sans source OU sans date se lit
* « inconnu », même si le chiffre est là (js/frais.js).
*/
export function levierUniversite(universites, niveau, { aujourdhui = new Date() } = {}) {

const droits = faitFrance("droits");
const reference = droits.montants[niveau];
const libelleNiveau = niveau === "master" ? "Master" : "Licence";

const verifiees = (universites || [])
.filter((u) => u && u.country === DESTINATION)
.map((u) => ({ uni: u, frais: lireFrais(u, libelleNiveau, { aujourdhui }) }))
.filter((x) => x.frais.etat === "verifie" && x.frais.devise === "EUR");

if (!verifiees.length) {
return {
cle: "universite",
disponible: false,
texte: `Nous n'avons pas encore vérifié les frais de scolarité d'une université française pour ce niveau. Les droits différenciés publiés (${formatEUR(reference)}) restent la référence : beaucoup d'établissements les appliquent tels quels, certains facturent bien davantage.`,
montantEUR: 0,
etablissements: 0
};
}

verifiees.sort((a, b) => a.frais.montant - b.frais.montant);

const moinsCher = verifiees[0];
const economie = Math.round(reference - moinsCher.frais.montant);

return {
cle: "universite",
disponible: true,
montantEUR: Math.max(0, economie),
etablissements: verifiees.length,
universite: moinsCher.uni.name,
// Le total du diagnostic utilise les droits NATIONAUX. Une université
// moins chère les fait baisser ; une université plus chère les fait
// monter, et le taire donnerait un diagnostic optimiste à qui vise
// Sciences Po. Les deux cas ont leur phrase.
texte: economie > 0
? `Le total ci-dessus retient les droits différenciés nationaux (${formatEUR(reference)}). Sur les ${verifiees.length} université${verifiees.length > 1 ? "s" : ""} françaises dont nous avons vérifié les frais, la moins chère en ${libelleNiveau.toLowerCase()} est ${moinsCher.uni.name}, à ${formatEUR(moinsCher.frais.montant)} par an : ${formatEUR(economie)} de moins.`
: `Le total ci-dessus retient les droits différenciés nationaux (${formatEUR(reference)}), et c'est déjà le tarif le plus bas parmi les ${verifiees.length} université${verifiees.length > 1 ? "s" : ""} françaises dont nous avons vérifié les frais. Plusieurs facturent nettement plus : vérifiez le montant de chaque établissement avant de le mettre dans vos vœux.`,
source: moinsCher.frais.source,
verifieLe: moinsCher.frais.verifieLe
};

}

/**
* d) LES BOURSES — et la passerelle vers l'autre parcours.
*
* Le bouton mène à offers.html?parcours=bourse, et sa place naturelle est
* ici : au moment où le chiffre fait mal.
*
* DEUX HONNÊTETÉS QUI ONT COÛTÉ DEUX DÉCISIONS DE CONCEPTION.
*
* 1. SEULES LES BOURSES POUR LA FRANCE COMPTENT. retenirOpportunites()
*    parcourt tout le catalogue, et rendrait volontiers une bourse
*    hongroise ou japonaise à un profil sénégalais. Elle serait
*    excellente — et elle ne retirerait pas un euro du total ci-dessus,
*    qui est celui d'une préinscription en France. Une bourse ailleurs
*    est une ALTERNATIVE, pas une réduction. Le levier filtre donc sur la
*    destination du diagnostic.
*
* 2. AUCUN MONTANT COUVERT N'EST ANNONCÉ. Le briefing demandait « N
*    bourses […] couvriraient jusqu'à X € de ce total ». X n'existe pas :
*    les 156 bourses du catalogue portent un `funding` en PROSE — « bourse
*    complète », « 7 172 € selon le communiqué », « non documenté » — et
*    aucun champ numérique. Fabriquer X demanderait d'analyser ces phrases
*    au jugé, sur la page même qui vend la précision de ses chiffres.
*    On rend donc le NOMBRE, qui est exact, et la phrase de financement
*    de chaque bourse, telle que sa source la publie.
*
* @param {{profile:Object, catalogue:{programs,universities,scholarships}, aujourdhui?:Date, max?:number}}
*/
export function levierBourses({ profile, catalogue, aujourdhui = new Date(), max = 3 }) {

const programs = (catalogue && catalogue.programs) || [];
const universites = (catalogue && catalogue.universities) || [];
const bourses = (catalogue && catalogue.scholarships) || [];

const universitiesById = new Map(universites.map((u) => [u.id, u]));
const scholarshipsById = new Map(bourses.map((s) => [s.id, s]));

// LE CLASSEMENT DU HUB NE RÉPOND PAS À LA QUESTION D'ICI, et le
// mesurer a changé cet appel.
//
// retenirOpportunites() est réglée pour le hub : elle rend les 12
// MEILLEURES opportunités du catalogue entier, avec un seuil de
// pertinence (`marge`) et un plafond par pays. Appelée telle quelle
// puis filtrée sur la France, elle rendait zéro bourse française à un
// profil sénégalais — non parce qu'aucune ne lui convenait, mais parce
// que trois bourses suisses et une allemande avaient un meilleur score
// et occupaient les places.
//
// Ici la question n'est pas « quelles sont vos meilleures pistes »,
// c'est « à combien de bourses françaises OUVERTES pouvez-vous
// candidater ». On desserre donc le classement et on garde les FILTRES
// DURS — éligibilité par nationalité, cycle visé, langue, âge, bourse
// retirée, échéance close. Ce sont eux qui disent « correspond à votre
// profil » ; le rang, lui, ne dit que « d'abord ».
const { retenues } = retenirOpportunites({
profile: profile || {},
programs,
universitiesById,
scholarshipsById,
aujourdhui,
max: Number.MAX_SAFE_INTEGER,
min: Number.MAX_SAFE_INTEGER,
marge: Number.POSITIVE_INFINITY,
maxParPays: Number.MAX_SAFE_INTEGER
});

// `echeanceOuverte === true` et non « pas fermée » : une échéance
// INCONNUE n'est pas une échéance ouverte. Le briefing demande des
// bourses « dont l'échéance est ouverte et lue à la source » — le
// troisième état (null) ne remplit ni l'une ni l'autre condition.
const ouvertes = retenues.filter((o) => o.country === DESTINATION && o.echeanceOuverte === true && o.scholarshipId);

if (!ouvertes.length) {
return { cle: "bourses", disponible: false, nombre: 0, bourses: [], texte: "" };
}

const detail = ouvertes.slice(0, max).map((o) => {
const bourse = scholarshipsById.get(o.scholarshipId);
return {
id: o.scholarshipId,
titre: o.scholarshipTitle || (bourse && bourse.title) || "Bourse",
universite: o.universityName,
jours: o.jours,
// La phrase de financement TELLE QUE la source la publie. C'est
// long, c'est inégal, et c'est vrai — les trois vont ensemble.
financement: (bourse && bourse.funding) || "",
source: (bourse && bourse.officialWebsite) || "",
verifieLe: (bourse && bourse.verifieLe) || null
};
});

const n = ouvertes.length;

return {
cle: "bourses",
disponible: true,
nombre: n,
bourses: detail,
lien: "offers.html?parcours=bourse",
texte: `${n} bourse${n > 1 ? "s" : ""} pour la France ${n > 1 ? "correspondent" : "correspond"} à votre profil et ${n > 1 ? "sont" : "est"} ouverte${n > 1 ? "s" : ""} aujourd'hui. Une bourse ne réduit pas les frais de dossier Campus France, mais elle prend en charge tout ou partie des droits et du coût de la vie — c'est-à-dire l'essentiel de ce total. Chaque montant pris en charge est celui que publie l'organisme, en toutes lettres : nous ne le résumons pas en un chiffre que nous n'avons pas vérifié.`
};

}

/** Les quatre leviers, dans l'ordre où ils se lisent. */
export function leviersDe(resultat, { catalogue = null, profile = null, aujourdhui = new Date() } = {}) {

const niveau = resultat.droits.niveau;

const leviers = [levierNiveau(niveau), levierExoneration(niveau)];

if (catalogue) {
leviers.push(levierUniversite(catalogue.universities, niveau, { aujourdhui }));
leviers.push(levierBourses({ profile, catalogue, aujourdhui }));
}

return leviers;

}

// ==========================================================
// 4. CE QU'IL RESTE À FAIRE — et c'est ça qui vend
// ==========================================================
//
// On ne réécrit RIEN. Ce sont les étapes de la procédure composée pour
// son pays (composerProcedure) : la liste exacte, dans ses termes à lui,
// avec ses échéances quand son calendrier les porte. Longue, précise,
// honnête — et déjà entièrement rendue, sans rien à payer pour la voir.

export function etapesRestantes(paysResidence, aujourdhui = new Date()) {

const couche = coucheDeResidence(DESTINATION, paysResidence);
const procedure = composerProcedure(PROCEDURE_FRANCE, couche);
const jalons = (couche && couche.faits && couche.faits.calendrier && couche.faits.calendrier.jalons) || null;

return {
residenceDocumentee: procedure.residenceDocumentee,
avertissement: procedure.avertissement || "",
etapes: procedure.etapes.map((e) => {
const jalon = e.echeance && jalons ? jalonDeCampagne(e.echeance.cle, aujourdhui, jalons) : null;
const jours = jalon ? joursEntre(jalon.iso, aujourdhui) : null;
return {
id: e.id,
titre: e.titre,
consigne: e.consigne,
pieces: e.pieces || [],
source: e.source,
verifieLe: e.verifieLe,
echeance: jalon
? { iso: jalon.iso, libelle: jalon.libelle, jours, texte: `${formaterDate(jalon.iso)}${jours > 0 ? ` — dans ${jours} jour${jours > 1 ? "s" : ""}` : ""}` }
: null
};
})
};

}

// ==========================================================
// 5. LES DEUX OFFRES — une ligne chacune, une seule fois
// ==========================================================
//
// « Vous pouvez tout faire seul : tout est écrit ci-dessus. » Cette
// phrase n'est pas une précaution rhétorique, c'est la vérité de la page
// — la procédure complète vient d'être rendue en entier, gratuitement,
// juste au-dessus.
//
// Et l'offre ne prend PAS le dernier mot : phraseDeFin() vient après
// (js/diagnostic-france.js). Le dernier mot appartient au projet de
// l'étudiant, pas à un prix.

export const PREAMBULE_OFFRE = "Vous pouvez tout faire seul : tout est écrit ci-dessus. Avec le Dossier France, c'est nous qui tenons le calendrier, vérifions chaque pièce avant le dépôt, et vous préparons à l'entretien.";

export const OFFRES_ACCOMPAGNEMENT = [
{
id: "dossier-france",
label: "Dossier France",
ligne: "le dossier tenu : pièces, calendrier, échéances."
},
{
id: "dossier-france-conseiller",
label: "Dossier France + Conseiller",
ligne: "la même chose, plus un conseiller qui répond et la préparation à l'entretien — le seul moment humain de la procédure, et celui où les dossiers tombent."
}
];
