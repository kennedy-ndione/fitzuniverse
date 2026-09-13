/**
 * ============================================================
 * LOT 53-FRAIS-SUITE — dix universités de plus (13 septembre 2026)
 * ============================================================
 *
 * Après les 25 les plus montrées (lots 48-50), la tranche suivante par
 * EXPOSITION mesurée sur les 360 profils du radar : ces universités
 * concentrent la majorité de ce que les étudiants voient encore sans
 * prix. Charles a demandé que TOUTES les universités soient faites —
 * celle-ci est la deuxième étape, pas la dernière.
 *
 * CE QUE CETTE TRANCHE APPREND
 * ----------------------------
 * - L'ITALIE PUBLIQUE EST LE MEILLEUR RAPPORT DU CATALOGUE POUR UN
 *   ÉTUDIANT AFRICAIN, et ce n'est pas une impression : Trieste
 *   EXONÈRE totalement les ressortissants des pays en développement
 *   (176 €/an de timbre et taxe régionale), Bologne applique un forfait
 *   de 657 €, Padoue 930 € au lieu de 2 790. Chaque fois sur une liste
 *   officielle de pays, sans justificatif de revenus. Trois lectures
 *   indépendantes, trois dispositifs différents, même conclusion.
 * - ATTENTION À NE PAS GÉNÉRALISER : le Politecnico di Torino, italien
 *   public lui aussi, n'a PAS de forfait par pays — sans ISEE parificato
 *   obtenu depuis l'étranger, c'est 3 600 €/an d'office. La règle est
 *   par université, jamais par pays.
 * - Boğaziçi écrit noir sur blanc qu'elle n'offre AUCUNE aide aux
 *   internationaux ; Berkeley non plus (aide réservée aux résidents).
 *   `politique: "aucune"` n'est pas un manque d'information, c'est une
 *   information.
 * - UCT distingue SADC / reste de l'Afrique / reste du monde : un
 *   étudiant sénégalais paie l'« international term fee » africaine
 *   (60 300 R en licence), pas celle du reste du monde.
 *
 * Nouvelles devises : ZAR, MAD, TRY — leurs seuils de bande restent à
 * poser dans js/frais.js (SEUILS_PAR_DEVISE), sans quoi ces montants
 * s'afficheront « Coût non classé ». C'est le complément immédiat.
 *
 * Restent à ouvrir avec Charles : Humboldt (252 vues, la plus montrée),
 * Waseda, Istanbul University — voir le journal.
 * ============================================================
 */

