// ============================================================
// FitzUniverse — Lot 83 : la source du ministère marocain, lisible
// d'Afrique de l'Ouest (2026-09-24)
//
// POURQUOI
// Le lot 82 cite la page « La mobilité étudiante » du ministère
// marocain de l'Enseignement supérieur (enssup.gov.ma) comme preuve de
// la gratuité. Le 24 septembre au soir, Charles a cliqué « Source »
// depuis Dakar : ERR_CONNECTION_TIMED_OUT. Le navigateur intégré (même
// réseau) échoue aussi ; seul un serveur hors d'Afrique l'avait lue.
// Une source que l'étudiant ne peut pas ouvrir ne prouve rien pour lui.
//
// LE REMÈDE
// La copie de la même page conservée par Internet Archive le
// 17 mars 2025 :
//   https://web.archive.org/web/20250317151356/https://www.enssup.gov.ma/en/la-mobilite-etudiante
// Relue au navigateur depuis Dakar le 2026-09-24 : on y lit, mot pour
// mot, « Places pédagogiques à titre gracieux », « Perception d'une
// bourse de subsistance », « Logement universitaire, en fonction des
// capacités d'accueil des cités universitaires », « Assurance
// médicale ». Même méthode que l'Université Mohammed Premier (lot 76),
// dont le site ne répondait pas non plus.
//
// CE QUI CHANGE
// Uniquement l'adresse : dans fraisScolarite.source, exoneration.source
// et, quand elle y figure, la liste admission.sources. Textes, montants
// et dates inchangés. `attendu` porte chaque objet COMPLET tel qu'en
// base après le lot 82.
// ============================================================

