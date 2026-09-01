// ============================================================
// FitzUniverse — Lot 32 : les 11 universités manquantes
// (données du 2026-08-31)
//
// POURQUOI
// 11 bourses sont au catalogue mais INVISIBLES au moteur de
// recommandation payant, faute d'université rattachée : le moteur
// itère sur `programs`, jamais sur `scholarships`. Ce lot crée les 11
// établissements et les 19 programmes qui les relient — après quoi il
// ne restera que 2 orphelines, volontaires (vanier, al-azhar).
//
// TOUT EST VÉRIFIÉ À LA SOURCE OFFICIELLE, jamais sur un agrégateur.
//
// LA RÈGLE DU PORTAIL, apprise au lot 33 et appliquée ici d'emblée
// `applicationPortalUrl` est le portail d'ADMISSION de l'établissement,
// JAMAIS celui d'un programme de bourses. Aucune URL d'organisme
// régional (adisupuglia, ardis.fvg, aliseo, edisu, DSU Lombardia) ni de
// sbfi.admin.ch n'apparaît ici : ce sont des bailleurs. Deux points
// vérifiés qui auraient pu tromper :
//   - En Italie, Universitaly est une étape RÉELLE mais SECONDAIRE :
//     la candidature se dépose sur le portail de l'université, et
//     Universitaly ne sert qu'à la pré-inscription visa. On garde donc
//     le portail de l'université.
//   - L'IHEID n'a AUCUN portail à URL stable : le formulaire vit dans
//     la page « How to Apply » pendant la fenêtre de candidature. Le
//     champ reste donc VIDE — un champ vide est une réponse, et
//     details.js masque proprement le bouton.
//
// PIÈGE DU CHAMP `ranking`, à ne pas défaire
// `extraireRangQS()` (js/scholarship-filters.js) lit le PREMIER nombre
// précédé de « # » et le traite comme un rang MONDIAL. La Scuola
// Normale et l'IHEID ne sont pas classés au QS mondial — l'IHEID n'a
// qu'un rang par discipline (45e en Development Studies). Écrire
// « #45 » sur l'IHEID le ferait passer pour la 45e université du monde
// et fausserait le filtre « classement » de tout le catalogue. Leur
// `ranking` ne contient donc AUCUN « # » suivi d'un nombre.
//
// LES PHOTOS : QUATRE VILLES SONT DÉJÀ OCCUPÉES
// Milan (Politecnico + Bocconi), Pise (Università di Pisa), Lausanne
// (EPFL) et Genève (deux établissements de ce lot) hébergent déjà ou
// vont héberger plusieurs fiches. Les noms de fichiers ci-dessous sont
// donc préfixés par l'établissement, et il faut des images
// VISUELLEMENT différentes — pas seulement des fichiers différents.
// Voir la leçon du lot 31 dans photos_bourses_cascade_2026-08-30.
//
// LES NIVEAUX NE SONT PAS ÉCRITS ICI : ils sont lus sur le champ
// `levels` de chaque bourse. 19 programmes attendus.
// ============================================================

