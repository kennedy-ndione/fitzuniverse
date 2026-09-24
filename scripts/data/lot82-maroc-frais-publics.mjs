// ============================================================
// FitzUniverse — Lot 82 : le prix des 13 établissements publics marocains
// Recherche du 2026-09-24, au navigateur, sources officielles seulement.
//
// POURQUOI
// 13 des 14 établissements marocains sans prix sont publics et
// n'admettent un étranger que par la voie diplomatique (AMCI). Aucun
// ne publie de tarif, et c'est cohérent : il n'y a pas de frais de
// scolarité à publier.
//
// LES PREUVES
// - Ministère de l'Enseignement supérieur, page « La mobilité
//   étudiante » : l'offre marocaine aux étudiants internationaux
//   comprend des « places pédagogiques à titre gracieux », une bourse
//   de subsistance, le logement selon les places, l'assurance médicale.
// - Loi-cadre 51-17 (BO n° 6944 du 17-12-2020, texte lu sur aneaq.ma),
//   article 45 : « L'Etat garantit la gratuité de l'enseignement public
//   dans tous ses cycles et spécialités ».
// - Relus sans trouver aucun tarif pour étrangers : uh1.ac.ma, um5.ac.ma
//   (inscription des étudiants internationaux), univh2c.ma, usmba.ac.ma,
//   iav.ac.ma, répertoire AMCI 2025-2026 (PDF, 14 pages).
// - La seule voie payante des universités publiques est le « temps
//   aménagé » (soir, week-end) : tarifs 2026-2027 annoncés par la presse
//   (5 000 DH en licence…), sans texte officiel publié. Hors AMCI, donc
//   hors de ce lot ; la note le signale.
//
// CHOIX
// - 0 DH (MAD) : la bande « Gratuit ou presque » s'applique.
// - Politique d'exonération « systematique » : la gratuité de la place
//   est accordée d'office à tout admis. Ce qui est contingenté, c'est la
//   BOURSE de subsistance, et le texte le dit. Même modèle que les
//   universités publiques saoudiennes (0 SAR, systematique).
// - IAV Hassan II : licence (entrée APESA) et master (cycle ingénieur),
//   pas de doctorat — le doctorat vétérinaire est un diplôme d'exercice
//   (même règle que l'UM6SS).
// - Reste sans prix : l'UIC (privée). Sa « fiche tarifaire » 2026-2027
//   est sur new-websrv.uic.ac.ma, injoignable le 2026-09-24 ; la
//   seule grille lisible date de 2022-2023, trop ancienne pour être
//   reprise.
//
// `attendu` : fraisScolarite ABSENT (undefined) et l'exonération telle
// qu'écrite par les lots 75-76. Si quelqu'un est passé avant, le lot
// bloque au lieu d'écraser.
// ============================================================

