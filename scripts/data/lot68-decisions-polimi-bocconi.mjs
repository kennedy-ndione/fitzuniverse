/**
 * ============================================================
 * LOT 68 — LES DEUX DÉCISIONS DE CHARLES (22 septembre 2026, soir)
 * ============================================================
 *
 * 1. POLIMI LICENCE — « le détacher ».
 *    Le programme `polimi-bachelor` était rattaché à la bourse au
 *    mérite, dont l'appel ne vise que le MASTER. Un patch ne sait pas
 *    supprimer un document, et supprimer le programme aurait pu laisser
 *    orpheline une candidature d'étudiant qui le cite. Le programme est
 *    donc RATTACHÉ à la bourse qui finance réellement la licence au
 *    Politecnico : la bourse régionale DSU, créée ici (appel 2026-2027,
 *    supplément et calendrier officiels lus le 2026-09-22 dans le
 *    navigateur). Même famille, même forme que la fiche DSU de la
 *    Statale (dsu-lombardia-milano-statale). La bourse au mérite passe
 *    à `levels: ["Master"]`.
 *
 * 2. BOCCONI LICENCE — « chercher la vraie bourse ».
 *    Il n'existe plus de « Merit Award » de licence sur le site de
 *    Bocconi. L'aide de première année s'appelle « Bocconi4Access to
 *    Education » : exonérations de 20 à 100 % selon la situation de la
 *    famille, demande unique APRÈS l'inscription, fenêtres du 12 au
 *    30 novembre 2026 et du 15 mars au 5 avril 2027. La fiche
 *    `bocconi-merit-award` garde son identifiant (liens, candidatures)
 *    et prend le vrai nom, le vrai montant et le vrai calendrier.
 *
 * VÉRIFIÉ AVANT LIVRAISON
 * -----------------------
 * validerLot : 0 erreur (1 orpheline annoncée, rattachée par le patch
 * du même lot). Rejeu analyserEcheance + etatCandidature au 22/09 :
 * DSU Polimi « Candidatures closes », Bocconi « pas encore ouvertes —
 * clôture annoncée le 30 novembre 2026 ». Profil de référence du
 * moteur : toujours au moins six propositions.
 *
 * Chaque `attendu` vient de l'export du 2026-09-22T18:27 (lot 67
 * compris) ; `undefined` = champ absent en base.
 * ============================================================
 */

export const SCHOLARSHIPS = [
  {
    "id": "polimi-dsu-regional-scholarship",
    "data": {
      "title": "Borsa di studio DSU — Regione Lombardia (Politecnico di Milano)",
      "country": "Italie",
      "funding": "Selon la tranche de revenus et le lieu de vie : jusqu'à 8 248 € par an pour un étudiant hors de sa commune (argent, un repas gratuit par jour, et logement en résidence s'il en fait la demande), 4 820 € pour un étudiant pendulaire, 3 430 € pour un étudiant de Milan. Sur revenus, pas au mérite.",
      "officialWebsite": "https://www.polimi.it/en/students/tuition-fees-scholarships-and-financial-aid/university-financial-aid-diritto-allo-studio-universitario-dsu",
      "description": "La bourse régionale de droit à l'étude des étudiants du Politecnico di Milano : la Région Lombardie finance, le Politecnico instruit et publie son propre appel chaque année en juin. 1 700 bourses pour 2026-2027, dont 250 pour la première année de licence et 290 pour la première année de master.",
      "isActive": true,
      "status": "Fermée — appel 2026-2027 terminé, prochain appel en juin 2027",
      "generalCriteria": "Attribuée SUR REVENUS : ISEE ou ISEEU parificato ≤ 26 887,93 € et ISPE ≤ 58 452,06 € (2026-2027). Un étudiant dont la famille vit à l'étranger fait établir un ISEEU parificato, EXCLUSIVEMENT au CAF agréé par le Politecnico. Les étudiants des pays que le ministère italien classe « particulièrement pauvres » (décret MUR n° 176 du 24 février 2026) peuvent présenter à la place un certificat de l'ambassade d'Italie attestant que leur famille n'est ni de haut revenu ni de haut rang social. La demande se dépose AVANT même l'inscription, et même avant le test d'entrée. En première année, l'attribution se fait sur les revenus ; il faudra ensuite valider un minimum de crédits dans l'année. À partir de l'appel 2027-2028, les ressources de la famille à l'étranger seront aussi comparées au minimum exigé pour le visa d'études.",
      "levels": [
        "Licence",
        "Master",
        "Doctorat"
      ],
      "eligibility": {
        "note": "Aucune condition de nationalité : la bourse régionale italienne de droit à l'étude s'attribue sur conditions de revenus. Les étudiants dont la famille vit hors d'Italie font établir un ISEEU parificato auprès du CAF agréé par le Politecnico.",
        "scope": "monde"
      },
      "funder": "region",
      "funderName": "Regione Lombardia (DSU, instruit par le Politecnico di Milano)",
      "entryPoint": "bourse",
      "exigences": [],
      "verifieLe": "2026-09-22",
      "sourceEcheance": "https://www.polimi.it/fileadmin/user_upload/studenti/tasse-borse-agevolazioni-economiche/dsu/bando_2026-2027/Main_Deadlines_DSU_2026-2027.pdf",
      "periodeOuverture": "appel annuel publié en juin ; dépôt jusqu'à fin juillet pour les années suivantes et jusqu'au début août pour la première année"
    }
  }
];

