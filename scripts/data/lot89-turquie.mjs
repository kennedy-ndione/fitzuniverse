// ============================================================
// FitzUniverse — Lot 89 : TURQUIE, de 6 à 22 établissements
// Recherche du 2026-09-25, sources officielles uniquement : sites des
// universités (bureaux internationaux, scolarité, PDF de frais et de
// candidature), topuniversities.com pour le seul classement mondial.
//
// POURQUOI
// Charles, le 2026-09-25 : « On passe au lot Turquie : de 6 à environ
// 20 établissements, fiches complètes, même exigence que l'Allemagne »,
// puis : ajouter des universités qui accueillent beaucoup d'étudiants
// africains. Liste retenue avec lui : les établissements suivants du
// classement QS 2027, plus Sakarya, Karabük et Istanbul Aydın.
//
// MÉTHODE
// Sept recherches parallèles (WebFetch) ont produit un brouillon ; TOUT
// ce qui entre ici a ensuite été RELU AU NAVIGATEUR INTÉGRÉ, depuis le
// réseau de Charles, le 2026-09-25 : pages HTML, PDF officiels (texte
// extrait dans la page par pdf.js) et un PDF scanné lu à l'écran
// (Karabük). Istanbul Aydın était derrière une vérification Cloudflare :
// Charles l'a passée lui-même, puis les pages ont été lues.
// Corrections apportées par la relecture :
//   - METU : pas de frais de dossier en 2026-2027 (le brouillon disait
//     55 USD). IELTS passés après le 24/12/2022 refusés.
//   - Hacettepe : candidature PAYANTE, 2 500 TL (le brouillon disait
//     gratuite) ; grille 2026-2027 trouvée (le brouillon n'en avait pas).
//   - Istanbul Üniversitesi : grille 2026-2027 en livres turques trouvée
//     sur isad.istanbul.edu.tr ; elle remplace la grille 2024-2025 en
//     dollars de la fiche, trop ancienne.
//   - Gebze : l'ancienne directive citant le baccalauréat sénégalais
//     (15/20) n'est plus liée depuis la page 2026 ; non retenue. La page
//     2026 dit : diplôme et relevé suffisent, dossier évalué dans son
//     ensemble.
//   - IZTECH : grille 2025-2026 titrée « SEMESTER TUITION FEES » : les
//     montants sont par semestre (le brouillon les donnait par an).
//   - Marmara : la page SAT/ACT date de 2021 ; en 2026 seul le TR-YÖS est
//     écrit dans le guide. SAT/ACT non repris.
//   - Galata : sujet déjà pris par la photo de Boğaziçi (istanbul.jpg),
//     écarté pour Yıldız.
// ÉCARTÉE : Gazi (Ankara). Frais 2026-2027 « not yet determined » et
// grille 2025-2026 scannée illisible : pas de prix vérifiable.
// Ege : grille 2023-2024 seulement (plus de deux ans) : elle va dans
// admission.coutIndicatif, pas dans fraisScolarite.
// Classement : QS 2027 relu au navigateur sur topuniversities le même
// jour (endpoint du classement, filtre Turquie). Karabük n'y figure pas.
//
// NON TROUVÉ, donc NON ÉCRIT : chiffres officiels d'étudiants africains
// par université (le portail statistique de YÖK ne croise pas
// nationalité et université) ; bourses propres de la plupart des
// universités publiques ; langue d'enseignement de Marmara, Ege, Dokuz
// Eylül, IZTECH, Selçuk et Erciyes.
//
// PRIX RETENU : le tarif annuel le plus bas d'une faculté de licence
// (hors enseignement à distance), comme pour Boğaziçi ; les grilles par
// semestre sont doublées et le dit la note.
//
// LES SIX FICHES EXISTANTES reçoivent en PATCHES leur bloc `admission`,
// leur province, le rang « ex æquo » de QS, et des notes de frais
// réécrites (mots en capitales, tirets longs, accents manquants).
//
// PHOTOS : scripts/add-lot89-photos.mjs, AVANT `lot.mjs analyser`.
// Le lot refuse de se charger si une photo manque.
// ============================================================

import { existsSync } from "node:fs";

const LE = "2026-09-25";

// Phrases communes, écrites une fois.
const SANS_BAC_LISTE = "Le baccalauréat du Sénégal n'apparaît pas dans la liste de l'université : vérifiez auprès du bureau international avant de candidater.";
const EXO_INCONNUE = "L'université ne publie pas de réduction des frais pour les étudiants internationaux sur ses pages d'admission et de frais.";

