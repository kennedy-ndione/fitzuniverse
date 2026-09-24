// ============================================================
// FitzUniverse — Lot 76 : MAROC, de 5 à 19 établissements
// Recherche du 2026-09-24, sources officielles uniquement : sites des
// établissements, ministère de l'Enseignement supérieur (enssup.gov.ma),
// AMCI (amci.ma, répertoire des établissements 2025-2026),
// topuniversities.com pour le seul classement mondial.
//
// POURQUOI
// Charles, le 2026-09-24 : « on y va avec le Maroc et le Canada et
// qu'aucun détail ne soit omis ». Le Maroc n'avait que 5 établissements
// au catalogue alors qu'il est l'une des 9 destinations vendues en
// préinscription. Objectif 20, qualité d'abord : 14 retenus, soit 19.
// L'École Hassania des Travaux Publics a été ÉCARTÉE : absente du
// répertoire AMCI 2025-2026, et sa page « étudiants étrangers » date de
// 2017-2018. On n'ajoute pas un établissement dont on ne sait pas dire
// comment un étranger y entre.
//
// CONTRE-VÉRIFICATION INDÉPENDANTE (même jour, agent séparé, puis
// relecture au navigateur et relecture du lot par un second agent) :
// aucune affirmation contredite ; les pages illisibles pour l'agent ont
// été relues au navigateur (UIR, UEMF, UCD, répertoire AMCI). Restent
// lus d'une seule source : le décret de 2018 de l'UEMF (cité par le
// décret de 2022) et la faculté de médecine de l'USMBA (répertoire
// AMCI, qui la liste à Fès). Corrections intégrées ici :
//   - UEMF : 60 700 DH est le tarif licence du pôle sciences humaines et
//     sociales ET le tarif master ; la licence d'architecture (EMADU) est
//     à 55 700 DH. Doctorat : « Exemption totale des frais de scolarité :
//     pour tous les étudiants en doctorat » (page Bourses) — dite dans
//     l'exonération, PAS posée en montant 0 : la carte afficherait
//     « Gratuit » alors que l'inscription et les frais divers du doctorat
//     ne sont pas lus.
//   - Ministère : la formule exacte est « Places pédagogiques à titre
//     gracieux », au pluriel. Elle est reprise telle quelle.
//   - UIC : la seule grille lisible date de 2022-2023. Elle n'est PAS
//     posée en fraisScolarite (la carte afficherait un prix « vérifié »
//     de quatre ans) ; elle est dite, datée, dans admission.coutIndicatif.
//   - Langue d'enseignement : écrite seulement quand une page officielle
//     la donne (Ibn Tofail, UIR, UEMF, UM6SS). Pour les publiques, la
//     fiche cite la phrase de l'AMCI sur le français, « langue
//     véhiculaire » des établissements publics, et rappelle que la langue
//     peut varier selon la filière.
//
// CHAMPS NOUVEAUX (lus par universite.html, voir js/fiche-universite.js)
//   province          région administrative
//   langueEnseignement seulement si lue
//   reconnaissance    statut juridique : public, reconnu par l'État, PPP
//   admission         { procedure, conditions, calendrier, langue,
//                       fraisDossier, coutIndicatif, sources[], verifieLe }
//
// BOURSE AMCI : les dix établissements publics sont rattachés à la
// bourse du Gouvernement du Maroc (AMCI), déjà en base, au niveau
// LICENCE seulement : le répertoire AMCI 2025-2026, relu le 2026-09-24,
// liste des établissements de chacun d'eux, et c'est celui des
// bacheliers. Pour l'IAV, « Licence » désigne l'entrée après le bac
// (année préparatoire APESA) : le catalogue n'a pas de niveau plus juste. Master et doctorat existent par la même voie mais ne sont
// pas publiés établissement par établissement : on ne les invente pas.
// Même doctrine que les bourses de coopération tunisienne et algérienne
// (lot 37) : une bourse d'affectation ministérielle se rattache aux
// universités publiques du lot.
//
// PHOTOS : scripts/add-lot76-photos.mjs, AVANT `lot.mjs analyser`.
// Le lot refuse de se charger si une photo manque.
// ============================================================

import { existsSync } from "node:fs";

const LE = "2026-09-24";

const MINISTERE = "https://www.enssup.gov.ma/en/la-mobilite-etudiante";
const AMCI = "https://www.amci.ma/cooperation-academique";
const REPERTOIRE = "https://www.amci.ma/sites/default/files/2025-07/repertoire-des-etablissements-2025-2026.pdf";
const UH1_INTERNATIONAUX = "https://www.uh1.ac.ma/formation/cursus-academique/inscription-des-etudiants-internationaux/";

// Phrases communes aux dix établissements publics, écrites une fois.
const LANGUE_PUBLIQUE = "Selon l'AMCI, le français est la langue véhiculaire des établissements publics d'enseignement supérieur marocains, et son centre de langue propose aux étudiants non francophones une mise à niveau encadrée, validée par une attestation en fin d'année. La langue peut varier d'une filière à l'autre : vérifiez celle de la filière que vous visez.";
const SERVICES_MINISTERE = "Le ministère cite, parmi les services offerts aux étudiants internationaux, des « places pédagogiques à titre gracieux », une assurance médicale et un logement selon les places.";
const AMCI_BOURSIERS = "L'AMCI accorde des bourses du Royaume du Maroc aux étudiants étrangers, dans le cadre des accords de coopération avec leur pays, et indique que 85 % de ses étudiants africains sont boursiers.";

