// ============================================================
// FitzUniverse — Lot 36-saint-denis : nouvelle photo de ville pour
// l'Université Sorbonne Paris Nord (2026-09-03)
//
// Décision utilisateur : « le Stade de France, change cette photo ».
// Un seul patch : image → saint-denis-basilique.jpg (basilique de
// Saint-Denis, Wikimedia Commons — crédit dans CREDITS.md).
// `attendu` posé sur la valeur en base (champ existant, renseigné par
// le lot 36) : si elle a bougé, le runner bloque.
// ORDRE : `node scripts\add-lot36b-photo-saint-denis.mjs` d'abord.
// ============================================================

import { existsSync } from "node:fs";

if (!existsSync("assets/images/cities/saint-denis-basilique-1600w.avif")) {
  throw new Error("Lot 36-saint-denis : assets/images/cities/saint-denis-basilique-1600w.avif absent — lancer d'abord `node scripts\\add-lot36b-photo-saint-denis.mjs`.");
}

export const PATCHES = [
  {
    collection: "universities",
    id: "universite-sorbonne-paris-nord-villetaneuse",
    attendu: { image: "saint-denis-stade-de-france.jpg" },
    champs: { image: "saint-denis-basilique.jpg" },
    motif: "remplacement de la photo de ville : l'intérieur du Stade de France un soir de match ne lisait pas comme une ville (décision utilisateur 2026-09-03) → basilique de Saint-Denis, Wikimedia Commons"
  }
];
