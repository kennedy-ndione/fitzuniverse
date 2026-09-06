// ============================================================
// FitzUniverse — LOT 35 bis : photos propres des bourses françaises
// + photo de ville de l'École polytechnique (2026-09-03)
//
// Rattrapage de la règle du catalogue : chaque BOURSE porte sa propre
// photo (un monument de la ville), chaque UNIVERSITÉ sa photo de ville,
// aucune image partagée. Le lot 35 avait laissé huit bourses sur la
// cascade de repli (photo de l'université rattachée → cartes jumelles).
//
// Ce lot ne crée rien : 9 PATCHES qui renseignent `image`. Seul le patch
// de Polytechnique porte `attendu: { image: "" }` (sa fiche a le champ,
// vide) ; les bourses n'ont pas le champ du tout — voir plus bas.
//
// ORDRE : `node scripts\add-lot35-photos-bourses.mjs` D'ABORD (les fichiers),
// puis analyser / ecrire / verifier / export. Le module refuse de se
// charger si un fichier manque : renseigner `image` sans fichier
// désactive la cascade et laisse une carte VIDE (incident du lot 35).
//
// bourse-emile-boutmy n'est PAS dans ce lot : son champ `image` est déjà
// renseigné, seul le FICHIER a été remplacé (Louvre → musée d'Orsay).
// ============================================================

import { existsSync } from "node:fs";

const PHOTOS_BOURSES = [
  "ens-psl-selection-internationale",
  "smarts-up-universite-paris-cite",
  "france-excellence-major",
  "programme-bourses-france-senegal",
  "polytechnique-concours-international-fui",
  "ens-lyon-ampere-scholarships",
  "uga-idex-master-scholarships",
  "paris-saclay-international-masters-scholarship"
];

const manquants = [
  ...PHOTOS_BOURSES.filter((id) => !existsSync(`assets/images/scholarships/${id}-1600w.jpg`)).map((id) => `assets/images/scholarships/${id}-1600w.jpg`),
  ...(existsSync("assets/images/cities/polytechnique-palaiseau-1600w.avif") ? [] : ["assets/images/cities/polytechnique-palaiseau-1600w.avif"])
];
if (manquants.length) {
  throw new Error(`Lot 35-photos : ${manquants.length} fichier(s) photo absent(s) — lancer d'abord \`node scripts\\add-lot35-photos-bourses.mjs\`, ou retirer du lot les ids refusés :\n  ${manquants.join("\n  ")}`);
}

// Pas d'`attendu` sur les bourses : le lot 35 les a créées SANS champ
// `image` (absent, pas vide) et la garde compare strictement — au premier
// passage, `attendu: { image: "" }` a bloqué les 8 (base=undefined).
// Le contrôle reste dans l'export : ces 8 ids sont dans boursesSansImage.
const patchBourse = (id, motif) => ({
  collection: "scholarships",
  id,
  champs: { image: `${id}.jpg` },
  motif
});

export const PATCHES = [
  patchBourse("ens-psl-selection-internationale", "photo propre : palais et jardin du Luxembourg (quartier de la rue d'Ulm) — Unsplash s7oVdTjjKhs"),
  patchBourse("smarts-up-universite-paris-cite", "photo propre : Notre-Dame de Paris — Unsplash t9yW6tegIRU"),
  patchBourse("france-excellence-major", "photo propre : Arc de Triomphe — Unsplash KX5ZQkluQ9U"),
  patchBourse("programme-bourses-france-senegal", "photo propre : pont Alexandre-III — Unsplash arPLE2yYHRU"),
  patchBourse("polytechnique-concours-international-fui", "photo propre : dôme des Invalides — Unsplash -1v5OV58dm0"),
  patchBourse("ens-lyon-ampere-scholarships", "photo propre : basilique de Fourvière, Lyon — Unsplash zNnpb7NjPBs"),
  patchBourse("uga-idex-master-scholarships", "photo propre : l'Isère et ses quais, Grenoble — Unsplash mKCXxdlAl1A"),
  patchBourse("paris-saclay-international-masters-scholarship", "photo propre : château de Versailles — Unsplash FUxXFfgbyOU"),
  {
    collection: "universities",
    id: "ecole-polytechnique-palaiseau",
    attendu: { image: "" },
    champs: { image: "polytechnique-palaiseau.jpg" },
    motif: "photo de ville : campus de Palaiseau — Wikimedia Commons (auteur et licence dans CREDITS.md)"
  }
];
