/**
 * ============================================================
 * LOT 69 — LES DOCTORATS ITALIENS (22 septembre 2026, soir)
 * ============================================================
 *
 * Tranche 2 de la consolidation des bourses jamais touchées. Une même
 * famille, une même méthode : le « bando di dottorato » du cycle 42
 * (2026-2027) de chaque université, lu à la source le 2026-09-22.
 *
 *   Padoue · Polimi · Polito · Naples · Trente · Pise · Florence
 *
 * CE QUE LA LECTURE A MONTRÉ
 * --------------------------
 * Les sept fiches disaient « Ouverte » et « À confirmer ». En réalité :
 *   - CINQ cycles sont terminés : Padoue (20 mai), Florence (17 juin),
 *     Naples (21 juillet), Pise (10 août), Trente (aucun appel ouvert).
 *   - DEUX ont une prochaine fenêtre datée : Polito (2e session du
 *     15 octobre au 16 novembre 2026) et Polimi (3e appel du
 *     14 décembre 2026 au 14 janvier 2027).
 *   - Quatre vérifications du 19/09 avaient une citation VIDE et
 *     pointaient sur la page d'accueil de l'université : des preuves
 *     sans preuve. Elles portent maintenant la phrase lue.
 *   - Polito pointait sur la page des bourses de MASTER.
 *
 * Montants lus dans les appels : Padoue 17 443 € (18 643 € selon le
 * programme), Polito 18 854,52 €, Naples 16 243 €, Trente 18 345 à
 * 25 200 € bruts par an. Polimi, Pise et Florence : montant non relu,
 * champ `funding` conservé.
 *
 * MÉTHODE : navigateur intégré pour unipd, polimi, polito, unina, unitn
 * (Apply) et unipi ; texte des PDF d'appel (Padoue, Polito, Naples)
 * extrait dans la page par pdf.js ; WebFetch pour unifi et pour la page
 * des bourses de Trente (mur Cloudflare dans le navigateur).
 *
 * Rejeu analyserEcheance + etatCandidature au 22/09 avant livraison ;
 * `attendu` généré depuis l'export du 2026-09-22T18:44 (lot 68 compris).
 * ============================================================
 */

