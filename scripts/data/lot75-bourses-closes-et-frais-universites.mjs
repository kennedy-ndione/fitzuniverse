/**
 * ============================================================
 * LOT 75 — BOURSES CLOSES, FRAIS ET EXONÉRATIONS DES UNIVERSITÉS
 * (23 septembre 2026)
 * ============================================================
 *
 * Demande de Charles, après le lot 74 : « tout faire dans ce même
 * lot 75 ». Quatre volets.
 *
 * 1. QUATRE BOURSES AFFICHÉES « OUVERTE » APRÈS LEUR CLÔTURE
 *    Bourse, programmes, texte d'échéance, preuve :
 *      - Tunisie (quota du Sénégal) : dossiers reçus jusqu'au
 *        6 août 2026. CORRECTION DE PREUVE : la date du 16 août et sa
 *        citation venaient de l'annonce Ashinaga du même ministère.
 *        Le vrai communiqué est une suite de deux images ; la seconde
 *        porte l'échéance, la première les conditions (relues).
 *      - DSU Toscana : clos le 7 septembre 2026 à 13h00 (licence et
 *        master) ; le doctorat a sa propre fenêtre (25 sept. - 16 nov.).
 *      - EDiSU Pavia : clos le 15 septembre 2026 à 15h00 ; deadlineISO
 *        passe du 4 août (formule logement) au 15 septembre.
 *      - Opera Universitaria (Trente) : clos le 7 septembre 2026, sur
 *        la preuve relue le 19 ; site hors ligne, preuve conservée.
 *
 * 2. FRAIS DE SCOLARITÉ : 6 des 11 universités sans prix en ont un
 *    (AIMS Ghana et AIMS Rwanda gratuits, KAIST, ESSEC, Florence,
 *    Trente), et Paris Cité gagne la licence et le master (moratoire
 *    2026-2027). Restent sans prix, faute de barème officiel pour les
 *    étrangers : icipe, JKUAT, Cadi Ayyad, Hassan II, Mohammed V.
 *    Choix assumés (voir chaque note) : Florence et Trente au MONTANT
 *    MAXIMUM de 1re année (le réel dépend du pays ou du score
 *    d'admission) ; doctorat ESSEC non repris.
 *
 * 3. EXONÉRATIONS : les 27 politiques « inconnue » et les 2 absentes
 *    recherchées sur source officielle. 20 deviennent « possible,
 *    places limitées », 1 « aucune » (Istanbul), 1 « par défaut »
 *    (Paris Cité, moratoire) ; 6 restent « inconnue » avec un texte
 *    utile (Wuhan : aide unique en argent, pas une réduction des
 *    frais ; JNU, ITU, ELTE, Óbuda, Lisbonne). KAIST garde « par
 *    défaut », texte et source du master et du doctorat.
 *
 * 4. INFOBULLES : les 126 autres textes d'exonération réécrits pour
 *    l'étudiant, à la manière du lot 74 (politique, source et date
 *    inchangées). Dauphine précisé d'après sa page relue le 23 :
 *    255 € au lieu de 3 950 € sur demande motivée.
 *
 * Contrôles avant livraison : validerLot ; rejeu analyserEcheance +
 * etatCandidature au 23/09 (seules les 4 bourses changent d'état, et
 * vers « Fermée ») ; lireFrais / libellePuce sur les 7 universités ;
 * test/lisible et suite complète sur le catalogue simulé.
 * `attendu` généré depuis l'export du 2026-09-23T00:47 (lot 74 compris).
 * ============================================================
 */
