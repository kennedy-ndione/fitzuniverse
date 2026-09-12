/**
 * ============================================================
 * LOT 50-FRAIS-TOP25 — dernière tranche (12 septembre 2026)
 * ============================================================
 *
 * Les trois universités que les lots 48 et 49 n'avaient pas pu lire
 * seules, relevées À DEUX : Charles a ouvert dans son navigateur ce
 * que mes lectures ne pouvaient pas atteindre — le fichier Excel des
 * tarifs de Fudan (transmis tel quel), le PDF de McGill page par page
 * (qui a révélé que ma lecture automatique confondait le BA&BSc combiné
 * avec le BA, et le BEd avec le BSc : 56 000,10 $ n'était pas le BA,
 * 31 836,60 $ n'était pas la Science), et la page « Tuition fees » de
 * Polimi que le site refusait à mes appels.
 *
 * LEÇON, à garder : une lecture automatique d'un PDF à plusieurs pages
 * peut RÉ-ÉTIQUETER un chiffre juste. La règle « ne pas écrire un
 * montant sur lequel on a un doute » a évité d'inscrire 56 000 $ en
 * face de « Arts » à McGill. Quand un chiffre contredit ce qu'on sait
 * d'un établissement, on ouvre la page, on n'arbitre pas.
 *
 * HUMBOLDT reste la seule des 25 sans relevé : site refondu le mois
 * dernier, aucune page de frais retrouvée ni par mes appels ni par la
 * recherche interne. Règle allemande connue (pas de frais de scolarité,
 * ~300 €/semestre de contribution) mais NON ÉCRITE : le catalogue ne
 * porte que ce qui a été lu.
 * ============================================================
 */

export const PATCHES = [
  {
    "collection": "universities",
    "id": "politecnico-di-milano-milan",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.polimi.it/en/students/tuition-fees-scholarships-and-financial-aid/tuition-fees",
        "verifieLe": "2026-09-12",
        "note": "2026-27, licence et master : contribution « tout compris » en deux versements — 880,04 € puis de 0 à 3 003 € selon le revenu familial —, plus taxe régionale (130 à 190 €), timbre 16 € et assurances 11 €, soit au plus environ 4 100 €/an. Pas de forfait par nationalité : un étudiant dont la famille a ses revenus à l'étranger fait calculer un ISEEU « parificato » par un CAF conventionné, qui fixe le second versement.",
        "licence": {
          "montant": 4100,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 4100,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Réduction du second versement (jusqu'à 0 €) selon l'ISEEU parificato, à demander avant l'inscription depuis l'étranger (procédure en ligne du CAF). Bourses au mérite pour internationaux (Merit Project, exemptions de première année de master) et appel annuel DSU (bourses du droit aux études).",
        "source": "https://www.polimi.it/en/students/tuition-fees-scholarships-and-financial-aid/tuition-fees",
        "verifieLe": "2026-09-12"
      }
    },
    "motif": "Lot 50 (frais réels, 25 universités les plus montrées — dernière tranche, sites lus avec l'aide de Charles) — 2026-09-12 ; voir scripts/data/journal-frais-top25-2026-09-12.md."
  },
  {
    "collection": "universities",
    "id": "fudan-university-shanghai",
    "champs": {
      "fraisScolarite": {
        "source": "https://iso.fudan.edu.cn/_upload/article/files/22/0d/d9cbe08947b29dfe2c7f3626e15e/efb0e74d-2f86-4b1a-a08a-7f4405bd7a9b.xlsx",
        "verifieLe": "2026-09-12",
        "note": "Grille 2026 des licences enseignées en chinois (fichier officiel de l'International Students Office, lu par Charles) : lettres, droit, économie, gestion, sciences sociales 23 000 ¥/an ; sciences, informatique, ingénierie 26 000 ¥/an ; médecine, pharmacie, soins infirmiers 42 000 ¥/an. Montant retenu : 23 000 (majors « Arts »). Frais de dossier 800 ¥. Master et doctorat : non lus. « À titre indicatif, montant exact annoncé à l'inscription. »",
        "licence": {
          "montant": 23000,
          "devise": "CNY",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Bourses sur dossier : bourse du gouvernement chinois (CSC), bourse du gouvernement de Shanghai, bourses Fudan — page « Scholarships » de l'ISO.",
        "source": "https://iso.fudan.edu.cn/isoenglish/main.htm",
        "verifieLe": "2026-09-12"
      }
    },
    "motif": "Lot 50 (frais réels, 25 universités les plus montrées — dernière tranche, sites lus avec l'aide de Charles) — 2026-09-12 ; voir scripts/data/journal-frais-top25-2026-09-12.md."
  },
  {
    "collection": "universities",
    "id": "mcgill-university-montreal",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.mcgill.ca/student-accounts/files/student-accounts/new_intl_ugrad_degree_students_admitted_2026-27_0.pdf",
        "verifieLe": "2026-09-12",
        "note": "Grille officielle 2026-27 (PDF, lu page par page par Charles), étudiant international admis à l'automne 2026, scolarité seule pour 30 crédits : Bachelor of Arts 54 000 $ CA ; Bachelor of Engineering 65 167,50 $ ; Éducation et kinésiologie 31 836,60 $ ; Arts & Science combiné 56 000,10 $. Ajouter environ 3 500 $ de frais et d'assurances. Tarif garanti pour toute la durée du programme. Montant retenu : le BA. Bachelor of Science seul et master : non relevés.",
        "licence": {
          "montant": 54000,
          "devise": "CAD",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Pas d'exonération sur dossier pour les internationaux ; bourses d'entrée au mérite (Entrance Scholarships, de 3 000 $ à 12 000 $/an) et quelques bourses sur besoin, examinées à la candidature.",
        "source": "https://www.mcgill.ca/student-accounts/tuition-fees/general-tuition-and-fees-information/tuition-fees-2026-27",
        "verifieLe": "2026-09-12"
      }
    },
    "motif": "Lot 50 (frais réels, 25 universités les plus montrées — dernière tranche, sites lus avec l'aide de Charles) — 2026-09-12 ; voir scripts/data/journal-frais-top25-2026-09-12.md."
  }
];
