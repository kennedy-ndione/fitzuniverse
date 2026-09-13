/**
 * ============================================================
 * LOT 57-FRAIS — LES 84 DERNIERES UNIVERSITES (13 septembre 2026)
 * ============================================================
 *
 * Le chantier des frais se termine ici. Toutes les universites du
 * catalogue ont ete ouvertes : 74 ont un prix verifie, 10 sont
 * documentees comme NON PUBLIEES plutot que devinees.
 *
 * METHODE — pourquoi ce lot tient en une seance et pas en deux jours.
 * Les lots 48 a 56 avancaient une universite a la fois. Ici, huit
 * lecteurs ont travaille EN PARALLELE, un par bloc de pays, chacun dans
 * son propre onglet, avec la meme consigne dure : sources officielles
 * uniquement (domaine de l'etablissement ou domaine gouvernemental),
 * agregateurs interdits nommement, et « NON_TROUVE » plutot qu'une
 * estimation. Dix fiches sont revenues sans prix : c'est le prix a payer
 * pour qu'aucune des 74 autres ne soit inventee.
 *
 * CE QUE CE LOT APPREND, ET QUI CHANGE LE CONSEIL
 * -----------------------------------------------
 * - LA QUESTION ARES EST TRANCHEE. La circulaire n° 2026-001 du 12
 *   fevrier 2026 a ete lue : LE SENEGAL FIGURE A L'ANNEXE 1, en position
 *   33. Un etudiant senegalais paie donc 1 194 EUR a l'ULB, a l'ULiege
 *   et a Namur, et non 5 369 EUR. C'etait la question ouverte depuis le
 *   lot 54 ; elle vaut un facteur 4,5.
 * - LA FRANCE N'A PAS UN PRIX, ELLE EN A CINQ. Le meme arrete national
 *   (2 902 EUR en licence, 3 950 en master) donne, selon la politique
 *   d'exoneration de chaque etablissement : 178/255 EUR a Toulouse,
 *   Paris-Saclay et Grenoble, 650/950 EUR a Rennes, et le plein tarif a
 *   Lille, en Lorraine et a Sorbonne Paris Nord. Le doctorat, lui,
 *   n'est JAMAIS assujetti : 398 EUR partout. Et un plafond nouveau
 *   pese sur tout cela — le decret n° 2026-385 du 19 mai 2026 limite les
 *   exonerations a 30 % des inscrits hors UE en 2026-2027, 25 % en
 *   2027-2028, 20 % ensuite.
 * - NAPLES EXONERE TOTALEMENT LES HORS UE, par la seule nationalite :
 *   184 EUR/an de taxe regionale et de timbre. C'est le sixieme
 *   dispositif italien rencontre, et le plus genereux. Mais Genes, juste
 *   a cote, n'a rien de tel : 3 025 EUR sans ISEE parificato. La regle
 *   reste par universite, jamais par pays.
 * - TROIS ETABLISSEMENTS D'ELITE SONT GRATUITS POUR QUI EST ADMIS :
 *   la Scuola Normale Superiore (scolarite, pension complete, logement
 *   et bourse), POSTECH (bourse complete automatique en licence, revenu
 *   mensuel en master et doctorat), et les masters recherche et
 *   doctorats de Koc et Sabanci. Le concours est le seul obstacle.
 * - L'ARABIE SAOUDITE PREND TOUT EN CHARGE : les 27 universites
 *   publiques accueillent les internationaux admis sans frais, avec
 *   logement, allocation et billet d'avion. Le visa d'etudes n'est
 *   d'ailleurs delivre qu'a un candidat DEJA boursier.
 * - JNU DELHI EST LA MOINS CHERE DU CATALOGUE : 800 USD/an, et son
 *   bareme officiel a une colonne « Afrique et Amerique latine »
 *   explicitement moins chere que celle des autres pays.
 * - A L'INVERSE, TROIS PAYS MAJORENT LES AFRICAINS : Wits double le
 *   tarif local hors Afrique australe, l'USIU du Kenya ajoute 30 %,
 *   Zurich et Fribourg appliquent un supplement etranger. Ce sont des
 *   informations, pas des oublis.
 * - CMU-AFRICA A DEUX TARIFS : 16 000 USD/an pour un Africain, 60 300
 *   pour un non-Africain. Rare, et decisif pour notre public.
 *
 * PIEGES TECHNIQUES TRAITES DANS CE LOT
 * -------------------------------------
 * - Tous les montants sont ramenes a l'ANNEE. Les tarifs affiches par
 *   semestre (Suisse, Hongrie, Coree, USIU, JNU, UKM) sont doubles ;
 *   ceux affiches au programme (Universiti Malaya, KTH, Goteborg) sont
 *   divises par la duree officielle. Chaque note le dit.
 * - Quatre devises de plus dans js/frais.js : SEK, MYR, INR et SAR,
 *   converties aux cours BCE du 11 septembre 2026, le riyal saoudien au
 *   cours de la Banque centrale de Russie faute de cotation BCE.
 * - KES et RWF restent SANS seuil, volontairement : aucun cours officiel
 *   lisible ce jour-la. Les montants s'affichent, la bande reste
 *   « inconnu ». Deux tests verrouillent ce choix pour qu'il reste
 *   conscient.
 *
 * LES DIX SANS PRIX, ET POURQUOI
 * ------------------------------
 * Cloudflare : Firenze, Trento (deux lecteurs, deux echecs).
 * Rien de publie : ESSEC (montant communique dans le contrat individuel),
 *   Cadi Ayyad, Hassan II, Mohammed V (les trois marocaines renvoient
 *   toutes a la voie diplomatique AMCI), JKUAT.
 * Pas de voie autofinancee du tout : AIMS Rwanda, AIMS Ghana et icipe ne
 *   recrutent que des boursiers a 100 %. Ce n'est pas un trou, c'est
 *   leur modele — et leur fiche porte quand meme l'exoneration.
 * ============================================================
 */

