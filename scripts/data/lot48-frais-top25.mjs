/**
 * ============================================================
 * LOT 48-FRAIS-TOP25 — première tranche (12 septembre 2026)
 * ============================================================
 *
 * POURQUOI CES UNIVERSITÉS-LÀ
 * ---------------------------
 * Mesure du 2026-09-12 sur les 360 profils du radar : 140 universités
 * n'avaient aucun frais renseigné, et 25 d'entre elles concentraient
 * 80 % des affichages dans les recommandations. Ce lot en couvre les
 * DIX premières lisibles (Pavia, EPFL, IHEID, Milano, Oxford, Sapienza,
 * Stanford, Toronto, ETH, UCLouvain). Fudan et Humboldt sont remises à
 * Charles (fichier Excel illisible, site refondu) — voir le journal.
 *
 * LA RÈGLE DE PREUVE, la même qu'au lot 45 : chaque montant porte l'URL
 * lue et la date ; un cycle non lu est ABSENT, jamais à zéro ; la note
 * dit pour QUI le montant vaut (un forfait par nationalité n'est pas un
 * prix unique : Pavia, Milano et Sapienza facturent 300-390 €/an aux
 * ressortissants de la plupart des pays africains, jusqu'à 4 550 € à
 * d'autres — le montant retenu est celui de l'audience du site, et la
 * note donne les autres tranches).
 *
 * `politique` suit le vocabulaire fermé de js/frais.js :
 *   systematique      — le tarif réduit s'applique d'office (forfaits
 *                       par pays des universités italiennes) ;
 *   possible_plafonnee — aide sur dossier ou sur mérite, contingentée ;
 *   aucune            — l'établissement le dit lui-même (Toronto).
 *
 * Journal détaillé : scripts/data/journal-frais-top25-2026-09-12.md
 * ============================================================
 */