export const UNIVERSITIES = [

  // ---------------- Établissements publics : voie diplomatique (AMCI) ----------------

  {
    id: "universite-sidi-mohamed-ben-abdellah-fes",
    data: {
      name: "Université Sidi Mohamed Ben Abdellah",
      city: "Fès",
      province: "Fès-Meknès",
      country: "Maroc",
      image: "fes-medina-vue-d-en-haut.jpg",
      flag: "ma.svg",
      ranking: "Université publique de Fès, fondée en 1975",
      officialWebsite: "https://www.usmba.ac.ma/",
      applicationPortalUrl: "",
      voieAdmission: "voie_diplomatique_amci",
      fields: ["Sciences", "Lettres", "Sciences sociales", "Droit", "Commerce", "Médecine", "Ingénierie", "Informatique"],
      description: "Université publique créée en 1975 à Fès, l'une des plus anciennes du Maroc. Elle compte plus de 99 000 étudiants sur ses sites de Fès et de Taza, dans des domaines qui vont du droit à la médecine.",
      reconnaissance: "Université publique marocaine, créée par dahir du 17 octobre 1975.",
      exoneration: {
        politique: "possible_plafonnee",
        detail: `Les bourses des étudiants étrangers passent par l'AMCI, selon des quotas et les places disponibles. ${SERVICES_MINISTERE} À l'USMBA, un étudiant étranger admis a les mêmes avantages qu'un étudiant marocain, comme les prix d'excellence. La demande se fait avec le dossier, auprès de l'autorité de votre pays ou de l'ambassade du Maroc.`,
        source: MINISTERE,
        verifieLe: LE
      },
      admission: {
        procedure: "Vous ne candidatez pas auprès de l'université. Le dossier se dépose auprès de l'autorité de votre pays ou de l'ambassade du Maroc, puis l'AMCI le transmet au ministère marocain de l'Enseignement supérieur : un dossier que l'AMCI n'a pas transmis n'est pas étudié. Une fois autorisé sur la plateforme e-Cooperation, vous finalisez votre inscription sur admission.usmba.ac.ma, avec le profil « baccalauréat non marocain ».",
        conditions: "Le répertoire AMCI 2025-2026 cite à Fès la Faculté de médecine et de pharmacie, la Faculté des sciences, la faculté des sciences et techniques, la faculté de droit et d'économie, la faculté des lettres et l'EST.",
        calendrier: "Pour 2026-2027, la préinscription sur admission.usmba.ac.ma était ouverte du 17 août au 12 septembre 2026. La date qui compte d'abord est celle de l'ambassade ou de l'autorité de votre pays.",
        langue: `Aucun test de langue n'est demandé, mais une preuve de maîtrise de la langue d'enseignement peut l'être. ${LANGUE_PUBLIQUE}`,
        fraisDossier: "Aucun frais de dossier n'est publié par l'université.",
        sources: [
          "https://www.usmba.ac.ma/~usmba2/new/etudiants-etrangers/",
          "https://www.usmba.ac.ma/~usmba2/new/etudier-a-lusmba/",
          "https://admission.usmba.ac.ma/nouveau-etudiant",
          "https://admission.usmba.ac.ma/guide-d-inscription",
          "https://www.usmba.ac.ma/~usmba2/a-propos/nos-etablissements/",
          REPERTOIRE,
          MINISTERE,
          AMCI
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "universite-ibn-tofail-kenitra",
    data: {
      name: "Université Ibn Tofail",
      city: "Kénitra",
      province: "Rabat-Salé-Kénitra",
      country: "Maroc",
      image: "kenitra-avenue-mohammed-v.jpg",
      flag: "ma.svg",
      ranking: "#1201-1400 mondial (QS 2026)",
      officialWebsite: "https://www.uit.ac.ma/",
      applicationPortalUrl: "",
      voieAdmission: "voie_diplomatique_amci",
      fields: ["Médecine", "Lettres", "Sciences sociales", "Sciences", "Commerce", "Droit", "Ingénierie", "Informatique"],
      description: "Université publique créée en 1989 à Kénitra, à 40 km de Rabat, sur un campus situé dans la forêt de la Maâmora. Elle figure au classement mondial QS et enseigne en arabe, en français et en anglais.",
      langueEnseignement: "Arabe, français et anglais",
      reconnaissance: "Université publique marocaine, l'une des douze universités publiques du pays selon son site.",
      exoneration: {
        politique: "possible_plafonnee",
        detail: `L'université cite les bourses de l'AMCI parmi les bourses destinées aux étudiants étrangers : elles sont accordées dans le cadre de la coopération entre le Maroc et votre pays. ${SERVICES_MINISTERE} La demande se fait avec le dossier, auprès de l'autorité de votre pays ou de l'ambassade du Maroc.`,
        source: "https://www.uit.ac.ma/bourses/",
        verifieLe: LE
      },
      admission: {
        procedure: "L'université ne publie pas de procédure pour les candidats étrangers hors échange : son lien « Comment candidater à l'Université hors échange » ne mène à aucune page. La règle nationale s'applique donc : le dossier se dépose auprès de l'autorité de votre pays ou de l'ambassade du Maroc, l'AMCI le transmet au ministère, qui délivre l'autorisation d'inscription.",
        conditions: "Le répertoire AMCI 2025-2026 cite à Kénitra la faculté des sciences juridiques et politiques, la faculté des langues, des arts et des lettres, la faculté des sciences humaines et sociales, l'ENCG et l'EST.",
        calendrier: "Les préinscriptions en licence 2026-2027 sur le site de l'université sont closes : le calendrier est celui de l'été. Suivez celui de l'ambassade ou de l'autorité de votre pays.",
        langue: "Aucun test de langue n'est cité. Selon l'université, les cours se donnent en arabe, en français et en anglais.",
        fraisDossier: "Aucun frais de dossier n'est publié par l'université.",
        sources: [
          "https://iro.uit.ac.ma/mobilite-etudiants-uit/",
          "https://www.uit.ac.ma/bourses/",
          "https://www.uit.ac.ma/",
          REPERTOIRE,
          MINISTERE,
          AMCI
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "universite-mohammed-premier-oujda",
    data: {
      name: "Université Mohammed Premier",
      city: "Oujda",
      province: "Oriental",
      country: "Maroc",
      image: "oujda-bab-el-gharbi.jpg",
      flag: "ma.svg",
      ranking: "Université publique d'Oujda, fondée en 1978",
      officialWebsite: "https://www.ump.ma/",
      applicationPortalUrl: "",
      voieAdmission: "voie_diplomatique_amci",
      fields: ["Sciences", "Droit", "Sciences sociales", "Lettres", "Commerce", "Ingénierie", "Médecine", "Informatique"],
      description: "Université publique créée en 1978 à Oujda, dans l'Oriental, avec des établissements à Nador et à Berkane. Elle forme en sciences, droit, lettres, gestion, ingénierie, médecine et intelligence artificielle.",
      reconnaissance: "Université publique marocaine, créée en 1978.",
      exoneration: {
        politique: "possible_plafonnee",
        detail: `Selon l'université, l'AMCI accorde les bourses d'études aux étudiants étrangers, et le logement en cité universitaire est attribué à la demande de l'AMCI, dans la limite des places. ${SERVICES_MINISTERE} La demande se fait avec le dossier, auprès de l'autorité de votre pays ou de l'ambassade du Maroc.`,
        // Site injoignable le 2026-09-24 : lu dans la copie archivée.
        source: "https://web.archive.org/web/20260208052808/https://www.ump.ma/fr/vie-universitaire/etudiants-etrangers",
        verifieLe: LE
      },
      admission: {
        procedure: "Candidature par la voie diplomatique, dans le cadre de la coopération entre le Maroc et votre pays : l'AMCI transmet le dossier au ministère, qui délivre l'autorisation d'inscription. Un dossier que l'AMCI n'a pas transmis n'est pas étudié. Sur place, un bureau du CIOVE accueille et aide les étudiants étrangers.",
        conditions: "En licence, il faut le baccalauréat de l'année. Pour les écoles à accès régulé, il faut au moins la mention assez bien, et avoir moins de 20 ans pour l'ENSA, moins de 21 ans pour l'ENCG et moins de 22 ans pour l'EST. En master, il faut un diplôme de niveau bac+4 au moins ; en doctorat, un master ou un diplôme équivalent, avec l'avis favorable de l'établissement. Le répertoire AMCI 2025-2026 cite à Oujda la Faculté de médecine et de pharmacie, la Faculté des sciences, la faculté de droit et d'économie, la faculté des lettres, l'ENCG et l'EST.",
        langue: `Aucun test de langue n'est cité. ${LANGUE_PUBLIQUE}`,
        fraisDossier: "Aucun frais de dossier n'est publié par l'université.",
        // Le site était injoignable le 2026-09-24 : les pages ont été lues
        // dans leurs copies archivées du 8 février et du 20 avril 2026.
        sources: [
          "https://web.archive.org/web/20260208052808/https://www.ump.ma/fr/vie-universitaire/etudiants-etrangers",
          "https://web.archive.org/web/20260420193602/https://www.ump.ma/fr/luniversite/etablissements-de-lump-22",
          "https://web.archive.org/web/20260420193548/https://www.ump.ma/fr/luniversite",
          REPERTOIRE,
          MINISTERE,
          AMCI
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "universite-abdelmalek-essaadi-tetouan",
    data: {
      name: "Université Abdelmalek Essaâdi",
      city: "Tétouan",
      province: "Tanger-Tétouan-Al Hoceïma",
      country: "Maroc",
      image: "tetouan-ville-blanche.jpg",
      flag: "ma.svg",
      ranking: "Université publique fondée en 1989",
      officialWebsite: "https://www.uae.ac.ma/",
      applicationPortalUrl: "",
      voieAdmission: "voie_diplomatique_amci",
      fields: ["Sciences", "Lettres", "Sciences sociales", "Droit", "Commerce", "Ingénierie", "Informatique", "Médecine"],
      description: "Université publique créée en 1989, dont le siège est à Tétouan. Ses 17 établissements sont répartis entre Tétouan, Tanger, Larache, Ksar El Kébir et Al Hoceïma, dont une école de traduction à Tanger.",
      reconnaissance: "Université publique marocaine, créée par dahir du 23 octobre 1989.",
      exoneration: {
        politique: "possible_plafonnee",
        detail: `Les bourses du Royaume du Maroc sont attribuées par l'AMCI, dans le cadre de la coopération avec votre pays. ${SERVICES_MINISTERE} L'université a un Bureau des étudiants internationaux. La demande se fait avec le dossier, auprès de l'autorité de votre pays ou de l'ambassade du Maroc.`,
        source: MINISTERE,
        verifieLe: LE
      },
      admission: {
        procedure: "L'université ne décrit pas en ligne la candidature des étrangers. Comme pour les autres universités publiques, elle passe par la voie diplomatique : le dossier se dépose auprès de l'autorité de votre pays ou de l'ambassade du Maroc, puis l'AMCI le transmet au ministère. Son Bureau des étudiants internationaux a été créé avec la direction du ministère qui délivre les autorisations d'inscription. L'université accueillait 1 671 étudiants internationaux de 67 nationalités en 2023-2024.",
        conditions: "Dans les villes de l'université, le répertoire AMCI 2025-2026 cite notamment la faculté des lettres et la faculté Ossoul Addine à Tétouan ; la Faculté de médecine et de pharmacie, la faculté de droit et d'économie, la faculté des lettres, l'ENCG, l'École supérieure Roi Fahd de traduction et la faculté des sciences et techniques à Tanger ; la faculté des sciences et techniques à Al Hoceïma.",
        langue: `Aucun test de langue n'est cité. ${LANGUE_PUBLIQUE}`,
        fraisDossier: "Aucun frais de dossier n'est publié par l'université.",
        sources: [
          "https://www.uae.ac.ma/bureau-des-relations-internationales",
          "https://www.uae.ac.ma/etablissements",
          "https://www.uae.ac.ma/histoire",
          REPERTOIRE,
          MINISTERE,
          AMCI
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "universite-ibn-zohr-agadir",
    data: {
      name: "Université Ibn Zohr",
      city: "Agadir",
      province: "Souss-Massa",
      country: "Maroc",
      image: "agadir-plage-et-baie.jpg",
      flag: "ma.svg",
      ranking: "Université publique d'Agadir, fondée en 1989",
      officialWebsite: "https://www.uiz.ac.ma/",
      applicationPortalUrl: "",
      voieAdmission: "voie_diplomatique_amci",
      fields: ["Médecine", "Droit", "Sciences sociales", "Commerce", "Sciences", "Lettres", "Ingénierie", "Informatique"],
      description: "Université publique créée en 1989 à Agadir et présente dans 8 villes de 5 régions du Sud, avec plus de 138 000 étudiants. Elle compte notamment une école d'intelligence artificielle à Taroudant.",
      reconnaissance: "Université publique marocaine régie par la loi n° 01-00, créée en 1989.",
      exoneration: {
        politique: "possible_plafonnee",
        detail: `Les bourses du Royaume du Maroc sont attribuées par l'AMCI, dans le cadre de la coopération avec votre pays. L'université indique que le logement des étudiants étrangers en cité universitaire se demande via l'AMCI, dans la limite des places. ${SERVICES_MINISTERE}`,
        source: "https://www.uiz.ac.ma/logement-et-restauration",
        verifieLe: LE
      },
      admission: {
        procedure: "L'université ne publie pas de procédure pour les étrangers, et sa plateforme de préinscription n'a pas de profil pour un étudiant étranger. La règle nationale s'applique : le dossier se dépose auprès de l'autorité de votre pays ou de l'ambassade du Maroc, l'AMCI le transmet au ministère, qui délivre l'autorisation d'inscription.",
        conditions: "Le répertoire AMCI 2025-2026 cite à Agadir la Faculté de médecine et de pharmacie, la Faculté des sciences, la faculté de droit et d'économie, la faculté des lettres, la faculté des langues, des arts et des lettres, l'ENCG et l'EST.",
        calendrier: "Les préinscriptions 2026-2027 sur la plateforme de l'université étaient ouvertes en août et en septembre, sans profil pour un étudiant étranger. Votre calendrier est celui de l'ambassade ou de l'autorité de votre pays.",
        langue: `Aucun test de langue n'est cité. ${LANGUE_PUBLIQUE}`,
        fraisDossier: "Aucun frais de dossier n'est publié par l'université.",
        sources: [
          "https://www.uiz.ac.ma/logement-et-restauration",
          "https://preinscription.uiz.ac.ma/",
          "https://www.uiz.ac.ma/nos-etablissements",
          "https://www.uiz.ac.ma/mot-du-president",
          REPERTOIRE,
          MINISTERE,
          AMCI
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "universite-chouaib-doukkali-el-jadida",
    data: {
      name: "Université Chouaïb Doukkali",
      city: "El Jadida",
      province: "Casablanca-Settat",
      country: "Maroc",
      image: "el-jadida-theatre-mohamed-afifi.jpg",
      flag: "ma.svg",
      ranking: "Université publique fondée en 1985",
      officialWebsite: "https://www.ucd.ac.ma/",
      applicationPortalUrl: "",
      voieAdmission: "voie_diplomatique_amci",
      fields: ["Sciences", "Informatique", "Lettres", "Droit", "Sciences sociales", "Commerce", "Ingénierie"],
      description: "Université publique créée en 1985 à El Jadida avec deux facultés, sciences et lettres. Elle compte aujourd'hui neuf établissements, dont une école de commerce, une école d'ingénieurs et deux facultés ouvertes en 2026.",
      reconnaissance: "Université publique marocaine, créée en 1985.",
      exoneration: {
        politique: "possible_plafonnee",
        detail: `${AMCI_BOURSIERS} La demande de bourse se fait avec le dossier déposé par la voie diplomatique, pas auprès de l'université. Aucune exonération propre à l'université n'est publiée.`,
        source: AMCI,
        verifieLe: LE
      },
      admission: {
        procedure: "Avec un baccalauréat étranger, vous devez présenter une autorisation d'inscription délivrée par la division de la coopération du ministère de l'Enseignement supérieur. Elle s'obtient par la voie diplomatique : ambassade ou autorité de votre pays, puis AMCI, qui transmet le dossier au ministère.",
        conditions: "Le répertoire AMCI 2025-2026 cite à El Jadida la Faculté des sciences, la faculté de droit et d'économie, la faculté des lettres et l'ENCG, ainsi que l'EST de Sidi Bennour. Pour la Faculté des sciences, il demandait un bac C ou D de l'année avec mention, 12 sur 20 dans les matières de base et 23 ans au plus au 31 décembre.",
        langue: `Aucun test de langue n'est cité. ${LANGUE_PUBLIQUE}`,
        fraisDossier: "Aucun frais de dossier n'est publié par l'université.",
        sources: [
          "https://www.ucd.ac.ma/espace-etudiant/guide-de-letudiant/",
          "https://www.ucd.ac.ma/universite/presentation-de-lucd/",
          "https://www.ucd.ac.ma/universite/etablissements-de-lucd/",
          REPERTOIRE,
          AMCI
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "universite-moulay-ismail-meknes",
    data: {
      name: "Université Moulay Ismaïl",
      city: "Meknès",
      province: "Fès-Meknès",
      country: "Maroc",
      image: "meknes-remparts.jpg",
      flag: "ma.svg",
      ranking: "Université publique de Meknès, fondée en 1989",
      officialWebsite: "https://www.umi.ac.ma/",
      applicationPortalUrl: "",
      voieAdmission: "voie_diplomatique_amci",
      fields: ["Sciences", "Informatique", "Droit", "Sciences sociales", "Commerce", "Lettres", "Ingénierie", "Médecine"],
      description: "Université publique créée en 1989 à Meknès, avec un second pôle à Errachidia. Ses 10 établissements, dont une école d'ingénieurs et une faculté de médecine et de pharmacie à Errachidia, accueillent plus de 82 000 étudiants.",
      reconnaissance: "Université publique marocaine, créée par dahir le 23 octobre 1989.",
      exoneration: {
        politique: "possible_plafonnee",
        detail: `${AMCI_BOURSIERS} La demande de bourse se fait avec le dossier déposé par la voie diplomatique, pas auprès de l'université. Aucune exonération propre à l'université n'est publiée.`,
        source: AMCI,
        verifieLe: LE
      },
      admission: {
        procedure: "Pour un bachelier étranger, l'entrée passe par la voie diplomatique, puis par l'AMCI, qui transmet le dossier au ministère de l'Enseignement supérieur. Le service des relations internationales répond à relations.internationales@umi.ac.ma.",
        conditions: "Le répertoire AMCI 2025-2026 cite à Meknès la Faculté des sciences, la faculté de droit et d'économie, la faculté des lettres, l'ENCG et l'EST, et à Errachidia la faculté des sciences et techniques et la Faculté de médecine et de pharmacie. Pour la médecine, il demandait un bac C, D ou sciences agronomiques de l'année, une mention, 16 sur 20 dans les matières de base et 20 ans au plus au 31 décembre.",
        langue: `Aucun test de langue n'est cité. ${LANGUE_PUBLIQUE}`,
        fraisDossier: "Aucun frais de dossier n'est publié par l'université.",
        sources: [
          REPERTOIRE,
          "https://www.umi.ac.ma/a-propos/",
          "https://www.umi.ac.ma/offre-de-formation-initiale",
          "https://iro.umi.ac.ma/",
          AMCI
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "universite-hassan-premier-settat",
    data: {
      name: "Université Hassan Ier",
      city: "Settat",
      province: "Casablanca-Settat",
      country: "Maroc",
      image: "settat-monument-du-cheval.jpg",
      flag: "ma.svg",
      ranking: "Université publique de Settat, fondée en 1997",
      officialWebsite: "https://www.uh1.ac.ma/",
      applicationPortalUrl: "",
      voieAdmission: "voie_diplomatique_amci",
      fields: ["Ingénierie", "Sciences", "Informatique", "Médecine", "Droit", "Commerce", "Sciences sociales", "Lettres"],
      description: "Université publique créée en 1997 à Settat, avec une école d'ingénieurs à Berrechid et un institut du numérique et de l'intelligence artificielle. Elle couvre le droit, l'économie, la médecine, les sciences et les lettres.",
      reconnaissance: "Université publique marocaine, créée en 1997.",
      exoneration: {
        politique: "possible_plafonnee",
        detail: "Chaque année, le Maroc offre via l'AMCI des quotas de places, avec ou sans bourse, aux titulaires du baccalauréat. Seuls les candidats proposés officiellement à l'AMCI par la voie diplomatique sont examinés. L'AMCI indique que 85 % de ses étudiants africains sont boursiers. Aucune exonération propre à l'université n'est publiée.",
        source: "https://www.uh1.ac.ma/vie-estudiantine/vie-pratique/etudiants-etrangers/",
        verifieLe: LE
      },
      admission: {
        procedure: "L'inscription exige une autorisation du ministère de l'Enseignement supérieur. La candidature se présente par la voie diplomatique, puis l'AMCI transmet le dossier au ministère : un dossier que l'AMCI n'a pas transmis n'est pas pris en compte. Sur place, l'université a un Bureau de l'étudiant international.",
        conditions: "Le répertoire AMCI 2025-2026 cite à Settat la faculté des sciences et techniques et l'ENCG.",
        calendrier: "Les délais sont fixés chaque année par l'AMCI et communiqués par la voie diplomatique.",
        langue: `Aucun test de langue n'est cité. ${LANGUE_PUBLIQUE}`,
        fraisDossier: "Aucun frais de dossier n'est publié par l'université.",
        sources: [
          UH1_INTERNATIONAUX,
          "https://www.uh1.ac.ma/vie-estudiantine/vie-pratique/etudiants-etrangers/",
          "https://www.uh1.ac.ma/universite/histoire/histoire-de-luniversite-hassan-1er/",
          REPERTOIRE,
          AMCI
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "universite-sultan-moulay-slimane-beni-mellal",
    data: {
      name: "Université Sultan Moulay Slimane",
      city: "Béni Mellal",
      province: "Béni Mellal-Khénifra",
      country: "Maroc",
      image: "beni-mellal-vue-des-hauteurs.jpg",
      flag: "ma.svg",
      ranking: "Université publique fondée en 2007",
      officialWebsite: "https://www.usms.ac.ma/",
      applicationPortalUrl: "",
      voieAdmission: "voie_diplomatique_amci",
      fields: ["Lettres", "Sciences sociales", "Sciences", "Informatique", "Droit", "Commerce", "Ingénierie", "Médecine"],
      description: "Université publique créée en 2007, présente à Béni Mellal, Khouribga, Khénifra et Fquih Ben Salah. Elle compte deux écoles d'ingénieurs et une faculté de médecine et de pharmacie ouverte en 2023.",
      reconnaissance: "Université publique marocaine, créée en 2007.",
      exoneration: {
        politique: "possible_plafonnee",
        detail: `${AMCI_BOURSIERS} La demande de bourse se fait avec le dossier déposé par la voie diplomatique, pas auprès de l'université. Aucune exonération propre à l'université n'est publiée.`,
        source: AMCI,
        verifieLe: LE
      },
      admission: {
        procedure: "Le site de l'université n'a pas de page pour les étudiants étrangers. Pour un bachelier étranger, l'entrée passe par la voie diplomatique, puis par l'AMCI, qui transmet le dossier au ministère. Contact : contact@usms.ma.",
        conditions: "Le répertoire AMCI 2025-2026 cite à Béni Mellal la faculté des lettres, la faculté des sciences et techniques, la Faculté de médecine et de pharmacie, l'ENCG et l'EST, et des EST à Khénifra et à Fquih Ben Salah. Pour la médecine, il demandait un bac C, D ou sciences agronomiques de l'année, une mention, 16 sur 20 dans les matières de base et 20 ans au plus au 31 décembre.",
        langue: `Aucun test de langue n'est cité. ${LANGUE_PUBLIQUE}`,
        fraisDossier: "Aucun frais de dossier n'est publié par l'université.",
        sources: [
          REPERTOIRE,
          "https://www.usms.ac.ma/fr/node/151",
          "https://www.usms.ac.ma/en/node/137",
          "https://www.usms.ac.ma/en/node/209",
          AMCI
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "institut-agronomique-veterinaire-hassan-ii-rabat",
    data: {
      name: "Institut Agronomique et Vétérinaire Hassan II",
      city: "Rabat",
      province: "Rabat-Salé-Kénitra",
      country: "Maroc",
      image: "rabat-kasbah-des-oudayas.jpg",
      flag: "ma.svg",
      ranking: "Institut public fondé en 1966 à Rabat",
      officialWebsite: "https://iav.ac.ma/",
      applicationPortalUrl: "",
      voieAdmission: "voie_diplomatique_amci",
      fields: ["Agriculture", "Ingénierie"],
      description: "Établissement public créé en 1966 à Rabat, avec un campus à Agadir. Il forme des ingénieurs agronomes, des ingénieurs topographes et en agroalimentaire, ainsi que des docteurs vétérinaires.",
      reconnaissance: "Établissement public d'enseignement supérieur, créé par décret royal en 1966.",
      exoneration: {
        politique: "possible_plafonnee",
        detail: `${AMCI_BOURSIERS} La demande de bourse se fait avec le dossier déposé par la voie diplomatique, pas auprès de l'institut. L'institut ne publie aucune bourse ni exonération pour les étrangers.`,
        source: AMCI,
        verifieLe: LE
      },
      admission: {
        procedure: "Après le bac, un étudiant étranger entre par la voie diplomatique et l'AMCI, en année préparatoire, l'APESA. À la fin de l'APESA, le classement au mérite oriente vers l'agronomie, la topographie, l'agroalimentaire ou la médecine vétérinaire, qui accueille 40 à 50 étudiants par an. C'est le répertoire de l'AMCI, et non le site de l'institut, qui décrit cette voie.",
        conditions: "Le répertoire AMCI 2025-2026 demandait un bac scientifique de l'année, une mention très bien ou bien, 15 sur 20 de moyenne dans les matières de base et 20 ans au plus au 31 décembre. Avec un diplôme post-bac, un étranger peut aussi passer le concours passerelle du cycle ingénieur, avec son passeport.",
        calendrier: "En 2025, le dépôt pour le concours passerelle avait lieu du 1er au 15 juillet. Le calendrier 2026 de ce concours n'a pas pu être lu.",
        langue: LANGUE_PUBLIQUE,
        fraisDossier: "Aucun frais de dossier n'est indiqué, ni pour la voie AMCI, ni pour le concours passerelle.",
        sources: [
          REPERTOIRE,
          "https://iav.ac.ma/fr/cycle-preparatoire",
          "https://iav.ac.ma/fr/medecine-veterinaire",
          "https://iav.ac.ma/fr/concours-pour-lacces-en-1ere-annee-cycle-ingenieur-liav-hassan-ii-1",
          "https://www.iav.ac.ma/fr/presentation-du-systeme-academique-a-l-iav",
          AMCI
        ],
        verifieLe: LE
      }
    }
  },

  // ---------------- Établissements reconnus par l'État : candidature directe ----------------

  {
    id: "universite-internationale-de-rabat",
    data: {
      name: "Université Internationale de Rabat",
      city: "Rabat-Salé",
      province: "Rabat-Salé-Kénitra",
      country: "Maroc",
      image: "rabat-sale-marina-du-bouregreg.jpg",
      flag: "ma.svg",
      ranking: "Partenariat public-privé, reconnue par l'État",
      officialWebsite: "https://www.uir.ac.ma/fr",
      applicationPortalUrl: "https://candidature.uir.ac.ma/fr",
      fields: ["Ingénierie", "Informatique", "Architecture", "Commerce", "Droit", "Sciences sociales", "Médecine"],
      description: "Première université marocaine créée en partenariat avec l'État, ouverte en 2010-2011 et reconnue par l'État depuis 2016. Les cours sont en français et en anglais, avec plusieurs doubles diplômes.",
      langueEnseignement: "Français et anglais",
      reconnaissance: "Partenariat public-privé : première université marocaine créée en partenariat avec l'État. Reconnue par l'État en 2016 par la Commission nationale de coordination de l'enseignement supérieur, reconnaissance renouvelée en 2019 au titre de la loi 01-00 : ses diplômes sont équivalents aux diplômes nationaux.",
      fraisScolarite: {
        source: "https://www.uir.ac.ma/upload/media/6a579f91db432270634306.pdf",
        verifieLe: LE,
        note: "Catalogue officiel des formations post-bac 2026-2027. Une seule grille, sans tarif distinct pour les étrangers. Frais de formation par an : licence en droit des affaires, Sciences Po Rabat, sciences sociales et psychologie 62 000 DH ; ingénierie 66 000 DH ; International Program in Management de Rabat Business School 70 000 DH ; International Talents in Business 120 000 DH ; architecture 85 000 DH ; médecine dentaire 110 000 DH ; médecine 120 000 DH ; licences paramédicales 33 000 DH. En plus : 10 000 DH de frais d'inscription, 3 000 DH en paramédical, non remboursables. Les frais couvrent l'enseignement, le sport et les cours de langues optionnels, pas le logement, la restauration ni le transport. Montant retenu : 62 000 DH, la licence en droit ou en sciences sociales. Les frais des masters ne sont pas publiés.",
        licence: { montant: 62000, devise: "MAD", periode: "an" }
      },
      exoneration: {
        politique: "possible_plafonnee",
        detail: "L'UIR accorde des bourses partielles ou totales sur critères d'excellence et sociaux, avec un guide du boursier propre aux étudiants internationaux. En première année, il faut avoir eu le bac l'année même avec au moins 12 sur 20 ; pour un bac étranger, c'est la moyenne générale qui compte. La demande se fait après l'inscription, sur la plateforme des bourses ouverte le 23 juin 2026 pour 2026-2027. À l'inscription, le candidat boursier paie les frais d'inscription et remet deux titres de paiement couvrant toute la scolarité.",
        source: "https://www.uir.ac.ma/upload/media/6a33f7f03ebae117048999.pdf",
        verifieLe: LE
      },
      admission: {
        procedure: "Candidature entièrement en ligne depuis votre pays : vous créez un compte sur la plateforme de candidature, choisissez vos filières et payez les frais de concours. Suivent l'étude du dossier, puis une épreuve écrite ou un entretien selon la filière. Une fois admis, vous complétez l'inscription dans votre espace candidat et prenez un rendez-vous obligatoire sur place. Si un visa est exigé, l'UIR fournit les documents après l'inscription.",
        conditions: "Votre baccalauréat étranger doit être reconnu équivalent : l'UIR publie un guide d'équivalence.",
        calendrier: "Les inscriptions 2026-2027 sont ouvertes. Les dates des sessions de concours sont publiées en image sur le site, sans version texte.",
        langue: "Selon la filière, le concours comprend un test de français et d'anglais. La licence de psychologie demande au moins le niveau B1 en français.",
        fraisDossier: "Frais de concours : 750 DH pour deux concours, 1 500 DH pour plusieurs concours, non remboursables, payables en ligne.",
        sources: [
          "https://www.uir.ac.ma/fr/page/guide-des-etudiants-internationaux",
          "https://www.uir.ac.ma/fr/page/procedure-dinscription",
          "https://www.uir.ac.ma/fr/page/candidats-bacheliers",
          "https://www.uir.ac.ma/fr/page/frais-de-concours-1",
          "https://www.uir.ac.ma/fr/page/un-modele-denseignement-superieur-innovant"
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "universite-euromed-de-fes",
    data: {
      name: "Université Euromed de Fès",
      city: "Fès",
      province: "Fès-Meknès",
      country: "Maroc",
      image: "fes-tanneries-chouara.jpg",
      flag: "ma.svg",
      ranking: "Reconnue par l'État depuis 2018",
      officialWebsite: "https://ueuromed.org/fr",
      applicationPortalUrl: "https://candidature.ueuromed.org/",
      fields: ["Ingénierie", "Informatique", "Architecture", "Commerce", "Droit", "Sciences sociales", "Lettres", "Médecine"],
      description: "Université d'utilité publique à but non lucratif, labellisée par l'Union pour la Méditerranée et reconnue par l'État depuis 2018. Selon sa brochure, environ la moitié des cours sont en anglais.",
      langueEnseignement: "Français et anglais",
      reconnaissance: "Reconnue par l'État par le décret n° 2.17.745 du 4 janvier 2018, complété par le décret n° 2.21.649 du 25 janvier 2022. Institution d'utilité publique à but non lucratif, sous forme de fondation.",
      fraisScolarite: {
        source: "https://ueuromed.org/fr/tarification-et-reduction",
        verifieLe: LE,
        note: "Grille officielle 2026-2027 des nouveaux inscrits, en dirhams, sans tarif distinct pour les étrangers. Chaque total annuel comprend 5 000 DH de frais d'inscription et se paie en trois tranches, avant le 2 septembre, le 31 décembre et le 31 mars. Licence en sciences humaines, droit et science politique 60 700 DH ; licence d'architecture et design 55 700 DH ; classes préparatoires d'ingénieur 65 700 DH ; cycle ingénieur et diplôme d'architecte 75 700 DH ; Euromed Business School 60 700 DH en prépa puis 75 700 DH ; médecine, pharmacie et dentaire 111 500 DH les deux premières années puis 126 500 DH ; licences paramédicales 32 700 à 45 700 DH ; masters 60 700 DH, 75 700 DH à l'école de commerce. En plus : 1 020 DH de frais divers pour l'assurance, la reprographie et les activités. Réduction de 5 % pour les non-boursiers qui paient tout avant le 2 septembre 2026. Doctorat : exemption totale des frais de scolarité pour tous les doctorants, selon la page des bourses ; les autres frais du doctorat ne sont pas publiés. Montants retenus : licence 60 700 DH, master 60 700 DH.",
        licence: { montant: 60700, devise: "MAD", periode: "an" },
        master: { montant: 60700, devise: "MAD", periode: "an" }
      },
      exoneration: {
        politique: "possible_plafonnee",
        detail: "L'UEMF accorde des bourses de 25 %, 50 %, 75 % et jusqu'à 100 % des frais, attribuées par une commission sur dossier académique et social, pour un an renouvelable. La bourse « Afrique » vise les excellents étudiants subsahariens à revenus modestes, et l'université annonce une bourse spéciale pour les étudiants internationaux, sans en publier le montant. Tous les doctorants sont exemptés des frais de scolarité et peuvent recevoir une bourse de subsistance de 5 000 à 8 000 DH nets par mois au minimum. La demande se fait en ligne après l'inscription.",
        source: "https://ueuromed.org/fr/bourses-aides-financieres",
        verifieLe: LE
      },
      admission: {
        procedure: "Candidature en ligne sur la plateforme de l'université : choix du programme, puis dossier avec photo, passeport, relevés de notes du bac et, pour une admission après le bac, relevés post-bac et attestation d'équivalence des diplômes étrangers. Une fois admis, vous vous inscrivez en ligne, demandez l'attestation définitive d'inscription, puis le visa « études » au consulat du Maroc de votre pays. La carte de séjour se demande à l'arrivée.",
        calendrier: "La première tranche des frais est due avant le 2 septembre. L'université ne publie pas de calendrier de candidature.",
        langue: "Aucun test de langue n'est publié. La licence Language, Communication and Skills est enseignée principalement en anglais.",
        fraisDossier: "Frais de concours : 700 DH pour les pôles ingénierie et architecture et sciences humaines et sociales, payés seulement en cas d'admission, à l'inscription ; 1 500 DH pour la médecine, la médecine dentaire et la pharmacie, payés avant le concours.",
        sources: [
          "https://ueuromed.org/fr/etudier-a-l-euromed",
          "https://ueuromed.org/fr/dossier-de-candidature",
          "https://ueuromed.org/fr/admissions-internationales",
          "https://ueuromed.org/fr/tarification-et-reduction",
          "https://old.ueuromed.org/sites/default/files/upload/files/uemf_-complement-ndeg2du-decret-reconnaissance-2022.pdf"
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "universite-internationale-de-casablanca",
    data: {
      name: "Université Internationale de Casablanca",
      city: "Casablanca",
      province: "Casablanca-Settat",
      country: "Maroc",
      image: "casablanca-centre-ville-vu-d-en-haut.jpg",
      flag: "ma.svg",
      ranking: "Université privée reconnue par l'État",
      officialWebsite: "https://uic.ac.ma/",
      applicationPortalUrl: "https://uic.ac.ma/formation-initiale/",
      fields: ["Médecine", "Architecture", "Ingénierie", "Commerce", "Droit"],
      description: "Université privée ouverte en 2010 à Casablanca et reconnue par l'État en 2017 : ses diplômes ont une équivalence automatique avec les diplômes nationaux. Son école de commerce propose aussi des parcours en anglais.",
      reconnaissance: "Université privée reconnue par l'État depuis 2017 : ses diplômés obtiennent une équivalence automatique avec les diplômes nationaux et peuvent entrer dans la fonction publique. Le numéro du décret n'est pas cité sur ses pages.",
      exoneration: {
        politique: "possible_plafonnee",
        detail: "L'UIC attribue chaque année aux nouveaux étudiants des aides qui couvrent une partie des frais de scolarité, s'ils remplissent à la fois des critères sociaux et d'excellence. Le paiement peut aussi être étalé par trimestre. Les boursiers de l'Agence nationale des bourses du Gabon ont une procédure d'admission simplifiée, grâce à un accord signé en 2018. Aucune bourse réservée aux étudiants subsahariens n'est décrite, et le taux des aides n'est pas publié.",
        source: "https://uic.ac.ma/aide-financiere-et-financement-des-etudes/",
        verifieLe: LE
      },
      admission: {
        procedure: "Candidature en ligne sur la page Formation initiale, puis envoi par courriel du dossier de candidature des étudiants internationaux au service des admissions internationales. Suivent un entretien d'orientation, un test d'admission et un entretien oral, sur place ou à distance, puis la lettre d'admission. Un bureau d'accompagnement des étudiants internationaux aide pour le logement et le transport.",
        calendrier: "Les inscriptions 2026-2027 sont ouvertes. Les dates des concours sont publiées en image sur le site, sans version texte.",
        langue: "L'université ne publie aucune exigence de test de langue.",
        fraisDossier: "Test d'admission : 500 DH, payés le jour du test, selon la grille 2022-2023. Frais d'inscription : 5 000 DH.",
        coutIndicatif: "La grille des frais 2026-2027 ne s'ouvre pas en ligne. La dernière grille lisible, celle de 2022-2023 pour l'école de commerce, annonçait 64 000 DH par an en licence de management, 72 000 DH en licence de commerce international, 80 000 DH pour le BBA en anglais et de 72 000 à 82 000 DH en master, plus 5 000 DH d'inscription et 1 100 DH d'assurance médicale. Les tarifs de médecine, d'architecture et d'ingénierie n'y figurent pas. Demandez la grille à jour à l'université avant de décider.",
        sources: [
          "https://www.uic.ac.ma/etudiants-internationaux",
          "https://uic.ac.ma/etape-dadmission-formation-initiale/",
          "https://uic.ac.ma/frais-de-scolarite/",
          "https://www.uic.ac.ma/wp-content/uploads/2023/01/Fiche-tarifs-2022-23-UIC-Casablanca-Business-school.pdf",
          "https://www.uic.ac.ma/actualite/luic-obtient-la-reconnaissance-de-letat-et-devient-universite-reconnue-par-letat"
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "universite-mohammed-vi-des-sciences-et-de-la-sante-casablanca",
    data: {
      name: "Université Mohammed VI des Sciences et de la Santé",
      city: "Casablanca",
      province: "Casablanca-Settat",
      country: "Maroc",
      image: "casablanca-quartier-des-habous.jpg",
      flag: "ma.svg",
      ranking: "Université de santé reconnue par l'État",
      officialWebsite: "https://fm6ss.ma/fr/um6ss",
      applicationPortalUrl: "https://um6ss.konosys.com/konosys_um6ss_concours/LoginCreate.aspx",
      fields: ["Médecine", "Ingénierie", "Informatique", "Sciences"],
      description: "Université d'utilité publique à but non lucratif créée en 2014, qui relève de la Fondation Mohammed VI des Sciences et de la Santé. Ses diplômes sont reconnus par l'État depuis 2017, et la médecine s'y étudie en français ou en anglais.",
      langueEnseignement: "Français et anglais",
      reconnaissance: "Reconnue par l'État depuis 2017, par le décret 2.17.325 : ses diplômes sont équivalents à ceux des universités publiques. Institution d'utilité publique à but non lucratif relevant de la Fondation Mohammed VI des Sciences et de la Santé.",
      fraisScolarite: {
        source: "https://fm6ss.ma/fr/um6ss/admission",
        verifieLe: LE,
        note: "Grille officielle publiée sur la page Admission, sans année indiquée et sans tarif distinct pour les étrangers. Frais annuels : doctorat en médecine, en médecine dentaire ou en pharmacie 130 000 DH ; médecine vétérinaire 105 000 DH ; licences en soins infirmiers et professions de santé 33 000 à 59 000 DH ; licences en ingénierie biomédicale, logistique hospitalière et informatique décisionnelle 39 000 DH ; classes préparatoires intégrées 52 000 DH ; cycle ingénieur d'État 55 000 DH ; masters 45 000 à 50 400 DH. En plus : 1 500 DH de première inscription, et 400 DH d'assurance si l'étudiant n'est pas couvert par ses parents. Le campus de Dakhla est moins cher après subvention, par exemple 90 000 DH pour la médecine. Montants retenus : licence 33 000 DH, infirmier polyvalent ; master 45 000 DH. Le doctorat en médecine est un diplôme d'exercice, pas un doctorat de recherche : il n'est pas classé au niveau doctorat ici.",
        licence: { montant: 33000, devise: "MAD", periode: "an" },
        master: { montant: 45000, devise: "MAD", periode: "an" }
      },
      exoneration: {
        politique: "inconnue",
        detail: "L'UM6SS propose des bourses de mérite et sur critères sociaux, de 5 % à 100 % du reste à payer, et des aides aux fratries de 10 à 15 %. Aucune bourse réservée aux étudiants internationaux n'est décrite : la bourse d'excellence exige un bac obtenu au Maroc, et le dossier social demande surtout des pièces marocaines. Renseignez-vous auprès du Bureau international avant de compter sur une aide.",
        source: "https://fm6ss.ma/fr/um6ss/bourses-et-aides-financieres",
        verifieLe: LE
      },
      admission: {
        procedure: "Le Bureau international accompagne les candidats étrangers. Vous remplissez une préinscription en ligne et créez un compte sur la plateforme de candidature, qui accepte le bac étranger. Dossier : copie du passeport, relevés de notes du bac, attestation de réussite ou diplôme, lettre de motivation adressée au doyen ou au directeur. L'université aide à créer le compte d'équivalence du bac auprès des ministères et à préparer le dossier de visa.",
        conditions: "La médecine, la médecine dentaire, la médecine vétérinaire et la pharmacie passent par un concours d'accès ; l'ingénierie, les licences et les masters par un test écrit ou oral.",
        langue: "La médecine existe en filière francophone et en filière anglophone. Aucun test de langue n'est publié.",
        fraisDossier: "Aucun frais de concours ni de dossier n'est publié. Seuls les 1 500 DH de première inscription sont indiqués.",
        sources: [
          "https://fm6ss.ma/fr/um6ss/etudiant-international",
          "https://fm6ss.ma/fr/um6ss/admission",
          "https://fm6ss.ma/fr/um6ss/a-propos",
          "https://fm6ss.ma/fr/um6ss/bourses-et-aides-financieres"
        ],
        verifieLe: LE
      }
    }
  }

];

// Les dix établissements publics : la bourse AMCI, déjà en base, au
// niveau Licence (voir l'en-tête). La langue du programme n'est pas
// posée : elle n'est vérifiée que pour Ibn Tofail.
export const LINKS = [
  {
    scholarshipId: "bourse-gouvernement-maroc-amci",
    pays: "Maroc",
    universityIds: [
      "universite-sidi-mohamed-ben-abdellah-fes",
      "universite-ibn-tofail-kenitra",
      "universite-mohammed-premier-oujda",
      "universite-abdelmalek-essaadi-tetouan",
      "universite-ibn-zohr-agadir",
      "universite-chouaib-doukkali-el-jadida",
      "universite-moulay-ismail-meknes",
      "universite-hassan-premier-settat",
      "universite-sultan-moulay-slimane-beni-mellal",
      "institut-agronomique-veterinaire-hassan-ii-rabat"
    ],
    niveaux: ["Licence"],
    motif: "bourse d'affectation par la voie diplomatique, valable dans les établissements publics ; le répertoire AMCI 2025-2026, relu le 2026-09-24, liste des établissements de chacun des dix, et c'est celui des bacheliers"
  }
];

// Le lot refuse de se charger si une photo déclarée n'existe pas
// (incident du lot 35).
const manquants = UNIVERSITIES
  .map((u) => u.data.image)
  .filter((f) => f && !existsSync(`assets/images/cities/${f.replace(/\.jpg$/, "")}-1600w.avif`))
  .map((f) => `cities/${f}`);

if (manquants.length) {
  throw new Error(`Lot 76 : ${manquants.length} photo(s) absente(s) — lancer d'abord \`node scripts\\add-lot76-photos.mjs\` :\n  ${manquants.join("\n  ")}`);
}
