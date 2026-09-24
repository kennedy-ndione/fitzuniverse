// ============================================================
// FitzUniverse — Lot 86 : trois notes de frais roumaines remises aux
// règles du catalogue (2026-09-24, soir)
//
// POURQUOI
// `npm test` après les lots 84-85, test « fiche 6 » : une fiche qui a
// désormais un bloc `admission` voit ses textes contrôlés (capitales,
// tiret long, notes de travail). Les deux fiches de Bucarest, écrites le
// 2026-09-13, avaient des notes sans accents, en capitales (« NON-UE »,
// « ATTENTION »), avec un tiret long ; celle de Gheorghe-Asachi (lot 84)
// disait « pages lues ».
//
// ET UNE FAUTE DE FOND, trouvée en relisant : l'Université de Bucarest
// portait en fraisScolarite une grille licence/master de 2022-2023.
// Règle du catalogue : une grille de plus de deux ans reste hors de
// fraisScolarite. Elle passe dans admission.coutIndicatif, datée ; seul
// le doctorat 2026-2027 (isds.unibuc.ro, relu au navigateur ce soir)
// reste un prix vérifié. La Roumanie garde 20 coûts vérifiés.
//
// `attendu` porte les objets COMPLETS lus dans l'export de 22 h 41.
// ============================================================

