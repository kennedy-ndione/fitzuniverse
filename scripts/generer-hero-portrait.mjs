/**
 * ============================================================
 * scripts/generer-hero-portrait.mjs — la photo du hero, recadrée
 * pour les téléphones
 * ============================================================
 *
 * POURQUOI CE RECADRAGE EXISTE
 * ----------------------------
 * Le hero sert la même photo 3:2 (hero-bg3, 5040 x 3360) à tout le
 * monde. Sur un téléphone de 390 x 844, `object-fit:cover` la met à
 * l'échelle par la HAUTEUR : elle est peinte sur 1266 px CSS de large
 * pour 390 visibles. Autrement dit 69 % de la largeur est décodée puis
 * jetée, et le tiers qui reste est agrandi 3,2 fois par-dessus le
 * marché — mesuré en DPR 2 comme en DPR 3.
 *
 * Élargir le `sizes` aurait tiré le 2560w (281 Ko) sur tous les
 * téléphones : refusé. Une bonne part du public visé navigue sur un
 * forfait compté.
 *
 * LE CADRAGE, CALCULÉ ET NON CHOISI
 * ---------------------------------
 * En `cover` sur un cadre portrait, le téléphone montre exactement la
 * bande centrale de 30,8 % de la largeur, sur toute la hauteur. Le
 * recadrage central de 1680 x 3360 (un tiers de la largeur, rapport
 * 1:2) est donc ce que l'écran affiche déjà, à un cheveu près — pas un
 * nouveau cadrage. Les quelques pour cent de marge en plus laissent
 * les téléphones un peu plus larges (360 x 800, 414 x 896) couvrir
 * sans bande vide.
 *
 * LE PLAFOND
 * ----------
 * Le 900w AVIF doit tenir sous 150 Ko. La qualité est réglée ici, une
 * seule fois, et le script REFUSE d'écrire si le plafond est dépassé :
 * un fichier trop lourd sur cette page-là coûterait plus cher que le
 * flou qu'il évite.
 * ============================================================
 */

import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const DOSSIER = "assets/images";
const SOURCE = join(DOSSIER, "hero-bg3.jpg");
const BASE = "hero-bg3-portrait";

// Le recadrage, en pixels de la source.
const CADRE = { largeur: 1680, hauteur: 3360 };

const LARGEURS = [600, 900];

// Réglages mesurés. Le plafond de 150 Ko laissait beaucoup de marge
// (55 Ko à q52), mais la qualité ne se règle plus au poids seul : la
// photo n’est plus agrandie 3,2 fois, elle est vue à l’échelle, et
// les artefacts que le flou masquait deviennent visibles. q62 tient
// 76 Ko — moins que les 104 Ko que le DPR 3 chargeait avant, à peine
// plus que les 60 Ko du DPR 2, et la moitié du plafond.
const QUALITE = { avif: 62, webp: 78, jpeg: 78 };

const PLAFOND_AVIF_900 = 150 * 1024;

const meta = await sharp(SOURCE).metadata();

if (meta.width !== 5040 || meta.height !== 3360) {
  throw new Error(
    `La source a changé (${meta.width} x ${meta.height} au lieu de 5040 x 3360). ` +
    `Le recadrage central est calculé sur ces dimensions : le revérifier avant de relancer.`
  );
}

const gauche = Math.round((meta.width - CADRE.largeur) / 2);
const haut = Math.round((meta.height - CADRE.hauteur) / 2);

console.log(`Source ${meta.width} x ${meta.height} — bande centrale ${CADRE.largeur} x ${CADRE.hauteur} à partir de x=${gauche}`);

const ecrits = [];

for (const largeur of LARGEURS) {
  const decoupe = () =>
    sharp(SOURCE)
      .extract({ left: gauche, top: haut, width: CADRE.largeur, height: CADRE.hauteur })
      .resize({ width: largeur });

  const sorties = [
    [`${BASE}-${largeur}w.avif`, (p) => decoupe().avif({ quality: QUALITE.avif }).toFile(p)],
    [`${BASE}-${largeur}w.webp`, (p) => decoupe().webp({ quality: QUALITE.webp }).toFile(p)],
    [`${BASE}-${largeur}w.jpg`, (p) => decoupe().jpeg({ quality: QUALITE.jpeg, mozjpeg: true }).toFile(p)]
  ];

  for (const [nom, produire] of sorties) {
    const chemin = join(DOSSIER, nom);
    await produire(chemin);
    const octets = statSync(chemin).size;
    ecrits.push({ nom, octets });
    console.log(`  ${nom.padEnd(30)} ${(octets / 1024).toFixed(1)} Ko`);
  }
}

const avif900 = ecrits.find((e) => e.nom === `${BASE}-900w.avif`);

if (!avif900 || avif900.octets > PLAFOND_AVIF_900) {
  throw new Error(
    `${BASE}-900w.avif pèse ${(avif900.octets / 1024).toFixed(1)} Ko, plafond 150 Ko. ` +
    `Baisser QUALITE.avif et relancer — ou s'arrêter si l'image devient mauvaise avant de tenir.`
  );
}

if (!existsSync(join(DOSSIER, `${BASE}-600w.avif`))) {
  throw new Error("le 600w AVIF manque");
}

console.log(`\nPlafond tenu : 900w AVIF à ${(avif900.octets / 1024).toFixed(1)} Ko sur 150 Ko.`);
