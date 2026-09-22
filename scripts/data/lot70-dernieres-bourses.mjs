/**
 * ============================================================
 * LOT 70 — LES DERNIÈRES BOURSES JAMAIS CONSOLIDÉES (22 sept. 2026)
 * ============================================================
 *
 * Onze des douze bourses qui restaient sans contrat de fiche après le
 * lot 69. Toutes relues à la source le 2026-09-22.
 *
 *   Rosa-Luxemburg · DAAD Study · SISGP (Suède) · Quota russe · ABE ·
 *   ADISU Puglia · Diyanet · KOICA · LazioDisco · Pékin · Nankin
 *
 * La douzième, Al-Azhar, reste l'exception assumée : fiche inactive,
 * sans programme, pages officielles inaccessibles hors d'Égypte.
 *
 * CE QUE LA LECTURE A CHANGÉ
 * --------------------------
 *   - ROSA-LUXEMBURG : clôture le 1er octobre 2026 à 23h59, dans NEUF
 *     jours ; aucun programme ne portait de date.
 *   - DAAD STUDY SCHOLARSHIPS : ouvert à 64 pays, AUCUN africain. La
 *     fiche était montrée à des profils africains, et affichait « 100 %
 *     scolarité » alors que le DAAD ne paie pas les frais de scolarité.
 *   - SISGP : liste officielle des 34 pays relevée (Sénégal inclus) ;
 *     l'éligibilité devient une liste, plus une note.
 *   - QUOTA RUSSE : « échéance annoncée au 15 janvier 2027 » introuvable
 *     sur toute source officielle ce jour — retirée.
 *   - NANKIN : une PRIME UNIQUE pour étudiants DÉJÀ inscrits, pas une
 *     bourse annuelle d'entrée ; pas de catégorie doctorat.
 *   - LAZIODISCO, ADISU : bandi 2026-2027 terminés (22 juillet,
 *     13 août) ; les fiches disaient « Ouverte » ou « non vérifiée ».
 *   - DIYANET : le portail annonce l'ouverture « dans les prochains
 *     jours ».
 *   - PÉKIN : conditions de l'avis de janvier 2026 (âge, langue,
 *     moyenne, lettres) ; date fixée par chaque établissement.
 *   - ABE, KOICA : aucune date publiée ; les fiches le disent, avec la
 *     porte à laquelle frapper, au lieu de supposer un calendrier.
 *
 * Rejeu analyserEcheance + etatCandidature au 22/09 avant livraison ;
 * `attendu` généré depuis l'export du 2026-09-22T21:11 (lot 69 compris).
 * ============================================================
 */

