// ============================================================
// FitzUniverse — Lot 79 : tout le catalogue au classement QS 2027
// Relevé du 2026-09-24 sur topuniversities.com, seule source admise
// pour le rang QS (test lisible) : QS World University Rankings 2027,
// liste complète de 1 504 établissements lue au navigateur
// (endpoint du classement, nid 4153156, titre de page « QS World
// University Rankings 2027 »).
//
// POURQUOI
// Le catalogue mélangeait trois éditions : QS 2027 (lot 77 et
// quelques lots italiens et suisses), QS 2026, et des rangs QS sans
// année dont on ne savait plus de quelle édition ils venaient. Deux
// cartes côte à côte comparaient donc des chiffres d'années
// différentes.
//
// RÈGLES
// - « #N mondial (QS 2027) » ; un ex æquo (=N chez QS) s'écrit #N ;
//   une tranche reste une tranche (#751-760).
// - Une précision gardée seulement si elle reste vraie en 2027 :
//   McGill 30e devant Toronto 32e ; Malaya 56e, 1re de Malaisie ;
//   Cape Town 184e, 1re d'Afrique ; Varsovie 289e, 1re de Pologne.
// - PSL (ENS, Mines, Dauphine) : « #34 mondial via PSL ». X : « #43
//   mondial via IP Paris ». « 1ʳᵉ » partout (McGill écrivait « 1re »).
// - Absents de l'édition 2027 : INSA Lyon et Cadi Ayyad (recherche
//   par nom au classement : 0 résultat). Leur rang 2026 reste dit,
//   avec l'absence.
// - Hors classement mondial (Algérie, Carthage) : l'édition 2027 est
//   dite ; le rang QS Arab Region garde SA date (2026).
// - Rang de discipline (HEC Paris, ESSEC, Bocconi, IHEID, Semmelweis) :
//   non touché, le classement par matière 2027 n'est pas paru.
// - Repère descriptif remplacé par le rang pour 24 établissements
//   classés dans les 1000 premiers (KAIST, EPFL, KU Leuven…). Au-delà,
//   le repère descriptif en dit plus qu'une tranche de 200 : gardé.
// - Université du Québec : QS classe le RÉSEAU (951-1000), pas UQAM,
//   UQTR… séparément. Non attribué à un établissement.
//
// Chaque patch porte `attendu` : si la valeur en base a changé depuis
// la rédaction, le lot bloque au lieu d'écraser.
// ============================================================

