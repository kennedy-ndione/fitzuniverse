/**
 * ============================================================
 * LOT 40 — TOUR DU MONDE DES ÉCHÉANCES (5 septembre 2026)
 * ============================================================
 *
 * Troisième lot du chantier de fraîcheur, et le plus large : 115
 * bourses dont la page officielle a été lue le 2026-09-05, soit
 * 344 programmes touchés. PATCHES uniquement, générés depuis le
 * journal de constats (scripts hors dépôt), puis relus un par un.
 *
 * TROIS VERDICTS DE LECTURE, ET CE QU'ILS ÉCRIVENT :
 *   - « vérifié » (57) : la page publie une date complète ou
 *     annonce explicitement le cycle clos → `deadline` réécrit avec
 *     UNE date complète en tête, `status` corrigé si le sens change,
 *     `verifieLe` + `sourceEcheance` + `periodeOuverture` + `exigences`.
 *   - « vérifié sans date » (45) : la page est lue mais ne
 *     publie AUCUNE date propre à la bourse — elle dépend du pays, de
 *     l'établissement, ou n'existe pas (bourse attribuée avec
 *     l'admission). `deadline` le dit en clair, `echeanceVariable`
 *     quand c'est le cas, et le statut existant est CONSERVÉ : on ne
 *     rouvre pas une bourse sur une absence d'information.
 *   - « vérifié partiel » (13) : la page existe mais affiche un
 *     calendrier périmé (2024, 2025) ou incomplet → la prose le dit,
 *     l'ancienne date reste visible comme dernière clôture connue,
 *     et la bourse figure sur la liste remise à Charles.
 *   Les 28 bourses « bloquées » (site qui refuse la lecture
 *   automatique, page vide ou périmée) ne sont PAS dans ce lot : elles
 *   sont sur la même liste, avec les trois questions à poser à la page.
 *
 * DÉCOUVERTES QUI CHANGENT LE SENS D'UNE FICHE (à lire dans les motifs) :
 *   - POSTECH GIFT ferme le 11 septembre 2026 : 6 jours après ce lot.
 *   - EDISU Pavia (15 sept.), DSU Lombardia (30 sept.), Mastercard UCT
 *     (30 sept.), Zeno Karl Schindler (1er nov.), Pearson (6 nov.) sont
 *     OUVERTES et datées ; elles portaient « à confirmer » ou rien.
 *   - Commonwealth Master's et PhD ouvrent le 8 septembre 2026 et
 *     ferment le 20 octobre : « pas encore ouvertes » à trois jours près.
 *   - Niedersachsenstipendium, George Darie, Türkiye Bursları Success,
 *     UniBuc : bourses EN COURS D'ÉTUDES, pas d'entrée — dit en tête.
 *   - JJ/WBGSP, AUC, Rotary Yoneyama, Heinrich Böll, ETH ESOP : fenêtres
 *     futures datées avec un statut fermé → « pas encore ouvertes ».
 *   - GKS et King Abdulaziz étaient `isActive: false` alors que le
 *     programme vit : réactivées, sinon la règle du « retrait
 *     volontaire » aurait masqué leur date.
 *   - ARDIS FVG, Campania, Opera Universitaria : bando 2026-2027 ouvert
 *     mais date de clôture illisible → à lire par Charles.
 *
 * RÈGLES D'ÉCRITURE (lots 38-39) toujours appliquées, plus une : les
 * mots « clos », « fermée », « à confirmer », « variable », « estimé »
 * sont des MARQUEURS de js/echeance.js qui annulent une date lue ; ils
 * ont été remplacés partout (« terminé », « achevée », « à recouper sur
 * la page officielle ») pour que la date qui compte reste lisible. Le
 * programme Leibniz Hannover du Deutschlandstipendium est exclu : sa
 * fiche porte déjà une fenêtre réelle (10 août - 30 septembre 2026).
 * ============================================================
 */

