// ============================================================
// FitzUniverse — Lot 37 : TUNISIE, ALGÉRIE, UNIVERSITÉ PANAFRICAINE (PAUWES)
// P2 du chantier « catalogue irréprochable » — recherche du 2026-09-03,
// sources officielles uniquement (MESRI Sénégal, CNOSP, MES Tunisie via
// sicad.gov.tn, MESRS Algérie, au.int / pau-au.africa, sites des
// universités, topuniversities).
//
// POURQUOI
// Tunisie et Algérie sont les destinations historiques des bacheliers
// sénégalais par la coopération bilatérale, et le catalogue n'avait NI
// l'un NI l'autre (28 pays sans le Maghreb hors Maroc). La Pan African
// University, repérée au lot 31, n'était présente que par son institut
// kényan (PAUSTI) ; PAUWES à Tlemcen est le seul institut de la PAU en
// pays francophone — mais il ENSEIGNE EN ANGLAIS (voir fiche).
//
// CE QUE CE LOT DIT HONNÊTEMENT
//   - Les deux bourses de coopération n'ont PAS de portail : le dossier
//     se dépose à la Direction des Bourses du MESRI à Dakar, qui
//     transmet. entryPoint "bourse", scope "liste" [SN] — le Sénégal
//     reçoit un quota, ce n'est pas une bourse ouverte au monde.
//   - Les MONTANTS ne sont publiés par aucune source officielle
//     accessible (mes.tn hors ligne, guide MESRS non lié) : le champ
//     funding le dit, aucun chiffre d'agrégateur n'est repris.
//   - L'offre algérienne au Sénégal est IRRÉGULIÈRE (2 bourses en 2024,
//     rien de publié pour 2025-26 ni 2026-27) : le statut le dit.
//   - Le communiqué tunisien 2026-2027 est publié en IMAGES sur
//     mesrisenegal.sn : les critères chiffrés (18-23 ans, mention Bien)
//     viennent d'une transcription non officielle → dans le texte comme
//     « à confirmer sur le communiqué », JAMAIS dans ageMax.
//   - studyinalgeria.dz n'est PAS une bourse (autofinancement) : il
//     devient le PORTAIL des universités publiques algériennes
//     (plateforme d'État = portail d'admission, doctrine studyinsaudi).
//     Les universités tunisiennes n'ont AUCUN portail pour un bachelier
//     étranger (affectation par la DGCI après sélection du MESRI) :
//     champ vide, comme les trois marocaines publiques.
//
// PIÈGE `ranking` : « # » réservé à un rang MONDIAL. Aucune de ces
// universités n'a de rang mondial QS 2026 hors tranche (El Manar
// 731-740, Sfax 1001-1200, Sousse 1201-1400) ; les autres n'ont qu'un
// rang QS Arab Region — écrit en toutes lettres, sans « # ».
//
// ÂGE — PAU : appel 2026-2027 « not older than 25 years for male and
// 28 years for female » (master), « maximum 28 / 30 » (doctorat). Règle
// de prudence (limite variable → la PLUS HAUTE + note) : 28 / 30.
//
// DRAPEAUX : tn.svg et dz.svg ajoutés à assets/flags (flag-icons 7.5.0,
// MIT, comme rw/gh/ke/eg au lot 31). PHOTOS : add-lot37-photos.mjs.
//
// PROGRAMMES ATTENDUS : Tunisie (Licence) × 4 = 4 ; Algérie (L+M+D) × 5
// = 15 ; PAUWES (M+D) × 1 = 2 ; total 21.
// ============================================================

import { existsSync } from "node:fs";

const STUDY_IN_ALGERIA = "https://studyinalgeria.dz/";