export const PATCHES = [
  {
    "collection": "universities",
    "id": "politehnica-bucuresti-bucarest",
    "motif": "note des frais réécrite sans capitales ni notes de travail, mêmes faits et même source (fils.upb.ro, 2026-09-08), règle « fiche 6 »",
    "attendu": {
      "fraisScolarite": {
        "source": "https://fils.upb.ro/ro/2026/09/08/taxe-pentru-anul-universitar-2026-2027/",
        "verifieLe": "2026-09-13",
        "note": "Bareme publie le 8 septembre 2026 par la Faculte d'ingenierie en langues etrangeres, rubrique « frais de scolarite pour etudiants NON-UE », payables dans les deux premieres semaines de l'annee universitaire. LICENCE : 2 600 EUR en 1re annee, puis 2 430 EUR en 2e, 3e et 4e. MASTER : 2 700 EUR en 1re annee, 2 430 en 2e. Repetition d'une matiere : 100 EUR pour un non-UE. L'ecart avec le tarif national est enorme : un Roumain ou un ressortissant de l'UE paie 7 500 RON en 1re annee de licence et 8 500 RON en master, soit environ trois fois moins. DOCTORAT : 3 800 EUR par annee calendaire en technologie, agronomie, sciences et mathematiques, 3 200 EUR en sciences humaines, psychologie et economie ; l'annee preparatoire de langue roumaine coute 2 610 EUR en sciences, 3 330 en architecture, 2 160 en sciences humaines. AUCUN dispositif pays en developpement. Montants retenus : la PREMIERE annee, celle qui compte pour un nouvel arrivant ; les suivantes retombent a 2 430 EUR. Non lus : les baremes des autres facultes de l'universite, qui peuvent varier.",
        "licence": {
          "montant": 2600,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 2700,
          "devise": "EUR",
          "periode": "an"
        },
        "doctorat": {
          "montant": 3800,
          "devise": "EUR",
          "periode": "an"
        }
      }
    },
    "champs": {
      "fraisScolarite": {
        "source": "https://fils.upb.ro/ro/2026/09/08/taxe-pentru-anul-universitar-2026-2027/",
        "verifieLe": "2026-09-13",
        "note": "Barème publié le 8 septembre 2026 par la Faculté d'ingénierie en langues étrangères, rubrique des frais des étudiants hors Union européenne, payables dans les deux premières semaines de l'année universitaire. Licence : 2 600 € en 1re année, puis 2 430 € en 2e, 3e et 4e. Master : 2 700 € en 1re année, 2 430 € en 2e. Répétition d'une matière : 100 €. Un Roumain ou un ressortissant de l'Union européenne paie 7 500 lei en 1re année de licence et 8 500 lei en master, soit environ trois fois moins. Doctorat : 3 800 € par année civile en technologie, agronomie, sciences et mathématiques, 3 200 € en sciences humaines, psychologie et économie. Année préparatoire de roumain : 2 610 € en sciences, 3 330 € en architecture, 2 160 € en sciences humaines. Pas de tarif réduit pour les pays en développement. Montants retenus : ceux de la 1re année, celle d'un nouvel arrivant. Les barèmes des autres facultés ne sont pas publiés au même endroit et peuvent varier.",
        "licence": {
          "montant": 2600,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 2700,
          "devise": "EUR",
          "periode": "an"
        },
        "doctorat": {
          "montant": 3800,
          "devise": "EUR",
          "periode": "an"
        }
      }
    }
  },
  {
    "collection": "universities",
    "id": "universite-de-bucarest-bucarest",
    "motif": "grille licence/master de 2022-2023 sortie de fraisScolarite (plus de deux ans) et dite dans admission.coutIndicatif ; doctorat 2026-2027 relu au navigateur sur isds.unibuc.ro le 2026-09-24",
    "attendu": {
      "fraisScolarite": {
        "source": "https://unibuc.ro/student-ub/regulamente-si-taxe/?lang=en",
        "verifieLe": "2026-09-13",
        "note": "ATTENTION A L'ANNEE. Le seul bareme complet publie par l'universite pour les etudiants hors UE est un PDF de l'annee 2022-2023, toujours en ligne aujourd'hui sur la page officielle des frais ; aucune version plus recente n'a ete trouvee. LICENCE 2022-2023 : 1 980 EUR/an en droit, lettres, philosophie, histoire, journalisme, sociologie et theologie ; 2 100 EUR en administration des affaires ; 2 430 EUR en biologie, chimie, physique, geographie, geologie, mathematiques et informatique. MASTER : meme grille, avec 2 200 EUR en langues etrangeres, 2 500 en psychologie, sciences politiques et philosophie, 3 000 pour le MBA. DOCTORAT : le PDF 2022-2023 indique 3 400 EUR/an, mais l'ecole doctorale interdisciplinaire publie un tarif A JOUR pour 2026-2027 de 3 900 EUR/an pour les hors UE, plus 400 EUR de frais d'admission — c'est ce chiffre recent qui est retenu. Les frais hors UE se paient d'avance pour l'annee entiere, le montant exact figurant sur la lettre d'acceptation. Montants retenus en licence et master : 1 980 EUR, valeur la plus frequente de la grille officielle, a majorer d'environ 450 EUR en filiere scientifique — CHIFFRES 2022-2023 A RECONFIRMER aupres de la faculte visee.",
        "licence": {
          "montant": 1980,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 1980,
          "devise": "EUR",
          "periode": "an"
        },
        "doctorat": {
          "montant": 3900,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "admission": {
        "procedure": "Vous préparez les documents, en scans PDF couleur, et les déposez sur la plateforme d'admission. La commission évalue le dossier ; selon le programme, un examen ou un entretien peut être demandé. Les candidats retenus sont proposés au ministère roumain de l'Éducation, qui peut délivrer ou refuser la lettre d'acceptation, quelle que soit la décision de l'université. Vous demandez ensuite vous-même le visa d'études.",
        "conditions": "Il faut un diplôme équivalant à une moyenne d'au moins 7 sur 10 dans le barème roumain. Les documents portent l'apostille de La Haye, ou sont surlégalisés si votre pays n'est pas partie à la convention.",
        "calendrier": "Les candidatures de la rentrée 2026 sont closes. Le calendrier de la rentrée 2027 n'est pas encore publié.",
        "langue": "Programmes en anglais : niveau B1. Pour un programme en roumain, sans certificat de roumain ni études antérieures en roumain, il faut d'abord suivre l'année préparatoire de langue roumaine.",
        "fraisDossier": "100 €, non remboursables.",
        "sources": [
          "https://international.unibuc.ro/home-3/admission-2026-2/study-cycles/"
        ],
        "verifieLe": "2026-09-24"
      }
    },
    "champs": {
      "fraisScolarite": {
        "source": "https://isds.unibuc.ro/interdisciplinary-research-training-groups/fees/",
        "verifieLe": "2026-09-24",
        "note": "Seul tarif à jour publié pour les étudiants hors Union européenne : le doctorat de l'école doctorale interdisciplinaire, 3 900 € par an en 2026-2027, payés d'avance pour toute l'année, plus 400 lei d'admission. Le montant et le compte figurent sur la lettre d'acceptation. Pour la licence et le master, la dernière grille publiée date de 2022-2023 : elle n'est pas reprise ici comme prix vérifié, et figure dans la démarche comme coût indicatif.",
        "doctorat": {
          "montant": 3900,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "admission": {
        "procedure": "Vous préparez les documents, en scans PDF couleur, et les déposez sur la plateforme d'admission. La commission évalue le dossier ; selon le programme, un examen ou un entretien peut être demandé. Les candidats retenus sont proposés au ministère roumain de l'Éducation, qui peut délivrer ou refuser la lettre d'acceptation, quelle que soit la décision de l'université. Vous demandez ensuite vous-même le visa d'études.",
        "conditions": "Il faut un diplôme équivalant à une moyenne d'au moins 7 sur 10 dans le barème roumain. Les documents portent l'apostille de La Haye, ou sont surlégalisés si votre pays n'est pas partie à la convention.",
        "calendrier": "Les candidatures de la rentrée 2026 sont closes. Le calendrier de la rentrée 2027 n'est pas encore publié.",
        "langue": "Programmes en anglais : niveau B1. Pour un programme en roumain, sans certificat de roumain ni études antérieures en roumain, il faut d'abord suivre l'année préparatoire de langue roumaine.",
        "fraisDossier": "100 €, non remboursables.",
        "sources": [
          "https://international.unibuc.ro/home-3/admission-2026-2/study-cycles/",
          "https://unibuc.ro/student-ub/regulamente-si-taxe/?lang=en",
          "https://isds.unibuc.ro/interdisciplinary-research-training-groups/fees/"
        ],
        "verifieLe": "2026-09-24",
        "coutIndicatif": "La grille 2022-2023, la dernière publiée pour la licence et le master, annonçait 1 980 € par an en droit, lettres, philosophie, histoire, journalisme, sociologie et théologie, 2 100 € en administration des affaires, 2 430 € en sciences et informatique ; en master, jusqu'à 2 500 € en psychologie et sciences politiques et 3 000 € pour le MBA. Demandez le tarif à jour à la faculté visée : il figure sur la lettre d'acceptation."
      }
    }
  },
  {
    "collection": "universities",
    "id": "universite-technique-gheorghe-asachi-iasi",
    "motif": "note des frais : « pages lues » (note de travail) remplacé, règle « fiche 6 »",
    "attendu": {
      "fraisScolarite": {
        "note": "Frais 2026-2027 des étudiants hors Union européenne, programmes en anglais, par an. Licence : 3 000 € en génie civil, 3 500 € en technologies et systèmes de télécommunications, 2 430 € en design industriel. Master : 2 430 € à 4 000 €, dont 4 000 € en intelligence artificielle. Les frais des programmes en roumain ne sont pas publiés sur les pages lues. La première année se paie en entier. Montant retenu : 3 000 € en licence et 3 500 € en master, la médiane des programmes en anglais.",
        "licence": {
          "montant": 3000,
          "devise": "EUR",
          "periode": "an"
        },
        "verifieLe": "2026-09-24",
        "source": "https://study.tuiasi.ro/fees/",
        "master": {
          "montant": 3500,
          "devise": "EUR",
          "periode": "an"
        }
      }
    },
    "champs": {
      "fraisScolarite": {
        "note": "Frais 2026-2027 des étudiants hors Union européenne, programmes en anglais, par an. Licence : 3 000 € en génie civil, 3 500 € en technologies et systèmes de télécommunications, 2 430 € en design industriel. Master : 2 430 € à 4 000 €, dont 4 000 € en intelligence artificielle. Les frais des programmes en roumain ne sont pas publiés sur le site de l'université. La première année se paie en entier. Montant retenu : 3 000 € en licence et 3 500 € en master, la médiane des programmes en anglais.",
        "licence": {
          "montant": 3000,
          "devise": "EUR",
          "periode": "an"
        },
        "verifieLe": "2026-09-24",
        "source": "https://study.tuiasi.ro/fees/",
        "master": {
          "montant": 3500,
          "devise": "EUR",
          "periode": "an"
        }
      }
    }
  }
];
