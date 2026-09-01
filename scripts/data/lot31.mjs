// ============================================================
// FitzUniverse — Données du lot 31 : Afrique (2026-08-30)
//
// Rwanda, Ghana, Kenya, Égypte : 12 universités, 14 bourses,
// 13 rattachements. Fichier de DONNÉES uniquement — il n'écrit rien.
// Le script d'exécution (scripts/lot.mjs) le lit et applique les trois
// étapes analyser / écrire / vérifier.
//
// POURQUOI CE LOT
// L'export du 30/08/2026 ne comptait qu'UN SEUL pays africain hors
// Maroc (Afrique du Sud, 1 bourse) sur 131. Pour un public sénégalais,
// c'était l'angle mort le plus coûteux du catalogue : la mobilité
// intra-africaine est souvent la plus accessible, la moins chère en
// visa, et la mieux dotée en programmes réservés aux Africains.
//
// TOUT A ÉTÉ VÉRIFIÉ À LA SOURCE OFFICIELLE, jamais sur un agrégateur.
// Voir la note de recherche research_lot31_afrique_2026-08-30 pour les
// programmes ÉCARTÉS et leur motif (RSIF, ACECoR, DAAD In-Country,
// EGYAID, Kenyatta) — ne pas les rechercher à nouveau sans lire ce
// document.
//
// TROIS RÈGLES QUI ONT GUIDÉ LA SAISIE
// 1. Aucune date, aucun montant, aucune couverture inventés. Quand la
//    source ne dit rien, `funding` et `generalCriteria` le DISENT
//    ("non mentionné", "à faire confirmer par écrit") plutôt que de
//    combler le vide. Une fausse date limite devant un étudiant est
//    pire qu'un tiret.
// 2. `eligibility` suit la règle des trois valeurs : le motif
//    « note seule » (note sans scope) est utilisé pour ALU, Ashesi,
//    KNUST, Senghor et Al-Azhar, dont aucune source officielle ne
//    nomme ni n'exclut le Sénégal. Il informe sans exclure personne.
// 3. `ageMax` suit la RÈGLE DE PRUDENCE : quand la limite varie selon
//    le candidat, on retient la PLUS HAUTE et on explique la variation
//    dans `ageMaxNote` (PAU 28/30 et non 25/28, USIU 32 et non 29).
//    Un filtre qui se trompe doit montrer une bourse de trop, jamais
//    en cacher une à quelqu'un qui y avait droit.
//
// UNE BOURSE RESTE VOLONTAIREMENT ORPHELINE
// `al-azhar-bourses-etudiants-etrangers` n'a ni niveau ni université
// liée : les pages officielles d'Al-Azhar sont inaccessibles depuis
// l'étranger, et lui inventer des niveaux serait une affirmation sans
// source. Même décision assumée que pour `vanier` au lot 29. Elle
// porte donc sa propre `image`, sans quoi la cascade de
// resolveScholarshipImage() descendrait à son 3e étage.
// ============================================================

