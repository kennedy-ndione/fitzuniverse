// ============================================================
// FitzUniverse — Lot 92 : CHINE, bloc admission des 16 fiches
// Recherche du 2026-09-25, sources officielles uniquement : sites des
// universités (bureaux et collèges des étudiants internationaux, guides
// d'admission 2026 et 2027, grilles de frais, PDF), topuniversities.com
// pour le seul classement mondial.
//
// POURQUOI
// Charles, le 2026-09-25 : « passe à la chine ». Même exigence que
// l'Italie : bloc admission complet sur les 16 fiches existantes, aucune
// université nouvelle. 16 PATCHES.
//
// MÉTHODE
// Quatre recherches parallèles (WebFetch) ont produit un brouillon ;
// TOUT ce qui entre ici a été RELU dans le Chrome de Charles le
// 2026-09-25 (pages et PDF lus avec pdf.js), sauf trois faits de
// l'université du Sichuan : global.scu.edu.cn refuse les adresses hors
// campus depuis Dakar (« réservé au réseau du campus »). Pour elle, la
// grille, les conditions et les pièces viennent de en.scu.edu.cn, relu
// au navigateur ; l'adresse du portail, les 600 yuans de frais de
// dossier et les périodes de candidature ont été lus sur global.scu par
// WebFetch, mot pour mot.
//
// CORRECTIONS DE FOND apportées par la relecture :
//   - Nankin : la note citait une ancienne page (njunju) ; grille
//     actuelle de l'école d'éducation internationale : licence 24 000,
//     master 28 000 (au lieu de 23 000), doctorat 35 000 yuans.
//   - SJTU : la licence d'ingénierie en français (SPEIT) coûte 65 000
//     yuans par an en 2026, pas 45 000 ; la licence en anglais à
//     80 000 n'existe nulle part (l'ingénierie en anglais 2027 est à
//     150 000). Les limites de 35 et 40 ans visent les bourses : retirées
//     des conditions générales (le brouillon les donnait à tous).
//   - Tsinghua : master ICPM 228 000 yuans (grille 2027), pas 158 000 ;
//     licences entièrement en anglais 100 000 yuans. Les montants du
//     master d'environnement et d'architecture, non retrouvés, sont
//     retirés de la note.
//   - USTC : il n'y a aucun frais de dossier (la note disait « non lus »).
//     La mention « licence uniquement en chinois », non retrouvée, est
//     retirée.
//   - Beihang : licence 25 000 et doctorat 42 000 yuans ajoutés (pages
//     lisibles aujourd'hui). Fudan : master 26 000 et doctorat 30 000 en
//     chinois ajoutés (guide 2026). Tianjin : licence 20 000 en anglais
//     et doctorat 33 200 ajoutés.
//   - SYSU : HSK 5 exigé en général, HSK 4 pour certaines licences
//     (le brouillon inversait).
//   - Notes des fiches existantes : faits non relus retirés (règles de
//     paiement de PKU, seuil de 20 inscrits à HIT, logements), capitales
//     et tirets longs supprimés, accents rétablis.
// Montants relus et INCHANGÉS : HIT, PKU, SJTU, Shanghai Maritime,
// Sichuan, SYSU, Tongji, Tsinghua, USTC, Wuhan, Xiamen, Zhejiang.
//
// Tongji : la grille est une page publiée en novembre 2023, complétée
// depuis (tarifs « 2025 Fall ») et toujours en ligne ; aucune grille 2026
// distincte. Gardée dans fraisScolarite, la note demande de faire
// confirmer le tarif.
//
// Classement : QS 2027 relu sur topuniversities (endpoint du classement,
// filtre Chine, 85 lignes) : huit rangs passent en « ex æquo ».
//
// NON TROUVÉ, donc NON ÉCRIT : aucun guide ne cite le baccalauréat
// sénégalais ni de règle propre aux pays africains (PKU cite le bac
// français, ce que la fiche dit) ; guides 2027 encore absents sauf
// Tsinghua, Nankin et la licence d'ingénierie en anglais de SJTU ;
// scores d'anglais généraux de Tsinghua et de l'USTC.
//
// `attendu` porte l'état lu dans l'export du 2026-09-25T03:57:34.431Z : les champs
// ajoutés sont ABSENTS (undefined), les champs remplacés sont recopiés
// entiers. Si quelqu'un est passé avant, le lot bloque au lieu
// d'écraser. Aucune photo dans ce lot.
// ============================================================

