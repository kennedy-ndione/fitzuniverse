/**
 * ============================================================
 * LOT 45-FRAIS-FRANCE — GÉNÉRÉ depuis scripts/data/journal-frais-france-2026-09-07.md
 * par scripts/generer-lot-frais.mjs. NE PAS ÉDITER À LA MAIN : corriger
 * le journal et régénérer.
 *
 * 18 patch(es) sur `universities` (françaises seulement) :
 * fraisScolarite et/ou exoneration, chaque entrée sourcée et datée.
 * Les universités ILLISIBLES ou DÉDUITES du journal n'ont pas de patch.
 * ============================================================
 */

export const PATCHES = [
  {
    "collection": "universities",
    "id": "aix-marseille-universite-marseille",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.univ-amu.fr/en/international-students/international-students-degree-programs/differential-tuition-fees-for-european-union-students",
        "verifieLe": "2026-09-07",
        "note": "Droits différenciés hors UE, payés en totalité à l'inscription pour un nouvel entrant.",
        "licence": {
          "montant": 2902,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 3950,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Nouvel entrant : droits différenciés payés en totalité, puis exonération partielle de 75 % possible sur dossier, dans la limite du quota réglementaire.",
        "source": "https://www.univ-amu.fr/en/international-students/international-students-degree-programs/differential-tuition-fees-for-european-union-students",
        "verifieLe": "2026-09-07"
      }
    },
    "motif": "Lot D2 (frais réels) — lu sur la page officielle le 2026-09-07 ; voir scripts/data/journal-frais-france-2026-09-07.md."
  },
  {
    "collection": "universities",
    "id": "ecole-normale-superieure-de-lyon-lyon",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.ens-lyon.fr/formation/inscription-scolarite/inscription-et-reinscription-lens-de-lyon/droits-dinscription",
        "verifieLe": "2026-09-07",
        "note": "Master, étudiant international hors situations d'exonération. Le diplôme de l'ENS (normaliens) va de 800 à 1 500 €/an selon les revenus.",
        "master": {
          "montant": 3950,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "inconnue",
        "detail": "Boursiers CROUS exonérés ; commission pour situations financières difficiles. Aucune politique propre aux extracommunautaires lue sur la page.",
        "source": "https://www.ens-lyon.fr/formation/inscription-scolarite/inscription-et-reinscription-lens-de-lyon/droits-dinscription",
        "verifieLe": "2026-09-07"
      }
    },
    "motif": "Lot D2 (frais réels) — lu sur la page officielle le 2026-09-07 ; voir scripts/data/journal-frais-france-2026-09-07.md."
  },
  {
    "collection": "universities",
    "id": "ecole-normale-superieure-psl-paris",
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Régime unifié 2026-2027 : exonération sur demande, avis d'une commission, décision du directeur, plafond de 30 % des inscrits (délibération n° 2026-17 du 1er juillet 2026).",
        "source": "https://www.ens.psl.eu/sites/default/files/deliberation_ndeg2026-17_portant_approbation_des_criteres_et_de_la_procedure_dexoneration_des_droits_dinscription_pour_2026-2027_2.pdf",
        "verifieLe": "2026-09-07"
      }
    },
    "motif": "Lot D2 (frais réels) — lu sur la page officielle le 2026-09-07 ; voir scripts/data/journal-frais-france-2026-09-07.md."
  },
  {
    "collection": "universities",
    "id": "ecole-polytechnique-palaiseau",
    "champs": {
      "fraisScolarite": {
        "source": "https://programmes.polytechnique.edu/en/master/admissions-msct/tuition-fees",
        "verifieLe": "2026-09-07",
        "note": "Master of Science and Technology, tarif plein 2026-2027 (12 350 €/an pour les diplômés IP Paris ou du Bachelor ; certains programmes plus chers). Bachelor non daté sur la page, non repris.",
        "master": {
          "montant": 15400,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "inconnue",
        "detail": "Établissement à frais propres : bourses limitées qui « ne couvrent généralement pas l'intégralité des frais ». Aucune exonération au sens du décret lue.",
        "source": "https://programmes.polytechnique.edu/en/master/admissions-msct/tuition-fees",
        "verifieLe": "2026-09-07"
      }
    },
    "motif": "Lot D2 (frais réels) — lu sur la page officielle le 2026-09-07 ; voir scripts/data/journal-frais-france-2026-09-07.md."
  },
  {
    "collection": "universities",
    "id": "hec-paris-jouy-en-josas",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.hec.edu/en/master-s-programs/master-management/fees-and-financing",
        "verifieLe": "2026-09-07",
        "note": "Tarifs indicatifs entrée 2026. Bachelor : 23 000 € la 1re année (à Bocconi), 26 500 € les années à HEC. Master in Management : 58 900 € sur deux ans, plus 2 000 € pour les étudiants hors UE.",
        "licence": {
          "montant": 26500,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 29450,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "inconnue",
        "detail": "Établissement à frais propres : bourses au mérite et sur critères sociaux, au cas par cas. Aucune exonération au sens du décret lue.",
        "source": "https://www.hec.edu/en/master-s-programs/master-management/fees-and-financing",
        "verifieLe": "2026-09-07"
      }
    },
    "motif": "Lot D2 (frais réels) — lu sur la page officielle le 2026-09-07 ; voir scripts/data/journal-frais-france-2026-09-07.md."
  },
  {
    "collection": "universities",
    "id": "nantes-universite-nantes",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.univ-nantes.fr/formation/scolarite-inscriptions/droits-universitaires-situation",
        "verifieLe": "2026-09-07",
        "note": "Droits différenciés hors UE ; doctorat au tarif national (non soumis).",
        "licence": {
          "montant": 2902,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 3950,
          "devise": "EUR",
          "periode": "an"
        },
        "doctorat": {
          "montant": 398,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Exonération individuelle sur demande après l'inscription, dans la limite de 30 % des inscrits en 2026-2027 ; mesures transitoires pour les étudiants déjà exonérés en 2025-2026.",
        "source": "https://www.univ-nantes.fr/formation/scolarite-inscriptions/droits-universitaires-situation",
        "verifieLe": "2026-09-07"
      }
    },
    "motif": "Lot D2 (frais réels) — lu sur la page officielle le 2026-09-07 ; voir scripts/data/journal-frais-france-2026-09-07.md."
  },
  {
    "collection": "universities",
    "id": "sciences-po-paris",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.sciencespo.fr/students/fr/financer/droits-scolarite/",
        "verifieLe": "2026-09-07",
        "note": "Foyer fiscal hors UE : taux maximal du barème (le barème progressif est réservé aux foyers fiscaux de l'UE). Doctorat non repris : la page ne couvre que 2025-2026.",
        "licence": {
          "montant": 14900,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 20640,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "inconnue",
        "detail": "Établissement à frais propres. Boursiers CROUS et Bourse Émile Boutmy exonérés sous conditions, sauf masters en un an. Aucune exonération au sens du décret.",
        "source": "https://www.sciencespo.fr/students/fr/financer/droits-scolarite/",
        "verifieLe": "2026-09-07"
      }
    },
    "motif": "Lot D2 (frais réels) — lu sur la page officielle le 2026-09-07 ; voir scripts/data/journal-frais-france-2026-09-07.md."
  },
  {
    "collection": "universities",
    "id": "sorbonne-universite-paris",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.sorbonne-universite.fr/en/education/study-sorbonne-university/enrolment-procedures-and-tuition-fees",
        "verifieLe": "2026-09-07",
        "note": "Doctorat au tarif national (doctorants exonérés des droits différenciés). Les montants différenciés de licence et master ne sont pas publiés sur la page.",
        "doctorat": {
          "montant": 398,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Exonération sur demande, dossier déposé sur une plateforme dédiée en septembre ; exonérés d'office : boursiers d'État, accords internationaux, programmes d'échange.",
        "source": "https://www.sorbonne-universite.fr/en/education/study-sorbonne-university/enrolment-procedures-and-tuition-fees",
        "verifieLe": "2026-09-07"
      }
    },
    "motif": "Lot D2 (frais réels) — lu sur la page officielle le 2026-09-07 ; voir scripts/data/journal-frais-france-2026-09-07.md."
  },
  {
    "collection": "universities",
    "id": "universite-claude-bernard-lyon-1-villeurbanne",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.univ-lyon1.fr/formation/inscription-et-scolarite/etudiantes-et-etudiants-internationaux-droits-dinscription-differencies-et-exonerations",
        "verifieLe": "2026-09-07",
        "note": "Droits différenciés hors UE, nouvel entrant.",
        "licence": {
          "montant": 2902,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 3950,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Exonérations totales ou partielles sur demande, dans la limite du quota de 30 % en 2026-2027.",
        "source": "https://www.univ-lyon1.fr/formation/inscription-et-scolarite/etudiantes-et-etudiants-internationaux-droits-dinscription-differencies-et-exonerations",
        "verifieLe": "2026-09-07"
      }
    },
    "motif": "Lot D2 (frais réels) — lu sur la page officielle le 2026-09-07 ; voir scripts/data/journal-frais-france-2026-09-07.md."
  },
  {
    "collection": "universities",
    "id": "universite-cote-d-azur-nice",
    "champs": {
      "fraisScolarite": {
        "source": "https://univ-cotedazur.fr/formation/candidater-et-s-inscrire/droits-dinscription",
        "verifieLe": "2026-09-07",
        "note": "Droits différenciés hors UE ; doctorat au tarif national.",
        "licence": {
          "montant": 2902,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 3950,
          "devise": "EUR",
          "periode": "an"
        },
        "doctorat": {
          "montant": 398,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Nouvel entrant : exonération partielle possible au vu de la situation personnelle, examinée en commission d'exonération.",
        "source": "https://univ-cotedazur.fr/formation/candidater-et-s-inscrire/droits-dinscription",
        "verifieLe": "2026-09-07"
      }
    },
    "motif": "Lot D2 (frais réels) — lu sur la page officielle le 2026-09-07 ; voir scripts/data/journal-frais-france-2026-09-07.md."
  },
  {
    "collection": "universities",
    "id": "universite-de-bordeaux-bordeaux",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.u-bordeaux.fr/formation/candidatures-et-inscriptions/cout-des-etudes/etudiants-extra-communautaires",
        "verifieLe": "2026-09-07",
        "note": "Droits différenciés hors UE ; doctorat au tarif national.",
        "licence": {
          "montant": 2902,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 3950,
          "devise": "EUR",
          "periode": "an"
        },
        "doctorat": {
          "montant": 398,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Exonération partielle sur demande (paiement au tarif national si accordée), commission en novembre, décision en décembre ; procédures accélérées pour boursiers, réfugiés, conventions, domicile fiscal en France.",
        "source": "https://www.u-bordeaux.fr/formation/candidatures-et-inscriptions/cout-des-etudes/etudiants-extra-communautaires",
        "verifieLe": "2026-09-07"
      }
    },
    "motif": "Lot D2 (frais réels) — lu sur la page officielle le 2026-09-07 ; voir scripts/data/journal-frais-france-2026-09-07.md."
  },
  {
    "collection": "universities",
    "id": "universite-de-montpellier-montpellier",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.umontpellier.fr/wp-content/uploads/2026/07/droits-differencies.pdf",
        "verifieLe": "2026-09-07",
        "note": "Droits différenciés hors UE ; doctorat au tarif national.",
        "licence": {
          "montant": 2902,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 3950,
          "devise": "EUR",
          "periode": "an"
        },
        "doctorat": {
          "montant": 398,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Exonération sur demande après l'inscription, au vu de la situation personnelle ; de plein droit pour boursiers, pupilles et Libanais domiciliés au Liban. L'université dit que le décret limite fortement ses possibilités d'exonération.",
        "source": "https://www.umontpellier.fr/international/etudier-a-letranger/etudiants-internationaux-annee-universitaire-2026-2027",
        "verifieLe": "2026-09-07"
      }
    },
    "motif": "Lot D2 (frais réels) — lu sur la page officielle le 2026-09-07 ; voir scripts/data/journal-frais-france-2026-09-07.md."
  },
  {
    "collection": "universities",
    "id": "universite-de-strasbourg-strasbourg",
    "champs": {
      "fraisScolarite": {
        "source": "https://en.unistra.fr/fr/droits-dinscription",
        "verifieLe": "2026-09-07",
        "note": "Droits différenciés hors UE, nouvel entrant.",
        "licence": {
          "montant": 2902,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 3950,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Demande individuelle auprès de la Présidence, instruite par une commission ; exonérations automatiques pour doctorants, réfugiés, résidents longue durée, domicile fiscal en France ; transitoires pour les inscrits 2025-2026.",
        "source": "https://en.unistra.fr/fr/droits-dinscription",
        "verifieLe": "2026-09-07"
      }
    },
    "motif": "Lot D2 (frais réels) — lu sur la page officielle le 2026-09-07 ; voir scripts/data/journal-frais-france-2026-09-07.md."
  },
  {
    "collection": "universities",
    "id": "universite-grenoble-alpes-grenoble",
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "2026-2027 = année de transition : exonération sur demande avec déclaration de ressources, que l'UGA entend appliquer largement dans le respect des plafonds réglementaires ; en cas d'exonération, seuls les droits nationaux sont dus.",
        "source": "https://www.univ-grenoble-alpes.fr/actualites/a-la-une/actualites-universite/etudiants-internationaux-ce-que-change-le-nouveau-decret-sur-les-droits-d-inscription-a-l-uga-1775870.kjsp",
        "verifieLe": "2026-09-07"
      }
    },
    "motif": "Lot D2 (frais réels) — lu sur la page officielle le 2026-09-07 ; voir scripts/data/journal-frais-france-2026-09-07.md."
  },
  {
    "collection": "universities",
    "id": "universite-paris-1-pantheon-sorbonne-paris",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.pantheonsorbonne.fr/inscription/frais-dinscription",
        "verifieLe": "2026-09-07",
        "note": "Droits différenciés hors UE ; doctorat au tarif national. Les ressortissants des 44 pays les moins avancés (liste ONU) paient les droits nationaux.",
        "licence": {
          "montant": 2902,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 3950,
          "devise": "EUR",
          "periode": "an"
        },
        "doctorat": {
          "montant": 398,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Application partielle : paient les droits nationaux les ressortissants des 44 pays les moins avancés (ONU), les réinscrits 2025-2026 dans le même cycle, les doubles diplômes, réfugiés, demandeurs d'asile, boursiers BGF ; les autres extracommunautaires paient les droits différenciés (schéma de mars 2026).",
        "source": "https://international.pantheonsorbonne.fr/sites/default/files/2026-03/Schema_DIF_26-27_03-26_FR_0.pdf",
        "verifieLe": "2026-09-07"
      }
    },
    "motif": "Lot D2 (frais réels) — lu sur la page officielle le 2026-09-07 ; voir scripts/data/journal-frais-france-2026-09-07.md."
  },
  {
    "collection": "universities",
    "id": "universite-paris-cite-paris",
    "champs": {
      "fraisScolarite": {
        "source": "https://u-paris.fr/droits-dinscription-tarifs-exonerations/",
        "verifieLe": "2026-09-07",
        "note": "Doctorat au tarif national. Licence et master non repris : la page annonce un moratoire voté le 17 octobre 2025, avant le décret du 19 mai 2026, sans mention du plafond de 30 %.",
        "doctorat": {
          "montant": 398,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "inconnue",
        "detail": "La page annonce un moratoire (droits nationaux pour tous) reconduit pour 2026-2027 par le CA du 17 octobre 2025 — antérieur au décret du 19 mai 2026 qui plafonne les exonérations à 30 %. À recouper auprès de l'université.",
        "source": "https://u-paris.fr/droits-dinscription-tarifs-exonerations/",
        "verifieLe": "2026-09-07"
      }
    },
    "motif": "Lot D2 (frais réels) — lu sur la page officielle le 2026-09-07 ; voir scripts/data/journal-frais-france-2026-09-07.md."
  },
  {
    "collection": "universities",
    "id": "universite-paris-dauphine-psl-paris",
    "champs": {
      "fraisScolarite": {
        "source": "https://dauphine.psl.eu/formations/scolarite/droits-et-tarifs",
        "verifieLe": "2026-09-07",
        "note": "Droits modulés, résidence fiscale hors UE : Licence Sciences des Organisations 2 349 € (Licence Mathématiques-Informatique : 582 €) ; masters de grand établissement 6 831 €. Masters diplômes nationaux : 3 950 €, ramenés à 255 € sur exonération partielle.",
        "licence": {
          "montant": 2349,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 6831,
          "devise": "EUR",
          "periode": "an"
        },
        "doctorat": {
          "montant": 398,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Boursiers CROUS ou du gouvernement français, réfugiés, handicap, pupilles : exonérés. Extracommunautaires en master diplôme national : exonération partielle (255 €) sur demande motivée.",
        "source": "https://dauphine.psl.eu/formations/scolarite/droits-et-tarifs",
        "verifieLe": "2026-09-07"
      }
    },
    "motif": "Lot D2 (frais réels) — lu sur la page officielle le 2026-09-07 ; voir scripts/data/journal-frais-france-2026-09-07.md."
  },
  {
    "collection": "universities",
    "id": "universite-sorbonne-paris-nord-villetaneuse",
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Exonération partielle sur demande, plafond de 30 % des inscrits en 2026-2027 (25 % en 2027-2028, 20 % ensuite) ; critères : demandeurs d'asile, accords internationaux, ressortissants des 44 pays les moins avancés, situations sociales.",
        "source": "https://inscriptions.univ-spn.fr/exoneration/",
        "verifieLe": "2026-09-07"
      }
    },
    "motif": "Lot D2 (frais réels) — lu sur la page officielle le 2026-09-07 ; voir scripts/data/journal-frais-france-2026-09-07.md."
  }
];
