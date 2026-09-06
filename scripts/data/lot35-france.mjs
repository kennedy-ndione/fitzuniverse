// ============================================================
// FitzUniverse — Lot 35 : LA FRANCE EN PROFONDEUR
// (recherche du 2026-09-03, sources officielles uniquement)
//
// POURQUOI
// Au 2026-09-01, la France — première destination des bacheliers et
// diplômés sénégalais — n'avait que 2 bourses et 2 universités au
// catalogue (Émile Boutmy, Eiffel ; Sciences Po, Sorbonne). C'est le
// trou le plus visible pour un public francophone. Ce lot ajoute
// 8 bourses et 6 établissements, et rattache Eiffel (déjà en base)
// aux 5 établissements du lot qui y participent.
//
// CE QUE CE LOT APPORTE DE SINGULIER
//   - Une bourse RÉSERVÉE AUX SÉNÉGALAIS : le Programme de bourses
//     France–Sénégal de l'ambassade (scope "liste", include ["SN"]).
//   - Un CONCOURS AVEC CENTRE D'EXAMEN À DAKAR, encore OUVERT à la
//     date de rédaction : le concours international (FUI) de l'École
//     polytechnique, clôture « mi-septembre 2026 ».
//   - Une bourse pour les bacheliers des lycées français (Mermoz à
//     Dakar) : France Excellence-Major, jusqu'à cinq ans.
//
// LA RÈGLE DU PORTAIL (lot 33) — cas français
// Pour un candidat résidant au Sénégal, l'admission dans une
// UNIVERSITÉ PUBLIQUE française (licence, master) passe par la
// plateforme d'État « Études en France » (procédure Campus France),
// et NON par eCandidat ni « Mon Master », réservés aux résidents en
// France ou hors procédure EEF. C'est le même cas que studyinsaudi
// (portails_universites_defaut) : la plateforme d'État EST le portail
// d'admission. Les trois universités publiques du lot portent donc
// l'URL Études en France. Les grandes écoles à concours propre (ENS,
// ENS de Lyon, Polytechnique) portent leur portail de candidature.
//
// PIÈGE `ranking` (lot 32) : rangs QS écrits avec « # » seulement
// pour des rangs MONDIAUX d'une édition nommée. Source : liste
// « Top universities in France » de topuniversities.com, cohérente
// avec le communiqué Paris-Saclay « top 80 QS 2026 » — donc édition
// QS 2026, pas 2027. L'ENS-PSL n'est classée qu'à travers PSL (#34) :
// son champ ranking le dit sans « # » suivi d'un nombre.
//
// PHOTOS : voir scripts/add-lot35-photos.mjs. Paris est DÉJÀ occupée
// deux fois (paris.jpg — Sciences Po, sorbonne.jpg). Les deux
// établissements parisiens du lot reçoivent des sujets distincts
// (le Panthéon, voisin immédiat de la rue d'Ulm ; les tours de la BnF
// face au campus des Grands Moulins). Les fichiers sont déclarés ici
// et DOIVENT exister avant `ecrire` — sinon carte cassée (le repli
// générique ne joue que sur un champ VIDE). L'École polytechnique n'a
// pas de photo candidate vérifiable depuis le sandbox : son champ
// image reste VIDE (repli générique hero-bg3), à compléter.
//
// LES NIVEAUX NE SONT PAS ÉCRITS DANS LES LIENS : lus sur `levels`.
// Programmes attendus : 8 bourses du lot → 20 ; Eiffel (externe,
// Master+Doctorat) × 5 établissements → 10 ; total 30.
// ============================================================

const ETUDES_EN_FRANCE = "https://pastel.diplomatie.gouv.fr/etudesenfrance/dyn/public/authentification/login.html";

