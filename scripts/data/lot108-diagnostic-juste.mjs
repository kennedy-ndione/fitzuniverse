/**
* ============================================================
* LOT 108 — LE DIAGNOSTIC NE PROPOSE QUE CE QU'ON PEUT OBTENIR
* (2026-09-26)
* ============================================================
*
* Charles : « regarde que le site propose des opportunités réelles et
* compatibles au profil ». Audit de 72 profils types (6 niveaux × 12
* destinations, 12 nationalités africaines, 8 domaines) sur le catalogue
* servi : trois familles de propositions impossibles, toutes écrites
* noir sur blanc dans les fiches, mais que le moteur ne savait pas lire.
*   1. Déjà inscrit sur place : JASSO sortait pour 54 profils sur 72,
*      Vanier pour 16.
*   2. Déjà dans le cycle : le mémoire Zeno Karl Schindler (24 profils
*      qui n'ont que leur licence), Türkiye Bursları Research (18
*      candidats au doctorat qui ne sont pas encore doctorants).
*   3. La discipline : l'EDIC de l'EPFL (informatique) proposée à des
*      étudiants en médecine ou en droit, l'IHEID à des informaticiens,
*      Reach Oxford, Koç et Sunway à des futurs médecins alors qu'elles
*      excluent la médecine.
* Ce lot pose l'information en champs lisibles (exigences
* deja_inscrit_sur_place et cycle_en_cours, domaines, domainesExclus) ;
* js/recommend-programs.js (accesDepuisLeProfil) les lit comme des
* filtres durs.
*
* EXÉCUTION :
*   node scripts\lot.mjs analyser 108-diagnostic-juste
*   node scripts\lot.mjs ecrire 108-diagnostic-juste
*   node scripts\lot.mjs verifier 108-diagnostic-juste
* ============================================================
*/