export const UNIVERSITIES = [
  {
    id: "universita-degli-studi-di-milano-milan",
    data: {
      name: "Università degli Studi di Milano",
      city: "Milan",
      country: "Italie",
      image: "unimi-milan.jpg",
      flag: "it.svg",
      ranking: "#270 mondial (QS 2027)",
      description: "PIÈGE DE PROCÉDURE : déposer sur apply.unimi.it ne dispense PAS de la pré-inscription sur Universitaly, qui conditionne le rendez-vous consulaire pour le visa D. L'offre anglophone est concentrée sur le master, plus la filière de médecine International Medical School.",
      officialWebsite: "https://www.unimi.it",
      applicationPortalUrl: "https://apply.unimi.it/",
      fields: []
    }
  },
  {
    id: "universita-di-pavia-pavie",
    data: {
      name: "Università di Pavia",
      city: "Pavie",
      country: "Italie",
      image: "pavia.jpg",
      flag: "it.svg",
      ranking: "#395 mondial (QS 2027)",
      description: "Trente cursus enseignés en anglais, dont un cycle unique de médecine — l'italien n'est pas indispensable pour candidater. Le calendrier diffère selon que le cursus est à accès libre ou restreint : à vérifier programme par programme avant de déposer.",
      officialWebsite: "https://portale.unipv.it",
      applicationPortalUrl: "https://apply.unipv.eu/",
      fields: []
    }
  },
  {
    id: "universita-di-genova-genes",
    data: {
      name: "Università degli Studi di Genova",
      city: "Gênes",
      country: "Italie",
      image: "genes.jpg",
      flag: "it.svg",
      ranking: "#502 mondial (QS 2027)",
      description: "UniGeApply est un passage OBLIGÉ pour tout titre étranger, avec deux sessions distinctes : automne pour les demandeurs de visa, printemps pour les résidents. Offre anglophone marquée en ingénierie et informatique, avec des pôles à Savone, Imperia et La Spezia.",
      officialWebsite: "https://unige.it",
      applicationPortalUrl: "https://unige.it/en/internazionale/iscrizioni-internazionali/unigeapply",
      fields: []
    }
  },
  {
    id: "universita-di-bari-aldo-moro-bari",
    data: {
      name: "Università degli Studi di Bari Aldo Moro",
      city: "Bari",
      country: "Italie",
      image: "bari.jpg",
      flag: "it.svg",
      ranking: "#741-750 mondial (QS 2027)",
      description: "La porte d'entrée anglophone la plus lisible est le Bari English Medical Curriculum, cycle unique de médecine en anglais. Échéances internationales fermes et différenciées : fin juin pour les non-UE ayant besoin d'un visa, fin septembre pour les autres.",
      officialWebsite: "https://www.uniba.it",
      applicationPortalUrl: "https://apply.uniba.it/",
      fields: []
    }
  },
  {
    id: "universita-di-trieste-trieste",
    data: {
      name: "Università degli Studi di Trieste",
      city: "Trieste",
      country: "Italie",
      image: "trieste.jpg",
      flag: "it.svg",
      ranking: "#761-770 mondial (QS 2027)",
      description: "Dix-sept cursus en anglais aux TROIS cycles, licence comprise — rare pour une université de cette taille, et exploitable sans italien dès la première année. La ville forme un pôle scientifique dense avec la SISSA, l'ICTP et l'Area Science Park.",
      officialWebsite: "https://www.units.it",
      applicationPortalUrl: "https://apply.units.it/",
      fields: []
    }
  },
  {
    id: "scuola-normale-superiore-pise",
    data: {
      name: "Scuola Normale Superiore",
      city: "Pise",
      country: "Italie",
      image: "scuola-normale-pise.jpg",
      flag: "it.svg",
      ranking: "Établissement public à statut spécial, recrutement sur concours (non classé au QS mondial)",
      description: "Le doctorat est INTÉGRALEMENT financé : bourse, soutien au logement, repas gratuits, aucun frais d'inscription, et un budget de recherche propre. Une place est RÉSERVÉE dans chaque cursus doctoral aux candidats diplômés d'universités étrangères, et les sessions ferment à des dates différentes selon la faculté.",
      officialWebsite: "https://www.sns.it",
      applicationPortalUrl: "https://sns.esse3.cineca.it/Root.do",
      fields: []
    }
  },
  {
    id: "iheid-geneve",
    data: {
      name: "Geneva Graduate Institute (IHEID)",
      city: "Genève",
      country: "Suisse",
      image: "iheid-geneve.jpg",
      flag: "ch.svg",
      ranking: "Institut spécialisé en relations internationales et études du développement (non classé au QS mondial, 45e en Development Studies par discipline)",
      description: "Ni licence ni bachelor : uniquement des masters et des doctorats, pour environ 1 000 étudiants de plus de 100 pays, au cœur de la Genève internationale. Enseignement principalement en anglais avec un niveau C1 exigé ; le français n'est pas requis à l'admission mais reste accepté pour les travaux.",
      officialWebsite: "https://www.graduateinstitute.ch",
      applicationPortalUrl: "",
      fields: []
    }
  },
  {
    id: "universite-de-fribourg-fribourg",
    data: {
      name: "Université de Fribourg",
      city: "Fribourg",
      country: "Suisse",
      image: "fribourg.jpg",
      flag: "ch.svg",
      ranking: "#670 mondial (QS 2027)",
      description: "Seule université bilingue de Suisse : on peut composer son cursus en français, en allemand ou dans les deux, et obtenir une mention de bilinguisme sur son diplôme. Environ 10 000 étudiants, donc un suivi plus dense que dans les grandes universités romandes.",
      officialWebsite: "https://www.unifr.ch",
      applicationPortalUrl: "https://admin.unifr.ch/inscruni",
      fields: []
    }
  },
  {
    id: "universite-de-geneve-geneve",
    data: {
      name: "Université de Genève",
      city: "Genève",
      country: "Suisse",
      image: "unige-geneve.jpg",
      flag: "ch.svg",
      ranking: "#168 mondial (QS 2027)",
      description: "L'immatriculation et la demande de bourse sont DEUX démarches séparées, avec deux calendriers : les candidats aux Excellence Master Fellowships doivent aussi s'inscrire via le Service des admissions. Pour les masters en français, un examen de français de l'UNIGE est exigé des non-francophones, sauf certificat B2.",
      officialWebsite: "https://www.unige.ch",
      applicationPortalUrl: "https://inscription.unige.ch/",
      fields: []
    }
  },
  {
    id: "universite-de-lausanne-lausanne",
    data: {
      name: "Université de Lausanne",
      city: "Lausanne",
      country: "Suisse",
      image: "unil-lausanne.jpg",
      flag: "ch.svg",
      ranking: "#233 mondial (QS 2027)",
      description: "À NE PAS CONFONDRE avec l'EPFL, voisine sur le même campus de Dorigny mais établissement distinct : admissions, diplômes et frais séparés, et pas d'ingénierie à l'UNIL. Enseignement principalement en français, avec quelques masters et cours de licence en anglais.",
      officialWebsite: "https://www.unil.ch",
      applicationPortalUrl: "https://candidature.unil.ch/",
      fields: []
    }
  },
  {
    id: "spbu-saint-petersbourg",
    data: {
      name: "Université d'État de Saint-Pétersbourg (SPbU)",
      city: "Saint-Pétersbourg",
      country: "Russie",
      image: "saint-petersbourg.jpg",
      flag: "ru.svg",
      ranking: "#390 mondial (QS 2027)",
      description: "TROIS VOIES D'ENTRÉE aux effets très différents : l'admission payante sur concours propre à l'université, le quota gouvernemental, et l'olympiade — seule la première suit les fenêtres publiées par SPbU. Le russe est la langue principale, avec 35 masters en langues étrangères (anglais, allemand, espagnol, français, italien).",
      officialWebsite: "https://english.spbu.ru",
      applicationPortalUrl: "https://abiturient.spbu.ru/en/",
      fields: []
    }
  },
];

