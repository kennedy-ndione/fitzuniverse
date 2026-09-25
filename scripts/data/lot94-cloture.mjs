// ============================================================
// FitzUniverse — Lot 94 : CLÔTURE des fiches des 9 pays de préinscription
// Recherche du 2026-09-25, sources officielles uniquement (sites des
// établissements, amci.ma, canada.ca, ouac.on.ca).
// Export de référence : 2026-09-25T12:48:43.124Z
//
// POURQUOI
// Charles, le 2026-09-25 : compléter les fiches manquantes du Maroc (5)
// et du Canada (3), traiter en même temps les prix manquants (UIC, Ege,
// SEGi), et retirer Sichuan University du catalogue.
//
// CE QUE LE LOT FAIT
//   - 8 fiches complétées (bloc admission, province, statut, langue,
//     numéro EED pour le Canada) : Hassan II, Mohammed V, Cadi Ayyad
//     (voie AMCI), Al Akhawayn, UM6P (candidature directe), McGill,
//     UBC, Toronto.
//   - Al Akhawayn : l'université se dit « établissement public autonome
//     à but non lucratif, créé par dahir » ; la fiche disait « privée ».
//     Et le master était calculé sur 16 crédits par semestre alors que
//     la charge normale publiée est de 12 : 134 400 -> 100 800 MAD.
//   - Ege : grilles 2026-2027 publiées (le plancher de licence est 770 $,
//     pas 1 000 $) ; la fiche passe de « coût indicatif » à un vrai prix.
//   - UIC : pas de grille de licence publiée ; le coût indicatif ajoute
//     les tarifs 2026-2027 de santé. SEGi : relu, toujours rien de publié,
//     fiche inchangée.
//   - Sichuan University retirée : 3 programmes puis l'université
//     (forme SUPPRESSIONS, ajoutée au runner le même jour).
//
// MÉTHODE
// Quatre recherches parallèles (WebFetch) ont produit un brouillon ; les
// faits clés ont été RELUS dans le Chrome de Charles le 2026-09-25 :
// grilles PDF d'Ege (pdf.js), pages AMCI des trois universités publiques,
// frais et tests d'Al Akhawayn, FAQ et calendrier de la FGSES, numéros EED
// dans la liste JSON de canada.ca, frais, dates et tests de McGill, UBC et
// Toronto. Retirés faute de relecture : dates de la plateforme de
// préinscription de Cadi Ayyad, adresse du bureau international de Cadi
// Ayyad, seuils Cambridge et CAEL.
// ============================================================

