/**
* ============================================================
* Fitz — les « révélations » : ce que les agences ne disent pas
* ============================================================
*
* POURQUOI CE FICHIER (2026-09-24)
* --------------------------------
* Charles, en voyant le bandeau « Ouvert en ce moment » : « ces genres
* d'opportunités révélées font que notre site se démarque facilement
* des agences ». La première : au Maroc, la place en université
* publique est GRATUITE pour un étudiant étranger admis par l'AMCI
* (lot 82). Une agence vend un accompagnement ; elle a peu d'intérêt à
* dire qu'une voie gratuite existe.
*
* POURQUOI PAS UNE CARTE DE PLUS DANS LA FRISE
* --------------------------------------------
* La frise porte le titre « Des bourses dont les candidatures sont
* encore ouvertes », et chaque carte y porte un compte à rebours. La
* voie AMCI n'est pas une bourse, et sa campagne 2026 est close (dépôt
* avant le 31 juillet). La glisser dans la frise ferait mentir son
* titre — exactement ce que js/opportunites-bandeau.js s'interdit. La
* révélation vit donc DANS le même bloc, sous la frise, avec son propre
* titre, sans décompte.
*
* LA RÈGLE : UNE RÉVÉLATION SE PROUVE PAR LE CATALOGUE
* ----------------------------------------------------
* Le chiffre affiché (« 13 universités publiques ») n'est pas écrit à
* la main : il est COMPTÉ dans le catalogue, avec la même lecture que
* les fiches (lireFrais : montant sourcé, daté, frais de moins de
* 180 jours ; lireExoneration : « systematique »). Si un lot retire un
* prix, le chiffre baisse ; si les données vieillissent au-delà de la
* fraîcheur, ou tombent sous le minimum, la révélation disparaît
* d'elle-même. Jamais de chiffre que la fiche ne confirmerait pas.
*
* Aucun DOM, aucun Firestore : testable sous Node.
* ============================================================
*/

import { lireFrais, lireExoneration } from "./frais.js";

/**
* Les révélations, par ordre de priorité. La première qui passe son
* critère est affichée ; une seule à la fois, pour qu'elle se lise.
*
* Chaque entrée :
*   critere(uni)  : l'université prouve-t-elle la révélation ?
*   minimum       : en dessous, la révélation ne s'affiche pas
*   texte(n)      : les phrases, avec le compte réel
*   source        : la preuve officielle, affichée en clair
*/
export const REVELATIONS = [
{
id: "maroc-public-gratuit",
pays: "Maroc",
chiffre: "0 DH",
chiffreLegende: "de frais de scolarité",
titre: "Au Maroc, l'université publique est gratuite pour un étudiant étranger",
// UNE phrase (2026-09-24, Charles : « sans casser ni encombrer le
// site »). Le détail — bourse contingentée, calendrier, démarche —
// vit sur la page Maroc, où mène le lien.
texte: (n) =>
`${n} établissements publics, place offerte « à titre gracieux » à l'étudiant admis par l'AMCI. Dossiers avant le 31 juillet.`,
lien: { href: "preinscription-maroc.html", texte: "Comment en profiter" },
lienCatalogue: { href: "universities.html?country=Maroc&cost=gratuit", texte: (n) => `Voir les ${n}` },
source: {
nom: "ministère marocain de l'Enseignement supérieur (copie archivée : le site du ministère ne répond pas depuis l'Afrique de l'Ouest)",
url: "https://web.archive.org/web/20250317151356/https://www.enssup.gov.ma/en/la-mobilite-etudiante"
},
minimum: 5,
critere: (uni, aujourdhui) => {
if (!uni || uni.country !== "Maroc") return false;
const f = lireFrais(uni, "Licence", { aujourdhui });
return f.etat === "verifie" && f.fraiche && f.montant === 0
&& lireExoneration(uni).politique === "systematique";
}
}
];

/**
* La révélation à afficher, ou null.
*
* @param {Array} universites - le catalogue (forme universities ou universites)
* @param {Date} aujourdhui
* @returns {null | {id, pays, drapeau, chiffre, chiffreLegende, titre,
*   texte, lien, lienCatalogue, source, nombre, verifieLe}}
*/
export function lireRevelation(universites, aujourdhui = new Date()) {

if (!Array.isArray(universites)) return null;

for (const r of REVELATIONS) {

const preuves = universites.filter((u) => r.critere(u, aujourdhui));
if (preuves.length < r.minimum) continue;

// Un bloc n'est pas plus frais que sa fiche la plus ancienne (même
// règle que la date du bandeau).
const verifieLe = preuves
.map((u) => u.fraisScolarite?.verifieLe)
.filter((d) => typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d))
.sort()[0] || null;

const n = preuves.length;

return {
id: r.id,
pays: r.pays,
// Le drapeau vient des fiches elles-mêmes : même fichier que partout.
drapeau: preuves.find((u) => u.flag)?.flag || "",
chiffre: r.chiffre,
chiffreLegende: r.chiffreLegende,
titre: r.titre,
texte: r.texte(n),
lien: { ...r.lien },
lienCatalogue: { href: r.lienCatalogue.href, texte: r.lienCatalogue.texte(n) },
source: { ...r.source },
nombre: n,
verifieLe
};

}

return null;

}

