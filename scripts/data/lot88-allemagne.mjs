// ============================================================
// FitzUniverse — Lot 88 : ALLEMAGNE, de 3 à 22 établissements
// Recherche du 2026-09-24, sources officielles uniquement : sites des
// universités, de leurs Studierendenwerk et de leurs représentations
// étudiantes (AStA, StuRa), ministère des Sciences du Bade-Wurtemberg,
// uni-assist (organisme d'examen des diplômes étrangers mandaté par les
// universités), topuniversities.com pour le seul classement mondial.
//
// POURQUOI
// Charles, le 2026-09-24 : « On passe au lot Allemagne : de 3 à environ
// 20 établissements, fiches complètes, même exigence que la Roumanie ».
// L'Allemagne est vendue en préinscription avec trois établissements
// (Humboldt, Hanovre, Hambourg), sans aucune fiche d'admission.
//
// MÉTHODE
// Cinq recherches parallèles (WebFetch) ont produit un brouillon ; TOUT
// ce qui entre ici a ensuite été RELU AU NAVIGATEUR INTÉGRÉ, depuis le
// réseau de Charles, le 2026-09-24 : pages HTML et PDF officiels (texte
// extrait dans la page par pdf.js). TU Berlin, Leipzig et Cologne
// refusaient l'outil de recherche : elles ont été lues entièrement au
// navigateur. Corrections apportées par la relecture :
//   - Studienkolleg Sachsen (Leipzig, aussi utilisé par TU Dresden) :
//     le brouillon le disait gratuit, avec l'allemand B1. La FAQ dit
//     850 € par semestre à partir de l'hiver 2026-2027, et B2 pour les
//     cours préparatoires (B1 ne vaut que pour le cours intensif
//     d'allemand).
//   - Cologne : fiche que le brouillon jugeait fragile. Relue, elle est
//     solide : TestAS obligatoire pour les hors UE, et une voie propre,
//     « Studienstart International plus », examen d'entrée gratuit de
//     l'université pour les bacheliers sans accès direct (rentrée d'été
//     seulement).
//   - Humboldt : les candidats à diplôme étranger passent ENTIÈREMENT
//     par uni-assist (pas de VPD puis portail), du 1er juin au
//     15 juillet 2026, filières libres comprises.
//   - Leipzig : 332,30 € de contribution, lue sur la page de
//     l'université (le brouillon n'avait pas de montant).
//   - TU Berlin : 379,06 €, calendrier et VPD lus sur les pages que
//     l'outil ne pouvait pas ouvrir.
//   - Sarrebruck : la phrase « seule université allemande qui délivre
//     des diplômes français » n'a pas été retrouvée sur la page
//     actuelle : écartée. Göttingen : effectif contradictoire, écarté.
// Classement : QS 2027 lu sur topuniversities pour les 19, au
// navigateur, le même jour.
//
// NON TROUVÉ, donc NON ÉCRIT : la règle d'accès propre au baccalauréat
// sénégalais (accès direct ou Studienkolleg). La base du DAAD a changé
// d'adresse (404) et l'outil d'uni-assist exige d'envoyer un
// formulaire. Chaque fiche renvoie donc à la vérification sur anabin
// ou uni-assist, sans rien affirmer pour le Sénégal.
//
// PRIX RETENU : ce que l'étudiant paie à l'université sur un an, soit
// deux contributions semestrielles de l'hiver 2026-2027, plus les
// frais de scolarité des hors UE là où ils existent (TUM, et 1 500 €
// par semestre dans les quatre universités du Bade-Wurtemberg). Même
// convention que les trois fiches existantes (Hambourg : 402 € × 2).
//
// LES TROIS FICHES EXISTANTES reçoivent en PATCHES leur bloc
// `admission`, leur langue et leur Land. Humboldt reçoit aussi une note
// de frais réécrite (l'ancienne portait un mot en capitales et n'avait
// pas d'accents) : le montant ne change pas, relu le 2026-09-24.
//
// PHOTOS : scripts/add-lot88-photos.mjs, AVANT `lot.mjs analyser`.
// Le lot refuse de se charger si une photo manque.
// ============================================================

import { existsSync } from "node:fs";

const LE = "2026-09-24";

const UNI_ASSIST_FRAIS_URL = "https://www.uni-assist.de/en/how-to-apply/pay-all-fees/handling-fees/";
const UNI_ASSIST_FRAIS = "Frais d'uni-assist : 75 € pour la première formation demandée dans un semestre, 30 € pour chaque formation supplémentaire, dus quel que soit le résultat.";
const BW_FAQ = "https://mwk.baden-wuerttemberg.de/de/hochschulen-studium/studieren-in-bw/studienfinanzierung/gebuehren-fuer-internationale-studierende-und-zweitstudium/faqs";

// Phrases communes, écrites une fois.
const HZB = "Vérifiez d'abord sur anabin ou sur l'outil d'uni-assist si votre baccalauréat ouvre un accès direct à l'université ou seulement l'accès à un Studienkolleg, l'année préparatoire conclue par un examen, la Feststellungsprüfung.";
const SANS_FRAIS = "Il n'y a pas de frais de scolarité, donc rien à exonérer. La contribution semestrielle reste due par tous les étudiants.";
const HIVER = "La rentrée universitaire a lieu en octobre ; la plupart des licences n'ouvrent qu'au semestre d'hiver.";

