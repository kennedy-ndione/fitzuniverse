/**
 * ============================================================
 * LOT 46 — LES 28 DOMAINES QUE LE LOT 42 N'AVAIT PAS PU LIRE
 * (12 septembre 2026)
 * ============================================================
 *
 * CE QUE CE LOT FINIT
 * -------------------
 * Le lot 42 (2026-09-05) avait rempli le champ `fields` de 48 des 76
 * universités qui n'en portaient aucun, en lisant leur page de
 * composantes. Vingt-huit sites refusaient la lecture automatique ou
 * n'avaient pas de page lisible : ils ont été remis à Charles dans
 * scripts/data/domaines-a-completer-2026-09-05.md. Il les a relevés
 * A LA MAIN, site par site, et les a rendus le 2026-09-12. Ce lot
 * écrit ces 28 relevés, et RIEN D'AUTRE : aucune université créée,
 * aucune bourse touchée, aucun programme.
 *
 * Après ce lot, plus une seule université du catalogue ne reste sans
 * domaine.
 *
 * CE QUE ÇA CHANGE (mesure du 2026-09-05, à refaire après ce lot)
 * ---------------------------------------------------------------
 * Domaines remplis ET poids du domaine porté de 1 à 3 points : deux
 * étudiants de domaines différents passent de 11 recommandations
 * identiques sur 12 à 3 sur 12. C'est la différence entre un catalogue
 * et un conseil. ⚠️ LE POIDS N'EST PAS DANS CE LOT : il vit dans
 * scoreProgram() (js/recommend-programs.js) et reste à porter à 3.
 *
 * LA SOURCE, DITE HONNÊTEMENT
 * ---------------------------
 * Les motifs du lot 42 citaient l'URL, la date ET la liste des
 * composantes trouvées. Ceux-ci citent l'URL, la date et le relevé de
 * Charles — il a transmis les familles, pas le détail des facultés.
 * La preuve est donc PLUS COURTE que celle du lot 42, et c'est écrit
 * tel quel plutôt que maquillé. Trois relevés méritent un second
 * regard, notés dans leur motif.
 *
 * PAS D'`attendu`, ET C'EST DÉLIBÉRÉ
 * ----------------------------------
 * Le runner bute sur un `attendu` portant sur un champ ABSENT (piège
 * connu, incident `attendu:{image:""}`). Ces 28 documents n'ont jamais
 * porté `fields` : selon qu'il soit absent ou présent et vide, un
 * `attendu:{fields:[]}` passerait ou bloquerait. `attendu` étant
 * facultatif (scripts/lot-validate.mjs), il est omis. La garde reste
 * `analyser`, qui montre l'écart avant toute écriture.
 *
 * VOCABULAIRE FERMÉ — les dix familles de familleDeDomaine() :
 * Ingénierie, Sciences, Droit, Médecine, Sciences sociales, Commerce,
 * Lettres, Informatique, Architecture, Agriculture. Aucune autre
 * valeur n'est comparable par domaineCorrespond()
 * (js/recommend-programs.js).
 * ============================================================
 */