export const PATCHES = [
  {
    "collection": "programs",
    "id": "university-of-toronto-toronto__lester-b-pearson-international-scholarship",
    "attendu": {
      "deadline": "6 novembre 2026"
    },
    "champs": {
      "deadline": "6 novembre 2026 pour la candidature à la bourse (promotion 2027, rentrée septembre 2027). Deux portes AVANT : la nomination par le lycée avant le 9 octobre 2026 (une seule nomination par école et par an, l'école doit être reconnue par l'université), puis la candidature d'admission via OUAC avant le 16 octobre 2026. Réservée aux étudiants internationaux nécessitant un permis d'études, en dernière année de secondaire en 2026-2027 ou diplômés au plus tôt en juin 2026 ; les étudiants déjà inscrits dans le supérieur ne sont pas admissibles."
    },
    "motif": "Lu sur future.utoronto.ca le 2026-09-05. Trois dates en cascade — nomination, admission, bourse — dont la première tombe dans cinq semaines ; la base n'en portait aucune."
  },
  {
    "collection": "scholarships",
    "id": "lester-b-pearson-international-scholarship",
    "champs": {
      "verifieLe": "6 novembre 2026",
      "sourceEcheance": "https://future.utoronto.ca/pearson-scholarships",
      "periodeOuverture": "appel annuel : nomination par l'école début octobre, admission mi-octobre, bourse début novembre, pour la rentrée de septembre suivante",
      "exigences": [
        "nomination_par_ecole",
        "admission_prealable"
      ]
    },
    "motif": "Lu sur future.utoronto.ca le 2026-09-05. Trois dates en cascade — nomination, admission, bourse — dont la première tombe dans cinq semaines ; la base n'en portait aucune."
  },
  {
    "collection": "programs",
    "id": "university-of-british-columbia-vancouver__ubc-international-scholars-program",
    "attendu": {
      "deadline": "1 décembre 2026"
    },
    "champs": {
      "deadline": "Aucune candidature séparée : les étudiants internationaux sont considérés automatiquement pour les bourses au mérite (IMES, Karen McKellin, Vantage One) en candidatant à UBC avant la date limite d'admission — la page ne donne pas cette date, elle renvoie au calendrier d'admission. Les décisions de bourse tombent de la mi-février à la fin avril, après l'offre d'admission ; la plupart des étudiants doivent accepter avant le 1er mai."
    },
    "motif": "Lu sur you.ubc.ca le 2026-09-05. La page ne publie pas la date limite d'admission — on le dit tel quel."
  },
  {
    "collection": "scholarships",
    "id": "ubc-international-scholars-program",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://you.ubc.ca/financial-planning/scholarships-awards-international-students",
      "periodeOuverture": "suit le calendrier d'admission de premier cycle d'UBC (candidature en hiver pour la rentrée de septembre) ; décisions de bourse de février à avril",
      "exigences": [
        "admission_prealable"
      ]
    },
    "motif": "Lu sur you.ubc.ca le 2026-09-05. La page ne publie pas la date limite d'admission — on le dit tel quel."
  },
  {
    "collection": "programs",
    "id": "mcgill-university-montreal__mcgill-major-entrance-scholarships",
    "attendu": {
      "deadline": "21 janvier 2027"
    },
    "champs": {
      "deadline": "Candidature SÉPARÉE, à déposer peu après la demande d'admission ; le formulaire ouvre le 1er octobre pour la rentrée d'automne suivante, la date limite précise est publiée sur la page des échéances de McGill (non reprise sur cette page). ATTENTION : les bourses de 12 000 $ sont réservées aux citoyens et résidents permanents canadiens ; les étudiants internationaux concourent pour les montants de 3 000 à 10 000 $. Sélection sur excellence académique et engagement."
    },
    "motif": "Lu sur mcgill.ca le 2026-09-05. Le fait que le palier de 12 000 $ soit fermé aux internationaux n'était pas dit."
  },
  {
    "collection": "scholarships",
    "id": "mcgill-major-entrance-scholarships",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.mcgill.ca/studentaid/scholarships-aid/future-undergrads/entrance-scholarships",
      "periodeOuverture": "appel annuel : formulaire ouvert le 1er octobre, pour la rentrée de septembre suivante",
      "exigences": [
        "admission_prealable"
      ]
    },
    "motif": "Lu sur mcgill.ca le 2026-09-05. Le fait que le palier de 12 000 $ soit fermé aux internationaux n'était pas dit."
  },
  {
    "collection": "programs",
    "id": "university-of-california-berkeley-berkeley__mastercard-foundation-scholars-program",
    "attendu": {
      "deadline": "Continu jusqu'à l'automne 2028 (1ᵉʳ tour du programme visé)"
    },
    "champs": {
      "deadline": "Programme de MASTER uniquement (201 étudiants de pays africains sur la durée du programme), avec une attention particulière aux femmes, aux personnes en situation de handicap et aux réfugiés ou déplacés. La page d'accueil ne publie aucune date limite ni aucun état des candidatures au 5 septembre : consulter la rubrique « Apply » du site."
    },
    "motif": "Lu sur mcfscholarsprogram.berkeley.edu le 2026-09-05. La base rattachait ce programme sans préciser qu'il est réservé au master."
  },
  {
    "collection": "scholarships",
    "id": "mastercard-foundation-scholars-program",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://mcfscholarsprogram.berkeley.edu",
      "periodeOuverture": "non publiée sur la page d'accueil",
      "exigences": []
    },
    "motif": "Lu sur mcfscholarsprogram.berkeley.edu le 2026-09-05. La base rattachait ce programme sans préciser qu'il est réservé au master."
  },
  {
    "collection": "programs",
    "id": "epfl-lausanne__swiss-government-excellence-scholarships",
    "attendu": {
      "deadline": "Candidatures ouvertes à partir du 20 août 2026 — dates précises par pays d'origine publiées à cette date sur sbfi.admin.ch (à vérifier)"
    },
    "champs": {
      "deadline": "Appel 2027-2028 ouvert depuis le 20 août. La date limite DÉPEND DU PAYS : chaque représentation suisse (ambassade ou consulat) publie la sienne, et c'est auprès d'elle que le dossier se dépose. Bourses de recherche (après un master, toute discipline) et bourses d'art (master initial, pays limités). 35 ans au plus ; pour la recherche, un professeur d'accueil en Suisse doit avoir accepté d'encadrer le projet. Allocation de 2 450 CHF par mois. Candidature gratuite — se méfier de toute demande de paiement."
    },
    "motif": "Lu sur sbfi.admin.ch le 2026-09-05. La bourse la plus vue de Suisse (120 profils) n'avait aucune date parce qu'elle n'en a pas une : elle en a 183, une par pays."
  },
  {
    "collection": "programs",
    "id": "eth-zurich-zurich__swiss-government-excellence-scholarships",
    "attendu": {
      "deadline": "Campagne 2027/2028 : ouverture 20 août 2026, deadline par pays publiée ensuite"
    },
    "champs": {
      "deadline": "Appel 2027-2028 ouvert depuis le 20 août. La date limite DÉPEND DU PAYS : chaque représentation suisse (ambassade ou consulat) publie la sienne, et c'est auprès d'elle que le dossier se dépose. Bourses de recherche (après un master, toute discipline) et bourses d'art (master initial, pays limités). 35 ans au plus ; pour la recherche, un professeur d'accueil en Suisse doit avoir accepté d'encadrer le projet. Allocation de 2 450 CHF par mois. Candidature gratuite — se méfier de toute demande de paiement."
    },
    "motif": "Lu sur sbfi.admin.ch le 2026-09-05. La bourse la plus vue de Suisse (120 profils) n'avait aucune date parce qu'elle n'en a pas une : elle en a 183, une par pays."
  },
  {
    "collection": "programs",
    "id": "university-of-zurich-zurich__swiss-government-excellence-scholarships",
    "attendu": {
      "deadline": "Candidatures ouvertes à partir du 20 août 2026 — dates précises par pays d'origine publiées à cette date sur sbfi.admin.ch (à vérifier)"
    },
    "champs": {
      "deadline": "Appel 2027-2028 ouvert depuis le 20 août. La date limite DÉPEND DU PAYS : chaque représentation suisse (ambassade ou consulat) publie la sienne, et c'est auprès d'elle que le dossier se dépose. Bourses de recherche (après un master, toute discipline) et bourses d'art (master initial, pays limités). 35 ans au plus ; pour la recherche, un professeur d'accueil en Suisse doit avoir accepté d'encadrer le projet. Allocation de 2 450 CHF par mois. Candidature gratuite — se méfier de toute demande de paiement."
    },
    "motif": "Lu sur sbfi.admin.ch le 2026-09-05. La bourse la plus vue de Suisse (120 profils) n'avait aucune date parce qu'elle n'en a pas une : elle en a 183, une par pays."
  },
  {
    "collection": "scholarships",
    "id": "swiss-government-excellence-scholarships",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.sbfi.admin.ch/sbfi/en/home/education/scholarships-and-grants/swiss-government-excellence-scholarships.html",
      "periodeOuverture": "appel annuel ouvert fin août, dates limites par pays publiées en août, généralement entre septembre et décembre",
      "exigences": [
        "directeur_these",
        "candidature_via_ambassade"
      ],
      "echeanceVariable": "pays",
      "ageMax": {
        "tous": 35
      },
      "ageMaxNote": "35 ans au plus (page officielle du SEFRI, vérifiée le 5 septembre 2026)."
    },
    "motif": "Lu sur sbfi.admin.ch le 2026-09-05. La bourse la plus vue de Suisse (120 profils) n'avait aucune date parce qu'elle n'en a pas une : elle en a 183, une par pays."
  },
  {
    "collection": "programs",
    "id": "epfl-lausanne__epfl-edic-doctoral",
    "attendu": {
      "deadline": "1er décembre 2026 ou 15 avril 2027"
    },
    "champs": {
      "deadline": "1er décembre 2026 (première session) ou 15 avril 2027 (seconde session) pour une entrée en 2027. Deux sessions par an. Les exigences détaillées (tests, lettres) sont sur la page « How to apply » de l'école doctorale."
    },
    "motif": "Lu sur epfl.ch le 2026-09-05."
  },
  {
    "collection": "scholarships",
    "id": "epfl-edic-doctoral",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.epfl.ch/education/phd/edic-computer-and-communication-sciences/edic-for-applicants",
      "periodeOuverture": "deux sessions par an : début décembre et mi-avril",
      "exigences": [
        "lettres_recommandation"
      ]
    },
    "motif": "Lu sur epfl.ch le 2026-09-05."
  },
  {
    "collection": "programs",
    "id": "eth-zurich-zurich__eth-esop",
    "attendu": {
      "deadline": "1er au 30 novembre 2026 à 23h59 via eApply, pour une rentrée à l'automne 2027",
      "status": "Ouverte"
    },
    "champs": {
      "deadline": "Clôture le 30 novembre 2026 à 12h59 (heure suisse) pour une entrée en master à l'automne 2027 ; la fenêtre de dépôt n'ouvre que le 1er novembre. Pas de dossier séparé : la demande se fait dans la candidature au master (eApply). Exigences : être dans les 10 % meilleurs de sa licence, nommer deux professeurs référents, joindre une pré-proposition de mémoire de master. Environ 60 bourses par an, décision fin mars, entretiens téléphoniques possibles en février. 13 500 CHF par semestre plus exonération des frais.",
      "status": "Fermée — fenêtre du 1er au 30 novembre 2026"
    },
    "motif": "Lu sur ethz.ch le 2026-09-05. Statut « Fermée » + date future = la fiche dira « pas encore ouverte, clôture annoncée le 30 novembre » — l'état exact."
  },
  {
    "collection": "scholarships",
    "id": "eth-esop",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://ethz.ch/students/en/studies/financial/scholarships/excellencescholarship.html",
      "periodeOuverture": "chaque année du 1er au 30 novembre, pour la rentrée d'automne suivante",
      "exigences": [
        "lettres_recommandation",
        "projet_recherche",
        "admission_prealable"
      ],
      "status": "Fermée — fenêtre du 1er au 30 novembre 2026"
    },
    "motif": "Lu sur ethz.ch le 2026-09-05. Statut « Fermée » + date future = la fiche dira « pas encore ouverte, clôture annoncée le 30 novembre » — l'état exact.",
    "attendu": {
      "status": "Ouverte"
    }
  },
  {
    "collection": "programs",
    "id": "epfl-lausanne__epfl-master-excellence-fellowships",
    "attendu": {
      "deadline": "Candidats à diplôme étranger : 15 décembre 2026 (1re session) ou 31 mars 2027 (2e session)"
    },
    "champs": {
      "deadline": "15 décembre 2026 (premier tour) ou 31 mars 2027 (second tour) pour les candidats externes, avec la candidature au master pour la rentrée 2027. Aucun dossier séparé : une case à cocher dans le formulaire d'admission. 10 000 CHF par semestre, quatre semestres au plus ; renouvellement à condition d'une moyenne d'au moins 5,0/6 et de 50 crédits acquis. Chambre en résidence réservée pour les candidats externes."
    },
    "motif": "Lu sur epfl.ch le 2026-09-05."
  },
  {
    "collection": "scholarships",
    "id": "epfl-master-excellence-fellowships",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.epfl.ch/education/master/master-excellence-fellowships/how-to-apply/",
      "periodeOuverture": "deux tours par an avec l'admission au master : mi-décembre et fin mars",
      "exigences": [
        "admission_prealable"
      ]
    },
    "motif": "Lu sur epfl.ch le 2026-09-05."
  },
  {
    "collection": "programs",
    "id": "bilkent-university-ankara__bilkent-international-scholarships",
    "attendu": {
      "deadline": "Dates non publiées — évaluation sur dossier au moment de l'admission"
    },
    "champs": {
      "deadline": "Aucune date limite publiée sur la page des bourses : l'aide financière est évaluée sur les notes du lycée, les résultats d'examens nationaux ou internationaux et le programme choisi, par paliers de 20 % à 100 % des frais, avec une bourse de logement possible pour les meilleurs. Les personnes ayant ou ayant eu la nationalité turque ne sont pas éligibles aux bourses internationales. Suivre le calendrier d'admission de Bilkent."
    },
    "motif": "Lu sur w3.bilkent.edu.tr le 2026-09-05. L'exclusion des (ex-)ressortissants turcs n'était pas dite."
  },
  {
    "collection": "scholarships",
    "id": "bilkent-international-scholarships",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://w3.bilkent.edu.tr/international/scholarships-for-international-students/",
      "periodeOuverture": "suit les sessions d'admission internationales de Bilkent",
      "exigences": [
        "admission_prealable"
      ]
    },
    "motif": "Lu sur w3.bilkent.edu.tr le 2026-09-05. L'exclusion des (ex-)ressortissants turcs n'était pas dite."
  },
  {
    "collection": "programs",
    "id": "universitat-hamburg-hamburg__uni-hamburg-leistungsstipendien",
    "attendu": {
      "deadline": "15 octobre 2026 (financement à partir du 1er avril 2027) ; session suivante le 15 avril 2027"
    },
    "champs": {
      "deadline": "15 octobre 2026 pour la période avril-mars, puis 15 avril 2027 pour la période octobre-septembre. Deux dépôts par an. ATTENTION : ce n'est pas une bourse d'entrée — il faut déjà être inscrit à l'Université de Hambourg depuis au moins deux semestres (un seul pour un master en deux ans ou un doctorat). Jusqu'à 930 € par mois (1 200 € pour un doctorant exceptionnel), douze mois renouvelables. Réservée aux non-Allemands non éligibles au BAföG ; engagement social et international attendu."
    },
    "motif": "Lu sur uni-hamburg.de le 2026-09-05. La base la présentait comme une bourse pour candidats ; elle ne s'obtient qu'une fois inscrit depuis un an."
  },
  {
    "collection": "scholarships",
    "id": "uni-hamburg-leistungsstipendien",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.uni-hamburg.de/en/internationales/studierende/incoming/studium-mit-abschluss/waehrend-des-studiums/finanzierung/leistungsstipendien.html",
      "periodeOuverture": "deux appels par an : 15 avril et 15 octobre",
      "exigences": [
        "admission_prealable"
      ]
    },
    "motif": "Lu sur uni-hamburg.de le 2026-09-05. La base la présentait comme une bourse pour candidats ; elle ne s'obtient qu'une fois inscrit depuis un an."
  },
  {
    "collection": "programs",
    "id": "hse-university-moscow__open-doors-scholarship",
    "attendu": {
      "deadline": "Inscription dès le 20 août 2026, 1ère étape jusqu'au 1er novembre 2026 (Licence/Master), résultats finaux 26 février 2027 (Doctorat/Postdoctorat)"
    },
    "champs": {
      "deadline": "Inscriptions jusqu'au 1er novembre 2026 pour l'édition 2026-2027 (ouvertes depuis le 20 août, entrée en 2027). Concours en ligne en plusieurs phases : première phase jusqu'au 13 novembre 2026, seconde jusqu'au 21 décembre 2026, troisième (doctorat et post-doctorat) jusqu'au 26 février 2027. Niveaux licence, master, doctorat, post-doctorat ; programmes en russe ou en anglais. Les frais de scolarité sont pris en charge par le gouvernement russe ; voyage, logement et assurance restent à la charge du lauréat."
    },
    "motif": "Lu sur od.globaluni.ru le 2026-09-05. Concours en cours, clôture des inscriptions dans huit semaines."
  },
  {
    "collection": "programs",
    "id": "rudn-university-moscow__open-doors-scholarship",
    "attendu": {
      "deadline": "Calendrier du concours Open Doors — se référer à globaluni.rudn.ru"
    },
    "champs": {
      "deadline": "Inscriptions jusqu'au 1er novembre 2026 pour l'édition 2026-2027 (ouvertes depuis le 20 août, entrée en 2027). Concours en ligne en plusieurs phases : première phase jusqu'au 13 novembre 2026, seconde jusqu'au 21 décembre 2026, troisième (doctorat et post-doctorat) jusqu'au 26 février 2027. Niveaux licence, master, doctorat, post-doctorat ; programmes en russe ou en anglais. Les frais de scolarité sont pris en charge par le gouvernement russe ; voyage, logement et assurance restent à la charge du lauréat."
    },
    "motif": "Lu sur od.globaluni.ru le 2026-09-05. Concours en cours, clôture des inscriptions dans huit semaines."
  },
  {
    "collection": "scholarships",
    "id": "open-doors-scholarship",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://od.globaluni.ru/",
      "periodeOuverture": "concours annuel : inscriptions de fin août à début novembre, épreuves jusqu'en février",
      "exigences": []
    },
    "motif": "Lu sur od.globaluni.ru le 2026-09-05. Concours en cours, clôture des inscriptions dans huit semaines."
  },
  {
    "collection": "programs",
    "id": "humboldt-universitat-zu-berlin-berlin__deutschlandstipendium",
    "attendu": {
      "deadline": "Appel publié chaque année en novembre-décembre, financement démarrant le 1er avril suivant",
      "status": "Fermée"
    },
    "champs": {
      "deadline": "Aucune date nationale : la candidature se fait directement auprès de l'université fréquentée, qui fixe son propre calendrier et ses propres critères. Ouverte aux étudiants de toute nationalité, dès le premier semestre. Consulter la page Deutschlandstipendium de l'université visée.",
      "status": "Ouverte"
    },
    "motif": "Lu sur deutschlandstipendium.de le 2026-09-05. Le programme est fédéral, l'appel est local : une date unique serait fausse."
  },
  {
    "collection": "programs",
    "id": "universitat-hamburg-hamburg__deutschlandstipendium",
    "attendu": {
      "deadline": "Calendrier propre à l'Universität Hamburg — se référer à sa page Deutschlandstipendium"
    },
    "champs": {
      "deadline": "Aucune date nationale : la candidature se fait directement auprès de l'université fréquentée, qui fixe son propre calendrier et ses propres critères. Ouverte aux étudiants de toute nationalité, dès le premier semestre. Consulter la page Deutschlandstipendium de l'université visée."
    },
    "motif": "Lu sur deutschlandstipendium.de le 2026-09-05. Le programme est fédéral, l'appel est local : une date unique serait fausse."
  },
  {
    "collection": "scholarships",
    "id": "deutschlandstipendium",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.deutschlandstipendium.de/",
      "periodeOuverture": "propre à chaque université ; le plus souvent une campagne par an, au printemps ou à l'automne",
      "exigences": [
        "admission_prealable"
      ],
      "echeanceVariable": "etablissement"
    },
    "motif": "Lu sur deutschlandstipendium.de le 2026-09-05. Le programme est fédéral, l'appel est local : une date unique serait fausse."
  },
  {
    "collection": "programs",
    "id": "unina-bachelor",
    "attendu": {
      "deadline": "À confirmer selon l'année académique"
    },
    "champs": {
      "deadline": "Bando 2026-2027 approuvé fin juillet ; la date limite de dépôt n'apparaît pas sur la page d'accueil, elle est dans le bando (espace réservé ADISURC). Bourse régionale de droit à l'étude pour « studenti capaci e meritevoli anche se privi di mezzi », sur revenus (ISEE) et mérite."
    },
    "motif": "Lu sur adisurcampania.it le 2026-09-05 : bando 2026/27 approuvé le 24.07.2026, date limite non reprise sur la page. Remise à Charles pour la date."
  },
  {
    "collection": "programs",
    "id": "unina-master",
    "attendu": {
      "deadline": "À confirmer selon l'année académique"
    },
    "champs": {
      "deadline": "Bando 2026-2027 approuvé fin juillet ; la date limite de dépôt n'apparaît pas sur la page d'accueil, elle est dans le bando (espace réservé ADISURC). Bourse régionale de droit à l'étude pour « studenti capaci e meritevoli anche se privi di mezzi », sur revenus (ISEE) et mérite."
    },
    "motif": "Lu sur adisurcampania.it le 2026-09-05 : bando 2026/27 approuvé le 24.07.2026, date limite non reprise sur la page. Remise à Charles pour la date."
  },
  {
    "collection": "scholarships",
    "id": "campania-regional-scholarship",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.adisurcampania.it/",
      "periodeOuverture": "bando annuel publié en juillet, clôture généralement en septembre (à recouper sur la page officielle sur le bando)",
      "exigences": []
    },
    "motif": "Lu sur adisurcampania.it le 2026-09-05 : bando 2026/27 approuvé le 24.07.2026, date limite non reprise sur la page. Remise à Charles pour la date."
  },
  {
    "collection": "programs",
    "id": "unitn-bachelor",
    "attendu": {
      "deadline": "À confirmer selon l'année académique"
    },
    "champs": {
      "deadline": "Bando 2026-2027 approuvé début juillet, candidatures ouvertes depuis la mi-juillet sur le site d'Opera Universitaria ; la date limite de clôture n'est pas reprise sur la page d'accueil, elle est dans le bando. Bourse de droit à l'étude de la province de Trente, sur revenus et mérite."
    },
    "motif": "Lu sur operauni.tn.it le 2026-09-05 : « Call for applications 2026-2027 approved » le 9 juillet, « Applications now open » le 13 juillet. Remise à Charles pour la date de clôture."
  },
  {
    "collection": "programs",
    "id": "unitn-master",
    "attendu": {
      "deadline": "À confirmer selon l'année académique"
    },
    "champs": {
      "deadline": "Bando 2026-2027 approuvé début juillet, candidatures ouvertes depuis la mi-juillet sur le site d'Opera Universitaria ; la date limite de clôture n'est pas reprise sur la page d'accueil, elle est dans le bando. Bourse de droit à l'étude de la province de Trente, sur revenus et mérite."
    },
    "motif": "Lu sur operauni.tn.it le 2026-09-05 : « Call for applications 2026-2027 approved » le 9 juillet, « Applications now open » le 13 juillet. Remise à Charles pour la date de clôture."
  },
  {
    "collection": "scholarships",
    "id": "opera-universitaria-scholarship",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.operauni.tn.it/en/",
      "periodeOuverture": "bando annuel publié en juillet, dépôt à partir de la mi-juillet (clôture à recouper sur la page officielle sur le bando)",
      "exigences": []
    },
    "motif": "Lu sur operauni.tn.it le 2026-09-05 : « Call for applications 2026-2027 approved » le 9 juillet, « Applications now open » le 13 juillet. Remise à Charles pour la date de clôture."
  },
  {
    "collection": "programs",
    "id": "buaa-bachelor",
    "attendu": {
      "deadline": "15 février 2027"
    },
    "champs": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois."
    },
    "motif": "Le portail CSC (studyinchina.csc.edu.cn, campuschina.org) refuse la lecture automatisée ; les règles nationales ont été lues sur l'annonce officielle d'une ambassade de Chine pour 2026/2027. La bourse la plus vue du catalogue (360 profils) affichait « 15 février 2027 » à tout le monde alors que la date dépend de l'ambassade."
  },
  {
    "collection": "programs",
    "id": "buaa-master",
    "attendu": {
      "deadline": "15 février 2027"
    },
    "champs": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois."
    },
    "motif": "Le portail CSC (studyinchina.csc.edu.cn, campuschina.org) refuse la lecture automatisée ; les règles nationales ont été lues sur l'annonce officielle d'une ambassade de Chine pour 2026/2027. La bourse la plus vue du catalogue (360 profils) affichait « 15 février 2027 » à tout le monde alors que la date dépend de l'ambassade."
  },
  {
    "collection": "programs",
    "id": "buaa-phd",
    "attendu": {
      "deadline": "15 février 2027"
    },
    "champs": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois."
    },
    "motif": "Le portail CSC (studyinchina.csc.edu.cn, campuschina.org) refuse la lecture automatisée ; les règles nationales ont été lues sur l'annonce officielle d'une ambassade de Chine pour 2026/2027. La bourse la plus vue du catalogue (360 profils) affichait « 15 février 2027 » à tout le monde alors que la date dépend de l'ambassade."
  },
  {
    "collection": "programs",
    "id": "fudan-bachelor",
    "attendu": {
      "deadline": "15 février 2027"
    },
    "champs": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois."
    },
    "motif": "Le portail CSC (studyinchina.csc.edu.cn, campuschina.org) refuse la lecture automatisée ; les règles nationales ont été lues sur l'annonce officielle d'une ambassade de Chine pour 2026/2027. La bourse la plus vue du catalogue (360 profils) affichait « 15 février 2027 » à tout le monde alors que la date dépend de l'ambassade."
  },
  {
    "collection": "programs",
    "id": "fudan-master",
    "attendu": {
      "deadline": "15 février 2027"
    },
    "champs": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois."
    },
    "motif": "Le portail CSC (studyinchina.csc.edu.cn, campuschina.org) refuse la lecture automatisée ; les règles nationales ont été lues sur l'annonce officielle d'une ambassade de Chine pour 2026/2027. La bourse la plus vue du catalogue (360 profils) affichait « 15 février 2027 » à tout le monde alors que la date dépend de l'ambassade."
  },
  {
    "collection": "programs",
    "id": "fudan-phd",
    "attendu": {
      "deadline": "15 février 2027"
    },
    "champs": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois."
    },
    "motif": "Le portail CSC (studyinchina.csc.edu.cn, campuschina.org) refuse la lecture automatisée ; les règles nationales ont été lues sur l'annonce officielle d'une ambassade de Chine pour 2026/2027. La bourse la plus vue du catalogue (360 profils) affichait « 15 février 2027 » à tout le monde alors que la date dépend de l'ambassade."
  },
  {
    "collection": "programs",
    "id": "hit-bachelor",
    "attendu": {
      "deadline": "15 février 2027"
    },
    "champs": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois."
    },
    "motif": "Le portail CSC (studyinchina.csc.edu.cn, campuschina.org) refuse la lecture automatisée ; les règles nationales ont été lues sur l'annonce officielle d'une ambassade de Chine pour 2026/2027. La bourse la plus vue du catalogue (360 profils) affichait « 15 février 2027 » à tout le monde alors que la date dépend de l'ambassade."
  },
  {
    "collection": "programs",
    "id": "hit-master",
    "attendu": {
      "deadline": "15 février 2027"
    },
    "champs": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois."
    },
    "motif": "Le portail CSC (studyinchina.csc.edu.cn, campuschina.org) refuse la lecture automatisée ; les règles nationales ont été lues sur l'annonce officielle d'une ambassade de Chine pour 2026/2027. La bourse la plus vue du catalogue (360 profils) affichait « 15 février 2027 » à tout le monde alors que la date dépend de l'ambassade."
  },
  {
    "collection": "programs",
    "id": "hit-phd",
    "attendu": {
      "deadline": "15 février 2027"
    },
    "champs": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois."
    },
    "motif": "Le portail CSC (studyinchina.csc.edu.cn, campuschina.org) refuse la lecture automatisée ; les règles nationales ont été lues sur l'annonce officielle d'une ambassade de Chine pour 2026/2027. La bourse la plus vue du catalogue (360 profils) affichait « 15 février 2027 » à tout le monde alors que la date dépend de l'ambassade."
  },
  {
    "collection": "programs",
    "id": "nanjing-university-nanjing__chinese-government-scholarship",
    "attendu": {
      "deadline": "15 février 2027"
    },
    "champs": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois."
    },
    "motif": "Le portail CSC (studyinchina.csc.edu.cn, campuschina.org) refuse la lecture automatisée ; les règles nationales ont été lues sur l'annonce officielle d'une ambassade de Chine pour 2026/2027. La bourse la plus vue du catalogue (360 profils) affichait « 15 février 2027 » à tout le monde alors que la date dépend de l'ambassade."
  },
  {
    "collection": "programs",
    "id": "peking-university-beijing__chinese-government-scholarship",
    "attendu": {
      "deadline": "15 février 2027"
    },
    "champs": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois."
    },
    "motif": "Le portail CSC (studyinchina.csc.edu.cn, campuschina.org) refuse la lecture automatisée ; les règles nationales ont été lues sur l'annonce officielle d'une ambassade de Chine pour 2026/2027. La bourse la plus vue du catalogue (360 profils) affichait « 15 février 2027 » à tout le monde alors que la date dépend de l'ambassade."
  },
  {
    "collection": "programs",
    "id": "scu-bachelor",
    "attendu": {
      "deadline": "15 février 2027"
    },
    "champs": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois."
    },
    "motif": "Le portail CSC (studyinchina.csc.edu.cn, campuschina.org) refuse la lecture automatisée ; les règles nationales ont été lues sur l'annonce officielle d'une ambassade de Chine pour 2026/2027. La bourse la plus vue du catalogue (360 profils) affichait « 15 février 2027 » à tout le monde alors que la date dépend de l'ambassade."
  },
  {
    "collection": "programs",
    "id": "scu-master",
    "attendu": {
      "deadline": "15 février 2027"
    },
    "champs": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois."
    },
    "motif": "Le portail CSC (studyinchina.csc.edu.cn, campuschina.org) refuse la lecture automatisée ; les règles nationales ont été lues sur l'annonce officielle d'une ambassade de Chine pour 2026/2027. La bourse la plus vue du catalogue (360 profils) affichait « 15 février 2027 » à tout le monde alors que la date dépend de l'ambassade."
  },
  {
    "collection": "programs",
    "id": "scu-phd",
    "attendu": {
      "deadline": "15 février 2027"
    },
    "champs": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois."
    },
    "motif": "Le portail CSC (studyinchina.csc.edu.cn, campuschina.org) refuse la lecture automatisée ; les règles nationales ont été lues sur l'annonce officielle d'une ambassade de Chine pour 2026/2027. La bourse la plus vue du catalogue (360 profils) affichait « 15 février 2027 » à tout le monde alors que la date dépend de l'ambassade."
  },
  {
    "collection": "programs",
    "id": "sjtu-bachelor",
    "attendu": {
      "deadline": "15 février 2027"
    },
    "champs": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois."
    },
    "motif": "Le portail CSC (studyinchina.csc.edu.cn, campuschina.org) refuse la lecture automatisée ; les règles nationales ont été lues sur l'annonce officielle d'une ambassade de Chine pour 2026/2027. La bourse la plus vue du catalogue (360 profils) affichait « 15 février 2027 » à tout le monde alors que la date dépend de l'ambassade."
  },
  {
    "collection": "programs",
    "id": "sjtu-master",
    "attendu": {
      "deadline": "15 février 2027"
    },
    "champs": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois."
    },
    "motif": "Le portail CSC (studyinchina.csc.edu.cn, campuschina.org) refuse la lecture automatisée ; les règles nationales ont été lues sur l'annonce officielle d'une ambassade de Chine pour 2026/2027. La bourse la plus vue du catalogue (360 profils) affichait « 15 février 2027 » à tout le monde alors que la date dépend de l'ambassade."
  },
  {
    "collection": "programs",
    "id": "sjtu-phd",
    "attendu": {
      "deadline": "15 février 2027"
    },
    "champs": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois."
    },
    "motif": "Le portail CSC (studyinchina.csc.edu.cn, campuschina.org) refuse la lecture automatisée ; les règles nationales ont été lues sur l'annonce officielle d'une ambassade de Chine pour 2026/2027. La bourse la plus vue du catalogue (360 profils) affichait « 15 février 2027 » à tout le monde alors que la date dépend de l'ambassade."
  },
  {
    "collection": "programs",
    "id": "sysu-bachelor",
    "attendu": {
      "deadline": "15 février 2027"
    },
    "champs": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois."
    },
    "motif": "Le portail CSC (studyinchina.csc.edu.cn, campuschina.org) refuse la lecture automatisée ; les règles nationales ont été lues sur l'annonce officielle d'une ambassade de Chine pour 2026/2027. La bourse la plus vue du catalogue (360 profils) affichait « 15 février 2027 » à tout le monde alors que la date dépend de l'ambassade."
  },
  {
    "collection": "programs",
    "id": "sysu-master",
    "attendu": {
      "deadline": "15 février 2027"
    },
    "champs": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois."
    },
    "motif": "Le portail CSC (studyinchina.csc.edu.cn, campuschina.org) refuse la lecture automatisée ; les règles nationales ont été lues sur l'annonce officielle d'une ambassade de Chine pour 2026/2027. La bourse la plus vue du catalogue (360 profils) affichait « 15 février 2027 » à tout le monde alors que la date dépend de l'ambassade."
  },
  {
    "collection": "programs",
    "id": "sysu-phd",
    "attendu": {
      "deadline": "15 février 2027"
    },
    "champs": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois."
    },
    "motif": "Le portail CSC (studyinchina.csc.edu.cn, campuschina.org) refuse la lecture automatisée ; les règles nationales ont été lues sur l'annonce officielle d'une ambassade de Chine pour 2026/2027. La bourse la plus vue du catalogue (360 profils) affichait « 15 février 2027 » à tout le monde alors que la date dépend de l'ambassade."
  },
  {
    "collection": "programs",
    "id": "tju-bachelor",
    "attendu": {
      "deadline": "15 février 2027"
    },
    "champs": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois."
    },
    "motif": "Le portail CSC (studyinchina.csc.edu.cn, campuschina.org) refuse la lecture automatisée ; les règles nationales ont été lues sur l'annonce officielle d'une ambassade de Chine pour 2026/2027. La bourse la plus vue du catalogue (360 profils) affichait « 15 février 2027 » à tout le monde alors que la date dépend de l'ambassade."
  },
  {
    "collection": "programs",
    "id": "tju-master",
    "attendu": {
      "deadline": "15 février 2027"
    },
    "champs": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois."
    },
    "motif": "Le portail CSC (studyinchina.csc.edu.cn, campuschina.org) refuse la lecture automatisée ; les règles nationales ont été lues sur l'annonce officielle d'une ambassade de Chine pour 2026/2027. La bourse la plus vue du catalogue (360 profils) affichait « 15 février 2027 » à tout le monde alors que la date dépend de l'ambassade."
  },
  {
    "collection": "programs",
    "id": "tju-phd",
    "attendu": {
      "deadline": "15 février 2027"
    },
    "champs": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois."
    },
    "motif": "Le portail CSC (studyinchina.csc.edu.cn, campuschina.org) refuse la lecture automatisée ; les règles nationales ont été lues sur l'annonce officielle d'une ambassade de Chine pour 2026/2027. La bourse la plus vue du catalogue (360 profils) affichait « 15 février 2027 » à tout le monde alors que la date dépend de l'ambassade."
  },
  {
    "collection": "programs",
    "id": "tongji-bachelor",
    "attendu": {
      "deadline": "15 février 2027"
    },
    "champs": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois."
    },
    "motif": "Le portail CSC (studyinchina.csc.edu.cn, campuschina.org) refuse la lecture automatisée ; les règles nationales ont été lues sur l'annonce officielle d'une ambassade de Chine pour 2026/2027. La bourse la plus vue du catalogue (360 profils) affichait « 15 février 2027 » à tout le monde alors que la date dépend de l'ambassade."
  },
  {
    "collection": "programs",
    "id": "tongji-master",
    "attendu": {
      "deadline": "15 février 2027"
    },
    "champs": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois."
    },
    "motif": "Le portail CSC (studyinchina.csc.edu.cn, campuschina.org) refuse la lecture automatisée ; les règles nationales ont été lues sur l'annonce officielle d'une ambassade de Chine pour 2026/2027. La bourse la plus vue du catalogue (360 profils) affichait « 15 février 2027 » à tout le monde alors que la date dépend de l'ambassade."
  },
  {
    "collection": "programs",
    "id": "tongji-phd",
    "attendu": {
      "deadline": "15 février 2027"
    },
    "champs": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois."
    },
    "motif": "Le portail CSC (studyinchina.csc.edu.cn, campuschina.org) refuse la lecture automatisée ; les règles nationales ont été lues sur l'annonce officielle d'une ambassade de Chine pour 2026/2027. La bourse la plus vue du catalogue (360 profils) affichait « 15 février 2027 » à tout le monde alors que la date dépend de l'ambassade."
  },
  {
    "collection": "programs",
    "id": "tsinghua-bachelor",
    "attendu": {
      "deadline": "15 février 2027"
    },
    "champs": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois."
    },
    "motif": "Le portail CSC (studyinchina.csc.edu.cn, campuschina.org) refuse la lecture automatisée ; les règles nationales ont été lues sur l'annonce officielle d'une ambassade de Chine pour 2026/2027. La bourse la plus vue du catalogue (360 profils) affichait « 15 février 2027 » à tout le monde alors que la date dépend de l'ambassade."
  },
  {
    "collection": "programs",
    "id": "tsinghua-master",
    "attendu": {
      "deadline": "15 février 2027"
    },
    "champs": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois."
    },
    "motif": "Le portail CSC (studyinchina.csc.edu.cn, campuschina.org) refuse la lecture automatisée ; les règles nationales ont été lues sur l'annonce officielle d'une ambassade de Chine pour 2026/2027. La bourse la plus vue du catalogue (360 profils) affichait « 15 février 2027 » à tout le monde alors que la date dépend de l'ambassade."
  },
  {
    "collection": "programs",
    "id": "tsinghua-phd",
    "attendu": {
      "deadline": "15 février 2027"
    },
    "champs": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois."
    },
    "motif": "Le portail CSC (studyinchina.csc.edu.cn, campuschina.org) refuse la lecture automatisée ; les règles nationales ont été lues sur l'annonce officielle d'une ambassade de Chine pour 2026/2027. La bourse la plus vue du catalogue (360 profils) affichait « 15 février 2027 » à tout le monde alors que la date dépend de l'ambassade."
  },
  {
    "collection": "programs",
    "id": "ustc-bachelor",
    "attendu": {
      "deadline": "15 février 2027"
    },
    "champs": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois."
    },
    "motif": "Le portail CSC (studyinchina.csc.edu.cn, campuschina.org) refuse la lecture automatisée ; les règles nationales ont été lues sur l'annonce officielle d'une ambassade de Chine pour 2026/2027. La bourse la plus vue du catalogue (360 profils) affichait « 15 février 2027 » à tout le monde alors que la date dépend de l'ambassade."
  },
  {
    "collection": "programs",
    "id": "ustc-master",
    "attendu": {
      "deadline": "15 février 2027"
    },
    "champs": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois."
    },
    "motif": "Le portail CSC (studyinchina.csc.edu.cn, campuschina.org) refuse la lecture automatisée ; les règles nationales ont été lues sur l'annonce officielle d'une ambassade de Chine pour 2026/2027. La bourse la plus vue du catalogue (360 profils) affichait « 15 février 2027 » à tout le monde alors que la date dépend de l'ambassade."
  },
  {
    "collection": "programs",
    "id": "ustc-phd",
    "attendu": {
      "deadline": "15 février 2027"
    },
    "champs": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois."
    },
    "motif": "Le portail CSC (studyinchina.csc.edu.cn, campuschina.org) refuse la lecture automatisée ; les règles nationales ont été lues sur l'annonce officielle d'une ambassade de Chine pour 2026/2027. La bourse la plus vue du catalogue (360 profils) affichait « 15 février 2027 » à tout le monde alors que la date dépend de l'ambassade."
  },
  {
    "collection": "programs",
    "id": "whu-bachelor",
    "attendu": {
      "deadline": "15 février 2027"
    },
    "champs": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois."
    },
    "motif": "Le portail CSC (studyinchina.csc.edu.cn, campuschina.org) refuse la lecture automatisée ; les règles nationales ont été lues sur l'annonce officielle d'une ambassade de Chine pour 2026/2027. La bourse la plus vue du catalogue (360 profils) affichait « 15 février 2027 » à tout le monde alors que la date dépend de l'ambassade."
  },
  {
    "collection": "programs",
    "id": "whu-master",
    "attendu": {
      "deadline": "15 février 2027"
    },
    "champs": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois."
    },
    "motif": "Le portail CSC (studyinchina.csc.edu.cn, campuschina.org) refuse la lecture automatisée ; les règles nationales ont été lues sur l'annonce officielle d'une ambassade de Chine pour 2026/2027. La bourse la plus vue du catalogue (360 profils) affichait « 15 février 2027 » à tout le monde alors que la date dépend de l'ambassade."
  },
  {
    "collection": "programs",
    "id": "whu-phd",
    "attendu": {
      "deadline": "15 février 2027"
    },
    "champs": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois."
    },
    "motif": "Le portail CSC (studyinchina.csc.edu.cn, campuschina.org) refuse la lecture automatisée ; les règles nationales ont été lues sur l'annonce officielle d'une ambassade de Chine pour 2026/2027. La bourse la plus vue du catalogue (360 profils) affichait « 15 février 2027 » à tout le monde alors que la date dépend de l'ambassade."
  },
  {
    "collection": "programs",
    "id": "xmu-bachelor",
    "attendu": {
      "deadline": "15 février 2027"
    },
    "champs": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois."
    },
    "motif": "Le portail CSC (studyinchina.csc.edu.cn, campuschina.org) refuse la lecture automatisée ; les règles nationales ont été lues sur l'annonce officielle d'une ambassade de Chine pour 2026/2027. La bourse la plus vue du catalogue (360 profils) affichait « 15 février 2027 » à tout le monde alors que la date dépend de l'ambassade."
  },
  {
    "collection": "programs",
    "id": "xmu-master",
    "attendu": {
      "deadline": "15 février 2027"
    },
    "champs": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois."
    },
    "motif": "Le portail CSC (studyinchina.csc.edu.cn, campuschina.org) refuse la lecture automatisée ; les règles nationales ont été lues sur l'annonce officielle d'une ambassade de Chine pour 2026/2027. La bourse la plus vue du catalogue (360 profils) affichait « 15 février 2027 » à tout le monde alors que la date dépend de l'ambassade."
  },
  {
    "collection": "programs",
    "id": "xmu-phd",
    "attendu": {
      "deadline": "15 février 2027"
    },
    "champs": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois."
    },
    "motif": "Le portail CSC (studyinchina.csc.edu.cn, campuschina.org) refuse la lecture automatisée ; les règles nationales ont été lues sur l'annonce officielle d'une ambassade de Chine pour 2026/2027. La bourse la plus vue du catalogue (360 profils) affichait « 15 février 2027 » à tout le monde alors que la date dépend de l'ambassade."
  },
  {
    "collection": "programs",
    "id": "zju-bachelor",
    "attendu": {
      "deadline": "15 février 2027"
    },
    "champs": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois."
    },
    "motif": "Le portail CSC (studyinchina.csc.edu.cn, campuschina.org) refuse la lecture automatisée ; les règles nationales ont été lues sur l'annonce officielle d'une ambassade de Chine pour 2026/2027. La bourse la plus vue du catalogue (360 profils) affichait « 15 février 2027 » à tout le monde alors que la date dépend de l'ambassade."
  },
  {
    "collection": "programs",
    "id": "zju-master",
    "attendu": {
      "deadline": "15 février 2027"
    },
    "champs": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois."
    },
    "motif": "Le portail CSC (studyinchina.csc.edu.cn, campuschina.org) refuse la lecture automatisée ; les règles nationales ont été lues sur l'annonce officielle d'une ambassade de Chine pour 2026/2027. La bourse la plus vue du catalogue (360 profils) affichait « 15 février 2027 » à tout le monde alors que la date dépend de l'ambassade."
  },
  {
    "collection": "programs",
    "id": "zju-phd",
    "attendu": {
      "deadline": "15 février 2027"
    },
    "champs": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois."
    },
    "motif": "Le portail CSC (studyinchina.csc.edu.cn, campuschina.org) refuse la lecture automatisée ; les règles nationales ont été lues sur l'annonce officielle d'une ambassade de Chine pour 2026/2027. La bourse la plus vue du catalogue (360 profils) affichait « 15 février 2027 » à tout le monde alors que la date dépend de l'ambassade."
  },
  {
    "collection": "scholarships",
    "id": "chinese-government-scholarship",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://id.china-embassy.gov.cn/eng/sgdt/202510/t20251027_11741674.htm",
      "periodeOuverture": "appel annuel par ambassade : publication à l'automne, clôture entre janvier et mars selon le pays",
      "exigences": [
        "candidature_via_ambassade",
        "admission_prealable",
        "lettres_recommandation",
        "certification_langue_requise"
      ],
      "echeanceVariable": "pays"
    },
    "motif": "Le portail CSC (studyinchina.csc.edu.cn, campuschina.org) refuse la lecture automatisée ; les règles nationales ont été lues sur l'annonce officielle d'une ambassade de Chine pour 2026/2027. La bourse la plus vue du catalogue (360 profils) affichait « 15 février 2027 » à tout le monde alors que la date dépend de l'ambassade."
  },
  {
    "collection": "programs",
    "id": "universiti-kebangsaan-malaysia-kuala-lumpur__malaysia-international-scholarship",
    "attendu": {
      "deadline": "Cycle 2027 : candidature du 4 mars au 4 avril 2027",
      "status": "Ouverte"
    },
    "champs": {
      "deadline": "L'appel pour l'année 2026-2027 est terminé (« The application for the academic year 2026/2027 is now closed ») ; les résultats de présélection étaient consultables du 7 au 22 juillet 2026. Le prochain appel est attendu au printemps 2027. Les conditions détaillées (niveaux, âge, moyenne, langue) sont dans les MIS Guidelines du ministère, non reprises sur la page.",
      "status": "Fermée — appel 2026-2027 clos"
    },
    "motif": "Lu sur biasiswa.mohe.gov.my le 2026-09-05."
  },
  {
    "collection": "programs",
    "id": "universiti-malaya-kuala-lumpur__malaysia-international-scholarship",
    "attendu": {
      "deadline": "Cycle 2027 : candidature du 4 mars au 4 avril 2027",
      "status": "Ouverte"
    },
    "champs": {
      "deadline": "L'appel pour l'année 2026-2027 est terminé (« The application for the academic year 2026/2027 is now closed ») ; les résultats de présélection étaient consultables du 7 au 22 juillet 2026. Le prochain appel est attendu au printemps 2027. Les conditions détaillées (niveaux, âge, moyenne, langue) sont dans les MIS Guidelines du ministère, non reprises sur la page.",
      "status": "Fermée — appel 2026-2027 clos"
    },
    "motif": "Lu sur biasiswa.mohe.gov.my le 2026-09-05."
  },
  {
    "collection": "scholarships",
    "id": "malaysia-international-scholarship",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://biasiswa.mohe.gov.my/INTER/index.php",
      "periodeOuverture": "appel annuel au printemps, présélection en juillet, pour la rentrée de septembre",
      "exigences": [],
      "status": "Fermée — appel 2026-2027 clos"
    },
    "motif": "Lu sur biasiswa.mohe.gov.my le 2026-09-05.",
    "attendu": {
      "status": "Ouverte"
    }
  },
  {
    "collection": "programs",
    "id": "semmelweis-university-budapest__semmelweis-pannonia-in-excellence",
    "attendu": {
      "deadline": "15 octobre 2026, via l'interface Requests de Neptun"
    },
    "champs": {
      "deadline": "15 octobre 2026. ATTENTION : bourse en cours d'études, pas d'entrée — il faut être déjà inscrit à Semmelweis avec un statut actif, avoir accompli au moins deux semestres actifs, et suivre un programme en anglais ou en allemand. Réservée aux ressortissants des pays de la liste officielle, incompatible avec Stipendium Hungaricum. Montants annuels : 2 000 000 HUF en médecine et dentaire, 1 300 000 HUF en pharmacie, 900 000 HUF en sciences de la santé, 2 900 000 HUF à la faculté András Pető, versés sur douze mois."
    },
    "motif": "Lu sur semmelweis.hu le 2026-09-05. La base la présentait comme accessible aux candidats ; elle ne l'est qu'après deux semestres à Semmelweis."
  },
  {
    "collection": "scholarships",
    "id": "semmelweis-pannonia-in-excellence",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://semmelweis.hu/registrar/information/scholarships/semmelweis-pannonia-in-excellence-scholarship/",
      "periodeOuverture": "appel annuel, clôture mi-octobre",
      "exigences": [
        "admission_prealable"
      ]
    },
    "motif": "Lu sur semmelweis.hu le 2026-09-05. La base la présentait comme accessible aux candidats ; elle ne l'est qu'après deux semestres à Semmelweis."
  },
  {
    "collection": "programs",
    "id": "humboldt-universitat-zu-berlin-berlin__daad-epos__doctorat",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date unique : la candidature se dépose DIRECTEMENT auprès de chaque cours EPOS choisi (jusqu'à trois, par ordre de priorité), et chaque cours fixe sa propre date limite — voir la brochure EPOS ou le site du cours. Conditions : licence (généralement en quatre ans), au moins deux ans d'expérience professionnelle pertinente après le premier diplôme, diplôme en principe de moins de six ans.",
      "status": "Ouverte"
    },
    "motif": "Lu sur daad.de le 2026-09-05 : « Applications have only to be sent to the respective course directly! »"
  },
  {
    "collection": "programs",
    "id": "humboldt-universitat-zu-berlin-berlin__daad-epos__master",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date unique : la candidature se dépose DIRECTEMENT auprès de chaque cours EPOS choisi (jusqu'à trois, par ordre de priorité), et chaque cours fixe sa propre date limite — voir la brochure EPOS ou le site du cours. Conditions : licence (généralement en quatre ans), au moins deux ans d'expérience professionnelle pertinente après le premier diplôme, diplôme en principe de moins de six ans.",
      "status": "Ouverte"
    },
    "motif": "Lu sur daad.de le 2026-09-05 : « Applications have only to be sent to the respective course directly! »"
  },
  {
    "collection": "programs",
    "id": "leibniz-universitat-hannover-hannover__daad-epos__doctorat",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date unique : la candidature se dépose DIRECTEMENT auprès de chaque cours EPOS choisi (jusqu'à trois, par ordre de priorité), et chaque cours fixe sa propre date limite — voir la brochure EPOS ou le site du cours. Conditions : licence (généralement en quatre ans), au moins deux ans d'expérience professionnelle pertinente après le premier diplôme, diplôme en principe de moins de six ans.",
      "status": "Ouverte"
    },
    "motif": "Lu sur daad.de le 2026-09-05 : « Applications have only to be sent to the respective course directly! »"
  },
  {
    "collection": "programs",
    "id": "leibniz-universitat-hannover-hannover__daad-epos__master",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date unique : la candidature se dépose DIRECTEMENT auprès de chaque cours EPOS choisi (jusqu'à trois, par ordre de priorité), et chaque cours fixe sa propre date limite — voir la brochure EPOS ou le site du cours. Conditions : licence (généralement en quatre ans), au moins deux ans d'expérience professionnelle pertinente après le premier diplôme, diplôme en principe de moins de six ans.",
      "status": "Ouverte"
    },
    "motif": "Lu sur daad.de le 2026-09-05 : « Applications have only to be sent to the respective course directly! »"
  },
  {
    "collection": "programs",
    "id": "universitat-hamburg-hamburg__daad-epos__doctorat",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date unique : la candidature se dépose DIRECTEMENT auprès de chaque cours EPOS choisi (jusqu'à trois, par ordre de priorité), et chaque cours fixe sa propre date limite — voir la brochure EPOS ou le site du cours. Conditions : licence (généralement en quatre ans), au moins deux ans d'expérience professionnelle pertinente après le premier diplôme, diplôme en principe de moins de six ans.",
      "status": "Ouverte"
    },
    "motif": "Lu sur daad.de le 2026-09-05 : « Applications have only to be sent to the respective course directly! »"
  },
  {
    "collection": "programs",
    "id": "universitat-hamburg-hamburg__daad-epos__master",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date unique : la candidature se dépose DIRECTEMENT auprès de chaque cours EPOS choisi (jusqu'à trois, par ordre de priorité), et chaque cours fixe sa propre date limite — voir la brochure EPOS ou le site du cours. Conditions : licence (généralement en quatre ans), au moins deux ans d'expérience professionnelle pertinente après le premier diplôme, diplôme en principe de moins de six ans.",
      "status": "Ouverte"
    },
    "motif": "Lu sur daad.de le 2026-09-05 : « Applications have only to be sent to the respective course directly! »"
  },
  {
    "collection": "scholarships",
    "id": "daad-epos",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.daad.de/go/en/stipa50076777",
      "periodeOuverture": "propre à chaque cours ; la plupart des dates tombent entre août et octobre pour la rentrée suivante",
      "exigences": [
        "experience_pro_2ans",
        "diplome_recent",
        "candidature_via_etablissement"
      ],
      "echeanceVariable": "etablissement"
    },
    "motif": "Lu sur daad.de le 2026-09-05 : « Applications have only to be sent to the respective course directly! »"
  },
  {
    "collection": "programs",
    "id": "humboldt-universitat-zu-berlin-berlin__heinrich-boell-stiftung__doctorat",
    "attendu": {},
    "champs": {
      "deadline": "Clôture le 1er mars 2027 pour le semestre de printemps 2027 (portail ouvert à partir de la mi-janvier), puis clôture le 1er septembre 2027 pour l'automne 2027 (portail ouvert à partir de la mi-juillet). Deux fenêtres par an. Pour les candidats internationaux : premier diplôme obtenu à l'étranger (master) ou diplôme supérieur (doctorat) ; priorité aux ressortissants des pays de la liste CAD qui ne résident pas encore en Allemagne au moment de la candidature.",
      "status": "Fermée — prochaine fenêtre du 15 janvier au 1er mars 2027"
    },
    "motif": "Lu sur boell.de le 2026-09-05. Statut « Fermée » + date future = « pas encore ouverte, clôture annoncée le 1er mars 2027 »."
  },
  {
    "collection": "programs",
    "id": "humboldt-universitat-zu-berlin-berlin__heinrich-boell-stiftung__master",
    "attendu": {},
    "champs": {
      "deadline": "Clôture le 1er mars 2027 pour le semestre de printemps 2027 (portail ouvert à partir de la mi-janvier), puis clôture le 1er septembre 2027 pour l'automne 2027 (portail ouvert à partir de la mi-juillet). Deux fenêtres par an. Pour les candidats internationaux : premier diplôme obtenu à l'étranger (master) ou diplôme supérieur (doctorat) ; priorité aux ressortissants des pays de la liste CAD qui ne résident pas encore en Allemagne au moment de la candidature.",
      "status": "Fermée — prochaine fenêtre du 15 janvier au 1er mars 2027"
    },
    "motif": "Lu sur boell.de le 2026-09-05. Statut « Fermée » + date future = « pas encore ouverte, clôture annoncée le 1er mars 2027 »."
  },
  {
    "collection": "programs",
    "id": "leibniz-universitat-hannover-hannover__heinrich-boell-stiftung__doctorat",
    "attendu": {},
    "champs": {
      "deadline": "Clôture le 1er mars 2027 pour le semestre de printemps 2027 (portail ouvert à partir de la mi-janvier), puis clôture le 1er septembre 2027 pour l'automne 2027 (portail ouvert à partir de la mi-juillet). Deux fenêtres par an. Pour les candidats internationaux : premier diplôme obtenu à l'étranger (master) ou diplôme supérieur (doctorat) ; priorité aux ressortissants des pays de la liste CAD qui ne résident pas encore en Allemagne au moment de la candidature.",
      "status": "Fermée — prochaine fenêtre du 15 janvier au 1er mars 2027"
    },
    "motif": "Lu sur boell.de le 2026-09-05. Statut « Fermée » + date future = « pas encore ouverte, clôture annoncée le 1er mars 2027 »."
  },
  {
    "collection": "programs",
    "id": "leibniz-universitat-hannover-hannover__heinrich-boell-stiftung__master",
    "attendu": {},
    "champs": {
      "deadline": "Clôture le 1er mars 2027 pour le semestre de printemps 2027 (portail ouvert à partir de la mi-janvier), puis clôture le 1er septembre 2027 pour l'automne 2027 (portail ouvert à partir de la mi-juillet). Deux fenêtres par an. Pour les candidats internationaux : premier diplôme obtenu à l'étranger (master) ou diplôme supérieur (doctorat) ; priorité aux ressortissants des pays de la liste CAD qui ne résident pas encore en Allemagne au moment de la candidature.",
      "status": "Fermée — prochaine fenêtre du 15 janvier au 1er mars 2027"
    },
    "motif": "Lu sur boell.de le 2026-09-05. Statut « Fermée » + date future = « pas encore ouverte, clôture annoncée le 1er mars 2027 »."
  },
  {
    "collection": "programs",
    "id": "universitat-hamburg-hamburg__heinrich-boell-stiftung__doctorat",
    "attendu": {},
    "champs": {
      "deadline": "Clôture le 1er mars 2027 pour le semestre de printemps 2027 (portail ouvert à partir de la mi-janvier), puis clôture le 1er septembre 2027 pour l'automne 2027 (portail ouvert à partir de la mi-juillet). Deux fenêtres par an. Pour les candidats internationaux : premier diplôme obtenu à l'étranger (master) ou diplôme supérieur (doctorat) ; priorité aux ressortissants des pays de la liste CAD qui ne résident pas encore en Allemagne au moment de la candidature.",
      "status": "Fermée — prochaine fenêtre du 15 janvier au 1er mars 2027"
    },
    "motif": "Lu sur boell.de le 2026-09-05. Statut « Fermée » + date future = « pas encore ouverte, clôture annoncée le 1er mars 2027 »."
  },
  {
    "collection": "programs",
    "id": "universitat-hamburg-hamburg__heinrich-boell-stiftung__master",
    "attendu": {},
    "champs": {
      "deadline": "Clôture le 1er mars 2027 pour le semestre de printemps 2027 (portail ouvert à partir de la mi-janvier), puis clôture le 1er septembre 2027 pour l'automne 2027 (portail ouvert à partir de la mi-juillet). Deux fenêtres par an. Pour les candidats internationaux : premier diplôme obtenu à l'étranger (master) ou diplôme supérieur (doctorat) ; priorité aux ressortissants des pays de la liste CAD qui ne résident pas encore en Allemagne au moment de la candidature.",
      "status": "Fermée — prochaine fenêtre du 15 janvier au 1er mars 2027"
    },
    "motif": "Lu sur boell.de le 2026-09-05. Statut « Fermée » + date future = « pas encore ouverte, clôture annoncée le 1er mars 2027 »."
  },
  {
    "collection": "scholarships",
    "id": "heinrich-boell-stiftung",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.boell.de/en/scholarships",
      "periodeOuverture": "deux fenêtres par an : 15 janvier – 1er mars et 15 juillet – 1er septembre",
      "exigences": [],
      "status": "Fermée — prochaine fenêtre du 15 janvier au 1er mars 2027"
    },
    "motif": "Lu sur boell.de le 2026-09-05. Statut « Fermée » + date future = « pas encore ouverte, clôture annoncée le 1er mars 2027 ».",
    "attendu": {
      "status": "Ouverte"
    }
  },
  {
    "collection": "programs",
    "id": "humboldt-universitat-zu-berlin-berlin__konrad-adenauer-stiftung__doctorat",
    "attendu": {},
    "champs": {
      "deadline": "15 juillet 2027 à 12h00 (heure d'Europe centrale) — la date est la même chaque année pour la procédure de sélection. Niveaux : licence à partir du 2e semestre, master (programme de quatre semestres), doctorat (admission définitive dans une université allemande exigée). Allemand niveau B2 minimum (certificat Goethe par exemple). Aucune limite d'âge.",
      "status": "Ouverte"
    },
    "motif": "Lu sur kas.de le 2026-09-05."
  },
  {
    "collection": "programs",
    "id": "humboldt-universitat-zu-berlin-berlin__konrad-adenauer-stiftung__licence",
    "attendu": {},
    "champs": {
      "deadline": "15 juillet 2027 à 12h00 (heure d'Europe centrale) — la date est la même chaque année pour la procédure de sélection. Niveaux : licence à partir du 2e semestre, master (programme de quatre semestres), doctorat (admission définitive dans une université allemande exigée). Allemand niveau B2 minimum (certificat Goethe par exemple). Aucune limite d'âge.",
      "status": "Ouverte"
    },
    "motif": "Lu sur kas.de le 2026-09-05."
  },
  {
    "collection": "programs",
    "id": "humboldt-universitat-zu-berlin-berlin__konrad-adenauer-stiftung__master",
    "attendu": {},
    "champs": {
      "deadline": "15 juillet 2027 à 12h00 (heure d'Europe centrale) — la date est la même chaque année pour la procédure de sélection. Niveaux : licence à partir du 2e semestre, master (programme de quatre semestres), doctorat (admission définitive dans une université allemande exigée). Allemand niveau B2 minimum (certificat Goethe par exemple). Aucune limite d'âge.",
      "status": "Ouverte"
    },
    "motif": "Lu sur kas.de le 2026-09-05."
  },
  {
    "collection": "programs",
    "id": "leibniz-universitat-hannover-hannover__konrad-adenauer-stiftung__doctorat",
    "attendu": {},
    "champs": {
      "deadline": "15 juillet 2027 à 12h00 (heure d'Europe centrale) — la date est la même chaque année pour la procédure de sélection. Niveaux : licence à partir du 2e semestre, master (programme de quatre semestres), doctorat (admission définitive dans une université allemande exigée). Allemand niveau B2 minimum (certificat Goethe par exemple). Aucune limite d'âge.",
      "status": "Ouverte"
    },
    "motif": "Lu sur kas.de le 2026-09-05."
  },
  {
    "collection": "programs",
    "id": "leibniz-universitat-hannover-hannover__konrad-adenauer-stiftung__licence",
    "attendu": {},
    "champs": {
      "deadline": "15 juillet 2027 à 12h00 (heure d'Europe centrale) — la date est la même chaque année pour la procédure de sélection. Niveaux : licence à partir du 2e semestre, master (programme de quatre semestres), doctorat (admission définitive dans une université allemande exigée). Allemand niveau B2 minimum (certificat Goethe par exemple). Aucune limite d'âge.",
      "status": "Ouverte"
    },
    "motif": "Lu sur kas.de le 2026-09-05."
  },
  {
    "collection": "programs",
    "id": "leibniz-universitat-hannover-hannover__konrad-adenauer-stiftung__master",
    "attendu": {},
    "champs": {
      "deadline": "15 juillet 2027 à 12h00 (heure d'Europe centrale) — la date est la même chaque année pour la procédure de sélection. Niveaux : licence à partir du 2e semestre, master (programme de quatre semestres), doctorat (admission définitive dans une université allemande exigée). Allemand niveau B2 minimum (certificat Goethe par exemple). Aucune limite d'âge.",
      "status": "Ouverte"
    },
    "motif": "Lu sur kas.de le 2026-09-05."
  },
  {
    "collection": "programs",
    "id": "universitat-hamburg-hamburg__konrad-adenauer-stiftung__doctorat",
    "attendu": {},
    "champs": {
      "deadline": "15 juillet 2027 à 12h00 (heure d'Europe centrale) — la date est la même chaque année pour la procédure de sélection. Niveaux : licence à partir du 2e semestre, master (programme de quatre semestres), doctorat (admission définitive dans une université allemande exigée). Allemand niveau B2 minimum (certificat Goethe par exemple). Aucune limite d'âge.",
      "status": "Ouverte"
    },
    "motif": "Lu sur kas.de le 2026-09-05."
  },
  {
    "collection": "programs",
    "id": "universitat-hamburg-hamburg__konrad-adenauer-stiftung__licence",
    "attendu": {},
    "champs": {
      "deadline": "15 juillet 2027 à 12h00 (heure d'Europe centrale) — la date est la même chaque année pour la procédure de sélection. Niveaux : licence à partir du 2e semestre, master (programme de quatre semestres), doctorat (admission définitive dans une université allemande exigée). Allemand niveau B2 minimum (certificat Goethe par exemple). Aucune limite d'âge.",
      "status": "Ouverte"
    },
    "motif": "Lu sur kas.de le 2026-09-05."
  },
  {
    "collection": "programs",
    "id": "universitat-hamburg-hamburg__konrad-adenauer-stiftung__master",
    "attendu": {},
    "champs": {
      "deadline": "15 juillet 2027 à 12h00 (heure d'Europe centrale) — la date est la même chaque année pour la procédure de sélection. Niveaux : licence à partir du 2e semestre, master (programme de quatre semestres), doctorat (admission définitive dans une université allemande exigée). Allemand niveau B2 minimum (certificat Goethe par exemple). Aucune limite d'âge.",
      "status": "Ouverte"
    },
    "motif": "Lu sur kas.de le 2026-09-05."
  },
  {
    "collection": "scholarships",
    "id": "konrad-adenauer-stiftung",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.kas.de/en/web/begabtenfoerderung-und-kultur/auslaenderfoerderung",
      "periodeOuverture": "appel annuel, clôture le 15 juillet à midi",
      "exigences": [
        "admission_prealable",
        "certification_langue_requise"
      ],
      "status": "Ouverte"
    },
    "motif": "Lu sur kas.de le 2026-09-05.",
    "attendu": {
      "status": "Fermée"
    }
  },
  {
    "collection": "programs",
    "id": "humboldt-universitat-zu-berlin-berlin__daad-helmut-schmidt-programme__master",
    "attendu": {},
    "champs": {
      "deadline": "La page de présentation ne publie ni date ni conditions détaillées : elle renvoie à l'appel à candidatures en cours. Le programme s'adresse aux jeunes diplômés sans expérience comme aux professionnels en milieu de carrière, ressortissants de pays en développement ou émergents.",
      "status": "Fermée"
    },
    "motif": "Lu sur daad.de le 2026-09-05 ; la date est sur l'appel, non lu. Remise à Charles."
  },
  {
    "collection": "programs",
    "id": "universitat-hamburg-hamburg__daad-helmut-schmidt-programme__master",
    "attendu": {},
    "champs": {
      "deadline": "La page de présentation ne publie ni date ni conditions détaillées : elle renvoie à l'appel à candidatures en cours. Le programme s'adresse aux jeunes diplômés sans expérience comme aux professionnels en milieu de carrière, ressortissants de pays en développement ou émergents.",
      "status": "Fermée"
    },
    "motif": "Lu sur daad.de le 2026-09-05 ; la date est sur l'appel, non lu. Remise à Charles."
  },
  {
    "collection": "scholarships",
    "id": "daad-helmut-schmidt-programme",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.daad.de/en/studying-in-germany/scholarships/daad-funding-programmes/helmut-schmidt-programme/",
      "periodeOuverture": "appel annuel (dates dans l'appel en cours)",
      "exigences": []
    },
    "motif": "Lu sur daad.de le 2026-09-05 ; la date est sur l'appel, non lu. Remise à Charles."
  },
  {
    "collection": "scholarships",
    "id": "vanier-canada-graduate-scholarship",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://vanier.gc.ca/en/home-accueil.html",
      "periodeOuverture": "programme remplacé — voir la Bourse d'études supérieures du Canada au doctorat",
      "exigences": [
        "nomination_par_ecole"
      ],
      "deadline": "Le site officiel annonce que les demandes de Bourses Vanier ne sont plus acceptées : le programme est remplacé par la « Canada Graduate Research Scholarship – Doctoral ». La nomination passait obligatoirement par une université canadienne disposant d'un quota. Se reporter au nouveau programme."
    },
    "motif": "Lu sur vanier.gc.ca le 2026-09-05 : « nous n'acceptons plus les demandes pour les Bourses Vanier ». Charles décidera s'il faut retirer la fiche ou la remplacer par le nouveau programme."
  },
  {
    "collection": "programs",
    "id": "universite-de-liege-liege__bourse-master-in-wbi",
    "attendu": {
      "deadline": "Cycle 2026-2027 clos le 31 mars 2026 — prochaine échéance (cycle 2027-2028) estimée fin mars 2027, appel habituellement ouvert dès l'automne précédent, date officielle non encore annoncée",
      "status": "Prochaine échéance non encore annoncée"
    },
    "champs": {
      "deadline": "Clôture le 31 mars 2026 à minuit (heure de Bruxelles) pour l'année 2026-2027 ; l'appel 2027-2028 est attendu sur le même calendrier. Il faut être ADMIS dans le master avant de demander la bourse, avec un diplôme étranger obtenu au plus tard cinq ans avant le début de la formation. Pays prioritaires : Brésil, Canada, Chili, Colombie, Corée du Sud, Japon, Liban, Maroc, Mexique, Royaume-Uni, Suisse, Taïwan, Tunisie, États-Unis. Exclus : les étudiants déjà inscrits en Belgique et les anciens boursiers ARES.",
      "status": "Fermée — appel 2026-2027 clos le 31 mars, prochain appel attendu début 2027"
    },
    "motif": "Lu sur studyinbelgium.be le 2026-09-05. La liste des pays prioritaires ne comprend qu'un pays d'Afrique subsaharienne sur quatorze — à savoir avant de la proposer."
  },
  {
    "collection": "programs",
    "id": "universite-de-namur-namur__bourse-master-in-wbi",
    "attendu": {
      "deadline": "Cycle 2026-2027 clos le 31 mars 2026 — prochaine échéance (cycle 2027-2028) estimée fin mars 2027, appel habituellement ouvert dès l'automne précédent, date officielle non encore annoncée",
      "status": "Prochaine échéance non encore annoncée"
    },
    "champs": {
      "deadline": "Clôture le 31 mars 2026 à minuit (heure de Bruxelles) pour l'année 2026-2027 ; l'appel 2027-2028 est attendu sur le même calendrier. Il faut être ADMIS dans le master avant de demander la bourse, avec un diplôme étranger obtenu au plus tard cinq ans avant le début de la formation. Pays prioritaires : Brésil, Canada, Chili, Colombie, Corée du Sud, Japon, Liban, Maroc, Mexique, Royaume-Uni, Suisse, Taïwan, Tunisie, États-Unis. Exclus : les étudiants déjà inscrits en Belgique et les anciens boursiers ARES.",
      "status": "Fermée — appel 2026-2027 clos le 31 mars, prochain appel attendu début 2027"
    },
    "motif": "Lu sur studyinbelgium.be le 2026-09-05. La liste des pays prioritaires ne comprend qu'un pays d'Afrique subsaharienne sur quatorze — à savoir avant de la proposer."
  },
  {
    "collection": "programs",
    "id": "universite-libre-de-bruxelles-bruxelles__bourse-master-in-wbi",
    "attendu": {
      "deadline": "Cycle 2026-2027 clos le 31 mars 2026 — prochaine échéance (cycle 2027-2028) estimée fin mars 2027, appel habituellement ouvert dès l'automne précédent, date officielle non encore annoncée",
      "status": "Prochaine échéance non encore annoncée"
    },
    "champs": {
      "deadline": "Clôture le 31 mars 2026 à minuit (heure de Bruxelles) pour l'année 2026-2027 ; l'appel 2027-2028 est attendu sur le même calendrier. Il faut être ADMIS dans le master avant de demander la bourse, avec un diplôme étranger obtenu au plus tard cinq ans avant le début de la formation. Pays prioritaires : Brésil, Canada, Chili, Colombie, Corée du Sud, Japon, Liban, Maroc, Mexique, Royaume-Uni, Suisse, Taïwan, Tunisie, États-Unis. Exclus : les étudiants déjà inscrits en Belgique et les anciens boursiers ARES.",
      "status": "Fermée — appel 2026-2027 clos le 31 mars, prochain appel attendu début 2027"
    },
    "motif": "Lu sur studyinbelgium.be le 2026-09-05. La liste des pays prioritaires ne comprend qu'un pays d'Afrique subsaharienne sur quatorze — à savoir avant de la proposer."
  },
  {
    "collection": "scholarships",
    "id": "bourse-master-in-wbi",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.studyinbelgium.be/fr/bourse-master-wbi",
      "periodeOuverture": "appel annuel, clôture fin mars pour la rentrée de septembre",
      "exigences": [
        "admission_prealable",
        "diplome_recent"
      ],
      "status": "Fermée — appel 2026-2027 clos le 31 mars, prochain appel attendu début 2027"
    },
    "motif": "Lu sur studyinbelgium.be le 2026-09-05. La liste des pays prioritaires ne comprend qu'un pays d'Afrique subsaharienne sur quatorze — à savoir avant de la proposer.",
    "attendu": {
      "status": "Prochaine échéance non encore annoncée"
    }
  },
  {
    "collection": "programs",
    "id": "ghent-university-gand__icp-connect-scholarships-vlir-uos",
    "attendu": {
      "deadline": "Appel 2026-2027 clos — réouverture 2027-2028 prévue mi-novembre 2026, candidatures habituellement entre novembre 2026 et février 2027 selon le programme"
    },
    "champs": {
      "deadline": "L'appel pour 2027-2028 est attendu à la mi-novembre 2026. La candidature se dépose auprès de chaque programme de master, en cochant la demande de bourse dans le dossier d'admission ; chaque programme fixe sa propre date limite, résultats au plus tard à la mi-mai. 29 pays éligibles en Afrique, Asie et Amérique latine. Âge : 35 ans au plus au 1er janvier de l'année d'admission pour un master initial, 45 ans pour un master avancé ; 19 ans au moins. Préférence aux candidats en poste dans l'enseignement supérieur, l'administration ou la société civile."
    },
    "motif": "Lu sur vliruos.be le 2026-09-05."
  },
  {
    "collection": "programs",
    "id": "ku-leuven-louvain__icp-connect-scholarships-vlir-uos",
    "attendu": {
      "deadline": "Appel 2026-2027 clos — réouverture 2027-2028 prévue mi-novembre 2026, candidatures habituellement entre novembre 2026 et février 2027 selon le programme"
    },
    "champs": {
      "deadline": "L'appel pour 2027-2028 est attendu à la mi-novembre 2026. La candidature se dépose auprès de chaque programme de master, en cochant la demande de bourse dans le dossier d'admission ; chaque programme fixe sa propre date limite, résultats au plus tard à la mi-mai. 29 pays éligibles en Afrique, Asie et Amérique latine. Âge : 35 ans au plus au 1er janvier de l'année d'admission pour un master initial, 45 ans pour un master avancé ; 19 ans au moins. Préférence aux candidats en poste dans l'enseignement supérieur, l'administration ou la société civile."
    },
    "motif": "Lu sur vliruos.be le 2026-09-05."
  },
  {
    "collection": "scholarships",
    "id": "icp-connect-scholarships-vlir-uos",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.vliruos.be/en/scholarships",
      "periodeOuverture": "appel annuel ouvert à la mi-novembre, dates propres à chaque programme, résultats à la mi-mai",
      "exigences": [
        "candidature_via_etablissement",
        "admission_prealable"
      ],
      "echeanceVariable": "etablissement",
      "ageMax": {
        "tous": 45
      },
      "ageMaxNote": "35 ans pour un master initial, 45 ans pour un master avancé, au 1er janvier de l'année d'admission — la limite retenue est la plus haute (vliruos.be, vérifié le 5 septembre 2026)."
    },
    "motif": "Lu sur vliruos.be le 2026-09-05."
  },
  {
    "collection": "programs",
    "id": "korea-university-seoul__global-korea-scholarship",
    "attendu": {
      "deadline": "Cycle 2026 clos — GKS-U (Licence) : prochaine fenêtre estimée septembre-octobre 2026 — GKS-G (Master/Doctorat) : estimée février-avril 2027 — dates officielles 2027 non encore publiées par NIIED",
      "status": "Fermée"
    },
    "champs": {
      "deadline": "Deux appels par an. GKS licence (GKS-U) : appel publié en septembre, dépôt en septembre-octobre auprès de l'ambassade de Corée ou d'une université partenaire, résultats en décembre, moins de 25 ans. GKS master et doctorat (GKS-G) : dépôt en février-mars, résultats en juin, moins de 40 ans. Deux voies dans les deux cas — l'ambassade du pays de résidence (avec sa propre date) ou directement l'université.",
      "status": "Ouverte — appel licence en cours, date propre à chaque ambassade"
    },
    "motif": "Lu sur studyinkorea.go.kr le 2026-09-05. L'appel licence est en cours au moment de la lecture."
  },
  {
    "collection": "programs",
    "id": "yonsei-university-seoul__global-korea-scholarship",
    "attendu": {
      "deadline": "Cycle 2026 clos — GKS-U (Licence) : prochaine fenêtre estimée septembre-octobre 2026 — GKS-G (Master/Doctorat) : estimée février-avril 2027 — dates officielles 2027 non encore publiées par NIIED",
      "status": "Fermée"
    },
    "champs": {
      "deadline": "Deux appels par an. GKS licence (GKS-U) : appel publié en septembre, dépôt en septembre-octobre auprès de l'ambassade de Corée ou d'une université partenaire, résultats en décembre, moins de 25 ans. GKS master et doctorat (GKS-G) : dépôt en février-mars, résultats en juin, moins de 40 ans. Deux voies dans les deux cas — l'ambassade du pays de résidence (avec sa propre date) ou directement l'université.",
      "status": "Ouverte — appel licence en cours, date propre à chaque ambassade"
    },
    "motif": "Lu sur studyinkorea.go.kr le 2026-09-05. L'appel licence est en cours au moment de la lecture."
  },
  {
    "collection": "scholarships",
    "id": "global-korea-scholarship",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.studyinkorea.go.kr/en/plan/scholarship.do?tab=gks-tab1",
      "periodeOuverture": "licence : septembre-octobre ; master et doctorat : février-mars",
      "exigences": [
        "candidature_via_ambassade"
      ],
      "echeanceVariable": "pays",
      "ageMax": {
        "tous": 40
      },
      "ageMaxNote": "moins de 25 ans pour la licence, moins de 40 ans pour master et doctorat — la limite retenue est la plus haute (studyinkorea.go.kr, vérifié le 5 septembre 2026).",
      "isActive": true
    },
    "motif": "Lu sur studyinkorea.go.kr le 2026-09-05. L'appel licence est en cours au moment de la lecture.",
    "attendu": {
      "isActive": false
    }
  },
  {
    "collection": "programs",
    "id": "kaist-daejeon__kaist-scholarship",
    "attendu": {
      "deadline": "Trois sessions par an (Spring, Fall Early, Fall Regular) — dates non publiées de façon accessible, se référer au calendrier d'admission"
    },
    "champs": {
      "deadline": "Aucun dossier séparé : le candidat international qui coche la bourse KAIST comme source de financement dans sa candidature d'admission est automatiquement considéré, l'attribution dépendant ensuite du dossier et de l'avis du département. Trois sessions d'admission par an (Spring, Fall Early, Fall Regular) ; les dates précises sont sur le calendrier d'admission de KAIST."
    },
    "motif": "Lu sur admission.kaist.ac.kr le 2026-09-05."
  },
  {
    "collection": "scholarships",
    "id": "kaist-scholarship",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://admission.kaist.ac.kr/intl-graduate/FinancialSupport/Scholarship",
      "periodeOuverture": "suit les trois sessions d'admission de KAIST",
      "exigences": [
        "admission_prealable"
      ]
    },
    "motif": "Lu sur admission.kaist.ac.kr le 2026-09-05."
  },
  {
    "collection": "programs",
    "id": "king-abdulaziz-university-jeddah__king-abdulaziz-scholarship",
    "attendu": {
      "deadline": "Fermée, réouverture annuelle non datée"
    },
    "champs": {
      "deadline": "Clôture le 6 octobre 2026 pour le second semestre 2026 ; la fenêtre de dépôt ouvre le 16 septembre 2026. La demande de bourse se fait sur la plateforme Study in Saudi Arabia, à travers la candidature d'admission auprès de l'université choisie. Trois formules : bourse intégrale, bourse partielle, études autofinancées. Aucune condition d'âge ou de niveau n'est publiée sur la page d'accueil."
    },
    "motif": "Lu sur studyinsaudi.sa le 2026-09-05. Statut « Fermée » + date future = « pas encore ouverte, clôture annoncée le 6 octobre 2026 »."
  },
  {
    "collection": "programs",
    "id": "king-saud-university-riyad__king-abdulaziz-scholarship",
    "attendu": {
      "deadline": "Cycle 2026 clos (candidatures 24 mars – 15 mai 2026 via la plateforme Study in Saudi) — prochaine fenêtre estimée mars-mai 2027, date officielle non encore annoncée"
    },
    "champs": {
      "deadline": "Clôture le 6 octobre 2026 pour le second semestre 2026 ; la fenêtre de dépôt ouvre le 16 septembre 2026. La demande de bourse se fait sur la plateforme Study in Saudi Arabia, à travers la candidature d'admission auprès de l'université choisie. Trois formules : bourse intégrale, bourse partielle, études autofinancées. Aucune condition d'âge ou de niveau n'est publiée sur la page d'accueil."
    },
    "motif": "Lu sur studyinsaudi.sa le 2026-09-05. Statut « Fermée » + date future = « pas encore ouverte, clôture annoncée le 6 octobre 2026 »."
  },
  {
    "collection": "programs",
    "id": "princess-nourah-university-riyad__king-abdulaziz-scholarship",
    "attendu": {
      "deadline": "Fermée, réouverture annuelle non datée"
    },
    "champs": {
      "deadline": "Clôture le 6 octobre 2026 pour le second semestre 2026 ; la fenêtre de dépôt ouvre le 16 septembre 2026. La demande de bourse se fait sur la plateforme Study in Saudi Arabia, à travers la candidature d'admission auprès de l'université choisie. Trois formules : bourse intégrale, bourse partielle, études autofinancées. Aucune condition d'âge ou de niveau n'est publiée sur la page d'accueil."
    },
    "motif": "Lu sur studyinsaudi.sa le 2026-09-05. Statut « Fermée » + date future = « pas encore ouverte, clôture annoncée le 6 octobre 2026 »."
  },
  {
    "collection": "scholarships",
    "id": "king-abdulaziz-scholarship",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://studyinsaudi.sa/en",
      "periodeOuverture": "deux fenêtres par an sur la plateforme Study in Saudi Arabia (celle de l'automne : mi-septembre à début octobre)",
      "exigences": [
        "admission_prealable"
      ],
      "isActive": true
    },
    "motif": "Lu sur studyinsaudi.sa le 2026-09-05. Statut « Fermée » + date future = « pas encore ouverte, clôture annoncée le 6 octobre 2026 ».",
    "attendu": {
      "isActive": false
    }
  },
  {
    "collection": "programs",
    "id": "korea-university-seoul__ku-global-leader-scholarship",
    "attendu": {
      "deadline": "Indexée sur les sessions d'admission de la Graduate School"
    },
    "champs": {
      "deadline": "Aucun dossier séparé : la bourse est évaluée automatiquement avec la demande d'admission au Graduate School de Korea University (« admission evaluation and scholarship award evaluation will be conducted automatically and simultaneously »). La date qui compte est celle de l'admission du semestre visé."
    },
    "motif": "Page lue le 5 sept 2026 : GPA ≥ 3.57/4.0 (ou 90/100), TOEFL iBT ≥ 90 / IELTS ≥ 7.0 / TOPIK 6, recommandation du département automatique ; couvre 100 % des frais + 500 000 KRW/mois pendant 4 mois."
  },
  {
    "collection": "scholarships",
    "id": "ku-global-leader-scholarship",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://graduate2.korea.ac.kr/scholarship/scholarships.html",
      "periodeOuverture": "Suit le calendrier d'admission de la Korea University Graduate School (deux rentrées par an, mars et septembre).",
      "exigences": [
        "admission_prealable",
        "certification_langue_requise"
      ]
    },
    "motif": "Page lue le 5 sept 2026 : GPA ≥ 3.57/4.0 (ou 90/100), TOEFL iBT ≥ 90 / IELTS ≥ 7.0 / TOPIK 6, recommandation du département automatique ; couvre 100 % des frais + 500 000 KRW/mois pendant 4 mois."
  },
  {
    "collection": "programs",
    "id": "seoul-national-university-seoul__snu-global-scholarship",
    "attendu": {
      "deadline": "Indexée sur le calendrier d'admission de la SNU — la demande se fait à la réception de l'admission"
    },
    "champs": {
      "deadline": "Aucune date propre : la bourse se demande APRÈS l'admission (« Upon receiving admissions from SNU »). La date qui compte est celle de l'admission en master ou doctorat à SNU."
    },
    "motif": "Page lue le 5 sept 2026 : environ 160 bénéficiaires, couvre frais, vie, billet, logement selon situation."
  },
  {
    "collection": "scholarships",
    "id": "snu-global-scholarship",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://en.snu.ac.kr/admission/graduate/scholarships/after_admission",
      "periodeOuverture": "Après admission, à chaque rentrée (mars et septembre).",
      "exigences": [
        "admission_prealable"
      ]
    },
    "motif": "Page lue le 5 sept 2026 : environ 160 bénéficiaires, couvre frais, vie, billet, logement selon situation."
  },
  {
    "collection": "programs",
    "id": "seoul-national-university-seoul__snu-glo-harmony-scholarship",
    "attendu": {
      "deadline": "Deux fenêtres par an, en janvier et en juillet — celle de juillet 2026 est close, la suivante s'ouvre en janvier 2027",
      "status": "Fermée"
    },
    "champs": {
      "deadline": "Candidatures en janvier et en juillet de chaque année, après admission à SNU (« Application periods: January and July »). Réservée aux ressortissants des pays de la liste CAD de l'OCDE. Pas de jour précis publié : vérifier auprès du bureau international de SNU.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : sélection en trois étapes (SNU → présélection → entretiens Samsung Dream Scholarship Foundation) ; 4 semestres master, 6 semestres doctorat."
  },
  {
    "collection": "scholarships",
    "id": "snu-glo-harmony-scholarship",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://en.snu.ac.kr/admission/graduate/scholarships/after_admission",
      "periodeOuverture": "Deux fenêtres par an : janvier et juillet, après admission.",
      "exigences": [
        "admission_prealable"
      ]
    },
    "motif": "Page lue le 5 sept 2026 : sélection en trois étapes (SNU → présélection → entretiens Samsung Dream Scholarship Foundation) ; 4 semestres master, 6 semestres doctorat."
  },
  {
    "collection": "programs",
    "id": "korea-national-university-of-arts-seoul__ama-plus-scholarship",
    "attendu": {
      "deadline": "Rythme constaté : candidature fin mars, résultats fin avril, test de coréen début mai, entretiens en juin, arrivée fin août"
    },
    "champs": {
      "deadline": "La page officielle affiche encore le calendrier 2024 (« March 21 ~ 31, 2024: Online Application Submission ») : l'appel se tient chaque année vers la fin mars pour une rentrée en septembre de l'année suivante, après un an de coréen. Le calendrier 2027 n'est pas encore publié."
    },
    "motif": "Page lue le 5 sept 2026 : réservée aux ressortissants des pays de la liste CAD de l'OCDE ; TOPIK exigé ; portfolio selon département ; page non mise à jour depuis 2024 → date exacte à confirmer par Charles."
  },
  {
    "collection": "scholarships",
    "id": "ama-plus-scholarship",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.karts.ac.kr/en/karts/ama.do",
      "periodeOuverture": "Appel annuel fin mars (calendrier 2024 : 21-31 mars) ; rentrée en septembre suivant avec formation de coréen préalable.",
      "exigences": [
        "certification_langue_requise"
      ]
    },
    "motif": "Page lue le 5 sept 2026 : réservée aux ressortissants des pays de la liste CAD de l'OCDE ; TOPIK exigé ; portfolio selon département ; page non mise à jour depuis 2024 → date exacte à confirmer par Charles."
  },
  {
    "collection": "programs",
    "id": "postech-pohang__postech-gift-scholarship",
    "attendu": {
      "deadline": "Deuxième session 2026-27 : 6 juillet au 11 septembre 2026 à 18h00 KST, résultats le 19 novembre 2026"
    },
    "champs": {
      "deadline": "Clôture le 11 septembre 2026 à 18h00 (heure de Corée) pour la seconde session (rentrée printemps 2027) ; résultats le 19 novembre 2026. La première session (rentrée automne 2026) s'est achevée le 3 avril 2026. La bourse GIFT est attribuée avec l'admission, sans dossier séparé."
    },
    "motif": "Guide d'admission 2026/27 lu le 5 sept 2026 : « July 6, 2026 ~ September 11, 2026 (18:00) », TOEFL iBT ≥ 79 / IELTS ≥ 6.0 sauf diplômés d'universités anglophones ; aucune limite d'âge."
  },
  {
    "collection": "scholarships",
    "id": "postech-gift-scholarship",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://gift.postech.ac.kr/file/2026_27_Admissions_guide_for_international%20students_GIFT.pdf",
      "periodeOuverture": "Deux sessions par an : février-début avril (rentrée automne) et juillet-mi-septembre (rentrée printemps).",
      "exigences": [
        "admission_prealable",
        "certification_langue_requise"
      ]
    },
    "motif": "Guide d'admission 2026/27 lu le 5 sept 2026 : « July 6, 2026 ~ September 11, 2026 (18:00) », TOEFL iBT ≥ 79 / IELTS ≥ 6.0 sauf diplômés d'universités anglophones ; aucune limite d'âge."
  },
  {
    "collection": "programs",
    "id": "leibniz-universitat-hannover-hannover__landesstipendium-niedersachsen",
    "attendu": {
      "deadline": "Candidatures du 12 octobre au 1er novembre 2026",
      "status": "Ouverte"
    },
    "champs": {
      "deadline": "Clôture le 1er novembre 2026 ; les candidatures ouvrent le 12 octobre 2026 sur le portail en ligne de la Leibniz Universität Hannover. ATTENTION : bourse en cours d'études (500 € versés une fois) réservée aux étudiants déjà inscrits à Hanovre, pas une bourse d'entrée.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « Die Bewerbungsperiode … beginnt am 12. Oktober 2026 und endet am 01. November 2026 » ; statut Fermée + date future → « pas encore ouverte »."
  },
  {
    "collection": "scholarships",
    "id": "landesstipendium-niedersachsen",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.uni-hannover.de/studium/finanzierung-foerderung/niedersachsenstipendium",
      "periodeOuverture": "Fenêtre annuelle mi-octobre → début novembre.",
      "exigences": [
        "admission_prealable"
      ],
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « Die Bewerbungsperiode … beginnt am 12. Oktober 2026 und endet am 01. November 2026 » ; statut Fermée + date future → « pas encore ouverte ».",
    "attendu": {
      "status": "Ouverte"
    }
  },
  {
    "collection": "programs",
    "id": "aix-marseille-universite-marseille__france-excellence-major__licence",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date nationale publiée : le candidat est présélectionné par le proviseur de son lycée français à l'étranger pendant l'année de terminale, puis la commission AEFE se réunit chaque année courant mai. Réservée aux élèves non français scolarisés en terminale dans un lycée français homologué, avec mention très bien au bac.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « La commission de sélection … est organisée par l'AEFE chaque année, courant mai » ; environ 200 boursiers par an."
  },
  {
    "collection": "programs",
    "id": "aix-marseille-universite-marseille__france-excellence-major__master",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date nationale publiée : le candidat est présélectionné par le proviseur de son lycée français à l'étranger pendant l'année de terminale, puis la commission AEFE se réunit chaque année courant mai. Réservée aux élèves non français scolarisés en terminale dans un lycée français homologué, avec mention très bien au bac.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « La commission de sélection … est organisée par l'AEFE chaque année, courant mai » ; environ 200 boursiers par an."
  },
  {
    "collection": "programs",
    "id": "insa-lyon-villeurbanne__france-excellence-major__licence",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date nationale publiée : le candidat est présélectionné par le proviseur de son lycée français à l'étranger pendant l'année de terminale, puis la commission AEFE se réunit chaque année courant mai. Réservée aux élèves non français scolarisés en terminale dans un lycée français homologué, avec mention très bien au bac.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « La commission de sélection … est organisée par l'AEFE chaque année, courant mai » ; environ 200 boursiers par an."
  },
  {
    "collection": "programs",
    "id": "insa-lyon-villeurbanne__france-excellence-major__master",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date nationale publiée : le candidat est présélectionné par le proviseur de son lycée français à l'étranger pendant l'année de terminale, puis la commission AEFE se réunit chaque année courant mai. Réservée aux élèves non français scolarisés en terminale dans un lycée français homologué, avec mention très bien au bac.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « La commission de sélection … est organisée par l'AEFE chaque année, courant mai » ; environ 200 boursiers par an."
  },
  {
    "collection": "programs",
    "id": "nantes-universite-nantes__france-excellence-major__licence",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date nationale publiée : le candidat est présélectionné par le proviseur de son lycée français à l'étranger pendant l'année de terminale, puis la commission AEFE se réunit chaque année courant mai. Réservée aux élèves non français scolarisés en terminale dans un lycée français homologué, avec mention très bien au bac.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « La commission de sélection … est organisée par l'AEFE chaque année, courant mai » ; environ 200 boursiers par an."
  },
  {
    "collection": "programs",
    "id": "nantes-universite-nantes__france-excellence-major__master",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date nationale publiée : le candidat est présélectionné par le proviseur de son lycée français à l'étranger pendant l'année de terminale, puis la commission AEFE se réunit chaque année courant mai. Réservée aux élèves non français scolarisés en terminale dans un lycée français homologué, avec mention très bien au bac.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « La commission de sélection … est organisée par l'AEFE chaque année, courant mai » ; environ 200 boursiers par an."
  },
  {
    "collection": "programs",
    "id": "universite-claude-bernard-lyon-1-villeurbanne__france-excellence-major__licence",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date nationale publiée : le candidat est présélectionné par le proviseur de son lycée français à l'étranger pendant l'année de terminale, puis la commission AEFE se réunit chaque année courant mai. Réservée aux élèves non français scolarisés en terminale dans un lycée français homologué, avec mention très bien au bac.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « La commission de sélection … est organisée par l'AEFE chaque année, courant mai » ; environ 200 boursiers par an."
  },
  {
    "collection": "programs",
    "id": "universite-claude-bernard-lyon-1-villeurbanne__france-excellence-major__master",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date nationale publiée : le candidat est présélectionné par le proviseur de son lycée français à l'étranger pendant l'année de terminale, puis la commission AEFE se réunit chaque année courant mai. Réservée aux élèves non français scolarisés en terminale dans un lycée français homologué, avec mention très bien au bac.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « La commission de sélection … est organisée par l'AEFE chaque année, courant mai » ; environ 200 boursiers par an."
  },
  {
    "collection": "programs",
    "id": "universite-cote-d-azur-nice__france-excellence-major__licence",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date nationale publiée : le candidat est présélectionné par le proviseur de son lycée français à l'étranger pendant l'année de terminale, puis la commission AEFE se réunit chaque année courant mai. Réservée aux élèves non français scolarisés en terminale dans un lycée français homologué, avec mention très bien au bac.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « La commission de sélection … est organisée par l'AEFE chaque année, courant mai » ; environ 200 boursiers par an."
  },
  {
    "collection": "programs",
    "id": "universite-cote-d-azur-nice__france-excellence-major__master",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date nationale publiée : le candidat est présélectionné par le proviseur de son lycée français à l'étranger pendant l'année de terminale, puis la commission AEFE se réunit chaque année courant mai. Réservée aux élèves non français scolarisés en terminale dans un lycée français homologué, avec mention très bien au bac.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « La commission de sélection … est organisée par l'AEFE chaque année, courant mai » ; environ 200 boursiers par an."
  },
  {
    "collection": "programs",
    "id": "universite-de-bordeaux-bordeaux__france-excellence-major__licence",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date nationale publiée : le candidat est présélectionné par le proviseur de son lycée français à l'étranger pendant l'année de terminale, puis la commission AEFE se réunit chaque année courant mai. Réservée aux élèves non français scolarisés en terminale dans un lycée français homologué, avec mention très bien au bac.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « La commission de sélection … est organisée par l'AEFE chaque année, courant mai » ; environ 200 boursiers par an."
  },
  {
    "collection": "programs",
    "id": "universite-de-bordeaux-bordeaux__france-excellence-major__master",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date nationale publiée : le candidat est présélectionné par le proviseur de son lycée français à l'étranger pendant l'année de terminale, puis la commission AEFE se réunit chaque année courant mai. Réservée aux élèves non français scolarisés en terminale dans un lycée français homologué, avec mention très bien au bac.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « La commission de sélection … est organisée par l'AEFE chaque année, courant mai » ; environ 200 boursiers par an."
  },
  {
    "collection": "programs",
    "id": "universite-de-lille-lille__france-excellence-major__licence",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date nationale publiée : le candidat est présélectionné par le proviseur de son lycée français à l'étranger pendant l'année de terminale, puis la commission AEFE se réunit chaque année courant mai. Réservée aux élèves non français scolarisés en terminale dans un lycée français homologué, avec mention très bien au bac.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « La commission de sélection … est organisée par l'AEFE chaque année, courant mai » ; environ 200 boursiers par an."
  },
  {
    "collection": "programs",
    "id": "universite-de-lille-lille__france-excellence-major__master",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date nationale publiée : le candidat est présélectionné par le proviseur de son lycée français à l'étranger pendant l'année de terminale, puis la commission AEFE se réunit chaque année courant mai. Réservée aux élèves non français scolarisés en terminale dans un lycée français homologué, avec mention très bien au bac.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « La commission de sélection … est organisée par l'AEFE chaque année, courant mai » ; environ 200 boursiers par an."
  },
  {
    "collection": "programs",
    "id": "universite-de-lorraine-nancy__france-excellence-major__licence",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date nationale publiée : le candidat est présélectionné par le proviseur de son lycée français à l'étranger pendant l'année de terminale, puis la commission AEFE se réunit chaque année courant mai. Réservée aux élèves non français scolarisés en terminale dans un lycée français homologué, avec mention très bien au bac.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « La commission de sélection … est organisée par l'AEFE chaque année, courant mai » ; environ 200 boursiers par an."
  },
  {
    "collection": "programs",
    "id": "universite-de-lorraine-nancy__france-excellence-major__master",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date nationale publiée : le candidat est présélectionné par le proviseur de son lycée français à l'étranger pendant l'année de terminale, puis la commission AEFE se réunit chaque année courant mai. Réservée aux élèves non français scolarisés en terminale dans un lycée français homologué, avec mention très bien au bac.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « La commission de sélection … est organisée par l'AEFE chaque année, courant mai » ; environ 200 boursiers par an."
  },
  {
    "collection": "programs",
    "id": "universite-de-montpellier-montpellier__france-excellence-major__licence",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date nationale publiée : le candidat est présélectionné par le proviseur de son lycée français à l'étranger pendant l'année de terminale, puis la commission AEFE se réunit chaque année courant mai. Réservée aux élèves non français scolarisés en terminale dans un lycée français homologué, avec mention très bien au bac.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « La commission de sélection … est organisée par l'AEFE chaque année, courant mai » ; environ 200 boursiers par an."
  },
  {
    "collection": "programs",
    "id": "universite-de-montpellier-montpellier__france-excellence-major__master",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date nationale publiée : le candidat est présélectionné par le proviseur de son lycée français à l'étranger pendant l'année de terminale, puis la commission AEFE se réunit chaque année courant mai. Réservée aux élèves non français scolarisés en terminale dans un lycée français homologué, avec mention très bien au bac.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « La commission de sélection … est organisée par l'AEFE chaque année, courant mai » ; environ 200 boursiers par an."
  },
  {
    "collection": "programs",
    "id": "universite-de-rennes-rennes__france-excellence-major__licence",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date nationale publiée : le candidat est présélectionné par le proviseur de son lycée français à l'étranger pendant l'année de terminale, puis la commission AEFE se réunit chaque année courant mai. Réservée aux élèves non français scolarisés en terminale dans un lycée français homologué, avec mention très bien au bac.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « La commission de sélection … est organisée par l'AEFE chaque année, courant mai » ; environ 200 boursiers par an."
  },
  {
    "collection": "programs",
    "id": "universite-de-rennes-rennes__france-excellence-major__master",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date nationale publiée : le candidat est présélectionné par le proviseur de son lycée français à l'étranger pendant l'année de terminale, puis la commission AEFE se réunit chaque année courant mai. Réservée aux élèves non français scolarisés en terminale dans un lycée français homologué, avec mention très bien au bac.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « La commission de sélection … est organisée par l'AEFE chaque année, courant mai » ; environ 200 boursiers par an."
  },
  {
    "collection": "programs",
    "id": "universite-de-strasbourg-strasbourg__france-excellence-major__licence",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date nationale publiée : le candidat est présélectionné par le proviseur de son lycée français à l'étranger pendant l'année de terminale, puis la commission AEFE se réunit chaque année courant mai. Réservée aux élèves non français scolarisés en terminale dans un lycée français homologué, avec mention très bien au bac.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « La commission de sélection … est organisée par l'AEFE chaque année, courant mai » ; environ 200 boursiers par an."
  },
  {
    "collection": "programs",
    "id": "universite-de-strasbourg-strasbourg__france-excellence-major__master",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date nationale publiée : le candidat est présélectionné par le proviseur de son lycée français à l'étranger pendant l'année de terminale, puis la commission AEFE se réunit chaque année courant mai. Réservée aux élèves non français scolarisés en terminale dans un lycée français homologué, avec mention très bien au bac.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « La commission de sélection … est organisée par l'AEFE chaque année, courant mai » ; environ 200 boursiers par an."
  },
  {
    "collection": "programs",
    "id": "universite-de-toulouse-toulouse__france-excellence-major__licence",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date nationale publiée : le candidat est présélectionné par le proviseur de son lycée français à l'étranger pendant l'année de terminale, puis la commission AEFE se réunit chaque année courant mai. Réservée aux élèves non français scolarisés en terminale dans un lycée français homologué, avec mention très bien au bac.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « La commission de sélection … est organisée par l'AEFE chaque année, courant mai » ; environ 200 boursiers par an."
  },
  {
    "collection": "programs",
    "id": "universite-de-toulouse-toulouse__france-excellence-major__master",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date nationale publiée : le candidat est présélectionné par le proviseur de son lycée français à l'étranger pendant l'année de terminale, puis la commission AEFE se réunit chaque année courant mai. Réservée aux élèves non français scolarisés en terminale dans un lycée français homologué, avec mention très bien au bac.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « La commission de sélection … est organisée par l'AEFE chaque année, courant mai » ; environ 200 boursiers par an."
  },
  {
    "collection": "programs",
    "id": "universite-grenoble-alpes-grenoble__france-excellence-major__licence",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date nationale publiée : le candidat est présélectionné par le proviseur de son lycée français à l'étranger pendant l'année de terminale, puis la commission AEFE se réunit chaque année courant mai. Réservée aux élèves non français scolarisés en terminale dans un lycée français homologué, avec mention très bien au bac.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « La commission de sélection … est organisée par l'AEFE chaque année, courant mai » ; environ 200 boursiers par an."
  },
  {
    "collection": "programs",
    "id": "universite-grenoble-alpes-grenoble__france-excellence-major__master",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date nationale publiée : le candidat est présélectionné par le proviseur de son lycée français à l'étranger pendant l'année de terminale, puis la commission AEFE se réunit chaque année courant mai. Réservée aux élèves non français scolarisés en terminale dans un lycée français homologué, avec mention très bien au bac.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « La commission de sélection … est organisée par l'AEFE chaque année, courant mai » ; environ 200 boursiers par an."
  },
  {
    "collection": "programs",
    "id": "universite-paris-1-pantheon-sorbonne-paris__france-excellence-major__licence",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date nationale publiée : le candidat est présélectionné par le proviseur de son lycée français à l'étranger pendant l'année de terminale, puis la commission AEFE se réunit chaque année courant mai. Réservée aux élèves non français scolarisés en terminale dans un lycée français homologué, avec mention très bien au bac.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « La commission de sélection … est organisée par l'AEFE chaque année, courant mai » ; environ 200 boursiers par an."
  },
  {
    "collection": "programs",
    "id": "universite-paris-1-pantheon-sorbonne-paris__france-excellence-major__master",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date nationale publiée : le candidat est présélectionné par le proviseur de son lycée français à l'étranger pendant l'année de terminale, puis la commission AEFE se réunit chaque année courant mai. Réservée aux élèves non français scolarisés en terminale dans un lycée français homologué, avec mention très bien au bac.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « La commission de sélection … est organisée par l'AEFE chaque année, courant mai » ; environ 200 boursiers par an."
  },
  {
    "collection": "programs",
    "id": "universite-paris-cite-paris__france-excellence-major__licence",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date nationale publiée : le candidat est présélectionné par le proviseur de son lycée français à l'étranger pendant l'année de terminale, puis la commission AEFE se réunit chaque année courant mai. Réservée aux élèves non français scolarisés en terminale dans un lycée français homologué, avec mention très bien au bac.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « La commission de sélection … est organisée par l'AEFE chaque année, courant mai » ; environ 200 boursiers par an."
  },
  {
    "collection": "programs",
    "id": "universite-paris-cite-paris__france-excellence-major__master",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date nationale publiée : le candidat est présélectionné par le proviseur de son lycée français à l'étranger pendant l'année de terminale, puis la commission AEFE se réunit chaque année courant mai. Réservée aux élèves non français scolarisés en terminale dans un lycée français homologué, avec mention très bien au bac.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « La commission de sélection … est organisée par l'AEFE chaque année, courant mai » ; environ 200 boursiers par an."
  },
  {
    "collection": "programs",
    "id": "universite-paris-dauphine-psl-paris__france-excellence-major__licence",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date nationale publiée : le candidat est présélectionné par le proviseur de son lycée français à l'étranger pendant l'année de terminale, puis la commission AEFE se réunit chaque année courant mai. Réservée aux élèves non français scolarisés en terminale dans un lycée français homologué, avec mention très bien au bac.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « La commission de sélection … est organisée par l'AEFE chaque année, courant mai » ; environ 200 boursiers par an."
  },
  {
    "collection": "programs",
    "id": "universite-paris-dauphine-psl-paris__france-excellence-major__master",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date nationale publiée : le candidat est présélectionné par le proviseur de son lycée français à l'étranger pendant l'année de terminale, puis la commission AEFE se réunit chaque année courant mai. Réservée aux élèves non français scolarisés en terminale dans un lycée français homologué, avec mention très bien au bac.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « La commission de sélection … est organisée par l'AEFE chaque année, courant mai » ; environ 200 boursiers par an."
  },
  {
    "collection": "programs",
    "id": "universite-paris-saclay-orsay__france-excellence-major__licence",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date nationale publiée : le candidat est présélectionné par le proviseur de son lycée français à l'étranger pendant l'année de terminale, puis la commission AEFE se réunit chaque année courant mai. Réservée aux élèves non français scolarisés en terminale dans un lycée français homologué, avec mention très bien au bac.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « La commission de sélection … est organisée par l'AEFE chaque année, courant mai » ; environ 200 boursiers par an."
  },
  {
    "collection": "programs",
    "id": "universite-paris-saclay-orsay__france-excellence-major__master",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date nationale publiée : le candidat est présélectionné par le proviseur de son lycée français à l'étranger pendant l'année de terminale, puis la commission AEFE se réunit chaque année courant mai. Réservée aux élèves non français scolarisés en terminale dans un lycée français homologué, avec mention très bien au bac.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « La commission de sélection … est organisée par l'AEFE chaque année, courant mai » ; environ 200 boursiers par an."
  },
  {
    "collection": "programs",
    "id": "universite-sorbonne-paris-nord-villetaneuse__france-excellence-major__licence",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date nationale publiée : le candidat est présélectionné par le proviseur de son lycée français à l'étranger pendant l'année de terminale, puis la commission AEFE se réunit chaque année courant mai. Réservée aux élèves non français scolarisés en terminale dans un lycée français homologué, avec mention très bien au bac.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « La commission de sélection … est organisée par l'AEFE chaque année, courant mai » ; environ 200 boursiers par an."
  },
  {
    "collection": "programs",
    "id": "universite-sorbonne-paris-nord-villetaneuse__france-excellence-major__master",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date nationale publiée : le candidat est présélectionné par le proviseur de son lycée français à l'étranger pendant l'année de terminale, puis la commission AEFE se réunit chaque année courant mai. Réservée aux élèves non français scolarisés en terminale dans un lycée français homologué, avec mention très bien au bac.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « La commission de sélection … est organisée par l'AEFE chaque année, courant mai » ; environ 200 boursiers par an."
  },
  {
    "collection": "scholarships",
    "id": "france-excellence-major",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://aefe.gouv.fr/fr/enseignement-francais/poursuite-des-etudes-dans-le-superieur/devenir-boursier-france-excellence-major",
      "periodeOuverture": "Présélection au lycée pendant l'année de terminale (hiver), commission AEFE en mai.",
      "exigences": [
        "nomination_par_ecole"
      ]
    },
    "motif": "Page lue le 5 sept 2026 : « La commission de sélection … est organisée par l'AEFE chaque année, courant mai » ; environ 200 boursiers par an."
  },
  {
    "collection": "programs",
    "id": "ecole-normale-superieure-psl-paris__ens-psl-selection-internationale__licence",
    "attendu": {},
    "champs": {
      "deadline": "La page officielle affiche encore la session 2026 : clôture le 3 décembre 2025 à midi (Paris) pour Arts et humanités, et le 15 décembre 2025 à midi pour Sciences, ouvertures le 1er et le 16 octobre 2025. La session 2027 devrait ouvrir début octobre 2026 avec une clôture début-mi-décembre 2026 ; à recouper sur la page officielle sur la page.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : calendrier 2026 uniquement ; bourse 1 000 €/mois pendant 3 ans + chambre ; au moins un an d'études supérieures à l'étranger ; séjour en France limité (10 mois A&H, 6 mois Sciences)."
  },
  {
    "collection": "programs",
    "id": "ecole-normale-superieure-psl-paris__ens-psl-selection-internationale__master",
    "attendu": {},
    "champs": {
      "deadline": "La page officielle affiche encore la session 2026 : clôture le 3 décembre 2025 à midi (Paris) pour Arts et humanités, et le 15 décembre 2025 à midi pour Sciences, ouvertures le 1er et le 16 octobre 2025. La session 2027 devrait ouvrir début octobre 2026 avec une clôture début-mi-décembre 2026 ; à recouper sur la page officielle sur la page.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : calendrier 2026 uniquement ; bourse 1 000 €/mois pendant 3 ans + chambre ; au moins un an d'études supérieures à l'étranger ; séjour en France limité (10 mois A&H, 6 mois Sciences)."
  },
  {
    "collection": "scholarships",
    "id": "ens-psl-selection-internationale",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.ens.psl.eu/en/une-formation-d-exception/admissions/international/international-selection",
      "periodeOuverture": "Ouverture début-mi-octobre, clôture début-mi-décembre, épreuves février-mars.",
      "exigences": [
        "diplome_recent"
      ]
    },
    "motif": "Page lue le 5 sept 2026 : calendrier 2026 uniquement ; bourse 1 000 €/mois pendant 3 ans + chambre ; au moins un an d'études supérieures à l'étranger ; séjour en France limité (10 mois A&H, 6 mois Sciences)."
  },
  {
    "collection": "programs",
    "id": "ecole-normale-superieure-de-lyon-lyon__ens-lyon-ampere-scholarships__master",
    "attendu": {},
    "champs": {
      "deadline": "La page officielle affiche encore la campagne 2026 : clôture le 23 janvier 2026 à 23h59 (CET), ouverture le 14 novembre 2025, résultats mi-mars. La campagne 2027 devrait ouvrir mi-novembre 2026 ; à recouper sur la page officielle.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : 1 000 €/mois pendant 12 mois ; L3 (180 ECTS) pour M1, M1 (240 ECTS) pour M2."
  },
  {
    "collection": "scholarships",
    "id": "ens-lyon-ampere-scholarships",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.ens-lyon.fr/en/studies/admissions/application-masters-degrees-and-scholarships",
      "periodeOuverture": "Ouverture mi-novembre, clôture fin janvier, résultats mi-mars.",
      "exigences": []
    },
    "motif": "Page lue le 5 sept 2026 : 1 000 €/mois pendant 12 mois ; L3 (180 ECTS) pour M1, M1 (240 ECTS) pour M2."
  },
  {
    "collection": "programs",
    "id": "aix-marseille-universite-marseille__programme-bourses-france-senegal__doctorat",
    "attendu": {},
    "champs": {
      "deadline": "L'appel 2026 est fermé depuis le 4 février 2026 à 17h00 (GMT). Le prochain appel devrait être lancé en octobre 2026 pour une clôture en février 2027 (calendrier habituel : lancement octobre, clôture février, résultats mai-juin).",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « L'appel à candidatures 2026 est fermé depuis le 4 février 2026 à 17:00 (GMT) » ; réservé aux Sénégalais (master en France + bourses de recherche 4 mois)."
  },
  {
    "collection": "programs",
    "id": "aix-marseille-universite-marseille__programme-bourses-france-senegal__master",
    "attendu": {},
    "champs": {
      "deadline": "L'appel 2026 est fermé depuis le 4 février 2026 à 17h00 (GMT). Le prochain appel devrait être lancé en octobre 2026 pour une clôture en février 2027 (calendrier habituel : lancement octobre, clôture février, résultats mai-juin).",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « L'appel à candidatures 2026 est fermé depuis le 4 février 2026 à 17:00 (GMT) » ; réservé aux Sénégalais (master en France + bourses de recherche 4 mois)."
  },
  {
    "collection": "programs",
    "id": "insa-lyon-villeurbanne__programme-bourses-france-senegal__doctorat",
    "attendu": {},
    "champs": {
      "deadline": "L'appel 2026 est fermé depuis le 4 février 2026 à 17h00 (GMT). Le prochain appel devrait être lancé en octobre 2026 pour une clôture en février 2027 (calendrier habituel : lancement octobre, clôture février, résultats mai-juin).",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « L'appel à candidatures 2026 est fermé depuis le 4 février 2026 à 17:00 (GMT) » ; réservé aux Sénégalais (master en France + bourses de recherche 4 mois)."
  },
  {
    "collection": "programs",
    "id": "insa-lyon-villeurbanne__programme-bourses-france-senegal__master",
    "attendu": {},
    "champs": {
      "deadline": "L'appel 2026 est fermé depuis le 4 février 2026 à 17h00 (GMT). Le prochain appel devrait être lancé en octobre 2026 pour une clôture en février 2027 (calendrier habituel : lancement octobre, clôture février, résultats mai-juin).",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « L'appel à candidatures 2026 est fermé depuis le 4 février 2026 à 17:00 (GMT) » ; réservé aux Sénégalais (master en France + bourses de recherche 4 mois)."
  },
  {
    "collection": "programs",
    "id": "mines-paris-psl-paris__programme-bourses-france-senegal__doctorat",
    "attendu": {},
    "champs": {
      "deadline": "L'appel 2026 est fermé depuis le 4 février 2026 à 17h00 (GMT). Le prochain appel devrait être lancé en octobre 2026 pour une clôture en février 2027 (calendrier habituel : lancement octobre, clôture février, résultats mai-juin).",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « L'appel à candidatures 2026 est fermé depuis le 4 février 2026 à 17:00 (GMT) » ; réservé aux Sénégalais (master en France + bourses de recherche 4 mois)."
  },
  {
    "collection": "programs",
    "id": "mines-paris-psl-paris__programme-bourses-france-senegal__master",
    "attendu": {},
    "champs": {
      "deadline": "L'appel 2026 est fermé depuis le 4 février 2026 à 17h00 (GMT). Le prochain appel devrait être lancé en octobre 2026 pour une clôture en février 2027 (calendrier habituel : lancement octobre, clôture février, résultats mai-juin).",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « L'appel à candidatures 2026 est fermé depuis le 4 février 2026 à 17:00 (GMT) » ; réservé aux Sénégalais (master en France + bourses de recherche 4 mois)."
  },
  {
    "collection": "programs",
    "id": "nantes-universite-nantes__programme-bourses-france-senegal__doctorat",
    "attendu": {},
    "champs": {
      "deadline": "L'appel 2026 est fermé depuis le 4 février 2026 à 17h00 (GMT). Le prochain appel devrait être lancé en octobre 2026 pour une clôture en février 2027 (calendrier habituel : lancement octobre, clôture février, résultats mai-juin).",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « L'appel à candidatures 2026 est fermé depuis le 4 février 2026 à 17:00 (GMT) » ; réservé aux Sénégalais (master en France + bourses de recherche 4 mois)."
  },
  {
    "collection": "programs",
    "id": "nantes-universite-nantes__programme-bourses-france-senegal__master",
    "attendu": {},
    "champs": {
      "deadline": "L'appel 2026 est fermé depuis le 4 février 2026 à 17h00 (GMT). Le prochain appel devrait être lancé en octobre 2026 pour une clôture en février 2027 (calendrier habituel : lancement octobre, clôture février, résultats mai-juin).",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « L'appel à candidatures 2026 est fermé depuis le 4 février 2026 à 17:00 (GMT) » ; réservé aux Sénégalais (master en France + bourses de recherche 4 mois)."
  },
  {
    "collection": "programs",
    "id": "universite-claude-bernard-lyon-1-villeurbanne__programme-bourses-france-senegal__doctorat",
    "attendu": {},
    "champs": {
      "deadline": "L'appel 2026 est fermé depuis le 4 février 2026 à 17h00 (GMT). Le prochain appel devrait être lancé en octobre 2026 pour une clôture en février 2027 (calendrier habituel : lancement octobre, clôture février, résultats mai-juin).",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « L'appel à candidatures 2026 est fermé depuis le 4 février 2026 à 17:00 (GMT) » ; réservé aux Sénégalais (master en France + bourses de recherche 4 mois)."
  },
  {
    "collection": "programs",
    "id": "universite-claude-bernard-lyon-1-villeurbanne__programme-bourses-france-senegal__master",
    "attendu": {},
    "champs": {
      "deadline": "L'appel 2026 est fermé depuis le 4 février 2026 à 17h00 (GMT). Le prochain appel devrait être lancé en octobre 2026 pour une clôture en février 2027 (calendrier habituel : lancement octobre, clôture février, résultats mai-juin).",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « L'appel à candidatures 2026 est fermé depuis le 4 février 2026 à 17:00 (GMT) » ; réservé aux Sénégalais (master en France + bourses de recherche 4 mois)."
  },
  {
    "collection": "programs",
    "id": "universite-cote-d-azur-nice__programme-bourses-france-senegal__doctorat",
    "attendu": {},
    "champs": {
      "deadline": "L'appel 2026 est fermé depuis le 4 février 2026 à 17h00 (GMT). Le prochain appel devrait être lancé en octobre 2026 pour une clôture en février 2027 (calendrier habituel : lancement octobre, clôture février, résultats mai-juin).",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « L'appel à candidatures 2026 est fermé depuis le 4 février 2026 à 17:00 (GMT) » ; réservé aux Sénégalais (master en France + bourses de recherche 4 mois)."
  },
  {
    "collection": "programs",
    "id": "universite-cote-d-azur-nice__programme-bourses-france-senegal__master",
    "attendu": {},
    "champs": {
      "deadline": "L'appel 2026 est fermé depuis le 4 février 2026 à 17h00 (GMT). Le prochain appel devrait être lancé en octobre 2026 pour une clôture en février 2027 (calendrier habituel : lancement octobre, clôture février, résultats mai-juin).",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « L'appel à candidatures 2026 est fermé depuis le 4 février 2026 à 17:00 (GMT) » ; réservé aux Sénégalais (master en France + bourses de recherche 4 mois)."
  },
  {
    "collection": "programs",
    "id": "universite-de-bordeaux-bordeaux__programme-bourses-france-senegal__doctorat",
    "attendu": {},
    "champs": {
      "deadline": "L'appel 2026 est fermé depuis le 4 février 2026 à 17h00 (GMT). Le prochain appel devrait être lancé en octobre 2026 pour une clôture en février 2027 (calendrier habituel : lancement octobre, clôture février, résultats mai-juin).",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « L'appel à candidatures 2026 est fermé depuis le 4 février 2026 à 17:00 (GMT) » ; réservé aux Sénégalais (master en France + bourses de recherche 4 mois)."
  },
  {
    "collection": "programs",
    "id": "universite-de-bordeaux-bordeaux__programme-bourses-france-senegal__master",
    "attendu": {},
    "champs": {
      "deadline": "L'appel 2026 est fermé depuis le 4 février 2026 à 17h00 (GMT). Le prochain appel devrait être lancé en octobre 2026 pour une clôture en février 2027 (calendrier habituel : lancement octobre, clôture février, résultats mai-juin).",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « L'appel à candidatures 2026 est fermé depuis le 4 février 2026 à 17:00 (GMT) » ; réservé aux Sénégalais (master en France + bourses de recherche 4 mois)."
  },
  {
    "collection": "programs",
    "id": "universite-de-lille-lille__programme-bourses-france-senegal__doctorat",
    "attendu": {},
    "champs": {
      "deadline": "L'appel 2026 est fermé depuis le 4 février 2026 à 17h00 (GMT). Le prochain appel devrait être lancé en octobre 2026 pour une clôture en février 2027 (calendrier habituel : lancement octobre, clôture février, résultats mai-juin).",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « L'appel à candidatures 2026 est fermé depuis le 4 février 2026 à 17:00 (GMT) » ; réservé aux Sénégalais (master en France + bourses de recherche 4 mois)."
  },
  {
    "collection": "programs",
    "id": "universite-de-lille-lille__programme-bourses-france-senegal__master",
    "attendu": {},
    "champs": {
      "deadline": "L'appel 2026 est fermé depuis le 4 février 2026 à 17h00 (GMT). Le prochain appel devrait être lancé en octobre 2026 pour une clôture en février 2027 (calendrier habituel : lancement octobre, clôture février, résultats mai-juin).",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « L'appel à candidatures 2026 est fermé depuis le 4 février 2026 à 17:00 (GMT) » ; réservé aux Sénégalais (master en France + bourses de recherche 4 mois)."
  },
  {
    "collection": "programs",
    "id": "universite-de-lorraine-nancy__programme-bourses-france-senegal__doctorat",
    "attendu": {},
    "champs": {
      "deadline": "L'appel 2026 est fermé depuis le 4 février 2026 à 17h00 (GMT). Le prochain appel devrait être lancé en octobre 2026 pour une clôture en février 2027 (calendrier habituel : lancement octobre, clôture février, résultats mai-juin).",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « L'appel à candidatures 2026 est fermé depuis le 4 février 2026 à 17:00 (GMT) » ; réservé aux Sénégalais (master en France + bourses de recherche 4 mois)."
  },
  {
    "collection": "programs",
    "id": "universite-de-lorraine-nancy__programme-bourses-france-senegal__master",
    "attendu": {},
    "champs": {
      "deadline": "L'appel 2026 est fermé depuis le 4 février 2026 à 17h00 (GMT). Le prochain appel devrait être lancé en octobre 2026 pour une clôture en février 2027 (calendrier habituel : lancement octobre, clôture février, résultats mai-juin).",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « L'appel à candidatures 2026 est fermé depuis le 4 février 2026 à 17:00 (GMT) » ; réservé aux Sénégalais (master en France + bourses de recherche 4 mois)."
  },
  {
    "collection": "programs",
    "id": "universite-de-montpellier-montpellier__programme-bourses-france-senegal__doctorat",
    "attendu": {},
    "champs": {
      "deadline": "L'appel 2026 est fermé depuis le 4 février 2026 à 17h00 (GMT). Le prochain appel devrait être lancé en octobre 2026 pour une clôture en février 2027 (calendrier habituel : lancement octobre, clôture février, résultats mai-juin).",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « L'appel à candidatures 2026 est fermé depuis le 4 février 2026 à 17:00 (GMT) » ; réservé aux Sénégalais (master en France + bourses de recherche 4 mois)."
  },
  {
    "collection": "programs",
    "id": "universite-de-montpellier-montpellier__programme-bourses-france-senegal__master",
    "attendu": {},
    "champs": {
      "deadline": "L'appel 2026 est fermé depuis le 4 février 2026 à 17h00 (GMT). Le prochain appel devrait être lancé en octobre 2026 pour une clôture en février 2027 (calendrier habituel : lancement octobre, clôture février, résultats mai-juin).",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « L'appel à candidatures 2026 est fermé depuis le 4 février 2026 à 17:00 (GMT) » ; réservé aux Sénégalais (master en France + bourses de recherche 4 mois)."
  },
  {
    "collection": "programs",
    "id": "universite-de-rennes-rennes__programme-bourses-france-senegal__doctorat",
    "attendu": {},
    "champs": {
      "deadline": "L'appel 2026 est fermé depuis le 4 février 2026 à 17h00 (GMT). Le prochain appel devrait être lancé en octobre 2026 pour une clôture en février 2027 (calendrier habituel : lancement octobre, clôture février, résultats mai-juin).",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « L'appel à candidatures 2026 est fermé depuis le 4 février 2026 à 17:00 (GMT) » ; réservé aux Sénégalais (master en France + bourses de recherche 4 mois)."
  },
  {
    "collection": "programs",
    "id": "universite-de-rennes-rennes__programme-bourses-france-senegal__master",
    "attendu": {},
    "champs": {
      "deadline": "L'appel 2026 est fermé depuis le 4 février 2026 à 17h00 (GMT). Le prochain appel devrait être lancé en octobre 2026 pour une clôture en février 2027 (calendrier habituel : lancement octobre, clôture février, résultats mai-juin).",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « L'appel à candidatures 2026 est fermé depuis le 4 février 2026 à 17:00 (GMT) » ; réservé aux Sénégalais (master en France + bourses de recherche 4 mois)."
  },
  {
    "collection": "programs",
    "id": "universite-de-strasbourg-strasbourg__programme-bourses-france-senegal__doctorat",
    "attendu": {},
    "champs": {
      "deadline": "L'appel 2026 est fermé depuis le 4 février 2026 à 17h00 (GMT). Le prochain appel devrait être lancé en octobre 2026 pour une clôture en février 2027 (calendrier habituel : lancement octobre, clôture février, résultats mai-juin).",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « L'appel à candidatures 2026 est fermé depuis le 4 février 2026 à 17:00 (GMT) » ; réservé aux Sénégalais (master en France + bourses de recherche 4 mois)."
  },
  {
    "collection": "programs",
    "id": "universite-de-strasbourg-strasbourg__programme-bourses-france-senegal__master",
    "attendu": {},
    "champs": {
      "deadline": "L'appel 2026 est fermé depuis le 4 février 2026 à 17h00 (GMT). Le prochain appel devrait être lancé en octobre 2026 pour une clôture en février 2027 (calendrier habituel : lancement octobre, clôture février, résultats mai-juin).",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « L'appel à candidatures 2026 est fermé depuis le 4 février 2026 à 17:00 (GMT) » ; réservé aux Sénégalais (master en France + bourses de recherche 4 mois)."
  },
  {
    "collection": "programs",
    "id": "universite-de-toulouse-toulouse__programme-bourses-france-senegal__doctorat",
    "attendu": {},
    "champs": {
      "deadline": "L'appel 2026 est fermé depuis le 4 février 2026 à 17h00 (GMT). Le prochain appel devrait être lancé en octobre 2026 pour une clôture en février 2027 (calendrier habituel : lancement octobre, clôture février, résultats mai-juin).",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « L'appel à candidatures 2026 est fermé depuis le 4 février 2026 à 17:00 (GMT) » ; réservé aux Sénégalais (master en France + bourses de recherche 4 mois)."
  },
  {
    "collection": "programs",
    "id": "universite-de-toulouse-toulouse__programme-bourses-france-senegal__master",
    "attendu": {},
    "champs": {
      "deadline": "L'appel 2026 est fermé depuis le 4 février 2026 à 17h00 (GMT). Le prochain appel devrait être lancé en octobre 2026 pour une clôture en février 2027 (calendrier habituel : lancement octobre, clôture février, résultats mai-juin).",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « L'appel à candidatures 2026 est fermé depuis le 4 février 2026 à 17:00 (GMT) » ; réservé aux Sénégalais (master en France + bourses de recherche 4 mois)."
  },
  {
    "collection": "programs",
    "id": "universite-grenoble-alpes-grenoble__programme-bourses-france-senegal__doctorat",
    "attendu": {},
    "champs": {
      "deadline": "L'appel 2026 est fermé depuis le 4 février 2026 à 17h00 (GMT). Le prochain appel devrait être lancé en octobre 2026 pour une clôture en février 2027 (calendrier habituel : lancement octobre, clôture février, résultats mai-juin).",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « L'appel à candidatures 2026 est fermé depuis le 4 février 2026 à 17:00 (GMT) » ; réservé aux Sénégalais (master en France + bourses de recherche 4 mois)."
  },
  {
    "collection": "programs",
    "id": "universite-grenoble-alpes-grenoble__programme-bourses-france-senegal__master",
    "attendu": {},
    "champs": {
      "deadline": "L'appel 2026 est fermé depuis le 4 février 2026 à 17h00 (GMT). Le prochain appel devrait être lancé en octobre 2026 pour une clôture en février 2027 (calendrier habituel : lancement octobre, clôture février, résultats mai-juin).",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « L'appel à candidatures 2026 est fermé depuis le 4 février 2026 à 17:00 (GMT) » ; réservé aux Sénégalais (master en France + bourses de recherche 4 mois)."
  },
  {
    "collection": "programs",
    "id": "universite-paris-1-pantheon-sorbonne-paris__programme-bourses-france-senegal__doctorat",
    "attendu": {},
    "champs": {
      "deadline": "L'appel 2026 est fermé depuis le 4 février 2026 à 17h00 (GMT). Le prochain appel devrait être lancé en octobre 2026 pour une clôture en février 2027 (calendrier habituel : lancement octobre, clôture février, résultats mai-juin).",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « L'appel à candidatures 2026 est fermé depuis le 4 février 2026 à 17:00 (GMT) » ; réservé aux Sénégalais (master en France + bourses de recherche 4 mois)."
  },
  {
    "collection": "programs",
    "id": "universite-paris-1-pantheon-sorbonne-paris__programme-bourses-france-senegal__master",
    "attendu": {},
    "champs": {
      "deadline": "L'appel 2026 est fermé depuis le 4 février 2026 à 17h00 (GMT). Le prochain appel devrait être lancé en octobre 2026 pour une clôture en février 2027 (calendrier habituel : lancement octobre, clôture février, résultats mai-juin).",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « L'appel à candidatures 2026 est fermé depuis le 4 février 2026 à 17:00 (GMT) » ; réservé aux Sénégalais (master en France + bourses de recherche 4 mois)."
  },
  {
    "collection": "programs",
    "id": "universite-paris-cite-paris__programme-bourses-france-senegal__doctorat",
    "attendu": {},
    "champs": {
      "deadline": "L'appel 2026 est fermé depuis le 4 février 2026 à 17h00 (GMT). Le prochain appel devrait être lancé en octobre 2026 pour une clôture en février 2027 (calendrier habituel : lancement octobre, clôture février, résultats mai-juin).",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « L'appel à candidatures 2026 est fermé depuis le 4 février 2026 à 17:00 (GMT) » ; réservé aux Sénégalais (master en France + bourses de recherche 4 mois)."
  },
  {
    "collection": "programs",
    "id": "universite-paris-cite-paris__programme-bourses-france-senegal__master",
    "attendu": {},
    "champs": {
      "deadline": "L'appel 2026 est fermé depuis le 4 février 2026 à 17h00 (GMT). Le prochain appel devrait être lancé en octobre 2026 pour une clôture en février 2027 (calendrier habituel : lancement octobre, clôture février, résultats mai-juin).",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « L'appel à candidatures 2026 est fermé depuis le 4 février 2026 à 17:00 (GMT) » ; réservé aux Sénégalais (master en France + bourses de recherche 4 mois)."
  },
  {
    "collection": "programs",
    "id": "universite-paris-dauphine-psl-paris__programme-bourses-france-senegal__doctorat",
    "attendu": {},
    "champs": {
      "deadline": "L'appel 2026 est fermé depuis le 4 février 2026 à 17h00 (GMT). Le prochain appel devrait être lancé en octobre 2026 pour une clôture en février 2027 (calendrier habituel : lancement octobre, clôture février, résultats mai-juin).",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « L'appel à candidatures 2026 est fermé depuis le 4 février 2026 à 17:00 (GMT) » ; réservé aux Sénégalais (master en France + bourses de recherche 4 mois)."
  },
  {
    "collection": "programs",
    "id": "universite-paris-dauphine-psl-paris__programme-bourses-france-senegal__master",
    "attendu": {},
    "champs": {
      "deadline": "L'appel 2026 est fermé depuis le 4 février 2026 à 17h00 (GMT). Le prochain appel devrait être lancé en octobre 2026 pour une clôture en février 2027 (calendrier habituel : lancement octobre, clôture février, résultats mai-juin).",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « L'appel à candidatures 2026 est fermé depuis le 4 février 2026 à 17:00 (GMT) » ; réservé aux Sénégalais (master en France + bourses de recherche 4 mois)."
  },
  {
    "collection": "programs",
    "id": "universite-paris-saclay-orsay__programme-bourses-france-senegal__doctorat",
    "attendu": {},
    "champs": {
      "deadline": "L'appel 2026 est fermé depuis le 4 février 2026 à 17h00 (GMT). Le prochain appel devrait être lancé en octobre 2026 pour une clôture en février 2027 (calendrier habituel : lancement octobre, clôture février, résultats mai-juin).",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « L'appel à candidatures 2026 est fermé depuis le 4 février 2026 à 17:00 (GMT) » ; réservé aux Sénégalais (master en France + bourses de recherche 4 mois)."
  },
  {
    "collection": "programs",
    "id": "universite-paris-saclay-orsay__programme-bourses-france-senegal__master",
    "attendu": {},
    "champs": {
      "deadline": "L'appel 2026 est fermé depuis le 4 février 2026 à 17h00 (GMT). Le prochain appel devrait être lancé en octobre 2026 pour une clôture en février 2027 (calendrier habituel : lancement octobre, clôture février, résultats mai-juin).",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « L'appel à candidatures 2026 est fermé depuis le 4 février 2026 à 17:00 (GMT) » ; réservé aux Sénégalais (master en France + bourses de recherche 4 mois)."
  },
  {
    "collection": "programs",
    "id": "universite-sorbonne-paris-nord-villetaneuse__programme-bourses-france-senegal__doctorat",
    "attendu": {},
    "champs": {
      "deadline": "L'appel 2026 est fermé depuis le 4 février 2026 à 17h00 (GMT). Le prochain appel devrait être lancé en octobre 2026 pour une clôture en février 2027 (calendrier habituel : lancement octobre, clôture février, résultats mai-juin).",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « L'appel à candidatures 2026 est fermé depuis le 4 février 2026 à 17:00 (GMT) » ; réservé aux Sénégalais (master en France + bourses de recherche 4 mois)."
  },
  {
    "collection": "programs",
    "id": "universite-sorbonne-paris-nord-villetaneuse__programme-bourses-france-senegal__master",
    "attendu": {},
    "champs": {
      "deadline": "L'appel 2026 est fermé depuis le 4 février 2026 à 17h00 (GMT). Le prochain appel devrait être lancé en octobre 2026 pour une clôture en février 2027 (calendrier habituel : lancement octobre, clôture février, résultats mai-juin).",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « L'appel à candidatures 2026 est fermé depuis le 4 février 2026 à 17:00 (GMT) » ; réservé aux Sénégalais (master en France + bourses de recherche 4 mois)."
  },
  {
    "collection": "scholarships",
    "id": "programme-bourses-france-senegal",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://bourses.franceausenegal.com/",
      "periodeOuverture": "Lancement annuel en octobre, clôture en février.",
      "exigences": []
    },
    "motif": "Page lue le 5 sept 2026 : « L'appel à candidatures 2026 est fermé depuis le 4 février 2026 à 17:00 (GMT) » ; réservé aux Sénégalais (master en France + bourses de recherche 4 mois)."
  },
  {
    "collection": "programs",
    "id": "universite-grenoble-alpes-grenoble__uga-idex-master-scholarships__master",
    "attendu": {},
    "champs": {
      "deadline": "L'appel 2026-2027 est terminé (versements en octobre 2026 et février 2027). La page indique que les calendriers de candidature varient selon le master ; l'appel 2027-2028 n'est pas encore publié.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : 9 000 € (M1) / 5 500 € (M2) ; étudiants internationaux inscrits ou diplômés hors de France ; « application calendars vary »."
  },
  {
    "collection": "scholarships",
    "id": "uga-idex-master-scholarships",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.univ-grenoble-alpes.fr/call-for-applications-idex-master-scholarships-2026-2027-academic-year-1545508.kjsp",
      "periodeOuverture": "Appel annuel publié en hiver, calendrier propre à chaque master.",
      "exigences": [
        "admission_prealable"
      ]
    },
    "motif": "Page lue le 5 sept 2026 : 9 000 € (M1) / 5 500 € (M2) ; étudiants internationaux inscrits ou diplômés hors de France ; « application calendars vary »."
  },
  {
    "collection": "programs",
    "id": "universite-paris-cite-paris__smarts-up-universite-paris-cite__master",
    "attendu": {},
    "champs": {
      "deadline": "L'appel 2026-2027 s'est clôturé le 16 janvier 2026 à 12h (midi, CET), après ouverture le 1er décembre 2025. L'appel 2027-2028 devrait ouvrir début décembre 2026 avec une clôture mi-janvier 2027 ; à recouper sur la page officielle.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : 10 000 €/an ; étrangers primo-arrivants dans une université française."
  },
  {
    "collection": "scholarships",
    "id": "smarts-up-universite-paris-cite",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://mobility.smarts-up.fr/",
      "periodeOuverture": "Ouverture début décembre, clôture mi-janvier, résultats début avril.",
      "exigences": []
    },
    "motif": "Page lue le 5 sept 2026 : 10 000 €/an ; étrangers primo-arrivants dans une université française."
  },
  {
    "collection": "programs",
    "id": "universite-paris-saclay-orsay__paris-saclay-international-masters-scholarship__master",
    "attendu": {},
    "champs": {
      "deadline": "La page officielle affiche encore le calendrier 2026 : clôture le 31 mars 2026 à 23h59 pour la candidature à la bourse, après sélection par les coordinateurs de master (25 mars 2026), résultats mi-mai. Le calendrier 2027 n'est pas encore publié ; la campagne suit d'habitude le même rythme (clôture fin mars).",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « Tuesday 31 March 2026, 11:59pm » ; 10 000 €/an + jusqu'à 900 € de voyage."
  },
  {
    "collection": "scholarships",
    "id": "paris-saclay-international-masters-scholarship",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.universite-paris-saclay.fr/en/admission/bourses-et-aides-financieres/international-masters-scholarships-program",
      "periodeOuverture": "Candidature au master en hiver, sélection par les coordinateurs fin mars, résultats mi-mai.",
      "exigences": [
        "admission_prealable"
      ]
    },
    "motif": "Page lue le 5 sept 2026 : « Tuesday 31 March 2026, 11:59pm » ; 10 000 €/an + jusqu'à 900 € de voyage."
  },
  {
    "collection": "programs",
    "id": "american-university-in-cairo-le-caire__auc-african-graduate-fellowship__master",
    "attendu": {},
    "champs": {
      "deadline": "Clôture le 2 novembre 2026 pour le semestre de printemps 2027 (ouverture le 7 octobre 2026). Pour l'automne 2027 : cycle 1 du 22 décembre 2026 au 17 janvier 2027, cycle 2 du 6 avril au 6 mai 2027. Réservée aux ressortissants africains non égyptiens (double nationalité non africaine exclue).",
      "status": "Fermée"
    },
    "motif": "Page fellowships lue le 5 sept 2026 : dates citées ; statut Fermée + date future → « pas encore ouverte »."
  },
  {
    "collection": "scholarships",
    "id": "auc-african-graduate-fellowship",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.aucegypt.edu/admissions/fellowships",
      "periodeOuverture": "Trois fenêtres par an : octobre-novembre (printemps), décembre-janvier et avril-mai (automne).",
      "exigences": [
        "admission_prealable"
      ],
      "status": "Fermée"
    },
    "motif": "Page fellowships lue le 5 sept 2026 : dates citées ; statut Fermée + date future → « pas encore ouverte ».",
    "attendu": {
      "status": "Réouverture du 7 octobre au 2 novembre 2026"
    }
  },
  {
    "collection": "programs",
    "id": "american-university-in-cairo-le-caire__auc-international-graduate-fellowship__master",
    "attendu": {},
    "champs": {
      "deadline": "Clôture le 2 novembre 2026 pour le semestre de printemps 2027 (ouverture le 7 octobre 2026). Pour l'automne 2027 : cycle 1 du 22 décembre 2026 au 17 janvier 2027, cycle 2 du 6 avril au 6 mai 2027. Admission complète au programme de master exigée.",
      "status": "Fermée"
    },
    "motif": "Page fellowships lue le 5 sept 2026 : dates citées ; GPA minimum 3.2 pour conserver la bourse."
  },
  {
    "collection": "scholarships",
    "id": "auc-international-graduate-fellowship",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.aucegypt.edu/admissions/fellowships",
      "periodeOuverture": "Trois fenêtres par an : octobre-novembre (printemps), décembre-janvier et avril-mai (automne).",
      "exigences": [
        "admission_prealable"
      ],
      "status": "Fermée"
    },
    "motif": "Page fellowships lue le 5 sept 2026 : dates citées ; GPA minimum 3.2 pour conserver la bourse.",
    "attendu": {
      "status": "Réouverture du 7 octobre au 2 novembre 2026"
    }
  },
  {
    "collection": "programs",
    "id": "universite-senghor-alexandrie__universite-senghor-master-developpement__master",
    "attendu": {},
    "champs": {
      "deadline": "L'appel 2026 est clôturé depuis le 15 mars 2026 à minuit GMT (épreuve écrite le 29 avril, rentrée le 20 septembre 2026). Le prochain appel devrait suivre le même rythme avec une clôture vers la mi-mars 2027 ; à recouper sur la page officielle.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « avant le 15 mars 2026 minuit GMT », statut « Clôturé » ; 100 bourses de frais de vie, 400 €/an de frais administratifs."
  },
  {
    "collection": "scholarships",
    "id": "universite-senghor-master-developpement",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://usenghor-francophonie.org/actualites/appels/master-1-de-l-universite-senghor",
      "periodeOuverture": "Appel annuel en hiver, clôture mi-mars, écrit fin avril, oral mai.",
      "exigences": []
    },
    "motif": "Page lue le 5 sept 2026 : « avant le 15 mars 2026 minuit GMT », statut « Clôturé » ; 100 bourses de frais de vie, 400 €/an de frais administratifs."
  },
  {
    "collection": "programs",
    "id": "university-of-cape-town-le-cap__mastercard-foundation-scholars-uct",
    "attendu": {
      "deadline": "Appel annuel ouvert chaque mois de mai — date exacte 2027 non encore publiée par l'UCT"
    },
    "champs": {
      "deadline": "Clôture le 30 septembre 2026 pour la licence (undergraduate) et le 31 octobre 2026 pour les cycles postgraduate, pour la rentrée 2027. La candidature à la bourse se fait en parallèle de la demande d'admission à UCT."
    },
    "motif": "Page lue le 5 sept 2026 : appel 2027 ouvert, dates citées ; jeunes Africains, engagement à rentrer servir sa communauté."
  },
  {
    "collection": "scholarships",
    "id": "mastercard-foundation-scholars-uct",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://uct.ac.za/mcfsp",
      "periodeOuverture": "Appel annuel : clôture fin septembre (licence) et fin octobre (postgraduate).",
      "exigences": [
        "admission_prealable"
      ]
    },
    "motif": "Page lue le 5 sept 2026 : appel 2027 ouvert, dates citées ; jeunes Africains, engagement à rentrer servir sa communauté."
  },
  {
    "collection": "programs",
    "id": "universite-abou-bekr-belkaid-tlemcen__bourses-cooperation-algerie__doctorat",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date publiée par le ministère algérien : les bourses de coopération bilatérale (environ 3 000 étudiants internationaux par an, licence, master, doctorat) se demandent auprès de l'autorité nationale ou de l'ambassade d'Algérie du pays du candidat, qui fixe son propre calendrier.",
      "status": "Fermée"
    },
    "motif": "Page MESRS lue le 5 sept 2026 : aucune date, uniquement le guide de l'étudiant international boursier et les textes juridiques."
  },
  {
    "collection": "programs",
    "id": "universite-abou-bekr-belkaid-tlemcen__bourses-cooperation-algerie__licence",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date publiée par le ministère algérien : les bourses de coopération bilatérale (environ 3 000 étudiants internationaux par an, licence, master, doctorat) se demandent auprès de l'autorité nationale ou de l'ambassade d'Algérie du pays du candidat, qui fixe son propre calendrier.",
      "status": "Fermée"
    },
    "motif": "Page MESRS lue le 5 sept 2026 : aucune date, uniquement le guide de l'étudiant international boursier et les textes juridiques."
  },
  {
    "collection": "programs",
    "id": "universite-abou-bekr-belkaid-tlemcen__bourses-cooperation-algerie__master",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date publiée par le ministère algérien : les bourses de coopération bilatérale (environ 3 000 étudiants internationaux par an, licence, master, doctorat) se demandent auprès de l'autorité nationale ou de l'ambassade d'Algérie du pays du candidat, qui fixe son propre calendrier.",
      "status": "Fermée"
    },
    "motif": "Page MESRS lue le 5 sept 2026 : aucune date, uniquement le guide de l'étudiant international boursier et les textes juridiques."
  },
  {
    "collection": "programs",
    "id": "universite-alger-1-benyoucef-benkhedda-alger__bourses-cooperation-algerie__doctorat",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date publiée par le ministère algérien : les bourses de coopération bilatérale (environ 3 000 étudiants internationaux par an, licence, master, doctorat) se demandent auprès de l'autorité nationale ou de l'ambassade d'Algérie du pays du candidat, qui fixe son propre calendrier.",
      "status": "Fermée"
    },
    "motif": "Page MESRS lue le 5 sept 2026 : aucune date, uniquement le guide de l'étudiant international boursier et les textes juridiques."
  },
  {
    "collection": "programs",
    "id": "universite-alger-1-benyoucef-benkhedda-alger__bourses-cooperation-algerie__licence",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date publiée par le ministère algérien : les bourses de coopération bilatérale (environ 3 000 étudiants internationaux par an, licence, master, doctorat) se demandent auprès de l'autorité nationale ou de l'ambassade d'Algérie du pays du candidat, qui fixe son propre calendrier.",
      "status": "Fermée"
    },
    "motif": "Page MESRS lue le 5 sept 2026 : aucune date, uniquement le guide de l'étudiant international boursier et les textes juridiques."
  },
  {
    "collection": "programs",
    "id": "universite-alger-1-benyoucef-benkhedda-alger__bourses-cooperation-algerie__master",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date publiée par le ministère algérien : les bourses de coopération bilatérale (environ 3 000 étudiants internationaux par an, licence, master, doctorat) se demandent auprès de l'autorité nationale ou de l'ambassade d'Algérie du pays du candidat, qui fixe son propre calendrier.",
      "status": "Fermée"
    },
    "motif": "Page MESRS lue le 5 sept 2026 : aucune date, uniquement le guide de l'étudiant international boursier et les textes juridiques."
  },
  {
    "collection": "programs",
    "id": "universite-constantine-1-freres-mentouri-constantine__bourses-cooperation-algerie__doctorat",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date publiée par le ministère algérien : les bourses de coopération bilatérale (environ 3 000 étudiants internationaux par an, licence, master, doctorat) se demandent auprès de l'autorité nationale ou de l'ambassade d'Algérie du pays du candidat, qui fixe son propre calendrier.",
      "status": "Fermée"
    },
    "motif": "Page MESRS lue le 5 sept 2026 : aucune date, uniquement le guide de l'étudiant international boursier et les textes juridiques."
  },
  {
    "collection": "programs",
    "id": "universite-constantine-1-freres-mentouri-constantine__bourses-cooperation-algerie__licence",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date publiée par le ministère algérien : les bourses de coopération bilatérale (environ 3 000 étudiants internationaux par an, licence, master, doctorat) se demandent auprès de l'autorité nationale ou de l'ambassade d'Algérie du pays du candidat, qui fixe son propre calendrier.",
      "status": "Fermée"
    },
    "motif": "Page MESRS lue le 5 sept 2026 : aucune date, uniquement le guide de l'étudiant international boursier et les textes juridiques."
  },
  {
    "collection": "programs",
    "id": "universite-constantine-1-freres-mentouri-constantine__bourses-cooperation-algerie__master",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date publiée par le ministère algérien : les bourses de coopération bilatérale (environ 3 000 étudiants internationaux par an, licence, master, doctorat) se demandent auprès de l'autorité nationale ou de l'ambassade d'Algérie du pays du candidat, qui fixe son propre calendrier.",
      "status": "Fermée"
    },
    "motif": "Page MESRS lue le 5 sept 2026 : aucune date, uniquement le guide de l'étudiant international boursier et les textes juridiques."
  },
  {
    "collection": "programs",
    "id": "universite-oran-1-ahmed-ben-bella-oran__bourses-cooperation-algerie__doctorat",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date publiée par le ministère algérien : les bourses de coopération bilatérale (environ 3 000 étudiants internationaux par an, licence, master, doctorat) se demandent auprès de l'autorité nationale ou de l'ambassade d'Algérie du pays du candidat, qui fixe son propre calendrier.",
      "status": "Fermée"
    },
    "motif": "Page MESRS lue le 5 sept 2026 : aucune date, uniquement le guide de l'étudiant international boursier et les textes juridiques."
  },
  {
    "collection": "programs",
    "id": "universite-oran-1-ahmed-ben-bella-oran__bourses-cooperation-algerie__licence",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date publiée par le ministère algérien : les bourses de coopération bilatérale (environ 3 000 étudiants internationaux par an, licence, master, doctorat) se demandent auprès de l'autorité nationale ou de l'ambassade d'Algérie du pays du candidat, qui fixe son propre calendrier.",
      "status": "Fermée"
    },
    "motif": "Page MESRS lue le 5 sept 2026 : aucune date, uniquement le guide de l'étudiant international boursier et les textes juridiques."
  },
  {
    "collection": "programs",
    "id": "universite-oran-1-ahmed-ben-bella-oran__bourses-cooperation-algerie__master",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date publiée par le ministère algérien : les bourses de coopération bilatérale (environ 3 000 étudiants internationaux par an, licence, master, doctorat) se demandent auprès de l'autorité nationale ou de l'ambassade d'Algérie du pays du candidat, qui fixe son propre calendrier.",
      "status": "Fermée"
    },
    "motif": "Page MESRS lue le 5 sept 2026 : aucune date, uniquement le guide de l'étudiant international boursier et les textes juridiques."
  },
  {
    "collection": "programs",
    "id": "usthb-alger__bourses-cooperation-algerie__doctorat",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date publiée par le ministère algérien : les bourses de coopération bilatérale (environ 3 000 étudiants internationaux par an, licence, master, doctorat) se demandent auprès de l'autorité nationale ou de l'ambassade d'Algérie du pays du candidat, qui fixe son propre calendrier.",
      "status": "Fermée"
    },
    "motif": "Page MESRS lue le 5 sept 2026 : aucune date, uniquement le guide de l'étudiant international boursier et les textes juridiques."
  },
  {
    "collection": "programs",
    "id": "usthb-alger__bourses-cooperation-algerie__licence",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date publiée par le ministère algérien : les bourses de coopération bilatérale (environ 3 000 étudiants internationaux par an, licence, master, doctorat) se demandent auprès de l'autorité nationale ou de l'ambassade d'Algérie du pays du candidat, qui fixe son propre calendrier.",
      "status": "Fermée"
    },
    "motif": "Page MESRS lue le 5 sept 2026 : aucune date, uniquement le guide de l'étudiant international boursier et les textes juridiques."
  },
  {
    "collection": "programs",
    "id": "usthb-alger__bourses-cooperation-algerie__master",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date publiée par le ministère algérien : les bourses de coopération bilatérale (environ 3 000 étudiants internationaux par an, licence, master, doctorat) se demandent auprès de l'autorité nationale ou de l'ambassade d'Algérie du pays du candidat, qui fixe son propre calendrier.",
      "status": "Fermée"
    },
    "motif": "Page MESRS lue le 5 sept 2026 : aucune date, uniquement le guide de l'étudiant international boursier et les textes juridiques."
  },
  {
    "collection": "scholarships",
    "id": "bourses-cooperation-algerie",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.mesrs.dz/index.php/fr/mobilite-entrante-formation-des-etudiants-internationaux",
      "periodeOuverture": "Selon le pays : chaque ambassade d'Algérie publie son propre appel, en général au printemps pour la rentrée de septembre.",
      "exigences": [
        "candidature_via_ambassade"
      ],
      "echeanceVariable": "pays"
    },
    "motif": "Page MESRS lue le 5 sept 2026 : aucune date, uniquement le guide de l'étudiant international boursier et les textes juridiques."
  },
  {
    "collection": "programs",
    "id": "universite-abou-bekr-belkaid-tlemcen__pan-african-university-pauwes__doctorat",
    "attendu": {},
    "champs": {
      "deadline": "Aucun appel d'admission en cours sur la page de PAUWES : l'Université panafricaine lance d'habitude un appel unique pour tous ses instituts (dépôt sur au-pau.org) au premier semestre de l'année, avec des bourses complètes pour les ressortissants des États membres de l'Union africaine.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : conditions d'admission (Upper Second Class pour le master, MSc pour le doctorat) mais aucune date d'appel étudiant ; seuls des appels administratifs 2024-2025."
  },
  {
    "collection": "programs",
    "id": "universite-abou-bekr-belkaid-tlemcen__pan-african-university-pauwes__master",
    "attendu": {},
    "champs": {
      "deadline": "Aucun appel d'admission en cours sur la page de PAUWES : l'Université panafricaine lance d'habitude un appel unique pour tous ses instituts (dépôt sur au-pau.org) au premier semestre de l'année, avec des bourses complètes pour les ressortissants des États membres de l'Union africaine.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : conditions d'admission (Upper Second Class pour le master, MSc pour le doctorat) mais aucune date d'appel étudiant ; seuls des appels administratifs 2024-2025."
  },
  {
    "collection": "scholarships",
    "id": "pan-african-university-pauwes",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://pau-au.africa/institutes/pauwes/",
      "periodeOuverture": "Appel annuel de l'Université panafricaine, généralement entre février et avril.",
      "exigences": []
    },
    "motif": "Page lue le 5 sept 2026 : conditions d'admission (Upper Second Class pour le master, MSc pour le doctorat) mais aucune date d'appel étudiant ; seuls des appels administratifs 2024-2025."
  },
  {
    "collection": "programs",
    "id": "aims-ghana-accra__aims-ghana-masters-mathematical-sciences__master",
    "attendu": {},
    "champs": {
      "deadline": "La page officielle affiche encore la date du 15 mars 2026 pour la promotion 2026-2027. L'appel de la promotion suivante devrait ouvrir à l'automne 2026 avec une clôture vers la mi-mars 2027 ; à recouper sur la page officielle sur apply.aims-network.org.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « Application Deadline: 15th March 2026 », « Full scholarships will be awarded to all accepted students »."
  },
  {
    "collection": "scholarships",
    "id": "aims-ghana-masters-mathematical-sciences",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://aims.edu.gh/application/masters-in-mathematical-sciences-application/",
      "periodeOuverture": "Appel annuel, clôture mi-mars ; bourse complète pour tous les admis.",
      "exigences": []
    },
    "motif": "Page lue le 5 sept 2026 : « Application Deadline: 15th March 2026 », « Full scholarships will be awarded to all accepted students »."
  },
  {
    "collection": "programs",
    "id": "knust-kumasi__mastercard-foundation-scholars-knust__licence",
    "attendu": {},
    "champs": {
      "deadline": "La page officielle affiche encore la date du 30 mai 2025 pour la promotion 2025/2026 ; aucun appel 2026 n'est publié. Le rythme habituel est une clôture fin mai pour la rentrée suivante. Réservé aux candidats à l'admission à KNUST avec un diplôme de fin d'études secondaires de moins de 5 ans.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « 2025 APPLICATION DEADLINE: ON OR BEFORE FRIDAY, 30TH MAY 2025! » — page non mise à jour ; date 2026 à confirmer par Charles."
  },
  {
    "collection": "scholarships",
    "id": "mastercard-foundation-scholars-knust",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://mcf.knust.edu.gh/scholarship-application/",
      "periodeOuverture": "Appel annuel, clôture fin mai ; formulaire papier envoyé au secrétariat MCF de KNUST.",
      "exigences": [
        "diplome_recent"
      ]
    },
    "motif": "Page lue le 5 sept 2026 : « 2025 APPLICATION DEADLINE: ON OR BEFORE FRIDAY, 30TH MAY 2025! » — page non mise à jour ; date 2026 à confirmer par Charles."
  },
  {
    "collection": "programs",
    "id": "ashesi-university-berekuso__ashesi-mastercard-foundation-scholars__licence",
    "attendu": {},
    "champs": {
      "deadline": "Aucune candidature séparée : le bureau des admissions et de l'aide financière d'Ashesi attribue la bourse Mastercard Foundation à partir du dossier général d'aide financière déposé avec la demande d'admission. La date qui compte est celle de l'admission à Ashesi.",
      "status": "Ouverte"
    },
    "motif": "Page lue le 5 sept 2026 : « Based on information in your general scholarship application, the Admissions and Financial Aid Office determines which award … you may receive »."
  },
  {
    "collection": "scholarships",
    "id": "ashesi-mastercard-foundation-scholars",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://ashesi.edu.gh/the-mastercard-foundation-scholars-programme/",
      "periodeOuverture": "Suit le calendrier d'admission d'Ashesi (dossier d'aide financière joint à la candidature).",
      "exigences": [
        "admission_prealable"
      ],
      "status": "Ouverte"
    },
    "motif": "Page lue le 5 sept 2026 : « Based on information in your general scholarship application, the Admissions and Financial Aid Office determines which award … you may receive ».",
    "attendu": {
      "status": "Rounds d'admission en juin, août, octobre et décembre — aucun millésime publié"
    }
  },
  {
    "collection": "programs",
    "id": "corvinus-university-of-budapest-budapest__corvinus-scholarship",
    "attendu": {
      "deadline": "Cycle rentrée 2026 clos le 13 août 2026 — prochain cycle attendu en novembre 2026",
      "status": "Fermée"
    },
    "champs": {
      "deadline": "Aucune date fixe : la bourse (partielle, jusqu'au montant des frais du semestre) est attribuée par appels internes annoncés par le vice-recteur aux étudiants déjà admis en formation payante. Les boursiers Stipendium Hungaricum ne sont pas éligibles.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « Students may receive (partial) scholarships through open calls for applications … announced by the Vice-Rector for Education »."
  },
  {
    "collection": "scholarships",
    "id": "corvinus-scholarship",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.uni-corvinus.hu/main-page/life-at-corvinus/scholarship/corvinus-scholarship-2/?lang=en",
      "periodeOuverture": "Appels internes annoncés après admission, chaque semestre.",
      "exigences": [
        "admission_prealable"
      ]
    },
    "motif": "Page lue le 5 sept 2026 : « Students may receive (partial) scholarships through open calls for applications … announced by the Vice-Rector for Education »."
  },
  {
    "collection": "programs",
    "id": "university-of-debrecen-debrecen__fao-hungarian-government-scholarship",
    "attendu": {
      "deadline": "Cycle 2026/27 clos le 28 février 2026 — prochain appel attendu janvier 2027"
    },
    "champs": {
      "deadline": "L'appel 2026-2027 s'est clôturé le 28 février 2026 (candidatures par courriel du 21 janvier au 28 février 2026). L'appel 2027-2028 devrait ouvrir fin janvier 2027 ; réservé aux ressortissants résidant dans 43 pays éligibles (dont Algérie, Égypte, Éthiopie, Kenya…), âge de préférence inférieur à 30 ans."
    },
    "motif": "Page lue le 5 sept 2026 : « Applications should be submitted via email from 21 January to 28 February 2026 »."
  },
  {
    "collection": "scholarships",
    "id": "fao-hungarian-government-scholarship",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.fao.org/europe/events/detail/fao-hungarian-government-scholarship-programme-2026-2027/en",
      "periodeOuverture": "Appel annuel de fin janvier à fin février.",
      "exigences": [],
      "ageMax": {
        "tous": 30
      },
      "ageMaxNote": "Âge inférieur à 30 ans « de préférence » (critère de sélection, pas d'exclusion stricte)."
    },
    "motif": "Page lue le 5 sept 2026 : « Applications should be submitted via email from 21 January to 28 February 2026 »."
  },
  {
    "collection": "programs",
    "id": "university-of-szeged-szeged__szte-start-scholarship",
    "attendu": {
      "deadline": "Cycle 2026/27 clos le 30 avril 2026 — prochain cycle attendu début 2027"
    },
    "champs": {
      "deadline": "La page officielle affiche encore la campagne 2026/2027 : dossier complet sur DreamApply avant le 30 avril 2026, statut « Place reserved » avant le 30 juin 2026, inscription en personne avant le 5 septembre 2026. La campagne 2027/2028 devrait suivre le même rythme (clôture fin avril 2027) ; à recouper sur la page officielle."
    },
    "motif": "Page lue le 5 sept 2026 : 900 € pour environ 12 étudiants, CV d'une page + une lettre de recommandation."
  },
  {
    "collection": "scholarships",
    "id": "szte-start-scholarship",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://u-szeged.hu/prospective-students/szte-start-scholarship/szte-start-scholarship",
      "periodeOuverture": "Clôture fin avril pour la rentrée de septembre.",
      "exigences": [
        "admission_prealable",
        "lettres_recommandation"
      ]
    },
    "motif": "Page lue le 5 sept 2026 : 900 € pour environ 12 étudiants, CV d'une page + une lettre de recommandation."
  },
  {
    "collection": "programs",
    "id": "university-of-debrecen-debrecen__ud-international-scholarship",
    "attendu": {
      "deadline": "Cycle 2026/27 clos le 15 juin 2026 — prochain cycle attendu janvier 2027"
    },
    "champs": {
      "deadline": "La page affiche encore la campagne 2026 : candidatures depuis le 16 janvier 2026, sans date limite propre (« no designated deadline … until the scholarship budget and program seat capacities allow »), mais dans la limite de la date d'admission de l'université, le 15 juin 2026. La campagne 2027 devrait ouvrir mi-janvier 2027 ; à recouper sur la page officielle."
    },
    "motif": "Page lue le 5 sept 2026 : réduction de frais jusqu'à 30 % (médecine, dentaire) ou 90 % (autres), domaines STEM et santé, plus de 120 pays éligibles, candidat non encore inscrit en Hongrie."
  },
  {
    "collection": "scholarships",
    "id": "ud-international-scholarship",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://edu.unideb.hu/p/ud-international-scholarship",
      "periodeOuverture": "Ouverture mi-janvier, au fil de l'eau jusqu'à la date limite d'admission (mi-juin).",
      "exigences": [
        "admission_prealable"
      ]
    },
    "motif": "Page lue le 5 sept 2026 : réduction de frais jusqu'à 30 % (médecine, dentaire) ou 90 % (autres), domaines STEM et santé, plus de 120 pays éligibles, candidat non encore inscrit en Hongrie."
  },
  {
    "collection": "programs",
    "id": "jawaharlal-nehru-university-delhi__iccr-africa-scholarship-scheme",
    "attendu": {
      "deadline": "Cycle 2026-2027 clos le 15 avril 2026 — cycle 2027-2028 attendu fin février-mi avril 2027, dates officielles non encore publiées",
      "status": "Fermée"
    },
    "champs": {
      "deadline": "Aucune date sur le portail ICCR : l'année d'inscription affichée est 2026-27 et le portail renvoie vers la mission diplomatique de l'Inde de chaque pays (« Please contact the Indian Mission for any scholarship updates »), qui fixe le calendrier et présélectionne les dossiers.",
      "status": "Fermée"
    },
    "motif": "Portail lu le 5 sept 2026 : page de connexion, année 2026-27, catégories UG/PG/PhD ; aucune date."
  },
  {
    "collection": "programs",
    "id": "university-of-delhi-delhi__iccr-africa-scholarship-scheme",
    "attendu": {
      "deadline": "Cycle 2026-2027 clos le 15 avril 2026 — cycle 2027-2028 attendu fin février-mi avril 2027, dates officielles non encore publiées",
      "status": "Fermée"
    },
    "champs": {
      "deadline": "Aucune date sur le portail ICCR : l'année d'inscription affichée est 2026-27 et le portail renvoie vers la mission diplomatique de l'Inde de chaque pays (« Please contact the Indian Mission for any scholarship updates »), qui fixe le calendrier et présélectionne les dossiers.",
      "status": "Fermée"
    },
    "motif": "Portail lu le 5 sept 2026 : page de connexion, année 2026-27, catégories UG/PG/PhD ; aucune date."
  },
  {
    "collection": "scholarships",
    "id": "iccr-africa-scholarship-scheme",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "http://a2ascholarships.iccr.gov.in",
      "periodeOuverture": "Selon le pays : appel relayé par l'ambassade de l'Inde, en général entre janvier et avril pour la rentrée de juillet-août.",
      "exigences": [
        "candidature_via_ambassade"
      ],
      "echeanceVariable": "pays"
    },
    "motif": "Portail lu le 5 sept 2026 : page de connexion, année 2026-27, catégories UG/PG/PhD ; aucune date."
  },
  {
    "collection": "programs",
    "id": "universita-di-trieste-trieste__ardis-friuli-venezia-giulia__licence",
    "attendu": {},
    "champs": {
      "deadline": "Bando 2026-2027 ouvert depuis la mi-juillet ; la clôture (à 13h00, heure italienne) dépend du bénéfice demandé et figure dans le « scadenzario » officiel, que je n'ai pas pu lire. Vérifier la date exacte de la bourse (borsa di studio) sur ardis.fvg.it.",
      "status": "Ouverte"
    },
    "motif": "Page lue le 5 sept 2026 : ISEE ≤ 28 339,88 €, ISPE ≤ 61 608,48 € ; la date de clôture de la bourse n'est pas dans la page principale."
  },
  {
    "collection": "programs",
    "id": "universita-di-trieste-trieste__ardis-friuli-venezia-giulia__master",
    "attendu": {},
    "champs": {
      "deadline": "Bando 2026-2027 ouvert depuis la mi-juillet ; la clôture (à 13h00, heure italienne) dépend du bénéfice demandé et figure dans le « scadenzario » officiel, que je n'ai pas pu lire. Vérifier la date exacte de la bourse (borsa di studio) sur ardis.fvg.it.",
      "status": "Ouverte"
    },
    "motif": "Page lue le 5 sept 2026 : ISEE ≤ 28 339,88 €, ISPE ≤ 61 608,48 € ; la date de clôture de la bourse n'est pas dans la page principale."
  },
  {
    "collection": "scholarships",
    "id": "ardis-friuli-venezia-giulia",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.ardis.fvg.it/contenuti.php?view=page&id=268",
      "periodeOuverture": "Ouverture mi-juillet, clôtures échelonnées fin été-début automne selon le bénéfice.",
      "exigences": [
        "admission_prealable"
      ]
    },
    "motif": "Page lue le 5 sept 2026 : ISEE ≤ 28 339,88 €, ISPE ≤ 61 608,48 € ; la date de clôture de la bourse n'est pas dans la page principale."
  },
  {
    "collection": "programs",
    "id": "universita-degli-studi-di-milano-milan__dsu-lombardia-milano-statale__licence",
    "attendu": {},
    "champs": {
      "deadline": "Clôture le 30 septembre 2026 pour l'année 2026-2027 (candidatures ouvertes depuis le 10 juillet 2026 via l'Online Helpdesk de l'Université de Milan). Classement provisoire fin octobre, définitif fin novembre.",
      "status": "Ouverte"
    },
    "motif": "Page lue le 5 sept 2026 : « Applications must be submitted via the Online Helpdesk from 10 July to 30 September 2026 » ; critères de mérite et de revenu."
  },
  {
    "collection": "programs",
    "id": "universita-degli-studi-di-milano-milan__dsu-lombardia-milano-statale__master",
    "attendu": {},
    "champs": {
      "deadline": "Clôture le 30 septembre 2026 pour l'année 2026-2027 (candidatures ouvertes depuis le 10 juillet 2026 via l'Online Helpdesk de l'Université de Milan). Classement provisoire fin octobre, définitif fin novembre.",
      "status": "Ouverte"
    },
    "motif": "Page lue le 5 sept 2026 : « Applications must be submitted via the Online Helpdesk from 10 July to 30 September 2026 » ; critères de mérite et de revenu."
  },
  {
    "collection": "scholarships",
    "id": "dsu-lombardia-milano-statale",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.unimi.it/en/study/financial-support/regional-scholarships",
      "periodeOuverture": "Fenêtre annuelle du 10 juillet au 30 septembre.",
      "exigences": [
        "admission_prealable"
      ]
    },
    "motif": "Page lue le 5 sept 2026 : « Applications must be submitted via the Online Helpdesk from 10 July to 30 September 2026 » ; critères de mérite et de revenu."
  },
  {
    "collection": "programs",
    "id": "universita-di-pavia-pavie__edisu-pavia__doctorat",
    "attendu": {},
    "champs": {
      "deadline": "Clôture le 15 septembre 2026 à 15h00 pour la formule repas + allocation (2026-2027) ; la formule avec logement s'est achevée le 4 août 2026 à 15h00.",
      "status": "Ouverte"
    },
    "motif": "Page lue le 5 sept 2026 : « within September 15th, 2026 by 15:00 » ; critères de mérite et de ressources."
  },
  {
    "collection": "programs",
    "id": "universita-di-pavia-pavie__edisu-pavia__licence",
    "attendu": {},
    "champs": {
      "deadline": "Clôture le 15 septembre 2026 à 15h00 pour la formule repas + allocation (2026-2027) ; la formule avec logement s'est achevée le 4 août 2026 à 15h00.",
      "status": "Ouverte"
    },
    "motif": "Page lue le 5 sept 2026 : « within September 15th, 2026 by 15:00 » ; critères de mérite et de ressources."
  },
  {
    "collection": "programs",
    "id": "universita-di-pavia-pavie__edisu-pavia__master",
    "attendu": {},
    "champs": {
      "deadline": "Clôture le 15 septembre 2026 à 15h00 pour la formule repas + allocation (2026-2027) ; la formule avec logement s'est achevée le 4 août 2026 à 15h00.",
      "status": "Ouverte"
    },
    "motif": "Page lue le 5 sept 2026 : « within September 15th, 2026 by 15:00 » ; critères de mérite et de ressources."
  },
  {
    "collection": "scholarships",
    "id": "edisu-pavia",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://en.unipv.it/en/education/bachelors-and-masters-degree-programs/fees-and-funding/financial-support",
      "periodeOuverture": "Deux échéances estivales : début août (avec logement) et mi-septembre (sans logement).",
      "exigences": [
        "admission_prealable"
      ]
    },
    "motif": "Page lue le 5 sept 2026 : « within September 15th, 2026 by 15:00 » ; critères de mérite et de ressources."
  },
  {
    "collection": "programs",
    "id": "sapienza-universita-di-roma-rome__italian-government-scholarship",
    "attendu": {
      "deadline": "26 mars 2026, 14h (cycle 2026-2027) — prochaine fenêtre estimée février-mars 2027",
      "status": "Ouverte"
    },
    "champs": {
      "deadline": "Le site Study in Italy affiche que l'appel des bourses MAECI est terminé (« The call for applications for MAECI grants for the 2025-2026 academic year is now closed ») et n'annonce pas encore le prochain appel. Le rythme habituel est une publication au printemps avec une clôture vers la fin mai ou juin, pour la rentrée suivante.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : aucune liste d'appels, uniquement la mention de clôture ; à surveiller au printemps 2027."
  },
  {
    "collection": "programs",
    "id": "universita-di-bologna-bologne__italian-government-scholarship",
    "attendu": {
      "deadline": "26 mars 2026, 14h (cycle 2026-2027) — prochaine fenêtre estimée février-mars 2027",
      "status": "Ouverte"
    },
    "champs": {
      "deadline": "Le site Study in Italy affiche que l'appel des bourses MAECI est terminé (« The call for applications for MAECI grants for the 2025-2026 academic year is now closed ») et n'annonce pas encore le prochain appel. Le rythme habituel est une publication au printemps avec une clôture vers la fin mai ou juin, pour la rentrée suivante.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : aucune liste d'appels, uniquement la mention de clôture ; à surveiller au printemps 2027."
  },
  {
    "collection": "scholarships",
    "id": "italian-government-scholarship",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://studyinitaly.esteri.it/ListaBandi",
      "periodeOuverture": "Appel annuel publié au printemps, clôture fin mai-juin.",
      "exigences": []
    },
    "motif": "Page lue le 5 sept 2026 : aucune liste d'appels, uniquement la mention de clôture ; à surveiller au printemps 2027."
  },
  {
    "collection": "programs",
    "id": "universita-di-bologna-bologne__ergo-emilia-romagna__doctorat",
    "attendu": {},
    "champs": {
      "deadline": "La demande de bénéfices ER.GO 2026-2027 est terminée depuis le 24 août 2026 à 16h00 (« Scaduto il 24/08/2026 16:00 »). Le bando 2027-2028 devrait être publié en juin 2027 avec une clôture fin août.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : conditions fixées chaque année dans le bando ; section dédiée aux étudiants internationaux."
  },
  {
    "collection": "programs",
    "id": "universita-di-bologna-bologne__ergo-emilia-romagna__licence",
    "attendu": {},
    "champs": {
      "deadline": "La demande de bénéfices ER.GO 2026-2027 est terminée depuis le 24 août 2026 à 16h00 (« Scaduto il 24/08/2026 16:00 »). Le bando 2027-2028 devrait être publié en juin 2027 avec une clôture fin août.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : conditions fixées chaque année dans le bando ; section dédiée aux étudiants internationaux."
  },
  {
    "collection": "programs",
    "id": "universita-di-bologna-bologne__ergo-emilia-romagna__master",
    "attendu": {},
    "champs": {
      "deadline": "La demande de bénéfices ER.GO 2026-2027 est terminée depuis le 24 août 2026 à 16h00 (« Scaduto il 24/08/2026 16:00 »). Le bando 2027-2028 devrait être publié en juin 2027 avec une clôture fin août.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : conditions fixées chaque année dans le bando ; section dédiée aux étudiants internationaux."
  },
  {
    "collection": "scholarships",
    "id": "ergo-emilia-romagna",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.er-go.it/",
      "periodeOuverture": "Publication en juin, clôture fin août.",
      "exigences": [
        "admission_prealable"
      ]
    },
    "motif": "Page lue le 5 sept 2026 : conditions fixées chaque année dans le bando ; section dédiée aux étudiants internationaux."
  },
  {
    "collection": "programs",
    "id": "universita-di-genova-genes__aliseo-liguria__licence",
    "attendu": {},
    "champs": {
      "deadline": "Le bando 2026-2027 s'est achevé le le 31 juillet 2026 à 12h00 (fenêtre du 15 juin au 31 juillet 2026) ; classements provisoires publiés d'ici la fin septembre. Le bando 2027-2028 devrait ouvrir mi-juin 2027.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « 15 giugno 2026 – 31 luglio 2026 h. 12:00 » ; pré-immatriculation, code fiscal, SPID/CIE, IBAN SEPA exigés."
  },
  {
    "collection": "programs",
    "id": "universita-di-genova-genes__aliseo-liguria__master",
    "attendu": {},
    "champs": {
      "deadline": "Le bando 2026-2027 s'est achevé le le 31 juillet 2026 à 12h00 (fenêtre du 15 juin au 31 juillet 2026) ; classements provisoires publiés d'ici la fin septembre. Le bando 2027-2028 devrait ouvrir mi-juin 2027.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « 15 giugno 2026 – 31 luglio 2026 h. 12:00 » ; pré-immatriculation, code fiscal, SPID/CIE, IBAN SEPA exigés."
  },
  {
    "collection": "scholarships",
    "id": "aliseo-liguria",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.aliseo.liguria.it/benefici-economici-universitari/borsa-di-studio-universitaria/bando-2026-2027-istruzioni-per-luso/",
      "periodeOuverture": "Fenêtre annuelle du 15 juin au 31 juillet.",
      "exigences": [
        "admission_prealable"
      ]
    },
    "motif": "Page lue le 5 sept 2026 : « 15 giugno 2026 – 31 luglio 2026 h. 12:00 » ; pré-immatriculation, code fiscal, SPID/CIE, IBAN SEPA exigés."
  },
  {
    "collection": "programs",
    "id": "scuola-normale-superiore-pise__scuola-normale-superiore-phd__doctorat",
    "attendu": {},
    "champs": {
      "deadline": "Le concours du 42e cycle (2026-2027) est terminé : dernière clôture le 3 août 2026 à 23h59 (CEST) pour la classe de sciences politico-sociales, le 22 juin 2026 pour la classe de sciences et le 13 avril 2026 pour lettres et philosophie. Le concours du 43e cycle devrait ouvrir en mars 2027.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : dates du 42e cycle citées ; laurea magistrale ou équivalent obtenu dans les 5 années précédentes."
  },
  {
    "collection": "scholarships",
    "id": "scuola-normale-superiore-phd",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.sns.it/it/concorso-phd",
      "periodeOuverture": "Sessions de mars à août selon la classe ; oraux de mai à septembre.",
      "exigences": [
        "diplome_recent"
      ]
    },
    "motif": "Page lue le 5 sept 2026 : dates du 42e cycle citées ; laurea magistrale ou équivalent obtenu dans les 5 années précédentes."
  },
  {
    "collection": "programs",
    "id": "politecnico-di-milano-milan__invest-your-talent-italy__master",
    "attendu": {},
    "champs": {
      "deadline": "La page officielle affiche encore l'appel 2026-2027, terminé le 11 mai 2026 à 18h00 (heure italienne). L'appel 2027-2028 devrait ouvrir début 2027 avec une clôture vers la mi-mai ; à recouper sur la page officielle sur investyourtalentapplication.esteri.it.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « The deadline for applications is May 11th at 6.00 pm » (2026-2027) ; masters en anglais en ingénierie, design, économie ; bourses de 9 mois."
  },
  {
    "collection": "programs",
    "id": "politecnico-di-torino-turin__invest-your-talent-italy__master",
    "attendu": {},
    "champs": {
      "deadline": "La page officielle affiche encore l'appel 2026-2027, terminé le 11 mai 2026 à 18h00 (heure italienne). L'appel 2027-2028 devrait ouvrir début 2027 avec une clôture vers la mi-mai ; à recouper sur la page officielle sur investyourtalentapplication.esteri.it.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « The deadline for applications is May 11th at 6.00 pm » (2026-2027) ; masters en anglais en ingénierie, design, économie ; bourses de 9 mois."
  },
  {
    "collection": "scholarships",
    "id": "invest-your-talent-italy",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.esteri.it/en/servizi-opportunita/opportunita/borse-di-studio/per-cittadini-stranieri/progetti-speciali/invest-your-talent-in-italy/",
      "periodeOuverture": "Appel annuel ouvert en hiver, clôture mi-mai.",
      "exigences": []
    },
    "motif": "Page lue le 5 sept 2026 : « The deadline for applications is May 11th at 6.00 pm » (2026-2027) ; masters en anglais en ingénierie, design, économie ; bourses de 9 mois."
  },
  {
    "collection": "programs",
    "id": "university-of-tokyo-tokyo__jj-wbgsp",
    "attendu": {
      "deadline": "Fenêtre 1 : 18 janvier – 26 février 2027 ; fenêtre 2 : 29 mars – 21 mai 2027"
    },
    "champs": {
      "deadline": "Clôture le 26 février 2027 pour la première fenêtre 2027 (ouverture le 18 janvier 2027), puis le 21 mai 2027 pour la seconde fenêtre (ouverture le 29 mars 2027). Il faut avoir une admission inconditionnelle dans un master partenaire, un diplôme obtenu au moins 3 ans avant la date limite et 3 ans d'expérience rémunérée dans le développement."
    },
    "motif": "Page lue le 5 sept 2026 : « from January 18 to February 26, 2027 » et « from March 29 to May 21, 2027 » ; ressortissants de pays en développement membres de la Banque mondiale, sans double nationalité d'un pays développé ; statut Fermée + date future → « pas encore ouverte »."
  },
  {
    "collection": "scholarships",
    "id": "jj-wbgsp",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.worldbank.org/en/programs/scholarships/jj-wbgsp",
      "periodeOuverture": "Deux fenêtres par an : mi-janvier → fin février, puis fin mars → fin mai.",
      "exigences": [
        "experience_pro_2ans",
        "admission_prealable"
      ]
    },
    "motif": "Page lue le 5 sept 2026 : « from January 18 to February 26, 2027 » et « from March 29 to May 21, 2027 » ; ressortissants de pays en développement membres de la Banque mondiale, sans double nationalité d'un pays développé ; statut Fermée + date future → « pas encore ouverte »."
  },
  {
    "collection": "programs",
    "id": "university-of-tokyo-tokyo__honjo-international-scholarship__doctorat",
    "attendu": {},
    "champs": {
      "deadline": "La page officielle affiche encore le calendrier 2024 (« April 1, 2024 ~ April 30, 2024 ») : les candidatures se déposent chaque année en avril, pour des étudiants étrangers admis en master ou doctorat dans une université japonaise. Le calendrier 2027 n'est pas publié ; à recouper sur la page officielle.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : 210 000 ¥/mois (1-2 ans), 190 000 ¥ (3 ans), 160 000 ¥ (4-5 ans) ; vidéo de 2 minutes exigée ; page non mise à jour depuis 2024."
  },
  {
    "collection": "programs",
    "id": "university-of-tokyo-tokyo__honjo-international-scholarship__master",
    "attendu": {},
    "champs": {
      "deadline": "La page officielle affiche encore le calendrier 2024 (« April 1, 2024 ~ April 30, 2024 ») : les candidatures se déposent chaque année en avril, pour des étudiants étrangers admis en master ou doctorat dans une université japonaise. Le calendrier 2027 n'est pas publié ; à recouper sur la page officielle.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : 210 000 ¥/mois (1-2 ans), 190 000 ¥ (3 ans), 160 000 ¥ (4-5 ans) ; vidéo de 2 minutes exigée ; page non mise à jour depuis 2024."
  },
  {
    "collection": "programs",
    "id": "waseda-university-tokyo__honjo-international-scholarship__doctorat",
    "attendu": {},
    "champs": {
      "deadline": "La page officielle affiche encore le calendrier 2024 (« April 1, 2024 ~ April 30, 2024 ») : les candidatures se déposent chaque année en avril, pour des étudiants étrangers admis en master ou doctorat dans une université japonaise. Le calendrier 2027 n'est pas publié ; à recouper sur la page officielle.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : 210 000 ¥/mois (1-2 ans), 190 000 ¥ (3 ans), 160 000 ¥ (4-5 ans) ; vidéo de 2 minutes exigée ; page non mise à jour depuis 2024."
  },
  {
    "collection": "programs",
    "id": "waseda-university-tokyo__honjo-international-scholarship__master",
    "attendu": {},
    "champs": {
      "deadline": "La page officielle affiche encore le calendrier 2024 (« April 1, 2024 ~ April 30, 2024 ») : les candidatures se déposent chaque année en avril, pour des étudiants étrangers admis en master ou doctorat dans une université japonaise. Le calendrier 2027 n'est pas publié ; à recouper sur la page officielle.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : 210 000 ¥/mois (1-2 ans), 190 000 ¥ (3 ans), 160 000 ¥ (4-5 ans) ; vidéo de 2 minutes exigée ; page non mise à jour depuis 2024."
  },
  {
    "collection": "scholarships",
    "id": "honjo-international-scholarship",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.hisf.or.jp/en/scholarship/foreigner/",
      "periodeOuverture": "Candidatures en avril chaque année, entretiens en juillet.",
      "exigences": [
        "admission_prealable"
      ],
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : 210 000 ¥/mois (1-2 ans), 190 000 ¥ (3 ans), 160 000 ¥ (4-5 ans) ; vidéo de 2 minutes exigée ; page non mise à jour depuis 2024.",
    "attendu": {
      "status": "Ouverte"
    }
  },
  {
    "collection": "programs",
    "id": "university-of-tokyo-tokyo__jads-japan-africa-dream",
    "attendu": {
      "deadline": "Graduate School of Frontier Sciences : dépôt en juin pour une entrée en avril, ou en novembre pour une entrée en octobre",
      "status": "Ouverte"
    },
    "champs": {
      "deadline": "Aucune date sur la page de la Banque africaine de développement : la candidature passe par les universités japonaises partenaires, chacune avec son propre calendrier (en général entre l'automne et le début d'année). Réservé aux ressortissants des pays membres régionaux de la BAD.",
      "status": "Ouverte"
    },
    "motif": "Page lue le 5 sept 2026 : master 24 mois + 6 mois préparatoires, domaines énergie, agriculture, santé, environnement, ingénierie ; aucune date."
  },
  {
    "collection": "scholarships",
    "id": "jads-japan-africa-dream",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.afdb.org/en/about-us/careers/japan-africa-dream-scholarship-jads-program",
      "periodeOuverture": "Selon l'université japonaise partenaire, appels entre octobre et février.",
      "exigences": [
        "candidature_via_etablissement"
      ],
      "echeanceVariable": "etablissement"
    },
    "motif": "Page lue le 5 sept 2026 : master 24 mois + 6 mois préparatoires, domaines énergie, agriculture, santé, environnement, ingénierie ; aucune date."
  },
  {
    "collection": "programs",
    "id": "university-of-tokyo-tokyo__jasso-monbukagakusho-honors__doctorat",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date nationale : la bourse d'encouragement JASSO se demande par l'intermédiaire de l'établissement japonais (ou en cochant l'option lors de l'examen EJU avant l'arrivée) ; chaque université fixe son calendrier. Réservée aux étudiants autofinancés déjà inscrits au Japon.",
      "status": "Ouverte"
    },
    "motif": "Page lue le 5 sept 2026 : 48 000 ¥/mois (université), 30 000 ¥ (école de japonais) ; GPA ≥ 2,30, JLPT N2, remises mensuelles < 90 000 ¥."
  },
  {
    "collection": "programs",
    "id": "university-of-tokyo-tokyo__jasso-monbukagakusho-honors__licence",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date nationale : la bourse d'encouragement JASSO se demande par l'intermédiaire de l'établissement japonais (ou en cochant l'option lors de l'examen EJU avant l'arrivée) ; chaque université fixe son calendrier. Réservée aux étudiants autofinancés déjà inscrits au Japon.",
      "status": "Ouverte"
    },
    "motif": "Page lue le 5 sept 2026 : 48 000 ¥/mois (université), 30 000 ¥ (école de japonais) ; GPA ≥ 2,30, JLPT N2, remises mensuelles < 90 000 ¥."
  },
  {
    "collection": "programs",
    "id": "university-of-tokyo-tokyo__jasso-monbukagakusho-honors__master",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date nationale : la bourse d'encouragement JASSO se demande par l'intermédiaire de l'établissement japonais (ou en cochant l'option lors de l'examen EJU avant l'arrivée) ; chaque université fixe son calendrier. Réservée aux étudiants autofinancés déjà inscrits au Japon.",
      "status": "Ouverte"
    },
    "motif": "Page lue le 5 sept 2026 : 48 000 ¥/mois (université), 30 000 ¥ (école de japonais) ; GPA ≥ 2,30, JLPT N2, remises mensuelles < 90 000 ¥."
  },
  {
    "collection": "programs",
    "id": "waseda-university-tokyo__jasso-monbukagakusho-honors__doctorat",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date nationale : la bourse d'encouragement JASSO se demande par l'intermédiaire de l'établissement japonais (ou en cochant l'option lors de l'examen EJU avant l'arrivée) ; chaque université fixe son calendrier. Réservée aux étudiants autofinancés déjà inscrits au Japon.",
      "status": "Ouverte"
    },
    "motif": "Page lue le 5 sept 2026 : 48 000 ¥/mois (université), 30 000 ¥ (école de japonais) ; GPA ≥ 2,30, JLPT N2, remises mensuelles < 90 000 ¥."
  },
  {
    "collection": "programs",
    "id": "waseda-university-tokyo__jasso-monbukagakusho-honors__licence",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date nationale : la bourse d'encouragement JASSO se demande par l'intermédiaire de l'établissement japonais (ou en cochant l'option lors de l'examen EJU avant l'arrivée) ; chaque université fixe son calendrier. Réservée aux étudiants autofinancés déjà inscrits au Japon.",
      "status": "Ouverte"
    },
    "motif": "Page lue le 5 sept 2026 : 48 000 ¥/mois (université), 30 000 ¥ (école de japonais) ; GPA ≥ 2,30, JLPT N2, remises mensuelles < 90 000 ¥."
  },
  {
    "collection": "programs",
    "id": "waseda-university-tokyo__jasso-monbukagakusho-honors__master",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date nationale : la bourse d'encouragement JASSO se demande par l'intermédiaire de l'établissement japonais (ou en cochant l'option lors de l'examen EJU avant l'arrivée) ; chaque université fixe son calendrier. Réservée aux étudiants autofinancés déjà inscrits au Japon.",
      "status": "Ouverte"
    },
    "motif": "Page lue le 5 sept 2026 : 48 000 ¥/mois (université), 30 000 ¥ (école de japonais) ; GPA ≥ 2,30, JLPT N2, remises mensuelles < 90 000 ¥."
  },
  {
    "collection": "scholarships",
    "id": "jasso-monbukagakusho-honors",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.studyinjapan.go.jp/en/planning/scholarships/jasso-scholarships/",
      "periodeOuverture": "Selon l'établissement, généralement au printemps pour la période avril-mars.",
      "exigences": [
        "admission_prealable",
        "candidature_via_etablissement"
      ],
      "echeanceVariable": "etablissement"
    },
    "motif": "Page lue le 5 sept 2026 : 48 000 ¥/mois (université), 30 000 ¥ (école de japonais) ; GPA ≥ 2,30, JLPT N2, remises mensuelles < 90 000 ¥."
  },
  {
    "collection": "programs",
    "id": "university-of-tokyo-tokyo__rotary-yoneyama-overseas__doctorat",
    "attendu": {},
    "champs": {
      "deadline": "Clôture le 31 octobre 2026 à 13h00 (heure du Japon) ; candidatures ouvertes du 1er octobre 2026, pour les rentrées d'avril et de septembre-octobre 2027. Il faut avoir trouvé soi-même son université japonaise et détenir au moins le JLPT N3.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « From: 13:00 JST, October 1, 2026 To: 13:00 JST, October 31, 2026 » ; 100 000 ¥ (licence) / 140 000 ¥ (master, doctorat) par mois ; statut Fermée + date future → « pas encore ouverte »."
  },
  {
    "collection": "programs",
    "id": "university-of-tokyo-tokyo__rotary-yoneyama-overseas__licence",
    "attendu": {},
    "champs": {
      "deadline": "Clôture le 31 octobre 2026 à 13h00 (heure du Japon) ; candidatures ouvertes du 1er octobre 2026, pour les rentrées d'avril et de septembre-octobre 2027. Il faut avoir trouvé soi-même son université japonaise et détenir au moins le JLPT N3.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « From: 13:00 JST, October 1, 2026 To: 13:00 JST, October 31, 2026 » ; 100 000 ¥ (licence) / 140 000 ¥ (master, doctorat) par mois ; statut Fermée + date future → « pas encore ouverte »."
  },
  {
    "collection": "programs",
    "id": "university-of-tokyo-tokyo__rotary-yoneyama-overseas__master",
    "attendu": {},
    "champs": {
      "deadline": "Clôture le 31 octobre 2026 à 13h00 (heure du Japon) ; candidatures ouvertes du 1er octobre 2026, pour les rentrées d'avril et de septembre-octobre 2027. Il faut avoir trouvé soi-même son université japonaise et détenir au moins le JLPT N3.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « From: 13:00 JST, October 1, 2026 To: 13:00 JST, October 31, 2026 » ; 100 000 ¥ (licence) / 140 000 ¥ (master, doctorat) par mois ; statut Fermée + date future → « pas encore ouverte »."
  },
  {
    "collection": "programs",
    "id": "waseda-university-tokyo__rotary-yoneyama-overseas__doctorat",
    "attendu": {},
    "champs": {
      "deadline": "Clôture le 31 octobre 2026 à 13h00 (heure du Japon) ; candidatures ouvertes du 1er octobre 2026, pour les rentrées d'avril et de septembre-octobre 2027. Il faut avoir trouvé soi-même son université japonaise et détenir au moins le JLPT N3.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « From: 13:00 JST, October 1, 2026 To: 13:00 JST, October 31, 2026 » ; 100 000 ¥ (licence) / 140 000 ¥ (master, doctorat) par mois ; statut Fermée + date future → « pas encore ouverte »."
  },
  {
    "collection": "programs",
    "id": "waseda-university-tokyo__rotary-yoneyama-overseas__licence",
    "attendu": {},
    "champs": {
      "deadline": "Clôture le 31 octobre 2026 à 13h00 (heure du Japon) ; candidatures ouvertes du 1er octobre 2026, pour les rentrées d'avril et de septembre-octobre 2027. Il faut avoir trouvé soi-même son université japonaise et détenir au moins le JLPT N3.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « From: 13:00 JST, October 1, 2026 To: 13:00 JST, October 31, 2026 » ; 100 000 ¥ (licence) / 140 000 ¥ (master, doctorat) par mois ; statut Fermée + date future → « pas encore ouverte »."
  },
  {
    "collection": "programs",
    "id": "waseda-university-tokyo__rotary-yoneyama-overseas__master",
    "attendu": {},
    "champs": {
      "deadline": "Clôture le 31 octobre 2026 à 13h00 (heure du Japon) ; candidatures ouvertes du 1er octobre 2026, pour les rentrées d'avril et de septembre-octobre 2027. Il faut avoir trouvé soi-même son université japonaise et détenir au moins le JLPT N3.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « From: 13:00 JST, October 1, 2026 To: 13:00 JST, October 31, 2026 » ; 100 000 ¥ (licence) / 140 000 ¥ (master, doctorat) par mois ; statut Fermée + date future → « pas encore ouverte »."
  },
  {
    "collection": "scholarships",
    "id": "rotary-yoneyama-overseas",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.rotary-yoneyama.or.jp/english/overseas",
      "periodeOuverture": "Fenêtre annuelle : tout le mois d'octobre, résultats mi-mars.",
      "exigences": [
        "certification_langue_requise"
      ],
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « From: 13:00 JST, October 1, 2026 To: 13:00 JST, October 31, 2026 » ; 100 000 ¥ (licence) / 140 000 ¥ (master, doctorat) par mois ; statut Fermée + date future → « pas encore ouverte ».",
    "attendu": {
      "status": "Ouverte"
    }
  },
  {
    "collection": "programs",
    "id": "university-of-tokyo-tokyo__utokyo-fellowship",
    "attendu": {
      "deadline": "Calé sur le calendrier d'admission de chaque école doctorale — dépôt simultané au dossier d'admission"
    },
    "champs": {
      "deadline": "Aucune date centrale : la candidature se dépose par l'intermédiaire de la graduate school visée (bureau international), qui fixe son calendrier, en général en même temps que la demande d'admission."
    },
    "motif": "Page lue le 5 sept 2026 : 200 000 ¥/mois pendant la durée normale des études ; étudiants internationaux autofinancés ; « applications must be submitted through the applicant's graduate school »."
  },
  {
    "collection": "scholarships",
    "id": "utokyo-fellowship",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.u-tokyo.ac.jp/en/prospective-students/fellowship.html",
      "periodeOuverture": "Selon la graduate school, avec la demande d'admission.",
      "exigences": [
        "candidature_via_etablissement"
      ],
      "echeanceVariable": "etablissement"
    },
    "motif": "Page lue le 5 sept 2026 : 200 000 ¥/mois pendant la durée normale des études ; étudiants internationaux autofinancés ; « applications must be submitted through the applicant's graduate school »."
  },
  {
    "collection": "programs",
    "id": "university-of-tokyo-tokyo__jica-sdgs-global-leader__doctorat",
    "attendu": {},
    "champs": {
      "deadline": "La page enregistrée est celle du bureau JICA des Philippines et affiche le calendrier 2025 : nomination par le gouvernement avant le 24 octobre 2025, départ en septembre 2026. Chaque bureau JICA national publie son propre appel, en général entre septembre et novembre, pour un départ l'année suivante.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : fonctionnaires jeunes ou intermédiaires nommés par leur gouvernement ; calendrier 2025 uniquement."
  },
  {
    "collection": "programs",
    "id": "university-of-tokyo-tokyo__jica-sdgs-global-leader__master",
    "attendu": {},
    "champs": {
      "deadline": "La page enregistrée est celle du bureau JICA des Philippines et affiche le calendrier 2025 : nomination par le gouvernement avant le 24 octobre 2025, départ en septembre 2026. Chaque bureau JICA national publie son propre appel, en général entre septembre et novembre, pour un départ l'année suivante.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : fonctionnaires jeunes ou intermédiaires nommés par leur gouvernement ; calendrier 2025 uniquement."
  },
  {
    "collection": "programs",
    "id": "waseda-university-tokyo__jica-sdgs-global-leader__doctorat",
    "attendu": {},
    "champs": {
      "deadline": "La page enregistrée est celle du bureau JICA des Philippines et affiche le calendrier 2025 : nomination par le gouvernement avant le 24 octobre 2025, départ en septembre 2026. Chaque bureau JICA national publie son propre appel, en général entre septembre et novembre, pour un départ l'année suivante.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : fonctionnaires jeunes ou intermédiaires nommés par leur gouvernement ; calendrier 2025 uniquement."
  },
  {
    "collection": "programs",
    "id": "waseda-university-tokyo__jica-sdgs-global-leader__master",
    "attendu": {},
    "champs": {
      "deadline": "La page enregistrée est celle du bureau JICA des Philippines et affiche le calendrier 2025 : nomination par le gouvernement avant le 24 octobre 2025, départ en septembre 2026. Chaque bureau JICA national publie son propre appel, en général entre septembre et novembre, pour un départ l'année suivante.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : fonctionnaires jeunes ou intermédiaires nommés par leur gouvernement ; calendrier 2025 uniquement."
  },
  {
    "collection": "scholarships",
    "id": "jica-sdgs-global-leader",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.jica.go.jp/english/overseas/philippine/activities/assistance_schemes/training_and_scholarship_programs/long_term_programs/sdgs_glp/index.html",
      "periodeOuverture": "Selon le pays : appel du bureau JICA national à l'automne, un an avant le départ.",
      "exigences": [
        "nomination_autorite_nationale",
        "experience_pro_2ans"
      ],
      "echeanceVariable": "pays",
      "ageMax": {
        "master": 35,
        "doctorat": 40
      },
      "ageMaxNote": "35 ans ou moins pour un master, 40 ans ou moins pour un doctorat (« in principle »)."
    },
    "motif": "Page lue le 5 sept 2026 : fonctionnaires jeunes ou intermédiaires nommés par leur gouvernement ; calendrier 2025 uniquement."
  },
  {
    "collection": "programs",
    "id": "university-of-tokyo-tokyo__mext-scholarship",
    "attendu": {
      "deadline": "Cycle 2027 clos (candidatures via ambassade, février-juin 2026 selon le pays) — prochain cycle (arrivée 2028) attendu février-juin 2027, dates propres à chaque ambassade non encore annoncées",
      "status": "Fermée"
    },
    "champs": {
      "deadline": "La date limite DÉPEND DU PAYS : la voie « recommandation d'ambassade » est gérée par l'ambassade du Japon de chaque pays (appel en général entre avril et juin pour un départ l'année suivante) ; la voie « recommandation d'université » suit le calendrier de l'université japonaise. Le site officiel ne publie aucune date commune.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : sept catégories, deux voies ; « check with the Japanese embassy or other Japanese diplomatic mission in your country »."
  },
  {
    "collection": "programs",
    "id": "waseda-university-tokyo__mext-scholarship",
    "attendu": {
      "deadline": "Cycle 2027 clos (candidatures via ambassade, février-juin 2026 selon le pays) — prochain cycle (arrivée 2028) attendu février-juin 2027, dates propres à chaque ambassade non encore annoncées",
      "status": "Fermée"
    },
    "champs": {
      "deadline": "La date limite DÉPEND DU PAYS : la voie « recommandation d'ambassade » est gérée par l'ambassade du Japon de chaque pays (appel en général entre avril et juin pour un départ l'année suivante) ; la voie « recommandation d'université » suit le calendrier de l'université japonaise. Le site officiel ne publie aucune date commune.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : sept catégories, deux voies ; « check with the Japanese embassy or other Japanese diplomatic mission in your country »."
  },
  {
    "collection": "scholarships",
    "id": "mext-scholarship",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.studyinjapan.go.jp/en/planning/scholarships/mext-scholarships/",
      "periodeOuverture": "Voie ambassade : appels d'avril à juin selon le pays ; voie université : automne-hiver.",
      "exigences": [
        "candidature_via_ambassade"
      ],
      "echeanceVariable": "pays"
    },
    "motif": "Page lue le 5 sept 2026 : sept catégories, deux voies ; « check with the Japanese embassy or other Japanese diplomatic mission in your country »."
  },
  {
    "collection": "programs",
    "id": "waseda-university-tokyo__waseda-partial-tuition-waiver",
    "attendu": {
      "deadline": "Campagne interne au printemps, annoncée par le bureau de chaque faculté et sur MyWaseda",
      "status": "Fermée"
    },
    "champs": {
      "deadline": "Aucune date centrale : la procédure et le calendrier varient selon la faculté ou la graduate school de Waseda (inscription préalable sur MyWaseda ou annonce directe aux étudiants éligibles). Réservée aux étudiants internationaux autofinancés en visa « Student ».",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « The application process varies by faculty/graduate school »."
  },
  {
    "collection": "scholarships",
    "id": "waseda-partial-tuition-waiver",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.waseda.jp/inst/scholarship/en/for-international-students/",
      "periodeOuverture": "Selon la faculté, en général après l'admission.",
      "exigences": [
        "admission_prealable",
        "candidature_via_etablissement"
      ],
      "echeanceVariable": "etablissement"
    },
    "motif": "Page lue le 5 sept 2026 : « The application process varies by faculty/graduate school »."
  },
  {
    "collection": "programs",
    "id": "icipe-nairobi__arppis-daad-icipe__doctorat",
    "attendu": {},
    "champs": {
      "deadline": "Aucun appel doctoral ARPPIS-DAAD en cours (« There are no active PhD calls at the moment ») ; seules deux bourses de master ciblées (pollinisation, genre) ferment mi-septembre. Les appels ARPPIS-DAAD sont annoncés sur scholarships.icipe.org, en général au premier semestre.",
      "status": "Fermée"
    },
    "motif": "Portail lu le 5 sept 2026 : pas d'appel PhD actif ; statut Fermée + date future de master → à écrire sans date complète pour ne pas faire croire à une échéance ARPPIS."
  },
  {
    "collection": "scholarships",
    "id": "arppis-daad-icipe",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://scholarships.icipe.org/",
      "periodeOuverture": "Appels doctoraux irréguliers, annoncés sur le portail de bourses d'icipe.",
      "exigences": [
        "projet_recherche"
      ]
    },
    "motif": "Portail lu le 5 sept 2026 : pas d'appel PhD actif ; statut Fermée + date future de master → à écrire sans date complète pour ne pas faire croire à une échéance ARPPIS."
  },
  {
    "collection": "programs",
    "id": "jkuat-juja__pan-african-university-pausti__doctorat",
    "attendu": {},
    "champs": {
      "deadline": "La page de dépôt affiche encore l'appel spécial réfugiés et déplacés terminé le 22 janvier 2025 ; aucun appel général 2026-2027 n'est visible. L'Université panafricaine lance d'habitude son appel général entre février et avril pour la rentrée de septembre ; à recouper sur la page officielle sur au-pau.org.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : bourse complète de la Commission de l'Union africaine ; licence avec au moins second class upper."
  },
  {
    "collection": "programs",
    "id": "jkuat-juja__pan-african-university-pausti__master",
    "attendu": {},
    "champs": {
      "deadline": "La page de dépôt affiche encore l'appel spécial réfugiés et déplacés terminé le 22 janvier 2025 ; aucun appel général 2026-2027 n'est visible. L'Université panafricaine lance d'habitude son appel général entre février et avril pour la rentrée de septembre ; à recouper sur la page officielle sur au-pau.org.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : bourse complète de la Commission de l'Union africaine ; licence avec au moins second class upper."
  },
  {
    "collection": "scholarships",
    "id": "pan-african-university-pausti",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.au-pau.org/submission/",
      "periodeOuverture": "Appel général annuel, en général de février à avril.",
      "exigences": [
        "lettres_recommandation"
      ]
    },
    "motif": "Page lue le 5 sept 2026 : bourse complète de la Commission de l'Union africaine ; licence avec au moins second class upper."
  },
  {
    "collection": "programs",
    "id": "usiu-africa-nairobi__mastercard-foundation-scholars-usiu__licence",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date fixe : deux rentrées par an (mai et septembre) et l'appel est publié cinq mois avant chaque rentrée (« will be rolled out 5 months before the intake »). Vérifier l'appel en cours sur la page de USIU-Africa.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : jeunes Africains, aucun frais de candidature."
  },
  {
    "collection": "scholarships",
    "id": "mastercard-foundation-scholars-usiu",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.usiu.ac.ke/mastercard-foundation-scholars-program/",
      "periodeOuverture": "Appels vers décembre (rentrée de mai) et avril (rentrée de septembre).",
      "exigences": []
    },
    "motif": "Page lue le 5 sept 2026 : jeunes Africains, aucun frais de candidature."
  },
  {
    "collection": "programs",
    "id": "universite-cadi-ayyad-marrakech__bourse-gouvernement-maroc-amci",
    "attendu": {
      "deadline": "Variable, fixée chaque année par le ministère de l'enseignement supérieur du pays d'origine"
    },
    "champs": {
      "deadline": "Aucune date publiée par l'AMCI : les bourses du Royaume du Maroc sont attribuées par quotas aux pays partenaires et la candidature se dépose auprès de l'autorité nationale du candidat (ministère ou direction des bourses), qui fixe son calendrier, en général entre juin et août pour la rentrée de septembre."
    },
    "motif": "Page AMCI lue le 5 sept 2026 : aucune date ni procédure, uniquement l'ampleur du programme."
  },
  {
    "collection": "programs",
    "id": "universite-hassan-ii-casablanca__bourse-gouvernement-maroc-amci",
    "attendu": {
      "deadline": "Variable, fixée chaque année par le ministère de l'enseignement supérieur du pays d'origine"
    },
    "champs": {
      "deadline": "Aucune date publiée par l'AMCI : les bourses du Royaume du Maroc sont attribuées par quotas aux pays partenaires et la candidature se dépose auprès de l'autorité nationale du candidat (ministère ou direction des bourses), qui fixe son calendrier, en général entre juin et août pour la rentrée de septembre."
    },
    "motif": "Page AMCI lue le 5 sept 2026 : aucune date ni procédure, uniquement l'ampleur du programme."
  },
  {
    "collection": "programs",
    "id": "universite-mohammed-v-rabat__bourse-gouvernement-maroc-amci",
    "attendu": {
      "deadline": "Variable, fixée chaque année par le ministère de l'enseignement supérieur du pays d'origine"
    },
    "champs": {
      "deadline": "Aucune date publiée par l'AMCI : les bourses du Royaume du Maroc sont attribuées par quotas aux pays partenaires et la candidature se dépose auprès de l'autorité nationale du candidat (ministère ou direction des bourses), qui fixe son calendrier, en général entre juin et août pour la rentrée de septembre."
    },
    "motif": "Page AMCI lue le 5 sept 2026 : aucune date ni procédure, uniquement l'ampleur du programme."
  },
  {
    "collection": "scholarships",
    "id": "bourse-gouvernement-maroc-amci",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.amci.ma/cooperation-academique",
      "periodeOuverture": "Selon le pays : appel national de l'été (juin-août).",
      "exigences": [
        "nomination_autorite_nationale"
      ],
      "echeanceVariable": "pays"
    },
    "motif": "Page AMCI lue le 5 sept 2026 : aucune date ni procédure, uniquement l'ampleur du programme."
  },
  {
    "collection": "programs",
    "id": "universite-mohammed-vi-polytechnique-benguerir__mastercard-foundation-scholars-um6p",
    "attendu": {
      "deadline": "Non communiquée publiquement — cycle annuel, vérifier sur mastercardfdn.org"
    },
    "champs": {
      "deadline": "Aucune date sur la page de la Mastercard Foundation : le programme UM6P vise en priorité les jeunes femmes africaines et la candidature suit le calendrier d'admission d'UM6P (um6p.ma)."
    },
    "motif": "Page lue le 5 sept 2026 : licence et cycles supérieurs ; jeunes femmes africaines, réfugiées et personnes en situation de handicap incluses."
  },
  {
    "collection": "scholarships",
    "id": "mastercard-foundation-scholars-um6p",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://mastercardfdn.org/en/what-we-do/our-programs/mastercard-foundation-scholars-program/where-to-apply/universite-mohammed-vi-polytechnique/",
      "periodeOuverture": "Suit les admissions UM6P, en général au printemps pour la rentrée de septembre.",
      "exigences": [
        "admission_prealable"
      ]
    },
    "motif": "Page lue le 5 sept 2026 : licence et cycles supérieurs ; jeunes femmes africaines, réfugiées et personnes en situation de handicap incluses."
  },
  {
    "collection": "programs",
    "id": "delft-university-of-technology-delft__nl-scholarship",
    "attendu": {
      "deadline": "Cycle 2027-2028 ouvert depuis le 1er novembre 2026 — date limite propre à TU Delft, généralement entre février et mai 2027 (à confirmer sur le site de l'université)"
    },
    "champs": {
      "deadline": "La date limite DÉPEND DE L'UNIVERSITÉ : la candidature se dépose auprès de l'établissement néerlandais choisi (plus de 30 participants), chacun avec sa propre date de clôture, souvent entre février et mai. Les candidatures 2026-2027 avaient ouvert début novembre ; l'ouverture 2027-2028 devrait suivre le même rythme."
    },
    "motif": "Page lue le 5 sept 2026 : 5 000 € la première année ; nationalité hors EEE, licence ou master à temps plein, pas de diplôme néerlandais."
  },
  {
    "collection": "programs",
    "id": "university-of-amsterdam-amsterdam__nl-scholarship",
    "attendu": {
      "deadline": "Cycle 2027-2028 ouvert depuis le 1er novembre 2026 — date limite propre à l'UvA, généralement entre février et mai 2027 (à confirmer sur le site de l'université)"
    },
    "champs": {
      "deadline": "La date limite DÉPEND DE L'UNIVERSITÉ : la candidature se dépose auprès de l'établissement néerlandais choisi (plus de 30 participants), chacun avec sa propre date de clôture, souvent entre février et mai. Les candidatures 2026-2027 avaient ouvert début novembre ; l'ouverture 2027-2028 devrait suivre le même rythme."
    },
    "motif": "Page lue le 5 sept 2026 : 5 000 € la première année ; nationalité hors EEE, licence ou master à temps plein, pas de diplôme néerlandais."
  },
  {
    "collection": "scholarships",
    "id": "nl-scholarship",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.studyinnl.org/finances/nl-scholarship",
      "periodeOuverture": "Ouverture début novembre, clôtures propres à chaque université (février-mai).",
      "exigences": [
        "candidature_via_etablissement"
      ],
      "echeanceVariable": "etablissement"
    },
    "motif": "Page lue le 5 sept 2026 : 5 000 € la première année ; nationalité hors EEE, licence ou master à temps plein, pas de diplôme néerlandais."
  },
  {
    "collection": "programs",
    "id": "jagiellonian-university-cracovie__nawa-banach-scholarship",
    "attendu": {
      "deadline": "Cycle 2026-2027 clos le 8 mai 2026 — cycle 2027-2028 attendu ~mai 2027, dates officielles non encore publiées"
    },
    "champs": {
      "deadline": "Aucun appel en cours sur la page NAWA (seuls des appels terminé, de 2018 à 2025). Le programme ouvre d'habitude au printemps, avec une clôture vers avril-mai, pour les ressortissants des 36 pays de l'aide polonaise (Europe de l'Est, Asie, Afrique, Amérique latine)."
    },
    "motif": "Page lue le 5 sept 2026 : 2 500 PLN/mois, exonération de frais, allocation voyage."
  },
  {
    "collection": "programs",
    "id": "university-of-warsaw-varsovie__nawa-banach-scholarship",
    "attendu": {
      "deadline": "Cycle 2026-2027 clos le 8 mai 2026 — cycle 2027-2028 attendu ~mai 2027, dates officielles non encore publiées"
    },
    "champs": {
      "deadline": "Aucun appel en cours sur la page NAWA (seuls des appels terminé, de 2018 à 2025). Le programme ouvre d'habitude au printemps, avec une clôture vers avril-mai, pour les ressortissants des 36 pays de l'aide polonaise (Europe de l'Est, Asie, Afrique, Amérique latine)."
    },
    "motif": "Page lue le 5 sept 2026 : 2 500 PLN/mois, exonération de frais, allocation voyage."
  },
  {
    "collection": "scholarships",
    "id": "nawa-banach-scholarship",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://nawa.gov.pl/en/students/foreign-students/the-banach-scholarship-programme/",
      "periodeOuverture": "Appel annuel au printemps (clôture avril-mai).",
      "exigences": []
    },
    "motif": "Page lue le 5 sept 2026 : 2 500 PLN/mois, exonération de frais, allocation voyage."
  },
  {
    "collection": "programs",
    "id": "university-of-lisbon-lisbonne__bolsas-cooperacao-camoes",
    "attendu": {
      "deadline": "Aucune date limite fixe — calendrier propre à chaque pays d'origine, candidature via l'ambassade du Portugal"
    },
    "champs": {
      "deadline": "La date limite DÉPEND DU PAYS : la candidature se dépose exclusivement dans le pays d'origine auprès de l'autorité nationale compétente, en lien avec l'ambassade du Portugal. Réservé aux ressortissants de neuf pays : Angola, Cap-Vert, Colombie, Éthiopie, Guinée-Bissau, Mozambique, São Tomé-et-Príncipe, Sénégal et Timor-Leste."
    },
    "motif": "Page lue le 5 sept 2026 : 522,50 €/mois (licence), 914,38 € (master) ; doctorat désormais géré par la FCT."
  },
  {
    "collection": "programs",
    "id": "university-of-porto-porto__bolsas-cooperacao-camoes",
    "attendu": {
      "deadline": "Aucune date limite fixe — calendrier propre à chaque pays d'origine, candidature via l'ambassade du Portugal"
    },
    "champs": {
      "deadline": "La date limite DÉPEND DU PAYS : la candidature se dépose exclusivement dans le pays d'origine auprès de l'autorité nationale compétente, en lien avec l'ambassade du Portugal. Réservé aux ressortissants de neuf pays : Angola, Cap-Vert, Colombie, Éthiopie, Guinée-Bissau, Mozambique, São Tomé-et-Príncipe, Sénégal et Timor-Leste."
    },
    "motif": "Page lue le 5 sept 2026 : 522,50 €/mois (licence), 914,38 € (master) ; doctorat désormais géré par la FCT."
  },
  {
    "collection": "scholarships",
    "id": "bolsas-cooperacao-camoes",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.instituto-camoes.pt/activity/o-que-fazemos/bolsas-estudo/bolsas-camoes/bolsas-cooperacao/formacao-em-portugal",
      "periodeOuverture": "Selon le pays ; renouvellement de licence avant le 15 octobre de chaque année.",
      "exigences": [
        "nomination_autorite_nationale"
      ],
      "echeanceVariable": "pays"
    },
    "motif": "Page lue le 5 sept 2026 : 522,50 €/mois (licence), 914,38 € (master) ; doctorat désormais géré par la FCT."
  },
  {
    "collection": "programs",
    "id": "politehnica-bucuresti-bucarest__bourse-george-darie",
    "attendu": {
      "deadline": "Appel annuel en octobre-novembre — cycle 2025-2026 clos le 16 novembre 2025"
    },
    "champs": {
      "deadline": "La page officielle affiche encore le calendrier 2025-2026 : dépôt du 1er au 16 novembre 2025, résultats le 26 novembre 2025. ATTENTION : bourse en cours d'études réservée aux étudiants déjà inscrits à POLITEHNICA Bucarest. L'appel 2026-2027 devrait être annoncé fin octobre 2026 avec une clôture mi-novembre ; à recouper sur la page officielle."
    },
    "motif": "Page lue le 5 sept 2026 : « du 1er au 16 novembre 2025 » ; concours sur dossier PDF."
  },
  {
    "collection": "scholarships",
    "id": "bourse-george-darie",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://international.upb.ro/education/learning-opportunities/scholarships-programs/george-darie",
      "periodeOuverture": "Annonce fin octobre, dépôt première quinzaine de novembre.",
      "exigences": [
        "admission_prealable",
        "lettres_recommandation"
      ]
    },
    "motif": "Page lue le 5 sept 2026 : « du 1er au 16 novembre 2025 » ; concours sur dossier PDF."
  },
  {
    "collection": "programs",
    "id": "politehnica-bucuresti-bucarest__auf-petrache-poenaru",
    "attendu": {
      "deadline": "Appel 2026 clos le 15 avril 2026 — appel annuel à partir de 2027"
    },
    "champs": {
      "deadline": "L'appel 2026 s'est achevé le le 15 avril 2026 (résultats le 10 mai 2026). À partir de 2027 le stage de 3 mois se déroule du 1er mai au 31 juillet ; le prochain appel devrait ouvrir début 2027 avec une clôture vers la mi-avril. Réservé aux anciens boursiers Eugen Ionescu à POLITEHNICA Bucarest, français B2."
    },
    "motif": "Page lue le 5 sept 2026 : « avant le 15 avril 2026 » ; 1 000 €/mois, billet, assurance ; universités membres de l'AUF (pays OIF ou Algérie)."
  },
  {
    "collection": "scholarships",
    "id": "auf-petrache-poenaru",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.auf.org/bourses-de-recherche-petrache-poenaru-appel-2026/",
      "periodeOuverture": "Appel annuel en début d'année, clôture mi-avril, stage mai-juillet.",
      "exigences": [
        "projet_recherche",
        "certification_langue_requise"
      ],
      "ageMax": {
        "tous": 35
      },
      "ageMaxNote": "35 ans ou moins en décembre de l'année de candidature."
    },
    "motif": "Page lue le 5 sept 2026 : « avant le 15 avril 2026 » ; 1 000 €/mois, billet, assurance ; universités membres de l'AUF (pays OIF ou Algérie)."
  },
  {
    "collection": "programs",
    "id": "politehnica-bucuresti-bucarest__auf-eugen-ionescu",
    "attendu": {
      "deadline": "Cycle 2025-2026 clos le 30 novembre 2025 — prochain appel attendu vers octobre 2026"
    },
    "champs": {
      "deadline": "L'appel 2025-2026 est terminé (résultats annoncés mi-février). Le prochain appel devrait être lancé à l'automne 2026 pour des stages de 3 mois en Roumanie en 2027 ; la date de clôture n'est pas encore publiée."
    },
    "motif": "Page lue le 5 sept 2026 : doctorants et postdoctorants d'établissements membres de l'AUF (pays OIF ou Algérie) ; plus de 30 établissements d'accueil roumains."
  },
  {
    "collection": "programs",
    "id": "universite-de-bucarest-bucarest__auf-eugen-ionescu",
    "attendu": {
      "deadline": "Cycle 2025-2026 clos le 30 novembre 2025 — prochain appel attendu vers octobre 2026"
    },
    "champs": {
      "deadline": "L'appel 2025-2026 est terminé (résultats annoncés mi-février). Le prochain appel devrait être lancé à l'automne 2026 pour des stages de 3 mois en Roumanie en 2027 ; la date de clôture n'est pas encore publiée."
    },
    "motif": "Page lue le 5 sept 2026 : doctorants et postdoctorants d'établissements membres de l'AUF (pays OIF ou Algérie) ; plus de 30 établissements d'accueil roumains."
  },
  {
    "collection": "scholarships",
    "id": "auf-eugen-ionescu",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.auf.org/projet/bourses-de-recherche-doctorale-et-post-doctorale-eugen-ionescu/",
      "periodeOuverture": "Appel annuel à l'automne, résultats en février, stages au printemps.",
      "exigences": [
        "projet_recherche"
      ]
    },
    "motif": "Page lue le 5 sept 2026 : doctorants et postdoctorants d'établissements membres de l'AUF (pays OIF ou Algérie) ; plus de 30 établissements d'accueil roumains."
  },
  {
    "collection": "programs",
    "id": "universite-de-bucarest-bucarest__unibuc-international-scholarships",
    "attendu": {
      "deadline": "Dépôt en juillet précédant l'année universitaire — échéance de juillet 2026 passée, prochaine en juillet 2027"
    },
    "champs": {
      "deadline": "Les dossiers se déposent en juillet de l'année universitaire précédant celle de l'aide (« in July of the academic year preceding the one for which the application is made ») ; la fenêtre 2026 est passée, la prochaine sera en juillet 2027. Réservée aux étudiants hors UE déjà inscrits et payant leurs frais en devises, après au moins une année de licence."
    },
    "motif": "Page lue le 5 sept 2026 : réduction de 50 % des frais (licence, master) ou bourse mensuelle (doctorat) ; jusqu'à 10 places pour les ressortissants de pays en développement."
  },
  {
    "collection": "scholarships",
    "id": "unibuc-international-scholarships",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://unibuc.ro/international/scholarships-and-financial-aid-offered-by-the-university-of-bucharest/?lang=en",
      "periodeOuverture": "Dépôt chaque année en juillet.",
      "exigences": [
        "admission_prealable"
      ]
    },
    "motif": "Page lue le 5 sept 2026 : réduction de 50 % des frais (licence, master) ou bourse mensuelle (doctorat) ; jusqu'à 10 places pour les ressortissants de pays en développement."
  },
  {
    "collection": "programs",
    "id": "politehnica-bucuresti-bucarest__politehnica-excellence-scholarship",
    "attendu": {
      "deadline": "Calendrier non publié — recrutement par voie diplomatique via les ambassades de Roumanie",
      "status": "Fermée"
    },
    "champs": {
      "deadline": "Aucune date publiée : les candidats doivent être nommés par voie diplomatique par les partenaires autorisés de POLITEHNICA Bucarest (« officially nominated through diplomatic channels »), qui fixent leur propre calendrier. Règlement 2026 en ligne.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : moyenne au bac ≥ 8/10, pas de nationalité roumaine, prix ou olympiades valorisés."
  },
  {
    "collection": "scholarships",
    "id": "politehnica-excellence-scholarship",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://international.upb.ro/education/learning-opportunities/scholarships-programs/politehnica-excellence-scholarship",
      "periodeOuverture": "Selon le pays, par nomination diplomatique.",
      "exigences": [
        "nomination_autorite_nationale"
      ],
      "echeanceVariable": "pays",
      "ageMax": {
        "tous": 35
      },
      "ageMaxNote": "Moins de 35 ans au 31 décembre de l'année de nomination."
    },
    "motif": "Page lue le 5 sept 2026 : moyenne au bac ≥ 8/10, pas de nationalité roumaine, prix ou olympiades valorisés."
  },
  {
    "collection": "programs",
    "id": "politehnica-bucuresti-bucarest__romanian-government-scholarship",
    "attendu": {
      "deadline": "Cycle 2025-2026 clos le 31 mars 2026 — prochaine fenêtre estimée février-mars 2027"
    },
    "champs": {
      "deadline": "L'appel 2026-2027 s'est achevé le le 31 mars 2026 (résultats vers le 15 juillet 2026). L'appel 2027-2028 devrait ouvrir en janvier 2027 avec une clôture fin mars 2027 ; à recouper sur la page officielle sur studyinromania.gov.ro."
    },
    "motif": "Page lue le 5 sept 2026 : « 31 March 2026 » ; licence et master en roumain uniquement, doctorat possible en anglais ; médecine, dentaire et pharmacie exclues ; documents apostillés."
  },
  {
    "collection": "programs",
    "id": "universite-de-bucarest-bucarest__romanian-government-scholarship",
    "attendu": {
      "deadline": "Cycle 2026-2027 clos le 31 mars 2026 — prochaine fenêtre (cycle 2027-2028) estimée février-mars 2027, date officielle non encore annoncée"
    },
    "champs": {
      "deadline": "L'appel 2026-2027 s'est achevé le le 31 mars 2026 (résultats vers le 15 juillet 2026). L'appel 2027-2028 devrait ouvrir en janvier 2027 avec une clôture fin mars 2027 ; à recouper sur la page officielle sur studyinromania.gov.ro."
    },
    "motif": "Page lue le 5 sept 2026 : « 31 March 2026 » ; licence et master en roumain uniquement, doctorat possible en anglais ; médecine, dentaire et pharmacie exclues ; documents apostillés."
  },
  {
    "collection": "scholarships",
    "id": "romanian-government-scholarship",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://studyinromania.gov.ro/mfa_2026-2027",
      "periodeOuverture": "Appel annuel de janvier à fin mars.",
      "exigences": []
    },
    "motif": "Page lue le 5 sept 2026 : « 31 March 2026 » ; licence et master en roumain uniquement, doctorat possible en anglais ; médecine, dentaire et pharmacie exclues ; documents apostillés."
  },
  {
    "collection": "programs",
    "id": "university-of-oxford-oxford__clarendon-fund-scholarships",
    "attendu": {
      "deadline": "Échéance de financement de décembre 2026 ou janvier 2027, propre à chaque cours"
    },
    "champs": {
      "deadline": "Aucune candidature séparée : il suffit de déposer sa demande d'admission à Oxford avant la date limite de décembre ou de janvier propre au programme visé (« You must apply by the January deadline relevant to your course »). Les dates exactes figurent sur la page de chaque formation."
    },
    "motif": "Page lue le 5 sept 2026 : master et DPhil, tous pays, mérite académique uniquement."
  },
  {
    "collection": "scholarships",
    "id": "clarendon-fund-scholarships",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.ox.ac.uk/clarendon/information-for-applicants/eligibility",
      "periodeOuverture": "Suit les dates limites d'admission d'Oxford, en décembre et janvier.",
      "exigences": [
        "admission_prealable"
      ],
      "echeanceVariable": "etablissement"
    },
    "motif": "Page lue le 5 sept 2026 : master et DPhil, tous pays, mérite académique uniquement."
  },
  {
    "collection": "programs",
    "id": "imperial-college-london-london__commonwealth-masters-scholarships__master",
    "attendu": {},
    "champs": {
      "deadline": "Clôture le 20 octobre 2026 à 16h00 (BST) pour l'année 2027-2028 ; ouverture des candidatures le 8 septembre 2026 sur CSC Central. Les organismes nominateurs nationaux transmettent ensuite leurs dossiers avant décembre 2026 ; résultats d'ici juillet 2027.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « will open on Tuesday 8 September », « 16:00 BST on Tuesday 20 October » ; licence 2:1 minimum, engagement de retour ; statut Fermée + date future → « pas encore ouverte » (ouverture dans 3 jours)."
  },
  {
    "collection": "programs",
    "id": "university-of-edinburgh-edinburgh__commonwealth-masters-scholarships__master",
    "attendu": {},
    "champs": {
      "deadline": "Clôture le 20 octobre 2026 à 16h00 (BST) pour l'année 2027-2028 ; ouverture des candidatures le 8 septembre 2026 sur CSC Central. Les organismes nominateurs nationaux transmettent ensuite leurs dossiers avant décembre 2026 ; résultats d'ici juillet 2027.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « will open on Tuesday 8 September », « 16:00 BST on Tuesday 20 October » ; licence 2:1 minimum, engagement de retour ; statut Fermée + date future → « pas encore ouverte » (ouverture dans 3 jours)."
  },
  {
    "collection": "programs",
    "id": "university-of-oxford-oxford__commonwealth-masters-scholarships__master",
    "attendu": {},
    "champs": {
      "deadline": "Clôture le 20 octobre 2026 à 16h00 (BST) pour l'année 2027-2028 ; ouverture des candidatures le 8 septembre 2026 sur CSC Central. Les organismes nominateurs nationaux transmettent ensuite leurs dossiers avant décembre 2026 ; résultats d'ici juillet 2027.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « will open on Tuesday 8 September », « 16:00 BST on Tuesday 20 October » ; licence 2:1 minimum, engagement de retour ; statut Fermée + date future → « pas encore ouverte » (ouverture dans 3 jours)."
  },
  {
    "collection": "scholarships",
    "id": "commonwealth-masters-scholarships",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://cscuk.fcdo.gov.uk/scholarships/commonwealth-masters-scholarships/",
      "periodeOuverture": "Ouverture début septembre, clôture mi-octobre, nominations en décembre.",
      "exigences": [
        "nomination_autorite_nationale"
      ],
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « will open on Tuesday 8 September », « 16:00 BST on Tuesday 20 October » ; licence 2:1 minimum, engagement de retour ; statut Fermée + date future → « pas encore ouverte » (ouverture dans 3 jours).",
    "attendu": {
      "status": "Ouverte"
    }
  },
  {
    "collection": "programs",
    "id": "imperial-college-london-london__commonwealth-phd-scholarships__doctorat",
    "attendu": {},
    "champs": {
      "deadline": "Clôture le 20 octobre 2026 à 16h00 (BST) pour l'année 2027-2028 ; ouverture des candidatures le 8 septembre 2026 sur CSC Central, avec nomination obligatoire par une agence nationale ou une ONG partenaire. Réservé à 17 pays du Commonwealth les moins développés ou fragiles (Gambie, Nigeria, Rwanda, Sierra Leone, Togo, Ouganda, Zambie…).",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « will open on Tuesday 8 September », « 16.00 BST on Tuesday 20 October » ; 36 mois financés."
  },
  {
    "collection": "programs",
    "id": "university-of-edinburgh-edinburgh__commonwealth-phd-scholarships__doctorat",
    "attendu": {},
    "champs": {
      "deadline": "Clôture le 20 octobre 2026 à 16h00 (BST) pour l'année 2027-2028 ; ouverture des candidatures le 8 septembre 2026 sur CSC Central, avec nomination obligatoire par une agence nationale ou une ONG partenaire. Réservé à 17 pays du Commonwealth les moins développés ou fragiles (Gambie, Nigeria, Rwanda, Sierra Leone, Togo, Ouganda, Zambie…).",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « will open on Tuesday 8 September », « 16.00 BST on Tuesday 20 October » ; 36 mois financés."
  },
  {
    "collection": "programs",
    "id": "university-of-oxford-oxford__commonwealth-phd-scholarships__doctorat",
    "attendu": {},
    "champs": {
      "deadline": "Clôture le 20 octobre 2026 à 16h00 (BST) pour l'année 2027-2028 ; ouverture des candidatures le 8 septembre 2026 sur CSC Central, avec nomination obligatoire par une agence nationale ou une ONG partenaire. Réservé à 17 pays du Commonwealth les moins développés ou fragiles (Gambie, Nigeria, Rwanda, Sierra Leone, Togo, Ouganda, Zambie…).",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « will open on Tuesday 8 September », « 16.00 BST on Tuesday 20 October » ; 36 mois financés."
  },
  {
    "collection": "scholarships",
    "id": "commonwealth-phd-scholarships",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://cscuk.fcdo.gov.uk/scholarships/commonwealth-phd-scholarships/",
      "periodeOuverture": "Ouverture début septembre, clôture mi-octobre.",
      "exigences": [
        "nomination_autorite_nationale",
        "projet_recherche"
      ],
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « will open on Tuesday 8 September », « 16.00 BST on Tuesday 20 October » ; 36 mois financés.",
    "attendu": {
      "status": "Ouverte"
    }
  },
  {
    "collection": "programs",
    "id": "university-of-oxford-oxford__weidenfeld-hoffmann-scholarships",
    "attendu": {
      "deadline": "Échéance de décembre 2026 ou janvier 2027, propre à chaque cours"
    },
    "champs": {
      "deadline": "Aucune candidature séparée : cocher la bourse dans le formulaire d'admission au master d'Oxford et joindre la « Weidenfeld-Hoffmann Scholarships Statement » avant la date limite de décembre ou janvier propre au programme visé ; décisions d'ici fin mai 2027. Réservée aux résidents de plus de 160 pays en développement ou émergents."
    },
    "motif": "Page lue le 5 sept 2026 : « by the relevant December or January deadline for your course » ; 100 % des frais + au moins 21 805 £ ; retour au pays exigé."
  },
  {
    "collection": "scholarships",
    "id": "weidenfeld-hoffmann-scholarships",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.ox.ac.uk/admissions/graduate/fees-and-funding/fees-funding-and-scholarship-search/weidenfeld-hoffmann-scholarships-and-leadership-programme",
      "periodeOuverture": "Suit les dates limites d'admission d'Oxford (décembre-janvier).",
      "exigences": [
        "admission_prealable"
      ],
      "echeanceVariable": "etablissement"
    },
    "motif": "Page lue le 5 sept 2026 : « by the relevant December or January deadline for your course » ; 100 % des frais + au moins 21 805 £ ; retour au pays exigé."
  },
  {
    "collection": "programs",
    "id": "imperial-college-london-london__commonwealth-shared-scholarships__master",
    "attendu": {},
    "champs": {
      "deadline": "L'appel 2026-2027 est terminé (« Applications … for the 2026/27 academic year are now closed »). La candidature passe par les universités britanniques partenaires, qui présélectionnent ; l'appel 2027-2028 devrait ouvrir en décembre 2026 avec une clôture propre à chaque université (souvent mars-avril) ; à recouper sur la page officielle.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : licence 2:1, moins d'un an d'études dans un pays à haut revenu."
  },
  {
    "collection": "programs",
    "id": "university-of-edinburgh-edinburgh__commonwealth-shared-scholarships__master",
    "attendu": {},
    "champs": {
      "deadline": "L'appel 2026-2027 est terminé (« Applications … for the 2026/27 academic year are now closed »). La candidature passe par les universités britanniques partenaires, qui présélectionnent ; l'appel 2027-2028 devrait ouvrir en décembre 2026 avec une clôture propre à chaque université (souvent mars-avril) ; à recouper sur la page officielle.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : licence 2:1, moins d'un an d'études dans un pays à haut revenu."
  },
  {
    "collection": "programs",
    "id": "university-of-oxford-oxford__commonwealth-shared-scholarships__master",
    "attendu": {},
    "champs": {
      "deadline": "L'appel 2026-2027 est terminé (« Applications … for the 2026/27 academic year are now closed »). La candidature passe par les universités britanniques partenaires, qui présélectionnent ; l'appel 2027-2028 devrait ouvrir en décembre 2026 avec une clôture propre à chaque université (souvent mars-avril) ; à recouper sur la page officielle.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : licence 2:1, moins d'un an d'études dans un pays à haut revenu."
  },
  {
    "collection": "scholarships",
    "id": "commonwealth-shared-scholarships",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://cscuk.fcdo.gov.uk/scholarships/commonwealth-shared-scholarships-applications/",
      "periodeOuverture": "Ouverture en décembre, clôtures universitaires en mars-avril.",
      "exigences": [
        "candidature_via_etablissement"
      ],
      "echeanceVariable": "etablissement"
    },
    "motif": "Page lue le 5 sept 2026 : licence 2:1, moins d'un an d'études dans un pays à haut revenu."
  },
  {
    "collection": "programs",
    "id": "imperial-college-london-london__great-scholarships",
    "attendu": {
      "deadline": "Cycle 2026 clos ; cycle 2027-28 annoncé à l'automne 2026",
      "status": "Fermée"
    },
    "champs": {
      "deadline": "La date limite DÉPEND DE L'UNIVERSITÉ : chaque université britannique participante fixe sa propre date (souvent entre mars et juin) pour les étudiants des 18 pays éligibles (dont Égypte, Kenya, Nigeria, Ghana, Turquie, France, Chine, Inde…). Consulter la page du pays sur le site du British Council.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : 10 000 £ sur les frais d'un master d'un an ; plus de 140 bourses dans plus de 60 universités pour 2026-27."
  },
  {
    "collection": "scholarships",
    "id": "great-scholarships",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://study-uk.britishcouncil.org/scholarships-funding/great-scholarships",
      "periodeOuverture": "Appels annuels des universités, clôtures au printemps.",
      "exigences": [
        "candidature_via_etablissement"
      ],
      "echeanceVariable": "etablissement"
    },
    "motif": "Page lue le 5 sept 2026 : 10 000 £ sur les frais d'un master d'un an ; plus de 140 bourses dans plus de 60 universités pour 2026-27."
  },
  {
    "collection": "programs",
    "id": "imperial-college-london-london__imperial-presidents-phd-scholarships",
    "attendu": {
      "deadline": "Vagues 2027-28 attendues à l'automne 2026 (les trois vagues 2026-27 sont passées)"
    },
    "champs": {
      "deadline": "La page officielle affiche encore le calendrier 2026-27 : trois tours terminé le 3 novembre 2025, le 12 janvier 2026 et le 2 mars 2026. Le calendrier 2027-28 devrait suivre le même rythme (premier tour début novembre 2026) ; à recouper sur la page officielle. Il faut d'abord obtenir l'accord d'un directeur de thèse à Imperial."
    },
    "motif": "Page lue le 5 sept 2026 : 3,5 ans financés, allocation 26 500 £/an + 2 000 £/an."
  },
  {
    "collection": "scholarships",
    "id": "imperial-presidents-phd-scholarships",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.imperial.ac.uk/study/fees-and-funding/postgraduate-doctoral/grants-scholarships/presidents-phd/",
      "periodeOuverture": "Trois tours : début novembre, mi-janvier, début mars.",
      "exigences": [
        "directeur_these",
        "projet_recherche"
      ]
    },
    "motif": "Page lue le 5 sept 2026 : 3,5 ans financés, allocation 26 500 £/an + 2 000 £/an."
  },
  {
    "collection": "programs",
    "id": "university-of-oxford-oxford__mastercard-foundation-afox-oxford",
    "attendu": {
      "deadline": "Cycle 2026/27 clos (septembre 2025 – janvier 2026) ; dates du cycle suivant non publiées",
      "status": "Fermée"
    },
    "champs": {
      "deadline": "Aucune candidature séparée : déposer sa demande d'admission à un master enseigné d'un an à Oxford avant la date limite de financement de décembre ou janvier propre au programme (calendrier 2026/27 : septembre 2025 → janvier 2026). Réservé aux citoyens africains résidant en Afrique, sans diplôme supérieur préalable.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : frais, vie, vol retour, visa et assurance couverts ; leadership et service communautaire exigés."
  },
  {
    "collection": "scholarships",
    "id": "mastercard-foundation-afox-oxford",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.afox.ox.ac.uk/education/mastercard-foundation-scholars-program-at-the-university-of-oxford",
      "periodeOuverture": "Suit les dates limites d'admission d'Oxford (décembre-janvier).",
      "exigences": [
        "admission_prealable"
      ],
      "echeanceVariable": "etablissement"
    },
    "motif": "Page lue le 5 sept 2026 : frais, vie, vol retour, visa et assurance couverts ; leadership et service communautaire exigés."
  },
  {
    "collection": "programs",
    "id": "university-of-oxford-oxford__reach-oxford-scholarship",
    "attendu": {
      "deadline": "Modalités d'entrée 2027 publiées en janvier 2027 (cycle 2026 clos le 4 février 2026)",
      "status": "Fermée"
    },
    "champs": {
      "deadline": "Clôture le 26 janvier 2027 pour l'entrée en octobre 2027 ; il faut d'abord avoir déposé sa candidature d'admission en licence à Oxford (UCAS, mi-octobre 2026). Sélection en avril, résultats fin mai 2027. Réservée aux ressortissants des pays bénéficiaires de l'aide du CAD-OCDE ; médecine exclue.",
      "status": "Ouverte"
    },
    "motif": "Page lue le 5 sept 2026 : « 26 January 2027 » ; 2 à 3 bourses par an ; besoin financier et engagement social."
  },
  {
    "collection": "scholarships",
    "id": "reach-oxford-scholarship",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.ox.ac.uk/admissions/undergraduate/fees-and-funding/oxford-bursaries-and-scholarships/reach-oxford",
      "periodeOuverture": "UCAS mi-octobre, bourse fin janvier, résultats fin mai.",
      "exigences": [
        "admission_prealable"
      ],
      "status": "Ouverte"
    },
    "motif": "Page lue le 5 sept 2026 : « 26 January 2027 » ; 2 à 3 bourses par an ; besoin financier et engagement social.",
    "attendu": {
      "status": "Fermée"
    }
  },
  {
    "collection": "programs",
    "id": "university-of-oxford-oxford__rhodes-scholarships-west-africa",
    "attendu": {
      "deadline": "Cohorte 2027 close le 27 août 2026 — prochaine ouverture attendue vers juin 2027"
    },
    "champs": {
      "deadline": "L'appel 2027 pour l'Afrique de l'Ouest s'est achevé le le 27 août 2026 à 23h59 (GMT), après ouverture le 1er juin 2026. Le prochain appel devrait ouvrir le 1er juin 2027 avec une clôture fin août 2027. Trois bourses par an pour vingt pays d'Afrique de l'Ouest."
    },
    "motif": "Page lue le 5 sept 2026 : « 23:59 GMT 27 August 2026 » ; pas de limite d'âge affichée sur cette page régionale."
  },
  {
    "collection": "scholarships",
    "id": "rhodes-scholarships-west-africa",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.rhodeshouse.ox.ac.uk/scholarships/applications/west-africa/",
      "periodeOuverture": "Ouverture le 1er juin, clôture fin août.",
      "exigences": []
    },
    "motif": "Page lue le 5 sept 2026 : « 23:59 GMT 27 August 2026 » ; pas de limite d'âge affichée sur cette page régionale."
  },
  {
    "collection": "programs",
    "id": "hse-university-moscow__hse-merit-scholarships",
    "attendu": {
      "deadline": "Cycle 2026 clos — inscriptions du 20 juin au 3 août 2026 (licence) et 8 août (master)",
      "status": "Fermée"
    },
    "champs": {
      "deadline": "Aucune candidature séparée : la réduction de frais (jusqu'à 70 % en licence, 50 % en master) est attribuée automatiquement selon les points obtenus aux examens d'entrée ou au concours de portfolio, à l'inscription. La date qui compte est celle de l'admission à HSE. La page enregistrée date de 2019 : vérifier les barèmes actuels sur admissions.hse.ru.",
      "status": "Fermée"
    },
    "motif": "Article lu le 5 sept 2026 : barèmes 170/150/130 points (licence), 75/60 points (master) ; article daté du 24 janvier 2019."
  },
  {
    "collection": "scholarships",
    "id": "hse-merit-scholarships",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.hse.ru/en/news/admission/229679392.html",
      "periodeOuverture": "Suit le calendrier d'admission internationale de HSE (candidatures jusqu'à l'été).",
      "exigences": [
        "admission_prealable"
      ]
    },
    "motif": "Article lu le 5 sept 2026 : barèmes 170/150/130 points (licence), 75/60 points (master) ; article daté du 24 janvier 2019."
  },
  {
    "collection": "programs",
    "id": "hse-university-moscow__hse-into-olympiad",
    "attendu": {
      "deadline": "Dates du cycle en cours non publiées — dernier calendrier connu : 26 août au 26 octobre"
    },
    "champs": {
      "deadline": "La page anglaise affiche encore le calendrier 2025 : inscription du 26 août au 26 octobre 2025, épreuves du 5 au 15 novembre 2025, et annonce que les informations sur la prochaine édition seront publiées bientôt. L'édition 2026 devrait suivre le même rythme (inscription fin août → fin octobre) ; à recouper sur la page officielle sur la page russe."
    },
    "motif": "Page lue le 5 sept 2026 : « August 26 - October 26, 2025 » ; olympiade internationale en anglais pour lycéens, donnant droit aux réductions HSE."
  },
  {
    "collection": "scholarships",
    "id": "hse-into-olympiad",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://olymp.hse.ru/en/inter/",
      "periodeOuverture": "Inscription fin août → fin octobre, épreuves en novembre.",
      "exigences": []
    },
    "motif": "Page lue le 5 sept 2026 : « August 26 - October 26, 2025 » ; olympiade internationale en anglais pour lycéens, donnant droit aux réductions HSE."
  },
  {
    "collection": "programs",
    "id": "spbu-saint-petersbourg__spbu-open-olympiad__licence",
    "attendu": {},
    "champs": {
      "deadline": "La page affiche le cycle 2026 : candidatures du 12 novembre 2025 au 6 février 2026, résultats le 13 mars 2026. Le cycle 2027 devrait ouvrir mi-novembre 2026 avec une clôture début février 2027 ; à recouper sur la page officielle sur abiturient.spbu.ru. Sélection par olympiade ouverte (épreuves de russe + concours de portfolio).",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « The deadline for applications is 6 February 2026 » ; places financées par le budget fédéral (décret n° 2150)."
  },
  {
    "collection": "programs",
    "id": "spbu-saint-petersbourg__spbu-open-olympiad__master",
    "attendu": {},
    "champs": {
      "deadline": "La page affiche le cycle 2026 : candidatures du 12 novembre 2025 au 6 février 2026, résultats le 13 mars 2026. Le cycle 2027 devrait ouvrir mi-novembre 2026 avec une clôture début février 2027 ; à recouper sur la page officielle sur abiturient.spbu.ru. Sélection par olympiade ouverte (épreuves de russe + concours de portfolio).",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « The deadline for applications is 6 February 2026 » ; places financées par le budget fédéral (décret n° 2150)."
  },
  {
    "collection": "scholarships",
    "id": "spbu-open-olympiad",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://english.spbu.ru/news-events/news/admission-russian-government-scholarship-opens-international-applicants",
      "periodeOuverture": "Ouverture mi-novembre, clôture début février, résultats mi-mars.",
      "exigences": [
        "certification_langue_requise"
      ]
    },
    "motif": "Page lue le 5 sept 2026 : « The deadline for applications is 6 February 2026 » ; places financées par le budget fédéral (décret n° 2150)."
  },
  {
    "collection": "programs",
    "id": "aims-rwanda-kigali__aims-rwanda-masters-mathematical-sciences__master",
    "attendu": {},
    "champs": {
      "deadline": "La page de candidature affiche encore une date de 2024 (« Application Deadline: 29 March 2024 ») alors que la promotion 2026-2027 a déjà été accueillie. L'appel de la promotion 2027-2028 devrait ouvrir à l'automne 2026 avec une clôture vers fin mars 2027 ; à recouper sur la page officielle sur apply.aims-network.org.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : page non mise à jour depuis 2024 ; diplôme de 4 ans à forte composante mathématique."
  },
  {
    "collection": "scholarships",
    "id": "aims-rwanda-masters-mathematical-sciences",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://aims.ac.rw/application/masters-in-mathematical-sciences-application/",
      "periodeOuverture": "Appel annuel, clôture fin mars ; bourse complète pour tous les admis.",
      "exigences": []
    },
    "motif": "Page lue le 5 sept 2026 : page non mise à jour depuis 2024 ; diplôme de 4 ans à forte composante mathématique."
  },
  {
    "collection": "programs",
    "id": "african-leadership-university-kigali__mastercard-foundation-scholars-alu__licence",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date sur la page : la bourse Mastercard Foundation à ALU s'obtient via la demande d'admission et d'aide financière d'ALU (help.alueducation.com), avec priorité aux jeunes femmes, réfugiés et personnes en situation de handicap de toute l'Afrique.",
      "status": "Ouverte"
    },
    "motif": "Page lue le 5 sept 2026 : 768 bourses depuis 2020, boursiers de 32 pays."
  },
  {
    "collection": "scholarships",
    "id": "mastercard-foundation-scholars-alu",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.alueducation.com/mastercard-foundation-scholars-program-at-alu/",
      "periodeOuverture": "Suit les rentrées d'ALU (plusieurs par an).",
      "exigences": [
        "admission_prealable"
      ],
      "status": "Ouverte"
    },
    "motif": "Page lue le 5 sept 2026 : 768 bourses depuis 2020, boursiers de 32 pays.",
    "attendu": {
      "status": "Admissions à entrées multiples, aucune date limite de bourse publiée"
    }
  },
  {
    "collection": "programs",
    "id": "carnegie-mellon-university-africa-kigali__mastercard-foundation-scholars-cmu-africa__master",
    "attendu": {},
    "champs": {
      "deadline": "Aucune candidature séparée : il faut d'abord être admis à l'un des masters de CMU-Africa (IT, Engineering AI, ECE) ; la bourse est attribuée parmi les admis sur talent, engagement communautaire et leadership. La date qui compte est celle de l'admission à CMU-Africa.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « students must first be admitted to one of CMU-Africa's programs »."
  },
  {
    "collection": "scholarships",
    "id": "mastercard-foundation-scholars-cmu-africa",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.africa.engineering.cmu.edu/impact/mastercard-foundation-scholars.html",
      "periodeOuverture": "Suit le calendrier d'admission de CMU-Africa (rentrée d'août).",
      "exigences": [
        "admission_prealable"
      ]
    },
    "motif": "Page lue le 5 sept 2026 : « students must first be admitted to one of CMU-Africa's programs »."
  },
  {
    "collection": "programs",
    "id": "university-of-rwanda-kigali__mastercard-foundation-scholars-university-of-rwanda__licence",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date sur le portail : les candidatures se déposent via le portail en ligne du programme à l'Université du Rwanda, ouvert aux Rwandais, aux citoyens de tout pays africain, aux réfugiés et jeunes déplacés.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « Interested applicants apply through an online application portal »."
  },
  {
    "collection": "programs",
    "id": "university-of-rwanda-kigali__mastercard-foundation-scholars-university-of-rwanda__master",
    "attendu": {},
    "champs": {
      "deadline": "Aucune date sur le portail : les candidatures se déposent via le portail en ligne du programme à l'Université du Rwanda, ouvert aux Rwandais, aux citoyens de tout pays africain, aux réfugiés et jeunes déplacés.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « Interested applicants apply through an online application portal »."
  },
  {
    "collection": "scholarships",
    "id": "mastercard-foundation-scholars-university-of-rwanda",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://mcfsp.ur.ac.rw/",
      "periodeOuverture": "Appels publiés sur le portail, en général au printemps pour la rentrée de septembre.",
      "exigences": []
    },
    "motif": "Page lue le 5 sept 2026 : « Interested applicants apply through an online application portal »."
  },
  {
    "collection": "programs",
    "id": "iheid-geneve__iheid-scholarships__doctorat",
    "attendu": {},
    "champs": {
      "deadline": "Clôture le 15 janvier 2027 pour les masters (rentrée septembre 2027) : aucune demande de bourse séparée, le comité d'aide financière examine les dossiers d'admission complets (justificatifs financiers inclus) selon le besoin et le mérite. Pour le doctorat avec bourse d'excellence de la Confédération : candidature au programme entre le 1er octobre et le 15 décembre.",
      "status": "Ouverte"
    },
    "motif": "Page lue le 5 sept 2026 : « 15 January » pour les masters ; « between 1st October and 15 December » pour les PhD ; pas de candidature directe à une bourse."
  },
  {
    "collection": "programs",
    "id": "iheid-geneve__iheid-scholarships__master",
    "attendu": {},
    "champs": {
      "deadline": "Clôture le 15 janvier 2027 pour les masters (rentrée septembre 2027) : aucune demande de bourse séparée, le comité d'aide financière examine les dossiers d'admission complets (justificatifs financiers inclus) selon le besoin et le mérite. Pour le doctorat avec bourse d'excellence de la Confédération : candidature au programme entre le 1er octobre et le 15 décembre.",
      "status": "Ouverte"
    },
    "motif": "Page lue le 5 sept 2026 : « 15 January » pour les masters ; « between 1st October and 15 December » pour les PhD ; pas de candidature directe à une bourse."
  },
  {
    "collection": "scholarships",
    "id": "iheid-scholarships",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.graduateinstitute.ch/specific-scholarships",
      "periodeOuverture": "Admission master jusqu'au 15 janvier ; doctorat du 1er octobre au 15 décembre.",
      "exigences": [
        "admission_prealable"
      ]
    },
    "motif": "Page lue le 5 sept 2026 : « 15 January » pour les masters ; « between 1st October and 15 December » pour les PhD ; pas de candidature directe à une bourse."
  },
  {
    "collection": "programs",
    "id": "epfl-lausanne__zeno-karl-schindler-master-thesis__master",
    "attendu": {},
    "champs": {
      "deadline": "Clôture le 1er novembre 2026 à 23h59 (heure suisse), puis le 1er mai 2027 : deux échéances par an (1er mai et 1er novembre). Le projet de mémoire doit associer deux universités de deux pays différents, dont une en Suisse ; réservé aux meilleurs étudiants (environ 10-15 % de tête).",
      "status": "Ouverte"
    },
    "motif": "Page lue le 5 sept 2026 : « Twice a year : May 1st and November 1st of each year, at 23:59 (Swiss time) » ; 2 000 CHF/mois pendant 3 à 6 mois + voyage ; frais d'inscription non couverts."
  },
  {
    "collection": "programs",
    "id": "eth-zurich-zurich__zeno-karl-schindler-master-thesis__master",
    "attendu": {},
    "champs": {
      "deadline": "Clôture le 1er novembre 2026 à 23h59 (heure suisse), puis le 1er mai 2027 : deux échéances par an (1er mai et 1er novembre). Le projet de mémoire doit associer deux universités de deux pays différents, dont une en Suisse ; réservé aux meilleurs étudiants (environ 10-15 % de tête).",
      "status": "Ouverte"
    },
    "motif": "Page lue le 5 sept 2026 : « Twice a year : May 1st and November 1st of each year, at 23:59 (Swiss time) » ; 2 000 CHF/mois pendant 3 à 6 mois + voyage ; frais d'inscription non couverts."
  },
  {
    "collection": "scholarships",
    "id": "zeno-karl-schindler-master-thesis",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://zenokarlschindler-foundation.ch/master-thesis-grant/",
      "periodeOuverture": "Deux échéances fixes par an : 1er mai et 1er novembre.",
      "exigences": [
        "projet_recherche",
        "admission_prealable"
      ]
    },
    "motif": "Page lue le 5 sept 2026 : « Twice a year : May 1st and November 1st of each year, at 23:59 (Swiss time) » ; 2 000 CHF/mois pendant 3 à 6 mois + voyage ; frais d'inscription non couverts."
  },
  {
    "collection": "programs",
    "id": "universite-de-fribourg-fribourg__unifr-research-scholarships__doctorat",
    "attendu": {},
    "champs": {
      "deadline": "Clôture le 28 février 2027 pour un séjour à partir du 1er septembre 2027 (le formulaire de candidature n'est publié que le 1er novembre) ; autre échéance le 30 juin 2027 pour un séjour à partir du 1er février 2028 (formulaire publié le 1er avril). Doctorants (séjour de 5 mois) et postdoctorants (3 mois) résidant à l'étranger, avec un professeur d'accueil à Fribourg.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « 28 février » et « 30 juin », liens publiés le 1er novembre et le 1er avril."
  },
  {
    "collection": "scholarships",
    "id": "unifr-research-scholarships",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.unifr.ch/studies/en/mobility/incoming/visitingscholars/research-scholarships-of-the-university-of-fribourg/",
      "periodeOuverture": "Deux échéances par an : 28 février et 30 juin.",
      "exigences": [
        "projet_recherche",
        "directeur_these"
      ]
    },
    "motif": "Page lue le 5 sept 2026 : « 28 février » et « 30 juin », liens publiés le 1er novembre et le 1er avril."
  },
  {
    "collection": "programs",
    "id": "universite-de-geneve-geneve__unige-excellence-master-fellowships__master",
    "attendu": {},
    "champs": {
      "deadline": "La page officielle affiche encore la campagne 2026 : clôture le 28 février 2026 pour les masters débutant le 14 septembre 2026, candidatures ouvertes début janvier. La campagne 2027 devrait ouvrir début janvier 2027 avec une clôture fin février 2027 ; à recouper sur la page officielle.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « 28 février, 2026 » ; 10 000 à 15 000 CHF/an ; dossier en un seul PDF."
  },
  {
    "collection": "scholarships",
    "id": "unige-excellence-master-fellowships",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.unige.ch/sciences/en/enseignements/formations/masters/excellencemasterfellowships",
      "periodeOuverture": "Ouverture début janvier, clôture fin février.",
      "exigences": [
        "admission_prealable"
      ]
    },
    "motif": "Page lue le 5 sept 2026 : « 28 février, 2026 » ; 10 000 à 15 000 CHF/an ; dossier en un seul PDF."
  },
  {
    "collection": "programs",
    "id": "university-of-zurich-zurich__uzh-candoc-grant",
    "attendu": {
      "deadline": "Appel 2026 clos le 2 février 2026 — prochain appel annoncé pour février 2027"
    },
    "champs": {
      "deadline": "La page officielle affiche encore le calendrier 2024 (clôture le 1er février 2024 à 17h00 CET, appel ouvert début décembre, financement dès août). L'appel est annuel : le prochain devrait ouvrir le 1er décembre 2026 avec une clôture début février 2027 ; à recouper sur la page officielle. Il faut être inscrit à l'UZH ou avoir l'accord écrit de son futur directeur de thèse à l'UZH."
    },
    "motif": "Page lue le 5 sept 2026 : « 1 February 2024, 17:00 (MEZ/CET) » ; « Calls … take place once per annum » ; page non mise à jour."
  },
  {
    "collection": "scholarships",
    "id": "uzh-candoc-grant",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.research.uzh.ch/en/funding/phd/uzhcandoc.html",
      "periodeOuverture": "Appel annuel : ouverture le 1er décembre, clôture début février.",
      "exigences": [
        "directeur_these",
        "projet_recherche"
      ]
    },
    "motif": "Page lue le 5 sept 2026 : « 1 February 2024, 17:00 (MEZ/CET) » ; « Calls … take place once per annum » ; page non mise à jour."
  },
  {
    "collection": "programs",
    "id": "universite-de-carthage-tunis__bourses-cooperation-tunisie__licence",
    "attendu": {},
    "champs": {
      "deadline": "Le MESRI du Sénégal a publié fin juillet l'appel « Opportunité de bourses d'études en Tunisie, année académique 2026/2027 » ; la date limite figure dans les images de l'annonce, que je n'ai pas pu lire. Réservé aux candidats présentés par leur autorité nationale (au Sénégal : Direction des Bourses).",
      "status": "Ouverte"
    },
    "motif": "Page lue le 5 sept 2026 : annonce du 23 juillet 2026 sans texte lisible ; à lire par Charles."
  },
  {
    "collection": "programs",
    "id": "universite-de-sfax-sfax__bourses-cooperation-tunisie__licence",
    "attendu": {},
    "champs": {
      "deadline": "Le MESRI du Sénégal a publié fin juillet l'appel « Opportunité de bourses d'études en Tunisie, année académique 2026/2027 » ; la date limite figure dans les images de l'annonce, que je n'ai pas pu lire. Réservé aux candidats présentés par leur autorité nationale (au Sénégal : Direction des Bourses).",
      "status": "Ouverte"
    },
    "motif": "Page lue le 5 sept 2026 : annonce du 23 juillet 2026 sans texte lisible ; à lire par Charles."
  },
  {
    "collection": "programs",
    "id": "universite-de-sousse-sousse__bourses-cooperation-tunisie__licence",
    "attendu": {},
    "champs": {
      "deadline": "Le MESRI du Sénégal a publié fin juillet l'appel « Opportunité de bourses d'études en Tunisie, année académique 2026/2027 » ; la date limite figure dans les images de l'annonce, que je n'ai pas pu lire. Réservé aux candidats présentés par leur autorité nationale (au Sénégal : Direction des Bourses).",
      "status": "Ouverte"
    },
    "motif": "Page lue le 5 sept 2026 : annonce du 23 juillet 2026 sans texte lisible ; à lire par Charles."
  },
  {
    "collection": "programs",
    "id": "universite-de-tunis-el-manar-tunis__bourses-cooperation-tunisie__licence",
    "attendu": {},
    "champs": {
      "deadline": "Le MESRI du Sénégal a publié fin juillet l'appel « Opportunité de bourses d'études en Tunisie, année académique 2026/2027 » ; la date limite figure dans les images de l'annonce, que je n'ai pas pu lire. Réservé aux candidats présentés par leur autorité nationale (au Sénégal : Direction des Bourses).",
      "status": "Ouverte"
    },
    "motif": "Page lue le 5 sept 2026 : annonce du 23 juillet 2026 sans texte lisible ; à lire par Charles."
  },
  {
    "collection": "scholarships",
    "id": "bourses-cooperation-tunisie",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://mesrisenegal.sn/bourses-detudes/",
      "periodeOuverture": "Appel national de l'été (juillet-août) pour la rentrée de septembre.",
      "exigences": [
        "nomination_autorite_nationale"
      ],
      "status": "Ouverte",
      "echeanceVariable": "pays",
      "isActive": true
    },
    "motif": "Page lue le 5 sept 2026 : annonce du 23 juillet 2026 sans texte lisible ; à lire par Charles.",
    "attendu": {
      "status": "Fermée — campagne 2027-2028 attendue entre juillet et octobre 2027",
      "isActive": false
    }
  },
  {
    "collection": "programs",
    "id": "koc-university-istanbul__koc-university-merit-scholarships",
    "attendu": {
      "deadline": "Dates 2026-2027 non publiées — la décision de bourse accompagne la lettre d'admission"
    },
    "champs": {
      "deadline": "Aucun formulaire de bourse séparé : la bourse de mérite (25 à 100 % des frais) est annoncée avec l'offre d'admission (« All candidates will be informed if they have been awarded a scholarship or not with their admission offer »). La date qui compte est celle de l'admission internationale à Koç."
    },
    "motif": "Page lue le 5 sept 2026 : scores SAT/ACT/IB/A-Levels quasi indispensables ; frais de scolarité seulement."
  },
  {
    "collection": "scholarships",
    "id": "koc-university-merit-scholarships",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://international.ku.edu.tr/scholarships/",
      "periodeOuverture": "Suit les tours d'admission internationale de Koç (plusieurs par an).",
      "exigences": [
        "admission_prealable"
      ]
    },
    "motif": "Page lue le 5 sept 2026 : scores SAT/ACT/IB/A-Levels quasi indispensables ; frais de scolarité seulement."
  },
  {
    "collection": "programs",
    "id": "sabanci-university-istanbul__sabanci-graduate-scholarships",
    "attendu": {
      "deadline": "Dates 2026-2027 non publiées — la décision est prise par le jury d'admission pendant l'évaluation"
    },
    "champs": {
      "deadline": "Aucune candidature séparée : les décisions de bourse sont prises pendant l'évaluation du dossier d'admission (« Admission and scholarship decisions … are made during the evaluation process »). La date qui compte est celle de l'admission au programme de master ou de doctorat (calendrier sur iro.sabanciuniv.edu)."
    },
    "motif": "Page lue le 5 sept 2026 : année 2026-2027 ; bourse Distinguished Science & Technology pour doctorants exceptionnels."
  },
  {
    "collection": "scholarships",
    "id": "sabanci-graduate-scholarships",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.sabanciuniv.edu/en/graduate-scholarships",
      "periodeOuverture": "Suit les dates limites d'admission graduate de Sabancı (rentrées de septembre et février).",
      "exigences": [
        "admission_prealable"
      ]
    },
    "motif": "Page lue le 5 sept 2026 : année 2026-2027 ; bourse Distinguished Science & Technology pour doctorants exceptionnels."
  },
  {
    "collection": "programs",
    "id": "bogazici-university-istanbul__turkiye-burslari",
    "attendu": {
      "deadline": "Cycle annuel : candidatures habituellement du 10 janvier au 20 février — prochaine fenêtre estimée janvier-février 2027, dates officielles non encore publiées sur turkiyeburslari.gov.tr"
    },
    "champs": {
      "deadline": "L'appel 2026 s'est terminé le 20 février 2026 (période officielle « January 10 – February 20 », résultats début août). L'appel 2027 devrait ouvrir le 10 janvier 2027 avec une clôture le 20 février 2027 ; à recouper sur la page officielle sur tbbs.turkiyeburslari.gov.tr."
    },
    "motif": "Calendrier lu le 5 sept 2026 (sans année) ; limites d'âge non lisibles (page des conditions en 404) — laisser ageMax tel quel."
  },
  {
    "collection": "programs",
    "id": "istanbul-technical-university-istanbul__turkiye-burslari",
    "attendu": {
      "deadline": "Cycle annuel janvier-février — prochaine fenêtre estimée janvier 2027 (à vérifier)",
      "status": "Ouverte"
    },
    "champs": {
      "deadline": "L'appel 2026 s'est terminé le 20 février 2026 (période officielle « January 10 – February 20 », résultats début août). L'appel 2027 devrait ouvrir le 10 janvier 2027 avec une clôture le 20 février 2027 ; à recouper sur la page officielle sur tbbs.turkiyeburslari.gov.tr.",
      "status": "Fermée"
    },
    "motif": "Calendrier lu le 5 sept 2026 (sans année) ; limites d'âge non lisibles (page des conditions en 404) — laisser ageMax tel quel."
  },
  {
    "collection": "programs",
    "id": "istanbul-university-istanbul__turkiye-burslari",
    "attendu": {
      "deadline": "Cycle annuel : candidatures habituellement du 10 janvier au 20 février — prochaine fenêtre estimée janvier-février 2027, dates officielles non encore publiées sur turkiyeburslari.gov.tr"
    },
    "champs": {
      "deadline": "L'appel 2026 s'est terminé le 20 février 2026 (période officielle « January 10 – February 20 », résultats début août). L'appel 2027 devrait ouvrir le 10 janvier 2027 avec une clôture le 20 février 2027 ; à recouper sur la page officielle sur tbbs.turkiyeburslari.gov.tr."
    },
    "motif": "Calendrier lu le 5 sept 2026 (sans année) ; limites d'âge non lisibles (page des conditions en 404) — laisser ageMax tel quel."
  },
  {
    "collection": "scholarships",
    "id": "turkiye-burslari",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.turkiyeburslari.gov.tr/calendar",
      "periodeOuverture": "Appel annuel du 10 janvier au 20 février, résultats en août.",
      "exigences": []
    },
    "motif": "Calendrier lu le 5 sept 2026 (sans année) ; limites d'âge non lisibles (page des conditions en 404) — laisser ageMax tel quel."
  },
  {
    "collection": "programs",
    "id": "bogazici-university-istanbul__turkiye-burslari-research__doctorat",
    "attendu": {},
    "champs": {
      "deadline": "Candidatures ouvertes toute l'année (« open throughout the year »), avec quatre périodes d'évaluation : janvier-mars, avril-juin, juillet-septembre, octobre-décembre. Doctorants en phase de rédaction ou titulaires d'un doctorat, pour 3 à 12 mois dans une université turque.",
      "status": "Ouverte"
    },
    "motif": "Page lue le 5 sept 2026 : 25 000 TL/mois, allocation seulement."
  },
  {
    "collection": "programs",
    "id": "istanbul-technical-university-istanbul__turkiye-burslari-research__doctorat",
    "attendu": {},
    "champs": {
      "deadline": "Candidatures ouvertes toute l'année (« open throughout the year »), avec quatre périodes d'évaluation : janvier-mars, avril-juin, juillet-septembre, octobre-décembre. Doctorants en phase de rédaction ou titulaires d'un doctorat, pour 3 à 12 mois dans une université turque.",
      "status": "Ouverte"
    },
    "motif": "Page lue le 5 sept 2026 : 25 000 TL/mois, allocation seulement."
  },
  {
    "collection": "programs",
    "id": "istanbul-university-istanbul__turkiye-burslari-research__doctorat",
    "attendu": {},
    "champs": {
      "deadline": "Candidatures ouvertes toute l'année (« open throughout the year »), avec quatre périodes d'évaluation : janvier-mars, avril-juin, juillet-septembre, octobre-décembre. Doctorants en phase de rédaction ou titulaires d'un doctorat, pour 3 à 12 mois dans une université turque.",
      "status": "Ouverte"
    },
    "motif": "Page lue le 5 sept 2026 : 25 000 TL/mois, allocation seulement."
  },
  {
    "collection": "scholarships",
    "id": "turkiye-burslari-research",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.turkiyeburslari.gov.tr/shorttermprograms",
      "periodeOuverture": "Au fil de l'eau, quatre sessions d'évaluation par an.",
      "exigences": [
        "projet_recherche"
      ]
    },
    "motif": "Page lue le 5 sept 2026 : 25 000 TL/mois, allocation seulement."
  },
  {
    "collection": "programs",
    "id": "bogazici-university-istanbul__ytb-isdb-joint-scholarship__doctorat",
    "attendu": {},
    "champs": {
      "deadline": "La page annonce une période de candidature 2026 (annonce de fin janvier) sans en donner les dates ; le programme suit en pratique le calendrier général Türkiye Bursları (janvier-février). Réservé aux étudiants des pays membres de la BID et des communautés musulmanes ; en licence, la bourse est un prêt remboursable après l'emploi.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : listes de pays et départements en PDF, non lues ; dates exactes à confirmer."
  },
  {
    "collection": "programs",
    "id": "bogazici-university-istanbul__ytb-isdb-joint-scholarship__licence",
    "attendu": {},
    "champs": {
      "deadline": "La page annonce une période de candidature 2026 (annonce de fin janvier) sans en donner les dates ; le programme suit en pratique le calendrier général Türkiye Bursları (janvier-février). Réservé aux étudiants des pays membres de la BID et des communautés musulmanes ; en licence, la bourse est un prêt remboursable après l'emploi.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : listes de pays et départements en PDF, non lues ; dates exactes à confirmer."
  },
  {
    "collection": "programs",
    "id": "bogazici-university-istanbul__ytb-isdb-joint-scholarship__master",
    "attendu": {},
    "champs": {
      "deadline": "La page annonce une période de candidature 2026 (annonce de fin janvier) sans en donner les dates ; le programme suit en pratique le calendrier général Türkiye Bursları (janvier-février). Réservé aux étudiants des pays membres de la BID et des communautés musulmanes ; en licence, la bourse est un prêt remboursable après l'emploi.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : listes de pays et départements en PDF, non lues ; dates exactes à confirmer."
  },
  {
    "collection": "programs",
    "id": "istanbul-technical-university-istanbul__ytb-isdb-joint-scholarship__doctorat",
    "attendu": {},
    "champs": {
      "deadline": "La page annonce une période de candidature 2026 (annonce de fin janvier) sans en donner les dates ; le programme suit en pratique le calendrier général Türkiye Bursları (janvier-février). Réservé aux étudiants des pays membres de la BID et des communautés musulmanes ; en licence, la bourse est un prêt remboursable après l'emploi.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : listes de pays et départements en PDF, non lues ; dates exactes à confirmer."
  },
  {
    "collection": "programs",
    "id": "istanbul-technical-university-istanbul__ytb-isdb-joint-scholarship__licence",
    "attendu": {},
    "champs": {
      "deadline": "La page annonce une période de candidature 2026 (annonce de fin janvier) sans en donner les dates ; le programme suit en pratique le calendrier général Türkiye Bursları (janvier-février). Réservé aux étudiants des pays membres de la BID et des communautés musulmanes ; en licence, la bourse est un prêt remboursable après l'emploi.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : listes de pays et départements en PDF, non lues ; dates exactes à confirmer."
  },
  {
    "collection": "programs",
    "id": "istanbul-technical-university-istanbul__ytb-isdb-joint-scholarship__master",
    "attendu": {},
    "champs": {
      "deadline": "La page annonce une période de candidature 2026 (annonce de fin janvier) sans en donner les dates ; le programme suit en pratique le calendrier général Türkiye Bursları (janvier-février). Réservé aux étudiants des pays membres de la BID et des communautés musulmanes ; en licence, la bourse est un prêt remboursable après l'emploi.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : listes de pays et départements en PDF, non lues ; dates exactes à confirmer."
  },
  {
    "collection": "programs",
    "id": "istanbul-university-istanbul__ytb-isdb-joint-scholarship__doctorat",
    "attendu": {},
    "champs": {
      "deadline": "La page annonce une période de candidature 2026 (annonce de fin janvier) sans en donner les dates ; le programme suit en pratique le calendrier général Türkiye Bursları (janvier-février). Réservé aux étudiants des pays membres de la BID et des communautés musulmanes ; en licence, la bourse est un prêt remboursable après l'emploi.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : listes de pays et départements en PDF, non lues ; dates exactes à confirmer."
  },
  {
    "collection": "programs",
    "id": "istanbul-university-istanbul__ytb-isdb-joint-scholarship__licence",
    "attendu": {},
    "champs": {
      "deadline": "La page annonce une période de candidature 2026 (annonce de fin janvier) sans en donner les dates ; le programme suit en pratique le calendrier général Türkiye Bursları (janvier-février). Réservé aux étudiants des pays membres de la BID et des communautés musulmanes ; en licence, la bourse est un prêt remboursable après l'emploi.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : listes de pays et départements en PDF, non lues ; dates exactes à confirmer."
  },
  {
    "collection": "programs",
    "id": "istanbul-university-istanbul__ytb-isdb-joint-scholarship__master",
    "attendu": {},
    "champs": {
      "deadline": "La page annonce une période de candidature 2026 (annonce de fin janvier) sans en donner les dates ; le programme suit en pratique le calendrier général Türkiye Bursları (janvier-février). Réservé aux étudiants des pays membres de la BID et des communautés musulmanes ; en licence, la bourse est un prêt remboursable après l'emploi.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : listes de pays et départements en PDF, non lues ; dates exactes à confirmer."
  },
  {
    "collection": "scholarships",
    "id": "ytb-isdb-joint-scholarship",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://turkiyeburslari.gov.tr/partneredprograms",
      "periodeOuverture": "Appel annuel en janvier-février, avec Türkiye Bursları.",
      "exigences": []
    },
    "motif": "Page lue le 5 sept 2026 : listes de pays et départements en PDF, non lues ; dates exactes à confirmer."
  },
  {
    "collection": "programs",
    "id": "bogazici-university-istanbul__tubitak-2216-research-fellowship__doctorat",
    "attendu": {},
    "champs": {
      "deadline": "Le programme est fermé aux candidatures (« The programme is closed for application ») et aucune prochaine date n'est annoncée. Doctorants ayant réussi l'examen de qualification ou titulaires d'un doctorat, citoyens étrangers uniquement, jusqu'à 36 mois.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : 32 500 TL/mois (doctorants), 43 500 TL (postdoc)."
  },
  {
    "collection": "programs",
    "id": "istanbul-technical-university-istanbul__tubitak-2216-research-fellowship__doctorat",
    "attendu": {},
    "champs": {
      "deadline": "Le programme est fermé aux candidatures (« The programme is closed for application ») et aucune prochaine date n'est annoncée. Doctorants ayant réussi l'examen de qualification ou titulaires d'un doctorat, citoyens étrangers uniquement, jusqu'à 36 mois.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : 32 500 TL/mois (doctorants), 43 500 TL (postdoc)."
  },
  {
    "collection": "programs",
    "id": "istanbul-university-istanbul__tubitak-2216-research-fellowship__doctorat",
    "attendu": {},
    "champs": {
      "deadline": "Le programme est fermé aux candidatures (« The programme is closed for application ») et aucune prochaine date n'est annoncée. Doctorants ayant réussi l'examen de qualification ou titulaires d'un doctorat, citoyens étrangers uniquement, jusqu'à 36 mois.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : 32 500 TL/mois (doctorants), 43 500 TL (postdoc)."
  },
  {
    "collection": "scholarships",
    "id": "tubitak-2216-research-fellowship",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://tubitak.gov.tr/en/scholarships/international/research-scholarship-programs/2216-research-fellowship-programme-international-researchers",
      "periodeOuverture": "Appels irréguliers annoncés sur tubitak.gov.tr.",
      "exigences": [
        "projet_recherche"
      ],
      "ageMax": {
        "tous": 35
      },
      "ageMaxNote": "35 ans ou moins à la date limite de candidature."
    },
    "motif": "Page lue le 5 sept 2026 : 32 500 TL/mois (doctorants), 43 500 TL (postdoc)."
  },
  {
    "collection": "programs",
    "id": "bogazici-university-istanbul__turkiye-burslari-success__doctorat",
    "attendu": {},
    "champs": {
      "deadline": "Candidatures aux dates annoncées en octobre et novembre de chaque année, résultats en décembre. ATTENTION : bourse en cours d'études réservée aux étudiants internationaux déjà inscrits dans une université turque, pas une bourse d'entrée.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « Applications are received on the dates announced in October and November, results are announced in December » ; 3 500 / 5 000 / 6 500 TL par mois."
  },
  {
    "collection": "programs",
    "id": "bogazici-university-istanbul__turkiye-burslari-success__licence",
    "attendu": {},
    "champs": {
      "deadline": "Candidatures aux dates annoncées en octobre et novembre de chaque année, résultats en décembre. ATTENTION : bourse en cours d'études réservée aux étudiants internationaux déjà inscrits dans une université turque, pas une bourse d'entrée.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « Applications are received on the dates announced in October and November, results are announced in December » ; 3 500 / 5 000 / 6 500 TL par mois."
  },
  {
    "collection": "programs",
    "id": "bogazici-university-istanbul__turkiye-burslari-success__master",
    "attendu": {},
    "champs": {
      "deadline": "Candidatures aux dates annoncées en octobre et novembre de chaque année, résultats en décembre. ATTENTION : bourse en cours d'études réservée aux étudiants internationaux déjà inscrits dans une université turque, pas une bourse d'entrée.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « Applications are received on the dates announced in October and November, results are announced in December » ; 3 500 / 5 000 / 6 500 TL par mois."
  },
  {
    "collection": "programs",
    "id": "istanbul-technical-university-istanbul__turkiye-burslari-success__doctorat",
    "attendu": {},
    "champs": {
      "deadline": "Candidatures aux dates annoncées en octobre et novembre de chaque année, résultats en décembre. ATTENTION : bourse en cours d'études réservée aux étudiants internationaux déjà inscrits dans une université turque, pas une bourse d'entrée.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « Applications are received on the dates announced in October and November, results are announced in December » ; 3 500 / 5 000 / 6 500 TL par mois."
  },
  {
    "collection": "programs",
    "id": "istanbul-technical-university-istanbul__turkiye-burslari-success__licence",
    "attendu": {},
    "champs": {
      "deadline": "Candidatures aux dates annoncées en octobre et novembre de chaque année, résultats en décembre. ATTENTION : bourse en cours d'études réservée aux étudiants internationaux déjà inscrits dans une université turque, pas une bourse d'entrée.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « Applications are received on the dates announced in October and November, results are announced in December » ; 3 500 / 5 000 / 6 500 TL par mois."
  },
  {
    "collection": "programs",
    "id": "istanbul-technical-university-istanbul__turkiye-burslari-success__master",
    "attendu": {},
    "champs": {
      "deadline": "Candidatures aux dates annoncées en octobre et novembre de chaque année, résultats en décembre. ATTENTION : bourse en cours d'études réservée aux étudiants internationaux déjà inscrits dans une université turque, pas une bourse d'entrée.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « Applications are received on the dates announced in October and November, results are announced in December » ; 3 500 / 5 000 / 6 500 TL par mois."
  },
  {
    "collection": "programs",
    "id": "istanbul-university-istanbul__turkiye-burslari-success__doctorat",
    "attendu": {},
    "champs": {
      "deadline": "Candidatures aux dates annoncées en octobre et novembre de chaque année, résultats en décembre. ATTENTION : bourse en cours d'études réservée aux étudiants internationaux déjà inscrits dans une université turque, pas une bourse d'entrée.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « Applications are received on the dates announced in October and November, results are announced in December » ; 3 500 / 5 000 / 6 500 TL par mois."
  },
  {
    "collection": "programs",
    "id": "istanbul-university-istanbul__turkiye-burslari-success__licence",
    "attendu": {},
    "champs": {
      "deadline": "Candidatures aux dates annoncées en octobre et novembre de chaque année, résultats en décembre. ATTENTION : bourse en cours d'études réservée aux étudiants internationaux déjà inscrits dans une université turque, pas une bourse d'entrée.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « Applications are received on the dates announced in October and November, results are announced in December » ; 3 500 / 5 000 / 6 500 TL par mois."
  },
  {
    "collection": "programs",
    "id": "istanbul-university-istanbul__turkiye-burslari-success__master",
    "attendu": {},
    "champs": {
      "deadline": "Candidatures aux dates annoncées en octobre et novembre de chaque année, résultats en décembre. ATTENTION : bourse en cours d'études réservée aux étudiants internationaux déjà inscrits dans une université turque, pas une bourse d'entrée.",
      "status": "Fermée"
    },
    "motif": "Page lue le 5 sept 2026 : « Applications are received on the dates announced in October and November, results are announced in December » ; 3 500 / 5 000 / 6 500 TL par mois."
  },
  {
    "collection": "scholarships",
    "id": "turkiye-burslari-success",
    "champs": {
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.turkiyeburslari.gov.tr/shorttermprograms",
      "periodeOuverture": "Fenêtre annuelle en octobre-novembre.",
      "exigences": [
        "admission_prealable"
      ]
    },
    "motif": "Page lue le 5 sept 2026 : « Applications are received on the dates announced in October and November, results are announced in December » ; 3 500 / 5 000 / 6 500 TL par mois."
  }
];