export const UNIVERSITIES = [
  // ---------------- Tunisie ----------------
  {
    id: "universite-de-tunis-el-manar-tunis",
    data: {
      name: "Université de Tunis El Manar",
      city: "Tunis",
      country: "Tunisie",
      image: "tunis.jpg",
      flag: "tn.svg",
      ranking: "Rang 731-740 mondial (QS 2026) — 41e du QS Arab Region",
      description: "Première université tunisienne aux classements, sur le campus Farhat-Hached d'El Manar : sciences, médecine, pharmacie, ingénierie (ENIT), droit, économie. Enseignement en français pour les sciences, la santé et l'ingénierie, en arabe pour le droit et les lettres. Rubrique « Coopération – Étudiants étrangers » renvoyant au Guide des étudiants internationaux du ministère. PIÈGE : aucune candidature directe pour un bachelier étranger — l'affectation se fait par la Direction générale de la coopération internationale (Tunis) après sélection par le MESRI à Dakar.",
      officialWebsite: "https://utm.rnu.tn/utm/",
      applicationPortalUrl: "",
      fields: []
    }
  },
  {
    id: "universite-de-carthage-tunis",
    data: {
      name: "Université de Carthage",
      city: "Tunis",
      country: "Tunisie",
      image: "carthage.jpg",
      flag: "tn.svg",
      ranking: "Non classée au QS World 2026 — 94e du QS Arab Region",
      description: "Créée en 1988, siège à Amilcar dans la banlieue nord de Tunis, près du site archéologique de Carthage : 35 établissements, 289 diplômes dont 48 diplômes nationaux d'ingénieur (INSAT, Polytechnique de Tunisie, ENSI…), 57 masters de recherche, 40 doctorats. Français pour l'ingénierie et les sciences, arabe pour d'autres filières, quelques masters en anglais. Programme Erasmus+ actif. PIÈGE : le portail concours.ucar.rnu.tn est celui des concours nationaux tunisiens ; un bachelier étranger passe par la coopération (MESRI Dakar → DGCI Tunis).",
      officialWebsite: "https://ucar.rnu.tn/",
      applicationPortalUrl: "",
      fields: []
    }
  },
  {
    id: "universite-de-sousse-sousse",
    data: {
      name: "Université de Sousse",
      city: "Sousse",
      country: "Tunisie",
      image: "sousse.jpg",
      flag: "tn.svg",
      ranking: "Rang 1201-1400 mondial (QS 2026) — 108e du QS Arab Region",
      description: "Université pluridisciplinaire du Sahel tunisien : sciences fondamentales, droit, économie et gestion, techniques, agronomie, médecine et paramédical, arts et métiers, lettres et sciences humaines. Première de Tunisie et du Maghreb au UI GreenMetric 2021, classée 601-800 au THE Impact Rankings. Enseignement majoritairement en français. Ville côtière à médina classée au patrimoine mondial. Voie d'accès pour un bachelier sénégalais : la coopération bilatérale, pas de candidature directe.",
      officialWebsite: "https://www.uc.rnu.tn/",
      applicationPortalUrl: "",
      fields: []
    }
  },
  {
    id: "universite-de-sfax-sfax",
    data: {
      name: "Université de Sfax",
      city: "Sfax",
      country: "Tunisie",
      image: "sfax.jpg",
      flag: "tn.svg",
      ranking: "Rang 1001-1200 mondial (QS 2026) — 66e du QS Arab Region",
      description: "Fondée en 1986 : 19 établissements, environ 30 000 étudiants dont 770 internationaux, 5 écoles doctorales, 81 laboratoires. Deuxième pôle universitaire du pays, fort en ingénierie (ENIS), sciences, médecine et gestion ; très active dans Erasmus+, Horizon Europe et PRIMA. Français pour les sciences, l'ingénierie et la médecine, arabe pour le droit et les lettres. Sa page « étudiants internationaux » concerne les échanges ; l'admission d'un bachelier étranger passe par la coopération.",
      officialWebsite: "https://uss.rnu.tn/",
      applicationPortalUrl: "",
      fields: []
    }
  },

  // ---------------- Algérie ----------------
  {
    id: "universite-abou-bekr-belkaid-tlemcen",
    data: {
      name: "Université Abou Bekr Belkaïd de Tlemcen",
      city: "Tlemcen",
      country: "Algérie",
      image: "tlemcen.jpg",
      flag: "dz.svg",
      ranking: "Non classée au QS World 2026 — 137e du QS Arab Region",
      description: "Université hôte de l'institut PAUWES de l'Université panafricaine (eau, énergie, changement climatique). Neuf facultés et instituts : technologie, sciences, sciences de la nature et de la vie, médecine, sciences économiques, droit, lettres et langues, sciences humaines. Français pour les sciences, la technologie et la médecine, arabe pour d'autres filières — et ANGLAIS pour les programmes PAUWES. Deux voies pour un Sénégalais : la bourse de l'Union africaine (portail PAU) ou la coopération bilatérale via le MESRI ; les étudiants autofinancés passent par la plateforme d'État Study in Algeria.",
      officialWebsite: "https://www.univ-tlemcen.dz/",
      applicationPortalUrl: STUDY_IN_ALGERIA,
      fields: []
    }
  },
  {
    id: "usthb-alger",
    data: {
      name: "Université des Sciences et de la Technologie Houari-Boumediene (USTHB)",
      city: "Alger",
      country: "Algérie",
      image: "alger-baie.jpg",
      flag: "dz.svg",
      ranking: "Non classée au QS World 2026 — 191-200 au QS Arab Region, 101-150 dans une discipline (QS by Subject 2026)",
      description: "La plus grande université scientifique d'Algérie, sur le campus de Bab Ezzouar à l'est d'Alger : environ 54 500 étudiants, 2 180 enseignants, neuf facultés (mathématiques, physique, chimie, informatique, biologie, génie civil, génie électrique, génie des procédés et mécanique, sciences de la Terre). Enseignement en français pour les sciences et la technologie. Boursiers de coopération affectés par le ministère ; étudiants autofinancés via la plateforme d'État Study in Algeria (campagne annuelle, dépôt clos le 30 juin 2026 pour la rentrée 2026).",
      officialWebsite: "https://www.usthb.dz/",
      applicationPortalUrl: STUDY_IN_ALGERIA,
      fields: []
    }
  },
  {
    id: "universite-alger-1-benyoucef-benkhedda-alger",
    data: {
      name: "Université d'Alger 1 – Benyoucef Benkhedda",
      city: "Alger",
      country: "Algérie",
      image: "alger-centre.jpg",
      flag: "dz.svg",
      ranking: "Non classée au QS World 2026 — 201-250 au QS Arab Region",
      description: "La plus ancienne université d'Algérie (1909), rue Didouche-Mourad à Alger-Centre : droit, médecine, sciences. Arabe pour le droit, français pour la médecine et les sciences ; centre d'enseignement intensif des langues sur place. Section « étudiants internationaux » sur le site ; les boursiers de coopération sont affectés par le ministère, les autofinancés passent par Study in Algeria.",
      officialWebsite: "https://www.univ-alger.dz/",
      applicationPortalUrl: STUDY_IN_ALGERIA,
      fields: []
    }
  },
  {
    id: "universite-constantine-1-freres-mentouri-constantine",
    data: {
      name: "Université Frères Mentouri – Constantine 1",
      city: "Constantine",
      country: "Algérie",
      image: "constantine.jpg",
      flag: "dz.svg",
      ranking: "Non classée au QS World 2026 — 171-180 au QS Arab Region",
      description: "Campus de la route d'Aïn El Bey, dans la ville des ponts suspendus : neuf composantes, dont sciences et technologie, sciences de la nature et de la vie, sciences exactes, sciences de la Terre, droit, lettres et langues, un institut de nutrition et d'agroalimentaire et un institut des sciences vétérinaires. Français pour les sciences et la technologie, arabe pour le droit et les lettres. Dispose d'un « Bureau des internationaux » ; voie boursier via le ministère, voie autofinancée via Study in Algeria.",
      officialWebsite: "https://www.umc.edu.dz/",
      applicationPortalUrl: STUDY_IN_ALGERIA,
      fields: []
    }
  },
  {
    id: "universite-oran-1-ahmed-ben-bella-oran",
    data: {
      name: "Université d'Oran 1 – Ahmed Ben Bella",
      city: "Oran",
      country: "Algérie",
      image: "oran.jpg",
      flag: "dz.svg",
      ranking: "Non classée au QS World 2026 — 201-250 au QS Arab Region",
      description: "Université de la deuxième ville d'Algérie, campus d'Es-Sénia : médecine, sciences de la nature et de la vie, sciences exactes et appliquées, lettres et arts, sciences humaines, sciences islamiques ; instituts de sciences appliquées, de criminologie, de traduction. Français pour la médecine et les sciences, arabe pour les sciences islamiques et les lettres. Le vice-rectorat des relations extérieures gère une plateforme « foreign students » pour les étudiants déjà affectés — la candidature d'un autofinancé passe par Study in Algeria.",
      officialWebsite: "https://www.univ-oran1.dz/",
      applicationPortalUrl: STUDY_IN_ALGERIA,
      fields: []
    }
  }
];