export const UNIVERSITIES = [
  {
    id: "carnegie-mellon-university-africa-kigali",
    data: {
      name: "Carnegie Mellon University Africa (CMU-Africa)",
      city: "Kigali",
      country: "Rwanda",
      image: "cmu-africa-kigali.jpg",
      flag: "rw.svg",
      ranking: "Campus rwandais de Carnegie Mellon, école d'ingénieurs américaine",
      description: "Seul campus d'une université de recherche américaine en Afrique à délivrer ses propres diplômes. Trois masters, tous techniques. Le tarif de scolarité « African students » (16 000 USD contre 60 300 au tarif international) s'applique de plein droit à un Sénégalais, avant même toute bourse.",
      officialWebsite: "https://www.africa.engineering.cmu.edu",
      applicationPortalUrl: "https://www.africa.engineering.cmu.edu/admissions/index.html",
      fields: []
    }
  },
  {
    id: "university-of-rwanda-kigali",
    data: {
      name: "University of Rwanda",
      city: "Kigali",
      country: "Rwanda",
      image: "university-of-rwanda-kigali.jpg",
      flag: "rw.svg",
      ranking: "Université publique nationale du Rwanda",
      description: "Porte le plus gros contingent Mastercard Foundation du pays : 1 200 boursiers, dont 90 % en licence. Tout diplôme étranger doit d'abord être validé par le Higher Education Council et la NESA rwandais.",
      officialWebsite: "https://ur.ac.rw",
      applicationPortalUrl: "https://mcfsprecruitment.ur.ac.rw/",
      fields: []
    }
  },
  {
    id: "african-leadership-university-kigali",
    data: {
      name: "African Leadership University (ALU)",
      city: "Kigali",
      country: "Rwanda",
      image: "alu-kigali.jpg",
      flag: "rw.svg",
      ranking: "Université privée panafricaine centrée sur le leadership",
      description: "Trois licences seulement — leadership entrepreneurial, génie logiciel, commerce international — avec plusieurs rentrées par an. La bourse se demande dans le dossier d'admission, jamais séparément.",
      officialWebsite: "https://www.alueducation.com",
      applicationPortalUrl: "https://www.alueducation.com/apply-now/",
      fields: []
    }
  },
  {
    id: "aims-rwanda-kigali",
    data: {
      name: "AIMS Rwanda (African Institute for Mathematical Sciences)",
      city: "Kigali",
      country: "Rwanda",
      image: "aims-kigali.jpg",
      flag: "rw.svg",
      ranking: "Centre rwandais du réseau panafricain AIMS",
      description: "Aucun frais de scolarité, et tout étudiant africain admis est financé. N'exige aucun test d'anglais. Le réseau AIMS a par ailleurs un centre au Sénégal, à Mbour.",
      officialWebsite: "https://aims.ac.rw",
      applicationPortalUrl: "https://apply.aims-network.org/",
      fields: []
    }
  },
  {
    id: "ashesi-university-berekuso",
    data: {
      name: "Ashesi University",
      city: "Berekuso",
      country: "Ghana",
      image: "ashesi-berekuso.jpg",
      flag: "gh.svg",
      ranking: "Université privée d'arts libéraux et d'ingénierie, à 30 km d'Accra",
      description: "L'un des neuf partenaires fondateurs du Mastercard Foundation Scholars Program. Reconnaît explicitement le baccalauréat français comme diplôme d'entrée, mais exige le TOEFL ou l'IELTS de tout candidat dont le lycée n'enseignait pas en anglais.",
      officialWebsite: "https://ashesi.edu.gh",
      applicationPortalUrl: "https://ashesi.dreamapply.com/",
      fields: []
    }
  },
  {
    id: "knust-kumasi",
    data: {
      name: "Kwame Nkrumah University of Science and Technology (KNUST)",
      city: "Kumasi",
      country: "Ghana",
      image: "knust-kumasi.jpg",
      flag: "gh.svg",
      ranking: "Grande université publique ghanéenne de sciences et de technologie",
      description: "Son programme Mastercard Foundation fait exception dans tout le catalogue : le dossier de bourse s'envoie par coursier au Program Manager, sur le campus, en plus de la candidature d'admission en ligne.",
      officialWebsite: "https://www.knust.edu.gh",
      applicationPortalUrl: "https://apps.knust.edu.gh/admissions/",
      fields: []
    }
  },
  {
    id: "aims-ghana-accra",
    data: {
      name: "AIMS Ghana (African Institute for Mathematical Sciences)",
      city: "Accra",
      country: "Ghana",
      image: "aims-accra.jpg",
      flag: "gh.svg",
      ranking: "Centre ghanéen du réseau panafricain AIMS",
      description: "Le seul centre du réseau, avec celui du Rwanda, dont le règlement d'admission cite nommément le Baccalauréat comme diplôme d'entrée pour une licence en trois ans.",
      officialWebsite: "https://aims.edu.gh",
      applicationPortalUrl: "https://apply.aims-network.org/",
      fields: []
    }
  },
  {
    id: "jkuat-juja",
    data: {
      name: "Jomo Kenyatta University of Agriculture and Technology (JKUAT)",
      city: "Juja",
      country: "Kenya",
      image: "jkuat-juja.jpg",
      flag: "ke.svg",
      ranking: "Université publique kényane, hôte de l'institut PAUSTI",
      description: "Héberge PAUSTI, l'institut de sciences fondamentales, technologie et innovation de l'Université panafricaine — dont les bourses sont attribuées par la Commission de l'Union africaine, et non par la JKUAT.",
      officialWebsite: "https://www.jkuat.ac.ke",
      applicationPortalUrl: "https://www.au-pau.org/submission/",
      fields: []
    }
  },
  {
    id: "usiu-africa-nairobi",
    data: {
      name: "United States International University-Africa (USIU-Africa)",
      city: "Nairobi",
      country: "Kenya",
      image: "usiu-nairobi.jpg",
      flag: "ke.svg",
      ranking: "Université privée de Nairobi, cursus de système américain",
      description: "Son programme Mastercard Foundation est explicitement ouvert à toute l'Afrique, mais sa grille officielle d'équivalence de notes ne couvre que quatorze pays, sans le Sénégal.",
      officialWebsite: "https://www.usiu.ac.ke",
      applicationPortalUrl: "https://www.usiu.ac.ke/mastercard-foundation-scholars-program/",
      fields: []
    }
  },
  {
    id: "icipe-nairobi",
    data: {
      name: "icipe — International Centre of Insect Physiology and Ecology",
      city: "Nairobi",
      country: "Kenya",
      image: "icipe-nairobi.jpg",
      flag: "ke.svg",
      ranking: "Centre international de recherche, campus de Duduville",
      description: "Institut de recherche plutôt qu'université : le doctorat est financé par le DAAD et le diplôme délivré par une université partenaire du réseau ARPPIS. Le seul programme de ce lot à encourager explicitement les candidats francophones.",
      officialWebsite: "https://www.icipe.org",
      applicationPortalUrl: "https://scholarships.icipe.org/",
      fields: []
    }
  },
  {
    id: "american-university-in-cairo-le-caire",
    data: {
      name: "The American University in Cairo (AUC)",
      city: "Le Caire",
      country: "Égypte",
      image: "auc-cairo.jpg",
      flag: "eg.svg",
      ranking: "Université privée américaine du Caire, campus de New Cairo",
      description: "Porte deux bourses de master distinctes : l'African Graduate Fellowship, réservée aux Africains sans double nationalité non africaine, et l'International Graduate Fellowship, qui n'a pas cette clause.",
      officialWebsite: "https://www.aucegypt.edu",
      applicationPortalUrl: "https://aucbanner.aucegypt.edu",
      fields: []
    }
  },
  {
    id: "universite-senghor-alexandrie",
    data: {
      name: "Université Senghor d'Alexandrie",
      city: "Alexandrie",
      country: "Égypte",
      image: "senghor-alexandrie.jpg",
      flag: "eg.svg",
      ranking: "Opérateur direct de la Francophonie, campus de Borg El-Arab",
      description: "La seule université de ce lot à enseigner en français. Recrute sur concours — épreuve écrite puis oraux — et exige au moins un an d'expérience professionnelle.",
      officialWebsite: "https://usenghor-francophonie.org",
      applicationPortalUrl: "https://candidature.usenghor.org",
      fields: []
    }
  },
];

