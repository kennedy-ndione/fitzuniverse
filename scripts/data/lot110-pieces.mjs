/**
* ============================================================
* LOT 110 — LES PIÈCES QUE CHAQUE BOURSE DEMANDE VRAIMENT
* (2026-09-26)
* ============================================================
*
* Audit du 26/09 : pour 44 bourses proposables sur 52, l'espace
* n'offrait qu'une liste générique (lettres, test de langue, preuve
* financière). Ce lot pose, sur 33 bourses, la liste des pièces lue
* sur leur page officielle (champ piecesDossier : « propre » pour une
* candidature à la bourse, « admission » quand la bourse s'obtient avec
* l'admission). La carte de candidature propose de les ajouter au
* dossier (js/exigences.js, dossierAAjouter) ; l'étape « Dossier » ne se
* valide plus tant qu'une d'elles manque ; la fiche publique les affiche.
*
* Introuvables sur une page lisible : Bilkent, Reach Oxford (consignes
* 2027 attendues en janvier), Mastercard UM6P, SNU, UTokyo (chaque
* école a sa procédure). Semmelweis : réservée aux étudiants déjà
* inscrits, marquée comme telle.
*
* Correctifs de discipline vus au test en ligne du 26/09 : Imperial
* (pas de droit ni de lettres), McGill, UBC et Pearson (pas de médecine
* en premier cycle pour un étudiant international).
*
* EXÉCUTION :
*   node scripts\lot.mjs analyser 110-pieces
*   node scripts\lot.mjs ecrire 110-pieces
*   node scripts\lot.mjs verifier 110-pieces
* ============================================================
*/

