/**
 * ============================================================
 * LOT 62 — LA VOIX DE L'ENTREPRISE (20 septembre 2026)
 * ============================================================
 *
 * POURQUOI CE LOT EXISTE
 * ----------------------
 * Charles a lu sur une fiche publique : « …figure dans le
 * "scadenzario" officiel, QUE JE N'AI PAS PU LIRE. Vérifier la date
 * exacte sur ardis.fvg.it. » Deux fautes en une phrase — un « je »
 * qui réduit l'entreprise à une personne, et une consigne de travail
 * adressée à un rédacteur interne, publiée à l'étudiant.
 *
 * L'audit du 2026-09-20 a recensé QUATRE familles du même défaut dans
 * les données publiques :
 *   1. six « que je n'ai pas pu lire » (ARDiS Trieste ×2, Tunisie ×4) ;
 *   2. deux notes qui citent un PRÉNOM (McGill, Fudan) ;
 *   3. sept fiches qui publient le mot « lot », vocabulaire de
 *      production interne, parfois en capitales ;
 *   4. trois fiches DAAD qui racontent qu'un robot maison s'est fait
 *      refouler par la base de bourses.
 *
 * DOCTRINE APPLIQUÉE (posée par Charles le 2026-09-20)
 * ----------------------------------------------------
 * Le site parle comme une ENTREPRISE, jamais comme une personne
 * seule. Fitz — l'assistant — garde son « je », c'est sa voix. Les
 * données du catalogue n'en ont aucun.
 *
 * MÉTHODE — POURQUOI CE FICHIER EST GÉNÉRÉ, PAS ÉCRIT À LA MAIN
 * -------------------------------------------------------------
 * Chaque `attendu` est la valeur EXACTE lue dans
 * assets/data/catalogue.json (export du 2026-09-20T12:37Z), et chaque
 * `champs` est cette même valeur où SEULE la phrase fautive a été
 * remplacée. Aucune phrase n'a été retapée : une réécriture à la main
 * aurait pu déplacer un chiffre, une date ou un nom d'établissement.
 * Si le runner refuse un `attendu`, c'est que la base a bougé depuis
 * l'export : on relit, on ne force pas.
 *
 * CE QUI N'EST PAS TOUCHÉ, ET POURQUOI
 * ------------------------------------
 * - Les réserves honnêtes (« à confirmer », « non publié », « vérifier
 *   l'appel en cours ») RESTENT : elles protègent l'étudiant. Seul
 *   change ce qui s'adressait à un rédacteur.
 * - Les notes sans accents (King Abdulaziz, Senghor, une partie de
 *   Shanghai Maritime) attendent un lot séparé : les réécrire en bloc
 *   ferait courir le risque de déplacer un montant.
 * - `sourceVerification.parUid` (l'UID admin, publié 437 fois dans
 *   l'instantané) se purge à la GÉNÉRATION de l'instantané, pas en
 *   base : c'est une trace d'audit légitime côté Firestore.
 * ============================================================
 */