export const SCHOLARSHIPS = [];

// `language` n'est renseignée que lorsqu'elle a été VÉRIFIÉE à la
// source : elle alimente languageMatch() dans js/recommend-programs.js.
// Vide = inconnue, jamais supposée — cas de la Scuola Normale, dont
// aucune page consultée ne déclare la langue d'enseignement.
export const LINKS = [
  {
    scholarshipId: "dsu-lombardia-milano-statale",
    pays: "Italie",
    universityIds: ["universita-degli-studi-di-milano-milan"],
    motif: "seule université de Lombardie visée par ce bando régional dans le catalogue",
    language: "Italien / Anglais"
  },
  {
    scholarshipId: "edisu-pavia",
    pays: "Italie",
    universityIds: ["universita-di-pavia-pavie"],
    motif: "EDiSU est l'organisme de droit à l'étude propre aux inscrits de l'Università di Pavia",
    language: "Italien / Anglais"
  },
  {
    scholarshipId: "aliseo-liguria",
    pays: "Italie",
    universityIds: ["universita-di-genova-genes"],
    motif: "ALiSEO vise les inscrits de l'Università degli Studi di Genova et des établissements AFAM de Ligurie",
    language: "Italien / Anglais"
  },
  {
    scholarshipId: "adisu-puglia",
    pays: "Italie",
    universityIds: ["universita-di-bari-aldo-moro-bari"],
    motif: "nommée à l'article 3 du bando ADISU ; la plus généraliste des quatre universités des Pouilles couvertes",
    language: "Italien / Anglais"
  },
  {
    scholarshipId: "ardis-friuli-venezia-giulia",
    pays: "Italie",
    universityIds: ["universita-di-trieste-trieste"],
    motif: "l'ARDiS couvre Trieste ET Udine ; Trieste retenue pour son portail d'admission dédié et son offre anglophone aux trois cycles",
    language: "Italien / Anglais"
  },
  {
    scholarshipId: "scuola-normale-superiore-phd",
    pays: "Italie",
    universityIds: ["scuola-normale-superiore-pise"],
    motif: "concours de doctorat propre à l'établissement, il est à la fois le bailleur et l'école d'accueil",
    language: ""
  },
  {
    scholarshipId: "iheid-scholarships",
    pays: "Suisse",
    universityIds: ["iheid-geneve"],
    motif: "bourses propres à l'institut, qui est aussi l'établissement d'accueil",
    language: "Anglais / Français"
  },
  {
    scholarshipId: "unifr-research-scholarships",
    pays: "Suisse",
    universityIds: ["universite-de-fribourg-fribourg"],
    motif: "bourses de recherche propres à l'université",
    language: "Français / Allemand"
  },
  {
    scholarshipId: "unige-excellence-master-fellowships",
    pays: "Suisse",
    universityIds: ["universite-de-geneve-geneve"],
    motif: "programme de la Faculté des sciences de l'UNIGE",
    language: "Anglais / Français"
  },
  {
    scholarshipId: "unil-master-grants",
    pays: "Suisse",
    universityIds: ["universite-de-lausanne-lausanne"],
    motif: "bourses de master propres à l'UNIL, à ne pas confondre avec l'EPFL voisine",
    language: "Français / Anglais"
  },
  {
    scholarshipId: "spbu-open-olympiad",
    pays: "Russie",
    universityIds: ["spbu-saint-petersbourg"],
    motif: "olympiade organisée par l'université elle-même",
    language: "Russe / Anglais"
  },
];