export const PATCHES = [
 {
  "collection": "scholarships",
  "id": "mastercard-foundation-scholars-um6p",
  "motif": "Lot 108 — programme 100 % féminin (UM6P, novembre 2025) (texte de la fiche, generalCriteria).",
  "attendu": {
   "eligibility": {
    "note": "Programme de la Mastercard Foundation pour de jeunes Africains qui ont peu de moyens financiers. La priorité va aux femmes et aux jeunes en situation de handicap."
   }
  },
  "champs": {
   "reserveeAuxFemmes": true,
   "eligibility": {
    "note": "Réservée aux jeunes femmes africaines qui ont peu de moyens financiers. La priorité va aux jeunes femmes du milieu rural, aux réfugiées, aux mères et aux personnes en situation de handicap."
   }
  }
 },
 {
  "collection": "scholarships",
  "id": "jasso-monbukagakusho-honors",
  "motif": "Lot 108 — réservée aux étudiants étrangers déjà inscrits au Japon, à leurs frais (texte de la fiche, generalCriteria).",
  "attendu": {
   "exigences": [
    "admission_prealable",
    "candidature_via_etablissement"
   ]
  },
  "champs": {
   "exigences": [
    "admission_prealable",
    "candidature_via_etablissement",
    "deja_inscrit_sur_place"
   ]
  }
 },
 {
  "collection": "scholarships",
  "id": "vanier-canada-graduate-scholarship",
  "motif": "Lot 108 — un candidat international doit déjà être inscrit en doctorat dans un établissement canadien (texte de la fiche, generalCriteria).",
  "attendu": {
   "exigences": [
    "admission_prealable",
    "candidature_via_etablissement"
   ]
  },
  "champs": {
   "exigences": [
    "admission_prealable",
    "candidature_via_etablissement",
    "deja_inscrit_sur_place"
   ]
  }
 },
 {
  "collection": "scholarships",
  "id": "turkiye-burslari-success",
  "motif": "Lot 108 — réservée aux étudiants déjà inscrits dans une université turque, à leurs frais (texte de la fiche, generalCriteria).",
  "attendu": {
   "exigences": [
    "admission_prealable"
   ]
  },
  "champs": {
   "exigences": [
    "admission_prealable",
    "deja_inscrit_sur_place"
   ]
  }
 },
 {
  "collection": "scholarships",
  "id": "friedrich-ebert-stiftung",
  "motif": "Lot 108 — il faut déjà être inscrit dans une université allemande (texte de la fiche, generalCriteria).",
  "attendu": {
   "exigences": [
    "admission_prealable"
   ]
  },
  "champs": {
   "exigences": [
    "admission_prealable",
    "deja_inscrit_sur_place"
   ]
  }
 },
 {
  "collection": "scholarships",
  "id": "rosa-luxemburg-stiftung",
  "motif": "Lot 108 — il faut déjà être inscrit dans une université allemande (texte de la fiche, generalCriteria).",
  "attendu": {
   "exigences": [
    "admission_prealable"
   ]
  },
  "champs": {
   "exigences": [
    "admission_prealable",
    "deja_inscrit_sur_place"
   ]
  }
 },
 {
  "collection": "scholarships",
  "id": "konrad-adenauer-stiftung",
  "motif": "Lot 108 — un candidat d'Afrique de l'Ouest passe par la procédure nationale, donc déjà inscrit en Allemagne (texte de la fiche, generalCriteria).",
  "attendu": {
   "exigences": [
    "admission_prealable",
    "certification_langue_requise"
   ]
  },
  "champs": {
   "exigences": [
    "admission_prealable",
    "certification_langue_requise",
    "deja_inscrit_sur_place"
   ]
  }
 },
 {
  "collection": "scholarships",
  "id": "zeno-karl-schindler-master-thesis",
  "motif": "Lot 108 — il faut déjà être inscrit en master : bourse de mémoire, pas d'entrée ; disciplines : Ingénierie, Lettres (texte de la fiche, generalCriteria).",
  "attendu": {
   "exigences": [
    "projet_recherche",
    "admission_prealable",
    "depot_par_courriel"
   ]
  },
  "champs": {
   "exigences": [
    "projet_recherche",
    "admission_prealable",
    "depot_par_courriel",
    "cycle_en_cours"
   ],
   "domaines": [
    "Ingénierie",
    "Lettres"
   ]
  }
 },
 {
  "collection": "scholarships",
  "id": "turkiye-burslari-research",
  "motif": "Lot 108 — il faut être doctorant au stade de la thèse, ou docteur (texte de la fiche, generalCriteria).",
  "attendu": {
   "exigences": [
    "projet_recherche"
   ]
  },
  "champs": {
   "exigences": [
    "projet_recherche",
    "cycle_en_cours"
   ]
  }
 },
 {
  "collection": "scholarships",
  "id": "epfl-edic-doctoral",
  "motif": "Lot 108 — disciplines : Informatique (texte de la fiche, generalCriteria).",
  "champs": {
   "domaines": [
    "Informatique"
   ]
  }
 },
 {
  "collection": "scholarships",
  "id": "iheid-scholarships",
  "motif": "Lot 108 — disciplines : Sciences sociales, Droit, Commerce, Lettres (texte de la fiche, generalCriteria).",
  "champs": {
   "domaines": [
    "Sciences sociales",
    "Droit",
    "Commerce",
    "Lettres"
   ]
  }
 },
 {
  "collection": "scholarships",
  "id": "bourses-master-aui",
  "motif": "Lot 108 — disciplines : Droit, Lettres, Sciences sociales (texte de la fiche, generalCriteria).",
  "champs": {
   "domaines": [
    "Droit",
    "Lettres",
    "Sciences sociales"
   ]
  }
 },
 {
  "collection": "scholarships",
  "id": "fao-hungarian-government-scholarship",
  "motif": "Lot 108 — disciplines : Agriculture, Sciences (texte de la fiche, generalCriteria).",
  "champs": {
   "domaines": [
    "Agriculture",
    "Sciences"
   ]
  }
 },
 {
  "collection": "scholarships",
  "id": "jads-japan-africa-dream",
  "motif": "Lot 108 — disciplines : Ingénierie, Agriculture, Médecine, Sciences (texte de la fiche, generalCriteria).",
  "champs": {
   "domaines": [
    "Ingénierie",
    "Agriculture",
    "Médecine",
    "Sciences"
   ]
  }
 },
 {
  "collection": "scholarships",
  "id": "ud-international-scholarship",
  "motif": "Lot 108 — disciplines : Agriculture, Ingénierie, Médecine, Informatique, Sciences (texte de la fiche, generalCriteria).",
  "champs": {
   "domaines": [
    "Agriculture",
    "Ingénierie",
    "Médecine",
    "Informatique",
    "Sciences"
   ]
  }
 },
 {
  "collection": "scholarships",
  "id": "bourses-cooperation-tunisie",
  "motif": "Lot 108 — disciplines : Informatique, Commerce, Sciences, Ingénierie (texte de la fiche, generalCriteria).",
  "champs": {
   "domaines": [
    "Informatique",
    "Commerce",
    "Sciences",
    "Ingénierie"
   ]
  }
 },
 {
  "collection": "scholarships",
  "id": "reach-oxford-scholarship",
  "motif": "Lot 108 — exclut : Médecine (texte de la fiche, generalCriteria).",
  "champs": {
   "domainesExclus": [
    "Médecine"
   ]
  }
 },
 {
  "collection": "scholarships",
  "id": "koc-university-merit-scholarships",
  "motif": "Lot 108 — exclut : Médecine (texte de la fiche, generalCriteria).",
  "champs": {
   "domainesExclus": [
    "Médecine"
   ]
  }
 },
 {
  "collection": "scholarships",
  "id": "sunway-academic-excellence-scholarships",
  "motif": "Lot 108 — exclut : Médecine (texte de la fiche, generalCriteria).",
  "champs": {
   "domainesExclus": [
    "Médecine"
   ]
  }
 },
 {
  "collection": "scholarships",
  "id": "romanian-government-scholarship",
  "motif": "Lot 108 — exclut : Médecine (texte de la fiche, generalCriteria).",
  "champs": {
   "domainesExclus": [
    "Médecine"
   ]
  }
 },
 {
  "collection": "scholarships",
  "id": "iccr-africa-scholarship-scheme",
  "motif": "Lot 108 — exclut : Médecine, Droit (texte de la fiche, generalCriteria).",
  "champs": {
   "domainesExclus": [
    "Médecine",
    "Droit"
   ]
  }
 },
 {
  "collection": "scholarships",
  "id": "unil-master-grants",
  "motif": "Lot 108 — exclut : Médecine (texte de la fiche, generalCriteria).",
  "champs": {
   "domainesExclus": [
    "Médecine"
   ]
  }
 }
];

export const UNIVERSITIES = [];
export const SCHOLARSHIPS = [];
export const LINKS = [];
export const SUPPRESSIONS = [];