/* ==================================================================
* LES ANNONCES (lot 130, 2026-09-28)
* ==================================================================
*
* Demande de Charles, en regardant la bande de la révélation : « cette
* partie devrait devenir la partie qui annonce les informations et les
* campagnes, comme Campus France qui doit ouvrir le 1er octobre », avec
* un défilement toutes les 8 secondes.
*
* La bande devient donc une suite d'ANNONCES, une seule visible à la
* fois : d'abord les campagnes datées (ouverture imminente, campagne
* ouverte), ensuite les révélations. Les bourses gardent la frise
* au-dessus : une annonce parle d'une PROCÉDURE, jamais d'une bourse,
* pour ne pas montrer deux fois la même chose.
*
* LA RÈGLE QUI COMPTE LE PLUS : UNE ANNONCE MEURT TOUTE SEULE
* -----------------------------------------------------------
* « Campus France ouvre le 1er octobre » encore affiché en janvier
* ruinerait la confiance que le site construit fiche par fiche. Chaque
* annonce porte donc :
*   - afficherDes : avant cette date, elle n'existe pas ;
*   - ouvreLe / fermeLe : le texte change seul à l'ouverture, et
*     l'annonce disparaît le lendemain de la clôture ;
*   - verifieLe : lue sur la page officielle ; au-delà de
*     JOURS_VALIDITE_ANNONCE, elle s'éteint même si la campagne court
*     encore — une vérification vieillit, comme partout ailleurs.
* Personne n'a à penser à la retirer.
*
* Chaque date écrite ici a été LUE sur la source citée, depuis le réseau
* de Charles (doc projet calendrier-eef-senegal-2027-verifie-2026-09-28).
* ================================================================== */

/** Au-delà, une vérification ne garantit plus rien : l'annonce s'éteint. */
export const JOURS_VALIDITE_ANNONCE = 90;

/** Plus de quatre annonces, et les dernières ne sont jamais vues. */
export const MAX_ANNONCES = 4;

export const ANNONCES = [
{
id: "eef-senegal-rentree-2027",
pays: "France",
drapeau: "fr.svg",
afficherDes: "2026-09-21",
ouvreLe: "2026-10-01",
fermeLe: "2026-12-15",
verifieLe: "2026-09-28",
avant: {
kicker: "Bientôt",
chiffre: "1er oct.",
chiffreLegende: "ouverture des dossiers",
titre: "Études en France : les dossiers pour la rentrée 2027 ouvrent le 1er octobre"
},
pendant: {
kicker: "Campagne ouverte",
chiffreLegende: "pour déposer",
titre: "Études en France : les dossiers pour la rentrée 2027 sont ouverts"
},
texte: "Candidats résidant au Sénégal : dépôt sur la plateforme Études en France jusqu'au 15 décembre 2026, frais de dossier jusqu'au 19 décembre.",
lien: { href: "preinscription-france.html", texte: "Préparer mon dossier France" },
source: {
nom: "Campus France Sénégal, calendrier de la procédure",
url: "https://www.senegal.campusfrance.org/calendrier-de-la-procedure"
}
}
];

const JOUR_MS = 86400000;

/** Une date ISO nue (« 2026-10-01 ») en millisecondes UTC, ou NaN. */
function jourISO(iso) {
const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ""));
return m ? Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : NaN;
}

function minuitUTC(d) {
return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

/**
* Une annonce telle qu'elle se lit AUJOURD'HUI, ou null si elle ne doit
* pas s'afficher (pas encore, plus du tout, ou vérification trop vieille).
*/
export function lireAnnonce(a, aujourdhui = new Date()) {

if (!a) return null;

const jour = minuitUTC(aujourdhui);
const des = jourISO(a.afficherDes);
const ouvre = jourISO(a.ouvreLe);
const ferme = jourISO(a.fermeLe);
const verifie = jourISO(a.verifieLe);

// Une annonce dont une date ne se lit pas ne s'affiche pas : on
// n'annonce jamais une date qu'on n'a pas su lire.
if ([des, ouvre, ferme, verifie].some(Number.isNaN)) return null;

if (jour < des || jour > ferme) return null;
if ((jour - verifie) / JOUR_MS > JOURS_VALIDITE_ANNONCE) return null;

const ouverte = jour >= ouvre;
const restants = Math.round((ferme - jour) / JOUR_MS);
const etat = ouverte ? a.pendant : a.avant;

return {
id: a.id,
type: ouverte ? "ouverte" : "bientot",
kicker: etat.kicker,
pays: a.pays,
drapeau: a.drapeau,
// Le jour de la clôture compte encore : « Dernier jour », jamais « 0 jours ».
chiffre: ouverte ? (restants === 0 ? "Dernier jour" : `${restants} jour${restants > 1 ? "s" : ""}`) : etat.chiffre,
chiffreLegende: etat.chiffreLegende,
titre: etat.titre,
texte: a.texte,
lien: { ...a.lien },
lienCatalogue: null,
source: { ...a.source },
verifieLe: a.verifieLe,
// Pour trier : la prochaine date qui compte pour l'étudiant.
echeance: ouverte ? ferme : ouvre
};

}

/**
* Toutes les annonces à faire défiler, dans l'ordre : les campagnes (la
* date la plus proche d'abord), puis la révélation. Jamais plus de
* MAX_ANNONCES. Liste vide si rien n'est à dire : la bande disparaît.
*/
export function lireAnnonces(universites, aujourdhui = new Date(), liste = ANNONCES) {

const campagnes = liste
.map((a) => lireAnnonce(a, aujourdhui))
.filter(Boolean)
.sort((x, y) => x.echeance - y.echeance);

const sortie = campagnes.map(({ echeance, ...reste }) => reste);

const revelation = lireRevelation(universites, aujourdhui);
if (revelation) sortie.push({ ...revelation, type: "revelation", kicker: "Révélé par FitzUniverse" });

return sortie.slice(0, MAX_ANNONCES);

}
