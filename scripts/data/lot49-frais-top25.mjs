/**
 * ============================================================
 * LOT 49-FRAIS-TOP25 — deuxième tranche (12 septembre 2026)
 * ============================================================
 *
 * Suite du lot 48 : onze universités de plus parmi les 25 qui font
 * 80 % des affichages (Hamburg, Hannover, Bilkent, Tokyo, Ashesi,
 * Imperial, SNU, KAIST, Bocconi, Edinburgh, Beihang). Restent à
 * ouvrir par Charles : Fudan, Humboldt, Politecnico di Milano, McGill
 * — voir la section « À ouvrir toi-même » du journal.
 *
 * CE QUE CETTE TRANCHE APPREND
 * ----------------------------
 * - Allemagne : AUCUN frais de scolarité, hors UE compris (Hambourg,
 *   Hanovre) ; seule une contribution semestrielle de 400-450 € qui
 *   inclut le ticket de transport national. Le montant écrit est cette
 *   contribution annualisée, et la note le dit.
 * - KAIST : tout international admis en licence reçoit d'office
 *   l'exemption totale + 350 000 ₩/mois ; le montant des frais n'est
 *   même pas publié pour eux — la fiche porte l'exonération, pas de
 *   montant, et c'est exact.
 * - Edinburgh : 622 programmes lus d'un coup dans la grille officielle,
 *   deux tarifs (29 600 £ / 38 900 £) ; le montant retenu est le tarif
 *   majoritaire et la note donne l'autre.
 * - Devises nouvelles : JPY, KRW, CNY, GBP, USD. js/frais.js ne connaît
 *   des seuils de bande que pour l'euro — ces montants s'afficheront
 *   avec la bande « inconnu » tant que SEUILS_PAR_DEVISE ne les porte
 *   pas. C'est voulu (un seuil se pose à la main, avec une source, pas
 *   par taux de change) et c'est le prochain lot.
 *
 * Même règle de preuve que les lots 45 et 48.
 * ============================================================
 */

