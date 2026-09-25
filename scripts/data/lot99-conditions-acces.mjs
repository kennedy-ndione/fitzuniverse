// ============================================================
// FitzUniverse — Lot 99 : les conditions d'accès relues (25/09/2026)
// Export de référence : 2026-09-25T14:13:32.415Z
//
// POURQUOI
// La recherche des lots 97-98 (« Puis-je me lancer ? ») a relu, pays par
// pays, les règles d'accès officielles. Elle a trouvé des fiches fausses
// ou incomplètes ; chaque correction ci-dessous a été relue à la main sur
// la page officielle citée dans son motif.
//
//   - Chine : le test CSCA manquait (Sun Yat-sen, Zhejiang) ; Pékin
//     laissait croire le bac sénégalais exclu.
//   - Malaisie : 14 fiches disaient le bac sénégalais absent des
//     conditions ; la liste nationale MQA le classe au niveau 6.
//   - Canada : HEC Montréal (12 années OU MOINS), Concordia (quatre ans).
//   - Roumanie : Babeș-Bolyai, la dispense « langue officielle ».
//   - France : 19 fiches taisaient l'ancienneté du bac exigée par
//     Campus France Sénégal en première année.
//
// CE QUE LE LOT ÉCRIT : admission (conditions, procédure ou langue),
// sources et verifieLe. Rien d'autre.
// ============================================================