export const SCHOLARSHIPS = [
  // ---------------- Union africaine — PAUWES ----------------
  {
    id: "pan-african-university-pauwes",
    data: {
      title: "Bourses de l'Université panafricaine — institut PAUWES (Tlemcen, Algérie)",
      country: "Algérie",
      levels: ["Master", "Doctorat"],
      status: "Fermée — appel 2027-2028 attendu en octobre-novembre 2026",
      isActive: false,
      image: "pan-african-university-pauwes.jpg",
      funder: "organisation",
      funderName: "Commission de l'Union africaine (Pan African University)",
      entryPoint: "bourse",
      officialWebsite: "https://pau-au.africa/institutes/pauwes/",
      description: "L'institut de l'Université panafricaine consacré à l'eau, à l'énergie et au changement climatique, hébergé par l'université de Tlemcen : masters (eau, énergie, filières ingénierie ou politiques publiques) et doctorat, financés par la Commission de l'Union africaine. Ouvert à tous les ressortissants des États membres de l'UA et de la diaspora — le Sénégal en fait partie par construction. ATTENTION : malgré l'implantation en Algérie, l'ENSEIGNEMENT EST EN ANGLAIS (« strong command of English, French is an asset »).",
      funding: "« Full scholarships (covering tuition and living expenses) for all successful applicants » ; l'assurance médicale est prélevée sur l'allocation (« covered from disbursed stipends »). LE MONTANT MENSUEL N'EST PAS PUBLIÉ dans l'appel 2026-2027 ni sur le site de la PAU — ne pas se fier aux chiffres d'agrégateurs. Engagement de servir un État membre de l'UA pendant une durée au moins égale à celle de la bourse.",
      eligibility: {
        scope: "groupes",
        groups: ["afrique"],
        note: "« Young, qualified, talented, and enterprising applicants from African countries and the Diaspora are invited to apply » (appel 2026-2027)."
      },
      ageMax: { master: 28, doctorat: 30 },
      ageMaxNote: "Appel 2026-2027 : master « not older than 25 years for male and 28 years for female applicants », doctorat « maximum 28 years old for male and 30 years old for female ». Le catalogue retient la limite la plus haute ; un candidat masculin doit compter 25 ans en master et 28 en doctorat. La page « Admission requirements » de PAUWES affiche encore 30/35 : c'est l'appel annuel qui fait foi.",
      generalCriteria: "Master : licence d'une université reconnue avec « at least a second-class upper division or its equivalent » (l'appel ne donne pas d'équivalence chiffrée — viser au moins la mention Bien). Doctorat : master dans le domaine. Dossier : diplômes et relevés certifiés, passeport, CV, une lettre de recommandation, coordonnées de trois enseignants référents, certificat médical d'un médecin assermenté du pays d'origine (PAUWES). Épreuve écrite ou orale possible après présélection. Calendrier 2026-2027 : appel annoncé le 11 octobre 2025, candidatures du 15 novembre au 15 décembre 2025 — fenêtre d'UN MOIS, une fois par an ; des appels spéciaux hors cycle existent (février 2025). Dépôt sur le portail au-pau.org/submission — PIÈGE : le portail affichait encore les dates 2024-2025 lors de la vérification, se fier aux dates publiées sur pau-au.africa ou au.int."
    }
  },

  // ---------------- Tunisie — coopération bilatérale ----------------
  {
    id: "bourses-cooperation-tunisie",
    data: {
      title: "Bourses et inscriptions de coopération en Tunisie (quota du Sénégal)",
      country: "Tunisie",
      levels: ["Licence"],
      status: "Fermée — campagne 2027-2028 attendue entre juillet et octobre 2027",
      isActive: false,
      image: "bourses-cooperation-tunisie.jpg",
      funder: "gouvernement",
      funderName: "Ministère tunisien de l'Enseignement supérieur — via la Direction des Bourses du MESRI (Sénégal)",
      entryPoint: "bourse",
      officialWebsite: "https://mesrisenegal.sn/bourses-detudes/",
      description: "Chaque année, le ministère tunisien de l'Enseignement supérieur met à la disposition du Sénégal un quota de places en premier cycle dans les universités publiques tunisiennes, en deux catégories : « inscriptions avec bourse » et « inscriptions sans bourse ». Filières annoncées pour 2026-2027 : classes préparatoires scientifiques et techniques, informatique, économie et gestion (en français), sciences théologiques (en arabe). Le dossier se dépose au MESRI à Dakar (Direction des Bourses, division des bourses étrangères), jamais à l'ambassade ni aux universités.",
      funding: "Pour les places « avec bourse » : bourse versée en Tunisie par l'Office des œuvres universitaires sur présentation de l'accord de bourse de la Direction générale de la coopération internationale, dossier à déposer dans les 15 jours suivant l'inscription (campagne du 15 octobre au 15 décembre). LE MONTANT ET LE DÉTAIL DE LA PRISE EN CHARGE (logement, billet) NE SONT PUBLIÉS PAR AUCUNE SOURCE OFFICIELLE ACCESSIBLE. Pour les places « sans bourse », tout le séjour est à la charge de la famille — une bourse nationale sénégalaise pour l'étranger (boursesetrangeres.campusen.sn) peut être tentée en complément.",
      eligibility: {
        scope: "liste",
        include: ["SN"],
        note: "Quota attribué au Sénégal par accord bilatéral ; le MESRI sélectionne et transmet. CNOSP : « Certains pays comme le Maroc, la Tunisie ou l'Algérie offrent également des bourses d'études aux étudiants sénégalais remplissant les conditions exigées. »"
      },
      generalCriteria: "Réservé aux bacheliers de l'année ou de l'année précédente — un étudiant déjà en L2 ou L3 n'est pas éligible, et le master ou le doctorat ne sont pas couverts. Critères chiffrés rapportés pour 2026-2027 (plafond de 23 ans, mention Bien pour les places avec bourse, Assez Bien pour les places sans bourse) : À CONFIRMER sur le communiqué du MESRI, publié en images et non transcrit officiellement. Calendrier 2026-2027 : communiqué du 23 juillet 2026, dépôt clos début août — environ deux semaines entre publication et clôture. Surveiller la rubrique « Bourses d'études » de mesrisenegal.sn de juillet à octobre ; les précédentes campagnes ont été publiées en octobre (2024) comme en juillet (2026)."
    }
  },

  // ---------------- Algérie — coopération bilatérale ----------------
  {
    id: "bourses-cooperation-algerie",
    data: {
      title: "Bourses de coopération de l'Algérie (quota du Sénégal)",
      country: "Algérie",
      levels: ["Licence", "Master", "Doctorat"],
      status: "Fermée — aucune offre 2025-2026 ni 2026-2027 publiée par le MESRI ; dernière offre le 12 novembre 2024 (2 bourses)",
      isActive: false,
      image: "bourses-cooperation-algerie.jpg",
      funder: "gouvernement",
      funderName: "Ministère algérien de l'Enseignement supérieur (MESRS) — via la Direction des Bourses du MESRI (Sénégal)",
      entryPoint: "bourse",
      officialWebsite: "https://www.mesrs.dz/index.php/fr/mobilite-entrante-formation-des-etudiants-internationaux",
      description: "L'Algérie accueille « annuellement, dans le cadre du programme national de bourses d'études et de coopération bilatérale, environ 3 000 étudiants internationaux » dans ses universités (texte officiel du MESRS), en licence, master et doctorat. Pour le Sénégal, le quota est FAIBLE ET IRRÉGULIER : 2 bourses publiées par le MESRI en novembre 2024, 10 bourses de techniciens supérieurs en août 2024, rien de publié pour 2025-2026 ni 2026-2027. Filières scientifiques, médicales et d'ingénierie en français ; droit, lettres, sciences humaines et islamiques en arabe.",
      funding: "Prise en charge définie par le « Guide de l'étudiant international boursier en Algérie » du MESRS, NON ACCESSIBLE EN LIGNE : ni montant ni détail publiés. Une offre algérienne comparable faite au Bénin (2024-2025) exigeait un baccalauréat de l'année ou de l'année précédente, 14/20 pour les sciences médicales, 12/20 pour vétérinaire et architecture, et la maîtrise du français.",
      eligibility: {
        scope: "liste",
        include: ["SN"],
        note: "Quota attribué au Sénégal par accord bilatéral ; sélection et transmission par le MESRI. Titre officiel de la dernière offre : « (02) Deux bourses d'études en Algérie, au titre de l'année universitaire 2024-2025 »."
      },
      generalCriteria: "Voie exclusivement gouvernementale : dossier à la Direction des Bourses du MESRI à Dakar, puis affectation par le MESRS d'Alger dans une université, et inscription via la plateforme ministérielle de suivi des étudiants étrangers — aucune candidature directe. Ne pas confondre avec Study in Algeria (studyinalgeria.dz), plateforme d'État réservée aux étudiants qui financent eux-mêmes leurs études (campagne 2026 close le 30 juin). Ne pas construire un projet d'études sur cette seule voie : surveiller mesrisenegal.sn, et prévoir une alternative."
    }
  }
];