export const PATCHES = [
  {
    "collection": "scholarships",
    "id": "rosa-luxemburg-stiftung",
    "attendu": {
      "verifieLe": undefined,
      "sourceEcheance": undefined,
      "periodeOuverture": undefined,
      "exigences": undefined
    },
    "champs": {
      "verifieLe": "2026-09-22",
      "sourceEcheance": "https://www.rosalux.de/stipendienbewerbung",
      "periodeOuverture": "appel annuel : portail ouvert de la mi-août au 1er octobre, première réponse début décembre, financement à partir du semestre d'été suivant (avril)",
      "exigences": [
        "admission_prealable"
      ]
    },
    "motif": "Page officielle « Stipendienbewerbung » de la Rosa-Luxemburg-Stiftung et FAQ des étudiants lues le 2026-09-22 : le portail ferme le 1er octobre 2026 à 23h59, dans NEUF jours. Les programmes n'avaient aucun texte d'échéance."
  },
  {
    "collection": "programs",
    "id": "humboldt-universitat-zu-berlin-berlin__rosa-luxemburg-stiftung__doctorat",
    "attendu": {
      "deadline": undefined,
      "deadlineISO": "2026-10-01",
      "status": undefined,
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "deadline": "1er octobre 2026 à 23h59 : clôture du portail de candidature aux bourses de doctorat, ouvert depuis le 20 août. Aucune pièce ne peut être ajoutée après l'envoi ; première réponse à partir de début décembre.",
      "deadlineISO": "2026-10-01",
      "status": "Ouverte",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://www.rosalux.de/stipendienbewerbung",
        "citation": "Die neue Bewerbungsrunde startet ab 20. August 2026. Bewerbungsschluss ist der 1. Oktober 2026 23:59 Uhr.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Page officielle « Stipendienbewerbung » de la Rosa-Luxemburg-Stiftung et FAQ des étudiants lues le 2026-09-22 : le portail ferme le 1er octobre 2026 à 23h59, dans NEUF jours. Les programmes n'avaient aucun texte d'échéance."
  },
  {
    "collection": "programs",
    "id": "humboldt-universitat-zu-berlin-berlin__rosa-luxemburg-stiftung__master",
    "attendu": {
      "deadline": undefined,
      "deadlineISO": "2026-10-01",
      "status": undefined,
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "deadline": "1er octobre 2026 à 23h59 : clôture du portail de candidature, ouvert depuis le 20 août. Il faut être inscrit en première année de master dans une université allemande (ou admis, l'inscription étant à justifier avant le 1er novembre) ; le financement commence au second semestre du master, au semestre d'été 2027. Aucune pièce ne peut être ajoutée après l'envoi.",
      "deadlineISO": "2026-10-01",
      "status": "Ouverte",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://www.rosalux.de/stipendienbewerbung",
        "citation": "Die neue Bewerbungsrunde startet ab 20. August 2026. Bewerbungsschluss ist der 1. Oktober 2026 23:59 Uhr.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Page officielle « Stipendienbewerbung » de la Rosa-Luxemburg-Stiftung et FAQ des étudiants lues le 2026-09-22 : le portail ferme le 1er octobre 2026 à 23h59, dans NEUF jours. Les programmes n'avaient aucun texte d'échéance."
  },
  {
    "collection": "programs",
    "id": "leibniz-universitat-hannover-hannover__rosa-luxemburg-stiftung__doctorat",
    "attendu": {
      "deadline": undefined,
      "deadlineISO": "2026-10-01",
      "status": undefined,
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "deadline": "1er octobre 2026 à 23h59 : clôture du portail de candidature aux bourses de doctorat, ouvert depuis le 20 août. Aucune pièce ne peut être ajoutée après l'envoi ; première réponse à partir de début décembre.",
      "deadlineISO": "2026-10-01",
      "status": "Ouverte",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://www.rosalux.de/stipendienbewerbung",
        "citation": "Die neue Bewerbungsrunde startet ab 20. August 2026. Bewerbungsschluss ist der 1. Oktober 2026 23:59 Uhr.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Page officielle « Stipendienbewerbung » de la Rosa-Luxemburg-Stiftung et FAQ des étudiants lues le 2026-09-22 : le portail ferme le 1er octobre 2026 à 23h59, dans NEUF jours. Les programmes n'avaient aucun texte d'échéance."
  },
  {
    "collection": "programs",
    "id": "leibniz-universitat-hannover-hannover__rosa-luxemburg-stiftung__master",
    "attendu": {
      "deadline": undefined,
      "deadlineISO": "2026-10-01",
      "status": undefined,
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "deadline": "1er octobre 2026 à 23h59 : clôture du portail de candidature, ouvert depuis le 20 août. Il faut être inscrit en première année de master dans une université allemande (ou admis, l'inscription étant à justifier avant le 1er novembre) ; le financement commence au second semestre du master, au semestre d'été 2027. Aucune pièce ne peut être ajoutée après l'envoi.",
      "deadlineISO": "2026-10-01",
      "status": "Ouverte",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://www.rosalux.de/stipendienbewerbung",
        "citation": "Die neue Bewerbungsrunde startet ab 20. August 2026. Bewerbungsschluss ist der 1. Oktober 2026 23:59 Uhr.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Page officielle « Stipendienbewerbung » de la Rosa-Luxemburg-Stiftung et FAQ des étudiants lues le 2026-09-22 : le portail ferme le 1er octobre 2026 à 23h59, dans NEUF jours. Les programmes n'avaient aucun texte d'échéance."
  },
  {
    "collection": "programs",
    "id": "universitat-hamburg-hamburg__rosa-luxemburg-stiftung__doctorat",
    "attendu": {
      "deadline": undefined,
      "deadlineISO": "2026-10-01",
      "status": undefined,
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "deadline": "1er octobre 2026 à 23h59 : clôture du portail de candidature aux bourses de doctorat, ouvert depuis le 20 août. Aucune pièce ne peut être ajoutée après l'envoi ; première réponse à partir de début décembre.",
      "deadlineISO": "2026-10-01",
      "status": "Ouverte",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://www.rosalux.de/stipendienbewerbung",
        "citation": "Die neue Bewerbungsrunde startet ab 20. August 2026. Bewerbungsschluss ist der 1. Oktober 2026 23:59 Uhr.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Page officielle « Stipendienbewerbung » de la Rosa-Luxemburg-Stiftung et FAQ des étudiants lues le 2026-09-22 : le portail ferme le 1er octobre 2026 à 23h59, dans NEUF jours. Les programmes n'avaient aucun texte d'échéance."
  },
  {
    "collection": "programs",
    "id": "universitat-hamburg-hamburg__rosa-luxemburg-stiftung__master",
    "attendu": {
      "deadline": undefined,
      "deadlineISO": "2026-10-01",
      "status": undefined,
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "deadline": "1er octobre 2026 à 23h59 : clôture du portail de candidature, ouvert depuis le 20 août. Il faut être inscrit en première année de master dans une université allemande (ou admis, l'inscription étant à justifier avant le 1er novembre) ; le financement commence au second semestre du master, au semestre d'été 2027. Aucune pièce ne peut être ajoutée après l'envoi.",
      "deadlineISO": "2026-10-01",
      "status": "Ouverte",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://www.rosalux.de/stipendienbewerbung",
        "citation": "Die neue Bewerbungsrunde startet ab 20. August 2026. Bewerbungsschluss ist der 1. Oktober 2026 23:59 Uhr.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Page officielle « Stipendienbewerbung » de la Rosa-Luxemburg-Stiftung et FAQ des étudiants lues le 2026-09-22 : le portail ferme le 1er octobre 2026 à 23h59, dans NEUF jours. Les programmes n'avaient aucun texte d'échéance."
  },
  {
    "collection": "scholarships",
    "id": "daad-study-scholarships",
    "attendu": {
      "eligibility": {
        "note": "Les conditions, les disciplines couvertes et la date limite dépendent du pays d'origine : consulter la fiche du pays dans la base de données de bourses du DAAD avant de candidater."
      },
      "funding": "992 €/mois pour les diplômés (niveau master) et 1 300 €/mois pour les doctorants, plus une allocation de voyage, une assurance maladie, accident et responsabilité civile, et une prise en charge des cours de langue. ATTENTION : la fiche EPOS de la base de données DAAD affiche encore 934 €/mois pour les diplômés — les deux chiffres sont officiels et se contredisent, faire confirmer par le programme visé.",
      "generalCriteria": "Diplôme de premier cycle terminé. Admission séparée à un programme de Master en Allemagne requise en parallèle de la candidature DAAD — deux démarches distinctes.",
      "verifieLe": undefined,
      "periodeOuverture": "appel annuel : dépôt à l'automne (octobre-novembre) pour la rentrée suivante ; la date exacte dépend du pays",
      "exigences": undefined
    },
    "champs": {
      "eligibility": {
        "scope": "liste",
        "include": [
          "AF",
          "AL",
          "AD",
          "AM",
          "AU",
          "AT",
          "AZ",
          "BY",
          "BE",
          "BA",
          "BG",
          "CA",
          "HR",
          "CY",
          "CZ",
          "DK",
          "EE",
          "FI",
          "FR",
          "GE",
          "GR",
          "HU",
          "IS",
          "IE",
          "IL",
          "IT",
          "JP",
          "KZ",
          "KR",
          "XK",
          "KG",
          "LV",
          "LI",
          "LT",
          "LU",
          "MT",
          "MD",
          "MC",
          "ME",
          "NL",
          "NZ",
          "MK",
          "NO",
          "PS",
          "PL",
          "PT",
          "RO",
          "SM",
          "RS",
          "SG",
          "SK",
          "SI",
          "ES",
          "SE",
          "CH",
          "SY",
          "TJ",
          "TM",
          "UA",
          "GB",
          "US",
          "UZ",
          "VA",
          "YE"
        ],
        "note": "Programme ouvert aux candidats de 64 pays seulement (base de bourses du DAAD, financement 2027) : l'Europe, l'Asie centrale et le Caucase, l'Amérique du Nord, le Japon, la Corée, l'Australie, la Nouvelle-Zélande, Singapour, Israël, les Territoires palestiniens, la Syrie, le Yémen et l'Afghanistan. AUCUN pays africain : les candidats africains se tournent vers les programmes EPOS et Helmut-Schmidt du DAAD."
      },
      "funding": "992 € par mois, assurance maladie, accident et responsabilité civile, forfait d'études de 460 € par an, aide au voyage sur demande, cours de langue. Le DAAD NE PAIE PAS les frais de scolarité.",
      "generalCriteria": "Dernier diplôme obtenu il y a six ans au plus à la date limite ; premier cycle terminé au plus tard au début du financement ; pas plus de 15 mois de résidence en Allemagne à la date limite. L'admission à l'université allemande est une démarche SÉPARÉE, à mener soi-même dans ses délais. Financement de 10 à 24 mois, à partir d'octobre 2027. Dépôt sur le portail du DAAD, à partir du 1er juin et jusqu'à la date limite fixée pour chaque pays.",
      "verifieLe": "2026-09-22",
      "periodeOuverture": "dépôt sur le portail du DAAD à partir du 1er juin, jusqu'à une date limite propre à chaque pays, mise à jour chaque printemps",
      "exigences": [
        "lettres_recommandation"
      ]
    },
    "motif": "Fiche officielle du programme dans la base de bourses du DAAD lue le 2026-09-22 (navigateur). DÉCOUVERTE : le sélecteur de pays de la fiche ne propose que 64 pays d'origine, AUCUN pays africain — le Sénégal n'y figure pas. La fiche était montrée à des profils africains. Autre faute corrigée : « the DAAD does not cover tuition fees » ; le programme affichait « 100 % scolarité »."
  },
  {
    "collection": "programs",
    "id": "humboldt-universitat-zu-berlin-berlin__daad-study-scholarships",
    "attendu": {
      "deadline": "La date limite du DAAD DÉPEND DU PAYS DE RÉSIDENCE du candidat et se lit appel par appel dans la base de bourses du DAAD. La date de fin août portée jusqu'ici n'est pas confirmée à ce jour. Pour la campagne 2026-2027, une université partenaire européenne annonçait la mi-novembre. Le dépôt se fait à l'automne pour la rentrée suivante. Vérifier l'appel correspondant à votre pays avant toute démarche.",
      "coverage": "100% scolarité + ~992 €/mois",
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "deadline": "La date limite dépend du pays d'origine, et n'existe que pour les 64 pays éligibles — aucun pays africain. Dépôt sur le portail du DAAD à partir du 1er juin, pour un financement débutant en octobre 2027.",
      "coverage": "992 € par mois et assurances ; le DAAD ne paie pas les frais de scolarité",
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Fiche officielle du programme dans la base de bourses du DAAD lue le 2026-09-22 (navigateur). DÉCOUVERTE : le sélecteur de pays de la fiche ne propose que 64 pays d'origine, AUCUN pays africain — le Sénégal n'y figure pas. La fiche était montrée à des profils africains. Autre faute corrigée : « the DAAD does not cover tuition fees » ; le programme affichait « 100 % scolarité »."
  },
  {
    "collection": "programs",
    "id": "leibniz-universitat-hannover-hannover__daad-study-scholarships",
    "attendu": {
      "deadline": "La date limite du DAAD DÉPEND DU PAYS DE RÉSIDENCE du candidat et se lit appel par appel dans la base de bourses du DAAD. La date de fin août portée jusqu'ici n'est pas confirmée à ce jour. Pour la campagne 2026-2027, une université partenaire européenne annonçait la mi-novembre. Le dépôt se fait à l'automne pour la rentrée suivante. Vérifier l'appel correspondant à votre pays avant toute démarche.",
      "coverage": "100% scolarité + ~992 €/mois",
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "deadline": "La date limite dépend du pays d'origine, et n'existe que pour les 64 pays éligibles — aucun pays africain. Dépôt sur le portail du DAAD à partir du 1er juin, pour un financement débutant en octobre 2027.",
      "coverage": "992 € par mois et assurances ; le DAAD ne paie pas les frais de scolarité",
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Fiche officielle du programme dans la base de bourses du DAAD lue le 2026-09-22 (navigateur). DÉCOUVERTE : le sélecteur de pays de la fiche ne propose que 64 pays d'origine, AUCUN pays africain — le Sénégal n'y figure pas. La fiche était montrée à des profils africains. Autre faute corrigée : « the DAAD does not cover tuition fees » ; le programme affichait « 100 % scolarité »."
  },
  {
    "collection": "programs",
    "id": "universitat-hamburg-hamburg__daad-study-scholarships",
    "attendu": {
      "deadline": "La date limite du DAAD DÉPEND DU PAYS DE RÉSIDENCE du candidat et se lit appel par appel dans la base de bourses du DAAD. La date de fin août portée jusqu'ici n'est pas confirmée à ce jour. Pour la campagne 2026-2027, une université partenaire européenne annonçait la mi-novembre. Le dépôt se fait à l'automne pour la rentrée suivante. Vérifier l'appel correspondant à votre pays avant toute démarche.",
      "coverage": "100% scolarité + ~992 €/mois",
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "deadline": "La date limite dépend du pays d'origine, et n'existe que pour les 64 pays éligibles — aucun pays africain. Dépôt sur le portail du DAAD à partir du 1er juin, pour un financement débutant en octobre 2027.",
      "coverage": "992 € par mois et assurances ; le DAAD ne paie pas les frais de scolarité",
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Fiche officielle du programme dans la base de bourses du DAAD lue le 2026-09-22 (navigateur). DÉCOUVERTE : le sélecteur de pays de la fiche ne propose que 64 pays d'origine, AUCUN pays africain — le Sénégal n'y figure pas. La fiche était montrée à des profils africains. Autre faute corrigée : « the DAAD does not cover tuition fees » ; le programme affichait « 100 % scolarité »."
  },
  {
    "collection": "scholarships",
    "id": "swedish-institute-scholarships-global-professionals",
    "attendu": {
      "eligibility": {
        "note": "Ouverte aux ressortissants d'une liste fermée de pays, révisée à chaque édition par le Svenska institutet : la vérifier sur si.se avant de candidater."
      },
      "funding": "100% (frais de scolarité + allocation mensuelle), 1 à 2 ans",
      "generalCriteria": "Candidature en deux étapes : admission au master via universityadmissions.se, PUIS candidature bourse séparée sur le portail SI. Cycle 2026-2027 (rentrée automne 2026) : candidature master close le 15 janvier 2026, portail bourse SI ouvert du 9 au 25 février 2026. Cycle 2027-2028 attendu sur le même calendrier (mi-janvier puis février 2027), dates officielles non encore confirmées.",
      "verifieLe": undefined,
      "sourceEcheance": undefined,
      "periodeOuverture": undefined
    },
    "champs": {
      "eligibility": {
        "scope": "liste",
        "include": [
          "AM",
          "AZ",
          "BD",
          "BY",
          "BO",
          "BR",
          "CO",
          "EC",
          "EG",
          "ET",
          "GE",
          "GT",
          "ID",
          "IQ",
          "JO",
          "KE",
          "LR",
          "MY",
          "MX",
          "MD",
          "MA",
          "NG",
          "PE",
          "PH",
          "RW",
          "SN",
          "ZA",
          "TZ",
          "TH",
          "UG",
          "UA",
          "UZ",
          "VN",
          "ZM"
        ],
        "note": "Citoyens de 34 pays (liste 2026-2027), dont en Afrique : Égypte, Éthiopie, Kenya, Liberia, Maroc, Nigeria, Rwanda, Sénégal, Afrique du Sud, Tanzanie, Ouganda, Zambie. Pas besoin de résider dans le pays. La liste est révisée à chaque édition."
      },
      "funding": "100 % : frais de scolarité payés directement à l'université, 12 000 SEK par mois, aide au voyage de 15 000 SEK. Pas d'assurance, ni d'aide pour la famille.",
      "generalCriteria": "Citoyen d'un des 34 pays éligibles, Sénégal inclus (pas besoin d'y résider). Expérience professionnelle ET expérience de leadership démontrées, auprès d'un employeur ou dans la société civile. Master d'un ou deux ans en anglais, figurant sur la liste des programmes éligibles publiée à la mi-novembre, en gouvernance, santé publique, entrepreneuriat ou sciences et techniques. Deux étapes : admission au master via universityadmissions.se, PUIS candidature à la bourse sur le portail du SI. Le calendrier 2027-2028 n'est pas encore publié.",
      "verifieLe": "2026-09-22",
      "sourceEcheance": "https://si.se/en/apply/scholarships/swedish-institute-scholarships-for-global-professionals/",
      "periodeOuverture": "appel annuel : admission au master de mi-octobre à mi-janvier, portail de la bourse ouvert deux semaines en février, résultats fin avril"
    },
    "motif": "Page officielle du Svenska institutet lue le 2026-09-22 (navigateur ; la lecture automatique renvoyait 403). Liste des 34 pays éligibles relevée, Sénégal inclus ; candidatures closes, calendrier 2027-2028 non publié."
  },
  {
    "collection": "programs",
    "id": "kth-royal-institute-of-technology-stockholm__swedish-institute-scholarships-global-professionals",
    "attendu": {
      "deadline": "Cycle 2026-2027 clos (candidature master 15 janvier 2026, portail bourse SI 9-25 février 2026) — cycle 2027-2028 attendu sur le même calendrier, dates officielles non encore confirmées",
      "deadlineISO": "2026-02-25",
      "status": "Fermée — cycle 2026-2027 achevé",
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Cycle 2026-2027 terminé : portail de la bourse ouvert jusqu'au 25 février 2026 (14h59), après la candidature au master, terminée à la mi-janvier. Le calendrier 2027-2028 n'est pas encore publié ; le rythme habituel place l'admission de mi-octobre à mi-janvier et la bourse en février.",
      "deadlineISO": "2026-02-25",
      "status": "Fermée — cycle 2026-2027 terminé",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://si.se/en/apply/scholarships/swedish-institute-scholarships-for-global-professionals/",
        "citation": "9-25 February 2026: Application portal for the SI Scholarships is open for two weeks. Please note that the portal closes at 14:59 CET on the final day.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Page officielle du Svenska institutet lue le 2026-09-22 (navigateur ; la lecture automatique renvoyait 403). Liste des 34 pays éligibles relevée, Sénégal inclus ; candidatures closes, calendrier 2027-2028 non publié."
  },
  {
    "collection": "programs",
    "id": "university-of-gothenburg-goteborg__swedish-institute-scholarships-global-professionals",
    "attendu": {
      "deadline": "Cycle 2026-2027 clos (candidature master 15 janvier 2026, portail bourse SI 9-25 février 2026) — cycle 2027-2028 attendu sur le même calendrier, dates officielles non encore confirmées",
      "deadlineISO": "2026-02-25",
      "status": "Fermée — cycle 2026-2027 achevé",
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Cycle 2026-2027 terminé : portail de la bourse ouvert jusqu'au 25 février 2026 (14h59), après la candidature au master, terminée à la mi-janvier. Le calendrier 2027-2028 n'est pas encore publié ; le rythme habituel place l'admission de mi-octobre à mi-janvier et la bourse en février.",
      "deadlineISO": "2026-02-25",
      "status": "Fermée — cycle 2026-2027 terminé",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://si.se/en/apply/scholarships/swedish-institute-scholarships-for-global-professionals/",
        "citation": "9-25 February 2026: Application portal for the SI Scholarships is open for two weeks. Please note that the portal closes at 14:59 CET on the final day.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Page officielle du Svenska institutet lue le 2026-09-22 (navigateur ; la lecture automatique renvoyait 403). Liste des 34 pays éligibles relevée, Sénégal inclus ; candidatures closes, calendrier 2027-2028 non publié."
  },
  {
    "collection": "scholarships",
    "id": "quota-gouvernement-russe",
    "attendu": {
      "generalCriteria": "LE SÉNÉGAL A REÇU 130 BOURSES POUR 2026-2027, chiffre publié par le ministère sénégalais de l'Enseignement supérieur. AVERTISSEMENT INDISPENSABLE : l'allocation mensuelle NE COUVRE MÊME PAS le loyer de la résidence universitaire — c'est une exonération de frais de scolarité, PAS une bourse de subsistance. Un financement personnel ou familial est indispensable pour la totalité du coût de la vie. L'année préparatoire de russe est optionnelle, financée par la bourse, mais ÉLIMINATOIRE : l'échec aux examens finaux entraîne la perte du financement. Circuit sénégalais : inscription en ligne PUIS dépôt d'un dossier physique à la Direction des Bourses, 52 rue Saint-Michel, Dakar, avec une semaine d'écart entre les deux échéances ; certificats médicaux (VIH, hépatites B et C, tuberculose) et passeport valable 18 mois au-delà du visa. Cycle 2027-2028 : dates définitives publiées en septembre 2026, échéance annoncée au 15 janvier 2027 pour les pays hors CEI.",
      "verifieLe": undefined,
      "sourceEcheance": undefined,
      "periodeOuverture": undefined,
      "exigences": undefined
    },
    "champs": {
      "generalCriteria": "LE SÉNÉGAL A REÇU 130 BOURSES POUR 2026-2027, chiffre publié par le ministère sénégalais de l'Enseignement supérieur. AVERTISSEMENT INDISPENSABLE : l'allocation mensuelle NE COUVRE MÊME PAS le loyer de la résidence universitaire — c'est une exonération de frais de scolarité, PAS une bourse de subsistance. Un financement personnel ou familial est indispensable pour la totalité du coût de la vie. L'année préparatoire de russe est optionnelle, financée par la bourse, mais ÉLIMINATOIRE : l'échec aux examens finaux entraîne la perte du financement. Circuit sénégalais : inscription en ligne PUIS dépôt d'un dossier physique à la Direction des Bourses, 52 rue Saint-Michel, Dakar, avec une semaine d'écart entre les deux échéances ; certificats médicaux (VIH, hépatites B et C, tuberculose) et passeport valable 18 mois au-delà du visa. Pour 2027-2028, aucune date n'est publiée au 22 septembre 2026 ; au Sénégal, l'appel 2026-2027 avait été publié par le ministère le 12 novembre 2025.",
      "verifieLe": "2026-09-22",
      "sourceEcheance": "https://mesrisenegal.sn/2025/11/12/130-bourses-detudes-de-la-russie-au-titre-de-lannee-academique-2026-2027/",
      "periodeOuverture": "appel annuel relayé au Sénégal par le ministère de l'Enseignement supérieur, en novembre, pour la rentrée de septembre suivante",
      "exigences": [
        "nomination_autorite_nationale"
      ]
    },
    "motif": "Portail officiel education-in-russia.com (aucune date 2027-2028 affichée) et annonce du ministère sénégalais du 12 novembre 2025 relus le 2026-09-22. La mention « échéance annoncée au 15 janvier 2027 » n'a été retrouvée sur AUCUNE source officielle ce jour : retirée."
  },
  {
    "collection": "programs",
    "id": "hse-university-moscow__quota-gouvernement-russe",
    "attendu": {
      "deadline": "Cycle 2027-2028 : dates définitives publiées en septembre 2026, échéance annoncée au 15 janvier 2027 hors CEI",
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "deadline": "Pas encore d'appel pour 2027-2028 à la lecture du site, en septembre 2026. Au Sénégal, l'appel 2026-2027 (130 bourses) avait été publié par le ministère de l'Enseignement supérieur à la mi-novembre 2025 : à surveiller à partir de novembre, inscription en ligne puis dossier physique à la Direction des bourses.",
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Portail officiel education-in-russia.com (aucune date 2027-2028 affichée) et annonce du ministère sénégalais du 12 novembre 2025 relus le 2026-09-22. La mention « échéance annoncée au 15 janvier 2027 » n'a été retrouvée sur AUCUNE source officielle ce jour : retirée."
  },
  {
    "collection": "scholarships",
    "id": "abe-initiative-jica",
    "attendu": {
      "generalCriteria": "Ouverte aux ressortissants des 54 PAYS AFRICAINS, Sénégal inclus. Moins de 40 ans au 1er avril de l'année d'entrée ; licence (16 ans d'études) ; expérience professionnelle exigée (secteur privé : ne pas être employé d'une entreprise japonaise au démarrage ; secteur public : au moins 6 mois en poste, autorisation et garantie de réintégration) ; anglais TOEFL iBT 80, IELTS 6.5 ou CEFR B2. CANDIDATURE PAR LE BUREAU JICA DU PAYS DE RÉSIDENCE — jamais par l'ambassade ni l'université. Au Sénégal : JICA Senegal Office, 3e étage Atryum Center, Route de Ouakam, Dakar (secteur privé) ; via la DRH du ministère puis la Direction de la Coopération Technique (fonctionnaires). Le cycle 2026 (13e promotion) est clos ; l'appel 2027 n'est pas publié au 30/08/2026 — le rythme historique le place entre août et octobre 2026, à surveiller auprès du bureau JICA de Dakar.",
      "verifieLe": undefined,
      "sourceEcheance": undefined,
      "periodeOuverture": undefined
    },
    "champs": {
      "generalCriteria": "Ouverte aux ressortissants des 54 PAYS AFRICAINS, Sénégal inclus. Moins de 40 ans au 1er avril de l'année d'entrée ; licence (16 ans d'études) ; expérience professionnelle exigée (secteur privé : ne pas être employé d'une entreprise japonaise au démarrage ; secteur public : au moins 6 mois en poste, autorisation et garantie de réintégration) ; anglais TOEFL iBT 80, IELTS 6.5 ou CEFR B2. CANDIDATURE PAR LE BUREAU JICA DU PAYS DE RÉSIDENCE — jamais par l'ambassade ni l'université. Au Sénégal : JICA Senegal Office, 3e étage Atryum Center, Route de Ouakam, Dakar (secteur privé) ; via la DRH du ministère puis la Direction de la Coopération Technique (fonctionnaires). Au 22 septembre 2026, aucun appel n'est affiché : la page du bureau JICA de Dakar n'a pas été mise à jour depuis l'appel 2021, ouvert de septembre à la mi-octobre. Il faut demander le calendrier directement au bureau JICA de Dakar.",
      "verifieLe": "2026-09-22",
      "sourceEcheance": "https://www.jica.go.jp/english/overseas/senegal/others/abe.html",
      "periodeOuverture": "appel annuel, historiquement de septembre à la mi-octobre, départ au Japon en septembre de l'année suivante"
    },
    "motif": "Page du bureau JICA du Sénégal consacrée à l'ABE Initiative lue le 2026-09-22 : elle n'a pas été mise à jour depuis l'appel 2021 (ouvert de septembre à la mi-octobre 2020). Aucun appel 2027 n'est affiché ; la fiche le dit au lieu de le supposer."
  },
  {
    "collection": "programs",
    "id": "university-of-tokyo-tokyo__abe-initiative-jica__master",
    "attendu": {
      "deadline": undefined,
      "status": undefined,
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "deadline": "Aucun appel affiché à la lecture du site, en septembre 2026 : le dernier calendrier publié par le bureau JICA de Dakar courait de septembre à la mi-octobre. Demander la date au bureau JICA de Dakar ; le dossier original s'y dépose (secteur privé) ou passe par la Direction de la Coopération technique (fonctionnaires).",
      "status": "Fermée",
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Page du bureau JICA du Sénégal consacrée à l'ABE Initiative lue le 2026-09-22 : elle n'a pas été mise à jour depuis l'appel 2021 (ouvert de septembre à la mi-octobre 2020). Aucun appel 2027 n'est affiché ; la fiche le dit au lieu de le supposer."
  },
  {
    "collection": "programs",
    "id": "waseda-university-tokyo__abe-initiative-jica__master",
    "attendu": {
      "deadline": undefined,
      "status": undefined,
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "deadline": "Aucun appel affiché à la lecture du site, en septembre 2026 : le dernier calendrier publié par le bureau JICA de Dakar courait de septembre à la mi-octobre. Demander la date au bureau JICA de Dakar ; le dossier original s'y dépose (secteur privé) ou passe par la Direction de la Coopération technique (fonctionnaires).",
      "status": "Fermée",
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Page du bureau JICA du Sénégal consacrée à l'ABE Initiative lue le 2026-09-22 : elle n'a pas été mise à jour depuis l'appel 2021 (ouvert de septembre à la mi-octobre 2020). Aucun appel 2027 n'est affiché ; la fiche le dit au lieu de le supposer."
  },
  {
    "collection": "scholarships",
    "id": "adisu-puglia",
    "attendu": {
      "generalCriteria": "Ouverte à toutes les nationalités : le texte prévoit des dérogations temporaires sur la production de justificatifs de revenus étrangers pour les étudiants internationaux et ceux issus de pays en conflit. Conditions : ISEE ≤ 26 000 € ET ISPE ≤ 56 000 €. ATTENTION : le bando a été approuvé et publié le 26 juin 2026, mais SA DATE DE CLÔTURE N'A PAS PU ÊTRE VÉRIFIÉE sur une source officielle accessible — vérifier directement sur adisupuglia.it avant de s'y fier.",
      "verifieLe": undefined,
      "sourceEcheance": undefined,
      "periodeOuverture": undefined,
      "exigences": undefined
    },
    "champs": {
      "generalCriteria": "Ouverte à toutes les nationalités : le texte prévoit des dérogations temporaires sur la production de justificatifs de revenus étrangers pour les étudiants internationaux et ceux issus de pays en conflit. Conditions : ISEE ≤ 26 000 € ET ISPE ≤ 56 000 €. Pour 2026-2027, demandes du 14 juillet au 13 août 2026 à midi, selon l'avis de l'Università di Foggia (le site d'ADISU Puglia n'est pas joignable depuis l'étranger).",
      "verifieLe": "2026-09-22",
      "sourceEcheance": "https://www.unifg.it/it/avvisi/bando-benefici-e-servizi-aa-20262027-adisu-puglia",
      "periodeOuverture": "bando annuel publié fin juin, dépôt de la mi-juillet à la mi-août",
      "exigences": [
        "admission_prealable"
      ]
    },
    "motif": "Avis de l'Università di Foggia sur le bando ADISU Puglia 2026-2027 lu le 2026-09-22 (WebFetch) : dépôt du 14 juillet au 13 août 2026 à midi. Le site adisupuglia.it reste injoignable depuis le navigateur comme depuis le cloud."
  },
  {
    "collection": "programs",
    "id": "universita-di-bari-aldo-moro-bari__adisu-puglia__licence",
    "attendu": {
      "deadline": undefined,
      "deadlineISO": undefined,
      "status": undefined,
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "deadline": "Bando 2026-2027 terminé : demandes du 14 juillet jusqu'au 13 août 2026 à midi, pour la licence, le master et le cycle unique. Le bando 2026-2027 avait été publié fin juin.",
      "deadlineISO": "2026-08-13",
      "status": "Fermée — bando 2026-2027 terminé",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://www.unifg.it/it/avvisi/bando-benefici-e-servizi-aa-20262027-adisu-puglia",
        "citation": "dal 14 luglio, alle ore 12:00 del 13 agosto 2026",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Avis de l'Università di Foggia sur le bando ADISU Puglia 2026-2027 lu le 2026-09-22 (WebFetch) : dépôt du 14 juillet au 13 août 2026 à midi. Le site adisupuglia.it reste injoignable depuis le navigateur comme depuis le cloud."
  },
  {
    "collection": "programs",
    "id": "universita-di-bari-aldo-moro-bari__adisu-puglia__master",
    "attendu": {
      "deadline": undefined,
      "deadlineISO": undefined,
      "status": undefined,
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "deadline": "Bando 2026-2027 terminé : demandes du 14 juillet jusqu'au 13 août 2026 à midi, pour la licence, le master et le cycle unique. Le bando 2026-2027 avait été publié fin juin.",
      "deadlineISO": "2026-08-13",
      "status": "Fermée — bando 2026-2027 terminé",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://www.unifg.it/it/avvisi/bando-benefici-e-servizi-aa-20262027-adisu-puglia",
        "citation": "dal 14 luglio, alle ore 12:00 del 13 agosto 2026",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Avis de l'Università di Foggia sur le bando ADISU Puglia 2026-2027 lu le 2026-09-22 (WebFetch) : dépôt du 14 juillet au 13 août 2026 à midi. Le site adisupuglia.it reste injoignable depuis le navigateur comme depuis le cloud."
  },
  {
    "collection": "scholarships",
    "id": "diyanet-tdv-international",
    "attendu": {
      "generalCriteria": "Ouverte à tous les pays, aucune restriction nationale publiée. Il ne faut être ni avoir jamais été citoyen turc, ni déjà étudier en Turquie ; être né après le 1er janvier 2005 pour le niveau licence ; détenir un diplôme du secondaire avec au moins 70 % ; n'avoir aucune interruption d'études supérieure à deux ans ; n'avoir ni sanction disciplinaire ni condamnation. Le cycle 2026-2027 a couru du 15 janvier au 28 février 2026 ; prochain cycle attendu en janvier-février 2027.",
      "verifieLe": undefined,
      "sourceEcheance": undefined,
      "periodeOuverture": undefined,
      "exigences": undefined
    },
    "champs": {
      "generalCriteria": "Ouverte à tous les pays, aucune restriction nationale publiée. Il ne faut être ni avoir jamais été citoyen turc, ni déjà étudier en Turquie ; être né après le 1er janvier 2005 pour le niveau licence ; détenir un diplôme du secondaire avec au moins 70 % ; n'avoir aucune interruption d'études supérieure à deux ans ; n'avoir ni sanction disciplinaire ni condamnation. Le cycle 2026-2027 a couru de mi-janvier à fin février 2026 ; au 22 septembre 2026, le portail, en maintenance, annonce que les candidatures universitaires ouvriront « dans les prochains jours ».",
      "verifieLe": "2026-09-22",
      "sourceEcheance": "https://diyanetburslari.tdv.org/en/uluslararasi-ilahiyat-lisans-programi/",
      "periodeOuverture": "appel annuel ; le cycle précédent a couru de mi-janvier à fin février ; au 22 septembre 2026, ouverture annoncée « dans les prochains jours »",
      "exigences": []
    },
    "motif": "Portail officiel des bourses Diyanet lu le 2026-09-22 : en maintenance, il affiche « Üniversite Burs Başvuruları henüz aktif değildir. İlerleyen günlerde başvurular açılacaktır » (les candidatures universitaires ne sont pas encore ouvertes, elles ouvriront dans les prochains jours)."
  },
  {
    "collection": "programs",
    "id": "istanbul-university-istanbul__diyanet-tdv-international__doctorat",
    "attendu": {
      "deadline": undefined,
      "status": undefined,
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Pas encore ouverte : à la lecture du site, en septembre 2026, le portail officiel, en maintenance, annonce que les candidatures universitaires ouvriront « dans les prochains jours ». Le cycle précédent avait couru de mi-janvier à fin février 2026.",
      "status": "Fermée — ouverture annoncée prochainement",
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Portail officiel des bourses Diyanet lu le 2026-09-22 : en maintenance, il affiche « Üniversite Burs Başvuruları henüz aktif değildir. İlerleyen günlerde başvurular açılacaktır » (les candidatures universitaires ne sont pas encore ouvertes, elles ouvriront dans les prochains jours)."
  },
  {
    "collection": "programs",
    "id": "istanbul-university-istanbul__diyanet-tdv-international__licence",
    "attendu": {
      "deadline": undefined,
      "status": undefined,
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Pas encore ouverte : à la lecture du site, en septembre 2026, le portail officiel, en maintenance, annonce que les candidatures universitaires ouvriront « dans les prochains jours ». Le cycle précédent avait couru de mi-janvier à fin février 2026.",
      "status": "Fermée — ouverture annoncée prochainement",
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Portail officiel des bourses Diyanet lu le 2026-09-22 : en maintenance, il affiche « Üniversite Burs Başvuruları henüz aktif değildir. İlerleyen günlerde başvurular açılacaktır » (les candidatures universitaires ne sont pas encore ouvertes, elles ouvriront dans les prochains jours)."
  },
  {
    "collection": "programs",
    "id": "istanbul-university-istanbul__diyanet-tdv-international__master",
    "attendu": {
      "deadline": undefined,
      "status": undefined,
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Pas encore ouverte : à la lecture du site, en septembre 2026, le portail officiel, en maintenance, annonce que les candidatures universitaires ouvriront « dans les prochains jours ». Le cycle précédent avait couru de mi-janvier à fin février 2026.",
      "status": "Fermée — ouverture annoncée prochainement",
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Portail officiel des bourses Diyanet lu le 2026-09-22 : en maintenance, il affiche « Üniversite Burs Başvuruları henüz aktif değildir. İlerleyen günlerde başvurular açılacaktır » (les candidatures universitaires ne sont pas encore ouvertes, elles ouvriront dans les prochains jours)."
  },
  {
    "collection": "scholarships",
    "id": "koica-ciat-scholarship",
    "attendu": {
      "verifieLe": undefined,
      "sourceEcheance": undefined,
      "periodeOuverture": undefined
    },
    "champs": {
      "verifieLe": "2026-09-22",
      "sourceEcheance": "https://www.koica.go.kr/ciat/7806/subview.do",
      "periodeOuverture": "appel annuel relayé par le bureau KOICA ou l'ambassade de Corée du pays ; programmes annoncés au milieu de l'année pour une arrivée en Corée en février suivant"
    },
    "motif": "Site du CIAT de KOICA lu le 2026-09-22 (navigateur) : la page du programme de bourses ne publie aucune date ; les avis de juillet 2026 annoncent les programmes 2027. La candidature passe toujours par le bureau KOICA ou l'ambassade du pays."
  },
  {
    "collection": "programs",
    "id": "korea-university-seoul__koica-ciat-scholarship__doctorat",
    "attendu": {
      "deadline": undefined,
      "status": undefined,
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "deadline": "Aucune date publiée sur le site du CIAT à la lecture de septembre 2026 : les programmes 2027 ont été annoncés en juillet 2026, et la candidature passe par le bureau KOICA ou l'ambassade de Corée du pays, sur nomination du gouvernement. Leur demander le calendrier du prochain appel.",
      "status": "Fermée",
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Site du CIAT de KOICA lu le 2026-09-22 (navigateur) : la page du programme de bourses ne publie aucune date ; les avis de juillet 2026 annoncent les programmes 2027. La candidature passe toujours par le bureau KOICA ou l'ambassade du pays."
  },
  {
    "collection": "programs",
    "id": "korea-university-seoul__koica-ciat-scholarship__master",
    "attendu": {
      "deadline": undefined,
      "status": undefined,
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "deadline": "Aucune date publiée sur le site du CIAT à la lecture de septembre 2026 : les programmes 2027 ont été annoncés en juillet 2026, et la candidature passe par le bureau KOICA ou l'ambassade de Corée du pays, sur nomination du gouvernement. Leur demander le calendrier du prochain appel.",
      "status": "Fermée",
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Site du CIAT de KOICA lu le 2026-09-22 (navigateur) : la page du programme de bourses ne publie aucune date ; les avis de juillet 2026 annoncent les programmes 2027. La candidature passe toujours par le bureau KOICA ou l'ambassade du pays."
  },
  {
    "collection": "programs",
    "id": "seoul-national-university-seoul__koica-ciat-scholarship__doctorat",
    "attendu": {
      "deadline": undefined,
      "status": undefined,
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "deadline": "Aucune date publiée sur le site du CIAT à la lecture de septembre 2026 : les programmes 2027 ont été annoncés en juillet 2026, et la candidature passe par le bureau KOICA ou l'ambassade de Corée du pays, sur nomination du gouvernement. Leur demander le calendrier du prochain appel.",
      "status": "Fermée",
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Site du CIAT de KOICA lu le 2026-09-22 (navigateur) : la page du programme de bourses ne publie aucune date ; les avis de juillet 2026 annoncent les programmes 2027. La candidature passe toujours par le bureau KOICA ou l'ambassade du pays."
  },
  {
    "collection": "programs",
    "id": "seoul-national-university-seoul__koica-ciat-scholarship__master",
    "attendu": {
      "deadline": undefined,
      "status": undefined,
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "deadline": "Aucune date publiée sur le site du CIAT à la lecture de septembre 2026 : les programmes 2027 ont été annoncés en juillet 2026, et la candidature passe par le bureau KOICA ou l'ambassade de Corée du pays, sur nomination du gouvernement. Leur demander le calendrier du prochain appel.",
      "status": "Fermée",
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Site du CIAT de KOICA lu le 2026-09-22 (navigateur) : la page du programme de bourses ne publie aucune date ; les avis de juillet 2026 annoncent les programmes 2027. La candidature passe toujours par le bureau KOICA ou l'ambassade du pays."
  },
  {
    "collection": "programs",
    "id": "yonsei-university-seoul__koica-ciat-scholarship__doctorat",
    "attendu": {
      "deadline": undefined,
      "status": undefined,
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "deadline": "Aucune date publiée sur le site du CIAT à la lecture de septembre 2026 : les programmes 2027 ont été annoncés en juillet 2026, et la candidature passe par le bureau KOICA ou l'ambassade de Corée du pays, sur nomination du gouvernement. Leur demander le calendrier du prochain appel.",
      "status": "Fermée",
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Site du CIAT de KOICA lu le 2026-09-22 (navigateur) : la page du programme de bourses ne publie aucune date ; les avis de juillet 2026 annoncent les programmes 2027. La candidature passe toujours par le bureau KOICA ou l'ambassade du pays."
  },
  {
    "collection": "programs",
    "id": "yonsei-university-seoul__koica-ciat-scholarship__master",
    "attendu": {
      "deadline": undefined,
      "status": undefined,
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "deadline": "Aucune date publiée sur le site du CIAT à la lecture de septembre 2026 : les programmes 2027 ont été annoncés en juillet 2026, et la candidature passe par le bureau KOICA ou l'ambassade de Corée du pays, sur nomination du gouvernement. Leur demander le calendrier du prochain appel.",
      "status": "Fermée",
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Site du CIAT de KOICA lu le 2026-09-22 (navigateur) : la page du programme de bourses ne publie aucune date ; les avis de juillet 2026 annoncent les programmes 2027. La candidature passe toujours par le bureau KOICA ou l'ambassade du pays."
  },
  {
    "collection": "scholarships",
    "id": "laziodisco-scholarship",
    "attendu": {
      "status": "Ouverte",
      "funding": "Jusqu'à 100 %",
      "generalCriteria": "",
      "verifieLe": undefined,
      "sourceEcheance": undefined,
      "periodeOuverture": undefined,
      "exigences": undefined
    },
    "champs": {
      "status": "Fermée — bando 2026-2027 terminé",
      "funding": "Jusqu'à 7 556,78 € par an pour un étudiant hors de sa commune dont l'ISEE ne dépasse pas 14 169,94 €, plus deux repas gratuits par jour ; montants plus bas pour les étudiants pendulaires ou résidant sur place, et au-delà de cet ISEE.",
      "generalCriteria": "Plafonds 2026-2027 : ISEE ou ISEEUP ≤ 28 339,88 € et ISPE ≤ 61 608,48 €. Candidature en ligne sur laziodisco.it ; les étudiants internationaux résidant hors d'Italie accèdent à leur espace personnel sans SPID et doivent déposer leur ISEE Universitario Parificato avant le 10 décembre. Couvre les universités du Latium, dont Sapienza.",
      "verifieLe": "2026-09-22",
      "sourceEcheance": "https://laziodisco.it/wp-content/uploads/2026/07/BANDO-DIRITTO-ALLO-STUDIO-ENG-26-27.pdf",
      "periodeOuverture": "bando annuel : dépôt de début juin à fin juillet, seconde phase de corrections début août",
      "exigences": []
    },
    "motif": "Bando « Right to study 2026/2027 » de DiSCo Lazio (version anglaise) lu le 2026-09-22 dans le navigateur (texte du PDF extrait par pdf.js). La fiche disait « Ouverte » et « Jusqu'à 100 % » ; les programmes, « À confirmer »."
  },
  {
    "collection": "programs",
    "id": "sapienza-bachelor",
    "attendu": {
      "deadline": "À confirmer selon l'année académique",
      "deadlineISO": "2026-07-22",
      "coverage": "Exonération des frais de scolarité avec possibilité d'allocation selon les critères d'éligibilité.",
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "deadline": "Bando 2026-2027 terminé : demande du 10 juin jusqu'au 22 juillet 2026 à midi, corrections en seconde phase jusqu'au 11 août. Pour un étudiant résidant hors d'Italie, l'ISEE Universitario Parificato se dépose avant le 10 décembre.",
      "deadlineISO": "2026-07-22",
      "coverage": "Bourse régionale jusqu'à 7 556,78 € par an (étudiant hors de sa commune), plus deux repas gratuits par jour",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://laziodisco.it/wp-content/uploads/2026/07/BANDO-DIRITTO-ALLO-STUDIO-ENG-26-27.pdf",
        "citation": "From 10 June to 22 July 2026, at 12:00pm Compilation and submission of the application form (first phase).",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Bando « Right to study 2026/2027 » de DiSCo Lazio (version anglaise) lu le 2026-09-22 dans le navigateur (texte du PDF extrait par pdf.js). La fiche disait « Ouverte » et « Jusqu'à 100 % » ; les programmes, « À confirmer »."
  },
  {
    "collection": "programs",
    "id": "sapienza-master",
    "attendu": {
      "deadline": "À confirmer selon l'année académique",
      "deadlineISO": "2026-07-22",
      "coverage": "Exonération des frais de scolarité avec possibilité de bourse d'excellence.",
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "deadline": "Bando 2026-2027 terminé : demande du 10 juin jusqu'au 22 juillet 2026 à midi, corrections en seconde phase jusqu'au 11 août. Pour un étudiant résidant hors d'Italie, l'ISEE Universitario Parificato se dépose avant le 10 décembre.",
      "deadlineISO": "2026-07-22",
      "coverage": "Bourse régionale jusqu'à 7 556,78 € par an (étudiant hors de sa commune), plus deux repas gratuits par jour",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://laziodisco.it/wp-content/uploads/2026/07/BANDO-DIRITTO-ALLO-STUDIO-ENG-26-27.pdf",
        "citation": "From 10 June to 22 July 2026, at 12:00pm Compilation and submission of the application form (first phase).",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Bando « Right to study 2026/2027 » de DiSCo Lazio (version anglaise) lu le 2026-09-22 dans le navigateur (texte du PDF extrait par pdf.js). La fiche disait « Ouverte » et « Jusqu'à 100 % » ; les programmes, « À confirmer »."
  },
  {
    "collection": "scholarships",
    "id": "beijing-government-scholarship",
    "attendu": {
      "officialWebsite": "https://english.beijing.gov.cn/studyinginbeijing/scholarshipapplications/",
      "funding": "3 formules — Type A : scolarité + logement + allocation mensuelle + assurance santé ; Type B : scolarité + logement + assurance santé ; Type C : scolarité + assurance santé seules. Montants précis fixés par l'université d'accueil.",
      "generalCriteria": "Limite d'âge : 25 ans (Licence), 35 ans (Master), 40 ans (Doctorat). Candidature déposée directement auprès de l'université pékinoise visée, pas via un portail central — calendrier propre à chaque établissement, généralement janvier-mars.",
      "ageMax": undefined,
      "ageMaxNote": undefined,
      "echeanceVariable": undefined,
      "verifieLe": undefined,
      "sourceEcheance": undefined,
      "periodeOuverture": undefined,
      "exigences": undefined
    },
    "champs": {
      "officialWebsite": "https://english.beijing.gov.cn/studyinginbeijing/news/202601/t20260123_4459326.html",
      "funding": "Trois catégories — A : frais de scolarité, logement, allocation de vie et assurance maladie ; B : scolarité, logement et assurance ; C : scolarité et assurance. L'allocation est versée par l'établissement d'accueil.",
      "generalCriteria": "Limites d'âge à l'inscription : 25 ans (licence), 35 ans (master), 40 ans (doctorat). Langue : HSK 4 pour un cursus en chinois ; pour un cursus en anglais, certificat exigé (TOEFL 85 ou IELTS 6,5 pour la catégorie A). Résultats : moyenne d'au moins 85/100 ou GPA 3,6 pour la catégorie A, 80/100 ou 3,0 pour B et C. Deux lettres de recommandation de professeurs pour le master et le doctorat. Candidature déposée directement auprès de l'établissement pékinois visé, qui évalue et décide ; non cumulable avec une autre bourse chinoise.",
      "ageMax": {
        "licence": 25,
        "master": 35,
        "doctorat": 40
      },
      "ageMaxNote": "Avis de la municipalité de Pékin (janvier 2026) : « no older than 25 / 35 / 40 years of age at the time of enrollment » selon le cycle.",
      "echeanceVariable": "etablissement",
      "verifieLe": "2026-09-22",
      "sourceEcheance": "https://english.beijing.gov.cn/studyinginbeijing/news/202601/t20260123_4459326.html",
      "periodeOuverture": "date limite fixée par chaque établissement, publiée dans la rubrique « Studying in Beijing » du portail de la municipalité",
      "exigences": [
        "admission_prealable",
        "lettres_recommandation",
        "certification_langue_requise"
      ]
    },
    "motif": "Avis officiel « Application Procedures for Beijing Government Scholarship for International Students » (23 janvier 2026) lu le 2026-09-22 : la date limite appartient à chaque établissement. Limites d'âge, langue, résultats et catégories relevées à la source."
  },
  {
    "collection": "programs",
    "id": "peking-university-beijing__beijing-government-scholarship",
    "attendu": {
      "deadline": "Calendrier propre à Peking University, généralement janvier-mars — se référer à isd.pku.edu.cn",
      "status": "Ouverte",
      "coverage": "Type A, B ou C selon le profil — voir le champ funding de la bourse",
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "deadline": "Date limite fixée par chaque établissement : pour l'Université de Pékin, la lire sur la page de son bureau des étudiants internationaux. La municipalité publie les calendriers dans la rubrique « Studying in Beijing » de son portail.",
      "status": "Ouverte — date propre à chaque établissement",
      "coverage": "Catégorie A, B ou C : scolarité et assurance toujours, logement pour A et B, allocation de vie pour A seulement",
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Avis officiel « Application Procedures for Beijing Government Scholarship for International Students » (23 janvier 2026) lu le 2026-09-22 : la date limite appartient à chaque établissement. Limites d'âge, langue, résultats et catégories relevées à la source."
  },
  {
    "collection": "scholarships",
    "id": "nanjing-government-scholarship",
    "attendu": {
      "officialWebsite": "https://hwxy.nju.edu.cn/English/StudyatNJU/Scholarships/JiangsuGovernmentScholarship/index.html",
      "status": "Ouverte",
      "funding": "Bourse partielle : 20 000 RMB/an (Master, Doctorat), 10 000 RMB/an (Licence) — ne couvre pas nécessairement la totalité des frais de scolarité, montant exact à confirmer auprès de l'université d'accueil.",
      "description": "Bourse municipale de Nankin, distincte de la CSC nationale — une dizaine d'universités nankinoises éligibles, dont l'Université de Nankin.",
      "generalCriteria": "Calendrier variable selon l'université (généralement mars-septembre) — se renseigner directement auprès de l'établissement visé.",
      "levels": [
        "Licence",
        "Master",
        "Doctorat"
      ],
      "ageMax": undefined,
      "ageMaxNote": undefined,
      "eligibility": {
        "note": "Ouverte à toutes les nationalités étrangères ; le dossier se dépose auprès d'une université de Nankin, qui présente la candidature à la municipalité.",
        "scope": "monde"
      },
      "verifieLe": undefined,
      "sourceEcheance": undefined,
      "periodeOuverture": undefined,
      "exigences": undefined
    },
    "champs": {
      "officialWebsite": "https://hwxy.nju.edu.cn/English/StudyatNJU/Scholarships/NanjingMunicipalScholarship/index.html",
      "status": "Fermée",
      "funding": "Prime UNIQUE, non annuelle : 10 000 CNY en licence, 20 000 CNY en master.",
      "description": "Bourse de la municipalité de Nankin, distincte de la CSC nationale. À l'Université de Nankin, c'est une prime unique versée à des étudiants étrangers DÉJÀ inscrits, pas une bourse d'entrée.",
      "generalCriteria": "Réservée aux étudiants étrangers déjà inscrits à l'Université de Nankin, sans sanction disciplinaire et avec de bons résultats. Moins de 30 ans en licence, moins de 35 ans en master. Non cumulable avec une autre bourse d'un gouvernement, d'une collectivité ou d'une organisation. Dernière fenêtre publiée : juillet 2024 ; la page n'a pas été mise à jour depuis.",
      "levels": [
        "Licence",
        "Master"
      ],
      "ageMax": {
        "licence": 29,
        "master": 34
      },
      "ageMaxNote": "Page de l'Université de Nankin : « under the age of 30 » (licence) et « under the age of 35 » (master).",
      "eligibility": {
        "note": "Toutes nationalités étrangères, mais réservée aux étudiants DÉJÀ inscrits à l'Université de Nankin : ce n'est pas une bourse pour y entrer.",
        "scope": "monde"
      },
      "verifieLe": "2026-09-22",
      "sourceEcheance": "https://hwxy.nju.edu.cn/English/StudyatNJU/Scholarships/NanjingMunicipalScholarship/index.html",
      "periodeOuverture": "fenêtre annuelle d'un mois pour les étudiants déjà inscrits (juillet en 2024), à confirmer auprès du bureau des étudiants internationaux",
      "exigences": [
        "admission_prealable"
      ]
    },
    "motif": "Page « Nanjing Municipal Scholarship » de l'Université de Nankin lue le 2026-09-22 : c'est une PRIME UNIQUE (10 000 CNY en licence, 20 000 CNY en master), réservée aux étudiants DÉJÀ inscrits ; dernière fenêtre publiée en juillet 2024. La fiche parlait de « 20 000 RMB/an », d'un doctorat et d'un calendrier « mars-septembre », et pointait sur la page de la bourse du Jiangsu, vide."
  },
  {
    "collection": "programs",
    "id": "nanjing-university-nanjing__nanjing-government-scholarship",
    "attendu": {
      "deadline": "Variable selon l'université, généralement mars-septembre — se référer à hwxy.nju.edu.cn",
      "status": "Ouverte",
      "coverage": "20 000 RMB/an (Master/Doctorat) ou 10 000 RMB/an (Licence) — bourse partielle, voir funding",
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "deadline": "Dernière fenêtre publiée par l'Université de Nankin : du 1er au 31 juillet 2024, et la page n'a pas été mise à jour depuis. Réservée aux étudiants déjà inscrits à l'Université de Nankin : ce n'est pas une bourse d'entrée.",
      "status": "Fermée",
      "coverage": "Prime unique de 10 000 CNY (licence) ou 20 000 CNY (master)",
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Page « Nanjing Municipal Scholarship » de l'Université de Nankin lue le 2026-09-22 : c'est une PRIME UNIQUE (10 000 CNY en licence, 20 000 CNY en master), réservée aux étudiants DÉJÀ inscrits ; dernière fenêtre publiée en juillet 2024. La fiche parlait de « 20 000 RMB/an », d'un doctorat et d'un calendrier « mars-septembre », et pointait sur la page de la bourse du Jiangsu, vide."
  },
  {
    "collection": "scholarships",
    "id": "sapienza-phd-scholarship",
    "attendu": {
      "sourceEcheance": undefined,
      "periodeOuverture": undefined
    },
    "champs": {
      "sourceEcheance": "https://www.uniroma1.it/en/pagina/phd-programmes",
      "periodeOuverture": "appel annuel au printemps, clôture en juin (17 juin pour le cycle 42)"
    },
    "motif": "Complément du lot 63 : la fiche Sapienza avait été revérifiée le 2026-09-20 (verifieLe posé, citation « Admissions to 2026-2027 PhD Programmes (deadline June 17) ») sans que sa source ni son rythme soient reportés sur la bourse. Même page, même lecture."
  }
];
