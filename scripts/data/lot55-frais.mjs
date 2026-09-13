/**
 * ============================================================
 * LOT 55-FRAIS — Humboldt, Debrecen, Semmelweis (13 septembre 2026)
 * ============================================================
 *
 * Lot court, et assumé comme tel : il contient la plus grosse prise du
 * chantier et le constat qui explique pourquoi il n'en contient que
 * trois.
 *
 * HUMBOLDT : LA FICHE LA PLUS MONTRÉE DU CATALOGUE EST QUASI GRATUITE.
 * 252 profils sur 360 la voient, et elle n'avait aucun prix depuis le
 * début. Réponse : AUCUN droit de scolarité — le Land de Berlin n'en
 * facture à personne, quelle que soit la nationalité — et 763,60 €/an
 * de contribution de semestre, dont 234,80 € qui sont en réalité un
 * abonnement de transport valable dans toute l'Allemagne. C'est le
 * meilleur rapport du catalogue pour un étudiant africain autofinancé,
 * et personne ne pouvait le savoir en lisant le site.
 *
 * LA HONGRIE NE SE LAISSE PAS FAIRE PAR UNIVERSITÉ. Onze établissements
 * hongrois n'ont aucun prix. Deux seulement publient une grille
 * centrale lisible :
 *   - Debrecen, exemplaire : une page unique, tous les cursus, en
 *     dollars, assurance santé comprise dans les droits ;
 *   - Semmelweis, qui affiche par semestre et FIGE le tarif à l'année
 *     d'entrée pour toute la durée du cursus.
 * Les trois autres grandes — Szeged, Pécs, ELTE — n'ont pas de grille
 * centrale : Szeged renvoie vers une page morte de 2019 et éclate ses
 * tarifs par faculté, ELTE écrit noir sur blanc que « les frais varient
 * selon le programme » sans en publier un seul, Pécs met sa page
 * derrière une inscription. Les six petites n'ont pas été ouvertes.
 * Conclusion : finir la Hongrie n'est pas un lot de frais, c'est une
 * lecture PROGRAMME PAR PROGRAMME. À décider avec Charles, pas à
 * improviser.
 *
 * MÉTHODE — CORRECTION IMPORTANTE (2026-09-13).
 * Les lots 48 à 54 ont classé les universités par « exposition »,
 * c'est-à-dire par le nombre de profils du radar qui les voient dans le
 * DIAGNOSTIC. C'était la mauvaise mesure : universities.html liste les
 * 155 établissements en accès libre, avec un filtre par coût. Les 86
 * universités « jamais montrées » sont donc à un clic de l'accueil, et
 * elles affichent « Frais non vérifiés » juste à côté d'un filtre qui
 * ne sait pas les ranger. Le bon ordre pour la suite est PAR PAYS,
 * puisque c'est ainsi que la page est rangée : Hongrie 11 manquantes
 * sur 11, France 11 sur 26, Chine 10 sur 16, Italie 5 sur 16, puis
 * Algérie, Rwanda et Tunisie (aucun prix nulle part).
 *
 * Au passage, vérifié : si le diagnostic ne montre que 56 universités
 * sur 155, ce n'est PAS un défaut. Une opportunité = une bourse, donc
 * Eiffel (24 universités) n'en fait remonter que 2, le CSC (15) que 6,
 * Stipendium Hungaricum (11) qu'une seule ; et 22 établissements sont
 * muets parce que toutes leurs bourses sont fermées. Le filtre fait ce
 * pour quoi il a été écrit.
 * ============================================================
 */