export const PATCHES = [
  {
    "collection": "universities",
    "id": "aix-marseille-universite-marseille",
    "attendu": {
      "ranking": "#428 mondial (QS 2026)"
    },
    "champs": {
      "ranking": "#443 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : =443 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "beihang-university-pekin",
    "attendu": {
      "ranking": "#452 mondial (QS)"
    },
    "champs": {
      "ranking": "#349 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : =349 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "bogazici-university-istanbul",
    "attendu": {
      "ranking": "#345 mondial (QS 2026)"
    },
    "champs": {
      "ranking": "#345 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : =345 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "budapest-university-of-technology-and-economics-budapest",
    "attendu": {
      "ranking": "#711-720 mondial (QS)"
    },
    "champs": {
      "ranking": "#751-760 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : 751-760 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "delft-university-of-technology-delft",
    "attendu": {
      "ranking": "#47 mondial (QS 2026)"
    },
    "champs": {
      "ranking": "#48 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : 48 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "ecole-normale-superieure-de-lyon-lyon",
    "attendu": {
      "ranking": "#235 mondial (QS 2026)"
    },
    "champs": {
      "ranking": "#235 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : =235 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "ecole-normale-superieure-psl-paris",
    "attendu": {
      "ranking": "34e mondial via PSL (QS 2026)"
    },
    "champs": {
      "ranking": "#34 mondial via PSL (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : 34 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "ecole-polytechnique-palaiseau",
    "attendu": {
      "ranking": "43e mondial via IP Paris (QS 2026)"
    },
    "champs": {
      "ranking": "#43 mondial via IP Paris (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : =43 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "eotvos-lorand-university-budapest",
    "attendu": {
      "ranking": "#564 mondial (QS)"
    },
    "champs": {
      "ranking": "#595 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : =595 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "eth-zurich-zurich",
    "attendu": {
      "ranking": "#7 mondial (QS 2026)",
      "description": "L'École polytechnique fédérale de Zurich, une référence mondiale en sciences, en ingénierie et en technologies. Au classement QS 2026, c'est la première université d'Europe continentale."
    },
    "champs": {
      "ranking": "#8 mondial (QS 2027)",
      "description": "L'École polytechnique fédérale de Zurich, une référence mondiale en sciences, en ingénierie et en technologies. Au classement QS 2027, c'est la première université d'Europe continentale."
    },
    "motif": "rang QS World University Rankings 2027 : =8 (topuniversities.com, relu le 2026-09-24) ; description : toujours 1re d'Europe continentale en 2027 (ETH 8e, EPFL 22e, TUM 25e)"
  },
  {
    "collection": "universities",
    "id": "fudan-university-shanghai",
    "attendu": {
      "ranking": "#39 mondial (QS)"
    },
    "champs": {
      "ranking": "#26 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : 26 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "harbin-institute-of-technology-harbin",
    "attendu": {
      "ranking": "#252 mondial (QS)"
    },
    "champs": {
      "ranking": "#190 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : 190 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "hse-university-moscow",
    "attendu": {
      "ranking": "#423 mondial (QS 2026)"
    },
    "champs": {
      "ranking": "#423 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : =423 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "humboldt-universitat-zu-berlin-berlin",
    "attendu": {
      "ranking": "#130 mondial (QS 2026)"
    },
    "champs": {
      "ranking": "#140 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : =140 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "imperial-college-london-london",
    "attendu": {
      "ranking": "#2 mondial (QS 2026)"
    },
    "champs": {
      "ranking": "#2 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : =2 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "insa-lyon-villeurbanne",
    "attendu": {
      "ranking": "#406 mondial (QS 2026)"
    },
    "champs": {
      "ranking": "#406 mondial (QS 2026), absent en 2027"
    },
    "motif": "absent du QS World University Rankings 2027 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "istanbul-university-istanbul",
    "attendu": {
      "ranking": "#629 mondial (QS 2026)"
    },
    "champs": {
      "ranking": "#629 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : =629 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "jagiellonian-university-cracovie",
    "attendu": {
      "ranking": "#243 mondial (QS 2026)"
    },
    "champs": {
      "ranking": "#329 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : =329 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "jawaharlal-nehru-university-delhi",
    "attendu": {
      "ranking": "#600-650 mondial (QS 2026)"
    },
    "champs": {
      "ranking": "#555 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : =555 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "korea-university-seoul",
    "attendu": {
      "ranking": "#61 mondial (QS 2026)"
    },
    "champs": {
      "ranking": "#52 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : =52 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "kth-royal-institute-of-technology-stockholm",
    "attendu": {
      "ranking": "#78 mondial (QS 2026)"
    },
    "champs": {
      "ranking": "#82 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : =82 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "leibniz-universitat-hannover-hannover",
    "attendu": {
      "ranking": "#433 mondial (QS 2026)"
    },
    "champs": {
      "ranking": "#470 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : =470 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "mcgill-university-montreal",
    "attendu": {
      "ranking": "#27 mondial (QS 2026), 1re au Canada"
    },
    "champs": {
      "ranking": "#30 mondial (QS 2027), 1ʳᵉ au Canada"
    },
    "motif": "rang QS World University Rankings 2027 : 30 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "mines-paris-psl-paris",
    "attendu": {
      "ranking": "28e mondial via PSL (QS 2026)"
    },
    "champs": {
      "ranking": "#34 mondial via PSL (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : 34 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "nantes-universite-nantes",
    "attendu": {
      "ranking": "Rang 851-900 mondial (QS 2026)"
    },
    "champs": {
      "ranking": "#901-950 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : 901-950 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "politecnico-di-milano-milan",
    "attendu": {
      "ranking": "#111 mondial (QS)"
    },
    "champs": {
      "ranking": "#87 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : =87 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "politecnico-di-torino-turin",
    "attendu": {
      "ranking": "#241 mondial (QS)"
    },
    "champs": {
      "ranking": "#206 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : =206 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "sapienza-universita-di-roma-rome",
    "attendu": {
      "ranking": "#132 mondial (QS)"
    },
    "champs": {
      "ranking": "#111 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : =111 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "sciences-po-paris",
    "attendu": {
      "ranking": "#367 mondial (QS 2026)"
    },
    "champs": {
      "ranking": "#354 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : =354 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "shanghai-jiao-tong-university-shanghai",
    "attendu": {
      "ranking": "#45 mondial (QS)"
    },
    "champs": {
      "ranking": "#36 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : 36 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "sichuan-university-chengdu",
    "attendu": {
      "ranking": "#336 mondial (QS)"
    },
    "champs": {
      "ranking": "#300 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : =300 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "stanford-university-stanford",
    "attendu": {
      "ranking": "#3 mondial (QS 2026)"
    },
    "champs": {
      "ranking": "#2 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : =2 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "sun-yat-sen-university-guangzhou",
    "attendu": {
      "ranking": "#331 mondial (QS)"
    },
    "champs": {
      "ranking": "#258 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : =258 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "tianjin-university-tianjin",
    "attendu": {
      "ranking": "#269 mondial (QS)"
    },
    "champs": {
      "ranking": "#235 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : =235 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "tongji-university-shanghai",
    "attendu": {
      "ranking": "#192 mondial (QS)"
    },
    "champs": {
      "ranking": "#146 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : 146 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "tsinghua-university-pekin",
    "attendu": {
      "ranking": "#20 mondial (QS)"
    },
    "champs": {
      "ranking": "#14 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : 14 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "universita-degli-studi-di-napoli-federico-ii-naples",
    "attendu": {
      "ranking": "#347 mondial (QS)"
    },
    "champs": {
      "ranking": "#401 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : 401 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "universita-di-bologna-bologne",
    "attendu": {
      "ranking": "#133 mondial (QS)"
    },
    "champs": {
      "ranking": "#123 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : =123 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "universita-di-firenze-florence",
    "attendu": {
      "ranking": "#358 mondial (QS)"
    },
    "champs": {
      "ranking": "#409 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : =409 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "universita-di-padova-padoue",
    "attendu": {
      "ranking": "#233 mondial (QS)"
    },
    "champs": {
      "ranking": "#204 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : 204 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "universita-di-pisa-pise",
    "attendu": {
      "ranking": "#343 mondial (QS)"
    },
    "champs": {
      "ranking": "#341 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : 341 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "universita-di-trento-trente",
    "attendu": {
      "ranking": "#429 mondial (QS)"
    },
    "champs": {
      "ranking": "#438 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : =438 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "universitat-hamburg-hamburg",
    "attendu": {
      "ranking": "#193 mondial (QS 2026)"
    },
    "champs": {
      "ranking": "#209 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : =209 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "universite-cadi-ayyad-marrakech",
    "attendu": {
      "ranking": "#1401+ mondial (QS 2026)"
    },
    "champs": {
      "ranking": "#1401+ mondial (QS 2026), absent en 2027"
    },
    "motif": "absent du QS World University Rankings 2027 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "universite-claude-bernard-lyon-1-villeurbanne",
    "attendu": {
      "ranking": "#587 mondial (QS 2026)"
    },
    "champs": {
      "ranking": "#613 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : =613 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "universite-cote-d-azur-nice",
    "attendu": {
      "ranking": "#688 mondial (QS 2026)"
    },
    "champs": {
      "ranking": "#711-720 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : 711-720 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "universite-de-bordeaux-bordeaux",
    "attendu": {
      "ranking": "#494 mondial (QS 2026)"
    },
    "champs": {
      "ranking": "#485 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : =485 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "universite-de-lille-lille",
    "attendu": {
      "ranking": "#654 mondial (QS 2026)"
    },
    "champs": {
      "ranking": "#686 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : =686 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "universite-de-lorraine-nancy",
    "attendu": {
      "ranking": "Rang 751-760 mondial (QS 2026)"
    },
    "champs": {
      "ranking": "#801-850 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : 801-850 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "universite-de-montpellier-montpellier",
    "attendu": {
      "ranking": "#430 mondial (QS 2026)"
    },
    "champs": {
      "ranking": "#473 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : 473 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "universite-de-rennes-rennes",
    "attendu": {
      "ranking": "Rang 711-720 mondial (QS 2026)"
    },
    "champs": {
      "ranking": "#731-740 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : 731-740 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "universite-de-sfax-sfax",
    "attendu": {
      "ranking": "QS 2026 : 1001-1200 mondial, 66e Arab Region"
    },
    "champs": {
      "ranking": "#1001-1200 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : 1001-1200 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "universite-de-sousse-sousse",
    "attendu": {
      "ranking": "QS 2026 : 1201-1400 mondial, 108e Arab Region"
    },
    "champs": {
      "ranking": "#1201-1400 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : 1201-1400 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "universite-de-strasbourg-strasbourg",
    "attendu": {
      "ranking": "#420 mondial (QS 2026)"
    },
    "champs": {
      "ranking": "#456 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : =456 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "universite-de-toulouse-toulouse",
    "attendu": {
      "ranking": "#587 mondial (QS 2026)"
    },
    "champs": {
      "ranking": "#565 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : =565 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "universite-de-tunis-el-manar-tunis",
    "attendu": {
      "ranking": "QS 2026 : 731-740 mondial, 41e Arab Region"
    },
    "champs": {
      "ranking": "#655 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : =655 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "universite-grenoble-alpes-grenoble",
    "attendu": {
      "ranking": "#387 mondial (QS 2026)"
    },
    "champs": {
      "ranking": "#387 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : 387 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "universite-ibn-tofail-kenitra",
    "attendu": {
      "ranking": "#1201-1400 mondial (QS 2026)"
    },
    "champs": {
      "ranking": "#1201-1400 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : 1201-1400 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "universite-mohammed-v-rabat",
    "attendu": {
      "ranking": "#1201-1400 mondial (QS 2026)"
    },
    "champs": {
      "ranking": "#1001-1200 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : 1001-1200 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "universite-paris-1-pantheon-sorbonne-paris",
    "attendu": {
      "ranking": "#257 mondial (QS 2026)"
    },
    "champs": {
      "ranking": "#246 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : =246 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "universite-paris-cite-paris",
    "attendu": {
      "ranking": "#303 mondial (QS 2026)"
    },
    "champs": {
      "ranking": "#303 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : =303 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "universite-paris-dauphine-psl-paris",
    "attendu": {
      "ranking": "28e mondial via PSL (QS 2026)"
    },
    "champs": {
      "ranking": "#34 mondial via PSL (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : 34 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "universite-paris-saclay-orsay",
    "attendu": {
      "ranking": "#76 mondial (QS 2026)"
    },
    "champs": {
      "ranking": "#76 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : 76 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "universite-sorbonne-paris-nord-villetaneuse",
    "attendu": {
      "ranking": "Rang 1001-1200 mondial (QS 2026)"
    },
    "champs": {
      "ranking": "#901-950 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : 901-950 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "universiti-kebangsaan-malaysia-kuala-lumpur",
    "attendu": {
      "ranking": "#159 mondial (QS 2026)"
    },
    "champs": {
      "ranking": "#130 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : 130 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "universiti-malaya-kuala-lumpur",
    "attendu": {
      "ranking": "#65 mondial (QS 2026), 1ʳᵉ de Malaisie"
    },
    "champs": {
      "ranking": "#56 mondial (QS 2027), 1ʳᵉ de Malaisie"
    },
    "motif": "rang QS World University Rankings 2027 : 56 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "university-of-amsterdam-amsterdam",
    "attendu": {
      "ranking": "#55 mondial (QS 2026)"
    },
    "champs": {
      "ranking": "#60 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : 60 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "university-of-british-columbia-vancouver",
    "attendu": {
      "ranking": "#40 mondial (QS 2026)"
    },
    "champs": {
      "ranking": "#45 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : =45 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "university-of-california-berkeley-berkeley",
    "attendu": {
      "ranking": "#17 mondial (QS 2026)"
    },
    "champs": {
      "ranking": "#20 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : =20 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "university-of-cape-town-le-cap",
    "attendu": {
      "ranking": "#171 mondial (QS 2026), 1ʳᵉ d'Afrique"
    },
    "champs": {
      "ranking": "#184 mondial (QS 2027), 1ʳᵉ d'Afrique"
    },
    "motif": "rang QS World University Rankings 2027 : 184 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "university-of-debrecen-debrecen",
    "attendu": {
      "ranking": "#574 mondial (QS)"
    },
    "champs": {
      "ranking": "#600 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : =600 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "university-of-delhi-delhi",
    "attendu": {
      "ranking": "#328 mondial (QS 2026)"
    },
    "champs": {
      "ranking": "#322 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : =322 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "university-of-edinburgh-edinburgh",
    "attendu": {
      "ranking": "#34 mondial (QS 2026)"
    },
    "champs": {
      "ranking": "#35 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : 35 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "university-of-gothenburg-goteborg",
    "attendu": {
      "ranking": "#194 mondial (QS 2026)"
    },
    "champs": {
      "ranking": "#225 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : 225 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "university-of-lisbon-lisbonne",
    "attendu": {
      "ranking": "#356 mondial (QS 2026)"
    },
    "champs": {
      "ranking": "#237 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : =237 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "university-of-oxford-oxford",
    "attendu": {
      "ranking": "#4 mondial (QS 2026)"
    },
    "champs": {
      "ranking": "#4 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : 4 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "university-of-pecs-pecs",
    "attendu": {
      "ranking": "#741-750 mondial (QS)"
    },
    "champs": {
      "ranking": "#791-800 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : 791-800 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "university-of-porto-porto",
    "attendu": {
      "ranking": "#251-300 mondial (QS 2026)"
    },
    "champs": {
      "ranking": "#255 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : =255 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "university-of-science-and-technology-of-china-hefei",
    "attendu": {
      "ranking": "#133 mondial (QS)"
    },
    "champs": {
      "ranking": "#134 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : =134 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "university-of-szeged-szeged",
    "attendu": {
      "ranking": "#570 mondial (QS)"
    },
    "champs": {
      "ranking": "#633 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : 633 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "university-of-the-witwatersrand-johannesburg",
    "attendu": {
      "ranking": "#251-300 mondial (QS 2026)"
    },
    "champs": {
      "ranking": "#302 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : 302 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "university-of-tokyo-tokyo",
    "attendu": {
      "ranking": "#36 mondial (QS 2026)"
    },
    "champs": {
      "ranking": "#39 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : 39 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "university-of-toronto-toronto",
    "attendu": {
      "ranking": "#29 mondial (QS 2026)"
    },
    "champs": {
      "ranking": "#32 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : 32 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "university-of-warsaw-varsovie",
    "attendu": {
      "ranking": "#262 mondial (QS 2026), 1ʳᵉ de Pologne"
    },
    "champs": {
      "ranking": "#289 mondial (QS 2027), 1ʳᵉ de Pologne"
    },
    "motif": "rang QS World University Rankings 2027 : =289 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "waseda-university-tokyo",
    "attendu": {
      "ranking": "#196 mondial (QS 2026)"
    },
    "champs": {
      "ranking": "#201 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : =201 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "wuhan-university-wuhan",
    "attendu": {
      "ranking": "#186 mondial (QS)"
    },
    "champs": {
      "ranking": "#165 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : =165 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "xiamen-university-xiamen",
    "attendu": {
      "ranking": "#303 mondial (QS)"
    },
    "champs": {
      "ranking": "#303 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : =303 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "yonsei-university-seoul",
    "attendu": {
      "ranking": "#50 mondial (QS 2026)"
    },
    "champs": {
      "ranking": "#42 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : 42 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "zhejiang-university-hangzhou",
    "attendu": {
      "ranking": "#45 mondial (QS)"
    },
    "champs": {
      "ranking": "#47 mondial (QS 2027)"
    },
    "motif": "rang QS World University Rankings 2027 : 47 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "universite-abou-bekr-belkaid-tlemcen",
    "attendu": {
      "ranking": "Hors QS mondial 2026, 137e QS Arab Region"
    },
    "champs": {
      "ranking": "Hors QS 2027 ; 137e QS Arab Region 2026"
    },
    "motif": "absent du QS World University Rankings 2027 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "universite-alger-1-benyoucef-benkhedda-alger",
    "attendu": {
      "ranking": "Hors QS mondial 2026, 201-250 QS Arab Region"
    },
    "champs": {
      "ranking": "Hors QS 2027 ; 201-250 QS Arab Region 2026"
    },
    "motif": "absent du QS World University Rankings 2027 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "universite-constantine-1-freres-mentouri-constantine",
    "attendu": {
      "ranking": "Hors QS mondial 2026, 171-180 QS Arab Region"
    },
    "champs": {
      "ranking": "Hors QS 2027 ; 171-180 QS Arab Region 2026"
    },
    "motif": "absent du QS World University Rankings 2027 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "universite-de-carthage-tunis",
    "attendu": {
      "ranking": "Hors QS mondial 2026, 94e QS Arab Region"
    },
    "champs": {
      "ranking": "Hors QS 2027 ; 94e QS Arab Region 2026"
    },
    "motif": "absent du QS World University Rankings 2027 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "universite-oran-1-ahmed-ben-bella-oran",
    "attendu": {
      "ranking": "Hors QS mondial 2026, 201-250 QS Arab Region"
    },
    "champs": {
      "ranking": "Hors QS 2027 ; 201-250 QS Arab Region 2026"
    },
    "motif": "absent du QS World University Rankings 2027 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "usthb-alger",
    "attendu": {
      "ranking": "Hors QS mondial 2026, 191-200 QS Arab Region"
    },
    "champs": {
      "ranking": "Hors QS 2027 ; 191-200 QS Arab Region 2026"
    },
    "motif": "absent du QS World University Rankings 2027 (topuniversities.com, relu le 2026-09-24)"
  },
  {
    "collection": "universities",
    "id": "peking-university-beijing",
    "attendu": {
      "ranking": "Parmi les plus prestigieuses de Chine"
    },
    "champs": {
      "ranking": "#13 mondial (QS 2027)"
    },
    "motif": "classé 13 au QS World University Rankings 2027 (topuniversities.com, relu le 2026-09-24) : le rang remplace le repère descriptif"
  },
  {
    "collection": "universities",
    "id": "seoul-national-university-seoul",
    "attendu": {
      "ranking": "Première université nationale de Corée du Sud"
    },
    "champs": {
      "ranking": "#38 mondial (QS 2027)"
    },
    "motif": "classé 38 au QS World University Rankings 2027 (topuniversities.com, relu le 2026-09-24) : le rang remplace le repère descriptif"
  },
  {
    "collection": "universities",
    "id": "kaist-daejeon",
    "attendu": {
      "ranking": "1re université scientifique de Corée du Sud"
    },
    "champs": {
      "ranking": "#65 mondial (QS 2027)"
    },
    "motif": "classé 65 au QS World University Rankings 2027 (topuniversities.com, relu le 2026-09-24) : le rang remplace le repère descriptif"
  },
  {
    "collection": "universities",
    "id": "postech-pohang",
    "attendu": {
      "ranking": "Université privée de sciences et d'ingénierie"
    },
    "champs": {
      "ranking": "#106 mondial (QS 2027)"
    },
    "motif": "classé 106 au QS World University Rankings 2027 (topuniversities.com, relu le 2026-09-24) : le rang remplace le repère descriptif"
  },
  {
    "collection": "universities",
    "id": "ku-leuven-louvain",
    "attendu": {
      "ranking": "Plus grande université de Belgique"
    },
    "champs": {
      "ranking": "#59 mondial (QS 2027)"
    },
    "motif": "classé 59 au QS World University Rankings 2027 (topuniversities.com, relu le 2026-09-24) : le rang remplace le repère descriptif"
  },
  {
    "collection": "universities",
    "id": "ghent-university-gand",
    "attendu": {
      "ranking": "Grande université flamande de recherche"
    },
    "champs": {
      "ranking": "#150 mondial (QS 2027)"
    },
    "motif": "classé 150 au QS World University Rankings 2027 (topuniversities.com, relu le 2026-09-24) : le rang remplace le repère descriptif"
  },
  {
    "collection": "universities",
    "id": "epfl-lausanne",
    "attendu": {
      "ranking": "Une des deux écoles polytechniques fédérales"
    },
    "champs": {
      "ranking": "#22 mondial (QS 2027)"
    },
    "motif": "classé 22 au QS World University Rankings 2027 (topuniversities.com, relu le 2026-09-24) : le rang remplace le repère descriptif"
  },
  {
    "collection": "universities",
    "id": "king-saud-university-riyad",
    "attendu": {
      "ranking": "Grande université publique saoudienne"
    },
    "champs": {
      "ranking": "#107 mondial (QS 2027)"
    },
    "motif": "classé 107 au QS World University Rankings 2027 (topuniversities.com, relu le 2026-09-24) : le rang remplace le repère descriptif"
  },
  {
    "collection": "universities",
    "id": "king-abdulaziz-university-jeddah",
    "attendu": {
      "ranking": "Une des plus grandes universités saoudiennes"
    },
    "champs": {
      "ranking": "#200 mondial (QS 2027)"
    },
    "motif": "classé 200 au QS World University Rankings 2027 (topuniversities.com, relu le 2026-09-24) : le rang remplace le repère descriptif"
  },
  {
    "collection": "universities",
    "id": "istanbul-technical-university-istanbul",
    "attendu": {
      "ranking": "Grande université technique publique"
    },
    "champs": {
      "ranking": "#279 mondial (QS 2027)"
    },
    "motif": "classé 279 au QS World University Rankings 2027 (topuniversities.com, relu le 2026-09-24) : le rang remplace le repère descriptif"
  },
  {
    "collection": "universities",
    "id": "koc-university-istanbul",
    "attendu": {
      "ranking": "Université privée de recherche"
    },
    "champs": {
      "ranking": "#329 mondial (QS 2027)"
    },
    "motif": "classé 329 au QS World University Rankings 2027 (topuniversities.com, relu le 2026-09-24) : le rang remplace le repère descriptif"
  },
  {
    "collection": "universities",
    "id": "sabanci-university-istanbul",
    "attendu": {
      "ranking": "Université privée de recherche"
    },
    "champs": {
      "ranking": "#357 mondial (QS 2027)"
    },
    "motif": "classé 357 au QS World University Rankings 2027 (topuniversities.com, relu le 2026-09-24) : le rang remplace le repère descriptif"
  },
  {
    "collection": "universities",
    "id": "bilkent-university-ankara",
    "attendu": {
      "ranking": "Première université privée turque (1984)"
    },
    "champs": {
      "ranking": "#454 mondial (QS 2027)"
    },
    "motif": "classé 454 au QS World University Rankings 2027 (topuniversities.com, relu le 2026-09-24) : le rang remplace le repère descriptif"
  },
  {
    "collection": "universities",
    "id": "sorbonne-universite-paris",
    "attendu": {
      "ranking": "Université de recherche pluridisciplinaire"
    },
    "champs": {
      "ranking": "#73 mondial (QS 2027)"
    },
    "motif": "classé 73 au QS World University Rankings 2027 (topuniversities.com, relu le 2026-09-24) : le rang remplace le repère descriptif"
  },
  {
    "collection": "universities",
    "id": "uclouvain-louvain-la-neuve",
    "attendu": {
      "ranking": "Plus grande université francophone belge"
    },
    "champs": {
      "ranking": "#196 mondial (QS 2027)"
    },
    "motif": "classé 196 au QS World University Rankings 2027 (topuniversities.com, relu le 2026-09-24) : le rang remplace le repère descriptif"
  },
  {
    "collection": "universities",
    "id": "universite-libre-de-bruxelles-bruxelles",
    "attendu": {
      "ranking": "Grande université francophone belge (LERU)"
    },
    "champs": {
      "ranking": "#248 mondial (QS 2027)"
    },
    "motif": "classé 248 au QS World University Rankings 2027 (topuniversities.com, relu le 2026-09-24) : le rang remplace le repère descriptif"
  },
  {
    "collection": "universities",
    "id": "universite-de-liege-liege",
    "attendu": {
      "ranking": "Université de référence en Wallonie"
    },
    "champs": {
      "ranking": "#364 mondial (QS 2027)"
    },
    "motif": "classé 364 au QS World University Rankings 2027 (topuniversities.com, relu le 2026-09-24) : le rang remplace le repère descriptif"
  },
  {
    "collection": "universities",
    "id": "nanjing-university-nanjing",
    "attendu": {
      "ranking": "Grande université publique historique"
    },
    "champs": {
      "ranking": "#90 mondial (QS 2027)"
    },
    "motif": "classé 90 au QS World University Rankings 2027 (topuniversities.com, relu le 2026-09-24) : le rang remplace le repère descriptif"
  },
  {
    "collection": "universities",
    "id": "rudn-university-moscow",
    "attendu": {
      "ranking": "Ancienne Université Patrice Lumumba (1960)"
    },
    "champs": {
      "ranking": "#359 mondial (QS 2027)"
    },
    "motif": "classé 359 au QS World University Rankings 2027 (topuniversities.com, relu le 2026-09-24) : le rang remplace le repère descriptif"
  },
  {
    "collection": "universities",
    "id": "university-of-zurich-zurich",
    "attendu": {
      "ranking": "Plus grande université suisse en effectifs"
    },
    "champs": {
      "ranking": "#98 mondial (QS 2027)"
    },
    "motif": "classé 98 au QS World University Rankings 2027 (topuniversities.com, relu le 2026-09-24) : le rang remplace le repère descriptif"
  },
  {
    "collection": "universities",
    "id": "american-university-in-cairo-le-caire",
    "attendu": {
      "ranking": "Université privée américaine, à New Cairo"
    },
    "champs": {
      "ranking": "#390 mondial (QS 2027)"
    },
    "motif": "classé 390 au QS World University Rankings 2027 (topuniversities.com, relu le 2026-09-24) : le rang remplace le repère descriptif"
  },
  {
    "collection": "universities",
    "id": "universite-de-bucarest-bucarest",
    "attendu": {
      "ranking": "Grande université publique roumaine"
    },
    "champs": {
      "ranking": "#801-850 mondial (QS 2027)"
    },
    "motif": "classé 801-850 au QS World University Rankings 2027 (topuniversities.com, relu le 2026-09-24) : le rang remplace le repère descriptif"
  },
  {
    "collection": "universities",
    "id": "princess-nourah-university-riyad",
    "attendu": {
      "ranking": "Parmi les plus grandes universités féminines"
    },
    "champs": {
      "ranking": "#801-850 mondial (QS 2027)"
    },
    "motif": "classé 801-850 au QS World University Rankings 2027 (topuniversities.com, relu le 2026-09-24) : le rang remplace le repère descriptif"
  },
  {
    "collection": "universities",
    "id": "universite-de-namur-namur",
    "attendu": {
      "ranking": "Sciences humaines et recherche en Wallonie"
    },
    "champs": {
      "ranking": "#801-850 mondial (QS 2027)"
    },
    "motif": "classé 801-850 au QS World University Rankings 2027 (topuniversities.com, relu le 2026-09-24) : le rang remplace le repère descriptif"
  }
];