export const PATCHES = [
  {
    "collection": "programs",
    "id": "universita-di-trieste-trieste__ardis-friuli-venezia-giulia__licence",
    "attendu": {
      "deadline": "Bando 2026-2027 ouvert depuis la mi-juillet ; la clôture (à 13h00, heure italienne) dépend du bénéfice demandé et figure dans le « scadenzario » officiel, que je n'ai pas pu lire. Vérifier la date exacte de la bourse (borsa di studio) sur ardis.fvg.it."
    },
    "champs": {
      "deadline": "Bando 2026-2027 ouvert depuis la mi-juillet ; la clôture (à 13h00, heure italienne) dépend du bénéfice demandé et figure dans le « scadenzario » officiel, que l'ARDiS publie en italien. Vérifiez la date exacte de la bourse (borsa di studio) sur ardis.fvg.it avant de déposer."
    },
    "motif": "LOT VOIX : la fiche disait « que je n'ai pas pu lire » puis donnait une consigne de travail au rédacteur. Le site parle au nom de FitzUniverse, jamais à la première personne du singulier. L'information utile est conservée (la clôture dépend du bénéfice, elle est au scadenzario de l'ARDiS), l'aveu de rédaction part, et la phrase s'adresse enfin à l'étudiant."
  },
  {
    "collection": "programs",
    "id": "universita-di-trieste-trieste__ardis-friuli-venezia-giulia__master",
    "attendu": {
      "deadline": "Bando 2026-2027 ouvert depuis la mi-juillet ; la clôture (à 13h00, heure italienne) dépend du bénéfice demandé et figure dans le « scadenzario » officiel, que je n'ai pas pu lire. Vérifier la date exacte de la bourse (borsa di studio) sur ardis.fvg.it."
    },
    "champs": {
      "deadline": "Bando 2026-2027 ouvert depuis la mi-juillet ; la clôture (à 13h00, heure italienne) dépend du bénéfice demandé et figure dans le « scadenzario » officiel, que l'ARDiS publie en italien. Vérifiez la date exacte de la bourse (borsa di studio) sur ardis.fvg.it avant de déposer."
    },
    "motif": "LOT VOIX : la fiche disait « que je n'ai pas pu lire » puis donnait une consigne de travail au rédacteur. Le site parle au nom de FitzUniverse, jamais à la première personne du singulier. L'information utile est conservée (la clôture dépend du bénéfice, elle est au scadenzario de l'ARDiS), l'aveu de rédaction part, et la phrase s'adresse enfin à l'étudiant."
  },
  {
    "collection": "programs",
    "id": "universite-de-carthage-tunis__bourses-cooperation-tunisie__licence",
    "attendu": {
      "deadline": "Le MESRI du Sénégal a publié fin juillet l'appel « Opportunité de bourses d'études en Tunisie, année académique 2026/2027 » ; la date limite figure dans les images de l'annonce, que je n'ai pas pu lire. Réservé aux candidats présentés par leur autorité nationale (au Sénégal : Direction des Bourses)."
    },
    "champs": {
      "deadline": "Le MESRI du Sénégal a publié fin juillet l'appel « Opportunité de bourses d'études en Tunisie, année académique 2026/2027 » ; la date limite ne figure que sur les visuels de l'annonce. Confirmez-la auprès de la Direction des Bourses, qui présente les candidats sénégalais : ce dépôt passe obligatoirement par votre autorité nationale."
    },
    "motif": "LOT VOIX : même défaut que les fiches ARDiS — « que je n'ai pas pu lire » publié à l'étudiant. La réserve est gardée (la date n'est que sur les visuels), mais elle devient une action à faire auprès de la Direction des Bourses, qui est de toute façon le passage obligé."
  },
  {
    "collection": "programs",
    "id": "universite-de-sfax-sfax__bourses-cooperation-tunisie__licence",
    "attendu": {
      "deadline": "Le MESRI du Sénégal a publié fin juillet l'appel « Opportunité de bourses d'études en Tunisie, année académique 2026/2027 » ; la date limite figure dans les images de l'annonce, que je n'ai pas pu lire. Réservé aux candidats présentés par leur autorité nationale (au Sénégal : Direction des Bourses)."
    },
    "champs": {
      "deadline": "Le MESRI du Sénégal a publié fin juillet l'appel « Opportunité de bourses d'études en Tunisie, année académique 2026/2027 » ; la date limite ne figure que sur les visuels de l'annonce. Confirmez-la auprès de la Direction des Bourses, qui présente les candidats sénégalais : ce dépôt passe obligatoirement par votre autorité nationale."
    },
    "motif": "LOT VOIX : même défaut que les fiches ARDiS — « que je n'ai pas pu lire » publié à l'étudiant. La réserve est gardée (la date n'est que sur les visuels), mais elle devient une action à faire auprès de la Direction des Bourses, qui est de toute façon le passage obligé."
  },
  {
    "collection": "programs",
    "id": "universite-de-sousse-sousse__bourses-cooperation-tunisie__licence",
    "attendu": {
      "deadline": "Le MESRI du Sénégal a publié fin juillet l'appel « Opportunité de bourses d'études en Tunisie, année académique 2026/2027 » ; la date limite figure dans les images de l'annonce, que je n'ai pas pu lire. Réservé aux candidats présentés par leur autorité nationale (au Sénégal : Direction des Bourses)."
    },
    "champs": {
      "deadline": "Le MESRI du Sénégal a publié fin juillet l'appel « Opportunité de bourses d'études en Tunisie, année académique 2026/2027 » ; la date limite ne figure que sur les visuels de l'annonce. Confirmez-la auprès de la Direction des Bourses, qui présente les candidats sénégalais : ce dépôt passe obligatoirement par votre autorité nationale."
    },
    "motif": "LOT VOIX : même défaut que les fiches ARDiS — « que je n'ai pas pu lire » publié à l'étudiant. La réserve est gardée (la date n'est que sur les visuels), mais elle devient une action à faire auprès de la Direction des Bourses, qui est de toute façon le passage obligé."
  },
  {
    "collection": "programs",
    "id": "universite-de-tunis-el-manar-tunis__bourses-cooperation-tunisie__licence",
    "attendu": {
      "deadline": "Le MESRI du Sénégal a publié fin juillet l'appel « Opportunité de bourses d'études en Tunisie, année académique 2026/2027 » ; la date limite figure dans les images de l'annonce, que je n'ai pas pu lire. Réservé aux candidats présentés par leur autorité nationale (au Sénégal : Direction des Bourses)."
    },
    "champs": {
      "deadline": "Le MESRI du Sénégal a publié fin juillet l'appel « Opportunité de bourses d'études en Tunisie, année académique 2026/2027 » ; la date limite ne figure que sur les visuels de l'annonce. Confirmez-la auprès de la Direction des Bourses, qui présente les candidats sénégalais : ce dépôt passe obligatoirement par votre autorité nationale."
    },
    "motif": "LOT VOIX : même défaut que les fiches ARDiS — « que je n'ai pas pu lire » publié à l'étudiant. La réserve est gardée (la date n'est que sur les visuels), mais elle devient une action à faire auprès de la Direction des Bourses, qui est de toute façon le passage obligé."
  },
  {
    "collection": "programs",
    "id": "humboldt-universitat-zu-berlin-berlin__daad-study-scholarships",
    "attendu": {
      "deadline": "La date limite du DAAD DÉPEND DU PAYS DE RÉSIDENCE du candidat et se lit appel par appel dans la base de bourses du DAAD. La date de fin août portée jusqu'ici n'a pas pu être confirmée à ce jour : la base de bourses refuse la consultation automatisée. Pour la campagne 2026-2027, une université partenaire européenne annonçait la mi-novembre. Le dépôt se fait à l'automne pour la rentrée suivante. Vérifier l'appel correspondant à votre pays avant toute démarche."
    },
    "champs": {
      "deadline": "La date limite du DAAD DÉPEND DU PAYS DE RÉSIDENCE du candidat et se lit appel par appel dans la base de bourses du DAAD. La date de fin août portée jusqu'ici n'est pas confirmée à ce jour. Pour la campagne 2026-2027, une université partenaire européenne annonçait la mi-novembre. Le dépôt se fait à l'automne pour la rentrée suivante. Vérifier l'appel correspondant à votre pays avant toute démarche."
    },
    "motif": "LOT VOIX : « la base de bourses refuse la consultation automatisée » racontait à l'étudiant l'échec d'un outil interne. Le fait utile — la date n'est pas confirmée, elle se lit appel par appel — est conservé mot pour mot."
  },
  {
    "collection": "programs",
    "id": "leibniz-universitat-hannover-hannover__daad-study-scholarships",
    "attendu": {
      "deadline": "La date limite du DAAD DÉPEND DU PAYS DE RÉSIDENCE du candidat et se lit appel par appel dans la base de bourses du DAAD. La date de fin août portée jusqu'ici n'a pas pu être confirmée à ce jour : la base de bourses refuse la consultation automatisée. Pour la campagne 2026-2027, une université partenaire européenne annonçait la mi-novembre. Le dépôt se fait à l'automne pour la rentrée suivante. Vérifier l'appel correspondant à votre pays avant toute démarche."
    },
    "champs": {
      "deadline": "La date limite du DAAD DÉPEND DU PAYS DE RÉSIDENCE du candidat et se lit appel par appel dans la base de bourses du DAAD. La date de fin août portée jusqu'ici n'est pas confirmée à ce jour. Pour la campagne 2026-2027, une université partenaire européenne annonçait la mi-novembre. Le dépôt se fait à l'automne pour la rentrée suivante. Vérifier l'appel correspondant à votre pays avant toute démarche."
    },
    "motif": "LOT VOIX : « la base de bourses refuse la consultation automatisée » racontait à l'étudiant l'échec d'un outil interne. Le fait utile — la date n'est pas confirmée, elle se lit appel par appel — est conservé mot pour mot."
  },
  {
    "collection": "programs",
    "id": "universitat-hamburg-hamburg__daad-study-scholarships",
    "attendu": {
      "deadline": "La date limite du DAAD DÉPEND DU PAYS DE RÉSIDENCE du candidat et se lit appel par appel dans la base de bourses du DAAD. La date de fin août portée jusqu'ici n'a pas pu être confirmée à ce jour : la base de bourses refuse la consultation automatisée. Pour la campagne 2026-2027, une université partenaire européenne annonçait la mi-novembre. Le dépôt se fait à l'automne pour la rentrée suivante. Vérifier l'appel correspondant à votre pays avant toute démarche."
    },
    "champs": {
      "deadline": "La date limite du DAAD DÉPEND DU PAYS DE RÉSIDENCE du candidat et se lit appel par appel dans la base de bourses du DAAD. La date de fin août portée jusqu'ici n'est pas confirmée à ce jour. Pour la campagne 2026-2027, une université partenaire européenne annonçait la mi-novembre. Le dépôt se fait à l'automne pour la rentrée suivante. Vérifier l'appel correspondant à votre pays avant toute démarche."
    },
    "motif": "LOT VOIX : « la base de bourses refuse la consultation automatisée » racontait à l'étudiant l'échec d'un outil interne. Le fait utile — la date n'est pas confirmée, elle se lit appel par appel — est conservé mot pour mot."
  },
  {
    "collection": "universities",
    "id": "mcgill-university-montreal",
    "attendu": {
      "fraisScolarite": {
        "source": "https://www.mcgill.ca/student-accounts/files/student-accounts/new_intl_ugrad_degree_students_admitted_2026-27_0.pdf",
        "verifieLe": "2026-09-12",
        "note": "Grille officielle 2026-27 (PDF, lu page par page par Charles), étudiant international admis à l'automne 2026, scolarité seule pour 30 crédits : Bachelor of Arts 54 000 $ CA ; Bachelor of Engineering 65 167,50 $ ; Éducation et kinésiologie 31 836,60 $ ; Arts & Science combiné 56 000,10 $. Ajouter environ 3 500 $ de frais et d'assurances. Tarif garanti pour toute la durée du programme. Montant retenu : le BA. Bachelor of Science seul et master : non relevés.",
        "licence": {
          "montant": 54000,
          "devise": "CAD",
          "periode": "an"
        }
      }
    },
    "champs": {
      "fraisScolarite": {
        "source": "https://www.mcgill.ca/student-accounts/files/student-accounts/new_intl_ugrad_degree_students_admitted_2026-27_0.pdf",
        "verifieLe": "2026-09-12",
        "note": "Grille officielle 2026-27 (PDF officiel, relevé page par page), étudiant international admis à l'automne 2026, scolarité seule pour 30 crédits : Bachelor of Arts 54 000 $ CA ; Bachelor of Engineering 65 167,50 $ ; Éducation et kinésiologie 31 836,60 $ ; Arts & Science combiné 56 000,10 $. Ajouter environ 3 500 $ de frais et d'assurances. Tarif garanti pour toute la durée du programme. Montant retenu : le BA. Bachelor of Science seul et master : non relevés.",
        "licence": {
          "montant": 54000,
          "devise": "CAD",
          "periode": "an"
        }
      }
    },
    "motif": "LOT VOIX : la note citait un prénom. Une donnée publique ne nomme pas qui l'a saisie — la traçabilité vit dans `source` et `verifieLe`, qui restent inchangés."
  },
  {
    "collection": "universities",
    "id": "fudan-university-shanghai",
    "attendu": {
      "fraisScolarite": {
        "source": "https://iso.fudan.edu.cn/_upload/article/files/22/0d/d9cbe08947b29dfe2c7f3626e15e/efb0e74d-2f86-4b1a-a08a-7f4405bd7a9b.xlsx",
        "verifieLe": "2026-09-12",
        "note": "Grille 2026 des licences enseignées en chinois (fichier officiel de l'International Students Office, lu par Charles) : lettres, droit, économie, gestion, sciences sociales 23 000 ¥/an ; sciences, informatique, ingénierie 26 000 ¥/an ; médecine, pharmacie, soins infirmiers 42 000 ¥/an. Montant retenu : 23 000 (majors « Arts »). Frais de dossier 800 ¥. Master et doctorat : non lus. « À titre indicatif, montant exact annoncé à l'inscription. »",
        "licence": {
          "montant": 23000,
          "devise": "CNY",
          "periode": "an"
        }
      }
    },
    "champs": {
      "fraisScolarite": {
        "source": "https://iso.fudan.edu.cn/_upload/article/files/22/0d/d9cbe08947b29dfe2c7f3626e15e/efb0e74d-2f86-4b1a-a08a-7f4405bd7a9b.xlsx",
        "verifieLe": "2026-09-12",
        "note": "Grille 2026 des licences enseignées en chinois (fichier officiel de l'International Students Office) : lettres, droit, économie, gestion, sciences sociales 23 000 ¥/an ; sciences, informatique, ingénierie 26 000 ¥/an ; médecine, pharmacie, soins infirmiers 42 000 ¥/an. Montant retenu : 23 000 (majors « Arts »). Frais de dossier 800 ¥. Master et doctorat : non lus. « À titre indicatif, montant exact annoncé à l'inscription. »",
        "licence": {
          "montant": 23000,
          "devise": "CNY",
          "periode": "an"
        }
      }
    },
    "motif": "LOT VOIX : même correction qu'à McGill — le prénom du rédacteur quitte la donnée publique, la source reste."
  },
  {
    "collection": "scholarships",
    "id": "arppis-daad-icipe",
    "attendu": {
      "eligibility": {
        "scope": "groupes",
        "groups": [
          "afrique"
        ],
        "note": "« A citizen of a country in sub-Saharan Africa », et l'annonce officielle « encourages applications from French- and Portuguese-speaking countries in Africa » — c'est le seul programme de ce lot à appeler explicitement les francophones."
      }
    },
    "champs": {
      "eligibility": {
        "scope": "groupes",
        "groups": [
          "afrique"
        ],
        "note": "« A citizen of a country in sub-Saharan Africa », et l'annonce officielle « encourages applications from French- and Portuguese-speaking countries in Africa » : les candidats francophones sont explicitement encouragés."
      }
    },
    "motif": "LOT VOIX : « ce lot » est du vocabulaire de production, incompréhensible pour un étudiant — et « le seul programme » était une comparaison invérifiable. Le fait cité reste, sans le classement."
  },
  {
    "collection": "scholarships",
    "id": "universite-senghor-master-developpement",
    "attendu": {
      "generalCriteria": "SEULE BOURSE DE CE LOT ENSEIGNÉE EN FRANÇAIS, ce qui lève la barrière linguistique qui pèse sur tous les autres programmes africains du catalogue. Recrutement SUR CONCOURS : épreuve écrite puis oraux. Entrée en première année : Bac+3 et « une expérience professionnelle pertinente d'au moins une année ». Entrée directe en seconde année : Bac+4 et un an d'expérience, ou Bac+3 et trois ans d'expérience avec dossier de validation des acquis — le candidat doit alors être EN SITUATION D'ACTIVITÉ PROFESSIONNELLE, sauf pour la spécialité gestion globale des risques et des crises. Cycle 2026 : première année close le 15 mars 2026, écrit le 29 avril, oraux en seconde quinzaine de mai ; seconde année close le 30 avril 2026. Cycle 2027 non annoncé. Une école doctorale interdisciplinaire en développement africain existe également, aux conditions non vérifiées."
    },
    "champs": {
      "generalCriteria": "Programme enseigné en français : la barrière linguistique qui pèse sur la plupart des autres programmes africains du catalogue ne s'applique pas ici. Recrutement SUR CONCOURS : épreuve écrite puis oraux. Entrée en première année : Bac+3 et « une expérience professionnelle pertinente d'au moins une année ». Entrée directe en seconde année : Bac+4 et un an d'expérience, ou Bac+3 et trois ans d'expérience avec dossier de validation des acquis — le candidat doit alors être EN SITUATION D'ACTIVITÉ PROFESSIONNELLE, sauf pour la spécialité gestion globale des risques et des crises. Cycle 2026 : première année close le 15 mars 2026, écrit le 29 avril, oraux en seconde quinzaine de mai ; seconde année close le 30 avril 2026. Cycle 2027 non annoncé. Une école doctorale interdisciplinaire en développement africain existe également, aux conditions non vérifiées."
    },
    "motif": "LOT VOIX : « SEULE BOURSE DE CE LOT » publiait le découpage interne, en capitales. L'avantage réel pour l'étudiant francophone est dit en clair."
  },
  {
    "collection": "scholarships",
    "id": "utokyo-fellowship",
    "attendu": {
      "funding": "200 000 ¥/mois d'allocation d'aide à la recherche, versés pendant la durée normale du cursus (3 ans à la Graduate School of Frontier Sciences), soit environ 2,4 millions de ¥ par an — le montant mensuel le plus élevé de ce lot. La bourse est une allocation de subsistance : la prise en charge des frais de scolarité, d'inscription et du billet d'avion n'est pas publiée."
    },
    "champs": {
      "funding": "200 000 ¥/mois d'allocation d'aide à la recherche, versés pendant la durée normale du cursus (3 ans à la Graduate School of Frontier Sciences), soit environ 2,4 millions de ¥ par an. La bourse est une allocation de subsistance : la prise en charge des frais de scolarité, d'inscription et du billet d'avion n'est pas publiée."
    },
    "motif": "LOT VOIX : le superlatif reposait sur un découpage interne (« ce lot »), pas sur le catalogue. Le montant parle de lui-même."
  },
  {
    "collection": "universities",
    "id": "icipe-nairobi",
    "attendu": {
      "description": "Institut de recherche plutôt qu'université : le doctorat est financé par le DAAD et le diplôme délivré par une université partenaire du réseau ARPPIS. Le seul programme de ce lot à encourager explicitement les candidats francophones."
    },
    "champs": {
      "description": "Institut de recherche plutôt qu'université : le doctorat est financé par le DAAD et le diplôme délivré par une université partenaire du réseau ARPPIS. L'appel encourage explicitement les candidatures francophones."
    },
    "motif": "LOT VOIX : « ce lot » retiré, la comparaison invérifiable aussi."
  },
  {
    "collection": "universities",
    "id": "king-abdulaziz-university-jeddah",
    "attendu": {
      "description": "Confirmée parmi les 27 universités du portail national studyinsaudi.moe.gov.sa. Établissement réel et distinct de l'ancien nom de bourse \"King Abdulaziz Scholarship\", corrigé au lot 5 en \"Bourses du gouvernement saoudien\" — aucun rapport hormis le nom du souverain fondateur."
    },
    "champs": {
      "description": "Confirmée parmi les 27 universités du portail national studyinsaudi.moe.gov.sa. À ne pas confondre avec les « Bourses du gouvernement saoudien », qui portent le nom du même souverain fondateur sans lien avec cet établissement."
    },
    "motif": "LOT VOIX : la fiche racontait l'histoire d'une correction interne (« corrigé au lot 5 »). Ce qui sert à l'étudiant, c'est de ne pas confondre l'université et la bourse."
  },
  {
    "collection": "universities",
    "id": "shanghai-maritime-university-shanghai",
    "attendu": {
      "description": "L'un des établissements shanghaïens confirmés éligibles à la Shanghai Government Scholarship — d'autres universités de la ville le sont également, non vérifiées individuellement ce lot-ci.",
      "fraisScolarite": {
        "source": "https://en.shmtu.edu.cn/DoctoralPrograms/main.psp",
        "verifieLe": "2026-09-13",
        "note": "Pages officielles du site anglais, une par niveau : licence 20 000 CNY/an, master 23 000 CNY/an, doctorat 29 000 CNY/an sur 3 ans. Tarif UNIQUE par niveau, et — point notable par rapport aux autres universites chinoises de ce lot — AUCUN supplement pour l'enseignement en anglais : les pages listent des programmes en chinois (HSK 5 exige) et des programmes en anglais (IELTS 6.0, TOEFL 80 ou Cambridge B2) au meme prix. Frais de dossier 400 CNY, non remboursables. Calendrier 2026 : bourse du gouvernement chinois du 1er decembre au 1er fevrier, bourse du gouvernement de Shanghai jusqu'au 30 avril, autofinances jusqu'au 30 mai, rentree en septembre. Non lus : assurance, logement, et le document chinois des regles de tarification.",
        "licence": {
          "montant": 20000,
          "devise": "CNY",
          "periode": "an"
        },
        "master": {
          "montant": 23000,
          "devise": "CNY",
          "periode": "an"
        },
        "doctorat": {
          "montant": 29000,
          "devise": "CNY",
          "periode": "an"
        }
      }
    },
    "champs": {
      "description": "L'un des établissements shanghaïens confirmés éligibles à la Shanghai Government Scholarship — d'autres universités de la ville le sont également ; leur éligibilité n'a pas été vérifiée une par une.",
      "fraisScolarite": {
        "source": "https://en.shmtu.edu.cn/DoctoralPrograms/main.psp",
        "verifieLe": "2026-09-13",
        "note": "Pages officielles du site anglais, une par niveau : licence 20 000 CNY/an, master 23 000 CNY/an, doctorat 29 000 CNY/an sur 3 ans. Tarif UNIQUE par niveau, et — point notable par rapport aux autres universités chinoises du catalogue — AUCUN supplement pour l'enseignement en anglais : les pages listent des programmes en chinois (HSK 5 exige) et des programmes en anglais (IELTS 6.0, TOEFL 80 ou Cambridge B2) au meme prix. Frais de dossier 400 CNY, non remboursables. Calendrier 2026 : bourse du gouvernement chinois du 1er decembre au 1er fevrier, bourse du gouvernement de Shanghai jusqu'au 30 avril, autofinances jusqu'au 30 mai, rentree en septembre. Non lus : assurance, logement, et le document chinois des regles de tarification.",
        "licence": {
          "montant": 20000,
          "devise": "CNY",
          "periode": "an"
        },
        "master": {
          "montant": 23000,
          "devise": "CNY",
          "periode": "an"
        },
        "doctorat": {
          "montant": 29000,
          "devise": "CNY",
          "periode": "an"
        }
      }
    },
    "motif": "LOT VOIX : la réserve est juste et doit rester, mais « ce lot-ci » ne veut rien dire pour un étudiant. — LOT VOIX : « ce lot » retiré et l'accent rendu à « universités »."
  },
  {
    "collection": "universities",
    "id": "universite-senghor-alexandrie",
    "attendu": {
      "description": "La seule université de ce lot à enseigner en français. Recrute sur concours — épreuve écrite puis oraux — et exige au moins un an d'expérience professionnelle."
    },
    "champs": {
      "description": "Université francophone : l'enseignement s'y fait en français. Recrute sur concours — épreuve écrite puis oraux — et exige au moins un an d'expérience professionnelle."
    },
    "motif": "LOT VOIX : « ce lot » retiré ; l'information (l'enseignement est en français) est ce qui compte pour un étudiant sénégalais."
  }
];
