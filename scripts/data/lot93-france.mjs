// ============================================================
// FitzUniverse — Lot 93 : FRANCE, bloc admission des 26 fiches
// Recherche du 2026-09-25, sources officielles uniquement : sites des
// établissements, Campus France Sénégal, ministère de l'Enseignement
// supérieur (FAQ du décret n° 2026-385 et tableau des droits 2026-2027),
// topuniversities.com pour le seul classement mondial.
//
// POURQUOI
// Charles, le 2026-09-25 : « vas y avec la france ». Même exigence que
// l'Italie et la Chine : bloc admission complet sur les 26 fiches
// existantes, aucune université nouvelle. 26 PATCHES.
//
// MÉTHODE
// Quatre recherches parallèles (WebFetch) ont produit un brouillon ;
// ce qui entre ici a été RELU dans le Chrome de Charles le 2026-09-25
// (pages, onglets dynamiques d'ESSEC, PDF avec pdf.js). Ce que la
// relecture n'a pas confirmé a été retiré ou dit plus prudemment
// (niveaux de français de Grenoble, Paris Cité, Saclay, Lorraine, Côte
// d'Azur ; bachelor de Polytechnique ; dates de master de Sciences Po).
//
// LA DÉCOUVERTE QUI CHANGE DES PRIX
// Le décret n° 2026-385 du 19 mai 2026 (FAQ du ministère) supprime les
// exonérations « fondées sur des motifs généraux ou catégoriels » : les
// politiques des conseils d'administration ne valent que pour les
// exonérations accordées ou annoncées avant le 21 mai 2026. Pour une
// première inscription en 2027-2028, celle que visent nos étudiants,
// seules restent les exonérations individuelles, sur demande, plafonnées
// à 25 % des inscrits hors UE (30 % en 2026-2027, 20 % dès 2028).
// Conséquence, même règle que la fiche de Grenoble (« budgéter le tarif
// plein, l'exonération est un gain possible ») :
//   - Paris Cité, Paris-Saclay, Toulouse : 178 / 255 € → 2 902 / 3 950 €,
//     politique « systematique » → « possible_plafonnee » ;
//   - Rennes : 650 / 950 € → 2 902 / 3 950 € ;
//   - ENS-PSL : master 255 € → 3 950 € ;
//   - Paris 1 (pays les moins avancés), Lille (master d'office),
//     Lorraine (master 1 francophone), Strasbourg (licence 1 Études en
//     France) : montants déjà au tarif plein, notes et exonérations
//     complétées. Lorraine : la note disait à tort que tout étudiant
//     retombe aux droits européens dès la 2e année (seulement le cas du
//     master 1 francophone).
// Chaque note dit ce qui valait en 2026-2027, pour ne rien cacher.
//
// AUTRES MONTANTS CORRIGÉS
//   - Polytechnique : master of Science and Technology 15 500 € (15 400).
//   - HEC : master 29 485 € par an, entrée 2027 (29 450) ; licence
//     23 000 €, la première année du bachelor avec Bocconi (26 500 était
//     le tarif des années à HEC).
//
// FAITS UTILES AJOUTÉS
//   - Groupe INSA, première année avec un bac étranger : DALF C1 exigé,
//     105 € de droits de candidature.
//   - Nantes et Lyon 1 dispensent le Sénégal du test de français.
//   - Campus France Sénégal : dossier Études en France du 1er octobre au
//     15 décembre 2026 pour la rentrée 2027, 85 000 F CFA, bac avec au
//     plus une reprise, B2 exigé des bacs L-AR.
//
// Classement : QS 2027 relu sur topuniversities (filtre France,
// 38 lignes) : onze rangs passent en « ex æquo ».
//
// `attendu` porte l'état lu dans l'export du 2026-09-25T11:48:31.611Z : les champs
// ajoutés sont ABSENTS (undefined), les champs remplacés sont recopiés
// entiers. Si quelqu'un est passé avant, le lot bloque au lieu
// d'écraser. Aucune photo dans ce lot.
// ============================================================