export const PATCHES = [
  {
    "collection": "universities",
    "id": "universite-hassan-ii-casablanca",
    "motif": "bloc admission par la voie AMCI (texte de l'université relu), province, statut juridique (dahir de 1975), le 2026-09-25",
    "attendu": {
      "province": undefined,
      "reconnaissance": undefined,
      "admission": undefined
    },
    "champs": {
      "province": "Casablanca-Settat",
      "reconnaissance": "Université publique marocaine, créée le 26 février 1975 en application du dahir portant loi n° 1-75-102 du 25 février 1975. Sa forme actuelle date de la fusion de 2014 avec l'université Hassan II de Mohammedia.",
      "admission": {
        "procedure": "Vous ne candidatez pas auprès de l'université. La candidature est soumise par voie diplomatique à l'AMCI, selon les modalités et les délais qu'elle communique chaque année aux ambassades. Seuls les candidats officiellement proposés à l'AMCI, et dont le dossier est accepté par le ministère et l'établissement, peuvent s'inscrire. Depuis septembre 2024, le Bureau de l'étudiant international de l'université accompagne les étudiants venus de l'étranger, à la Maison de l'Université, route d'El Jadida, km 7, à Casablanca.",
        "conditions": "L'université compte notamment une faculté de médecine et de pharmacie, des facultés des sciences, de droit et d'économie, de lettres, une ENCG et une EST à Casablanca, ainsi qu'une faculté des sciences et techniques et l'ENSET à Mohammedia. Le répertoire de l'AMCI dit quelles filières sont ouvertes aux étudiants étrangers.",
        "calendrier": "L'université ne publie pas de dates propres aux étudiants étrangers pour 2026-2027. La date qui compte d'abord est celle de l'ambassade ou de l'autorité de votre pays, qui transmet les dossiers à l'AMCI.",
        "langue": "L'université ne publie pas de test de langue. Selon l'AMCI, le français est la langue véhiculaire des établissements publics d'enseignement supérieur marocains, et son centre de langue propose aux étudiants non francophones une mise à niveau, validée par une attestation de réussite en fin d'année. La langue peut varier d'une filière à l'autre : vérifiez celle de la filière que vous visez.",
        "fraisDossier": "Aucun frais de dossier n'est publié par l'université.",
        "sources": [
          "https://www.univh2c.ma/fr/page/etudiant-international",
          "https://www.univh2c.ma/en/page/uh2c-history",
          "https://www.univh2c.ma/en/page/institutions",
          "https://www.amci.ma/sites/default/files/2025-07/repertoire-des-etablissements-2025-2026.pdf",
          "https://www.amci.ma/cooperation-academique"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "universite-mohammed-v-rabat",
    "motif": "bloc admission par la voie AMCI (texte de l'université relu), province, statut juridique, le 2026-09-25",
    "attendu": {
      "province": undefined,
      "reconnaissance": undefined,
      "admission": undefined
    },
    "champs": {
      "province": "Rabat-Salé-Kénitra",
      "reconnaissance": "Université publique marocaine, dont l'origine remonte à 1957.",
      "admission": {
        "procedure": "Vous ne candidatez pas auprès de l'université. La candidature est soumise par voie diplomatique à l'AMCI, dans les délais qu'elle communique chaque année. L'AMCI sélectionne les dossiers selon ses quotas et ses critères, puis les transmet au ministère de l'Enseignement supérieur. Vous vous inscrivez ensuite sur présentation de l'autorisation d'inscription électronique délivrée par le ministère. En DUT, en première année de licence et en doctorat de médecine, cette autorisation vient directement du ministère ; pour les autres cycles, elle suppose l'avis favorable de l'établissement.",
        "conditions": "L'université réunit notamment à Rabat une faculté de médecine et de pharmacie, une faculté des sciences, des facultés de droit et d'économie et une faculté des lettres, et à Salé une faculté de droit et une EST. Le répertoire de l'AMCI dit quelles filières sont ouvertes aux étudiants étrangers.",
        "calendrier": "L'université ne publie pas de dates propres aux étudiants étrangers pour 2026-2027. La date qui compte d'abord est celle de l'ambassade ou de l'autorité de votre pays, qui transmet les dossiers à l'AMCI.",
        "langue": "L'université ne publie pas de test de langue. Selon l'AMCI, le français est la langue véhiculaire des établissements publics d'enseignement supérieur marocains, et son centre de langue propose aux étudiants non francophones une mise à niveau, validée par une attestation de réussite en fin d'année. La langue peut varier d'une filière à l'autre : vérifiez celle de la filière que vous visez.",
        "fraisDossier": "Aucun frais de dossier n'est publié par l'université.",
        "sources": [
          "https://www.um5.ac.ma/um5/inscription-des-etudiants-internationaux",
          "https://www.um5.ac.ma/um5/etudiants-etrangers",
          "https://www.um5.ac.ma/um5/histoire-de-lum5",
          "https://www.amci.ma/sites/default/files/2025-07/repertoire-des-etablissements-2025-2026.pdf",
          "https://www.amci.ma/cooperation-academique"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "universite-cadi-ayyad-marrakech",
    "motif": "bloc admission par la voie AMCI (texte de l'université relu), province, statut juridique, le 2026-09-25",
    "attendu": {
      "province": undefined,
      "reconnaissance": undefined,
      "admission": undefined
    },
    "champs": {
      "province": "Marrakech-Safi",
      "reconnaissance": "Université publique marocaine, créée en 1978.",
      "admission": {
        "procedure": "Vous ne candidatez pas auprès de l'université. Les étudiants étrangers présentent leur candidature par voie diplomatique, dans le cadre de la coopération entre le Maroc et leur pays, et l'AMCI transmet les dossiers au ministère de l'Enseignement supérieur : tout dossier que l'AMCI n'a pas transmis n'est pas pris en considération. Vous vous inscrivez ensuite dans l'établissement sur présentation de l'autorisation d'inscription délivrée par le ministère.",
        "conditions": "L'université réunit notamment à Marrakech une faculté de médecine et de pharmacie, une faculté des sciences, une faculté des sciences et techniques, des facultés de droit et de lettres et une ENCG, ainsi que des EST à Safi et à Essaouira. Le répertoire de l'AMCI dit quelles filières sont ouvertes aux étudiants étrangers.",
        "calendrier": "L'université ne publie pas de dates propres aux étudiants étrangers pour 2026-2027. La date qui compte d'abord est celle de l'ambassade ou de l'autorité de votre pays, qui transmet les dossiers à l'AMCI.",
        "langue": "L'université ne publie pas de test de langue. Selon l'AMCI, le français est la langue véhiculaire des établissements publics d'enseignement supérieur marocains, et son centre de langue propose aux étudiants non francophones une mise à niveau, validée par une attestation de réussite en fin d'année. La langue peut varier d'une filière à l'autre : vérifiez celle de la filière que vous visez.",
        "fraisDossier": "Aucun frais de dossier n'est publié par l'université.",
        "sources": [
          "https://www.uca.ma/fr/page/agence-marocaine-de-la-cooperation-internationale-amci",
          "https://www.uca.ma/en/page/uca-at-a-glance",
          "https://www.uca.ma/fr/page/historique",
          "https://www.amci.ma/sites/default/files/2025-07/repertoire-des-etablissements-2025-2026.pdf",
          "https://www.amci.ma/cooperation-academique"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "al-akhawayn-university-ifrane",
    "motif": "bloc admission (candidature directe), province, statut juridique : établissement public autonome et non privé, description et repère corrigés ; frais : note réécrite, master corrigé à 12 crédits par semestre (134 400 -> 100 800 MAD), le 2026-09-25",
    "attendu": {
      "province": undefined,
      "ranking": "Université privée de modèle américain",
      "description": "Université privée située dans le Moyen Atlas. Elle suit le modèle américain : système de crédits et formation générale de type liberal arts. Tous les cours sont en anglais.",
      "reconnaissance": undefined,
      "langueEnseignement": undefined,
      "fraisScolarite": {
        "source": "https://aui.ma/admission-aid/international/tuition-and-fees",
        "verifieLe": "2026-09-13",
        "note": "Université privée marocaine, facturation au crédit. Étudiant INTERNATIONAL : 3 360 MAD par crédit en licence, 4 200 MAD en master (contre 2 100 MAD pour un Marocain en licence). Charge normale annoncée : 16 à 17 crédits par semestre, soit environ 53 760 à 57 120 MAD par semestre et 107 520 à 114 240 MAD par an en licence. Montant retenu : 16 crédits par semestre, deux semestres. À l'admission : 10 000 MAD de confirmation, dont 5 000 non remboursables. Logement : 17 811 MAD/semestre en chambre simple. Assurance 550 MAD/semestre.",
        "licence": {
          "montant": 107520,
          "devise": "MAD",
          "periode": "an"
        },
        "master": {
          "montant": 134400,
          "devise": "MAD",
          "periode": "an"
        }
      },
      "admission": undefined
    },
    "champs": {
      "province": "Fès-Meknès",
      "ranking": "Publique autonome, de modèle américain",
      "description": "Université publique autonome à but non lucratif, fondée en 1993 à Ifrane, dans le Moyen Atlas. Elle suit le modèle américain : système de crédits et formation générale de type liberal arts. Tous les cours sont en anglais.",
      "reconnaissance": "Établissement public autonome à but non lucratif, créé par dahir en 1993 et ouvert aux étudiants en janvier 1995. L'université se dit pleinement reconnue par l'État marocain ; elle est aussi accréditée par la NECHE, un organisme américain, depuis 2017, avec un renouvellement pour 2022-2032.",
      "langueEnseignement": "Anglais",
      "fraisScolarite": {
        "source": "https://aui.ma/admission-aid/international/tuition-and-fees",
        "verifieLe": "2026-09-25",
        "note": "Facturation au crédit, tarif des étudiants internationaux : 3 360 MAD par crédit en licence et 4 200 MAD en master. Charge normale : 15 à 17 crédits par semestre en licence, 12 en master. Montants retenus : 16 crédits par semestre en licence, soit 107 520 MAD par an, et 12 crédits en master, soit 100 800 MAD par an. À l'admission, un dépôt de confirmation de 10 000 MAD est demandé, dont 5 000 non remboursables. S'ajoutent le logement sur le campus, dès 17 811 MAD en chambre simple, et une assurance de 550 MAD par semestre. La page ne donne pas l'année de la grille et prévient que les tarifs peuvent changer chaque année.",
        "licence": {
          "montant": 107520,
          "devise": "MAD",
          "periode": "an"
        },
        "master": {
          "montant": 100800,
          "devise": "MAD",
          "periode": "an"
        }
      },
      "admission": {
        "procedure": "Candidature en ligne depuis votre pays, sur le formulaire de l'université, où vous déposez les pièces du dossier. Le dossier scolaire est étudié, puis vous passez un entretien, en ligne pour les candidats internationaux. Un bon score au SAT vous dispense du test d'admission de l'université ; les candidats internationaux aux très bons résultats peuvent être admis directement. Une fois admis, vous confirmez votre place par un dépôt de 10 000 MAD. En master, le dossier comprend le diplôme de licence, les relevés, des lettres de recommandation, un essai et un CV.",
        "conditions": "Licence : diplôme de fin d'études secondaires, avec les relevés de notes et une traduction certifiée en anglais s'ils ne sont ni en anglais, ni en arabe, ni en français. Le SAT dispense du test d'admission à partir de 1 340 points pour un non-anglophone, dont au moins 500 en mathématiques. Master : une licence d'un établissement reconnu, avec une moyenne de niveau B, et selon le programme le GRE ou le GMAT.",
        "calendrier": "Deux rentrées par an, en automne et au printemps. Aucune date limite n'est publiée pour 2027. Vos scores de TOEFL doivent parvenir avant le 30 juin pour l'automne et avant le 30 novembre pour le printemps.",
        "langue": "Le TOEFL ou l'IELTS est exigé si l'anglais n'est pas votre langue maternelle. En licence : TOEFL 530 (iBT 71), avec au moins 4,5 en expression écrite (iBT 19), ou 5,5 en expression écrite à l'IELTS. En master : TOEFL 550 (iBT 79). Avec un score plus bas, vous pouvez commencer par le centre de langues de l'université.",
        "fraisDossier": "800 MAD pour un candidat international qui réside hors du Maroc, 500 MAD s'il a résidé au Maroc ces cinq dernières années.",
        "sources": [
          "https://aui.ma/admission-aid/international/freshmen",
          "https://aui.ma/admission-aid/international/tests",
          "https://aui.ma/admission-aid/international/tuition-and-fees",
          "https://aui.ma/admission-aid/graduates/general-admission-conditions",
          "https://aui.ma/about-aui",
          "https://aui.ma/accreditation-at-aui"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "universite-mohammed-vi-polytechnique-benguerir",
    "motif": "bloc admission (FGSES), province, statut juridique (décret 2.18.962), langue ; note de frais réécrite, montants relus et inchangés, le 2026-09-25",
    "attendu": {
      "province": undefined,
      "reconnaissance": undefined,
      "langueEnseignement": undefined,
      "fraisScolarite": {
        "source": "https://www.fgses-um6p.ma/scholarships-financial-aid",
        "verifieLe": "2026-09-13",
        "note": "Grille officielle 2025-2026 de la Faculte de gouvernance, sciences economiques et sociales, composante de l'UM6P. Tarif IDENTIQUE pour les Marocains et les etrangers : le texte precise que le systeme progressif s'applique a tous. Montants ANNUELS. S'ajoutent des frais d'inscription fixes payes en debut de chaque annee : 5 000 MAD en licence, 7 500 en master, 10 000 en doctorat, NON compris ci-dessous. S'ajoutent aussi le logement en residence (1 900 a 2 300 MAD/mois en licence et master, 2 500 MAD/mois en studio doctorant) et la restauration (repas subventionnes de 15 a 25 MAD). Paiement possible en 4 tranches. DOCTORAT : pas de frais de scolarite du tout, et les doctorants percoivent une allocation de recherche de 10 000 MAD/mois. ATTENTION : les tarifs varient d'une ecole a l'autre au sein de l'UM6P — l'Africa Business School affiche un master en management a 78 750 MAD/an. Montants retenus : la grille de la FGSES, seule grille complete des trois niveaux lue sur un domaine officiel.",
        "licence": {
          "montant": 65000,
          "devise": "MAD",
          "periode": "an"
        },
        "master": {
          "montant": 72500,
          "devise": "MAD",
          "periode": "an"
        },
        "doctorat": {
          "montant": 0,
          "devise": "MAD",
          "periode": "an"
        }
      },
      "admission": undefined
    },
    "champs": {
      "province": "Marrakech-Safi",
      "reconnaissance": "Université à but non lucratif créée dans le cadre d'un partenariat avec l'État et placée sous l'autorité pédagogique du ministère de l'Enseignement supérieur. Reconnue par l'État par le décret n° 2.18.962, obtenu le 25 septembre 2020, avec effet depuis l'année universitaire 2016-2017 : ses diplômes sont équivalents aux diplômes d'État.",
      "langueEnseignement": "Français et anglais, selon le programme",
      "fraisScolarite": {
        "source": "https://www.fgses-um6p.ma/scholarships-financial-aid",
        "verifieLe": "2026-09-25",
        "note": "Grille officielle 2025-2026 de la Faculté de gouvernance, sciences économiques et sociales, la FGSES, composante de l'UM6P ; aucune grille 2026-2027 n'est encore publiée. Le même barème s'applique aux étudiants marocains et étrangers. Frais annuels : 65 000 MAD en licence et 72 500 MAD en master, avec une bourse possible jusqu'à 85 % selon les revenus de la famille. Le doctorat est sans frais de scolarité et donne droit à une allocation de recherche de 10 000 MAD par mois. S'ajoutent des frais d'inscription au début de chaque année : 5 000 MAD en licence, 7 500 MAD en master, 10 000 MAD en doctorat. Logement en résidence : de 1 900 à 2 300 MAD par mois. Paiement possible en quatre fois. Les tarifs varient d'une école à l'autre de l'UM6P : montants retenus, ceux de la FGSES.",
        "licence": {
          "montant": 65000,
          "devise": "MAD",
          "periode": "an"
        },
        "master": {
          "montant": 72500,
          "devise": "MAD",
          "periode": "an"
        },
        "doctorat": {
          "montant": 0,
          "devise": "MAD",
          "periode": "an"
        }
      },
      "admission": {
        "procedure": "Candidature en ligne, programme par programme, sur la plateforme de l'école concernée. Pour les licences de la FGSES, vous créez votre candidature sur admission.fgses-um6p.ma, saisissez vos notes de lycée, vos motivations et vos activités, puis validez et payez les frais. La commission des admissions étudie le dossier, puis vous passez un entretien oral, sur le campus ou en visioconférence si vous vivez à l'étranger. L'admission définitive intervient après les résultats du baccalauréat. Le master suit les mêmes étapes, sur la base des notes de licence.",
        "conditions": "Licence : baccalauréat. La FGSES accepte toutes les filières du baccalauréat marocain et toutes les spécialités des diplômes étrangers reconnus équivalents ; la sélection tient compte des notes de lycée, de l'expérience et de l'engagement personnel. Master : une licence, avec les notes des six semestres.",
        "calendrier": "Licence à la FGSES, rentrée 2027 : candidatures ouvertes à partir du 15 décembre, dépôt jusqu'au 15 mars 2027 à 23 h 59, entretiens les 10 et 11 puis les 17 et 18 avril 2027, premiers résultats à partir du 3 mai 2027. Les autres écoles de l'UM6P ont leur propre calendrier.",
        "langue": "Aucun test de langue n'est publié. Les cours de la FGSES sont surtout en français et en anglais, avec certains modules en arabe ; selon le programme, l'UM6P enseigne en français, en anglais ou dans les deux langues.",
        "fraisDossier": "500 MAD de frais de candidature à la FGSES, en licence comme en master, payés à la validation de la candidature en ligne.",
        "sources": [
          "https://www.fgses-um6p.ma/bachelors-programs",
          "https://www.fgses-um6p.ma/masters-programs",
          "https://www.fgses-um6p.ma/faq",
          "https://um6p.ma/fr/inscription/admissions"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "mcgill-university-montreal",
    "motif": "bloc admission (demande McGill, CAQ, LAP), province, numéro EED, langue d'enseignement, le 2026-09-25",
    "attendu": {
      "province": undefined,
      "numeroEED": undefined,
      "langueEnseignement": undefined,
      "admission": undefined
    },
    "champs": {
      "province": "Québec",
      "numeroEED": "O19359011033",
      "langueEnseignement": "Anglais",
      "admission": {
        "procedure": "Déposez la demande en ligne de McGill, ouverte à partir du 1er octobre. Une fois admis, demandez le certificat d'acceptation du Québec, le CAQ, puis le permis d'études du Canada. Au premier cycle, le CAQ tient lieu de lettre d'attestation provinciale, la LAP, s'il porte la mention sur la part du Québec dans la répartition des permis d'études ; à la maîtrise et au doctorat, la LAP n'est plus exigée depuis le 1er janvier 2026, mais le CAQ reste obligatoire au Québec.",
        "conditions": "Le baccalauréat du Sénégal figure dans la liste des diplômes que McGill accepte. Il doit être un diplôme général qui prépare à l'université : les filières techniques ou professionnelles ne sont normalement pas admissibles. Pour le baccalauréat français, le dossier est étudié sur les bulletins de première et de terminale, le bac doit être obtenu au premier groupe, et les spécialités exigées dépendent du programme, par exemple mathématiques et deux sciences en Sciences.",
        "calendrier": "Pour les candidats hors Canada : demande avant le 15 janvier, pièces justificatives avant le 1er mars, demande de bourse d'entrée avant le 21 janvier.",
        "langue": "L'enseignement se fait en anglais. Sauf si vous avez vécu et étudié au moins quatre ans dans un pays dont l'anglais est la langue principale, un test est demandé : IELTS Academic 6,5 avec au moins 6,0 par épreuve ; TOEFL iBT 90 avec 21 par section, ou 4,5 sur la nouvelle échelle ; Duolingo 125. La gestion et le B.Ed. TESL demandent davantage, par exemple Duolingo 130.",
        "fraisDossier": "140,16 $ non remboursables. Une deuxième demande, pour le même trimestre et le même niveau, est gratuite.",
        "sources": [
          "https://www.mcgill.ca/undergraduate-admissions/apply",
          "https://www.mcgill.ca/undergraduate-admissions/apply/requirements/international/other",
          "https://www.mcgill.ca/undergraduate-admissions/apply/requirements/international/fb",
          "https://www.mcgill.ca/undergraduate-admissions/apply/english-proficiency",
          "https://www.mcgill.ca/internationalstudents/immigration-documents/documents/study-permit-application-guide/how-apply",
          "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/get-documents/provincial-attestation-letter.html",
          "https://www.canada.ca/fr/immigration-refugies-citoyennete/services/etudier-canada/permis-etudes/preparer/liste-etablissements-enseignement-designes.html"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "university-of-british-columbia-vancouver",
    "motif": "bloc admission (EducationPlannerBC, LAP), province, numéro EED, langue d'enseignement, le 2026-09-25",
    "attendu": {
      "province": undefined,
      "numeroEED": undefined,
      "langueEnseignement": undefined,
      "admission": undefined
    },
    "champs": {
      "province": "Colombie-Britannique",
      "numeroEED": "O19330231062",
      "langueEnseignement": "Anglais",
      "admission": {
        "procedure": "Déposez la demande en ligne de UBC, qui passe par le site EducationPlannerBC ; vous pouvez indiquer un premier et un second choix de diplôme. Une fois admis, demandez le permis d'études du Canada. Selon canada.ca, la lettre d'attestation provinciale, la LAP, est exigée pour le permis d'études au premier cycle ; depuis le 1er janvier 2026, les étudiants à la maîtrise ou au doctorat d'un établissement public en sont dispensés.",
        "conditions": "Pour le système français, UBC demande le baccalauréat général ou le baccalauréat français international ; le bac technologique est étudié au cas par cas et le bac professionnel ne permet pas l'admission. Le Sénégal ne figure pas dans la liste de pays de UBC : pour un bac sénégalais, l'exigence de base est la fin d'un cycle secondaire qui prépare à l'université. Chaque diplôme a ensuite ses propres matières exigées.",
        "calendrier": "Pour la rentrée de septembre 2027 : la demande ouvre début octobre 2026. Déposez-la avant le 15 novembre 2026 pour être étudié pour les bourses d'entrée internationales ; la date limite est le 15 janvier 2027. Les notes de fin d'année sont attendues en mars 2027.",
        "langue": "L'enseignement se fait en anglais. Tests acceptés : IELTS Academic 6,5 sans épreuve sous 6,0 ; TOEFL iBT 90 (lecture 22, écoute 22, écriture 21, oral 21) ou 4,5 sur la nouvelle échelle ; Duolingo 125 ; PTE Academic 65. Pas de test après quatre années consécutives d'études à temps plein en anglais au Canada ou dans un pays anglophone.",
        "fraisDossier": "173,25 $ non remboursables pour un candidat international qui a besoin d'un permis d'études.",
        "sources": [
          "https://you.ubc.ca/applying-ubc/how-to-apply/application/",
          "https://you.ubc.ca/applying-ubc/dates-deadlines/",
          "https://you.ubc.ca/applying-ubc/requirements/english-language-competency/",
          "https://you.ubc.ca/applying-ubc/requirements/international-high-schools/",
          "https://vancouver.calendar.ubc.ca/admissions/applicants-following-other-international-secondary-school-curricula",
          "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/get-documents/provincial-attestation-letter.html",
          "https://www.canada.ca/fr/immigration-refugies-citoyennete/services/etudier-canada/permis-etudes/preparer/liste-etablissements-enseignement-designes.html"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "university-of-toronto-toronto",
    "motif": "bloc admission (demande internationale ou formulaire 105 de l'OUAC, LAP), province, numéro EED, langue d'enseignement, le 2026-09-25",
    "attendu": {
      "province": undefined,
      "numeroEED": undefined,
      "langueEnseignement": undefined,
      "admission": undefined
    },
    "champs": {
      "province": "Ontario",
      "numeroEED": "O19332746152",
      "langueEnseignement": "Anglais",
      "admission": {
        "procedure": "Si vous vivez hors du Canada, n'y avez jamais étudié et ne postulez à aucune autre université de l'Ontario, déposez la demande internationale de l'Université de Toronto. Sinon, utilisez le formulaire de premier cycle de l'OUAC, le 105. Vous suivez ensuite votre dossier sur le portail Join U of T. Une fois admis, demandez le permis d'études du Canada. Selon canada.ca, la lettre d'attestation provinciale, la LAP, est exigée pour le permis d'études au premier cycle ; depuis le 1er janvier 2026, les étudiants à la maîtrise ou au doctorat d'un établissement public en sont dispensés.",
        "conditions": "Pour le Sénégal, l'université demande le diplôme de bachelier de l'enseignement du second degré ; pour le système français, le baccalauréat général. Tous les candidats présentent un cours d'anglais de terminale. L'offre conditionnelle se fonde sur les notes de l'année précédente et sur les résultats du trimestre en cours.",
        "calendrier": "Pour une entrée à l'automne 2027 : date conseillée le 7 novembre 2026, date limite le 15 janvier 2027 pour la plupart des programmes. Certains programmes, comme les sciences infirmières ou la radiologie médicale, ont leurs propres dates.",
        "langue": "L'enseignement et les examens se font en anglais. Tests acceptés : IELTS Academic 6,5 sans bande sous 6,0 ; TOEFL iBT 89, ou 4,5 sur la nouvelle échelle ; Duolingo 120 avec 120 en production ; PTE Academic 65 sans partie sous 60. Pas de test après quatre années d'études à temps plein dans une école anglophone au Canada ou dans un pays de langue anglaise.",
        "fraisDossier": "Demande internationale de l'Université de Toronto : 196 $ non remboursables. Formulaire 105 de l'OUAC : 159 $ pour trois choix, puis 51 $ par choix supplémentaire. Certains programmes ajoutent leurs propres frais.",
        "sources": [
          "https://future.utoronto.ca/applications",
          "https://future.utoronto.ca/deadlines",
          "https://future.utoronto.ca/english-language-requirements",
          "https://future.utoronto.ca/requirements-international-high-schools",
          "https://future.utoronto.ca/international-high-school-requirements-country",
          "https://www.ouac.on.ca/guide/105-fees/",
          "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/get-documents/provincial-attestation-letter.html",
          "https://www.canada.ca/fr/immigration-refugies-citoyennete/services/etudier-canada/permis-etudes/preparer/liste-etablissements-enseignement-designes.html"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "ege-university-izmir",
    "motif": "frais : grilles 2026-2027 publiées (licence et master), le coût indicatif de 2023-2024 est retiré, le 2026-09-25",
    "attendu": {
      "fraisScolarite": undefined,
      "admission": {
        "fraisDossier": "Aucuns frais de dossier ne sont mentionnés dans le guide 2026.",
        "sources": [
          "https://oidb.ege.edu.tr/files/oidb/icerik/2026_eng_guide.pdf",
          "https://oidb.ege.edu.tr/eng-124/contributionfees-tuition.html",
          "https://oidb.ege.edu.tr/files/oidb/icerik/tuition_fee_for_foreigners_2023.pdf"
        ],
        "calendrier": "Première période : candidature du 22 au 26 juin 2026 ; résultats le 17 juillet ; inscription du 20 au 24 juillet. Seconde période à partir du 3 août 2026.",
        "verifieLe": "2026-09-25",
        "langue": "Examen de langue étrangère obligatoire pour les filières de langues et de guide touristique : anglais le 10 juillet, allemand le 9 juillet 2026. Sans niveau suffisant, cours de langue avant le programme.",
        "procedure": "Candidature et choix des programmes en ligne pendant la période annoncée, puis dépôt électronique des pièces d'inscription par les admis. Les frais de scolarité sont payés au renouvellement d'inscription.",
        "conditions": "Au moins 200 points à l'un des TR-YÖS de la dernière année, ceux du 19 octobre 2025 et du 12 avril 2026.",
        "coutIndicatif": "Seule grille publiée, pour les inscrits de 2023-2024, par an : 1 000 $ en sciences, lettres, communication et éducation ; 3 000 $ en économie ; 3 450 $ en ingénierie ; 10 000 $ en médecine et dentaire. Elle a plus de deux ans : les montants actuels peuvent être différents."
      }
    },
    "champs": {
      "fraisScolarite": {
        "source": "https://oidb.ege.edu.tr/files/oidb/icerik/2026_2027_onlisans_lisans_katki_payi_ogrenim_ucreti.pdf",
        "verifieLe": "2026-09-25",
        "note": "Grilles officielles 2026-2027, tarif des étudiants admis sur le contingent étranger depuis 2023-2024, par an, payé en deux fois au renouvellement d'inscription. Licence : 770 $ en sciences du sport et en théologie, 1 000 $ en sciences, lettres, éducation et communication, 2 000 $ en architecture et agronomie, 3 000 $ en économie et gestion, 3 450 $ en ingénierie et informatique, 8 450 $ en pharmacie, 10 000 $ en médecine et dentaire. Master et doctorat, selon l'institut : 770 $ en sciences de l'éducation, 900 $ en sciences, 1 000 $ en santé, 1 500 $ en sciences sociales. Les montants sont convertis en livres turques au cours du 17 août 2026, 47,81. Montants retenus : les plus bas, 770 $ en licence comme en master.",
        "licence": {
          "montant": 770,
          "devise": "USD",
          "periode": "an"
        },
        "master": {
          "montant": 770,
          "devise": "USD",
          "periode": "an"
        }
      },
      "admission": {
        "fraisDossier": "Aucuns frais de dossier ne sont mentionnés dans le guide 2026.",
        "sources": [
          "https://oidb.ege.edu.tr/files/oidb/icerik/2026_eng_guide.pdf",
          "https://oidb.ege.edu.tr/tr-18163/katki_paylari-_ogrenim_ucretleri.html",
          "https://oidb.ege.edu.tr/files/oidb/icerik/2026_2027_onlisans_lisans_katki_payi_ogrenim_ucreti.pdf",
          "https://oidb.ege.edu.tr/files/oidb/icerik/2026_2027_lisansustu_katki_payi_ogrenim_ucretleri.pdf"
        ],
        "calendrier": "Première période : candidature du 22 au 26 juin 2026 ; résultats le 17 juillet ; inscription du 20 au 24 juillet. Seconde période à partir du 3 août 2026.",
        "verifieLe": "2026-09-25",
        "langue": "Examen de langue étrangère obligatoire pour les filières de langues et de guide touristique : anglais le 10 juillet, allemand le 9 juillet 2026. Sans niveau suffisant, cours de langue avant le programme.",
        "procedure": "Candidature et choix des programmes en ligne pendant la période annoncée, puis dépôt électronique des pièces d'inscription par les admis. Les frais de scolarité sont payés au renouvellement d'inscription.",
        "conditions": "Au moins 200 points à l'un des TR-YÖS de la dernière année, ceux du 19 octobre 2025 et du 12 avril 2026."
      }
    }
  },
  {
    "collection": "universities",
    "id": "universite-internationale-de-casablanca",
    "motif": "coût indicatif : tarifs 2026-2027 de médecine, pharmacie et dentaire ajoutés ; licence et master toujours sur rendez-vous, le 2026-09-25",
    "attendu": {
      "admission": {
        "fraisDossier": "Test d'admission : 500 DH, payés le jour du test, selon la grille 2022-2023. Frais d'inscription : 5 000 DH.",
        "sources": [
          "https://www.uic.ac.ma/etudiants-internationaux",
          "https://uic.ac.ma/etape-dadmission-formation-initiale/",
          "https://uic.ac.ma/frais-de-scolarite/",
          "https://www.uic.ac.ma/wp-content/uploads/2023/01/Fiche-tarifs-2022-23-UIC-Casablanca-Business-school.pdf",
          "https://www.uic.ac.ma/actualite/luic-obtient-la-reconnaissance-de-letat-et-devient-universite-reconnue-par-letat"
        ],
        "calendrier": "Les inscriptions 2026-2027 sont ouvertes. Les dates des concours sont publiées en image sur le site, sans version texte.",
        "verifieLe": "2026-09-24",
        "langue": "L'université ne publie aucune exigence de test de langue.",
        "procedure": "Candidature en ligne sur la page Formation initiale, puis envoi par courriel du dossier de candidature des étudiants internationaux au service des admissions internationales. Suivent un entretien d'orientation, un test d'admission et un entretien oral, sur place ou à distance, puis la lettre d'admission. Un bureau d'accompagnement des étudiants internationaux aide pour le logement et le transport.",
        "coutIndicatif": "La grille des frais 2026-2027 ne s'ouvre pas en ligne. La dernière grille lisible, celle de 2022-2023 pour l'école de commerce, annonçait 64 000 DH par an en licence de management, 72 000 DH en licence de commerce international, 80 000 DH pour le BBA en anglais et de 72 000 à 82 000 DH en master, plus 5 000 DH d'inscription et 1 100 DH d'assurance médicale. Les tarifs de médecine, d'architecture et d'ingénierie n'y figurent pas. Demandez la grille à jour à l'université avant de décider."
      }
    },
    "champs": {
      "admission": {
        "fraisDossier": "Test d'admission : 500 DH, payés le jour du test, selon la grille 2022-2023. Frais d'inscription : 5 000 DH.",
        "sources": [
          "https://www.uic.ac.ma/etudiants-internationaux",
          "https://uic.ac.ma/etape-dadmission-formation-initiale/",
          "https://uic.ac.ma/frais-de-scolarite/",
          "https://www.uic.ac.ma/wp-content/uploads/2023/01/Fiche-tarifs-2022-23-UIC-Casablanca-Business-school.pdf",
          "https://www.uic.ac.ma/actualite/luic-obtient-la-reconnaissance-de-letat-et-devient-universite-reconnue-par-letat",
          "https://uic.ac.ma/medecine-2/",
          "https://uic.ac.ma/pharmacie/"
        ],
        "calendrier": "Les inscriptions 2026-2027 sont ouvertes. Les dates des concours sont publiées en image sur le site, sans version texte.",
        "verifieLe": "2026-09-25",
        "langue": "L'université ne publie aucune exigence de test de langue.",
        "procedure": "Candidature en ligne sur la page Formation initiale, puis envoi par courriel du dossier de candidature des étudiants internationaux au service des admissions internationales. Suivent un entretien d'orientation, un test d'admission et un entretien oral, sur place ou à distance, puis la lettre d'admission. Un bureau d'accompagnement des étudiants internationaux aide pour le logement et le transport.",
        "coutIndicatif": "Pour 2026-2027, l'université publie seulement les tarifs de ses facultés de santé : médecine 130 000 DH, pharmacie 125 000 DH, médecine dentaire 125 000 DH par an ; l'école d'architecture affiche 75 000 DH par an. Pour les licences et les masters, les pages de programme renvoient à un rendez-vous avec un conseiller. La dernière grille lisible, celle de 2022-2023 pour l'école de commerce, annonçait 64 000 DH par an en licence de management et 72 000 à 82 000 DH en master. Demandez la grille à jour avant de décider."
      }
    }
  }
];

// Retrait de Sichuan University : ses trois programmes d'abord, puis l'université
// (le runner supprime toujours les programmes avant l'université).
export const SUPPRESSIONS = [
  {
    "collection": "programs",
    "id": "scu-bachelor",
    "attendu": {
      "universityId": "sichuan-university-chengdu",
      "scholarshipId": "chinese-government-scholarship",
      "level": "Licence"
    },
    "motif": "retrait décidé par Charles le 2026-09-25 : le portail de candidature de Sichuan University (global.scu.edu.cn) refuse l'accès depuis Dakar, un étudiant ne peut pas y déposer son dossier"
  },
  {
    "collection": "programs",
    "id": "scu-master",
    "attendu": {
      "universityId": "sichuan-university-chengdu",
      "scholarshipId": "chinese-government-scholarship",
      "level": "Master"
    },
    "motif": "retrait décidé par Charles le 2026-09-25 : le portail de candidature de Sichuan University (global.scu.edu.cn) refuse l'accès depuis Dakar, un étudiant ne peut pas y déposer son dossier"
  },
  {
    "collection": "programs",
    "id": "scu-phd",
    "attendu": {
      "universityId": "sichuan-university-chengdu",
      "scholarshipId": "chinese-government-scholarship",
      "level": "Doctorat"
    },
    "motif": "retrait décidé par Charles le 2026-09-25 : le portail de candidature de Sichuan University (global.scu.edu.cn) refuse l'accès depuis Dakar, un étudiant ne peut pas y déposer son dossier"
  },
  {
    "collection": "universities",
    "id": "sichuan-university-chengdu",
    "attendu": {
      "name": "Sichuan University",
      "country": "Chine",
      "city": "Chengdu"
    },
    "motif": "retrait décidé par Charles le 2026-09-25 : le portail de candidature de Sichuan University (global.scu.edu.cn) refuse l'accès depuis Dakar, un étudiant ne peut pas y déposer son dossier"
  }
];

// Aucune université nouvelle, aucune bourse, aucun lien de programme.
export const UNIVERSITIES = [];
export const SCHOLARSHIPS = [];
export const LINKS = [];