export const UNIVERSITIES = [
  {
    id: "universite-paris-saclay-orsay",
    data: {
      name: "Université Paris-Saclay",
      city: "Orsay",
      country: "France",
      image: "paris-saclay-gif.jpg",
      flag: "fr.svg",
      ranking: "#76 mondial (QS 2026)",
      description: "La première université française au classement de Shanghai, sur le plateau de Saclay au sud de Paris — physique, mathématiques, sciences de la vie, pharmacie, avec ses écoles associées (CentraleSupélec, ENS Paris-Saclay, AgroParisTech). PIÈGE DE PROCÉDURE : depuis le Sénégal, la candidature en licence comme en master passe par la plateforme d'État « Études en France » (Campus France Sénégal), avec ses propres dates, bien avant les échéances internes de l'université.",
      officialWebsite: "https://www.universite-paris-saclay.fr",
      applicationPortalUrl: ETUDES_EN_FRANCE,
      fields: []
    }
  },
  {
    id: "ecole-normale-superieure-psl-paris",
    data: {
      name: "École normale supérieure — PSL",
      city: "Paris",
      country: "France",
      image: "ens-ulm-paris.jpg",
      flag: "fr.svg",
      ranking: "Classée à travers l'Université PSL, 34e mondiale au QS 2026 (l'ENS n'a pas de rang propre)",
      description: "L'école de la rue d'Ulm, au cœur du Quartier latin, recrute chaque année une promotion d'étudiants ÉTRANGERS par la « Sélection internationale » : logement sur le campus et allocation mensuelle pendant trois ans, sans frais de scolarité. Deux voies distinctes, lettres et sciences, chacune avec son propre calendrier et ses propres épreuves à distance. Ce n'est PAS une admission de master classique — c'est un concours.",
      officialWebsite: "https://www.ens.psl.eu",
      applicationPortalUrl: "https://formulaires.ens.psl.eu/",
      fields: []
    }
  },
  {
    id: "ecole-normale-superieure-de-lyon-lyon",
    data: {
      name: "École normale supérieure de Lyon",
      city: "Lyon",
      country: "France",
      image: "lyon.jpg",
      flag: "fr.svg",
      ranking: "#235 mondial (QS 2026)",
      description: "Sciences exactes, lettres et sciences humaines sur deux campus lyonnais ; les masters sont ouverts aux étudiants étrangers avec un programme de bourses d'excellence propre (Ampère) et la participation au programme Eiffel. La candidature au master et la demande de bourse se font en une seule démarche, sur les formulaires de l'école — le calendrier 2027-2028 est publié en novembre 2026.",
      officialWebsite: "https://www.ens-lyon.fr",
      applicationPortalUrl: "https://www.ens-lyon.fr/en/studies/admissions/application-masters-degrees-and-scholarships",
      fields: []
    }
  },
  {
    id: "universite-grenoble-alpes-grenoble",
    data: {
      name: "Université Grenoble Alpes",
      city: "Grenoble",
      country: "France",
      image: "grenoble.jpg",
      flag: "fr.svg",
      ranking: "#387 mondial (QS 2026)",
      description: "Grande université de recherche au pied des Alpes, intégrant Grenoble INP (ingénieurs), Sciences Po Grenoble et l'école d'architecture. Bourses de master IdEx réservées aux étudiants ARRIVANT de l'étranger, attribuées par les composantes au moment de l'admission — une seule démarche, mais il faut candidater tôt. PIÈGE : « être boursier n'exonère pas automatiquement des droits d'inscription », l'exonération dépend de la composante.",
      officialWebsite: "https://www.univ-grenoble-alpes.fr",
      applicationPortalUrl: ETUDES_EN_FRANCE,
      fields: []
    }
  },
  {
    id: "universite-paris-cite-paris",
    data: {
      name: "Université Paris Cité",
      city: "Paris",
      country: "France",
      image: "paris-cite-bnf.jpg",
      flag: "fr.svg",
      ranking: "#303 mondial (QS 2026)",
      description: "Née de la fusion de Paris-Descartes et Paris-Diderot, avec l'Institut de physique du globe : santé, sciences, sciences humaines, sur les campus Saint-Germain-des-Prés, Grands Moulins et Odéon. Son programme SMARTS-UP finance jusqu'à 200 étudiants internationaux de master par an, à 10 000 € — l'une des enveloppes les plus larges de France. Candidature au master et à la bourse sur des plateformes SÉPARÉES, avec des dates différentes.",
      officialWebsite: "https://u-paris.fr",
      applicationPortalUrl: ETUDES_EN_FRANCE,
      fields: []
    }
  },
  {
    id: "ecole-polytechnique-palaiseau",
    data: {
      name: "École polytechnique",
      city: "Palaiseau",
      country: "France",
      image: "",
      flag: "fr.svg",
      ranking: "Classée à travers l'Institut Polytechnique de Paris, 43e mondial au QS 2026",
      description: "La grande école d'ingénieurs française de référence, membre de l'Institut Polytechnique de Paris. Voie d'entrée pour un étudiant étranger : le concours international (Filière universitaire internationale), après deux années d'université scientifique — DAKAR EST UN CENTRE D'EXAMEN OFFICIEL (avis 2026), les oraux se tiennent en visioconférence. Aucune connaissance du français n'est exigée pour candidater ; un stage linguistique de quatre mois à Vichy est imposé avant l'entrée à qui n'a pas le niveau B2.",
      officialWebsite: "https://www.polytechnique.edu",
      applicationPortalUrl: "https://candidatures.polytechnique.fr/candidatures-mutualisees/logincandidature/",
      fields: []
    }
  }
];

