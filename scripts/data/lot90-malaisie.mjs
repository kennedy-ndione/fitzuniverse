// ============================================================
// FitzUniverse — Lot 90 : MALAISIE, de 2 à 17 établissements
// Recherche du 2026-09-25, sources officielles uniquement : sites des
// universités (bureaux d'admission internationale, grilles de frais en
// PDF), topuniversities.com pour le seul classement mondial.
//
// POURQUOI
// Charles, le 2026-09-25 : « On passe au lot Malaisie : de 2 à environ
// 15-20 établissements, fiches complètes, même exigence que la
// Turquie. » Liste retenue avec lui le même jour : les suivants du
// classement QS 2027, plus des établissements très fréquentés par les
// étudiants africains (IIUM, APU), sans UiTM (licence fermée aux
// étrangers).
//
// MÉTHODE
// Six recherches parallèles (WebFetch) ont produit un brouillon ; TOUT
// ce qui entre ici a ensuite été RELU AU NAVIGATEUR INTÉGRÉ, depuis le
// réseau de Charles, le 2026-09-25 : pages HTML et PDF officiels (texte
// extrait dans la page par pdf.js, lignes de tableau reconstituées par
// leur position quand la mise en page mélangeait les colonnes, MMU).
// Corrections apportées par la relecture :
//   - UTM : le brouillon disait le Sénégal absent de la grille par
//     pays ; il y figure (14 sur 20 dans les matières exigées).
//   - UM : frais de dossier contradictoires sur deux pages officielles
//     (500 et 300 ringgits) ; les deux montants sont dits.
//   - UMPSA : deux grilles se contredisaient ; seule la grille « 2025/2026
//     intake onwards », avant réduction, est retenue. Le document des
//     frais de dossier date de 2020 : non repris.
//   - UUM : grille de licence 2022-2023, trop ancienne : elle va dans
//     admission.coutIndicatif. Âge limite de 18 à 25 ans en licence.
//   - UTP : frais de master et de doctorat en recherche de janvier 2020 :
//     non repris.
//   - Taylor's : prix de licence retenu sur la grille la plus basse
//     (arts du spectacle), relue ligne par ligne.
//   - UKM : le campus principal est à Bangi (Selangor), pas à Kuala
//     Lumpur ; la fiche existante est corrigée (ville, province, photo).
// ÉCARTÉE : Limkokwing (Cyberjaya). Le site est derrière une
// vérification Cloudflare que Charles n'a pas pu passer, et aucun prix
// de scolarité n'est publié.
// SEGi : gardée sans frais de scolarité (non publiés sur les pages
// lisibles ; les pages de cours sont derrière Cloudflare), choix de
// Charles. Les pages de university.segi.edu.my contiennent des liens de
// spam injectés : signalé à Charles.
// Classement : QS 2027 relu au navigateur sur topuniversities le même
// jour (endpoint du classement, filtre Malaisie, 32 établissements).
//
// NON TROUVÉ, donc NON ÉCRIT : chiffres officiels d'étudiants africains
// par université ; seuils d'anglais en licence d'UPM, de l'IIUM et de
// SEGi ; frais de dossier à jour d'UMPSA, d'UNITEN, de MMU et de l'IIUM ;
// langue d'enseignement de la plupart des établissements.
//
// PRIX RETENU : le tarif annuel le plus bas d'une licence (hors
// enseignement à distance) ; les grilles par semestre sont doublées et
// les totaux de programme divisés par la durée, et la note le dit. Les
// frais d'inscription, de visa et de logement ne sont pas comptés.
//
// LES DEUX FICHES EXISTANTES (UM, UKM) reçoivent en PATCHES leur bloc
// `admission`, leur province, et des notes de frais réécrites (mots en
// capitales, accents manquants) ; UKM change de ville.
//
// PHOTOS : scripts/add-lot90-photos.mjs, AVANT `lot.mjs analyser`.
// Le lot refuse de se charger si une photo manque.
// ============================================================

import { existsSync } from "node:fs";

const LE = "2026-09-25";

// Phrases communes, écrites une fois.
const SANS_BAC_LISTE = "Le baccalauréat du Sénégal n'apparaît pas dans les conditions publiées : faites vérifier votre diplôme par le bureau international avant de candidater.";
const EXO_INCONNUE = "L'université ne publie pas de réduction des frais pour les étudiants internationaux en licence sur ses pages d'admission et de frais.";
const VISA = "Une fois admis, l'université demande pour vous le visa étudiant auprès d'EMGS, l'agence malaisienne des étudiants internationaux.";