export const PATCHES = [
  {
    "collection": "universities",
    "id": "universita-di-pavia-pavie",
    "champs": {
      "fraisScolarite": {
        "source": "https://en.unipv.it/sites/sten/files/2026-05/Fla%20Rate%20brackets%20a.y.%202026-27.pdf",
        "verifieLe": "2026-09-12",
        "note": "Forfait (« Flat Rate ») 2026-27 pour les étudiants hors UE, fixé selon la nationalité et le domaine, sans justificatif de revenus. Tranche 1 (classement Banque mondiale, dont Sénégal, Côte d'Ivoire, Cameroun, Mali, Guinée, Bénin, Burkina Faso, Togo, Niger, Maroc, Tunisie, Nigeria, Kenya, Ghana, Égypte…) : 390 €/an, humanités comme sciences. Tranche 2 : 1 020 € (humanités) ou 1 520 € (sciences). Tranche 3 : 3 550 € ou 4 550 €. Licence et master.",
        "licence": {
          "montant": 390,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 390,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "systematique",
        "detail": "Le forfait réduit par nationalité s'applique automatiquement, sans dossier. L'étudiant peut au contraire demander un calcul sur la situation économique de sa famille (ISEE), obligatoire s'il vise les aides EDiSU.",
        "source": "https://en.unipv.it/en/education/bachelors-and-masters-degree-programs/fees-and-funding/fees/prospective-students/non-eu-students",
        "verifieLe": "2026-09-12"
      }
    },
    "motif": "Lot 48 (frais réels, 25 universités les plus montrées) — lu sur les pages officielles le 2026-09-12 ; voir scripts/data/journal-frais-top25-2026-09-12.md."
  },
  {
    "collection": "universities",
    "id": "epfl-lausanne",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.epfl.ch/education/studies/en/rules-and-procedures/study-taxes/tuition-fee-other-fees",
        "verifieLe": "2026-09-12",
        "note": "Depuis l'automne 2025, un étudiant étranger qui s'établit en Suisse pour étudier paie 2 190 CHF par semestre (taxe triplée ; 730 CHF pour les Suisses et les résidents), soit 4 380 CHF/an, plus environ 50 CHF de contributions obligatoires par semestre. Bachelor et master. Doctorat : régi par le règlement doctoral, non lu ici.",
        "licence": {
          "montant": 4380,
          "devise": "CHF",
          "periode": "an"
        },
        "master": {
          "montant": 4380,
          "devise": "CHF",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Une allocation transitoire de 1 460 CHF/semestre (le montant de la hausse) existe, mais seulement pour un étudiant ayant fait son bachelor à l'EPFL et passant en master, sur critères socio-économiques. Un nouvel entrant venu de l'étranger n'y a pas droit ; il reste les bourses d'excellence master de l'EPFL, sélectives.",
        "source": "https://epfl.ch/education/studies/en/transitional-allowance",
        "verifieLe": "2026-09-12"
      }
    },
    "motif": "Lot 48 (frais réels, 25 universités les plus montrées) — lu sur les pages officielles le 2026-09-12 ; voir scripts/data/journal-frais-top25-2026-09-12.md."
  },
  {
    "collection": "universities",
    "id": "iheid-geneve",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.graduateinstitute.ch/tuition-fees-financial-aid-packages",
        "verifieLe": "2026-09-12",
        "note": "8 000 CHF/an pour un non-résident suisse (5 000 CHF pour un résident), master (4 semestres) comme doctorat (8 semestres). L'Institut n'a pas de licence.",
        "master": {
          "montant": 8000,
          "devise": "CHF",
          "periode": "an"
        },
        "doctorat": {
          "montant": 8000,
          "devise": "CHF",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Aides financières combinant bourse de subsistance, réduction des frais et emploi sur le campus, attribuées sur besoin ET mérite pour les masters, sur mérite pour le doctorat (6 financements doctoraux complets par département et par an). Bourses spécifiques pour les étudiants du Sud global. La part d'étudiants aidés n'est pas publiée.",
        "source": "https://www.graduateinstitute.ch/tuition-fees-financial-aid-packages",
        "verifieLe": "2026-09-12"
      }
    },
    "motif": "Lot 48 (frais réels, 25 universités les plus montrées) — lu sur les pages officielles le 2026-09-12 ; voir scripts/data/journal-frais-top25-2026-09-12.md."
  },
  {
    "collection": "universities",
    "id": "universita-degli-studi-di-milano-milan",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.unimi.it/en/study/bachelor-and-master-study/fees-and-how-pay-them/fees-2026/2027",
        "verifieLe": "2026-09-12",
        "note": "2026-27, étudiant hors UE sans ISEE : forfait par groupe de pays. Groupe A (liste annexée : Sénégal, Côte d'Ivoire, Cameroun, Mali, Guinée, Bénin, Burkina Faso, Togo, Niger, Maroc, Tunisie, Égypte, Nigeria, Ghana, Kenya, RDC…) : 130 € de taxe régionale + 200 € (domaine A) ou 256 € (domaine B), soit 330 à 386 €/an. Groupe B : 160 € + 910/1 164 €. Groupe C : 190 € + 3 204/4 101 €. Licence et master. Montant retenu : groupe A, domaine B (le plus élevé de la tranche).",
        "licence": {
          "montant": 386,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 386,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "systematique",
        "detail": "Le forfait réduit par groupe de pays s'applique sans justificatif. Un étudiant hors UE peut aussi demander les aides au droit aux études (bourses, exonérations) en fournissant les documents de revenus et de patrimoine de sa famille.",
        "source": "https://www.unimi.it/sites/default/files/2026-05/Allegato%202%20Regolamento%20Tasse%20A.A.2026-2027%20Gruppi%20Paesi%20%28002%29_1.pdf",
        "verifieLe": "2026-09-12"
      }
    },
    "motif": "Lot 48 (frais réels, 25 universités les plus montrées) — lu sur les pages officielles le 2026-09-12 ; voir scripts/data/journal-frais-top25-2026-09-12.md."
  },
  {
    "collection": "universities",
    "id": "university-of-oxford-oxford",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.ox.ac.uk/admissions/undergraduate/fees-and-funding/course-fees",
        "verifieLe": "2026-09-12",
        "note": "Licence, entrée 2027-28, étudiant « overseas » : de 39 620 £ à 66 580 £ par an selon le cours (médecine clinique nettement plus haut). Montant retenu : le bas de la fourchette. Master et doctorat : frais par cours sur la page de chaque programme, non relevés ici — du même ordre de grandeur.",
        "licence": {
          "montant": 39620,
          "devise": "GBP",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Pas d'exonération sur dossier. Pour master et doctorat, le Clarendon Fund attribue plus de 200 bourses complètes par an (frais + allocation de vie) sur le seul mérite, toutes nationalités ; tout candidat déposant avant l'échéance de décembre/janvier est examiné automatiquement. Reach Oxford et d'autres fonds existent pour la licence.",
        "source": "https://www.ox.ac.uk/admissions/graduate/fees-and-funding/funding/clarendon",
        "verifieLe": "2026-09-12"
      }
    },
    "motif": "Lot 48 (frais réels, 25 universités les plus montrées) — lu sur les pages officielles le 2026-09-12 ; voir scripts/data/journal-frais-top25-2026-09-12.md."
  },
  {
    "collection": "universities",
    "id": "sapienza-universita-di-roma-rome",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.uniroma1.it/en/content/standard-registration-fee-amounts",
        "verifieLe": "2026-09-12",
        "note": "Étudiant dont la famille a ses revenus à l'étranger (pas d'ISEE) : forfait annuel par bande de pays (PIB à parité de pouvoir d'achat). Bande A, 300 €/an : Sénégal, Côte d'Ivoire, Cameroun, Mali, Guinée, Bénin, Burkina Faso, Togo, Niger, Maroc, Tunisie, Algérie, Égypte, Nigeria, Ghana, Kenya, RDC, Afrique du Sud… Bande B (Turquie, Mexique, Chili…) : 700 €. Bande C (pays développés) : 1 500 €. Année 2025-26 indiquée sur la page. Licence et master.",
        "licence": {
          "montant": 300,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 300,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "systematique",
        "detail": "Le forfait réduit par bande de pays s'applique d'office aux étudiants qui ne peuvent pas produire d'ISEE. Exonération totale seulement pour handicap reconnu (loi 104/1992).",
        "source": "https://www.uniroma1.it/en/content/standard-registration-fee-amounts",
        "verifieLe": "2026-09-12"
      }
    },
    "motif": "Lot 48 (frais réels, 25 universités les plus montrées) — lu sur les pages officielles le 2026-09-12 ; voir scripts/data/journal-frais-top25-2026-09-12.md."
  },
  {
    "collection": "universities",
    "id": "stanford-university-stanford",
    "champs": {
      "fraisScolarite": {
        "source": "https://financialaid.stanford.edu/undergrad/budget/index.html",
        "verifieLe": "2026-09-12",
        "note": "Licence 2026-27 : tuition 67 731 $ par an ; budget total estimé 97 545 $ avec logement, repas, frais, livres et assurance. Master et doctorat : frais par école, non relevés ici (le doctorat est en général financé par l'université).",
        "licence": {
          "montant": 67731,
          "devise": "USD",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Aide financière sur besoin, mais « limitée » pour les internationaux (need-aware) : il faut la demander sur le dossier d'admission lui-même, jamais après ; demander une aide peut peser sur la décision d'admission. Pas de seuil de revenu publié pour les non-Américains.",
        "source": "https://financialaid.stanford.edu/undergrad/how/international.html",
        "verifieLe": "2026-09-12"
      }
    },
    "motif": "Lot 48 (frais réels, 25 universités les plus montrées) — lu sur les pages officielles le 2026-09-12 ; voir scripts/data/journal-frais-top25-2026-09-12.md."
  },
  {
    "collection": "universities",
    "id": "university-of-toronto-toronto",
    "champs": {
      "fraisScolarite": {
        "source": "https://planningandbudget.utoronto.ca/wp-content/uploads/2026/04/2026-27-Tuition-Fee-Report_FINAL.pdf",
        "verifieLe": "2026-09-12",
        "note": "Grille officielle 2026-27, étudiant international : licence Arts & Science et Engineering (St. George), entrée 2026 : 72 860 $ CA par an. Master de recherche (M.A. Arts & Science), nouvel entrant : 33 460 $ CA. Hors frais accessoires et assurance UHIP.",
        "licence": {
          "montant": 72860,
          "devise": "CAD",
          "periode": "an"
        },
        "master": {
          "montant": 33460,
          "devise": "CAD",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "aucune",
        "detail": "« Établissement financé sur fonds publics, l'Université ne peut pas offrir d'aide financière sur besoin aux étudiants internationaux ». Seules des bourses au mérite existent (dont Lester B. Pearson, complète, très sélective, sur nomination du lycée).",
        "source": "https://future.utoronto.ca/finances/fees/",
        "verifieLe": "2026-09-12"
      }
    },
    "motif": "Lot 48 (frais réels, 25 universités les plus montrées) — lu sur les pages officielles le 2026-09-12 ; voir scripts/data/journal-frais-top25-2026-09-12.md."
  },
  {
    "collection": "universities",
    "id": "eth-zurich-zurich",
    "champs": {
      "fraisScolarite": {
        "source": "https://ethz.ch/students/en/studies/financial/tuition-fees.html",
        "verifieLe": "2026-09-12",
        "note": "Depuis l'automne 2025, deux groupes : 730 CHF/semestre pour qui a obtenu son titre d'accès en résidant en Suisse ; 2 190 CHF/semestre (taxe triplée) pour tous les autres étrangers, soit 4 380 CHF/an, bachelor et master, plus les frais semestriels. Le doctorat n'est pas concerné par ce règlement.",
        "licence": {
          "montant": 4380,
          "devise": "CHF",
          "periode": "an"
        },
        "master": {
          "montant": 4380,
          "devise": "CHF",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Pas d'exonération automatique pour le groupe 2. Le programme d'excellence ESOP (master) couvre frais et vie sur mérite, très sélectif ; des réductions sur situation financière existent au cas par cas via le service des bourses.",
        "source": "https://ethz.ch/students/en/studies/financial/tuition-fees.html",
        "verifieLe": "2026-09-12"
      }
    },
    "motif": "Lot 48 (frais réels, 25 universités les plus montrées) — lu sur les pages officielles le 2026-09-12 ; voir scripts/data/journal-frais-top25-2026-09-12.md."
  },
  {
    "collection": "universities",
    "id": "uclouvain-louvain-la-neuve",
    "champs": {
      "fraisScolarite": {
        "source": "https://uclouvain.be/en/enrolment/registration-fee-amount",
        "verifieLe": "2026-09-12",
        "note": "2026-27 : droits ordinaires 1 194 €/an, plus une contribution de 4 175 € pour un étudiant hors UE, soit 5 369 €/an en bachelier et master. EXEMPTÉS de la contribution (donc 1 194 €) : les ressortissants des pays listés aux annexes 1 à 3 de la circulaire ARES 2026-001 (pays en développement — liste à confirmer pour chaque nationalité), les boursiers WBI, et TOUT doctorant. Frais de dossier 200 €, déduits si admis.",
        "licence": {
          "montant": 5369,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 5369,
          "devise": "EUR",
          "periode": "an"
        },
        "doctorat": {
          "montant": 1194,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "La contribution hors UE (4 175 €) tombe pour les ressortissants des pays des annexes 1-3 de la circulaire ARES 2026-001 — si votre pays y figure, vous payez le tarif ordinaire (1 194 €). Par ailleurs, réduction des droits ordinaires sur dossier social (835 € ou 374 €).",
        "source": "https://uclouvain.be/en/enrolment/registration-fee-amount",
        "verifieLe": "2026-09-12"
      }
    },
    "motif": "Lot 48 (frais réels, 25 universités les plus montrées) — lu sur les pages officielles le 2026-09-12 ; voir scripts/data/journal-frais-top25-2026-09-12.md."
  }
];