export const PATCHES = [
  {
    "collection": "universities",
    "id": "institut-agronomique-veterinaire-hassan-ii-rabat",
    "attendu": {
      "fraisScolarite": undefined,
      "exoneration": {
        "politique": "possible_plafonnee",
        "verifieLe": "2026-09-24",
        "detail": "L'AMCI accorde des bourses du Royaume du Maroc aux étudiants étrangers, dans le cadre des accords de coopération avec leur pays, et indique que 85 % de ses étudiants africains sont boursiers. La demande de bourse se fait avec le dossier déposé par la voie diplomatique, pas auprès de l'institut. L'institut ne publie aucune bourse ni exonération pour les étrangers.",
        "source": "https://www.amci.ma/cooperation-academique"
      }
    },
    "champs": {
      "fraisScolarite": {
        "source": "https://www.enssup.gov.ma/en/la-mobilite-etudiante",
        "verifieLe": "2026-09-24",
        "note": "Établissement public. Pour un étudiant étranger admis par la voie diplomatique (AMCI), la place est gratuite : le ministère de l'Enseignement supérieur cite, parmi les services offerts aux étudiants internationaux, des « places pédagogiques à titre gracieux », et la loi-cadre 51-17 de 2019 garantit, à son article 45, la gratuité de l'enseignement public dans tous ses cycles. L'institut ne publie aucun tarif pour les étrangers. D'éventuels droits d'inscription ne sont publiés nulle part : demandez-en le montant à l'établissement à votre arrivée. Restent à votre charge le logement et la vie courante, sauf si vous obtenez la bourse de subsistance de l'AMCI. Niveaux retenus : l'entrée après le bac (année préparatoire APESA) et le cycle ingénieur, à 0 DH. Le doctorat vétérinaire est un diplôme d'exercice : il n'est pas classé au niveau doctorat ici.",
        "licence": {
          "montant": 0,
          "devise": "MAD",
          "periode": "an"
        },
        "master": {
          "montant": 0,
          "devise": "MAD",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "systematique",
        "detail": "La place est gratuite pour tout étudiant admis par la voie diplomatique : le ministère parle de « places pédagogiques à titre gracieux ». Ce qui est limité, c'est la bourse de subsistance de l'AMCI, attribuée par quotas avec votre pays (l'AMCI indique que 85 % de ses étudiants africains sont boursiers), et le logement en cité, selon les places. Demandez la bourse avec votre dossier, auprès de l'autorité de votre pays ou de l'ambassade du Maroc.",
        "source": "https://www.enssup.gov.ma/en/la-mobilite-etudiante",
        "verifieLe": "2026-09-24"
      }
    },
    "motif": "frais de scolarité : place gratuite pour l'étudiant étranger admis par l'AMCI (enssup.gov.ma « places pédagogiques à titre gracieux » ; loi-cadre 51-17, art. 45), relu le 2026-09-24"
  },
  {
    "collection": "universities",
    "id": "universite-abdelmalek-essaadi-tetouan",
    "attendu": {
      "fraisScolarite": undefined,
      "exoneration": {
        "politique": "possible_plafonnee",
        "verifieLe": "2026-09-24",
        "detail": "Les bourses du Royaume du Maroc sont attribuées par l'AMCI, dans le cadre de la coopération avec votre pays. Le ministère cite, parmi les services offerts aux étudiants internationaux, des « places pédagogiques à titre gracieux », une assurance médicale et un logement selon les places. L'université a un Bureau des étudiants internationaux. La demande se fait avec le dossier, auprès de l'autorité de votre pays ou de l'ambassade du Maroc.",
        "source": "https://www.enssup.gov.ma/en/la-mobilite-etudiante"
      }
    },
    "champs": {
      "fraisScolarite": {
        "source": "https://www.enssup.gov.ma/en/la-mobilite-etudiante",
        "verifieLe": "2026-09-24",
        "note": "Université publique. Pour un étudiant étranger admis par la voie diplomatique (AMCI), la place est gratuite : le ministère de l'Enseignement supérieur cite, parmi les services offerts aux étudiants internationaux, des « places pédagogiques à titre gracieux », et la loi-cadre 51-17 de 2019 garantit, à son article 45, la gratuité de l'enseignement public dans tous ses cycles. L'université ne publie aucun tarif pour les étrangers. D'éventuels droits d'inscription ne sont publiés nulle part : demandez-en le montant à l'établissement à votre arrivée. Restent à votre charge le logement et la vie courante, sauf si vous obtenez la bourse de subsistance de l'AMCI ; la cité universitaire s'obtient par l'AMCI, selon les places. Ce montant vaut pour la formation initiale : les formations en temps aménagé, le soir et le week-end, relèvent d'un autre régime, payant. Montant retenu : 0 DH en licence, en master et en doctorat.",
        "licence": {
          "montant": 0,
          "devise": "MAD",
          "periode": "an"
        },
        "master": {
          "montant": 0,
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
        "politique": "systematique",
        "detail": "La place est gratuite pour tout étudiant admis par la voie diplomatique : le ministère parle de « places pédagogiques à titre gracieux ». Ce qui est limité, c'est la bourse de subsistance de l'AMCI, attribuée par quotas avec votre pays (l'AMCI indique que 85 % de ses étudiants africains sont boursiers), et le logement en cité, selon les places. Demandez la bourse avec votre dossier, auprès de l'autorité de votre pays ou de l'ambassade du Maroc.",
        "source": "https://www.enssup.gov.ma/en/la-mobilite-etudiante",
        "verifieLe": "2026-09-24"
      }
    },
    "motif": "frais de scolarité : place gratuite pour l'étudiant étranger admis par l'AMCI (enssup.gov.ma « places pédagogiques à titre gracieux » ; loi-cadre 51-17, art. 45), relu le 2026-09-24"
  },
  {
    "collection": "universities",
    "id": "universite-cadi-ayyad-marrakech",
    "attendu": {
      "fraisScolarite": undefined,
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Les bourses et aides à l'accueil passent par l'AMCI (agence marocaine de coopération). Ne postulez pas à l'université : déposez votre dossier auprès de l'autorité compétente de votre pays ou de l'ambassade du Maroc. Il passe ensuite par l'AMCI, puis par le ministère de l'Enseignement supérieur. Sans l'AMCI, le dossier n'est pas examiné. Vous vous inscrivez avec l'autorisation du ministère. Montant de la bourse non publié.",
        "source": "https://www.uca.ma/fr/page/agence-marocaine-de-la-cooperation-internationale-amci",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "fraisScolarite": {
        "source": "https://www.enssup.gov.ma/en/la-mobilite-etudiante",
        "verifieLe": "2026-09-24",
        "note": "Université publique. Pour un étudiant étranger admis par la voie diplomatique (AMCI), la place est gratuite : le ministère de l'Enseignement supérieur cite, parmi les services offerts aux étudiants internationaux, des « places pédagogiques à titre gracieux », et la loi-cadre 51-17 de 2019 garantit, à son article 45, la gratuité de l'enseignement public dans tous ses cycles. L'université ne publie aucun tarif pour les étrangers. D'éventuels droits d'inscription ne sont publiés nulle part : demandez-en le montant à l'établissement à votre arrivée. Restent à votre charge le logement et la vie courante, sauf si vous obtenez la bourse de subsistance de l'AMCI ; la cité universitaire s'obtient par l'AMCI, selon les places. Ce montant vaut pour la formation initiale : les formations en temps aménagé, le soir et le week-end, relèvent d'un autre régime, payant. Montant retenu : 0 DH en licence, en master et en doctorat.",
        "licence": {
          "montant": 0,
          "devise": "MAD",
          "periode": "an"
        },
        "master": {
          "montant": 0,
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
        "politique": "systematique",
        "detail": "La place est gratuite pour tout étudiant admis par la voie diplomatique : le ministère parle de « places pédagogiques à titre gracieux ». Ce qui est limité, c'est la bourse de subsistance de l'AMCI, attribuée par quotas avec votre pays (l'AMCI indique que 85 % de ses étudiants africains sont boursiers), et le logement en cité, selon les places. Demandez la bourse avec votre dossier, auprès de l'autorité de votre pays ou de l'ambassade du Maroc.",
        "source": "https://www.enssup.gov.ma/en/la-mobilite-etudiante",
        "verifieLe": "2026-09-24"
      }
    },
    "motif": "frais de scolarité : place gratuite pour l'étudiant étranger admis par l'AMCI (enssup.gov.ma « places pédagogiques à titre gracieux » ; loi-cadre 51-17, art. 45), relu le 2026-09-24"
  },
  {
    "collection": "universities",
    "id": "universite-chouaib-doukkali-el-jadida",
    "attendu": {
      "fraisScolarite": undefined,
      "exoneration": {
        "politique": "possible_plafonnee",
        "verifieLe": "2026-09-24",
        "detail": "L'AMCI accorde des bourses du Royaume du Maroc aux étudiants étrangers, dans le cadre des accords de coopération avec leur pays, et indique que 85 % de ses étudiants africains sont boursiers. La demande de bourse se fait avec le dossier déposé par la voie diplomatique, pas auprès de l'université. Aucune exonération propre à l'université n'est publiée.",
        "source": "https://www.amci.ma/cooperation-academique"
      }
    },
    "champs": {
      "fraisScolarite": {
        "source": "https://www.enssup.gov.ma/en/la-mobilite-etudiante",
        "verifieLe": "2026-09-24",
        "note": "Université publique. Pour un étudiant étranger admis par la voie diplomatique (AMCI), la place est gratuite : le ministère de l'Enseignement supérieur cite, parmi les services offerts aux étudiants internationaux, des « places pédagogiques à titre gracieux », et la loi-cadre 51-17 de 2019 garantit, à son article 45, la gratuité de l'enseignement public dans tous ses cycles. L'université ne publie aucun tarif pour les étrangers. D'éventuels droits d'inscription ne sont publiés nulle part : demandez-en le montant à l'établissement à votre arrivée. Restent à votre charge le logement et la vie courante, sauf si vous obtenez la bourse de subsistance de l'AMCI ; la cité universitaire s'obtient par l'AMCI, selon les places. Ce montant vaut pour la formation initiale : les formations en temps aménagé, le soir et le week-end, relèvent d'un autre régime, payant. Montant retenu : 0 DH en licence, en master et en doctorat.",
        "licence": {
          "montant": 0,
          "devise": "MAD",
          "periode": "an"
        },
        "master": {
          "montant": 0,
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
        "politique": "systematique",
        "detail": "La place est gratuite pour tout étudiant admis par la voie diplomatique : le ministère parle de « places pédagogiques à titre gracieux ». Ce qui est limité, c'est la bourse de subsistance de l'AMCI, attribuée par quotas avec votre pays (l'AMCI indique que 85 % de ses étudiants africains sont boursiers), et le logement en cité, selon les places. Demandez la bourse avec votre dossier, auprès de l'autorité de votre pays ou de l'ambassade du Maroc.",
        "source": "https://www.enssup.gov.ma/en/la-mobilite-etudiante",
        "verifieLe": "2026-09-24"
      }
    },
    "motif": "frais de scolarité : place gratuite pour l'étudiant étranger admis par l'AMCI (enssup.gov.ma « places pédagogiques à titre gracieux » ; loi-cadre 51-17, art. 45), relu le 2026-09-24"
  },
  {
    "collection": "universities",
    "id": "universite-hassan-ii-casablanca",
    "attendu": {
      "fraisScolarite": undefined,
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Avec l'AMCI, l'université offre des places, avec ou sans bourse, aux étudiants des pays partenaires ayant au moins le baccalauréat. Les bourses de l'AMCI suivent des quotas annuels et couvrent la durée normale des études (2 à 7 ans). Candidature par voie diplomatique : ambassade du Maroc dans votre pays ou ambassade de votre pays au Maroc. Seuls les candidats proposés officiellement à l'AMCI peuvent s'inscrire. Le montant n'est pas publié.",
        "source": "https://www.univh2c.ma/fr/page/etudiant-international",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "fraisScolarite": {
        "source": "https://www.enssup.gov.ma/en/la-mobilite-etudiante",
        "verifieLe": "2026-09-24",
        "note": "Université publique. Pour un étudiant étranger admis par la voie diplomatique (AMCI), la place est gratuite : le ministère de l'Enseignement supérieur cite, parmi les services offerts aux étudiants internationaux, des « places pédagogiques à titre gracieux », et la loi-cadre 51-17 de 2019 garantit, à son article 45, la gratuité de l'enseignement public dans tous ses cycles. L'université ne publie aucun tarif pour les étrangers. D'éventuels droits d'inscription ne sont publiés nulle part : demandez-en le montant à l'établissement à votre arrivée. Restent à votre charge le logement et la vie courante, sauf si vous obtenez la bourse de subsistance de l'AMCI ; la cité universitaire s'obtient par l'AMCI, selon les places. Ce montant vaut pour la formation initiale : les formations en temps aménagé, le soir et le week-end, relèvent d'un autre régime, payant. Montant retenu : 0 DH en licence, en master et en doctorat.",
        "licence": {
          "montant": 0,
          "devise": "MAD",
          "periode": "an"
        },
        "master": {
          "montant": 0,
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
        "politique": "systematique",
        "detail": "La place est gratuite pour tout étudiant admis par la voie diplomatique : le ministère parle de « places pédagogiques à titre gracieux ». Ce qui est limité, c'est la bourse de subsistance de l'AMCI, attribuée par quotas avec votre pays (l'AMCI indique que 85 % de ses étudiants africains sont boursiers), et le logement en cité, selon les places. Demandez la bourse avec votre dossier, auprès de l'autorité de votre pays ou de l'ambassade du Maroc.",
        "source": "https://www.enssup.gov.ma/en/la-mobilite-etudiante",
        "verifieLe": "2026-09-24"
      }
    },
    "motif": "frais de scolarité : place gratuite pour l'étudiant étranger admis par l'AMCI (enssup.gov.ma « places pédagogiques à titre gracieux » ; loi-cadre 51-17, art. 45), relu le 2026-09-24"
  },
  {
    "collection": "universities",
    "id": "universite-hassan-premier-settat",
    "attendu": {
      "fraisScolarite": undefined,
      "exoneration": {
        "politique": "possible_plafonnee",
        "verifieLe": "2026-09-24",
        "detail": "Chaque année, le Maroc offre via l'AMCI des quotas de places, avec ou sans bourse, aux titulaires du baccalauréat. Seuls les candidats proposés officiellement à l'AMCI par la voie diplomatique sont examinés. L'AMCI indique que 85 % de ses étudiants africains sont boursiers. Aucune exonération propre à l'université n'est publiée.",
        "source": "https://www.uh1.ac.ma/vie-estudiantine/vie-pratique/etudiants-etrangers/"
      }
    },
    "champs": {
      "fraisScolarite": {
        "source": "https://www.enssup.gov.ma/en/la-mobilite-etudiante",
        "verifieLe": "2026-09-24",
        "note": "Université publique. Pour un étudiant étranger admis par la voie diplomatique (AMCI), la place est gratuite : le ministère de l'Enseignement supérieur cite, parmi les services offerts aux étudiants internationaux, des « places pédagogiques à titre gracieux », et la loi-cadre 51-17 de 2019 garantit, à son article 45, la gratuité de l'enseignement public dans tous ses cycles. L'université ne publie aucun tarif pour les étrangers. D'éventuels droits d'inscription ne sont publiés nulle part : demandez-en le montant à l'établissement à votre arrivée. Restent à votre charge le logement et la vie courante, sauf si vous obtenez la bourse de subsistance de l'AMCI ; la cité universitaire s'obtient par l'AMCI, selon les places. Ce montant vaut pour la formation initiale : les formations en temps aménagé, le soir et le week-end, relèvent d'un autre régime, payant. Montant retenu : 0 DH en licence, en master et en doctorat.",
        "licence": {
          "montant": 0,
          "devise": "MAD",
          "periode": "an"
        },
        "master": {
          "montant": 0,
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
        "politique": "systematique",
        "detail": "La place est gratuite pour tout étudiant admis par la voie diplomatique : le ministère parle de « places pédagogiques à titre gracieux ». Ce qui est limité, c'est la bourse de subsistance de l'AMCI, attribuée par quotas avec votre pays (l'AMCI indique que 85 % de ses étudiants africains sont boursiers), et le logement en cité, selon les places. Demandez la bourse avec votre dossier, auprès de l'autorité de votre pays ou de l'ambassade du Maroc.",
        "source": "https://www.enssup.gov.ma/en/la-mobilite-etudiante",
        "verifieLe": "2026-09-24"
      }
    },
    "motif": "frais de scolarité : place gratuite pour l'étudiant étranger admis par l'AMCI (enssup.gov.ma « places pédagogiques à titre gracieux » ; loi-cadre 51-17, art. 45), relu le 2026-09-24"
  },
  {
    "collection": "universities",
    "id": "universite-ibn-tofail-kenitra",
    "attendu": {
      "fraisScolarite": undefined,
      "exoneration": {
        "politique": "possible_plafonnee",
        "verifieLe": "2026-09-24",
        "detail": "L'université cite les bourses de l'AMCI parmi les bourses destinées aux étudiants étrangers : elles sont accordées dans le cadre de la coopération entre le Maroc et votre pays. Le ministère cite, parmi les services offerts aux étudiants internationaux, des « places pédagogiques à titre gracieux », une assurance médicale et un logement selon les places. La demande se fait avec le dossier, auprès de l'autorité de votre pays ou de l'ambassade du Maroc.",
        "source": "https://www.uit.ac.ma/bourses/"
      }
    },
    "champs": {
      "fraisScolarite": {
        "source": "https://www.enssup.gov.ma/en/la-mobilite-etudiante",
        "verifieLe": "2026-09-24",
        "note": "Université publique. Pour un étudiant étranger admis par la voie diplomatique (AMCI), la place est gratuite : le ministère de l'Enseignement supérieur cite, parmi les services offerts aux étudiants internationaux, des « places pédagogiques à titre gracieux », et la loi-cadre 51-17 de 2019 garantit, à son article 45, la gratuité de l'enseignement public dans tous ses cycles. L'université ne publie aucun tarif pour les étrangers. D'éventuels droits d'inscription ne sont publiés nulle part : demandez-en le montant à l'établissement à votre arrivée. Restent à votre charge le logement et la vie courante, sauf si vous obtenez la bourse de subsistance de l'AMCI ; la cité universitaire s'obtient par l'AMCI, selon les places. Ce montant vaut pour la formation initiale : les formations en temps aménagé, le soir et le week-end, relèvent d'un autre régime, payant. Montant retenu : 0 DH en licence, en master et en doctorat.",
        "licence": {
          "montant": 0,
          "devise": "MAD",
          "periode": "an"
        },
        "master": {
          "montant": 0,
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
        "politique": "systematique",
        "detail": "La place est gratuite pour tout étudiant admis par la voie diplomatique : le ministère parle de « places pédagogiques à titre gracieux ». Ce qui est limité, c'est la bourse de subsistance de l'AMCI, attribuée par quotas avec votre pays (l'AMCI indique que 85 % de ses étudiants africains sont boursiers), et le logement en cité, selon les places. Demandez la bourse avec votre dossier, auprès de l'autorité de votre pays ou de l'ambassade du Maroc.",
        "source": "https://www.enssup.gov.ma/en/la-mobilite-etudiante",
        "verifieLe": "2026-09-24"
      }
    },
    "motif": "frais de scolarité : place gratuite pour l'étudiant étranger admis par l'AMCI (enssup.gov.ma « places pédagogiques à titre gracieux » ; loi-cadre 51-17, art. 45), relu le 2026-09-24"
  },
  {
    "collection": "universities",
    "id": "universite-ibn-zohr-agadir",
    "attendu": {
      "fraisScolarite": undefined,
      "exoneration": {
        "politique": "possible_plafonnee",
        "verifieLe": "2026-09-24",
        "detail": "Les bourses du Royaume du Maroc sont attribuées par l'AMCI, dans le cadre de la coopération avec votre pays. L'université indique que le logement des étudiants étrangers en cité universitaire se demande via l'AMCI, dans la limite des places. Le ministère cite, parmi les services offerts aux étudiants internationaux, des « places pédagogiques à titre gracieux », une assurance médicale et un logement selon les places.",
        "source": "https://www.uiz.ac.ma/logement-et-restauration"
      }
    },
    "champs": {
      "fraisScolarite": {
        "source": "https://www.enssup.gov.ma/en/la-mobilite-etudiante",
        "verifieLe": "2026-09-24",
        "note": "Université publique. Pour un étudiant étranger admis par la voie diplomatique (AMCI), la place est gratuite : le ministère de l'Enseignement supérieur cite, parmi les services offerts aux étudiants internationaux, des « places pédagogiques à titre gracieux », et la loi-cadre 51-17 de 2019 garantit, à son article 45, la gratuité de l'enseignement public dans tous ses cycles. L'université ne publie aucun tarif pour les étrangers. D'éventuels droits d'inscription ne sont publiés nulle part : demandez-en le montant à l'établissement à votre arrivée. Restent à votre charge le logement et la vie courante, sauf si vous obtenez la bourse de subsistance de l'AMCI ; la cité universitaire s'obtient par l'AMCI, selon les places. Ce montant vaut pour la formation initiale : les formations en temps aménagé, le soir et le week-end, relèvent d'un autre régime, payant. Montant retenu : 0 DH en licence, en master et en doctorat.",
        "licence": {
          "montant": 0,
          "devise": "MAD",
          "periode": "an"
        },
        "master": {
          "montant": 0,
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
        "politique": "systematique",
        "detail": "La place est gratuite pour tout étudiant admis par la voie diplomatique : le ministère parle de « places pédagogiques à titre gracieux ». Ce qui est limité, c'est la bourse de subsistance de l'AMCI, attribuée par quotas avec votre pays (l'AMCI indique que 85 % de ses étudiants africains sont boursiers), et le logement en cité, selon les places. Demandez la bourse avec votre dossier, auprès de l'autorité de votre pays ou de l'ambassade du Maroc.",
        "source": "https://www.enssup.gov.ma/en/la-mobilite-etudiante",
        "verifieLe": "2026-09-24"
      }
    },
    "motif": "frais de scolarité : place gratuite pour l'étudiant étranger admis par l'AMCI (enssup.gov.ma « places pédagogiques à titre gracieux » ; loi-cadre 51-17, art. 45), relu le 2026-09-24"
  },
  {
    "collection": "universities",
    "id": "universite-mohammed-premier-oujda",
    "attendu": {
      "fraisScolarite": undefined,
      "exoneration": {
        "politique": "possible_plafonnee",
        "verifieLe": "2026-09-24",
        "detail": "Selon l'université, l'AMCI accorde les bourses d'études aux étudiants étrangers, et le logement en cité universitaire est attribué à la demande de l'AMCI, dans la limite des places. Le ministère cite, parmi les services offerts aux étudiants internationaux, des « places pédagogiques à titre gracieux », une assurance médicale et un logement selon les places. La demande se fait avec le dossier, auprès de l'autorité de votre pays ou de l'ambassade du Maroc.",
        "source": "https://web.archive.org/web/20260208052808/https://www.ump.ma/fr/vie-universitaire/etudiants-etrangers"
      }
    },
    "champs": {
      "fraisScolarite": {
        "source": "https://www.enssup.gov.ma/en/la-mobilite-etudiante",
        "verifieLe": "2026-09-24",
        "note": "Université publique. Pour un étudiant étranger admis par la voie diplomatique (AMCI), la place est gratuite : le ministère de l'Enseignement supérieur cite, parmi les services offerts aux étudiants internationaux, des « places pédagogiques à titre gracieux », et la loi-cadre 51-17 de 2019 garantit, à son article 45, la gratuité de l'enseignement public dans tous ses cycles. L'université ne publie aucun tarif pour les étrangers. D'éventuels droits d'inscription ne sont publiés nulle part : demandez-en le montant à l'établissement à votre arrivée. Restent à votre charge le logement et la vie courante, sauf si vous obtenez la bourse de subsistance de l'AMCI ; la cité universitaire s'obtient par l'AMCI, selon les places. Ce montant vaut pour la formation initiale : les formations en temps aménagé, le soir et le week-end, relèvent d'un autre régime, payant. Montant retenu : 0 DH en licence, en master et en doctorat.",
        "licence": {
          "montant": 0,
          "devise": "MAD",
          "periode": "an"
        },
        "master": {
          "montant": 0,
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
        "politique": "systematique",
        "detail": "La place est gratuite pour tout étudiant admis par la voie diplomatique : le ministère parle de « places pédagogiques à titre gracieux ». Ce qui est limité, c'est la bourse de subsistance de l'AMCI, attribuée par quotas avec votre pays (l'AMCI indique que 85 % de ses étudiants africains sont boursiers), et le logement en cité, selon les places. Demandez la bourse avec votre dossier, auprès de l'autorité de votre pays ou de l'ambassade du Maroc.",
        "source": "https://www.enssup.gov.ma/en/la-mobilite-etudiante",
        "verifieLe": "2026-09-24"
      }
    },
    "motif": "frais de scolarité : place gratuite pour l'étudiant étranger admis par l'AMCI (enssup.gov.ma « places pédagogiques à titre gracieux » ; loi-cadre 51-17, art. 45), relu le 2026-09-24"
  },
  {
    "collection": "universities",
    "id": "universite-mohammed-v-rabat",
    "attendu": {
      "fraisScolarite": undefined,
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Candidatez par la voie diplomatique : auprès de l'ambassade du Maroc ou de l'autorité nationale de votre pays, jamais directement à l'université. Les délais sont communiqués chaque année aux ambassades. L'AMCI sélectionne selon des quotas et des critères fixés avec les pays bénéficiaires, puis transmet au ministère de l'Enseignement supérieur. Vous vous inscrivez ensuite avec une autorisation d'inscription électronique.",
        "source": "https://www.um5.ac.ma/um5/inscription-des-etudiants-internationaux",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "fraisScolarite": {
        "source": "https://www.enssup.gov.ma/en/la-mobilite-etudiante",
        "verifieLe": "2026-09-24",
        "note": "Université publique. Pour un étudiant étranger admis par la voie diplomatique (AMCI), la place est gratuite : le ministère de l'Enseignement supérieur cite, parmi les services offerts aux étudiants internationaux, des « places pédagogiques à titre gracieux », et la loi-cadre 51-17 de 2019 garantit, à son article 45, la gratuité de l'enseignement public dans tous ses cycles. L'université ne publie aucun tarif pour les étrangers. D'éventuels droits d'inscription ne sont publiés nulle part : demandez-en le montant à l'établissement à votre arrivée. Restent à votre charge le logement et la vie courante, sauf si vous obtenez la bourse de subsistance de l'AMCI ; la cité universitaire s'obtient par l'AMCI, selon les places. Ce montant vaut pour la formation initiale : les formations en temps aménagé, le soir et le week-end, relèvent d'un autre régime, payant. Montant retenu : 0 DH en licence, en master et en doctorat.",
        "licence": {
          "montant": 0,
          "devise": "MAD",
          "periode": "an"
        },
        "master": {
          "montant": 0,
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
        "politique": "systematique",
        "detail": "La place est gratuite pour tout étudiant admis par la voie diplomatique : le ministère parle de « places pédagogiques à titre gracieux ». Ce qui est limité, c'est la bourse de subsistance de l'AMCI, attribuée par quotas avec votre pays (l'AMCI indique que 85 % de ses étudiants africains sont boursiers), et le logement en cité, selon les places. Demandez la bourse avec votre dossier, auprès de l'autorité de votre pays ou de l'ambassade du Maroc.",
        "source": "https://www.enssup.gov.ma/en/la-mobilite-etudiante",
        "verifieLe": "2026-09-24"
      }
    },
    "motif": "frais de scolarité : place gratuite pour l'étudiant étranger admis par l'AMCI (enssup.gov.ma « places pédagogiques à titre gracieux » ; loi-cadre 51-17, art. 45), relu le 2026-09-24"
  },
  {
    "collection": "universities",
    "id": "universite-moulay-ismail-meknes",
    "attendu": {
      "fraisScolarite": undefined,
      "exoneration": {
        "politique": "possible_plafonnee",
        "verifieLe": "2026-09-24",
        "detail": "L'AMCI accorde des bourses du Royaume du Maroc aux étudiants étrangers, dans le cadre des accords de coopération avec leur pays, et indique que 85 % de ses étudiants africains sont boursiers. La demande de bourse se fait avec le dossier déposé par la voie diplomatique, pas auprès de l'université. Aucune exonération propre à l'université n'est publiée.",
        "source": "https://www.amci.ma/cooperation-academique"
      }
    },
    "champs": {
      "fraisScolarite": {
        "source": "https://www.enssup.gov.ma/en/la-mobilite-etudiante",
        "verifieLe": "2026-09-24",
        "note": "Université publique. Pour un étudiant étranger admis par la voie diplomatique (AMCI), la place est gratuite : le ministère de l'Enseignement supérieur cite, parmi les services offerts aux étudiants internationaux, des « places pédagogiques à titre gracieux », et la loi-cadre 51-17 de 2019 garantit, à son article 45, la gratuité de l'enseignement public dans tous ses cycles. L'université ne publie aucun tarif pour les étrangers. D'éventuels droits d'inscription ne sont publiés nulle part : demandez-en le montant à l'établissement à votre arrivée. Restent à votre charge le logement et la vie courante, sauf si vous obtenez la bourse de subsistance de l'AMCI ; la cité universitaire s'obtient par l'AMCI, selon les places. Ce montant vaut pour la formation initiale : les formations en temps aménagé, le soir et le week-end, relèvent d'un autre régime, payant. Montant retenu : 0 DH en licence, en master et en doctorat.",
        "licence": {
          "montant": 0,
          "devise": "MAD",
          "periode": "an"
        },
        "master": {
          "montant": 0,
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
        "politique": "systematique",
        "detail": "La place est gratuite pour tout étudiant admis par la voie diplomatique : le ministère parle de « places pédagogiques à titre gracieux ». Ce qui est limité, c'est la bourse de subsistance de l'AMCI, attribuée par quotas avec votre pays (l'AMCI indique que 85 % de ses étudiants africains sont boursiers), et le logement en cité, selon les places. Demandez la bourse avec votre dossier, auprès de l'autorité de votre pays ou de l'ambassade du Maroc.",
        "source": "https://www.enssup.gov.ma/en/la-mobilite-etudiante",
        "verifieLe": "2026-09-24"
      }
    },
    "motif": "frais de scolarité : place gratuite pour l'étudiant étranger admis par l'AMCI (enssup.gov.ma « places pédagogiques à titre gracieux » ; loi-cadre 51-17, art. 45), relu le 2026-09-24"
  },
  {
    "collection": "universities",
    "id": "universite-sidi-mohamed-ben-abdellah-fes",
    "attendu": {
      "fraisScolarite": undefined,
      "exoneration": {
        "politique": "possible_plafonnee",
        "verifieLe": "2026-09-24",
        "detail": "Les bourses des étudiants étrangers passent par l'AMCI, selon des quotas et les places disponibles. Le ministère cite, parmi les services offerts aux étudiants internationaux, des « places pédagogiques à titre gracieux », une assurance médicale et un logement selon les places. À l'USMBA, un étudiant étranger admis a les mêmes avantages qu'un étudiant marocain, comme les prix d'excellence. La demande se fait avec le dossier, auprès de l'autorité de votre pays ou de l'ambassade du Maroc.",
        "source": "https://www.enssup.gov.ma/en/la-mobilite-etudiante"
      }
    },
    "champs": {
      "fraisScolarite": {
        "source": "https://www.enssup.gov.ma/en/la-mobilite-etudiante",
        "verifieLe": "2026-09-24",
        "note": "Université publique. Pour un étudiant étranger admis par la voie diplomatique (AMCI), la place est gratuite : le ministère de l'Enseignement supérieur cite, parmi les services offerts aux étudiants internationaux, des « places pédagogiques à titre gracieux », et la loi-cadre 51-17 de 2019 garantit, à son article 45, la gratuité de l'enseignement public dans tous ses cycles. L'université ne publie aucun tarif pour les étrangers. D'éventuels droits d'inscription ne sont publiés nulle part : demandez-en le montant à l'établissement à votre arrivée. Restent à votre charge le logement et la vie courante, sauf si vous obtenez la bourse de subsistance de l'AMCI ; la cité universitaire s'obtient par l'AMCI, selon les places. Ce montant vaut pour la formation initiale : les formations en temps aménagé, le soir et le week-end, relèvent d'un autre régime, payant. Montant retenu : 0 DH en licence, en master et en doctorat.",
        "licence": {
          "montant": 0,
          "devise": "MAD",
          "periode": "an"
        },
        "master": {
          "montant": 0,
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
        "politique": "systematique",
        "detail": "La place est gratuite pour tout étudiant admis par la voie diplomatique : le ministère parle de « places pédagogiques à titre gracieux ». Ce qui est limité, c'est la bourse de subsistance de l'AMCI, attribuée par quotas avec votre pays (l'AMCI indique que 85 % de ses étudiants africains sont boursiers), et le logement en cité, selon les places. Demandez la bourse avec votre dossier, auprès de l'autorité de votre pays ou de l'ambassade du Maroc.",
        "source": "https://www.enssup.gov.ma/en/la-mobilite-etudiante",
        "verifieLe": "2026-09-24"
      }
    },
    "motif": "frais de scolarité : place gratuite pour l'étudiant étranger admis par l'AMCI (enssup.gov.ma « places pédagogiques à titre gracieux » ; loi-cadre 51-17, art. 45), relu le 2026-09-24"
  },
  {
    "collection": "universities",
    "id": "universite-sultan-moulay-slimane-beni-mellal",
    "attendu": {
      "fraisScolarite": undefined,
      "exoneration": {
        "politique": "possible_plafonnee",
        "verifieLe": "2026-09-24",
        "detail": "L'AMCI accorde des bourses du Royaume du Maroc aux étudiants étrangers, dans le cadre des accords de coopération avec leur pays, et indique que 85 % de ses étudiants africains sont boursiers. La demande de bourse se fait avec le dossier déposé par la voie diplomatique, pas auprès de l'université. Aucune exonération propre à l'université n'est publiée.",
        "source": "https://www.amci.ma/cooperation-academique"
      }
    },
    "champs": {
      "fraisScolarite": {
        "source": "https://www.enssup.gov.ma/en/la-mobilite-etudiante",
        "verifieLe": "2026-09-24",
        "note": "Université publique. Pour un étudiant étranger admis par la voie diplomatique (AMCI), la place est gratuite : le ministère de l'Enseignement supérieur cite, parmi les services offerts aux étudiants internationaux, des « places pédagogiques à titre gracieux », et la loi-cadre 51-17 de 2019 garantit, à son article 45, la gratuité de l'enseignement public dans tous ses cycles. L'université ne publie aucun tarif pour les étrangers. D'éventuels droits d'inscription ne sont publiés nulle part : demandez-en le montant à l'établissement à votre arrivée. Restent à votre charge le logement et la vie courante, sauf si vous obtenez la bourse de subsistance de l'AMCI ; la cité universitaire s'obtient par l'AMCI, selon les places. Ce montant vaut pour la formation initiale : les formations en temps aménagé, le soir et le week-end, relèvent d'un autre régime, payant. Montant retenu : 0 DH en licence, en master et en doctorat.",
        "licence": {
          "montant": 0,
          "devise": "MAD",
          "periode": "an"
        },
        "master": {
          "montant": 0,
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
        "politique": "systematique",
        "detail": "La place est gratuite pour tout étudiant admis par la voie diplomatique : le ministère parle de « places pédagogiques à titre gracieux ». Ce qui est limité, c'est la bourse de subsistance de l'AMCI, attribuée par quotas avec votre pays (l'AMCI indique que 85 % de ses étudiants africains sont boursiers), et le logement en cité, selon les places. Demandez la bourse avec votre dossier, auprès de l'autorité de votre pays ou de l'ambassade du Maroc.",
        "source": "https://www.enssup.gov.ma/en/la-mobilite-etudiante",
        "verifieLe": "2026-09-24"
      }
    },
    "motif": "frais de scolarité : place gratuite pour l'étudiant étranger admis par l'AMCI (enssup.gov.ma « places pédagogiques à titre gracieux » ; loi-cadre 51-17, art. 45), relu le 2026-09-24"
  }
];