export const PATCHES = [
  {
    "collection": "universities",
    "id": "beihang-university-pekin",
    "motif": "bloc admission (campagne 2026 ou 2027, candidature, conditions, langue, frais de dossier), province, rang ex æquo, note de frais réécrite, montants ajoutés ou corrigés : licence, doctorat, le 2026-09-25",
    "attendu": {
      "province": undefined,
      "ranking": "#349 mondial (QS 2027)",
      "fraisScolarite": {
        "source": "https://is.buaa.edu.cn/en/lxsq/yjs/ssyjs.htm",
        "verifieLe": "2026-09-12",
        "note": "Master international : 35 000 ¥ (CNY) par an, plus 400 ¥ de frais de dossier et 800 ¥/an d'assurance ; logement 30 ¥/jour et par lit à Pékin. Licence et doctorat : pages non lues (adresses cassées) — montants à relever.",
        "master": {
          "montant": 35000,
          "devise": "CNY",
          "periode": "an"
        }
      },
      "admission": undefined
    },
    "champs": {
      "province": "Pékin",
      "ranking": "#349 mondial ex æquo (QS 2027)",
      "fraisScolarite": {
        "source": "https://is.buaa.edu.cn/en/lxsq/Undergraduate.htm",
        "verifieLe": "2026-09-25",
        "note": "Rentrée 2026, par an : licence 25 000 yuans dans la plupart des filières, 30 000 en génie biomédical, communication visuelle, peinture et pour les programmes en anglais ; master 35 000 ; doctorat 42 000. Assurance : 3 200 yuans pour les quatre ans de licence, 800 yuans par an en master et en doctorat. Frais de dossier 400 yuans. Montants retenus : le tarif le plus bas de chaque niveau.",
        "licence": {
          "montant": 25000,
          "devise": "CNY",
          "periode": "an"
        },
        "master": {
          "montant": 35000,
          "devise": "CNY",
          "periode": "an"
        },
        "doctorat": {
          "montant": 42000,
          "devise": "CNY",
          "periode": "an"
        }
      },
      "admission": {
        "procedure": "Candidature en ligne sur le système de l'école internationale, admission.buaa.edu.cn. Licence : passer d'abord le test CSCA, puis s'inscrire, déposer les pièces et payer les frais. Master et doctorat : dépôt en ligne du passeport, des diplômes, des relevés, du certificat de langue, de la lettre d'accord d'un futur directeur, d'un projet d'études, de deux lettres de recommandation, de la visite médicale et d'un extrait de casier judiciaire. La date d'arrivée figure sur l'avis d'admission.",
        "calendrier": "Rentrée 2026 : candidature du 1er novembre 2025 au 30 juin 2026 aux trois niveaux. Licence : pré-admissions en mars, avril et juin 2026, admission officielle en juillet, arrivée en août ou septembre. Master et doctorat : arrivée en septembre 2026. Le calendrier 2027 n'est pas encore publié.",
        "conditions": "Nationalité étrangère, passeport valide, bonne santé physique et mentale. Licence : diplôme de fin d'études secondaires et âge compris entre 18 et 22 ans. Master : licence et moins de 35 ans. Doctorat : master et moins de 40 ans.",
        "langue": "Programme en chinois : HSK 5 avec au moins 180 points, de moins de deux ans. Programme en anglais : en licence, TOEFL 90 ou IELTS 6 ; en master et en doctorat, IELTS académique 6.0, TOEFL 90 ou Duolingo 105, de moins de deux ans.",
        "fraisDossier": "400 yuans à chaque niveau, payés en ligne, non remboursables même en cas de refus.",
        "sources": [
          "https://is.buaa.edu.cn/en/lxsq/Undergraduate.htm",
          "https://is.buaa.edu.cn/en/lxsq/yjs/ssyjs.htm",
          "https://is.buaa.edu.cn/en/lxsq/yjs/bsyjs.htm"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "fudan-university-shanghai",
    "motif": "bloc admission (campagne 2026 ou 2027, candidature, conditions, langue, frais de dossier), province, note de frais réécrite, montants ajoutés ou corrigés : master, doctorat, le 2026-09-25",
    "attendu": {
      "province": undefined,
      "fraisScolarite": {
        "source": "https://iso.fudan.edu.cn/_upload/article/files/22/0d/d9cbe08947b29dfe2c7f3626e15e/efb0e74d-2f86-4b1a-a08a-7f4405bd7a9b.xlsx",
        "verifieLe": "2026-09-12",
        "note": "Grille 2026 des licences enseignées en chinois (fichier officiel de l'International Students Office) : lettres, droit, économie, gestion, sciences sociales 23 000 ¥/an ; sciences, informatique, ingénierie 26 000 ¥/an ; médecine, pharmacie, soins infirmiers 42 000 ¥/an. Montant retenu : 23 000 (majors « Arts »). Frais de dossier 800 ¥. Master et doctorat : non lus. « À titre indicatif, montant exact annoncé à l'inscription. »",
        "licence": {
          "montant": 23000,
          "devise": "CNY",
          "periode": "an"
        }
      },
      "admission": undefined
    },
    "champs": {
      "province": "Shanghai",
      "fraisScolarite": {
        "source": "https://iso.fudan.edu.cn/_upload/article/files/85/53/0b2ac02c4bf19b8c85786d147c4d/ee5986a3-fc7e-4de0-9e73-dfbf9da86888.pdf",
        "verifieLe": "2026-09-25",
        "note": "Rentrée 2026, par an. Licence en chinois : de 23 000 à 42 000 yuans selon la filière. Master en chinois : 26 000 yuans en lettres et sciences humaines, 30 000 en sciences, 48 000 en médecine ; doctorat en chinois : 30 000, 37 000 et 54 000. Master et doctorat en anglais : de 50 000 à 269 900 yuans selon le programme. Frais de dossier 800 yuans. Montants retenus : le tarif le plus bas en chinois.",
        "licence": {
          "montant": 23000,
          "devise": "CNY",
          "periode": "an"
        },
        "master": {
          "montant": 26000,
          "devise": "CNY",
          "periode": "an"
        },
        "doctorat": {
          "montant": 30000,
          "devise": "CNY",
          "periode": "an"
        }
      },
      "admission": {
        "procedure": "Candidature en ligne sur istudent.fudan.edu.cn, avec paiement des frais. Licence en chinois : passer d'abord le test CSCA, remplir le dossier, payer, passer un entretien, puis consulter le résultat de pré-admission ; l'avis d'admission se télécharge ensuite dans le système. Master et doctorat : l'école ou le département étudie le dossier et organise sa propre évaluation ; renseignez-vous auprès de lui.",
        "calendrier": "Licence en chinois, rentrée 2026 : du 1er au 15 janvier 2026, puis du 23 février au 6 mars 2026. Master et doctorat, rentrée 2026 : du 13 octobre au 12 décembre 2025, puis du 1er au 31 mars 2026. Arrivée fin août ou début septembre 2026. Le calendrier 2027 n'est pas encore publié.",
        "conditions": "Nationalité étrangère avec un passeport étranger, bonne santé physique et mentale, casier judiciaire vierge. Licence : fin d'études secondaires ; un candidat de moins de 18 ans au 1er septembre 2026 fournit une déclaration de garant. Master : licence. Doctorat : master. Les limites de 35 et 40 ans publiées ne visent que les bourses.",
        "langue": "Licence en chinois : HSK 5 avec 210 points ou HSK 6 avec 180 points, conseillé sans être exigé ; l'entretien évalue le chinois. Master et doctorat en chinois : HSK 5 avec 240 points en lettres et sciences sociales, 210 en sciences, ingénierie et médecine, ou HSK 6 avec 180. Programmes en anglais : TOEFL iBT 90, IELTS 6,5, Duolingo 110 ou PTE 61, sauf dispense.",
        "fraisDossier": "800 yuans, payés en ligne, non remboursables. Sans paiement, la candidature n'est pas valable.",
        "sources": [
          "https://iso.fudan.edu.cn/_upload/article/files/85/53/0b2ac02c4bf19b8c85786d147c4d/ee5986a3-fc7e-4de0-9e73-dfbf9da86888.pdf",
          "https://iso.fudan.edu.cn/_upload/article/files/35/40/7741664942a287bb86c6f5770e6d/da3b647f-fe8a-474a-82a9-1a8b68dc500f.pdf",
          "https://econ.fudan.edu.cn/liuxuesheng2026qiujizhaoshengjianzhang.pdf",
          "https://iso.fudan.edu.cn/isoenglish/wnlinewwpplication/list.htm"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "harbin-institute-of-technology-harbin",
    "motif": "bloc admission (campagne 2026 ou 2027, candidature, conditions, langue, frais de dossier), province, note de frais réécrite, montants relus et inchangés, le 2026-09-25",
    "attendu": {
      "province": undefined,
      "fraisScolarite": {
        "source": "https://cie.hit.edu.cn/18285/list.htm",
        "verifieLe": "2026-09-13",
        "note": "Guides d'admission 2026 du College de l'education internationale. Grille tres simple : un seul prix par niveau, decline en cursus EN CHINOIS et EN ANGLAIS, sans distinction de discipline. LICENCE (4-5 ans) : 20 000 CNY/an en chinois, 26 000 en anglais. MASTER (2-3 ans) : 28 000 en chinois, 34 000 en anglais ; seules les filieres gestion, materiaux, mecanique, genie civil, electricite-electronique et chimie-sciences du vivant sont ouvertes en anglais. DOCTORAT (4 ans) : 36 000 en chinois, 42 000 en anglais, toutes specialites ouvertes dans les deux langues. Frais de dossier 400 CNY (600 si candidature a la bourse HIT) ; assurance 800 CNY/an ; logement 800 a 1 000 CNY par mois et par lit. Justificatif financier exige : 20 000 CNY en licence, 30 000 en master et doctorat. ATTENTION : une classe en anglais n'ouvre qu'a partir de 20 inscrits en licence. Montants retenus : colonne ANGLAIS.",
        "licence": {
          "montant": 26000,
          "devise": "CNY",
          "periode": "an"
        },
        "master": {
          "montant": 34000,
          "devise": "CNY",
          "periode": "an"
        },
        "doctorat": {
          "montant": 42000,
          "devise": "CNY",
          "periode": "an"
        }
      },
      "admission": undefined
    },
    "champs": {
      "province": "Heilongjiang",
      "fraisScolarite": {
        "source": "https://studyathit.hit.edu.cn/18358/list.htm",
        "verifieLe": "2026-09-25",
        "note": "Rentrée 2026, par an, sans différence entre disciplines : licence 20 000 yuans en chinois, 26 000 en anglais ; master 28 000 et 34 000 ; doctorat 36 000 et 42 000. Frais de dossier 400 yuans, 600 si l'on demande aussi la bourse HIT ; assurance 800 yuans par an en master et en doctorat. Montants retenus : le cursus en anglais.",
        "licence": {
          "montant": 26000,
          "devise": "CNY",
          "periode": "an"
        },
        "master": {
          "montant": 34000,
          "devise": "CNY",
          "periode": "an"
        },
        "doctorat": {
          "montant": 42000,
          "devise": "CNY",
          "periode": "an"
        }
      },
      "admission": {
        "procedure": "Candidature en ligne sur hit.at0086.cn/student : remplir le formulaire, payer les frais de dossier par virement, puis déposer les pièces numérisées. En licence, passer d'abord le test CSCA et joindre son relevé de notes.",
        "calendrier": "Les autofinancés candidatent toute l'année. Pour la rentrée de septembre 2026 : clôture le 15 juillet 2026 en licence, le 31 mai 2026 en master et en doctorat. Le master n'a qu'une rentrée, en septembre.",
        "conditions": "Nationalité étrangère. Licence : diplôme de fin d'études secondaires et moins de 30 ans. Master : licence et moins de 35 ans. Doctorat : master et moins de 40 ans. Pour la bourse HIT, ces âges baissent de cinq ans.",
        "langue": "Programme en chinois : HSK 4 avec au moins 210 points, de moins de deux ans. Programme en anglais : IELTS académique 6.0 sans épreuve sous 5,5, ou TOEFL iBT 80.",
        "fraisDossier": "400 yuans ou 60 dollars ; 600 yuans ou 90 dollars pour qui demande aussi la bourse HIT. Les frais ne sont pas remboursés, sauf le logement.",
        "sources": [
          "https://studyathit.hit.edu.cn/18358/list.htm",
          "https://studyathit.hit.edu.cn/18359/list.htm",
          "https://studyathit.hit.edu.cn/18360/list.htm"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "nanjing-university-nanjing",
    "motif": "bloc admission (campagne 2026 ou 2027, candidature, conditions, langue, frais de dossier), province, rang ex æquo, note de frais réécrite, montants ajoutés ou corrigés : licence, master, doctorat, le 2026-09-25",
    "attendu": {
      "province": undefined,
      "ranking": "#90 mondial (QS 2027)",
      "fraisScolarite": {
        "source": "https://njunju.nju.edu.cn/EN/wpplicationwwnstructions_7082/list.htm",
        "verifieLe": "2026-09-13",
        "note": "Grille des etudiants internationaux en master : lettres et sciences humaines 19 000 CNY/an ; sciences et commerce 23 000 CNY/an ; Institut du logiciel 30 000 CNY/an ; faculte de medecine 40 000 CNY/an. Plus 400 CNY de frais d'inscription et 400 CNY d'assurance par semestre (800 CNY/an). Candidature du 1er mars au 20 mai, dossier a envoyer par courrier postal apres la saisie en ligne. HSK-5 exige en lettres et commerce, HSK-4 en sciences ; aucune exigence de chinois pour les programmes enseignes en anglais. Montant retenu : sciences et commerce. Ne pas confondre avec la grille des etudiants chinois du plan national (8 000 a 10 000 CNY/an), qui ne s'applique pas aux internationaux. Licence : grille non lue.",
        "master": {
          "montant": 23000,
          "devise": "CNY",
          "periode": "an"
        }
      },
      "admission": undefined
    },
    "champs": {
      "province": "Jiangsu",
      "ranking": "#90 mondial ex æquo (QS 2027)",
      "fraisScolarite": {
        "source": "https://hwxy.nju.edu.cn/English/StudyatNJU/Costs/Tuition/index.html",
        "verifieLe": "2026-09-25",
        "note": "Grille de l'école d'éducation internationale, par an : licence 21 000 yuans en lettres et sciences sociales, 24 000 en sciences, ingénierie et commerce, 42 000 en médecine ; master 25 000, 28 000 et 48 000 ; doctorat 30 000, 35 000 et 54 000. Les programmes enseignés en anglais ont leur propre tarif, sur la page de chaque programme. Frais de dossier 500 yuans en licence, 600 en master et en doctorat. Montants retenus : sciences, ingénierie et commerce.",
        "licence": {
          "montant": 24000,
          "devise": "CNY",
          "periode": "an"
        },
        "master": {
          "montant": 28000,
          "devise": "CNY",
          "periode": "an"
        },
        "doctorat": {
          "montant": 35000,
          "devise": "CNY",
          "periode": "an"
        }
      },
      "admission": {
        "procedure": "Licence : candidature en ligne sur istudy.nju.edu.cn, avec le relevé du test CSCA, exigé depuis 2026-2027 ; les frais se paient après la première sélection. Master et doctorat : candidature en ligne sur nju.17gz.org, avec visite médicale, diplômes et relevés ; certaines écoles font passer un écrit ou un entretien en ligne. L'université envoie l'avis d'admission par courriel et explique comment télécharger le formulaire JW202 pour le visa.",
        "calendrier": "Licence, rentrée d'automne 2027 : candidature du 1er mars au 15 mai 2027. Master et doctorat, rentrée 2027 : du 1er mars au 20 mai 2027. Le résultat arrive en général par message du système et par courriel.",
        "conditions": "Nationalité étrangère, bonne santé, passeport valide. Licence : fin d'études secondaires, de 18 à 30 ans, passeport valable au moins jusqu'au 1er mars 2028. Master : licence et moins de 40 ans. Doctorat : master et moins de 40 ans.",
        "langue": "Licence : toutes les filières sont enseignées en chinois, HSK 5 avec au moins 180 points. Master et doctorat en chinois : HSK 4 en sciences, ingénierie et médecine, HSK 5 en lettres, sciences sociales et commerce. Master en anglais : IELTS 6.0, TOEFL 85 ou Duolingo 100.",
        "fraisDossier": "500 yuans en licence, payés après la première sélection ; 600 yuans en master et en doctorat. Non remboursables.",
        "sources": [
          "https://hwxy.nju.edu.cn/lxnd/zsxx/bkxm/sbzn/20220627/i224176.html",
          "https://hwxy.nju.edu.cn/English/StudyatNJU/Admissions/MastersPrograms/index.html",
          "https://hwxy.nju.edu.cn/lxnd/zsxx/bsxm/DeclarationGuide/index.html",
          "https://hwxy.nju.edu.cn/English/StudyatNJU/Costs/Tuition/index.html"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "peking-university-beijing",
    "motif": "bloc admission (campagne 2026 ou 2027, candidature, conditions, langue, frais de dossier), province, note de frais réécrite, montants relus et inchangés, le 2026-09-25",
    "attendu": {
      "province": undefined,
      "fraisScolarite": {
        "source": "https://isd.pku.edu.cn/en/campus_detail.php?id=700",
        "verifieLe": "2026-09-13",
        "note": "Grille annuelle des etudiants internationaux a temps plein, en deux colonnes : lettres et sciences humaines / sciences. Licence 26 000 ou 30 000 CNY ; master 29 000 ou 33 000 CNY ; doctorat 32 000 ou 40 000 CNY. Les masters ENSEIGNES EN ANGLAIS et les programmes speciaux ont leur propre tarif, publie dans la brochure du programme : il est souvent tres superieur (jusqu'a plusieurs centaines de milliers de CNY pour les MBA). Montants retenus : la colonne sciences, la plus courante pour les candidats africains. Paiement integral exige le jour de l'inscription ; a defaut de reglement complet sous 30 jours, l'inscription est annulee d'office. Un semestre ou moins se paie une demi-annee ; plus d'un semestre se paie une annee pleine.",
        "licence": {
          "montant": 30000,
          "devise": "CNY",
          "periode": "an"
        },
        "master": {
          "montant": 33000,
          "devise": "CNY",
          "periode": "an"
        },
        "doctorat": {
          "montant": 40000,
          "devise": "CNY",
          "periode": "an"
        }
      },
      "admission": undefined
    },
    "champs": {
      "province": "Pékin",
      "fraisScolarite": {
        "source": "https://isd.pku.edu.cn/en/campus_detail.php?id=700",
        "verifieLe": "2026-09-25",
        "note": "Grille annuelle des étudiants internationaux à temps plein, lettres et sciences humaines ou sciences : licence 26 000 ou 30 000 yuans, master 29 000 ou 33 000, doctorat 32 000 ou 40 000. Les masters en anglais et les programmes spéciaux ont leur propre tarif, dans la brochure du programme. Frais de dossier 800 yuans par programme. Montants retenus : la colonne sciences.",
        "licence": {
          "montant": 30000,
          "devise": "CNY",
          "periode": "an"
        },
        "master": {
          "montant": 33000,
          "devise": "CNY",
          "periode": "an"
        },
        "doctorat": {
          "montant": 40000,
          "devise": "CNY",
          "periode": "an"
        }
      },
      "admission": {
        "procedure": "Candidature en ligne sur studyatpku.com. Licence : soit sans épreuve écrite, sur dossier et résultats d'un examen national reconnu, soit par l'examen écrit de l'université en chinois, anglais et mathématiques, fin mars 2026. Master et doctorat : dossier en ligne, deux programmes au plus, puis un second examen en mars, organisé par l'école. Fin juin, l'université envoie l'avis d'admission et le formulaire JW201 ou JW202.",
        "calendrier": "Rentrée 2026. Master et doctorat : du 20 octobre au 23 décembre 2025, dossier papier au plus tard le 31 mai 2026. Licence sans épreuve écrite : du 19 décembre 2025 au 28 février 2026, puis du 12 juin au 10 juillet 2026. Licence avec examen : du 1er janvier au 28 février 2026. Arrivée début septembre 2026.",
        "conditions": "Nationalité étrangère avec un passeport étranger valide, bonne santé physique et psychologique, casier judiciaire vierge. Licence : de 18 à 25 ans en principe. Master : licence. Doctorat : master. Pour la licence sans épreuve écrite, le baccalauréat français est accepté avec au moins 15 sur 20 ; le baccalauréat sénégalais ne figure pas dans la liste publiée.",
        "langue": "Licence en chinois : HSK 6 avec au moins 210 points. Master et doctorat en chinois : HSK 6 au-dessus de 200 points en sciences, de 210 en lettres, avec au moins 65 en expression écrite. Programmes en anglais : TOEFL iBT 100 ou GRE 315, ou un autre justificatif.",
        "fraisDossier": "800 yuans par programme demandé, payés en ligne, non remboursables.",
        "sources": [
          "https://isd.pku.edu.cn/en/detail.php?id=731",
          "https://isd.pku.edu.cn/en/detail.php?id=813",
          "https://isd.pku.edu.cn/en/detail.php?id=816",
          "https://isd.pku.edu.cn/en/detail.php?id=818"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "shanghai-jiao-tong-university-shanghai",
    "motif": "bloc admission (campagne 2026 ou 2027, candidature, conditions, langue, frais de dossier), province, note de frais réécrite, montants relus et inchangés, le 2026-09-25",
    "attendu": {
      "province": undefined,
      "fraisScolarite": {
        "source": "https://gk.sjtu.edu.cn/Data/View/1028",
        "verifieLe": "2026-09-13",
        "note": "Avis officiel du Centre des etudiants internationaux, confirme par le site de transparence de l'universite. SJTU applique un tarif UNIQUE pour toutes les disciplines, sans grille par groupe de matieres. LICENCE : 24 800 CNY/an pour le cursus standard EN CHINOIS ; 80 000 CNY/an pour la licence ENSEIGNEE EN ANGLAIS ; 45 000 CNY/an pour la licence enseignee en FRANCAIS a l'institut SPEIT, partenariat avec Polytechnique, Telecom Paris, ENSTA et Mines Paris — a signaler a un francophone. MASTER : 28 900 CNY/an, sans distinction de langue affichee ; MIB 50 000 et master de droit chinois 150 000 sur deux ans, ecartes. DOCTORAT : 45 500 CNY/an. Montant retenu en licence : 24 800, le tarif standard qui couvre la quasi-totalite des filieres. La derniere grille officielle lisible date de 2024-2025 ; frais de dossier, assurance et logement non lus.",
        "licence": {
          "montant": 24800,
          "devise": "CNY",
          "periode": "an"
        },
        "master": {
          "montant": 28900,
          "devise": "CNY",
          "periode": "an"
        },
        "doctorat": {
          "montant": 45500,
          "devise": "CNY",
          "periode": "an"
        }
      },
      "admission": undefined
    },
    "champs": {
      "province": "Shanghai",
      "fraisScolarite": {
        "source": "https://en.sjtu.edu.cn/study-sjtu/prospective/degree-programs/387",
        "verifieLe": "2026-09-25",
        "note": "Rentrée 2026, par an. Licence enseignée en chinois : 24 800 yuans ; Global Institute of Future Technology : 120 000. Licence d'ingénierie enseignée en français, avec l'institut SPEIT : 65 000 yuans. Licence d'ingénierie enseignée en anglais, rentrée 2027 : 150 000 yuans. Master en anglais : 28 900 yuans pour la plupart des programmes ; doctorat en anglais : 45 500. Frais de dossier 800 yuans. Montants retenus : le tarif courant de chaque niveau.",
        "licence": {
          "montant": 24800,
          "devise": "CNY",
          "periode": "an"
        },
        "master": {
          "montant": 28900,
          "devise": "CNY",
          "periode": "an"
        },
        "doctorat": {
          "montant": 45500,
          "devise": "CNY",
          "periode": "an"
        }
      },
      "admission": {
        "procedure": "Candidature en ligne sur apply.sjtu.edu.cn, avec paiement des frais. Licence en chinois : diplôme, relevés, résultats d'un test international ou d'un examen national, relevé du test CSCA et certificat HSK ; examen d'entrée en ligne, puis entretien. Licence d'ingénierie en français : examens oraux de physique et de mathématiques, puis entretien. Master et doctorat : projet d'études et deux lettres de recommandation de professeurs.",
        "calendrier": "Licence en chinois, rentrée 2026 : tour anticipé du 8 décembre 2025 au 5 février 2026, tour régulier du 6 février au 10 mars 2026, examen en ligne les 21 et 22 mars 2026 ; avis d'admission électronique à partir de juillet. Licence en français : du 7 janvier au 30 avril 2026. Master et doctorat : du 15 octobre 2025 au 31 mai 2026 pour les autofinancés. Licence d'ingénierie en anglais, rentrée 2027 : 1er novembre 2026, puis 31 mars 2027.",
        "conditions": "Nationalité étrangère avec un passeport étranger valide, bonne santé physique et mentale, casier judiciaire vierge. Licence : fin d'études secondaires. Master : licence. Doctorat : master. Les limites de 35 et 40 ans publiées visent les bourses.",
        "langue": "Licence en chinois : HSK 5 avec au moins 200 points, dont 60 à l'écrit, ou HSK 6. Licence en français : TCF, TEF, DELF ou DALF de niveau B2, ou français langue maternelle. Master et doctorat : en chinois, HSK 5 avec 200 points ou HSK 6 avec 180 ; en anglais, IELTS académique 6.0 sans épreuve sous 5,5, ou TOEFL iBT 85.",
        "fraisDossier": "800 yuans, non remboursables et non transférables. Licence d'ingénierie en anglais : 75 dollars, non remboursables.",
        "sources": [
          "https://en.sjtu.edu.cn/study-sjtu/prospective/degree-programs/387",
          "https://en.sjtu.edu.cn/study-sjtu/prospective/degree-programs/279",
          "https://en.sjtu.edu.cn/study-sjtu/prospective/degree-programs/267",
          "https://en.sjtu.edu.cn/study-sjtu/prospective/degree-programs/278",
          "https://en.sjtu.edu.cn/storage/global/web/en/page/2026/04/231be9845e3982dce795a7109d52a1f6.pdf"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "shanghai-maritime-university-shanghai",
    "motif": "bloc admission (campagne 2026 ou 2027, candidature, conditions, langue, frais de dossier), province, note de frais réécrite, montants relus et inchangés, le 2026-09-25",
    "attendu": {
      "province": undefined,
      "fraisScolarite": {
        "source": "https://en.shmtu.edu.cn/DoctoralPrograms/main.psp",
        "verifieLe": "2026-09-13",
        "note": "Pages officielles du site anglais, une par niveau : licence 20 000 CNY/an, master 23 000 CNY/an, doctorat 29 000 CNY/an sur 3 ans. Tarif UNIQUE par niveau, et — point notable par rapport aux autres universités chinoises du catalogue — AUCUN supplement pour l'enseignement en anglais : les pages listent des programmes en chinois (HSK 5 exige) et des programmes en anglais (IELTS 6.0, TOEFL 80 ou Cambridge B2) au meme prix. Frais de dossier 400 CNY, non remboursables. Calendrier 2026 : bourse du gouvernement chinois du 1er decembre au 1er fevrier, bourse du gouvernement de Shanghai jusqu'au 30 avril, autofinances jusqu'au 30 mai, rentree en septembre. Non lus : assurance, logement, et le document chinois des regles de tarification.",
        "licence": {
          "montant": 20000,
          "devise": "CNY",
          "periode": "an"
        },
        "master": {
          "montant": 23000,
          "devise": "CNY",
          "periode": "an"
        },
        "doctorat": {
          "montant": 29000,
          "devise": "CNY",
          "periode": "an"
        }
      },
      "admission": undefined
    },
    "champs": {
      "province": "Shanghai",
      "fraisScolarite": {
        "source": "https://en.shmtu.edu.cn/DoctoralPrograms/main.psp",
        "verifieLe": "2026-09-25",
        "note": "Rentrée 2026, un seul tarif par niveau : licence 20 000 yuans par an, master 23 000, doctorat 29 000. En master, le même tarif vaut pour les programmes en chinois et en anglais. Frais de dossier 400 yuans, non remboursables.",
        "licence": {
          "montant": 20000,
          "devise": "CNY",
          "periode": "an"
        },
        "master": {
          "montant": 23000,
          "devise": "CNY",
          "periode": "an"
        },
        "doctorat": {
          "montant": 29000,
          "devise": "CNY",
          "periode": "an"
        }
      },
      "admission": {
        "procedure": "Candidature en ligne sur gjy.shmtu.edu.cn, avec paiement des frais : sans paiement, le dossier n'est pas étudié. Pièces : formulaire, vidéo de présentation de cinq minutes au plus, diplômes, relevés, certificat de langue ; en licence, relevé du test CSCA avec les mathématiques. Étapes : examen du dossier, entretien préliminaire, entretien avec la faculté, puis lettre d'admission.",
        "calendrier": "Rentrée 2026 : les autofinancés candidatent du 1er décembre 2025 au 30 mai 2026. La rentrée a lieu chaque année en septembre, à la date écrite dans la lettre d'admission.",
        "conditions": "Licence : fin d'études secondaires, de 18 à 25 ans, bonne santé. Master : licence, moins de 35 ans, bonne santé. Doctorat : master, bonne santé.",
        "langue": "Programme en chinois : HSK 5. Programme en anglais : IELTS 6.0, TOEFL 80 ou Cambridge English B2, de moins de deux ans. Dispense possible pour une langue maternelle ou des études faites dans la langue du programme.",
        "fraisDossier": "400 yuans, soit environ 60 dollars, non remboursables et non transférables.",
        "sources": [
          "https://en.shmtu.edu.cn/UndergraduatePrograms/list.htm",
          "https://en.shmtu.edu.cn/MasterwsDegreePrograms/list.htm",
          "https://en.shmtu.edu.cn/DoctoralPrograms/main.psp"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "sichuan-university-chengdu",
    "motif": "bloc admission (campagne 2026 ou 2027, candidature, conditions, langue, frais de dossier), province, rang ex æquo, note de frais réécrite, montants relus et inchangés, le 2026-09-25",
    "attendu": {
      "province": undefined,
      "ranking": "#300 mondial (QS 2027)",
      "fraisScolarite": {
        "source": "https://en.scu.edu.cn/Admissions/Degree_Programs_for_International_Students/Bachelor_s/Fees.htm",
        "verifieLe": "2026-09-13",
        "note": "Trois pages officielles du site anglais, une par niveau. La grille est organisee par groupe de disciplines et NE distingue PAS le cursus en chinois du cursus en anglais : un seul prix par discipline. LICENCE : lettres, economie et gestion 17 500 ; sciences et ingenierie 22 000 ; pharmacie et sante publique 29 250 ; stomatologie 36 000 ; medecine clinique MBBS enseignee en anglais 45 000 ; arts et sport 45 000 ; archeologie 22 200. MASTER : 22 000 / 25 000 / 26 000 / 40 000 / 50 000 / 50 000 / 26 000 ; MBA 39 200 et master international de management de l'ingenierie 39 000, ecartes. DOCTORAT : 26 000 / 37 000 / 31 200 / 48 000 / 60 000 / 60 000 / 30 000. Montants retenus : sciences et ingenierie. Non lus : frais de dossier, assurance, logement, et l'annee de reference — les pages ne sont pas datees.",
        "licence": {
          "montant": 22000,
          "devise": "CNY",
          "periode": "an"
        },
        "master": {
          "montant": 25000,
          "devise": "CNY",
          "periode": "an"
        },
        "doctorat": {
          "montant": 37000,
          "devise": "CNY",
          "periode": "an"
        }
      },
      "admission": undefined
    },
    "champs": {
      "province": "Sichuan",
      "ranking": "#300 mondial ex æquo (QS 2027)",
      "fraisScolarite": {
        "source": "https://en.scu.edu.cn/Admissions/Admission_Requirements_for_Degree_Programs/Bachelor_s/Fees.htm",
        "verifieLe": "2026-09-25",
        "note": "Grille par groupe de disciplines, par an. Licence : lettres, économie et gestion 17 500 yuans ; sciences et ingénierie 22 000 ; pharmacie et santé publique 29 250 ; stomatologie 36 000 ; médecine clinique, arts et sport 45 000. Master : 22 000, 25 000, 26 000, 40 000 et 50 000 ; doctorat : 26 000, 37 000, 31 200, 48 000 et 60 000. Les pages ne sont pas datées. Montants retenus : sciences et ingénierie.",
        "licence": {
          "montant": 22000,
          "devise": "CNY",
          "periode": "an"
        },
        "master": {
          "montant": 25000,
          "devise": "CNY",
          "periode": "an"
        },
        "doctorat": {
          "montant": 37000,
          "devise": "CNY",
          "periode": "an"
        }
      },
      "admission": {
        "procedure": "Candidature en ligne sur le portail du bureau des étudiants étrangers, global.scu.edu.cn/oso, avec paiement des frais. Pièces : passeport, diplôme ou attestation de réussite, relevés, lettre de motivation, certificat de langue, visite médicale de moins de six mois, justificatif de ressources et extrait de casier judiciaire. Consultez souvent votre courriel, y compris les indésirables.",
        "calendrier": "Rentrée d'automne : licence du 1er janvier au 30 mai, master et doctorat du 1er novembre au 30 mai. La page n'indique pas d'année. Rentrée en général début septembre, ou début mars.",
        "conditions": "Nationalité étrangère, passeport étranger valide, bonne santé physique et mentale. Licence : au moins 18 ans et, en principe, moins de 25 ans. Master : de 18 à 40 ans. Doctorat : de 18 à 45 ans.",
        "langue": "Programme en chinois : HSK 5 avec au moins 180 points en licence et en master ; en doctorat, HSK 5 ou HSK 4 avec 180 points selon la discipline. Programme en anglais : TOEFL 80 ou IELTS 6.0, sauf langue maternelle anglaise.",
        "fraisDossier": "600 yuans, exigés aussi pour les demandes de bourse, non remboursables.",
        "sources": [
          "https://en.scu.edu.cn/Admissions/Admission_Requirements_for_Degree_Programs/Bachelor_s/Entry_Requirement.htm",
          "https://en.scu.edu.cn/Admissions/Admission_Requirements_for_Degree_Programs/Bachelor_s/Application.htm",
          "https://en.scu.edu.cn/Admissions/Admission_Requirements_for_Degree_Programs/Master_s/Entry_Requirement.htm",
          "https://en.scu.edu.cn/Admissions/Admission_Requirements_for_Degree_Programs/Doctoral/Entry_Requirement.htm",
          "https://global.scu.edu.cn/oso/article/index/1084",
          "https://global.scu.edu.cn/oso/article/index/1111"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "sun-yat-sen-university-guangzhou",
    "motif": "bloc admission (campagne 2026 ou 2027, candidature, conditions, langue, frais de dossier), province, rang ex æquo, note de frais réécrite, montants relus et inchangés, le 2026-09-25",
    "attendu": {
      "province": undefined,
      "ranking": "#258 mondial (QS 2027)",
      "fraisScolarite": {
        "source": "https://iso.sysu.edu.cn/en/application/selffunded/1420582.htm",
        "verifieLe": "2026-09-13",
        "note": "Guides d'admission officiels 2026 du Bureau des affaires des etudiants internationaux, un par niveau. Un seul prix par groupe de disciplines, sans colonne separee chinois/anglais. LICENCE : lettres et sciences humaines 26 000 ; sciences, ingenierie et agronomie 33 800 ; medecine 48 000. MASTER : 30 000 / 39 000 / 55 000 ; IMBA 109 000, ecarte. DOCTORAT : 34 000 / 44 200 / 65 000. A noter : ces montants 2026 correspondent exactement a l'ancienne colonne « programmes en anglais » de la grille detaillee de SYSU, qui affichait encore 30 000 en chinois contre 33 800 en anglais — les deux semblent donc avoir ete alignes. Frais de dossier 400 CNY par niveau, non remboursables ; assurance obligatoire 800 CNY/an. Montants retenus : sciences, ingenierie et agronomie, le groupe le plus large. Non lue : la grille annuelle officielle a laquelle les guides renvoient comme reference finale.",
        "licence": {
          "montant": 33800,
          "devise": "CNY",
          "periode": "an"
        },
        "master": {
          "montant": 39000,
          "devise": "CNY",
          "periode": "an"
        },
        "doctorat": {
          "montant": 44200,
          "devise": "CNY",
          "periode": "an"
        }
      },
      "admission": undefined
    },
    "champs": {
      "province": "Guangdong",
      "ranking": "#258 mondial ex æquo (QS 2027)",
      "fraisScolarite": {
        "source": "https://iso.sysu.edu.cn/en/application/selffunded/1420582.htm",
        "verifieLe": "2026-09-25",
        "note": "Guides de la rentrée 2026, un prix par groupe de disciplines, par an. Licence : lettres 26 000 yuans, sciences 33 800, médecine 48 000. Master : 30 000, 39 000 et 55 000 ; IMBA 109 000. Doctorat : 34 000, 44 200 et 65 000. Frais de dossier 400 yuans. Montants retenus : sciences et ingénierie.",
        "licence": {
          "montant": 33800,
          "devise": "CNY",
          "periode": "an"
        },
        "master": {
          "montant": 39000,
          "devise": "CNY",
          "periode": "an"
        },
        "doctorat": {
          "montant": 44200,
          "devise": "CNY",
          "periode": "an"
        }
      },
      "admission": {
        "procedure": "Candidature en ligne sur apply.sysu.edu.cn : remplir le dossier, déposer les pièces et payer les frais ; sans paiement, la candidature n'est pas examinée. En licence, joindre le relevé du test CSCA. L'université vérifie le dossier, invite les candidats retenus à un entretien, puis publie la pré-admission ; l'avis d'admission se télécharge à partir de juillet 2026.",
        "calendrier": "Rentrée 2026, deux tours. Licence : du 1er janvier au 28 février, puis du 1er mars au 30 avril 2026. Master et doctorat : du 1er janvier au 15 février, puis du 16 février au 30 avril 2026. Arrivée fin août ou début septembre 2026.",
        "conditions": "Nationalité étrangère avec un passeport étranger valable au moins jusqu'au 1er décembre 2026. Licence : fin d'études secondaires ou équivalent. Master : licence. Doctorat : master. Les limites d'âge ne visent que les bourses.",
        "langue": "Programme en chinois : HSK 5 avec au moins 180 points ; HSK 4 avec 180 points pour certaines licences enseignées en chinois. Master et doctorat en anglais : TOEFL iBT 79, sans épreuve sous 15, ou IELTS académique 6,5, sans épreuve sous 5,5.",
        "fraisDossier": "400 yuans, non remboursables une fois payés.",
        "sources": [
          "https://iso.sysu.edu.cn/en/application/selffunded/1420575.htm",
          "https://iso.sysu.edu.cn/en/application/selffunded/1420582.htm",
          "https://iso.sysu.edu.cn/en/application/selffunded/1420584.htm"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "tianjin-university-tianjin",
    "motif": "bloc admission (campagne 2026 ou 2027, candidature, conditions, langue, frais de dossier), province, rang ex æquo, note de frais réécrite, montants ajoutés ou corrigés : licence, doctorat, le 2026-09-25",
    "attendu": {
      "province": undefined,
      "ranking": "#235 mondial (QS 2027)",
      "fraisScolarite": {
        "source": "https://sie.tju.edu.cn/en/xwxm/MASTERPROGRAMS/202510/t20251013_324447.html",
        "verifieLe": "2026-09-13",
        "note": "Master international : 24 900 ¥/an en chinois, 30 000 ¥/an en anglais ; architecture 31 000 / 39 000 ¥ ; MBA 39 000 ¥. Plus 420 ¥ de frais de dossier (offerts aux boursiers CSC), 800 ¥/an d'assurance, 15 à 60 ¥/jour de logement. Sur 104 masters, 29 sont enseignés en anglais (IELTS 6.0 ou TOEFL 80 ; HSK-5 pour le chinois). Montant retenu : le cursus en anglais, plus probable pour un étudiant francophone. Licence : non lue.",
        "master": {
          "montant": 30000,
          "devise": "CNY",
          "periode": "an"
        }
      },
      "admission": undefined
    },
    "champs": {
      "province": "Tianjin",
      "ranking": "#235 mondial ex æquo (QS 2027)",
      "fraisScolarite": {
        "source": "https://sie.tju.edu.cn/en/xwxm/MASTERPROGRAMS/202510/t20251013_324447.html",
        "verifieLe": "2026-09-25",
        "note": "Rentrée 2026, par an. Licence : 16 600 yuans en chinois, 20 000 en anglais ; architecture, génie logiciel et urbanisme 26 000. Master : 24 900 en chinois, 30 000 en anglais ; architecture 31 000 ou 39 000 ; MBA 39 000. Doctorat : 33 200 ; architecture 39 000. Frais de dossier 420 yuans ; assurance 800 yuans par an. Montants retenus : le cursus en anglais, et le tarif général en doctorat.",
        "licence": {
          "montant": 20000,
          "devise": "CNY",
          "periode": "an"
        },
        "master": {
          "montant": 30000,
          "devise": "CNY",
          "periode": "an"
        },
        "doctorat": {
          "montant": 33200,
          "devise": "CNY",
          "periode": "an"
        }
      },
      "admission": {
        "procedure": "Candidature en ligne sur tju.at0086.cn/student, selon le calendrier. Licence : passer le test CSCA et envoyer le résultat avant le 20 mai 2026, puis un entretien ; les admis versent un dépôt de 7 000 yuans et les frais de dossier dans le délai fixé. Master et doctorat : entretiens de février à juin 2026. L'université envoie ensuite l'avis d'admission et le formulaire de demande de visa.",
        "calendrier": "Rentrée 2026. Licence : du 15 octobre 2025 au 15 avril 2026. Master : du 15 octobre 2025 au 31 mai 2026. Doctorat : du 1er octobre 2025 au 31 mai 2026. Inscription en général fin août ou début septembre.",
        "conditions": "Bonne santé et bonne moralité. Licence : fin d'études secondaires et moins de 25 ans. Master : licence et moins de 35 ans. Doctorat : master et moins de 40 ans.",
        "langue": "Programme en chinois : HSK 5 avec au moins 180 points, ou HSK 4 avec 180 points pour les programmes de l'école d'éducation internationale. Programme en anglais : IELTS 6.0 ou TOEFL 80 ; pour le MBA, IELTS 6.5 ou TOEFL 85.",
        "fraisDossier": "420 yuans, non remboursables ; les boursiers du gouvernement chinois en sont dispensés. En licence, les admis versent aussi un dépôt de 7 000 yuans, non remboursable.",
        "sources": [
          "https://sie.tju.edu.cn/en/xwxm/UNDERGRADUATE/202510/t20251013_324445.html",
          "https://sie.tju.edu.cn/en/xwxm/MASTERPROGRAMS/202510/t20251013_324447.html",
          "https://sie.tju.edu.cn/en/xwxm/DOCTORALPROGRAMS/202510/t20251013_324449.html"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "tongji-university-shanghai",
    "motif": "bloc admission (campagne 2026 ou 2027, candidature, conditions, langue, frais de dossier), province, note de frais réécrite, montants relus et inchangés, le 2026-09-25",
    "attendu": {
      "province": undefined,
      "fraisScolarite": {
        "source": "https://study.tongji.edu.cn/en/info/1062/1226.htm",
        "verifieLe": "2026-09-13",
        "note": "Tableau officiel du Bureau des etudiants internationaux, avec une colonne « Teaching Language » qui distingue clairement le chinois et l'anglais. LICENCE en chinois : sciences 24 600 ; lettres 20 000 ; architecture, medecine et arts 28 700. LICENCE en anglais : classe internationale d'architecture et d'urbanisme 33 800 ; genie civil 35 000 ; MBBS 45 000. MASTER en chinois : sciences 28 700 ; lettres 22 960 ; architecture et medecine 32 800. MASTER en anglais : environnement et genie logiciel 39 000 ; genie ferroviaire, civil, geologie, micro-electronique 40 000 ; transports 25 080 ; IMBA 154 000 et sciences de gestion 79 000, ecartes. DOCTORAT en chinois : sciences 41 000 ; lettres 30 000 ; architecture et medecine 45 000. DOCTORAT en anglais : de 30 800 a 50 000 selon le domaine. Frais de dossier 600 CNY ; assurance 800 CNY/an. Montants retenus : ligne « sciences » en chinois, seule categorie generale couvrant l'ensemble des filieres scientifiques ; cote anglais il n'existe pas de tarif unique mais des prix par programme, cites ci-dessus. Page datee de 2023, aucune grille 2026 distincte trouvee.",
        "licence": {
          "montant": 24600,
          "devise": "CNY",
          "periode": "an"
        },
        "master": {
          "montant": 28700,
          "devise": "CNY",
          "periode": "an"
        },
        "doctorat": {
          "montant": 41000,
          "devise": "CNY",
          "periode": "an"
        }
      },
      "admission": undefined
    },
    "champs": {
      "province": "Shanghai",
      "fraisScolarite": {
        "source": "https://study.tongji.edu.cn/en/info/1062/1226.htm",
        "verifieLe": "2026-09-25",
        "note": "Grille du bureau des étudiants internationaux, publiée en novembre 2023 et toujours en ligne, par an. Licence en chinois : sciences 24 600 yuans, lettres 20 000, architecture, médecine et arts 28 700. Licence en anglais : architecture et urbanisme 33 800, génie civil 35 000, médecine 45 000. Master en chinois : 28 700, 22 960 et 32 800 ; doctorat en chinois : 41 000, 30 000 et 45 000. En anglais, chaque master et chaque doctorat a son prix. Frais de dossier 600 yuans. Montants retenus : sciences, en chinois. Faites confirmer le tarif avant de payer.",
        "licence": {
          "montant": 24600,
          "devise": "CNY",
          "periode": "an"
        },
        "master": {
          "montant": 28700,
          "devise": "CNY",
          "periode": "an"
        },
        "doctorat": {
          "montant": 41000,
          "devise": "CNY",
          "periode": "an"
        }
      },
      "admission": {
        "procedure": "Candidature en ligne sur study-info.tongji.edu.cn, avec paiement des frais de dossier. Le dossier est d'abord étudié, puis la faculté organise un entretien. En licence, joindre le relevé du test CSCA. Un autofinancé retenu prépaie un semestre de frais de scolarité dans le délai indiqué, sinon il perd sa place ; les documents d'admission officiels arrivent ensuite.",
        "calendrier": "Rentrée d'automne 2026. Licence : du 20 janvier au 31 mars 2026. Master et doctorat autofinancés : du 25 octobre au 20 décembre 2025 ; en master, second tour du 10 janvier au 20 mars 2026.",
        "conditions": "Nationalité étrangère et bonne santé. Licence : fin d'études secondaires, de 18 à 35 ans au 31 décembre de l'année de candidature, passeport valable au moins jusqu'au 1er mars 2027. Master : 45 ans au plus pour un autofinancé. Doctorat : 50 ans au plus pour un autofinancé.",
        "langue": "Programme en chinois : HSK 5 avec au moins 180 points. Master en anglais : TOEFL iBT 80, IELTS 6.0 ou preuve d'études faites en anglais.",
        "fraisDossier": "600 yuans, payés en ligne, non remboursables.",
        "sources": [
          "https://study.tongji.edu.cn/__local/3/31/29/5548C243E9F9B76ACEB35E3A6BC_C30B8827_37323.pdf",
          "https://study.tongji.edu.cn/en/info/1014/1044.htm",
          "https://study.tongji.edu.cn/en/ADMISSION/Doctoral_Programs/Enrollment_Guide.htm",
          "https://study.tongji.edu.cn/tongjidaxueguojixueshengzifeixuelixiangmuxuefeizhifuzhinan.pdf"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "tsinghua-university-pekin",
    "motif": "bloc admission (campagne 2026 ou 2027, candidature, conditions, langue, frais de dossier), province, note de frais réécrite, montants relus et inchangés, le 2026-09-25",
    "attendu": {
      "province": undefined,
      "fraisScolarite": {
        "source": "https://international.join-tsinghua.edu.cn/Admission1/Fees.htm",
        "verifieLe": "2026-09-13",
        "note": "Grille officielle 2026. LICENCE (cursus sino-anglais) : ingenierie, informatique, automatique, maths, physique, chimie, sciences du vivant et architecture 30 000 CNY ; economie, finance, gestion et droit 26 000 ; arts 40 000 ; medecine clinique 40 000 a 70 000. MASTER : sciences, ingenierie et medecine 33 000 ; economie et gestion 30 000 ; philosophie, droit, education, lettres et histoire 28 000. DOCTORAT : sciences, ingenierie, medecine 40 000 ; economie-gestion 40 000 ; lettres, droit, education 32 000. ATTENTION, PIEGE DE LANGUE : les programmes 100 % ANGLAIS sont tarifes a part, souvent au forfait — master en sciences de l'environnement 39 000 CNY/an, master d'architecture 120 000 CNY au total, master ICPM de genie civil 158 000 au total. MBA et EMBA de 128 000 a 828 000, ecartes. Frais de dossier 800 CNY, assurance 800 CNY/an. Montants retenus : le groupe sciences et ingenierie de la grille generale.",
        "licence": {
          "montant": 30000,
          "devise": "CNY",
          "periode": "an"
        },
        "master": {
          "montant": 33000,
          "devise": "CNY",
          "periode": "an"
        },
        "doctorat": {
          "montant": 40000,
          "devise": "CNY",
          "periode": "an"
        }
      },
      "admission": undefined
    },
    "champs": {
      "province": "Pékin",
      "fraisScolarite": {
        "source": "https://international.join-tsinghua.edu.cn/Admission1/Fees.htm",
        "verifieLe": "2026-09-25",
        "note": "Licence, par an : cursus sino-anglais 30 000 yuans en ingénierie, informatique, sciences et architecture, 26 000 en économie, finance, gestion et droit, 40 000 en arts ; médecine clinique de 40 000 à 70 000 ; licences entièrement en anglais du Zijing College : 100 000. Master et doctorat, grille 2027 : master 33 000 en sciences, ingénierie et médecine, 30 000 en économie et gestion, 28 000 en lettres, droit et éducation ; doctorat 40 000, 40 000 et 32 000. Certains programmes en anglais sont au forfait, comme le master ICPM à 228 000 yuans. Frais de dossier 800 yuans. Montants retenus : sciences et ingénierie.",
        "licence": {
          "montant": 30000,
          "devise": "CNY",
          "periode": "an"
        },
        "master": {
          "montant": 33000,
          "devise": "CNY",
          "periode": "an"
        },
        "doctorat": {
          "montant": 40000,
          "devise": "CNY",
          "periode": "an"
        }
      },
      "admission": {
        "procedure": "Licence : créer un compte sur le système de candidature, remplir le formulaire, déposer les pièces et payer les frais ; les candidats retenus après l'étude du dossier passent une évaluation complète, avec un portfolio en arts et en architecture. Master et doctorat : candidature sur yzbm.tsinghua.edu.cn ; l'évaluation repose en général sur un entretien, fixé par chaque faculté. Tsinghua délivre ensuite le certificat d'admission et son annexe.",
        "calendrier": "Licence, rentrée 2027 : premier tour du 30 septembre au 20 novembre 2026, second tour du 21 novembre 2026 au 28 février 2027. Master et doctorat, rentrée 2027 : système ouvert de mi-septembre 2026 à février 2027, avec des dates propres à chaque faculté. Arrivée en général fin août ou début septembre.",
        "conditions": "Nationalité étrangère, sans nationalité chinoise. Licence : diplôme de fin d'études secondaires obtenu à temps plein et en présentiel, au moins 18 ans au 1er septembre 2027 ou un garant, et résultats d'un test international ou d'un examen national, par exemple le CSCA ou le SAT. Master : licence. Doctorat : master.",
        "langue": "Licence en chinois : HSK 5 ou plus, avec plus de 60 points en écoute, lecture et écriture. Licence en anglais : un test d'anglais officiel, TOEFL ou IELTS, sans score minimum publié. Master et doctorat : niveau fixé par chaque faculté dans son catalogue.",
        "fraisDossier": "800 yuans, non remboursables quel que soit le résultat.",
        "sources": [
          "https://international.join-tsinghua.edu.cn/Admission1/Eligibility.htm",
          "https://international.join-tsinghua.edu.cn/Admission1/Schedule.htm",
          "https://international.join-tsinghua.edu.cn/Admission1/Application_Procedures.htm",
          "https://yz.tsinghua.edu.cn/en/info/1035/1581.htm",
          "https://yzbm.tsinghua.edu.cn/publish/s05/s0501/detail/bb745c8c-e817-4532-8cc1-70fa21bae1b5"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "university-of-science-and-technology-of-china-hefei",
    "motif": "bloc admission (campagne 2026 ou 2027, candidature, conditions, langue, frais de dossier), province, rang ex æquo, note de frais réécrite, montants relus et inchangés, le 2026-09-25",
    "attendu": {
      "province": undefined,
      "ranking": "#134 mondial (QS 2027)",
      "fraisScolarite": {
        "source": "https://en.ustc.edu.cn/info/1058/1129.htm",
        "verifieLe": "2026-09-13",
        "note": "Guides d'admission du College international, campagne 2026 (candidature du 14 novembre 2025 au 31 mars 2026), montants confirmes par la page anglaise officielle. Tarif UNIQUE par niveau, sans grille par discipline. LICENCE : 26 000 CNY/an sur 4 ans, 13 specialites et 35 programmes ouverts aux internationaux. ATTENTION, POINT DECISIF POUR UN FRANCOPHONE : la licence est enseignee UNIQUEMENT EN CHINOIS et exige le HSK niveau 5 ; il n'existe aucun tarif anglophone. MASTER : 30 000 CNY/an (le MBA est a 150 000 CNY pour le programme, ecarte). DOCTORAT : 35 000 CNY/an. Assurance 800 CNY/an ; logement 500 a 1 000 CNY/mois. Non lus : les frais de dossier et la liste des programmes de master et doctorat enseignes en anglais.",
        "licence": {
          "montant": 26000,
          "devise": "CNY",
          "periode": "an"
        },
        "master": {
          "montant": 30000,
          "devise": "CNY",
          "periode": "an"
        },
        "doctorat": {
          "montant": 35000,
          "devise": "CNY",
          "periode": "an"
        }
      },
      "admission": undefined
    },
    "champs": {
      "province": "Anhui",
      "ranking": "#134 mondial ex æquo (QS 2027)",
      "fraisScolarite": {
        "source": "https://ic.ustc.edu.cn/?abroad=75",
        "verifieLe": "2026-09-25",
        "note": "Un tarif par niveau, sans grille par discipline : licence 26 000 yuans par an, master 30 000, doctorat 35 000 ; MBA 150 000 pour le programme. Assurance 800 yuans par an ; chambre sur le campus de 500 à 1 000 yuans par mois. La candidature en ligne est sans frais.",
        "licence": {
          "montant": 26000,
          "devise": "CNY",
          "periode": "an"
        },
        "master": {
          "montant": 30000,
          "devise": "CNY",
          "periode": "an"
        },
        "doctorat": {
          "montant": 35000,
          "devise": "CNY",
          "periode": "an"
        }
      },
      "admission": {
        "procedure": "Candidature en ligne sur isa.ustc.edu.cn : créer un compte, remplir le dossier et déposer les pièces. En master et en doctorat, pas besoin de trouver un directeur de recherche avant de candidater ; les écoles étudient les dossiers et organisent des entretiens en ligne, puis le résultat arrive par courriel.",
        "calendrier": "Master et doctorat, rentrée 2026 : candidature du 16 octobre 2025 au 31 janvier 2026, entretiens en février ou mars, admission en juin ou juillet. Licence : la bourse de l'université se demande du 14 novembre 2025 au 31 mars 2026.",
        "conditions": "Nationalité étrangère, bonne santé. Licence : fin d'études secondaires, sans limite d'âge ; un candidat mineur fournit l'attestation d'un tuteur légal en Chine. Master : moins de 40 ans au 1er septembre 2026. Doctorat : moins de 45 ans.",
        "langue": "Licence : HSK 5 avec plus de 60 points à chaque épreuve. Master et doctorat en chinois : HSK 4 ou plus. Programmes en anglais : un justificatif de niveau d'anglais, sans score minimum publié.",
        "fraisDossier": "Aucun : l'université ne fait pas payer la candidature en ligne.",
        "sources": [
          "https://ic.ustc.edu.cn/?abroad=75",
          "https://ic.ustc.edu.cn/?abroad=4791",
          "https://ic.ustc.edu.cn/?abroad=faq",
          "https://ic.ustc.edu.cn/?abroad=ustc-fellowship-for-undergraduate-programs"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "wuhan-university-wuhan",
    "motif": "bloc admission (campagne 2026 ou 2027, candidature, conditions, langue, frais de dossier), province, rang ex æquo, note de frais réécrite, montants relus et inchangés, le 2026-09-25",
    "attendu": {
      "province": undefined,
      "ranking": "#165 mondial (QS 2027)",
      "fraisScolarite": {
        "source": "https://admission.whu.edu.cn/FRESHMEN_RELATED/FEES.htm",
        "verifieLe": "2026-09-13",
        "note": "Page officielle du College de l'education internationale. La grille distingue explicitement le cursus EN CHINOIS et le cursus EN ANGLAIS a chaque niveau. Sciences et ingenierie : licence 24 000 en chinois / 28 000 en anglais ; master 28 000 / 38 000 ; doctorat 40 000 / 46 000. Lettres et sciences humaines : 20 000 / 23 000, 23 000 / 33 000, 30 000 / 36 000. Medecine et stomatologie : 30 000 / 40 000, 38 000 / 50 000, 45 000 / 55 000. Frais de dossier 800 CNY ou 111 USD ; assurance 1 000 CNY/an ; visite medicale environ 300 ; permis de sejour 400 a 1 000 ; manuels 200 a 1 000/an. Montants retenus : colonne ANGLAIS du groupe sciences et ingenierie, le cursus accessible a un francophone. La page lue ne porte pas d'annee explicite et le fichier Word joint au guide 2026 n'a pas pu etre ouvert.",
        "licence": {
          "montant": 28000,
          "devise": "CNY",
          "periode": "an"
        },
        "master": {
          "montant": 38000,
          "devise": "CNY",
          "periode": "an"
        },
        "doctorat": {
          "montant": 46000,
          "devise": "CNY",
          "periode": "an"
        }
      },
      "admission": undefined
    },
    "champs": {
      "province": "Hubei",
      "ranking": "#165 mondial ex æquo (QS 2027)",
      "fraisScolarite": {
        "source": "https://admission.whu.edu.cn/FRESHMEN_RELATED/FEES.htm",
        "verifieLe": "2026-09-25",
        "note": "Grille par an, cursus en chinois ou en anglais. Sciences et ingénierie : licence 24 000 ou 28 000 yuans, master 28 000 ou 38 000, doctorat 40 000 ou 46 000. Lettres : 20 000 ou 23 000, 23 000 ou 33 000, 30 000 ou 36 000. Médecine et stomatologie : 30 000 ou 40 000, 38 000 ou 50 000, 45 000 ou 55 000. Frais de dossier 800 yuans. La page n'est pas datée. Montants retenus : sciences et ingénierie, en anglais.",
        "licence": {
          "montant": 28000,
          "devise": "CNY",
          "periode": "an"
        },
        "master": {
          "montant": 38000,
          "devise": "CNY",
          "periode": "an"
        },
        "doctorat": {
          "montant": 46000,
          "devise": "CNY",
          "periode": "an"
        }
      },
      "admission": {
        "procedure": "Candidature en ligne sur admission.whu.edu.cn, frais payés en ligne dans les sept jours. Pièces : passeport, diplômes, relevés, certificat de langue et justificatif de ressources d'au moins 5 000 dollars ; en licence, relevé du test CSCA ; en master et en doctorat, deux lettres de recommandation de professeurs. Après l'étude du dossier : entretien et examen d'entrée, puis avis d'admission et demande de visa X1 ou X2.",
        "calendrier": "Rentrée d'automne 2026 : licence du 1er octobre 2025 au 30 juin 2026 ; master et doctorat du 1er décembre 2025 au 15 juin 2026. Inscription en général d'août à septembre.",
        "conditions": "Licence : fin d'études secondaires et, en général, de 18 à 30 ans au 1er septembre 2026. Master : licence et, en général, 35 ans au plus. Doctorat : master et, en général, 45 ans au plus.",
        "langue": "Programme en chinois : nouveau HSK 4 avec au moins 180 points. Programme en anglais : TOEFL 80, TOEFL Essentials 8 ou IELTS 6.0.",
        "fraisDossier": "800 yuans ou 111 dollars, à payer en ligne dans les sept jours suivant la candidature.",
        "sources": [
          "https://admission.whu.edu.cn/info/1121/5802.htm",
          "https://admission.whu.edu.cn/info/1131/5822.htm",
          "https://admission.whu.edu.cn/FRESHMEN_RELATED/FEES.htm"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "xiamen-university-xiamen",
    "motif": "bloc admission (campagne 2026 ou 2027, candidature, conditions, langue, frais de dossier), province, rang ex æquo, note de frais réécrite, montants relus et inchangés, le 2026-09-25",
    "attendu": {
      "province": undefined,
      "ranking": "#303 mondial (QS 2027)",
      "fraisScolarite": {
        "source": "https://admissions.xmu.edu.cn/Admissions/Costs.htm",
        "verifieLe": "2026-09-13",
        "note": "Page officielle « Study Costs » du bureau des admissions. La grille croise deux groupes de disciplines — lettres d'un cote, sciences, ingenierie, medecine, economie, gestion, droit et arts de l'autre — avec la langue d'enseignement. LICENCE : cursus en chinois 24 000 (lettres) et 26 000 (sciences). Il n'existe PAS de licence generaliste en anglais : seules la medecine MBBS en anglais (38 000) et trois filieres de design en anglais (90 000) sont proposees. MASTER : en chinois 26 000 / 30 000 ; programme international EN ANGLAIS, sur 2 ans, 39 000 (lettres) / 45 000 (sciences). DOCTORAT : en chinois 30 000 / 34 000 ; programme international EN ANGLAIS 42 000 / 55 000. Frais de dossier 400 CNY ; assurance 800 CNY/an ; manuels 400 a 700/an ; logement de 35 a 65 CNY/jour a Siming, 1 600 a 4 000/an a Xiang'an. POINT UTILE : les doctorants sont EXONERES de frais de scolarite pendant leur 4e annee. Montants retenus : programme international en anglais pour le master et le doctorat, cursus accessible sans HSK ; 26 000 en licence faute de licence generaliste anglophone.",
        "licence": {
          "montant": 26000,
          "devise": "CNY",
          "periode": "an"
        },
        "master": {
          "montant": 45000,
          "devise": "CNY",
          "periode": "an"
        },
        "doctorat": {
          "montant": 55000,
          "devise": "CNY",
          "periode": "an"
        }
      },
      "admission": undefined
    },
    "champs": {
      "province": "Fujian",
      "ranking": "#303 mondial ex æquo (QS 2027)",
      "fraisScolarite": {
        "source": "https://admissions.xmu.edu.cn/Admissions/Costs.htm",
        "verifieLe": "2026-09-25",
        "note": "Grille par an, en deux groupes : lettres, ou sciences, ingénierie, médecine, économie, gestion et droit. Licence en chinois : 24 000 ou 26 000 yuans ; en anglais, seulement la médecine à 38 000 et trois filières de design à 90 000. Master en chinois : 26 000 ou 30 000 ; en anglais : 39 000 ou 45 000. Doctorat en chinois : 30 000 ou 34 000 ; en anglais : 42 000 ou 55 000, sans frais en quatrième année. Frais de dossier 400 yuans. Montants retenus : licence en chinois, master et doctorat en anglais, second groupe.",
        "licence": {
          "montant": 26000,
          "devise": "CNY",
          "periode": "an"
        },
        "master": {
          "montant": 45000,
          "devise": "CNY",
          "periode": "an"
        },
        "doctorat": {
          "montant": 55000,
          "devise": "CNY",
          "periode": "an"
        }
      },
      "admission": {
        "procedure": "Candidature en ligne sur application.xmu.edu.cn, avec paiement des frais à l'inscription. En licence, joindre le relevé du test CSCA. Les écoles étudient le dossier et font passer, si besoin, un entretien à distance ou un examen écrit.",
        "calendrier": "Rentrée 2026 : les autofinancés candidatent du 1er décembre 2025 au 10 mai 2026, en licence, en master et en doctorat.",
        "conditions": "Nationalité étrangère, bonne santé physique et mentale, passeport ordinaire valide. Licence : de 18 à 30 ans au 1er septembre 2026. Master : en général moins de 45 ans. Doctorat : en général moins de 50 ans.",
        "langue": "Programme en chinois : HSK 5 avec au moins 210 points en lettres, économie, gestion, droit et arts ; HSK 4 avec au moins 210 points en sciences, ingénierie, médecine et sport. Programme en anglais : TOEFL iBT 80 ou IELTS académique 6.0.",
        "fraisDossier": "400 yuans, payés à l'inscription en ligne, non remboursables.",
        "sources": [
          "https://admissions.xmu.edu.cn/Admissions/Undergraduate_Students.htm",
          "https://admissions.xmu.edu.cn/info/1061/3780.htm",
          "https://admissions.xmu.edu.cn/info/1061/3770.htm",
          "https://admissions.xmu.edu.cn/Admissions/Costs.htm"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "zhejiang-university-hangzhou",
    "motif": "bloc admission (campagne 2026 ou 2027, candidature, conditions, langue, frais de dossier), province, note de frais réécrite, montants relus et inchangés, le 2026-09-25",
    "attendu": {
      "province": undefined,
      "fraisScolarite": {
        "source": "https://iczu.zju.edu.cn/admissionsen/weeswwwwankwwccountwwnfo/list.htm",
        "verifieLe": "2026-09-13",
        "note": "Grille du College international (campus principal de Hangzhou), par annee et par discipline. Licence : philosophie/lettres/histoire 19 800 CNY ; economie, commerce, droit, education, sciences, ingenierie, agriculture 24 800 CNY ; medecine et arts 29 800 CNY ; medecine clinique (MBBS) 42 800 CNY. Master : 22 800 / 28 800 / 32 800 CNY selon les memes groupes. Doctorat : 29 800 / 34 800 / 39 800 CNY. Frais de dossier 800 CNY (400 CNY pour le chinois langue). Les programmes enseignes EN ANGLAIS (master, doctorat, sejours de recherche) supportent 8 000 CNY/an en plus : un master d'ingenierie en anglais revient donc a environ 36 800 CNY/an. Montants retenus : le groupe le plus large (economie, commerce, droit, sciences, ingenierie, agriculture), hors supplement anglais. Attention : le campus international de Haining (intl.zju.edu.cn, 120 000 CNY/an) est un etablissement distinct, ses tarifs ne s'appliquent pas ici.",
        "licence": {
          "montant": 24800,
          "devise": "CNY",
          "periode": "an"
        },
        "master": {
          "montant": 28800,
          "devise": "CNY",
          "periode": "an"
        },
        "doctorat": {
          "montant": 34800,
          "devise": "CNY",
          "periode": "an"
        }
      },
      "admission": undefined
    },
    "champs": {
      "province": "Zhejiang",
      "fraisScolarite": {
        "source": "https://iczu.zju.edu.cn/admissionsen/weeswwwwankwwccountwwnfo/list.htm",
        "verifieLe": "2026-09-25",
        "note": "Grille du collège international, campus de Hangzhou, par an. Licence : philosophie, lettres et histoire 19 800 yuans ; économie, commerce, droit, éducation, sciences, ingénierie et agriculture 24 800 ; médecine et arts 29 800 ; médecine clinique 42 800. Master : 22 800, 28 800 et 32 800 ; doctorat : 29 800, 34 800 et 39 800. Les masters et doctorats enseignés en anglais coûtent 8 000 yuans de plus par an. Frais de dossier 800 yuans. Montants retenus : le groupe le plus large, hors supplément anglais.",
        "licence": {
          "montant": 24800,
          "devise": "CNY",
          "periode": "an"
        },
        "master": {
          "montant": 28800,
          "devise": "CNY",
          "periode": "an"
        },
        "doctorat": {
          "montant": 34800,
          "devise": "CNY",
          "periode": "an"
        }
      },
      "admission": {
        "procedure": "Candidature en ligne sur intlstudent.zju.edu.cn, avec paiement des frais. En licence, le relevé du test CSCA est exigé. Après une première sélection, les candidats passent un entretien vidéo avec l'école. En licence, les pré-admis prépayent la première année dans le système ; le lien du formulaire électronique de visa est envoyé par courriel.",
        "calendrier": "Rentrée 2026 : du 1er décembre 2025 au 28 février 2026 en licence ; clôture le 28 février 2026 en master et en doctorat pour les autofinancés. Certaines filières restent ouvertes jusqu'au 31 mai 2026.",
        "conditions": "Licence : fin d'études secondaires et moins de 25 ans. Master : licence et moins de 35 ans. Doctorat : master et moins de 40 ans ; l'âge est assoupli pour un candidat en bonne santé qui a une expérience professionnelle.",
        "langue": "Programme en chinois : HSK 5 ou plus, avec au moins 180 points en master et en doctorat. Master et doctorat en anglais : IELTS 6,5, TOEFL 90 ou Duolingo 120.",
        "fraisDossier": "800 yuans, non remboursables.",
        "sources": [
          "https://iczu.zju.edu.cn/admissionsen/2024/1030/c68988a2981659/page.htm",
          "https://iczu.zju.edu.cn/admissionsen/2024/1030/c68989a2981849/page.htm",
          "https://iczu.zju.edu.cn/admissionsen/2024/1030/c68990a2981900/page.htm",
          "https://iczu.zju.edu.cn/_upload/article/files/2b/3b/e20929be480ba21faedb2a0198ed/4c6cdaf7-5f70-4855-994a-70c51f5b1b8c.pdf"
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