export const LINKS = [
  {
    scholarshipId: "pan-african-university-pauwes",
    pays: "Algérie",
    universityIds: ["universite-abou-bekr-belkaid-tlemcen"],
    motif: "institut hébergé par l'université de Tlemcen (site PAU : « Abou Bakr Belkaïd University of Tlemcen »)",
    language: "Anglais"
  },
  {
    scholarshipId: "bourses-cooperation-tunisie",
    pays: "Tunisie",
    universityIds: ["universite-de-tunis-el-manar-tunis", "universite-de-carthage-tunis", "universite-de-sousse-sousse", "universite-de-sfax-sfax"],
    motif: "quota sans établissement imposé, affectation par la DGCI dans les universités publiques : rattaché aux quatre grandes universités publiques du lot (Monastir écartée, site inaccessible)",
    language: "Français"
  },
  {
    scholarshipId: "bourses-cooperation-algerie",
    pays: "Algérie",
    universityIds: ["universite-abou-bekr-belkaid-tlemcen", "usthb-alger", "universite-alger-1-benyoucef-benkhedda-alger", "universite-constantine-1-freres-mentouri-constantine", "universite-oran-1-ahmed-ben-bella-oran"],
    motif: "affectation ministérielle dans les universités publiques : rattachée aux cinq universités du lot",
    language: "Français / Arabe selon la filière"
  }
];

// Le lot refuse de se charger si une photo déclarée n'existe pas
// (incident du lot 35).
const manquants = [
  ...UNIVERSITIES.map((u) => u.data.image).filter((f) => f && !existsSync(`assets/images/cities/${f.replace(/\.jpg$/, "")}-1600w.avif`)).map((f) => `cities/${f}`),
  ...SCHOLARSHIPS.map((s) => s.data.image).filter((f) => f && !existsSync(`assets/images/scholarships/${f.replace(/\.jpg$/, "")}-1600w.jpg`)).map((f) => `scholarships/${f}`),
  ...["tn.svg", "dz.svg"].filter((f) => !existsSync(`assets/flags/${f}`)).map((f) => `flags/${f}`)
];
if (manquants.length) {
  throw new Error(`Lot 37 : ${manquants.length} fichier(s) absent(s) — lancer d'abord \`node scripts\\add-lot37-photos.mjs\` et copier les drapeaux, ou vider le champ image concerné :\n  ${manquants.join("\n  ")}`);
}