export const PATCHES = [
  {
    "collection": "universities",
    "id": "universitat-hamburg-hamburg",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.uni-hamburg.de/campuscenter/aktuelles/2026-07-23-semesterbeitrag-wise-2026.html",
        "verifieLe": "2026-09-12",
        "note": "Pas de frais de scolarité (supprimés à Hambourg depuis le semestre d'hiver 2012-13, pour tous, hors UE compris). Seule une contribution semestrielle obligatoire : 402 € pour le semestre d'hiver 2026-27 (services étudiants, AStA, Deutschlandticket de transport), soit 804 €/an. Licence, master et doctorat.",
        "licence": {
          "montant": 804,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 804,
          "devise": "EUR",
          "periode": "an"
        },
        "doctorat": {
          "montant": 804,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "systematique",
        "detail": "Aucun frais de scolarité à exonérer ; la contribution semestrielle est due par tous.",
        "source": "https://www.uni-hamburg.de/campuscenter/studienorganisation/studienverlauf/beitraege-gebuehren/studiengebuehren.html",
        "verifieLe": "2026-09-12"
      }
    },
    "motif": "Lot 49 (frais réels, 25 universités les plus montrées — deuxième tranche) — lu sur les pages officielles le 2026-09-12 ; voir scripts/data/journal-frais-top25-2026-09-12.md."
  },
  {
    "collection": "universities",
    "id": "leibniz-universitat-hannover-hannover",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.uni-hannover.de/studium/finanzierung-foerderung/studienkosten",
        "verifieLe": "2026-09-12",
        "note": "Pas de frais de scolarité, hors UE compris. Contribution semestrielle hiver 2026-27 : 453,16 € (Studentenwerk 130 €, Deutschlandticket 226,80 €, frais administratifs 75 €, étudiants 15,80 €…), soit 906 €/an. Attention : 500 €/semestre de frais de longue durée une fois le crédit d'études épuisé (12 semestres en licence, 16 en master).",
        "licence": {
          "montant": 906,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 906,
          "devise": "EUR",
          "periode": "an"
        },
        "doctorat": {
          "montant": 906,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "systematique",
        "detail": "Aucun frais de scolarité à exonérer ; la contribution semestrielle est due par tous.",
        "source": "https://www.uni-hannover.de/studium/finanzierung-foerderung/studienkosten",
        "verifieLe": "2026-09-12"
      }
    },
    "motif": "Lot 49 (frais réels, 25 universités les plus montrées — deuxième tranche) — lu sur les pages officielles le 2026-09-12 ; voir scripts/data/journal-frais-top25-2026-09-12.md."
  },
  {
    "collection": "universities",
    "id": "bilkent-university-ankara",
    "champs": {
      "fraisScolarite": {
        "source": "https://w3.bilkent.edu.tr/bilkent/international-and-other-students-tuition-fees/",
        "verifieLe": "2026-09-12",
        "note": "Licence, étudiant international admis en 2026 : 18 400 $ US par an TVA comprise (17 600 $ pour un admis 2025), en deux versements. Master et doctorat : non indiqués sur cette page.",
        "licence": {
          "montant": 18400,
          "devise": "USD",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Bilkent attribue des bourses d'exemption partielle ou totale sur les résultats d'admission (les titulaires d'une bourse de 50 % paient la moitié) ; la page des internationaux n'en détaille pas les critères — à vérifier au moment de la candidature.",
        "source": "https://w3.bilkent.edu.tr/bilkent/tuition-fees/",
        "verifieLe": "2026-09-12"
      }
    },
    "motif": "Lot 49 (frais réels, 25 universités les plus montrées — deuxième tranche) — lu sur les pages officielles le 2026-09-12 ; voir scripts/data/journal-frais-top25-2026-09-12.md."
  },
  {
    "collection": "universities",
    "id": "university-of-tokyo-tokyo",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.u-tokyo.ac.jp/en/prospective-students/tuition_fees.html",
        "verifieLe": "2026-09-12",
        "note": "Frais nationaux japonais, identiques pour les internationaux : licence 642 960 ¥/an, master 535 800 ¥/an, doctorat 520 800 ¥/an ; plus un droit d'admission unique de 282 000 ¥ et des frais d'examen (4 000 à 30 000 ¥). Les boursiers du gouvernement japonais (MEXT) ne paient ni scolarité ni admission.",
        "licence": {
          "montant": 642960,
          "devise": "JPY",
          "periode": "an"
        },
        "master": {
          "montant": 535800,
          "devise": "JPY",
          "periode": "an"
        },
        "doctorat": {
          "montant": 520800,
          "devise": "JPY",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Exonération totale pour les boursiers MEXT. Pour les autres, un dispositif d'exemption de scolarité et d'admission existe sur dossier (difficulté financière + résultats), contingenté par semestre.",
        "source": "https://www.u-tokyo.ac.jp/en/prospective-students/tuition_fees.html",
        "verifieLe": "2026-09-12"
      }
    },
    "motif": "Lot 49 (frais réels, 25 universités les plus montrées — deuxième tranche) — lu sur les pages officielles le 2026-09-12 ; voir scripts/data/journal-frais-top25-2026-09-12.md."
  },
  {
    "collection": "universities",
    "id": "ashesi-university-berekuso",
    "champs": {
      "fraisScolarite": {
        "source": "https://ashesi.edu.gh/how-to-apply/",
        "verifieLe": "2026-09-12",
        "note": "Étudiant international : 4 553 $ US de scolarité par « term » (semestre ; l'année en compte deux), soit 9 106 $/an, licence comme master ; logement 803 $/term, assurance santé 160 $, cotisation étudiante 20 $. Les Ghanéens paient en cedis (53 498 GHS/term).",
        "licence": {
          "montant": 9106,
          "devise": "USD",
          "periode": "an"
        },
        "master": {
          "montant": 9106,
          "devise": "USD",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Aide financière SUR BESOIN uniquement (aucune bourse au mérite en licence) : remplir le formulaire d'aide en indiquant le montant nécessaire. Ashesi accueille aussi les boursiers Mastercard Foundation.",
        "source": "https://ashesi.edu.gh/how-to-apply/",
        "verifieLe": "2026-09-12"
      }
    },
    "motif": "Lot 49 (frais réels, 25 universités les plus montrées — deuxième tranche) — lu sur les pages officielles le 2026-09-12 ; voir scripts/data/journal-frais-top25-2026-09-12.md."
  },
  {
    "collection": "universities",
    "id": "imperial-college-london-london",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.imperial.ac.uk/students/fees-and-funding/tuition-fees/undergraduate-tuition-fees/2026-27/faculty-of-engineering/",
        "verifieLe": "2026-09-12",
        "note": "Licence, cohorte 2026, étudiant « overseas » : 45 500 £ par an dans tous les départements d'ingénierie (Computing, Mechanical, Civil, Electrical, Aeronautics, Chemical, Bioengineering, Materials, Design…). Sciences naturelles, médecine et business : montants sur les pages de chaque faculté, non relevés ici (médecine nettement plus élevée). Master et doctorat : sur la page de chaque cours.",
        "licence": {
          "montant": 45500,
          "devise": "GBP",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Pas d'exonération sur dossier. Bourses au mérite : President's PhD Scholarships (doctorat, complètes), programmes partenaires (GREAT, DAAD, Women in STEM…) ; moteur de recherche de bourses sur le site.",
        "source": "https://www.imperial.ac.uk/study/fees-and-funding/tuition-fees/",
        "verifieLe": "2026-09-12"
      }
    },
    "motif": "Lot 49 (frais réels, 25 universités les plus montrées — deuxième tranche) — lu sur les pages officielles le 2026-09-12 ; voir scripts/data/journal-frais-top25-2026-09-12.md."
  },
  {
    "collection": "universities",
    "id": "seoul-national-university-seoul",
    "champs": {
      "fraisScolarite": {
        "source": "https://en.snu.ac.kr/academics/resources/registration",
        "verifieLe": "2026-09-12",
        "note": "SNU ne publie qu'une moyenne : 6 034 163 ₩ par an en licence (chiffre 2024), variable selon la filière (les sciences, l'ingénierie et la médecine au-dessus, les humanités en dessous) et le nombre de crédits ; identique pour les internationaux. Master et doctorat : grille non publiée sur cette page.",
        "licence": {
          "montant": 6034163,
          "devise": "KRW",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Pas d'exonération sur dossier à l'université elle-même. Le GKS (bourse du gouvernement coréen, candidature via l'ambassade en septembre) couvre la totalité des frais sur 8 semestres, 1 200 000 ₩/mois, le billet et un an de coréen.",
        "source": "https://en.snu.ac.kr/admission/undergraduate/scholarships/before_admission",
        "verifieLe": "2026-09-12"
      }
    },
    "motif": "Lot 49 (frais réels, 25 universités les plus montrées — deuxième tranche) — lu sur les pages officielles le 2026-09-12 ; voir scripts/data/journal-frais-top25-2026-09-12.md."
  },
  {
    "collection": "universities",
    "id": "kaist-daejeon",
    "champs": {
      "fraisScolarite": {
        "source": "https://admission.kaist.ac.kr/intl-undergraduate/support/scholarships/kaist",
        "verifieLe": "2026-09-12",
        "note": "Le montant des frais n'est pas publié sur la page des admissions internationales, et il est sans objet pour la licence : tout étudiant international admis reçoit la KAIST International Student Scholarship (exemption totale des frais sur 8 semestres). Master et doctorat : en général financés par le laboratoire ou le programme, non relevé ici."
      },
      "exoneration": {
        "politique": "systematique",
        "detail": "« Upon being selected for admission, you will automatically be entitled to the KAIST Scholarship » : exemption totale des frais sur 8 semestres, 350 000 ₩/mois d'allocation et assurance santé, maintenue avec une moyenne supérieure à 2,7/4,3 après la première année.",
        "source": "https://admission.kaist.ac.kr/intl-undergraduate/support/scholarships/kaist",
        "verifieLe": "2026-09-12"
      }
    },
    "motif": "Lot 49 (frais réels, 25 universités les plus montrées — deuxième tranche) — lu sur les pages officielles le 2026-09-12 ; voir scripts/data/journal-frais-top25-2026-09-12.md."
  },
  {
    "collection": "universities",
    "id": "universita-bocconi-milan",
    "champs": {
      "fraisScolarite": {
        "source": "https://bit.unibocconi.it/hc/en-us/articles/17777210729362-Academic-tuition-and-fees-a-y-2026-27-Amounts-and-installments",
        "verifieLe": "2026-09-12",
        "note": "Université privée : 2026-27, plein tarif identique pour tous — 17 000 €/an en bachelor (BSc et droit), 18 550 €/an en master of science. Pas de forfait par nationalité comme dans les universités publiques italiennes.",
        "licence": {
          "montant": 17000,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 18550,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Bocconi attribue des exonérations partielles ou totales au mérite et sur besoin (Bocconi International Awards, aides sur revenus) ; les candidats sont examinés sur dossier. Montants et nombre de bénéficiaires non lus sur les pages accessibles — à vérifier sur la page « Funding » du programme visé.",
        "source": "https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/fees",
        "verifieLe": "2026-09-12"
      }
    },
    "motif": "Lot 49 (frais réels, 25 universités les plus montrées — deuxième tranche) — lu sur les pages officielles le 2026-09-12 ; voir scripts/data/journal-frais-top25-2026-09-12.md."
  },
  {
    "collection": "universities",
    "id": "university-of-edinburgh-edinburgh",
    "champs": {
      "fraisScolarite": {
        "source": "https://registryservices.ed.ac.uk/tuition-fees/find/undergraduate/2026-2027/full-time-new-students",
        "verifieLe": "2026-09-12",
        "note": "Licence, nouveaux entrants 2026-27, tarif international (622 programmes lus) : 29 600 £/an pour les lettres, sciences sociales, droit, business et mathématiques ; 38 900 £/an pour les sciences, l'informatique, l'ingénierie et les arts ; 37 500 £ en médecine (BMedSci). Tarif fixé pour toute la durée du cursus. Montant retenu : le tarif majoritaire (352 programmes sur 622). Master et doctorat : grille séparée, non relevée.",
        "licence": {
          "montant": 29600,
          "devise": "GBP",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Pas d'exonération sur dossier ; bourses au mérite et bourses par pays (dont pour l'Afrique) à chercher dans le moteur de bourses de l'université.",
        "source": "https://www.ed.ac.uk/studying/international/finances",
        "verifieLe": "2026-09-12"
      }
    },
    "motif": "Lot 49 (frais réels, 25 universités les plus montrées — deuxième tranche) — lu sur les pages officielles le 2026-09-12 ; voir scripts/data/journal-frais-top25-2026-09-12.md."
  },
  {
    "collection": "universities",
    "id": "beihang-university-pekin",
    "champs": {
      "fraisScolarite": {
        "source": "https://is.buaa.edu.cn/en/lxsq/yjs/ssyjs.htm",
        "verifieLe": "2026-09-12",
        "note": "Master international : 35 000 ¥ (CNY) par an, plus 400 ¥ de frais de dossier et 800 ¥/an d'assurance ; logement 30 ¥/jour et par lit à Pékin. Licence et doctorat : pages non lues (adresses cassées) — montants à relever.",
        "master": {
          "montant": 35000,
          "devise": "CNY",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Trois bourses sur dossier : bourse du gouvernement chinois (CSC, frais + logement + allocation), bourse du gouvernement de Pékin, bourse Beihang pour étudiants étrangers. Critères et montants sur la page des bourses de l'école internationale.",
        "source": "https://is.buaa.edu.cn/en/lxsq/yjs/ssyjs.htm",
        "verifieLe": "2026-09-12"
      }
    },
    "motif": "Lot 49 (frais réels, 25 universités les plus montrées — deuxième tranche) — lu sur les pages officielles le 2026-09-12 ; voir scripts/data/journal-frais-top25-2026-09-12.md."
  }
];
