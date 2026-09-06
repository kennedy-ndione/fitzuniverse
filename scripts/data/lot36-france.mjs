// ============================================================
// FitzUniverse — Lot 36 : LA FRANCE, CONSOLIDATION DES BOURSES OUVERTES
// (recherche du 2026-09-03, sites des établissements + topuniversities)
//
// POURQUOI
// Après le lot 35, la France compte 10 bourses mais 8 établissements ;
// les trois bourses SANS établissement imposé — Eiffel, France
// Excellence-Major, Programme France-Sénégal — n'étaient rattachées
// qu'à 3 à 7 universités. Décision utilisateur (2026-09-03) : « je veux
// juste que notre catalogue soit solide » — 18 établissements de plus,
// répartis en trois familles :
//   - 11 universités publiques de RÉGION (Strasbourg, Aix-Marseille,
//     Toulouse, Bordeaux, Lille, Montpellier, Nantes, Rennes, Lorraine,
//     Côte d'Azur, Lyon 1) ;
//   - 3 parisiennes (Paris 1 Panthéon-Sorbonne, Dauphine-PSL, Sorbonne
//     Paris Nord) ;
//   - 4 grandes écoles (HEC, ESSEC, INSA Lyon, Mines Paris-PSL).
// Ce lot ne crée AUCUNE bourse : 18 universités + 3 liens.
//
// LA RÈGLE DU PORTAIL (lots 33/35) — les 14 universités publiques
// portent « Études en France » (plateforme d'État, procédure Campus
// France Sénégal). Les 4 écoles portent leur portail propre :
//   HEC → page d'admission des masters (le portail
//     masters.myapplication.hec.fr n'a pas pu être chargé depuis le
//     sandbox ; la page vérifiée y mène) ;
//   ESSEC → formulaire myapply (vérifié) ;
//   INSA Lyon → plateforme de candidature du Groupe INSA (vérifiée) ;
//   Mines Paris → page d'admission du cycle ingénieur civil (vérifiée ;
//     le portail PSL Talent n'a pas pu être chargé).
//
// LES LIENS
//   Eiffel (Master + Doctorat, lus en base) → 17 des 18 : preuve d'une
//     page Eiffel PROPRE à l'établissement pour chacun. EXCEPTION :
//     Université de Montpellier — aucune page Eiffel trouvée sur
//     umontpellier.fr (les pages trouvées sont celles de Montpellier 3
//     et de l'Institut Agro, établissements distincts). Même doctrine
//     que l'ENS-PSL au lot 35 : pas de preuve, pas de lien.
//   France-Sénégal (Master + Doctorat) → les 14 publiques + INSA Lyon
//     + Mines Paris (établissements publics, où le statut de boursier
//     du gouvernement français s'applique pleinement). PAS HEC ni
//     ESSEC : la bourse ne couvre pas des frais de 30 000 à 59 000 €.
//   France Excellence-Major (Licence + Master, bacheliers des lycées
//     français) → les 14 publiques + INSA Lyon (entrée POST-BAC, c'est
//     précisément le public). PAS HEC/ESSEC/Mines (entrée post-licence
//     ou classes préparatoires).
//
// PIÈGE `ranking` (lot 32) : « # » réservé à un rang MONDIAL d'une
// édition nommée — QS 2026 ici (topuniversities, fiche de chaque
// établissement ; cohérent avec le lot 35). Les rangs par tranche
// s'écrivent « Rang 711-720 mondial (QS 2026) », sans « # ». HEC et
// ESSEC n'ont PAS de rang général QS (classements par discipline
// seulement) ; Dauphine et Mines sont classées à travers PSL (#28).
//
// TOULOUSE : l'université Toulouse III – Paul Sabatier est devenue
// « Université de Toulouse » le 1er janvier 2025 (utoulouse.fr) — nom
// et site retenus tels quels, l'ancien nom rappelé dans la description.
//
// PHOTOS : scripts/add-lot36-photos.mjs — 18 photos de ville, sujets
// tous distincts de l'existant (voir l'en-tête du script). HEC et ESSEC
// tentent Wikimedia Commons d'abord (crédit obligatoire), repli Unsplash
// sur les paysages des communes voisines. Le module refuse de se charger
// si un fichier manque (incident du lot 35).
//
// PROGRAMMES ATTENDUS : Eiffel 17 × 2 = 34 ; France-Sénégal 16 × 2 = 32 ;
// Excellence-Major 15 × 2 = 30 ; total 96.
// ============================================================