export const UNIVERSITIES = [

  // ---------------- Ankara ----------------

  {
    id: "middle-east-technical-university-ankara",
    data: {
      name: "Middle East Technical University (METU)",
      city: "Ankara",
      province: "Ankara",
      country: "Turquie",
      image: "ankara-atakule.jpg",
      flag: "tr.svg",
      ranking: "#305 mondial (QS 2027)",
      officialWebsite: "https://www.metu.edu.tr",
      applicationPortalUrl: "https://iso.metu.edu.tr/en/how-apply",
      fields: ["Ingénierie", "Architecture", "Sciences", "Informatique", "Commerce", "Sciences sociales"],
      description: "Université publique d'Ankara où tous les programmes sont enseignés en anglais. Plus de 2 000 étudiants internationaux venus de 85 pays.",
      langueEnseignement: "Anglais dans tous les programmes",
      fraisScolarite: {
        source: "https://iso.metu.edu.tr/en/system/files/2026-2027_tuition_fees_14092026.pdf",
        verifieLe: LE,
        note: "Grille 2026-2027 des étudiants internationaux, par semestre, pour une entrée depuis 2023 : 800 $ en économie et sciences administratives, en éducation, et en sociologie, psychologie, histoire et philosophie ; 1 200 $ en ingénierie, architecture et sciences. Master et doctorat : 375 $ par semestre. Montant retenu en licence : 1 600 $ par an, soit deux semestres au tarif le plus bas ; 2 400 $ par an en ingénierie. La somme en dollars est payée en livres turques, au taux de la Banque centrale une semaine avant le paiement. L'année de préparation en anglais coûte le même prix que le programme.",
        licence: { montant: 1600, devise: "USD", periode: "an" },
        master: { montant: 750, devise: "USD", periode: "an" },
        doctorat: { montant: 750, devise: "USD", periode: "an" }
      },
      exoneration: {
        politique: "possible_plafonnee",
        detail: "Exonérés pendant la durée normale : les boursiers dont la bourse couvre les frais, et en licence les diplômés de lycées listés par METU. Réduction de 25 % sur demande, avant chaque semestre, si un parent réside légalement en Turquie et qu'un autre membre de la famille étudie à METU ou dans une université publique turque.",
        source: "https://iso.metu.edu.tr/en/tuition-fee",
        verifieLe: LE
      },
      admission: {
        procedure: "Candidature entièrement en ligne sur le programme de candidature de METU, ouvert aux dates annoncées : vous remplissez chaque partie, déposez vos pièces, puis vous « gelez » votre dossier ; un dossier non gelé n'est pas évalué. Aucun document papier n'est à envoyer.",
        conditions: "Un seul examen ou diplôme au minimum exigé suffit, et le dossier est ensuite évalué dans son ensemble. Pour le Sénégal, la Côte d'Ivoire, le Mali, la Guinée, le Togo, le Tchad, le Gabon et le Maroc : au moins 80 % de réussite au baccalauréat, s'il ouvre l'accès à une licence de quatre ans. Cameroun : baccalauréat avec au moins 16 sur 20. Autres voies : SAT 1200, ACT 27, IB 33, TR-YÖS dans les 5 % les meilleurs, WAEC. METU n'organise pas de YÖS et n'accepte pas ceux des autres universités.",
        calendrier: "Candidatures 2026-2027 du 1er juin, 16 h, au 12 juillet 2026, 23 h 59, heure turque. Avec un A level, l'admission est d'abord différée, puis finalisée en août quand arrivent les résultats définitifs.",
        langue: "Enseignement en anglais. À l'inscription : TOEFL, PTE Academic, ou l'examen d'anglais de METU ; les IELTS passés depuis le 24 décembre 2022 ne sont plus acceptés. En cas d'échec, un an de préparation en anglais.",
        fraisDossier: "Aucuns frais de dossier pour les candidatures 2026-2027.",
        sources: [
          "https://iso.metu.edu.tr/en/how-apply",
          "https://iso.metu.edu.tr/en/application-dates",
          "https://iso.metu.edu.tr/en/required-documents",
          "https://iso.metu.edu.tr/en/system/files/odtu_iso_requirements.pdf",
          "https://iso.metu.edu.tr/en/english-proficiency"
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "hacettepe-university-ankara",
    data: {
      name: "Hacettepe University",
      city: "Ankara",
      province: "Ankara",
      country: "Turquie",
      image: "ankara-grande-mosquee.jpg",
      flag: "tr.svg",
      ranking: "#570 mondial ex æquo (QS 2027)",
      officialWebsite: "https://www.hacettepe.edu.tr",
      applicationPortalUrl: "https://internationalstudents.hacettepe.edu.tr/en/application",
      fields: ["Médecine", "Ingénierie", "Informatique", "Sciences", "Droit", "Lettres", "Sciences sociales", "Commerce"],
      description: "Université publique d'Ankara. La médecine et la plupart des ingénieries sont enseignées en anglais ; beaucoup d'autres programmes le sont en turc, et quelques-uns en français.",
      langueEnseignement: "Anglais, turc ou français selon le programme ; médecine en anglais",
      fraisScolarite: {
        source: "https://internationalstudents.hacettepe.edu.tr/en/application?section=tuition-fees",
        verifieLe: LE,
        note: "Grille 2026-2027 des étudiants internationaux, en dollars, convertie en livres turques au taux du 3 août 2026 : 4 000 $ en droit, économie et sciences administratives, lettres, éducation, soins infirmiers, sciences de la santé, communication et sport ; 5 000 $ en sciences et beaux-arts ; 7 500 $ en ingénierie, informatique et architecture ; 8 000 $ en pharmacie et dentaire ; 12 000 $ en médecine. Un montant par année. Montant retenu en licence : 4 000 $. Master et doctorat : non indiqués.",
        licence: { montant: 4000, devise: "USD", periode: "an" }
      },
      exoneration: {
        politique: "inconnue",
        detail: EXO_INCONNUE,
        source: "https://internationalstudents.hacettepe.edu.tr/en/application?section=tuition-fees",
        verifieLe: LE
      },
      admission: {
        procedure: "Candidature en ligne sur le système de l'université, avec un lien différent pour chaque examen : TR-YÖS, SAT ou A level. Vous déposez passeport, diplôme certifié par le consulat de Turquie ou attestation de réussite, relevé de notes certifié et traductions, puis vous classez vos programmes. Un seul type de score par année.",
        conditions: "Licence : TR-YÖS d'au moins 300 sur 500, SAT d'au moins 1000, ou GCE A level avec une moyenne de C. Aucune autre voie n'est acceptée, pas même un baccalauréat national. TR-YÖS et SAT valables deux ans. Un visa étudiant est exigé de tous les admis.",
        calendrier: "Pour 2026-2027 : candidatures TR-YÖS et SAT du 25 mai au 31 juillet 2026, résultats le 21 août ; A level du 11 au 18 août, résultats le 28 août ; inscription définitive du 31 août au 4 septembre 2026.",
        langue: "Aucun certificat de langue à la candidature. Selon le programme : année préparatoire de turc, d'anglais, de français ou d'allemand, et cours de turc obligatoires.",
        fraisDossier: "2 500 TL de frais de candidature pour 2026-2027, payés par carte dans le système et non remboursables.",
        sources: [
          "https://internationalstudents.hacettepe.edu.tr/en/home",
          "https://internationalstudents.hacettepe.edu.tr/en/application?section=application-requirements",
          "https://internationalstudents.hacettepe.edu.tr/en/application?section=application-guide",
          "https://internationalstudents.hacettepe.edu.tr/en/application?section=accepted-scores",
          "https://internationalstudents.hacettepe.edu.tr/en/application?section=medium-of-instruction"
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "ankara-university-ankara",
    data: {
      name: "Ankara University",
      city: "Ankara",
      province: "Ankara",
      country: "Turquie",
      image: "ankara-vue-aerienne.jpg",
      flag: "tr.svg",
      ranking: "#731-740 mondial (QS 2027)",
      officialWebsite: "https://www.ankara.edu.tr",
      applicationPortalUrl: "https://isoidb.ankara.edu.tr/en/how-to-apply/",
      fields: ["Médecine", "Droit", "Lettres", "Sciences sociales", "Sciences", "Ingénierie", "Informatique", "Agriculture"],
      description: "Université publique de la capitale turque. L'enseignement est surtout en turc, avec des programmes entièrement en langue étrangère. La candidature est gratuite.",
      langueEnseignement: "Turc ; certains programmes entièrement en langue étrangère",
      fraisScolarite: {
        source: "https://isoidb.ankara.edu.tr/wp-content/uploads/sites/381/2026/08/TRY-2026-2027-Katki-Payi-Ucretleri.pdf",
        verifieLe: LE,
        note: "Grille 2026-2027 des étudiants internationaux, en dollars, un montant pour l'année : 2 000 $ en géographie, anthropologie, philosophie, psychologie, sociologie et histoire ; 3 000 $ dans les programmes de langues étrangères, dont langue et littérature françaises ; 3 600 $ en droit et génie informatique, 5 400 $ en anglais ; 9 900 $ en médecine, 14 850 $ en anglais. Enseignement à distance : 1 800 $. Montant retenu en licence : 2 000 $. Master : non indiqué.",
        licence: { montant: 2000, devise: "USD", periode: "an" }
      },
      exoneration: {
        politique: "inconnue",
        detail: "L'université ne publie pas de réduction propre. Des bourses existent dans le cadre de protocoles du Conseil de l'enseignement supérieur, YÖK, qui place lui-même les boursiers à l'université.",
        source: "https://isoidb.ankara.edu.tr/en/general-information/",
        verifieLe: LE
      },
      admission: {
        procedure: "Candidature en ligne sur ugadmissions.ankara.edu.tr. Vous déposez le diplôme original et sa traduction assermentée et certifiée par un notaire, les relevés de notes et leur traduction, une pièce d'identité et le résultat d'examen, puis vous choisissez jusqu'à cinq programmes.",
        conditions: "TR-YÖS selon le programme : 440 en médecine, dentaire et informatique, 400 en pharmacie et génie civil, 300 en soins infirmiers et droit, 200 ailleurs. Autres voies : SAT 1100 avec 650 en maths, IB 30, WASSCE-WAEC avec B2 dans six matières, A level. Un diplôme de fin d'études secondaires avec au moins 80 sur 100 sert à pourvoir les places restées libres après le classement sur examens.",
        calendrier: "Candidatures 2026-2027 du 22 mai, 9 h 30, au 26 juin 2026, 17 h ; résultats et inscription annoncés ensuite.",
        langue: "Programmes en turc : attestation de turc de TÖMER d'Ankara ou de l'Institut Yunus Emre, à fournir dans les deux ans. Programmes en langue étrangère : niveau exigé par le programme.",
        fraisDossier: "Aucuns frais de dossier.",
        sources: [
          "https://isoidb.ankara.edu.tr/en/how-to-apply/",
          "https://isoidb.ankara.edu.tr/wp-content/uploads/sites/381/2026/05/2026-1.TERCIH-ILAN-INGILIZCE.pdf",
          "https://isoidb.ankara.edu.tr/wp-content/uploads/sites/381/2026/07/gecerli-sinavlar-ingilizce.pdf"
        ],
        verifieLe: LE
      }
    }
  },

  // ---------------- Istanbul ----------------

  {
    id: "yildiz-technical-university-istanbul",
    data: {
      name: "Yıldız Technical University",
      city: "Istanbul",
      province: "Istanbul",
      country: "Turquie",
      image: "istanbul-dolmabahce.jpg",
      flag: "tr.svg",
      ranking: "#634 mondial ex æquo (QS 2027)",
      officialWebsite: "https://www.yildiz.edu.tr",
      applicationPortalUrl: "https://ogi.yildiz.edu.tr/node/16731",
      fields: ["Ingénierie", "Architecture", "Sciences", "Informatique", "Commerce"],
      description: "Université technique publique d'Istanbul. Elle accepte le baccalauréat de plusieurs pays d'Afrique de l'Ouest et centrale, dont le Sénégal, avec au moins 12 sur 20.",
      langueEnseignement: "Turc, anglais, ou 30 % d'anglais selon le programme",
      fraisScolarite: {
        source: "https://ogi.yildiz.edu.tr/sites/ogi.yildiz.edu.tr/files/ytu-2026-2027yurt-disindan-lisans-programlarina-ogrenci-ogrenim-ucretleri.pdf",
        verifieLe: LE,
        note: "Frais 2026-2027 des étudiants admis sur le contingent international, les mêmes dans toutes les facultés : 35 000 TL au semestre d'automne et 35 000 TL au printemps, soit 70 000 TL par an, payés par la banque İş Bankası. Master : non indiqué sur ce document.",
        licence: { montant: 70000, devise: "TRY", periode: "an" }
      },
      exoneration: {
        politique: "inconnue",
        detail: EXO_INCONNUE,
        source: "https://ogi.yildiz.edu.tr/sites/ogi.yildiz.edu.tr/files/ytu-2026-2027yurt-disindan-lisans-programlarina-ogrenci-ogrenim-ucretleri.pdf",
        verifieLe: LE
      },
      admission: {
        procedure: "Candidature en ligne aux dates annoncées, puis inscription en personne, ou par une personne munie d'une procuration notariée, au campus de Davutpaşa. À l'inscription : diplôme original et traduction turque certifiée par apostille, notaire ou consulat de Turquie, et formulaire de garantie financière.",
        conditions: "Baccalauréat du Sénégal, de Guinée, du Tchad, du Maroc, du Mali, du Cameroun, du Niger, du Togo, du Burkina Faso ou du Bénin : au moins 12 sur 20, et 10 sur 20 pour la faculté d'art et de design. Autres voies : SAT 1100, TR-YÖS 450, IB 30. L'université n'organise pas de YÖS et n'accepte pas ceux des autres universités.",
        calendrier: "Candidatures 2026-2027 du lundi 20 juillet, 10 h, au vendredi 31 juillet 2026, 16 h ; inscription définitive du 7 au 18 septembre 2026.",
        langue: "Selon le programme, en turc, en anglais, ou à 30 % en anglais ; la liste des places précise la langue de chacun.",
        fraisDossier: "Aucuns frais de dossier ne sont mentionnés dans l'annonce 2026-2027.",
        sources: [
          "https://ogi.yildiz.edu.tr/node/16731",
          "https://ogi.yildiz.edu.tr/node/16746",
          "https://ogi.yildiz.edu.tr/sites/ogi.yildiz.edu.tr/files/ytu-yurt-disindan-lisans-programlarina-ogrenci-kabulunde-kullanilan-sinav-ve-diploma-turleri-2026.pdf",
          "https://ogi.yildiz.edu.tr/sites/ogi.yildiz.edu.tr/files/ytu-2026-2027-yurt-disindan-lisans-programlarina-ogrenci-kabulu-kontenjanlari.pdf"
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "marmara-university-istanbul",
    data: {
      name: "Marmara University",
      city: "Istanbul",
      province: "Istanbul",
      country: "Turquie",
      image: "istanbul-ortakoy.jpg",
      flag: "tr.svg",
      ranking: "#1001-1200 mondial (QS 2027)",
      officialWebsite: "https://www.marmara.edu.tr",
      applicationPortalUrl: "https://muyos.marmara.edu.tr/",
      fields: ["Médecine", "Ingénierie", "Droit", "Commerce", "Sciences sociales", "Sciences", "Lettres"],
      description: "Université publique d'Istanbul qui admet les étudiants étrangers sur la base du TR-YÖS.",
      fraisScolarite: {
        source: "https://oidb.marmara.edu.tr/dosya/oidb/katkipayi/2025-2026/2025-2026%20Lisans&%C3%96nlisans%20Yabanc%C4%B1%20Uyruklu%20%C3%96%C4%9Frenci%20%C3%9Ccret%20Tablosu%20%C3%9CYK%20EK-PDF.pdf",
        verifieLe: LE,
        note: "Grille 2025-2026 des étudiants étrangers entrés depuis 2023, par an : 47 532 TL en communication ; 48 575 TL en finances et lettres ; environ 58 000 à 60 000 TL en gestion, économie et théologie ; 69 890 TL en sciences, éducation et sciences politiques ; 92 800 TL en droit ; 117 160 TL en ingénierie et architecture ; 355 429 TL en médecine. Montant retenu en licence : 47 532 TL. Le 25 septembre 2026, la page des frais annonçait les tableaux 2026-2027 sans lien actif.",
        licence: { montant: 47532, devise: "TRY", periode: "an" }
      },
      exoneration: {
        politique: "inconnue",
        detail: EXO_INCONNUE,
        source: "https://oidb.marmara.edu.tr/katki-payi-ogrenim-ucretleri",
        verifieLe: LE
      },
      admission: {
        procedure: "Candidature et choix des programmes en ligne sur basvuru.marmara.edu.tr, après lecture du guide de candidature. Les admis paient les frais de scolarité à l'inscription définitive.",
        conditions: "Admission sur le TR-YÖS, examen de l'agence turque des examens : sessions 2024/2, 2025/1, 2025/26 et 2026/1. Le guide 2026 ne cite pas d'autre voie. Les places sont limitées par pays.",
        calendrier: "Pour 2026-2027 : candidature du 20 mai au 5 juin 2026 ; résultats le 19 juin ; inscription du 20 au 24 juillet ; placement complémentaire du 29 au 31 juillet, résultats le 10 août, inscription du 31 août au 4 septembre 2026.",
        langue: "Programmes en turc : niveau B2 de turc pour commencer, certifié par Marmara TÖMER ou un organisme reconnu, sinon année de préparation. Programmes en langue étrangère : examen reconnu par le Conseil interuniversitaire.",
        fraisDossier: "Aucuns frais de dossier ne sont mentionnés dans le guide 2026.",
        sources: [
          "https://muyos.marmara.edu.tr/notice/marmara-universitesi-2026-2027-egitim-ogretim-yili-yurtdisindan-veya-yabanci-uyruklu-ogrenci-secme-ve-yerlestirme-islemleri",
          "https://muyos.marmara.edu.tr/dosya/muyos/2026%20TR%20Y%C3%96S/2026_TR-YOS_Basvuru_ve_Kayit_Kilavuzu_IlanEdilen.pdf",
          "https://muyos.marmara.edu.tr/dosya/muyos/2026%20TR%20Y%C3%96S/2026_Basvuru_Takvimi-1.pdf"
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "ozyegin-university-istanbul",
    data: {
      name: "Özyeğin University",
      city: "Istanbul",
      province: "Istanbul",
      country: "Turquie",
      image: "istanbul-mosquee-bleue.jpg",
      flag: "tr.svg",
      ranking: "#1201-1400 mondial (QS 2027)",
      officialWebsite: "https://www.ozyegin.edu.tr",
      applicationPortalUrl: "https://apply.ozyegin.edu.tr/s/?language=en_US",
      fields: ["Ingénierie", "Informatique", "Commerce", "Droit", "Architecture", "Sciences sociales"],
      description: "Université privée d'Istanbul, sur fondation. Tous les cours sont en anglais, sauf en droit, et chaque candidat est évalué d'office pour une bourse.",
      langueEnseignement: "Anglais dans toutes les facultés, sauf le droit",
      fraisScolarite: {
        source: "https://studentservices.ozyegin.edu.tr/en/student-services/fees-and-payment/2026-2027-academic-year-fees/international-students",
        verifieLe: LE,
        note: "Université privée. Frais annuels 2026-2027 des étudiants internationaux, TVA comprise : 25 000 $ dans les programmes des facultés, en gastronomie et en hôtellerie ; 16 500 $ en pilotage, plus 77 000 € hors taxes de formation au vol. L'année de préparation en anglais coûte le prix du programme. Master et doctorat : 20 000 $ par an. Montant retenu en licence : 25 000 $, avant bourse.",
        licence: { montant: 25000, devise: "USD", periode: "an" },
        master: { montant: 20000, devise: "USD", periode: "an" },
        doctorat: { montant: 20000, devise: "USD", periode: "an" }
      },
      exoneration: {
        politique: "possible_plafonnee",
        detail: "Chaque candidat est évalué d'office pour une bourse au mérite, sans demande séparée ; son pourcentage figure dans la lettre d'admission. Exemples publiés : avec 40 % de bourse, 15 000 $ par an ; avec 50 %, 12 500 $ ; avec 60 %, 10 000 $.",
        source: "https://admissions.ozyegin.edu.tr/en/tuition-fees-and-scholarship/",
        verifieLe: LE
      },
      admission: {
        procedure: "Candidature en ligne sur apply.ozyegin.edu.tr avec passeport, relevé officiel du lycée et diplôme ou attestation. Après évaluation, une lettre d'offre conditionnelle indique la bourse ; un acompte de 1 000 $, déduit des frais du premier semestre et non remboursable si vous renoncez, déclenche l'envoi des documents d'admission et de visa.",
        conditions: "Baccalauréat avec au moins 11 sur 20, WAEC ou WASSCE avec C dans six matières liées au programme, IB 26, ACT 23, SAT 1000 avec 600 en maths. Si la note du diplôme ne suffit pas, vous pouvez candidater avec le SAT.",
        calendrier: "Date limite affichée pour la licence, rentrée d'automne 2026-2027 : 15 novembre 2026.",
        langue: "Enseignement en anglais, sauf en droit. Sans certificat d'anglais suffisant, programme préparatoire d'anglais.",
        fraisDossier: "Aucuns frais de dossier ne sont mentionnés ; seul l'acompte de 1 000 $ est demandé après l'admission.",
        sources: [
          "https://admissions.ozyegin.edu.tr/en/admission-process/",
          "https://admissions.ozyegin.edu.tr/en/application-criteria/",
          "https://admissions.ozyegin.edu.tr/en/tuition-fees-and-scholarship/",
          "https://admissions.ozyegin.edu.tr/en/frequently-ask-questions"
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "istanbul-aydin-university-istanbul",
    data: {
      name: "Istanbul Aydın University",
      city: "Istanbul",
      province: "Istanbul",
      country: "Turquie",
      image: "istanbul-sainte-sophie.jpg",
      flag: "tr.svg",
      ranking: "#1201-1400 mondial (QS 2027)",
      officialWebsite: "https://www.aydin.edu.tr",
      applicationPortalUrl: "https://study.aydin.edu.tr/how-to-apply/",
      fields: ["Ingénierie", "Médecine", "Droit", "Commerce", "Sciences sociales", "Architecture", "Informatique"],
      description: "Université privée d'Istanbul, sur fondation. La candidature est gratuite et ouverte d'avril à septembre, avec des programmes en anglais ou en turc.",
      langueEnseignement: "Anglais ou turc selon le programme",
      fraisScolarite: {
        source: "https://study.aydin.edu.tr/wp-content/uploads/2026/07/uluslararasi-ofis-fiyat-listesi-tuition-fees-2026.pdf",
        verifieLe: LE,
        note: "Université privée. Grille annuelle publiée en juillet 2026 pour les étudiants internationaux : 5 000 $ en éducation, en sciences et lettres, en sport et dans les programmes en turc des autres facultés ; 6 000 $ dans les programmes en anglais d'économie, de communication et de beaux-arts ; 6 500 $ en droit, et en ingénierie ou architecture en anglais ; 23 000 $ en dentaire ; 25 000 $ en médecine. Préparation au turc : 3 000 $. Master : 8 000 à 12 000 $ pour tout le programme. Montant retenu en licence : 5 000 $.",
        licence: { montant: 5000, devise: "USD", periode: "an" }
      },
      exoneration: {
        politique: "inconnue",
        detail: "L'université ne publie pas de bourse ni de réduction sur sa grille de frais 2026 ni sur ses pages de candidature.",
        source: "https://study.aydin.edu.tr/wp-content/uploads/2026/07/uluslararasi-ofis-fiyat-listesi-tuition-fees-2026.pdf",
        verifieLe: LE
      },
      admission: {
        procedure: "Candidature en ligne sur le portail applyonline.aydin.edu.tr, avec passeport valide, diplôme de fin d'études secondaires et relevé de notes. Vous suivez ensuite votre dossier et recevez la lettre d'offre sur le même portail.",
        conditions: "Diplôme de fin d'études secondaires et relevé de notes. Les exigences propres à chaque programme sont publiées par l'université.",
        calendrier: "Rentrée d'automne : candidatures du 1er avril au 30 septembre de chaque année, inscription définitive du 15 juin au 30 septembre. La rentrée de printemps ne concerne que les masters et doctorats.",
        langue: "Examen dans la langue du programme, anglais ou turc, si vous n'avez pas de justificatif de niveau.",
        fraisDossier: "Candidature gratuite, quelle que soit la voie choisie.",
        sources: [
          "https://study.aydin.edu.tr/how-to-apply/",
          "https://study.aydin.edu.tr/faq/",
          "https://study.aydin.edu.tr/wp-content/uploads/2026/07/uluslararasi-ofis-fiyat-listesi-tuition-fees-2026.pdf"
        ],
        verifieLe: LE
      }
    }
  },

  // ---------------- Marmara : Kocaeli, Sakarya ----------------

  {
    id: "gebze-technical-university-gebze",
    data: {
      name: "Gebze Technical University",
      city: "Gebze",
      province: "Kocaeli",
      country: "Turquie",
      image: "gebze-centre.jpg",
      flag: "tr.svg",
      ranking: "#851-900 mondial (QS 2027)",
      officialWebsite: "https://www.gtu.edu.tr",
      applicationPortalUrl: "https://obs.gtu.edu.tr/oibs/foa_app/?lang=en",
      fields: ["Ingénierie", "Sciences", "Architecture", "Informatique", "Commerce"],
      description: "Université technique publique de la province de Kocaeli, reliée au centre d'Istanbul par les transports publics. Étudiants de plus de 60 pays, candidature gratuite.",
      langueEnseignement: "Anglais dans la plupart des programmes ; quelques-uns en turc ou à 30 % en anglais",
      fraisScolarite: {
        source: "https://www.gtu.edu.tr/en/kategori/8336/0/display.aspx",
        verifieLe: LE,
        note: "Grille 2025-2026 des étudiants internationaux, par semestre : 38 599,20 TL en sciences et en gestion ; 42 885 TL en ingénierie et architecture ; 51 462 TL en aérospatiale. Montant retenu en licence : 77 198 TL par an, soit deux semestres en sciences. La page annonçait les frais 2026-2027 pour juillet 2026.",
        licence: { montant: 77198, devise: "TRY", periode: "an" }
      },
      exoneration: {
        politique: "inconnue",
        detail: EXO_INCONNUE,
        source: "https://www.gtu.edu.tr/en/kategori/8336/0/display.aspx",
        verifieLe: LE
      },
      admission: {
        procedure: "Candidature en ligne, évaluation, listes principale et de réserve, lettre d'admission pour le visa, puis inscription en personne au campus. Les admis versent 5 000 TL de pré-inscription, déduits ensuite des frais de scolarité.",
        conditions: "Vous pouvez candidater avec les seules notes de votre diplôme national et votre relevé officiel ; le dossier est évalué dans son ensemble, et un score d'examen national ou international augmente nettement vos chances. Diplôme apostillé ou certifié par l'ambassade ou le consulat de Turquie.",
        calendrier: "Candidatures en ligne du 9 mars au 3 juillet 2026, avec des résultats par vagues en avril, mai, juin et juillet ; inscription définitive du 1er au 31 juillet ; seconde période du 3 au 14 août si des places restent ; cours à partir du 21 septembre 2026.",
        langue: "Programmes en turc ou à 30 % en anglais : turc B2 pour commencer. Programmes entièrement en anglais : turc B1 avant le diplôme. Anglais : examen de l'université ou TOEFL iBT 78, sinon année préparatoire.",
        fraisDossier: "Aucuns frais de candidature.",
        sources: [
          "https://www.gtu.edu.tr/en/kategori/7286/0/display.aspx",
          "https://www.gtu.edu.tr/kategori/7286/0/display.aspx",
          "https://www.gtu.edu.tr/en/kategori/8336/0/display.aspx"
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "sakarya-university-serdivan",
    data: {
      name: "Sakarya University",
      city: "Serdivan",
      province: "Sakarya",
      country: "Turquie",
      image: "serdivan-sakarya.jpg",
      flag: "tr.svg",
      ranking: "#1401+ mondial (QS 2027)",
      officialWebsite: "https://www.sakarya.edu.tr",
      applicationPortalUrl: "https://yosyerlesme.sabis.sakarya.edu.tr",
      fields: ["Ingénierie", "Informatique", "Commerce", "Sciences sociales", "Droit", "Médecine", "Sciences"],
      description: "Université publique de la province de Sakarya, à l'est d'Istanbul. Elle accepte le baccalauréat de plusieurs pays d'Afrique, dont le Tchad, la Guinée et le Niger.",
      langueEnseignement: "Turc ; quelques programmes en anglais",
      fraisScolarite: {
        source: "https://studyatsau.sakarya.edu.tr/tr/icerik/9552/32582/ogrenim-ucretleri",
        verifieLe: LE,
        note: "Grille 2026-2027 des étudiants étrangers entrés en 2026, par semestre : 15 400 TL en géographie, philosophie, sociologie, histoire et travail social ; 19 250 TL en économie, finances et sciences politiques ; 24 750 TL en gestion ; 35 200 TL en droit ; 48 000 TL en ingénierie ; 172 500 TL en médecine. Payés à l'inscription. Montant retenu en licence : 30 800 TL par an, soit deux semestres au tarif le plus bas.",
        licence: { montant: 30800, devise: "TRY", periode: "an" }
      },
      exoneration: {
        politique: "inconnue",
        detail: EXO_INCONNUE,
        source: "https://studyatsau.sakarya.edu.tr/tr/icerik/9552/32582/ogrenim-ucretleri",
        verifieLe: LE
      },
      admission: {
        procedure: "Candidature et choix des programmes en ligne sur yosyerlesme.sabis.sakarya.edu.tr. Documents en turc ou en anglais. À l'inscription : diplôme original et traduction turque certifiée par l'ambassade ou le consulat de Turquie, avec apostille.",
        conditions: "Baccalauréat du Tchad, de Guinée, du Niger, du Maroc, de Mauritanie ou d'Algérie, ou baccalauréat français : au moins 17 sur 20 en ingénierie et architecture, 14 sur 20 dans les autres licences ; ces notes ne valent pas en médecine ni en dentaire. Nigeria : WAEC ou WASSCE. Autres voies : TR-YÖS, SAT, ACT, A level. " + SANS_BAC_LISTE,
        calendrier: "Pour 2026-2027 : candidature du 4 mai au 28 juin 2026, résultats le 23 juillet, inscription du 27 juillet au 14 août ; placements complémentaires du 19 au 30 août puis du 15 au 25 octobre 2026.",
        langue: "Un certificat de langue permet de commencer directement ; sans lui, vous suivez une année de préparation.",
        fraisDossier: "Aucuns frais de dossier ne sont mentionnés dans les principes d'admission 2026-2027.",
        sources: [
          "https://studyatsau.sakarya.edu.tr/sites/studyatsau.sakarya.edu.tr/file/Application_and_Registration_Calendar.pdf",
          "https://studyatsau.sakarya.edu.tr/sites/studyatsau.sakarya.edu.tr/file/2026-2027_Uluslararasi_Ogrenci_Kabulu_Esaslari.pdf",
          "https://studyatsau.sakarya.edu.tr/sites/studyatsau.sakarya.edu.tr/file/2026-2027_GU__Z_YABANCI_UYR.O__G__R_._KATKI_PAYI_U__CRET_TABLOSU_08_.07_.2026_CALISMA1_.pdf"
        ],
        verifieLe: LE
      }
    }
  },

  // ---------------- Égée : Izmir ----------------

  {
    id: "ege-university-izmir",
    data: {
      name: "Ege University",
      city: "Izmir",
      province: "Izmir",
      country: "Turquie",
      image: "izmir-baie.jpg",
      flag: "tr.svg",
      ranking: "#1001-1200 mondial (QS 2027)",
      officialWebsite: "https://ege.edu.tr",
      applicationPortalUrl: "https://oidb.ege.edu.tr/eng-124/contributionfees-tuition.html",
      fields: ["Médecine", "Ingénierie", "Sciences", "Agriculture", "Lettres", "Commerce"],
      description: "Université publique d'Izmir, sur la côte égée, qui admet les étudiants étrangers sur la base du TR-YÖS.",
      exoneration: {
        politique: "inconnue",
        detail: EXO_INCONNUE,
        source: "https://oidb.ege.edu.tr/eng-124/contributionfees-tuition.html",
        verifieLe: LE
      },
      admission: {
        procedure: "Candidature et choix des programmes en ligne pendant la période annoncée, puis dépôt électronique des pièces d'inscription par les admis. Les frais de scolarité sont payés au renouvellement d'inscription.",
        conditions: "Au moins 200 points à l'un des TR-YÖS de la dernière année, ceux du 19 octobre 2025 et du 12 avril 2026.",
        calendrier: "Première période : candidature du 22 au 26 juin 2026 ; résultats le 17 juillet ; inscription du 20 au 24 juillet. Seconde période à partir du 3 août 2026.",
        langue: "Examen de langue étrangère obligatoire pour les filières de langues et de guide touristique : anglais le 10 juillet, allemand le 9 juillet 2026. Sans niveau suffisant, cours de langue avant le programme.",
        fraisDossier: "Aucuns frais de dossier ne sont mentionnés dans le guide 2026.",
        coutIndicatif: "Seule grille publiée, pour les inscrits de 2023-2024, par an : 1 000 $ en sciences, lettres, communication et éducation ; 3 000 $ en économie ; 3 450 $ en ingénierie ; 10 000 $ en médecine et dentaire. Elle a plus de deux ans : les montants actuels peuvent être différents.",
        sources: [
          "https://oidb.ege.edu.tr/files/oidb/icerik/2026_eng_guide.pdf",
          "https://oidb.ege.edu.tr/eng-124/contributionfees-tuition.html",
          "https://oidb.ege.edu.tr/files/oidb/icerik/tuition_fee_for_foreigners_2023.pdf"
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "dokuz-eylul-university-izmir",
    data: {
      name: "Dokuz Eylül University",
      city: "Izmir",
      province: "Izmir",
      country: "Turquie",
      image: "izmir-tramway.jpg",
      flag: "tr.svg",
      ranking: "#1201-1400 mondial (QS 2027)",
      officialWebsite: "https://www.deu.edu.tr",
      applicationPortalUrl: "https://deyos.deu.edu.tr/",
      fields: ["Médecine", "Ingénierie", "Droit", "Commerce", "Sciences", "Lettres", "Architecture"],
      description: "Université publique d'Izmir qui admet les étudiants étrangers sur la base du TR-YÖS.",
      fraisScolarite: {
        source: "https://deyos.deu.edu.tr/wp-content/uploads/2026/07/2026_Tuition_Fees.pdf",
        verifieLe: LE,
        note: "Frais annuels 2026-2027, payés en deux fois : 94 500 TL en éducation, lettres, théologie, gestion, sport et tourisme ; 107 100 TL en droit et en économie ; 117 600 TL en sciences ; 140 700 TL en ingénierie ; 157 500 TL en architecture ; 742 000 TL en médecine. Troisième cycle : 71 400 TL. Montant retenu en licence : 94 500 TL.",
        licence: { montant: 94500, devise: "TRY", periode: "an" },
        master: { montant: 71400, devise: "TRY", periode: "an" },
        doctorat: { montant: 71400, devise: "TRY", periode: "an" }
      },
      exoneration: {
        politique: "possible_plafonnee",
        detail: "Réduction de 25 % pour les frères et sœurs, si l'étudiant et sa famille ont un permis de séjour en Turquie et que plusieurs enfants étudient dans une université publique. Les diplômés de certains lycées désignés par la présidence YTB ont leurs frais payés par elle.",
        source: "https://deyos.deu.edu.tr/wp-content/uploads/2026/07/2026_Tuition_Fees.pdf",
        verifieLe: LE
      },
      admission: {
        procedure: "Candidature et choix des programmes en ligne pendant la période annoncée, puis inscription des admis aux dates publiées ; un placement complémentaire a lieu s'il reste des places.",
        conditions: "TR-YÖS des sessions 2024/2 à 2026/1 : au moins 425 en médecine ; 400 en dentaire et droit ; 375 en ingénierie, architecture, soins infirmiers et vétérinaire ; 350 en sciences, lettres, économie, gestion et éducation ; 300 en beaux-arts et théologie. Le GCE A level est réservé aux ressortissants de Chypre du Nord.",
        calendrier: "Candidature du 27 juillet, 9 h, au 31 juillet 2026, 17 h ; résultats le 21 août ; inscription du 24 au 28 août. Placement complémentaire : choix du 1er au 4 septembre, résultats le 14, inscription du 15 au 18 septembre 2026.",
        langue: "Examen de turc organisé par le centre DİLMER et examen d'exemption de langue étrangère de l'école des langues ; leurs dates sont publiées par ces services.",
        fraisDossier: "Aucuns frais de dossier ne sont mentionnés.",
        sources: [
          "https://deyos.deu.edu.tr/en/international-student-admission-calendar/",
          "https://deyos.deu.edu.tr/wp-content/uploads/2026/07/2026_Accepted_Documents.pdf",
          "https://deyos.deu.edu.tr/wp-content/uploads/2026/07/2026_Tuition_Fees.pdf"
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "izmir-institute-of-technology-urla",
    data: {
      name: "Izmir Institute of Technology (IZTECH)",
      city: "Urla",
      province: "Izmir",
      country: "Turquie",
      image: "urla-port.jpg",
      flag: "tr.svg",
      ranking: "#1201-1400 mondial (QS 2027)",
      officialWebsite: "https://www.iyte.edu.tr",
      applicationPortalUrl: "https://uio.iyte.edu.tr/en/undergraduate-students/",
      fields: ["Ingénierie", "Architecture", "Sciences"],
      description: "Institut public de technologie installé à Urla, près d'Izmir : ingénierie, architecture et sciences. Admission sur la base du TR-YÖS.",
      fraisScolarite: {
        source: "https://ogrenciisleri.iyte.edu.tr/wp-content/uploads/sites/99/2025/08/ENG-2025-2026-Katk%C4%B1-Pay%C4%B1-ve-%C3%96%C4%9Frenim-%C3%9Ccreti-Tablosu.pdf",
        verifieLe: LE,
        note: "Grille 2025-2026 des étudiants internationaux, par semestre, pour une entrée en 2025-2026 : 40 000 TL en sciences, 60 000 TL en architecture et ingénierie, 18 000 TL à l'école doctorale. Montant retenu : 80 000 TL par an en licence et 36 000 TL par an en troisième cycle. Aucune grille 2026-2027 publiée le 25 septembre 2026.",
        licence: { montant: 80000, devise: "TRY", periode: "an" },
        master: { montant: 36000, devise: "TRY", periode: "an" },
        doctorat: { montant: 36000, devise: "TRY", periode: "an" }
      },
      exoneration: {
        politique: "inconnue",
        detail: "L'institut ne publie pas de réduction propre. Pour étudier à IZTECH avec une bourse, il renvoie à la bourse de l'État turc, Türkiye Bursları.",
        source: "https://uio.iyte.edu.tr/en/undergraduate-students/",
        verifieLe: LE
      },
      admission: {
        procedure: "Candidature en ligne pendant la période annoncée, avec trois choix de programmes et les pièces déposées dans le système. Les admis paient les frais et envoient leurs documents, puis s'inscrivent en personne au bureau de la scolarité ; un justificatif de moyens financiers équivalant à 80 000 TL en dollars est demandé.",
        conditions: "Lors de la campagne 2025-2026, la dernière décrite en détail : TR-YÖS d'au moins 300, valable deux ans. Le GCE A level est réservé aux ressortissants de Chypre du Nord. Vérifiez l'annonce 2026-2027.",
        calendrier: "Pour 2026-2027 : candidatures prolongées jusqu'au 19 juillet 2026, 23 h 59, heure turque ; admis de la période complémentaire inscrits les 17 et 18 septembre 2026.",
        langue: "Examen de placement en anglais, en deux étapes, à la rentrée.",
        fraisDossier: "Aucuns frais de dossier ne sont mentionnés ; les frais payés ne sont pas remboursés si vous renoncez.",
        sources: [
          "https://uio.iyte.edu.tr/en/undergraduate-students/",
          "https://uio.iyte.edu.tr/en/duyuru/extension-of-the-application-deadline-for-2026-2027-academic-year-international-undergraduate-admissions/",
          "https://uio.iyte.edu.tr/en/duyuru/results-of-additional-application-period-international-undergraduate-admissions-2026-2027/",
          "https://ogrenciisleri.iyte.edu.tr/en/tuition-fees-and-charges/"
        ],
        verifieLe: LE
      }
    }
  },

  // ---------------- Anatolie ----------------

  {
    id: "selcuk-university-konya",
    data: {
      name: "Selçuk University",
      city: "Konya",
      province: "Konya",
      country: "Turquie",
      image: "konya-mosquee.jpg",
      flag: "tr.svg",
      ranking: "#1201-1400 mondial (QS 2027)",
      officialWebsite: "https://www.selcuk.edu.tr",
      applicationPortalUrl: "http://suyosbasvuru.selcuk.edu.tr",
      fields: ["Médecine", "Ingénierie", "Agriculture", "Droit", "Lettres", "Sciences", "Commerce"],
      description: "Université publique de Konya, plus de 61 000 étudiants et 24 facultés. Pour la plupart des licences, un diplôme de fin d'études secondaires avec 80 % suffit.",
      fraisScolarite: {
        source: "https://selcuk.edu.tr/birim/sayfa/5466/ogrenim-ucretleri-876",
        verifieLe: LE,
        note: "Droits 2026-2027 des étudiants étrangers nouvellement inscrits, par an : 28 560 TL en communication ; 30 504 TL en lettres, éducation, théologie, sport, tourisme et sciences de la santé ; 34 320 TL en économie ; 38 064 TL en sciences ; 45 420 TL en ingénierie et architecture ; 84 000 TL en droit ; 420 000 TL en médecine. Montant retenu en licence : 28 560 TL.",
        licence: { montant: 28560, devise: "TRY", periode: "an" }
      },
      exoneration: {
        politique: "inconnue",
        detail: EXO_INCONNUE,
        source: "https://selcuk.edu.tr/birim/sayfa/5466/ogrenim-ucretleri-876",
        verifieLe: LE
      },
      admission: {
        procedure: "Candidature et placement par la coordination SÜYÖS de l'université, en ligne. Après les résultats, une annonce de pré-inscription indique comment payer les frais.",
        conditions: "Par ordre de priorité : TR-YÖS, puis SAT, ACT ou AP, puis diplôme de fin d'études secondaires. TR-YÖS de 200 pour la plupart des licences, 400 en médecine, dentaire et pharmacie. Diplôme : au moins 80 sur 100 pour toutes les licences, sauf médecine, dentaire, pharmacie, droit, éducation et technologie ; la commission convertit les notes sur 100.",
        calendrier: "SÜYÖS 2026 : candidature et placement du 22 juin au 10 juillet 2026, résultats publiés le 29 juillet 2026.",
        langue: "Turc : niveau C1 ou C2 pour commencer directement ; B1 ou B2 permet de commencer, mais il faut atteindre C1 avant le diplôme ; en dessous de B1, deux ans pour apprendre le turc.",
        fraisDossier: "Les frais de dossier sont indiqués chaque année dans le guide SÜYÖS.",
        sources: [
          "https://selcuk.edu.tr/icerik/duyuru/81362/suyos-2026-basvuru-ve-yerlestirme-sonuclari-aciklanmistir",
          "https://selcuk.edu.tr/birim/sayfa/5466/ogrenim-ucretleri-876",
          "https://webadmin.selcuk.edu.tr/uploads/Contents/suyos/icerik-serbest/27081/2026-2027%20E%C4%9E%C4%B0T%C4%B0M-%C3%96%C4%9ERET%C4%B0M%20D%C3%96NEM%C4%B0%20S%C3%9CY%C3%96S%20Y%C3%96NERGE_03062026134414.pdf"
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "erciyes-university-kayseri",
    data: {
      name: "Erciyes University",
      city: "Kayseri",
      province: "Kayseri",
      country: "Turquie",
      image: "kayseri-mont-erciyes.jpg",
      flag: "tr.svg",
      ranking: "#1201-1400 mondial (QS 2027)",
      officialWebsite: "https://www.erciyes.edu.tr",
      applicationPortalUrl: "https://obp.erciyes.edu.tr",
      fields: ["Médecine", "Ingénierie", "Droit", "Sciences", "Agriculture", "Lettres", "Commerce"],
      description: "Université publique de Kayseri, en Anatolie centrale. Le diplôme de fin d'études secondaires suffit pour candidater, sauf en médecine, dentaire et pharmacie.",
      fraisScolarite: {
        source: "https://ogrisl.erciyes.edu.tr/EditorUpload/Files/2026-27-yos-harc-on7-07tem2026.pdf",
        verifieLe: LE,
        note: "Frais 2026-2027 des étudiants admis sur le contingent international, pour l'année, payés en deux fois : 52 000 TL en lettres, théologie, éducation, santé, tourisme, sport et communication ; 58 000 TL en économie et en droit ; 64 000 TL en sciences ; 82 000 TL en ingénierie, architecture et agriculture ; 375 000 TL en médecine. Troisième cycle : 46 000 TL. Montant retenu en licence : 52 000 TL.",
        licence: { montant: 52000, devise: "TRY", periode: "an" },
        master: { montant: 46000, devise: "TRY", periode: "an" },
        doctorat: { montant: 46000, devise: "TRY", periode: "an" }
      },
      exoneration: {
        politique: "inconnue",
        detail: EXO_INCONNUE,
        source: "https://ogrisl.erciyes.edu.tr/tr/katki-payiogrenim-ucretleri-2026-27",
        verifieLe: LE
      },
      admission: {
        procedure: "Candidature uniquement en ligne, sans envoi postal. Pièces : résultat d'examen ou diplôme, relevé de notes, avec traduction turque certifiée par un notaire ou un consulat, passeport, photo et reçu du paiement. Les admis se pré-inscrivent sur obisis.erciyes.edu.tr et versent 25 % des frais, puis le reste à l'inscription définitive.",
        conditions: "Toutes les notes sont converties en points TR-YÖS. Droit et ingénierie : TR-YÖS de 200 ou diplôme d'au moins 70 sur 100. Autres facultés : TR-YÖS de 200 ou diplôme d'au moins 50 sur 100. Médecine, dentaire et pharmacie : TR-YÖS seulement, avec 400, 350 et 300 points.",
        calendrier: "Candidatures 2026-2027 du 8 au 14 juillet 2026.",
        langue: "Pièces traduites en turc, certifiées par un notaire ou un consulat. L'annonce ne précise pas le niveau de langue exigé : renseignez-vous auprès du bureau des étudiants internationaux.",
        fraisDossier: "3 000 TL de frais d'évaluation et de placement, non remboursés en cas de refus.",
        sources: [
          "https://ogrisl.erciyes.edu.tr/tr/duyuru-detay/2026-2027-egitim-ogretim-yili-on-lisans-ve-lisans-programlarina-yurtdisindan-ogrenci-kabulu-basvuru-duyurusu",
          "https://ogrisl.erciyes.edu.tr/EditorUpload/Files/2026-27-yos-harc-on7-07tem2026.pdf",
          "https://ogrisl.erciyes.edu.tr/tr/katki-payiogrenim-ucretleri-2026-27"
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "ataturk-university-erzurum",
    data: {
      name: "Atatürk University",
      city: "Erzurum",
      province: "Erzurum",
      country: "Turquie",
      image: "erzurum-hiver.jpg",
      flag: "tr.svg",
      ranking: "#1201-1400 mondial (QS 2027)",
      officialWebsite: "https://www.atauni.edu.tr",
      applicationPortalUrl: "https://yosbasvuru.atauni.edu.tr/site/index/index",
      fields: ["Médecine", "Ingénierie", "Agriculture", "Lettres", "Sciences", "Commerce", "Sciences sociales"],
      description: "Université publique d'Erzurum, dans l'est de la Turquie. Lors du second placement complémentaire, la note du diplôme de fin d'études secondaires suffit pour la plupart des facultés.",
      langueEnseignement: "Turc ; quelques programmes en anglais, dont médecine et ingénierie",
      fraisScolarite: {
        source: "https://atauni.edu.tr/ogrenci-isleri-daire-baskanligi/wp-content/uploads/sites/18/2026/08/2026-2027_Katki-Paylari_19082026.pdf",
        verifieLe: LE,
        note: "Frais annuels 2026-2027 des étudiants internationaux, payés en deux fois : 36 000 TL en lettres ; 42 000 TL en économie, théologie, éducation, communication, sport et tourisme ; 46 000 TL en sciences ; 52 000 TL en ingénierie, 78 000 TL en anglais ; 86 000 TL en pharmacie ; 110 000 TL en dentaire ; 236 000 TL en médecine, 354 000 TL en anglais. Montant retenu en licence : 36 000 TL.",
        licence: { montant: 36000, devise: "TRY", periode: "an" }
      },
      exoneration: {
        politique: "inconnue",
        detail: EXO_INCONNUE,
        source: "https://atauni.edu.tr/ogrenci-isleri-daire-baskanligi/wp-content/uploads/sites/18/2026/08/2026-2027_Katki-Paylari_19082026.pdf",
        verifieLe: LE
      },
      admission: {
        procedure: "Candidature en ligne sur yosbasvuru.atauni.edu.tr : création du compte, saisie des informations, paiement des frais de dossier, puis choix des programmes. Les frais de dossier sont payés une seule fois pour toutes les périodes.",
        conditions: "Premier placement et premier placement complémentaire : TR-YÖS des sessions 2024/2 à 2026/1. Second placement complémentaire : aussi les examens internationaux reconnus, dont le SAT avec 1000, et la note du diplôme de fin d'études secondaires, au moins 60 sur 100 pour tous les pays, sauf en médecine, dentaire, pharmacie, droit, éducation, ingénierie, architecture et santé.",
        calendrier: "Premier placement : choix du 15 juin au 19 juillet 2026, résultats le 22 juillet, inscription du 3 au 12 août. Premier complémentaire : 14 au 23 août, inscription du 7 au 16 septembre. Second complémentaire : 18 au 23 septembre, résultats le 25, inscription du 28 septembre au 2 octobre 2026.",
        langue: "Programmes en turc ou en anglais selon la faculté ; l'université correspond avec les candidats en turc et en anglais.",
        fraisDossier: "1 500 TL, payés une seule fois pour toutes les périodes de candidature.",
        sources: [
          "https://atauni.edu.tr/dis-iliskiler-ofisi/2026-yurt-disindan-veya-yabanci-uyruklu-ogrenci-alimi-kilavuzu-yayinlandi/",
          "https://admission.atauni.edu.tr/atayos/",
          "https://admission.atauni.edu.tr/wp-content/uploads/2026/06/2026-English.pdf",
          "https://admission.atauni.edu.tr/wp-content/uploads/2026/08/kabul-edilen-sinavlar.pdf"
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "karabuk-university-karabuk",
    data: {
      name: "Karabük University",
      city: "Karabük",
      province: "Karabük",
      country: "Turquie",
      image: "safranbolu-vue.jpg",
      flag: "tr.svg",
      officialWebsite: "https://www.karabuk.edu.tr",
      applicationPortalUrl: "https://yos.karabuk.edu.tr/",
      fields: ["Ingénierie", "Informatique", "Médecine", "Commerce", "Sciences sociales", "Architecture", "Lettres"],
      description: "Université publique du nord de l'Anatolie, dont plusieurs facultés sont à Safranbolu. Admission sur le TR-YÖS ou sur la note du diplôme de fin d'études secondaires, avec une inscription possible jusqu'au 30 novembre.",
      langueEnseignement: "Turc ; quelques programmes en anglais",
      fraisScolarite: {
        source: "https://iso.karabuk.edu.tr/yuklenen/dosyalar/12614092026095642.pdf",
        verifieLe: LE,
        note: "Tableau annuel des frais daté du 27 août 2026, pour les inscrits après le 30 avril 2026 : 30 000 TL en communication ; 32 000 TL en théologie, sport, tourisme et sciences humaines ; 36 000 TL en gestion et en économie, 54 000 TL en anglais ; 40 000 TL en sciences ; 46 000 TL en ingénierie, informatique et architecture, 69 000 TL en anglais ; 140 000 TL en dentaire ; 232 000 TL en médecine. Montant retenu en licence : 30 000 TL.",
        licence: { montant: 30000, devise: "TRY", periode: "an" }
      },
      exoneration: {
        politique: "possible_plafonnee",
        detail: "Une fois inscrit, vous pouvez demander chaque année une réduction des frais sur harcindirimi.karabuk.edu.tr ; elle est examinée sur vos notes et vos activités académiques.",
        source: "https://iso.karabuk.edu.tr/icerikGoster.aspx?K=D&id=8259&BA=en",
        verifieLe: LE
      },
      admission: {
        procedure: "Candidature en ligne sur yos.karabuk.edu.tr, un seul compte et une seule filière. Les résultats et la lettre d'admission, qui fixe la période d'inscription, sont dans le même système ; tous les paiements s'y font. L'inscription est possible dès le 1er juillet, une fois entré légalement en Turquie.",
        conditions: "Admission avec le TR-YÖS ou avec la note du diplôme de fin d'études secondaires de votre pays, affectée d'un coefficient. Médecine, dentaire et génie médical : TR-YÖS seulement.",
        calendrier: "Candidatures 2026-2027 ouvertes ; inscription en licence limitée du 1er juillet au 30 novembre 2026 par décision de YÖK. Si vous ne pouvez pas venir dans la période de votre lettre, payer un cours de turc de TÖMER, 10 000 TL, la prolonge jusqu'au 30 novembre 2026.",
        langue: "Les admis qui doivent apprendre le turc commencent par TÖMER ; la préparation en anglais commence en septembre.",
        fraisDossier: "Aucuns frais de dossier ne sont mentionnés ; tous les paiements passent par le système en ligne.",
        sources: [
          "https://iso.karabuk.edu.tr/icerikGoster.aspx?K=D&id=8253&BA=en",
          "https://iso.karabuk.edu.tr/icerikGoster.aspx?K=S&id=87&BA=en",
          "https://iso.karabuk.edu.tr/icerikGoster.aspx?K=D&id=8261&BA=en"
        ],
        verifieLe: LE
      }
    }
  }

];

// ---------------- Les six fiches existantes ----------------
// `attendu` porte l'état lu dans l'export du 2026-09-24T23:52:22Z : les
// champs ajoutés sont ABSENTS (undefined), les champs remplacés sont
// recopiés entiers. Si quelqu'un est passé avant, le lot bloque au lieu
// d'écraser.

export const PATCHES = [
  {
    collection: "universities",
    id: "bilkent-university-ankara",
    motif: "fiche complète : démarche des candidats internationaux (dates 2026, examens, baccalauréat du Sénégal 15/20, anglais), province, langue, rang QS ex æquo, relus au navigateur le 2026-09-25",
    attendu: {
      province: undefined,
      langueEnseignement: undefined,
      ranking: "#454 mondial (QS 2027)",
      admission: undefined
    },
    champs: {
      province: "Ankara",
      langueEnseignement: "Anglais",
      ranking: "#454 mondial ex æquo (QS 2027)",
      admission: {
        "procedure": "Candidature en ligne par le formulaire des candidats internationaux de Bilkent. Les notes prévisionnelles ne sont pas évaluées : déposez des résultats définitifs. Atteindre le minimum ne garantit pas l'admission.",
        "conditions": "Baccalauréat du Sénégal : au moins 15 sur 20. Cameroun et Maroc : 12 sur 20 ; Côte d'Ivoire : 320 sur 400. Autres voies : SAT d'au moins 1000 en maths et lecture, trois A level avec au moins C, IB 28, médaille d'une olympiade scientifique internationale.",
        "calendrier": "Candidatures en licence pour la rentrée d'automne 2026-2027 du 2 février au 12 juillet 2026.",
        "langue": "Enseignement en anglais. IELTS 6,5 avec au moins 5,5 par épreuve, ou TOEFL iBT 87, sinon l'examen d'anglais de Bilkent à l'arrivée ; en cas d'échec, programme préparatoire d'anglais.",
        "fraisDossier": "Aucuns frais de dossier ne sont mentionnés sur les pages de candidature.",
        "sources": [
          "https://w3.bilkent.edu.tr/international/how-to-apply/",
          "https://w3.bilkent.edu.tr/form/Ulusal_ve_Uluslararasi_Sinavlarda_Aranan_Asgari_Puanlar.pdf",
          "https://w3.bilkent.edu.tr/international/english-language-proficiency/"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    collection: "universities",
    id: "bogazici-university-istanbul",
    motif: "fiche complète : démarche 2026-2027 (dates, examens, anglais), province, langue, rang QS ex æquo, et note de frais réécrite sans capitales ni tiret long, montants relus et inchangés, le 2026-09-25",
    attendu: {
      province: undefined,
      langueEnseignement: undefined,
      ranking: "#345 mondial (QS 2027)",
      fraisScolarite: {
        "source": "https://intl.bogazici.edu.tr/tuition-undergraduate-and-graduate-degree-programs",
        "verifieLe": "2026-09-13",
        "note": "Licence sous quota international, PAR SEMESTRE : 5 000 $ US en économie/sciences administratives et en ingénierie, 4 000 $ dans les autres facultés (éducation, sciences, lettres et sciences sociales, droit) — soit 8 000 à 10 000 $/an. Master : 1 000 $ par an (500 $/semestre). Hébergement et repas non compris. Frais de dossier : 100 € en licence, 50 $ en master. Montant retenu en licence : 8 000 $ (le plus bas, lettres et sciences).",
        "licence": {
          "montant": 8000,
          "devise": "USD",
          "periode": "an"
        },
        "master": {
          "montant": 1000,
          "devise": "USD",
          "periode": "an"
        }
      },
      admission: undefined
    },
    champs: {
      province: "Istanbul",
      langueEnseignement: "Anglais",
      ranking: "#345 mondial ex æquo (QS 2027)",
      fraisScolarite: {
        "source": "https://intl.bogazici.edu.tr/tuition-undergraduate-and-graduate-degree-programs",
        "verifieLe": "2026-09-25",
        "note": "Licence, étudiants internationaux, par semestre : 5 000 $ en économie et sciences administratives et en ingénierie ; 4 000 $ en éducation, sciences, lettres et sciences sociales, et droit ; soit 8 000 à 10 000 $ par an. Master : 500 $ par semestre, 1 000 $ par an. Logement et repas non compris. Montant retenu en licence : 8 000 $, le plus bas.",
        "licence": {
          "montant": 8000,
          "devise": "USD",
          "periode": "an"
        },
        "master": {
          "montant": 1000,
          "devise": "USD",
          "periode": "an"
        }
      },
      admission: {
        "procedure": "Candidature en ligne sur le système de l'université, avec les documents demandés et le résultat d'un examen accepté. Le score SAT doit être envoyé par le College Board, code 0796.",
        "conditions": "SAT : 1350 avec 700 en maths en ingénierie, 1300 avec 700 en maths en sciences, 1200 en éducation, 1300 ailleurs. Autres voies : ACT 29, IB 36, trois A level avec A, TR-YÖS 450, WAEC ou WASSCE avec trois A1 sur six matières et au moins B3 ailleurs, baccalauréat français avec 14,5 sur 20. Le baccalauréat sénégalais n'est pas dans la liste.",
        "calendrier": "Candidatures 2026-2027 du 6 avril 2026, 10 h, au 5 juin 2026, 17 h, heure turque.",
        "langue": "Enseignement en anglais. Examen d'anglais de l'université, ou IELTS Academic 6,5 avec 6,5 à l'écrit, ou TOEFL iBT d'au moins 4,5 dans chaque épreuve, résultats de moins de deux ans.",
        "fraisDossier": "100 € en licence ; 50 € ou 50 $ en troisième cycle.",
        "sources": [
          "https://globalstudents.bogazici.edu.tr/en/pages/application-process/6014",
          "https://globalstudents.bogazici.edu.tr/en/pages/accepted-exams-diplomas/6015",
          "https://globalstudents.bogazici.edu.tr/en/pages/english-proficiency-and-exemption/3020",
          "https://intl.bogazici.edu.tr/tuition-undergraduate-and-graduate-degree-programs"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    collection: "universities",
    id: "istanbul-technical-university-istanbul",
    motif: "fiche complète : démarche 2026-2027 (calendrier du bureau de la scolarité, pièces, turc C1), province, langue, rang QS ex æquo, exonération trouvée (réductions et fratrie 25 %), note de frais réécrite sans capitales, montants inchangés, relus le 2026-09-25",
    attendu: {
      province: undefined,
      langueEnseignement: undefined,
      ranking: "#279 mondial (QS 2027)",
      fraisScolarite: {
        "source": "https://www.sis.itu.edu.tr/EN/student/tuition-fee/fees/20261020/tutionfees.php",
        "verifieLe": "2026-09-13",
        "note": "Grille officielle 2025-26, étudiant admis sous quota international, PAR AN en deux versements. Licence, entrée 2023-24 et après : de 79 000 TL (arts et sciences) à 264 000 TL (conservatoire) selon la faculté ; ingénierie civile 94 500 TL. Master : 33 300 TL pour les entrées 2024-25 et 2025-26. Montant retenu en licence : 79 000 TL, le plus bas de la grille. Aucune conversion en dollars sur cette page.",
        "licence": {
          "montant": 79000,
          "devise": "TRY",
          "periode": "an"
        },
        "master": {
          "montant": 33300,
          "devise": "TRY",
          "periode": "an"
        }
      },
      exoneration: {
        "politique": "inconnue",
        "detail": "L'ITU mentionne une réduction des frais pour certains étudiants internationaux, sans en publier les critères. L'ITU cite deux cas : 25 % de réduction dans certaines situations familiales, et exonération des boursiers dont la bourse couvre les frais, comme Türkiye Bursları.",
        "source": "https://www.sis.itu.edu.tr/EN/student/tuition-fee/tuition-fee.php",
        "verifieLe": "2026-09-23"
      },
      admission: undefined
    },
    champs: {
      province: "Istanbul",
      langueEnseignement: "Turc, anglais, ou 30 % d'anglais selon le programme",
      ranking: "#279 mondial ex æquo (QS 2027)",
      fraisScolarite: {
        "source": "https://www.sis.itu.edu.tr/EN/student/tuition-fee/fees/20261020/tutionfees.php",
        "verifieLe": "2026-09-25",
        "note": "Grille 2025-2026 des étudiants admis sur le contingent international, par an, payée en deux fois. Licence, entrée depuis 2023-2024 : de 79 000 TL en arts et sciences à 264 000 TL au conservatoire ; génie civil 94 500 TL. Master, entrées 2024-2025 et 2025-2026 : 33 300 TL. Montant retenu en licence : 79 000 TL, le plus bas. La grille générale 2026-2027 n'était pas publiée le 25 septembre 2026.",
        "licence": {
          "montant": 79000,
          "devise": "TRY",
          "periode": "an"
        },
        "master": {
          "montant": 33300,
          "devise": "TRY",
          "periode": "an"
        }
      },
      exoneration: {
        "politique": "possible_plafonnee",
        "detail": "L'ITU accorde une réduction aux étudiants internationaux qui y ont droit, sans en publier les critères, et une réduction selon le taux de handicap. Réduction de 25 % pour les frères et sœurs si l'étudiant et sa famille ont un permis de séjour en Turquie. Les boursiers dont la bourse couvre les frais sont exonérés.",
        "source": "https://www.sis.itu.edu.tr/EN/student/tuition-fee/tuition-fee.php",
        "verifieLe": "2026-09-25"
      },
      admission: {
        "procedure": "Candidature en ligne sur le site du bureau de la scolarité, pièces en PDF : diplôme original et traduction en turc ou en anglais, relevé de notes certifié, résultat d'un examen de la liste de l'université, passeport. À l'inscription, une équivalence du diplôme délivrée par le ministère turc de l'Éducation ou une ambassade de Turquie.",
        "conditions": "Un seul examen ou diplôme de la liste de l'ITU, au score minimum ; atteindre ce minimum ne garantit pas l'admission.",
        "calendrier": "Pour 2026-2027 : pré-inscriptions du 18 mai au 17 juillet 2026, admis annoncés le 27 juillet, inscription du 10 au 12 août ; seconde période du 21 au 26 août, admis le 1er septembre, inscription et paiement du 2 au 4 septembre 2026.",
        "langue": "Programmes en turc, à 30 % en anglais, et conservatoire : certificat de turc de niveau C1 dans l'année suivant l'inscription. Programmes en anglais : examen d'anglais reconnu par l'université.",
        "fraisDossier": "Aucuns frais de dossier ne sont mentionnés sur la page de candidature.",
        "sources": [
          "https://www.sis.itu.edu.tr/EN/student/intenational-students/application.php",
          "https://www.takvim.sis.itu.edu.tr/AkademikTakvim/EN/academic-calendar/AkademikTakvimTablo.php?taslak=856&akademikyil=854&ustbaslik=&takvimadi=17&katagori=&baslangic=&bitis=",
          "https://www.sis.itu.edu.tr/EN/student/tuition-fee/tuition-fee.php"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    collection: "universities",
    id: "istanbul-university-istanbul",
    motif: "fiche complète : grille 2026-2027 en livres turques trouvée sur le site d'admission (remplace la grille 2024-2025 en dollars, de plus de deux ans), démarche ISAD 2026, province, rang QS ex æquo, relus le 2026-09-25",
    attendu: {
      province: undefined,
      ranking: "#629 mondial (QS 2027)",
      fraisScolarite: {
        "source": "https://cdn.istanbul.edu.tr/FileHandler2.ashx?f=tuition-fees-2024-2025.pdf",
        "verifieLe": "2026-09-13",
        "note": "Grille officielle PDF du serveur de l'universite, annee 2024-2025, en dollars. Le tableau donne DEUX colonnes, tarif d'un semestre et tarif annuel : le montant annuel est donc affiche par l'universite elle-meme, sans recalcul. Licence, selon la faculte : lettres 2 000 ; economie 2 500 ; gestion, sciences politiques, communication, transport et logistique 3 000 ; sciences, sciences aquatiques, soins infirmiers et informatique 3 500 ; droit et architecture 4 000 ; pharmacie et conservatoire 5 000 ; dentaire 6 500 ; medecine 10 000. Montant retenu en licence : 3 000 USD, le palier le plus frequent. La ligne du troisieme cycle donne 1 000 USD par semestre, soit 2 000 USD/an, SANS distinction entre master et doctorat — le meme montant est donc porte aux deux niveaux. ATTENTION A L'ANNEE : la grille 2025-2026 n'a pas pu etre lue, l'en-tete du PDF annonce qu'elle sera mise a jour et le fichier correspondant ne se charge pas ; la page du bureau international redirige vers l'accueil. Le PDF prevoit aussi une remise de 25 % si plusieurs enfants d'une meme famille etudient dans un etablissement public turc.",
        "licence": {
          "montant": 3000,
          "devise": "USD",
          "periode": "an"
        },
        "master": {
          "montant": 2000,
          "devise": "USD",
          "periode": "an"
        },
        "doctorat": {
          "montant": 2000,
          "devise": "USD",
          "periode": "an"
        }
      },
      admission: undefined
    },
    champs: {
      province: "Istanbul",
      ranking: "#629 mondial ex æquo (QS 2027)",
      fraisScolarite: {
        "source": "https://cdn.istanbul.edu.tr/FileHandler2.ashx?f=ogrenim_ucretleri_2026-2027.pdf",
        "verifieLe": "2026-09-25",
        "note": "Grille 2026-2027 des étudiants internationaux, par an, moitié à l'automne et moitié au printemps : 95 220 TL en lettres et en théologie ; 119 025 TL en économie ; 142 830 TL en gestion, sciences politiques et communication ; 166 635 TL en sciences et informatique ; 190 440 TL en droit, architecture et soins infirmiers ; 309 465 TL en dentaire ; 476 100 TL en médecine. Troisième cycle : 95 220 TL. Montant retenu en licence : 95 220 TL. L'année préparatoire coûte le tarif de la faculté.",
        "licence": {
          "montant": 95220,
          "devise": "TRY",
          "periode": "an"
        },
        "master": {
          "montant": 95220,
          "devise": "TRY",
          "periode": "an"
        },
        "doctorat": {
          "montant": 95220,
          "devise": "TRY",
          "periode": "an"
        }
      },
      admission: {
        "procedure": "Candidature en ligne sur le système ISAD : création d'un compte, saisie des informations, paiement des frais par carte, validation par un conseiller, puis choix des programmes.",
        "conditions": "SAT, ACT, TR-YÖS des sessions 2024/2 à 2026/1, IB, baccalauréat français, Abitur ou Matura autrichienne ; le GCE A level est réservé aux ressortissants de Chypre du Nord. Un score sous le minimum annoncé entraîne le refus, et les critères ne garantissent pas l'admission.",
        "calendrier": "Candidature et choix du 13 au 20 juillet 2026 ; résultats le 17 août ; lettres d'admission en ligne les 19 et 20 août ; examen de turc le 22 septembre et examen d'anglais le 24 septembre 2026.",
        "langue": "Examen de turc et examen d'anglais de l'université en septembre ; sans le niveau requis, année préparatoire.",
        "fraisDossier": "950 TL ou 20 $, payés en ligne à la candidature.",
        "sources": [
          "https://isad.istanbul.edu.tr/tr/_",
          "https://cdn.istanbul.edu.tr/FileHandler2.ashx?f=isad-basvuru-kilavuzu-2026.pdf",
          "https://cdn.istanbul.edu.tr/FileHandler2.ashx?f=ogrenim_ucretleri_2026-2027.pdf"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    collection: "universities",
    id: "koc-university-istanbul",
    motif: "fiche complète : démarche Fall 2026 (périodes, entretien, frais de dossier), province, rang QS ex æquo, et note de frais réécrite sans capitales ni tiret long, montants relus et inchangés, le 2026-09-25",
    attendu: {
      province: undefined,
      ranking: "#329 mondial (QS 2027)",
      fraisScolarite: {
        "source": "https://international.ku.edu.tr/undergraduate-programs/tuition-and-scholarships/",
        "verifieLe": "2026-09-13",
        "note": "Universite PRIVEE. Tarifs officiels 2025-2026 pour etudiants internationaux, en dollars. Licence : 38 000 USD/an pour la quasi-totalite des programmes — droit, soins infirmiers, sciences sociales et humaines, economie, gestion, relations internationales, toutes les ingenieries, sciences — et 59 000 USD/an en medecine. Les frais sont annonces par semestre mais le montant affiche couvre deja l'annee complete : aucun recalcul. MASTER ET DOCTORAT, POINT DECISIF : les programmes de master avec these et de doctorat des ecoles doctorales de sciences et ingenierie, de sciences sociales et humaines et de commerce sont affiches « 0 USD, entierement finances ». Seule l'ecole doctorale des sciences de la sante facture, a 30 800 USD/an en master comme en doctorat, et le LLM en droit 24 300 USD/an. Le montant retenu de 30 800 USD est le seul tarif reellement paye par un autofinance — mais POUR UN CANDIDAT AFRICAIN EN INGENIERIE OU EN SCIENCES SOCIALES LE MONTANT REEL EST ZERO. Non lus : le tableau des masters sans these et les grilles 2026-2027, non encore publiees.",
        "licence": {
          "montant": 38000,
          "devise": "USD",
          "periode": "an"
        },
        "master": {
          "montant": 30800,
          "devise": "USD",
          "periode": "an"
        },
        "doctorat": {
          "montant": 30800,
          "devise": "USD",
          "periode": "an"
        }
      },
      admission: undefined
    },
    champs: {
      province: "Istanbul",
      ranking: "#329 mondial ex æquo (QS 2027)",
      fraisScolarite: {
        "source": "https://international.ku.edu.tr/undergraduate-programs/tuition-and-scholarships/",
        "verifieLe": "2026-09-25",
        "note": "Université privée. Frais 2025-2026 des étudiants internationaux, par an : 38 000 $ pour presque toutes les licences, dont droit, soins infirmiers, sciences sociales, économie, gestion, ingénierie et sciences ; 59 000 $ en médecine. Master avec thèse et doctorat en sciences, ingénierie, sciences sociales et commerce : financés, sans frais. École doctorale des sciences de la santé : 30 800 $ par an en master et doctorat, montant retenu. Grille 2026-2027 non publiée le 25 septembre 2026.",
        "licence": {
          "montant": 38000,
          "devise": "USD",
          "periode": "an"
        },
        "master": {
          "montant": 30800,
          "devise": "USD",
          "periode": "an"
        },
        "doctorat": {
          "montant": 30800,
          "devise": "USD",
          "periode": "an"
        }
      },
      admission: {
        "procedure": "Candidature entièrement en ligne sur apply.ku.edu.tr, sans envoi de document par courrier ou par courriel. Chaque candidat passe un entretien vidéo en ligne. Le dossier est évalué dans son ensemble : notes, examens, activités, lettres de recommandation et motivation.",
        "conditions": "Le SAT est l'examen le plus souvent présenté, mais l'université reconnaît de nombreux diplômes nationaux et internationaux ; un score sous le minimum de votre diplôme entraîne un refus. Scores d'examens valables deux ans, notes de diplôme sans limite.",
        "calendrier": "Rentrée 2026 : anticipée du 1er janvier au 1er mars 2026, normale du 2 mars au 31 mai, tardive du 1er juin au 15 juillet, prolongée au 5 août 2026 ; médecine du 15 avril au 31 mai. Logement garanti pour les candidatures reçues avant le 15 juillet.",
        "langue": "Preuve d'anglais : TOEFL iBT d'au moins 4,5 sur 6 pour les examens passés depuis le 21 janvier 2026, ou 80 avant. Exemption si vos trois dernières années de lycée étaient dans un pays dont l'anglais est la langue officielle, ce qui exclut le Nigeria.",
        "fraisDossier": "Frais de dossier non remboursables, payés par carte ; le montant est fixé chaque année et affiché sur apply.ku.edu.tr.",
        "sources": [
          "https://international.ku.edu.tr/undergraduate-programs/how-to-apply/",
          "https://international.ku.edu.tr/undergraduate-programs/tuition-and-scholarships/",
          "https://international.ku.edu.tr/undergraduate-programs/application-faqs/"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  },
  {
    collection: "universities",
    id: "sabanci-university-istanbul",
    motif: "fiche complète : démarche 2026 (dates, frais de dossier 30 $, baccalauréat du Sénégal 16/20), province, rang QS ex æquo, et note de frais réécrite sans capitales ni tiret long, montants relus et inchangés, le 2026-09-25",
    attendu: {
      province: undefined,
      ranking: "#357 mondial (QS 2027)",
      fraisScolarite: {
        "source": "https://iro.sabanciuniv.edu/en/tuition-fee",
        "verifieLe": "2026-09-13",
        "note": "Universite PRIVEE. Le bureau des relations internationales affiche un chiffre unique et explicitement ANNUEL pour 2026-2027 : 36 500 USD pour les etudiants internationaux de licence, sans distinction de faculte. Aucun recalcul semestriel. MASTER ET DOCTORAT : l'universite ecrit que « la quasi-totalite des etudiants admis dans les programmes academiques de troisieme cycle, hors programmes professionnels, recoivent une exoneration totale des frais annuels » — d'ou zero porte aux deux niveaux, ce qui correspond a la situation reelle de la quasi-totalite des admis. Non lus : le tarif des programmes professionnels, MBA compris, que l'universite ne publie pas et renvoie a une adresse de contact, et les frais de logement en residence.",
        "licence": {
          "montant": 36500,
          "devise": "USD",
          "periode": "an"
        },
        "master": {
          "montant": 0,
          "devise": "USD",
          "periode": "an"
        },
        "doctorat": {
          "montant": 0,
          "devise": "USD",
          "periode": "an"
        }
      },
      admission: undefined
    },
    champs: {
      province: "Istanbul",
      ranking: "#357 mondial ex æquo (QS 2027)",
      fraisScolarite: {
        "source": "https://iro.sabanciuniv.edu/en/tuition-fee",
        "verifieLe": "2026-09-25",
        "note": "Université privée. Frais annuels 2026-2027 des étudiants internationaux en licence : 36 500 $, quelle que soit la faculté. Master et doctorat académiques : presque tous les admis, hors programmes professionnels, sont exonérés de la totalité des frais, d'où le montant zéro retenu. Non publiés : le tarif des programmes professionnels, MBA compris, et le logement.",
        "licence": {
          "montant": 36500,
          "devise": "USD",
          "periode": "an"
        },
        "master": {
          "montant": 0,
          "devise": "USD",
          "periode": "an"
        },
        "doctorat": {
          "montant": 0,
          "devise": "USD",
          "periode": "an"
        }
      },
      admission: {
        "procedure": "Candidature en ligne : vous remplissez le formulaire, déposez vos documents et vos résultats d'examen, et payez les frais de dossier. Les bourses étant très disputées, joignez toutes les pièces qui appuient votre dossier.",
        "conditions": "Baccalauréat du Sénégal : au moins 16 sur 20. Cameroun et Côte d'Ivoire : 14 sur 20. Autres voies : deux A level avec C, IB 28, ACT 23, SAT.",
        "calendrier": "Candidatures ouvertes le 1er janvier 2026 ; date anticipée le 14 mars 2026 ; clôture le 28 août 2026 à 16 h, heure turque.",
        "langue": "Sans certificat, année de préparation, dite Foundation Development Year. Exemption avec TOEFL iBT 85, PTE Academic 71, Cambridge CAE ou CPE avec C, ou 70 à l'examen d'anglais de l'université ; les versions à domicile ou en ligne ne sont pas acceptées.",
        "fraisDossier": "30 $, payés en remplissant le formulaire en ligne.",
        "sources": [
          "https://iro.sabanciuniv.edu/en/how-to-apply",
          "https://iro.sabanciuniv.edu/en/tuition-fee",
          "https://iro.sabanciuniv.edu/en/required-examdiploma-list-2025-2026",
          "https://iro.sabanciuniv.edu/en/exemption-foundation-development-year"
        ],
        "verifieLe": "2026-09-25"
      }
    }
  }
];

// Aucune bourse ni aucun lien de programme dans ce lot.
export const SCHOLARSHIPS = [];
export const LINKS = [];

// Le lot refuse de se charger si une photo déclarée n'existe pas
// (incident du lot 35).
const manquants = UNIVERSITIES
  .map((u) => u.data.image)
  .filter((f) => f && !existsSync(`assets/images/cities/${f.replace(/\.jpg$/, "")}-1600w.avif`))
  .map((f) => `cities/${f}`);

if (manquants.length) {
  throw new Error(`Lot 89 : ${manquants.length} photo(s) absente(s) : lancer d'abord \`node scripts\\add-lot89-photos.mjs\` :\n  ${manquants.join("\n  ")}`);
}