export const PATCHES = [
 {
  "collection": "scholarships",
  "id": "uemf-bourse-etudiants-internationaux",
  "champs": {
   "piecesDossier": {
    "type": "propre",
    "pieces": [
     {
      "label": "Relevés de notes",
      "detail": "Ils servent au critère académique de la commission des bourses."
     },
     {
      "label": "Attestations de revenu",
      "detail": "Elles servent aux critères sociaux et économiques."
     }
    ],
    "sourceVerification": {
     "url": "https://ueuromed.org/fr/etudier-a-l-euromed",
     "citation": "La demande de bourse doit être déposée en ligne sur la plateforme dédiée de l'UEMF et complétée par les pièces justificatives demandées (relevés de notes, attestations de revenu, etc.).",
     "le": "2026-09-25T23:05:00.000Z",
     "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
    }
   }
  },
  "motif": "Lot 110 — 2 pièces lues sur la page officielle."
 },
 {
  "collection": "scholarships",
  "id": "inti-international-education-scholarship",
  "champs": {
   "piecesDossier": {
    "type": "admission",
    "pieces": [
     {
      "label": "Formulaire de candidature des étudiants internationaux",
      "detail": "Le formulaire comporte une rubrique financement où l'on indique la bourse visée."
     },
     {
      "label": "Copie intégrale du passeport",
      "detail": "Deux photocopies de tout le livret, pages vierges comprises."
     },
     {
      "label": "Six photos d'identité",
      "detail": "Fond blanc, format 3,5 cm sur 4,5 cm."
     },
     {
      "label": "Copies certifiées de tous les diplômes et relevés",
      "detail": "Deux copies, avec traduction en anglais."
     },
     {
      "label": "Certificat d'anglais",
      "detail": "TOEFL, IELTS ou autre, si demandé."
     },
     {
      "label": "Rapport d'examen médical avant l'arrivée",
      "detail": ""
     },
     {
      "label": "Carnet de vaccination contre la fièvre jaune",
      "detail": "Pour les étudiants venant d'une zone d'endémie."
     }
    ],
    "sourceVerification": {
     "url": "https://newinti.edu.my/international-students/how-to-apply/",
     "citation": "Two (2) photocopies of passport (the entire booklet inclusive of all blank pages). Six (6) passport-sized photographs with white background (size: width 3.5cm x height 4.5cm).",
     "le": "2026-09-25T23:05:00.000Z",
     "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
    }
   }
  },
  "motif": "Lot 110 — 7 pièces lues sur la page officielle."
 },
 {
  "collection": "scholarships",
  "id": "taylors-research-excellence-scholarship",
  "champs": {
   "piecesDossier": {
    "type": "propre",
    "pieces": [
     {
      "label": "Formulaire de demande d'aide financière pour la recherche",
      "detail": "Le formulaire des diplômes de recherche de Taylor's."
     },
     {
      "label": "Projet de recherche",
      "detail": "Rédigé sur le modèle joint au formulaire."
     },
     {
      "label": "Justificatifs des résultats universitaires",
      "detail": "Pour les déclarations de la section 4."
     },
     {
      "label": "Justificatifs de l'expérience de recherche",
      "detail": "Avec la première page de chaque publication, s'il y en a."
     },
     {
      "label": "Justificatifs de l'expérience d'enseignement",
      "detail": "Pour les déclarations de la section 6."
     }
    ],
    "sourceVerification": {
     "url": "https://university.taylors.edu.my/content/dam/taylorsrevamp/university/study/scholarships-and-financial-aid/postgraduate-studies/files/taylors-scholarships-hdr-financial-aid-application-form-15112018-hdrc-approved.pdf",
     "citation": "Please attach ALL relevant supporting documents and/or testimonials, including the first page of every publication (if applicable), for all declarations made under sections 4, 5 and 6 above.",
     "le": "2026-09-25T23:05:00.000Z",
     "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
    }
   }
  },
  "motif": "Lot 110 — 5 pièces lues sur la page officielle."
 },
 {
  "collection": "scholarships",
  "id": "daad-epos",
  "champs": {
   "piecesDossier": {
    "type": "propre",
    "pieces": [
     {
      "label": "Liste de contrôle remplie et signée",
      "detail": ""
     },
     {
      "label": "Formulaire de demande de bourse du DAAD",
      "detail": "Réponses tapées ou bien lisibles."
     },
     {
      "label": "Curriculum vitae",
      "detail": "Ordre chronologique inverse, sans période inexpliquée."
     },
     {
      "label": "Lettre de motivation",
      "detail": "Raisons académiques, professionnelles et personnelles."
     },
     {
      "label": "Attestations d'emploi",
      "detail": "Au moins deux ans d'expérience professionnelle en lien avec la formation."
     },
     {
      "label": "Preuve récente du niveau de langue",
      "detail": "En anglais ou en allemand selon la formation."
     },
     {
      "label": "Copies des diplômes universitaires",
      "detail": "Avec traduction certifiée si besoin."
     },
     {
      "label": "Relevés de notes complets",
      "detail": ""
     }
    ],
    "sourceVerification": {
     "url": "https://www.daad.de/go/en/stipa50076777",
     "citation": "Required documents (in the following order): Completed and signed checklist; DAAD application \"Application for a research/study scholarship\" (please type your answers or make sure they are easy to read); A curriculum vitae in reverse chronological order without any unexplained gaps",
     "le": "2026-09-25T23:05:00.000Z",
     "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
    }
   }
  },
  "motif": "Lot 110 — 8 pièces lues sur la page officielle."
 },
 {
  "collection": "scholarships",
  "id": "epfl-master-excellence-fellowships",
  "champs": {
   "piecesDossier": {
    "type": "admission",
    "pieces": [
     {
      "label": "Curriculum vitae",
      "detail": ""
     },
     {
      "label": "Copie du diplôme de licence",
      "detail": "Si déjà obtenu."
     },
     {
      "label": "Relevés de notes complets",
      "detail": "De chaque université fréquentée."
     },
     {
      "label": "Lettre de motivation",
      "detail": "Mille mots au plus sur le parcours et le projet professionnel."
     },
     {
      "label": "Coordonnées de trois professeurs référents",
      "detail": ""
     },
     {
      "label": "Carte d'identité ou passeport",
      "detail": ""
     },
     {
      "label": "Traduction légalisée",
      "detail": "Pour tout document qui n'est pas en anglais, français, allemand ou italien."
     }
    ],
    "sourceVerification": {
     "url": "https://www.epfl.ch/education/admission/admission-2/master-admission-criteria-application/online-application/",
     "citation": "Your resumé (curriculum vitae); Copy of your University degree(s), if already available; Complete transcripts from each university you attended",
     "le": "2026-09-25T23:05:00.000Z",
     "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
    }
   }
  },
  "motif": "Lot 110 — 7 pièces lues sur la page officielle."
 },
 {
  "collection": "scholarships",
  "id": "iheid-scholarships",
  "champs": {
   "piecesDossier": {
    "type": "propre",
    "pieces": [
     {
      "label": "Lettre expliquant le besoin financier",
      "detail": ""
     },
     {
      "label": "Justificatif de ses revenus annuels",
      "detail": "Si l'on a des revenus."
     },
     {
      "label": "Justificatif des revenus annuels des parents",
      "detail": "Obligatoire avant 26 ans, conseillé après."
     },
     {
      "label": "Relevés bancaires des trois derniers mois",
      "detail": "À défaut de déclaration de revenus ou d'avis d'imposition."
     },
     {
      "label": "Preuve des autres financements",
      "detail": "Y compris les autres bourses obtenues."
     },
     {
      "label": "Revenus du conjoint",
      "detail": "Le cas échéant."
     }
    ],
    "sourceVerification": {
     "url": "https://www.graduateinstitute.ch/sites/internet/files/2025-07/2025-Financial-Aid-Application-Check.pdf",
     "citation": "Cover letter explaining your financial need. Copy of your annual income (if applicable).",
     "le": "2026-09-25T23:05:00.000Z",
     "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
    }
   }
  },
  "motif": "Lot 110 — 6 pièces lues sur la page officielle."
 },
 {
  "collection": "scholarships",
  "id": "mcgill-major-entrance-scholarships",
  "champs": {
   "piecesDossier": {
    "type": "propre",
    "pieces": [
     {
      "label": "Liste des activités scolaires et bénévoles",
      "detail": "Sur les trois dernières années."
     },
     {
      "label": "Essai général",
      "detail": "Sur une personnalité inspirante ou un événement marquant."
     },
     {
      "label": "Lettre de recommandation écrite par soi-même",
      "detail": "Une page, à la troisième personne."
     },
     {
      "label": "Deux lettres de recommandation",
      "detail": "Une académique et une liée aux activités, sur papier à en-tête, signées, en PDF."
     },
     {
      "label": "Attestation de rang dans la classe",
      "detail": "Signée par l'établissement, pour les élèves hors Québec, si l'école la fournit."
     },
     {
      "label": "Notes et notes intermédiaires",
      "detail": "Transmises au service des admissions."
     }
    ],
    "sourceVerification": {
     "url": "https://www.mcgill.ca/studentaid/scholarships-aid/future-undergrads/entrance-scholarships/application-instructions",
     "citation": "A one-page letter of reference that you have written – for yourself – in the third person",
     "le": "2026-09-25T23:05:00.000Z",
     "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
    }
   },
   "specialitesExclues": [
    "médecine",
    "dentisterie"
   ]
  },
  "motif": "Lot 110 — 6 pièces lues sur la page officielle ; pas de médecine en premier cycle pour un étudiant international."
 },
 {
  "collection": "scholarships",
  "id": "mastercard-foundation-scholars-alu",
  "champs": {
   "piecesDossier": {
    "type": "admission",
    "pieces": [
     {
      "label": "Relevé des notes de l'examen national",
      "detail": "Baccalauréat ou équivalent."
     },
     {
      "label": "Relevés de notes du lycée",
      "detail": "Des trois dernières années."
     },
     {
      "label": "Pièce d'identité",
      "detail": "Passeport, carte d'identité ou acte de naissance."
     },
     {
      "label": "Justificatifs des revenus du foyer",
      "detail": "Fiches de paie, relevés bancaires ou de mobile money, ou lettre du tuteur."
     },
     {
      "label": "Justificatifs de situation familiale",
      "detail": "Acte de décès, tutelle ou divorce, selon le cas."
     }
    ],
    "sourceVerification": {
     "url": "https://www.alueducation.com/admissions-application-guide/",
     "citation": "Required Documents (Must be uploaded): National Examination Transcript / A-Level Equivalent; Secondary School Transcripts (Grades 10–12)",
     "le": "2026-09-25T23:05:00.000Z",
     "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
    }
   }
  },
  "motif": "Lot 110 — 5 pièces lues sur la page officielle."
 },
 {
  "collection": "scholarships",
  "id": "open-doors-scholarship",
  "champs": {
   "piecesDossier": {
    "type": "propre",
    "pieces": [
     {
      "label": "Lettre de motivation",
      "detail": "Saisie dans le formulaire en ligne."
     },
     {
      "label": "Justificatif du niveau d'études",
      "detail": "Relevé de notes officiel, bulletin de l'année ou attestation."
     },
     {
      "label": "Copie du passeport",
      "detail": "Celui qui servira en Russie."
     },
     {
      "label": "Justificatifs de réalisations",
      "detail": "Facultatif, mais augmente la note du portfolio."
     },
     {
      "label": "Attestation de niveau en russe ou en anglais",
      "detail": "Facultatif."
     },
     {
      "label": "Traduction des documents",
      "detail": "En russe ou en anglais s'ils sont dans une autre langue."
     }
    ],
    "sourceVerification": {
     "url": "https://od.globaluni.ru/",
     "citation": "Only the motivation letter, proof of your education level and passport are mandatory. All other documents in the portfolio are optional, but including them may increase the maximum score you can achieve at the First Stage.",
     "le": "2026-09-25T23:05:00.000Z",
     "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
    }
   }
  },
  "motif": "Lot 110 — 6 pièces lues sur la page officielle."
 },
 {
  "collection": "scholarships",
  "id": "ashesi-mastercard-foundation-scholars",
  "champs": {
   "piecesDossier": {
    "type": "admission",
    "pieces": [
     {
      "label": "Formulaire de candidature",
      "detail": ""
     },
     {
      "label": "Résultats d'un examen de fin d'études secondaires",
      "detail": "WASSCE, IGCSE, A-Level, IB ou équivalent."
     },
     {
      "label": "Relevés de notes du lycée",
      "detail": ""
     },
     {
      "label": "Essai personnel",
      "detail": ""
     },
     {
      "label": "Justificatifs des activités extrascolaires",
      "detail": ""
     },
     {
      "label": "Formulaire d'aide financière",
      "detail": "En indiquant le montant d'aide nécessaire."
     },
     {
      "label": "Traduction certifiée",
      "detail": "Pour tout document qui n'est pas en anglais."
     },
     {
      "label": "Preuve du niveau d'anglais",
      "detail": "TOEFL ou IELTS si l'anglais n'était pas la langue du lycée."
     }
    ],
    "sourceVerification": {
     "url": "https://ashesi.edu.gh/how-to-apply/",
     "citation": "Applicants must complete the application form and submit with one of the following examination results and high school transcripts:",
     "le": "2026-09-25T23:05:00.000Z",
     "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
    }
   }
  },
  "motif": "Lot 110 — 8 pièces lues sur la page officielle."
 },
 {
  "collection": "scholarships",
  "id": "bourse-emile-boutmy",
  "champs": {
   "piecesDossier": {
    "type": "admission",
    "pieces": [
     {
      "label": "CV",
      "detail": ""
     },
     {
      "label": "Lettre de motivation",
      "detail": "Rédigée dans la rubrique prévue du formulaire en ligne, une par programme demandé."
     },
     {
      "label": "Relevés de notes officiels du supérieur",
      "detail": "Signés ou tamponnés, pour toutes les années d'études supérieures, traduits s'ils ne sont ni en anglais ni en français."
     },
     {
      "label": "Moyenne générale",
      "detail": "À indiquer dans le dossier."
     },
     {
      "label": "Résultats d'un test de langue",
      "detail": "Seulement si le programme l'exige."
     },
     {
      "label": "Deux références académiques",
      "detail": ""
     }
    ],
    "sourceVerification": {
     "url": "https://www.sciencespo.fr/admissions/en/graduate/international-admissions/application-file/",
     "citation": "CV/Résumé. A motivation letter (or 2 letters if you're applying to 2 programmes), to be written in the dedicated section of your online application.",
     "le": "2026-09-25T23:05:00.000Z",
     "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
    }
   }
  },
  "motif": "Lot 110 — 6 pièces lues sur la page officielle."
 },
 {
  "collection": "scholarships",
  "id": "imperial-presidents-phd-scholarships",
  "champs": {
   "piecesDossier": {
    "type": "admission",
    "pieces": [
     {
      "label": "Déclaration personnelle",
      "detail": "Page 1 d'un document de 2 pages : motivations pour Imperial et pour la bourse."
     },
     {
      "label": "Projet de recherche",
      "detail": "Page 2 du même document, ou document plus détaillé si le département le demande."
     },
     {
      "label": "Deux références académiques",
      "detail": "Par exemple un tuteur ou un directeur de mémoire, pas le futur directeur de thèse."
     }
    ],
    "sourceVerification": {
     "url": "https://www.imperial.ac.uk/study/fees-and-funding/postgraduate-doctoral/grants-scholarships/presidents-phd/",
     "citation": "There isn't specific scholarship application form. You should submit your application for admission to study at Imperial through our online admissions system and your department will put you forward for the scholarship based on academic merit and potential.",
     "le": "2026-09-25T23:05:00.000Z",
     "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
    }
   },
   "domaines": [
    "Ingénierie",
    "Sciences",
    "Médecine",
    "Informatique",
    "Commerce"
   ]
  },
  "motif": "Lot 110 — 3 pièces lues sur la page officielle ; Imperial n'enseigne ni le droit ni les lettres."
 },
 {
  "collection": "scholarships",
  "id": "bocconi-graduate-merit-award",
  "champs": {
   "piecesDossier": {
    "type": "admission",
    "pieces": [
     {
      "label": "Résultats GMAT, GRE ou test Bocconi en ligne",
      "detail": ""
     },
     {
      "label": "Relevés de notes de licence",
      "detail": "Pour calculer la moyenne des examens réussis."
     },
     {
      "label": "Dossier et lettre de motivation",
      "detail": "En anglais."
     },
     {
      "label": "Certificat de langue anglaise",
      "detail": "Selon les certificats et diplômes acceptés par Bocconi."
     },
     {
      "label": "Vidéo de présentation",
      "detail": "Facultative, en anglais, sauf pour quelques programmes où elle est obligatoire."
     },
     {
      "label": "CV à jour",
      "detail": "Demandé seulement au lauréat, lors de l'acceptation de la bourse."
     }
    ],
    "sourceVerification": {
     "url": "https://www.unibocconi.it/en/applying-bocconi/master-science-and-ma-programs/application-and-admissions/admissions",
     "citation": "Results of the GMAT/GRE test or the online Bocconi test. Grade point average of exams passed in the Undergraduate program.",
     "le": "2026-09-25T23:05:00.000Z",
     "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
    }
   }
  },
  "motif": "Lot 110 — 6 pièces lues sur la page officielle."
 },
 {
  "collection": "scholarships",
  "id": "weidenfeld-hoffmann-scholarships",
  "champs": {
   "piecesDossier": {
    "type": "propre",
    "pieces": [
     {
      "label": "Formulaire de candidature master d'Oxford",
      "detail": "Cocher la bourse dans la rubrique des bourses de l'université, avant la date limite du cours."
     },
     {
      "label": "Déclaration Weidenfeld-Hoffmann",
      "detail": "Document à télécharger sur la page, à remplir et joindre au formulaire."
     },
     {
      "label": "Relevé de notes officiel",
      "detail": "Pièce standard du dossier master, selon le cours."
     },
     {
      "label": "CV",
      "detail": ""
     },
     {
      "label": "Déclaration d'intention",
      "detail": "Selon le cours."
     },
     {
      "label": "Travaux écrits",
      "detail": "Seulement si le cours les demande."
     }
    ],
    "sourceVerification": {
     "url": "https://www.ox.ac.uk/admissions/graduate/fees-and-funding/fees-funding-and-scholarship-search/weidenfeld-hoffmann-scholarships-and-leadership-programme",
     "citation": "You must also complete a Weidenfeld-Hoffmann Scholarships Statement and upload it, together with your graduate application form, by the deadline.",
     "le": "2026-09-25T23:05:00.000Z",
     "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
    }
   }
  },
  "motif": "Lot 110 — 6 pièces lues sur la page officielle."
 },
 {
  "collection": "scholarships",
  "id": "ubc-international-scholars-program",
  "champs": {
   "piecesDossier": {
    "type": "propre",
    "pieces": [
     {
      "label": "Candidature d'admission à UBC",
      "detail": "À déposer avant la demande de bourse."
     },
     {
      "label": "Recommandation du lycée",
      "detail": "Par un conseiller d'orientation, un proviseur ou un responsable."
     },
     {
      "label": "Référence d'un enseignant",
      "detail": "Personne différente de celle qui recommande."
     },
     {
      "label": "Informations financières de la famille",
      "detail": "Revenus et dépenses, patrimoine, personnes à charge, frais de scolarité, sources de soutien."
     },
     {
      "label": "Quatre réponses rédigées",
      "detail": "Environ 150 à 250 mots chacune."
     },
     {
      "label": "Relevés de notes et diplômes du lycée",
      "detail": "À envoyer au plus tard le 31 janvier."
     },
     {
      "label": "Résultats d'un test d'anglais",
      "detail": "Si UBC l'exige, au plus tard le 31 janvier."
     }
    ],
    "sourceVerification": {
     "url": "https://you.ubc.ca/financial-planning/scholarships-awards-international-students/international-scholars/",
     "citation": "You must have completed your admissions application to UBC before starting your award application. You'll need one nominator (guidance counsellor, principal, administrator, etc.)",
     "le": "2026-09-25T23:05:00.000Z",
     "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
    }
   },
   "specialitesExclues": [
    "médecine",
    "dentisterie"
   ]
  },
  "motif": "Lot 110 — 7 pièces lues sur la page officielle ; pas de médecine en premier cycle pour un étudiant international."
 },
 {
  "collection": "scholarships",
  "id": "apu-international-merit-awards",
  "champs": {
   "piecesDossier": {
    "type": "propre",
    "pieces": [
     {
      "label": "Formulaire de demande de bourse en ligne",
      "detail": "Identité, nationalité, diplôme actuel et formation visée."
     },
     {
      "label": "Justificatifs des diplômes",
      "detail": "Jusqu'à dix fichiers de 1 Mo maximum chacun."
     },
     {
      "label": "Résultats finaux des examens",
      "detail": "A-Level, IGCSE ou IB : le taux de réduction de 10 à 30 % en dépend."
     }
    ],
    "sourceVerification": {
     "url": "https://www.apu.edu.my/apu-international-students-scholarships-merit-awards",
     "citation": "Attach up to ten (10) relevant document(s) with regards to your academic qualifications. Each file must not exceed 1 MB in size and the file name must be at least five (5) characters long.",
     "le": "2026-09-25T23:05:00.000Z",
     "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
    }
   }
  },
  "motif": "Lot 110 — 3 pièces lues sur la page officielle."
 },
 {
  "collection": "scholarships",
  "id": "mastercard-foundation-scholars-program",
  "champs": {
   "piecesDossier": {
    "type": "admission",
    "pieces": [
     {
      "label": "Relevés de notes de chaque établissement supérieur",
      "detail": "Copies scannées ; traduction certifiée ou évaluation WES s'ils ne sont pas en anglais."
     },
     {
      "label": "Déclaration d'objectifs",
      "detail": "Projet d'études et intérêts de recherche."
     },
     {
      "label": "Déclaration de parcours personnel",
      "detail": "Histoire et expériences de vie."
     },
     {
      "label": "Lettres de recommandation",
      "detail": "Au moins deux noms de recommandants."
     },
     {
      "label": "Résultats TOEFL ou IELTS",
      "detail": "Si la licence a été faite dans un pays non anglophone."
     },
     {
      "label": "Résultats GRE ou GMAT",
      "detail": "Seulement si le programme les exige."
     }
    ],
    "sourceVerification": {
     "url": "https://grad.berkeley.edu/admissions/steps-to-apply/requirements/",
     "citation": "Upload unofficial transcripts (ie, a scanned copy) from every post-secondary school",
     "le": "2026-09-25T23:05:00.000Z",
     "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
    }
   }
  },
  "motif": "Lot 110 — 6 pièces lues sur la page officielle."
 },
 {
  "collection": "scholarships",
  "id": "sunway-academic-excellence-scholarships",
  "champs": {
   "piecesDossier": {
    "type": "propre",
    "pieces": [
     {
      "label": "Copie certifiée conforme du diplôme d'accès",
      "detail": "Diplôme ou résultats de fin de secondaire, de fondation ou de pré-université, ou équivalent."
     }
    ],
    "sourceVerification": {
     "url": "https://scholarship.sunway.edu.my/scholarships/academic-excellence-scholarships",
     "citation": "Complete the Online Scholarship Application Form, with the required supporting documents: https://sunway.edu.my/scholarship-app/. Attach the certified true copy document(s) for the Online Scholarship Application: SPM/ STPM/ Diploma/ Foundation/Pre-University/ Matriculation certificate or equivalent.",
     "le": "2026-09-25T23:05:00.000Z",
     "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
    }
   }
  },
  "motif": "Lot 110 — 1 pièces lues sur la page officielle."
 },
 {
  "collection": "scholarships",
  "id": "nl-scholarship",
  "champs": {
   "piecesDossier": {
    "type": "propre",
    "pieces": [
     {
      "label": "Formulaire de demande de bourse",
      "detail": "Formulaire VUFP-NLS, toutes les questions doivent être remplies."
     },
     {
      "label": "Preuve de moyenne ou relevé de notes de licence",
      "detail": "La moyenne doit équivaloir au moins à 8 sur 10 aux Pays-Bas."
     },
     {
      "label": "Échelle de notation de la licence",
      "detail": "Avec une explication claire du calcul de la moyenne."
     }
    ],
    "sourceVerification": {
     "url": "https://vu.nl/en/education/more-about/incoming-master-scholarships",
     "citation": "When applying for the VUFP scholarship, you automatically apply also for the NL Scholarship. No separate application is necessary. Not answering one or more questions or not including the GPA proof/ programme transcript will result in your application being considered incomplete.",
     "le": "2026-09-25T23:05:00.000Z",
     "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
    }
   }
  },
  "motif": "Lot 110 — 3 pièces lues sur la page officielle."
 },
 {
  "collection": "scholarships",
  "id": "koc-university-merit-scholarships",
  "champs": {
   "piecesDossier": {
    "type": "admission",
    "pieces": [
     {
      "label": "Relevés de notes officiels du lycée",
      "detail": "Pour chaque année de lycée suivie."
     },
     {
      "label": "Résultat d'un examen ou diplôme international accepté",
      "detail": "Par exemple SAT, IB ou A-Levels, si disponible."
     },
     {
      "label": "Lettre de motivation",
      "detail": ""
     },
     {
      "label": "Deux lettres de recommandation en anglais",
      "detail": "Au moins deux."
     },
     {
      "label": "Diplôme du baccalauréat",
      "detail": "Si disponible, avec traduction turque s'il n'est pas en anglais."
     },
     {
      "label": "Résultat d'un test d'anglais",
      "detail": "Facultatif."
     }
    ],
    "sourceVerification": {
     "url": "https://registrar.ku.edu.tr/en/admission/international-students/",
     "citation": "Copy of your official high school transcripts for every grade attended. At least (2) letters of recommendation in English.",
     "le": "2026-09-25T23:05:00.000Z",
     "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
    }
   }
  },
  "motif": "Lot 110 — 6 pièces lues sur la page officielle."
 },
 {
  "collection": "scholarships",
  "id": "jads-japan-africa-dream",
  "champs": {
   "piecesDossier": {
    "type": "propre",
    "pieces": [
     {
      "label": "Curriculum vitae à jour",
      "detail": ""
     },
     {
      "label": "Attestations d'emploi",
      "detail": "Une pour chaque emploi occupé depuis l'obtention de la licence."
     },
     {
      "label": "Copie certifiée du diplôme universitaire le plus élevé",
      "detail": ""
     },
     {
      "label": "Deux références professionnelles",
      "detail": ""
     },
     {
      "label": "Projet et plan de recherche",
      "detail": ""
     },
     {
      "label": "Test d'anglais",
      "detail": "TOEFL iBT ou TOEIC."
     }
    ],
    "sourceVerification": {
     "url": "https://www.afdb.org/en/about-us/careers/japan-africa-dream-scholarship-jads-program/what-can-an-applicant-do-before-the-call",
     "citation": "Identify two professional references. Prepare your research plan and proposal.",
     "le": "2026-09-25T23:05:00.000Z",
     "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
    }
   }
  },
  "motif": "Lot 110 — 6 pièces lues sur la page officielle."
 },
 {
  "collection": "scholarships",
  "id": "bourses-master-aui",
  "champs": {
   "piecesDossier": {
    "type": "propre",
    "pieces": [
     {
      "label": "Formulaire de demande de bourse de master",
      "detail": "Graduate Scholarship Application Form, à rendre avant la date limite."
     },
     {
      "label": "Curriculum vitae",
      "detail": ""
     },
     {
      "label": "Relevés de notes après le bac",
      "detail": "Copie des relevés universitaires."
     }
    ],
    "sourceVerification": {
     "url": "https://aui.ma/hubfs/PDFs/Graduate%20Scholarship%20Application%20Form.pdf?hsLang=en",
     "citation": "Please attach your CV and a copy of your post-Baccalaureate academic records or transcript.",
     "le": "2026-09-25T23:05:00.000Z",
     "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
    }
   }
  },
  "motif": "Lot 110 — 3 pièces lues sur la page officielle."
 },
 {
  "collection": "scholarships",
  "id": "lester-b-pearson-international-scholarship",
  "champs": {
   "piecesDossier": {
    "type": "admission",
    "pieces": [
     {
      "label": "Relevés de notes du secondaire",
      "detail": "Déposés dans l'espace candidat Join U of T."
     },
     {
      "label": "Formulaire des notes déclarées",
      "detail": "Seulement si l'université le demande."
     },
     {
      "label": "Preuve de maîtrise de l'anglais",
      "detail": "Selon le parcours scolaire du candidat."
     },
     {
      "label": "Résultats de tests standardisés",
      "detail": "SAT, ACT, IB ou AP, si le programme l'exige."
     },
     {
      "label": "Traductions certifiées",
      "detail": "Pour tout document ni en anglais ni en français."
     }
    ],
    "sourceVerification": {
     "url": "https://future.utoronto.ca/required-documents",
     "citation": "After you have applied, upload your transcripts and complete the self-reported grades form (if requested) through Join U of T or the Engineering Applicant Portal.",
     "le": "2026-09-25T23:05:00.000Z",
     "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
    }
   },
   "specialitesExclues": [
    "médecine",
    "dentisterie"
   ]
  },
  "motif": "Lot 110 — 5 pièces lues sur la page officielle ; pas de médecine en premier cycle à Toronto."
 },
 {
  "collection": "scholarships",
  "id": "king-abdulaziz-scholarship",
  "champs": {
   "piecesDossier": {
    "type": "admission",
    "pieces": [
     {
      "label": "Passeport valide",
      "detail": ""
     },
     {
      "label": "Certificat médical",
      "detail": "Attestant l'absence de maladies infectieuses."
     },
     {
      "label": "Diplômes et certificats légalisés",
      "detail": "Avec les autres documents exigés par l'établissement choisi."
     }
    ],
    "sourceVerification": {
     "url": "https://studyinsaudi.sa/en/Faq",
     "citation": "Submit a valid passport. Submit a medical report proving freedom from infectious diseases.",
     "le": "2026-09-25T23:05:00.000Z",
     "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
    }
   }
  },
  "motif": "Lot 110 — 3 pièces lues sur la page officielle."
 },
 {
  "collection": "scholarships",
  "id": "global-korea-scholarship",
  "champs": {
   "piecesDossier": {
    "type": "propre",
    "pieces": [
     {
      "label": "Une lettre de recommandation",
      "detail": ""
     },
     {
      "label": "Preuves de nationalité et de lien de parenté",
      "detail": "Pour le candidat et ses parents."
     },
     {
      "label": "Diplôme de fin d'études secondaires",
      "detail": "Ou attestation de diplôme attendu."
     },
     {
      "label": "Relevés de notes du lycée",
      "detail": ""
     },
     {
      "label": "Déclaration personnelle",
      "detail": "En coréen ou en anglais."
     },
     {
      "label": "Plan d'études",
      "detail": "En coréen ou en anglais."
     },
     {
      "label": "Auto-évaluation médicale",
      "detail": "Déclarée par le candidat dans le formulaire."
     },
     {
      "label": "Engagement du candidat GKS",
      "detail": "GKS Applicant Agreement à lire et accepter."
     }
    ],
    "sourceVerification": {
     "url": "https://www.studyinkorea.go.kr/public/v3/download/gks_undergraduate_user_guide.pdf",
     "citation": "The following documents are required for all applicants: ONE (1) Letter of Recommendation",
     "le": "2026-09-25T23:05:00.000Z",
     "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
    }
   }
  },
  "motif": "Lot 110 — 8 pièces lues sur la page officielle."
 },
 {
  "collection": "scholarships",
  "id": "sabanci-graduate-scholarships",
  "champs": {
   "piecesDossier": {
    "type": "admission",
    "pieces": [
     {
      "label": "Relevés de notes officiels",
      "detail": "De l'établissement précédent."
     },
     {
      "label": "Lettre de motivation",
      "detail": "Statement of Purpose."
     },
     {
      "label": "Curriculum vitae",
      "detail": ""
     },
     {
      "label": "Deux lettres de recommandation",
      "detail": ""
     },
     {
      "label": "Résultat de l'examen d'entrée en master",
      "detail": "ALES, GRE ou GAT selon le programme."
     },
     {
      "label": "Résultat d'un test d'anglais",
      "detail": ""
     }
    ],
    "sourceVerification": {
     "url": "https://www.sabanciuniv.edu/en/academic/university-registration-scholarships-and-fees/graduate-applications-requirements-2026-2027",
     "citation": "Online Application Form. Official Transcript. Statement of Purpose. Curriculum Vitae (CV). Two Letters of Recommendation.",
     "le": "2026-09-25T23:05:00.000Z",
     "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
    }
   }
  },
  "motif": "Lot 110 — 6 pièces lues sur la page officielle."
 },
 {
  "collection": "scholarships",
  "id": "veneto-regional-scholarship",
  "champs": {
   "piecesDossier": {
    "type": "propre",
    "pieces": [
     {
      "label": "Pièce d'identité",
      "detail": "Carte d'identité ou passeport"
     },
     {
      "label": "Code fiscal italien",
      "detail": "Délivré par l'administration fiscale italienne"
     },
     {
      "label": "Composition de la famille",
      "detail": "Nom, prénom, date de naissance et lien de parenté de chaque membre"
     },
     {
      "label": "Revenus de chaque membre de la famille",
      "detail": "Revenus de l'année de référence indiquée dans le guide"
     },
     {
      "label": "Biens immobiliers de la famille",
      "detail": "Avec le loyer annuel si la famille est locataire"
     },
     {
      "label": "Soldes bancaires et placements",
      "detail": "Au 31 décembre de l'année de référence"
     },
     {
      "label": "Autorisation de confidentialité signée",
      "detail": "Formulaire à télécharger sur www.unipd.it/en/isee"
     }
    ],
    "sourceVerification": {
     "url": "https://wwwassets.unipd.it/sites/default/files/2026-07/Guide_ISEE_ApplicationForBenefits_2026_ENG.pdf",
     "citation": "The documents useful for the release of the ISEE Parificato, listed on the attach 1 of this guide, must be uploaded on the portal of the CAF, available at the following link: http://parificati.confeuropadova.it",
     "le": "2026-09-25T23:05:00.000Z",
     "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
    }
   }
  },
  "motif": "Lot 110 — 7 pièces lues sur la page officielle."
 },
 {
  "collection": "scholarships",
  "id": "dsu-lombardia-milano-statale",
  "champs": {
   "piecesDossier": {
    "type": "propre",
    "pieces": [
     {
      "label": "Composition du foyer",
      "detail": "Délivrée par l'état civil ou une autorité publique du pays d'origine"
     },
     {
      "label": "Revenus du foyer en 2025",
      "detail": "Salaires, activité indépendante, pension, ou déclaration d'absence de revenus"
     },
     {
      "label": "Biens mobiliers au 31 décembre 2025",
      "detail": "Comptes, titres, assurances, ou déclaration d'absence"
     },
     {
      "label": "Biens immobiliers au 31 décembre 2025",
      "detail": "Avec la surface et la résidence principale, ou déclaration d'absence"
     }
    ],
    "sourceVerification": {
     "url": "https://www.unimi.it/sites/default/files/2026-07/Valutazione%20della%20condizione%20economica%20e%20patrimoniale%20degli%20studenti%20stranieri_EN.pdf",
     "citation": "List of documents to be produced: •Certificate attesting to the household composition, issued by a registry office or other competent public authority in accordance with the rules of the country of origin.",
     "le": "2026-09-25T23:05:00.000Z",
     "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
    }
   }
  },
  "motif": "Lot 110 — 4 pièces lues sur la page officielle."
 },
 {
  "collection": "scholarships",
  "id": "mastercard-foundation-scholars-uct",
  "champs": {
   "piecesDossier": {
    "type": "propre",
    "pieces": [
     {
      "label": "Pièce d'identité ou passeport",
      "detail": "Copie certifiée conforme, ou papiers de réfugié"
     },
     {
      "label": "Justificatif de domicile",
      "detail": ""
     },
     {
      "label": "Relevés de notes universitaires",
      "detail": "Actuels et précédents"
     },
     {
      "label": "Preuve du diplôme",
      "detail": "Diplôme obtenu ou en cours"
     },
     {
      "label": "Curriculum vitae",
      "detail": ""
     },
     {
      "label": "Essai",
      "detail": ""
     },
     {
      "label": "Déclaration signée",
      "detail": ""
     },
     {
      "label": "Déclaration sous serment",
      "detail": "À télécharger, remplir à la main, faire signer et tamponner par un commissaire aux serments"
     }
    ],
    "sourceVerification": {
     "url": "https://uct.ac.za/sites/default/files/media/documents/UCTMCFSP_PG_Scholarship_AppGuidelines_Intake.pdf",
     "citation": "UPLOAD CERTIFIED COPIES OF IDENTITY DOCUMENT, PASSPORT OR REFUGEE PAPERS, PROOF OF ADDRESS, CURRENT AND PREVIOUS POSTSECONDARY TRANSCRIPTS AS WELL AS PROOF FOR COMPLETE/CURRENT DEGREE, CURRICULUM VITAE, ESSAY, DECLARATION AND SIGNATURES AND AFFIDAVIT DECLARATION",
     "le": "2026-09-25T23:05:00.000Z",
     "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
    }
   }
  },
  "motif": "Lot 110 — 8 pièces lues sur la page officielle."
 },
 {
  "collection": "scholarships",
  "id": "clarendon-fund-scholarships",
  "champs": {
   "piecesDossier": {
    "type": "admission",
    "pieces": [
     {
      "label": "Curriculum vitae",
      "detail": ""
     },
     {
      "label": "Relevés de notes universitaires",
      "detail": "Tout le parcours universitaire, cours suivis et notes"
     },
     {
      "label": "Lettre de motivation ou projet de recherche",
      "detail": "Selon le cours"
     },
     {
      "label": "Travaux écrits",
      "detail": "Exemples de travaux universitaires, si le cours les demande"
     },
     {
      "label": "Lettres de référence",
      "detail": "Envoyées par les référents"
     },
     {
      "label": "Résultats de test d'anglais",
      "detail": "IELTS, TOEFL ou Cambridge C1/C2"
     }
    ],
    "sourceVerification": {
     "url": "https://www.ox.ac.uk/admissions/graduate/applying-to-oxford/application-guide/supporting-documents",
     "citation": "All graduate applicants must submit a CV (résumé) except where specifically stated in the 'How to apply' section of the course page. As part of your application, you must submit a detailed record of all your university-level education up to the present, including courses taken and grades achieved.",
     "le": "2026-09-25T23:05:00.000Z",
     "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
    }
   }
  },
  "motif": "Lot 110 — 6 pièces lues sur la page officielle."
 },
 {
  "collection": "scholarships",
  "id": "unibo-phd-scholarship",
  "champs": {
   "piecesDossier": {
    "type": "admission",
    "pieces": [
     {
      "label": "Pièce d'identité avec photo",
      "detail": "Scan recto verso, en cours de validité"
     },
     {
      "label": "Curriculum vitae",
      "detail": "Format et langue fixés par la fiche du programme"
     },
     {
      "label": "Diplômes de licence et de master avec relevés de notes",
      "detail": "Établissement, date, note finale, crédits ECTS et moyenne pondérée"
     },
     {
      "label": "Projet de recherche",
      "detail": "Seulement si la fiche du programme le prévoit"
     },
     {
      "label": "Lettres de référence",
      "detail": "Seulement si la fiche du programme le prévoit"
     },
     {
      "label": "Autres pièces du programme",
      "detail": "Celles listées dans la fiche du doctorat choisi"
     }
    ],
    "sourceVerification": {
     "url": "https://www.unibo.it/en/study/phd-professional-masters-specialisation-schools-and-other-programmes/phd/2026-2027/attachments/42-call-for-applications-first-round/@@download/file/42%20cycle_CallforApplications_FirstRound_ENG.pdf",
     "citation": "In order to submit the application, applicants shall: a) Scanned valid ID with photograph b) Curriculum Vitae c) Documents attesting the completion and awarding of both first and second-cycle degrees.",
     "le": "2026-09-25T23:05:00.000Z",
     "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
    }
   }
  },
  "motif": "Lot 110 — 6 pièces lues sur la page officielle."
 },
 {
  "collection": "scholarships",
  "id": "ozyegin-international-admission-scholarships",
  "champs": {
   "piecesDossier": {
    "type": "admission",
    "pieces": [
     {
      "label": "Passeport",
      "detail": "Page des informations personnelles"
     },
     {
      "label": "Diplôme de fin d'études secondaires",
      "detail": "Document officiel"
     },
     {
      "label": "Relevés de notes du lycée",
      "detail": "Officiels, avec les résultats d'examens nationaux ou internationaux reconnus"
     },
     {
      "label": "Résultats de test d'anglais",
      "detail": "Si disponibles"
     },
     {
      "label": "Lettre de motivation",
      "detail": "Essai expliquant pourquoi vous voulez étudier à Özyeğin"
     }
    ],
    "sourceVerification": {
     "url": "https://admissions.ozyegin.edu.tr/en/application/application-process",
     "citation": "Passport: (personal information page) Diploma: Official document signifying successful completion of high school",
     "le": "2026-09-25T23:05:00.000Z",
     "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
    }
   }
  },
  "motif": "Lot 110 — 5 pièces lues sur la page officielle."
 },
 {
  "collection": "scholarships",
  "id": "uir-bourse-etudes-internationaux",
  "champs": {
   "piecesDossier": {
    "type": "propre",
    "pieces": [
     {
      "label": "Formulaire de demande de bourse",
      "detail": "Rempli sur bourse.uir.ac.ma, imprimé, daté et signé."
     },
     {
      "label": "Règlement d'octroi de la bourse signé",
      "detail": "Signé par vous et votre tuteur légal ; disponible dans votre espace candidat."
     },
     {
      "label": "Déclaration sur l'honneur",
      "detail": "Selon le modèle fourni, signée par vous et votre tuteur légal."
     },
     {
      "label": "Baccalauréat et relevé de notes du bac",
      "detail": "Copie du diplôme ou de l'attestation de réussite."
     },
     {
      "label": "Relevés de notes après le bac",
      "detail": "Pour une demande en master ou une admission sur titre."
     },
     {
      "label": "Pièce d'identité",
      "detail": "Carte d'identité, passeport ou titre de séjour."
     },
     {
      "label": "Livret de famille ou actes de naissance de la fratrie",
      "detail": ""
     },
     {
      "label": "Certificats de scolarité des frères et sœurs de plus de 21 ans",
      "detail": ""
     },
     {
      "label": "Justificatifs de revenus des parents",
      "detail": "Attestation de travail et de salaire de moins de trois mois et trois derniers bulletins, ou justificatifs d'activité libérale."
     }
    ],
    "sourceVerification": {
     "url": "https://www.uir.ac.ma/upload/media/6a33f7fb3af87573565850.pdf",
     "citation": "LISTE DES PIECES A FOURNIR POUR LE DOSSIER DE DEMANDE DE BOURSE CANDIDATS INTERNATIONAUX",
     "le": "2026-09-25T23:05:00.000Z",
     "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
    }
   }
  },
  "motif": "Lot 110 — 9 pièces lues sur la page officielle."
 },
 {
  "collection": "scholarships",
  "id": "semmelweis-pannonia-in-excellence",
  "champs": {
   "exigences": [
    "admission_prealable",
    "deja_inscrit_sur_place"
   ]
  },
  "motif": "Lot 110 — réservée aux étudiants déjà inscrits à Semmelweis depuis au moins deux semestres.",
  "attendu": {
   "exigences": [
    "admission_prealable"
   ]
  }
 }
];

export const UNIVERSITIES = [];
export const SCHOLARSHIPS = [];
export const LINKS = [];
export const SUPPRESSIONS = [];