export const SCHOLARSHIPS = [

  // ---------------- Réservée aux Sénégalais ----------------
  {
    id: "programme-bourses-france-senegal",
    data: {
      title: "Programme de bourses France – Sénégal (Ambassade de France)",
      country: "France",
      levels: ["Master", "Doctorat"],
      status: "Fermée — campagne 2027 attendue en octobre 2026",
      isActive: false,
      funder: "gouvernement",
      funderName: "Ambassade de France au Sénégal (SCAC)",
      entryPoint: "bourse",
      officialWebsite: "https://bourses.franceausenegal.com/",
      description: "Le programme de bourses de l'ambassade de France, RÉSERVÉ AUX SÉNÉGALAIS : masters en France pour les étudiants, séjours de recherche de quatre mois maximum pour les doctorants et enseignants-chercheurs des établissements sénégalais. Toutes disciplines.",
      funding: "Statut de boursier du gouvernement français, géré par Campus France. LE MONTANT N'EST PAS PUBLIÉ sur la plateforme ni dans le règlement : ni allocation mensuelle, ni détail de la couverture sociale, du billet ou des droits d'inscription. Durées plafonnées par le règlement : 10 mois pour un M2, 22 mois pour un M1 (les deux années), 4 mois pour un séjour de recherche.",
      eligibility: {
        scope: "liste",
        include: ["SN"],
        note: "« Étudiants sénégalais » pour les masters ; doctorants ou enseignants-chercheurs « inscrits ou exerçant dans un établissement sénégalais » pour les séjours de recherche. Exclut qui poursuit déjà des études en France."
      },
      ageMax: { master: 25, doctorat: 31 },
      ageMaxNote: "Règlement 2026 : né après le 1er janvier 2001 pour un master (25 ans à la clôture), après le 1er janvier 1995 pour un séjour de recherche (31 ans). Les dates glissent d'un an à chaque campagne.",
      generalCriteria: "Licence sénégalaise obtenue, ou inscription en dernière année avec preuve d'inscription pour l'année en cours. L'ADMISSION N'EST PAS EXIGÉE AU DÉPÔT : preuves de contact avec les établissements bienvenues, mais « l'étudiant doit accomplir ses démarches d'inscription aux programmes de master choisis par lui-même » et fournir l'admission officielle avant le départ — donc mener EN PARALLÈLE la procédure Études en France. Calendrier 2026 : ouverture octobre 2025, clôture le 4 février 2026 à 17 h GMT, sélection février-avril, résultats mai-juin, départs juin. « Seuls les candidats retenus pour un entretien et les lauréats seront contactés » ; décisions du jury souveraines. Dépôt uniquement sur bourses.franceausenegal.com."
    }
  },

  // ---------------- Bacheliers des lycées français ----------------
  {
    id: "france-excellence-major",
    data: {
      title: "Bourses France Excellence-Major (AEFE)",
      country: "France",
      levels: ["Licence", "Master"],
      status: "Fermée — campagne 2027 attendue en février-mars 2027",
      isActive: false,
      funder: "gouvernement",
      funderName: "MEAE / AEFE (gestion Campus France)",
      entryPoint: "bourse",
      officialWebsite: "https://aefe.gouv.fr/fr/enseignement-francais/poursuite-des-etudes-dans-le-superieur/devenir-boursier-france-excellence-major",
      description: "Bourse d'excellence du ministère des Affaires étrangères pour les meilleurs bacheliers ÉTRANGERS des lycées français de l'étranger — au Sénégal, les élèves de terminale du réseau AEFE (lycée Jean-Mermoz à Dakar et établissements partenaires). Cinq années d'études en France, de la licence au master, environ 200 nouveaux boursiers par an.",
      funding: "Boursiers sélectionnés depuis 2023 : allocation mensuelle de 280 € (niveau 1) ou 860 € (niveau 2) selon les ressources, couverture sociale complémentaire, prise en charge des frais de voyage, réservation d'un logement universitaire. Le niveau est fixé sur dossier social, l'excellence ne suffit pas pour le niveau 2. Les droits d'inscription ne sont pas explicitement cités pour la génération 2023+ (ils l'étaient avant 2023).",
      eligibility: {
        scope: "monde",
        note: "« Ne pas posséder la nationalité française » — les binationaux franco-sénégalais sont EXCLUS. Réservée aux élèves de terminale d'un établissement du réseau AEFE, présentés par leur proviseur."
      },
      generalCriteria: "PRÉSÉLECTION PAR LE PROVISEUR — un élève ne peut pas se porter candidat seul : l'établissement présélectionne, puis l'élève saisit lui-même son dossier sur la plateforme Cascade. Excellents résultats exigés et mention « très bien » au baccalauréat pour confirmer la bourse. Campagne 2026 : saisie des dossiers du 16 février au 12 mars 2026 (circulaire AEFE). Le projet d'études doit viser une formation en France, publique ou privée, sur cinq ans maximum."
    }
  },

  // ---------------- Université Paris-Saclay ----------------
  {
    id: "paris-saclay-international-masters-scholarship",
    data: {
      title: "Université Paris-Saclay — International Master's Scholarships",
      country: "France",
      levels: ["Master"],
      status: "Fermée — campagne 2027-2028 attendue en février-mars 2027",
      isActive: false,
      funder: "universite",
      funderName: "Université Paris-Saclay (IDEX)",
      entryPoint: "universite",
      officialWebsite: "https://www.universite-paris-saclay.fr/en/admission/bourses-et-aides-financieres/international-masters-scholarships-program",
      description: "Bourse d'excellence de l'université pour les étudiants étrangers qui arrivent en France pour un master — toutes disciplines, M1 ou M2, dans les huit établissements du périmètre Paris-Saclay.",
      funding: "10 000 € par an, versés mensuellement de septembre à juin, plus une aide au voyage et au visa « jusqu'à 900 € » selon le pays d'origine. Renouvellement automatique en M2 pour un lauréat de M1 admis en M2. Réduite au prorata des mois passés hors de France ou en stage hors laboratoire affilié. INCOMPATIBLE avec Eiffel, France Excellence Europa et Erasmus Mundus ; tout autre financement au-delà de 600 €/mois exclut.",
      eligibility: {
        scope: "monde",
        note: "Nationalité étrangère exigée, et PREMIÈRE inscription dans l'enseignement supérieur français (les échanges, Erasmus et stages antérieurs ne comptent pas)."
      },
      ageMax: { master: 29 },
      ageMaxNote: "Critère officiel « under 30 years of age » au moment de la candidature.",
      generalCriteria: "IL FAUT D'ABORD ÊTRE ADMIS dans un master de l'université : la bourse n'a pas de formulaire propre, ce sont les responsables de formation qui proposent les candidats à un jury (dossier académique, projet personnel, motivation pour le doctorat). Calendrier 2026-2027 : candidature au master avant le 25 mars 2026, candidature à la bourse avant le 31 mars 2026, résultats mi-mai 2026. Tous les masters sont éligibles sauf les formations en apprentissage. Contact : international-master-scholarship.idex@universite-paris-saclay.fr."
    }
  },

  // ---------------- ENS — PSL ----------------
  {
    id: "ens-psl-selection-internationale",
    data: {
      title: "ENS — PSL : Sélection internationale",
      country: "France",
      levels: ["Licence", "Master"],
      status: "Fermée — réouverture attendue le 1er octobre 2026 (lettres) et le 16 octobre 2026 (sciences), calendrier 2027 non publié",
      isActive: false,
      funder: "universite",
      funderName: "École normale supérieure — PSL",
      entryPoint: "universite",
      officialWebsite: "https://www.ens.psl.eu/en/une-formation-d-exception/admissions/international/international-selection",
      description: "Le concours d'entrée à l'ENS réservé aux étudiants étrangers : trois ans de scolarité financés à la rue d'Ulm, en lettres ou en sciences, sans frais de scolarité. Une porte d'entrée directe vers le diplôme de l'ENS et un master.",
      funding: "Allocation de 1 000 € par mois pendant trois ans et chambre sur le campus. Aucun frais de scolarité. Le montant n'a pas été réévalué sur la page officielle ; le coût de la vie parisien dépasse cette allocation, la chambre fournie est ce qui rend l'ensemble viable.",
      eligibility: {
        scope: "monde",
        note: "Étudiants étrangers n'ayant pas vécu en France plus de dix mois durant l'année de sélection ni la précédente. Une seule candidature possible dans une vie."
      },
      ageMax: { tous: 26 },
      ageMaxNote: "Formulations différentes selon la voie : « must not be after their 26th birthday on December 1st » en lettres (26 ans révolus admis), « under 26 years old on the opening day of applications » en sciences (25 ans au plus). Le catalogue retient la plus favorable ; en sciences la limite réelle est un an plus basse.",
      generalCriteria: "Au moins une année d'université validée à l'étranger au dépôt, deux années au moment de l'entrée. Dossier unique en PDF (diplôme du secondaire, relevés, CV, lettre de motivation, projet de recherche, 2 à 4 lettres de recommandation) déposé sur formulaires.ens.psl.eu puis sur la plateforme Dematec ; présélection sur dossier, puis épreuves écrites et orales À DISTANCE. Campagne 2026 : lettres du 1er octobre au 3 décembre 2025 (épreuves 2-13 février 2026), sciences du 16 octobre au 15 décembre 2025 (épreuves 3-20 mars 2026). Les mêmes fenêtres sont attendues à l'automne 2026 pour l'entrée 2027 — vérifier la page en octobre."
    }
  },

  // ---------------- ENS de Lyon ----------------
  {
    id: "ens-lyon-ampere-scholarships",
    data: {
      title: "ENS de Lyon — Bourses d'excellence Ampère",
      country: "France",
      levels: ["Master"],
      status: "Fermée — calendrier 2027-2028 publié en novembre 2026",
      isActive: false,
      funder: "universite",
      funderName: "École normale supérieure de Lyon",
      entryPoint: "universite",
      officialWebsite: "https://www.ens-lyon.fr/en/studies/admissions/application-masters-degrees-and-scholarships",
      description: "Bourses d'excellence de l'ENS de Lyon pour les étudiants internationaux admis en master, en sciences exactes comme en lettres et sciences humaines — la candidature au master et à la bourse ne font qu'une.",
      funding: "1 000 € par mois pendant 12 mois, renouvelable sous conditions pour la seconde année de master. Aucune prise en charge du voyage ni du logement annoncée. Deux variantes fléchées existent (MILYON en mathématiques et informatique fondamentale, QuanTEdu-France en sciences quantiques, une bourse par an).",
      eligibility: {
        scope: "monde",
        note: "Étudiants internationaux non encore inscrits à l'ENS de Lyon ; aucune restriction de nationalité publiée."
      },
      generalCriteria: "Licence (180 ECTS) pour un M1, M1 (240 ECTS) pour un M2. Certains masters sont exclus du dispositif — consulter le règlement. Campagne 2026-2027 : ouverture le 14 novembre 2025, clôture le 23 janvier 2026 à 23 h 59 CET, résultats mi-mars 2026. La page officielle annonce que le calendrier 2027-2028 sera mis à jour en novembre 2026. Enseignement principalement en français : un niveau suffisant est attendu même sans certificat imposé sur la page."
    }
  },

  // ---------------- Université Grenoble Alpes ----------------
  {
    id: "uga-idex-master-scholarships",
    data: {
      title: "Université Grenoble Alpes — Bourses de master IdEx",
      country: "France",
      levels: ["Master"],
      status: "Fermée — appel 2027-2028 attendu en décembre 2026",
      isActive: false,
      funder: "universite",
      funderName: "Université Grenoble Alpes (IdEx)",
      entryPoint: "universite",
      officialWebsite: "https://www.univ-grenoble-alpes.fr/call-for-applications-idex-master-scholarships-2026-2027-academic-year-1545508.kjsp",
      description: "Bourses de mérite de l'Initiative d'excellence grenobloise pour les étudiants internationaux qui arrivent à l'UGA en master ou en 2e/3e année d'école d'ingénieurs (Grenoble INP), Sciences Po Grenoble et école d'architecture comprises.",
      funding: "9 000 € pour une année de M1 (ou 2e année d'ingénieur), 5 500 € pour une année de M2 (ou 3e année). Versés en deux fois : 50 % mi-octobre après confirmation de l'inscription, 50 % en février après contrôle d'assiduité et de présence aux examens. Une année à la fois — recandidater pour la seconde. « Être boursier n'exonère PAS automatiquement des droits d'inscription. »",
      eligibility: {
        scope: "monde",
        note: "Étudiants internationaux inscrits dans une université hors de France, ou dont le dernier diplôme (ou le baccalauréat) a été obtenu à l'étranger."
      },
      generalCriteria: "PAS DE FORMULAIRE DE BOURSE SÉPARÉ : candidater à la formation (par Études en France depuis le Sénégal), puis ce sont les composantes qui sélectionnent les boursiers IdEx au moment des décisions d'admission ou juste après. Les échéances sont celles de chaque formation, au printemps 2026 pour la rentrée 2026 — la page officielle renvoie au calendrier de chaque master. FAQ officielle (décembre 2025) téléchargeable sur la page de l'appel. Autres dispositifs UGA cités sur la page internationale : Graduate School@UGA (14 500 € sur deux ans, 18 programmes), MIAI (IA), PERSYVAL-Lab, GRAL."
    }
  },

  // ---------------- Université Paris Cité ----------------
  {
    id: "smarts-up-universite-paris-cite",
    data: {
      title: "Université Paris Cité — Bourses SMARTS-UP Graduate Schools",
      country: "France",
      levels: ["Master"],
      status: "Fermée — appel 2027-2028 attendu en décembre 2026",
      isActive: false,
      funder: "universite",
      funderName: "Université Paris Cité (SMARTS-UP)",
      entryPoint: "bourse",
      officialWebsite: "https://mobility.smarts-up.fr/",
      description: "Jusqu'à 200 bourses de 10 000 € par an pour des étudiants internationaux entrant en master dans l'une des 28 Graduate Schools de l'université — l'un des programmes les plus larges de France, ouvert à la santé, aux sciences et aux sciences humaines.",
      funding: "10 000 € par année universitaire, versés en trois fois (un versement au premier semestre, deux au second). Aucune prise en charge du voyage, du logement ou des droits d'inscription annoncée dans le guide 2026-2027.",
      eligibility: {
        scope: "monde",
        note: "Nationalité étrangère exigée (les Français sont exclus), PREMIÈRE entrée dans une université française (hors doubles diplômes), aucun diplôme universitaire français antérieur."
      },
      generalCriteria: "DEUX DÉMARCHES SÉPARÉES : la bourse se demande sur mobility.smarts-up.fr, l'admission au master sur la plateforme d'admission (Études en France pour les ressortissants des pays à procédure Campus France, dont le Sénégal). Le master visé doit figurer dans la liste des formations éligibles des Graduate Schools. Licence pour un M1, M1 validé pour un M2. Campagne 2026-2027 : dépôt du 1er décembre 2025 au 16 janvier 2026 à 12 h CET, décisions début avril 2026, liste d'attente en mai, rentrée septembre 2026."
    }
  },

  // ---------------- École polytechnique ----------------
  {
    id: "polytechnique-concours-international-fui",
    data: {
      title: "École polytechnique — Concours international (FUI) et bourses de la Fondation",
      country: "France",
      levels: ["Licence", "Master"],
      status: "Ouverte",
      isActive: true,
      funder: "universite",
      funderName: "École polytechnique / Fondation de l'École polytechnique",
      entryPoint: "universite",
      officialWebsite: "https://www.polytechnique.edu/admission-cycle-ingenieur/en/international-candidates/entrance-exam-filiere-universitaire-internationale-fui",
      description: "L'entrée à l'X pour un étudiant étranger après deux ans d'université scientifique, par le concours de la Filière universitaire internationale — avec DAKAR parmi les centres d'examen officiels — puis des bourses d'excellence de la Fondation pour les admis. Diplôme d'ingénieur polytechnicien de grade master.",
      funding: "Pour les admis, bourses de la Fondation de l'École polytechnique : « Full Ride » (800 €/mois pendant 36 mois + exonération des droits), bourses d'excellence Fulgence (800 €/mois, 36 mois, une vingtaine par promotion sur les résultats du concours), bourse de projet de 4e année (800 €/mois, 11 mois), fonds CMA CGM (plus de 10 par an, moitié réservée aux Libanais). Exonération partielle des droits sur critères sociaux, aide de solidarité polytechnicienne 290 €/mois sur 31 mois (2026). RIEN N'EST AUTOMATIQUE : le concours donne l'admission, la bourse est une décision distincte de la Fondation.",
      eligibility: {
        scope: "monde",
        note: "« Exclusivement réservé aux candidats de nationalité étrangère » — les Français, binationaux compris, sont exclus et passent par la voie universitaire française."
      },
      ageMax: { tous: 24 },
      ageMaxNote: "Avis FUI 2027 : « under 25 years of age on January 1, 2027 » — 24 ans au plus au 1er janvier de l'année du concours.",
      generalCriteria: "Deux années d'études scientifiques universitaires validées (candidature possible en fin de 2e année, en 3e année ou au début de la 4e), aucune scolarité antérieure dans le supérieur français, une seule candidature possible, aptitude physique exigée. Mathématiques et physique solides. Épreuves possibles en anglais — « no knowledge of French is necessary to apply » —, mais stage de français de quatre mois à Vichy imposé avant l'entrée sans niveau B2. CALENDRIER FUI 2027 : candidatures de mi-mai à MI-SEPTEMBRE 2026 sur candidatures.polytechnique.fr, oraux en visioconférence du 2 au 15 novembre 2026, résultats le 26 novembre 2026. Centres d'examen de l'avis 2026 en Afrique : Dakar, Yaoundé, Tunis. Contact : concours-international@polytechnique.fr."
    }
  }
];