import { existsSync } from "node:fs";

const ETUDES_EN_FRANCE = "https://pastel.diplomatie.gouv.fr/etudesenfrance/dyn/public/authentification/login.html";

export const UNIVERSITIES = [
  {
    id: "universite-de-strasbourg-strasbourg",
    data: {
      name: "Université de Strasbourg",
      city: "Strasbourg",
      country: "France",
      image: "strasbourg.jpg",
      flag: "fr.svg",
      ranking: "#420 mondial (QS 2026)",
      description: "Grande université pluridisciplinaire à vocation européenne et franco-allemande : 56 000 étudiants dont 13 000 internationaux, 35 facultés et instituts, 77 laboratoires, 20 prix Nobel et Kavli associés. Campus Esplanade en centre-ville, partenariats CNRS, Inserm, Inria, INRAE. Le dossier Eiffel master se remet au responsable du master (campagne 2026 : avant le 21 novembre) ; le volet doctorat passe par le pôle international de la recherche. Une plateforme d'accueil international dédiée guide l'arrivée.",
      officialWebsite: "https://www.unistra.fr",
      applicationPortalUrl: ETUDES_EN_FRANCE,
      fields: []
    }
  },
  {
    id: "aix-marseille-universite-marseille",
    data: {
      name: "Aix-Marseille Université",
      city: "Marseille",
      country: "France",
      image: "marseille.jpg",
      flag: "fr.svg",
      ranking: "#428 mondial (QS 2026)",
      description: "La plus grande université francophone : 84 000 étudiants dont 12 000 internationaux, cinq campus entre Aix-en-Provence et Marseille, tous les grands domaines avec un ancrage méditerranéen. Deux aides propres à connaître : l'initiative A*MIDEX, qui exonère jusqu'à 75 % des droits différenciés pour certains étudiants internationaux, et la bourse d'excellence TIGER (jusqu'à 10 000 € par an et un logement) dans les programmes gradués. Eiffel master : formulaire AMU avant la mi-novembre ; doctorat via l'école doctorale et le directeur de thèse.",
      officialWebsite: "https://www.univ-amu.fr",
      applicationPortalUrl: ETUDES_EN_FRANCE,
      fields: []
    }
  },
  {
    id: "universite-de-toulouse-toulouse",
    data: {
      name: "Université de Toulouse",
      city: "Toulouse",
      country: "France",
      image: "toulouse.jpg",
      flag: "fr.svg",
      ranking: "#587 mondial (QS 2026)",
      description: "Nouveau nom, depuis le 1er janvier 2025, de l'université Toulouse III – Paul Sabatier : 37 000 étudiants, 1 530 doctorants, 74 laboratoires, campus principal de Rangueil. Sciences, santé, sport, technologies et ingénierie, dans l'écosystème toulousain de l'aéronautique, du spatial et de la santé (CNES, Airbus, CHU, Oncopole). Eiffel master et doctorat déposés auprès de la direction des mobilités internationales (campagne 2026-2027 : avant le 30 novembre). Top 400 du classement de Shanghai.",
      officialWebsite: "https://www.utoulouse.fr",
      applicationPortalUrl: ETUDES_EN_FRANCE,
      fields: []
    }
  },
  {
    id: "universite-de-bordeaux-bordeaux",
    data: {
      name: "Université de Bordeaux",
      city: "Bordeaux",
      country: "France",
      image: "bordeaux.jpg",
      flag: "fr.svg",
      ranking: "#494 mondial (QS 2026)",
      description: "Université d'excellence (IdEx) : 54 000 étudiants dont 7 600 internationaux, quatre collèges de formation (droit-économie-gestion, santé, sciences de l'homme, sciences et technologies), l'Institut des sciences de la vigne et du vin, 8 écoles doctorales. Grands programmes de recherche en neurosciences (BRAIN_2030), photonique et sciences du végétal ; nombreux masters Erasmus Mundus et parcours en anglais. Eiffel master : candidature obligatoirement PORTÉE par l'université (contact dédié) ; doctorat via le directeur de thèse. Guichet unique d'accueil des étudiants internationaux.",
      officialWebsite: "https://www.u-bordeaux.fr",
      applicationPortalUrl: ETUDES_EN_FRANCE,
      fields: []
    }
  },
  {
    id: "universite-de-lille-lille",
    data: {
      name: "Université de Lille",
      city: "Lille",
      country: "France",
      image: "lille.jpg",
      flag: "fr.svg",
      ranking: "#654 mondial (QS 2026)",
      description: "78 000 étudiants dont 9 900 internationaux, 64 unités de recherche, dix sites de campus (Cité scientifique à Villeneuve-d'Ascq, Pont-de-Bois, santé à Lille). Établissement public expérimental intégrant quatre écoles : ENSAIT, architecture, ESJ Lille (journalisme) et Sciences Po Lille. Programmes gradués avec bourses d'excellence pour les masters. Procédure Eiffel en trois temps : contact du responsable de formation à la mi-septembre, commission interne fin novembre, envoi à Campus France début janvier — le calendrier de chaque campagne est publié sur le site de la direction des mobilités internationales.",
      officialWebsite: "https://www.univ-lille.fr",
      applicationPortalUrl: ETUDES_EN_FRANCE,
      fields: []
    }
  },
  {
    id: "universite-de-montpellier-montpellier",
    data: {
      name: "Université de Montpellier",
      city: "Montpellier",
      country: "France",
      image: "montpellier.jpg",
      flag: "fr.svg",
      ranking: "#430 mondial (QS 2026)",
      description: "54 000 étudiants, 17 facultés et écoles, 81 structures de recherche ; la faculté de médecine la plus ancienne d'Europe en activité, Polytech Montpellier, et le premier rang mondial en écologie au classement de Shanghai par discipline. Programme IDIL : 13 parcours de master enseignés en anglais (bio-santé, chimie, agronomie, eau et terre, ingénierie, management…). PIÈGE : le site de l'université ne publie pas de page Eiffel propre — ne pas confondre avec l'université Paul-Valéry Montpellier 3 ni l'Institut Agro, établissements distincts qui, eux, en publient une. Label « Bienvenue en France ».",
      officialWebsite: "https://www.umontpellier.fr",
      applicationPortalUrl: ETUDES_EN_FRANCE,
      fields: []
    }
  },
  {
    id: "nantes-universite-nantes",
    data: {
      name: "Nantes Université",
      city: "Nantes",
      country: "France",
      image: "nantes.jpg",
      flag: "fr.svg",
      ranking: "Rang 851-900 mondial (QS 2026)",
      description: "42 000 étudiants dont 5 500 internationaux ; établissement public expérimental (2022) qui regroupe l'université, Centrale Nantes, l'école d'architecture, les beaux-arts, le CHU et l'Inserm. Sciences et technologies (Polytech Nantes), santé, droit, économie-gestion (IAE), lettres et sciences humaines ; campus à Nantes, Saint-Nazaire et La Roche-sur-Yon. PIÈGE Eiffel : une candidature à la formation, distincte de la demande de bourse, est exigée en parallèle — dossier à déposer auprès de l'université avant la mi-novembre (campagne 2026), volets master et doctorat séparés.",
      officialWebsite: "https://www.univ-nantes.fr",
      applicationPortalUrl: ETUDES_EN_FRANCE,
      fields: []
    }
  },
  {
    id: "universite-de-rennes-rennes",
    data: {
      name: "Université de Rennes",
      city: "Rennes",
      country: "France",
      image: "rennes.jpg",
      flag: "fr.svg",
      ranking: "Rang 711-720 mondial (QS 2026)",
      description: "Créée en 2023 à partir de Rennes 1 : 36 000 étudiants, 36 unités de recherche, cinq écoles composantes (EHESP, ENS Rennes, INSA Rennes, Sciences Po Rennes, chimie). Points forts en mathématiques, informatique (IRISA/Inria), chimie, physique, santé, droit et gestion ; six campus dont Beaulieu et Villejean-Santé. Les bourses Eiffel y sont CIBLÉES sur six domaines (ingénierie, transition écologique, mathématiques et numérique, biologie-santé, droit et science politique, économie-gestion) avec une pré-candidature début novembre ; cinq lauréats à la campagne 2025.",
      officialWebsite: "https://www.univ-rennes.fr",
      applicationPortalUrl: ETUDES_EN_FRANCE,
      fields: []
    }
  },
  {
    id: "universite-de-lorraine-nancy",
    data: {
      name: "Université de Lorraine",
      city: "Nancy",
      country: "France",
      image: "nancy.jpg",
      flag: "fr.svg",
      ranking: "Rang 751-760 mondial (QS 2026)",
      description: "60 000 étudiants, 1 900 doctorants, 60 laboratoires, deux pôles (Nancy et Metz) et 38 sites en Grand Est. Onze écoles d'ingénieurs intégrées (Mines Nancy, ENSEM, ENSAIA, ENSG, Polytech Nancy, ENSTIB…) et des points forts en matériaux, énergie, géosciences, informatique et mathématiques (Loria), agronomie et forêt, santé. Site d'accueil « Welcome » en anglais décrivant la procédure interne Eiffel (master et doctorat) ; le calendrier de la campagne est à demander au service concerné, le site ne l'affiche pas.",
      officialWebsite: "https://www.univ-lorraine.fr",
      applicationPortalUrl: ETUDES_EN_FRANCE,
      fields: []
    }
  },
  {
    id: "universite-cote-d-azur-nice",
    data: {
      name: "Université Côte d'Azur",
      city: "Nice",
      country: "France",
      image: "nice.jpg",
      flag: "fr.svg",
      ranking: "#688 mondial (QS 2026)",
      description: "Université d'excellence (IdEx) organisée en huit écoles universitaires de recherche de type graduate schools : 32 000 étudiants, 50 laboratoires, institut 3IA Côte d'Azur (intelligence artificielle) et pôle de Sophia Antipolis. Campus à Nice (Valrose, Carlone, Saint-Jean-d'Angély), Sophia Antipolis, Cannes, Grasse et Menton ; plusieurs masters en anglais (data science et IA notamment). PIÈGE Eiffel : chaque école universitaire de recherche gère SA campagne (dossier à la mi-novembre pour 2026-2027) — s'adresser à celle du master visé, pas à un service central.",
      officialWebsite: "https://univ-cotedazur.fr",
      applicationPortalUrl: ETUDES_EN_FRANCE,
      fields: []
    }
  },
  {
    id: "universite-claude-bernard-lyon-1-villeurbanne",
    data: {
      name: "Université Claude Bernard Lyon 1",
      city: "Villeurbanne",
      country: "France",
      image: "lyon-tete-d-or.jpg",
      flag: "fr.svg",
      ranking: "#587 mondial (QS 2026)",
      description: "49 000 étudiants, 450 diplômes, première université française pour les dépôts de brevets. Deux grands secteurs : santé (médecine, pharmacie, odontologie, réadaptation) et sciences et technologies (mathématiques, physique, chimie, biologie, informatique, Polytech Lyon, STAPS) ; campus LyonTech-La Doua à Villeurbanne, Rockefeller et Laennec pour la santé. Programmes gradués et masters internationaux en anglais ouverts aux candidats Eiffel via les coordinateurs de parcours ; en doctorat, la candidature Eiffel est déposée par le directeur de thèse.",
      officialWebsite: "https://www.univ-lyon1.fr",
      applicationPortalUrl: ETUDES_EN_FRANCE,
      fields: []
    }
  },
  {
    id: "universite-paris-1-pantheon-sorbonne-paris",
    data: {
      name: "Université Paris 1 Panthéon-Sorbonne",
      city: "Paris",
      country: "France",
      image: "paris-sacre-coeur.jpg",
      flag: "fr.svg",
      ranking: "#257 mondial (QS 2026)",
      description: "45 000 étudiants, 37 unités de recherche, 10 écoles doctorales, trois grands pôles : droit et science politique ; économie et gestion (avec mathématiques et informatique appliquées) ; arts et sciences humaines (histoire, géographie, philosophie, archéologie). Une trentaine de sites parisiens, du Panthéon à Tolbiac et au Campus Condorcet. Exigence de français B2 à C1 selon le niveau visé. Eiffel master géré par le service international (dossier début novembre pour la campagne 2026, contact dédié) ; volet doctorat par chaque école doctorale.",
      officialWebsite: "https://www.pantheonsorbonne.fr",
      applicationPortalUrl: ETUDES_EN_FRANCE,
      fields: []
    }
  },
  {
    id: "universite-paris-dauphine-psl-paris",
    data: {
      name: "Université Paris Dauphine-PSL",
      city: "Paris",
      country: "France",
      image: "paris-fondation-louis-vuitton.jpg",
      flag: "fr.svg",
      ranking: "Classée à travers l'Université PSL, 28e mondiale au QS 2026 (Dauphine n'a pas de rang général propre)",
      description: "Grand établissement des « sciences des organisations et de la décision » : gestion, finance, économie, droit, mathématiques, informatique, journalisme ; accréditation EQUIS, membre de PSL. PARTICULARITÉ POUR LE SÉNÉGAL : un campus à DAKAR (avec BEM) propose MBA, masters et executive masters. Droits progressifs pour les résidents fiscaux hors UE : de 255 € (masters nationaux, exonération partielle possible) à 3 950 €, et 6 831 € pour les diplômes d'établissement (2026-2027). Bourses d'excellence des programmes gradués (3 000 à 12 000 €) et bourse PRAIRIE en IA ; Eiffel master et doctorat déposés auprès de Dauphine à la mi-novembre.",
      officialWebsite: "https://dauphine.psl.eu",
      applicationPortalUrl: ETUDES_EN_FRANCE,
      fields: []
    }
  },
  {
    id: "universite-sorbonne-paris-nord-villetaneuse",
    data: {
      name: "Université Sorbonne Paris Nord",
      city: "Villetaneuse",
      country: "France",
      image: "saint-denis-stade-de-france.jpg",
      flag: "fr.svg",
      ranking: "Rang 1001-1200 mondial (QS 2026)",
      description: "L'ex-Paris 13 : 25 000 étudiants, 550 doctorants, campus de Villetaneuse (sciences, lettres, droit, économie), Bobigny (santé) et Saint-Denis (IUT, Campus Condorcet), en Seine-Saint-Denis. Institut Galilée (sciences et ingénierie, école Sup Galilée), laboratoires reconnus en mathématiques, informatique et physique des lasers ; forte proportion d'étudiants boursiers et internationaux. Campagne Eiffel 2026 affichée avec ses domaines prioritaires (sciences et techniques, sciences humaines et sociales), candidature via la direction des relations internationales.",
      officialWebsite: "https://www.univ-spn.fr",
      applicationPortalUrl: ETUDES_EN_FRANCE,
      fields: []
    }
  },
  {
    id: "hec-paris-jouy-en-josas",
    data: {
      name: "HEC Paris",
      city: "Jouy-en-Josas",
      country: "France",
      image: "hec-jouy-en-josas.jpg",
      flag: "fr.svg",
      ranking: "Pas de rang général au QS 2026 ; 8e mondiale en Business & Management Studies (QS par discipline 2026)",
      description: "Grande école de management fondée en 1881, campus de 140 hectares à Jouy-en-Josas, au sud-ouest de Paris ; triple accréditation, bureau régional pour l'Afrique. Ouverts aux diplômés étrangers : Master in Management, MSc spécialisés (finance, économie, marketing, stratégie, durabilité, X-HEC Entrepreneurs), MBA et programme doctoral. Admission en ligne : licence, GMAT/GRE/TageMage, test d'anglais, deux recommandations, essais, 170 € de frais de dossier. PIÈGE : frais de 58 900 € pour les deux ans du Master in Management (+ 2 000 € hors UE) — Eiffel ne les couvre pas et n'est accessible qu'aux candidats du premier round ; bourses HEC au mérite et sur critères sociaux cumulables.",
      officialWebsite: "https://www.hec.edu",
      applicationPortalUrl: "https://www.hec.edu/en/master-s-programs/master-economics-finance/admissions",
      fields: []
    }
  },
  {
    id: "essec-business-school-cergy",
    data: {
      name: "ESSEC Business School",
      city: "Cergy",
      country: "France",
      image: "essec-cergy.jpg",
      flag: "fr.svg",
      ranking: "Pas de rang général au QS 2026 ; 31e ex æquo en Business & Management Studies (QS par discipline 2026)",
      description: "École de management fondée en 1907, campus de Cergy à trente minutes de Paris, plus Paris-La Défense, Singapour et Rabat ; 38 % d'étudiants internationaux, 240 universités partenaires. Master in Management (Grande École, 1 an intensif ou 2-3 ans), MSc en finance, data sciences (avec CentraleSupélec), stratégie internationale, luxe, hospitality, supply chain, et doctorat. L'école dépose elle-même les dossiers Eiffel des candidats du premier round ; bourse ESSEC de 10 000 € attribuée sur dossier aux meilleurs internationaux sans démarche séparée. PIÈGE : environ 35 000 € pour un MSc d'un an (frais + inscription + services), acompte de 5 000 à 6 000 € à l'admission.",
      officialWebsite: "https://www.essec.edu",
      applicationPortalUrl: "https://essec.myapply.online/Inscription/Index?Programme=2207870",
      fields: []
    }
  },
  {
    id: "insa-lyon-villeurbanne",
    data: {
      name: "INSA Lyon",
      city: "Villeurbanne",
      country: "France",
      image: "lyon-bellecour.jpg",
      flag: "fr.svg",
      ranking: "#406 mondial (QS 2026)",
      description: "Première école d'ingénieurs POST-BAC de France (1957), plus grande du Groupe INSA : 6 200 étudiants dont 25 % d'internationaux, 600 doctorants, 22 laboratoires, campus LyonTech-La Doua partagé avec Lyon 1. Cursus ingénieur en cinq ans (deux ans de premier cycle, avec sections internationales, puis neuf spécialités), quatre masters en anglais (acoustique, nanotechnologies, eau et vent, intelligence artificielle), huit écoles doctorales. Établissement public : droits d'environ 1 734 € par an hors UE. Label « Bienvenue en France », accueil à l'aéroport, logement prioritaire. Eiffel doctorat géré par l'école doctorale FEDORA (campagne 2026).",
      officialWebsite: "https://www.insa-lyon.fr",
      applicationPortalUrl: "https://candidat.groupe-insa.fr/candidat/index.php",
      fields: []
    }
  },
  {
    id: "mines-paris-psl-paris",
    data: {
      name: "Mines Paris – PSL",
      city: "Paris",
      country: "France",
      image: "paris-pont-neuf.jpg",
      flag: "fr.svg",
      ranking: "Classée à travers l'Université PSL, 28e mondiale au QS 2026 (Mines Paris n'a pas de rang général propre)",
      description: "École d'ingénieurs fondée en 1783, boulevard Saint-Michel, établissement-composante de PSL : 1 500 étudiants, 18 centres de recherche, première école française pour la recherche partenariale avec l'industrie ; sites de Fontainebleau, Sophia Antipolis et Versailles-Satory. Cycle ingénieur civil, masters et MSc PSL (énergie, matériaux, géosciences, mathématiques appliquées, IA), mastères spécialisés, doctorat. Entrée des étudiants étrangers au cycle ingénieur par double diplôme ou admission sur titres ; anglais B2 pour les MSc. Frais : 6 050 € par an hors UE au cycle ingénieur, la plupart des doubles diplômes en étant exonérés ; bourses de la Fondation Mines Paris (700 €/mois) ; Eiffel listée parmi les financements de la fiche internationale.",
      officialWebsite: "https://www.minesparis.psl.eu",
      applicationPortalUrl: "https://www.minesparis.psl.eu/en/education/civil-engineering-cycle/admission/",
      fields: []
    }
  }
];

