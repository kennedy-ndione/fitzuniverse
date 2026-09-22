/**
 * ============================================================
 * LOT 71 — LES DERNIÈRES DÉCISIONS ET LES DERNIÈRES PREUVES
 *          (22 septembre 2026, nuit)
 * ============================================================
 *
 * Charles a délégué : « pour ce qui reste, décide pour moi de façon
 * réfléchie ». Chaque décision est motivée dans son patch.
 *
 * DÉCISIONS
 *   - International Talents @Unibo : RETIRÉE (isActive:false). La page
 *     de l'appel est fermée, le dispositif a disparu de la liste des
 *     aides de Bologne. Réversible.
 *   - Vanier : devient la fiche de son successeur, la CGRS D (40 000 $
 *     par an, 15 % des bourses aux internationaux déjà inscrits en
 *     doctorat au Canada). Réactivée.
 *
 * PREUVES AJOUTÉES LÀ OÙ IL N'Y EN AVAIT PAS
 *   - Bourse du gouvernement chinois (la plus vue du catalogue) : avis
 *     de l'ambassade de Chine au Sénégal. Appel 2026-2027 terminé le
 *     15 février 2026 ; la fiche disait « Ouverte ». Pré-admission
 *     obligatoire.
 *   - GKS : appel licence 2027 publié le 9 septembre 2026 — voie
 *     ambassade du 15 au 30 septembre 2026, réservée à 74 pays dont le
 *     SÉNÉGAL NE FAIT PAS PARTIE. Master et doctorat : pas encore publié.
 *   - DAAD Helmut-Schmidt : Sénégal éligible (liste CAD) ; dépôt du
 *     1er juin au 31 juillet 2026, terminé.
 *   - DAAD EPOS : date par cours, Sénégal éligible — preuve posée.
 *   - Al Akhawayn : dates non publiées — le texte le dit.
 *
 * NON TRAITÉES, ET POURQUOI (liste pour Charles)
 *   - KAIST : pages d'admission vides dans le navigateur, rien à citer.
 *   - Mastercard KNUST et USIU : sites injoignables le 20/09, non rouverts.
 *   - Scuola Normale : dates déjà relevées au lot 40 ; seule la preuve
 *     manque, appel en PDF non relu.
 *   - Al-Azhar : exception assumée.
 *
 * Rejeu analyserEcheance + etatCandidature au 22/09 avant livraison ;
 * `attendu` généré depuis l'export du 2026-09-22T21:26 (lot 70 compris).
 * ============================================================
 */

