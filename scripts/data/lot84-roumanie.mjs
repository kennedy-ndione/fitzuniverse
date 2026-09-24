// ============================================================
// FitzUniverse — Lot 84 : ROUMANIE, de 2 à 20 établissements
// Recherche du 2026-09-24, sources officielles uniquement : sites des
// universités et de leurs facultés, studyinromania.gov.ro (ministère
// roumain des Affaires étrangères), topuniversities.com pour le seul
// classement mondial.
//
// POURQUOI
// Charles, le 2026-09-24 : « on commence par le lot Roumanie : de 2 à
// environ 20 établissements, fiches complètes, même exigence que le
// Maroc et le Canada ». La Roumanie est vendue en préinscription avec
// deux établissements seulement, tous deux à Bucarest, et aucune fiche
// d'admission.
//
// MÉTHODE
// Six recherches parallèles (WebFetch) ont produit un brouillon ; TOUT
// ce qui entre ici a ensuite été RELU AU NAVIGATEUR INTÉGRÉ, depuis le
// réseau de Charles, le 2026-09-24 : pages HTML et PDF officiels (texte
// extrait dans la page par pdf.js). Plusieurs erreurs du brouillon ont
// été corrigées à la relecture, dont :
//   - UVT : la page des étrangers affichait un vieux calendrier dans la
//     copie de l'outil ; relue, elle porte le calendrier 2026 et le
//     barème en vigueur. Le PDF des frais 2026-2027 est un scan en lei
//     pour les Roumains et l'UE, pas pour les hors UE.
//   - UPT : quotas PAR PAYS, atteints en 2026 pour plusieurs pays
//     africains ; dit dans la fiche.
//   - UMFCD : les 500 € du barème sont l'examen de langue facultatif,
//     pas des frais de dossier.
//   - UMFST : 300 € de frais de dossier au barème voté par le Sénat,
//     500 € dans la méthodologie d'admission 2026 ; la fiche dit les
//     deux au lieu de choisir.
// Classement : QS 2027 lu sur topuniversities pour UBB, UAIC, UVT,
// UTCN, Transilvania et POLITEHNICA Bucarest. Les autres n'ont pas de
// rang QS 2027 affiché : la fiche porte un repère factuel.
//
// ÉCARTÉ, qualité d'abord :
//   - Université d'Oradea : son barème des étrangers 2026-2027 est un
//     scan sur cloud.uoradea.ro, dont le texte extrait mélange les
//     colonnes ; aucun montant ne peut être attribué sans doute. Et la
//     page des étrangers renvoie encore aux frais 2024-2025.
//
// PRIX RETENU : le tarif hors Union européenne de la PREMIÈRE année,
// en euros, pour l'année 2026-2027. Quand il varie selon la filière,
// la note donne la grille et dit quel montant est retenu et pourquoi.
// Aucune université du lot n'accorde d'exonération d'office aux
// étrangers payants ; seule l'UVT publie une bourse d'exonération. Les
// bourses de l'État roumain passent par une candidature séparée, et
// jamais en médecine, médecine dentaire ou pharmacie.
//
// LES DEUX FICHES EXISTANTES (POLITEHNICA Bucarest, Université de
// Bucarest) reçoivent en PATCHES leur bloc `admission`, leur langue et
// leur région ; POLITEHNICA passe à son rang QS 2027. Leurs frais,
// vérifiés le 2026-09-13, ne sont pas touchés.
//
// PHOTOS : scripts/add-lot84-photos.mjs, AVANT `lot.mjs analyser`.
// Le lot refuse de se charger si une photo manque.
// ============================================================

import { existsSync } from "node:fs";

const LE = "2026-09-24";

const BOURSES_ETAT = "https://studyinromania.gov.ro/mfa_2026-2027";

// Phrases communes, écrites une fois.
const LETTRE = "L'université examine votre dossier, puis le transmet au ministère roumain de l'Éducation : c'est lui qui délivre la lettre d'acceptation aux études. Avec elle, vous demandez le visa d'études à l'ambassade de Roumanie.";
const PREPA = "Pour un programme en roumain, sans certificat de roumain, vous suivez d'abord une année préparatoire de langue roumaine.";
const ETAT = "Seule autre voie : les bourses de l'État roumain, attribuées par le ministère des Affaires étrangères sur une candidature séparée, close le 31 mars 2026 pour 2026-2027. Elles portent sur la licence et le master en roumain et sur le doctorat, jamais sur la médecine, la médecine dentaire ou la pharmacie.";
const ETAT_SANTE = "Les bourses de l'État roumain, attribuées par le ministère des Affaires étrangères, excluent la médecine, la médecine dentaire et la pharmacie.";
const RENTREE_2027 = "Le calendrier de la rentrée 2027 n'est pas encore publié.";

