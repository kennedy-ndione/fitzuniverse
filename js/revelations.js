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