export const UNIVERSITIES = [

  // ---------------- Bavière ----------------

  {
    id: "technische-universitat-munchen-munich",
    data: {
      name: "Université technique de Munich (TUM)",
      city: "Munich",
      province: "Bavière",
      country: "Allemagne",
      image: "munich-frauenkirche.jpg",
      flag: "de.svg",
      ranking: "#25 mondial (QS 2027)",
      officialWebsite: "https://www.tum.de",
      applicationPortalUrl: "https://campus.tum.de/tumonline/",
      fields: ["Ingénierie", "Informatique", "Sciences", "Médecine", "Commerce", "Architecture", "Agriculture"],
      description: "Université technique fondée en 1868 par le roi Louis II de Bavière. Ingénierie, informatique, sciences naturelles, médecine, sciences de la vie et management.",
      langueEnseignement: "Allemand en licence, sauf quelques licences en anglais ; nombreux masters en anglais",
      fraisScolarite: {
        source: "https://www.tum.de/en/studies/fees/tuition",
        verifieLe: LE,
        note: "Depuis le semestre d'hiver 2024-2025, les nouveaux étudiants hors Union européenne paient des frais de scolarité : en licence, généralement 2 000 ou 3 000 € par semestre ; en master, généralement 4 000 ou 6 000 € par semestre. Le montant exact figure sur la page de chaque programme ; en génie mécanique, par exemple, 3 000 € par semestre. S'y ajoute la contribution au Studierendenwerk, 97 € par semestre. Le doctorat et le Studienkolleg ne sont pas soumis à ces frais. Montant retenu en licence : 6 194 € par an, le cas du génie mécanique (2 × 3 000 € + 2 × 97 €) ; en doctorat, la seule contribution, 194 € par an. Le master, entre 8 194 € et 12 194 € par an selon le programme, n'a pas de montant unique.",
        licence: { montant: 6194, devise: "EUR", periode: "an" },
        doctorat: { montant: 194, devise: "EUR", periode: "an" }
      },
      exoneration: {
        politique: "possible_plafonnee",
        detail: "Bourses d'exonération sur demande, jamais automatiques, pour d'excellents résultats ou des besoins financiers ; chaque demande est examinée à part et doit être déposée dans les délais. Une autre bourse de la TUM, qui tient compte des résultats et de la situation financière, verse de 500 à 1 800 € par semestre.",
        source: "https://www.tum.de/en/studies/fees/tuition",
        verifieLe: LE
      },
      admission: {
        procedure: "Deux étapes. Vous demandez d'abord à uni-assist une VPD, l'examen de vos diplômes étrangers, obligatoire pour tout diplôme obtenu hors d'Allemagne. Vous candidatez ensuite en ligne sur TUMonline, le portail de la TUM, en y déposant la VPD et vos pièces.",
        conditions: `${HZB} Pour les bacheliers orientés vers le Studienkolleg, le Studienkolleg de Munich prépare aux universités bavaroises, dont la TUM ; candidature par TUMonline, allemand B2 exigé, deux semestres avant la Feststellungsprüfung.`,
        calendrier: `Licences : candidature du 15 mai au 15 juillet pour le semestre d'hiver. Masters : dates propres à chaque programme. ${HIVER}`,
        langue: "Licences en allemand : certificat d'allemand exigé, allemand et anglais pour certaines licences enseignées en anglais. La page de chaque programme indique la langue et le niveau demandés.",
        fraisDossier: `La TUM ne demande pas de frais de dossier ; la VPD est payante. ${UNI_ASSIST_FRAIS}`,
        sources: [
          "https://www.tum.de/en/studies/application/application-info-portal/higher-education-entrance-qualification/international-higher-education-entrance-qualification",
          "https://www.tum.de/en/studies/degree-programs/detail/mechanical-engineering-bachelor-of-science-bsc",
          "https://www.tum.de/en/studies/application/preparatory-study-at-the-studienkolleg/",
          "https://www.tum.de/en/studies/fees-and-financial-aid/campus-munich-garching-wzw-and-tum-asia",
          UNI_ASSIST_FRAIS_URL
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "ludwig-maximilians-universitat-munchen-munich",
    data: {
      name: "Université Louis-et-Maximilien de Munich (LMU)",
      city: "Munich",
      province: "Bavière",
      country: "Allemagne",
      image: "munich-marienplatz.jpg",
      flag: "de.svg",
      ranking: "#61 mondial (QS 2027)",
      officialWebsite: "https://www.lmu.de",
      applicationPortalUrl: "https://www.lmu.de/en/study/degree-students/applications-for-admission/",
      fields: ["Droit", "Médecine", "Lettres", "Sciences", "Sciences sociales", "Commerce", "Informatique"],
      description: "Première université de Bavière, fondée à Ingolstadt en 1472 et installée à Munich. 52 658 étudiants au semestre d'hiver 2025-2026, dont 11 658 internationaux.",
      langueEnseignement: "Allemand ; masters en anglais ; doubles diplômes avec des universités françaises",
      fraisScolarite: {
        source: "https://www.lmu.de/en/workspace-for-students/abc-study-guide/fees-and-tuition-fees/",
        verifieLe: LE,
        note: "Pas de frais de scolarité à la LMU depuis le semestre d'hiver 2013-2014, quelle que soit la nationalité. Seule la contribution au Studierendenwerk de Munich est due : 97 € par semestre depuis l'été 2026, soit 194 € par an. Le supplément pour le ticket de transport est suspendu. Certains diplômes de formation continue sont payants.",
        licence: { montant: 194, devise: "EUR", periode: "an" },
        master: { montant: 194, devise: "EUR", periode: "an" },
        doctorat: { montant: 194, devise: "EUR", periode: "an" }
      },
      exoneration: {
        politique: "systematique",
        detail: SANS_FRAIS,
        source: "https://www.lmu.de/en/workspace-for-students/abc-study-guide/fees-and-tuition-fees/",
        verifieLe: LE
      },
      admission: {
        procedure: "Candidature directe auprès du bureau international de la LMU, sans uni-assist : formulaire de demande d'admission pour candidats internationaux, avec copies certifiées du diplôme et leur traduction, CV et preuve d'allemand. Certains masters passent par le portail MoveIN. La lettre d'admission, envoyée par courriel, sert pour le visa ; l'inscription se fait ensuite par courrier.",
        conditions: `${HZB} Studienkolleg de Munich : candidature par la LMU, jusqu'au 15 juillet pour le semestre d'hiver.`,
        calendrier: `Dépôt jusqu'au 15 juillet pour le semestre d'hiver, jusqu'au 15 janvier pour l'été. En 2026, les diplômes des filières sans sélection pouvaient être complétés jusqu'au 21 août ; les filières sélectives et le Studienkolleg fermaient le 15 juillet 2026. ${HIVER}`,
        langue: "DSH 2, TestDaF avec 4 dans chaque épreuve, telc Deutsch C1 Hochschule, Goethe C2 ou DSD II. Pour une filière sans sélection, une attestation de cours intensif d'allemand de niveau B2 suffit à la candidature : vous passez ensuite la DSH à Munich.",
        fraisDossier: "Aucuns frais de dossier ne sont mentionnés par la LMU, et la candidature ne passe pas par uni-assist.",
        sources: [
          "https://www.lmu.de/en/study/degree-students/applications-for-admission/",
          "https://www.lmu.de/en/study/degree-students/applications-for-admission/guidelines-and-faqs/",
          "https://cms-cdn.lmu.de/media/lmu/downloads/studium/international-office/neuer-ordner/informations-sheet-on-application-for-admission-non-eu_merkblatt_en_zulantrag_non-eu-2.pdf",
          "https://www.lmu.de/de/studium/internationale-vollzeit-studierende/studienbewerbung/bewerbungshilfen-und-faq/leitfaden-fuer-die-bewerbung-zum-studienkolleg/"
        ],
        verifieLe: LE
      }
    }
  },

  // ---------------- Bade-Wurtemberg : 1 500 € par semestre hors UE ----------------

  {
    id: "universitat-heidelberg-heidelberg",
    data: {
      name: "Université de Heidelberg",
      city: "Heidelberg",
      province: "Bade-Wurtemberg",
      country: "Allemagne",
      image: "heidelberg-chateau.jpg",
      flag: "de.svg",
      ranking: "#86 mondial (QS 2027)",
      officialWebsite: "https://www.uni-heidelberg.de",
      applicationPortalUrl: "https://heico.uni-heidelberg.de",
      fields: ["Médecine", "Sciences", "Droit", "Lettres", "Sciences sociales", "Informatique"],
      description: "Plus ancienne université d'Allemagne, fondée en 1386. 32 178 étudiants, dont 6 633 internationaux, et des masters en double diplôme avec la Sorbonne, l'EHESS et Montpellier.",
      langueEnseignement: "Allemand en licence ; masters en allemand et en anglais",
      fraisScolarite: {
        source: "https://www.uni-heidelberg.de/en/study/management-of-studies/semester-fees/tuition-fees-for-international-students",
        verifieLe: LE,
        note: "Étudiants hors Union européenne avec un diplôme d'accès étranger : 1 500 € de frais de scolarité par semestre en licence et en master, loi du Bade-Wurtemberg depuis l'hiver 2017-2018. S'y ajoute la contribution semestrielle de 189,80 € : frais administratifs 80 €, Studierendenwerk 95 €, corps étudiant 10 €, vélos en libre-service et théâtre 4,80 €. Montant retenu : 3 380 € par an en licence et en master (2 × 1 689,80 €). Le doctorat reste sans frais de scolarité : 380 € par an.",
        licence: { montant: 3380, devise: "EUR", periode: "an" },
        master: { montant: 3380, devise: "EUR", periode: "an" },
        doctorat: { montant: 380, devise: "EUR", periode: "an" }
      },
      exoneration: {
        politique: "possible_plafonnee",
        detail: "L'université peut exonérer jusqu'à 5 % des étudiants internationaux, sur demande avant le 15 juillet pour le semestre d'hiver, au titre du mérite scolaire ou de la situation sociale. Le ministère du Land précise qu'une part notable de ces exonérations doit aller aux étudiants des pays ACP, dont le Sénégal. Décision en août.",
        source: "https://www.uni-heidelberg.de/en/study/management-of-studies/semester-fees/tuition-fees-for-international-students",
        verifieLe: LE
      },
      admission: {
        procedure: "Candidature directe en ligne sur heiCO, le portail de l'université, sans uni-assist : l'université examine elle-même votre diplôme étranger dans la procédure d'admission. L'inscription se fait ensuite aussi sur heiCO.",
        conditions: `${HZB} Studienkolleg propre à l'université : candidature sur heiCO du 1er mai au 30 juin pour l'hiver, allemand B2+ exigé, examen d'entrée obligatoire.`,
        calendrier: `Candidats hors Union européenne à diplôme étranger : du 1er juin au 15 juillet pour les licences sélectives, du 1er juin au 31 octobre pour les licences sans sélection. Les licences ne commencent qu'en hiver. ${HIVER}`,
        langue: "Licences en allemand : DSH 2 à l'inscription, ou TestDaF avec 4 dans chaque épreuve, Goethe C2, telc C1 Hochschule. DSH 3 en psychologie, médecine, médecine dentaire et droit. Les masters en anglais n'exigent pas l'allemand.",
        fraisDossier: "Aucuns frais de dossier ne sont mentionnés par l'université, qui n'utilise pas uni-assist.",
        sources: [
          "https://www.uni-heidelberg.de/en/study/management-of-studies/key-dates-deadlines/application-deadlines-for-the-1st-semester-of-undergraduate-degree-programmes",
          "https://www.uni-heidelberg.de/en/study/application-enrolment/study-requirements/studienkolleg-and-feststellungsprufung",
          "https://www.uni-heidelberg.de/en/study/advisory-services/learning-languages/language-requirements-for-international-students",
          BW_FAQ
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "karlsruher-institut-fur-technologie-karlsruhe",
    data: {
      name: "Institut de technologie de Karlsruhe (KIT)",
      city: "Karlsruhe",
      province: "Bade-Wurtemberg",
      country: "Allemagne",
      image: "karlsruhe-chateau.jpg",
      flag: "de.svg",
      ranking: "#110 mondial (QS 2027)",
      officialWebsite: "https://www.kit.edu",
      applicationPortalUrl: "https://bewerbung.studium.kit.edu/prod/campus/Portal/Start?l=en&t=",
      fields: ["Ingénierie", "Informatique", "Sciences", "Architecture", "Commerce"],
      description: "Né en 2009 de la fusion de l'université de Karlsruhe, fondée en 1825, et d'un centre de recherche. 23 083 étudiants au semestre d'hiver 2025-2026, dont 14 238 en ingénierie.",
      langueEnseignement: "Allemand en licence, sauf une licence de génie mécanique en anglais ; nombreux masters en anglais",
      fraisScolarite: {
        source: "https://www.sle.kit.edu/english/imstudium/703.php",
        verifieLe: LE,
        note: "Étudiants hors Union européenne : 1 500 € de frais de scolarité par semestre en licence et en master, loi du Bade-Wurtemberg. S'y ajoute la contribution semestrielle : frais administratifs 80 €, Studierendenwerk 92 €, corps étudiant 12 €, soit 184 €. Montant retenu : 3 368 € par an en licence et en master (2 × 1 684 €). Les doctorants ne paient pas les 1 500 € : 368 € par an.",
        licence: { montant: 3368, devise: "EUR", periode: "an" },
        master: { montant: 3368, devise: "EUR", periode: "an" },
        doctorat: { montant: 368, devise: "EUR", periode: "an" }
      },
      exoneration: {
        politique: "aucune",
        detail: "Le KIT ne publie ni exonération au mérite ni quota pour les pays en développement. Seule une remise pour détresse financière est possible, et seulement si elle survient après le début des études, commencées avec un financement complet : demande avant le 1er juillet pour l'hiver.",
        source: "https://www.intl.kit.edu/istudies/12606.php",
        verifieLe: LE
      },
      admission: {
        procedure: "Candidature directe en ligne sur le portail du KIT, sans uni-assist : toutes les pièces se déposent en PDF. Pour une filière à numerus clausus, il faut aussi s'enregistrer sur hochschulstart.de.",
        conditions: `${HZB} Studienkolleg propre au KIT, cours T pour les filières scientifiques et techniques : allemand B1 exigé, B2 conseillé ; une moyenne d'au moins 70 % de l'échelle de notes de votre pays pour être invité au test d'entrée ; date limite le 15 juillet.`,
        calendrier: `Candidature en ligne du 15 mai au 15 juillet pour le semestre d'hiver, y compris pour les filières sans sélection : pour les hors UE, aucune prolongation. La licence de génie mécanique en anglais ferme dès le 30 avril. ${HIVER}`,
        langue: "Allemand B1 pour candidater ; DSH 2 exigé avant le début des cours, ou TestDaF avec 4 dans chaque épreuve, DSD II, Goethe C1, telc C1 Hochschule, ÖSD C1.",
        fraisDossier: "Aucuns frais de dossier ne sont mentionnés par le KIT, qui n'utilise pas uni-assist.",
        sources: [
          "https://www.intl.kit.edu/istudies/3167.php",
          "https://www.intl.kit.edu/istudies/12606.php",
          "https://www.intl.kit.edu/istudies/9424.php",
          "https://www.kit.edu/kit/english/data.php"
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "universitat-stuttgart-stuttgart",
    data: {
      name: "Université de Stuttgart",
      city: "Stuttgart",
      province: "Bade-Wurtemberg",
      country: "Allemagne",
      image: "stuttgart-schlossplatz.jpg",
      flag: "de.svg",
      ranking: "#318 mondial ex æquo (QS 2027)",
      officialWebsite: "https://www.uni-stuttgart.de",
      applicationPortalUrl: "https://campus.uni-stuttgart.de/cusonline/webnav.ini",
      fields: ["Ingénierie", "Informatique", "Sciences", "Architecture", "Sciences sociales", "Commerce", "Lettres"],
      description: "Fondée en 1829, université depuis 1967. 20 536 étudiants au semestre d'hiver 2025-2026. Licence franco-allemande de sciences sociales avec Sciences Po Bordeaux.",
      langueEnseignement: "Allemand en licence ; masters en anglais ; une licence franco-allemande",
      fraisScolarite: {
        source: "https://www.student.uni-stuttgart.de/en/organizing-studies/formalities/tuition-and-fees/tuition-fee/",
        verifieLe: LE,
        note: "Étudiants hors Union européenne : 1 500 € de frais de scolarité par semestre en licence et en master consécutif, loi du Bade-Wurtemberg. S'y ajoute la contribution semestrielle de 184 € : frais administratifs 80 €, Studierendenwerk 96,50 €, corps étudiant 7,50 €. Montant retenu : 3 368 € par an en licence et en master (2 × 1 684 €). Doctorants : sans frais de scolarité, contribution de 177,50 € par semestre, soit 355 € par an.",
        licence: { montant: 3368, devise: "EUR", periode: "an" },
        master: { montant: 3368, devise: "EUR", periode: "an" },
        doctorat: { montant: 355, devise: "EUR", periode: "an" }
      },
      exoneration: {
        politique: "aucune",
        detail: "Pas d'exonération au mérite ni pour les pays en développement. Les exceptions prévues par la loi, par exemple pour des liens durables avec l'Allemagne, se demandent seulement après l'acceptation de la place et la réception de l'avis de frais.",
        source: "https://www.student.uni-stuttgart.de/en/organizing-studies/formalities/tuition-and-fees/tuition-fee/",
        verifieLe: LE
      },
      admission: {
        procedure: "Candidature directe en ligne sur C@MPUS, le portail de l'université, pour tous les candidats, hors UE compris ; aucun dossier papier. Les diplômes étrangers sont examinés par l'université.",
        conditions: `${HZB} L'université n'a pas de Studienkolleg : elle vous oriente, par une candidature sur C@MPUS, vers celui du KIT pour les filières techniques ou celui de Heidelberg pour les lettres et l'économie.`,
        calendrier: `Licences sélectives : du 15 mai au 15 juillet pour le semestre d'hiver. Licences sans sélection : du 15 mai au 15 septembre. Pas d'entrée en licence au semestre d'été. ${HIVER}`,
        langue: "L'allemand doit être prouvé dès la candidature : DSH 2 ou plus, TestDaF avec 4 dans chaque épreuve, Goethe C1 ou C2, telc Deutsch C1 Hochschule, DSD II. Licence franco-allemande : bon niveau de français exigé.",
        fraisDossier: "Pas de frais de dossier : l'université l'écrit sur sa page de candidature.",
        sources: [
          "https://www.uni-stuttgart.de/en/study/application/international-degree/application/",
          "https://www.uni-stuttgart.de/en/study/application/dates/",
          "https://www.uni-stuttgart.de/en/study/application/international-degree/language-prerequisites/",
          "https://www.uni-stuttgart.de/studium/bewerbung/international-degree/studienkolleg/"
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "albert-ludwigs-universitat-freiburg-fribourg-en-brisgau",
    data: {
      name: "Université de Fribourg-en-Brisgau",
      city: "Fribourg-en-Brisgau",
      province: "Bade-Wurtemberg",
      country: "Allemagne",
      image: "fribourg-en-brisgau-cathedrale.jpg",
      flag: "de.svg",
      ranking: "#245 mondial (QS 2027)",
      officialWebsite: "https://uni-freiburg.de",
      applicationPortalUrl: "https://campus.uni-freiburg.de/",
      fields: ["Sciences", "Médecine", "Lettres", "Sciences sociales", "Droit", "Ingénierie", "Commerce"],
      description: "Fondée en 1457, l'une des plus anciennes universités d'Allemagne, près de la frontière française. Licence en anglais de Liberal Arts and Sciences et masters franco-allemands.",
      langueEnseignement: "Allemand ; une licence en anglais ; masters franco-allemands",
      fraisScolarite: {
        source: "https://uni-freiburg.de/studium/im-studium/semesterbeitrag-studiengebuehren/",
        verifieLe: LE,
        note: "Étudiants hors Union européenne : 1 500 € de frais de scolarité par semestre, loi du Bade-Wurtemberg depuis l'hiver 2017-2018. S'y ajoute la contribution semestrielle de 190 € : Studierendenwerk et base du ticket de transport 103 €, frais administratifs 80 €, corps étudiant 7 €. Montant retenu : 3 380 € par an en licence et en master (2 × 1 690 €). Le doctorat reste sans frais de scolarité : 380 € par an.",
        licence: { montant: 3380, devise: "EUR", periode: "an" },
        master: { montant: 3380, devise: "EUR", periode: "an" },
        doctorat: { montant: 380, devise: "EUR", periode: "an" }
      },
      exoneration: {
        politique: "aucune",
        detail: "Pas d'exonération au mérite ni pour les pays en développement. Les exemptions prévues par la loi visent des situations particulières, par exemple un handicap qui gêne fortement les études, et se demandent par formulaire.",
        source: "https://uni-freiburg.de/studium/im-studium/studiengebuehren-internationale-studierende/",
        verifieLe: LE
      },
      admission: {
        procedure: "Candidature directe en ligne sur le portail de l'université, pendant la période de candidature, sans uni-assist. La médecine, la médecine dentaire et la pharmacie passent aussi par ce portail pour les hors UE, pas par hochschulstart.",
        conditions: `${HZB} L'université n'a pas de Studienkolleg : vous candidatez sur son portail à l'examen « Feststellungsprüfung », et la préparation d'un an se fait au Studienkolleg de Heidelberg.`,
        calendrier: `Pour la rentrée d'octobre 2026 : du 1er juin au 15 juillet 2026 pour les filières sélectives et pour le Studienkolleg, jusqu'au 30 septembre pour les filières à conditions particulières, jusqu'au 8 octobre pour les filières libres. ${HIVER}`,
        langue: "Allemand de niveau C1 : DSH 2 ou 3, TestDaF 4 ou 5, Goethe C2, telc Deutsch C1 Hochschule. Licence Liberal Arts and Sciences : enseignée en anglais, avec l'allemand appris jusqu'au niveau A2 pendant les études.",
        fraisDossier: "Aucuns frais de dossier ne sont mentionnés par l'université, qui n'utilise pas uni-assist.",
        sources: [
          "https://uni-freiburg.de/en/studies/applying/dates-and-deadlines/",
          "https://uni-freiburg.de/en/studies/applying/international-applicants/full-time-studies/",
          "https://uni-freiburg.de/en/studies/applying/language-certificates/",
          "https://uni-freiburg.de/en/university/the-university-at-a-glance/"
        ],
        verifieLe: LE
      }
    }
  },

  // ---------------- Rhénanie-du-Nord-Westphalie et Hesse ----------------

  {
    id: "rwth-aachen-aix-la-chapelle",
    data: {
      name: "RWTH Aachen",
      city: "Aix-la-Chapelle",
      province: "Rhénanie-du-Nord-Westphalie",
      country: "Allemagne",
      image: "aix-la-chapelle-hotel-de-ville.jpg",
      flag: "de.svg",
      ranking: "#104 mondial (QS 2027)",
      officialWebsite: "https://www.rwth-aachen.de",
      applicationPortalUrl: "https://online.rwth-aachen.de",
      fields: ["Ingénierie", "Sciences", "Informatique", "Architecture", "Médecine", "Commerce", "Lettres"],
      description: "Grande université technique d'Aix-la-Chapelle, près de la Belgique et des Pays-Bas : sciences, architecture, génie civil, génie mécanique, électrotechnique, économie et médecine.",
      langueEnseignement: "Allemand en licence ; masters en anglais",
      fraisScolarite: {
        source: "https://www.asta.rwth-aachen.de/en/about-us/finance/",
        verifieLe: LE,
        note: "Pas de frais de scolarité à la RWTH, sauf pour les programmes de sa RWTH Academy. Contribution semestrielle de l'hiver 2026-2027, publiée par la représentation étudiante : 375,19 €, dont Deutschlandsemesterticket 226,80 €, extension vers le Limbourg néerlandais 7,77 €, Studierendenwerk 128 €, corps étudiant 12,62 €. Soit 750 € par an, en licence, master et doctorat.",
        licence: { montant: 750, devise: "EUR", periode: "an" },
        master: { montant: 750, devise: "EUR", periode: "an" },
        doctorat: { montant: 750, devise: "EUR", periode: "an" }
      },
      exoneration: {
        politique: "systematique",
        detail: SANS_FRAIS,
        source: "https://www.rwth-aachen.de/cms/root/studium/im-studium/internationales/~inno/faq/?lidx=1",
        verifieLe: LE
      },
      admission: {
        procedure: "Candidature directe en ligne sur RWTHonline, sans uni-assist : vous remplissez la demande, déposez chaque pièce en PDF et l'envoyez. Plus aucun envoi postal n'est demandé ; une pièce ajoutée après coup se dépose aussi en ligne.",
        conditions: `Condition propre à la RWTH : les candidats internationaux doivent avoir une note globale de 2,5 ou mieux dans le barème allemand pour leur diplôme d'accès. Une note insuffisante peut être compensée par un résultat au TestAS, proposé quatre fois par an seulement. ${HZB}`,
        calendrier: `Semestre d'hiver : 15 juillet pour les filières à numerus clausus, 20 octobre pour les filières libres. Pour la rentrée 2026, la date des filières sélectives était le 15 juillet 2026. ${HIVER}`,
        langue: "Allemand de niveau C1 à l'inscription : DSH 2, TestDaF avec 4 dans chaque épreuve, Goethe C1 ou plus, telc Deutsch C1 Hochschule, DSD II. Masters en anglais : TOEFL iBT 90 ou IELTS 6,0.",
        fraisDossier: "Aucuns frais de dossier ne sont mentionnés par la RWTH, qui n'utilise pas uni-assist.",
        sources: [
          "https://www.rwth-aachen.de/go/id/dswt/lidx/1",
          "https://www.rwth-aachen.de/cms/root/studium/im-studium/internationales/~inno/faq/?lidx=1",
          "https://www.rwth-aachen.de/cms/root/studium/vor-dem-studium/zugangsvoraussetzungen/zugangsvoraussetzung-fuer-den-bachelor-un/~drar/zugangsvoraussetzungen-fuer-internationa/?lidx=1",
          "https://www.asta.rwth-aachen.de/en/about-us/finance/"
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "universitat-bonn-bonn",
    data: {
      name: "Université de Bonn",
      city: "Bonn",
      province: "Rhénanie-du-Nord-Westphalie",
      country: "Allemagne",
      image: "bonn-cerisiers-en-fleurs.jpg",
      flag: "de.svg",
      ranking: "#209 mondial ex æquo (QS 2027)",
      officialWebsite: "https://www.uni-bonn.de",
      applicationPortalUrl: "https://application.uni-bonn.de/qisserver/pages/cs/sys/portal/hisinoneStartPage.faces",
      fields: ["Sciences", "Droit", "Commerce", "Médecine", "Lettres", "Agriculture", "Informatique"],
      description: "Université fondée en 1818, installée dans l'ancien palais des princes-électeurs de Cologne. 31 318 étudiants, dont environ 5 285 venus de l'étranger, et une licence franco-allemande avec Sorbonne Université.",
      langueEnseignement: "Allemand ; quelques programmes en anglais ; une licence franco-allemande",
      fraisScolarite: {
        source: "https://www.uni-bonn.de/en/studying/application-admission-and-enrollment/costs",
        verifieLe: LE,
        note: "Université publique : pas de frais de scolarité, et la candidature est gratuite. Contribution semestrielle de l'hiver 2026-2027 : 363,07 €, dont Deutschlandsemesterticket 226,80 € et services étudiants. Soit 726 € par an, en licence, master et doctorat.",
        licence: { montant: 726, devise: "EUR", periode: "an" },
        master: { montant: 726, devise: "EUR", periode: "an" },
        doctorat: { montant: 726, devise: "EUR", periode: "an" }
      },
      exoneration: {
        politique: "systematique",
        detail: SANS_FRAIS,
        source: "https://www.uni-bonn.de/en/studying/application-admission-and-enrollment/costs",
        verifieLe: LE
      },
      admission: {
        procedure: "Candidature directe en ligne sur le portail de l'université, sans uni-assist : vous vous inscrivez, remplissez la demande et déposez les pièces. Aucun envoi postal : les documents envoyés par courrier ne sont pas traités. Le suivi se fait sur le portail.",
        conditions: `${HZB} Si vous êtes passé par un Studienkolleg, joignez le certificat de Feststellungsprüfung avec vos diplômes d'origine.`,
        calendrier: `Candidats à diplôme hors Union européenne : de juin au 15 juillet pour toutes les licences, sélectives ou non ; résultats début août sur le portail. ${HIVER}`,
        langue: "DSH 2 pour les licences, ou TestDaF avec 4 dans chaque épreuve, DSD II, Goethe C2, telc Deutsch C1 Hochschule. DSH 1 suffit dans cinq licences, dont l'économie et les études anglaises. Un cours préparatoire à la DSH est ouvert dès le niveau B1.",
        fraisDossier: "Candidature gratuite : l'université l'écrit sur sa page des coûts.",
        sources: [
          "https://www.uni-bonn.de/en/studying/application-admission-and-enrollment/special-application-matters/applicants-from-non-eu-eec-countries",
          "https://www.uni-bonn.de/en/studying/application-admission-and-enrollment/application-deadlines",
          "https://www.uni-bonn.de/en/studying/application-admission-and-enrollment/german-language-proficiency",
          "https://www.uni-bonn.de/en/studying/degree-programs/degree-programs-a-z/german-french-studies-ba"
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "universitat-zu-koln-cologne",
    data: {
      name: "Université de Cologne",
      city: "Cologne",
      province: "Rhénanie-du-Nord-Westphalie",
      country: "Allemagne",
      image: "cologne-grue-du-rheinauhafen.jpg",
      flag: "de.svg",
      ranking: "#269 mondial (QS 2027)",
      officialWebsite: "https://uni-koeln.de",
      applicationPortalUrl: "https://my.uni-assist.de/",
      fields: ["Commerce", "Droit", "Médecine", "Lettres", "Sciences", "Sciences sociales"],
      description: "Fondée en 1388 et refondée en 1919, l'une des plus grandes universités d'Allemagne : 43 594 étudiants en 2024, dans six facultés.",
      langueEnseignement: "Allemand pour toutes les licences",
      fraisScolarite: {
        source: "https://www.asta.uni-koeln.de/en/semester-fee/",
        verifieLe: LE,
        note: "Pas de frais de scolarité à l'université de Cologne. Contribution semestrielle en vigueur, publiée par la représentation étudiante : 355,65 €, dont Deutschlandsemesterticket 226,80 € et Studierendenwerk 110 €. Soit 711 € par an, en licence, master et doctorat. L'université précise que ce montant change chaque semestre.",
        licence: { montant: 711, devise: "EUR", periode: "an" },
        master: { montant: 711, devise: "EUR", periode: "an" },
        doctorat: { montant: 711, devise: "EUR", periode: "an" }
      },
      exoneration: {
        politique: "systematique",
        detail: SANS_FRAIS,
        source: "https://uni-koeln.de/en/studying-teaching/international/study-in-cologne/costs-financing",
        verifieLe: LE
      },
      admission: {
        procedure: "Candidature en ligne par uni-assist, sans papier : tous les documents se déposent sur le portail My assist. Le TestAS, test d'aptitude aux études, est obligatoire pour les candidats hors UE, avec le module lié à la faculté visée ; sans certificat TestAS valable, pas de candidature.",
        conditions: "Bachelier sans accès direct : l'université propose sa propre voie, « Studienstart International plus » : un semestre préparatoire conclu par son examen d'entrée, gratuit et avec une place garantie dans la filière choisie en cas de réussite. Il faut le TestAS et l'allemand de niveau DSH 2. Candidature pour le semestre d'été seulement, jusqu'au 15 janvier ; ni droit ni formation des enseignants par cette voie.",
        calendrier: `Licences : jusqu'au 15 juillet pour le semestre d'hiver, jusqu'au 15 janvier pour le semestre d'été, date de réception. ${HIVER}`,
        langue: "Toutes les licences sont en allemand : TestDaF avec 4 dans chaque épreuve, DSH 2, DSD II, telc C1 Hochschule, telc C2, Goethe C1, ÖSD C2 ou partie allemande de la Feststellungsprüfung.",
        fraisDossier: UNI_ASSIST_FRAIS,
        sources: [
          "https://uni-koeln.de/en/index.php?id=22242",
          "https://uni-koeln.de/en/index.php?id=6944",
          "https://uni-koeln.de/en/index.php?id=6943",
          "https://uni-koeln.de/en/studying-teaching/international/study-in-cologne/costs-financing",
          UNI_ASSIST_FRAIS_URL
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "universitat-munster-munster",
    data: {
      name: "Université de Münster",
      city: "Münster",
      province: "Rhénanie-du-Nord-Westphalie",
      country: "Allemagne",
      image: "munster-arcades-de-nuit.jpg",
      flag: "de.svg",
      ranking: "#370 mondial ex æquo (QS 2027)",
      officialWebsite: "https://www.uni-muenster.de",
      applicationPortalUrl: "https://studienbewerbung.uni-muenster.de/bewerbungsportal/",
      fields: ["Droit", "Commerce", "Médecine", "Lettres", "Sciences", "Sciences sociales"],
      description: "Enseignement commencé en 1773, inauguration en 1780. 41 217 étudiants au semestre d'hiver 2025-2026, dont 9 % d'internationaux.",
      langueEnseignement: "Allemand ; une licence en anglais ; une vingtaine de masters en anglais",
      fraisScolarite: {
        source: "https://www.uni-muenster.de/studium/en/kosten/semesterbeitrag.html",
        verifieLe: LE,
        note: "Pas de frais de scolarité à l'université de Münster, sauf certains masters de formation continue. Contribution semestrielle de l'hiver 2026-2027 : 369,50 €, dont Studierendenwerk 119,77 €, ticket de transport 226,80 €, corps étudiant 17,50 €. Soit 739 € par an, en licence, master et doctorat.",
        licence: { montant: 739, devise: "EUR", periode: "an" },
        master: { montant: 739, devise: "EUR", periode: "an" },
        doctorat: { montant: 739, devise: "EUR", periode: "an" }
      },
      exoneration: {
        politique: "systematique",
        detail: SANS_FRAIS,
        source: "https://www.uni-muenster.de/studium/en/kosten/semesterbeitrag.html",
        verifieLe: LE
      },
      admission: {
        procedure: "Candidature directe en ligne sur le portail de l'université, sans uni-assist, jusqu'à trois licences dans une même demande. Vous recevez ensuite par courriel un numéro de candidat et une liste de pièces à déposer sur le portail avant la date limite.",
        conditions: `${HZB} L'université n'a pas de Studienkolleg : il faut en suivre un ailleurs et joindre le certificat de Feststellungsprüfung.`,
        calendrier: "Candidats hors Union européenne, rentrée d'octobre 2026 : du début mai au 31 mai 2026 pour les licences sélectives, jusqu'au 15 juillet 2026 pour les licences sans sélection. Ces dates sont plus précoces que pour les candidats européens. Pour l'été 2027 : du début novembre au 30 novembre 2026 pour les licences sélectives, jusqu'au 15 janvier 2027 pour les autres.",
        langue: "DSH 2 dans la plupart des licences, ou TestDaF avec 4 dans chaque épreuve, DSD II, Goethe C2, telc C1 Hochschule. Certaines filières demandent DSH 1, d'autres DSH 3. Les programmes en anglais n'exigent pas l'allemand.",
        fraisDossier: "Aucuns frais de dossier ne sont mentionnés par l'université, qui n'utilise pas uni-assist.",
        sources: [
          "https://www.uni-muenster.de/studieninteressierte/en/bewerbung/fristenundtermine.shtml",
          "https://www.uni-muenster.de/studieninteressierte/en/bewerbung/nichteu_bewerber_ba.html",
          "https://www.uni-muenster.de/studieninteressierte/en/studienvoraussetzungen/sprachkurse/index.html",
          "https://www.uni-muenster.de/studieninteressierte/en/studienvoraussetzungen/bachelorundstaatsexamen/index.html"
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "technische-universitat-darmstadt-darmstadt",
    data: {
      name: "Université technique de Darmstadt",
      city: "Darmstadt",
      province: "Hesse",
      country: "Allemagne",
      image: "darmstadt-karolinenplatz.jpg",
      flag: "de.svg",
      ranking: "#250 mondial (QS 2027)",
      officialWebsite: "https://www.tu-darmstadt.de",
      applicationPortalUrl: "https://www.tucan.tu-darmstadt.de",
      fields: ["Ingénierie", "Informatique", "Sciences", "Architecture", "Commerce"],
      description: "Université technique fondée en 1877, l'une des plus internationales d'Allemagne : 24 437 étudiants au semestre d'hiver 2025-2026, dont 28 % d'étrangers.",
      langueEnseignement: "Allemand en licence ; 22 masters entièrement en anglais",
      fraisScolarite: {
        source: "https://www.tu-darmstadt.de/studieren/studieren_von_a_bis_z/artikel_details_de_en_286144.de.jsp",
        verifieLe: LE,
        note: "Pas de frais de scolarité à la TU Darmstadt. Contribution semestrielle de l'hiver 2026-2027 : 402,68 € si elle est payée du 6 juillet au 15 septembre 2026, 432,68 € ensuite ; elle comprend le Deutschland-Semesterticket, 226,80 €, et le Studierendenwerk, 103 €. Soit 805 € par an, en licence, master et doctorat.",
        licence: { montant: 805, devise: "EUR", periode: "an" },
        master: { montant: 805, devise: "EUR", periode: "an" },
        doctorat: { montant: 805, devise: "EUR", periode: "an" }
      },
      exoneration: {
        politique: "systematique",
        detail: SANS_FRAIS,
        source: "https://www.etit.tu-darmstadt.de/studieren/faq_etit/index.en.jsp",
        verifieLe: LE
      },
      admission: {
        procedure: "Candidature directe en ligne sur TUCaN, le portail de l'université, avec les mêmes dates que les candidats allemands et sans uni-assist. Vous déposez le diplôme et son relevé dans la langue d'origine, avec une traduction certifiée ; la légalisation n'est pas exigée.",
        conditions: `${HZB} Studienkolleg propre à l'université, cours T et G : candidature en ligne du 15 mars au 15 avril pour le semestre d'hiver ; dates déjà passées pour la rentrée 2026.`,
        calendrier: `Pour la rentrée d'octobre 2026, diplôme étranger : du 1er juin au 31 août 2026 pour les licences sans sélection, du 1er juin au 15 juillet 2026 pour les licences sélectives ou à test d'aptitude, comme l'architecture. ${HIVER}`,
        langue: "Licences en allemand : DSH 2 ou un certificat équivalent. Passer la DSH au Studienkolleg de l'université est payant.",
        fraisDossier: "Aucuns frais de dossier ne sont mentionnés par l'université, qui n'utilise pas uni-assist.",
        sources: [
          "https://www.tu-darmstadt.de/studieren/studieninteressierte/internationale_studieninteressierte/bewerbung_und_zulassung_international/index.en.jsp",
          "https://www.tu-darmstadt.de/studieren/studieninteressierte/bewerbung_zulassung_tu/bewerbungsfristen/bachelor_studiengaenge_1/index.en.jsp",
          "https://www.tu-darmstadt.de/studieren/studieninteressierte/bewerbung_zulassung_tu/bewerbungsfristen/studienkolleg/index.en.jsp",
          "https://www.tu-darmstadt.de/universitaet/index.en.jsp"
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "goethe-universitat-frankfurt-francfort",
    data: {
      name: "Université Goethe de Francfort",
      city: "Francfort-sur-le-Main",
      province: "Hesse",
      country: "Allemagne",
      image: "francfort-romerberg.jpg",
      flag: "de.svg",
      ranking: "#376 mondial ex æquo (QS 2027)",
      officialWebsite: "https://www.uni-frankfurt.de",
      applicationPortalUrl: "https://my.uni-assist.de/",
      fields: ["Commerce", "Droit", "Médecine", "Lettres", "Sciences", "Sciences sociales", "Informatique"],
      description: "Université fondée en 1914 par les citoyens de Francfort, redevenue fondation autonome en 2008. Elle a son propre Studienkolleg pour les bacheliers sans accès direct.",
      langueEnseignement: "Allemand en licence ; masters en allemand et en anglais",
      fraisScolarite: {
        source: "https://www.uni-frankfurt.de/en/studium/studienorganisation/studierendenservice/studium-weiterfuehren-beenden",
        verifieLe: LE,
        note: "La contribution publiée par l'université ne comporte aucun droit de scolarité. Contribution semestrielle de l'hiver 2026-2027 : 408,28 €, dont Deutschlandsemesterticket 226,80 €, Studierendenwerk 106,50 €, frais administratifs 50 €, corps étudiant 17,10 €. Soit 817 € par an, en licence, master et doctorat.",
        licence: { montant: 817, devise: "EUR", periode: "an" },
        master: { montant: 817, devise: "EUR", periode: "an" },
        doctorat: { montant: 817, devise: "EUR", periode: "an" }
      },
      exoneration: {
        politique: "systematique",
        detail: SANS_FRAIS,
        source: "https://www.uni-frankfurt.de/en/studium/studienorganisation/studierendenservice/studium-weiterfuehren-beenden",
        verifieLe: LE
      },
      admission: {
        procedure: "Avec un diplôme d'accès obtenu hors d'Allemagne, vous candidatez en règle générale par uni-assist. L'offre d'admission arrive ensuite dans Goethe-Campus, le portail de l'université, où se font l'inscription en ligne et le paiement de la contribution.",
        conditions: `${HZB} Studienkolleg propre à l'université, cours G, M, T et W : candidature par uni-assist jusqu'au 1er mai pour l'hiver, allemand B1 exigé, test d'entrée obligatoire, sans dispense possible ; examen final interne 100 €.`,
        calendrier: `Semestre d'hiver : du 1er juin au 15 juillet pour les licences sélectives, du 1er juin au 30 septembre pour les licences sans sélection. ${HIVER}`,
        langue: "Toutes les licences exigent l'allemand de niveau DSH 2 dès la candidature ; DSH 3 en médecine et en médecine dentaire. Pour le Studienkolleg ou le cours préparatoire à la DSH, le niveau B1 suffit.",
        fraisDossier: UNI_ASSIST_FRAIS,
        sources: [
          "https://www.uni-frankfurt.de/de/home/studium/bewerbung-einschreibung/internationale-studierende/zugang.html",
          "https://www.uni-frankfurt.de/de/studium/bewerbung-einschreibung/grundstaendige-studiengaenge/termine-fristen",
          "https://www.uni-frankfurt.de/en/studium/bewerbung-einschreibung/internationale-studierende/sprachkenntnisse",
          "https://www.uni-frankfurt.de/43662351/Studienkolleg",
          UNI_ASSIST_FRAIS_URL
        ],
        verifieLe: LE
      }
    }
  },

  // ---------------- Berlin et Saxe ----------------

  {
    id: "technische-universitat-berlin-berlin",
    data: {
      name: "Université technique de Berlin",
      city: "Berlin",
      province: "Berlin",
      country: "Allemagne",
      image: "berlin-porte-de-brandebourg.jpg",
      flag: "de.svg",
      ranking: "#158 mondial ex æquo (QS 2027)",
      officialWebsite: "https://www.tu.berlin",
      applicationPortalUrl: "https://tuport.sap.tu-berlin.de/",
      fields: ["Ingénierie", "Informatique", "Sciences", "Architecture", "Commerce"],
      description: "Héritière de l'Académie royale technique de 1879, refondée le 9 avril 1946. Elle a son propre Studienkolleg pour les bacheliers sans accès direct.",
      langueEnseignement: "Allemand en licence ; masters en allemand et en anglais",
      fraisScolarite: {
        source: "https://www.tu.berlin/en/studierendensekretariat/topics-a-z/semester-fees",
        verifieLe: LE,
        note: "Pas de frais de scolarité. Contribution semestrielle de l'hiver 2026-2027 : 379,06 €, soit frais administratifs 50 €, corps étudiant 14,56 €, Studierendenwerk 85 €, Semesterticket 226,80 € et fonds social 2,70 €. Soit 758 € par an, en licence, master et doctorat. Pénalité de retard éventuelle : 19,94 €.",
        licence: { montant: 758, devise: "EUR", periode: "an" },
        master: { montant: 758, devise: "EUR", periode: "an" },
        doctorat: { montant: 758, devise: "EUR", periode: "an" }
      },
      exoneration: {
        politique: "systematique",
        detail: SANS_FRAIS,
        source: "https://www.tu.berlin/en/studierendensekretariat/topics-a-z/semester-fees",
        verifieLe: LE
      },
      admission: {
        procedure: "Deux étapes. Vous demandez d'abord à uni-assist une VPD pour la TU Berlin, l'examen de vos diplômes, qui prend 4 à 6 semaines et reste valable un an. Vous candidatez ensuite directement sur le portail de la TU Berlin, avant la date limite. Les certificats de langue se déposent sur ce portail, pas chez uni-assist.",
        conditions: `${HZB} Studienkolleg de la TU Berlin, cours T et W sur deux semestres : allemand B2 exigé pour candidater. Il n'existe ni admission conditionnelle ni admission provisoire : un dossier incomplet à la date limite est refusé.`,
        calendrier: `Pour la rentrée d'octobre 2026 : du 1er juin au 15 juillet 2026 pour les licences sélectives, du 1er juin au 31 août 2026 pour les licences libres ; mêmes dates pour les diplômes étrangers. Pour l'été 2027 : du 1er décembre 2026 au 15 janvier 2027. ${HIVER}`,
        langue: "Licences : allemand de niveau DSH 2 au moins.",
        fraisDossier: `La TU Berlin ne demande pas de frais de dossier ; la VPD est payante. ${UNI_ASSIST_FRAIS}`,
        sources: [
          "https://www.tu.berlin/en/studierendensekretariat/dates-deadlines-for-application-and-enrollment-at-tu-berlin",
          "https://www.tu.berlin/en/studierendensekretariat/bachelors-application-enrollment/prospective-students-with-an-international-higher-education-entrance-qualification/admission-requirements",
          "https://www.tu.berlin/en/studierendensekretariat/bachelors-application-enrollment/prospective-students-with-an-international-higher-education-entrance-qualification/application/group-c",
          "https://www.tu.berlin/en/studierendensekretariat/bachelors-application-enrollment/prospective-students-with-an-international-higher-education-entrance-qualification/application/group-a",
          UNI_ASSIST_FRAIS_URL
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "freie-universitat-berlin-berlin",
    data: {
      name: "Université libre de Berlin",
      city: "Berlin",
      province: "Berlin",
      country: "Allemagne",
      image: "berlin-cathedrale.jpg",
      flag: "de.svg",
      ranking: "#98 mondial ex æquo (QS 2027)",
      officialWebsite: "https://www.fu-berlin.de",
      applicationPortalUrl: "https://fu-berlin.hispro.de/qisserver/pages/cs/sys/portal/hisinoneStartPage.faces",
      fields: ["Lettres", "Sciences sociales", "Droit", "Commerce", "Sciences", "Informatique", "Médecine"],
      description: "Fondée en décembre 1948. 34 900 étudiants au semestre d'hiver 2025-2026, et une licence franco-allemande de lettres avec la Sorbonne Nouvelle, en double diplôme.",
      langueEnseignement: "Allemand ; une licence en anglais ; une licence franco-allemande",
      fraisScolarite: {
        source: "https://www.fu-berlin.de/studium/studieren/studienorganisation/gebuehren/index.html",
        verifieLe: LE,
        note: "Pas de frais de scolarité, sauf pour la formation continue. À la première inscription pour l'hiver 2026-2027 : 376,80 €, soit Studierendenwerk 85 €, frais administratifs 50 €, corps étudiant 10 €, Deutschlandsemesterticket 226,80 €, fonds social 5 €. Soit 754 € par an, en licence, master et doctorat.",
        licence: { montant: 754, devise: "EUR", periode: "an" },
        master: { montant: 754, devise: "EUR", periode: "an" },
        doctorat: { montant: 754, devise: "EUR", periode: "an" }
      },
      exoneration: {
        politique: "systematique",
        detail: SANS_FRAIS,
        source: "https://www.fu-berlin.de/studium/studieren/studienorganisation/gebuehren/index.html",
        verifieLe: LE
      },
      admission: {
        procedure: "Deux étapes. Vous demandez d'abord à uni-assist une VPD, l'examen de vos diplômes, qui peut prendre jusqu'à 8 semaines. Vous candidatez ensuite sur le portail de l'Université libre, qui n'accepte que les candidatures déposées là. C'est l'arrivée du dossier complet, VPD comprise, sur ce portail qui compte pour la date limite.",
        conditions: `${HZB} Studienkolleg commun avec Humboldt et la Charité : candidature par uni-assist jusqu'au 15 juillet, allemand B2 suffisant. Il est réservé aux bacheliers sans accès direct.`,
        calendrier: `Pour la rentrée d'octobre 2026 : du 1er juin au 15 juillet 2026 pour les licences sélectives et le Studienkolleg, du 1er juin au 1er septembre 2026 pour les licences libres. ${HIVER}`,
        langue: "Pour candidater, allemand de niveau C1, par exemple DSH 1 ou TestDaF avec au moins 4 dans deux épreuves et 3 dans les deux autres. Pour s'inscrire : DSH 2, telc C1 Hochschule avec la mention « gut », Goethe C2 ou TestDaF avec 4 partout. La preuve se dépose sur le portail avant la date limite. Licence franco-allemande : français B2.",
        fraisDossier: `L'Université libre ne demande pas de frais de dossier ; la VPD est payante. ${UNI_ASSIST_FRAIS}`,
        sources: [
          "https://www.fu-berlin.de/studium/bewerbung/bachelor/ausl-hzb/index.html",
          "https://www.fu-berlin.de/studium/bewerbung/bewerbungsfristen/index.html",
          "https://www.fu-berlin.de/studium/bewerbung/allgemein/deutschkenntnisse/index.html",
          "https://www.fu-berlin.de/sites/studienkolleg/bewerbung/index.html",
          UNI_ASSIST_FRAIS_URL
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "technische-universitat-dresden-dresde",
    data: {
      name: "Université technique de Dresde",
      city: "Dresde",
      province: "Saxe",
      country: "Allemagne",
      image: "dresde-vieille-ville-et-elbe.jpg",
      flag: "de.svg",
      ranking: "#185 mondial ex æquo (QS 2027)",
      officialWebsite: "https://tu-dresden.de",
      applicationPortalUrl: "https://my.uni-assist.de/",
      fields: ["Ingénierie", "Informatique", "Sciences", "Médecine", "Lettres", "Sciences sociales", "Architecture"],
      description: "Université fondée en 1828, université d'excellence depuis 2012, avec 17 facultés réparties en cinq pôles, de l'ingénierie à la médecine.",
      langueEnseignement: "Allemand en licence ; masters en anglais",
      fraisScolarite: {
        source: "https://www.stura.tu-dresden.de/semesterbeitrag",
        verifieLe: LE,
        note: "Pas de frais de scolarité généraux en Saxe ; seuls paient les étudiants très en retard sur la durée normale, un second diplôme ou l'enseignement à distance. Contribution semestrielle à partir de l'hiver 2026-2027, publiée par la représentation étudiante : 361 €. Soit 722 € par an, en licence, master et doctorat.",
        licence: { montant: 722, devise: "EUR", periode: "an" },
        master: { montant: 722, devise: "EUR", periode: "an" },
        doctorat: { montant: 722, devise: "EUR", periode: "an" }
      },
      exoneration: {
        politique: "systematique",
        detail: SANS_FRAIS,
        source: "https://tu-dresden.de/studium/im-studium/studienorganisation/semesterbeitrag-studiengebuehren?set_language=en",
        verifieLe: LE
      },
      admission: {
        procedure: "Candidature entièrement en ligne par uni-assist, sans envoi postal. Après 4 à 5 semaines d'examen de vos diplômes, uni-assist transmet le dossier à l'université, qui répond sous 4 semaines, ou après la sélection de la mi-août pour les filières à numerus clausus.",
        conditions: `${HZB} Sans accès direct, vous êtes envoyé, dans le cadre de votre candidature, au test d'entrée du Studienkolleg de Saxe à Leipzig ou du Studienkolleg TUDIAS à Dresde. Au Studienkolleg de Saxe, les cours préparatoires coûtent 850 € par semestre à partir de l'hiver 2026-2027.`,
        calendrier: `Licences et diplômes : du 1er avril au 15 juillet pour le semestre d'hiver. Inscription la dernière semaine de septembre. ${HIVER}`,
        langue: "DSH 2 au moins, ou TestDaF 4 en moyenne, DSD II, Goethe C2, telc C1 Hochschule.",
        fraisDossier: UNI_ASSIST_FRAIS,
        sources: [
          "https://tu-dresden.de/studium/vor-dem-studium/ressourcen/dateien/internationales/informationen-fuer-internationale-bewerber?lang=en",
          "https://tu-dresden.de/studium/vor-dem-studium/bewerbung/online-bewerbung/bewerbungsverfahren-ueber-uni-assist?set_language=en",
          "https://tu-dresden.de/studium/vor-dem-studium/bewerbung/studienvoraussetzungen/sprachkenntnisse?set_language=en",
          "https://www.stksachs.uni-leipzig.de/faq",
          UNI_ASSIST_FRAIS_URL
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "universitat-leipzig-leipzig",
    data: {
      name: "Université de Leipzig",
      city: "Leipzig",
      province: "Saxe",
      country: "Allemagne",
      image: "leipzig-monument-bataille-des-nations.jpg",
      flag: "de.svg",
      ranking: "#540 mondial ex æquo (QS 2027)",
      officialWebsite: "https://www.uni-leipzig.de",
      applicationPortalUrl: "https://my.uni-assist.de/",
      fields: ["Lettres", "Droit", "Médecine", "Sciences", "Sciences sociales", "Commerce", "Informatique"],
      description: "L'une des plus anciennes universités d'Europe, fondée en 1409. 31 232 étudiants dans 14 facultés ; le Studienkolleg de Saxe, qui prépare les bacheliers étrangers, en fait partie.",
      langueEnseignement: "Allemand pour l'essentiel ; quelques programmes en anglais",
      fraisScolarite: {
        source: "https://www.uni-leipzig.de/studium/im-studium/studienorganisation/rueckmeldung-und-semesterbeitrag",
        verifieLe: LE,
        note: "Pas de frais de scolarité pour un premier diplôme ; un second diplôme peut coûter 350 € par semestre. Contribution semestrielle de l'hiver 2026-2027 : 332,30 €, soit corps étudiant 11,50 €, Studentenwerk 90 €, Deutschlandticket 226,80 €, fonds de mobilité 4 €. Soit 665 € par an, en licence, master et doctorat. À la première inscription, la carte d'étudiant coûte 10 €.",
        licence: { montant: 665, devise: "EUR", periode: "an" },
        master: { montant: 665, devise: "EUR", periode: "an" },
        doctorat: { montant: 665, devise: "EUR", periode: "an" }
      },
      exoneration: {
        politique: "systematique",
        detail: SANS_FRAIS,
        source: "https://www.uni-leipzig.de/studium/im-studium/studienorganisation/studiengebuehren",
        verifieLe: LE
      },
      admission: {
        procedure: "Avec un diplôme étranger ou un diplôme de Studienkolleg allemand, vous candidatez uniquement en ligne par uni-assist, sur le portail My assist, avec les documents d'origine et leur traduction certifiée en allemand ou en anglais. Deux formations au plus, dont une seule sans sélection.",
        conditions: `${HZB} Studienkolleg de Saxe, à Leipzig : candidature par uni-assist pour une université saxonne, jusqu'au 15 juin pour l'hiver ; allemand B2 exigé ; test d'entrée obligatoire ; 850 € par semestre à partir de l'hiver 2026-2027. Le TestAS peut améliorer votre note d'accès jusqu'à 0,4 point.`,
        calendrier: `Par uni-assist : du début avril au 15 juillet pour les licences sélectives, du début avril au 1er septembre pour les licences sans sélection. ${HIVER}`,
        langue: "DSH 2 ou équivalent, par exemple TestDaF 4 dans chaque épreuve, DSD II, Goethe C2, telc C1 Hochschule. Pour candidater, un certificat de niveau B2 suffit dans presque toutes les filières ; le niveau exigé se prouve au plus tard à l'inscription.",
        fraisDossier: UNI_ASSIST_FRAIS,
        sources: [
          "https://www.uni-leipzig.de/international/studieren-an-der-universitaet-leipzig/bewerbung-und-studienvorbereitung/bachelor-diplom-staatsexamen",
          "https://www.uni-leipzig.de/studium/vor-dem-studium/bewerbung/bewerbungsfristen",
          "https://www.stksachs.uni-leipzig.de/faq",
          "https://www.uni-leipzig.de/universitaet/profil/zahlen-und-fakten",
          UNI_ASSIST_FRAIS_URL
        ],
        verifieLe: LE
      }
    }
  },

  // ---------------- Sarre, Basse-Saxe, Rhénanie-Palatinat ----------------

  {
    id: "universitat-des-saarlandes-sarrebruck",
    data: {
      name: "Université de la Sarre",
      city: "Sarrebruck",
      province: "Sarre",
      country: "Allemagne",
      image: "sarrebruck-bord-de-la-sarre.jpg",
      flag: "de.svg",
      ranking: "#588 mondial ex æquo (QS 2027)",
      officialWebsite: "https://www.uni-saarland.de",
      applicationPortalUrl: "https://www.uni-saarland.de/en/study/application/first-degree/direct.html",
      fields: ["Informatique", "Droit", "Lettres", "Sciences", "Médecine", "Commerce", "Ingénierie"],
      description: "Fondée en novembre 1948 comme université bilingue, à la frontière française. Environ 16 300 étudiants, dont 24 % d'internationaux, et de nombreuses licences en double diplôme franco-allemand.",
      langueEnseignement: "Allemand ; licences franco-allemandes en double diplôme ; programmes en anglais",
      fraisScolarite: {
        source: "https://www.uni-saarland.de/en/study/organisation/fees/semester-fee.html",
        verifieLe: LE,
        note: "Pas de frais de scolarité pour un premier diplôme ; seuls les masters de formation continue sont payants. Contribution semestrielle de l'hiver 2026-2027 : 412,30 €, soit Studierendenwerk 121,20 €, assurance 1,30 €, AStA 13 €, frais administratifs 50 €, ticket de transport national 226,80 €. Soit 825 € par an, en licence, master et doctorat.",
        licence: { montant: 825, devise: "EUR", periode: "an" },
        master: { montant: 825, devise: "EUR", periode: "an" },
        doctorat: { montant: 825, devise: "EUR", periode: "an" }
      },
      exoneration: {
        politique: "systematique",
        detail: SANS_FRAIS,
        source: "https://www.uni-saarland.de/en/global/guidance/information/costs.html",
        verifieLe: LE
      },
      admission: {
        procedure: "Deux étapes. Vous demandez d'abord à uni-assist une VPD, l'examen de vos diplômes étrangers. Une fois la VPD reçue, vous candidatez sur SIM, le portail de l'université, pour une formation ou pour un cours préparatoire d'allemand.",
        conditions: `${HZB} Sans accès direct, l'université propose son année préparatoire internationale, le VSI, en lettres, en économie ou en sciences et techniques : aucune connaissance d'allemand n'est exigée pour candidater, le programme comprend les cours d'allemand. Candidature après la VPD, du début juin au 15 juillet pour l'hiver.`,
        calendrier: `Pour la rentrée d'octobre 2026 : 15 juillet 2026 pour les filières à capacité limitée ; filières libres jusqu'à fin septembre, mais fin août 2026 si vous avez besoin d'un visa. ${HIVER}`,
        langue: "DSH 2 ou 3, ou TestDaF avec 4 ou 5 dans toutes les épreuves, Goethe C2. Licence franco-allemande avec Metz : français B2 et allemand B2 à C1.",
        fraisDossier: `L'université ne demande pas de frais de dossier ; la VPD est payante. ${UNI_ASSIST_FRAIS}`,
        sources: [
          "https://www.uni-saarland.de/en/studies/international/further-info/applying-via-uni-assist.html",
          "https://www.uni-saarland.de/en/study/application/deadlines-winter.html",
          "https://www.uni-saarland.de/en/studies/international/further-info/german-language-proficiency.html",
          "https://www.uni-saarland.de/en/studies/international/other-study-programmes/preparatory-courses/vsi.html",
          "https://www.uni-saarland.de/en/study/programmes/international/france.html",
          UNI_ASSIST_FRAIS_URL
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "georg-august-universitat-gottingen-gottingen",
    data: {
      name: "Université de Göttingen",
      city: "Göttingen",
      province: "Basse-Saxe",
      country: "Allemagne",
      image: "gottingen-ancien-hotel-de-ville.jpg",
      flag: "de.svg",
      ranking: "#261 mondial ex æquo (QS 2027)",
      officialWebsite: "https://www.uni-goettingen.de",
      applicationPortalUrl: "https://immatrikulation.zvw.uni-goettingen.de/h1/pages/cs/sys/portal/hisinoneStartPage.faces?page=4&chco=y&noDBAction=y&init=y",
      fields: ["Sciences", "Médecine", "Lettres", "Sciences sociales", "Droit", "Agriculture", "Informatique"],
      description: "Université de recherche fondée en 1737, avec 13 facultés couvrant presque toutes les disciplines, médecine comprise, sauf les sciences de l'ingénieur.",
      langueEnseignement: "Allemand ; masters en anglais",
      fraisScolarite: {
        source: "https://www.uni-goettingen.de/de/40054.html",
        verifieLe: LE,
        note: "Pas de frais de scolarité. Contribution semestrielle de l'hiver 2026-2027 : 484,18 €, dont frais administratifs 75 €, Studierendenwerk 157 € et part du corps étudiant avec le ticket de transport national. Soit 968 € par an, en licence, master et doctorat. Frais de longue durée : 500 € par semestre une fois le crédit d'études épuisé.",
        licence: { montant: 968, devise: "EUR", periode: "an" },
        master: { montant: 968, devise: "EUR", periode: "an" },
        doctorat: { montant: 968, devise: "EUR", periode: "an" }
      },
      exoneration: {
        politique: "systematique",
        detail: `${SANS_FRAIS} Les boursiers financés sur fonds publics allemands paient une contribution réduite, 409,18 €.`,
        source: "https://www.uni-goettingen.de/de/40054.html",
        verifieLe: LE
      },
      admission: {
        procedure: "Candidature directe en ligne sur le portail de l'université, sans uni-assist : inscription, formulaire, puis dépôt des pièces scannées dans l'espace de téléversement. Aucun envoi postal : les documents envoyés par courrier ne sont pas traités.",
        conditions: `${HZB} L'université n'a pas de Studienkolleg : elle vous inscrit au test d'entrée du Studienkolleg de Basse-Saxe, à Hanovre, après une candidature à Göttingen pour la filière visée.`,
        calendrier: `Candidats hors Union européenne : du 1er mars au 30 avril pour les licences à capacité limitée et pour le Studienkolleg, du 1er mars au 30 septembre pour les licences libres. Ces dates sont bien plus précoces que pour les candidats européens. ${HIVER}`,
        langue: "Allemand A1 au moins pour candidater ; à l'inscription, DSH 2 ou équivalent, DSH 3 en psychologie. La DSH peut se passer à Göttingen.",
        fraisDossier: "65 € par semestre de candidature pour l'examen de votre diplôme étranger, à virer au plus tard à la date limite.",
        sources: [
          "https://www.uni-goettingen.de/en/51427.html",
          "https://www.uni-goettingen.de/en/640133.html",
          "https://www.uni-goettingen.de/en/language+requirements+for+international+prospective+students/47777.html",
          "https://www.uni-goettingen.de/en/639711.html",
          "https://www.uni-goettingen.de/en/text/53162.html"
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "johannes-gutenberg-universitat-mainz-mayence",
    data: {
      name: "Université Johannes-Gutenberg de Mayence",
      city: "Mayence",
      province: "Rhénanie-Palatinat",
      country: "Allemagne",
      image: "mayence-cathedrale.jpg",
      flag: "de.svg",
      ranking: "#500 mondial ex æquo (QS 2027)",
      officialWebsite: "https://www.uni-mainz.de",
      applicationPortalUrl: "https://jogustine.uni-mainz.de",
      fields: ["Sciences", "Médecine", "Lettres", "Droit", "Commerce", "Sciences sociales"],
      description: "Université ouverte en 1477, rouverte en 1946 à l'initiative de l'administration française. Licences binationales avec l'université Bourgogne Europe, à Dijon.",
      langueEnseignement: "Allemand ; licences binationales franco-allemandes",
      fraisScolarite: {
        source: "https://www.studium.uni-mainz.de/im-studium/studium-organisieren/rueckmeldung/",
        verifieLe: LE,
        note: "Un premier diplôme est sans frais de scolarité. Contribution semestrielle de l'hiver 2026-2027 à Mayence : 366,90 € ; 389,80 € à Germersheim, 378,80 € sur le campus médical de Trèves. Montant retenu : 734 € par an à Mayence, en licence, master et doctorat.",
        licence: { montant: 734, devise: "EUR", periode: "an" },
        master: { montant: 734, devise: "EUR", periode: "an" },
        doctorat: { montant: 734, devise: "EUR", periode: "an" }
      },
      exoneration: {
        politique: "systematique",
        detail: SANS_FRAIS,
        source: "https://www.studium.uni-mainz.de/en/starting-your-studies/starting-your-studies-as-an-international-student/degree-seeking/",
        verifieLe: LE
      },
      admission: {
        procedure: "Deux étapes, sans uni-assist. Vous faites d'abord reconnaître vos diplômes étrangers par l'université elle-même, sur sa plateforme JOGU-StINe ; la demande est possible toute l'année. Avec l'attestation de reconnaissance, vous candidatez ensuite sur la même plateforme.",
        conditions: `${HZB} Studienkolleg propre à l'université, l'ISSK, sans frais de scolarité : candidature de mi-mars au 15 mai pour l'hiver, avec l'attestation de reconnaissance de l'université.`,
        calendrier: `Licences sélectives : de la mi-mai au 15 juillet pour le semestre d'hiver. Faites reconnaître votre diplôme bien avant. ${HIVER}`,
        langue: "DSH 2 dans la plupart des filières, ou TestDaF avec 4 dans chaque épreuve. Licences binationales avec Dijon : français B2 ou DELF B2.",
        fraisDossier: "75 € pour la reconnaissance de vos diplômes étrangers, demandée sur JOGU-StINe, depuis le 1er mai 2026, contre 60 € auparavant.",
        sources: [
          "https://www.studium.uni-mainz.de/en/your-application/applying-with-international-certificates/recognition/",
          "https://www.studium.uni-mainz.de/wp-content/uploads/sites/12/2024/02/2026_03_Hinweisblatt_Gebuehrenerhebung.pdf",
          "https://www.studium.uni-mainz.de/en/your-application/applying-with-international-certificates/applying-as-an-international-student/selective-single-subject-international",
          "https://www.studium.uni-mainz.de/en/your-application/applying-with-international-certificates/studienkolleg/",
          "https://www.studium.uni-mainz.de/en/your-application/applying-with-international-certificates/language-proficiency/",
          "https://issk-en.uni-mainz.de/preparatory-college-studienkolleg/"
        ],
        verifieLe: LE
      }
    }
  }

];

// ---------------- Les trois fiches existantes : admission ajoutée ----------------
// `attendu` porte l'état lu dans l'export du 2026-09-24 : les champs
// ajoutés sont ABSENTS (undefined), et la note de Humboldt est recopiée
// entière. Si quelqu'un est passé avant, le lot bloque au lieu d'écraser.

const HU_FRAIS_AVANT = {
  source: "https://www.hu-berlin.de/fileadmin/Dokumentenpool/Studium/Sonstiges/Semesterbeitraege_und_gebuehren_2026_WiSe.pdf",
  verifieLe: "2026-09-13",
  note: "AUCUN droit de scolarite : le Land de Berlin n'en facture a personne, quelle que soit la nationalite. Il reste la seule contribution de semestre, document officiel du 24.06.2026 pour le semestre d'hiver 2026-27 : frais de semestre 50 EUR, contribution a la Studierendenschaft 12 EUR, contribution au Studierendenwerk 85 EUR, Deutschlandsemesterticket 234,80 EUR, soit 381,80 EUR par semestre et 763,60 EUR par an. Plus de la moitie de cette somme (234,80 EUR) est un abonnement de transport valable dans toute l'Allemagne pendant six mois, pas une taxe. Penalite de retard eventuelle : 19,94 EUR. Meme montant en licence, master et doctorat.",
  licence: { montant: 764, devise: "EUR", periode: "an" },
  master: { montant: 764, devise: "EUR", periode: "an" },
  doctorat: { montant: 764, devise: "EUR", periode: "an" }
};

export const PATCHES = [
  {
    collection: "universities",
    id: "humboldt-universitat-zu-berlin-berlin",
    motif: "fiche complète : démarche des candidats à diplôme étranger (uni-assist, dates 2026-2027, allemand), Land, langue, et note de frais réécrite sans capitales ni fautes d'accent, montant inchangé, relus au navigateur le 2026-09-24",
    attendu: {
      province: undefined,
      langueEnseignement: undefined,
      admission: undefined,
      fraisScolarite: HU_FRAIS_AVANT
    },
    champs: {
      province: "Berlin",
      langueEnseignement: "Allemand ; quelques masters en anglais",
      fraisScolarite: {
        source: "https://www.hu-berlin.de/fileadmin/Dokumentenpool/Studium/Sonstiges/Semesterbeitraege_und_gebuehren_2026_WiSe.pdf",
        verifieLe: LE,
        note: "Pas de frais de scolarité à Berlin, quelle que soit la nationalité. Reste la contribution semestrielle, document officiel du semestre d'hiver 2026-2027 : frais de semestre 50 €, corps étudiant 12 €, Studierendenwerk 85 €, Deutschlandsemesterticket et contribution solidaire 234,80 €, soit 381,80 € par semestre et 763,60 € par an. Plus de la moitié de cette somme est un abonnement de transport valable dans toute l'Allemagne pendant six mois. Pénalité de retard éventuelle : 19,94 €. Même montant en licence, master et doctorat.",
        licence: { montant: 764, devise: "EUR", periode: "an" },
        master: { montant: 764, devise: "EUR", periode: "an" },
        doctorat: { montant: 764, devise: "EUR", periode: "an" }
      },
      admission: {
        procedure: "Avec un diplôme d'accès obtenu hors d'Allemagne, toute la candidature passe par uni-assist : vous remplissez la demande en ligne sur My assist et y déposez tous les documents en PDF, originaux scannés ou copies certifiées, avec une traduction officielle s'ils ne sont ni en allemand ni en anglais. Lisez les consignes d'uni-assist propres à votre pays.",
        conditions: `${HZB} Studienkolleg : il est commun avec l'Université libre de Berlin, qui en publie les dates et la procédure.`,
        calendrier: `Pour la rentrée d'octobre 2026, par uni-assist : du 1er juin au 15 juillet 2026, pour les licences sélectives comme pour les licences libres. Pour l'été 2027 : du 1er décembre 2026 au 15 janvier 2027. ${HIVER}`,
        langue: "Pour candidater, allemand de niveau C1 : Goethe C1, telc C1, telc C1 Hochschule, DSH 1 ou TestDaF avec au moins 3 partout ; une attestation de cours ne suffit pas. Avant l'inscription, l'université vous convoque à la DSH, sauf si vous avez déjà TestDaF avec 4 partout, telc C1 Hochschule avec « gut », Goethe C2 ou DSH 2.",
        fraisDossier: UNI_ASSIST_FRAIS,
        sources: [
          "https://www.hu-berlin.de/studium/vor-dem-studium/bewerben/internationale-studierende",
          "https://www.hu-berlin.de/studium/vor-dem-studium/bewerben/fristen-termine",
          "https://www.hu-berlin.de/studium/vor-dem-studium/bewerben/internationale-studierende/grundstaendige-studiengaenge",
          UNI_ASSIST_FRAIS_URL
        ],
        verifieLe: LE
      }
    }
  },
  {
    collection: "universities",
    id: "leibniz-universitat-hannover-hannover",
    motif: "fiche complète : démarche des candidats à diplôme étranger (VPD puis portail, dates, allemand, Studienkolleg de Basse-Saxe), Land et langue, relus au navigateur le 2026-09-24",
    attendu: {
      province: undefined,
      langueEnseignement: undefined,
      admission: undefined
    },
    champs: {
      province: "Basse-Saxe",
      langueEnseignement: "Allemand ; quelques masters en anglais",
      admission: {
        procedure: "Deux étapes. Vous demandez d'abord à uni-assist une VPD, l'examen de vos diplômes étrangers, 4 à 8 semaines avant l'ouverture des candidatures. Vous candidatez ensuite en ligne sur le portail de l'université, qui a deux entrées : filières sélectives et filières libres.",
        conditions: `${HZB} Le Studienkolleg de Basse-Saxe est installé à l'université : candidature par le portail de l'université, du 1er juin au 15 juillet pour l'hiver ; une candidature directe au Studienkolleg est impossible.`,
        calendrier: `Semestre d'hiver : du 1er juin au 15 juillet pour les filières sélectives ; au semestre d'été, seules les entrées en cours de cursus sont possibles. ${HIVER}`,
        langue: "Allemand B1 pour candidater à une licence, C1 pour s'inscrire : DSH 2, TestDaF avec 4 dans chaque épreuve, DSD II, Goethe C2, telc C1 Hochschule.",
        fraisDossier: `L'université ne demande pas de frais de dossier ; la VPD est payante. ${UNI_ASSIST_FRAIS}`,
        sources: [
          "https://www.uni-hannover.de/studium/vor-dem-studium/bewerbung-zulassung",
          "https://www.uni-hannover.de/de/studium/vor-dem-studium/bewerbung-zulassung/voraussetzungen-zum-studium/sprachnachweise",
          "https://www.uni-hannover.de/de/studium/vor-dem-studium/bewerbung-zulassung/voraussetzungen-zum-studium/studienkolleg",
          UNI_ASSIST_FRAIS_URL
        ],
        verifieLe: LE
      }
    }
  },
  {
    collection: "universities",
    id: "universitat-hamburg-hamburg",
    motif: "fiche complète : démarche des candidats hors UE (reconnaissance gratuite puis candidature sur le portail, dates, allemand), Land et langue, relus au navigateur le 2026-09-24",
    attendu: {
      province: undefined,
      langueEnseignement: undefined,
      admission: undefined
    },
    champs: {
      province: "Hambourg",
      langueEnseignement: "Allemand ; masters internationaux en anglais",
      admission: {
        procedure: "Deux étapes, sans uni-assist et sans papier. Vous faites d'abord reconnaître gratuitement votre diplôme étranger sur le portail de candidature de l'université, puis vous candidatez sur ce même portail. Les candidats hors UE sont classés selon un barème à points : la note convertie de votre diplôme, avec des points en plus pour un très bon niveau de langue ou une préparation aux études.",
        conditions: `${HZB} La reconnaissance obtenue à Hambourg ne vaut que pour l'université de Hambourg : elle ne sert ni pour le Studienkolleg de Hambourg ni pour une autre université.`,
        calendrier: `Reconnaissance du diplôme pour un semestre d'hiver : du 15 octobre au 31 mars, soit bien avant la candidature. Candidature en licence : du 1er juin au 15 juillet pour l'hiver, du 1er décembre au 15 janvier pour l'été. Une fois admis, vous avez en général 7 jours pour vous inscrire. ${HIVER}`,
        langue: "Preuve d'allemand exigée au plus tard à l'inscription, sans report possible : le niveau DSH 2 suffit pour étudier à l'université de Hambourg.",
        fraisDossier: "Candidature et reconnaissance du diplôme gratuites ; seules les traductions certifiées sont à votre charge.",
        sources: [
          "https://www.uni-hamburg.de/en/campuscenter/bewerbung/international/studium-mit-abschluss.html",
          "https://www.uni-hamburg.de/en/campuscenter/bewerbung/international/studium-mit-abschluss/anerkennung-auslaendischer-schulbildung.html",
          "https://www.uni-hamburg.de/en/campuscenter/bewerbung/fristen-termine.html",
          "https://www.uni-hamburg.de/en/campuscenter/bewerbung/international/studium-mit-abschluss/sprachkenntnisse/deutschkenntnisse.html"
        ],
        verifieLe: LE
      }
    }
  }
];

// Le lot refuse de se charger si une photo déclarée n'existe pas
// (incident du lot 35).
const manquants = UNIVERSITIES
  .map((u) => u.data.image)
  .filter((f) => f && !existsSync(`assets/images/cities/${f.replace(/\.jpg$/, "")}-1600w.avif`))
  .map((f) => `cities/${f}`);

if (manquants.length) {
  throw new Error(`Lot 88 : ${manquants.length} photo(s) absente(s) — lancer d'abord \`node scripts\\add-lot88-photos.mjs\` :\n  ${manquants.join("\n  ")}`);
}