export const UNIVERSITIES = [

  // ---------------- Penang ----------------

  {
    id: "universiti-sains-malaysia-penang",
    data: {
      name: "Universiti Sains Malaysia (USM)",
      city: "Gelugor",
      province: "Penang",
      country: "Malaisie",
      image: "penang-kek-lok-si.jpg",
      flag: "my.svg",
      ranking: "#128 mondial ex æquo (QS 2027)",
      officialWebsite: "https://www.usm.my",
      applicationPortalUrl: "https://pohon.usm.my/portal/index.php/Onlineint",
      fields: ["Sciences", "Ingénierie", "Médecine", "Informatique", "Sciences sociales", "Lettres", "Commerce", "Architecture"],
      description: "Université publique de recherche sur l'île de Penang, deuxième de Malaisie au classement QS 2027. Campus principal à Gelugor, campus d'ingénierie et de santé à part.",
      fraisScolarite: {
        source: "https://admission.usm.my/images/00uginternational/fee_2025/UNDERGRADUATE_INTERNATIONAL_TUITION_FEES_PER_SEMESTER.pdf",
        verifieLe: LE,
        note: "Grille des licences pour non-citoyens, par semestre, en dollars, mise en ligne le 2 septembre 2025 : 1 562,50 $ en sciences sociales, musique, beaux-arts, traduction, linguistique malaise et littérature anglaise ; 1 875 $ en économie ; 2 125 $ à 3 125 $ dans la plupart des sciences et ingénieries ; 13 750 $ en médecine. Montant retenu en licence : 3 125 $ par an, soit deux semestres au tarif le plus bas. Master et doctorat en recherche, tarifs de la session 2025-2026 : 1 400 $ par semestre en sciences sociales, lettres, langues et gestion, jusqu'à 2 500 $ en santé ; s'y ajoutent une inscription de 225 $ et une caution de 1 000 $. Une taxe de 6 % s'applique aux étudiants internationaux.",
        licence: { montant: 3125, devise: "USD", periode: "an" },
        master: { montant: 2800, devise: "USD", periode: "an" },
        doctorat: { montant: 2800, devise: "USD", periode: "an" }
      },
      exoneration: {
        politique: "possible_plafonnee",
        detail: "Doctorat en recherche à plein temps : la bourse USMCARE paie les seuls frais de scolarité, jusqu'à 36 mois, aux étudiants de pays à revenu faible ou intermédiaire inférieur, sur dossier : licence avec au moins 3,00 et une publication indexée. Candidatures jusqu'au 1er octobre 2026. En licence, aucune réduction publiée.",
        source: "https://admission.usm.my/index.php/postgraduate/financial-assistance",
        verifieLe: LE
      },
      admission: {
        procedure: "Candidature en ligne sur le portail international de l'USM : vous créez un compte, un numéro de dossier vous est envoyé par courriel, puis vous déposez diplômes, relevés, traductions s'ils ne sont ni en anglais ni en malais, test d'anglais, passeport et reçu des frais de dossier. " + VISA,
        conditions: "Au moins douze années d'études réussies et un diplôme de fin d'études secondaires ou équivalent reconnu par la Malaisie. Les résultats prévisionnels ou provisoires ne sont pas acceptés. Selon le programme, un entretien ou un test. La liste des diplômes de l'USM donne l'accès direct en licence au baccalauréat du Bénin, du Mali, du Niger, de Guinée, du Togo et de France. " + SANS_BAC_LISTE,
        calendrier: "Rentrée principale au premier semestre, en octobre ; les lettres d'admission définitives du premier semestre 2026-2027 ont été envoyées. Les dates de candidature ne sont pas publiées sur les pages internationales.",
        langue: "IELTS 5,0, TOEFL iBT 40, PTE Academic 47, Cambridge 154 ou MUET 3,5. Dispense si votre établissement précédent enseignait en anglais.",
        fraisDossier: "100 ringgits par candidature, payés en ligne.",
        sources: [
          "https://admission.usm.my/index.php/undergraduate/undergraduate-international",
          "https://admission.usm.my/index.php/undergraduate/undergraduate-international/how-to-apply-international",
          "https://admission.usm.my/images/LIST_OF_ENTRY_QUALIFICATIONS_FOR_INTERNATIONAL_STUDENT.compressed.pdf",
          "https://admission.usm.my/postgraduate/fee-pg",
          "https://pohon.usm.my/t_international.php"
        ],
        verifieLe: LE
      }
    }
  },

  // ---------------- Selangor et Kuala Lumpur ----------------

  {
    id: "universiti-putra-malaysia-serdang",
    data: {
      name: "Universiti Putra Malaysia (UPM)",
      city: "Serdang",
      province: "Selangor",
      country: "Malaisie",
      image: "putrajaya-mosquee-putra.jpg",
      flag: "my.svg",
      ranking: "#138 mondial (QS 2027)",
      officialWebsite: "https://upm.edu.my",
      applicationPortalUrl: "http://smp.upm.edu.my/smp/action/security/loginSmpApplicantSetup",
      fields: ["Agriculture", "Sciences", "Ingénierie", "Informatique", "Commerce", "Sciences sociales", "Lettres", "Médecine"],
      description: "Université publique de recherche à Serdang, près de Putrajaya. Agriculture, sciences, ingénierie, économie et langues.",
      fraisScolarite: {
        source: "https://akademik.upm.edu.my/upload/dokumen/menul320250306085254Registration_Guidelines_2025_(2).pdf",
        verifieLe: LE,
        note: "Guide d'inscription 2025 du campus de Serdang, rentrée d'octobre, par semestre et par an : 12 000 ringgits par an en communication et dans les licences de langues et de littérature, avec entretien ; 16 000 en économie ; 20 000 dans la plupart des sciences et en agriculture ; 22 000 en ingénierie. S'ajoutent 800 ringgits d'inscription la première fois et 2 000 ringgits de frais de service par semestre, hors logement, visa, assurance et visite médicale. Montant retenu en licence : 12 000 ringgits. Master et doctorat en recherche, grille revue le 16 juin 2026 : 17 600 ringgits pour deux ans de master et 33 900 pour quatre ans de doctorat en sciences sociales, soit 8 800 et 8 475 par an. Taxe de 6 % pour les étudiants internationaux depuis le 1er juin 2026.",
        licence: { montant: 12000, devise: "MYR", periode: "an" },
        master: { montant: 8800, devise: "MYR", periode: "an" },
        doctorat: { montant: 8475, devise: "MYR", periode: "an" }
      },
      exoneration: {
        politique: "possible_plafonnee",
        detail: "Doctorat : la bourse IGSS réduit les frais de 30 à 50 %, jusqu'à trois ans, pour les étudiants d'Afrique, du Moyen-Orient et d'Asie titulaires d'un master, sans autre bourse ni emploi. Candidatures du 1er au 31 août pour la rentrée suivante. En licence, aucune réduction publiée.",
        source: "https://sgs.upm.edu.my/financial_assistance_scholarships/scholarship_financial_assistance_upm/international_graduate_student_scholarship_igss-1402",
        verifieLe: LE
      },
      admission: {
        procedure: "Candidature en ligne sur le portail SIMS de l'UPM, avec paiement des frais de dossier sur le portail. Des pièces supplémentaires sont demandées aux candidats du Nigeria. Vous pouvez candidater sans certificat d'anglais : en cas de succès, vous recevez une offre provisoire et suivez d'abord un programme intensif d'anglais. " + VISA,
        conditions: "La liste des diplômes étrangers de l'UPM, mise à jour en décembre 2025, cite le baccalauréat du Sénégal comme diplôme d'accès direct en licence, comme ceux du Mali et de France. Aucune note minimale n'y figure ; les programmes marqués d'un dièse exigent un entretien.",
        calendrier: "Rentrée d'octobre au campus de Serdang. Les dates limites ne sont pas publiées sous forme de texte sur les pages internationales.",
        langue: "Seuils d'anglais non publiés sur les pages lisibles. Sans certificat, programme intensif d'anglais avant la licence.",
        fraisDossier: "100 dollars non remboursables, payés sur le portail.",
        sources: [
          "https://akademik.upm.edu.my/international_student_admission/bachelor/how_to_apply-66344",
          "https://akademik.upm.edu.my/upload/dokumen/20260421121420The_List_of_Entry_Qualifications_for_International_Student_-_December_2025_(1).pdf",
          "https://akademik.upm.edu.my/upload/dokumen/menul320250306085254Registration_Guidelines_2025_(2).pdf",
          "https://sgs.upm.edu.my/upload/dokumen/20260618021817DUAL_INTERNTIONAL_TUITION_FEE_2026_-_16.06.2026.pdf"
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "international-islamic-university-malaysia-gombak",
    data: {
      name: "International Islamic University Malaysia (IIUM)",
      city: "Gombak",
      province: "Selangor",
      country: "Malaisie",
      image: "gombak-bukit-tabur.jpg",
      flag: "my.svg",
      ranking: "#691 mondial ex æquo (QS 2027)",
      officialWebsite: "https://www.iium.edu.my",
      applicationPortalUrl: "https://eadmission.iium.edu.my/",
      fields: ["Droit", "Commerce", "Sciences sociales", "Lettres", "Ingénierie", "Informatique", "Médecine", "Architecture"],
      description: "Université publique internationale à Gombak, aux portes de Kuala Lumpur, qui accueille beaucoup d'étudiants d'Afrique et du monde musulman. Tests d'anglais et d'arabe à l'entrée.",
      fraisScolarite: {
        source: "https://division.iium.edu.my/finance/wp-content/uploads/sites/6/2026/05/2.4.2-UG-International-After-Discount-Sem-1-2024-2025-1.7-Mar26.pdf",
        verifieLe: LE,
        note: "Grille des étudiants internationaux en vigueur depuis le premier semestre 2024-2025, version de mars 2026, montants après réduction, totaux par programme : gestion, BBA, 36 000 ringgits de scolarité sur trois ans ; soins infirmiers 33 960 sur trois ans ; économie 48 000 sur quatre ans ; droit 67 200 sur quatre ans. S'y ajoutent l'entrée, des frais récurrents, l'assurance et, si vous la prenez, la résidence : 54 265 ringgits au total pour la BBA. Taxe de 6 % en plus. Montant retenu en licence : 11 320 ringgits par an, en soins infirmiers. Master en recherche : 16 200 ringgits sur deux ans en sciences humaines. Doctorat : environ 31 250 ringgits sur trois ans en économie et gestion.",
        licence: { montant: 11320, devise: "MYR", periode: "an" },
        master: { montant: 8100, devise: "MYR", periode: "an" },
        doctorat: { montant: 10416, devise: "MYR", periode: "an" }
      },
      exoneration: {
        politique: "possible_plafonnee",
        detail: "À partir de la deuxième année de licence seulement : réduction de 50 % pour les étudiants internationaux dans le besoin avec au moins 3,0 ; exonération des frais avec 3,8 ; bourse Ummatic, qui couvre tous les frais et une allocation, avec 3,6, ou 3,0 pour les étudiants de pays où les musulmans sont minoritaires.",
        source: "https://division.iium.edu.my/finance/wp-content/uploads/sites/6/2025/10/IIUM-FINANCIAL-ASSISTANCE-Semester-1-2526-KTN.pdf",
        verifieLe: LE
      },
      admission: {
        procedure: "Candidature en ligne sur le portail eAdmission : vous créez un compte, confirmez votre courriel, remplissez votre profil, choisissez vos programmes, saisissez vos diplômes, déposez photo, passeport et justificatifs financiers, payez en ligne, puis envoyez. Pour la rentrée de 2026-2027, ce portail reçoit les candidats titulaires d'un diplôme étranger. " + VISA,
        conditions: "La liste des diplômes de l'IIUM cite le baccalauréat du Sénégal comme diplôme d'accès direct en licence, sans note minimale publiée. Médecine : équivalence ENIC-NARIC ou Scholaro et IELTS 6,0.",
        langue: "Anglais : test de placement de l'université à l'arrivée, sauf IELTS Academic ou TOEFL de moins de deux ans. Arabe : test de placement pour tous les étudiants de licence, sauf les diplômés d'un pays arabe où l'arabe est la langue d'enseignement.",
        fraisDossier: "Frais payés en ligne à la fin du formulaire ; le montant n'est pas publié sur les pages d'admission.",
        sources: [
          "https://eadmission.iium.edu.my/",
          "https://eadmission.iium.edu.my/bootstrap/img/EAS_user%20manual_ug.pdf",
          "https://division.iium.edu.my/amad/wp-content/uploads/sites/2/2025/08/new-entry-requirements-for-international-candidates.pdf",
          "https://centre.iium.edu.my/celpad/faq-downloadable-form/",
          "https://division.iium.edu.my/finance/tuition-fees/"
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "taylors-university-subang-jaya",
    data: {
      name: "Taylor's University",
      city: "Subang Jaya",
      province: "Selangor",
      country: "Malaisie",
      image: "subang-jaya-ss15.jpg",
      flag: "my.svg",
      ranking: "#272 mondial (QS 2027)",
      officialWebsite: "https://university.taylors.edu.my",
      applicationPortalUrl: "https://topas.taylors.edu.my/",
      fields: ["Commerce", "Informatique", "Ingénierie", "Architecture", "Droit", "Médecine", "Lettres", "Sciences sociales"],
      description: "Université privée dont le campus principal, au bord d'un lac, est à Subang Jaya, près de Kuala Lumpur.",
      fraisScolarite: {
        source: "https://university.taylors.edu.my/content/dam/taylorsrevamp/university/study/scholarships-and-financial-aid/fees-schedule/school-of-liberal-arts-and-sciences/undergraduate/liberal-arts/taylors-fees-schedule-ug-liberal-arts-and-sciences-usd.pdf",
        verifieLe: LE,
        note: "Grilles 2026 des étudiants internationaux, rentrée de septembre 2026, en ringgits, hors taxe de 6 % : licence en arts du spectacle, avec audition, 107 124 ringgits de scolarité sur trois ans ; éducation 107 232 ; relations internationales 110 040 ; psychologie 112 740. S'y ajoutent l'inscription, 2 800 ringgits, une charge internationale de 3 000, des frais annuels de 2 500, le visa, 2 920, et une caution de 3 000. Montant retenu en licence : 35 708 ringgits par an. Master en recherche : 37 100 ringgits sur deux ans. Doctorat en recherche : 53 760 ringgits sur trois ans.",
        licence: { montant: 35708, devise: "MYR", periode: "an" },
        master: { montant: 18550, devise: "MYR", periode: "an" },
        doctorat: { montant: 17920, devise: "MYR", periode: "an" }
      },
      exoneration: {
        politique: "possible_plafonnee",
        detail: "Doctorat en sciences, santé, pharmacie, ingénierie et informatique : bourse de recherche ouverte aux étudiants locaux et internationaux, exonération totale jusqu'à 36 mois et 3 200 ringgits par mois, avec une licence d'au moins 3,50 et un entretien. En licence, les bourses publiées visent les élèves des écoles du groupe Taylor's ou des diplômes passés en Malaisie.",
        source: "https://university.taylors.edu.my/en/study/scholarships-and-financial-aid/postgraduate-scholarships.html",
        verifieLe: LE
      },
      admission: {
        procedure: "Vous choisissez le programme et faites vérifier votre admissibilité par un conseiller, puis vous candidatez en ligne sur le portail TOPAS avec vos diplômes et relevés certifiés. Vous payez par Flywire ou Taylor's Pay ; l'université vous envoie alors la lettre d'acceptation et demande l'autorisation de visa à EMGS.",
        conditions: "Conditions publiées pour les diplômes pré-universitaires, comme les A level ou l'IB, et les fondations malaisiennes. " + SANS_BAC_LISTE,
        calendrier: "Licence : rentrées de février, avril et septembre. Master et doctorat en recherche : février, avril, juin, septembre et octobre.",
        langue: "Arts du spectacle : IELTS 5,0 ou études pré-universitaires faites en anglais ; certains programmes demandent davantage.",
        fraisDossier: "Aucuns frais de candidature séparés ne sont indiqués ; 2 800 ringgits d'inscription et 2 920 ringgits de visa dans la grille des frais.",
        sources: [
          "https://university.taylors.edu.my/en/study/how-to-apply/undergraduate-admission.html",
          "https://university.taylors.edu.my/en/study/how-to-apply/key-intakes.html",
          "https://university.taylors.edu.my/en/study/scholarships-and-financial-aid/fees-schedules.html",
          "https://university.taylors.edu.my/en/study/explore-all-programmes/liberal-arts-and-sciences/undergraduate/bachelor-of-performing-arts.html"
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "sunway-university-bandar-sunway",
    data: {
      name: "Sunway University",
      city: "Bandar Sunway",
      province: "Selangor",
      country: "Malaisie",
      image: "bandar-sunway-lac.jpg",
      flag: "my.svg",
      ranking: "#354 mondial ex æquo (QS 2027)",
      officialWebsite: "https://sunwayuniversity.edu.my",
      applicationPortalUrl: "https://sunwayuniversity.edu.my/international/apply-today",
      fields: ["Commerce", "Informatique", "Sciences", "Sciences sociales", "Lettres", "Médecine"],
      description: "Université privée à Bandar Sunway, près de Kuala Lumpur, liée à l'université britannique de Lancaster : certaines licences donnent les deux diplômes.",
      fraisScolarite: {
        source: "https://sunwayuniversity.edu.my/faculty-of-medical-and-life-sciences/courses/bachelor-of-science-honours-psychology",
        verifieLe: LE,
        note: "Frais annuels estimés pour 2026, licence en psychologie, trois ans : 9 128 dollars par an pour les étudiants internationaux, payés en ringgits au cours du jour. Doctorat en gestion : 15 547 dollars au total pour trois ans. Montant retenu en licence : 9 128 dollars. Master à plein temps : non lu.",
        licence: { montant: 9128, devise: "USD", periode: "an" },
        doctorat: { montant: 5182, devise: "USD", periode: "an" }
      },
      exoneration: {
        politique: "possible_plafonnee",
        detail: "Licence : bourses internationales de 6 000 ou 11 000 ringgits par an selon le diplôme national et la note, pour une liste de pays où le Sénégal ne figure pas. La bourse d'entrée est ouverte aux étudiants internationaux, selon les notes d'A level ou d'IB.",
        source: "https://scholarship.sunway.edu.my/scholarship/sunway-international-bursaries",
        verifieLe: LE
      },
      admission: {
        procedure: "Écrivez d'abord au bureau international pour faire vérifier votre admissibilité. Envoyez ensuite le formulaire, la déclaration de santé, une photo, le passeport entier, valable 18 mois, vos diplômes certifiés et votre test d'anglais, au moins douze semaines avant la rentrée. Les candidats d'Afrique subsaharienne joignent un certificat de non-objection. Après paiement, la lettre d'offre arrive par courriel sous trois jours ouvrés ; le visa prend six à huit semaines.",
        conditions: "A level avec au moins 12 points, IB 25 ; les autres diplômes sont examinés au cas par cas. " + SANS_BAC_LISTE,
        calendrier: "Licence : rentrées de janvier, avril et septembre. Dossier complet au moins douze semaines avant.",
        langue: "IELTS 6,0 ou équivalent, ou niveau 4 du programme intensif d'anglais de Sunway.",
        fraisDossier: "742 ringgits d'inscription, taxe comprise, et 3 300 ringgits de frais de visa versés à EMGS, non remboursables.",
        sources: [
          "https://sunwayuniversity.edu.my/international/apply-today",
          "https://sunwayuniversity.edu.my/faculty-of-medical-and-life-sciences/courses/bachelor-of-science-honours-psychology",
          "https://sunwayuniversity.edu.my/sunway-business-school/courses/doctor-of-philosophy-business",
          "https://scholarship.sunway.edu.my/scholarship/sunway-entrance-scholarship"
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "ucsi-university-kuala-lumpur",
    data: {
      name: "UCSI University",
      city: "Kuala Lumpur",
      province: "Kuala Lumpur",
      country: "Malaisie",
      image: "kuala-lumpur-sultan-abdul-samad.jpg",
      flag: "my.svg",
      ranking: "#282 mondial (QS 2027)",
      officialWebsite: "https://www.ucsiuniversity.edu.my",
      applicationPortalUrl: "https://www.ucsiuniversity.edu.my/admission-procedure/international/Kuala-lumpur",
      fields: ["Commerce", "Informatique", "Ingénierie", "Médecine", "Sciences", "Sciences sociales", "Lettres"],
      description: "Université privée dont le campus principal est à Cheras, dans le sud de Kuala Lumpur. Autres campus au Sarawak et à Bandar Springhill.",
      fraisScolarite: {
        source: "https://www.ucsiuniversity.edu.my/programmes/ba-hons-psychology",
        verifieLe: LE,
        note: "Coût total approximatif affiché pour les étudiants internationaux, frais de visa et d'administration compris, taxe de 6 % comprise : licence en psychologie à Kuala Lumpur, trois ans, 97 362 ringgits, soit environ 32 454 par an ; doctorat en psychologie, trois ans au minimum, 67 631 ringgits. Le montant varie selon le pays à cause des frais de visa. Montant retenu en licence : 32 454 ringgits.",
        licence: { montant: 32454, devise: "MYR", periode: "an" },
        doctorat: { montant: 22544, devise: "MYR", periode: "an" }
      },
      exoneration: {
        politique: "possible_plafonnee",
        detail: "L'université propose des bourses aux étudiants internationaux méritants, en nombre limité et sur entretien ; les critères sont donnés sur le site de sa fondation. Montants non publiés.",
        source: "https://www.ucsiuniversity.edu.my/scholarships-international-students",
        verifieLe: LE
      },
      admission: {
        procedure: "Vérifiez d'abord votre admissibilité avec un conseiller, puis remplissez le formulaire d'inscription en ligne en déposant relevés et diplômes traduits en anglais, passeport complet en couleur valable 18 mois, photo, déclaration de santé, rapport médical et reçu du virement des frais. Après paiement, vous recevez une offre conditionnelle et l'université demande votre visa, en huit à dix semaines.",
        conditions: "Conditions publiées pour les A level, l'IB et les autres diplômes pré-universitaires ; les autres diplômes sont évalués au cas par cas. " + SANS_BAC_LISTE,
        calendrier: "Licence en psychologie : rentrées de janvier, mai et septembre.",
        langue: "Licence en psychologie : IELTS Academic 5,0, TOEFL iBT 40, PTE 47, MUET 3,5 ou Linguaskill 154 ; sinon modules d'anglais en plus.",
        fraisDossier: "3 100 ringgits, environ 838 dollars, frais de visa compris, pour la plupart des licences ; 3 150 en ingénierie ; 3 600 en médecine, pharmacie et études supérieures.",
        sources: [
          "https://www.ucsiuniversity.edu.my/admission-procedure/international/Kuala-lumpur",
          "https://www.ucsiuniversity.edu.my/programmes/ba-hons-psychology",
          "https://www.ucsiuniversity.edu.my/programmes/doctor-philosophy-psychology",
          "https://www.ucsiuniversity.edu.my/scholarships-international-students"
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "asia-pacific-university-kuala-lumpur",
    data: {
      name: "Asia Pacific University of Technology & Innovation (APU)",
      city: "Kuala Lumpur",
      province: "Kuala Lumpur",
      country: "Malaisie",
      image: "bukit-jalil-stade.jpg",
      flag: "my.svg",
      ranking: "#528 mondial ex æquo (QS 2027)",
      officialWebsite: "https://www.apu.edu.my",
      applicationPortalUrl: "https://www.apu.edu.my/international-students-application-procedures",
      fields: ["Informatique", "Ingénierie", "Commerce", "Sciences sociales", "Lettres"],
      description: "Université privée de technologie à Bukit Jalil, au sud de Kuala Lumpur. Plus de la moitié de ses étudiants sont étrangers, venus de 130 pays.",
      fraisScolarite: {
        source: "https://www.apu.edu.my/course/bachelor-of-electrical-and-electronic-engineering",
        verifieLe: LE,
        note: "Frais des étudiants internationaux par année d'études, hors caution, frais divers et taxe de 6 % : licence de génie électrique, quatre ans, 32 600 ringgits la première année et 137 200 au total ; licence d'informatique en analyse de données, trois ans, 34 900 la première année et 108 500 au total. Montant retenu en licence : 32 600 ringgits, première année. Doctorat en technologie : 50 800 ringgits pour trois ans. Master en cybersécurité : 45 800 ringgits au total.",
        licence: { montant: 32600, devise: "MYR", periode: "an" },
        doctorat: { montant: 16933, devise: "MYR", periode: "an" }
      },
      exoneration: {
        politique: "possible_plafonnee",
        detail: "Réductions au mérite pour toutes les nationalités : jusqu'à 30 % selon les notes d'A level, d'IGCSE ou d'IB, renouvelables avec au moins 2,50 de moyenne. Premier arrivé, premier servi ; demandes pour 2026-2027 jusqu'au 30 septembre 2026. Le baccalauréat ne figure pas dans la grille.",
        source: "https://www.apu.edu.my/apu-international-students-scholarships-merit-awards",
        verifieLe: LE
      },
      admission: {
        procedure: "Formulaire en ligne avec vos diplômes certifiés et traduits en anglais et votre test d'anglais ; en licence, des résultats prévisionnels suffisent pour une offre conditionnelle. Réponse en deux à trois jours ouvrés. Pour confirmer, vous payez les frais avant l'arrivée et l'université dépose votre visa à EMGS, en deux à trois semaines. Candidatez six à huit semaines avant la rentrée.",
        conditions: "Diplôme étranger équivalent à la douzième année, aux A level ou au HSC, selon la liste d'équivalences de l'agence malaisienne des qualifications. " + SANS_BAC_LISTE,
        calendrier: "Licence en analyse de données : rentrées du 28 septembre et du 24 novembre 2026. Doctorat : 6 octobre, 3 novembre et 1er décembre 2026.",
        langue: "Licence : IELTS 5,0, TOEFL iBT 2,5 sur la nouvelle échelle, PTE 47 ou MUET 3,5.",
        fraisDossier: "3 600 ringgits, environ 950 dollars, de frais de traitement avant l'arrivée, frais de visa compris.",
        sources: [
          "https://www.apu.edu.my/international-students-application-procedures",
          "https://www.apu.edu.my/course/bsc-hons-in-computer-science-data-analytics",
          "https://www.apu.edu.my/course/phd-in-technology",
          "https://www.apu.edu.my/apu-international-students-scholarships-merit-awards"
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "segi-university-kota-damansara",
    data: {
      name: "SEGi University",
      city: "Kota Damansara",
      province: "Selangor",
      country: "Malaisie",
      image: "kota-damansara-vue.jpg",
      flag: "my.svg",
      ranking: "#701-710 mondial (QS 2027)",
      officialWebsite: "https://university.segi.edu.my",
      applicationPortalUrl: "https://click.segi.edu.my/onlineregistration/",
      fields: ["Médecine", "Commerce", "Informatique", "Ingénierie", "Droit", "Sciences sociales", "Architecture"],
      description: "Université privée de Kota Damansara, à Petaling Jaya, près de Kuala Lumpur, avec des facultés de santé, de gestion, d'ingénierie et de droit.",
      exoneration: {
        politique: "aucune",
        detail: "Le programme de bourses et de réductions de l'université est réservé aux Malaisiens et aux résidents permanents.",
        source: "https://university.segi.edu.my/scholarships-and-rebates-hub/",
        verifieLe: LE
      },
      admission: {
        procedure: "Vous envoyez formulaire, relevés et diplômes, passeport complet, photos sur fond blanc, rapport médical et test d'anglais s'il y a lieu. Un conseiller transmet le dossier au service des admissions, qui vérifie les conditions. Si vous êtes admissible, vous payez les frais d'admission et de visa ; l'université émet la lettre d'offre et dépose votre visa à EMGS.",
        conditions: "Évaluation du dossier par le service des admissions selon les conditions minimales du programme. " + SANS_BAC_LISTE,
        calendrier: "Licence : rentrées de janvier, mai et septembre.",
        langue: "Niveau d'anglais fixé par chaque programme ; non publié sur les pages lisibles.",
        fraisDossier: "3 150 ringgits de frais d'admission et de visa, sous réserve de changement, par virement.",
        coutIndicatif: "Frais de scolarité non publiés sur les pages lisibles de l'université : demandez la grille au bureau international.",
        sources: [
          "https://university.segi.edu.my/international-students/",
          "https://university.segi.edu.my/admissions-intake/",
          "https://university.segi.edu.my/scholarships-and-rebates-hub/"
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "multimedia-university-cyberjaya",
    data: {
      name: "Multimedia University (MMU)",
      city: "Cyberjaya",
      province: "Selangor",
      country: "Malaisie",
      image: "cyberjaya-vue.jpg",
      flag: "my.svg",
      ranking: "#771-780 mondial (QS 2027)",
      officialWebsite: "https://www.mmu.edu.my",
      applicationPortalUrl: "https://www.mmu.edu.my/apply-now/",
      fields: ["Informatique", "Ingénierie", "Commerce", "Droit", "Lettres"],
      description: "Université privée liée à l'opérateur Telekom Malaysia, à Cyberjaya, pôle numérique au sud de Kuala Lumpur ; second campus à Melaka.",
      fraisScolarite: {
        source: "https://www.mmu.edu.my/wp-content/uploads/2026/06/October-2026-Pricing-16-JUNE-2026-update-UG-Fee-International-Fee-2026.pdf",
        verifieLe: LE,
        note: "Nouveaux tarifs des étudiants internationaux à partir d'octobre 2026, hors taxe de 6 % : licences de finance, marketing, économie et gestion, trois ans, 74 000 ringgits, soit 24 700 par an ; comptabilité 28 700 par an ; informatique et intelligence artificielle 28 400 ; ingénierie, quatre ans, 26 000. À l'acceptation, 10 100 ringgits dont 3 600 de frais de visa, 1 500 de caution et 3 000 d'avance. Montant retenu en licence : 24 700 ringgits. Master et doctorat en recherche : 4 500 ringgits par an, plus des frais de modules et d'examen.",
        licence: { montant: 24700, devise: "MYR", periode: "an" },
        master: { montant: 4500, devise: "MYR", periode: "an" },
        doctorat: { montant: 4500, devise: "MYR", periode: "an" }
      },
      exoneration: {
        politique: "possible_plafonnee",
        detail: "Licence : réduction de 10 % pour tous les nouveaux étudiants internationaux qui paient eux-mêmes, à condition de garder 3,33 de moyenne ; après le premier trimestre, 25 % avec 3,50 et 50 % avec 3,75.",
        source: "https://www.mmu.edu.my/wp-content/uploads/2025/06/UPDATE-MAY-2025-Scholarships-_-Financial-Aids-Pre-U-_-Undergraduate-International-Students_JAN-2025-3.pdf",
        verifieLe: LE
      },
      admission: {
        procedure: "Candidature en ligne sur le portail de MMU, une adresse électronique suffit pour créer le compte ; vous suivez ensuite votre dossier sur le même tableau de bord. " + VISA,
        conditions: "Selon le guide international de l'université, un diplôme de fin d'études de douze ans, le plus élevé du pays et qui ouvre la licence dans le pays d'origine, donne accès à la licence. " + SANS_BAC_LISTE,
        calendrier: "Rentrée internationale de mars-avril 2027 ouverte : clôture le 23 février 2027, cours le 29 mars 2027. Master et doctorat en recherche : candidatures toute l'année.",
        langue: "IELTS 5,0 dans la plupart des licences, 5,5 en marketing, gestion et économie, 6,0 en finance. Sinon offre conditionnelle et programme d'anglais de MMU, avec deux ans pour atteindre le score.",
        fraisDossier: "Aucuns frais de dossier indiqués ; 3 600 ringgits de frais de visa inclus dans le paiement à l'acceptation.",
        sources: [
          "https://www.mmu.edu.my/apply-now/",
          "https://www.mmu.edu.my/fee-structure-international/",
          "https://www.mmu.edu.my/wp-content/uploads/2023/07/English-Requirement-for-International-Student-100425.pdf",
          "https://www.mmu.edu.my/wp-content/uploads/2023/02/IntStudentGuide_Jan23.pdf"
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "universiti-tenaga-nasional-kajang",
    data: {
      name: "Universiti Tenaga Nasional (UNITEN)",
      city: "Kajang",
      province: "Selangor",
      country: "Malaisie",
      image: "kajang-nuit.jpg",
      flag: "my.svg",
      ranking: "#518 mondial ex æquo (QS 2027)",
      officialWebsite: "https://www.uniten.edu.my",
      applicationPortalUrl: "https://www.uniten.edu.my/admission/",
      fields: ["Ingénierie", "Informatique", "Commerce", "Sciences"],
      description: "Université privée tournée vers l'ingénierie et l'énergie. Son campus de Putrajaya se trouve à Kajang ; un second campus est au Pahang.",
      fraisScolarite: {
        source: "https://www.uniten.edu.my/programme/undergraduate/bachelor-in-business-economics-honours/",
        verifieLe: LE,
        note: "Scolarité totale affichée pour les étudiants internationaux, hors inscription, visa, logement, avance semestrielle et taxe de 6 % : licence d'économie, trois ans, 72 600 ringgits, soit 24 200 par an ; génie mécanique, quatre ans, 104 500 ringgits. Montant retenu en licence : 24 200 ringgits. Master de génie électrique en recherche : 16 800 ringgits pour deux à trois ans. Doctorat en ingénierie : 36 600 ringgits pour trois ans.",
        licence: { montant: 24200, devise: "MYR", periode: "an" },
        master: { montant: 8400, devise: "MYR", periode: "an" },
        doctorat: { montant: 12200, devise: "MYR", periode: "an" }
      },
      exoneration: {
        politique: "possible_plafonnee",
        detail: "Réduction de 1 000 dollars, 500 par semestre sur deux semestres, pour les nouveaux étudiants internationaux de la rentrée de septembre 2026, de la licence au doctorat ; demande jusqu'au 30 septembre 2026. Les rentrées suivantes ne sont pas annoncées.",
        source: "https://www.uniten.edu.my/financial-assistance/list-of-financial-assistance/uniten-global-entry-award/",
        verifieLe: LE
      },
      admission: {
        procedure: "Vérifiez les conditions du programme, préparez vos pièces, puis remplissez le formulaire en ligne : un courriel de confirmation puis une lettre d'offre suivent. Pièces : passeport, diplômes et relevés certifiés traduits en anglais par un traducteur agréé, certificats d'anglais. Les frais d'inscription se paient deux jours avant l'inscription. " + VISA,
        conditions: "Licence d'économie : certificat de fin d'études secondaires avec au moins C, ou 60 %, en mathématiques, économie ou comptabilité ; IB 24. Génie mécanique : au moins C en mathématiques et en physique. " + SANS_BAC_LISTE,
        calendrier: "Licence : rentrées de janvier, juin et septembre. Master et doctorat en recherche : rentrées de janvier et septembre.",
        langue: "Études supérieures : IELTS 5,0, MUET 3,5 ou Linguaskill 154. Seuil de licence non publié sur les pages de programme.",
        fraisDossier: "Montant actuel non publié sur les pages d'admission.",
        sources: [
          "https://www.uniten.edu.my/admission/",
          "https://www.uniten.edu.my/apply-now/international-students/",
          "https://www.uniten.edu.my/programme/undergraduate/bachelor-in-business-economics-honours/",
          "https://www.uniten.edu.my/programme/postgraduate/doctor-of-philosophy-engineering/"
        ],
        verifieLe: LE
      }
    }
  },

  // ---------------- Negeri Sembilan, Johor, Perak, Kedah, Pahang ----------------

  {
    id: "inti-international-university-nilai",
    data: {
      name: "INTI International University",
      city: "Nilai",
      province: "Negeri Sembilan",
      country: "Malaisie",
      image: "nilai-tour-horloge.jpg",
      flag: "my.svg",
      ranking: "#406 mondial ex æquo (QS 2027)",
      officialWebsite: "https://newinti.edu.my",
      applicationPortalUrl: "https://newinti.edu.my/international-students/how-to-apply/",
      fields: ["Commerce", "Informatique", "Ingénierie", "Sciences", "Lettres", "Sciences sociales"],
      description: "Université privée de Nilai, au sud de Kuala Lumpur. Certaines licences donnent aussi le diplôme d'une université britannique partenaire.",
      fraisScolarite: {
        source: "https://newinti.edu.my/programme/bachelor-of-information-technology-hons-coventry-uk/",
        verifieLe: LE,
        note: "Coût approximatif affiché sur chaque page de programme, le même pour les étudiants locaux et internationaux, hors taxe de 6 % : licence de technologies de l'information avec double diplôme de Coventry, trois ans, 77 868 ringgits, soit environ 25 956 par an. Doctorat en gestion : environ 59 796 ringgits au total. Montant retenu en licence : 25 956 ringgits.",
        licence: { montant: 25956, devise: "MYR", periode: "an" }
      },
      exoneration: {
        politique: "possible_plafonnee",
        detail: "Bourse internationale réservée aux nouveaux étudiants étrangers : jusqu'à 45 % des frais, tous programmes sauf l'anglais, attribuée dans l'ordre d'arrivée et en nombre limité.",
        source: "https://newinti.edu.my/international-students/international-scholarship/",
        verifieLe: LE
      },
      admission: {
        procedure: "Remettez le formulaire de candidature internationale, vos pièces et les frais à un représentant d'INTI au moins deux à trois mois avant la rentrée ; il n'y a pas de portail en ligne. Pièces : formulaire, deux photocopies du passeport entier valable 18 mois, diplômes. L'université demande votre visa à EMGS, en six à huit semaines ; à l'autorisation, vous payez d'avance le premier semestre.",
        conditions: "La liste par pays cite le baccalauréat du Cameroun et de Djibouti et le WAEC du Ghana, du Nigeria et d'autres pays d'Afrique de l'Ouest, sans note minimale. " + SANS_BAC_LISTE,
        calendrier: "Licence : rentrées de janvier, mai et août.",
        langue: "Seuil d'anglais en licence non publié sur les pages de programme ; doctorat : IELTS 6,0, TOEFL 550 ou MUET 4.",
        fraisDossier: "2 847 ringgits, environ 680 dollars, comprenant les frais de traitement, l'assurance médicale, l'examen médical et les frais d'immigration.",
        sources: [
          "https://newinti.edu.my/international-students/how-to-apply/",
          "https://newinti.edu.my/international-students/entry-requirements/",
          "https://newinti.edu.my/programme/bachelor-of-information-technology-hons-coventry-uk/",
          "https://newinti.edu.my/programme/doctor-of-philosophy-phd-management/"
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "universiti-teknologi-malaysia-johor-bahru",
    data: {
      name: "Universiti Teknologi Malaysia (UTM)",
      city: "Johor Bahru",
      province: "Johor",
      country: "Malaisie",
      image: "johor-bahru-front-de-mer.jpg",
      flag: "my.svg",
      ranking: "#158 mondial ex æquo (QS 2027)",
      officialWebsite: "https://www.utm.my",
      applicationPortalUrl: "http://smart.utm.my/admission/",
      fields: ["Ingénierie", "Informatique", "Sciences", "Architecture", "Commerce", "Sciences sociales"],
      description: "Université publique de technologie. Campus principal à Johor Bahru, dans le sud du pays, à environ 300 km de Kuala Lumpur, où se trouve un second campus.",
      fraisScolarite: {
        source: "https://admission.utm.my/programme-fees-ug-international/",
        verifieLe: LE,
        note: "Grille des licences internationales affichée en septembre 2026, sans année, totaux par programme hors inscription et caution : gestion et marketing, six semestres, 45 788 ringgits, soit environ 15 260 par an ; éducation 55 000 et ingénierie 75 000 sur huit semestres. S'y ajoutent 6 152 ringgits d'inscription et 1 075 de frais de service par semestre, et une caution fixée selon le pays. Montant retenu en licence : 15 260 ringgits. Master en recherche : 25 400 ringgits sur trois semestres ; doctorat en recherche : 48 600 ringgits sur six semestres, en sciences humaines et sociales.",
        licence: { montant: 15260, devise: "MYR", periode: "an" },
        master: { montant: 16933, devise: "MYR", periode: "an" },
        doctorat: { montant: 16200, devise: "MYR", periode: "an" }
      },
      exoneration: {
        politique: "possible_plafonnee",
        detail: "Doctorat : la bourse ASCEND Bright Talent, ouverte aux candidats locaux et internationaux, paie la scolarité jusqu'à six semestres et 3 000 ringgits par mois ; la bourse doctorale internationale réduit les frais de 2 000 ringgits. En licence, aucune réduction publiée.",
        source: "https://admission.utm.my/scholarship-and-financial-aid/",
        verifieLe: LE
      },
      admission: {
        procedure: "Candidature en ligne sur le système SMARt de l'UTM, après paiement des frais de dossier. Chaque dossier est examiné sous cinq jours ouvrés. Certains programmes, comme l'architecture, ajoutent un entretien. " + VISA,
        conditions: "Baccalauréat du Sénégal accepté, avec au moins 14 sur 20 dans les matières exigées : mathématiques et physique, plus chimie ou biologie, en ingénierie ; mathématiques et deux matières scientifiques en informatique ; trois matières en sciences, en sciences sociales et en cadre bâti.",
        calendrier: "Licence, rentrée de septembre 2026 : première phase du 1er avril au 15 mai 2026, seconde du 23 juin au 17 juillet 2026. Deux rentrées par an, février et septembre. Doctorat et master en recherche : du 1er avril au 31 octobre 2026.",
        langue: "MUET 4,0, IELTS 5,5, TOEFL iBT 46 ou PTE 51, résultats de moins de deux ans. Sinon programme intensif d'anglais de l'UTM. Le Sénégal ne fait pas partie des pays dispensés.",
        fraisDossier: "450 ringgits, payés par carte, virement ou Flywire avant l'envoi du dossier.",
        sources: [
          "https://admission.utm.my/undergraduate-international/",
          "https://admission.utm.my/entry-requirements-ug-international/",
          "https://admission.utm.my/apply-now/",
          "https://admission.utm.my/faqs/",
          "https://admission.utm.my/english-language-requirements-3/"
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "universiti-teknologi-petronas-seri-iskandar",
    data: {
      name: "Universiti Teknologi PETRONAS (UTP)",
      city: "Seri Iskandar",
      province: "Perak",
      country: "Malaisie",
      image: "batu-gajah-kellie.jpg",
      flag: "my.svg",
      ranking: "#261 mondial ex æquo (QS 2027)",
      officialWebsite: "https://www.utp.edu.my",
      applicationPortalUrl: "https://ucampus.utp.edu.my/sitsvision/wrd/siw_ipp_lgn.login?process=siw_ipp_app_crs",
      fields: ["Ingénierie", "Informatique", "Sciences", "Commerce"],
      description: "Université privée du groupe PETRONAS, à Seri Iskandar, dans l'État de Perak. Surtout ingénierie, géosciences, sciences et informatique.",
      fraisScolarite: {
        source: "https://www.utp.edu.my/Pages/Admission/Undergraduate/International/Tuition-fees.aspx",
        verifieLe: LE,
        note: "Tableau des frais de décembre 2025, en vigueur depuis mai 2026, scolarité totale : gestion, trois ans et quatre mois, 110 000 ringgits, soit 33 000 par an ; sciences et informatique 123 700 ; ingénieries 156 500 à 165 000 sur quatre ans. S'y ajoutent 11 000 ringgits d'inscription une fois et environ 3 500 par an de visa ; taxe de 6 %. Montant retenu en licence : 33 000 ringgits. Master et doctorat en recherche : grille de janvier 2020, trop ancienne, non reprise.",
        licence: { montant: 33000, devise: "MYR", periode: "an" }
      },
      exoneration: {
        politique: "possible_plafonnee",
        detail: "Doctorat en recherche à plein temps : l'assistanat de l'université couvre la scolarité et le cours de méthodologie, avec au moins 3,25 en licence et en master. Les bourses de licence de la fondation de l'université sont réservées aux Malaisiens.",
        source: "https://www.utp.edu.my/Pages/Admission/Postgraduate/International-Applicants/Tuition-fees.aspx",
        verifieLe: LE
      },
      admission: {
        procedure: "Préparez en PDF passeport, photo, diplômes certifiés et traduits en anglais, test d'anglais et preuve de paiement des frais de dossier, puis remplissez le formulaire en ligne. Un dossier incomplet ou non certifié n'est pas traité. " + VISA,
        conditions: "A level ou équivalent avec au moins C ou 60 % dans les matières du programme, mathématiques, physique et chimie en ingénierie ; IB 24. Les autres diplômes reconnus par la Malaisie peuvent être étudiés. " + SANS_BAC_LISTE,
        calendrier: "Candidatures toute l'année. Rentrée de janvier 2027 : dépôt dès le 25 août, limite le 31 octobre 2026 ; mai 2027 : 23 décembre 2026 au 28 février 2027 ; septembre 2027 : 23 avril au 30 juin 2027.",
        langue: "IELTS 5,0 ou TOEFL iBT 40 en ingénierie, sciences et informatique ; 5,5 ou 46 en gestion ; ou lettre officielle attestant un enseignement en anglais.",
        fraisDossier: "50 dollars non remboursables, par virement.",
        sources: [
          "https://www.utp.edu.my/Pages/Admission/Undergraduate/International/How-To-Apply.aspx",
          "https://www.utp.edu.my/Pages/Admission/Undergraduate/International/Entry-Requirement.aspx",
          "https://www.utp.edu.my/Pages/Admission/Undergraduate/International/Tuition-fees.aspx",
          "https://www.utp.edu.my/Pages/Admission/Postgraduate/International-Applicants/Tuition-fees.aspx"
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "universiti-utara-malaysia-sintok",
    data: {
      name: "Universiti Utara Malaysia (UUM)",
      city: "Sintok",
      province: "Kedah",
      country: "Malaisie",
      image: "sintok-mosquee.jpg",
      flag: "my.svg",
      ranking: "#540 mondial ex æquo (QS 2027)",
      officialWebsite: "https://www.uum.edu.my",
      applicationPortalUrl: "https://apply.uum.edu.my/onlineapp_ug/app_login.aspx",
      fields: ["Commerce", "Sciences sociales", "Droit", "Informatique", "Lettres"],
      description: "Université publique de Sintok, dans l'État de Kedah, au nord du pays, avec une antenne à Kuala Lumpur. Gestion, économie, droit et informatique.",
      fraisScolarite: {
        source: "https://www.uum.edu.my/admissions/fees/postgraduate",
        verifieLe: LE,
        note: "Études supérieures, non-Malaisiens, page à jour en 2025 : master en recherche 4 650 ringgits par semestre, doctorat 5 700, soit 9 300 et 11 400 par an ; s'y ajoutent 750 ringgits d'inscription, 200 d'examen médical, 2 000 de frais de gestion et l'examen de la thèse. Taxe de 6 % depuis le 1er septembre 2025. Licence : seule une grille de 2022-2023 est publiée, voir la démarche.",
        master: { montant: 9300, devise: "MYR", periode: "an" },
        doctorat: { montant: 11400, devise: "MYR", periode: "an" }
      },
      exoneration: {
        politique: "inconnue",
        detail: EXO_INCONNUE + " Pour les études supérieures, la page d'aide renvoie à la bourse internationale du ministère malaisien de l'Enseignement supérieur.",
        source: "https://www.uum.edu.my/admissions/fees/financial-aid",
        verifieLe: LE
      },
      admission: {
        procedure: "Candidature en ligne sur le portail de l'UUM, avec la preuve de paiement des frais de dossier. Si votre pays impose un examen d'entrée à l'université, joignez-en le résultat. " + VISA,
        conditions: "Diplôme de fin d'études secondaires après 11 à 12 ans d'études, valable cinq ans après l'examen ; crédit en mathématiques et en anglais. Il faut avoir entre 18 et 25 ans à la date limite. Remplir les minimums ne garantit pas l'admission. " + SANS_BAC_LISTE,
        langue: "Dispense pour les diplômés d'un pays d'enseignement en anglais, dont le Cameroun, le Ghana et le Nigeria, pas le Sénégal. Sinon cours intensif d'anglais, en septembre, février ou juin, puis MUET au niveau exigé.",
        fraisDossier: "175 ringgits ou 50 dollars pour les candidats hors Asie du Sud-Est.",
        coutIndicatif: "Seule grille de licence publiée, session 2022-2023 : 4 200 ringgits par semestre dans la plupart des licences, 4 700 en communication et informatique, 5 000 en droit et comptabilité, sur sept ou huit semestres, plus 2 000 d'inscription. Elle a plus de deux ans : les montants actuels peuvent être différents.",
        sources: [
          "https://www.uum.edu.my/admissions/application-guidelines/undergraduate-international",
          "https://www.uum.edu.my/processing-fees",
          "https://www.uum.edu.my/admissions/fees/postgraduate",
          "https://www.uum.edu.my/admissions/application-guidelines/postgraduate"
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "universiti-malaysia-pahang-pekan",
    data: {
      name: "Universiti Malaysia Pahang Al-Sultan Abdullah (UMPSA)",
      city: "Pekan",
      province: "Pahang",
      country: "Malaisie",
      image: "pekan-musee-mosquee.jpg",
      flag: "my.svg",
      ranking: "#588 mondial ex æquo (QS 2027)",
      officialWebsite: "https://www.umpsa.edu.my",
      applicationPortalUrl: "https://admission.umpsa.edu.my/undergraduate/international-student-2",
      fields: ["Ingénierie", "Informatique", "Sciences", "Commerce"],
      description: "Université publique technique de la côte est, avec deux campus au Pahang, à Pekan et à Gambang. Ingénierie, technologie, informatique et sciences appliquées.",
      fraisScolarite: {
        source: "https://bendahari.umpsa.edu.my/index.php/filelink/fileman-files/Students%20Finance%20Division/OPEN%20CHANNEL/10.%20PORTAL%20INTERNATIONAL%20UG_V2.pdf",
        verifieLe: LE,
        note: "Grille des licences internationales pour les rentrées depuis 2025-2026, totaux par programme sur la durée habituelle, avant réduction : informatique, sciences appliquées et gestion 77 795 ringgits ; ingénierie 83 795. Pour quatre ans, soit environ 19 450 ringgits par an. Tous les inscrits de Pekan et de Gambang reçoivent une réduction, dont le montant n'est donné que dans la lettre d'offre. S'y ajoutent 1 155 ringgits d'entrée, 330 par semestre et une caution de 1 500, hors logement et visa. Montant retenu en licence : 19 450 ringgits, avant réduction.",
        licence: { montant: 19450, devise: "MYR", periode: "an" }
      },
      exoneration: {
        politique: "systematique",
        detail: "Tous les étudiants inscrits aux campus de Pekan et de Gambang ont droit à une réduction des frais de scolarité, selon les conditions de l'université ; son montant figure dans la lettre d'offre. Elle ne vaut pas au site de Kuala Lumpur.",
        source: "https://bendahari.umpsa.edu.my/index.php/filelink/fileman-files/Students%20Finance%20Division/OPEN%20CHANNEL/10.%20PORTAL%20INTERNATIONAL%20UG_V2.pdf",
        verifieLe: LE
      },
      admission: {
        procedure: "Choisissez un programme dans la liste ouverte aux étudiants internationaux, puis candidatez par le lien de la page d'admission internationale. " + VISA,
        conditions: "Certificat de fin d'études secondaires, A level ou équivalent, avec au moins C dans trois matières, ou un diplôme reconnu par la Malaisie. " + SANS_BAC_LISTE,
        calendrier: "Licence : rentrée de septembre, candidatures jusqu'en juillet ; rentrée de février, jusqu'en décembre.",
        langue: "TOEFL papier 500 ou iBT 30-31, IELTS 4,0, MUET 3, PTE 36, ou Cambridge C1 ou C2 140. Sinon programme intensif d'anglais puis MUET 3. Dispense si l'anglais est la langue officielle de votre pays ou de vos études.",
        fraisDossier: "Le document des frais de dossier en lien date de 2020 : montant à jour non publié.",
        sources: [
          "https://admission.umpsa.edu.my/undergraduate/international-student-2",
          "https://admission.umpsa.edu.my/international-programme-offered",
          "https://admission.umpsa.edu.my/undergraduate-study/applied-science-international/bsp-material-technology-international",
          "https://bendahari.umpsa.edu.my/index.php/en/component/sppagebuilder/?view=page&id=249"
        ],
        verifieLe: LE
      }
    }
  }
];


// ---------------- Les deux fiches existantes ----------------
// `attendu` porte l'état lu dans l'export du 2026-09-25T01:20:04.021Z : les
// champs ajoutés sont ABSENTS (undefined), les champs remplacés sont
// recopiés entiers. Si quelqu'un est passé avant, le lot bloque au lieu
// d'écraser.

export const PATCHES = [
  {
    "collection": "universities",
    "id": "universiti-malaya-kuala-lumpur",
    "motif": "fiche complète : démarche 2026-2027 des candidats internationaux (dates, frais de dossier, anglais), province, langue d'enseignement, et note de frais réécrite sans capitales, montants relus sur les grilles d'octobre 2025 et inchangés, le 2026-09-25",
    "attendu": {
      "province": undefined,
      "langueEnseignement": undefined,
      "fraisScolarite": {
        "source": "https://study.um.edu.my/doc/tution-fee/Fee%20Structure,%20PG,%20International%20-%20Updated%2022%20Oct%202025.pdf",
        "verifieLe": "2026-09-13",
        "note": "ATTENTION : les grilles officielles de l'Universiti Malaya affichent le cout TOTAL DU PROGRAMME en ringgits, PAS un cout annuel. L'universite precise que le montant est calcule sur la duree minimale ou habituelle des etudes : 8 semestres (4 ans) en licence, 4 semestres (2 ans) en master, 6 semestres (3 ans) en doctorat. Les montants ci-dessous sont donc le total OFFICIEL DIVISE par cette duree. Totaux lus, documents mis a jour le 22 octobre 2025 : licence en genie civil 132 100 MYR sur 4 ans (identique en genie biomedical, electrique, mecanique et chimique) ; master en informatique 43 200 MYR sur 2 ans ; doctorat de la faculte d'informatique 86 600 MYR sur 3 ans. L'ECART ENTRE PROGRAMMES EST ENORME : licence en langues et linguistique 65 000 a 70 100 MYR, sciences du sport 75 100 a 84 700, architecture 103 900, sciences biomedicales et soins infirmiers 149 200, pharmacie 280 100, medecine et chirurgie 673 200 ; master MBA 79 100, management 50 100, economie 45 100, physique appliquee 28 300, statistiques 27 000, data science 41 700, cybersecurite et intelligence artificielle 48 100 ; doctorat faculte des sciences 80 900, administration des affaires 88 100, commerce et economie 92 200. Les frais sont factures a chaque inscription semestrielle et tout semestre supplementaire se paie en plus. Logement non compris. Non lues : les pages suivantes de chaque brochure et les frais annexes.",
        "licence": {
          "montant": 33025,
          "devise": "MYR",
          "periode": "an"
        },
        "master": {
          "montant": 21600,
          "devise": "MYR",
          "periode": "an"
        },
        "doctorat": {
          "montant": 28867,
          "devise": "MYR",
          "periode": "an"
        }
      },
      "admission": undefined
    },
    "champs": {
      "province": "Kuala Lumpur",
      "langueEnseignement": "Anglais, sauf certains programmes en malais, arabe ou langues étrangères",
      "fraisScolarite": {
        "source": "https://study.um.edu.my/doc/tution-fee/Fee%20Structure,%20PG,%20International%20-%20Updated%2022%20Oct%202025.pdf",
        "verifieLe": "2026-09-25",
        "note": "Grilles des étudiants internationaux mises à jour le 22 octobre 2025, pour les rentrées depuis 2025-2026 : l'université donne le coût total du programme sur la durée habituelle, huit semestres en licence, quatre en master, six en doctorat. Licence : 60 900 ringgits dans les études islamiques, 65 000 à 70 100 en langues, 132 100 en ingénierie, 673 200 en médecine. Master : 27 000 en statistiques, 43 200 en informatique, 79 100 pour le MBA. Doctorat : 86 600 en informatique. Montants retenus, divisés par la durée : 33 025 ringgits par an en licence d'ingénierie, 21 600 en master et 28 867 en doctorat d'informatique. Les frais se paient à chaque inscription semestrielle ; logement non compris.",
        "licence": {
          "montant": 33025,
          "devise": "MYR",
          "periode": "an"
        },
        "master": {
          "montant": 21600,
          "devise": "MYR",
          "periode": "an"
        },
        "doctorat": {
          "montant": 28867,
          "devise": "MYR",
          "periode": "an"
        }
      },
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
    }
  },
  {
    "collection": "universities",
    "id": "universiti-kebangsaan-malaysia-kuala-lumpur",
    "motif": "fiche complète : campus principal à Bangi (et non Kuala Lumpur), province, photo de Bangi, démarche internationale (portail, frais de dossier, conditions, anglais), et note de frais réécrite sans capitales ni tiret long, montants inchangés, le 2026-09-25",
    "attendu": {
      "city": "Kuala Lumpur",
      "province": undefined,
      "image": "kualalumpur.jpg",
      "langueEnseignement": undefined,
      "fraisScolarite": {
        "source": "https://shape.ukm.my/storage/lampiran/struktur_yuran/FST/pasca/strukturyuran_FST_UKMi_pasca_F_int.pdf",
        "verifieLe": "2026-09-13",
        "note": "Grilles internationales publiees FACULTE PAR FACULTE, en ringgits et PAR SEMESTRE ; les montants ci-dessous sont ANNUALISES sur les deux semestres de l'annee universitaire. LICENCE, faculte des sciences de la sante, plein temps, 8 semestres sur 4 ans : inscription unique 2 520 MYR, scolarite du 1er semestre 12 650 MYR, puis 8 800 MYR par semestre pour les 7 suivants, plus 780 MYR d'activites par semestre — soit 17 600 MYR par an en regime de croisiere et environ 74 250 MYR pour tout le cursus, hors logement. MASTER ET DOCTORAT, faculte des sciences et technologies, international plein temps : doctorat en recherche 10 350 MYR par semestre, minimum 6 semestres, total 63 810 MYR inscription comprise ; master en recherche 7 600 MYR par semestre, minimum 4 semestres, total 31 810 MYR. L'universite precise que l'etudiant doit le total correspondant au nombre MINIMUM de semestres meme s'il finit plus tot, et que tout semestre supplementaire se facture 3 000 MYR. CAUTION EXIGEE, variable selon le pays : 1 500 MYR pour l'Afrique en general, 2 000 MYR pour l'Angola, le Burkina Faso, le Burundi, le Cameroun, la Centrafrique, les deux Congo, la Cote d'Ivoire, Djibouti, la Guinee equatoriale, l'Erythree, l'Ethiopie, la Guinee-Bissau, le Ghana, le Liberia, le Mali, le Mozambique, le Niger, le Nigeria, le Rwanda et le Sahara occidental. Logement en cite 480 a 1 200 MYR par semestre, non compris. Non lues : les grilles des autres facultes, ou les montants varient fortement — en dentisterie le doctorat est a 11 730 MYR et le master applique a 45 000 MYR par semestre.",
        "licence": {
          "montant": 17600,
          "devise": "MYR",
          "periode": "an"
        },
        "master": {
          "montant": 15200,
          "devise": "MYR",
          "periode": "an"
        },
        "doctorat": {
          "montant": 20700,
          "devise": "MYR",
          "periode": "an"
        }
      },
      "admission": undefined
    },
    "champs": {
      "city": "Bangi",
      "province": "Selangor",
      "image": "bangi-nuit.jpg",
      "langueEnseignement": "Anglais ou malais selon le programme",
      "fraisScolarite": {
        "source": "https://shape.ukm.my/storage/lampiran/struktur_yuran/FST/pasca/strukturyuran_FST_UKMi_pasca_F_int.pdf",
        "verifieLe": "2026-09-13",
        "note": "Grilles internationales publiées faculté par faculté, en ringgits et par semestre ; montants ramenés à l'année. Licence en sciences de la santé, huit semestres : 2 520 ringgits d'inscription, 12 650 le premier semestre puis 8 800 par semestre, plus 780 d'activités, soit 17 600 par an et environ 74 250 pour le cursus. Master et doctorat en recherche, faculté des sciences et technologies, grille de la session 2024-2025 : 7 600 ringgits par semestre en master, au moins quatre semestres, et 10 350 en doctorat, au moins six semestres. Le nombre minimum de semestres est dû même si vous finissez plus tôt. Caution de 1 500 à 2 000 ringgits selon le pays ; logement de 480 à 1 200 ringgits par semestre, non compris. Les autres facultés ont leurs propres grilles.",
        "licence": {
          "montant": 17600,
          "devise": "MYR",
          "periode": "an"
        },
        "master": {
          "montant": 15200,
          "devise": "MYR",
          "periode": "an"
        },
        "doctorat": {
          "montant": 20700,
          "devise": "MYR",
          "periode": "an"
        }
      },
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
    }
  }
];

// Aucune bourse ni aucun lien de programme dans ce lot.
export const SCHOLARSHIPS = [];
export const LINKS = [];

// Le lot refuse de se charger si une photo déclarée n'existe pas
// (incident du lot 35), y compris la nouvelle photo d'UKM.
const manquants = [...UNIVERSITIES.map((u) => u.data.image), ...PATCHES.map((p) => p.champs.image)]
  .filter((f) => f && !existsSync(`assets/images/cities/${f.replace(/\.jpg$/, "")}-1600w.avif`))
  .map((f) => `cities/${f}`);

if (manquants.length) {
  throw new Error(`Lot 90 : ${manquants.length} photo(s) absente(s) : lancer d'abord \`node scripts\\add-lot90-photos.mjs\` :\n  ${manquants.join("\n  ")}`);
}
