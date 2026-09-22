/**
 * ============================================================
 * LOT 72 — LES DERNIÈRES PREUVES (22 septembre 2026, nuit)
 * ============================================================
 *
 * Clôture du chantier de consolidation des bourses (lots 67 à 72).
 * Les quatre fiches que le lot 71 avait laissées de côté, relues à la
 * source le 2026-09-22 :
 *
 *   - SCUOLA NORMALE : les trois appels du 42e cycle lus (PDF, pdf.js).
 *     Dates du lot 40 confirmées ; preuve posée ; la fiche de la bourse
 *     couvre enfin les trois classes, pas seulement les sciences.
 *   - KAIST : le calendrier du portail de candidature donne la date —
 *     session internationale de printemps 2027 close le 1er septembre
 *     2026. La fiche disait « Ouverte ».
 *   - MASTERCARD KNUST : la page affiche toujours l'appel 2025/2026 ;
 *     preuve posée, rien d'autre ne change.
 *   - MASTERCARD USIU : aucun appel en cours ; règle des « cinq mois
 *     avant la rentrée » confirmée mot pour mot.
 *
 * Reste l'exception assumée : Al-Azhar (inactive, sans programme).
 *
 * Premier lot passé sous la garde des dates de lecture
 * (scripts/lot-validate.mjs, refusDatesDeLecture) : verifieLe au format
 * AAAA-MM-JJ et jamais futur, preuve jamais sans citation.
 *
 * Rejeu analyserEcheance + etatCandidature au 22/09 avant livraison ;
 * `attendu` généré depuis l'export du 2026-09-22 (lot 71 compris).
 * ============================================================
 */