export const SCHOLARSHIPS = [];

const PUBLIQUES = [
  "universite-de-strasbourg-strasbourg",
  "aix-marseille-universite-marseille",
  "universite-de-toulouse-toulouse",
  "universite-de-bordeaux-bordeaux",
  "universite-de-lille-lille",
  "universite-de-montpellier-montpellier",
  "nantes-universite-nantes",
  "universite-de-rennes-rennes",
  "universite-de-lorraine-nancy",
  "universite-cote-d-azur-nice",
  "universite-claude-bernard-lyon-1-villeurbanne",
  "universite-paris-1-pantheon-sorbonne-paris",
  "universite-paris-dauphine-psl-paris",
  "universite-sorbonne-paris-nord-villetaneuse"
];

export const LINKS = [
  {
    scholarshipId: "eiffel-excellence-scholarship",
    pays: "France",
    universityIds: [
      ...PUBLIQUES.filter((id) => id !== "universite-de-montpellier-montpellier"),
      "hec-paris-jouy-en-josas",
      "essec-business-school-cergy",
      "insa-lyon-villeurbanne",
      "mines-paris-psl-paris"
    ],
    motif: "Eiffel est déposée PAR l'établissement : chacun des 17 publie sa propre page Eiffel (campagne 2026 ou 2026-2027 datée pour Strasbourg, AMU, Toulouse, Bordeaux, Nantes, Rennes, Côte d'Azur, Paris 1, Dauphine, Sorbonne Paris Nord, INSA Lyon ; procédure sans millésime pour Lille, Lorraine, Lyon 1 ; HEC et ESSEC déposent pour les candidats du premier round ; Mines Paris la liste dans sa fiche internationale). Montpellier EXCLUE : aucune page Eiffel sur umontpellier.fr.",
    language: ""
  },
  {
    scholarshipId: "programme-bourses-france-senegal",
    pays: "France",
    universityIds: [...PUBLIQUES, "insa-lyon-villeurbanne", "mines-paris-psl-paris"],
    motif: "bourse sans établissement imposé, statut de boursier du gouvernement français : rattachée aux établissements PUBLICS du lot (14 universités + INSA Lyon + Mines Paris). HEC et ESSEC exclues — la bourse ne couvre pas des frais de 30 000 à 59 000 €.",
    language: "Français"
  },
  {
    scholarshipId: "france-excellence-major",
    pays: "France",
    universityIds: [...PUBLIQUES, "insa-lyon-villeurbanne"],
    motif: "bourse portable dans toute formation française, destinée aux bacheliers des lycées français : rattachée aux 14 universités publiques (licence) et à l'INSA Lyon (école d'ingénieurs POST-BAC). HEC, ESSEC et Mines Paris exclues — entrée post-licence ou après classes préparatoires.",
    language: "Français"
  }
];

// Le lot refuse de se charger si une photo déclarée n'existe pas :
// renseigner `image` sans fichier désactive la cascade et laisse une
// carte vide (incident du lot 35).
const manquants = UNIVERSITIES
  .map((u) => u.data.image)
  .filter((f) => f && !existsSync(`assets/images/cities/${f.replace(/\.jpg$/, "")}-1600w.avif`));
if (manquants.length) {
  throw new Error(`Lot 36 : ${manquants.length} photo(s) absente(s) — lancer d'abord \`node scripts\\add-lot36-photos.mjs\`, ou vider le champ image des établissements refusés :\n  ${manquants.join("\n  ")}`);
}
