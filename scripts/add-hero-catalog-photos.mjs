// ============================================================
// FitzUniverse — photos de bannière des DEUX catalogues (2026-09-01)
//
// Un seul script pour scholarships.html et universities.html : les
// deux bannières partagent la même règle CSS (.bourses-hero /
// .uni-hero, css/catalog.css) et donc les mêmes contraintes de
// recadrage. Les traiter ensemble est aussi ce qui garantit le
// critère « les deux se distinguent d'un coup d'œil » — intérieur
// chaud pour Bourses, extérieur froid pour Universités.
//
// POURQUOI
// scholarships.html servait assets/images/cities/riyadh.jpg. Trois
// défauts cumulés, tous vérifiables :
//   1. elle choisissait UN pays sur 28 pour un catalogue mondial ;
//   2. c'était le MÊME fichier que des cartes de la grille en dessous
//      (repli pays de l'Arabie saoudite dans js/scholarship-image.js,
//      et photo de King Saud University d'après CREDITS.md) ;
//   3. une skyline dit « voyage », pas « bourse ».
//
// Le raisonnement d'origine — « une bourse est rattachée à un pays,
// pas à un établissement précis », d'où l'exclusion des photos de
// BÂTIMENT — reste valable et est conservé. Il n'a simplement jamais
// justifié de choisir UN pays. Le sujet retenu est donc le seul
// universel de l'étude qui ne soit ni une remise de diplôme (déjà sur
// l'accueil) ni une ville (les cartes en sont pleines) : une grande
// salle de lecture, en intérieur.
//
// riyadh.jpg N'EST PAS TOUCHÉE : elle reste le repli pays de l'Arabie
// saoudite et la photo de King Saud University. On AJOUTE un fichier.
//
// LA PHOTO A ÉTÉ REGARDÉE, PAS SEULEMENT LUE
// C'est le contrôle qui a manqué à milan.jpg (qui montrait Vernazza).
// Six candidates ont été écartées après examen à l'écran :
//   - une lithographie XIXe vendue comme photo de bibliothèque ;
//   - la Reading Room du British Museum : enseigne « Enquiries »
//     lisible, et monument identifiable ;
//   - la Rose Main Reading Room de la New York Public Library (deux
//     fois) : monument parmi les plus reconnaissables au monde ;
//   - la State Library Victoria (Melbourne) : même défaut ;
//   - un salon de club avec portrait et cheminée : dit « club
//     privé », pas « étude ».
//
// LA RETENUE : une salle de lecture universitaire, tables en enfilade
// sous leurs lampes, étudiants au travail, vitraux GÉOMÉTRIQUES
// (vérifié au zoom : losanges et chevrons, aucun blason, aucun texte).
// Les petits motifs des baies hautes sont des marques d'imprimeurs,
// pas des armoiries — et ils tombent hors du recadrage.
// L'établissement (University of Washington) n'est PAS au catalogue :
// vérifié sur scripts/export-catalog.json, les deux seules
// universités américaines en base sont Stanford et Berkeley. Aucune
// lecture Firestore pour ce contrôle.
//
// LE RECADRAGE, ET POURQUOI 2:1 NE SUFFIT PAS À LUI SEUL
// La bannière fait toute la largeur pour environ 330px de haut, soit
// un rapport proche de 4:1, en object-fit:cover : le navigateur ne
// garde qu'une BANDE CENTRALE d'environ 47 % de la hauteur du fichier.
// Le fichier est donc recadré en 2:1 (minimum imposé) AVEC cette
// bande en tête : on retire 260px en haut (baies hautes et lustres,
// jamais vus) et 143px en bas (chaises vides du premier plan), ce qui
// centre étagères, lampes et tables — le sujet — exactement là où le
// cover coupe.
//
// ---- UNIVERSITÉS : pourquoi university-hall.jpg a été remplacée
// universities.html servait assets/images/university-hall.jpg. La
// LOGIQUE — un bâtiment pour un catalogue d'établissements — est
// bonne et n'a pas bougé ; c'est le fichier qui posait deux
// problèmes, dont un seul était connu :
//   1. sa PROVENANCE est introuvable. Aucune entrée dans CREDITS.md,
//      aucun auteur en EXIF/IPTC (le XMP ne porte que la signature de
//      pipeline « Go XMP SDK »), message de commit muet (16b22a7), et
//      une recherche par comparaison perceptuelle sur les résultats
//      Unsplash correspondants n'a rien donné (meilleur écart 36/255,
//      très loin d'une correspondance). On ne peut donc pas la
//      créditer sans inventer une source — inacceptable sur un site
//      qui vend la rigueur.
//   2. elle sert AUSSI de photo du hero de l'accueil (index.html) :
//      les deux pages les plus vues partageaient une seule image.
// L'architecture, elle, ne portait ni blason ni enseigne ni texte —
// le critère littéral passait. Le commentaire d'index.html le
// concédait déjà : « l'architecture reste distinctive au point qu'un
// visiteur connaissant ce campus pourrait le reconnaître ».
//
// Décision utilisateur du 2026-09-01 : remplacer sur universities.html
// SEULEMENT. university-hall.jpg reste le hero de l'accueil (choix
// explicite du 2026-08-22) et n'est ni supprimée ni modifiée.
//
// La retenue : une COUR intérieure à arcades, vue de l'extérieur.
// Anonyme (vérifié au zoom sur l'arcade centrale : aucune plaque,
// aucun blason, aucune enseigne), symétrique, et — avantage décisif —
// ce n'est PAS un établissement d'enseignement, donc aucune
// université ne peut sembler cautionner FitzUniverse. Pierre grise et
// ciel bleu : palette FROIDE, qui tranche d'un coup d'œil avec la
// salle de lecture chaude de la page voisine.
//
// Lancer : node scripts/add-hero-bourses-photo.mjs
// ============================================================

