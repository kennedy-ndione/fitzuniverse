// ============================================================
// FitzUniverse — Lot 30 : le bailleur des 131 bourses d'avant le
// lot 31 (données du 2026-08-31, portées au format PATCHES)
//
// POURQUOI
// Les champs `funder` / `funderName` / `entryPoint` existent depuis le
// 2026-08-30, mais seules les 14 bourses du lot 31 les portent. Le
// filtre « Type de bourse » du catalogue ne montre donc aujourd'hui que
// ces 14-là, et la fiche ne sait pas dire si le dossier se dépose chez
// le bailleur ou auprès de l'université pour les 131 autres.
//
// Ce lot était déjà écrit sous forme de page HTML à cliquer
// (admin/expand-catalog-batch30.*, jamais exécutée). Il est ici porté
// au runner, sans que le classement change d'une ligne.
//
// LA DOCTRINE DE CLASSIFICATION, en deux règles
//   - Les OPÉRATEURS PUBLICS NATIONAUX d'une politique de bourses
//     (DAAD, ARES, VLIR-UOS, Campus France, AMCI, NAWA, Camões,
//     Svenska institutet, JICA, KOICA, YTB, NIIED, ICCR, CSC, Tempus)
//     sont "gouvernement". Ce sont des associations ou des instituts,
//     pas des ministères — mais pour un candidat ce sont des
//     programmes nationaux.
//   - Les FONDATIONS POLITIQUES ALLEMANDES (Ebert, Böll, Adenauer,
//     Luxemburg), les BANQUES DE DÉVELOPPEMENT (Banque mondiale, BAD,
//     BID) et les fondations privées (Mastercard, Rhodes, Rotary,
//     AUF, Diyanet) sont "organisation" : indépendantes d'un État,
//     même largement subventionnées.
//
// `entryPoint` DIT OÙ VA LE DOSSIER, pas ce qui vient en premier dans
// le calendrier. Les 12 régionales italiennes portent donc
// "bourse" — le dossier se dépose sur le portail de l'organisme
// régional avec l'attestation ISEE, jamais auprès de l'université,
// même si l'admission précède. Cas inverse à retenir : EIFFEL est
// "gouvernement" mais entryPoint "universite", parce que le candidat
// ne peut PAS postuler lui-même — c'est l'établissement français qui
// dépose son dossier.
//
// DEUX BOURSES RESTENT SANS entryPoint, À DESSEIN
//   - knight-hennessy-scholars : deux candidatures SÉPARÉES et toutes
//     deux obligatoires, avec leurs propres échéances. Aucune des deux
//     valeurs n'est vraie.
//   - fao-hungarian-government-scholarship : porte non vérifiée à la
//     source.
// Un champ absent est un inconnu. Même règle que `estEligible`.
//
// PAS D'`attendu` DANS CE LOT
// Ces trois champs sont censés être ABSENTS des 131 documents, et
// l'export ne les expose pas encore — je ne peux donc pas affirmer
// leur valeur actuelle. L'étape `analyser` du runner montre le diff
// réel et compte à part les patches sans effet : c'est elle qui fait
// garde ici. SI UNE SEULE BOURSE PORTE DÉJÀ UN `funder` DIFFÉRENT DE
// CELUI DU PLAN, s'arrêter et le signaler plutôt que d'écraser.
//
// CE LOT NE TOUCHE PAS À `ageMax`
// Les plafonds d'âge des anciennes bourses (MEXT, Türkiye Bursları,
// CSC, Eiffel) sont cités dans un commentaire de questions.js, pas
// vérifiés à la source. Les écrire ici serait recopier une note de
// travail comme si c'était un fait. Lot distinct.
// ============================================================