export const PATCHES = [
  {
    "collection": "universities",
    "id": "universite-alger-1-benyoucef-benkhedda-alger",
    "champs": {
      "fields": [
        "Sciences",
        "Droit",
        "Médecine",
        "Informatique"
      ]
    },
    "motif": "Relevé par Charles le 2026-09-12 sur la page des composantes de Université d'Alger 1 – Benyoucef Benkhedda (https://www.univ-alger.dz/). Source : lecture humaine du site, pas de lecture automatique — ces 28 établissements étaient précisément ceux que le lot 42 n'avait pas pu lire."
  },
  {
    "collection": "universities",
    "id": "universite-constantine-1-freres-mentouri-constantine",
    "champs": {
      "fields": [
        "Ingénierie",
        "Sciences",
        "Droit",
        "Lettres",
        "Agriculture"
      ]
    },
    "motif": "Relevé par Charles le 2026-09-12 sur la page des composantes de Université Frères Mentouri – Constantine 1 (https://www.umc.edu.dz/). Source : lecture humaine du site, pas de lecture automatique — ces 28 établissements étaient précisément ceux que le lot 42 n'avait pas pu lire."
  },
  {
    "collection": "universities",
    "id": "king-abdulaziz-university-jeddah",
    "champs": {
      "fields": [
        "Ingénierie",
        "Sciences",
        "Droit",
        "Médecine",
        "Sciences sociales",
        "Commerce",
        "Lettres",
        "Informatique",
        "Architecture",
        "Agriculture"
      ]
    },
    "motif": "Relevé par Charles le 2026-09-12 sur la page des composantes de King Abdulaziz University (https://www.kau.edu.sa). Source : lecture humaine du site, pas de lecture automatique — ces 28 établissements étaient précisément ceux que le lot 42 n'avait pas pu lire. Précision de Charles : les dix familles y sont enseignées."
  },
  {
    "collection": "universities",
    "id": "nanjing-university-nanjing",
    "champs": {
      "fields": [
        "Ingénierie",
        "Sciences",
        "Droit",
        "Médecine",
        "Sciences sociales",
        "Commerce",
        "Lettres",
        "Informatique",
        "Architecture"
      ]
    },
    "motif": "Relevé par Charles le 2026-09-12 sur la page des composantes de Université de Nankin (Nanjing University) (https://www.nju.edu.cn). Source : lecture humaine du site, pas de lecture automatique — ces 28 établissements étaient précisément ceux que le lot 42 n'avait pas pu lire."
  },
  {
    "collection": "universities",
    "id": "peking-university-beijing",
    "champs": {
      "fields": [
        "Ingénierie",
        "Sciences",
        "Droit",
        "Médecine",
        "Sciences sociales",
        "Commerce",
        "Lettres",
        "Informatique",
        "Architecture",
        "Agriculture"
      ]
    },
    "motif": "Relevé par Charles le 2026-09-12 sur la page des composantes de Peking University (https://www.pku.edu.cn). Source : lecture humaine du site, pas de lecture automatique — ces 28 établissements étaient précisément ceux que le lot 42 n'avait pas pu lire. Précision de Charles : les dix familles y sont enseignées."
  },
  {
    "collection": "universities",
    "id": "seoul-national-university-seoul",
    "champs": {
      "fields": [
        "Ingénierie",
        "Sciences",
        "Droit",
        "Médecine",
        "Sciences sociales",
        "Commerce",
        "Lettres",
        "Informatique",
        "Architecture",
        "Agriculture"
      ]
    },
    "motif": "Relevé par Charles le 2026-09-12 sur la page des composantes de Seoul National University (https://en.snu.ac.kr). Source : lecture humaine du site, pas de lecture automatique — ces 28 établissements étaient précisément ceux que le lot 42 n'avait pas pu lire. Précision de Charles : les dix familles y sont enseignées."
  },
  {
    "collection": "universities",
    "id": "kaist-daejeon",
    "champs": {
      "fields": [
        "Ingénierie",
        "Sciences",
        "Sciences sociales",
        "Commerce",
        "Lettres",
        "Informatique"
      ]
    },
    "motif": "Relevé par Charles le 2026-09-12 sur la page des composantes de KAIST (Korea Advanced Institute of Science and Technology) (https://www.kaist.ac.kr). Source : lecture humaine du site, pas de lecture automatique — ces 28 établissements étaient précisément ceux que le lot 42 n'avait pas pu lire."
  },
  {
    "collection": "universities",
    "id": "korea-national-university-of-arts-seoul",
    "champs": {
      "fields": [
        "Architecture"
      ]
    },
    "motif": "Relevé par Charles le 2026-09-12 sur la page des composantes de Korea National University of Arts (K-Arts) (https://www.karts.ac.kr). Source : lecture humaine du site, pas de lecture automatique — ces 28 établissements étaient précisément ceux que le lot 42 n'avait pas pu lire. Précision de Charles : école d'arts : une seule des dix familles retenue."
  },
  {
    "collection": "universities",
    "id": "universite-senghor-alexandrie",
    "champs": {
      "fields": [
        "Sciences sociales",
        "Commerce",
        "Lettres"
      ]
    },
    "motif": "Relevé par Charles le 2026-09-12 sur la page des composantes de Université Senghor d'Alexandrie (https://usenghor-francophonie.org). Source : lecture humaine du site, pas de lecture automatique — ces 28 établissements étaient précisément ceux que le lot 42 n'avait pas pu lire."
  },
  {
    "collection": "universities",
    "id": "universite-paris-cite-paris",
    "champs": {
      "fields": [
        "Ingénierie",
        "Sciences",
        "Droit",
        "Médecine",
        "Sciences sociales",
        "Commerce",
        "Lettres",
        "Informatique"
      ]
    },
    "motif": "Relevé par Charles le 2026-09-12 sur la page des composantes de Université Paris Cité (https://u-paris.fr). Source : lecture humaine du site, pas de lecture automatique — ces 28 établissements étaient précisément ceux que le lot 42 n'avait pas pu lire."
  },
  {
    "collection": "universities",
    "id": "universite-paris-saclay-orsay",
    "champs": {
      "fields": [
        "Ingénierie",
        "Sciences",
        "Droit",
        "Médecine",
        "Sciences sociales",
        "Commerce",
        "Lettres",
        "Informatique",
        "Agriculture"
      ]
    },
    "motif": "Relevé par Charles le 2026-09-12 sur la page des composantes de Université Paris-Saclay (https://www.universite-paris-saclay.fr). Source : lecture humaine du site, pas de lecture automatique — ces 28 établissements étaient précisément ceux que le lot 42 n'avait pas pu lire."
  },
  {
    "collection": "universities",
    "id": "aix-marseille-universite-marseille",
    "champs": {
      "fields": [
        "Ingénierie",
        "Sciences",
        "Droit",
        "Médecine",
        "Sciences sociales",
        "Commerce",
        "Lettres",
        "Informatique"
      ]
    },
    "motif": "Relevé par Charles le 2026-09-12 sur la page des composantes de Aix-Marseille Université (https://www.univ-amu.fr). Source : lecture humaine du site, pas de lecture automatique — ces 28 établissements étaient précisément ceux que le lot 42 n'avait pas pu lire. Précision de Charles : Agriculture écartée à dessein : un master « sciences et technologies de l'agriculture et de l'alimentation » existe, mais aucune faculté de production agricole ni école d'agronomie à proprement parler."
  },
  {
    "collection": "universities",
    "id": "insa-lyon-villeurbanne",
    "champs": {
      "fields": [
        "Ingénierie",
        "Sciences",
        "Informatique",
        "Architecture"
      ]
    },
    "motif": "Relevé par Charles le 2026-09-12 sur la page des composantes de INSA Lyon (https://www.insa-lyon.fr). Source : lecture humaine du site, pas de lecture automatique — ces 28 établissements étaient précisément ceux que le lot 42 n'avait pas pu lire."
  },
  {
    "collection": "universities",
    "id": "universite-de-lille-lille",
    "champs": {
      "fields": [
        "Ingénierie",
        "Sciences",
        "Droit",
        "Médecine",
        "Sciences sociales",
        "Commerce",
        "Lettres",
        "Informatique",
        "Architecture"
      ]
    },
    "motif": "Relevé par Charles le 2026-09-12 sur la page des composantes de Université de Lille (https://www.univ-lille.fr). Source : lecture humaine du site, pas de lecture automatique — ces 28 établissements étaient précisément ceux que le lot 42 n'avait pas pu lire."
  },
  {
    "collection": "universities",
    "id": "universite-de-lorraine-nancy",
    "champs": {
      "fields": [
        "Ingénierie",
        "Sciences",
        "Droit",
        "Médecine",
        "Sciences sociales",
        "Commerce",
        "Lettres",
        "Informatique",
        "Agriculture"
      ]
    },
    "motif": "Relevé par Charles le 2026-09-12 sur la page des composantes de Université de Lorraine (https://www.univ-lorraine.fr). Source : lecture humaine du site, pas de lecture automatique — ces 28 établissements étaient précisément ceux que le lot 42 n'avait pas pu lire."
  },
  {
    "collection": "universities",
    "id": "universite-de-rennes-rennes",
    "champs": {
      "fields": [
        "Ingénierie",
        "Sciences",
        "Droit",
        "Médecine",
        "Sciences sociales",
        "Commerce",
        "Lettres",
        "Informatique",
        "Agriculture"
      ]
    },
    "motif": "Relevé par Charles le 2026-09-12 sur la page des composantes de Université de Rennes (https://www.univ-rennes.fr). Source : lecture humaine du site, pas de lecture automatique — ces 28 établissements étaient précisément ceux que le lot 42 n'avait pas pu lire."
  },
  {
    "collection": "universities",
    "id": "universite-sorbonne-paris-nord-villetaneuse",
    "champs": {
      "fields": [
        "Ingénierie",
        "Sciences",
        "Droit",
        "Médecine",
        "Sciences sociales",
        "Commerce",
        "Lettres",
        "Informatique"
      ]
    },
    "motif": "Relevé par Charles le 2026-09-12 sur la page des composantes de Université Sorbonne Paris Nord (https://www.univ-spn.fr). Source : lecture humaine du site, pas de lecture automatique — ces 28 établissements étaient précisément ceux que le lot 42 n'avait pas pu lire."
  },
  {
    "collection": "universities",
    "id": "mines-paris-psl-paris",
    "champs": {
      "fields": [
        "Ingénierie",
        "Sciences",
        "Informatique"
      ]
    },
    "motif": "Relevé par Charles le 2026-09-12 sur la page des composantes de Mines Paris – PSL (https://www.minesparis.psl.eu). Source : lecture humaine du site, pas de lecture automatique — ces 28 établissements étaient précisément ceux que le lot 42 n'avait pas pu lire."
  },
  {
    "collection": "universities",
    "id": "universita-di-genova-genes",
    "champs": {
      "fields": [
        "Ingénierie",
        "Sciences",
        "Droit",
        "Médecine",
        "Sciences sociales",
        "Commerce",
        "Lettres",
        "Informatique",
        "Architecture"
      ]
    },
    "motif": "Relevé par Charles le 2026-09-12 sur la page des composantes de Università degli Studi di Genova (https://unige.it). Source : lecture humaine du site, pas de lecture automatique — ces 28 établissements étaient précisément ceux que le lot 42 n'avait pas pu lire."
  },
  {
    "collection": "universities",
    "id": "usiu-africa-nairobi",
    "champs": {
      "fields": [
        "Sciences",
        "Médecine",
        "Sciences sociales",
        "Commerce",
        "Lettres",
        "Informatique"
      ]
    },
    "motif": "Relevé par Charles le 2026-09-12 sur la page des composantes de United States International University-Africa (USIU-Africa) (https://www.usiu.ac.ke). Source : lecture humaine du site, pas de lecture automatique — ces 28 établissements étaient précisément ceux que le lot 42 n'avait pas pu lire."
  },
  {
    "collection": "universities",
    "id": "universite-mohammed-vi-polytechnique-benguerir",
    "champs": {
      "fields": [
        "Ingénierie",
        "Sciences",
        "Droit",
        "Médecine",
        "Sciences sociales",
        "Commerce",
        "Informatique",
        "Architecture",
        "Agriculture"
      ]
    },
    "motif": "Relevé par Charles le 2026-09-12 sur la page des composantes de Université Mohammed VI Polytechnique (UM6P) (https://um6p.ma/). Source : lecture humaine du site, pas de lecture automatique — ces 28 établissements étaient précisément ceux que le lot 42 n'avait pas pu lire."
  },
  {
    "collection": "universities",
    "id": "spbu-saint-petersbourg",
    "champs": {
      "fields": [
        "Sciences",
        "Droit",
        "Médecine",
        "Sciences sociales",
        "Commerce",
        "Lettres",
        "Informatique"
      ]
    },
    "motif": "Relevé par Charles le 2026-09-12 sur la page des composantes de Université d'État de Saint-Pétersbourg (SPbU) (https://english.spbu.ru). Source : lecture humaine du site, pas de lecture automatique — ces 28 établissements étaient précisément ceux que le lot 42 n'avait pas pu lire."
  },
  {
    "collection": "universities",
    "id": "university-of-zurich-zurich",
    "champs": {
      "fields": [
        "Sciences",
        "Droit",
        "Médecine",
        "Sciences sociales",
        "Commerce",
        "Lettres",
        "Informatique"
      ]
    },
    "motif": "Relevé par Charles le 2026-09-12 sur la page des composantes de University of Zurich (UZH) (https://www.uzh.ch). Source : lecture humaine du site, pas de lecture automatique — ces 28 établissements étaient précisément ceux que le lot 42 n'avait pas pu lire."
  },
  {
    "collection": "universities",
    "id": "universite-de-lausanne-lausanne",
    "champs": {
      "fields": [
        "Sciences",
        "Droit",
        "Médecine",
        "Sciences sociales",
        "Commerce",
        "Lettres"
      ]
    },
    "motif": "Relevé par Charles le 2026-09-12 sur la page des composantes de Université de Lausanne (https://www.unil.ch). Source : lecture humaine du site, pas de lecture automatique — ces 28 établissements étaient précisément ceux que le lot 42 n'avait pas pu lire."
  },
  {
    "collection": "universities",
    "id": "universite-de-carthage-tunis",
    "champs": {
      "fields": [
        "Ingénierie",
        "Sciences",
        "Droit",
        "Sciences sociales",
        "Commerce",
        "Lettres",
        "Informatique",
        "Architecture",
        "Agriculture"
      ]
    },
    "motif": "Relevé par Charles le 2026-09-12 sur la page des composantes de Université de Carthage (https://ucar.rnu.tn/). Source : lecture humaine du site, pas de lecture automatique — ces 28 établissements étaient précisément ceux que le lot 42 n'avait pas pu lire."
  },
  {
    "collection": "universities",
    "id": "universite-de-sfax-sfax",
    "champs": {
      "fields": [
        "Ingénierie",
        "Sciences",
        "Droit",
        "Médecine",
        "Sciences sociales",
        "Commerce",
        "Lettres",
        "Informatique"
      ]
    },
    "motif": "Relevé par Charles le 2026-09-12 sur la page des composantes de Université de Sfax (https://www.uss.rnu.tn/). Source : lecture humaine du site, pas de lecture automatique — ces 28 établissements étaient précisément ceux que le lot 42 n'avait pas pu lire."
  },
  {
    "collection": "universities",
    "id": "universite-de-sousse-sousse",
    "champs": {
      "fields": [
        "Ingénierie",
        "Sciences",
        "Droit",
        "Médecine",
        "Sciences sociales",
        "Commerce",
        "Lettres",
        "Informatique",
        "Agriculture"
      ]
    },
    "motif": "Relevé par Charles le 2026-09-12 sur la page des composantes de Université de Sousse (https://www.uc.rnu.tn/). Source : lecture humaine du site, pas de lecture automatique — ces 28 établissements étaient précisément ceux que le lot 42 n'avait pas pu lire."
  },
  {
    "collection": "universities",
    "id": "universite-de-tunis-el-manar-tunis",
    "champs": {
      "fields": [
        "Ingénierie",
        "Sciences",
        "Droit",
        "Médecine",
        "Sciences sociales",
        "Lettres",
        "Informatique"
      ]
    },
    "motif": "Relevé par Charles le 2026-09-12 sur la page des composantes de Université de Tunis El Manar (https://utm.rnu.tn/utm/). Source : lecture humaine du site, pas de lecture automatique — ces 28 établissements étaient précisément ceux que le lot 42 n'avait pas pu lire."
  }
];