export const UNIVERSITIES = [

  // ---------------- Cluj-Napoca ----------------

  {
    id: "universite-babes-bolyai-cluj-napoca",
    data: {
      name: "Université Babeș-Bolyai",
      city: "Cluj-Napoca",
      province: "Județ de Cluj",
      country: "Roumanie",
      image: "cluj-napoca-theatre-national.jpg",
      flag: "ro.svg",
      ranking: "#851-900 mondial (QS 2027)",
      officialWebsite: "https://www.ubbcluj.ro",
      applicationPortalUrl: "http://admission.cci.ubbcluj.ro/",
      fields: ["Sciences", "Informatique", "Commerce", "Droit", "Lettres", "Sciences sociales", "Ingénierie"],
      description: "Grande université publique de Cluj, héritière du collège jésuite fondé en 1581. Elle ouvre aux étudiants hors Union européenne des licences et des masters en roumain, en anglais, en allemand et quelques-uns en français.",
      langueEnseignement: "Roumain ; programmes en anglais, en allemand et en français selon la filière",
      fraisScolarite: {
        source: "https://cci.ubbcluj.ro/admission-international-students/candidates-from-other-countries/bachelor/",
        verifieLe: LE,
        note: "Tarifs publiés par le Centre de coopération internationale pour les candidats hors Union européenne, session 2026. Licence, par an : 2 200 € en théologie gréco-catholique, 2 500 € en économie et gestion, 2 700 € en physique, chimie, sciences politiques et journalisme, 3 000 € en études européennes, environnement et psychologie, 3 500 € en sociologie, 3 600 € en lettres, 5 000 € à la Faculté de Business et en sport, 7 000 € en mathématiques pour l'informatique, 9 000 € en informatique en allemand. Master : de 2 200 € à 9 000 €, avec 2 500 € en économie et en droit, 2 700 € en physique, chimie et sciences politiques, 3 000 € en études européennes, 9 000 € en mathématiques et informatique. Le règlement de l'université fixe ces tarifs par mois, payés sur neuf mois, ou dix quand le programme comporte un stage. Montant retenu : 2 700 €, le tarif le plus courant en licence comme en master.",
        licence: { montant: 2700, devise: "EUR", periode: "an" },
        master: { montant: 2700, devise: "EUR", periode: "an" }
      },
      exoneration: {
        politique: "aucune",
        detail: `Aucune réduction n'est publiée pour les étudiants hors Union européenne payants. ${ETAT}`,
        source: BOURSES_ETAT,
        verifieLe: LE
      },
      admission: {
        procedure: `Candidature en ligne sur la plateforme du Centre de coopération internationale : formulaire, paiement des frais de dossier, puis un seul fichier PDF avec toutes les pièces. ${LETTRE} Comptez environ 40 jours ouvrés de traitement. Une fois la lettre reçue, vous avez 21 jours pour payer les frais de scolarité.`,
        calendrier: `Pour la rentrée 2026, les candidatures en licence et en master étaient ouvertes du 1er avril au 31 juillet 2026. ${RENTREE_2027}`,
        langue: `Il faut un certificat de langue accepté par l'université, pour la langue du programme ; une attestation délivrée par votre lycée ne suffit pas. ${PREPA}`,
        fraisDossier: "50 €, non remboursables, payés sur la plateforme après avoir rempli le formulaire.",
        sources: [
          "https://cci.ubbcluj.ro/admission-international-students/candidates-from-other-countries/bachelor/",
          "https://cci.ubbcluj.ro/admission-international-students/candidates-from-other-countries/master-degree/",
          "https://www.ubbcluj.ro/en/despre/prezentare/istoric",
          "https://www.topuniversities.com/universities/babes-bolyai-university",
          BOURSES_ETAT
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "umf-iuliu-hatieganu-cluj-napoca",
    data: {
      name: "Université de médecine et de pharmacie Iuliu-Hațieganu",
      city: "Cluj-Napoca",
      province: "Județ de Cluj",
      country: "Roumanie",
      image: "cluj-napoca-vue-sur-les-toits.jpg",
      flag: "ro.svg",
      ranking: "Médecine en français, 200 places",
      officialWebsite: "https://umfcluj.ro",
      applicationPortalUrl: "https://admissions.umfcluj.ro/auth/login",
      fields: ["Médecine", "Sciences"],
      description: "Université publique de santé de Cluj, dont la faculté de médecine date de 1919. Environ 9 000 étudiants, dont 3 000 étrangers venus de plus de 60 pays, et trois langues d'études : roumain, français et anglais.",
      langueEnseignement: "Roumain, français et anglais",
      fraisScolarite: {
        source: "https://umfcluj.ro/en/study-programmes/admission-undergraduate-studies/admission-international-candidates/",
        verifieLe: LE,
        note: "Page d'admission des candidats internationaux, session 2026 : 10 000 € par an pour la médecine, la médecine dentaire et la pharmacie, en français comme en anglais. Frais de confirmation de la place : la moitié des frais de scolarité, non remboursable. Pour obtenir le visa d'études, un candidat hors Union européenne doit avoir payé toute la première année. Places 2026-2027 : médecine 200 en français et 200 en anglais, médecine dentaire 75 en français et 100 en anglais, pharmacie 80 en français, soins infirmiers 50 en anglais. Montant retenu : 10 000 €.",
        licence: { montant: 10000, devise: "EUR", periode: "an" }
      },
      exoneration: {
        politique: "aucune",
        detail: `Aucune réduction n'est publiée pour les candidats admis sur dossier, qui occupent des places payantes. ${ETAT_SANTE}`,
        source: "https://umfcluj.ro/en/study-programmes/admission-undergraduate-studies/admission-international-candidates/",
        verifieLe: LE
      },
      admission: {
        procedure: `Admission sur dossier, à partir de vos résultats scolaires et de vos réalisations personnelles, déposés sur la plateforme d'admission. Si vous êtes admis et que votre dossier est complet, le ministère roumain de l'Éducation délivre la lettre d'acceptation, indispensable pour le visa d'études de type D.`,
        calendrier: `Pour la rentrée 2026 : première session du 25 mars au 20 mai 2026, résultats le 3 juin ; seconde session du 21 mai au 16 juillet 2026, résultats le 28 juillet. ${RENTREE_2027}`,
        langue: "Pour les programmes en français ou en anglais, il faut un certificat de niveau B2 au moins, délivré par un organisme accrédité. Il n'est pas demandé si vous avez fait vos études secondaires en français ou en anglais.",
        fraisDossier: "300 €, non remboursables.",
        sources: [
          "https://umfcluj.ro/en/study-programmes/admission-undergraduate-studies/admission-international-candidates/",
          "https://umfcluj.ro/en/university/rectorate/international-students-department/admission-international-candidates/about-umf-iuliu-hatieganu/",
          BOURSES_ETAT
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "universite-technique-de-cluj-napoca",
    data: {
      name: "Université technique de Cluj-Napoca",
      city: "Cluj-Napoca",
      province: "Județ de Cluj",
      country: "Roumanie",
      image: "cluj-napoca-reflets-au-bord-de-l-eau.jpg",
      flag: "ro.svg",
      ranking: "#1401+ mondial (QS 2027)",
      officialWebsite: "https://www.utcluj.ro",
      applicationPortalUrl: "https://sis.utcluj.app/candidate-university-admission",
      fields: ["Ingénierie", "Informatique", "Architecture", "Sciences", "Lettres"],
      description: "Université technique publique de Cluj-Napoca, avec un second centre à Baia Mare, uni à elle en 2012. Ingénierie, informatique et architecture forment le cœur de son offre.",
      fraisScolarite: {
        source: "https://old.utcluj.ro/media/decisions/2026/06/02/Taxele_pentru_anul_universitar_2026-2027.pdf",
        verifieLe: LE,
        note: "Barème officiel 2026-2027 pour les étudiants hors Union européenne, par an : 2 700 € dans les facultés d'ingénierie de Cluj-Napoca et de Baia Mare, en licence comme en master ; 3 600 € en architecture ; 2 220 € en sciences humaines et économiques à Baia Mare ; 4 200 € en arts visuels. Année préparatoire de roumain : 2 430 €. La première année se paie en entier avant le 26 octobre 2026. Une demande de remboursement acceptée rend 80 % des frais. Montant retenu : 2 700 €, l'ingénierie.",
        licence: { montant: 2700, devise: "EUR", periode: "an" },
        master: { montant: 2700, devise: "EUR", periode: "an" }
      },
      exoneration: {
        politique: "aucune",
        detail: `Aucune réduction n'est publiée pour la première année des étudiants hors Union européenne. ${ETAT}`,
        source: BOURSES_ETAT,
        verifieLe: LE
      },
      admission: {
        procedure: `Vous payez les frais de dossier, puis déposez le dossier en ligne. La faculté évalue la candidature et donne un accord préalable. ${LETTRE} Traitement moyen à l'université : deux semaines. Un dossier incomplet n'est pas traité et ses frais ne sont pas rendus.`,
        calendrier: `Pour la rentrée 2026, candidatures en ligne du 23 mars au 28 juillet, réponses du ministère jusqu'au 14 août, inscription sur place du 21 septembre au 26 octobre 2026. ${RENTREE_2027}`,
        langue: `Certificat de langue exigé : niveau B1 pour le roumain, niveau B2 pour l'anglais, le français ou l'allemand, par exemple Cambridge, IELTS, TOEFL ou DELF. ${PREPA}`,
        fraisDossier: "100 €, non remboursables, à payer avant le dépôt du dossier.",
        sources: [
          "https://bri.utcluj.ro/en/bachelor_noneu.php",
          "https://bri.utcluj.ro/en/fees.php",
          "https://old.utcluj.ro/media/decisions/2026/06/02/Taxele_pentru_anul_universitar_2026-2027.pdf",
          "https://www.topuniversities.com/universities/technical-university-cluj-napoca",
          BOURSES_ETAT
        ],
        verifieLe: LE
      }
    }
  },

  // ---------------- Iași ----------------

  {
    id: "universite-alexandru-ioan-cuza-iasi",
    data: {
      name: "Université Alexandru-Ioan-Cuza de Iași",
      city: "Iași",
      province: "Județ de Iași",
      country: "Roumanie",
      image: "iasi-ensemble-palas-de-nuit.jpg",
      flag: "ro.svg",
      ranking: "#1201-1400 mondial (QS 2027)",
      officialWebsite: "https://www.uaic.ro",
      fields: ["Sciences", "Informatique", "Commerce", "Droit", "Lettres", "Sciences sociales"],
      description: "Fondée en octobre 1860, c'est la plus ancienne université de Roumanie. Quinze facultés, des sciences au droit, avec des licences en anglais et deux licences en français : géographie du tourisme, langue et littérature françaises.",
      langueEnseignement: "Roumain ; programmes en anglais et en français selon la filière",
      fraisScolarite: {
        source: "https://www.uaic.ro/en/international/international-students/full-degree-students/registration-for-non-eu-citizens/study-fees-2026-2027/",
        verifieLe: LE,
        note: "Barème 2026-2027 des étudiants hors Union européenne, par an. Licence : 2 070 € en histoire, philosophie et théologies ; 2 300 € en droit ; 2 400 € en lettres ; 2 500 € en physique ; 2 520 € en biologie, chimie et mathématiques ; 2 700 € en géographie et géologie ; 2 760 € en psychologie ; 3 000 € en sport ; 3 500 € en informatique et en économie. Master : les mêmes montants, sauf l'informatique à 3 800 €, l'économie à 4 000 € et la physique à 3 000 €. Doctorat : de 3 000 € à 4 200 €. Année préparatoire de roumain : de 2 400 € à 8 775 € selon la filière visée ensuite. Montant retenu : 2 520 € en licence et en master, 3 600 € en doctorat, la médiane des facultés.",
        licence: { montant: 2520, devise: "EUR", periode: "an" },
        master: { montant: 2520, devise: "EUR", periode: "an" },
        doctorat: { montant: 3600, devise: "EUR", periode: "an" }
      },
      exoneration: {
        politique: "aucune",
        detail: `Aucune réduction n'est publiée pour les étudiants hors Union européenne payants. ${ETAT}`,
        source: BOURSES_ETAT,
        verifieLe: LE
      },
      admission: {
        procedure: "Pas de plateforme : le dossier complet est envoyé au Bureau des relations internationales, avec la preuve du paiement des frais de dossier. Le bureau vérifie l'éligibilité, la commission de la faculté accepte ou refuse, puis le bureau demande la lettre d'acceptation au ministère roumain de l'Éducation. Une fois la lettre reçue, vous payez les frais de scolarité pour obtenir le visa d'études.",
        calendrier: `Pour la rentrée 2026, les dossiers de licence, de master et d'année préparatoire étaient reçus du 1er janvier au 15 juin. En doctorat, le dossier est conseillé avant le 1er juin. ${RENTREE_2027}`,
        langue: `Pour un programme en langue étrangère, vous êtes dispensé de l'examen de langue si la langue du programme est officielle dans votre pays, ou avec un certificat de niveau B2 reconnu, par exemple le DELF B2. ${PREPA}`,
        fraisDossier: "100 €, non remboursables, par virement à l'université.",
        sources: [
          "https://www.uaic.ro/wp-content/uploads/2025/12/Registration-for-NON-EU-citizens-2026-2027-2.pdf",
          "https://www.uaic.ro/en/studies/degrees-on-offer-in-english-and-french/",
          "https://www.uaic.ro/en/about-uaic/short-history/",
          "https://www.topuniversities.com/universities/alexandru-ioan-cuza-university",
          BOURSES_ETAT
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "umf-grigore-t-popa-iasi",
    data: {
      name: "Université de médecine et de pharmacie Grigore-T.-Popa",
      city: "Iași",
      province: "Județ de Iași",
      country: "Roumanie",
      image: "iasi-vue-nocturne-des-collines.jpg",
      flag: "ro.svg",
      ranking: "Médecine en français, 150 places",
      officialWebsite: "https://www.umfiasi.ro",
      applicationPortalUrl: "https://registration.umfiasi.ro/",
      fields: ["Médecine", "Sciences"],
      description: "Née en 1879 comme faculté de médecine de l'université de Iași, université depuis 1991. Elle enseigne la médecine et la médecine dentaire en français, et d'autres programmes en anglais.",
      langueEnseignement: "Roumain, français et anglais",
      fraisScolarite: {
        source: "https://www.umfiasi.ro/fr/admission/Pagini/Admission-2026.aspx",
        verifieLe: LE,
        note: "Page d'admission 2026 en français : médecine, 6 ans, 9 000 € par an, 150 places en français ; médecine dentaire, 6 ans, 9 000 € par an, 100 places en français. Les mêmes montants valent pour les filières en anglais. S'y ajoutent 230 lei de frais d'inscription en première année. Montant retenu : 9 000 €.",
        licence: { montant: 9000, devise: "EUR", periode: "an" }
      },
      exoneration: {
        politique: "aucune",
        detail: `Aucune réduction n'est publiée pour les places payantes des candidats internationaux. ${ETAT_SANTE}`,
        source: "https://www.umfiasi.ro/fr/admission/Pagini/Admission-2026.aspx",
        verifieLe: LE
      },
      admission: {
        procedure: "Candidature exclusivement en ligne, puis trois étapes : vérification du dossier, évaluation notée des résultats scolaires, entretien en ligne éliminatoire dans la langue du programme. L'université transmet ensuite les admis hors Union européenne au ministère roumain de l'Éducation pour la lettre d'acceptation.",
        calendrier: `Pour 2026-2027, une seule session, de mars à juillet 2026. La place non confirmée par paiement avant le 7 juillet 2026 était proposée à la liste d'attente. ${RENTREE_2027}`,
        langue: "Il faut un certificat de niveau B2 dans la langue choisie. Les citoyens des pays où le français est langue officielle, dont le Sénégal, la Côte d'Ivoire, le Cameroun, le Burkina Faso, le Bénin, le Togo, la Guinée et le Mali, en sont dispensés pour le français.",
        fraisDossier: "200 €, non remboursables.",
        sources: [
          "https://www.umfiasi.ro/fr/admission/Pagini/Admission-2026.aspx",
          "https://www.umfiasi.ro/ro/admitere/program-de-licenta/Documents/2026/valuta/Metodologie%20admitere%20candidati%20internationali%202026-2027.pdf",
          "https://www.umfiasi.ro/en/university/Pages/despre-umf-iasi.aspx",
          BOURSES_ETAT
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "universite-technique-gheorghe-asachi-iasi",
    data: {
      name: "Université technique Gheorghe-Asachi de Iași",
      city: "Iași",
      province: "Județ de Iași",
      country: "Roumanie",
      image: "iasi-tramway-du-centre.jpg",
      flag: "ro.svg",
      ranking: "Université technique, 13 500 étudiants",
      officialWebsite: "https://www.tuiasi.ro",
      applicationPortalUrl: "https://forms.gle/yG33oJ8w9c3rAUiAA",
      fields: ["Ingénierie", "Informatique", "Architecture", "Sciences"],
      description: "Université technique publique de Iași, qui fait remonter ses origines à l'école d'ingénieurs fondée en 1813 par Gheorghe Asachi. Plus de 13 500 étudiants, et une offre en anglais en génie civil, télécommunications, design industriel et plusieurs masters.",
      langueEnseignement: "Roumain ; licences et masters en anglais",
      fraisScolarite: {
        source: "https://study.tuiasi.ro/fees/",
        verifieLe: LE,
        note: "Frais 2026-2027 des étudiants hors Union européenne, programmes en anglais, par an. Licence : 3 000 € en génie civil, 3 500 € en technologies et systèmes de télécommunications, 2 430 € en design industriel. Master : 2 430 € à 4 000 €, dont 4 000 € en intelligence artificielle. Les frais des programmes en roumain ne sont pas publiés sur les pages lues. La première année se paie en entier. Montant retenu : 3 000 € en licence et 3 500 € en master, la médiane des programmes en anglais.",
        licence: { montant: 3000, devise: "EUR", periode: "an" },
        master: { montant: 3500, devise: "EUR", periode: "an" }
      },
      exoneration: {
        politique: "aucune",
        detail: `Aucune réduction n'est publiée pour les étudiants hors Union européenne. ${ETAT}`,
        source: BOURSES_ETAT,
        verifieLe: LE
      },
      admission: {
        procedure: `Vous réunissez les pièces et remplissez le formulaire de candidature en ligne. La faculté examine le dossier ; s'il est accepté, il part au ministère roumain de l'Éducation, qui délivre la lettre d'acceptation. Vous confirmez ensuite par courriel que vous vous inscrivez.`,
        calendrier: `Pour la rentrée 2026, les dossiers étaient reçus du 15 avril au 15 juillet 2026. ${RENTREE_2027}`,
        langue: `Pour un programme en anglais, certificat de niveau B2 au moins, TOEFL, IELTS ou Cambridge, ou test d'anglais à l'université ; dispense si l'anglais est langue officielle de votre pays ou après quatre ans d'études en anglais. ${PREPA}`,
        fraisDossier: "L'équivalent en lei de 80 €, non remboursables, par virement à l'université.",
        sources: [
          "https://study.tuiasi.ro/admissions/non-eu-students/",
          "https://study.tuiasi.ro/fees/",
          "https://international.tuiasi.ro/about-tuiasi/",
          BOURSES_ETAT
        ],
        verifieLe: LE
      }
    }
  },

  // ---------------- Timișoara ----------------

  {
    id: "universite-de-l-ouest-de-timisoara",
    data: {
      name: "Université de l'Ouest de Timișoara",
      city: "Timișoara",
      province: "Județ de Timiș",
      country: "Roumanie",
      image: "timisoara-immeubles-du-centre.jpg",
      flag: "ro.svg",
      ranking: "#1201-1400 mondial (QS 2027)",
      officialWebsite: "https://www.uvt.ro",
      applicationPortalUrl: "https://admiterenonue.uvt.ro/",
      fields: ["Commerce", "Droit", "Lettres", "Sciences", "Informatique", "Sciences sociales"],
      description: "Université publique de Timișoara, douze facultés. Pour les étudiants hors Union européenne, elle propose une licence de management en français, un master de gestion en français et de nombreux programmes en anglais.",
      langueEnseignement: "Roumain ; programmes en anglais, en français et en allemand selon la filière",
      fraisScolarite: {
        source: "https://ri.uvt.ro/en/foreign-students-eu-third-countries/",
        verifieLe: LE,
        note: "Guide 2026 des candidats hors Union européenne. Les tarifs sont fixés par mois et multipliés par neuf. Licence et master : 1 980 € par an en lettres, psychologie, comptabilité et économie ; 2 430 € en sciences, mathématiques et sport ; 3 150 € en architecture ; 2 880 € en médecine ; 3 780 € en musique et arts ; 6 750 € en interprétation musicale et théâtre ; 8 550 € en cinéma ; 5 000 € pour le MBA roumano-britannique. Doctorat : 2 160 € dans les mêmes filières que les 1 980 €. Les frais se paient en entier, à la demande de visa ou à l'inscription, au montant et sur le compte indiqués dans la lettre d'acceptation. Montant retenu : 1 980 €, tarif de la majorité des facultés et du management en français.",
        licence: { montant: 1980, devise: "EUR", periode: "an" },
        master: { montant: 1980, devise: "EUR", periode: "an" },
        doctorat: { montant: 2160, devise: "EUR", periode: "an" }
      },
      exoneration: {
        politique: "possible_plafonnee",
        detail: "Chaque année, l'université accorde des bourses propres aux étudiants de pays à faibles revenus : exonération des frais de scolarité, logement gratuit à la cité universitaire ou aide mensuelle de 65 €, selon les cas. Il faut une moyenne d'admission d'au moins 8 sur 10, et la demande se fait sur la plateforme d'admission, avec lettre de motivation, CV et recommandation.",
        source: "https://admission.uvt.ro/guide-faq/",
        verifieLe: LE
      },
      admission: {
        procedure: `Candidature sur la plateforme d'admission des candidats hors Union européenne. Le service des relations internationales vérifie le dossier, la faculté donne son avis, puis le dossier part au ministère roumain de l'Éducation, qui délivre la lettre d'acceptation. Comptez près de deux mois : déposez tôt.`,
        calendrier: `Pour la rentrée 2026, candidatures du 20 janvier au 1er août 2026, en licence, en master et en année préparatoire. Les dossiers déposés avant mars partaient au ministère à partir de mars. Inscription possible jusqu'au 19 février 2027. ${RENTREE_2027}`,
        langue: `Pour un programme en langue étrangère, un test de langue est demandé, sauf si vous avez déjà étudié dans cette langue, si elle est officielle dans votre pays ou si vous avez un certificat reconnu. ${PREPA}`,
        fraisDossier: "100 €, non remboursables.",
        sources: [
          "https://ri.uvt.ro/en/foreign-students-eu-third-countries/",
          "https://admission.uvt.ro/guide-faq/",
          "https://uvt.ro/wp-content/uploads/sites/3/2026/08/Anexa-12.-Alte-taxe-anul-univ.-2026-2027.pdf",
          "https://www.topuniversities.com/universities/universitatea-de-vest-din-timisoara/west-university-timisoara"
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "umf-victor-babes-timisoara",
    data: {
      name: "Université de médecine et de pharmacie Victor-Babeș",
      city: "Timișoara",
      province: "Județ de Timiș",
      country: "Roumanie",
      image: "timisoara-cathedrale-metropolitaine.jpg",
      flag: "ro.svg",
      ranking: "Médecine et pharmacie en français",
      officialWebsite: "https://www.umft.ro",
      applicationPortalUrl: "https://admission.umft.ro/",
      fields: ["Médecine", "Sciences"],
      description: "Université publique de santé de Timișoara, née du décret royal du 30 décembre 1944. Elle enseigne la médecine et la pharmacie en français, et la médecine, la médecine dentaire et la pharmacie en anglais.",
      langueEnseignement: "Roumain, français et anglais",
      fraisScolarite: {
        source: "https://www.umft.ro/wp-content/uploads/2026/04/Fees-admission-type-III-International-2026-ue-and-non-ue_EN-24.04.2026.pdf",
        verifieLe: LE,
        note: "Frais de première année 2026-2027, admission des étrangers payants : 9 000 € par an en médecine, en roumain, en anglais ou en français, et en médecine dentaire ; 8 000 € en pharmacie, en anglais ou en français ; 4 000 € en soins infirmiers, kinésithérapie, technique et hygiène dentaires. Pour confirmer la place, vous payez les frais de confirmation et une avance de 50 % des frais de scolarité, non remboursable sauf refus de visa notamment ; le solde est dû avant l'inscription. Montant retenu : 9 000 €, la médecine.",
        licence: { montant: 9000, devise: "EUR", periode: "an" }
      },
      exoneration: {
        politique: "aucune",
        detail: `Aucune réduction n'est publiée pour les places payantes des étrangers. ${ETAT_SANTE}`,
        source: "https://www.umft.ro/wp-content/uploads/2026/04/Fees-admission-type-III-International-2026-ue-and-non-ue_EN-24.04.2026.pdf",
        verifieLe: LE
      },
      admission: {
        procedure: "Candidature en ligne. Le classement se fait sur la moyenne du baccalauréat, convertie dans le barème roumain, et selon l'ordre de vos choix de programmes. Le ministère roumain de l'Éducation délivre ensuite les lettres d'acceptation, en 30 jours ouvrés au plus après réception des dossiers complets.",
        calendrier: `Pour la rentrée 2026, session de juillet et session de septembre, organisées selon le calendrier publié par l'université. ${RENTREE_2027}`,
        langue: "Test de langue en ligne obligatoire et éliminatoire, sauf si vous venez d'un pays où la langue du programme est officielle et y avez étudié dans cette langue, ou avec un certificat de niveau B2 au moins : DELF, DALF ou TCF pour le français.",
        fraisDossier: "200 € de frais de dossier, 150 € pour le test de langue s'il vous concerne, 300 € pour confirmer la place, puis 100 lei d'inscription payés sur place.",
        sources: [
          "https://www.umft.ro/en/admission-type-iii-en-2026-non-ue/",
          "https://www.umft.ro/wp-content/uploads/2026/04/Fees-admission-type-III-International-2026-ue-and-non-ue_EN-24.04.2026.pdf",
          "https://www.umft.ro/wp-content/uploads/2026/07/METHODOLOGY-FOR-TYPE-3-ADMISSION-AND-ENROLMENT-OF-THIRD-COUNTRY-NATIONALS_2026_international-02.07.2026.pdf",
          "https://www.umft.ro/en/the-university/",
          BOURSES_ETAT
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "universite-politehnica-timisoara",
    data: {
      name: "Université Politehnica de Timișoara",
      city: "Timișoara",
      province: "Județ de Timiș",
      country: "Roumanie",
      image: "timisoara-piata-unirii.jpg",
      flag: "ro.svg",
      ranking: "Université technique fondée en 1920",
      officialWebsite: "https://www.upt.ro",
      applicationPortalUrl: "https://apply.upt.ro/",
      fields: ["Ingénierie", "Informatique", "Architecture", "Sciences sociales"],
      description: "Université technique publique de Timișoara, fondée en 1920 par décret du roi Ferdinand Ier. Licences et masters en anglais, notamment en informatique, télécommunications et génie mécanique.",
      langueEnseignement: "Roumain ; programmes en anglais",
      fraisScolarite: {
        source: "https://international.upt.ro/en/international-students/students-from-countries-outside-the-eu-eea-or-the-swiss-confederation/2026-2027/non-eu-admissions/",
        verifieLe: LE,
        note: "Frais 2026-2027 des étudiants hors Union européenne, par an : 2 430 € en licence et en master d'ingénierie et d'informatique ; 1 980 € en communication, sciences administratives et langues modernes appliquées, et pour l'année préparatoire de roumain ; 3 150 € en architecture ; 3 480 € en doctorat d'ingénierie, 4 440 € en doctorat d'architecture. Les frais se paient dans les 30 jours suivant la mise à disposition de la lettre d'acceptation. Remboursement partiel en cas de refus de visa : le ministère retient 5 %. Montant retenu : l'ingénierie.",
        licence: { montant: 2430, devise: "EUR", periode: "an" },
        master: { montant: 2430, devise: "EUR", periode: "an" },
        doctorat: { montant: 3480, devise: "EUR", periode: "an" }
      },
      exoneration: {
        politique: "aucune",
        detail: `Les candidats hors Union européenne sont inscrits sur des places payantes en devises, sans réduction publiée. ${ETAT}`,
        source: BOURSES_ETAT,
        verifieLe: LE
      },
      admission: {
        procedure: `Candidature sur la plateforme de l'université, ou en personne au rectorat. Le service international vérifie le dossier, la faculté donne un accord préalable, puis le ministère roumain de l'Éducation délivre la lettre d'acceptation. Attention aux quotas : l'université attribue un nombre limité de places par pays et par programme. En 2026, plusieurs pays, dont le Cameroun pour l'année préparatoire, avaient atteint leur quota dès juin ou juillet.`,
        calendrier: `Pour la rentrée 2026, dépôt du 1er mars au 31 août 2026, inscription du 28 septembre 2026 au 31 janvier 2027. Plusieurs licences en anglais étaient complètes avant la date limite : déposez tôt. ${RENTREE_2027}`,
        langue: `Pour un programme en anglais, il faut réussir un test reconnu, TOEFL, Cambridge, IELTS, LCCI, Trinity ISE ou ECL, ou le test du centre de langues de l'université ; dispense après au moins deux ans d'études en anglais. ${PREPA}`,
        fraisDossier: "100 €, non remboursables, en année préparatoire, licence et master ; pas de frais de dossier en doctorat.",
        sources: [
          "https://international.upt.ro/en/international-students/students-from-countries-outside-the-eu-eea-or-the-swiss-confederation/2026-2027/non-eu-admissions/",
          "https://www.upt.ro/istoric",
          BOURSES_ETAT
        ],
        verifieLe: LE
      }
    }
  },

  // ---------------- Bucarest ----------------

  {
    id: "umf-carol-davila-bucarest",
    data: {
      name: "Université de médecine et de pharmacie Carol-Davila",
      city: "Bucarest",
      province: "Municipe de Bucarest",
      country: "Roumanie",
      image: "bucarest-athenee-roumain.jpg",
      flag: "ro.svg",
      ranking: "Pharmacie en français, 45 places",
      officialWebsite: "https://umfcd.ro",
      fields: ["Médecine", "Sciences"],
      description: "Héritière de l'École nationale de médecine et de pharmacie fondée en 1857 par Carol Davila. Pour les étrangers, elle enseigne la pharmacie en français, la médecine et la médecine dentaire en anglais.",
      langueEnseignement: "Roumain ; pharmacie en français ; médecine et médecine dentaire en anglais",
      fraisScolarite: {
        source: "https://umfcd.ro/wp-content/uploads/2026/STUDENTI_INTERNATIONALI/ADMITERE_2026/FR/DOCUMENTE/ANEXE/Taxe_UMFCD_2026-2027_studenti_internationali_RO.pdf",
        verifieLe: LE,
        note: "Barème 2026-2027 des étudiants internationaux hors Union européenne, par an : médecine 10 000 €, médecine dentaire 10 000 €, en roumain ou en anglais ; pharmacie 8 500 €, en roumain ou en français. La confirmation de la place se fait en payant la moitié des frais de scolarité, et le visa exige le paiement intégral de l'année. Montant retenu : 10 000 €, la médecine. Pour la pharmacie en français, comptez 8 500 €.",
        licence: { montant: 10000, devise: "EUR", periode: "an" }
      },
      exoneration: {
        politique: "aucune",
        detail: `Aucune réduction n'est publiée pour les places payantes des étudiants internationaux. ${ETAT_SANTE}`,
        source: "https://umfcd.ro/wp-content/uploads/2026/STUDENTI_INTERNATIONALI/ADMITERE_2026/FR/DOCUMENTE/ANEXE/Taxe_UMFCD_2026-2027_studenti_internationali_RO.pdf",
        verifieLe: LE
      },
      admission: {
        procedure: "Pharmacie en français : concours sur dossier, les candidats étant classés par moyenne d'admission décroissante ; 45 places. Médecine et médecine dentaire en anglais : inscription en ligne, entretien en ligne en anglais, puis dossier complet. Le visa d'études est délivré sur la lettre d'acceptation du ministère roumain de l'Éducation et après paiement intégral des frais de l'année.",
        calendrier: `Pour la rentrée 2026, inscriptions du 1er avril au 13 juillet 2026, classement le 21 juillet, confirmation des places du 21 au 23 juillet, dépôt des dossiers physiques jusqu'au 18 septembre pour les programmes en français et en anglais. ${RENTREE_2027}`,
        langue: "Pour la pharmacie en français : certificat de niveau B2 au moins de moins de deux ans, DELF, DALF, TFI ou DFP ; ou attestation d'un lycée où l'enseignement se fait en français ; ou baccalauréat français. À défaut, examen de français à l'université, 500 € pour un candidat hors Union européenne.",
        fraisDossier: "Inscription au concours : 1 500 lei pour la pharmacie en français, 2 500 lei pour les programmes en anglais, non remboursables, par carte sur la plateforme.",
        sources: [
          "https://umfcd.ro/admitere-studenti-internationali-facultatea-de-farmacie-franceza-2026-2027/",
          "https://umfcd.ro/wp-content/uploads/2026/STUDENTI_INTERNATIONALI/ADMITERE_2026/FR/DOCUMENTE/METODOLOGII/Metodologie_FR_2026-2027_ROMANA.pdf",
          "https://umfcd.ro/wp-content/uploads/2026/STUDENTI_INTERNATIONALI/ADMITERE_2026/EN/DOCUMENTE/METODOLOGIE/Metodologie_EN_2026-2027%20-%20ROMANA.pdf",
          "https://umfcd.ro/wp-content/uploads/2026/STUDENTI_INTERNATIONALI/ADMITERE_2026/FR/DOCUMENTE/ANEXE/UMFCD_Calendar%20admitere_2026_RO-FR.pdf",
          "https://umfcd.ro/despre-umfcd/biroul-rectorului/istoric-umfcd/",
          BOURSES_ETAT
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "academie-d-etudes-economiques-bucarest",
    data: {
      name: "Académie d'études économiques de Bucarest",
      city: "Bucarest",
      province: "Municipe de Bucarest",
      country: "Roumanie",
      image: "bucarest-palais-du-parlement.jpg",
      flag: "ro.svg",
      ranking: "Université économique fondée en 1913",
      officialWebsite: "https://ase.ro",
      fields: ["Commerce", "Sciences sociales", "Informatique"],
      description: "Université publique d'économie et de gestion, créée par décret royal le 6 avril 1913. Elle propose une licence d'administration des affaires en français et un master d'entrepreneuriat en français.",
      langueEnseignement: "Roumain ; programmes en anglais, en français et en allemand",
      fraisScolarite: {
        source: "https://international.ase.ro/21/admission-for-noneu-citizen/",
        verifieLe: LE,
        note: "Pour 2026-2027, les candidats hors Union européenne paient 3 500 € par an en licence, plus 350 € de frais d'inscription, et 4 500 € par an en master, plus 450 €. Le Sénat fixe ces montants chaque année. Montant retenu : ces deux tarifs.",
        licence: { montant: 3500, devise: "EUR", periode: "an" },
        master: { montant: 4500, devise: "EUR", periode: "an" }
      },
      exoneration: {
        politique: "aucune",
        detail: `Aucune réduction n'est publiée pour les étudiants hors Union européenne. ${ETAT}`,
        source: BOURSES_ETAT,
        verifieLe: LE
      },
      admission: {
        procedure: "Depuis 2026-2027, tout le dossier se dépose sur la plateforme en ligne de l'université. Elle l'examine en 5 à 10 jours ouvrés et le transmet au ministère roumain de l'Éducation, qui délivre la lettre d'acceptation en 20 à 30 jours ouvrés. Vous confirmez ensuite en envoyant la preuve du paiement de la première année, puis demandez le visa d'études, au moins deux à trois mois avant la rentrée.",
        conditions: "Il faut avoir obtenu le baccalauréat depuis trois ans au plus, avec une moyenne équivalant à 8 sur 10 pour étudier en français, à 6 sur 10 pour étudier en anglais. Le diplôme doit porter l'apostille de La Haye ou le visa de l'ambassade de Roumanie.",
        calendrier: `Pour la rentrée 2026, dossiers reçus du 1er avril au 30 août 2026 en licence et du 1er mars au 29 août en master ; inscription des étudiants du 8 au 30 septembre 2026. ${RENTREE_2027}`,
        langue: `Pour étudier en français, en anglais ou en allemand sans quatre ans d'études antérieures dans cette langue, il faut l'un des certificats acceptés par l'université. ${PREPA}`,
        fraisDossier: "Frais d'inscription : 350 € en licence et 450 € en master, en plus des frais de scolarité.",
        sources: [
          "https://international.ase.ro/21/admission-for-noneu-citizen/",
          "https://international.ase.ro/21/admission-for-noneu-citizen-2/",
          "https://international.ase.ro/21/a-p-master/",
          "https://international.ase.ro/21/a-s-master/",
          "https://www.fabiz.ase.ro/faqs/",
          "https://ase.ro/en/university/about-ase/",
          BOURSES_ETAT
        ],
        verifieLe: LE
      }
    }
  },

  // ---------------- Craiova ----------------

  {
    id: "universite-de-craiova",
    data: {
      name: "Université de Craiova",
      city: "Craiova",
      province: "Județ de Dolj",
      country: "Roumanie",
      image: "craiova-parc-nicolae-romanescu.jpg",
      flag: "ro.svg",
      ranking: "Université publique fondée en 1947",
      officialWebsite: "https://www.ucv.ro",
      applicationPortalUrl: "https://evstud.ucv.ro",
      fields: ["Ingénierie", "Sciences", "Informatique", "Commerce", "Droit", "Lettres", "Agriculture"],
      description: "Université d'État créée par la loi du 25 avril 1947, avec des facultés à Craiova et à Drobeta-Turnu Severin. Quelques programmes sont enseignés en langue étrangère.",
      langueEnseignement: "Roumain ; quelques programmes en langue étrangère",
      fraisScolarite: {
        source: "https://www.ucv.ro/pdf/invatamant/management/regulamente/2026/Procedura_cetateni_straini_2026_cu_anexe_final.pdf",
        verifieLe: LE,
        note: "Procédure 2026 des étrangers hors Union européenne, frais valables pour 2026-2027, par an. Licence et master : 3 500 € en technique, agronomie, sciences, mathématiques et sport ; 3 000 € en sciences humaines et économie ; 4 500 € en musique et arts ; 7 000 € en interprétation musicale et théâtre ; 10 000 € en cinéma. Doctorat : 4 500 €. Année préparatoire de roumain : de 2 000 € à 9 000 € selon la filière. La première année se paie en entier dans les 15 jours suivant l'envoi de la lettre d'acceptation par courriel. Montant retenu : 3 500 €, les sciences et la technique.",
        licence: { montant: 3500, devise: "EUR", periode: "an" },
        master: { montant: 3500, devise: "EUR", periode: "an" },
        doctorat: { montant: 4500, devise: "EUR", periode: "an" }
      },
      exoneration: {
        politique: "aucune",
        detail: `Aucune réduction n'est prévue pour les étrangers payants ; les candidats aux bourses de l'État sont dispensés des frais d'inscription. ${ETAT}`,
        source: "https://www.ucv.ro/pdf/invatamant/management/regulamente/2026/Procedura_cetateni_straini_2026_cu_anexe_final.pdf",
        verifieLe: LE
      },
      admission: {
        procedure: `Candidature en ligne sur la plateforme EvStud, dans la section des étrangers hors Union européenne. Les candidats sont classés sur leurs résultats scolaires, puis la liste finale part au ministère roumain de l'Éducation, qui délivre la lettre d'acceptation. Inscription sur place avec les originaux et le visa d'études.`,
        calendrier: `Pour la rentrée 2026, licence et master : première session du 1er avril au 21 mai 2026, seconde du 8 juin au 20 juillet ; doctorat du 1er avril au 13 juillet. ${RENTREE_2027}`,
        langue: "Pour un programme en roumain, sans année préparatoire ni trois ans d'études en roumain, un test de roumain de niveau B1 est éliminatoire ; en cas d'échec, vous passez par l'année préparatoire.",
        fraisDossier: "1 000 lei, soit 200 €, non remboursables, à la caisse de l'université ou sur la plateforme.",
        sources: [
          "https://www.ucv.ro/pdf/invatamant/management/regulamente/2026/Procedura_cetateni_straini_2026_cu_anexe_final.pdf",
          "https://www.ucv.ro/despre/",
          BOURSES_ETAT
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "umf-craiova",
    data: {
      name: "Université de médecine et de pharmacie de Craiova",
      city: "Craiova",
      province: "Județ de Dolj",
      country: "Roumanie",
      image: "craiova-place-mihai-viteazul.jpg",
      flag: "ro.svg",
      ranking: "Université de santé créée en 1998",
      officialWebsite: "https://www.umfcv.ro",
      fields: ["Médecine", "Sciences"],
      description: "Université publique de santé, créée par la loi de 1998 à partir de la faculté de médecine ouverte à Craiova en 1970. Médecine et médecine dentaire sont aussi enseignées en anglais.",
      langueEnseignement: "Roumain ; médecine et médecine dentaire en anglais",
      fraisScolarite: {
        source: "https://www.umfcv.ro/en/admission-international-citizens-2026/admission-international-citizens-2026/english-teaching-modules-based-on-file-examination",
        verifieLe: LE,
        note: "Admission 2026, programmes en anglais, frais 2026-2027 : médecine 8 500 € par an, 30 places pour les étudiants hors Union européenne ; médecine dentaire 6 500 € par an. L'université précise que les frais peuvent changer en cours d'études, sur décision du Sénat. Dans les 5 jours suivant la lettre d'acceptation, il faut payer toute la première année pour obtenir le visa. Montant retenu : 8 500 €, la médecine.",
        licence: { montant: 8500, devise: "EUR", periode: "an" }
      },
      exoneration: {
        politique: "aucune",
        detail: `Aucune réduction n'est publiée pour les places payantes. ${ETAT_SANTE}`,
        source: "https://www.umfcv.ro/en/admission-international-citizens-2026/admission-international-citizens-2026/english-teaching-modules-based-on-file-examination",
        verifieLe: LE
      },
      admission: {
        procedure: "Admission sur dossier, déposé uniquement en ligne, avec un essai de 400 mots au plus. Après la confirmation des places, l'université envoie les dossiers au ministère roumain de l'Éducation pour obtenir les lettres d'acceptation. Dossier original à déposer ensuite au bureau des relations internationales.",
        calendrier: `Pour la rentrée 2026, dépôt en ligne du 25 mai au 15 juillet 2026, confirmation des places avant le 28 juillet, dossiers originaux du 14 au 30 septembre. ${RENTREE_2027}`,
        langue: "Pour les programmes en anglais, certificat d'anglais de niveau B2 au moins, de moins de deux ans ; dispense si l'anglais est langue officielle de votre pays, ou après des études secondaires en anglais.",
        fraisDossier: "300 €, payés en ligne sur la plateforme, non remboursables en cas d'erreur de catégorie ou de programme.",
        sources: [
          "https://www.umfcv.ro/en/admission-international-citizens-2026/admission-international-citizens-2026/english-teaching-modules-based-on-file-examination",
          "https://www.umfcv.ro/ro/despre-noi/informatii/istoric",
          BOURSES_ETAT
        ],
        verifieLe: LE
      }
    }
  },

  // ---------------- Brașov, Sibiu, Constanța, Târgu Mureș, Galați ----------------

  {
    id: "universite-transilvania-brasov",
    data: {
      name: "Université Transilvania de Brașov",
      city: "Brașov",
      province: "Județ de Brașov",
      country: "Roumanie",
      image: "brasov-vieille-ville-et-eglise-noire.jpg",
      flag: "ro.svg",
      ranking: "#1401+ mondial (QS 2027)",
      officialWebsite: "https://www.unitbv.ro/en/",
      applicationPortalUrl: "https://noneucandidates.unitbv.ro/",
      fields: ["Ingénierie", "Sciences", "Informatique", "Commerce", "Droit", "Lettres", "Médecine", "Agriculture"],
      description: "Université publique de Brașov, au pied des Carpates. Ses facultés vont de l'ingénierie mécanique et de la sylviculture au droit, à la musique et à la médecine, avec plusieurs licences et masters en anglais.",
      langueEnseignement: "Roumain ; programmes en anglais",
      fraisScolarite: {
        source: "https://www.unitbv.ro/en/international-students/tuition-fee.html",
        verifieLe: LE,
        note: "Barème 2026-2027 des étudiants hors Union européenne, temps plein, par an. Licence et master : 2 430 € en ingénierie et sport ; 2 500 € en mathématiques, informatique et psychologie ; 2 000 € en sciences humaines ; 4 000 € en économie ; 5 500 € en médecine ; 3 500 € en soins infirmiers, kinésithérapie et laboratoire ; 3 780 € en musique et arts. Doctorat : 2 610 € en ingénierie. Année préparatoire de roumain : 3 000 €. Les frais se paient en entier au début de l'année. Montant retenu : 2 430 €, l'ingénierie, qui regroupe la plupart des facultés.",
        licence: { montant: 2430, devise: "EUR", periode: "an" },
        master: { montant: 2430, devise: "EUR", periode: "an" },
        doctorat: { montant: 2610, devise: "EUR", periode: "an" }
      },
      exoneration: {
        politique: "aucune",
        detail: `Aucune réduction n'est publiée pour les étudiants hors Union européenne. ${ETAT}`,
        source: BOURSES_ETAT,
        verifieLe: LE
      },
      admission: {
        procedure: `Vous remplissez le formulaire en ligne et déposez les pièces en PDF sur la plateforme des candidats hors Union européenne. Un dossier incomplet est rejeté et les dossiers en retard ne sont pas acceptés. À l'inscription, vous présentez les originaux, la lettre d'acceptation du ministère roumain de l'Éducation et le passeport avec le visa d'études.`,
        calendrier: `Pour la rentrée 2026, candidatures en licence, en master et en année préparatoire du 20 mai au 14 juillet 2026, 13 h, heure roumaine. ${RENTREE_2027}`,
        langue: "Programme en anglais : TOEFL, IELTS 6,5 au moins, SAT, GRE ou Cambridge, ou quatre ans d'études en anglais. Programme en français : DALF, niveau B2. Programme en roumain : certificat de l'année préparatoire ou certificat de roumain de niveau B2 au moins.",
        fraisDossier: "75 € en licence et en année préparatoire, non remboursables quel que soit le résultat.",
        sources: [
          "https://www.unitbv.ro/en/prospective-students/admission/admission-information-for-non-eu-citizens.html",
          "https://www.unitbv.ro/en/international-students/tuition-fee.html",
          "https://www.unitbv.ro/en/international-students/registration-fee.html",
          "https://www.topuniversities.com/universities/transilvania-university-brasov",
          BOURSES_ETAT
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "universite-lucian-blaga-sibiu",
    data: {
      name: "Université Lucian-Blaga de Sibiu",
      city: "Sibiu",
      province: "Județ de Sibiu",
      country: "Roumanie",
      image: "sibiu-grande-place.jpg",
      flag: "ro.svg",
      ranking: "Médecine et médecine dentaire en anglais",
      officialWebsite: "https://www.ulbsibiu.ro/en/",
      applicationPortalUrl: "https://admitere.ulbsibiu.ro/",
      fields: ["Ingénierie", "Sciences", "Médecine", "Droit", "Commerce", "Lettres", "Agriculture"],
      description: "Université publique de Sibiu, en Transylvanie. Pour les étudiants hors Union européenne, la médecine et la médecine dentaire sont enseignées en anglais, à côté de nombreux programmes en roumain.",
      langueEnseignement: "Roumain ; médecine, médecine dentaire et quelques programmes en anglais",
      fraisScolarite: {
        source: "https://international.ulbsibiu.ro/admission/admission-for-non-eu/",
        verifieLe: LE,
        note: "Frais 2026-2027 des étudiants hors Union européenne, par an. Licence et master : 3 600 € en technique, ingénierie, agronomie, sciences, mathématiques, sport, sciences humaines, psychologie et économie ; 6 000 € en médecine en roumain ; 7 000 € en médecine en anglais ; 5 400 € en musique et arts ; 9 360 € en théâtre. Doctorat : 3 200 € en technique et sciences, 3 000 € en sciences humaines. L'année préparatoire de roumain coûte le prix du programme visé ensuite. Montant retenu : 3 600 €.",
        licence: { montant: 3600, devise: "EUR", periode: "an" },
        master: { montant: 3600, devise: "EUR", periode: "an" },
        doctorat: { montant: 3200, devise: "EUR", periode: "an" }
      },
      exoneration: {
        politique: "aucune",
        detail: `Aucune réduction n'est publiée pour les étudiants hors Union européenne. ${ETAT}`,
        source: BOURSES_ETAT,
        verifieLe: LE
      },
      admission: {
        procedure: `Candidature sur la plateforme d'admission de l'université, avec la demande de lettre d'acceptation. Après l'admission, l'université envoie les dossiers valides au ministère roumain de l'Éducation, qui délivre la lettre d'acceptation. Les diplômes doivent porter l'apostille de La Haye, ou être légalisés si votre pays n'y est pas partie.`,
        conditions: "Médecine et médecine dentaire en anglais : admission sur la moyenne du baccalauréat, qui doit comporter la biologie, la chimie, la physique ou les sciences naturelles, après un test d'anglais éliminatoire.",
        calendrier: `Médecine et médecine dentaire en anglais, rentrée 2026 : dépôt du 15 mai au 15 juillet 2026 pour les candidats hors Union européenne, puis une session de septembre du 7 au 13 septembre. ${RENTREE_2027}`,
        langue: `Médecine en anglais : niveau B2, par certificat ou par le test en ligne de l'université. ${PREPA}`,
        fraisDossier: "500 lei, et 800 lei en médecine.",
        sources: [
          "https://international.ulbsibiu.ro/admission/admission-for-non-eu/",
          "https://medicina.ulbsibiu.ro/wp-content/uploads/extras-regulament-medicina-engleza-admitere-2026-site.pdf",
          BOURSES_ETAT
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "universite-ovidius-constanta",
    data: {
      name: "Université Ovidius de Constanța",
      city: "Constanța",
      province: "Județ de Constanța",
      country: "Roumanie",
      image: "constanta-casino.jpg",
      flag: "ro.svg",
      ranking: "Université publique fondée en 1961",
      officialWebsite: "https://www.univ-ovidius.ro",
      applicationPortalUrl: "https://admitereonline.univ-ovidius.ro/",
      fields: ["Médecine", "Ingénierie", "Droit", "Lettres", "Sciences", "Informatique", "Commerce"],
      description: "Université publique de Constanța, au bord de la mer Noire, fondée en 1961 et devenue université pluridisciplinaire en 1990. Plus de 15 000 étudiants, dont environ 1 200 étrangers.",
      langueEnseignement: "Roumain ; médecine, médecine dentaire, informatique et quelques programmes en anglais",
      fraisScolarite: {
        source: "https://admission.univ-ovidius.ro/v2/wp-content/uploads/2026/04/Tuition-fees-2026-2027_Taxe-de-școlarizare-2026-2027-1.pdf",
        verifieLe: LE,
        note: "Barème 2026-2027 des candidats hors Union européenne. Licence : 2 500 € en droit et administration publique ; 2 700 € en génie mécanique et en lettres ; 3 000 € en génie civil et en sport ; 3 200 € en psychologie et sciences de l'éducation ; 3 500 € en histoire et sciences politiques ; 4 100 € en informatique ; 6 000 € en pharmacie ; 8 000 € en médecine et en médecine dentaire, en roumain comme en anglais. Master : de 2 500 € à 5 500 €. Doctorat : 4 000 € en mathématiques, 8 500 € en médecine. Année préparatoire de roumain : 2 700 €. Montant retenu : 2 700 €, au milieu de la grille des licences.",
        licence: { montant: 2700, devise: "EUR", periode: "an" }
      },
      exoneration: {
        politique: "aucune",
        detail: `Aucune réduction n'est publiée pour les étudiants hors Union européenne payants. ${ETAT}`,
        source: BOURSES_ETAT,
        verifieLe: LE
      },
      admission: {
        procedure: `Dépôt du dossier en ligne, dans la section des étudiants internationaux. Le département des étudiants internationaux valide les dossiers complets, la faculté classe les candidats sur leurs résultats, puis la liste part au ministère roumain de l'Éducation pour la lettre d'acceptation. Les admis s'inscrivent ensuite selon le calendrier de leur faculté.`,
        calendrier: `Pour la rentrée 2026, première session : dépôt du 20 avril au 15 juillet 2026, corrections les 16 et 17 juillet. Une session de septembre existe aussi. ${RENTREE_2027}`,
        langue: "Programme en anglais : certificat d'anglais de niveau B1 au moins, délivré par l'université après un examen en ligne ; dispense si l'anglais est langue officielle de votre pays et que vous y avez étudié. Programme en roumain : certificat de l'année préparatoire ou de roumain, niveau B1 au moins.",
        fraisDossier: "200 € d'évaluation du dossier, 200 € d'inscription au concours et 200 € d'immatriculation.",
        sources: [
          "https://admission.univ-ovidius.ro/v2/how-to-apply/bachelors-degree/",
          "https://admission.univ-ovidius.ro/v2/wp-content/uploads/2026/02/Admission-fees-2026-2027_Taxe-de-admitere-2026-2027.pdf",
          "https://admission.univ-ovidius.ro/v2/wp-content/uploads/2026/02/2026-Admission-deadlines_1st-session_July_Calendar-admitere-sesiunea-I_iulie-2026.pdf",
          "https://admission.univ-ovidius.ro/v2/",
          BOURSES_ETAT
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "umfst-george-emil-palade-targu-mures",
    data: {
      name: "Université George-Emil-Palade de Târgu Mureș",
      city: "Târgu Mureș",
      province: "Județ de Mureș",
      country: "Roumanie",
      image: "targu-mures-citadelle.jpg",
      flag: "ro.svg",
      ranking: "Médecine en français, 6 ans",
      officialWebsite: "https://umfst.ro",
      applicationPortalUrl: "https://admission.umfst.ro/",
      fields: ["Médecine", "Sciences", "Ingénierie", "Commerce", "Droit"],
      description: "Université publique de médecine, pharmacie, sciences et technologie, dont l'université de médecine ouverte en 1945 fut la première de la ville. Près de 13 000 étudiants dans sept facultés ; la médecine s'y enseigne en français et en anglais.",
      langueEnseignement: "Roumain ; médecine en français et en anglais",
      fraisScolarite: {
        source: "https://umfst.ro/medicina-engleza/fr/admitere-2026/admission-2026-2027-medicine-in-french/",
        verifieLe: LE,
        note: "Médecine en français : 8 000 € pour l'année 2026-2027 ; en cas d'admission, un acompte de 5 000 €, non remboursable, est déduit des frais de première année. Barème 2026-2027 voté par le Sénat : médecine et médecine dentaire en anglais, 10 000 € en première et deuxième années ; filières de santé en roumain pour les étrangers hors Union européenne, 6 000 € ; 2 200 € en sciences humaines et économie, 2 700 € en technique et sciences. Les cours sont donnés dans la langue du programme, mais la formation clinique se fait en roumain. Montant retenu : 8 000 €, la médecine en français.",
        licence: { montant: 8000, devise: "EUR", periode: "an" }
      },
      exoneration: {
        politique: "aucune",
        detail: `Aucune réduction n'est publiée pour les étudiants hors Union européenne. ${ETAT_SANTE}`,
        source: "https://umfst.ro/fileadmin/documente_oficiale/taxe/Taxe_UMFST_2026_2027.pdf",
        verifieLe: LE
      },
      admission: {
        procedure: "Médecine en français : formulaire en ligne sur la plateforme d'admission, entretien en ligne, puis évaluation du dossier et décision. Les dossiers sont traités au fil de leur arrivée et les places attribuées dans l'ordre. Seuls s'inscrivent les candidats dont les documents ont été validés par le ministère roumain de l'Éducation sous forme de lettre d'acceptation.",
        calendrier: `Médecine en français, rentrée 2026 : portail ouvert du 4 mai au 25 août 2026, entretiens en trois séances, du 15 au 19 juin, du 28 au 30 juillet et du 1er au 4 septembre, documents originaux jusqu'au 23 septembre. ${RENTREE_2027}`,
        langue: "Un certificat de langue correspondant à la langue du programme peut être joint, par exemple DELF ; les frais de dossier couvrent l'évaluation linguistique et un certificat de langue délivré par l'université.",
        fraisDossier: "300 € selon le barème 2026-2027 voté par le Sénat, mais 500 € selon la méthodologie d'admission 2026 : vérifiez le montant affiché sur la plateforme au moment du dépôt.",
        sources: [
          "https://umfst.ro/medicina-engleza/fr/admitere-2026/admission-2026-2027-medicine-in-french/",
          "https://umfst.ro/fileadmin/documente_oficiale/taxe/Taxe_UMFST_2026_2027.pdf",
          "https://www.umfst.ro/fileadmin/admitere/admission2026/Appendix_2-Admission_methodology_2026.pdf",
          "https://umfst.ro/en/university/about-us/",
          BOURSES_ETAT
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "universite-dunarea-de-jos-galati",
    data: {
      name: "Université Dunărea-de-Jos de Galați",
      city: "Galați",
      province: "Județ de Galați",
      country: "Roumanie",
      image: "galati-promenade-du-danube.jpg",
      flag: "ro.svg",
      ranking: "Université publique sur le Danube",
      officialWebsite: "https://www.ugal.ro",
      applicationPortalUrl: "https://inscriere-admitere.ugal.ro/",
      fields: ["Ingénierie", "Médecine", "Sciences", "Informatique", "Commerce", "Droit", "Lettres", "Agriculture"],
      description: "Université publique de Galați, sur le Danube. Ingénierie, architecture navale, sciences des aliments, économie, droit, lettres et médecine, avec une licence de médecine en anglais.",
      langueEnseignement: "Roumain ; médecine en anglais",
      fraisScolarite: {
        source: "https://admission.ugal.ro/educational-offer/fees/fees-international",
        verifieLe: LE,
        note: "Frais 2026-2027 des étudiants internationaux, par an : 2 700 € en ingénierie, architecture navale, sciences des aliments, automatique et informatique, sport, sciences et environnement, ingénierie et agronomie à Brăila ; 2 200 € en lettres, histoire, philosophie, théologie et droit ; 3 000 € en économie ; 4 200 € en musique et arts visuels, 7 500 € en théâtre ; 7 000 € en médecine et pharmacie. Année préparatoire de roumain : 1 980 €. Pour un étudiant hors Union européenne, le visa exige le paiement complet des frais. Montant retenu : 2 700 €, l'ingénierie.",
        licence: { montant: 2700, devise: "EUR", periode: "an" }
      },
      exoneration: {
        politique: "aucune",
        detail: `Aucune réduction n'est publiée pour les étudiants internationaux. ${ETAT}`,
        source: BOURSES_ETAT,
        verifieLe: LE
      },
      admission: {
        procedure: "Vous créez un compte sur la plateforme d'admission, remplissez le formulaire, déposez les pièces scannées et envoyez le dossier à la commission, ou le déposez sur place. Une fois admis et le visa obtenu, vous remettez les originaux au secrétariat de la faculté et signez le contrat d'études.",
        conditions: "Médecine en anglais : admission sur dossier. Attention, si la lettre d'acceptation ou le visa ne vous sont pas délivrés, vous perdez la place et les frais de scolarité ne sont pas remboursés.",
        calendrier: `Faculté de médecine et de pharmacie, juillet 2026 : inscription en ligne du 8 au 20 juillet, listes finales le 1er août, inscription du 3 au 6 août 2026. ${RENTREE_2027}`,
        langue: "Médecine en anglais : certificat international de niveau B1 au moins, de moins de deux ans, ou certificat de l'université ; dispense après des études secondaires en anglais, ou pour les citoyens des pays anglophones listés, dont le Cameroun et le Ghana.",
        fraisDossier: "250 € pour une licence ou un master, 50 € pour l'année préparatoire, non remboursables.",
        sources: [
          "https://admission.ugal.ro/educational-offer/fees/fees-international",
          "https://admission.ugal.ro/admission-procedure/faqs",
          "https://admission.ugal.ro/educational-offer/registration-period/registration-period-medicine",
          "https://www.admitere.ugal.ro/licenta/conditii-de-admitere/conditii-pentru-programul-de-studii-medicina-in-limba-engleza",
          BOURSES_ETAT
        ],
        verifieLe: LE
      }
    }
  }

];

// ---------------- Les deux fiches existantes : admission ajoutée ----------------
// `attendu` porte l'état lu dans l'export du 2026-09-24 : les champs
// ajoutés sont ABSENTS (undefined). Si quelqu'un est passé avant, le lot
// bloque au lieu d'écraser.

export const PATCHES = [
  {
    collection: "universities",
    id: "politehnica-bucuresti-bucarest",
    motif: "fiche complète : démarche des candidats hors UE (international.upb.ro, méthodologie 2026-2027) et rang QS 2027 lu sur topuniversities, relus au navigateur le 2026-09-24",
    attendu: {
      ranking: "Plus grande polytechnique publique roumaine",
      province: undefined,
      langueEnseignement: undefined,
      admission: undefined
    },
    champs: {
      ranking: "#1201-1400 mondial (QS 2027)",
      province: "Municipe de Bucarest",
      langueEnseignement: "Roumain ; programmes en anglais, en français et en allemand",
      admission: {
        procedure: "Candidature sur la plateforme de l'université, section des citoyens hors Union européenne. L'université transmet le dossier à la direction des relations internationales du ministère roumain de l'Éducation ; si la réponse est positive, la lettre d'acceptation est envoyée à l'université et à l'ambassade. Vous confirmez ensuite la place dans les 20 jours en payant d'avance les frais d'une année ; à défaut, la place passe au candidat suivant.",
        calendrier: "Inscriptions en ligne de février à juillet. L'université annonce au moins 30 jours de traitement par le ministère, et au moins 60 jours dans le détail de la procédure : déposez tôt.",
        langue: "Pour un programme en anglais, en français ou en allemand : certificat reconnu de niveau B1 au moins, TOEFL, IELTS ou Cambridge, DELF ou TCF, Goethe ; pour les ressortissants d'un pays où cette langue est officielle, les documents scolaires qui prouvent des études dans cette langue suffisent. Pour un programme en roumain, sans certificat, vous suivez d'abord l'année préparatoire de roumain, d'une durée de neuf mois.",
        sources: [
          "https://international.upb.ro/admission/applying/students-from-non-eu-countries",
          "https://upb.ro/wp-content/uploads/2026/02/Metodologie_scolarizare_studenti_state_terte_actualizata-pt-an-univ-2026-2027-1.pdf",
          "https://www.topuniversities.com/universities/national-university-science-technology-politehnica-bucharest"
        ],
        verifieLe: LE
      }
    }
  },
  {
    collection: "universities",
    id: "universite-de-bucarest-bucarest",
    motif: "fiche complète : démarche des candidats hors UE payants (international.unibuc.ro, admission 2026), relue au navigateur le 2026-09-24",
    attendu: {
      province: undefined,
      langueEnseignement: undefined,
      admission: undefined
    },
    champs: {
      province: "Municipe de Bucarest",
      langueEnseignement: "Roumain, anglais et français selon la filière",
      admission: {
        procedure: "Vous préparez les documents, en scans PDF couleur, et les déposez sur la plateforme d'admission. La commission évalue le dossier ; selon le programme, un examen ou un entretien peut être demandé. Les candidats retenus sont proposés au ministère roumain de l'Éducation, qui peut délivrer ou refuser la lettre d'acceptation, quelle que soit la décision de l'université. Vous demandez ensuite vous-même le visa d'études.",
        conditions: "Il faut un diplôme équivalant à une moyenne d'au moins 7 sur 10 dans le barème roumain. Les documents portent l'apostille de La Haye, ou sont surlégalisés si votre pays n'est pas partie à la convention.",
        calendrier: "Les candidatures de la rentrée 2026 sont closes. Le calendrier de la rentrée 2027 n'est pas encore publié.",
        langue: "Programmes en anglais : niveau B1. Pour un programme en roumain, sans certificat de roumain ni études antérieures en roumain, il faut d'abord suivre l'année préparatoire de langue roumaine.",
        fraisDossier: "100 €, non remboursables.",
        sources: [
          "https://international.unibuc.ro/home-3/admission-2026-2/study-cycles/"
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
  throw new Error(`Lot 84 : ${manquants.length} photo(s) absente(s) — lancer d'abord \`node scripts\\add-lot84-photos.mjs\` :\n  ${manquants.join("\n  ")}`);
}