export const PATCHES = [
  {
    "collection": "universities",
    "id": "humboldt-universitat-zu-berlin-berlin",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.hu-berlin.de/fileadmin/Dokumentenpool/Studium/Sonstiges/Semesterbeitraege_und_gebuehren_2026_WiSe.pdf",
        "verifieLe": "2026-09-13",
        "note": "AUCUN droit de scolarite : le Land de Berlin n'en facture a personne, quelle que soit la nationalite. Il reste la seule contribution de semestre, document officiel du 24.06.2026 pour le semestre d'hiver 2026-27 : frais de semestre 50 EUR, contribution a la Studierendenschaft 12 EUR, contribution au Studierendenwerk 85 EUR, Deutschlandsemesterticket 234,80 EUR, soit 381,80 EUR par semestre et 763,60 EUR par an. Plus de la moitie de cette somme (234,80 EUR) est un abonnement de transport valable dans toute l'Allemagne pendant six mois, pas une taxe. Penalite de retard eventuelle : 19,94 EUR. Meme montant en licence, master et doctorat.",
        "licence": {
          "montant": 764,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 764,
          "devise": "EUR",
          "periode": "an"
        },
        "doctorat": {
          "montant": 764,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "systematique",
        "detail": "Il n'y a pas de droits de scolarite a Berlin : la loi du Land les supprime pour tous les etudiants, y compris hors Union europeenne, sans aucune demande a deposer. La contribution de semestre, elle, est due par tout le monde et n'est pas exoneree ; les etudiants en difficulte peuvent demander une prise en charge du Semesterticket aupres du fonds social (Semtix) gere par le RefRat.",
        "source": "https://www.hu-berlin.de/fileadmin/Dokumentenpool/Studium/Sonstiges/Semesterbeitraege_und_gebuehren_2026_WiSe.pdf",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 55 (frais reels) — lu sur les pages officielles le 2026-09-13 ; voir scripts/data/journal-frais-lot55-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "university-of-debrecen-debrecen",
    "champs": {
      "fraisScolarite": {
        "source": "https://edu.unideb.hu/p/tuition-fee-application-entrance-fee",
        "verifieLe": "2026-09-13",
        "note": "Grille officielle 2026-27, facturee en DOLLARS et par annee. Licence : sciences (biologie, chimie, physique, maths, geographie) 6 500 USD ; informatique et agro-economie 7 000 USD ; toutes les ingenieries, commerce, informatique de gestion 7 500 USD ; lettres, psychologie, communication et musique 10 000 USD. Master : economie, droit LL.M, sciences, informatique, data science 7 500 USD ; ingenieries et agronomie 8 000 USD ; musique 10 000 USD. Doctorat : 6 500 USD dans la plupart des ecoles, 10 000 USD en mecanique, 12 500 USD en management. Sante, a part et bien plus cher : medecine 16 900 USD/an sur 12 semestres, dentaire 17 500 USD sur 10 semestres, pharmacie 8 000 USD, soins infirmiers 7 500 USD. Frais de dossier 150 USD et examen d'entree 350 USD, non remboursables. L'assurance sante et la carte d'etudiant sont COMPRISES dans les droits. Montants retenus : 7 500 USD en licence (le bloc des ingenieries et du commerce), 7 500 USD en master, 6 500 USD en doctorat. Les droits deja verses sont rembourses si le visa est refuse.",
        "licence": {
          "montant": 7500,
          "devise": "USD",
          "periode": "an"
        },
        "master": {
          "montant": 7500,
          "devise": "USD",
          "periode": "an"
        },
        "doctorat": {
          "montant": 6500,
          "devise": "USD",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Aucune reduction de droit pour un candidat autofinance. La bourse Stipendium Hungaricum, ouverte aux ressortissants de nombreux pays africains via un accord bilateral, couvre en revanche la TOTALITE des droits, plus une allocation mensuelle, le logement et l'assurance ; elle se demande aupres de l'autorite nationale du pays du candidat, pas aupres de l'universite. Debrecen gere aussi les programmes Scholarship for Christian Young People et Diaspora.",
        "source": "https://edu.unideb.hu/p/tuition-fee-application-entrance-fee",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 55 (frais reels) — lu sur les pages officielles le 2026-09-13 ; voir scripts/data/journal-frais-lot55-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "semmelweis-university-budapest",
    "champs": {
      "fraisScolarite": {
        "source": "https://semmelweis.hu/registrar/faq/how-much-is-the-tuition-fee-per-semester/",
        "verifieLe": "2026-09-13",
        "note": "Universite medicale : les droits sont affiches PAR SEMESTRE et en dollars, et ils sont FIGES A L'ANNEE D'ENTREE pour toute la duree du cursus. Entree 2026 : medecine generale 10 450 USD/semestre, dentaire 10 450 USD/semestre, pharmacie 6 620 USD/semestre — soit 20 900 USD/an en medecine et dentaire, 13 240 USD/an en pharmacie. S'y ajoutent des frais de materiel a partir de la deuxieme annee : dentaire 1 300 USD en 2e annee puis 2 600 USD par an, pharmacie 400 puis 800 USD. Redoubler ou revenir apres un semestre d'interruption fait basculer sur le tarif de l'annee de reprise, plus eleve. Frais de dossier 75 EUR. Montants retenus : medecine generale, le cursus phare. Les licences de la faculte des sciences de la sante et la faculte Peto (4 640 EUR/semestre) ont leurs propres grilles, non lues. Doctorat : grille non lue.",
        "licence": {
          "montant": 20900,
          "devise": "USD",
          "periode": "an"
        },
        "master": {
          "montant": 20900,
          "devise": "USD",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Aucune reduction pour un candidat autofinance, sauf 50 % pour les anciens etudiants de Semmelweis. La bourse Stipendium Hungaricum couvre en revanche la totalite des droits, plus allocation, logement et assurance ; elle se demande aupres de l'autorite nationale du pays du candidat. Semmelweis attribue aussi la Pannonia In Excellence Scholarship.",
        "source": "https://semmelweis.hu/registrar/faq/how-much-is-the-tuition-fee-per-semester/",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 55 (frais reels) — lu sur les pages officielles le 2026-09-13 ; voir scripts/data/journal-frais-lot55-2026-09-13.md."
  }
];