export const SCHOLARSHIPS = [
  {
    id: "mastercard-foundation-scholars-cmu-africa",
    data: {
      title: "Mastercard Foundation Scholars Program — Carnegie Mellon University Africa",
      country: "Rwanda",
      levels: ["Master"],
      status: "Fermée",
      isActive: false,
      funder: "organisation",
      funderName: "Mastercard Foundation",
      entryPoint: "universite",
      officialWebsite: "https://www.africa.engineering.cmu.edu/impact/mastercard-foundation-scholars.html",
      description: "Bourse complète pour un master d'ingénierie ou d'informatique sur le campus rwandais de Carnegie Mellon, réservée aux candidats de nationalité africaine déjà admis au programme.",
      funding: "Scolarité et frais annexes en totalité, assurance santé, voyage et frais de subsistance de base, accompagnement à la préparation de la candidature, orientation, soutien à l'entrepreneuriat, formation au leadership et coaching de carrière. ATTENTION : le texte officiel dit « basic living expenses » — le train de vie complet n'est pas garanti, et aucun montant n'est publié. Repère utile : la scolarité au tarif « African students » est de 16 000 USD contre 60 300 USD au tarif international, et ce tarif africain s'applique déjà à un Sénégalais avant toute bourse ; le coût de la vie annoncé est de 4 220 à 6 530 USD par an.",
      eligibility: {
        scope: "groupes",
        groups: ["afrique"],
        note: "Réservée aux candidats de nationalité africaine : « only admitted applicants of African nationality are eligible for financial aid ». 40 % des places vont à des Rwandais, 60 % aux autres pays."
      },
      generalCriteria: "IL FAUT D'ABORD ÊTRE ADMIS au master : la demande d'aide financière est un formulaire séparé, à remplir APRÈS le dépôt du dossier d'admission. Trois masters seulement, tous techniques — MSIT, MS ECE, MS Engineering AI : les filières non techniques sont exclues de fait. Enseignement en anglais, avec exigence officielle de « high proficiency in written and oral English », et « strong programming skills » demandées. Licence obtenue ou en cours de dernière année. Aucun frais de dossier. Calendrier officiel : ouverture le 1er octobre, admission anticipée le 15 décembre, clôture finale le 15 janvier — le site n'affiche AUCUN millésime à côté de ces dates."
    }
  },
  {
    id: "mastercard-foundation-scholars-university-of-rwanda",
    data: {
      title: "Mastercard Foundation Scholars Program — University of Rwanda",
      country: "Rwanda",
      levels: ["Licence", "Master"],
      status: "Fermée",
      isActive: false,
      funder: "organisation",
      funderName: "Mastercard Foundation",
      entryPoint: "universite",
      officialWebsite: "https://mcfsp.ur.ac.rw/",
      description: "Le plus large programme de bourses du Rwanda — 1 200 boursiers — ouvert aux ressortissants de tout pays africain ainsi qu'aux réfugiés et aux jeunes déplacés en Afrique.",
      funding: "Frais de scolarité, hébergement, ordinateur portable, matériel pédagogique, et billet retour vers le pays d'origine « si nécessaire ». S'y ajoutent mentorat académique, soutien psychosocial, formation au leadership, compétences entrepreneuriales, stages et mise en réseau. Aucune liste d'exclusions n'est publiée, et la prise en charge du billet reste conditionnelle.",
      eligibility: {
        scope: "groupes",
        groups: ["afrique"],
        note: "« a citizen of Rwanda or any African country, a refugee, or a displaced young person in Africa » — c'est la formulation la plus large des programmes Mastercard Foundation vérifiés."
      },
      generalCriteria: "ÉQUIVALENCE DE DIPLÔME OBLIGATOIRE pour tout diplôme étranger, à faire valider auprès du Higher Education Council et de la NESA rwandais : c'est l'obstacle pratique numéro un d'un dossier sénégalais, à lancer plusieurs mois à l'avance. Réservée aux NOUVEAUX admis — ne pas être déjà inscrit à l'University of Rwanda. Priorité aux filières STEM, la liste des programmes éligibles étant publiée à part. LA SÉLECTION PÈSE LE DÉSAVANTAGE ÉCONOMIQUE PLUS QUE LE MÉRITE : 45 % désavantage économique, 30 % talent académique, 25 % potentiel de leadership — un dossier sans preuves de précarité vérifiables est structurellement pénalisé. 90 % des boursiers sont en licence. Visa délivré à l'arrivée à Kigali, puis visa d'études à demander sous quinze jours avec casier judiciaire. Un smartphone est exigé dès l'arrivée, avant la remise de l'ordinateur portable. Cycle master 2026-2027 clos le 22 août 2026, aucune réouverture annoncée. NE JAMAIS ATTEINDRE LE PORTAIL PAR UN MOTEUR DE RECHERCHE : le domaine est victime d'une injection de référencement qui lui associe des titres de sites de jeux d'argent — taper l'adresse directement."
    }
  },
  {
    id: "aims-rwanda-masters-mathematical-sciences",
    data: {
      title: "AIMS Rwanda — Master's in Mathematical Sciences",
      country: "Rwanda",
      levels: ["Master"],
      status: "Fermée",
      isActive: false,
      funder: "organisation",
      funderName: "AIMS (African Institute for Mathematical Sciences)",
      entryPoint: "universite",
      officialWebsite: "https://aims.ac.rw/application/masters-in-mathematical-sciences-application/",
      description: "Master en sciences mathématiques où la bourse n'est pas un concours à part : tout étudiant africain admis est financé, et l'institut ne facture aucun frais de scolarité.",
      funding: "Bourse complète : aucun frais de scolarité (« There are no tuition fees at AIMS »), voyage, hébergement et pension, plus une petite allocation dont le montant n'est pas publié. RÉSERVE EXPLICITE : « Scholarships exclude family members — individuals cannot bring dependents » — il est impossible de venir avec conjoint ou enfants.",
      eligibility: {
        scope: "groupes",
        groups: ["afrique"],
        note: "« All African students receive full scholarships ». MAIS la rentrée de JANVIER est réservée aux ressortissants sud-africains et des pays de la SADC : le Sénégal n'en étant pas membre, un candidat sénégalais doit viser la rentrée principale."
      },
      generalCriteria: "DIPLÔME : trois voies d'accès, dont une qui vise nommément les systèmes francophones — « a three-year undergraduate degree with GCE A-level or Baccalaureat », valable uniquement pour AIMS-Ghana et AIMS-Rwanda. Une Licence sénégalaise en trois ans plus le baccalauréat ouvre donc bien ce master, malgré la mention « 4-year degree » qui figure ailleurs sur le site. AUCUN TEST DE LANGUE EXIGÉ : « No TOEFL, GRE, or English proficiency tests are mandatory for scholarship eligibility » — mais des cours d'anglais et de français peuvent être imposés sur place. Le dossier doit démontrer un niveau solide en mathématiques ainsi qu'un engagement de leadership et de service communautaire. Calendrier officiel : ouverture le 1er décembre, clôture le 31 mars. ATTENTION : la page du programme affiche encore « Applications are currently open » avec une date limite de mars 2024 — page périmée, seul le calendrier de la foire aux questions fait foi."
    }
  },
  {
    id: "mastercard-foundation-scholars-alu",
    data: {
      title: "Mastercard Foundation Scholars Program — African Leadership University",
      country: "Rwanda",
      levels: ["Licence"],
      status: "Admissions à entrées multiples, aucune date limite de bourse publiée",
      isActive: true,
      funder: "organisation",
      funderName: "Mastercard Foundation",
      entryPoint: "universite",
      officialWebsite: "https://www.alueducation.com/mastercard-foundation-scholars-program-at-alu/",
      ageMax: {
        tous: 26
      },
      ageMaxNote: "Critère officiel « Age 26 and below » : c'est le filtre le plus éliminatoire de ce programme.",
      description: "Licence à Kigali en leadership entrepreneurial, génie logiciel ou commerce international, avec une bourse attribuée sur besoin financier documenté et plusieurs rentrées par an.",
      funding: "Bourse dite « full-ride » couvrant les frais de scolarité et « additional financial support throughout the scholars' journey at ALU ». RÉSERVE CITÉE PAR ALU ELLE-MÊME : « terms and conditions may vary depending on the scholarship contract / partnering donor » — le contenu réel du financement varie d'un contrat de donateur à l'autre et n'est pas garanti à l'avance. Aucun montant publié. Repère : la scolarité affichée est de 3 000 USD par an pour le leadership entrepreneurial et le génie logiciel, 4 000 USD pour le commerce international, sur le campus de Kigali.",
      eligibility: {
        note: "Programme présenté comme ouvert « across Africa », avec des boursiers venus de 32 pays — mais ALU ne publie pas la liste de ces 32 pays. Le Sénégal n'y est ni nommé ni exclu."
      },
      generalCriteria: "LIMITE D'ÂGE DE 26 ANS, critère officiel. Résultats à l'examen national d'au moins « B » exigés, sans qu'ALU publie de table de conversion depuis le baccalauréat sénégalais. Besoin financier et désavantage socio-économique devant être prouvés par pièces justificatives. Potentiel de leadership et engagement communautaire actif exigés. Priorité affichée aux femmes, aux réfugiés et déplacés, et aux personnes en situation de handicap physique ou d'apprentissage. Trois licences seulement. Rentrées annoncées : janvier 2027 et mai 2027. La bourse se demande dans le dossier d'admission, il n'y a pas de candidature séparée. À NE PAS CONFONDRE avec les Mandela Scholarships et les ALU Grants du même établissement, qui ne couvrent QUE la scolarité et laissent hébergement, repas et frais de vie à Kigali à la charge de l'étudiant."
    }
  },
  {
    id: "aims-ghana-masters-mathematical-sciences",
    data: {
      title: "AIMS Ghana — Master's in Mathematical Sciences",
      country: "Ghana",
      levels: ["Master"],
      status: "Fermée",
      isActive: false,
      funder: "organisation",
      funderName: "AIMS (African Institute for Mathematical Sciences)",
      entryPoint: "universite",
      officialWebsite: "https://aims.edu.gh/application/masters-in-mathematical-sciences-application/",
      description: "Master en sciences mathématiques en trois semestres, où tout étudiant admis au programme structuré reçoit une bourse complète.",
      funding: "Bourse complète accordée à tous les étudiants admis au programme structuré : « Full scholarships will be awarded to all accepted students », avec hébergement, repas et assurance santé. RÉSERVE : billet d'avion, frais de visa et titre de séjour ne sont PAS mentionnés — les considérer comme à votre charge tant qu'AIMS ne l'a pas confirmé par écrit. Aucun montant d'allocation publié.",
      eligibility: {
        scope: "groupes",
        groups: ["afrique"],
        note: "Aucune restriction de nationalité affichée : AIMS Ghana se présente comme accueillant un « diverse Pan-African student body from across Africa »."
      },
      generalCriteria: "TROIS VOIES D'ACCÈS, dont une qui vise nommément les systèmes francophones : « a three-year undergraduate degree with GCE A-level or Baccalaureat », valable uniquement pour AIMS-Ghana et AIMS-Rwanda. Une Licence sénégalaise en trois ans plus le baccalauréat suffit donc. Les deux autres voies sont un diplôme de quatre ans en mathématiques, sciences ou ingénierie, ou un diplôme de trois ans avec mention honours. Le dossier doit démontrer un engagement de leadership et de service communautaire ; les candidatures féminines sont explicitement encouragées. Enseignement en anglais, aucune exigence de test publiée sur la page Ghana. Dernière date limite publiée : 15 mars 2026, réouverture non annoncée. À NOTER : le réseau AIMS a un centre au Sénégal, à Mbour, et la candidature passe par le même portail commun."
    }
  },
  {
    id: "ashesi-mastercard-foundation-scholars",
    data: {
      title: "The Mastercard Foundation Scholars Program — Ashesi University",
      country: "Ghana",
      levels: ["Licence"],
      status: "Rounds d'admission en juin, août, octobre et décembre — aucun millésime publié",
      isActive: true,
      funder: "organisation",
      funderName: "Mastercard Foundation",
      entryPoint: "universite",
      officialWebsite: "https://ashesi.edu.gh/the-mastercard-foundation-scholars-programme/",
      description: "Licence dans une université d'arts libéraux et d'ingénierie à trente kilomètres d'Accra, avec la bourse la plus complète de l'établissement, attribuée sur critères de ressources.",
      funding: "« One of the most comprehensive at Ashesi covering all fees and costs for room and board as well as learning resources », plus un accompagnement socio-économique jusqu'à l'insertion professionnelle. RÉSERVE : le site officiel ne mentionne NI billet d'avion international, NI frais de visa ou de titre de séjour, NI assurance santé, NI argent de poche mensuel. Faire confirmer ces postes par écrit au bureau des admissions avant de s'engager.",
      eligibility: {
        note: "Aucune liste de pays ni exclusion publiée. Le seul cadrage géographique officiel est que les boursiers « serve as role models for their communities across Africa »."
      },
      generalCriteria: "LE BACCALAURÉAT FRANÇAIS EST EXPLICITEMENT ACCEPTÉ : il figure dans la liste officielle des qualifications d'entrée reconnues. EN REVANCHE, TOEFL OU IELTS EST OBLIGATOIRE pour tout candidat dont l'anglais n'était pas la langue d'enseignement au lycée — c'est le cas de la quasi-totalité des lycées sénégalais, et Ashesi ne publie aucun score minimum. Tout document rédigé dans une autre langue que l'anglais doit être traduit et certifié conforme. Toutes les bourses de licence d'Ashesi sont attribuées sur critères de ressources. ON NE CANDIDATE PAS À CETTE BOURSE EN PARTICULIER : « Applicants do not choose which scholarship they may receive at Ashesi » — le bureau des admissions détermine, à partir du dossier général d'aide financière, quelle aide vous est attribuée."
    }
  },
  {
    id: "mastercard-foundation-scholars-knust",
    data: {
      title: "Mastercard Foundation Scholars Program — KNUST",
      country: "Ghana",
      levels: ["Licence"],
      status: "Fermée",
      isActive: false,
      funder: "organisation",
      funderName: "Mastercard Foundation",
      entryPoint: "bourse",
      officialWebsite: "https://mcf.knust.edu.gh/scholarship-application/",
      description: "Bourse de licence complète dans la grande université de sciences et technologies du Ghana, avec un dossier de bourse qui se dépose par coursier, indépendamment de l'admission.",
      funding: "« Comprehensive financial support » : scolarité intégrale, hébergement sur le campus entièrement payé, matériel pédagogique, transport et allocation mensuelle, plus accompagnement psychologique, développement de carrière, mentorat académique et stages. La procédure de candidature est entièrement gratuite. RÉSERVE : ni billet d'avion international, ni frais de visa, ni assurance santé ne sont mentionnés, et « transportation » n'est pas défini — il s'agit probablement du transport local.",
      eligibility: {
        note: "Aucune liste de pays sur la page officielle. Le cadrage est « academically talented yet economically disadvantaged qualified students in the deprived communities of Africa ». Un volet distinct pour candidats internationaux existe, mais n'a pu être lu que sur un relais tiers et reste à confirmer auprès du Program Manager."
      },
      generalCriteria: "LE DOSSIER SE DÉPOSE PAR COURSIER, pas en ligne : formulaire complété à envoyer au Program Manager, Mastercard Foundation Scholars Program, Africa Hall Road, Impact Building, KNUST, Kumasi. Il faut EN PLUS avoir déjà candidaté à l'admission KNUST et joindre le récépissé de cette candidature. Diplôme de fin d'études secondaires de moins de CINQ ANS et résultats déjà obtenus — aucun candidat en attente de résultats. Ne pas être déjà inscrit dans un établissement d'enseignement supérieur. Besoin économique critique à démontrer, antécédents de leadership et d'engagement communautaire, et engagement « Go-Back Give-Back » de redonner à sa communauté. Priorité aux candidates, aux personnes déplacées et réfugiées, et aux personnes en situation de handicap. Un baccalauréat sénégalais relève de la mention « or their equivalent » du règlement, sans que cette équivalence soit confirmée noir sur blanc. Dernier appel publié : 2025/2026, clos le 30 mai 2025 ; aucun appel 2026/2027 au 30 août 2026. Historique : appels lancés entre février et avril, clôture fin mai."
    }
  },
  {
    id: "pan-african-university-pausti",
    data: {
      title: "Bourses de l'Université panafricaine — institut PAUSTI (Kenya)",
      country: "Kenya",
      levels: ["Master", "Doctorat"],
      status: "Fermée",
      isActive: false,
      funder: "organisation",
      funderName: "Commission de l'Union africaine",
      entryPoint: "bourse",
      officialWebsite: "https://www.au-pau.org/submission/",
      ageMax: {
        master: 28,
        doctorat: 30
      },
      ageMaxNote: "Plafonds différents selon le genre : en master 25 ans pour les candidats et 28 pour les candidates ; en doctorat 28 et 30. Le catalogue retient la limite la plus favorable — la plus basse s'applique aux candidats.",
      description: "Master et doctorat financés par la Commission de l'Union africaine, ouverts à tout ressortissant d'un État membre et à la diaspora, dans l'institut de sciences et technologies hébergé par la JKUAT.",
      funding: "« The African Union Commission will offer full scholarships to successful candidates ». ATTENTION : l'appel officiel n'itémise PAS le contenu de cette bourse complète — ni la foire aux questions de la PAU ni la page de PAUSTI ne détaillent scolarité, hébergement, billet d'avion, assurance ou allocation de recherche. Aucun montant n'est publié ; ne pas se fier aux chiffres qui circulent sur les sites d'agrégation de bourses.",
      eligibility: {
        scope: "groupes",
        groups: ["afrique"],
        note: "« Any African student living in Africa or in the Diaspora who meets the eligibility criteria » (foire aux questions officielle). Le Sénégal est État membre de l'Union africaine et aucune restriction régionale n'apparaît dans l'appel."
      },
      generalCriteria: "LA CANDIDATURE À LA BOURSE ET LA CANDIDATURE D'ADMISSION SONT LA MÊME DÉMARCHE, sur le portail unique de la PAU. Appel 2026-2027 lancé le 15 novembre 2025 et clos le 15 décembre 2025 — « applications received after this deadline will NOT be considered » ; l'appel suivant n'est pas annoncé, et l'historique place les lancements entre juin et décembre. Des examens de sélection peuvent être organisés. Filières limitées au catalogue de l'institut choisi ; PAUSTI, hébergé par la JKUAT, couvre les sciences fondamentales, la technologie et l'innovation, en anglais. TROIS AUTRES INSTITUTS existent, non encore présents dans ce catalogue : PAULESI à Ibadan au Nigeria, PAUGHSS à Yaoundé et Buea au Cameroun, et PAUWES à Tlemcen en Algérie — ce dernier étant le seul situé en pays francophone."
    }
  },
  {
    id: "mastercard-foundation-scholars-usiu",
    data: {
      title: "Mastercard Foundation Scholars Program — USIU-Africa",
      country: "Kenya",
      levels: ["Licence"],
      status: "Fermée",
      isActive: false,
      funder: "organisation",
      funderName: "Mastercard Foundation",
      entryPoint: "universite",
      officialWebsite: "https://www.usiu.ac.ke/mastercard-foundation-scholars-program/",
      ageMax: {
        tous: 32
      },
      ageMaxNote: "29 ans dans le cas général ; 32 ans pour les réfugiés, les personnes déplacées et les personnes en situation de handicap. Le catalogue retient la limite la plus favorable.",
      description: "Licence à Nairobi dans un cursus de système américain, avec une bourse explicitement ouverte à toute l'Afrique — mais une grille d'équivalence de notes qui ne couvre pas le Sénégal.",
      funding: "Scolarité et frais fonctionnels, ordinateur portable, livres et matériel pédagogique, hébergement et repas, assurance maladie, allocation, transport aller-retour vers le pays d'origine, formation au leadership et à l'entrepreneuriat, soutien psychosocial, orientation de carrière et mentorat, aménagements en cas de handicap, frais de dossier exonérés. Aucune liste d'exclusions n'est publiée.",
      eligibility: {
        scope: "groupes",
        groups: ["afrique"],
        note: "« The scholarship is open to applicants from across the African continent » et « only open to African nationalities » (foire aux questions officielle) — l'idée reçue d'un programme réservé au Kenya et à l'Afrique de l'Est est fausse pour celui-ci."
      },
      generalCriteria: "POINT DE VIGILANCE PROPRE AUX DOSSIERS SÉNÉGALAIS : la grille officielle d'équivalence de notes ne couvre que quatorze pays et le Sénégal n'y figure pas — le seul système francophone listé est celui du Tchad. Aucune équivalence n'est publiée pour le baccalauréat sénégalais : la faire confirmer par écrit avant de monter un dossier. Réservée à un PREMIER diplôme de licence : les titulaires d'un diplôme post-licence et les diplômés sont inéligibles. Catalogue fermé de programmes éligibles, dont le nombre diffère selon la page consultée chez USIU — onze ou treize. Moyenne minimale C+, ou B- pour la pharmacie et les sciences de la santé. Besoin financier à démontrer. Enseignement en anglais. Le dossier de bourse est un envoi dédié au Scholars Program Office, distinct du portail d'admission ordinaire. Les appels sont publiés cinq mois avant chaque rentrée : en octobre-novembre pour la rentrée de mai, en février-mars pour celle de septembre."
    }
  },
  {
    id: "arppis-daad-icipe",
    data: {
      title: "ARPPIS-DAAD PhD Scholarships — icipe (Nairobi)",
      country: "Kenya",
      levels: ["Doctorat"],
      status: "Fermée",
      isActive: false,
      funder: "gouvernement",
      funderName: "DAAD (avec l'icipe)",
      entryPoint: "bourse",
      officialWebsite: "https://scholarships.icipe.org/",
      description: "Doctorat de trois ans entièrement financé dans un centre international de recherche à Nairobi, avec un diplôme délivré par une université partenaire du réseau ARPPIS.",
      funding: "« All costs of the PhD programme, including travel, living expenses, medical insurance, university fees and all research and training costs », sur trois ans. Aucune liste d'exclusions n'est publiée, et la prise en charge d'une famille n'est pas documentée.",
      eligibility: {
        scope: "groupes",
        groups: ["afrique"],
        note: "« A citizen of a country in sub-Saharan Africa », et l'annonce officielle « encourages applications from French- and Portuguese-speaking countries in Africa » — c'est le seul programme de ce lot à appeler explicitement les francophones."
      },
      generalCriteria: "FILIÈRE IMPOSÉE : sciences de l'insecte, santé humaine, animale ou végétale, environnement. « Good working knowledge of English (written & spoken) » exigé. ATTENTION AUX APPELS THÉMATIQUES, qui ajoutent des barrières lourdes : l'appel One Health exigeait deux publications dans des revues reconnues ainsi qu'une expérience de travail en Afrique de l'Est, ce qui exclut de fait un candidat ouest-africain. Le diplôme est délivré par une université partenaire du réseau ARPPIS, que l'icipe annonce à 29 universités dans 16 pays africains. Le dossier se dépose sur le portail de l'icipe ET doit être signalé par courriel au DAAD. Au 30 août 2026, le portail affiche « There are no active PhD calls at the moment »."
    }
  },
  {
    id: "auc-african-graduate-fellowship",
    data: {
      title: "African Graduate Fellowships — The American University in Cairo",
      country: "Égypte",
      levels: ["Master"],
      status: "Réouverture du 7 octobre au 2 novembre 2026",
      isActive: true,
      funder: "universite",
      funderName: "The American University in Cairo",
      entryPoint: "universite",
      officialWebsite: "https://www.aucegypt.edu/admissions/fellowships/listings/african-graduate",
      description: "Bourse de master réservée aux ressortissants africains non égyptiens, couvrant scolarité, logement, assurance et allocation dans une université américaine du Caire.",
      funding: "Frais de scolarité plafonnés à 9 crédits par semestre, allocation, frais de services et d'activités étudiantes, frais médicaux et assurance santé, et allocation mensuelle de logement ou hébergement en résidence universitaire ; la mise à niveau en anglais peut être couverte. RÉSERVES : au-delà de 9 crédits par semestre le surcoût est à votre charge ; la durée est plafonnée à 5 semestres plus une session d'été, 7 semestres pour Counseling Psychology ; le voyage international n'est pas mentionné comme couvert ; le montant de l'allocation n'est pas publié.",
      eligibility: {
        scope: "groupes",
        groups: ["afrique"],
        note: "« Non-Egyptian African nationals ». EXCLUSION EXPLICITE : « African nationals with dual non-African nationality are not eligible » — un Sénégalais également français, canadien ou américain n'est pas éligible et doit viser l'International Graduate Fellowship de la même université."
      },
      generalCriteria: "DEUX DOSSIERS DISTINCTS : la candidature d'admission au master doit être déposée au moins deux semaines avant la date limite de la bourse, mais il n'est PAS nécessaire d'attendre la décision d'admission pour candidater à la bourse. Enseignement en anglais : TOEFL iBT ou IELTS exigé selon les seuils de l'AUC. Besoin financier à démontrer. Moyenne de 3,2 à maintenir pendant tout le cursus. Ouverte à toutes les disciplines de master. Calendrier officiel : cycle printemps 2027 du 7 octobre au 2 novembre 2026 ; automne 2027 en deux cycles, du 22 décembre 2026 au 17 janvier 2027, puis du 6 avril au 6 mai 2027."
    }
  },
  {
    id: "auc-international-graduate-fellowship",
    data: {
      title: "International Graduate Fellowships — The American University in Cairo",
      country: "Égypte",
      levels: ["Master"],
      status: "Réouverture du 7 octobre au 2 novembre 2026",
      isActive: true,
      funder: "universite",
      funderName: "The American University in Cairo",
      entryPoint: "universite",
      officialWebsite: "https://www.aucegypt.edu/admissions/fellowships/listings/international-graduate",
      description: "Même dispositif que l'African Graduate Fellowship, mais ouvert à tous les candidats internationaux — et sans la clause qui écarte les binationaux.",
      funding: "Frais de scolarité plafonnés à 9 crédits par semestre, allocation, frais de services et d'activités étudiantes, service médical et assurance santé, et allocation mensuelle de logement ou hébergement en résidence AUC. RÉSERVES : durée plafonnée à 5 semestres plus une session d'été, 7 pour Counseling Psychology ; au-delà de 9 crédits par semestre le surcoût est à votre charge ; montants non publiés.",
      eligibility: {
        scope: "monde",
        note: "« International applicants; open to all disciplines of graduate studies ». Contrairement à l'African Graduate Fellowship, cette bourse n'écarte PAS les binationaux : c'est le repli d'un Sénégalais possédant une seconde nationalité non africaine."
      },
      generalCriteria: "DEUX DOSSIERS DISTINCTS, comme pour l'African Graduate Fellowship : admission déposée au moins deux semaines avant la date limite de la bourse, sans attendre la décision d'admission. Enseignement en anglais : TOEFL iBT ou IELTS exigé selon les seuils de l'AUC. Besoin financier à démontrer, moyenne de 3,2 à maintenir. Mêmes cycles de candidature : 7 octobre au 2 novembre 2026 pour le printemps 2027, puis deux cycles pour l'automne 2027."
    }
  },
  {
    id: "universite-senghor-master-developpement",
    data: {
      title: "Master en Développement — Université Senghor d'Alexandrie",
      country: "Égypte",
      levels: ["Master"],
      status: "Fermée",
      isActive: false,
      funder: "organisation",
      funderName: "Université Senghor (Organisation internationale de la Francophonie)",
      entryPoint: "bourse",
      officialWebsite: "https://usenghor-francophonie.org/actualites/appels/master-1-de-l-universite-senghor",
      ageMax: {
        tous: 36
      },
      ageMaxNote: "Avoir moins de 36 ans au 1er septembre. L'âge conditionne la BOURSE, pas l'admission : un candidat plus âgé peut être admis en autofinancement.",
      description: "Master en développement ENSEIGNÉ EN FRANÇAIS, dans l'université opérateur direct de la Francophonie, avec logement, repas quotidien, assurance et allocation mensuelle pour cent boursiers.",
      funding: "Cent boursiers ne paient que 400 € par an de frais administratifs. Sont pris en charge : logement en studio individuel sur le campus de Borg El-Arab, un repas quotidien, l'assurance médicale, le transport du week-end vers Alexandrie, et une allocation de subsistance de 4 000 livres égyptiennes par mois. En seconde année s'ajoutent le billet aller-retour et les frais de visa du stage. RÉSERVES EXPLICITES : le voyage international vers et depuis l'Égypte n'est PAS pris en charge, ni les retours au pays pendant les vacances ; en seconde année, 3 700 € de frais de subsistance restent à la charge du candidat ; l'université ne prend pas en charge les indemnités de stage.",
      eligibility: {
        note: "Aucune liste de nationalités ni exclusion n'apparaît sur les appels officiels : le Sénégal n'y est ni nommé ni exclu. L'Université Senghor est un opérateur direct de la Francophonie, dont le Sénégal est membre fondateur — éligibilité à confirmer par écrit auprès de concours@usenghor.org."
      },
      generalCriteria: "SEULE BOURSE DE CE LOT ENSEIGNÉE EN FRANÇAIS, ce qui lève la barrière linguistique qui pèse sur tous les autres programmes africains du catalogue. Recrutement SUR CONCOURS : épreuve écrite puis oraux. Entrée en première année : Bac+3 et « une expérience professionnelle pertinente d'au moins une année ». Entrée directe en seconde année : Bac+4 et un an d'expérience, ou Bac+3 et trois ans d'expérience avec dossier de validation des acquis — le candidat doit alors être EN SITUATION D'ACTIVITÉ PROFESSIONNELLE, sauf pour la spécialité gestion globale des risques et des crises. Cycle 2026 : première année close le 15 mars 2026, écrit le 29 avril, oraux en seconde quinzaine de mai ; seconde année close le 30 avril 2026. Cycle 2027 non annoncé. Une école doctorale interdisciplinaire en développement africain existe également, aux conditions non vérifiées."
    }
  },
  {
    id: "al-azhar-bourses-etudiants-etrangers",
    data: {
      title: "Bourses d'Al-Azhar pour étudiants étrangers",
      country: "Égypte",
      levels: [],
      status: "Procédure non documentée en ligne — passer par l'ambassade d'Égypte à Dakar",
      isActive: false,
      funder: "gouvernement",
      funderName: "Al-Azhar Al-Sharif",
      entryPoint: "bourse",
      officialWebsite: "https://azhar.eg/foreignstudent/",
      image: "al-azhar-cairo.jpg",
      description: "Un contingent de bourses sénégalaises existe réellement et transite par l'ambassade d'Égypte à Dakar — mais aucun critère officiel n'est consultable en ligne.",
      funding: "Non documenté. Les pages officielles d'Al-Azhar consacrées aux étudiants étrangers sont inaccessibles depuis l'étranger, y compris lors de la vérification du 30 août 2026. Ne rien supposer sur la prise en charge tant que l'ambassade ne l'a pas confirmé par écrit.",
      eligibility: {
        note: "Un contingent sénégalais existe réellement : l'Agence de presse sénégalaise rapportait le 15 juillet 2026 la remise de leurs documents à huit boursiers pour Al-Azhar par l'ambassadeur d'Égypte au Sénégal, Khaled Aref, ainsi que l'annonce de « 40 bourses en plus » l'année suivante. Aucun critère officiel n'est publié en ligne."
      },
      generalCriteria: "FICHE VOLONTAIREMENT INCOMPLÈTE, ET ASSUMÉE COMME TELLE. Les pages officielles (azhar.eg, service.azhar.eg, international.azu.edu.eg) n'ont pas pu être consultées : elles sont bloquées depuis l'extérieur de l'Égypte. Rien n'est donc vérifié sur les niveaux couverts, les montants, les dates limites, la langue d'enseignement, ni sur l'éventuelle exigence de mémorisation du Coran. LA SEULE VOIE FIABLE POUR UN CANDIDAT SÉNÉGALAIS EST L'AMBASSADE D'ÉGYPTE À DAKAR, ainsi que le bureau des étudiants étrangers d'Al-Azhar. Ne pas se fier aux informations qui circulent sur les blogs et les pages de réseaux sociaux. À NE PAS CONFONDRE avec l'aide dite « des wafidin », qui s'adresse aux étudiants DÉJÀ installés en Égypte et exige une résidence en règle."
    }
  },
];