export const PATCHES = [
  {
    "collection": "universities",
    "id": "aix-marseille-universite-marseille",
    "motif": "bloc admission (voie Études en France ou procédure propre, calendrier, conditions, langue, frais de dossier), province, rang ex æquo, le 2026-09-25",
    "attendu": {
      "province": undefined,
      "ranking": "#443 mondial (QS 2027)",
      "admission": undefined
    },
    "champs": {
      "province": "Provence-Alpes-Côte d'Azur",
      "ranking": "#443 mondial ex æquo (QS 2027)",
      "admission": {
        "procedure": "Vous résidez au Sénégal : vous candidatez sur la plateforme Études en France de Campus France. Première année de licence : demande d'admission préalable sur Études en France. Licence 2, licence 3 et master : dossier Études en France aussi. Les étudiants hors Union européenne ne sont pas admis dans les licences d'accès santé.",
        "calendrier": "Rentrée 2027 au Sénégal : dossier Études en France du 1er octobre au 15 décembre 2026, frais payés au plus tard le 19 décembre 2026, choix de la formation confirmé au plus tard le 31 mai 2027, selon Campus France Sénégal. À la faculté des sciences, les commissions répondent au plus tard le 30 avril et l'étudiant confirme son choix au plus tard le 31 mai.",
        "conditions": "Première année de licence : diplôme de fin d'études secondaires hors Union européenne. Autres années : le diplôme du niveau précédent. Au Sénégal, un bac obtenu avec au plus une reprise ouvre le dossier Études en France ; avec un bac série arabe L-AR, il faut un niveau B2 certifié en français.",
        "langue": "Le niveau dépend de la faculté. À la faculté d'économie et de gestion : TCF ou TEF niveau 4 au moins, DELF B2 ou DALF C.",
        "fraisDossier": "Aucun frais propre à l'université. Le dossier Études en France coûte 85 000 francs CFA au Sénégal, non remboursables, payés à Campus France.",
        "sources": [
          "https://sciences.univ-amu.fr/en/candidatures-inscriptions/candidater/campus-france",
          "https://feg.univ-amu.fr/en/application-registration/foreign-student-foreign-diploma",
          "https://www.univ-amu.fr/en/international-students/international-students-degree-programs/differential-tuition-fees-for-european-union-students",
          "https://www.senegal.campusfrance.org/calendrier-de-la-procedure",
          "https://www.senegal.campusfrance.org/les-questions-frequemment-posees"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "ecole-normale-superieure-de-lyon-lyon",
    "motif": "bloc admission (voie Études en France ou procédure propre, calendrier, conditions, langue, frais de dossier), province, rang ex æquo, le 2026-09-25",
    "attendu": {
      "ranking": "#235 mondial (QS 2027)",
      "province": undefined,
      "admission": undefined
    },
    "champs": {
      "ranking": "#235 mondial ex æquo (QS 2027)",
      "province": "Auvergne-Rhône-Alpes",
      "admission": {
        "procedure": "Master : candidature en ligne directement sur le site de l'ENS de Lyon, avec un formulaire pour les candidats hors Union européenne titulaires d'un diplôme étranger ; il sert aussi à demander la bourse d'excellence. Pièces : pièce d'identité, lettre de motivation, CV, diplômes et relevés de notes. Pour le visa, un résident du Sénégal dépose ensuite un dossier Études en France.",
        "calendrier": "Rentrée 2026 : candidatures du 14 novembre 2025 au 23 janvier 2026, résultats la semaine du 9 mars 2026. L'école annonce le calendrier 2027-2028 pour novembre 2026.",
        "conditions": "Entrée en master 1 avec une licence ou l'équivalent, en master 2 avec un master 1. Certaines formations ne recrutent pas à l'international.",
        "langue": "Un justificatif de niveau en français ou en anglais est demandé, avec des seuils par discipline. Dispense si vous avez étudié dans un pays francophone ou entièrement en français : joignez alors une explication.",
        "fraisDossier": "Aucun frais de candidature n'est indiqué par l'école. Le dossier Études en France du visa coûte 85 000 francs CFA au Sénégal, non remboursables.",
        "sources": [
          "https://www.ens-lyon.fr/formation/admission/procedures-dadmission/candidature-pour-un-master-et-une-bourse-dexcellence",
          "https://www.ens-lyon.fr/formation/admission/candidats-quels-sont-les-niveaux-de-langue-requis",
          "https://www.ens-lyon.fr/formation/inscription-scolarite/inscription-et-reinscription-lens-de-lyon/droits-dinscription",
          "https://www.senegal.campusfrance.org/les-questions-frequemment-posees"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "ecole-normale-superieure-psl-paris",
    "motif": "bloc admission (voie Études en France ou procédure propre, calendrier, conditions, langue, frais de dossier), province, note de frais réécrite, montants ajoutés ou corrigés : master, exonération réécrite (décret du 19 mai 2026), le 2026-09-25",
    "attendu": {
      "province": undefined,
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
        "detail": "En 2026-2027, en master, les étudiants hors UE ont une exonération partielle sur simple présentation d'un passeport valide. Exonération totale : boursiers du CROUS, pupilles de la Nation ou de la République, normaliens préparant l'agrégation, inscrits via un accord international de l'école. Réfugiés, protection subsidiaire, demandeurs d'emploi, AAH ou grande difficulté financière : totale ou partielle, sur examen.",
        "source": "https://www.ens.psl.eu/sites/default/files/deliberation_ndeg2026-06_portant_approbation_des_criteres_et_de_la_procedure_dexoneration_des_droits_dinscription_pour_lannee_2026-2027.pdf",
        "verifieLe": "2026-09-13"
      },
      "admission": undefined
    },
    "champs": {
      "province": "Île-de-France",
      "fraisScolarite": {
        "source": "https://www.ens.psl.eu/sites/default/files/deliberation_ndeg2026-06_portant_approbation_des_criteres_et_de_la_procedure_dexoneration_des_droits_dinscription_pour_lannee_2026-2027.pdf",
        "verifieLe": "2026-09-25",
        "note": "Pas de licence à l'ENS. Master : droits différenciés de 3 950 € par an pour un étudiant hors Union européenne. En 2026-2027, l'école les ramenait à 255 € sur simple passeport, mais le décret du 19 mai 2026 ne permet plus ce type d'exonération générale pour les nouveaux inscrits : prévoyez 3 950 €. Doctorat : 398 €. Les lauréats de la Sélection internationale reçoivent 1 000 € par mois pendant trois ans.",
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
        "detail": "En 2026-2027, les étudiants hors Union européenne inscrits en master payaient le tarif européen sur simple passeport. Pour une première inscription en 2027-2028, le décret du 19 mai 2026 ne laisse que des exonérations individuelles, sur demande et selon la situation, dans la limite de 25 % des inscrits hors Union européenne. Les boursiers du gouvernement français restent exonérés.",
        "source": "https://www.enseignementsup-recherche.gouv.fr/fr/faq-droits-d-inscription-differencies-pour-les-etudiants-extra-communautaires-103043",
        "verifieLe": "2026-09-25"
      },
      "admission": {
        "procedure": "La voie des étudiants étrangers est un concours, la Sélection internationale, en lettres ou en sciences : dossier en ligne, épreuves pour les candidats admissibles, puis résultats. Les lauréats suivent le diplôme de l'ENS avec un master, logés et rémunérés. Un résident du Sénégal dépose ensuite un dossier Études en France pour le visa.",
        "calendrier": "Sélection internationale 2027 : candidatures du 16 octobre au 15 décembre 2026 à 14 h, heure de Paris. Lettres : admissibilité à partir du 21 janvier 2027, épreuves du 15 au 26 février, admission à partir du 9 mars 2027. Sciences : épreuves du 3 au 19 mars, admission à partir du 26 mars 2027.",
        "conditions": "Candidater avant son 26e anniversaire, une seule fois, avec au moins une année d'université validée à l'étranger, et sans avoir vécu plus de dix mois en France l'année de candidature et l'année précédente. Entrée en licence 3 ou en master 1.",
        "langue": "Lettres : lire et écrire assez bien le français pour suivre cours et épreuves, niveau B1, sans diplôme officiel exigé. Sciences : aucun niveau officiel n'est demandé.",
        "fraisDossier": "Aucun frais de candidature n'est indiqué pour la Sélection internationale. Le dossier Études en France du visa coûte 85 000 francs CFA au Sénégal, non remboursables.",
        "sources": [
          "https://www.ens.psl.eu/une-formation-d-exception/admission-concours/concours-selection-internationale-0",
          "https://www.ens.psl.eu/en/une-formation-d-exception/admissions/international/international-selection",
          "https://www.ens.psl.eu/en/une-formation-d-exception/admissions/international/international-selection/faq-about-international",
          "https://www.senegal.campusfrance.org/les-questions-frequemment-posees"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "ecole-polytechnique-palaiseau",
    "motif": "bloc admission (voie Études en France ou procédure propre, calendrier, conditions, langue, frais de dossier), province, rang ex æquo, note de frais réécrite, montants ajoutés ou corrigés : master, le 2026-09-25",
    "attendu": {
      "province": undefined,
      "ranking": "#43 mondial via IP Paris (QS 2027)",
      "fraisScolarite": {
        "source": "https://programmes.polytechnique.edu/en/master/admissions-msct/tuition-fees",
        "verifieLe": "2026-09-07",
        "note": "Master of Science and Technology, tarif plein 2026-2027 (12 350 €/an pour les diplômés IP Paris ou du Bachelor ; certains programmes plus chers). Bachelor non daté sur la page, non repris.",
        "master": {
          "montant": 15400,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "admission": undefined
    },
    "champs": {
      "province": "Île-de-France",
      "ranking": "#43 mondial via IP Paris ex æquo (QS 2027)",
      "fraisScolarite": {
        "source": "https://programmes.polytechnique.edu/en/master/admissions-msct/tuition-fees",
        "verifieLe": "2026-09-25",
        "note": "Master of Science and Technology : 15 500 € par an pour la plupart des spécialités, 12 500 € pour les diplômés d'IP Paris ou du Bachelor de l'école ; certaines spécialités coûtent plus, jusqu'à 19 200 €. Frais de candidature 95 €. Montant retenu : le tarif courant.",
        "master": {
          "montant": 15500,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "admission": {
        "procedure": "Cycle ingénieur : concours international de la Filière universitaire internationale (FUI), avec étude du dossier puis oraux par visioconférence dans un centre d'examen officiel. Master of Science and Technology : candidature en ligne sur le portail de l'école, en quatre vagues, puis entretien si le jury retient le dossier. Un résident du Sénégal dépose ensuite un dossier Études en France pour le visa.",
        "calendrier": "Concours FUI 2027 : inscriptions de mi-mai à mi-septembre 2026, admissibilité vers le 10 octobre, oraux du 2 au 15 novembre, admission vers le 26 novembre 2026, entrée en 2027. Master, rentrée 2027 : clôtures le 12 octobre 2026, le 11 janvier, le 8 mars et le 13 avril 2027.",
        "conditions": "FUI : moins de 25 ans au 1er janvier 2027, pas de nationalité française, au moins deux années d'études supérieures en sciences ou en ingénierie, excellent niveau en mathématiques. Master : un diplôme de niveau licence.",
        "langue": "FUI : anglais ou français pour passer les épreuves ; on peut candidater sans parler français, et les admis non francophones suivent un programme intensif de français.",
        "fraisDossier": "Master of Science and Technology : 95 €, non remboursables. Le dossier Études en France du visa coûte 85 000 francs CFA au Sénégal.",
        "sources": [
          "https://www.polytechnique.edu/admission-cycle-ingenieur/sites/admission/files/content/NOTICE_Concours%20international_FUI%202027_VF%20_Finale.pdf",
          "https://www.polytechnique.edu/admission-cycle-ingenieur/en/fui",
          "https://programmes.polytechnique.edu/en/master/admissions-msct/application-deadlines-procedure",
          "https://programmes.polytechnique.edu/en/master/admissions-msct/tuition-fees"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "essec-business-school-cergy",
    "motif": "bloc admission (voie Études en France ou procédure propre, calendrier, conditions, langue, frais de dossier), province, note de frais réécrite, montants relus et inchangés, le 2026-09-25",
    "attendu": {
      "province": undefined,
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
      "admission": undefined
    },
    "champs": {
      "province": "Île-de-France",
      "fraisScolarite": {
        "source": "https://www.essec.edu/en/program/master-in-management-admission-with-degree/?tab=financing",
        "verifieLe": "2026-09-25",
        "note": "Master in Management, rentrée 2026, parcours de deux à trois ans : 25 300 € de scolarité par an pour un étudiant hors Union européenne, plus 2 000 € d'inscription par an, soit 27 300 € par an, et 2 640 € de frais de service une seule fois. Parcours intensif d'un an : 38 000 € plus 2 000 €. Frais de candidature 180 €.",
        "master": {
          "montant": 27300,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "admission": {
        "procedure": "Master in Management avec un diplôme étranger : candidature en ligne sur le site de l'école, en plusieurs vagues. Il faut un score à un test de management et à un test d'anglais. Les candidats retenus passent un entretien en ligne, puis reçoivent la décision et versent un acompte pour garder leur place. Pour le visa, un dossier Études en France.",
        "calendrier": "Rentrée 2027 : clôtures le 7 octobre 2026, le 26 novembre 2026 et le 17 février 2027 à midi, heure de Paris ; la quatrième vague n'est pas encore datée.",
        "conditions": "Une licence ou un diplôme de niveau équivalent, au moins trois ans d'études supérieures, dans n'importe quel domaine. Test de management : GMAT, GRE, TAGE MAGE ou CAT.",
        "langue": "Anglais : TOEIC 850, IELTS 6,5, TOEFL iBT 95 ou Cambridge B2 First 175, de moins de deux ans.",
        "fraisDossier": "180 €, non remboursables, payés en ligne. Le dossier Études en France du visa coûte 85 000 francs CFA au Sénégal.",
        "sources": [
          "https://www.essec.edu/en/program/master-in-management-admission-with-degree/?tab=admissions",
          "https://www.essec.edu/en/program/business-school/master-management-grande-ecole/admission/",
          "https://www.essec.edu/en/program/master-in-management-admission-with-degree/?tab=financing"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "hec-paris-jouy-en-josas",
    "motif": "bloc admission (voie Études en France ou procédure propre, calendrier, conditions, langue, frais de dossier), province, note de frais réécrite, montants ajoutés ou corrigés : licence, master, le 2026-09-25",
    "attendu": {
      "province": undefined,
      "fraisScolarite": {
        "source": "https://www.hec.edu/en/master-s-programs/master-management/fees-and-financing",
        "verifieLe": "2026-09-07",
        "note": "Tarifs indicatifs entrée 2026. Bachelor : 23 000 € la 1re année (à Bocconi), 26 500 € les années à HEC. Master in Management : 58 900 € sur deux ans, plus 2 000 € pour les étudiants hors UE.",
        "licence": {
          "montant": 26500,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 29450,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "admission": undefined
    },
    "champs": {
      "province": "Île-de-France",
      "fraisScolarite": {
        "source": "https://www.hec.edu/en/master-s-programs/master-management/fees-and-financing",
        "verifieLe": "2026-09-25",
        "note": "Master in Management, entrée 2027 : 29 485 € par an, soit 26 500 € de scolarité, 1 985 € de services et 1 000 € de frais administratifs, pendant deux ans ; les étudiants internationaux paient 2 500 € de plus. Bachelor avec Bocconi : 23 000 € la première année à Milan, 25 750 € la deuxième, 26 750 € la troisième à HEC. Frais de candidature 180 €.",
        "licence": {
          "montant": 23000,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 29485,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "admission": {
        "procedure": "Master in Management : candidature en ligne sur le site de HEC, en quatre vagues. Dossier : diplôme ou attestation, relevés de notes, CV d'une page, score au test de management, preuve d'anglais, essais et recommandation. Les candidats admissibles passent un entretien en anglais. Pour le visa, un dossier Études en France.",
        "calendrier": "Entrée 2027 : clôtures le 7 octobre 2026, le 26 novembre 2026, le 17 février 2027 et le 28 avril 2027 à midi, heure de Paris. Admissibilité de la première vague au plus tard le 26 octobre 2026.",
        "conditions": "Une licence d'au moins trois ans, dans n'importe quel domaine, et peu ou pas d'expérience professionnelle. Test de management : GMAT ou GRE, ou TAGE MAGE.",
        "langue": "Anglais obligatoire, prouvé par un test reconnu, sauf langue maternelle anglaise ou diplôme suivi entièrement en anglais. Tous les entretiens se font en anglais.",
        "fraisDossier": "180 €, non remboursables. Le dossier Études en France du visa coûte 85 000 francs CFA au Sénégal.",
        "sources": [
          "https://www.hec.edu/en/master-s-programs/master-management/admissions",
          "https://www.hec.edu/en/master-s-programs/master-management/fees-and-financing",
          "https://www.hec.edu/en/bachelor-programs/fees-and-financing"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "insa-lyon-villeurbanne",
    "motif": "bloc admission (voie Études en France ou procédure propre, calendrier, conditions, langue, frais de dossier), province, note de frais réécrite, montants relus et inchangés, le 2026-09-25",
    "attendu": {
      "province": undefined,
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
      "admission": undefined
    },
    "champs": {
      "province": "Auvergne-Rhône-Alpes",
      "fraisScolarite": {
        "source": "https://www.insa-lyon.fr/fr/cout-etudes",
        "verifieLe": "2026-09-25",
        "note": "Année 2026-2027. L'INSA renvoie aux droits différenciés nationaux pour les étudiants hors Union européenne : 2 902 € par an en premier cycle, 3 950 € en cycle ingénieur, qui confère le grade de master. Doctorat : 398 €. Les étudiants européens paient 630 € en cycle ingénieur.",
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
      "admission": {
        "procedure": "Première année : candidature commune au Groupe INSA, en ligne, avec vos notes et une attestation officielle de français niveau C1 ; un jury admet ou refuse selon le dossier et les vœux. Vous pouvez viser les sept INSA et trois écoles partenaires. En même temps, inscrivez-vous sur Études en France en suivant son calendrier.",
        "calendrier": "Rentrée 2026 : dépôt du 19 janvier au 19 mars 2026, attestation de français au plus tard le 4 mai, résultats le 28 mai, réponse avant le 2 juin 2026. Les dates de la rentrée 2027 ne sont pas encore publiées.",
        "conditions": "Un baccalauréat étranger avec les mathématiques, délivré par un autre pays que la France. L'admission est prononcée sous réserve d'obtenir le bac. Au Sénégal, un bac obtenu avec au plus une reprise ouvre le dossier Études en France ; avec un bac série arabe L-AR, il faut un niveau B2 certifié en français.",
        "langue": "Niveau C1 en français, prouvé par le DALF C1, exigé pour la première année.",
        "fraisDossier": "Droits de candidature au Groupe INSA : 105 €, quel que soit le nombre de vœux. Le dossier Études en France coûte 85 000 francs CFA au Sénégal.",
        "sources": [
          "https://www.groupe-insa.fr/preparer/comment-candidater/les-procedures/integrer-le-groupe-insa-en-1re-annee/bac-mathematiques-delivre-par-un-autre-pays-que-la-france",
          "https://www.insa-lyon.fr/fr/cout-etudes",
          "https://www.insa-lyon.fr/fr/admission-pour-etudiant-international",
          "https://www.senegal.campusfrance.org/les-questions-frequemment-posees"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "mines-paris-psl-paris",
    "motif": "bloc admission (voie Études en France ou procédure propre, calendrier, conditions, langue, frais de dossier), province, note de frais réécrite, montants relus et inchangés, le 2026-09-25",
    "attendu": {
      "province": undefined,
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
      "admission": undefined
    },
    "champs": {
      "province": "Île-de-France",
      "fraisScolarite": {
        "source": "https://www.minesparis.psl.eu/formations/le-cycle-ingenieur-civil/admissions-et-scolarite/",
        "verifieLe": "2026-09-25",
        "note": "Cycle ingénieur civil : 6 440 € par an pour un étudiant qui n'est ni français ni européen, 4 150 € pour les autres ; montants affichés pour l'entrée de septembre 2025, aucun montant plus récent n'est publié. Les élèves boursiers ne paient pas de frais de scolarité. Le diplôme confère le grade de master.",
        "master": {
          "montant": 6440,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "admission": {
        "procedure": "Sans école partenaire, un étudiant étranger entre par l'admission sur titres GEI-UNIV, en licence 3 : inscription en ligne commune à quinze écoles, épreuves écrites, puis oral propre à l'école. Pièces : diplômes et relevés du bac et de licence, lettre de motivation, CV et lettres de recommandation. Pour le visa, un dossier Études en France.",
        "calendrier": "Campagne 2026 close : inscriptions du 6 janvier au 19 février 2026. Les dates 2027 ne sont pas encore publiées ; elles suivent en général le même calendrier.",
        "conditions": "Être inscrit en licence 3 à l'université, en France ou à l'étranger, avec de très bons résultats. Places peu nombreuses.",
        "langue": "Candidat étranger non francophone : justificatif de français, niveau B2 au moins.",
        "fraisDossier": "110 € pour l'ensemble des écoles de la procédure GEI-UNIV. Le dossier Études en France du visa coûte 85 000 francs CFA au Sénégal.",
        "sources": [
          "https://www.minesparis.psl.eu/formations/le-cycle-ingenieur-civil/admissions-et-scolarite/",
          "https://www.geiuniv.com/wp-content/uploads/2026/02/Notice-GEI-UNIV-2026-V4.pdf",
          "https://www.minesparis.psl.eu/en/education/civil-engineering-cycle/admission/",
          "https://www.senegal.campusfrance.org/les-questions-frequemment-posees"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "nantes-universite-nantes",
    "motif": "bloc admission (voie Études en France ou procédure propre, calendrier, conditions, langue, frais de dossier), province, le 2026-09-25",
    "attendu": {
      "province": undefined,
      "admission": undefined
    },
    "champs": {
      "province": "Pays de la Loire",
      "admission": {
        "procedure": "Vous résidez au Sénégal : candidature uniquement sur la plateforme Études en France. Première année de licence et BUT : demande d'admission préalable. Licence 2, licence 3, master 1 et master 2 : dossier Études en France aussi. Le doctorat suit une procédure à part.",
        "calendrier": "Rentrée 2027 au Sénégal : dossier Études en France du 1er octobre au 15 décembre 2026, frais payés au plus tard le 19 décembre 2026, choix de la formation confirmé au plus tard le 31 mai 2027, selon Campus France Sénégal. Pour la rentrée 2026, l'université fermait les candidatures le 15 décembre 2025 en licence 1 et le 31 janvier 2026 de la licence 2 au master 2.",
        "conditions": "Procédure réservée aux étudiants qui n'ont jamais été inscrits dans l'enseignement supérieur français. Au Sénégal, un bac obtenu avec au plus une reprise ouvre le dossier Études en France ; avec un bac série arabe L-AR, il faut un niveau B2 certifié en français.",
        "langue": "En principe TCF niveau 4, soit B2, avec 14 sur 20 à l'épreuve écrite, ou DELF B2 ou DALF. Les élèves des pays où le français est la seule langue officielle, dont le Sénégal, en sont dispensés s'ils ont fait tout le secondaire en français.",
        "fraisDossier": "Aucun frais propre à l'université. Le dossier Études en France coûte 85 000 francs CFA au Sénégal, non remboursables, payés à Campus France.",
        "sources": [
          "https://www.univ-nantes.fr/international/venir-a-nantes/hors-echange",
          "https://www.univ-nantes.fr/formation/scolarite-inscriptions/droits-universitaires-situation",
          "https://www.senegal.campusfrance.org/calendrier-de-la-procedure",
          "https://www.senegal.campusfrance.org/les-questions-frequemment-posees"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "sciences-po-paris",
    "motif": "bloc admission (voie Études en France ou procédure propre, calendrier, conditions, langue, frais de dossier), province, rang ex æquo, le 2026-09-25",
    "attendu": {
      "province": undefined,
      "ranking": "#354 mondial (QS 2027)",
      "admission": undefined
    },
    "champs": {
      "province": "Île-de-France",
      "ranking": "#354 mondial ex æquo (QS 2027)",
      "admission": {
        "procedure": "Procédure internationale propre à Sciences Po, en ligne. Bachelor : dossier avec les bulletins des trois dernières années de lycée et deux recommandations, puis entretien pour les dossiers qui atteignent le seuil. Master : licence non française, phase d'admissibilité sur dossier, puis phase d'admission. Pour le visa, un dossier Études en France.",
        "calendrier": "Bachelor, rentrée 2027 : candidatures de mi-septembre 2026 au 1er mars 2027. Dossier complet au plus tard le 4 novembre 2026 pour une réponse mi-janvier, le 13 janvier 2027 pour une réponse début avril, le 1er mars 2027 pour une réponse début mai.",
        "conditions": "Bachelor : admission sous réserve d'obtenir le diplôme de fin d'études secondaires. Master : une licence ou un bachelor non français, obtenu ou en cours.",
        "langue": "Bachelor enseigné en français : niveau C1 en français, ou B1 en français avec C1 en anglais.",
        "fraisDossier": "150 €, non remboursables. Le dossier Études en France du visa coûte 85 000 francs CFA au Sénégal.",
        "sources": [
          "https://www.sciencespo.fr/admissions/fr/bachelor/bacheliers-secondaires-etrangers/",
          "https://www.sciencespo.fr/admissions/fr/master/procedure-internationale/",
          "https://www.sciencespo.fr/admissions/en/undergraduate/foreign-secondary-schools/language-requirements/",
          "https://www.sciencespo.fr/students/en/fees-funding/tuition-fees/"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "sorbonne-universite-paris",
    "motif": "bloc admission (voie Études en France ou procédure propre, calendrier, conditions, langue, frais de dossier), province, le 2026-09-25",
    "attendu": {
      "province": undefined,
      "admission": undefined
    },
    "champs": {
      "province": "Île-de-France",
      "admission": {
        "procedure": "Vous résidez au Sénégal : candidature sur la plateforme Études en France. Première année de licence : demande d'admission préalable, en conseillant de viser plusieurs universités. Licence 2, licence 3 et master : dossier Études en France aussi.",
        "calendrier": "Rentrée 2027 au Sénégal : dossier Études en France du 1er octobre au 15 décembre 2026, frais payés au plus tard le 19 décembre 2026, choix de la formation confirmé au plus tard le 31 mai 2027, selon Campus France Sénégal. Pour la rentrée 2026, la faculté des sciences fixait la demande d'admission préalable du 1er octobre 2025 au 15 janvier 2026.",
        "conditions": "Première année de licence : diplôme de fin d'études secondaires hors Union européenne. Autres années : le diplôme du niveau précédent. Au Sénégal, un bac obtenu avec au plus une reprise ouvre le dossier Études en France ; avec un bac série arabe L-AR, il faut un niveau B2 certifié en français.",
        "langue": "Faculté des sciences, licence : niveau B2 au moins, prouvé par le TCF, le TEF ou le DELF. Faculté des lettres : test de français B2 en licence et C1 en master, sans dispense pour les diplômés en langue ou littérature françaises.",
        "fraisDossier": "Aucun frais propre à l'université. Le dossier Études en France coûte 85 000 francs CFA au Sénégal, non remboursables, payés à Campus France.",
        "sources": [
          "https://sciences.sorbonne-universite.fr/international-1/venir-la-faculte/etudiantes-et-etudiants-internationaux/venir-titre-individuel-0",
          "https://lettres.sorbonne-universite.fr/formation/inscription/etudiants-non-europeens",
          "https://www.sorbonne-universite.fr/en/education/study-sorbonne-university/enrolment-procedures-and-tuition-fees",
          "https://www.senegal.campusfrance.org/calendrier-de-la-procedure"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "universite-claude-bernard-lyon-1-villeurbanne",
    "motif": "bloc admission (voie Études en France ou procédure propre, calendrier, conditions, langue, frais de dossier), province, rang ex æquo, le 2026-09-25",
    "attendu": {
      "province": undefined,
      "ranking": "#613 mondial (QS 2027)",
      "admission": undefined
    },
    "champs": {
      "province": "Auvergne-Rhône-Alpes",
      "ranking": "#613 mondial ex æquo (QS 2027)",
      "admission": {
        "procedure": "Vous résidez au Sénégal : procédure Études en France obligatoire. Première année de licence : seule la licence 1 portail PCSI est ouverte à la demande d'admission préalable. Licence 2, licence 3 et master : dossier Études en France, hors demande d'admission préalable.",
        "calendrier": "Rentrée 2027 au Sénégal : dossier Études en France du 1er octobre au 15 décembre 2026, frais payés au plus tard le 19 décembre 2026, choix de la formation confirmé au plus tard le 31 mai 2027, selon Campus France Sénégal.",
        "conditions": "Première année : diplôme de fin d'études secondaires étranger. Autres années : le diplôme du niveau précédent. Au Sénégal, un bac obtenu avec au plus une reprise ouvre le dossier Études en France ; avec un bac série arabe L-AR, il faut un niveau B2 certifié en français.",
        "langue": "Niveau B2 : TCF niveau 4, TEF niveau 4 ou DELF B2. Les candidats des pays officiellement et exclusivement francophones, dont le Sénégal, en sont dispensés.",
        "fraisDossier": "Aucun frais propre à l'université. Le dossier Études en France coûte 85 000 francs CFA au Sénégal, non remboursables, payés à Campus France.",
        "sources": [
          "https://www.univ-lyon1.fr/formation/inscription-et-scolarite/inscription-candidats-internationaux-hors-echange-comment-candidater",
          "https://www.univ-lyon1.fr/formation/inscription-et-scolarite/etudiantes-et-etudiants-internationaux-droits-dinscription-differencies-et-exonerations",
          "https://www.senegal.campusfrance.org/calendrier-de-la-procedure",
          "https://www.senegal.campusfrance.org/les-questions-frequemment-posees"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "universite-cote-d-azur-nice",
    "motif": "bloc admission (voie Études en France ou procédure propre, calendrier, conditions, langue, frais de dossier), province, le 2026-09-25",
    "attendu": {
      "province": undefined,
      "admission": undefined
    },
    "champs": {
      "province": "Provence-Alpes-Côte d'Azur",
      "admission": {
        "procedure": "Vous résidez au Sénégal : toute candidature passe par la plateforme Études en France, de la première année de licence au master. Première année : demande d'admission préalable. Mon Master et eCandidat ne concernent que les candidats hors pays Études en France.",
        "calendrier": "Rentrée 2027 au Sénégal : dossier Études en France du 1er octobre au 15 décembre 2026, frais payés au plus tard le 19 décembre 2026, choix de la formation confirmé au plus tard le 31 mai 2027, selon Campus France Sénégal.",
        "conditions": "Première année : diplôme de fin d'études secondaires obtenu hors Union européenne. Autres années : le diplôme du niveau précédent. Au Sénégal, un bac obtenu avec au plus une reprise ouvre le dossier Études en France ; avec un bac série arabe L-AR, il faut un niveau B2 certifié en français.",
        "langue": "Le niveau de français est vérifié dans le dossier Études en France ; l'université ne publie pas de seuil général.",
        "fraisDossier": "Aucun frais propre à l'université. Le dossier Études en France coûte 85 000 francs CFA au Sénégal, non remboursables, payés à Campus France.",
        "sources": [
          "https://univ-cotedazur.fr/formation/candidater-et-s-inscrire/candidater/candidater-en-master",
          "https://univ-cotedazur.fr/formation/candidater-et-s-inscrire/candidater/candidater-en-licence-2-licence-3-licence-professionnelle",
          "https://univ-cotedazur.fr/formation/candidater-et-s-inscrire/droits-dinscription",
          "https://www.senegal.campusfrance.org/calendrier-de-la-procedure"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "universite-de-bordeaux-bordeaux",
    "motif": "bloc admission (voie Études en France ou procédure propre, calendrier, conditions, langue, frais de dossier), province, rang ex æquo, le 2026-09-25",
    "attendu": {
      "province": undefined,
      "ranking": "#485 mondial (QS 2027)",
      "admission": undefined
    },
    "champs": {
      "province": "Nouvelle-Aquitaine",
      "ranking": "#485 mondial ex æquo (QS 2027)",
      "admission": {
        "procedure": "Vous résidez au Sénégal : candidature sur la plateforme Études en France de Campus France. Première année de licence : demande d'admission préalable. Licence 2, licence 3 et master : dossier Études en France, étudié ensuite par Campus France et par l'université.",
        "calendrier": "Rentrée 2027 au Sénégal : dossier Études en France du 1er octobre au 15 décembre 2026, frais payés au plus tard le 19 décembre 2026, choix de la formation confirmé au plus tard le 31 mai 2027, selon Campus France Sénégal. Selon l'université, les dossiers sont étudiés d'avril à juin, et l'inscription a lieu de juillet à septembre.",
        "conditions": "Première année : diplôme donnant accès à l'enseignement supérieur dans votre pays. Autres années : le diplôme du niveau précédent. Au Sénégal, un bac obtenu avec au plus une reprise ouvre le dossier Études en France ; avec un bac série arabe L-AR, il faut un niveau B2 certifié en français.",
        "langue": "Le niveau dépend de la faculté. La faculté de droit demande par exemple un niveau B2 dans les quatre compétences, prouvé par TCF, DELF ou DALF de moins de deux ans.",
        "fraisDossier": "Aucun frais propre à l'université. Le dossier Études en France coûte 85 000 francs CFA au Sénégal, non remboursables, payés à Campus France.",
        "sources": [
          "https://www.u-bordeaux.fr/International/venir-bordeaux/etudiants-internationaux/admission-diplome",
          "https://droit.u-bordeaux.fr/international/etudier-bordeaux/candidatures-individuelles",
          "https://www.u-bordeaux.fr/formation/candidatures-et-inscriptions/cout-des-etudes/etudiants-extra-communautaires",
          "https://www.senegal.campusfrance.org/calendrier-de-la-procedure"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "universite-de-lille-lille",
    "motif": "bloc admission (voie Études en France ou procédure propre, calendrier, conditions, langue, frais de dossier), province, rang ex æquo, note de frais réécrite, montants relus et inchangés, le 2026-09-25",
    "attendu": {
      "province": undefined,
      "ranking": "#686 mondial (QS 2027)",
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
      "admission": undefined
    },
    "champs": {
      "province": "Hauts-de-France",
      "ranking": "#686 mondial ex æquo (QS 2027)",
      "fraisScolarite": {
        "source": "https://www.univ-lille.fr/formation/droits-dinscription",
        "verifieLe": "2026-09-25",
        "note": "Année 2026-2027. Droits différenciés hors Union européenne : 2 902 € en licence, 3 950 € en master. En 2026-2027, l'université ramenait d'office au tarif européen la première inscription en master, en cycle ingénieur et en doctorat ; depuis le décret du 19 mai 2026, une exonération ne peut plus viser toute une catégorie d'étudiants. Prévoyez donc le tarif plein. Doctorat : 398 €.",
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
      "admission": {
        "procedure": "Vous résidez au Sénégal : candidature sur la plateforme Études en France de Campus France. Première année de licence : demande d'admission préalable sur Études en France. Master : dossier Études en France aussi. L'université propose un outil en ligne qui indique la bonne procédure selon votre profil.",
        "calendrier": "Rentrée 2027 au Sénégal : dossier Études en France du 1er octobre au 15 décembre 2026, frais payés au plus tard le 19 décembre 2026, choix de la formation confirmé au plus tard le 31 mai 2027, selon Campus France Sénégal.",
        "conditions": "Licence : un diplôme qui donne accès aux études supérieures. Master : dossier étudié au cas par cas par l'équipe pédagogique. Au Sénégal, un bac obtenu avec au plus une reprise ouvre le dossier Études en France ; avec un bac série arabe L-AR, il faut un niveau B2 certifié en français.",
        "langue": "Une certification de français de niveau B2 au moins, sauf dispense ; certaines licences demandent plus, comme le C1 pour la licence bilingue de sciences de la vie.",
        "fraisDossier": "Aucun frais propre à l'université. Le dossier Études en France coûte 85 000 francs CFA au Sénégal, non remboursables, payés à Campus France.",
        "sources": [
          "https://international.univ-lille.fr/venir-a-luniversite-de-lille/je-suis-etudiant/hors-programme-dechange",
          "https://www.univ-lille.fr/formation/exoneration",
          "https://www.univ-lille.fr/formation/droits-dinscription",
          "https://www.senegal.campusfrance.org/calendrier-de-la-procedure"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "universite-de-lorraine-nancy",
    "motif": "bloc admission (voie Études en France ou procédure propre, calendrier, conditions, langue, frais de dossier), province, note de frais réécrite, montants relus et inchangés, exonération réécrite (décret du 19 mai 2026), le 2026-09-25",
    "attendu": {
      "province": undefined,
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
        "detail": "La première année se paie au tarif différencié plein. Dès la deuxième année, si vous poursuivez le même cursus sans interruption, vous avez une exonération partielle : vous payez les droits des étudiants européens (178 €, 255 € ou 630 €). Si vous redoublez ou changez de cursus, elle n'est pas automatique : demandez-la. Un plafond national limite ces exonérations à 30 % des inscrits hors UE en 2026-2027.",
        "source": "https://www.univ-lorraine.fr/enseignements-et-formations/sinscrire-a-l-universite-de-lorraine/",
        "verifieLe": "2026-09-13"
      },
      "admission": undefined
    },
    "champs": {
      "province": "Grand Est",
      "fraisScolarite": {
        "source": "https://www.univ-lorraine.fr/enseignements-et-formations/sinscrire-a-l-universite-de-lorraine/",
        "verifieLe": "2026-09-25",
        "note": "Année 2026-2027. Droits différenciés pour un étudiant hors Espace économique européen : 2 902 € en licence, licence professionnelle et BUT, 3 950 € en master et en école d'ingénieurs. En 2026-2027, un ressortissant d'un pays membre de la Francophonie inscrit en master 1 payait les droits européens tant qu'il poursuivait sans interruption. Depuis le décret du 19 mai 2026, une exonération ne peut plus viser toute une catégorie d'étudiants. Doctorat : 398 €.",
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
        "detail": "En 2026-2027, un étudiant d'un pays membre de la Francophonie, comme le Sénégal, inscrit en master 1, payait les droits européens jusqu'à la fin du cursus, sans interruption. Pour une première inscription en 2027-2028, le décret du 19 mai 2026 ne laisse que des exonérations individuelles, sur demande, dans la limite de 25 % des inscrits hors Union européenne.",
        "source": "https://www.univ-lorraine.fr/enseignements-et-formations/sinscrire-a-l-universite-de-lorraine/",
        "verifieLe": "2026-09-25"
      },
      "admission": {
        "procedure": "Vous résidez au Sénégal : candidature sur la plateforme Études en France de Campus France. Première année de licence : demande d'admission préalable. Licence 2, licence 3 et master : dossier Études en France aussi. Après l'accord, vérifiez sur Études en France les conditions d'inscription de votre formation.",
        "calendrier": "Rentrée 2027 au Sénégal : dossier Études en France du 1er octobre au 15 décembre 2026, frais payés au plus tard le 19 décembre 2026, choix de la formation confirmé au plus tard le 31 mai 2027, selon Campus France Sénégal.",
        "conditions": "Première année : diplôme de fin d'études secondaires. Autres années : le diplôme du niveau précédent. Au Sénégal, un bac obtenu avec au plus une reprise ouvre le dossier Études en France ; avec un bac série arabe L-AR, il faut un niveau B2 certifié en français.",
        "langue": "Le niveau de français est vérifié dans le dossier Études en France ; l'université ne publie pas de seuil général.",
        "fraisDossier": "Aucun frais propre à l'université. Le dossier Études en France coûte 85 000 francs CFA au Sénégal, non remboursables, payés à Campus France.",
        "sources": [
          "https://www.univ-lorraine.fr/welcome/candidater-hors-programme-dechange/",
          "https://www.univ-lorraine.fr/enseignements-et-formations/sinscrire-a-l-universite-de-lorraine/",
          "https://www.senegal.campusfrance.org/calendrier-de-la-procedure",
          "https://www.senegal.campusfrance.org/les-questions-frequemment-posees"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "universite-de-montpellier-montpellier",
    "motif": "bloc admission (voie Études en France ou procédure propre, calendrier, conditions, langue, frais de dossier), province, le 2026-09-25",
    "attendu": {
      "province": undefined,
      "admission": undefined
    },
    "champs": {
      "province": "Occitanie",
      "admission": {
        "procedure": "Vous résidez au Sénégal : candidature d'abord sur la plateforme Études en France, avant toute inscription. Première année de licence : demande d'admission préalable. Licence 2, licence 3 et master : dossier Études en France aussi. Une demande faite en dehors de Campus France est rejetée.",
        "calendrier": "Rentrée 2027 au Sénégal : dossier Études en France du 1er octobre au 15 décembre 2026, frais payés au plus tard le 19 décembre 2026, choix de la formation confirmé au plus tard le 31 mai 2027, selon Campus France Sénégal.",
        "conditions": "Un diplôme qui donne accès à la formation visée. Au Sénégal, un bac obtenu avec au plus une reprise ouvre le dossier Études en France ; avec un bac série arabe L-AR, il faut un niveau B2 certifié en français.",
        "langue": "Le niveau dépend de la faculté. La faculté des sciences demande le niveau B2 au TCF, ou un équivalent.",
        "fraisDossier": "Aucun frais propre à l'université. Le dossier Études en France coûte 85 000 francs CFA au Sénégal, non remboursables, payés à Campus France.",
        "sources": [
          "https://www.umontpellier.fr/international/etudier-a-letranger/venir-etudier-a-luniversite-de-montpellier",
          "https://sciences.edu.umontpellier.fr/relations-internationales/etudiants-hors-programmes-dechanges-in-individual-enrolment/",
          "https://www.umontpellier.fr/wp-content/uploads/2026/07/droits-differencies.pdf",
          "https://www.senegal.campusfrance.org/calendrier-de-la-procedure"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "universite-de-rennes-rennes",
    "motif": "bloc admission (voie Études en France ou procédure propre, calendrier, conditions, langue, frais de dossier), province, note de frais réécrite, montants ajoutés ou corrigés : licence, master, exonération réécrite (décret du 19 mai 2026), le 2026-09-25",
    "attendu": {
      "province": undefined,
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
        "detail": "Les tarifs affichés tiennent déjà compte d'une exonération partielle générale, maintenue à titre transitoire en 2026-2027 et appliquée sans demande. En plus, exonération automatique pour les boursiers du gouvernement français et les accords de coopération avec réciprocité. Exonérations individuelles possibles selon votre situation, dans la limite de 30 % des inscrits hors UE en 2026-2027, puis 25 % et 20 %.",
        "source": "https://formations.univ-rennes.fr/droits-dinscription-bourses-et-exonerations-pour-les-etudiantes-et-etudiants-internationaux",
        "verifieLe": "2026-09-13"
      },
      "admission": undefined
    },
    "champs": {
      "province": "Bretagne",
      "fraisScolarite": {
        "source": "https://formations.univ-rennes.fr/droits-dinscription-bourses-et-exonerations-pour-les-etudiantes-et-etudiants-internationaux",
        "verifieLe": "2026-09-25",
        "note": "Droits différenciés hors Union européenne : 2 902 € en licence, 3 950 € en master en 2026-2027. À la rentrée 2026, Rennes gardait ses règles de 2025-2026 et ne demandait que 650 € en licence et 950 € en master. Depuis le décret du 19 mai 2026, une exonération ne peut plus viser toute une catégorie d'étudiants : prévoyez le tarif plein. Doctorat : 398 €.",
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
        "detail": "À la rentrée 2026, Rennes appliquait encore, à titre transitoire, une exonération partielle générale : 650 € en licence, 950 € en master. Pour une première inscription en 2027-2028, le décret du 19 mai 2026 ne laisse que des exonérations individuelles, sur demande et selon votre situation, dans la limite de 25 % des inscrits hors Union européenne. Boursiers du gouvernement français : exonérés.",
        "source": "https://formations.univ-rennes.fr/droits-dinscription-bourses-et-exonerations-pour-les-etudiantes-et-etudiants-internationaux",
        "verifieLe": "2026-09-25"
      },
      "admission": {
        "procedure": "Vous résidez au Sénégal : pour la licence, le master ou le doctorat, vous suivez la procédure Études en France de Campus France Sénégal. Première année de licence : demande d'admission préalable.",
        "calendrier": "Rentrée 2027 au Sénégal : dossier Études en France du 1er octobre au 15 décembre 2026, frais payés au plus tard le 19 décembre 2026, choix de la formation confirmé au plus tard le 31 mai 2027, selon Campus France Sénégal.",
        "conditions": "Un diplôme qui donne accès à la formation visée. Au Sénégal, un bac obtenu avec au plus une reprise ouvre le dossier Études en France ; avec un bac série arabe L-AR, il faut un niveau B2 certifié en français.",
        "langue": "Le niveau dépend de la formation : les masters de l'école d'informatique et d'électronique demandent par exemple le niveau C1 avec un diplôme étranger.",
        "fraisDossier": "Aucun frais propre à l'université. Le dossier Études en France coûte 85 000 francs CFA au Sénégal, non remboursables, payés à Campus France.",
        "sources": [
          "https://www.univ-rennes.fr/candidature-et-inscription-des-etudiants-internationaux-luniversite-de-rennes",
          "https://istic.univ-rennes.fr/candidatures-et-admissions-en-master",
          "https://formations.univ-rennes.fr/droits-dinscription-bourses-et-exonerations-pour-les-etudiantes-et-etudiants-internationaux",
          "https://www.senegal.campusfrance.org/calendrier-de-la-procedure"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "universite-de-strasbourg-strasbourg",
    "motif": "bloc admission (voie Études en France ou procédure propre, calendrier, conditions, langue, frais de dossier), province, rang ex æquo, note de frais réécrite, montants ajoutés ou corrigés : doctorat, le 2026-09-25",
    "attendu": {
      "province": undefined,
      "ranking": "#456 mondial (QS 2027)",
      "fraisScolarite": {
        "source": "https://en.unistra.fr/fr/droits-dinscription",
        "verifieLe": "2026-09-07",
        "note": "Droits différenciés hors UE, nouvel entrant.",
        "licence": {
          "montant": 2902,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 3950,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "admission": undefined
    },
    "champs": {
      "province": "Grand Est",
      "ranking": "#456 mondial ex æquo (QS 2027)",
      "fraisScolarite": {
        "source": "https://en.unistra.fr/fr/droits-dinscription",
        "verifieLe": "2026-09-25",
        "note": "Droits différenciés hors Union européenne, 2026-2027 : 2 902 € en licence, 3 950 € en master. En 2026-2027, un nouvel entrant admis en licence par Études en France était exonéré jusqu'à son diplôme de licence ; depuis le décret du 19 mai 2026, une exonération ne peut plus viser toute une catégorie d'étudiants. Doctorat : 398 €.",
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
      "admission": {
        "procedure": "Vous résidez au Sénégal : inscription sur la plateforme Études en France et suivi de sa procédure, pour la première année de licence par demande d'admission préalable, pour les autres années de licence et pour le master. Les dossiers envoyés par une autre voie ne sont pas examinés.",
        "calendrier": "Rentrée 2027 au Sénégal : dossier Études en France du 1er octobre au 15 décembre 2026, frais payés au plus tard le 19 décembre 2026, choix de la formation confirmé au plus tard le 31 mai 2027, selon Campus France Sénégal.",
        "conditions": "Un diplôme qui donne accès à la formation visée ; en master, l'université vérifie que votre parcours correspond. Au Sénégal, un bac obtenu avec au plus une reprise ouvre le dossier Études en France ; avec un bac série arabe L-AR, il faut un niveau B2 certifié en français.",
        "langue": "Le niveau dépend de la faculté ; la faculté de mathématiques et d'informatique demande par exemple le niveau B2.",
        "fraisDossier": "Aucun frais propre à l'université. Le dossier Études en France coûte 85 000 francs CFA au Sénégal, non remboursables, payés à Campus France.",
        "sources": [
          "https://www.unistra.fr/candidats-internationaux",
          "https://mathinfo.unistra.fr/en/admissions/admissions/",
          "https://en.unistra.fr/fr/droits-dinscription",
          "https://www.senegal.campusfrance.org/calendrier-de-la-procedure"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "universite-de-toulouse-toulouse",
    "motif": "bloc admission (voie Études en France ou procédure propre, calendrier, conditions, langue, frais de dossier), province, rang ex æquo, note de frais réécrite, montants ajoutés ou corrigés : licence, master, exonération réécrite (décret du 19 mai 2026), le 2026-09-25",
    "attendu": {
      "province": undefined,
      "ranking": "#565 mondial (QS 2027)",
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
        "detail": "Exonération partielle pour tous les étudiants hors UE concernés : la demande d'inscription vaut demande d'exonération, sans autre démarche. Elle vaut jusqu'à la fin du cycle, redoublements compris. Exonération totale possible, après évaluation sociale, pour boursiers, pupilles, réfugiés, grande précarité ou handicap. Ces règles datent d'avant le plafond national de 30 % fixé le 19 mai 2026 : à confirmer auprès de l'université.",
        "source": "https://www.utoulouse.fr/conseils/075-droits-dinscription-differencies-2026-2027",
        "verifieLe": "2026-09-13"
      },
      "admission": undefined
    },
    "champs": {
      "province": "Occitanie",
      "ranking": "#565 mondial ex æquo (QS 2027)",
      "fraisScolarite": {
        "source": "https://www.utoulouse.fr/conseils/075-droits-dinscription-differencies-2026-2027",
        "verifieLe": "2026-09-25",
        "note": "Droits différenciés hors Union européenne, 2026-2027 : 2 902 € en licence, 3 950 € en master. En 2026-2027, l'université exonérait tous les étudiants concernés, qui payaient 178 € en licence et 255 € en master. Depuis le décret du 19 mai 2026, une exonération ne peut plus viser toute une catégorie d'étudiants : prévoyez le tarif plein. Doctorat : 398 €.",
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
        "detail": "En 2026-2027, Toulouse exonérait partiellement tous les étudiants hors Union européenne, jusqu'à la fin du cycle. Pour une première inscription en 2027-2028, le décret du 19 mai 2026 ne laisse que des exonérations individuelles, sur demande et selon votre situation, dans la limite de 25 % des inscrits hors Union européenne. Boursiers du gouvernement français : exonérés.",
        "source": "https://www.utoulouse.fr/conseils/075-droits-dinscription-differencies-2026-2027",
        "verifieLe": "2026-09-25"
      },
      "admission": {
        "procedure": "Vous résidez au Sénégal : candidature sur le site Campus France de votre pays, par Études en France. Première année de licence : demande d'admission préalable. Seuls les dossiers complets validés par Études en France sont transmis à l'université.",
        "calendrier": "Rentrée 2027 au Sénégal : dossier Études en France du 1er octobre au 15 décembre 2026, frais payés au plus tard le 19 décembre 2026, choix de la formation confirmé au plus tard le 31 mai 2027, selon Campus France Sénégal.",
        "conditions": "Un diplôme étranger qui donne accès à la formation visée dans votre pays. Au Sénégal, un bac obtenu avec au plus une reprise ouvre le dossier Études en France ; avec un bac série arabe L-AR, il faut un niveau B2 certifié en français.",
        "langue": "Niveau vérifié par le TCF : C1 en PASS, B2 en sciences ou en STAPS, C1 pour la licence 1 sciences et humanités.",
        "fraisDossier": "Aucun frais propre à l'université. Le dossier Études en France coûte 85 000 francs CFA au Sénégal, non remboursables, payés à Campus France.",
        "sources": [
          "https://www.utoulouse.fr/candidatures/candidates-et-candidats-de-nationalite-etrangere-titulaires-d-un-diplome-etranger-residant-a-l-etranger-candidature-en-premiere-annee",
          "https://www.utoulouse.fr/candidatures/candidature-en-m2-pour-les-titulaires-d-un-diplome-obtenu-a-l-etranger",
          "https://www.utoulouse.fr/conseils/075-droits-dinscription-differencies-2026-2027",
          "https://www.senegal.campusfrance.org/calendrier-de-la-procedure"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "universite-grenoble-alpes-grenoble",
    "motif": "bloc admission (voie Études en France ou procédure propre, calendrier, conditions, langue, frais de dossier), province, note de frais réécrite, montants relus et inchangés, le 2026-09-25",
    "attendu": {
      "province": undefined,
      "admission": undefined,
      "fraisScolarite": {
        "source": "https://www.univ-grenoble-alpes.fr/etudiants-internationaux-ce-que-change-le-nouveau-decret-sur-les-droits-d-inscription-a-l-uga-1775870.kjsp",
        "verifieLe": "2026-09-13",
        "note": "Annee 2026-2027, communique de l'UGA du 29 mai 2026 mis a jour le 11 septembre 2026. MONTANTS RETENUS : le TARIF PLEIN des droits differencies, 2 902 EUR en licence et 3 950 EUR en master, parce que l'exoneration n'est PAS automatique a Grenoble — contrairement a Toulouse et Paris-Saclay. L'etudiant hors UE doit la DEMANDER et declarer ses ressources ; s'il l'obtient, il ne paie plus que les droits nationaux, que l'UGA chiffre a 178 EUR en licence et 254 EUR en master. L'universite annonce vouloir l'appliquer largement en 2026-2027, mais le decret n° 2026-385 du 19 mai 2026 la plafonne a 30 % des inscrits hors UE, puis 25 % et 20 %. Budgeter 2 902 EUR et considerer les 178 EUR comme un gain possible, jamais l'inverse. Doctorat non assujetti : 398 EUR. S'ajoute la CVEC. Non lus : le formulaire de demande et les regles propres aux etablissements-composantes (Polytech, IAE, Grenoble INP), exclus du dispositif central.",
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
      }
    },
    "champs": {
      "province": "Auvergne-Rhône-Alpes",
      "admission": {
        "procedure": "Vous résidez au Sénégal : candidature sur la plateforme Études en France pour tous les niveaux. Première année de licence : trois vœux au plus, tous établissements confondus. Licence 2, licence 3 et master : sept vœux au plus. Les services de coopération étudient les dossiers, puis l'université répond.",
        "calendrier": "Rentrée 2027 au Sénégal : dossier Études en France du 1er octobre au 15 décembre 2026, frais payés au plus tard le 19 décembre 2026, choix de la formation confirmé au plus tard le 31 mai 2027, selon Campus France Sénégal. Pour la rentrée 2026, l'université examinait les dossiers jusqu'au 15 mars 2026.",
        "conditions": "Première année : diplôme de fin d'études secondaires. Autres années : le diplôme du niveau précédent. Au Sénégal, un bac obtenu avec au plus une reprise ouvre le dossier Études en France ; avec un bac série arabe L-AR, il faut un niveau B2 certifié en français.",
        "langue": "Le niveau de français est vérifié dans le dossier Études en France ; chaque formation peut fixer le sien.",
        "fraisDossier": "Aucun frais propre à l'université. Le dossier Études en France coûte 85 000 francs CFA au Sénégal, non remboursables, payés à Campus France.",
        "sources": [
          "https://etudier.univ-grenoble-alpes.fr/candidater-et-vous-inscrire/candidature/toutes-les-procedures/candidater-sur-la-plateforme-etudes-en-france-pef-/candidater-a-une-formation-sur-la-plateforme-etudes-en-france-pef--1615793.kjsp",
          "https://www.univ-grenoble-alpes.fr/etudiants-internationaux-ce-que-change-le-nouveau-decret-sur-les-droits-d-inscription-a-l-uga-1775870.kjsp",
          "https://www.senegal.campusfrance.org/calendrier-de-la-procedure",
          "https://www.senegal.campusfrance.org/les-questions-frequemment-posees"
        ],
        "verifieLe": "2026-09-25"
      },
      "fraisScolarite": {
        "source": "https://www.univ-grenoble-alpes.fr/etudiants-internationaux-ce-que-change-le-nouveau-decret-sur-les-droits-d-inscription-a-l-uga-1775870.kjsp",
        "verifieLe": "2026-09-25",
        "note": "Année 2026-2027. Droits différenciés pour un étudiant hors Union européenne : 2 902 € en licence, 3 950 € en master. L'exonération n'est pas automatique : il faut la demander en déclarant ses ressources ; si elle est accordée, on paie les droits nationaux, 178 € en licence et 254 € en master selon l'université. Elle reste plafonnée : 30 % des inscrits hors Union européenne en 2026-2027, 25 % en 2027-2028. Prévoyez le tarif plein. Doctorat : 398 €.",
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
      }
    }
  },
  {
    "collection": "universities",
    "id": "universite-paris-1-pantheon-sorbonne-paris",
    "motif": "bloc admission (voie Études en France ou procédure propre, calendrier, conditions, langue, frais de dossier), province, rang ex æquo, note de frais réécrite, montants relus et inchangés, exonération réécrite (décret du 19 mai 2026), le 2026-09-25",
    "attendu": {
      "province": undefined,
      "ranking": "#246 mondial (QS 2027)",
      "fraisScolarite": {
        "source": "https://www.pantheonsorbonne.fr/inscription/frais-dinscription",
        "verifieLe": "2026-09-07",
        "note": "Droits différenciés hors UE ; doctorat au tarif national. Les ressortissants des 44 pays les moins avancés (liste ONU) paient les droits nationaux.",
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
      "admission": undefined,
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Paient les droits nationaux (même tarif que les étudiants français) : les ressortissants des 44 pays les moins avancés (liste de l'ONU), les étudiants déjà inscrits en 2025-2026 qui continuent dans le même cycle, les doubles diplômes, les réfugiés, les demandeurs d'asile et les boursiers du gouvernement français (BGF). Les autres étudiants hors UE paient les droits différenciés (règles de mars 2026).",
        "source": "https://international.pantheonsorbonne.fr/sites/default/files/2026-03/Schema_DIF_26-27_03-26_FR_0.pdf",
        "verifieLe": "2026-09-07"
      }
    },
    "champs": {
      "province": "Île-de-France",
      "ranking": "#246 mondial ex æquo (QS 2027)",
      "fraisScolarite": {
        "source": "https://www.pantheonsorbonne.fr/inscription/frais-dinscription",
        "verifieLe": "2026-09-25",
        "note": "Droits différenciés hors Union européenne, 2026-2027 : 2 902 € en licence, 3 950 € en master. En 2026-2027, les ressortissants des 44 pays les moins avancés, dont le Sénégal, payaient les droits nationaux, 178 € et 255 €. Depuis le décret du 19 mai 2026, une exonération ne peut plus viser toute une catégorie d'étudiants : prévoyez le tarif plein. Doctorat : 398 €.",
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
      "admission": {
        "procedure": "Vous résidez au Sénégal : licence 1, licence 2, licence 3 et master 1 passent par Études en France ; en licence 1, c'est la demande d'admission préalable. Joignez vos relevés, vos diplômes traduits en français par un traducteur professionnel si besoin, et le justificatif de l'examen d'accès à l'université de votre pays s'il en existe un.",
        "calendrier": "Rentrée 2027 au Sénégal : dossier Études en France du 1er octobre au 15 décembre 2026, frais payés au plus tard le 19 décembre 2026, choix de la formation confirmé au plus tard le 31 mai 2027, selon Campus France Sénégal.",
        "conditions": "Première année : diplôme de fin d'études secondaires. Autres années : le diplôme du niveau précédent. Au Sénégal, un bac obtenu avec au plus une reprise ouvre le dossier Études en France ; avec un bac série arabe L-AR, il faut un niveau B2 certifié en français.",
        "langue": "Niveau B2 en licence 1 et 2, C1 en licence 3 et en master, par DELF, DALF ou TCF. L'attestation n'est exigée que des ressortissants de pays où le français n'est pas langue officielle.",
        "fraisDossier": "Aucun frais propre à l'université. Le dossier Études en France coûte 85 000 francs CFA au Sénégal, non remboursables, payés à Campus France.",
        "sources": [
          "https://international.pantheonsorbonne.fr/venir-paris-1-pantheon-sorbonne/etudiant-en-mobilite-individuelle",
          "https://international.pantheonsorbonne.fr/sites/default/files/2026-03/Schema_DIF_26-27_03-26_FR_0.pdf",
          "https://www.pantheonsorbonne.fr/inscription/frais-dinscription",
          "https://www.senegal.campusfrance.org/calendrier-de-la-procedure"
        ],
        "verifieLe": "2026-09-25"
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "En 2026-2027, les ressortissants des 44 pays les moins avancés, dont le Sénégal, payaient les droits nationaux, comme les réfugiés et les boursiers du gouvernement français. Pour une première inscription en 2027-2028, le décret du 19 mai 2026 ne laisse que des exonérations individuelles, sur demande et selon votre situation, dans la limite de 25 % des inscrits hors Union européenne.",
        "source": "https://international.pantheonsorbonne.fr/sites/default/files/2026-03/Schema_DIF_26-27_03-26_FR_0.pdf",
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "universite-paris-cite-paris",
    "motif": "bloc admission (voie Études en France ou procédure propre, calendrier, conditions, langue, frais de dossier), province, rang ex æquo, note de frais réécrite, montants ajoutés ou corrigés : licence, master, exonération réécrite (décret du 19 mai 2026), le 2026-09-25",
    "attendu": {
      "province": undefined,
      "ranking": "#303 mondial (QS 2027)",
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
      },
      "admission": undefined
    },
    "champs": {
      "province": "Île-de-France",
      "ranking": "#303 mondial ex æquo (QS 2027)",
      "fraisScolarite": {
        "source": "https://u-paris.fr/droits-dinscription-tarifs-exonerations/",
        "verifieLe": "2026-09-25",
        "note": "Droits différenciés hors Union européenne, 2026-2027 : 2 902 € en licence, 3 950 € en master. En 2026-2027, l'université reconduisait son moratoire : les étudiants hors Union européenne payaient 178 € en licence et 255 € en master. Depuis le décret du 19 mai 2026, une exonération ne peut plus viser toute une catégorie d'étudiants : prévoyez le tarif plein. Doctorat : 398 €.",
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
        "detail": "Pour 2026-2027, Paris Cité reconduisait son moratoire : 178 € en licence, 255 € en master pour les étudiants hors Union européenne. Pour une première inscription en 2027-2028, le décret du 19 mai 2026 ne laisse que des exonérations individuelles, sur demande et selon votre situation, dans la limite de 25 % des inscrits hors Union européenne.",
        "source": "https://u-paris.fr/droits-dinscription-tarifs-exonerations/",
        "verifieLe": "2026-09-25"
      },
      "admission": {
        "procedure": "Vous résidez au Sénégal : procédure Études en France de la licence 2 au master 2 ; Mon Master et eCandidat ne sont pas pour vous. Première année de licence : demande d'admission préalable sur Études en France.",
        "calendrier": "Rentrée 2027 au Sénégal : dossier Études en France du 1er octobre au 15 décembre 2026, frais payés au plus tard le 19 décembre 2026, choix de la formation confirmé au plus tard le 31 mai 2027, selon Campus France Sénégal.",
        "conditions": "Le diplôme du niveau précédent. Au Sénégal, un bac obtenu avec au plus une reprise ouvre le dossier Études en France ; avec un bac série arabe L-AR, il faut un niveau B2 certifié en français.",
        "langue": "Le niveau de français est vérifié dans le dossier Études en France ; l'université ne publie pas de seuil général.",
        "fraisDossier": "Aucun frais propre à l'université. Le dossier Études en France coûte 85 000 francs CFA au Sénégal, non remboursables, payés à Campus France.",
        "sources": [
          "https://u-paris.fr/candidater-a-universite-paris-cite/",
          "https://u-paris.fr/demande-dadmission-prealable/",
          "https://u-paris.fr/droits-dinscription-tarifs-exonerations/",
          "https://www.senegal.campusfrance.org/calendrier-de-la-procedure"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "universite-paris-dauphine-psl-paris",
    "motif": "bloc admission (voie Études en France ou procédure propre, calendrier, conditions, langue, frais de dossier), province, le 2026-09-25",
    "attendu": {
      "province": undefined,
      "admission": undefined
    },
    "champs": {
      "province": "Île-de-France",
      "admission": {
        "procedure": "Première année de licence avec un bac étranger : demande d'admission préalable sur Études en France. Licence 2 et 3, magistère et master 2 : dossier en ligne sur MyCandidature, le site de Dauphine ; certains masters 1 passent par la plateforme nationale. Un résident du Sénégal dépose aussi un dossier Études en France pour le visa.",
        "calendrier": "Rentrée 2026 : masters 1 sur MyCandidature du 15 janvier au 24 février 2026, masters 2 jusqu'au 23 février. Le calendrier 2027 n'est pas encore publié. Rentrée 2027 au Sénégal : dossier Études en France du 1er octobre au 15 décembre 2026, frais payés au plus tard le 19 décembre 2026, choix de la formation confirmé au plus tard le 31 mai 2027, selon Campus France Sénégal.",
        "conditions": "Première année : un baccalauréat étranger. Autres années : le diplôme du niveau précédent. Au Sénégal, un bac obtenu avec au plus une reprise ouvre le dossier Études en France ; avec un bac série arabe L-AR, il faut un niveau B2 certifié en français.",
        "langue": "Le niveau de français est vérifié dans le dossier ; les parcours en anglais demandent au moins B2 en anglais.",
        "fraisDossier": "Aucun frais de candidature propre à Dauphine. Le dossier Études en France coûte 85 000 francs CFA au Sénégal, non remboursables.",
        "sources": [
          "https://dauphine.psl.eu/international/venir-etudier-a-luniversite-paris-dauphine-psl/etudiants-internationaux/comment-postuler",
          "https://dauphine.psl.eu/formations/scolarite/droits-et-tarifs",
          "https://dauphine.psl.eu/faq",
          "https://www.senegal.campusfrance.org/calendrier-de-la-procedure"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "universite-paris-saclay-orsay",
    "motif": "bloc admission (voie Études en France ou procédure propre, calendrier, conditions, langue, frais de dossier), province, note de frais réécrite, montants ajoutés ou corrigés : licence, master, exonération réécrite (décret du 19 mai 2026), le 2026-09-25",
    "attendu": {
      "province": undefined,
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
        "detail": "Si vous êtes hors Union européenne et soumis aux droits différenciés, Paris-Saclay vous accorde une exonération partielle : vous payez le tarif national, comme un étudiant français. Vous pouvez aussi faire une demande complémentaire auprès de la commission d'exonération de votre composante (faculté ou école). Attention : cette décision date de février 2026, avant le plafond national de 30 % fixé en mai 2026. À confirmer auprès de l'université.",
        "source": "https://www.universite-paris-saclay.fr/admission/droits-dinscription-de-luniversite-paris-saclay",
        "verifieLe": "2026-09-13"
      },
      "admission": undefined
    },
    "champs": {
      "province": "Île-de-France",
      "fraisScolarite": {
        "source": "https://www.universite-paris-saclay.fr/admission/droits-dinscription-de-luniversite-paris-saclay",
        "verifieLe": "2026-09-25",
        "note": "Droits différenciés hors Union européenne, 2026-2027 : 2 902 € en licence, 3 950 € en master. En 2026-2027, l'université ramenait ces droits au tarif national, 178 € et 255 €, pour tous les étudiants concernés. Depuis le décret du 19 mai 2026, une exonération ne peut plus viser toute une catégorie d'étudiants : prévoyez le tarif plein. Doctorat : 398 €.",
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
        "detail": "En 2026-2027, Paris-Saclay accordait à tous les étudiants hors Union européenne une exonération partielle au tarif national. Pour une première inscription en 2027-2028, le décret du 19 mai 2026 ne laisse que des exonérations individuelles, sur demande et selon votre situation, dans la limite de 25 % des inscrits hors Union européenne.",
        "source": "https://www.universite-paris-saclay.fr/admission/droits-dinscription-de-luniversite-paris-saclay",
        "verifieLe": "2026-09-25"
      },
      "admission": {
        "procedure": "Première année de licence : candidature sur Études en France. Licence 2 et 3 : d'abord sur eCandidat. Master : d'abord sur la plateforme Inception, aux dates de chaque formation. Si vous êtes retenu, vous complétez Études en France, rubrique « je suis accepté », pour le visa.",
        "calendrier": "Master : dates d'ouverture propres à chaque formation sur Inception. Première année de licence : rentrée 2027 au Sénégal : dossier Études en France du 1er octobre au 15 décembre 2026, frais payés au plus tard le 19 décembre 2026, choix de la formation confirmé au plus tard le 31 mai 2027, selon Campus France Sénégal.",
        "conditions": "Première année : diplôme de fin d'études secondaires. Autres années : le diplôme du niveau précédent. Au Sénégal, un bac obtenu avec au plus une reprise ouvre le dossier Études en France ; avec un bac série arabe L-AR, il faut un niveau B2 certifié en français.",
        "langue": "Le niveau de français dépend de la formation ; il est indiqué sur sa fiche.",
        "fraisDossier": "Aucun frais propre à l'université. Le dossier Études en France coûte 85 000 francs CFA au Sénégal, non remboursables, payés à Campus France.",
        "sources": [
          "https://www.universite-paris-saclay.fr/admission/etudiants-internationaux/etudiants-internationaux-candidater-en-master",
          "https://www.universite-paris-saclay.fr/admissions/etudiants-internationaux-candidater-en-premier-cycle-licences",
          "https://www.universite-paris-saclay.fr/admission/droits-dinscription-de-luniversite-paris-saclay",
          "https://www.senegal.campusfrance.org/calendrier-de-la-procedure"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "universite-sorbonne-paris-nord-villetaneuse",
    "motif": "bloc admission (voie Études en France ou procédure propre, calendrier, conditions, langue, frais de dossier), province, note de frais réécrite, montants relus et inchangés, le 2026-09-25",
    "attendu": {
      "province": undefined,
      "admission": undefined,
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
      }
    },
    "champs": {
      "province": "Île-de-France",
      "admission": {
        "procedure": "Vous résidez au Sénégal : candidature sur Études en France. Première année de licence : demande d'admission préalable. Licence 3 et master : l'université est reliée à Études en France et répond par courriel.",
        "calendrier": "Rentrée 2027 au Sénégal : dossier Études en France du 1er octobre au 15 décembre 2026, frais payés au plus tard le 19 décembre 2026, choix de la formation confirmé au plus tard le 31 mai 2027, selon Campus France Sénégal.",
        "conditions": "Première année : un diplôme étranger de fin d'études secondaires. Autres années : le diplôme du niveau précédent. Au Sénégal, un bac obtenu avec au plus une reprise ouvre le dossier Études en France ; avec un bac série arabe L-AR, il faut un niveau B2 certifié en français.",
        "langue": "Le niveau de français est vérifié dans le dossier Études en France ; l'université ne publie pas de seuil général à jour.",
        "fraisDossier": "Aucun frais propre à l'université. Le dossier Études en France coûte 85 000 francs CFA au Sénégal, non remboursables, payés à Campus France.",
        "sources": [
          "https://ecogestion.univ-spn.fr/candidatures/",
          "https://www.univ-spn.fr/droits-de-scolarite/",
          "https://inscriptions.univ-spn.fr/exoneration/",
          "https://www.senegal.campusfrance.org/calendrier-de-la-procedure"
        ],
        "verifieLe": "2026-09-25"
      },
      "fraisScolarite": {
        "source": "https://inscriptions.univ-spn.fr/",
        "verifieLe": "2026-09-25",
        "note": "Année 2026-2027. L'université applique les droits différenciés aux étudiants hors Union européenne : 2 902 € en licence, 3 950 € en master. Une exonération partielle, au tarif national, se demande sur dossier en début d'année, dans la limite du plafond national. Doctorat : 398 €.",
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
      }
    }
  }
];

// Aucune université nouvelle, aucune bourse, aucun lien de programme.
export const UNIVERSITIES = [];
export const SCHOLARSHIPS = [];
export const LINKS = [];