export const PATCHES = [
  {
    "collection": "scholarships",
    "id": "scuola-normale-superiore-phd",
    "attendu": {
      "generalCriteria": "AUCUNE RESTRICTION DE NATIONALITÉ. Master obtenu dans les 5 ans précédant la date limite s'il a été délivré hors d'Italie ; équivalence appréciée par la commission. 34 places sur le site de Pise en Faculté de Sciences : Physique 7, Mathématiques 6, Méthodes computationnelles 6, Chimie 4, Technologies quantiques et nanosciences 6, Neurosciences 5. Deux sessions pour 2026/27, les 19 février et 22 juin 2026, toutes deux closes ; prochaine ouverture attendue vers janvier 2027.",
      "periodeOuverture": "Sessions de mars à août selon la classe ; oraux de mai à septembre.",
      "exigences": [
        "diplome_recent"
      ],
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.sns.it/it/concorso-phd"
    },
    "champs": {
      "generalCriteria": "AUCUNE RESTRICTION DE NATIONALITÉ. Master (laurea magistrale ou titre étranger équivalent) obtenu depuis cinq ans au plus à la clôture de la première session ; un master attendu avant le 31 octobre de l'année du concours est accepté. Trois concours par cycle, un par classe : lettres et philosophie (Pise, 28 places au 42e cycle, une seule session), sciences (Pise, 34 places, deux sessions) et sciences politico-sociales (Florence, 15 places, deux sessions). Dossier en ligne : CV au format Europass, mémoire de master avec un résumé en anglais, relevés de notes, publications éventuelles et un projet de recherche d'environ 20 000 signes, un par cursus visé. Une à deux personnes désignées dans le dossier envoient une lettre de recommandation par la plateforme dans les sept jours qui suivent la clôture : sans elle, le dossier est éliminé. Sélection sur titres, puis épreuves orales ; en sciences politico-sociales, les épreuves se passent exclusivement en anglais.",
      "periodeOuverture": "appels publiés en janvier ; clôtures de février à août selon la classe — sciences en février et en juin, sciences politico-sociales en mars et en août, lettres et philosophie en avril",
      "exigences": [
        "diplome_recent",
        "projet_recherche",
        "lettres_recommandation"
      ],
      "verifieLe": "2026-09-22",
      "sourceEcheance": "https://www.sns.it/en/modulistica/calls-phd-202627"
    },
    "motif": "Les trois appels du 42e cycle (sciences, lettres et philosophie, sciences politico-sociales) et les deux décrets de seconde session, lus le 2026-09-22 dans le navigateur (texte des PDF extrait par pdf.js depuis la page « Calls PhD – 2026/27 »). Les dates relevées au lot 40 sont exactes ; il manquait la preuve. La fiche de la bourse ne décrivait que la classe de sciences (34 places, Pise) et annonçait une réouverture « vers janvier 2027 » : elle couvre maintenant les trois concours. Citation : article 3.1 de l'appel des sciences politico-sociales, version anglaise ; l'extraction coupait « Aug ust » et « 202 6 », recollés sans rien changer d'autre."
  },
  {
    "collection": "programs",
    "id": "scuola-normale-superiore-pise__scuola-normale-superiore-phd__doctorat",
    "attendu": {
      "deadline": "Le concours du 42e cycle (2026-2027) est terminé : dernière clôture le 3 août 2026 à 23h59 (CEST) pour la classe de sciences politico-sociales, le 22 juin 2026 pour la classe de sciences et le 13 avril 2026 pour lettres et philosophie. Le concours du 43e cycle devrait ouvrir en mars 2027.",
      "deadlineISO": undefined,
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "deadline": "Le concours du 42e cycle (2026-2027) est terminé : dernière clôture le 3 août 2026 à 23h59 (CEST), seconde session de la classe de sciences politico-sociales, après le 22 juin 2026 pour la seconde session de la classe de sciences et le 13 avril 2026 pour lettres et philosophie. Les appels du 43e cycle sont attendus au début de 2027 : ceux du 42e cycle avaient paru en janvier.",
      "deadlineISO": "2026-08-03",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://www.sns.it/sites/default/files/2026-01/bando_phd_2026-27_sps_0.pdf",
        "citation": "within h. 11:59 pm CEST of Monday 3 August 2026 as regards the second session.",
        "le": "2026-09-22T22:45:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Les trois appels du 42e cycle (sciences, lettres et philosophie, sciences politico-sociales) et les deux décrets de seconde session, lus le 2026-09-22 dans le navigateur (texte des PDF extrait par pdf.js depuis la page « Calls PhD – 2026/27 »). Les dates relevées au lot 40 sont exactes ; il manquait la preuve. La fiche de la bourse ne décrivait que la classe de sciences (34 places, Pise) et annonçait une réouverture « vers janvier 2027 » : elle couvre maintenant les trois concours. Citation : article 3.1 de l'appel des sciences politico-sociales, version anglaise ; l'extraction coupait « Aug ust » et « 202 6 », recollés sans rien changer d'autre."
  },
  {
    "collection": "scholarships",
    "id": "kaist-scholarship",
    "attendu": {
      "generalCriteria": "Ouverte à tous les pays. Deux volets : le Global Presidential Scholarship (master et master-doctorat intégré, 4 semestres) et le Prestige Scholarship for International Ph.D. Students (master-doctorat intégré et doctorat, 8 semestres). La filière Global Technology Innovation Program (GDI-GTIP Track) est exclue. Trois sessions par an — Spring, Fall Early et Fall Regular — dont les dates exactes ne sont pas publiées de façon accessible : se référer au calendrier d'admission de KAIST.",
      "status": "Ouverte",
      "periodeOuverture": "suit les trois sessions d'admission de KAIST",
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://admission.kaist.ac.kr/intl-graduate/FinancialSupport/Scholarship"
    },
    "champs": {
      "generalCriteria": "Ouverte à tous les pays. Deux volets : le Global Presidential Scholarship (master et master-doctorat intégré, 4 semestres) et le Prestige Scholarship for International Ph.D. Students (master-doctorat intégré et doctorat, 8 semestres). La filière Global Technology Innovation Program (GDI-GTIP Track) est exclue. Trois sessions par an — Spring, Fall Early et Fall Regular — dont les dates s'affichent sur le calendrier du portail de candidature de KAIST (gradapply.kaist.ac.kr). Aucun dossier de bourse séparé : la bourse se coche comme source de financement dans la candidature d'admission.",
      "status": "Fermée — prochaine session : rentrée d'automne 2027",
      "periodeOuverture": "trois sessions internationales par an (Spring, Fall Early, Fall Regular), affichées sur le calendrier du portail de candidature ; pour la rentrée de printemps, dépôt de mi-août à début septembre",
      "verifieLe": "2026-09-22",
      "sourceEcheance": "https://gradapply.kaist.ac.kr/grad/main/schedule.do"
    },
    "motif": "Calendrier du portail de candidature de KAIST (« Application Schedule ») lu le 2026-09-22 dans le navigateur : la voie internationale de la rentrée de printemps 2027 a accepté les dossiers du 18 août au 1er septembre 2026, et aucune session n'est ouverte. La fiche disait « Ouverte » sans date, et que les dates n'étaient « pas publiées de façon accessible » : elles le sont, sur ce calendrier. Les pages d'admission (admission.kaist.ac.kr) restent vides dans le navigateur ; la bourse elle-même n'est pas relue."
  },
  {
    "collection": "programs",
    "id": "kaist-daejeon__kaist-scholarship",
    "attendu": {
      "status": "Ouverte",
      "deadline": "Aucun dossier séparé : le candidat international qui coche la bourse KAIST comme source de financement dans sa candidature d'admission est automatiquement considéré, l'attribution dépendant ensuite du dossier et de l'avis du département. Trois sessions d'admission par an (Spring, Fall Early, Fall Regular) ; les dates précises sont sur le calendrier d'admission de KAIST.",
      "deadlineISO": undefined,
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "status": "Fermée",
      "deadline": "Session de printemps 2027 terminée : la voie internationale acceptait les dossiers du 18 août jusqu'au 1er septembre 2026. Aucun dossier de bourse séparé : le candidat international qui coche la bourse KAIST comme source de financement dans sa candidature d'admission est automatiquement considéré. Prochaines sessions : rentrée d'automne 2027 (Fall Early, puis Fall Regular), dates à lire sur le calendrier du portail de candidature de KAIST.",
      "deadlineISO": "2026-09-01",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://gradapply.kaist.ac.kr/grad/main/schedule.do",
        "citation": "International Track (외국인전형) Apply 2027 Spring Semester 2026/08/18 ~ 2026/09/01",
        "le": "2026-09-22T22:45:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Calendrier du portail de candidature de KAIST (« Application Schedule ») lu le 2026-09-22 dans le navigateur : la voie internationale de la rentrée de printemps 2027 a accepté les dossiers du 18 août au 1er septembre 2026, et aucune session n'est ouverte. La fiche disait « Ouverte » sans date, et que les dates n'étaient « pas publiées de façon accessible » : elles le sont, sur ce calendrier. Les pages d'admission (admission.kaist.ac.kr) restent vides dans le navigateur ; la bourse elle-même n'est pas relue."
  },
  {
    "collection": "scholarships",
    "id": "mastercard-foundation-scholars-knust",
    "attendu": {
      "generalCriteria": "LE DOSSIER SE DÉPOSE PAR COURSIER, pas en ligne : formulaire complété à envoyer au Program Manager, Mastercard Foundation Scholars Program, Africa Hall Road, Impact Building, KNUST, Kumasi. Il faut EN PLUS avoir déjà candidaté à l'admission KNUST et joindre le récépissé de cette candidature. Diplôme de fin d'études secondaires de moins de CINQ ANS et résultats déjà obtenus — aucun candidat en attente de résultats. Ne pas être déjà inscrit dans un établissement d'enseignement supérieur. Besoin économique critique à démontrer, antécédents de leadership et d'engagement communautaire, et engagement « Go-Back Give-Back » de redonner à sa communauté. Priorité aux candidates, aux personnes déplacées et réfugiées, et aux personnes en situation de handicap. Un baccalauréat sénégalais relève de la mention « or their equivalent » du règlement, sans que cette équivalence soit confirmée noir sur blanc. Dernier appel publié : 2025/2026, clos le 30 mai 2025 ; aucun appel 2026/2027 au 30 août 2026. Historique : appels lancés entre février et avril, clôture fin mai.",
      "verifieLe": "2026-09-05"
    },
    "champs": {
      "generalCriteria": "LE DOSSIER SE DÉPOSE PAR COURSIER, pas en ligne : formulaire complété à envoyer au Program Manager, Mastercard Foundation Scholars Program, Africa Hall Road, Impact Building, KNUST, Kumasi. Il faut EN PLUS avoir déjà candidaté à l'admission KNUST et joindre le récépissé de cette candidature. Diplôme de fin d'études secondaires de moins de CINQ ANS et résultats déjà obtenus — aucun candidat en attente de résultats. Ne pas être déjà inscrit dans un établissement d'enseignement supérieur. Besoin économique critique à démontrer, antécédents de leadership et d'engagement communautaire, et engagement « Go-Back Give-Back » de redonner à sa communauté. Priorité aux candidates, aux personnes déplacées et réfugiées, et aux personnes en situation de handicap. Un baccalauréat sénégalais relève de la mention « or their equivalent » du règlement, sans que cette équivalence soit confirmée noir sur blanc. Dernier appel publié : 2025/2026, clos le 30 mai 2025 ; aucun appel 2026/2027 à la lecture de septembre 2026. Historique : appels lancés entre février et avril, clôture fin mai.",
      "verifieLe": "2026-09-22"
    },
    "motif": "Page officielle du programme à KNUST relue le 2026-09-22 (deux lectures concordantes ; le navigateur intégré refuse ce domaine) : elle affiche toujours l'échéance de la promotion 2025/2026 et le formulaire 2025/2026. Aucun appel 2026/2027. La preuve est posée ; le texte dit désormais à quelle date la page a été lue."
  },
  {
    "collection": "programs",
    "id": "knust-kumasi__mastercard-foundation-scholars-knust__licence",
    "attendu": {
      "deadline": "La page officielle affiche encore la date du 30 mai 2025 pour la promotion 2025/2026 ; aucun appel 2026 n'est publié. Le rythme habituel est une clôture fin mai pour la rentrée suivante. Réservé aux candidats à l'admission à KNUST avec un diplôme de fin d'études secondaires de moins de 5 ans.",
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "deadline": "La page officielle affiche encore, à la lecture de septembre 2026, la date du 30 mai 2025 pour la promotion 2025/2026 ; aucun appel 2026/2027 n'est publié. Le rythme habituel : appel entre février et avril, clôture fin mai pour la rentrée suivante. Réservé aux candidats à l'admission à KNUST avec un diplôme de fin d'études secondaires de moins de 5 ans.",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://mcf.knust.edu.gh/scholarship-application/",
        "citation": "2025 APPLICATION DEADLINE: ON OR BEFORE FRIDAY, 30TH MAY 2025!",
        "le": "2026-09-22T22:45:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Page officielle du programme à KNUST relue le 2026-09-22 (deux lectures concordantes ; le navigateur intégré refuse ce domaine) : elle affiche toujours l'échéance de la promotion 2025/2026 et le formulaire 2025/2026. Aucun appel 2026/2027. La preuve est posée ; le texte dit désormais à quelle date la page a été lue."
  },
  {
    "collection": "scholarships",
    "id": "mastercard-foundation-scholars-usiu",
    "attendu": {
      "verifieLe": "2026-09-05"
    },
    "champs": {
      "verifieLe": "2026-09-22"
    },
    "motif": "Page officielle du programme à USIU-Africa relue le 2026-09-22 (deux lectures concordantes ; injoignable le 20 septembre) : aucun appel en cours n'y est affiché, et la règle de publication est confirmée mot pour mot. Le texte du programme était juste ; seule la preuve manquait."
  },
  {
    "collection": "programs",
    "id": "usiu-africa-nairobi__mastercard-foundation-scholars-usiu__licence",
    "attendu": {
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://www.usiu.ac.ke/mastercard-foundation-scholars-program/",
        "citation": "An advert for the 'Call for Applications' will be rolled out 5 months before the intake.",
        "le": "2026-09-22T22:45:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Page officielle du programme à USIU-Africa relue le 2026-09-22 (deux lectures concordantes ; injoignable le 20 septembre) : aucun appel en cours n'y est affiché, et la règle de publication est confirmée mot pour mot. Le texte du programme était juste ; seule la preuve manquait."
  }
];