export const PATCHES = [
  {
    "collection": "universities",
    "id": "sun-yat-sen-university-guangzhou",
    "motif": "Chine : le test CSCA, obligatoire en licence dans la brochure 2026 de Sun Yat-sen, relu le 2026-09-25",
    "attendu": {
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
    },
    "champs": {
      "admission": {
        "procedure": "Candidature en ligne sur apply.sysu.edu.cn : remplir le dossier, déposer les pièces et payer les frais ; sans paiement, la candidature n'est pas examinée. En licence, joindre le relevé du test CSCA. L'université vérifie le dossier, invite les candidats retenus à un entretien, puis publie la pré-admission ; l'avis d'admission se télécharge à partir de juillet 2026.",
        "calendrier": "Rentrée 2026, deux tours. Licence : du 1er janvier au 28 février, puis du 1er mars au 30 avril 2026. Master et doctorat : du 1er janvier au 15 février, puis du 16 février au 30 avril 2026. Arrivée fin août ou début septembre 2026.",
        "conditions": "Nationalité étrangère avec un passeport étranger valable au moins jusqu'au 1er décembre 2026. Licence : fin d'études secondaires ou équivalent. Master : licence. Doctorat : master. Les limites d'âge ne visent que les bourses. En licence, le test CSCA (évaluation nationale des candidats étrangers) est obligatoire, bourse ou non : il se passe avant de candidater.",
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
    "id": "zhejiang-university-hangzhou",
    "motif": "Chine : le relevé du test CSCA, exigé de tout candidat en licence depuis 2026-2027 (guide de Zhejiang), relu le 2026-09-25",
    "attendu": {
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
    },
    "champs": {
      "admission": {
        "procedure": "Candidature en ligne sur intlstudent.zju.edu.cn, avec paiement des frais. En licence, le relevé du test CSCA est exigé. Après une première sélection, les candidats passent un entretien vidéo avec l'école. En licence, les pré-admis prépayent la première année dans le système ; le lien du formulaire électronique de visa est envoyé par courriel.",
        "calendrier": "Rentrée 2026 : du 1er décembre 2025 au 28 février 2026 en licence ; clôture le 28 février 2026 en master et en doctorat pour les autofinancés. Certaines filières restent ouvertes jusqu'au 31 mai 2026.",
        "conditions": "Licence : fin d'études secondaires, moins de 25 ans, et un relevé du test CSCA (évaluation nationale des candidats étrangers), exigé de tout candidat depuis 2026-2027. Master : licence et moins de 35 ans. Doctorat : master et moins de 40 ans ; l'âge est assoupli pour un candidat en bonne santé qui a une expérience professionnelle.",
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
  },
  {
    "collection": "universities",
    "id": "peking-university-beijing",
    "motif": "Chine : le bac sénégalais n'est pas dans la liste de l'admission sans épreuve, mais il ouvre le concours d'entrée de Pékin (épreuves de chinois, anglais, mathématiques), relu le 2026-09-25",
    "attendu": {
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
    },
    "champs": {
      "admission": {
        "procedure": "Candidature en ligne sur studyatpku.com. Licence : soit sans épreuve écrite, sur dossier et résultats d'un examen national reconnu, soit par l'examen écrit de l'université en chinois, anglais et mathématiques, fin mars 2026. Master et doctorat : dossier en ligne, deux programmes au plus, puis un second examen en mars, organisé par l'école. Fin juin, l'université envoie l'avis d'admission et le formulaire JW201 ou JW202.",
        "calendrier": "Rentrée 2026. Master et doctorat : du 20 octobre au 23 décembre 2025, dossier papier au plus tard le 31 mai 2026. Licence sans épreuve écrite : du 19 décembre 2025 au 28 février 2026, puis du 12 juin au 10 juillet 2026. Licence avec examen : du 1er janvier au 28 février 2026. Arrivée début septembre 2026.",
        "conditions": "Nationalité étrangère avec un passeport étranger valide, bonne santé physique et psychologique, casier judiciaire vierge. Licence : de 18 à 25 ans en principe. Master : licence. Doctorat : master. Pour la licence sans épreuve écrite, le baccalauréat français est accepté avec au moins 15 sur 20 ; le baccalauréat sénégalais n'est pas dans cette liste, mais il donne accès au concours d'entrée : épreuves écrites de chinois, d'anglais et de mathématiques, fin mars, puis un second examen mi-avril.",
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
    "id": "asia-pacific-university-kuala-lumpur",
    "motif": "Malaisie : la liste nationale de la MQA (décembre 2025, lue sur l'original le 2026-09-25) classe le bac sénégalais au niveau 6, accès direct à la licence",
    "attendu": {
      "admission": {
        "fraisDossier": "3 600 ringgits, environ 950 dollars, de frais de traitement avant l'arrivée, frais de visa compris.",
        "sources": [
          "https://www.apu.edu.my/international-students-application-procedures",
          "https://www.apu.edu.my/course/bsc-hons-in-computer-science-data-analytics",
          "https://www.apu.edu.my/course/phd-in-technology",
          "https://www.apu.edu.my/apu-international-students-scholarships-merit-awards"
        ],
        "calendrier": "Licence en analyse de données : rentrées du 28 septembre et du 24 novembre 2026. Doctorat : 6 octobre, 3 novembre et 1er décembre 2026.",
        "verifieLe": "2026-09-25",
        "langue": "Licence : IELTS 5,0, TOEFL iBT 2,5 sur la nouvelle échelle, PTE 47 ou MUET 3,5.",
        "procedure": "Formulaire en ligne avec vos diplômes certifiés et traduits en anglais et votre test d'anglais ; en licence, des résultats prévisionnels suffisent pour une offre conditionnelle. Réponse en deux à trois jours ouvrés. Pour confirmer, vous payez les frais avant l'arrivée et l'université dépose votre visa à EMGS, en deux à trois semaines. Candidatez six à huit semaines avant la rentrée.",
        "conditions": "Diplôme étranger équivalent à la douzième année, aux A level ou au HSC, selon la liste d'équivalences de l'agence malaisienne des qualifications. Le baccalauréat du Sénégal n'apparaît pas dans les conditions publiées : faites vérifier votre diplôme par le bureau international avant de candidater."
      }
    },
    "champs": {
      "admission": {
        "fraisDossier": "3 600 ringgits, environ 950 dollars, de frais de traitement avant l'arrivée, frais de visa compris.",
        "sources": [
          "https://www.apu.edu.my/international-students-application-procedures",
          "https://www.apu.edu.my/course/bsc-hons-in-computer-science-data-analytics",
          "https://www.apu.edu.my/course/phd-in-technology",
          "https://www.apu.edu.my/apu-international-students-scholarships-merit-awards",
          "https://www.mqa.gov.my/new/document/2025/The%20List%20of%20Entry%20Qualifications%20for%20International%20Student%20-%20December%202025.pdf"
        ],
        "calendrier": "Licence en analyse de données : rentrées du 28 septembre et du 24 novembre 2026. Doctorat : 6 octobre, 3 novembre et 1er décembre 2026.",
        "verifieLe": "2026-09-25",
        "langue": "Licence : IELTS 5,0, TOEFL iBT 2,5 sur la nouvelle échelle, PTE 47 ou MUET 3,5.",
        "procedure": "Formulaire en ligne avec vos diplômes certifiés et traduits en anglais et votre test d'anglais ; en licence, des résultats prévisionnels suffisent pour une offre conditionnelle. Réponse en deux à trois jours ouvrés. Pour confirmer, vous payez les frais avant l'arrivée et l'université dépose votre visa à EMGS, en deux à trois semaines. Candidatez six à huit semaines avant la rentrée.",
        "conditions": "Diplôme étranger équivalent à la douzième année, aux A level ou au HSC, selon la liste d'équivalences de l'agence malaisienne des qualifications. Le baccalauréat du Sénégal figure sur la liste nationale malaisienne (MQA, décembre 2025) : il ouvre directement la licence, sans Foundation. L'université fixe ensuite ses notes minimales : faites-les confirmer par le bureau international."
      }
    }
  },
  {
    "collection": "universities",
    "id": "inti-international-university-nilai",
    "motif": "Malaisie : la liste nationale de la MQA (décembre 2025, lue sur l'original le 2026-09-25) classe le bac sénégalais au niveau 6, accès direct à la licence",
    "attendu": {
      "admission": {
        "fraisDossier": "2 847 ringgits, environ 680 dollars, comprenant les frais de traitement, l'assurance médicale, l'examen médical et les frais d'immigration.",
        "sources": [
          "https://newinti.edu.my/international-students/how-to-apply/",
          "https://newinti.edu.my/international-students/entry-requirements/",
          "https://newinti.edu.my/programme/bachelor-of-information-technology-hons-coventry-uk/",
          "https://newinti.edu.my/programme/doctor-of-philosophy-phd-management/"
        ],
        "calendrier": "Licence : rentrées de janvier, mai et août.",
        "verifieLe": "2026-09-25",
        "langue": "Seuil d'anglais en licence non publié sur les pages de programme ; doctorat : IELTS 6,0, TOEFL 550 ou MUET 4.",
        "procedure": "Remettez le formulaire de candidature internationale, vos pièces et les frais à un représentant d'INTI au moins deux à trois mois avant la rentrée ; il n'y a pas de portail en ligne. Pièces : formulaire, deux photocopies du passeport entier valable 18 mois, diplômes. L'université demande votre visa à EMGS, en six à huit semaines ; à l'autorisation, vous payez d'avance le premier semestre.",
        "conditions": "La liste par pays cite le baccalauréat du Cameroun et de Djibouti et le WAEC du Ghana, du Nigeria et d'autres pays d'Afrique de l'Ouest, sans note minimale. Le baccalauréat du Sénégal n'apparaît pas dans les conditions publiées : faites vérifier votre diplôme par le bureau international avant de candidater."
      }
    },
    "champs": {
      "admission": {
        "fraisDossier": "2 847 ringgits, environ 680 dollars, comprenant les frais de traitement, l'assurance médicale, l'examen médical et les frais d'immigration.",
        "sources": [
          "https://newinti.edu.my/international-students/how-to-apply/",
          "https://newinti.edu.my/international-students/entry-requirements/",
          "https://newinti.edu.my/programme/bachelor-of-information-technology-hons-coventry-uk/",
          "https://newinti.edu.my/programme/doctor-of-philosophy-phd-management/",
          "https://www.mqa.gov.my/new/document/2025/The%20List%20of%20Entry%20Qualifications%20for%20International%20Student%20-%20December%202025.pdf"
        ],
        "calendrier": "Licence : rentrées de janvier, mai et août.",
        "verifieLe": "2026-09-25",
        "langue": "Seuil d'anglais en licence non publié sur les pages de programme ; doctorat : IELTS 6,0, TOEFL 550 ou MUET 4.",
        "procedure": "Remettez le formulaire de candidature internationale, vos pièces et les frais à un représentant d'INTI au moins deux à trois mois avant la rentrée ; il n'y a pas de portail en ligne. Pièces : formulaire, deux photocopies du passeport entier valable 18 mois, diplômes. L'université demande votre visa à EMGS, en six à huit semaines ; à l'autorisation, vous payez d'avance le premier semestre.",
        "conditions": "La liste par pays cite le baccalauréat du Cameroun et de Djibouti et le WAEC du Ghana, du Nigeria et d'autres pays d'Afrique de l'Ouest, sans note minimale. Le baccalauréat du Sénégal figure sur la liste nationale malaisienne (MQA, décembre 2025) : il ouvre directement la licence, sans Foundation. L'université fixe ensuite ses notes minimales : faites-les confirmer par le bureau international."
      }
    }
  },
  {
    "collection": "universities",
    "id": "multimedia-university-cyberjaya",
    "motif": "Malaisie : la liste nationale de la MQA (décembre 2025, lue sur l'original le 2026-09-25) classe le bac sénégalais au niveau 6, accès direct à la licence",
    "attendu": {
      "admission": {
        "fraisDossier": "Aucuns frais de dossier indiqués ; 3 600 ringgits de frais de visa inclus dans le paiement à l'acceptation.",
        "sources": [
          "https://www.mmu.edu.my/apply-now/",
          "https://www.mmu.edu.my/fee-structure-international/",
          "https://www.mmu.edu.my/wp-content/uploads/2023/07/English-Requirement-for-International-Student-100425.pdf",
          "https://www.mmu.edu.my/wp-content/uploads/2023/02/IntStudentGuide_Jan23.pdf"
        ],
        "calendrier": "Rentrée internationale de mars-avril 2027 ouverte : clôture le 23 février 2027, cours le 29 mars 2027. Master et doctorat en recherche : candidatures toute l'année.",
        "verifieLe": "2026-09-25",
        "langue": "IELTS 5,0 dans la plupart des licences, 5,5 en marketing, gestion et économie, 6,0 en finance. Sinon offre conditionnelle et programme d'anglais de MMU, avec deux ans pour atteindre le score.",
        "procedure": "Candidature en ligne sur le portail de MMU, une adresse électronique suffit pour créer le compte ; vous suivez ensuite votre dossier sur le même tableau de bord. Une fois admis, l'université demande pour vous le visa étudiant auprès d'EMGS, l'agence malaisienne des étudiants internationaux.",
        "conditions": "Selon le guide international de l'université, un diplôme de fin d'études de douze ans, le plus élevé du pays et qui ouvre la licence dans le pays d'origine, donne accès à la licence. Le baccalauréat du Sénégal n'apparaît pas dans les conditions publiées : faites vérifier votre diplôme par le bureau international avant de candidater."
      }
    },
    "champs": {
      "admission": {
        "fraisDossier": "Aucuns frais de dossier indiqués ; 3 600 ringgits de frais de visa inclus dans le paiement à l'acceptation.",
        "sources": [
          "https://www.mmu.edu.my/apply-now/",
          "https://www.mmu.edu.my/fee-structure-international/",
          "https://www.mmu.edu.my/wp-content/uploads/2023/07/English-Requirement-for-International-Student-100425.pdf",
          "https://www.mmu.edu.my/wp-content/uploads/2023/02/IntStudentGuide_Jan23.pdf",
          "https://www.mqa.gov.my/new/document/2025/The%20List%20of%20Entry%20Qualifications%20for%20International%20Student%20-%20December%202025.pdf"
        ],
        "calendrier": "Rentrée internationale de mars-avril 2027 ouverte : clôture le 23 février 2027, cours le 29 mars 2027. Master et doctorat en recherche : candidatures toute l'année.",
        "verifieLe": "2026-09-25",
        "langue": "IELTS 5,0 dans la plupart des licences, 5,5 en marketing, gestion et économie, 6,0 en finance. Sinon offre conditionnelle et programme d'anglais de MMU, avec deux ans pour atteindre le score.",
        "procedure": "Candidature en ligne sur le portail de MMU, une adresse électronique suffit pour créer le compte ; vous suivez ensuite votre dossier sur le même tableau de bord. Une fois admis, l'université demande pour vous le visa étudiant auprès d'EMGS, l'agence malaisienne des étudiants internationaux.",
        "conditions": "Selon le guide international de l'université, un diplôme de fin d'études de douze ans, le plus élevé du pays et qui ouvre la licence dans le pays d'origine, donne accès à la licence. Le baccalauréat du Sénégal figure sur la liste nationale malaisienne (MQA, décembre 2025) : il ouvre directement la licence, sans Foundation. L'université fixe ensuite ses notes minimales : faites-les confirmer par le bureau international."
      }
    }
  },
  {
    "collection": "universities",
    "id": "segi-university-kota-damansara",
    "motif": "Malaisie : la liste nationale de la MQA (décembre 2025, lue sur l'original le 2026-09-25) classe le bac sénégalais au niveau 6, accès direct à la licence",
    "attendu": {
      "admission": {
        "fraisDossier": "3 150 ringgits de frais d'admission et de visa, sous réserve de changement, par virement.",
        "sources": [
          "https://university.segi.edu.my/international-students/",
          "https://university.segi.edu.my/admissions-intake/",
          "https://university.segi.edu.my/scholarships-and-rebates-hub/"
        ],
        "calendrier": "Licence : rentrées de janvier, mai et septembre.",
        "verifieLe": "2026-09-25",
        "langue": "Niveau d'anglais fixé par chaque programme ; non publié sur les pages lisibles.",
        "procedure": "Vous envoyez formulaire, relevés et diplômes, passeport complet, photos sur fond blanc, rapport médical et test d'anglais s'il y a lieu. Un conseiller transmet le dossier au service des admissions, qui vérifie les conditions. Si vous êtes admissible, vous payez les frais d'admission et de visa ; l'université émet la lettre d'offre et dépose votre visa à EMGS.",
        "conditions": "Évaluation du dossier par le service des admissions selon les conditions minimales du programme. Le baccalauréat du Sénégal n'apparaît pas dans les conditions publiées : faites vérifier votre diplôme par le bureau international avant de candidater.",
        "coutIndicatif": "Frais de scolarité non publiés sur les pages lisibles de l'université : demandez la grille au bureau international."
      }
    },
    "champs": {
      "admission": {
        "fraisDossier": "3 150 ringgits de frais d'admission et de visa, sous réserve de changement, par virement.",
        "sources": [
          "https://university.segi.edu.my/international-students/",
          "https://university.segi.edu.my/admissions-intake/",
          "https://university.segi.edu.my/scholarships-and-rebates-hub/",
          "https://www.mqa.gov.my/new/document/2025/The%20List%20of%20Entry%20Qualifications%20for%20International%20Student%20-%20December%202025.pdf"
        ],
        "calendrier": "Licence : rentrées de janvier, mai et septembre.",
        "verifieLe": "2026-09-25",
        "langue": "Niveau d'anglais fixé par chaque programme ; non publié sur les pages lisibles.",
        "procedure": "Vous envoyez formulaire, relevés et diplômes, passeport complet, photos sur fond blanc, rapport médical et test d'anglais s'il y a lieu. Un conseiller transmet le dossier au service des admissions, qui vérifie les conditions. Si vous êtes admissible, vous payez les frais d'admission et de visa ; l'université émet la lettre d'offre et dépose votre visa à EMGS.",
        "conditions": "Évaluation du dossier par le service des admissions selon les conditions minimales du programme. Le baccalauréat du Sénégal figure sur la liste nationale malaisienne (MQA, décembre 2025) : il ouvre directement la licence, sans Foundation. L'université fixe ensuite ses notes minimales : faites-les confirmer par le bureau international.",
        "coutIndicatif": "Frais de scolarité non publiés sur les pages lisibles de l'université : demandez la grille au bureau international."
      }
    }
  },
  {
    "collection": "universities",
    "id": "sunway-university-bandar-sunway",
    "motif": "Malaisie : la liste nationale de la MQA (décembre 2025, lue sur l'original le 2026-09-25) classe le bac sénégalais au niveau 6, accès direct à la licence",
    "attendu": {
      "admission": {
        "fraisDossier": "742 ringgits d'inscription, taxe comprise, et 3 300 ringgits de frais de visa versés à EMGS, non remboursables.",
        "sources": [
          "https://sunwayuniversity.edu.my/international/apply-today",
          "https://sunwayuniversity.edu.my/faculty-of-medical-and-life-sciences/courses/bachelor-of-science-honours-psychology",
          "https://sunwayuniversity.edu.my/sunway-business-school/courses/doctor-of-philosophy-business",
          "https://scholarship.sunway.edu.my/scholarship/sunway-entrance-scholarship"
        ],
        "calendrier": "Licence : rentrées de janvier, avril et septembre. Dossier complet au moins douze semaines avant.",
        "verifieLe": "2026-09-25",
        "langue": "IELTS 6,0 ou équivalent, ou niveau 4 du programme intensif d'anglais de Sunway.",
        "procedure": "Écrivez d'abord au bureau international pour faire vérifier votre admissibilité. Envoyez ensuite le formulaire, la déclaration de santé, une photo, le passeport entier, valable 18 mois, vos diplômes certifiés et votre test d'anglais, au moins douze semaines avant la rentrée. Les candidats d'Afrique subsaharienne joignent un certificat de non-objection. Après paiement, la lettre d'offre arrive par courriel sous trois jours ouvrés ; le visa prend six à huit semaines.",
        "conditions": "A level avec au moins 12 points, IB 25 ; les autres diplômes sont examinés au cas par cas. Le baccalauréat du Sénégal n'apparaît pas dans les conditions publiées : faites vérifier votre diplôme par le bureau international avant de candidater."
      }
    },
    "champs": {
      "admission": {
        "fraisDossier": "742 ringgits d'inscription, taxe comprise, et 3 300 ringgits de frais de visa versés à EMGS, non remboursables.",
        "sources": [
          "https://sunwayuniversity.edu.my/international/apply-today",
          "https://sunwayuniversity.edu.my/faculty-of-medical-and-life-sciences/courses/bachelor-of-science-honours-psychology",
          "https://sunwayuniversity.edu.my/sunway-business-school/courses/doctor-of-philosophy-business",
          "https://scholarship.sunway.edu.my/scholarship/sunway-entrance-scholarship",
          "https://www.mqa.gov.my/new/document/2025/The%20List%20of%20Entry%20Qualifications%20for%20International%20Student%20-%20December%202025.pdf"
        ],
        "calendrier": "Licence : rentrées de janvier, avril et septembre. Dossier complet au moins douze semaines avant.",
        "verifieLe": "2026-09-25",
        "langue": "IELTS 6,0 ou équivalent, ou niveau 4 du programme intensif d'anglais de Sunway.",
        "procedure": "Écrivez d'abord au bureau international pour faire vérifier votre admissibilité. Envoyez ensuite le formulaire, la déclaration de santé, une photo, le passeport entier, valable 18 mois, vos diplômes certifiés et votre test d'anglais, au moins douze semaines avant la rentrée. Les candidats d'Afrique subsaharienne joignent un certificat de non-objection. Après paiement, la lettre d'offre arrive par courriel sous trois jours ouvrés ; le visa prend six à huit semaines.",
        "conditions": "A level avec au moins 12 points, IB 25 ; les autres diplômes sont examinés au cas par cas. Le baccalauréat du Sénégal figure sur la liste nationale malaisienne (MQA, décembre 2025) : il ouvre directement la licence, sans Foundation. L'université fixe ensuite ses notes minimales : faites-les confirmer par le bureau international."
      }
    }
  },
  {
    "collection": "universities",
    "id": "taylors-university-subang-jaya",
    "motif": "Malaisie : la liste nationale de la MQA (décembre 2025, lue sur l'original le 2026-09-25) classe le bac sénégalais au niveau 6, accès direct à la licence",
    "attendu": {
      "admission": {
        "fraisDossier": "Aucuns frais de candidature séparés ne sont indiqués ; 2 800 ringgits d'inscription et 2 920 ringgits de visa dans la grille des frais.",
        "sources": [
          "https://university.taylors.edu.my/en/study/how-to-apply/undergraduate-admission.html",
          "https://university.taylors.edu.my/en/study/how-to-apply/key-intakes.html",
          "https://university.taylors.edu.my/en/study/scholarships-and-financial-aid/fees-schedules.html",
          "https://university.taylors.edu.my/en/study/explore-all-programmes/liberal-arts-and-sciences/undergraduate/bachelor-of-performing-arts.html"
        ],
        "calendrier": "Licence : rentrées de février, avril et septembre. Master et doctorat en recherche : février, avril, juin, septembre et octobre.",
        "verifieLe": "2026-09-25",
        "langue": "Arts du spectacle : IELTS 5,0 ou études pré-universitaires faites en anglais ; certains programmes demandent davantage.",
        "procedure": "Vous choisissez le programme et faites vérifier votre admissibilité par un conseiller, puis vous candidatez en ligne sur le portail TOPAS avec vos diplômes et relevés certifiés. Vous payez par Flywire ou Taylor's Pay ; l'université vous envoie alors la lettre d'acceptation et demande l'autorisation de visa à EMGS.",
        "conditions": "Conditions publiées pour les diplômes pré-universitaires, comme les A level ou l'IB, et les fondations malaisiennes. Le baccalauréat du Sénégal n'apparaît pas dans les conditions publiées : faites vérifier votre diplôme par le bureau international avant de candidater."
      }
    },
    "champs": {
      "admission": {
        "fraisDossier": "Aucuns frais de candidature séparés ne sont indiqués ; 2 800 ringgits d'inscription et 2 920 ringgits de visa dans la grille des frais.",
        "sources": [
          "https://university.taylors.edu.my/en/study/how-to-apply/undergraduate-admission.html",
          "https://university.taylors.edu.my/en/study/how-to-apply/key-intakes.html",
          "https://university.taylors.edu.my/en/study/scholarships-and-financial-aid/fees-schedules.html",
          "https://university.taylors.edu.my/en/study/explore-all-programmes/liberal-arts-and-sciences/undergraduate/bachelor-of-performing-arts.html",
          "https://www.mqa.gov.my/new/document/2025/The%20List%20of%20Entry%20Qualifications%20for%20International%20Student%20-%20December%202025.pdf"
        ],
        "calendrier": "Licence : rentrées de février, avril et septembre. Master et doctorat en recherche : février, avril, juin, septembre et octobre.",
        "verifieLe": "2026-09-25",
        "langue": "Arts du spectacle : IELTS 5,0 ou études pré-universitaires faites en anglais ; certains programmes demandent davantage.",
        "procedure": "Vous choisissez le programme et faites vérifier votre admissibilité par un conseiller, puis vous candidatez en ligne sur le portail TOPAS avec vos diplômes et relevés certifiés. Vous payez par Flywire ou Taylor's Pay ; l'université vous envoie alors la lettre d'acceptation et demande l'autorisation de visa à EMGS.",
        "conditions": "Conditions publiées pour les diplômes pré-universitaires, comme les A level ou l'IB, et les fondations malaisiennes. Le baccalauréat du Sénégal figure sur la liste nationale malaisienne (MQA, décembre 2025) : il ouvre directement la licence, sans Foundation. L'université fixe ensuite ses notes minimales : faites-les confirmer par le bureau international."
      }
    }
  },
  {
    "collection": "universities",
    "id": "ucsi-university-kuala-lumpur",
    "motif": "Malaisie : la liste nationale de la MQA (décembre 2025, lue sur l'original le 2026-09-25) classe le bac sénégalais au niveau 6, accès direct à la licence",
    "attendu": {
      "admission": {
        "fraisDossier": "3 100 ringgits, environ 838 dollars, frais de visa compris, pour la plupart des licences ; 3 150 en ingénierie ; 3 600 en médecine, pharmacie et études supérieures.",
        "sources": [
          "https://www.ucsiuniversity.edu.my/admission-procedure/international/Kuala-lumpur",
          "https://www.ucsiuniversity.edu.my/programmes/ba-hons-psychology",
          "https://www.ucsiuniversity.edu.my/programmes/doctor-philosophy-psychology",
          "https://www.ucsiuniversity.edu.my/scholarships-international-students"
        ],
        "calendrier": "Licence en psychologie : rentrées de janvier, mai et septembre.",
        "verifieLe": "2026-09-25",
        "langue": "Licence en psychologie : IELTS Academic 5,0, TOEFL iBT 40, PTE 47, MUET 3,5 ou Linguaskill 154 ; sinon modules d'anglais en plus.",
        "procedure": "Vérifiez d'abord votre admissibilité avec un conseiller, puis remplissez le formulaire d'inscription en ligne en déposant relevés et diplômes traduits en anglais, passeport complet en couleur valable 18 mois, photo, déclaration de santé, rapport médical et reçu du virement des frais. Après paiement, vous recevez une offre conditionnelle et l'université demande votre visa, en huit à dix semaines.",
        "conditions": "Conditions publiées pour les A level, l'IB et les autres diplômes pré-universitaires ; les autres diplômes sont évalués au cas par cas. Le baccalauréat du Sénégal n'apparaît pas dans les conditions publiées : faites vérifier votre diplôme par le bureau international avant de candidater."
      }
    },
    "champs": {
      "admission": {
        "fraisDossier": "3 100 ringgits, environ 838 dollars, frais de visa compris, pour la plupart des licences ; 3 150 en ingénierie ; 3 600 en médecine, pharmacie et études supérieures.",
        "sources": [
          "https://www.ucsiuniversity.edu.my/admission-procedure/international/Kuala-lumpur",
          "https://www.ucsiuniversity.edu.my/programmes/ba-hons-psychology",
          "https://www.ucsiuniversity.edu.my/programmes/doctor-philosophy-psychology",
          "https://www.ucsiuniversity.edu.my/scholarships-international-students",
          "https://www.mqa.gov.my/new/document/2025/The%20List%20of%20Entry%20Qualifications%20for%20International%20Student%20-%20December%202025.pdf"
        ],
        "calendrier": "Licence en psychologie : rentrées de janvier, mai et septembre.",
        "verifieLe": "2026-09-25",
        "langue": "Licence en psychologie : IELTS Academic 5,0, TOEFL iBT 40, PTE 47, MUET 3,5 ou Linguaskill 154 ; sinon modules d'anglais en plus.",
        "procedure": "Vérifiez d'abord votre admissibilité avec un conseiller, puis remplissez le formulaire d'inscription en ligne en déposant relevés et diplômes traduits en anglais, passeport complet en couleur valable 18 mois, photo, déclaration de santé, rapport médical et reçu du virement des frais. Après paiement, vous recevez une offre conditionnelle et l'université demande votre visa, en huit à dix semaines.",
        "conditions": "Conditions publiées pour les A level, l'IB et les autres diplômes pré-universitaires ; les autres diplômes sont évalués au cas par cas. Le baccalauréat du Sénégal figure sur la liste nationale malaisienne (MQA, décembre 2025) : il ouvre directement la licence, sans Foundation. L'université fixe ensuite ses notes minimales : faites-les confirmer par le bureau international."
      }
    }
  },
  {
    "collection": "universities",
    "id": "universiti-kebangsaan-malaysia-kuala-lumpur",
    "motif": "Malaisie : la liste nationale de la MQA (décembre 2025, lue sur l'original le 2026-09-25) classe le bac sénégalais au niveau 6, accès direct à la licence",
    "attendu": {
      "admission": {
        "procedure": "Inscription sur le portail JoinUKM avec passeport, mot de passe et adresse électronique, choix du programme, puis envoi du dossier complet en ligne ; aucun document n'est à envoyer par la poste. Vous suivez ensuite l'état de votre candidature sur le portail.",
        "conditions": "Douze ans d'études primaires et secondaires, certificat de fin d'études secondaires, niveau d'anglais fixé par la faculté, entretien si demandé. En licence, l'université propose le programme UKMi, admission directe des étudiants internationaux ; la voie ordinaire réserve environ 1 % des places aux étrangers et enseigne en malais. Le baccalauréat du Sénégal n'apparaît pas dans les conditions publiées : faites vérifier votre diplôme par le bureau international avant de candidater.",
        "calendrier": "Licence : candidatures ouvertes en avril pour la rentrée d'octobre ; le programme UKMi a aussi une rentrée en mars. Master et doctorat : deux campagnes, en octobre pour mars et en avril pour octobre ; candidater au moins deux mois avant. Recherche : toute l'année.",
        "langue": "IELTS, TOEFL, MUET ou examen aligné sur le cadre européen, au score fixé par le programme. Sinon offre conditionnelle avec cours d'anglais à l'université, deux ans au plus.",
        "fraisDossier": "100 ringgits ou 30 dollars pour les candidats internationaux.",
        "sources": [
          "https://join.ukm.my/",
          "https://www.ukm.my/studyukm/ukmi/",
          "https://www.ukm.my/akademik/how-to-apply/"
        ],
        "verifieLe": "2026-09-25"
      }
    },
    "champs": {
      "admission": {
        "procedure": "Inscription sur le portail JoinUKM avec passeport, mot de passe et adresse électronique, choix du programme, puis envoi du dossier complet en ligne ; aucun document n'est à envoyer par la poste. Vous suivez ensuite l'état de votre candidature sur le portail.",
        "conditions": "Douze ans d'études primaires et secondaires, certificat de fin d'études secondaires, niveau d'anglais fixé par la faculté, entretien si demandé. En licence, l'université propose le programme UKMi, admission directe des étudiants internationaux ; la voie ordinaire réserve environ 1 % des places aux étrangers et enseigne en malais. Le baccalauréat du Sénégal figure sur la liste nationale malaisienne (MQA, décembre 2025) : il ouvre directement la licence, sans Foundation. L'université fixe ensuite ses notes minimales : faites-les confirmer par le bureau international.",
        "calendrier": "Licence : candidatures ouvertes en avril pour la rentrée d'octobre ; le programme UKMi a aussi une rentrée en mars. Master et doctorat : deux campagnes, en octobre pour mars et en avril pour octobre ; candidater au moins deux mois avant. Recherche : toute l'année.",
        "langue": "IELTS, TOEFL, MUET ou examen aligné sur le cadre européen, au score fixé par le programme. Sinon offre conditionnelle avec cours d'anglais à l'université, deux ans au plus.",
        "fraisDossier": "100 ringgits ou 30 dollars pour les candidats internationaux.",
        "sources": [
          "https://join.ukm.my/",
          "https://www.ukm.my/studyukm/ukmi/",
          "https://www.ukm.my/akademik/how-to-apply/",
          "https://www.mqa.gov.my/new/document/2025/The%20List%20of%20Entry%20Qualifications%20for%20International%20Student%20-%20December%202025.pdf"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "universiti-malaya-kuala-lumpur",
    "motif": "Malaisie : la liste nationale de la MQA (décembre 2025, lue sur l'original le 2026-09-25) classe le bac sénégalais au niveau 6, accès direct à la licence",
    "attendu": {
      "admission": {
        "procedure": "Candidature en ligne sur le portail MAYA de l'université, seul canal pour le master et le doctorat. Après l'offre, vous activez votre compte étudiant, envoyez vos documents avant l'arrivée à l'équipe des visas, puis passez une visite médicale dans une clinique agréée par EMGS dans les sept jours suivant votre arrivée.",
        "conditions": "Licence : A level, IB, certificat de fin d'études secondaires, douzième année ou équivalent. Le baccalauréat du Sénégal n'apparaît pas dans les conditions publiées : faites vérifier votre diplôme par le bureau international avant de candidater.",
        "calendrier": "Licence, rentrée d'octobre 2026 : du 9 février au 30 août 2026, médecine jusqu'au 9 juin. Rentrée de mars 2027 : du 7 septembre 2026 au 30 janvier 2027. Master et doctorat en recherche : du 27 avril au 22 novembre 2026.",
        "langue": "Enseignement en anglais pour la plupart des programmes. Test d'anglais de moins de deux ans : IELTS, TOEFL, PTE ou MUET ; IELTS Indicator, TOEFL Home Edition et TOEFL ITP refusés. Sans test, une offre conditionnelle est possible, avec une date limite pour le fournir.",
        "fraisDossier": "500 ringgits par candidature selon la page de candidature 2026-2027 ; la foire aux questions indique 300 ringgits. Frais non remboursables ; le montant exact s'affiche au paiement.",
        "sources": [
          "https://study.um.edu.my/how-to-apply",
          "https://study.um.edu.my/faqs-amp-info",
          "https://study.um.edu.my/international-student",
          "https://study.um.edu.my/doc/tution-fee/Fee%20Structure,%20UG,%20International%20-%20Updated%2022%20Oct%202025.pdf"
        ],
        "verifieLe": "2026-09-25"
      }
    },
    "champs": {
      "admission": {
        "procedure": "Candidature en ligne sur le portail MAYA de l'université, seul canal pour le master et le doctorat. Après l'offre, vous activez votre compte étudiant, envoyez vos documents avant l'arrivée à l'équipe des visas, puis passez une visite médicale dans une clinique agréée par EMGS dans les sept jours suivant votre arrivée.",
        "conditions": "Licence : A level, IB, certificat de fin d'études secondaires, douzième année ou équivalent. Le baccalauréat du Sénégal figure sur la liste nationale malaisienne (MQA, décembre 2025) : il ouvre directement la licence, sans Foundation. L'université fixe ensuite ses notes minimales : faites-les confirmer par le bureau international.",
        "calendrier": "Licence, rentrée d'octobre 2026 : du 9 février au 30 août 2026, médecine jusqu'au 9 juin. Rentrée de mars 2027 : du 7 septembre 2026 au 30 janvier 2027. Master et doctorat en recherche : du 27 avril au 22 novembre 2026.",
        "langue": "Enseignement en anglais pour la plupart des programmes. Test d'anglais de moins de deux ans : IELTS, TOEFL, PTE ou MUET ; IELTS Indicator, TOEFL Home Edition et TOEFL ITP refusés. Sans test, une offre conditionnelle est possible, avec une date limite pour le fournir.",
        "fraisDossier": "500 ringgits par candidature selon la page de candidature 2026-2027 ; la foire aux questions indique 300 ringgits. Frais non remboursables ; le montant exact s'affiche au paiement.",
        "sources": [
          "https://study.um.edu.my/how-to-apply",
          "https://study.um.edu.my/faqs-amp-info",
          "https://study.um.edu.my/international-student",
          "https://study.um.edu.my/doc/tution-fee/Fee%20Structure,%20UG,%20International%20-%20Updated%2022%20Oct%202025.pdf",
          "https://www.mqa.gov.my/new/document/2025/The%20List%20of%20Entry%20Qualifications%20for%20International%20Student%20-%20December%202025.pdf"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "universiti-malaysia-pahang-pekan",
    "motif": "Malaisie : la liste nationale de la MQA (décembre 2025, lue sur l'original le 2026-09-25) classe le bac sénégalais au niveau 6, accès direct à la licence",
    "attendu": {
      "admission": {
        "fraisDossier": "Le document des frais de dossier en lien date de 2020 : montant à jour non publié.",
        "sources": [
          "https://admission.umpsa.edu.my/undergraduate/international-student-2",
          "https://admission.umpsa.edu.my/international-programme-offered",
          "https://admission.umpsa.edu.my/undergraduate-study/applied-science-international/bsp-material-technology-international",
          "https://bendahari.umpsa.edu.my/index.php/en/component/sppagebuilder/?view=page&id=249"
        ],
        "calendrier": "Licence : rentrée de septembre, candidatures jusqu'en juillet ; rentrée de février, jusqu'en décembre.",
        "verifieLe": "2026-09-25",
        "langue": "TOEFL papier 500 ou iBT 30-31, IELTS 4,0, MUET 3, PTE 36, ou Cambridge C1 ou C2 140. Sinon programme intensif d'anglais puis MUET 3. Dispense si l'anglais est la langue officielle de votre pays ou de vos études.",
        "procedure": "Choisissez un programme dans la liste ouverte aux étudiants internationaux, puis candidatez par le lien de la page d'admission internationale. Une fois admis, l'université demande pour vous le visa étudiant auprès d'EMGS, l'agence malaisienne des étudiants internationaux.",
        "conditions": "Certificat de fin d'études secondaires, A level ou équivalent, avec au moins C dans trois matières, ou un diplôme reconnu par la Malaisie. Le baccalauréat du Sénégal n'apparaît pas dans les conditions publiées : faites vérifier votre diplôme par le bureau international avant de candidater."
      }
    },
    "champs": {
      "admission": {
        "fraisDossier": "Le document des frais de dossier en lien date de 2020 : montant à jour non publié.",
        "sources": [
          "https://admission.umpsa.edu.my/undergraduate/international-student-2",
          "https://admission.umpsa.edu.my/international-programme-offered",
          "https://admission.umpsa.edu.my/undergraduate-study/applied-science-international/bsp-material-technology-international",
          "https://bendahari.umpsa.edu.my/index.php/en/component/sppagebuilder/?view=page&id=249",
          "https://www.mqa.gov.my/new/document/2025/The%20List%20of%20Entry%20Qualifications%20for%20International%20Student%20-%20December%202025.pdf"
        ],
        "calendrier": "Licence : rentrée de septembre, candidatures jusqu'en juillet ; rentrée de février, jusqu'en décembre.",
        "verifieLe": "2026-09-25",
        "langue": "TOEFL papier 500 ou iBT 30-31, IELTS 4,0, MUET 3, PTE 36, ou Cambridge C1 ou C2 140. Sinon programme intensif d'anglais puis MUET 3. Dispense si l'anglais est la langue officielle de votre pays ou de vos études.",
        "procedure": "Choisissez un programme dans la liste ouverte aux étudiants internationaux, puis candidatez par le lien de la page d'admission internationale. Une fois admis, l'université demande pour vous le visa étudiant auprès d'EMGS, l'agence malaisienne des étudiants internationaux.",
        "conditions": "Certificat de fin d'études secondaires, A level ou équivalent, avec au moins C dans trois matières, ou un diplôme reconnu par la Malaisie. Le baccalauréat du Sénégal figure sur la liste nationale malaisienne (MQA, décembre 2025) : il ouvre directement la licence, sans Foundation. L'université fixe ensuite ses notes minimales : faites-les confirmer par le bureau international."
      }
    }
  },
  {
    "collection": "universities",
    "id": "universiti-sains-malaysia-penang",
    "motif": "Malaisie : la liste nationale de la MQA (décembre 2025, lue sur l'original le 2026-09-25) classe le bac sénégalais au niveau 6, accès direct à la licence",
    "attendu": {
      "admission": {
        "fraisDossier": "100 ringgits par candidature, payés en ligne.",
        "sources": [
          "https://admission.usm.my/index.php/undergraduate/undergraduate-international",
          "https://admission.usm.my/index.php/undergraduate/undergraduate-international/how-to-apply-international",
          "https://admission.usm.my/images/LIST_OF_ENTRY_QUALIFICATIONS_FOR_INTERNATIONAL_STUDENT.compressed.pdf",
          "https://admission.usm.my/postgraduate/fee-pg",
          "https://pohon.usm.my/t_international.php"
        ],
        "calendrier": "Rentrée principale au premier semestre, en octobre ; les lettres d'admission définitives du premier semestre 2026-2027 ont été envoyées. Les dates de candidature ne sont pas publiées sur les pages internationales.",
        "verifieLe": "2026-09-25",
        "langue": "IELTS 5,0, TOEFL iBT 40, PTE Academic 47, Cambridge 154 ou MUET 3,5. Dispense si votre établissement précédent enseignait en anglais.",
        "procedure": "Candidature en ligne sur le portail international de l'USM : vous créez un compte, un numéro de dossier vous est envoyé par courriel, puis vous déposez diplômes, relevés, traductions s'ils ne sont ni en anglais ni en malais, test d'anglais, passeport et reçu des frais de dossier. Une fois admis, l'université demande pour vous le visa étudiant auprès d'EMGS, l'agence malaisienne des étudiants internationaux.",
        "conditions": "Au moins douze années d'études réussies et un diplôme de fin d'études secondaires ou équivalent reconnu par la Malaisie. Les résultats prévisionnels ou provisoires ne sont pas acceptés. Selon le programme, un entretien ou un test. La liste des diplômes de l'USM donne l'accès direct en licence au baccalauréat du Bénin, du Mali, du Niger, de Guinée, du Togo et de France. Le baccalauréat du Sénégal n'apparaît pas dans les conditions publiées : faites vérifier votre diplôme par le bureau international avant de candidater."
      }
    },
    "champs": {
      "admission": {
        "fraisDossier": "100 ringgits par candidature, payés en ligne.",
        "sources": [
          "https://admission.usm.my/index.php/undergraduate/undergraduate-international",
          "https://admission.usm.my/index.php/undergraduate/undergraduate-international/how-to-apply-international",
          "https://admission.usm.my/images/LIST_OF_ENTRY_QUALIFICATIONS_FOR_INTERNATIONAL_STUDENT.compressed.pdf",
          "https://admission.usm.my/postgraduate/fee-pg",
          "https://pohon.usm.my/t_international.php",
          "https://www.mqa.gov.my/new/document/2025/The%20List%20of%20Entry%20Qualifications%20for%20International%20Student%20-%20December%202025.pdf"
        ],
        "calendrier": "Rentrée principale au premier semestre, en octobre ; les lettres d'admission définitives du premier semestre 2026-2027 ont été envoyées. Les dates de candidature ne sont pas publiées sur les pages internationales.",
        "verifieLe": "2026-09-25",
        "langue": "IELTS 5,0, TOEFL iBT 40, PTE Academic 47, Cambridge 154 ou MUET 3,5. Dispense si votre établissement précédent enseignait en anglais.",
        "procedure": "Candidature en ligne sur le portail international de l'USM : vous créez un compte, un numéro de dossier vous est envoyé par courriel, puis vous déposez diplômes, relevés, traductions s'ils ne sont ni en anglais ni en malais, test d'anglais, passeport et reçu des frais de dossier. Une fois admis, l'université demande pour vous le visa étudiant auprès d'EMGS, l'agence malaisienne des étudiants internationaux.",
        "conditions": "Au moins douze années d'études réussies et un diplôme de fin d'études secondaires ou équivalent reconnu par la Malaisie. Les résultats prévisionnels ou provisoires ne sont pas acceptés. Selon le programme, un entretien ou un test. La liste des diplômes de l'USM donne l'accès direct en licence au baccalauréat du Bénin, du Mali, du Niger, de Guinée, du Togo et de France. Le baccalauréat du Sénégal figure sur la liste nationale malaisienne (MQA, décembre 2025) : il ouvre directement la licence, sans Foundation. L'université fixe ensuite ses notes minimales : faites-les confirmer par le bureau international."
      }
    }
  },
  {
    "collection": "universities",
    "id": "universiti-teknologi-petronas-seri-iskandar",
    "motif": "Malaisie : la liste nationale de la MQA (décembre 2025, lue sur l'original le 2026-09-25) classe le bac sénégalais au niveau 6, accès direct à la licence",
    "attendu": {
      "admission": {
        "fraisDossier": "50 dollars non remboursables, par virement.",
        "sources": [
          "https://www.utp.edu.my/Pages/Admission/Undergraduate/International/How-To-Apply.aspx",
          "https://www.utp.edu.my/Pages/Admission/Undergraduate/International/Entry-Requirement.aspx",
          "https://www.utp.edu.my/Pages/Admission/Undergraduate/International/Tuition-fees.aspx",
          "https://www.utp.edu.my/Pages/Admission/Postgraduate/International-Applicants/Tuition-fees.aspx"
        ],
        "calendrier": "Candidatures toute l'année. Rentrée de janvier 2027 : dépôt dès le 25 août, limite le 31 octobre 2026 ; mai 2027 : 23 décembre 2026 au 28 février 2027 ; septembre 2027 : 23 avril au 30 juin 2027.",
        "verifieLe": "2026-09-25",
        "langue": "IELTS 5,0 ou TOEFL iBT 40 en ingénierie, sciences et informatique ; 5,5 ou 46 en gestion ; ou lettre officielle attestant un enseignement en anglais.",
        "procedure": "Préparez en PDF passeport, photo, diplômes certifiés et traduits en anglais, test d'anglais et preuve de paiement des frais de dossier, puis remplissez le formulaire en ligne. Un dossier incomplet ou non certifié n'est pas traité. Une fois admis, l'université demande pour vous le visa étudiant auprès d'EMGS, l'agence malaisienne des étudiants internationaux.",
        "conditions": "A level ou équivalent avec au moins C ou 60 % dans les matières du programme, mathématiques, physique et chimie en ingénierie ; IB 24. Les autres diplômes reconnus par la Malaisie peuvent être étudiés. Le baccalauréat du Sénégal n'apparaît pas dans les conditions publiées : faites vérifier votre diplôme par le bureau international avant de candidater."
      }
    },
    "champs": {
      "admission": {
        "fraisDossier": "50 dollars non remboursables, par virement.",
        "sources": [
          "https://www.utp.edu.my/Pages/Admission/Undergraduate/International/How-To-Apply.aspx",
          "https://www.utp.edu.my/Pages/Admission/Undergraduate/International/Entry-Requirement.aspx",
          "https://www.utp.edu.my/Pages/Admission/Undergraduate/International/Tuition-fees.aspx",
          "https://www.utp.edu.my/Pages/Admission/Postgraduate/International-Applicants/Tuition-fees.aspx",
          "https://www.mqa.gov.my/new/document/2025/The%20List%20of%20Entry%20Qualifications%20for%20International%20Student%20-%20December%202025.pdf"
        ],
        "calendrier": "Candidatures toute l'année. Rentrée de janvier 2027 : dépôt dès le 25 août, limite le 31 octobre 2026 ; mai 2027 : 23 décembre 2026 au 28 février 2027 ; septembre 2027 : 23 avril au 30 juin 2027.",
        "verifieLe": "2026-09-25",
        "langue": "IELTS 5,0 ou TOEFL iBT 40 en ingénierie, sciences et informatique ; 5,5 ou 46 en gestion ; ou lettre officielle attestant un enseignement en anglais.",
        "procedure": "Préparez en PDF passeport, photo, diplômes certifiés et traduits en anglais, test d'anglais et preuve de paiement des frais de dossier, puis remplissez le formulaire en ligne. Un dossier incomplet ou non certifié n'est pas traité. Une fois admis, l'université demande pour vous le visa étudiant auprès d'EMGS, l'agence malaisienne des étudiants internationaux.",
        "conditions": "A level ou équivalent avec au moins C ou 60 % dans les matières du programme, mathématiques, physique et chimie en ingénierie ; IB 24. Les autres diplômes reconnus par la Malaisie peuvent être étudiés. Le baccalauréat du Sénégal figure sur la liste nationale malaisienne (MQA, décembre 2025) : il ouvre directement la licence, sans Foundation. L'université fixe ensuite ses notes minimales : faites-les confirmer par le bureau international."
      }
    }
  },
  {
    "collection": "universities",
    "id": "universiti-tenaga-nasional-kajang",
    "motif": "Malaisie : la liste nationale de la MQA (décembre 2025, lue sur l'original le 2026-09-25) classe le bac sénégalais au niveau 6, accès direct à la licence",
    "attendu": {
      "admission": {
        "fraisDossier": "Montant actuel non publié sur les pages d'admission.",
        "sources": [
          "https://www.uniten.edu.my/admission/",
          "https://www.uniten.edu.my/apply-now/international-students/",
          "https://www.uniten.edu.my/programme/undergraduate/bachelor-in-business-economics-honours/",
          "https://www.uniten.edu.my/programme/postgraduate/doctor-of-philosophy-engineering/"
        ],
        "calendrier": "Licence : rentrées de janvier, juin et septembre. Master et doctorat en recherche : rentrées de janvier et septembre.",
        "verifieLe": "2026-09-25",
        "langue": "Études supérieures : IELTS 5,0, MUET 3,5 ou Linguaskill 154. Seuil de licence non publié sur les pages de programme.",
        "procedure": "Vérifiez les conditions du programme, préparez vos pièces, puis remplissez le formulaire en ligne : un courriel de confirmation puis une lettre d'offre suivent. Pièces : passeport, diplômes et relevés certifiés traduits en anglais par un traducteur agréé, certificats d'anglais. Les frais d'inscription se paient deux jours avant l'inscription. Une fois admis, l'université demande pour vous le visa étudiant auprès d'EMGS, l'agence malaisienne des étudiants internationaux.",
        "conditions": "Licence d'économie : certificat de fin d'études secondaires avec au moins C, ou 60 %, en mathématiques, économie ou comptabilité ; IB 24. Génie mécanique : au moins C en mathématiques et en physique. Le baccalauréat du Sénégal n'apparaît pas dans les conditions publiées : faites vérifier votre diplôme par le bureau international avant de candidater."
      }
    },
    "champs": {
      "admission": {
        "fraisDossier": "Montant actuel non publié sur les pages d'admission.",
        "sources": [
          "https://www.uniten.edu.my/admission/",
          "https://www.uniten.edu.my/apply-now/international-students/",
          "https://www.uniten.edu.my/programme/undergraduate/bachelor-in-business-economics-honours/",
          "https://www.uniten.edu.my/programme/postgraduate/doctor-of-philosophy-engineering/",
          "https://www.mqa.gov.my/new/document/2025/The%20List%20of%20Entry%20Qualifications%20for%20International%20Student%20-%20December%202025.pdf"
        ],
        "calendrier": "Licence : rentrées de janvier, juin et septembre. Master et doctorat en recherche : rentrées de janvier et septembre.",
        "verifieLe": "2026-09-25",
        "langue": "Études supérieures : IELTS 5,0, MUET 3,5 ou Linguaskill 154. Seuil de licence non publié sur les pages de programme.",
        "procedure": "Vérifiez les conditions du programme, préparez vos pièces, puis remplissez le formulaire en ligne : un courriel de confirmation puis une lettre d'offre suivent. Pièces : passeport, diplômes et relevés certifiés traduits en anglais par un traducteur agréé, certificats d'anglais. Les frais d'inscription se paient deux jours avant l'inscription. Une fois admis, l'université demande pour vous le visa étudiant auprès d'EMGS, l'agence malaisienne des étudiants internationaux.",
        "conditions": "Licence d'économie : certificat de fin d'études secondaires avec au moins C, ou 60 %, en mathématiques, économie ou comptabilité ; IB 24. Génie mécanique : au moins C en mathématiques et en physique. Le baccalauréat du Sénégal figure sur la liste nationale malaisienne (MQA, décembre 2025) : il ouvre directement la licence, sans Foundation. L'université fixe ensuite ses notes minimales : faites-les confirmer par le bureau international."
      }
    }
  },
  {
    "collection": "universities",
    "id": "universiti-utara-malaysia-sintok",
    "motif": "Malaisie : la liste nationale de la MQA (décembre 2025, lue sur l'original le 2026-09-25) classe le bac sénégalais au niveau 6, accès direct à la licence",
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
        "coutIndicatif": "Seule grille de licence publiée, session 2022-2023 : 4 200 ringgits par semestre dans la plupart des licences, 4 700 en communication et informatique, 5 000 en droit et comptabilité, sur sept ou huit semestres, plus 2 000 d'inscription. Elle a plus de deux ans : les montants actuels peuvent être différents.",
        "calendrier": "L'université ne publie pas de date limite sur sa page d'admission internationale. La condition d'âge, entre 18 et 25 ans, se calcule à cette date limite : demandez-la au bureau international avant de préparer votre dossier."
      }
    },
    "champs": {
      "admission": {
        "fraisDossier": "175 ringgits ou 50 dollars pour les candidats hors Asie du Sud-Est.",
        "sources": [
          "https://www.uum.edu.my/admissions/application-guidelines/undergraduate-international",
          "https://www.uum.edu.my/processing-fees",
          "https://www.uum.edu.my/admissions/fees/postgraduate",
          "https://www.uum.edu.my/admissions/application-guidelines/postgraduate",
          "https://www.mqa.gov.my/new/document/2025/The%20List%20of%20Entry%20Qualifications%20for%20International%20Student%20-%20December%202025.pdf"
        ],
        "verifieLe": "2026-09-25",
        "langue": "Dispense pour les diplômés d'un pays d'enseignement en anglais, dont le Cameroun, le Ghana et le Nigeria, pas le Sénégal. Sinon cours intensif d'anglais, en septembre, février ou juin, puis MUET au niveau exigé.",
        "procedure": "Candidature en ligne sur le portail de l'UUM, avec la preuve de paiement des frais de dossier. Si votre pays impose un examen d'entrée à l'université, joignez-en le résultat. Une fois admis, l'université demande pour vous le visa étudiant auprès d'EMGS, l'agence malaisienne des étudiants internationaux.",
        "conditions": "Diplôme de fin d'études secondaires après 11 à 12 ans d'études, valable cinq ans après l'examen ; crédit en mathématiques et en anglais. Il faut avoir entre 18 et 25 ans à la date limite. Remplir les minimums ne garantit pas l'admission. Le baccalauréat du Sénégal figure sur la liste nationale malaisienne (MQA, décembre 2025) : il ouvre directement la licence, sans Foundation. L'université fixe ensuite ses notes minimales : faites-les confirmer par le bureau international.",
        "coutIndicatif": "Seule grille de licence publiée, session 2022-2023 : 4 200 ringgits par semestre dans la plupart des licences, 4 700 en communication et informatique, 5 000 en droit et comptabilité, sur sept ou huit semestres, plus 2 000 d'inscription. Elle a plus de deux ans : les montants actuels peuvent être différents.",
        "calendrier": "L'université ne publie pas de date limite sur sa page d'admission internationale. La condition d'âge, entre 18 et 25 ans, se calcule à cette date limite : demandez-la au bureau international avant de préparer votre dossier."
      }
    }
  },
  {
    "collection": "universities",
    "id": "hec-montreal-montreal",
    "motif": "Canada : HEC Montréal place en année préparatoire avec 12 années de scolarité OU MOINS (« plus de 12 années » pour l'accès direct), relu le 2026-09-25",
    "attendu": {
      "admission": {
        "fraisDossier": "346,23 $ pour un candidat international au B.A.A., non remboursables.",
        "sources": [
          "https://www.hec.ca/programmes/baccalaureats/baa/demande-admission",
          "https://www.hec.ca/programmes/baccalaureat/baa",
          "https://www.hec.ca/programmes/baccalaureat/baa-avec-annee-preparatoire",
          "https://www.hec.ca/a-propos",
          "https://www.canada.ca/fr/immigration-refugies-citoyennete/services/etudier-canada/permis-etudes/preparer/liste-etablissements-enseignement-designes.html"
        ],
        "calendrier": "Pour l'automne, les candidats hors Canada au B.A.A. déposent leur demande au plus tard le 1er février.",
        "verifieLe": "2026-09-24",
        "langue": "Il faut un français de niveau intermédiaire-avancé, prouvé par vos relevés de notes ou par un test de moins de 2 ans. Le parcours bilingue exige aussi l'anglais.",
        "procedure": "Demande en ligne dans HEC en ligne, sur ordinateur, en 30 à 45 minutes, puis dépôt des documents en PDF dans les 5 jours ouvrables. Avec moins de 12 années de scolarité, vous passez par le B.A.A. avec année préparatoire. Une fois admis, il vous faut le certificat d'acceptation du Québec, le CAQ, puis le permis d'études du Canada."
      }
    },
    "champs": {
      "admission": {
        "fraisDossier": "346,23 $ pour un candidat international au B.A.A., non remboursables.",
        "sources": [
          "https://www.hec.ca/programmes/baccalaureats/baa/demande-admission",
          "https://www.hec.ca/programmes/baccalaureat/baa",
          "https://www.hec.ca/programmes/baccalaureat/baa-avec-annee-preparatoire",
          "https://www.hec.ca/a-propos",
          "https://www.canada.ca/fr/immigration-refugies-citoyennete/services/etudier-canada/permis-etudes/preparer/liste-etablissements-enseignement-designes.html"
        ],
        "calendrier": "Pour l'automne, les candidats hors Canada au B.A.A. déposent leur demande au plus tard le 1er février.",
        "verifieLe": "2026-09-25",
        "langue": "Il faut un français de niveau intermédiaire-avancé, prouvé par vos relevés de notes ou par un test de moins de 2 ans. Le parcours bilingue exige aussi l'anglais.",
        "procedure": "Demande en ligne dans HEC en ligne, sur ordinateur, en 30 à 45 minutes, puis dépôt des documents en PDF dans les 5 jours ouvrables. Avec 12 années de scolarité ou moins (le bac marocain, par exemple), vous passez par le B.A.A. avec année préparatoire ; au-delà de 12 années, l'accès peut être direct. Une fois admis, il vous faut le certificat d'acceptation du Québec, le CAQ, puis le permis d'études du Canada."
      }
    }
  },
  {
    "collection": "universities",
    "id": "concordia-university-montreal",
    "motif": "Canada : Concordia range le bac sénégalais parmi les diplômes d'un programme de quatre ans (120 crédits) ; le « programme prolongé » (Extended Credit Program) vise le bac français et l'IB, relu le 2026-09-25",
    "attendu": {
      "admission": {
        "fraisDossier": "100 $ au premier cycle, non remboursables et sans dispense, payés par carte de crédit.",
        "sources": [
          "https://www.concordia.ca/admissions/undergraduate/apply-now.html",
          "https://www.concordia.ca/admissions/undergraduate/apply.html",
          "https://www.concordia.ca/admissions/undergraduate/international/africa.html",
          "https://www.concordia.ca/admissions/undergraduate/requirements/english-language-proficiency.html",
          "https://www.canada.ca/fr/immigration-refugies-citoyennete/services/etudier-canada/permis-etudes/preparer/liste-etablissements-enseignement-designes.html"
        ],
        "calendrier": "Au premier cycle, les étudiants internationaux déposent leur demande au plus tard le 1er février pour l'automne et le 1er août pour l'hiver. Aux cycles supérieurs, les dates varient selon le programme.",
        "verifieLe": "2026-09-24",
        "langue": "Anglais, sauf dispense : TOEFL iBT 70, IELTS Academic 6 sans note sous 5,5, Duolingo 105 ou un test équivalent, de moins de 2 ans.",
        "procedure": "Demande en ligne sur le portail de Concordia. Les titulaires d'un baccalauréat africain de système français, du Sénégal, de Côte d'Ivoire ou du Cameroun par exemple, entrent dans un programme prolongé de 120 crédits. Une fois admis, il vous faut le certificat d'acceptation du Québec, le CAQ, puis le permis d'études du Canada."
      }
    },
    "champs": {
      "admission": {
        "fraisDossier": "100 $ au premier cycle, non remboursables et sans dispense, payés par carte de crédit.",
        "sources": [
          "https://www.concordia.ca/admissions/undergraduate/apply-now.html",
          "https://www.concordia.ca/admissions/undergraduate/apply.html",
          "https://www.concordia.ca/admissions/undergraduate/international/africa.html",
          "https://www.concordia.ca/admissions/undergraduate/requirements/english-language-proficiency.html",
          "https://www.canada.ca/fr/immigration-refugies-citoyennete/services/etudier-canada/permis-etudes/preparer/liste-etablissements-enseignement-designes.html"
        ],
        "calendrier": "Au premier cycle, les étudiants internationaux déposent leur demande au plus tard le 1er février pour l'automne et le 1er août pour l'hiver. Aux cycles supérieurs, les dates varient selon le programme.",
        "verifieLe": "2026-09-25",
        "langue": "Anglais, sauf dispense : TOEFL iBT 70, IELTS Academic 6 sans note sous 5,5, Duolingo 105 ou un test équivalent, de moins de 2 ans.",
        "procedure": "Demande en ligne sur le portail de Concordia. Avec un baccalauréat du Sénégal, de Côte d'Ivoire, du Cameroun ou du Maroc, par exemple, vous candidatez à un programme de quatre ans (120 crédits). Une fois admis, il vous faut le certificat d'acceptation du Québec, le CAQ, puis le permis d'études du Canada."
      }
    }
  },
  {
    "collection": "universities",
    "id": "universite-babes-bolyai-cluj-napoca",
    "motif": "Roumanie : Babeș-Bolyai dispense du certificat les candidats d'un pays dont la langue officielle est celle du programme, relu le 2026-09-25",
    "attendu": {
      "admission": {
        "fraisDossier": "50 €, non remboursables, payés sur la plateforme après avoir rempli le formulaire.",
        "sources": [
          "https://cci.ubbcluj.ro/admission-international-students/candidates-from-other-countries/bachelor/",
          "https://cci.ubbcluj.ro/admission-international-students/candidates-from-other-countries/master-degree/",
          "https://www.ubbcluj.ro/en/despre/prezentare/istoric",
          "https://studyinromania.gov.ro/mfa_2026-2027"
        ],
        "calendrier": "Pour la rentrée 2026, les candidatures en licence et en master étaient ouvertes du 1er avril au 31 juillet 2026. Le calendrier de la rentrée 2027 n'est pas encore publié.",
        "verifieLe": "2026-09-24",
        "langue": "Il faut un certificat de langue accepté par l'université, pour la langue du programme ; une attestation délivrée par votre lycée ne suffit pas. Pour un programme en roumain, sans certificat de roumain, vous suivez d'abord une année préparatoire de langue roumaine.",
        "procedure": "Candidature en ligne sur la plateforme du Centre de coopération internationale : formulaire, paiement des frais de dossier, puis un seul fichier PDF avec toutes les pièces. L'université examine votre dossier, puis le transmet au ministère roumain de l'Éducation : c'est lui qui délivre la lettre d'acceptation aux études. Avec elle, vous demandez le visa d'études à l'ambassade de Roumanie. Comptez environ 40 jours ouvrés de traitement. Une fois la lettre reçue, vous avez 21 jours pour payer les frais de scolarité."
      }
    },
    "champs": {
      "admission": {
        "fraisDossier": "50 €, non remboursables, payés sur la plateforme après avoir rempli le formulaire.",
        "sources": [
          "https://cci.ubbcluj.ro/admission-international-students/candidates-from-other-countries/bachelor/",
          "https://cci.ubbcluj.ro/admission-international-students/candidates-from-other-countries/master-degree/",
          "https://www.ubbcluj.ro/en/despre/prezentare/istoric",
          "https://studyinromania.gov.ro/mfa_2026-2027"
        ],
        "calendrier": "Pour la rentrée 2026, les candidatures en licence et en master étaient ouvertes du 1er avril au 31 juillet 2026. Le calendrier de la rentrée 2027 n'est pas encore publié.",
        "verifieLe": "2026-09-25",
        "langue": "Il faut un certificat de langue accepté par l'université, pour la langue du programme ; une attestation délivrée par votre lycée ne suffit pas. Vous en êtes dispensé si la langue officielle de votre pays est celle du programme : le français pour un Sénégalais dans un programme en français. Pour un programme en roumain, sans certificat de roumain, vous suivez d'abord une année préparatoire de langue roumaine.",
        "procedure": "Candidature en ligne sur la plateforme du Centre de coopération internationale : formulaire, paiement des frais de dossier, puis un seul fichier PDF avec toutes les pièces. L'université examine votre dossier, puis le transmet au ministère roumain de l'Éducation : c'est lui qui délivre la lettre d'acceptation aux études. Avec elle, vous demandez le visa d'études à l'ambassade de Roumanie. Comptez environ 40 jours ouvrés de traitement. Une fois la lettre reçue, vous avez 21 jours pour payer les frais de scolarité."
      }
    }
  },
  {
    "collection": "universities",
    "id": "aix-marseille-universite-marseille",
    "motif": "France : Campus France Sénégal n'accepte en L1 que le bac de l'année ou de l'année précédente (critères de la campagne), relu le 2026-09-25",
    "attendu": {
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
    },
    "champs": {
      "admission": {
        "procedure": "Vous résidez au Sénégal : vous candidatez sur la plateforme Études en France de Campus France. Première année de licence : demande d'admission préalable sur Études en France. Licence 2, licence 3 et master : dossier Études en France aussi. Les étudiants hors Union européenne ne sont pas admis dans les licences d'accès santé.",
        "calendrier": "Rentrée 2027 au Sénégal : dossier Études en France du 1er octobre au 15 décembre 2026, frais payés au plus tard le 19 décembre 2026, choix de la formation confirmé au plus tard le 31 mai 2027, selon Campus France Sénégal. À la faculté des sciences, les commissions répondent au plus tard le 30 avril et l'étudiant confirme son choix au plus tard le 31 mai.",
        "conditions": "Première année de licence : diplôme de fin d'études secondaires hors Union européenne. Autres années : le diplôme du niveau précédent. Au Sénégal, en première année, Campus France n'accepte que le bac de l'année ou de l'année précédente, obtenu avec au plus une reprise ; sinon, il faut d'abord valider un cycle au Sénégal (BTS, DUT, licence) ; avec un bac série arabe L-AR, il faut un niveau B2 certifié en français.",
        "langue": "Le niveau dépend de la faculté. À la faculté d'économie et de gestion : TCF ou TEF niveau 4 au moins, DELF B2 ou DALF C.",
        "fraisDossier": "Aucun frais propre à l'université. Le dossier Études en France coûte 85 000 francs CFA au Sénégal, non remboursables, payés à Campus France.",
        "sources": [
          "https://sciences.univ-amu.fr/en/candidatures-inscriptions/candidater/campus-france",
          "https://feg.univ-amu.fr/en/application-registration/foreign-student-foreign-diploma",
          "https://www.univ-amu.fr/en/international-students/international-students-degree-programs/differential-tuition-fees-for-european-union-students",
          "https://www.senegal.campusfrance.org/calendrier-de-la-procedure",
          "https://www.senegal.campusfrance.org/les-questions-frequemment-posees",
          "https://www.senegal.campusfrance.org/criteres-d-eligibilite-pour-la-campagne-etudes-en-france"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "insa-lyon-villeurbanne",
    "motif": "France : Campus France Sénégal n'accepte en L1 que le bac de l'année ou de l'année précédente (critères de la campagne), relu le 2026-09-25",
    "attendu": {
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
    },
    "champs": {
      "admission": {
        "procedure": "Première année : candidature commune au Groupe INSA, en ligne, avec vos notes et une attestation officielle de français niveau C1 ; un jury admet ou refuse selon le dossier et les vœux. Vous pouvez viser les sept INSA et trois écoles partenaires. En même temps, inscrivez-vous sur Études en France en suivant son calendrier.",
        "calendrier": "Rentrée 2026 : dépôt du 19 janvier au 19 mars 2026, attestation de français au plus tard le 4 mai, résultats le 28 mai, réponse avant le 2 juin 2026. Les dates de la rentrée 2027 ne sont pas encore publiées.",
        "conditions": "Un baccalauréat étranger avec les mathématiques, délivré par un autre pays que la France. L'admission est prononcée sous réserve d'obtenir le bac. Au Sénégal, en première année, Campus France n'accepte que le bac de l'année ou de l'année précédente, obtenu avec au plus une reprise ; sinon, il faut d'abord valider un cycle au Sénégal (BTS, DUT, licence) ; avec un bac série arabe L-AR, il faut un niveau B2 certifié en français.",
        "langue": "Niveau C1 en français, prouvé par le DALF C1, exigé pour la première année.",
        "fraisDossier": "Droits de candidature au Groupe INSA : 105 €, quel que soit le nombre de vœux. Le dossier Études en France coûte 85 000 francs CFA au Sénégal.",
        "sources": [
          "https://www.groupe-insa.fr/preparer/comment-candidater/les-procedures/integrer-le-groupe-insa-en-1re-annee/bac-mathematiques-delivre-par-un-autre-pays-que-la-france",
          "https://www.insa-lyon.fr/fr/cout-etudes",
          "https://www.insa-lyon.fr/fr/admission-pour-etudiant-international",
          "https://www.senegal.campusfrance.org/les-questions-frequemment-posees",
          "https://www.senegal.campusfrance.org/criteres-d-eligibilite-pour-la-campagne-etudes-en-france"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "nantes-universite-nantes",
    "motif": "France : Campus France Sénégal n'accepte en L1 que le bac de l'année ou de l'année précédente (critères de la campagne), relu le 2026-09-25",
    "attendu": {
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
    },
    "champs": {
      "admission": {
        "procedure": "Vous résidez au Sénégal : candidature uniquement sur la plateforme Études en France. Première année de licence et BUT : demande d'admission préalable. Licence 2, licence 3, master 1 et master 2 : dossier Études en France aussi. Le doctorat suit une procédure à part.",
        "calendrier": "Rentrée 2027 au Sénégal : dossier Études en France du 1er octobre au 15 décembre 2026, frais payés au plus tard le 19 décembre 2026, choix de la formation confirmé au plus tard le 31 mai 2027, selon Campus France Sénégal. Pour la rentrée 2026, l'université fermait les candidatures le 15 décembre 2025 en licence 1 et le 31 janvier 2026 de la licence 2 au master 2.",
        "conditions": "Procédure réservée aux étudiants qui n'ont jamais été inscrits dans l'enseignement supérieur français. Au Sénégal, en première année, Campus France n'accepte que le bac de l'année ou de l'année précédente, obtenu avec au plus une reprise ; sinon, il faut d'abord valider un cycle au Sénégal (BTS, DUT, licence) ; avec un bac série arabe L-AR, il faut un niveau B2 certifié en français.",
        "langue": "En principe TCF niveau 4, soit B2, avec 14 sur 20 à l'épreuve écrite, ou DELF B2 ou DALF. Les élèves des pays où le français est la seule langue officielle, dont le Sénégal, en sont dispensés s'ils ont fait tout le secondaire en français.",
        "fraisDossier": "Aucun frais propre à l'université. Le dossier Études en France coûte 85 000 francs CFA au Sénégal, non remboursables, payés à Campus France.",
        "sources": [
          "https://www.univ-nantes.fr/international/venir-a-nantes/hors-echange",
          "https://www.univ-nantes.fr/formation/scolarite-inscriptions/droits-universitaires-situation",
          "https://www.senegal.campusfrance.org/calendrier-de-la-procedure",
          "https://www.senegal.campusfrance.org/les-questions-frequemment-posees",
          "https://www.senegal.campusfrance.org/criteres-d-eligibilite-pour-la-campagne-etudes-en-france"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "sorbonne-universite-paris",
    "motif": "France : Campus France Sénégal n'accepte en L1 que le bac de l'année ou de l'année précédente (critères de la campagne), relu le 2026-09-25",
    "attendu": {
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
    },
    "champs": {
      "admission": {
        "procedure": "Vous résidez au Sénégal : candidature sur la plateforme Études en France. Première année de licence : demande d'admission préalable, en conseillant de viser plusieurs universités. Licence 2, licence 3 et master : dossier Études en France aussi.",
        "calendrier": "Rentrée 2027 au Sénégal : dossier Études en France du 1er octobre au 15 décembre 2026, frais payés au plus tard le 19 décembre 2026, choix de la formation confirmé au plus tard le 31 mai 2027, selon Campus France Sénégal. Pour la rentrée 2026, la faculté des sciences fixait la demande d'admission préalable du 1er octobre 2025 au 15 janvier 2026.",
        "conditions": "Première année de licence : diplôme de fin d'études secondaires hors Union européenne. Autres années : le diplôme du niveau précédent. Au Sénégal, en première année, Campus France n'accepte que le bac de l'année ou de l'année précédente, obtenu avec au plus une reprise ; sinon, il faut d'abord valider un cycle au Sénégal (BTS, DUT, licence) ; avec un bac série arabe L-AR, il faut un niveau B2 certifié en français.",
        "langue": "Faculté des sciences, licence : niveau B2 au moins, prouvé par le TCF, le TEF ou le DELF. Faculté des lettres : test de français B2 en licence et C1 en master, sans dispense pour les diplômés en langue ou littérature françaises.",
        "fraisDossier": "Aucun frais propre à l'université. Le dossier Études en France coûte 85 000 francs CFA au Sénégal, non remboursables, payés à Campus France.",
        "sources": [
          "https://sciences.sorbonne-universite.fr/international-1/venir-la-faculte/etudiantes-et-etudiants-internationaux/venir-titre-individuel-0",
          "https://lettres.sorbonne-universite.fr/formation/inscription/etudiants-non-europeens",
          "https://www.sorbonne-universite.fr/en/education/study-sorbonne-university/enrolment-procedures-and-tuition-fees",
          "https://www.senegal.campusfrance.org/calendrier-de-la-procedure",
          "https://www.senegal.campusfrance.org/criteres-d-eligibilite-pour-la-campagne-etudes-en-france"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "universite-claude-bernard-lyon-1-villeurbanne",
    "motif": "France : Campus France Sénégal n'accepte en L1 que le bac de l'année ou de l'année précédente (critères de la campagne), relu le 2026-09-25",
    "attendu": {
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
    },
    "champs": {
      "admission": {
        "procedure": "Vous résidez au Sénégal : procédure Études en France obligatoire. Première année de licence : seule la licence 1 portail PCSI est ouverte à la demande d'admission préalable. Licence 2, licence 3 et master : dossier Études en France, hors demande d'admission préalable.",
        "calendrier": "Rentrée 2027 au Sénégal : dossier Études en France du 1er octobre au 15 décembre 2026, frais payés au plus tard le 19 décembre 2026, choix de la formation confirmé au plus tard le 31 mai 2027, selon Campus France Sénégal.",
        "conditions": "Première année : diplôme de fin d'études secondaires étranger. Autres années : le diplôme du niveau précédent. Au Sénégal, en première année, Campus France n'accepte que le bac de l'année ou de l'année précédente, obtenu avec au plus une reprise ; sinon, il faut d'abord valider un cycle au Sénégal (BTS, DUT, licence) ; avec un bac série arabe L-AR, il faut un niveau B2 certifié en français.",
        "langue": "Niveau B2 : TCF niveau 4, TEF niveau 4 ou DELF B2. Les candidats des pays officiellement et exclusivement francophones, dont le Sénégal, en sont dispensés.",
        "fraisDossier": "Aucun frais propre à l'université. Le dossier Études en France coûte 85 000 francs CFA au Sénégal, non remboursables, payés à Campus France.",
        "sources": [
          "https://www.univ-lyon1.fr/formation/inscription-et-scolarite/inscription-candidats-internationaux-hors-echange-comment-candidater",
          "https://www.univ-lyon1.fr/formation/inscription-et-scolarite/etudiantes-et-etudiants-internationaux-droits-dinscription-differencies-et-exonerations",
          "https://www.senegal.campusfrance.org/calendrier-de-la-procedure",
          "https://www.senegal.campusfrance.org/les-questions-frequemment-posees",
          "https://www.senegal.campusfrance.org/criteres-d-eligibilite-pour-la-campagne-etudes-en-france"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "universite-cote-d-azur-nice",
    "motif": "France : Campus France Sénégal n'accepte en L1 que le bac de l'année ou de l'année précédente (critères de la campagne), relu le 2026-09-25",
    "attendu": {
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
    },
    "champs": {
      "admission": {
        "procedure": "Vous résidez au Sénégal : toute candidature passe par la plateforme Études en France, de la première année de licence au master. Première année : demande d'admission préalable. Mon Master et eCandidat ne concernent que les candidats hors pays Études en France.",
        "calendrier": "Rentrée 2027 au Sénégal : dossier Études en France du 1er octobre au 15 décembre 2026, frais payés au plus tard le 19 décembre 2026, choix de la formation confirmé au plus tard le 31 mai 2027, selon Campus France Sénégal.",
        "conditions": "Première année : diplôme de fin d'études secondaires obtenu hors Union européenne. Autres années : le diplôme du niveau précédent. Au Sénégal, en première année, Campus France n'accepte que le bac de l'année ou de l'année précédente, obtenu avec au plus une reprise ; sinon, il faut d'abord valider un cycle au Sénégal (BTS, DUT, licence) ; avec un bac série arabe L-AR, il faut un niveau B2 certifié en français.",
        "langue": "Le niveau de français est vérifié dans le dossier Études en France ; l'université ne publie pas de seuil général.",
        "fraisDossier": "Aucun frais propre à l'université. Le dossier Études en France coûte 85 000 francs CFA au Sénégal, non remboursables, payés à Campus France.",
        "sources": [
          "https://univ-cotedazur.fr/formation/candidater-et-s-inscrire/candidater/candidater-en-master",
          "https://univ-cotedazur.fr/formation/candidater-et-s-inscrire/candidater/candidater-en-licence-2-licence-3-licence-professionnelle",
          "https://univ-cotedazur.fr/formation/candidater-et-s-inscrire/droits-dinscription",
          "https://www.senegal.campusfrance.org/calendrier-de-la-procedure",
          "https://www.senegal.campusfrance.org/criteres-d-eligibilite-pour-la-campagne-etudes-en-france"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "universite-de-bordeaux-bordeaux",
    "motif": "France : Campus France Sénégal n'accepte en L1 que le bac de l'année ou de l'année précédente (critères de la campagne), relu le 2026-09-25",
    "attendu": {
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
    },
    "champs": {
      "admission": {
        "procedure": "Vous résidez au Sénégal : candidature sur la plateforme Études en France de Campus France. Première année de licence : demande d'admission préalable. Licence 2, licence 3 et master : dossier Études en France, étudié ensuite par Campus France et par l'université.",
        "calendrier": "Rentrée 2027 au Sénégal : dossier Études en France du 1er octobre au 15 décembre 2026, frais payés au plus tard le 19 décembre 2026, choix de la formation confirmé au plus tard le 31 mai 2027, selon Campus France Sénégal. Selon l'université, les dossiers sont étudiés d'avril à juin, et l'inscription a lieu de juillet à septembre.",
        "conditions": "Première année : diplôme donnant accès à l'enseignement supérieur dans votre pays. Autres années : le diplôme du niveau précédent. Au Sénégal, en première année, Campus France n'accepte que le bac de l'année ou de l'année précédente, obtenu avec au plus une reprise ; sinon, il faut d'abord valider un cycle au Sénégal (BTS, DUT, licence) ; avec un bac série arabe L-AR, il faut un niveau B2 certifié en français.",
        "langue": "Le niveau dépend de la faculté. La faculté de droit demande par exemple un niveau B2 dans les quatre compétences, prouvé par TCF, DELF ou DALF de moins de deux ans.",
        "fraisDossier": "Aucun frais propre à l'université. Le dossier Études en France coûte 85 000 francs CFA au Sénégal, non remboursables, payés à Campus France.",
        "sources": [
          "https://www.u-bordeaux.fr/International/venir-bordeaux/etudiants-internationaux/admission-diplome",
          "https://droit.u-bordeaux.fr/international/etudier-bordeaux/candidatures-individuelles",
          "https://www.u-bordeaux.fr/formation/candidatures-et-inscriptions/cout-des-etudes/etudiants-extra-communautaires",
          "https://www.senegal.campusfrance.org/calendrier-de-la-procedure",
          "https://www.senegal.campusfrance.org/criteres-d-eligibilite-pour-la-campagne-etudes-en-france"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "universite-de-lille-lille",
    "motif": "France : Campus France Sénégal n'accepte en L1 que le bac de l'année ou de l'année précédente (critères de la campagne), relu le 2026-09-25",
    "attendu": {
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
    },
    "champs": {
      "admission": {
        "procedure": "Vous résidez au Sénégal : candidature sur la plateforme Études en France de Campus France. Première année de licence : demande d'admission préalable sur Études en France. Master : dossier Études en France aussi. L'université propose un outil en ligne qui indique la bonne procédure selon votre profil.",
        "calendrier": "Rentrée 2027 au Sénégal : dossier Études en France du 1er octobre au 15 décembre 2026, frais payés au plus tard le 19 décembre 2026, choix de la formation confirmé au plus tard le 31 mai 2027, selon Campus France Sénégal.",
        "conditions": "Licence : un diplôme qui donne accès aux études supérieures. Master : dossier étudié au cas par cas par l'équipe pédagogique. Au Sénégal, en première année, Campus France n'accepte que le bac de l'année ou de l'année précédente, obtenu avec au plus une reprise ; sinon, il faut d'abord valider un cycle au Sénégal (BTS, DUT, licence) ; avec un bac série arabe L-AR, il faut un niveau B2 certifié en français.",
        "langue": "Une certification de français de niveau B2 au moins, sauf dispense ; certaines licences demandent plus, comme le C1 pour la licence bilingue de sciences de la vie.",
        "fraisDossier": "Aucun frais propre à l'université. Le dossier Études en France coûte 85 000 francs CFA au Sénégal, non remboursables, payés à Campus France.",
        "sources": [
          "https://international.univ-lille.fr/venir-a-luniversite-de-lille/je-suis-etudiant/hors-programme-dechange",
          "https://www.univ-lille.fr/formation/exoneration",
          "https://www.univ-lille.fr/formation/droits-dinscription",
          "https://www.senegal.campusfrance.org/calendrier-de-la-procedure",
          "https://www.senegal.campusfrance.org/criteres-d-eligibilite-pour-la-campagne-etudes-en-france"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "universite-de-lorraine-nancy",
    "motif": "France : Campus France Sénégal n'accepte en L1 que le bac de l'année ou de l'année précédente (critères de la campagne), relu le 2026-09-25",
    "attendu": {
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
    },
    "champs": {
      "admission": {
        "procedure": "Vous résidez au Sénégal : candidature sur la plateforme Études en France de Campus France. Première année de licence : demande d'admission préalable. Licence 2, licence 3 et master : dossier Études en France aussi. Après l'accord, vérifiez sur Études en France les conditions d'inscription de votre formation.",
        "calendrier": "Rentrée 2027 au Sénégal : dossier Études en France du 1er octobre au 15 décembre 2026, frais payés au plus tard le 19 décembre 2026, choix de la formation confirmé au plus tard le 31 mai 2027, selon Campus France Sénégal.",
        "conditions": "Première année : diplôme de fin d'études secondaires. Autres années : le diplôme du niveau précédent. Au Sénégal, en première année, Campus France n'accepte que le bac de l'année ou de l'année précédente, obtenu avec au plus une reprise ; sinon, il faut d'abord valider un cycle au Sénégal (BTS, DUT, licence) ; avec un bac série arabe L-AR, il faut un niveau B2 certifié en français.",
        "langue": "Le niveau de français est vérifié dans le dossier Études en France ; l'université ne publie pas de seuil général.",
        "fraisDossier": "Aucun frais propre à l'université. Le dossier Études en France coûte 85 000 francs CFA au Sénégal, non remboursables, payés à Campus France.",
        "sources": [
          "https://www.univ-lorraine.fr/welcome/candidater-hors-programme-dechange/",
          "https://www.univ-lorraine.fr/enseignements-et-formations/sinscrire-a-l-universite-de-lorraine/",
          "https://www.senegal.campusfrance.org/calendrier-de-la-procedure",
          "https://www.senegal.campusfrance.org/les-questions-frequemment-posees",
          "https://www.senegal.campusfrance.org/criteres-d-eligibilite-pour-la-campagne-etudes-en-france"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "universite-de-montpellier-montpellier",
    "motif": "France : Campus France Sénégal n'accepte en L1 que le bac de l'année ou de l'année précédente (critères de la campagne), relu le 2026-09-25",
    "attendu": {
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
    },
    "champs": {
      "admission": {
        "procedure": "Vous résidez au Sénégal : candidature d'abord sur la plateforme Études en France, avant toute inscription. Première année de licence : demande d'admission préalable. Licence 2, licence 3 et master : dossier Études en France aussi. Une demande faite en dehors de Campus France est rejetée.",
        "calendrier": "Rentrée 2027 au Sénégal : dossier Études en France du 1er octobre au 15 décembre 2026, frais payés au plus tard le 19 décembre 2026, choix de la formation confirmé au plus tard le 31 mai 2027, selon Campus France Sénégal.",
        "conditions": "Un diplôme qui donne accès à la formation visée. Au Sénégal, en première année, Campus France n'accepte que le bac de l'année ou de l'année précédente, obtenu avec au plus une reprise ; sinon, il faut d'abord valider un cycle au Sénégal (BTS, DUT, licence) ; avec un bac série arabe L-AR, il faut un niveau B2 certifié en français.",
        "langue": "Le niveau dépend de la faculté. La faculté des sciences demande le niveau B2 au TCF, ou un équivalent.",
        "fraisDossier": "Aucun frais propre à l'université. Le dossier Études en France coûte 85 000 francs CFA au Sénégal, non remboursables, payés à Campus France.",
        "sources": [
          "https://www.umontpellier.fr/international/etudier-a-letranger/venir-etudier-a-luniversite-de-montpellier",
          "https://sciences.edu.umontpellier.fr/relations-internationales/etudiants-hors-programmes-dechanges-in-individual-enrolment/",
          "https://www.umontpellier.fr/wp-content/uploads/2026/07/droits-differencies.pdf",
          "https://www.senegal.campusfrance.org/calendrier-de-la-procedure",
          "https://www.senegal.campusfrance.org/criteres-d-eligibilite-pour-la-campagne-etudes-en-france"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "universite-de-rennes-rennes",
    "motif": "France : Campus France Sénégal n'accepte en L1 que le bac de l'année ou de l'année précédente (critères de la campagne), relu le 2026-09-25",
    "attendu": {
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
    },
    "champs": {
      "admission": {
        "procedure": "Vous résidez au Sénégal : pour la licence, le master ou le doctorat, vous suivez la procédure Études en France de Campus France Sénégal. Première année de licence : demande d'admission préalable.",
        "calendrier": "Rentrée 2027 au Sénégal : dossier Études en France du 1er octobre au 15 décembre 2026, frais payés au plus tard le 19 décembre 2026, choix de la formation confirmé au plus tard le 31 mai 2027, selon Campus France Sénégal.",
        "conditions": "Un diplôme qui donne accès à la formation visée. Au Sénégal, en première année, Campus France n'accepte que le bac de l'année ou de l'année précédente, obtenu avec au plus une reprise ; sinon, il faut d'abord valider un cycle au Sénégal (BTS, DUT, licence) ; avec un bac série arabe L-AR, il faut un niveau B2 certifié en français.",
        "langue": "Le niveau dépend de la formation : les masters de l'école d'informatique et d'électronique demandent par exemple le niveau C1 avec un diplôme étranger.",
        "fraisDossier": "Aucun frais propre à l'université. Le dossier Études en France coûte 85 000 francs CFA au Sénégal, non remboursables, payés à Campus France.",
        "sources": [
          "https://www.univ-rennes.fr/candidature-et-inscription-des-etudiants-internationaux-luniversite-de-rennes",
          "https://istic.univ-rennes.fr/candidatures-et-admissions-en-master",
          "https://formations.univ-rennes.fr/droits-dinscription-bourses-et-exonerations-pour-les-etudiantes-et-etudiants-internationaux",
          "https://www.senegal.campusfrance.org/calendrier-de-la-procedure",
          "https://www.senegal.campusfrance.org/criteres-d-eligibilite-pour-la-campagne-etudes-en-france"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "universite-de-strasbourg-strasbourg",
    "motif": "France : Campus France Sénégal n'accepte en L1 que le bac de l'année ou de l'année précédente (critères de la campagne), relu le 2026-09-25",
    "attendu": {
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
    },
    "champs": {
      "admission": {
        "procedure": "Vous résidez au Sénégal : inscription sur la plateforme Études en France et suivi de sa procédure, pour la première année de licence par demande d'admission préalable, pour les autres années de licence et pour le master. Les dossiers envoyés par une autre voie ne sont pas examinés.",
        "calendrier": "Rentrée 2027 au Sénégal : dossier Études en France du 1er octobre au 15 décembre 2026, frais payés au plus tard le 19 décembre 2026, choix de la formation confirmé au plus tard le 31 mai 2027, selon Campus France Sénégal.",
        "conditions": "Un diplôme qui donne accès à la formation visée ; en master, l'université vérifie que votre parcours correspond. Au Sénégal, en première année, Campus France n'accepte que le bac de l'année ou de l'année précédente, obtenu avec au plus une reprise ; sinon, il faut d'abord valider un cycle au Sénégal (BTS, DUT, licence) ; avec un bac série arabe L-AR, il faut un niveau B2 certifié en français.",
        "langue": "Le niveau dépend de la faculté ; la faculté de mathématiques et d'informatique demande par exemple le niveau B2.",
        "fraisDossier": "Aucun frais propre à l'université. Le dossier Études en France coûte 85 000 francs CFA au Sénégal, non remboursables, payés à Campus France.",
        "sources": [
          "https://www.unistra.fr/candidats-internationaux",
          "https://mathinfo.unistra.fr/en/admissions/admissions/",
          "https://en.unistra.fr/fr/droits-dinscription",
          "https://www.senegal.campusfrance.org/calendrier-de-la-procedure",
          "https://www.senegal.campusfrance.org/criteres-d-eligibilite-pour-la-campagne-etudes-en-france"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "universite-de-toulouse-toulouse",
    "motif": "France : Campus France Sénégal n'accepte en L1 que le bac de l'année ou de l'année précédente (critères de la campagne), relu le 2026-09-25",
    "attendu": {
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
    },
    "champs": {
      "admission": {
        "procedure": "Vous résidez au Sénégal : candidature sur le site Campus France de votre pays, par Études en France. Première année de licence : demande d'admission préalable. Seuls les dossiers complets validés par Études en France sont transmis à l'université.",
        "calendrier": "Rentrée 2027 au Sénégal : dossier Études en France du 1er octobre au 15 décembre 2026, frais payés au plus tard le 19 décembre 2026, choix de la formation confirmé au plus tard le 31 mai 2027, selon Campus France Sénégal.",
        "conditions": "Un diplôme étranger qui donne accès à la formation visée dans votre pays. Au Sénégal, en première année, Campus France n'accepte que le bac de l'année ou de l'année précédente, obtenu avec au plus une reprise ; sinon, il faut d'abord valider un cycle au Sénégal (BTS, DUT, licence) ; avec un bac série arabe L-AR, il faut un niveau B2 certifié en français.",
        "langue": "Niveau vérifié par le TCF : C1 en PASS, B2 en sciences ou en STAPS, C1 pour la licence 1 sciences et humanités.",
        "fraisDossier": "Aucun frais propre à l'université. Le dossier Études en France coûte 85 000 francs CFA au Sénégal, non remboursables, payés à Campus France.",
        "sources": [
          "https://www.utoulouse.fr/candidatures/candidates-et-candidats-de-nationalite-etrangere-titulaires-d-un-diplome-etranger-residant-a-l-etranger-candidature-en-premiere-annee",
          "https://www.utoulouse.fr/candidatures/candidature-en-m2-pour-les-titulaires-d-un-diplome-obtenu-a-l-etranger",
          "https://www.utoulouse.fr/conseils/075-droits-dinscription-differencies-2026-2027",
          "https://www.senegal.campusfrance.org/calendrier-de-la-procedure",
          "https://www.senegal.campusfrance.org/criteres-d-eligibilite-pour-la-campagne-etudes-en-france"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "universite-grenoble-alpes-grenoble",
    "motif": "France : Campus France Sénégal n'accepte en L1 que le bac de l'année ou de l'année précédente (critères de la campagne), relu le 2026-09-25",
    "attendu": {
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
      }
    },
    "champs": {
      "admission": {
        "procedure": "Vous résidez au Sénégal : candidature sur la plateforme Études en France pour tous les niveaux. Première année de licence : trois vœux au plus, tous établissements confondus. Licence 2, licence 3 et master : sept vœux au plus. Les services de coopération étudient les dossiers, puis l'université répond.",
        "calendrier": "Rentrée 2027 au Sénégal : dossier Études en France du 1er octobre au 15 décembre 2026, frais payés au plus tard le 19 décembre 2026, choix de la formation confirmé au plus tard le 31 mai 2027, selon Campus France Sénégal. Pour la rentrée 2026, l'université examinait les dossiers jusqu'au 15 mars 2026.",
        "conditions": "Première année : diplôme de fin d'études secondaires. Autres années : le diplôme du niveau précédent. Au Sénégal, en première année, Campus France n'accepte que le bac de l'année ou de l'année précédente, obtenu avec au plus une reprise ; sinon, il faut d'abord valider un cycle au Sénégal (BTS, DUT, licence) ; avec un bac série arabe L-AR, il faut un niveau B2 certifié en français.",
        "langue": "Le niveau de français est vérifié dans le dossier Études en France ; chaque formation peut fixer le sien.",
        "fraisDossier": "Aucun frais propre à l'université. Le dossier Études en France coûte 85 000 francs CFA au Sénégal, non remboursables, payés à Campus France.",
        "sources": [
          "https://etudier.univ-grenoble-alpes.fr/candidater-et-vous-inscrire/candidature/toutes-les-procedures/candidater-sur-la-plateforme-etudes-en-france-pef-/candidater-a-une-formation-sur-la-plateforme-etudes-en-france-pef--1615793.kjsp",
          "https://www.univ-grenoble-alpes.fr/etudiants-internationaux-ce-que-change-le-nouveau-decret-sur-les-droits-d-inscription-a-l-uga-1775870.kjsp",
          "https://www.senegal.campusfrance.org/calendrier-de-la-procedure",
          "https://www.senegal.campusfrance.org/les-questions-frequemment-posees",
          "https://www.senegal.campusfrance.org/criteres-d-eligibilite-pour-la-campagne-etudes-en-france"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "universite-paris-1-pantheon-sorbonne-paris",
    "motif": "France : Campus France Sénégal n'accepte en L1 que le bac de l'année ou de l'année précédente (critères de la campagne), relu le 2026-09-25",
    "attendu": {
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
      }
    },
    "champs": {
      "admission": {
        "procedure": "Vous résidez au Sénégal : licence 1, licence 2, licence 3 et master 1 passent par Études en France ; en licence 1, c'est la demande d'admission préalable. Joignez vos relevés, vos diplômes traduits en français par un traducteur professionnel si besoin, et le justificatif de l'examen d'accès à l'université de votre pays s'il en existe un.",
        "calendrier": "Rentrée 2027 au Sénégal : dossier Études en France du 1er octobre au 15 décembre 2026, frais payés au plus tard le 19 décembre 2026, choix de la formation confirmé au plus tard le 31 mai 2027, selon Campus France Sénégal.",
        "conditions": "Première année : diplôme de fin d'études secondaires. Autres années : le diplôme du niveau précédent. Au Sénégal, en première année, Campus France n'accepte que le bac de l'année ou de l'année précédente, obtenu avec au plus une reprise ; sinon, il faut d'abord valider un cycle au Sénégal (BTS, DUT, licence) ; avec un bac série arabe L-AR, il faut un niveau B2 certifié en français.",
        "langue": "Niveau B2 en licence 1 et 2, C1 en licence 3 et en master, par DELF, DALF ou TCF. L'attestation n'est exigée que des ressortissants de pays où le français n'est pas langue officielle.",
        "fraisDossier": "Aucun frais propre à l'université. Le dossier Études en France coûte 85 000 francs CFA au Sénégal, non remboursables, payés à Campus France.",
        "sources": [
          "https://international.pantheonsorbonne.fr/venir-paris-1-pantheon-sorbonne/etudiant-en-mobilite-individuelle",
          "https://international.pantheonsorbonne.fr/sites/default/files/2026-03/Schema_DIF_26-27_03-26_FR_0.pdf",
          "https://www.pantheonsorbonne.fr/inscription/frais-dinscription",
          "https://www.senegal.campusfrance.org/calendrier-de-la-procedure",
          "https://www.senegal.campusfrance.org/criteres-d-eligibilite-pour-la-campagne-etudes-en-france"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "universite-paris-cite-paris",
    "motif": "France : Campus France Sénégal n'accepte en L1 que le bac de l'année ou de l'année précédente (critères de la campagne), relu le 2026-09-25",
    "attendu": {
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
    },
    "champs": {
      "admission": {
        "procedure": "Vous résidez au Sénégal : procédure Études en France de la licence 2 au master 2 ; Mon Master et eCandidat ne sont pas pour vous. Première année de licence : demande d'admission préalable sur Études en France.",
        "calendrier": "Rentrée 2027 au Sénégal : dossier Études en France du 1er octobre au 15 décembre 2026, frais payés au plus tard le 19 décembre 2026, choix de la formation confirmé au plus tard le 31 mai 2027, selon Campus France Sénégal.",
        "conditions": "Le diplôme du niveau précédent. Au Sénégal, en première année, Campus France n'accepte que le bac de l'année ou de l'année précédente, obtenu avec au plus une reprise ; sinon, il faut d'abord valider un cycle au Sénégal (BTS, DUT, licence) ; avec un bac série arabe L-AR, il faut un niveau B2 certifié en français.",
        "langue": "Le niveau de français est vérifié dans le dossier Études en France ; l'université ne publie pas de seuil général.",
        "fraisDossier": "Aucun frais propre à l'université. Le dossier Études en France coûte 85 000 francs CFA au Sénégal, non remboursables, payés à Campus France.",
        "sources": [
          "https://u-paris.fr/candidater-a-universite-paris-cite/",
          "https://u-paris.fr/demande-dadmission-prealable/",
          "https://u-paris.fr/droits-dinscription-tarifs-exonerations/",
          "https://www.senegal.campusfrance.org/calendrier-de-la-procedure",
          "https://www.senegal.campusfrance.org/criteres-d-eligibilite-pour-la-campagne-etudes-en-france"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "universite-paris-dauphine-psl-paris",
    "motif": "France : Campus France Sénégal n'accepte en L1 que le bac de l'année ou de l'année précédente (critères de la campagne), relu le 2026-09-25",
    "attendu": {
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
    },
    "champs": {
      "admission": {
        "procedure": "Première année de licence avec un bac étranger : demande d'admission préalable sur Études en France. Licence 2 et 3, magistère et master 2 : dossier en ligne sur MyCandidature, le site de Dauphine ; certains masters 1 passent par la plateforme nationale. Un résident du Sénégal dépose aussi un dossier Études en France pour le visa.",
        "calendrier": "Rentrée 2026 : masters 1 sur MyCandidature du 15 janvier au 24 février 2026, masters 2 jusqu'au 23 février. Le calendrier 2027 n'est pas encore publié. Rentrée 2027 au Sénégal : dossier Études en France du 1er octobre au 15 décembre 2026, frais payés au plus tard le 19 décembre 2026, choix de la formation confirmé au plus tard le 31 mai 2027, selon Campus France Sénégal.",
        "conditions": "Première année : un baccalauréat étranger. Autres années : le diplôme du niveau précédent. Au Sénégal, en première année, Campus France n'accepte que le bac de l'année ou de l'année précédente, obtenu avec au plus une reprise ; sinon, il faut d'abord valider un cycle au Sénégal (BTS, DUT, licence) ; avec un bac série arabe L-AR, il faut un niveau B2 certifié en français.",
        "langue": "Le niveau de français est vérifié dans le dossier ; les parcours en anglais demandent au moins B2 en anglais.",
        "fraisDossier": "Aucun frais de candidature propre à Dauphine. Le dossier Études en France coûte 85 000 francs CFA au Sénégal, non remboursables.",
        "sources": [
          "https://dauphine.psl.eu/international/venir-etudier-a-luniversite-paris-dauphine-psl/etudiants-internationaux/comment-postuler",
          "https://dauphine.psl.eu/formations/scolarite/droits-et-tarifs",
          "https://dauphine.psl.eu/faq",
          "https://www.senegal.campusfrance.org/calendrier-de-la-procedure",
          "https://www.senegal.campusfrance.org/criteres-d-eligibilite-pour-la-campagne-etudes-en-france"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "universite-paris-saclay-orsay",
    "motif": "France : Campus France Sénégal n'accepte en L1 que le bac de l'année ou de l'année précédente (critères de la campagne), relu le 2026-09-25",
    "attendu": {
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
    },
    "champs": {
      "admission": {
        "procedure": "Première année de licence : candidature sur Études en France. Licence 2 et 3 : d'abord sur eCandidat. Master : d'abord sur la plateforme Inception, aux dates de chaque formation. Si vous êtes retenu, vous complétez Études en France, rubrique « je suis accepté », pour le visa.",
        "calendrier": "Master : dates d'ouverture propres à chaque formation sur Inception. Première année de licence : rentrée 2027 au Sénégal : dossier Études en France du 1er octobre au 15 décembre 2026, frais payés au plus tard le 19 décembre 2026, choix de la formation confirmé au plus tard le 31 mai 2027, selon Campus France Sénégal.",
        "conditions": "Première année : diplôme de fin d'études secondaires. Autres années : le diplôme du niveau précédent. Au Sénégal, en première année, Campus France n'accepte que le bac de l'année ou de l'année précédente, obtenu avec au plus une reprise ; sinon, il faut d'abord valider un cycle au Sénégal (BTS, DUT, licence) ; avec un bac série arabe L-AR, il faut un niveau B2 certifié en français.",
        "langue": "Le niveau de français dépend de la formation ; il est indiqué sur sa fiche.",
        "fraisDossier": "Aucun frais propre à l'université. Le dossier Études en France coûte 85 000 francs CFA au Sénégal, non remboursables, payés à Campus France.",
        "sources": [
          "https://www.universite-paris-saclay.fr/admission/etudiants-internationaux/etudiants-internationaux-candidater-en-master",
          "https://www.universite-paris-saclay.fr/admissions/etudiants-internationaux-candidater-en-premier-cycle-licences",
          "https://www.universite-paris-saclay.fr/admission/droits-dinscription-de-luniversite-paris-saclay",
          "https://www.senegal.campusfrance.org/calendrier-de-la-procedure",
          "https://www.senegal.campusfrance.org/criteres-d-eligibilite-pour-la-campagne-etudes-en-france"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    "collection": "universities",
    "id": "universite-sorbonne-paris-nord-villetaneuse",
    "motif": "France : Campus France Sénégal n'accepte en L1 que le bac de l'année ou de l'année précédente (critères de la campagne), relu le 2026-09-25",
    "attendu": {
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
      }
    },
    "champs": {
      "admission": {
        "procedure": "Vous résidez au Sénégal : candidature sur Études en France. Première année de licence : demande d'admission préalable. Licence 3 et master : l'université est reliée à Études en France et répond par courriel.",
        "calendrier": "Rentrée 2027 au Sénégal : dossier Études en France du 1er octobre au 15 décembre 2026, frais payés au plus tard le 19 décembre 2026, choix de la formation confirmé au plus tard le 31 mai 2027, selon Campus France Sénégal.",
        "conditions": "Première année : un diplôme étranger de fin d'études secondaires. Autres années : le diplôme du niveau précédent. Au Sénégal, en première année, Campus France n'accepte que le bac de l'année ou de l'année précédente, obtenu avec au plus une reprise ; sinon, il faut d'abord valider un cycle au Sénégal (BTS, DUT, licence) ; avec un bac série arabe L-AR, il faut un niveau B2 certifié en français.",
        "langue": "Le niveau de français est vérifié dans le dossier Études en France ; l'université ne publie pas de seuil général à jour.",
        "fraisDossier": "Aucun frais propre à l'université. Le dossier Études en France coûte 85 000 francs CFA au Sénégal, non remboursables, payés à Campus France.",
        "sources": [
          "https://ecogestion.univ-spn.fr/candidatures/",
          "https://www.univ-spn.fr/droits-de-scolarite/",
          "https://inscriptions.univ-spn.fr/exoneration/",
          "https://www.senegal.campusfrance.org/calendrier-de-la-procedure",
          "https://www.senegal.campusfrance.org/criteres-d-eligibilite-pour-la-campagne-etudes-en-france"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  }
];

export const UNIVERSITIES = [];
export const SCHOLARSHIPS = [];
export const LINKS = [];