export const PATCHES = [
  {
    "collection": "programs",
    "id": "polimi-bachelor",
    "attendu": {
      "scholarshipId": "politecnico-di-milano-merit-based-scholarship",
      "deadline": "À confirmer selon l'année académique",
      "deadlineISO": undefined,
      "status": "Ouverte",
      "coverage": "Exonération partielle ou totale des frais de scolarité, avec possibilité d'une allocation selon le programme",
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "scholarshipId": "polimi-dsu-regional-scholarship",
      "deadline": "Appel DSU 2026-2027 terminé : les étudiants de première année devaient déposer leur demande jusqu'au 5 août 2026 à midi (heure italienne), dossier ISEEU parificato compris. Le prochain appel paraît en juin 2027, pour la rentrée de septembre 2027 ; on peut déposer avant même d'être inscrit.",
      "deadlineISO": "2026-08-05",
      "status": "Fermée — appel 2026-2027 terminé",
      "coverage": "Bourse régionale jusqu'à 8 248 € par an (étudiant hors de sa commune, selon la tranche de revenus), en argent et en services",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://www.polimi.it/fileadmin/user_upload/studenti/tasse-borse-agevolazioni-economiche/dsu/bando_2026-2027/Main_Deadlines_DSU_2026-2027.pdf",
        "citation": "SCHOLARSHIP Apply by Provisional ranking Review request Final ranking Subsequent years July 21 st (h. 12:00 noon ) September 29 th From September 29 th to October 6 th November 10 th First years August 5 th (h. 12:00 noon )",
        "le": "2026-09-22T20:00:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Décision de Charles du 2026-09-22 : détacher la licence de la bourse au mérite de Polimi, dont l'appel officiel ne vise que le MASTER. Plutôt que de laisser la licence sans bourse, elle est rattachée à celle qui la finance réellement — la bourse régionale DSU du Politecnico — créée dans ce même lot, lue le 2026-09-22 (page DSU, appel, supplément et calendrier officiel)."
  },
  {
    "collection": "scholarships",
    "id": "politecnico-di-milano-merit-based-scholarship",
    "attendu": {
      "levels": [
        "Licence",
        "Master"
      ]
    },
    "champs": {
      "levels": [
        "Master"
      ]
    },
    "motif": "Conséquence du détachement de polimi-bachelor : l'appel « Merit Based International Scholarships » ne vise que le premier semestre des masters enseignés en anglais."
  },
  {
    "collection": "scholarships",
    "id": "bocconi-merit-award",
    "attendu": {
      "title": "Bocconi Merit Award",
      "funding": "Jusqu'à 100 %",
      "officialWebsite": "https://www.unibocconi.it/en/current-students/funding/bocconi-graduate-merit-awards",
      "description": "Bourse au mérite de Bocconi University, attribuée automatiquement à la candidature sur la base du profil académique (GPA, résultats SAT/GMAT selon le programme), sans dossier de bourse séparé à déposer.",
      "generalCriteria": "",
      "eligibility": {
        "note": "Ouverte à toutes les nationalités ; l'attribution se fait au mérite académique.",
        "scope": "monde"
      },
      "status": "Ouverte",
      "verifieLe": undefined,
      "sourceEcheance": undefined,
      "periodeOuverture": undefined,
      "exigences": undefined
    },
    "champs": {
      "title": "Bocconi4Access to Education — exonérations de licence",
      "funding": "Exonération des droits de scolarité, totale ou partielle (cinq paliers, de 20 % à la totalité), selon la situation économique et patrimoniale de la famille ; renouvelable chaque année si les conditions de résultats sont remplies. Ne couvre pas le coût de la vie.",
      "officialWebsite": "https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/funding",
      "description": "Le dispositif d'aide de Bocconi pour les étudiants INTERNATIONAUX de première année de licence ou de droit : une seule demande, examinée sur la situation économique de la famille, et des exonérations attribuées jusqu'à épuisement des fonds, en commençant par les familles dont la situation est la plus difficile. Ce n'est pas une bourse au mérite.",
      "generalCriteria": "Réservé aux candidats internationaux inscrits en première année de licence ou de droit. La demande unique « Bocconi4Access to Education » se dépose APRÈS l'inscription définitive (accès au portail environ deux heures après), dans l'une des fenêtres de l'année ; les résultats tombent environ dix semaines après la clôture. Priorité aux dossiers complets et aux familles qui ont le plus besoin d'aide. Pour les années suivantes, des prix d'excellence récompensent les meilleurs étudiants.",
      "eligibility": {
        "note": "Ouvert aux étudiants internationaux de toutes nationalités inscrits en première année ; attribution selon la situation économique et patrimoniale de la famille, dans la limite des fonds.",
        "scope": "monde"
      },
      "status": "Fermée — dépôt de la session anticipée du 12 au 30 novembre 2026",
      "verifieLe": "2026-09-22",
      "sourceEcheance": "https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/funding/deadlines-and-procedure-ay-2027-28",
      "periodeOuverture": "deux fenêtres par an après l'inscription : mi-novembre à fin novembre (session anticipée), puis mi-mars à début avril (session d'hiver)",
      "exigences": [
        "admission_prealable"
      ]
    },
    "motif": "Décision de Charles du 2026-09-22 : trouver la vraie bourse de LICENCE. Les pages officielles de Bocconi lues le 2026-09-22 ne présentent plus de « Merit Award » de licence : l'aide de première année est le dispositif « Bocconi4Access to Education » (exonérations de 20 à 100 % selon la situation de la famille). L'ancien lien pointait sur les Graduate Merit Awards 2024-2025, c'est-à-dire le MASTER. La fiche garde son identifiant pour ne casser aucun lien ni aucune candidature."
  },
  {
    "collection": "programs",
    "id": "bocconi-bachelor",
    "attendu": {
      "deadline": "À confirmer selon l'année académique",
      "deadlineISO": undefined,
      "status": "Ouverte",
      "coverage": "Exonération totale ou partielle des frais de scolarité selon le mérite académique.",
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "deadline": "Jusqu'au 30 novembre 2026 pour la session anticipée : demande « Bocconi4Access to Education » à déposer du 12 au 30 novembre 2026, après l'inscription définitive, résultats avant le 25 février 2027. Seconde fenêtre (session d'hiver) du 15 mars au 5 avril.",
      "deadlineISO": "2026-11-30",
      "status": "Fermée — dépôt du 12 au 30 novembre 2026",
      "coverage": "Exonération des droits de scolarité, totale ou partielle (de 20 % à la totalité), selon la situation économique de la famille",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/funding/deadlines-and-procedure-ay-2027-28",
        "citation": "Early Session and HEC 1st round November 12 - November 30, 2026 As the application opening approaches within February 25, 2027 Winter Session and HEC 2nd round March 15 - April 5th, 2027",
        "le": "2026-09-22T20:00:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Calendrier officiel « Deadlines and procedure a.y. 2027-28 » lu le 2026-09-22. La vérification du 19/09 avait une citation VIDE et pointait sur la page du master 2024-2025."
  }
];