export const LINKS = [
  // --- Bourses du lot
  {
    scholarshipId: "programme-bourses-france-senegal",
    pays: "France",
    universityIds: ["universite-paris-saclay-orsay", "universite-grenoble-alpes-grenoble", "universite-paris-cite-paris"],
    motif: "bourse sans établissement imposé : rattachée aux trois universités publiques du lot, où le statut de boursier du gouvernement français s'applique pleinement",
    language: "Français"
  },
  {
    scholarshipId: "france-excellence-major",
    pays: "France",
    universityIds: ["universite-paris-saclay-orsay", "universite-grenoble-alpes-grenoble", "universite-paris-cite-paris"],
    motif: "bourse portable dans toute formation française ; rattachée aux trois universités publiques du lot, qui accueillent en licence",
    language: "Français"
  },
  {
    scholarshipId: "paris-saclay-international-masters-scholarship",
    pays: "France",
    universityIds: ["universite-paris-saclay-orsay"],
    motif: "bourse propre à l'université",
    language: ""
  },
  {
    scholarshipId: "ens-psl-selection-internationale",
    pays: "France",
    universityIds: ["ecole-normale-superieure-psl-paris"],
    motif: "concours propre à l'école",
    language: "Français"
  },
  {
    scholarshipId: "ens-lyon-ampere-scholarships",
    pays: "France",
    universityIds: ["ecole-normale-superieure-de-lyon-lyon"],
    motif: "bourse propre à l'école",
    language: "Français"
  },
  {
    scholarshipId: "uga-idex-master-scholarships",
    pays: "France",
    universityIds: ["universite-grenoble-alpes-grenoble"],
    motif: "bourse propre à l'université",
    language: ""
  },
  {
    scholarshipId: "smarts-up-universite-paris-cite",
    pays: "France",
    universityIds: ["universite-paris-cite-paris"],
    motif: "bourse propre à l'université",
    language: ""
  },
  {
    scholarshipId: "polytechnique-concours-international-fui",
    pays: "France",
    universityIds: ["ecole-polytechnique-palaiseau"],
    motif: "concours et bourses propres à l'école",
    language: "Français / Anglais (épreuves possibles en anglais)"
  },

  // --- Eiffel, DÉJÀ EN BASE (lien externe, niveaux lus en base :
  //     Master + Doctorat) : les cinq établissements du lot qui y
  //     participent. L'ENS-PSL n'est pas rattachée : sa Sélection
  //     internationale est un concours à part, et l'école ne figure
  //     pas parmi les établissements présentant des dossiers Eiffel
  //     sur les pages consultées.
  {
    scholarshipId: "eiffel-excellence-scholarship",
    pays: "France",
    universityIds: [
      "universite-paris-saclay-orsay",
      "ecole-normale-superieure-de-lyon-lyon",
      "universite-grenoble-alpes-grenoble",
      "universite-paris-cite-paris",
      "ecole-polytechnique-palaiseau"
    ],
    motif: "Eiffel est déposée PAR l'établissement : chacun de ces cinq publie sa propre page Eiffel 2026-2027 (ENS de Lyon, UGA vérifiées ; Paris-Saclay et Paris Cité l'affichent parmi leurs financements ; Polytechnique la cite comme dépôt institutionnel en décembre)",
    language: ""
  }
];