export const PATCHES = [
  {
    "collection": "universities",
    "id": "institut-agronomique-veterinaire-hassan-ii-rabat",
    "attendu": {
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
    "champs": {
      "fraisScolarite": {
        "source": "https://web.archive.org/web/20250317151356/https://www.enssup.gov.ma/en/la-mobilite-etudiante",
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
        "source": "https://web.archive.org/web/20250317151356/https://www.enssup.gov.ma/en/la-mobilite-etudiante",
        "verifieLe": "2026-09-24"
      }
    },
    "motif": "source du ministère marocain remplacée par sa copie archivée (enssup.gov.ma injoignable depuis le Sénégal le 2026-09-24 ; citation relue sur l'archive du 17-03-2025)"
  },
  {
    "collection": "universities",
    "id": "universite-abdelmalek-essaadi-tetouan",
    "attendu": {
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
      },
      "admission": {
        "fraisDossier": "Aucun frais de dossier n'est publié par l'université.",
        "sources": [
          "https://www.uae.ac.ma/bureau-des-relations-internationales",
          "https://www.uae.ac.ma/etablissements",
          "https://www.uae.ac.ma/histoire",
          "https://www.amci.ma/sites/default/files/2025-07/repertoire-des-etablissements-2025-2026.pdf",
          "https://www.enssup.gov.ma/en/la-mobilite-etudiante",
          "https://www.amci.ma/cooperation-academique"
        ],
        "verifieLe": "2026-09-24",
        "langue": "Aucun test de langue n'est cité. Selon l'AMCI, le français est la langue véhiculaire des établissements publics d'enseignement supérieur marocains, et son centre de langue propose aux étudiants non francophones une mise à niveau encadrée, validée par une attestation en fin d'année. La langue peut varier d'une filière à l'autre : vérifiez celle de la filière que vous visez.",
        "procedure": "L'université ne décrit pas en ligne la candidature des étrangers. Comme pour les autres universités publiques, elle passe par la voie diplomatique : le dossier se dépose auprès de l'autorité de votre pays ou de l'ambassade du Maroc, puis l'AMCI le transmet au ministère. Son Bureau des étudiants internationaux a été créé avec la direction du ministère qui délivre les autorisations d'inscription. L'université accueillait 1 671 étudiants internationaux de 67 nationalités en 2023-2024.",
        "conditions": "Dans les villes de l'université, le répertoire AMCI 2025-2026 cite notamment la faculté des lettres et la faculté Ossoul Addine à Tétouan ; la Faculté de médecine et de pharmacie, la faculté de droit et d'économie, la faculté des lettres, l'ENCG, l'École supérieure Roi Fahd de traduction et la faculté des sciences et techniques à Tanger ; la faculté des sciences et techniques à Al Hoceïma."
      }
    },
    "champs": {
      "fraisScolarite": {
        "source": "https://web.archive.org/web/20250317151356/https://www.enssup.gov.ma/en/la-mobilite-etudiante",
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
        "source": "https://web.archive.org/web/20250317151356/https://www.enssup.gov.ma/en/la-mobilite-etudiante",
        "verifieLe": "2026-09-24"
      },
      "admission": {
        "fraisDossier": "Aucun frais de dossier n'est publié par l'université.",
        "sources": [
          "https://www.uae.ac.ma/bureau-des-relations-internationales",
          "https://www.uae.ac.ma/etablissements",
          "https://www.uae.ac.ma/histoire",
          "https://www.amci.ma/sites/default/files/2025-07/repertoire-des-etablissements-2025-2026.pdf",
          "https://web.archive.org/web/20250317151356/https://www.enssup.gov.ma/en/la-mobilite-etudiante",
          "https://www.amci.ma/cooperation-academique"
        ],
        "verifieLe": "2026-09-24",
        "langue": "Aucun test de langue n'est cité. Selon l'AMCI, le français est la langue véhiculaire des établissements publics d'enseignement supérieur marocains, et son centre de langue propose aux étudiants non francophones une mise à niveau encadrée, validée par une attestation en fin d'année. La langue peut varier d'une filière à l'autre : vérifiez celle de la filière que vous visez.",
        "procedure": "L'université ne décrit pas en ligne la candidature des étrangers. Comme pour les autres universités publiques, elle passe par la voie diplomatique : le dossier se dépose auprès de l'autorité de votre pays ou de l'ambassade du Maroc, puis l'AMCI le transmet au ministère. Son Bureau des étudiants internationaux a été créé avec la direction du ministère qui délivre les autorisations d'inscription. L'université accueillait 1 671 étudiants internationaux de 67 nationalités en 2023-2024.",
        "conditions": "Dans les villes de l'université, le répertoire AMCI 2025-2026 cite notamment la faculté des lettres et la faculté Ossoul Addine à Tétouan ; la Faculté de médecine et de pharmacie, la faculté de droit et d'économie, la faculté des lettres, l'ENCG, l'École supérieure Roi Fahd de traduction et la faculté des sciences et techniques à Tanger ; la faculté des sciences et techniques à Al Hoceïma."
      }
    },
    "motif": "source du ministère marocain remplacée par sa copie archivée (enssup.gov.ma injoignable depuis le Sénégal le 2026-09-24 ; citation relue sur l'archive du 17-03-2025)"
  },
  {
    "collection": "universities",
    "id": "universite-cadi-ayyad-marrakech",
    "attendu": {
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
    "champs": {
      "fraisScolarite": {
        "source": "https://web.archive.org/web/20250317151356/https://www.enssup.gov.ma/en/la-mobilite-etudiante",
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
        "source": "https://web.archive.org/web/20250317151356/https://www.enssup.gov.ma/en/la-mobilite-etudiante",
        "verifieLe": "2026-09-24"
      }
    },
    "motif": "source du ministère marocain remplacée par sa copie archivée (enssup.gov.ma injoignable depuis le Sénégal le 2026-09-24 ; citation relue sur l'archive du 17-03-2025)"
  },
  {
    "collection": "universities",
    "id": "universite-chouaib-doukkali-el-jadida",
    "attendu": {
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
    "champs": {
      "fraisScolarite": {
        "source": "https://web.archive.org/web/20250317151356/https://www.enssup.gov.ma/en/la-mobilite-etudiante",
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
        "source": "https://web.archive.org/web/20250317151356/https://www.enssup.gov.ma/en/la-mobilite-etudiante",
        "verifieLe": "2026-09-24"
      }
    },
    "motif": "source du ministère marocain remplacée par sa copie archivée (enssup.gov.ma injoignable depuis le Sénégal le 2026-09-24 ; citation relue sur l'archive du 17-03-2025)"
  },
  {
    "collection": "universities",
    "id": "universite-hassan-ii-casablanca",
    "attendu": {
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
    "champs": {
      "fraisScolarite": {
        "source": "https://web.archive.org/web/20250317151356/https://www.enssup.gov.ma/en/la-mobilite-etudiante",
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
        "source": "https://web.archive.org/web/20250317151356/https://www.enssup.gov.ma/en/la-mobilite-etudiante",
        "verifieLe": "2026-09-24"
      }
    },
    "motif": "source du ministère marocain remplacée par sa copie archivée (enssup.gov.ma injoignable depuis le Sénégal le 2026-09-24 ; citation relue sur l'archive du 17-03-2025)"
  },
  {
    "collection": "universities",
    "id": "universite-hassan-premier-settat",
    "attendu": {
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
    "champs": {
      "fraisScolarite": {
        "source": "https://web.archive.org/web/20250317151356/https://www.enssup.gov.ma/en/la-mobilite-etudiante",
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
        "source": "https://web.archive.org/web/20250317151356/https://www.enssup.gov.ma/en/la-mobilite-etudiante",
        "verifieLe": "2026-09-24"
      }
    },
    "motif": "source du ministère marocain remplacée par sa copie archivée (enssup.gov.ma injoignable depuis le Sénégal le 2026-09-24 ; citation relue sur l'archive du 17-03-2025)"
  },
  {
    "collection": "universities",
    "id": "universite-ibn-tofail-kenitra",
    "attendu": {
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
      },
      "admission": {
        "fraisDossier": "Aucun frais de dossier n'est publié par l'université.",
        "sources": [
          "https://iro.uit.ac.ma/mobilite-etudiants-uit/",
          "https://www.uit.ac.ma/bourses/",
          "https://www.uit.ac.ma/",
          "https://www.amci.ma/sites/default/files/2025-07/repertoire-des-etablissements-2025-2026.pdf",
          "https://www.enssup.gov.ma/en/la-mobilite-etudiante",
          "https://www.amci.ma/cooperation-academique"
        ],
        "calendrier": "Les préinscriptions en licence 2026-2027 sur le site de l'université sont closes : le calendrier est celui de l'été. Suivez celui de l'ambassade ou de l'autorité de votre pays.",
        "verifieLe": "2026-09-24",
        "langue": "Aucun test de langue n'est cité. Selon l'université, les cours se donnent en arabe, en français et en anglais.",
        "procedure": "L'université ne publie pas de procédure pour les candidats étrangers hors échange : son lien « Comment candidater à l'Université hors échange » ne mène à aucune page. La règle nationale s'applique donc : le dossier se dépose auprès de l'autorité de votre pays ou de l'ambassade du Maroc, l'AMCI le transmet au ministère, qui délivre l'autorisation d'inscription.",
        "conditions": "Le répertoire AMCI 2025-2026 cite à Kénitra la faculté des sciences juridiques et politiques, la faculté des langues, des arts et des lettres, la faculté des sciences humaines et sociales, l'ENCG et l'EST."
      }
    },
    "champs": {
      "fraisScolarite": {
        "source": "https://web.archive.org/web/20250317151356/https://www.enssup.gov.ma/en/la-mobilite-etudiante",
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
        "source": "https://web.archive.org/web/20250317151356/https://www.enssup.gov.ma/en/la-mobilite-etudiante",
        "verifieLe": "2026-09-24"
      },
      "admission": {
        "fraisDossier": "Aucun frais de dossier n'est publié par l'université.",
        "sources": [
          "https://iro.uit.ac.ma/mobilite-etudiants-uit/",
          "https://www.uit.ac.ma/bourses/",
          "https://www.uit.ac.ma/",
          "https://www.amci.ma/sites/default/files/2025-07/repertoire-des-etablissements-2025-2026.pdf",
          "https://web.archive.org/web/20250317151356/https://www.enssup.gov.ma/en/la-mobilite-etudiante",
          "https://www.amci.ma/cooperation-academique"
        ],
        "calendrier": "Les préinscriptions en licence 2026-2027 sur le site de l'université sont closes : le calendrier est celui de l'été. Suivez celui de l'ambassade ou de l'autorité de votre pays.",
        "verifieLe": "2026-09-24",
        "langue": "Aucun test de langue n'est cité. Selon l'université, les cours se donnent en arabe, en français et en anglais.",
        "procedure": "L'université ne publie pas de procédure pour les candidats étrangers hors échange : son lien « Comment candidater à l'Université hors échange » ne mène à aucune page. La règle nationale s'applique donc : le dossier se dépose auprès de l'autorité de votre pays ou de l'ambassade du Maroc, l'AMCI le transmet au ministère, qui délivre l'autorisation d'inscription.",
        "conditions": "Le répertoire AMCI 2025-2026 cite à Kénitra la faculté des sciences juridiques et politiques, la faculté des langues, des arts et des lettres, la faculté des sciences humaines et sociales, l'ENCG et l'EST."
      }
    },
    "motif": "source du ministère marocain remplacée par sa copie archivée (enssup.gov.ma injoignable depuis le Sénégal le 2026-09-24 ; citation relue sur l'archive du 17-03-2025)"
  },
  {
    "collection": "universities",
    "id": "universite-ibn-zohr-agadir",
    "attendu": {
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
      },
      "admission": {
        "fraisDossier": "Aucun frais de dossier n'est publié par l'université.",
        "sources": [
          "https://www.uiz.ac.ma/logement-et-restauration",
          "https://preinscription.uiz.ac.ma/",
          "https://www.uiz.ac.ma/nos-etablissements",
          "https://www.uiz.ac.ma/mot-du-president",
          "https://www.amci.ma/sites/default/files/2025-07/repertoire-des-etablissements-2025-2026.pdf",
          "https://www.enssup.gov.ma/en/la-mobilite-etudiante",
          "https://www.amci.ma/cooperation-academique"
        ],
        "calendrier": "Les préinscriptions 2026-2027 sur la plateforme de l'université étaient ouvertes en août et en septembre, sans profil pour un étudiant étranger. Votre calendrier est celui de l'ambassade ou de l'autorité de votre pays.",
        "verifieLe": "2026-09-24",
        "langue": "Aucun test de langue n'est cité. Selon l'AMCI, le français est la langue véhiculaire des établissements publics d'enseignement supérieur marocains, et son centre de langue propose aux étudiants non francophones une mise à niveau encadrée, validée par une attestation en fin d'année. La langue peut varier d'une filière à l'autre : vérifiez celle de la filière que vous visez.",
        "procedure": "L'université ne publie pas de procédure pour les étrangers, et sa plateforme de préinscription n'a pas de profil pour un étudiant étranger. La règle nationale s'applique : le dossier se dépose auprès de l'autorité de votre pays ou de l'ambassade du Maroc, l'AMCI le transmet au ministère, qui délivre l'autorisation d'inscription.",
        "conditions": "Le répertoire AMCI 2025-2026 cite à Agadir la Faculté de médecine et de pharmacie, la Faculté des sciences, la faculté de droit et d'économie, la faculté des lettres, la faculté des langues, des arts et des lettres, l'ENCG et l'EST."
      }
    },
    "champs": {
      "fraisScolarite": {
        "source": "https://web.archive.org/web/20250317151356/https://www.enssup.gov.ma/en/la-mobilite-etudiante",
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
        "source": "https://web.archive.org/web/20250317151356/https://www.enssup.gov.ma/en/la-mobilite-etudiante",
        "verifieLe": "2026-09-24"
      },
      "admission": {
        "fraisDossier": "Aucun frais de dossier n'est publié par l'université.",
        "sources": [
          "https://www.uiz.ac.ma/logement-et-restauration",
          "https://preinscription.uiz.ac.ma/",
          "https://www.uiz.ac.ma/nos-etablissements",
          "https://www.uiz.ac.ma/mot-du-president",
          "https://www.amci.ma/sites/default/files/2025-07/repertoire-des-etablissements-2025-2026.pdf",
          "https://web.archive.org/web/20250317151356/https://www.enssup.gov.ma/en/la-mobilite-etudiante",
          "https://www.amci.ma/cooperation-academique"
        ],
        "calendrier": "Les préinscriptions 2026-2027 sur la plateforme de l'université étaient ouvertes en août et en septembre, sans profil pour un étudiant étranger. Votre calendrier est celui de l'ambassade ou de l'autorité de votre pays.",
        "verifieLe": "2026-09-24",
        "langue": "Aucun test de langue n'est cité. Selon l'AMCI, le français est la langue véhiculaire des établissements publics d'enseignement supérieur marocains, et son centre de langue propose aux étudiants non francophones une mise à niveau encadrée, validée par une attestation en fin d'année. La langue peut varier d'une filière à l'autre : vérifiez celle de la filière que vous visez.",
        "procedure": "L'université ne publie pas de procédure pour les étrangers, et sa plateforme de préinscription n'a pas de profil pour un étudiant étranger. La règle nationale s'applique : le dossier se dépose auprès de l'autorité de votre pays ou de l'ambassade du Maroc, l'AMCI le transmet au ministère, qui délivre l'autorisation d'inscription.",
        "conditions": "Le répertoire AMCI 2025-2026 cite à Agadir la Faculté de médecine et de pharmacie, la Faculté des sciences, la faculté de droit et d'économie, la faculté des lettres, la faculté des langues, des arts et des lettres, l'ENCG et l'EST."
      }
    },
    "motif": "source du ministère marocain remplacée par sa copie archivée (enssup.gov.ma injoignable depuis le Sénégal le 2026-09-24 ; citation relue sur l'archive du 17-03-2025)"
  },
  {
    "collection": "universities",
    "id": "universite-mohammed-premier-oujda",
    "attendu": {
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
      },
      "admission": {
        "fraisDossier": "Aucun frais de dossier n'est publié par l'université.",
        "sources": [
          "https://web.archive.org/web/20260208052808/https://www.ump.ma/fr/vie-universitaire/etudiants-etrangers",
          "https://web.archive.org/web/20260420193602/https://www.ump.ma/fr/luniversite/etablissements-de-lump-22",
          "https://web.archive.org/web/20260420193548/https://www.ump.ma/fr/luniversite",
          "https://www.amci.ma/sites/default/files/2025-07/repertoire-des-etablissements-2025-2026.pdf",
          "https://www.enssup.gov.ma/en/la-mobilite-etudiante",
          "https://www.amci.ma/cooperation-academique"
        ],
        "verifieLe": "2026-09-24",
        "langue": "Aucun test de langue n'est cité. Selon l'AMCI, le français est la langue véhiculaire des établissements publics d'enseignement supérieur marocains, et son centre de langue propose aux étudiants non francophones une mise à niveau encadrée, validée par une attestation en fin d'année. La langue peut varier d'une filière à l'autre : vérifiez celle de la filière que vous visez.",
        "procedure": "Candidature par la voie diplomatique, dans le cadre de la coopération entre le Maroc et votre pays : l'AMCI transmet le dossier au ministère, qui délivre l'autorisation d'inscription. Un dossier que l'AMCI n'a pas transmis n'est pas étudié. Sur place, un bureau du CIOVE accueille et aide les étudiants étrangers.",
        "conditions": "En licence, il faut le baccalauréat de l'année. Pour les écoles à accès régulé, il faut au moins la mention assez bien, et avoir moins de 20 ans pour l'ENSA, moins de 21 ans pour l'ENCG et moins de 22 ans pour l'EST. En master, il faut un diplôme de niveau bac+4 au moins ; en doctorat, un master ou un diplôme équivalent, avec l'avis favorable de l'établissement. Le répertoire AMCI 2025-2026 cite à Oujda la Faculté de médecine et de pharmacie, la Faculté des sciences, la faculté de droit et d'économie, la faculté des lettres, l'ENCG et l'EST."
      }
    },
    "champs": {
      "fraisScolarite": {
        "source": "https://web.archive.org/web/20250317151356/https://www.enssup.gov.ma/en/la-mobilite-etudiante",
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
        "source": "https://web.archive.org/web/20250317151356/https://www.enssup.gov.ma/en/la-mobilite-etudiante",
        "verifieLe": "2026-09-24"
      },
      "admission": {
        "fraisDossier": "Aucun frais de dossier n'est publié par l'université.",
        "sources": [
          "https://web.archive.org/web/20260208052808/https://www.ump.ma/fr/vie-universitaire/etudiants-etrangers",
          "https://web.archive.org/web/20260420193602/https://www.ump.ma/fr/luniversite/etablissements-de-lump-22",
          "https://web.archive.org/web/20260420193548/https://www.ump.ma/fr/luniversite",
          "https://www.amci.ma/sites/default/files/2025-07/repertoire-des-etablissements-2025-2026.pdf",
          "https://web.archive.org/web/20250317151356/https://www.enssup.gov.ma/en/la-mobilite-etudiante",
          "https://www.amci.ma/cooperation-academique"
        ],
        "verifieLe": "2026-09-24",
        "langue": "Aucun test de langue n'est cité. Selon l'AMCI, le français est la langue véhiculaire des établissements publics d'enseignement supérieur marocains, et son centre de langue propose aux étudiants non francophones une mise à niveau encadrée, validée par une attestation en fin d'année. La langue peut varier d'une filière à l'autre : vérifiez celle de la filière que vous visez.",
        "procedure": "Candidature par la voie diplomatique, dans le cadre de la coopération entre le Maroc et votre pays : l'AMCI transmet le dossier au ministère, qui délivre l'autorisation d'inscription. Un dossier que l'AMCI n'a pas transmis n'est pas étudié. Sur place, un bureau du CIOVE accueille et aide les étudiants étrangers.",
        "conditions": "En licence, il faut le baccalauréat de l'année. Pour les écoles à accès régulé, il faut au moins la mention assez bien, et avoir moins de 20 ans pour l'ENSA, moins de 21 ans pour l'ENCG et moins de 22 ans pour l'EST. En master, il faut un diplôme de niveau bac+4 au moins ; en doctorat, un master ou un diplôme équivalent, avec l'avis favorable de l'établissement. Le répertoire AMCI 2025-2026 cite à Oujda la Faculté de médecine et de pharmacie, la Faculté des sciences, la faculté de droit et d'économie, la faculté des lettres, l'ENCG et l'EST."
      }
    },
    "motif": "source du ministère marocain remplacée par sa copie archivée (enssup.gov.ma injoignable depuis le Sénégal le 2026-09-24 ; citation relue sur l'archive du 17-03-2025)"
  },
  {
    "collection": "universities",
    "id": "universite-mohammed-v-rabat",
    "attendu": {
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
    "champs": {
      "fraisScolarite": {
        "source": "https://web.archive.org/web/20250317151356/https://www.enssup.gov.ma/en/la-mobilite-etudiante",
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
        "source": "https://web.archive.org/web/20250317151356/https://www.enssup.gov.ma/en/la-mobilite-etudiante",
        "verifieLe": "2026-09-24"
      }
    },
    "motif": "source du ministère marocain remplacée par sa copie archivée (enssup.gov.ma injoignable depuis le Sénégal le 2026-09-24 ; citation relue sur l'archive du 17-03-2025)"
  },
  {
    "collection": "universities",
    "id": "universite-moulay-ismail-meknes",
    "attendu": {
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
    "champs": {
      "fraisScolarite": {
        "source": "https://web.archive.org/web/20250317151356/https://www.enssup.gov.ma/en/la-mobilite-etudiante",
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
        "source": "https://web.archive.org/web/20250317151356/https://www.enssup.gov.ma/en/la-mobilite-etudiante",
        "verifieLe": "2026-09-24"
      }
    },
    "motif": "source du ministère marocain remplacée par sa copie archivée (enssup.gov.ma injoignable depuis le Sénégal le 2026-09-24 ; citation relue sur l'archive du 17-03-2025)"
  },
  {
    "collection": "universities",
    "id": "universite-sidi-mohamed-ben-abdellah-fes",
    "attendu": {
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
      },
      "admission": {
        "fraisDossier": "Aucun frais de dossier n'est publié par l'université.",
        "sources": [
          "https://www.usmba.ac.ma/~usmba2/new/etudiants-etrangers/",
          "https://www.usmba.ac.ma/~usmba2/new/etudier-a-lusmba/",
          "https://admission.usmba.ac.ma/nouveau-etudiant",
          "https://admission.usmba.ac.ma/guide-d-inscription",
          "https://www.usmba.ac.ma/~usmba2/a-propos/nos-etablissements/",
          "https://www.amci.ma/sites/default/files/2025-07/repertoire-des-etablissements-2025-2026.pdf",
          "https://www.enssup.gov.ma/en/la-mobilite-etudiante",
          "https://www.amci.ma/cooperation-academique"
        ],
        "calendrier": "Pour 2026-2027, la préinscription sur admission.usmba.ac.ma était ouverte du 17 août au 12 septembre 2026. La date qui compte d'abord est celle de l'ambassade ou de l'autorité de votre pays.",
        "verifieLe": "2026-09-24",
        "langue": "Aucun test de langue n'est demandé, mais une preuve de maîtrise de la langue d'enseignement peut l'être. Selon l'AMCI, le français est la langue véhiculaire des établissements publics d'enseignement supérieur marocains, et son centre de langue propose aux étudiants non francophones une mise à niveau encadrée, validée par une attestation en fin d'année. La langue peut varier d'une filière à l'autre : vérifiez celle de la filière que vous visez.",
        "procedure": "Vous ne candidatez pas auprès de l'université. Le dossier se dépose auprès de l'autorité de votre pays ou de l'ambassade du Maroc, puis l'AMCI le transmet au ministère marocain de l'Enseignement supérieur : un dossier que l'AMCI n'a pas transmis n'est pas étudié. Une fois autorisé sur la plateforme e-Cooperation, vous finalisez votre inscription sur admission.usmba.ac.ma, avec le profil « baccalauréat non marocain ».",
        "conditions": "Le répertoire AMCI 2025-2026 cite à Fès la Faculté de médecine et de pharmacie, la Faculté des sciences, la faculté des sciences et techniques, la faculté de droit et d'économie, la faculté des lettres et l'EST."
      }
    },
    "champs": {
      "fraisScolarite": {
        "source": "https://web.archive.org/web/20250317151356/https://www.enssup.gov.ma/en/la-mobilite-etudiante",
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
        "source": "https://web.archive.org/web/20250317151356/https://www.enssup.gov.ma/en/la-mobilite-etudiante",
        "verifieLe": "2026-09-24"
      },
      "admission": {
        "fraisDossier": "Aucun frais de dossier n'est publié par l'université.",
        "sources": [
          "https://www.usmba.ac.ma/~usmba2/new/etudiants-etrangers/",
          "https://www.usmba.ac.ma/~usmba2/new/etudier-a-lusmba/",
          "https://admission.usmba.ac.ma/nouveau-etudiant",
          "https://admission.usmba.ac.ma/guide-d-inscription",
          "https://www.usmba.ac.ma/~usmba2/a-propos/nos-etablissements/",
          "https://www.amci.ma/sites/default/files/2025-07/repertoire-des-etablissements-2025-2026.pdf",
          "https://web.archive.org/web/20250317151356/https://www.enssup.gov.ma/en/la-mobilite-etudiante",
          "https://www.amci.ma/cooperation-academique"
        ],
        "calendrier": "Pour 2026-2027, la préinscription sur admission.usmba.ac.ma était ouverte du 17 août au 12 septembre 2026. La date qui compte d'abord est celle de l'ambassade ou de l'autorité de votre pays.",
        "verifieLe": "2026-09-24",
        "langue": "Aucun test de langue n'est demandé, mais une preuve de maîtrise de la langue d'enseignement peut l'être. Selon l'AMCI, le français est la langue véhiculaire des établissements publics d'enseignement supérieur marocains, et son centre de langue propose aux étudiants non francophones une mise à niveau encadrée, validée par une attestation en fin d'année. La langue peut varier d'une filière à l'autre : vérifiez celle de la filière que vous visez.",
        "procedure": "Vous ne candidatez pas auprès de l'université. Le dossier se dépose auprès de l'autorité de votre pays ou de l'ambassade du Maroc, puis l'AMCI le transmet au ministère marocain de l'Enseignement supérieur : un dossier que l'AMCI n'a pas transmis n'est pas étudié. Une fois autorisé sur la plateforme e-Cooperation, vous finalisez votre inscription sur admission.usmba.ac.ma, avec le profil « baccalauréat non marocain ».",
        "conditions": "Le répertoire AMCI 2025-2026 cite à Fès la Faculté de médecine et de pharmacie, la Faculté des sciences, la faculté des sciences et techniques, la faculté de droit et d'économie, la faculté des lettres et l'EST."
      }
    },
    "motif": "source du ministère marocain remplacée par sa copie archivée (enssup.gov.ma injoignable depuis le Sénégal le 2026-09-24 ; citation relue sur l'archive du 17-03-2025)"
  },
  {
    "collection": "universities",
    "id": "universite-sultan-moulay-slimane-beni-mellal",
    "attendu": {
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
    "champs": {
      "fraisScolarite": {
        "source": "https://web.archive.org/web/20250317151356/https://www.enssup.gov.ma/en/la-mobilite-etudiante",
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
        "source": "https://web.archive.org/web/20250317151356/https://www.enssup.gov.ma/en/la-mobilite-etudiante",
        "verifieLe": "2026-09-24"
      }
    },
    "motif": "source du ministère marocain remplacée par sa copie archivée (enssup.gov.ma injoignable depuis le Sénégal le 2026-09-24 ; citation relue sur l'archive du 17-03-2025)"
  }
];