export const PATCHES = [
  {
    "collection": "scholarships",
    "id": "international-talents-unibo",
    "attendu": {
      "isActive": true,
      "status": "Fermée — dernier appel publié 2025-2026, appel 2026-2027 non paru",
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.unibo.it/en/study/study-grants-and-subsidies/international-talents-unibo-scholarships-for-international-students/"
    },
    "champs": {
      "isActive": false,
      "status": "Fermée — dispositif retiré des pages de l'université (septembre 2026)",
      "verifieLe": "2026-09-22",
      "sourceEcheance": "https://www.unibo.it/en/study/study-grants-and-subsidies"
    },
    "motif": "Décision prise pour Charles le 2026-09-22 (délégation explicite). Lu ce jour : la page de l'appel renvoie « Accesso non consentito » et le dispositif ne figure plus dans la liste des aides de l'Università di Bologna (« Specific financial aid for international students »). Dernier appel connu : 2025-2026. Plutôt que de laisser rattachés à une bourse disparue un programme de licence (que l'appel ne visait pas) et un de master, la fiche est RETIRÉE (`isActive:false`, le seul geste éditorial qui ferme sans condition). Réversible le jour où un appel 2027-2028 paraît. La licence et le master de Bologne restent couverts par la bourse régionale ER.GO."
  },
  {
    "collection": "scholarships",
    "id": "vanier-canada-graduate-scholarship",
    "attendu": {
      "title": "Vanier Canada Graduate Scholarship",
      "isActive": false,
      "officialWebsite": "https://vanier.gc.ca/en/home-accueil.html",
      "funding": "100 %",
      "description": "Programme discontinué : le gouvernement canadien n'accepte plus de nouvelles candidatures Vanier CGS depuis son remplacement par le programme harmonisé \"Canada Graduate Research Scholarship – Doctoral\". Fiche conservée pour référence historique, aucune candidature réelle possible sous ce nom.",
      "generalCriteria": "",
      "eligibility": {
        "note": "Était ouverte à toutes les nationalités. Le programme n'accepte plus de candidatures et a été remplacé par la Bourse d'études supérieures du Canada — doctorat.",
        "scope": "monde"
      },
      "status": "Fermée (programme remplacé)",
      "exigences": [
        "nomination_par_ecole"
      ],
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://vanier.gc.ca/en/home-accueil.html",
      "periodeOuverture": "programme remplacé — voir la Bourse d'études supérieures du Canada au doctorat",
      "deadline": "Le site officiel annonce que les demandes de Bourses Vanier ne sont plus acceptées : le programme est remplacé par la « Canada Graduate Research Scholarship – Doctoral ». La nomination passait obligatoirement par une université canadienne disposant d'un quota. Se reporter au nouveau programme."
    },
    "champs": {
      "title": "Bourse d'études supérieures du Canada au doctorat (CGRS D, ex-Vanier)",
      "isActive": true,
      "officialWebsite": "https://nserc-crsng.canada.ca/en/funding-opportunity/canada-graduate-research-scholarship-doctoral-program",
      "funding": "40 000 $ CA par an pendant 36 mois.",
      "description": "Programme harmonisé des trois organismes fédéraux de recherche du Canada (CRSH, CRSNG, IRSC), qui remplace depuis 2025 les bourses Vanier et les bourses d'études supérieures au doctorat. Jusqu'à 15 % des bourses sont réservées à des candidats internationaux.",
      "generalCriteria": "Un candidat qui n'est ni citoyen ni résident permanent du Canada doit être DÉJÀ INSCRIT dans un programme de doctorat d'un établissement canadien admissible à la date limite. Jusqu'à 15 % des bourses vont à des candidats internationaux. La candidature passe par l'établissement canadien lorsqu'il dispose d'un quota (sa date interne est souvent bien plus tôt), sinon directement auprès de l'organisme. Ce n'est donc pas une bourse pour entrer au Canada : c'est une bourse pour un doctorant déjà inscrit.",
      "eligibility": {
        "note": "Toutes nationalités, mais un candidat international doit déjà être inscrit en doctorat dans un établissement canadien ; jusqu'à 15 % des bourses lui sont accessibles.",
        "scope": "monde"
      },
      "status": "Ouverte — concours 2026",
      "exigences": [
        "admission_prealable",
        "candidature_via_etablissement"
      ],
      "verifieLe": "2026-09-22",
      "sourceEcheance": "https://nserc-crsng.canada.ca/en/funding-opportunity/canada-graduate-research-scholarship-doctoral-program",
      "periodeOuverture": "concours annuel à l'automne : date interne de chaque établissement, dépôt direct auprès de l'organisme à la mi-octobre",
      "deadline": "Concours 2026 : dépôt direct auprès de l'organisme jusqu'au 17 octobre (20h, heure de l'Est) ; par l'établissement canadien, date interne plus précoce."
    },
    "motif": "Décision prise pour Charles le 2026-09-22 : la fiche Vanier (inactive, « programme remplacé ») devient la fiche de son successeur, la Canada Graduate Research Scholarship – Doctoral, lue ce jour sur la page officielle du CRSNG et confirmée par vanier.gc.ca (« We are no longer accepting applications »). Identifiant conservé pour ne casser aucun lien. Réactivée : le programme vit et reste ouvert aux étudiants internationaux (jusqu'à 15 % des bourses)."
  },
  {
    "collection": "scholarships",
    "id": "chinese-government-scholarship",
    "attendu": {
      "status": "Ouverte",
      "funding": "100 %",
      "generalCriteria": "",
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://id.china-embassy.gov.cn/eng/sgdt/202510/t20251027_11741674.htm",
      "periodeOuverture": "appel annuel par ambassade : publication à l'automne, clôture entre janvier et mars selon le pays"
    },
    "champs": {
      "status": "Fermée — appel 2026-2027 terminé au Sénégal, appel 2027-2028 non publié",
      "funding": "100 % : frais d'études, logement, allocation de vie, assurance maladie, voyage aller en Chine et retour définitif après le diplôme ; année de chinois préparatoire couverte si nécessaire.",
      "generalCriteria": "Au Sénégal : candidature en ligne sur le site du CSC (une spécialité, trois universités au choix) ET dossier papier déposé en même temps à la Direction des bourses du ministère de l'Enseignement supérieur, pour une évaluation préliminaire. Il faut OBLIGATOIREMENT une lettre de pré-admission d'au moins une des trois universités avant de déposer. En licence, formation uniquement en chinois et test en ligne CSCA obligatoire ; en master et doctorat, programmes en chinois (HSK 4 exigé) ou en anglais. Pièces qui ne sont ni en chinois ni en anglais : traduction certifiée. Non cumulable avec une autre bourse chinoise.",
      "verifieLe": "2026-09-22",
      "sourceEcheance": "https://sn.china-embassy.gov.cn/fra/sgdt/202510/t20251028_11742627.htm",
      "periodeOuverture": "appel annuel publié par chaque ambassade de Chine ; au Sénégal, publication entre fin octobre et décembre, clôture à la mi-février, résultats en juillet"
    },
    "motif": "Avis officiel de l'ambassade de Chine au Sénégal « BOURSE DU GOUVERNEMENT CHINOIS 2026/2027 EN FAVEUR DES ETUDIANTS SENEGALAIS » (28 octobre 2025) lu le 2026-09-22 — la source qui manquait à la fiche la plus vue du catalogue (studyinchina.csc.edu.cn et campuschina.org restent illisibles). L'appel 2026-2027 est terminé depuis le 15 février 2026 ; la fiche disait « Ouverte ». Faits ajoutés : lettre de PRÉ-ADMISSION obligatoire, test en ligne CSCA pour la licence, licence uniquement en chinois, dossier papier en parallèle à la Direction des bourses."
  },
  {
    "collection": "programs",
    "id": "buaa-bachelor",
    "attendu": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois.",
      "status": "Ouverte",
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "deadline": "La date dépend du pays : chaque ambassade de Chine publie son appel. Au Sénégal, l'appel 2026-2027 courait jusqu'au 15 février 2026 (résultats en juillet) ; l'appel 2027-2028 n'est pas encore publié. Il faut une lettre de pré-admission d'au moins une université avant de déposer, et le dossier papier part en même temps à la Direction des bourses.",
      "status": "Fermée — appel 2026-2027 terminé au Sénégal",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://sn.china-embassy.gov.cn/fra/sgdt/202510/t20251028_11742627.htm",
        "citation": "Le dépôt de candidature est ouvert jusqu’au 15 février 2026. Le résultat de la bourse et de l’admission universitaire sortira en juillet 2026",
        "le": "2026-09-22T23:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Avis officiel de l'ambassade de Chine au Sénégal « BOURSE DU GOUVERNEMENT CHINOIS 2026/2027 EN FAVEUR DES ETUDIANTS SENEGALAIS » (28 octobre 2025) lu le 2026-09-22 — la source qui manquait à la fiche la plus vue du catalogue (studyinchina.csc.edu.cn et campuschina.org restent illisibles). L'appel 2026-2027 est terminé depuis le 15 février 2026 ; la fiche disait « Ouverte ». Faits ajoutés : lettre de PRÉ-ADMISSION obligatoire, test en ligne CSCA pour la licence, licence uniquement en chinois, dossier papier en parallèle à la Direction des bourses."
  },
  {
    "collection": "programs",
    "id": "buaa-master",
    "attendu": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois.",
      "status": "Ouverte",
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "deadline": "La date dépend du pays : chaque ambassade de Chine publie son appel. Au Sénégal, l'appel 2026-2027 courait jusqu'au 15 février 2026 (résultats en juillet) ; l'appel 2027-2028 n'est pas encore publié. Il faut une lettre de pré-admission d'au moins une université avant de déposer, et le dossier papier part en même temps à la Direction des bourses.",
      "status": "Fermée — appel 2026-2027 terminé au Sénégal",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://sn.china-embassy.gov.cn/fra/sgdt/202510/t20251028_11742627.htm",
        "citation": "Le dépôt de candidature est ouvert jusqu’au 15 février 2026. Le résultat de la bourse et de l’admission universitaire sortira en juillet 2026",
        "le": "2026-09-22T23:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Avis officiel de l'ambassade de Chine au Sénégal « BOURSE DU GOUVERNEMENT CHINOIS 2026/2027 EN FAVEUR DES ETUDIANTS SENEGALAIS » (28 octobre 2025) lu le 2026-09-22 — la source qui manquait à la fiche la plus vue du catalogue (studyinchina.csc.edu.cn et campuschina.org restent illisibles). L'appel 2026-2027 est terminé depuis le 15 février 2026 ; la fiche disait « Ouverte ». Faits ajoutés : lettre de PRÉ-ADMISSION obligatoire, test en ligne CSCA pour la licence, licence uniquement en chinois, dossier papier en parallèle à la Direction des bourses."
  },
  {
    "collection": "programs",
    "id": "buaa-phd",
    "attendu": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois.",
      "status": "Ouverte",
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "deadline": "La date dépend du pays : chaque ambassade de Chine publie son appel. Au Sénégal, l'appel 2026-2027 courait jusqu'au 15 février 2026 (résultats en juillet) ; l'appel 2027-2028 n'est pas encore publié. Il faut une lettre de pré-admission d'au moins une université avant de déposer, et le dossier papier part en même temps à la Direction des bourses.",
      "status": "Fermée — appel 2026-2027 terminé au Sénégal",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://sn.china-embassy.gov.cn/fra/sgdt/202510/t20251028_11742627.htm",
        "citation": "Le dépôt de candidature est ouvert jusqu’au 15 février 2026. Le résultat de la bourse et de l’admission universitaire sortira en juillet 2026",
        "le": "2026-09-22T23:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Avis officiel de l'ambassade de Chine au Sénégal « BOURSE DU GOUVERNEMENT CHINOIS 2026/2027 EN FAVEUR DES ETUDIANTS SENEGALAIS » (28 octobre 2025) lu le 2026-09-22 — la source qui manquait à la fiche la plus vue du catalogue (studyinchina.csc.edu.cn et campuschina.org restent illisibles). L'appel 2026-2027 est terminé depuis le 15 février 2026 ; la fiche disait « Ouverte ». Faits ajoutés : lettre de PRÉ-ADMISSION obligatoire, test en ligne CSCA pour la licence, licence uniquement en chinois, dossier papier en parallèle à la Direction des bourses."
  },
  {
    "collection": "programs",
    "id": "fudan-bachelor",
    "attendu": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois.",
      "status": "Ouverte",
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "deadline": "La date dépend du pays : chaque ambassade de Chine publie son appel. Au Sénégal, l'appel 2026-2027 courait jusqu'au 15 février 2026 (résultats en juillet) ; l'appel 2027-2028 n'est pas encore publié. Il faut une lettre de pré-admission d'au moins une université avant de déposer, et le dossier papier part en même temps à la Direction des bourses.",
      "status": "Fermée — appel 2026-2027 terminé au Sénégal",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://sn.china-embassy.gov.cn/fra/sgdt/202510/t20251028_11742627.htm",
        "citation": "Le dépôt de candidature est ouvert jusqu’au 15 février 2026. Le résultat de la bourse et de l’admission universitaire sortira en juillet 2026",
        "le": "2026-09-22T23:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Avis officiel de l'ambassade de Chine au Sénégal « BOURSE DU GOUVERNEMENT CHINOIS 2026/2027 EN FAVEUR DES ETUDIANTS SENEGALAIS » (28 octobre 2025) lu le 2026-09-22 — la source qui manquait à la fiche la plus vue du catalogue (studyinchina.csc.edu.cn et campuschina.org restent illisibles). L'appel 2026-2027 est terminé depuis le 15 février 2026 ; la fiche disait « Ouverte ». Faits ajoutés : lettre de PRÉ-ADMISSION obligatoire, test en ligne CSCA pour la licence, licence uniquement en chinois, dossier papier en parallèle à la Direction des bourses."
  },
  {
    "collection": "programs",
    "id": "fudan-master",
    "attendu": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois.",
      "status": "Ouverte",
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "deadline": "La date dépend du pays : chaque ambassade de Chine publie son appel. Au Sénégal, l'appel 2026-2027 courait jusqu'au 15 février 2026 (résultats en juillet) ; l'appel 2027-2028 n'est pas encore publié. Il faut une lettre de pré-admission d'au moins une université avant de déposer, et le dossier papier part en même temps à la Direction des bourses.",
      "status": "Fermée — appel 2026-2027 terminé au Sénégal",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://sn.china-embassy.gov.cn/fra/sgdt/202510/t20251028_11742627.htm",
        "citation": "Le dépôt de candidature est ouvert jusqu’au 15 février 2026. Le résultat de la bourse et de l’admission universitaire sortira en juillet 2026",
        "le": "2026-09-22T23:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Avis officiel de l'ambassade de Chine au Sénégal « BOURSE DU GOUVERNEMENT CHINOIS 2026/2027 EN FAVEUR DES ETUDIANTS SENEGALAIS » (28 octobre 2025) lu le 2026-09-22 — la source qui manquait à la fiche la plus vue du catalogue (studyinchina.csc.edu.cn et campuschina.org restent illisibles). L'appel 2026-2027 est terminé depuis le 15 février 2026 ; la fiche disait « Ouverte ». Faits ajoutés : lettre de PRÉ-ADMISSION obligatoire, test en ligne CSCA pour la licence, licence uniquement en chinois, dossier papier en parallèle à la Direction des bourses."
  },
  {
    "collection": "programs",
    "id": "fudan-phd",
    "attendu": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois.",
      "status": "Ouverte",
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "deadline": "La date dépend du pays : chaque ambassade de Chine publie son appel. Au Sénégal, l'appel 2026-2027 courait jusqu'au 15 février 2026 (résultats en juillet) ; l'appel 2027-2028 n'est pas encore publié. Il faut une lettre de pré-admission d'au moins une université avant de déposer, et le dossier papier part en même temps à la Direction des bourses.",
      "status": "Fermée — appel 2026-2027 terminé au Sénégal",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://sn.china-embassy.gov.cn/fra/sgdt/202510/t20251028_11742627.htm",
        "citation": "Le dépôt de candidature est ouvert jusqu’au 15 février 2026. Le résultat de la bourse et de l’admission universitaire sortira en juillet 2026",
        "le": "2026-09-22T23:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Avis officiel de l'ambassade de Chine au Sénégal « BOURSE DU GOUVERNEMENT CHINOIS 2026/2027 EN FAVEUR DES ETUDIANTS SENEGALAIS » (28 octobre 2025) lu le 2026-09-22 — la source qui manquait à la fiche la plus vue du catalogue (studyinchina.csc.edu.cn et campuschina.org restent illisibles). L'appel 2026-2027 est terminé depuis le 15 février 2026 ; la fiche disait « Ouverte ». Faits ajoutés : lettre de PRÉ-ADMISSION obligatoire, test en ligne CSCA pour la licence, licence uniquement en chinois, dossier papier en parallèle à la Direction des bourses."
  },
  {
    "collection": "programs",
    "id": "hit-bachelor",
    "attendu": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois.",
      "status": "Ouverte",
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "deadline": "La date dépend du pays : chaque ambassade de Chine publie son appel. Au Sénégal, l'appel 2026-2027 courait jusqu'au 15 février 2026 (résultats en juillet) ; l'appel 2027-2028 n'est pas encore publié. Il faut une lettre de pré-admission d'au moins une université avant de déposer, et le dossier papier part en même temps à la Direction des bourses.",
      "status": "Fermée — appel 2026-2027 terminé au Sénégal",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://sn.china-embassy.gov.cn/fra/sgdt/202510/t20251028_11742627.htm",
        "citation": "Le dépôt de candidature est ouvert jusqu’au 15 février 2026. Le résultat de la bourse et de l’admission universitaire sortira en juillet 2026",
        "le": "2026-09-22T23:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Avis officiel de l'ambassade de Chine au Sénégal « BOURSE DU GOUVERNEMENT CHINOIS 2026/2027 EN FAVEUR DES ETUDIANTS SENEGALAIS » (28 octobre 2025) lu le 2026-09-22 — la source qui manquait à la fiche la plus vue du catalogue (studyinchina.csc.edu.cn et campuschina.org restent illisibles). L'appel 2026-2027 est terminé depuis le 15 février 2026 ; la fiche disait « Ouverte ». Faits ajoutés : lettre de PRÉ-ADMISSION obligatoire, test en ligne CSCA pour la licence, licence uniquement en chinois, dossier papier en parallèle à la Direction des bourses."
  },
  {
    "collection": "programs",
    "id": "hit-master",
    "attendu": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois.",
      "status": "Ouverte",
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "deadline": "La date dépend du pays : chaque ambassade de Chine publie son appel. Au Sénégal, l'appel 2026-2027 courait jusqu'au 15 février 2026 (résultats en juillet) ; l'appel 2027-2028 n'est pas encore publié. Il faut une lettre de pré-admission d'au moins une université avant de déposer, et le dossier papier part en même temps à la Direction des bourses.",
      "status": "Fermée — appel 2026-2027 terminé au Sénégal",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://sn.china-embassy.gov.cn/fra/sgdt/202510/t20251028_11742627.htm",
        "citation": "Le dépôt de candidature est ouvert jusqu’au 15 février 2026. Le résultat de la bourse et de l’admission universitaire sortira en juillet 2026",
        "le": "2026-09-22T23:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Avis officiel de l'ambassade de Chine au Sénégal « BOURSE DU GOUVERNEMENT CHINOIS 2026/2027 EN FAVEUR DES ETUDIANTS SENEGALAIS » (28 octobre 2025) lu le 2026-09-22 — la source qui manquait à la fiche la plus vue du catalogue (studyinchina.csc.edu.cn et campuschina.org restent illisibles). L'appel 2026-2027 est terminé depuis le 15 février 2026 ; la fiche disait « Ouverte ». Faits ajoutés : lettre de PRÉ-ADMISSION obligatoire, test en ligne CSCA pour la licence, licence uniquement en chinois, dossier papier en parallèle à la Direction des bourses."
  },
  {
    "collection": "programs",
    "id": "hit-phd",
    "attendu": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois.",
      "status": "Ouverte",
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "deadline": "La date dépend du pays : chaque ambassade de Chine publie son appel. Au Sénégal, l'appel 2026-2027 courait jusqu'au 15 février 2026 (résultats en juillet) ; l'appel 2027-2028 n'est pas encore publié. Il faut une lettre de pré-admission d'au moins une université avant de déposer, et le dossier papier part en même temps à la Direction des bourses.",
      "status": "Fermée — appel 2026-2027 terminé au Sénégal",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://sn.china-embassy.gov.cn/fra/sgdt/202510/t20251028_11742627.htm",
        "citation": "Le dépôt de candidature est ouvert jusqu’au 15 février 2026. Le résultat de la bourse et de l’admission universitaire sortira en juillet 2026",
        "le": "2026-09-22T23:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Avis officiel de l'ambassade de Chine au Sénégal « BOURSE DU GOUVERNEMENT CHINOIS 2026/2027 EN FAVEUR DES ETUDIANTS SENEGALAIS » (28 octobre 2025) lu le 2026-09-22 — la source qui manquait à la fiche la plus vue du catalogue (studyinchina.csc.edu.cn et campuschina.org restent illisibles). L'appel 2026-2027 est terminé depuis le 15 février 2026 ; la fiche disait « Ouverte ». Faits ajoutés : lettre de PRÉ-ADMISSION obligatoire, test en ligne CSCA pour la licence, licence uniquement en chinois, dossier papier en parallèle à la Direction des bourses."
  },
  {
    "collection": "programs",
    "id": "nanjing-university-nanjing__chinese-government-scholarship",
    "attendu": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois.",
      "status": "Ouverte",
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "deadline": "La date dépend du pays : chaque ambassade de Chine publie son appel. Au Sénégal, l'appel 2026-2027 courait jusqu'au 15 février 2026 (résultats en juillet) ; l'appel 2027-2028 n'est pas encore publié. Il faut une lettre de pré-admission d'au moins une université avant de déposer, et le dossier papier part en même temps à la Direction des bourses.",
      "status": "Fermée — appel 2026-2027 terminé au Sénégal",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://sn.china-embassy.gov.cn/fra/sgdt/202510/t20251028_11742627.htm",
        "citation": "Le dépôt de candidature est ouvert jusqu’au 15 février 2026. Le résultat de la bourse et de l’admission universitaire sortira en juillet 2026",
        "le": "2026-09-22T23:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Avis officiel de l'ambassade de Chine au Sénégal « BOURSE DU GOUVERNEMENT CHINOIS 2026/2027 EN FAVEUR DES ETUDIANTS SENEGALAIS » (28 octobre 2025) lu le 2026-09-22 — la source qui manquait à la fiche la plus vue du catalogue (studyinchina.csc.edu.cn et campuschina.org restent illisibles). L'appel 2026-2027 est terminé depuis le 15 février 2026 ; la fiche disait « Ouverte ». Faits ajoutés : lettre de PRÉ-ADMISSION obligatoire, test en ligne CSCA pour la licence, licence uniquement en chinois, dossier papier en parallèle à la Direction des bourses."
  },
  {
    "collection": "programs",
    "id": "peking-university-beijing__chinese-government-scholarship",
    "attendu": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois.",
      "status": "Ouverte",
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "deadline": "La date dépend du pays : chaque ambassade de Chine publie son appel. Au Sénégal, l'appel 2026-2027 courait jusqu'au 15 février 2026 (résultats en juillet) ; l'appel 2027-2028 n'est pas encore publié. Il faut une lettre de pré-admission d'au moins une université avant de déposer, et le dossier papier part en même temps à la Direction des bourses.",
      "status": "Fermée — appel 2026-2027 terminé au Sénégal",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://sn.china-embassy.gov.cn/fra/sgdt/202510/t20251028_11742627.htm",
        "citation": "Le dépôt de candidature est ouvert jusqu’au 15 février 2026. Le résultat de la bourse et de l’admission universitaire sortira en juillet 2026",
        "le": "2026-09-22T23:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Avis officiel de l'ambassade de Chine au Sénégal « BOURSE DU GOUVERNEMENT CHINOIS 2026/2027 EN FAVEUR DES ETUDIANTS SENEGALAIS » (28 octobre 2025) lu le 2026-09-22 — la source qui manquait à la fiche la plus vue du catalogue (studyinchina.csc.edu.cn et campuschina.org restent illisibles). L'appel 2026-2027 est terminé depuis le 15 février 2026 ; la fiche disait « Ouverte ». Faits ajoutés : lettre de PRÉ-ADMISSION obligatoire, test en ligne CSCA pour la licence, licence uniquement en chinois, dossier papier en parallèle à la Direction des bourses."
  },
  {
    "collection": "programs",
    "id": "scu-bachelor",
    "attendu": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois.",
      "status": "Ouverte",
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "deadline": "La date dépend du pays : chaque ambassade de Chine publie son appel. Au Sénégal, l'appel 2026-2027 courait jusqu'au 15 février 2026 (résultats en juillet) ; l'appel 2027-2028 n'est pas encore publié. Il faut une lettre de pré-admission d'au moins une université avant de déposer, et le dossier papier part en même temps à la Direction des bourses.",
      "status": "Fermée — appel 2026-2027 terminé au Sénégal",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://sn.china-embassy.gov.cn/fra/sgdt/202510/t20251028_11742627.htm",
        "citation": "Le dépôt de candidature est ouvert jusqu’au 15 février 2026. Le résultat de la bourse et de l’admission universitaire sortira en juillet 2026",
        "le": "2026-09-22T23:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Avis officiel de l'ambassade de Chine au Sénégal « BOURSE DU GOUVERNEMENT CHINOIS 2026/2027 EN FAVEUR DES ETUDIANTS SENEGALAIS » (28 octobre 2025) lu le 2026-09-22 — la source qui manquait à la fiche la plus vue du catalogue (studyinchina.csc.edu.cn et campuschina.org restent illisibles). L'appel 2026-2027 est terminé depuis le 15 février 2026 ; la fiche disait « Ouverte ». Faits ajoutés : lettre de PRÉ-ADMISSION obligatoire, test en ligne CSCA pour la licence, licence uniquement en chinois, dossier papier en parallèle à la Direction des bourses."
  },
  {
    "collection": "programs",
    "id": "scu-master",
    "attendu": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois.",
      "status": "Ouverte",
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "deadline": "La date dépend du pays : chaque ambassade de Chine publie son appel. Au Sénégal, l'appel 2026-2027 courait jusqu'au 15 février 2026 (résultats en juillet) ; l'appel 2027-2028 n'est pas encore publié. Il faut une lettre de pré-admission d'au moins une université avant de déposer, et le dossier papier part en même temps à la Direction des bourses.",
      "status": "Fermée — appel 2026-2027 terminé au Sénégal",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://sn.china-embassy.gov.cn/fra/sgdt/202510/t20251028_11742627.htm",
        "citation": "Le dépôt de candidature est ouvert jusqu’au 15 février 2026. Le résultat de la bourse et de l’admission universitaire sortira en juillet 2026",
        "le": "2026-09-22T23:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Avis officiel de l'ambassade de Chine au Sénégal « BOURSE DU GOUVERNEMENT CHINOIS 2026/2027 EN FAVEUR DES ETUDIANTS SENEGALAIS » (28 octobre 2025) lu le 2026-09-22 — la source qui manquait à la fiche la plus vue du catalogue (studyinchina.csc.edu.cn et campuschina.org restent illisibles). L'appel 2026-2027 est terminé depuis le 15 février 2026 ; la fiche disait « Ouverte ». Faits ajoutés : lettre de PRÉ-ADMISSION obligatoire, test en ligne CSCA pour la licence, licence uniquement en chinois, dossier papier en parallèle à la Direction des bourses."
  },
  {
    "collection": "programs",
    "id": "scu-phd",
    "attendu": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois.",
      "status": "Ouverte",
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "deadline": "La date dépend du pays : chaque ambassade de Chine publie son appel. Au Sénégal, l'appel 2026-2027 courait jusqu'au 15 février 2026 (résultats en juillet) ; l'appel 2027-2028 n'est pas encore publié. Il faut une lettre de pré-admission d'au moins une université avant de déposer, et le dossier papier part en même temps à la Direction des bourses.",
      "status": "Fermée — appel 2026-2027 terminé au Sénégal",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://sn.china-embassy.gov.cn/fra/sgdt/202510/t20251028_11742627.htm",
        "citation": "Le dépôt de candidature est ouvert jusqu’au 15 février 2026. Le résultat de la bourse et de l’admission universitaire sortira en juillet 2026",
        "le": "2026-09-22T23:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Avis officiel de l'ambassade de Chine au Sénégal « BOURSE DU GOUVERNEMENT CHINOIS 2026/2027 EN FAVEUR DES ETUDIANTS SENEGALAIS » (28 octobre 2025) lu le 2026-09-22 — la source qui manquait à la fiche la plus vue du catalogue (studyinchina.csc.edu.cn et campuschina.org restent illisibles). L'appel 2026-2027 est terminé depuis le 15 février 2026 ; la fiche disait « Ouverte ». Faits ajoutés : lettre de PRÉ-ADMISSION obligatoire, test en ligne CSCA pour la licence, licence uniquement en chinois, dossier papier en parallèle à la Direction des bourses."
  },
  {
    "collection": "programs",
    "id": "sjtu-bachelor",
    "attendu": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois.",
      "status": "Ouverte",
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "deadline": "La date dépend du pays : chaque ambassade de Chine publie son appel. Au Sénégal, l'appel 2026-2027 courait jusqu'au 15 février 2026 (résultats en juillet) ; l'appel 2027-2028 n'est pas encore publié. Il faut une lettre de pré-admission d'au moins une université avant de déposer, et le dossier papier part en même temps à la Direction des bourses.",
      "status": "Fermée — appel 2026-2027 terminé au Sénégal",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://sn.china-embassy.gov.cn/fra/sgdt/202510/t20251028_11742627.htm",
        "citation": "Le dépôt de candidature est ouvert jusqu’au 15 février 2026. Le résultat de la bourse et de l’admission universitaire sortira en juillet 2026",
        "le": "2026-09-22T23:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Avis officiel de l'ambassade de Chine au Sénégal « BOURSE DU GOUVERNEMENT CHINOIS 2026/2027 EN FAVEUR DES ETUDIANTS SENEGALAIS » (28 octobre 2025) lu le 2026-09-22 — la source qui manquait à la fiche la plus vue du catalogue (studyinchina.csc.edu.cn et campuschina.org restent illisibles). L'appel 2026-2027 est terminé depuis le 15 février 2026 ; la fiche disait « Ouverte ». Faits ajoutés : lettre de PRÉ-ADMISSION obligatoire, test en ligne CSCA pour la licence, licence uniquement en chinois, dossier papier en parallèle à la Direction des bourses."
  },
  {
    "collection": "programs",
    "id": "sjtu-master",
    "attendu": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois.",
      "status": "Ouverte",
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "deadline": "La date dépend du pays : chaque ambassade de Chine publie son appel. Au Sénégal, l'appel 2026-2027 courait jusqu'au 15 février 2026 (résultats en juillet) ; l'appel 2027-2028 n'est pas encore publié. Il faut une lettre de pré-admission d'au moins une université avant de déposer, et le dossier papier part en même temps à la Direction des bourses.",
      "status": "Fermée — appel 2026-2027 terminé au Sénégal",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://sn.china-embassy.gov.cn/fra/sgdt/202510/t20251028_11742627.htm",
        "citation": "Le dépôt de candidature est ouvert jusqu’au 15 février 2026. Le résultat de la bourse et de l’admission universitaire sortira en juillet 2026",
        "le": "2026-09-22T23:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Avis officiel de l'ambassade de Chine au Sénégal « BOURSE DU GOUVERNEMENT CHINOIS 2026/2027 EN FAVEUR DES ETUDIANTS SENEGALAIS » (28 octobre 2025) lu le 2026-09-22 — la source qui manquait à la fiche la plus vue du catalogue (studyinchina.csc.edu.cn et campuschina.org restent illisibles). L'appel 2026-2027 est terminé depuis le 15 février 2026 ; la fiche disait « Ouverte ». Faits ajoutés : lettre de PRÉ-ADMISSION obligatoire, test en ligne CSCA pour la licence, licence uniquement en chinois, dossier papier en parallèle à la Direction des bourses."
  },
  {
    "collection": "programs",
    "id": "sjtu-phd",
    "attendu": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois.",
      "status": "Ouverte",
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "deadline": "La date dépend du pays : chaque ambassade de Chine publie son appel. Au Sénégal, l'appel 2026-2027 courait jusqu'au 15 février 2026 (résultats en juillet) ; l'appel 2027-2028 n'est pas encore publié. Il faut une lettre de pré-admission d'au moins une université avant de déposer, et le dossier papier part en même temps à la Direction des bourses.",
      "status": "Fermée — appel 2026-2027 terminé au Sénégal",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://sn.china-embassy.gov.cn/fra/sgdt/202510/t20251028_11742627.htm",
        "citation": "Le dépôt de candidature est ouvert jusqu’au 15 février 2026. Le résultat de la bourse et de l’admission universitaire sortira en juillet 2026",
        "le": "2026-09-22T23:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Avis officiel de l'ambassade de Chine au Sénégal « BOURSE DU GOUVERNEMENT CHINOIS 2026/2027 EN FAVEUR DES ETUDIANTS SENEGALAIS » (28 octobre 2025) lu le 2026-09-22 — la source qui manquait à la fiche la plus vue du catalogue (studyinchina.csc.edu.cn et campuschina.org restent illisibles). L'appel 2026-2027 est terminé depuis le 15 février 2026 ; la fiche disait « Ouverte ». Faits ajoutés : lettre de PRÉ-ADMISSION obligatoire, test en ligne CSCA pour la licence, licence uniquement en chinois, dossier papier en parallèle à la Direction des bourses."
  },
  {
    "collection": "programs",
    "id": "sysu-bachelor",
    "attendu": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois.",
      "status": "Ouverte",
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "deadline": "La date dépend du pays : chaque ambassade de Chine publie son appel. Au Sénégal, l'appel 2026-2027 courait jusqu'au 15 février 2026 (résultats en juillet) ; l'appel 2027-2028 n'est pas encore publié. Il faut une lettre de pré-admission d'au moins une université avant de déposer, et le dossier papier part en même temps à la Direction des bourses.",
      "status": "Fermée — appel 2026-2027 terminé au Sénégal",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://sn.china-embassy.gov.cn/fra/sgdt/202510/t20251028_11742627.htm",
        "citation": "Le dépôt de candidature est ouvert jusqu’au 15 février 2026. Le résultat de la bourse et de l’admission universitaire sortira en juillet 2026",
        "le": "2026-09-22T23:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Avis officiel de l'ambassade de Chine au Sénégal « BOURSE DU GOUVERNEMENT CHINOIS 2026/2027 EN FAVEUR DES ETUDIANTS SENEGALAIS » (28 octobre 2025) lu le 2026-09-22 — la source qui manquait à la fiche la plus vue du catalogue (studyinchina.csc.edu.cn et campuschina.org restent illisibles). L'appel 2026-2027 est terminé depuis le 15 février 2026 ; la fiche disait « Ouverte ». Faits ajoutés : lettre de PRÉ-ADMISSION obligatoire, test en ligne CSCA pour la licence, licence uniquement en chinois, dossier papier en parallèle à la Direction des bourses."
  },
  {
    "collection": "programs",
    "id": "sysu-master",
    "attendu": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois.",
      "status": "Ouverte",
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "deadline": "La date dépend du pays : chaque ambassade de Chine publie son appel. Au Sénégal, l'appel 2026-2027 courait jusqu'au 15 février 2026 (résultats en juillet) ; l'appel 2027-2028 n'est pas encore publié. Il faut une lettre de pré-admission d'au moins une université avant de déposer, et le dossier papier part en même temps à la Direction des bourses.",
      "status": "Fermée — appel 2026-2027 terminé au Sénégal",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://sn.china-embassy.gov.cn/fra/sgdt/202510/t20251028_11742627.htm",
        "citation": "Le dépôt de candidature est ouvert jusqu’au 15 février 2026. Le résultat de la bourse et de l’admission universitaire sortira en juillet 2026",
        "le": "2026-09-22T23:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Avis officiel de l'ambassade de Chine au Sénégal « BOURSE DU GOUVERNEMENT CHINOIS 2026/2027 EN FAVEUR DES ETUDIANTS SENEGALAIS » (28 octobre 2025) lu le 2026-09-22 — la source qui manquait à la fiche la plus vue du catalogue (studyinchina.csc.edu.cn et campuschina.org restent illisibles). L'appel 2026-2027 est terminé depuis le 15 février 2026 ; la fiche disait « Ouverte ». Faits ajoutés : lettre de PRÉ-ADMISSION obligatoire, test en ligne CSCA pour la licence, licence uniquement en chinois, dossier papier en parallèle à la Direction des bourses."
  },
  {
    "collection": "programs",
    "id": "sysu-phd",
    "attendu": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois.",
      "status": "Ouverte",
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "deadline": "La date dépend du pays : chaque ambassade de Chine publie son appel. Au Sénégal, l'appel 2026-2027 courait jusqu'au 15 février 2026 (résultats en juillet) ; l'appel 2027-2028 n'est pas encore publié. Il faut une lettre de pré-admission d'au moins une université avant de déposer, et le dossier papier part en même temps à la Direction des bourses.",
      "status": "Fermée — appel 2026-2027 terminé au Sénégal",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://sn.china-embassy.gov.cn/fra/sgdt/202510/t20251028_11742627.htm",
        "citation": "Le dépôt de candidature est ouvert jusqu’au 15 février 2026. Le résultat de la bourse et de l’admission universitaire sortira en juillet 2026",
        "le": "2026-09-22T23:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Avis officiel de l'ambassade de Chine au Sénégal « BOURSE DU GOUVERNEMENT CHINOIS 2026/2027 EN FAVEUR DES ETUDIANTS SENEGALAIS » (28 octobre 2025) lu le 2026-09-22 — la source qui manquait à la fiche la plus vue du catalogue (studyinchina.csc.edu.cn et campuschina.org restent illisibles). L'appel 2026-2027 est terminé depuis le 15 février 2026 ; la fiche disait « Ouverte ». Faits ajoutés : lettre de PRÉ-ADMISSION obligatoire, test en ligne CSCA pour la licence, licence uniquement en chinois, dossier papier en parallèle à la Direction des bourses."
  },
  {
    "collection": "programs",
    "id": "tju-bachelor",
    "attendu": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois.",
      "status": "Ouverte",
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "deadline": "La date dépend du pays : chaque ambassade de Chine publie son appel. Au Sénégal, l'appel 2026-2027 courait jusqu'au 15 février 2026 (résultats en juillet) ; l'appel 2027-2028 n'est pas encore publié. Il faut une lettre de pré-admission d'au moins une université avant de déposer, et le dossier papier part en même temps à la Direction des bourses.",
      "status": "Fermée — appel 2026-2027 terminé au Sénégal",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://sn.china-embassy.gov.cn/fra/sgdt/202510/t20251028_11742627.htm",
        "citation": "Le dépôt de candidature est ouvert jusqu’au 15 février 2026. Le résultat de la bourse et de l’admission universitaire sortira en juillet 2026",
        "le": "2026-09-22T23:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Avis officiel de l'ambassade de Chine au Sénégal « BOURSE DU GOUVERNEMENT CHINOIS 2026/2027 EN FAVEUR DES ETUDIANTS SENEGALAIS » (28 octobre 2025) lu le 2026-09-22 — la source qui manquait à la fiche la plus vue du catalogue (studyinchina.csc.edu.cn et campuschina.org restent illisibles). L'appel 2026-2027 est terminé depuis le 15 février 2026 ; la fiche disait « Ouverte ». Faits ajoutés : lettre de PRÉ-ADMISSION obligatoire, test en ligne CSCA pour la licence, licence uniquement en chinois, dossier papier en parallèle à la Direction des bourses."
  },
  {
    "collection": "programs",
    "id": "tju-master",
    "attendu": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois.",
      "status": "Ouverte",
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "deadline": "La date dépend du pays : chaque ambassade de Chine publie son appel. Au Sénégal, l'appel 2026-2027 courait jusqu'au 15 février 2026 (résultats en juillet) ; l'appel 2027-2028 n'est pas encore publié. Il faut une lettre de pré-admission d'au moins une université avant de déposer, et le dossier papier part en même temps à la Direction des bourses.",
      "status": "Fermée — appel 2026-2027 terminé au Sénégal",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://sn.china-embassy.gov.cn/fra/sgdt/202510/t20251028_11742627.htm",
        "citation": "Le dépôt de candidature est ouvert jusqu’au 15 février 2026. Le résultat de la bourse et de l’admission universitaire sortira en juillet 2026",
        "le": "2026-09-22T23:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Avis officiel de l'ambassade de Chine au Sénégal « BOURSE DU GOUVERNEMENT CHINOIS 2026/2027 EN FAVEUR DES ETUDIANTS SENEGALAIS » (28 octobre 2025) lu le 2026-09-22 — la source qui manquait à la fiche la plus vue du catalogue (studyinchina.csc.edu.cn et campuschina.org restent illisibles). L'appel 2026-2027 est terminé depuis le 15 février 2026 ; la fiche disait « Ouverte ». Faits ajoutés : lettre de PRÉ-ADMISSION obligatoire, test en ligne CSCA pour la licence, licence uniquement en chinois, dossier papier en parallèle à la Direction des bourses."
  },
  {
    "collection": "programs",
    "id": "tju-phd",
    "attendu": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois.",
      "status": "Ouverte",
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "deadline": "La date dépend du pays : chaque ambassade de Chine publie son appel. Au Sénégal, l'appel 2026-2027 courait jusqu'au 15 février 2026 (résultats en juillet) ; l'appel 2027-2028 n'est pas encore publié. Il faut une lettre de pré-admission d'au moins une université avant de déposer, et le dossier papier part en même temps à la Direction des bourses.",
      "status": "Fermée — appel 2026-2027 terminé au Sénégal",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://sn.china-embassy.gov.cn/fra/sgdt/202510/t20251028_11742627.htm",
        "citation": "Le dépôt de candidature est ouvert jusqu’au 15 février 2026. Le résultat de la bourse et de l’admission universitaire sortira en juillet 2026",
        "le": "2026-09-22T23:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Avis officiel de l'ambassade de Chine au Sénégal « BOURSE DU GOUVERNEMENT CHINOIS 2026/2027 EN FAVEUR DES ETUDIANTS SENEGALAIS » (28 octobre 2025) lu le 2026-09-22 — la source qui manquait à la fiche la plus vue du catalogue (studyinchina.csc.edu.cn et campuschina.org restent illisibles). L'appel 2026-2027 est terminé depuis le 15 février 2026 ; la fiche disait « Ouverte ». Faits ajoutés : lettre de PRÉ-ADMISSION obligatoire, test en ligne CSCA pour la licence, licence uniquement en chinois, dossier papier en parallèle à la Direction des bourses."
  },
  {
    "collection": "programs",
    "id": "tongji-bachelor",
    "attendu": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois.",
      "status": "Ouverte",
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "deadline": "La date dépend du pays : chaque ambassade de Chine publie son appel. Au Sénégal, l'appel 2026-2027 courait jusqu'au 15 février 2026 (résultats en juillet) ; l'appel 2027-2028 n'est pas encore publié. Il faut une lettre de pré-admission d'au moins une université avant de déposer, et le dossier papier part en même temps à la Direction des bourses.",
      "status": "Fermée — appel 2026-2027 terminé au Sénégal",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://sn.china-embassy.gov.cn/fra/sgdt/202510/t20251028_11742627.htm",
        "citation": "Le dépôt de candidature est ouvert jusqu’au 15 février 2026. Le résultat de la bourse et de l’admission universitaire sortira en juillet 2026",
        "le": "2026-09-22T23:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Avis officiel de l'ambassade de Chine au Sénégal « BOURSE DU GOUVERNEMENT CHINOIS 2026/2027 EN FAVEUR DES ETUDIANTS SENEGALAIS » (28 octobre 2025) lu le 2026-09-22 — la source qui manquait à la fiche la plus vue du catalogue (studyinchina.csc.edu.cn et campuschina.org restent illisibles). L'appel 2026-2027 est terminé depuis le 15 février 2026 ; la fiche disait « Ouverte ». Faits ajoutés : lettre de PRÉ-ADMISSION obligatoire, test en ligne CSCA pour la licence, licence uniquement en chinois, dossier papier en parallèle à la Direction des bourses."
  },
  {
    "collection": "programs",
    "id": "tongji-master",
    "attendu": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois.",
      "status": "Ouverte",
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "deadline": "La date dépend du pays : chaque ambassade de Chine publie son appel. Au Sénégal, l'appel 2026-2027 courait jusqu'au 15 février 2026 (résultats en juillet) ; l'appel 2027-2028 n'est pas encore publié. Il faut une lettre de pré-admission d'au moins une université avant de déposer, et le dossier papier part en même temps à la Direction des bourses.",
      "status": "Fermée — appel 2026-2027 terminé au Sénégal",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://sn.china-embassy.gov.cn/fra/sgdt/202510/t20251028_11742627.htm",
        "citation": "Le dépôt de candidature est ouvert jusqu’au 15 février 2026. Le résultat de la bourse et de l’admission universitaire sortira en juillet 2026",
        "le": "2026-09-22T23:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Avis officiel de l'ambassade de Chine au Sénégal « BOURSE DU GOUVERNEMENT CHINOIS 2026/2027 EN FAVEUR DES ETUDIANTS SENEGALAIS » (28 octobre 2025) lu le 2026-09-22 — la source qui manquait à la fiche la plus vue du catalogue (studyinchina.csc.edu.cn et campuschina.org restent illisibles). L'appel 2026-2027 est terminé depuis le 15 février 2026 ; la fiche disait « Ouverte ». Faits ajoutés : lettre de PRÉ-ADMISSION obligatoire, test en ligne CSCA pour la licence, licence uniquement en chinois, dossier papier en parallèle à la Direction des bourses."
  },
  {
    "collection": "programs",
    "id": "tongji-phd",
    "attendu": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois.",
      "status": "Ouverte",
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "deadline": "La date dépend du pays : chaque ambassade de Chine publie son appel. Au Sénégal, l'appel 2026-2027 courait jusqu'au 15 février 2026 (résultats en juillet) ; l'appel 2027-2028 n'est pas encore publié. Il faut une lettre de pré-admission d'au moins une université avant de déposer, et le dossier papier part en même temps à la Direction des bourses.",
      "status": "Fermée — appel 2026-2027 terminé au Sénégal",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://sn.china-embassy.gov.cn/fra/sgdt/202510/t20251028_11742627.htm",
        "citation": "Le dépôt de candidature est ouvert jusqu’au 15 février 2026. Le résultat de la bourse et de l’admission universitaire sortira en juillet 2026",
        "le": "2026-09-22T23:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Avis officiel de l'ambassade de Chine au Sénégal « BOURSE DU GOUVERNEMENT CHINOIS 2026/2027 EN FAVEUR DES ETUDIANTS SENEGALAIS » (28 octobre 2025) lu le 2026-09-22 — la source qui manquait à la fiche la plus vue du catalogue (studyinchina.csc.edu.cn et campuschina.org restent illisibles). L'appel 2026-2027 est terminé depuis le 15 février 2026 ; la fiche disait « Ouverte ». Faits ajoutés : lettre de PRÉ-ADMISSION obligatoire, test en ligne CSCA pour la licence, licence uniquement en chinois, dossier papier en parallèle à la Direction des bourses."
  },
  {
    "collection": "programs",
    "id": "tsinghua-bachelor",
    "attendu": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois.",
      "status": "Ouverte",
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "deadline": "La date dépend du pays : chaque ambassade de Chine publie son appel. Au Sénégal, l'appel 2026-2027 courait jusqu'au 15 février 2026 (résultats en juillet) ; l'appel 2027-2028 n'est pas encore publié. Il faut une lettre de pré-admission d'au moins une université avant de déposer, et le dossier papier part en même temps à la Direction des bourses.",
      "status": "Fermée — appel 2026-2027 terminé au Sénégal",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://sn.china-embassy.gov.cn/fra/sgdt/202510/t20251028_11742627.htm",
        "citation": "Le dépôt de candidature est ouvert jusqu’au 15 février 2026. Le résultat de la bourse et de l’admission universitaire sortira en juillet 2026",
        "le": "2026-09-22T23:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Avis officiel de l'ambassade de Chine au Sénégal « BOURSE DU GOUVERNEMENT CHINOIS 2026/2027 EN FAVEUR DES ETUDIANTS SENEGALAIS » (28 octobre 2025) lu le 2026-09-22 — la source qui manquait à la fiche la plus vue du catalogue (studyinchina.csc.edu.cn et campuschina.org restent illisibles). L'appel 2026-2027 est terminé depuis le 15 février 2026 ; la fiche disait « Ouverte ». Faits ajoutés : lettre de PRÉ-ADMISSION obligatoire, test en ligne CSCA pour la licence, licence uniquement en chinois, dossier papier en parallèle à la Direction des bourses."
  },
  {
    "collection": "programs",
    "id": "tsinghua-master",
    "attendu": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois.",
      "status": "Ouverte",
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "deadline": "La date dépend du pays : chaque ambassade de Chine publie son appel. Au Sénégal, l'appel 2026-2027 courait jusqu'au 15 février 2026 (résultats en juillet) ; l'appel 2027-2028 n'est pas encore publié. Il faut une lettre de pré-admission d'au moins une université avant de déposer, et le dossier papier part en même temps à la Direction des bourses.",
      "status": "Fermée — appel 2026-2027 terminé au Sénégal",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://sn.china-embassy.gov.cn/fra/sgdt/202510/t20251028_11742627.htm",
        "citation": "Le dépôt de candidature est ouvert jusqu’au 15 février 2026. Le résultat de la bourse et de l’admission universitaire sortira en juillet 2026",
        "le": "2026-09-22T23:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Avis officiel de l'ambassade de Chine au Sénégal « BOURSE DU GOUVERNEMENT CHINOIS 2026/2027 EN FAVEUR DES ETUDIANTS SENEGALAIS » (28 octobre 2025) lu le 2026-09-22 — la source qui manquait à la fiche la plus vue du catalogue (studyinchina.csc.edu.cn et campuschina.org restent illisibles). L'appel 2026-2027 est terminé depuis le 15 février 2026 ; la fiche disait « Ouverte ». Faits ajoutés : lettre de PRÉ-ADMISSION obligatoire, test en ligne CSCA pour la licence, licence uniquement en chinois, dossier papier en parallèle à la Direction des bourses."
  },
  {
    "collection": "programs",
    "id": "tsinghua-phd",
    "attendu": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois.",
      "status": "Ouverte",
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "deadline": "La date dépend du pays : chaque ambassade de Chine publie son appel. Au Sénégal, l'appel 2026-2027 courait jusqu'au 15 février 2026 (résultats en juillet) ; l'appel 2027-2028 n'est pas encore publié. Il faut une lettre de pré-admission d'au moins une université avant de déposer, et le dossier papier part en même temps à la Direction des bourses.",
      "status": "Fermée — appel 2026-2027 terminé au Sénégal",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://sn.china-embassy.gov.cn/fra/sgdt/202510/t20251028_11742627.htm",
        "citation": "Le dépôt de candidature est ouvert jusqu’au 15 février 2026. Le résultat de la bourse et de l’admission universitaire sortira en juillet 2026",
        "le": "2026-09-22T23:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Avis officiel de l'ambassade de Chine au Sénégal « BOURSE DU GOUVERNEMENT CHINOIS 2026/2027 EN FAVEUR DES ETUDIANTS SENEGALAIS » (28 octobre 2025) lu le 2026-09-22 — la source qui manquait à la fiche la plus vue du catalogue (studyinchina.csc.edu.cn et campuschina.org restent illisibles). L'appel 2026-2027 est terminé depuis le 15 février 2026 ; la fiche disait « Ouverte ». Faits ajoutés : lettre de PRÉ-ADMISSION obligatoire, test en ligne CSCA pour la licence, licence uniquement en chinois, dossier papier en parallèle à la Direction des bourses."
  },
  {
    "collection": "programs",
    "id": "ustc-bachelor",
    "attendu": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois.",
      "status": "Ouverte",
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "deadline": "La date dépend du pays : chaque ambassade de Chine publie son appel. Au Sénégal, l'appel 2026-2027 courait jusqu'au 15 février 2026 (résultats en juillet) ; l'appel 2027-2028 n'est pas encore publié. Il faut une lettre de pré-admission d'au moins une université avant de déposer, et le dossier papier part en même temps à la Direction des bourses.",
      "status": "Fermée — appel 2026-2027 terminé au Sénégal",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://sn.china-embassy.gov.cn/fra/sgdt/202510/t20251028_11742627.htm",
        "citation": "Le dépôt de candidature est ouvert jusqu’au 15 février 2026. Le résultat de la bourse et de l’admission universitaire sortira en juillet 2026",
        "le": "2026-09-22T23:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Avis officiel de l'ambassade de Chine au Sénégal « BOURSE DU GOUVERNEMENT CHINOIS 2026/2027 EN FAVEUR DES ETUDIANTS SENEGALAIS » (28 octobre 2025) lu le 2026-09-22 — la source qui manquait à la fiche la plus vue du catalogue (studyinchina.csc.edu.cn et campuschina.org restent illisibles). L'appel 2026-2027 est terminé depuis le 15 février 2026 ; la fiche disait « Ouverte ». Faits ajoutés : lettre de PRÉ-ADMISSION obligatoire, test en ligne CSCA pour la licence, licence uniquement en chinois, dossier papier en parallèle à la Direction des bourses."
  },
  {
    "collection": "programs",
    "id": "ustc-master",
    "attendu": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois.",
      "status": "Ouverte",
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "deadline": "La date dépend du pays : chaque ambassade de Chine publie son appel. Au Sénégal, l'appel 2026-2027 courait jusqu'au 15 février 2026 (résultats en juillet) ; l'appel 2027-2028 n'est pas encore publié. Il faut une lettre de pré-admission d'au moins une université avant de déposer, et le dossier papier part en même temps à la Direction des bourses.",
      "status": "Fermée — appel 2026-2027 terminé au Sénégal",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://sn.china-embassy.gov.cn/fra/sgdt/202510/t20251028_11742627.htm",
        "citation": "Le dépôt de candidature est ouvert jusqu’au 15 février 2026. Le résultat de la bourse et de l’admission universitaire sortira en juillet 2026",
        "le": "2026-09-22T23:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Avis officiel de l'ambassade de Chine au Sénégal « BOURSE DU GOUVERNEMENT CHINOIS 2026/2027 EN FAVEUR DES ETUDIANTS SENEGALAIS » (28 octobre 2025) lu le 2026-09-22 — la source qui manquait à la fiche la plus vue du catalogue (studyinchina.csc.edu.cn et campuschina.org restent illisibles). L'appel 2026-2027 est terminé depuis le 15 février 2026 ; la fiche disait « Ouverte ». Faits ajoutés : lettre de PRÉ-ADMISSION obligatoire, test en ligne CSCA pour la licence, licence uniquement en chinois, dossier papier en parallèle à la Direction des bourses."
  },
  {
    "collection": "programs",
    "id": "ustc-phd",
    "attendu": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois.",
      "status": "Ouverte",
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "deadline": "La date dépend du pays : chaque ambassade de Chine publie son appel. Au Sénégal, l'appel 2026-2027 courait jusqu'au 15 février 2026 (résultats en juillet) ; l'appel 2027-2028 n'est pas encore publié. Il faut une lettre de pré-admission d'au moins une université avant de déposer, et le dossier papier part en même temps à la Direction des bourses.",
      "status": "Fermée — appel 2026-2027 terminé au Sénégal",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://sn.china-embassy.gov.cn/fra/sgdt/202510/t20251028_11742627.htm",
        "citation": "Le dépôt de candidature est ouvert jusqu’au 15 février 2026. Le résultat de la bourse et de l’admission universitaire sortira en juillet 2026",
        "le": "2026-09-22T23:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Avis officiel de l'ambassade de Chine au Sénégal « BOURSE DU GOUVERNEMENT CHINOIS 2026/2027 EN FAVEUR DES ETUDIANTS SENEGALAIS » (28 octobre 2025) lu le 2026-09-22 — la source qui manquait à la fiche la plus vue du catalogue (studyinchina.csc.edu.cn et campuschina.org restent illisibles). L'appel 2026-2027 est terminé depuis le 15 février 2026 ; la fiche disait « Ouverte ». Faits ajoutés : lettre de PRÉ-ADMISSION obligatoire, test en ligne CSCA pour la licence, licence uniquement en chinois, dossier papier en parallèle à la Direction des bourses."
  },
  {
    "collection": "programs",
    "id": "whu-bachelor",
    "attendu": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois.",
      "status": "Ouverte",
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "deadline": "La date dépend du pays : chaque ambassade de Chine publie son appel. Au Sénégal, l'appel 2026-2027 courait jusqu'au 15 février 2026 (résultats en juillet) ; l'appel 2027-2028 n'est pas encore publié. Il faut une lettre de pré-admission d'au moins une université avant de déposer, et le dossier papier part en même temps à la Direction des bourses.",
      "status": "Fermée — appel 2026-2027 terminé au Sénégal",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://sn.china-embassy.gov.cn/fra/sgdt/202510/t20251028_11742627.htm",
        "citation": "Le dépôt de candidature est ouvert jusqu’au 15 février 2026. Le résultat de la bourse et de l’admission universitaire sortira en juillet 2026",
        "le": "2026-09-22T23:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Avis officiel de l'ambassade de Chine au Sénégal « BOURSE DU GOUVERNEMENT CHINOIS 2026/2027 EN FAVEUR DES ETUDIANTS SENEGALAIS » (28 octobre 2025) lu le 2026-09-22 — la source qui manquait à la fiche la plus vue du catalogue (studyinchina.csc.edu.cn et campuschina.org restent illisibles). L'appel 2026-2027 est terminé depuis le 15 février 2026 ; la fiche disait « Ouverte ». Faits ajoutés : lettre de PRÉ-ADMISSION obligatoire, test en ligne CSCA pour la licence, licence uniquement en chinois, dossier papier en parallèle à la Direction des bourses."
  },
  {
    "collection": "programs",
    "id": "whu-master",
    "attendu": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois.",
      "status": "Ouverte",
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "deadline": "La date dépend du pays : chaque ambassade de Chine publie son appel. Au Sénégal, l'appel 2026-2027 courait jusqu'au 15 février 2026 (résultats en juillet) ; l'appel 2027-2028 n'est pas encore publié. Il faut une lettre de pré-admission d'au moins une université avant de déposer, et le dossier papier part en même temps à la Direction des bourses.",
      "status": "Fermée — appel 2026-2027 terminé au Sénégal",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://sn.china-embassy.gov.cn/fra/sgdt/202510/t20251028_11742627.htm",
        "citation": "Le dépôt de candidature est ouvert jusqu’au 15 février 2026. Le résultat de la bourse et de l’admission universitaire sortira en juillet 2026",
        "le": "2026-09-22T23:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Avis officiel de l'ambassade de Chine au Sénégal « BOURSE DU GOUVERNEMENT CHINOIS 2026/2027 EN FAVEUR DES ETUDIANTS SENEGALAIS » (28 octobre 2025) lu le 2026-09-22 — la source qui manquait à la fiche la plus vue du catalogue (studyinchina.csc.edu.cn et campuschina.org restent illisibles). L'appel 2026-2027 est terminé depuis le 15 février 2026 ; la fiche disait « Ouverte ». Faits ajoutés : lettre de PRÉ-ADMISSION obligatoire, test en ligne CSCA pour la licence, licence uniquement en chinois, dossier papier en parallèle à la Direction des bourses."
  },
  {
    "collection": "programs",
    "id": "whu-phd",
    "attendu": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois.",
      "status": "Ouverte",
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "deadline": "La date dépend du pays : chaque ambassade de Chine publie son appel. Au Sénégal, l'appel 2026-2027 courait jusqu'au 15 février 2026 (résultats en juillet) ; l'appel 2027-2028 n'est pas encore publié. Il faut une lettre de pré-admission d'au moins une université avant de déposer, et le dossier papier part en même temps à la Direction des bourses.",
      "status": "Fermée — appel 2026-2027 terminé au Sénégal",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://sn.china-embassy.gov.cn/fra/sgdt/202510/t20251028_11742627.htm",
        "citation": "Le dépôt de candidature est ouvert jusqu’au 15 février 2026. Le résultat de la bourse et de l’admission universitaire sortira en juillet 2026",
        "le": "2026-09-22T23:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Avis officiel de l'ambassade de Chine au Sénégal « BOURSE DU GOUVERNEMENT CHINOIS 2026/2027 EN FAVEUR DES ETUDIANTS SENEGALAIS » (28 octobre 2025) lu le 2026-09-22 — la source qui manquait à la fiche la plus vue du catalogue (studyinchina.csc.edu.cn et campuschina.org restent illisibles). L'appel 2026-2027 est terminé depuis le 15 février 2026 ; la fiche disait « Ouverte ». Faits ajoutés : lettre de PRÉ-ADMISSION obligatoire, test en ligne CSCA pour la licence, licence uniquement en chinois, dossier papier en parallèle à la Direction des bourses."
  },
  {
    "collection": "programs",
    "id": "xmu-bachelor",
    "attendu": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois.",
      "status": "Ouverte",
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "deadline": "La date dépend du pays : chaque ambassade de Chine publie son appel. Au Sénégal, l'appel 2026-2027 courait jusqu'au 15 février 2026 (résultats en juillet) ; l'appel 2027-2028 n'est pas encore publié. Il faut une lettre de pré-admission d'au moins une université avant de déposer, et le dossier papier part en même temps à la Direction des bourses.",
      "status": "Fermée — appel 2026-2027 terminé au Sénégal",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://sn.china-embassy.gov.cn/fra/sgdt/202510/t20251028_11742627.htm",
        "citation": "Le dépôt de candidature est ouvert jusqu’au 15 février 2026. Le résultat de la bourse et de l’admission universitaire sortira en juillet 2026",
        "le": "2026-09-22T23:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Avis officiel de l'ambassade de Chine au Sénégal « BOURSE DU GOUVERNEMENT CHINOIS 2026/2027 EN FAVEUR DES ETUDIANTS SENEGALAIS » (28 octobre 2025) lu le 2026-09-22 — la source qui manquait à la fiche la plus vue du catalogue (studyinchina.csc.edu.cn et campuschina.org restent illisibles). L'appel 2026-2027 est terminé depuis le 15 février 2026 ; la fiche disait « Ouverte ». Faits ajoutés : lettre de PRÉ-ADMISSION obligatoire, test en ligne CSCA pour la licence, licence uniquement en chinois, dossier papier en parallèle à la Direction des bourses."
  },
  {
    "collection": "programs",
    "id": "xmu-master",
    "attendu": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois.",
      "status": "Ouverte",
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "deadline": "La date dépend du pays : chaque ambassade de Chine publie son appel. Au Sénégal, l'appel 2026-2027 courait jusqu'au 15 février 2026 (résultats en juillet) ; l'appel 2027-2028 n'est pas encore publié. Il faut une lettre de pré-admission d'au moins une université avant de déposer, et le dossier papier part en même temps à la Direction des bourses.",
      "status": "Fermée — appel 2026-2027 terminé au Sénégal",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://sn.china-embassy.gov.cn/fra/sgdt/202510/t20251028_11742627.htm",
        "citation": "Le dépôt de candidature est ouvert jusqu’au 15 février 2026. Le résultat de la bourse et de l’admission universitaire sortira en juillet 2026",
        "le": "2026-09-22T23:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Avis officiel de l'ambassade de Chine au Sénégal « BOURSE DU GOUVERNEMENT CHINOIS 2026/2027 EN FAVEUR DES ETUDIANTS SENEGALAIS » (28 octobre 2025) lu le 2026-09-22 — la source qui manquait à la fiche la plus vue du catalogue (studyinchina.csc.edu.cn et campuschina.org restent illisibles). L'appel 2026-2027 est terminé depuis le 15 février 2026 ; la fiche disait « Ouverte ». Faits ajoutés : lettre de PRÉ-ADMISSION obligatoire, test en ligne CSCA pour la licence, licence uniquement en chinois, dossier papier en parallèle à la Direction des bourses."
  },
  {
    "collection": "programs",
    "id": "xmu-phd",
    "attendu": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois.",
      "status": "Ouverte",
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "deadline": "La date dépend du pays : chaque ambassade de Chine publie son appel. Au Sénégal, l'appel 2026-2027 courait jusqu'au 15 février 2026 (résultats en juillet) ; l'appel 2027-2028 n'est pas encore publié. Il faut une lettre de pré-admission d'au moins une université avant de déposer, et le dossier papier part en même temps à la Direction des bourses.",
      "status": "Fermée — appel 2026-2027 terminé au Sénégal",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://sn.china-embassy.gov.cn/fra/sgdt/202510/t20251028_11742627.htm",
        "citation": "Le dépôt de candidature est ouvert jusqu’au 15 février 2026. Le résultat de la bourse et de l’admission universitaire sortira en juillet 2026",
        "le": "2026-09-22T23:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Avis officiel de l'ambassade de Chine au Sénégal « BOURSE DU GOUVERNEMENT CHINOIS 2026/2027 EN FAVEUR DES ETUDIANTS SENEGALAIS » (28 octobre 2025) lu le 2026-09-22 — la source qui manquait à la fiche la plus vue du catalogue (studyinchina.csc.edu.cn et campuschina.org restent illisibles). L'appel 2026-2027 est terminé depuis le 15 février 2026 ; la fiche disait « Ouverte ». Faits ajoutés : lettre de PRÉ-ADMISSION obligatoire, test en ligne CSCA pour la licence, licence uniquement en chinois, dossier papier en parallèle à la Direction des bourses."
  },
  {
    "collection": "programs",
    "id": "zju-bachelor",
    "attendu": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois.",
      "status": "Ouverte",
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "deadline": "La date dépend du pays : chaque ambassade de Chine publie son appel. Au Sénégal, l'appel 2026-2027 courait jusqu'au 15 février 2026 (résultats en juillet) ; l'appel 2027-2028 n'est pas encore publié. Il faut une lettre de pré-admission d'au moins une université avant de déposer, et le dossier papier part en même temps à la Direction des bourses.",
      "status": "Fermée — appel 2026-2027 terminé au Sénégal",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://sn.china-embassy.gov.cn/fra/sgdt/202510/t20251028_11742627.htm",
        "citation": "Le dépôt de candidature est ouvert jusqu’au 15 février 2026. Le résultat de la bourse et de l’admission universitaire sortira en juillet 2026",
        "le": "2026-09-22T23:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Avis officiel de l'ambassade de Chine au Sénégal « BOURSE DU GOUVERNEMENT CHINOIS 2026/2027 EN FAVEUR DES ETUDIANTS SENEGALAIS » (28 octobre 2025) lu le 2026-09-22 — la source qui manquait à la fiche la plus vue du catalogue (studyinchina.csc.edu.cn et campuschina.org restent illisibles). L'appel 2026-2027 est terminé depuis le 15 février 2026 ; la fiche disait « Ouverte ». Faits ajoutés : lettre de PRÉ-ADMISSION obligatoire, test en ligne CSCA pour la licence, licence uniquement en chinois, dossier papier en parallèle à la Direction des bourses."
  },
  {
    "collection": "programs",
    "id": "zju-master",
    "attendu": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois.",
      "status": "Ouverte",
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "deadline": "La date dépend du pays : chaque ambassade de Chine publie son appel. Au Sénégal, l'appel 2026-2027 courait jusqu'au 15 février 2026 (résultats en juillet) ; l'appel 2027-2028 n'est pas encore publié. Il faut une lettre de pré-admission d'au moins une université avant de déposer, et le dossier papier part en même temps à la Direction des bourses.",
      "status": "Fermée — appel 2026-2027 terminé au Sénégal",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://sn.china-embassy.gov.cn/fra/sgdt/202510/t20251028_11742627.htm",
        "citation": "Le dépôt de candidature est ouvert jusqu’au 15 février 2026. Le résultat de la bourse et de l’admission universitaire sortira en juillet 2026",
        "le": "2026-09-22T23:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Avis officiel de l'ambassade de Chine au Sénégal « BOURSE DU GOUVERNEMENT CHINOIS 2026/2027 EN FAVEUR DES ETUDIANTS SENEGALAIS » (28 octobre 2025) lu le 2026-09-22 — la source qui manquait à la fiche la plus vue du catalogue (studyinchina.csc.edu.cn et campuschina.org restent illisibles). L'appel 2026-2027 est terminé depuis le 15 février 2026 ; la fiche disait « Ouverte ». Faits ajoutés : lettre de PRÉ-ADMISSION obligatoire, test en ligne CSCA pour la licence, licence uniquement en chinois, dossier papier en parallèle à la Direction des bourses."
  },
  {
    "collection": "programs",
    "id": "zju-phd",
    "attendu": {
      "deadline": "La date limite DÉPEND DU PAYS : chaque ambassade de Chine publie son propre appel (Type A) avec son numéro d'agence, et le dossier se dépose en ligne sur campuschina.org sous ce numéro. Pour la rentrée 2026, l'ambassade en Indonésie clôturait par exemple début février ; les appels pour la rentrée 2027 paraissent à l'automne. Âge maximal : 25 ans en licence, 35 en master, 40 en doctorat. Pièces exigées : lettre de pré-admission d'une université chinoise, plan d'études (200 mots en licence) ou projet de recherche (800 mots en master et doctorat), deux lettres de recommandation en master et doctorat, HSK 3 (master) ou HSK 4 (doctorat) pour les programmes en chinois, diplômes et relevés notariés, extrait de casier judiciaire, passeport valable douze mois.",
      "status": "Ouverte",
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "deadline": "La date dépend du pays : chaque ambassade de Chine publie son appel. Au Sénégal, l'appel 2026-2027 courait jusqu'au 15 février 2026 (résultats en juillet) ; l'appel 2027-2028 n'est pas encore publié. Il faut une lettre de pré-admission d'au moins une université avant de déposer, et le dossier papier part en même temps à la Direction des bourses.",
      "status": "Fermée — appel 2026-2027 terminé au Sénégal",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://sn.china-embassy.gov.cn/fra/sgdt/202510/t20251028_11742627.htm",
        "citation": "Le dépôt de candidature est ouvert jusqu’au 15 février 2026. Le résultat de la bourse et de l’admission universitaire sortira en juillet 2026",
        "le": "2026-09-22T23:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Avis officiel de l'ambassade de Chine au Sénégal « BOURSE DU GOUVERNEMENT CHINOIS 2026/2027 EN FAVEUR DES ETUDIANTS SENEGALAIS » (28 octobre 2025) lu le 2026-09-22 — la source qui manquait à la fiche la plus vue du catalogue (studyinchina.csc.edu.cn et campuschina.org restent illisibles). L'appel 2026-2027 est terminé depuis le 15 février 2026 ; la fiche disait « Ouverte ». Faits ajoutés : lettre de PRÉ-ADMISSION obligatoire, test en ligne CSCA pour la licence, licence uniquement en chinois, dossier papier en parallèle à la Direction des bourses."
  },
  {
    "collection": "scholarships",
    "id": "global-korea-scholarship",
    "attendu": {
      "generalCriteria": "DEUX PROGRAMMES DISTINCTS, aux calendriers sans recouvrement : GKS-U (Licence) — candidatures mi-septembre à fin septembre, cycle 2027 attendu vers le 15 septembre 2026 ; GKS-G (Master/Doctorat) — candidatures mi-février à fin février, cycle 2027 attendu vers février 2027. DEUX CANAUX à quotas séparés : par l'ambassade de Corée (quota national — l'ambassade au Sénégal publie les appels en français) ou en direct auprès d'une université désignée GKS. Le nombre de places attribuées au Sénégal n'est pas publié. « KGSP » et « Korean Government Scholarship Program » sont l'ANCIEN nom du GKS, pas des programmes distincts.",
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.studyinkorea.go.kr/en/plan/scholarship.do?tab=gks-tab1",
      "periodeOuverture": "licence : septembre-octobre ; master et doctorat : février-mars"
    },
    "champs": {
      "generalCriteria": "DEUX PROGRAMMES, DEUX CALENDRIERS. Licence (GKS-U) 2027 : voie ambassade en ligne du 15 au 30 septembre 2026 (18h, heure de Corée), réservée à 74 pays — le Sénégal n'y figure PAS ; voie université de septembre à novembre 2026, dont le programme UIC (100 places dans 13 établissements, sciences et ingénierie) ouvert à tous les pays. Master et doctorat (GKS-G) : l'appel 2027 n'est pas encore publié. Choix de trois universités au plus dans la voie ambassade, dont au moins une de type B. « KGSP » est l'ancien nom du GKS.",
      "verifieLe": "2026-09-22",
      "sourceEcheance": "https://www.studyinkorea.go.kr/ko/plan/gksNoticeRead.do?bbsId=BBSMSTR_000000000461&nttId=4522",
      "periodeOuverture": "licence : appel publié début septembre, dépôt ambassade la seconde quinzaine de septembre, voie université jusqu'en novembre ; master et doctorat : appel distinct, non encore publié pour 2027"
    },
    "motif": "Appel « 2027 Global Korea Scholarship for Undergraduate Degrees » publié le 9 septembre 2026 par NIIED, guide officiel (48 pages) lu le 2026-09-22. DÉCOUVERTE : la voie ambassade (156 places) est réservée à 74 pays, et le SÉNÉGAL N'EN FAIT PAS PARTIE ; un Sénégalais ne peut passer que par la voie université UIC (100 places, 13 établissements, sciences et ingénierie). Les programmes de master et doctorat n'avaient AUCUN texte d'échéance."
  },
  {
    "collection": "programs",
    "id": "kaist-daejeon__global-korea-scholarship__doctorat",
    "attendu": {
      "deadline": undefined,
      "status": undefined,
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "deadline": "L'appel 2027 du GKS pour le master et le doctorat (GKS-G) n'est pas encore publié : seul celui de la licence est paru, début septembre 2026. Dépôt, le moment venu, par l'ambassade de Corée du pays ou directement auprès d'une université désignée.",
      "status": "Fermée — appel master et doctorat 2027 non publié",
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Appel « 2027 Global Korea Scholarship for Undergraduate Degrees » publié le 9 septembre 2026 par NIIED, guide officiel (48 pages) lu le 2026-09-22. DÉCOUVERTE : la voie ambassade (156 places) est réservée à 74 pays, et le SÉNÉGAL N'EN FAIT PAS PARTIE ; un Sénégalais ne peut passer que par la voie université UIC (100 places, 13 établissements, sciences et ingénierie). Les programmes de master et doctorat n'avaient AUCUN texte d'échéance."
  },
  {
    "collection": "programs",
    "id": "kaist-daejeon__global-korea-scholarship__master",
    "attendu": {
      "deadline": undefined,
      "status": undefined,
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "deadline": "L'appel 2027 du GKS pour le master et le doctorat (GKS-G) n'est pas encore publié : seul celui de la licence est paru, début septembre 2026. Dépôt, le moment venu, par l'ambassade de Corée du pays ou directement auprès d'une université désignée.",
      "status": "Fermée — appel master et doctorat 2027 non publié",
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Appel « 2027 Global Korea Scholarship for Undergraduate Degrees » publié le 9 septembre 2026 par NIIED, guide officiel (48 pages) lu le 2026-09-22. DÉCOUVERTE : la voie ambassade (156 places) est réservée à 74 pays, et le SÉNÉGAL N'EN FAIT PAS PARTIE ; un Sénégalais ne peut passer que par la voie université UIC (100 places, 13 établissements, sciences et ingénierie). Les programmes de master et doctorat n'avaient AUCUN texte d'échéance."
  },
  {
    "collection": "programs",
    "id": "korea-university-seoul__global-korea-scholarship",
    "attendu": {
      "deadline": "Deux appels par an. GKS licence (GKS-U) : appel publié en septembre, dépôt en septembre-octobre auprès de l'ambassade de Corée ou d'une université partenaire, résultats en décembre, moins de 25 ans. GKS master et doctorat (GKS-G) : dépôt en février-mars, résultats en juin, moins de 40 ans. Deux voies dans les deux cas — l'ambassade du pays de résidence (avec sa propre date) ou directement l'université.",
      "deadlineISO": undefined,
      "status": "Ouverte — appel licence en cours, date propre à chaque ambassade",
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "deadline": "30 septembre 2026 à 18h (heure de Corée) : clôture de la voie ambassade du GKS licence 2027, ouverte le 15 septembre — réservée à 74 pays, dont le Sénégal ne fait pas partie. La voie université court de septembre à novembre 2026 selon chaque établissement ; son programme UIC, ouvert à tous les pays, ne concerne que 13 établissements en sciences et ingénierie.",
      "deadlineISO": "2026-09-30",
      "status": "Ouverte — voie ambassade (74 pays) jusqu'au 30 septembre 2026",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://www.studyinkorea.go.kr/ko/plan/gksNoticeRead.do?bbsId=BBSMSTR_000000000461&nttId=4522",
        "citation": "Application Period: September 15, 2026 (Tue.), 11:00 – September 30, 2026 (Wed.), 18:00",
        "le": "2026-09-22T23:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Appel « 2027 Global Korea Scholarship for Undergraduate Degrees » publié le 9 septembre 2026 par NIIED, guide officiel (48 pages) lu le 2026-09-22. DÉCOUVERTE : la voie ambassade (156 places) est réservée à 74 pays, et le SÉNÉGAL N'EN FAIT PAS PARTIE ; un Sénégalais ne peut passer que par la voie université UIC (100 places, 13 établissements, sciences et ingénierie). Les programmes de master et doctorat n'avaient AUCUN texte d'échéance."
  },
  {
    "collection": "programs",
    "id": "postech-pohang__global-korea-scholarship__doctorat",
    "attendu": {
      "deadline": undefined,
      "status": undefined,
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "deadline": "L'appel 2027 du GKS pour le master et le doctorat (GKS-G) n'est pas encore publié : seul celui de la licence est paru, début septembre 2026. Dépôt, le moment venu, par l'ambassade de Corée du pays ou directement auprès d'une université désignée.",
      "status": "Fermée — appel master et doctorat 2027 non publié",
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Appel « 2027 Global Korea Scholarship for Undergraduate Degrees » publié le 9 septembre 2026 par NIIED, guide officiel (48 pages) lu le 2026-09-22. DÉCOUVERTE : la voie ambassade (156 places) est réservée à 74 pays, et le SÉNÉGAL N'EN FAIT PAS PARTIE ; un Sénégalais ne peut passer que par la voie université UIC (100 places, 13 établissements, sciences et ingénierie). Les programmes de master et doctorat n'avaient AUCUN texte d'échéance."
  },
  {
    "collection": "programs",
    "id": "postech-pohang__global-korea-scholarship__master",
    "attendu": {
      "deadline": undefined,
      "status": undefined,
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "deadline": "L'appel 2027 du GKS pour le master et le doctorat (GKS-G) n'est pas encore publié : seul celui de la licence est paru, début septembre 2026. Dépôt, le moment venu, par l'ambassade de Corée du pays ou directement auprès d'une université désignée.",
      "status": "Fermée — appel master et doctorat 2027 non publié",
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Appel « 2027 Global Korea Scholarship for Undergraduate Degrees » publié le 9 septembre 2026 par NIIED, guide officiel (48 pages) lu le 2026-09-22. DÉCOUVERTE : la voie ambassade (156 places) est réservée à 74 pays, et le SÉNÉGAL N'EN FAIT PAS PARTIE ; un Sénégalais ne peut passer que par la voie université UIC (100 places, 13 établissements, sciences et ingénierie). Les programmes de master et doctorat n'avaient AUCUN texte d'échéance."
  },
  {
    "collection": "programs",
    "id": "seoul-national-university-seoul__global-korea-scholarship__doctorat",
    "attendu": {
      "deadline": undefined,
      "status": undefined,
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "deadline": "L'appel 2027 du GKS pour le master et le doctorat (GKS-G) n'est pas encore publié : seul celui de la licence est paru, début septembre 2026. Dépôt, le moment venu, par l'ambassade de Corée du pays ou directement auprès d'une université désignée.",
      "status": "Fermée — appel master et doctorat 2027 non publié",
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Appel « 2027 Global Korea Scholarship for Undergraduate Degrees » publié le 9 septembre 2026 par NIIED, guide officiel (48 pages) lu le 2026-09-22. DÉCOUVERTE : la voie ambassade (156 places) est réservée à 74 pays, et le SÉNÉGAL N'EN FAIT PAS PARTIE ; un Sénégalais ne peut passer que par la voie université UIC (100 places, 13 établissements, sciences et ingénierie). Les programmes de master et doctorat n'avaient AUCUN texte d'échéance."
  },
  {
    "collection": "programs",
    "id": "seoul-national-university-seoul__global-korea-scholarship__master",
    "attendu": {
      "deadline": undefined,
      "status": undefined,
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "deadline": "L'appel 2027 du GKS pour le master et le doctorat (GKS-G) n'est pas encore publié : seul celui de la licence est paru, début septembre 2026. Dépôt, le moment venu, par l'ambassade de Corée du pays ou directement auprès d'une université désignée.",
      "status": "Fermée — appel master et doctorat 2027 non publié",
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Appel « 2027 Global Korea Scholarship for Undergraduate Degrees » publié le 9 septembre 2026 par NIIED, guide officiel (48 pages) lu le 2026-09-22. DÉCOUVERTE : la voie ambassade (156 places) est réservée à 74 pays, et le SÉNÉGAL N'EN FAIT PAS PARTIE ; un Sénégalais ne peut passer que par la voie université UIC (100 places, 13 établissements, sciences et ingénierie). Les programmes de master et doctorat n'avaient AUCUN texte d'échéance."
  },
  {
    "collection": "programs",
    "id": "yonsei-university-seoul__global-korea-scholarship",
    "attendu": {
      "deadline": "Deux appels par an. GKS licence (GKS-U) : appel publié en septembre, dépôt en septembre-octobre auprès de l'ambassade de Corée ou d'une université partenaire, résultats en décembre, moins de 25 ans. GKS master et doctorat (GKS-G) : dépôt en février-mars, résultats en juin, moins de 40 ans. Deux voies dans les deux cas — l'ambassade du pays de résidence (avec sa propre date) ou directement l'université.",
      "deadlineISO": undefined,
      "status": "Ouverte — appel licence en cours, date propre à chaque ambassade",
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "deadline": "30 septembre 2026 à 18h (heure de Corée) : clôture de la voie ambassade du GKS licence 2027, ouverte le 15 septembre — réservée à 74 pays, dont le Sénégal ne fait pas partie. La voie université court de septembre à novembre 2026 selon chaque établissement ; son programme UIC, ouvert à tous les pays, ne concerne que 13 établissements en sciences et ingénierie.",
      "deadlineISO": "2026-09-30",
      "status": "Ouverte — voie ambassade (74 pays) jusqu'au 30 septembre 2026",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://www.studyinkorea.go.kr/ko/plan/gksNoticeRead.do?bbsId=BBSMSTR_000000000461&nttId=4522",
        "citation": "Application Period: September 15, 2026 (Tue.), 11:00 – September 30, 2026 (Wed.), 18:00",
        "le": "2026-09-22T23:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Appel « 2027 Global Korea Scholarship for Undergraduate Degrees » publié le 9 septembre 2026 par NIIED, guide officiel (48 pages) lu le 2026-09-22. DÉCOUVERTE : la voie ambassade (156 places) est réservée à 74 pays, et le SÉNÉGAL N'EN FAIT PAS PARTIE ; un Sénégalais ne peut passer que par la voie université UIC (100 places, 13 établissements, sciences et ingénierie). Les programmes de master et doctorat n'avaient AUCUN texte d'échéance."
  },
  {
    "collection": "scholarships",
    "id": "bourses-master-aui",
    "attendu": {
      "verifieLe": "2026-09-05",
      "periodeOuverture": "deux échéances par an : 31 mai pour la rentrée d'automne, 31 octobre pour la rentrée de printemps (à reconfirmer chaque année auprès du Graduate Admissions Office)"
    },
    "champs": {
      "verifieLe": "2026-09-22",
      "periodeOuverture": "deux rentrées par an (automne et printemps) ; le formulaire de bourse se dépose avant la date fixée par le bureau des admissions de master, non publiée en ligne"
    },
    "motif": "Page officielle des bourses de master d'Al Akhawayn relue le 2026-09-22 : aucune date n'y est publiée (« before the set deadline »). Les dates du 31 mai et du 31 octobre n'ont été confirmées sur aucune page officielle ; elles sont retirées du texte d'échéance, qui disait lui-même « À confirmer »."
  },
  {
    "collection": "programs",
    "id": "al-akhawayn-university-ifrane__bourses-master-aui",
    "attendu": {
      "deadline": "31 octobre 2026 annoncé pour la rentrée de printemps (31 mai pour la rentrée d'automne) — dates NON confirmées sur aui.ma au 5 septembre 2026, la page renvoie au Graduate Admissions Office (communication@aui.ma). À confirmer avant toute démarche.",
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "deadline": "Aucune date publiée sur la page officielle : le formulaire de bourse se dépose « avant la date fixée » pour chaque rentrée, automne ou printemps. Réservée aux candidats marocains, sauf quelques bourses pour les internationaux admis à l'École des sciences humaines et sociales : demander le calendrier au bureau des admissions de master.",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://aui.ma/admission-aid/graduates/scholarships",
        "citation": "Graduate scholarships are offered to Moroccan applicants only. [...] A few scholarships may be offered to international graduate candidates admitted to any graduate program at the School of Humanities and Social Sciences.",
        "le": "2026-09-22T23:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Page officielle des bourses de master d'Al Akhawayn relue le 2026-09-22 : aucune date n'y est publiée (« before the set deadline »). Les dates du 31 mai et du 31 octobre n'ont été confirmées sur aucune page officielle ; elles sont retirées du texte d'échéance, qui disait lui-même « À confirmer »."
  },
  {
    "collection": "programs",
    "id": "humboldt-universitat-zu-berlin-berlin__daad-epos__doctorat",
    "attendu": {
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://www2.daad.de/deutschland/stipendium/datenbank/en/21148-scholarship-database/?detail=50076777",
        "citation": "Application deadline Depending on chosen study programme; please check scholarship brochure or the website of your chosen study programme.",
        "le": "2026-09-22T23:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Fiche EPOS de la base de bourses du DAAD relue le 2026-09-22 : le Sénégal figure parmi les pays d'origine éligibles ; la date limite dépend du cours choisi (liste des cours avec dates 2027/2028). Les programmes n'avaient jamais reçu de preuve de vérification."
  },
  {
    "collection": "programs",
    "id": "humboldt-universitat-zu-berlin-berlin__daad-epos__master",
    "attendu": {
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://www2.daad.de/deutschland/stipendium/datenbank/en/21148-scholarship-database/?detail=50076777",
        "citation": "Application deadline Depending on chosen study programme; please check scholarship brochure or the website of your chosen study programme.",
        "le": "2026-09-22T23:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Fiche EPOS de la base de bourses du DAAD relue le 2026-09-22 : le Sénégal figure parmi les pays d'origine éligibles ; la date limite dépend du cours choisi (liste des cours avec dates 2027/2028). Les programmes n'avaient jamais reçu de preuve de vérification."
  },
  {
    "collection": "programs",
    "id": "leibniz-universitat-hannover-hannover__daad-epos__doctorat",
    "attendu": {
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://www2.daad.de/deutschland/stipendium/datenbank/en/21148-scholarship-database/?detail=50076777",
        "citation": "Application deadline Depending on chosen study programme; please check scholarship brochure or the website of your chosen study programme.",
        "le": "2026-09-22T23:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Fiche EPOS de la base de bourses du DAAD relue le 2026-09-22 : le Sénégal figure parmi les pays d'origine éligibles ; la date limite dépend du cours choisi (liste des cours avec dates 2027/2028). Les programmes n'avaient jamais reçu de preuve de vérification."
  },
  {
    "collection": "programs",
    "id": "leibniz-universitat-hannover-hannover__daad-epos__master",
    "attendu": {
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://www2.daad.de/deutschland/stipendium/datenbank/en/21148-scholarship-database/?detail=50076777",
        "citation": "Application deadline Depending on chosen study programme; please check scholarship brochure or the website of your chosen study programme.",
        "le": "2026-09-22T23:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Fiche EPOS de la base de bourses du DAAD relue le 2026-09-22 : le Sénégal figure parmi les pays d'origine éligibles ; la date limite dépend du cours choisi (liste des cours avec dates 2027/2028). Les programmes n'avaient jamais reçu de preuve de vérification."
  },
  {
    "collection": "programs",
    "id": "universitat-hamburg-hamburg__daad-epos__doctorat",
    "attendu": {
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://www2.daad.de/deutschland/stipendium/datenbank/en/21148-scholarship-database/?detail=50076777",
        "citation": "Application deadline Depending on chosen study programme; please check scholarship brochure or the website of your chosen study programme.",
        "le": "2026-09-22T23:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Fiche EPOS de la base de bourses du DAAD relue le 2026-09-22 : le Sénégal figure parmi les pays d'origine éligibles ; la date limite dépend du cours choisi (liste des cours avec dates 2027/2028). Les programmes n'avaient jamais reçu de preuve de vérification."
  },
  {
    "collection": "programs",
    "id": "universitat-hamburg-hamburg__daad-epos__master",
    "attendu": {
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://www2.daad.de/deutschland/stipendium/datenbank/en/21148-scholarship-database/?detail=50076777",
        "citation": "Application deadline Depending on chosen study programme; please check scholarship brochure or the website of your chosen study programme.",
        "le": "2026-09-22T23:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Fiche EPOS de la base de bourses du DAAD relue le 2026-09-22 : le Sénégal figure parmi les pays d'origine éligibles ; la date limite dépend du cours choisi (liste des cours avec dates 2027/2028). Les programmes n'avaient jamais reçu de preuve de vérification."
  },
  {
    "collection": "scholarships",
    "id": "daad-helmut-schmidt-programme",
    "attendu": {
      "generalCriteria": "L'Afrique est explicitement couverte ; la liste précise des pays n'a pas pu être vérifiée à la source (PDF officiel inaccessible), l'éligibilité du Sénégal est donc à confirmer auprès du programme. Licence avec résultats dans le tiers supérieur et AU MOINS 1 AN D'EXPÉRIENCE PROFESSIONNELLE. Universités d'accueil : Erfurt (Willy Brandt School), Passau, Duisburg-Essen, Hertie School, Osnabrück. La période de candidature pour la rentrée 2027 est close ; le cycle suivant (rentrée 2028) n'est pas encore publié.",
      "eligibility": {
        "note": "L'Afrique est explicitement couverte, mais la liste officielle des pays n'a pas pu être vérifiée à la source — faire confirmer l'éligibilité du Sénégal auprès du programme.",
        "scope": "groupes",
        "groups": [
          "cad-apd"
        ]
      },
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.daad.de/en/studying-in-germany/scholarships/daad-funding-programmes/helmut-schmidt-programme/",
      "periodeOuverture": "appel annuel (dates dans l'appel en cours)"
    },
    "champs": {
      "generalCriteria": "Ouvert aux ressortissants des pays bénéficiaires de l'aide publique au développement (liste du CAD de l'OCDE), Sénégal compris. Premier diplôme en sciences politiques, droit, économie, politiques publiques ou administration, et expérience pratique pertinente (emploi, stages, engagement politique ou associatif), selon les exigences de chaque master. Sept établissements d'accueil. Dépôt du 1er juin au 31 juillet pour la rentrée de l'année suivante ; le cycle suivant n'est pas encore publié.",
      "eligibility": {
        "note": "Pays bénéficiaires de l'aide publique au développement (liste du CAD de l'OCDE annexée à l'appel), Sénégal compris.",
        "scope": "groupes",
        "groups": [
          "cad-apd"
        ]
      },
      "verifieLe": "2026-09-22",
      "sourceEcheance": "https://static.daad.de/media/daad_de/pdfs_nicht_barrierefrei/in-deutschland-studieren-forschen-lehren/daad_helmut_schmidt_programme_current_announcement.pdf",
      "periodeOuverture": "appel annuel : dépôt du 1er juin au 31 juillet, pour une rentrée l'année suivante"
    },
    "motif": "Appel officiel du DAAD Helmut-Schmidt-Programme (mai 2026) et liste des pays lus le 2026-09-22 dans le navigateur (texte des PDF extrait par pdf.js). La liste est celle des pays bénéficiaires de l'aide publique au développement (CAD de l'OCDE) : le Sénégal y figure. Dépôt du 1er juin au 31 juillet 2026, terminé. La fiche disait « éligibilité du Sénégal à confirmer » et « aucune date »."
  },
  {
    "collection": "programs",
    "id": "humboldt-universitat-zu-berlin-berlin__daad-helmut-schmidt-programme__master",
    "attendu": {
      "deadline": "La page de présentation ne publie ni date ni conditions détaillées : elle renvoie à l'appel à candidatures en cours. Le programme s'adresse aux jeunes diplômés sans expérience comme aux professionnels en milieu de carrière, ressortissants de pays en développement ou émergents.",
      "deadlineISO": undefined,
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "deadline": "Cycle terminé : le dépôt courait du 1er juin jusqu'au 31 juillet 2026, pour les sept établissements du programme. Le prochain appel n'est pas encore publié ; il suit d'ordinaire le même rythme.",
      "deadlineISO": "2026-07-31",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://static.daad.de/media/daad_de/pdfs_nicht_barrierefrei/in-deutschland-studieren-forschen-lehren/daad_helmut_schmidt_programme_current_announcement.pdf",
        "citation": "The application period for all seven higher education institutions is from 1 June until 31 July 2026.",
        "le": "2026-09-22T23:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Appel officiel du DAAD Helmut-Schmidt-Programme (mai 2026) et liste des pays lus le 2026-09-22 dans le navigateur (texte des PDF extrait par pdf.js). La liste est celle des pays bénéficiaires de l'aide publique au développement (CAD de l'OCDE) : le Sénégal y figure. Dépôt du 1er juin au 31 juillet 2026, terminé. La fiche disait « éligibilité du Sénégal à confirmer » et « aucune date »."
  },
  {
    "collection": "programs",
    "id": "universitat-hamburg-hamburg__daad-helmut-schmidt-programme__master",
    "attendu": {
      "deadline": "La page de présentation ne publie ni date ni conditions détaillées : elle renvoie à l'appel à candidatures en cours. Le programme s'adresse aux jeunes diplômés sans expérience comme aux professionnels en milieu de carrière, ressortissants de pays en développement ou émergents.",
      "deadlineISO": undefined,
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "deadline": "Cycle terminé : le dépôt courait du 1er juin jusqu'au 31 juillet 2026, pour les sept établissements du programme. Le prochain appel n'est pas encore publié ; il suit d'ordinaire le même rythme.",
      "deadlineISO": "2026-07-31",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://static.daad.de/media/daad_de/pdfs_nicht_barrierefrei/in-deutschland-studieren-forschen-lehren/daad_helmut_schmidt_programme_current_announcement.pdf",
        "citation": "The application period for all seven higher education institutions is from 1 June until 31 July 2026.",
        "le": "2026-09-22T23:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Appel officiel du DAAD Helmut-Schmidt-Programme (mai 2026) et liste des pays lus le 2026-09-22 dans le navigateur (texte des PDF extrait par pdf.js). La liste est celle des pays bénéficiaires de l'aide publique au développement (CAD de l'OCDE) : le Sénégal y figure. Dépôt du 1er juin au 31 juillet 2026, terminé. La fiche disait « éligibilité du Sénégal à confirmer » et « aucune date »."
  }
];