export const PATCHES = [
  {
    "collection": "scholarships",
    "id": "bourses-cooperation-tunisie",
    "attendu": {
      "status": "Ouverte",
      "verifieLe": "2026-09-05",
      "pageEcheance": "https://mesrisenegal.sn/2026/08/04/appel-a-candidatures-programme-dorientation-2027-de-linitiative-ashinaga-pour-lafrique-iaa/",
      "generalCriteria": "Seuls les bacheliers de l'année ou de l'année précédente peuvent candidater.\nUn étudiant déjà en deuxième ou troisième année de licence (L2, L3) n'est pas éligible, et le master comme le doctorat ne sont pas concernés.\nCritères chiffrés rapportés pour 2026-2027, à confirmer sur le communiqué du MESRI : 23 ans au plus, mention Bien pour les places avec bourse, mention Assez Bien pour les places sans bourse.\nCe communiqué a été publié sous forme d'images, sans version texte officielle.\nLe dossier se dépose au MESRI à Dakar, à la Direction des Bourses, division des bourses étrangères. Il ne se dépose jamais à l'ambassade ni auprès des universités.\nChaque année, le ministère tunisien de l'Enseignement supérieur offre au Sénégal un quota de places en premier cycle dans les universités publiques tunisiennes.\nIl y a deux catégories de places : les inscriptions avec bourse et les inscriptions sans bourse.\nFilières annoncées pour 2026-2027 : classes préparatoires scientifiques et techniques, informatique, économie et gestion, enseignées en français, et sciences théologiques, enseignées en arabe.\nCalendrier 2026-2027 : le communiqué est paru le 23 juillet 2026 et le dépôt s'est terminé début août. Il y a donc eu environ deux semaines entre la publication et la clôture.\nSurveillez la rubrique « Bourses d'études » du site mesrisenegal.sn de juillet à octobre.\nLes campagnes précédentes ont été publiées aussi bien en octobre (2024) qu'en juillet (2026)."
    },
    "champs": {
      "status": "Fermée, appel 2026-2027 terminé",
      "verifieLe": "2026-09-23",
      "pageEcheance": "https://mesrisenegal.sn/bourses-detudes/",
      "generalCriteria": "Seuls les bacheliers de 2026 ou de 2025 peuvent candidater, toutes séries de baccalauréat confondues.\nÂge : 18 ans au moins et 23 ans au plus.\nMention exigée : Bien pour une place avec bourse tunisienne, Assez Bien pour une place sans bourse.\nUn étudiant déjà en deuxième ou troisième année de licence (L2, L3) n'est pas éligible, et le master comme le doctorat ne sont pas concernés.\nChaque année, le ministère tunisien de l'Enseignement supérieur offre au Sénégal un quota de places en premier cycle dans les universités et instituts publics tunisiens.\nPour 2026-2027 : 20 places, dont 13 avec bourse et 7 sans bourse.\nFilières enseignées en français : cycle préparatoire scientifique ou technique, informatique de gestion, économie, informatique et mathématiques.\nFilières enseignées en arabe : sciences théologiques et sciences islamiques.\nLe dossier se dépose sur papier à la Direction des Bourses, 52 rue Saint Michel à Dakar, au bureau du courrier. Il ne se dépose jamais à l'ambassade ni auprès des universités.\nPièces demandées : une lettre manuscrite adressée au ministre, avec votre adresse mail, votre téléphone et la filière choisie ; deux copies certifiées conformes du diplôme et du relevé de notes du baccalauréat ; deux copies certifiées conformes des bulletins de seconde, première et terminale ; quatre photos d'identité récentes en couleur ; un certificat médical ; deux copies certifiées conformes des trois premières pages du passeport.\nCalendrier 2026-2027 : le communiqué a été publié le 23 juillet 2026 et les dossiers étaient reçus jusqu'au 6 août 2026, délai de rigueur. Il y a donc eu environ deux semaines entre la publication et la clôture.\nCe communiqué a été publié sous forme d'images, sans version texte.\nSurveillez la rubrique « Bourses d'études » du site mesrisenegal.sn de juillet à octobre : les campagnes précédentes ont été publiées aussi bien en octobre (2024) qu'en juillet (2026)."
    },
    "motif": "Clôture de l'appel 2026-2027 (demande de Charles du 2026-09-22 : clore les bourses échues) et CORRECTION DE LA PREUVE. La date du 16 août 2026 et sa preuve venaient d'une autre annonce du même ministère (orientation Ashinaga, publiée le 4 août) : elles n'ont jamais concerné la Tunisie. Le vrai communiqué (n° 00001713, signé le 22 juillet 2026, publié le 23) est une suite de deux images ; la seconde, relue le 2026-09-23, fixe la réception des dossiers « jusqu'au lundi 06 Aout 2026, délai de rigueur » (le 6 août 2026 est un jeudi : le jour de la semaine est faux sur le communiqué, la date est retenue). Conditions relues sur la première image : 20 places (13 avec bourse, 7 sans), bacheliers 2026 ou 2025, toutes séries, 18 à 23 ans, mention Bien ou Assez Bien, filières en français et en arabe. pageEcheance : la rubrique « Bourses d'études » (texte lisible par l'outil de vérification) remplace l'annonce Ashinaga ; le communiqué lui-même n'est qu'en images."
  },
  {
    "collection": "programs",
    "id": "universite-de-carthage-tunis__bourses-cooperation-tunisie__licence",
    "attendu": {
      "status": "Ouverte",
      "deadline": "Fin juillet, le MESRI du Sénégal a publié l'appel « Opportunité de bourses d'études en Tunisie, année académique 2026/2027 ». La date limite n'apparaît que sur les images de l'annonce. Confirmez-la auprès de la Direction des Bourses, qui présente les candidats sénégalais. Le dépôt passe obligatoirement par votre autorité nationale.",
      "deadlineISO": "2026-08-16",
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "status": "Fermée, appel 2026-2027 terminé",
      "deadline": "Appel 2026-2027 terminé : les dossiers étaient reçus à la Direction des Bourses, à Dakar, jusqu'au 6 août 2026, délai de rigueur. Pour 2026-2027, 20 places en licence étaient offertes, dont 13 avec bourse et 7 sans bourse. Le dépôt passe obligatoirement par votre autorité nationale.",
      "deadlineISO": "2026-08-06",
      "sourceVerification": {
        "url": "https://mesrisenegal.sn/2026/07/23/opportunite-de-bourses-detudes-en-tunisie-annee-academique-2026-2027/",
        "citation": "Les dossiers de candidatures sont reçus à la Direction des Bourses, 52 rue Saint Michel (ex Docteur Thèze), bureau du courrier, jusqu'au lundi 06 Aout 2026, délai de rigueur.",
        "le": "2026-09-23T02:01:35.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-23"
    },
    "motif": "Clôture de l'appel 2026-2027 (demande de Charles du 2026-09-22 : clore les bourses échues) et CORRECTION DE LA PREUVE. La date du 16 août 2026 et sa preuve venaient d'une autre annonce du même ministère (orientation Ashinaga, publiée le 4 août) : elles n'ont jamais concerné la Tunisie. Le vrai communiqué (n° 00001713, signé le 22 juillet 2026, publié le 23) est une suite de deux images ; la seconde, relue le 2026-09-23, fixe la réception des dossiers « jusqu'au lundi 06 Aout 2026, délai de rigueur » (le 6 août 2026 est un jeudi : le jour de la semaine est faux sur le communiqué, la date est retenue). Conditions relues sur la première image : 20 places (13 avec bourse, 7 sans), bacheliers 2026 ou 2025, toutes séries, 18 à 23 ans, mention Bien ou Assez Bien, filières en français et en arabe. Citation tirée de la seconde image du communiqué (IMG_7051), publiée sur la page de l'annonce."
  },
  {
    "collection": "programs",
    "id": "universite-de-sfax-sfax__bourses-cooperation-tunisie__licence",
    "attendu": {
      "status": "Ouverte",
      "deadline": "Fin juillet, le MESRI du Sénégal a publié l'appel « Opportunité de bourses d'études en Tunisie, année académique 2026/2027 ». La date limite n'apparaît que sur les images de l'annonce. Confirmez-la auprès de la Direction des Bourses, qui présente les candidats sénégalais. Le dépôt passe obligatoirement par votre autorité nationale.",
      "deadlineISO": "2026-08-16",
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "status": "Fermée, appel 2026-2027 terminé",
      "deadline": "Appel 2026-2027 terminé : les dossiers étaient reçus à la Direction des Bourses, à Dakar, jusqu'au 6 août 2026, délai de rigueur. Pour 2026-2027, 20 places en licence étaient offertes, dont 13 avec bourse et 7 sans bourse. Le dépôt passe obligatoirement par votre autorité nationale.",
      "deadlineISO": "2026-08-06",
      "sourceVerification": {
        "url": "https://mesrisenegal.sn/2026/07/23/opportunite-de-bourses-detudes-en-tunisie-annee-academique-2026-2027/",
        "citation": "Les dossiers de candidatures sont reçus à la Direction des Bourses, 52 rue Saint Michel (ex Docteur Thèze), bureau du courrier, jusqu'au lundi 06 Aout 2026, délai de rigueur.",
        "le": "2026-09-23T02:01:35.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-23"
    },
    "motif": "Clôture de l'appel 2026-2027 (demande de Charles du 2026-09-22 : clore les bourses échues) et CORRECTION DE LA PREUVE. La date du 16 août 2026 et sa preuve venaient d'une autre annonce du même ministère (orientation Ashinaga, publiée le 4 août) : elles n'ont jamais concerné la Tunisie. Le vrai communiqué (n° 00001713, signé le 22 juillet 2026, publié le 23) est une suite de deux images ; la seconde, relue le 2026-09-23, fixe la réception des dossiers « jusqu'au lundi 06 Aout 2026, délai de rigueur » (le 6 août 2026 est un jeudi : le jour de la semaine est faux sur le communiqué, la date est retenue). Conditions relues sur la première image : 20 places (13 avec bourse, 7 sans), bacheliers 2026 ou 2025, toutes séries, 18 à 23 ans, mention Bien ou Assez Bien, filières en français et en arabe. Citation tirée de la seconde image du communiqué (IMG_7051), publiée sur la page de l'annonce."
  },
  {
    "collection": "programs",
    "id": "universite-de-sousse-sousse__bourses-cooperation-tunisie__licence",
    "attendu": {
      "status": "Ouverte",
      "deadline": "Fin juillet, le MESRI du Sénégal a publié l'appel « Opportunité de bourses d'études en Tunisie, année académique 2026/2027 ». La date limite n'apparaît que sur les images de l'annonce. Confirmez-la auprès de la Direction des Bourses, qui présente les candidats sénégalais. Le dépôt passe obligatoirement par votre autorité nationale.",
      "deadlineISO": "2026-08-16",
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "status": "Fermée, appel 2026-2027 terminé",
      "deadline": "Appel 2026-2027 terminé : les dossiers étaient reçus à la Direction des Bourses, à Dakar, jusqu'au 6 août 2026, délai de rigueur. Pour 2026-2027, 20 places en licence étaient offertes, dont 13 avec bourse et 7 sans bourse. Le dépôt passe obligatoirement par votre autorité nationale.",
      "deadlineISO": "2026-08-06",
      "sourceVerification": {
        "url": "https://mesrisenegal.sn/2026/07/23/opportunite-de-bourses-detudes-en-tunisie-annee-academique-2026-2027/",
        "citation": "Les dossiers de candidatures sont reçus à la Direction des Bourses, 52 rue Saint Michel (ex Docteur Thèze), bureau du courrier, jusqu'au lundi 06 Aout 2026, délai de rigueur.",
        "le": "2026-09-23T02:01:35.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-23"
    },
    "motif": "Clôture de l'appel 2026-2027 (demande de Charles du 2026-09-22 : clore les bourses échues) et CORRECTION DE LA PREUVE. La date du 16 août 2026 et sa preuve venaient d'une autre annonce du même ministère (orientation Ashinaga, publiée le 4 août) : elles n'ont jamais concerné la Tunisie. Le vrai communiqué (n° 00001713, signé le 22 juillet 2026, publié le 23) est une suite de deux images ; la seconde, relue le 2026-09-23, fixe la réception des dossiers « jusqu'au lundi 06 Aout 2026, délai de rigueur » (le 6 août 2026 est un jeudi : le jour de la semaine est faux sur le communiqué, la date est retenue). Conditions relues sur la première image : 20 places (13 avec bourse, 7 sans), bacheliers 2026 ou 2025, toutes séries, 18 à 23 ans, mention Bien ou Assez Bien, filières en français et en arabe. Citation tirée de la seconde image du communiqué (IMG_7051), publiée sur la page de l'annonce."
  },
  {
    "collection": "programs",
    "id": "universite-de-tunis-el-manar-tunis__bourses-cooperation-tunisie__licence",
    "attendu": {
      "status": "Ouverte",
      "deadline": "Fin juillet, le MESRI du Sénégal a publié l'appel « Opportunité de bourses d'études en Tunisie, année académique 2026/2027 ». La date limite n'apparaît que sur les images de l'annonce. Confirmez-la auprès de la Direction des Bourses, qui présente les candidats sénégalais. Le dépôt passe obligatoirement par votre autorité nationale.",
      "deadlineISO": "2026-08-16",
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "status": "Fermée, appel 2026-2027 terminé",
      "deadline": "Appel 2026-2027 terminé : les dossiers étaient reçus à la Direction des Bourses, à Dakar, jusqu'au 6 août 2026, délai de rigueur. Pour 2026-2027, 20 places en licence étaient offertes, dont 13 avec bourse et 7 sans bourse. Le dépôt passe obligatoirement par votre autorité nationale.",
      "deadlineISO": "2026-08-06",
      "sourceVerification": {
        "url": "https://mesrisenegal.sn/2026/07/23/opportunite-de-bourses-detudes-en-tunisie-annee-academique-2026-2027/",
        "citation": "Les dossiers de candidatures sont reçus à la Direction des Bourses, 52 rue Saint Michel (ex Docteur Thèze), bureau du courrier, jusqu'au lundi 06 Aout 2026, délai de rigueur.",
        "le": "2026-09-23T02:01:35.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-23"
    },
    "motif": "Clôture de l'appel 2026-2027 (demande de Charles du 2026-09-22 : clore les bourses échues) et CORRECTION DE LA PREUVE. La date du 16 août 2026 et sa preuve venaient d'une autre annonce du même ministère (orientation Ashinaga, publiée le 4 août) : elles n'ont jamais concerné la Tunisie. Le vrai communiqué (n° 00001713, signé le 22 juillet 2026, publié le 23) est une suite de deux images ; la seconde, relue le 2026-09-23, fixe la réception des dossiers « jusqu'au lundi 06 Aout 2026, délai de rigueur » (le 6 août 2026 est un jeudi : le jour de la semaine est faux sur le communiqué, la date est retenue). Conditions relues sur la première image : 20 places (13 avec bourse, 7 sans), bacheliers 2026 ou 2025, toutes séries, 18 à 23 ans, mention Bien ou Assez Bien, filières en français et en arabe. Citation tirée de la seconde image du communiqué (IMG_7051), publiée sur la page de l'annonce."
  },
  {
    "collection": "scholarships",
    "id": "dsu-toscana-scholarship",
    "attendu": {
      "status": "Ouverte",
      "verifieLe": "2026-09-05",
      "generalCriteria": ""
    },
    "champs": {
      "status": "Fermée, appel 2026-2027 terminé",
      "verifieLe": "2026-09-23",
      "generalCriteria": "Appel 2026-2027 terminé le 7 septembre 2026 à 13h00 pour la licence et le master.\nPour le doctorat et les écoles de spécialisation, l'appel court du 25 septembre au 16 novembre 2026 à 13h00."
    },
    "motif": "Clôture de l'appel 2026-2027 (demande de Charles du 2026-09-22 : clore les bourses échues). Page de la bourse relue le 2026-09-23 : dépôt « fino alle ore 13.00 del 7 settembre 2026 » pour la licence et le master ; fenêtre distincte du 25 septembre au 16 novembre 2026 pour le doctorat et les écoles de spécialisation (hors catalogue, signalée dans les conditions). La bourse et ses quatre programmes affichaient encore « Ouverte »."
  },
  {
    "collection": "programs",
    "id": "unifi-bachelor",
    "attendu": {
      "status": "Ouverte",
      "deadline": "7 septembre 2026 à 13h00, heure italienne, pour l'année 2026-2027. L'appel, appelé bando, existe en français, en anglais, en arabe et en chinois. C'est une bourse régionale de droit aux études : elle est attribuée selon les revenus et le mérite, sans condition de nationalité. Les revenus se justifient par une attestation ISEE, ou par un ISEE parificato si vous n'êtes pas européen.",
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "status": "Fermée, appel 2026-2027 terminé",
      "deadline": "Appel 2026-2027 terminé le 7 septembre 2026 à 13h00, heure italienne. L'appel, appelé bando, existe en français, en anglais, en arabe et en chinois. C'est une bourse régionale de droit aux études : elle est attribuée selon les revenus et le mérite, sans condition de nationalité. Les revenus se justifient par une attestation ISEE, ou par un ISEE parificato si vous n'êtes pas européen.",
      "sourceVerification": {
        "url": "https://www.dsu.toscana.it/borsa-di-studio",
        "citation": "a partire dalle ore 12:00 del 20 luglio 2026 e fino alle ore 13.00 del 7 settembre 2026 per gli studenti iscritti o che intendano iscriversi ai corsi di laurea triennale, magistrale e magistrale a ciclo unico",
        "le": "2026-09-23T02:01:35.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-23"
    },
    "motif": "Clôture de l'appel 2026-2027 (demande de Charles du 2026-09-22 : clore les bourses échues). Page de la bourse relue le 2026-09-23 : dépôt « fino alle ore 13.00 del 7 settembre 2026 » pour la licence et le master ; fenêtre distincte du 25 septembre au 16 novembre 2026 pour le doctorat et les écoles de spécialisation (hors catalogue, signalée dans les conditions). La bourse et ses quatre programmes affichaient encore « Ouverte »."
  },
  {
    "collection": "programs",
    "id": "unifi-master",
    "attendu": {
      "status": "Ouverte",
      "deadline": "7 septembre 2026 à 13h00, heure italienne, pour l'année 2026-2027. L'appel, appelé bando, existe en français, en anglais, en arabe et en chinois. C'est une bourse régionale de droit aux études : elle est attribuée selon les revenus et le mérite, sans condition de nationalité. Les revenus se justifient par une attestation ISEE, ou par un ISEE parificato si vous n'êtes pas européen.",
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "status": "Fermée, appel 2026-2027 terminé",
      "deadline": "Appel 2026-2027 terminé le 7 septembre 2026 à 13h00, heure italienne. L'appel, appelé bando, existe en français, en anglais, en arabe et en chinois. C'est une bourse régionale de droit aux études : elle est attribuée selon les revenus et le mérite, sans condition de nationalité. Les revenus se justifient par une attestation ISEE, ou par un ISEE parificato si vous n'êtes pas européen.",
      "sourceVerification": {
        "url": "https://www.dsu.toscana.it/borsa-di-studio",
        "citation": "a partire dalle ore 12:00 del 20 luglio 2026 e fino alle ore 13.00 del 7 settembre 2026 per gli studenti iscritti o che intendano iscriversi ai corsi di laurea triennale, magistrale e magistrale a ciclo unico",
        "le": "2026-09-23T02:01:35.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-23"
    },
    "motif": "Clôture de l'appel 2026-2027 (demande de Charles du 2026-09-22 : clore les bourses échues). Page de la bourse relue le 2026-09-23 : dépôt « fino alle ore 13.00 del 7 settembre 2026 » pour la licence et le master ; fenêtre distincte du 25 septembre au 16 novembre 2026 pour le doctorat et les écoles de spécialisation (hors catalogue, signalée dans les conditions). La bourse et ses quatre programmes affichaient encore « Ouverte »."
  },
  {
    "collection": "programs",
    "id": "unipi-bachelor",
    "attendu": {
      "status": "Ouverte",
      "deadline": "7 septembre 2026 à 13h00, heure italienne, pour l'année 2026-2027. L'appel, appelé bando, existe en français, en anglais, en arabe et en chinois. C'est une bourse régionale de droit aux études : elle est attribuée selon les revenus et le mérite, sans condition de nationalité. Les revenus se justifient par une attestation ISEE, ou par un ISEE parificato si vous n'êtes pas européen.",
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "status": "Fermée, appel 2026-2027 terminé",
      "deadline": "Appel 2026-2027 terminé le 7 septembre 2026 à 13h00, heure italienne. L'appel, appelé bando, existe en français, en anglais, en arabe et en chinois. C'est une bourse régionale de droit aux études : elle est attribuée selon les revenus et le mérite, sans condition de nationalité. Les revenus se justifient par une attestation ISEE, ou par un ISEE parificato si vous n'êtes pas européen.",
      "sourceVerification": {
        "url": "https://www.dsu.toscana.it/borsa-di-studio",
        "citation": "a partire dalle ore 12:00 del 20 luglio 2026 e fino alle ore 13.00 del 7 settembre 2026 per gli studenti iscritti o che intendano iscriversi ai corsi di laurea triennale, magistrale e magistrale a ciclo unico",
        "le": "2026-09-23T02:01:35.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-23"
    },
    "motif": "Clôture de l'appel 2026-2027 (demande de Charles du 2026-09-22 : clore les bourses échues). Page de la bourse relue le 2026-09-23 : dépôt « fino alle ore 13.00 del 7 settembre 2026 » pour la licence et le master ; fenêtre distincte du 25 septembre au 16 novembre 2026 pour le doctorat et les écoles de spécialisation (hors catalogue, signalée dans les conditions). La bourse et ses quatre programmes affichaient encore « Ouverte »."
  },
  {
    "collection": "programs",
    "id": "unipi-master",
    "attendu": {
      "status": "Ouverte",
      "deadline": "7 septembre 2026 à 13h00, heure italienne, pour l'année 2026-2027. L'appel, appelé bando, existe en français, en anglais, en arabe et en chinois. C'est une bourse régionale de droit aux études : elle est attribuée selon les revenus et le mérite, sans condition de nationalité. Les revenus se justifient par une attestation ISEE, ou par un ISEE parificato si vous n'êtes pas européen.",
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "status": "Fermée, appel 2026-2027 terminé",
      "deadline": "Appel 2026-2027 terminé le 7 septembre 2026 à 13h00, heure italienne. L'appel, appelé bando, existe en français, en anglais, en arabe et en chinois. C'est une bourse régionale de droit aux études : elle est attribuée selon les revenus et le mérite, sans condition de nationalité. Les revenus se justifient par une attestation ISEE, ou par un ISEE parificato si vous n'êtes pas européen.",
      "sourceVerification": {
        "url": "https://www.dsu.toscana.it/borsa-di-studio",
        "citation": "a partire dalle ore 12:00 del 20 luglio 2026 e fino alle ore 13.00 del 7 settembre 2026 per gli studenti iscritti o che intendano iscriversi ai corsi di laurea triennale, magistrale e magistrale a ciclo unico",
        "le": "2026-09-23T02:01:35.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-23"
    },
    "motif": "Clôture de l'appel 2026-2027 (demande de Charles du 2026-09-22 : clore les bourses échues). Page de la bourse relue le 2026-09-23 : dépôt « fino alle ore 13.00 del 7 settembre 2026 » pour la licence et le master ; fenêtre distincte du 25 septembre au 16 novembre 2026 pour le doctorat et les écoles de spécialisation (hors catalogue, signalée dans les conditions). La bourse et ses quatre programmes affichaient encore « Ouverte »."
  },
  {
    "collection": "scholarships",
    "id": "edisu-pavia",
    "attendu": {
      "status": "Ouverte",
      "verifieLe": "2026-09-05",
      "pageEcheance": undefined,
      "generalCriteria": "Les documents ISEE sont à déposer avant le 22 octobre 2026. En cas de retard, une pénalité de 165 € s'applique.\nAttention au calendrier décalé : la bourse se clôt en août-septembre, avant cette date. Commencez donc la procédure ISEE avant même de connaître le résultat de votre admission.\nCycle 2026/2027 : la formule avec logement est close depuis le 4 août 2026. La formule sans logement est ouverte jusqu'au 15 septembre 2026 à 15h00.\nLa bourse est ouverte à toutes les nationalités, sur conditions de mérite et de revenus.\nSi votre famille réside à l'étranger, vous devez fournir un ISEE parificato.\nLa page de la bourse régionale de Lombardie explique comment faire légaliser vos documents depuis l'étranger.\nL'Université de Pavie publie la méthode de calcul la plus détaillée d'Italie : les revenus bruts 2025 sont convertis au taux moyen de la Banca d'Italia, 20 % du patrimoine s'y ajoutent, et l'immobilier est compté forfaitairement à 500 € par m².\nEDiSU Pavia est une agence autonome de Pavie, distincte des agences régionales. Ne la confondez pas avec EDISU Piemonte, un autre organisme public qui a ses propres montants."
    },
    "champs": {
      "status": "Fermée, appel 2026-2027 terminé",
      "verifieLe": "2026-09-23",
      "pageEcheance": "https://www.edisu.pv.it/news/bando-di-concorso-per-il-conferimento-di-borse-di-studio-per-lanno-accademico-2026-2027-scadenza-ore-15-00-del-15-settembre-2026/",
      "generalCriteria": "Les documents ISEE sont à déposer avant le 22 octobre 2026. En cas de retard, une pénalité de 165 € s'applique.\nAttention au calendrier décalé : la bourse se clôt en août-septembre, avant cette date. Commencez donc la procédure ISEE avant même de connaître le résultat de votre admission.\nCycle 2026-2027 terminé : la formule avec logement a fermé le 4 août 2026, la formule sans logement le 15 septembre 2026 à 15h00.\nLa bourse est ouverte à toutes les nationalités, sur conditions de mérite et de revenus.\nSi votre famille réside à l'étranger, vous devez fournir un ISEE parificato.\nLa page de la bourse régionale de Lombardie explique comment faire légaliser vos documents depuis l'étranger.\nL'Université de Pavie publie la méthode de calcul la plus détaillée d'Italie : les revenus bruts 2025 sont convertis au taux moyen de la Banca d'Italia, 20 % du patrimoine s'y ajoutent, et l'immobilier est compté forfaitairement à 500 € par m².\nEDiSU Pavia est une agence autonome de Pavie, distincte des agences régionales. Ne la confondez pas avec EDISU Piemonte, un autre organisme public qui a ses propres montants."
    },
    "motif": "Clôture de l'appel 2026-2027 (demande de Charles du 2026-09-22 : clore les bourses échues). Annonce officielle d'EDiSU relue le 2026-09-23 : échéance à 15h00 le 15 septembre 2026 ; la formule avec logement avait fermé le 4 août. La bourse et ses trois programmes affichaient encore « Ouverte ». deadlineISO passe du 4 août (formule logement) au 15 septembre, dernière échéance du cycle. Preuve et page d'échéance déplacées sur edisu.pv.it : la page de l'université (en.unipv.it) impose désormais une vérification anti-robot."
  },
  {
    "collection": "programs",
    "id": "universita-di-pavia-pavie__edisu-pavia__doctorat",
    "attendu": {
      "status": "Ouverte",
      "deadline": "Clôture le 15 septembre 2026 à 15h00 pour la formule repas et allocation, année 2026-2027. La formule avec logement s'est achevée le 4 août 2026 à 15h00.",
      "deadlineISO": "2026-08-04",
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "status": "Fermée, appel 2026-2027 terminé",
      "deadline": "Appel 2026-2027 terminé le 15 septembre 2026 à 15h00, heure italienne, pour la formule repas et allocation. La formule avec logement avait fermé le 4 août 2026.",
      "deadlineISO": "2026-09-15",
      "sourceVerification": {
        "url": "https://www.edisu.pv.it/news/bando-di-concorso-per-il-conferimento-di-borse-di-studio-per-lanno-accademico-2026-2027-scadenza-ore-15-00-del-15-settembre-2026/",
        "citation": "Bando di concorso per il conferimento di Borse di Studio per l’anno accademico 2026/2027 – Scadenza ore 15.00 del 15 settembre 2026",
        "le": "2026-09-23T02:01:35.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-23"
    },
    "motif": "Clôture de l'appel 2026-2027 (demande de Charles du 2026-09-22 : clore les bourses échues). Annonce officielle d'EDiSU relue le 2026-09-23 : échéance à 15h00 le 15 septembre 2026 ; la formule avec logement avait fermé le 4 août. La bourse et ses trois programmes affichaient encore « Ouverte ». deadlineISO passe du 4 août (formule logement) au 15 septembre, dernière échéance du cycle. Preuve et page d'échéance déplacées sur edisu.pv.it : la page de l'université (en.unipv.it) impose désormais une vérification anti-robot."
  },
  {
    "collection": "programs",
    "id": "universita-di-pavia-pavie__edisu-pavia__licence",
    "attendu": {
      "status": "Ouverte",
      "deadline": "Clôture le 15 septembre 2026 à 15h00 pour la formule repas et allocation, année 2026-2027. La formule avec logement s'est achevée le 4 août 2026 à 15h00.",
      "deadlineISO": "2026-08-04",
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "status": "Fermée, appel 2026-2027 terminé",
      "deadline": "Appel 2026-2027 terminé le 15 septembre 2026 à 15h00, heure italienne, pour la formule repas et allocation. La formule avec logement avait fermé le 4 août 2026.",
      "deadlineISO": "2026-09-15",
      "sourceVerification": {
        "url": "https://www.edisu.pv.it/news/bando-di-concorso-per-il-conferimento-di-borse-di-studio-per-lanno-accademico-2026-2027-scadenza-ore-15-00-del-15-settembre-2026/",
        "citation": "Bando di concorso per il conferimento di Borse di Studio per l’anno accademico 2026/2027 – Scadenza ore 15.00 del 15 settembre 2026",
        "le": "2026-09-23T02:01:35.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-23"
    },
    "motif": "Clôture de l'appel 2026-2027 (demande de Charles du 2026-09-22 : clore les bourses échues). Annonce officielle d'EDiSU relue le 2026-09-23 : échéance à 15h00 le 15 septembre 2026 ; la formule avec logement avait fermé le 4 août. La bourse et ses trois programmes affichaient encore « Ouverte ». deadlineISO passe du 4 août (formule logement) au 15 septembre, dernière échéance du cycle. Preuve et page d'échéance déplacées sur edisu.pv.it : la page de l'université (en.unipv.it) impose désormais une vérification anti-robot."
  },
  {
    "collection": "programs",
    "id": "universita-di-pavia-pavie__edisu-pavia__master",
    "attendu": {
      "status": "Ouverte",
      "deadline": "Clôture le 15 septembre 2026 à 15h00 pour la formule repas et allocation, année 2026-2027. La formule avec logement s'est achevée le 4 août 2026 à 15h00.",
      "deadlineISO": "2026-08-04",
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "status": "Fermée, appel 2026-2027 terminé",
      "deadline": "Appel 2026-2027 terminé le 15 septembre 2026 à 15h00, heure italienne, pour la formule repas et allocation. La formule avec logement avait fermé le 4 août 2026.",
      "deadlineISO": "2026-09-15",
      "sourceVerification": {
        "url": "https://www.edisu.pv.it/news/bando-di-concorso-per-il-conferimento-di-borse-di-studio-per-lanno-accademico-2026-2027-scadenza-ore-15-00-del-15-settembre-2026/",
        "citation": "Bando di concorso per il conferimento di Borse di Studio per l’anno accademico 2026/2027 – Scadenza ore 15.00 del 15 settembre 2026",
        "le": "2026-09-23T02:01:35.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-23"
    },
    "motif": "Clôture de l'appel 2026-2027 (demande de Charles du 2026-09-22 : clore les bourses échues). Annonce officielle d'EDiSU relue le 2026-09-23 : échéance à 15h00 le 15 septembre 2026 ; la formule avec logement avait fermé le 4 août. La bourse et ses trois programmes affichaient encore « Ouverte ». deadlineISO passe du 4 août (formule logement) au 15 septembre, dernière échéance du cycle. Preuve et page d'échéance déplacées sur edisu.pv.it : la page de l'université (en.unipv.it) impose désormais une vérification anti-robot."
  },
  {
    "collection": "scholarships",
    "id": "opera-universitaria-scholarship",
    "attendu": {
      "status": "Ouverte",
      "periodeOuverture": "bando annuel publié en juillet, dépôt dès la mi-juillet, date de clôture à vérifier dans le bando sur la page officielle"
    },
    "champs": {
      "status": "Fermée, appel 2026-2027 terminé",
      "periodeOuverture": "bando annuel publié en juillet, dépôt de la mi-juillet au début septembre"
    },
    "motif": "Clôture de l'appel 2026-2027 (demande de Charles du 2026-09-22 : clore les bourses échues). Fondée sur la preuve déjà en base, relue le 2026-09-19 sur operauni.tn.it : « September 7 th , 2026 : Deadline for scholarship and tuition fees exemption ». Le site d'Opera Universitaria ne répond plus depuis le 2026-09-22 (relance le 2026-09-23 : échec) : preuve, date de vérification et deadlineISO conservées telles quelles. Le texte d'échéance disait encore que la date n'était pas indiquée."
  },
  {
    "collection": "programs",
    "id": "unitn-bachelor",
    "attendu": {
      "status": "Ouverte",
      "deadline": "Le bando 2026-2027, c'est-à-dire l'appel officiel, a été approuvé début juillet. Les candidatures sont ouvertes depuis la mi-juillet sur le site d'Opera Universitaria. La date limite de clôture n'est pas indiquée sur la page d'accueil : elle se trouve dans le bando. C'est la bourse du droit aux études de la province de Trente, attribuée selon les revenus et le mérite."
    },
    "champs": {
      "status": "Fermée, appel 2026-2027 terminé",
      "deadline": "Appel 2026-2027 terminé le 7 septembre 2026, date limite pour la bourse et pour l'exonération des frais. Le bando, c'est-à-dire l'appel officiel, avait été publié début juillet, avec un dépôt possible dès la mi-juillet sur le site d'Opera Universitaria. C'est la bourse du droit aux études de la province de Trente, attribuée selon les revenus et le mérite."
    },
    "motif": "Clôture de l'appel 2026-2027 (demande de Charles du 2026-09-22 : clore les bourses échues). Fondée sur la preuve déjà en base, relue le 2026-09-19 sur operauni.tn.it : « September 7 th , 2026 : Deadline for scholarship and tuition fees exemption ». Le site d'Opera Universitaria ne répond plus depuis le 2026-09-22 (relance le 2026-09-23 : échec) : preuve, date de vérification et deadlineISO conservées telles quelles. Le texte d'échéance disait encore que la date n'était pas indiquée."
  },
  {
    "collection": "programs",
    "id": "unitn-master",
    "attendu": {
      "status": "Ouverte",
      "deadline": "Le bando 2026-2027, c'est-à-dire l'appel officiel, a été approuvé début juillet. Les candidatures sont ouvertes depuis la mi-juillet sur le site d'Opera Universitaria. La date limite de clôture n'est pas indiquée sur la page d'accueil : elle se trouve dans le bando. C'est la bourse du droit aux études de la province de Trente, attribuée selon les revenus et le mérite."
    },
    "champs": {
      "status": "Fermée, appel 2026-2027 terminé",
      "deadline": "Appel 2026-2027 terminé le 7 septembre 2026, date limite pour la bourse et pour l'exonération des frais. Le bando, c'est-à-dire l'appel officiel, avait été publié début juillet, avec un dépôt possible dès la mi-juillet sur le site d'Opera Universitaria. C'est la bourse du droit aux études de la province de Trente, attribuée selon les revenus et le mérite."
    },
    "motif": "Clôture de l'appel 2026-2027 (demande de Charles du 2026-09-22 : clore les bourses échues). Fondée sur la preuve déjà en base, relue le 2026-09-19 sur operauni.tn.it : « September 7 th , 2026 : Deadline for scholarship and tuition fees exemption ». Le site d'Opera Universitaria ne répond plus depuis le 2026-09-22 (relance le 2026-09-23 : échec) : preuve, date de vérification et deadlineISO conservées telles quelles. Le texte d'échéance disait encore que la date n'était pas indiquée."
  },
  {
    "collection": "universities",
    "id": "african-leadership-university-kigali",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Deux dispositifs, demandes directement a ALU au moment de la candidature. 1) Bourses ALU en partenariat avec la Mastercard Foundation : bourses COMPLETES couvrant l'integralite des frais de scolarite plus un soutien financier tout au long du parcours, reservees a des candidats demontrant un besoin financier et un desavantage socio-economique documente, academiquement solides (moyenne d'au moins B aux examens nationaux) et ages de 23 ans ou moins ; les femmes, les refugies et personnes deplacees, et les personnes en situation de handicap sont particulierement encouragees. ALU precise que le nombre de bourses par promotion est limite et la selection extremement competitive. 2) Grants ALU : exoneration partielle appliquee uniquement sur la facture de scolarite, jamais versee en especes, valable pour la duree minimale du diplome et ne couvrant aucun autre frais.",
        "source": "https://help.alueducation.com/support/solutions/articles/204000012922-who-is-eligible-for-financial-aid-",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Deux aides, à demander à ALU lors de la candidature. Bourse ALU-Mastercard Foundation : tous les frais de scolarité payés, plus un soutien financier pendant les études. Pour les 23 ans ou moins, avec un besoin financier prouvé et au moins B aux examens nationaux. Peu de bourses, sélection très difficile. Grant ALU : réduction partielle des frais de scolarité seulement, jamais versée en argent, pour la durée normale du diplôme.",
        "source": "https://help.alueducation.com/support/solutions/articles/204000012922-who-is-eligible-for-financial-aid-",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "aims-ghana-accra",
    "attendu": {
      "fraisScolarite": undefined,
      "exoneration": {
        "politique": "systematique",
        "detail": "Bourse attribuee a TOUS les etudiants admis, couvrant la scolarite, les supports de cours et le logement — l'institut est residentiel. La page de candidature precise que des bourses completes sont attribuees a tous les etudiants admis au master structure, avec hebergement, restauration et assurance maladie. La demande se fait directement aupres d'AIMS Ghana via son formulaire en ligne, pas aupres d'une ambassade ni d'une autorite nationale. La selection est le seul obstacle : il n'y a pas de dossier de bourse separe.",
        "source": "https://aims.edu.gh/master-of-mathematical-sciences/",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "fraisScolarite": {
        "source": "https://aims.edu.gh/faqs/",
        "verifieLe": "2026-09-23",
        "note": "Master structuré en sciences mathématiques, seul diplôme d'AIMS Ghana. La FAQ officielle écrit : « There are no tuition fees at AIMS » et précise que tous les étudiants africains reçoivent une bourse complète (voyage, hébergement, petite allocation). FAQ non datée ; appel 2026-2027 clos le 15 mars 2026. Montant zéro porté en USD pour que la bande « gratuit » s'applique.",
        "master": {
          "montant": 0,
          "devise": "USD",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "systematique",
        "detail": "Tous les admis au master structuré reçoivent une bourse complète : scolarité, supports de cours, logement, repas et assurance maladie. Il n'y a pas de dossier de bourse séparé : il suffit d'être sélectionné. Candidatez directement auprès d'AIMS Ghana, avec son formulaire en ligne, pas auprès d'une ambassade ni d'une autorité nationale.",
        "source": "https://aims.edu.gh/master-of-mathematical-sciences/",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Frais de scolarité officiels trouvés pour une université qui n'en affichait pas (demande de Charles du 2026-09-22). Montant, devise, source et date de vérification ; le détail et les choix de montant sont dans la note. Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "aims-rwanda-kigali",
    "attendu": {
      "fraisScolarite": undefined,
      "exoneration": {
        "politique": "systematique",
        "detail": "Bourse complete AUTOMATIQUE : tous les candidats selectionnes au master structure d'AIMS beneficient d'une bourse integrale. Le centre est par ailleurs un site du Mastercard Foundation Scholars Program. La demande se fait directement aupres d'AIMS via la plateforme de candidature du master, pas aupres d'une ambassade. Le cursus est residentiel : l'hebergement sur le campus fait partie du dispositif.",
        "source": "https://aims.ac.rw/structured-masters-program/",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "fraisScolarite": {
        "source": "https://aims.ac.rw/faqs/",
        "verifieLe": "2026-09-23",
        "note": "Master structuré en sciences mathématiques. La FAQ officielle écrit : « There are no tuition fees at AIMS » et « No registration fees are required for the candidates selected for the Master's degree ». FAQ non datée ; dernier appel publié : 2025-2026. Montant zéro porté en USD pour que la bande « gratuit » s'applique.",
        "master": {
          "montant": 0,
          "devise": "USD",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "systematique",
        "detail": "Tous les candidats retenus au master structuré d'AIMS reçoivent automatiquement une bourse complète. La candidature se fait directement auprès d'AIMS, sur la plateforme du master, et non auprès d'une ambassade. La formation est résidentielle : le logement sur le campus fait partie du programme. AIMS Rwanda accueille aussi le programme Mastercard Foundation Scholars.",
        "source": "https://aims.ac.rw/structured-masters-program/",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Frais de scolarité officiels trouvés pour une université qui n'en affichait pas (demande de Charles du 2026-09-22). Montant, devise, source et date de vérification ; le détail et les choix de montant sont dans la note. Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "aix-marseille-universite-marseille",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Nouvel entrant : droits différenciés payés en totalité, puis exonération partielle de 75 % possible sur dossier, dans la limite du quota réglementaire.",
        "source": "https://www.univ-amu.fr/en/international-students/international-students-degree-programs/differential-tuition-fees-for-european-union-students",
        "verifieLe": "2026-09-07"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Si vous êtes nouvel étudiant, vous payez d'abord la totalité des droits différenciés. Ensuite, vous pouvez demander une exonération partielle de 75 %, sur dossier. Le nombre d'exonérations est limité par un quota officiel.",
        "source": "https://www.univ-amu.fr/en/international-students/international-students-degree-programs/differential-tuition-fees-for-european-union-students",
        "verifieLe": "2026-09-07"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "al-akhawayn-university-ifrane",
    "attendu": {
      "exoneration": {
        "politique": "inconnue",
        "detail": "L'université attribue des bourses (les remboursements de boursiers sont mentionnés dans le règlement), mais ni les critères ni la part des étudiants aidés ne sont publiés sur les pages de frais lues.",
        "source": "https://aui.ma/admission-aid/undergraduates/tuition-and-fees",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Les bourses de master d'Al Akhawayn sont en principe réservées aux Marocains. Quelques bourses au mérite peuvent être offertes aux candidats internationaux admis dans un master de l'École des sciences humaines et sociales, après sélection par le comité des bourses.",
        "source": "https://aui.ma/admission-aid/graduates/scholarships",
        "verifieLe": "2026-09-23"
      }
    },
    "motif": "Politique d'exonération recherchée sur la source officielle (demande de Charles du 2026-09-22 : améliorer les exonérations « inconnue ») ; citations clés recontrôlées dans le navigateur le 2026-09-23. Texte de l'infobulle écrit pour l'étudiant. Politique : inconnue -> possible_plafonnee."
  },
  {
    "collection": "universities",
    "id": "american-university-in-cairo-le-caire",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Deux dispositifs distincts, tous deux demandes directement aupres de l'AUC. En licence, l'Excellence Scholarship Program attribue des bourses au merite CUMULABLES, la couverture pouvant monter jusqu'a 100 % des frais selon le nombre de bourses obtenues. En cycle superieur, des fellowships tres competitifs, ouverts aux nouveaux etudiants comme aux etudiants en cours de cursus performants selon les fonds alloues, et une aide financiere sous forme de reduction PARTIELLE pour les etudiants demontrant un besoin. L'AUC propose aussi un paiement echelonne. Aucune exoneration automatique liee a la nationalite africaine.",
        "source": "https://www.aucegypt.edu/admissions/graduate/tuition-and-financial-support",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Deux aides, à demander directement à l'AUC. En licence, l'Excellence Scholarship Program donne des bourses au mérite qui se cumulent : jusqu'à 100 % des frais couverts selon le nombre de bourses obtenues. Après la licence : des bourses (fellowships) très compétitives, selon les fonds disponibles, et une réduction partielle si vous avez un besoin financier. Paiement en plusieurs fois possible. Aucune exonération automatique.",
        "source": "https://www.aucegypt.edu/admissions/graduate/tuition-and-financial-support",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "ashesi-university-berekuso",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Aide financière SUR BESOIN uniquement (aucune bourse au mérite en licence) : remplir le formulaire d'aide en indiquant le montant nécessaire. Ashesi accueille aussi les boursiers Mastercard Foundation.",
        "source": "https://ashesi.edu.gh/how-to-apply/",
        "verifieLe": "2026-09-12"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Ashesi accorde une aide financière selon les besoins uniquement : il n'y a pas de bourse au mérite en licence. Pour la demander, remplissez le formulaire d'aide financière en indiquant le montant dont vous avez besoin. Ashesi accueille aussi des boursiers de la Mastercard Foundation.",
        "source": "https://ashesi.edu.gh/how-to-apply/",
        "verifieLe": "2026-09-12"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "beihang-university-pekin",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Trois bourses sur dossier : bourse du gouvernement chinois (CSC, frais + logement + allocation), bourse du gouvernement de Pékin, bourse Beihang pour étudiants étrangers. Critères et montants sur la page des bourses de l'école internationale.",
        "source": "https://is.buaa.edu.cn/en/lxsq/yjs/ssyjs.htm",
        "verifieLe": "2026-09-12"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Trois bourses sont possibles, sur dossier : la bourse du gouvernement chinois (CSC), qui couvre les frais, le logement et une allocation ; la bourse du gouvernement de Pékin ; la bourse Beihang pour étudiants étrangers. Les critères et les montants sont sur la page des bourses de l'école internationale de Beihang.",
        "source": "https://is.buaa.edu.cn/en/lxsq/yjs/ssyjs.htm",
        "verifieLe": "2026-09-12"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "bilkent-university-ankara",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Bilkent attribue des bourses d'exemption partielle ou totale sur les résultats d'admission (les titulaires d'une bourse de 50 % paient la moitié) ; la page des internationaux n'en détaille pas les critères — à vérifier au moment de la candidature.",
        "source": "https://w3.bilkent.edu.tr/bilkent/tuition-fees/",
        "verifieLe": "2026-09-12"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Bilkent accorde des bourses qui exonèrent d'une partie ou de la totalité des frais, selon vos résultats d'admission. Par exemple, avec une bourse de 50 %, vous payez la moitié des frais. Les critères d'attribution ne sont pas publiés : renseignez-vous au moment de votre candidature.",
        "source": "https://w3.bilkent.edu.tr/bilkent/tuition-fees/",
        "verifieLe": "2026-09-12"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "bogazici-university-istanbul",
    "attendu": {
      "exoneration": {
        "politique": "aucune",
        "detail": "« Bogazici University does not offer scholarships or financial aid to international students » — dit par l'université elle-même. Les boursiers Türkiye Bursları y étudient en revanche sans payer, la bourse couvrant les frais.",
        "source": "https://intl.bogazici.edu.tr/tuition-undergraduate-and-graduate-degree-programs",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "aucune",
        "detail": "L'université indique qu'elle n'offre ni bourse ni aide financière aux étudiants internationaux. Seule exception : les boursiers Türkiye Bursları y étudient sans payer, car leur bourse couvre les frais.",
        "source": "https://intl.bogazici.edu.tr/tuition-undergraduate-and-graduate-degree-programs",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "budapest-university-of-technology-and-economics-budapest",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "La bourse Stipendium Hungaricum couvre la TOTALITE des droits plus une allocation mensuelle, le logement et l'assurance maladie, mais elle se demande aupres de l'autorite nationale du pays du candidat, pas aupres de l'universite. En propre, BME indique que les doctorants performants peuvent recevoir un soutien supplementaire via des contrats de recherche ; aucun bareme d'exoneration chiffre n'est publie.",
        "source": "https://www.bme.hu/en/application_and_admission",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "BME ne publie pas de barème chiffré d'exonération. La bourse Stipendium Hungaricum couvre la totalité des frais de scolarité, plus une allocation mensuelle, le logement et l'assurance maladie. Elle se demande auprès de l'autorité nationale de votre pays, pas auprès de l'université. Les doctorants performants peuvent aussi recevoir un soutien de l'université grâce à des contrats de recherche.",
        "source": "https://www.bme.hu/en/application_and_admission",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "carnegie-mellon-university-africa-kigali",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "CMU-Africa declare que TOUS ses etudiants sont eligibles a une aide financiere fondee sur le besoin, financee par le gouvernement du Rwanda et la Mastercard Foundation, et qu'une grande partie des etudiants recoit un paquet couvrant une fraction substantielle du cout de presence. Avant l'inscription, chaque etudiant recoit une lettre d'attribution precisant exactement sa contribution restante. Formes d'aide : subvention du gouvernement du Rwanda, bourse pour la Communaute d'Afrique de l'Est, pret du gouvernement du Rwanda, Mastercard Foundation Scholars Program, Innovators Forward Fellowship Fund, MINDS, Smart Africa Scholarship. La demande se fait aupres de CMU-Africa dans le dossier de candidature. Aucune exoneration garantie a 100 %.",
        "source": "https://www.africa.engineering.cmu.edu/admissions/tuition.html",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Tous les étudiants de CMU-Africa peuvent recevoir une aide selon leurs besoins, financée par le gouvernement du Rwanda et la Mastercard Foundation. Beaucoup reçoivent une aide qui couvre une grande partie du coût des études. Elle peut combiner subventions, bourses et prêt. La demande se fait dans le dossier de candidature. Avant l'inscription, une lettre vous indique ce qu'il vous reste à payer. Une exonération à 100 % n'est pas garantie.",
        "source": "https://www.africa.engineering.cmu.edu/admissions/tuition.html",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "corvinus-university-of-budapest-budapest",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "La bourse Stipendium Hungaricum couvre la TOTALITE des droits plus allocation, logement et assurance, mais elle se demande aupres de l'autorite nationale du pays du candidat. En propre, Corvinus offre aux autofinances une reduction de 10 % sur les droits de la premiere annee a qui reussit les examens d'entree avant fin fevrier et paie le premier semestre avant fin mars. Aucune exoneration totale accordee directement par l'universite.",
        "source": "https://www.uni-corvinus.hu/post/landing-page/application/fees-and-costs/?lang=en",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "La bourse Stipendium Hungaricum couvre tous les droits, plus une allocation, le logement et l'assurance. Elle se demande auprès de l'autorité nationale de votre pays. Si vous payez vous-même, Corvinus réduit de 10 % les droits de première année : il faut réussir l'examen d'entrée avant fin février et payer le premier semestre avant fin mars. Corvinus n'accorde pas d'exonération totale.",
        "source": "https://www.uni-corvinus.hu/post/landing-page/application/fees-and-costs/?lang=en",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "delft-university-of-technology-delft",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Aucune exoneration de droit pour les hors UE/EEE : le tarif institutionnel est la regle. TU Delft propose des bourses d'excellence sur dossier (Justus & Louise van Effen) et les etudiants peuvent postuler au programme Holland Scholarship ; rien d'automatique.",
        "source": "https://www.tudelft.nl/en/education/study-programme-orientation/practical-matters/tuition-fee-finances",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Pas d'exonération pour les étudiants hors UE/EEE : ils paient le tarif institutionnel. TU Delft propose des bourses d'excellence sur dossier (Justus & Louise van Effen). Vous pouvez aussi postuler à la Holland Scholarship. Rien n'est automatique.",
        "source": "https://www.tudelft.nl/en/education/study-programme-orientation/practical-matters/tuition-fee-finances",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "ecole-normale-superieure-de-lyon-lyon",
    "attendu": {
      "exoneration": {
        "politique": "inconnue",
        "detail": "Boursiers CROUS exonérés ; commission pour situations financières difficiles. Aucune politique propre aux extracommunautaires lue sur la page.",
        "source": "https://www.ens-lyon.fr/formation/inscription-scolarite/inscription-et-reinscription-lens-de-lyon/droits-dinscription",
        "verifieLe": "2026-09-07"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "En cas de situation financière difficile attestée, vous pouvez demander une exonération totale ou partielle des droits. Si votre foyer fiscal est hors de France, la commission étudie votre dossier. Elle se réunit plusieurs fois par an. Les droits restent à payer en attendant la décision ; ils sont remboursés en cas d'exonération totale.",
        "source": "https://www.ens-lyon.fr/formation/inscription-scolarite/inscription-et-reinscription-lens-de-lyon/demande-dexoneration-des",
        "verifieLe": "2026-09-23"
      }
    },
    "motif": "Politique d'exonération recherchée sur la source officielle (demande de Charles du 2026-09-22 : améliorer les exonérations « inconnue ») ; citations clés recontrôlées dans le navigateur le 2026-09-23. Texte de l'infobulle écrit pour l'étudiant. Politique : inconnue -> possible_plafonnee."
  },
  {
    "collection": "universities",
    "id": "ecole-normale-superieure-psl-paris",
    "attendu": {
      "exoneration": {
        "politique": "systematique",
        "detail": "Le tableau des criteres vote pour 2026-2027 accorde aux ressortissants extracommunautaires inscrits en master une exoneration partielle au titre des orientations strategiques de l'ecole, SANS avis de la commission et sur simple presentation d'un passeport valide. Exonerations TOTALES pour les boursiers CROUS, pupilles de la Nation et de la Republique, normaliens preparant l'agregation et etudiants inscrits au titre d'un accord international de l'ecole. Exonerations totales ou partielles sur examen pour refugies, beneficiaires de la protection subsidiaire, demandeurs d'emploi, grande difficulte financiere et beneficiaires de l'AAH.",
        "source": "https://www.ens.psl.eu/sites/default/files/deliberation_ndeg2026-06_portant_approbation_des_criteres_et_de_la_procedure_dexoneration_des_droits_dinscription_pour_lannee_2026-2027.pdf",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "systematique",
        "detail": "En 2026-2027, en master, les étudiants hors UE ont une exonération partielle sur simple présentation d'un passeport valide. Exonération totale : boursiers du CROUS, pupilles de la Nation ou de la République, normaliens préparant l'agrégation, inscrits via un accord international de l'école. Réfugiés, protection subsidiaire, demandeurs d'emploi, AAH ou grande difficulté financière : totale ou partielle, sur examen.",
        "source": "https://www.ens.psl.eu/sites/default/files/deliberation_ndeg2026-06_portant_approbation_des_criteres_et_de_la_procedure_dexoneration_des_droits_dinscription_pour_lannee_2026-2027.pdf",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "ecole-polytechnique-palaiseau",
    "attendu": {
      "exoneration": {
        "politique": "inconnue",
        "detail": "Établissement à frais propres : bourses limitées qui « ne couvrent généralement pas l'intégralité des frais ». Aucune exonération au sens du décret lue.",
        "source": "https://programmes.polytechnique.edu/en/master/admissions-msct/tuition-fees",
        "verifieLe": "2026-09-07"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Tous les admis en MSc&T sont examinés d'office pour les bourses de la Fondation de l'X, au mérite et sans dossier séparé : 8 000 € par an, déduits des frais de scolarité, après validation de la première année. Les candidats des deux premières vagues sont prioritaires pour les aides.",
        "source": "https://programmes.polytechnique.edu/en/master/admissions-msct/scholarships-and-financial-aid",
        "verifieLe": "2026-09-23"
      }
    },
    "motif": "Politique d'exonération recherchée sur la source officielle (demande de Charles du 2026-09-22 : améliorer les exonérations « inconnue ») ; citations clés recontrôlées dans le navigateur le 2026-09-23. Texte de l'infobulle écrit pour l'étudiant. Politique : inconnue -> possible_plafonnee."
  },
  {
    "collection": "universities",
    "id": "eotvos-lorand-university-budapest",
    "attendu": {
      "exoneration": {
        "politique": "inconnue",
        "detail": "La bourse Stipendium Hungaricum couvre la TOTALITE des droits plus allocation, logement et assurance, mais elle se demande aupres de l'autorite nationale du pays du candidat. Cote ELTE, la page centrale rappelle seulement que les etudiants internationaux financent en principe eux-memes leurs etudes. Aucun dispositif d'exoneration propre a ELTE pour les nouveaux entrants n'a pu etre verifie.",
        "source": "https://www.elte.hu/en/student-finances",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "inconnue",
        "detail": "ELTE ne publie pas de bourse d'entrée propre : visez le Stipendium Hungaricum, qui couvre les droits. Une fois inscrit, à la faculté des lettres, le doyen peut accorder une réduction des frais, notamment pour raisons sociales, sur demande dans Neptun avant la fin de la deuxième semaine du semestre.",
        "source": "https://www.btk.elte.hu/en/finances-faq",
        "verifieLe": "2026-09-23"
      }
    },
    "motif": "Politique d'exonération recherchée sur la source officielle (demande de Charles du 2026-09-22 : améliorer les exonérations « inconnue ») ; citations clés recontrôlées dans le navigateur le 2026-09-23. Texte de l'infobulle écrit pour l'étudiant. Politique : inconnue -> inconnue."
  },
  {
    "collection": "universities",
    "id": "epfl-lausanne",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Une allocation transitoire de 1 460 CHF/semestre (le montant de la hausse) existe, mais seulement pour un étudiant ayant fait son bachelor à l'EPFL et passant en master, sur critères socio-économiques. Un nouvel entrant venu de l'étranger n'y a pas droit ; il reste les bourses d'excellence master de l'EPFL, sélectives.",
        "source": "https://epfl.ch/education/studies/en/transitional-allowance",
        "verifieLe": "2026-09-12"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Une allocation transitoire de 1 460 CHF par semestre, égale à la hausse des frais, existe seulement pour les étudiants qui ont fait leur bachelor à l'EPFL et passent en master, selon des critères socio-économiques. Si vous arrivez de l'étranger, vous n'y avez pas droit. Vous pouvez viser les bourses d'excellence de master de l'EPFL, qui sont sélectives.",
        "source": "https://epfl.ch/education/studies/en/transitional-allowance",
        "verifieLe": "2026-09-12"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "essec-business-school-cergy",
    "attendu": {
      "fraisScolarite": undefined,
      "exoneration": {
        "politique": "inconnue",
        "detail": "ESSEC applique des tarifs differencies entre ressortissants de l'Union europeenne et hors Union europeenne : un etudiant hors UE qui souhaite beneficier du tarif UE doit fournir un passeport europeen avant le 1er septembre de l'annee scolaire. Aucun bareme ni dispositif de bourse n'est publie sur le domaine officiel ; le montant du forfait est communique individuellement dans le contrat d'enseignement signe a l'admission.",
        "source": "https://ernest.essec.edu/en/support/solutions/articles/7000082032-differentiated-tuition-fees-based-on-eu-and-non-eu",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "fraisScolarite": {
        "source": "https://www.essec.edu/en/program/master-in-management-international/",
        "verifieLe": "2026-09-23",
        "note": "Master in Management, filière pour diplômés internationaux, rentrée 2026, parcours flexible (2 à 3 ans) : 25 300 € de scolarité par an pour un étudiant hors Union européenne, plus 2 000 € de droits d'inscription par an, soit 27 300 € par an. S'ajoutent des frais de service de 2 640 € une seule fois. Parcours intensif d'un an : 38 000 € plus 2 000 €. Acompte de 6 000 € à l'admission, déduit des frais. Doctorat non repris : ESSEC n'admet aucun doctorant sans financement et propose l'exonération des frais.",
        "master": {
          "montant": 27300,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "ESSEC attribue une bourse au mérite de 10 000 € aux meilleurs candidats internationaux du Master in Management, pendant la procédure d'admission, sans demande séparée. Les boursiers du CROUS peuvent obtenir une exonération partielle des frais.",
        "source": "https://www.essec.edu/en/program/business-school/master-management-grande-ecole/financing/",
        "verifieLe": "2026-09-23"
      }
    },
    "motif": "Frais de scolarité officiels trouvés pour une université qui n'en affichait pas (demande de Charles du 2026-09-22). Montant, devise, source et date de vérification ; le détail et les choix de montant sont dans la note. Politique d'exonération recherchée sur la source officielle (demande de Charles du 2026-09-22 : améliorer les exonérations « inconnue ») ; citations clés recontrôlées dans le navigateur le 2026-09-23. Texte de l'infobulle écrit pour l'étudiant. Politique : inconnue -> possible_plafonnee."
  },
  {
    "collection": "universities",
    "id": "eth-zurich-zurich",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Pas d'exonération automatique pour le groupe 2. Le programme d'excellence ESOP (master) couvre frais et vie sur mérite, très sélectif ; des réductions sur situation financière existent au cas par cas via le service des bourses.",
        "source": "https://ethz.ch/students/en/studies/financial/tuition-fees.html",
        "verifieLe": "2026-09-12"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Pour les étudiants du groupe 2, aucune exonération n'est automatique. En master, le programme d'excellence ESOP couvre les frais et le coût de la vie, sur mérite ; il est très sélectif. Selon votre situation financière, le service des bourses peut accorder une réduction, au cas par cas.",
        "source": "https://ethz.ch/students/en/studies/financial/tuition-fees.html",
        "verifieLe": "2026-09-12"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "fudan-university-shanghai",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Bourses sur dossier : bourse du gouvernement chinois (CSC), bourse du gouvernement de Shanghai, bourses Fudan — page « Scholarships » de l'ISO.",
        "source": "https://iso.fudan.edu.cn/isoenglish/main.htm",
        "verifieLe": "2026-09-12"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Bourses sur dossier : bourse du gouvernement chinois (CSC), bourse du gouvernement de Shanghai et bourses de l'université Fudan. La liste se trouve sur la page « Scholarships » du bureau des étudiants internationaux (ISO).",
        "source": "https://iso.fudan.edu.cn/isoenglish/main.htm",
        "verifieLe": "2026-09-12"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "ghent-university-gand",
    "attendu": {
      "exoneration": {
        "politique": "systematique",
        "detail": "La page officielle enumere les categories de hors EEE qui paient le tarif EEE (1 181,40 EUR/an, 591 EUR en doctorat) : titre de sejour electronique, demandeurs de protection internationale, boursiers VLIR-UOS, et etudiant « d'un pays en developpement reconnu par l'OCDE/CAD, deux categories les plus basses ». Cette derniere s'applique sur le seul pays d'origine, sans dossier a constituer. RESERVE : l'UGent ne publie pas de liste nominative de ces pays hors de la faculte des sciences politiques et sociales ; l'appartenance du Senegal aux deux categories les plus basses de la liste CAD doit etre confirmee par studiegeld@ugent.be avant d'annoncer le tarif reduit.",
        "source": "https://www.ugent.be/student/en/administration/tuition/tuition-fee-master-programme-not-advanced-and-masters-programme-in-teaching.htm/tuitionmasterteacher20262027.htm",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "systematique",
        "detail": "Certains étudiants hors EEE paient le tarif EEE : 1 181,40 € par an, 591 € en doctorat. Sont concernés : titre de séjour électronique, demande de protection internationale, bourse VLIR-UOS, ou pays d'origine en développement classé dans les deux catégories les plus basses de la liste CAD de l'OCDE. Ce dernier cas ne demande aucun dossier. L'UGent ne publie pas la liste : confirmez votre pays auprès de studiegeld@ugent.be.",
        "source": "https://www.ugent.be/student/en/administration/tuition/tuition-fee-master-programme-not-advanced-and-masters-programme-in-teaching.htm/tuitionmasterteacher20262027.htm",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "harbin-institute-of-technology-harbin",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Deux voies NON CUMULABLES — postuler aux deux entraine l'annulation de la candidature. 1) Bourse du gouvernement chinois : type A via l'ambassade ou le consulat de Chine en indiquant HIT en premier voeu, couvrant scolarite, logement, frais de vie et assurance ; type B en selection autonome par l'universite, date limite 20 fevrier 2026. 2) Bourse HIT, a demander avant le 15 juillet 2026 en licence et le 31 mai 2026 en master et doctorat, avec quatre niveaux : prix special = exoneration TOTALE, 1er prix = 50 % de reduction, 2e prix = 30 %, 3e prix = 20 %. Limite d'age abaissee pour les boursiers : 25 ans en licence, 30 en master, 35 en doctorat.",
        "source": "https://cie.hit.edu.cn/18283/list.htm",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Deux voies, non cumulables sous peine d'annulation. 1) Bourse du gouvernement chinois (scolarité, logement, frais de vie, assurance) : type A par l'ambassade ou le consulat de Chine, HIT en premier choix ; type B, sélection par HIT avant le 20 février 2026. 2) Bourse HIT (100, 50, 30 ou 20 % des frais) : avant le 15 juillet 2026 en licence, le 31 mai 2026 en master et doctorat. Boursiers : 25 ans maximum en licence, 30 en master, 35 en doctorat.",
        "source": "https://cie.hit.edu.cn/18283/list.htm",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "hec-paris-jouy-en-josas",
    "attendu": {
      "exoneration": {
        "politique": "inconnue",
        "detail": "Établissement à frais propres : bourses au mérite et sur critères sociaux, au cas par cas. Aucune exonération au sens du décret lue.",
        "source": "https://www.hec.edu/en/master-s-programs/master-management/fees-and-financing",
        "verifieLe": "2026-09-07"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Toutes les bourses HEC prennent la forme d'une réduction des frais de scolarité. Avec un diplôme non français, votre candidature est examinée d'office pour la bourse d'excellence. Sur critères sociaux, la bourse Needs-Based couvre jusqu'à 35 % des frais : remplissez le formulaire dans votre espace candidat.",
        "source": "https://www.hec.edu/en/hec-paris-scholarships",
        "verifieLe": "2026-09-23"
      }
    },
    "motif": "Politique d'exonération recherchée sur la source officielle (demande de Charles du 2026-09-22 : améliorer les exonérations « inconnue ») ; citations clés recontrôlées dans le navigateur le 2026-09-23. Texte de l'infobulle écrit pour l'étudiant. Politique : inconnue -> possible_plafonnee."
  },
  {
    "collection": "universities",
    "id": "hse-university-moscow",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Places financees par l'Etat russe via le quota gouvernemental (Open Doors, Rossotroudnitchestvo) : scolarite entierement prise en charge, sur concours. HSE accorde aussi des reductions de 25, 50 ou 70 % sur les droits aux candidats internationaux les mieux classes. Rien d'automatique pour un candidat autofinance.",
        "source": "https://admissions.hse.ru/en/graduate-apply/fees/",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "L'État russe finance des places par le quota gouvernemental (Open Doors, Rossotroudnitchestvo) : la scolarité est entièrement prise en charge, sur concours. HSE accorde aussi des réductions de 25, 50 ou 70 % sur les droits aux candidats internationaux les mieux classés. Rien n'est automatique si vous financez vous-même vos études.",
        "source": "https://admissions.hse.ru/en/graduate-apply/fees/",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "humboldt-universitat-zu-berlin-berlin",
    "attendu": {
      "exoneration": {
        "politique": "systematique",
        "detail": "Il n'y a pas de droits de scolarite a Berlin : la loi du Land les supprime pour tous les etudiants, y compris hors Union europeenne, sans aucune demande a deposer. La contribution de semestre, elle, est due par tout le monde et n'est pas exoneree ; les etudiants en difficulte peuvent demander une prise en charge du Semesterticket aupres du fonds social (Semtix) gere par le RefRat.",
        "source": "https://www.hu-berlin.de/fileadmin/Dokumentenpool/Studium/Sonstiges/Semesterbeitraege_und_gebuehren_2026_WiSe.pdf",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "systematique",
        "detail": "Pas de frais de scolarité à Berlin : la loi du Land les supprime pour tous les étudiants, y compris hors Union européenne. Aucune demande à faire. La contribution de semestre reste due par tous. Si vous avez des difficultés financières, vous pouvez demander la prise en charge du Semesterticket (abonnement de transport) au fonds social Semtix, géré par le RefRat.",
        "source": "https://www.hu-berlin.de/fileadmin/Dokumentenpool/Studium/Sonstiges/Semesterbeitraege_und_gebuehren_2026_WiSe.pdf",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "hungarian-university-of-agriculture-and-life-sciences-godollo",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "MATE est l'etablissement le plus explicite de Hongrie : sa grille indique programme par programme les bourses accessibles — Stipendium Hungaricum (presque tous les programmes), Scholarship for Christian Young People et Hungarian Diaspora Scholarship. ATTENTION : la colonne precise que les candidatures a ces bourses sont CLOSES pour 2026-2027 ; seule la voie autofinancee reste ouverte. La bourse Stipendium Hungaricum couvre la totalite des droits plus allocation, logement et assurance, et se demande aupres de l'autorite nationale du pays du candidat.",
        "source": "https://ed.uni-mate.hu/tuition-fees",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Pour 2026-2027, les candidatures aux bourses sont closes : seule l'inscription autofinancée reste ouverte. Selon les programmes, MATE propose le Stipendium Hungaricum (presque tous les programmes), la Scholarship for Christian Young People et la Hungarian Diaspora Scholarship. Le Stipendium Hungaricum couvre tous les frais, plus une allocation, le logement et l'assurance. Il se demande auprès de l'autorité nationale de votre pays.",
        "source": "https://ed.uni-mate.hu/tuition-fees",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "icipe-nairobi",
    "attendu": {
      "exoneration": {
        "politique": "systematique",
        "detail": "Le centre ne recrute qu'en bourse. La bourse ARPPIS-DAAD couvre l'integralite du programme doctoral sur 3 ans : voyage, frais de vie, assurance medicale, droits universitaires verses a l'universite partenaire qui delivre le diplome, et tous les frais de recherche et de formation. La candidature se fait aupres d'icipe et du DAAD, pas aupres d'une universite.",
        "source": "https://www.icipe.org/capacity-building/arppis",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "systematique",
        "detail": "Le centre icipe n'accueille que des étudiants boursiers. La bourse ARPPIS-DAAD couvre tout le doctorat pendant 3 ans : voyage, frais de vie, assurance médicale, droits d'inscription payés à l'université partenaire qui délivre le diplôme, et tous les frais de recherche et de formation. La candidature se fait auprès d'icipe et du DAAD, et non auprès d'une université.",
        "source": "https://www.icipe.org/capacity-building/arppis",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "iheid-geneve",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Aides financières combinant bourse de subsistance, réduction des frais et emploi sur le campus, attribuées sur besoin ET mérite pour les masters, sur mérite pour le doctorat (6 financements doctoraux complets par département et par an). Bourses spécifiques pour les étudiants du Sud global. La part d'étudiants aidés n'est pas publiée.",
        "source": "https://www.graduateinstitute.ch/tuition-fees-financial-aid-packages",
        "verifieLe": "2026-09-12"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "L'Institut propose des aides qui combinent bourse pour les frais de vie, réduction des frais et emploi sur le campus. En master, elles dépendent de vos besoins et de votre mérite. En doctorat, du mérite seulement : 6 financements complets par département et par an. Des bourses spécifiques existent pour les étudiants du Sud global. La part d'étudiants aidés n'est pas publiée.",
        "source": "https://www.graduateinstitute.ch/tuition-fees-financial-aid-packages",
        "verifieLe": "2026-09-12"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "imperial-college-london-london",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Pas d'exonération sur dossier. Bourses au mérite : President's PhD Scholarships (doctorat, complètes), programmes partenaires (GREAT, DAAD, Women in STEM…) ; moteur de recherche de bourses sur le site.",
        "source": "https://www.imperial.ac.uk/study/fees-and-funding/tuition-fees/",
        "verifieLe": "2026-09-12"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Pas d'exonération sur dossier. Il existe des bourses au mérite : les President's PhD Scholarships (doctorat, bourses complètes) et des programmes partenaires (GREAT, DAAD, Women in STEM, etc.). Un moteur de recherche des bourses est disponible sur le site d'Imperial.",
        "source": "https://www.imperial.ac.uk/study/fees-and-funding/tuition-fees/",
        "verifieLe": "2026-09-12"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "insa-lyon-villeurbanne",
    "attendu": {
      "exoneration": {
        "politique": "inconnue",
        "detail": "La page officielle se borne a rappeler que la loi soumet les extracommunautaires aux droits differencies et renvoie a Campus France ; aucune politique d'exoneration propre a l'INSA Lyon n'y est publiee. Le cadre national s'applique : exoneration de plein droit pour les boursiers du gouvernement francais et les accords avec reciprocite, exonerations individuelles plafonnees a 30 % des inscrits hors UE en 2026-2027. A confirmer aupres du service scolarite.",
        "source": "https://www.insa-lyon.fr/fr/cout-etudes",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Élève étranger sans bourse du CROUS ni autre bourse : vous pouvez obtenir, sur critères sociaux, une exonération partielle des droits différenciés, parfois complétée d'une bourse de 2 500 € par an au plus. Règles publiées pour 2025-2026.",
        "source": "https://bourses-aides.insa-lyon.fr/fr/page/bourses-etou-exoneration-partielle-droits-dinscription-sur-criteres-sociaux",
        "verifieLe": "2026-09-23"
      }
    },
    "motif": "Politique d'exonération recherchée sur la source officielle (demande de Charles du 2026-09-22 : améliorer les exonérations « inconnue ») ; citations clés recontrôlées dans le navigateur le 2026-09-23. Texte de l'infobulle écrit pour l'étudiant. Politique : inconnue -> possible_plafonnee."
  },
  {
    "collection": "universities",
    "id": "istanbul-technical-university-istanbul",
    "attendu": {
      "exoneration": {
        "politique": "inconnue",
        "detail": "Aucune exonération mentionnée sur la grille ; les boursiers Türkiye Bursları sont pris en charge par la bourse.",
        "source": "https://www.sis.itu.edu.tr/EN/student/intenational-students/tuitions.php",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "inconnue",
        "detail": "L'ITU mentionne une réduction des frais pour certains étudiants internationaux, sans en publier les critères. L'ITU cite deux cas : 25 % de réduction dans certaines situations familiales, et exonération des boursiers dont la bourse couvre les frais, comme Türkiye Bursları.",
        "source": "https://www.sis.itu.edu.tr/EN/student/tuition-fee/tuition-fee.php",
        "verifieLe": "2026-09-23"
      }
    },
    "motif": "Politique d'exonération recherchée sur la source officielle (demande de Charles du 2026-09-22 : améliorer les exonérations « inconnue ») ; citations clés recontrôlées dans le navigateur le 2026-09-23. Texte de l'infobulle écrit pour l'étudiant. Politique : inconnue -> inconnue."
  },
  {
    "collection": "universities",
    "id": "istanbul-university-istanbul",
    "attendu": {
      "exoneration": {
        "politique": "inconnue",
        "detail": "Aucune politique de bourse propre a l'universite n'a pu etre lue : la page du bureau international redirige vers l'accueil. Le seul allegement ecrit dans le PDF officiel est une remise de 25 % pour fratrie, quand plusieurs enfants d'une meme famille sont inscrits dans un etablissement superieur public turc. S'agissant d'une universite d'Etat, ses etudiants internationaux passent normalement par le programme national Turkiye Burslari, mais cela n'a pas ete verifie sur le site de l'universite et ne doit pas etre presente comme acquis.",
        "source": "https://cdn.istanbul.edu.tr/FileHandler2.ashx?f=tuition-fees-2024-2025.pdf",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "aucune",
        "detail": "L'université d'Istanbul indique n'avoir aucune bourse pour les étudiants internationaux. Visez les bourses de l'État turc, Türkiye Bursları, et pour les étudiants en théologie, la bourse de la fondation Diyanet (TDV).",
        "source": "https://iso.istanbul.edu.tr/en/content/services/scholarships",
        "verifieLe": "2026-09-23"
      }
    },
    "motif": "Politique d'exonération recherchée sur la source officielle (demande de Charles du 2026-09-22 : améliorer les exonérations « inconnue ») ; citations clés recontrôlées dans le navigateur le 2026-09-23. Texte de l'infobulle écrit pour l'étudiant. Politique : inconnue -> aucune."
  },
  {
    "collection": "universities",
    "id": "jagiellonian-university-cracovie",
    "attendu": {
      "exoneration": {
        "politique": "aucune",
        "detail": "La page officielle des frais pour etrangers est categorique : la longue liste d'exemptions (citoyens de l'UE, de l'EEE et de Suisse, titulaires de la Carte de Polonais ou d'une decision confirmant l'origine polonaise, residents permanents, residents longue duree de l'UE, refugies, conjoints et descendants de citoyens polonais, titulaires d'un certificat de polonais de niveau C1) ne vaut QUE pour les etudes a temps plein EN POLONAIS. Elle exclut explicitement les etudes en langue etrangere, c'est-a-dire tous les programmes anglophones vises ici — la seule exception etant les boursiers NAWA. Un etudiant senegalais autofinance inscrit en anglais paie donc le plein tarif. Les bourses NAWA sont la seule porte de sortie, et elles passent par l'agence nationale, pas par l'universite.",
        "source": "https://welcome.uj.edu.pl/en_GB/admission/fees",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "aucune",
        "detail": "Les exemptions de frais valent seulement pour les études à temps plein en polonais : citoyens de l'UE, de l'EEE et de Suisse, titulaires de la Carte du Polonais, résidents permanents, réfugiés, certificat de polonais niveau C1, etc. Dans un programme en anglais, vous payez le plein tarif, sauf si vous êtes boursier NAWA. Cette bourse se demande auprès de l'agence nationale NAWA, pas auprès de l'université.",
        "source": "https://welcome.uj.edu.pl/en_GB/admission/fees",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "jawaharlal-nehru-university-delhi",
    "attendu": {
      "exoneration": {
        "politique": "inconnue",
        "detail": "La page des frais ne mentionne aucune exoneration. Les etudiants africains passent le plus souvent par les bourses ICCR du gouvernement indien, mais aucune page officielle de l'universite ne le confirme, donc cela n'est pas affirme ici.",
        "source": "https://www.jnu.ac.in/isa-feestructure",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "inconnue",
        "detail": "JNU ne publie ni bourse ni exonération pour les étudiants étrangers, admis comme autofinancés. La voie documentée est la bourse ICCR du gouvernement indien, à demander à l'ICCR et non à JNU.",
        "source": "https://www.jnu.ac.in/sites/default/files/admission/AdmissionPolicy2026-27.pdf",
        "verifieLe": "2026-09-23"
      }
    },
    "motif": "Politique d'exonération recherchée sur la source officielle (demande de Charles du 2026-09-22 : améliorer les exonérations « inconnue ») ; citations clés recontrôlées dans le navigateur le 2026-09-23. Texte de l'infobulle écrit pour l'étudiant. Politique : inconnue -> inconnue."
  },
  {
    "collection": "universities",
    "id": "jkuat-juja",
    "attendu": {
      "exoneration": {
        "politique": "inconnue",
        "detail": "Aucune page de bourses ou d'exoneration n'a ete lue. La seule regle tarifaire officielle trouvee va dans le sens contraire : les etudiants internationaux paient 20 % de plus que les Kenyans sur tous les postes de la grille, en licence comme en master et en doctorat.",
        "source": "https://www.jkuat.ac.ke/school/sobee/?page_id=17311",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "inconnue",
        "detail": "Aucune information sur une bourse ou une exonération n'est disponible pour JKUAT. Seule règle connue : les étudiants internationaux paient 20 % de plus que les étudiants kényans sur tous les frais, en licence, en master et en doctorat. Renseignez-vous directement auprès de l'université.",
        "source": "https://www.jkuat.ac.ke/school/sobee/?page_id=17311",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "kaist-daejeon",
    "attendu": {
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
    "champs": {
      "fraisScolarite": {
        "source": "https://ee.kaist.ac.kr/en/admission-08/",
        "verifieLe": "2026-09-23",
        "note": "Master et doctorat : 9 559 000 ₩ par semestre, soit 19 118 000 ₩ par an (barème 2026 publié par le département de génie électrique). Le budget officiel des étudiants internationaux de KAIST (https://admission.kaist.ac.kr/intl-graduate/FinancialSupport/CostofAttendance, année 2023) donne le même montant : « Tuition 19,118,000 ». Dans les faits, la bourse KAIST couvre la totalité des frais pour 94 % des étudiants internationaux. Licence hors catalogue.",
        "master": {
          "montant": 19118000,
          "devise": "KRW",
          "periode": "an"
        },
        "doctorat": {
          "montant": 19118000,
          "devise": "KRW",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "systematique",
        "detail": "La bourse KAIST couvre la totalité des frais de scolarité et verse une allocation. Elle profite à 94 % des étudiants internationaux. Cochez l'option bourse KAIST dans votre candidature : votre dossier est alors examiné d'office pour les bourses KGPS (master) et KPS (doctorat).",
        "source": "https://admission.kaist.ac.kr/intl-graduate/FinancialSupport/Scholarship/KAISTScholarship",
        "verifieLe": "2026-09-23"
      }
    },
    "motif": "Frais de scolarité officiels trouvés pour une université qui n'en affichait pas (demande de Charles du 2026-09-22). Montant, devise, source et date de vérification ; le détail et les choix de montant sont dans la note. Politique d'exonération recherchée sur la source officielle (demande de Charles du 2026-09-22 : améliorer les exonérations « inconnue ») ; citations clés recontrôlées dans le navigateur le 2026-09-23. Texte de l'infobulle écrit pour l'étudiant. Politique : systematique -> systematique."
  },
  {
    "collection": "universities",
    "id": "king-abdulaziz-university-jeddah",
    "attendu": {
      "exoneration": {
        "politique": "systematique",
        "detail": "L'Etat saoudien prend en charge la scolarite des etudiants internationaux admis : etudes gratuites, sans frais de scolarite. Le ministere distingue trois types de bourses en universite publique : bourse gratuite avec avantages complets ; bourse partielle (place d'etudes seule, ou place plus logement) ; et places payantes. La categorie exacte depend du conseil de l'etablissement. Candidature via les universites elles-memes, via l'attache culturel saoudien du pays d'origine ou, a defaut, l'ambassade ; plateforme d'Etat « Study in Saudi ». Base juridique : resolution du Conseil des ministres n° 94 du 29/03/1431 H.",
        "source": "https://www.moe.gov.sa/en/education/ResidentsAndvisitors/Pages/PublicUniversitiesScholarships.aspx",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "systematique",
        "detail": "L'État saoudien paie la scolarité des étudiants internationaux admis : les études sont gratuites. Trois types de places existent : bourse complète avec tous les avantages, bourse partielle (études seules, ou études et logement) et places payantes. Le conseil de l'université fixe votre catégorie. Candidature auprès de l'université ou de l'attaché culturel saoudien de votre pays (sinon l'ambassade). Plateforme officielle : « Study in Saudi ».",
        "source": "https://www.moe.gov.sa/en/education/ResidentsAndvisitors/Pages/PublicUniversitiesScholarships.aspx",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "king-saud-university-riyad",
    "attendu": {
      "exoneration": {
        "politique": "systematique",
        "detail": "Deux dispositifs cumules. Regime national : les universites publiques saoudiennes accueillent les etudiants internationaux admis sans frais de scolarite, avec logement, allocation et avantages associes (resolution du Conseil des ministres n° 94), candidature via la plateforme d'Etat « Study in Saudi » ou l'attache culturel saoudien. Propre a l'universite, au doctorat : la KSU Initiative couvre la totalite de la scolarite, verse 54 000 SAR par an d'allocation de vie et fournit le logement sur le campus pendant 3 ans.",
        "source": "https://dgsinitiative.ksu.edu.sa/",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "systematique",
        "detail": "Deux aides qui se cumulent. Dans les universités publiques saoudiennes, les étudiants internationaux admis ne paient pas de frais de scolarité et reçoivent logement, allocation et autres avantages. Candidature sur la plateforme « Study in Saudi » ou auprès de l'attaché culturel saoudien. En doctorat, la KSU Initiative paie toute la scolarité, verse 54 000 SAR par an pour vivre et offre un logement sur le campus pendant 3 ans.",
        "source": "https://dgsinitiative.ksu.edu.sa/",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "knust-kumasi",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "KNUST publie deux dispositifs internes destines aux etudiants brillants et sans moyens : la KNUST Bursary et la bourse du conseil des etudiants, toutes deux sur candidature directe aupres de l'universite. KNUST heberge par ailleurs un Mastercard Foundation Scholars Program avec son propre portail, reference sur le site de l'universite. Un bureau des services financiers aux etudiants est dedie aux bourses. Rien n'indique une exoneration automatique pour les internationaux, ni le montant ou le taux de couverture de ces bourses.",
        "source": "https://www.knust.edu.gh/students/scholarships-and-grants",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Aucune exonération automatique n'est annoncée pour les internationaux. KNUST propose deux aides aux étudiants brillants et sans moyens : la KNUST Bursary et la bourse du conseil des étudiants. Demandez-les directement à l'université (bureau des services financiers aux étudiants). Montant et couverture non publiés. La Mastercard Foundation a aussi un programme de bourses à KNUST, avec son propre portail.",
        "source": "https://www.knust.edu.gh/students/scholarships-and-grants",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "koc-university-istanbul",
    "attendu": {
      "exoneration": {
        "politique": "systematique",
        "detail": "INFORMATION DECISIVE POUR UN ETUDIANT AFRICAIN. En LICENCE, Koc evalue AUTOMATIQUEMENT tous les candidats internationaux pour une bourse au merite couvrant tout ou partie des frais, sans formulaire ni dossier separe ; la bourse est accordee pour toute la duree du cursus, sans condition de moyenne a maintenir. Il n'existe ni score ni moyenne garantissant la bourse, et la decision est sans recours. Attention : une bourse Koc exclut toute autre aide financee par l'universite (logement, livres, frais de vie). En MASTER AVEC THESE et en DOCTORAT, l'offre d'admission s'accompagne AUTOMATIQUEMENT d'une bourse pour les programmes eligibles des trois ecoles doctorales — d'ou les tarifs a zero — avec en general allocation mensuelle et logement. L'universite recommande fortement de deposer EN PLUS une candidature au programme national Turkiye Burslari (hors medecine et droit), qui couvre 100 % des frais et ajoute logement, allocation mensuelle et billet d'avion, avantages que les bourses propres de Koc n'offrent pas.",
        "source": "https://international.ku.edu.tr/undergraduate-programs/tuition-and-scholarships/",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "systematique",
        "detail": "En licence, chaque candidat international est évalué d'office pour une bourse au mérite, sans dossier. Elle couvre tout ou partie des frais sur tout le cursus, mais exclut les autres aides de Koç. En master avec thèse et doctorat, les admis des programmes éligibles ont une bourse, souvent avec allocation et logement. Koç conseille de demander aussi Türkiye Bursları : 100 % des frais, logement, allocation, billet d'avion (hors médecine et droit).",
        "source": "https://international.ku.edu.tr/undergraduate-programs/tuition-and-scholarships/",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "korea-national-university-of-arts-seoul",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "La page officielle chiffre l'effort de bourse : 61 % des etudiants en recoivent une, pour 4 162 beneficiaires et 5,99 milliards de wons distribues, soit une moyenne de 1 439 452 KRW par etudiant — environ 30 % des droits annuels. La couverture moyenne est donc PARTIELLE, pas integrale. Bourses internes : excellent resultat au concours d'entree, bon resultat au concours, performance academique, contribution au developpement de l'ecole, encouragement academique pour les etudiants en difficulte financiere, bourse familiale, service communautaire et travail-etudes. Pour un candidat africain, le dispositif le plus pertinent est le projet Art Major Asian Scholarship, dont la page officielle detaille les nationalites eligibles — a verifier au cas par cas avant d'orienter un etudiant, la page n'ayant pas ete ouverte.",
        "source": "https://www.karts.ac.kr/en/karts/finance.do",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "61 % des étudiants reçoivent une bourse, en moyenne 1 439 452 KRW, soit environ 30 % des droits annuels : l'aide est donc partielle. Bourses internes : concours d'entrée, résultats d'études, contribution à l'école, difficulté financière, bourse familiale, service communautaire, travail-études. Le programme Art Major Asian Scholarship est ouvert à certaines nationalités : vérifiez si la vôtre est éligible.",
        "source": "https://www.karts.ac.kr/en/karts/finance.do",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "korea-university-seoul",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Korea University attribue des bourses d'établissement aux internationaux (réductions partielles ou totales selon les résultats) ; le GKS et les bourses KOICA couvrent la totalité pour leurs boursiers. Critères non lus sur la page des frais.",
        "source": "https://graduate2.korea.ac.kr/admission/tuition.html",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Korea University accorde ses propres bourses aux étudiants internationaux : réduction partielle ou totale des frais, selon vos résultats. Les boursiers GKS et KOICA ont tous leurs frais couverts par leur bourse. Les critères exacts sont à vérifier auprès de l'université.",
        "source": "https://graduate2.korea.ac.kr/admission/tuition.html",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "kth-royal-institute-of-technology-stockholm",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Pas d'exoneration liee au pays. Les bourses propres de KTH sont ouvertes a TOUS les candidats soumis aux frais et couvrent les droits pour un ou deux ans, mais il faut candidater separement. La bourse de l'Institut suedois vise des pays cibles et couvre a la fois les droits et les frais de sejour. Dans les deux cas il s'agit d'un dossier a deposer, avec selection.",
        "source": "https://www.kth.se/en/studies/master/admissions/application-and-tuition-fees-for-master-s-studies-1.65817",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Il n'y a pas d'exonération liée au pays d'origine. Les bourses de KTH sont ouvertes à tous les candidats qui paient des frais et couvrent les frais de scolarité pour un ou deux ans, avec une candidature séparée. La bourse de l'Institut suédois vise certains pays et couvre les frais de scolarité et de séjour. Dans les deux cas, vous déposez un dossier et une sélection a lieu.",
        "source": "https://www.kth.se/en/studies/master/admissions/application-and-tuition-fees-for-master-s-studies-1.65817",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "ku-leuven-louvain",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Aucune exemption automatique sur la nationalite : le calculateur officiel applique le tarif hors EEE plein a un passeport senegalais. La page des frais renvoie a des bourses et des exonerations de droits pour lesquelles il faut deposer une candidature. Le doctorat echappe de fait a la surtaxe puisqu'il est facture au forfait (591 EUR), comme pour un ressortissant belge.",
        "source": "https://www.kuleuven.be/english/education/student/fees",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Aucune exemption automatique selon la nationalité : un étudiant hors EEE paie en principe le tarif plein hors EEE. Des bourses et des exonérations des droits existent, mais il faut déposer une candidature. En doctorat, pas de supplément : les frais sont forfaitaires (591 €), comme pour un étudiant belge.",
        "source": "https://www.kuleuven.be/english/education/student/fees",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "leibniz-universitat-hannover-hannover",
    "attendu": {
      "exoneration": {
        "politique": "systematique",
        "detail": "Aucun frais de scolarité à exonérer ; la contribution semestrielle est due par tous.",
        "source": "https://www.uni-hannover.de/studium/finanzierung-foerderung/studienkosten",
        "verifieLe": "2026-09-12"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "systematique",
        "detail": "Il n'y a pas de frais de scolarité, donc rien à exonérer. Tous les étudiants doivent payer la contribution semestrielle.",
        "source": "https://www.uni-hannover.de/studium/finanzierung-foerderung/studienkosten",
        "verifieLe": "2026-09-12"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "mcgill-university-montreal",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Pas d'exonération sur dossier pour les internationaux ; bourses d'entrée au mérite (Entrance Scholarships, de 3 000 $ à 12 000 $/an) et quelques bourses sur besoin, examinées à la candidature.",
        "source": "https://www.mcgill.ca/student-accounts/tuition-fees/general-tuition-and-fees-information/tuition-fees-2026-27",
        "verifieLe": "2026-09-12"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Pas d'exonération sur dossier pour les étudiants internationaux. McGill offre des bourses d'entrée au mérite (Entrance Scholarships), de 3 000 $ à 12 000 $ par an, et quelques bourses selon le besoin financier. Elles sont étudiées au moment de la candidature.",
        "source": "https://www.mcgill.ca/student-accounts/tuition-fees/general-tuition-and-fees-information/tuition-fees-2026-27",
        "verifieLe": "2026-09-12"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "mines-paris-psl-paris",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Exoneration TOTALE des frais pour les eleves boursiers de Mines Paris-PSL, de la Fondation Mines Paris, de Campus France (BGF, Eiffel), d'un gouvernement etranger, d'une autre fondation, ou en double diplome international ; justificatif a deposer sur la plateforme OASIS. Les eleves dont les parents ne declarent pas de revenus en France et sans bourse peuvent deposer une demande transmise a la Fondation Mines Paris, avec les baremes du CROUS, non cumulable, avant le 4 septembre 2026. Rien d'automatique pour les hors UE.",
        "source": "https://www.minesparis.psl.eu/formations/le-cycle-ingenieur-civil/admis-2026-%EF%BD%9Cinscriptions-a-mines-paris-psl/",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Hors UE, rien n'est automatique. Exonération totale pour les boursiers (Mines Paris-PSL, Fondation Mines Paris, Campus France BGF ou Eiffel, gouvernement étranger, autre fondation) et les doubles diplômes internationaux : déposez le justificatif sur OASIS. Sans bourse, si vos parents ne déclarent pas de revenus en France, demandez une aide à la Fondation Mines Paris (barèmes du CROUS, non cumulable) avant le 4 septembre 2026.",
        "source": "https://www.minesparis.psl.eu/formations/le-cycle-ingenieur-civil/admis-2026-%EF%BD%9Cinscriptions-a-mines-paris-psl/",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "nanjing-university-nanjing",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Bourse du gouvernement chinois (CSC) et bourses de l'universite pour internationaux, sur dossier. La visite medicale (Physical Examination Record) n'est exigee au depot que des candidats boursiers.",
        "source": "https://njunju.nju.edu.cn/EN/wpplicationwwnstructions_7082/list.htm",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Deux possibilités, sur dossier : la bourse du gouvernement chinois (CSC) et les bourses de l'université pour étudiants internationaux. Si vous demandez une bourse, joignez la fiche de visite médicale (Physical Examination Record) dès le dépôt du dossier.",
        "source": "https://njunju.nju.edu.cn/EN/wpplicationwwnstructions_7082/list.htm",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "nantes-universite-nantes",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Exonération individuelle sur demande après l'inscription, dans la limite de 30 % des inscrits en 2026-2027 ; mesures transitoires pour les étudiants déjà exonérés en 2025-2026.",
        "source": "https://www.univ-nantes.fr/formation/scolarite-inscriptions/droits-universitaires-situation",
        "verifieLe": "2026-09-07"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Après votre inscription, vous pouvez demander une exonération individuelle. En 2026-2027, elle est limitée à 30 % des inscrits. Des mesures de transition sont prévues pour les étudiants déjà exonérés en 2025-2026.",
        "source": "https://www.univ-nantes.fr/formation/scolarite-inscriptions/droits-universitaires-situation",
        "verifieLe": "2026-09-07"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "obuda-university-budapest",
    "attendu": {
      "exoneration": {
        "politique": "inconnue",
        "detail": "La bourse Stipendium Hungaricum couvre la TOTALITE des droits plus allocation, logement et assurance, mais elle se demande aupres de l'autorite nationale du pays du candidat. Sur sa page des droits, Obuda n'annonce AUCUNE bourse ni reduction propre : elle ne traite que des paiements obligatoires et de la politique de remboursement, avec des retenues de 15 a 20 %. Aucune page de bourses institutionnelles n'a ete trouvee.",
        "source": "https://uni-obuda.hu/tuition-fees/",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "inconnue",
        "detail": "Óbuda récompense par appel les meilleurs étudiants autofinancés des programmes en anglais, hors première et dernière année : réduction de 2 000, 1 000 ou 500 € sur un semestre. Le dernier appel trouvé date de février 2025. Pour entrer, visez le Stipendium Hungaricum.",
        "source": "https://uni-obuda.hu/student-excellence-award/",
        "verifieLe": "2026-09-23"
      }
    },
    "motif": "Politique d'exonération recherchée sur la source officielle (demande de Charles du 2026-09-22 : améliorer les exonérations « inconnue ») ; citations clés recontrôlées dans le navigateur le 2026-09-23. Texte de l'infobulle écrit pour l'étudiant. Politique : inconnue -> inconnue."
  },
  {
    "collection": "universities",
    "id": "peking-university-beijing",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Bourse du gouvernement chinois (CSC) : exoneration totale des droits, plus logement et allocation. Bourses de l'universite pour internationaux sur dossier. Aucune exoneration de droit pour un candidat autofinance ; la politique de remboursement est restrictive (10 % retenus en cas d'abandon, plus aucun remboursement passe deux mois de semestre).",
        "source": "https://isd.pku.edu.cn/en/campus_detail.php?id=700",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Bourse du gouvernement chinois (CSC) : frais de scolarité entièrement pris en charge, plus logement et allocation. L'université a aussi des bourses pour les étudiants internationaux, sur dossier. Aucune exonération automatique si vous financez vous-même vos études. Remboursement limité : 10 % sont gardés si vous abandonnez, et plus rien n'est remboursé après deux mois de semestre.",
        "source": "https://isd.pku.edu.cn/en/campus_detail.php?id=700",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "politecnico-di-milano-milan",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Réduction du second versement (jusqu'à 0 €) selon l'ISEEU parificato, à demander avant l'inscription depuis l'étranger (procédure en ligne du CAF). Bourses au mérite pour internationaux (Merit Project, exemptions de première année de master) et appel annuel DSU (bourses du droit aux études).",
        "source": "https://www.polimi.it/en/students/tuition-fees-scholarships-and-financial-aid/tuition-fees",
        "verifieLe": "2026-09-12"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Le second versement des frais peut être réduit, jusqu'à 0 €, selon votre indicateur de revenus ISEEU parificato. Demandez-le avant l'inscription, depuis l'étranger, par la procédure en ligne du CAF (centre d'assistance fiscale). Il existe aussi des bourses au mérite pour les internationaux (Merit Project, exemptions en première année de master) et un appel annuel DSU (bourses du droit aux études).",
        "source": "https://www.polimi.it/en/students/tuition-fees-scholarships-and-financial-aid/tuition-fees",
        "verifieLe": "2026-09-12"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "politecnico-di-torino-turin",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Réduction jusqu'à 600 €/an sur présentation d'un ISEE parificato (plafond 100 000 € d'ISEE), à faire établir depuis l'étranger avant l'inscription. Bourses au mérite pour internationaux : TOPoliTO (8 000 €/an), bourses MAECI du gouvernement italien.",
        "source": "https://www.polito.it/en/education/international-students/financial-aid",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Réduction jusqu'à 600 € par an si votre ISEE parificato (indicateur de la situation économique de la famille) ne dépasse pas 100 000 €. Faites-le établir depuis l'étranger, avant l'inscription. Bourses au mérite pour étudiants internationaux : TOPoliTO (8 000 € par an) et bourses MAECI du gouvernement italien.",
        "source": "https://www.polito.it/en/education/international-students/financial-aid",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "politehnica-bucuresti-bucarest",
    "attendu": {
      "exoneration": {
        "politique": "aucune",
        "detail": "Le bareme officiel 2026-2027 ne distingue que deux colonnes : etudiants roumains, de l'UE et beneficiaires d'une protection en Roumanie d'un cote, etudiants non-UE de l'autre. Aucune reduction selon le pays d'origine, le niveau de revenu ou une liste de pays en developpement n'apparait, ni dans le bareme de la faculte ni dans le document des frais de doctorat hors UE. Aucun dossier ne donnerait droit a un tarif inferieur d'apres ce qui a ete lu.",
        "source": "https://international.upb.ro/assets/docs/2026/doctoral/neu/tuition-fees.pdf",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "aucune",
        "detail": "Le barème officiel 2026-2027 n'a que deux tarifs : l'un pour les étudiants roumains, de l'UE ou protégés en Roumanie, l'autre pour les étudiants hors UE. Il n'y a pas de réduction selon le pays d'origine ou les revenus, ni pour les pays en développement, y compris en doctorat. Rien n'indique qu'une demande permette d'obtenir un tarif plus bas.",
        "source": "https://international.upb.ro/assets/docs/2026/doctoral/neu/tuition-fees.pdf",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "postech-pohang",
    "attendu": {
      "exoneration": {
        "politique": "systematique",
        "detail": "INFORMATION DECISIVE POUR UN ETUDIANT AFRICAIN. LICENCE : bourse complete AUTOMATIQUE des l'inscription pour tous les admis internationaux passes par la filiere d'admission internationale — attention, les etudiants de nationalite etrangere admis par la filiere nationale ou par celle des Coreens de l'etranger n'y ont PAS droit. Reconduction sur 8 semestres sous conditions de credits et de moyenne. S'ajoutent une prime d'installation, une allocation de vie, du travail etudiant et une bourse de coreen. TROISIEME CYCLE : le systeme d'assistanat finance integralement, avec 1 850 000 KRW par mois en master et 2 200 000 KRW en doctorat ; le premier semestre garantit au minimum la bourse de base, le montant variant ensuite selon les resultats et le laboratoire. Le cumul avec des bourses externes est autorise et SANS PLAFOND. Bourses complementaires : POSCO Global Scholarship (frais complets, allocation mensuelle, 1 000 000 KRW d'installation et assurance maladie, jusqu'a 6 semestres en doctorat et 4 en master, pour des nationalites designees par la fondation — verifier la liste, elle change) ; la bourse Ruth L. Satter est reservee aux etudiantes asiatiques et ne s'applique pas. Les bourses gouvernementales coreennes couvrent 5 000 000 KRW/an mais supposent d'etre admis par ces filieres specifiques.",
        "source": "https://adm-g.postech.ac.kr/ENG/graduate-info/support-policy/",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "systematique",
        "detail": "Licence : bourse complète automatique pour tous les étudiants internationaux admis par la filière d'admission internationale (les autres filières n'y donnent pas droit). Renouvelée sur 8 semestres sous conditions de crédits et de moyenne. Master et doctorat : financement complet par assistanat, 1 850 000 KRW par mois en master et 2 200 000 KRW en doctorat. Cumul sans plafond avec d'autres bourses.",
        "source": "https://adm-g.postech.ac.kr/ENG/graduate-info/support-policy/",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "princess-nourah-university-riyad",
    "attendu": {
      "exoneration": {
        "politique": "systematique",
        "detail": "Avantages accordes aux boursieres externes en application du reglement d'accueil des etudiants non saoudiens : couverture sante pendant toute la duree des etudes ; allocation d'installation de deux mois a l'arrivee ; allocation de trois mois a la fin des etudes pour l'expedition des livres ; repas a tarif reduit ; logement fourni avec accompagnement academique, social et culturel ; remboursement du billet d'avion d'entree dans le royaume ; allocation mensuelle identique a celle des etudiantes saoudiennes ; allocation annuelle d'un mois pour l'achat de livres ; prime d'excellence de 1 000 SAR par annee academique ; un billet d'avion annuel vers le pays de residence ; et prise en charge des frais de visa d'etudes. Candidature obligatoirement via la plateforme d'Etat « Study in Saudi ».",
        "source": "https://pnu.edu.sa/en/RegAdm/RegBSC/Pages/External.aspx",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "systematique",
        "detail": "Les étudiantes boursières internationales reçoivent : couverture santé pendant toutes les études, logement, allocation mensuelle identique à celle des Saoudiennes, billet d'avion d'arrivée remboursé, un billet par an vers votre pays de résidence, visa d'études pris en charge, allocations d'installation et pour les livres, prime d'excellence de 1 000 SAR par an. La candidature passe obligatoirement par la plateforme nationale « Study in Saudi ».",
        "source": "https://pnu.edu.sa/en/RegAdm/RegBSC/Pages/External.aspx",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "rudn-university-moscow",
    "attendu": {
      "exoneration": {
        "politique": "inconnue",
        "detail": "Les arretes lus fixent des tarifs et ne mentionnent aucune bourse ; aucune page officielle de l'universite consacree aux exonerations n'a ete ouverte, sa politique propre ne peut donc pas etre qualifiee. Ce qu'il faut savoir pour un etudiant africain est exterieur a l'universite : la Russie attribue chaque annee des places entierement financees par le quota du gouvernement, attribuees via Rossotroudnitchestvo et ses centres culturels russes dans les pays africains, ainsi que via l'olympiade Open Doors pour le master et le doctorat. Ces places couvrent les frais de scolarite et donnent droit a une bourse mensuelle et a un logement a tarif reduit. La candidature se fait AUPRES DE CES ORGANISMES, pas aupres de l'universite — c'est la voie a privilegier, les tarifs ci-dessus ne concernant que les autofinances.",
        "source": "https://www.rudn.ru/sveden/paid_edu/",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "En 2026, RUDN accorde 20 % de réduction aux candidats de pays hors CEI pour une liste de masters enseignés en russe, à temps plein. Les places du quota du gouvernement russe restent la voie gratuite.",
        "source": "https://international.rudn.ru/master/sale/",
        "verifieLe": "2026-09-23"
      }
    },
    "motif": "Politique d'exonération recherchée sur la source officielle (demande de Charles du 2026-09-22 : améliorer les exonérations « inconnue ») ; citations clés recontrôlées dans le navigateur le 2026-09-23. Texte de l'infobulle écrit pour l'étudiant. Politique : inconnue -> possible_plafonnee."
  },
  {
    "collection": "universities",
    "id": "sabanci-university-istanbul",
    "attendu": {
      "exoneration": {
        "politique": "systematique",
        "detail": "INFORMATION DECISIVE POUR UN ETUDIANT AFRICAIN. En LICENCE, tout candidat international remplissant les conditions de candidature est evalue AUTOMATIQUEMENT pour une bourse, accordee sous forme d'exoneration de frais. Les paliers officiels sont 25, 40, 50, 60 et 75 % — la couverture n'atteint donc PAS 100 % en licence : un boursier a 75 % paie encore environ 9 125 USD/an. S'y ajoutent des bourses de logement couvrant une chambre de trois ou quatre personnes sur le campus. En MASTER ET DOCTORAT academiques : exoneration TOTALE des frais annuels pour la quasi-totalite des admis, et la majorite recoit en outre une allocation mensuelle et une chambre gratuite en residence ; les bourses sont attribuees au merite par le jury d'admission puis validees par le conseil de l'ecole doctorale, SANS candidature separee. Les programmes professionnels sont exclus de cette exoneration.",
        "source": "https://www.sabanciuniv.edu/en/graduate-scholarships",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "systematique",
        "detail": "En licence, tout candidat international éligible est évalué d'office pour une réduction de 25, 40, 50, 60 ou 75 % des frais. Elle n'atteint pas 100 % : avec 75 %, il reste environ 9 125 USD par an. Bourses de logement possibles (chambre de 3 ou 4 sur le campus). En master et doctorat académiques (hors programmes professionnels), presque tous les admis sont exonérés à 100 %, sans candidature séparée, souvent avec allocation et chambre gratuite.",
        "source": "https://www.sabanciuniv.edu/en/graduate-scholarships",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "sapienza-universita-di-roma-rome",
    "attendu": {
      "exoneration": {
        "politique": "systematique",
        "detail": "Le forfait réduit par bande de pays s'applique d'office aux étudiants qui ne peuvent pas produire d'ISEE. Exonération totale seulement pour handicap reconnu (loi 104/1992).",
        "source": "https://www.uniroma1.it/en/content/standard-registration-fee-amounts",
        "verifieLe": "2026-09-12"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "systematique",
        "detail": "Si vous ne pouvez pas fournir d'ISEE (indicateur de la situation économique de la famille), un forfait réduit selon votre pays s'applique d'office. L'exonération totale est réservée aux étudiants en situation de handicap reconnu (loi 104/1992).",
        "source": "https://www.uniroma1.it/en/content/standard-registration-fee-amounts",
        "verifieLe": "2026-09-12"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "sciences-po-paris",
    "attendu": {
      "exoneration": {
        "politique": "inconnue",
        "detail": "Établissement à frais propres. Boursiers CROUS et Bourse Émile Boutmy exonérés sous conditions, sauf masters en un an. Aucune exonération au sens du décret.",
        "source": "https://www.sciencespo.fr/students/fr/financer/droits-scolarite/",
        "verifieLe": "2026-09-07"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Sciences Po accorde la bourse Émile-Boutmy aux primo-candidats hors Union européenne au dossier excellent. Les bourses Mastercard Foundation, très sélectives, visent les étudiants d'Afrique subsaharienne. Signalez votre demande dans la partie financière du dossier de candidature. Les masters en un an n'y ouvrent pas droit.",
        "source": "https://www.sciencespo.fr/students/en/fees-funding/bursaries-financial-aid/scholarships-non-european-students/",
        "verifieLe": "2026-09-23"
      }
    },
    "motif": "Politique d'exonération recherchée sur la source officielle (demande de Charles du 2026-09-22 : améliorer les exonérations « inconnue ») ; citations clés recontrôlées dans le navigateur le 2026-09-23. Texte de l'infobulle écrit pour l'étudiant. Politique : inconnue -> possible_plafonnee."
  },
  {
    "collection": "universities",
    "id": "scuola-normale-superiore-pise",
    "attendu": {
      "exoneration": {
        "politique": "systematique",
        "detail": "La gratuite n'est pas une reduction a demander : c'est le regime de TOUS les eleves admis au concours, quelle que soit leur nationalite. Aucun dossier de ressources n'est requis pour ne rien payer ; le revenu du foyer ne sert qu'a moduler le montant de la bourse VERSEE a l'etudiant.",
        "source": "https://www.sns.it/en/studiare-a-costo-zero",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "systematique",
        "detail": "La gratuité n'est pas une réduction à demander : tous les élèves admis au concours ne paient rien, quelle que soit leur nationalité. Aucun dossier sur vos ressources n'est demandé pour cela. Le revenu de votre famille sert seulement à calculer le montant de la bourse qui vous est versée.",
        "source": "https://www.sns.it/en/studiare-a-costo-zero",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "semmelweis-university-budapest",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Aucune reduction pour un candidat autofinance, sauf 50 % pour les anciens etudiants de Semmelweis. La bourse Stipendium Hungaricum couvre en revanche la totalite des droits, plus allocation, logement et assurance ; elle se demande aupres de l'autorite nationale du pays du candidat. Semmelweis attribue aussi la Pannonia In Excellence Scholarship.",
        "source": "https://semmelweis.hu/registrar/faq/how-much-is-the-tuition-fee-per-semester/",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Aucune réduction pour les candidats autofinancés, sauf 50 % pour les anciens étudiants de Semmelweis. La bourse Stipendium Hungaricum couvre la totalité des frais de scolarité, plus une allocation, le logement et l'assurance. Elle se demande auprès de l'autorité nationale de votre pays. Semmelweis attribue aussi la Pannonia In Excellence Scholarship.",
        "source": "https://semmelweis.hu/registrar/faq/how-much-is-the-tuition-fee-per-semester/",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "seoul-national-university-seoul",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Pas d'exonération sur dossier à l'université elle-même. Le GKS (bourse du gouvernement coréen, candidature via l'ambassade en septembre) couvre la totalité des frais sur 8 semestres, 1 200 000 ₩/mois, le billet et un an de coréen.",
        "source": "https://en.snu.ac.kr/admission/undergraduate/scholarships/before_admission",
        "verifieLe": "2026-09-12"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "L'université n'accorde pas elle-même d'exonération sur dossier. Reste la bourse du gouvernement coréen (GKS), à demander auprès de l'ambassade de Corée en septembre. Elle couvre tous les frais pendant 8 semestres, verse 1 200 000 ₩ par mois et paie le billet d'avion et un an de cours de coréen.",
        "source": "https://en.snu.ac.kr/admission/undergraduate/scholarships/before_admission",
        "verifieLe": "2026-09-12"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "shanghai-jiao-tong-university-shanghai",
    "attendu": {
      "exoneration": {
        "politique": "inconnue",
        "detail": "Aucune page officielle de bourses de SJTU n'a pu etre lue. La bourse du gouvernement chinois (CSC) reste la voie generale pour un candidat africain, a demander via l'ambassade de Chine ou campuschina.org ; le detail des bourses propres a SJTU et des exonerations partielles n'a pas ete verifie.",
        "source": "https://gk.sjtu.edu.cn/Data/View/1028",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "SJTU finance ses propres bourses, attribuées selon le classement du dossier et de l'entretien. En licence, elles couvrent de 25 % des frais à la totalité ; en master et en doctorat, elles exonèrent des frais, parfois avec une allocation. Cochez « Apply for scholarship » dans votre candidature en ligne. La bourse du gouvernement chinois (CSC) est une autre voie.",
        "source": "https://global.sjtu.edu.cn/en/study-sjtu/prospective/scholarships/62",
        "verifieLe": "2026-09-23"
      }
    },
    "motif": "Politique d'exonération recherchée sur la source officielle (demande de Charles du 2026-09-22 : améliorer les exonérations « inconnue ») ; citations clés recontrôlées dans le navigateur le 2026-09-23. Texte de l'infobulle écrit pour l'étudiant. Politique : inconnue -> possible_plafonnee."
  },
  {
    "collection": "universities",
    "id": "shanghai-maritime-university-shanghai",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Deux dispositifs. Bourse du gouvernement chinois, a demander parallelement sur studyinchina.csc.edu.cn et dans le systeme de l'universite, du 1er decembre 2025 au 1er fevrier 2026. Bourse du gouvernement municipal de Shanghai, jusqu'au 30 avril 2026, avec un type A complet et un type B partiel ; le detail de sa couverture n'a pas ete lu. Aucune exoneration automatique.",
        "source": "https://en.shmtu.edu.cn/DoctoralPrograms/main.psp",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Deux bourses sont possibles. La bourse du gouvernement chinois se demande à la fois sur studyinchina.csc.edu.cn et sur la plateforme de l'université, du 1er décembre 2025 au 1er février 2026. La bourse de la ville de Shanghai se demande jusqu'au 30 avril 2026 : le type A est complet, le type B partiel ; ce qu'ils couvrent est à confirmer auprès de l'université. Aucune exonération n'est automatique.",
        "source": "https://en.shmtu.edu.cn/DoctoralPrograms/main.psp",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "sichuan-university-chengdu",
    "attendu": {
      "exoneration": {
        "politique": "inconnue",
        "detail": "Aucune page officielle de bourses de l'universite du Sichuan n'a pu etre lue. La bourse du gouvernement chinois (CSC) reste la voie generale, a demander via l'ambassade de Chine ou campuschina.org ; les bourses propres a SCU n'ont pas ete verifiees.",
        "source": "https://en.scu.edu.cn/Admissions/Degree_Programs_for_International_Students/Master_s/Fees.htm",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "L'université du Sichuan attribue sa bourse « Study at SCU », en nombre limité : jusqu'à 20 000 yuans par an en licence, bourse complète en master et en doctorat (frais, logement, assurance, allocation). Un comité choisit sur dossier ; candidatez tôt. Conditions publiées pour la rentrée 2025. La bourse CSC est une autre voie.",
        "source": "https://global.scu.edu.cn/oso/article/details/9dfcd5bf-f620-402f-97a1-54caa31312e5",
        "verifieLe": "2026-09-23"
      }
    },
    "motif": "Politique d'exonération recherchée sur la source officielle (demande de Charles du 2026-09-22 : améliorer les exonérations « inconnue ») ; citations clés recontrôlées dans le navigateur le 2026-09-23. Texte de l'infobulle écrit pour l'étudiant. Politique : inconnue -> possible_plafonnee."
  },
  {
    "collection": "universities",
    "id": "sorbonne-universite-paris",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Exonération sur demande, dossier déposé sur une plateforme dédiée en septembre ; exonérés d'office : boursiers d'État, accords internationaux, programmes d'échange.",
        "source": "https://www.sorbonne-universite.fr/en/education/study-sorbonne-university/enrolment-procedures-and-tuition-fees",
        "verifieLe": "2026-09-07"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Exonération sur demande : déposez votre dossier sur une plateforme dédiée, en septembre. Exonérés d'office : les boursiers d'État et les étudiants venus dans le cadre d'un accord international ou d'un programme d'échange.",
        "source": "https://www.sorbonne-universite.fr/en/education/study-sorbonne-university/enrolment-procedures-and-tuition-fees",
        "verifieLe": "2026-09-07"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "spbu-saint-petersbourg",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "La page officielle des admissions internationales l'ecrit noir sur blanc : les candidats internationaux peuvent postuler a la bourse du gouvernement de la Federation de Russie, qui COUVRE INTEGRALEMENT les frais de scolarite et donne droit a une allocation mensuelle et a un logement en residence a tarif reduit. C'est la voie a recommander en priorite a un etudiant africain. La candidature passe par les representations de Rossotroudnitchestvo dans le pays de residence, et par l'olympiade Open Doors pour le master et le doctorat. Le nombre de places est contingente, d'ou « possible_plafonnee » et non « systematique ». Aucune bourse propre a l'universite, financee sur ses fonds, n'est mentionnee. Pour les autofinances, le paiement se fait par semestre.",
        "source": "https://english.spbu.ru/admission/tuition",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Vous pouvez demander la bourse du gouvernement russe (places limitées). Elle couvre tous les frais de scolarité, avec une allocation mensuelle et un logement en résidence à tarif réduit. Candidatez auprès de la représentation de Rossotroudnitchestvo dans votre pays de résidence et, en master et doctorat, par l'olympiade Open Doors. L'université ne cite pas de bourse propre. Sans bourse, vous payez par semestre.",
        "source": "https://english.spbu.ru/admission/tuition",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "stanford-university-stanford",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Aide financière sur besoin, mais « limitée » pour les internationaux (need-aware) : il faut la demander sur le dossier d'admission lui-même, jamais après ; demander une aide peut peser sur la décision d'admission. Pas de seuil de revenu publié pour les non-Américains.",
        "source": "https://financialaid.stanford.edu/undergrad/how/international.html",
        "verifieLe": "2026-09-12"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Stanford accorde une aide selon les besoins, mais elle est limitée pour les étudiants internationaux. Il faut la demander dans le dossier d'admission lui-même : ce n'est plus possible après. Pour vous, demander une aide peut peser sur la décision d'admission. Aucun seuil de revenu n'est publié pour les candidats non américains.",
        "source": "https://financialaid.stanford.edu/undergrad/how/international.html",
        "verifieLe": "2026-09-12"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "sun-yat-sen-university-guangzhou",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Bourses du gouvernement chinois accessibles via campuschina.org et via le systeme de SYSU : CSC bilaterale type A, Youth of Excellence type A, programme de haut niveau type B (code etablissement 10558), bourse de l'energie atomique type B, bourse Route de la soie type B. S'y ajoutent la bourse des professeurs internationaux de chinois et le programme MPA du ministere chinois du Commerce. Bourses propres de l'universite : 10 000 CNY en versement unique en licence, 30 000 CNY en versement unique en doctorat — une aide plafonnee, pas une exoneration totale.",
        "source": "https://iso.sysu.edu.cn/en/application/selffunded/1420584.htm",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Les bourses du gouvernement chinois se demandent sur campuschina.org et sur la plateforme de SYSU : accord bilatéral (type A), Youth of Excellence (type A), programme de haut niveau (type B, code de l'université 10558), énergie atomique (type B), Route de la soie (type B). L'université verse aussi une aide unique de 10 000 CNY en licence et de 30 000 CNY en doctorat : c'est une aide plafonnée, pas une exonération totale.",
        "source": "https://iso.sysu.edu.cn/en/application/selffunded/1420584.htm",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "szechenyi-istvan-university-gyor",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "La bourse Stipendium Hungaricum couvre la TOTALITE des droits plus allocation, logement et assurance, mais elle se demande aupres de l'autorite nationale du pays du candidat. En propre, l'universite dispose d'un dispositif maison, la SODA Scholarship, mise en avant sur sa page d'information aux candidats ; ni son taux de couverture ni son plafond n'ont ete verifies.",
        "source": "https://admissions.sze.hu/application-information",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "La bourse Stipendium Hungaricum paie tous les frais de scolarité, plus une allocation, le logement et l'assurance. Elle se demande auprès de l'autorité nationale de votre pays, pas auprès de l'université. L'université a aussi sa propre bourse, la SODA Scholarship. Son montant et ses limites sont à confirmer auprès de l'université.",
        "source": "https://admissions.sze.hu/application-information",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "tianjin-university-tianjin",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Bourse du gouvernement chinois (CSC) et bourses de l'université pour internationaux, sur dossier ; les boursiers CSC sont exonérés des frais de dossier et de scolarité.",
        "source": "https://sie.tju.edu.cn/en/jxj/tjdxjxj/202410/t20241015_323982.html",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "La bourse du gouvernement chinois (CSC) et les bourses de l'université pour les étudiants internationaux sont attribuées sur dossier. Les boursiers CSC ne paient ni frais de dossier ni frais de scolarité.",
        "source": "https://sie.tju.edu.cn/en/jxj/tjdxjxj/202410/t20241015_323982.html",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "tongji-university-shanghai",
    "attendu": {
      "exoneration": {
        "politique": "inconnue",
        "detail": "Aucune page officielle de bourses de Tongji n'a pu etre lue. La bourse du gouvernement chinois (CSC) reste la voie generale, a demander via l'ambassade de Chine ou campuschina.org ; les bourses propres a Tongji n'ont pas ete verifiees.",
        "source": "https://study.tongji.edu.cn/en/info/1062/1226.htm",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Tongji attribue sa bourse d'excellence en nombre limité : exonération totale des frais, assurance et allocation mensuelle. Elle vise les doctorants et les étudiants des licences enseignées en anglais. Candidature d'octobre de l'année précédente à mai de l'année d'entrée.",
        "source": "https://study.tongji.edu.cn/__local/2/05/BF/E756DD2A359377BC9B5CE3375F0_9965AAB7_239CA.pdf",
        "verifieLe": "2026-09-23"
      }
    },
    "motif": "Politique d'exonération recherchée sur la source officielle (demande de Charles du 2026-09-22 : améliorer les exonérations « inconnue ») ; citations clés recontrôlées dans le navigateur le 2026-09-23. Texte de l'infobulle écrit pour l'étudiant. Politique : inconnue -> possible_plafonnee."
  },
  {
    "collection": "universities",
    "id": "tsinghua-university-pekin",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Bourse du gouvernement chinois (CSC) : la version complete couvre scolarite, logement universitaire ou indemnite, allocation mensuelle et assurance maladie ; la version partielle ne couvre qu'une partie. Candidature via l'ambassade de Chine du pays d'origine ou campuschina.org. Tsinghua accorde en propre une Tuition Scholarship reservee au master et au doctorat, qui couvre les droits d'une annee, se redemande chaque annee et s'attribue au concours. Aucune exoneration automatique.",
        "source": "https://www.tsinghua.edu.cn/en/Admissions/International_Students1/Financial_Aid.htm",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Bourse du gouvernement chinois (CSC) : la version complète couvre la scolarité, le logement (ou une indemnité), une allocation mensuelle et l'assurance maladie ; la version partielle n'en couvre qu'une partie. Candidature auprès de l'ambassade de Chine de votre pays ou sur campuschina.org. En master et doctorat, Tsinghua offre aussi une Tuition Scholarship : un an de droits, sur concours, à redemander chaque année. Rien n'est automatique.",
        "source": "https://www.tsinghua.edu.cn/en/Admissions/International_Students1/Financial_Aid.htm",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "uclouvain-louvain-la-neuve",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "La contribution hors UE (4 175 €) tombe pour les ressortissants des pays des annexes 1-3 de la circulaire ARES 2026-001 — si votre pays y figure, vous payez le tarif ordinaire (1 194 €). Par ailleurs, réduction des droits ordinaires sur dossier social (835 € ou 374 €).",
        "source": "https://uclouvain.be/en/enrolment/registration-fee-amount",
        "verifieLe": "2026-09-12"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Si votre pays figure dans les annexes 1 à 3 de la circulaire ARES 2026-001, vous ne payez pas la contribution hors UE (4 175 €) : vous payez le tarif ordinaire (1 194 €). Vous pouvez aussi demander une réduction des droits ordinaires sur dossier social (835 € ou 374 €).",
        "source": "https://uclouvain.be/en/enrolment/registration-fee-amount",
        "verifieLe": "2026-09-12"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "universita-bocconi-milan",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Bocconi attribue des exonérations partielles ou totales au mérite et sur besoin (Bocconi International Awards, aides sur revenus) ; les candidats sont examinés sur dossier. Montants et nombre de bénéficiaires non lus sur les pages accessibles — à vérifier sur la page « Funding » du programme visé.",
        "source": "https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/fees",
        "verifieLe": "2026-09-12"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Bocconi accorde des exonérations partielles ou totales, au mérite ou selon vos revenus (Bocconi International Awards, aides sur revenus). Chaque candidature est étudiée sur dossier. Les montants et le nombre de bénéficiaires sont à vérifier sur la page « Funding » du programme qui vous intéresse.",
        "source": "https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/fees",
        "verifieLe": "2026-09-12"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "universita-degli-studi-di-milano-milan",
    "attendu": {
      "exoneration": {
        "politique": "systematique",
        "detail": "Le forfait réduit par groupe de pays s'applique sans justificatif. Un étudiant hors UE peut aussi demander les aides au droit aux études (bourses, exonérations) en fournissant les documents de revenus et de patrimoine de sa famille.",
        "source": "https://www.unimi.it/sites/default/files/2026-05/Allegato%202%20Regolamento%20Tasse%20A.A.2026-2027%20Gruppi%20Paesi%20%28002%29_1.pdf",
        "verifieLe": "2026-09-12"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "systematique",
        "detail": "Le forfait réduit selon votre groupe de pays s'applique sans justificatif. Si vous êtes hors UE, vous pouvez aussi demander les aides au droit aux études (bourses, exonérations) en fournissant les documents de revenus et de patrimoine de votre famille.",
        "source": "https://www.unimi.it/sites/default/files/2026-05/Allegato%202%20Regolamento%20Tasse%20A.A.2026-2027%20Gruppi%20Paesi%20%28002%29_1.pdf",
        "verifieLe": "2026-09-12"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "universita-degli-studi-di-napoli-federico-ii-naples",
    "attendu": {
      "exoneration": {
        "politique": "systematique",
        "detail": "Le guide classe les ressortissants de pays hors Union europeenne parmi les categories TOTALEMENT exonerees de la contribution d'inscription, sans mentionner de dossier ni de liste de pays : l'exoneration decoule de la nationalite et s'applique d'office. Seules restent la taxe regionale et le timbre. Aucun formulaire n'est associe a cette categorie, contrairement aux categories handicap ou merite qui exigent une attestation avant le 7 janvier.",
        "source": "https://www.unina.it/documents/20117/1741540/guida_studente_rapida_25_26.pdf",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "systematique",
        "detail": "Selon le guide de l'université, les ressortissants de pays hors Union européenne sont totalement exonérés de la contribution d'inscription. L'exonération dépend de la nationalité et s'applique d'office, sans dossier ni formulaire. Il reste à payer la taxe régionale et le timbre.",
        "source": "https://www.unina.it/documents/20117/1741540/guida_studente_rapida_25_26.pdf",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "universita-di-bari-aldo-moro-bari",
    "attendu": {
      "exoneration": {
        "politique": "systematique",
        "detail": "Forfait de 200 € pour les ressortissants des pays en développement de la liste ministérielle. Exonération TOTALE de la contribution pour les étudiants réfugiés ou sous protection subsidiaire (restent taxe régionale et timbre).",
        "source": "https://www.uniba.it/it/studenti/segreterie-studenti/studenti-stranieri/studenti-internazionali-tasse-contributi-ed-esoneri",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "systematique",
        "detail": "Si votre pays figure sur la liste ministérielle des pays en développement, vous payez un forfait de 200 €. Les étudiants réfugiés ou sous protection subsidiaire sont exonérés de toute la contribution : ils paient seulement la taxe régionale et le timbre.",
        "source": "https://www.uniba.it/it/studenti/segreterie-studenti/studenti-stranieri/studenti-internazionali-tasse-contributi-ed-esoneri",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "universita-di-bologna-bologne",
    "attendu": {
      "exoneration": {
        "politique": "systematique",
        "detail": "Le forfait réduit s'applique sur simple demande via ER.GO, sans pièces économiques, à tout ressortissant d'un pays de la liste dont la famille n'a ni revenus ni biens en Italie. L'université l'applique même si la demande reste incomplète, quitte à réclamer ensuite une déclaration sur les ressources.",
        "source": "https://www.unibo.it/en/study/enrolment-fees-and-other-procedures/degree-programmes/tuition-fees-and-exemptions/reduced-fixed-fee-for-citizens-of-particularly-poor-and-developing-countries-or-non-eu-non-oecd-countries",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "systematique",
        "detail": "Le forfait réduit s'applique sur simple demande via ER.GO, sans justificatifs de revenus. Il concerne les ressortissants d'un pays de la liste dont la famille n'a ni revenus ni biens en Italie. L'université l'applique même si la demande est incomplète, mais elle peut ensuite vous demander une déclaration sur vos ressources.",
        "source": "https://www.unibo.it/en/study/enrolment-fees-and-other-procedures/degree-programmes/tuition-fees-and-exemptions/reduced-fixed-fee-for-citizens-of-particularly-poor-and-developing-countries-or-non-eu-non-oecd-countries",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "universita-di-firenze-florence",
    "attendu": {
      "fraisScolarite": undefined,
      "exoneration": undefined
    },
    "champs": {
      "fraisScolarite": {
        "source": "https://www.unifi.it/sites/default/files/2026-06/manifesto_studi_allegato_5.pdf",
        "verifieLe": "2026-09-23",
        "note": "Année 2026-2027. Un étudiant qui réside à l'étranger reçoit d'office un ISEE figuratif selon la catégorie de revenu de son pays (annexe 5 du Manifesto degli Studi). Total annuel : 2 395,30 € pour les pays à revenu élevé (montant retenu, arrondi), 1 467,30 € pour le revenu intermédiaire supérieur (ex. Algérie), 939 € pour le revenu intermédiaire inférieur (ex. Sénégal, Côte d'Ivoire, Cameroun, Maroc), 536 € pour les pays à faible revenu (ex. Mali). Licence et master au même montant. Doctorat : timbre de 16 € et taxe régionale de 140 €, soit 156 € (appel du 42e cycle). Les étudiants d'un pays en développement ne paient que la taxe régionale et le timbre.",
        "licence": {
          "montant": 2395,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 2395,
          "devise": "EUR",
          "periode": "an"
        },
        "doctorat": {
          "montant": 156,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Si vous venez d'un pays en développement, ou si vous êtes boursier du gouvernement italien, vous ne payez que la taxe régionale de 140 € et le timbre de 16 €. Sinon, le montant dépend du niveau de revenu de votre pays, de 536 € à 2 395 € par an. Demandez à l'université si votre pays est concerné.",
        "source": "https://www.unifi.it/it/studia-con-noi/il-tuo-percorso/tasse-isee-e-agevolazioni/riduzioni-esoneri-e-rimborsi-delle-tasse",
        "verifieLe": "2026-09-23"
      }
    },
    "motif": "Frais de scolarité officiels trouvés pour une université qui n'en affichait pas (demande de Charles du 2026-09-22). Montant, devise, source et date de vérification ; le détail et les choix de montant sont dans la note. Politique d'exonération recherchée sur la source officielle (demande de Charles du 2026-09-22 : améliorer les exonérations « inconnue ») ; citations clés recontrôlées dans le navigateur le 2026-09-23. Texte de l'infobulle écrit pour l'étudiant. Politique : absente -> possible_plafonnee."
  },
  {
    "collection": "universities",
    "id": "universita-di-genova-genes",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Rien n'est applique d'office. Pour descendre du tarif plein il faut deposer un dossier ISEE-U parificato dans un CAF conventionne (gratuit, delai 31 octobre), avec traduction et legalisation des revenus etrangers par les autorites diplomatiques italiennes ; la reduction peut alors aller jusqu'a zero contribution sous 13 000 EUR d'ISEE-U. L'exoneration « pays en voie de developpement » ne porte que sur la 3e tranche et exige de resider deja en Italie avec un permis de sejour pour etudes.",
        "source": "https://unige.it/tasse-e-benefici/isee/parificato",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Rien n'est automatique. Pour réduire le tarif plein, déposez un dossier ISEE-U parificato dans un CAF conventionné (gratuit, avant le 31 octobre), avec vos revenus étrangers traduits et légalisés par les autorités diplomatiques italiennes. Sous 13 000 € d'ISEE-U, la contribution peut tomber à zéro. L'exonération « pays en voie de développement » ne couvre que la 3e tranche et exige de résider déjà en Italie avec un permis de séjour pour études.",
        "source": "https://unige.it/tasse-e-benefici/isee/parificato",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "universita-di-padova-padoue",
    "attendu": {
      "exoneration": {
        "politique": "systematique",
        "detail": "Le tarif « pays en développement » s'applique d'office aux ressortissants des pays à faible indice de développement humain listés par le décret ministériel. Padoue applique par ailleurs « l'une des politiques les plus avantageuses des grandes universités italiennes » : aucun contributo jusqu'à 30 000 € de revenu familial annuel.",
        "source": "https://www.unipd.it/en/tuition-fees",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "systematique",
        "detail": "Si vous êtes ressortissant d'un pays à faible indice de développement humain figurant sur la liste du décret ministériel italien, le tarif « pays en développement » s'applique d'office. Par ailleurs, Padoue ne demande aucune contribution si le revenu familial annuel ne dépasse pas 30 000 €.",
        "source": "https://www.unipd.it/en/tuition-fees",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "universita-di-pavia-pavie",
    "attendu": {
      "exoneration": {
        "politique": "systematique",
        "detail": "Le forfait réduit par nationalité s'applique automatiquement, sans dossier. L'étudiant peut au contraire demander un calcul sur la situation économique de sa famille (ISEE), obligatoire s'il vise les aides EDiSU.",
        "source": "https://en.unipv.it/en/education/bachelors-and-masters-degree-programs/fees-and-funding/fees/prospective-students/non-eu-students",
        "verifieLe": "2026-09-12"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "systematique",
        "detail": "Un forfait réduit selon votre nationalité s'applique automatiquement, sans dossier. Vous pouvez aussi choisir un calcul selon la situation économique de votre famille (ISEE). Ce calcul est obligatoire si vous voulez demander les aides de l'EDiSU.",
        "source": "https://en.unipv.it/en/education/bachelors-and-masters-degree-programs/fees-and-funding/fees/prospective-students/non-eu-students",
        "verifieLe": "2026-09-12"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "universita-di-pisa-pise",
    "attendu": {
      "exoneration": {
        "politique": "systematique",
        "detail": "Le bareme par pays d'origine est applique d'office : un etudiant d'un pays a faible revenu ou a revenu intermediaire paie de 10 a 20 % du tarif plein, sans demarche. Les etudiants dont l'ISEE est inferieur a 26 000 EUR ne paient que la taxe regionale de 140 EUR ; une reduction sur ISEEU parificato peut se cumuler.",
        "source": "https://www.unipi.it/index.php/english/tuition-fees",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "systematique",
        "detail": "Le tarif dépend de votre pays d'origine et s'applique d'office, sans démarche. Si votre pays est à revenu faible ou intermédiaire, vous payez de 10 à 20 % du tarif plein. Si votre ISEE (indicateur italien de revenus) est inférieur à 26 000 €, vous payez seulement la taxe régionale de 140 €. Une réduction selon l'ISEEU parificato peut s'y ajouter.",
        "source": "https://www.unipi.it/index.php/english/tuition-fees",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "universita-di-trento-trente",
    "attendu": {
      "fraisScolarite": undefined,
      "exoneration": undefined
    },
    "champs": {
      "fraisScolarite": {
        "source": "https://www.unitn.it/en/study/fees-scholarships-accommodation/tuition-fees/non-eu-citizens",
        "verifieLe": "2026-09-23",
        "note": "Non-UE résidant hors d'Italie : pas d'ISEE, les frais de 1re année dépendent du score d'admission (0 € dès 90/100). Montants retenus : le maximum de 1re année. Licence enseignée en anglais : 4 500 € (licence en italien : 3 000 €). Master : 6 500 € pour le groupe B (Computer Science, International Management…), 4 500 € pour le groupe A. Les années suivantes dépendent des crédits obtenus, jusqu'à 6 000 € par an (10 000 € en master du groupe B). Grilles 2025-2026 reprises à l'identique par les appels d'admission 2026-2027. Doctorat : 166 € (taxe provinciale de 150 € et timbre de 16 €).",
        "licence": {
          "montant": 4500,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 6500,
          "devise": "EUR",
          "periode": "an"
        },
        "doctorat": {
          "montant": 166,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Vos frais de première année baissent avec votre score d'admission : 0 € dès 90/100. UniTrento offre aussi aux non-Européens résidant hors d'Italie des bourses au mérite de 7 200 € par an (8 500 € pour les étudiantes en sciences et ingénierie), qui exonèrent des frais cette année-là. Leur nombre est limité.",
        "source": "https://www.unitn.it/en/study/fees-scholarships-accommodation/scholarships-and-awards/scholarships-international-students",
        "verifieLe": "2026-09-23"
      }
    },
    "motif": "Frais de scolarité officiels trouvés pour une université qui n'en affichait pas (demande de Charles du 2026-09-22). Montant, devise, source et date de vérification ; le détail et les choix de montant sont dans la note. Politique d'exonération recherchée sur la source officielle (demande de Charles du 2026-09-22 : améliorer les exonérations « inconnue ») ; citations clés recontrôlées dans le navigateur le 2026-09-23. Texte de l'infobulle écrit pour l'étudiant. Politique : absente -> possible_plafonnee."
  },
  {
    "collection": "universities",
    "id": "universita-di-trieste-trieste",
    "attendu": {
      "exoneration": {
        "politique": "systematique",
        "detail": "Exonération totale des frais de scolarité pour les ressortissants des pays en développement inscrits dans la durée normale du cursus : restent le timbre et la taxe régionale. Demande à déposer avec le formulaire « Borsisti GI CRUI e PvS ».",
        "source": "https://portale.units.it/sites/default/files/2026-08/EN%20Borsisiti%20GI%20CRUI%20e%20PvS%202026%202027.pdf",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "systematique",
        "detail": "Si vous êtes ressortissant d'un pays en développement et inscrit dans la durée normale du cursus, vos frais de scolarité sont totalement exonérés. Il reste à payer le timbre et la taxe régionale. Faites la demande avec le formulaire « Borsisti GI CRUI e PvS ».",
        "source": "https://portale.units.it/sites/default/files/2026-08/EN%20Borsisiti%20GI%20CRUI%20e%20PvS%202026%202027.pdf",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "universitat-hamburg-hamburg",
    "attendu": {
      "exoneration": {
        "politique": "systematique",
        "detail": "Aucun frais de scolarité à exonérer ; la contribution semestrielle est due par tous.",
        "source": "https://www.uni-hamburg.de/campuscenter/studienorganisation/studienverlauf/beitraege-gebuehren/studiengebuehren.html",
        "verifieLe": "2026-09-12"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "systematique",
        "detail": "Il n'y a pas de frais de scolarité, donc rien à exonérer. La contribution semestrielle reste due par tous les étudiants.",
        "source": "https://www.uni-hamburg.de/campuscenter/studienorganisation/studienverlauf/beitraege-gebuehren/studiengebuehren.html",
        "verifieLe": "2026-09-12"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "universite-abou-bekr-belkaid-tlemcen",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Aucune exoneration pour un candidat autofinance : la grille « hors quota » est le tarif. La voie gratuite est celle de la BOURSE DU GOUVERNEMENT ALGERIEN, attribuee par quota bilateral via l'autorite nationale ou l'ambassade d'Algerie du pays du candidat — le boursier ne paie pas de droits et percoit une allocation mensuelle (1 350 DA en graduation, 1 650 DA en post-graduation). Les candidatures « hors quota » passent par la plateforme Study in Algeria, du 13 janvier au 30 juin, pour une rentree en octobre.",
        "source": "https://studyinalgeria.dz/pages/17157",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Sans bourse, il n'y a pas d'exonération : vous payez le tarif « hors quota ». La voie gratuite est la bourse du gouvernement algérien, attribuée par quota via l'autorité nationale de votre pays ou l'ambassade d'Algérie dans votre pays. Le boursier ne paie pas de droits et reçoit 1 350 DA par mois en graduation, 1 650 DA en post-graduation. Candidature hors quota sur Study in Algeria, du 13 janvier au 30 juin, pour une rentrée en octobre.",
        "source": "https://studyinalgeria.dz/pages/17157",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "universite-alger-1-benyoucef-benkhedda-alger",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Aucune exoneration pour un candidat autofinance : la grille « hors quota » est le tarif. La voie gratuite est celle de la BOURSE DU GOUVERNEMENT ALGERIEN, attribuee par quota bilateral via l'autorite nationale ou l'ambassade d'Algerie du pays du candidat — le boursier ne paie pas de droits et percoit une allocation mensuelle (1 350 DA en graduation, 1 650 DA en post-graduation). Les candidatures « hors quota » passent par la plateforme Study in Algeria, du 13 janvier au 30 juin, pour une rentree en octobre.",
        "source": "https://studyinalgeria.dz/pages/17157",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Pas d'exonération si vous financez vous-même vos études : vous payez le tarif « hors quota ». La voie gratuite est la bourse du gouvernement algérien, attribuée par quota via l'autorité nationale ou l'ambassade d'Algérie de votre pays. Le boursier ne paie pas de droits et reçoit 1 350 DA par mois en graduation, 1 650 DA en post-graduation. Candidature hors quota sur Study in Algeria, du 13 janvier au 30 juin, pour une rentrée en octobre.",
        "source": "https://studyinalgeria.dz/pages/17157",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "universite-cadi-ayyad-marrakech",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "L'universite indique que grace a l'AMCI elle accueille des etudiants de nombreux pays d'Afrique, et que l'agence octroie des bourses et des facilites d'accueil dans le cadre de la cooperation entre le Maroc et les pays partenaires. POINT CLE : la candidature se fait OBLIGATOIREMENT par voie diplomatique — « tout dossier non transmis par l'AMCI ne sera pas pris en consideration ». On ne postule donc pas a l'universite : le dossier se depose aupres de l'autorite competente de son pays ou de l'ambassade du Maroc, qui le transmet a l'AMCI, laquelle le transmet au ministere de l'Enseignement superieur. L'inscription se fait ensuite sur presentation de l'autorisation d'inscription delivree par ce ministere. Le montant de la bourse n'est publie ni sur uca.ma ni sur amci.ma.",
        "source": "https://www.uca.ma/fr/page/agence-marocaine-de-la-cooperation-internationale-amci",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Les bourses et aides à l'accueil passent par l'AMCI (agence marocaine de coopération). Ne postulez pas à l'université : déposez votre dossier auprès de l'autorité compétente de votre pays ou de l'ambassade du Maroc. Il passe ensuite par l'AMCI, puis par le ministère de l'Enseignement supérieur. Sans l'AMCI, le dossier n'est pas examiné. Vous vous inscrivez avec l'autorisation du ministère. Montant de la bourse non publié.",
        "source": "https://www.uca.ma/fr/page/agence-marocaine-de-la-cooperation-internationale-amci",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "universite-claude-bernard-lyon-1-villeurbanne",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Exonérations totales ou partielles sur demande, dans la limite du quota de 30 % en 2026-2027.",
        "source": "https://www.univ-lyon1.fr/formation/inscription-et-scolarite/etudiantes-et-etudiants-internationaux-droits-dinscription-differencies-et-exonerations",
        "verifieLe": "2026-09-07"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Exonération totale ou partielle possible sur demande, dans la limite d'un quota de 30 % en 2026-2027 : elle n'est donc pas garantie.",
        "source": "https://www.univ-lyon1.fr/formation/inscription-et-scolarite/etudiantes-et-etudiants-internationaux-droits-dinscription-differencies-et-exonerations",
        "verifieLe": "2026-09-07"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "universite-constantine-1-freres-mentouri-constantine",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Aucune exoneration pour un candidat autofinance : la grille « hors quota » est le tarif. La voie gratuite est celle de la BOURSE DU GOUVERNEMENT ALGERIEN, attribuee par quota bilateral via l'autorite nationale ou l'ambassade d'Algerie du pays du candidat — le boursier ne paie pas de droits et percoit une allocation mensuelle (1 350 DA en graduation, 1 650 DA en post-graduation). Les candidatures « hors quota » passent par la plateforme Study in Algeria, du 13 janvier au 30 juin, pour une rentree en octobre.",
        "source": "https://studyinalgeria.dz/pages/17157",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Sans bourse, il n'y a pas d'exonération : vous payez le tarif « hors quota ». La voie gratuite est la bourse du gouvernement algérien, attribuée par quota via l'autorité nationale de votre pays ou l'ambassade d'Algérie dans votre pays. Le boursier ne paie pas de droits et reçoit 1 350 DA par mois en graduation, 1 650 DA en post-graduation. Candidature hors quota sur Study in Algeria, du 13 janvier au 30 juin, pour une rentrée en octobre.",
        "source": "https://studyinalgeria.dz/pages/17157",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "universite-cote-d-azur-nice",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Nouvel entrant : exonération partielle possible au vu de la situation personnelle, examinée en commission d'exonération.",
        "source": "https://univ-cotedazur.fr/formation/candidater-et-s-inscrire/droits-dinscription",
        "verifieLe": "2026-09-07"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Si vous vous inscrivez pour la première fois, vous pouvez obtenir une exonération partielle selon votre situation personnelle. Une commission d'exonération étudie votre demande.",
        "source": "https://univ-cotedazur.fr/formation/candidater-et-s-inscrire/droits-dinscription",
        "verifieLe": "2026-09-07"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "universite-de-bordeaux-bordeaux",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Exonération partielle sur demande (paiement au tarif national si accordée), commission en novembre, décision en décembre ; procédures accélérées pour boursiers, réfugiés, conventions, domicile fiscal en France.",
        "source": "https://www.u-bordeaux.fr/formation/candidatures-et-inscriptions/cout-des-etudes/etudiants-extra-communautaires",
        "verifieLe": "2026-09-07"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "L'exonération partielle se fait sur demande : si elle est accordée, vous payez le tarif national. La commission se réunit en novembre et décide en décembre. Des procédures accélérées existent pour les boursiers, les réfugiés, les étudiants sous convention et ceux dont le domicile fiscal est en France.",
        "source": "https://www.u-bordeaux.fr/formation/candidatures-et-inscriptions/cout-des-etudes/etudiants-extra-communautaires",
        "verifieLe": "2026-09-07"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "universite-de-bucarest-bucarest",
    "attendu": {
      "exoneration": {
        "politique": "aucune",
        "detail": "Pour les ressortissants hors Union europeenne, l'ecole doctorale precise qu'il n'existe QUE des places payantes, et aucun bareme lu ne prevoit de reduction liee au pays d'origine ou aux ressources. La seule aide mentionnee est une bourse de l'Etat roumain accordee via le ministere des Affaires etrangeres, qui fait l'objet d'une candidature entierement separee.",
        "source": "https://isds.unibuc.ro/interdisciplinary-research-training-groups/fees/",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "aucune",
        "detail": "Pour les étudiants hors Union européenne, l'école doctorale indique qu'il n'existe que des places payantes. Aucune réduction n'est connue selon le pays d'origine ou les revenus. Seule aide possible : une bourse de l'État roumain, attribuée par le ministère des Affaires étrangères, avec une candidature entièrement séparée.",
        "source": "https://isds.unibuc.ro/interdisciplinary-research-training-groups/fees/",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "universite-de-carthage-tunis",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Aucune reduction pour un candidat individuel : la grille nationale est le tarif. La voie exoneree est celle des CONVENTIONS DE COOPERATION bilaterale — le candidat est presente par son pays (quota), et il est alors dispense des frais d'inscription, parfois avec une bourse. Se renseigner aupres du ministere de l'enseignement superieur de son pays, pas aupres de l'universite tunisienne.",
        "source": "https://www.medecinesfax.org/useruploads/files/affiche%20Programme%20Payant.pdf",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Si vous candidatez seul, il n'y a pas de réduction : vous payez le tarif national. Pour être exonéré, il faut passer par une convention de coopération entre votre pays et la Tunisie : votre pays vous présente dans le cadre d'un quota. Vous êtes alors dispensé des frais d'inscription, parfois avec une bourse. Renseignez-vous auprès du ministère de l'Enseignement supérieur de votre pays, pas auprès de l'université.",
        "source": "https://www.medecinesfax.org/useruploads/files/affiche%20Programme%20Payant.pdf",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "universite-de-fribourg-fribourg",
    "attendu": {
      "exoneration": {
        "politique": "aucune",
        "detail": "Aucune exoneration liee a la nationalite : au contraire, le statut d'etranger declenche une MAJORATION de 150 CHF par semestre. En cas de difficultes de paiement, la page renvoie vers le service social de l'universite et le fonds Georges Python, ce qui suppose une demande individuelle et une evaluation de la situation financiere. Le non-paiement dans le delai ultime (30 septembre pour l'automne, 28 fevrier pour le printemps) entraine l'exmatriculation.",
        "source": "https://www.unifr.ch/studies/fr/organisation/prestations-admin-etudiants/taxes-universitaires/",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "aucune",
        "detail": "Pas d'exonération liée à la nationalité : les étudiants étrangers paient au contraire 150 CHF de plus par semestre. Si vous avez du mal à payer, contactez le service social de l'université ou le fonds Georges Python : il faut faire une demande individuelle et votre situation financière sera évaluée. Sans paiement avant le délai final (30 septembre en automne, 28 février au printemps), votre inscription est annulée.",
        "source": "https://www.unifr.ch/studies/fr/organisation/prestations-admin-etudiants/taxes-universitaires/",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "universite-de-geneve-geneve",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Les exonerations statutaires (conge, stage, mobilite, assistanat) portent sur les 435 CHF de taxes d'encadrement et sont deduites d'office, mais elles tiennent a la situation d'etudes, pas a la nationalite. L'exoneration pour difficultes financieres suppose une demande aupres du Service des aides financieres, reevaluee chaque annee ; elle est plafonnee aux taxes d'encadrement, les 65 CHF de taxes fixes restant toujours dus. Aucune exoneration liee au pays d'origine.",
        "source": "https://memento.unige.ch/doc/0346",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Aucune exonération n'est liée au pays d'origine. Les exonérations statutaires (congé, stage, mobilité, assistanat) dépendent de votre situation d'études : elles sont déduites d'office des 435 CHF de taxes d'encadrement. En cas de difficultés financières, demandez une exonération au Service des aides financières, réévaluée chaque année. Elle couvre au plus les taxes d'encadrement : les 65 CHF de taxes fixes restent toujours dus.",
        "source": "https://memento.unige.ch/doc/0346",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "universite-de-lausanne-lausanne",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Une dispense partielle des finances d'inscription peut etre demandee en cas de situation financiere difficile ; elle est evaluee par le Service des affaires sociales et, si elle est accordee, laisse 180 CHF a la charge de l'etudiant. Il faut donc deposer un dossier : rien n'est automatique et rien ne depend de la nationalite. Les beneficiaires de la Bourse de Master de l'UNIL sont exoneres des droits forfaitaires mais restent redevables des taxes semestrielles.",
        "source": "https://www.unil.ch/unil/fr/home/menuinst/etudier/immatriculations-et-inscriptions/etudiants-unil/taxes.html",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "En cas de difficultés financières, vous pouvez demander une dispense partielle des frais d'inscription. Le Service des affaires sociales étudie le dossier. Si elle est accordée, il vous reste 180 CHF à payer. Rien n'est automatique et rien ne dépend de la nationalité. Les titulaires de la Bourse de Master de l'UNIL ne paient pas les droits forfaitaires, mais restent redevables des taxes semestrielles.",
        "source": "https://www.unil.ch/unil/fr/home/menuinst/etudier/immatriculations-et-inscriptions/etudiants-unil/taxes.html",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "universite-de-liege-liege",
    "attendu": {
      "exoneration": {
        "politique": "systematique",
        "detail": "Exemption de la contribution supplementaire de 4 175 EUR accordee d'office, soit sur la NATIONALITE (annexes 1, 2 et 3 de la circulaire ARES — le Senegal y figure), soit sur le NIVEAU D'ETUDES (tout 3e cycle). Aucun dossier a deposer dans ces deux cas. Les taux reduits (835, 374 ou 0 EUR) dependent eux d'une decision de la Direction des allocations d'etudes de la Federation Wallonie-Bruxelles et ne sont, en pratique, pas accessibles a un etudiant international autofinance.",
        "source": "https://www.enseignement.uliege.be/cms/c_17654509/fr/droits-d-inscription",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "systematique",
        "detail": "Vous êtes dispensé d'office de la contribution supplémentaire de 4 175 € dans deux cas : si votre pays figure aux annexes 1, 2 ou 3 de la circulaire ARES, ou si vous êtes en 3e cycle (doctorat). Aucun dossier à déposer. Les taux réduits (835, 374 ou 0 €) dépendent de la Fédération Wallonie-Bruxelles : en pratique, un étudiant international qui finance seul ses études n'y a pas accès.",
        "source": "https://www.enseignement.uliege.be/cms/c_17654509/fr/droits-d-inscription",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "universite-de-lille-lille",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Pas d'exoneration automatique des hors UE : il faut deposer une demande devant la commission d'exoneration de l'universite. Exoneration de plein droit pour les boursiers du gouvernement francais, les boursiers sur criteres sociaux et les pupilles. Depuis le decret n° 2026-385 du 19 mai 2026, les exonerations individuelles sont PLAFONNEES a 30 % des inscrits extracommunautaires en 2026-2027, 25 % en 2027-2028, 20 % ensuite.",
        "source": "https://www.univ-lille.fr/formation/exoneration",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Pas d'exonération automatique hors UE : déposez une demande auprès de la commission d'exonération de l'université. Exonération de plein droit pour les boursiers du gouvernement français, les boursiers sur critères sociaux et les pupilles. Depuis mai 2026, les exonérations individuelles sont limitées à 30 % des inscrits hors UE en 2026-2027, 25 % en 2027-2028, 20 % ensuite.",
        "source": "https://www.univ-lille.fr/formation/exoneration",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "universite-de-lorraine-nancy",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "La premiere annee se paie au tarif differencie plein. A partir de la deuxieme, l'etudiant international qui poursuit le meme cursus sans interruption beneficie d'une exoneration partielle et ne paie plus que les droits communautaires (178 / 255 / 630 EUR). En cas de redoublement ou de changement de cursus, l'exoneration n'est pas automatique et doit etre demandee. Plafond national de 30 % des inscrits hors UE en 2026-2027 (decret n° 2026-385 du 19 mai 2026).",
        "source": "https://www.univ-lorraine.fr/enseignements-et-formations/sinscrire-a-l-universite-de-lorraine/",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "La première année se paie au tarif différencié plein. Dès la deuxième année, si vous poursuivez le même cursus sans interruption, vous avez une exonération partielle : vous payez les droits des étudiants européens (178 €, 255 € ou 630 €). Si vous redoublez ou changez de cursus, elle n'est pas automatique : demandez-la. Un plafond national limite ces exonérations à 30 % des inscrits hors UE en 2026-2027.",
        "source": "https://www.univ-lorraine.fr/enseignements-et-formations/sinscrire-a-l-universite-de-lorraine/",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "universite-de-montpellier-montpellier",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Exonération sur demande après l'inscription, au vu de la situation personnelle ; de plein droit pour boursiers, pupilles et Libanais domiciliés au Liban. L'université dit que le décret limite fortement ses possibilités d'exonération.",
        "source": "https://www.umontpellier.fr/international/etudier-a-letranger/etudiants-internationaux-annee-universitaire-2026-2027",
        "verifieLe": "2026-09-07"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Vous pouvez demander une exonération après votre inscription ; elle dépend de votre situation personnelle. Elle est de droit pour les boursiers, les pupilles de la Nation et les Libanais domiciliés au Liban. L'université précise que le décret limite fortement ses possibilités d'exonération : elle n'est donc pas garantie.",
        "source": "https://www.umontpellier.fr/international/etudier-a-letranger/etudiants-internationaux-annee-universitaire-2026-2027",
        "verifieLe": "2026-09-07"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "universite-de-namur-namur",
    "attendu": {
      "exoneration": {
        "politique": "systematique",
        "detail": "Exoneration de droit de la contribution supplementaire de 4 175 EUR pour les ressortissants des pays listes aux annexes 1, 2 et 3 de la circulaire ARES : aucune demande a deposer, la nationalite suffit. Verifier son pays dans les annexes avant de budgeter. La Cellule sociale des etudiants peut en outre accorder une intervention sur le minerval, un etalement du paiement ou une bourse UNamur, sur criteres.",
        "source": "https://www.unamur.be/fr/inscription/international/droits",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "systematique",
        "detail": "Si votre pays figure aux annexes 1, 2 ou 3 de la circulaire ARES, vous êtes exonéré d'office de la contribution supplémentaire de 4 175 € : votre nationalité suffit, sans demande. Vérifiez votre pays dans ces annexes avant de faire votre budget. La Cellule sociale des étudiants peut aussi, sur critères, aider à payer le minerval (droits d'inscription), étaler le paiement ou accorder une bourse UNamur.",
        "source": "https://www.unamur.be/fr/inscription/international/droits",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "universite-de-rennes-rennes",
    "attendu": {
      "exoneration": {
        "politique": "systematique",
        "detail": "Les tarifs affiches sont DEJA le resultat d'une exoneration partielle generale, maintenue a titre transitoire pour 2026-2027 et appliquee sans demande individuelle. S'y ajoutent des exonerations automatiques (boursiers du gouvernement francais, accords de cooperation avec reciprocite) et des exonerations individuelles sur situation personnelle, dans la limite de 30 % des inscrits hors UE en 2026-2027, puis 25 % et 20 %.",
        "source": "https://formations.univ-rennes.fr/droits-dinscription-bourses-et-exonerations-pour-les-etudiantes-et-etudiants-internationaux",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "systematique",
        "detail": "Les tarifs affichés tiennent déjà compte d'une exonération partielle générale, maintenue à titre transitoire en 2026-2027 et appliquée sans demande. En plus, exonération automatique pour les boursiers du gouvernement français et les accords de coopération avec réciprocité. Exonérations individuelles possibles selon votre situation, dans la limite de 30 % des inscrits hors UE en 2026-2027, puis 25 % et 20 %.",
        "source": "https://formations.univ-rennes.fr/droits-dinscription-bourses-et-exonerations-pour-les-etudiantes-et-etudiants-internationaux",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "universite-de-sfax-sfax",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Aucune reduction pour un candidat individuel : la grille nationale est le tarif. La voie exoneree est celle des CONVENTIONS DE COOPERATION bilaterale — le candidat est presente par son pays (quota), et il est alors dispense des frais d'inscription, parfois avec une bourse. Se renseigner aupres du ministere de l'enseignement superieur de son pays, pas aupres de l'universite tunisienne.",
        "source": "https://www.medecinesfax.org/useruploads/files/affiche%20Programme%20Payant.pdf",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Aucune réduction pour une candidature individuelle : le tarif est celui de la grille nationale. Pour être exonéré, il faut passer par une convention de coopération bilatérale : votre pays vous présente (quota) et vous êtes alors dispensé des frais d'inscription, parfois avec une bourse. Renseignez-vous auprès du ministère de l'Enseignement supérieur de votre pays, pas auprès de l'université.",
        "source": "https://www.medecinesfax.org/useruploads/files/affiche%20Programme%20Payant.pdf",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "universite-de-sousse-sousse",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Aucune reduction pour un candidat individuel : la grille nationale est le tarif. La voie exoneree est celle des CONVENTIONS DE COOPERATION bilaterale — le candidat est presente par son pays (quota), et il est alors dispense des frais d'inscription, parfois avec une bourse. Se renseigner aupres du ministere de l'enseignement superieur de son pays, pas aupres de l'universite tunisienne.",
        "source": "https://www.medecinesfax.org/useruploads/files/affiche%20Programme%20Payant.pdf",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Aucune réduction si vous candidatez seul : vous payez le tarif de la grille nationale. Pour être exonéré, il faut passer par une convention de coopération entre votre pays et la Tunisie : votre pays vous présente, dans la limite d'un quota. Vous ne payez alors pas les frais d'inscription et recevez parfois une bourse. Renseignez-vous auprès du ministère de l'Enseignement supérieur de votre pays, pas auprès de l'université.",
        "source": "https://www.medecinesfax.org/useruploads/files/affiche%20Programme%20Payant.pdf",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "universite-de-strasbourg-strasbourg",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Demande individuelle auprès de la Présidence, instruite par une commission ; exonérations automatiques pour doctorants, réfugiés, résidents longue durée, domicile fiscal en France ; transitoires pour les inscrits 2025-2026.",
        "source": "https://en.unistra.fr/fr/droits-dinscription",
        "verifieLe": "2026-09-07"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Vous pouvez faire une demande individuelle auprès de la Présidence : une commission l'examine. L'exonération est automatique pour les doctorants, les réfugiés, les résidents de longue durée et les personnes dont le domicile fiscal est en France. Des mesures de transition s'appliquent aux étudiants inscrits en 2025-2026.",
        "source": "https://en.unistra.fr/fr/droits-dinscription",
        "verifieLe": "2026-09-07"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "universite-de-toulouse-toulouse",
    "attendu": {
      "exoneration": {
        "politique": "systematique",
        "detail": "L'exoneration partielle est accordee a TOUS les etudiants extracommunautaires assujettis : la demande d'inscription vaut demande d'exoneration, aucune demarche supplementaire n'est requise, et elle est reconduite jusqu'a la fin du cycle, redoublements et prolongations compris. Exonerations totales possibles en plus pour les boursiers, pupilles, refugies, situations de grande precarite ou de handicap, apres evaluation sociale. Reserve : le plafond national de 30 % introduit par le decret du 19 mai 2026 est posterieur a cette deliberation.",
        "source": "https://www.utoulouse.fr/conseils/075-droits-dinscription-differencies-2026-2027",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "systematique",
        "detail": "Exonération partielle pour tous les étudiants hors UE concernés : la demande d'inscription vaut demande d'exonération, sans autre démarche. Elle vaut jusqu'à la fin du cycle, redoublements compris. Exonération totale possible, après évaluation sociale, pour boursiers, pupilles, réfugiés, grande précarité ou handicap. Ces règles datent d'avant le plafond national de 30 % fixé le 19 mai 2026 : à confirmer auprès de l'université.",
        "source": "https://www.utoulouse.fr/conseils/075-droits-dinscription-differencies-2026-2027",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "universite-de-tunis-el-manar-tunis",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Aucune reduction pour un candidat individuel : la grille nationale est le tarif. La voie exoneree est celle des CONVENTIONS DE COOPERATION bilaterale — le candidat est presente par son pays (quota), et il est alors dispense des frais d'inscription, parfois avec une bourse. Se renseigner aupres du ministere de l'enseignement superieur de son pays, pas aupres de l'universite tunisienne.",
        "source": "https://www.medecinesfax.org/useruploads/files/affiche%20Programme%20Payant.pdf",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Aucune réduction pour une candidature individuelle : le tarif est celui de la grille nationale. Pour être exonéré, il faut passer par une convention de coopération bilatérale : votre pays vous présente (quota) et vous êtes alors dispensé des frais d'inscription, parfois avec une bourse. Renseignez-vous auprès du ministère de l'Enseignement supérieur de votre pays, pas auprès de l'université.",
        "source": "https://www.medecinesfax.org/useruploads/files/affiche%20Programme%20Payant.pdf",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "universite-grenoble-alpes-grenoble",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Demande OBLIGATOIRE avec declaration de ressources et examen individuel. L'UGA annonce vouloir appliquer l'exoneration largement en 2026-2027, dans la limite des plafonds reglementaires (30 % des inscrits hors UE, puis 25 % et 20 %). Les etudiants deja exoneres avant l'entree en vigueur du decret gardent l'avantage jusqu'a la fin de leur cycle. Exonerations automatiques maintenues pour les boursiers du gouvernement francais, pupilles de la Nation et mobilites sous accord avec reciprocite.",
        "source": "https://www.univ-grenoble-alpes.fr/etudiants-internationaux-ce-que-change-le-nouveau-decret-sur-les-droits-d-inscription-a-l-uga-1775870.kjsp",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Vous devez déposer une demande avec une déclaration de ressources ; chaque dossier est examiné. L'UGA veut accorder largement l'exonération en 2026-2027, dans la limite des plafonds réglementaires : 30 % des inscrits hors UE, puis 25 % et 20 %. Exonération automatique pour les boursiers du gouvernement français, les pupilles de la Nation et les étudiants en mobilité sous accord de réciprocité.",
        "source": "https://www.univ-grenoble-alpes.fr/etudiants-internationaux-ce-que-change-le-nouveau-decret-sur-les-droits-d-inscription-a-l-uga-1775870.kjsp",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "universite-hassan-ii-casablanca",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "L'universite attribue chaque annee, en collaboration avec l'AMCI, des places pedagogiques « avec ou sans bourses » aux etudiants des pays partenaires titulaires d'au moins un baccalaureat. L'AMCI accorde chaque annee des bourses aux etudiants internationaux, dans le cadre de programmes de cooperation et selon des quotas definis annuellement avec le ministere des Affaires etrangeres ; ces bourses couvrent la duree reglementaire du cycle de formation, de 2 a 7 ans. Les candidatures sont soumises PAR VOIE DIPLOMATIQUE a l'AMCI, via les representations diplomatiques marocaines a l'etranger et les ambassades accreditees au Maroc — seuls les candidats officiellement proposes a l'AMCI peuvent etre inscrits. Le montant de la bourse n'est pas publie.",
        "source": "https://www.univh2c.ma/fr/page/etudiant-international",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Avec l'AMCI, l'université offre des places, avec ou sans bourse, aux étudiants des pays partenaires ayant au moins le baccalauréat. Les bourses de l'AMCI suivent des quotas annuels et couvrent la durée normale des études (2 à 7 ans). Candidature par voie diplomatique : ambassade du Maroc dans votre pays ou ambassade de votre pays au Maroc. Seuls les candidats proposés officiellement à l'AMCI peuvent s'inscrire. Le montant n'est pas publié.",
        "source": "https://www.univh2c.ma/fr/page/etudiant-international",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "universite-libre-de-bruxelles-bruxelles",
    "attendu": {
      "exoneration": {
        "politique": "systematique",
        "detail": "L'exemption du droit majore de 4 175 EUR s'applique D'OFFICE sur la seule nationalite, sans dossier a deposer : il suffit que le pays figure aux annexes 1, 2 ou 3 de la circulaire ARES. Le Senegal est a l'annexe 1 (pays les moins avances, n° 33) de la circulaire n° 2026-001 du 12 fevrier 2026, applicable des 2026-2027. Reste du le minerval ordinaire de 1 194 EUR.",
        "source": "https://www.ares-ac.be/sites/default/files/2026-02/circulaire-ndeg2026-001-du-12-02-2026.pdf",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "systematique",
        "detail": "Vous ne payez pas le droit majoré de 4 175 € si votre pays figure aux annexes 1, 2 ou 3 de la circulaire ARES (l'annexe 1 regroupe les pays les moins avancés). L'exemption est automatique, selon votre nationalité, sans dossier à déposer. La circulaire de février 2026 s'applique dès 2026-2027. Vous payez seulement le minerval ordinaire (frais d'inscription) de 1 194 €.",
        "source": "https://www.ares-ac.be/sites/default/files/2026-02/circulaire-ndeg2026-001-du-12-02-2026.pdf",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "universite-mohammed-v-rabat",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Procedure officielle : les candidatures des etudiants internationaux sont soumises PAR VOIE DIPLOMATIQUE a l'AMCI, dans les delais communiques chaque annee aux representations diplomatiques marocaines a l'etranger et aux ambassades accreditees a Rabat. Apres examen et selection selon les QUOTAS et criteres arretes par l'AMCI et les representants des pays beneficiaires, les dossiers sont transmis au ministere de l'Enseignement superieur via une plateforme dediee. L'inscription se fait ensuite sur presentation d'une autorisation d'inscription electronique a numero de serie unique. La demande se fait donc aupres de l'ambassade du Maroc ou de l'autorite nationale du pays du candidat, JAMAIS directement aupres de l'universite. Plus de 2 890 etudiants internationaux y etaient inscrits en 2024-2025.",
        "source": "https://www.um5.ac.ma/um5/inscription-des-etudiants-internationaux",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Candidatez par la voie diplomatique : auprès de l'ambassade du Maroc ou de l'autorité nationale de votre pays, jamais directement à l'université. Les délais sont communiqués chaque année aux ambassades. L'AMCI sélectionne selon des quotas et des critères fixés avec les pays bénéficiaires, puis transmet au ministère de l'Enseignement supérieur. Vous vous inscrivez ensuite avec une autorisation d'inscription électronique.",
        "source": "https://www.um5.ac.ma/um5/inscription-des-etudiants-internationaux",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "universite-mohammed-vi-polytechnique-benguerir",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Bourse d'etablissement adossee a la Fondation Ibn Rochd, ouverte explicitement aux etudiants marocains ET etrangers. Ce sont des bourses d'excellence academique attribuees sur criteres sociaux (revenus des parents ou tuteurs). Forme : exoneration PARTIELLE des frais de scolarite, jusqu'a 85 % en licence comme en master, et/ou exoneration totale ou partielle des frais de vie et de logement. Le nombre de bourses est fixe chaque annee par la commission des bourses selon le budget. La demande se fait aupres de l'universite elle-meme, pas aupres d'une ambassade. En doctorat, aucun frais et une allocation de 10 000 MAD/mois, non cumulable avec une bourse logement ou restauration.",
        "source": "https://www.fgses-um6p.ma/scholarships-financial-aid",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Bourses d'excellence de l'UM6P et de la Fondation Ibn Rochd, ouvertes aux Marocains et aux étrangers, selon les revenus des parents. Elles couvrent jusqu'à 85 % des frais de scolarité en licence et en master, et/ou tout ou partie du logement et des frais de vie. Nombre fixé chaque année selon le budget. Demande auprès de l'UM6P, pas d'une ambassade. Doctorat : aucun frais et 10 000 MAD par mois (non cumulable avec une bourse logement ou repas).",
        "source": "https://www.fgses-um6p.ma/scholarships-financial-aid",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "universite-oran-1-ahmed-ben-bella-oran",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Aucune exoneration pour un candidat autofinance : la grille « hors quota » est le tarif. La voie gratuite est celle de la BOURSE DU GOUVERNEMENT ALGERIEN, attribuee par quota bilateral via l'autorite nationale ou l'ambassade d'Algerie du pays du candidat — le boursier ne paie pas de droits et percoit une allocation mensuelle (1 350 DA en graduation, 1 650 DA en post-graduation). Les candidatures « hors quota » passent par la plateforme Study in Algeria, du 13 janvier au 30 juin, pour une rentree en octobre.",
        "source": "https://studyinalgeria.dz/pages/17157",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Sans bourse, il n'y a pas d'exonération : vous payez le tarif « hors quota ». La voie gratuite est la bourse du gouvernement algérien, attribuée par quota via l'autorité nationale de votre pays ou l'ambassade d'Algérie dans votre pays. Le boursier ne paie pas de droits et reçoit 1 350 DA par mois en graduation, 1 650 DA en post-graduation. Candidature hors quota sur Study in Algeria, du 13 janvier au 30 juin, pour une rentrée en octobre.",
        "source": "https://studyinalgeria.dz/pages/17157",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "universite-paris-1-pantheon-sorbonne-paris",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Application partielle : paient les droits nationaux les ressortissants des 44 pays les moins avancés (ONU), les réinscrits 2025-2026 dans le même cycle, les doubles diplômes, réfugiés, demandeurs d'asile, boursiers BGF ; les autres extracommunautaires paient les droits différenciés (schéma de mars 2026).",
        "source": "https://international.pantheonsorbonne.fr/sites/default/files/2026-03/Schema_DIF_26-27_03-26_FR_0.pdf",
        "verifieLe": "2026-09-07"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Paient les droits nationaux (même tarif que les étudiants français) : les ressortissants des 44 pays les moins avancés (liste de l'ONU), les étudiants déjà inscrits en 2025-2026 qui continuent dans le même cycle, les doubles diplômes, les réfugiés, les demandeurs d'asile et les boursiers du gouvernement français (BGF). Les autres étudiants hors UE paient les droits différenciés (règles de mars 2026).",
        "source": "https://international.pantheonsorbonne.fr/sites/default/files/2026-03/Schema_DIF_26-27_03-26_FR_0.pdf",
        "verifieLe": "2026-09-07"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "universite-paris-cite-paris",
    "attendu": {
      "fraisScolarite": {
        "source": "https://u-paris.fr/droits-dinscription-tarifs-exonerations/",
        "verifieLe": "2026-09-07",
        "note": "Doctorat au tarif national. Licence et master non repris : la page annonce un moratoire voté le 17 octobre 2025, avant le décret du 19 mai 2026, sans mention du plafond de 30 %.",
        "doctorat": {
          "montant": 398,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "inconnue",
        "detail": "La page annonce un moratoire (droits nationaux pour tous) reconduit pour 2026-2027 par le CA du 17 octobre 2025 — antérieur au décret du 19 mai 2026 qui plafonne les exonérations à 30 %. À recouper auprès de l'université.",
        "source": "https://u-paris.fr/droits-dinscription-tarifs-exonerations/",
        "verifieLe": "2026-09-07"
      }
    },
    "champs": {
      "fraisScolarite": {
        "source": "https://u-paris.fr/droits-dinscription-tarifs-exonerations/",
        "verifieLe": "2026-09-23",
        "note": "2026-2027 : le conseil d'administration du 17 octobre 2025 reconduit le moratoire sur les droits différenciés. Les étudiants extracommunautaires sont exonérés partiellement et paient les droits des étudiants européens : 178 € en licence, 255 € en master. La page rappelle que le décret du 19 mai 2026 ne maintient que les exonérations annoncées avant le 21 mai 2026, ce qui est le cas de ce moratoire. Doctorat au tarif national : 398 €.",
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
        "detail": "Pour 2026-2027, l'université reconduit son moratoire : les étudiants hors Union européenne sont exonérés partiellement et paient les mêmes droits que les Européens, 178 € en licence et 255 € en master.",
        "source": "https://u-paris.fr/droits-dinscription-tarifs-exonerations/",
        "verifieLe": "2026-09-23"
      }
    },
    "motif": "Frais de scolarité officiels trouvés pour une université qui n'en affichait pas (demande de Charles du 2026-09-22). Montant, devise, source et date de vérification ; le détail et les choix de montant sont dans la note. Politique d'exonération recherchée sur la source officielle (demande de Charles du 2026-09-22 : améliorer les exonérations « inconnue ») ; citations clés recontrôlées dans le navigateur le 2026-09-23. Texte de l'infobulle écrit pour l'étudiant. Politique : inconnue -> systematique."
  },
  {
    "collection": "universities",
    "id": "universite-paris-dauphine-psl-paris",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Boursiers CROUS ou du gouvernement français, réfugiés, handicap, pupilles : exonérés. Extracommunautaires en master diplôme national : exonération partielle (255 €) sur demande motivée.",
        "source": "https://dauphine.psl.eu/formations/scolarite/droits-et-tarifs",
        "verifieLe": "2026-09-07"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Exonération pour les boursiers du CROUS ou du gouvernement français, les réfugiés, les étudiants en situation de handicap et les pupilles. Hors Union européenne, en master diplôme national, une exonération partielle est possible sur demande motivée, lors de l'inscription administrative : vous payez alors 255 € au lieu de 3 950 €.",
        "source": "https://dauphine.psl.eu/formations/scolarite/droits-et-tarifs",
        "verifieLe": "2026-09-07"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "universite-paris-saclay-orsay",
    "attendu": {
      "exoneration": {
        "politique": "systematique",
        "detail": "Exoneration partielle presentee comme une politique d'attractivite s'appliquant aux etudiants extracommunautaires concernes par les droits differencies : elle porte les montants differencies au niveau des montants nationaux, selon la deliberation n° CA-2026-013 du 3 fevrier 2026. Des demandes complementaires peuvent etre deposees aupres de la commission locale d'exoneration de la composante. Reserve : le plafond national de 30 % du decret du 19 mai 2026 est posterieur a cette deliberation.",
        "source": "https://www.universite-paris-saclay.fr/admission/droits-dinscription-de-luniversite-paris-saclay",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "systematique",
        "detail": "Si vous êtes hors Union européenne et soumis aux droits différenciés, Paris-Saclay vous accorde une exonération partielle : vous payez le tarif national, comme un étudiant français. Vous pouvez aussi faire une demande complémentaire auprès de la commission d'exonération de votre composante (faculté ou école). Attention : cette décision date de février 2026, avant le plafond national de 30 % fixé en mai 2026. À confirmer auprès de l'université.",
        "source": "https://www.universite-paris-saclay.fr/admission/droits-dinscription-de-luniversite-paris-saclay",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "universite-senghor-alexandrie",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "L'Universite Senghor, operateur direct de la Francophonie, a son propre statut de boursier : le boursier ne paie pas les 3 700 EUR et recoit hebergement en studio sur le campus, un repas quotidien, une assurance medicale, le transport et une allocation mensuelle de 4 000 livres egyptiennes. LIMITE EXPLICITE lue dans l'avis : l'universite N'OFFRE PAS de bourse de frais de vie pour l'admission directe en deuxieme annee de master — ce statut concerne le recrutement en cycle complet. La demande passe par la plateforme de candidature, apres selection sur dossier puis reussite au test d'admission (100 EUR).",
        "source": "https://candidature.usenghor.org/details?view=programme&cid=128",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Les boursiers de l'Université Senghor ne paient pas les 3 700 € de frais. Ils reçoivent un studio sur le campus, un repas par jour, une assurance maladie, le transport et 4 000 livres égyptiennes par mois. Ce statut concerne le cycle complet : pas de bourse pour les frais de vie si vous êtes admis directement en 2e année de master. Candidature sur la plateforme de l'université : sélection sur dossier, puis test d'admission (100 €).",
        "source": "https://candidature.usenghor.org/details?view=programme&cid=128",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "universite-sorbonne-paris-nord-villetaneuse",
    "attendu": {
      "exoneration": {
        "politique": "inconnue",
        "detail": "L'universite applique les droits differencies et declare devoir appliquer le decret n° 2026-385 du 19 mai 2026. Une deliberation de la CFVU s'est prononcee favorablement sur une exoneration partielle pour 2026-2027, mais ses modalites devaient etre arretees par le CA du 10 juillet 2026 et ne sont pas publiees. A verifier directement aupres de la scolarite avant de budgeter.",
        "source": "https://inscriptions.univ-spn.fr/",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Exonération partielle des droits différenciés possible sur dossier en 2026-2027, dans la limite de 30 % des inscrits concernés. Critères : situation sociale, ressources, pays parmi les moins avancés selon l'ONU, notamment. Dossier à déposer en début d'année universitaire.",
        "source": "https://inscriptions.univ-spn.fr/exoneration/",
        "verifieLe": "2026-09-23"
      }
    },
    "motif": "Politique d'exonération recherchée sur la source officielle (demande de Charles du 2026-09-22 : améliorer les exonérations « inconnue ») ; citations clés recontrôlées dans le navigateur le 2026-09-23. Texte de l'infobulle écrit pour l'étudiant. Politique : inconnue -> possible_plafonnee."
  },
  {
    "collection": "universities",
    "id": "universiti-kebangsaan-malaysia-kuala-lumpur",
    "attendu": {
      "exoneration": {
        "politique": "inconnue",
        "detail": "Les grilles tarifaires ne mentionnent aucune exoneration pour les internationaux, et aucune page de bourses de l'universite n'a ete consultee.",
        "source": "https://shape.ukm.my/storage/lampiran/struktur_yuran/FST/pasca/strukturyuran_FST_UKMi_pasca_F_int.pdf",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Doctorat en recherche : la bourse Zamalah de l'UKM, ouverte aux étrangers, paie les frais d'admission et de scolarité des trois premiers semestres au plus, selon vos résultats. En master, elle est réservée aux Malaisiens.",
        "source": "https://www.ukm.my/akademik/wp-content/uploads/2026/04/Appendix-A_Guidelines-for-Zamalah-Research-Scheme.pdf",
        "verifieLe": "2026-09-23"
      }
    },
    "motif": "Politique d'exonération recherchée sur la source officielle (demande de Charles du 2026-09-22 : améliorer les exonérations « inconnue ») ; citations clés recontrôlées dans le navigateur le 2026-09-23. Texte de l'infobulle écrit pour l'étudiant. Politique : inconnue -> possible_plafonnee."
  },
  {
    "collection": "universities",
    "id": "universiti-malaya-kuala-lumpur",
    "attendu": {
      "exoneration": {
        "politique": "inconnue",
        "detail": "Les brochures tarifaires ne mentionnent aucune exoneration ni bourse pour les internationaux, et aucune page de bourses de l'universite n'a ete consultee.",
        "source": "https://study.um.edu.my/doc/tution-fee/Fee%20Structure,%20PG,%20International%20-%20Updated%2022%20Oct%202025.pdf",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Doctorat en recherche : la UM Bright Scholarship, bourse complète de l'université, est ouverte aux candidats internationaux. En master ou en doctorat, un poste d'assistant de recherche (UMSS) peut aussi donner droit à une exonération des frais de scolarité, selon des critères d'éligibilité.",
        "source": "https://aasd.um.edu.my/financial-aid-for-postgraduate",
        "verifieLe": "2026-09-23"
      }
    },
    "motif": "Politique d'exonération recherchée sur la source officielle (demande de Charles du 2026-09-22 : améliorer les exonérations « inconnue ») ; citations clés recontrôlées dans le navigateur le 2026-09-23. Texte de l'infobulle écrit pour l'étudiant. Politique : inconnue -> possible_plafonnee."
  },
  {
    "collection": "universities",
    "id": "university-of-amsterdam-amsterdam",
    "attendu": {
      "exoneration": {
        "politique": "aucune",
        "detail": "La page des frais ne prevoit AUCUNE reduction liee au pays d'origine ni aux ressources. Le passage au tarif legal (2 694 EUR) est strictement reserve aux nationalites UE/EEE/Suisse/Suriname et a certains titres de sejour neerlandais ; un etudiant africain venu avec un visa d'etudes n'y a pas droit. Seule voie de reduction : les bourses, qui relevent d'une candidature separee.",
        "source": "https://www.uva.nl/en/education/fees-and-funding/tuition-fees/tuition-fees.html",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "aucune",
        "detail": "Aucune réduction selon le pays d'origine ou les ressources. Le tarif légal (2 694 €) est réservé aux ressortissants de l'UE, de l'EEE, de la Suisse et du Suriname, et à certains titres de séjour néerlandais. Avec un simple visa d'études, vous n'y avez pas droit. Seule façon de payer moins : obtenir une bourse, avec une candidature séparée.",
        "source": "https://www.uva.nl/en/education/fees-and-funding/tuition-fees/tuition-fees.html",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "university-of-british-columbia-vancouver",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Bourses d'entrée pour internationaux (dont l'International Major Entrance Scholarship, renouvelable), attribuées au mérite et sur besoin financier déclaré à la candidature ; montants non relevés sur cette page.",
        "source": "https://students.ubc.ca/enrolment/finances/tuition-fees",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "UBC propose des bourses d'entrée aux étudiants internationaux, dont l'International Major Entrance Scholarship, renouvelable. Elles sont attribuées au mérite et selon le besoin financier déclaré lors de la candidature. Vérifiez les montants sur le site de l'université.",
        "source": "https://students.ubc.ca/enrolment/finances/tuition-fees",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "university-of-california-berkeley-berkeley",
    "attendu": {
      "exoneration": {
        "politique": "aucune",
        "detail": "Université publique de Californie : l'aide financière fédérale et d'État est réservée aux résidents ; elle « couvre les frais pour plus d'un tiers des étudiants de Berkeley », mais les internationaux en sont exclus. Restent quelques bourses privées au mérite.",
        "source": "https://financialaid.berkeley.edu/cost-attendance/",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "aucune",
        "detail": "L'aide financière fédérale et celle de l'État de Californie sont réservées aux résidents : les étudiants internationaux n'y ont pas droit. Il reste quelques bourses privées au mérite.",
        "source": "https://financialaid.berkeley.edu/cost-attendance/",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "university-of-cape-town-le-cap",
    "attendu": {
      "exoneration": {
        "politique": "inconnue",
        "detail": "Aucune exonération de l'international term fee lue dans le livret ; l'UCT propose des bourses pour étudiants africains (dont Mastercard Foundation) — non relevées sur cette source.",
        "source": "https://uct.ac.za/international/student-support/fees",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "L'UCT gère avec la Mastercard Foundation des bourses complètes pour les étudiants d'un pays africain, Afrique du Sud comprise : frais, ordinateur, logement sur le campus, frais de vie, assurance santé, visa et un voyage par an. Elles concernent la licence, l'année honours et le master. Candidature en septembre et octobre, après votre demande d'admission à l'UCT.",
        "source": "https://www.news.uct.ac.za/article/-2026-08-21-the-mastercard-foundation-scholars-program-is-looking-for-you",
        "verifieLe": "2026-09-23"
      }
    },
    "motif": "Politique d'exonération recherchée sur la source officielle (demande de Charles du 2026-09-22 : améliorer les exonérations « inconnue ») ; citations clés recontrôlées dans le navigateur le 2026-09-23. Texte de l'infobulle écrit pour l'étudiant. Politique : inconnue -> possible_plafonnee."
  },
  {
    "collection": "universities",
    "id": "university-of-debrecen-debrecen",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Aucune reduction de droit pour un candidat autofinance. La bourse Stipendium Hungaricum, ouverte aux ressortissants de nombreux pays africains via un accord bilateral, couvre en revanche la TOTALITE des droits, plus une allocation mensuelle, le logement et l'assurance ; elle se demande aupres de l'autorite nationale du pays du candidat, pas aupres de l'universite. Debrecen gere aussi les programmes Scholarship for Christian Young People et Diaspora.",
        "source": "https://edu.unideb.hu/p/tuition-fee-application-entrance-fee",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Si vous financez vous-même vos études, aucune réduction n'est accordée d'office. La bourse Stipendium Hungaricum, ouverte aux étudiants de nombreux pays par des accords bilatéraux, couvre tous les droits, plus une allocation mensuelle, le logement et l'assurance. Elle se demande auprès de l'autorité nationale de votre pays, pas auprès de l'université. Debrecen gère aussi les programmes Scholarship for Christian Young People et Diaspora.",
        "source": "https://edu.unideb.hu/p/tuition-fee-application-entrance-fee",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "university-of-delhi-delhi",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Le document indique une exoneration ciblee : les candidats tibetains sont dispenses des frais d'inscription universitaires et des frais additionnels dus au college ou au departement au titre d'etudiant etranger. Aucune exoneration generale pour les autres nationalites n'est mentionnee.",
        "source": "https://sscbs.du.ac.in/wp-content/uploads/2024/08/Foreign-Students-Fee-Structure.pdf",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Seuls les candidats tibétains sont dispensés des frais d'inscription de l'université et des frais supplémentaires demandés aux étudiants étrangers par le collège ou le département. Aucune exonération générale n'est indiquée pour les autres nationalités.",
        "source": "https://sscbs.du.ac.in/wp-content/uploads/2024/08/Foreign-Students-Fee-Structure.pdf",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "university-of-edinburgh-edinburgh",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Pas d'exonération sur dossier ; bourses au mérite et bourses par pays (dont pour l'Afrique) à chercher dans le moteur de bourses de l'université.",
        "source": "https://www.ed.ac.uk/studying/international/finances",
        "verifieLe": "2026-09-12"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Il n'y a pas d'exonération sur dossier. Cherchez les bourses au mérite et les bourses par pays (dont certaines pour l'Afrique) dans le moteur de recherche de bourses de l'université.",
        "source": "https://www.ed.ac.uk/studying/international/finances",
        "verifieLe": "2026-09-12"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "university-of-gothenburg-goteborg",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Aucune exoneration automatique sur la nationalite. L'universite prevoit une procedure de reevaluation du statut payant si l'etudiant estime remplir les conditions d'exemption (titre de sejour suedois notamment), sur pieces — ce qui ne concerne pas un candidat arrivant directement du Senegal. Une bourse maison, la Axel Adler Scholarship, est mentionnee sur la page des frais ; elle suppose une candidature et une selection.",
        "source": "https://www.gu.se/en/study-in-gothenburg/apply/tuition-fees",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Aucune exonération automatique selon la nationalité. Si vous pensez remplir les conditions d'exemption (par exemple avec un titre de séjour suédois), vous pouvez demander un réexamen de votre statut payant, justificatifs à l'appui. Cela ne concerne pas un candidat qui arrive directement de l'étranger. L'université propose aussi sa propre bourse, l'Axel Adler Scholarship, sur candidature et sélection.",
        "source": "https://www.gu.se/en/study-in-gothenburg/apply/tuition-fees",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "university-of-lisbon-lisbonne",
    "attendu": {
      "exoneration": {
        "politique": "inconnue",
        "detail": "Aucune reduction applicable a un etudiant africain autofinance n'a ete lue. La page centrale des propinas liste des deliberations d'appui (etudiants ukrainiens, syriens, situations d'urgence humanitaire) et un document d'incitations pour les etudiants des pays de langue officielle portugaise, mais aucun de ces textes n'a ete ouvert : impossible de dire s'ils ouvrent droit a une reduction, ni si elle serait automatique ou sur dossier.",
        "source": "https://www.ulisboa.pt/info/propinas-e-emolumentos",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "inconnue",
        "detail": "L'université ne publie pas de bourse ni de réduction des frais pour un étudiant international autofinancé. Des mesures existent pour les étudiants des pays de langue portugaise. Renseignez-vous à estudanteinternacional@ulisboa.pt.",
        "source": "https://www.ulisboa.pt/info/propinas-e-emolumentos",
        "verifieLe": "2026-09-23"
      }
    },
    "motif": "Politique d'exonération recherchée sur la source officielle (demande de Charles du 2026-09-22 : améliorer les exonérations « inconnue ») ; citations clés recontrôlées dans le navigateur le 2026-09-23. Texte de l'infobulle écrit pour l'étudiant. Politique : inconnue -> inconnue."
  },
  {
    "collection": "universities",
    "id": "university-of-miskolc-miskolc",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "La bourse Stipendium Hungaricum couvre la TOTALITE des droits plus allocation, logement et assurance, mais elle se demande aupres de l'autorite nationale du pays du candidat. En propre, Miskolc annonce des programmes de bourses concus specifiquement pour les etudiants payants, dont ni le taux de couverture ni le plafond n'ont pu etre verifies.",
        "source": "https://www.uni-miskolc.hu/en/admission/",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "La bourse Stipendium Hungaricum couvre tous les droits, plus une allocation, le logement et l'assurance. Elle se demande auprès de l'autorité nationale de votre pays. Miskolc annonce aussi des bourses pour les étudiants qui paient leurs frais, mais leur taux de couverture et leur plafond sont à confirmer auprès de l'université.",
        "source": "https://www.uni-miskolc.hu/en/admission/",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "university-of-oxford-oxford",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Pas d'exonération sur dossier. Pour master et doctorat, le Clarendon Fund attribue plus de 200 bourses complètes par an (frais + allocation de vie) sur le seul mérite, toutes nationalités ; tout candidat déposant avant l'échéance de décembre/janvier est examiné automatiquement. Reach Oxford et d'autres fonds existent pour la licence.",
        "source": "https://www.ox.ac.uk/admissions/graduate/fees-and-funding/funding/clarendon",
        "verifieLe": "2026-09-12"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Pas d'exonération sur dossier. En master et doctorat, le Clarendon Fund donne plus de 200 bourses complètes par an (frais et allocation de vie), au seul mérite, pour toutes les nationalités. Si vous candidatez avant la date limite de décembre ou janvier, votre dossier est examiné automatiquement. En licence, il existe Reach Oxford et d'autres fonds.",
        "source": "https://www.ox.ac.uk/admissions/graduate/fees-and-funding/funding/clarendon",
        "verifieLe": "2026-09-12"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "university-of-pecs-pecs",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "La faculte precise elle-meme le mecanisme du Stipendium Hungaricum : la PRESELECTION est faite par le ministere de l'education du pays d'origine ou par la commission de bourses qu'il designe, et seuls les ressortissants de pays lies a la Hongrie par un accord bilateral en vigueur peuvent postuler. La bourse couvre la totalite des droits plus allocation, logement et assurance. La faculte n'annonce aucune reduction chiffree en propre.",
        "source": "https://ktk.pte.hu/en/felvetelizok/felveteli/felveteli-kisokos/finances-fees",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Pour le Stipendium Hungaricum, la présélection est faite par le ministère de l'Éducation de votre pays ou par la commission de bourses qu'il désigne. Seuls les ressortissants de pays liés à la Hongrie par un accord bilatéral en vigueur peuvent postuler. La bourse couvre la totalité des frais, plus une allocation, le logement et l'assurance. La faculté n'annonce aucune réduction chiffrée propre.",
        "source": "https://ktk.pte.hu/en/felvetelizok/felveteli/felveteli-kisokos/finances-fees",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "university-of-porto-porto",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Il ne s'agit pas d'une exoneration generale mais d'un TARIF REDUIT de 45 % reserve aux ressortissants des pays de la Communaute des pays de langue portugaise (1 925 / 2 200 / 3 300 EUR). Le tableau officiel l'affiche comme une colonne tarifaire liee a la nationalite, mais la procedure permettant de s'en prevaloir n'a pas ete lue : impossible d'affirmer qu'elle est accordee sans demarche. Aucune reduction lue pour les autres pays africains.",
        "source": "https://sigarra.up.pt/flup/pt/p/propinas_ei",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Pas d'exonération générale, mais un tarif réduit de 45 % pour les ressortissants de la Communauté des pays de langue portugaise (CPLP) : 1 925 €, 2 200 € ou 3 300 € selon la formation. La démarche pour l'obtenir n'est pas précisée : renseignez-vous auprès de l'université. Aucune réduction n'est connue pour les autres nationalités.",
        "source": "https://sigarra.up.pt/flup/pt/p/propinas_ei",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "university-of-rwanda-kigali",
    "attendu": {
      "exoneration": {
        "politique": "inconnue",
        "detail": "Aucune politique de bourse ou d'exoneration destinee aux etudiants etrangers autofinances n'a ete lue sur les pages officielles consultees. La grille du College des sciences et technologies distingue uniquement les etudiants finances par le gouvernement rwandais et les etudiants prives, sans dispositif ouvert aux non-Rwandais. Ne pas supposer une exoneration : a verifier directement aupres de l'universite.",
        "source": "https://cst.ur.ac.rw/spip.php?article148",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "L'université du Rwanda gère avec la Mastercard Foundation des bourses complètes : frais de scolarité, logement sur le campus, ordinateur et fournitures. Elles sont ouvertes aux citoyens de tout pays africain, aux réfugiés et aux jeunes déplacés en Afrique. 1 200 boursiers sur dix ans, dont 10 % en master. Candidature sur le portail du programme.",
        "source": "https://mcfsp.ur.ac.rw/",
        "verifieLe": "2026-09-23"
      }
    },
    "motif": "Politique d'exonération recherchée sur la source officielle (demande de Charles du 2026-09-22 : améliorer les exonérations « inconnue ») ; citations clés recontrôlées dans le navigateur le 2026-09-23. Texte de l'infobulle écrit pour l'étudiant. Politique : inconnue -> possible_plafonnee."
  },
  {
    "collection": "universities",
    "id": "university-of-science-and-technology-of-china-hefei",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "USTC Fellowship, bourse propre demandee directement dans le systeme de candidature en ligne : elle couvre les frais de scolarite, l'assurance, une allocation mensuelle (2 500 CNY en licence, jusqu'a 3 000 en master, jusqu'a 7 000 en doctorat) et une aide au logement. En parallele, bourse du gouvernement chinois a demander aupres de l'ambassade ou du consulat de Chine ; avec l'attestation de financement, le candidat peut demander une pre-admission a l'USTC, l'admission definitive n'etant envoyee qu'une fois la bourse obtenue. Aucune exoneration automatique.",
        "source": "https://ic.ustc.edu.cn/?abroad=333",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "La USTC Fellowship se demande lors de la candidature en ligne. Elle couvre les frais de scolarité, l'assurance, une aide au logement et une allocation mensuelle : 2 500 CNY en licence, jusqu'à 3 000 en master, jusqu'à 7 000 en doctorat. La bourse du gouvernement chinois se demande à l'ambassade ou au consulat de Chine ; avec son attestation, demandez une pré-admission. L'admission définitive suit l'obtention de la bourse. Rien n'est automatique.",
        "source": "https://ic.ustc.edu.cn/?abroad=333",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "university-of-szeged-szeged",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "La bourse Stipendium Hungaricum couvre la TOTALITE des droits plus allocation, logement et assurance, mais elle se demande aupres de l'autorite nationale du pays du candidat. En propre, la faculte d'economie a ouvert une bourse maison, la SZTE GTK Tuition Support Scholarship (annonce du 2 septembre 2026) ; son montant et son plafond ne sont pas publies sur la page des frais.",
        "source": "https://eco.u-szeged.hu/english/training-programmes/programmes-for-international-students/business-administration-and-management-bsc/fees-and-scholarships/fees-and-scholarships",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "La bourse Stipendium Hungaricum paie tous les frais de scolarité, plus une allocation, le logement et l'assurance. Elle se demande auprès de l'autorité nationale de votre pays. La faculté d'économie propose aussi sa propre bourse, la SZTE GTK Tuition Support Scholarship (annoncée le 2 septembre 2026). Son montant et ses limites ne sont pas publiés : renseignez-vous auprès de l'université.",
        "source": "https://eco.u-szeged.hu/english/training-programmes/programmes-for-international-students/business-administration-and-management-bsc/fees-and-scholarships/fees-and-scholarships",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "university-of-the-witwatersrand-johannesburg",
    "attendu": {
      "exoneration": {
        "politique": "aucune",
        "detail": "Aucune exoneration automatique pour les internationaux : au contraire, une MAJORATION — licence au double du tarif local hors Afrique australe, et droit d'inscription international de 6 970 ZAR/an en cycle superieur. L'universite dispose d'un bureau d'aide financiere et de bourses dont les conditions d'eligibilite pour les etrangers n'ont pas ete lues.",
        "source": "https://www.wits.ac.za/internationalstudents/financial-information/fee-structure/",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "aucune",
        "detail": "Aucune exonération automatique pour les internationaux : les frais sont au contraire majorés. En licence, si vous venez d'un pays hors Afrique australe, vous payez le double du tarif local. En cycle supérieur, un droit d'inscription international de 6 970 ZAR par an s'applique. L'université a un bureau d'aide financière et de bourses : demandez-lui les conditions pour les étudiants étrangers.",
        "source": "https://www.wits.ac.za/internationalstudents/financial-information/fee-structure/",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "university-of-tokyo-tokyo",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Exonération totale pour les boursiers MEXT. Pour les autres, un dispositif d'exemption de scolarité et d'admission existe sur dossier (difficulté financière + résultats), contingenté par semestre.",
        "source": "https://www.u-tokyo.ac.jp/en/prospective-students/tuition_fees.html",
        "verifieLe": "2026-09-12"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Les boursiers du gouvernement japonais (MEXT) sont totalement exonérés. Les autres étudiants peuvent demander, sur dossier, une exemption des frais de scolarité et d'admission. Elle tient compte des difficultés financières et des résultats, et le nombre de places est limité chaque semestre.",
        "source": "https://www.u-tokyo.ac.jp/en/prospective-students/tuition_fees.html",
        "verifieLe": "2026-09-12"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "university-of-toronto-toronto",
    "attendu": {
      "exoneration": {
        "politique": "aucune",
        "detail": "« Établissement financé sur fonds publics, l'Université ne peut pas offrir d'aide financière sur besoin aux étudiants internationaux ». Seules des bourses au mérite existent (dont Lester B. Pearson, complète, très sélective, sur nomination du lycée).",
        "source": "https://future.utoronto.ca/finances/fees/",
        "verifieLe": "2026-09-12"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "aucune",
        "detail": "L'université est financée par des fonds publics : elle ne peut pas donner d'aide financière selon les besoins aux étudiants internationaux. Il existe seulement des bourses au mérite, dont la bourse Lester B. Pearson. C'est une bourse complète, mais très sélective : vous devez être proposé par votre lycée.",
        "source": "https://future.utoronto.ca/finances/fees/",
        "verifieLe": "2026-09-12"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "university-of-warsaw-varsovie",
    "attendu": {
      "exoneration": {
        "politique": "inconnue",
        "detail": "Le tableau officiel montre que les ressortissants de l'UE, de l'EEE et de Suisse sont gratuits sur une partie des programmes, mais il ne dit rien des conditions d'exemption ouvertes aux non-UE : la page renvoie a une ordonnance du recteur sur les conditions et la procedure d'exemption, non ouverte. En Pologne, les dispositifs nationaux qui exonerent sont la Carte de Polonais, le statut de resident permanent ou de resident longue duree de l'UE, et les bourses NAWA — aucun ne s'applique par defaut a un Senegalais autofinance, mais cela n'a pas ete verifie sur une page de l'universite.",
        "source": "https://rekrutacja.uw.edu.pl/en/application-and-tuition-fees/",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Un étudiant étranger peut demander une exonération totale ou partielle des frais, ou un paiement en plusieurs fois, par une demande motivée transmise au recteur : excellents résultats, raisons humanitaires, intégration en Pologne. Décision au cas par cas, pour une année au plus.",
        "source": "https://monitor.uw.edu.pl/Lists/Uchway/Attachments/5977/M.2021.214.Obw.17%20EN.pdf",
        "verifieLe": "2026-09-23"
      }
    },
    "motif": "Politique d'exonération recherchée sur la source officielle (demande de Charles du 2026-09-22 : améliorer les exonérations « inconnue ») ; citations clés recontrôlées dans le navigateur le 2026-09-23. Texte de l'infobulle écrit pour l'étudiant. Politique : inconnue -> possible_plafonnee."
  },
  {
    "collection": "universities",
    "id": "university-of-zurich-zurich",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Aucune exoneration automatique : le supplement etranger s'applique d'office sur la nationalite, dans le sens DEFAVORABLE. Les etudiants en difficulte financiere peuvent s'adresser au bureau d'aide financiere, mais la page pose une restriction lourde pour un candidat africain : l'universite ne peut soutenir financierement que les futurs etudiants de master TITULAIRES D'UN BACHELOR SUISSE. Un Senegalais candidatant depuis son pays n'y est donc, en pratique, pas eligible avant son arrivee.",
        "source": "https://www.uzh.ch/cmsssl/en/studies/application/fees.html",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Pas d'exonération automatique : les étudiants étrangers paient au contraire un supplément. En cas de difficultés financières, vous pouvez contacter le bureau d'aide financière. Mais pour les futurs étudiants, l'université ne peut aider que les candidats en master déjà titulaires d'un bachelor suisse. Si vous postulez depuis l'étranger, vous n'y avez donc en pratique pas droit.",
        "source": "https://www.uzh.ch/cmsssl/en/studies/application/fees.html",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "usiu-africa-nairobi",
    "attendu": {
      "exoneration": {
        "politique": "aucune",
        "detail": "Aucune exoneration pour etudiants internationaux n'est mentionnee sur la page des frais. Universite privee : le tarif non-Est-africain est MAJORE de 30 %, pas reduit. La page des bourses de l'universite n'a pas ete consultee.",
        "source": "https://www.usiu.ac.ke/2211/tuition-fees/",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "aucune",
        "detail": "Aucune exonération pour les étudiants internationaux n'est mentionnée sur la page des frais. C'est une université privée : si vous ne venez pas d'Afrique de l'Est, le tarif est majoré de 30 %. Renseignez-vous directement auprès de l'université sur ses bourses.",
        "source": "https://www.usiu.ac.ke/2211/tuition-fees/",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "usthb-alger",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Aucune exoneration pour un candidat autofinance : la grille « hors quota » est le tarif. La voie gratuite est celle de la BOURSE DU GOUVERNEMENT ALGERIEN, attribuee par quota bilateral via l'autorite nationale ou l'ambassade d'Algerie du pays du candidat — le boursier ne paie pas de droits et percoit une allocation mensuelle (1 350 DA en graduation, 1 650 DA en post-graduation). Les candidatures « hors quota » passent par la plateforme Study in Algeria, du 13 janvier au 30 juin, pour une rentree en octobre.",
        "source": "https://studyinalgeria.dz/pages/17157",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Si vous financez vous-même vos études, aucune exonération : vous payez le tarif « hors quota ». Pour étudier gratuitement, il faut la bourse du gouvernement algérien, attribuée par quota via les autorités de votre pays ou l'ambassade d'Algérie. Le boursier ne paie pas de droits et reçoit 1 350 DA par mois en graduation, 1 650 DA en post-graduation. Candidatures « hors quota » sur Study in Algeria, du 13 janvier au 30 juin, rentrée en octobre.",
        "source": "https://studyinalgeria.dz/pages/17157",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "waseda-university-tokyo",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Deux bourses sont attribuees AVANT l'inscription, sur les seuls resultats de l'admission, sans candidature ni formulaire prealable — le candidat est informe pendant la procedure d'inscription : une bourse reservee aux admis internationaux, 500 000 JPY par an pendant 2 ans, et une exoneration partielle de 50 % des frais annuels pendant 1 an pour les internationaux autofinances. AUCUNE ne couvre donc la totalite du cursus ni la totalite des frais. Apres l'inscription, Waseda declare plus de 100 bourses, internes et externes, toutes sous forme de dons non remboursables, et se situe en tete des universites japonaises pour le nombre de beneficiaires ; l'acces passe par une inscription en ligne obligatoire au debut de chaque semestre. Eligibilite stricte : seuls les etudiants internationaux autofinances titulaires du statut de sejour « Student » et inscrits dans un cursus diplomant peuvent postuler. AVERTISSEMENT EXPLICITE DE L'UNIVERSITE, a transmettre tel quel : toutes les bourses sont soumises a selection, la concurrence est forte et il est possible de n'en obtenir aucune — la faculte recommande fermement de disposer d'un plan de financement solide AVANT de partir pour le Japon. Beaucoup de bourses exterieures exigent en outre un bon niveau de japonais.",
        "source": "https://www.waseda.jp/fire/sils/en/applicants/tuitions/",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Avant l'inscription, deux aides sont accordées sur vos résultats d'admission, sans demande : 500 000 JPY par an pendant 2 ans ; une réduction de 50 % des frais annuels pendant 1 an. Aucune ne couvre tous les frais. Ensuite, plus de 100 bourses sont ouvertes aux autofinancés en cursus diplômant (statut de séjour « Student »), sur inscription en ligne chaque semestre. Vous pouvez n'en obtenir aucune : prévoyez un financement avant de partir.",
        "source": "https://www.waseda.jp/fire/sils/en/applicants/tuitions/",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "wuhan-university-wuhan",
    "attendu": {
      "exoneration": {
        "politique": "inconnue",
        "detail": "Le guide d'admission 2026 renvoie a une piece jointe Word sur les bourses qui n'a pas pu etre ouverte, et la page des frais ne decrit aucune exoneration. La bourse du gouvernement chinois (CSC) reste la voie generale, a demander via l'ambassade de Chine ou campuschina.org ; les bourses propres a Wuhan n'ont pas ete verifiees.",
        "source": "https://admission.whu.edu.cn/info/1121/5802.htm",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "inconnue",
        "detail": "Wuhan verse chaque année à 100 nouveaux étudiants autofinancés une aide unique de 4 000 yuans en licence, 6 000 en master et 8 000 en doctorat, après l'inscription. Ce n'est pas une réduction des frais. Demande du 5 mars au 20 mai sur le site d'admission. Pour une bourse complète, visez la bourse CSC.",
        "source": "https://admission.whu.edu.cn/info/1271/1671.htm",
        "verifieLe": "2026-09-23"
      }
    },
    "motif": "Politique d'exonération recherchée sur la source officielle (demande de Charles du 2026-09-22 : améliorer les exonérations « inconnue ») ; citations clés recontrôlées dans le navigateur le 2026-09-23. Texte de l'infobulle écrit pour l'étudiant. Politique : inconnue -> inconnue."
  },
  {
    "collection": "universities",
    "id": "xiamen-university-xiamen",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "L'universite propose les bourses du gouvernement chinois (CSC), les bourses des instituts Confucius, les bourses du gouvernement provincial du Fujian, les bourses Xiamen Tan Kah Kee et ses bourses propres. Les bourses COMPLETES couvrent scolarite, logement, allocation de subsistance et assurance ; les bourses PARTIELLES ne couvrent qu'une partie. Attribution sur dossier. S'y ajoute une exoneration statutaire : les doctorants ne paient pas de frais en 4e annee.",
        "source": "https://admissions.xmu.edu.cn/Admissions/Costs.htm",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Bourses sur dossier : gouvernement chinois (CSC), instituts Confucius, gouvernement de la province du Fujian, bourses Xiamen Tan Kah Kee et bourses de l'université. Les bourses complètes couvrent scolarité, logement, allocation de vie et assurance. Les bourses partielles n'en couvrent qu'une partie. Les doctorants ne paient pas de frais en 4e année.",
        "source": "https://admissions.xmu.edu.cn/Admissions/Costs.htm",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  },
  {
    "collection": "universities",
    "id": "yonsei-university-seoul",
    "attendu": {
      "exoneration": {
        "politique": "inconnue",
        "detail": "AUCUNE page officielle de bourses n'a pu etre lue : les deux documents consultes ne donnent que les tarifs. Le seul allegement documente est structurel et non discretionnaire — les semestres suivants sont factures environ 214 000 KRW de moins que le premier. Ne rien affirmer sur les bourses de cette universite sans verifier la page dediee du bureau des admissions internationales.",
        "source": "https://www.yonsei.ac.kr/sites/en_sc/down/2026_fee2.pdf",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "La bourse Yonsei International Companion verse 2 000 000 ₩ par semestre en master et 3 000 000 ₩ en doctorat aux étudiants à temps plein admis par la voie internationale de l'école doctorale. Elle ne s'ajoute pas à une bourse couvrant déjà tous les frais. Médecine, dentaire et soins infirmiers en sont exclus. La bourse GKS de l'État est à part.",
        "source": "https://graduate.yonsei.ac.kr/graduate_en/academic/scholarship02.do",
        "verifieLe": "2026-09-23"
      }
    },
    "motif": "Politique d'exonération recherchée sur la source officielle (demande de Charles du 2026-09-22 : améliorer les exonérations « inconnue ») ; citations clés recontrôlées dans le navigateur le 2026-09-23. Texte de l'infobulle écrit pour l'étudiant. Politique : inconnue -> possible_plafonnee."
  },
  {
    "collection": "universities",
    "id": "zhejiang-university-hangzhou",
    "attendu": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Bourse du gouvernement chinois (CSC) et bourses de l'universite pour internationaux, attribuees sur dossier et couvrant tout ou partie des droits ; rien d'automatique pour un candidat autofinance.",
        "source": "https://iczu.zju.edu.cn/admissionsen/weeswwwwankwwccountwwnfo/list.htm",
        "verifieLe": "2026-09-13"
      }
    },
    "champs": {
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "La bourse du gouvernement chinois (CSC) et les bourses de l'université pour les étudiants internationaux sont attribuées sur dossier. Elles couvrent tout ou partie des frais de scolarité. Rien n'est automatique si vous financez vous-même vos études.",
        "source": "https://iczu.zju.edu.cn/admissionsen/weeswwwwankwwccountwwnfo/list.htm",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Infobulle de la puce « Exonération » réécrite pour l'étudiant (suite du lot 74) : accents, vouvoiement, plus de majuscules criées, de tirets longs ni de notes internes, citations anglaises traduites. Politique, source et date inchangées."
  }
];