export const PATCHES = [

  // ---------------- Afrique du Sud ----------------
  {
    collection: "scholarships",
    id: "mastercard-foundation-scholars-uct",
    champs: {
      funder: "organisation",
      funderName: "Mastercard Foundation",
      entryPoint: "universite"
    },
    motif: "bailleur indépendant d'un État, même subventionné : Mastercard Foundation · dossier auprès de l'université"
  },

  // ---------------- Allemagne ----------------
  {
    collection: "scholarships",
    id: "daad-epos",
    champs: {
      funder: "gouvernement",
      funderName: "DAAD",
      entryPoint: "universite"
    },
    motif: "programme national — portail central, fenêtre annuelle, condition de nationalité : DAAD · dossier auprès de l'université"
  },
  {
    collection: "scholarships",
    id: "daad-helmut-schmidt-programme",
    champs: {
      funder: "gouvernement",
      funderName: "DAAD",
      entryPoint: "bourse"
    },
    motif: "programme national — portail central, fenêtre annuelle, condition de nationalité : DAAD · dossier chez le bailleur"
  },
  {
    collection: "scholarships",
    id: "daad-study-scholarships",
    champs: {
      funder: "gouvernement",
      funderName: "DAAD",
      entryPoint: "bourse"
    },
    motif: "programme national — portail central, fenêtre annuelle, condition de nationalité : DAAD · dossier chez le bailleur"
  },
  {
    collection: "scholarships",
    id: "deutschlandstipendium",
    champs: {
      funder: "universite",
      funderName: "Deutschlandstipendium",
      entryPoint: "universite"
    },
    motif: "bourse propre à l'établissement — se demande dans le dossier d'admission : Deutschlandstipendium · dossier auprès de l'université"
  },
  {
    collection: "scholarships",
    id: "friedrich-ebert-stiftung",
    champs: {
      funder: "organisation",
      funderName: "Friedrich-Ebert-Stiftung",
      entryPoint: "bourse"
    },
    motif: "bailleur indépendant d'un État, même subventionné : Friedrich-Ebert-Stiftung · dossier chez le bailleur"
  },
  {
    collection: "scholarships",
    id: "heinrich-boell-stiftung",
    champs: {
      funder: "organisation",
      funderName: "Heinrich-Böll-Stiftung",
      entryPoint: "bourse"
    },
    motif: "bailleur indépendant d'un État, même subventionné : Heinrich-Böll-Stiftung · dossier chez le bailleur"
  },
  {
    collection: "scholarships",
    id: "konrad-adenauer-stiftung",
    champs: {
      funder: "organisation",
      funderName: "Konrad-Adenauer-Stiftung",
      entryPoint: "bourse"
    },
    motif: "bailleur indépendant d'un État, même subventionné : Konrad-Adenauer-Stiftung · dossier chez le bailleur"
  },
  {
    collection: "scholarships",
    id: "landesstipendium-niedersachsen",
    champs: {
      funder: "region",
      funderName: "Land de Basse-Saxe",
      entryPoint: "universite"
    },
    motif: "collectivité territoriale — attribution souvent sur conditions de revenus : Land de Basse-Saxe · dossier auprès de l'université"
  },
  {
    collection: "scholarships",
    id: "rosa-luxemburg-stiftung",
    champs: {
      funder: "organisation",
      funderName: "Rosa-Luxemburg-Stiftung",
      entryPoint: "bourse"
    },
    motif: "bailleur indépendant d'un État, même subventionné : Rosa-Luxemburg-Stiftung · dossier chez le bailleur"
  },
  {
    collection: "scholarships",
    id: "uni-hamburg-leistungsstipendien",
    champs: {
      funder: "universite",
      funderName: "Universität Hamburg",
      entryPoint: "universite"
    },
    motif: "bourse propre à l'établissement — se demande dans le dossier d'admission : Universität Hamburg · dossier auprès de l'université"
  },

  // ---------------- Arabie Saoudite ----------------
  {
    collection: "scholarships",
    id: "king-abdulaziz-scholarship",
    champs: {
      funder: "gouvernement",
      funderName: "Ministère saoudien de l'Éducation",
      entryPoint: "bourse"
    },
    motif: "programme national — portail central, fenêtre annuelle, condition de nationalité : Ministère saoudien de l'Éducation · dossier chez le bailleur"
  },

  // ---------------- Belgique ----------------
  {
    collection: "scholarships",
    id: "bourse-master-in-wbi",
    champs: {
      funder: "gouvernement",
      funderName: "Wallonie-Bruxelles International",
      entryPoint: "bourse"
    },
    motif: "programme national — portail central, fenêtre annuelle, condition de nationalité : Wallonie-Bruxelles International · dossier chez le bailleur"
  },
  {
    collection: "scholarships",
    id: "bourses-formations-internationales-ares",
    champs: {
      funder: "gouvernement",
      funderName: "ARES (coopération belge)",
      entryPoint: "bourse"
    },
    motif: "programme national — portail central, fenêtre annuelle, condition de nationalité : ARES (coopération belge) · dossier chez le bailleur"
  },
  {
    collection: "scholarships",
    id: "icp-connect-scholarships-vlir-uos",
    champs: {
      funder: "gouvernement",
      funderName: "VLIR-UOS",
      entryPoint: "universite"
    },
    motif: "programme national — portail central, fenêtre annuelle, condition de nationalité : VLIR-UOS · dossier auprès de l'université"
  },

  // ---------------- Canada ----------------
  {
    collection: "scholarships",
    id: "lester-b-pearson-international-scholarship",
    champs: {
      funder: "universite",
      funderName: "University of Toronto",
      entryPoint: "universite"
    },
    motif: "bourse propre à l'établissement — se demande dans le dossier d'admission : University of Toronto · dossier auprès de l'université"
  },
  {
    collection: "scholarships",
    id: "mcgill-major-entrance-scholarships",
    champs: {
      funder: "universite",
      funderName: "McGill University",
      entryPoint: "universite"
    },
    motif: "bourse propre à l'établissement — se demande dans le dossier d'admission : McGill University · dossier auprès de l'université"
  },
  {
    collection: "scholarships",
    id: "ubc-international-scholars-program",
    champs: {
      funder: "universite",
      funderName: "University of British Columbia",
      entryPoint: "universite"
    },
    motif: "bourse propre à l'établissement — se demande dans le dossier d'admission : University of British Columbia · dossier auprès de l'université"
  },
  {
    collection: "scholarships",
    id: "vanier-canada-graduate-scholarship",
    champs: {
      funder: "gouvernement",
      funderName: "Gouvernement du Canada",
      entryPoint: "universite"
    },
    motif: "programme national — portail central, fenêtre annuelle, condition de nationalité : Gouvernement du Canada · dossier auprès de l'université"
  },

  // ---------------- Chine ----------------
  {
    collection: "scholarships",
    id: "beijing-government-scholarship",
    champs: {
      funder: "region",
      funderName: "Municipalité de Pékin",
      entryPoint: "universite"
    },
    motif: "collectivité territoriale — attribution souvent sur conditions de revenus : Municipalité de Pékin · dossier auprès de l'université"
  },
  {
    collection: "scholarships",
    id: "chinese-government-scholarship",
    champs: {
      funder: "gouvernement",
      funderName: "China Scholarship Council (CSC)",
      entryPoint: "bourse"
    },
    motif: "programme national — portail central, fenêtre annuelle, condition de nationalité : China Scholarship Council (CSC) · dossier chez le bailleur"
  },
  {
    collection: "scholarships",
    id: "nanjing-government-scholarship",
    champs: {
      funder: "region",
      funderName: "Municipalité de Nankin (Jiangsu)",
      entryPoint: "universite"
    },
    motif: "collectivité territoriale — attribution souvent sur conditions de revenus : Municipalité de Nankin (Jiangsu) · dossier auprès de l'université"
  },
  {
    collection: "scholarships",
    id: "shanghai-government-scholarship",
    champs: {
      funder: "region",
      funderName: "Municipalité de Shanghai",
      entryPoint: "universite"
    },
    motif: "collectivité territoriale — attribution souvent sur conditions de revenus : Municipalité de Shanghai · dossier auprès de l'université"
  },

  // ---------------- Corée du Sud ----------------
  {
    collection: "scholarships",
    id: "ama-plus-scholarship",
    champs: {
      funder: "gouvernement",
      funderName: "Ministère coréen de la Culture (MCST)",
      entryPoint: "universite"
    },
    motif: "programme national — portail central, fenêtre annuelle, condition de nationalité : Ministère coréen de la Culture (MCST) · dossier auprès de l'université"
  },
  {
    collection: "scholarships",
    id: "snu-glo-harmony-scholarship",
    champs: {
      funder: "organisation",
      funderName: "Samsung Foundation",
      entryPoint: "universite"
    },
    motif: "bailleur indépendant d'un État, même subventionné : Samsung Foundation · dossier auprès de l'université"
  },
  {
    collection: "scholarships",
    id: "global-korea-scholarship",
    champs: {
      funder: "gouvernement",
      funderName: "NIIED (Study in Korea)",
      entryPoint: "bourse"
    },
    motif: "programme national — portail central, fenêtre annuelle, condition de nationalité : NIIED (Study in Korea) · dossier chez le bailleur"
  },
  {
    collection: "scholarships",
    id: "kaist-scholarship",
    champs: {
      funder: "universite",
      funderName: "KAIST",
      entryPoint: "universite"
    },
    motif: "bourse propre à l'établissement — se demande dans le dossier d'admission : KAIST · dossier auprès de l'université"
  },
  {
    collection: "scholarships",
    id: "koica-ciat-scholarship",
    champs: {
      funder: "gouvernement",
      funderName: "KOICA",
      entryPoint: "bourse"
    },
    motif: "programme national — portail central, fenêtre annuelle, condition de nationalité : KOICA · dossier chez le bailleur"
  },
  {
    collection: "scholarships",
    id: "ku-global-leader-scholarship",
    champs: {
      funder: "universite",
      funderName: "Korea University",
      entryPoint: "universite"
    },
    motif: "bourse propre à l'établissement — se demande dans le dossier d'admission : Korea University · dossier auprès de l'université"
  },
  {
    collection: "scholarships",
    id: "postech-gift-scholarship",
    champs: {
      funder: "universite",
      funderName: "POSTECH",
      entryPoint: "universite"
    },
    motif: "bourse propre à l'établissement — se demande dans le dossier d'admission : POSTECH · dossier auprès de l'université"
  },
  {
    collection: "scholarships",
    id: "snu-global-scholarship",
    champs: {
      funder: "universite",
      funderName: "Seoul National University",
      entryPoint: "universite"
    },
    motif: "bourse propre à l'établissement — se demande dans le dossier d'admission : Seoul National University · dossier auprès de l'université"
  },

  // ---------------- États-Unis ----------------
  {
    collection: "scholarships",
    id: "knight-hennessy-scholars",
    champs: {
      funder: "universite",
      funderName: "Stanford University"
    },
    motif: "bourse propre à l'établissement — se demande dans le dossier d'admission : Stanford University · porte d'entrée non tranchée"
  },
  {
    collection: "scholarships",
    id: "mastercard-foundation-scholars-program",
    champs: {
      funder: "organisation",
      funderName: "Mastercard Foundation",
      entryPoint: "universite"
    },
    motif: "bailleur indépendant d'un État, même subventionné : Mastercard Foundation · dossier auprès de l'université"
  },

  // ---------------- France ----------------
  {
    collection: "scholarships",
    id: "bourse-emile-boutmy",
    champs: {
      funder: "universite",
      funderName: "Sciences Po",
      entryPoint: "universite"
    },
    motif: "bourse propre à l'établissement — se demande dans le dossier d'admission : Sciences Po · dossier auprès de l'université"
  },
  {
    collection: "scholarships",
    id: "eiffel-excellence-scholarship",
    champs: {
      funder: "gouvernement",
      funderName: "Campus France (MEAE)",
      entryPoint: "universite"
    },
    motif: "programme national — portail central, fenêtre annuelle, condition de nationalité : Campus France (MEAE) · dossier auprès de l'université"
  },

  // ---------------- Hongrie ----------------
  {
    collection: "scholarships",
    id: "corvinus-scholarship",
    champs: {
      funder: "universite",
      funderName: "Corvinus University of Budapest",
      entryPoint: "universite"
    },
    motif: "bourse propre à l'établissement — se demande dans le dossier d'admission : Corvinus University of Budapest · dossier auprès de l'université"
  },
  {
    collection: "scholarships",
    id: "fao-hungarian-government-scholarship",
    champs: {
      funder: "organisation",
      funderName: "FAO – Gouvernement hongrois"
    },
    motif: "bailleur indépendant d'un État, même subventionné : FAO – Gouvernement hongrois · porte d'entrée non tranchée"
  },
  {
    collection: "scholarships",
    id: "semmelweis-pannonia-in-excellence",
    champs: {
      funder: "universite",
      funderName: "Semmelweis University",
      entryPoint: "universite"
    },
    motif: "bourse propre à l'établissement — se demande dans le dossier d'admission : Semmelweis University · dossier auprès de l'université"
  },
  {
    collection: "scholarships",
    id: "stipendium-hungaricum",
    champs: {
      funder: "gouvernement",
      funderName: "Tempus Public Foundation",
      entryPoint: "bourse"
    },
    motif: "programme national — portail central, fenêtre annuelle, condition de nationalité : Tempus Public Foundation · dossier chez le bailleur"
  },
  {
    collection: "scholarships",
    id: "szte-start-scholarship",
    champs: {
      funder: "universite",
      funderName: "University of Szeged",
      entryPoint: "universite"
    },
    motif: "bourse propre à l'établissement — se demande dans le dossier d'admission : University of Szeged · dossier auprès de l'université"
  },
  {
    collection: "scholarships",
    id: "ud-international-scholarship",
    champs: {
      funder: "universite",
      funderName: "University of Debrecen",
      entryPoint: "universite"
    },
    motif: "bourse propre à l'établissement — se demande dans le dossier d'admission : University of Debrecen · dossier auprès de l'université"
  },

  // ---------------- Inde ----------------
  {
    collection: "scholarships",
    id: "iccr-africa-scholarship-scheme",
    champs: {
      funder: "gouvernement",
      funderName: "ICCR",
      entryPoint: "bourse"
    },
    motif: "programme national — portail central, fenêtre annuelle, condition de nationalité : ICCR · dossier chez le bailleur"
  },

  // ---------------- Italie — régionales de droit à l'étude ----------------
  {
    collection: "scholarships",
    id: "adisu-puglia",
    champs: {
      funder: "region",
      funderName: "ADISU Puglia",
      entryPoint: "bourse"
    },
    motif: "collectivité territoriale — attribution souvent sur conditions de revenus : ADISU Puglia · dossier chez le bailleur"
  },
  {
    collection: "scholarships",
    id: "ardis-friuli-venezia-giulia",
    champs: {
      funder: "region",
      funderName: "ARDiS Friuli-Venezia Giulia",
      entryPoint: "bourse"
    },
    motif: "collectivité territoriale — attribution souvent sur conditions de revenus : ARDiS Friuli-Venezia Giulia · dossier chez le bailleur"
  },
  {
    collection: "scholarships",
    id: "dsu-lombardia-milano-statale",
    champs: {
      funder: "region",
      funderName: "Regione Lombardia (DSU)",
      entryPoint: "bourse"
    },
    motif: "collectivité territoriale — attribution souvent sur conditions de revenus : Regione Lombardia (DSU) · dossier chez le bailleur"
  },
  {
    collection: "scholarships",
    id: "edisu-pavia",
    champs: {
      funder: "region",
      funderName: "EDiSU Pavia",
      entryPoint: "bourse"
    },
    motif: "collectivité territoriale — attribution souvent sur conditions de revenus : EDiSU Pavia · dossier chez le bailleur"
  },
  {
    collection: "scholarships",
    id: "ergo-emilia-romagna",
    champs: {
      funder: "region",
      funderName: "ER.GO Emilia-Romagna",
      entryPoint: "bourse"
    },
    motif: "collectivité territoriale — attribution souvent sur conditions de revenus : ER.GO Emilia-Romagna · dossier chez le bailleur"
  },
  {
    collection: "scholarships",
    id: "aliseo-liguria",
    champs: {
      funder: "region",
      funderName: "ALiSEO Liguria",
      entryPoint: "bourse"
    },
    motif: "collectivité territoriale — attribution souvent sur conditions de revenus : ALiSEO Liguria · dossier chez le bailleur"
  },
  {
    collection: "scholarships",
    id: "campania-regional-scholarship",
    champs: {
      funder: "region",
      funderName: "ADISURC Campania",
      entryPoint: "bourse"
    },
    motif: "collectivité territoriale — attribution souvent sur conditions de revenus : ADISURC Campania · dossier chez le bailleur"
  },
  {
    collection: "scholarships",
    id: "dsu-toscana-scholarship",
    champs: {
      funder: "region",
      funderName: "DSU Toscana",
      entryPoint: "bourse"
    },
    motif: "collectivité territoriale — attribution souvent sur conditions de revenus : DSU Toscana · dossier chez le bailleur"
  },
  {
    collection: "scholarships",
    id: "edisu-piemonte-scholarship",
    champs: {
      funder: "region",
      funderName: "EDISU Piemonte",
      entryPoint: "bourse"
    },
    motif: "collectivité territoriale — attribution souvent sur conditions de revenus : EDISU Piemonte · dossier chez le bailleur"
  },
  {
    collection: "scholarships",
    id: "laziodisco-scholarship",
    champs: {
      funder: "region",
      funderName: "DiSCo Lazio",
      entryPoint: "bourse"
    },
    motif: "collectivité territoriale — attribution souvent sur conditions de revenus : DiSCo Lazio · dossier chez le bailleur"
  },
  {
    collection: "scholarships",
    id: "opera-universitaria-scholarship",
    champs: {
      funder: "region",
      funderName: "Opera Universitaria di Trento",
      entryPoint: "bourse"
    },
    motif: "collectivité territoriale — attribution souvent sur conditions de revenus : Opera Universitaria di Trento · dossier chez le bailleur"
  },
  {
    collection: "scholarships",
    id: "veneto-regional-scholarship",
    champs: {
      funder: "region",
      funderName: "ESU Veneto",
      entryPoint: "bourse"
    },
    motif: "collectivité territoriale — attribution souvent sur conditions de revenus : ESU Veneto · dossier chez le bailleur"
  },

  // ---------------- Italie — universitaires ----------------
  {
    collection: "scholarships",
    id: "bocconi-graduate-merit-award",
    champs: {
      funder: "universite",
      funderName: "Università Bocconi",
      entryPoint: "universite"
    },
    motif: "bourse propre à l'établissement — se demande dans le dossier d'admission : Università Bocconi · dossier auprès de l'université"
  },
  {
    collection: "scholarships",
    id: "bocconi-merit-award",
    champs: {
      funder: "universite",
      funderName: "Università Bocconi",
      entryPoint: "universite"
    },
    motif: "bourse propre à l'établissement — se demande dans le dossier d'admission : Università Bocconi · dossier auprès de l'université"
  },
  {
    collection: "scholarships",
    id: "bocconi-phd-scholarship",
    champs: {
      funder: "universite",
      funderName: "Università Bocconi",
      entryPoint: "universite"
    },
    motif: "bourse propre à l'établissement — se demande dans le dossier d'admission : Università Bocconi · dossier auprès de l'université"
  },
  {
    collection: "scholarships",
    id: "scuola-normale-superiore-phd",
    champs: {
      funder: "universite",
      funderName: "Scuola Normale Superiore",
      entryPoint: "universite"
    },
    motif: "bourse propre à l'établissement — se demande dans le dossier d'admission : Scuola Normale Superiore · dossier auprès de l'université"
  },
  {
    collection: "scholarships",
    id: "international-talents-unibo",
    champs: {
      funder: "universite",
      funderName: "Università di Bologna",
      entryPoint: "universite"
    },
    motif: "bourse propre à l'établissement — se demande dans le dossier d'admission : Università di Bologna · dossier auprès de l'université"
  },
  {
    collection: "scholarships",
    id: "politecnico-di-milano-merit-based-scholarship",
    champs: {
      funder: "universite",
      funderName: "Politecnico di Milano",
      entryPoint: "universite"
    },
    motif: "bourse propre à l'établissement — se demande dans le dossier d'admission : Politecnico di Milano · dossier auprès de l'université"
  },
  {
    collection: "scholarships",
    id: "politecnico-di-milano-phd-scholarship",
    champs: {
      funder: "universite",
      funderName: "Politecnico di Milano",
      entryPoint: "universite"
    },
    motif: "bourse propre à l'établissement — se demande dans le dossier d'admission : Politecnico di Milano · dossier auprès de l'université"
  },
  {
    collection: "scholarships",
    id: "polito-phd-scholarship",
    champs: {
      funder: "universite",
      funderName: "Politecnico di Torino",
      entryPoint: "universite"
    },
    motif: "bourse propre à l'établissement — se demande dans le dossier d'admission : Politecnico di Torino · dossier auprès de l'université"
  },
  {
    collection: "scholarships",
    id: "sapienza-phd-scholarship",
    champs: {
      funder: "universite",
      funderName: "Sapienza Università di Roma",
      entryPoint: "universite"
    },
    motif: "bourse propre à l'établissement — se demande dans le dossier d'admission : Sapienza Università di Roma · dossier auprès de l'université"
  },
  {
    collection: "scholarships",
    id: "unibo-phd-scholarship",
    champs: {
      funder: "universite",
      funderName: "Università di Bologna",
      entryPoint: "universite"
    },
    motif: "bourse propre à l'établissement — se demande dans le dossier d'admission : Università di Bologna · dossier auprès de l'université"
  },
  {
    collection: "scholarships",
    id: "university-of-florence-phd-scholarship",
    champs: {
      funder: "universite",
      funderName: "Università di Firenze",
      entryPoint: "universite"
    },
    motif: "bourse propre à l'établissement — se demande dans le dossier d'admission : Università di Firenze · dossier auprès de l'université"
  },
  {
    collection: "scholarships",
    id: "university-of-naples-federico-ii-phd-scholarship",
    champs: {
      funder: "universite",
      funderName: "Università di Napoli Federico II",
      entryPoint: "universite"
    },
    motif: "bourse propre à l'établissement — se demande dans le dossier d'admission : Università di Napoli Federico II · dossier auprès de l'université"
  },
  {
    collection: "scholarships",
    id: "university-of-padua-phd-scholarship",
    champs: {
      funder: "universite",
      funderName: "Università di Padova",
      entryPoint: "universite"
    },
    motif: "bourse propre à l'établissement — se demande dans le dossier d'admission : Università di Padova · dossier auprès de l'université"
  },
  {
    collection: "scholarships",
    id: "university-of-pisa-phd-scholarship",
    champs: {
      funder: "universite",
      funderName: "Università di Pisa",
      entryPoint: "universite"
    },
    motif: "bourse propre à l'établissement — se demande dans le dossier d'admission : Università di Pisa · dossier auprès de l'université"
  },
  {
    collection: "scholarships",
    id: "university-of-trento-phd-scholarship",
    champs: {
      funder: "universite",
      funderName: "Università di Trento",
      entryPoint: "universite"
    },
    motif: "bourse propre à l'établissement — se demande dans le dossier d'admission : Università di Trento · dossier auprès de l'université"
  },

  // ---------------- Italie — nationales ----------------
  {
    collection: "scholarships",
    id: "invest-your-talent-italy",
    champs: {
      funder: "gouvernement",
      funderName: "MAECI (Invest Your Talent)",
      entryPoint: "bourse"
    },
    motif: "programme national — portail central, fenêtre annuelle, condition de nationalité : MAECI (Invest Your Talent) · dossier chez le bailleur"
  },
  {
    collection: "scholarships",
    id: "italian-government-scholarship",
    champs: {
      funder: "gouvernement",
      funderName: "MAECI (Study in Italy)",
      entryPoint: "bourse"
    },
    motif: "programme national — portail central, fenêtre annuelle, condition de nationalité : MAECI (Study in Italy) · dossier chez le bailleur"
  },

  // ---------------- Japon ----------------
  {
    collection: "scholarships",
    id: "abe-initiative-jica",
    champs: {
      funder: "gouvernement",
      funderName: "JICA",
      entryPoint: "bourse"
    },
    motif: "programme national — portail central, fenêtre annuelle, condition de nationalité : JICA · dossier chez le bailleur"
  },
  {
    collection: "scholarships",
    id: "honjo-international-scholarship",
    champs: {
      funder: "organisation",
      funderName: "Honjo International Scholarship Foundation",
      entryPoint: "bourse"
    },
    motif: "bailleur indépendant d'un État, même subventionné : Honjo International Scholarship Foundation · dossier chez le bailleur"
  },
  {
    collection: "scholarships",
    id: "jads-japan-africa-dream",
    champs: {
      funder: "organisation",
      funderName: "Banque africaine de développement",
      entryPoint: "bourse"
    },
    motif: "bailleur indépendant d'un État, même subventionné : Banque africaine de développement · dossier chez le bailleur"
  },
  {
    collection: "scholarships",
    id: "jasso-monbukagakusho-honors",
    champs: {
      funder: "gouvernement",
      funderName: "JASSO (MEXT)",
      entryPoint: "universite"
    },
    motif: "programme national — portail central, fenêtre annuelle, condition de nationalité : JASSO (MEXT) · dossier auprès de l'université"
  },
  {
    collection: "scholarships",
    id: "jica-sdgs-global-leader",
    champs: {
      funder: "gouvernement",
      funderName: "JICA",
      entryPoint: "bourse"
    },
    motif: "programme national — portail central, fenêtre annuelle, condition de nationalité : JICA · dossier chez le bailleur"
  },
  {
    collection: "scholarships",
    id: "jj-wbgsp",
    champs: {
      funder: "organisation",
      funderName: "Banque mondiale (JJ/WBGSP)",
      entryPoint: "bourse"
    },
    motif: "bailleur indépendant d'un État, même subventionné : Banque mondiale (JJ/WBGSP) · dossier chez le bailleur"
  },
  {
    collection: "scholarships",
    id: "mext-scholarship",
    champs: {
      funder: "gouvernement",
      funderName: "MEXT",
      entryPoint: "bourse"
    },
    motif: "programme national — portail central, fenêtre annuelle, condition de nationalité : MEXT · dossier chez le bailleur"
  },
  {
    collection: "scholarships",
    id: "rotary-yoneyama-overseas",
    champs: {
      funder: "organisation",
      funderName: "Rotary Yoneyama Memorial Foundation",
      entryPoint: "bourse"
    },
    motif: "bailleur indépendant d'un État, même subventionné : Rotary Yoneyama Memorial Foundation · dossier chez le bailleur"
  },
  {
    collection: "scholarships",
    id: "utokyo-fellowship",
    champs: {
      funder: "universite",
      funderName: "University of Tokyo",
      entryPoint: "universite"
    },
    motif: "bourse propre à l'établissement — se demande dans le dossier d'admission : University of Tokyo · dossier auprès de l'université"
  },
  {
    collection: "scholarships",
    id: "waseda-partial-tuition-waiver",
    champs: {
      funder: "universite",
      funderName: "Waseda University",
      entryPoint: "universite"
    },
    motif: "bourse propre à l'établissement — se demande dans le dossier d'admission : Waseda University · dossier auprès de l'université"
  },

  // ---------------- Malaisie ----------------
  {
    collection: "scholarships",
    id: "malaysia-international-scholarship",
    champs: {
      funder: "gouvernement",
      funderName: "Ministère malaisien de l'Enseignement supérieur",
      entryPoint: "bourse"
    },
    motif: "programme national — portail central, fenêtre annuelle, condition de nationalité : Ministère malaisien de l'Enseignement supérieur · dossier chez le bailleur"
  },

  // ---------------- Maroc ----------------
  {
    collection: "scholarships",
    id: "bourse-gouvernement-maroc-amci",
    champs: {
      funder: "gouvernement",
      funderName: "AMCI",
      entryPoint: "bourse"
    },
    motif: "programme national — portail central, fenêtre annuelle, condition de nationalité : AMCI · dossier chez le bailleur"
  },
  {
    collection: "scholarships",
    id: "bourses-master-aui",
    champs: {
      funder: "universite",
      funderName: "Al Akhawayn University",
      entryPoint: "universite"
    },
    motif: "bourse propre à l'établissement — se demande dans le dossier d'admission : Al Akhawayn University · dossier auprès de l'université"
  },
  {
    collection: "scholarships",
    id: "mastercard-foundation-scholars-um6p",
    champs: {
      funder: "organisation",
      funderName: "Mastercard Foundation",
      entryPoint: "universite"
    },
    motif: "bailleur indépendant d'un État, même subventionné : Mastercard Foundation · dossier auprès de l'université"
  },

  // ---------------- Pays-Bas ----------------
  {
    collection: "scholarships",
    id: "nl-scholarship",
    champs: {
      funder: "gouvernement",
      funderName: "Ministère néerlandais de l'Éducation (OCW)",
      entryPoint: "universite"
    },
    motif: "programme national — portail central, fenêtre annuelle, condition de nationalité : Ministère néerlandais de l'Éducation (OCW) · dossier auprès de l'université"
  },

  // ---------------- Pologne ----------------
  {
    collection: "scholarships",
    id: "nawa-banach-scholarship",
    champs: {
      funder: "gouvernement",
      funderName: "NAWA",
      entryPoint: "bourse"
    },
    motif: "programme national — portail central, fenêtre annuelle, condition de nationalité : NAWA · dossier chez le bailleur"
  },

  // ---------------- Portugal ----------------
  {
    collection: "scholarships",
    id: "bolsas-cooperacao-camoes",
    champs: {
      funder: "gouvernement",
      funderName: "Camões, I.P.",
      entryPoint: "bourse"
    },
    motif: "programme national — portail central, fenêtre annuelle, condition de nationalité : Camões, I.P. · dossier chez le bailleur"
  },

  // ---------------- Roumanie ----------------
  {
    collection: "scholarships",
    id: "bourse-george-darie",
    champs: {
      funder: "universite",
      funderName: "POLITEHNICA Bucarest",
      entryPoint: "universite"
    },
    motif: "bourse propre à l'établissement — se demande dans le dossier d'admission : POLITEHNICA Bucarest · dossier auprès de l'université"
  },
  {
    collection: "scholarships",
    id: "auf-petrache-poenaru",
    champs: {
      funder: "organisation",
      funderName: "Agence universitaire de la Francophonie",
      entryPoint: "bourse"
    },
    motif: "bailleur indépendant d'un État, même subventionné : Agence universitaire de la Francophonie · dossier chez le bailleur"
  },
  {
    collection: "scholarships",
    id: "auf-eugen-ionescu",
    champs: {
      funder: "organisation",
      funderName: "Agence universitaire de la Francophonie",
      entryPoint: "bourse"
    },
    motif: "bailleur indépendant d'un État, même subventionné : Agence universitaire de la Francophonie · dossier chez le bailleur"
  },
  {
    collection: "scholarships",
    id: "unibuc-international-scholarships",
    champs: {
      funder: "universite",
      funderName: "Université de Bucarest",
      entryPoint: "universite"
    },
    motif: "bourse propre à l'établissement — se demande dans le dossier d'admission : Université de Bucarest · dossier auprès de l'université"
  },
  {
    collection: "scholarships",
    id: "politehnica-excellence-scholarship",
    champs: {
      funder: "universite",
      funderName: "POLITEHNICA Bucarest",
      entryPoint: "universite"
    },
    motif: "bourse propre à l'établissement — se demande dans le dossier d'admission : POLITEHNICA Bucarest · dossier auprès de l'université"
  },
  {
    collection: "scholarships",
    id: "romanian-government-scholarship",
    champs: {
      funder: "gouvernement",
      funderName: "Ministère roumain des Affaires étrangères",
      entryPoint: "bourse"
    },
    motif: "programme national — portail central, fenêtre annuelle, condition de nationalité : Ministère roumain des Affaires étrangères · dossier chez le bailleur"
  },

  // ---------------- Royaume-Uni ----------------
  {
    collection: "scholarships",
    id: "chevening-scholarships",
    champs: {
      funder: "gouvernement",
      funderName: "FCDO (Chevening)",
      entryPoint: "bourse"
    },
    motif: "programme national — portail central, fenêtre annuelle, condition de nationalité : FCDO (Chevening) · dossier chez le bailleur"
  },
  {
    collection: "scholarships",
    id: "clarendon-fund-scholarships",
    champs: {
      funder: "universite",
      funderName: "University of Oxford",
      entryPoint: "universite"
    },
    motif: "bourse propre à l'établissement — se demande dans le dossier d'admission : University of Oxford · dossier auprès de l'université"
  },
  {
    collection: "scholarships",
    id: "commonwealth-masters-scholarships",
    champs: {
      funder: "gouvernement",
      funderName: "Commonwealth Scholarship Commission (FCDO)",
      entryPoint: "bourse"
    },
    motif: "programme national — portail central, fenêtre annuelle, condition de nationalité : Commonwealth Scholarship Commission (FCDO) · dossier chez le bailleur"
  },
  {
    collection: "scholarships",
    id: "commonwealth-phd-scholarships",
    champs: {
      funder: "gouvernement",
      funderName: "Commonwealth Scholarship Commission (FCDO)",
      entryPoint: "bourse"
    },
    motif: "programme national — portail central, fenêtre annuelle, condition de nationalité : Commonwealth Scholarship Commission (FCDO) · dossier chez le bailleur"
  },
  {
    collection: "scholarships",
    id: "commonwealth-shared-scholarships",
    champs: {
      funder: "gouvernement",
      funderName: "Commonwealth Scholarship Commission (FCDO)",
      entryPoint: "bourse"
    },
    motif: "programme national — portail central, fenêtre annuelle, condition de nationalité : Commonwealth Scholarship Commission (FCDO) · dossier chez le bailleur"
  },
  {
    collection: "scholarships",
    id: "great-scholarships",
    champs: {
      funder: "gouvernement",
      funderName: "British Council (GREAT)",
      entryPoint: "universite"
    },
    motif: "programme national — portail central, fenêtre annuelle, condition de nationalité : British Council (GREAT) · dossier auprès de l'université"
  },
  {
    collection: "scholarships",
    id: "imperial-presidents-phd-scholarships",
    champs: {
      funder: "universite",
      funderName: "Imperial College London",
      entryPoint: "universite"
    },
    motif: "bourse propre à l'établissement — se demande dans le dossier d'admission : Imperial College London · dossier auprès de l'université"
  },
  {
    collection: "scholarships",
    id: "mastercard-foundation-edinburgh",
    champs: {
      funder: "organisation",
      funderName: "Mastercard Foundation",
      entryPoint: "universite"
    },
    motif: "bailleur indépendant d'un État, même subventionné : Mastercard Foundation · dossier auprès de l'université"
  },
  {
    collection: "scholarships",
    id: "mastercard-foundation-afox-oxford",
    champs: {
      funder: "organisation",
      funderName: "Mastercard Foundation",
      entryPoint: "universite"
    },
    motif: "bailleur indépendant d'un État, même subventionné : Mastercard Foundation · dossier auprès de l'université"
  },
  {
    collection: "scholarships",
    id: "reach-oxford-scholarship",
    champs: {
      funder: "universite",
      funderName: "University of Oxford",
      entryPoint: "universite"
    },
    motif: "bourse propre à l'établissement — se demande dans le dossier d'admission : University of Oxford · dossier auprès de l'université"
  },
  {
    collection: "scholarships",
    id: "rhodes-scholarships-west-africa",
    champs: {
      funder: "organisation",
      funderName: "Rhodes Trust",
      entryPoint: "bourse"
    },
    motif: "bailleur indépendant d'un État, même subventionné : Rhodes Trust · dossier chez le bailleur"
  },
  {
    collection: "scholarships",
    id: "weidenfeld-hoffmann-scholarships",
    champs: {
      funder: "organisation",
      funderName: "Weidenfeld-Hoffmann Trust",
      entryPoint: "universite"
    },
    motif: "bailleur indépendant d'un État, même subventionné : Weidenfeld-Hoffmann Trust · dossier auprès de l'université"
  },

  // ---------------- Russie ----------------
  {
    collection: "scholarships",
    id: "hse-merit-scholarships",
    champs: {
      funder: "universite",
      funderName: "HSE University",
      entryPoint: "universite"
    },
    motif: "bourse propre à l'établissement — se demande dans le dossier d'admission : HSE University · dossier auprès de l'université"
  },
  {
    collection: "scholarships",
    id: "hse-into-olympiad",
    champs: {
      funder: "universite",
      funderName: "HSE University",
      entryPoint: "universite"
    },
    motif: "bourse propre à l'établissement — se demande dans le dossier d'admission : HSE University · dossier auprès de l'université"
  },
  {
    collection: "scholarships",
    id: "spbu-open-olympiad",
    champs: {
      funder: "universite",
      funderName: "Université d'État de Saint-Pétersbourg",
      entryPoint: "universite"
    },
    motif: "bourse propre à l'établissement — se demande dans le dossier d'admission : Université d'État de Saint-Pétersbourg · dossier auprès de l'université"
  },
  {
    collection: "scholarships",
    id: "open-doors-scholarship",
    champs: {
      funder: "gouvernement",
      funderName: "Ministère russe de l'Enseignement supérieur",
      entryPoint: "bourse"
    },
    motif: "programme national — portail central, fenêtre annuelle, condition de nationalité : Ministère russe de l'Enseignement supérieur · dossier chez le bailleur"
  },
  {
    collection: "scholarships",
    id: "quota-gouvernement-russe",
    champs: {
      funder: "gouvernement",
      funderName: "Rossotrudnichestvo",
      entryPoint: "bourse"
    },
    motif: "programme national — portail central, fenêtre annuelle, condition de nationalité : Rossotrudnichestvo · dossier chez le bailleur"
  },

  // ---------------- Suède ----------------
  {
    collection: "scholarships",
    id: "swedish-institute-scholarships-global-professionals",
    champs: {
      funder: "gouvernement",
      funderName: "Svenska institutet",
      entryPoint: "bourse"
    },
    motif: "programme national — portail central, fenêtre annuelle, condition de nationalité : Svenska institutet · dossier chez le bailleur"
  },

  // ---------------- Suisse ----------------
  {
    collection: "scholarships",
    id: "iheid-scholarships",
    champs: {
      funder: "universite",
      funderName: "IHEID",
      entryPoint: "universite"
    },
    motif: "bourse propre à l'établissement — se demande dans le dossier d'admission : IHEID · dossier auprès de l'université"
  },
  {
    collection: "scholarships",
    id: "unifr-research-scholarships",
    champs: {
      funder: "universite",
      funderName: "Université de Fribourg",
      entryPoint: "universite"
    },
    motif: "bourse propre à l'établissement — se demande dans le dossier d'admission : Université de Fribourg · dossier auprès de l'université"
  },
  {
    collection: "scholarships",
    id: "epfl-edic-doctoral",
    champs: {
      funder: "universite",
      funderName: "EPFL",
      entryPoint: "universite"
    },
    motif: "bourse propre à l'établissement — se demande dans le dossier d'admission : EPFL · dossier auprès de l'université"
  },
  {
    collection: "scholarships",
    id: "epfl-master-excellence-fellowships",
    champs: {
      funder: "universite",
      funderName: "EPFL",
      entryPoint: "universite"
    },
    motif: "bourse propre à l'établissement — se demande dans le dossier d'admission : EPFL · dossier auprès de l'université"
  },
  {
    collection: "scholarships",
    id: "eth-esop",
    champs: {
      funder: "universite",
      funderName: "ETH Zurich",
      entryPoint: "universite"
    },
    motif: "bourse propre à l'établissement — se demande dans le dossier d'admission : ETH Zurich · dossier auprès de l'université"
  },
  {
    collection: "scholarships",
    id: "unige-excellence-master-fellowships",
    champs: {
      funder: "universite",
      funderName: "Université de Genève",
      entryPoint: "universite"
    },
    motif: "bourse propre à l'établissement — se demande dans le dossier d'admission : Université de Genève · dossier auprès de l'université"
  },
  {
    collection: "scholarships",
    id: "zeno-karl-schindler-master-thesis",
    champs: {
      funder: "organisation",
      funderName: "Fondation Zeno Karl Schindler",
      entryPoint: "bourse"
    },
    motif: "bailleur indépendant d'un État, même subventionné : Fondation Zeno Karl Schindler · dossier chez le bailleur"
  },
  {
    collection: "scholarships",
    id: "swiss-government-excellence-scholarships",
    champs: {
      funder: "gouvernement",
      funderName: "SEFRI (Confédération suisse)",
      entryPoint: "bourse"
    },
    motif: "programme national — portail central, fenêtre annuelle, condition de nationalité : SEFRI (Confédération suisse) · dossier chez le bailleur"
  },
  {
    collection: "scholarships",
    id: "unil-master-grants",
    champs: {
      funder: "universite",
      funderName: "Université de Lausanne",
      entryPoint: "universite"
    },
    motif: "bourse propre à l'établissement — se demande dans le dossier d'admission : Université de Lausanne · dossier auprès de l'université"
  },
  {
    collection: "scholarships",
    id: "uzh-candoc-grant",
    champs: {
      funder: "universite",
      funderName: "University of Zurich",
      entryPoint: "universite"
    },
    motif: "bourse propre à l'établissement — se demande dans le dossier d'admission : University of Zurich · dossier auprès de l'université"
  },

  // ---------------- Turquie ----------------
  {
    collection: "scholarships",
    id: "bilkent-international-scholarships",
    champs: {
      funder: "universite",
      funderName: "Bilkent University",
      entryPoint: "universite"
    },
    motif: "bourse propre à l'établissement — se demande dans le dossier d'admission : Bilkent University · dossier auprès de l'université"
  },
  {
    collection: "scholarships",
    id: "diyanet-tdv-international",
    champs: {
      funder: "organisation",
      funderName: "Fondation Diyanet de Turquie (TDV)",
      entryPoint: "bourse"
    },
    motif: "bailleur indépendant d'un État, même subventionné : Fondation Diyanet de Turquie (TDV) · dossier chez le bailleur"
  },
  {
    collection: "scholarships",
    id: "koc-university-merit-scholarships",
    champs: {
      funder: "universite",
      funderName: "Koç University",
      entryPoint: "universite"
    },
    motif: "bourse propre à l'établissement — se demande dans le dossier d'admission : Koç University · dossier auprès de l'université"
  },
  {
    collection: "scholarships",
    id: "ytb-isdb-joint-scholarship",
    champs: {
      funder: "organisation",
      funderName: "Banque islamique de développement (avec YTB)",
      entryPoint: "bourse"
    },
    motif: "bailleur indépendant d'un État, même subventionné : Banque islamique de développement (avec YTB) · dossier chez le bailleur"
  },
  {
    collection: "scholarships",
    id: "sabanci-graduate-scholarships",
    champs: {
      funder: "universite",
      funderName: "Sabancı University",
      entryPoint: "universite"
    },
    motif: "bourse propre à l'établissement — se demande dans le dossier d'admission : Sabancı University · dossier auprès de l'université"
  },
  {
    collection: "scholarships",
    id: "tubitak-2216-research-fellowship",
    champs: {
      funder: "gouvernement",
      funderName: "TÜBİTAK",
      entryPoint: "bourse"
    },
    motif: "programme national — portail central, fenêtre annuelle, condition de nationalité : TÜBİTAK · dossier chez le bailleur"
  },
  {
    collection: "scholarships",
    id: "turkiye-burslari",
    champs: {
      funder: "gouvernement",
      funderName: "YTB (Türkiye Bursları)",
      entryPoint: "bourse"
    },
    motif: "programme national — portail central, fenêtre annuelle, condition de nationalité : YTB (Türkiye Bursları) · dossier chez le bailleur"
  },
  {
    collection: "scholarships",
    id: "turkiye-burslari-research",
    champs: {
      funder: "gouvernement",
      funderName: "YTB (Türkiye Bursları)",
      entryPoint: "bourse"
    },
    motif: "programme national — portail central, fenêtre annuelle, condition de nationalité : YTB (Türkiye Bursları) · dossier chez le bailleur"
  },
  {
    collection: "scholarships",
    id: "turkiye-burslari-success",
    champs: {
      funder: "gouvernement",
      funderName: "YTB (Türkiye Bursları)",
      entryPoint: "bourse"
    },
    motif: "programme national — portail central, fenêtre annuelle, condition de nationalité : YTB (Türkiye Bursları) · dossier chez le bailleur"
  },
];