export const PATCHES = [
  {
    "collection": "universities",
    "id": "universita-di-bologna-bologne",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.unibo.it/en/study/enrolment-fees-and-other-procedures/degree-programmes/tuition-fees-and-exemptions/reduced-fixed-fee-for-citizens-of-particularly-poor-and-developing-countries-or-non-eu-non-oecd-countries",
        "verifieLe": "2026-09-13",
        "note": "Forfait réduit 2026-27 pour les ressortissants des pays pauvres ou en développement figurant sur les listes officielles : 500 € + 157,04 € de taxe régionale en première année de licence (600 € les années suivantes) ; 600 € + 157,04 € en première année de master (700 € ensuite). Trois conditions : nationalité sur la liste, inscription dans la durée normale du cursus, revenus et biens de la famille hors d'Italie uniquement. Demande à déposer sur le portail ER.GO, sans justificatif économique. Montants retenus : première année.",
        "licence": {
          "montant": 657,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 757,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "systematique",
        "detail": "Le forfait réduit s'applique sur simple demande via ER.GO, sans pièces économiques, à tout ressortissant d'un pays de la liste dont la famille n'a ni revenus ni biens en Italie. L'université l'applique même si la demande reste incomplète, quitte à réclamer ensuite une déclaration sur les ressources.",
        "source": "https://www.unibo.it/en/study/enrolment-fees-and-other-procedures/degree-programmes/tuition-fees-and-exemptions/reduced-fixed-fee-for-citizens-of-particularly-poor-and-developing-countries-or-non-eu-non-oecd-countries",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 53 (frais réels, tranche suivante par exposition) — lu sur les pages officielles le 2026-09-13 ; voir scripts/data/journal-frais-suite-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "universita-di-padova-padoue",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.unipd.it/en/tuition-fees",
        "verifieLe": "2026-09-13",
        "note": "2026-27, étudiant hors UE résidant à l'étranger : forfait par groupe de filières, avec un tarif « pays en développement » (décret ministériel n°176 de février 2026, indice de développement humain). Groupe A (humanités) : 930 €/an au lieu de 2 790 €. Groupe B (sciences, enseignement primaire) : 996,66 € au lieu de 2 990 €. Plus 192 € de taxe régionale et 16 € de timbre à la première échéance. Montants retenus : tarif pays en développement, groupe A pour la licence, groupe B pour le master (le plus élevé des deux).",
        "licence": {
          "montant": 1138,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 1205,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "systematique",
        "detail": "Le tarif « pays en développement » s'applique d'office aux ressortissants des pays à faible indice de développement humain listés par le décret ministériel. Padoue applique par ailleurs « l'une des politiques les plus avantageuses des grandes universités italiennes » : aucun contributo jusqu'à 30 000 € de revenu familial annuel.",
        "source": "https://www.unipd.it/en/tuition-fees",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 53 (frais réels, tranche suivante par exposition) — lu sur les pages officielles le 2026-09-13 ; voir scripts/data/journal-frais-suite-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "universita-di-trieste-trieste",
    "champs": {
      "fraisScolarite": {
        "source": "https://repo.units.it/docs/units_CdL_tasse-avvisoTasse_en.2026-2027.pdf",
        "verifieLe": "2026-09-13",
        "note": "Avis de frais 2026-27, article 4 : un étudiant ressortissant d'un pays en développement (liste du décret ministériel) qui remplit les conditions de l'article 1(3) — inscription dans la durée normale du cursus — est EXONÉRÉ des frais de scolarité ; il ne paie que le timbre (16 €) et la taxe régionale (160 €), soit 176 €/an. S'il ne les remplit pas : 200 € de scolarité en plus (376 €). Un étudiant résidant à l'étranger sans être d'un pays en développement paie 976 €/an. Licence et master.",
        "licence": {
          "montant": 176,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 176,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "systematique",
        "detail": "Exonération totale des frais de scolarité pour les ressortissants des pays en développement inscrits dans la durée normale du cursus : restent le timbre et la taxe régionale. Demande à déposer avec le formulaire « Borsisti GI CRUI e PvS ».",
        "source": "https://portale.units.it/sites/default/files/2026-08/EN%20Borsisiti%20GI%20CRUI%20e%20PvS%202026%202027.pdf",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 53 (frais réels, tranche suivante par exposition) — lu sur les pages officielles le 2026-09-13 ; voir scripts/data/journal-frais-suite-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "politecnico-di-torino-turin",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.polito.it/sites/default/files/2025-07/ENG_Regolamento%20contribuz_immatricolati_post%20CDA.pdf",
        "verifieLe": "2026-09-13",
        "note": "Règlement des contributions (immatriculés à partir de 2025-26) : contribution annuelle de 600 € minimum à 3 600 € maximum. Un étudiant hors UE dont la famille a ses revenus à l'étranger doit faire établir un ISEE parificato pour obtenir une réduction ; SANS ce document, le tarif maximum de 3 600 € s'applique d'office. Montant retenu : le maximum, celui que paie l'étudiant qui ne fait pas la démarche. Pas de forfait par pays comme à Pavia, Bologne ou Padoue.",
        "licence": {
          "montant": 3600,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 3600,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Réduction jusqu'à 600 €/an sur présentation d'un ISEE parificato (plafond 100 000 € d'ISEE), à faire établir depuis l'étranger avant l'inscription. Bourses au mérite pour internationaux : TOPoliTO (8 000 €/an), bourses MAECI du gouvernement italien.",
        "source": "https://www.polito.it/en/education/international-students/financial-aid",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 53 (frais réels, tranche suivante par exposition) — lu sur les pages officielles le 2026-09-13 ; voir scripts/data/journal-frais-suite-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "university-of-cape-town-le-cap",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.uct.ac.za/sites/default/files/media/documents/uct_ac_za/49/2026-fees-booklet.pdf",
        "verifieLe": "2026-09-13",
        "note": "Livret des frais 2026. Un étudiant AFRICAIN hors SADC (Sénégal, Côte d'Ivoire, Cameroun, Nigeria, Ghana, Maroc…) paie les frais de cours PLUS une « international term fee » de 60 300 R en licence et 48 200 R en master. Frais de cours de première année : 79 000 R en lettres et sciences sociales, 82 820 à 89 780 R en ingénierie. Montants retenus : lettres + international term fee africaine (139 300 R en licence ; 127 200 R en master sur la même base). Hors SADC et hors Afrique : 80 400 / 64 500 R de term fee. Un étudiant de la SADC paie le tarif sud-africain, sans term fee, plus 5 600 R de frais administratifs.",
        "licence": {
          "montant": 139300,
          "devise": "ZAR",
          "periode": "an"
        },
        "master": {
          "montant": 127200,
          "devise": "ZAR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "inconnue",
        "detail": "Aucune exonération de l'international term fee lue dans le livret ; l'UCT propose des bourses pour étudiants africains (dont Mastercard Foundation) — non relevées sur cette source.",
        "source": "https://uct.ac.za/international/student-support/fees",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 53 (frais réels, tranche suivante par exposition) — lu sur les pages officielles le 2026-09-13 ; voir scripts/data/journal-frais-suite-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "university-of-british-columbia-vancouver",
    "champs": {
      "fraisScolarite": {
        "source": "https://students.ubc.ca/enrolment/finances/tuition-fees/undergraduate-tuition-fees",
        "verifieLe": "2026-09-13",
        "note": "Licence 2026-27, campus de Vancouver, étudiant international, année complète : Arts 51 530,40 $ CA ; Sciences 53 082 $ ; Ingénierie (Applied Science) 66 199,66 $ ; Commerce (Sauder) 66 678,30 $. Garantie : pour une entrée en 2026-27, la hausse est plafonnée à 3 % par an pendant les 4 années suivantes. Montant retenu : Arts. Master : grille séparée, non relevée.",
        "licence": {
          "montant": 51530,
          "devise": "CAD",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Bourses d'entrée pour internationaux (dont l'International Major Entrance Scholarship, renouvelable), attribuées au mérite et sur besoin financier déclaré à la candidature ; montants non relevés sur cette page.",
        "source": "https://students.ubc.ca/enrolment/finances/tuition-fees",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 53 (frais réels, tranche suivante par exposition) — lu sur les pages officielles le 2026-09-13 ; voir scripts/data/journal-frais-suite-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "university-of-california-berkeley-berkeley",
    "champs": {
      "fraisScolarite": {
        "source": "https://financialaid.berkeley.edu/cost-attendance/",
        "verifieLe": "2026-09-13",
        "note": "Licence 2026-27 : 18 214 $ de tuition and fees (tarif résident de Californie) PLUS 39 270 $ de « nonresident supplemental tuition » pour un étudiant international, soit 57 484 $/an de frais. Budget total annoncé avec logement et vie courante : environ 54 674 $ pour un résident — nettement plus pour un international. Master et doctorat : grilles par école, non relevées.",
        "licence": {
          "montant": 57484,
          "devise": "USD",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "aucune",
        "detail": "Université publique de Californie : l'aide financière fédérale et d'État est réservée aux résidents ; elle « couvre les frais pour plus d'un tiers des étudiants de Berkeley », mais les internationaux en sont exclus. Restent quelques bourses privées au mérite.",
        "source": "https://financialaid.berkeley.edu/cost-attendance/",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 53 (frais réels, tranche suivante par exposition) — lu sur les pages officielles le 2026-09-13 ; voir scripts/data/journal-frais-suite-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "al-akhawayn-university-ifrane",
    "champs": {
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
      "exoneration": {
        "politique": "inconnue",
        "detail": "L'université attribue des bourses (les remboursements de boursiers sont mentionnés dans le règlement), mais ni les critères ni la part des étudiants aidés ne sont publiés sur les pages de frais lues.",
        "source": "https://aui.ma/admission-aid/undergraduates/tuition-and-fees",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 53 (frais réels, tranche suivante par exposition) — lu sur les pages officielles le 2026-09-13 ; voir scripts/data/journal-frais-suite-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "bogazici-university-istanbul",
    "champs": {
      "fraisScolarite": {
        "source": "https://intl.bogazici.edu.tr/tuition-undergraduate-and-graduate-degree-programs",
        "verifieLe": "2026-09-13",
        "note": "Licence sous quota international, PAR SEMESTRE : 5 000 $ US en économie/sciences administratives et en ingénierie, 4 000 $ dans les autres facultés (éducation, sciences, lettres et sciences sociales, droit) — soit 8 000 à 10 000 $/an. Master : 1 000 $ par an (500 $/semestre). Hébergement et repas non compris. Frais de dossier : 100 € en licence, 50 $ en master. Montant retenu en licence : 8 000 $ (le plus bas, lettres et sciences).",
        "licence": {
          "montant": 8000,
          "devise": "USD",
          "periode": "an"
        },
        "master": {
          "montant": 1000,
          "devise": "USD",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "aucune",
        "detail": "« Bogazici University does not offer scholarships or financial aid to international students » — dit par l'université elle-même. Les boursiers Türkiye Bursları y étudient en revanche sans payer, la bourse couvrant les frais.",
        "source": "https://intl.bogazici.edu.tr/tuition-undergraduate-and-graduate-degree-programs",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 53 (frais réels, tranche suivante par exposition) — lu sur les pages officielles le 2026-09-13 ; voir scripts/data/journal-frais-suite-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "istanbul-technical-university-istanbul",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.sis.itu.edu.tr/EN/student/tuition-fee/fees/20261020/tutionfees.php",
        "verifieLe": "2026-09-13",
        "note": "Grille officielle 2025-26, étudiant admis sous quota international, PAR AN en deux versements. Licence, entrée 2023-24 et après : de 79 000 TL (arts et sciences) à 264 000 TL (conservatoire) selon la faculté ; ingénierie civile 94 500 TL. Master : 33 300 TL pour les entrées 2024-25 et 2025-26. Montant retenu en licence : 79 000 TL, le plus bas de la grille. Aucune conversion en dollars sur cette page.",
        "licence": {
          "montant": 79000,
          "devise": "TRY",
          "periode": "an"
        },
        "master": {
          "montant": 33300,
          "devise": "TRY",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "inconnue",
        "detail": "Aucune exonération mentionnée sur la grille ; les boursiers Türkiye Bursları sont pris en charge par la bourse.",
        "source": "https://www.sis.itu.edu.tr/EN/student/intenational-students/tuitions.php",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 53 (frais réels, tranche suivante par exposition) — lu sur les pages officielles le 2026-09-13 ; voir scripts/data/journal-frais-suite-2026-09-13.md."
  }
];
