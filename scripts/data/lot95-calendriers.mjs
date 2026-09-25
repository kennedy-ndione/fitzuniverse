// ============================================================
// FitzUniverse — Lot 95 : le calendrier manquant de 8 fiches
// Export de référence : 2026-09-25T13:44:42.351Z
//
// POURQUOI
// Le test « chaque fiche guide » (test/fiche-guide.test.mjs), posé le
// 2026-09-25 à la demande de Charles, a trouvé 8 fiches des 9 pays de
// préinscription sans étape « calendrier » : 5 universités publiques
// marocaines (voie AMCI), l'UM6SS, et deux universités malaisiennes
// (IIUM, UUM). Aucune n'invente de date : quand l'université n'en
// publie pas (pages relues au navigateur le 2026-09-25), la fiche le
// dit et indique à qui la demander.
// ============================================================

export const PATCHES = [
  {
    "collection": "universities",
    "id": "universite-abdelmalek-essaadi-tetouan",
    "motif": "calendrier de la voie AMCI (date fixée par l'ambassade ou l'autorité du pays), signalé par le test « chaque fiche guide », le 2026-09-25",
    "attendu": {
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
    "champs": {
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
        "conditions": "Dans les villes de l'université, le répertoire AMCI 2025-2026 cite notamment la faculté des lettres et la faculté Ossoul Addine à Tétouan ; la Faculté de médecine et de pharmacie, la faculté de droit et d'économie, la faculté des lettres, l'ENCG, l'École supérieure Roi Fahd de traduction et la faculté des sciences et techniques à Tanger ; la faculté des sciences et techniques à Al Hoceïma.",
        "calendrier": "L'université ne publie pas de dates propres aux étudiants étrangers pour 2026-2027. La date qui compte d'abord est celle de l'ambassade ou de l'autorité de votre pays, qui transmet les dossiers à l'AMCI."
      }
    }
  },
  {
    "collection": "universities",
    "id": "universite-chouaib-doukkali-el-jadida",
    "motif": "calendrier de la voie AMCI (date fixée par l'ambassade ou l'autorité du pays), signalé par le test « chaque fiche guide », le 2026-09-25",
    "attendu": {
      "admission": {
        "fraisDossier": "Aucun frais de dossier n'est publié par l'université.",
        "sources": [
          "https://www.ucd.ac.ma/espace-etudiant/guide-de-letudiant/",
          "https://www.ucd.ac.ma/universite/presentation-de-lucd/",
          "https://www.ucd.ac.ma/universite/etablissements-de-lucd/",
          "https://www.amci.ma/sites/default/files/2025-07/repertoire-des-etablissements-2025-2026.pdf",
          "https://www.amci.ma/cooperation-academique"
        ],
        "verifieLe": "2026-09-24",
        "langue": "Aucun test de langue n'est cité. Selon l'AMCI, le français est la langue véhiculaire des établissements publics d'enseignement supérieur marocains, et son centre de langue propose aux étudiants non francophones une mise à niveau encadrée, validée par une attestation en fin d'année. La langue peut varier d'une filière à l'autre : vérifiez celle de la filière que vous visez.",
        "procedure": "Avec un baccalauréat étranger, vous devez présenter une autorisation d'inscription délivrée par la division de la coopération du ministère de l'Enseignement supérieur. Elle s'obtient par la voie diplomatique : ambassade ou autorité de votre pays, puis AMCI, qui transmet le dossier au ministère.",
        "conditions": "Le répertoire AMCI 2025-2026 cite à El Jadida la Faculté des sciences, la faculté de droit et d'économie, la faculté des lettres et l'ENCG, ainsi que l'EST de Sidi Bennour. Pour la Faculté des sciences, il demandait un bac C ou D de l'année avec mention, 12 sur 20 dans les matières de base et 23 ans au plus au 31 décembre."
      }
    },
    "champs": {
      "admission": {
        "fraisDossier": "Aucun frais de dossier n'est publié par l'université.",
        "sources": [
          "https://www.ucd.ac.ma/espace-etudiant/guide-de-letudiant/",
          "https://www.ucd.ac.ma/universite/presentation-de-lucd/",
          "https://www.ucd.ac.ma/universite/etablissements-de-lucd/",
          "https://www.amci.ma/sites/default/files/2025-07/repertoire-des-etablissements-2025-2026.pdf",
          "https://www.amci.ma/cooperation-academique"
        ],
        "verifieLe": "2026-09-24",
        "langue": "Aucun test de langue n'est cité. Selon l'AMCI, le français est la langue véhiculaire des établissements publics d'enseignement supérieur marocains, et son centre de langue propose aux étudiants non francophones une mise à niveau encadrée, validée par une attestation en fin d'année. La langue peut varier d'une filière à l'autre : vérifiez celle de la filière que vous visez.",
        "procedure": "Avec un baccalauréat étranger, vous devez présenter une autorisation d'inscription délivrée par la division de la coopération du ministère de l'Enseignement supérieur. Elle s'obtient par la voie diplomatique : ambassade ou autorité de votre pays, puis AMCI, qui transmet le dossier au ministère.",
        "conditions": "Le répertoire AMCI 2025-2026 cite à El Jadida la Faculté des sciences, la faculté de droit et d'économie, la faculté des lettres et l'ENCG, ainsi que l'EST de Sidi Bennour. Pour la Faculté des sciences, il demandait un bac C ou D de l'année avec mention, 12 sur 20 dans les matières de base et 23 ans au plus au 31 décembre.",
        "calendrier": "L'université ne publie pas de dates propres aux étudiants étrangers pour 2026-2027. La date qui compte d'abord est celle de l'ambassade ou de l'autorité de votre pays, qui transmet les dossiers à l'AMCI."
      }
    }
  },
  {
    "collection": "universities",
    "id": "universite-mohammed-premier-oujda",
    "motif": "calendrier de la voie AMCI (date fixée par l'ambassade ou l'autorité du pays), signalé par le test « chaque fiche guide », le 2026-09-25",
    "attendu": {
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
    "champs": {
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
        "conditions": "En licence, il faut le baccalauréat de l'année. Pour les écoles à accès régulé, il faut au moins la mention assez bien, et avoir moins de 20 ans pour l'ENSA, moins de 21 ans pour l'ENCG et moins de 22 ans pour l'EST. En master, il faut un diplôme de niveau bac+4 au moins ; en doctorat, un master ou un diplôme équivalent, avec l'avis favorable de l'établissement. Le répertoire AMCI 2025-2026 cite à Oujda la Faculté de médecine et de pharmacie, la Faculté des sciences, la faculté de droit et d'économie, la faculté des lettres, l'ENCG et l'EST.",
        "calendrier": "L'université ne publie pas de dates propres aux étudiants étrangers pour 2026-2027. La date qui compte d'abord est celle de l'ambassade ou de l'autorité de votre pays, qui transmet les dossiers à l'AMCI."
      }
    }
  },
  {
    "collection": "universities",
    "id": "universite-moulay-ismail-meknes",
    "motif": "calendrier de la voie AMCI (date fixée par l'ambassade ou l'autorité du pays), signalé par le test « chaque fiche guide », le 2026-09-25",
    "attendu": {
      "admission": {
        "fraisDossier": "Aucun frais de dossier n'est publié par l'université.",
        "sources": [
          "https://www.amci.ma/sites/default/files/2025-07/repertoire-des-etablissements-2025-2026.pdf",
          "https://www.umi.ac.ma/a-propos/",
          "https://www.umi.ac.ma/offre-de-formation-initiale",
          "https://iro.umi.ac.ma/",
          "https://www.amci.ma/cooperation-academique"
        ],
        "verifieLe": "2026-09-24",
        "langue": "Aucun test de langue n'est cité. Selon l'AMCI, le français est la langue véhiculaire des établissements publics d'enseignement supérieur marocains, et son centre de langue propose aux étudiants non francophones une mise à niveau encadrée, validée par une attestation en fin d'année. La langue peut varier d'une filière à l'autre : vérifiez celle de la filière que vous visez.",
        "procedure": "Pour un bachelier étranger, l'entrée passe par la voie diplomatique, puis par l'AMCI, qui transmet le dossier au ministère de l'Enseignement supérieur. Le service des relations internationales répond à relations.internationales@umi.ac.ma.",
        "conditions": "Le répertoire AMCI 2025-2026 cite à Meknès la Faculté des sciences, la faculté de droit et d'économie, la faculté des lettres, l'ENCG et l'EST, et à Errachidia la faculté des sciences et techniques et la Faculté de médecine et de pharmacie. Pour la médecine, il demandait un bac C, D ou sciences agronomiques de l'année, une mention, 16 sur 20 dans les matières de base et 20 ans au plus au 31 décembre."
      }
    },
    "champs": {
      "admission": {
        "fraisDossier": "Aucun frais de dossier n'est publié par l'université.",
        "sources": [
          "https://www.amci.ma/sites/default/files/2025-07/repertoire-des-etablissements-2025-2026.pdf",
          "https://www.umi.ac.ma/a-propos/",
          "https://www.umi.ac.ma/offre-de-formation-initiale",
          "https://iro.umi.ac.ma/",
          "https://www.amci.ma/cooperation-academique"
        ],
        "verifieLe": "2026-09-24",
        "langue": "Aucun test de langue n'est cité. Selon l'AMCI, le français est la langue véhiculaire des établissements publics d'enseignement supérieur marocains, et son centre de langue propose aux étudiants non francophones une mise à niveau encadrée, validée par une attestation en fin d'année. La langue peut varier d'une filière à l'autre : vérifiez celle de la filière que vous visez.",
        "procedure": "Pour un bachelier étranger, l'entrée passe par la voie diplomatique, puis par l'AMCI, qui transmet le dossier au ministère de l'Enseignement supérieur. Le service des relations internationales répond à relations.internationales@umi.ac.ma.",
        "conditions": "Le répertoire AMCI 2025-2026 cite à Meknès la Faculté des sciences, la faculté de droit et d'économie, la faculté des lettres, l'ENCG et l'EST, et à Errachidia la faculté des sciences et techniques et la Faculté de médecine et de pharmacie. Pour la médecine, il demandait un bac C, D ou sciences agronomiques de l'année, une mention, 16 sur 20 dans les matières de base et 20 ans au plus au 31 décembre.",
        "calendrier": "L'université ne publie pas de dates propres aux étudiants étrangers pour 2026-2027. La date qui compte d'abord est celle de l'ambassade ou de l'autorité de votre pays, qui transmet les dossiers à l'AMCI."
      }
    }
  },
  {
    "collection": "universities",
    "id": "universite-sultan-moulay-slimane-beni-mellal",
    "motif": "calendrier de la voie AMCI (date fixée par l'ambassade ou l'autorité du pays), signalé par le test « chaque fiche guide », le 2026-09-25",
    "attendu": {
      "admission": {
        "fraisDossier": "Aucun frais de dossier n'est publié par l'université.",
        "sources": [
          "https://www.amci.ma/sites/default/files/2025-07/repertoire-des-etablissements-2025-2026.pdf",
          "https://www.usms.ac.ma/fr/node/151",
          "https://www.usms.ac.ma/en/node/137",
          "https://www.usms.ac.ma/en/node/209",
          "https://www.amci.ma/cooperation-academique"
        ],
        "verifieLe": "2026-09-24",
        "langue": "Aucun test de langue n'est cité. Selon l'AMCI, le français est la langue véhiculaire des établissements publics d'enseignement supérieur marocains, et son centre de langue propose aux étudiants non francophones une mise à niveau encadrée, validée par une attestation en fin d'année. La langue peut varier d'une filière à l'autre : vérifiez celle de la filière que vous visez.",
        "procedure": "Le site de l'université n'a pas de page pour les étudiants étrangers. Pour un bachelier étranger, l'entrée passe par la voie diplomatique, puis par l'AMCI, qui transmet le dossier au ministère. Contact : contact@usms.ma.",
        "conditions": "Le répertoire AMCI 2025-2026 cite à Béni Mellal la faculté des lettres, la faculté des sciences et techniques, la Faculté de médecine et de pharmacie, l'ENCG et l'EST, et des EST à Khénifra et à Fquih Ben Salah. Pour la médecine, il demandait un bac C, D ou sciences agronomiques de l'année, une mention, 16 sur 20 dans les matières de base et 20 ans au plus au 31 décembre."
      }
    },
    "champs": {
      "admission": {
        "fraisDossier": "Aucun frais de dossier n'est publié par l'université.",
        "sources": [
          "https://www.amci.ma/sites/default/files/2025-07/repertoire-des-etablissements-2025-2026.pdf",
          "https://www.usms.ac.ma/fr/node/151",
          "https://www.usms.ac.ma/en/node/137",
          "https://www.usms.ac.ma/en/node/209",
          "https://www.amci.ma/cooperation-academique"
        ],
        "verifieLe": "2026-09-24",
        "langue": "Aucun test de langue n'est cité. Selon l'AMCI, le français est la langue véhiculaire des établissements publics d'enseignement supérieur marocains, et son centre de langue propose aux étudiants non francophones une mise à niveau encadrée, validée par une attestation en fin d'année. La langue peut varier d'une filière à l'autre : vérifiez celle de la filière que vous visez.",
        "procedure": "Le site de l'université n'a pas de page pour les étudiants étrangers. Pour un bachelier étranger, l'entrée passe par la voie diplomatique, puis par l'AMCI, qui transmet le dossier au ministère. Contact : contact@usms.ma.",
        "conditions": "Le répertoire AMCI 2025-2026 cite à Béni Mellal la faculté des lettres, la faculté des sciences et techniques, la Faculté de médecine et de pharmacie, l'ENCG et l'EST, et des EST à Khénifra et à Fquih Ben Salah. Pour la médecine, il demandait un bac C, D ou sciences agronomiques de l'année, une mention, 16 sur 20 dans les matières de base et 20 ans au plus au 31 décembre.",
        "calendrier": "L'université ne publie pas de dates propres aux étudiants étrangers pour 2026-2027. La date qui compte d'abord est celle de l'ambassade ou de l'autorité de votre pays, qui transmet les dossiers à l'AMCI."
      }
    }
  },
  {
    "collection": "universities",
    "id": "universite-mohammed-vi-des-sciences-et-de-la-sante-casablanca",
    "motif": "calendrier : aucune date publiée, relu le 2026-09-25 sur la page d'admission, signalé par le test « chaque fiche guide », le 2026-09-25",
    "attendu": {
      "admission": {
        "fraisDossier": "Aucun frais de concours ni de dossier n'est publié. Seuls les 1 500 DH de première inscription sont indiqués.",
        "sources": [
          "https://fm6ss.ma/fr/um6ss/etudiant-international",
          "https://fm6ss.ma/fr/um6ss/admission",
          "https://fm6ss.ma/fr/um6ss/a-propos",
          "https://fm6ss.ma/fr/um6ss/bourses-et-aides-financieres"
        ],
        "verifieLe": "2026-09-24",
        "langue": "La médecine existe en filière francophone et en filière anglophone. Aucun test de langue n'est publié.",
        "procedure": "Le Bureau international accompagne les candidats étrangers. Vous remplissez une préinscription en ligne et créez un compte sur la plateforme de candidature, qui accepte le bac étranger. Dossier : copie du passeport, relevés de notes du bac, attestation de réussite ou diplôme, lettre de motivation adressée au doyen ou au directeur. L'université aide à créer le compte d'équivalence du bac auprès des ministères et à préparer le dossier de visa.",
        "conditions": "La médecine, la médecine dentaire, la médecine vétérinaire et la pharmacie passent par un concours d'accès ; l'ingénierie, les licences et les masters par un test écrit ou oral."
      }
    },
    "champs": {
      "admission": {
        "fraisDossier": "Aucun frais de concours ni de dossier n'est publié. Seuls les 1 500 DH de première inscription sont indiqués.",
        "sources": [
          "https://fm6ss.ma/fr/um6ss/etudiant-international",
          "https://fm6ss.ma/fr/um6ss/admission",
          "https://fm6ss.ma/fr/um6ss/a-propos",
          "https://fm6ss.ma/fr/um6ss/bourses-et-aides-financieres"
        ],
        "verifieLe": "2026-09-24",
        "langue": "La médecine existe en filière francophone et en filière anglophone. Aucun test de langue n'est publié.",
        "procedure": "Le Bureau international accompagne les candidats étrangers. Vous remplissez une préinscription en ligne et créez un compte sur la plateforme de candidature, qui accepte le bac étranger. Dossier : copie du passeport, relevés de notes du bac, attestation de réussite ou diplôme, lettre de motivation adressée au doyen ou au directeur. L'université aide à créer le compte d'équivalence du bac auprès des ministères et à préparer le dossier de visa.",
        "conditions": "La médecine, la médecine dentaire, la médecine vétérinaire et la pharmacie passent par un concours d'accès ; l'ingénierie, les licences et les masters par un test écrit ou oral.",
        "calendrier": "L'université ne publie pas de dates de candidature sur ses pages d'admission : demandez-les au Bureau international, qui accompagne les candidats étrangers, avant de préparer votre dossier."
      }
    }
  },
  {
    "collection": "universities",
    "id": "international-islamic-university-malaysia-gombak",
    "motif": "calendrier : aucune date limite publiée, relu le 2026-09-25 sur eAdmission et la page de la division des admissions, signalé par le test « chaque fiche guide », le 2026-09-25",
    "attendu": {
      "admission": {
        "fraisDossier": "Frais payés en ligne à la fin du formulaire ; le montant n'est pas publié sur les pages d'admission.",
        "sources": [
          "https://eadmission.iium.edu.my/",
          "https://eadmission.iium.edu.my/bootstrap/img/EAS_user%20manual_ug.pdf",
          "https://division.iium.edu.my/amad/wp-content/uploads/sites/2/2025/08/new-entry-requirements-for-international-candidates.pdf",
          "https://centre.iium.edu.my/celpad/faq-downloadable-form/",
          "https://division.iium.edu.my/finance/tuition-fees/"
        ],
        "verifieLe": "2026-09-25",
        "langue": "Anglais : test de placement de l'université à l'arrivée, sauf IELTS Academic ou TOEFL de moins de deux ans. Arabe : test de placement pour tous les étudiants de licence, sauf les diplômés d'un pays arabe où l'arabe est la langue d'enseignement.",
        "procedure": "Candidature en ligne sur le portail eAdmission : vous créez un compte, confirmez votre courriel, remplissez votre profil, choisissez vos programmes, saisissez vos diplômes, déposez photo, passeport et justificatifs financiers, payez en ligne, puis envoyez. Pour la rentrée de 2026-2027, ce portail reçoit les candidats titulaires d'un diplôme étranger. Une fois admis, l'université demande pour vous le visa étudiant auprès d'EMGS, l'agence malaisienne des étudiants internationaux.",
        "conditions": "La liste des diplômes de l'IIUM cite le baccalauréat du Sénégal comme diplôme d'accès direct en licence, sans note minimale publiée. Médecine : équivalence ENIC-NARIC ou Scholaro et IELTS 6,0."
      }
    },
    "champs": {
      "admission": {
        "fraisDossier": "Frais payés en ligne à la fin du formulaire ; le montant n'est pas publié sur les pages d'admission.",
        "sources": [
          "https://eadmission.iium.edu.my/",
          "https://eadmission.iium.edu.my/bootstrap/img/EAS_user%20manual_ug.pdf",
          "https://division.iium.edu.my/amad/wp-content/uploads/sites/2/2025/08/new-entry-requirements-for-international-candidates.pdf",
          "https://centre.iium.edu.my/celpad/faq-downloadable-form/",
          "https://division.iium.edu.my/finance/tuition-fees/"
        ],
        "verifieLe": "2026-09-25",
        "langue": "Anglais : test de placement de l'université à l'arrivée, sauf IELTS Academic ou TOEFL de moins de deux ans. Arabe : test de placement pour tous les étudiants de licence, sauf les diplômés d'un pays arabe où l'arabe est la langue d'enseignement.",
        "procedure": "Candidature en ligne sur le portail eAdmission : vous créez un compte, confirmez votre courriel, remplissez votre profil, choisissez vos programmes, saisissez vos diplômes, déposez photo, passeport et justificatifs financiers, payez en ligne, puis envoyez. Pour la rentrée de 2026-2027, ce portail reçoit les candidats titulaires d'un diplôme étranger. Une fois admis, l'université demande pour vous le visa étudiant auprès d'EMGS, l'agence malaisienne des étudiants internationaux.",
        "conditions": "La liste des diplômes de l'IIUM cite le baccalauréat du Sénégal comme diplôme d'accès direct en licence, sans note minimale publiée. Médecine : équivalence ENIC-NARIC ou Scholaro et IELTS 6,0.",
        "calendrier": "L'université ne publie pas de date limite sur ses pages d'admission. Pour le premier semestre de 2026-2027, le portail eAdmission reçoit les candidats titulaires d'un diplôme étranger. Demandez la date limite au service des admissions avant de préparer votre dossier."
      }
    }
  },
  {
    "collection": "universities",
    "id": "universiti-utara-malaysia-sintok",
    "motif": "calendrier : aucune date limite publiée, relu le 2026-09-25 sur la page d'admission internationale, signalé par le test « chaque fiche guide », le 2026-09-25",
    "attendu": {
      "admission": {
        "fraisDossier": "175 ringgits ou 50 dollars pour les candidats hors Asie du Sud-Est.",
        "sources": [
          "https://www.uum.edu.my/admissions/application-guidelines/undergraduate-international",
          "https://www.uum.edu.my/processing-fees",
          "https://www.uum.edu.my/admissions/fees/postgraduate",
          "https://www.uum.edu.my/admissions/application-guidelines/postgraduate"
        ],
        "verifieLe": "2026-09-25",
        "langue": "Dispense pour les diplômés d'un pays d'enseignement en anglais, dont le Cameroun, le Ghana et le Nigeria, pas le Sénégal. Sinon cours intensif d'anglais, en septembre, février ou juin, puis MUET au niveau exigé.",
        "procedure": "Candidature en ligne sur le portail de l'UUM, avec la preuve de paiement des frais de dossier. Si votre pays impose un examen d'entrée à l'université, joignez-en le résultat. Une fois admis, l'université demande pour vous le visa étudiant auprès d'EMGS, l'agence malaisienne des étudiants internationaux.",
        "conditions": "Diplôme de fin d'études secondaires après 11 à 12 ans d'études, valable cinq ans après l'examen ; crédit en mathématiques et en anglais. Il faut avoir entre 18 et 25 ans à la date limite. Remplir les minimums ne garantit pas l'admission. Le baccalauréat du Sénégal n'apparaît pas dans les conditions publiées : faites vérifier votre diplôme par le bureau international avant de candidater.",
        "coutIndicatif": "Seule grille de licence publiée, session 2022-2023 : 4 200 ringgits par semestre dans la plupart des licences, 4 700 en communication et informatique, 5 000 en droit et comptabilité, sur sept ou huit semestres, plus 2 000 d'inscription. Elle a plus de deux ans : les montants actuels peuvent être différents."
      }
    },
    "champs": {
      "admission": {
        "fraisDossier": "175 ringgits ou 50 dollars pour les candidats hors Asie du Sud-Est.",
        "sources": [
          "https://www.uum.edu.my/admissions/application-guidelines/undergraduate-international",
          "https://www.uum.edu.my/processing-fees",
          "https://www.uum.edu.my/admissions/fees/postgraduate",
          "https://www.uum.edu.my/admissions/application-guidelines/postgraduate"
        ],
        "verifieLe": "2026-09-25",
        "langue": "Dispense pour les diplômés d'un pays d'enseignement en anglais, dont le Cameroun, le Ghana et le Nigeria, pas le Sénégal. Sinon cours intensif d'anglais, en septembre, février ou juin, puis MUET au niveau exigé.",
        "procedure": "Candidature en ligne sur le portail de l'UUM, avec la preuve de paiement des frais de dossier. Si votre pays impose un examen d'entrée à l'université, joignez-en le résultat. Une fois admis, l'université demande pour vous le visa étudiant auprès d'EMGS, l'agence malaisienne des étudiants internationaux.",
        "conditions": "Diplôme de fin d'études secondaires après 11 à 12 ans d'études, valable cinq ans après l'examen ; crédit en mathématiques et en anglais. Il faut avoir entre 18 et 25 ans à la date limite. Remplir les minimums ne garantit pas l'admission. Le baccalauréat du Sénégal n'apparaît pas dans les conditions publiées : faites vérifier votre diplôme par le bureau international avant de candidater.",
        "coutIndicatif": "Seule grille de licence publiée, session 2022-2023 : 4 200 ringgits par semestre dans la plupart des licences, 4 700 en communication et informatique, 5 000 en droit et comptabilité, sur sept ou huit semestres, plus 2 000 d'inscription. Elle a plus de deux ans : les montants actuels peuvent être différents.",
        "calendrier": "L'université ne publie pas de date limite sur sa page d'admission internationale. La condition d'âge, entre 18 et 25 ans, se calcule à cette date limite : demandez-la au bureau international avant de préparer votre dossier."
      }
    }
  }
];

export const UNIVERSITIES = [];
export const SCHOLARSHIPS = [];
export const LINKS = [];
