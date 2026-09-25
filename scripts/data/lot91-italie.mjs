// ============================================================
// FitzUniverse — Lot 91 : ITALIE, bloc admission des 16 fiches
// Recherche du 2026-09-25, sources officielles uniquement : sites des
// universités (pages internationales, appels, règlements de frais en
// PDF), topuniversities.com pour le seul classement mondial.
//
// POURQUOI
// Charles, le 2026-09-25 : « On passe à l'Italie : bloc admission
// complet sur les 16 fiches existantes, même exigence que la
// Malaisie. » Aucun établissement nouveau : 16 PATCHES.
//
// MÉTHODE
// Quatre recherches parallèles (WebFetch) ont produit un brouillon ;
// TOUT ce qui entre ici a ensuite été RELU AU NAVIGATEUR le 2026-09-25 :
// navigateur intégré, puis Chrome de Charles pour les sites protégés
// (Trente, Florence, Milan, Pavie, Trieste, Bari ; contrôles anti-robot
// passés par Charles quand il y en avait). PDF lus dans la page avec
// pdf.js.
//
// CORRECTIONS DE FOND apportées par la relecture :
//   - PoliTo : le règlement des contributions 2026-2027 (décret du
//     10 juillet 2026) fixe pour les hors UE un montant PAR PAYS
//     (annexe 2) : 761 € pour la plupart des pays d'Afrique, et une
//     exonération pour les pays particulièrement pauvres (annexe 1,
//     dont le Sénégal) sur attestation de l'ambassade. La fiche disait
//     3 600 € d'office sans ISEE : faux. Nouveau montant 761 €.
//   - Bari : le règlement 2026-2027 (art. 12.3, annexe A) remplace le
//     forfait de 200 € par quatre groupes (0 / 500 / 1 000 / 2 600 €) ;
//     Sénégal en groupe A. Nouveau montant 211 € (0 + taxe régionale
//     195 € sans ISEE + timbre 16 €), au lieu de 360 €. Les frais de
//     pré-évaluation DreamApply sont de 30 € (art. 12.1).
//   - Naples : guide 2026-2027 ; taxe régionale 130 € pour les pays
//     particulièrement pauvres (DM 176 du 24 février 2026, Sénégal
//     compris). Nouveau montant 146 € au lieu de 184 €.
//   - Gênes : avec un ISEE-U jusqu'à 13 000 €, la contribution va de
//     0 à 450 € selon le groupe (la note disait 0 € pour tous).
//   - Padoue : la note citait un décret n°176 de février 2026 alors que
//     la page de l'université cite le n°166 du 3 mars 2025 : numéro
//     retiré. « Revenu familial » corrigé en ISEE dans l'exonération.
//   - SNS : le remboursement des droits dus à Pise ou Florence, noté
//     « à confirmer », est écrit dans l'appel 2026-2027 (art. 9.4).
//   - Sapienza : grille des bandes datée de 2025-2026 ; celle de
//     2026-2027 est annoncée après le 30 septembre.
// Montants relus et INCHANGÉS : Polimi, Bocconi, Unimi, Pavie, Pise,
// Bologne, Padoue, Trente, Trieste, Gênes, Sapienza, Florence.
//
// Classement : QS 2027 relu sur topuniversities (endpoint du
// classement, filtre Italie, 47 lignes) : neuf rangs passent en
// « ex æquo ». Bocconi et SNS ne figurent pas au classement mondial.
//
// NON TROUVÉ, donc NON ÉCRIT : calendriers 2027-2028 de la plupart des
// universités publiques (seules Bocconi et Padoue les publient) ;
// frais de candidature de Naples et d'Unimi (aucun n'est indiqué) ;
// scores IELTS/TOEFL généraux hors Polimi, Bocconi et Padoue. Le
// baccalauréat sénégalais est nommé par la Sapienza seulement ; il est
// absent des listes de Bocconi et de Padoue, ce que les fiches disent.
//
// PRIX RETENU : le tarif qu'un étudiant sénégalais paie d'office, sans
// démarche (règle des fiches italiennes existantes) ; PoliTo : 761 €,
// car l'exonération demande une attestation de l'ambassade ; Gênes :
// 3 025 €, tarif sans ISEE-U.
//
// `attendu` porte l'état lu dans l'export du 2026-09-25T02:44:56.478Z : les champs
// ajoutés sont ABSENTS (undefined), les champs remplacés sont recopiés
// entiers. Si quelqu'un est passé avant, le lot bloque au lieu
// d'écraser. Aucune photo dans ce lot.
// ============================================================