export const PATCHES = [
  {
    "collection": "universities",
    "id": "universite-de-lille-lille",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.univ-lille.fr/formation/droits-dinscription",
        "verifieLe": "2026-09-13",
        "note": "Annee 2026-2027. Droits differencies applicables aux etudiants extracommunautaires, montants du tableau officiel du ministere : 2 902 EUR en licence, 3 950 EUR en master. Les DOCTORANTS NE SONT PAS soumis aux droits differencies : ils paient le droit national de 398 EUR. S'ajoute la CVEC (105 EUR en 2026-2027). Lille renvoie a son propre PDF de montants sans les afficher dans le texte ; ce PDF n'a pas ete lu, ni le regime particulier des primo-inscrits 2025-2026 en master ou cycle ingenieur.",
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
        "detail": "Pas d'exoneration automatique des hors UE : il faut deposer une demande devant la commission d'exoneration de l'universite. Exoneration de plein droit pour les boursiers du gouvernement francais, les boursiers sur criteres sociaux et les pupilles. Depuis le decret n° 2026-385 du 19 mai 2026, les exonerations individuelles sont PLAFONNEES a 30 % des inscrits extracommunautaires en 2026-2027, 25 % en 2027-2028, 20 % ensuite.",
        "source": "https://www.univ-lille.fr/formation/exoneration",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "universite-de-lorraine-nancy",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.univ-lorraine.fr/enseignements-et-formations/sinscrire-a-l-universite-de-lorraine/",
        "verifieLe": "2026-09-13",
        "note": "Annee 2026-2027, montants lus sur le site de l'universite. Droits differencies en PREMIERE inscription : 2 902 EUR (licence, licence pro, BUT, cycle preparatoire ingenieur) et 3 950 EUR (master et cursus ingenieur). Les annees suivantes, l'etudiant qui poursuit sans interruption retombe aux droits communautaires : 178 EUR en licence, 255 EUR en master, 630 EUR en cursus ingenieur. Doctorat non assujetti : 398 EUR. S'ajoute la CVEC de 105 EUR. Non lues : la deliberation du CA du 07/11/2023 et le document d'elargissement des exonerations.",
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
        "detail": "La premiere annee se paie au tarif differencie plein. A partir de la deuxieme, l'etudiant international qui poursuit le meme cursus sans interruption beneficie d'une exoneration partielle et ne paie plus que les droits communautaires (178 / 255 / 630 EUR). En cas de redoublement ou de changement de cursus, l'exoneration n'est pas automatique et doit etre demandee. Plafond national de 30 % des inscrits hors UE en 2026-2027 (decret n° 2026-385 du 19 mai 2026).",
        "source": "https://www.univ-lorraine.fr/enseignements-et-formations/sinscrire-a-l-universite-de-lorraine/",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "universite-de-rennes-rennes",
    "champs": {
      "fraisScolarite": {
        "source": "https://formations.univ-rennes.fr/droits-dinscription-bourses-et-exonerations-pour-les-etudiantes-et-etudiants-internationaux",
        "verifieLe": "2026-09-13",
        "note": "Annee 2026-2027. Rennes MAINTIENT pour la rentree 2026 les regles de 2025-2026, au titre des dispositions transitoires du decret n° 2026-385 du 19 mai 2026 : un etudiant assujetti aux droits differencies paie donc 650 EUR en licence et 950 EUR en master, et non les 2 902 / 3 950 EUR nationaux. Cycle ingenieur 1 370 EUR. Doctorat non assujetti : 398 EUR. A partir de 2027-2028, les nouveaux inscrits et les changements de cycle passeront aux montants nationaux. S'ajoutent la CVEC et, selon les formations, des droits specifiques.",
        "licence": {
          "montant": 650,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 950,
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
        "politique": "systematique",
        "detail": "Les tarifs affiches sont DEJA le resultat d'une exoneration partielle generale, maintenue a titre transitoire pour 2026-2027 et appliquee sans demande individuelle. S'y ajoutent des exonerations automatiques (boursiers du gouvernement francais, accords de cooperation avec reciprocite) et des exonerations individuelles sur situation personnelle, dans la limite de 30 % des inscrits hors UE en 2026-2027, puis 25 % et 20 %.",
        "source": "https://formations.univ-rennes.fr/droits-dinscription-bourses-et-exonerations-pour-les-etudiantes-et-etudiants-internationaux",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "universite-de-toulouse-toulouse",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.utoulouse.fr/conseils/075-droits-dinscription-differencies-2026-2027",
        "verifieLe": "2026-09-13",
        "note": "Annee 2026-2027, deliberation n° 075 du conseil d'administration du 2 fevrier 2026. Toulouse EXONERE PARTIELLEMENT la TOTALITE des etudiants assujettis aux droits differencies : le hors UE paie le meme montant qu'un etudiant francais ou communautaire, soit 178 EUR en licence, 255 EUR en master, 398 EUR en doctorat. Sans cette exoneration le tarif serait de 2 902 / 3 950 EUR. S'ajoute la CVEC (105 EUR). RESERVE : la page de l'universite annonce que la deliberation specifique a la rentree 2026 est encore a venir, et la deliberation lue est anterieure au decret du 19 mai 2026 qui plafonne les exonerations — la FAQ ministerielle precise toutefois que les politiques portees a la connaissance des etudiants avant le 21 mai 2026 restent valables.",
        "licence": {
          "montant": 178,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 255,
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
        "politique": "systematique",
        "detail": "L'exoneration partielle est accordee a TOUS les etudiants extracommunautaires assujettis : la demande d'inscription vaut demande d'exoneration, aucune demarche supplementaire n'est requise, et elle est reconduite jusqu'a la fin du cycle, redoublements et prolongations compris. Exonerations totales possibles en plus pour les boursiers, pupilles, refugies, situations de grande precarite ou de handicap, apres evaluation sociale. Reserve : le plafond national de 30 % introduit par le decret du 19 mai 2026 est posterieur a cette deliberation.",
        "source": "https://www.utoulouse.fr/conseils/075-droits-dinscription-differencies-2026-2027",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "universite-grenoble-alpes-grenoble",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.univ-grenoble-alpes.fr/etudiants-internationaux-ce-que-change-le-nouveau-decret-sur-les-droits-d-inscription-a-l-uga-1775870.kjsp",
        "verifieLe": "2026-09-13",
        "note": "Annee 2026-2027, communique de l'UGA du 29 mai 2026 mis a jour le 11 septembre 2026. Annee de transition : l'etudiant hors UE DOIT demander l'exoneration et declarer ses ressources ; s'il l'obtient il ne paie que les droits nationaux, chiffres par l'UGA a 178 EUR en licence et 254 EUR en master. Sans exoneration : 2 902 EUR et 3 950 EUR. Doctorat non assujetti : 398 EUR. S'ajoute la CVEC. Non lus : le formulaire de demande et les regles propres aux etablissements-composantes (Polytech, IAE, Grenoble INP), exclus du dispositif central.",
        "licence": {
          "montant": 178,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 254,
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
        "detail": "Demande OBLIGATOIRE avec declaration de ressources et examen individuel. L'UGA annonce vouloir appliquer l'exoneration largement en 2026-2027, dans la limite des plafonds reglementaires (30 % des inscrits hors UE, puis 25 % et 20 %). Les etudiants deja exoneres avant l'entree en vigueur du decret gardent l'avantage jusqu'a la fin de leur cycle. Exonerations automatiques maintenues pour les boursiers du gouvernement francais, pupilles de la Nation et mobilites sous accord avec reciprocite.",
        "source": "https://www.univ-grenoble-alpes.fr/etudiants-internationaux-ce-que-change-le-nouveau-decret-sur-les-droits-d-inscription-a-l-uga-1775870.kjsp",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "universite-paris-saclay-orsay",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.universite-paris-saclay.fr/admission/droits-dinscription-de-luniversite-paris-saclay",
        "verifieLe": "2026-09-13",
        "note": "Annee 2026-2027, montants lus sur la page officielle : 178 EUR licence, 255 EUR master, 398 EUR doctorat. Paris-Saclay exonere partiellement les etudiants extracommunautaires assujettis aux droits differencies, ce qui ramene leurs droits au niveau des droits nationaux (deliberation n° CA-2026-013 du 3 fevrier 2026). Sans exoneration : 2 902 / 3 950 EUR. Un taux reduit existe pour une seconde inscription dans l'etablissement. S'ajoute la CVEC. Non lus : le texte integral de la deliberation et le PDF du tableau des droits.",
        "licence": {
          "montant": 178,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 255,
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
        "politique": "systematique",
        "detail": "Exoneration partielle presentee comme une politique d'attractivite s'appliquant aux etudiants extracommunautaires concernes par les droits differencies : elle porte les montants differencies au niveau des montants nationaux, selon la deliberation n° CA-2026-013 du 3 fevrier 2026. Des demandes complementaires peuvent etre deposees aupres de la commission locale d'exoneration de la composante. Reserve : le plafond national de 30 % du decret du 19 mai 2026 est posterieur a cette deliberation.",
        "source": "https://www.universite-paris-saclay.fr/admission/droits-dinscription-de-luniversite-paris-saclay",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "universite-sorbonne-paris-nord-villetaneuse",
    "champs": {
      "fraisScolarite": {
        "source": "https://inscriptions.univ-spn.fr/",
        "verifieLe": "2026-09-13",
        "note": "Annee 2026-2027. L'universite ecrit : « Comme toutes les universites d'Ile-de-France, l'universite Sorbonne Paris Nord applique les droits differencies » — 2 902 EUR en licence, 3 950 EUR en master pour les extracommunautaires. Doctorat non assujetti : 398 EUR. S'ajoute la CVEC. NON LU : la deliberation de la CFVU favorable a une exoneration partielle pour 2026-2027 (PDF non affichable) et le resultat du vote du CA du 10 juillet 2026 qui devait en fixer les modalites ; le site indique encore qu'elles seront precisees.",
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
        "politique": "inconnue",
        "detail": "L'universite applique les droits differencies et declare devoir appliquer le decret n° 2026-385 du 19 mai 2026. Une deliberation de la CFVU s'est prononcee favorablement sur une exoneration partielle pour 2026-2027, mais ses modalites devaient etre arretees par le CA du 10 juillet 2026 et ne sont pas publiees. A verifier directement aupres de la scolarite avant de budgeter.",
        "source": "https://inscriptions.univ-spn.fr/",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "ecole-normale-superieure-psl-paris",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.ens.psl.eu/sites/default/files/deliberation_ndeg2026-06_portant_approbation_des_criteres_et_de_la_procedure_dexoneration_des_droits_dinscription_pour_lannee_2026-2027.pdf",
        "verifieLe": "2026-09-13",
        "note": "Annee 2026-2027, deliberation n° 2026-06 du CA du 15 avril 2026. Le tableau annexe accorde explicitement une exoneration PARTIELLE aux ressortissants extracommunautaires inscrits en master, qui paient donc le tarif national : 255 EUR. Doctorat jamais assujetti aux droits differencies : 398 EUR. PAS DE LICENCE : l'ENS-PSL delivre le diplome de l'ENS, la preparation a l'agregation, le master et le doctorat. S'ajoutent la CVEC et une part de 34 EUR pour la documentation, incluse dans les droits. Non lus : l'arrete des modalites d'inscription 2026-2027 et le montant des droits du diplome de l'ENS.",
        "master": {
          "montant": 255,
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
        "politique": "systematique",
        "detail": "Le tableau des criteres vote pour 2026-2027 accorde aux ressortissants extracommunautaires inscrits en master une exoneration partielle au titre des orientations strategiques de l'ecole, SANS avis de la commission et sur simple presentation d'un passeport valide. Exonerations TOTALES pour les boursiers CROUS, pupilles de la Nation et de la Republique, normaliens preparant l'agregation et etudiants inscrits au titre d'un accord international de l'ecole. Exonerations totales ou partielles sur examen pour refugies, beneficiaires de la protection subsidiaire, demandeurs d'emploi, grande difficulte financiere et beneficiaires de l'AAH.",
        "source": "https://www.ens.psl.eu/sites/default/files/deliberation_ndeg2026-06_portant_approbation_des_criteres_et_de_la_procedure_dexoneration_des_droits_dinscription_pour_lannee_2026-2027.pdf",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "insa-lyon-villeurbanne",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.insa-lyon.fr/fr/cout-etudes",
        "verifieLe": "2026-09-13",
        "note": "Annee 2026-2027. La page de l'INSA donne 630 EUR pour les etudiants francais ou communautaires du diplome d'ingenieur et indique que les extracommunautaires sont soumis aux droits differencies SANS en donner le montant, renvoyant a Campus France. Montants retenus, tires du tableau officiel du ministere : 2 902 EUR/an pour le premier cycle (cycle preparatoire integre, 2 ans) et 3 950 EUR/an pour le cycle ingenieur (3 ans), porte sur la ligne master puisque le diplome d'ingenieur confere le grade de master. Doctorat non assujetti : 398 EUR. S'ajoute la CVEC ; l'assurance maladie est gratuite. Non lues : les notices d'inscription 2026-2027 de l'INSA et une eventuelle deliberation d'exoneration propre a l'ecole.",
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
        "politique": "inconnue",
        "detail": "La page officielle se borne a rappeler que la loi soumet les extracommunautaires aux droits differencies et renvoie a Campus France ; aucune politique d'exoneration propre a l'INSA Lyon n'y est publiee. Le cadre national s'applique : exoneration de plein droit pour les boursiers du gouvernement francais et les accords avec reciprocite, exonerations individuelles plafonnees a 30 % des inscrits hors UE en 2026-2027. A confirmer aupres du service scolarite.",
        "source": "https://www.insa-lyon.fr/fr/cout-etudes",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "mines-paris-psl-paris",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.minesparis.psl.eu/formations/le-cycle-ingenieur-civil/admissions-et-scolarite/",
        "verifieLe": "2026-09-13",
        "note": "Cycle ingenieur civil. La page officielle ecrit : 4 150 EUR pour les etudiants francais ou europeens, et « pour tout autre etudiant, les frais de scolarite s'elevent a 6 440 EUR ». C'est ce montant qui est retenu, porte sur la ligne master puisque le diplome d'ingenieur confere le grade de master. ATTENTION : la page libelle ces montants pour 2025-2026 ; aucun montant 2026-2027 n'etait publie a la date de verification. Mines Paris n'est pas sous tutelle du ministere de l'Enseignement superieur : ses eleves ne relevent ni des bourses CROUS ni de l'arrete national des droits differencies. S'ajoute la CVEC. Non lus : un tarif de premier cycle ou de doctorat, ces lignes sont donc omises.",
        "master": {
          "montant": 6440,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Exoneration TOTALE des frais pour les eleves boursiers de Mines Paris-PSL, de la Fondation Mines Paris, de Campus France (BGF, Eiffel), d'un gouvernement etranger, d'une autre fondation, ou en double diplome international ; justificatif a deposer sur la plateforme OASIS. Les eleves dont les parents ne declarent pas de revenus en France et sans bourse peuvent deposer une demande transmise a la Fondation Mines Paris, avec les baremes du CROUS, non cumulable, avant le 4 septembre 2026. Rien d'automatique pour les hors UE.",
        "source": "https://www.minesparis.psl.eu/formations/le-cycle-ingenieur-civil/admis-2026-%EF%BD%9Cinscriptions-a-mines-paris-psl/",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "essec-business-school-cergy",
    "champs": {
      "exoneration": {
        "politique": "inconnue",
        "detail": "ESSEC applique des tarifs differencies entre ressortissants de l'Union europeenne et hors Union europeenne : un etudiant hors UE qui souhaite beneficier du tarif UE doit fournir un passeport europeen avant le 1er septembre de l'annee scolaire. Aucun bareme ni dispositif de bourse n'est publie sur le domaine officiel ; le montant du forfait est communique individuellement dans le contrat d'enseignement signe a l'admission.",
        "source": "https://ernest.essec.edu/en/support/solutions/articles/7000082032-differentiated-tuition-fees-based-on-eu-and-non-eu",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "tsinghua-university-pekin",
    "champs": {
      "fraisScolarite": {
        "source": "https://international.join-tsinghua.edu.cn/Admission1/Fees.htm",
        "verifieLe": "2026-09-13",
        "note": "Grille officielle 2026. LICENCE (cursus sino-anglais) : ingenierie, informatique, automatique, maths, physique, chimie, sciences du vivant et architecture 30 000 CNY ; economie, finance, gestion et droit 26 000 ; arts 40 000 ; medecine clinique 40 000 a 70 000. MASTER : sciences, ingenierie et medecine 33 000 ; economie et gestion 30 000 ; philosophie, droit, education, lettres et histoire 28 000. DOCTORAT : sciences, ingenierie, medecine 40 000 ; economie-gestion 40 000 ; lettres, droit, education 32 000. ATTENTION, PIEGE DE LANGUE : les programmes 100 % ANGLAIS sont tarifes a part, souvent au forfait — master en sciences de l'environnement 39 000 CNY/an, master d'architecture 120 000 CNY au total, master ICPM de genie civil 158 000 au total. MBA et EMBA de 128 000 a 828 000, ecartes. Frais de dossier 800 CNY, assurance 800 CNY/an. Montants retenus : le groupe sciences et ingenierie de la grille generale.",
        "licence": {
          "montant": 30000,
          "devise": "CNY",
          "periode": "an"
        },
        "master": {
          "montant": 33000,
          "devise": "CNY",
          "periode": "an"
        },
        "doctorat": {
          "montant": 40000,
          "devise": "CNY",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Bourse du gouvernement chinois (CSC) : la version complete couvre scolarite, logement universitaire ou indemnite, allocation mensuelle et assurance maladie ; la version partielle ne couvre qu'une partie. Candidature via l'ambassade de Chine du pays d'origine ou campuschina.org. Tsinghua accorde en propre une Tuition Scholarship reservee au master et au doctorat, qui couvre les droits d'une annee, se redemande chaque annee et s'attribue au concours. Aucune exoneration automatique.",
        "source": "https://www.tsinghua.edu.cn/en/Admissions/International_Students1/Financial_Aid.htm",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "shanghai-jiao-tong-university-shanghai",
    "champs": {
      "fraisScolarite": {
        "source": "https://gk.sjtu.edu.cn/Data/View/1028",
        "verifieLe": "2026-09-13",
        "note": "Avis officiel du Centre des etudiants internationaux, confirme par le site de transparence de l'universite. SJTU applique un tarif UNIQUE pour toutes les disciplines, sans grille par groupe de matieres. LICENCE : 24 800 CNY/an pour le cursus standard EN CHINOIS ; 80 000 CNY/an pour la licence ENSEIGNEE EN ANGLAIS ; 45 000 CNY/an pour la licence enseignee en FRANCAIS a l'institut SPEIT, partenariat avec Polytechnique, Telecom Paris, ENSTA et Mines Paris — a signaler a un francophone. MASTER : 28 900 CNY/an, sans distinction de langue affichee ; MIB 50 000 et master de droit chinois 150 000 sur deux ans, ecartes. DOCTORAT : 45 500 CNY/an. Montant retenu en licence : 24 800, le tarif standard qui couvre la quasi-totalite des filieres. La derniere grille officielle lisible date de 2024-2025 ; frais de dossier, assurance et logement non lus.",
        "licence": {
          "montant": 24800,
          "devise": "CNY",
          "periode": "an"
        },
        "master": {
          "montant": 28900,
          "devise": "CNY",
          "periode": "an"
        },
        "doctorat": {
          "montant": 45500,
          "devise": "CNY",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "inconnue",
        "detail": "Aucune page officielle de bourses de SJTU n'a pu etre lue. La bourse du gouvernement chinois (CSC) reste la voie generale pour un candidat africain, a demander via l'ambassade de Chine ou campuschina.org ; le detail des bourses propres a SJTU et des exonerations partielles n'a pas ete verifie.",
        "source": "https://gk.sjtu.edu.cn/Data/View/1028",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "wuhan-university-wuhan",
    "champs": {
      "fraisScolarite": {
        "source": "https://admission.whu.edu.cn/FRESHMEN_RELATED/FEES.htm",
        "verifieLe": "2026-09-13",
        "note": "Page officielle du College de l'education internationale. La grille distingue explicitement le cursus EN CHINOIS et le cursus EN ANGLAIS a chaque niveau. Sciences et ingenierie : licence 24 000 en chinois / 28 000 en anglais ; master 28 000 / 38 000 ; doctorat 40 000 / 46 000. Lettres et sciences humaines : 20 000 / 23 000, 23 000 / 33 000, 30 000 / 36 000. Medecine et stomatologie : 30 000 / 40 000, 38 000 / 50 000, 45 000 / 55 000. Frais de dossier 800 CNY ou 111 USD ; assurance 1 000 CNY/an ; visite medicale environ 300 ; permis de sejour 400 a 1 000 ; manuels 200 a 1 000/an. Montants retenus : colonne ANGLAIS du groupe sciences et ingenierie, le cursus accessible a un francophone. La page lue ne porte pas d'annee explicite et le fichier Word joint au guide 2026 n'a pas pu etre ouvert.",
        "licence": {
          "montant": 28000,
          "devise": "CNY",
          "periode": "an"
        },
        "master": {
          "montant": 38000,
          "devise": "CNY",
          "periode": "an"
        },
        "doctorat": {
          "montant": 46000,
          "devise": "CNY",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "inconnue",
        "detail": "Le guide d'admission 2026 renvoie a une piece jointe Word sur les bourses qui n'a pas pu etre ouverte, et la page des frais ne decrit aucune exoneration. La bourse du gouvernement chinois (CSC) reste la voie generale, a demander via l'ambassade de Chine ou campuschina.org ; les bourses propres a Wuhan n'ont pas ete verifiees.",
        "source": "https://admission.whu.edu.cn/info/1121/5802.htm",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "sun-yat-sen-university-guangzhou",
    "champs": {
      "fraisScolarite": {
        "source": "https://iso.sysu.edu.cn/en/application/selffunded/1420582.htm",
        "verifieLe": "2026-09-13",
        "note": "Guides d'admission officiels 2026 du Bureau des affaires des etudiants internationaux, un par niveau. Un seul prix par groupe de disciplines, sans colonne separee chinois/anglais. LICENCE : lettres et sciences humaines 26 000 ; sciences, ingenierie et agronomie 33 800 ; medecine 48 000. MASTER : 30 000 / 39 000 / 55 000 ; IMBA 109 000, ecarte. DOCTORAT : 34 000 / 44 200 / 65 000. A noter : ces montants 2026 correspondent exactement a l'ancienne colonne « programmes en anglais » de la grille detaillee de SYSU, qui affichait encore 30 000 en chinois contre 33 800 en anglais — les deux semblent donc avoir ete alignes. Frais de dossier 400 CNY par niveau, non remboursables ; assurance obligatoire 800 CNY/an. Montants retenus : sciences, ingenierie et agronomie, le groupe le plus large. Non lue : la grille annuelle officielle a laquelle les guides renvoient comme reference finale.",
        "licence": {
          "montant": 33800,
          "devise": "CNY",
          "periode": "an"
        },
        "master": {
          "montant": 39000,
          "devise": "CNY",
          "periode": "an"
        },
        "doctorat": {
          "montant": 44200,
          "devise": "CNY",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Bourses du gouvernement chinois accessibles via campuschina.org et via le systeme de SYSU : CSC bilaterale type A, Youth of Excellence type A, programme de haut niveau type B (code etablissement 10558), bourse de l'energie atomique type B, bourse Route de la soie type B. S'y ajoutent la bourse des professeurs internationaux de chinois et le programme MPA du ministere chinois du Commerce. Bourses propres de l'universite : 10 000 CNY en versement unique en licence, 30 000 CNY en versement unique en doctorat — une aide plafonnee, pas une exoneration totale.",
        "source": "https://iso.sysu.edu.cn/en/application/selffunded/1420584.htm",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "sichuan-university-chengdu",
    "champs": {
      "fraisScolarite": {
        "source": "https://en.scu.edu.cn/Admissions/Degree_Programs_for_International_Students/Bachelor_s/Fees.htm",
        "verifieLe": "2026-09-13",
        "note": "Trois pages officielles du site anglais, une par niveau. La grille est organisee par groupe de disciplines et NE distingue PAS le cursus en chinois du cursus en anglais : un seul prix par discipline. LICENCE : lettres, economie et gestion 17 500 ; sciences et ingenierie 22 000 ; pharmacie et sante publique 29 250 ; stomatologie 36 000 ; medecine clinique MBBS enseignee en anglais 45 000 ; arts et sport 45 000 ; archeologie 22 200. MASTER : 22 000 / 25 000 / 26 000 / 40 000 / 50 000 / 50 000 / 26 000 ; MBA 39 200 et master international de management de l'ingenierie 39 000, ecartes. DOCTORAT : 26 000 / 37 000 / 31 200 / 48 000 / 60 000 / 60 000 / 30 000. Montants retenus : sciences et ingenierie. Non lus : frais de dossier, assurance, logement, et l'annee de reference — les pages ne sont pas datees.",
        "licence": {
          "montant": 22000,
          "devise": "CNY",
          "periode": "an"
        },
        "master": {
          "montant": 25000,
          "devise": "CNY",
          "periode": "an"
        },
        "doctorat": {
          "montant": 37000,
          "devise": "CNY",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "inconnue",
        "detail": "Aucune page officielle de bourses de l'universite du Sichuan n'a pu etre lue. La bourse du gouvernement chinois (CSC) reste la voie generale, a demander via l'ambassade de Chine ou campuschina.org ; les bourses propres a SCU n'ont pas ete verifiees.",
        "source": "https://en.scu.edu.cn/Admissions/Degree_Programs_for_International_Students/Master_s/Fees.htm",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "tongji-university-shanghai",
    "champs": {
      "fraisScolarite": {
        "source": "https://study.tongji.edu.cn/en/info/1062/1226.htm",
        "verifieLe": "2026-09-13",
        "note": "Tableau officiel du Bureau des etudiants internationaux, avec une colonne « Teaching Language » qui distingue clairement le chinois et l'anglais. LICENCE en chinois : sciences 24 600 ; lettres 20 000 ; architecture, medecine et arts 28 700. LICENCE en anglais : classe internationale d'architecture et d'urbanisme 33 800 ; genie civil 35 000 ; MBBS 45 000. MASTER en chinois : sciences 28 700 ; lettres 22 960 ; architecture et medecine 32 800. MASTER en anglais : environnement et genie logiciel 39 000 ; genie ferroviaire, civil, geologie, micro-electronique 40 000 ; transports 25 080 ; IMBA 154 000 et sciences de gestion 79 000, ecartes. DOCTORAT en chinois : sciences 41 000 ; lettres 30 000 ; architecture et medecine 45 000. DOCTORAT en anglais : de 30 800 a 50 000 selon le domaine. Frais de dossier 600 CNY ; assurance 800 CNY/an. Montants retenus : ligne « sciences » en chinois, seule categorie generale couvrant l'ensemble des filieres scientifiques ; cote anglais il n'existe pas de tarif unique mais des prix par programme, cites ci-dessus. Page datee de 2023, aucune grille 2026 distincte trouvee.",
        "licence": {
          "montant": 24600,
          "devise": "CNY",
          "periode": "an"
        },
        "master": {
          "montant": 28700,
          "devise": "CNY",
          "periode": "an"
        },
        "doctorat": {
          "montant": 41000,
          "devise": "CNY",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "inconnue",
        "detail": "Aucune page officielle de bourses de Tongji n'a pu etre lue. La bourse du gouvernement chinois (CSC) reste la voie generale, a demander via l'ambassade de Chine ou campuschina.org ; les bourses propres a Tongji n'ont pas ete verifiees.",
        "source": "https://study.tongji.edu.cn/en/info/1062/1226.htm",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "xiamen-university-xiamen",
    "champs": {
      "fraisScolarite": {
        "source": "https://admissions.xmu.edu.cn/Admissions/Costs.htm",
        "verifieLe": "2026-09-13",
        "note": "Page officielle « Study Costs » du bureau des admissions. La grille croise deux groupes de disciplines — lettres d'un cote, sciences, ingenierie, medecine, economie, gestion, droit et arts de l'autre — avec la langue d'enseignement. LICENCE : cursus en chinois 24 000 (lettres) et 26 000 (sciences). Il n'existe PAS de licence generaliste en anglais : seules la medecine MBBS en anglais (38 000) et trois filieres de design en anglais (90 000) sont proposees. MASTER : en chinois 26 000 / 30 000 ; programme international EN ANGLAIS, sur 2 ans, 39 000 (lettres) / 45 000 (sciences). DOCTORAT : en chinois 30 000 / 34 000 ; programme international EN ANGLAIS 42 000 / 55 000. Frais de dossier 400 CNY ; assurance 800 CNY/an ; manuels 400 a 700/an ; logement de 35 a 65 CNY/jour a Siming, 1 600 a 4 000/an a Xiang'an. POINT UTILE : les doctorants sont EXONERES de frais de scolarite pendant leur 4e annee. Montants retenus : programme international en anglais pour le master et le doctorat, cursus accessible sans HSK ; 26 000 en licence faute de licence generaliste anglophone.",
        "licence": {
          "montant": 26000,
          "devise": "CNY",
          "periode": "an"
        },
        "master": {
          "montant": 45000,
          "devise": "CNY",
          "periode": "an"
        },
        "doctorat": {
          "montant": 55000,
          "devise": "CNY",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "L'universite propose les bourses du gouvernement chinois (CSC), les bourses des instituts Confucius, les bourses du gouvernement provincial du Fujian, les bourses Xiamen Tan Kah Kee et ses bourses propres. Les bourses COMPLETES couvrent scolarite, logement, allocation de subsistance et assurance ; les bourses PARTIELLES ne couvrent qu'une partie. Attribution sur dossier. S'y ajoute une exoneration statutaire : les doctorants ne paient pas de frais en 4e annee.",
        "source": "https://admissions.xmu.edu.cn/Admissions/Costs.htm",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "harbin-institute-of-technology-harbin",
    "champs": {
      "fraisScolarite": {
        "source": "https://cie.hit.edu.cn/18285/list.htm",
        "verifieLe": "2026-09-13",
        "note": "Guides d'admission 2026 du College de l'education internationale. Grille tres simple : un seul prix par niveau, decline en cursus EN CHINOIS et EN ANGLAIS, sans distinction de discipline. LICENCE (4-5 ans) : 20 000 CNY/an en chinois, 26 000 en anglais. MASTER (2-3 ans) : 28 000 en chinois, 34 000 en anglais ; seules les filieres gestion, materiaux, mecanique, genie civil, electricite-electronique et chimie-sciences du vivant sont ouvertes en anglais. DOCTORAT (4 ans) : 36 000 en chinois, 42 000 en anglais, toutes specialites ouvertes dans les deux langues. Frais de dossier 400 CNY (600 si candidature a la bourse HIT) ; assurance 800 CNY/an ; logement 800 a 1 000 CNY par mois et par lit. Justificatif financier exige : 20 000 CNY en licence, 30 000 en master et doctorat. ATTENTION : une classe en anglais n'ouvre qu'a partir de 20 inscrits en licence. Montants retenus : colonne ANGLAIS.",
        "licence": {
          "montant": 26000,
          "devise": "CNY",
          "periode": "an"
        },
        "master": {
          "montant": 34000,
          "devise": "CNY",
          "periode": "an"
        },
        "doctorat": {
          "montant": 42000,
          "devise": "CNY",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Deux voies NON CUMULABLES — postuler aux deux entraine l'annulation de la candidature. 1) Bourse du gouvernement chinois : type A via l'ambassade ou le consulat de Chine en indiquant HIT en premier voeu, couvrant scolarite, logement, frais de vie et assurance ; type B en selection autonome par l'universite, date limite 20 fevrier 2026. 2) Bourse HIT, a demander avant le 15 juillet 2026 en licence et le 31 mai 2026 en master et doctorat, avec quatre niveaux : prix special = exoneration TOTALE, 1er prix = 50 % de reduction, 2e prix = 30 %, 3e prix = 20 %. Limite d'age abaissee pour les boursiers : 25 ans en licence, 30 en master, 35 en doctorat.",
        "source": "https://cie.hit.edu.cn/18283/list.htm",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "university-of-science-and-technology-of-china-hefei",
    "champs": {
      "fraisScolarite": {
        "source": "https://en.ustc.edu.cn/info/1058/1129.htm",
        "verifieLe": "2026-09-13",
        "note": "Guides d'admission du College international, campagne 2026 (candidature du 14 novembre 2025 au 31 mars 2026), montants confirmes par la page anglaise officielle. Tarif UNIQUE par niveau, sans grille par discipline. LICENCE : 26 000 CNY/an sur 4 ans, 13 specialites et 35 programmes ouverts aux internationaux. ATTENTION, POINT DECISIF POUR UN FRANCOPHONE : la licence est enseignee UNIQUEMENT EN CHINOIS et exige le HSK niveau 5 ; il n'existe aucun tarif anglophone. MASTER : 30 000 CNY/an (le MBA est a 150 000 CNY pour le programme, ecarte). DOCTORAT : 35 000 CNY/an. Assurance 800 CNY/an ; logement 500 a 1 000 CNY/mois. Non lus : les frais de dossier et la liste des programmes de master et doctorat enseignes en anglais.",
        "licence": {
          "montant": 26000,
          "devise": "CNY",
          "periode": "an"
        },
        "master": {
          "montant": 30000,
          "devise": "CNY",
          "periode": "an"
        },
        "doctorat": {
          "montant": 35000,
          "devise": "CNY",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "USTC Fellowship, bourse propre demandee directement dans le systeme de candidature en ligne : elle couvre les frais de scolarite, l'assurance, une allocation mensuelle (2 500 CNY en licence, jusqu'a 3 000 en master, jusqu'a 7 000 en doctorat) et une aide au logement. En parallele, bourse du gouvernement chinois a demander aupres de l'ambassade ou du consulat de Chine ; avec l'attestation de financement, le candidat peut demander une pre-admission a l'USTC, l'admission definitive n'etant envoyee qu'une fois la bourse obtenue. Aucune exoneration automatique.",
        "source": "https://ic.ustc.edu.cn/?abroad=333",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "shanghai-maritime-university-shanghai",
    "champs": {
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
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Deux dispositifs. Bourse du gouvernement chinois, a demander parallelement sur studyinchina.csc.edu.cn et dans le systeme de l'universite, du 1er decembre 2025 au 1er fevrier 2026. Bourse du gouvernement municipal de Shanghai, jusqu'au 30 avril 2026, avec un type A complet et un type B partiel ; le detail de sa couverture n'a pas ete lu. Aucune exoneration automatique.",
        "source": "https://en.shmtu.edu.cn/DoctoralPrograms/main.psp",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "budapest-university-of-technology-and-economics-budapest",
    "champs": {
      "fraisScolarite": {
        "source": "https://xplore.bme.hu/tuition-fees/",
        "verifieLe": "2026-09-13",
        "note": "Grille centrale officielle 2026-2027, affichee PAR SEMESTRE en euros et doublee ici pour l'annee. Licence hors UE : 3 200 EUR/semestre dans la quasi-totalite des facultes (genie civil, chimie, economie, genie electrique et informatique, sciences naturelles), 3 500 en genie mecanique — retenu 6 400 EUR/an, le tarif dominant. Master hors UE : 3 500 EUR/semestre (architecture, management de l'ingenierie, genie chimique, sciences naturelles, transport), 3 800 en genie civil, 4 000 en genie mecanique, 2 200 seulement pour Finance et Management de la faculte GTK — retenu 7 000 EUR/an, la valeur la plus frequente. Doctorat : la table ne chiffre QUE le PhD en architecture, a 4 500 EUR/semestre, soit 9 000 EUR/an ; pour les autres facultes le tarif n'est pas publie. Frais de dossier 150 EUR a la faculte GTK. La faculte des transports a un systeme atypique (frais de base + 70 EUR/credit, jusqu'a 14 650 EUR/semestre), non retenu.",
        "licence": {
          "montant": 6400,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 7000,
          "devise": "EUR",
          "periode": "an"
        },
        "doctorat": {
          "montant": 9000,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "La bourse Stipendium Hungaricum couvre la TOTALITE des droits plus une allocation mensuelle, le logement et l'assurance maladie, mais elle se demande aupres de l'autorite nationale du pays du candidat, pas aupres de l'universite. En propre, BME indique que les doctorants performants peuvent recevoir un soutien supplementaire via des contrats de recherche ; aucun bareme d'exoneration chiffre n'est publie.",
        "source": "https://www.bme.hu/en/application_and_admission",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "corvinus-university-of-budapest-budapest",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.uni-corvinus.hu/post/landing-page/application/fees-and-costs/?lang=en",
        "verifieLe": "2026-09-13",
        "note": "Grille centrale officielle, deja exprimee PAR AN, colonne « non-EEA applicants » — celle qui s'applique a un etudiant africain autofinance. Licence : 6 000 EUR/an (communication et medias, relations internationales, philosophie-politique-economie) ou 6 600 EUR/an (economie appliquee, gestion, informatique de gestion, data science, commerce international) — retenu 6 600, la valeur la plus frequente. Master : de 6 800 a 10 800 EUR/an ; les programmes CEMS et quelques autres sont a 6 800 ou 7 400, mais la MAJORITE des masters est a 10 800 — c'est le montant retenu. Doctorat : 8 000 EUR/an, tarif unique toutes ecoles doctorales. MBA international 9 000 EUR/an, ecarte. Frais de dossier : 95 EUR en licence et master, 9 000 HUF en doctorat. POINT UTILE : Corvinus garantit que le tarif ne bouge pas pendant toute la duree des etudes, mais exige le paiement anticipe du premier semestre ou de la premiere annee, dont 20 % constituent des frais d'inscription NON REMBOURSABLES.",
        "licence": {
          "montant": 6600,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 10800,
          "devise": "EUR",
          "periode": "an"
        },
        "doctorat": {
          "montant": 8000,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "La bourse Stipendium Hungaricum couvre la TOTALITE des droits plus allocation, logement et assurance, mais elle se demande aupres de l'autorite nationale du pays du candidat. En propre, Corvinus offre aux autofinances une reduction de 10 % sur les droits de la premiere annee a qui reussit les examens d'entree avant fin fevrier et paie le premier semestre avant fin mars. Aucune exoneration totale accordee directement par l'universite.",
        "source": "https://www.uni-corvinus.hu/post/landing-page/application/fees-and-costs/?lang=en",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "eotvos-lorand-university-budapest",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.inf.elte.hu/en/tuition-fee",
        "verifieLe": "2026-09-13",
        "note": "ELTE ne publie AUCUNE grille centrale : sa page « Student finances » se contente de dire que les droits different selon le programme. Les montants viennent donc de deux facultes, affiches PAR SEMESTRE et doubles ici. Licence : 3 200 EUR/semestre soit 6 400 EUR/an, FACULTE D'INFORMATIQUE, tarif en vigueur depuis septembre 2023. Master : 4 200 EUR/semestre soit 8 400 EUR/an, INSTITUT DE MATHEMATIQUES de la faculte des Sciences (MSc Mathematics et Applied Mathematics), avec 50 % de reduction pour les citoyens de l'UE. Doctorat : 3 000 EUR/semestre soit 6 000 EUR/an, PhD in Mathematics du meme institut. ATTENTION : ces chiffres ne valent QUE pour ces facultes ; le droit, les lettres, la pedagogie et les sciences sociales ont des tarifs differents, non lus. La page de la faculte des sciences n'affiche que des tarifs en forints arretes a 2019-2020 pour les cursus en hongrois, inutilisables. Aucun montant de frais de dossier trouve.",
        "licence": {
          "montant": 6400,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 8400,
          "devise": "EUR",
          "periode": "an"
        },
        "doctorat": {
          "montant": 6000,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "inconnue",
        "detail": "La bourse Stipendium Hungaricum couvre la TOTALITE des droits plus allocation, logement et assurance, mais elle se demande aupres de l'autorite nationale du pays du candidat. Cote ELTE, la page centrale rappelle seulement que les etudiants internationaux financent en principe eux-memes leurs etudes. Aucun dispositif d'exoneration propre a ELTE pour les nouveaux entrants n'a pu etre verifie.",
        "source": "https://www.elte.hu/en/student-finances",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "university-of-szeged-szeged",
    "champs": {
      "fraisScolarite": {
        "source": "https://eco.u-szeged.hu/english/training-programmes/programmes-for-international-students/business-administration-and-management-bsc/fees-and-scholarships/fees-and-scholarships",
        "verifieLe": "2026-09-13",
        "note": "CONFIRME : la page centrale des frais de u-szeged.hu est inaccessible ; tout vient des sites de faculte, tarifs affiches PAR SEMESTRE et doubles ici, tous pour 2026-2027. Licence : 2 700 EUR/semestre soit 5 400 EUR/an, FACULTE D'ECONOMIE ET D'ADMINISTRATION DES AFFAIRES (programme Business Administration and Management). Master : 3 000 EUR/semestre soit 6 000 EUR/an, MEME FACULTE (International Economy and Business). Doctorat : 5 000 EUR/semestre soit 10 000 EUR/an, FACULTE DES SCIENCES ET DE L'INFORMATIQUE, tarif autofinance ; la meme table prevoit 150 EUR/semestre pour un doctorant employe par l'universite et 500 EUR/semestre dans le cadre d'une cooperation avec l'employeur. Frais d'examen d'entree : 200 EUR pour les non-UE, non remboursables. Non lues : la table de medecine, bien plus chere, et les facultes de droit, d'ingenierie, d'agriculture et de pharmacie.",
        "licence": {
          "montant": 5400,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 6000,
          "devise": "EUR",
          "periode": "an"
        },
        "doctorat": {
          "montant": 10000,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "La bourse Stipendium Hungaricum couvre la TOTALITE des droits plus allocation, logement et assurance, mais elle se demande aupres de l'autorite nationale du pays du candidat. En propre, la faculte d'economie a ouvert une bourse maison, la SZTE GTK Tuition Support Scholarship (annonce du 2 septembre 2026) ; son montant et son plafond ne sont pas publies sur la page des frais.",
        "source": "https://eco.u-szeged.hu/english/training-programmes/programmes-for-international-students/business-administration-and-management-bsc/fees-and-scholarships/fees-and-scholarships",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "university-of-pecs-pecs",
    "champs": {
      "fraisScolarite": {
        "source": "https://ktk.pte.hu/en/felvetelizok/felveteli/felveteli-kisokos/finances-fees",
        "verifieLe": "2026-09-13",
        "note": "CONFIRME : le site international de Pecs met ses tarifs derriere une inscription, mais la FACULTE DE SCIENCES ECONOMIQUES ET DE GESTION publie une grille complete avec une colonne explicite « for non-EU students ». Tarifs PAR SEMESTRE, doubles ici. Licence : 2 750 EUR/semestre non-UE soit 5 500 EUR/an (contre 1 150 pour les UE). Master : 3 150 EUR/semestre non-UE soit 6 300 EUR/an (contre 1 300 pour les UE). DOCTORAT, STRUCTURE ATYPIQUE : facture au programme et non a l'annee — 20 000 EUR pour tout le doctorat, soit 4 000 EUR au 1er semestre, 3 000 EUR/semestre aux semestres 2 a 4, 1 500 EUR/semestre aux semestres 5 a 8, plus 1 000 EUR pour l'examen complexe. Le montant retenu est celui de la PREMIERE ANNEE (7 000 EUR) ; le cout annuel baisse ensuite a 6 000 puis 3 000 EUR. Frais de dossier : 150 EUR en licence et master, 100 EUR en doctorat, non remboursables. ATTENTION : ces montants ne valent QUE pour cette faculte ; medecine, pharmacie et ingenierie ont leurs propres grilles, bien plus elevees en medecine.",
        "licence": {
          "montant": 5500,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 6300,
          "devise": "EUR",
          "periode": "an"
        },
        "doctorat": {
          "montant": 7000,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "La faculte precise elle-meme le mecanisme du Stipendium Hungaricum : la PRESELECTION est faite par le ministere de l'education du pays d'origine ou par la commission de bourses qu'il designe, et seuls les ressortissants de pays lies a la Hongrie par un accord bilateral en vigueur peuvent postuler. La bourse couvre la totalite des droits plus allocation, logement et assurance. La faculte n'annonce aucune reduction chiffree en propre.",
        "source": "https://ktk.pte.hu/en/felvetelizok/felveteli/felveteli-kisokos/finances-fees",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "university-of-miskolc-miskolc",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.uni-miskolc.hu/en/education/undergraduate-programmes/",
        "verifieLe": "2026-09-13",
        "note": "Miskolc ne publie pas de table unique : sa FAQ centrale donne seulement une fourchette de 2 000 a 4 000 EUR par semestre et renvoie a la fiche de chaque programme. Montants lus sur trois fiches officielles, PAR SEMESTRE et doubles ici, admission d'automne 2026-2027. Licence : BSc Mechanical Engineering, FACULTE DE GENIE MECANIQUE ET D'INFORMATIQUE, 3 000 EUR/semestre soit 6 000 EUR/an, 7 semestres. Master : MSc Logistics Engineering, meme faculte, 3 500 EUR/semestre soit 7 000 EUR/an, 4 semestres. Doctorat : PhD Mechanical Engineering Sciences, meme faculte, 3 500 EUR/semestre soit 7 000 EUR/an, 8 semestres. Frais de dossier 150 EUR aux trois niveaux. Non lues : les fiches des facultes de droit, d'economie, des sciences de la Terre et des materiaux, dont les tarifs peuvent descendre a 2 000 EUR/semestre. SIGNAL A CONNAITRE : Miskolc a ferme les candidatures des ressortissants du Bangladesh, du Pakistan, de Syrie, d'Afghanistan et du Yemen au 30 avril 2026, et n'accepte plus que des candidats capables de se loger par eux-memes, toutes les places en residence etant attribuees.",
        "licence": {
          "montant": 6000,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 7000,
          "devise": "EUR",
          "periode": "an"
        },
        "doctorat": {
          "montant": 7000,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "La bourse Stipendium Hungaricum couvre la TOTALITE des droits plus allocation, logement et assurance, mais elle se demande aupres de l'autorite nationale du pays du candidat. En propre, Miskolc annonce des programmes de bourses concus specifiquement pour les etudiants payants, dont ni le taux de couverture ni le plafond n'ont pu etre verifies.",
        "source": "https://www.uni-miskolc.hu/en/admission/",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "obuda-university-budapest",
    "champs": {
      "fraisScolarite": {
        "source": "https://uni-obuda.hu/tuition-fees/",
        "verifieLe": "2026-09-13",
        "note": "Grille centrale officielle tres lisible, avec deux colonnes distinctes UE/EEE et hors EEE — c'est la seconde qui s'applique. Tarifs PAR SEMESTRE, doubles ici. Licence hors EEE : de 2 700 EUR/semestre (management de l'ingenierie) a 3 200 (informatique), avec 2 900 pour la majorite des programmes (gestion, commerce et marketing, genie de l'environnement, genie industriel, mecatronique) et 3 000 en genie electrique — retenu 5 800 EUR/an, la valeur dominante. Master hors EEE : de 3 200 a 3 600 EUR/semestre ; 3 200 pour architecte, developpement des affaires, genie electrique, marketing, mecanique et mecatronique ; 3 500 pour mathematiques appliquees, informatique de gestion, informatique, cybersecurite et data science ; 3 600 pour l'intelligence artificielle — retenu 6 400 EUR/an. DOCTORAT OMIS : la table ne chiffre aucun programme de doctorat, seulement un programme preparatoire a 4 000 EUR/semestre, qui n'en est pas un. Frais de dossier 150 EUR, non remboursables, a repayer apres un refus de visa. A SIGNALER : en cas de remboursement avant inscription, refus de visa compris, l'universite retient 15 % des droits verses, et 20 % apres inscription.",
        "licence": {
          "montant": 5800,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 6400,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "inconnue",
        "detail": "La bourse Stipendium Hungaricum couvre la TOTALITE des droits plus allocation, logement et assurance, mais elle se demande aupres de l'autorite nationale du pays du candidat. Sur sa page des droits, Obuda n'annonce AUCUNE bourse ni reduction propre : elle ne traite que des paiements obligatoires et de la politique de remboursement, avec des retenues de 15 a 20 %. Aucune page de bourses institutionnelles n'a ete trouvee.",
        "source": "https://uni-obuda.hu/tuition-fees/",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "szechenyi-istvan-university-gyor",
    "champs": {
      "fraisScolarite": {
        "source": "https://szeeds.sze.hu/admission-process",
        "verifieLe": "2026-09-13",
        "note": "LICENCE ET MASTER VOLONTAIREMENT OMIS : Szechenyi Istvan ne publie de montant nulle part sur ses domaines officiels. Sa page des formations liste tous les cursus en anglais avec leur faculte et leur responsable, mais SANS AUCUN TARIF ; la page d'information aux candidats indique seulement 100 EUR de frais de dossier non remboursables et l'obligation de payer d'avance deux semestres de droits plus un mois de logement, sans jamais chiffrer le semestre. Doctorat : 1 200 EUR PAR SEMESTRE pour les autofinances, soit 2 400 EUR/an — programme SzEEDSM, doctorat en sciences de l'administration des affaires. Les candidats hors UE doivent regler d'emblee les deux premiers semestres apres reussite de l'examen d'admission. Ce tarif est remarquablement bas et ne vaut que pour CE programme doctoral ; les autres ecoles doctorales ne publient pas leurs droits.",
        "doctorat": {
          "montant": 2400,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "La bourse Stipendium Hungaricum couvre la TOTALITE des droits plus allocation, logement et assurance, mais elle se demande aupres de l'autorite nationale du pays du candidat. En propre, l'universite dispose d'un dispositif maison, la SODA Scholarship, mise en avant sur sa page d'information aux candidats ; ni son taux de couverture ni son plafond n'ont ete verifies.",
        "source": "https://admissions.sze.hu/application-information",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "hungarian-university-of-agriculture-and-life-sciences-godollo",
    "champs": {
      "fraisScolarite": {
        "source": "https://ed.uni-mate.hu/tuition-fees",
        "verifieLe": "2026-09-13",
        "note": "Grille centrale officielle de la direction de l'enseignement, mise a jour le 26 aout 2026, valable pour les entrants 2026-2027. Tarifs PAR SEMESTRE, doubles ici. La table ne distingue pas UE et hors UE : le montant s'applique a tout etudiant autofinance. Licence : de 1 500 EUR/semestre (cinema et medias, campus de Kaposvar) a 2 500 (gestion du paysage, genie mecanique), avec 2 200 pour plusieurs programmes cles (genie agricole et genie de l'environnement a Godollo, numerique agricole a Gyongyos) — retenu 4 400 EUR/an. Master : tres majoritairement 3 000 EUR/semestre soit 6 000 EUR/an, avec des exceptions de 2 500 a 3 300. DOCTORAT OMIS : la page ne comporte aucune section doctorale chiffree. POINT DE TRESORERIE IMPORTANT : l'universite exige le paiement des DEUX PREMIERS SEMESTRES avant l'admission et avant l'entree en Hongrie, condition pour recevoir la decision d'admission ; le paiement redevient semestriel ensuite.",
        "licence": {
          "montant": 4400,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 6000,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "MATE est l'etablissement le plus explicite de Hongrie : sa grille indique programme par programme les bourses accessibles — Stipendium Hungaricum (presque tous les programmes), Scholarship for Christian Young People et Hungarian Diaspora Scholarship. ATTENTION : la colonne precise que les candidatures a ces bourses sont CLOSES pour 2026-2027 ; seule la voie autofinancee reste ouverte. La bourse Stipendium Hungaricum couvre la totalite des droits plus allocation, logement et assurance, et se demande aupres de l'autorite nationale du pays du candidat.",
        "source": "https://ed.uni-mate.hu/tuition-fees",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "universita-degli-studi-di-napoli-federico-ii-naples",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.unina.it/documents/20117/1741540/guida_studente_rapida_25_26.pdf",
        "verifieLe": "2026-09-13",
        "note": "Guide officiel d'inscription, annee 2025-2026. POINT DECISIF, page 13 : les etrangers ressortissants de pays HORS UNION EUROPEENNE « sono esonerati totalmente dal pagamento del contributo di iscrizione ; devono versare solo la tassa regionale per il diritto allo studio e l'imposta di bollo ». L'exoneration vise donc TOUS les hors UE par leur seule nationalite, sans liste ministerielle de pays ni condition de revenu — c'est une categorie, pas une demande a deposer. A titre de comparaison, un etudiant de l'UE paie un forfait de 200 EUR et un Italien sans ISEEU jusqu'a 2 384 EUR. Restent dus : la taxe regionale (125,50 EUR si ISEEU de 0 a 25 499 EUR ; 146,50 de 25 500 a 50 999 ; 167,50 au-dela ou sans ISEEU) et le timbre de 16 EUR. Montant retenu : 184 EUR/an, soit la taxe regionale en tranche haute (celle qui s'applique par defaut faute d'ISEEU) plus le timbre ; avec un ISEEU parifie bas, la facture tombe a 141,50 EUR. Non lus : le tarif des ecoles doctorales et la version 2026-2027 du guide.",
        "licence": {
          "montant": 184,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 184,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "systematique",
        "detail": "Le guide classe les ressortissants de pays hors Union europeenne parmi les categories TOTALEMENT exonerees de la contribution d'inscription, sans mentionner de dossier ni de liste de pays : l'exoneration decoule de la nationalite et s'applique d'office. Seules restent la taxe regionale et le timbre. Aucun formulaire n'est associe a cette categorie, contrairement aux categories handicap ou merite qui exigent une attestation avant le 7 janvier.",
        "source": "https://www.unina.it/documents/20117/1741540/guida_studente_rapida_25_26.pdf",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "universita-di-genova-genes",
    "champs": {
      "fraisScolarite": {
        "source": "https://unige.it/tasse-e-benefici/rate-calcolo",
        "verifieLe": "2026-09-13",
        "note": "Page officielle, annee 2026-2027. Le montant depend de l'ISEE-U : SANS ISEE-U — cas par defaut d'un etudiant hors UE qui ne fait pas la demarche — la contribution est de 3 025 EUR en aire humaniste et sociale et 3 300 EUR en aire medicale, sanitaire et scientifico-technique. S'ajoutent le timbre de 16 EUR et la taxe regionale d'au moins 120 EUR. ATTENTION, CONTRE-EXEMPLE ITALIEN : Genes N'A PAS de forfait par pays ni de coefficient automatique. Il existe seulement une exoneration de la 3e tranche pour les ressortissants des pays en voie de developpement de la liste ministerielle, mais UNIQUEMENT s'ils resident deja en Italie avec un permis de sejour pour etudes — ce n'est pas un forfait d'entree. L'autre voie est l'ISEE-U parificato, a faire etablir gratuitement dans un CAF conventionne avant le 31 octobre 2026 (100 EUR de penalite en novembre, 200 ensuite) : avec un ISEE-U de 0 a 13 000 EUR, un primo-inscrit a temps plein ne paie AUCUNE contribution, soit environ 136 a 176 EUR de taxes seulement. Montant retenu : 3 025 EUR, le tarif applique d'office sans ISEE-U.",
        "licence": {
          "montant": 3025,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 3025,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Rien n'est applique d'office. Pour descendre du tarif plein il faut deposer un dossier ISEE-U parificato dans un CAF conventionne (gratuit, delai 31 octobre), avec traduction et legalisation des revenus etrangers par les autorites diplomatiques italiennes ; la reduction peut alors aller jusqu'a zero contribution sous 13 000 EUR d'ISEE-U. L'exoneration « pays en voie de developpement » ne porte que sur la 3e tranche et exige de resider deja en Italie avec un permis de sejour pour etudes.",
        "source": "https://unige.it/tasse-e-benefici/isee/parificato",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "scuola-normale-superiore-pise",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.sns.it/en/studiare-a-costo-zero",
        "verifieLe": "2026-09-13",
        "note": "FAIT REMARQUABLE CONFIRME sur la page officielle « Study free of charge ». L'admission se fait par un concours extremement selectif fonde uniquement sur le merite, et les admis etudient sans aucune depense : cours, PENSION COMPLETE et LOGEMENT fournis gratuitement, plus une bourse annuelle modulee selon le revenu du foyer. Les doctorants admis recoivent egalement une bourse et des contributions pour leurs recherches en Italie et a l'etranger. Il n'y a donc pas de tarif hors UE : la nationalite ne change rien, seul le concours compte, et environ 30 % des admis en doctorat viennent de l'etranger. Non verifie sur le domaine officiel : les eleves de licence et de master sont par ailleurs inscrits a l'Universita di Pisa et la Scuola leur rembourserait ces droits — a confirmer. Non lus non plus : le montant de la bourse et un eventuel droit d'inscription au concours.",
        "licence": {
          "montant": 0,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 0,
          "devise": "EUR",
          "periode": "an"
        },
        "doctorat": {
          "montant": 0,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "systematique",
        "detail": "La gratuite n'est pas une reduction a demander : c'est le regime de TOUS les eleves admis au concours, quelle que soit leur nationalite. Aucun dossier de ressources n'est requis pour ne rien payer ; le revenu du foyer ne sert qu'a moduler le montant de la bourse VERSEE a l'etudiant.",
        "source": "https://www.sns.it/en/studiare-a-costo-zero",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "university-of-lisbon-lisbonne",
    "champs": {
      "fraisScolarite": {
        "source": "https://arquivo.ciencias.ulisboa.pt/pt/estudante-internacional-propinas",
        "verifieLe": "2026-09-13",
        "note": "Page officielle de la Faculdade de Ciencias, annee 2026-2027 : la propina annuelle est de 3 500 EUR en licence comme en master. Le tarif est reserve au statut « Estudante Internacional » — non portugais, non UE/EEE, ne residant pas legalement au Portugal depuis plus de deux ans — qui passe par un concours special distinct du concours national. L'ecart avec le tarif national est tres net : la page centrale de l'universite fixe la propina 2026-2027 des nationaux et assimiles a 697 EUR/an. ATTENTION : le conseil general fixe les valeurs internationales ECOLE PAR ECOLE ; 3 500 EUR est la valeur de la faculte des Sciences, d'autres facultes peuvent afficher davantage. Non lus : la deliberation du conseil general 2026-2027 (PDF non affichable), donc ni la grille complete par ecole ni le tarif de doctorat. A explorer : l'universite liste un document d'incitations a l'inscription des etudiants des pays de langue officielle portugaise, non ouvert.",
        "licence": {
          "montant": 3500,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 3500,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "inconnue",
        "detail": "Aucune reduction applicable a un etudiant africain autofinance n'a ete lue. La page centrale des propinas liste des deliberations d'appui (etudiants ukrainiens, syriens, situations d'urgence humanitaire) et un document d'incitations pour les etudiants des pays de langue officielle portugaise, mais aucun de ces textes n'a ete ouvert : impossible de dire s'ils ouvrent droit a une reduction, ni si elle serait automatique ou sur dossier.",
        "source": "https://www.ulisboa.pt/info/propinas-e-emolumentos",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "university-of-porto-porto",
    "champs": {
      "fraisScolarite": {
        "source": "https://sigarra.up.pt/flup/pt/p/propinas_ei",
        "verifieLe": "2026-09-13",
        "note": "Tableau officiel de la Faculdade de Letras, annee 2026-2027, regime a temps plein : licence 3 500 EUR, master 4 000 EUR (master d'enseignement 3 500), doctorat 6 000 EUR plus 100 EUR de taxe d'inscription. DISPOSITIF IMPORTANT POUR L'AFRIQUE LUSOPHONE : un tarif « Estudante CPLP » (Angola, Mozambique, Cap-Vert, Guinee-Bissau, Sao Tome-et-Principe) reduit la facture de 45 % — 1 925 EUR en licence, 2 200 en master, 3 300 en doctorat. Le temps partiel est proratise. ATTENTION : la propina internationale est fixee FACULTE PAR FACULTE ; les valeurs ci-dessus sont celles de la faculte des Lettres, et l'universite annonce une fourchette allant de 3 500 a 16 500 EUR selon la faculte, la medecine etant bien plus chere. Montant retenu : le tarif « etudiant regulier », car un ressortissant du Senegal, de Cote d'Ivoire ou du Cameroun ne releve pas du tarif CPLP. Non lus : les tableaux des autres facultes et les conditions exactes du statut CPLP.",
        "licence": {
          "montant": 3500,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 4000,
          "devise": "EUR",
          "periode": "an"
        },
        "doctorat": {
          "montant": 6000,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Il ne s'agit pas d'une exoneration generale mais d'un TARIF REDUIT de 45 % reserve aux ressortissants des pays de la Communaute des pays de langue portugaise (1 925 / 2 200 / 3 300 EUR). Le tableau officiel l'affiche comme une colonne tarifaire liee a la nationalite, mais la procedure permettant de s'en prevaloir n'a pas ete lue : impossible d'affirmer qu'elle est accordee sans demarche. Aucune reduction lue pour les autres pays africains.",
        "source": "https://sigarra.up.pt/flup/pt/p/propinas_ei",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "university-of-amsterdam-amsterdam",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.uva.nl/en/education/fees-and-funding/tuition-fees/tuition-fees.html",
        "verifieLe": "2026-09-13",
        "note": "Page officielle, annee 2026-2027. Un etudiant qui n'est ressortissant ni de l'UE, ni de l'EEE, ni de la Suisse, ni du Suriname paie OBLIGATOIREMENT le tarif institutionnel, jamais le tarif legal (ce dernier n'est que de 2 694 EUR a temps plein). Le tarif institutionnel est fixe faculte par faculte. LICENCE : economie et gestion 13 900 EUR ; sciences sociales et comportementales 16 670 (computational social science 21 240) ; lettres et droit 17 500 (PPLE 19 100) ; Amsterdam University College 20 430 ; sciences 21 800 ; informatique medicale 21 700 ; medecine et dentisterie 34 700. MASTER : lettres et droit 25 900 en un an, 20 200 en deux ans ; economie 21 800 a 24 500 ; sciences sociales 23 455 ; sciences 34 300 en un an, 26 000 en deux ans ; medecine et dentisterie 37 400. Le tarif est identique a temps plein et a temps partiel. Une clause de transition gele le tarif pour les inscrits avant le 1er septembre 2025. AUCUN dispositif pays en developpement : la nationalite ne sert qu'a trancher entre tarif legal et tarif institutionnel. Montants retenus : lettres et droit, representatifs du milieu de la grille. Non verifie : le statut des doctorants, en general salaries et non factures aux Pays-Bas — aucun montant n'est donc porte en doctorat.",
        "licence": {
          "montant": 17500,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 25900,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "aucune",
        "detail": "La page des frais ne prevoit AUCUNE reduction liee au pays d'origine ni aux ressources. Le passage au tarif legal (2 694 EUR) est strictement reserve aux nationalites UE/EEE/Suisse/Suriname et a certains titres de sejour neerlandais ; un etudiant africain venu avec un visa d'etudes n'y a pas droit. Seule voie de reduction : les bourses, qui relevent d'une candidature separee.",
        "source": "https://www.uva.nl/en/education/fees-and-funding/tuition-fees/tuition-fees.html",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "universite-de-bucarest-bucarest",
    "champs": {
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
      "exoneration": {
        "politique": "aucune",
        "detail": "Pour les ressortissants hors Union europeenne, l'ecole doctorale precise qu'il n'existe QUE des places payantes, et aucun bareme lu ne prevoit de reduction liee au pays d'origine ou aux ressources. La seule aide mentionnee est une bourse de l'Etat roumain accordee via le ministere des Affaires etrangeres, qui fait l'objet d'une candidature entierement separee.",
        "source": "https://isds.unibuc.ro/interdisciplinary-research-training-groups/fees/",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "politehnica-bucuresti-bucarest",
    "champs": {
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
      },
      "exoneration": {
        "politique": "aucune",
        "detail": "Le bareme officiel 2026-2027 ne distingue que deux colonnes : etudiants roumains, de l'UE et beneficiaires d'une protection en Roumanie d'un cote, etudiants non-UE de l'autre. Aucune reduction selon le pays d'origine, le niveau de revenu ou une liste de pays en developpement n'apparait, ni dans le bareme de la faculte ni dans le document des frais de doctorat hors UE. Aucun dossier ne donnerait droit a un tarif inferieur d'apres ce qui a ete lu.",
        "source": "https://international.upb.ro/assets/docs/2026/doctoral/neu/tuition-fees.pdf",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "universite-libre-de-bruxelles-bruxelles",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.ulb.be/fr/inscriptions/frais-d-inscription",
        "verifieLe": "2026-09-13",
        "note": "Annee 2026-2027, page mise a jour le 1er septembre 2026. Montants annuels, payables en deux fois : 50 EUR minimum avant le 31 octobre, solde avant le 1er fevrier. L'onglet « etudiants non europeens » dit textuellement : ressortissant d'un pays hors UE repris aux annexes 1, 2 et 3 de la circulaire ARES = 1 194 EUR ; ressortissant non repris = 1 194 EUR plus 4 175 EUR de droits complementaires, soit 5 369 EUR. REPONSE A LA QUESTION OUVERTE DU PROJET : la circulaire ARES n° 2026-001 du 12 fevrier 2026 a ete lue sur ares-ac.be et LE SENEGAL FIGURE BIEN A L'ANNEXE 1 (pays les moins avances), en position 33. Un etudiant senegalais autofinance paie donc 1 194 EUR et PAS 5 369 EUR. Doctorat : 1 194 EUR la premiere annee. Non lus : les frais de dossier, le tarif du master de specialisation en sante, les annees de doctorat au-dela de la premiere.",
        "licence": {
          "montant": 1194,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 1194,
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
        "politique": "systematique",
        "detail": "L'exemption du droit majore de 4 175 EUR s'applique D'OFFICE sur la seule nationalite, sans dossier a deposer : il suffit que le pays figure aux annexes 1, 2 ou 3 de la circulaire ARES. Le Senegal est a l'annexe 1 (pays les moins avances, n° 33) de la circulaire n° 2026-001 du 12 fevrier 2026, applicable des 2026-2027. Reste du le minerval ordinaire de 1 194 EUR.",
        "source": "https://www.ares-ac.be/sites/default/files/2026-02/circulaire-ndeg2026-001-du-12-02-2026.pdf",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "universite-de-liege-liege",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.enseignement.uliege.be/cms/c_17654509/fr/droits-d-inscription",
        "verifieLe": "2026-09-13",
        "note": "Page modifiee le 26 aout 2026. Montants annuels. Taux complet en bachelier, master et master de specialisation : 1 194 EUR. Un etudiant hors UE non assimile doit en principe une contribution supplementaire de 4 175 EUR (soit 5 369 EUR), mais en sont EXEMPTES ceux dont la nationalite figure aux annexes 1, 2 et 3 de la circulaire ARES — le Senegal y est (annexe 1), il paie donc 1 194 EUR. SECONDE VOIE D'EXEMPTION, automatique elle aussi : etre inscrit en 3e cycle. AUCUN doctorant hors UE ne paie donc le droit majore a l'ULiege, quelle que soit sa nationalite. Doctorat : 1 194 EUR la premiere annee, puis 50 EUR par an, et 0 EUR avec une bourse FRIA, FRESH, FNRS ou ARES. Non lus : les frais de dossier d'admission internationale et le tarif des specialites medicales.",
        "licence": {
          "montant": 1194,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 1194,
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
        "politique": "systematique",
        "detail": "Exemption de la contribution supplementaire de 4 175 EUR accordee d'office, soit sur la NATIONALITE (annexes 1, 2 et 3 de la circulaire ARES — le Senegal y figure), soit sur le NIVEAU D'ETUDES (tout 3e cycle). Aucun dossier a deposer dans ces deux cas. Les taux reduits (835, 374 ou 0 EUR) dependent eux d'une decision de la Direction des allocations d'etudes de la Federation Wallonie-Bruxelles et ne sont, en pratique, pas accessibles a un etudiant international autofinance.",
        "source": "https://www.enseignement.uliege.be/cms/c_17654509/fr/droits-d-inscription",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "ku-leuven-louvain",
    "champs": {
      "fraisScolarite": {
        "source": "https://icts.kuleuven.be/apps/tuitionfees/?Language=English",
        "verifieLe": "2026-09-13",
        "note": "REGIME FLAMAND, sans rapport avec le minerval ARES : les annexes de la circulaire ARES ne s'appliquent pas ici. Montants obtenus avec le calculateur officiel de l'universite en selectionnant l'annee 2026-2027 et la nationalite SENEGAL. Bachelier « Engineering Technology » : 9 493,92 EUR. Master « Engineering: Computer Science » : 9 493,92 EUR. Ce sont des montants ANNUELS pour un programme standard de 60 credits (frais fixes plus montant par credit) ; ils sont recalcules a partir de mi-mars selon le nombre reel de credits. Le tarif varie fortement selon la faculte : les sciences sociales affichent 5 613,10 EUR pour les hors EEE contre 1 181,40 EUR pour les EEE. Le tarif de l'annee de depart reste valable toute la duree du programme, sous reserve d'indexation. DOCTORAT : forfait non lie aux credits et identique pour tous — 591 EUR a la premiere inscription, 0 EUR les annees intermediaires, 591 EUR l'annee de la defense. Montants retenus : la filiere ingenierie et informatique, la plus chere et la plus demandee.",
        "licence": {
          "montant": 9494,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 9494,
          "devise": "EUR",
          "periode": "an"
        },
        "doctorat": {
          "montant": 591,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Aucune exemption automatique sur la nationalite : le calculateur officiel applique le tarif hors EEE plein a un passeport senegalais. La page des frais renvoie a des bourses et des exonerations de droits pour lesquelles il faut deposer une candidature. Le doctorat echappe de fait a la surtaxe puisqu'il est facture au forfait (591 EUR), comme pour un ressortissant belge.",
        "source": "https://www.kuleuven.be/english/education/student/fees",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "ghent-university-gand",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.ugent.be/student/en/administration/tuition/tuition-fee-master-programme-not-advanced-and-masters-programme-in-teaching.htm/tuitionmasterteacher20262027.htm",
        "verifieLe": "2026-09-13",
        "note": "REGIME FLAMAND. Annee 2026-2027, montants ANNUELS pour 60 credits. Deux tarifs hors EEE : tarif A 2 297,40 EUR/an (lettres et philosophie, droit et criminologie, psychologie et sciences de l'education) et tarif B 7 079,40 EUR/an (sciences, medecine, ingenierie et architecture, economie et gestion, veterinaire, bio-ingenierie, pharmacie, sciences politiques et sociales). Le tarif EEE est de 1 181,40 EUR/an. EN BACHELIER, nuance a retenir : un hors EEE inscrit dans un programme EN NEERLANDAIS avec contrat de diplome paie le tarif EEE de 1 181,40 EUR ; en programme ANGLOPHONE il paie le tarif A ou B. POINT IMPORTANT POUR LE SENEGAL : la page liste explicitement, parmi les hors EEE qui paient le tarif EEE, l'etudiant « d'un pays en developpement reconnu par l'OCDE/CAD, deux categories les plus basses » — le Senegal est classe pays le moins avance sur la liste CAD, ce qui l'y place. Il releverait donc de 1 181,40 EUR et non de 7 079,40. RESERVE : l'UGent ne publie pas de liste nominative de ces pays hors de la faculte des sciences politiques et sociales ; a confirmer aupres de studiegeld@ugent.be AVANT d'annoncer 1 181 EUR a un candidat. Doctorat hors EEE : 1 182 EUR a la premiere inscription, 0 aux reinscriptions, 1 182 pour la defense ; 591 EUR seulement si le candidat releve de la meme categorie OCDE/CAD. Montants retenus : le TARIF PLEIN (tarif B), avant application de l'exoneration OCDE/CAD.",
        "licence": {
          "montant": 7079,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 7079,
          "devise": "EUR",
          "periode": "an"
        },
        "doctorat": {
          "montant": 1182,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "systematique",
        "detail": "La page officielle enumere les categories de hors EEE qui paient le tarif EEE (1 181,40 EUR/an, 591 EUR en doctorat) : titre de sejour electronique, demandeurs de protection internationale, boursiers VLIR-UOS, et etudiant « d'un pays en developpement reconnu par l'OCDE/CAD, deux categories les plus basses ». Cette derniere s'applique sur le seul pays d'origine, sans dossier a constituer. RESERVE : l'UGent ne publie pas de liste nominative de ces pays hors de la faculte des sciences politiques et sociales ; l'appartenance du Senegal aux deux categories les plus basses de la liste CAD doit etre confirmee par studiegeld@ugent.be avant d'annoncer le tarif reduit.",
        "source": "https://www.ugent.be/student/en/administration/tuition/tuition-fee-master-programme-not-advanced-and-masters-programme-in-teaching.htm/tuitionmasterteacher20262027.htm",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "universite-de-geneve-geneve",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.unige.ch/immatriculations/informations/taxes",
        "verifieLe": "2026-09-13",
        "note": "Taxes affichees PAR SEMESTRE : 500 CHF (65 CHF de taxes fixes plus 435 CHF de taxes d'encadrement), doublees ici pour l'annee, soit 1 000 CHF/an. POINT IMPORTANT POUR L'ORIENTATION : l'UNIGE n'applique AUCUN supplement pour les etrangers — le montant est identique pour un Suisse et pour un Senegalais, ce qui en fait l'une des universites suisses les moins cheres. Le reglement interne confirme 500 CHF par semestre pour toute formation de base ou approfondie et ne prevoit pas de tarif distinct pour le doctorat ; le meme montant est donc porte aux trois niveaux. Frais annexes : 65 CHF d'emolument d'inscription pour les candidats a l'immatriculation, et 100 CHF pour l'examen de francais impose aux candidats etrangers diplomes hors zone francophone. NE PAS CONFONDRE ces montants avec le cout de la vie a Geneve, sans commune mesure. Non lues : une page dediee aux taxes de doctorat et les eventuels emoluments de faculte.",
        "licence": {
          "montant": 1000,
          "devise": "CHF",
          "periode": "an"
        },
        "master": {
          "montant": 1000,
          "devise": "CHF",
          "periode": "an"
        },
        "doctorat": {
          "montant": 1000,
          "devise": "CHF",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Les exonerations statutaires (conge, stage, mobilite, assistanat) portent sur les 435 CHF de taxes d'encadrement et sont deduites d'office, mais elles tiennent a la situation d'etudes, pas a la nationalite. L'exoneration pour difficultes financieres suppose une demande aupres du Service des aides financieres, reevaluee chaque annee ; elle est plafonnee aux taxes d'encadrement, les 65 CHF de taxes fixes restant toujours dus. Aucune exoneration liee au pays d'origine.",
        "source": "https://memento.unige.ch/doc/0346",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "universite-de-lausanne-lausanne",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.unil.ch/unil/fr/home/menuinst/etudier/immatriculations-et-inscriptions/etudiants-unil/taxes.html",
        "verifieLe": "2026-09-13",
        "note": "Page valable pour l'annee 2026-2027. Montants affiches PAR SEMESTRE, doubles ici. Bachelor, master, annee preparatoire et diplome de francais langue etrangere : 580 CHF/semestre pour une inscription reguliere, soit 1 160 CHF/an. Doctorat : 80 CHF/semestre soit 160 CHF/an, PLUS une taxe unique d'immatriculation de 200 CHF percue une seule fois. Comme a Geneve, l'UNIL n'applique AUCUN supplement pour les etrangers : le montant est le meme pour un Vaudois et pour un Senegalais. Une surtaxe de 200 CHF frappe les inscriptions tardives. Non lus : les frais de dossier de candidature internationale et les emoluments d'equivalence de diplome.",
        "licence": {
          "montant": 1160,
          "devise": "CHF",
          "periode": "an"
        },
        "master": {
          "montant": 1160,
          "devise": "CHF",
          "periode": "an"
        },
        "doctorat": {
          "montant": 160,
          "devise": "CHF",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Une dispense partielle des finances d'inscription peut etre demandee en cas de situation financiere difficile ; elle est evaluee par le Service des affaires sociales et, si elle est accordee, laisse 180 CHF a la charge de l'etudiant. Il faut donc deposer un dossier : rien n'est automatique et rien ne depend de la nationalite. Les beneficiaires de la Bourse de Master de l'UNIL sont exoneres des droits forfaitaires mais restent redevables des taxes semestrielles.",
        "source": "https://www.unil.ch/unil/fr/home/menuinst/etudier/immatriculations-et-inscriptions/etudiants-unil/taxes.html",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "universite-de-fribourg-fribourg",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.unifr.ch/studies/fr/organisation/prestations-admin-etudiants/taxes-universitaires/",
        "verifieLe": "2026-09-13",
        "note": "Montants affiches PAR SEMESTRE, doubles ici. Contrairement a Geneve et Lausanne, Fribourg pratique bien un SUPPLEMENT POUR LES ETRANGERS : etudiant suisse ou etranger domicilie en Suisse au moment du diplome d'acces 835 CHF/semestre ; ETUDIANT ETRANGER venant de son pays 985 CHF/semestre, soit 115 CHF d'emoluments de base plus 870 CHF de taxe d'etudes. Cela fait 1 970 CHF/an en bachelor comme en master, contre 1 670 CHF pour un resident — un ecart de 300 CHF/an, modere. Les doctorants echappent au supplement : 295 CHF/semestre pour tous, soit 590 CHF/an, jusqu'a la soutenance incluse. Frais bancaires et de change a la charge de l'etudiant. Non lus : les frais de dossier de candidature et les taxes d'examens, fixees separement par chaque faculte et qui s'ajoutent a ces montants.",
        "licence": {
          "montant": 1970,
          "devise": "CHF",
          "periode": "an"
        },
        "master": {
          "montant": 1970,
          "devise": "CHF",
          "periode": "an"
        },
        "doctorat": {
          "montant": 590,
          "devise": "CHF",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "aucune",
        "detail": "Aucune exoneration liee a la nationalite : au contraire, le statut d'etranger declenche une MAJORATION de 150 CHF par semestre. En cas de difficultes de paiement, la page renvoie vers le service social de l'universite et le fonds Georges Python, ce qui suppose une demande individuelle et une evaluation de la situation financiere. Le non-paiement dans le delai ultime (30 septembre pour l'automne, 28 fevrier pour le printemps) entraine l'exmatriculation.",
        "source": "https://www.unifr.ch/studies/fr/organisation/prestations-admin-etudiants/taxes-universitaires/",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "university-of-zurich-zurich",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.uzh.ch/cmsssl/en/studies/application/fees.html",
        "verifieLe": "2026-09-13",
        "note": "Montants affiches PAR SEMESTRE, doubles ici. Base commune : 720 CHF/semestre en bachelor et master, 150 CHF/semestre en doctorat. Zurich applique un SUPPLEMENT POUR ETUDIANTS ETRANGERS, et c'est le point le plus discriminant de la Suisse : 500 CHF/semestre en BACHELOR mais seulement 100 CHF/semestre en MASTER, en doctorat et en formation d'enseignant. Un Senegalais paie donc 2 440 CHF/an en licence, 1 640 CHF/an en master et 500 CHF/an en doctorat — LE MASTER COUTE MOINS CHER QUE LA LICENCE. S'ajoutent des contributions semestrielles OBLIGATOIRES de 59 CHF (fonds de bourses, bibliotheques, sport, representation etudiante), soit 118 CHF/an, non comprises ci-dessus, et des contributions volontaires de 26 CHF/semestre que l'on peut refuser. Frais de dossier : 150 CHF pour les candidats en bachelor et master titulaires d'un diplome etranger, 100 CHF en doctorat, non remboursables.",
        "licence": {
          "montant": 2440,
          "devise": "CHF",
          "periode": "an"
        },
        "master": {
          "montant": 1640,
          "devise": "CHF",
          "periode": "an"
        },
        "doctorat": {
          "montant": 500,
          "devise": "CHF",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Aucune exoneration automatique : le supplement etranger s'applique d'office sur la nationalite, dans le sens DEFAVORABLE. Les etudiants en difficulte financiere peuvent s'adresser au bureau d'aide financiere, mais la page pose une restriction lourde pour un candidat africain : l'universite ne peut soutenir financierement que les futurs etudiants de master TITULAIRES D'UN BACHELOR SUISSE. Un Senegalais candidatant depuis son pays n'y est donc, en pratique, pas eligible avant son arrivee.",
        "source": "https://www.uzh.ch/cmsssl/en/studies/application/fees.html",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "kth-royal-institute-of-technology-stockholm",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.kth.se/en/studies/master/admissions/application-and-tuition-fees-for-master-s-studies-1.65817",
        "verifieLe": "2026-09-13",
        "note": "REGIME SUEDOIS : gratuit pour les ressortissants de l'UE, de l'EEE et de la Suisse, PAYANT pour tous les autres depuis 2011. Un Senegalais est donc soumis aux frais. KTH affiche le prix du PROGRAMME COMPLET, pas de l'annee : le master en informatique coute 385 000 SEK pour deux ans, soit 192 500 SEK/an apres division par deux. La page des admissions confirme que 385 000 SEK est le tarif de la plupart des masters de deux ans, tout en precisant que le montant varie selon les programmes ; KTH etant une ecole d'ingenieurs, il n'y a pas d'ecart lettres/ingenierie, tout le catalogue est technique. A titre de comparaison, le meme master a l'universite de Goteborg coute 145 000 SEK/an : l'ecart entre les deux etablissements suedois atteint un tiers pour une meme discipline. FRAIS DE DOSSIER : 900 SEK, montant unique quel que soit le nombre de voeux, a payer a l'agence nationale des admissions — l'examen du dossier est bloque tant qu'ils ne sont pas regles. Les droits sont factures d'avance CHAQUE SEMESTRE. LICENCE ET DOCTORAT OMIS : KTH recrute surtout au niveau master a l'international, ses bachelors etant majoritairement en suedois, et les doctorants suedois sont normalement salaries — mais aucune page KTH ne l'a confirme.",
        "master": {
          "montant": 192500,
          "devise": "SEK",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Pas d'exoneration liee au pays. Les bourses propres de KTH sont ouvertes a TOUS les candidats soumis aux frais et couvrent les droits pour un ou deux ans, mais il faut candidater separement. La bourse de l'Institut suedois vise des pays cibles et couvre a la fois les droits et les frais de sejour. Dans les deux cas il s'agit d'un dossier a deposer, avec selection.",
        "source": "https://www.kth.se/en/studies/master/admissions/application-and-tuition-fees-for-master-s-studies-1.65817",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "university-of-gothenburg-goteborg",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.gu.se/en/study-in-gothenburg/apply/tuition-fees",
        "verifieLe": "2026-09-13",
        "note": "Meme regime suedois : gratuit pour l'UE, l'EEE et la Suisse, payant pour un Senegalais. Goteborg ne publie pas de tarif unique — le montant depend du cours ou du programme, chaque fiche portant le sien. Montant retenu sur la fiche officielle du master en informatique (120 credits, 2 ans, entree automne 2026) : cout total de la formation 290 000 SEK, divise par deux pour l'annee, soit 145 000 SEK/an ; le paiement se fait par semestre (72 500 SEK). La meme fiche affiche 294 000 SEK pour l'entree automne 2027, soit 147 000 SEK/an — le tarif depend de l'annee d'entree. FRAIS DE DOSSIER : 900 SEK percus par l'agence nationale des admissions, une seule fois quel que soit le nombre de voeux. Echeances : 1er mai pour le semestre d'automne des nouveaux admis, puis 15 aout et 15 decembre. Non lu : un tarif de programme en sciences humaines, donc l'ecart interne entre disciplines n'est pas donne pour cet etablissement. Doctorat omis : les doctorants suedois sont normalement salaries et l'ordonnance citee par la page des frais ne vise que les 1er et 2e cycles.",
        "master": {
          "montant": 145000,
          "devise": "SEK",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Aucune exoneration automatique sur la nationalite. L'universite prevoit une procedure de reevaluation du statut payant si l'etudiant estime remplir les conditions d'exemption (titre de sejour suedois notamment), sur pieces — ce qui ne concerne pas un candidat arrivant directement du Senegal. Une bourse maison, la Axel Adler Scholarship, est mentionnee sur la page des frais ; elle suppose une candidature et une selection.",
        "source": "https://www.gu.se/en/study-in-gothenburg/apply/tuition-fees",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "university-of-warsaw-varsovie",
    "champs": {
      "fraisScolarite": {
        "source": "https://rekrutacja.uw.edu.pl/files/pdf/tuition_fees_2026-2027_06.2026.pdf",
        "verifieLe": "2026-09-13",
        "note": "Tableau officiel des frais 2026-2027 du bureau des admissions, montants PAR AN et par programme anglophone. Structure a double detente : certains programmes affichent un montant unique valable pour tous (relations internationales 4 300 EUR en licence comme en master, gestion 4 000, politique et economie europeennes 4 300, science politique 4 300, archeologie 2 300 ou 2 500) ; d'autres distinguent les citoyens de l'UE, de l'EEE et de Suisse — GRATUITS — des ressortissants NON-UE qui, eux, paient : etudes africaines 1 000 EUR, etudes anglaises 2 200, physique 4 000, apprentissage automatique 3 300, therapeutiques biologiques 3 000, sciences cognitives 21 300 PLN, developpement durable 2 239 EUR, systemes alimentaires 18 000 EUR, environnement global et developpement 9 000 EUR. L'eventail hors UE va donc de 1 000 a 18 000 EUR selon la discipline. Certains montants sont en zlotys, d'autres en euros, quelques-uns par semestre (2 500 EUR/semestre pour Digital Business, Global Management et finance internationale) — rien n'a ete converti. Frais de dossier : 85 PLN par filiere, 100 PLN si un examen est prevu, plus 22 PLN de carte d'etudiant pour tout candidat sans numero PESEL. Montant retenu : 4 300 EUR/an en licence et master (relations internationales), tarif identique aux deux niveaux, applicable aussi aux non-UE, representatif sans etre un extreme. Non lu : le tarif des ecoles doctorales.",
        "licence": {
          "montant": 4300,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 4300,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "inconnue",
        "detail": "Le tableau officiel montre que les ressortissants de l'UE, de l'EEE et de Suisse sont gratuits sur une partie des programmes, mais il ne dit rien des conditions d'exemption ouvertes aux non-UE : la page renvoie a une ordonnance du recteur sur les conditions et la procedure d'exemption, non ouverte. En Pologne, les dispositifs nationaux qui exonerent sont la Carte de Polonais, le statut de resident permanent ou de resident longue duree de l'UE, et les bourses NAWA — aucun ne s'applique par defaut a un Senegalais autofinance, mais cela n'a pas ete verifie sur une page de l'universite.",
        "source": "https://rekrutacja.uw.edu.pl/en/application-and-tuition-fees/",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "jagiellonian-university-cracovie",
    "champs": {
      "fraisScolarite": {
        "source": "https://ces.uj.edu.pl/prospective-students/tuition-and-fees",
        "verifieLe": "2026-09-13",
        "note": "L'universite ne publie pas de grille unique : le montant est fixe programme par programme par ordonnance du recteur. Montants lus sur deux fiches officielles, entree 2026-2027 : licence en etudes europeennes 13 200 EUR pour 3 ans, payables en 6 versements de 2 200 EUR par semestre, soit 4 400 EUR/an ; master en etudes europeennes 9 000 EUR pour 2 ans, en 4 versements de 2 250 EUR, soit 4 500 EUR/an. Les deux fiches precisent « citoyens de l'UE et hors UE » : le tarif est donc LE MEME pour un Senegalais que pour un Europeen sur ces programmes anglophones. Second point de reference coherent : le programme de relations internationales affiche 4 500 EUR/an. ATTENTION : le premier versement doit etre paye DANS LES 7 JOURS suivant l'inscription, sous peine d'annulation. Frais de dossier : 85 PLN sans examen, 100 PLN avec examen d'entree, plus la carte d'etudiant pour qui n'a pas de numero PESEL. Non lus : le tarif des ecoles doctorales et les programmes du college medical (medecine en anglais), nettement plus chers.",
        "licence": {
          "montant": 4400,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 4500,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "aucune",
        "detail": "La page officielle des frais pour etrangers est categorique : la longue liste d'exemptions (citoyens de l'UE, de l'EEE et de Suisse, titulaires de la Carte de Polonais ou d'une decision confirmant l'origine polonaise, residents permanents, residents longue duree de l'UE, refugies, conjoints et descendants de citoyens polonais, titulaires d'un certificat de polonais de niveau C1) ne vaut QUE pour les etudes a temps plein EN POLONAIS. Elle exclut explicitement les etudes en langue etrangere, c'est-a-dire tous les programmes anglophones vises ici — la seule exception etant les boursiers NAWA. Un etudiant senegalais autofinance inscrit en anglais paie donc le plein tarif. Les bourses NAWA sont la seule porte de sortie, et elles passent par l'agence nationale, pas par l'universite.",
        "source": "https://welcome.uj.edu.pl/en_GB/admission/fees",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "universite-mohammed-vi-polytechnique-benguerir",
    "champs": {
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
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Bourse d'etablissement adossee a la Fondation Ibn Rochd, ouverte explicitement aux etudiants marocains ET etrangers. Ce sont des bourses d'excellence academique attribuees sur criteres sociaux (revenus des parents ou tuteurs). Forme : exoneration PARTIELLE des frais de scolarite, jusqu'a 85 % en licence comme en master, et/ou exoneration totale ou partielle des frais de vie et de logement. Le nombre de bourses est fixe chaque annee par la commission des bourses selon le budget. La demande se fait aupres de l'universite elle-meme, pas aupres d'une ambassade. En doctorat, aucun frais et une allocation de 10 000 MAD/mois, non cumulable avec une bourse logement ou restauration.",
        "source": "https://www.fgses-um6p.ma/scholarships-financial-aid",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "american-university-in-cairo-le-caire",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.aucegypt.edu/admissions/tuition-and-fees",
        "verifieLe": "2026-09-13",
        "note": "Tarifs officiels 2026-2027, pages mises a jour le 29 juillet 2026. L'AUC facture PAR HEURE DE CREDIT et par semestre, et les etudiants internationaux doivent payer EN DOLLARS (les Egyptiens peuvent payer en livres au taux du jour). Tarif international : 735 USD par credit, en licence comme en master ; le tarif egyptien est de 700 USD en licence et 627 en master, l'EMBA de 938 USD pour tous. Les montants annuels ci-dessous sont CALCULES a partir de deux chiffres officiels : 735 USD par credit multiplie par la charge normale que l'AUC elle-meme budgete sur sa page du cout de presence — 12 credits par semestre d'automne et de printemps en licence (24 credits/an) et 9 credits par semestre en cycle superieur (18 credits/an). Ce ne sont donc pas des tarifs affiches tels quels par l'universite. S'ajoutent livres, logement, transport et frais divers. Non lue : une grille specifique au doctorat — l'AUC annonce un tarif unique de 735 USD/credit pour les internationaux de cycle superieur sans distinguer master et doctorat.",
        "licence": {
          "montant": 17640,
          "devise": "USD",
          "periode": "an"
        },
        "master": {
          "montant": 13230,
          "devise": "USD",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Deux dispositifs distincts, tous deux demandes directement aupres de l'AUC. En licence, l'Excellence Scholarship Program attribue des bourses au merite CUMULABLES, la couverture pouvant monter jusqu'a 100 % des frais selon le nombre de bourses obtenues. En cycle superieur, des fellowships tres competitifs, ouverts aux nouveaux etudiants comme aux etudiants en cours de cursus performants selon les fonds alloues, et une aide financiere sous forme de reduction PARTIELLE pour les etudiants demontrant un besoin. L'AUC propose aussi un paiement echelonne. Aucune exoneration automatique liee a la nationalite africaine.",
        "source": "https://www.aucegypt.edu/admissions/graduate/tuition-and-financial-support",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "universite-senghor-alexandrie",
    "champs": {
      "fraisScolarite": {
        "source": "https://candidature.usenghor.org/details?view=programme&cid=128",
        "verifieLe": "2026-09-13",
        "note": "Avis de concours officiel pour la rentree 2026-2027 (master en developpement, admission directe en 2e annee, campus d'Alexandrie). Montant ANNUEL. Les 3 700 EUR couvrent les droits d'inscription ET les frais de vie a Alexandrie, dont 400 EUR de droits d'inscription administrative. EN CONTREPARTIE l'etudiant recoit exactement la meme prise en charge qu'un boursier de l'universite : studio individuel sur le campus de Borg El-Arab, un repas par jour au restaurant universitaire, assurance medicale, transport le week-end, allocation mensuelle de subsistance de 4 000 livres egyptiennes par mois de presence, et billet aller-retour plus assurance voyage pour le stage. S'ajoutent 100 EUR non remboursables de frais de participation au test d'admission, le billet aller-retour depuis le pays d'origine, le visa et le controle medical egyptien. CAS PARTICULIER : un laureat non boursier qui obtient une bourse d'un organisme exterieur, type Campus France, doit 7 200 EUR par annee de master, ce montant couvrant en plus le cout de la formation. L'universite ne recrute pas en licence.",
        "master": {
          "montant": 3700,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "L'Universite Senghor, operateur direct de la Francophonie, a son propre statut de boursier : le boursier ne paie pas les 3 700 EUR et recoit hebergement en studio sur le campus, un repas quotidien, une assurance medicale, le transport et une allocation mensuelle de 4 000 livres egyptiennes. LIMITE EXPLICITE lue dans l'avis : l'universite N'OFFRE PAS de bourse de frais de vie pour l'admission directe en deuxieme annee de master — ce statut concerne le recrutement en cycle complet. La demande passe par la plateforme de candidature, apres selection sur dossier puis reussite au test d'admission (100 EUR).",
        "source": "https://candidature.usenghor.org/details?view=programme&cid=128",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "african-leadership-university-kigali",
    "champs": {
      "fraisScolarite": {
        "source": "https://help.alueducation.com/support/solutions/articles/204000012961-what-are-the-costs-of-attending-alu-",
        "verifieLe": "2026-09-13",
        "note": "Tableau officiel du portail d'admission d'ALU, article modifie le 16 janvier 2025, presente comme couvrant les admissions 2024 — l'universite precise elle-meme que ce sont des ESTIMATIONS susceptibles d'evoluer. Facturation par terme academique, pas par credit : 1 000 USD par terme pour les licences en leadership entrepreneurial et en genie logiciel, soit 3 000 USD par annee academique ; 4 000 USD par an (1 333 USD par terme) pour la licence en commerce international. Le total du parcours varie selon le programme, le nombre de termes et le nombre de credits. S'ajoutent : logement et repas, environ 1 360 a 1 440 USD/an selon la formule chambre triple ou double, l'ordinateur portable, les vols et les depenses personnelles ; un module a repasser coute 20 USD par credit. AUCUN tarif publie pour 2026-2027, ni pour un master ou un doctorat — ALU Rwanda ne delivre que des licences, accreditees par le Conseil de l'enseignement superieur du Rwanda.",
        "licence": {
          "montant": 3000,
          "devise": "USD",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Deux dispositifs, demandes directement a ALU au moment de la candidature. 1) Bourses ALU en partenariat avec la Mastercard Foundation : bourses COMPLETES couvrant l'integralite des frais de scolarite plus un soutien financier tout au long du parcours, reservees a des candidats demontrant un besoin financier et un desavantage socio-economique documente, academiquement solides (moyenne d'au moins B aux examens nationaux) et ages de 23 ans ou moins ; les femmes, les refugies et personnes deplacees, et les personnes en situation de handicap sont particulierement encouragees. ALU precise que le nombre de bourses par promotion est limite et la selection extremement competitive. 2) Grants ALU : exoneration partielle appliquee uniquement sur la facture de scolarite, jamais versee en especes, valable pour la duree minimale du diplome et ne couvrant aucun autre frais.",
        "source": "https://help.alueducation.com/support/solutions/articles/204000012922-who-is-eligible-for-financial-aid-",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "carnegie-mellon-university-africa-kigali",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.africa.engineering.cmu.edu/admissions/tuition.html",
        "verifieLe": "2026-09-13",
        "note": "Grille officielle du cout de presence 2025-2026, en dollars, tarif ANNUEL. POINT DECISIF POUR UN PUBLIC AFRICAIN : CMU-Africa applique DEUX tarifs — 16 000 USD/an pour les etudiants AFRICAINS, 60 300 USD/an pour les internationaux non africains. C'est le tarif africain qui est retenu. S'ajoutent les frais de vie, estimes entre 4 220 et 6 530 USD/an (logement 1 800 a 3 000, nourriture 1 200 a 1 500, transport 180 a 360, internet 120 a 300, divers 900 a 1 350, visa 20). Sont en revanche DEJA INCLUS dans la scolarite : ordinateur portable, manuels, frais technologiques, assurance sante, navette du campus et vie etudiante. Aucun tarif de licence ni de doctorat : CMU-Africa ne delivre que des masters (technologies de l'information, genie electrique et informatique, intelligence artificielle appliquee).",
        "master": {
          "montant": 16000,
          "devise": "USD",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "CMU-Africa declare que TOUS ses etudiants sont eligibles a une aide financiere fondee sur le besoin, financee par le gouvernement du Rwanda et la Mastercard Foundation, et qu'une grande partie des etudiants recoit un paquet couvrant une fraction substantielle du cout de presence. Avant l'inscription, chaque etudiant recoit une lettre d'attribution precisant exactement sa contribution restante. Formes d'aide : subvention du gouvernement du Rwanda, bourse pour la Communaute d'Afrique de l'Est, pret du gouvernement du Rwanda, Mastercard Foundation Scholars Program, Innovators Forward Fellowship Fund, MINDS, Smart Africa Scholarship. La demande se fait aupres de CMU-Africa dans le dossier de candidature. Aucune exoneration garantie a 100 %.",
        "source": "https://www.africa.engineering.cmu.edu/admissions/tuition.html",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "university-of-rwanda-kigali",
    "champs": {
      "fraisScolarite": {
        "source": "https://cst.ur.ac.rw/spip.php?article148",
        "verifieLe": "2026-09-13",
        "note": "Grille officielle du College des sciences et technologies. ATTENTION AUX DEVISES, elles changent selon le niveau : la LICENCE est facturee en francs rwandais et le texte precise explicitement que les MEMES frais s'appliquent aux etudiants internationaux — 1 600 000 RWF/an, tarif des etudiants prives (les boursiers du gouvernement sont a 2 000 000 RWF). Le MASTER et le DOCTORAT ont en revanche un tarif international distinct, libelle en DOLLARS : master 4 800 USD/an contre 3 000 000 RWF pour les Rwandais et les ressortissants d'Afrique de l'Est ; doctorat 13 500 USD/an contre 4 200 000 RWF. Montants ANNUELS. S'ajoutent les frais administratifs : en licence, candidature 5 000 RWF, inscription 50 000, assurance maladie 7 000, assurance vie 2 000, union des etudiants 1 000 ; en cycle superieur, admission 12 000, inscription 90 000, assurance maladie 8 400, assurance vie 2 000, union 1 000. Non lues : les grilles des cinq autres colleges (sante, education, arts et sciences sociales, agriculture, business), dont les montants peuvent differer ; le site central renvoie a des PDF de 2018-2019 en indiquant que la meme structure reste valable jusqu'a nouvel ordre.",
        "licence": {
          "montant": 1600000,
          "devise": "RWF",
          "periode": "an"
        },
        "master": {
          "montant": 4800,
          "devise": "USD",
          "periode": "an"
        },
        "doctorat": {
          "montant": 13500,
          "devise": "USD",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "inconnue",
        "detail": "Aucune politique de bourse ou d'exoneration destinee aux etudiants etrangers autofinances n'a ete lue sur les pages officielles consultees. La grille du College des sciences et technologies distingue uniquement les etudiants finances par le gouvernement rwandais et les etudiants prives, sans dispositif ouvert aux non-Rwandais. Ne pas supposer une exoneration : a verifier directement aupres de l'universite.",
        "source": "https://cst.ur.ac.rw/spip.php?article148",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "knust-kumasi",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.knust.edu.gh/academics/academics-fees/fees-schedule-20262027-academic-year",
        "verifieLe": "2026-09-13",
        "note": "Grilles officielles distinctes pour les etudiants internationaux, integralement en DOLLARS, lues dans les deux documents publies par l'universite : la grille de licence porte la mention « frais 2026-2027 (provisoires) », celle de cycle superieur porte encore 2025-2026 — KNUST ne l'a donc pas encore actualisee. Montants ANNUELS. Chaque total additionne trois colonnes : scolarite, autres charges (1 454,55 USD en licence, 1 681,34 en cycle superieur) et charges additionnelles (103 a 158 USD en licence) ou memoire et soutenance (630 USD en cycle superieur). LICENCE, de 4 430 USD (humanites et sciences sociales) a 7 563 USD (medecine et chirurgie dentaire), avec 5 043 USD pour la majorite des filieres (sciences, agriculture, art et environnement bati) et 6 280 en ingenierie. MASTER, de 6 136 a 9 811 USD, la valeur la plus frequente etant 6 221 (sciences, sante) ; ingenierie et commerce 7 411 a 7 451 ; sante publique et epidemiologie 9 811. DOCTORAT de 6 136 a 7 451 USD. Une allocation personnelle recommandee de 2 000 USD figure au bas de la grille de licence. Montants retenus : la valeur la plus frequente de chaque cycle — VERIFIER LA FILIERE EXACTE avant de communiquer un chiffre. Non lues : les grilles des annees suivantes, publiees separement.",
        "licence": {
          "montant": 5043,
          "devise": "USD",
          "periode": "an"
        },
        "master": {
          "montant": 6221,
          "devise": "USD",
          "periode": "an"
        },
        "doctorat": {
          "montant": 6221,
          "devise": "USD",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "KNUST publie deux dispositifs internes destines aux etudiants brillants et sans moyens : la KNUST Bursary et la bourse du conseil des etudiants, toutes deux sur candidature directe aupres de l'universite. KNUST heberge par ailleurs un Mastercard Foundation Scholars Program avec son propre portail, reference sur le site de l'universite. Un bureau des services financiers aux etudiants est dedie aux bourses. Rien n'indique une exoneration automatique pour les internationaux, ni le montant ou le taux de couverture de ces bourses.",
        "source": "https://www.knust.edu.gh/students/scholarships-and-grants",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "universite-cadi-ayyad-marrakech",
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "L'universite indique que grace a l'AMCI elle accueille des etudiants de nombreux pays d'Afrique, et que l'agence octroie des bourses et des facilites d'accueil dans le cadre de la cooperation entre le Maroc et les pays partenaires. POINT CLE : la candidature se fait OBLIGATOIREMENT par voie diplomatique — « tout dossier non transmis par l'AMCI ne sera pas pris en consideration ». On ne postule donc pas a l'universite : le dossier se depose aupres de l'autorite competente de son pays ou de l'ambassade du Maroc, qui le transmet a l'AMCI, laquelle le transmet au ministere de l'Enseignement superieur. L'inscription se fait ensuite sur presentation de l'autorisation d'inscription delivree par ce ministere. Le montant de la bourse n'est publie ni sur uca.ma ni sur amci.ma.",
        "source": "https://www.uca.ma/fr/page/agence-marocaine-de-la-cooperation-internationale-amci",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "universite-hassan-ii-casablanca",
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "L'universite attribue chaque annee, en collaboration avec l'AMCI, des places pedagogiques « avec ou sans bourses » aux etudiants des pays partenaires titulaires d'au moins un baccalaureat. L'AMCI accorde chaque annee des bourses aux etudiants internationaux, dans le cadre de programmes de cooperation et selon des quotas definis annuellement avec le ministere des Affaires etrangeres ; ces bourses couvrent la duree reglementaire du cycle de formation, de 2 a 7 ans. Les candidatures sont soumises PAR VOIE DIPLOMATIQUE a l'AMCI, via les representations diplomatiques marocaines a l'etranger et les ambassades accreditees au Maroc — seuls les candidats officiellement proposes a l'AMCI peuvent etre inscrits. Le montant de la bourse n'est pas publie.",
        "source": "https://www.univh2c.ma/fr/page/etudiant-international",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "universite-mohammed-v-rabat",
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Procedure officielle : les candidatures des etudiants internationaux sont soumises PAR VOIE DIPLOMATIQUE a l'AMCI, dans les delais communiques chaque annee aux representations diplomatiques marocaines a l'etranger et aux ambassades accreditees a Rabat. Apres examen et selection selon les QUOTAS et criteres arretes par l'AMCI et les representants des pays beneficiaires, les dossiers sont transmis au ministere de l'Enseignement superieur via une plateforme dediee. L'inscription se fait ensuite sur presentation d'une autorisation d'inscription electronique a numero de serie unique. La demande se fait donc aupres de l'ambassade du Maroc ou de l'autorite nationale du pays du candidat, JAMAIS directement aupres de l'universite. Plus de 2 890 etudiants internationaux y etaient inscrits en 2024-2025.",
        "source": "https://www.um5.ac.ma/um5/inscription-des-etudiants-internationaux",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "aims-rwanda-kigali",
    "champs": {
      "exoneration": {
        "politique": "systematique",
        "detail": "Bourse complete AUTOMATIQUE : tous les candidats selectionnes au master structure d'AIMS beneficient d'une bourse integrale. Le centre est par ailleurs un site du Mastercard Foundation Scholars Program. La demande se fait directement aupres d'AIMS via la plateforme de candidature du master, pas aupres d'une ambassade. Le cursus est residentiel : l'hebergement sur le campus fait partie du dispositif.",
        "source": "https://aims.ac.rw/structured-masters-program/",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "aims-ghana-accra",
    "champs": {
      "exoneration": {
        "politique": "systematique",
        "detail": "Bourse attribuee a TOUS les etudiants admis, couvrant la scolarite, les supports de cours et le logement — l'institut est residentiel. La page de candidature precise que des bourses completes sont attribuees a tous les etudiants admis au master structure, avec hebergement, restauration et assurance maladie. La demande se fait directement aupres d'AIMS Ghana via son formulaire en ligne, pas aupres d'une ambassade ni d'une autorite nationale. La selection est le seul obstacle : il n'y a pas de dossier de bourse separe.",
        "source": "https://aims.edu.gh/master-of-mathematical-sciences/",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "usiu-africa-nairobi",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.usiu.ac.ke/2211/tuition-fees/",
        "verifieLe": "2026-09-13",
        "note": "Grille officielle 2025-2026, en shillings kenyans et affichee PAR SEMESTRE ; les montants ci-dessous sont ANNUALISES sur DEUX semestres (l'universite en propose un troisieme en ete, qui se facture en plus). L'USIU distingue trois colonnes : Kenyan, Est-africain, non-Est-africain. Un etudiant africain non ressortissant d'Afrique de l'Est releve de la troisieme, qui paie 30 % AU-DESSUS du tarif local sur la scolarite et tous les frais obligatoires — les montants ci-dessous sont donc deja majores. Scolarite seule, par semestre : licence 171 600 KES (12 unites a 14 300), master 187 200 (9 unites a 20 800), doctorat 234 000 (9 unites a 26 000). TOTAUX semestriels tous frais compris, plus eleves : 197 990, 213 590 et 260 390 KES. S'ajoutent : permis d'etudes 13 800 KES/an pour les non-Est-africains, assurance medicale 8 000, caution remboursable 2 100, frais de dossier 3 500 a 4 500, chambre 42 000 et repas 58 800 par semestre. Grille lue : celle de l'ecole de commerce ; les ecoles de sciences et technologie, pharmacie, communication et sciences humaines ont les leurs. Le MBA en management global suit une grille a part, de 312 000 a 468 000 KES par semestre.",
        "licence": {
          "montant": 343200,
          "devise": "KES",
          "periode": "an"
        },
        "master": {
          "montant": 374400,
          "devise": "KES",
          "periode": "an"
        },
        "doctorat": {
          "montant": 468000,
          "devise": "KES",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "aucune",
        "detail": "Aucune exoneration pour etudiants internationaux n'est mentionnee sur la page des frais. Universite privee : le tarif non-Est-africain est MAJORE de 30 %, pas reduit. La page des bourses de l'universite n'a pas ete consultee.",
        "source": "https://www.usiu.ac.ke/2211/tuition-fees/",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "university-of-the-witwatersrand-johannesburg",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.wits.ac.za/internationalstudents/financial-information/fee-structure/",
        "verifieLe": "2026-09-13",
        "note": "Deux pages officielles. La regle depend de la REGION D'ORIGINE. Cas « reste de l'Afrique et reste du monde », hors Afrique australe, donc la majorite des etudiants africains non australs : en LICENCE, « tuition fees : double the local tuition fees », et aucun droit d'inscription international ; en MASTER et DOCTORAT, les etudiants de cycle superieur du monde entier paient le MEME tarif que les etudiants d'Afrique australe, soit la scolarite locale plus un droit d'inscription international de 6 970 ZAR par an, non remboursable. Les internationaux a temps partiel paient la scolarite locale plus 6 970 ZAR, et non le double. Paiement : 75 % avant l'inscription, 25 % avant le 30 juin. Logement et mutuelle non compris. Tarifs LOCAUX 2026 de la faculte de commerce, droit et gestion : licence de 47 930 a 85 260 ZAR, master de 89 720 a 221 405 ZAR selon le programme, MBA de 333 360 a 427 890. MONTANT RETENU EN LICENCE : 125 660 ZAR, soit le DOUBLEMENT prescrit par l'universite applique a la borne basse du bachelor de commerce (62 830 x 2) — c'est un calcul, pas un chiffre affiche tel quel, et la fourchette reelle pour cette seule faculte va de 125 660 a 170 520 ZAR. Master : 89 720 ZAR (borne basse), plus 6 970 ZAR de droit international. Non lus : le livret complet des frais 2026, les autres facultes (sciences, ingenierie, sante, humanites) et tout tarif de doctorat.",
        "licence": {
          "montant": 125660,
          "devise": "ZAR",
          "periode": "an"
        },
        "master": {
          "montant": 89720,
          "devise": "ZAR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "aucune",
        "detail": "Aucune exoneration automatique pour les internationaux : au contraire, une MAJORATION — licence au double du tarif local hors Afrique australe, et droit d'inscription international de 6 970 ZAR/an en cycle superieur. L'universite dispose d'un bureau d'aide financiere et de bourses dont les conditions d'eligibilite pour les etrangers n'ont pas ete lues.",
        "source": "https://www.wits.ac.za/internationalstudents/financial-information/fee-structure/",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "king-abdulaziz-university-jeddah",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.moe.gov.sa/en/education/ResidentsAndvisitors/Pages/PublicUniversitiesScholarships.aspx",
        "verifieLe": "2026-09-13",
        "note": "AUCUN TARIF DE SCOLARITE N'EST PUBLIE, et c'est l'information elle-meme : l'universite releve du regime national saoudien de bourses pour etudiants non saoudiens, qui couvre les 27 universites publiques du royaume. Le ministere de l'Education ecrit que le royaume offre un parrainage aux etudiants internationaux boursiers « gratuitement et sans frais de scolarite », avec de nombreux autres avantages. Le visa d'etudes n'est d'ailleurs delivre qu'a un candidat DEJA titulaire d'une bourse d'une universite saoudienne, et le permis de sejour est gratuit pendant toute la duree des etudes. Le regime couvre la licence, le diplome superieur, le master et le doctorat. Aucun montant n'est donc porte : il n'y a pas de voie autofinancee documentee. Les pages de bourses du site de l'universite existent mais leur contenu ne s'affiche pas (refonte en cours).",
        "licence": {
          "montant": 0,
          "devise": "SAR",
          "periode": "an"
        },
        "master": {
          "montant": 0,
          "devise": "SAR",
          "periode": "an"
        },
        "doctorat": {
          "montant": 0,
          "devise": "SAR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "systematique",
        "detail": "L'Etat saoudien prend en charge la scolarite des etudiants internationaux admis : etudes gratuites, sans frais de scolarite. Le ministere distingue trois types de bourses en universite publique : bourse gratuite avec avantages complets ; bourse partielle (place d'etudes seule, ou place plus logement) ; et places payantes. La categorie exacte depend du conseil de l'etablissement. Candidature via les universites elles-memes, via l'attache culturel saoudien du pays d'origine ou, a defaut, l'ambassade ; plateforme d'Etat « Study in Saudi ». Base juridique : resolution du Conseil des ministres n° 94 du 29/03/1431 H.",
        "source": "https://www.moe.gov.sa/en/education/ResidentsAndvisitors/Pages/PublicUniversitiesScholarships.aspx",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "king-saud-university-riyad",
    "champs": {
      "fraisScolarite": {
        "source": "https://dgsinitiative.ksu.edu.sa/",
        "verifieLe": "2026-09-13",
        "note": "AUCUN TARIF DE SCOLARITE N'EST PUBLIE : comme les autres universites publiques saoudiennes, l'universite admet les non-Saoudiens sous regime de bourse d'Etat, etudes sans frais de scolarite. Au DOCTORAT, elle va plus loin avec la « King Saud University Initiative » de la Deanship of Graduate Studies, ouverte aux candidats du monde entier : prise en charge TOTALE de la scolarite, allocation mensuelle totalisant 54 000 SAR (environ 14 400 USD) par an, et logement sur le campus, pendant les 3 ans du doctorat, en informatique, ingenierie, sciences fondamentales et appliquees, sante et sciences medicales. Conditions : master reconnu, TOEFL iBT 61 ou IELTS 6 ou STEP 85, deux lettres de recommandation, CV et lettre de motivation. Aucune grille pour etudiants non boursiers n'a ete trouvee sur le site de l'universite.",
        "licence": {
          "montant": 0,
          "devise": "SAR",
          "periode": "an"
        },
        "master": {
          "montant": 0,
          "devise": "SAR",
          "periode": "an"
        },
        "doctorat": {
          "montant": 0,
          "devise": "SAR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "systematique",
        "detail": "Deux dispositifs cumules. Regime national : les universites publiques saoudiennes accueillent les etudiants internationaux admis sans frais de scolarite, avec logement, allocation et avantages associes (resolution du Conseil des ministres n° 94), candidature via la plateforme d'Etat « Study in Saudi » ou l'attache culturel saoudien. Propre a l'universite, au doctorat : la KSU Initiative couvre la totalite de la scolarite, verse 54 000 SAR par an d'allocation de vie et fournit le logement sur le campus pendant 3 ans.",
        "source": "https://dgsinitiative.ksu.edu.sa/",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "princess-nourah-university-riyad",
    "champs": {
      "fraisScolarite": {
        "source": "https://pnu.edu.sa/en/RegAdm/RegBSC/Pages/External.aspx",
        "verifieLe": "2026-09-13",
        "note": "Universite publique FEMININE : les bourses academiques sont reservees aux etudiantes non saoudiennes. AUCUN TARIF DE SCOLARITE N'EST PUBLIE ; la page officielle des bourses externes, pour les candidates residant hors du royaume, ne mentionne aucun frais a la charge de l'etudiante et enumere au contraire les avantages recus. Deux voies : bourses externes pour les residentes a l'etranger, bourses internes pour celles deja en Arabie Saoudite avec un titre de sejour valide. Conditions d'age en licence : 17 a 25 ans ; baccalaureat obtenu depuis moins de 5 ans, authentifie par la mission culturelle saoudienne ; casier judiciaire et certificat medical. Niveau d'arabe B2 exige pour les candidates de pays non arabophones, sinon admission au diplome d'arabe pour non-arabophones. SELECTIVITE ELEVEE pour les candidates de pays arabes : 98/100 au baccalaureat et SAT 1330/1600 pour l'ingenierie, l'informatique, les sciences et la gestion ; 95/100 pour les humanites et sciences sociales. Seule la page de la licence a ete lue ; celles du master et du doctorat ne l'ont pas ete.",
        "licence": {
          "montant": 0,
          "devise": "SAR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "systematique",
        "detail": "Avantages accordes aux boursieres externes en application du reglement d'accueil des etudiants non saoudiens : couverture sante pendant toute la duree des etudes ; allocation d'installation de deux mois a l'arrivee ; allocation de trois mois a la fin des etudes pour l'expedition des livres ; repas a tarif reduit ; logement fourni avec accompagnement academique, social et culturel ; remboursement du billet d'avion d'entree dans le royaume ; allocation mensuelle identique a celle des etudiantes saoudiennes ; allocation annuelle d'un mois pour l'achat de livres ; prime d'excellence de 1 000 SAR par annee academique ; un billet d'avion annuel vers le pays de residence ; et prise en charge des frais de visa d'etudes. Candidature obligatoirement via la plateforme d'Etat « Study in Saudi ».",
        "source": "https://pnu.edu.sa/en/RegAdm/RegBSC/Pages/External.aspx",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "jawaharlal-nehru-university-delhi",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.jnu.ac.in/isa-feestructure",
        "verifieLe": "2026-09-13",
        "note": "Grille officielle des frais des ressortissants etrangers, en dollars et affichee PAR SEMESTRE ; les montants ci-dessous sont ANNUALISES sur les deux semestres de l'annee universitaire (mousson et hiver). La grille est organisee en QUATRE ZONES D'ORIGINE — pays d'Asie du Sud, AFRIQUE ET AMERIQUE LATINE, Asie de l'Ouest, autres pays — et le meme tarif s'applique aux trois niveaux, licence, master et doctorat confondus. Colonne AFRIQUE ET AMERIQUE LATINE : 400 USD par semestre en sciences, 300 USD par semestre en sciences humaines, soit 800 et 600 USD par an. Les montants retenus sont ceux des SCIENCES ; pour les sciences humaines, retirer 200 USD par an. A titre de comparaison : Asie du Sud 300/200 USD par semestre, Asie de l'Ouest 600/500, autres pays 1 250/1 000. S'ajoutent des frais d'inscription de 500 USD payes UNE SEULE FOIS a l'admission par tous les etrangers, et environ 100 USD par semestre de frais annexes. Non lus : les frais de logement en cite universitaire et le detail programme par programme. C'est, de loin, l'universite la moins chere du catalogue pour un etudiant africain.",
        "licence": {
          "montant": 800,
          "devise": "USD",
          "periode": "an"
        },
        "master": {
          "montant": 800,
          "devise": "USD",
          "periode": "an"
        },
        "doctorat": {
          "montant": 800,
          "devise": "USD",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "inconnue",
        "detail": "La page des frais ne mentionne aucune exoneration. Les etudiants africains passent le plus souvent par les bourses ICCR du gouvernement indien, mais aucune page officielle de l'universite ne le confirme, donc cela n'est pas affirme ici.",
        "source": "https://www.jnu.ac.in/isa-feestructure",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "university-of-delhi-delhi",
    "champs": {
      "fraisScolarite": {
        "source": "https://sscbs.du.ac.in/wp-content/uploads/2024/08/Foreign-Students-Fee-Structure.pdf",
        "verifieLe": "2026-09-13",
        "note": "Document officiel « Foreign Students Fee Structure » du bureau des etudiants etrangers de l'universite, annee 2024-2025, en roupies. TROIS composantes distinctes : des frais d'inscription payes UNE SEULE FOIS (48 400 INR en licence, 58 080 en master, 68 420 en doctorat) ; des frais d'inscription annuels aupres du college ou du departement, 21 780 INR PAR AN, identiques aux trois niveaux ; et les droits de cours eux-memes, tres variables par programme. Les montants ci-dessous sont la TROISIEME composante, le cout annuel du cours, categorie « autres pays que le Tibet et l'Asie du Sud », donc applicable aux Africains : licence 234 740 INR/an (informatique, journalisme, gestion, soins infirmiers) ; master 129 000 INR/an (informatique, sciences, nutrition, informatique medicale, electronique, biologie moleculaire). Pour situer les extremes : le MBA a temps plein est a 800 000 INR/an. AJOUTER a ces montants les 21 780 INR annuels et, la premiere annee, les frais d'inscription unique. Aucun tarif de doctorat n'apparait dans la partie detaillee du document. Les chiffres sont ceux de 2024-2025 : le guide d'admission 2025-2026 n'a pas pu etre ouvert.",
        "licence": {
          "montant": 234740,
          "devise": "INR",
          "periode": "an"
        },
        "master": {
          "montant": 129000,
          "devise": "INR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Le document indique une exoneration ciblee : les candidats tibetains sont dispenses des frais d'inscription universitaires et des frais additionnels dus au college ou au departement au titre d'etudiant etranger. Aucune exoneration generale pour les autres nationalites n'est mentionnee.",
        "source": "https://sscbs.du.ac.in/wp-content/uploads/2024/08/Foreign-Students-Fee-Structure.pdf",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "universiti-malaya-kuala-lumpur",
    "champs": {
      "fraisScolarite": {
        "source": "https://study.um.edu.my/doc/tution-fee/Fee%20Structure,%20PG,%20International%20-%20Updated%2022%20Oct%202025.pdf",
        "verifieLe": "2026-09-13",
        "note": "ATTENTION : les grilles officielles de l'Universiti Malaya affichent le cout TOTAL DU PROGRAMME en ringgits, PAS un cout annuel. L'universite precise que le montant est calcule sur la duree minimale ou habituelle des etudes : 8 semestres (4 ans) en licence, 4 semestres (2 ans) en master, 6 semestres (3 ans) en doctorat. Les montants ci-dessous sont donc le total OFFICIEL DIVISE par cette duree. Totaux lus, documents mis a jour le 22 octobre 2025 : licence en genie civil 132 100 MYR sur 4 ans (identique en genie biomedical, electrique, mecanique et chimique) ; master en informatique 43 200 MYR sur 2 ans ; doctorat de la faculte d'informatique 86 600 MYR sur 3 ans. L'ECART ENTRE PROGRAMMES EST ENORME : licence en langues et linguistique 65 000 a 70 100 MYR, sciences du sport 75 100 a 84 700, architecture 103 900, sciences biomedicales et soins infirmiers 149 200, pharmacie 280 100, medecine et chirurgie 673 200 ; master MBA 79 100, management 50 100, economie 45 100, physique appliquee 28 300, statistiques 27 000, data science 41 700, cybersecurite et intelligence artificielle 48 100 ; doctorat faculte des sciences 80 900, administration des affaires 88 100, commerce et economie 92 200. Les frais sont factures a chaque inscription semestrielle et tout semestre supplementaire se paie en plus. Logement non compris. Non lues : les pages suivantes de chaque brochure et les frais annexes.",
        "licence": {
          "montant": 33025,
          "devise": "MYR",
          "periode": "an"
        },
        "master": {
          "montant": 21600,
          "devise": "MYR",
          "periode": "an"
        },
        "doctorat": {
          "montant": 28867,
          "devise": "MYR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "inconnue",
        "detail": "Les brochures tarifaires ne mentionnent aucune exoneration ni bourse pour les internationaux, et aucune page de bourses de l'universite n'a ete consultee.",
        "source": "https://study.um.edu.my/doc/tution-fee/Fee%20Structure,%20PG,%20International%20-%20Updated%2022%20Oct%202025.pdf",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "universiti-kebangsaan-malaysia-kuala-lumpur",
    "champs": {
      "fraisScolarite": {
        "source": "https://shape.ukm.my/storage/lampiran/struktur_yuran/FST/pasca/strukturyuran_FST_UKMi_pasca_F_int.pdf",
        "verifieLe": "2026-09-13",
        "note": "Grilles internationales publiees FACULTE PAR FACULTE, en ringgits et PAR SEMESTRE ; les montants ci-dessous sont ANNUALISES sur les deux semestres de l'annee universitaire. LICENCE, faculte des sciences de la sante, plein temps, 8 semestres sur 4 ans : inscription unique 2 520 MYR, scolarite du 1er semestre 12 650 MYR, puis 8 800 MYR par semestre pour les 7 suivants, plus 780 MYR d'activites par semestre — soit 17 600 MYR par an en regime de croisiere et environ 74 250 MYR pour tout le cursus, hors logement. MASTER ET DOCTORAT, faculte des sciences et technologies, international plein temps : doctorat en recherche 10 350 MYR par semestre, minimum 6 semestres, total 63 810 MYR inscription comprise ; master en recherche 7 600 MYR par semestre, minimum 4 semestres, total 31 810 MYR. L'universite precise que l'etudiant doit le total correspondant au nombre MINIMUM de semestres meme s'il finit plus tot, et que tout semestre supplementaire se facture 3 000 MYR. CAUTION EXIGEE, variable selon le pays : 1 500 MYR pour l'Afrique en general, 2 000 MYR pour l'Angola, le Burkina Faso, le Burundi, le Cameroun, la Centrafrique, les deux Congo, la Cote d'Ivoire, Djibouti, la Guinee equatoriale, l'Erythree, l'Ethiopie, la Guinee-Bissau, le Ghana, le Liberia, le Mali, le Mozambique, le Niger, le Nigeria, le Rwanda et le Sahara occidental. Logement en cite 480 a 1 200 MYR par semestre, non compris. Non lues : les grilles des autres facultes, ou les montants varient fortement — en dentisterie le doctorat est a 11 730 MYR et le master applique a 45 000 MYR par semestre.",
        "licence": {
          "montant": 17600,
          "devise": "MYR",
          "periode": "an"
        },
        "master": {
          "montant": 15200,
          "devise": "MYR",
          "periode": "an"
        },
        "doctorat": {
          "montant": 20700,
          "devise": "MYR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "inconnue",
        "detail": "Les grilles tarifaires ne mentionnent aucune exoneration pour les internationaux, et aucune page de bourses de l'universite n'a ete consultee.",
        "source": "https://shape.ukm.my/storage/lampiran/struktur_yuran/FST/pasca/strukturyuran_FST_UKMi_pasca_F_int.pdf",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "jkuat-juja",
    "champs": {
      "exoneration": {
        "politique": "inconnue",
        "detail": "Aucune page de bourses ou d'exoneration n'a ete lue. La seule regle tarifaire officielle trouvee va dans le sens contraire : les etudiants internationaux paient 20 % de plus que les Kenyans sur tous les postes de la grille, en licence comme en master et en doctorat.",
        "source": "https://www.jkuat.ac.ke/school/sobee/?page_id=17311",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "icipe-nairobi",
    "champs": {
      "exoneration": {
        "politique": "systematique",
        "detail": "Le centre ne recrute qu'en bourse. La bourse ARPPIS-DAAD couvre l'integralite du programme doctoral sur 3 ans : voyage, frais de vie, assurance medicale, droits universitaires verses a l'universite partenaire qui delivre le diplome, et tous les frais de recherche et de formation. La candidature se fait aupres d'icipe et du DAAD, pas aupres d'une universite.",
        "source": "https://www.icipe.org/capacity-building/arppis",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "istanbul-university-istanbul",
    "champs": {
      "fraisScolarite": {
        "source": "https://cdn.istanbul.edu.tr/FileHandler2.ashx?f=tuition-fees-2024-2025.pdf",
        "verifieLe": "2026-09-13",
        "note": "Grille officielle PDF du serveur de l'universite, annee 2024-2025, en dollars. Le tableau donne DEUX colonnes, tarif d'un semestre et tarif annuel : le montant annuel est donc affiche par l'universite elle-meme, sans recalcul. Licence, selon la faculte : lettres 2 000 ; economie 2 500 ; gestion, sciences politiques, communication, transport et logistique 3 000 ; sciences, sciences aquatiques, soins infirmiers et informatique 3 500 ; droit et architecture 4 000 ; pharmacie et conservatoire 5 000 ; dentaire 6 500 ; medecine 10 000. Montant retenu en licence : 3 000 USD, le palier le plus frequent. La ligne du troisieme cycle donne 1 000 USD par semestre, soit 2 000 USD/an, SANS distinction entre master et doctorat — le meme montant est donc porte aux deux niveaux. ATTENTION A L'ANNEE : la grille 2025-2026 n'a pas pu etre lue, l'en-tete du PDF annonce qu'elle sera mise a jour et le fichier correspondant ne se charge pas ; la page du bureau international redirige vers l'accueil. Le PDF prevoit aussi une remise de 25 % si plusieurs enfants d'une meme famille etudient dans un etablissement public turc.",
        "licence": {
          "montant": 3000,
          "devise": "USD",
          "periode": "an"
        },
        "master": {
          "montant": 2000,
          "devise": "USD",
          "periode": "an"
        },
        "doctorat": {
          "montant": 2000,
          "devise": "USD",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "inconnue",
        "detail": "Aucune politique de bourse propre a l'universite n'a pu etre lue : la page du bureau international redirige vers l'accueil. Le seul allegement ecrit dans le PDF officiel est une remise de 25 % pour fratrie, quand plusieurs enfants d'une meme famille sont inscrits dans un etablissement superieur public turc. S'agissant d'une universite d'Etat, ses etudiants internationaux passent normalement par le programme national Turkiye Burslari, mais cela n'a pas ete verifie sur le site de l'universite et ne doit pas etre presente comme acquis.",
        "source": "https://cdn.istanbul.edu.tr/FileHandler2.ashx?f=tuition-fees-2024-2025.pdf",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "koc-university-istanbul",
    "champs": {
      "fraisScolarite": {
        "source": "https://international.ku.edu.tr/undergraduate-programs/tuition-and-scholarships/",
        "verifieLe": "2026-09-13",
        "note": "Universite PRIVEE. Tarifs officiels 2025-2026 pour etudiants internationaux, en dollars. Licence : 38 000 USD/an pour la quasi-totalite des programmes — droit, soins infirmiers, sciences sociales et humaines, economie, gestion, relations internationales, toutes les ingenieries, sciences — et 59 000 USD/an en medecine. Les frais sont annonces par semestre mais le montant affiche couvre deja l'annee complete : aucun recalcul. MASTER ET DOCTORAT, POINT DECISIF : les programmes de master avec these et de doctorat des ecoles doctorales de sciences et ingenierie, de sciences sociales et humaines et de commerce sont affiches « 0 USD, entierement finances ». Seule l'ecole doctorale des sciences de la sante facture, a 30 800 USD/an en master comme en doctorat, et le LLM en droit 24 300 USD/an. Le montant retenu de 30 800 USD est le seul tarif reellement paye par un autofinance — mais POUR UN CANDIDAT AFRICAIN EN INGENIERIE OU EN SCIENCES SOCIALES LE MONTANT REEL EST ZERO. Non lus : le tableau des masters sans these et les grilles 2026-2027, non encore publiees.",
        "licence": {
          "montant": 38000,
          "devise": "USD",
          "periode": "an"
        },
        "master": {
          "montant": 30800,
          "devise": "USD",
          "periode": "an"
        },
        "doctorat": {
          "montant": 30800,
          "devise": "USD",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "systematique",
        "detail": "INFORMATION DECISIVE POUR UN ETUDIANT AFRICAIN. En LICENCE, Koc evalue AUTOMATIQUEMENT tous les candidats internationaux pour une bourse au merite couvrant tout ou partie des frais, sans formulaire ni dossier separe ; la bourse est accordee pour toute la duree du cursus, sans condition de moyenne a maintenir. Il n'existe ni score ni moyenne garantissant la bourse, et la decision est sans recours. Attention : une bourse Koc exclut toute autre aide financee par l'universite (logement, livres, frais de vie). En MASTER AVEC THESE et en DOCTORAT, l'offre d'admission s'accompagne AUTOMATIQUEMENT d'une bourse pour les programmes eligibles des trois ecoles doctorales — d'ou les tarifs a zero — avec en general allocation mensuelle et logement. L'universite recommande fortement de deposer EN PLUS une candidature au programme national Turkiye Burslari (hors medecine et droit), qui couvre 100 % des frais et ajoute logement, allocation mensuelle et billet d'avion, avantages que les bourses propres de Koc n'offrent pas.",
        "source": "https://international.ku.edu.tr/undergraduate-programs/tuition-and-scholarships/",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "sabanci-university-istanbul",
    "champs": {
      "fraisScolarite": {
        "source": "https://iro.sabanciuniv.edu/en/tuition-fee",
        "verifieLe": "2026-09-13",
        "note": "Universite PRIVEE. Le bureau des relations internationales affiche un chiffre unique et explicitement ANNUEL pour 2026-2027 : 36 500 USD pour les etudiants internationaux de licence, sans distinction de faculte. Aucun recalcul semestriel. MASTER ET DOCTORAT : l'universite ecrit que « la quasi-totalite des etudiants admis dans les programmes academiques de troisieme cycle, hors programmes professionnels, recoivent une exoneration totale des frais annuels » — d'ou zero porte aux deux niveaux, ce qui correspond a la situation reelle de la quasi-totalite des admis. Non lus : le tarif des programmes professionnels, MBA compris, que l'universite ne publie pas et renvoie a une adresse de contact, et les frais de logement en residence.",
        "licence": {
          "montant": 36500,
          "devise": "USD",
          "periode": "an"
        },
        "master": {
          "montant": 0,
          "devise": "USD",
          "periode": "an"
        },
        "doctorat": {
          "montant": 0,
          "devise": "USD",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "systematique",
        "detail": "INFORMATION DECISIVE POUR UN ETUDIANT AFRICAIN. En LICENCE, tout candidat international remplissant les conditions de candidature est evalue AUTOMATIQUEMENT pour une bourse, accordee sous forme d'exoneration de frais. Les paliers officiels sont 25, 40, 50, 60 et 75 % — la couverture n'atteint donc PAS 100 % en licence : un boursier a 75 % paie encore environ 9 125 USD/an. S'y ajoutent des bourses de logement couvrant une chambre de trois ou quatre personnes sur le campus. En MASTER ET DOCTORAT academiques : exoneration TOTALE des frais annuels pour la quasi-totalite des admis, et la majorite recoit en outre une allocation mensuelle et une chambre gratuite en residence ; les bourses sont attribuees au merite par le jury d'admission puis validees par le conseil de l'ecole doctorale, SANS candidature separee. Les programmes professionnels sont exclus de cette exoneration.",
        "source": "https://www.sabanciuniv.edu/en/graduate-scholarships",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "yonsei-university-seoul",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.yonsei.ac.kr/sites/en_sc/down/2026_fee1.pdf",
        "verifieLe": "2026-09-13",
        "note": "Universite privee. Documents officiels 2026 des frais pour etudiants internationaux, montants PAR SEMESTRE en wons, doubles ici. Le tableau distingue le premier semestre, plus cher d'environ 214 000 KRW (les frais d'entree y sont integres), des semestres suivants. LICENCE, tarif annuel par faculte : lettres, theologie et sciences sociales 9 112 000 ; commerce et economie 9 180 000 ; sciences, ecologie humaine et education physique 10 594 000 ; sciences de la vie 11 300 000 ; ingenierie et informatique 12 008 000 ; musique 13 454 000 ; pharmacie 13 934 000 ; Global Leaders College 14 348 000 ; Underwood International College 16 404 000 ; School of Integrated Technology 18 014 000. MONTANT RETENU : 9 112 000 KRW, le plancher — mais ATTENTION, un etudiant africain visant l'Underwood International College, la filiere anglophone la plus courante pour les internationaux, paiera pres du DOUBLE. MASTER ET DOCTORAT : l'ecole doctorale generale applique la MEME grille aux deux niveaux — lettres et sciences sociales 10 958 000 KRW/an ; commerce et economie 11 016 000 ; sciences de la vie, ecologie humaine, sport et soins infirmiers 13 228 000 ; ingenierie 15 422 000 ; pharmacie 14 954 000 ; medecine et dentaire 17 592 000 ; musique 16 884 000. DROIT D'ENTREE UNIQUE de 1 028 000 KRW en troisieme cycle. Non lus : les frais des ecoles doctorales speciales et professionnelles, et les frais annexes obligatoires (conseil etudiant, sante, mutuelle), marginaux.",
        "licence": {
          "montant": 9112000,
          "devise": "KRW",
          "periode": "an"
        },
        "master": {
          "montant": 10958000,
          "devise": "KRW",
          "periode": "an"
        },
        "doctorat": {
          "montant": 10958000,
          "devise": "KRW",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "inconnue",
        "detail": "AUCUNE page officielle de bourses n'a pu etre lue : les deux documents consultes ne donnent que les tarifs. Le seul allegement documente est structurel et non discretionnaire — les semestres suivants sont factures environ 214 000 KRW de moins que le premier. Ne rien affirmer sur les bourses de cette universite sans verifier la page dediee du bureau des admissions internationales.",
        "source": "https://www.yonsei.ac.kr/sites/en_sc/down/2026_fee2.pdf",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "postech-pohang",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.postech.ac.kr/eng/admission-aid/scholarship_information.do",
        "verifieLe": "2026-09-13",
        "note": "VERIFICATION FAITE, LA REPUTATION EST CONFIRMEE PAR L'UNIVERSITE ELLE-MEME. LICENCE : la page officielle des bourses enonce que « tous les etudiants internationaux admis a POSTECH recoivent une bourse complete des leur inscription », maintenue sur les 8 semestres du cursus si l'etudiant valide au moins 12 credits par semestre et garde une moyenne de 3,3 ou un rang au 87e percentile. MASTER ET DOCTORAT : la bourse d'assistanat couvre une composante de frais de scolarite de 884 000 KRW par mois plus une allocation de vie, soit un total mensuel de 1 850 000 KRW en master et 2 200 000 KRW en doctorat — les frais sont donc absorbes et l'etudiant percoit un REVENU NET. Les montants portes a zero sont le cout REEL pour l'etudiant, pas le tarif affiche : le prix catalogue de POSTECH avant bourse n'apparait sur aucune page officielle consultee, et les seuls chiffres nominaux trouves provenaient de sites d'agregation, ecartes.",
        "licence": {
          "montant": 0,
          "devise": "KRW",
          "periode": "an"
        },
        "master": {
          "montant": 0,
          "devise": "KRW",
          "periode": "an"
        },
        "doctorat": {
          "montant": 0,
          "devise": "KRW",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "systematique",
        "detail": "INFORMATION DECISIVE POUR UN ETUDIANT AFRICAIN. LICENCE : bourse complete AUTOMATIQUE des l'inscription pour tous les admis internationaux passes par la filiere d'admission internationale — attention, les etudiants de nationalite etrangere admis par la filiere nationale ou par celle des Coreens de l'etranger n'y ont PAS droit. Reconduction sur 8 semestres sous conditions de credits et de moyenne. S'ajoutent une prime d'installation, une allocation de vie, du travail etudiant et une bourse de coreen. TROISIEME CYCLE : le systeme d'assistanat finance integralement, avec 1 850 000 KRW par mois en master et 2 200 000 KRW en doctorat ; le premier semestre garantit au minimum la bourse de base, le montant variant ensuite selon les resultats et le laboratoire. Le cumul avec des bourses externes est autorise et SANS PLAFOND. Bourses complementaires : POSCO Global Scholarship (frais complets, allocation mensuelle, 1 000 000 KRW d'installation et assurance maladie, jusqu'a 6 semestres en doctorat et 4 en master, pour des nationalites designees par la fondation — verifier la liste, elle change) ; la bourse Ruth L. Satter est reservee aux etudiantes asiatiques et ne s'applique pas. Les bourses gouvernementales coreennes couvrent 5 000 000 KRW/an mais supposent d'etre admis par ces filieres specifiques.",
        "source": "https://adm-g.postech.ac.kr/ENG/graduate-info/support-policy/",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "korea-national-university-of-arts-seoul",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.karts.ac.kr/en/karts/finance.do",
        "verifieLe": "2026-09-13",
        "note": "Ecole d'art NATIONALE, ce qui explique un tarif tres inferieur au prive coreen. La page officielle affiche des droits ANNUELS de 4 800 000 wons — chiffre explicitement annuel, aucun doublement a faire. Le graphique comparatif de la meme page le confirme : 4 800 000 KRW contre 7 390 000, 9 650 000 et 10 290 000 pour trois universites privees, et une moyenne des universites privees coreennes de 7 100 000 KRW en 2025. La page indique aussi un gel ou une baisse des droits depuis 2009, soit 18 ans. IMPORTANT : la page ne ventile PAS le tarif par niveau, elle donne un chiffre global pour l'etablissement. Le montant est donc porte a la seule licence, le master et le doctorat etant omis plutot qu'extrapoles. K-Arts delivre un cursus de licence puis un programme professionnel de niveau master, et n'a pas de doctorat au sens classique — point non verifie sur une page officielle. Non lus : le droit d'entree eventuel et les frais de dossier.",
        "licence": {
          "montant": 4800000,
          "devise": "KRW",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "La page officielle chiffre l'effort de bourse : 61 % des etudiants en recoivent une, pour 4 162 beneficiaires et 5,99 milliards de wons distribues, soit une moyenne de 1 439 452 KRW par etudiant — environ 30 % des droits annuels. La couverture moyenne est donc PARTIELLE, pas integrale. Bourses internes : excellent resultat au concours d'entree, bon resultat au concours, performance academique, contribution au developpement de l'ecole, encouragement academique pour les etudiants en difficulte financiere, bourse familiale, service communautaire et travail-etudes. Pour un candidat africain, le dispositif le plus pertinent est le projet Art Major Asian Scholarship, dont la page officielle detaille les nationalites eligibles — a verifier au cas par cas avant d'orienter un etudiant, la page n'ayant pas ete ouverte.",
        "source": "https://www.karts.ac.kr/en/karts/finance.do",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "rudn-university-moscow",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.rudn.ru/sveden/paid_edu/",
        "verifieLe": "2026-09-13",
        "note": "La grille destinee aux citoyens russes et de la CEI a bien ete ECARTEE. Le document retenu est l'arrete officiel n° 33-r du 19 janvier 2026 sur le cout des etudes pour les citoyens etrangers des pays du LOINTAIN ETRANGER — exactement la categorie dont relevent les etudiants africains. Montants explicitement ANNUELS, affiches en dollars, hors taxes. LICENCE : sociologie, philosophie, histoire et etudes religieuses 5 100 ; arts et sciences humaines 5 250 ; administration publique 5 350 ; securite de l'information 5 700 ; agronomie, veterinaire, ecologie, architecture, ingenieries 5 750 ; science politique, etudes regionales 5 850 ; droit 6 000 a 6 500 ; informatique 6 300 ; relations internationales 6 600 ; geologie et mines 6 550 ; linguistique 7 500. Economie et management sont a paliers : 7 000 les deux premieres annees, 8 000 ensuite. Montant retenu : 5 100 USD, le plancher officiel. MASTER (2 ans) : sciences humaines et sociales, droit, tourisme 5 550 ; ressources humaines, finance, management, economie 5 850 a 6 100 ; agronomie, architecture, geologie 6 200 ; nanotechnologies, petrole et gaz 6 950. Retenu : 5 550 USD. DOCTORAT (arrete n° 93-r du 26 janvier 2026) : 6 450 USD/an en sciences humaines, informatique et intelligence artificielle, 6 550 en biologie, agronomie et geologie ; duree 3 ans, 4 en biologie et agronomie. Le doctorat a distance coute 50 % du tarif presentiel. FACULTE PREPARATOIRE, annee de langue russe tres frequente pour les candidats africains : 4 300 USD/an, 4 900 pour medecine, dentaire, philologie et linguistique. Non lus : les programmes de doctorat en anglais et la grille de l'internat medical.",
        "licence": {
          "montant": 5100,
          "devise": "USD",
          "periode": "an"
        },
        "master": {
          "montant": 5550,
          "devise": "USD",
          "periode": "an"
        },
        "doctorat": {
          "montant": 6450,
          "devise": "USD",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "inconnue",
        "detail": "Les arretes lus fixent des tarifs et ne mentionnent aucune bourse ; aucune page officielle de l'universite consacree aux exonerations n'a ete ouverte, sa politique propre ne peut donc pas etre qualifiee. Ce qu'il faut savoir pour un etudiant africain est exterieur a l'universite : la Russie attribue chaque annee des places entierement financees par le quota du gouvernement, attribuees via Rossotroudnitchestvo et ses centres culturels russes dans les pays africains, ainsi que via l'olympiade Open Doors pour le master et le doctorat. Ces places couvrent les frais de scolarite et donnent droit a une bourse mensuelle et a un logement a tarif reduit. La candidature se fait AUPRES DE CES ORGANISMES, pas aupres de l'universite — c'est la voie a privilegier, les tarifs ci-dessus ne concernant que les autofinances.",
        "source": "https://www.rudn.ru/sveden/paid_edu/",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "spbu-saint-petersbourg",
    "champs": {
      "fraisScolarite": {
        "source": "https://english.spbu.ru/admission/tuition",
        "verifieLe": "2026-09-13",
        "note": "Grilles officielles 2026-2027, en ROUBLES et explicitement ANNUELLES : aucun doublement. Chaque tableau comporte deux colonnes et c'est systematiquement la seconde qui a ete lue, « pour les citoyens etrangers et les apatrides », et non celle reservee aux citoyens russes et bielorusses. LICENCE, par programme : mathematiques fondamentales et mecanique 383 800 ; mathematiques appliquees et informatique 386 900 a 429 500 ; cartographie et hydrometeorologie 394 500 ; geographie 399 800 ; science du sol 407 100 ; ecologie 407 200 ; mathematiques 459 500 ; physique 463 700 ; programmation 464 100 ; geologie 466 500 ; biologie 447 200 a 469 000 ; chimie 451 800 a 453 300 ; informatique appliquee 461 200 a 489 700 ; physique fondamentale 498 900 ; technologies de programmation 513 600 ; petrole et gaz 548 700 ; jusqu'a 750 800 en mathematiques et informatique. Retenu : 383 800 RUB, le plancher observe. MASTER : chimie 407 400 ; mathematiques 415 900 ; biologie 421 300 ; physique et mathematiques appliquees 422 000 ; petrole et gaz 436 700 ; mecanique 445 100 ; geologie 451 700 ; informatique 453 900 a 466 200 ; geographie, cartographie, ecologie 470 900 ; hydrometeorologie 477 500. Retenu : 407 400 RUB. DOCTORAT : de 407 100 a 447 000 RUB selon la specialite. Retenu : 407 100 RUB. ATTENTION : les montants retenus sont des PLANCHERS DE SCIENCES EXACTES, pas des moyennes toutes disciplines — les facultes de sciences humaines, de droit, de medecine et d'economie figurent dans les pages suivantes des memes documents, non parcourues.",
        "licence": {
          "montant": 383800,
          "devise": "RUB",
          "periode": "an"
        },
        "master": {
          "montant": 407400,
          "devise": "RUB",
          "periode": "an"
        },
        "doctorat": {
          "montant": 407100,
          "devise": "RUB",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "La page officielle des admissions internationales l'ecrit noir sur blanc : les candidats internationaux peuvent postuler a la bourse du gouvernement de la Federation de Russie, qui COUVRE INTEGRALEMENT les frais de scolarite et donne droit a une allocation mensuelle et a un logement en residence a tarif reduit. C'est la voie a recommander en priorite a un etudiant africain. La candidature passe par les representations de Rossotroudnitchestvo dans le pays de residence, et par l'olympiade Open Doors pour le master et le doctorat. Le nombre de places est contingente, d'ou « possible_plafonnee » et non « systematique ». Aucune bourse propre a l'universite, financee sur ses fonds, n'est mentionnee. Pour les autofinances, le paiement se fait par semestre.",
        "source": "https://english.spbu.ru/admission/tuition",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "waseda-university-tokyo",
    "champs": {
      "fraisScolarite": {
        "source": "https://admission-ebro.w.waseda.jp/ebro/ug/sils_en_2026/pageindices/index26.html",
        "verifieLe": "2026-09-13",
        "note": "Universite privee. FACULTE RETENUE : la School of International Liberal Studies, filiere entierement ANGLOPHONE, la plus accessible a un candidat africain — admission en septembre et en avril, aucun japonais exige a la candidature. Tableau officiel des frais de premiere annee : scolarite de 745 000 JPY au premier semestre et 745 000 au second, soit 1 490 000 JPY par an — tarif semestriel double ici. DROIT D'ENTREE UNIQUE de 200 000 JPY, preleve la premiere annee seulement. S'y ajoutent 1 500 JPY par semestre de cotisation a la mutuelle sante, soit 3 000 JPY/an. Total de la premiere annee affiche : 1 693 000 JPY, puis 1 493 000 les annees suivantes. La grille 2025 donnait exactement les memes montants : le tarif est stable. ECART ENTRE FACULTES NON CHIFFRE : Waseda facture par faculte et par programme, et les montants des autres facultes anglophones (sciences politiques et economie, sciences sociales, culture et medias, sciences et ingenierie) n'ont pas pu etre lus — le document de la faculte des sciences s'affiche en trop basse resolution, la page de synthese ne publie que des tableaux anterieurs a 2014. Retenir que les facultes scientifiques sont sensiblement plus cheres, sans avancer de chiffre. MASTER ET DOCTORAT VOLONTAIREMENT OMIS : les pages des ecoles doctorales renvoient toutes au bureau des admissions sans publier de montant.",
        "licence": {
          "montant": 1490000,
          "devise": "JPY",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Deux bourses sont attribuees AVANT l'inscription, sur les seuls resultats de l'admission, sans candidature ni formulaire prealable — le candidat est informe pendant la procedure d'inscription : une bourse reservee aux admis internationaux, 500 000 JPY par an pendant 2 ans, et une exoneration partielle de 50 % des frais annuels pendant 1 an pour les internationaux autofinances. AUCUNE ne couvre donc la totalite du cursus ni la totalite des frais. Apres l'inscription, Waseda declare plus de 100 bourses, internes et externes, toutes sous forme de dons non remboursables, et se situe en tete des universites japonaises pour le nombre de beneficiaires ; l'acces passe par une inscription en ligne obligatoire au debut de chaque semestre. Eligibilite stricte : seuls les etudiants internationaux autofinances titulaires du statut de sejour « Student » et inscrits dans un cursus diplomant peuvent postuler. AVERTISSEMENT EXPLICITE DE L'UNIVERSITE, a transmettre tel quel : toutes les bourses sont soumises a selection, la concurrence est forte et il est possible de n'en obtenir aucune — la faculte recommande fermement de disposer d'un plan de financement solide AVANT de partir pour le Japon. Beaucoup de bourses exterieures exigent en outre un bon niveau de japonais.",
        "source": "https://www.waseda.jp/fire/sils/en/applicants/tuitions/",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 57 (frais reels, les 84 dernieres universites) — lu sur les pages officielles le 2026-09-13 par huit lecteurs paralleles ; voir scripts/data/journal-frais-lot57-2026-09-13.md."
  }
];