// ============================================================
// PATCHES — reliquat de l'arriéré (Étape 1 du chantier « irréprochable »)
//   a) ageMax des quatre grandes bourses gouvernementales, règle de
//      prudence : quand la formulation ou la date de référence rend la
//      limite variable, la valeur retenue est la PLUS HAUTE, et la
//      note dit la variation.
//   b) entryPoint des deux bourses qui n'en avaient pas.
// ============================================================
export const PATCHES = [
  {
    collection: "scholarships",
    id: "mext-scholarship",
    champs: {
      ageMax: { licence: 24, master: 34, doctorat: 34 },
      ageMaxNote: "Research Students 2027 (guide MEXT du 1er avril 2026) : « born on or after April 2, 1992 » — 34 ans au plus au 1er avril 2027, master comme doctorat. Undergraduate : tranche 17-24 ans du guide correspondant. Dérogations pour service militaire ou scolarité interrompue par un conflit."
    },
    motif: "backfill ageMax — source : Application Guidelines Research Students 2027 (studyinjapan.go.jp)"
  },
  {
    collection: "scholarships",
    id: "turkiye-burslari",
    champs: {
      ageMax: { licence: 21, master: 30, doctorat: 35 },
      ageMaxNote: "Critères officiels « under the age of 21 » (licence), « under 30 » (master), « under 35 » (doctorat), appliqués par ANNÉE DE NAISSANCE à la clôture : un candidat qui atteint l'âge-limite dans l'année reste recevable. Le catalogue retient cette lecture, la plus favorable."
    },
    motif: "backfill ageMax — source : turkiyeburslari.gov.tr, page Scholarship Programs"
  },
  {
    collection: "scholarships",
    id: "turkiye-burslari-success",
    champs: {
      ageMax: { licence: 21, master: 30, doctorat: 35 },
      ageMaxNote: "Mêmes plafonds que la bourse principale (« under 21 / 30 / 35 »), lus par année de naissance à la clôture."
    },
    motif: "backfill ageMax — même règlement que turkiye-burslari (turkiyeburslari.gov.tr)"
  },
  {
    collection: "scholarships",
    id: "turkiye-burslari-research",
    champs: {
      ageMax: { doctorat: 50 },
      ageMaxNote: "Critère officiel « under the age of 50 » pour la bourse de recherche, lu par année de naissance."
    },
    motif: "backfill ageMax — source : turkiyeburslari.gov.tr, page Scholarship Programs"
  },
  {
    collection: "scholarships",
    id: "chinese-government-scholarship",
    champs: {
      ageMax: { licence: 24, master: 34, doctorat: 39 },
      ageMaxNote: "Critères CSC « under 25 » (licence), « under 35 » (master), « under 40 » (doctorat), repris tels quels dans l'appel 2026-2027 relayé par les universités partenaires. Le site campuschina.org n'était pas consultable depuis le sandbox — à confirmer sur l'appel 2027."
    },
    motif: "backfill ageMax — critères CSC constants, vérifiés sur l'appel 2026-2027 relayé par l'UPC (upc.edu/sri) ; site CSC inaccessible depuis le sandbox"
  },
  {
    collection: "scholarships",
    id: "eiffel-excellence-scholarship",
    champs: {
      ageMax: { master: 25, doctorat: 30 },
      ageMaxNote: "Guide Campus France : « 25 ans au plus lors de la campagne de candidature » en master, « 30 ans au plus » en doctorat, avec une date de naissance de référence au 31 mars de l'année de campagne. Vérifié sur le guide 2024 ; le vademecum 2027 est à relire à sa parution (octobre)."
    },
    motif: "backfill ageMax — source : Guide de dépôt des candidatures Eiffel (campusfrance.org/fr/media/11558)"
  },
  {
    collection: "scholarships",
    id: "knight-hennessy-scholars",
    champs: { entryPoint: "bourse" },
    motif: "programme de Stanford à candidature PROPRE (knight-hennessy.stanford.edu), déposée en parallèle de l'admission au diplôme : le dossier de bourse va au programme, pas au département"
  },
  {
    collection: "scholarships",
    id: "fao-hungarian-government-scholarship",
    champs: { entryPoint: "bourse" },
    motif: "dossier déposé auprès du programme FAO-Hongrie (appel FAO), l'université d'accueil étant attribuée ensuite : le point d'entrée est la bourse"
  }
];