export const PATCHES = [
  {
    "collection": "scholarships",
    "id": "university-of-padua-phd-scholarship",
    "attendu": {
      "status": "Ouverte",
      "officialWebsite": "https://www.unipd.it/en",
      "funding": "100 %",
      "generalCriteria": "",
      "verifieLe": undefined,
      "sourceEcheance": undefined,
      "periodeOuverture": undefined,
      "exigences": undefined
    },
    "champs": {
      "status": "Fermée — cycle 42 terminé, prochain appel non publié",
      "officialWebsite": "https://www.unipd.it/en/dottorato/dottorati-42-ciclo",
      "funding": "100 % : bourse de 17 443 € bruts par an (18 643 € dans certains programmes), majorée de 50 % pendant les séjours à l'étranger, et exonération des droits",
      "generalCriteria": "Les bourses de doctorat italiennes sont attachées aux places mises au concours : on candidate au concours d'admission d'un programme doctoral, pas à la bourse séparément. Chaque programme publie sa fiche (places avec et sans bourse, pièces, épreuves, langue). À Padoue, certaines fiches de programme réservent des places aux titulaires d'un diplôme étranger. Diplôme étranger rédigé dans une autre langue que l'italien ou l'anglais : traduction certifiée obligatoire. Frais de candidature : 30 € par programme.",
      "verifieLe": "2026-09-22",
      "sourceEcheance": "https://www.unipd.it/en/dottorato/dottorati-42-ciclo",
      "periodeOuverture": "appel annuel au printemps (clôture fin mai pour le cycle 42), puis places vacantes proposées fin août",
      "exigences": []
    },
    "motif": "Page officielle du cycle 42 de l'Università di Padova et appel (« CALL FOR ADMISSION TO PHD COURSES FOR THE XLII CYCLE », art. 11.3 pour le montant) lus le 2026-09-22. La vérification du 19/09 avait une citation VIDE et pointait sur la page d'accueil ; la fiche disait « Ouverte »."
  },
  {
    "collection": "programs",
    "id": "unipd-phd",
    "attendu": {
      "deadline": "À confirmer selon l'appel à candidatures",
      "deadlineISO": undefined,
      "status": "Ouverte",
      "coverage": "Financement complet avec allocation de recherche et exonération des frais de scolarité.",
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "deadline": "Cycle 42 (2026-2027) terminé : dépôt jusqu'au 20 mai 2026 à 13h, puis places vacantes proposées du 25 au 27 août. Le prochain appel n'est pas encore publié.",
      "deadlineISO": "2026-05-20",
      "status": "Fermée — cycle 42 terminé",
      "coverage": "Bourse de 17 443 € bruts par an (18 643 € dans certains programmes), majorée de 50 % à l'étranger",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://www.unipd.it/en/dottorato/dottorati-42-ciclo",
        "citation": "Application deadline: May 20, 2026, 1 p.m.",
        "le": "2026-09-22T21:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Page officielle du cycle 42 de l'Università di Padova et appel (« CALL FOR ADMISSION TO PHD COURSES FOR THE XLII CYCLE », art. 11.3 pour le montant) lus le 2026-09-22. La vérification du 19/09 avait une citation VIDE et pointait sur la page d'accueil ; la fiche disait « Ouverte »."
  },
  {
    "collection": "scholarships",
    "id": "politecnico-di-milano-phd-scholarship",
    "attendu": {
      "status": "Ouverte",
      "officialWebsite": "https://www.polimi.it/en",
      "generalCriteria": "",
      "verifieLe": undefined,
      "sourceEcheance": undefined,
      "periodeOuverture": undefined,
      "exigences": undefined
    },
    "champs": {
      "status": "Fermée — 3e appel du cycle 42 ouvre le 14 décembre 2026",
      "officialWebsite": "https://www.polimi.it/en/phd/prospective-phd-candidates/admission/calls-and-open-positions",
      "generalCriteria": "Le Politecnico publie environ cinq appels par an, avec des bourses générales (sujet défini avec le coordinateur) et des bourses sur sujet précis, plus des places sans bourse. Candidature uniquement en ligne, via les Online Services, avec CV sur modèle et formulaire de projet de recherche. Consulter régulièrement la page des appels ouverts.",
      "verifieLe": "2026-09-22",
      "sourceEcheance": "https://www.polimi.it/en/phd/prospective-phd-candidates/admission/calls-and-open-positions",
      "periodeOuverture": "quatre appels par cycle : publication en mai-juin, août-septembre, décembre-janvier et mars-avril",
      "exigences": [
        "projet_recherche"
      ]
    },
    "motif": "Page officielle « Calls and Open Positions » du Politecnico di Milano lue le 2026-09-22 : aucun appel ouvert, prochain appel publié le 14 décembre 2026. La fiche disait « Ouverte » et « À confirmer »."
  },
  {
    "collection": "programs",
    "id": "polimi-phd",
    "attendu": {
      "deadline": "À confirmer selon l'appel à candidatures",
      "deadlineISO": undefined,
      "status": "Ouverte",
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "deadline": "14 janvier 2027 : clôture du 3e appel du cycle 42, qui ouvre le 14 décembre 2026 (début des activités le 1er février 2027). Le 2e appel s'est terminé le 18 septembre 2026 ; un 4e appel ouvrira à la mi-mars, clôture à la mi-avril.",
      "deadlineISO": "2027-01-14",
      "status": "Fermée — 3e appel ouvre le 14 décembre 2026",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://www.polimi.it/en/phd/prospective-phd-candidates/admission/calls-and-open-positions",
        "citation": "14 December 2026: 3rd call 42nd Cycle - Deadline 14 January 2027 (start of activities: 1 February 2027)",
        "le": "2026-09-22T21:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Page officielle « Calls and Open Positions » du Politecnico di Milano lue le 2026-09-22 : aucun appel ouvert, prochain appel publié le 14 décembre 2026. La fiche disait « Ouverte » et « À confirmer »."
  },
  {
    "collection": "scholarships",
    "id": "polito-phd-scholarship",
    "attendu": {
      "status": "Ouverte",
      "officialWebsite": "https://international.polito.it/financial_aid/politecnico_international_scholarships",
      "funding": "100 %",
      "generalCriteria": "",
      "verifieLe": undefined,
      "sourceEcheance": undefined,
      "periodeOuverture": undefined,
      "exigences": undefined
    },
    "champs": {
      "status": "Fermée — 2e session du cycle 42 ouvre le 15 octobre 2026",
      "officialWebsite": "https://www.polito.it/en/education/phd-programmes-and-postgraduate-school/admissions-to-phd-programmes/admissions/call-for-applications",
      "funding": "100 % : bourse de 18 854,52 € bruts par an (environ 1 386 € nets par mois), 36 mois au plus",
      "generalCriteria": "Les bourses de doctorat italiennes sont attachées aux places mises au concours : on candidate au concours d'admission d'un programme doctoral, pas à la bourse séparément. Chaque programme publie sa fiche (places avec et sans bourse, pièces, épreuves, langue). Au Politecnico di Torino, le cycle 42 compte au moins 110 bourses réparties sur trois sessions ; un candidat qui accepte une place dans une session ne peut pas se présenter aux suivantes. Des places sont réservées aux titulaires de bourses de gouvernements étrangers. Candidature sur la plateforme Apply@polito ; lettres de recommandation facultatives.",
      "verifieLe": "2026-09-22",
      "sourceEcheance": "https://www.polito.it/en/education/phd-programmes-and-postgraduate-school/admissions-to-phd-programmes/admissions/call-for-applications",
      "periodeOuverture": "trois sessions par cycle : clôture fin avril, mi-novembre et mi-février",
      "exigences": []
    },
    "motif": "Page « Call for applications » du Politecnico di Torino et appel du cycle 42 (art. sur le montant) lus le 2026-09-22. L'ancien lien pointait sur la page des bourses de MASTER."
  },
  {
    "collection": "programs",
    "id": "polito-phd",
    "attendu": {
      "deadline": "À confirmer selon l'appel à candidatures",
      "deadlineISO": undefined,
      "status": "Ouverte",
      "coverage": "Financement complet avec allocation de recherche et exonération des frais de scolarité.",
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "deadline": "16 novembre 2026 à 14h (heure d'Europe centrale) : clôture de la 2e session du cycle 42, ouverte à partir du 15 octobre, pour un début le 1er mars 2027. Une 3e session suivra de la mi-janvier à la mi-février.",
      "deadlineISO": "2026-11-16",
      "status": "Fermée — 2e session ouvre le 15 octobre 2026",
      "coverage": "Bourse de 18 854,52 € bruts par an (environ 1 386 € nets par mois), 36 mois au plus",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://www.polito.it/en/education/phd-programmes-and-postgraduate-school/admissions-to-phd-programmes/admissions/call-for-applications",
        "citation": "Second 15/10/2026 16/11/2026 (2:00 PM – CET) 01/03/2027",
        "le": "2026-09-22T21:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Page « Call for applications » du Politecnico di Torino et appel du cycle 42 (art. sur le montant) lus le 2026-09-22. L'ancien lien pointait sur la page des bourses de MASTER."
  },
  {
    "collection": "scholarships",
    "id": "university-of-naples-federico-ii-phd-scholarship",
    "attendu": {
      "status": "Ouverte",
      "officialWebsite": "https://www.unina.it/",
      "funding": "100 %",
      "generalCriteria": "",
      "verifieLe": undefined,
      "sourceEcheance": undefined,
      "periodeOuverture": undefined,
      "exigences": undefined
    },
    "champs": {
      "status": "Fermée — cycle 42 terminé, prochain appel non publié",
      "officialWebsite": "https://www.unina.it/it/didattica/post-laurea/dottorati/42esimo-ciclo",
      "funding": "100 % : bourse de 16 243 € bruts par an, renouvelée chaque année si l'année est validée",
      "generalCriteria": "Les bourses de doctorat italiennes sont attachées aux places mises au concours : on candidate au concours d'admission d'un programme doctoral, pas à la bourse séparément. Chaque programme publie sa fiche (places avec et sans bourse, pièces, épreuves, langue). À Naples, l'aptitude d'un diplôme étranger est appréciée par la commission ; frais de candidature de 30 € pour un diplôme obtenu à l'étranger. Les lauréats ont cinq jours après la publication des classements pour demander leur inscription.",
      "verifieLe": "2026-09-22",
      "sourceEcheance": "https://www.unina.it/documents/d/guest/dot_42_ciclo_bando",
      "periodeOuverture": "appel annuel publié en juin, clôture fin juillet (cycle 42)",
      "exigences": []
    },
    "motif": "Appel du cycle 42 de l'Università di Napoli Federico II (DR/2026/2419 du 22/06/2026) lu le 2026-09-22. La vérification du 19/09 avait une citation VIDE et pointait sur la page d'accueil ; la fiche disait « Ouverte »."
  },
  {
    "collection": "programs",
    "id": "unina-phd",
    "attendu": {
      "deadline": "À confirmer selon l'appel à candidatures",
      "deadlineISO": undefined,
      "status": "Ouverte",
      "coverage": "Financement complet avec allocation de recherche et exonération des frais de scolarité.",
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "deadline": "Cycle 42 (2026-2027) terminé : dépôt jusqu'au 21 juillet 2026 à midi (heure italienne) ; les classements sont publiés. Le prochain appel n'est pas encore publié.",
      "deadlineISO": "2026-07-21",
      "status": "Fermée — cycle 42 terminé",
      "coverage": "Bourse de 16 243 € bruts par an",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://www.unina.it/documents/d/guest/dot_42_ciclo_bando",
        "citation": "entro e non oltre le ore 12:00 (ora italiana) del 21 luglio 2026",
        "le": "2026-09-22T21:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Appel du cycle 42 de l'Università di Napoli Federico II (DR/2026/2419 du 22/06/2026) lu le 2026-09-22. La vérification du 19/09 avait une citation VIDE et pointait sur la page d'accueil ; la fiche disait « Ouverte »."
  },
  {
    "collection": "scholarships",
    "id": "university-of-trento-phd-scholarship",
    "attendu": {
      "status": "Ouverte",
      "officialWebsite": "https://www.unitn.it/en",
      "funding": "100 %",
      "generalCriteria": "",
      "verifieLe": undefined,
      "sourceEcheance": undefined,
      "periodeOuverture": undefined,
      "exigences": undefined
    },
    "champs": {
      "status": "Fermée — aucun appel ouvert, appels publiés entre mars et juillet",
      "officialWebsite": "https://webapps.unitn.it/Apply/en/Web/Home/dott",
      "funding": "100 % : à partir du cycle 42, bourse de 18 345 € à 25 200 € bruts par an selon le programme",
      "generalCriteria": "Les bourses de doctorat italiennes sont attachées aux places mises au concours : on candidate au concours d'admission d'un programme doctoral, pas à la bourse séparément. Chaque programme publie sa fiche (places avec et sans bourse, pièces, épreuves, langue). À Trente, chaque école doctorale fixe son calendrier et ses épreuves ; candidature sur la plateforme Apply de l'université, frais de 30 €.",
      "verifieLe": "2026-09-22",
      "sourceEcheance": "https://webapps.unitn.it/Apply/en/Web/Home/dott",
      "periodeOuverture": "appels publiés chaque année entre mars et juillet, selon l'école doctorale",
      "exigences": []
    },
    "motif": "Plateforme Apply de l'Università di Trento lue le 2026-09-22 (« No active applications for this type ») et page des bourses de doctorat (montants du cycle 42, lue par WebFetch : la page passe par un contrôle Cloudflare dans le navigateur)."
  },
  {
    "collection": "programs",
    "id": "unitn-phd",
    "attendu": {
      "deadline": "À confirmer selon l'appel à candidatures",
      "status": "Ouverte",
      "coverage": "Financement complet avec allocation de recherche et exonération des frais de scolarité.",
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Aucun appel ouvert : ceux du cycle 42 (2026-2027) sont terminés. L'université publie ses appels chaque année entre mars et juillet ; les dates propres à chaque école doctorale figurent sur ses pages.",
      "status": "Fermée — aucun appel ouvert",
      "coverage": "Bourse de 18 345 € à 25 200 € bruts par an selon le programme (à partir du cycle 42)",
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Plateforme Apply de l'Università di Trento lue le 2026-09-22 (« No active applications for this type ») et page des bourses de doctorat (montants du cycle 42, lue par WebFetch : la page passe par un contrôle Cloudflare dans le navigateur)."
  },
  {
    "collection": "scholarships",
    "id": "university-of-pisa-phd-scholarship",
    "attendu": {
      "status": "Ouverte",
      "officialWebsite": "https://www.unipi.it/",
      "generalCriteria": "",
      "verifieLe": undefined,
      "sourceEcheance": undefined,
      "periodeOuverture": undefined,
      "exigences": undefined
    },
    "champs": {
      "status": "Fermée — cycle 42 terminé, prochain appel non publié",
      "officialWebsite": "https://www.unipi.it/didattica/corsi/dottorati/bando2026-27/",
      "generalCriteria": "Les bourses de doctorat italiennes sont attachées aux places mises au concours : on candidate au concours d'admission d'un programme doctoral, pas à la bourse séparément. Chaque programme publie sa fiche (places avec et sans bourse, pièces, épreuves, langue). À Pise, le cycle 42 a compté deux appels (A et B) ; cours de trois ans, début le 1er novembre.",
      "verifieLe": "2026-09-22",
      "sourceEcheance": "https://www.unipi.it/didattica/corsi/dottorati/bando2026-27/",
      "periodeOuverture": "deux appels par cycle : clôture début juin (appel A) et mi-août (appel B)",
      "exigences": []
    },
    "motif": "Page officielle des appels 2026/2027 de l'Università di Pisa lue le 2026-09-22. La vérification du 19/09 avait une citation VIDE et pointait sur la page d'accueil ; la fiche disait « Ouverte »."
  },
  {
    "collection": "programs",
    "id": "unipi-phd",
    "attendu": {
      "deadline": "À confirmer selon l'appel à candidatures",
      "deadlineISO": undefined,
      "status": "Ouverte",
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "deadline": "Cycle 42 (2026-2027) terminé : dernier appel (B) jusqu'au 10 août 2026 à 13h ; le premier (A) s'était achevé début juin. Début des cours le 1er novembre. Le prochain appel n'est pas encore publié.",
      "deadlineISO": "2026-08-10",
      "status": "Fermée — cycle 42 terminé",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://www.unipi.it/didattica/corsi/dottorati/bando2026-27/",
        "citation": "Bando B: scadenza 10 agosto 2026 (ore 13:00).",
        "le": "2026-09-22T21:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Page officielle des appels 2026/2027 de l'Università di Pisa lue le 2026-09-22. La vérification du 19/09 avait une citation VIDE et pointait sur la page d'accueil ; la fiche disait « Ouverte »."
  },
  {
    "collection": "scholarships",
    "id": "university-of-florence-phd-scholarship",
    "attendu": {
      "status": "Ouverte",
      "generalCriteria": "",
      "verifieLe": undefined,
      "sourceEcheance": undefined,
      "periodeOuverture": undefined,
      "exigences": undefined
    },
    "champs": {
      "status": "Fermée — cycle 42 terminé, prochain appel non publié",
      "generalCriteria": "Les bourses de doctorat italiennes sont attachées aux places mises au concours : on candidate au concours d'admission d'un programme doctoral, pas à la bourse séparément. Chaque programme publie sa fiche (places avec et sans bourse, pièces, épreuves, langue). À Florence, un appel distinct (« Pegaso ») propose aussi des bourses de doctorat ; celui de 2026 s'est terminé le 6 août.",
      "verifieLe": "2026-09-22",
      "sourceEcheance": "https://www.unifi.it/en/study-us/after-graduation/phd-programmes/phd-courses/cycle-42-call-applications",
      "periodeOuverture": "appel annuel au printemps, clôture en juin (cycle 42)",
      "exigences": []
    },
    "motif": "Page de l'appel du cycle 42 de l'Università di Firenze relue le 2026-09-22 (WebFetch). La date vérifiée le 20/09 (17 juin 2026) était juste, mais le texte du programme disait encore « À confirmer » et le statut « Ouverte »."
  },
  {
    "collection": "programs",
    "id": "unifi-phd",
    "attendu": {
      "deadline": "À confirmer selon l'appel à candidatures",
      "status": "Ouverte"
    },
    "champs": {
      "deadline": "Cycle 42 (2026-2027) terminé : dépôt jusqu'au 17 juin 2026 à midi (heure italienne), après report du 11 juin. Le prochain appel n'est pas encore publié.",
      "status": "Fermée — cycle 42 terminé"
    },
    "motif": "Page de l'appel du cycle 42 de l'Università di Firenze relue le 2026-09-22 (WebFetch). La date vérifiée le 20/09 (17 juin 2026) était juste, mais le texte du programme disait encore « À confirmer » et le statut « Ouverte »."
  }
];