// Rattachements bourse -> université(s). Convention du lot 29 :
// les NIVEAUX ne sont pas écrits ici, ils sont lus sur le champ
// `levels` de la bourse — une bourse sans niveau ne produit aucun
// programme au lieu d'en produire des muets. `pays` est comparé
// STRICTEMENT au `country` de l'université : c'est la rigidité de
// cette garde qui a attrapé une faute d'accent au lot 29.
//
// `language` n'est renseignée que lorsque la langue d'enseignement a
// été VÉRIFIÉE à la source : elle alimente languageMatch() dans
// js/recommend-programs.js. Vide = inconnue, jamais supposée.
export const LINKS = [
  {
    scholarshipId: "mastercard-foundation-scholars-cmu-africa",
    pays: "Rwanda",
    universityIds: ["carnegie-mellon-university-africa-kigali"],
    motif: "seul établissement du programme au Rwanda ; la bourse EST celle de ce campus",
    language: "Anglais"
  },
  {
    scholarshipId: "mastercard-foundation-scholars-university-of-rwanda",
    pays: "Rwanda",
    universityIds: ["university-of-rwanda-kigali"],
    motif: "programme propre à l'University of Rwanda, aucun autre établissement concerné",
    language: ""
  },
  {
    scholarshipId: "aims-rwanda-masters-mathematical-sciences",
    pays: "Rwanda",
    universityIds: ["aims-rwanda-kigali"],
    motif: "le centre AIMS de Kigali est à la fois le bailleur et l'établissement d'accueil",
    language: "Anglais"
  },
  {
    scholarshipId: "mastercard-foundation-scholars-alu",
    pays: "Rwanda",
    universityIds: ["african-leadership-university-kigali"],
    motif: "programme propre à ALU, campus de Kigali",
    language: ""
  },
  {
    scholarshipId: "aims-ghana-masters-mathematical-sciences",
    pays: "Ghana",
    universityIds: ["aims-ghana-accra"],
    motif: "le centre AIMS d'Accra est à la fois le bailleur et l'établissement d'accueil",
    language: ""
  },
  {
    scholarshipId: "ashesi-mastercard-foundation-scholars",
    pays: "Ghana",
    universityIds: ["ashesi-university-berekuso"],
    motif: "programme propre à Ashesi, l'un des neuf partenaires fondateurs",
    language: "Anglais"
  },
  {
    scholarshipId: "mastercard-foundation-scholars-knust",
    pays: "Ghana",
    universityIds: ["knust-kumasi"],
    motif: "programme propre à KNUST, dossier déposé sur son campus de Kumasi",
    language: "Anglais"
  },
  {
    scholarshipId: "pan-african-university-pausti",
    pays: "Kenya",
    universityIds: ["jkuat-juja"],
    motif: "PAUSTI est hébergé par la JKUAT ; les trois autres instituts de la PAU sont dans d'autres pays et feront l'objet d'un lot séparé",
    language: "Anglais"
  },
  {
    scholarshipId: "mastercard-foundation-scholars-usiu",
    pays: "Kenya",
    universityIds: ["usiu-africa-nairobi"],
    motif: "programme propre à USIU-Africa",
    language: "Anglais"
  },
  {
    scholarshipId: "arppis-daad-icipe",
    pays: "Kenya",
    universityIds: ["icipe-nairobi"],
    motif: "l'icipe accueille le doctorant ; le diplôme est délivré par une université partenaire ARPPIS, non identifiable à l'avance",
    language: "Anglais"
  },
  {
    scholarshipId: "auc-african-graduate-fellowship",
    pays: "Égypte",
    universityIds: ["american-university-in-cairo-le-caire"],
    motif: "bourse propre à l'AUC",
    language: "Anglais"
  },
  {
    scholarshipId: "auc-international-graduate-fellowship",
    pays: "Égypte",
    universityIds: ["american-university-in-cairo-le-caire"],
    motif: "bourse propre à l'AUC",
    language: "Anglais"
  },
  {
    scholarshipId: "universite-senghor-master-developpement",
    pays: "Égypte",
    universityIds: ["universite-senghor-alexandrie"],
    motif: "l'Université Senghor est à la fois le bailleur et l'établissement d'accueil",
    language: "Français"
  },
];