export const PATCHES = [
  {
    "collection": "universities",
    "id": "politecnico-di-milano-milan",
    "motif": "bloc admission (démarche 2026-2027 des candidats hors UE, test TOL, documents, anglais), province, rang ex æquo, langue d'enseignement, et note de frais réécrite sans tiret long, montants relus et inchangés, le 2026-09-25",
    "attendu": {
      "province": undefined,
      "ranking": "#87 mondial (QS 2027)",
      "langueEnseignement": undefined,
      "fraisScolarite": {
        "source": "https://www.polimi.it/en/students/tuition-fees-scholarships-and-financial-aid/tuition-fees",
        "verifieLe": "2026-09-12",
        "note": "2026-27, licence et master : contribution « tout compris » en deux versements — 880,04 € puis de 0 à 3 003 € selon le revenu familial —, plus taxe régionale (130 à 190 €), timbre 16 € et assurances 11 €, soit au plus environ 4 100 €/an. Pas de forfait par nationalité : un étudiant dont la famille a ses revenus à l'étranger fait calculer un ISEEU « parificato » par un CAF conventionné, qui fixe le second versement.",
        "licence": {
          "montant": 4100,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 4100,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "admission": undefined
    },
    "champs": {
      "province": "Lombardie",
      "ranking": "#87 mondial ex æquo (QS 2027)",
      "langueEnseignement": "Italien ou anglais selon le programme",
      "fraisScolarite": {
        "source": "https://www.polimi.it/en/students/tuition-fees-scholarships-and-financial-aid/tuition-fees",
        "verifieLe": "2026-09-25",
        "note": "2026-2027, licence et master : contribution en deux versements, 880,04 € puis de 0 à 3 003 € selon le revenu de la famille, plus la taxe régionale de 130 à 190 € (190 € sans attestation de revenus), le timbre de 16 € et 11,04 € d'assurances, soit au plus 4 100 € par an. Pas de tarif par nationalité : un étudiant dont la famille a ses revenus à l'étranger fait établir un ISEEU parificato par un centre d'assistance fiscale (CAF) conventionné, qui fixe le second versement. Montant retenu : le maximum.",
        "licence": {
          "montant": 4100,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 4100,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "admission": {
        "procedure": "Licence : inscription au test d'admission dans les services en ligne de l'école, avec dépôt des bulletins des trois dernières années et du diplôme, ou d'un certificat de scolarité ; le bureau des étudiants internationaux vérifie le dossier. Une fois admis, demande de visa sur Universitaly, conseillée avant fin juin, puis rendez-vous au consulat au plus tard le 30 novembre. Master : candidature en ligne, deux programmes au plus.",
        "conditions": "Licence : diplôme de fin d'études secondaires obtenu après au moins douze ans de scolarité ; une année de foundation course réussie peut compléter un parcours plus court. Ingénierie : test TOL de l'école, au moins 30 sur 100, ou TOLC-I, CEnT-S ou SAT (620 au moins dans chaque section). À l'inscription : déclaration de valeur, attestation CIMEA de comparabilité ou Certificate Supplement, avec apostille électronique ou attestation CIMEA de vérification. Un document en français, en anglais ou en espagnol n'a pas à être traduit.",
        "calendrier": "Rentrée 2026 : tests TOL du 1er février au 10 mars puis du 11 mars au 31 mai 2026 ; diplôme à déposer au plus tard le 10 septembre, déclaration de valeur au plus tard le 31 octobre. Les élèves en avant-dernière année peuvent passer le test anticipé, du 11 mars au 16 juillet 2026, pour la rentrée 2027. Master 2026-2027 : candidatures du 1er octobre 2025 au 29 janvier 2026 selon le domaine. Les dates 2027-2028 ne sont pas encore publiées.",
        "langue": "Programme en italien : italien B2 exigé avant l'inscription. Programme en anglais : IELTS 5 ou TOEFL iBT 59 en licence, IELTS 6 ou TOEFL iBT 78 en master. Un diplôme obtenu dans la langue du programme dispense du certificat.",
        "fraisDossier": "Licence : 35 € d'inscription au test TOL. Master : 50 € du 1er octobre au 1er décembre, 150 € ensuite.",
        "sources": [
          "https://www.polimi.it/en/prospective-students/how-to-apply/admission-to-laurea-programmes/students-with-a-foreign-degree",
          "https://www.polimi.it/en/prospective-students/how-to-apply/admission-to-laurea-programmes/requirements-to-participate-in-the-admission-test",
          "https://www.polimi.it/fileadmin/user_upload/futuri_studenti/Engineering_BSc_call_for_admission_2026-27__English_.pdf",
          "https://www.polimi.it/en/prospective-students/how-to-apply/admission-to-laurea-programmes/necessary-documents-for-enrolment",
          "https://www.polimi.it/en/prospective-students/how-to-apply/after-admission/apply-for-a-student-visa",
          "https://www.polimi.it/en/prospective-students/how-to-apply/admission-to-laurea-magistrale/foreign-qualification/deadlines",
          "https://www.polimi.it/en/students/language-requirements/students-of-an-english-language-laurea-study-programme"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "universita-bocconi-milan",
    "motif": "bloc admission (sessions 2027-2028, tests, anglais, frais de dossier), province, langue d'enseignement, et note de frais réécrite sans tiret long, montants relus et inchangés, le 2026-09-25",
    "attendu": {
      "province": undefined,
      "langueEnseignement": undefined,
      "fraisScolarite": {
        "source": "https://bit.unibocconi.it/hc/en-us/articles/17777210729362-Academic-tuition-and-fees-a-y-2026-27-Amounts-and-installments",
        "verifieLe": "2026-09-12",
        "note": "Université privée : 2026-27, plein tarif identique pour tous — 17 000 €/an en bachelor (BSc et droit), 18 550 €/an en master of science. Pas de forfait par nationalité comme dans les universités publiques italiennes.",
        "licence": {
          "montant": 17000,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 18550,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "admission": undefined
    },
    "champs": {
      "province": "Lombardie",
      "langueEnseignement": "Italien ou anglais selon le programme",
      "fraisScolarite": {
        "source": "https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/fees",
        "verifieLe": "2026-09-25",
        "note": "Université privée. 2026-2027, première année : 17 000 € par an en licence (sciences et droit), 18 550 € en master of science, même tarif pour toutes les nationalités. Le montant 2027-2028 n'est pas encore fixé. En master, des réductions de 20 % ou de 60 % existent selon la situation financière.",
        "licence": {
          "montant": 17000,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 18550,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "admission": {
        "procedure": "Test de sélection d'abord (test Bocconi en ligne, SAT ou ACT), puis candidature sur le portail Apply2B : une candidature pour l'école de droit, une autre pour l'économie et la gestion. La sélection repose sur le test (55 %) et sur les moyennes des deux années qui précèdent la dernière année du secondaire (45 %) ; lettres et CV ne comptent pas. Une fois admis, pré-inscription sur Universitaly au plus tard le 30 septembre, pour le visa.",
        "conditions": "Diplôme obtenu après au moins douze ans de scolarité, comptés depuis la première année du primaire ; avec onze ans, une année d'université réussie en entier, avec dix ans, deux. SAT : au moins 1040, et 520 dans chaque section ; ACT : au moins 19. Le Sénégal n'apparaît pas dans le tableau des diplômes de l'université : faites vérifier votre baccalauréat par le bureau des admissions avant de candidater. Attestations CIMEA de comparabilité et de vérification, ou déclaration de valeur du consulat.",
        "calendrier": "Licence, rentrée 2027 : session Early du 2 au 29 septembre 2026, résultats mi-novembre ; session Winter du 25 novembre 2026 au 26 janvier 2027, résultats mi-mars. Test Bocconi réservable du 13 juillet 2026 au 19 janvier 2027. Master of science : quatre sessions, du 1er octobre 2026 au 29 avril 2027.",
        "langue": "Programme en anglais : IELTS 6,5 avec 6 dans chaque partie, ou TOEFL iBT 88. Programme en italien : anglais B1, par exemple IELTS 5.",
        "fraisDossier": "100 € par candidature, en licence comme en master.",
        "sources": [
          "https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/application-and-admissions/admissions",
          "https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/application-and-admissions/secondary-school-diplomas",
          "https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/application-and-admissions/sat-and-act",
          "https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/application-and-admissions/english-certificates-accepted-enrollment",
          "https://www.unibocconi.it/en/applying-bocconi/immigration-documentation",
          "https://www.unibocconi.it/en/applying-bocconi/master-science-and-ma-programs/application-and-admissions/admissions"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "universita-degli-studi-di-milano-milan",
    "motif": "bloc admission (portail international, Universitaly, pièces, italien), province, rang ex æquo, et note de frais relue sur la page 2026-2027 (timbre ajouté, montant inchangé), le 2026-09-25",
    "attendu": {
      "province": undefined,
      "ranking": "#270 mondial (QS 2027)",
      "fraisScolarite": {
        "source": "https://www.unimi.it/en/study/bachelor-and-master-study/fees-and-how-pay-them/fees-2026/2027",
        "verifieLe": "2026-09-12",
        "note": "2026-27, étudiant hors UE sans ISEE : forfait par groupe de pays. Groupe A (liste annexée : Sénégal, Côte d'Ivoire, Cameroun, Mali, Guinée, Bénin, Burkina Faso, Togo, Niger, Maroc, Tunisie, Égypte, Nigeria, Ghana, Kenya, RDC…) : 130 € de taxe régionale + 200 € (domaine A) ou 256 € (domaine B), soit 330 à 386 €/an. Groupe B : 160 € + 910/1 164 €. Groupe C : 190 € + 3 204/4 101 €. Licence et master. Montant retenu : groupe A, domaine B (le plus élevé de la tranche).",
        "licence": {
          "montant": 386,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 386,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "admission": undefined
    },
    "champs": {
      "province": "Lombardie",
      "ranking": "#270 mondial ex æquo (QS 2027)",
      "fraisScolarite": {
        "source": "https://www.unimi.it/en/study/bachelor-and-master-study/fees-and-how-pay-them/fees-2026/2027",
        "verifieLe": "2026-09-25",
        "note": "2026-2027, étudiant hors UE sans ISEE : taxe régionale et deuxième versement selon le groupe du pays. Groupe A, dont le Sénégal, la Côte d'Ivoire, le Cameroun, le Mali, le Maroc et la plupart des pays d'Afrique : 130 € de taxe régionale, plus 200 € (domaine A) ou 256 € (domaine B), soit 330 à 386 € par an, et le timbre de 16 € au premier versement. Groupe B : 160 € plus 910 ou 1 164 €. Groupe C : 190 € plus 3 204 ou 4 101 €. Licence et master. Montant retenu : groupe A, domaine B.",
        "licence": {
          "montant": 386,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 386,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "admission": {
        "procedure": "Candidature sur le portail international de l'université, réservé aux diplômes étrangers : trois programmes au plus par année, pièces variables selon le pays. Après l'e-mail officiel d'admission, pré-inscription sur Universitaly pour le visa, pour une seule université et un seul programme. Les programmes à nombre de places limité ont leur propre appel, avec un test et des places réservées aux candidats hors UE.",
        "conditions": "Diplôme de fin d'études secondaires traduit en italien par un traducteur officiel et légalisé, avec les attestations CIMEA de comparabilité et de vérification, ou une déclaration de valeur de l'ambassade d'Italie. Avec moins de douze ans de scolarité : certificat d'inscription à l'université avec les examens passés, ou certificat de foundation course. Selon le programme, test d'admission ou évaluation des acquis.",
        "calendrier": "2026-2027 : pré-inscription sur Universitaly au plus tard le 31 juillet 2026, sous peine d'exclusion ; en master, les candidats avec visa devaient postuler au plus tard le 30 avril 2026. Le calendrier 2027-2028 n'est pas encore publié.",
        "langue": "Pour le visa, niveau B2 en italien ou en anglais, dans la langue du programme. Programme en italien : test d'italien obligatoire, sauf certificat B2 reconnu (système CLIQ) ou diplôme d'une école italienne à l'étranger.",
        "fraisDossier": "Aucun frais de candidature n'est indiqué sur le portail international.",
        "sources": [
          "https://www.unimi.it/en/international/coming-abroad/enrol-programme/international-enrolment-degree-programmes",
          "https://apply.unimi.it/",
          "https://apply.unimi.it/news/new/9-notice-all-visa-applicants",
          "https://apply.unimi.it/news/new/8-universitaly---202627-pre-enrolment"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "universita-di-pavia-pavie",
    "motif": "bloc admission (fenêtres de candidature, Universitaly, test d'italien), province, rang ex æquo, langue d'enseignement ; frais relus sur la grille 2026-2027, inchangés, le 2026-09-25",
    "attendu": {
      "province": undefined,
      "ranking": "#395 mondial (QS 2027)",
      "langueEnseignement": undefined,
      "fraisScolarite": {
        "source": "https://en.unipv.it/sites/sten/files/2026-05/Fla%20Rate%20brackets%20a.y.%202026-27.pdf",
        "verifieLe": "2026-09-12",
        "note": "Forfait (« Flat Rate ») 2026-27 pour les étudiants hors UE, fixé selon la nationalité et le domaine, sans justificatif de revenus. Tranche 1 (classement Banque mondiale, dont Sénégal, Côte d'Ivoire, Cameroun, Mali, Guinée, Bénin, Burkina Faso, Togo, Niger, Maroc, Tunisie, Nigeria, Kenya, Ghana, Égypte…) : 390 €/an, humanités comme sciences. Tranche 2 : 1 020 € (humanités) ou 1 520 € (sciences). Tranche 3 : 3 550 € ou 4 550 €. Licence et master.",
        "licence": {
          "montant": 390,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 390,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "admission": undefined
    },
    "champs": {
      "province": "Lombardie",
      "ranking": "#395 mondial ex æquo (QS 2027)",
      "langueEnseignement": "Italien ; 30 programmes en anglais",
      "fraisScolarite": {
        "source": "https://en.unipv.it/sites/sten/files/2026-05/Fla%20Rate%20brackets%20a.y.%202026-27.pdf",
        "verifieLe": "2026-09-25",
        "note": "Forfait (« Flat Rate ») 2026-27 pour les étudiants hors UE, fixé selon la nationalité et le domaine, sans justificatif de revenus. Tranche 1 (classement Banque mondiale, dont Sénégal, Côte d'Ivoire, Cameroun, Mali, Guinée, Bénin, Burkina Faso, Togo, Niger, Maroc, Tunisie, Nigeria, Kenya, Ghana, Égypte…) : 390 €/an, humanités comme sciences. Tranche 2 : 1 020 € (humanités) ou 1 520 € (sciences). Tranche 3 : 3 550 € ou 4 550 €. Licence et master.",
        "licence": {
          "montant": 390,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 390,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "admission": {
        "procedure": "Candidature sur le portail apply.unipv.eu pendant l'une des fenêtres, avec pièce d'identité et diplôme en anglais, espagnol ou français, ou traduit officiellement en italien. Une fois admis, pré-inscription sur Universitaly avec la lettre d'admission ; la déclaration de valeur et les attestations CIMEA s'ajoutent si vous les avez déjà. Programmes à accès limité : test sélectif et appel propre.",
        "conditions": "Licence : diplôme obtenu après au moins douze ans de scolarité, dont deux ans dans le même programme, et examen d'accès à l'université si le système du pays en prévoit un. Avec moins de douze ans, l'université propose une Foundation Year.",
        "calendrier": "Rentrée 2026, programmes à accès libre : fenêtres du 12 au 20 novembre 2025, du 12 au 20 janvier 2026 et du 5 au 11 juin 2026 pour les candidats hors UE ; Universitaly au plus tard le 25 mai 2026, le 20 juillet pour la fenêtre de juin, le 31 août pour l'accès limité. En juin 2026, quatre programmes n'avaient plus de places pour les candidats avec visa. Le calendrier 2027-2028 n'est pas encore publié.",
        "langue": "Programme en italien : test d'italien en ligne du CISIA, réussi à partir de 54 sur 72 (niveau proche de B2), 35 €. Programme en anglais : certificat d'anglais demandé par certains programmes.",
        "fraisDossier": "35 € par candidature, obligatoires et non remboursables, à payer avant la fin de la fenêtre.",
        "sources": [
          "https://en.unipv.it/en/education/bachelors-and-masters-degree-programs/how-apply/how-apply-bachelors-or-single-cycle-masters-degree-programs",
          "https://en.unipv.it/en/education/bachelors-and-masters-degree-programs/after-admission/non-eu-prospective-students",
          "https://apply.unipv.eu/en_GB/news/new/72-application-calendar-202627",
          "https://apply.unipv.eu/en_GB/news/new/88-information-pre-enrollment-and-visa-application-ay-20262027"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "politecnico-di-torino-turin",
    "motif": "CORRECTION DES FRAIS : le règlement 2026-2027 fixe pour les hors UE un montant par pays (761 € pour la plupart des pays d'Afrique, exonération possible pour les pays particulièrement pauvres dont le Sénégal), et non 3 600 € d'office ; plus bloc admission, province, rang ex æquo, langue d'enseignement, le 2026-09-25",
    "attendu": {
      "province": undefined,
      "ranking": "#206 mondial (QS 2027)",
      "langueEnseignement": undefined,
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Réduction jusqu'à 600 € par an si votre ISEE parificato (indicateur de la situation économique de la famille) ne dépasse pas 100 000 €. Faites-le établir depuis l'étranger, avant l'inscription. Bourses au mérite pour étudiants internationaux : TOPoliTO (8 000 € par an) et bourses MAECI du gouvernement italien.",
        "source": "https://www.polito.it/en/education/international-students/financial-aid",
        "verifieLe": "2026-09-13"
      },
      "fraisScolarite": {
        "source": "https://www.polito.it/sites/default/files/2025-07/ENG_Regolamento%20contribuz_immatricolati_post%20CDA.pdf",
        "verifieLe": "2026-09-13",
        "note": "Règlement des contributions (immatriculés à partir de 2025-26) : contribution annuelle de 600 € minimum à 3 600 € maximum. Un étudiant hors UE dont la famille a ses revenus à l'étranger doit faire établir un ISEE parificato pour obtenir une réduction ; SANS ce document, le tarif maximum de 3 600 € s'applique d'office. Montant retenu : le maximum, celui que paie l'étudiant qui ne fait pas la démarche. Pas de forfait par pays comme à Pavia, Bologne ou Padoue.",
        "licence": {
          "montant": 3600,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 3600,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "admission": undefined
    },
    "champs": {
      "province": "Piémont",
      "ranking": "#206 mondial ex æquo (QS 2027)",
      "langueEnseignement": "Italien ou anglais selon le programme",
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Ressortissant d'un pays de la liste ministérielle des pays particulièrement pauvres (dont le Sénégal, le Mali, le Niger, la Guinée, le Bénin, le Burkina Faso et le Togo) : exonération de la contribution annuelle, sur attestation de la représentation italienne de votre pays indiquant que votre famille n'est pas notoirement aisée, demandée par ticket depuis votre espace étudiant avant la date limite des réductions. Sinon, 761 € par an. Il existe aussi des bourses au mérite (TOPoliTO) et des bourses du gouvernement italien.",
        "source": "https://www.polito.it/sites/default/files/2026-07/Regolamento%20L%20imma%2025_26%20%2B%20LM_LS.pdf",
        "verifieLe": "2026-09-25"
      },
      "fraisScolarite": {
        "source": "https://www.polito.it/sites/default/files/2026-07/Regolamento%20L%20imma%2025_26%20%2B%20LM_LS.pdf",
        "verifieLe": "2026-09-25",
        "note": "Règlement des contributions 2026-2027 (décret du 10 juillet 2026) : un étudiant hors UE dont la famille a ses revenus et son patrimoine à l'étranger paie un montant fixe selon son pays, calculé sur le PIB par habitant en parité de pouvoir d'achat (annexe 2), de 761 à 3 761 € par an. 761 € pour les pays non listés et pour la plupart des pays d'Afrique (Algérie, Cameroun, Côte d'Ivoire, Maroc, Égypte, Ghana, Nigeria). Les ressortissants des pays particulièrement pauvres (annexe 1, dont le Sénégal) sont exonérés de la contribution sur attestation de la représentation italienne ; restent la taxe régionale (140 €), le timbre (16 €) et l'assurance (5 €). Montant retenu : 761 € par an, licence et master.",
        "licence": {
          "montant": 761,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 761,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "admission": {
        "procedure": "Candidature sur Apply@polito : inscription avec les données exactes du passeport, choix d'une session du test TIL ou envoi d'un score SAT, puis dépôt du certificat de langue. Une fois admis, pré-inscription sur Universitaly et demande de visa auprès du consulat. Master : candidature sur la même plateforme, par appel.",
        "conditions": "Licence : diplôme de fin d'études secondaires obtenu après au moins douze ans de scolarité ; avec moins, relevé des examens de la première année d'université. Test TIL passé en présentiel à Turin ou à Mondovì, ou score SAT (sauf en architecture) ; les places vont aux meilleurs scores. Pièces : déclaration de valeur du diplôme ou attestation CIMEA de comparabilité.",
        "calendrier": "Rentrée 2026, candidats hors UE avec visa : sessions du test TIL du 19 février à mai 2026, inscriptions ouvertes le 22 janvier ; certificat de langue au plus tard le 22 mai et Universitaly au plus tard le 30 juin 2026. Master : appels clos le 13 février et le 20 avril 2026. Le calendrier 2027-2028 n'est pas encore publié.",
        "langue": "Programme en anglais : anglais B2 au moins. Programme en italien : italien B2 au moins. Certificats reconnus listés par l'école.",
        "fraisDossier": "Licence : 50 € d'inscription au test TIL, non remboursables. Master : 50 € non remboursables, payés par carte.",
        "sources": [
          "https://www.polito.it/en/education/applying-studying-graduating/admissions-and-enrolment/bachelor-s-degree-programmes/applicants-with-a-non-italian-qualification",
          "https://www.polito.it/en/education/applying-studying-graduating/admissions-and-enrolment/bachelor-s-degree-programmes/admission-test",
          "https://www.polito.it/en/education/applying-studying-graduating/admissions-and-enrolment/master-s-degree-programmes/applicants-with-a-non-italian-qualification",
          "https://didattica.polito.it/inte/en/apply_bsc_step2b"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "sapienza-universita-di-roma-rome",
    "motif": "bloc admission (présélection 2026-2027, baccalauréat sénégalais nommé, langue), province, rang ex æquo, langue d'enseignement, et note de frais réécrite (bandes relues, année de la grille précisée), le 2026-09-25",
    "attendu": {
      "province": undefined,
      "ranking": "#111 mondial (QS 2027)",
      "langueEnseignement": undefined,
      "fraisScolarite": {
        "source": "https://www.uniroma1.it/en/content/standard-registration-fee-amounts",
        "verifieLe": "2026-09-12",
        "note": "Étudiant dont la famille a ses revenus à l'étranger (pas d'ISEE) : forfait annuel par bande de pays (PIB à parité de pouvoir d'achat). Bande A, 300 €/an : Sénégal, Côte d'Ivoire, Cameroun, Mali, Guinée, Bénin, Burkina Faso, Togo, Niger, Maroc, Tunisie, Algérie, Égypte, Nigeria, Ghana, Kenya, RDC, Afrique du Sud… Bande B (Turquie, Mexique, Chili…) : 700 €. Bande C (pays développés) : 1 500 €. Année 2025-26 indiquée sur la page. Licence et master.",
        "licence": {
          "montant": 300,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 300,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "admission": undefined
    },
    "champs": {
      "province": "Latium",
      "ranking": "#111 mondial ex æquo (QS 2027)",
      "langueEnseignement": "Italien ; 8 licences et 45 masters en anglais",
      "fraisScolarite": {
        "source": "https://www.uniroma1.it/en/content/standard-registration-fee-amounts",
        "verifieLe": "2026-09-25",
        "note": "Étudiant dont la famille a ses revenus à l'étranger : forfait annuel par bande de pays, selon le PIB en parité de pouvoir d'achat. Bande A, 300 € par an, dont le Sénégal, l'Algérie, le Bénin et le Burkina Faso ; bande B, 700 € ; bande C, 1 500 €. Montants de 2025-2026, payables en trois fois ; l'université annonce ceux de 2026-2027 pour après le 30 septembre. Licence et master.",
        "licence": {
          "montant": 300,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 300,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "admission": {
        "procedure": "Programmes enseignés en anglais : présélection en ligne, avec passeport, diplômes, relevés, certificat de langue et lettre de recommandation facultative, deux programmes au plus par an. Les présélectionnés s'inscrivent ensuite sur Universitaly pour le visa. Les programmes en italien suivent les appels publiés dans le catalogue des cours.",
        "conditions": "Licence : diplôme obtenu après au moins douze ans de scolarité. Pour le Sénégal, l'université demande le baccalauréat (Bachelier de l'enseignement du second degré) ; pour le master, la licence et le relevé de notes. Certains programmes imposent un test d'admission, comme la médecine.",
        "calendrier": "2026-2027, candidats hors UE avec visa : présélection du 22 décembre 2025 au 15 mai 2026, puis Universitaly au plus tard le 30 juin 2026 ; entre le 15 mai et fin juin, seuls les programmes en italien restaient ouverts. Le calendrier 2027-2028 n'est pas encore publié.",
        "langue": "Niveau B2 en anglais ou en italien selon le programme. IELTS, TOEFL iBT, Cambridge et PTE acceptés ; le score exigé dépend du programme.",
        "fraisDossier": "30 € par candidature de présélection, deux au plus ; aucune dispense.",
        "sources": [
          "https://www.uniroma1.it/en/admissions",
          "https://www.uniroma1.it/en/pagina/applying-sapienza-international-student",
          "https://www.uniroma1.it/sites/default/files/field_file_allegati/accepted_qualifications_2026_06_26.pdf",
          "https://www.uniroma1.it/sites/default/files/field_file_allegati/language_requirements_sapienza_2026.pdf"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "scuola-normale-superiore-pise",
    "motif": "bloc admission (concours 2026-2027 ouvert à toutes les nationalités, langues des épreuves, dispense du TOLC), province, et note de frais réécrite (capitales et accents manquants ; remboursement des droits de Pise ou Florence confirmé par l'appel), le 2026-09-25",
    "attendu": {
      "province": undefined,
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
      "admission": undefined
    },
    "champs": {
      "province": "Toscane",
      "fraisScolarite": {
        "source": "https://www.sns.it/sites/default/files/2026-06/bando_sns_2026_27_rettificato.pdf",
        "verifieLe": "2026-09-25",
        "note": "Les élèves admis au concours étudient gratuitement, quelle que soit leur nationalité : cours, logement en collège et repas fournis, plus une contribution annuelle calculée selon le revenu de la famille, qui rembourse aussi tout ou partie des droits dus à l'Université de Pise ou de Florence. Pas de tarif hors UE : seul le concours compte. Les doctorants admis reçoivent une bourse. L'appel 2026-2027 ne prévoit aucun frais de candidature.",
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
      "admission": {
        "procedure": "Admission uniquement par concours, ouvert à toutes les nationalités : demande en ligne sur le site de l'école, en italien ou en anglais, puis épreuves écrites et orales à Pise, ou à Florence pour les sciences politico-sociales. Les élèves suivent aussi les cours de l'Université de Pise ou de Florence.",
        "conditions": "Diplôme donnant accès à l'université en Italie, obtenu à partir de 2024-2025 ou au plus tard le 30 septembre 2026, et reconnu par l'Université de Pise ou de Florence. En sciences, présélection par un test TOLC, dont sont dispensés les candidats étrangers diplômés à l'étranger qui passent les épreuves en anglais (ou en français en lettres). Un niveau d'italien suffisant pour suivre les cours est exigé.",
        "calendrier": "Concours 2026-2027 : demandes jusqu'au jeudi 30 juillet 2026 à 14 h, heure italienne ; écrits à partir du 24 août, oraux à partir du 7 septembre 2026 ; 60 places en première année et 22 au deuxième niveau. L'appel 2027-2028 n'est pas encore publié.",
        "langue": "Épreuves en italien, en français ou en anglais en lettres et philosophie ; en italien ou en anglais en sciences et en sciences politico-sociales. Les cours supposent un niveau d'italien suffisant.",
        "fraisDossier": "Aucun frais de candidature dans l'appel 2026-2027. Pendant les épreuves, logement gratuit si l'ISEE est inférieur à 35 000 €, et remboursement du voyage jusqu'à 700 € pour un candidat résidant à l'étranger, sur présentation de l'ISEE.",
        "sources": [
          "https://www.sns.it/en/concorso-ordinario",
          "https://www.sns.it/sites/default/files/2026-06/bando_sns_2026_27_rettificato.pdf",
          "https://www.sns.it/en/studiare-a-costo-zero"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "universita-di-pisa-pise",
    "motif": "bloc admission (Universitaly, portails, test d'italien, programmes en anglais), province, et note de frais réécrite (accents manquants, capitales), montants relus sur la page et le tableau des pays 2026-2027, inchangés, le 2026-09-25",
    "attendu": {
      "province": undefined,
      "fraisScolarite": {
        "source": "https://www.unipi.it/index.php/english/tuition-fees",
        "verifieLe": "2026-09-13",
        "note": "Pise applique AUTOMATIQUEMENT aux etudiants dont les revenus et le patrimoine sont a l'etranger un forfait indexe sur la categorie de revenu de leur pays d'origine (Banque mondiale), sans demande a deposer. Contribution annuelle 2026-2027 : pays a faible revenu 290 EUR ; pays a revenu intermediaire tranche inferieure 580 EUR ; tranche superieure 1 160 EUR ; pays a haut revenu 2 900 EUR. S'y ajoutent 140 EUR de taxe regionale chaque annee et 16 EUR de timbre a la premiere inscription. Montant retenu : la tranche inferieure des revenus intermediaires (Senegal, Cote d'Ivoire, Cameroun, Maroc, Tunisie, Nigeria, Kenya...), soit 580 + 140 = 720 EUR/an ; un etudiant d'un pays a faible revenu (Mali, Niger, Burkina, RDC, Madagascar...) paie 430 EUR/an. Une reduction supplementaire reste possible sur ISEE parificato. Paiement en cinq echeances entre septembre et mai.",
        "licence": {
          "montant": 720,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 720,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "admission": undefined
    },
    "champs": {
      "province": "Toscane",
      "fraisScolarite": {
        "source": "https://www.unipi.it/en/education/registration/enrolment-and-registration/enrolment-for-international-students/reduction-of-tuition-fees/",
        "verifieLe": "2026-09-25",
        "note": "Étudiant dont les revenus et le patrimoine sont à l'étranger : forfait appliqué d'office selon la catégorie de revenu du pays (Banque mondiale), sur un maximum de 2 900 €. 2026-2027 : pays à faible revenu 290 € ; revenu intermédiaire inférieur 580 € (Sénégal, Côte d'Ivoire, Cameroun, Maroc) ; supérieur 1 160 € ; élevé 2 900 €. S'ajoutent la taxe régionale de 140 € et le timbre de 16 €. Montant retenu : 720 € par an (580 + 140). Paiement en cinq échéances, de septembre 2026 à mai 2027 ; réduction possible avec un ISEEU parificato.",
        "licence": {
          "montant": 720,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 720,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "admission": {
        "procedure": "Licence : pré-inscription sur Universitaly pour le visa, inscription aux tests ou concours sur le portail Alice de l'université, puis inscription définitive avec le visa D. Programmes enseignés en anglais : candidature sur le portail applymscenglish.unipi.it. Master en italien : décision d'admission à demander sur le portail ammissionelm avant Universitaly.",
        "conditions": "Au moins douze ans de scolarité, avec un diplôme qui ouvre l'accès à l'université dans le pays. Déclaration de valeur de l'ambassade d'Italie avec traduction officielle en italien, ou attestation CIMEA de comparabilité. Test d'italien obligatoire, à distance en 2026-2027, pour les candidats hors UE résidant à l'étranger.",
        "calendrier": "2026-2027 : Universitaly au plus tard le 30 septembre 2026, plus tôt pour les programmes à nombre limité ; seuls les visas délivrés au plus tard le 30 novembre 2026 sont acceptés ; 4 500 places pour les candidats avec visa. Master en italien : demandes d'admission dès le 8 juillet 2026. Programmes en anglais : dates propres, par exemple le 5 février 2026 en ingénierie.",
        "langue": "Programme en italien : certificat d'italien B2 reconnu (système CLIQ) ou Open Badge du centre de langues de l'université. Programme en anglais : voir l'appel du programme.",
        "fraisDossier": "Programmes en anglais : 30 € par candidature, deux au plus, pour les titulaires d'un diplôme étranger.",
        "sources": [
          "https://www.unipi.it/en/education/registration/enrolment-and-registration/enrolment-for-international-students/bachelors-and-single-cycle-masters-degree-courses-no-eu-citizenship/",
          "https://www.unipi.it/en/education/registration/enrolment-and-registration/enrolment-for-international-students/pre-registration-on-universitaly/",
          "https://applymscenglish.unipi.it/en/studenti/cdlattivi/1",
          "https://applymscenglish.unipi.it/downloads/downloadpdf/bandicdl/2026/bando_9_wdh-lm_en.pdf"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "universita-di-firenze-florence",
    "motif": "bloc admission (licence par Universitaly puis portail GCS, master par Apply Unifi, italien), province, rang ex æquo ; frais inchangés, le 2026-09-25",
    "attendu": {
      "province": undefined,
      "ranking": "#409 mondial (QS 2027)",
      "admission": undefined
    },
    "champs": {
      "province": "Toscane",
      "ranking": "#409 mondial ex æquo (QS 2027)",
      "admission": {
        "procedure": "Licence : pré-inscription sur Universitaly pour le visa, rendez-vous à l'ambassade, puis, à l'arrivée, demande de permis de séjour sous huit jours ouvrables et inscription sur le portail GCS de l'université, avec paiement par PagoPA. Master : demande du document d'admission sur le portail Apply Unifi, avant Universitaly.",
        "conditions": "Licence : diplôme attestant au moins douze ans de scolarité ; avec onze ans, relevé des examens de la première année d'université, avec dix ans, des deux premières années, ou Foundation Year. Pièces : diplôme original légalisé ou apostillé, déclaration de valeur ou attestations CIMEA de vérification et de comparabilité. Un document en anglais, en français ou en espagnol n'a pas à être traduit.",
        "calendrier": "Master 2026-2027 : première session du 10 décembre 2025 au 6 février 2026, deuxième du 16 février au 17 avril 2026 ; la troisième, de juin à août, était réservée aux candidats de l'UE et aux candidats déjà résidents en Italie. Le calendrier 2027-2028 n'est pas encore publié.",
        "langue": "Programme en italien : certificat d'italien B2 (CELI, CILS, PLIDA…), ou test CISIA ITA L2 réussi à 55 sur 72 avec un oral au centre de langues. Programme en anglais : pas d'italien exigé.",
        "fraisDossier": "Master : 20 € de frais de candidature sur Apply Unifi.",
        "sources": [
          "https://www.unifi.it/en/study-us/your-learning-path/start-your-enrolment/international-students/non-eu-students",
          "https://www.unifi.it/en/study-us/access-and-enrolment/tests-and-how-access-courses/italian-language-knowledge",
          "https://apply.unifi.it/news/new/28-20262027-academic-year-intake-rounds",
          "https://apply.unifi.it/news/new/30-apply-admission"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "universita-degli-studi-di-napoli-federico-ii-naples",
    "motif": "FRAIS MIS À JOUR sur le guide 2026-2027 (taxe régionale 130 € pour les pays particulièrement pauvres dont le Sénégal, 151 € pour une famille à l'étranger ; montant retenu 146 € au lieu de 184 €) ; plus bloc admission, province, langue d'enseignement, le 2026-09-25",
    "attendu": {
      "province": undefined,
      "langueEnseignement": undefined,
      "exoneration": {
        "politique": "systematique",
        "detail": "Selon le guide de l'université, les ressortissants de pays hors Union européenne sont totalement exonérés de la contribution d'inscription. L'exonération dépend de la nationalité et s'applique d'office, sans dossier ni formulaire. Il reste à payer la taxe régionale et le timbre.",
        "source": "https://www.unina.it/documents/20117/1741540/guida_studente_rapida_25_26.pdf",
        "verifieLe": "2026-09-13"
      },
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
      "admission": undefined
    },
    "champs": {
      "province": "Campanie",
      "langueEnseignement": "Italien ; certains programmes en anglais",
      "exoneration": {
        "politique": "systematique",
        "detail": "Selon le guide 2026-2027 de l'université, les ressortissants de pays hors Union européenne sont totalement exonérés de la contribution d'inscription, d'office, sans dossier ni formulaire. Restent la taxe régionale et le timbre de 16 €.",
        "source": "https://www.unina.it/documents/d/guest/guida_studente_rapida_26-27_10-7-2026",
        "verifieLe": "2026-09-25"
      },
      "fraisScolarite": {
        "source": "https://www.unina.it/documents/d/guest/guida_studente_rapida_26-27_10-7-2026",
        "verifieLe": "2026-09-25",
        "note": "Guide d'inscription 2026-2027 : les étudiants de nationalité hors UE ne paient pas la contribution d'inscription, seulement la taxe régionale et le timbre de 16 €. Taxe régionale 2026-2027 : 130 € pour les ressortissants des pays particulièrement pauvres de la liste ministérielle, dont le Sénégal, ou avec un ISEEU jusqu'à 25 500 € ; 151 € pour un étudiant dont la famille réside à l'étranger ; 173 € sans attestation ISEEU. Montant retenu : 146 € par an (130 + 16) pour un étudiant sénégalais ; 167 € pour les autres étudiants dont la famille vit à l'étranger.",
        "licence": {
          "montant": 146,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 146,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "admission": {
        "procedure": "Pré-inscription sur Universitaly pour le visa, puis évaluation du dossier par le coordinateur du programme choisi ; pour un programme à accès limité, inscription au test d'admission selon l'avis publié sur le site du programme. L'inscription se fait ensuite au guichet du secrétariat des étudiants : les étudiants de nationalité étrangère ne peuvent pas s'inscrire en ligne.",
        "conditions": "Diplôme correspondant au titre italien exigé. Pièces pour l'évaluation : traductions, légalisations, attestations CIMEA ou déclaration de valeur. À l'inscription : passeport, photo, code fiscal, récépissé du permis de séjour, déclaration de valeur de l'ambassade d'Italie ou attestation ENIC-NARIC.",
        "calendrier": "2026-2027 : pré-inscription sur Universitaly du 5 mai au 15 juin 2026. Les dates des tests et de l'évaluation sont fixées programme par programme. Le calendrier 2027-2028 n'est pas encore publié.",
        "langue": "Programme en italien : italien B2, par un certificat reconnu versé sur Universitaly ou par un test organisé par le coordinateur. Programme en anglais : pas d'italien exigé ; un certificat d'anglais (IELTS, TOEFL, Cambridge) aide pour le visa.",
        "fraisDossier": "Aucun frais de candidature n'est indiqué sur la page des étudiants hors UE.",
        "sources": [
          "https://www.international.unina.it/non-eu-students-enrolment/",
          "https://www.unina.it/it/w/universitaly_2026_27",
          "https://www.unina.it/documents/d/guest/guida_studente_rapida_26-27_10-7-2026"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "universita-di-bari-aldo-moro-bari",
    "motif": "CORRECTION DES FRAIS sur le règlement 2026-2027 : contribution fixe par groupe de pays (0 € pour le Sénégal et les pays particulièrement pauvres, 500 € pour le Cameroun ou la Côte d'Ivoire), et non plus 200 € ; montant retenu 211 € au lieu de 360 € ; plus bloc admission et province, le 2026-09-25",
    "attendu": {
      "province": undefined,
      "exoneration": {
        "politique": "systematique",
        "detail": "Si votre pays figure sur la liste ministérielle des pays en développement, vous payez un forfait de 200 €. Les étudiants réfugiés ou sous protection subsidiaire sont exonérés de toute la contribution : ils paient seulement la taxe régionale et le timbre.",
        "source": "https://www.uniba.it/it/studenti/segreterie-studenti/studenti-stranieri/studenti-internazionali-tasse-contributi-ed-esoneri",
        "verifieLe": "2026-09-13"
      },
      "fraisScolarite": {
        "source": "https://www.uniba.it/it/studenti/segreterie-studenti/studenti-stranieri/studenti-internazionali-tasse-contributi-ed-esoneri",
        "verifieLe": "2026-09-13",
        "note": "Un étudiant hors UE ressortissant d'un pays en développement (liste du décret ministériel du 11 juin 2019 n°464) en situation de précarité économique paie une contribution forfaitaire de 200 €, plus la taxe régionale du droit aux études et le timbre — soit environ 360 €/an, à régler en une seule fois à la première échéance. Les autres étudiants demandent une réduction sur ISEE parificato ; dépôt après le 30 septembre 2026 : pénalité de 50 € et tranche maximale.",
        "licence": {
          "montant": 360,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 360,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "admission": undefined
    },
    "champs": {
      "province": "Pouilles",
      "exoneration": {
        "politique": "systematique",
        "detail": "Si votre famille réside et a ses revenus uniquement à l'étranger, la contribution est fixe selon le groupe du pays, d'office : 0 € pour les pays particulièrement pauvres de la liste ministérielle, dont le Sénégal, le Mali, le Niger, la Guinée, le Bénin, le Burkina Faso et le Togo. Restent la taxe régionale et le timbre. Les demandeurs d'asile et réfugiés sont aussi dispensés des frais d'évaluation du diplôme.",
        "source": "https://www.uniba.it/it/ateneo/statuto-regolamenti/regolamenti-generali/regolamento-contribuzione-studentesca-2026-2027",
        "verifieLe": "2026-09-25"
      },
      "fraisScolarite": {
        "source": "https://www.uniba.it/it/ateneo/statuto-regolamenti/regolamenti-generali/regolamento-contribuzione-studentesca-2026-2027",
        "verifieLe": "2026-09-25",
        "note": "Règlement des contributions 2026-2027, article 12.3 et annexe A : un étudiant dont la famille réside et a ses revenus uniquement à l'étranger paie une contribution fixe selon le groupe du pays. Groupe A, pays particulièrement pauvres dont le Sénégal : 0 € ; groupe B, dont le Cameroun, la Côte d'Ivoire et l'Égypte : 500 € ; groupe C : 1 000 € ; groupe D : 2 600 €. S'ajoutent le timbre de 16 € et la taxe régionale, 195 € sans ISEE. Montant retenu : 211 € par an pour un étudiant sénégalais (0 + 195 + 16) ; 711 € pour un pays du groupe B.",
        "licence": {
          "montant": 211,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 211,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "admission": {
        "procedure": "Pré-évaluation obligatoire du diplôme étranger sur le portail Apply online de l'université (DreamApply), avec passeport, diplôme, relevé, traduction certifiée en italien ou en anglais, et preuves de la valeur et de l'authenticité du diplôme. Après un avis favorable, pré-inscription sur Universitaly pour le visa, avec les mêmes documents. L'université rappelle qu'une admission ne garantit ni le visa ni un rendez-vous au consulat.",
        "conditions": "Diplôme obtenu après au moins douze ans de scolarité ; en dessous, seulement avec les mesures compensatoires prévues par les lignes directrices ministérielles. Les programmes à accès limité ont un test d'entrée.",
        "calendrier": "2026-2027 : dossiers sur DreamApply au plus tard le 30 juin 2026 pour les candidats hors UE qui ont besoin d'un visa ; Universitaly au plus tard le 30 septembre 2026 pour les programmes à accès libre, ou à la date limite du test pour les programmes à accès limité. Les candidatures ouvrent en général au printemps pour l'année suivante.",
        "langue": "Programme en italien : italien B2 pour tous les étudiants hors UE résidant à l'étranger, par un certificat reconnu ou un test de l'université.",
        "fraisDossier": "30 € non remboursables pour l'évaluation du diplôme sur DreamApply, pour un seul programme.",
        "sources": [
          "https://www.uniba.it/en/students/international-students/admission/admission-of-international-students",
          "https://www.uniba.it/en/students/international-students/faq",
          "https://www.uniba.it/it/ateneo/statuto-regolamenti/regolamenti-generali/regolamento-contribuzione-studentesca-2026-2027",
          "https://apply.uniba.it/"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "universita-di-bologna-bologne",
    "motif": "bloc admission (candidature par programme sur Studenti Online, Universitaly, italien), province, rang ex æquo ; frais relus (forfait pays pauvres, liste 2026 incluant le Sénégal), inchangés, le 2026-09-25",
    "attendu": {
      "province": undefined,
      "ranking": "#123 mondial (QS 2027)",
      "fraisScolarite": {
        "source": "https://www.unibo.it/en/study/enrolment-fees-and-other-procedures/degree-programmes/tuition-fees-and-exemptions/reduced-fixed-fee-for-citizens-of-particularly-poor-and-developing-countries-or-non-eu-non-oecd-countries",
        "verifieLe": "2026-09-13",
        "note": "Forfait réduit 2026-27 pour les ressortissants des pays pauvres ou en développement figurant sur les listes officielles : 500 € + 157,04 € de taxe régionale en première année de licence (600 € les années suivantes) ; 600 € + 157,04 € en première année de master (700 € ensuite). Trois conditions : nationalité sur la liste, inscription dans la durée normale du cursus, revenus et biens de la famille hors d'Italie uniquement. Demande à déposer sur le portail ER.GO, sans justificatif économique. Montants retenus : première année.",
        "licence": {
          "montant": 657,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 757,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "admission": undefined
    },
    "champs": {
      "province": "Émilie-Romagne",
      "ranking": "#123 mondial ex æquo (QS 2027)",
      "fraisScolarite": {
        "source": "https://www.unibo.it/en/study/enrolment-fees-and-other-procedures/degree-programmes/tuition-fees-and-exemptions/reduced-fixed-fee-for-citizens-of-particularly-poor-and-developing-countries-or-non-eu-non-oecd-countries",
        "verifieLe": "2026-09-25",
        "note": "Forfait réduit 2026-27 pour les ressortissants des pays pauvres ou en développement figurant sur les listes officielles : 500 € + 157,04 € de taxe régionale en première année de licence (600 € les années suivantes) ; 600 € + 157,04 € en première année de master (700 € ensuite). Trois conditions : nationalité sur la liste, inscription dans la durée normale du cursus, revenus et biens de la famille hors d'Italie uniquement. Demande à déposer sur le portail ER.GO, sans justificatif économique. Montants retenus : première année.",
        "licence": {
          "montant": 657,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 757,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "admission": {
        "procedure": "Candidature programme par programme sur Studenti Online, l'application de l'université, avec paiement des frais ; le classement du programme décide de l'admission. Ensuite, pré-inscription sur Universitaly pour le visa, preuve de langue dans les délais du programme, puis dépôt des diplômes en ligne. Pour le visa, il faut aussi justifier de ressources, 10 179,85 € au moins en 2026.",
        "conditions": "Diplôme obtenu après au moins douze ans de scolarité et ouvrant l'accès à un cursus comparable dans le pays d'origine ; avec moins, certificat des examens réussis de la première année d'université. Diplôme original traduit, avec une preuve d'authenticité. Exemple, International Studies à Forlì : TOLC-E avec anglais B2, ou SAT.",
        "calendrier": "Dates fixées par chaque programme. Exemple 2026-2027, International Studies : première sélection du 3 février au 29 avril 2026, sélection sur SAT du 30 avril au 3 juillet, session extraordinaire du 4 août au 11 septembre. Le calendrier 2027-2028 n'est pas encore publié.",
        "langue": "Programme en italien : italien B2, par un certificat reconnu ou par le test de l'université (18 €, 48 points au moins en 2026-2027). Programme en anglais : anglais B2 selon l'appel du programme.",
        "fraisDossier": "Fixés par chaque programme, par exemple 20 € pour International Studies.",
        "sources": [
          "https://www.unibo.it/en/study/enrolment-fees-and-other-procedures/degree-programmes/enrolling-in-first-cycle-and-single-cycle-degree-programmes/enrolling-in-a-first-cycle-or-single-cycle-degree-programme-if-you-come-from-a-non-eu-country",
          "https://www.unibo.it/en/study/enrolment-fees-and-other-procedures/degree-programmes/enrolling-in-first-or-single-cycle-degree-programme-foreign-qualification",
          "https://www.unibo.it/en/study/enrolment-fees-and-other-procedures/language-requirement-for-programme-enrolment/italian-language-test-and-certificate-for-enrolment-in-a-degree-programme",
          "https://corsi.unibo.it/1cycle/InternationalStudies/how-to-enrol"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "universita-di-genova-genes",
    "motif": "bloc admission (UniGeApply, Universitaly, étapes 2026-2027), province, rang ex æquo, et note de frais réécrite (capitales, accents, tiret long ; barème à ISEE-U bas corrigé : 0 à 450 € selon le groupe), montants relus, le 2026-09-25",
    "attendu": {
      "province": undefined,
      "ranking": "#502 mondial (QS 2027)",
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
      "admission": undefined
    },
    "champs": {
      "province": "Ligurie",
      "ranking": "#502 mondial ex æquo (QS 2027)",
      "fraisScolarite": {
        "source": "https://unige.it/tasse-e-benefici/rate-calcolo",
        "verifieLe": "2026-09-25",
        "note": "Année 2026-2027 : le montant dépend de l'ISEE-U. Sans ISEE-U, cas d'un étudiant hors UE qui ne fait pas la démarche, la contribution est de 3 025 € dans les domaines humaniste et social et de 3 300 € en médecine, santé, sciences et techniques, plus le timbre de 16 € et la taxe régionale d'au moins 120 €. Pas de forfait par pays : il faut faire établir gratuitement un ISEE-U parificato dans un centre d'assistance fiscale (CAF) conventionné, avant le 31 octobre 2026, avec les revenus étrangers traduits par les autorités diplomatiques italiennes (pénalité de 100 € en novembre, 200 € ensuite). Avec un ISEE-U jusqu'à 13 000 €, la contribution va de 0 à 450 € selon le groupe du programme. Montant retenu : 3 025 €, le tarif sans ISEE-U.",
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
      "admission": {
        "procedure": "Pré-évaluation obligatoire sur UniGeApply pour tout diplôme étranger, deux programmes au plus. Si l'avis est favorable, demande de visa sur Universitaly, que l'université valide et transmet à l'ambassade ; puis pré-inscription sur les services en ligne de l'université. L'inscription se termine après l'arrivée en Italie, avec la demande de permis de séjour dans les huit jours.",
        "conditions": "Licence en anglais : diplôme de fin d'études secondaires, au moins douze ans de scolarité, obtenu au plus tard le 15 août ; test CEnT, TOLC, SAT ou ACT, sans score minimum fixé ; lettre de motivation et lettre de recommandation. Pièces à l'inscription : légalisation ou attestation CIMEA de vérification, et déclaration de valeur, attestation CIMEA de comparabilité ou Diploma Supplement.",
        "calendrier": "La présélection des candidats avec visa pour 2026-2027 a eu lieu du 26 novembre 2025 au 20 mars 2026, avec réponse au plus tard le 22 mai. Pour 2027-2028, ouverture prévue en novembre 2026. Universitaly a ouvert le 4 mai 2026.",
        "langue": "Programme en italien : test d'italien obligatoire, niveau B2 au moins pour finaliser l'inscription. Programme en anglais : anglais B2 ou attestation d'études suivies en anglais, sans italien exigé.",
        "fraisDossier": "30 € pour une ou deux demandes sur UniGeApply. Les frais de scolarité se paient seulement après l'arrivée en Italie.",
        "sources": [
          "https://unige.it/en/iscrizione-studenti-non-eu-residenti-estero-con-titolo-studio-non-italiano",
          "https://unige.it/en/internazionale/iscrizioni-internazionali/unigeapply",
          "https://unige.it/en/non-eu-students-residence-abroad-foreign-diploma/imperia",
          "https://unige.it/tasse-e-benefici/rate-calcolo"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "universita-di-padova-padoue",
    "motif": "bloc admission (appels 2027-2028 ouverts depuis le 15 septembre 2026, pièces, anglais, italien), province, langue d'enseignement ; note de frais réécrite sans numéro de décret contradictoire et exonération précisée (ISEE et non revenu familial), montants relus et inchangés, le 2026-09-25",
    "attendu": {
      "province": undefined,
      "langueEnseignement": undefined,
      "exoneration": {
        "politique": "systematique",
        "detail": "Si vous êtes ressortissant d'un pays à faible indice de développement humain figurant sur la liste du décret ministériel italien, le tarif « pays en développement » s'applique d'office. Par ailleurs, Padoue ne demande aucune contribution si le revenu familial annuel ne dépasse pas 30 000 €.",
        "source": "https://www.unipd.it/en/tuition-fees",
        "verifieLe": "2026-09-13"
      },
      "fraisScolarite": {
        "source": "https://www.unipd.it/en/tuition-fees",
        "verifieLe": "2026-09-13",
        "note": "2026-27, étudiant hors UE résidant à l'étranger : forfait par groupe de filières, avec un tarif « pays en développement » (décret ministériel n°176 de février 2026, indice de développement humain). Groupe A (humanités) : 930 €/an au lieu de 2 790 €. Groupe B (sciences, enseignement primaire) : 996,66 € au lieu de 2 990 €. Plus 192 € de taxe régionale et 16 € de timbre à la première échéance. Montants retenus : tarif pays en développement, groupe A pour la licence, groupe B pour le master (le plus élevé des deux).",
        "licence": {
          "montant": 1138,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 1205,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "admission": undefined
    },
    "champs": {
      "province": "Vénétie",
      "langueEnseignement": "Italien ou anglais selon le programme",
      "exoneration": {
        "politique": "systematique",
        "detail": "Si vous êtes ressortissant d'un pays à faible indice de développement humain de la liste ministérielle, dont le Sénégal, le tarif réduit s'applique d'office. Par ailleurs, avec un ISEE (indicateur de revenus italien) jusqu'à 30 000 €, aucune contribution n'est due.",
        "source": "https://www.unipd.it/en/tuition-fees",
        "verifieLe": "2026-09-25"
      },
      "fraisScolarite": {
        "source": "https://www.unipd.it/en/tuition-fees",
        "verifieLe": "2026-09-25",
        "note": "2026-2027, étudiant hors UE dont la famille réside à l'étranger : forfait par groupe de filières, avec un tarif réduit pour les pays à faible indice de développement humain de la liste ministérielle. Groupe A (humanités) : 930 € par an au lieu de 2 790 € ; groupe B (sciences, enseignement primaire) : 996,66 € au lieu de 2 990 €. Plus 208 € à la première échéance (taxe régionale de 192 € et timbre de 16 €). Montants retenus : tarif réduit, groupe A en licence, groupe B en master.",
        "licence": {
          "montant": 1138,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 1205,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "admission": {
        "procedure": "Candidature en ligne sur apply.unipd.it, deux programmes au plus ; aucune pièce légalisée n'est demandée à ce stade, mais une traduction en anglais ou en italien des diplômes et relevés. Une fois admis, acompte de 208 € sur le portail et pré-inscription sur Universitaly au plus tard le 15 juillet, puis légalisation ou apostille du diplôme, ou attestation de vérification CIMEA.",
        "conditions": "Licence : au moins douze ans de scolarité ; avec moins, une ou deux années d'université réussies. La liste des diplômes acceptés par pays pour 2027-2028 cite par exemple la France, le Maroc et le Cameroun, pas le Sénégal : faites vérifier votre baccalauréat par le bureau des admissions avant de candidater. Certaines licences en anglais demandent le test CEnT-S.",
        "calendrier": "Rentrée 2027, programmes à places illimitées : premier appel du 15 septembre au 15 novembre 2026, deuxième de décembre 2026 au 1er mars 2027. Programmes à places limitées, candidats hors UE résidant hors d'Italie : du 7 janvier au 7 mars 2027.",
        "langue": "Programme en anglais : B2, par exemple IELTS 6 ou TOEFL iBT 86 (tests passés jusqu'au 20 janvier 2026). Programme en italien : italien B2, C1 en linguistique, certificat à fournir au plus tard le 31 juillet 2027.",
        "fraisDossier": "60 € non remboursables ; pour un programme avec test CEnT-S, 55 € d'inscription au test à la place.",
        "sources": [
          "https://www.unipd.it/en/study-english-how-apply",
          "https://www.unipd.it/en/ammissione-studenti-internazionali",
          "https://www.unipd.it/en/language-requirement-admission-degree-programmes",
          "https://www.unipd.it/en/studiare-inglese-immatricolarsi",
          "https://wwwassets.unipd.it/sites/default/files/2026-09/Entry%20requirements%20per%20Country%2027-28%20.pdf"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "universita-di-trento-trente",
    "motif": "bloc admission (appel de décembre à mars, visa avec anglais B2 et CIMEA depuis 2026-2027, pièces), province, rang ex æquo ; frais relus sur la grille des licences en anglais, inchangés, le 2026-09-25",
    "attendu": {
      "province": undefined,
      "ranking": "#438 mondial (QS 2027)",
      "langueEnseignement": undefined,
      "admission": undefined
    },
    "champs": {
      "province": "Trentin-Haut-Adige",
      "ranking": "#438 mondial ex æquo (QS 2027)",
      "langueEnseignement": "Italien ou anglais selon le programme",
      "admission": {
        "procedure": "Candidature à l'appel du programme, de décembre à mars, avec les pièces demandées. Si vous êtes retenu, à partir de mai, pré-inscription sur Universitaly et demande de visa. Arrivée fin août ou en septembre ; l'inscription se termine à Trente. En économie et gestion, des cours intensifs obligatoires commencent la dernière semaine d'août.",
        "conditions": "Licence : diplôme obtenu après au moins douze ans de scolarité, équivalent au diplôme italien et donnant accès à l'université dans le pays ; relevé des deux dernières années ; traduction en anglais ou en italien, sauf pour un document en anglais, espagnol, français ou allemand. Avec moins de douze ans : année d'université réussie, foundation year ou études post-secondaires. Test d'entrée si le programme en a un ; en licence enseignée en anglais, les frais de première année dépendent du score d'admission.",
        "calendrier": "Appel 2026-2027 clos ; le prochain appel est attendu vers décembre 2026, pour la rentrée 2027-2028. Cours à partir de mi ou fin septembre.",
        "langue": "Depuis 2026-2027, le visa exige un certificat international d'anglais B2 dans les quatre compétences, ainsi que les attestations CIMEA de comparabilité et de vérification, ou une déclaration de valeur de l'ambassade d'Italie.",
        "fraisDossier": "Fixés par l'appel de chaque programme.",
        "sources": [
          "https://www.unitn.it/en/international/coming-unitrento/degree-seeking-student/admission-requirements-international-qualifications",
          "https://www.unitn.it/en/international/coming-unitrento/admission-how-it-works/admission-process",
          "https://www.unitn.it/en/admission-courses-taught-italian",
          "https://www.unitn.it/en/study/fees-scholarships-accommodation/tuition-fees/non-eu-citizens/degree-programmes-english"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "universita-di-trieste-trieste",
    "motif": "bloc admission (ApplyNow, places visa, Universitaly, italien), province, et note de frais réécrite sans capitales, montants relus sur l'avis de frais 2026-2027, inchangés, le 2026-09-25",
    "attendu": {
      "province": undefined,
      "fraisScolarite": {
        "source": "https://repo.units.it/docs/units_CdL_tasse-avvisoTasse_en.2026-2027.pdf",
        "verifieLe": "2026-09-13",
        "note": "Avis de frais 2026-27, article 4 : un étudiant ressortissant d'un pays en développement (liste du décret ministériel) qui remplit les conditions de l'article 1(3) — inscription dans la durée normale du cursus — est EXONÉRÉ des frais de scolarité ; il ne paie que le timbre (16 €) et la taxe régionale (160 €), soit 176 €/an. S'il ne les remplit pas : 200 € de scolarité en plus (376 €). Un étudiant résidant à l'étranger sans être d'un pays en développement paie 976 €/an. Licence et master.",
        "licence": {
          "montant": 176,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 176,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "admission": undefined
    },
    "champs": {
      "province": "Frioul-Vénétie Julienne",
      "fraisScolarite": {
        "source": "https://repo.units.it/docs/units_CdL_tasse-avvisoTasse_en.2026-2027.pdf",
        "verifieLe": "2026-09-25",
        "note": "Avis de frais 2026-2027, article 4 : un étudiant ressortissant d'un pays en développement de la liste ministérielle, inscrit dans la durée normale du cursus, est exonéré des frais de scolarité ; il ne paie que le timbre (16 €) et la taxe régionale (160 €), soit 176 € par an. Sinon, 200 € de scolarité en plus (376 €). Un étudiant résidant à l'étranger sans être d'un pays en développement paie 800 € de scolarité, soit 976 € par an. Licence et master.",
        "licence": {
          "montant": 176,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 176,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "admission": {
        "procedure": "Vérifiez d'abord que le programme a des places pour les candidats avec visa ; sans place, pas d'inscription. Candidature sur ApplyNow (apply.units.it) avec les pièces demandées. Après un avis favorable, pré-inscription sur Universitaly, où l'université répond. Il n'y a pas de lettre d'acceptation : le document officiel est le récapitulatif Universitaly. À l'arrivée, demande de permis de séjour et dépôt du récépissé sur le portail.",
        "conditions": "Diplôme obtenu après au moins douze ans de scolarité, donnant accès à un cursus comparable dans le pays. Documents légalisés ou apostillés (sauf ceux de quelques pays européens, dont la France), traduits en italien ou en anglais ; aucune déclaration de valeur n'est demandée. L'université donne la priorité à quelques pays cibles, dont le Kenya, le Rwanda et l'Éthiopie ; le Sénégal n'en fait pas partie.",
        "calendrier": "2026-2027 : évaluation des diplômes en deux sessions, du 15 décembre 2025 au 15 janvier 2026, puis du 15 février au 30 avril 2026. Le calendrier 2027-2028 n'est pas encore publié.",
        "langue": "Programme en italien ou bilingue : certificat d'italien B2 (CELI, CILS, PLIDA) ou test CISIA d'italien réussi à 50 sur 72. Programme en anglais : niveau fixé par le programme.",
        "fraisDossier": "40 € pour jusqu'à trois programmes, à payer dans les sept jours suivant l'émission de la facture, sinon la candidature n'est pas examinée.",
        "sources": [
          "https://portale.units.it/en/international/destination-units/degree-seekers/pre-enrollment-visa-applicants",
          "https://portale.units.it/en/international/destination-units/degree-seekers/documents",
          "https://portale.units.it/en/international/destination-units/degree-seekers/verification-language-proficiency",
          "https://apply.units.it/news/new/26-2026-2027-intake"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  }
];

// Aucune université nouvelle, aucune bourse, aucun lien de programme.
export const UNIVERSITIES = [];
export const SCHOLARSHIPS = [];
export const LINKS = [];