import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const DIR = "assets/images";
const WIDTHS = [400, 800, 1200, 1600];
const QUALITY = 92;

// Recadrages mesurés sur chaque source (voir l'en-tête) : la bannière
// ne montre qu'une BANDE CENTRALE d'environ 47 % de la hauteur du
// fichier, le recadrage 2:1 est donc choisi pour y placer le sujet.
const PHOTOS = [
{
base: "reading-room",
cdn: "photo-1741707596397-efaae09503b5",
source: { w: 2400, h: 1603 },
// -260px en haut (baies hautes et lustres), -143px en bas (chaises
// vides du premier plan) : étagères, lampes et tables au centre.
crop: { left: 0, top: 260, width: 2400, height: 1200 }
},
{
base: "campus-courtyard",
cdn: "photo-1730145268935-34c1d833bb98",
source: { w: 2400, h: 1616 },
// -80px en haut (ciel), -336px en bas (pavés vides) : la façade à
// arcades tombe pile dans la bande visible.
crop: { left: 0, top: 80, width: 2400, height: 1200 }
}
];

for (const photo of PHOTOS) {

const reponse = await fetch(`https://images.unsplash.com/${photo.cdn}?w=2400&q=90&fm=jpg`);
if (!reponse.ok) throw new Error(`${photo.base} : téléchargement refusé (${reponse.status})`);
const original = Buffer.from(await reponse.arrayBuffer());

const meta = await sharp(original).metadata();
if (meta.width !== photo.source.w || meta.height !== photo.source.h) {
throw new Error(
`${photo.base} : source ${meta.width}x${meta.height} au lieu de ${photo.source.w}x${photo.source.h} — le recadrage codé en dur ne vaut plus, le re-mesurer avant d'écrire`
);
}

const reference = await sharp(original).extract(photo.crop).jpeg({ quality: QUALITY, mozjpeg: true }).toBuffer();

// Garde de ratio : refuser tôt vaut mieux que livrer un portrait dans
// une bande large, où le sujet disparaît (critère du 2026-09-01).
const metaRef = await sharp(reference).metadata();
const ratio = metaRef.width / metaRef.height;
if (ratio < 2) throw new Error(`${photo.base} : ratio ${ratio.toFixed(2)} < 2:1 — refusé`);

await writeFile(join(DIR, `${photo.base}.jpg`), reference);
console.log(`${photo.base}.jpg — ${metaRef.width}x${metaRef.height}, ratio ${ratio.toFixed(2)}`);

for (const w of WIDTHS) {
const redimensionne = sharp(reference).resize({ width: w, withoutEnlargement: true });
await writeFile(join(DIR, `${photo.base}-${w}w.jpg`), await redimensionne.clone().jpeg({ quality: QUALITY, mozjpeg: true }).toBuffer());
await writeFile(join(DIR, `${photo.base}-${w}w.webp`), await redimensionne.clone().webp({ quality: QUALITY }).toBuffer());
await writeFile(join(DIR, `${photo.base}-${w}w.avif`), await redimensionne.clone().avif({ quality: 62 }).toBuffer());
console.log(`  ${w}w — jpg + webp + avif`);
}

}

console.log("\nTerminé. Contrôle restant, à l'œil et sur le RENDU RÉEL (voile sombre + éclat ambré de .bourses-hero::after), jamais sur la photo nue.");
